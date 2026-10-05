import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
export const INTAKES = Object.freeze({ m2: 'work/intake/m2', m3: 'work/intake/m3' });
export const STATE_BRANCH = 'work/r2e-state';
export const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
export const ensure = (condition, reason) => { if (!condition) throw new Error(reason); };
export const id = () => crypto.randomUUID();
export const git = (repo, args, options = {}) => execFileSync('git', ['-C', repo, ...args], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'], ...options });
export const commonRoot = repo => path.resolve(repo, git(repo, ['rev-parse', '--git-common-dir']).trim(), 'r2e');
export const digest = value => sha(JSON.stringify(value));
export function atomicWrite(target, bytes) {
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const temporary = `${target}.${id()}.next`, fd = fs.openSync(temporary, 'wx');
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
  fs.renameSync(temporary, target);
}
export function relative(value) {
  ensure(typeof value === 'string' && value && !value.startsWith('/') && !value.includes('\\') && !value.includes(':') && !value.includes('\0') && value.split('/').every(p => p && p !== '.' && p !== '..'), 'UNSAFE_PATH'); return value;
}
export function blob(repo, at, rel) {
  ensure(/^[0-9a-f]{40}$/.test(at), 'FULL_COMMIT_SHA_REQUIRED'); relative(rel);
  ensure(/^100(?:644|755)\s/.test(git(repo, ['ls-tree', at, '--', rel])), 'REGULAR_GIT_BLOB_REQUIRED');
  return git(repo, ['show', `${at}:${rel}`], { encoding: null });
}
export const files = (repo, at, prefix) => git(repo, ['ls-tree', '-r', '--name-only', '-z', at, '--', prefix]).split('\0').filter(Boolean);
export function fetchRef(repo, branch) {
  ensure(branch === 'main' || branch === STATE_BRANCH || Object.values(INTAKES).includes(branch), 'REF_NOT_ALLOWLISTED');
  const ref = `refs/remotes/origin/${branch}`;
  git(repo, ['fetch', '--no-tags', 'origin', `refs/heads/${branch}:${ref}`]);
  return git(repo, ['rev-parse', ref]).trim();
}
