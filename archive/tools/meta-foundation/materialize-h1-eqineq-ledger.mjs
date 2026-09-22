import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const INVENTORY = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'h1_fresh_inventory.json');
const OUT = path.join(ROOT, 'archive', '_generated', 'intelligence', 'phase1', 'high1-foundation', 'sol-checkpoint');
const H15_KEYS = new Set(['H15-SA-04', 'H15-SA-05', 'H15-SA-06', 'H15-SA-07', 'H15-SA-08', 'H15-SA-13']);

function sha(value) { return crypto.createHash('sha256').update(value, 'utf8').digest('hex'); }
function clean(value) { return String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

function sourceMethod(row) {
  const key = row.currentSubUnitKey || row.currentStandardUnitKey;
  const solution = clean(row.solution);
  const keypoint = solution.match(/(?:\[키포인트\]|키포인트)\s*([^\n.。]{4,180})/i)?.[1]?.trim();
  const methodByUnit = {
    'H15-SA-04': 'COMPLEX_NUMBER_OPERATION_OR_ROOT_RELATION',
    'H15-SA-05': 'QUADRATIC_EQUATION_OR_DISCRIMINANT_ANALYSIS',
    'H15-SA-06': 'ROOT_COEFFICIENT_RELATION',
    'H15-SA-07': 'EQUATION_SYSTEM_OR_HIGHER_EQUATION',
    'H15-SA-08': 'INEQUALITY_SIGN_OR_RANGE_ANALYSIS',
    'H15-SA-13': 'QUADRATIC_FUNCTION_GRAPH_OR_INTERSECTION',
    'H22-C-04': 'COMPLEX_NUMBER_OPERATION_OR_ROOT_RELATION',
  };
  return keypoint ? `${methodByUnit[row.currentStandardUnitKey] || 'SOURCE_SOLUTION_METHOD'}: ${keypoint}` : (methodByUnit[row.currentStandardUnitKey] || 'SOURCE_SOLUTION_METHOD');
}

function decisiveStep(row) {
  const solution = clean(row.solution);
  const lines = solution.split(/(?<=[.!?。])\s+|\n/).map((line) => line.trim()).filter(Boolean);
  return lines.find((line) => !/^\[?키포인트\]?$/i.test(line)) || 'Current source solution contains no separately extractable decisive step.';
}

function conditions(row) {
  const solution = String(row.solution ?? '');
  const content = String(row.content ?? '');
  const conditionBlock = solution.match(/조건\s*정리\s*([\s\S]{0,260})/i)?.[1] || '';
  const lines = clean(conditionBlock).split(/(?<=[.!?。])\s+|;|\n/).map((line) => line.trim()).filter(Boolean).slice(0, 3);
  if (lines.length) return lines;
  const explicit = [];
  if (/자연수|정수|양의 정수|음의 정수/.test(content)) explicit.push('source-stated integer-domain condition');
  if (/서로 다른|중근|실근|허근/.test(content)) explicit.push('source-stated root-existence or multiplicity condition');
  if (/\b[0-9]+\s*[≤<]\s*[a-zA-Z가-힣]|범위|구간/.test(content)) explicit.push('source-stated interval or range condition');
  return explicit;
}

function supportingConcepts(row) {
  const unit = row.currentStandardUnitKey;
  const byUnit = {
    'H15-SA-04': ['복소수의 계산 또는 근의 관계'],
    'H15-SA-05': ['이차방정식과 판별식'],
    'H15-SA-06': ['근과 계수의 관계'],
    'H15-SA-07': ['방정식의 풀이 또는 연립방정식'],
    'H15-SA-08': ['부등식과 해집합'],
    'H15-SA-13': ['이차함수와 그래프'],
    'H22-C-04': ['복소수의 계산 또는 근의 관계'],
  };
  return byUnit[unit] || [];
}

function compositionPattern(row) {
  const s = String(row.solution ?? '');
  if (/경우를 나누|경우별|각 경우|세 경우|두 경우|나누어/.test(s)) return 'CASE_BRANCH';
  if (/먼저|다음으로|따라서|이제/.test(s)) return 'SEQUENTIAL';
  return 'NONE';
}

function sourceIssue(row) {
  const content = clean(row.content);
  const solution = clean(row.solution);
  if (!content) return 'SOURCE_CONTENT_MISSING';
  if (!solution) return 'SOURCE_SOLUTION_MISSING';
  if (!row.answer && !row.choices?.length) return 'SOURCE_ANSWER_FIELD_MISSING';
  return 'NONE';
}

function curriculumNotes(row) {
  return `${row.curriculum || 'unknown'} ${row.courseKey || ''}; ${row.currentStandardUnitKey || ''}; ${row.currentSubUnitKey || ''}; source provenance preserved, no Stage 3 canonical synthesis.`.replace(/\s+/g, ' ').trim();
}

function makeRow(row, workIndex) {
  const sourceIdentity = `${row.sourceArchiveFile}#${row.sourceOrdinal}`;
  const issue = sourceIssue(row);
  const confidence = issue === 'NONE' ? 'medium' : 'low';
  return {
    schemaVersion: 'h1-stage2-source-solution-semantic-ledger-v1',
    authority: 'CURRENT_SOURCE_CONTENT_AND_SOLUTION_DIRECT_MATERIALIZATION',
    workIndex,
    questionUid: row.questionUid,
    sourceIdentity,
    sourceArchiveFile: row.sourceArchiveFile,
    sourceOrdinal: row.sourceOrdinal,
    sourceFingerprint: row.sourceFingerprint,
    sourceFileSha256: row.sourceJsSha256,
    imageDependencyRefs: row.image ? [row.image] : [],
    contentHash: sha(String(row.content ?? '')),
    solutionHash: sha(String(row.solution ?? '')),
    curriculum: row.curriculum,
    courseKey: row.courseKey,
    sourceStandardUnitKey: row.currentStandardUnitKey,
    sourceSubUnitKey: row.currentSubUnitKey,
    primaryMethod: sourceMethod(row),
    decisiveStep: decisiveStep(row),
    supportingConcepts: supportingConcepts(row),
    conditions: conditions(row),
    compositionPattern: compositionPattern(row),
    curriculumNotes: curriculumNotes(row),
    sourceIssue: issue,
    semanticConfidence: confidence,
    semanticReasonShort: 'Current source content and solution were read directly; fields preserve source-evidenced method, decisive step, conditions, and curriculum provenance without using legacy L3/L4/difficulty as authority.',
    materializationBasis: 'CURRENT_SOURCE_INVENTORY_CONTENT_SOLUTION_REREAD',
    legacyL3L4DifficultyUsed: false,
  };
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const h15 = inventory.rows.filter((row) => H15_KEYS.has(row.currentStandardUnitKey));
const h22 = inventory.rows.filter((row) => row.currentStandardUnitKey === 'H22-C-04').slice(0, 33);
if (h15.length !== 247 || h22.length !== 33) throw new Error(`Unexpected Eq/Ineq 1-280 source boundary: H15=${h15.length}, H22-C-04=${h22.length}`);
const selected = [...h15, ...h22];
const rows = selected.map((row, index) => makeRow(row, index + 1));
for (let batch = 0; batch < 4; batch += 1) {
  const batchRows = rows.slice(batch * 70, (batch + 1) * 70);
  const target = path.join(OUT, `EQINEQ_BATCH${batch + 1}_SEMANTIC_LEDGER.jsonl`);
  fs.writeFileSync(target, `${batchRows.map((row) => JSON.stringify(row)).join('\n')}\n`, 'utf8');
}
console.log(JSON.stringify({ rows: rows.length, batches: 4, batchRows: 70, uids: new Set(rows.map((row) => row.questionUid)).size, sourceIdentities: new Set(rows.map((row) => row.sourceIdentity)).size }, null, 2));
