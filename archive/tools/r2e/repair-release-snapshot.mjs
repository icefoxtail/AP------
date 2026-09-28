#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTAKES, STATE_BRANCH, atomicWrite, blob, digest, ensure, fetchRef, files, git, relative, sha } from './common.mjs';
import { checkGuard } from './guard.mjs';
import { parseQuestionBank } from '../meta-foundation/reviewed-apply-core.mjs';
import { readR1Authority } from './read-only-r1-adapter.mjs';

const gradeName = { m2: '중2', m3: '중3' };
const fullExamPath = value => {
  const normalized = String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (normalized.startsWith('archive/exams/')) return normalized;
  if (normalized.startsWith('exams/')) return 'archive/' + normalized;
  if (normalized.startsWith('original/middle/')) return 'archive/exams/' + normalized;
  return 'archive/exams/' + normalized;
};
function resolveExamPath(repo, commit, value, grade) {
  const normalized = String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalized.includes('/') && normalized.endsWith('.js')) {
    const matches = files(repo, commit, 'archive/exams/original/middle/' + grade + '/').filter(file => file.split('/').at(-1) === normalized);
    ensure(matches.length === 1, matches.length ? 'EXAM_FILE_PATH_AMBIGUOUS' : 'EXAM_FILE_NOT_FOUND');
    return matches[0];
  }
  return relative(fullExamPath(normalized));
}
function assetPath(value) {
  const normalized = String(value || '').replaceAll('\\', '/').replace(/^\.\//, '');
  return normalized.startsWith('archive/') ? normalized : 'archive/' + normalized.replace(/^\/+/, '');
}
function readCheckpoints(repo, stateHead, errors) {
  const rows = [];
  if (!stateHead) return rows;
  for (const grade of ['m2', 'm3']) {
    for (const file of files(repo, stateHead, 'archive/data/r2e/' + grade + '/exams/').filter(p => p.endsWith('.json'))) {
      try { rows.push({ grade, path: file, stateCommit: stateHead, ledger: JSON.parse(blob(repo, stateHead, file)) }); }
      catch (error) { errors.push({ severity: 'META_ONLY', path: file, code: 'CHECKPOINT_INVALID', reason: error.message }); }
    }
  }
  return rows;
}
function sourceIdentityMap(repo, mainSha) {
  const rows = JSON.parse(blob(repo, mainSha, 'archive/data/question_identity_map.json').toString('utf8')).records || [];
  const map = new Map();
  for (const row of rows) {
    const key = String(row.sourceArchiveFile).replaceAll('\\', '/') + '#' + Number(row.sourceOrdinal);
    if (map.has(key)) throw new Error('QUESTION_IDENTITY_DUPLICATE:' + key);
    map.set(key, row);
  }
  return map;
}
export function inventoryRepairRelease(repo, { fetch = true } = {}) {
  const heads = {}, errors = [], candidates = [], checkpoints = [];
  for (const [grade, branch] of Object.entries(INTAKES)) {
    try { heads[grade] = { branch, sha: fetch ? fetchRef(repo, branch) : git(repo, ['rev-parse', 'refs/remotes/origin/' + branch]).trim() }; }
    catch (error) { errors.push({ severity: 'RELEASE_BLOCKING', grade, code: 'INTAKE_UNAVAILABLE', reason: error.message }); }
  }
  const mainSha = fetch ? fetchRef(repo, 'main') : git(repo, ['rev-parse', 'refs/remotes/origin/main']).trim();
  let stateHead = null;
  const stateExists = Boolean(git(repo, ['ls-remote', '--heads', 'origin', STATE_BRANCH]).trim());
  if (stateExists) {
    try { stateHead = fetch ? fetchRef(repo, STATE_BRANCH) : git(repo, ['rev-parse', 'refs/remotes/origin/' + STATE_BRANCH]).trim(); }
    catch (error) { errors.push({ severity: 'RESOURCE_BLOCKING', code: 'R2E_STATE_UNAVAILABLE', reason: error.message }); }
  }
  checkpoints.push(...readCheckpoints(repo, stateHead, errors));
  let identityBySource;
  try { identityBySource = sourceIdentityMap(repo, mainSha); }
  catch (error) { return { schemaVersion: 'R2E_REPAIR_RELEASE_SNAPSHOT_v2', status: 'WAIT_RESOURCE', createdAt: new Date().toISOString(), baseMainSha: mainSha, heads, stateHead, resume: [], candidates: [], errors: [{ severity: 'RELEASE_BLOCKING', code: 'IDENTITY_MAP_UNAVAILABLE', reason: error.message }] }; }

  for (const [grade, head] of Object.entries(heads)) {
    const seen = new Set();
    const receiptFiles = files(repo, head.sha, 'archive/data/r2e-intake/' + grade + '/')
      .filter(file => file.endsWith('.json') && !file.endsWith('.evidence.json') && !file.endsWith('.meta.json'));
    for (const receiptPath of receiptFiles) {
      try {
        const receiptBytes = blob(repo, head.sha, receiptPath);
        const receipt = JSON.parse(receiptBytes.toString('utf8'));
        if (receipt.nextState !== 'READY_FOR_R2E') continue;
        ensure(typeof receipt.examUid === 'string' && receipt.examUid, 'EXAM_UID_REQUIRED');
        ensure(String(receipt.grade || '').replace('중', 'm').toLowerCase() === grade, 'RECEIPT_GRADE_MISMATCH');
        ensure(Number.isSafeInteger(Number(receipt.totalQuestions)) && Number(receipt.totalQuestions) > 0, 'R1_DENOMINATOR_REQUIRED');
        ensure(/^(?:sha256:)?(?:[a-f0-9]{40}|[a-f0-9]{64})$/i.test(String(receipt.sourceBlobSha || '')), 'R1_SOURCE_BLOB_SHA_REQUIRED');
        ensure(!seen.has(receipt.examUid), 'DUPLICATE_READY_EXAM');
        seen.add(receipt.examUid);
        const inputCommit = git(repo, ['log', '-1', '--format=%H', head.sha, '--', receiptPath]).trim();
        if (receipt.inputCommit) {
          ensure(/^[a-f0-9]{40}$/.test(receipt.inputCommit), 'R1_INPUT_COMMIT_INVALID');
          git(repo, ['merge-base', '--is-ancestor', receipt.inputCommit, inputCommit]);
        }
        const examFile = resolveExamPath(repo, inputCommit, receipt.examFile, grade);
        ensure(examFile.startsWith('archive/exams/original/middle/' + grade + '/') && examFile.endsWith('.js'), 'EXAM_GRADE_PATH_MISMATCH');
        const examBytes = blob(repo, inputCommit, examFile);
        ensure(sha(examBytes) === sha(blob(repo, head.sha, examFile)), 'POST_RECEIPT_JS_DRIFT');
        const bank = parseQuestionBank(examBytes.toString('utf8'), examFile);
        ensure(bank.length === Number(receipt.totalQuestions), 'R1_SOURCE_DENOMINATOR_MISMATCH');
        ensure(bank.every((q, index) => Number(q.id) === index + 1), 'R1_ORDINAL_SEQUENCE_INVALID');

        const directAssets = [...new Set(bank.flatMap(q => [q.image, q.solutionImage].filter(Boolean).map(assetPath)))];
        const changedSvg = (receipt.changedSvgFiles || []).map(value => typeof value === 'string' ? value : value && value.path).filter(Boolean).map(assetPath);
        const assetPaths = [...new Set([...directAssets, ...changedSvg])];
        const assets = assetPaths.map(file => {
          const bytes = blob(repo, inputCommit, file);
          ensure(sha(bytes) === sha(blob(repo, head.sha, file)), 'POST_RECEIPT_ASSET_DRIFT:' + file);
          return { path: file, sha256: sha(bytes), bytes: bytes.length };
        });

        const candidate = {
          grade, intakeBranch: head.branch, intakeHead: head.sha, baseMainSha: mainSha,
          inputCommit, declaredInputCommit: receipt.inputCommit || null,
          examFile, examUid: receipt.examUid, receiptPath, receiptSha256: sha(receiptBytes),
          examJsSha256: sha(examBytes), assets, denominator: bank.length,
        };
        const r1Authority = readR1Authority(repo, candidate, { identityBySource, metaAuthorityRoot: repo });
        const alreadyFinal = checkpoints.some(row => row.grade === grade && row.ledger.examUid === receipt.examUid
          && row.ledger.inputCommit === inputCommit && row.ledger.finalStatus === 'R2E_MAIN_FINAL');
        if (!alreadyFinal) candidates.push({
          ...candidate, inputSha256: digest({ examFile, examJsSha256: candidate.examJsSha256, assets,
            receiptSha256: candidate.receiptSha256, r1EvidenceSha256: r1Authority.r1Evidence.sha256 || null }),
          r1Authority,
        });
      } catch (error) {
        errors.push({ severity: 'RELEASE_BLOCKING', grade, receiptPath, examUid: null, code: 'INVALID_R1_AUTHORITY', reason: error.message });
      }
    }
  }
  const resume = checkpoints.filter(row => !['R2E_MAIN_FINAL', 'HUMAN_REQUIRED'].includes(row.ledger.finalStatus)
    && (!row.ledger.retryAfter || Date.parse(row.ledger.retryAfter) <= Date.now()));
  const blockingResource = errors.some(row => ['R2E_STATE_UNAVAILABLE', 'IDENTITY_MAP_UNAVAILABLE'].includes(row.code));
  const laneResourceFailure = errors.some(row => row.code === 'INTAKE_UNAVAILABLE');
  const status = resume.length ? 'RESUME' : blockingResource ? 'WAIT_RESOURCE' : candidates.length ? errors.length || laneResourceFailure ? 'READY_WITH_ITEM_ERRORS' : 'READY'
    : laneResourceFailure ? 'WAIT_RESOURCE' : errors.length ? 'INPUT_ERRORS' : 'NO_WORK';
  return {
    schemaVersion: 'R2E_REPAIR_RELEASE_SNAPSHOT_v2', workflow: 'R2E_REPAIR_RELEASE',
    createdAt: new Date().toISOString(), baseMainSha: mainSha, heads, stateHead,
    resume, candidates, errors, authorityMode: 'R1_READ_ONLY',
    metaOnlyPolicy: 'META_SIDECARE_ABSENCE_OR_VERSION_NEVER_BLOCKS_JS_RELEASE',
    rpmProjectionPolicy: 'RPM_SEMANTIC_FINAL_WITH_PROJECTION_PENDING_IS_NOT_A_HOLD',
  };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = key => { const index = args.indexOf('--' + key); return index < 0 ? null : args[index + 1]; };
  try {
    const repo = path.resolve(opt('repo') || '.'), runId = opt('run-id');
    checkGuard(repo, runId);
    const result = inventoryRepairRelease(repo);
    checkGuard(repo, runId);
    ensure(opt('out'), 'SNAPSHOT_OUTPUT_REQUIRED');
    const output = { ...result, runId };
    atomicWrite(path.resolve(opt('out')), JSON.stringify(output, null, 2) + '\n');
    console.log(JSON.stringify({ status: result.status, baseMainSha: result.baseMainSha, candidates: result.candidates.length, resume: result.resume.length, metaOnly: result.candidates.reduce((sum, c) => sum + c.r1Authority.metaOnlyFindings.length, 0), projectionPending: result.candidates.reduce((sum, c) => sum + (c.r1Authority.projectionPending || []).length, 0), errors: result.errors.length }));
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', reason: error.message })); process.exitCode = 1; }
}
