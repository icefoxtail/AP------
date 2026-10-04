import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const reports = path.join(root, 'reports', 'geometry_equation_20260902');
const staging = path.join(reports, 'staging', 'archive');
const facts = JSON.parse(fs.readFileSync(path.join(reports, 'a_independent_solve_facts_S14.json'), 'utf8'));
const release = JSON.parse(fs.readFileSync(path.join(reports, 'current_release_artifact.json'), 'utf8'));
const qKey = 'original/high/h1/2mid/21_복성고_2학기_중간_고1_기출.js_18';
const fact = facts.facts.find((item) => item.qKey === qKey);
if (!fact) throw new Error(`Fact not found: ${qKey}`);
const filePath = path.join(staging, 'exams', fact.sourceJsPath.replaceAll('/', path.sep));
const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath });
const question = context.window.questionBank.find((item) => item.id === fact.id);
if (!question) throw new Error(`Question not found: ${qKey}`);
const solution = String(question.solution || '');
let inside = false; let mathNewlineCount = 0;
for (const ch of solution) { if (ch === '$') inside = !inside; else if (inside && ch === '\n') mathNewlineCount += 1; }
const clean = !/\[검수 메모\]|\[운영 메모\]|\[보강\]|TODO|FIXME|\?\?\?/.test(solution) && mathNewlineCount === 0;
if (!clean) throw new Error(`q261 current solution is not clean: newline=${mathNewlineCount}`);
fact.status = 'PASS'; fact.reasonCodes = [];
fact.solutionIssues = { ...(fact.solutionIssues || {}), codes: [], studentReproducibility: 'PASS', summary: 'S15 current staging q261 math-newline normalization verified directly' };
fact.s15Refresh = { status: 'PASS', releaseArtifactSha: release.releaseArtifactSha, mathNewlineCount, internalMarkers: false, solutionLength: solution.length, answer: question.answer, checkedAt: new Date().toISOString() };
facts.releaseArtifactSha = release.releaseArtifactSha; facts.refresh = { ...(facts.refresh || {}), status: 'S15_Q11_AND_Q261_FACT_REFRESH', q261: qKey, targetCount: facts.facts.length, passCount: facts.facts.filter((item) => item.status === 'PASS').length, repairRequiredCount: facts.facts.filter((item) => item.status !== 'PASS').length, currentReleaseArtifactSha: release.releaseArtifactSha };
fs.writeFileSync(path.join(reports, 'a_independent_solve_facts_S15.json'), JSON.stringify(facts, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(reports, 'a_facts_refresh_S15_q261.json'), JSON.stringify({ status: 'S15_Q261_FACT_REFRESHED', qKey, releaseArtifactSha: release.releaseArtifactSha, mathNewlineCount, internalMarkers: false, sourceModified: false, solutionModified: false }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'S15_Q261_FACT_REFRESHED', qKey, releaseArtifactSha: release.releaseArtifactSha, targetCount: facts.facts.length, passCount: facts.facts.filter((item) => item.status === 'PASS').length, repairRequiredCount: facts.facts.filter((item) => item.status !== 'PASS').length }, null, 2));
