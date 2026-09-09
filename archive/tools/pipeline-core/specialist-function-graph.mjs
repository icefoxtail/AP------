import fs from 'node:fs';
import path from 'node:path';
import { fileRef, readBoundFile, objectSha, bytesSha } from './canonical.mjs';

const SCHEMA = 'APMATH_FUNCTION_GRAPH_CLOSURE_v1';
const load = (root, ref) => JSON.parse(readBoundFile(root, ref));
const required = (value, label) => { if (!value) throw new Error(`${label}_REQUIRED`); return value; };

function latestFreeze(root, reportDir) {
  const latest = new Map();
  for (const filename of fs.readdirSync(path.join(root, reportDir)).filter((name) => /^solution_freeze_batch_\d+\.json$/.test(name))) {
    const batch = JSON.parse(fs.readFileSync(path.join(root, reportDir, filename), 'utf8'));
    for (const row of batch.rows || []) {
      const prior = latest.get(row.questionUid);
      if (!prior || Number(batch.batchNo) > prior.batchNo) latest.set(row.questionUid, { batchNo: Number(batch.batchNo), row });
    }
  }
  const blocked = [...latest.values()].filter(({ row }) => row.logicStatus !== 'PASS');
  return { unique: latest.size, pass: latest.size - blocked.length, blocked: blocked.map(({ row }) => row.questionUid) };
}

function checkBoundRef(root, ref, label) {
  if (!ref || !ref.path) throw new Error(`${label}_REF_MISSING`);
  const current = fileRef(root, ref.path);
  if (current.sha256 !== ref.sha256 || current.bytes !== ref.bytes) throw new Error(`${label}_STALE`);
  return current;
}

export function auditFunctionGraphSpecialist(root, manifestPath) {
  const errors = [];
  let run;
  try { run = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch (error) { return { schemaVersion: SCHEMA, status: 'BLOCKED', productionAuthorized: false, errors: [`MANIFEST_READ:${error.message}`] }; }
  if (run.schemaVersion !== 'APMATH_FUNCTION_GRAPH_RUN_v1') errors.push('RUN_SCHEMA_INVALID');
  if (!run.runId || !Number.isSafeInteger(run.revision) || run.revision < 1) errors.push('RUN_ID_REVISION_INVALID');
  const bound = new Map();
  for (const ref of run.inputs || []) {
    try { const current = checkBoundRef(root, ref, `INPUT:${ref.path}`); bound.set(ref.path, current); } catch (error) { errors.push(error.message); }
  }
  const reportDir = run.reportDir || 'reports/h2-s1-algebra-visual-upgrade';
  let candidateManifest, bindings, render, renderReview;
  try {
    candidateManifest = load(root, required(run.candidateManifestRef, 'CANDIDATE_MANIFEST'));
    bindings = load(root, required(run.productionBindingRef, 'PRODUCTION_BINDINGS'));
    render = load(root, required(run.renderCaptureRef, 'RENDER_CAPTURE'));
    renderReview = load(root, required(run.renderReviewRef, 'RENDER_REVIEW'));
  } catch (error) { errors.push(`REPORT_BINDING:${error.message}`); }
  const candidateRows = candidateManifest?.rows?.filter((row) => row.candidateRef && row.v1Status === 'PASS' && row.v2Status === 'PASS' && row.v3Status === 'PASS') || [];
  const bindingRows = bindings?.files?.flatMap((file) => file.rows || []) || [];
  const rowResults = [];
  for (const row of candidateRows) {
    const rowErrors = [];
    const binding = bindingRows.find((item) => item.questionUid === row.questionUid);
    if (!binding) rowErrors.push('PRODUCTION_BINDING_MISSING');
    let candidateSha = null, assetSha = null;
    try { candidateSha = checkBoundRef(root, run.inputs.find((ref) => ref.path === row.candidateRef), `CANDIDATE:${row.questionUid}`).sha256; } catch (error) { rowErrors.push(error.message); }
    try {
      const assetPath = binding?.assetPath?.startsWith('archive/') ? binding.assetPath : binding?.assetPath ? `archive/${binding.assetPath}` : null;
      assetSha = assetPath ? checkBoundRef(root, run.inputs.find((ref) => ref.path === assetPath), `ASSET:${row.questionUid}`).sha256 : null;
      if (candidateSha && assetSha && candidateSha !== assetSha) rowErrors.push('CANDIDATE_ASSET_SHA_MISMATCH');
    } catch (error) { rowErrors.push(error.message); }
    for (const [axis, key] of [['V1', 'v1Evidence'], ['V2', 'v2Evidence'], ['V3', 'v3Evidence']]) {
      try {
        const evidenceRef = row[key];
        const evidence = load(root, run.inputs.find((ref) => ref.path === evidenceRef));
        if (evidence.status !== 'PASS' || evidence.questionUid !== row.questionUid) rowErrors.push(`${axis}_EVIDENCE_NOT_PASS_OR_SCOPE`);
        if (axis === 'V1' && evidence.schemaVersion !== 'apmath-add-general-v1-source-only' && evidence.schemaVersion !== 'apmath-add-legacy-v1-source-only' && evidence.schemaVersion !== 'apmath-source-only-v1') rowErrors.push('V1_SCHEMA_ROUTE_MISMATCH');
        if (axis === 'V2' && evidence.schemaVersion !== 'apmath-add-general-v2-artifact-only' && evidence.schemaVersion !== 'apmath-add-legacy-v2-artifact-only' && evidence.schemaVersion !== 'apmath-artifact-only-v2') rowErrors.push('V2_SCHEMA_ROUTE_MISMATCH');
        if (axis === 'V3' && evidence.schemaVersion !== 'apmath-add-general-v3-parity' && evidence.schemaVersion !== 'apmath-add-legacy-v3-parity' && evidence.schemaVersion !== 'apmath-parity-v3') rowErrors.push('V3_SCHEMA_ROUTE_MISMATCH');
      } catch (error) { rowErrors.push(`${axis}_EVIDENCE:${error.message}`); }
    }
    rowResults.push({ questionUid: row.questionUid, disposition: row.disposition, candidateRef: row.candidateRef, productionAsset: binding?.assetPath || null, candidateSha, assetSha, status: rowErrors.length ? 'FAIL' : 'PASS', errors: rowErrors });
  }
  const freeze = latestFreeze(root, reportDir);
  if (freeze.unique !== 459 || freeze.pass !== 459 || freeze.blocked.length) errors.push(`SOLUTION_FREEZE_NOT_CLOSED:${freeze.unique}/${freeze.pass}`);
  if (render?.status !== 'PASS' || render?.expectedCases !== 72 || render?.observedCases !== 72 || render?.passCases !== 72 || render?.failCases !== 0) errors.push('RENDER_CAPTURE_NOT_CLOSED');
  if (renderReview?.status !== 'PASS') errors.push('RENDER_REVIEW_NOT_CLOSED');
  if (candidateRows.length !== 39) errors.push(`CANDIDATE_SCOPE_INVALID:${candidateRows.length}`);
  errors.push(...rowResults.filter((row) => row.status !== 'PASS').flatMap((row) => row.errors.map((error) => `${row.questionUid}:${error}`)));
  return { schemaVersion: SCHEMA, route: 'function-family-specialist-visual-route', runId: run?.runId || null, revision: run?.revision || null, status: errors.length ? 'BLOCKED' : 'PASS', productionAuthorized: false, candidateCount: candidateRows.length, candidatePassCount: rowResults.filter((row) => row.status === 'PASS').length, solutionFreeze: freeze, render: { status: render?.status || null, expectedCases: render?.expectedCases || null, observedCases: render?.observedCases || null, passCases: render?.passCases || null, failCases: render?.failCases || null }, errors, rows: rowResults, inputSha: objectSha(run.inputs || []), reportSha: objectSha({ candidateRows: rowResults, freeze, render }) };
}
