#!/usr/bin/env node
// This is an execution plan, not a cached test verdict. Unknown dependencies retain
// the existing suite. No mutable branch name participates in the comparison.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadSource, questionAssetReferences, localAssetPath } from '../../archive/tools/archive-content-inputs.mjs';

const SHA = /^[a-f0-9]{40}$/i;
const ORIGINAL = /^archive\/exams\/original\/.+\.js$/;
const IMAGE = /^archive\/assets\/images\/.+\.(?:svg|png|jpe?g|webp|gif)$/i;
const PLAYGROUND = /^apmath\/playground\//;
const SOURCE = /^archive\/(?:exams|generated|textbook)\/.*\.js$/;
const CONTENT_BROWSER_DEPENDENCIES = new Set([
  'tests/archive-original-exam-access.browser.cjs', 'tools/check-archive-content-browser.mjs',
  'tools/ci/archive-ci-scope.mjs', 'archive/tools/archive-content-inputs.mjs',
  '.github/workflows/archive2-runtime-guard.yml',
]);

export function git(root, args, allowNoMatch = false) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (result.error || (result.status !== 0 && !(allowNoMatch && result.status === 1))) {
    throw new Error(`git ${args[0]} failed: ${result.error?.message || result.stderr || result.status}`);
  }
  return result.stdout;
}

export function classifyPaths(files, { exists = () => true, assetConsumers = () => null } = {}) {
  const conservative = reason => ({ mode: 'full', reason, sources: [], assets: [] });
  if (!Array.isArray(files) || !files.length) return conservative('no proven bounded change set');
  if (files.every(file => PLAYGROUND.test(file))) {
    return { mode: 'playground', reason: 'only playground files changed; no Archive input or shared runtime dependency changed', sources: [], assets: [] };
  }
  if (!files.every(file => ORIGINAL.test(file) || IMAGE.test(file))) {
    return conservative('shared code, metadata, generator, test, or unclassified dependency changed');
  }
  if (files.some(file => !exists(file))) return conservative('deleted source or asset requires the existing inventory regression');
  const sources = new Set(files.filter(file => ORIGINAL.test(file)));
  const assets = files.filter(file => IMAGE.test(file));
  for (const asset of assets) {
    const consumers = assetConsumers(asset);
    if (!Array.isArray(consumers) || !consumers.length || consumers.some(file => !ORIGINAL.test(file))) {
      return conservative(`asset consumers are not proven original-only: ${asset}`);
    }
    consumers.forEach(file => sources.add(file));
  }
  if (!sources.size) return conservative('no affected original exam could be resolved');
  return { mode: 'archive-content', reason: 'only original exam JS and assets with original-only consumers changed', sources: [...sources].sort(), assets: assets.sort() };
}

function consumersAtSnapshot(root, headSha, asset) {
  // Include both filename and folder references, including the common source
  // form that constructs filenames from ordinals. Resolve candidate data banks
  // before selecting a consumer, so unrelated exams with q01.svg are not checked.
  const matches = git(root, ['grep', '-I', '-l', '-z', '-F', '-e', path.posix.basename(asset),
    '-e', path.posix.basename(path.posix.dirname(asset)), headSha, '--',
    'archive', 'apmath', 'shared', 'eie'], true).split('\0').filter(Boolean).map(value => value.slice(headSha.length + 1));
  const candidates = matches.filter(file => SOURCE.test(file) ||
    (/\.(?:js|mjs|cjs|html|css)$/i.test(file) && !file.startsWith('archive/tools/') && file !== 'archive/db.js'));
  const consumers = [];
  for (const file of candidates) {
    if (!ORIGINAL.test(file)) return null;
    try {
      const { questions } = loadSource(root, file);
      if (questions.some(question => questionAssetReferences(question).some(ref => localAssetPath(ref) === asset))) consumers.push(file);
    } catch { return null; }
  }
  return consumers;
}

export function planCiScope({ root = process.cwd(), eventName = '', event = null, expectedSha = '', baseSha: suppliedBase = '' } = {}) {
  const headSha = git(root, ['rev-parse', '--verify', 'HEAD']).trim();
  if (!SHA.test(headSha)) throw new Error('checkout must identify an exact commit');
  if (expectedSha && (!SHA.test(expectedSha) || expectedSha.toLowerCase() !== headSha.toLowerCase())) {
    throw new Error('scope checkout does not match the expected event snapshot');
  }
  let baseSha = suppliedBase;
  if (eventName === 'pull_request') {
    baseSha = event?.pull_request?.base?.sha;
    const prHead = event?.pull_request?.head?.sha;
    if (!SHA.test(baseSha || '') || !SHA.test(prHead || '')) throw new Error('PR scope requires exact event base and head SHAs');
    git(root, ['merge-base', '--is-ancestor', baseSha, headSha]);
    git(root, ['merge-base', '--is-ancestor', prHead, headSha]);
  } else if (eventName === 'push') baseSha = event?.before;
  const common = { schemaVersion: 'archive-ci-scope-v1', headSha, baseSha: baseSha || '', eventName };
  if (!SHA.test(baseSha || '') || /^0+$/.test(baseSha)) {
    return { ...common, changedFiles: null, scopedBrowserChanged: true, ...classifyPaths(null) };
  }
  let changedFiles;
  try { changedFiles = git(root, ['diff', '--name-only', '--no-renames', '-z', baseSha, headSha, '--']).split('\0').filter(Boolean).sort(); }
  catch (error) {
    if (eventName === 'pull_request') throw error;
    return { ...common, changedFiles: null, scopedBrowserChanged: true, ...classifyPaths(null) };
  }
  const classification = classifyPaths(changedFiles, {
    exists: file => fs.existsSync(path.join(root, file)),
    assetConsumers: asset => consumersAtSnapshot(root, headSha, asset),
  });
  return { ...common, changedFiles, scopedBrowserChanged: changedFiles.some(file => CONTENT_BROWSER_DEPENDENCIES.has(file)), ...classification };
}

export function readScope(file, root = process.cwd()) {
  const recorded = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (recorded.schemaVersion !== 'archive-ci-scope-v1') throw new Error('unsupported CI scope plan');
  const current = planCiScope({ root, expectedSha: recorded.headSha, baseSha: recorded.baseSha });
  for (const key of ['baseSha', 'headSha', 'changedFiles', 'mode', 'sources', 'assets', 'scopedBrowserChanged']) {
    if (JSON.stringify(recorded[key]) !== JSON.stringify(current[key])) throw new Error(`CI scope no longer matches snapshot: ${key}`);
  }
  return recorded;
}

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--output') throw new Error('usage: archive-ci-scope.mjs --output <runner-temp-file>');
  const event = process.env.GITHUB_EVENT_PATH ? JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8')) : null;
  const result = planCiScope({ eventName: process.env.GITHUB_EVENT_NAME, event,
    expectedSha: process.env.CI_CHECKOUT_SHA || process.env.GITHUB_SHA, baseSha: process.env.CI_SCOPE_BASE_SHA });
  fs.mkdirSync(path.dirname(path.resolve(args[1])), { recursive: true });
  fs.writeFileSync(args[1], `${JSON.stringify(result, null, 2)}\n`);
  if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `mode=${result.mode}\nscoped_browser_changed=${result.scopedBrowserChanged}\n`);
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,
    `### CI impact scope\n\nSnapshot \`${result.headSha}\`; base \`${result.baseSha || 'unavailable'}\`.\n\n` +
    `Selected **${result.mode}**: ${result.reason}. This selects checks; it is not a PASS for excluded areas.\n`);
  console.log(JSON.stringify(result, null, 2));
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
