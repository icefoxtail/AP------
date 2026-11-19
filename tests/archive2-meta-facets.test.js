// S14 (2026-10-29 user direction): the recorded concept (L3), problem type (PT) and solution
// template (TPL), the recorded curriculum and the recorded difficulty must be USABLE in Archive 2.0
// without fabricating values, without upgrading any approval and without touching the canonical
// authority. Runs against the real production catalog.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { pathToFileURL } = require('node:url');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const Unified = require('../archive/archive2-unified-units.js');
const UnitCore = require('../archive/unit-past-exams-core.js');
const ProblemBankMeta = require('../archive/problem-bank-meta.js');
const { productionCatalog } = require('./helpers/archive2-scope-harness.cjs');
const { loadWorkspace, assertWorkspaceScriptVersions } = require("./helpers/archive2-workspace-source.cjs");

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');

let catalogPromise;
const catalog = () => (catalogPromise ||= productionCatalog().then(result => result.data));
let metadataPromise;
const metadata = () => (metadataPromise ||= Promise.resolve(JSON.parse(read('data/question_metadata.json'))));
const taxonomy = () => JSON.parse(read('data/meta-foundation/compiled/taxonomy_registry.json'));

const uidFor = n => 'qid_v1_' + crypto.createHash('sha256').update(String(n)).digest('hex');
let counter = 0;
function record(extra = {}) {
  const n = ++counter;
  return {
    questionUid: uidFor(n), identityStatus: 'VERIFIED', sourceIntegrityStatus: 'VERIFIED', sourceStatus: 'VERIFIED',
    sourceFile: `original/high/h1/x/${n}.js`, sourceOrdinal: n, sourceFingerprint: 'f'.repeat(64), year: 2024,
    sourceGrade: '고1', effectiveBrowseGrade: '고1', ...extra,
  };
}
const approvedOnlyFilter = { metaApprovedOnly: '1' };

// ---- the usable-meta lane in the real catalog -------------------------------------------------

test('the catalog lane exposes only content-bound, registry-labelled concept/type/template values with their own status', async () => {
  const data = await catalog();
  const meta = await metadata();
  const byUid = new Map(meta.records.map(row => [row.questionUid, row]));
  const registry = taxonomy();
  const activePt = new Map(registry.problemTypes.filter(row => row.status === 'ACTIVE').map(row => [row.problemTypeKey, row]));
  const activeTpl = new Map(registry.templates.filter(row => row.status === 'ACTIVE').map(row => [row.templateKey, row]));
  const stats = { hint: 0, pt: 0, tpl: 0, l3: 0, bound: 0, unbound: 0 };
  const textBound = [];
  for (const row of data.records) {
    const source = byUid.get(row.questionUid);
    assert.ok(source, row.questionUid);
    const hasHint = Boolean(row.metaHintPT || row.metaHintTPL || row.metaHintL3);
    // binding: exact bytes, or only the answer/solution changed (content fingerprint equal)
    const contentEqual = source.contentFingerprint === row.assignmentFingerprint;
    const exact = source.sourceFingerprint === row.sourceFingerprint && contentEqual;
    // A single binding value: the row's metadata is about the same stem+choices as today. Rows whose content fingerprint matches are bound for
    // sure; the others (stale fingerprint) are re-derived below with the same library the builder uses.
    if (contentEqual) assert.ok(row.metaBinding, row.questionUid + ' content-bound row must be bound');
    else if (row.metaBinding) textBound.push(row);
    if (!row.metaBinding) {
      assert.equal(hasHint, false, 'unbound rows carry no hint: ' + row.questionUid);
      // Check every unbound record, including newly restored SOURCE_ONLY bodies.
      // A stored classification must never become a usable facet without its content binding.
      assert.equal(core.metaFacetsOf(row), null, 'unbound metadata is not a usable facet: ' + row.questionUid);
      assert.equal(core.metaFacetMatches(row, { metaPT: source.problemTypeKey || 'PT_ANY' }), false,
        'unbound metadata cannot match a type filter: ' + row.questionUid);
      assert.equal(core.metaFacetMatches(row, { metaTPL: source.templateKey || 'TPL_ANY' }), false,
        'unbound metadata cannot match a template filter: ' + row.questionUid);
      stats.unbound++;
      continue;
    }
    stats.bound++;
    if (!hasHint) continue;
    stats.hint++;
    const code = row.metaHintStatus;
    assert.match(code, /^[AP-]{3}$/, row.questionUid);
    const status = fieldStatus => (/^approved(_|$)/i.test(fieldStatus || '') ? 'A' : 'P');
    if (row.metaHintPT) {
      stats.pt++;
      assert.equal(row.metaHintPT, source.problemTypeKey);
      assert.ok(activePt.has(row.metaHintPT), 'PT must be an ACTIVE labelled registry key');
      assert.equal(code[1], status(source.fieldStatus?.problemType), row.questionUid + ' PT status');
    } else assert.equal(code[1], '-');
    if (row.metaHintTPL) {
      stats.tpl++;
      assert.equal(row.metaHintTPL, source.templateKey);
      assert.equal(activeTpl.get(row.metaHintTPL).parentProblemTypeKey, row.metaHintPT, 'TPL parent must be the PT');
      assert.equal(code[2], status(source.fieldStatus?.template), row.questionUid + ' TPL status');
    } else assert.equal(code[2], '-');
    if (row.metaHintL3) {
      stats.l3++;
      assert.equal(row.metaHintL3, source.L3 || source.nativeL3);
      assert.equal(code[0], status(source.fieldStatus?.concept), row.questionUid + ' L3 status');
    } else assert.equal(code[0], '-');
  }
  // Every stale-fingerprint binding must be re-derivable: the stem/choices fingerprint of the current question is covered by the row, a frozen rebind record or
  // the row's own type judgment, and a type-only binding never carries the row's concept or curriculum.
  if (textBound.length) {
    const lib = await import(pathToFileURL(path.join(root, 'archive/tools/meta-foundation/text-binding-lib.mjs')).href);
    const rebinds = lib.loadRebinds(root);
    const banks = new Map();
    for (const row of textBound) {
      if (!banks.has(row.sourceFile)) {
        const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
        vm.createContext(scope);
        vm.runInContext(read('exams/' + row.sourceFile).replace(/^﻿/, '').replace(/\r\n/g, '\n'), scope, { timeout: 5000 });
        banks.set(row.sourceFile, require('../archive/exam-source-reader.js').readQuestionArray(scope.window));
      }
      const question = banks.get(row.sourceFile)[row.sourceOrdinal - 1];
      const source = byUid.get(row.questionUid);
      const kind = lib.classifyMetaBinding({ meta: source, question, assignmentFingerprint: lib.contentFingerprint(question), rebinds });
      assert.ok(kind, row.questionUid + ' binding is not re-derivable');
      if (kind === 'type') assert.ok(!row.metaHintL3 && !row.metaHintCurriculum, 'type-only binding carries no row-level values: ' + row.questionUid);
    }
  }
  // Operating counts change whenever metadata is registered or a source is edited, so none is pinned. These only guard against a
  // vacuous run (the loop above checked every record; zero hints would mean the lane is broken or the wrong catalog was read).
  assert.ok(stats.pt > 0 && stats.tpl > 0 && stats.l3 > 0 && stats.bound > 0, JSON.stringify(stats));
});

test('the lane never changes the canonical resolution or the strict approval metric', async () => {
  const data = await catalog();
  const auth = { canonicalAuthority: data.canonicalAuthority };
  // Source maintenance can change the approved set. Check the live count and
  // each approval's identity/evidence instead of freezing a production count.
  const strict = data.records.filter(row => core.basicEligibility(row, auth).ok);
  const advanced = data.records.filter(row => core.advancedEligible(row, auth));
  assert.equal(data.health.automatic, strict.length, 'reported approval count must match the actual eligible set');
  for (const row of strict) {
    assert.equal(row.identityStatus, 'VERIFIED', row.questionUid);
    assert.equal(row.sourceIntegrityStatus, 'VERIFIED', row.questionUid);
    assert.equal(row.sourceStatus, 'VERIFIED', row.questionUid);
    assert.equal(row.assignmentEvidence?.questionUid, row.questionUid, 'approval must bind the same UID');
    assert.equal(row.assignmentEvidence?.approvalStatus, 'APPROVED', row.questionUid);
    assert.equal(row.assignmentEvidence?.assignmentFingerprint, row.assignmentFingerprint, 'approval must bind the current problem');
  }
  assert.ok(advanced.length > 0, 'the approved set is not empty');
  assert.ok(data.records.some(row => row.problemTypeKey) && data.records.some(row => row.curriculumKey), 'canonical values are untouched');
  // Advanced use requires an approved canonical assignment, while the strict
  // basic selection metric separately limits applicability to DEFAULT_SCOPE.
  // A reviewed CORE assignment must keep its scope without losing its approval.
  for (const row of advanced) {
    const assignment = core.Canonical.validateBasicAssignment(row, data.canonicalAuthority);
    assert.equal(assignment.ok, true, row.questionUid + ': ' + assignment.reasons.join(','));
    assert.equal(row.assignmentEvidence?.questionUid, row.questionUid, 'advanced approval must bind the same UID');
    assert.equal(row.assignmentEvidence?.approvalStatus, 'APPROVED', row.questionUid);
    assert.equal(row.assignmentEvidence?.assignmentFingerprint, row.assignmentFingerprint, 'advanced approval must bind the current problem');
  }
  assert.equal(new Set(data.records.map(row => row.questionUid)).size, data.records.length, 'no duplicate question uid');
  // every canonically validated type/template is also in the lane with the same value and is 승인
  for (const row of data.records.filter(candidate => core.advancedEligible(candidate, auth))) {
    const facets = core.metaFacetsOf(row);
    assert.equal(facets.pt, row.problemTypeKey);
    assert.equal(facets.ptStatus, 'approved');
  }
  assert.match(String(data.canonicalProjectionVersion || data.indexVersion), /./);
  assert.equal(core.Canonical.RESOLVER_VERSION, require('../archive/archive2-canonical.js').RESOLVER_VERSION);
});

test('CORE applicability stays outside the basic metric while advanced use still requires intact canonical approval', async () => {
  const data = await catalog();
  const authority = data.canonicalAuthority;
  const options = { canonicalAuthority: authority };
  const original = data.records.find(row => core.basicEligibility(row, options).ok && core.advancedEligible(row, options));
  assert.ok(original, 'the production catalog supplies an independently approved advanced assignment');
  const scoped = { ...original, basicScopeApplicability: 'CORE', basicScopeDefaultSelectable: true, curriculumApplicability: 'CORE' };
  assert.deepEqual(core.basicEligibility(scoped, options), { ok: false, reasons: ['applicability'] });
  assert.equal(core.advancedEligible(scoped, options), true, 'CORE does not revoke an approved canonical type/template');
  assert.equal(scoped.curriculumApplicability, 'CORE', 'the historical scope is not rewritten to DEFAULT_SCOPE');

  for (const change of [
    { sourceStatus: 'HOLD' },
    { sourceIntegrityStatus: 'HOLD' },
    { identityStatus: 'UNVERIFIED' },
    { assignmentFingerprint: '0'.repeat(64) },
  ]) assert.equal(core.advancedEligible({ ...scoped, ...change }, options), false, JSON.stringify(change));

  const accepted = authority.assignmentsByUid[scoped.questionUid];
  assert.equal(accepted.length, 1);
  for (const change of [
    { approvalStatus: 'PENDING' },
    { reviewEvidence: { ...accepted[0].reviewEvidence, status: 'HOLD' } },
    { questionUid: uidFor('different-approved-question') },
  ]) {
    const changedAuthority = { ...authority, assignmentsByUid: {
      ...authority.assignmentsByUid, [scoped.questionUid]: [{ ...accepted[0], ...change }],
    } };
    assert.equal(core.advancedEligible(scoped, { canonicalAuthority: changedAuthority }), false,
      'an applicability distinction must not waive approval, review or UID binding: ' + JSON.stringify(change));
  }
  assert.equal(core.basicEligibility(original, options).ok, true, 'the approved default-scope input was not mutated');
});

// Re-derives the binding kind of catalog rows with the same library the builder uses ("row", "type" or "" for an unbound row).
async function bindingKinds(data, byUid) {
  const lib = await import(pathToFileURL(path.join(root, 'archive/tools/meta-foundation/text-binding-lib.mjs')).href);
  const rebinds = lib.loadRebinds(root);
  const banks = new Map();
  const kinds = new Map();
  for (const row of data.records) {
    const source = byUid.get(row.questionUid);
    if (!source) continue;
    if (source.contentFingerprint === row.assignmentFingerprint) { kinds.set(row.questionUid, 'row'); continue; }
    if (!banks.has(row.sourceFile)) {
      const scope = { window: {}, console: { log() {}, warn() {}, error() {} } };
      vm.createContext(scope);
      vm.runInContext(read('exams/' + row.sourceFile).replace(/^﻿/, '').replace(/\r\n/g, '\n'), scope, { timeout: 5000 });
      banks.set(row.sourceFile, require('../archive/exam-source-reader.js').readQuestionArray(scope.window));
    }
    const question = banks.get(row.sourceFile)[row.sourceOrdinal - 1];
    kinds.set(row.questionUid, question ? lib.classifyMetaBinding({ meta: source, question, assignmentFingerprint: lib.contentFingerprint(question), rebinds }) : '');
  }
  return kinds;
}

test('a row whose stem and choices are confirmed as the same keeps its release status when only the solution, answer or figure changed', async () => {
  const data = await catalog();
  const meta = await metadata();
  const byUid = new Map(meta.records.map(row => [row.questionUid, row]));
  const kinds = await bindingKinds(data, byUid);
  // The harness catalog re-derives canonical reasons; the builder's own reason codes are in the published file.
  const published = new Map(core.decodeCatalog(JSON.parse(read('data/archive2-catalog.json'))).records.map(row => [row.questionUid, row]));
  const seen = { rowStale: 0, rowSolutionOnly: 0, typeOnly: 0, unbound: 0 };
  for (const row of data.records) {
    const source = byUid.get(row.questionUid);
    if (!source) continue;
    const kind = kinds.get(row.questionUid);
    const exact = source.sourceFingerprint === row.sourceFingerprint;
    const contentEqual = source.contentFingerprint === row.assignmentFingerprint;
    // Positive: a confirmed row binding is enough for the release status (a changed explanation/answer/figure is not a reason).
    if (kind === 'row') {
      assert.equal(row.sourceStatus, 'VERIFIED', 'row-bound rows are released: ' + row.questionUid);
      assert.notEqual(row.metaProjectionFailureReason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH', row.questionUid);
      assert.ok(!(published.get(row.questionUid).canonicalAssignmentReasons || []).includes('assignment_fingerprint_mismatch'), row.questionUid);
      if (!contentEqual) {
        seen.rowStale++;
        if (row.metaProjectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND')
          assert.equal(row.metaProjection.sourceBinding.bindingMode, 'CONTENT_BOUND_SOURCE_REVISED', row.questionUid);
      } else if (!exact) seen.rowSolutionOnly++;
      continue;
    }
    // Negative: a changed stem/choices (unconfirmed) or a type-only binding gets neither the assignment nor the display projection.
    if (kind === 'type') seen.typeOnly++; else seen.unbound++;
    if (!exact) {
      assert.equal(row.sourceStatus, 'HOLD', 'not confirmed as the same stem and choices: ' + row.questionUid);
      assert.ok(!row.assignmentEvidence, row.questionUid);
      assert.notEqual(row.metaProjectionStatus, 'DISPLAY_ONLY_SOURCE_BOUND', row.questionUid);
      assert.ok((published.get(row.questionUid).canonicalAssignmentReasons || []).length > 0, 'a refused assignment carries its reason: ' + row.questionUid);
    }
  }
  // Operating counts are not pinned; these guard against a vacuous run.
  assert.ok(seen.rowSolutionOnly > 0 && seen.typeOnly > 0 && seen.unbound > 0, JSON.stringify(seen));
});

test('a question that is released only by its row binding still passes the same strict gates, and unbound rows stay out of meta filtering', async () => {
  const data = await catalog();
  const meta = await metadata();
  const byUid = new Map(meta.records.map(row => [row.questionUid, row]));
  const content = data.records.filter(row => row.metaBinding && row.sourceStatus === 'VERIFIED' && row.metaHintPT &&
    byUid.get(row.questionUid)?.sourceFingerprint !== row.sourceFingerprint);
  assert.ok(content.length > 0, 'row-bound rows with a changed solution exist');
  for (const row of content.slice(0, 200)) {
    assert.equal(core.generalUseEligibility(row).ok, true);
    assert.ok(core.metaFacetsOf(row).pt);
    // Release status no longer blocks, but taxonomy/approval/review gates are unchanged.
    const reasons = core.basicEligibility(row, { canonicalAuthority: data.canonicalAuthority }).reasons;
    assert.ok(!reasons.includes('source_release'), row.questionUid);
    if (!row.assignmentEvidence) assert.ok(reasons.includes('taxonomy'), 'no assignment, no default selection: ' + row.questionUid);
  }
  const unbound = data.records.filter(row => !row.metaBinding && row.sourceStatus === 'HOLD');
  for (const row of unbound.slice(0, 200)) {
    assert.equal(core.metaFacetsOf(row), null);
    assert.equal(core.generalUseEligibility(row).ok, true, 'the question itself stays usable');
    assert.equal(core.metaFacetMatches(row, { metaPT: 'PT_ANY' }), false);
  }
});

test('recorded curriculum is read as recorded (never converted) and outranks the roll-out year rule', async () => {
  const data = await catalog();
  const meta = await metadata();
  const byUid = new Map(meta.records.map(row => [row.questionUid, row]));
  const lane = data.records.filter(row => row.metaHintCurriculum);
  assert.ok(lane.length > 0);
  let overridesYearRule = 0;
  for (const row of lane) {
    const source = byUid.get(row.questionUid);
    assert.equal(row.metaHintCurriculum, source.curriculumKey || source.curriculum);
    assert.match(row.metaHintCurriculum, /^(2015|2022)$/);
    if (!row.curriculumKey) {
      const original = Unified.originalCurriculum(row, row.effectiveBrowseGrade || row.sourceGrade);
      assert.equal(original.value, row.metaHintCurriculum);
      assert.equal(original.basis, 'approved-metadata');
      const withoutLane = Unified.originalCurriculum({ ...row, metaHintCurriculum: '' }, row.effectiveBrowseGrade || row.sourceGrade);
      if (withoutLane.value !== row.metaHintCurriculum) overridesYearRule++;
    } else if (row.curriculumKey === row.metaHintCurriculum) {
      // A newly approved canonical assignment still demonstrates the same
      // recorded-curriculum override; do not lose it from the denominator.
      const withoutRecorded = Unified.originalCurriculum(
        { ...row, curriculumKey: '', metaHintCurriculum: '' }, row.effectiveBrowseGrade || row.sourceGrade,
      );
      if (withoutRecorded.value !== row.curriculumKey) overridesYearRule++;
    }
  }
  assert.ok(overridesYearRule > 50, 'the recorded curriculum corrects year-rule guesses: ' + overridesYearRule);
  // a canonical key still wins, and an unrecorded curriculum falls back to the year rule
  const canonical = lane.find(row => row.curriculumKey);
  if (canonical) assert.equal(Unified.originalCurriculum({ ...canonical, metaHintCurriculum: canonical.curriculumKey === '2015' ? '2022' : '2015' }, canonical.sourceGrade).basis, 'canonical-key');
  assert.equal(Unified.originalCurriculum(record({ year: 2024 }), '고1').basis, 'high-year-rule');
});

// ---- core facets, filters, options -------------------------------------------------------------

test('facets keep a status per value and approvedOnly never counts a pending value as approved', () => {
  const a = record({ metaBinding: 'text', metaHintL3: '개념A', metaHintPT: 'PT_A', metaHintTPL: 'TPL_A', metaHintStatus: 'AAA' });
  const b = record({ metaBinding: 'text', metaHintL3: '개념A', metaHintPT: 'PT_A', metaHintTPL: 'TPL_B', metaHintStatus: 'APP' });
  const c = record({ metaBinding: 'text', metaHintPT: 'PT_C', metaHintStatus: '-P-' });
  const none = record();
  assert.equal(core.metaFacetsOf(none), null);
  assert.deepEqual({ ...core.metaFacetsOf(b) }, { l3: '개념A', pt: 'PT_A', tpl: 'TPL_B', l3Status: 'approved', ptStatus: 'pending', tplStatus: 'pending', binding: 'text' });
  assert.equal(core.metaFacetsOf(c).l3, '');
  // a hint without a readable code is pending, never approved
  const unreadable = record({ metaHintPT: 'PT_X' });
  assert.equal(core.metaFacetsOf(unreadable).ptStatus, 'pending');
  // filters
  const rows = [a, b, c, none];
  const pass = filters => rows.filter(row => core.metaFacetMatches(row, filters));
  assert.deepEqual(pass({ metaPT: 'PT_A' }), [a, b]);
  assert.deepEqual(pass({ metaPT: 'PT_A', metaTPL: 'TPL_B' }), [b]);
  assert.deepEqual(pass({ metaL3: '개념A' }), [a, b]);
  assert.deepEqual(pass({ metaPT: 'PT_A', ...approvedOnlyFilter }), [a], 'PT_A is approved only for the first row');
  assert.deepEqual(pass({ metaL3: '개념A', ...approvedOnlyFilter }), [a, b], 'the selected facet is approved in both rows');
  assert.deepEqual(pass(approvedOnlyFilter), [a], 'every recorded facet must be approved');
  assert.deepEqual(pass({}), rows);
  assert.equal(core.matches(a, { grade: '고1', metaPT: 'PT_A' }, { useMode: 'general' }), true);
  assert.equal(core.matches(c, { grade: '고1', metaPT: 'PT_A' }, { useMode: 'general' }), false);
});

test('facet options are faceted, labelled by the registry only, and report the status mix', () => {
  const rows = [
    record({ metaBinding: 'text', metaHintL3: 'L-1', metaHintPT: 'PT_A', metaHintTPL: 'TPL_A', metaHintStatus: 'AAA' }),
    record({ metaBinding: 'text', metaHintL3: 'L-1', metaHintPT: 'PT_A', metaHintTPL: 'TPL_B', metaHintStatus: 'APP' }),
    record({ metaBinding: 'text', metaHintL3: 'L-2', metaHintPT: 'PT_B', metaHintTPL: 'TPL_C', metaHintStatus: 'PPP' }),
    record({ metaBinding: 'text', metaHintPT: 'PT_UNNAMED', metaHintStatus: '-P-' }),
  ];
  const labels = { pt: { PT_A: '유형 가', PT_B: '유형 나' }, tpl: { TPL_A: '풀이 가', TPL_B: '풀이 나', TPL_C: '풀이 다' } };
  const labelOf = (kind, key) => labels[kind][key] || '';
  const all = core.metaFacetOptions(rows, {}, labelOf);
  assert.deepEqual(all.pt.map(option => [option.value, option.label, option.total, option.approved, option.pending]),
    [['PT_A', '유형 가', 2, 1, 1], ['PT_B', '유형 나', 1, 0, 1]], 'an unnamed key is never invented as an option');
  assert.equal(all.facetRecords, 4);
  assert.equal(core.metaFacetStatusText(all.pt[0]), '2문항 · 승인 1 · 검토 대기 1');
  assert.equal(core.metaFacetStatusText(all.pt[1]), '1문항 · 검토 대기');
  assert.equal(core.metaFacetStatusText({ total: 3, approved: 3, pending: 0 }), '3문항 · 승인');
  // faceted: picking a type narrows the template list but keeps the type list intact
  const picked = core.metaFacetOptions(rows, { metaPT: 'PT_A' }, labelOf);
  assert.deepEqual(picked.tpl.map(option => option.value), ['TPL_A', 'TPL_B']);
  assert.deepEqual(picked.pt.map(option => option.value), ['PT_A', 'PT_B']);
  assert.deepEqual(core.metaFacetOptions(rows, { metaL3: 'L-2' }, labelOf).pt.map(option => option.value), ['PT_B']);
  assert.deepEqual(core.metaFacetOptions(rows, approvedOnlyFilter, labelOf).pt.map(option => option.value), ['PT_A']);
});

test('one difficulty lane: an integer bucket is usable in every mode unless a real defect applies', () => {
  const base = {
    sourceStatus: 'HOLD', metaBinding: 'text', difficultyBucket: 3, difficultyConfidence: 'high',
    difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL', metadataConflicts: [],
  };
  const row = extra => record({ ...base, ...extra });
  // content-bound values still describe the question: usable regardless of option or caller
  for (const options of [undefined, { useMode: 'strict' }, { useMode: 'general' }])
    assert.equal(core.difficultyEligible(row(), options), true);
  // confidence/boundary/compatibility/approval/conflict markers are labels, never gates
  assert.equal(core.difficultyEligible(row({ difficultyConfidence: '' })), true);
  assert.equal(core.difficultyEligible(row({ difficultyBoundaryFlag: undefined, legacyLevelCompatibility: 'BORDERLINE_REVIEW' })), true);
  assert.equal(core.difficultyEligible(row({ metadataConflicts: ['difficultyBucket'] })), true);
  assert.equal(core.difficultyEligible(row({ sourceStatus: 'VERIFIED', metaBinding: 'text' })), true);
  // no binding is a label: an unbound integer bucket stays usable
  for (const options of [undefined, { useMode: 'general' }])
    assert.equal(core.difficultyEligible(row({ metaBinding: '', sourceStatus: 'HOLD' }), options), true);
  // real defects: a word instead of an integer, broken identity/source reference
  for (const options of [undefined, { useMode: 'general' }]) {
    assert.equal(core.difficultyEligible(row({ identityStatus: 'UNRESOLVED' }), options), false);
    assert.equal(core.difficultyEligible(row({ difficultyBucket: '중' }), options), false, 'no word-to-number conversion');
    assert.equal(core.difficultyEligible(row({ sourceIntegrityStatus: 'MISMATCH' }), options), false);
  }
  for (const mode of ['general', 'strict'])
    assert.equal(core.matches(row(), { grade: '고1', difficultyBuckets: [3] }, { useMode: mode }), true);
  assert.equal(core.matches(row({ metaBinding: '' }), { grade: '고1', difficultyBuckets: [3] }, { useMode: 'general' }), true);
  assert.equal(core.matches(row({ sourceIntegrityStatus: 'MISMATCH' }), { grade: '고1', difficultyBuckets: [3] }, { useMode: 'general' }), false);
});

// ---- type diversity ----------------------------------------------------------------------------

function requestFor(rows, count, extra = {}) {
  const uids = rows.map(row => row.questionUid);
  const unitPath = core.pathKey(rows[0], 4);
  return {
    filters: { grade: '고1', scopeQuestionUids: uids, primaryPaths: [unitPath] },
    rows: [{ id: 'unit', count, paths: [unitPath], depth: 4, scopeQuestionUids: uids }],
    useMode: 'general', seed: 'diversity-seed', ...extra,
  };
}

test('a new type of an earlier year comes before a repeated type of the newest year, and the count never changes', () => {
  // 2025: 6 questions of ONE type + 3 other types; 2024 holds 3 more types. Request 5.
  // Four types exist in 2025; before this rule the 5th question was a forced repeat of the 2025 type,
  // now it is the newest question of a type the paper does not have yet (an earlier year).
  const types = ['PT_A', 'PT_A', 'PT_A', 'PT_A', 'PT_A', 'PT_A', 'PT_B', 'PT_C', 'PT_D'];
  const y2025 = types.map(type => record({ year: 2025, metaBinding: 'text', metaHintPT: type, metaHintStatus: '-P-' }));
  const y2024 = ['PT_E', 'PT_F', 'PT_G'].map(type => record({ year: 2024, metaBinding: 'text', metaHintPT: type, metaHintStatus: '-P-' }));
  const rows = [...y2025, ...y2024];
  for (const seed of ['s1', 's2', 's3', 's4', 's5']) {
    const result = core.selectBlueprint(rows, requestFor(rows, 5, { seed }));
    assert.equal(result.ok, true);
    assert.equal(result.selected.length, 5);
    assert.equal(result.selected.filter(row => row.year === 2025).length, 4, 'the newest year still supplies every type it has');
    assert.equal(result.selected.filter(row => row.year === 2024).length, 1);
    assert.equal(result.diagnostics.typeCoverage.typedCount, 5);
    assert.equal(result.diagnostics.typeCoverage.distinctTypes, 5, 'no type repeats while an unused type exists');
    assert.equal(result.diagnostics.typeCoverage.repeatedCount, 0);
  }
  // 11 of 12: all 7 types first (newest question of each), then the 4 forced repeats come from the
  // newest year's only repeatable type, so the count is met and the year order is still newest first
  const spill = core.selectBlueprint(rows, requestFor(rows, 11, { seed: 'spill' }));
  assert.equal(spill.selected.length, 11);
  assert.equal(spill.selected.filter(row => row.year === 2025).length, 8);
  assert.equal(spill.selected.filter(row => row.year === 2024).length, 3);
  assert.equal(spill.diagnostics.typeCoverage.distinctTypes, 7);
});

test('without recorded types the selection is byte-identical to the previous behaviour', () => {
  const plain = Array.from({ length: 12 }, (_, i) => record({ year: i < 6 ? 2025 : 2023 }));
  const typed = plain.map(row => ({ ...row, metaBinding: 'text', metaHintPT: '', metaHintStatus: '' }));
  const a = core.selectBlueprint(plain, requestFor(plain, 7, { seed: 'same' }));
  const b = core.selectBlueprint(typed, requestFor(typed, 7, { seed: 'same' }));
  assert.deepEqual(a.selected.map(row => row.questionUid), b.selected.map(row => row.questionUid));
  assert.deepEqual(a.selected.map(row => row.year), [...a.selected.map(row => row.year)].sort((x, y) => core.recencyRank(x) - core.recencyRank(y)));
});

test('earlier rows and pins count as used types and a type is only repeated when no alternative exists in the year', () => {
  const make = (type, year = 2025) => record({ year, metaBinding: 'text', metaHintPT: type, metaHintStatus: '-A-' });
  const rows = [make('PT_A'), make('PT_A'), make('PT_B'), make('PT_B'), make('PT_C')];
  const uids = rows.map(row => row.questionUid);
  const unitPath = core.pathKey(rows[0], 4);
  const request = {
    filters: { grade: '고1', scopeQuestionUids: uids, primaryPaths: [unitPath] },
    rows: [{ id: 'r1', count: 2, paths: [unitPath], depth: 4, scopeQuestionUids: uids }, { id: 'r2', count: 2, paths: [unitPath], depth: 4, scopeQuestionUids: uids }],
    pins: [{ questionUid: rows[0].questionUid, rowId: 'r1' }],
    useMode: 'general', seed: 'rows',
  };
  const result = core.selectBlueprint(rows, request);
  assert.equal(result.ok, true);
  const types = result.selected.map(row => core.selectionTypeKey(row));
  assert.equal(types.length, 4);
  // 4 slots over 3 types: every type is used and exactly one repeat is forced
  assert.deepEqual([...new Set(types)].sort(), ['PT_A', 'PT_B', 'PT_C']);
  assert.equal(result.diagnostics.typeCoverage.repeatedCount, 1);
  // the pinned type counts as used: the other question of the pin's row is a different type
  const firstRow = result.selected.filter(row => row.rowId === 'r1').map(row => core.selectionTypeKey(row));
  assert.ok(firstRow.includes('PT_A') && firstRow.some(type => type !== 'PT_A'), firstRow.join());
});

// ---- display projection ------------------------------------------------------------------------

test('display projection: exact bytes by default; content-bound only on opt-in and labelled; changed stems never', async () => {
  const meta = await metadata();
  const identity = JSON.parse(read('data/question_identity_map.json'));
  const data = await catalog();
  const policy = JSON.parse(read('data/archive2-canonical-projection-policy.json'));
  const links = JSON.parse(read('data/basic-scope-parent-links.json'));
  const idByUid = new Map(identity.records.map(row => [row.questionUid, row]));
  const metaByUid = new Map(meta.records.map(row => [row.questionUid, row]));
  const projected = data.records.find(row => row.metaBinding && metaByUid.get(row.questionUid)?.contentFingerprint === row.assignmentFingerprint &&
    metaByUid.get(row.questionUid)?.sourceFingerprint !== row.sourceFingerprint && row.metaProjectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND');
  assert.ok(projected, 'a content-bound record is now projected');
  assert.equal(projected.metaProjection.sourceBinding.bindingMode, 'CONTENT_BOUND_SOURCE_REVISED');
  assert.equal(projected.metaProjection.sourceBinding.approvedSourceFingerprint, metaByUid.get(projected.questionUid).sourceFingerprint);
  assert.notEqual(projected.metaProjection.sourceBinding.approvedSourceFingerprint, projected.sourceFingerprint);
  const exact = data.records.find(row => row.metaBinding && metaByUid.get(row.questionUid)?.sourceFingerprint === row.sourceFingerprint && row.metaProjectionStatus === 'DISPLAY_ONLY_SOURCE_BOUND');
  assert.equal(exact.metaProjection.sourceBinding.bindingMode, 'EXACT');
  const input = row => ({
    meta: metaByUid.get(row.questionUid), identity: idByUid.get(row.questionUid), sourceFile: row.sourceFile,
    sourceOrdinal: row.sourceOrdinal, sourceGrade: row.sourceGrade, sourceFingerprint: row.sourceFingerprint,
    assignmentFingerprint: row.assignmentFingerprint, gradeCourseAllowlist: policy.gradeCourseAllowlist,
    scopeParents: links.records || [], canonicalParents: data.canonicalAuthority.canonicalParents,
  });
  const base = input(projected);
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection(base).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH', 'default stays strict');
  const optIn = ProblemBankMeta.createSourceBoundDisplayProjection({ ...base, allowContentBoundRevision: true });
  assert.equal(optIn.reason, '');
  assert.equal(optIn.projection.sourceBinding.bindingMode, 'CONTENT_BOUND_SOURCE_REVISED');
  const changedStem = { ...base, assignmentFingerprint: 'a'.repeat(64), allowContentBoundRevision: true };
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection(changedStem).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection({ ...base, sourceFingerprint: '', allowContentBoundRevision: true }).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
  // textBound: the builder confirmed the row is about the same stem and choices (text-v1), so a changed content fingerprint (e.g. a figure) does not refuse the
  // projection. It only works together with the content-bound opt-in, and never without the caller's confirmation.
  const figureChanged = { ...base, assignmentFingerprint: 'a'.repeat(64) };
  const confirmed = ProblemBankMeta.createSourceBoundDisplayProjection({ ...figureChanged, allowContentBoundRevision: true, textBound: true });
  assert.equal(confirmed.reason, '');
  assert.equal(confirmed.projection.sourceBinding.bindingMode, 'CONTENT_BOUND_SOURCE_REVISED');
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection({ ...figureChanged, allowContentBoundRevision: true }).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection({ ...figureChanged, textBound: true }).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
  assert.equal(ProblemBankMeta.createSourceBoundDisplayProjection({ ...figureChanged, allowContentBoundRevision: true, textBound: false }).reason, 'DISPLAY_PROJECTION_FINGERPRINT_MISMATCH');
});

// ---- registration verifier ---------------------------------------------------------------------

test('--verify-projection verifies lane-bound records through the lane and the runtime row, and still fails real drift', async () => {
  const { verifyConsumerValues } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  const uid = uidFor('verify');
  const file = 'original/high/h2/2final/23_복성고_2학기_기말_고2_확률과통계.js';
  const registered = {
    questionUid: uid, sourceArchiveFile: file, sourceOrdinal: 1, standardCourse: '확률과 통계', standardUnitKey: 'H15-PS-03',
    subUnitKey: 'H15-PS-03-PROBABILITY_BASIC', curriculumKey: '2015', courseKey: '확률과 통계', L1: '확률', L2: '확률의 뜻과 활용',
    L3: '확률의 기본 성질과 활용', L4: '사건의 관계', problemTypeKey: 'PT_X', templateKey: 'TPL_X', crossConceptKeys: ['CC_A'],
    conditionKeys: [], integrationPattern: null, difficultyBucket: null, level: '중', metadataApprovalType: 'META_PIPELINE_AUDIT',
  };
  const runtime = { ...registered };
  const consumer = {
    questionUid: uid, sourceFile: file, sourceOrdinal: 1, canonicalAssignmentReasons: ['assignment_missing'], metaBinding: 'text',
    curriculumKey: '', courseKey: '', L1: '', L2: '', standardUnitKey: '', subUnitKey: '', problemTypeKey: '', templateKey: '', L3: '', L4: '',
    crossConceptKeys: ['CC_A'], conditionKeys: [], difficultyBucket: 'UNKNOWN',
    metaHintCurriculum: '2015', metaHintPT: 'PT_X', metaHintTPL: 'TPL_X', metaHintL3: registered.L3, metadataConflicts: [],
    metaProjection: { projectionStatus: 'DISPLAY_ONLY_SOURCE_BOUND', courseKey: '확률과통계', L1: '확률', L2: '확률의 뜻과 활용', standardUnitKey: 'H15-PS-03', subUnitKey: 'H15-PS-03-PROBABILITY_BASIC' },
  };
  const run = (override = {}, runtimeOverride = {}) => verifyConsumerValues(root, [registered], [{ ...runtime, ...runtimeOverride }], { records: [{ ...consumer, ...override }] });
  // the search index check needs the production index; use a record that exists there
  const index = (() => {
    const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
    vm.createContext(ctx);
    vm.runInContext(read('question-index.js'), ctx);
    return ctx.window.questionIndex.find(row => row.sourceFile === file && row.sourceOrdinal === 1);
  })();
  assert.ok(index);
  Object.assign(registered, { standardUnitKey: index.standardUnitKey, subUnitKey: index.subUnitKey, level: index.level, standardCourse: index.course });
  Object.assign(runtime, registered);
  Object.assign(consumer.metaProjection, { standardUnitKey: index.standardUnitKey, subUnitKey: index.subUnitKey });
  const lanes = run();
  assert.deepEqual({ ...lanes }, { canonical: 0, usableMetaLane: 1 });
  // real drift still fails
  assert.throws(() => run({ metaHintPT: 'PT_OTHER' }), /usable-meta lane mismatch/);
  assert.throws(() => run({ metaHintCurriculum: '2022' }), /usable-meta lane mismatch/);
  assert.throws(() => run({ metaProjection: { ...consumer.metaProjection, L1: '다른 단원' } }), /usable-meta lane mismatch/);
  // a field the lane does not expose is verified against the exact active runtime row
  assert.doesNotThrow(() => run({ metaProjection: null }));
  assert.throws(() => run({ metaProjection: null }, { courseKey: '다른 과목' }), /Consumer runtime metadata mismatch/);
  assert.throws(() => run({ metaBinding: '' }), /Consumer metadata mismatch/, 'an unbound row is never lane-verified');
  assert.throws(() => run({ canonicalAssignmentReasons: [] }), /Consumer metadata mismatch/, 'a canonical record must be canonical');
  assert.throws(() => run({ metadataConflicts: ['level'] }), /Consumer metadata conflict/);
  assert.doesNotThrow(() => run({ metadataConflicts: ['reviewStatus'] }), 'the source review annotation is not a metadata conflict');
  assert.throws(() => run({ difficultyBucket: 3 }), /Consumer metadata mismatch/);
  // a canonical value that exists must equal the request
  assert.throws(() => run({ curriculumKey: '2022' }), /Consumer metadata mismatch/);
});

// ---- 단원별 기출 -------------------------------------------------------------------------------

test('단원별 기출 facets: statuses, faceted lists, approved-only, and lane-bound records stay selectable', () => {
  const mk = (n, extra) => ({
    questionUid: uidFor('unit' + n), sourceFile: 'original/high/h1/1.js', sourceQuestionNo: String(n), subUnitKey: 'H22-C2-01-X', subUnitParentKey: 'H22-C2-01',
    difficultyBucket: '중', generalUseEligible: true, metaFoundationOwnedScope: true, metaFoundationTaxonomyValid: false,
    metaFacetBound: true, ...extra,
  });
  const records = [
    mk(1, { conceptLabel: '개념 A', problemTypeKey: 'PT_A', problemTypeLabel: '유형 가', templateKey: 'TPL_A', templateLabel: '풀이 가', metaFacetStatus: { l3: 'approved', pt: 'approved', tpl: 'approved' } }),
    mk(2, { conceptLabel: '개념 A', problemTypeKey: 'PT_A', problemTypeLabel: '유형 가', templateKey: 'TPL_B', templateLabel: '풀이 나', metaFacetStatus: { l3: 'approved', pt: 'pending', tpl: 'pending' } }),
    mk(3, { conceptLabel: '개념 B', problemTypeKey: 'PT_B', problemTypeLabel: '유형 나', metaFacetStatus: { l3: 'pending', pt: 'pending' } }),
    mk(4, {}),
  ];
  // a broken Meta Foundation chain does not disable facet selection for lane-bound records
  assert.equal(UnitCore.isProblemTypeSelectable(records[0]), true);
  assert.equal(UnitCore.isProblemTypeSelectable({ ...records[0], metaFacetBound: false }), false, 'legacy join keeps the old taxonomy gate');
  const concepts = UnitCore.getConceptOptions(records, {});
  assert.deepEqual(concepts.map(option => [option.key, option.count, option.approved, option.pending]), [['개념 A', 2, 2, 0], ['개념 B', 1, 0, 1]]);
  const types = UnitCore.getProblemTypeOptions(records, {});
  assert.deepEqual(types.map(option => [option.key, option.label, option.approved, option.pending]), [['PT_A', '유형 가', 1, 1], ['PT_B', '유형 나', 0, 1]]);
  assert.equal(UnitCore.facetStatusText(types[0]), '2문항 · 승인 1 · 검토 대기 1');
  assert.deepEqual(UnitCore.getTemplateOptions(records, { conceptLabels: ['개념 A'] }).map(option => option.key).sort(), ['TPL_A', 'TPL_B']);
  assert.deepEqual(UnitCore.getProblemTypeOptions(records, { conceptLabels: ['개념 B'] }).map(option => option.key), ['PT_B']);
  const filter = filters => UnitCore.filterUnitRecords(records, { includeUnclassified: true, ...filters }).map(row => row.sourceQuestionNo);
  assert.deepEqual(filter({ conceptLabels: ['개념 A'] }), ['1', '2']);
  assert.deepEqual(filter({ problemTypeKeys: ['PT_A'], templateKeys: ['TPL_B'] }), ['2']);
  assert.deepEqual(filter({ conceptLabels: ['개념 A'], approvedOnly: true }), ['1', '2']);
  assert.deepEqual(filter({ problemTypeKeys: ['PT_A'], approvedOnly: true }), ['1']);
  assert.deepEqual(filter({ approvedOnly: true }), ['1']);
  assert.deepEqual(filter({}), ['1', '2', '3', '4']);
  // blueprint rows carry the concept
  const plan = UnitCore.selectByBlueprint(records, [{ conceptLabel: '개념 A', problemTypeKey: 'PT_A', count: 2 }], { includeUnclassified: true });
  assert.equal(plan.selectedCount, 2);
  assert.equal(plan.rows[0].conceptLabel, '개념 A');
});

test('단원별 기출 page joins facets only from the final catalog lane, with status', () => {
  const js = read('unit-past-exams.js');
  assert.match(js, /facets: typeof archive2\.metaFacetsOf === 'function'/);
  assert.match(js, /metaFacetBound: true/);
  // The old 세분 출제 form (per-row concept/type/template lists and the 승인된 분류만 box) is gone from this page; the
  // type filter comes back inside the unit x step table in the next change. An old address that still carries
  // `metaApproved` is cleaned from the URL, and the lane join above keeps feeding the catalog the table counts.
  assert.doesNotMatch(js, /data-field="conceptLabel"|id="unit-approved-meta"|renderAdvancedRows/);
  assert.match(js, /LEGACY_URL_PARAMS[\s\S]{0,400}'metaApproved'/);
});

// ---- 문제지 만들기 UI ---------------------------------------------------------------------------

function composeHarness(data, labels) {
  const events = new Map(), nodes = new Map(), storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', textContent: '', dataset: {}, setAttribute() {}, addEventListener() {}, querySelectorAll: () => [],
      classList: { toggle() {}, add() {}, remove() {} }, close() {}, showModal() {},
    });
    return nodes.get(id);
  };
  const ctx = vm.createContext({
    console, crypto, URL, URLSearchParams, structuredClone,
    location: new URL('https://archive.test/archive/workspace.html'), history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {}, setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }), queueMicrotask() {},
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      baseURI: 'https://archive.test/archive/workspace.html', getElementById: node, querySelector: () => null,
      querySelectorAll: () => [], body: { dataset: {} },
      addEventListener: (name, callback) => { if (!events.has(name)) events.set(name, []); events.get(name).push(callback); },
    },
    addEventListener() {},
    fetch: async () => ({ ok: true, json: async () => ({}) }),
    Archive2Core: core, Archive2UnifiedUnits: Unified, ProblemBankMeta, Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'), Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'), Archive2Source: archiveSource,
    ARCHIVE_META_FOUNDATION_LABELS: labels,
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    render = () => {};
    save = () => {};
    globalThis.workspaceTest = {state, scopeOptions, selectedScopeOptions, request, planRows, generate, renderComposition,
      composeMetaFacets, metaTypeText, unifiedIndex, renderInspector, invalidate};
  `);
  const w = ctx.workspaceTest;
  w.state.catalog = data;
  w.state.useMode = 'general';
  w.state.byUid = new Map(data.records.map(row => [row.questionUid, row]));
  w.state.finderIndex = core.buildFinderIndex(data);
  w.state.indexVersion = data.indexVersion;
  return {
    w, ctx,
    async change(group, filter, value, extra = {}) {
      for (const callback of events.get('change') || [])
        await callback({ target: { dataset: { group, filter }, value, ...extra } });
    },
  };
}
const registryLabels = () => {
  const registry = taxonomy();
  return {
    problemTypes: Object.fromEntries(registry.problemTypes.filter(row => row.status === 'ACTIVE').map(row => [row.problemTypeKey, row.canonicalLabelKo])),
    templates: Object.fromEntries(registry.templates.filter(row => row.status === 'ACTIVE').map(row => [row.templateKey, { label: row.canonicalLabelKo, parentProblemTypeKey: row.parentProblemTypeKey }])),
  };
};

test('문제지 만들기: 세부 조건 offers 개념/유형/풀이 with statuses on the unified units; selecting a type narrows units, request and paper', async () => {
  const data = await catalog();
  const { w, change } = composeHarness(data, registryLabels());
  w.state.filters = { grade: '고1', semanticSubject: 'COMMON_MATH_2' };
  const scopes = w.scopeOptions();
  const unit = scopes.find(scope => !scope.unclassified && /도형|함수|집합|명제/.test(scope.label) && scope.count > 40) || scopes.find(scope => !scope.unclassified);
  w.state.scopes = [unit.key];
  const facets = w.composeMetaFacets();
  assert.ok(facets.pt.length > 0 && facets.tpl.length > 0 && facets.l3.length > 0, 'the unit offers recorded concept/type/template options');
  assert.ok(facets.poolSize === unit.facetQuestionUids.length);
  const html = w.renderComposition();
  const detail = html.split('<details class="compose-detail cz-detail"')[1];
  for (const field of ['metaL3', 'metaPT', 'metaTPL', 'metaApprovedOnly']) assert.match(detail, new RegExp('data-filter="' + field + '"'));
  assert.match(detail, /검토 대기|승인/);
  assert.ok(!/data-filter="L3"/.test(detail), 'the strict pair is only shown for an older draft');
  // pick the type with the most questions and generate
  const type = [...facets.pt].sort((a, b) => b.total - a.total)[0];
  await change('compose', 'metaPT', type.value);
  assert.equal(w.state.filters.metaPT, type.value);
  const narrowed = w.scopeOptions().find(scope => scope.key === unit.key);
  assert.equal(narrowed.count, type.total, 'unit count follows the selected type');
  const request = w.request();
  assert.ok(!('metaPT' in request.filters) && !Object.keys(request.filters).some(key => /^meta/.test(key)), 'saved-paper filters stay inside the server contract');
  assert.deepEqual([...request.filters.scopeQuestionUids].sort(), [...narrowed.scopeQuestionUids].sort());
  w.state.distribution = 'pool';
  w.state.count = Math.min(5, type.total);
  const result = core.selectBlueprint(data.records, w.request(), {});
  assert.equal(result.ok, true);
  for (const row of result.selected) assert.equal(core.metaFacetsOf(row).pt, type.value);
  assert.ok(w.metaTypeText(result.selected[0]).includes(registryLabels().problemTypes[type.value]), 'preview rows show the type label');
  // template list follows the chosen type; changing the type resets the template
  const afterType = w.composeMetaFacets();
  assert.ok(afterType.tpl.every(option => registryLabels().templates[option.value].parentProblemTypeKey === type.value));
  w.state.filters.metaTPL = afterType.tpl[0].value;
  await change('compose', 'metaPT', '');
  assert.equal(w.state.filters.metaTPL, '', 'a new type resets the template');
  // approved-only
  await change('compose', 'metaApprovedOnly', '', { type: 'checkbox', checked: true });
  assert.equal(w.state.filters.metaApprovedOnly, '1');
  const approved = w.composeMetaFacets();
  for (const option of [...approved.l3, ...approved.pt, ...approved.tpl]) assert.equal(option.pending, 0);
  // a selection that no longer exists in the units is dropped, never kept as an invisible filter
  w.state.filters.metaApprovedOnly = '';
  w.state.filters.metaPT = 'PT_NOT_IN_THESE_UNITS';
  assert.equal(w.composeMetaFacets().cleared, true);
  assert.equal(w.state.filters.metaPT, '');
});

test('문제지 만들기: facets are counted for the whole list while no unit is selected and clear when grade or subject changes', async () => {
  const data = await catalog();
  const { w, change } = composeHarness(data, registryLabels());
  w.state.filters = { grade: '고1', semanticSubject: 'COMMON_MATH_1' };
  const wide = w.composeMetaFacets();
  assert.ok(wide.pt.length > 20);
  const type = wide.pt[0];
  w.state.filters.metaPT = type.value;
  const shown = w.scopeOptions();
  assert.equal(shown.reduce((sum, scope) => sum + scope.count, 0) <= type.total, true);
  assert.ok(shown.every(scope => scope.count > 0 || w.state.filters.metaPT), 'listed units follow the selection');
  await change('compose', 'semanticSubject', 'COMMON_MATH_2');
  assert.equal(w.state.filters.metaPT, '');
  assert.equal(w.state.filters.metaApprovedOnly, '');
});

test('the workspace and the unit page load the new scripts with a new cache version and the changed shared modules stay loadable in APMS', () => {
  const version = '20261029-s14-1';
  const coreVersion = '20261119-pair-type-spread-1';
  const workspace = read('workspace.html');
  assert.match(workspace, new RegExp('archive2-core\\.js\\?v=' + coreVersion));
  assert.match(workspace, /unit-past-exams-core\.js\?v=20261117-middle-parent-1/);
  assert.match(workspace, new RegExp('problem-bank-meta\\.js\\?v=' + version));
  // The shared unit layer and the canonical authority moved on with the registered textbooks (S11).
  assert.match(workspace, /archive2-unified-units\.js\?v=20261117-middle-parent-1/);
  assert.match(workspace, /archive2-canonical\.js\?v=20261104-source-meta-approval-1/);
  // The workspace itself moved on with the final-check fixes (S10).
  assertWorkspaceScriptVersions(assert);
  const unitPage = read('unit-past-exams.html');
  assert.match(unitPage, new RegExp('archive2-core\\.js\\?v=' + coreVersion));
  assert.match(unitPage, /unit-past-exams-core\.js\?v=20261117-middle-parent-1/);
  assert.match(unitPage, /unit-past-exams\.js\?v=20261118-q01-id-match-1/);
  assert.match(read('problem-bank-search.html'), new RegExp('archive2-core\\.js\\?v=' + coreVersion));
  assert.match(read('problem-bank-search.html'), new RegExp('problem-bank-meta\\.js\\?v=' + version));
  const clinic = fs.readFileSync(path.join(root, 'apmath/js/clinic-print.js'), 'utf8');
  // ExamSourceReader must load before Archive2Source in the clinic print loader.
  assert.ok(clinic.indexOf("'exam-source-reader'") > 0 && clinic.indexOf("'exam-source-reader'") < clinic.indexOf("'archive2-source'"));
  assert.match(clinic, new RegExp('archive2-core\\.js\\?v=' + coreVersion));
  assert.match(clinic, new RegExp('problem-bank-meta\\.js\\?v=' + version));
  // APMS moved clinic-print.js on with the clinic workspace (M7, 2026-11-02).
  assert.match(fs.readFileSync(path.join(root, 'apmath/index.html'), 'utf8'), /clinic-print\.js\?v=(20261102-(ws-clinic|perf)-1|20261117-reader-1|20261119-pair-type-spread-1|20261119-source-parallel-1)/);
});
