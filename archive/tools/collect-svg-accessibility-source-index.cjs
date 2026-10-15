const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const SOURCE_ROOTS = Object.freeze(['archive/exams', 'archive/generated', 'archive/textbook']);
const ROLE_FIELDS = Object.freeze([
  ['image', 'problem'],
  ['imageRef', 'problem'],
  ['problemImage', 'problem'],
  ['problemImageRef', 'problem'],
  ['originalProblemImage', 'problem'],
  ['solutionImage', 'solution'],
  ['solutionImageRef', 'solution']
]);
const BANK_FIELDS = Object.freeze(['questionBank', 'questions', 'problems', 'examQuestions']);

function normalizeSvgAssetRef(value) {
  if (typeof value !== 'string') return null;
  let reference = value.trim().replaceAll('\\', '/').split(/[?#]/, 1)[0];
  if (!reference || /^(?:data:|blob:|https?:)/i.test(reference)) return null;
  while (reference.startsWith('./')) reference = reference.slice(2);
  reference = reference.replace(/^archive\//i, '');
  if (!reference.startsWith('assets/')) return null;
  if (/%2e|%2f|%5c/i.test(reference)) throw new Error(`INVALID_SVG_ACCESSIBILITY_SOURCE_REF:${value}`);
  const segments = reference.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    throw new Error(`INVALID_SVG_ACCESSIBILITY_SOURCE_REF:${value}`);
  }
  return reference.toLowerCase().endsWith('.svg') ? reference : null;
}

function walkJsFiles(repoRoot, sourceRoot, output = []) {
  const absoluteRoot = path.join(repoRoot, sourceRoot);
  if (!fs.existsSync(absoluteRoot)) return output;
  for (const entry of fs.readdirSync(absoluteRoot, { withFileTypes: true })) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    const relativePath = path.relative(repoRoot, absolutePath).replace(/\\/g, '/');
    if (entry.isDirectory()) walkJsFiles(repoRoot, relativePath, output);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.js')) output.push(relativePath);
  }
  return output;
}

function questionBanks(sandbox) {
  const candidates = [];
  for (const field of BANK_FIELDS) candidates.push(sandbox.window?.[field], sandbox[field]);
  const banks = [];
  const seen = new Set();
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      if (!seen.has(candidate)) { seen.add(candidate); banks.push(candidate); }
    } else if (candidate && typeof candidate === 'object') {
      for (const nestedField of ['questions', 'problems', 'items']) {
        const nested = candidate[nestedField];
        if (Array.isArray(nested) && !seen.has(nested)) { seen.add(nested); banks.push(nested); }
      }
    }
  }
  return banks;
}

function flattenReferenceValues(value, output = []) {
  if (typeof value === 'string') output.push(value);
  else if (Array.isArray(value)) for (const item of value) flattenReferenceValues(item, output);
  else if (value && typeof value === 'object') {
    for (const key of ['assetRef', 'imageRef', 'path', 'src', 'url', 'value']) {
      if (Object.prototype.hasOwnProperty.call(value, key)) flattenReferenceValues(value[key], output);
    }
  }
  return output;
}

function sourceIdentity(question) {
  return {
    sourceQid: String(question?.sourceQid ?? question?.sourceQID ?? question?.qid
      ?? question?.questionNo ?? question?.id ?? question?.sourceQuestionNo ?? question?.source_question_no ?? '').trim(),
    sourceUid: String(question?.uid ?? question?.questionUid ?? question?.sourceQuestionUid
      ?? question?.source_question_uid ?? '').trim()
  };
}

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, bytes])).digest('hex');
}

function addQuestionUses(question, sourceExamRef, sourceHashes, usesByAsset) {
  const identity = sourceIdentity(question);
  for (const [field, visualRole] of ROLE_FIELDS) {
    for (const rawRef of flattenReferenceValues(question?.[field])) {
      const assetRef = normalizeSvgAssetRef(rawRef);
      if (!assetRef) continue;
      const use = { assetRef, visualRole, sourceExamRef, sourceQid: identity.sourceQid, sourceUid: identity.sourceUid, sourceField: field, ...sourceHashes };
      if (!usesByAsset.has(assetRef)) usesByAsset.set(assetRef, new Map());
      usesByAsset.get(assetRef).set(`${visualRole}\u0000${sourceExamRef}\u0000${identity.sourceQid}\u0000${field}`, use);
    }
  }
}

function scanJavaScriptSource(source, sourceExamRef, options = {}) {
  const window = {};
  const sandbox = {
    window,
    console: { log() {}, warn() {}, error() {} },
    URL,
    URLSearchParams
  };
  vm.runInNewContext(String(source), sandbox, { filename: sourceExamRef, timeout: options.timeoutMs || 5000 });
  const usesByAsset = new Map();
  const sourceBytes = Buffer.from(String(source), 'utf8');
  const sourceHashes = {
    sourceExamSha256: crypto.createHash('sha256').update(sourceBytes).digest('hex'),
    sourceExamGitBlobSha: gitBlobSha(sourceBytes)
  };
  for (const bank of questionBanks(sandbox)) {
    for (const question of bank) if (question && typeof question === 'object') addQuestionUses(question, sourceExamRef, sourceHashes, usesByAsset);
  }
  return [...usesByAsset.values()].flatMap(byUse => [...byUse.values()]);
}

function collectSvgAccessibilitySourceIndex(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || path.resolve(__dirname, '../..'));
  const sourceRoots = Array.isArray(options.sourceRoots) ? options.sourceRoots : SOURCE_ROOTS;
  const files = [...new Set(sourceRoots.flatMap(sourceRoot => walkJsFiles(repoRoot, sourceRoot)))].sort();
  const usesByAsset = new Map();
  const parseErrors = [];

  for (const sourceExamRef of files) {
    let sourceBytes;
    try { sourceBytes = fs.readFileSync(path.join(repoRoot, sourceExamRef)); }
    catch (error) { parseErrors.push({ sourceExamRef, error: `SOURCE_READ_FAILED:${error.message}` }); continue; }
    try {
      const source = sourceBytes.toString('utf8');
      const sourceHashes = {
        sourceExamSha256: crypto.createHash('sha256').update(sourceBytes).digest('hex'),
        sourceExamGitBlobSha: gitBlobSha(sourceBytes)
      };
      const window = {};
      const sandbox = { window, console: { log() {}, warn() {}, error() {} }, URL, URLSearchParams };
      vm.runInNewContext(source, sandbox, { filename: sourceExamRef, timeout: options.timeoutMs || 5000 });
      for (const bank of questionBanks(sandbox)) {
        for (const question of bank) if (question && typeof question === 'object') addQuestionUses(question, sourceExamRef, sourceHashes, usesByAsset);
      }
    } catch (error) {
      parseErrors.push({ sourceExamRef, error: String(error && error.message || error) });
    }
  }
  if (parseErrors.length && options.failOnParseError !== false) {
    const details = parseErrors.slice(0, 20).map(row => `${row.sourceExamRef}:${row.error}`).join('|');
    throw new Error(`SVG_ACCESSIBILITY_SOURCE_SCAN_PARSE_ERRORS:${parseErrors.length}:${details}`);
  }

  const uses = [...usesByAsset.entries()].map(([assetRef, byUse]) => ({
    assetRef,
    uses: [...byUse.values()].sort((a, b) => {
      const left = `${a.visualRole}\u0000${a.sourceExamRef}\u0000${a.sourceQid}\u0000${a.sourceField}`;
      const right = `${b.visualRole}\u0000${b.sourceExamRef}\u0000${b.sourceQid}\u0000${b.sourceField}`;
      return left < right ? -1 : left > right ? 1 : 0;
    })
  })).sort((a, b) => a.assetRef < b.assetRef ? -1 : a.assetRef > b.assetRef ? 1 : 0);

  return {
    schemaVersion: 'SVG_ACCESSIBILITY_LIVE_SOURCE_INDEX_V1',
    sourceRoots,
    jsFilesScanned: files.length,
    jsParseErrors: parseErrors.length,
    referencedAssetCount: uses.length,
    uses,
    parseErrors
  };
}

function gitText(repoRoot, args, allowMissing = false) {
  try {
    return execFileSync('git', ['-C', repoRoot, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      maxBuffer: 32 * 1024 * 1024
    }).trim();
  }
  catch (error) {
    if (allowMissing) return null;
    throw new Error(`SVG_ACCESSIBILITY_GIT_SCOPE_FAILED:${args.join(' ')}:${error.stderr?.toString().trim() || error.message}`);
  }
}

function resolveSvgAccessibilityBase(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || path.resolve(__dirname, '../..'));
  const supplied = String(options.baseRef || '').trim();
  if (supplied) {
    const resolved = gitText(repoRoot, ['rev-parse', '--verify', `${supplied}^{commit}`]);
    return { baseRef: resolved, baseMode: 'EXPLICIT_BASE' };
  }

  const env = options.env || process.env;
  const eventBefore = String(env.SVG_ACCESSIBILITY_BASE_SHA || '').trim();
  if (eventBefore && !/^0+$/.test(eventBefore)) {
    const resolved = gitText(repoRoot, ['rev-parse', '--verify', `${eventBefore}^{commit}`]);
    return { baseRef: resolved, baseMode: 'CI_PUSH_BEFORE' };
  }
  const baseBranch = String(env.GITHUB_BASE_REF || '').trim();
  if (baseBranch) {
    const remoteRef = `origin/${baseBranch}`;
    const resolved = gitText(repoRoot, ['merge-base', remoteRef, 'HEAD']);
    if (resolved) return { baseRef: resolved, baseMode: 'CI_PULL_REQUEST_MERGE_BASE' };
    throw new Error(`SVG_ACCESSIBILITY_GIT_BASE_REF_UNAVAILABLE:${remoteRef}`);
  }

  const parent = gitText(repoRoot, ['rev-parse', '--verify', 'HEAD^'], true);
  if (parent) return { baseRef: parent, baseMode: 'MANUAL_LAST_COMMIT_PLUS_WORKTREE' };
  const head = gitText(repoRoot, ['rev-parse', '--verify', 'HEAD']);
  return { baseRef: head, baseMode: 'INITIAL_REPOSITORY_WORKTREE_ONLY' };
}

function collectChangedSourceScope(options = {}) {
  const repoRoot = path.resolve(options.repoRoot || path.resolve(__dirname, '../..'));
  const productionRoots = options.sourceRoots || SOURCE_ROOTS;
  const base = options.baseRef
    ? { baseRef: gitText(repoRoot, ['rev-parse', '--verify', `${options.baseRef}^{commit}`]), baseMode: 'EXPLICIT_BASE' }
    : resolveSvgAccessibilityBase({ ...options, repoRoot });
  const diffPathspecs = [...new Set([...productionRoots, 'archive/assets'])];
  const diffPaths = gitText(repoRoot, ['diff', '--name-only', '--no-renames', base.baseRef, '--', ...diffPathspecs]).split(/\r?\n/).filter(Boolean);
  const untracked = gitText(repoRoot, ['ls-files', '--others', '--exclude-standard']).split(/\r?\n/).filter(Boolean);
  const changedPaths = [...new Set([...diffPaths, ...untracked].map(value => value.replace(/\\/g, '/')))].sort();
  const changedJsPaths = changedPaths.filter(file => file.toLowerCase().endsWith('.js') && productionRoots.some(root => file.startsWith(`${root}/`)));
  const changedSvgRefs = [...new Set(changedPaths
    .filter(file => file.toLowerCase().endsWith('.svg') && file.startsWith('archive/assets/'))
    .map(file => normalizeSvgAssetRef(file.slice('archive/'.length)))
    .filter(Boolean))].sort();

  const currentIndex = options.currentIndex || collectSvgAccessibilitySourceIndex({ repoRoot, sourceRoots: productionRoots, timeoutMs: options.timeoutMs });
  const currentUsesByFile = new Map();
  for (const entry of currentIndex.uses) for (const use of entry.uses) {
    if (!currentUsesByFile.has(use.sourceExamRef)) currentUsesByFile.set(use.sourceExamRef, []);
    currentUsesByFile.get(use.sourceExamRef).push(use);
  }
  const newUses = [];
  for (const sourceExamRef of changedJsPaths) {
    const currentUses = currentUsesByFile.get(sourceExamRef) || [];
    const baselineBytes = gitText(repoRoot, ['show', `${base.baseRef}:${sourceExamRef}`], true);
    const baselineUses = baselineBytes === null ? [] : scanJavaScriptSource(baselineBytes, sourceExamRef, options);
    const baselineKeys = new Set(baselineUses.map(use => `${use.assetRef}\u0000${use.visualRole}\u0000${use.sourceQid}\u0000${use.sourceField}`));
    for (const use of currentUses) {
      const key = `${use.assetRef}\u0000${use.visualRole}\u0000${use.sourceQid}\u0000${use.sourceField}`;
      if (!baselineKeys.has(key)) newUses.push(use);
    }
  }
  const uniqueNewUses = [...new Map(newUses.map(use => [`${use.assetRef}\u0000${use.visualRole}\u0000${use.sourceExamRef}\u0000${use.sourceQid}\u0000${use.sourceField}`, use])).values()]
    .sort((a, b) => {
      const left = `${a.assetRef}\u0000${a.visualRole}\u0000${a.sourceExamRef}\u0000${a.sourceQid}`;
      const right = `${b.assetRef}\u0000${b.visualRole}\u0000${b.sourceExamRef}\u0000${b.sourceQid}`;
      return left < right ? -1 : left > right ? 1 : 0;
    });
  return { ...base, scopeMode: base.baseMode, changedPaths, changedJsPaths, changedSvgRefs, newUses: uniqueNewUses, currentIndex };
}

function collectQuestionAssetRefsForFile(source, sourceExamRef, options = {}) {
  return scanJavaScriptSource(source, sourceExamRef, options);
}

module.exports = {
  SOURCE_ROOTS,
  ROLE_FIELDS,
  normalizeSvgAssetRef,
  scanJavaScriptSource,
  collectQuestionAssetRefsForFile,
  collectSvgAccessibilitySourceIndex,
  resolveSvgAccessibilityBase,
  collectChangedSourceScope
};

if (require.main === module) {
  try {
    const result = collectSvgAccessibilitySourceIndex();
    process.stdout.write(`${JSON.stringify({
      schemaVersion: result.schemaVersion,
      sourceRoots: result.sourceRoots,
      jsFilesScanned: result.jsFilesScanned,
      jsParseErrors: result.jsParseErrors,
      referencedAssetCount: result.referencedAssetCount
    }, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error && error.message ? error.message : error}\n`);
    process.exitCode = 1;
  }
}
