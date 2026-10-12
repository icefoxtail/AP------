#!/usr/bin/env node
/** GPT2 technical closeout, intentionally separate from mathematical quality judgment.
 * Stages are immutable references: do not copy assets/JS to the next stage.
 * Writes only to a local durable root; remote Library upload is an explicit adapter step.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { validateStageEvidence, gitBlobSha } from './archive-stage-validator.mjs';

const CONTRACT = 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006';
const NEXT = { CREATE: 'R1', R1: 'R2', R2: 'R3', R3: 'PUBLICATION' };
const STAGE_STATUS = { CREATE: 'CREATE_PASS', R1: 'R1_QUALITY_SEALED', R2: 'R2_VERIFIED', R3: 'R3_RELEASE_READY' };
function parse(argv) {
  const x = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i]?.startsWith('--') || i + 1 >= argv.length) throw Error('BAD_ARGUMENT');
    const k = argv[i].slice(2);
    if (!['stage','exam','evidence','asset-root','output-root','campaign-id','stream','exam-uid'].includes(k) || x[k]) throw Error('BAD_ARGUMENT:' + k);
    x[k] = argv[i + 1];
  }
  if (!NEXT[x.stage]) throw Error('INVALID_STAGE');
  if (!/^[a-zA-Z0-9_]+$/.test(x['campaign-id'] || '') || !['A','B','C'].includes(x.stream)) throw Error('INVALID_GENERATION_IDENTITY');
  if (!/^[a-zA-Z0-9_가-힣-]+$/.test(x['exam-uid'] || '')) throw Error('INVALID_EXAM_UID');
  for (const k of ['exam','evidence','asset-root','output-root']) if (!x[k]) throw Error('REQUIRED:' + k);
  return x;
}
const digest = b => crypto.createHash('sha256').update(b).digest('hex');
function atomicWrite(filename, bytes) {
  // Hard-link is an atomic create-if-absent operation. renameSync would silently
  // overwrite a seal/handoff written by another MASTER with a different SHA.
  fs.mkdirSync(path.dirname(filename), { recursive: true });
  const tmp = filename + '.' + process.pid + '.' + crypto.randomUUID() + '.tmp';
  try {
    fs.writeFileSync(tmp, bytes, { flag: 'wx' });
    try {
      fs.linkSync(tmp, filename);
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      if (!fs.readFileSync(filename).equals(bytes)) throw Error('IMMUTABLE_WRITE_CONFLICT:' + filename);
    }
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
}
function main(argv) {
  const opts = parse(argv);
  const exam = path.resolve(opts.exam), evidence = path.resolve(opts.evidence), assetRoot = path.resolve(opts['asset-root']);
  const root = path.resolve(opts['output-root']), stage = opts.stage;
  if (!fs.statSync(exam).isFile() || !fs.statSync(evidence).isFile() || !fs.statSync(assetRoot).isDirectory()) throw Error('INPUT_MISSING');
  const e = JSON.parse(fs.readFileSync(evidence, 'utf8'));
  if (e.qualityContractVersion !== CONTRACT || e.executionLine !== 'GPT_SCHEDULED' || e.stage !== stage || e.campaignId !== opts['campaign-id'] || e.stream !== opts.stream || e.examUid !== opts['exam-uid']) throw Error('EVIDENCE_IDENTITY_MISMATCH');
  const bytes = fs.readFileSync(exam), sha = gitBlobSha(bytes), inputHash = digest(bytes), evidenceHash = digest(fs.readFileSync(evidence));
  if (e.artifactSha !== sha) throw Error('EVIDENCE_ARTIFACT_SHA_MISMATCH');
  const dir = path.join(root, opts['campaign-id'], opts.stream, opts['exam-uid']);
  const sealDir = path.join(dir, 'seals', stage);
  const sealPath = path.join(sealDir, sha + '.json');
  const handoffPath = path.join(dir, 'handoffs', NEXT[stage] + '.json');
  // Never trust a receipt by its filename alone: require the original validator bytes.
  if (fs.existsSync(sealPath)) {
    const old = JSON.parse(fs.readFileSync(sealPath));
    const rawPath = path.join(sealDir, sha + '.validator.json');
    if (old.stageStatus !== STAGE_STATUS[stage] || old.qualityContractVersion !== CONTRACT ||
        old.campaignId !== opts['campaign-id'] || old.stream !== opts.stream || old.examUid !== opts['exam-uid'] ||
        old.artifactSha !== sha || old.artifactSha256 !== inputHash || old.evidenceSha256 !== evidenceHash ||
        !fs.existsSync(rawPath) || digest(fs.readFileSync(rawPath)) !== old.validatorReportSha256) throw Error('EXISTING_RECEIPT_DRIFT');
    const raw = JSON.parse(fs.readFileSync(rawPath));
    if (raw.ok !== true || raw.validatorMode !== stage + '_V2' || raw.artifactContract?.active !== true ||
        raw.issues?.length !== 0 || raw.artifactSha !== sha) throw Error('EXISTING_VALIDATOR_NOT_PASS');
    if (!fs.existsSync(handoffPath)) {
      // Crash recovery: only publish the handoff after the immutable PASS+raw report check.
      const ref = { schemaVersion: 'GPT2_SHA_REFERENCE_HANDOFF_v1', campaignId: opts['campaign-id'], stream: opts.stream,
        examUid: opts['exam-uid'], previousStage: stage, stage: NEXT[stage], artifactSha: sha, evidenceSha256: evidenceHash,
        sealReference: path.relative(dir, sealPath), artifactReference: old.nextArtifactReference };
      atomicWrite(handoffPath, Buffer.from(JSON.stringify(ref, null, 2) + '\n'));
      return { ok: true, recovered: true, stageStatus: STAGE_STATUS[stage], artifactSha: sha, handoffPath };
    }
    const prev = JSON.parse(fs.readFileSync(handoffPath));
    if (prev.artifactSha !== sha || prev.evidenceSha256 !== evidenceHash || prev.stage !== NEXT[stage]) throw Error('HANDOFF_DRIFT');
    return { ok: true, noop: true, stageStatus: STAGE_STATUS[stage], artifactSha: sha, handoffPath };
  }
  if (fs.existsSync(handoffPath)) throw Error('EXISTING_HANDOFF_CONFLICT');
  const report = validateStageEvidence({ examFile: exam, evidenceFile: evidence, stage, qualityContractVersion: CONTRACT, executionLine: 'GPT_SCHEDULED', campaignId: opts['campaign-id'], stream: opts.stream, assetRoot });
  if (report.ok !== true || report.validatorMode !== stage + '_V2' || report.artifactContract?.active !== true || report.artifactContract?.issues?.length !== 0 || report.issues?.length !== 0 || report.artifactSha !== sha) {
    return { ok: false, stage, issues: report.issues ?? ['VALIDATOR_NOT_ACTIVE'], report };
  }
  // Preserve raw report and original evidence, bound by independent hashes, at a content-addressed location.
  const reportBytes = Buffer.from(JSON.stringify(report, null, 2) + '\n');
  const receipt = { schemaVersion: 'GPT2_TECHNICAL_SEAL_v1', executionLine: 'GPT_SCHEDULED', qualityContractVersion: CONTRACT,
    campaignId: opts['campaign-id'], stream: opts.stream, examUid: opts['exam-uid'], stage,
    stageStatus: STAGE_STATUS[stage], artifactSha: sha, artifactSha256: inputHash, evidenceSha256: evidenceHash,
    validatorReportSha256: digest(reportBytes), validatorMode: report.validatorMode, artifactContractActive: true,
    denominator: report.denominator, nextStage: NEXT[stage], nextArtifactReference: { artifactSha: sha, exam, evidence, assetRoot } };
  const handoff = { schemaVersion: 'GPT2_SHA_REFERENCE_HANDOFF_v1', campaignId: opts['campaign-id'], stream: opts.stream,
    examUid: opts['exam-uid'], previousStage: stage, stage: NEXT[stage], artifactSha: sha, evidenceSha256: evidenceHash,
    sealReference: path.relative(dir, sealPath), artifactReference: receipt.nextArtifactReference };
  atomicWrite(path.join(sealDir, sha + '.validator.json'), reportBytes);
  atomicWrite(sealPath, Buffer.from(JSON.stringify(receipt, null, 2) + '\n'));
  atomicWrite(handoffPath, Buffer.from(JSON.stringify(handoff, null, 2) + '\n'));
  return { ok: true, noop: false, stageStatus: STAGE_STATUS[stage], artifactSha: sha, handoffPath, sealPath };
}
export { main };
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try { const result = main(process.argv.slice(2)); console.log(JSON.stringify(result, null, 2)); process.exitCode = result.ok ? 0 : 1; }
  catch (e) { console.error(JSON.stringify({ok:false,error:e.message})); process.exitCode = 2; }
}