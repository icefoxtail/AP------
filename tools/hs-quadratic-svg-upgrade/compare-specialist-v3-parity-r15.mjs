import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '135_specialist_v1_expected_facts_r15.json'), 'utf8'));
const V2 = JSON.parse(fs.readFileSync(path.join(REPORT, '140_specialist_v2_artifact_only_r15.json'), 'utf8'));
const VIS = JSON.parse(fs.readFileSync(path.join(REPORT, '136_specialist_candidate_visual_manifest_r15.json'), 'utf8'));
const BANK = JSON.parse(fs.readFileSync(path.join(REPORT, '137_specialist_candidate_bank_manifest_r15.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '142_specialist_v3_parity_r15.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function format(value) { if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(5).replace(/0+$/, '').replace(/\.$/, ''); return String(value ?? ''); }
function normalize(value) { return String(value ?? '').replace(/\\(?:d?frac)\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2').replace(/\$|\\/g, '').replace(/[{}]/g, '').replace(/[−–]/g, '-').replace(/\s+/g, ''); }
function includesNormalized(haystack, needle) { return normalize(haystack).includes(normalize(needle)); }
function sourceAnchors(fact) { const expected = fact.expectedFacts; const anchors = []; for (const key of ['result', 'sum', 'count']) if (typeof expected[key] === 'number') anchors.push(format(expected[key])); return [...new Set(anchors.filter(Boolean))]; }
function artifactAnchors(fact) {
  const expected = fact.expectedFacts; const anchors = [];
  for (const key of ['result', 'sum', 'count', 'maximum', 'minimum']) if (expected[key] !== undefined && typeof expected[key] !== 'object') anchors.push(format(expected[key]));
  if (expected.exact && fact.expectedVisualType === 'number-line') anchors.push(expected.exact);
  for (const key of ['solutionInterval', 'realInterval']) if (expected[key]) for (const [index, value] of expected[key].entries()) if (value !== null) anchors.push(index === 0 ? expected.leftLabel ?? format(value) : expected.rightLabel ?? format(value));
  if (expected.solutionIntervals) for (const interval of expected.solutionIntervals) for (const value of [interval.left, interval.right]) if (value !== null) anchors.push(format(value));
  if (expected.integerSolutions) for (const value of expected.integerSolutions) anchors.push(format(value));
  if (expected.vertex) anchors.push(`(${expected.vertex[0]},${expected.vertex[1]})`);
  return [...new Set(anchors.filter(Boolean))];
}

const v2ByUid = new Map(V2.rows.map((row) => [row.questionUid, row]));
const visualByUid = new Map(VIS.rows.map((row) => [row.questionUid, row]));
const candidateBySource = new Map(BANK.candidateFiles.map((file) => [file.sourcePath, file]));
const rows = [];
for (const fact of FACTS.rows) {
  const v2 = v2ByUid.get(fact.questionUid); const visual = visualByUid.get(fact.questionUid);
  if (!v2 || !visual) throw new Error(`missing V2/visual ${fact.questionUid}`);
  const bank = load(candidateBySource.get(fact.sourceJsPath).candidatePath); const question = bank.questionBank.find((item) => Number(item.id) === fact.id);
  const missingArtifact = artifactAnchors(fact).filter((anchor) => !includesNormalized(v2.observedText, anchor)); const solutionText = String(question.solution ?? ''); const missingSolution = sourceAnchors(fact).filter((anchor) => !includesNormalized(solutionText, anchor));
  const artifactHashParity = v2.artifactFactHash === visual.factSha256; const sourceAnswerPresent = typeof question.answer === 'string' && question.answer.trim().length > 0; const solutionPresent = solutionText.trim().length > 0; const verdict = artifactHashParity && missingArtifact.length === 0 && missingSolution.length === 0 && sourceAnswerPresent && solutionPresent ? 'PASS' : 'FAIL';
  rows.push({ questionUid: fact.questionUid, id: fact.id, artifactHashParity, artifactAnchorCount: artifactAnchors(fact).length, missingArtifactAnchors: missingArtifact, solutionEvidenceAnchors: sourceAnchors(fact), missingSolutionAnchors: missingSolution, sourceAnswer: question.answer, sourceAnswerPresent, solutionPresent, verdict, status: verdict === 'PASS' ? 'V3_PARITY_PASS' : 'V3_PARITY_FAIL' });
}
const failCount = rows.filter((row) => row.verdict === 'FAIL').length; const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_V3_PARITY_R15', status: failCount ? 'V3_PARITY_FAIL' : 'V3_PARITY_RECORDED_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'FROZEN_V1_V2_PLUS_CANDIDATE_SOLUTION', rows, passCount: rows.length - failCount, failCount, note: 'V3 checks fresh source-only facts against artifact-only observed labels and candidate solution evidence; row-level candidate parity only.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, rows: rows.length, passCount: output.passCount, failCount: output.failCount }, null, 2));
