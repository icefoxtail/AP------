import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { buildReviewedReceipt } from '../../../tools/build-codex-render-receipt.mjs';
import { validateCodexRenderReceipt } from '../../../tools/archive-codex-closeout-v2.mjs';
import { physical, writeFresh } from '../../../tools/archive-codex-artifact-io.mjs';

const root = path.resolve('.');
const runId = 'codex-sourceonly-h2-1mid-20261011-dispatch03';
const runRoot = path.join(root, 'archive/analysis', runId);
const roster = JSON.parse(fs.readFileSync(path.join(runRoot, 'registration-roster.locked.rev2.json'), 'utf8'));
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const absolute = value => path.isAbsolute(value) ? value : path.resolve(root, value);
const relative = value => path.relative(root, value).replaceAll('\\', '/');
const freshJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', { flag: 'wx' });
  return physical(file);
};
const results = [];

for (const row of roster.rows) {
  const originalEventPath = path.join(root, row.stageProofs.R3.event.path);
  const originalEvent = JSON.parse(fs.readFileSync(originalEventPath, 'utf8'));
  let originalReceiptRef = row.stageProofs.R3.renderReceipt;
  if (!originalReceiptRef) {
    for (const proof of originalEvent.extraProofs || []) {
      if (typeof proof.path !== 'string' || !/render.*receipt.*\.json/i.test(proof.path)) continue;
      const candidatePath = absolute(proof.path);
      if (!fs.existsSync(candidatePath)) continue;
      const candidateReceipt = JSON.parse(fs.readFileSync(candidatePath, 'utf8'));
      if (candidateReceipt.status === 'RENDER_PASS' && candidateReceipt.artifactSha === row.sourceGitBlobSha1 && Array.isArray(candidateReceipt.cases)) {
        originalReceiptRef = { path: proof.path, sha256: proof.sha256 };
        break;
      }
    }
  }
  if (!originalReceiptRef?.path || !originalReceiptRef?.sha256) throw new Error(`R3_RENDER_RECEIPT_NOT_FOUND:${row.examUid}`);
  const durableReceiptPath = path.join(runRoot, `${row.examUid}.R3.render-receipt.durable.json`);
  const durableManifestPath = path.join(runRoot, `${row.examUid}.ROOT.durable-render-rebind.rev1.json`);
  if (fs.existsSync(durableReceiptPath) && fs.existsSync(durableManifestPath)) {
    const receiptBytes = fs.readFileSync(durableReceiptPath);
    const manifestBytes = fs.readFileSync(durableManifestPath);
    const receipt = JSON.parse(receiptBytes.toString('utf8'));
    const manifest = JSON.parse(manifestBytes.toString('utf8'));
    const captureReport = JSON.parse(fs.readFileSync(absolute(receipt.captureReport.path), 'utf8'));
    const assets = [...new Map(receipt.cases.flatMap(item => item.loadedAssets || []).map(asset => [asset.ref, { ref: asset.ref, sha256: asset.sha256 }])).values()];
    const check = validateCodexRenderReceipt({ receipt, root, artifactSha: row.sourceGitBlobSha1, assets, qids: captureReport.qids.map(Number) });
    if (!check.ok || manifest.examUid !== row.examUid || manifest.screenshotBytesPreserved !== true) throw new Error(`EXISTING_DURABLE_RENDER_REBIND_INVALID:${row.examUid}`);
    results.push({ examUid: row.examUid, receipt: { path: relative(durableReceiptPath), sha256: sha256(receiptBytes) }, manifest: { path: relative(durableManifestPath), sha256: sha256(manifestBytes) }, captureCount: manifest.captures.length, auxiliaryCount: manifest.auxiliary.length, renderStatus: receipt.status, reusedExistingDurableRebind: true });
    console.log(JSON.stringify(results.at(-1)));
    continue;
  }
  const originalReceiptPath = absolute(originalReceiptRef.path);
  const originalReceiptBytes = fs.readFileSync(originalReceiptPath);
  const originalReceipt = JSON.parse(originalReceiptBytes.toString('utf8'));
  if (sha256(originalReceiptBytes) !== originalReceiptRef.sha256) throw new Error(`ORIGINAL_R3_RECEIPT_SHA_MISMATCH:${row.examUid}`);
  if (originalReceipt.status !== 'RENDER_PASS' || originalReceipt.artifactSha !== row.sourceGitBlobSha1) throw new Error(`ORIGINAL_R3_RECEIPT_IDENTITY_MISMATCH:${row.examUid}`);

  const durableDir = path.join(runRoot, `${row.examUid}.R3.durable`);
  const capture = JSON.parse(fs.readFileSync(absolute(originalReceipt.captureReport.path), 'utf8'));
  const captures = [];
  for (const testCase of capture.cases || []) {
    for (let captureIndex = 0; captureIndex < (testCase.captures || []).length; captureIndex += 1) {
      const item = testCase.captures[captureIndex];
      const sourcePath = absolute(item.image.path);
      const sourceBytes = fs.readFileSync(sourcePath);
      if (sha256(sourceBytes) !== item.image.sha256) throw new Error(`ORIGINAL_CAPTURE_SHA_MISMATCH:${row.examUid}:${testCase.id}:${captureIndex}`);
      const extension = path.extname(sourcePath) || '.png';
      const name = `${testCase.id.replaceAll('/', '-')}-${String(captureIndex + 1).padStart(2, '0')}${extension}`;
      const outputPath = path.join(durableDir, 'captures', name);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, sourceBytes, { flag: 'wx' });
      const outputSha = physical(outputPath).sha256;
      if (outputSha !== item.image.sha256) throw new Error(`DURABLE_CAPTURE_BYTES_CHANGED:${row.examUid}:${name}`);
      captures.push({ caseId: testCase.id, originalPath: item.image.path, durablePath: relative(outputPath), sha256: outputSha });
      item.image.path = relative(outputPath);
    }
  }

  // Preserve any separately recorded no-fit/measurement artifacts that R3 sealed in .tmp.
  const imagePaths = new Set(captures.map(item => path.resolve(root, item.originalPath)));
  const captureReportOriginal = absolute(originalReceipt.captureReport.path);
  const reviewOriginalPath = absolute(originalReceipt.review.path);
  const auxiliary = [];
  for (const proof of originalEvent.extraProofs || []) {
    if (typeof proof.path !== 'string') continue;
    const sourcePath = absolute(proof.path);
    if (!sourcePath.toLowerCase().includes(`${path.sep}.tmp${path.sep}`)
      || sourcePath === captureReportOriginal || imagePaths.has(sourcePath)) continue;
    if (!fs.existsSync(sourcePath) || !fs.statSync(sourcePath).isFile()) continue;
    const sourceBytes = fs.readFileSync(sourcePath);
    const sourceSha = sha256(sourceBytes);
    if (proof.sha256 && proof.sha256 !== sourceSha) throw new Error(`AUXILIARY_PROOF_SHA_MISMATCH:${row.examUid}:${proof.path}`);
    const name = `${String(auxiliary.length + 1).padStart(2, '0')}-${path.basename(sourcePath)}`;
    const outputPath = path.join(durableDir, 'aux', name);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, sourceBytes, { flag: 'wx' });
    auxiliary.push({ originalPath: proof.path, originalSha256: sourceSha, durablePath: relative(outputPath), durableSha256: physical(outputPath).sha256 });
  }

  const capturePath = path.join(durableDir, 'machine-capture.durable.json');
  const captureRef = freshJson(capturePath, capture);
  const reviewBytes = fs.readFileSync(reviewOriginalPath);
  const originalReview = JSON.parse(reviewBytes.toString('utf8'));
  const review = {
    ...originalReview,
    captureReportSha256: captureRef.sha256,
    rootDurableByteRebind: {
      originalCaptureReport: { path: originalReceipt.captureReport.path, sha256: originalReceipt.captureReport.sha256 },
      durableCaptureReport: { path: relative(capturePath), sha256: captureRef.sha256 },
      screenshotBytesPreserved: true,
      visualReviewRepeated: false,
    },
  };
  const reviewPath = path.join(durableDir, 'capture-review.durable.json');
  const reviewRef = freshJson(reviewPath, review);
  const receipt = buildReviewedReceipt({
    root,
    capturePath: relative(capturePath),
    reviewPath: relative(reviewPath),
    r3ValidationPath: originalReceipt.r3Validation.path,
  });
  const qids = capture.qids.map(Number);
  const assets = [...new Map(receipt.cases.flatMap(item => item.loadedAssets || []).map(asset => [asset.ref, { ref: asset.ref, sha256: asset.sha256 }])).values()];
  const renderCheck = validateCodexRenderReceipt({ receipt, root, artifactSha: row.sourceGitBlobSha1, assets, qids });
  if (!renderCheck.ok) throw new Error(`DURABLE_RENDER_RECEIPT_REJECTED:${row.examUid}:${renderCheck.issues.join(',')}`);
  const receiptPath = durableReceiptPath;
  const receiptRef = freshJson(receiptPath, receipt);

  const manifestPath = durableManifestPath;
  const manifest = {
    schemaVersion: 'ROOT_R3_DURABLE_RENDER_REBIND_V1',
    executionLine: 'CODEX',
    runId,
    examUid: row.examUid,
    sourceRawSha256: row.sourceRawSha256,
    sourceGitBlobSha1: row.sourceGitBlobSha1,
    originalEvent: { path: relative(originalEventPath), sha256: row.stageProofs.R3.event.sha256 },
    originalRenderReceipt: { path: relative(originalReceiptPath), sha256: originalReceiptRef.sha256, status: originalReceipt.status },
    durableRenderReceipt: { path: relative(receiptPath), sha256: receiptRef.sha256, status: receipt.status },
    captureReport: { originalPath: originalReceipt.captureReport.path, originalSha256: originalReceipt.captureReport.sha256, durablePath: relative(capturePath), durableSha256: captureRef.sha256 },
    review: { originalPath: originalReceipt.review.path, originalSha256: sha256(reviewBytes), durablePath: relative(reviewPath), durableSha256: reviewRef.sha256, sameReviewedScreenshotHashes: true },
    captures,
    auxiliary,
    renderValidation: { disposition: renderCheck.disposition, issues: renderCheck.issues },
    screenshotBytesPreserved: true,
    actualCaptureRepeated: false,
    visualReviewRepeated: false,
    createdAt: new Date().toISOString(),
  };
  const manifestRef = freshJson(manifestPath, manifest);
  results.push({ examUid: row.examUid, receipt: { path: relative(receiptPath), sha256: receiptRef.sha256 }, manifest: { path: relative(manifestPath), sha256: manifestRef.sha256 }, captureCount: captures.length, auxiliaryCount: auxiliary.length, renderStatus: receipt.status });
  console.log(JSON.stringify(results.at(-1)));
}

console.log(JSON.stringify({ status: 'PASS', promotedExamCount: results.length, results }, null, 2));
