// Small shared helpers of the golden gate: hashing, git, process, file walking. No engine code is imported here.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawn, spawnSync} from 'node:child_process';

export const sha256 = data => crypto.createHash('sha256').update(data).digest('hex');
export const fileSha = file => sha256(fs.readFileSync(file));
export const posix = p => p.split(path.sep).join('/');
export const sleep = ms => new Promise(r => setTimeout(r, ms));

// Run git and return stdout as a Buffer; throws with stderr on failure.
export function git(repo, args, {input, allowFail = false, env} = {}) {
  const r = spawnSync('git', args, {cwd: repo, input, maxBuffer: 1 << 30, windowsHide: true, env: env ? {...process.env, ...env} : process.env});
  if (r.error) throw r.error;
  if (r.status !== 0 && !allowFail) throw new Error(`git ${args.slice(0, 4).join(' ')} failed (${r.status}): ${String(r.stderr).slice(0, 400)}`);
  return r.status === 0 ? r.stdout : null;
}
export const gitText = (repo, args, opts) => { const b = git(repo, args, opts); return b === null ? null : b.toString('utf8'); };

// Split a NUL separated git listing.
export const nulList = buf => buf.toString('utf8').split('\0').filter(Boolean);

export function walkFiles(root, {skip = () => false} = {}) {
  const out = [];
  const walk = dir => {
    for (const e of fs.readdirSync(dir, {withFileTypes: true})) {
      const p = path.join(dir, e.name);
      const rel = posix(path.relative(root, p));
      if (skip(rel, e)) continue;
      if (e.isDirectory()) walk(p);
      else if (e.isFile()) out.push(rel);
    }
  };
  if (fs.existsSync(root)) walk(root);
  return out.sort();
}

export function mkdirp(dir) { fs.mkdirSync(dir, {recursive: true}); return dir; }
export function readJson(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
export function writeJson(file, value) { mkdirp(path.dirname(file)); fs.writeFileSync(file, JSON.stringify(value, null, 1) + '\n'); }

// Kill a child process and its children (Windows needs taskkill /T).
export function killTree(child) {
  if (!child || child.exitCode !== null || !child.pid) return;
  try {
    if (process.platform === 'win32') spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], {windowsHide: true});
    else process.kill(-child.pid, 'SIGKILL');
  } catch { try { child.kill('SIGKILL'); } catch { /* already gone */ } }
}

// Run a command; resolves {code, stdout, stderr, timedOut}. onLine is called for every stdout line.
export function run(cmd, args, {cwd, env, timeoutMs = 0, onLine, idleMs = 0, lines = true} = {}) {
  return new Promise(resolve => {
    const child = spawn(cmd, args, {cwd, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32'});
    let stdout = '', stderr = '', timedOut = false, buf = '';
    let idleTimer = null;
    const bump = () => { if (idleMs) { clearTimeout(idleTimer); idleTimer = setTimeout(() => { timedOut = 'idle'; killTree(child); }, idleMs); } };
    bump();
    child.stdout.on('data', d => {
      bump();
      const s = d.toString('utf8'); stdout += s;
      if (stdout.length > 4e6) stdout = stdout.slice(-2e6);
      if (onLine && lines) { buf += s; let i; while ((i = buf.indexOf('\n')) >= 0) { onLine(buf.slice(0, i)); buf = buf.slice(i + 1); } }
    });
    child.stderr.on('data', d => { bump(); stderr += d.toString('utf8'); if (stderr.length > 4e6) stderr = stderr.slice(-2e6); });
    const timer = timeoutMs ? setTimeout(() => { timedOut = 'total'; killTree(child); }, timeoutMs) : null;
    child.on('close', code => { clearTimeout(timer); clearTimeout(idleTimer); resolve({code, stdout, stderr, timedOut}); });
    child.on('error', error => { clearTimeout(timer); clearTimeout(idleTimer); resolve({code: -1, stdout, stderr: String(error), timedOut}); });
  });
}

export const fmtDuration = ms => { const s = Math.round(ms / 1000); return s >= 3600 ? `${Math.floor(s / 3600)}h${String(Math.floor(s % 3600 / 60)).padStart(2, '0')}m` : s >= 60 ? `${Math.floor(s / 60)}m${String(s % 60).padStart(2, '0')}s` : `${s}s`; };
