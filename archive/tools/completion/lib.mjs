// Pure status projection. No file access, mutation, approval, or mathematical judgment.
import { DIFFICULTY_CONFIDENCE, DIFFICULTY_BOUNDARY_FLAGS, LEGACY_LEVEL_COMPATIBILITY } from '../meta-foundation/rpm-active-resolver.mjs';
import { validateActiveMetaFields } from '../meta-foundation/active-registry.mjs';
export const BOILERPLATE_PREFIXES = Object.freeze(['[JS 기준 풀이]', '행렬 등식은 같은 위치의 성분을']);
export const COLUMNS = Object.freeze(['stem','answer','solution','figure','unit','difficulty','type','fourSlot','overall']);
const text = v => String(v ?? '').trim();
const present = v => Array.isArray(v) ? v.length > 0 : Boolean(text(v));
// build-archive2-catalog.mjs:232 (not exported; importing the builder writes files).
export const approved = v => /^approved(?:_|$)/i.test(String(v || ''));
export function classifyItem({ question = {}, meta = {}, unitLabels = new Map(), subUnitLabels = new Map(), registry, figure = 'NOT_NEEDED', fourSlot = 'MISSING', identityValid = true }) {
  const reasons = [], status = meta.fieldStatus || {};
  const stem = present(question.content || question.question) ? 'OK' : 'MISSING';
  const answer = present(question.answer) ? 'OK' : 'MISSING';
  const solutionText = text(question.solution).replace(/<[^>]*>/g,'').trim();
  const solution = !present(question.solution) && !present(question.solutionImage || question.solutionImageRef) ? 'MISSING'
    : BOILERPLATE_PREFIXES.some(p => solutionText.startsWith(p)) ? 'BOILERPLATE' : 'OK';
  let unit = 'MISSING';
  if (present(meta.standardUnitKey) && present(meta.subUnitKey)) {
    const u = unitLabels.get(meta.standardUnitKey), s = subUnitLabels.get(meta.subUnitKey);
    unit = !u || !s || (meta.standardUnit && meta.standardUnit !== u.label) || (meta.subUnit && meta.subUnit !== s.label)
      || (s.parent && s.parent !== meta.standardUnitKey) ? 'LABEL_MISMATCH'
      : approved(status.standardUnit) && approved(status.subUnit) ? 'APPROVED' : 'RECORDED';
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
    const errors = registry?.status !== 'ACTIVE' ? ['ACTIVE_META_REGISTRY_UNAVAILABLE_WITH_KEYS'] : validateActiveMetaFields(meta, registry).errors.filter(e => /PROBLEM_TYPE|TEMPLATE|ACTIVE_META_REGISTRY|CURRICULUM_BINDING/.test(e));
    if (errors.length) { type = 'INVALID'; reasons.push(...errors); }
    else if (present(meta.problemTypeKey) && present(meta.templateKey)) type = approved(status.problemType) && approved(status.template) ? 'APPROVED' : 'RECORDED';
  }
  const fields = { stem, answer, solution, figure, unit, difficulty, type, fourSlot };
  const contentOK = stem === 'OK' && answer === 'OK' && solution === 'OK' && ['OK','NOT_NEEDED'].includes(figure);
  const complete = unit === 'APPROVED' && difficulty === 'APPROVED' && type === 'APPROVED' && fourSlot === 'REGISTERED';
  const valuesPresent = ['APPROVED','RECORDED'].includes(unit) && ['APPROVED','NUMBER_ONLY'].includes(difficulty)
    && aux.every(([k, values]) => values.includes(meta[k])) && ['APPROVED','RECORDED'].includes(type) && ['REGISTERED','WRITTEN'].includes(fourSlot);
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
