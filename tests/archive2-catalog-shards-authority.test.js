'use strict';
// Catalog shards, stage 2-1: the authority. A screen that holds only some shards must judge every record it holds exactly as the screen
// that holds the whole bundle does (Archive2Core.basicEligibility / advancedEligible -> validateBasicAssignment / validateAdvancedAssignment
// read canonicalAuthority). These tests run on the real inputs (the same loader and resolver the screens run) and fix no counts: they
// compare results, and they fail when a validator starts reading an assignment key, or a screen starts reading an authority table, that
// the shards do not carry.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-catalog-shards.mjs')).href);
const core = require(path.join(root, 'archive/archive2-core.js'));
const canonical = require(path.join(root, 'archive/archive2-canonical.js'));
const shared = require(path.join(root, 'archive/archive2-catalog-shards.js'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

let builtOnce = null;
const built = async () => {
  if (!builtOnce) builtOnce = lib().then((m) => m.buildCatalogShards(root));
  return builtOnce;
};
const docOf = (files, shard) => JSON.parse(files.get(shard.path).toString('utf8'));
const results = (record, authority) => ({
  basic: canonical.validateBasicAssignment(record, authority),
  advanced: canonical.validateAdvancedAssignment(record, authority),
  basicEligible: core.basicEligibility(record, { canonicalAuthority: authority }),
  advancedEligible: core.advancedEligible(record, { canonicalAuthority: authority }),
});

test('the index names the common file and every shard carries its authority part', async () => {
  const { index, files } = await built();
  assert.equal(index.authoritySchema, 'archive2-catalog-shard-authority-v1');
  const common = files.get(index.common.path);
  assert.ok(common, 'the common file is built');
  assert.equal(sha256(common), index.common.sha256);
  assert.equal(common.length, index.common.bytes);
  const parsed = JSON.parse(common.toString('utf8'));
  assert.equal(parsed.schemaVersion, 'archive2-catalog-common-v1');
  assert.equal(parsed.indexVersion, index.indexVersion);
  assert.equal(parsed.identityDigest, index.catalogIdentityDigest);
  for (const shard of index.shards) {
    const doc = docOf(files, shard);
    assert.equal(doc.schemaVersion, 'archive2-catalog-shard-v2');
    assert.equal(doc.authority.schemaVersion, 'archive2-catalog-shard-authority-v1');
    // the part belongs to this shard: its exams are the exams the index puts here
    const expected = Object.entries(index.examShard).filter(([, key]) => key === shard.key).map(([file]) => file).sort();
    assert.deepEqual(doc.authority.exams.map((exam) => exam.file).sort(), expected, `exams of ${shard.key}`);
    const uids = new Set(doc.records.map((record) => record.questionUid));
    for (const uid of Object.keys(doc.authority.assignments)) assert.ok(uids.has(uid), `an assignment of another shard is in ${shard.key}`);
    for (const uid of [...doc.authority.advancedSame, ...Object.keys(doc.authority.advancedOwn)]) assert.ok(uids.has(uid));
  }
});

test('with one shard, with all shards, and with any pair: every record gets the same eligibility result as with the whole authority', async () => {
  const { index, files, catalog } = await built();
  const full = catalog.canonicalAuthority;
  const fullByUid = new Map(catalog.records.map((record) => [record.questionUid, record]));
  const docs = index.shards.map((shard) => docOf(files, shard));
  const stats = { basicOk: 0, basicNo: 0, advancedOk: 0, advancedNo: 0, records: 0 };
  const check = (authority, doc, label) => {
    for (const record of doc.records) {
      const want = results(fullByUid.get(record.questionUid), full);
      const got = results(record, authority);
      assert.deepEqual(got.basic, want.basic, `validateBasicAssignment ${label} ${record.questionUid}`);
      assert.deepEqual(got.advanced, want.advanced, `validateAdvancedAssignment ${label} ${record.questionUid}`);
      assert.deepEqual(got.basicEligible, want.basicEligible, `basicEligibility ${label} ${record.questionUid}`);
      assert.equal(got.advancedEligible, want.advancedEligible, `advancedEligible ${label} ${record.questionUid}`);
      stats.records += 1;
      stats[want.basicEligible.ok ? 'basicOk' : 'basicNo'] += 1;
      stats[want.advancedEligible ? 'advancedOk' : 'advancedNo'] += 1;
    }
  };
  for (const doc of docs) check(shared.assembleAuthority(JSON.parse(files.get(index.common.path).toString('utf8')), [doc]), doc, `[${doc.key} alone]`);
  const common = JSON.parse(files.get(index.common.path).toString('utf8'));
  const all = shared.assembleAuthority(common, docs);
  for (const doc of docs) check(all, doc, '[all shards]');
  if (docs.length > 1) {
    const pair = shared.assembleAuthority(common, [docs[0], docs[docs.length - 1]]);
    check(pair, docs[0], `[${docs[0].key}+${docs[docs.length - 1].key}]`);
    check(pair, docs[docs.length - 1], `[${docs[0].key}+${docs[docs.length - 1].key}]`);
  }
  // the comparison must have teeth: both outcomes occur, so a validator that always says yes (or no) would be caught
  assert.ok(stats.basicOk > 0 && stats.basicNo > 0, `basic: ${JSON.stringify(stats)}`);
  assert.ok(stats.advancedOk > 0 && stats.advancedNo > 0, `advanced: ${JSON.stringify(stats)}`);
  // and the tables the validators read are the same, entry by entry, for every uid the shards cover
  for (const doc of docs) {
    for (const exam of doc.authority.exams) assert.equal(all.examGradeByFile[exam.file], full.examGradeByFile[exam.file], `examGradeByFile ${exam.file}`);
    for (const record of doc.records) assert.deepEqual(all.identityByUid[record.questionUid], full.identityByUid[record.questionUid], `identity of ${record.questionUid}`);
  }
});

test('a question of a shard that was not loaded is never silently accepted', async () => {
  const { index, files, catalog } = await built();
  assert.ok(index.shards.length > 1);
  const common = JSON.parse(files.get(index.common.path).toString('utf8'));
  const fullByUid = new Map(catalog.records.map((record) => [record.questionUid, record]));
  const docs = index.shards.map((shard) => docOf(files, shard));
  const [here, other] = [docs[0], docs[docs.length - 1]];
  const authority = shared.assembleAuthority(common, [here]);
  assert.deepEqual([...authority.shardCoverage.shards], [here.key]);
  let accepted = 0;
  for (const record of other.records) {
    assert.equal(authority.shardCoverage.has(record.questionUid), false, 'the coverage says this question is not covered');
    const basic = canonical.validateBasicAssignment(record, authority);
    const advanced = canonical.validateAdvancedAssignment(record, authority);
    assert.equal(basic.ok, false, `a question outside the loaded shards passed validateBasicAssignment: ${record.questionUid}`);
    assert.equal(advanced.ok, false);
    assert.equal(core.basicEligibility(record, { canonicalAuthority: authority }).ok, false);
    assert.equal(core.advancedEligible(record, { canonicalAuthority: authority }), false);
    if (core.basicEligibility(fullByUid.get(record.questionUid), { canonicalAuthority: catalog.canonicalAuthority }).ok) accepted += 1;
  }
  assert.ok(accepted > 0, 'the other shard has questions the whole bundle accepts, so the rejection above is a real difference');
  for (const record of here.records.slice(0, 50)) assert.equal(authority.shardCoverage.has(record.questionUid), true);
});

test('the assembled catalog has the same lists as the whole catalog, for every key a screen reads', async () => {
  const { index, files, catalog, entries } = await built();
  const common = JSON.parse(files.get(index.common.path).toString('utf8'));
  const docs = index.shards.map((shard) => docOf(files, shard));
  const assembled = shared.assembleCatalog(index, common, docs);
  const m = await lib();
  const excluded = new Set([...m.COMMON_CATALOG_EXCLUDED_KEYS, ...m.AUTHORITY_UNUSED_CATALOG_KEYS, 'health']);
  for (const key of Object.keys(catalog)) {
    if (excluded.has(key)) continue;
    assert.deepEqual(assembled[key], catalog[key], `catalog.${key}`);
  }
  // all shards assembled give the whole catalog's lists in the whole catalog's order (a list built from some shards is in that order too)
  assert.deepEqual(assembled.records.map((r) => r.questionUid), catalog.records.map((r) => r.questionUid));
  assert.deepEqual(assembled.exams.map((e) => e.file), catalog.exams.map((e) => e.file));
  assert.equal(assembled.records.length, catalog.records.length);
  assert.equal(new Set(assembled.records.map((r) => r.questionUid)).size, catalog.records.length);
  const byFile = (rows, key) => JSON.stringify([...rows].sort((a, b) => (key(a) < key(b) ? -1 : 1)));
  assert.equal(byFile(assembled.exams, (e) => e.file), byFile(catalog.exams, (e) => e.file), 'every exam, once, with all its values');
  assert.equal(byFile(assembled.sourceHashes, (e) => e[0]), byFile(catalog.sourceHashes, (e) => e[0]), 'every source hash, once');
  assert.deepEqual(assembled.basicScopeLinks, []);
  // health: the numbers the browser computes after resolveCatalog, computed once for the whole catalog
  let automatic = 0;
  const reasons = {};
  for (const record of catalog.records) {
    const result = core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority });
    if (result.ok) automatic += 1;
    for (const reason of result.reasons) reasons[reason] = (reasons[reason] || 0) + 1;
  }
  assert.equal(assembled.health.automatic, automatic);
  assert.deepEqual(assembled.health.exclusionReasons, reasons);
  // the version string a screen sends to the server is the one of the whole bundle
  assert.equal(assembled.indexVersion, catalog.indexVersion);
  assert.equal(assembled.identityDigest, catalog.identityDigest);
  assert.ok(entries.some((entry) => entry.path.endsWith('/common.json')));
  // a shard or common file from another release is refused
  assert.throws(() => shared.assembleCatalog({ ...index, indexVersion: 'archive2-canonical-v1:' + '0'.repeat(64) }, common, docs), /another release/);
});

test('the PT/TPL labels in the common file are the ACTIVE labels the browser builds', async () => {
  const { index, files } = await built();
  const common = JSON.parse(files.get(index.common.path).toString('utf8'));
  const registry = JSON.parse(read('archive/data/meta-foundation/compiled/taxonomy_registry.json'));
  const problemTypes = Object.fromEntries(registry.problemTypes.filter((row) => row.status === 'ACTIVE').map((row) => [row.problemTypeKey, row.canonicalLabelKo]));
  const templates = Object.fromEntries(registry.templates.filter((row) => row.status === 'ACTIVE').map((row) => [row.templateKey, { label: row.canonicalLabelKo, parentProblemTypeKey: row.parentProblemTypeKey }]));
  assert.deepEqual(common.labels, { problemTypes, templates });
});

// ---- what the validators and screens read: kept honest by scanning the code --------------------------------------------------
const functionSource = (source, name) => {
  const start = source.indexOf(`function ${name}(`);
  assert.ok(start >= 0, `function ${name} exists`);
  let depth = 0;
  for (let i = source.indexOf('{', source.indexOf(')', start)); i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    else if (source[i] === '}') { depth -= 1; if (depth === 0) return source.slice(start, i + 1); }
  }
  throw new Error(`function ${name} is not closed`);
};

test('the validators read no assignment key the shards cut away', async () => {
  const m = await lib();
  const source = read('archive/archive2-canonical.js');
  const body = ['validateBasicAssignment', 'validateAdvancedAssignment', 'assignmentEvidencePasses', 'evidencePasses'].map((name) => functionSource(source, name)).join('\n');
  const kept = new Set(m.AUTHORITY_ASSIGNMENT_FIELDS);
  const keptEvidence = new Set(m.AUTHORITY_REVIEW_EVIDENCE_FIELDS);
  const keptTemplate = new Set(m.AUTHORITY_TEMPLATE_FIELDS);
  const reads = (variable) => [...body.matchAll(new RegExp(`(?<![A-Za-z0-9_$.])${variable}\\??\\.([A-Za-z0-9_$]+)`, 'g'))].map((match) => match[1]);
  // assignment rows: `assignment` (one row of assignmentsByUid), `row` (a row of advancedAssignmentsByUid), `matches` -> `assignment`
  // (`row` is also the name of a canonicalAdvancedPaths row further down; only the filter over advancedAssignmentsByUid is an assignment row)
  const filterStart = body.indexOf('const matches = list.filter');
  const filterEnd = body.indexOf('if (matches.length !== 1)');
  assert.ok(filterStart > 0 && filterEnd > filterStart, 'the advanced assignment filter is where this test expects it');
  const filterBody = body.slice(filterStart, filterEnd);
  const rowReads = [...filterBody.matchAll(/(?<![A-Za-z0-9_$.])row\??\.([A-Za-z0-9_$]+)/g)].map((match) => match[1]);
  assert.ok(rowReads.length > 3);
  for (const key of [...reads('assignment'), ...rowReads]) assert.ok(kept.has(key) || ['length'].includes(key), `validators read assignment.${key}, which the shard authority does not carry (add it to AUTHORITY_ASSIGNMENT_FIELDS)`);
  for (const key of reads('evidence')) assert.ok(keptEvidence.has(key), `evidencePasses reads evidence.${key}`);
  for (const key of reads('template')) assert.ok(keptTemplate.has(key), `validators read template.${key}`);
  // reviewEvidence keys read through assignment.reviewEvidence.<key>
  for (const match of body.matchAll(/reviewEvidence\??\.([A-Za-z0-9_$]+)/g)) assert.ok(keptEvidence.has(match[1]), `reviewEvidence.${match[1]}`);
  // and the authority properties the validators use are exactly the ones assembleAuthority builds
  const authorityProps = new Set([...body.matchAll(/authority\??\.([A-Za-z0-9_$]+)/g)].map((match) => match[1]));
  const built = shared.assembleAuthority(
    { schemaVersion: 'archive2-catalog-common-v1', authority: { problemTypeKeys: [], bindingKeys: [] }, catalog: {} }, []);
  for (const prop of authorityProps) assert.ok(Object.hasOwn(built, prop), `validators read authority.${prop}, which assembleAuthority does not build`);
});

const SKIP_DIRS = new Set(['exams', 'data', 'assets', 'generated', 'vendor', 'tools', '_generated', 'node_modules', 'worker-backup', 'fixtures', 'evidence', 'prototypes', 'docs', 'textbook', 'images', 'generated-lite']);
function screenFiles() {
  const out = [];
  const walk = (rel) => {
    const abs = path.join(root, rel);
    const stat = fs.statSync(abs, { throwIfNoEntry: false });
    if (!stat) return;
    if (stat.isFile()) { if (/\.(js|mjs|cjs|html)$/.test(rel) && !/\.generated\.js$/.test(rel)) out.push(rel); return; }
    for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRS.has(entry.name)) continue;
      walk(`${rel}/${entry.name}`);
    }
  };
  for (const dir of ['archive', 'apmath', 'shared']) walk(dir);
  return out;
}
const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[\s;,{}(])\/\/[^\n]*/g, '$1');

test('only the known screen code reads the authority tables, and only for what the shards carry', () => {
  const names = ['assignmentsByUid', 'advancedAssignmentsByUid', 'identityByUid', 'examGradeByFile', 'templatesByKey', 'bindingKeys'];
  const allowed = new Map([
    ['archive/archive2-canonical.js', 'validators and resolveCatalog'],
    ['archive/archive2-catalog-shards.js', 'the assembly'],
    ['archive/archive2-source.js', 'identityByUid of one uid: uidMatchesSource'],
    ['archive/archive2-workspace-core.js', 'assignmentsByUid of one uid: only its length'],
  ]);
  const readers = new Map();
  for (const file of screenFiles()) {
    const source = stripComments(fs.readFileSync(path.join(root, file), 'utf8'));
    if (source.length > 3_000_000) continue;
    const hit = names.filter((name) => new RegExp(`(?<![A-Za-z0-9_$])${name}(?![A-Za-z0-9_$])`).test(source));
    if (hit.length) readers.set(file, hit);
  }
  for (const [file, hit] of readers) assert.ok(allowed.has(file), `${file} reads the authority tables ${hit.join(', ')}: add what it reads to the shard authority, then to this list`);
  // workspace-core only asks whether there is exactly one assignment row
  const workspace = stripComments(read('archive/archive2-workspace-core.js'));
  const uses = [...workspace.matchAll(/assignmentList[^;\n]*/g)].map((match) => match[0]);
  assert.ok(uses.length > 0 && uses.every((use) => /assignmentList\s*=|Array\.isArray\(assignmentList\)|assignmentList\.length/.test(use)), `workspace-core reads the assignment list beyond its length: ${uses.join(' | ')}`);
  // archive2-source.js reads exactly the four identity keys the shards derive from the record
  const sourceJs = stripComments(read('archive/archive2-source.js'));
  const identityReads = [...sourceJs.matchAll(/identity\??\.([A-Za-z0-9_$]+)/g)].map((match) => match[1]);
  for (const key of identityReads) assert.ok(['questionUid', 'sourceArchiveFile', 'sourceOrdinal', 'status'].includes(key), `identity.${key}`);
});

test('basicScopeLinks is left out of the common file because nothing uses what is in it', () => {
  const coreSource = stripComments(read('archive/archive2-core.js'));
  const body = functionSource(coreSource, 'basicScopeParent');
  assert.ok(/function basicScopeParent\(record, links = \[\], authority = null\)/.test(body));
  assert.equal(/(?<![A-Za-z0-9_$.])links(?![A-Za-z0-9_$])/.test(body.replace(/function basicScopeParent\(record, links = \[\], authority = null\)/, '')), false, 'basicScopeParent ignores its links argument');
  const readers = [];
  for (const file of screenFiles()) {
    if (file === 'archive/archive2-canonical.js') continue;
    const source = stripComments(fs.readFileSync(path.join(root, file), 'utf8'));
    if (source.length > 3_000_000) continue;
    if (/\.basicScopeLinks(?![A-Za-z0-9_$])/.test(source)) readers.push(file);
  }
  // meta-foundation-runtime.js builds its own list from the bundle for the runtime object; the only catalog reader hands it to basicScopeParent
  assert.deepEqual(readers.sort(), ['archive/archive2-workspace-core.js']);
  const workspace = stripComments(read('archive/archive2-workspace-core.js'));
  assert.ok(/C\.basicScopeParent\(\s*record,\s*state\.catalog\.basicScopeLinks,\s*state\.catalog\.canonicalAuthority,?\s*\)/.test(workspace), 'the one reader passes the list straight to basicScopeParent');
});
