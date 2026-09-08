import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const SOURCE = JSON.parse(fs.readFileSync(path.join(REPORT, '37_candidate_source_repair_manifest_r8.json'), 'utf8'));
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '39_approved_source_only_v1_expected_facts_r9.json'), 'utf8'));
const VISUALS = JSON.parse(fs.readFileSync(path.join(REPORT, '40_approved_candidate_visual_manifest_r9.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r9', 'exams');
const OUTPUT = path.join(REPORT, '41_approved_candidate_bank_manifest_r9.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function protectedHash(q) { return crypto.createHash('sha256').update(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })).digest('hex'); }
function caseIdFor(uid) { return VISUALS.rows.find(row => row.questionUid === uid)?.caseId; }

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const factsByUid = new Map(FACTS.rows.map(row => [row.questionUid, row]));
  const visualByUid = new Map(VISUALS.rows.map(row => [row.questionUid, row]));
  const candidateFiles = [];
  const rows = [];
  for (const file of SOURCE.candidateFiles) {
    const candidate = load(file.candidatePath);
    const sourceRows = SOURCE.repairedRows.filter(row => row.sourceJsPath === file.sourcePath);
    const visualRows = sourceRows.filter(row => factsByUid.has(row.questionUid));
    for (const repair of visualRows) {
      const q = candidate.questionBank.find(item => Number(item.id) === repair.id);
      if (!q) throw new Error(`question missing ${repair.questionUid}`);
      const visual = visualByUid.get(repair.questionUid); const fact = factsByUid.get(repair.questionUid);
      if (!visual || !fact) throw new Error(`visual/fact missing ${repair.questionUid}`);
      const before = protectedHash(q);
      q.solutionImage = visual.assetPath;
      q.solutionImageAlt = '문항의 핵심 함수 그래프·수직선·기하 관계를 나타낸 후보 해설 시각자료';
      q.solutionImageCaption = '후보 SVG: 문제의 조건과 독립 계산으로 확정한 관계를 그림에서 확인한다.';
      q.solutionImageSize = 'full';
      const after = protectedHash(q);
      if (before !== after) throw new Error(`protected hash changed ${repair.questionUid}`);
      rows.push({ questionUid: repair.questionUid, caseId: visual.caseId, assetPath: visual.assetPath, expectedFactSha256: visual.factSha256, protectedHashBefore: before, protectedHashAfter: after, status: 'CANDIDATE_VISUAL_ATTACHED_NO_PASS' });
    }
    const outputName = `${String(candidateFiles.length + 1).padStart(3, '0')}-${path.basename(file.sourcePath)}`;
    const outputPath = path.join(OUT, outputName);
    fs.writeFileSync(outputPath, `window.examTitle = ${JSON.stringify(candidate.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};\n`, 'utf8');
    candidateFiles.push({ sourcePath: file.sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r9/exams/${outputName}`, sourceQuestionCount: candidate.questionBank.length, candidateQuestionCount: candidate.questionBank.length, candidateFileSha256: crypto.createHash('sha256').update(fs.readFileSync(outputPath)).digest('hex') });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_APPROVED_CANDIDATE_BANK_MANIFEST_R9', status: 'CANDIDATE_SOURCE_REPAIRS_AND_VISUALS_ATTACHED_NO_PASS', productionAuthorized: false, sourceRepairManifest: 'reports/hs-quadratic-svg-upgrade-20260908/37_candidate_source_repair_manifest_r8.json', v1Facts: 'reports/hs-quadratic-svg-upgrade-20260908/39_approved_source_only_v1_expected_facts_r9.json', visualManifest: 'reports/hs-quadratic-svg-upgrade-20260908/40_approved_candidate_visual_manifest_r9.json', scope: { candidateFileCount: candidateFiles.length, attachedVisualCount: rows.length, repairedSourceCount: SOURCE.repairedRows.length }, candidateFiles, rows, protectedParity: rows.every(row => row.protectedHashBefore === row.protectedHashAfter), sourceHoldsAfterCandidateRepair: 0, note: 'candidate-r9 inherits the r8 source repairs and prior candidate repairs, then attaches five new SVGs. No production file was mutated and no final PASS is declared.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, candidateFileCount: candidateFiles.length, attachedVisualCount: rows.length, protectedParity: output.protectedParity }, null, 2));
}
main();
