import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const run = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration';
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const bindingPath = `${run}/publication-binding.json`;
const proofIndexPath = `${run}/sourceonly-batch-proof-index.json`;
const binding = JSON.parse(fs.readFileSync(path.join(root, bindingPath), 'utf8'));
const proofIndex = JSON.parse(fs.readFileSync(path.join(root, proofIndexPath), 'utf8'));
const remote = execFileSync('git', ['-C', root, 'rev-parse', 'origin/main'], { encoding: 'utf8' }).trim();
const expectedCommit = '9964fd57af3e67c303936155e48f7f94689fc2f9';
if (remote !== expectedCommit) throw new Error(`REMOTE_MAIN_SHA_MISMATCH:${remote}`);
const treeBytes = execFileSync('git', ['-C', root, 'ls-tree', '-r', '-z', remote], { maxBuffer: 128 * 1024 * 1024 });
const blobs = new Map();
for (const row of treeBytes.toString('utf8').split('\0').filter(Boolean)) {
  const tab = row.indexOf('\t');
  const meta = row.slice(0, tab).split(' ');
  blobs.set(row.slice(tab + 1), { mode: meta[0], type: meta[1], oid: meta[2] });
}
const checkpointPaths = fs.readdirSync(path.join(root, run)).filter(name => /^publication-checkpoint.*\.json$/.test(name)).map(name => `${run}/${name}`);
const paths = [...new Set([
  ...binding.changedPaths,
  ...proofIndex.files.map(file => file.path),
  bindingPath,
  proofIndexPath,
  `${run}/publication-checks.json`,
  ...checkpointPaths,
])].sort();
const ids = paths.map(p => {
  const entry = blobs.get(p);
  if (!entry || entry.type !== 'blob') throw new Error(`REMOTE_PATH_MISSING:${p}`);
  return entry.oid;
});
const rows = [];
for (let start = 0; start < paths.length; start += 12) {
  const end = Math.min(paths.length, start + 12);
  const batch = spawnSync('git', ['-C', root, 'cat-file', '--batch'], { input: `${ids.slice(start, end).join('\n')}\n`, maxBuffer: 128 * 1024 * 1024 });
  if (batch.status !== 0) throw new Error(`CAT_FILE_FAILED:range=${start}-${end}:status=${batch.status}:signal=${batch.signal}:error=${batch.error?.message || ''}:stderr=${batch.stderr.toString('utf8')}`);
  let offset = 0;
  for (let i = start; i < end; i++) {
    const lineEnd = batch.stdout.indexOf(10, offset);
    const header = batch.stdout.subarray(offset, lineEnd).toString('ascii').split(' ');
    const [oid, type, sizeText] = header;
    const size = Number(sizeText);
    offset = lineEnd + 1;
    const remoteBytes = batch.stdout.subarray(offset, offset + size);
    offset += size;
    if (batch.stdout[offset] === 10) offset++;
    const localBytes = fs.readFileSync(path.join(root, paths[i]));
    const remoteSha256 = sha(remoteBytes);
    const localSha256 = sha(localBytes);
    if (oid !== ids[i] || type !== 'blob' || remoteSha256 !== localSha256) throw new Error(`REMOTE_BYTES_MISMATCH:${paths[i]}`);
    rows.push({ path: paths[i], gitBlobSha1: oid, sha256: remoteSha256, size });
  }
}
const bindingSha256 = sha(Buffer.from(JSON.stringify(stable(binding)), 'utf8'));
const proofFiles = proofIndex.files.map(({ path: filePath, sha256: expected }) => {
  const actual = rows.find(row => row.path === filePath)?.sha256;
  if (actual !== expected) throw new Error(`PROOF_INDEX_SHA_MISMATCH:${filePath}`);
  return { path: filePath, sha256: actual, size: fs.statSync(path.join(root, filePath)).size };
});
const proofsSha256 = sha(Buffer.from(JSON.stringify(stable(proofFiles)), 'utf8'));
if (proofsSha256 !== binding.proofsSha256) throw new Error('PROOF_SET_DIGEST_MISMATCH');
const targets = binding.targets.map(target => {
  const file = rows.find(row => row.path === target.path);
  if (!file || file.sha256 !== target.rawSha256 || file.gitBlobSha1 !== target.gitBlobSha1) throw new Error(`TARGET_SOURCE_SHA_MISMATCH:${target.examUid}`);
  return { examUid: target.examUid, path: target.path, sha256: file.sha256, gitBlobSha1: file.gitBlobSha1 };
});
const receipt = {
  schemaVersion: 'ROOT_ARCHIVE_REMOTE_READBACK_V1',
  mainSha: remote,
  bindingSha256,
  sourceSha256: binding.sourceSha256,
  proofsSha256,
  assetsSha256: binding.assetsSha256,
  baselineSha256: binding.baselineSha256,
  allBytesMatch: true,
  fileCount: rows.length,
  targets,
  verifiedAt: new Date().toISOString(),
  rows,
};
const output = path.join(root, run, 'remote-readback.json');
fs.writeFileSync(output, JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify({ status: 'REMOTE_READBACK_PASS', output: path.relative(root, output), mainSha: remote, bindingSha256, fileCount: rows.length, targetCount: targets.length, sourceSha256: receipt.sourceSha256, proofsSha256, assetsSha256: receipt.assetsSha256 }, null, 2));

function stable(value) {
  return Array.isArray(value) ? value.map(stable) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
}
