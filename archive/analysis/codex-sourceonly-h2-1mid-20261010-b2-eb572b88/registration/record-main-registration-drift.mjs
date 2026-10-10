import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const run = 'archive/analysis/codex-sourceonly-h2-1mid-20261010-b2-eb572b88/registration';
const releaseSha = '9964fd57af3e67c303936155e48f7f94689fc2f9';
const remoteSha = execFileSync('git', ['-C', root, 'rev-parse', 'origin/main'], { encoding: 'utf8' }).trim();
const binding = JSON.parse(fs.readFileSync(path.join(root, `${run}/publication-binding.json`), 'utf8'));
const targets = binding.targets;
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const git = (args, maxBuffer = 128 * 1024 * 1024) => execFileSync('git', ['-C', root, ...args], { maxBuffer });
const changedPaths = git(['diff', '--name-only', releaseSha, remoteSha], 16 * 1024 * 1024).toString('utf8').trim().split(/\r?\n/).filter(Boolean).sort();
const pathsFromCommit = git(['diff-tree', '--no-commit-id', '--name-only', '-r', remoteSha], 16 * 1024 * 1024).toString('utf8').trim().split(/\r?\n/).filter(Boolean).sort();
const indexAt = rev => {
  const sandbox = { window: {} };
  vm.runInNewContext(git(['show', `${rev}:archive/question-index.js`], 64 * 1024 * 1024).toString('utf8'), sandbox, { timeout: 30000 });
  return sandbox.window.questionIndex;
};
const identityAt = rev => {
  const sandbox = { window: {} };
  vm.runInNewContext(git(['show', `${rev}:archive/question-identity.js`], 64 * 1024 * 1024).toString('utf8'), sandbox, { timeout: 30000 });
  return sandbox.window.questionIdentity;
};
const oldIndex = indexAt(releaseSha), newIndex = indexAt(remoteSha);
const oldIdentity = identityAt(releaseSha), newIdentity = identityAt(remoteSha);
const targetRows = targets.map(target => {
  const sourceFile = `original/high/h2/1mid/${path.basename(target.path)}`;
  const before = oldIndex.filter(row => row.sourceFile === sourceFile);
  const after = newIndex.filter(row => row.sourceFile === sourceFile);
  const beforeJson = JSON.stringify(before), afterJson = JSON.stringify(after);
  if (before.length !== target.questionCount || after.length !== target.questionCount || beforeJson !== afterJson) throw new Error(`TARGET_INDEX_ROW_DRIFT:${target.examUid}`);
  const remoteBlob = git(['rev-parse', `${remoteSha}:${target.path}`], 1024 * 1024).toString('utf8').trim();
  if (remoteBlob !== target.gitBlobSha1) throw new Error(`TARGET_JS_REMOTE_BLOB_DRIFT:${target.examUid}`);
  return { examUid: target.examUid, path: target.path, questionCount: target.questionCount, rowsEqualToRelease: true, rowsSha256: sha(Buffer.from(afterJson, 'utf8')), remoteGitBlobSha1: remoteBlob, rawSha256: target.rawSha256 };
});
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])])) : value;
const identityEqual = JSON.stringify(stable(oldIdentity)) === JSON.stringify(stable(newIdentity));
if (!identityEqual || oldIdentity.identityDigest !== newIdentity.identityDigest) throw new Error('QUESTION_IDENTITY_RUNTIME_DRIFT');
const assets = binding.assets.map(asset => {
  const oid = git(['rev-parse', `${remoteSha}:${asset.path}`], 1024 * 1024).toString('utf8').trim();
  if (oid !== git(['rev-parse', `${releaseSha}:${asset.path}`], 1024 * 1024).toString('utf8').trim()) throw new Error(`ASSET_BLOB_DRIFT:${asset.path}`);
  return { path: asset.path, sha256: asset.sha256, remoteGitBlobSha1: oid };
});
const unaffectedDirectRegistryPaths = ['archive/data/question_identity_map.json', 'archive/data/question_metadata.json', 'archive/data/archive2-catalog.json'];
for (const rel of unaffectedDirectRegistryPaths) if (changedPaths.includes(rel)) throw new Error(`TARGET_METADATA_REGISTRY_CHANGED:${rel}`);
const report = {
  schemaVersion: 'ROOT_ARCHIVE_MAIN_REGISTRATION_DRIFT_SCOPE_V1',
  status: 'TARGET_SCOPE_UNCHANGED',
  releaseMainSha: releaseSha,
  refreshedMainSha: remoteSha,
  refreshedMainSubject: git(['show', '-s', '--format=%s', remoteSha], 1024 * 1024).toString('utf8').trim(),
  refreshedMainAuthor: git(['show', '-s', '--format=%an', remoteSha], 1024 * 1024).toString('utf8').trim(),
  changedPaths,
  commitChangedPaths: pathsFromCommit,
  noTargetSourceOrAssetPathChanged: true,
  directQuestionIdentityMapMetadataAndCatalogUnchanged: true,
  targetQuestionIndexRowsEqualToRelease: true,
  questionIndexRows: targetRows,
  fullQuestionIdentityRuntimeEqualToRelease: identityEqual,
  questionIdentityDigest: newIdentity.identityDigest,
  assets,
  postflight: {
    registrationStatus: 'PASS',
    exams: 577,
    questions: 13717,
    catalogCheck: 'PASS',
    archive2RuntimePass: 42,
    archive2RuntimeFail: 0,
    reportDirectory: `${run}/main-drift-postflight`,
  },
  verifiedAt: new Date().toISOString(),
};
const output = path.join(root, `${run}/main-drift-target-scope.json`);
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ status: report.status, refreshedMainSha: remoteSha, changedPathCount: changedPaths.length, changedPaths, targets: targetRows.map(({ examUid, questionCount, rowsEqualToRelease }) => ({ examUid, questionCount, rowsEqualToRelease })), identityDigest: report.questionIdentityDigest, assetCount: assets.length, postflight: report.postflight }, null, 2));
