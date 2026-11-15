// An opt-in bridge between an immutable M2 CC application and a separately
// reviewed current renderer. It supplies no semantic, difficulty or definition
// values. The caller must still run the original proposal finalizer unchanged.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const fail = message => { throw Error(`M2 CC renderer continuity: ${message}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const text = value => typeof value === 'string' && value.trim();
const SCHEMA = 'archive-reviewed-m2-cc-renderer-continuity-v1';
const EVIDENCE_SCHEMA = 'archive-m2-cc-current-renderer-continuity-evidence-v1';
const SCOPE = 'IMMUTABLE_M2_CC_FINALIZATION_WITH_CURRENT_RENDERER_ONLY';
const TRANSPORT = ['courseKey', 'crossConceptKeys', 'curriculumKey'];
const RENDERER = new Set(['image', 'imageAlt', 'imageSize', 'layoutTag',
  'solutionImage', 'solutionImageAlt', 'solutionImageCaption']);
const WITNESS_FIELDS = ['id', 'number', 'questionType', 'content', 'question', 'choices', 'answer', 'solution',
  'image', 'images', 'figureSvg', 'svg', 'solutionImage', 'solutionImages', 'solutionFigureSvg'];
const CURSOR_FIELDS = [...WITNESS_FIELDS, 'sourceQuestionNo', 'sourceQid', 'sourceOrdinal', 'questionUid',
  'layoutTag', 'wide', 'imageAlt', 'imageSize', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize', 'score'];
const payload = (q, fields = CURSOR_FIELDS) => Object.fromEntries(fields.map(k => [k, q?.[k] ?? null]));
const changes = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => !equal(a[k], b[k])).sort();

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence path');
  return full;
}
function git(ctx, ...args) {
  try { return execFileSync('git', args, {cwd:ctx.root, maxBuffer:16 * 1024 * 1024, stdio:['ignore', 'pipe', 'pipe']}); }
  catch { fail('immutable Git object unavailable'); }
}
function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || '')) fail('exact immutable commit required');
  const key = `m2-cc-renderer-git:${commit}:${relative}`;
  if (!ctx.cache.has(key)) {
    if (git(ctx, 'rev-parse', '--verify', `${commit}^{commit}`).toString().trim() !== commit) fail('exact immutable commit required');
    const entry = git(ctx, 'ls-tree', '-z', commit, '--', relative).toString().split('\0').filter(Boolean);
    if (entry.length !== 1 || !entry[0].startsWith('100644 blob ') || entry[0].split('\t')[1] !== relative)
      fail('regular immutable file required');
    const blob = entry[0].split('\t')[0].split(' ')[2], bytes = git(ctx, 'cat-file', 'blob', blob);
    ctx.cache.set(key, {blob, bytes, sha256:sha(bytes)});
  }
  return ctx.cache.get(key);
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid JSON evidence'); } }
function boundDocument(ctx, ref, commit) {
  if (!ref || Object.keys(ref).some(k => !['path', 'sha256'].includes(k)) || !SHA256.test(ref.sha256 || ''))
    fail('SHA-bound evidence required');
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!refs?.some(r => equal(r, ref))) fail('evidence must bind approval and item');
  const raw = fs.readFileSync(safePath(ctx.root, ref.path)), file = gitFile(ctx, commit, ref.path);
  if (sha(raw) !== ref.sha256 || file.sha256 !== ref.sha256) fail('local or immutable evidence drift');
  return parse(file.bytes);
}
function snapshot(ctx, ref) {
  if (!ref || ref.path !== `archive/exams/${ctx.request.sourceArchiveFile}` || !SHA1.test(ref.gitBlobSha1 || '') ||
      !SHA256.test(ref.sha256 || '')) fail('exact source snapshot required');
  const file = gitFile(ctx, ref.commit, ref.path), bank = ctx.bankFromBytes(file.bytes);
  if (file.blob !== ref.gitBlobSha1 || file.sha256 !== ref.sha256 || bank.length !== ctx.request.expectedQuestionCount)
    fail('source snapshot Git/blob/denominator mismatch');
  return {file, bank};
}
function inventory(rows, count) {
  if (!Array.isArray(rows) || !rows.length) fail('selected inventory required');
  const uids = new Set(), ordinals = new Set();
  return rows.map(r => {
    if (!text(r.questionUid) || !Number.isInteger(r.sourceOrdinal) || r.sourceOrdinal < 1 || r.sourceOrdinal > count ||
        uids.has(r.questionUid) || ordinals.has(r.sourceOrdinal)) fail('duplicate or invalid UID/ordinal');
    uids.add(r.questionUid); ordinals.add(r.sourceOrdinal);
    return {questionUid:r.questionUid, sourceOrdinal:r.sourceOrdinal};
  }).sort((a, b) => a.sourceOrdinal - b.sourceOrdinal);
}
function assetPaths(ctx, question) {
  const refs = new Set();
  const add = value => {
    if (typeof value !== 'string' || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value))
      fail('unsupported renderer asset reference');
    const p = value.startsWith('archive/') ? value : `archive/${value}`;
    safePath(ctx.root, p); refs.add(p);
  };
  const walk = value => {
    if (value === undefined || value === null || value === '') return;
    if (typeof value === 'string') { add(value); return; }
    if (Array.isArray(value)) { value.forEach(walk); return; }
    fail('unsupported renderer asset shape');
  };
  for (const k of ['image', 'images', 'solutionImage', 'solutionImages']) walk(question[k]);
  if (question.svg || question.figureSvg || question.solutionFigureSvg) fail('inline SVG outside the typed M2 contract');
  const html = value => {
    if (typeof value === 'string') {
      for (const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!m[1].startsWith('#')) add(m[1]);
      if (/url\s*\(/i.test(value)) fail('unsupported inline renderer URL');
    } else if (Array.isArray(value)) value.forEach(html);
    else if (value && typeof value === 'object') Object.values(value).forEach(html);
  };
  html(payload(question)); return [...refs].sort();
}
function assets(ctx, rows, question, commit, role) {
  const selected = rows.filter(r => r.role === role);
  if (new Set(selected.map(r => r.path)).size !== selected.length ||
      !equal(selected.map(r => r.path).sort(), assetPaths(ctx, question))) fail('asset inventory incomplete or excessive');
  return selected.map(r => {
    if (!r.path.startsWith('archive/assets/') || !SHA1.test(r.gitBlob || '') || !SHA256.test(r.sha256 || '') ||
        !SHA256.test(r.renderedSha256 || '')) fail('asset witness digest required');
    const file = gitFile(ctx, commit, r.path);
    if (file.blob !== r.gitBlob || file.sha256 !== r.sha256 || sha(fs.readFileSync(safePath(ctx.root, r.path))) !== r.sha256)
      fail('renderer Git or current asset bytes changed');
    if (/\.svg$/i.test(r.path)) {
      const svg = file.bytes.toString('utf8'), deps = [
        ...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]),
        ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m => m[1])];
      if (deps.some(p => !p.startsWith('#') && !/^data:image\/[a-z0-9.+-]+;base64,/i.test(p)))
        fail('nested SVG dependency outside the reviewed inventory');
    }
    return {path:r.path, gitBlob:r.gitBlob, sha256:r.sha256};
  }).sort((a, b) => a.path.localeCompare(b.path));
}

export function validateReviewedM2CcRendererContinuity(ctx) {
  const {request, patch, native, row, question, studentPayload} = ctx, spec = patch.sourceReview?.m2CcRendererProof;
  if (spec === undefined) return null;
  if (spec?.schemaVersion !== SCHEMA || request.scope !== 'PARTIAL_UIDS' || request.approval?.type !== 'FINAL_QA' ||
      request.approval.metadataReviewed !== true || request.registrationMode !== undefined || request.approval.sourceRebind ||
      patch.rebind !== undefined || patch.sourceReview.rendererProof !== undefined ||
      patch.sourceReview.proposalFinalization?.schemaVersion !== 'archive-native-proposal-finalization-v1' ||
      native.review.schemaVersion !== 'm2-s2-meta-review-v1' || native.review.reviewScope !== undefined ||
      row.questionUid !== patch.questionUid || !Object.hasOwn(patch.after, 'sourceFingerprint'))
    fail('exclusive M2 CC finalization plus renderer scope required');
  const doc = boundDocument(ctx, spec.reviewRef, spec.reviewCommit), count = request.expectedQuestionCount;
  if (doc.schemaVersion !== EVIDENCE_SCHEMA || doc.scope !== SCOPE || doc.sourceArchiveFile !== request.sourceArchiveFile ||
      doc.expectedQuestionCount !== count || doc.newMathematicalQa !== false || doc.newMetadataApprovals !== 0 ||
      doc.newDifficultyJudgments !== 0 || doc.originalAuthorityUnchanged !== true ||
      !equal(doc.nativeReviewRef, {commit:native.spec.reviewCommit, path:native.spec.reviewPath, sha256:native.spec.reviewRef.sha256}))
    fail('immutable original authority binding mismatch');
  const selected = inventory(request.items, count);
  if (!equal(inventory(doc.selectedItems, count), selected)) fail('composition selected inventory mismatch');
  const oldRef = doc.originalRequestRef;
  if (!oldRef || !/^\.archive-meta-register\/inbox\/[A-Za-z0-9][A-Za-z0-9_-]{0,100}\.json$/.test(oldRef.path || '') ||
      !SHA256.test(oldRef.sha256 || '')) fail('exact original request reference required');
  const originalFile = gitFile(ctx, oldRef.commit, oldRef.path), original = parse(originalFile.bytes);
  if (originalFile.sha256 !== oldRef.sha256 || original.scope !== 'PARTIAL_UIDS' || original.approval?.type !== 'FINAL_QA' ||
      original.approval.metadataReviewed !== true || original.registrationMode !== undefined || original.approval.sourceRebind ||
      original.sourceArchiveFile !== request.sourceArchiveFile || original.expectedQuestionCount !== count ||
      !equal(inventory(original.items, count), selected) || !equal(original.registryChanges || [], request.registryChanges || []))
    fail('original accepted request or definition/support changed');
  const old = original.items.find(r => r.questionUid === patch.questionUid), originalSpec = {...patch.sourceReview};
  delete originalSpec.m2CcRendererProof;
  const semantic = after => Object.fromEntries(Object.entries(after || {}).filter(([k]) => !['sourceFingerprint', 'contentFingerprint'].includes(k)));
  if (!equal(old.sourceReview, originalSpec) || !equal(semantic(old.after), semantic(patch.after)) || old.rebind !== undefined)
    fail('current request changes original native/finalization or after values');
  const originalSource = snapshot(ctx, doc.originalAcceptedSourceRef), currentSource = snapshot(ctx, doc.currentSourceRef);
  if (doc.originalAcceptedSourceRef.commit !== oldRef.commit || original.expectedSourceBlobSha1 !== originalSource.file.blob)
    fail('original accepted source differs from the original request');
  const ordinal = patch.sourceOrdinal, originalQuestion = originalSource.bank[ordinal - 1], currentQuestion = currentSource.bank[ordinal - 1];
  if (!equal(studentPayload(originalQuestion), studentPayload(native.reviewedBank[ordinal - 1])) ||
      !equal(studentPayload(originalQuestion), studentPayload(native.committedBank[ordinal - 1])))
    fail('original accepted carrier differs from native student evidence');
  const expected = {...currentQuestion};
  for (const k of TRANSPORT) {
    if (!Object.hasOwn(originalQuestion, k) || !Object.hasOwn(old.after, k) || !equal(originalQuestion[k], old.after[k]))
      fail('original metadata transport field lacks exact accepted value');
    expected[k] = originalQuestion[k];
  }
  if (!equal(question, expected)) fail('live question differs from exact current renderer plus original metadata');
  const delta = changes(originalQuestion, currentQuestion).filter(k => !TRANSPORT.includes(k));
  if (!delta.length || delta.some(k => !RENDERER.has(k))) fail('non-renderer student or metadata change');
  const independent = boundDocument(ctx, doc.independentReviewRef, spec.reviewCommit);
  if (independent.schemaVersion !== 'root-independent-existing-native-renderer-review-v1' ||
      independent.status !== 'PASS_SELECTED_TWO_CURRENT_RENDERER_ONLY' || !text(independent.reviewer) || independent.reviewer === native.reviewer ||
      independent.currentSourceCommit !== doc.currentSourceRef.commit || independent.sourcePath !== doc.currentSourceRef.path ||
      independent.currentSourceGitBlob !== currentSource.file.blob || independent.originalAcceptedPacket !== oldRef.commit ||
      independent.newMathematicalQa !== false || independent.newDifficultyJudgment !== false || independent.newDefinitionApproval !== false ||
      independent.originalNativeDefinitionAndApplicationAuthorityReusedOnly !== true ||
      independent.reviewedUidCount !== selected.length || !equal(inventory(independent.items, count), selected))
    fail('independent current-renderer review scope mismatch');
  const reviewed = independent.items.find(r => r.questionUid === patch.questionUid);
  if (reviewed.verdict !== 'PASS_CURRENT_RENDERER_CONTINUITY_ONLY' ||
      reviewed.originalAcceptedWholeQuestionSha256 !== sha(stable(originalQuestion)) ||
      reviewed.currentWholeQuestionSha256 !== sha(stable(currentQuestion)) ||
      reviewed.originalAcceptedStudentPayloadSha256 !== sha(stable(payload(originalQuestion, WITNESS_FIELDS))) ||
      reviewed.currentStudentPayloadSha256 !== sha(stable(payload(currentQuestion, WITNESS_FIELDS))) ||
      !equal(reviewed.changedRendererFields, delta) || !equal(reviewed.originalMetadataTransportFields, TRANSPORT) ||
      !Array.isArray(reviewed.assets) || reviewed.assets.some(a => !['ORIGINAL_ACCEPTED', 'CURRENT_UNREVIEWED'].includes(a.role)))
    fail('independent selected question/renderer binding mismatch');
  const originalAssets = assets(ctx, reviewed.assets, originalQuestion, oldRef.commit, 'ORIGINAL_ACCEPTED');
  const currentAssets = assets(ctx, reviewed.assets, currentQuestion, doc.currentSourceRef.commit, 'CURRENT_UNREVIEWED');
  if (independent.reviewedAssets !== independent.items.reduce((n, r) => n + (r.assets?.length || 0), 0))
    fail('independent asset denominator mismatch');
  return {originalQuestion, proof:{schemaVersion:SCHEMA, scope:SCOPE,
    reviewCommit:spec.reviewCommit, reviewRef:spec.reviewRef, independentReviewRef:doc.independentReviewRef,
    independentReviewer:independent.reviewer, originalRequestRef:oldRef,
    originalAcceptedSourceRef:doc.originalAcceptedSourceRef, currentSourceRef:doc.currentSourceRef,
    questionUid:patch.questionUid, sourceOrdinal:ordinal, changedRendererFields:delta, metadataTransportFields:TRANSPORT,
    originalAssets, currentAssets, originalAcceptedQuestionSha256:sha(stable(originalQuestion)),
    currentRendererQuestionSha256:sha(stable(currentQuestion)), currentCandidateQuestionSha256:sha(stable(question)),
    originalStudentPayloadSha256:sha(stable(payload(originalQuestion))), currentStudentPayloadSha256:sha(stable(payload(question))),
    newMathematicalQa:false, newMetadataApprovals:0, newDifficultyJudgments:0}};
}

// The official source-binding verifier has already reproduced both gates from
// its immutable request snapshot. Only then may this typed receipt explain an
// old pending student cursor. Other receipts retain their existing behavior.
export function nativeReviewedM2CcRendererRebind({receipt, previous, question, identity, ordinal, verifiedSource}) {
  const selected = (receipt.fingerprintRepairs || []).filter(r => r.questionUid === identity.questionUid);
  const typed = selected.filter(r => r.sourceReview?.m2CcRendererContinuity !== undefined);
  if (!typed.length) return null;
  if (verifiedSource !== true || selected.length !== 1 || typed.length !== 1 || receipt.scope !== 'PARTIAL_UIDS' ||
      receipt.approval?.type !== 'FINAL_QA' || receipt.registrationMode !== undefined || receipt.approval.sourceRebind)
    fail('verified original/current source gates required for the cursor');
  const repair = typed[0], proof = repair.sourceReview, renderer = proof.m2CcRendererContinuity;
  if (repair.sourceOrdinal !== ordinal || proof.nativeSchemaVersion !== 'm2-s2-meta-review-v1' ||
      renderer.schemaVersion !== SCHEMA || renderer.scope !== SCOPE || renderer.questionUid !== identity.questionUid ||
      renderer.sourceOrdinal !== ordinal || renderer.newMathematicalQa !== false || renderer.newMetadataApprovals !== 0 ||
      renderer.newDifficultyJudgments !== 0 || !proof.proposalFinalization ||
      renderer.originalFinalizationSha256 !== sha(stable(proof.proposalFinalization)) ||
      renderer.currentCandidateQuestionSha256 !== sha(stable(question)) ||
      renderer.currentStudentPayloadSha256 !== sha(stable(payload(question))) ||
      ![renderer.originalStudentPayloadSha256, renderer.currentStudentPayloadSha256].includes(sha(stable(payload(previous)))))
    fail('previous cursor is not the exact original or current student payload');
  return true;
}
