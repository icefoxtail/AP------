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

function fixture(t, kind, { omittedPrimary = false, textOnly = false, compositeParent = false, absentMatch = false, globalParent = false, nativeBindingOverride, missingBindingReview = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'native-proposal-v3-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...a) => execFileSync('git', a, { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] }).toString().trim();
  git('init', '-q');git('config', 'user.name', 'Synthetic Test');git('config', 'user.email', 'test@example.invalid');
  const put = (p, x) => { const file = path.join(root, p);fs.mkdirSync(path.dirname(file), { recursive: true });fs.writeFileSync(file, typeof x === 'string' ? x : JSON.stringify(x, null, 2) + '\n');return { path: p, sha256: sha(fs.readFileSync(file)) }; };
  const source = 'archive/exams/original/test.js', reviewPath = 'docs/native.json', rpmPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
  const original = { content: '주어진 도형을 판정한다.', choices: ['가', '나'], answer: '가', solution: '검토된 풀이.', standardCourse: '중2 수학', standardUnitKey: 'M2-05', subUnitKey: 'M2-05-TRIANGLE_PROPERTIES', problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' };
  const assetPath = 'archive/assets/test.svg', asset = '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>';
  if (!textOnly) { original.image = 'assets/test.svg';put(assetPath, asset); }
  put(source, 'window.questionBank = ' + JSON.stringify([original]) + ';\n');
  const rpm = { id: 'M2-RPM-001', curriculum: '2015', scope: 'M2-2', standardUnitKey: 'M2-05', subUnitKey: original.subUnitKey, ownerPack: 'MIDDLE_GEOMETRY', rpmPath: { l3: '검토된 분류' } };
  const rpmRef = put(rpmPath, { records: [rpm] });
  const pt = { problemTypeKey: 'PT_OLD', canonicalLabelKo: '기존 주유형', definition: '기존 정의', ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const tpl = { templateKey: 'TPL_OLD', parentProblemTypeKey: 'PT_OLD', canonicalLabelKo: '기존 절차', definition: '기존 절차 정의', ownerPack: 'MIDDLE_GEOMETRY', status: 'ACTIVE', supportingQuestionUids: ['uid1'], supportingItemCount: 1 };
  const after = { problemTypeKey: 'PT_OLD', templateKey: 'TPL_OLD', crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE' };
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
  const nativeRef = put(reviewPath, nativeReview);git('add', '.');git('commit', '-qm', 'synthetic immutable native review');
  const nativeCommit = git('rev-parse', 'HEAD');
  const ref = { commit: nativeCommit, ...nativeRef }, snapshot = { commit: nativeCommit, sourcePath: source, blob: git('rev-parse', nativeCommit + ':' + source), sha256: sha(fs.readFileSync(path.join(root, source))), questionSha256: sha(stable(original)) };
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
  const witness = { schemaVersion: 'archive-independent-m2-native-definition-finalization-v1', decision: 'APPROVE_EXACT_NEW_DEFINITIONS_AND_REUSE_APPLICATIONS', reviewer: 'independent-reviewer', currentMainChecked: nativeCommit, newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, existingDefinitionsModified: 0, sourceWrites: 0, canonicalWrites: 0, officialCompilerResolverConsumerStillRequired: true, actualMainRegistrationClaimed: false, approvedRegistryChanges: changes, rows: [row] };
  const app = { examId: row.examId, sourceOrdinal: 1, questionUid: 'uid1', sourcePath: source, nativeReviewRef: ref, nativeItemStableSha256: row.nativeItemStableSha256, sourceSnapshot: snapshot, rendererAssets: assets, reviewedPrimaryContext: context, reviewer: witness.reviewer, reason: row.independentRationale, proposalSelections: [selection], decisions: [choice], newMathematicalQa: false, newMetadataApproval: false, difficultyChanged: false, nativeProtectedStudentFieldsChanges: [] };
  const proof = { schemaVersion: 'archive-independent-m2-native-proposal-disposition-v1', status: 'NARROW_PROPOSALS_FINALIZED_REGISTRATION_PENDING', scope: { newFullMathematicalQa: false, newReview2Claims: 0, newMetadataApprovals: 0, newDifficultyJudgments: 0, newSourceContentEdits: 0 }, applications: [app] };
  const current = { ...clone(original), ...context, ...(['PT', 'TPL'].includes(kind) ? {} : { crossConceptKeys: ['CC_FINAL'] }) };
  const final = { ...current, curriculum: '2015' };
  const before = { pt: new Map([['PT_OLD', pt]]), tpl: new Map([['TPL_OLD', tpl]]), cc: new Map(kind === 'CC_REUSE' ? [['CC_FINAL', concept]] : []), bindings: new Map() };
  const bindingKey = stable(['2015', context.standardCourse, context.standardUnitKey, context.subUnitKey, context.problemTypeKey]);
  if (kind !== 'PT') before.bindings.set(bindingKey, binding);
  const compiled = { pt: new Map(before.pt), tpl: new Map(before.tpl), cc: new Map(before.cc), bindings: new Map(before.bindings) };
  if (kind === 'PT') compiled.pt.set('PT_FINAL', parent);
  if (['PT', 'TPL'].includes(kind)) compiled.tpl.set('TPL_FINAL', template);else compiled.cc.set('CC_FINAL', concept);
  compiled.bindings.set(bindingKey, binding);
  const item = { questionUid: 'uid1', sourceOrdinal: 1, after: clone(final), sourceReview: {}, evidenceRefs: [] };
  const request = { sourceArchiveFile: 'original/test.js', expectedQuestionCount: 1, approval: { evidenceRefs: [] }, registryChanges: [] };
  const ctx = { root, request, patch: item, row: nativeItem, accepted: clone(after), question: current, final, native: { spec: { reviewCommit: nativeCommit, reviewPath, reviewRef: nativeRef }, review: nativeReview, reviewer: 'native-author', committedBank: [clone(original)], reviewedBank: [clone(original)] }, canonicalBefore: before, canonicalAfter: compiled, cache: new Map(), studentPayload: q => Object.fromEntries(['content', 'choices', 'answer', 'solution', 'image'].map(k => [k, q[k] ?? null])), bankFromBytes: bytes => { const c = { window: {} };vm.runInNewContext(bytes.toString(), c);return JSON.parse(JSON.stringify(c.window.questionBank)); } };
  const update = () => {
    const witnessRef = put('docs/independent.json', witness);app.independentReviewRef = witnessRef;
    const proofRef = put('docs/disposition.json', proof);request.approval.evidenceRefs = item.evidenceRefs = [witnessRef, proofRef];
    request.registryChanges = changes.map(c => ({ ...clone(c), evidenceRefs: [witnessRef, proofRef] }));git('add', '.');git('commit', '--allow-empty', '-qm', 'synthetic finalization');
    item.sourceReview.proposalFinalization = { schemaVersion: 'archive-native-proposal-finalization-v3', finalizationCommit: git('rev-parse', 'HEAD'), finalizationRef: proofRef, proposalSelections: [selection] };ctx.cache = new Map();
  };
  update();return { root, ctx, update, proof, witness, row, app, choice, changes, nativeItem, proposal, put, git, original, current, final, before, compiled, assetPath };
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
