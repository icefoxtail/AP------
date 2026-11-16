#!/usr/bin/env node
// Read-only structural/evidence checks, not mathematical review or registration approval.
import fs from 'node:fs';
import { normalizeNotation } from '../meta-foundation/source-delta.mjs';
import { ROOT, loadContext, readExam, scopeForRecord, activeKey, matchingBindings,
  parseArgs, writeOutput, isMain } from './common.mjs';

const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const nameIdentity = value => String(value ?? '').normalize('NFC').replace(/\s+/gu, '').toLowerCase();
const issue = (code, details = {}) => ({ code, ...details });
const permitted = {
  PICK: new Set(['questionUid', 'sourceOrdinal', 'decision', 'problemTypeKey', 'templateKey', 'decisiveStep', 'cue']),
  NEW_KEY: new Set(['questionUid', 'sourceOrdinal', 'decision', 'proposedName', 'parentProblemTypeKey', 'definition', 'internalSkeleton', 'decisiveStep', 'cue']),
  HOLD: new Set(['questionUid', 'sourceOrdinal', 'decision', 'reason']),
};

function knownNames(context) {
  const names = new Set();
  const add = value => { if (nonempty(value)) names.add(nameIdentity(value)); };
  // Include keys/labels/aliases even when retired: a proposal must not reuse an existing name.
  for (const [key, row] of [...context.registry.problemTypes, ...context.registry.templates]) {
    add(key); add(row.canonicalLabelKo);
    for (const alias of row.aliases || []) add(typeof alias === 'string' ? alias : alias.alias);
  }
  for (const row of context.aliases || []) { add(row.alias); add(row.canonicalKey); }
  return names;
}

function sourceFragments(question) {
  return [question?.content, ...(Array.isArray(question?.choices) ? question.choices : []), question?.solution]
    .filter(value => typeof value === 'string');
}

function checkEvidence(entry, question, errors) {
  // Sentence meaning is a review responsibility; reject empty/multiline evidence mechanically.
  if (!nonempty(entry.decisiveStep) || /[\r\n]/u.test(entry.decisiveStep)) errors.push(issue('DECISIVE_STEP_SINGLE_LINE_REQUIRED'));
  if (typeof entry.cue !== 'string' || [...entry.cue].length < 4 || [...entry.cue].length > 60) {
    errors.push(issue('CUE_LENGTH_4_TO_60_REQUIRED'));
    return;
  }
  const cue = normalizeNotation(entry.cue);
  if (!cue || !sourceFragments(question).some(fragment => normalizeNotation(fragment).includes(cue))) errors.push(issue('CUE_NOT_IN_SOURCE'));
}

export function validateLedger(context, ledger, suppliedExam) {
  const errors = [];
  const rows = [];
  const registryVerified = context.registry.status === 'ACTIVE' && !context.registry.errors?.length;
  const result = () => ({ schemaVersion: 'type-judgment-check-v1',
    notice: registryVerified ? null : '레지스트리 무결성 미확인', registryVerified,
    registryErrors: context.registry.errors || [], exam: exam?.exam || ledger?.exam || null,
    valid: errors.length === 0 && rows.every(row => row.errors.length === 0),
    approval: 'NOT_EVALUATED', errors, rows,
    counts: rows.reduce((counts, row) => { counts[row.status] = (counts[row.status] || 0) + 1; return counts; }, {}) });
  let exam;
  if (!object(ledger) || ledger.schemaVersion !== 'type-judgment-ledger-v1' || !nonempty(ledger.exam) || !Array.isArray(ledger.entries)) {
    errors.push(issue('LEDGER_SCHEMA_INVALID'));
    return result();
  }
  for (const key of Object.keys(ledger)) if (!['schemaVersion', 'exam', 'entries'].includes(key)) errors.push(issue('LEDGER_UNKNOWN_FIELD', { field: key }));
  try { exam = suppliedExam || readExam(context, ledger.exam); }
  catch (error) { errors.push(issue('EXAM_READ_FAILED', { message: error.message })); return result(); }
  // The injectable exam is intended for fixtures, but must still represent this exact path.
  const normalizeExamPath = value => value.replaceAll('\\', '/').replace(/^archive\/exams\//u, '');
  if (suppliedExam && normalizeExamPath(ledger.exam) !== exam.sourceArchiveFile) errors.push(issue('LEDGER_EXAM_MISMATCH'));
  const expected = new Map(exam.rows.map(row => [row.sourceOrdinal, row]));
  const seenUids = new Set(), seenOrdinals = new Set(), proposed = new Set();
  const names = knownNames(context);
  for (const entry of ledger.entries) {
    const rowErrors = [];
    if (!object(entry)) { rows.push({ status: 'INVALID', errors: [issue('ENTRY_OBJECT_REQUIRED')] }); continue; }
    const row = { questionUid: entry.questionUid ?? null, sourceOrdinal: entry.sourceOrdinal ?? null, decision: entry.decision ?? null, status: 'INVALID', errors: rowErrors };
    rows.push(row);
    const allowed = typeof entry.decision === 'string' && Object.hasOwn(permitted, entry.decision) ? permitted[entry.decision] : null;
    if (!allowed) rowErrors.push(issue('DECISION_INVALID'));
    else for (const key of Object.keys(entry)) if (!allowed.has(key)) rowErrors.push(issue('ENTRY_UNKNOWN_FIELD', { field: key }));
    if (!nonempty(entry.questionUid)) rowErrors.push(issue('QUESTION_UID_REQUIRED'));
    if (!Number.isInteger(entry.sourceOrdinal) || entry.sourceOrdinal < 1) rowErrors.push(issue('SOURCE_ORDINAL_INVALID'));
    if (seenUids.has(entry.questionUid)) rowErrors.push(issue('DUPLICATE_QUESTION_UID'));
    if (seenOrdinals.has(entry.sourceOrdinal)) rowErrors.push(issue('DUPLICATE_SOURCE_ORDINAL'));
    seenUids.add(entry.questionUid); seenOrdinals.add(entry.sourceOrdinal);
    const source = expected.get(entry.sourceOrdinal);
    if (!source || source.questionUid !== entry.questionUid) rowErrors.push(issue('QUESTION_IDENTITY_MISMATCH'));
    if (!source?.metadata) rowErrors.push(issue('CANONICAL_METADATA_MISSING'));
    let scope;
    if (source?.metadata) {
      scope = scopeForRecord(source.metadata);
      const unit = context.master.get(scope.unit), sub = scope.sub ? context.master.get(scope.sub) : null;
      // Same unit/ACTIVE checks as reviewed-exam-registration-v2 resolve/resolveUnitOnly.
      if (!unit || unit.keyType !== 'standardUnitKey' || !['active', 'ACTIVE'].includes(unit.status)) rowErrors.push(issue('CANONICAL_UNIT_INVALID'));
      if (scope.sub && (!sub || sub.keyType !== 'subUnitKey' || !['active', 'ACTIVE'].includes(sub.status)
          || (sub.standardUnitKey || sub.parentKey) !== scope.unit)) rowErrors.push(issue('CANONICAL_SUBUNIT_INVALID'));
      if (!scope.curriculum || !scope.course) rowErrors.push(issue('CANONICAL_SCOPE_INCOMPLETE'));
      if (scope.curriculumKey && scope.curriculumKey !== scope.curriculum) rowErrors.push(issue('CANONICAL_CURRICULUM_ALIAS_INVALID'));
    }
    if (entry.decision === 'HOLD') {
      if (!nonempty(entry.reason)) rowErrors.push(issue('HOLD_REASON_REQUIRED'));
      row.status = 'HOLD';
      if (scope?.courseKey && scope.courseKey !== scope.course) row.warnings = [issue('CANONICAL_COURSE_ALIAS_UNVERIFIED')];
    } else if (entry.decision === 'PICK' || entry.decision === 'NEW_KEY') {
      checkEvidence(entry, exam.questions[entry.sourceOrdinal - 1], rowErrors);
      const ptKey = entry.decision === 'PICK' ? entry.problemTypeKey : entry.parentProblemTypeKey;
      if (!nonempty(ptKey) || !activeKey(context, 'PT', ptKey)) rowErrors.push(issue('PT_NOT_ACTIVE'));
      const bindings = scope ? matchingBindings(context, scope, ptKey, { exactSub: true }) : [];
      if (scope?.courseKey && !bindings.length) {
        const withoutCourseAlias = { ...scope };
        delete withoutCourseAlias.courseKey;
        if (matchingBindings(context, withoutCourseAlias, ptKey, { exactSub: true }).length) rowErrors.push(issue('CANONICAL_COURSE_ALIAS_INVALID'));
        else row.warnings = [issue('CANONICAL_COURSE_ALIAS_UNVERIFIED')];
      }
      if (entry.decision === 'PICK') {
        if (!nonempty(entry.templateKey) || !activeKey(context, 'TPL', entry.templateKey)) rowErrors.push(issue('TPL_NOT_ACTIVE'));
        const tpl = context.registry.templates.get(entry.templateKey);
        if (tpl && tpl.parentProblemTypeKey !== ptKey) rowErrors.push(issue('TPL_PARENT_MISMATCH'));
        row.status = bindings.length ? 'VALID_PICK' : 'NEEDS_BINDING';
      } else {
        for (const key of ['proposedName', 'definition', 'internalSkeleton']) if (!nonempty(entry[key])) rowErrors.push(issue('NEW_KEY_FIELD_REQUIRED', { field: key }));
        if (nonempty(entry.proposedName)) {
          const name = nameIdentity(entry.proposedName);
          if (names.has(name)) rowErrors.push(issue('NEW_KEY_NAME_COLLISION'));
          if (proposed.has(name)) rowErrors.push(issue('DUPLICATE_PROPOSED_NAME'));
          proposed.add(name);
        }
        row.status = 'NEW_KEY_REVIEW_REQUIRED';
      }
    }
    if (rowErrors.length) row.status = 'INVALID';
  }
  for (const source of exam.rows) if (!seenOrdinals.has(source.sourceOrdinal) || !seenUids.has(source.questionUid)) errors.push(issue('MISSING_QUESTION', { questionUid: source.questionUid, sourceOrdinal: source.sourceOrdinal }));
  return result();
}

export function compareLedgers(context, left, right, suppliedExam) {
  const leftCheck = validateLedger(context, left, suppliedExam);
  const rightCheck = validateLedger(context, right, suppliedExam);
  const counts = { AGREE: 0, PT_ONLY: 0, DIFF: 0, ONE_HOLD: 0, BOTH_NEW_KEY: 0 };
  if (!leftCheck.valid || !rightCheck.valid || leftCheck.exam !== rightCheck.exam) return {
    valid: false, errors: [issue('COMPARISON_REQUIRES_VALID_SAME_EXAM_LEDGERS')], leftCheck, rightCheck, counts, rows: [],
  };
  const rightRows = new Map(right.entries.map(row => [row.questionUid, row]));
  const rows = left.entries.map(a => {
    const b = rightRows.get(a.questionUid);
    let classification = 'DIFF';
    if ((a.decision === 'HOLD') !== (b.decision === 'HOLD')) classification = 'ONE_HOLD';
    else if (a.decision === 'NEW_KEY' && b.decision === 'NEW_KEY') classification = 'BOTH_NEW_KEY';
    else if (a.decision === 'PICK' && b.decision === 'PICK' && a.problemTypeKey === b.problemTypeKey) classification = a.templateKey === b.templateKey ? 'AGREE' : 'PT_ONLY';
    // BOTH_HOLD is intentionally DIFF: two abstentions are not a type agreement.
    counts[classification]++;
    return { questionUid: a.questionUid, sourceOrdinal: a.sourceOrdinal, classification, leftDecision: a.decision, rightDecision: b.decision };
  });
  return { valid: true, approval: 'NOT_EVALUATED', leftCheck, rightCheck, counts, rows };
}

export function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv, ['--ledger', '--compare', '--out'], ['--strict']);
  if (!args.ledger) throw new Error('usage: check-ledger.mjs --ledger <json> [--compare <json>] [--out <outside-repository>] [--strict]');
  const context = loadContext(ROOT);
  const ledger = JSON.parse(fs.readFileSync(args.ledger, 'utf8'));
  const result = args.compare ? compareLedgers(context, ledger, JSON.parse(fs.readFileSync(args.compare, 'utf8'))) : validateLedger(context, ledger);
  writeOutput(`${JSON.stringify(result, null, 2)}\n`, args.out, context.root);
  const registryVerified = context.registry.status === 'ACTIVE' && !context.registry.errors?.length;
  return !result.valid || (args.strict && !registryVerified) ? 1 : 0;
}

if (isMain(import.meta.url)) {
  try { process.exitCode = runCli(); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
