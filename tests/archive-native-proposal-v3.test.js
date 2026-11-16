const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const adapter = import('../archive/tools/meta-foundation/reviewed-proposal-finalization.mjs');
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const clone = x => structuredClone(x);
const CANON = 'archive/data/meta-foundation/canonical/';

function fixture(t, kind, { omittedPrimary = false, textOnly = false, compositeParent = false, absentMatch = false, globalParent = false, nativeBindingOverride, missingBindingReview = false, curriculumTransport = false, scopeParentTransport = false, nativeCurriculumOwn = false, nativeCurriculumValue = null, sourceCurriculumOwn = false, sourceCurriculumValue = null, reviewedCurriculumCarry = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-proposal-v3-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...a) => execFileSync('git', a, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  git('init', '-q');git('config', 'user.name', 'Synthetic Test');git('config', 'user.email', 'test@example.invalid');
  const put = (p, x) => { const file = path.join(root, p);fs.mkdirSync(path.dirname(file), { recursive: true });fs.writeFileSync(file, typeof x === 'string' ? x : JSON.stringify(x, null, 2) + '\n');return { path: p, sha256: sha(fs.readFileSync(file)) }; };
  const scoped = curriculumTransport || scopeParentTransport;
  const source = scoped ? 'archive/exams/original/middle/m2/2mid/test.js' : 'archive/exams/original/test.js', reviewPath = 'docs/native.json', rpmPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const original = { content: '주어진 도형을 판정한다.', choices: ['가', '나'], answer: '가', solution: '검토된 풀이.', standardCourse: '중2 수학', standardUnitKey: 'M2-05', subUnitKey: 'M2-05-TRIANGLE_PROPERTIES', problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' };
  const assetPath = 'archive/assets/test.svg', asset = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  if (sourceCurriculumOwn) original.curriculum = sourceCurriculumValue;
  if (!textOnly) { original.image = 'assets/test.svg';put(assetPath, asset); }
  put(source, 'window.questionBank = ' + JSON.stringify([original]) + ';\n');
  const rpm = { id: 'M2-RPM-001', curriculum: '2015', scope: 'M2-2', standardUnitKey: 'M2-05', subUnitKey: original.subUnitKey, ownerPack: 'MIDDLE_GEOMETRY', rpmPath: { l3: '검토된 분류' } };
  if (scopeParentTransport) Object.assign(rpm.rpmPath, { majorUnit: '원 대단원', midUnit: '원 중단원', l4: '검토된 절차' });
  const rpmRef = put(rpmPath, { records: [rpm] });
  const pt = { problemTypeKey: 'PT_OLD', canonicalLabelKo: '기존 주유형', definition: '기존 정의', ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const tpl = { templateKey: 'TPL_OLD', parentProblemTypeKey: 'PT_OLD', canonicalLabelKo: '기존 절차', definition: '기존 절차 정의', ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const after = { problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' };
  if (nativeCurriculumOwn) after.curriculum = nativeCurriculumValue;
  const match = { problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', problemTypeStatus: 'ACTIVE', templateStatus: 'ACTIVE', templateParent: 'PT_OLD', exactBindings: [] };
  if (omittedPrimary) { delete after.problemTypeKey;delete after.templateKey; }
  if (kind === 'TPL') { delete after.templateKey;match.templateKey = null;match.templateStatus = null;match.templateParent = null; }
  if (kind === 'PT') { delete after.problemTypeKey;delete after.templateKey;Object.assign(match, { problemTypeKey: null, templateKey: null, problemTypeStatus: null, templateStatus: null, templateParent: null }); }
  if (globalParent) {
    delete after.problemTypeKey;pt.supportingQuestionUids = ['other-existing-application'];
    match.exactBindings = nativeBindingOverride ?? [{ curriculum: '2015', standardCourse: original.standardCourse, standardUnitKey: original.standardUnitKey, subUnitKey: original.subUnitKey, problemTypeKey: 'PT_OLD', status: 'ACTIVE' }];
  }
  const nativeItem = { sourceOrdinal: 1, questionUid: 'uid1', rpmRecordId: rpm.id, rpmDecision: 'KEEP', after, fieldReview: { classification: '정의 대조', binding: '정확한 ACTIVE 교육과정 연결을 대조했다.', difficulty: '원 판단 유지', crossConcept: '원래 없음', condition: '별도 조건 없음', integration: '한 주개념' }, activeDefinitionMatch: match, proposalRefs: ['P1'] };
  if (missingBindingReview) delete nativeItem.fieldReview.binding;
  if (absentMatch) delete nativeItem.activeDefinitionMatch;
  const proposal = { id: 'P1', type: kind === 'PT' ? 'NEW_PT' : kind === 'TPL' ? 'NEW_TPL' : 'CC', parent: kind === 'PT' ? `${rpm.id} / ${rpm.rpmPath.l3}` : compositeParent ? `PT_OLD / ${rpm.id}` : 'PT_OLD', definition: '새로 독립 검토한 정의', supportingQuestionUids: ['uid1'], ordinals: [1] };
  const nativeReview = { schemaVersion: 'm2-s2-meta-review-v1', examId: 'E001', reviewer: 'native-author', items: [nativeItem], proposals: [proposal] };
  if (scoped) nativeReview.sourceArchiveFile = source.slice('archive/exams/'.length);
  const nativeRef = put(reviewPath, nativeReview);git('add', '.');git('commit', '-qm', 'synthetic immutable native review');
  const nativeCommit = git('rev-parse', 'HEAD');
  const ref = { commit: nativeCommit, ...nativeRef }, snapshot = { commit: nativeCommit, sourcePath: source, blob: git('rev-parse', nativeCommit + ':' + source), sha256: sha(fs.readFileSync(path.join(root, source))), questionSha256: sha(stable(original)) };
  if (reviewedCurriculumCarry) {
    const reviewedQuestion = { ...clone(original), curriculum: '2015' };
    put(source, 'window.questionBank = ' + JSON.stringify([reviewedQuestion]) + ';\n');
    git('add', '.');git('commit', '-qm', 'synthetic explicit native curriculum transported to independent snapshot');
    Object.assign(snapshot, { commit: git('rev-parse', 'HEAD'), blob: git('rev-parse', 'HEAD:' + source),
      sha256: sha(fs.readFileSync(path.join(root, source))), questionSha256: sha(stable(reviewedQuestion)) });
  }
  const assets = textOnly ? [] : [{ path: assetPath, gitBlobSha1: git('rev-parse', nativeCommit + ':' + assetPath), sha256: sha(asset), visuallyInspected: true }];
  const selection = { documentRef: nativeRef, index: 0, proposalSha256: sha(stable(proposal)), questionUid: 'uid1', sourceOrdinal: 1, proposalId: 'P1' };
  const newPtKey = kind === 'PT' ? 'PT_FINAL' : 'PT_OLD', newTplKey = ['PT', 'TPL'].includes(kind) ? 'TPL_FINAL' : 'TPL_OLD';
  const context = { standardCourse: original.standardCourse, standardUnitKey: original.standardUnitKey, subUnitKey: original.subUnitKey, problemTypeKey: newPtKey, templateKey: newTplKey };
  const concept = { conceptKey: 'CC_FINAL', canonicalLabelKo: '독립 검토 개념', definition: proposal.definition, ownerConceptShard: 'PLANE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const template = { templateKey: 'TPL_FINAL', parentProblemTypeKey: newPtKey, canonicalLabelKo: '독립 검토 절차', definition: proposal.definition, ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const parent = { problemTypeKey: 'PT_FINAL', canonicalLabelKo: '독립 검토 유형', definition: proposal.definition, ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const change = (p, collection, key, definition) => ({ path: p, collection, match: { [key]: definition[key] }, before: null, after: definition });
  const conceptPath = CANON + 'concepts/plane-geometry.json', taxPath = CANON + 'packs/middle-geometry/taxonomy.json', bindingPath = CANON + 'packs/middle-geometry/bindings.json';
  const choice = { selection, disposition: kind === 'CC_REUSE' ? 'REUSE_ACTIVE' : 'ADD_ONLY', reason: '원 제안의 정확한 정의만 확정한다.', definition: ['PT', 'TPL'].includes(kind) ? template : concept };
  const changes = [];
  if (kind === 'CC_REUSE') {
    put(conceptPath, { concepts: [concept] });const priorPath = 'docs/prerequisite.json';const priorRef = put(priorPath, { registryChanges: [change(conceptPath, 'concepts', 'conceptKey', concept)] });git('add', '.');git('commit', '-qm', 'synthetic separately installed definition');
    choice.canonicalPath = conceptPath;choice.prerequisiteDefinitionRef = { commit: git('rev-parse', 'HEAD'), ...priorRef, definitionSha256: sha(stable(concept)) };
  } else { choice.registryChange = ['PT', 'TPL'].includes(kind) ? change(taxPath, 'templates', 'templateKey', template) : change(conceptPath, 'concepts', 'conceptKey', concept);changes.push(choice.registryChange); }
  const binding = { curriculum: '2015', ...context, ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };delete binding.templateKey;
  if (kind === 'PT') {
    choice.problemTypeDefinition = parent;choice.problemTypeRegistryChange = change(taxPath, 'problemTypes', 'problemTypeKey', parent);changes.push(choice.problemTypeRegistryChange);
    choice.binding = binding;choice.bindingRegistryChange = { path: bindingPath, collection: 'bindings', match: Object.fromEntries(['problemTypeKey', 'curriculum', 'standardCourse', 'standardUnitKey', 'subUnitKey'].map(k => [k, binding[k]])), before: null, after: binding };changes.push(choice.bindingRegistryChange);
  }
  const row = { examId: 'E001', sourceOrdinal: 1, questionUid: 'uid1', sourcePath: source, nativeReviewRef: ref, nativeItemStableSha256: sha(stable(nativeItem)), nativeProposal: proposal, proposalSelection: selection, nativeAfter: clone(after), nativeActiveDefinitionMatch: clone(nativeItem.activeDefinitionMatch ?? null), nativeRpmContext: { ...rpmRef, record: rpm }, sourceSnapshot: snapshot, rendererAssets: assets, textOnlyItem: textOnly, protectedPayloadFieldsUnchanged: true, reviewedPrimaryContext: context, decision: choice, independentRationale: '원 문항과 제안의 정확한 범위를 독립 대조했다.', newFullMathematicalQa: false, newReview2: false, newMetadataApproval: false, newDifficultyJudgment: false, sourceWrites: 0 };
  const witness = { schemaVersion: 'archive-independent-m2-native-definition-finalization-v1', decision: 'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS', reviewer: 'independent-reviewer', currentMainChecked: snapshot.commit, newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, existingDefinitionsModified: 0, sourceWrites: 0, canonicalWrites: 0, officialCompilerResolverConsumerStillRequired: true, actualMainRegistrationClaimed: false, approvedRegistryChanges: changes, rows: [row] };
  const app = { examId: row.examId, sourceOrdinal: 1, questionUid: 'uid1', sourcePath: source, nativeReviewRef: ref, nativeItemStableSha256: row.nativeItemStableSha256, sourceSnapshot: snapshot, rendererAssets: assets, reviewedPrimaryContext: context, reviewer: witness.reviewer, reason: row.independentRationale, proposalSelections: [selection], decisions: [choice], newMathematicalQa: false, newMetadataApproval: false, difficultyChanged: false, nativeProtectedStudentFieldsChanges: [] };
  const proof = { schemaVersion: 'archive-independent-m2-native-proposal-disposition-v1', status: 'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING', scope: { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newSourceContentEdits: 0 }, applications: [app] };
  const current = { ...clone(original), ...(reviewedCurriculumCarry ? { curriculum: '2015' } : {}), ...context, ...(['PT', 'TPL'].includes(kind) ? {} : { crossConceptKeys: ['CC_FINAL'] }) };
  const final = { ...current, curriculum: '2015', ...(scopeParentTransport ? { courseKey: 'M2-2' } : {}) };
  const before = { pt: new Map([['PT_OLD', pt]]), tpl: new Map([['TPL_OLD', tpl]]), cc: new Map(kind === 'CC_REUSE' ? [['CC_FINAL', concept]] : []), bindings: new Map() };
  const bindingKey = stable(['2015', context.standardCourse, context.standardUnitKey, context.subUnitKey, context.problemTypeKey]);
  if (kind !== 'PT') before.bindings.set(bindingKey, binding);
  const compiled = { pt: new Map(before.pt), tpl: new Map(before.tpl), cc: new Map(before.cc), bindings: new Map(before.bindings) };
  if (scopeParentTransport) {
    const pack = { meta: { packId: 'MIDDLE_GEOMETRY', canonicalStatus: 'ACTIVE', curricula: ['2015'], standardCourses: ['중2 수학', 'M2-2'] } };
    before.packs = new Map([['MIDDLE_GEOMETRY', pack]]);compiled.packs = new Map(before.packs);
  }
  if (kind === 'PT') compiled.pt.set('PT_FINAL', parent);
  if (['PT', 'TPL'].includes(kind)) compiled.tpl.set('TPL_FINAL', template);else compiled.cc.set('CC_FINAL', concept);
  compiled.bindings.set(bindingKey, binding);
  const item = { questionUid: 'uid1', sourceOrdinal: 1, after: clone(final), sourceReview: {}, evidenceRefs: [] };
  const request = { sourceArchiveFile: 'original/test.js', expectedQuestionCount: 1, approval: { evidenceRefs: [] }, registryChanges: [] };
  if (scoped) {
    request.sourceArchiveFile = source.slice('archive/exams/'.length);request.scope = 'PARTIAL_UIDS';
    request.approval.type = 'FINAL_QA';request.approval.metadataReviewed = true;item.before = { curriculum: null, ...(scopeParentTransport ? { courseKey: null } : {}) };
  }
  const ctx = { root, request, patch: item, row: nativeItem, accepted: clone(after), question: current, final, native: { spec: { reviewCommit: nativeCommit, reviewPath, reviewRef: nativeRef }, review: nativeReview, reviewer: 'native-author', committedBank: [clone(original)], reviewedBank: [clone(original)] }, canonicalBefore: before, canonicalAfter: compiled, cache: new Map(), studentPayload: q => Object.fromEntries(['content', 'choices', 'answer', 'solution', 'image'].map(k => [k, q[k] ?? null])), bankFromBytes: bytes => { const c = { window: {} };vm.runInNewContext(bytes.toString(), c);return JSON.parse(JSON.stringify(c.window.questionBank)); } };
  if (scoped) ctx.metadata = {};
  const masterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const master = { records: [{ curriculum: '2015', scope: 'M2-2', majorUnit: rpm.rpmPath.majorUnit,
    midUnit: rpm.rpmPath.midUnit, defaultSelectable: true,
    concepts: [{ concept: rpm.rpmPath.l3, defaultSelectable: true, problemTypes: [{ problemType: rpm.rpmPath.l4, defaultSelectable: true }] }] }] };
  const update = () => {
    const witnessRef = put('docs/independent.json', witness);app.independentReviewRef = witnessRef;
    const proofRef = put('docs/disposition.json', proof);request.approval.evidenceRefs = item.evidenceRefs = [witnessRef, proofRef];
    if (scopeParentTransport) {
      const masterRef = put(masterPath, master);request.approval.evidenceRefs.push(masterRef);
      item.targetParentRef = { ...masterRef, curriculum: '2015', scope: 'M2-2', majorUnit: rpm.rpmPath.majorUnit,
        midUnit: rpm.rpmPath.midUnit, finalizedScopeParent: { schemaVersion: 'archive-native-m2-finalized-scope-parent-v1' } };
    }
    request.registryChanges = changes.map(c => ({ ...clone(c), evidenceRefs: [witnessRef, proofRef] }));git('add', '.');git('commit', '--allow-empty', '-qm', 'synthetic finalization');
    item.sourceReview.proposalFinalization = { schemaVersion: 'archive-native-proposal-finalization-v3', finalizationCommit: git('rev-parse', 'HEAD'), finalizationRef: proofRef, proposalSelections: [selection] };ctx.cache = new Map();
    if (scoped) {
      Object.assign(item.sourceReview, { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: nativeCommit, reviewPath, reviewRef: nativeRef });
      if (curriculumTransport) item.sourceReview.proposalFinalization.curriculumTransport = { schemaVersion: 'archive-native-m2-finalized-curriculum-v1' };
      if (scopeParentTransport) item.sourceReview.proposalFinalization.scopeParentTransport = { schemaVersion: 'archive-native-m2-finalized-scope-parent-v1' };
    }
  };
  update();return { root, ctx, update, proof, witness, row, app, choice, changes, nativeItem, proposal, put, git, original, current, final, before, compiled, assetPath, master, masterPath };
}

for (const kind of ['CC_ADD', 'CC_REUSE', 'TPL', 'PT']) test(`v3 preserves immutable evidence and finalizes exact ${kind}`, async t => {
  const f = fixture(t, kind), { validateNativeProposalFinalization } = await adapter;
  const result = validateNativeProposalFinalization(f.ctx);
  assert.equal(result.proof.schemaVersion, 'archive-native-proposal-finalization-v3');
  assert.equal(result.proof.newMathematicalQa, false);
  assert.equal(result.proof.independentReviewRefs.length, 1);
  assert.deepEqual(result.fields[kind.startsWith('CC') ? 'crossConceptKeys' : 'templateKey'], kind.startsWith('CC') ? ['CC_FINAL'] : 'TPL_FINAL');
  if (kind === 'PT') assert.equal(result.fields.problemTypeKey, 'PT_FINAL');
});
test('v3 text-only composite parent does not invent a missing picture or native ACTIVE match', async t => {
  const g = fixture(t, 'TPL', { textOnly: true, compositeParent: true, absentMatch: true });
  const result = (await adapter).validateNativeProposalFinalization(g.ctx);assert.deepEqual(result.proof.assetBindings, []);
});
test('v3 CC delta may retain a native primary supported by that same UID', async t => {
  const f = fixture(t, 'CC_ADD', { omittedPrimary: true }), { validateNativeProposalFinalization } = await adapter;const result = validateNativeProposalFinalization(f.ctx);
  assert.equal(result.fields.problemTypeKey, 'PT_OLD');assert.equal(result.fields.templateKey, 'TPL_OLD');
  f.before.pt.get('PT_OLD').supportingQuestionUids = ['different-uid'];assert.throws(() => validateNativeProposalFinalization(f.ctx), /same UID|UID support/);
});
test('v3 independently finalized template reuses an exact native ACTIVE global parent', async t => {
  const f = fixture(t, 'TPL', { globalParent: true }), result = (await adapter).validateNativeProposalFinalization(f.ctx);
  assert.equal(result.fields.problemTypeKey, 'PT_OLD');
  assert.match(result.proof.dispositions[0].retainedNativeFields.finalizedTemplateParentBindingSha256, /^[a-f0-9]{64}$/);
});
for (const [label, options] of [
  ['missing native exact binding', { nativeBindingOverride: [] }],
  ['wrong native exact binding', { nativeBindingOverride: [{ curriculum: '2022', standardCourse: '중2 수학', standardUnitKey: 'M2-05', subUnitKey: 'M2-05-TRIANGLE_PROPERTIES', problemTypeKey: 'PT_OLD', status: 'ACTIVE' }] }],
  ['native binding review omitted', { missingBindingReview: true }],
]) test(`v3 global parent reuse refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { globalParent: true, ...options }), { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /omitted parent/);
});

const negatives = [
  ['independent original ref omitted', 'CC_ADD', f => {
    delete f.app.independentReviewRef;
    const ref = f.put('docs/disposition.json', f.proof);f.git('add', '.');f.git('commit', '-qm', 'synthetic signed missing witness');
    f.ctx.patch.sourceReview.proposalFinalization.finalizationRef = ref;
    f.ctx.patch.sourceReview.proposalFinalization.finalizationCommit = f.git('rev-parse', 'HEAD');
    f.ctx.patch.evidenceRefs.push(ref);
  }, false],
  ['original witness overclaims full QA', 'CC_ADD', f => { f.witness.newFullMathematicalQa = true; }, true],
  ['original witness changes exact native proposal', 'CC_REUSE', f => { f.row.nativeProposal = { ...f.proposal, definition: '다른 정의' }; }, true],
  ['wrong original UID', 'TPL', f => { f.row.questionUid = 'other'; }, true],
  ['different independent reviewer', 'TPL', f => { f.app.reviewer = 'native-author'; }, true],
  ['current student answer changed', 'CC_ADD', f => { f.current.answer = '나'; }, false],
  ['renderer asset bytes changed', 'CC_ADD', f => { f.put(f.assetPath, '<svg/>'); }, false],
  ['renderer inventory omitted', 'TPL', f => { f.row.rendererAssets = f.app.rendererAssets = []; }, true],
  ['text-only declaration used for a figure', 'TPL', f => { f.row.textOnlyItem = true; }, true],
  ['wrong curriculum', 'TPL', f => { f.final.curriculum = '2022'; }, false],
  ['RPM record rewritten', 'TPL', f => { f.row.nativeRpmContext.record = { ...f.row.nativeRpmContext.record, curriculum: '2022' }; }, true],
  ['template owner omitted', 'TPL', f => { delete f.choice.definition.ownerPack; }, true],
  ['template attached to another parent', 'TPL', f => { f.choice.definition.parentProblemTypeKey = 'PT_OTHER'; }, true],
  ['existing parent changed', 'TPL', f => { f.compiled.pt.set('PT_OLD', { ...f.before.pt.get('PT_OLD'), definition: '변경' }); }, false],
  ['reused concept replaced', 'CC_REUSE', f => { f.compiled.cc.set('CC_FINAL', { ...f.before.cc.get('CC_FINAL'), definition: '변경' }); }, false],
  ['reused prerequisite wrong commit', 'CC_REUSE', f => { f.choice.prerequisiteDefinitionRef.commit = 'a'.repeat(40); }, true],
  ['new PT with already settled native parent', 'PT', f => { f.ctx.row.after.problemTypeKey = 'PT_OLD';f.ctx.accepted.problemTypeKey = 'PT_OLD'; }, false],
  ['new PT without original definition gap', 'PT', f => { f.ctx.row.activeDefinitionMatch.problemTypeKey = 'PT_OLD'; }, false],
  ['new binding expands supporting UIDs', 'PT', f => { f.choice.binding.supportingQuestionUids.push('other');f.choice.binding.supportingItemCount = 2; }, true],
  ['new binding lacks request witness ref', 'PT', f => { f.ctx.request.registryChanges.find(c => c.collection === 'bindings').evidenceRefs = []; }, false],
  ['new primary compiled binding missing', 'PT', f => { f.compiled.bindings.clear(); }, false],
  ['unrequested final key', 'TPL', f => { delete f.ctx.patch.after.templateKey; }, false],
  ['registration identity-only mode', 'CC_REUSE', f => { f.ctx.request.registrationMode = 'IDENTITY_FINGERPRINT_ONLY'; }, false],
  ['explicit native content hold', 'CC_ADD', f => { f.ctx.row.contentDebt = ['SOURCE_REPAIR_REQUIRED']; }, false],
  ['explicit native difficulty hold', 'CC_ADD', f => { f.ctx.row.registrationDebt = ['DIFFICULTY_HOLD']; }, false],
];
for (const [label, kind, mutate, resign] of negatives) test(`v3 refuses ${label}`, async t => {
  const f = fixture(t, kind);mutate(f);if (resign) f.update();
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /native proposal finalization:/);
});

for (const kind of ['CC_ADD', 'TPL', 'PT']) test(`v3 curriculum transport accepts exact omitted native scope for ${kind}`, async t => {
  const f = fixture(t, kind, { curriculumTransport: true }), { validateNativeProposalFinalization } = await adapter;
  const sourceBefore = fs.readFileSync(path.join(f.root, f.row.sourcePath));
  const nativeBefore = fs.readFileSync(path.join(f.root, 'docs/native.json'));
  const result = validateNativeProposalFinalization(f.ctx);
  assert.equal(result.fields.curriculum, '2015');
  assert.equal(Object.hasOwn(result.proof.finalizedFields, 'curriculum'), false);
  assert.deepEqual(result.proof.curriculumTransport.metadataBefore, { curriculum: { present: false }, curriculumKey: { present: false } });
  assert.equal(result.proof.curriculumTransport.nativeRpmContext.scope, 'M2-2');
  assert.equal(result.proof.curriculumTransport.sourceWrites, 0);
  assert.equal(result.proof.curriculumTransport.newMathematicalQa, false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, f.row.sourcePath)), sourceBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native.json')), nativeBefore);
  assert.equal(Object.hasOwn(f.current, 'curriculum'), false);
  f.ctx.metadata = { curriculum: null, curriculumKey: '2015' };
  f.ctx.issuedSourceReview = { proposalFinalization: result.proof };
  assert.deepEqual(validateNativeProposalFinalization(f.ctx), result);
});

test('v3 curriculum transport is never inferred from a missing request option', async t => {
  const f = fixture(t, 'TPL', { curriculumTransport: true });
  delete f.ctx.patch.sourceReview.proposalFinalization.curriculumTransport;
  const result = (await adapter).validateNativeProposalFinalization(f.ctx);
  assert.equal(Object.hasOwn(result.fields, 'curriculum'), false);
  assert.equal(Object.hasOwn(result.proof, 'curriculumTransport'), false);
});

for (const [label, options] of [
  ['native after own-null', { nativeCurriculumOwn: true }],
  ['native after already carries the same year', { nativeCurriculumOwn: true, nativeCurriculumValue: '2015' }],
  ['native/source own-null', { sourceCurriculumOwn: true }],
  ['native/source already carries the same year', { sourceCurriculumOwn: true, sourceCurriculumValue: '2015' }],
  ['native/source carries another year', { sourceCurriculumOwn: true, sourceCurriculumValue: '2022' }],
]) test(`v3 curriculum transport refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { curriculumTransport: true, ...options });
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /curriculum transport requires absent native and source/);
});

const curriculumNegatives = [
  ['null option', f => { f.ctx.patch.sourceReview.proposalFinalization.curriculumTransport = null; }],
  ['unknown option key', f => { f.ctx.patch.sourceReview.proposalFinalization.curriculumTransport.allow = true; }],
  ['wrong named schema', f => { f.ctx.patch.sourceReview.proposalFinalization.curriculumTransport.schemaVersion = 'other'; }],
  ['wrong proposal profile', f => { f.ctx.patch.sourceReview.proposalFinalization.schemaVersion = 'archive-native-proposal-finalization-v2'; }],
  ['other approval kind', f => { f.ctx.request.approval.type = 'REVIEW2'; }],
  ['full request', f => { f.ctx.request.scope = 'FULL'; }],
  ['source preservation mixed in', f => { f.ctx.request.approval.sourceRebind = {}; }],
  ['item rebind mixed in', f => { f.ctx.patch.rebind = {}; }],
  ['retained adapter mixed in', f => { f.ctx.patch.sourceReview.retainedFields = {}; }],
  ['renderer adapter mixed in', f => { f.ctx.patch.sourceReview.rendererProof = {}; }],
  ['other grade', f => { f.ctx.request.sourceArchiveFile = 'original/middle/m3/2mid/test.js'; }],
  ['other semester', f => { f.ctx.request.sourceArchiveFile = 'original/middle/m2/1mid/test.js'; }],
  ['contradicting course key in current source', f => { f.current.courseKey = 'M2-1'; }],
  ['contradicting course semester in current source', f => { f.current.courseSemester = 'M2-1'; }],
  ['contradicting course key in current metadata', f => { f.ctx.metadata.courseKey = 'M2-1'; f.final.courseKey = 'M2-1'; }],
  ['contradicting course semester in current metadata', f => { f.ctx.metadata.courseSemester = 'M2-1'; f.final.courseSemester = 'M2-1'; }],
  ['current source course own-null', f => { f.current.courseKey = null; }],
  ['current source matching semester still declared', f => { f.current.courseSemester = 'M2-2'; }],
  ['native source existing grade', f => { f.ctx.native.committedBank[0].grade = 3; }],
  ['native source existing semester', f => { f.ctx.native.reviewedBank[0].semester = 1; }],
  ['native after declared course key', f => { f.nativeItem.after.courseKey = 'M2-1'; }],
  ['request course key after', f => { f.ctx.patch.after.courseKey = 'M2-2'; }],
  ['request course semester before', f => { f.ctx.patch.before.courseSemester = null; }],
  ['initial metadata matching course still declared', f => { f.ctx.metadata.courseKey = '중2 수학'; }],
  ['initial metadata grade alias', f => { f.ctx.metadata.grade = 3; }],
  ['initial metadata semester own-null', f => { f.ctx.metadata.semester = null; }],
  ['current source gradeKey alias', f => { f.current.gradeKey = 'M2'; }],
  ['initial metadata gradeKey alias', f => { f.ctx.metadata.gradeKey = 'M2'; }],
  ['missing explicit before', f => { delete f.ctx.patch.before.curriculum; }],
  ['existing conflicting before', f => { f.ctx.patch.before.curriculum = '2022'; }],
  ['wrong explicit after', f => { f.ctx.patch.after.curriculum = '2022'; }],
  ['extra curriculum alias after', f => { f.ctx.patch.after.curriculumKey = '2015'; }],
  ['current source own-null', f => { f.current.curriculum = null; }],
  ['current source own matching year', f => { f.current.curriculum = '2015'; }],
  ['current source own conflicting year', f => { f.current.curriculum = '2022'; }],
  ['current source own-null alias', f => { f.current.curriculumKey = null; }],
  ['reviewed native source own-null', f => { f.ctx.native.reviewedBank[0].curriculum = null; }],
  ['committed native source own-null alias', f => { f.ctx.native.committedBank[0].curriculumKey = null; }],
  ['initial metadata own-null', f => { f.ctx.metadata.curriculum = null; }],
  ['initial metadata own-null alias', f => { f.ctx.metadata.curriculumKey = null; }],
  ['initial metadata existing year', f => { f.ctx.metadata.curriculum = '2015'; }],
];
for (const [label, mutate] of curriculumNegatives) test(`v3 curriculum transport refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { curriculumTransport: true });mutate(f);
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /native proposal finalization:/);
});

test('v3 curriculum transport cannot attach to a reuse-only definition', async t => {
  const f = fixture(t, 'CC_REUSE', { curriculumTransport: true });
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /exclusive explicit M2 partial/);
});

for (const [label, mutate] of [
  ['issued absence marker', f => { f.ctx.issuedSourceReview.proposalFinalization.curriculumTransport.metadataBefore.curriculum.present = true; }],
  ['issued RPM identity', f => { f.ctx.issuedSourceReview.proposalFinalization.curriculumTransport.nativeRpmContext.recordId = 'OTHER'; }],
  ['issued native row digest', f => { f.ctx.issuedSourceReview.proposalFinalization.curriculumTransport.nativeItemSha256 = '0'.repeat(64); }],
  ['issued evidence omission', f => { delete f.ctx.issuedSourceReview; }],
  ['replayed before year', f => { f.ctx.metadata.curriculum = '2015'; }],
  ['replayed derived alias year', f => { f.ctx.metadata.curriculumKey = '2022'; }],
  ['replayed conflicting course alias', f => { f.ctx.metadata.courseKey = 'M2-1'; }],
  ['replayed conflicting semester alias', f => { f.ctx.metadata.courseSemester = 'M2-1'; }],
]) test(`v3 curriculum transport replay refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { curriculumTransport: true }), { validateNativeProposalFinalization } = await adapter;
  const result = validateNativeProposalFinalization(f.ctx);
  f.ctx.metadata = { curriculum: null, curriculumKey: '2015' };
  f.ctx.issuedSourceReview = { proposalFinalization: result.proof };mutate(f);
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /curriculum transport/);
});

test('v3 curriculum transport replay retains only the exact derived course display', async t => {
  const f = fixture(t, 'TPL', { curriculumTransport: true }), { validateNativeProposalFinalization } = await adapter;
  const result = validateNativeProposalFinalization(f.ctx);
  f.ctx.metadata = { curriculum: null, curriculumKey: '2015', courseKey: '중2 수학' };
  f.final.courseKey = '중2 수학';f.ctx.issuedSourceReview = { proposalFinalization: result.proof };
  assert.deepEqual(validateNativeProposalFinalization(f.ctx), result);
});

for (const kind of ['CC_ADD', 'CC_REUSE', 'TPL', 'PT']) for (const explicit of [false, true])
  test(`v3 scope parent carries exact M2-2 with ${explicit ? 'explicit' : 'absent'} curriculum for ${kind}`, async t => {
    const f = fixture(t, kind, { scopeParentTransport: true, ...(explicit ? { nativeCurriculumOwn: true,
      nativeCurriculumValue: '2015', sourceCurriculumOwn: true, sourceCurriculumValue: '2015' } : {}) });
    const { validateNativeProposalFinalization } = await adapter, result = validateNativeProposalFinalization(f.ctx);
    assert.equal(result.fields.courseKey, 'M2-2');
    assert.equal(Object.hasOwn(result.proof.finalizedFields, 'courseKey'), false);
    assert.equal(result.proof.scopeParentTransport.originalCurriculum, explicit ? 'EXPLICIT_NATIVE_AND_SOURCE_2015' : 'ABSENT_NATIVE_AND_SOURCE');
    assert.deepEqual(result.proof.scopeParentTransport.fields, explicit ? { courseKey: 'M2-2' } : { curriculum: '2015', courseKey: 'M2-2' });
    assert.deepEqual(result.proof.scopeParentTransport.parent, { curriculumKey: '2015', courseKey: 'M2-2', L1: '원 대단원', L2: '원 중단원' });
    const { checkedM2FinalizedParent } = await import('../archive/tools/meta-foundation/reviewed-m2-finalized-scope-parent.mjs');
    const resolved = { curriculum: '2015', course: '중2 수학', binding: [...f.compiled.bindings.values()][0], pack: f.compiled.packs.get('MIDDLE_GEOMETRY') };
    const row = { ...f.final, questionUid: 'uid1', sourceOrdinal: 1 };
    assert.deepEqual(checkedM2FinalizedParent({ request: f.ctx.request, patch: f.ctx.patch, row, resolved,
      sourceReview: { proposalFinalization: result.proof } }), result.proof.scopeParentTransport.parent);
    f.ctx.metadata = { curriculum: null, courseKey: null, curriculumKey: '2015' };
    Object.assign(f.final, { curriculumKey: '2015', L1: '원 대단원', L2: '원 중단원' });
    f.ctx.issuedSourceReview = { proposalFinalization: result.proof };
    assert.deepEqual(validateNativeProposalFinalization(f.ctx), result);
  });

const scopeParentNegatives = [
  ['missing named schema', f => { f.ctx.patch.sourceReview.proposalFinalization.scopeParentTransport = {}; }],
  ['mixed old curriculum option', f => { f.ctx.patch.sourceReview.proposalFinalization.curriculumTransport = { schemaVersion: 'archive-native-m2-finalized-curriculum-v1' }; }],
  ['unknown option field', f => { f.ctx.patch.sourceReview.proposalFinalization.scopeParentTransport.scope = 'M2-2'; }],
  ['mixed renderer option', f => { f.ctx.patch.sourceReview.rendererProof = {}; }],
  ['mixed retained option', f => { f.ctx.patch.sourceReview.retainedFields = {}; }],
  ['other grade source', f => { f.ctx.request.sourceArchiveFile = 'original/middle/m3/2mid/test.js'; }],
  ['other semester source', f => { f.ctx.request.sourceArchiveFile = 'original/middle/m2/1mid/test.js'; }],
  ['missing before course', f => { delete f.ctx.patch.before.courseKey; }],
  ['nonempty before course', f => { f.ctx.patch.before.courseKey = 'M2-2'; }],
  ['after display course', f => { f.ctx.patch.after.courseKey = '중2 수학'; }],
  ['after wrong semester', f => { f.ctx.patch.after.courseKey = 'M2-1'; }],
  ['after own-null course', f => { f.ctx.patch.after.courseKey = null; }],
  ['final wrong semester', f => { f.final.courseKey = 'M2-1'; }],
  ['final curriculum alias mismatch', f => { f.final.curriculumKey = '2022'; }],
  ['request duplicate curriculum alias', f => { f.ctx.patch.after.curriculumKey = '2015'; }],
  ['source own-null curriculum', f => { f.current.curriculum = null; }],
  ['source added matching curriculum', f => { f.current.curriculum = '2015'; }],
  ['source conflicting curriculum', f => { f.current.curriculum = '2022'; }],
  ['source curriculum alias', f => { f.current.curriculumKey = '2015'; }],
  ['current source course alias', f => { f.current.courseKey = 'M2-2'; }],
  ['current source own-null course', f => { f.current.courseKey = null; }],
  ['current source semester alias', f => { f.current.semester = 2; }],
  ['current source grade alias', f => { f.current.grade = 2; }],
  ['current source gradeKey alias', f => { f.current.gradeKey = 'M2'; }],
  ['current source courseSemester alias', f => { f.current.courseSemester = 'M2-2'; }],
  ['reviewed native source course alias', f => { f.ctx.native.reviewedBank[0].courseKey = 'M2-2'; }],
  ['committed native source gradeKey alias', f => { f.ctx.native.committedBank[0].gradeKey = 'M2'; }],
  ['native after course alias', f => { f.nativeItem.after.courseKey = 'M2-2'; }],
  ['initial metadata own-null curriculum', f => { f.ctx.metadata.curriculum = null; }],
  ['initial metadata matching curriculum', f => { f.ctx.metadata.curriculum = '2015'; }],
  ['initial metadata matching course', f => { f.ctx.metadata.courseKey = 'M2-2'; }],
  ['initial metadata own-null course', f => { f.ctx.metadata.courseKey = null; }],
  ['initial metadata gradeKey', f => { f.ctx.metadata.gradeKey = 'M2'; }],
  ['initial metadata semester', f => { f.ctx.metadata.courseSemester = 'M2-1'; }],
  ['missing parent reference', f => { delete f.ctx.patch.targetParentRef; }],
  ['missing parent marker', f => { delete f.ctx.patch.targetParentRef.finalizedScopeParent; }],
  ['wrong parent scope', f => { f.ctx.patch.targetParentRef.scope = 'M2-1'; }],
  ['wrong parent major', f => { f.ctx.patch.targetParentRef.majorUnit = '다른 대단원'; }],
  ['wrong parent mid', f => { f.ctx.patch.targetParentRef.midUnit = '다른 중단원'; }],
  ['unknown parent field', f => { f.ctx.patch.targetParentRef.ignoreMaster = true; }],
  ['mixed basic parent', f => { f.ctx.patch.basicScopeParentRef = {}; }],
  ['mixed native parent', f => { f.ctx.patch.targetParentRef.nativeSourceReview = {}; }],
  ['missing item parent evidence', f => { f.ctx.patch.evidenceRefs = f.ctx.patch.evidenceRefs.filter(r => r.path !== f.masterPath); }],
  ['changed local master bytes', f => { f.put(f.masterPath, { records: [] }); }],
  ['missing current master', f => { fs.unlinkSync(path.join(f.root, f.masterPath)); }],
  ['duplicate parent', f => { f.master.records.push(clone(f.master.records[0]));f.update(); }],
  ['nonselectable parent', f => { f.master.records[0].defaultSelectable = false;f.update(); }],
  ['nonselectable leaf', f => { f.master.records[0].concepts[0].problemTypes[0].defaultSelectable = false;f.update(); }],
  ['missing exact native leaf', f => { f.master.records[0].concepts[0].problemTypes[0].problemType = '다른 절차';f.update(); }],
  ['missing ACTIVE binding', f => { f.compiled.bindings.clear(); }],
  ['missing owner course alias', f => { f.compiled.packs.get('MIDDLE_GEOMETRY').meta.standardCourses = ['중2 수학']; }],
  ['missing owner curriculum', f => { f.compiled.packs.get('MIDDLE_GEOMETRY').meta.curricula = ['2022']; }],
  ['inactive current owner', f => { f.compiled.packs.get('MIDDLE_GEOMETRY').meta.canonicalStatus = 'HOLD'; }],
];
for (const [label, mutate] of scopeParentNegatives) test(`v3 scope parent refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { scopeParentTransport: true });mutate(f);
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /M2 finalized scope parent:|native proposal finalization:/);
});

for (const [label, mutate] of [
  ['issued proof missing', f => { delete f.ctx.issuedSourceReview; }],
  ['issued parent changed', f => { f.ctx.issuedSourceReview.proposalFinalization.scopeParentTransport.parent.L2 = '다른 부모'; }],
  ['issued metadata absence changed', f => { f.ctx.issuedSourceReview.proposalFinalization.scopeParentTransport.metadataBefore.courseKey.present = true; }],
  ['issued RPM record changed', f => { f.ctx.issuedSourceReview.proposalFinalization.scopeParentTransport.nativeRpmContext.recordId = 'OTHER'; }],
  ['before course restoration changed', f => { f.ctx.metadata.courseKey = 'M2-2'; }],
  ['derived curriculum alias changed', f => { f.ctx.metadata.curriculumKey = '2022'; }],
  ['new metadata grade alias', f => { f.ctx.metadata.gradeKey = 'M2'; }],
  ['issued canonical label changed', f => { f.final.L1 = '다른 대단원'; }],
]) test(`v3 scope parent replay refuses ${label}`, async t => {
  const f = fixture(t, 'TPL', { scopeParentTransport: true }), { validateNativeProposalFinalization } = await adapter;
  const result = validateNativeProposalFinalization(f.ctx);
  f.ctx.metadata = { curriculum: null, courseKey: null, curriculumKey: '2015' };
  Object.assign(f.final, { curriculumKey: '2015', L1: '원 대단원', L2: '원 중단원' });
  f.ctx.issuedSourceReview = { proposalFinalization: clone(result.proof) };mutate(f);
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /M2 finalized scope parent:/);
});

test('v3 scope parent preserves explicit native curriculum carried from absent original sources', async t => {
  const f = fixture(t, 'CC_REUSE', { scopeParentTransport: true, nativeCurriculumOwn: true,
    nativeCurriculumValue: '2015', reviewedCurriculumCarry: true });
  const { validateNativeProposalFinalization } = await adapter;
  const originalNative = fs.readFileSync(path.join(f.root, 'docs/native.json'));
  const result = validateNativeProposalFinalization(f.ctx), proof = result.proof.scopeParentTransport;
  assert.equal(proof.originalCurriculum, 'EXPLICIT_NATIVE_AFTER_CARRIED_TO_REVIEWED_SOURCE_2015');
  assert.equal(proof.nativeCurriculumCarry.schemaVersion, 'archive-native-m2-explicit-curriculum-source-carry-v1');
  assert.deepEqual(proof.nativeCurriculumCarry.originalSources, { reviewed: { present: false }, committed: { present: false } });
  assert.equal(proof.nativeCurriculumCarry.nativeAfterSha256, sha(stable('2015')));
  assert.equal(proof.nativeCurriculumCarry.independentSource.commit, f.app.sourceSnapshot.commit);
  assert.deepEqual(proof.fields, { courseKey: 'M2-2' });
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'docs/native.json')), originalNative);
  f.ctx.metadata = { curriculum: null, courseKey: null, curriculumKey: '2015' };
  Object.assign(f.final, { curriculumKey: '2015', L1: '원 대단원', L2: '원 중단원' });
  f.ctx.issuedSourceReview = { proposalFinalization: clone(result.proof) };
  assert.deepEqual(validateNativeProposalFinalization(f.ctx), result);
});

for (const [label, options] of [
  ['native after absent', { nativeCurriculumOwn: false }],
  ['native after null', { nativeCurriculumValue: null }],
  ['native after conflicting', { nativeCurriculumValue: '2022' }],
  ['both original sources null', { sourceCurriculumOwn: true, sourceCurriculumValue: null }],
  ['both original sources conflicting', { sourceCurriculumOwn: true, sourceCurriculumValue: '2022' }],
]) test(`v3 explicit native curriculum carry refuses resealed ${label}`, async t => {
  const f = fixture(t, 'CC_REUSE', { scopeParentTransport: true, nativeCurriculumOwn: true,
    nativeCurriculumValue: '2015', reviewedCurriculumCarry: true, ...options });
  const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /M2 finalized scope parent:/);
});

for (const [label, mutate] of [
  ['only reviewed original source has matching value', f => { f.ctx.native.reviewedBank[0].curriculum = '2015'; }],
  ['only committed original source has matching value', f => { f.ctx.native.committedBank[0].curriculum = '2015'; }],
  ['reviewed original null', f => { f.ctx.native.reviewedBank[0].curriculum = null; }],
  ['accepted value absent', f => { delete f.ctx.accepted.curriculum; }],
  ['accepted value null', f => { f.ctx.accepted.curriculum = null; }],
  ['accepted value conflicting', f => { f.ctx.accepted.curriculum = '2022'; }],
  ['current value absent', f => { delete f.current.curriculum; }],
  ['current value null', f => { f.current.curriculum = null; }],
  ['current value conflicting', f => { f.current.curriculum = '2022'; }],
  ['current duplicate alias', f => { f.current.curriculumKey = '2015'; }],
  ['current semester alias', f => { f.current.courseSemester = 'M2-2'; }],
  ['current matching grade alias', f => { f.current.gradeKey = 'M2'; }],
]) test(`v3 explicit native curriculum carry refuses ${label}`, async t => {
  const f = fixture(t, 'CC_REUSE', { scopeParentTransport: true, nativeCurriculumOwn: true,
    nativeCurriculumValue: '2015', reviewedCurriculumCarry: true });
  mutate(f);const { validateNativeProposalFinalization } = await adapter;
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /M2 finalized scope parent:/);
});

for (const [label, mutate] of [
  ['missing named carry proof', proof => { delete proof.nativeCurriculumCarry; }],
  ['native value digest', proof => { proof.nativeCurriculumCarry.nativeAfterSha256 = '0'.repeat(64); }],
  ['original source absence', proof => { proof.nativeCurriculumCarry.originalSources.reviewed.present = true; }],
  ['independent source authority', proof => { proof.nativeCurriculumCarry.independentSource.sha256 = '0'.repeat(64); }],
  ['current source value', proof => { proof.nativeCurriculumCarry.currentSource.sha256 = '0'.repeat(64); }],
]) test(`v3 explicit native curriculum carry replay refuses ${label}`, async t => {
  const f = fixture(t, 'CC_REUSE', { scopeParentTransport: true, nativeCurriculumOwn: true,
    nativeCurriculumValue: '2015', reviewedCurriculumCarry: true });
  const { validateNativeProposalFinalization } = await adapter, result = validateNativeProposalFinalization(f.ctx);
  f.ctx.metadata = { curriculum: null, courseKey: null, curriculumKey: '2015' };
  Object.assign(f.final, { curriculumKey: '2015', L1: '원 대단원', L2: '원 중단원' });
  f.ctx.issuedSourceReview = { proposalFinalization: clone(result.proof) };
  mutate(f.ctx.issuedSourceReview.proposalFinalization.scopeParentTransport);
  assert.throws(() => validateNativeProposalFinalization(f.ctx), /issued scope\/parent proof changed/);
});
