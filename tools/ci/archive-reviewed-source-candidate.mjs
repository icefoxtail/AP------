import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const CANDIDATE_ENVELOPE = '.archive-source-metadata/candidate.json';
export const CANDIDATE_SCHEMA = 'archive-reviewed-source-candidate-input-v1';
const SHA1 = /^[0-9a-f]{40}$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ID = /^[a-z0-9][a-z0-9-]{5,80}$/;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_BYTES = 20 * 1024 * 1024;
const forbiddenKeys = new Set(['__proto__', 'prototype', 'constructor', 'question', 'questions',
  'questiontext', 'questionhtml', 'stem', 'choices', 'options', 'answer', 'answers', 'correctanswer',
  'solution', 'solutiontext', 'solutionhtml', 'explanation', 'prompt', 'currentquestion', 'sourcecode',
  'sourcebody', 'rawsource', 'rawtext', 'content', 'html', 'svg', 'base64', 'credentials', 'password', 'token', 'secret']);

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = code => { throw new Error(`SOURCE_METADATA_CANDIDATE:${code}`); };
const requireThat = (condition, code) => { if (!condition) fail(code); };
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);

function exactKeys(value, required, optional = []) {
  requireThat(plain(value), 'OBJECT_REQUIRED');
  requireThat(required.every(key => Object.hasOwn(value, key)) &&
    Object.keys(value).every(key => required.includes(key) || optional.includes(key)), 'UNKNOWN_OR_MISSING_FIELD');
}

function safePath(value) {
  requireThat(typeof value === 'string' && value.length > 0 && value.length <= 500 &&
    value === value.normalize('NFC') && !/[\\\x00-\x1f\x7f]/.test(value) &&
    !path.posix.isAbsolute(value) && !value.split('/').some(part => !part || part === '.' || part === '..' || part === '.git'),
  'UNSAFE_PATH');
  return value;
}

export function allowedMetadataPath(value) {
  safePath(value);
  if (!value.endsWith('.json') || value.endsWith('.source-review-binding.json')) return false;
  return /^\.archive-meta-register\/(?:inbox|evidence)\/[a-zA-Z0-9_./-]+\.json$/.test(value) ||
    /^docs\/operations\/reviewed-exam-meta\/v1\/[^/]+\.(?:parent-labels|source-metadata-transport|review)\.json$/.test(value) ||
    /^docs\/operations\/m2(?:s[12]|-s[12])-[a-z0-9-]+\/[a-zA-Z0-9_.\/-]+\.json$/.test(value);
}

function assertMetadataOnly(value, depth = 0) {
  requireThat(depth <= 40, 'JSON_DEPTH');
  if (Array.isArray(value)) {
    requireThat(value.length <= 100000, 'JSON_ARRAY_SIZE');
    value.forEach(item => assertMetadataOnly(item, depth + 1));
  } else if (plain(value)) {
    for (const [key, child] of Object.entries(value)) {
      requireThat(!forbiddenKeys.has(key.toLowerCase().replace(/[-_ ]/g, '')) &&
        !['__proto__', 'prototype', 'constructor'].includes(key), 'RAW_OR_UNSAFE_METADATA_FIELD');
      assertMetadataOnly(child, depth + 1);
    }
  } else {
    requireThat(value === null || ['string', 'number', 'boolean'].includes(typeof value), 'JSON_VALUE');
    if (typeof value === 'string') requireThat(value.length <= 100000, 'JSON_STRING_SIZE');
  }
}

function git(root, args, options = {}) {
  return execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0', ...(options.env || {}) },
    stdio: ['pipe', 'pipe', 'pipe'], ...options,
  });
}

function entry(root, commit, rel, required = true) {
  safePath(rel);
  const raw = git(root, ['ls-tree', '-z', commit, '--', rel]);
  if (!raw) { requireThat(!required, 'INPUT_FILE_MISSING'); return null; }
  const rows = raw.split('\0').filter(Boolean);
  requireThat(rows.length === 1, 'INPUT_TREE_AMBIGUOUS');
  const match = /^(\d+) (\w+) ([0-9a-f]{40})\t(.*)$/s.exec(rows[0]);
  requireThat(match && match[1] === '100644' && match[2] === 'blob' && match[4] === rel, 'INPUT_FILE_MODE');
  return { path: rel, blobSha1: match[3] };
}

function readJson(root, commit, rel) {
  const item = entry(root, commit, rel);
  const size = Number(git(root, ['cat-file', '-s', item.blobSha1]).trim());
  requireThat(Number.isSafeInteger(size) && size > 0 && size <= MAX_FILE_BYTES, 'INPUT_SIZE');
  const bytes = git(root, ['cat-file', 'blob', item.blobSha1], { encoding: null });
  let value;
  try { value = JSON.parse(bytes.toString('utf8')); } catch { fail('INPUT_JSON'); }
  requireThat(Buffer.from(bytes.toString('utf8')).equals(bytes), 'INPUT_UTF8');
  assertMetadataOnly(value);
  return { ...item, sha256: digest(bytes), bytes, value };
}

function verifiedRef(ref, file) {
  exactKeys(ref, ['path', 'blobSha1', 'sha256']);
  requireThat(SHA1.test(ref.blobSha1) && SHA256.test(ref.sha256) &&
    ref.path === file.path && ref.blobSha1 === file.blobSha1 && ref.sha256 === file.sha256, 'INPUT_REF_MISMATCH');
}

/** Inspects immutable Git objects only. No code from the input branch is loaded. */
export function inspectSourceMetadataCandidate({ repoRoot, inputCommit, eventRef }) {
  requireThat(typeof repoRoot === 'string' && fs.existsSync(repoRoot), 'REPOSITORY_REQUIRED');
  const root = fs.realpathSync(repoRoot);
  requireThat(SHA1.test(inputCommit || ''), 'INPUT_COMMIT_REQUIRED');
  const baseCommit = git(root, ['rev-parse', 'HEAD']).trim();
  requireThat(SHA1.test(baseCommit), 'BASE_COMMIT_REQUIRED');
  requireThat(!git(root, ['diff', '--name-only', 'HEAD', '--']).trim(), 'TRUSTED_CHECKOUT_DIRTY');
  const parents = git(root, ['rev-list', '--parents', '-n', '1', inputCommit]).trim().split(/\s+/);
  requireThat(parents.length === 2 && parents[1] === baseCommit, 'INPUT_PARENT_NOT_CURRENT_BASE');
  const envelopeFile = readJson(root, inputCommit, CANDIDATE_ENVELOPE);
  const envelope = envelopeFile.value;
  exactKeys(envelope, ['schemaVersion', 'materializationId', 'baseCommit', 'manifestRef', 'inputFiles']);
  requireThat(envelope.schemaVersion === CANDIDATE_SCHEMA && ID.test(envelope.materializationId), 'ENVELOPE_SCHEMA');
  requireThat(envelope.baseCommit === baseCommit, 'BASE_COMMIT_MISMATCH');
  requireThat(eventRef === `archive-meta-source-input/${envelope.materializationId}`, 'EVENT_REF_MISMATCH');
  requireThat(Array.isArray(envelope.inputFiles) && envelope.inputFiles.length > 0 && envelope.inputFiles.length <= 500,
    'INPUT_FILE_COUNT');
  const files = new Map();
  let total = envelopeFile.bytes.length;
  for (const ref of envelope.inputFiles) {
    requireThat(plain(ref) && allowedMetadataPath(ref.path), 'INPUT_PATH_NOT_METADATA');
    requireThat(!files.has(ref.path), 'DUPLICATE_INPUT_PATH');
    requireThat(entry(root, baseCommit, ref.path, false) === null, 'INPUT_OVERWRITE_FORBIDDEN');
    const file = readJson(root, inputCommit, ref.path);
    verifiedRef(ref, file);
    files.set(ref.path, file);
    total += file.bytes.length;
    requireThat(total <= MAX_TOTAL_BYTES, 'INPUT_TOTAL_SIZE');
  }
  const changed = git(root, ['diff-tree', '--no-commit-id', '--name-only', '-r', '-z', baseCommit, inputCommit]).split('\0').filter(Boolean).sort();
  const expected = [CANDIDATE_ENVELOPE, ...files.keys()].sort();
  requireThat(JSON.stringify(changed) === JSON.stringify(expected), 'INPUT_TREE_SCOPE');
  requireThat(entry(root, baseCommit, CANDIDATE_ENVELOPE, false) === null, 'ENVELOPE_OVERWRITE');
  const manifestFile = files.get(envelope.manifestRef?.path);
  requireThat(Boolean(manifestFile), 'MANIFEST_NOT_INPUT');
  verifiedRef(envelope.manifestRef, manifestFile);
  requireThat(manifestFile.value.materializationId === envelope.materializationId &&
    manifestFile.value.baseCommit === baseCommit, 'MANIFEST_IDENTITY');
  return { root, baseCommit, inputCommit, materializationId: envelope.materializationId,
    candidateBranch: `release/metadata-source-${envelope.materializationId}`, envelopeFile, manifestFile, files,
    totalInputBytes: total };
}

function outsideNewDirectory(root, value) {
  requireThat(typeof value === 'string' && path.isAbsolute(value), 'ABSOLUTE_OUTPUT_REQUIRED');
  const parent = fs.realpathSync(path.dirname(value));
  const resolved = path.join(parent, path.basename(value));
  requireThat(resolved !== root && !resolved.startsWith(root + path.sep), 'OUTPUT_INSIDE_REPOSITORY');
  requireThat(!fs.existsSync(resolved), 'OUTPUT_ALREADY_EXISTS');
  return resolved;
}

/** Produces an unreferenced candidate commit. Publishing it and opening a PR are separate actions. */
export async function buildSourceMetadataCandidate({ repoRoot, inputCommit, eventRef, outputRoot }) {
  const inspected = inspectSourceMetadataCandidate({ repoRoot, inputCommit, eventRef });
  const { root, baseCommit, manifestFile, materializationId, candidateBranch } = inspected;
  const target = outsideNewDirectory(root, outputRoot);
  const { materializeReviewedSourceMetadata } = await import('../../archive/tools/meta-foundation/materialize-reviewed-source-metadata.mjs');
  await materializeReviewedSourceMetadata({ repoRoot: root, manifest: manifestFile.value,
    baseCommit, inputCommit, outputRoot: target, write: true });
  const manifest = manifestFile.value;
  requireThat(Array.isArray(manifest.files) && manifest.files.length > 0, 'MATERIALIZED_FILES_REQUIRED');
  const sourceRows = manifest.files.map(file => {
    const rel = safePath(file.path);
    requireThat(/^archive\/exams\/original\/.+\.js$/.test(rel), 'SOURCE_PATH');
    const absolute = path.join(target, rel);
    requireThat(fs.existsSync(absolute) && fs.lstatSync(absolute).isFile() && !fs.lstatSync(absolute).isSymbolicLink(),
      'MATERIALIZED_FILE_MISSING');
    requireThat(fs.realpathSync(absolute).startsWith(target + path.sep), 'MATERIALIZED_PATH_ESCAPE');
    const bytes = fs.readFileSync(absolute);
    const blobSha1 = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    requireThat(blobSha1 === file.after?.blobSha1 && digest(bytes) === file.after?.sha256, 'MATERIALIZED_BYTES_MISMATCH');
    return { path: rel, blobSha1, sha256: digest(bytes), bytes: bytes.length, absolute };
  });
  requireThat(new Set(sourceRows.map(row => row.path)).size === sourceRows.length, 'DUPLICATE_SOURCE_PATH');
  const receiptPath = `docs/operations/source-metadata-candidates/${materializationId}/transport-receipt.json`;
  requireThat(entry(root, inputCommit, receiptPath, false) === null, 'RECEIPT_OVERWRITE');
  const receipt = { schemaVersion: 'archive-reviewed-source-candidate-receipt-v1', materializationId,
    baseCommit, inputCommit, manifestRef: { path: manifestFile.path, blobSha1: manifestFile.blobSha1, sha256: manifestFile.sha256 },
    sourceFiles: sourceRows.map(({ absolute, ...row }) => row), inputFileCount: inspected.files.size,
    inputBytes: inspected.totalInputBytes, approvalEffect: 'NONE', registrationStatus: 'NOT_REGISTERED',
    nextRequiredStep: 'NORMAL_PULL_REQUEST_CI_AND_SINGLE_MAIN_REGISTRATION_WRITER' };
  const receiptBytes = Buffer.from(JSON.stringify(receipt, null, 2) + '\n');
  const privateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-source-candidate-index-'));
  const indexFile = path.join(privateDir, 'index');
  const env = { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_INDEX_FILE: indexFile,
    GIT_AUTHOR_NAME: 'Archive Source Metadata Candidate', GIT_AUTHOR_EMAIL: 'archive-candidate@users.noreply.github.com',
    GIT_COMMITTER_NAME: 'Archive Source Metadata Candidate', GIT_COMMITTER_EMAIL: 'archive-candidate@users.noreply.github.com' };
  let candidateCommit;
  try {
    git(root, ['read-tree', inputCommit], { env });
    git(root, ['update-index', '--force-remove', '--', CANDIDATE_ENVELOPE], { env });
    for (const row of sourceRows) {
      const actualBlob = git(root, ['hash-object', '-w', '--', row.absolute], { env }).trim();
      requireThat(actualBlob === row.blobSha1, 'SOURCE_OBJECT_MISMATCH');
      git(root, ['update-index', '--add', '--cacheinfo', `100644,${actualBlob},${row.path}`], { env });
    }
    const receiptBlob = git(root, ['hash-object', '-w', '--stdin'], { env, input: receiptBytes }).trim();
    git(root, ['update-index', '--add', '--cacheinfo', `100644,${receiptBlob},${receiptPath}`], { env });
    const tree = git(root, ['write-tree'], { env }).trim();
    candidateCommit = git(root, ['commit-tree', tree, '-p', inputCommit], {
      env, input: `Build reviewed source metadata candidate ${materializationId}\n\nExisting public source bytes plus bound metadata changes; ordinary PR gates remain required.\n`,
    }).trim();
  } finally { fs.rmSync(privateDir, { recursive: true, force: true }); }
  requireThat(git(root, ['rev-parse', 'HEAD']).trim() === baseCommit &&
    !git(root, ['diff', '--name-only', 'HEAD', '--']).trim(), 'TRUSTED_CHECKOUT_CHANGED');
  return { schemaVersion: 'archive-reviewed-source-candidate-result-v1', materializationId, baseCommit, inputCommit,
    candidateCommit, candidateBranch, receiptPath, receiptSha256: digest(receiptBytes),
    sourceFileCount: sourceRows.length, inputFileCount: inspected.files.size,
    approvalEffect: 'NONE', registrationStatus: 'NOT_REGISTERED' };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  try {
    const args = process.argv.slice(2);
    const allowed = new Set(['--repo-root', '--input-commit', '--event-ref', '--output-root', '--result-file']);
    const options = {};
    for (let i = 0; i < args.length; i += 2) {
      requireThat(allowed.has(args[i]) && !Object.hasOwn(options, args[i]) && args[i + 1], 'CLI_ARGUMENT');
      options[args[i]] = args[i + 1];
    }
    requireThat(options['--result-file'], 'RESULT_FILE_REQUIRED');
    const root = fs.realpathSync(options['--repo-root'] || process.cwd());
    const resultPath = outsideNewDirectory(root, options['--result-file']);
    const result = await buildSourceMetadataCandidate({ repoRoot: root, inputCommit: options['--input-commit'],
      eventRef: options['--event-ref'], outputRoot: options['--output-root'] });
    fs.writeFileSync(resultPath, JSON.stringify(result, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
    console.log(JSON.stringify(result));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
