#!/usr/bin/env node
// Runs generated registration requests through the real registrar in READ-ONLY mode (write=false) against a
// throw-away overlay root OUTSIDE the repository. The overlay hard-links the few data files the registrar reads
// and holds the request's evidence files as real files, so nothing in the repository changes.
//   node dry-run-requests.mjs --build-out <dir written by build-requests --out> --overlay <empty dir outside repo> [--request <id>...]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { realTarget } from './build-requests.mjs';

const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const LINK_DIRS = ['archive/data/meta-foundation/canonical', 'archive/data/meta-foundation/compiled', 'archive/data/meta-foundation/crosswalks',
  'archive/data/meta-foundation/runtime', 'archive/data/meta-foundation/extensions', 'archive/data/meta-foundation/exam-scoped',
  'archive/data/master_tables', 'archive/data/meta-os'];
const LINK_FILES = ['archive/data/question_metadata.json', 'archive/data/question_identity_map.json', 'archive/data/archive2-extension-keys.json',
  'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json'];

function linkFile(from, to) {
  if (fs.existsSync(to)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  try { fs.linkSync(from, to); } catch { fs.copyFileSync(from, to); }
}
function linkTree(srcRoot, dstRoot, rel) {
  const src = path.join(srcRoot, rel);
  if (!fs.existsSync(src)) return;
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (e.isDirectory()) linkTree(srcRoot, dstRoot, `${rel}/${e.name}`);
    else linkFile(path.join(src, e.name), path.join(dstRoot, rel, e.name));
  }
}
export function ensureOverlay({ repo, overlay, exams = [], repoFiles = new Map() }) {
  const repoReal = fs.realpathSync(repo);
  const planned = realTarget(overlay);
  if (planned === repoReal || planned.startsWith(repoReal + path.sep)) throw new Error('OVERLAY_INSIDE_REPOSITORY');
  fs.mkdirSync(overlay, { recursive: true });
  const overlayReal = fs.realpathSync(overlay);
  for (const dir of LINK_DIRS) linkTree(repoReal, overlayReal, dir);
  for (const file of LINK_FILES) if (fs.existsSync(path.join(repoReal, file))) linkFile(path.join(repoReal, file), path.join(overlayReal, file));
  for (const exam of exams) linkFile(path.join(repoReal, 'archive/exams', exam), path.join(overlayReal, 'archive/exams', exam));
  for (const [rel, content] of repoFiles) {
    const target = path.join(overlayReal, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
  }
  return overlayReal;
}
function readTree(dir, base = dir) {
  const out = new Map();
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) for (const [k, v] of readTree(full, base)) out.set(k, v);
    else out.set(path.relative(base, full).split(path.sep).join('/'), fs.readFileSync(full, 'utf8'));
  }
  return out;
}
export async function dryRun({ repo = here, buildOut, overlay, requestIds = null, registrar }) {
  const requestsDir = path.join(buildOut, 'requests');
  const files = fs.readdirSync(requestsDir).filter(n => n.endsWith('.json')).sort();
  const repoFiles = readTree(path.join(buildOut, 'repo-files'));
  const requests = files.map(n => JSON.parse(fs.readFileSync(path.join(requestsDir, n), 'utf8')))
    .filter(r => !requestIds || requestIds.includes(r.requestId));
  const root = ensureOverlay({ repo, overlay, exams: requests.map(r => r.sourceArchiveFile), repoFiles });
  const { registerReviewedExamV2 } = registrar || await import(pathToFileURL(path.join(repo, 'archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs')).href);
  const results = [];
  for (const request of requests) {
    const started = Date.now();
    try {
      const result = registerReviewedExamV2({ root, request, write: false, verifyProjection: false });
      results.push({ requestId: request.requestId, sourceArchiveFile: request.sourceArchiveFile, items: request.items.length,
        registryChanges: request.registryChanges?.length || 0, status: result.status, plannedPaths: result.plannedPaths?.length ?? null, ms: Date.now() - started });
    } catch (error) {
      results.push({ requestId: request.requestId, sourceArchiveFile: request.sourceArchiveFile, items: request.items.length,
        registryChanges: request.registryChanges?.length || 0, status: 'REJECTED', reason: String(error.message), ms: Date.now() - started });
    }
  }
  return results;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = { buildOut: null, overlay: null, requests: [] };
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--build-out') args.buildOut = argv[++i];
    else if (argv[i] === '--overlay') args.overlay = argv[++i];
    else if (argv[i] === '--request') args.requests.push(argv[++i]);
    else throw new Error(`INVALID_ARGUMENT:${argv[i]}`);
  }
  if (!args.buildOut || !args.overlay) throw new Error('BUILD_OUT_AND_OVERLAY_REQUIRED');
  const results = await dryRun({ buildOut: path.resolve(args.buildOut), overlay: path.resolve(args.overlay), requestIds: args.requests.length ? args.requests : null });
  process.stdout.write(JSON.stringify(results, null, 2) + '\n');
  if (results.some(r => r.status !== 'PASS')) process.exitCode = 2;
}
