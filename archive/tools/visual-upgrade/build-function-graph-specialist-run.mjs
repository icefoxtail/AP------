import fs from 'node:fs';
import path from 'node:path';
import { fileRef } from '../pipeline-core/canonical.mjs';

const root = process.cwd();
const reportDir = 'reports/h2-s1-algebra-visual-upgrade';
const reportAbs = path.join(root, reportDir);
const rel = (value) => value.replaceAll('\\', '/');
const refs = new Map();
const add = (relative, role = 'evidence') => {
  const normalized = rel(relative);
  if (!refs.has(normalized)) refs.set(normalized, { ...fileRef(root, normalized), role });
};
add(`${reportDir}/candidate_manifest.json`, 'manifest');
add(`${reportDir}/PRODUCTION_ASSET_BINDINGS.json`, 'binding');
add(`${reportDir}/browser_render_capture_matrix.json`, 'render-capture');
add(`${reportDir}/browser_render_review.json`, 'render-review');
add(`${reportDir}/browser_render_refresh_20260909.json`, 'render-refresh');
const candidateManifest = JSON.parse(fs.readFileSync(path.join(reportAbs, 'candidate_manifest.json'), 'utf8'));
const bindings = JSON.parse(fs.readFileSync(path.join(reportAbs, 'PRODUCTION_ASSET_BINDINGS.json'), 'utf8')).files.flatMap((file) => file.rows || []);
const refresh = JSON.parse(fs.readFileSync(path.join(reportAbs, 'browser_render_refresh_20260909.json'), 'utf8'));
for (const sourcePath of new Set(candidateManifest.rows.map((row) => row.sourceJsPath).filter(Boolean))) add(sourcePath, 'source');
for (const sourcePath of refresh.sourceFiles || []) add(`archive/${sourcePath}`, 'source');
for (const row of candidateManifest.rows.filter((row) => row.candidateRef && row.v1Status === 'PASS' && row.v2Status === 'PASS' && row.v3Status === 'PASS')) {
  add(row.candidateRef, 'candidate');
  add(row.v1Evidence, 'evidence'); add(row.v2Evidence, 'evidence'); add(row.v3Evidence, 'evidence');
  const binding = bindings.find((item) => item.questionUid === row.questionUid);
  if (binding?.assetPath) add(binding.assetPath.startsWith('archive/') ? binding.assetPath : `archive/${binding.assetPath}`, 'asset');
}
for (const filename of fs.readdirSync(reportAbs).filter((name) => /^solution_freeze_batch_\d+\.json$/.test(name))) add(`${reportDir}/${filename}`, 'evidence');
const run = {
  schemaVersion: 'APMATH_FUNCTION_GRAPH_RUN_v1',
  runId: 'h2-s1-algebra-function-graph-specialist-20260909',
  revision: 1,
  builderSessionId: 'h2-s1-algebra-visual-upgrade-builder-20260909',
  route: 'function-family-specialist-visual-route',
  reportDir,
  candidateManifestRef: refs.get(`${reportDir}/candidate_manifest.json`),
  productionBindingRef: refs.get(`${reportDir}/PRODUCTION_ASSET_BINDINGS.json`),
  renderCaptureRef: refs.get(`${reportDir}/browser_render_capture_matrix.json`),
  renderReviewRef: refs.get(`${reportDir}/browser_render_review.json`),
  renderRefreshRef: refs.get(`${reportDir}/browser_render_refresh_20260909.json`),
  inputs: [...refs.values()],
  questionUids: candidateManifest.rows.filter((row) => row.candidateRef && row.v1Status === 'PASS' && row.v2Status === 'PASS' && row.v3Status === 'PASS').map((row) => row.questionUid),
  productionAuthorized: false,
};
fs.writeFileSync(path.join(reportAbs, 'function_graph_specialist_run.json'), JSON.stringify(run, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ runId: run.runId, inputCount: run.inputs.length, questionCount: run.questionUids.length }));
