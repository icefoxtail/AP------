const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const modulePromise = import('../archive/tools/meta-foundation/reviewed-source-reassessment.mjs');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = value => structuredClone(value);
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);

function fixture(t, { global = false, parent = false, nonemptyConcept = false, withAsset = false, rendererPlacement = 'image' } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-retained-fields-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  git('init', '-q');git('config', 'user.name', 'Synthetic Test');git('config', 'user.email', 'test@example.invalid');
  const put = (relative, value) => { const p = path.join(root, relative);fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n');return { path: relative, sha256: sha(fs.readFileSync(p)) }; };
  const sourcePath = 'archive/exams/original/middle/m2/2final/synthetic.js', reviewPath = 'docs/native-review.json',
    rpmPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const question = { id: 1, content: '검토된 기하 문항', choices: ['가', '나'], answer: '가', solution: '검토된 풀이',
    curriculum: '2015', standardCourse: '중2 수학', standardUnitKey: 'M2-06', standardUnit: '도형의 닮음',
    subUnitKey: 'M2-06-RATIO', subUnit: '선분비', problemTypeKey: 'PT_EXISTING', templateKey: 'TPL_EXISTING',
    crossConceptKeys: nonemptyConcept ? ['CC_EXISTING'] : [], conditionKeys: [], integrationPattern: nonemptyConcept ? 'SEQUENTIAL' : 'NONE',
    difficultyBucket: 2 };
  const assetPath = withAsset ? 'archive/assets/retained-primary.svg' : null;
  if (withAsset) {
    const reference = assetPath.slice('archive/'.length);
    if (rendererPlacement === 'choices') question.choices[0] = '<img src="' + reference + '" />';
    else if (rendererPlacement === 'sharedMaterial') question.sharedMaterial = { nested: [{ html: '<img src="' + reference + '" />' }] };
    else question.image = reference;
    put(assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');
  }
  const source = q => 'window.questionBank = ' + JSON.stringify([q]) + ';\n';
  put(sourcePath, source(question));
  const rpm = { records: [{ id: 'M2-RPM-001', curriculum: '2015', scope: 'M2-2',
    standardUnitKey: question.standardUnitKey, subUnitKey: question.subUnitKey }] };
  let rpmRef = put(rpmPath, rpm);git('add', '.');git('commit', '-qm', 'synthetic original source');
  const base = git('rev-parse', 'HEAD'), sourceBlob = git('rev-parse', base + ':' + sourcePath);
  const context = { curriculum: '2015', standardCourse: question.standardCourse, standardUnitKey: question.standardUnitKey,
    subUnitKey: question.subUnitKey, problemTypeKey: question.problemTypeKey, status: 'ACTIVE' };
  const row = { sourceOrdinal: 1, questionUid: 'uid1', rpmDecision: 'KEEP', rpmRecordId: 'M2-RPM-001',
    decisiveStep: '원 검토의 결정 단계', after: { difficultyBucket: 2 }, proposalRefs: [], registrationDebt: [],
    fieldReview: { classification: '정확한 기존 주유형과 절차를 대조함', binding: 'ACTIVE 정의와 해당 교육과정 binding을 대조함',
      crossConcept: nonemptyConcept ? '필수 보조 개념: 검토된 보조 개념' : '독립 CC 없음', condition: '별도 Condition 없음',
      integration: nonemptyConcept ? '보조 개념 결과를 순차 연결함' : '한 주개념으로 완결되어 NONE', difficulty: '원래 난도 유지' },
    activeDefinitionMatch: { problemTypeKey: question.problemTypeKey, templateKey: question.templateKey,
      problemTypeStatus: 'ACTIVE', templateStatus: 'ACTIVE', templateParent: question.problemTypeKey,
      exactBindings: [clone(context)], projectionApplied: false } };
  if (parent) Object.assign(row.after, { problemTypeKey: question.problemTypeKey, templateKey: question.templateKey,
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' });
  const document = { schemaVersion: 'm2-s2-meta-review-v1', sourceArchiveFile: sourcePath.slice('archive/exams/'.length),
    baseSha: base, sourceGitBlobSha: sourceBlob, reviewedQuestionCount: 1, owner: 'native-reviewer', items: [row], proposals: [] };
  const metadata = { ...clone(question), courseKey: 'M2-2', curriculumKey: '2015', sourceFingerprint: 'a'.repeat(64), contentFingerprint: 'b'.repeat(64) };
  for (const key of ['content', 'choices', 'answer', 'solution', 'id']) delete metadata[key];
  const selected = parent ? ['subUnitKey', 'subUnit'] : ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern'];
  for (const key of selected) metadata[key] = key === 'subUnitKey' ? 'M2-06-OLD' : key === 'subUnit' ? '이전 표시' : null;
  const after = Object.fromEntries(selected.map(key => [key, clone(question[key])]));after.sourceFingerprint = 'c'.repeat(64);
  const patch = { questionUid: 'uid1', sourceOrdinal: 1,
    before: Object.fromEntries(Object.keys(after).map(key => [key, metadata[key]])), after, evidenceRefs: [],
    sourceReview: { schemaVersion: 'archive-reviewed-source-reassessment-v1',
      retainedFields: { schemaVersion: 'archive-reviewed-native-retained-fields-v1', fields: selected } } };
  const request = { scope: 'PARTIAL_UIDS', sourceArchiveFile: document.sourceArchiveFile, expectedQuestionCount: 1,
    approval: { type: 'FINAL_QA', metadataReviewed: true, evidenceRefs: [] }, items: [patch], registryChanges: [] };
  const pt = { problemTypeKey: question.problemTypeKey, canonicalLabelKo: '기존 주유형', status: 'ACTIVE', ownerPack: 'MIDDLE_GEOMETRY',
    supportingQuestionUids: global ? ['another-uid'] : ['uid1'] };
  const tpl = { templateKey: question.templateKey, canonicalLabelKo: '기존 절차', status: 'ACTIVE', ownerPack: 'MIDDLE_GEOMETRY',
    parentProblemTypeKey: pt.problemTypeKey, supportingQuestionUids: global ? ['another-uid'] : ['uid1'] };
  const concept = { conceptKey: 'CC_EXISTING', canonicalLabelKo: '검토된 보조 개념', status: 'ACTIVE' };
  const master = [{ key: question.standardUnitKey, keyType: 'standardUnitKey', labelKo: question.standardUnit, status: 'active' },
    { key: question.subUnitKey, keyType: 'subUnitKey', labelKo: question.subUnit, parentKey: question.standardUnitKey, status: 'active' }];
  const tables = { pt: new Map([[pt.problemTypeKey, pt]]), tpl: new Map([[tpl.templateKey, tpl]]),
    cc: new Map([[concept.conceptKey, concept]]), master: new Map(master.map(r => [r.key, r])),
    bindings: new Map([['exact', { ...context, ownerPack: 'MIDDLE_GEOMETRY', supportingQuestionUids: ['uid1'] }]]) };
  const final = { ...clone(metadata), ...clone(after) };
  const args = { root, request, patch, metadata, question, final, canonicalBefore: tables, canonicalAfter: clone(tables), cache: new Map() };
  const update = () => {
    rpmRef = put(rpmPath, rpm);const ref = put(reviewPath, document);
    git('add', '.');git('commit', '--allow-empty', '-qm', 'synthetic immutable review');
    Object.assign(patch.sourceReview, { reviewCommit: git('rev-parse', 'HEAD'), reviewPath, reviewRef: ref });
    patch.evidenceRefs = request.approval.evidenceRefs = [ref, rpmRef];args.cache = new Map();
  };
  update();return { args, root, git, put, sourcePath, source, question, row, document, rpm, tables, patch, request, final, metadata, update, assetPath };
}

for (const [label, options] of [
  ['same-UID ACTIVE definitions', {}], ['global ACTIVE definitions with exact native binding', { global: true }],
  ['nonempty exact reviewed concept and sequential integration', { nonemptyConcept: true }],
  ['native parent key and its exact master display label', { parent: true }],
]) test(`retained fields restore ${label} without creating a new judgment`, async t => {
  const f = fixture(t, options), { validateReviewedSourceReassessment } = await modulePromise;
  const result = validateReviewedSourceReassessment(f.args), proof = result.retainedNativeFields;
  assert.equal(proof.schemaVersion, 'archive-reviewed-native-retained-fields-v1');
  assert.equal(proof.newMathematicalQa, false);assert.equal(proof.inferredValues, false);
  assert.deepEqual(Object.keys(proof.fieldBindings).sort(), [...f.patch.sourceReview.retainedFields.fields].sort());
  assert.deepEqual(f.row.after, options.parent ? { difficultyBucket: 2, problemTypeKey: f.question.problemTypeKey,
    templateKey: f.question.templateKey, crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' } : { difficultyBucket: 2 });
});

test('the exact native Primary taxonomy internal-step review preserves NONE', async t => {
  const f = fixture(t);f.row.fieldReview.integration = 'Primary taxonomy 내부 단계만으로 해결한다.';f.update();
  assert.equal((await modulePromise).validateReviewedSourceReassessment(f.args).retainedNativeFields.fieldBindings.integrationPattern.valueSha256, sha(stable('NONE')));
});

const negatives = [
  ['no explicit opt-in', {}, f => { delete f.patch.sourceReview.retainedFields; }],
  ['unknown field selection', {}, f => { f.patch.sourceReview.retainedFields.fields.push('answer'); }],
  ['duplicate field selection', {}, f => { f.patch.sourceReview.retainedFields.fields.push('problemTypeKey'); }],
  ['unrecognized opt-in property', {}, f => { f.patch.sourceReview.retainedFields.approved = true; }],
  ['unsupported native schema', {}, f => { f.document.schemaVersion = 'm3-s2-complete-semantic-review-v1';f.update(); }],
  ['unsettled native decision', {}, f => { f.row.rpmDecision = 'HOLD';f.update(); }],
  ['explicit source hold', {}, f => { f.row.contentDebt = ['SOURCE_REPAIR_REQUIRED'];f.update(); }],
  ['unresolved proposal', {}, f => { f.row.proposalRefs = ['PENDING'];f.update(); }],
  ['new registry definition', {}, f => { f.request.registryChanges = [{}]; }],
  ['identity-only registration', {}, f => { f.request.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }],
  ['explicitly approved after field', {}, f => { f.row.after.problemTypeKey = f.question.problemTypeKey;f.update(); }],
  ['missing original source value', {}, f => { const q = clone(f.question);delete q.templateKey;f.put(f.sourcePath, f.source(q));f.update(); }],
  ['different reviewed source value', {}, f => { f.put(f.sourcePath, f.source({ ...f.question, templateKey: 'TPL_CHANGED' }));f.update(); }],
  ['changed current student answer with truthful native ref', {}, f => { f.question.answer = '나'; }],
  ['changed current source value', {}, f => { f.question.templateKey = 'TPL_CHANGED'; }],
  ['unrequested retained field', {}, f => { delete f.patch.after.templateKey; }],
  ['final value differs from request', {}, f => { f.final.templateKey = 'TPL_CHANGED'; }],
  ['missing immutable native review file', {}, f => { fs.unlinkSync(path.join(f.root, f.patch.sourceReview.reviewRef.path)); }],
  ['native match null despite current UID support', {}, f => { Object.assign(f.row.activeDefinitionMatch,
    { problemTypeKey: null, templateKey: null, problemTypeStatus: null, templateStatus: null, templateParent: null, exactBindings: [] });f.update(); }],
  ['native template names another ACTIVE method', {}, f => { f.row.activeDefinitionMatch.templateKey = 'TPL_OTHER';f.update(); }],
  ['global definition without exact native binding', { global: true }, f => { f.row.activeDefinitionMatch.exactBindings = [];f.update(); }],
  ['UID-supported definition without exact native binding', {}, f => { f.row.activeDefinitionMatch.exactBindings = [];f.update(); }],
  ['native contradictory curriculum binding even with UID support', {}, f => { f.row.activeDefinitionMatch.exactBindings[0].curriculum = '2022';f.update(); }],
  ['global definition without binding review', { global: true }, f => { delete f.row.fieldReview.binding;f.update(); }],
  ['changed existing template definition', {}, f => { f.args.canonicalAfter.tpl.get('TPL_EXISTING').canonicalLabelKo = '다른 절차'; }],
  ['template wrong parent', {}, f => { f.tables.tpl.get('TPL_EXISTING').parentProblemTypeKey = 'PT_OTHER'; }],
  ['template wrong definition owner', {}, f => { f.tables.tpl.get('TPL_EXISTING').ownerPack = 'OTHER'; }],
  ['missing current binding', {}, f => { f.args.canonicalAfter.bindings.clear(); }],
  ['duplicate exact current binding', {}, f => { f.args.canonicalAfter.bindings.set('duplicate', clone(f.tables.bindings.get('exact'))); }],
  ['changed current binding payload', {}, f => { f.args.canonicalAfter.bindings.get('exact').ownerPack = 'OTHER'; }],
  ['RPM scope evidence not bound to item', {}, f => { f.patch.evidenceRefs = [f.patch.sourceReview.reviewRef]; }],
  ['wrong current course scope', {}, f => { f.final.courseKey = 'M2-1'; }],
  ['different native RPM scope', {}, f => { f.rpm.records[0].scope = 'M2-1';f.update(); }],
  ['duplicate native RPM id', {}, f => { f.rpm.records.push(clone(f.rpm.records[0]));f.update(); }],
  ['parent contradicted by immutable RPM record', { parent: true }, f => { f.rpm.records[0].subUnitKey = 'M2-06-OTHER';f.update(); }],
  ['parent display chosen without its key', { parent: true }, f => { f.patch.sourceReview.retainedFields.fields = ['subUnit']; }],
  ['parent master label differs', { parent: true }, f => { f.tables.master.get('M2-06-RATIO').labelKo = '다른 표시'; }],
  ['parent master hierarchy changed', { parent: true }, f => { f.args.canonicalAfter.master.get('M2-06-RATIO').parentKey = 'M2-05'; }],
  ['empty cross-concepts without absence review', {}, f => { f.row.fieldReview.crossConcept = '읽지 않음';f.update(); }],
  ['cross-concept label absent from native review', { nonemptyConcept: true }, f => { f.row.fieldReview.crossConcept = '다른 보조 개념';f.update(); }],
  ['cross-concept definition changed', { nonemptyConcept: true }, f => { f.args.canonicalAfter.cc.get('CC_EXISTING').definition = '다른 정의'; }],
  ['empty conditions without absence review', {}, f => { f.row.fieldReview.condition = '나중에 검토';f.update(); }],
  ['integration pattern contradicts field review', { nonemptyConcept: true }, f => { f.row.fieldReview.integration = '한 주개념으로 완결되어 NONE';f.update(); }],
  ['source-only optional integration reason copied as approval', {}, f => { f.question.integrationReason = '원 source의 미승인 설명';
    f.put(f.sourcePath, f.source(f.question));f.patch.before.integrationReason = null;f.patch.after.integrationReason = f.question.integrationReason;
    f.final.integrationReason = f.question.integrationReason;f.update(); }],
];
for (const [label, options, change] of negatives) test(`retained fields refuse ${label}`, async t => {
  const f = fixture(t, options);change(f);const { validateReviewedSourceReassessment } = await modulePromise;
  assert.throws(() => validateReviewedSourceReassessment(f.args), /native retained fields:|source reassessment:|native proposal finalization:/);
});

async function independentFixture(t, options = {}) {
  const f = fixture(t, options), { REASSESSED_STUDENT_FIELDS } = await modulePromise;
  Object.assign(f.row.activeDefinitionMatch, { problemTypeKey: null, templateKey: null,
    problemTypeStatus: null, templateStatus: null, templateParent: null, exactBindings: [] });f.update();
  const nativeCommit = f.patch.sourceReview.reviewCommit, nativeRef = { commit: nativeCommit,
    path: f.patch.sourceReview.reviewPath, sha256: f.patch.sourceReview.reviewRef.sha256 };
  const pt = f.tables.pt.get(f.question.problemTypeKey), tpl = f.tables.tpl.get(f.question.templateKey), binding = f.tables.bindings.get('exact');
  const taxPath = 'archive/data/meta-foundation/compiled/taxonomy_registry.json',
    bindingPath = 'archive/data/meta-foundation/compiled/curriculum_bindings.json';
  f.put(taxPath, { problemTypes: [pt], templates: [tpl] });f.put(bindingPath, { bindings: [binding] });
  f.git('add', '.');f.git('commit', '-qm', 'synthetic exact current canonical snapshot');
  const currentCommit = f.git('rev-parse', 'HEAD'), fileRef = (commit, p) => ({ commit, path: p,
    blob: f.git('rev-parse', commit + ':' + p), sha256: sha(execFileSync('git', ['show', commit + ':' + p], { cwd: f.root })) });
  const sourceRef = commit => ({ ...fileRef(commit, f.sourcePath), questionStableSha256: sha(stable(f.question)) });
  const before = sourceRef(f.document.baseSha);
  const assets = f.assetPath ? [{ path: f.assetPath,
    gitBlobSha1: f.git('rev-parse', currentCommit + ':' + f.assetPath),
    sha256: sha(fs.readFileSync(path.join(f.root, f.assetPath))), visuallyInspected: true }] : [];
  const fields = ['problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys'];
  const app = { questionUid: 'uid1', sourceOrdinal: 1, nativeReviewRef: nativeRef,
    nativeItemStableSha256: sha(stable(f.row)), nativeAfterSha256: sha(stable(f.row.after)),
    nativeActiveDefinitionMatchSha256: sha(stable(f.row.activeDefinitionMatch)),
    nativeActiveDefinitionMatchDisposition: 'PRESERVED_AS_ORIGINALLY_NULL_NOT_TREATED_AS_PRIOR_APPROVAL',
    immutableSourceBefore: { blob: before.blob, sha256: before.sha256, questionStableSha256: before.questionStableSha256 },
    immutableReviewedSource: sourceRef(nativeCommit), currentSource: sourceRef(currentCommit),
    studentPayloadFields: REASSESSED_STUDENT_FIELDS,
    studentPayloadSha256: sha(stable(Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k => [k, Object.hasOwn(f.question, k) ? f.question[k] : null])))),
    rendererAssets: assets, rendererReview: assets.length ? 'Directly inspected the exact current asset.' : 'TEXT_ONLY_NO_REFERENCED_ASSETS',
    canonicalRefs: { taxonomy: fileRef(currentCommit, taxPath), bindings: fileRef(currentCommit, bindingPath) },
    existingPrimary: { problemTypeKey: pt.problemTypeKey, templateKey: tpl.templateKey,
      problemTypeRecordSha256: sha(stable(pt)), templateRecordSha256: sha(stable(tpl)), bindingRecordSha256: sha(stable(binding)),
      exactBinding: Object.fromEntries(['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey', 'status', 'ownerPack'].map(k => [k, binding[k]])),
      uidExplicitlySupportedByProblemType: pt.supportingQuestionUids.includes('uid1'), uidExplicitlySupportedByTemplate: tpl.supportingQuestionUids.includes('uid1'),
      uidExplicitlySupportedByBinding: binding.supportingQuestionUids.includes('uid1') },
    decision: 'APPROVED_EXISTING_PRIMARY', allowedRetentionFields: fields,
    approvedValues: Object.fromEntries(fields.map(k => [k, clone(f.question[k])])), rationale: 'Exact current applicability was independently reviewed.',
    originalNativeAfterPreserved: true, sourcePayloadChangeApproved: false, newMathematicalQa: false, newReview2: false, newDifficultyApproval: false };
  const proof = { schemaVersion: 'archive-independent-existing-primary-disposition-v1', scope: 'EXISTING_PRIMARY_RETENTION_ONLY',
    reviewerRole: 'INDEPENDENT', reviewerOwner: 'independent-reviewer', canonicalSnapshotCommit: currentCommit,
    sourceWrites: 0, canonicalWrites: 0, newDefinitions: 0, newMathematicalQa: false, newReview2: false,
    newDifficultyApproval: false, officialRegistrationRequired: true, actualMainRegistered: false, applications: [app] };
  const resign = () => {
    const ref = f.put('docs/independent-primary.json', proof);f.git('add', '.');f.git('commit', '--allow-empty', '-qm', 'synthetic independent primary disposition');
    f.patch.sourceReview.retainedFields.independentPrimary = { schemaVersion: 'archive-reviewed-existing-primary-disposition-v1',
      reviewCommit: f.git('rev-parse', 'HEAD'), reviewRef: ref };
    f.patch.evidenceRefs = f.request.approval.evidenceRefs = [f.patch.sourceReview.reviewRef,
      { path: 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json', sha256: sha(fs.readFileSync(path.join(f.root, 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json'))) }, ref];
    f.args.cache = new Map();
  };
  resign();return { ...f, app, proof, resign, assets };
}

for (const options of [{}, { global: true, withAsset: true }]) test(`independent primary disposition preserves the original null match (${options.global ? 'global renderer' : 'text only'})`, async t => {
  const f = await independentFixture(t, options), result = (await modulePromise).validateReviewedSourceReassessment(f.args);
  assert.equal(result.retainedNativeFields.primaryOrigin, 'INDEPENDENT_EXISTING_PRIMARY_DISPOSITION');
  assert.equal(result.retainedNativeFields.independentApplicabilityDecision, true);
  assert.equal(Object.hasOwn(result.retainedNativeFields, 'newFieldJudgments'), false);
  assert.equal(result.retainedNativeFields.independentPrimary.originalNativeAfterPreserved, true);
  assert.equal(f.row.activeDefinitionMatch.templateKey, null);
  assert.equal(result.retainedNativeFields.independentPrimary.rendererAssets.length, options.withAsset ? 1 : 0);
});
test('independent primary allows only absent exact native namespace transport', async t => {
  const f = await independentFixture(t);f.question.courseKey = 'M2-2';
  const result = (await modulePromise).validateReviewedSourceReassessment(f.args);
  assert.deepEqual(result.retainedNativeFields.independentPrimary.scopeTransport, { courseKey: 'M2-2' });
});
test('independent primary verifies an explicitly named original source commit and path', async t => {
  const f = await independentFixture(t), { validateReviewedSourceReassessment } = await modulePromise;
  Object.assign(f.app.immutableSourceBefore, { commit: f.document.baseSha, path: f.sourcePath });f.resign();
  assert.equal(validateReviewedSourceReassessment(f.args).retainedNativeFields.independentApplicabilityDecision, true);
  f.app.immutableSourceBefore.commit = f.app.currentSource.commit;f.resign();
  assert.throws(() => validateReviewedSourceReassessment(f.args), /original native source commit or path/);
});
test('independent global primary refuses invented supporting UID membership', async t => {
  const f = await independentFixture(t, { global: true }), { validateReviewedSourceReassessment } = await modulePromise;
  assert.equal(f.app.existingPrimary.uidExplicitlySupportedByTemplate, false);
  f.app.existingPrimary.uidExplicitlySupportedByTemplate = true;f.resign();
  assert.throws(() => validateReviewedSourceReassessment(f.args), /supporting UID provenance was altered/);
});
for (const rendererPlacement of ['choices', 'sharedMaterial']) {
  test(`independent primary binds nested ${rendererPlacement} assets and rechecks their current bytes`, async t => {
    const f = await independentFixture(t, { withAsset: true, rendererPlacement }), { validateReviewedSourceReassessment } = await modulePromise;
    const proof = validateReviewedSourceReassessment(f.args);
    assert.deepEqual(proof.retainedNativeFields.independentPrimary.rendererAssets.map(ref => ref.path), [f.assetPath]);
    f.put(f.assetPath, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="7"/></svg>');
    assert.throws(() => validateReviewedSourceReassessment(f.args), /current renderer bytes drifted/);
  });
  test(`independent primary refuses an omitted ${rendererPlacement} asset inventory`, async t => {
    const f = await independentFixture(t, { withAsset: true, rendererPlacement }), { validateReviewedSourceReassessment } = await modulePromise;
    f.app.rendererAssets = [];f.app.rendererReview = 'TEXT_ONLY_NO_REFERENCED_ASSETS';f.resign();
    assert.throws(() => validateReviewedSourceReassessment(f.args), /complete exact renderer inventory required/);
  });
}
const independentNegatives = [
  ['changed local review despite matching claimed local hash', f => { f.proof.newMathematicalQa = true;
    const ref = f.put('docs/independent-primary.json', f.proof);f.patch.sourceReview.retainedFields.independentPrimary.reviewRef = ref;
    f.patch.evidenceRefs = f.request.approval.evidenceRefs = [...f.patch.evidenceRefs.slice(0, 2), ref]; }, false],
  ['not independently reviewed', f => { f.proof.reviewerOwner = 'native-reviewer'; }, true],
  ['overbroad QA claim', f => { f.proof.newMathematicalQa = true; }, true],
  ['unapproved primary decision', f => { f.app.decision = 'HOLD'; }, true],
  ['ambiguous UID', f => { f.proof.applications.push(clone(f.app)); }, true],
  ['wrong ordinal', f => { f.app.sourceOrdinal = 2; }, true],
  ['native match rewritten in provenance', f => { f.app.nativeActiveDefinitionMatchSha256 = 'a'.repeat(64); }, true],
  ['native after rewritten in provenance', f => { f.app.nativeAfterSha256 = 'a'.repeat(64); }, true],
  ['wrong original source', f => { f.app.immutableSourceBefore.blob = 'a'.repeat(40); }, true],
  ['wrong current source raw SHA', f => { f.app.currentSource.sha256 = 'a'.repeat(64); }, true],
  ['reduced protected student field list', f => { f.app.studentPayloadFields = f.app.studentPayloadFields.filter(k => k !== 'answer'); }, true],
  ['non-scope source metadata change', f => { f.question.tags = ['unreviewed']; }, false],
  ['unreviewed current namespace', f => { f.question.courseKey = 'M2-1'; }, false],
  ['canonical hash rewritten', f => { f.app.existingPrimary.templateRecordSha256 = 'a'.repeat(64); }, true],
  ['false supporting UID claim', f => { f.app.existingPrimary.uidExplicitlySupportedByTemplate = false; }, true],
  ['additional approved field', f => { f.app.allowedRetentionFields.push('difficultyBucket');f.app.approvedValues.difficultyBucket = 2; }, true],
  ['missing approval evidence ref', f => { f.request.approval.evidenceRefs = f.patch.evidenceRefs.slice(0, 2); }, false],
  ['missing asset inventory', f => { f.app.rendererAssets = []; }, true],
  ['additional unreviewed asset inventory', f => { f.app.rendererAssets.push({ ...f.app.rendererAssets[0], path: 'archive/assets/extra.svg' }); }, true],
  ['asset not visually inspected', f => { f.app.rendererAssets[0].visuallyInspected = false; }, true],
  ['same-path asset bytes drift with cached immutable proof', f => {
    f.put(f.assets[0].path, '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1L9 9"/></svg>'); }, false],
];
for (const [label, mutate, resign] of independentNegatives) test(`independent primary refuses ${label}`, async t => {
  const withAsset = /asset/.test(label), f = await independentFixture(t, { withAsset }), { validateReviewedSourceReassessment } = await modulePromise;
  if (/cached/.test(label)) validateReviewedSourceReassessment(f.args);
  mutate(f);if (resign) f.resign();
  assert.throws(() => validateReviewedSourceReassessment(f.args), /existing primary disposition:|native retained fields:|source reassessment:/);
});

async function writerFixture(t) {
  const f = await independentFixture(t, { global: true, withAsset: true });
  const canonical = 'archive/data/meta-foundation/canonical', pack = canonical + '/packs/middle-geometry';
  f.put(canonical + '/registry_index.json', { activePacks: [{ id: 'MIDDLE_GEOMETRY', version: '1.0.0', status: 'ACTIVE' }],
    activeConceptShards: [], conditionRegistry: { id: 'CONDITION_CORE', version: '1', status: 'ACTIVE' }, canonicalSources: [],
    compiledArtifacts: ['aliases', 'concept_registry', 'condition_registry', 'curriculum_bindings', 'taxonomy_registry', 'meta_foundation_compiled']
      .map(name => ({ path: 'archive/data/meta-foundation/compiled/' + name + '.json' })) });
  f.put(canonical + '/condition_registry.json', { schemaVersion: 'meta-foundation-condition-registry-v1', owner: 'CONDITION_CORE', conditions: [], conditionCount: 0 });
  f.put(pack + '/pack.json', { schemaVersion: 'meta-foundation-pack-v1', packId: 'MIDDLE_GEOMETRY', packVersion: '1.0.0', canonicalStatus: 'ACTIVE',
    curricula: ['2015'], standardCourses: ['중2 수학', 'M2-2'] });
  f.put(pack + '/taxonomy.json', { status: 'ACTIVE', problemTypes: [...f.tables.pt.values()], templates: [...f.tables.tpl.values()] });
  f.put(pack + '/bindings.json', { status: 'ACTIVE', bindings: [...f.tables.bindings.values()] });f.put(pack + '/aliases.json', { aliases: [] });
  f.put('archive/data/master_tables/js_archive_tag_master.json', [...f.tables.master.values()]);
  fs.mkdirSync(path.join(f.root, 'archive/data/meta-foundation/runtime'), { recursive: true });
  Object.assign(f.metadata, { questionUid: 'uid1', sourceOrdinal: 1, sourceArchiveFile: f.request.sourceArchiveFile,
    level: '중', reviewStatus: 'review_required', metadataStatus: 'registration_pending_semantic_review' });
  f.put('archive/data/question_metadata.json', { records: [f.metadata], counts: {} });
  f.put('archive/data/question_identity_map.json', { records: [clone(f.metadata)] });
  const full = q => sha(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const body = q => sha(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }));
  Object.assign(f.patch.after, { sourceFingerprint: full(f.question), contentFingerprint: body(f.question) });
  f.patch.before.contentFingerprint = f.metadata.contentFingerprint;f.patch.identityBefore = { sourceFingerprint: f.metadata.sourceFingerprint };
  f.patch.reason = 'Only exact retained fields and the independent existing primary are registered.';
  Object.assign(f.request, { schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', requestId: 'retained-fields-fixture',
    examUid: 'fixture-exam', expectedSourceBlobSha1: f.git('hash-object', f.sourcePath) });
  f.request.approval.approvedBy = 'native-and-independent-reviewers';
  const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + f.request.requestId + '.json';
  return { ...f, pack, receiptPath, read: p => JSON.parse(fs.readFileSync(path.join(f.root, p))) };
}

test('retained primary writes and replays its exact independent witness through the official registrar', async t => {
  const f = await writerFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  const source = fs.readFileSync(path.join(f.root, f.sourcePath)), original = fs.readFileSync(path.join(f.root, 'docs/native-review.json'));
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).totalQuestions, 1);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).status, 'PASS');
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  const receipt = f.read(f.receiptPath), bindingPath = f.receiptPath.replace(/\.json$/, '.source-review-binding.json'), binding = f.read(bindingPath);
  assert.equal(receipt.fingerprintRepairs[0].sourceReview.retainedNativeFields.independentApplicabilityDecision, true);
  assert.deepEqual(binding.requestSnapshot, JSON.parse(stable(f.request)));
  assert.deepEqual([binding.expectedQuestionCount, binding.partialUidCount, binding.sourceReviewUidCount], [1, 1, 1]);
  assert.equal(binding.records[0].fingerprintRepairSha256, sha(stable(receipt.fingerprintRepairs[0])));
  assert.ok(receipt.appliedRecords[0].approvalEvidence.includes(bindingPath));
  assert.ok(receipt.runtimeRecords[0].approvalEvidence.includes(bindingPath));
  assert.deepEqual(receipt.outputDigests.filter(ref => ref.path === bindingPath), [{ path: bindingPath,
    sha256: sha(fs.readFileSync(path.join(f.root, bindingPath))) }]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.sourcePath)), source);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native-review.json')), original);
});

for (const [name, mutate] of [
  ['removed proof', f => { const r = f.read(f.receiptPath);delete r.fingerprintRepairs[0].sourceReview.retainedNativeFields;f.put(f.receiptPath, r); }],
  ['altered independent digest', f => { const r = f.read(f.receiptPath);r.fingerprintRepairs[0].sourceReview.retainedNativeFields.independentPrimary.applicationSha256 = 'a'.repeat(64);f.put(f.receiptPath, r); }],
  ['altered original before', f => { const r = f.read(f.receiptPath);r.fingerprintRepairs[0].metadataBefore.sourceFingerprint = 'a'.repeat(63) + 'b';f.put(f.receiptPath, r); }],
  ['altered original identity', f => { const r = f.read(f.receiptPath);r.fingerprintRepairs[0].identityBefore.sourceFingerprint = 'a'.repeat(63) + 'b';f.put(f.receiptPath, r); }],
  ['altered source binding', f => { const r = f.read(f.receiptPath);r.sourceRawSha256 = 'a'.repeat(64);f.put(f.receiptPath, r); }],
  ['duplicated repair', f => { const r = f.read(f.receiptPath);r.fingerprintRepairs.push(clone(r.fingerprintRepairs[0]));f.put(f.receiptPath, r); }],
  ['current same-path asset drift', f => { f.put(f.assets[0].path, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="3"/></svg>'); }],
  ['current ACTIVE definition drift', f => { const d = f.read(f.pack + '/taxonomy.json');d.templates[0].definition = 'unreviewed current definition';f.put(f.pack + '/taxonomy.json', d); }],
]) test(`official retained replay rejects ${name}`, async t => {
  const f = await writerFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });mutate(f);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered explicit source review|registered source-review binding|reviewed source binding:|existing primary disposition:|native retained fields:/);
});

for (const [name, mutate] of [
  ['missing sidecar', (f, p) => fs.unlinkSync(path.join(f.root, p))],
  ['missing raw digest', (f, p) => { const r = f.read(f.receiptPath);r.outputDigests = r.outputDigests.filter(ref => ref.path !== p);f.put(f.receiptPath, r); }],
  ['resigned altered original request snapshot', (f, p) => { const b = f.read(p);b.requestSnapshot.items[0].before.problemTypeKey = 'fabricated';f.put(p, b);
    const r = f.read(f.receiptPath);r.outputDigests.find(ref => ref.path === p).sha256 = sha(fs.readFileSync(path.join(f.root, p)));f.put(f.receiptPath, r); }],
  ['simultaneous proof and receipt evidence removal', f => { const r = f.read(f.receiptPath);delete r.fingerprintRepairs[0].sourceReview;r.approval.evidenceRefs = [];f.put(f.receiptPath, r); }],
  ['metadata and runtime provenance removal', (f, p) => {
    const r = f.read(f.receiptPath);for (const row of [...r.appliedRecords, ...r.runtimeRecords]) row.approvalEvidence = row.approvalEvidence.filter(v => v !== p);
    f.put(f.receiptPath, r);f.put('archive/data/question_metadata.json', { ...f.read('archive/data/question_metadata.json'), records: r.appliedRecords });
    const dir = 'archive/data/meta-foundation/runtime';
    for (const name of fs.readdirSync(path.join(f.root, dir))) if (name.endsWith('.json')) {
      const file = dir + '/' + name, doc = f.read(file);if (doc.records?.some(row => row.questionUid === 'uid1'))
        f.put(file, { ...doc, records: doc.records.map(row => row.questionUid === 'uid1' ? r.runtimeRecords[0] : row) });
    }
  }],
]) test(`official opt-in binding refuses ${name}`, async t => {
  const f = await writerFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  mutate(f, f.receiptPath.replace(/\.json$/, '.source-review-binding.json'));
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered source-review binding|reviewed source binding:/);
});

async function scopeWriterFixture(t) {
  const f = await writerFixture(t), canonical = 'archive/data/meta-foundation/canonical', pack = canonical + '/packs/middle3';
  const parentPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const parent = { curriculum: '2015', scope: 'M3-1', majorUnit: '이차함수', midUnit: '이차함수의 그래프' };
  const values = { curriculum: '2015', curriculumKey: '2015', courseKey: 'M3-1', standardCourse: '중3 수학',
    standardUnitKey: 'M3-04', standardUnit: parent.majorUnit, subUnitKey: 'M3-04-QUADRATIC_FUNCTION_GRAPH', subUnit: parent.midUnit,
    problemTypeKey: 'PT_EXISTING', templateKey: 'TPL_EXISTING', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
    level: '중', difficultyBucket: 2, semanticSourceScope: 'M3-1', semanticScopeRelation: 'CURRENT_SCOPE' };
  const q = { id: 1, content: '고정된 이차함수 문항', choices: ['1', '2'], answer: '1', solution: '원 검토와 같은 풀이', image: '', ...values, grade: 'M3', rpmPrimaryId: 'M3-RPM-051' };
  const sourcePath = 'archive/exams/original/middle/m3/2mid/synthetic-scope.js';
  f.put(sourcePath, 'window.questionBank=' + JSON.stringify([q]) + ';\n');
  const bytes = fs.readFileSync(path.join(f.root, sourcePath)), sourceBlob = f.git('hash-object', '-w', sourcePath);
  f.put(canonical + '/registry_index.json', { ...f.read(canonical + '/registry_index.json'), activePacks: [{ id: 'MIDDLE3', version: '1.0.0', status: 'ACTIVE' }] });
  f.put(pack + '/pack.json', { schemaVersion: 'meta-foundation-pack-v1', packId: 'MIDDLE3', packVersion: '1.0.0', canonicalStatus: 'ACTIVE',
    curricula: ['2015'], standardCourses: ['중3 수학', 'M3-1'], ownedStandardUnitDomains: ['M3-04'] });
  const pt = { ...f.tables.pt.get('PT_EXISTING'), ownerPack: 'MIDDLE3' }, tpl = { ...f.tables.tpl.get('TPL_EXISTING'), ownerPack: 'MIDDLE3' };
  f.put(pack + '/taxonomy.json', { status: 'ACTIVE', problemTypes: [pt], templates: [tpl] });
  f.put(pack + '/bindings.json', { status: 'ACTIVE', bindings: [] });f.put(pack + '/aliases.json', { aliases: [] });
  f.put('archive/data/master_tables/js_archive_tag_master.json', [
    { key: values.standardUnitKey, keyType: 'standardUnitKey', labelKo: values.standardUnit, status: 'active' },
    { key: values.subUnitKey, keyType: 'subUnitKey', labelKo: values.subUnit, parentKey: values.standardUnitKey, status: 'active' }]);
  const parentRef = f.put(parentPath, { records: [{ ...parent, concepts: [] }] });
  const nativeAfter = { ...values };delete nativeAfter.semanticSourceScope;delete nativeAfter.semanticScopeRelation;
  const review = { schemaVersion: 'm3-s2-complete-semantic-review-v1', sourceArchiveFile: sourcePath.slice('archive/exams/'.length),
    author: 'native-scope-reviewer', rootIntegrator: 'native-integrator', questionCount: 1, sourceAfterBlob: sourceBlob, sourceAfterSha256: sha(bytes),
    mathR1R2R3: 'NOT_RUN_OUT_OF_SCOPE', items: [{ ordinal: 1, questionUid: 'uid1', decision: 'CORRECT', after: nativeAfter, debts: [],
      decisiveStep: '원래 범위의 이차함수 그래프', rpm: { originalCurriculum: '2015', base: { ...parent, recordId: q.rpmPrimaryId } } }] };
  const nativeRef = f.put('docs/scope-native-review.json', review);f.git('add', '.');f.git('commit', '-qm', 'synthetic immutable scope review');
  const before = { ...f.metadata, sourceArchiveFile: review.sourceArchiveFile, rpmPrimaryId: q.rpmPrimaryId };
  const full = sha(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const body = sha(JSON.stringify({ content: q.content, choices: q.choices, image: q.image }));
  const after = { ...values, sourceFingerprint: full, contentFingerprint: body, L1: parent.majorUnit, L2: parent.midUnit };
  const refs = [nativeRef, parentRef];
  const item = { questionUid: 'uid1', sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, before[k] ?? null])), after,
    identityBefore: { sourceFingerprint: before.sourceFingerprint }, reason: 'Exact original scope transport only.', evidenceRefs: refs,
    targetParentRef: { ...parent, ...parentRef }, sourceReview: { schemaVersion: 'archive-reviewed-source-reassessment-v1',
      reviewCommit: f.git('rev-parse', 'HEAD'), reviewPath: nativeRef.path, reviewRef: nativeRef,
      scopeFieldBinding: { schemaVersion: 'archive-native-reviewed-scope-fields-v1', fields: ['semanticSourceScope', 'semanticScopeRelation'] } } };
  const binding = { curriculum: '2015', standardCourse: values.standardCourse, standardUnitKey: values.standardUnitKey,
    subUnitKey: values.subUnitKey, problemTypeKey: values.problemTypeKey, status: 'ACTIVE', ownerPack: 'MIDDLE3', L1: parent.majorUnit, L2: parent.midUnit };
  const request = { ...f.request, requestId: 'native-scope-replay-fixture', sourceArchiveFile: review.sourceArchiveFile, expectedSourceBlobSha1: sourceBlob,
    approval: { ...f.request.approval, evidenceRefs: refs }, items: [item], registryChanges: [{ path: pack + '/bindings.json', collection: 'bindings',
      match: Object.fromEntries(['curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey', 'problemTypeKey'].map(k => [k, binding[k]])),
      before: null, after: binding, evidenceRefs: refs }] };
  f.put('archive/data/question_metadata.json', { records: [before], counts: {} });f.put('archive/data/question_identity_map.json', { records: [clone(before)] });
  return { ...f, pack, request, item, sourcePath, receiptPath: 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/' + request.requestId + '.json' };
}

test('native scope writes and replays an exact add-only binding with its original two-field proof', async t => {
  const f = await scopeWriterFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request, write: true }).totalQuestions, 1);
  assert.equal(registerReviewedExamV2({ root: f.root, request: f.request }).replay, true);
  assert.deepEqual(f.read(f.receiptPath).fingerprintRepairs[0].sourceReview.scopeFieldBindings.fields, ['semanticSourceScope', 'semanticScopeRelation']);
});

test('native scope replay refuses deletion of its explicit scope witness', async t => {
  const f = await scopeWriterFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });const receipt = f.read(f.receiptPath);
  delete receipt.fingerprintRepairs[0].sourceReview.scopeFieldBindings;f.put(f.receiptPath, receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered (?:opt-in|scope).*proof|reviewed source binding:/);
});

test('native scope replay recomputes its witness even after a receipt and sidecar are resigned together', async t => {
  const f = await scopeWriterFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  const { buildReviewedSourceBinding, reviewedSourceBindingPath } = await import('../archive/tools/meta-foundation/reviewed-source-binding.mjs');
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const receipt = f.read(f.receiptPath), bindingPath = reviewedSourceBindingPath(f.request.requestId);
  receipt.fingerprintRepairs[0].sourceReview.scopeFieldBindings.fields = ['semanticSourceScope'];
  f.put(bindingPath, buildReviewedSourceBinding({ ...receipt, request: f.request }));
  receipt.outputDigests.find(ref => ref.path === bindingPath).sha256 = sha(fs.readFileSync(path.join(f.root, bindingPath)));
  f.put(f.receiptPath, receipt);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /registered explicit source review proof drift/);
});

test('native scope replay rejects drift in the registered add-only binding rather than inventing a before context', async t => {
  const f = await scopeWriterFixture(t), { registerReviewedExamV2 } = await import('../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs');
  registerReviewedExamV2({ root: f.root, request: f.request, write: true });
  const doc = f.read(f.pack + '/bindings.json'); doc.bindings[0].L2 = 'unreviewed parent'; f.put(f.pack + '/bindings.json', doc);
  assert.throws(() => registerReviewedExamV2({ root: f.root, request: f.request }), /native replay registry context: current canonical record differs/);
});
