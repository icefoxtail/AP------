#!/usr/bin/env node
// Classify the real student-consumer gate's failures before inbox consumption.
// Only failures attributable to exactly one applied request may use the existing
// rollback/reject/rebuild path. Global, ambiguous or incomplete checks stay fatal.
// This does not approve a request or replace the writer's final consumer gate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifyChangedUidConsumerApproval } from '../../archive/tools/meta-foundation/verify-changed-uid-consumer-approval.mjs';

const REQUEST_REFUSALS = new Set(['SOURCE_BLOB_MISMATCH', 'SOURCE_UNREADABLE', 'ROW_MISSING_IN_RESOLVED_CATALOG',
  'UID_MISMATCH', 'SOURCE_FINGERPRINT_MISMATCH', 'BODY_FINGERPRINT_MISMATCH', 'METADATA_CONFLICT',
  'NOT_APPROVED_IN_CONSUMER', 'NOT_IN_PROBLEM_BANK_INDEX', 'NOT_DIRECT_SELECTABLE', 'META_PIPELINE_RUNTIME_MISSING',
  'VALUE_MISMATCH', 'NOT_RETURNED_BY_PAGE_QUERY']);

export function collectConsumerRefusals(result, requests, root = process.cwd()) {
  if (!['PASS', 'FAIL'].includes(result?.status) || !Array.isArray(result.exams) || !Array.isArray(result.failures))
    throw new Error('Invalid consumer report; cannot isolate requests');
  const paths = new Map(requests.map(file => [path.resolve(root, file), file]));
  if (paths.size !== requests.length) throw new Error('Duplicate consumer request path');
  const byExam = new Map(), seen = new Set();
  for (const exam of result.exams) {
    const file = paths.get(path.resolve(root, exam.file));
    if (!file || seen.has(file)) throw new Error('Unexpected or duplicate request in consumer report');
    if (![exam.changed, exam.checked, exam.passed].every(n => Number.isSafeInteger(n) && n >= 0) ||
        exam.passed > exam.checked || exam.checked > exam.changed)
      throw new Error('Invalid consumer check denominator');
    seen.add(file);
    const entries = byExam.get(exam.exam) || [];
    entries.push(file); byExam.set(exam.exam, entries);
  }
  if (seen.size !== requests.length) throw new Error('Incomplete consumer report; cannot isolate requests');
  if (result.status === 'PASS') {
    if (result.failures.length || result.counts?.changed !== result.counts?.checked || result.counts?.checked !== result.counts?.passed ||
        result.exams.some(exam => exam.changed !== exam.checked || exam.checked !== exam.passed))
      throw new Error('Inconsistent consumer PASS report');
    return [];
  }
  if (!result.failures.length) throw new Error('Consumer failed without attributable reasons');
  const refused = new Map();
  for (const failure of result.failures) {
    const files = byExam.get(failure.exam) || [];
    if (files.length !== 1 || !REQUEST_REFUSALS.has(failure.reason))
      throw new Error(`Non-isolatable consumer failure: ${failure.reason || 'UNKNOWN'} (${failure.exam})`);
    const details = refused.get(files[0]) || [];
    details.push(`${failure.reason} Q${failure.qid}: ${failure.detail || ''}`);
    refused.set(files[0], details);
  }
  for (const exam of result.exams) {
    const file = paths.get(path.resolve(root, exam.file));
    if (!refused.has(file) && (exam.changed !== exam.checked || exam.checked !== exam.passed))
      throw new Error('Incomplete checks for a request without attributable failures');
  }
  return requests.filter(file => refused.has(file)).map(request => ({
    request, error: [...new Set(refused.get(request))].join('; ').replace(/\0/g, '\\0')
  }));
}

function main() {
  const args = process.argv.slice(2), split = args.indexOf('--');
  if (split !== 4 || args[0] !== '--report-file' || args[2] !== '--refusals-file')
    throw new Error('usage: collect-reviewed-consumer-refusals.mjs --report-file <json> --refusals-file <nul> -- <request>...');
  const requests = args.slice(split + 1).filter(file => {
    const doc = JSON.parse(fs.readFileSync(file, 'utf8'));
    // This lane has its own existing access/supplement contract in the final gate.
    return doc.approval?.type !== 'META_PIPELINE_AUDIT';
  });
  const result = requests.length ? verifyChangedUidConsumerApproval({ root: process.cwd(), requestPaths: requests }) : null;
  fs.writeFileSync(args[1], JSON.stringify(result || { status: 'NO_CHANGED_UID_INPUTS' }, null, 2) + '\n');
  const refusals = result ? collectConsumerRefusals(result, requests) : [];
  fs.writeFileSync(args[3], refusals.map(row => `${row.request}\0${row.error}\0`).join(''));
  console.log(`Consumer preflight: ${result?.status || 'NO_CHANGED_UID_INPUTS'}; request refusals=${refusals.length}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
