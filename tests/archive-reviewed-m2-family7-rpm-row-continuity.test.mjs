import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { readM2Family7RpmRowContinuity as read, M2_FAMILY7_RPM_ROW_SCHEMA as SCHEMA,
  M2_FAMILY7_RPM_ITEMS as ITEMS } from '../archive/tools/meta-foundation/reviewed-m2-family7-rpm-row-continuity.mjs';
import { validateNativeReviewedParent } from '../archive/tools/meta-foundation/reviewed-native-parent.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'b9f9dd4b30b668e3935f53a132a38e9eac35b363';
const NATIVE = 'c28641f67d91bfb27352b11faaef4552f46c45be';
const RPM = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json';
const MASTER = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const stable = x => JSON.stringify(x, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const blob = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const git = (root, args, input) => execFileSync('git', args, { cwd: root, input, maxBuffer: 2 * 1024 * 1024,
  stdio: ['pipe', 'pipe', 'pipe'], env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0',
    GIT_AUTHOR_NAME: 'Archive fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid',
    GIT_COMMITTER_NAME: 'Archive fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' } });
const raw = (commit, relative) => git(repo, ['show', `${commit}:${relative}`]);
const ref = (commit, relative, bytes) => ({ commit, path: relative, gitBlobSha1: blob(bytes), sha256: sha(bytes), bytes: bytes.length });
const historical = ref(NATIVE, RPM, raw(NATIVE, RPM)), currentBytes = raw(BASE, RPM), currentRef = ref(BASE, RPM, currentBytes);
function fixture(t, key = 'E017-Q06') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'family7-row-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, ['init', '-q']);
  const common = path.resolve(repo, git(repo, ['rev-parse', '--git-common-dir']).toString().trim());
  fs.writeFileSync(path.join(root, '.git/objects/info/alternates'), path.join(common, 'objects') + '\n');
  git(root, ['update-ref', 'HEAD', BASE]);
  const put = (relative, bytes) => { const p = path.join(root, relative); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, bytes); };
  put(RPM, currentBytes);
  const item = ITEMS.find(r => r.key === key), review = JSON.parse(raw(NATIVE, item.nativeReviewRef.path));
  put(item.nativeReviewRef.path, raw(NATIVE, item.nativeReviewRef.path));
  const row = review.items.find(r => r.questionUid === item.questionUid);
  const nativeSpec = { schemaVersion: 'archive-reviewed-source-reassessment-v1', reviewCommit: NATIVE,
    reviewPath: item.nativeReviewRef.path, reviewRef: { path: item.nativeReviewRef.path, sha256: item.nativeReviewRef.sha256 } };
  const evidence = [{ path: RPM, sha256: currentRef.sha256 }, nativeSpec.reviewRef];
  const spec = { schemaVersion: SCHEMA, historicalRef: structuredClone(historical), currentRef: structuredClone(currentRef),
    recordId: item.rpmRecordId, recordSha256: item.rpmRecordSha256 };
  const patch = { questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal, sourceReview: structuredClone(nativeSpec),
    targetParentRef: { nativeRpmRowContinuity: spec }, evidenceRefs: structuredClone(evidence) };
  if (item.role === 'NATIVE_FAMILY') patch.targetParentRef.nativeSourceReview = {
    schemaVersion: 'archive-native-reviewed-parent-v1', crosswalkProfile: 'ACTIVE_FAMILY_EXPLICIT_NATIVE_AFTER' };
  else Object.assign(patch.sourceReview, { retainedFields: { schemaVersion: 'archive-reviewed-native-retained-fields-v1' },
    retainedScopeTransport: { schemaVersion: 'archive-reviewed-retained-scope-transport-v1' } });
  const request = { sourceArchiveFile: item.sourceArchiveFile, expectedQuestionCount: item.expectedQuestionCount,
    scope: 'PARTIAL_UIDS', approval: { type: 'FINAL_QA', metadataReviewed: true, evidenceRefs: structuredClone(evidence) }, registryChanges: [] };
  const args = { root, request, patch, nativeSpec, nativeRow: structuredClone(row), cache: new Map() };
  const sealCurrent = (document, mode = '100644', { moveHead = true } = {}) => {
    const bytes = Buffer.from(JSON.stringify(document, null, 2) + '\n'); put(RPM, bytes);
    git(root, ['read-tree', '--empty']); const oid = git(root, ['hash-object', '-w', '--stdin'], bytes).toString().trim();
    git(root, ['update-index', '--add', '--cacheinfo', `${mode},${oid},${RPM}`]);
    const tree = git(root, ['write-tree']).toString().trim(), commit = git(root, ['commit-tree', tree], 'current RPM fixture\n').toString().trim();
    if (moveHead) git(root, ['update-ref', 'HEAD', commit]);
    spec.currentRef = ref(commit, RPM, bytes);
    for (const refs of [request.approval.evidenceRefs, patch.evidenceRefs]) refs.find(r => r.path === RPM).sha256 = sha(bytes);
    return commit;
  };
  return { root, item, row, review, args, spec, patch, request, nativeSpec, put, sealCurrent };
}
for (const item of ITEMS) test(`exact historical/current row joins only ${item.key}`, t => {
  const f = fixture(t, item.key), before = stable({ request: f.request, patch: f.patch, row: f.args.nativeRow });
  const proof = read(f.args).proof;
  assert.equal(proof.recordSha256, item.rpmRecordSha256);
  assert.equal(proof.selectedWholeRecordUnchanged, true); assert.equal(proof.historicalCurrentWholeFileEqual, false);
  assert.deepEqual(proof.transportedFields, []); assert.equal(proof.newParentApproval, false);
  assert.equal(stable({ request: f.request, patch: f.patch, row: f.args.nativeRow }), before);
});
test('absence leaves the original path unchanged', t => { const f = fixture(t); delete f.patch.targetParentRef.nativeRpmRowContinuity; assert.equal(read(f.args), null); });
for (const [name, mutate, code] of [
  ['own undefined', f => f.patch.targetParentRef.nativeRpmRowContinuity = undefined, 'EXPLICIT_CLOSED_OPTION'],
  ['own null', f => f.patch.targetParentRef.nativeRpmRowContinuity = null, 'EXPLICIT_CLOSED_OPTION'],
  ['foreign schema', f => f.spec.schemaVersion = 'future', 'EXPLICIT_CLOSED_OPTION'],
  ['extra option', f => f.spec.acceptChangedRow = true, 'EXPLICIT_CLOSED_OPTION'],
  ['outside UID', f => f.patch.questionUid = 'outside', 'EXACT_SEVEN_SCOPE'],
  ['wrong ordinal', f => f.patch.sourceOrdinal++, 'EXACT_SEVEN_SCOPE'],
  ['wrong bank', f => f.request.sourceArchiveFile += 'other', 'EXACT_SEVEN_SCOPE'],
  ['wrong denominator', f => f.request.expectedQuestionCount--, 'EXACT_SEVEN_SCOPE'],
  ['nonpartial', f => f.request.scope = 'FULL', 'EXACT_SEVEN_SCOPE'],
  ['new registry entry', f => f.request.registryChanges.push({}), 'EXACT_SEVEN_SCOPE'],
  ['HOLD option', f => f.patch.typeHold = null, 'EXACT_SEVEN_SCOPE'],
  ['source rebind mixing', f => f.request.approval.sourceRebind = {}, 'EXACT_SEVEN_SCOPE'],
  ['mixed original profiles', f => f.patch.sourceReview.retainedFields = {}, 'EXISTING_TYPED_PROFILE_REQUIRED'],
  ['wrong Native commit', f => f.args.nativeSpec.reviewCommit = BASE, 'ORIGINAL_NATIVE_BINDING'],
  ['changed Native item', f => f.args.nativeRow.rpmDecision = 'UNRESOLVED', 'ORIGINAL_NATIVE_BINDING'],
  ['historical current reseal', f => f.spec.historicalRef = structuredClone(f.spec.currentRef), 'ORIGINAL_NATIVE_BINDING'],
  ['historical hash', f => f.spec.historicalRef.sha256 = '0'.repeat(64), 'ORIGINAL_NATIVE_BINDING'],
  ['wrong RPM record', f => f.spec.recordId = 'M2-RPM-999', 'ORIGINAL_NATIVE_BINDING'],
  ['current raw hash', f => f.spec.currentRef.sha256 = '0'.repeat(64), 'RAW_DIGEST'],
  ['current symlink path', f => { const p = path.join(f.root, RPM); fs.renameSync(p, p + '.raw'); fs.symlinkSync(p + '.raw', p); }, 'SYMLINK_PATH'],
  ['dirty live RPM', f => fs.appendFileSync(path.join(f.root, RPM), '\n'), 'LIVE_RPM_DRIFT'],
  ['approval current binding absent', f => f.request.approval.evidenceRefs = [], 'CURRENT_EVIDENCE_BINDING'],
  ['duplicate current binding', f => f.patch.evidenceRefs.push(structuredClone(f.patch.evidenceRefs[0])), 'CURRENT_EVIDENCE_BINDING'],
]) test(`closed row transport rejects ${name}`, t => { const f = fixture(t); mutate(f); assert.throws(() => read(f.args), new RegExp(code)); });
test('unrelated RPM row changes retain the exact selected row', t => {
  const f = fixture(t), current = JSON.parse(currentBytes); current.records.push({ id: 'UNSELECTED_SYNTHETIC' }); f.sealCurrent(current);
  assert.equal(read(f.args).proof.selectedWholeRecordUnchanged, true);
});
for (const [name, mutate] of [
  ['mapping', r => r.mappingStatus = 'DIRECT_ACTIVE'], ['binding', r => r.bindingStatus = 'MISSING'],
  ['scope', r => r.scope = 'M2-1'], ['primary', r => r.problemTypeKey = 'PT_OTHER'],
  ['template candidates', r => r.templateCandidates = []], ['extra field', r => r.newAuthority = true],
]) test(`resealed current selected ${name} is rejected`, t => {
  const f = fixture(t), current = JSON.parse(currentBytes), row = current.records.find(r => r.id === f.item.rpmRecordId);
  mutate(row); f.sealCurrent(current); assert.throws(() => read(f.args), /SELECTED_WHOLE_RPM_ROW_DRIFT/);
});
test('duplicate selected current RPM row is not accepted', t => {
  const f = fixture(t), current = JSON.parse(currentBytes); current.records.push(structuredClone(current.records.find(r => r.id === f.item.rpmRecordId)));
  f.sealCurrent(current); assert.throws(() => read(f.args), /SELECTED_WHOLE_RPM_ROW_DRIFT/);
});
for (const mode of ['100755', '120000']) test(`current immutable mode ${mode} is rejected`, t => {
  const f = fixture(t); f.sealCurrent(JSON.parse(currentBytes), mode); assert.throws(() => read(f.args), /GIT_MODE/);
});
test('live evidence alone cannot substitute a different current HEAD', t => {
  const f = fixture(t), current = JSON.parse(currentBytes); current.records.push({ id: 'NOT_CURRENT_HEAD' });
  f.sealCurrent(current, '100644', { moveHead: false }); assert.throws(() => read(f.args), /CURRENT_HEAD_RPM_DRIFT/);
});
function parentArgs(f) {
  const after = structuredClone(f.row.after), rpm = after.rpmPrimaryPath;
  Object.assign(after, { questionUid: f.item.questionUid, sourceOrdinal: f.item.sourceOrdinal, courseKey: 'M2-2', L1: rpm.majorUnit, L2: rpm.midUnit });
  f.patch.after = structuredClone(after);
  const bytes = raw(BASE, MASTER); f.put(MASTER, bytes); const master = { path: MASTER, sha256: sha(bytes) };
  f.patch.evidenceRefs.push(master); f.request.approval.evidenceRefs.push(master);
  Object.assign(f.patch.targetParentRef, { ...master, curriculum: '2015', scope: 'M2-2', majorUnit: rpm.majorUnit, midUnit: rpm.midUnit });
  Object.assign(f.patch.targetParentRef.nativeSourceReview, { questionUid: f.item.questionUid, sourceOrdinal: f.item.sourceOrdinal,
    reviewCommit: NATIVE, reviewPath: f.nativeSpec.reviewPath, reviewRef: f.nativeSpec.reviewRef,
    crosswalkRef: { path: RPM, sha256: f.spec.currentRef.sha256, recordId: f.item.rpmRecordId } });
  const current = JSON.parse(currentBytes).records.find(r => r.id === f.item.rpmRecordId);
  Object.assign(after, { standardCourse: '중2 수학', standardUnitKey: current.standardUnitKey, subUnitKey: current.subUnitKey });
  const binding = { curriculum: '2015', standardCourse: after.standardCourse, standardUnitKey: after.standardUnitKey,
    subUnitKey: after.subUnitKey, problemTypeKey: after.problemTypeKey, status: 'ACTIVE', ownerPack: 'MIDDLE_GEOMETRY' };
  const resolved = { binding, pt: { problemTypeKey: after.problemTypeKey, status: 'ACTIVE', ownerPack: 'MIDDLE_GEOMETRY' },
    tpl: { templateKey: after.templateKey, parentProblemTypeKey: after.problemTypeKey, status: 'ACTIVE', ownerPack: 'MIDDLE_GEOMETRY' },
    pack: { meta: { canonicalStatus: 'ACTIVE', packId: 'MIDDLE_GEOMETRY', curricula: ['2015'], standardCourses: ['중2 수학', 'M2-2'] } }, curriculum: '2015', course: '중2 수학' };
  const sourceReview = { ...f.nativeSpec, nativeSchemaVersion: 'm2-s2-meta-review-v1', scope: 'METADATA_SOURCE_BINDING_ONLY',
    newMathematicalQa: false, questionUid: f.item.questionUid, sourceOrdinal: f.item.sourceOrdinal,
    rpmBindings: { rpmPrimaryPath: { origin: 'NATIVE_AFTER', valueSha256: sha(stable(rpm)) } } };
  return { root: f.root, request: f.request, patch: f.patch, row: after, resolved, sourceReview };
}
test('parent subvalidator retains exact current ACTIVE tuple checks after the row transport', t => {
  const f = fixture(t), args = parentArgs(f); const proof = validateNativeReviewedParent(args);
  assert.equal(proof.rpmRowContinuity.recordSha256, f.item.rpmRecordSha256); assert.equal(proof.newMathematicalQa, false);
  args.resolved.binding.status = 'HOLD'; assert.throws(() => validateNativeReviewedParent(args), /current ACTIVE binding/);
});
test('without explicit row transport the old whole-file parent guard still rejects drift', t => {
  const f = fixture(t), args = parentArgs(f); delete f.patch.targetParentRef.nativeRpmRowContinuity;
  assert.throws(() => validateNativeReviewedParent(args), /native family crosswalk differs/);
});
