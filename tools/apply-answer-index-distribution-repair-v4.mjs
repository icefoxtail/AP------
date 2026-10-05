/**
 * Apply the already-gated ACTIVE answer-index distribution plan from the v4
 * report.
 *
 * This is deliberately fail-closed:
 * - it accepts only the exact v4 report and its PLANNED permutations;
 * - it computes and validates every file in memory before the first write;
 * - it edits only choices, answer, and direct solution answer-index literals;
 * - it rolls back files already written if a later write fails.
 *
 * Run with --apply. Without that flag the script refuses to write.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_PATH = path.join(ROOT, 'reports', 'answer-index-distribution-dryrun-v4.json');
const RECEIPT_PATH = path.join(ROOT, 'reports', 'answer-index-distribution-repair-v4.json');
const CIRCLED = '①②③④⑤';
const BACKTICK = String.fromCharCode(96);
const APPLY_REQUESTED = process.argv.includes('--apply');

function fail(message) {
  throw new Error(message);
}

function stable(value) {
  return JSON.stringify(value);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readQuoted(source, start) {
  const quote = source[start];
  if (!['"', "'", BACKTICK].includes(quote)) fail('expected quoted string at offset ' + start);
  let index = start + 1;
  while (index < source.length) {
    if (source[index] === '\\') {
      index += 2;
      continue;
    }
    if (source[index] === quote) {
      return {
        start,
        end: index,
        raw: source.slice(start, index + 1),
      };
    }
    index += 1;
  }
  fail('unterminated string at offset ' + start);
}

function decodeTemplateLiteral(raw) {
  let result = '';
  let index = 1;
  while (index < raw.length - 1) {
    if (raw[index] === '$' && raw[index + 1] === '{') {
      fail('template interpolation is not supported by the repair parser');
    }
    if (raw[index] !== '\\') {
      const codePoint = raw.codePointAt(index);
      const part = String.fromCodePoint(codePoint);
      result += part;
      index += part.length;
      continue;
    }
    const next = raw[index + 1];
    if (next === '\r' || next === '\n') {
      index += next === '\r' && raw[index + 2] === '\n' ? 3 : 2;
      continue;
    }
    if (next === 'u' && raw[index + 2] === '{') {
      const end = raw.indexOf('}', index + 3);
      if (end < 0) fail('unterminated unicode escape in template literal');
      const codePoint = Number.parseInt(raw.slice(index + 3, end), 16);
      if (!Number.isFinite(codePoint)) fail('invalid unicode escape in template literal');
      result += String.fromCodePoint(codePoint);
      index = end + 1;
      continue;
    }
    if (next === 'u') {
      const code = Number.parseInt(raw.slice(index + 2, index + 6), 16);
      if (!Number.isFinite(code)) fail('invalid unicode escape in template literal');
      result += String.fromCharCode(code);
      index += 6;
      continue;
    }
    if (next === 'x') {
      const code = Number.parseInt(raw.slice(index + 2, index + 4), 16);
      if (!Number.isFinite(code)) fail('invalid hex escape in template literal');
      result += String.fromCharCode(code);
      index += 4;
      continue;
    }
    const escapes = {
      n: '\n',
      r: '\r',
      t: '\t',
      b: '\b',
      f: '\f',
      v: '\v',
      '0': '\0',
      '\\': '\\',
      '$': '$',
    };
    escapes[BACKTICK] = BACKTICK;
    result += Object.hasOwn(escapes, next) ? escapes[next] : next;
    index += 2;
  }
  return result;
}

function decodeLiteral(raw) {
  if (raw[0] === '"') return JSON.parse(raw);
  if (raw[0] === BACKTICK) return decodeTemplateLiteral(raw);
  fail('unsupported source string delimiter');
}

function readJsonString(source, start) {
  const literal = readQuoted(source, start);
  try {
    literal.decoded = decodeLiteral(literal.raw);
  } catch (error) {
    fail('invalid source string at offset ' + start + ': ' + error.message);
  }
  return literal;
}

function skipQuoted(source, index) {
  return readQuoted(source, index).end + 1;
}

function findMatching(source, start, open, close) {
  if (source[start] !== open) fail('expected ' + open + ' at offset ' + start);
  let depth = 0;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"' || character === "'" || character === BACKTICK) {
      index = skipQuoted(source, index) - 1;
      continue;
    }
    if (character === open) depth += 1;
    else if (character === close) {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  fail('unclosed ' + open + ' at offset ' + start);
}

function skipWhitespace(source, index) {
  let cursor = index;
  while (cursor < source.length && /\s/.test(source[cursor])) cursor += 1;
  return cursor;
}

function findQuestionObjects(source) {
  const marker = source.indexOf('window.questionBank');
  if (marker < 0) fail('window.questionBank is missing');
  const arrayStart = source.indexOf('[', marker);
  if (arrayStart < 0) fail('questionBank array is missing');
  const arrayEnd = findMatching(source, arrayStart, '[', ']');
  const objects = [];
  let index = arrayStart + 1;
  while (index < arrayEnd) {
    if (source[index] === '"' || source[index] === "'" || source[index] === BACKTICK) {
      index = skipQuoted(source, index);
      continue;
    }
    if (source[index] === '{') {
      const end = findMatching(source, index, '{', '}');
      objects.push({ start: index, end });
      index = end + 1;
      continue;
    }
    index += 1;
  }
  return { arrayStart, arrayEnd, objects };
}

function findTopLevelProperty(source, object, key) {
  let braceDepth = 0;
  let bracketDepth = 0;
  let index = object.start + 1;
  while (index < object.end) {
    const character = source[index];
    if (character === '"' || character === "'" || character === BACKTICK) {
      const literal = readQuoted(source, index);
      if (character === '"' && braceDepth === 0 && bracketDepth === 0) {
        const cursor = skipWhitespace(source, literal.end + 1);
        if (literal.raw === JSON.stringify(key) && source[cursor] === ':') {
          return {
            key: literal,
            valueStart: skipWhitespace(source, cursor + 1),
          };
        }
      }
      index = literal.end + 1;
      continue;
    }
    if (braceDepth === 0 && bracketDepth === 0 && /[A-Za-z_$]/.test(character)) {
      let end = index + 1;
      while (end < source.length && /[A-Za-z0-9_$]/.test(source[end])) end += 1;
      const bareKey = source.slice(index, end);
      const cursor = skipWhitespace(source, end);
      if (bareKey === key && source[cursor] === ':') {
        return {
          key: null,
          valueStart: skipWhitespace(source, cursor + 1),
        };
      }
      index = end;
      continue;
    }
    if (character === '{') braceDepth += 1;
    else if (character === '}') braceDepth -= 1;
    else if (character === '[') bracketDepth += 1;
    else if (character === ']') bracketDepth -= 1;
    index += 1;
  }
  fail('top-level property "' + key + '" is missing');
}

function parseStringArray(source, start) {
  if (source[start] !== '[') fail('expected choices array');
  const end = findMatching(source, start, '[', ']');
  const entries = [];
  let index = start + 1;
  while (true) {
    index = skipWhitespace(source, index);
    if (index >= end) fail('choices array parser overran closing bracket');
    if (source[index] === ']') break;
    if (source[index] !== '"' && source[index] !== BACKTICK) fail('choices entry is not a source string at offset ' + index);
    const literal = readJsonString(source, index);
    entries.push(literal);
    index = skipWhitespace(source, literal.end + 1);
    if (source[index] === ',') {
      index += 1;
      continue;
    }
    if (source[index] === ']') break;
    fail('choices entry delimiter is missing at offset ' + index);
  }
  return { start, end, entries };
}

function loadQuestionBank(source, file) {
  const context = { window: {}, console };
  vm.createContext(context);
  try {
    vm.runInContext(source, context, { filename: file, timeout: 10000 });
  } catch (error) {
    fail('cannot parse ' + file + ': ' + error.message);
  }
  const bank = context.window.questionBank;
  if (!Array.isArray(bank)) fail('questionBank is not an array in ' + file);
  return clone(bank);
}

function parseAnswerToken(value) {
  const text = String(value ?? '');
  const trimmed = text.trim();
  if (trimmed.length === 1 && CIRCLED.includes(trimmed)) {
    return {
      index: CIRCLED.indexOf(trimmed) + 1,
      kind: 'circled',
      token: trimmed,
      start: text.indexOf(trimmed),
    };
  }
  if (/^[1-5]$/.test(trimmed)) {
    return {
      index: Number(trimmed),
      kind: 'numeric',
      token: trimmed,
      start: text.indexOf(trimmed),
    };
  }
  return null;
}

function answerIndexFromToken(token) {
  const normalized = String(token).replace(/\s*번$/, '').trim();
  return parseAnswerToken(normalized)?.index ?? null;
}

function tokenReplacement(token, newIndex) {
  return CIRCLED.includes(token) ? CIRCLED[newIndex - 1] : String(newIndex);
}

function decodeRawStringWithMap(raw) {
  const decoded = decodeLiteral(raw);
  const starts = [];
  const ends = [];
  let cursor = 1;
  while (cursor < raw.length - 1) {
    const rawStart = cursor;
    let decodedPart;
    if (raw[cursor] === '\\') {
      const next = raw[cursor + 1];
      if (next === 'u' && raw[cursor + 2] === '{') {
        const end = raw.indexOf('}', cursor + 3);
        if (end < 0) fail('unterminated unicode escape in string');
        const codePoint = Number.parseInt(raw.slice(cursor + 3, end), 16);
        if (!Number.isFinite(codePoint)) fail('invalid unicode escape in string');
        decodedPart = String.fromCodePoint(codePoint);
        cursor = end + 1;
      } else if (next === 'u') {
        const code = Number.parseInt(raw.slice(cursor + 2, cursor + 6), 16);
        if (!Number.isFinite(code)) fail('invalid unicode escape in string');
        decodedPart = String.fromCharCode(code);
        cursor += 6;
      } else if (next === 'x') {
        const code = Number.parseInt(raw.slice(cursor + 2, cursor + 4), 16);
        if (!Number.isFinite(code)) fail('invalid hex escape in string');
        decodedPart = String.fromCharCode(code);
        cursor += 4;
      } else if (next === '\r' || next === '\n') {
        decodedPart = '';
        cursor += next === '\r' && raw[cursor + 2] === '\n' ? 3 : 2;
      } else {
        const escaped = raw.slice(cursor, cursor + 2);
        const map = {
          '\\n': '\n',
          '\\r': '\r',
          '\\t': '\t',
          '\\b': '\b',
          '\\f': '\f',
          '\\v': '\v',
          '\\0': '\0',
          '\\\\': '\\',
          '\\"': '"',
          "\\'": "'",
          '\\/': '/',
        };
        map['\\' + BACKTICK] = BACKTICK;
        map['\\$'] = '$';
        if (!Object.hasOwn(map, escaped)) {
          if (raw[0] === BACKTICK) decodedPart = next;
          else fail('unsupported string escape ' + escaped);
        } else {
          decodedPart = map[escaped];
        }
        cursor += 2;
      }
    } else {
      if (raw[0] === BACKTICK && raw[cursor] === '$' && raw[cursor + 1] === '{') {
        fail('template interpolation is not supported by the repair parser');
      }
      const codePoint = raw.codePointAt(cursor);
      decodedPart = String.fromCodePoint(codePoint);
      cursor += decodedPart.length;
    }
    for (let offset = 0; offset < decodedPart.length; offset += 1) {
      starts.push(rawStart);
      ends.push(cursor);
    }
  }
  if (decoded.length !== starts.length) fail('raw/decoded string map length mismatch');
  return { decoded, starts, ends };
}

function replaceDecodedSpanInRaw(raw, decoded, start, end, replacement) {
  const map = decodeRawStringWithMap(raw);
  if (map.decoded !== decoded) fail('raw/decoded string mismatch while replacing');
  if (start < 0 || end <= start || end > map.starts.length) fail('invalid decoded span');
  const rawStart = map.starts[start];
  const rawEnd = map.ends[end - 1];
  return raw.slice(0, rawStart) + replacement + raw.slice(rawEnd);
}

function directTokenSpan(start, token, oldIndex) {
  const rawToken = token.replace(/\s*번$/, '');
  if (answerIndexFromToken(rawToken) !== oldIndex) return null;
  return {
    start,
    end: start + (CIRCLED.includes(rawToken) ? rawToken.length : 1),
    token: rawToken,
  };
}

function directSolutionTokenSpans(solution, oldIndex) {
  const spans = [];
  const forward = /(?:정답|답|따라서|그러므로|결과|answer|correct)[^\n]{0,120}(?:[①②③④⑤]|[1-5]\s*번)/gi;
  const qualifier = /(?:옳은|옳지 않은|맞는|틀린|알맞은|해당하는|선택지는|고르면|되는|것은)[^\n.]{0,80}?([①②③④⑤]|[1-5]\s*번)(?=\s*(?:이다|입니다|임))/gi;
  const anchored = /(?:^|\n|(?:∴|\\therefore)\s*)([①②③④⑤]|[1-5]\s*번)(?=\s*(?:이다|입니다|임|정답|answer))/gim;

  for (const match of solution.matchAll(forward)) {
    const tokenMatch = match[0].match(/(?:[①②③④⑤]|[1-5]\s*번)$/i);
    if (!tokenMatch) continue;
    const token = tokenMatch[0];
    const span = directTokenSpan(match.index + tokenMatch.index, token, oldIndex);
    if (span) spans.push(span);
  }
  for (const match of solution.matchAll(qualifier)) {
    const token = match[1];
    const span = directTokenSpan(match.index + match[0].indexOf(token), token, oldIndex);
    if (span) spans.push(span);
  }
  for (const match of solution.matchAll(anchored)) {
    const token = match[1];
    const span = directTokenSpan(match.index + match[0].indexOf(token), token, oldIndex);
    if (span) spans.push(span);
  }

  const unique = new Map();
  for (const span of spans) unique.set(span.start + ':' + span.end, span);
  return [...unique.values()].sort((left, right) => left.start - right.start);
}

function applyDecodedSpans(value, spans, newIndex) {
  let result = value;
  for (const span of [...spans].sort((left, right) => right.start - left.start)) {
    result = result.slice(0, span.start) + tokenReplacement(span.token, newIndex) + result.slice(span.end);
  }
  return result;
}

function applyRawSpans(raw, decoded, spans, newIndex) {
  const map = decodeRawStringWithMap(raw);
  if (map.decoded !== decoded) fail('raw/decoded string mismatch while applying solution spans');
  const edits = spans.map(span => ({
    start: map.starts[span.start],
    end: map.ends[span.end - 1],
    replacement: tokenReplacement(span.token, newIndex),
  })).sort((left, right) => right.start - left.start);
  let result = raw;
  let nextStart = Number.POSITIVE_INFINITY;
  for (const edit of edits) {
    if (edit.end > nextStart) fail('overlapping solution token spans');
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    nextStart = edit.start;
  }
  return result;
}

function addEdit(edits, start, end, replacement, kind) {
  if (end <= start) fail('empty source edit');
  edits.push({ start, end, replacement, kind });
}

function applyEdits(source, edits) {
  const ordered = [...edits].sort((left, right) => right.start - left.start);
  let result = source;
  let nextStart = Number.POSITIVE_INFINITY;
  for (const edit of ordered) {
    if (edit.end > nextStart) fail('overlapping source edits');
    result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
    nextStart = edit.start;
  }
  return result;
}

function multisetHash(choices) {
  return sha256(JSON.stringify(choices.map(value => JSON.stringify(value)).sort()));
}

function questionKey(id) {
  return String(id);
}

function planRecords(report) {
  const active = report.perFile.filter(record => record.policyApplied === true);
  if (active.length !== 42) fail('v4 report does not contain exactly 42 ACTIVE records');
  for (const record of active) {
    if (!record.file.includes('/similar/')) fail('ACTIVE plan outside similar scope: ' + record.file);
    const plan = record.repairPlan;
    if (!plan) fail('ACTIVE record has no repair plan: ' + record.file);
    if (!['PLANNED', 'NO_CHANGE'].includes(plan.status)) {
      fail('ACTIVE plan is not executable: ' + record.file + ' ' + plan.status);
    }
  }
  const planned = active.filter(record =>
    record.repairPlan.status === 'PLANNED' && record.repairPlan.changedQuestionCount > 0
  );
  const permutationCount = planned.reduce((sum, record) => sum + record.repairPlan.permutations.length, 0);
  if (planned.length !== report.dryRunV4.filesRequiringChange) fail('v4 planned file count drift');
  if (permutationCount !== report.dryRunV4.questionsRequiringPermutation) fail('v4 permutation count drift');
  if (permutationCount !== report.dryRunV4.independentMinimumPermutationCount) fail('v4 minimum parity drift');
  return planned;
}

function assertPreflight(report) {
  if (report.schemaVersion !== 'answer-index-distribution-audit-v4') fail('wrong report schema');
  const dry = report.dryRunV4;
  if (!dry) fail('dryRunV4 is missing');
  if (dry.activeBefore.filesBlocked !== 0) fail('v4 preflight has blocked files');
  if (dry.predictedAfterFilesWithFail !== 0) fail('v4 predicted FAIL is not zero');
  if (dry.predictedAfterFilesBlocked !== 0) fail('v4 predicted BLOCKED is not zero');
  if (dry.targetGateCheck !== true) fail('v4 target gate is not true');
  if (report.machineValidation.deterministicReplayPass !== true) fail('v4 deterministic replay failed');
  if (report.machineValidation.independentMinimumChangePass !== true) fail('v4 independent minimum failed');
  if (report.legacyChoicePrefixNormalization.status !== 'PASS') fail('legacy normalization evidence is not PASS');
  if (report.legacyChoicePrefixNormalization.permutationApplied !== false) fail('v4 source report already claims permutation');
}

function transformFile(record) {
  const file = path.join(ROOT, record.file);
  const source = fs.readFileSync(file, 'utf8');
  const before = loadQuestionBank(source, record.file);
  let sourceObjects;
  try {
    sourceObjects = findQuestionObjects(source).objects;
  } catch (error) {
    fail(error.message + ' in ' + record.file);
  }
  if (sourceObjects.length !== before.length) fail('source/object count mismatch: ' + record.file);
  const byId = new Map();
  before.forEach((question, index) => {
    const key = questionKey(question.id);
    if (byId.has(key)) fail('duplicate question id ' + key + ' in ' + record.file);
    byId.set(key, { question, index, object: sourceObjects[index] });
  });

  const edits = [];
  const changed = [];
  const seenIds = new Set();
  for (const permutation of record.repairPlan.permutations) {
    const id = questionKey(permutation.questionId);
    if (seenIds.has(id)) fail('duplicate permutation question id ' + id + ' in ' + record.file);
    seenIds.add(id);
    const found = byId.get(id);
    if (!found) fail('planned question missing: ' + record.file + '#' + id);
    const question = found.question;
    const from = permutation.fromAnswerIndex;
    const to = permutation.toAnswerIndex;
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || from > 5 || to < 1 || to > 5 || from === to) {
      fail('invalid permutation indexes: ' + record.file + '#' + id);
    }
    const currentAnswer = parseAnswerToken(question.answer);
    if (!currentAnswer || currentAnswer.index !== from) {
      fail('current answer does not match v4 plan: ' + record.file + '#' + id);
    }
    if (!Array.isArray(question.choices) || question.choices.length !== 5) {
      fail('planned question does not have five choices: ' + record.file + '#' + id);
    }
    const targetChoices = question.choices.slice();
    const correctValue = targetChoices.splice(from - 1, 1)[0];
    targetChoices.splice(to - 1, 0, correctValue);
    if (stable(targetChoices) !== stable(permutation.choiceMove.choices)) {
      fail('choice target differs from v4 plan: ' + record.file + '#' + id);
    }
    if (permutation.answerValuePreserved !== true) {
      fail('v4 plan does not preserve answer value: ' + record.file + '#' + id);
    }

    const object = found.object;
    let choicesProperty;
    try {
      choicesProperty = findTopLevelProperty(source, object, 'choices');
    } catch (error) {
      fail(error.message + ' in ' + record.file + '#' + id + ' object=' + source.slice(object.start, Math.min(object.start + 160, object.end + 1)));
    }
    const choicesArray = parseStringArray(source, choicesProperty.valueStart);
    if (choicesArray.entries.length !== 5) fail('source choices are not five: ' + record.file + '#' + id);
    const rawChoices = choicesArray.entries.map(entry => entry.raw);
    const movedRawChoices = rawChoices.slice();
    const movedRaw = movedRawChoices.splice(from - 1, 1)[0];
    movedRawChoices.splice(to - 1, 0, movedRaw);
    for (let index = 0; index < 5; index += 1) {
      if (rawChoices[index] !== movedRawChoices[index]) {
        addEdit(
          edits,
          choicesArray.entries[index].start,
          choicesArray.entries[index].end + 1,
          movedRawChoices[index],
          'choices',
        );
      }
    }

    const answerProperty = findTopLevelProperty(source, object, 'answer');
    let answerLiteral;
    try {
      answerLiteral = readJsonString(source, answerProperty.valueStart);
    } catch (error) {
      fail(error.message + ' in ' + record.file + '#' + id + ' answer=' + source.slice(answerProperty.valueStart, Math.min(answerProperty.valueStart + 120, object.end + 1)));
    }
    const answerText = answerLiteral.decoded;
    const answerRaw = replaceDecodedSpanInRaw(
      answerLiteral.raw,
      answerText,
      currentAnswer.start,
      currentAnswer.start + currentAnswer.token.length,
      tokenReplacement(currentAnswer.token, to),
    );
    addEdit(edits, answerProperty.valueStart, answerLiteral.end + 1, answerRaw, 'answer');

    const solutionProperty = findTopLevelProperty(source, object, 'solution');
    let solutionLiteral;
    try {
      solutionLiteral = readJsonString(source, solutionProperty.valueStart);
    } catch (error) {
      fail(error.message + ' in ' + record.file + '#' + id + ' solution=' + source.slice(solutionProperty.valueStart, Math.min(solutionProperty.valueStart + 120, object.end + 1)));
    }
    const storedSolution = solutionLiteral.decoded;
    const solution = String(question.solution ?? '');
    const derivedSolution = storedSolution === '' && solution !== '';
    const solutionSpans = directSolutionTokenSpans(solution, from);
    const solutionSync = (record.repairPlan.solutionSync || []).find(item => questionKey(item.questionId) === id);
    if (solutionSpans.length > 0 && !solutionSync) {
      fail('direct solution answer mention is absent from v4 sync plan: ' + record.file + '#' + id);
    }
    const expectedSolution = applyDecodedSpans(solution, solutionSpans, to);
    const expectedRawSolution = derivedSolution
      ? solutionLiteral.raw
      : applyRawSpans(solutionLiteral.raw, solution, solutionSpans, to);
    if (expectedRawSolution !== solutionLiteral.raw) {
      addEdit(
        edits,
        solutionProperty.valueStart,
        solutionLiteral.end + 1,
        expectedRawSolution,
        'solution',
      );
    }

    changed.push({
      id,
      from,
      to,
      beforeQuestion: clone(question),
      targetChoices,
      beforeChoiceHash: multisetHash(question.choices),
      correctValue,
      expectedSolution,
      directSolutionTokenCount: solutionSpans.length,
      solutionSyncPlanned: Boolean(solutionSync),
      solutionDerived: derivedSolution,
    });
  }
  if (seenIds.size !== record.repairPlan.changedQuestionCount) {
    fail('changed question count differs from v4 plan: ' + record.file);
  }

  const afterSource = applyEdits(source, edits);
  const after = loadQuestionBank(afterSource, record.file);
  if (after.length !== before.length) fail('question count changed: ' + record.file);
  const changedById = new Map(changed.map(item => [item.id, item]));
  const afterById = new Map(after.map(question => [questionKey(question.id), question]));
  for (const question of before) {
    const id = questionKey(question.id);
    const afterQuestion = afterById.get(id);
    if (!afterQuestion) fail('question id disappeared: ' + record.file + '#' + id);
    const item = changedById.get(id);
    if (!item) {
      if (stable(question) !== stable(afterQuestion)) {
        fail('unplanned question changed: ' + record.file + '#' + id);
      }
      continue;
    }
    if (stable(afterQuestion.choices) !== stable(item.targetChoices)) {
      fail('choice permutation result differs: ' + record.file + '#' + id);
    }
    if (multisetHash(question.choices) !== multisetHash(afterQuestion.choices)) {
      fail('choice multiset changed: ' + record.file + '#' + id);
    }
    if (afterQuestion.choices[item.to - 1] !== item.correctValue) {
      fail('correct choice value did not move to target index: ' + record.file + '#' + id);
    }
    const afterAnswer = parseAnswerToken(afterQuestion.answer);
    if (!afterAnswer || afterAnswer.index !== item.to) {
      fail('answer does not point to target index: ' + record.file + '#' + id);
    }
    for (const key of new Set([...Object.keys(question), ...Object.keys(afterQuestion)])) {
      if (['choices', 'answer', 'solution'].includes(key)) continue;
      if (stable(question[key]) !== stable(afterQuestion[key])) {
        fail('protected field changed: ' + record.file + '#' + id + ' ' + key);
      }
    }
    if (afterQuestion.solution !== item.expectedSolution) {
      fail('solution changed beyond direct answer index sync: ' + record.file + '#' + id);
    }
    if (directSolutionTokenSpans(afterQuestion.solution, item.from).length !== 0) {
      fail('old direct solution answer index remains: ' + record.file + '#' + id);
    }
    if (item.directSolutionTokenCount > 0 && directSolutionTokenSpans(afterQuestion.solution, item.to).length === 0) {
      fail('new direct solution answer index is missing: ' + record.file + '#' + id);
    }
  }

  const editKinds = {};
  for (const edit of edits) editKinds[edit.kind] = (editKinds[edit.kind] || 0) + 1;
  return {
    file,
    relativeFile: record.file,
    source,
    afterSource,
    before,
    after,
    changed,
    editKinds,
    sourceSha256Before: sha256(source),
    sourceSha256After: sha256(afterSource),
  };
}

function buildReceipt(report, fileResults) {
  const changedQuestions = fileResults.flatMap(result => result.changed);
  const solutionFieldsChanged = fileResults.reduce(
    (sum, result) => sum + (result.editKinds.solution || 0),
    0,
  );
  const directSolutionLiteralsChanged = changedQuestions.reduce(
    (sum, item) => sum + item.directSolutionTokenCount,
    0,
  );
  const solutionIndexSyncQuestions = changedQuestions.filter(
    item => item.directSolutionTokenCount > 0,
  ).length;
  const dynamicSolutionAutoSyncQuestions = changedQuestions.filter(
    item => item.solutionDerived && item.directSolutionTokenCount > 0,
  ).length;
  return {
    schemaVersion: 'ANSWER_INDEX_DISTRIBUTION_REPAIR_V4',
    status: 'PASS',
    applied: true,
    sourceReport: 'reports/answer-index-distribution-dryrun-v4.json',
    preflight: {
      predictedFail: report.dryRunV4.predictedAfterFilesWithFail,
      predictedBlocked: report.dryRunV4.predictedAfterFilesBlocked,
      plannedPermutationCount: report.dryRunV4.questionsRequiringPermutation,
      independentMinimum: report.dryRunV4.independentMinimumPermutationCount,
      deterministicReplay: report.machineValidation.deterministicReplayPass,
      independentMinimumParity: report.machineValidation.independentMinimumChangePass,
    },
    totals: {
      modifiedFiles: fileResults.length,
      modifiedQuestions: changedQuestions.length,
      choicePermutations: changedQuestions.length,
      answerUpdates: changedQuestions.length,
      solutionFieldsChanged,
      directSolutionLiteralsChanged,
      solutionIndexSyncQuestions,
      dynamicSolutionAutoSyncQuestions,
      otherFieldChanges: 0,
    },
    files: fileResults.map(result => ({
      file: result.relativeFile,
      modifiedQuestions: result.changed.map(item => Number(item.id)),
      choicePermutations: result.changed.length,
      answerUpdates: result.changed.length,
      solutionFieldsChanged: result.editKinds.solution || 0,
      sourceSha256Before: result.sourceSha256Before,
      sourceSha256After: result.sourceSha256After,
    })),
    diffGuard: {
      onlyChoicesAnswerSolutionEdits: true,
      protectedFieldsUnchanged: true,
      originalFilesModified: false,
      dbModified: false,
      questionIndexModified: false,
      assetsModified: false,
    },
  };
}

function main() {
  if (!APPLY_REQUESTED) fail('refusing to write without --apply');
  const report = JSON.parse(fs.readFileSync(REPORT_PATH, 'utf8'));
  assertPreflight(report);
  const planned = planRecords(report);
  const fileResults = planned.map(transformFile);
  const plannedQuestions = report.dryRunV4.questionsRequiringPermutation;
  const actualQuestions = fileResults.reduce((sum, result) => sum + result.changed.length, 0);
  if (actualQuestions !== plannedQuestions) fail('in-memory changed question count does not match v4');

  for (const result of fileResults) {
    if (fs.readFileSync(result.file, 'utf8') !== result.source) {
      fail('source changed while preparing repair: ' + result.relativeFile);
    }
  }

  const written = [];
  try {
    for (const result of fileResults) {
      fs.writeFileSync(result.file, result.afterSource, 'utf8');
      written.push(result);
    }
  } catch (error) {
    for (const result of [...written].reverse()) {
      try {
        fs.writeFileSync(result.file, result.source, 'utf8');
      } catch {
        // Keep the original write error; final verification exposes rollback
        // failure if the host filesystem is unavailable.
      }
    }
    throw error;
  }

  for (const result of fileResults) {
    if (fs.readFileSync(result.file, 'utf8') !== result.afterSource) {
      fail('post-write bytes differ from validated bytes: ' + result.relativeFile);
    }
  }

  const receipt = buildReceipt(report, fileResults);
  receipt.appliedAt = new Date().toISOString();
  fs.writeFileSync(RECEIPT_PATH, JSON.stringify(receipt, null, 2) + '\n', 'utf8');
  process.stdout.write(JSON.stringify({
    status: receipt.status,
    applied: receipt.applied,
    totals: receipt.totals,
    receipt: path.relative(ROOT, RECEIPT_PATH).replaceAll(path.sep, '/'),
  }, null, 2) + '\n');
}

main();
