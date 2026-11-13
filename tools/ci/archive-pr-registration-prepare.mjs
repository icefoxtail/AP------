#!/usr/bin/env node
// PR checks consume a temporary registration projection, never a bot commit on the PR.
// The event base and checked-out merge snapshot are fixed; a later origin/main does not
// change the input being checked. The ordinary registration workflow owns its verification.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadPatterns } from './push-touches-paths.mjs';
import { selectNativeRequests, applyNativeRequests, emptyNativePreview } from './archive-pr-native-preview.mjs';

const SHA = /^[0-9a-f]{40}$/i;
const INPUTS = [
  // Archive producers import shared runtime modules and canonical data. Until a
  // dependency is classified explicitly, rebuild conservatively in the runner.
  /^archive\//,
  /^\.archive-meta-register\/inbox\/[^/]+\.json$/,
  /^docs\/rules\/01_CANONICAL\/taxonomy\//,
  /^tools\/ci\/(?:archive-pr-registration-prepare\.mjs|archive-pr-native-preview\.mjs|archive-pages-registration\.paths|push-touches-paths\.mjs)$/,
];

export function registrationInputsChanged(paths) {
  // An unavailable diff never proves that a registration build is unnecessary.
  return !Array.isArray(paths) || paths.some(file => INPUTS.some(re => re.test(file.normalize('NFC'))));
}

function execute(command, args, root, inherit = false) {
  const result = spawnSync(command, args, {
    cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    stdio: inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return result.stdout || '';
}

export function preparePrRegistration({ root = process.cwd(), eventName, event, expectedSha = '', run = execute }) {
  if (!['pull_request', 'push'].includes(eventName)) return { state: 'NO_OP', reason: 'no source event; no temporary projection requested' };
  const baseSha = eventName === 'pull_request' ? event?.pull_request?.base?.sha : event?.before;
  const inputHeadSha = eventName === 'pull_request' ? event?.pull_request?.head?.sha : event?.after;
  if (!SHA.test(baseSha || '') || !SHA.test(inputHeadSha || '')) throw new Error('source event must identify exact base and head commit SHAs');
  const git = args => run('git', args, root);
  const headSha = git(['rev-parse', '--verify', 'HEAD']).trim();
  if (!SHA.test(headSha)) throw new Error('checkout has no exact commit SHA');
  if (expectedSha && (!SHA.test(expectedSha) || headSha.toLowerCase() !== expectedSha.toLowerCase())) {
    throw new Error('checkout does not match the source event snapshot SHA');
  }
  git(['merge-base', '--is-ancestor', baseSha, headSha]);
  git(['merge-base', '--is-ancestor', inputHeadSha, headSha]);
  let paths;
  try { paths = git(['diff', '--name-only', '--no-renames', '-z', baseSha, headSha, '--']).split('\0').filter(Boolean); }
  catch { paths = null; }
  const report = { baseSha, inputHeadSha, headSha, changedPathCount: paths?.length ?? null };
  if (!registrationInputsChanged(paths)) {
    return { ...report, state: 'NO_OP', reason: 'no registration input changed in the fixed source snapshot' };
  }
  // This command is for a disposable CI checkout. Never overwrite local unfinished work.
  if (git(['status', '--porcelain', '-z', '--untracked-files=all']).length) throw new Error('temporary registration preparation requires a clean CI checkout');
  const nativePreview = emptyNativePreview();
  if (eventName === 'pull_request') {
    nativePreview.requests = selectNativeRequests({ root, baseSha, headSha });
    nativePreview.plans = applyNativeRequests({ root, requests: nativePreview.requests, run });
  }
  run(process.execPath, ['archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs', '--write'], root, true);
  if (nativePreview.requests.length) run(process.execPath, ['archive/tools/meta-foundation/compile-meta-foundation.mjs', '--write'], root, true);
  run('python3', ['archive/build_db.py'], root, true);
  if (git(['rev-parse', '--verify', 'HEAD']).trim() !== headSha) throw new Error('temporary preparation must not create or change a commit');
  const generated = [...new Set([
    ...git(['diff', '--name-only', '-z', 'HEAD', '--']).split('\0'),
    ...git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0'),
  ].filter(Boolean))].sort();
  const allowed = loadPatterns(path.join(root, 'tools/ci/archive-pages-registration.paths'));
  const nativePaths = new Set(nativePreview.plans.flatMap(plan => plan.plannedPaths));
  const unexpected = generated.filter(file => !nativePaths.has(file) && !allowed.some(re => re.test(file.normalize('NFC'))));
  if (unexpected.length) throw new Error(`registration preparation changed non-derived files: ${unexpected.join(', ')}`);
  return { ...report, state: 'PREPARED', reason: paths ? 'registration input changed' : 'scope unavailable; conservative registration build', generatedPaths: generated, nativePreview };
}

function main() {
  let event = null;
  if (['pull_request', 'push'].includes(process.env.GITHUB_EVENT_NAME)) event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  const result = preparePrRegistration({ eventName: process.env.GITHUB_EVENT_NAME, event, expectedSha: process.env.GITHUB_SHA });
  console.log(JSON.stringify(result, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `Temporary registration preparation: **${result.state}** — ${result.reason}\n` +
      (result.headSha ? `Snapshot \`${result.headSha}\`; base \`${result.baseSha}\`. This is temporary generation; tests supply the technical verdict.\n` : ''));
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
