// One judgment for "does the current LOCKED RPM master still honour an older pinned master?".
//
// The master is add-only authority: new L3/L4 leaves are appended, nothing already there is
// renamed, changed, removed or reordered. An issued receipt pins the master by sha256 of the
// bytes it saw, so each legitimate growth used to make every older receipt look "drifted".
// A pinned sha256 is therefore accepted when either
//   1. the current bytes are exactly those bytes, or
//   2. the pinned bytes are a real Git revision of this same path (reachable from HEAD) and the
//      current master retains every node of that revision, unchanged and in relative order.
// Anything else (value changed, node removed or reordered, schema/LOCKED status changed, a sha
// that is no revision of the path) is rejected. If Git history cannot be read (shallow or
// partial checkout, no repository) the judgment throws instead of silently passing or failing.
// Only the master uses this rule; every other evidence file stays byte-exact.
import fs from 'node:fs';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export const RPM_MASTER_PATH = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

// Every node of `old` is present in `current` with the same value; arrays may gain elements
// anywhere but must keep the retained elements in order; a retained object gains no keys.
export function retainedInOrder(old, current) {
  if (Array.isArray(old)) {
    if (!Array.isArray(current)) return false;
    let at = 0;
    for (const item of old) {
      while (at < current.length && !retainedInOrder(item, current[at])) at += 1;
      if (at >= current.length) return false;
      at += 1;
    }
    return true;
  }
  if (old && typeof old === 'object') {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return false;
    const keys = Object.keys(old);
    return keys.length === Object.keys(current).length
      && keys.every(key => Object.hasOwn(current, key) && retainedInOrder(old[key], current[key]));
  }
  return old === current;
}

export class RpmMasterHistoryUnavailable extends Error {
  constructor(detail) { super(`RPM master Git history unavailable: ${detail}`); this.name = 'RpmMasterHistoryUnavailable'; }
}

const revisionCache = new Map(); // repository root -> Map(sha256 -> master bytes) or the Error, built once per process
let gitCalls = 0;
const verdictCache = new Map();  // root:pinned:current -> verdict

function git(root, args, input = '') {
  gitCalls += 1;
  try {
    return execFileSync('git', args, { cwd: root, env: { ...process.env, GIT_NO_LAZY_FETCH: '1' }, input,
      maxBuffer: 256 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) {
    throw new RpmMasterHistoryUnavailable(`git ${args[0]} failed (${String(error.stderr || error.message).trim().split('\n')[0]})`);
  }
}

// sha256 of every committed revision of the master reachable from HEAD, computed once per root.
// A failure is remembered and warned about once, because the registrar's receipt loops catch errors.
function revisions(root) {
  if (!revisionCache.has(root)) {
    try { revisionCache.set(root, readRevisions(root)); }
    catch (error) { revisionCache.set(root, error); process.emitWarning(error.message, 'RpmMasterHistoryUnavailable'); }
  }
  const value = revisionCache.get(root);
  if (value instanceof Error) throw value;
  return value;
}
function readRevisions(root) {
  if (git(root, ['rev-parse', '--is-shallow-repository']).toString().trim() !== 'false')
    throw new RpmMasterHistoryUnavailable('shallow checkout (fetch-depth: 0 is required)');
  const commits = git(root, ['log', '--format=%H', '--full-history', '--', RPM_MASTER_PATH]).toString().split(/\s+/).filter(Boolean);
  if (!commits.length) throw new RpmMasterHistoryUnavailable('no commit of the master is reachable from HEAD');
  const blobs = new Set();
  const wanted = commits.map(commit => `${commit}:${RPM_MASTER_PATH}\n`).join('');
  for (const line of git(root, ['cat-file', '--batch-check'], wanted).toString().split('\n')) {
    const [id, type] = line.trim().split(' ');
    if (type === 'blob' && /^[a-f0-9]{40}$/.test(id)) blobs.add(id);
  }
  const byDigest = new Map();
  for (const blob of blobs) { const bytes = git(root, ["cat-file", "blob", blob]); byDigest.set(sha256(bytes), bytes); }
  return byDigest;
}

// -> { ok, mode: 'BYTES_EQUAL' | 'ADD_ONLY_FROM_GIT_HISTORY' | null, reason, bytes }
// `bytes` are the pinned (historical) bytes when ok, so a caller can hand them back as the evidence.
export function judgeLockedMaster({ root, pinnedSha256, currentBytes = null }) {
  if (!/^[a-f0-9]{64}$/.test(pinnedSha256 || '')) return { ok: false, mode: null, reason: 'pinned master sha256 invalid', bytes: null };
  root = fs.realpathSync(root);
  const current = currentBytes || fs.readFileSync(`${root}/${RPM_MASTER_PATH}`), currentSha = sha256(current);
  if (currentSha === pinnedSha256) return { ok: true, mode: 'BYTES_EQUAL', reason: null, bytes: current };
  const key = `${root}:${pinnedSha256}:${currentSha}`;
  if (verdictCache.has(key)) return verdictCache.get(key);
  let verdict;
  const pinned = revisions(root).get(pinnedSha256);
  if (!pinned) verdict = { ok: false, mode: null, reason: 'pinned master is not a Git revision of the LOCKED master', bytes: null };
  else {
    let old, now;
    try { old = JSON.parse(pinned.toString('utf8')); now = JSON.parse(current.toString('utf8')); }
    catch { old = now = null; }
    const ok = !!old && !!now && old.schemaVersion === now.schemaVersion
      && old.authorityStatus === 'LOCKED' && now.authorityStatus === 'LOCKED' && retainedInOrder(old, now);
    verdict = ok ? { ok: true, mode: 'ADD_ONLY_FROM_GIT_HISTORY', reason: null, bytes: pinned }
      : { ok: false, mode: null, reason: 'current master does not retain every node of the pinned revision', bytes: null };
  }
  verdictCache.set(key, verdict);
  return verdict;
}

// Evidence bytes whose sha256 equals the pinned value when the pin is honoured, else the current
// bytes (so the caller's ordinary digest comparison fails). Throws when history is needed but unreadable.
export function lockedMasterEvidenceBytes({ root, pinnedSha256, currentBytes }) {
  const verdict = judgeLockedMaster({ root, pinnedSha256, currentBytes });
  return verdict.ok ? verdict.bytes : currentBytes;
}

export function rpmMasterGitCallCount() { return gitCalls; }
export function resetRpmMasterHistoryCache() { revisionCache.clear(); verdictCache.clear(); }
