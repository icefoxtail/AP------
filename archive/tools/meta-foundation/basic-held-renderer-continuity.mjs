// A separately reviewed problem display may continue an existing BASIC + type
// HOLD. The original native/HOLD validator still validates its original source.
// This helper validates only the explicit four-field display delta and assets.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { questionAssetReferences } from '../archive-content-inputs.mjs';

export const BASIC_HELD_RENDERER_SCHEMA = 'archive-basic-held-renderer-continuity-v1';
export const BASIC_HELD_RENDERER_EVIDENCE_SCHEMA = 'archive-basic-held-renderer-continuity-evidence-v1';
const EVIDENCE = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const UI_PATH = 'docs/operations/m2-q22-basic-parent-continuity-20261116/';
const DISPLAY = ['image', 'imageAlt', 'imageSize', 'layoutTag'];
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === 'object' && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const eq = (a, b) => stable(a) === stable(b);
const sha = raw => crypto.createHash('sha256').update(raw).digest('hex');
const hash = value => sha(stable(value) ?? 'undefined');
const blob = raw => crypto.createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex');
const fail = message => { throw Error(`BASIC_HELD_RENDERER: ${message}`); };
const text = value => typeof value === 'string' && value.trim().length > 0;
const exact = (v, keys) => v && typeof v === 'object' && !Array.isArray(v) && eq(Object.keys(v).sort(), [...keys].sort());
const select = q => Object.fromEntries(['content', 'question', 'choices'].filter(k => Object.hasOwn(q, k)).map(k => [k, q[k]]));
function safe(root, relative) {
  if (!text(relative) || path.isAbsolute(relative) || /[\\\x00-\x1f\x7f]/u.test(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) fail('unsafe path');
  const full = path.resolve(root, relative);
  for (let p = full; p !== path.resolve(root); p = path.dirname(p))
    if (fs.existsSync(p) && fs.lstatSync(p).isSymbolicLink()) fail('symlink input');
  return full;
}
function immutable(root, commit, relative) {
  safe(root, relative);
  if (!/^[a-f0-9]{40}$/u.test(commit || '')) fail('immutable commit required');
  const run = args => execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
    maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  let raw, entry;
  try {
    if (run(['rev-parse', '--verify', `${commit}^{commit}`]).toString().trim() !== commit) fail('immutable commit mismatch');
    entry = run(['ls-tree', '-z', commit, '--', relative]).toString();
    raw = run(['show', `${commit}:${relative}`]);
  } catch { fail(`immutable input unavailable: ${relative}`); }
  if (!entry.startsWith('100644 blob ') || entry.split('\0').filter(Boolean).length !== 1 ||
      entry.slice(entry.indexOf('\t') + 1, -1) !== relative || entry.split('\t')[0].split(' ')[2] !== blob(raw)) fail('immutable regular file required');
  return raw;
}
function parseBank(raw) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(raw.toString('utf8'), context, { timeout: 5000 });
  const rows = context.window.questionBank || context.window.questions;
  if (!Array.isArray(rows)) fail('source bank missing');
  return JSON.parse(JSON.stringify(rows));
}
function document(root, request, item, commit, ref) {
  if (!exact(ref, ['path', 'sha256']) || !String(ref.path).startsWith(EVIDENCE) || !/^[a-f0-9]{64}$/u.test(ref.sha256 || '') ||
      [request.approval.evidenceRefs, item.evidenceRefs].some(refs => !Array.isArray(refs) || refs.filter(r => eq(r, ref)).length !== 1)) fail('evidence must bind approval and selected item');
  const raw = fs.readFileSync(safe(root, ref.path));
  if (sha(raw) !== ref.sha256 || !raw.equals(immutable(root, commit, ref.path))) fail('immutable evidence bytes differ');
  return JSON.parse(raw);
}
function source(root, ref, expectedPath, count, ordinal) {
  if (!exact(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'questionSha256']) || ref.path !== expectedPath) fail('same-source snapshot required');
  const raw = immutable(root, ref.commit, ref.path), rows = parseBank(raw), question = rows[ordinal - 1];
  if (rows.length !== count || blob(raw) !== ref.gitBlobSha1 || sha(raw) !== ref.sha256 || hash(question) !== ref.questionSha256) fail('source snapshot binding differs');
  return { raw, question };
}
function assetPaths(question) {
  const refs = new Set();
  const add = value => {
    if (!text(value) || !/^(?:archive\/)?assets\//u.test(value) || /[?#]/u.test(value)) fail('unsupported asset reference');
    refs.add(value.startsWith('archive/') ? value : `archive/${value}`);
  };
  const visit = (value, key = '') => {
    if (Array.isArray(value)) { value.forEach(v => visit(v, key)); return; }
    if (value && typeof value === 'object') { Object.entries(value).forEach(([k, v]) => visit(v, k)); return; }
    if (typeof value !== 'string') return;
    if (['image', 'images', 'solutionImage', 'solutionImages'].includes(key) && value) add(value);
    if (['figureSvg', 'solutionFigureSvg'].includes(key) && value || /<(?:svg|object|iframe|image)\b|srcset\s*=|url\s*\(/iu.test(value)) fail('unsupported inline renderer');
    for (const tag of value.matchAll(/<img\b[^>]*>/giu)) {
      const attrs = [...tag[0].matchAll(/\bsrc\s*=\s*(["'])(.*?)\1/giu)];
      if (attrs.length !== 1 || (tag[0].match(/\bsrc\s*=/giu) || []).length !== 1) fail('malformed renderer reference');
      add(attrs[0][2]);
    }
  };
  visit(question); questionAssetReferences(question).forEach(add);
  return [...refs].sort();
}
function assets(root, commit, question, declared) {
  const expected = assetPaths(question);
  if (!Array.isArray(declared) || !eq(declared.map(r => r.path).sort(), expected) || new Set(expected).size !== declared.length) fail('complete asset inventory required');
  for (const ref of declared) {
    if (!exact(ref, ['path', 'gitBlobSha1', 'sha256'])) fail('asset reference shape');
    const original = immutable(root, commit, ref.path), current = fs.readFileSync(safe(root, ref.path));
    if (blob(original) !== ref.gitBlobSha1 || sha(original) !== ref.sha256 || !original.equals(current)) fail('current or immutable asset bytes differ');
  }
  return structuredClone(declared);
}
function staticSvg(raw) {
  const svg = raw.toString('utf8'), attrs = [...svg.matchAll(/\b(?:src|(?:xlink:)?href)\s*=\s*(["'])(.*?)\1(?=\s|\/?>)/giu)];
  if (raw.length > 8 * 1024 * 1024 || !/<svg\b/iu.test(svg) ||
      /<!DOCTYPE|<!ENTITY|<script\b|<foreignObject\b|\bon\w+\s*=|@import|\bxml:base\s*=|\\/iu.test(svg) ||
      (svg.match(/\b(?:src|(?:xlink:)?href)\s*=/giu) || []).length !== attrs.length ||
      attrs.some(m => !/^#[A-Za-z0-9_.:-]+$/u.test(m[2])) ||
      /url\s*\(/iu.test(svg.replace(/url\(\s*["']?#[A-Za-z0-9_.:-]+["']?\s*\)/giu, ''))) fail('unsupported SVG dependency');
}

// Render engine files may change after the capture; only their captured Git bytes are authenticated (user decision 2026-11-18).
const isRenderEngineFile = p => p === "archive/engine.html" || p === "archive/mixed_engine.html" || p === "apmath/wrong_print_engine.html" ||
  /^archive\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) || /^archive\/(?:css|js)\/[A-Za-z0-9_.-]+\.(?:js|css)$/.test(p) ||
  /^apmath\/(?:css|js)\/student-navigation\.(?:css|js)$/.test(p);
function uiReference(root, ref, expectedPath, checkout, live = false) {
  if (!exact(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes']) || ref.path !== expectedPath ||
      (checkout && ref.commit !== checkout) || !Number.isSafeInteger(ref.bytes) || ref.bytes <= 0) fail('UI immutable reference shape/checkout differs');
  const raw = immutable(root, ref.commit, ref.path);
  if (raw.length !== ref.bytes || sha(raw) !== ref.sha256 || blob(raw) !== ref.gitBlobSha1 ||
      (live && !raw.equals(fs.readFileSync(safe(root, ref.path))))) fail('UI immutable/current reference bytes differ');
  return raw;
}
function studentUi(root, request, item, current, identity, evidence, afterImage) {
  const spec = evidence.studentUi;
  if (!exact(spec, ['technicalRef', 'independentRef']) || spec.technicalRef?.commit !== spec.independentRef?.commit) fail('actual UI technical and independent evidence required');
  // These public references are sealed inside the immutable renderer evidence,
  // which is itself listed by exact digest on both approval and selected item.
  // Keep the ordinary BASIC evidenceRefs path restriction unchanged.
  const technical = JSON.parse(uiReference(root, spec.technicalRef, UI_PATH + 'student-ui-technical-v1.json', null, true));
  const independent = JSON.parse(uiReference(root, spec.independentRef, UI_PATH + 'student-ui-independent-v1.json', null, true));
  if (technical.schemaVersion !== 'archive-q22-basic-parent-problem-ui-preview-v1' || technical.status !== 'TECHNICAL_PASS_VISUAL_REVIEW_PENDING' ||
      technical.executionOwner !== 'GITHUB_ACTIONS_SUPPORTED_CHROME' || technical.expectedLogicalCases !== 2 || technical.completedLogicalCases !== 2 ||
      technical.expectedBankCount !== request.expectedQuestionCount || technical.mode !== 'exam' || technical.studentReview !== true ||
      technical.screenshotsScope !== 'SELECTED_PROBLEM_ORIGINAL_SCROLL_TILES_ONLY' || technical.problemOnlyScreenshots !== true ||
      technical.sourceOverlay !== false || technical.solutionsOpened !== false || technical.newFullMathematicalQa !== false ||
      technical.parentRestorationApproval !== false || technical.releaseGate !== 'PENDING_INDEPENDENT_VISUAL_REVIEW' ||
      !eq(technical.failures, []) || ['sourceOverlayCount', 'sourceWrites', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReviewPassCount', 'newFourSlotApprovals'].some(k => technical[k] !== 0) ||
      technical.checkout?.actualCheckoutCommit !== technical.checkoutCommit || technical.checkout?.expectedCheckoutCommit !== technical.checkoutCommit) fail('actual UI technical scope/status differs');
  const viewports = [{ name: 'desktop', width: 1365, height: 1000 }, { name: 'mobile', width: 390, height: 844 }];
  if (!Array.isArray(technical.items) || technical.items.length !== 1 || !Array.isArray(technical.results) || technical.results.length !== 2 ||
      !eq(technical.results.map(r => r.viewport), viewports)) fail('UI exact one UID and two viewports required');
  const target = technical.items[0], sourcePath = `archive/exams/${request.sourceArchiveFile}`;
  if (target.key !== 'Q22' || target.questionUid !== item.questionUid || target.sourceOrdinal !== item.sourceOrdinal ||
      target.problemPayloadSha256 !== hash({ content: current.content ?? current.question, choices: current.choices ?? [] }) ||
      target.presentationSha256 !== hash({ imageAlt: current.imageAlt, imageSize: current.imageSize, layoutTag: current.layoutTag })) fail('UI exact current problem/presentation differs');
  uiReference(root, target.sourceRef, sourcePath, technical.checkoutCommit, true);
  uiReference(root, target.assetRef, afterImage.path, technical.checkoutCommit, true);
  if (target.sourceRef.gitBlobSha1 !== request.expectedSourceBlobSha1 || target.assetRef.sha256 !== afterImage.sha256) fail('UI current source/asset binding differs');
  const ids = JSON.parse(uiReference(root, technical.identityRef, 'archive/data/question_identity_map.json', technical.checkoutCommit));
  const selectedIds = (ids.records || []).filter(r => r.questionUid === item.questionUid ||
    (r.sourceArchiveFile === request.sourceArchiveFile && r.sourceOrdinal === item.sourceOrdinal));
  const protectedIdentity = row => Object.fromEntries(Object.entries(row || {}).filter(([k]) => k !== 'sourceFingerprint'));
  if (selectedIds.length !== 1 || !eq(protectedIdentity(selectedIds[0]), protectedIdentity(identity))) fail('UI selected identity differs');
  const manifest = JSON.parse(uiReference(root, technical.manifestRef, 'tests/fixtures/archive-q22-basic-parent-problem-ui.json', technical.checkoutCommit));
  if (!exact(manifest, ['schemaVersion', 'scope', 'expectedCases', 'viewports', 'items']) || manifest.schemaVersion !== 'archive-q22-basic-parent-problem-ui-manifest-v1' ||
      manifest.scope !== 'EXACT_Q22_PROBLEM_DISPLAY_ONLY_NO_PARENT_APPROVAL' || manifest.expectedCases !== 2 || !eq(manifest.viewports, viewports) ||
      !eq(manifest.items, [{ key: 'Q22', questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
        sourcePath, sourceGitBlobSha1: target.sourceRef.gitBlobSha1, sourceSha256: target.sourceRef.sha256,
        expectedBankCount: request.expectedQuestionCount, problemPayloadSha256: target.problemPayloadSha256, presentationSha256: target.presentationSha256,
        assetPath: afterImage.path, assetGitBlobSha1: afterImage.gitBlobSha1, assetSha256: afterImage.sha256 }])) fail('UI checkout manifest differs');
  uiReference(root, technical.checkerRef, 'tools/check-q22-basic-parent-problem-browser.cjs', technical.checkoutCommit);
  uiReference(root, technical.captureHelperRef, 'tools/check-reviewed-problem-renderer-browser.cjs', technical.checkoutCommit);
  // The observed UI renderer must be the renderer shipped with this request.
  // Mutable metadata and derived indexes are instead bound by the exact selected
  // native/HOLD and source checks; unrelated global rows may change legitimately.
  if (!Array.isArray(technical.servedFiles) || new Set(technical.servedFiles.map(r => r.path)).size !== technical.servedFiles.length ||
      technical.servedFiles.filter(r => r.path === 'archive/engine.html').length !== 1) fail('UI renderer code inventory differs');
  const codeRefs = technical.servedFiles.filter(r => !r.path.startsWith('archive/data/') && !r.path.startsWith('archive/exams/') && /\.(?:html|css|js|mjs|cjs|woff2?|ttf)$/u.test(r.path));
  for (const ref of codeRefs) uiReference(root, ref, ref.path, technical.checkoutCommit, !isRenderEngineFile(ref.path));
  const screenshots = [];
  for (const [index, result] of technical.results.entries()) {
    const capture = result.capture, state = result.technical, height = capture?.content?.height;
    if (result.status !== 'PASS' || result.visualReview !== 'PENDING' || result.key !== 'Q22' || result.questionUid !== item.questionUid || result.sourceOrdinal !== item.sourceOrdinal ||
        !eq(result.sourceRef, target.sourceRef) || !eq(result.assetRef, target.assetRef) ||
        !eq(result.pageErrors, []) || !eq(result.requestFailures, []) || !eq(result.externalRequests, []) ||
        state?.mode !== 'exam' || state.questions !== request.expectedQuestionCount || !(state.pages > 0) || state.readiness !== 'RENDER_READY' ||
        state.imagesComplete !== true || state.mathErrors !== 0 || state.unrenderedMath !== 0 || state.mathJaxSource !== 'local' || state.solutionNodes !== 0 ||
        state.fontReadiness?.status !== 'loaded' || result.geometry?.imageInsideQuestion !== true ||
        capture?.schemaVersion !== 'archive-problem-scroll-coverage-v1' || capture.method !== 'UNCHANGED_VIEWPORT_ORIGINAL_SCROLL_TILES' ||
        capture.tileLimit !== 8 || capture.overlapCssPixels !== 32 || capture.feedbackIdle !== true || capture.foreignContentHits !== 0 ||
        capture.cssWrites !== 0 || capture.domWrites !== 0 || capture.viewportChanges !== 0 || capture.compositeImageCreated !== false ||
        !Number.isFinite(height) || height <= 0 || !Array.isArray(capture.tiles) || capture.tiles.length < 1 || capture.tiles.length > 8 ||
        capture.tileCount !== capture.tiles.length || !Array.isArray(result.screenshots) || result.screenshots.length !== capture.tiles.length ||
        !eq(capture.coverage, { requiredInterval: [0, height], coveredInterval: [0, height], complete: true })) fail('UI original scroll capture is incomplete or changed');
    let end = 0;
    for (const [i, tile] of capture.tiles.entries()) {
      const span = tile.relativeInterval, screen = result.screenshots[i], clip = tile.clip, viewport = viewports[index];
      if (tile.tileIndex !== i + 1 || !Array.isArray(span) || span.length !== 2 || !span.every(Number.isFinite) ||
          span[0] !== (i ? end - 32 : 0) || span[1] <= span[0] || span[1] > height ||
          tile.feedbackIdle !== true || tile.obstructionsIntersectingClip !== 0 || tile.foreignContentHits !== 0 || !(tile.hitTestSamples > 0) ||
          !/^[a-f0-9]{64}$/u.test(capture.domSha256 || '') || tile.domSha256 !== capture.domSha256 ||
          !clip || ![clip.x, clip.y, clip.width, clip.height].every(Number.isFinite) || clip.x < 0 || clip.y < 0 || clip.width <= 0 ||
          Math.abs(clip.height - (span[1] - span[0])) > 0.001 || clip.x + clip.width > viewport.width + 0.001 || clip.y + clip.height > viewport.height + 0.001 ||
          !exact(screen, ['tileIndex', 'path', 'sha256', 'bytes']) || screen.tileIndex !== tile.tileIndex || screen.path !== tile.filename ||
          screen.path !== `Q22-${viewport.name}-tile-${String(i + 1).padStart(2, '0')}.png` || !/^[a-f0-9]{64}$/u.test(screen.sha256 || '') ||
          !Number.isSafeInteger(screen.bytes) || screen.bytes <= 0) fail('UI original PNG/coverage inventory differs');
      end = span[1]; screenshots.push({ path: screen.path, sha256: screen.sha256, bytes: screen.bytes });
    }
    if (end !== height) fail('UI coverage has a missing final interval');
  }
  if (technical.screenshotArtifactCount !== screenshots.length || !eq(technical.screenshotArtifacts, screenshots) ||
      new Set(screenshots.map(s => s.path)).size !== screenshots.length) fail('UI screenshot artifact inventory differs');
  const independentKeys = ['schemaVersion', 'reviewer', 'role', 'technicalRef', 'checkoutCommit', 'workflowRun', 'artifactId', 'artifactZipSha256',
    'staticReviewRef', 'reviewOrder', 'originalPngsPersonallyInspected', 'logicalCases', 'decision', 'parentRestorationApproval',
    'newMathematicalApprovals', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReview2Approvals', 'holdDisposition', 'requiredNextAction'];
  if (!exact(independent, independentKeys) || independent.schemaVersion !== 'archive-q22-independent-problem-ui-audit-v1' ||
      independent.role !== 'INDEPENDENT_PROBLEM_ONLY_VISUAL_REVIEWER' || !text(independent.reviewer) || independent.reviewer === technical.executionOwner ||
      !eq(independent.technicalRef, { path: spec.technicalRef.path, sha256: spec.technicalRef.sha256 }) || independent.checkoutCommit !== technical.checkoutCommit ||
      !Number.isSafeInteger(independent.workflowRun) || !Number.isSafeInteger(independent.artifactId) || !/^[a-f0-9]{64}$/u.test(independent.artifactZipSha256 || '') ||
      !eq(independent.reviewOrder, ['GIVEN_ONLY_EXPECTED_FROZEN', 'ORIGINAL_IMAGE_EXPECTED_FROZEN', 'CURRENT_STATIC_SVG_REVIEW', 'ACTUAL_DESKTOP_ORIGINAL_TILES', 'ACTUAL_MOBILE_ORIGINAL_TILE']) ||
      !eq(independent.originalPngsPersonallyInspected, screenshots) || !Array.isArray(independent.logicalCases) || independent.logicalCases.length !== 2 ||
      independent.decision !== 'ACCEPTED_PROBLEM_DISPLAY_CONTINUITY_ONLY' || independent.parentRestorationApproval !== false || independent.holdDisposition !== 'UNCHANGED' ||
      independent.requiredNextAction !== 'ORIGINAL_HOLD_REPLAY_AND_TYPED_CONSUMER_PARENT_PRESERVATION' ||
      ['newMathematicalApprovals', 'newMetadataApprovals', 'newDifficultyJudgments', 'newReview2Approvals'].some(k => independent[k] !== 0)) fail('UI independent review authority/scope differs');
  const staticRef = independent.staticReviewRef;
  if (!exact(staticRef, ['path', 'sha256']) || staticRef.path !== 'evidence/root-q22-static-display-review-r1.json' || staticRef.sha256 !== evidence.independentReviewRef.sha256) fail('UI static review reference is not bound');
  const staticRaw = immutable(root, spec.independentRef.commit, staticRef.path);
  if (sha(staticRaw) !== staticRef.sha256 || !staticRaw.equals(fs.readFileSync(safe(root, staticRef.path)))) fail('UI original static review bytes differ');
  for (const [i, observed] of independent.logicalCases.entries()) {
    const result = technical.results[i];
    if (!eq(observed.viewport, result.viewport) || observed.questionUid !== item.questionUid || observed.sourceOrdinal !== item.sourceOrdinal ||
        !eq(observed.sourceRef, target.sourceRef) || !eq(observed.assetRef, target.assetRef) ||
        !eq(observed.screenshotRefs, result.screenshots.map(({ tileIndex, ...ref }) => ref)) || observed.status !== 'ACCEPTED' ||
        ['givenTextLegible', 'bothDiagramsComplete', 'originalGeometryLabelsAndShadedRegionPreserved', 'captureCoverageComplete'].some(k => observed[k] !== true) ||
        ['clippingObserved', 'unrelatedContentObserved', 'solutionObserved'].some(k => observed[k] !== false)) fail('UI independent case observations differ');
  }
  return { technicalRef: structuredClone(spec.technicalRef), independentRef: structuredClone(spec.independentRef),
    staticReviewRef: structuredClone(staticRef), checkoutCommit: technical.checkoutCommit, reviewer: independent.reviewer,
    identityRef: structuredClone(technical.identityRef), sourceRef: structuredClone(target.sourceRef), assetRef: structuredClone(target.assetRef),
    rendererCodeRefs: structuredClone(codeRefs), logicalCases: 2, screenshotInventory: screenshots,
    screenshotVerification: 'IMMUTABLE_TECHNICAL_AND_INDEPENDENT_ORIGINAL_PNG_INVENTORY', actualStudentUi: 'PASS', newMetadataApprovals: 0 };
}

export function prepareBasicHeldRendererContinuity({ root, request, item, current, identity }) {
  const spec = request.approval.sourceReview.rendererContinuity;
  if (!exact(spec, ['schemaVersion', 'reviewCommit', 'reviewPath', 'reviewRef']) || spec.schemaVersion !== BASIC_HELD_RENDERER_SCHEMA ||
      spec.reviewPath !== spec.reviewRef?.path || request.items.length !== 1 || request.approval.type !== 'BASIC_SCOPE_REBIND' ||
      request.approval.metadataReviewed !== true || request.registrationMode !== undefined || request.scope !== undefined ||
      request.registryChanges !== undefined || request.difficultyEvidence !== undefined || request.approval.sourceRebind !== undefined) fail('exclusive held-basic renderer scope required');
  const evidence = document(root, request, item, spec.reviewCommit, spec.reviewRef), sourcePath = `archive/exams/${request.sourceArchiveFile}`;
  const keys = ['schemaVersion', 'scope', 'sourceArchiveFile', 'expectedQuestionCount', 'questionUid', 'sourceOrdinal',
    'nativeReviewRef', 'independentHoldRef', 'beforeSource', 'afterSource', 'changedDisplayFields', 'beforeAssets', 'afterAssets',
    'givenRef', 'givenExpectedRef', 'originalExpectedRef', 'independentReviewRef', 'studentUi', 'newMetadataApprovals', 'newMathematicalQa',
    'newDifficultyJudgments', 'newReview2', 'newFourSlotApprovals', 'sourceWrites', 'assetWrites'];
  if (!exact(evidence, keys) || evidence.schemaVersion !== BASIC_HELD_RENDERER_EVIDENCE_SCHEMA ||
      evidence.scope !== 'EXISTING_BASIC_AND_EXPLICIT_TYPE_HOLD_ONLY' || evidence.sourceArchiveFile !== request.sourceArchiveFile ||
      evidence.expectedQuestionCount !== request.expectedQuestionCount || evidence.questionUid !== item.questionUid || evidence.sourceOrdinal !== item.sourceOrdinal ||
      !eq(evidence.nativeReviewRef, { commit: request.approval.sourceReview.nativeReviewCommit, path: request.approval.sourceReview.nativeReviewPath, sha256: request.approval.sourceReview.nativeReviewRef.sha256 }) ||
      !eq(evidence.independentHoldRef, { commit: request.approval.sourceReview.holdReviewCommit, path: request.approval.sourceReview.holdReviewPath, sha256: request.approval.sourceReview.holdReviewRef.sha256 }) ||
      evidence.newMathematicalQa !== false || evidence.newReview2 !== false ||
      ['newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotApprovals', 'sourceWrites', 'assetWrites'].some(k => evidence[k] !== 0)) fail('evidence authority/scope differs');
  const before = source(root, evidence.beforeSource, sourcePath, request.expectedQuestionCount, item.sourceOrdinal);
  const after = source(root, evidence.afterSource, sourcePath, request.expectedQuestionCount, item.sourceOrdinal);
  const live = fs.readFileSync(safe(root, sourcePath));
  if (!live.equals(after.raw) || !eq(current, after.question) || blob(live) !== request.expectedSourceBlobSha1) fail('current whole-source snapshot differs');
  const changed = Object.keys({ ...before.question, ...current }).filter(k => !eq(before.question[k], current[k])).sort();
  if (!eq(changed, DISPLAY) || !eq(evidence.changedDisplayFields, DISPLAY) ||
      !DISPLAY.every(k => text(current[k])) || !text(before.question.image) || before.question.image === current.image) fail('only the exact four problem display fields may change');
  const beforeAssets = assets(root, evidence.beforeSource.commit, before.question, evidence.beforeAssets);
  const afterAssets = assets(root, evidence.afterSource.commit, current, evidence.afterAssets);
  const problemPath = image => image.startsWith('archive/') ? image : `archive/${image}`;
  const beforeImage = beforeAssets.find(r => r.path === problemPath(before.question.image));
  const afterImage = afterAssets.find(r => r.path === problemPath(current.image));
  if (!beforeImage || !afterImage || !afterImage.path.endsWith('.svg') ||
      !eq(beforeAssets.filter(r => r !== beforeImage), afterAssets.filter(r => r !== afterImage))) fail('non-problem renderer assets must remain exact');
  staticSvg(fs.readFileSync(safe(root, afterImage.path)));
  // Reproduce the already inspected given-only packet directly from its public
  // source snapshot. No question text is accepted or transported as evidence.
  const previousRaw = immutable(root, request.previousSourceCommit, sourcePath);
  const previousQuestion = parseBank(previousRaw)[item.sourceOrdinal - 1];
  const given = { schemaVersion: 'archive-problem-only-given-input-v1', scope: 'PROBLEM_DISPLAY_CONTINUITY_ONLY',
    questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    sourceRef: { commit: request.previousSourceCommit, path: sourcePath, gitBlobSha1: blob(previousRaw), sha256: sha(previousRaw) },
    fields: select(previousQuestion), exclusions: ['answer', 'solution', 'solution assets', 'native judgments', 'review outcomes'],
    instruction: 'Freeze expected observations from this problem text before opening the separate problem-image packet. This packet makes no review decision.' };
  if (!exact(evidence.givenRef, ['schemaVersion', 'path', 'sha256']) ||
      evidence.givenRef.schemaVersion !== 'archive-public-source-derived-given-ref-v1' ||
      evidence.givenRef.path !== 'evidence/m2-q22-problem-only-continuity-r1/given-only.json' ||
      sha(JSON.stringify(given, null, 2) + '\n') !== evidence.givenRef.sha256) fail('public-source given packet derivation differs');
  const expectedGiven = document(root, request, item, spec.reviewCommit, evidence.givenExpectedRef);
  const expectedOriginal = document(root, request, item, spec.reviewCommit, evidence.originalExpectedRef);
  const independent = document(root, request, item, spec.reviewCommit, evidence.independentReviewRef);
  if (given.schemaVersion !== 'archive-problem-only-given-input-v1' || given.scope !== 'PROBLEM_DISPLAY_CONTINUITY_ONLY' ||
      given.questionUid !== item.questionUid || given.sourceOrdinal !== item.sourceOrdinal || !eq(given.fields, select(before.question)) ||
      !eq(given.sourceRef, { commit: request.previousSourceCommit, path: sourcePath, gitBlobSha1: blob(previousRaw), sha256: sha(previousRaw) }) ||
      !eq(select(previousQuestion), given.fields)) fail('given-only source/UID binding differs');
  const exposure = (doc, originalImageSeen) => exact(doc.exposure, ['originalImageSeen', 'currentImageSeen', 'answersOrSolutionsSeen', 'nativeJudgmentsSeen', 'upstreamReviewOutcomeSeen']) &&
    doc.exposure.originalImageSeen === originalImageSeen && doc.exposure.currentImageSeen === false && doc.exposure.answersOrSolutionsSeen === false &&
    doc.exposure.nativeJudgmentsSeen === false && doc.exposure.upstreamReviewOutcomeSeen === false;
  for (const doc of [expectedGiven, expectedOriginal]) if (doc.scope !== 'Q22_PROBLEM_DISPLAY_CONTINUITY_ONLY' ||
      doc.questionUid !== item.questionUid || doc.sourceOrdinal !== item.sourceOrdinal ||
      !eq(doc.givenRef, { path: evidence.givenRef.path, sha256: evidence.givenRef.sha256 }) ||
      doc.reviewer !== independent.reviewer || doc.newApprovals !== 0) fail('independent expected UID/scope differs');
  if (expectedGiven.schemaVersion !== 'archive-problem-only-expected-observations-v1' || expectedGiven.stage !== 'GIVEN_TEXT_FROZEN_BEFORE_ANY_PROBLEM_IMAGE' || !exposure(expectedGiven, false) ||
      expectedOriginal.schemaVersion !== 'archive-problem-only-expected-observations-v2' || expectedOriginal.stage !== 'ORIGINAL_PROBLEM_IMAGE_OBSERVED_CURRENT_IMAGE_UNSEEN' || !exposure(expectedOriginal, true) ||
      expectedOriginal.priorExpectedRef?.sha256 !== evidence.givenExpectedRef.sha256 || expectedOriginal.originalImageRef?.sha256 !== beforeImage.sha256 ||
      expectedOriginal.originalImageRef?.gitBlobSha1 !== beforeImage.gitBlobSha1 || expectedOriginal.originalImageRef?.gitCommit !== request.previousSourceCommit) fail('given-first/original-first exposure binding differs');
  const observed = ['bothOriginalSubpartsPresent', 'unknownAngleRemainsSymbolic', 'allGivenAngleLabelsAtExpectedVerticesAndRays',
    'incenterSegmentsAndPointPreserved', 'circlePointsAndRadiiPreserved', 'radiusLabel8BindsOC', 'shadedRegionMatchesOriginalMinorArcAndChordAC',
    'noAddedSolutionCueObserved', 'labelsLegibleAndNotClippedAtInspectedSize', 'imageAltMatchesObservedGivens'];
  if (independent.schemaVersion !== 'archive-independent-problem-display-review-v1' || independent.scope !== 'EXACT_Q22_TWO_PART_PROBLEM_STATIC_CONTINUITY' ||
      independent.decision !== 'STATIC_PROBLEM_DISPLAY_CONTINUITY_ACCEPTED' || !text(independent.reviewer) || !text(independent.producer) || independent.reviewer === independent.producer ||
      independent.expectedRef?.sha256 !== evidence.originalExpectedRef.sha256 || independent.beforeImageRef?.sha256 !== beforeImage.sha256 ||
      independent.currentImageRef?.sha256 !== afterImage.sha256 || independent.currentImageRef?.gitBlobSha1 !== afterImage.gitBlobSha1 ||
      observed.some(k => independent.observations?.[k] !== true) ||
      !eq(independent.exposure, { expectationsFrozenBeforeCurrentImage: true, answerOrSolutionRead: false, nativeJudgmentRead: false, upstreamVisualDecisionRead: false }) ||
      independent.actualStudentUi !== 'NOT_RUN' || independent.newMathematicalQa !== false ||
      ['newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotApprovals', 'sourceWrites', 'assetWrites'].some(k => independent[k] !== 0)) fail('independent static display witness differs');
  const ui = studentUi(root, request, item, current, identity, evidence, afterImage);
  if (ui.reviewer === independent.producer) fail('UI independent reviewer is problem display producer');
  return { reviewedQuestion: before.question, proof: { schemaVersion: BASIC_HELD_RENDERER_SCHEMA,
    scope: evidence.scope, questionUid: item.questionUid, sourceOrdinal: item.sourceOrdinal,
    reviewCommit: spec.reviewCommit, reviewRef: structuredClone(spec.reviewRef), beforeSource: structuredClone(evidence.beforeSource),
    afterSource: structuredClone(evidence.afterSource), changedDisplayFields: [...DISPLAY], beforeAssets, afterAssets,
    independentReviewRef: structuredClone(evidence.independentReviewRef), reviewer: independent.reviewer, originalExpectedRef: structuredClone(evidence.originalExpectedRef),
    givenExpectedRef: structuredClone(evidence.givenExpectedRef), originalNativeAndHoldJudgmentsUnchanged: true,
    studentUi: ui, actualStudentUi: 'PASS', releaseGate: 'DISPLAY_WITNESS_VALIDATED_ORIGINAL_HOLD_REPLAY_REQUIRED', newMetadataApprovals: 0, newMathematicalQa: false,
    newDifficultyJudgments: 0, newReview2: false, newFourSlotApprovals: 0, sourceWrites: 0, assetWrites: 0 } };
}
