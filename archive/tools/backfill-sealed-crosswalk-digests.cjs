'use strict';
/**
 * Backfill of the sealed crosswalk digest registry (sealed-crosswalk-digests.cjs), verifiable entries only.
 *
 * Scans every approved/registered Meta file for a pinned whole-file crosswalk digest, and seals a (path, digest) pair
 * only when the digest equals the sha256 of that crosswalk file at some commit in git history (raw blob bytes, or the
 * same bytes with CRLF/CR normalised to LF the way the tools compare text). The current digest of every crosswalk
 * file is sealed as well. A pinned digest that matches no historical version is listed and NEVER sealed.
 *
 *   node archive/tools/backfill-sealed-crosswalk-digests.cjs            # report only
 *   node archive/tools/backfill-sealed-crosswalk-digests.cjs --write    # append the verified seals
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const seal = require('./sealed-crosswalk-digests.cjs');

const SCAN_DIRS = ['archive/data/generated-lite-consumer/', 'archive/data/evidence-authority/', 'archive/data/meta-foundation/', 'archive/generated/lite/'];
const SEALED_BY = 'backfill-sealed-crosswalk-digests.cjs';
const HEX64 = /^[a-f0-9]{64}$/i;
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const normalizeEol = bytes => Buffer.from(bytes.toString('utf8').replace(/\r\n/g, '\n').replace(/\r/g, '\n'), 'utf8');
const git = (root, args, options = {}) => execFileSync('git', args, { cwd: root, maxBuffer: 1 << 29, ...options });
const gitList = (root, args) => git(root, args).toString('utf8').split('\0').filter(Boolean);

function collectPins(root) {
  const pins = new Map(); // `${path}\0${sha}` -> { path, sha256, files:Set }
  const add = (rel, sha, file) => {
    if (typeof rel !== 'string' || typeof sha !== 'string' || !HEX64.test(sha) || !rel.startsWith(seal.CROSSWALK_DIR)) return;
    const key = `${rel}\0${sha.toLowerCase()}`;
    if (!pins.has(key)) pins.set(key, { path: rel, sha256: sha.toLowerCase(), files: new Set() });
    pins.get(key).files.add(file);
  };
  const walk = (node, file) => {
    if (Array.isArray(node)) { node.forEach(item => walk(item, file)); return; }
    if (!node || typeof node !== 'object') return;
    add(node.rpmDraftAuthorityRef, node.rpmDraftAuthoritySha256, file);
    add(node.rpmAuthorityRef, node.rpmAuthoritySha256, file);
    if (node.authority && typeof node.authority === 'object') add(node.authority.path, node.authority.sha256, file);
    for (const key of Object.keys(node)) walk(node[key], file);
  };
  const files = gitList(root, ['ls-files', '-z', '--', ...SCAN_DIRS]).filter(file => /\.(json|js)$/.test(file));
  let scanned = 0;
  for (const file of files) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    if (!/rpm(Draft)?AuthoritySha256|"authority"/.test(text)) continue;
    scanned++;
    if (file.endsWith('.json')) { try { walk(JSON.parse(text), file); } catch { /* not a Meta carrier */ } continue; }
    // Generated source shards embed the Meta as JSON text inside a patch script.
    const refFirst = /"(rpm(?:Draft)?Authority)Ref"\s*:\s*"([^"]+)"[\s\S]{0,400}?"\1Sha256"\s*:\s*"([a-f0-9]{64})"/gi;
    const shaFirst = /"(rpm(?:Draft)?Authority)Sha256"\s*:\s*"([a-f0-9]{64})"[\s\S]{0,400}?"\1Ref"\s*:\s*"([^"]+)"/gi;
    let match;
    while ((match = refFirst.exec(text))) add(match[2], match[3], file);
    while ((match = shaFirst.exec(text))) add(match[3], match[2], file);
  }
  return { pins: [...pins.values()], scannedFiles: scanned };
}

/** Every distinct version of `rel` in history: { commit, blobSha1, sha256, sha256Lf } (first commit that has it). */
function historyVersions(root, rel) {
  const commits = git(root, ['log', '--format=%H', '--', rel]).toString('utf8').split('\n').filter(Boolean);
  const seen = new Set();
  const versions = [];
  for (const commit of commits) {
    let blobSha1;
    try { blobSha1 = git(root, ['rev-parse', `${commit}:${rel}`], { stdio: ['ignore', 'pipe', 'ignore'] }).toString('utf8').trim(); } catch { continue; }
    if (seen.has(blobSha1)) continue;
    seen.add(blobSha1);
    const bytes = git(root, ['cat-file', 'blob', blobSha1]);
    versions.push({ commit, blobSha1, sha256: sha256(bytes), sha256Lf: sha256(normalizeEol(bytes)) });
  }
  return versions;
}

function currentCrosswalks(root) {
  return gitList(root, ['ls-files', '-z', '--', seal.CROSSWALK_DIR]).filter(rel => rel.endsWith('.json') && rel !== seal.REGISTRY_REL);
}

function plan(root) {
  const { pins, scannedFiles } = collectPins(root);
  const historyCache = new Map();
  const versionsOf = rel => { if (!historyCache.has(rel)) historyCache.set(rel, historyVersions(root, rel)); return historyCache.get(rel); };
  const toSeal = [];
  const unmatched = [];
  for (const pin of pins) {
    const match = versionsOf(pin.path).find(v => v.sha256 === pin.sha256) || versionsOf(pin.path).find(v => v.sha256Lf === pin.sha256);
    if (!match) { unmatched.push({ path: pin.path, sha256: pin.sha256, files: pin.files.size, sampleFile: [...pin.files][0] }); continue; }
    toSeal.push({ path: pin.path, sha256: match.sha256, gitBlobSha1: match.blobSha1, reason: `backfill: matches ${match.commit}${match.sha256 === pin.sha256 ? '' : ' (LF-normalised)'}`, pinnedBy: pin.files.size });
  }
  const current = [];
  for (const rel of currentCrosswalks(root)) {
    const bytes = fs.readFileSync(path.join(root, rel));
    const head = git(root, ['rev-parse', `HEAD:${rel}`]).toString('utf8').trim();
    if (sha256(git(root, ['cat-file', 'blob', head])) !== sha256(bytes) && sha256(normalizeEol(git(root, ['cat-file', 'blob', head]))) !== sha256(normalizeEol(bytes))) throw new Error(`CURRENT_CROSSWALK_NOT_COMMITTED:${rel}`);
    current.push({ path: rel, sha256: sha256(git(root, ['cat-file', 'blob', head])), gitBlobSha1: head, reason: `backfill: current digest at ${git(root, ['rev-parse', 'HEAD']).toString('utf8').trim()}` });
  }
  return { scannedFiles, distinctPins: pins.length, toSeal, current, unmatched };
}

function apply(root, result, now = new Date()) {
  const entries = seal.readRegistryEntries(root).slice();
  const have = new Set(entries.map(entry => `${entry.path}\0${entry.sha256}`));
  let added = 0;
  for (const item of [...result.toSeal, ...result.current]) {
    const key = `${item.path}\0${item.sha256}`;
    if (have.has(key)) continue;
    have.add(key);
    entries.push({ path: item.path, sha256: item.sha256, gitBlobSha1: item.gitBlobSha1, sealedAt: now.toISOString(), sealedBy: SEALED_BY, reason: item.reason });
    added++;
  }
  const issues = seal.validateRegistryEntries(entries);
  if (issues.length) throw new Error(`SEALED_DIGEST_REGISTRY_INVALID:${issues.slice(0, 8).join('|')}`);
  if (added) {
    const file = path.join(root, seal.REGISTRY_REL);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, seal.serializeRegistry(entries));
  }
  return { added, total: entries.length };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '../..');
  try {
    const result = plan(root);
    const applied = process.argv.includes('--write') ? apply(root, result) : null;
    console.log(JSON.stringify({
      status: result.unmatched.length ? 'UNMATCHED_PINS_NOT_SEALED' : 'PASS',
      scannedFiles: result.scannedFiles, distinctPinnedDigests: result.distinctPins,
      backfilled: result.toSeal.map(({ path: p, sha256: s, reason, pinnedBy }) => ({ path: p, sha256: s, reason, pinnedBy })),
      current: result.current.map(({ path: p, sha256: s }) => ({ path: p, sha256: s })),
      unmatched: result.unmatched, written: applied
    }, null, 2));
    if (result.unmatched.length) process.exitCode = 2;
  } catch (error) {
    console.error(JSON.stringify({ status: 'FAIL', error: error.message }, null, 2));
    process.exitCode = 1;
  }
}

module.exports = { collectPins, historyVersions, plan, apply };
