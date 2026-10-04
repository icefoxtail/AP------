import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '302_specialist_v1_expected_facts_r24.json'), 'utf8'));
const V2 = JSON.parse(fs.readFileSync(path.join(REPORT, '318_specialist_v2_artifact_only_r24_recheck_q13.json'), 'utf8'));
const VIS = JSON.parse(fs.readFileSync(path.join(REPORT, '303_specialist_candidate_visual_manifest_r24.json'), 'utf8'));
const BANK = JSON.parse(fs.readFileSync(path.join(REPORT, '304_specialist_candidate_bank_manifest_r24.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '319_specialist_v3_recheck_r24_q13.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function format(value) { if (typeof value === 'number') return Number.isInteger(value) ? String(value) : value.toFixed(5).replace(/0+$/, '').replace(/\.$/, ''); return String(value ?? ''); }
function normalize(value) { return String(value ?? '').replace(/\$|\\/g, '').replace(/[{}]/g, '').replace(/[−–]/g, '-').replace(/\s+/g, ''); }
function includes(haystack, needle) { return normalize(haystack).includes(normalize(needle)); }

const fact = FACTS.rows.find(row => row.questionUid.endsWith('|22_효천고_1학기_기말_고1_기출|13'));
const artifact = V2.rows[0];
const visual = VIS.rows.find(row => row.questionUid === fact.questionUid);
const bankFile = BANK.candidateFiles.find(file => file.sourcePath === fact.sourceJsPath);
const bank = load(bankFile.candidatePath);
const question = bank.questionBank.find(item => Number(item.id) === fact.id);
const expected = fact.expectedFacts;
const anchors = [format(expected.result), format(expected.maximum), format(expected.minimum), `(${format(expected.vertex[0])},${format(expected.vertex[1])})`];
const missingArtifactAnchors = anchors.filter(anchor => !includes(artifact.observedText, anchor));
const artifactHashParity = artifact.artifactFactHash === visual.factSha256;
const solutionPresent = String(question.solution ?? '').trim().length > 0;
const answerPresent = typeof question.answer === 'string' && question.answer.trim().length > 0;
const verdict = artifactHashParity && !missingArtifactAnchors.length && solutionPresent && answerPresent ? 'PASS' : 'FAIL';
const row = { questionUid: fact.questionUid, id: fact.id, repairScope: 'R24_Q13_RENDER_LABEL_ONLY', artifactHashParity, missingArtifactAnchors, solutionPresent, sourceAnswerPresent: answerPresent, verdict, status: verdict === 'PASS' ? 'V3_TARGETED_RECHECK_PASS' : 'V3_TARGETED_RECHECK_FAIL' };
const output = { schemaVersion: 'HS_QUADRATIC_SPECIALIST_V3_RECHECK_R24_Q13', status: verdict === 'PASS' ? 'TARGETED_RECHECK_PASS_NO_FINAL_PASS' : 'TARGETED_RECHECK_FAIL', productionAuthorized: false, inputVisibilityProfile: 'FROZEN_V1_V2_PLUS_CANDIDATE_SOLUTION', rows: [row], passCount: verdict === 'PASS' ? 1 : 0, failCount: verdict === 'PASS' ? 0 : 1, note: 'One targeted V2→V3 recheck after a render-label-only repair; this does not claim whole-job final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, rows: 1, passCount: output.passCount, failCount: output.failCount }, null, 2));
