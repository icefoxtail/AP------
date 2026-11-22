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
const catalogEvidence = require('../archive/tools/archive2-catalog-evidence.cjs');
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
  const stats = { hint: 0, pt: 0, tpl: 0, l3: 0, bound: 0, unbound: 0, staleShown: 0 };
  const textBound = [];
  for (const row of data.records) {
    const source = byUid.get(row.questionUid);
    assert.ok(source, row.questionUid);
    const hasHint = Boolean(row.metaHintPT || row.metaHintTPL || row.metaHintL3);
    // 등록부에 없는 유형 키는 결속과 상관없이 화면에 쓰지 않는다(숨기는 이유는 이것뿐이다).
    if (source.problemTypeKey && !activePt.has(source.problemTypeKey))
      assert.notEqual(row.metaHintPT, source.problemTypeKey, 'a PT key that is not in the registry is never shown: ' + row.questionUid);
    // binding: exact bytes, or only the answer/solution changed (content fingerprint equal)
    const contentEqual = source.contentFingerprint === row.assignmentFingerprint;
    const exact = source.sourceFingerprint === row.sourceFingerprint && contentEqual;
    // A single binding value: the row's metadata is about the same stem+choices as today. Rows whose content fingerprint matches are bound for
    // sure; the others (stale fingerprint) are re-derived below with the same library the builder uses.
    if (contentEqual) assert.ok(row.metaBinding, row.questionUid + ' content-bound row must be bound');
    else if (row.metaBinding) textBound.push(row);
    if (!row.metaBinding) {
      // 사용자 결정 2026-11-22: 유형을 판정한 뒤 발문·보기가 바뀐 문항(지문이 판정 당시와 다른 stale 결속)도 등록된 유형(PT/TPL)은 화면에 쓴다(수정 프로토콜이 최소 수정이라
      // 유형이 크게 바뀌지 않는다). 숨기는 이유는 "키가 등록부에 없음"뿐이다. 개념(L3)·교육과정은 결속이 확인된 행에서만 싣는다.
      assert.ok(!row.metaHintL3 && !row.metaHintCurriculum, 'unbound rows carry no concept or curriculum: ' + row.questionUid);
      if (row.metaHintPT) {
        assert.equal(row.metaHintPT, source.problemTypeKey, row.questionUid);
        assert.ok(activePt.has(row.metaHintPT), 'only a registered PT is shown: ' + row.questionUid);
        assert.equal(core.metaFacetMatches(row, { metaPT: row.metaHintPT }), true, 'a recorded type of a changed question matches the type filter: ' + row.questionUid);
        stats.staleShown++;
      } else {
        assert.ok(!row.metaHintTPL, row.questionUid);
        assert.equal(core.metaFacetsOf(row), null, 'no registered type: no facet: ' + row.questionUid);
        assert.equal(core.metaFacetMatches(row, { metaPT: source.problemTypeKey || 'PT_ANY' }), false, row.questionUid);
      }
      if (row.metaHintTPL) {
        assert.equal(row.metaHintTPL, source.templateKey, row.questionUid);
        assert.equal(activeTpl.get(row.metaHintTPL).parentProblemTypeKey, row.metaHintPT, 'TPL parent must be the PT');
      }
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
  // staleShown는 카탈로그를 다시 만들어야 생기므로(등록기가 병합 뒤 만든다) 0이어도 실패로 보지 않는다.
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
    // 2026-11-22: a recorded, registered type is shown even when the stem/choices changed; nothing else is.
    if (row.metaHintPT) assert.ok(!core.metaFacetsOf(row).l3, row.questionUid);
    else assert.equal(core.metaFacetsOf(row), null);
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

// metaHintUnit(표시 전용 단원 힌트, 2026-11-22 중2~고2로 확대): 승인된 유형(PT)의 ACTIVE 연결이 같은 학년에서 통합 단원 하나만 가리키면 그 단원을, 여럿이면 통합 단원 프로필 순서상
// 마지막 단원을 싣는다(사용자 결정 2026-11-22). 과목이 여럿인 학년은 문항의 과목 안 단원들 중에서만 고르고, 과목을 못 정하거나 그 과목 안에 연결 단원이 없으면 싣지 않는다.
// 소비(unitFor)는 원본의 단원 값으로 단원을 못 정한 문항에만 쓰고, 원본으로 정해지는 문항의 결과는 바꾸지 않는다.
const hintLib = () => import(pathToFileURL(path.join(root, 'archive/tools/unit-hint-lib.mjs')).href);
const hinterFor = async bindings => {
  const { createUnitHinter } = await hintLib();
  const tags = JSON.parse(read('data/master_tables/js_archive_tag_master.json')).filter(row => row.status === 'active');
  return createUnitHinter({
    bindings,
    unitLabelByKey: new Map(tags.filter(row => row.keyType === 'standardUnitKey').map(row => [row.key, row.labelKo])),
    subUnitLabelByKey: new Map(tags.filter(row => row.keyType === 'subUnitKey').map(row => [row.key, row.subUnit])),
  });
};
const bind = (problemTypeKey, standardUnitKey, subUnitKey = '', status = 'ACTIVE') => ({ problemTypeKey, standardUnitKey, subUnitKey, status });

test('unit hint rule: one unit -> that unit, several -> last unit in profile order (within the question subject), other grade/inactive/off subject -> not hinted', async () => {
  const hinter = await hinterFor([
    bind('PT_ONE', 'M3-05', 'M3-05-TRIG_RATIO'), bind('PT_ONE', 'M3-05', 'M3-05-TRIG_RATIO_APPLICATION'),
    bind('PT_OLDKEY', 'M2-05', 'M2-05-TRIANGLE_PROPERTIES'),
    bind('PT_SPLIT', 'M2-05', 'M2-05-TRIANGLE_PROPERTIES'), bind('PT_SPLIT', 'M2-05', 'M2-05-QUADRILATERAL_PROPERTIES'),
    bind('PT_OTHERGRADE', 'M1-01', 'M1-01-X'),
    bind('PT_INACTIVE', 'M3-05', 'M3-05-TRIG_RATIO', 'RETIRED'),
    bind('PT_H1_SAME', 'H15-SA-02'), bind('PT_H1_SAME', 'H22-C-02'),
    bind('PT_H1_SPLIT', 'H22-C-02'), bind('PT_H1_SPLIT', 'H22-C-03'),
    bind('PT_H2', 'H15-M2-03'),
    bind('PT_H1_UNMAPPED', 'H22-C-02'), bind('PT_H1_UNMAPPED', 'H22-C-77'),
    bind('PT_H1_ALL_UNMAPPED', 'H22-C-77'),
    bind('PT_H1_CROSS', 'H22-C-03'), bind('PT_H1_CROSS', 'H22-C2-02'), bind('PT_H1_CROSS', 'H22-C2-01'),
    bind('PT_H1_ONLY_C1', 'H22-C-02'), bind('PT_H1_ONLY_C1', 'H22-C-05'),
    bind('PT_H2_MULTI', 'H22-M1-03'), bind('PT_H2_MULTI', 'H22-M1-05'), bind('PT_H2_MULTI', 'H22-M1-04'),
    bind('PT_H2_CROSS', 'H22-A-04'), bind('PT_H2_CROSS', 'H22-M1-03'),
    bind('PT_H1_MOVED', 'H22-C-08'), bind('PT_H1_UNMATCHED', 'H22-C-02'),
    bind('PT_H2_MULTI_UNMAPPED', 'H22-M1-03'), bind('PT_H2_MULTI_UNMAPPED', 'H22-M1-05'), bind('PT_H2_MULTI_UNMAPPED', 'H22-M1-77'),
  ]);
  const unitsOf = (grade, key) => UnitCore.PROFILES[{ 고1: 'h1', 고2: 'h2' }[grade]].units.findIndex(unit => unit.key === key);
  assert.equal(hinter.hint('PT_ONE', '중3'), '삼각비');
  assert.equal(hinter.hint('PT_OLDKEY', '중2'), '삼각형의 성질', 'an old broad unit that no label can place is placed by its sub-unit');
  assert.equal(hinter.hint('PT_SPLIT', '중2'), '사각형의 성질', 'a PT that binds to two units goes to the later unit in profile order (사용자 결정 2026-11-22)');
  assert.equal(hinter.hint('PT_OTHERGRADE', '중2'), '', 'bindings of another grade do not count');
  assert.equal(hinter.hint('PT_INACTIVE', '중3'), '');
  assert.equal(hinter.hint('PT_H1_SAME', '고1', '공통수학1'), 'H22-C-02', 'the 2015 and 2022 keys of one unit are one unit; high school carries the unit key');
  assert.equal(hinter.hint('PT_H1_SPLIT', '고1', '공통수학1'), 'H22-C-03', 'two units of the subject: the later one');
  assert.equal(hinter.hint('PT_H1_UNMAPPED', '고1', '공통수학1'), 'H22-C-02', 'a binding that cannot be placed in a unit is left out; the placed ones decide');
  assert.equal(hinter.hint('PT_H1_ALL_UNMAPPED', '고1', '공통수학1'), '', 'no binding can be placed: nothing to hint');
  assert.equal(hinter.hint('PT_H1_SAME', '고2'), '', 'a 고1 unit key is not a 고2 binding');
  assert.equal(hinter.hint('PT_H2', '고2'), 'H22-M1-03');
  assert.equal(hinter.hint('PT_H2', '고2', '미적분I'), 'H22-M1-03');
  assert.equal(hinter.hint('PT_H2', '고2', '미적분'), 'H22-M1-03', '고2 미적분은 켠다(사용자 결정 2026-11-22: 일치율이 낮아도 미분류로 숨는 것보다 단원에 들어가는 쪽)');
  assert.equal(hinter.hint('PT_H2', '고3', '미적분'), 'H22-M1-03', '고3도 켠다(같은 결정)');
  assert.equal(hinter.hint('PT_H1_SAME', '고1', '수학(하)'), 'H22-C-02');
  // several units across subjects: only the units inside the question subject count, never another subject
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '공통수학2'), 'H22-C2-02', 'last unit inside 공통수학2, not a later unit of another subject');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '공통수학1'), 'H22-C-03');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '수학(상)'), 'H22-C-03', '2015 과목명은 대응 과목표로 2022 과목으로 본다: 수학(상) = 공통수학1');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '수학(하)'), 'H22-C2-02', '수학(하) = 공통수학2');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '수학_상'), 'H22-C-03', 'another spelling of the same 2015 course');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', ''), '', 'subject blank and the PT spans two subjects: not hinted');
  assert.equal(hinter.hint('PT_H1_CROSS', '고1', '기출'), '', 'subject 기출 and the PT spans two subjects: not hinted');
  // subject blank or 기출: when the PT binds to one subject only, that subject is used (2026-11-22)
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', ''), 'H22-C-05');
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', '기출'), 'H22-C-05');
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', '수학(상)'), 'H22-C-05');
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', '수학(하)'), '', 'a known subject is never overridden: no bound unit inside 공통수학2');
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', '공통수학2'), '', 'no bound unit inside the subject: not sent to another subject');
  assert.equal(hinter.hint('PT_H1_ONLY_C1', '고1', '공통수학1'), 'H22-C-05');
  assert.equal(hinter.hint('PT_H2_MULTI', '고2', '미적분I'), 'H22-M1-05');
  assert.equal(hinter.hint('PT_H2_MULTI', '고2', '수학II'), 'H22-M1-05', '2015 수학II is the 미적분Ⅰ subject of the unit profile');
  assert.equal(hinter.hint('PT_H2_MULTI', '고2', ''), 'H22-M1-05', 'subject not determined but the PT binds to one subject only: that subject (2026-11-22)');
  assert.equal(hinter.hint('PT_H2_CROSS', '고2', ''), '', 'subject not determined and the PT binds to two subjects: not hinted');
  assert.equal(hinter.hint('PT_H2_MULTI', '고2', '확률과통계'), '', 'no bound unit inside the subject');
  assert.equal(hinter.hint('PT_H2_CROSS', '고2', '대수'), 'H22-A-04');
  assert.equal(hinter.hint('PT_H2_CROSS', '고2', '수학I'), 'H22-A-04');
  assert.equal(hinter.hint('PT_H2_CROSS', '고2', '미적분I'), 'H22-M1-03');
  assert.equal(hinter.hint('PT_H2_MULTI_UNMAPPED', '고2', '미적분I'), 'H22-M1-05');
  // the later unit really is later in the profile (profile order is the only order used)
  assert.ok(unitsOf('고2', 'H22-M1-05') > unitsOf('고2', 'H22-M1-03'));
  assert.ok(unitsOf('고1', 'H22-C2-02') > unitsOf('고1', 'H22-C2-01'));
  assert.equal(hinter.hint('PT_ONE', '고3'), '', 'a middle-school binding is not a 고3 binding and no 고3 unit has its name');
  // 교육과정 개정으로 단원이 학년을 옮긴 경우: 그 학년에 연결이 없으면 다른 학년 연결 단원과 같은 이름의 통합 단원을 쓴다. 이름이 같은 단원이 없으면 싣지 않는다.
  const moved = hinter.decide('PT_H1_MOVED', '고2', '확률과통계');
  assert.equal(moved.value, 'H22-PS-01', '고1 `순열과 조합` 연결 → 고2 같은 이름의 통합 단원');
  assert.equal(moved.moved, true);
  assert.equal(hinter.hint('PT_H1_MOVED', '고1', '공통수학1'), 'H22-C-08', 'in its own grade the binding is used as before (not moved)');
  assert.equal(hinter.decide('PT_H1_MOVED', '고1', '공통수학1').moved, undefined);
  assert.equal(hinter.decide('PT_H1_UNMATCHED', '고2', '대수').reason, 'noBinding', 'no unit of the same name in the grade profile: stays unclassified');
  assert.equal(hinter.hint('PT_H1_UNMATCHED', '고2', '대수'), '');
  assert.equal(hinter.hint('', '중3'), '');
});

test('unit hint rule for several units: old broad unit narrows, then the unit with the most already-placed rows of the same PT, ties and no placed rows -> last', async () => {
  const bindings = [
    bind('PT_SPLIT', 'M2-05', 'M2-05-TRIANGLE_PROPERTIES'), bind('PT_SPLIT', 'M2-05', 'M2-05-QUADRILATERAL_PROPERTIES'),
    bind('PT_NARROW', 'M2-05', 'M2-05-QUADRILATERAL_PROPERTIES'), bind('PT_NARROW', 'M2-04', 'M2-04-LINEAR_FUNCTION_BASIC'),
    bind('PT_NARROW2', 'M2-05', 'M2-05-TRIANGLE_PROPERTIES'), bind('PT_NARROW2', 'M2-05', 'M2-05-QUADRILATERAL_PROPERTIES'), bind('PT_NARROW2', 'M2-03', 'M2-03-SIMULTANEOUS_LINEAR_EQUATION'),
    bind('PT_ELSE', 'M2-03', 'M2-03-SIMULTANEOUS_LINEAR_EQUATION'),
    bind('PT_H1_CROSS', 'H22-C-03'), bind('PT_H1_CROSS', 'H22-C2-01'), bind('PT_H1_CROSS', 'H22-C2-02'),
    bind('PT_H1_C1', 'H22-C-02'), bind('PT_H1_C1', 'H22-C-05'),
  ];
  const fresh = async () => hinterFor(bindings);
  const tri = (await fresh()).decide('PT_SPLIT', '중2').unitKeys[0], quad = (await fresh()).decide('PT_SPLIT', '중2').unitKeys[1];
  assert.ok(tri && quad && tri !== quad);
  const placed = async (rows) => { const h = await fresh(); for (const [pt, grade, key, n] of rows) for (let i = 0; i < n; i++) h.addPlaced(pt, grade, key); return h; };
  // no placed row of the PT: the last unit (사용자 결정 2026-11-22)
  assert.equal((await fresh()).hint('PT_SPLIT', '중2'), '사각형의 성질');
  assert.equal((await fresh()).decide('PT_SPLIT', '중2').reason, 'last');
  // most placed rows of the same PT in the same grade wins, even when it is not the last unit
  const h1 = await placed([['PT_SPLIT', '중2', tri, 3], ['PT_SPLIT', '중2', quad, 1]]);
  assert.equal(h1.hint('PT_SPLIT', '중2'), '삼각형의 성질');
  assert.equal(h1.decide('PT_SPLIT', '중2').reason, 'majority');
  // placed rows of another PT or another grade do not count
  const h2 = await placed([['PT_OTHER', '중2', tri, 9], ['PT_SPLIT', '중3', tri, 9]]);
  assert.equal(h2.hint('PT_SPLIT', '중2'), '사각형의 성질');
  // a tie goes to the last unit
  const h3 = await placed([['PT_SPLIT', '중2', tri, 2], ['PT_SPLIT', '중2', quad, 2]]);
  assert.equal(h3.hint('PT_SPLIT', '중2'), '사각형의 성질');
  assert.equal(h3.decide('PT_SPLIT', '중2').reason, 'tie');
  // leave-one-out (measurement): the row itself is not counted
  assert.equal(h3.decide('PT_SPLIT', '중2', '', {}, { leaveOut: quad }).value, '삼각형의 성질');
  // old broad unit narrows the bound units; one left -> that unit, whatever the counts are
  const h4 = await placed([['PT_NARROW', '중2', quad, 1]]);
  assert.equal(h4.hint('PT_NARROW', '중2', '수학', { key: 'M2-04' }), '일차함수');
  assert.equal(h4.decide('PT_NARROW', '중2', '수학', { key: 'M2-04' }).reason, 'narrowed');
  assert.equal(h4.hint('PT_NARROW', '중2', '수학', { key: 'M2-05' }), '사각형의 성질');
  // several left after narrowing: majority among the narrowed ones only
  const h5 = await placed([['PT_NARROW2', '중2', tri, 1]]);
  assert.equal(h5.hint('PT_NARROW2', '중2', '수학', { key: 'M2-05' }), '삼각형의 성질');
  // an old broad unit whose units do not meet the PT's units is a conflict: nothing is hinted; no key or an unknown key does not narrow
  assert.equal(h4.hint('PT_NARROW', '중2', '수학', { key: 'M2-03' }), '', 'M2-03 holds only 연립일차방정식, which PT_NARROW is not bound to: no overlap');
  assert.equal(h4.decide('PT_NARROW', '중2', '수학', { key: 'M2-03' }).reason, 'legacyConflict');
  assert.equal(h4.hint('PT_SPLIT', '중2', '수학', { key: 'M2-99' }), '사각형의 성질', 'an unknown legacy key does not narrow');
  assert.equal(h4.hint('PT_SPLIT', '중2', '수학', {}), '사각형의 성질');
  // a PT with one bound unit is untouched by counts and by the old unit
  const h6 = await placed([['PT_ELSE', '중2', quad, 5]]);
  assert.equal(h6.hint('PT_ELSE', '중2', '수학', { key: 'M2-05' }), '연립일차방정식', 'one bound unit: the result of the single-unit rule is unchanged');
  // high school: counts of the same subject only, never another subject
  const h7 = await placed([['PT_H1_CROSS', '고1', 'H22-C-03', 9], ['PT_H1_CROSS', '고1', 'H22-C2-01', 2], ['PT_H1_CROSS', '고1', 'H22-C2-02', 1]]);
  assert.equal(h7.hint('PT_H1_CROSS', '고1', '공통수학2'), 'H22-C2-01', 'most placed rows inside 공통수학2 (the 공통수학1 rows do not count)');
  assert.equal(h7.hint('PT_H1_CROSS', '고1', '공통수학1'), 'H22-C-03');
  assert.equal(h7.hint('PT_H1_CROSS', '고1', '수학(상)'), 'H22-C-03', '수학(상) is 공통수학1');
  assert.equal(h7.hint('PT_H1_CROSS', '고1', ''), '', 'subject not determined and the PT spans two subjects: not hinted');
  assert.equal(h7.hint('PT_H1_C1', '고1', '공통수학2'), '', 'no bound unit inside the subject: not sent to another subject');
  // same input, same output: the counts do not depend on the order they were added in
  const forward = await placed([['PT_SPLIT', '중2', tri, 2], ['PT_SPLIT', '중2', quad, 3]]);
  const backward = await placed([['PT_SPLIT', '중2', quad, 3], ['PT_SPLIT', '중2', tri, 2]]);
  assert.deepEqual(forward.decide('PT_SPLIT', '중2'), backward.decide('PT_SPLIT', '중2'));
});

test('unit hint consumer: used only when the source unit value cannot place the row', () => {
  const place = extra => Unified.classify(record({ sourceGrade: '고1', effectiveBrowseGrade: '고1', subject: '공통수학2', ...extra })).entry;
  // an unknown legacy key places nothing; the hint places it, and without the hint the row stays unclassified
  const unknownKey = { legacyStandardUnitKey: 'H22-C3-01', legacyStandardUnit: '함수' };
  assert.equal(place(unknownKey).unclassified, true);
  const hinted = place({ ...unknownKey, metaHintUnit: 'H22-C2-07' });
  assert.equal(hinted.unclassified, false);
  assert.equal(hinted.unitKey, 'H22-C2-07');
  // the source unit wins: a row the source places keeps its unit whatever the hint says
  const sourced = { legacyStandardUnitKey: 'H22-C2-03', legacyStandardUnit: '원의 방정식' };
  assert.equal(place(sourced).unitKey, 'H22-C2-03');
  assert.equal(place({ ...sourced, metaHintUnit: 'H22-C2-07' }).unitKey, 'H22-C2-03');
  // a hint that names no unit of the grade places nothing
  assert.equal(place({ ...unknownKey, metaHintUnit: 'H22-A-01' }).unclassified, true);
  // middle school: the old broad unit name spans several current units, the hint names one current unit
  const middle = extra => Unified.classify(record({ sourceGrade: '중2', effectiveBrowseGrade: '중2', subject: '수학', year: 2018, ...extra })).entry;
  const oldBroad = { legacyStandardUnitKey: 'M2-05', legacyStandardUnit: '도형의 성질' };
  assert.equal(middle(oldBroad).unclassified, true);
  const placed = middle({ ...oldBroad, metaHintUnit: '삼각형의 성질' });
  assert.equal(placed.unclassified, false);
  assert.equal(placed.unitLabel.replace(/\s+/g, ''), '삼각형의성질');
  assert.equal(middle({ legacyStandardUnitKey: 'M2-03', legacyStandardUnit: '연립일차방정식', metaHintUnit: '삼각형의 성질' }).unitLabel.replace(/\s+/g, ''), '연립일차방정식');
});

test('metaHintUnit in the catalog is a unit the PT binds to (inside the question subject), and never changes a row the source already places', async () => {
  const data = await catalog();
  const bindings = JSON.parse(read('data/meta-foundation/compiled/curriculum_bindings.json')).bindings;
  const hinter = await hinterFor(bindings);
  const { courseOf } = await hintLib();
  const profileOf = { 중1: 'm1', 중2: 'm2', 중3: 'm3', 고1: 'h1', 고2: 'h2', 고3: 'h3' };
  const lane = data.records.filter(row => row.metaHintUnit);
  assert.ok(lane.length > 0);
  for (const row of lane) {
    assert.ok(row.metaHintPT, 'a unit hint needs a usable PT: ' + row.questionUid);
    const decision = hinter.decide(row.metaHintPT, row.sourceGrade, row.subject);
    const units = UnitCore.PROFILES[profileOf[row.sourceGrade]].units;
    // the hint is one of the units the PT is bound to; with one bound unit it is exactly that unit
    const bound = units.filter(unit => decision.unitKeys.includes(unit.key));
    const hinted = bound.find(unit => unit.key === row.metaHintUnit || unit.name === row.metaHintUnit);
    assert.ok(hinted, 'the hint must be a bound unit of the PT: ' + row.questionUid);
    if (decision.unitKeys.length === 1) assert.equal(row.metaHintUnit, decision.value);
    // high school: a hint chosen among several units never leaves the question subject (never another subject's unit)
    if (decision.unitKeys.length > 1 && /^고/.test(row.sourceGrade)) {
      const course = courseOf(row.sourceGrade, row.subject);
      if (course) assert.equal(hinted.course, course, 'the hint stays inside the question subject: ' + row.questionUid);
      // subject not determined (blank, 기출): allowed only when every unit the PT binds to is in one subject
      else assert.equal(new Set(bound.map(unit => unit.course)).size, 1, 'an undetermined subject needs a one-subject PT: ' + row.questionUid);
    }
  }
  // every record of every grade keeps its placement when the hint is removed, except the rows that only the hint places
  let hintedRows = 0;
  for (const row of data.records) {
    const withHint = Unified.classify(row, { projectionPolicy: data.projectionPolicy }).entry;
    const withoutHint = Unified.classify({ ...row, metaHintUnit: '' }, { projectionPolicy: data.projectionPolicy }).entry;
    if (withHint.unitKey === withoutHint.unitKey) continue;
    hintedRows++;
    assert.ok(row.metaHintUnit && withoutHint.unclassified, 'only an unclassified row may change: ' + row.questionUid);
  }
  assert.ok(hintedRows > 0);
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
  // The downloaded catalog keeps only bindingMode and catalogSourceJsSha256 of sourceBinding; the approved fingerprint is in the evidence file.
  const completeProjection = catalogEvidence.readCatalog({ root }).records.find(row => row.questionUid === projected.questionUid).metaProjection;
  assert.equal(completeProjection.sourceBinding.approvedSourceFingerprint, metaByUid.get(projected.questionUid).sourceFingerprint);
  assert.notEqual(completeProjection.sourceBinding.approvedSourceFingerprint, projected.sourceFingerprint);
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
  assert.match(workspace, /archive2-unified-units\.js\?v=20261122-unit-hint-2/);
  assert.match(workspace, /archive2-canonical\.js\?v=20261119-receipt-row-binding-1/);
  // The workspace itself moved on with the final-check fixes (S10).
  assertWorkspaceScriptVersions(assert);
  const unitPage = read('unit-past-exams.html');
  assert.match(unitPage, new RegExp('archive2-core\\.js\\?v=' + coreVersion));
  assert.match(unitPage, /unit-past-exams-core\.js\?v=20261117-middle-parent-1/);
  assert.match(unitPage, /unit-past-exams\.js\?v=20261119-no-basic-1/);
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
