// Read-only input reuse for one projection phase. No registration, Native or
// Consumer verdict is cached. A token cannot be reused after its phase closes.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const phases = new WeakMap();
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const stable = value => JSON.stringify(value);
export class ProjectionPhaseIntegrityError extends Error {
  constructor(message) { super('projection phase integrity: ' + message); this.name = 'ProjectionPhaseIntegrityError'; }
}
const fail = message => { throw new ProjectionPhaseIntegrityError(message); };
const git = (root, args) => execFileSync('git', args, {
  cwd: root, encoding: 'utf8', maxBuffer: 1 << 28,
  env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' }, stdio: ['ignore', 'pipe', 'pipe']
});
function fileDigest(file) {
  const hash = crypto.createHash('sha256'), buffer = Buffer.allocUnsafe(256 * 1024);
  const fd = fs.openSync(file, 'r');
  try { let size; while ((size = fs.readSync(fd, buffer, 0, buffer.length, null))) hash.update(buffer.subarray(0, size)); }
  finally { fs.closeSync(fd); }
  return hash.digest('hex');
}
function under(root, relative) {
  const full = path.resolve(root, relative);
  if (full === root || !full.startsWith(root + path.sep) || relative.includes('\0')) fail('input path escapes checkout');
  return full;
}
// Include all tracked/nonignored files plus generated canonical inputs which are
// intentionally ignored by Git (for example mixed source-verification shards).
export function projectionSnapshot(root) {
  root = fs.realpathSync(root);
  const head = git(root, ['rev-parse', '--verify', 'HEAD']).trim();
  const refs = git(root, ['for-each-ref', '--format=%(refname) %(objectname)']);
  const headFile = path.resolve(root, git(root, ['rev-parse', '--git-path', 'HEAD']).trim());
  const indexFile = path.resolve(root, git(root, ['rev-parse', '--git-path', 'index']).trim());
  const index = fs.existsSync(indexFile) ? fileDigest(indexFile) : null;
  const paths = new Set(git(root, ['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean));
  function walk(relative) {
    const full = under(root, relative);
    if (!fs.existsSync(full)) return;
    const st = fs.lstatSync(full);
    if (!st.isDirectory()) { paths.add(relative); return; }
    for (const name of fs.readdirSync(full).sort()) walk(relative + '/' + name);
  }
  walk('archive/data');
  const hash = crypto.createHash('sha256'); let present = 0;
  for (const relative of [...paths].sort()) {
    const full = under(root, relative); let row;
    try {
      const st = fs.lstatSync(full);
      if (st.isFile()) row = [relative, st.mode & 0o777, 'file', st.size, fileDigest(full)];
      else if (st.isSymbolicLink()) {
        const target = fs.realpathSync(full);
        if (!target.startsWith(root + path.sep) || !fs.statSync(target).isFile()) fail('input symlink is not a checkout file');
        row = [relative, st.mode & 0o777, 'symlink', fs.readlinkSync(full), fileDigest(target)];
      } else fail('input is not a regular file: ' + relative);
      present++;
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      row = [relative, 'missing'];
    }
    hash.update(stable(row) + '\n');
  }
  const raw = { schemaVersion: 'archive-reviewed-projection-snapshot-v1', head,
    headRawSha256: fileDigest(headFile), indexRawSha256: index, refsSha256: sha(refs),
    inputFileCount: paths.size, presentFileCount: present, inputRawSha256: hash.digest('hex') };
  return Object.freeze({ ...raw, sha256: sha(stable(raw)) });
}
function requireState(token, root) {
  const state = phases.get(token);
  if (!state || !state.active || state.root !== fs.realpathSync(root)) fail('unissued, closed or foreign-root context');
  return state;
}
export function createProjectionPhase(root, expectedSnapshotSha256 = null) {
  root = fs.realpathSync(root);
  const snapshot = projectionSnapshot(root);
  if (expectedSnapshotSha256 !== null && snapshot.sha256 !== expectedSnapshotSha256) fail('worker input snapshot differs from phase');
  const token = Object.freeze({ schemaVersion: 'archive-issued-reviewed-projection-phase-v1' });
  phases.set(token, { root, active: true, snapshot, inputs: new Map(), loads: new Map() });
  return token;
}
export function requireProjectionPhase(token, { root, write, verifyProjection }) {
  if (write !== false || verifyProjection !== true) fail('context is restricted to read-only projection verification');
  requireState(token, root); return token;
}
// Plain records/arrays stay cloneable; Map/Set mutators fail closed. Canonical
// lookup containers are shallow-copied by their caller so add-only replay can
// restore its private lookup wrapper without changing shared definitions.
function freezeInput(value, seen = new WeakMap()) {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Map || value instanceof Set) {
    const isMap = value instanceof Map, target = isMap ? new Map() : new Set();
    const mutators = new Set(isMap ? ['set', 'delete', 'clear'] : ['add', 'delete', 'clear']);
    const bound = new Map(); let proxy;
    proxy = new Proxy(target, {
      get(object, key) {
        if (mutators.has(key)) return () => fail('attempt to mutate shared input');
        if (key === 'forEach') return (callback, thisArg) => {
          if (typeof callback !== 'function') throw new TypeError('forEach callback must be a function');
          object.forEach((v, k) => Reflect.apply(callback, thisArg, [v, k, proxy]));
        };
        if (key === 'constructor') return isMap ? Map : Set;
        if (['get', 'has', 'entries', 'keys', 'values'].includes(key) || key === Symbol.iterator) {
          if (!bound.has(key)) bound.set(key, object[key].bind(object));
          return bound.get(key);
        }
        const result = Reflect.get(object, key, object);
        return typeof result === 'function' ? result.bind(proxy) : result;
      },
      set() { fail('attempt to mutate shared input'); },
      defineProperty() { fail('attempt to mutate shared input'); },
      deleteProperty() { fail('attempt to mutate shared input'); },
      setPrototypeOf() { fail('attempt to mutate shared input'); }
    });
    seen.set(value, proxy);
    if (isMap) for (const [key, row] of value) target.set(freezeInput(key, seen), freezeInput(row, seen));
    else for (const row of value) target.add(freezeInput(row, seen));
    Object.freeze(target); return proxy;
  }
  // Detach the stored input from the producer's object too. A retained loader
  // reference cannot mutate the shared value after it has entered the phase.
  const copy = Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value));
  seen.set(value, copy);
  for (const key of Reflect.ownKeys(value)) {
    if (Array.isArray(value) && key === 'length') continue;
    const d = Object.getOwnPropertyDescriptor(value, key);
    if (d && 'value' in d) d.value = freezeInput(d.value, seen);
    Object.defineProperty(copy, key, d);
  }
  if (Array.isArray(value)) Object.defineProperty(copy, 'length', Object.getOwnPropertyDescriptor(value, 'length'));
  return Object.freeze(copy);
}

export function projectionInput(token, root, key, load) {
  const state = requireState(token, root);
  if (!(key === 'canonical-tables' || key === 'resolved-consumer-catalog' || key === 'search-source-index' ||
      key.startsWith('json:archive/data/'))) fail('input cache key outside allowlist');
  if (!state.inputs.has(key)) {
    const value = freezeInput(load());
    state.inputs.set(key, value); state.loads.set(key, (state.loads.get(key) || 0) + 1);
  }
  return state.inputs.get(key);
}
export function projectionPhaseSummary(token, root) {
  const state = requireState(token, root);
  return { snapshot: state.snapshot, inputLoads: Object.fromEntries(state.loads), cachedVerdicts: 0 };
}
export function assertProjectionPhaseUnchanged(token, root) {
  const state = requireState(token, root), actual = projectionSnapshot(root);
  if (actual.sha256 !== state.snapshot.sha256) fail('HEAD, index, refs or raw checkout input changed');
  return actual;
}
export function closeProjectionPhase(token, root) {
  const state = requireState(token, root);
  try { assertProjectionPhaseUnchanged(token, root); return projectionPhaseSummary(token, root); }
  finally { state.active = false; state.inputs.clear(); }
}
