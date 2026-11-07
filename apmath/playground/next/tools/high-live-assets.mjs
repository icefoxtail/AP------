// Read-only source verification for the public high-school browser audit.
// A matching HTML/JS/CSS set identifies those bytes, not an entire deployment.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

export function publicPlaygroundBase(value) {
  const url = new URL(value);
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) throw Error('Public base must be an HTTP(S) playground directory without credentials, query or fragment');
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url;
}

export function liveRepoPath(base, value) {
  const url = new URL(value, base), prefix = new URL('next/', base);
  if (url.origin !== prefix.origin) return null;
  if (!url.pathname.startsWith(prefix.pathname)) throw Error('Same-origin source is outside the selected next/ directory');
  const suffix = decodeURIComponent(url.pathname.slice(prefix.pathname.length));
  if (!suffix || suffix.includes('\\') || suffix.includes('\0') || suffix.split('/').some(s => !s || s === '.' || s === '..')) throw Error('Unsafe public source path');
  return 'apmath/playground/next/' + suffix;
}

// Response events can append work while a body is still being read. Drain every
// appended batch before checking references or finalizing a report.
export async function drainResponseTasks(tasks) {
  let cursor = 0;
  while (cursor < tasks.length) {
    const batch = tasks.slice(cursor);
    cursor = tasks.length;
    await Promise.all(batch);
  }
}

export function createLiveAssetVerifier({ root, baseURL, commit, onFailure }) {
  const base = publicPlaygroundBase(baseURL), expected = new Map(), assets = new Map();
  let pending = 0, finished = false;
  const hash = value => crypto.createHash('sha256').update(value).digest('hex');
  const report = { checkoutCommit: commit, actualDeployedCommit: null, status: 'RUNNING', pendingVerifications:0, assets: [], externalAssets: [], meaning: 'HTTP HTML/JS/CSS bytes are compared with the pinned checkout and Git blobs. Event SHA is metadata; no entire deployed commit is inferred.' };
  function localExpected(file) {
    if (!expected.has(file)) {
      const disk = fs.readFileSync(path.join(root, file));
      const git = execFileSync('git', ['show', `${commit}:${file}`], { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
      if (!disk.equals(git)) throw Error(`Checkout differs from its pinned commit: ${file}`);
      expected.set(file, { sha256: hash(git), bytes: git.length, gitBlobSHA: crypto.createHash('sha1').update(`blob ${git.length}\0`).update(git).digest('hex') });
    }
    return expected.get(file);
  }
  async function verify(response, context) {
    if (finished) { report.status='FAILED';onFailure({reason:'public-source-after-finalization',context});return; }
    report.pendingVerifications=++pending;
    const url = new URL(response.url()), safeURL = url.origin + url.pathname;
    try {
      const file = liveRepoPath(base, url.href);
      if (!file) {
        if (!report.externalAssets.some(a => a.url === safeURL)) report.externalAssets.push({ url: safeURL, status: response.status(), verification: 'EXTERNAL_NOT_COMPARED_WITH_GIT' });
        return;
      }
      if (!/\.(?:html|js|css)$/.test(file)) return;
      const body = await response.body(), servedSHA256 = hash(body), want = localExpected(file), key = file + '|' + servedSHA256 + '|' + response.status();
      if (!assets.has(key)) assets.set(key, { file, url: safeURL, status: response.status(), servedSHA256, checkoutSHA256: want.sha256, gitBlobSHA: want.gitBlobSHA, bytes: body.length, matchesCheckout: response.ok() && servedSHA256 === want.sha256, observedIn: [] });
      const entry = assets.get(key);
      if (!entry.observedIn.includes(context)) entry.observedIn.push(context);
      if (!entry.matchesCheckout) throw Error(`Served asset differs from pinned checkout: ${file}`);
    } catch (error) { report.status = 'FAILED'; onFailure({ reason: 'public-source-verification', context, url: safeURL, error: error.message }); }
    finally { report.pendingVerifications=--pending;report.assets = [...assets.values()]; }
  }
  function requireSources(urls, context) {
    for (const url of urls) {
      try {
        const file = liveRepoPath(base, url);
        if (file && ![...assets.values()].some(a => a.file === file && a.matchesCheckout && a.observedIn.includes(context))) throw Error(`No matching response bytes observed: ${file}`);
      } catch (error) { report.status = 'FAILED'; onFailure({ reason: 'public-source-not-observed', context, error: error.message }); }
    }
  }
  function finish() {
    finished=true;
    report.assets = [...assets.values()];
    if(pending){report.status='FAILED';onFailure({reason:'unfinished-public-source-verification',pending});}
    if (!report.assets.length) { report.status = 'FAILED'; onFailure({ reason: 'public-source-empty' }); }
    else if (report.status === 'RUNNING') report.status = 'MATCHED_CHECKED_ASSETS';
    return report;
  }
  return { verify, requireSources, finish, report };
}
