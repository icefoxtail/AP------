import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { pathToFileURL } from 'node:url';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';

export const SOURCE_METADATA_MANIFEST_SCHEMA = 'archive-reviewed-source-metadata-materialization-v1';
export const SOURCE_METADATA_FIELDS = Object.freeze([
  'courseKey', 'crossConceptKeys', 'curriculum', 'reviewStatus', 'rpmL3', 'rpmL4',
  'rpmPath', 'tagConfidence', 'tagStatus', 'templateKey',
]);
export const M3_SOURCE_METADATA_PROFILE = 'M3_REVIEWED_METADATA_V1';
export const M3_SOURCE_METADATA_FIELDS = Object.freeze([
  'curriculum', 'curriculumKey', 'courseKey', 'conditionKeys', 'primaryMethod',
  'reviewStatus', 'tagStatus', 'tagConfidence', 'crossConceptKeys', 'decisiveStep',
]);
const SOURCE = /^archive\/exams\/original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/u;
const M3_SOURCE = /^archive\/exams\/original\/middle\/m3\/(?:2mid|2final)\/[^/]+\.js$/u;
const REQUEST = /^\.archive-meta-register\/inbox\/[A-Za-z0-9][A-Za-z0-9_.-]*\.json$/;
const IDENTITY = 'archive/data/question_identity_map.json';
const UID = /^qid_v1_[a-f0-9]{64}$/;
const HASH = /^[a-f0-9]{64}$/;
const GIT_HASH = /^[a-f0-9]{40}$/;
const fail = code => { throw new Error(`SOURCE_METADATA_MATERIALIZER:${code}`); };
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const blob = bytes => crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
const plain = value => value !== null && typeof value === 'object' && !Array.isArray(value)
  && Object.getPrototypeOf(value) === Object.prototype;
const equal = isDeepStrictEqual;
const text = value => typeof value === 'string' && value.length > 0 && value.length <= 160
  && !/[\r\n\0<>]/u.test(value);

function keys(value, expected, label, optional = []) {
  if (!plain(value) || Object.keys(value).some(k => !expected.includes(k) && !optional.includes(k))
      || expected.some(k => !Object.hasOwn(value, k))) fail(`${label}_SHAPE`);
}
function safeRelative(value, label) {
  if (typeof value !== 'string' || value !== value.normalize('NFC') || path.isAbsolute(value)
      || /[\\\r\n\0:]/u.test(value) || value.split('/').some(p => !p || p === '.' || p === '..')) fail(`${label}_PATH`);
  return value;
}
function hashRef(ref, label) {
  keys(ref, ['blobSha1', 'sha256'], label);
  if (!GIT_HASH.test(ref.blobSha1) || !HASH.test(ref.sha256)) fail(`${label}_HASH`);
}
function assertHash(bytes, ref, label) {
  if (blob(bytes) !== ref.blobSha1 || sha(bytes) !== ref.sha256) fail(`${label}_HASH_DRIFT`);
}
function gitRead(repoRoot, commit, relative) {
  if (!GIT_HASH.test(commit)) fail('COMMIT');
  safeRelative(relative, 'GIT');
  try {
    const mode = execFileSync('git', ['-C', repoRoot, 'ls-tree', '-z', commit, '--', relative],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } });
    if (!/^100644 blob [a-f0-9]{40}\t[^\0]+\0$/u.test(mode) || mode.slice(mode.indexOf('\t') + 1, -1) !== relative)
      fail('GIT_REGULAR_FILE_REQUIRED');
    return execFileSync('git', ['-C', repoRoot, 'show', `${commit}:${relative}`],
      { maxBuffer: 192 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } });
  } catch (error) {
    if (String(error.message).startsWith('SOURCE_METADATA_MATERIALIZER:')) throw error;
    fail('IMMUTABLE_GIT_INPUT_UNAVAILABLE');
  }
}
function readJson(bytes, label) {
  try { return JSON.parse(bytes.toString('utf8')); } catch { fail(`${label}_JSON`); }
}
function assertCommit(repoRoot, commit) {
  if (!GIT_HASH.test(commit ?? '')) fail('COMMIT');
  try {
    if (execFileSync('git', ['-C', repoRoot, 'cat-file', '-t', commit],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, GIT_NO_LAZY_FETCH: '1' } }).trim() !== 'commit') fail('COMMIT_OBJECT_REQUIRED');
  } catch (error) {
    if (String(error.message).startsWith('SOURCE_METADATA_MATERIALIZER:')) throw error;
    fail('IMMUTABLE_COMMIT_UNAVAILABLE');
  }
}

// Deliberately not a JavaScript evaluator or a general patch engine. Only the
// M2 uses the existing byte-canonical JSON bank. M3 additionally reads a static
// JSON tree with source ranges, so its established spacing and unselected bytes
// survive metadata value edits. Neither profile evaluates JavaScript.
function jsonLiteralEnd(source, start) {
  let depth = 0, inString = false, escaped = false, end = -1;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') inString = false;
    } else if (c === '"') inString = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') {
      if (--depth === 0) { end = i + 1; break; }
    }
  }
  if (end < 0) fail('SOURCE_JSON_LITERAL_REQUIRED');
  return end;
}
const onlySpaceAndLineComments = source => /^(?:\s|\/\/[^\r\n]*(?:\r?\n|$))*$/u.test(source);
function staticM3Json(source, offset) {
  let i = offset;
  const space = () => { while (/[ \t\r\n]/u.test(source[i] ?? '\0')) i++; };
  function string() {
    const start = i++;
    let escaped = false;
    for (; i < source.length; i++) {
      const c = source[i];
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') { i++; return readJson(Buffer.from(source.slice(start, i)), 'SOURCE_LITERAL'); }
    }
    fail('SOURCE_LITERAL_JSON');
  }
  function value(depth = 0) {
    if (depth > 100) fail('SOURCE_LITERAL_DEPTH');
    space(); const start = i, c = source[i];
    if (c === '{') {
      i++; const result = {}, members = new Map(); space();
      if (source[i] === '}') { i++; return { start, end: i, value: result, members }; }
      while (i < source.length) {
        space(); let key;
        if (source[i] === '"') key = string();
        // The one existing legacy spelling is a property name, never code.
        else if (/^answer[ \t\r\n]*:/u.test(source.slice(i))) { key = 'answer'; i += 6; }
        else fail('SOURCE_LITERAL_JSON');
        space(); if (source[i++] !== ':') fail('SOURCE_LITERAL_JSON');
        const child = value(depth + 1);
        // One public M3 bank repeats this immutable display-size string. Equal
        // copies are unambiguous and remain byte-identical; all writable fields
        // and every conflicting duplicate still fail closed.
        if (members.has(key) && !(key === 'imageSize' && typeof child.value === 'string'
            && members.get(key).value === child.value)) fail('SOURCE_DUPLICATE_PROPERTY');
        members.set(key, child);
        Object.defineProperty(result, key, { value: child.value, enumerable: true, configurable: true, writable: true });
        space(); const separator = source[i++];
        if (separator === '}') return { start, end: i, value: result, members };
        if (separator !== ',') fail('SOURCE_LITERAL_JSON');
      }
      fail('SOURCE_LITERAL_JSON');
    }
    if (c === '[') {
      i++; const elements = []; space();
      if (source[i] === ']') { i++; return { start, end: i, value: [], elements }; }
      while (i < source.length) {
        elements.push(value(depth + 1)); space(); const separator = source[i++];
        if (separator === ']') return { start, end: i, value: elements.map(n => n.value), elements };
        if (separator !== ',') fail('SOURCE_LITERAL_JSON');
      }
      fail('SOURCE_LITERAL_JSON');
    }
    if (c === '"') return { start, value: string(), end: i };
    const token = /^(?:true|false|null|-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?)/u.exec(source.slice(i));
    if (!token) fail('SOURCE_LITERAL_JSON');
    i += token[0].length;
    const result = readJson(Buffer.from(token[0]), 'SOURCE_LITERAL');
    if (typeof result === 'number' && !Number.isFinite(result)) fail('SOURCE_LITERAL_NUMBER');
    return { start, end: i, value: result };
  }
  return value();
}
function m3LiteralBank(bytes) {
  const source = bytes.toString('utf8');
  if (!Buffer.from(source).equals(bytes)) fail('SOURCE_UTF8');
  const banks = [...source.matchAll(/(?:^|\n)[ \t]*window\.(questionBank|questions)[ \t]*=[ \t]*/gu)];
  const roots = [...source.matchAll(/(?:^|\n)[ \t]*window\.examData[ \t]*=[ \t]*/gu)];
  let tree;
  if (banks.length === 1) {
    const assignment = banks[0]; let start = assignment.index + assignment[0].length;
    const alias = /^window\.(questionBank|questions)[ \t]*=[ \t]*/u.exec(source.slice(start));
    if (alias) { if (alias[1] === assignment[1]) fail('SOURCE_LITERAL_ASSIGNMENT'); start += alias[0].length; }
    if (source[start] === '[') {
      tree = staticM3Json(source, start);
      if (!/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(tree.end))) fail('SOURCE_LITERAL_TERMINATOR');
    } else if (alias || assignment[1] !== 'questionBank' || !/^window\.examData\.questions[ \t]*;/u.test(source.slice(start)))
      fail('SOURCE_EXAM_DATA_ALIAS');
  } else if (banks.length !== 0) fail('SOURCE_LITERAL_ASSIGNMENT');
  if (!tree) {
    if (roots.length !== 1) fail('SOURCE_EXAM_DATA_LITERAL');
    const root = staticM3Json(source, roots[0].index + roots[0][0].length);
    if (!plain(root.value) || !root.members?.has('questions')) fail('SOURCE_EXAM_DATA_QUESTIONS');
    const tail = source.slice(root.end);
    const expected = banks.length ? /^(?:[ \t]*;[\s\S]*?)\bwindow\.questionBank[ \t]*=[ \t]*window\.examData\.questions[ \t]*;[ \t]*(?:\r?\n|$)/u : /^[ \t]*;[ \t]*(?:\r?\n|$)/u;
    if (!expected.test(tail)) fail('SOURCE_EXAM_DATA_ALIAS');
    tree = root.members.get('questions');
    if (Object.hasOwn(root.value, 'totalQuestions') && root.value.totalQuestions !== tree.value?.length) fail('SOURCE_EXAM_DATA_DENOMINATOR');
  }
  const bank = tree.value;
  if (!Array.isArray(bank) || !bank.length || bank.some(q => !plain(q))) fail('SOURCE_JSON_LITERAL_REQUIRED');
  return { bank, prefix: source.slice(0, tree.start), suffix: source.slice(tree.end), tree, source };
}
function patchM3Metadata(layout, selected, afterBank) {
  const edits = [];
  for (const row of selected) {
    const node = layout.tree.elements[row.sourceOrdinal - 1], added = [];
    for (const field of row.fields) {
      const value = JSON.stringify(afterBank[row.sourceOrdinal - 1][field]);
      const member = node.members.get(field);
      if (member) edits.push([member.start, member.end, value]);
      else added.push('    ' + JSON.stringify(field) + ': ' + value);
    }
    if (added.length) {
      let pos = node.end - 1;
      while (/[ \t\r\n]/u.test(layout.source[pos - 1] ?? '\0')) pos--;
      edits.push([pos, pos, (node.members.size ? ',' : '') + '\n' + added.join(',\n')]);
    }
  }
  let source = layout.source;
  for (const [start, end, value] of edits.sort((a, b) => b[0] - a[0])) source = source.slice(0, start) + value + source.slice(end);
  return Buffer.from(source);
}
function literalBank(bytes, { m3 = false } = {}) {
  if (m3) return m3LiteralBank(bytes);
  const source = bytes.toString('utf8');
  if (!Buffer.from(source).equals(bytes)) fail('SOURCE_UTF8');
  const matches = [...source.matchAll(/(?:^|\n)[ \t]*window\.(questionBank|questions)[ \t]*=[ \t]*/gu)];
  if (matches.length !== 1) fail('SOURCE_LITERAL_ASSIGNMENT');
  const assignment = matches[0];
  let start = assignment.index + assignment[0].length, wrapper = null;
  const alias = /^window\.(questionBank|questions)[ \t]*=[ \t]*/u.exec(source.slice(start));
  if (alias) {
    if (alias[1] === assignment[1]) fail('SOURCE_LITERAL_ASSIGNMENT');
    start += alias[0].length;
  }
  if (source.slice(start).startsWith('window.examData.questions')) {
    if (alias || assignment[1] !== 'questionBank' || !/^window\.examData\.questions[ \t]*;/u.test(source.slice(start)))
      fail('SOURCE_EXAM_DATA_ALIAS');
    const roots = [...source.slice(0, assignment.index).matchAll(/(?:^|\n)[ \t]*window\.examData[ \t]*=[ \t]*/gu)];
    if (roots.length !== 1) fail('SOURCE_EXAM_DATA_LITERAL');
    const objectStart = roots[0].index + roots[0][0].length;
    if (source[objectStart] !== '{') fail('SOURCE_EXAM_DATA_LITERAL');
    const objectEnd = jsonLiteralEnd(source, objectStart), objectTail = source.slice(objectEnd, assignment.index);
    if (!/^[ \t]*;/u.test(objectTail) || !onlySpaceAndLineComments(objectTail.replace(/^[ \t]*;/u, ''))
        || !onlySpaceAndLineComments(source.slice(start).replace(/^window\.examData\.questions[ \t]*;/u, '')))
      fail('SOURCE_EXAM_DATA_ALIAS');
    const objectLiteral = source.slice(objectStart, objectEnd);
    wrapper = readJson(Buffer.from(objectLiteral), 'SOURCE_EXAM_DATA');
    const properties = [...objectLiteral.matchAll(/"questions"\s*:\s*\[/gu)];
    if (!plain(wrapper) || properties.length !== 1) fail('SOURCE_EXAM_DATA_QUESTIONS');
    start = objectStart + properties[0].index + properties[0][0].length - 1;
  }
  if (source[start] !== '[') fail('SOURCE_JSON_LITERAL_REQUIRED');
  const end = jsonLiteralEnd(source, start);
  if (!wrapper && !/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(end))) fail('SOURCE_LITERAL_TERMINATOR');
  const literal = source.slice(start, end), bank = readJson(Buffer.from(literal), 'SOURCE_LITERAL');
  if (!Array.isArray(bank) || !bank.length || bank.some(q => !plain(q)) || JSON.stringify(bank, null, 2) !== literal)
    fail('SOURCE_CANONICAL_JSON_LITERAL_REQUIRED');
  if (wrapper && (!equal(wrapper.questions, bank) || Object.hasOwn(wrapper, 'totalQuestions') && wrapper.totalQuestions !== bank.length))
    fail('SOURCE_EXAM_DATA_DENOMINATOR');
  return { bank, prefix: source.slice(0, start), suffix: source.slice(end) };
}

function typedAfter(field, value, m3 = false) {
  if (field === 'curriculum' || m3 && field === 'curriculumKey') return ['2015', '2022'].includes(value);
  if (field === 'courseKey') return typeof value === 'string' && (m3 ? /^M3-[12]$/ : /^M2-[12]$/).test(value);
  if (field === 'templateKey') return typeof value === 'string' && /^TPL_[A-Z0-9_]+$/.test(value);
  if (field === 'crossConceptKeys') return Array.isArray(value) && value.length <= 32
    && new Set(value).size === value.length && value.every(v => typeof v === 'string' && /^CC_[A-Z0-9_]+$/.test(v));
  if (m3 && field === 'conditionKeys') return Array.isArray(value) && value.length <= 32
    && new Set(value).size === value.length && value.every(v => typeof v === 'string' && /^COND_[A-Z0-9_]+$/.test(v));
  if (m3 && ['primaryMethod', 'decisiveStep'].includes(field)) return text(value);
  if (field === 'tagConfidence') return value === 'approved_final_qa';
  if (field === 'reviewStatus' || field === 'tagStatus') return value === 'reviewed_pass';
  if (field === 'rpmL3' || field === 'rpmL4') return text(value);
  if (field === 'rpmPath') return plain(value) && Object.keys(value).length === 6
    && ['curriculum', 'scope', 'majorUnit', 'midUnit', 'l3', 'l4'].every(k => Object.hasOwn(value, k))
    && typedAfter('curriculum', value.curriculum) && typedAfter('courseKey', value.scope)
    && ['majorUnit', 'midUnit', 'l3', 'l4'].every(k => text(value[k]));
  return false;
}

// M3 rationale transport copies an existing native judgment verbatim. It may
// not turn a newly authored request string into a native review claim.
function assertM3NativeRationale({ repoRoot, request, item, file, change, field, value, cache }) {
  const spec = item.sourceReview;
  if (!plain(spec) || spec.schemaVersion !== 'archive-reviewed-source-reassessment-v1'
      || !GIT_HASH.test(spec.reviewCommit ?? '') || !plain(spec.reviewRef)
      || !HASH.test(spec.reviewRef.sha256 ?? '')) fail('M3_NATIVE_RATIONALE_REF');
  safeRelative(spec.reviewPath, 'M3_NATIVE_REVIEW');
  const key = `${spec.reviewCommit}:${spec.reviewPath}`;
  if (!cache.has(key)) {
    assertCommit(repoRoot, spec.reviewCommit);
    const bytes = gitRead(repoRoot, spec.reviewCommit, spec.reviewPath);
    cache.set(key, { bytes, review: readJson(bytes, 'M3_NATIVE_REVIEW') });
  }
  const { bytes, review } = cache.get(key);
  if (sha(bytes) !== spec.reviewRef.sha256 || review.schemaVersion !== 'm3-s2-complete-semantic-review-v1'
      || review.sourceArchiveFile !== request.sourceArchiveFile || review.questionCount !== file.expectedQuestionCount
      || !Array.isArray(review.items)) fail('M3_NATIVE_RATIONALE_DOCUMENT');
  const rows = review.items.filter(row => row.questionUid === change.questionUid);
  if (rows.length !== 1 || rows[0].ordinal !== change.sourceOrdinal) fail('M3_NATIVE_RATIONALE_UID');
  const row = rows[0];
  let nativeValue;
  if (Object.hasOwn(row.after ?? {}, field)) nativeValue = row.after[field];
  else if (text(row[field])) nativeValue = row[field];
  else {
    const sourceKey = `${spec.reviewCommit}:${file.path}`;
    if (!cache.has(sourceKey)) cache.set(sourceKey, literalBank(gitRead(repoRoot, spec.reviewCommit, file.path), { m3: true }));
    const { bank } = cache.get(sourceKey);
    if (bank.length !== file.expectedQuestionCount) fail('M3_NATIVE_RATIONALE_DENOMINATOR');
    const native = bank[change.sourceOrdinal - 1];
    if (text(native[field])) nativeValue = native[field];
    else if (field === 'primaryMethod' && item.after.primaryMethod === row.decisiveStep
      && item.after.decisiveStep === row.decisiveStep) nativeValue = row.decisiveStep;
  }
  if (!text(nativeValue) || nativeValue !== value) fail('M3_NATIVE_RATIONALE_VALUE');
}
function requestCarrier(field, request, item, m3 = false) {
  if (['reviewStatus', 'tagStatus', 'tagConfidence'].includes(field)) {
    // These are candidate source declarations for the same FINAL_QA request,
    // not an approval issued by this materializer. Native CI must still accept it.
    const template = m3 ? /^(?:TPL|TM)_[A-Z0-9_]+$/.test(item.after?.templateKey ?? '') : typedAfter('templateKey', item.after?.templateKey);
    if (!template || !/^PT_[A-Z0-9_]+$/.test(item.after?.problemTypeKey ?? ''))
      fail('STATUS_REQUIRES_EXPLICIT_REQUEST_CLASSIFICATION');
    return field === 'tagConfidence' ? 'approved_final_qa' : 'reviewed_pass';
  }
  if (Object.hasOwn(item.after, field)) return item.after[field];
  if (field === 'rpmPath') {
    const a = item.after;
    return { curriculum: a.curriculum, scope: a.courseKey, majorUnit: a.L1, midUnit: a.L2, l3: a.rpmL3, l4: a.rpmL4 };
  }
  fail('FIELD_NOT_EXPLICITLY_CARRIED_BY_REQUEST');
}
function validateRequest(request, file, change) {
  if (request.schemaVersion !== 'archive-reviewed-exam-meta-register-request-v2'
      || request.approval?.type !== 'FINAL_QA' || request.approval.metadataReviewed !== true
      || request.approval.sourceRebind !== undefined || request.registrationMode !== undefined
      || !['PARTIAL_UIDS', undefined].includes(request.scope)
      || request.sourceArchiveFile !== file.path.slice('archive/exams/'.length)
      || request.expectedQuestionCount !== file.expectedQuestionCount || !GIT_HASH.test(request.expectedSourceBlobSha1 ?? '')
      || !Array.isArray(request.items) || !request.items.length) fail('REQUEST_SCOPE');
  if (request.expectedSourceBlobSha1 !== file.after.blobSha1) fail('REQUEST_AFTER_SOURCE_BLOB');
  const all = request.items;
  if (new Set(all.map(i => i.questionUid)).size !== all.length || new Set(all.map(i => i.sourceOrdinal)).size !== all.length
      || all.some(i => !UID.test(i.questionUid ?? '') || !Number.isSafeInteger(i.sourceOrdinal) || i.sourceOrdinal < 1
        || i.sourceOrdinal > file.expectedQuestionCount)) fail('REQUEST_SELECTED_INVENTORY');
  if (request.scope === undefined && all.length !== file.expectedQuestionCount) fail('REQUEST_FULL_DENOMINATOR');
  const items = all.filter(i => i.questionUid === change.questionUid && i.sourceOrdinal === change.sourceOrdinal);
  if (items.length !== 1 || !plain(items[0].after)) fail('REQUEST_UID_BINDING');
  return items[0];
}
function assertIdentity(identity, resolver, file, bank, change) {
  const sourceArchiveFile = file.path.slice('archive/exams/'.length);
  const sourceRows = identity.records.filter(r => r.sourceArchiveFile === sourceArchiveFile);
  if (sourceRows.length !== bank.length || new Set(sourceRows.map(r => r.sourceOrdinal)).size !== bank.length
      || sourceRows.some(r => !Number.isSafeInteger(r.sourceOrdinal) || r.sourceOrdinal < 1 || r.sourceOrdinal > bank.length))
    fail('IDENTITY_DENOMINATOR');
  const records = identity.records.filter(r => r.questionUid === change.questionUid);
  const record = records[0], q = bank[change.sourceOrdinal - 1];
  if (records.length !== 1 || record.sourceArchiveFile !== sourceArchiveFile || record.sourceOrdinal !== change.sourceOrdinal)
    fail('IDENTITY_UID_JOIN');
  const byUid = resolver.resolve({ questionUid: change.questionUid });
  const bySource = resolver.resolve({ sourceArchiveFile, sourceOrdinal: change.sourceOrdinal });
  if (byUid.status !== 'RESOLVED_CANONICAL_UID' || bySource.status !== 'RESOLVED_SOURCE_ORDINAL'
      || [byUid, bySource].some(r => r.questionUid !== change.questionUid || r.sourceArchiveFile !== sourceArchiveFile
        || r.sourceOrdinal !== change.sourceOrdinal)) fail('IDENTITY_LOOKUP_JOIN');
  if (Object.hasOwn(q, 'questionUid') && q.questionUid !== change.questionUid
      && !isUnambiguousLegacySourceUidAlias({ question: q, sourceArchiveFile, sourceOrdinal: change.sourceOrdinal,
        identityRecord: record, identityMap: identity, bank })) fail('EXPLICIT_SOURCE_UID');
}
function isolatedOutput(repoRoot, outputRoot) {
  if (typeof outputRoot !== 'string' || !path.isAbsolute(outputRoot)) fail('ABSOLUTE_OUTPUT_ROOT_REQUIRED');
  const repo = fs.realpathSync(repoRoot), out = path.resolve(outputRoot);
  if (out === path.parse(out).root || out === repo || out.startsWith(repo + path.sep) || repo.startsWith(out + path.sep))
    fail('OUTPUT_MUST_BE_ISOLATED');
  let cur = path.parse(out).root;
  for (const p of out.slice(cur.length).split(path.sep)) {
    cur = path.join(cur, p);
    if (fs.existsSync(cur) && fs.lstatSync(cur).isSymbolicLink()) fail('OUTPUT_SYMLINK');
  }
  return out;
}
function outputFiles(root) {
  const found = [];
  function walk(dir) {
    for (const name of fs.readdirSync(dir)) {
      const p = path.join(dir, name), stat = fs.lstatSync(p);
      if (stat.isSymbolicLink()) fail('OUTPUT_SYMLINK');
      if (stat.isDirectory()) walk(p);
      else if (stat.isFile()) found.push(path.relative(root, p).split(path.sep).join('/'));
      else fail('OUTPUT_REGULAR_FILE_REQUIRED');
    }
  }
  walk(root); return found.sort();
}

export function materializeReviewedSourceMetadata({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, write = false }) {
  if (typeof repoRoot !== 'string' || !fs.statSync(repoRoot).isDirectory()) fail('REPO_ROOT');
  if (write !== true && write !== false) fail('WRITE_BOOLEAN');
  const out = isolatedOutput(repoRoot, outputRoot);
  keys(manifest, ['schemaVersion', 'materializationId', 'baseCommit', 'identityRef', 'requestRefs', 'outputScope', 'files'], 'MANIFEST', ['transportProfile']);
  if (manifest.transportProfile !== undefined && manifest.transportProfile !== M3_SOURCE_METADATA_PROFILE) fail('TRANSPORT_PROFILE');
  const m3 = manifest.transportProfile === M3_SOURCE_METADATA_PROFILE;
  const fieldSet = new Set(m3 ? M3_SOURCE_METADATA_FIELDS : SOURCE_METADATA_FIELDS);
  const nativeCache = new Map();
  if (manifest.schemaVersion !== SOURCE_METADATA_MANIFEST_SCHEMA || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/.test(manifest.materializationId ?? '')
      || !GIT_HASH.test(baseCommit ?? '') || manifest.baseCommit !== baseCommit || !GIT_HASH.test(inputCommit ?? '')) fail('MANIFEST_BINDING');
  const commits = new Set([baseCommit, inputCommit]);
  for (const commit of commits) assertCommit(repoRoot, commit);
  keys(manifest.identityRef, ['path', 'blobSha1', 'sha256'], 'IDENTITY_REF');
  if (manifest.identityRef.path !== IDENTITY) fail('IDENTITY_PATH');
  hashRef({ blobSha1: manifest.identityRef.blobSha1, sha256: manifest.identityRef.sha256 }, 'IDENTITY_REF');
  const identityBytes = gitRead(repoRoot, baseCommit, IDENTITY);
  assertHash(identityBytes, manifest.identityRef, 'IDENTITY');
  const identity = readJson(identityBytes, 'IDENTITY');
  if (identity.schemaVersion !== 'question-identity-map-v1' || !Array.isArray(identity.records)) fail('IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity);
  if (!Array.isArray(manifest.requestRefs) || !manifest.requestRefs.length || manifest.requestRefs.length > 100) fail('REQUEST_REFS');
  const requests = [], requestKeys = new Set(), usedRequests = new Set(), requestSelected = new Map();
  for (const ref of manifest.requestRefs) {
    keys(ref, ['path', 'blobSha1', 'sha256'], 'REQUEST_REF', ['commit']);
    safeRelative(ref.path, 'REQUEST');
    hashRef({ blobSha1: ref.blobSha1, sha256: ref.sha256 }, 'REQUEST_REF');
    if (!REQUEST.test(ref.path) || ref.commit !== undefined && !GIT_HASH.test(ref.commit)) fail('REQUEST_REF_BINDING');
    if (ref.commit && !commits.has(ref.commit)) { assertCommit(repoRoot, ref.commit); commits.add(ref.commit); }
    const key = `${ref.commit ?? inputCommit}:${ref.path}`;
    if (requestKeys.has(key)) fail('DUPLICATE_REQUEST_REF');
    requestKeys.add(key);
    const bytes = gitRead(repoRoot, ref.commit ?? inputCommit, ref.path);
    assertHash(bytes, ref, 'REQUEST');
    requests.push(readJson(bytes, 'REQUEST'));
  }
  if (!Array.isArray(manifest.files) || !manifest.files.length || manifest.files.length > 100
      || !Array.isArray(manifest.outputScope) || manifest.outputScope.length !== manifest.files.length
      || new Set(manifest.outputScope).size !== manifest.outputScope.length
      || !equal([...manifest.outputScope].sort(), manifest.files.map(f => f.path).sort())) fail('OUTPUT_SCOPE');
  const outputs = new Map(), rows = [], uidSet = new Set();
  for (const file of manifest.files) {
    keys(file, ['path', 'before', 'after', 'expectedQuestionCount', 'changes'], 'FILE');
    safeRelative(file.path, 'SOURCE');
    if (!(m3 ? M3_SOURCE : SOURCE).test(file.path) || outputs.has(file.path) || !Number.isSafeInteger(file.expectedQuestionCount)
        || file.expectedQuestionCount < 1 || file.expectedQuestionCount > 1000) fail('FILE_SCOPE');
    hashRef(file.before, 'BEFORE'); hashRef(file.after, 'AFTER');
    const beforeBytes = gitRead(repoRoot, baseCommit, file.path);
    assertHash(beforeBytes, file.before, 'SOURCE_BEFORE');
    const layout = literalBank(beforeBytes, { m3 }), { bank, prefix, suffix } = layout;
    if (bank.length !== file.expectedQuestionCount || !Array.isArray(file.changes) || !file.changes.length) fail('SOURCE_DENOMINATOR');
    const afterBank = JSON.parse(JSON.stringify(bank)), ordinals = new Set(), selected = [];
    for (const change of file.changes) {
      keys(change, ['questionUid', 'sourceOrdinal', 'requestIndex', 'metadataFields'], 'CHANGE');
      if (!UID.test(change.questionUid ?? '') || uidSet.has(change.questionUid) || !Number.isSafeInteger(change.sourceOrdinal)
          || change.sourceOrdinal < 1 || change.sourceOrdinal > bank.length || ordinals.has(change.sourceOrdinal)
          || !Number.isSafeInteger(change.requestIndex) || change.requestIndex < 0 || change.requestIndex >= requests.length
          || !Array.isArray(change.metadataFields) || !change.metadataFields.length) fail('CHANGE_SCOPE');
      assertIdentity(identity, resolver, file, bank, change);
      const request = requests[change.requestIndex], item = validateRequest(request, file, change);
      const question = afterBank[change.sourceOrdinal - 1], fields = new Set();
      for (const op of change.metadataFields) {
        keys(op, ['field', 'beforePresent', 'afterPresent', 'before', 'after'], 'FIELD');
        if (!fieldSet.has(op.field) || fields.has(op.field) || typeof op.beforePresent !== 'boolean'
            || op.afterPresent !== true || !typedAfter(op.field, op.after, m3)) fail('FIELD_SCOPE');
        if (Object.hasOwn(question, op.field) !== op.beforePresent || !op.beforePresent && op.before !== null
            || op.beforePresent && !equal(question[op.field], op.before)) fail('FIELD_BEFORE');
        if (op.beforePresent && equal(op.before, op.after)) fail('FIELD_NO_CHANGE');
        if (!equal(requestCarrier(op.field, request, item, m3), op.after)) fail('FIELD_REQUEST_BINDING');
        if (m3 && ['primaryMethod', 'decisiveStep'].includes(op.field)) assertM3NativeRationale({
          repoRoot, request, item, file, change, field: op.field, value: op.after, cache: nativeCache });
        question[op.field] = op.after; fields.add(op.field);
      }
      uidSet.add(change.questionUid); ordinals.add(change.sourceOrdinal); usedRequests.add(change.requestIndex);
      if (!requestSelected.has(change.requestIndex)) requestSelected.set(change.requestIndex, new Set());
      requestSelected.get(change.requestIndex).add(change.questionUid);
      selected.push({ questionUid: change.questionUid, sourceOrdinal: change.sourceOrdinal, fields: [...fields] });
    }
    // Independently check all objects and property presence, including every field
    // unknown to this module; a whitelist cannot silently omit a protected alias.
    for (let i = 0; i < bank.length; i++) {
      const fields = new Set(selected.find(r => r.sourceOrdinal === i + 1)?.fields || []);
      for (const key of new Set([...Object.keys(bank[i]), ...Object.keys(afterBank[i])])) {
        if (!fields.has(key) && (Object.hasOwn(bank[i], key) !== Object.hasOwn(afterBank[i], key)
            || !equal(bank[i][key], afterBank[i][key]))) fail('UNDECLARED_QUESTION_MUTATION');
      }
    }
    const bytes = m3 ? patchM3Metadata(layout, selected, afterBank) : Buffer.from(prefix + JSON.stringify(afterBank, null, 2) + suffix);
    assertHash(bytes, file.after, 'SOURCE_AFTER');
    const parsed = literalBank(bytes, { m3 });
    if (!equal(parsed.bank, afterBank) || parsed.prefix !== prefix || parsed.suffix !== suffix) fail('SOURCE_ROUNDTRIP');
    outputs.set(file.path, bytes);
    rows.push({ path: file.path, before: file.before, after: file.after, expectedQuestionCount: bank.length,
      changedQuestionCount: selected.length, selected });
  }
  if (usedRequests.size !== requests.length) fail('UNUSED_REQUEST_REF');
  for (const [index, request] of requests.entries()) {
    const selected = requestSelected.get(index);
    if (selected.size !== request.items.length || request.items.some(item => !selected.has(item.questionUid)))
      fail('REQUEST_SELECTED_COVERAGE');
  }
  let candidateSourceWrites = 0;
  if (fs.existsSync(out)) {
    if (!fs.statSync(out).isDirectory() || !equal(outputFiles(out), [...outputs.keys()].sort())
        || [...outputs].some(([p, bytes]) => !fs.readFileSync(path.join(out, p)).equals(bytes))) fail('OUTPUT_ALREADY_DIFFERS');
  } else if (write) {
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const staging = fs.mkdtempSync(out + '.materialize-');
    try {
      for (const [relative, bytes] of outputs) {
        const file = path.join(staging, relative);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, bytes, { flag: 'wx', mode: 0o644 });
      }
      if (fs.existsSync(out)) fail('OUTPUT_RACE');
      fs.renameSync(staging, out);
      candidateSourceWrites = outputs.size;
    } finally { if (fs.existsSync(staging)) fs.rmSync(staging, { recursive: true }); }
  }
  return { schemaVersion: 'archive-reviewed-source-metadata-materialization-receipt-v1',
    status: write ? 'MATERIALIZED_CANDIDATE_REQUIRES_OFFICIAL_REGISTRATION' : 'CHECKED_CANDIDATE_REQUIRES_OFFICIAL_REGISTRATION',
    materializationId: manifest.materializationId, manifestObjectSha256: sha(Buffer.from(JSON.stringify(manifest))),
    baseCommit, inputCommit, sourceFiles: rows.length, changedQuestionCount: uidSet.size,
    candidateSourceWrites, repositorySourceWrites: 0, remoteWrites: 0,
    newApprovals: 0, protectedStudentChanges: 0, legacyOrDifficultyChanges: 0, registrationRequired: true, rows };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2), opts = {}, flags = new Set();
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (['--check', '--write'].includes(arg)) { if (flags.has(arg)) fail('CLI_DUPLICATE'); flags.add(arg); }
      else if (['--repo-root', '--manifest', '--base-commit', '--input-commit', '--output-root'].includes(arg)) {
        if (opts[arg] !== undefined || !args[i + 1] || args[i + 1].startsWith('--')) fail('CLI_ARGUMENT');
        opts[arg] = args[++i];
      } else fail('CLI_UNKNOWN_ARGUMENT');
    }
    if (flags.size !== 1 || !opts['--manifest']) fail('CLI_MODE');
    const report = materializeReviewedSourceMetadata({ repoRoot: opts['--repo-root'] || process.cwd(),
      manifest: readJson(fs.readFileSync(opts['--manifest']), 'MANIFEST'), baseCommit: opts['--base-commit'],
      inputCommit: opts['--input-commit'], outputRoot: opts['--output-root'], write: flags.has('--write') });
    console.log(JSON.stringify(report, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
