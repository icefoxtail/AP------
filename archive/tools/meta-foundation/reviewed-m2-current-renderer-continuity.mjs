// A separate M2 presentation transport contract. It supplies no metadata values.
// The earlier frozen request and its exact source object remain the semantic
// authority input; the ordinary native finalization/retention validators must
// still accept that input. M3 renderer contracts are intentionally unchanged.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const M2_RENDERER_SCHEMA = 'archive-reviewed-m2-current-renderer-continuity-v1';
export const M2_RENDERER_REVIEW_SCHEMA = 'archive-independent-m2-current-renderer-review-v1';
export const M2_RENDERER_REFRESH_SCHEMA = 'archive-reviewed-m2-current-renderer-refresh-v1';
export const M2_RENDERER_REFRESH_REVIEW_SCHEMA = 'archive-m2-current-renderer-refresh-v1';
export const M2_RENDERER_FIELDS = Object.freeze(['image', 'imageAlt', 'imageSize', 'layoutTag']);
const SCOPE = 'M2_EXISTING_METADATA_WITH_INDEPENDENT_CURRENT_RENDERER';
const REFRESH_SCOPE = 'M2_EXISTING_METADATA_WITH_CURRENT_RENDERER_REFRESH';
const WITNESS_PATH = /^\.archive-meta-register\/evidence\/m2-current-renderer-[A-Za-z0-9_-]+\/independent-review\.json$/;
const REFRESH_PATH = /^\.archive-meta-register\/evidence\/m2-current-renderer-refresh-[A-Za-z0-9_-]+\/transport\.json$/;
const immutableClaimInventories = new Map();
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const fail = message => { throw Error(`M2 renderer continuity: ${message}`); };
const text = value => typeof value === 'string' && value.trim().length > 0;
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const same = (a, b) => stable(a) === stable(b);
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const clone = value => JSON.parse(stable(value));
const exactKeys = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) &&
  same(Object.keys(value).sort(), [...keys].sort());
const without = (value, keys) => Object.fromEntries(Object.entries(value).filter(([k]) => !keys.includes(k)));
const delta = (before, after) => Object.fromEntries([...new Set([...Object.keys(before), ...Object.keys(after)])]
  .filter(k => !same(before[k], after[k])).sort().map(k => [k, {
    before: { present: Object.hasOwn(before, k), value: before[k] ?? null },
    after: { present: Object.hasOwn(after, k), value: after[k] ?? null },
  }]));

function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe path');
  const full = path.resolve(root, relative), resolvedRoot = path.resolve(root);
  for (let p = full; p !== resolvedRoot; p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink input');
  return full;
}

function gitFile(ctx, commit, relative) {
  safe(ctx.root, relative);
  if (!SHA1.test(commit || '')) fail('immutable commit required');
  // Cache immutable Git bytes only. Live source, evidence and assets are read
  // again on each invocation, including an issued receipt's runtime replay.
  const key = stable(['m2-renderer-git', ctx.root, commit, relative]);
  if (!ctx.cache.has(key)) {
    const git = args => {
      try { return execFileSync('git', args, { cwd: ctx.root, maxBuffer: 32 * 1024 * 1024,
        stdio: ['ignore', 'pipe', 'pipe'] }); }
      catch { fail('immutable Git object unavailable'); }
    };
    if (git(['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit) fail('exact commit required');
    const gitBlobSha1 = git(['rev-parse', `${commit}:${relative}`]).toString().trim();
    const bytes = git(['cat-file', 'blob', gitBlobSha1]);
    ctx.cache.set(key, { commit, path: relative, gitBlobSha1, sha256: sha(bytes), bytes });
  }
  return ctx.cache.get(key);
}

function boundLive(ctx, ref) {
  if (!exactKeys(ref, ['path', 'sha256']) || !SHA256.test(ref.sha256)) fail('exact SHA-bound evidence ref required');
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!Array.isArray(refs) || refs.filter(r => same(r, ref)).length !== 1) fail('evidence must bind approval and selected item');
  const full = safe(ctx.root, ref.path);
  if (!fs.existsSync(full)) fail('bound live evidence missing');
  const bytes = fs.readFileSync(full);
  if (sha(bytes) !== ref.sha256) fail('bound live evidence changed');
  return bytes;
}

function document(ctx, ref, commit, gitPath = ref.path) {
  const live = boundLive(ctx, ref), immutable = gitFile(ctx, commit, gitPath);
  if (!live.equals(immutable.bytes)) fail('live evidence differs from immutable Git bytes');
  try { return JSON.parse(live); } catch { fail('invalid evidence JSON'); }
}

function snapshot(ctx, ref) {
  if (!exactKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'questionSha256']) ||
      ref.path !== `archive/exams/${ctx.request.sourceArchiveFile}` || !SHA1.test(ref.gitBlobSha1) ||
      !SHA256.test(ref.sha256) || !SHA256.test(ref.questionSha256)) fail('exact source snapshot required');
  const file = gitFile(ctx, ref.commit, ref.path), bank = ctx.bankFromBytes(file.bytes), question = bank[ctx.patch.sourceOrdinal - 1];
  if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256 ||
      bank.length !== ctx.request.expectedQuestionCount || !question || sha(stable(question)) !== ref.questionSha256)
    fail('source snapshot digest or denominator mismatch');
  return { ref, file, question, bank };
}

function assetPath(ctx, value) {
  if (typeof value !== 'string' || !/^(?:archive\/)?assets\//.test(value) || /[?#%\s\x00-\x1f]/.test(value))
    fail('scalar local asset path required');
  const relative = value.startsWith('archive/') ? value : `archive/${value}`;
  safe(ctx.root, relative);return relative;
}

function references(ctx, question) {
  const result = new Set(), add = value => result.add(assetPath(ctx, value));
  const direct = value => {
    if (value === undefined || value === null || value === '') return;
    if (typeof value === 'string') { add(value); return; }
    if (Array.isArray(value)) { value.forEach(direct); return; }
    fail('unsupported asset shape');
  };
  for (const key of ['image', 'images', 'solutionImage', 'solutionImages']) direct(question[key]);
  if (question.figureSvg || question.solutionFigureSvg) fail('inline SVG outside this contract');
  const html = value => {
    if (typeof value === 'string') {
      for (const match of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!match[1].startsWith('#')) add(match[1]);
      if (/url\s*\(/i.test(value)) fail('inline renderer URL outside this contract');
    } else if (Array.isArray(value)) value.forEach(html);
    else if (value && typeof value === 'object') Object.values(value).forEach(html);
  };
  html(ctx.studentPayload(question));return [...result].sort();
}

function svg(bytes) {
  const value = bytes.toString('utf8');
  if (/<(?:script|foreignObject|iframe|object|embed|image)\b|<!DOCTYPE|<!ENTITY|\bon[a-z]+\s*=/i.test(value))
    fail('dynamic or nested SVG dependency outside this contract');
  const dependencies = [
    ...[...value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]),
    ...[...value.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m => m[1]),
  ];
  if (dependencies.some(value => !value.startsWith('#'))) fail('external SVG dependency outside this contract');
}

function staticRefreshSvg(bytes) {
  svg(bytes);
  const value = bytes.toString('utf8'), forbidden = new Set(['script', 'foreignobject', 'iframe', 'object', 'embed', 'image',
    'animate', 'animatemotion', 'animatetransform', 'animatecolor', 'set', 'discard']);
  if ([...value.matchAll(/<([^\s/>!?]+)(?=[\s/>])/g)].some(match => forbidden.has(match[1].split(':').at(-1).toLowerCase())) ||
      /<\?xml-stylesheet\b|\bxml:base\s*=|@import\b|@(?:-[a-z]+-)?keyframes\b|(?:^|[;"'\s{])(?:-[a-z]+-)?animation(?:-[a-z-]+)?\s*:/i.test(value))
    fail('refresh requires static SVG without animation or stylesheet dependencies');
  for (const style of [...value.matchAll(/\bstyle\s*=\s*(["'])(.*?)\1/gs)].map(match => match[2])
    .concat([...value.matchAll(/<(?:[^\s/>!?]+:)?style\b[^>]*>([\s\S]*?)<\//gi)].map(match => match[1])))
    if (/[\\&]/.test(style)) fail('escaped or entity-encoded SVG style outside refresh contract');
  for (const ref of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi))
    if (/[\\&]/.test(ref[1])) fail('encoded SVG dependency outside refresh contract');
}

function assets(ctx, rows, source, alsoCommit, strictStatic = false) {
  if (!Array.isArray(rows) || rows.some(row => !exactKeys(row, ['path', 'gitBlobSha1', 'sha256'])) ||
      new Set(rows.map(row => row.path)).size !== rows.length ||
      !same(rows.map(row => row.path).sort(), references(ctx, source.question))) fail('complete exact renderer asset inventory required');
  return rows.map(row => {
    if (!SHA1.test(row.gitBlobSha1) || !SHA256.test(row.sha256)) fail('exact renderer asset digests required');
    const file = gitFile(ctx, source.ref.commit, row.path);
    if (file.gitBlobSha1 !== row.gitBlobSha1 || file.sha256 !== row.sha256 ||
        alsoCommit && gitFile(ctx, alsoCommit, row.path).sha256 !== row.sha256) fail('immutable renderer bytes changed');
    if (!boundLive(ctx, { path: row.path, sha256: row.sha256 }).equals(file.bytes)) fail('live renderer differs from inspected snapshot');
    if (strictStatic ? /\.svg$/i.test(row.path) : row.path.endsWith('.svg'))
      (strictStatic ? staticRefreshSvg : svg)(file.bytes);
    return clone(row);
  }).sort((a, b) => a.path.localeCompare(b.path, 'en'));
}

function presentationTransition(before, after, size = 'full') {
  const changes = delta(before, after);
  if (!same(Object.keys(changes), M2_RENDERER_FIELDS) || !same(without(before, M2_RENDERER_FIELDS), without(after, M2_RENDERER_FIELDS)))
    fail('only the four exact presentation fields may change');
  if (typeof before.image !== 'string' || !before.image.endsWith('.png') ||
      typeof after.image !== 'string' || !after.image.endsWith('.svg') ||
      Object.hasOwn(before, 'imageSize') || after.imageSize !== size ||
      !['grid', 'subjective-2up'].includes(before.layoutTag) || after.layoutTag !== 'fullwidth' ||
      Object.hasOwn(before, 'imageAlt') || !text(after.imageAlt) || after.imageAlt.length > 1000 ||
      /[\x00-\x1f]|<[A-Za-z!/?]/.test(after.imageAlt)) fail('presentation field types or exact transition unsupported');
  return changes;
}

export function validateM2CurrentRendererContinuity(args) {
  const ctx = { ...args, cache: args.cache || new Map() }, spec = ctx.patch.sourceReview?.m2RendererProof;
  if (spec?.schemaVersion === M2_RENDERER_REFRESH_SCHEMA) return validateRefresh(ctx, spec);
  if (!exactKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewRef']) || spec.schemaVersion !== M2_RENDERER_SCHEMA ||
      ctx.request.scope !== 'PARTIAL_UIDS' || ctx.request.approval?.type !== 'FINAL_QA' || ctx.request.approval.metadataReviewed !== true ||
      ctx.request.registrationMode !== undefined || ctx.request.approval.sourceRebind !== undefined || ctx.patch.rebind !== undefined ||
      ctx.patch.sourceReview.rendererProof !== undefined || (ctx.request.registryChanges || []).length ||
      !WITNESS_PATH.test(spec.reviewRef?.path || '') ||
      !/^original\/middle\/m2\/2(?:mid|final)\//.test(ctx.request.sourceArchiveFile || '') ||
      ctx.native.review.schemaVersion !== 'm2-s2-meta-review-v1' || !['KEEP', 'CORRECT'].includes(ctx.row.rpmDecision))
    fail('exclusive settled M2 transport scope required');
  const hasProposal = ctx.patch.sourceReview.proposalFinalization?.schemaVersion === 'archive-native-proposal-finalization-v3';
  const hasRetained = ctx.patch.sourceReview.retainedFields?.schemaVersion === 'archive-reviewed-native-retained-fields-v1';
  if (hasProposal === hasRetained) fail('one unchanged native finalization or retention authority is required');
  const witness = document(ctx, spec.reviewRef, spec.reviewCommit);
  if (!exactKeys(witness, ['schemaVersion', 'scope', 'decision', 'reviewer', 'observedAt', 'selectedUidCount', 'rows',
    'newMathematicalQa', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReviewPassCount']) ||
      witness.schemaVersion !== M2_RENDERER_REVIEW_SCHEMA || witness.scope !== SCOPE ||
      witness.decision !== 'PASS_NARROW_PRESENTATION_CONTINUITY' || !text(witness.reviewer) || !text(witness.observedAt) ||
      witness.reviewer === ctx.native.reviewer || witness.reviewer === ctx.request.approval.approvedBy ||
      witness.newMathematicalQa !== false || witness.newMetadataApprovals !== 0 || witness.newDifficultyJudgments !== 0 || witness.newReviewPassCount !== 0 ||
      !Array.isArray(witness.rows) || !Number.isInteger(witness.selectedUidCount) || witness.selectedUidCount < 1 ||
      witness.selectedUidCount > 3 || witness.rows.length !== witness.selectedUidCount ||
      new Set(witness.rows.map(row => row.questionUid)).size !== witness.rows.length)
    fail('exact independent M2 renderer witness required');
  const selected = witness.rows.filter(row => row.questionUid === ctx.patch.questionUid), row = selected[0];
  if (selected.length !== 1 || !exactKeys(row, ['questionUid', 'sourceOrdinal', 'sourceArchiveFile', 'expectedQuestionCount',
    'nativeReviewRef', 'nativeItemSha256', 'frozenRequestRef', 'productionBeforeSourceRef', 'productionCurrentSourceRef',
    'prefigureSourceRef', 'currentSourceRef', 'changedFields', 'fieldDeltaHashes', 'metadataPatchSha256',
    'beforeAssets', 'currentAssets', 'visualChecks', 'observed']) ||
      row.sourceOrdinal !== ctx.patch.sourceOrdinal || row.sourceArchiveFile !== ctx.request.sourceArchiveFile ||
      row.expectedQuestionCount !== ctx.request.expectedQuestionCount ||
      !same(row.nativeReviewRef, { commit: ctx.native.spec.reviewCommit, path: ctx.native.spec.reviewPath, sha256: ctx.native.spec.reviewRef.sha256 }) ||
      row.nativeItemSha256 !== sha(stable(ctx.row)) || !same(row.changedFields, M2_RENDERER_FIELDS) ||
      !exactKeys(row.visualChecks, ['originalAndCurrentProblemObserved', 'labelsAndGivenValuesUnchanged',
        'givenGeometryRelationsPreserved', 'choiceOrderUnchanged', 'noNewInferenceOrAnswerHint', 'unchangedSolutionBytesVerified']) ||
      Object.values(row.visualChecks).some(value => value !== true) ||
      !exactKeys(row.observed, ['preservedGivenConditions', 'presentationChanges', 'noNewInferenceOrAnswerHint']) ||
      Object.values(row.observed).some(value => !text(value)))
    fail('exact selected UID, native authority and direct visual observations required');
  return validateFrozenTransport(ctx, spec, witness, row);
}

// This shared private core never chooses an authority or substitutes an after
// value. Only the original v1 validator and the separately authenticated tall
// observation can enter it. The v1 transition remains absent -> full.
function validateFrozenTransport(ctx, spec, witness, row, { size = 'full', strictStatic = false } = {}) {
  const frozenRef = row.frozenRequestRef;
  if (!exactKeys(frozenRef, ['commit', 'gitPath', 'path', 'sha256']) ||
      !frozenRef.gitPath.startsWith('.archive-meta-register/inbox/') || frozenRef.path.startsWith('.archive-meta-register/inbox/'))
    fail('separate immutable frozen request copy required');
  const frozen = document(ctx, { path: frozenRef.path, sha256: frozenRef.sha256 }, frozenRef.commit, frozenRef.gitPath);
  const frozenItems = frozen.items?.filter(item => item.questionUid === ctx.patch.questionUid), frozenItem = frozenItems?.[0];
  if (frozen.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2' || frozen.requestId !== ctx.request.requestId ||
      frozen.scope !== 'PARTIAL_UIDS' || frozen.approval?.type !== 'FINAL_QA' || frozen.approval.metadataReviewed !== true ||
      frozen.registrationMode !== undefined || frozen.approval.sourceRebind !== undefined ||
      frozen.sourceArchiveFile !== ctx.request.sourceArchiveFile || frozen.expectedQuestionCount !== ctx.request.expectedQuestionCount ||
      !same(frozen.registryChanges, ctx.request.registryChanges) || !same(frozen.items.map(item => [item.questionUid, item.sourceOrdinal]),
        ctx.request.items.map(item => [item.questionUid, item.sourceOrdinal])) ||
      frozenItems.length !== 1 || frozenItem.sourceOrdinal !== ctx.patch.sourceOrdinal ||
      !same(frozenItem.sourceReview, without(ctx.patch.sourceReview, ['m2RendererProof'])) ||
      !same(without(frozenItem.after, ['sourceFingerprint', 'contentFingerprint']), without(ctx.patch.after, ['sourceFingerprint', 'contentFingerprint'])))
    fail('frozen native request authority or exact selected set changed');
  const productionBefore = snapshot(ctx, row.productionBeforeSourceRef), productionCurrent = snapshot(ctx, row.productionCurrentSourceRef),
    prefigure = snapshot(ctx, row.prefigureSourceRef), current = snapshot(ctx, row.currentSourceRef);
  if (frozenRef.commit !== prefigure.ref.commit || frozen.expectedSourceBlobSha1 !== prefigure.file.gitBlobSha1 ||
      ctx.request.expectedSourceBlobSha1 !== current.file.gitBlobSha1 ||
      !same(ctx.question, current.question)) fail('frozen/current request source or live object mismatch');
  const ownerDelta = presentationTransition(productionBefore.question, productionCurrent.question, size),
    candidateDelta = presentationTransition(prefigure.question, current.question, size);
  const metadataPatch = delta(productionBefore.question, prefigure.question);
  if (!same(ctx.studentPayload(productionBefore.question), ctx.studentPayload(prefigure.question)) ||
      !same(ctx.studentPayload(productionCurrent.question), ctx.studentPayload(current.question)) ||
      Object.entries(metadataPatch).some(([key, change]) => !Object.hasOwn(frozenItem.after, key) ||
        ['sourceFingerprint', 'contentFingerprint'].includes(key) || !change.after.present ||
        !same(change.after.value, frozenItem.after[key])))
    fail('metadata axis must preserve the whole student payload and append only frozen approved values');
  if (!same(ownerDelta, candidateDelta) || !same(metadataPatch, delta(productionCurrent.question, current.question)) ||
      Object.keys(metadataPatch).some(key => M2_RENDERER_FIELDS.includes(key)) ||
      row.metadataPatchSha256 !== sha(stable(metadataPatch)) ||
      !same(row.fieldDeltaHashes, Object.fromEntries(M2_RENDERER_FIELDS.map(field => [field, {
        before: sha(stable(ownerDelta[field].before)), after: sha(stable(ownerDelta[field].after)),
      }])))) fail('three-way presentation or frozen metadata patch changed');
  const ordinal = ctx.patch.sourceOrdinal;
  if (!same(ctx.studentPayload(prefigure.question), ctx.studentPayload(ctx.native.reviewedBank[ordinal - 1])) ||
      !same(ctx.studentPayload(prefigure.question), ctx.studentPayload(ctx.native.committedBank[ordinal - 1])))
    fail('prefigure is not the exact immutable native student payload');
  const beforeAssets = assets(ctx, row.beforeAssets, prefigure, ctx.native.spec.reviewCommit, strictStatic),
    currentAssets = assets(ctx, row.currentAssets, current, undefined, strictStatic);
  for (const asset of beforeAssets) if (gitFile(ctx, productionBefore.ref.commit, asset.path).sha256 !== asset.sha256)
    fail('production before asset differs from native/prefigure bytes');
  for (const asset of currentAssets) if (gitFile(ctx, productionCurrent.ref.commit, asset.path).sha256 !== asset.sha256)
    fail('production current asset differs from inspected candidate bytes');
  const oldPrimary = assetPath(ctx, prefigure.question.image), newPrimary = assetPath(ctx, current.question.image);
  if (!same(beforeAssets.filter(row => row.path !== oldPrimary), currentAssets.filter(row => row.path !== newPrimary)))
    fail('an unselected solution or other renderer asset changed');
  return { semanticQuestion: clone(prefigure.question), proof: { ...clone(spec), scope: SCOPE,
    questionUid: ctx.patch.questionUid, sourceOrdinal: ordinal, reviewer: witness.reviewer,
    nativeReviewRef: clone(row.nativeReviewRef), nativeItemSha256: row.nativeItemSha256,
    frozenRequestRef: clone(frozenRef), productionBeforeSourceRef: clone(row.productionBeforeSourceRef),
    productionCurrentSourceRef: clone(row.productionCurrentSourceRef), prefigureSourceRef: clone(row.prefigureSourceRef),
    currentSourceRef: clone(row.currentSourceRef), changedFields: [...M2_RENDERER_FIELDS],
    fieldDeltaHashes: clone(row.fieldDeltaHashes), metadataPatchSha256: row.metadataPatchSha256,
    nativeStudentPayloadSha256: sha(stable(ctx.studentPayload(prefigure.question))),
    currentStudentPayloadSha256: sha(stable(ctx.studentPayload(ctx.question))), beforeAssets, currentAssets,
    suppliesMetadataValues: false, newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0 } };
}

const SOURCE_REF_KEYS = ['commit', 'path', 'gitBlobSha1', 'sha256'];
const DIRECT_ROW_KEYS = ['questionUid', 'sourceOrdinal', 'sourceArchiveFile', 'expectedQuestionCount',
  'nativeReviewRef', 'nativeItemSha256', 'frozenRequestRef', 'productionBeforeSourceRef', 'productionCurrentSourceRef',
  'prefigureSourceRef', 'currentSourceRef', 'changedFields', 'fieldDeltaHashes', 'metadataPatchSha256',
  'beforeAssets', 'currentAssets', 'observationRowSha256'];

function directTallObservation(ctx, witness, row) {
  const ref = witness.actualObservationRef;
  if (!exactKeys(ref, ['commit', 'path', 'sha256']) || ref.path.startsWith('.archive-meta-register/inbox/'))
    fail('immutable raw direct observation required');
  const raw = document(ctx, { path: ref.path, sha256: ref.sha256 }, ref.commit);
  if (!exactKeys(raw, ['schemaVersion', 'taskId', 'reviewer', 'observedAtUtc', 'scope', 'selectedUidCount', 'rows',
      'priorTruncatedImageOutputUsedAsObservation', 'fullExamIndependentReview', 'e006Q21NewObservation',
      'newMetadataApprovals', 'sourceWrites', 'assetWrites', 'productionRegistration', 'nextAction']) ||
      raw.schemaVersion !== 'root-targeted-m2-renderer-direct-observations-v1' || !text(raw.taskId) ||
      !text(raw.scope) || !text(raw.nextAction) || !text(raw.reviewer) || !text(raw.observedAtUtc) ||
      raw.reviewer === ctx.native.reviewer || raw.reviewer === ctx.request.approval.approvedBy ||
      raw.reviewer === witness.transportAuthor || raw.priorTruncatedImageOutputUsedAsObservation !== false ||
      raw.fullExamIndependentReview !== false || raw.e006Q21NewObservation !== false ||
      [raw.newMetadataApprovals, raw.sourceWrites, raw.assetWrites, raw.productionRegistration].some(value => value !== 0) ||
      !Array.isArray(raw.rows) || raw.rows.length !== raw.selectedUidCount || raw.selectedUidCount < 1 || raw.selectedUidCount > 3 ||
      new Set(raw.rows.map(value => value.questionUid)).size !== raw.rows.length)
    fail('exact targeted raw observation and independent attribution required');
  const selected = raw.rows.filter(value => value.questionUid === ctx.patch.questionUid), observed = selected[0];
  if (selected.length !== 1 || !exactKeys(observed, ['sourceArchiveFile', 'questionUid', 'sourceOrdinal', 'nativeSourceRef',
      'observedCurrentSourceRef', 'assets', 'stemAndChoicesRead', 'stemAndChoicesUnchanged',
      'answerAndSolutionFieldsByteComparedOnly', 'answerAndSolutionFieldsUnchanged', 'observations', 'decision']) ||
      observed.sourceArchiveFile !== ctx.request.sourceArchiveFile || observed.sourceOrdinal !== ctx.patch.sourceOrdinal ||
      row.observationRowSha256 !== sha(stable(observed)) ||
      observed.decision !== 'SELECTED_STUDENT_CONDITIONS_PRESERVED' ||
      [observed.stemAndChoicesRead, observed.stemAndChoicesUnchanged, observed.answerAndSolutionFieldsByteComparedOnly,
        observed.answerAndSolutionFieldsUnchanged].some(value => value !== true) ||
      !exactKeys(observed.observations, ['relations', 'stemSupport', 'newUnsupportedConditionObserved']) ||
      observed.observations.newUnsupportedConditionObserved !== false ||
      [observed.observations.relations, observed.observations.stemSupport].some(values =>
        !Array.isArray(values) || !values.length || values.some(value => !text(value))))
    fail('exact selected raw observation required; no observation may be inferred');
  const prefigure = snapshot(ctx, row.prefigureSourceRef), current = snapshot(ctx, row.currentSourceRef),
    nativeFile = gitFile(ctx, ctx.native.spec.reviewCommit, prefigure.ref.path);
  const nativeRef = Object.fromEntries(SOURCE_REF_KEYS.map(key => [key, nativeFile[key]]));
  if (!exactKeys(observed.nativeSourceRef, SOURCE_REF_KEYS) || !same(observed.nativeSourceRef, nativeRef) ||
      !exactKeys(observed.observedCurrentSourceRef, SOURCE_REF_KEYS) ||
      !same(observed.observedCurrentSourceRef, without(row.currentSourceRef, ['questionSha256'])) ||
      !Array.isArray(observed.assets) || observed.assets.length !== 2)
    fail('raw observation source and primary renderer anchors differ');
  for (const [state, source, commit] of [['native', prefigure, nativeRef.commit], ['current', current, current.ref.commit]]) {
    const rows = observed.assets.filter(value => value.state === state), value = rows[0],
      file = gitFile(ctx, commit, assetPath(ctx, source.question.image)),
      expected = Object.fromEntries(SOURCE_REF_KEYS.map(key => [key, file[key]]));
    if (rows.length !== 1 || !exactKeys(value, ['state', 'ref', 'viewedPngSha256', 'actuallyViewed', 'viewMethod']) ||
        !exactKeys(value.ref, SOURCE_REF_KEYS) || !same(value.ref, expected) || value.actuallyViewed !== true ||
        !SHA256.test(value.viewedPngSha256 || '') || !text(value.viewMethod))
      fail('raw direct primary asset observation is incomplete or changed');
  }
  return { reviewer: raw.reviewer, observedAt: raw.observedAtUtc, actualObservationRef: clone(ref),
    observationRowSha256: row.observationRowSha256, answerAndSolutionFieldsByteComparedOnly: true };
}

function validateRefresh(ctx, spec) {
  if (!exactKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewRef']) || !REFRESH_PATH.test(spec.reviewRef?.path || '') ||
      ctx.request.scope !== 'PARTIAL_UIDS' || ctx.request.approval?.type !== 'FINAL_QA' || ctx.request.approval.metadataReviewed !== true ||
      ctx.request.registrationMode !== undefined || ctx.request.approval.sourceRebind !== undefined || ctx.patch.rebind !== undefined ||
      ctx.patch.sourceReview.rendererProof !== undefined || ctx.patch.sourceReview.m2ProviderRendererProof !== undefined ||
      (ctx.request.registryChanges || []).length || !/^original\/middle\/m2\/2(?:mid|final)\//.test(ctx.request.sourceArchiveFile || '') ||
      ctx.native.review.schemaVersion !== 'm2-s2-meta-review-v1' || !['KEEP', 'CORRECT'].includes(ctx.row.rpmDecision))
    fail('exclusive settled M2 refresh scope required');
  const hasProposal = ctx.patch.sourceReview.proposalFinalization?.schemaVersion === 'archive-native-proposal-finalization-v3',
    hasRetained = ctx.patch.sourceReview.retainedFields?.schemaVersion === 'archive-reviewed-native-retained-fields-v1';
  if (hasProposal === hasRetained) fail('one unchanged native finalization or retention authority is required');
  const witness = document(ctx, spec.reviewRef, spec.reviewCommit), direct = witness.mode === 'DIRECT_NATIVE_TO_TALL';
  if (!exactKeys(witness, ['schemaVersion', 'scope', 'mode', 'transportAuthor', 'selectedUidCount', 'rows', 'newObservation',
      'newMathematicalQa', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReviewPassCount', ...(direct ? ['actualObservationRef'] : [])]) ||
      witness.schemaVersion !== M2_RENDERER_REFRESH_REVIEW_SCHEMA || witness.scope !== REFRESH_SCOPE ||
      !['DIRECT_NATIVE_TO_TALL', 'REUSE_EXACT_V1_OBSERVATION'].includes(witness.mode) || !text(witness.transportAuthor) ||
      witness.newObservation !== direct || witness.newMathematicalQa !== false || witness.newMetadataApprovals !== 0 ||
      witness.newDifficultyJudgments !== 0 || witness.newReviewPassCount !== 0 || !Array.isArray(witness.rows) ||
      !Number.isInteger(witness.selectedUidCount) || witness.selectedUidCount < 1 || witness.selectedUidCount > 3 ||
      witness.rows.length !== witness.selectedUidCount || new Set(witness.rows.map(row => row.questionUid)).size !== witness.rows.length)
    fail('exact typed refresh and honest observation attribution required');
  const selected = witness.rows.filter(row => row.questionUid === ctx.patch.questionUid), row = selected[0];
  const expectedKeys = direct ? DIRECT_ROW_KEYS : ['questionUid', 'sourceOrdinal', 'sourceArchiveFile', 'expectedQuestionCount',
    'priorV1Proof', 'priorObservationRowSha256', 'currentSourceRef', 'currentAssets', 'newObservation'];
  if (selected.length !== 1 || !exactKeys(row, expectedKeys) || row.sourceOrdinal !== ctx.patch.sourceOrdinal ||
      row.sourceArchiveFile !== ctx.request.sourceArchiveFile || row.expectedQuestionCount !== ctx.request.expectedQuestionCount)
    fail('exact refresh UID, source and denominator required');
  if (direct) {
    if (!same(row.nativeReviewRef, { commit: ctx.native.spec.reviewCommit, path: ctx.native.spec.reviewPath, sha256: ctx.native.spec.reviewRef.sha256 }) ||
        row.nativeItemSha256 !== sha(stable(ctx.row)) || !same(row.changedFields, M2_RENDERER_FIELDS))
      fail('unchanged native authority and four-field tall transition required');
    const observation = directTallObservation(ctx, witness, row), result = validateFrozenTransport(ctx, spec, observation, row,
      { size: 'tall', strictStatic: true });
    result.proof = { ...result.proof, scope: REFRESH_SCOPE, mode: witness.mode, newObservation: true, ...observation };
    return result;
  }
  // One original v1 leaf only. No recursive refresh, synthetic new review or
  // inherited success cache can stand in for this complete fresh v1 replay.
  const prior = row.priorV1Proof;
  if (row.newObservation !== false || !exactKeys(prior, ['schemaVersion', 'reviewCommit', 'reviewRef']) ||
      prior.schemaVersion !== M2_RENDERER_SCHEMA || !WITNESS_PATH.test(prior.reviewRef?.path || '') ||
      prior.reviewRef.path === spec.reviewRef.path)
    fail('one original v1 observation leaf required, without a new observation claim');
  const original = document(ctx, prior.reviewRef, prior.reviewCommit), priorRows = original.rows?.filter(value => value.questionUid === ctx.patch.questionUid),
    priorRow = priorRows?.[0];
  if (priorRows?.length !== 1 || row.priorObservationRowSha256 !== sha(stable(priorRow)) ||
      original.reviewer === witness.transportAuthor)
    fail('exact original observation row and separate transport author required');
  const current = snapshot(ctx, row.currentSourceRef), previous = snapshot(ctx, priorRow.currentSourceRef);
  // The registrar or native ancestry verifier authenticates actual source bytes.
  // Its source-only descendant may have a newer whole-file blob while replaying
  // this sealed leaf. Never substitute that descendant for the leaf snapshot:
  // require the exact selected whole object here and every live asset below.
  if (ctx.request.expectedSourceBlobSha1 !== current.file.gitBlobSha1 || !same(ctx.question, current.question) ||
      !same(current.question, previous.question))
    fail('reused observation requires exact bound source snapshot and current whole object');
  const currentAssets = assets(ctx, row.currentAssets, current, previous.ref.commit, true);
  if (!same(currentAssets, [...(priorRow.currentAssets || [])].sort((a, b) => a.path.localeCompare(b.path, 'en'))))
    fail('reused observation requires every original observed asset unchanged');
  const priorPatch = { ...ctx.patch, sourceReview: { ...ctx.patch.sourceReview, m2RendererProof: clone(prior) } },
    priorRequest = { ...ctx.request, expectedSourceBlobSha1: previous.file.gitBlobSha1,
      items: ctx.request.items.map(item => item.questionUid === priorPatch.questionUid ? priorPatch : item) },
    replayed = validateM2CurrentRendererContinuity({ ...ctx, request: priorRequest, patch: priorPatch });
  return { semanticQuestion: replayed.semanticQuestion, proof: { ...clone(spec), scope: REFRESH_SCOPE, mode: witness.mode,
    questionUid: ctx.patch.questionUid, sourceOrdinal: ctx.patch.sourceOrdinal, newObservation: false,
    reviewer: original.reviewer, observedAt: original.observedAt, priorV1Proof: replayed.proof,
    priorObservationRowSha256: row.priorObservationRowSha256, currentSourceRef: clone(row.currentSourceRef), currentAssets,
    nativeStudentPayloadSha256: replayed.proof.nativeStudentPayloadSha256,
    currentStudentPayloadSha256: sha(stable(ctx.studentPayload(ctx.question))),
    suppliesMetadataValues: false, newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0 } };
}

// Claim detection only, never approval: the HEAD-ancestry visual inventory keeps
// the proof obligation visible if every mutable receipt marker and the live
// sidecar/witness are removed together. The normal verifier must still replay
// the sealed request, original native authority and current renderer bytes.
export function hasImmutableM2CurrentRendererClaim({root,current,runtimeRecord}) {
  const rows=[current,runtimeRecord].filter(row=>row&&
    /^original\/middle\/m2\/2(?:mid|final)\//.test(row.sourceArchiveFile||'')&&text(row.questionUid));
  if(!rows.length)return false;
  const run=args=>execFileSync('git',args,{cwd:root,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
  let head;
  try{head=run(['rev-parse','--verify','HEAD^{commit}']).toString().trim();}catch{return true;}
  const key=stable([path.resolve(root),head]);
  if(!immutableClaimInventories.has(key)){
    try{
      const claims=new Set(),seenBlobs=new Set();
      // Only ancestors of the actual HEAD are authoritative here. Unmerged
      // branches must not create a claim in another transaction. Keeping every
      // earlier version also prevents a committed deletion or empty replacement
      // from erasing the obligation established by the issued transport.
      const commits=run(['log','--full-history','--format=%H','--diff-filter=AM',head,'--',
        ':(glob).archive-meta-register/evidence/m2-current-renderer-*/independent-review.json',
        ':(glob).archive-meta-register/evidence/m2-current-renderer-refresh-*/transport.json']).toString().split(/\s+/).filter(Boolean);
      for(const commit of new Set([head,...commits])){
        const files=run(['ls-tree','-rz','--name-only',commit,'--','.archive-meta-register/evidence']).toString().split('\0').filter(p=>WITNESS_PATH.test(p)||REFRESH_PATH.test(p));
        for(const relative of files){
          const blob=run(['rev-parse',`${commit}:${relative}`]).toString().trim();if(seenBlobs.has(blob))continue;seenBlobs.add(blob);
          const doc=JSON.parse(run(['cat-file','blob',blob]).toString());
          if(!((doc.schemaVersion===M2_RENDERER_REVIEW_SCHEMA&&doc.scope===SCOPE)||
            (doc.schemaVersion===M2_RENDERER_REFRESH_REVIEW_SCHEMA&&doc.scope===REFRESH_SCOPE)))continue;
          for(const row of Array.isArray(doc.rows)?doc.rows:[])
            if(text(row.questionUid)&&text(row.sourceArchiveFile))claims.add(stable([row.questionUid,row.sourceArchiveFile]));
        }
      }
      immutableClaimInventories.set(key,claims);
    }catch{return true;}
  }
  const claims=immutableClaimInventories.get(key);
  return rows.some(row=>claims.has(stable([row.questionUid,row.sourceArchiveFile])));
}
