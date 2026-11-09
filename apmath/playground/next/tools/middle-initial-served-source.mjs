import crypto from 'node:crypto';
import path from 'node:path';

export function servedSourceEntries(files, baseURL) {
  if (!Array.isArray(files) || files.length === 0) throw Error('Empty expected source manifest');
  const base = baseURL.endsWith('/') ? baseURL : baseURL + '/';
  return files.map(file => {
    if (!file.path.startsWith('apmath/playground/next/')) throw Error('Source outside the playground');
    const relative = path.posix.relative('apmath/playground/next/labs', file.path);
    return { ...file, url: new URL(relative, base).href };
  });
}

export function compareServedBytes(file, bytes, status, url = file.url) {
  const actualSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  return { path: file.path, url, status, expectedSha256: file.sha256, actualSha256,
    byteLength: bytes.length, pass: status === 200 && actualSha256 === file.sha256 };
}

// A new document can receive different bytes at the same path during a release
// or cache transition. Check every response; a previous response is no substitute.
export function queueServedResponse(response, expectedByURL, pending) {
  const url = new URL(response.url()); url.search = ''; url.hash = '';
  const file = expectedByURL.get(url.href);
  if (!file) return false;
  pending.push(Promise.resolve().then(() => response.body())
    .then(bytes => compareServedBytes(file, bytes, response.status(), response.url()))
    .catch(error => ({ path: file.path, url: response.url(), expectedSha256: file.sha256, pass: false, error: String(error) })));
  return true;
}

export async function drainServedSourceChecks(pending) {
  const results = [];
  // Reading one body can yield while more response events append their checks.
  while (pending.length) results.push(...await Promise.all(pending.splice(0)));
  return results;
}

export async function verifyServedSources(files, baseURL, request = fetch) {
  const entries = servedSourceEntries(files, baseURL), results = [];
  for (let i = 0; i < entries.length; i += 6) {
    results.push(...await Promise.all(entries.slice(i, i + 6).map(async file => {
      try {
        const response = await request(file.url, { cache: 'no-store', signal: AbortSignal.timeout(20000) });
        return compareServedBytes(file, Buffer.from(await response.arrayBuffer()), response.status, response.url || file.url);
      } catch (error) {
        return { path: file.path, url: file.url, expectedSha256: file.sha256, pass: false, error: String(error) };
      }
    })));
  }
  return { status: results.every(file => file.pass) ? 'PASS' : 'FAIL', baseURL, files: results };
}
