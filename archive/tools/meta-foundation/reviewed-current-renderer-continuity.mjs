// A native semantic review remains immutable. This proof covers only a later,
// independently inspected renderer change; it supplies no metadata values.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const fail = message => { throw Error(`reviewed renderer continuity: ${message}`); };
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const text = value => typeof value === 'string' && value.trim();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const equal = (a, b) => stable(a) === stable(b);
const ownKeys = (value, allowed) => value && typeof value === 'object' && !Array.isArray(value) &&
  Object.keys(value).every(k => allowed.includes(k));
const FIGURE_FIELDS = new Set(['content', 'image', 'solutionImage', 'solutionImageSize',
  'solutionImageAlt', 'solutionImageCaption', 'layoutTag']);
const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter(k => !equal(a[k], b[k]));
const imagePathsOnly = value => typeof value === 'string' ? value.replace(
  /(<img\b[^>]*?\bsrc\s*=\s*)(["'])([^"']*)\2/gi, '$1$2FIGURE_PATH$2') : value;
const RENDERER_REVIEW_V2 = 'archive-independent-current-renderer-review-v2';
const V2_FIGURE_FIELDS = new Set([...FIGURE_FIELDS, 'imageAlt', 'imageSize']);
const fieldDigest = (question, field) => sha(stable({ present: Object.hasOwn(question, field), value: question[field] ?? null }));

// V2 adds only an independently inspected image description/size and the
// exact two image containers inserted into an otherwise byte-identical stem.
// It is not a general HTML normalizer or a new mathematical review lane.
function verifyV2ContentTransition(ctx, transition, before, current) {
  if (typeof before !== 'string' || typeof current !== 'string' ||
      !ownKeys(transition, ['kind', 'beforeSha256', 'afterSha256', 'insertions']) ||
      transition.beforeSha256 !== sha(before) || transition.afterSha256 !== sha(current))
    fail('v2 exact content transition hashes required');
  if (transition.kind === 'UNCHANGED') {
    if (before !== current || transition.insertions !== undefined) fail('v2 unchanged content differs');
    return { kind: transition.kind, mathematicalStemSha256: sha(before) };
  }
  if (transition.kind === 'IMG_SRC_REPLACEMENT_ONLY') {
    if (before === current || transition.insertions !== undefined || imagePathsOnly(before) !== imagePathsOnly(current))
      fail('v2 image path replacement changed the stem');
    return { kind: transition.kind, mathematicalStemSha256: sha(imagePathsOnly(before)) };
  }
  if (transition.kind !== 'TWO_EXACT_IMAGE_CONTAINERS_INSERTED' || !Array.isArray(transition.insertions) ||
      transition.insertions.length !== 2) fail('v2 content change is outside the closed insertion contract');
  const bytes = Buffer.from(current), chunks = [], paths = new Set(); let cursor = 0;
  for (const row of transition.insertions) {
    if (!ownKeys(row, ['startByte', 'byteLength', 'sha256', 'assetPath']) ||
        !Number.isInteger(row.startByte) || row.startByte < cursor || !Number.isInteger(row.byteLength) ||
        row.byteLength < 1 || row.startByte + row.byteLength > bytes.length || !SHA256.test(row.sha256 || ''))
      fail('v2 exact image container range required');
    const slice = bytes.subarray(row.startByte, row.startByte + row.byteLength), raw = slice.toString('utf8');
    if (!Buffer.from(raw).equals(slice) || sha(slice) !== row.sha256) fail('v2 image container bytes changed');
    const match = raw.match(/^<div class="question-image"><img src="(assets\/[^"<>%&?#:\x00-\x20]+\.(?:svg|png))" alt="[^"<>\x00-\x1f]*" style="width:[1-9][0-9]{0,3}px;max-width:100%;height:auto"><\/div>$/);
    if (!match || row.assetPath !== `archive/${match[1]}` || paths.has(row.assetPath))
      fail('v2 container must contain only the exact local image and display attributes');
    safePath(ctx.root, row.assetPath); paths.add(row.assetPath);
    chunks.push(bytes.subarray(cursor, row.startByte)); cursor = row.startByte + row.byteLength;
  }
  chunks.push(bytes.subarray(cursor));
  if (!Buffer.concat(chunks).equals(Buffer.from(before))) fail('v2 non-image stem bytes changed');
  return { kind: transition.kind, mathematicalStemSha256: sha(before),
    insertedContainers: transition.insertions.map(row => ({ ...row })) };
}

export function reviewedRendererBindingPath(requestId) {
  if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(requestId || '')) fail('valid renderer binding requestId required');
  return `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${requestId}.renderer-binding.json`;
}

// This digest inventory is emitted by the official writer. Its path stays in
// the accepted metadata/runtime evidence even if receipt proof fields are lost.
// It supplies no semantic values and makes no approval decision of its own.
export function buildReviewedRendererBinding({ requestId, requestSha256, sourceArchiveFile, sourceBlobSha1,
  sourceRawSha256, scope, expectedQuestionCount, partialUidCount, fingerprintRepairs }) {
  reviewedRendererBindingPath(requestId);
  if (scope !== 'PARTIAL_UIDS' || !SHA256.test(requestSha256 || '') || !SHA1.test(sourceBlobSha1 || '') ||
      !SHA256.test(sourceRawSha256 || '') || !text(sourceArchiveFile) || !Number.isInteger(expectedQuestionCount) ||
      !Number.isInteger(partialUidCount) || partialUidCount < 1 || expectedQuestionCount < partialUidCount ||
      !Array.isArray(fingerprintRepairs)) fail('exact renderer binding source/request scope required');
  const repairs = fingerprintRepairs.filter(r => r.sourceReview?.rendererContinuity !== undefined);
  if (!repairs.length || repairs.length > partialUidCount || new Set(repairs.map(r => r.questionUid)).size !== repairs.length ||
      new Set(repairs.map(r => r.sourceOrdinal)).size !== repairs.length || repairs.some(r => !text(r.questionUid) ||
        !Number.isInteger(r.sourceOrdinal) || r.sourceOrdinal < 1 || r.sourceOrdinal > expectedQuestionCount ||
        r.sourceReview.rendererContinuity?.schemaVersion !== 'archive-reviewed-current-renderer-continuity-v1'))
    fail('exact renderer binding repair inventory required');
  return { schemaVersion: 'archive-reviewed-renderer-binding-v1', requestId, requestSha256, sourceArchiveFile,
    sourceBlobSha1, sourceRawSha256, scope, expectedQuestionCount, partialUidCount, rendererUidCount: repairs.length,
    records: repairs.map(r => ({ questionUid: r.questionUid, sourceOrdinal: r.sourceOrdinal,
      sourceReviewSha256: sha(stable(r.sourceReview)), fingerprintRepairSha256: sha(stable(r)) }))
      .sort((a, b) => a.sourceOrdinal - b.sourceOrdinal) };
}

function safePath(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || relative.includes('\\') || /[\x00-\x1f]/.test(relative) ||
      relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe evidence/source/asset path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink evidence/source/asset path');
  return full;
}
function parse(bytes) { try { return JSON.parse(bytes); } catch { fail('invalid JSON evidence'); } }
function git(ctx, ...args) {
  try { return execFileSync('git', args, { cwd: ctx.root, maxBuffer: 32 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { fail('immutable Git evidence unavailable'); }
}
function gitFile(ctx, commit, relative) {
  safePath(ctx.root, relative);
  if (!SHA1.test(commit || '')) fail('exact immutable commit required');
  const key = `renderer-source-git:${commit}:${relative}`;
  if (!ctx.cache.has(key)) {
    if (git(ctx, 'rev-parse', '--verify', `${commit}^{commit}`).toString().trim() !== commit)
      fail('exact immutable commit required');
    const blob = git(ctx, 'rev-parse', `${commit}:${relative}`).toString().trim();
    const bytes = git(ctx, 'cat-file', 'blob', blob);
    ctx.cache.set(key, { commit, path: relative, gitBlobSha1: blob, sha256: sha(bytes), bytes });
  }
  return ctx.cache.get(key);
}
function boundDocument(ctx, ref) {
  if (!ownKeys(ref, ['path', 'sha256']) || !SHA256.test(ref.sha256 || '')) fail('SHA-bound review reference required');
  for (const refs of [ctx.request.approval.evidenceRefs, ctx.patch.evidenceRefs])
    if (!refs?.some(r => r.path === ref.path && r.sha256 === ref.sha256)) fail('review reference must bind approval and item evidence');
  const full = safePath(ctx.root, ref.path);
  if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== ref.sha256) fail('local review evidence missing or changed');
  const file = gitFile(ctx, ctx.spec.reviewCommit, ref.path);
  if (file.sha256 !== ref.sha256) fail('review evidence differs from immutable Git bytes');
  return parse(file.bytes);
}
function uniqueRow(rows, uid, ordinal, ordinalField = 'sourceOrdinal') {
  if (!Array.isArray(rows)) fail('selected review inventory missing');
  const selected = rows.filter(r => r.questionUid === uid);
  if (selected.length !== 1 || selected[0][ordinalField] !== ordinal) fail('review UID/ordinal missing or ambiguous');
  return selected[0];
}
function sourceSnapshot(ctx, ref) {
  if (!ownKeys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'questionSha256']) ||
      ref.path !== `archive/exams/${ctx.request.sourceArchiveFile}` || !SHA1.test(ref.gitBlobSha1 || '') ||
      !SHA256.test(ref.sha256 || '') || !SHA256.test(ref.questionSha256 || '')) fail('exact same-path source snapshot required');
  const file = gitFile(ctx, ref.commit, ref.path);
  if (file.gitBlobSha1 !== ref.gitBlobSha1 || file.sha256 !== ref.sha256) fail('source snapshot Git/blob/SHA mismatch');
  const key = `renderer-source-bank:${file.gitBlobSha1}`;
  if (!ctx.cache.has(key)) ctx.cache.set(key, ctx.bankFromBytes(file.bytes));
  const bank = ctx.cache.get(key), question = bank[ctx.patch.sourceOrdinal - 1];
  if (bank.length !== ctx.request.expectedQuestionCount || !question || sha(stable(question)) !== ref.questionSha256)
    fail('source snapshot denominator or question mismatch');
  return { ref, file, bank, question };
}
function sameSource(ref, snapshot, withQuestion = false) {
  return ref && ref.commit === snapshot.ref.commit && ref.path === snapshot.ref.path &&
    ref.gitBlobSha1 === snapshot.ref.gitBlobSha1 && ref.sha256 === snapshot.ref.sha256 &&
    (!withQuestion || ref.questionSha256 === snapshot.ref.questionSha256);
}
function nativeRefMatches(ctx, ref) {
  return ref && ref.commit === ctx.native.spec.reviewCommit && ref.path === ctx.native.spec.reviewPath &&
    ref.sha256 === ctx.native.spec.reviewRef.sha256;
}
function references(ctx, question) {
  const refs = new Set();
  const add = value => {
    if (typeof value !== 'string' || !/^(?:archive\/)?assets\//.test(value) || /[?#]/.test(value)) fail('unsupported renderer reference');
    const relative = value.startsWith('archive/') ? value : `archive/${value}`;
    safePath(ctx.root, relative); refs.add(relative);
  };
  const walk = value => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) { value.forEach(walk); return; }
    if (typeof value === 'string') { add(value); return; }
    fail('unsupported renderer object');
  };
  for (const key of ['image', 'images', 'solutionImage', 'solutionImages']) walk(question[key]);
  if (question.figureSvg || question.solutionFigureSvg) fail('inline SVG is outside the renderer continuity contract');
  const html = value => {
    if (typeof value === 'string') {
      for (const m of value.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)) if (!m[1].startsWith('#')) add(m[1]);
      if (/url\s*\(/i.test(value)) fail('unsupported inline renderer URL');
    } else if (Array.isArray(value)) value.forEach(html);
    else if (value && typeof value === 'object') Object.values(value).forEach(html);
  };
  html(ctx.studentPayload(question));
  return [...refs].sort();
}
function normalizedAssets(rows) {
  if (!Array.isArray(rows) || new Set(rows.map(r => r.path)).size !== rows.length) fail('asset inventory missing or duplicated');
  return rows.map(r => ({ path: r.path, commit: r.commit,
    gitBlobSha1: r.gitBlobSha1 ?? r.gitBlobSha, sha256: r.sha256 ?? r.rawSha256,
    visuallyInspected: r.visuallyInspected })).sort((a, b) => a.path.localeCompare(b.path));
}
function verifyAssets(ctx, rows, snapshot, { live = false, alsoCommit } = {}) {
  const assets = normalizedAssets(rows);
  if (!equal(assets.map(r => r.path).sort(), references(ctx, snapshot.question))) fail('asset inventory is incomplete or excessive');
  return assets.map(r => {
    if (!SHA1.test(r.gitBlobSha1 || '') || !SHA256.test(r.sha256 || '')) fail('exact asset hashes required');
    const file = gitFile(ctx, snapshot.ref.commit, r.path);
    if (file.gitBlobSha1 !== r.gitBlobSha1 || file.sha256 !== r.sha256) fail('asset snapshot Git/blob/SHA mismatch');
    if (r.commit && gitFile(ctx, r.commit, r.path).sha256 !== r.sha256) fail('independently inspected asset commit mismatch');
    if (alsoCommit && gitFile(ctx, alsoCommit, r.path).sha256 !== r.sha256) fail('native asset changed before the inspected renderer transition');
    if (live) {
      const full = safePath(ctx.root, r.path);
      if (!fs.existsSync(full) || sha(fs.readFileSync(full)) !== r.sha256) fail('live renderer bytes changed after independent review');
    }
    if (/\.svg$/i.test(r.path)) {
      const svg = file.bytes.toString('utf8'), dependencies = [
        ...[...svg.matchAll(/(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1]),
        ...[...svg.matchAll(/url\s*\(\s*["']?([^\s)"']+)["']?\s*\)/gi)].map(m => m[1]),
      ];
      if (dependencies.some(p => !p.startsWith('#') && !/^data:image\/[a-z0-9.+-]+;base64,/i.test(p)))
        fail('unsupported SVG renderer dependency');
    }
    return { path: r.path, gitBlobSha1: r.gitBlobSha1, sha256: r.sha256 };
  });
}

// Read the actual independently authored document, not a caller's normalized PASS flag.
function independentWitness(ctx, ref, prefigure, current, nativeSource, document) {
  const doc = document || boundDocument(ctx, ref), uid = ctx.patch.questionUid, ordinal = ctx.patch.sourceOrdinal;
  if (!text(doc.reviewer) || doc.reviewer === ctx.native.reviewer) fail('independent reviewer required');
  const nativeQuestion = nativeSource.question, selectedFields = ['content', 'choices', 'answer', 'solution', 'id',
    'level', 'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility'];
  let beforeAssets, currentAssets, finding, correctionInput, transitionContract, baseline = nativeSource;
  if (doc.schemaVersion === RENDERER_REVIEW_V2) {
    const row = uniqueRow(doc.rows, uid, ordinal); baseline = prefigure;
    const delta = changed(prefigure.question, current.question).sort();
    if (!ownKeys(doc, ['schemaVersion', 'scope', 'reviewer', 'decision', 'nativeReviewCommit', 'prefigureCommit',
        'currentCommit', 'counts', 'rows']) || doc.scope !== 'EXACT_RENDERER_METADATA_AND_TWO_IMAGE_CONTAINERS' ||
        doc.decision !== 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION' ||
        doc.nativeReviewCommit !== ctx.native.spec.reviewCommit || doc.prefigureCommit !== prefigure.ref.commit ||
        doc.currentCommit !== current.ref.commit || !ownKeys(doc.counts, ['selected', 'newFullMathApprovals',
          'newMetadataApprovals', 'newDifficultyApprovals', 'newReviewPassCount']) ||
        doc.counts.selected !== doc.rows.length || new Set(doc.rows.map(r => r.questionUid)).size !== doc.rows.length ||
        doc.counts.newFullMathApprovals !== 0 || doc.counts.newMetadataApprovals !== 0 ||
        doc.counts.newDifficultyApprovals !== 0 || doc.counts.newReviewPassCount !== 0 ||
        !ownKeys(row, ['questionUid', 'sourceOrdinal', 'decision', 'visualInspectionPerformed', 'nativeReviewRef',
          'nativeItemSha256', 'nativeSourceRef', 'prefigureSourceRef', 'currentSourceRef', 'changedRendererFields',
          'fieldDeltaHashes', 'contentTransition', 'nonRendererFieldChanges', 'mathematicalStemBytesUnchanged',
          'choicesAnswerSolutionDifficultyUnchanged', 'assets', 'visualEvidence', 'observed']) ||
        row.decision !== 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION' || row.visualInspectionPerformed !== true ||
        !nativeRefMatches(ctx, row.nativeReviewRef) || row.nativeItemSha256 !== sha(stable(ctx.row)) ||
        !sameSource(row.nativeSourceRef, nativeSource, true) || !sameSource(row.prefigureSourceRef, prefigure, true) ||
        !sameSource(row.currentSourceRef, current, true) || !equal(row.changedRendererFields, delta) ||
        delta.some(k => !V2_FIGURE_FIELDS.has(k)) || !equal(row.nonRendererFieldChanges, []) ||
        row.mathematicalStemBytesUnchanged !== true || row.choicesAnswerSolutionDifficultyUnchanged !== true ||
        !equal(row.fieldDeltaHashes, delta.map(field => ({ field, beforeSha256: fieldDigest(prefigure.question, field),
          afterSha256: fieldDigest(current.question, field) }))) ||
        selectedFields.filter(k => k !== 'content').some(k => !equal(prefigure.question[k], current.question[k])))
      fail('v2 independent renderer review binding mismatch');
    // These two new fields were outside the older student-payload projection.
    // Bind their actual source properties explicitly at every replay as well.
    for (const field of ['imageAlt', 'imageSize']) {
      if (fieldDigest(prefigure.question, field) !== fieldDigest(nativeQuestion, field) ||
          fieldDigest(ctx.question, field) !== fieldDigest(current.question, field))
        fail('v2 live or prefigure image metadata differs from its inspected snapshot');
    }
    if (delta.includes('imageAlt') && (typeof current.question.imageAlt !== 'string' || /[<>\x00-\x1f]/.test(current.question.imageAlt)))
      fail('v2 inspected image alternative must be plain text');
    if (delta.includes('imageSize') && (typeof current.question.imageSize !== 'string' || !/^[a-z0-9_-]{1,32}$/.test(current.question.imageSize)))
      fail('v2 inspected image size must be a display token');
    const content = verifyV2ContentTransition(ctx, row.contentTransition, prefigure.question.content, current.question.content);
    if (!ownKeys(row.assets, ['before', 'current']) ||
        ![...(row.assets.before || []), ...(row.assets.current || [])].every(a => a.visuallyInspected === true) ||
        !ownKeys(row.visualEvidence, ['contactSha256', 'renderedAssetCount']) ||
        !SHA256.test(row.visualEvidence.contactSha256 || '') ||
        !Number.isInteger(row.visualEvidence.renderedAssetCount) || row.visualEvidence.renderedAssetCount < 1 ||
        row.visualEvidence.renderedAssetCount !== new Set([...row.assets.before, ...row.assets.current].map(a => a.sha256)).size)
      fail('v2 complete direct visual inspection inventory required');
    beforeAssets = row.assets.before; currentAssets = row.assets.current; finding = row.observed;
    transitionContract = { schemaVersion: RENDERER_REVIEW_V2, scope: doc.scope,
      independentRowSha256: sha(stable(row)), contentTransition: content };
  } else if (doc.schemaVersion === 'archive-independent-narrow-renderer-review-v1') {
    const row = uniqueRow(doc.rows, uid, ordinal);
    if (doc.status !== 'PASS_NARROW_CURRENT_RENDERER_REVIEW' || doc.currentSourceCommit !== current.ref.commit ||
        doc.nativeReviewCommit !== ctx.native.spec.reviewCommit || doc.counts?.newFullMathApprovals !== 0 ||
        doc.counts?.newMetadataApprovals !== 0 || doc.counts?.newDifficultyApprovals !== 0 ||
        row.decision !== 'PASS_NARROW_RENDERER_SEMANTIC_PRESERVATION' || row.visualInspectionPerformed !== true ||
        !nativeRefMatches(ctx, row.nativeReviewRef) || row.nativeItemCanonicalSha256 !== sha(stable(ctx.row)) ||
        !sameSource(row.nativeSourceRef, nativeSource) || !sameSource(row.currentSourceRef, current) ||
        row.previousQuestionSha256 !== sha(stable(nativeQuestion)) || row.currentQuestionSha256 !== current.ref.questionSha256 ||
        !Array.isArray(row.unchangedFields) || selectedFields.some(k => !row.unchangedFields.includes(k)))
      fail('independent native renderer review mismatch');
    beforeAssets = row.rendererAssets?.filter(a => a.phase === 'native');
    currentAssets = row.rendererAssets?.filter(a => a.phase === 'current');
    finding = row.observed;
  } else if (doc.schemaVersion === 'archive-independent-current-figure-review-v1') {
    const row = uniqueRow(doc.rows, uid, ordinal, 'ordinal');
    if (doc.decision !== 'PASS_NARROW_FIGURE_SEMANTIC_CONTINUITY' || doc.currentMain !== current.ref.commit ||
        doc.newMetadataApprovals !== 0 || doc.newDifficultyApprovals !== 0 || doc.fullQaClaimed !== false ||
        row.decision !== 'SEMANTICS_PRESERVED_NARROW_FIGURE_REVIEW' || !nativeRefMatches(ctx, row.nativeReviewRef) ||
        !sameSource(row.beforeSourceRef, nativeSource) || !sameSource(row.currentSourceRef, current) ||
        row.beforeQuestionCanonicalSha256 !== sha(stable(nativeQuestion)) || row.currentQuestionCanonicalSha256 !== current.ref.questionSha256 ||
        row.unchangedNonFigureFieldsExceptNativeVerbatimRationale !== true ||
        row.unchangedStemAfterRemovingOnlyImageTags !== true || row.choicesAnswerSolutionAndDifficultyUnchanged !== true)
      fail('independent semantic figure review mismatch');
    for (const field of ['primaryMethod', 'decisiveStep']) {
      const binding = row.nativeRationaleBindings?.[field];
      if (!text(ctx.row[field]) || !equal(prefigure.question[field], ctx.row[field]) ||
          binding?.origin !== 'IMMUTABLE_NATIVE_ITEM_VERBATIM' || binding.valueSha256 !== sha(ctx.row[field]) ||
          binding.newReviewJudgment !== false) fail('independent rationale carry differs from native item');
    }
    beforeAssets = row.assets?.before; currentAssets = row.assets?.current;
    if (![...(beforeAssets || []), ...(currentAssets || [])].every(r => r.visuallyInspected === true)) fail('asset visual inspection missing');
    finding = stable(row.directVisualReview);
  } else if (doc.schemaVersion === 'archive-m3-narrow-current-figure-review-v1') {
    const row = uniqueRow(doc.rows, uid, ordinal, 'ordinal'); baseline = prefigure;
    if (doc.previousCommit !== prefigure.ref.commit || doc.currentCommit !== current.ref.commit ||
        doc.newFullMathematicalQa !== false || doc.newMetadataApprovals !== 0 || doc.newDifficultyJudgments !== 0 ||
        row.status !== 'PASS_NARROW_FIGURE_CONTINUITY' || !sameSource(row.previousSourceRef, prefigure) ||
        !sameSource(row.currentSourceRef, current) || row.previousQuestionStableSha256 !== prefigure.ref.questionSha256 ||
        row.currentQuestionStableSha256 !== current.ref.questionSha256 || !equal(row.nonFigureChanges, []) ||
        row.mathematicalStemUnchanged !== true || !nativeRefMatches(ctx, row.nativeSemanticReviewRef) ||
        row.nativeItemStableSha256 !== sha(stable(ctx.row)) || row.newFullMathematicalQa !== false ||
        row.newReviewPassCount !== 0 || row.newMetadataApprovals !== 0 || row.newDifficultyJudgments !== 0)
      fail('independent prefigure renderer review mismatch');
    beforeAssets = row.assets?.filter(a => a.commit === ctx.native.spec.reviewCommit);
    currentAssets = row.assets?.filter(a => a.commit === current.ref.commit);
    if (![...(beforeAssets || []), ...(currentAssets || [])].every(r => r.visuallyInspected === true)) fail('asset visual inspection missing');
    finding = row.finding;
  } else if (doc.schemaVersion === 'archive-narrow-solution-renderer-correction-independent-review-v1') {
    if (doc.decision !== 'APPROVE_EXACT_RENDERER_CORRECTION_AND_ALT_ONLY' || doc.questionUid !== uid ||
        doc.sourceOrdinal !== ordinal || doc.proposedSourceRef?.path !== current.ref.path ||
        doc.proposedSourceRef.gitBlobSha1 !== current.ref.gitBlobSha1 || doc.proposedSourceRef.sha256 !== current.ref.sha256 ||
        doc.afterQuestionStableSha256 !== current.ref.questionSha256 || doc.metadataApprovalsAdded !== 0 ||
        doc.difficultyJudgmentsAdded !== 0 || doc.fullMathematicalQa !== false || doc.newReviewPassCount !== 0 ||
        doc.allOtherSvgBytesUnchanged !== true || !Array.isArray(doc.changedSourceFields) ||
        !equal([...doc.changedSourceFields].sort(), ['solutionImage', 'solutionImageAlt']) ||
        doc.sourceQuestionCount !== current.bank.length || doc.unselectedQuestionsUnchanged !== current.bank.length - 1)
      fail('independent corrective renderer review mismatch');
    const before = sourceSnapshot(ctx, { ...doc.beforeSourceRef, questionSha256: doc.beforeQuestionStableSha256 });
    if (!equal(changed(before.question, current.question).sort(), ['solutionImage', 'solutionImageAlt']) ||
        before.bank.some((q, i) => i !== ordinal - 1 && !equal(q, current.bank[i]))) fail('renderer correction changed another source value');
    const oldAsset = doc.assetBefore, newAsset = doc.assetAfter;
    if (oldAsset?.path !== `archive/${before.question.solutionImage}` || newAsset?.path !== `archive/${current.question.solutionImage}` ||
        before.question.solutionImageAlt !== doc.descriptionBefore || current.question.solutionImageAlt !== doc.descriptionAfter ||
        !text(doc.descriptionAfter) || !Array.isArray(doc.exactRemovedNodes) || !doc.exactRemovedNodes.length ||
        new Set(doc.exactRemovedNodes).size !== doc.exactRemovedNodes.length ||
        doc.exactRemovedNodes.some(n => typeof n !== 'string' || !/^<line\s[^<>]+\/>$/.test(n))) fail('corrective renderer exact edit inventory mismatch');
    const oldFile = gitFile(ctx, before.ref.commit, oldAsset.path), newFile = gitFile(ctx, current.ref.commit, newAsset.path);
    if (oldFile.gitBlobSha1 !== oldAsset.gitBlobSha1 || oldFile.sha256 !== oldAsset.sha256 ||
        newFile.gitBlobSha1 !== newAsset.gitBlobSha1 || newFile.sha256 !== newAsset.sha256) fail('corrective renderer asset hashes mismatch');
    let transformed = oldFile.bytes.toString('utf8');
    for (const node of doc.exactRemovedNodes) {
      if (transformed.split(node).length !== 2) fail('corrective renderer removed node is not exact and unique');
      transformed = transformed.replace(node, '');
    }
    const beforeDesc = `<desc id="desc">${doc.descriptionBefore}</desc>`, afterDesc = `<desc id="desc">${doc.descriptionAfter}</desc>`;
    if (transformed.split(beforeDesc).length !== 2 || transformed.replace(beforeDesc, afterDesc) !== newFile.bytes.toString('utf8'))
      fail('renderer correction is not exactly the inspected node/description delta');
    beforeAssets = doc.rendererInputs?.filter(a => a.phase === 'native');
    const inspectedCurrent = doc.rendererInputs?.filter(a => a.phase === 'current');
    if (![...(beforeAssets || []), ...(inspectedCurrent || [])].every(r => r.visuallyInspected === true)) fail('corrective renderer visual inspection missing');
    const inspectedAssets = verifyAssets(ctx, inspectedCurrent, before);
    // This is the exact inspected input to the correction, not an alternative
    // semantic authority. A later AutoMeta cursor may point at this snapshot.
    correctionInput = { schemaVersion: 'archive-inspected-renderer-correction-input-v1',
      scope: 'CORRECTION_INPUT_ONLY', sourceRef: before.ref,
      studentPayloadSha256: sha(stable(ctx.studentPayload(before.question))), rendererAssets: inspectedAssets };
    currentAssets = inspectedCurrent.filter(a => a.path !== oldAsset.path).concat([{ ...newAsset, commit: current.ref.commit, visuallyInspected: true }]);
    finding = doc.visualFinding;
  } else fail('unsupported independently authored renderer review schema');
  if (!text(finding)) fail('independent visual finding missing');
  return { reviewer: doc.reviewer, independentReviewRef: ref, findingSha256: sha(finding),
    beforeAssets: verifyAssets(ctx, beforeAssets, baseline, { alsoCommit: ctx.native.spec.reviewCommit }),
    currentAssets: verifyAssets(ctx, currentAssets, current, { live: true }),
    ...(transitionContract ? { transitionContract } : {}),
    ...(correctionInput ? { independentlyReviewedCorrectionInput: correctionInput } : {}) };
}

export function validateReviewedCurrentRendererContinuity(args) {
  const ctx = { ...args, spec: args.patch.sourceReview?.rendererProof, cache: args.cache || new Map() };
  const spec = ctx.spec;
  if (!ownKeys(spec, ['schemaVersion', 'reviewCommit', 'reviewRef']) ||
      spec.schemaVersion !== 'archive-reviewed-current-renderer-continuity-v1' || !SHA1.test(spec.reviewCommit || '') ||
      ctx.request.scope !== 'PARTIAL_UIDS' || ctx.request.approval?.type !== 'FINAL_QA' || ctx.request.registrationMode ||
      ctx.request.approval.sourceRebind || ctx.patch.rebind !== undefined || ctx.patch.sourceReview.proposalFinalization !== undefined ||
      ctx.native.review.schemaVersion !== 'm3-s2-complete-semantic-review-v1' || ctx.native.review.reviewScope !== undefined)
    fail('exclusive native-semantic and narrow-renderer scope required');
  const doc = boundDocument(ctx, spec.reviewRef);
  if (!ownKeys(doc, ['schemaVersion', 'scope', 'sourceArchiveFile', 'expectedQuestionCount', 'selectedUidCount',
    'newFullMathematicalQa', 'newReviewPassCount', 'newMetadataApprovals', 'newDifficultyJudgments', 'items']) ||
      doc.schemaVersion !== 'archive-reviewed-renderer-continuity-evidence-v1' ||
      doc.scope !== 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER' ||
      doc.sourceArchiveFile !== ctx.request.sourceArchiveFile || doc.expectedQuestionCount !== ctx.request.expectedQuestionCount ||
      doc.newFullMathematicalQa !== false || doc.newReviewPassCount !== 0 || doc.newMetadataApprovals !== 0 || doc.newDifficultyJudgments !== 0 ||
      !Array.isArray(doc.items) || doc.selectedUidCount !== doc.items.length || doc.items.length < 1 ||
      new Set(doc.items.map(r => r.questionUid)).size !== doc.items.length || new Set(doc.items.map(r => r.sourceOrdinal)).size !== doc.items.length)
    fail('exact narrow renderer evidence inventory required');
  const item = uniqueRow(doc.items, ctx.patch.questionUid, ctx.patch.sourceOrdinal);
  if (!ownKeys(item, ['questionUid', 'sourceOrdinal', 'nativeReviewRef', 'nativeItemSha256', 'prefigureSourceRef',
      'currentSourceRef', 'independentReviewRef']) || !nativeRefMatches(ctx, item.nativeReviewRef) || item.nativeItemSha256 !== sha(stable(ctx.row)))
    fail('native semantic item binding mismatch');
  const prefigure = sourceSnapshot(ctx, item.prefigureSourceRef), current = sourceSnapshot(ctx, item.currentSourceRef);
  const nativeQuestion = ctx.native.committedBank[ctx.patch.sourceOrdinal - 1];
  const nativeFile = gitFile(ctx, ctx.native.spec.reviewCommit, current.ref.path);
  const nativeSource = { ref: { commit: ctx.native.spec.reviewCommit, path: current.ref.path,
    gitBlobSha1: nativeFile.gitBlobSha1, sha256: nativeFile.sha256, questionSha256: sha(stable(nativeQuestion)) },
    file: nativeFile, question: nativeQuestion, bank: ctx.native.committedBank };
  if (!equal(ctx.studentPayload(prefigure.question), ctx.studentPayload(nativeQuestion)) ||
      !equal(ctx.studentPayload(prefigure.question), ctx.studentPayload(ctx.native.reviewedBank[ctx.patch.sourceOrdinal - 1])))
    fail('prefigure source differs from the immutable native student payload');
  const delta = changed(prefigure.question, current.question);
  const independentDocument = boundDocument(ctx, item.independentReviewRef);
  const v2 = independentDocument.schemaVersion === RENDERER_REVIEW_V2;
  if (!delta.length || delta.some(k => !(v2 ? V2_FIGURE_FIELDS : FIGURE_FIELDS).has(k)) ||
      (!v2 && !equal(imagePathsOnly(prefigure.question.content), imagePathsOnly(current.question.content))))
    fail('prefigure/current change is outside the inspected renderer fields');
  if (!equal(ctx.studentPayload(ctx.question), ctx.studentPayload(current.question))) fail('live student payload differs from independently reviewed current source');
  const independent = independentWitness(ctx, item.independentReviewRef, prefigure, current, nativeSource, independentDocument);
  // All native renderer bytes must also remain identical up to the prefigure snapshot.
  for (const asset of independent.beforeAssets) {
    const file = gitFile(ctx, prefigure.ref.commit, asset.path);
    if (file.sha256 !== asset.sha256) fail('prefigure asset bytes differ from immutable native review');
  }
  return { ...spec, scope: 'NATIVE_SEMANTIC_REUSE_WITH_INDEPENDENT_CURRENT_RENDERER',
    questionUid: ctx.patch.questionUid, sourceOrdinal: ctx.patch.sourceOrdinal,
    nativeReviewRef: item.nativeReviewRef, nativeItemSha256: item.nativeItemSha256,
    prefigureSourceRef: prefigure.ref, currentSourceRef: current.ref, changedRendererFields: delta.sort(),
    nativeStudentPayloadSha256: sha(stable(ctx.studentPayload(nativeQuestion))),
    currentStudentPayloadSha256: sha(stable(ctx.studentPayload(ctx.question))), ...independent,
    newMathematicalQa: false, newMetadataApprovals: 0, newDifficultyJudgments: 0 };
}
