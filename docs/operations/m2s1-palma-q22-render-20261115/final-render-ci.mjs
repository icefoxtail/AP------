import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { recordArchiveEvidence } from '../../../archive/tools/geometry-equation/record-visual-browser-evidence.mjs';

// A bounded capture of the exact final source and frozen official SVG.
// The official recorder requires its byte-identical candidates under .tmp/archive.
const exam = '21_팔마중_1학기_중간_중2_기출';
const sourcePath = `archive/exams/original/middle/m2/1mid/${exam}.js`;
const assetPath = `archive/assets/images/${exam}/q22-solution.svg`;
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sourceBytes = fs.readFileSync(sourcePath);
const assetBytes = fs.readFileSync(assetPath);
if (sha(sourceBytes) !== '73e7dca45980a7e405e540a14afd9d8394bb71a351129c9f1826a5abcb5fd3d3') throw Error('FINAL_SOURCE_NOT_RESTORED_EXACTLY');
if (sha(assetBytes) !== '9f07d3bd115489e64cb2f63ddb0b1e8a6617794145ce9b30580e6a3f652df01d') throw Error('FROZEN_SVG_CHANGED');
const id = 'va-b9961463f237d9400148706f10c61a591d986bd922831fb4a85fd8149704625e';
const root = `.tmp/archive/palma-final-26fc/${exam}`;
const candidatePath = `${root}/candidates/${exam}.js`;
const capturedAssetPath = `${root}/assets/images/${exam}/q22-solution.svg`;
for (const [target, bytes] of [[candidatePath, sourceBytes], [capturedAssetPath, assetBytes]]) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  if (sha(fs.readFileSync(target)) !== sha(bytes)) throw Error('FINAL_CAPTURE_COPY_MISMATCH');
}
const run = `${root}/visual-engine/production/final-source-capture`;
fs.mkdirSync(run, { recursive: true });
const info = {
  id, sourcePath, sourceSha256: sha(sourceBytes), candidatePath,
  candidateSha256: sha(sourceBytes), questionCount: 24,
  assets: [{ id, path: capturedAssetPath, archivePath: assetPath.replace(/^archive\//, ''), sha256: sha(assetBytes), questionId: 22 }]
};
const matrix = {
  synthetic: false, legacyHashAlgorithm: 'SHA256_RAW_HEX_v1',
  engineSha256: sha(fs.readFileSync('archive/engine.html')),
  sources: [info],
  rows: [{ ...info, mode: 'sol', viewport: 'desktop', width: 1440, height: 1000,
    requireLocalResources: true, requireQrRenderer: true,
    urlPath: '/archive/engine.html?mode=sol&qpp=4&data=' + encodeURIComponent(sourcePath.replace(/^archive\//, '')) }]
};
fs.writeFileSync(`${run}/archive-render-matrix.json`, JSON.stringify(matrix, null, 2) + '\n', { flag: 'wx' });
const result = await recordArchiveEvidence({ run, blockExternalRequests: true });
fs.writeFileSync(`${run}/final-capture-result.json`, JSON.stringify(result, null, 2) + '\n', { flag: 'wx' });
if (result.status !== 'PASS') throw Error('FINAL_SOURCE_CAPTURE_FAILED:' + JSON.stringify(result));
const row = JSON.parse(fs.readFileSync(`${run}/archive-render/attempt-01/${id}-sol-desktop.json`, 'utf8'));
const assetResponses = row.responses.filter(r => decodeURIComponent(new URL(r.url).pathname) === '/' + assetPath);
const sourceResponses = row.responses.filter(r => decodeURIComponent(new URL(r.url).pathname) === '/' + sourcePath);
if (assetResponses.length !== 1 || assetResponses[0].status !== 200 || assetResponses[0].sha256 !== sha(assetBytes)) throw Error('FINAL_ASSET_RESPONSE_MISMATCH');
if (sourceResponses.length !== 1 || sourceResponses[0].status !== 200 || sourceResponses[0].sha256 !== sha(sourceBytes)) throw Error('FINAL_SOURCE_RESPONSE_MISMATCH');
console.log(JSON.stringify({ status: 'FINAL_SOURCE_ACTUAL_ARCHIVE_CAPTURE_PASS', sourceSha256: sha(sourceBytes), svgSha256: sha(assetBytes), sourceMutation: 0, viewport: '1440x1000', independentVisualReview: 'PENDING' }));
