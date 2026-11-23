'use strict';
// Catalog shards, stage 2-4: 문제지 만들기 builds its list from the shards of the grade the teacher chose (not the whole bundle). What the
// teacher gets must not depend on that: for every grade, the same request and the same seed select the same questions from the shards of the
// grade as from the whole catalog, the same questions are eligible, and the family (original/similar pair) links agree. Real inputs, no
// counts fixed: the test compares the two ways of loading, and fails on any difference.
const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const lib = () => import(pathToFileURL(path.join(root, 'tools/lib/build-archive2-catalog-shards.mjs')).href);
const core = require(path.join(root, 'archive/archive2-core.js'));
const shards = require(path.join(root, 'archive/archive2-catalog-shards.js'));
// the browser loads archive2-similar.js as a global after archive2-core.js (familyResolver reads it)
globalThis.Archive2Similar = require(path.join(root, 'archive/archive2-similar.js'));

let builtOnce = null;
const built = async () => {
  if (!builtOnce) builtOnce = lib().then((m) => m.buildCatalogShards(root));
  return builtOnce;
};
const fakeFetch = (files) => async (url) => {
  const rel = String(url).replace(/^.*archive2-catalog-shards-v1\//, '').replace(/\?.*$/, '');
  const bytes = files.get(rel);
  if (!bytes) return { ok: false, status: 404, arrayBuffer: async () => new ArrayBuffer(0) };
  const copy = Buffer.from(bytes);
  return { ok: true, status: 200, arrayBuffer: async () => copy.buffer.slice(copy.byteOffset, copy.byteOffset + copy.length) };
};
const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
const SEEDS = ['seed-a', 'seed-b', 'seed-c'];

test('the same request and seed select the same questions from the shards of a grade as from the whole catalog', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const compared = { selects: 0, withSelection: 0, units: 0 };
  for (const grade of GRADES) {
    const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
    const part = await loader.loadCatalog({ grades: [grade] });
    assert.equal(part.complete, false, 'a grade is not the whole list');
    const filters = { grade };
    const poolOf = (records) => records.filter((record) => core.matches(record, filters, { filters }));
    const poolFull = poolOf(full.records);
    const poolPart = poolOf(part.records);
    // 1) the pool of the grade is the same set of questions
    assert.deepEqual(poolPart.map((r) => r.questionUid).sort(), poolFull.map((r) => r.questionUid).sort(), `pool of ${grade}`);
    assert.ok(poolFull.length > 0, `${grade} has questions`);
    // ... in the same order (a replacement list sorts by year only, so questions of one year come in catalog order)
    assert.deepEqual(poolPart.map((r) => r.questionUid), poolFull.map((r) => r.questionUid), `order of the pool of ${grade}`);
    assert.deepEqual([...poolPart].sort(core.compareRecency).slice(0, 60).map((r) => r.questionUid), [...poolFull].sort(core.compareRecency).slice(0, 60).map((r) => r.questionUid), `first replacement candidates of ${grade}`);
    // 2) the same questions are eligible, for the same reasons, with each authority
    for (const record of poolFull) {
      const original = full.records.find((candidate) => candidate === record);
      const slim = poolPart.find((candidate) => candidate.questionUid === original.questionUid);
      if (record.questionUid.slice(-1) !== '0' && record.questionUid.slice(-1) !== '7') continue; // a sample of 1/8 keeps this fast; the equality below is exhaustive in the authority test
      assert.deepEqual(core.basicEligibility(slim, { canonicalAuthority: part.canonicalAuthority }), core.basicEligibility(record, { canonicalAuthority: full.canonicalAuthority }));
      assert.equal(core.advancedEligible(slim, { canonicalAuthority: part.canonicalAuthority }), core.advancedEligible(record, { canonicalAuthority: full.canonicalAuthority }));
    }
    // 3) the original / similar pair links agree for every question of the pool
    const familyFull = core.familyResolver(full.records);
    const familyPart = core.familyResolver(part.records);
    const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
    for (const slim of poolPart) assert.equal(familyPart(slim), familyFull(fullByUid.get(slim.questionUid)), `family of ${slim.questionUid}`);
    // 4) units: the biggest ones of the grade, three seeds, both gates (the browser uses "general"; "basic" is the strict one)
    const byUnit = new Map();
    for (const record of poolFull) {
      if (!core.generalUseEligibility(record).ok) continue;
      const key = core.pathKey(record, 4);
      if (!byUnit.has(key)) byUnit.set(key, []);
      byUnit.get(key).push(record.questionUid);
    }
    const units = [...byUnit.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 4);
    for (const [unit, uids] of units) {
      compared.units += 1;
      for (const seed of SEEDS) for (const useMode of ['general', 'basic']) {
        const make = (authority) => ({
          filters: { grade, scopeQuestionUids: uids, primaryPaths: [unit] },
          rows: [{ id: 'unit', count: 10, paths: [unit], depth: 4, scopeQuestionUids: uids }],
          useMode, seed, canonicalAuthority: authority,
        });
        const a = core.selectBlueprint(poolFull, make(full.canonicalAuthority), {}, { familyRecords: full.records });
        const b = core.selectBlueprint(poolPart, make(part.canonicalAuthority), {}, { familyRecords: part.records });
        compared.selects += 1;
        if (a.selected.length) compared.withSelection += 1;
        assert.deepEqual(b.selected.map((r) => r.questionUid), a.selected.map((r) => r.questionUid), `selection ${grade} ${unit} ${seed} ${useMode}`);
        assert.deepEqual(b.errors, a.errors);
        assert.equal(b.ok, a.ok);
      }
    }
  }
  // the comparison must have teeth: real selections were made
  assert.ok(compared.withSelection > 0 && compared.units > 0, JSON.stringify(compared));
});

test('adding a grade after another keeps the first grade\'s answer and gives the second grade\'s (고1, then 고2)', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
  const first = await loader.loadCatalog({ grades: ['고1'] });
  const both = await loader.loadCatalog({ grades: ['고2'] });
  assert.ok(both.records.length > first.records.length);
  assert.ok(first.records.every((record) => both.records.includes(record)), 'the records of the first grade are the same objects');
  const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
  for (const record of both.records) {
    const original = fullByUid.get(record.questionUid);
    assert.deepEqual(core.basicEligibility(record, { canonicalAuthority: both.canonicalAuthority }), core.basicEligibility(original, { canonicalAuthority: full.canonicalAuthority }));
  }
});

test('the type filters and the replacement candidates of a grade are the same from its shards as from the whole catalog', async () => {
  const { files, entries, catalog: full } = await built();
  const all = new Map(files);
  all.set('index.json', entries.find((entry) => entry.path.endsWith('/index.json')).content);
  const ProblemBankMeta = require(path.join(root, 'archive/problem-bank-meta.js'));
  // every column ProblemBankMeta.query() filters on, plus what the preview rows and the type filters show
  const READ_BY_FILTERS = ['uid', 'questionUid', 'sourceKind', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'rpmSemanticStatus', 'storageBucketKey',
    'L1', 'L2', 'L3', 'L4', 'rpmL1', 'rpmL2', 'rpmL3', 'rpmL4', 'problemTypeKey', 'templateKey', 'integrationPattern', 'level', 'difficultyBucket',
    'nativeCurriculum', 'nativeL1', 'nativeL2', 'nativeL3', 'nativeL4', 'crossConceptKeys', 'conditionKeys', 'secondaryConceptKeys',
    'directSelectable', 'verifiedEligible', 'metaStatus', 'metaCompleteness'];
  const fullByUid = new Map(full.records.map((record) => [record.questionUid, record]));
  const fullIndex = ProblemBankMeta.buildIndex(full.records, []);
  const idOf = (row) => row.questionUid || row.uid;
  const fullRowByUid = new Map(fullIndex.map((row) => [idOf(row), row]));
  let facetsCompared = 0;
  let queriesCompared = 0;
  for (const grade of GRADES) {
    const loader = shards.createLoader({ base: 'https://site.test/archive/data/archive2-catalog-shards-v1/', fetch: fakeFetch(all) });
    const part = await loader.loadCatalog({ grades: [grade] });
    const partIndex = ProblemBankMeta.buildIndex(part.records, []);
    const partUids = new Set(partIndex.map(idOf));
    // 1) every row of the recorded-meta index (what the type filters and the labels read) is the row of the same question in the whole catalog
    // (a shard record leaves out the dropped / trimmed columns that no screen reads, so the whole row is not compared: the columns the filters
    // query and the labels read are)
    for (const row of partIndex) {
      const fullRow = fullRowByUid.get(idOf(row));
      for (const field of READ_BY_FILTERS) assert.deepEqual(row[field], fullRow[field], `${field} of ${idOf(row)}`);
    }
    // 2) the concept / type / template of every question of the grade, with their statuses
    for (const record of part.records) {
      assert.deepEqual(core.metaFacetsOf(record), core.metaFacetsOf(fullByUid.get(record.questionUid)), `facets ${record.questionUid}`);
      facetsCompared += 1;
    }
    // 3) a replacement list is a query on one type / template key inside the grade's pool: the same uids in the same order from both
    const keys = new Set();
    for (const row of partIndex) {
      if (row.problemTypeKey) keys.add(`problemTypeKey:${row.problemTypeKey}`);
      if (row.templateKey) keys.add(`templateKey:${row.templateKey}`);
    }
    for (const key of [...keys].sort().filter((_, index) => index % 7 === 0).slice(0, 40)) {
      const [field, value] = key.split(':');
      const a = ProblemBankMeta.query(fullIndex, { [field]: value }, { profile: 'DIRECT' }).filter((row) => partUids.has(idOf(row)));
      const b = ProblemBankMeta.query(partIndex, { [field]: value }, { profile: 'DIRECT' });
      assert.deepEqual(b.map(idOf), a.map(idOf), `${grade} ${key}`);
      queriesCompared += 1;
    }
  }
  assert.ok(facetsCompared > 0 && queriesCompared > 0, JSON.stringify({ facetsCompared, queriesCompared }));
});
