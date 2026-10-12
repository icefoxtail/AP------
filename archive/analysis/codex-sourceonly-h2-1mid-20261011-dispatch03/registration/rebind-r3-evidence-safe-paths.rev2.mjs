import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildReviewedReceipt } from '../../../tools/build-codex-render-receipt.mjs';
import { validateCodexRenderReceipt } from '../../../tools/archive-codex-closeout-v2.mjs';

const root = path.resolve('.');
const runId = 'codex-sourceonly-h2-1mid-20261011-dispatch03';
const runRoot = path.join(root, 'archive/analysis', runId);
const roster = JSON.parse(fs.readFileSync(path.join(runRoot, 'registration-roster.locked.rev2.json'), 'utf8'));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const relative = file => path.relative(root, file).replaceAll('\\', '/');
const freshJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`, 'utf8');
  fs.writeFileSync(file, bytes, { flag: 'wx' });
  return { bytes, sha256: sha(bytes) };
};
function replaceReservedAuxPaths(value) {
  if (typeof value === 'string') return value.replaceAll('/aux/', '/support/').replaceAll('\\aux\\', '\\support\\');
  if (Array.isArray(value)) return value.map(replaceReservedAuxPaths);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, replaceReservedAuxPaths(child)]));
  return value;
}

const results = [];
for (const row of roster.rows) {
  const durableDir = path.join(runRoot, `${row.examUid}.R3.durable`);
  const sourceAux = path.join(durableDir, 'aux');
  const safeSupport = path.join(durableDir, 'support');
  const receiptPath = path.join(runRoot, `${row.examUid}.R3.render-receipt.safe-path.rev2.json`);
  const manifestPath = path.join(runRoot, `${row.examUid}.ROOT.safe-path-render-rebind.rev2.json`);
  if (fs.existsSync(receiptPath) && fs.existsSync(manifestPath)) {
    const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    results.push({ examUid: row.examUid, captureCount: manifest.captures.length, auxiliaryCount: manifest.auxiliary.length, status: receipt.status, receipt: { path: relative(receiptPath), sha256: sha(fs.readFileSync(receiptPath)) }, manifest: { path: relative(manifestPath), sha256: sha(fs.readFileSync(manifestPath)) }, reusedExistingSafePathRebind: true });
    console.log(JSON.stringify(results.at(-1)));
    continue;
  }
  if (fs.existsSync(sourceAux)) fs.mkdirSync(safeSupport, { recursive: true });
  const auxiliary = [];
  for (const entry of fs.existsSync(sourceAux) ? fs.readdirSync(sourceAux, { withFileTypes: true }) : []) {
    if (!entry.isFile()) continue;
    const originalPath = path.join(sourceAux, entry.name);
    const outputPath = path.join(safeSupport, entry.name);
    const inputBytes = fs.readFileSync(originalPath);
    if (!fs.existsSync(outputPath)) fs.copyFileSync(originalPath, outputPath);
    const outputBytes = fs.readFileSync(outputPath);
    if (sha(inputBytes) !== sha(outputBytes)) throw new Error(`SAFE_SUPPORT_BYTES_CHANGED:${row.examUid}:${entry.name}`);
    auxiliary.push({ oldPath: relative(originalPath), path: relative(outputPath), sha256: sha(outputBytes), bytes: outputBytes.length });
  }

  const captureOriginalPath = path.join(durableDir, 'machine-capture.durable.json');
  const reviewOriginalPath = path.join(durableDir, 'capture-review.durable.json');
  const capture = replaceReservedAuxPaths(JSON.parse(fs.readFileSync(captureOriginalPath, 'utf8')));
  capture.safePathRebind = { fromReservedPathSegment: 'aux', toPathSegment: 'support', auxiliaryBytesPreserved: true, captureRepeated: false, reviewRepeated: false };
  const capturePath = path.join(durableDir, 'machine-capture.safe-path.rev2.json');
  const captureRef = freshJson(capturePath, capture);
  const originalReview = JSON.parse(fs.readFileSync(reviewOriginalPath, 'utf8'));
  const review = replaceReservedAuxPaths(originalReview);
  review.captureReportSha256 = captureRef.sha256;
  review.rootSafePathByteRebind = { previousCaptureReviewPath: relative(reviewOriginalPath), safePathCaptureReviewPath: relative(capturePath), auxiliaryBytesPreserved: true, visualReviewRepeated: false };
  const reviewPath = path.join(durableDir, 'capture-review.safe-path.rev2.json');
  const reviewRef = freshJson(reviewPath, review);

  const oldReceiptPath = path.join(runRoot, `${row.examUid}.R3.render-receipt.durable.json`);
  const oldReceipt = JSON.parse(fs.readFileSync(oldReceiptPath, 'utf8'));
  const receipt = buildReviewedReceipt({
    root,
    capturePath: relative(capturePath),
    reviewPath: relative(reviewPath),
    r3ValidationPath: oldReceipt.r3Validation.path,
  });
  const assets = [...new Map(receipt.cases.flatMap(item => item.loadedAssets || []).map(asset => [asset.ref, { ref: asset.ref, sha256: asset.sha256 }])).values()];
  const qids = capture.qids.map(Number);
  const validation = validateCodexRenderReceipt({ receipt, root, artifactSha: row.sourceGitBlobSha1, assets, qids });
  if (!validation.ok || receipt.status !== 'RENDER_PASS') throw new Error(`SAFE_PATH_RENDER_RECEIPT_FAILED:${row.examUid}:${validation.issues.join(',')}`);
  const receiptRef = freshJson(receiptPath, receipt);
  const oldManifestPath = path.join(runRoot, `${row.examUid}.ROOT.durable-render-rebind.rev1.json`);
  const oldManifest = JSON.parse(fs.readFileSync(oldManifestPath, 'utf8'));
  const manifest = {
    schemaVersion: 'ROOT_R3_SAFE_PATH_DURABLE_RENDER_REBIND_V1',
    qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
    executionLine: 'CODEX',
    runId,
    examUid: row.examUid,
    sourceRawSha256: row.sourceRawSha256,
    sourceGitBlobSha1: row.sourceGitBlobSha1,
    priorDurableRebind: { path: relative(oldManifestPath), sha256: sha(fs.readFileSync(oldManifestPath)) },
    priorDurableRenderReceipt: { path: relative(oldReceiptPath), sha256: sha(fs.readFileSync(oldReceiptPath)), status: oldReceipt.status },
    durableRenderReceipt: { path: relative(receiptPath), sha256: receiptRef.sha256, status: receipt.status },
    captureReport: { path: relative(capturePath), sha256: captureRef.sha256 },
    review: { path: relative(reviewPath), sha256: reviewRef.sha256, sameReviewedScreenshotHashes: true, visualReviewRepeated: false },
    captures: oldManifest.captures,
    auxiliary,
    screenshotBytesPreserved: true,
    auxiliaryBytesPreserved: true,
    actualCaptureRepeated: false,
    visualReviewRepeated: false,
    renderValidation: { disposition: validation.disposition, issues: validation.issues },
  };
  const manifestRef = freshJson(manifestPath, manifest);
  results.push({ examUid: row.examUid, captureCount: manifest.captures.length, auxiliaryCount: auxiliary.length, status: receipt.status, receipt: { path: relative(receiptPath), sha256: receiptRef.sha256 }, manifest: { path: relative(manifestPath), sha256: manifestRef.sha256 } });
  console.log(JSON.stringify(results.at(-1)));
}
console.log(JSON.stringify({ status: 'PASS', examCount: results.length, screenshotBytesPreserved: true, visualReviewRepeated: false, results }, null, 2));
