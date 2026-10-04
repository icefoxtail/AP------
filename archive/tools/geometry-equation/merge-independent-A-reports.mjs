import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));
const reportFiles = ['review_A_independent_batch_01.json', 'review_A_independent_batch_02.json', 'review_A_independent_batch_03.json', 'review_A_independent_batch_04.json'];

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n').trim();
  return value ?? null;
}
function hashJson(value) { return sha(JSON.stringify(stable(value))); }
function readJson(name) { return JSON.parse(fs.readFileSync(path.join(REPORTS, name), 'utf8')); }
function inputSha(report) {
  return report.inputSha?.A_START_INPUT_SHA || report.inputSha?.A_START_RELEASE_SHA || report.input?.A_START_INPUT_SHA || report.input?.A_START_INPUT_SHA256 || report.input?.startInputSha256 || report.inputIntegrity?.startInputSetSha256 || null;
}
function endInputSha(report) {
  return report.inputSha?.A_END_INPUT_SHA || report.inputSha?.A_END_RELEASE_SHA || report.input?.A_END_INPUT_SHA || report.input?.A_END_INPUT_SHA256 || report.input?.endInputSha256 || report.inputIntegrity?.endInputSetSha256 || null;
}
function reviewItems(report) { return report.reviews || report.rows || report.items || []; }
function rowNumber(item) { return item.manifestRow ?? item.manifestRowNumber ?? item.row ?? item.manifestIndex ?? item.ordinal; }
function codes(item) { return item.reasonCodes || item.reasonCode || item.solutionIssues?.map?.((issue) => issue.code || issue) || []; }
function currentAnswer(item) { return item.artifactAnswer ?? item.currentAnswer ?? item.answer ?? item.recordedAnswer ?? item.answerAgreement?.existingAnswer ?? null; }
function agreement(item) { return item.answerAgreement?.agrees === true || item.answerAgreement === 'MATCH' || item.answerAgreement === true || item.answerAgreement === 'true'; }

const reports = reportFiles.map((name) => ({ name, data: readJson(name) }));
const merged = reports.flatMap(({ name, data }) => reviewItems(data).map((item) => ({ ...item, _reportFile: name, _codes: codes(item) })));
const expectedRows = new Set(manifest.rows.map((_, index) => index + 1));
const observedRows = new Set(merged.map(rowNumber).filter((value) => Number.isInteger(value)));
const duplicates = [...observedRows].filter((row) => merged.filter((item) => rowNumber(item) === row).length > 1);
const missing = [...expectedRows].filter((row) => !observedRows.has(row));
if (merged.length !== manifest.rows.length || missing.length || duplicates.length) throw new Error(`A coverage invalid: merged=${merged.length}, missing=${missing.length}, duplicates=${duplicates.length}`);
if (new Set(reports.map(({ data }) => data.protocol?.sha256 || data.input?.protocolSha256 || data.inputIntegrity?.protocolSha256 || null).filter(Boolean)).size > 1) throw new Error('A report protocol SHA mismatch');

const facts = merged.sort((a, b) => rowNumber(a) - rowNumber(b)).map((item) => {
  const row = manifest.rows[rowNumber(item) - 1];
  const visualRequirement = item.visualRequirement || item.visualRequirementJudgement || item.independentFacts?.visualRequirement || item.independentFacts?.visualRequirementInFacts || item.solutionIssues?.visualRequirement || row.visualRequirement;
  const reasonCodes = [...item._codes];
  const hasSolutionVisual = Boolean(item.solutionImageRef || item.solutionImage || item.currentSolutionImage || item.solutionIssues?.solutionImagePresent === true || item.solutionIssues?.visualStatus === 'PRESENT');
  if (visualRequirement === 'VISUAL_REQUIRED' && !hasSolutionVisual && !reasonCodes.includes('SOLUTION_VISUAL_MISSING')) reasonCodes.push('SOLUTION_VISUAL_MISSING');
  const fact = {
    manifestRow: rowNumber(item),
    questionUid: item.questionUid || row.questionUid,
    qKey: row.qKey,
    sourceJsPath: row.sourceJsPath,
    id: row.id,
    mappedUnitKey: row.mappedUnitKey,
    subUnitKey: row.subUnitKey,
    independentSolveMethod: item.independentSolveMethod || item.independentMethod || '',
    independentFacts: item.independentFacts || item.facts || [],
    expectedAnswer: item.expectedAnswer ?? null,
    existingAnswer: currentAnswer(item),
    answerAgreement: agreement(item),
    visualRequirement,
    reasonCodes,
    solutionIssues: item.solutionIssues || [],
    sourceReview: item._reportFile,
    status: item.status || (item._codes.length ? 'REPAIR_REQUIRED' : 'PASS'),
  };
  fact.independentFactHash = hashJson({ questionUid: fact.questionUid, independentSolveMethod: fact.independentSolveMethod, independentFacts: fact.independentFacts, expectedAnswer: fact.expectedAnswer });
  return fact;
});

const sourceDefects = facts.filter((fact) => fact.reasonCodes.some((code) => /FAIL_PROBLEM|FAIL_ANSWER|SOURCE_|CHOICES_INCOMPLETE|METADATA/.test(String(code))));
const solutionDefects = facts.filter((fact) => fact.reasonCodes.some((code) => String(code) !== 'SOLUTION_VISUAL_MISSING' && /SOLUTION_LOGIC|SOLUTION_CALCULATION|CONDITION_CASE|DOMAIN_SIGN|FAIL_SOLUTION|SOLUTION_LOGIC_JUMP/.test(String(code))));
const visualMissing = facts.filter((fact) => fact.reasonCodes.includes('SOLUTION_VISUAL_MISSING'));
const answerDisagreements = facts.filter((fact) => fact.answerAgreement !== true);
const summaries = reports.map(({ name, data }) => ({ report: name, reviewer: data.reviewer || data.verifier || '', targetCount: data.summary?.targetCount ?? data.summary?.total ?? data.summary?.reviewedCount ?? reviewItems(data).length, passCount: data.summary?.passCount ?? data.summary?.pass ?? null, repairRequiredCount: data.summary?.repairRequiredCount ?? data.summary?.repairRequired ?? null, startInputSha: inputSha(data), endInputSha: endInputSha(data), startEndEqual: inputSha(data) && inputSha(data) === endInputSha(data), coverage: reviewItems(data).length }));
const result = {
  reportType: 'independent_A_math_solution_merged',
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  manifestSha256: sha(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'))),
  targetCount: manifest.rows.length,
  coverage: { expected: manifest.rows.length, observed: facts.length, missingRows: missing, duplicateRows: duplicates },
  inputIntegrity: summaries,
  summary: { status: sourceDefects.length || answerDisagreements.length || solutionDefects.length || visualMissing.length ? 'A_REPAIR_REQUIRED' : 'A_PASS', passCount: facts.length - new Set([...sourceDefects, ...answerDisagreements, ...solutionDefects, ...visualMissing].map((fact) => fact.questionUid)).size, repairRequiredCount: new Set([...sourceDefects, ...answerDisagreements, ...solutionDefects, ...visualMissing].map((fact) => fact.questionUid)).size, sourceDefectCount: sourceDefects.length, solutionDefectCount: solutionDefects.length, visualMissingCount: visualMissing.length, answerDisagreementCount: answerDisagreements.length, notTestedCount: facts.filter((fact) => fact.status === 'NOT_TESTED').length },
  sourceDefects: sourceDefects.map((fact) => fact.questionUid),
  solutionDefects: solutionDefects.map((fact) => fact.questionUid),
  visualMissing: visualMissing.map((fact) => fact.questionUid),
  facts,
};
fs.writeFileSync(path.join(REPORTS, 'a_independent_solve_facts.json'), JSON.stringify({ protocol: result.protocol, manifestSha256: result.manifestSha256, targetCount: result.targetCount, facts }, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(REPORTS, 'review_A_math_solution.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
const csvHeaders = ['questionUid', 'manifestRow', 'status', 'answerAgreement', 'expectedAnswer', 'existingAnswer', 'reasonCodes', 'visualRequirement', 'sourceReview', 'independentFactHash'];
const csv = [csvHeaders.join(',')];
for (const fact of facts) csv.push(csvHeaders.map((key) => { const value = Array.isArray(fact[key]) ? fact[key].join('|') : String(fact[key] ?? ''); return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value; }).join(','));
fs.writeFileSync(path.join(REPORTS, 'review_input_hash_map.csv'), `${csv.join('\n')}\n`, 'utf8');
const md = ['# Independent A — 수학·해설·교육성 전수 검수\n\n', `- 상태: \`${result.summary.status}\`\n- protocol: v2.2\n- manifest SHA-256: \`${result.manifestSha256}\`\n- coverage: ${facts.length}/${manifest.rows.length}\n- source defect: ${sourceDefects.length}\n- solution defect: ${solutionDefects.length}\n- visual missing: ${visualMissing.length}\n- answer disagreement: ${answerDisagreements.length}\n\n`, '## 배치별 입력 무결성\n\n| report | reviewer | coverage | start SHA | end SHA | same |\n|---|---|---:|---|---|---|\n', ...summaries.map((row) => `| ${row.report} | ${row.reviewer} | ${row.coverage} | ${row.startInputSha || 'MISSING'} | ${row.endInputSha || 'MISSING'} | ${row.startEndEqual ? 'PASS' : 'FAIL'} |\n`), '\n## 수정 필요 문항\n\n', '| UID | status | reason codes | expected | existing | source report |\n|---|---|---|---|---|---|\n', ...facts.filter((fact) => fact.status !== 'PASS' || fact.reasonCodes.length).map((fact) => `| ${fact.questionUid} | ${fact.status} | ${fact.reasonCodes.join(', ')} | ${JSON.stringify(fact.expectedAnswer)} | ${JSON.stringify(fact.existingAnswer)} | ${fact.sourceReview} |\n`)];
fs.writeFileSync(path.join(REPORTS, 'review_A_math_solution.md'), md.join(''), 'utf8');
console.log(JSON.stringify({ status: result.summary.status, targetCount: result.targetCount, coverage: facts.length, sourceDefectCount: sourceDefects.length, solutionDefectCount: solutionDefects.length, visualMissingCount: visualMissing.length, answerDisagreementCount: answerDisagreements.length }, null, 2));
