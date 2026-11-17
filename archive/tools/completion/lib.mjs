// Pure status projection. No file access, mutation, approval, or mathematical judgment.
import { DIFFICULTY_CONFIDENCE, DIFFICULTY_BOUNDARY_FLAGS, LEGACY_LEVEL_COMPATIBILITY } from '../meta-foundation/rpm-active-resolver.mjs';
import { validateActiveMetaFields } from '../meta-foundation/active-registry.mjs';
export const BOILERPLATE_PREFIXES = Object.freeze(['[JS 기준 풀이]', '행렬 등식은 같은 위치의 성분을']);
export const COLUMNS = Object.freeze(['stem','answer','solution','figure','unit','difficulty','type','fourSlot','overall']);
// Whole-value placeholders (compared case-insensitively after tag stripping). Checked against the
// exam JS answers in archive/exams/original and textbooks: no real answer equals one of these.
export const PLACEHOLDER_VALUES = Object.freeze(['.', '-', '?', 'todo', 'null', 'undefined']);
// Visual/formula content counts as "has content" even when no text remains after tag stripping.
const VISUAL_TAG = /<\s*(?:img|svg|math|mjx-[a-z-]+|picture|object|embed|canvas|video)\b/i;
const INVISIBLE = new RegExp('[\\s\\u00a0\\u200b-\\u200d\\u2060\\ufeff]+', 'g');
const text = v => String(v ?? '').trim();
const stripMarkup = s => s.replace(/<[^>]*>/g, ' ').replace(/&(?:nbsp|#160|#xa0|ensp|emsp|thinsp);/gi, ' ').replace(INVISIBLE, ' ').trim();
// Non-empty after removing tags, &nbsp; and whitespace. Arrays/objects need at least one element with content.
export function present(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === 'number') return Number.isFinite(v);
  if (typeof v === 'boolean') return true;
  if (typeof v === 'string') return VISUAL_TAG.test(v) || stripMarkup(v) !== '';
  if (Array.isArray(v)) return v.some(present);
  if (typeof v === 'object') return Object.values(v).some(present);
  return false;
}
// True when every textual leaf is a placeholder such as ".", "-", "TODO", "null".
export function placeholderOnly(v) {
  const leaves = [];
  (function walk(x) {
    if (Array.isArray(x)) x.forEach(walk);
    else if (x && typeof x === 'object') Object.values(x).forEach(walk);
    else if (typeof x === 'string' && !VISUAL_TAG.test(x)) { const t = stripMarkup(x).toLowerCase(); if (t) leaves.push(t); }
    else if (present(x)) leaves.push('<value>');
  })(v);
  return leaves.length > 0 && leaves.every(t => PLACEHOLDER_VALUES.includes(t));
}
// Saved pending reasons that mean "registering will not help yet".
const FOUR_SLOT_BLOCKERS = /^(?:NOT_SUBMITTED|EXPLICIT_REVIEW_HOLD:|SOURCE_UID_CONFLICT)/;
// build-archive2-catalog.mjs:232 (not exported; importing the builder writes files).
export const approved = v => /^approved(?:_|$)/i.test(String(v || ''));
export function classifyItem({ question = {}, meta = {}, unitLabels = new Map(), subUnitLabels = new Map(), registry, figure = 'NOT_NEEDED', fourSlot = 'MISSING', identityValid = true, fourSlotReasons = [] }) {
  const reasons = [], status = meta.fieldStatus || {};
  const stem = present(question.content) || present(question.question) ? 'OK' : 'MISSING';
  const answer = !present(question.answer) ? 'MISSING' : placeholderOnly(question.answer) ? 'BOILERPLATE' : 'OK';
  if (answer === 'BOILERPLATE') reasons.push('ANSWER_PLACEHOLDER');
  const solutionImage = question.solutionImage ?? question.solutionImageRef;
  const solutionText = stripMarkup(text(question.solution));
  const solutionPlaceholder = present(question.solution) && !present(solutionImage) && placeholderOnly(question.solution);
  const solution = !present(question.solution) && !present(solutionImage) ? 'MISSING'
    : BOILERPLATE_PREFIXES.some(p => solutionText.startsWith(p)) || solutionPlaceholder ? 'BOILERPLATE' : 'OK';
  if (solutionPlaceholder) reasons.push('SOLUTION_PLACEHOLDER');
  let unit = 'MISSING';
  if (present(meta.standardUnitKey) && present(meta.subUnitKey)) {
    const u = unitLabels.get(meta.standardUnitKey), s = subUnitLabels.get(meta.subUnitKey), why = [];
    if (!u) why.push('UNIT_KEY_NOT_IN_MASTER:' + meta.standardUnitKey);
    else if (meta.standardUnit && meta.standardUnit !== u.label) why.push('UNIT_NAME_DIFFERS:' + meta.standardUnit + '!=' + u.label);
    if (!s) why.push('SUBUNIT_KEY_NOT_IN_MASTER:' + meta.subUnitKey);
    else {
      if (meta.subUnit && meta.subUnit !== s.label) why.push('SUBUNIT_NAME_DIFFERS:' + meta.subUnit + '!=' + s.label);
      if (s.parent && s.parent !== meta.standardUnitKey) why.push('SUBUNIT_PARENT_DIFFERS:' + s.parent + '!=' + meta.standardUnitKey);
    }
    if (why.length) { unit = 'LABEL_MISMATCH'; reasons.push(...why); }
    else unit = approved(status.standardUnit) && approved(status.subUnit) ? 'APPROVED' : 'RECORDED';
  }
  let difficulty = 'MISSING';
  const bucket = meta.difficultyBucket;
  const aux = [['difficultyConfidence',DIFFICULTY_CONFIDENCE],['difficultyBoundaryFlag',DIFFICULTY_BOUNDARY_FLAGS],['legacyLevelCompatibility',LEGACY_LEVEL_COMPATIBILITY]];
  if (present(bucket) && bucket !== 'UNKNOWN') {
    if (!Number.isInteger(bucket) || bucket < 1 || bucket > 5 || aux.some(([k, values]) => present(meta[k]) && meta[k] !== 'UNKNOWN' && !values.includes(meta[k]))) difficulty = 'INVALID';
    else if (aux.every(([k, values]) => values.includes(meta[k])) && approved(status.difficulty)) difficulty = 'APPROVED';
    else { difficulty = 'NUMBER_ONLY'; if (aux.every(([k, values]) => values.includes(meta[k]))) reasons.push('DIFFICULTY_APPROVAL_PENDING'); }
  }
  // Existing S14 catalog hint logic (build-archive2-catalog.mjs:103-136) and REVIEW2 explicit hold.
  const held = meta.foundationTaxonomyStatus === 'HOLD' || meta.metaFoundationHoldReason === 'TYPE_PATH_UNBOUND_UNIT_SUB_ONLY'
    || /hold/i.test(status.problemType || '') || /hold/i.test(status.template || '');
  let type = held ? 'HOLD' : 'MISSING';
  if (!held && (present(meta.problemTypeKey) || present(meta.templateKey))) {
    if (registry?.status !== 'ACTIVE') {
      // Environment problem (registry unreadable), not a defect of this question's data.
      type = 'REGISTRY_UNAVAILABLE';
      reasons.push('ACTIVE_META_REGISTRY_UNAVAILABLE', ...(registry?.errors || []).map(e => 'REGISTRY:' + e));
    } else {
      const errors = validateActiveMetaFields(meta, registry).errors.filter(e => /PROBLEM_TYPE|TEMPLATE|ACTIVE_META_REGISTRY|CURRICULUM_BINDING/.test(e));
      if (errors.length) { type = 'INVALID'; reasons.push(...errors); }
      else if (present(meta.problemTypeKey) && present(meta.templateKey)) type = approved(status.problemType) && approved(status.template) ? 'APPROVED' : 'RECORDED';
    }
  }
  const blockers = (fourSlotReasons || []).filter(r => FOUR_SLOT_BLOCKERS.test(r));
  reasons.push(...blockers);
  const fields = { stem, answer, solution, figure, unit, difficulty, type, fourSlot };
  const contentOK = stem === 'OK' && answer === 'OK' && solution === 'OK' && ['OK','NOT_NEEDED'].includes(figure);
  const complete = unit === 'APPROVED' && difficulty === 'APPROVED' && type === 'APPROVED' && fourSlot === 'REGISTERED' && !blockers.length;
  const valuesPresent = ['APPROVED','RECORDED'].includes(unit) && ['APPROVED','NUMBER_ONLY'].includes(difficulty)
    && aux.every(([k, values]) => values.includes(meta[k])) && ['APPROVED','RECORDED'].includes(type) && ['REGISTERED','WRITTEN'].includes(fourSlot) && !blockers.length;
  const overall = !contentOK ? 'BLOCKED' : !identityValid ? 'IN_PROGRESS' : complete ? 'COMPLETE' : valuesPresent ? 'PENDING_REGISTER' : 'IN_PROGRESS';
  if (!identityValid) reasons.push('IDENTITY_JOIN_MISSING_OR_AMBIGUOUS');
  const diffFields = ['standardUnitKey','standardUnit','subUnitKey','subUnit','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','problemTypeKey','templateKey'];
  const inlineDiffers = diffFields.filter(k => Object.hasOwn(question,k) && JSON.stringify(question[k]) !== JSON.stringify(meta[k]));
  return { ...fields, overall, inlineDiffers, reasons };
}
export function summarize(rows) {
  const distribution = Object.fromEntries(COLUMNS.map(k => [k, {}]));
  for (const row of rows) for (const key of COLUMNS) distribution[key][row[key]] = (distribution[key][row[key]] || 0) + 1;
  return { questions: rows.length, distribution };
}
