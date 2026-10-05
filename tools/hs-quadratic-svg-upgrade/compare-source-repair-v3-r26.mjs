import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '343_source_repair_v1_expected_facts_r26.json'), 'utf8'));
const V2 = JSON.parse(fs.readFileSync(path.join(REPORT, '350_source_repair_v2_artifact_only_r26.json'), 'utf8'));
const VIS = JSON.parse(fs.readFileSync(path.join(REPORT, '346_source_repair_candidate_visual_manifest_r26.json'), 'utf8'));
const BANK = JSON.parse(fs.readFileSync(path.join(REPORT, '348_source_repair_candidate_bank_manifest_r26.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '351_source_repair_v3_parity_r26.json');
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function format(value) { if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(5).replace(/0+$/, '').replace(/\.$/, ''); return String(value ?? ''); }
function formatVariants(value) { if (typeof value !== 'number') return [format(value)]; const base = format(value); const truncated = (Math.trunc(value * 100000) / 100000).toFixed(5).replace(/0+$/, '').replace(/\.$/, ''); return [...new Set([base, truncated])]; }
function norm(value) { return String(value ?? '').replace(/\$|\\/g, '').replace(/[{}]/g, '').replace(/[−–]/g, '-').replace(/\s+/g, ''); }
function includes(haystack, needle) { return norm(haystack).includes(norm(needle)); }
function anchors(fact) { const e = fact.expectedFacts; const output = []; for (const key of ['result', 'sum', 'count', 'maximum', 'minimum']) if (e[key] !== undefined && typeof e[key] !== 'object') output.push(format(e[key])); return [...new Set(output.filter(Boolean))]; }
const v2 = new Map(V2.rows.map(row => [row.questionUid, row]));
const visuals = new Map(VIS.rows.map(row => [row.questionUid, row]));
const candidates = new Map(BANK.candidateFiles.map(file => [file.sourcePath, file]));
const rows = [];
for (const fact of FACTS.rows) {
  const artifact = v2.get(fact.questionUid); const visual = visuals.get(fact.questionUid); if (!artifact || !visual) throw new Error(`missing V2/visual ${fact.questionUid}`);
  const bank = load(candidates.get(fact.sourceJsPath).candidatePath); const question = bank.questionBank.find(item => Number(item.id) === fact.id);
  const missing = anchors(fact).filter(anchor => !includes(artifact.observedText, anchor));
  if (fact.expectedFacts.vertex) { const x = formatVariants(fact.expectedFacts.vertex[0]); const y = formatVariants(fact.expectedFacts.vertex[1]); const vertexFound = x.some(a => y.some(b => includes(artifact.observedText, `(${a},${b})`))); if (!vertexFound) missing.push(`vertex:${format(fact.expectedFacts.vertex[0])},${format(fact.expectedFacts.vertex[1])}`); }
  const hash = artifact.artifactFactHash === visual.factSha256; const solutionPresent = String(question.solution ?? '').trim().length > 0; const answerPresent = typeof question.answer === 'string' && question.answer.trim().length > 0; const verdict = hash && !missing.length && solutionPresent && answerPresent ? 'PASS' : 'FAIL';
  rows.push({ questionUid: fact.questionUid, id: fact.id, artifactHashParity: hash, missingArtifactAnchors: missing, sourceAnswer: question.answer, sourceAnswerPresent: answerPresent, solutionPresent, verdict, status: verdict === 'PASS' ? 'V3_PARITY_PASS' : 'V3_PARITY_FAIL' });
}
const failCount = rows.filter(row => row.verdict === 'FAIL').length;
const output = { schemaVersion: 'HS_QUADRATIC_SOURCE_REPAIR_V3_PARITY_R26', status: failCount ? 'V3_PARITY_FAIL' : 'V3_PARITY_RECORDED_NO_FINAL_PASS', productionAuthorized: false, inputVisibilityProfile: 'FROZEN_V1_V2_PLUS_CURRENT_SOURCE_SOLUTION', rows, passCount: rows.length - failCount, failCount, note: 'V3 parity for 11 fresh source-repair SVGs; vertex display comparison accepts the generator’s bounded 5-decimal rounding while preserving exact expected facts.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: rows.length, passCount: output.passCount, failCount }, null, 2));
