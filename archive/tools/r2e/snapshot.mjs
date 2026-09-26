#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTAKES, STATE_BRANCH, atomicWrite, blob, digest, ensure, fetchRef, files, git, relative, sha } from './common.mjs';
import { checkGuard } from './guard.mjs';
import { parseQuestionBank } from '../meta-foundation/reviewed-apply-core.mjs';
import { META_RESOLUTION_SCHEMA, validateR2EIntakeMetaReceipt } from '../meta-foundation/rpm-active-resolver.mjs';

const required = ['examUid', 'examFile', 'grade', 'lane', 'stage', 'sourceBlobSha', 'inputCommit', 'totalQuestions', 'changedQuestions', 'changedSvgFiles', 'metaDispositionSummary', 'metaResolutionEvidenceRef', 'metaResolverContractVersion', 'unresolvedItems', 'authorityRefs', 'nextState', 'updatedAt'];
const fullExamPath = value => value.startsWith('archive/exams/') ? value : `archive/exams/${value.replace(/^exams\//, '')}`;
export function inventory(repo, { fetch = true, metaAuthorityRoot = repo } = {}) {
  const heads = {}, errors = [], candidates = [], checkpoints = [];
  // Capture both authoritative HEADs before looking inside either tree.
  for (const [grade, branch] of Object.entries(INTAKES)) {
    try { heads[grade] = { branch, sha: fetch ? fetchRef(repo, branch) : git(repo, ['rev-parse', `refs/remotes/origin/${branch}`]).trim() }; }
    catch (error) { errors.push({ grade, code: 'INTAKE_UNAVAILABLE', reason: error.message }); }
  }
  const stateRemote = git(repo, ['ls-remote', '--heads', 'origin', STATE_BRANCH]).trim();
  let stateHead = null;
  if (stateRemote) {
    stateHead = fetch ? fetchRef(repo, STATE_BRANCH) : git(repo, ['rev-parse', `refs/remotes/origin/${STATE_BRANCH}`]).trim();
    for (const grade of ['m2', 'm3']) for (const rel of files(repo, stateHead, `archive/data/r2e/${grade}/exams/`).filter(p => p.endsWith('.json'))) {
      try { checkpoints.push({ grade, path: rel, stateCommit: stateHead, ledger: JSON.parse(blob(repo, stateHead, rel)) }); }
      catch (error) { errors.push({ path: rel, code: 'CHECKPOINT_INVALID', reason: error.message }); }
    }
  }
  for (const [grade, head] of Object.entries(heads)) {
    const seen = new Set();
    for (const rel of files(repo, head.sha, `archive/data/r2e-intake/${grade}/`).filter(p => p.endsWith('.json'))) {
      try {
        const receiptBytes = blob(repo, head.sha, rel), receipt = JSON.parse(receiptBytes);
        if (receipt.nextState !== 'READY_FOR_R2E') continue;
        ensure(required.every(k => Object.hasOwn(receipt, k)), 'READY_REQUIRED_FIELD_MISSING');
        const declaredGrade = String(receipt.grade).replace('중', 'm').toLowerCase();
        ensure(declaredGrade === grade, 'RECEIPT_GRADE_MISMATCH');
        const examFile = relative(fullExamPath(receipt.examFile));
        ensure(examFile.startsWith(`archive/exams/original/middle/${grade}/`) && examFile.endsWith('.js'), 'EXAM_GRADE_PATH_MISMATCH');
        ensure(!seen.has(receipt.examUid), 'DUPLICATE_READY_EXAM'); seen.add(receipt.examUid);
        ensure(/^[0-9a-f]{40}$/.test(receipt.inputCommit), 'INPUT_COMMIT_REQUIRED');
        git(repo, ['merge-base', '--is-ancestor', receipt.inputCommit, head.sha]);
        const inputCommit = git(repo, ['log', '-1', '--format=%H', head.sha, '--', rel]).trim();
        const js = blob(repo, inputCommit, examFile);
        ensure(sha(js) === sha(blob(repo, head.sha, examFile)), 'POST_RECEIPT_INPUT_DRIFT');
        ensure(receipt.metaResolutionEvidenceRef && typeof receipt.metaResolutionEvidenceRef.path === 'string'
          && /^[a-f0-9]{64}$/.test(String(receipt.metaResolutionEvidenceRef.sha256 || '').replace(/^sha256:/, '')), 'META_RESOLVER_EVIDENCE_REF_REQUIRED');
        ensure(receipt.metaResolverContractVersion === META_RESOLUTION_SCHEMA, 'META_RESOLVER_CONTRACT_VERSION_MISMATCH');
        const metaEvidencePath = relative(receipt.metaResolutionEvidenceRef.path);
        ensure(metaEvidencePath.startsWith(`archive/data/r2e-intake/${grade}/`), 'META_RESOLVER_EVIDENCE_PATH_INVALID');
        const metaEvidenceBytes = blob(repo, inputCommit, metaEvidencePath);
        const metaEvidenceSha = sha(metaEvidenceBytes);
        ensure(metaEvidenceSha === String(receipt.metaResolutionEvidenceRef.sha256).replace(/^sha256:/, ''), 'META_RESOLVER_EVIDENCE_SHA_MISMATCH');
        const metaEvidence = JSON.parse(metaEvidenceBytes.toString('utf8'));
        const sourceQuestions = parseQuestionBank(js.toString('utf8'), examFile);
        ensure(sourceQuestions.length === receipt.totalQuestions, 'META_RESOLVER_SOURCE_DENOMINATOR_MISMATCH');
        const metaCheck = validateR2EIntakeMetaReceipt(metaEvidence, {
          sourceArchiveFile: examFile.replace(/^archive\/exams\//, ''), sourceQuestions, repoRoot: metaAuthorityRoot,
        });
        ensure(metaCheck.status === 'PASS', `META_RESOLVER_EVIDENCE_INVALID:${metaCheck.errors.slice(0, 8).join(',')}`);
        const dispositionCounts = Object.fromEntries(metaEvidence.items.reduce((rows, item) => {
          rows.set(item.disposition, (rows.get(item.disposition) || 0) + 1); return rows;
        }, new Map()));
        ensure(JSON.stringify(Object.entries(dispositionCounts).sort()) === JSON.stringify(Object.entries(receipt.metaDispositionSummary || {}).sort()), 'META_DISPOSITION_SUMMARY_MISMATCH');
        ensure(Number.isSafeInteger(receipt.totalQuestions) && receipt.totalQuestions > 0 && Array.isArray(receipt.unresolvedItems) && Array.isArray(receipt.authorityRefs), 'RECEIPT_DENOMINATOR_OR_EVIDENCE_INVALID');
        const svgFiles = receipt.changedSvgFiles.map(value => relative(typeof value === 'string' ? value : value.path));
        const assets = svgFiles.map(rel => { const bytes = blob(repo, inputCommit, rel); ensure(sha(bytes) === sha(blob(repo, head.sha, rel)), 'POST_RECEIPT_SVG_DRIFT'); return { path: rel, sha256: sha(bytes) }; });
        const source = String(receipt.sourceBlobSha).replace(/^sha256:/, ''); ensure(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(source), 'SOURCE_SHA_REQUIRED');
        const inputSha256 = digest({ examFile, jsSha256: sha(js), assets, metaEvidenceSha256: metaEvidenceSha, sourceBlobSha: receipt.sourceBlobSha, receiptSha256: sha(receiptBytes) });
        const prior = checkpoints.find(c => c.grade === grade && c.ledger.examUid === receipt.examUid && c.ledger.inputCommit === inputCommit && c.ledger.finalStatus === 'R2E_MAIN_FINAL');
        if (!prior) candidates.push({ grade, intakeBranch: head.branch, intakeHead: head.sha, inputCommit, declaredInputCommit: receipt.inputCommit, examFile, examUid: receipt.examUid, receiptPath: rel, receiptSha256: sha(receiptBytes), jsSha256: sha(js), assets, inputSha256, receipt });
      } catch (error) { errors.push({ grade, path: rel, code: 'INVALID_READY_RECEIPT', reason: error.message }); }
    }
  }
  const resume = checkpoints.filter(c => !['R2E_MAIN_FINAL', 'HUMAN_REQUIRED'].includes(c.ledger.finalStatus) && (!c.ledger.retryAfter || Date.parse(c.ledger.retryAfter) <= Date.now()));
  return { schemaVersion: 'R2E_SNAPSHOT_v1', status: resume.length ? 'RESUME' : candidates.length ? 'READY' : errors.length ? 'WAIT_RESOURCE' : 'NO_WORK', createdAt: new Date().toISOString(), heads, stateHead, resume, candidates, errors };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), opt = k => { const i = args.indexOf(`--${k}`); return i < 0 ? null : args[i + 1]; };
  try {
    const repo = path.resolve(opt('repo') || '.'), runId = opt('run-id'); checkGuard(repo, runId);
    const result = inventory(repo); checkGuard(repo, runId);
    ensure(opt('out'), 'SNAPSHOT_OUTPUT_REQUIRED'); atomicWrite(path.resolve(opt('out')), JSON.stringify({ ...result, runId }, null, 2) + '\n');
    console.log(JSON.stringify({ status: result.status, out: opt('out'), candidates: result.candidates.length, resume: result.resume.length, errors: result.errors.length }));
  } catch (error) { console.log(JSON.stringify({ status: 'FAIL', reason: error.message })); process.exitCode = 1; }
}
