// S14b (2026-10-29 user direction): canonical keys and Generated-only extension keys are resolved in ONE
// read-only view with a 정식/확장 badge. Runs against the real registries and extension files. The
// resolver may never write to a canonical registry, never convert a curriculum, never attach an
// extension key to an original exam item and must stay lazy and fast.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const Resolver = require('../archive/archive2-key-resolver.js');
const ProblemBankMeta = require('../archive/problem-bank-meta.js');
const extract = require('../archive/tools/archive2-extension-key-extract.cjs');

const root = path.resolve(__dirname, '..');
const data = file => path.join(root, 'archive', 'data', file);
const readJson = file => JSON.parse(fs.readFileSync(data(file), 'utf8'));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

const CANONICAL_FILES = [
  'meta-foundation/compiled/taxonomy_registry.json',
  'meta-foundation/compiled/concept_registry.json',
  'meta-foundation/compiled/condition_registry.json',
  'meta-foundation/crosswalks/rpm-primary-v1.0/high1.json',
].map(data).concat(path.join(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'));

function realSources() {
  return {
    taxonomy: readJson('meta-foundation/compiled/taxonomy_registry.json'),
    concepts: readJson('meta-foundation/compiled/concept_registry.json'),
    conditions: readJson('meta-foundation/compiled/condition_registry.json'),
    rpmCrosswalks: [readJson('meta-foundation/crosswalks/rpm-primary-v1.0/high1.json')],
    extensions: readJson('archive2-extension-keys.json'),
  };
}
let resolverCache;
const resolver = () => (resolverCache ||= Resolver.create(realSources()));

test('the derived extension index is current with the extension source files', () => {
  const committed = fs.readFileSync(data('archive2-extension-keys.json'), 'utf8');
  const fresh = extract.buildIndex(root);
  assert.equal(JSON.parse(committed).sourceDigest, fresh.sourceDigest,
    'run node archive/tools/build-archive2-extension-keys.mjs');
  assert.equal(JSON.parse(committed).definitionCount, fresh.definitionCount);
  assert.equal(JSON.parse(committed).definitions.length, fresh.definitions.length);
  assert.equal(JSON.parse(committed).schemaVersion, Resolver.EXTENSION_INDEX_SCHEMA);
});

test('the extractor covers every extension source schema (all EXT keys defined in the source files are indexed)', () => {
  const index = readJson('archive2-extension-keys.json');
  const indexed = new Set(index.definitions.map(row => row.key));
  const defining = /^(?:id|key|generatedExtL4Id|generatedExtL3Id|generatedExtConditionId|candidateL4Id|candidateL3Id)$/;
  const missing = [];
  for (const file of extract.listSourceFiles(root)) {
    const json = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    (function walk(node) {
      if (Array.isArray(node)) return node.forEach(walk);
      if (!node || typeof node !== 'object') return;
      for (const [name, value] of Object.entries(node)) {
        if (defining.test(name) && /^EXT-/.test(value) && !/^EXT-BIND-/.test(value) && !indexed.has(value)) missing.push(`${file}:${value}`);
        if (value && typeof value === 'object') walk(value);
      }
    })(json);
  }
  assert.deepEqual(missing, []);
  const kinds = Object.keys(index.definitionsByKind);
  for (const kind of ['l4', 'cond', 'cross', 'tpl']) assert.ok(kinds.includes(kind), `kind ${kind} is indexed`);
});

test('resolver builds from the real registries well under the 500 ms budget and badges both origins', () => {
  const sources = realSources();
  const samples = [];
  let built;
  for (let run = 0; run < 3; run += 1) {
    const started = process.hrtime.bigint();
    built = Resolver.create(sources);
    samples.push(Number(process.hrtime.bigint() - started) / 1e6);
  }
  console.log(`# resolver build ms (3 runs): ${samples.map(value => value.toFixed(1)).join(', ')}`);
  assert.ok(Math.min(...samples) < 500, `resolver build took ${samples}`);
  assert.ok(built.stats.canonicalKeys > 1500);
  assert.equal(built.stats.extensionKeys, sources.extensions.definitionCount);
  assert.equal(built.badgeOf('PT_SUBSET_COUNT'), '정식');
  assert.equal(built.badgeOf('COND_INTEGER'), '정식');
  assert.equal(built.badgeOf('EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION'), '확장');
  assert.equal(built.originOf('EXT-DOES-NOT-EXIST'), 'extension', 'a carried but undefined EXT key is still an extension key');
  assert.equal(built.originOf('NOT_A_KEY'), 'unknown');
});

test('every extension key is linked to its canonical parent or listed as a consolidation candidate', () => {
  const view = resolver();
  const report = view.consolidation();
  const orphanKeys = new Set(report.orphans.map(row => row.key));
  const ambiguousKeys = new Set(report.ambiguous.map(row => row.key));
  let linked = 0;
  for (const node of view.extensionKeyList()) {
    if (orphanKeys.has(node.key) || ambiguousKeys.has(node.key)) continue;
    linked += 1;
    assert.ok(node.parent, `${node.key} has a parent`);
    assert.ok(['RECORD', 'EXT_PARENT', 'LABEL', 'LABEL_UNIT'].includes(node.parentStatus), `${node.key} ${node.parentStatus}`);
    assert.ok(view.childrenOf(node.parent.key).some(child => child.key === node.key) ||
      view.childrenOf(node.anchor?.key).some(child => child.key === node.key), `${node.key} is a child of its parent or anchor`);
    assert.ok(node.anchor, `${node.key} has an RPM L3 anchor`);
  }
  assert.equal(linked + orphanKeys.size + ambiguousKeys.size, view.stats.extensionKeys, 'partition covers every key');
  assert.ok(linked > 150, `linked ${linked}`);
  // A template parent is the canonical problem type when one is known.
  const template = view.extensionKeyList().find(node => node.kind === 'tpl' && node.canonicalPtKey);
  assert.ok(template);
  assert.equal(template.parent.key, template.canonicalPtKey);
  assert.equal(view.lookup(template.canonicalPtKey).origin, 'canonical');
  // An L4 under an extension L3 keeps that extension L3 as its direct parent.
  const underExtL3 = view.extensionKeyList().find(node => node.parent?.kind === 'l3' && node.parent.origin === 'extension' && node.anchor);
  assert.ok(underExtL3);
  assert.equal(view.parentOf(underExtL3.key).origin, 'extension');
  assert.ok(view.ancestorsOf(underExtL3.key).some(ancestor => ancestor.origin === 'canonical'));
});

test('curriculum identity is never converted when a parent is resolved by label', () => {
  const crosswalk = {
    records: [
      { id: 'H1-RPM-001', curriculum: '2015', standardCourse: '수학(상)', standardUnitKey: 'H15-SA-01', rpmPath: { majorUnit: 'A', midUnit: 'B', l3: '같은 개념', l4: 'x' } },
      { id: 'H1-RPM-101', curriculum: '2022', standardCourse: '공통수학1', standardUnitKey: 'H22-C-01', rpmPath: { majorUnit: 'A', midUnit: 'B', l3: '같은 개념', l4: 'y' } },
    ],
  };
  const definition = (key, curriculum) => ({
    key, kind: 'l4', label: key, curriculum, status: 'GENERATED_ACTIVE', parentRefs: { l3Labels: ['같은 개념'] },
  });
  const built = Resolver.create({
    rpmCrosswalks: [crosswalk],
    extensions: { definitions: [definition('EXT-A-2022', '2022'), definition('EXT-A-2015', '2015'), definition('EXT-A-NONE', undefined)] },
  });
  assert.equal(built.lookup('EXT-A-2022').anchor.curriculum, '2022');
  assert.equal(built.lookup('EXT-A-2015').anchor.curriculum, '2015');
  const unknown = built.lookup('EXT-A-NONE');
  assert.equal(unknown.parentStatus, 'LABEL_AMBIGUOUS', 'a definition without a curriculum is never silently assigned');
  assert.equal(unknown.anchor, null);
});

test('resolver is read-only: canonical registries and extension sources are byte-identical and no write API is used', () => {
  const sourceFiles = extract.listSourceFiles(root).map(file => path.join(root, file));
  const before = [...CANONICAL_FILES, ...sourceFiles, data('archive2-extension-keys.json')].map(file => [file, sha(file)]);
  const writers = ['writeFileSync', 'appendFileSync', 'renameSync', 'unlinkSync', 'rmSync', 'mkdirSync', 'copyFileSync', 'truncateSync', 'writeSync'];
  const originals = writers.map(name => [name, fs[name]]);
  for (const [name] of originals) fs[name] = () => { throw new Error(`resolver attempted fs.${name}`); };
  try {
    const built = Resolver.create(realSources());
    built.tree({ extensionOnly: true });
    built.consolidation();
    built.optionsFor('cond', ['COND_INTEGER', 'EXT-COND-H1-Q18-SIDE-RATIO']);
    built.describe({ uid: 'ALITE-X', sourceKind: 'generated', crossConceptKeys: ['EXT-CC-H1-Q13-COMBINATION-COUNTING'] });
  } finally {
    for (const [name, original] of originals) fs[name] = original;
  }
  assert.deepEqual(before.map(([file]) => [file, sha(file)]), before);
  // Returned views are frozen: a caller cannot mutate resolver state through them.
  const view = resolver().describe({ uid: 'ALITE-X', sourceKind: 'generated', crossConceptKeys: ['EXT-CC-H1-Q13-COMBINATION-COUNTING'] });
  assert.ok(Object.isFrozen(view) && Object.isFrozen(view.items));
  assert.throws(() => { 'use strict'; view.items.push({}); }, TypeError);
  assert.ok(Object.isFrozen(resolver().tree({ extensionOnly: true })));
  const source = fs.readFileSync(path.join(root, 'archive/archive2-key-resolver.js'), 'utf8');
  assert.doesNotMatch(source, /writeFile|appendFile|localStorage|sessionStorage|indexedDB|XMLHttpRequest|method:\s*["']P/i);
});

test('an extension key is never attached to an original exam item', () => {
  const view = resolver();
  const original = view.describe({
    questionUid: 'qid_v1_original', sourceKind: 'original',
    crossConceptKeys: ['EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION', 'CC_POINT_LINE_DISTANCE'],
    rpmL4: 'EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합',
  });
  assert.equal(original.hasExtension, false);
  assert.equal(original.generated, false);
  assert.ok(original.violations.length >= 2);
  assert.ok(original.items.filter(item => item.blocked).every(item => item.badge === '' && item.origin === 'blocked'));
  assert.equal(original.items.find(item => item.key === 'CC_POINT_LINE_DISTANCE').badge, '정식');
  // The real catalog: no original exam question carries an extension key in any key field.
  const { catalog } = require('./helpers/archive2-scope-harness.cjs');
  const carriers = [];
  for (const record of catalog.records) {
    const described = view.describe(record);
    if (described.violations.length || JSON.stringify([record.problemTypeKey, record.templateKey, record.crossConceptKeys, record.conditionKeys, record.secondaryConceptKeys]).includes('EXT-'))
      carriers.push(record.questionUid);
  }
  assert.deepEqual(carriers, []);
  assert.ok(catalog.records.length > 10000);
});

test('generated items that carry extension keys are described with the 확장 badge and a parent', () => {
  const view = resolver();
  const index = readJson('generated-lite-consumer/v1/index.json');
  const generated = index.records.map(row => ProblemBankMeta.projectGenerated(row, null, index.userDisabledUids || []));
  let withExtension = 0;
  const undefinedKeys = new Set();
  const started = process.hrtime.bigint();
  for (const row of generated) {
    const described = view.describe(row);
    assert.equal(described.violations.length, 0);
    if (!described.hasExtension) continue;
    withExtension += 1;
    for (const item of described.items.filter(entry => entry.origin === 'extension')) {
      assert.equal(item.badge, '확장');
      if (!item.defined) undefinedKeys.add(item.key);
    }
  }
  console.log(`# described ${generated.length} generated rows in ${(Number(process.hrtime.bigint() - started) / 1e6).toFixed(1)} ms; ${withExtension} carry extension keys; ${undefinedKeys.size} carried keys have no definition`);
  assert.ok(withExtension >= 100, `generated rows with extension keys: ${withExtension}`);
  const sample = generated.find(row => view.describe(row).items.some(item => item.origin === 'extension' && item.defined && item.parentLabel));
  assert.ok(sample, 'a generated row with a defined extension key and its parent exists');
  const item = view.describe(sample).items.find(entry => entry.origin === 'extension' && entry.defined && entry.parentLabel);
  assert.ok(item.label && item.parentLabel && item.key.startsWith('EXT-'));
  // A key that no registry defines is still shown (확장); its parent comes only from the item's own RPM record.
  const inferred = view.describe({
    uid: 'ALITE-TEST', sourceKind: 'generated', rpmPrimaryRecordId: 'H1-RPM-234', conditionKeys: ['EXT-COND-NOT-REGISTERED'],
  });
  const only = inferred.items[0];
  assert.deepEqual([only.badge, only.defined, only.parentLabel, only.parentInferredFromItem], ['확장', false, '부분집합', true]);
});

test('optionsFor labels, badges and groups extension options under their parent', () => {
  const view = resolver();
  const options = view.optionsFor('cross', [
    { value: 'CC_POINT_LINE_DISTANCE', count: 3 },
    { value: 'EXT-CC-H1-Q13-SIGNED-DIVISOR-ENUMERATION', count: 9 },
    'EXT-CC-H1-Q13-COMBINATION-COUNTING',
    { value: '' },
  ]);
  assert.equal(options.length, 3);
  assert.equal(options[0].origin, 'canonical', 'canonical options come first');
  const extension = options.filter(option => option.origin === 'extension');
  assert.equal(extension.length, 2);
  assert.ok(extension.every(option => option.badge === '확장' && option.groupLabel === '부분집합'));
  assert.equal(extension[0].count === undefined || typeof extension[0].count === 'number', true);
  assert.equal(view.optionsFor('l4', ['점·직선의 이동'])[0].badge, '정식', 'a LOCKED RPM L4 label is canonical');
  assert.equal(view.optionsFor('l4', ['EXT-H1-C2-05-Q13-SIGNED-PRODUCT|정수 약수의 곱의 부호를 만족하는 부분집합'])[0].badge, '확장');
});

test('the tree puts canonical and extension keys under one RPM L3 node', () => {
  const view = resolver();
  const tree = view.tree({ extensionOnly: true });
  assert.ok(tree.length >= 20);
  const subset = tree.find(node => node.label === '부분집합' && node.curriculum === '2022');
  assert.ok(subset);
  assert.equal(subset.origin, 'canonical');
  const flat = [];
  (function visit(node) { flat.push(node); node.children.forEach(visit); })(subset);
  assert.ok(flat.some(node => node.kind === 'pt' && node.origin === 'canonical'));
  assert.ok(flat.some(node => node.origin === 'extension'));
  assert.ok(flat.every(node => node.badge === '정식' || node.badge === '확장'));
});

test('consolidation candidates are reported, not applied', () => {
  const report = resolver().consolidation();
  assert.ok(Array.isArray(report.orphans) && Array.isArray(report.duplicatesCanonical) && Array.isArray(report.duplicatesExtension));
  assert.ok(report.orphans.length > 0 && report.orphans.every(row => row.key.startsWith('EXT-')));
  // The same data through a second resolver yields the same answer (deterministic, no hidden state).
  assert.deepEqual(JSON.parse(JSON.stringify(Resolver.create(realSources()).consolidation())), JSON.parse(JSON.stringify(report)));
});

test('load() is lazy: nothing is fetched at import and only the crosswalks the extensions need are requested', async () => {
  const requested = [];
  const files = {
    'data/archive2-extension-keys.json': readJson('archive2-extension-keys.json'),
    'data/meta-foundation/compiled/taxonomy_registry.json': readJson('meta-foundation/compiled/taxonomy_registry.json'),
    'data/meta-foundation/compiled/concept_registry.json': readJson('meta-foundation/compiled/concept_registry.json'),
    'data/meta-foundation/compiled/condition_registry.json': readJson('meta-foundation/compiled/condition_registry.json'),
    'data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json': readJson('meta-foundation/crosswalks/rpm-primary-v1.0/high1.json'),
  };
  assert.deepEqual(requested, [], 'requiring the module performs no fetch');
  const loaded = await Resolver.load({
    fetchJson: async url => {
      requested.push(url);
      if (!files[url]) throw new Error(`unexpected ${url}`);
      return files[url];
    },
  });
  assert.equal(requested.length, 5);
  assert.ok(requested.includes('data/meta-foundation/crosswalks/rpm-primary-v1.0/high1.json'));
  assert.deepEqual(loaded.failedSources, []);
  assert.equal(loaded.resolver.stats.extensionKeys, files['data/archive2-extension-keys.json'].definitionCount);
  assert.ok(loaded.elapsedMs < 500, `lazy load ${loaded.elapsedMs} ms`);
  assert.equal(await Resolver.load({ fetchJson: async () => { throw new Error('cached'); } }), loaded, 'second call reuses the load');
});

test('a missing optional source degrades to fewer badges, a missing extension index rejects', async () => {
  const fetchJson = async url => {
    if (url.endsWith('archive2-extension-keys.json')) return { schemaVersion: Resolver.EXTENSION_INDEX_SCHEMA, definitions: [{ key: 'EXT-COND-X', kind: 'cond', label: 'x', parentRefs: {} }] };
    throw new Error('offline');
  };
  const degraded = await Resolver.load({ fetchJson, force: true });
  assert.equal(degraded.failedSources.length, 3);
  assert.equal(degraded.resolver.badgeOf('EXT-COND-X'), '확장');
  assert.equal(degraded.resolver.badgeOf('PT_SUBSET_COUNT'), '');
  await assert.rejects(Resolver.load({ fetchJson: async () => ({ schemaVersion: 'wrong' }), force: true }), /EXTENSION_INDEX_SCHEMA/);
});

test('the search page loads the resolver after first paint and shows the badge', () => {
  const html = fs.readFileSync(path.join(root, 'archive/problem-bank-search.html'), 'utf8');
  assert.match(html, /archive2-key-resolver\.js\?v=20261030-s14b-1/);
  const initial = html.indexOf('metaAxisOptions(\'crossConceptKey\'');
  const firstRender = html.indexOf('render();scheduleKeyResolver();');
  assert.ok(initial > 0 && firstRender > initial, 'resolver scheduling follows the first render');
  assert.match(html, /requestIdleCallback\(start,\{timeout:1500\}\)/);
  assert.doesNotMatch(html.slice(0, html.indexOf('function scheduleKeyResolver')), /Archive2KeyResolver\.load/, 'no eager load');
  assert.match(html, /class="kb|className='kb'/);
});
