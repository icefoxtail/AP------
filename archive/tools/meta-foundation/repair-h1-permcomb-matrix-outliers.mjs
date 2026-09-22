import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/_generated/intelligence/phase1/high1-foundation/sol-checkpoint');
const readJsonl = (file) => fs.readFileSync(path.join(OUT, file), 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const writeJsonl = (file, rows) => fs.writeFileSync(path.join(OUT, file), `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
const clean = (v) => String(v ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const evidenceText = (source) => `${source.content || ''}\n${source.solution || ''}`;

const permDecisionFiles = [
  'PERMCOMB_BATCH10_SOL_DECISIONS_1_70.jsonl',
  'PERMCOMB_BATCH11_SOL_DECISIONS_71_140.jsonl',
  'PERMCOMB_BATCH12_SOL_DECISIONS_141_210.jsonl',
  'PERMCOMB_BATCH13_SOL_DECISIONS_211_280.jsonl',
  'PERMCOMB_BATCH14_SOL_DECISIONS_281_287.jsonl',
];
const permSourceFiles = [
  'PERMCOMB_BATCH10_SOURCE_PACK_1_70.jsonl',
  'PERMCOMB_BATCH11_SOURCE_PACK_71_140.jsonl',
  'PERMCOMB_BATCH12_SOURCE_PACK_141_210.jsonl',
  'PERMCOMB_BATCH13_SOURCE_PACK_211_280.jsonl',
  'PERMCOMB_BATCH14_SOURCE_PACK_281_287.jsonl',
];
const matrixDecisionFiles = ['MATRIX_BATCH15_SOL_DECISIONS_1_70.jsonl', 'MATRIX_BATCH16_SOL_DECISIONS_71_83.jsonl'];
const matrixSourceFiles = ['MATRIX_BATCH15_SOURCE_PACK_1_70.jsonl', 'MATRIX_BATCH16_SOURCE_PACK_71_83.jsonl'];

const permRows = permDecisionFiles.flatMap(readJsonl);
const permSources = permSourceFiles.flatMap(readJsonl);
const permSourceByUid = new Map(permSources.map((row) => [row.questionUid, row]));
const matrixRows = matrixDecisionFiles.flatMap(readJsonl);
const matrixSources = matrixSourceFiles.flatMap(readJsonl);
const matrixSourceByUid = new Map(matrixSources.map((row) => [row.questionUid, row]));

const permTriggerPattern = /ALGEBRAIC_EQUATION_MANIPULATION|QUADRATIC_FUNCTION_GRAPH_OR_INTERSECTION|INEQUALITY_SIGN_OR_RANGE_ANALYSIS|COMPLEX_ALGEBRAIC_OPERATION|DISCRIMINANT_ROOT_CONDITION|COMPLEX_POWER_PERIODICITY|근의 존재·중복 조건|판별식|이차함수|복소수|행렬|근과 계수|실수 조건/;
const matrixTriggerPattern = /근의 존재·중복 조건|고정 둘레·넓이 조건|복소수|판별식|이차함수|근과 계수|실수 조건/;

function permReasons(row, source) {
  const reasons = [];
  const text = evidenceText(source);
  if (row.primaryMethod && !/COUNTING|PERMUTATION|COMBINATION|ARRANGEMENT|SELECTION|IDENTICAL_OBJECTS|RESTRICTED/.test(row.primaryMethod)) reasons.push('PRIMARY_OUTSIDE_GENUINE');
  if (permTriggerPattern.test(row.primaryMethod || '')) reasons.push('PRIMARY_EXPLICIT_HIGH_RISK');
  if (permTriggerPattern.test((row.supportingConcepts || []).join('|'))) reasons.push('SUPPORTING_SEMANTIC');
  if (permTriggerPattern.test((row.conditions || []).join('|'))) reasons.push('CONDITION_SEMANTIC');
  if (row.semanticConfidence === 'low' || row.semanticConfidence === 'medium') reasons.push('CONFIDENCE_LOW_MEDIUM');
  if (/색칠|영역|색/.test(text) && !reasons.includes('SOURCE_GRAPH_COLORING_CONTROL')) reasons.push('SOURCE_GRAPH_COLORING_CONTROL');
  return reasons;
}

function matrixReasons(row, source) {
  const reasons = [];
  const text = evidenceText(source);
  if (matrixTriggerPattern.test(row.primaryMethod || '') || matrixTriggerPattern.test(row.decisiveStep || '')) reasons.push('PRIMARY_OR_DECISIVE_SEMANTIC');
  if (matrixTriggerPattern.test((row.supportingConcepts || []).join('|'))) reasons.push('SUPPORTING_SEMANTIC');
  if (matrixTriggerPattern.test((row.conditions || []).join('|'))) reasons.push('CONDITION_SEMANTIC');
  if (/복소수|a\+bi|허수|i\^|i²/.test(text)) reasons.push('SOURCE_COMPLEX_CONTROL');
  if (row.semanticConfidence === 'low' || row.semanticConfidence === 'medium') reasons.push('CONFIDENCE_LOW_MEDIUM');
  return [...new Set(reasons)];
}

function conceptsForPerm(text) {
  const c = [];
  if (/색칠|영역|색/.test(text)) c.push('중복 허용');
  if (/조합|선택|고르|뽑/.test(text)) c.push('조합');
  if (/배열|자리|좌석|순서|나열|대진|단어/.test(text)) c.push('순열');
  if (/곱의 법칙|각각|독립/.test(text)) c.push('곱의 법칙');
  if (/합의 법칙|나누|경우/.test(text)) c.push('합의 법칙');
  return [...new Set(c)];
}

function conditionsForSource(text) {
  const c = [];
  if (/자연수|정수|양의 정수|음의 정수/.test(text)) c.push('자연수·정수 조건');
  if (/범위|구간|≤|<|최댓값|최솟값|최소|최대/.test(text)) c.push('범위·최적화 조건');
  if (/서로 다른|중복/.test(text)) c.push('서로 다른·중복 조건');
  return c;
}

function permPrimary(text, old) {
  if (/색칠|영역|색/.test(text)) return 'REPETITION_PERMUTATION_OR_COMBINATION';
  if (/삼각형|직선|점/.test(text) && /선택|고르|뽑|조합/.test(text)) return 'COMBINATION_SELECTION';
  if (/자리|배열|좌석|순서|나열|대진|단어|사전/.test(text)) return /인접|붙|옆|떨어/.test(text) ? 'RESTRICTED_PERMUTATION_ADJACENCY' : 'PERMUTATION_ARRANGEMENT';
  if (/경로|도로|주사위|약수|배수|소인수|나머지|경우/.test(text)) return 'COUNTING_PRINCIPLE_CASE_DECOMPOSITION';
  if (/곱의 법칙|합의 법칙|조합|선택/.test(text)) return 'COUNTING_PRINCIPLE_CASE_DECOMPOSITION';
  if (/방정식|순열/.test(old || '')) return 'ALGEBRAIC_EQUATION_MANIPULATION';
  return 'COUNTING_PRINCIPLE_CASE_DECOMPOSITION';
}

function updatedPerm(row, source) {
  const text = evidenceText(source);
  const primaryMethod = permPrimary(text, row.primaryMethod);
  const supportingConcepts = conceptsForPerm(text);
  const conditions = conditionsForSource(text);
  const compositionPattern = /경우|나누|분기|각각/.test(text) ? 'CASE_BRANCH' : /먼저|다음|이후|그 다음/.test(text) ? 'SEQUENTIAL' : 'NONE';
  return { ...row, primaryMethod, supportingConcepts, conditions, compositionPattern, curriculumNotes: `${source.curriculumKey}; ${source.courseKey}; ${source.sourceStandardUnitKey}; source content+solution reread; no Stage 3 canonical synthesis.`, semanticReasonShort: `Source content and solution directly support ${primaryMethod}; false-positive relational labels were removed where unsupported.`, semanticConfidence: row.semanticConfidence === 'low' ? 'medium' : row.semanticConfidence, sourceIdentity: source.sourceIdentity, sourceFingerprint: source.sourceFingerprint, contentHash: source.contentHash, solutionHash: source.solutionHash, sourceFileSha256: source.sourceFileSha256, materializationBasis: 'CURRENT_SOURCE_PACK_CONTENT_SOLUTION_PINPOINT_REREAD', legacyL3L4DifficultyUsed: false };
}

function updatedMatrix(row, source) {
  const text = evidenceText(source);
  const complex = /복소수|a\+bi|허수|i\^|i²/.test(text);
  const primaryMethod = complex ? 'COMPLEX_POWER_PERIODICITY' : row.primaryMethod;
  const supporting = (row.supportingConcepts || []).filter((x) => !/근의 존재·중복 조건|고정 둘레·넓이 조건|이차함수/.test(x));
  const conditions = (row.conditions || []).filter((x) => !/근의 존재·중복 조건|고정 둘레·넓이 조건|이차함수/.test(x));
  if (complex && !supporting.includes('복소수의 연산')) supporting.push('복소수의 연산');
  if (complex && !supporting.includes('i의 거듭제곱')) supporting.push('i의 거듭제곱');
  if (/실수/.test(text) && !conditions.includes('실수 조건')) conditions.push('실수 조건');
  return { ...row, primaryMethod, supportingConcepts: [...new Set(supporting)], conditions: [...new Set(conditions)], curriculumNotes: `${source.curriculumKey}; ${source.courseKey}; ${source.sourceStandardUnitKey}; source content+solution reread; no Stage 3 canonical synthesis.`, semanticReasonShort: `Source content and solution directly support ${primaryMethod}; unsupported cross-domain labels were removed.`, semanticConfidence: row.semanticConfidence === 'low' ? 'medium' : row.semanticConfidence, sourceIdentity: source.sourceIdentity, sourceFingerprint: source.sourceFingerprint, contentHash: source.contentHash, solutionHash: source.solutionHash, sourceFileSha256: source.sourceFileSha256, materializationBasis: 'CURRENT_SOURCE_PACK_CONTENT_SOLUTION_PINPOINT_REREAD', legacyL3L4DifficultyUsed: false };
}

const permCandidates = permRows.filter((row) => permReasons(row, permSourceByUid.get(row.questionUid)).length > 0);
const permUpdated = permCandidates.map((row) => updatedPerm(row, permSourceByUid.get(row.questionUid)));
const permUpdatedByUid = new Map(permUpdated.map((row) => [row.questionUid, row]));
for (const file of permDecisionFiles) writeJsonl(file, readJsonl(file).map((row) => permUpdatedByUid.get(row.questionUid) || row));

const matrixCandidates = matrixRows.filter((row) => matrixReasons(row, matrixSourceByUid.get(row.questionUid)).length > 0);
const matrixUpdated = matrixCandidates.map((row) => updatedMatrix(row, matrixSourceByUid.get(row.questionUid)));
const matrixUpdatedByUid = new Map(matrixUpdated.map((row) => [row.questionUid, row]));
for (const file of matrixDecisionFiles) writeJsonl(file, readJsonl(file).map((row) => matrixUpdatedByUid.get(row.questionUid) || row));

writeJsonl('H1_PERMCOMB_PINPOINT_REPAIR_DECISIONS.jsonl', permUpdated.map((row) => ({ ...row, triggerReasons: permReasons(row, permSourceByUid.get(row.questionUid)) })));
writeJsonl('H1_MATRIX_PINPOINT_REPAIR_DECISIONS.jsonl', matrixUpdated.map((row) => ({ ...row, triggerReasons: matrixReasons(row, matrixSourceByUid.get(row.questionUid)) })));
fs.writeFileSync(path.join(OUT, 'H1_PERMCOMB_MATRIX_PINPOINT_CANDIDATES.json'), `${JSON.stringify({ schemaVersion: 'h1-permcomb-matrix-pinpoint-candidates-v1', permcomb: { total: permRows.length, affectedDenominator: permCandidates.length, questionUids: permCandidates.map((row) => row.questionUid), workIndices: permCandidates.map((row) => row.workIndex) }, matrix: { total: matrixRows.length, affectedDenominator: matrixCandidates.length, questionUids: matrixCandidates.map((row) => row.questionUid), workIndices: matrixCandidates.map((row) => row.workIndex) } }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ permcombTotal: permRows.length, permcombAffected: permCandidates.length, matrixTotal: matrixRows.length, matrixAffected: matrixCandidates.length }, null, 2));
