#!/usr/bin/env node
/** One invocation: canonical V2 gate -> immutable local seal -> remote Library commit -> handoff.
 * Actual remote Library I/O is supplied by a host adapter with atomic put-if-absent.
 * No publication, quality-judgment substitution, or cross-stream work is performed here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { main as sealStage } from './gpt2-validate-and-seal.mjs';
import { closeout } from './gpt2-remote-closeout.mjs';

const NEXT = Object.freeze({ CREATE: 'R1', R1: 'R2', R2: 'R3', R3: 'PUBLICATION' });
const STATUS = Object.freeze({ CREATE: 'CREATE_PASS', R1: 'R1_QUALITY_SEALED', R2: 'R2_VERIFIED', R3: 'R3_RELEASE_READY' });
const REQUIRED = ['stage', 'exam', 'evidence', 'assetRoot', 'outputRoot', 'campaignId', 'stream', 'examUid'];

function checked(options) {
  if (REQUIRED.some(key => typeof options?.[key] !== 'string' || !options[key].trim()) ||
      !NEXT[options.stage] || !/^[A-Za-z0-9_]+$/.test(options.campaignId) ||
      !['A', 'B', 'C'].includes(options.stream) ||
      !/^[\p{L}\p{N}_-]+$/u.test(options.examUid)) throw Error('INVALID_ONE_SHOT_SCOPE');
  return { outputRoot: options.outputRoot, campaignId: options.campaignId,
    stream: options.stream, examUid: options.examUid, stage: options.stage };
}

function checkedAdapter(adapter) {
  if (adapter?.capabilities?.atomicCreateIfAbsent !== true ||
      adapter?.capabilities?.rawByteReadback !== true ||
      typeof adapter.get !== 'function' || typeof adapter.putIfAbsent !== 'function') {
    throw Error('ATOMIC_LIBRARY_ADAPTER_REQUIRED');
  }
  return {
    async get(remotePath) {
      const bytes = await adapter.get(remotePath);
      if (bytes !== null && !Buffer.isBuffer(bytes)) throw Error('LIBRARY_RAW_BYTES_REQUIRED');
      return bytes;
    },
    async put(remotePath, bytes) {
      if (!Buffer.isBuffer(bytes)) throw Error('LIBRARY_BYTES_REQUIRED');
      const created = await adapter.putIfAbsent(remotePath, Buffer.from(bytes));
      if (created !== true && created !== false) throw Error('LIBRARY_ATOMIC_CREATE_RESULT_REQUIRED');
    },
  };
}

function localContinuationPath(scope) {
  return path.join(path.resolve(scope.outputRoot), scope.campaignId, scope.stream,
    scope.examUid, 'one-shot-continuation.' + scope.stage + '.json');
}

function phaseError(error, phase) {
  if (!error.phase) error.phase = phase;
  return error;
}

/** Remote commit is the ONLY success boundary. Failed/interrupted runs are replayable. */
export async function oneShot(options, { adapter, runSeal = sealStage, remoteCloseout = closeout } = {}) {
  const scope = checked(options);
  let phase = 'ADAPTER_PREFLIGHT';
  try {
    const remote = checkedAdapter(adapter); // No local PASS before remote capability exists.
    phase = 'CANONICAL_V2_AND_LOCAL_SEAL';
    const args = ['--stage', options.stage, '--exam', options.exam, '--evidence', options.evidence,
      '--asset-root', options.assetRoot, '--output-root', options.outputRoot,
      '--campaign-id', options.campaignId, '--stream', options.stream, '--exam-uid', options.examUid];
    const sealed = await runSeal(args);
    if (sealed?.ok !== true || sealed.stageStatus !== STATUS[options.stage] ||
        !/^[0-9a-f]{40}$/.test(sealed.artifactSha || '')) {
      const err = Error('CANONICAL_STAGE_NOT_PASSED');
      err.issues = sealed?.issues ?? sealed?.report?.issues ?? [];
      throw err;
    }
    phase = 'REMOTE_IMMUTABLE_UPLOAD_READBACK_COMMIT';
    const result = await remoteCloseout(scope, remote);
    if (result?.committed !== true || result.status !== 'REMOTE_VERIFIED' ||
        result.artifactSha !== sealed.artifactSha ||
        result.stage !== options.stage || result.stream !== options.stream ||
        result.campaignId !== options.campaignId || result.examUid !== options.examUid) {
      throw Error('REMOTE_COMMIT_NOT_VERIFIED');
    }
    // Optional local housekeeping must never turn an already verified remote commit into FAIL.
    let cleanupWarning;
    try {
      const recovery = localContinuationPath(scope);
      if (fs.existsSync(recovery)) {
        const previous = JSON.parse(fs.readFileSync(recovery, 'utf8'));
        if (previous.campaignId === scope.campaignId && previous.stream === scope.stream &&
            previous.examUid === scope.examUid && previous.stage === scope.stage) fs.unlinkSync(recovery);
      }
    } catch (error) { cleanupWarning = 'LOCAL_CONTINUATION_CLEANUP_FAILED:' + error.message; }
    return { ok: true, status: 'REMOTE_VERIFIED', stage: options.stage,
      stageStatus: sealed.stageStatus, nextStage: NEXT[options.stage],
      artifactSha: sealed.artifactSha, commitPath: result.commitPath,
      commitSha256: result.commitSha256,
      localSealReused: sealed.noop === true, localSealRecovered: sealed.recovered === true,
      ...(cleanupWarning ? { warning: cleanupWarning } : {}) };
  } catch (error) {
    throw phaseError(error, phase);
  }
}

function parseCli(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (i + 1 >= argv.length || !argv[i].startsWith('--')) throw Error('BAD_ARGUMENT');
    const flag = argv[i].slice(2);
    const key = ({ 'asset-root': 'assetRoot', 'output-root': 'outputRoot',
      'campaign-id': 'campaignId', 'exam-uid': 'examUid', 'adapter-module': 'adapterModule',
      'adapter-config': 'adapterConfig' })[flag] ?? flag;
    if (![...REQUIRED, 'adapterModule', 'adapterConfig'].includes(key) || out[key]) throw Error('BAD_ARGUMENT:' + flag);
    out[key] = argv[i + 1];
  }
  checked(out);
  if (!out.adapterModule) throw Error('ADAPTER_MODULE_REQUIRED');
  return out;
}

function persistFailure(options, error) {
  // An exact LOCAL continuation, not a claim that the Library was updated.
  try {
    const target = localContinuationPath(checked(options));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const record = { schemaVersion: 'GPT2_ONE_SHOT_CONTINUATION_v1',
      campaignId: options.campaignId, stream: options.stream, examUid: options.examUid,
      stage: options.stage, status: 'NOT_REMOTE_VERIFIED',
      firstMissingClosureStep: error.phase ?? 'PREFLIGHT', error: error.message,
      issues: error.issues ?? [], retry: 'RERUN_SAME_INPUTS_WITH_ATOMIC_REMOTE_ADAPTER' };
    const tmp = target + '.' + process.pid + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
    fs.renameSync(tmp, target);
  } catch { /* Never conceal the original failure with a reporting failure. */ }
}

export async function cli(argv) {
  let options;
  try {
    options = parseCli(argv);
    const url = pathToFileURL(path.resolve(options.adapterModule));
    const module = await import(url.href);
    if (typeof module.createAdapter !== 'function') throw Error('ADAPTER_FACTORY_REQUIRED');
    const config = options.adapterConfig ? JSON.parse(fs.readFileSync(options.adapterConfig, 'utf8')) : {};
    const adapter = await module.createAdapter(config);
    const result = await oneShot(options, { adapter });
    console.log(JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    if (options) persistFailure(options, error);
    console.error(JSON.stringify({ ok: false, phase: error.phase ?? 'PREFLIGHT', error: error.message,
      issues: error.issues ?? [] }));
    process.exitCode = 2;
    return { ok: false };
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await cli(process.argv.slice(2));
}