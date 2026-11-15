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
const FIELD_SET = new Set(SOURCE_METADATA_FIELDS);
const SOURCE = /^archive\/exams\/original\/middle\/m2\/(?:2mid|2final)\/[^/]+\.js$/u;
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
// existing, byte-canonical JSON bank can be reconstructed. The trusted Git
// wrapper remains byte-identical and no source text is accepted in the manifest.
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
function literalBank(bytes) {
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

function typedAfter(field, value) {
  if (field === 'curriculum') return ['2015', '2022'].includes(value);
  if (field === 'courseKey') return typeof value === 'string' && /^M2-[12]$/.test(value);
  if (field === 'templateKey') return typeof value === 'string' && /^TPL_[A-Z0-9_]+$/.test(value);
  if (field === 'crossConceptKeys') return Array.isArray(value) && value.length <= 32
    && new Set(value).size === value.length && value.every(v => typeof v === 'string' && /^CC_[A-Z0-9_]+$/.test(v));
  if (field === 'tagConfidence') return value === 'approved_final_qa';
  if (field === 'reviewStatus' || field === 'tagStatus') return value === 'reviewed_pass';
  if (field === 'rpmL3' || field === 'rpmL4') return text(value);
  if (field === 'rpmPath') return plain(value) && Object.keys(value).length === 6
    && ['curriculum', 'scope', 'majorUnit', 'midUnit', 'l3', 'l4'].every(k => Object.hasOwn(value, k))
    && typedAfter('curriculum', value.curriculum) && typedAfter('courseKey', value.scope)
    && ['majorUnit', 'midUnit', 'l3', 'l4'].every(k => text(value[k]));
  return false;
}
function requestCarrier(field, request, item) {
  if (['reviewStatus', 'tagStatus', 'tagConfidence'].includes(field)) {
    // These are candidate source declarations for the same FINAL_QA request,
    // not an approval issued by this materializer. Native CI must still accept it.
    if (!typedAfter('templateKey', item.after?.templateKey) || !/^PT_[A-Z0-9_]+$/.test(item.after?.problemTypeKey ?? ''))
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
  keys(manifest, ['schemaVersion', 'materializationId', 'baseCommit', 'identityRef', 'requestRefs', 'outputScope', 'files'], 'MANIFEST');
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
  const requests = [], requestKeys = new Set(), usedRequests = new Set();
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
    if (!SOURCE.test(file.path) || outputs.has(file.path) || !Number.isSafeInteger(file.expectedQuestionCount)
        || file.expectedQuestionCount < 1 || file.expectedQuestionCount > 1000) fail('FILE_SCOPE');
    hashRef(file.before, 'BEFORE'); hashRef(file.after, 'AFTER');
    const beforeBytes = gitRead(repoRoot, baseCommit, file.path);
    assertHash(beforeBytes, file.before, 'SOURCE_BEFORE');
    const { bank, prefix, suffix } = literalBank(beforeBytes);
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
        if (!FIELD_SET.has(op.field) || fields.has(op.field) || typeof op.beforePresent !== 'boolean'
            || op.afterPresent !== true || !typedAfter(op.field, op.after)) fail('FIELD_SCOPE');
        if (Object.hasOwn(question, op.field) !== op.beforePresent || !op.beforePresent && op.before !== null
            || op.beforePresent && !equal(question[op.field], op.before)) fail('FIELD_BEFORE');
        if (op.beforePresent && equal(op.before, op.after)) fail('FIELD_NO_CHANGE');
        if (!equal(requestCarrier(op.field, request, item), op.after)) fail('FIELD_REQUEST_BINDING');
        question[op.field] = op.after; fields.add(op.field);
      }
      uidSet.add(change.questionUid); ordinals.add(change.sourceOrdinal); usedRequests.add(change.requestIndex);
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
    const bytes = Buffer.from(prefix + JSON.stringify(afterBank, null, 2) + suffix);
    assertHash(bytes, file.after, 'SOURCE_AFTER');
    const parsed = literalBank(bytes);
    if (!equal(parsed.bank, afterBank) || parsed.prefix !== prefix || parsed.suffix !== suffix) fail('SOURCE_ROUNDTRIP');
    outputs.set(file.path, bytes);
    rows.push({ path: file.path, before: file.before, after: file.after, expectedQuestionCount: bank.length,
      changedQuestionCount: selected.length, selected });
  }
  if (usedRequests.size !== requests.length) fail('UNUSED_REQUEST_REF');
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
