// A validation process may reuse only successful immutable object-name lookups.
// Blob bytes, live reads, errors, symbolic refs and approval results never enter
// this cache; callers still perform their original raw Git and hash checks.
import path from 'node:path';

const SHA1 = /^[a-f0-9]{40}$/;
const safe = p => typeof p === 'string' && p && !path.isAbsolute(p) &&
  !/[\\\x00-\x1f]/.test(p) && !p.split('/').some(v => !v || v === '.' || v === '..');

function immutableLookup(args) {
  if (!Array.isArray(args) || args[0] !== 'rev-parse') return null;
  if (args.length === 3 && args[1] === '--verify') {
    const m = /^([a-f0-9]{40})\^\{commit\}$/.exec(args[2]);
    return m ? {commit:m[1], expected:m[1]} : null;
  }
  if (args.length === 2 && typeof args[1] === 'string') {
    const commit = args[1].slice(0,40), relative = args[1].slice(41);
    if (SHA1.test(commit) && args[1][40] === ':' && safe(relative)) return {commit,relative};
  }
  return null;
}

export function createImmutableGitMetadataLookup(limit = 4096) {
  if (!Number.isSafeInteger(limit) || limit < 1) throw Error('positive metadata cache limit required');
  const entries = new Map();
  return (root,args,read) => {
    const lookup = immutableLookup(args);
    if (!lookup) return read();
    const key = JSON.stringify([path.resolve(root),args]);
    if (entries.has(key)) {
      const raw = entries.get(key);
      entries.delete(key);entries.set(key,raw);
      return Buffer.from(raw);
    }
    const raw = read();
    if (Buffer.isBuffer(raw) && /^[a-f0-9]{40}\n$/.test(raw.toString('ascii')) &&
        (!lookup.expected || raw.toString('ascii').trim() === lookup.expected)) {
      entries.set(key,Buffer.from(raw));
      if (entries.size > limit) entries.delete(entries.keys().next().value);
    }
    return raw;
  };
}
