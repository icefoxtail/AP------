import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';

export const M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE = 'M3_E052_Q5_ORIGINAL_DIAGRAM_V1';
export const M3_E052_Q5_ORIGINAL_DIAGRAM_SCHEMA = 'archive-m3-e052-q5-original-diagram-materialization-v1';
export const M3_E052_Q5_ORIGINAL_DIAGRAM_STATIC_SCHEMA = 'archive-independent-m3-e052-q5-original-diagram-static-v1';
// Exact independent original-given restoration. This profile issues no approval.
export const M3_E052_Q5_ORIGINAL_DIAGRAM_SCOPE = Object.freeze({
  "key": "E052-Q5",
  "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
  "sourceOrdinal": 5,
  "expectedQuestionCount": 25,
  "wholeQuestionBeforeSha256": "9a1d099a2acaaa89644e71a5cf8703d4670f3063290326beba72fce62c4f758d",
  "sourcePath": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
  "oldAssetPath": "archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05.png",
  "newAssetPath": "archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png"
});
const fixed = M3_E052_Q5_ORIGINAL_DIAGRAM_SCOPE;
const STATIC_PATH = 'docs/operations/m3-e052-q5-original-diagram-20261116/independent-static-v1.json';
const STATIC_SHA256 = 'cce08df8617603db1fd7d8967e01ed8f585105817b693be052156e5c2e846ab8';
const STATIC_GIT = 'f30eabcbe06660f696a7d498a9943f44e655918a';
const STATIC_BYTES = 2638;
const HISTORICAL_SOURCE = Object.freeze({
  "commit": "c777b5add23c5cf43700761fba187e4ece41c778",
  "path": "archive/exams/original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
  "gitBlobSha1": "533c93f017e1640ba9764925b2f164aaeaae9bb7",
  "sha256": "cc6c9ac3347716da154d24321207395cc24539b34a6b99087ae2e5866e087c27",
  "bytes": 66316
});
const ORIGINAL_ASSET = Object.freeze({
  "commit": "c777b5add23c5cf43700761fba187e4ece41c778",
  "path": "archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05.png",
  "gitBlobSha1": "94d3cc1e9458a8096fb53aebd099e1b2d1b2e652",
  "sha256": "57a3d35543875fd44004f2c90f512d872def58fded71e994fd6d836f46557fee",
  "bytes": 16671
});
const APPROVED_ASSET = Object.freeze({
  "path": "archive/assets/images/21_풍덕중_2학기_기말_중3_기출/q05-problem-source-v2.png",
  "gitBlobSha1": "716c4228fd5e2ab0ad995eae9b498f8b57a8eb88",
  "sha256": "e09a9ffa670e31766c57c4687e88a8d44fb773e0ca265cc4d1ad06e40a79ad6f",
  "bytes": 57270
});
const IDENTITY = 'archive/data/question_identity_map.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const MAX_SOURCE = 16 * 1024 * 1024, MAX_ASSET = 4 * 1024 * 1024;
const filesInScope = [fixed.sourcePath];
const fail = code => { throw new Error(`SOURCE_Q5_ORIGINAL_DIAGRAM:${code}`); };
const need = (condition, code) => { if (!condition) fail(code); };
const sha = b => createHash('sha256').update(b).digest('hex');
const blob = b => createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const plain = v => v !== null && typeof v === 'object' && !Array.isArray(v) && Object.getPrototypeOf(v) === Object.prototype;
const equal = isDeepStrictEqual;
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
function keys(v, names, code) {
  need(plain(v) && Object.keys(v).length === names.length && names.every(k => Object.hasOwn(v, k)), code);
}
function safePath(p) {
  need(typeof p === 'string' && p.length > 0 && p.length <= 500 && p === p.normalize('NFC')
    && !/[\\:\x00-\x1f\x7f]/u.test(p) && !path.posix.isAbsolute(p)
    && p.split('/').every(x => x && !['.', '..', '.git'].includes(x)), 'PATH');
  return p;
}
function git(root, args, max = 192 * 1024 * 1024) {
  try { return execFileSync('git', ['-C', root, ...args], {
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' },
    maxBuffer: max, stdio: ['ignore', 'pipe', 'pipe'],
  }); } catch { fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE'); }
}
function gitBytes(root, commit, rel, max) {
  need(SHA1.test(commit || ''), 'COMMIT'); safePath(rel);
  need(git(root, ['cat-file', '-t', commit], 1024).toString().trim() === 'commit', 'COMMIT_OBJECT');
  const rows = git(root, ['ls-tree', '-z', commit, '--', rel], 4096).toString().split('\0').filter(Boolean);
  need(rows.length === 1, 'GIT_FILE_REQUIRED');
  const [header, actualPath] = rows[0].split('\t'), [mode, type, oid] = header.split(' ');
  need(mode === '100644' && type === 'blob' && actualPath === rel && SHA1.test(oid), 'GIT_REGULAR_FILE');
  const size = Number(git(root, ['cat-file', '-s', oid], 1024).toString().trim());
  need(Number.isSafeInteger(size) && size > 0 && size <= max, 'GIT_FILE_SIZE');
  const raw = git(root, ['cat-file', 'blob', oid], max + 1024);
  need(raw.length === size && blob(raw) === oid, 'GIT_BYTES');
  return raw;
}
function hashPair(ref, code) {
  keys(ref, ['blobSha1', 'sha256'], code);
  need(SHA1.test(ref.blobSha1) && SHA256.test(ref.sha256), code);
}
function assertPair(raw, ref, code) { need(blob(raw) === ref.blobSha1 && sha(raw) === ref.sha256, code); }
function immutableRef(root, ref, { expectedPath, expectedCommit, inputCommit, max = MAX_ASSET } = {}) {
  keys(ref, ['commit', 'path', 'gitBlobSha1', 'sha256', 'bytes'], 'IMMUTABLE_REF_SHAPE');
  need(SHA1.test(ref.commit) && SHA1.test(ref.gitBlobSha1) && SHA256.test(ref.sha256)
    && Number.isSafeInteger(ref.bytes) && ref.bytes > 0 && ref.bytes <= max, 'IMMUTABLE_REF_HASH');
  need(ref.commit !== inputCommit && (!expectedCommit || ref.commit === expectedCommit)
    && (!expectedPath || ref.path === expectedPath), 'IMMUTABLE_REF_BINDING');
  const raw = gitBytes(root, ref.commit, ref.path, max);
  need(raw.length === ref.bytes && blob(raw) === ref.gitBlobSha1 && sha(raw) === ref.sha256, 'IMMUTABLE_REF_DRIFT');
  return raw;
}
function parseJson(raw) {
  need(Buffer.from(raw.toString('utf8')).equals(raw), 'JSON_UTF8');
  const source = raw.toString(), stack = [];
  for (let i = 0; i < source.length; i++) {
    const c = source[i], top = stack.at(-1);
    if (c === '"') {
      const start = i++;
      for (; i < source.length; i++) { if (source[i] === '\\') i++; else if (source[i] === '"') break; }
      if (top?.keys && top.key) {
        let key; try { key = JSON.parse(source.slice(start, i + 1)); } catch { fail('JSON'); }
        need(!top.keys.has(key), 'DUPLICATE_JSON_KEY'); top.keys.add(key); top.key = false;
      }
    } else if (c === '{') stack.push({ keys: new Set(), key: true });
    else if (c === '[') stack.push({});
    else if (c === '}' || c === ']') stack.pop();
    else if (c === ',' && top?.keys) top.key = true;
  }
  try { return JSON.parse(source); } catch { fail('JSON'); }
}
function staticReview(root, ref, inputCommit) {
  const raw = immutableRef(root, ref, { expectedPath: STATIC_PATH, inputCommit });
  need(raw.length === STATIC_BYTES && blob(raw) === STATIC_GIT && sha(raw) === STATIC_SHA256, 'EXACT_STATIC_AUTHORITY');
  const doc = parseJson(raw);
  keys(doc, ['schemaVersion', 'profile', 'producer', 'reviewer', 'transportAuthor', 'basis', 'assetCommitBinding', 'row',
    'preservation', 'actualUi', 'newFullMathematicalQa', 'newMetadataApprovals', 'newNativeApprovals', 'newReview2Claims',
    'newDifficultyJudgments'], 'STATIC_SHAPE');
  need(doc.schemaVersion === M3_E052_Q5_ORIGINAL_DIAGRAM_STATIC_SCHEMA && doc.profile === M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE,
    'STATIC_PROFILE');
  need(typeof doc.producer === 'string' && typeof doc.reviewer === 'string' && doc.producer !== doc.reviewer
    && doc.reviewer !== doc.transportAuthor, 'REVIEWER_SEPARATION');
  need(doc.actualUi === 'PENDING' && doc.newFullMathematicalQa === false && doc.newMetadataApprovals === 0
    && doc.newNativeApprovals === 0 && doc.newReview2Claims === 0 && doc.newDifficultyJudgments === 0, 'STATIC_EFFECT');
  const row = doc.row;
  keys(row, ['key', 'questionUid', 'sourceOrdinal', 'expectedQuestionCount', 'beforeSourceRef', 'wholeQuestionBeforeSha256',
    'oldAssetRef', 'newAssetRef', 'decision'], 'STATIC_ROW');
  need(row.key === fixed.key && row.questionUid === fixed.questionUid && row.sourceOrdinal === fixed.sourceOrdinal
    && row.expectedQuestionCount === fixed.expectedQuestionCount && row.wholeQuestionBeforeSha256 === fixed.wholeQuestionBeforeSha256
    && row.decision === 'ORIGINAL_GIVEN_DIAGRAM_RESTORATION', 'STATIC_SCOPE');
  need(equal(row.beforeSourceRef, HISTORICAL_SOURCE) && equal(row.oldAssetRef, ORIGINAL_ASSET)
    && equal(row.newAssetRef, APPROVED_ASSET), 'STATIC_FIXED_REFS');
  const historical = executedBank(immutableRef(root, row.beforeSourceRef, { expectedPath: fixed.sourcePath,
    expectedCommit: HISTORICAL_SOURCE.commit, inputCommit, max: MAX_SOURCE }));
  need(historical.length === fixed.expectedQuestionCount
    && sha(stable(historical[fixed.sourceOrdinal - 1])) === fixed.wholeQuestionBeforeSha256, 'STATIC_GIVEN_DIGEST');
  immutableRef(root, row.oldAssetRef, { expectedPath: fixed.oldAssetPath, expectedCommit: HISTORICAL_SOURCE.commit, inputCommit });
  // The two public files are one immutable revision. The enclosing five-key
  // static ref supplies the new PNG's commit, avoiding a circular self-ref.
  need(doc.assetCommitBinding === 'STATIC_AUTHORITY_COMMIT', 'STATIC_ASSET_COMMIT');
  const newAssetRef = { commit: ref.commit, ...row.newAssetRef };
  immutableRef(root, newAssetRef, { expectedPath: fixed.newAssetPath, inputCommit });
  return { ...doc, newAssetRef };
}

// Strict JSON with value ranges. Only an existing, top-level image string is
// replaceable. No key insertion, generic AST mutation, or source reformatting.
function literalTree(source, start) {
  let i = start;
  const space = () => { while (/[ \t\r\n]/u.test(source[i] ?? '\0')) i++; };
  function string() {
    const a = i++;
    for (; i < source.length; i++) {
      if (source[i] === '\\') i++;
      else if (source[i] === '"') {
        i++; try { return JSON.parse(source.slice(a, i)); } catch { fail('SOURCE_LITERAL_JSON'); }
      }
    }
    fail('SOURCE_LITERAL_JSON');
  }
  function value(depth = 0) {
    need(depth < 100, 'SOURCE_LITERAL_DEPTH'); space(); const a = i, c = source[i];
    if (c === '{') {
      i++; space(); const members = new Map(), result = {};
      if (source[i] === '}') { i++; return { start: a, end: i, value: result, members }; }
      while (i < source.length) {
        space(); need(source[i] === '"', 'SOURCE_LITERAL_JSON'); const key = string(); space();
        need(!members.has(key) && !['__proto__', 'constructor', 'prototype'].includes(key), 'SOURCE_DUPLICATE_OR_UNSAFE_KEY');
        need(source[i++] === ':', 'SOURCE_LITERAL_JSON'); const child = value(depth + 1);
        members.set(key, child); Object.defineProperty(result, key, { value: child.value, enumerable: true });
        space(); const end = source[i++];
        if (end === '}') return { start: a, end: i, value: result, members };
        need(end === ',', 'SOURCE_LITERAL_JSON');
      }
    } else if (c === '[') {
      i++; space(); const elements = [];
      if (source[i] === ']') { i++; return { start: a, end: i, value: [], elements }; }
      while (i < source.length) {
        elements.push(value(depth + 1)); space(); const end = source[i++];
        if (end === ']') return { start: a, end: i, value: elements.map(x => x.value), elements };
        need(end === ',', 'SOURCE_LITERAL_JSON');
      }
    } else if (c === '"') return { start: a, value: string(), end: i };
    else {
      const token = /^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/u.exec(source.slice(i));
      need(token, 'SOURCE_LITERAL_JSON'); i += token[0].length; const v = JSON.parse(token[0]);
      need(typeof v !== 'number' || Number.isFinite(v), 'SOURCE_LITERAL_NUMBER'); return { start: a, end: i, value: v };
    }
    fail('SOURCE_LITERAL_JSON');
  }
  return value();
}
function layout(raw) {
  const source = raw.toString('utf8'); need(Buffer.from(source).equals(raw), 'SOURCE_UTF8');
  const matches = [...source.matchAll(/(?:^|\n)[ \t]*window\.questionBank[ \t]*=[ \t]*/gu)];
  need(matches.length === 1, 'SOURCE_LITERAL_ASSIGNMENT');
  const start = matches[0].index + matches[0][0].length;
  need(source[start] === '[', 'SOURCE_LITERAL_ARRAY'); const tree = literalTree(source, start);
  need(/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(tree.end)) && tree.elements?.length > 0
    && tree.elements.every(x => plain(x.value)), 'SOURCE_LITERAL_BANK');
  return { source, tree };
}
function executedBank(raw) {
  need(raw.length <= MAX_SOURCE, 'SOURCE_SIZE');
  try {
    // Construct exposed objects inside the VM so their constructors cannot
    // refer back to the host realm's Function implementation.
    const ctx = vm.createContext(Object.create(null), { codeGeneration: { strings: false, wasm: false } });
    new vm.Script('globalThis.window = {}; globalThis.console = { log() {}, warn() {}, error() {} };')
      .runInContext(ctx, { timeout: 3000 });
    new vm.Script(raw.toString('utf8'), { filename: 'immutable-source-bank.js' }).runInContext(ctx, { timeout: 3000 });
    const json = new vm.Script(`(() => {
      const bank = window.questionBank || window.questions || globalThis.questionBank || globalThis.questions || window.examData?.questions;
      if (!Array.isArray(bank) || !bank.length) throw new Error('bank');
      const seen = new Set();
      function data(v) {
        if (v === null || typeof v === 'string' || typeof v === 'boolean') return;
        if (typeof v === 'number' && Number.isFinite(v)) return;
        if (!v || typeof v !== 'object' || seen.has(v)) throw new Error('data');
        seen.add(v);
        if (!Array.isArray(v) && Object.getPrototypeOf(v) !== Object.prototype) throw new Error('object');
        const ds = Object.getOwnPropertyDescriptors(v);
        for (const k of Reflect.ownKeys(ds)) {
          if (Array.isArray(v) && k === 'length') continue;
          const d = ds[k];
          if (typeof k !== 'string' || !d.enumerable || !('value' in d)) throw new Error('descriptor');
          data(d.value);
        }
        if (Array.isArray(v) && Object.keys(v).length !== v.length) throw new Error('array');
        seen.delete(v);
      }
      data(bank); return JSON.stringify(bank);
    })()`).runInContext(ctx, { timeout: 3000 });
    const bank = JSON.parse(json);
    need(Array.isArray(bank) && bank.length > 0 && bank.every(plain), 'EXECUTED_BANK'); return bank;
  } catch (error) { if (error.message.startsWith('SOURCE_Q5_ORIGINAL_DIAGRAM:')) throw error; fail('SOURCE_EXECUTION'); }
}
function identityAt(identity, resolver, file, bank, change) {
  const sourceArchiveFile = file.path.slice('archive/exams/'.length);
  const rows = identity.records.filter(r => r.sourceArchiveFile === sourceArchiveFile);
  need(rows.length === bank.length && new Set(rows.map(r => r.sourceOrdinal)).size === bank.length
    && rows.every(r => Number.isSafeInteger(r.sourceOrdinal) && r.sourceOrdinal > 0 && r.sourceOrdinal <= bank.length), 'IDENTITY_DENOMINATOR');
  const matches = identity.records.filter(r => r.questionUid === change.questionUid), record = matches[0];
  need(matches.length === 1 && record.sourceArchiveFile === sourceArchiveFile && record.sourceOrdinal === change.sourceOrdinal,
    'IDENTITY_UID_JOIN');
  const byUid = resolver.resolve({ questionUid: change.questionUid }), byOrdinal = resolver.resolve({ sourceArchiveFile, sourceOrdinal: change.sourceOrdinal });
  need(byUid.status === 'RESOLVED_CANONICAL_UID' && byOrdinal.status === 'RESOLVED_SOURCE_ORDINAL'
    && [byUid, byOrdinal].every(r => r.questionUid === change.questionUid && r.sourceArchiveFile === sourceArchiveFile
      && r.sourceOrdinal === change.sourceOrdinal), 'IDENTITY_LOOKUP_JOIN');
  const q = bank[change.sourceOrdinal - 1];
  need(!Object.hasOwn(q, 'sourceOrdinal') || q.sourceOrdinal === change.sourceOrdinal, 'SOURCE_ORDINAL');
  need(!Object.hasOwn(q, 'questionUid') || q.questionUid === change.questionUid || isUnambiguousLegacySourceUidAlias({
    question: q, sourceArchiveFile, sourceOrdinal: change.sourceOrdinal, identityRecord: record, identityMap: identity, bank }), 'EXPLICIT_SOURCE_UID');
}
function isolatedOutput(root, out) {
  need(typeof out === 'string' && path.isAbsolute(out), 'ABSOLUTE_OUTPUT');
  const repo = fs.realpathSync(root), resolved = path.resolve(out), parent = fs.realpathSync(path.dirname(out));
  need(path.join(parent, path.basename(out)) === resolved && resolved !== repo && !resolved.startsWith(repo + path.sep)
    && !repo.startsWith(resolved + path.sep) && !fs.existsSync(resolved), 'ISOLATED_NEW_OUTPUT');
  return resolved;
}

/** Read immutable current source, change exactly one image URI literal, then
 * execute the whole current bank to prove every other own field and suffix effect. */
export function materializeM3E052Q5OriginalDiagram({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, write = false }) {
  need(write === false || write === true, 'WRITE_BOOLEAN');
  keys(manifest, ['schemaVersion', 'transportProfile', 'materializationId', 'baseCommit', 'identityRef', 'staticEvidenceRef', 'outputScope', 'files'], 'MANIFEST_SHAPE');
  need(manifest.schemaVersion === M3_E052_Q5_ORIGINAL_DIAGRAM_SCHEMA && manifest.transportProfile === M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE
    && /^[a-z0-9][a-z0-9-]{5,80}$/.test(manifest.materializationId || ''), 'MANIFEST_PROFILE');
  need(SHA1.test(baseCommit || '') && SHA1.test(inputCommit || '') && baseCommit !== inputCommit
    && manifest.baseCommit === baseCommit, 'MANIFEST_BASE');
  need(git(repoRoot, ['cat-file', '-t', inputCommit], 1024).toString().trim() === 'commit', 'INPUT_COMMIT_OBJECT');
  need(equal(manifest.outputScope, filesInScope) && Array.isArray(manifest.files) && manifest.files.length === 1
    && equal(manifest.files.map(f => f.path), filesInScope), 'FILE_SCOPE');
  keys(manifest.identityRef, ['path', 'blobSha1', 'sha256'], 'IDENTITY_REF');
  need(manifest.identityRef.path === IDENTITY && SHA1.test(manifest.identityRef.blobSha1) && SHA256.test(manifest.identityRef.sha256), 'IDENTITY_REF');
  const identityRaw = gitBytes(repoRoot, baseCommit, IDENTITY, 192 * 1024 * 1024); assertPair(identityRaw, manifest.identityRef, 'IDENTITY_DRIFT');
  let identity; try { identity = JSON.parse(identityRaw); } catch { fail('IDENTITY_JSON'); }
  need(identity.schemaVersion === 'question-identity-map-v1' && Array.isArray(identity.records), 'IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity), review = staticReview(repoRoot, manifest.staticEvidenceRef, inputCommit);
  const reviewed = new Map([[review.row.key, review.row]]), seen = new Set(), output = [], selection = [];
  for (const file of manifest.files) {
    keys(file, ['path', 'sourceBeforeRef', 'after', 'expectedQuestionCount', 'changes'], 'FILE_SHAPE');
    hashPair(file.after, 'AFTER_REF');
    const raw = immutableRef(repoRoot, file.sourceBeforeRef, { expectedPath: file.path, expectedCommit: baseCommit, inputCommit, max: MAX_SOURCE });
    const before = executedBank(raw), literal = layout(raw);
    need(Number.isSafeInteger(file.expectedQuestionCount) && file.expectedQuestionCount === fixed.expectedQuestionCount && file.expectedQuestionCount === before.length
      && literal.tree.elements.length === before.length, 'SOURCE_DENOMINATOR');
    const scope = [fixed];
    need(Array.isArray(file.changes) && file.changes.length === scope.length, 'CHANGE_SCOPE');
    const edits = [], wanted = structuredClone(before);
    for (const change of file.changes) {
      keys(change, ['key', 'questionUid', 'sourceOrdinal', 'wholeQuestionBeforeSha256', 'imageBefore', 'imageAfter', 'oldAssetRef', 'newAssetRef'], 'CHANGE_SHAPE');
      const selected = change.key === fixed.key ? fixed : null;
      need(selected && selected.sourcePath === file.path && selected.questionUid === change.questionUid
        && selected.sourceOrdinal === change.sourceOrdinal && !seen.has(change.key), 'CHANGE_FIXED_SCOPE'); seen.add(change.key);
      need(SHA256.test(change.wholeQuestionBeforeSha256) && sha(stable(before[change.sourceOrdinal - 1])) === change.wholeQuestionBeforeSha256,
        'WHOLE_QUESTION_BEFORE');
      need(change.imageBefore === fixed.oldAssetPath.slice('archive/'.length) && change.imageAfter === fixed.newAssetPath.slice('archive/'.length)
        && change.imageBefore !== change.imageAfter, 'IMAGE_URI_SCOPE');
      identityAt(identity, resolver, file, before, change);
      need(change.wholeQuestionBeforeSha256 === reviewed.get(change.key).wholeQuestionBeforeSha256,
        'STATIC_CURRENT_WHOLE_QUESTION');
      const q = before[change.sourceOrdinal - 1], node = literal.tree.elements[change.sourceOrdinal - 1].members?.get('image');
      need(Object.hasOwn(q, 'image') && typeof q.image === 'string' && q.image === change.imageBefore
        && node && typeof node.value === 'string' && node.value === change.imageBefore, 'IMAGE_BEFORE');
      immutableRef(repoRoot, change.oldAssetRef, { expectedPath: fixed.oldAssetPath, expectedCommit: baseCommit, inputCommit });
      for (const key of ['path', 'gitBlobSha1', 'sha256', 'bytes'])
        need(change.oldAssetRef[key] === reviewed.get(change.key).oldAssetRef[key], 'STATIC_CURRENT_OLD_ASSET');
      need(equal(change.newAssetRef, review.newAssetRef), 'ASSET_STATIC_JOIN');
      immutableRef(repoRoot, change.newAssetRef, { expectedPath: fixed.newAssetPath, inputCommit });
      const existing = git(repoRoot, ['ls-tree', '-z', baseCommit, '--', fixed.newAssetPath], 4096).toString();
      need(existing === '' || existing === `100644 blob ${APPROVED_ASSET.gitBlobSha1}\t${fixed.newAssetPath}\0`, 'NEW_ASSET_PATH_CONFLICT');
      edits.push({ start: node.start, end: node.end, before: literal.source.slice(node.start, node.end), after: JSON.stringify(change.imageAfter) });
      wanted[change.sourceOrdinal - 1].image = change.imageAfter;
      selection.push({ key: change.key, questionUid: change.questionUid, sourceOrdinal: change.sourceOrdinal,
        beforeWholeQuestionSha256: change.wholeQuestionBeforeSha256, afterWholeQuestionSha256: sha(stable(wanted[change.sourceOrdinal - 1])) });
    }
    let after = literal.source;
    for (const edit of [...edits].sort((a, b) => b.start - a.start)) after = after.slice(0, edit.start) + edit.after + after.slice(edit.end);
    const afterRaw = Buffer.from(after); assertPair(afterRaw, file.after, 'SOURCE_AFTER_DRIFT');
    const executed = executedBank(afterRaw);
    need(equal(executed, wanted), 'EXECUTED_WHOLE_BANK_DRIFT');
    // Inverse exactness also covers whitespace, comments, prefix, trailing
    // metadata statements, original PNG references and every unselected byte.
    let inverse = after;
    for (const edit of [...edits].sort((a, b) => a.start - b.start)) {
      const at = edit.start; need(inverse.slice(at, at + edit.after.length) === edit.after, 'PATCH_RANGE');
      inverse = inverse.slice(0, at) + edit.before + inverse.slice(at + edit.after.length);
    }
    need(inverse === literal.source, 'SOURCE_INVERSE_DRIFT');
    output.push({ path: file.path, raw: afterRaw, blobSha1: blob(afterRaw), sha256: sha(afterRaw), bytes: afterRaw.length,
      expectedQuestionCount: before.length, selectedCount: scope.length, nonselectedWholeQuestionsPreserved: before.length - scope.length });
  }
  need(seen.size === 1, 'EXACT_ONE_REQUIRED');
  if (write) {
    const target = isolatedOutput(repoRoot, outputRoot); fs.mkdirSync(target);
    for (const file of output) { const f = path.join(target, file.path); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, file.raw, { flag: 'wx' }); }
  }
  return { transportProfile: M3_E052_Q5_ORIGINAL_DIAGRAM_PROFILE, requestCount: 0, preservationRequestCount: 0,
    selectedUidCount: 1, evidenceFileCount: 1, newApprovals: 0, approvalEffect: 'NONE', actualUi: 'PENDING',
    staticEvidenceRef: manifest.staticEvidenceRef, sourceFiles: output.map(({ raw, ...r }) => r), selection,
    evidenceTraversal: 'EXACT_ORIGINAL_GIVEN_STATIC_AUTHORITY_AND_CURRENT_SOURCE_IDENTITY', sourceFieldsChanged: ['image'],
    selectedOtherFieldsChanged: 0, nonselectedWholeQuestionChanges: 0, originalAssetsChanged: 0, sourcePrefixSuffixChanged: 0 };
}

export function validateM3E052Q5OriginalDiagramCandidate({ root, baseCommit, inputCommit, envelope, manifestFile, files }) {
  need(!Object.hasOwn(envelope, 'preservationRequestRefs') && files.size === 1 && files.get(manifestFile.path) === manifestFile,
    'INPUT_GRAPH_SCOPE');
  return materializeM3E052Q5OriginalDiagram({ repoRoot: root, manifest: manifestFile.value, baseCommit, inputCommit, write: false });
}
