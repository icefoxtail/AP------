import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { createQuestionIdentityResolver, isUnambiguousLegacySourceUidAlias } from '../intelligence/question-identity-contract.mjs';

// Source materialization only: one independently accepted original-choice-order
// correction. No text is accepted from the input and no Native approval is issued.
export const E041_CHOICE_CORRECTION_PROFILE = 'M2S1_E041_Q10_ORIGINAL_CHOICE_ORDER_V1';
export const E041_CHOICE_CORRECTION_SCHEMA = 'archive-m2s1-e041-q10-choice-correction-materialization-v1';
export const E041_CORRECTION_REVIEW_SCHEMA = 'archive-independent-m2s1-e041-q10-choice-correction-v1';
export const E041_CORRECTION_REVIEW_PATH = 'docs/operations/m2s1-e041-q10-original-choice-correction-20261116/independent-correction-v1.json';
export const E041_ORIGINAL_GIVEN_PATH = 'docs/operations/m2s1-e041-q10-original-choice-correction-20261116/original-given.png';
export const E041_CHOICE_SCOPE = Object.freeze({
  key: 'E041-Q10',
  questionUid: 'qid_v1_eff16cb34d23543b88c1ec860d9c271078746a16c8dfd13ceb01a6cecbf7c108',
  sourceOrdinal: 10,
  expectedQuestionCount: 24,
  sourcePath: 'archive/exams/original/middle/m2/1final/21_신흥중_1학기_기말_중2_수학.js',
  reviewedSourceCommit: '47157c1d0d618471a983fe0887cd65355c17dfbd',
  beforeGitBlobSha1: '7e69bf4dc2ca2dba259141f925c2112a847f3eb8',
  beforeSha256: 'a50d8a0a7512495490cb3ab3cd4812f535eb5fb58a13070ab5c328765ec7098c',
  beforeBytes: 50974,
  afterGitBlobSha1: '8352325a9872e91cf699732c3f93ce5afd3a0e05',
  afterSha256: '7c29326ae417dfd561061d09b54e3fe1ebcef60ad38b6926ceeb84ed8e12598a',
  afterBytes: 50974,
  beforeWholeQuestionSha256: 'c34e0db61d17b44639dce4247e3522dba7e1889fa78ccd288b9d3caf8a269385',
  afterWholeQuestionSha256: 'bf25c2bac47da131c50d99af134bc9df317c82732c7df074cea9f73544f9721d',
  originalGivenSha256: 'da955a778bf6974e8ea0954278328bebfd87b26846bbf1c2e13103bd368e545f',
  originalGivenBytes: 75524,
  optionPermutationFromCurrentOneBased: Object.freeze([1, 2, 5, 3, 4]),
  changedFields: Object.freeze(['answer', 'choices', 'solution']),
  solutionLinkedLabelOccurrences: 2,
});

const IDENTITY = 'archive/data/question_identity_map.json';
const SHA1 = /^[a-f0-9]{40}$/, SHA256 = /^[a-f0-9]{64}$/;
const MAX_SOURCE = 16 * 1024 * 1024, MAX_ASSET = 4 * 1024 * 1024;
const fail = code => { throw new Error(`SOURCE_E041_CHOICE:${code}`); };
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

// Strict JSON ranges preserve every source byte outside the pinned choice
// permutation and linked labels. No general text rewriting or key insertion.
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
  let tree, literalEnd;
  if (source[start] === '[') { tree = literalTree(source, start); literalEnd = tree.end; }
  else {
    // An existing JSON examData.questions literal may use this exact alias.
    // Neither the object wrapper nor the alias is rewritten.
    need(/^window\.examData\.questions[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(start)), 'SOURCE_LITERAL_ARRAY');
    const objects = [...source.matchAll(/(?:^|\n)[ \t]*window\.examData[ \t]*=[ \t]*/gu)];
    need(objects.length === 1, 'SOURCE_LITERAL_EXAM_DATA');
    const objectStart = objects[0].index + objects[0][0].length;
    need(source[objectStart] === '{', 'SOURCE_LITERAL_EXAM_DATA');
    const object = literalTree(source, objectStart);
    need(object.end <= matches[0].index, 'SOURCE_LITERAL_EXAM_DATA_ORDER');
    tree = object.members?.get('questions'); literalEnd = object.end;
  }
  need(/^[ \t]*;[ \t]*(?:\r?\n|$)/u.test(source.slice(literalEnd)) && tree?.elements?.length > 0
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
  } catch (error) { if (error.message.startsWith('SOURCE_E041_CHOICE:')) throw error; fail('SOURCE_EXECUTION'); }
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


function exactCorrection(raw) {
  const S = E041_CHOICE_SCOPE;
  need(raw.length === S.beforeBytes && blob(raw) === S.beforeGitBlobSha1 && sha(raw) === S.beforeSha256,
    'FIXED_SOURCE_BEFORE');
  const before = executedBank(raw), literal = layout(raw), index = S.sourceOrdinal - 1;
  need(before.length === S.expectedQuestionCount && literal.tree.elements.length === before.length
    && equal(literal.tree.value, before), 'BANK_LITERAL_EXECUTED_EQUALITY');
  need(before.every((q, i) => Number.isSafeInteger(q.id) && q.id === i + 1), 'BANK_NUMBER_DENOMINATOR');
  const q = before[index], node = literal.tree.elements[index];
  need(sha(stable(q)) === S.beforeWholeQuestionSha256, 'FIXED_WHOLE_QUESTION_BEFORE');
  need(Array.isArray(q.choices) && q.choices.length === 5 && q.choices.every(v => typeof v === 'string')
    && typeof q.answer === 'string' && [...q.answer].length === 1 && typeof q.solution === 'string', 'CORRECTION_FIELDS');
  const oldIndex = q.answer.codePointAt(0) - 0x2460 + 1;
  need(oldIndex >= 1 && oldIndex <= 5, 'ANSWER_CHOICE_LABEL');
  const newIndex = S.optionPermutationFromCurrentOneBased.indexOf(oldIndex) + 1;
  need(newIndex >= 1 && newIndex <= 5 && newIndex !== oldIndex, 'ANSWER_PERMUTATION');
  const newLabel = String.fromCodePoint(0x2460 + newIndex - 1);
  need(q.solution.split(q.answer).length - 1 === S.solutionLinkedLabelOccurrences, 'SOLUTION_LINKED_LABEL_COUNT');
  const wanted = structuredClone(before);
  wanted[index].choices = S.optionPermutationFromCurrentOneBased.map(n => q.choices[n - 1]);
  wanted[index].answer = newLabel;
  wanted[index].solution = q.solution.split(q.answer).join(newLabel);
  need(sha(stable(wanted[index])) === S.afterWholeQuestionSha256, 'FIXED_WHOLE_QUESTION_AFTER');
  const choiceNodes = node.members.get('choices')?.elements;
  need(choiceNodes?.length === 5 && choiceNodes.every((v, i) => v.value === q.choices[i]), 'CHOICES_LITERAL');
  const edits = choiceNodes.map((v, i) => ({ start: v.start, end: v.end,
    before: literal.source.slice(v.start, v.end),
    after: literal.source.slice(choiceNodes[S.optionPermutationFromCurrentOneBased[i] - 1].start,
      choiceNodes[S.optionPermutationFromCurrentOneBased[i] - 1].end) }));
  for (const key of ['answer', 'solution']) {
    const value = node.members.get(key);
    need(value && typeof value.value === 'string' && value.value === q[key], 'LINKED_LABEL_LITERAL');
    edits.push({ start: value.start, end: value.end, before: literal.source.slice(value.start, value.end),
      after: JSON.stringify(wanted[index][key]) });
  }
  let after = literal.source;
  for (const edit of [...edits].sort((a, b) => b.start - a.start))
    after = after.slice(0, edit.start) + edit.after + after.slice(edit.end);
  const output = Buffer.from(after);
  need(output.length === S.afterBytes && blob(output) === S.afterGitBlobSha1 && sha(output) === S.afterSha256,
    'FIXED_SOURCE_AFTER');
  need(equal(executedBank(output), wanted) && equal(layout(output).tree.value, wanted), 'AFTER_EXECUTED_WHOLE_BANK');
  let inverse = after;
  for (const edit of [...edits].sort((a, b) => a.start - b.start)) {
    need(inverse.slice(edit.start, edit.start + edit.after.length) === edit.after, 'INVERSE_EDIT_RANGE');
    inverse = inverse.slice(0, edit.start) + edit.before + inverse.slice(edit.start + edit.after.length);
  }
  need(inverse === literal.source, 'SOURCE_INVERSE_BYTES');
  const fields = [...new Set([...Object.keys(q), ...Object.keys(wanted[index])])]
    .filter(k => !equal(q[k], wanted[index][k]) || Object.hasOwn(q, k) !== Object.hasOwn(wanted[index], k)).sort();
  need(equal(fields, S.changedFields), 'EXACT_THREE_CHANGED_FIELDS');
  const fieldTransitions = fields.map(field => ({ field,
    before: { own: true, type: Array.isArray(q[field]) ? 'array' : 'string', sha256: sha(stable(q[field])) },
    after: { own: true, type: Array.isArray(wanted[index][field]) ? 'array' : 'string', sha256: sha(stable(wanted[index][field])) } }));
  return { before, after: wanted, output, fieldTransitions };
}

function checkedCorrectionReview(root, ref, inputCommit, transformation) {
  const S = E041_CHOICE_SCOPE, doc = parseJson(immutableRef(root, ref,
    { expectedPath: E041_CORRECTION_REVIEW_PATH, inputCommit, max: 128 * 1024 }));
  keys(doc, ['schemaVersion', 'transportProfile', 'scope', 'producer', 'reviewer', 'phaseOrder',
    'originalGivenRef', 'originalObservationSha256', 'rootCorrectionReviewSha256', 'sourceBeforeRef', 'sourceAfter',
    'questionUid', 'sourceOrdinal', 'expectedQuestionCount', 'beforeWholeQuestionSha256', 'afterWholeQuestionSha256',
    'fieldTransitions', 'optionPermutationFromCurrentOneBased', 'linkedLabelChange', 'decision',
    'newNativeApprovals', 'newReview2Claims', 'newMetadataApprovals', 'newDifficultyJudgments', 'newFourSlotVectors',
    'existingApprovalReuseAuthorized', 'actualUi'], 'CORRECTION_REVIEW_SHAPE');
  need(doc.schemaVersion === E041_CORRECTION_REVIEW_SCHEMA && doc.transportProfile === E041_CHOICE_CORRECTION_PROFILE
    && doc.scope === 'EXACT_E041_Q10_ORIGINAL_CHOICE_ORDER_AND_LINKED_LABELS', 'CORRECTION_REVIEW_SCOPE');
  need(doc.producer === 'GPT_REGISTRAR_REPAIR' && doc.reviewer === 'GPT_ROOT_C8F1B0BFB4FA'
    && doc.producer !== doc.reviewer, 'CORRECTION_INDEPENDENT_ROLES');
  need(doc.phaseOrder === 'ORIGINAL_GIVEN_FREEZE_THEN_CURRENT_THEN_LINKED_LABELS'
    && SHA256.test(doc.originalObservationSha256 || '') && SHA256.test(doc.rootCorrectionReviewSha256 || '')
    && !/^0+$/u.test(doc.originalObservationSha256) && !/^0+$/u.test(doc.rootCorrectionReviewSha256), 'CORRECTION_PHASE_FREEZE');
  need(doc.decision === 'ACCEPT_EXACT_ORIGINAL_CHOICE_ORDER_AND_LINKED_LABEL_CORRECTION'
    && doc.newNativeApprovals === 0 && doc.newReview2Claims === 0 && doc.newMetadataApprovals === 0
    && doc.newDifficultyJudgments === 0 && doc.newFourSlotVectors === 0
    && doc.existingApprovalReuseAuthorized === false && doc.actualUi === 'PENDING', 'CORRECTION_AUTHORITY_LIMIT');
  need(doc.questionUid === S.questionUid && doc.sourceOrdinal === S.sourceOrdinal
    && doc.expectedQuestionCount === S.expectedQuestionCount
    && doc.beforeWholeQuestionSha256 === S.beforeWholeQuestionSha256
    && doc.afterWholeQuestionSha256 === S.afterWholeQuestionSha256, 'CORRECTION_FIXED_ITEM');
  need(equal(doc.optionPermutationFromCurrentOneBased, S.optionPermutationFromCurrentOneBased)
    && equal(doc.fieldTransitions, transformation.fieldTransitions), 'CORRECTION_FIXED_TRANSITION');
  keys(doc.linkedLabelChange, ['answerLabelOnly', 'solutionChoiceLabelOccurrencesOnly', 'solutionCalculationUnchanged'],
    'LINKED_LABEL_SHAPE');
  need(doc.linkedLabelChange.answerLabelOnly === true
    && doc.linkedLabelChange.solutionChoiceLabelOccurrencesOnly === S.solutionLinkedLabelOccurrences
    && doc.linkedLabelChange.solutionCalculationUnchanged === true, 'LINKED_LABEL_SCOPE');
  const original = immutableRef(root, doc.sourceBeforeRef,
    { expectedPath: S.sourcePath, expectedCommit: S.reviewedSourceCommit, inputCommit, max: MAX_SOURCE });
  need(original.length === S.beforeBytes && blob(original) === S.beforeGitBlobSha1 && sha(original) === S.beforeSha256,
    'REVIEW_ORIGINAL_SOURCE');
  keys(doc.sourceAfter, ['path', 'gitBlobSha1', 'sha256', 'bytes'], 'REVIEW_AFTER_SHAPE');
  need(doc.sourceAfter.path === S.sourcePath && doc.sourceAfter.gitBlobSha1 === S.afterGitBlobSha1
    && doc.sourceAfter.sha256 === S.afterSha256 && doc.sourceAfter.bytes === S.afterBytes, 'REVIEW_AFTER_BYTES');
  const given = immutableRef(root, doc.originalGivenRef, { expectedPath: E041_ORIGINAL_GIVEN_PATH, inputCommit });
  need(given.length === S.originalGivenBytes && sha(given) === S.originalGivenSha256
    && given.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'ORIGINAL_GIVEN_BYTES');
  return doc;
}

export function materializeE041OriginalChoiceCorrection({ repoRoot, manifest, baseCommit, inputCommit, outputRoot, write = false }) {
  const S = E041_CHOICE_SCOPE;
  need(write === false || write === true, 'WRITE_BOOLEAN');
  keys(manifest, ['schemaVersion', 'transportProfile', 'materializationId', 'baseCommit', 'identityRef',
    'correctionEvidenceRef', 'outputScope', 'files'], 'MANIFEST_SHAPE');
  need(manifest.schemaVersion === E041_CHOICE_CORRECTION_SCHEMA
    && manifest.transportProfile === E041_CHOICE_CORRECTION_PROFILE
    && /^[a-z0-9][a-z0-9-]{5,80}$/u.test(manifest.materializationId || ''), 'MANIFEST_PROFILE');
  need(SHA1.test(baseCommit || '') && SHA1.test(inputCommit || '') && baseCommit !== inputCommit
    && manifest.baseCommit === baseCommit, 'MANIFEST_BASE');
  need(git(repoRoot, ['cat-file', '-t', inputCommit], 1024).toString().trim() === 'commit', 'INPUT_COMMIT_OBJECT');
  need(equal(manifest.outputScope, [S.sourcePath]) && Array.isArray(manifest.files) && manifest.files.length === 1,
    'EXACT_ONE_SOURCE');
  const file = manifest.files[0];
  keys(file, ['path', 'sourceBeforeRef', 'after', 'expectedQuestionCount', 'changes'], 'FILE_SHAPE');
  need(file.path === S.sourcePath && file.expectedQuestionCount === S.expectedQuestionCount, 'FILE_SCOPE');
  hashPair(file.after, 'AFTER_REF');
  need(file.after.blobSha1 === S.afterGitBlobSha1 && file.after.sha256 === S.afterSha256, 'AFTER_FIXED_REF');
  need(Array.isArray(file.changes) && file.changes.length === 1, 'EXACT_ONE_CHANGE');
  const change = file.changes[0];
  keys(change, ['key', 'questionUid', 'sourceOrdinal', 'wholeQuestionBeforeSha256', 'wholeQuestionAfterSha256',
    'changedFields', 'optionPermutationFromCurrentOneBased', 'linkedSolutionLabelOccurrences'], 'CHANGE_SHAPE');
  need(change.key === S.key && change.questionUid === S.questionUid && change.sourceOrdinal === S.sourceOrdinal
    && change.wholeQuestionBeforeSha256 === S.beforeWholeQuestionSha256
    && change.wholeQuestionAfterSha256 === S.afterWholeQuestionSha256
    && equal(change.changedFields, S.changedFields)
    && equal(change.optionPermutationFromCurrentOneBased, S.optionPermutationFromCurrentOneBased)
    && change.linkedSolutionLabelOccurrences === S.solutionLinkedLabelOccurrences, 'CHANGE_FIXED_SCOPE');
  const raw = immutableRef(repoRoot, file.sourceBeforeRef,
    { expectedPath: S.sourcePath, expectedCommit: baseCommit, inputCommit, max: MAX_SOURCE });
  const transformation = exactCorrection(raw);
  keys(manifest.identityRef, ['path', 'blobSha1', 'sha256'], 'IDENTITY_REF');
  need(manifest.identityRef.path === IDENTITY && SHA1.test(manifest.identityRef.blobSha1)
    && SHA256.test(manifest.identityRef.sha256), 'IDENTITY_REF');
  const identityRaw = gitBytes(repoRoot, baseCommit, IDENTITY, 192 * 1024 * 1024);
  assertPair(identityRaw, manifest.identityRef, 'IDENTITY_DRIFT');
  const identity = parseJson(identityRaw);
  need(identity.schemaVersion === 'question-identity-map-v1' && Array.isArray(identity.records), 'IDENTITY_SCHEMA');
  const resolver = createQuestionIdentityResolver(identity);
  const bankRows = identity.records.filter(r => r.sourceArchiveFile === S.sourcePath.slice('archive/exams/'.length));
  need(bankRows.length === S.expectedQuestionCount, 'IDENTITY_DENOMINATOR');
  for (const row of bankRows) identityAt(identity, resolver, file, transformation.before, row);
  identityAt(identity, resolver, file, transformation.before, change);
  checkedCorrectionReview(repoRoot, manifest.correctionEvidenceRef, inputCommit, transformation);
  const sourceFiles = [{ path: S.sourcePath, blobSha1: blob(transformation.output), sha256: sha(transformation.output),
    bytes: transformation.output.length, expectedQuestionCount: S.expectedQuestionCount, selectedCount: 1,
    nonselectedWholeQuestionsPreserved: S.expectedQuestionCount - 1 }];
  if (write) {
    const target = isolatedOutput(repoRoot, outputRoot); fs.mkdirSync(target);
    const p = path.join(target, S.sourcePath); fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, transformation.output, { flag: 'wx' });
  }
  return { transportProfile: E041_CHOICE_CORRECTION_PROFILE, requestCount: 0, preservationRequestCount: 0,
    selectedUidCount: 1, evidenceFileCount: 1, newApprovals: 0, approvalEffect: 'NONE', actualUi: 'PENDING',
    nativeCorrectionReview: 'REQUIRED_SEPARATELY', existingApprovalReuseAuthorized: false,
    correctionEvidenceRef: manifest.correctionEvidenceRef, sourceFiles,
    selection: [{ key: S.key, questionUid: S.questionUid, sourceOrdinal: S.sourceOrdinal,
      beforeWholeQuestionSha256: S.beforeWholeQuestionSha256, afterWholeQuestionSha256: S.afterWholeQuestionSha256,
      changedFields: [...S.changedFields], fieldTransitions: transformation.fieldTransitions }],
    evidenceTraversal: 'EXACT_ROOT_ORIGINAL_GIVEN_CHOICE_CORRECTION_CURRENT_WHOLE_SOURCE_AND_IDENTITY',
    sourceFieldsChanged: [...S.changedFields], literalChangeKind: 'EXACT_OPTION_PERMUTATION_AND_LINKED_CHOICE_LABELS',
    nonselectedWholeQuestionChanges: 0, sourcePrefixSuffixChanged: 0, assetsChanged: 0,
    metadataWrites: 0, identityWrites: 0, compactWrites: 0 };
}

export function validateE041OriginalChoiceCorrectionCandidate({ root, baseCommit, inputCommit, envelope, manifestFile, files }) {
  need(!Object.hasOwn(envelope, 'preservationRequestRefs') && files.size === 1
    && files.get(manifestFile.path) === manifestFile, 'INPUT_GRAPH_SCOPE');
  return materializeE041OriginalChoiceCorrection({ repoRoot: root, manifest: manifestFile.value, baseCommit, inputCommit, write: false });
}
