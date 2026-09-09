import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r7', 'exams');
const OUTPUT = path.join(REPORT, '32_full_candidate_bank_manifest_r7.json');
const CALIBRATION_MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '04_calibration_candidate_manifest_r3.json'), 'utf8'));
const ADDITIONAL_MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '26_additional_candidate_manifest_r6.json'), 'utf8'));
const TEMPLATE_BANKS = new Map([
  ['25_금당고_1학기_중간_고1_기출.js', 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r3/exams/02-25_금당고_1학기_중간_고1_기출.js'],
  ['26_금당고_1학기_중간_고1_기출_c.js', 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_금당고_1학기_중간_고1_기출_c-solution-repair.js'],
  ['26_매산여고_1학기_중간_고1_기출_c.js', 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_매산여고_1학기_중간_고1_기출_c-solution-repair.js'],
  ['26_팔마고_1학기_중간_고1_기출_c.js', 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_팔마고_1학기_중간_고1_기출_c-solution-repair.js'],
]);

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedHash(q) { return sha(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })); }
function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}
function load(relative) { const filePath = path.join(ROOT, relative); const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function questionKey(sourcePath, id) { const basename = path.basename(sourcePath); return `${basename}|${id}`; }
function templateFor(sourcePath) { return TEMPLATE_BANKS.get(path.basename(sourcePath)) || null; }
function visualMap() {
  const map = new Map();
  for (const row of [...CALIBRATION_MANIFEST.rows, ...ADDITIONAL_MANIFEST.rows]) map.set(questionKey(`archive/exams/${row.questionUid.split('|')[0].replace(/^archive\/exams\//, '')}`, row.questionUid.split('|').at(-1)), row);
  return map;
}

function main() {
  const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const sourcePaths = [...new Set(inventory.map(row => row.sourceJsPath))].sort();
  const visuals = visualMap(); const rows = []; const candidateFiles = [];
  fs.mkdirSync(OUT, { recursive: true });
  for (const sourcePath of sourcePaths) {
    const source = load(sourcePath);
    const templatePath = templateFor(sourcePath);
    const candidate = templatePath ? load(templatePath) : source;
    const candidateQuestions = candidate.questionBank.map(q => ({ ...q }));
    const targetRows = inventory.filter(row => row.sourceJsPath === sourcePath);
    for (const target of targetRows) {
      const q = candidateQuestions.find(item => Number(item.id) === Number(target.id));
      if (!q) throw new Error(`candidate question missing ${target.questionUid}`);
      const before = protectedHash(source.questionBank.find(item => Number(item.id) === Number(target.id)));
      const after = protectedHash(q);
      if (before !== after) throw new Error(`protected source mismatch ${target.questionUid}`);
      const visual = visuals.get(questionKey(sourcePath, target.id));
      if (visual) {
        q.solutionImage = visual.assetPath;
        q.solutionImageAlt = visual.visualType === 'number-line' ? '부등식 해집합의 열린 끝점과 수직선' : '이차함수의 꼭짓점·접점·교점과 조건을 나타낸 해설 그래프';
        q.solutionImageCaption = visual.visualType === 'number-line' ? '수직선에서 열린 끝점과 해집합의 범위를 확인한다.' : '그래프에서 꼭짓점·교점·접점 또는 구간의 관계를 확인한다.';
        q.solutionImageSize = 'full';
        rows.push({ questionUid: target.questionUid, sourceJsPath: sourcePath, id: Number(target.id), candidateVisual: true, candidateAssetPath: visual.assetPath, candidateAssetSha256: visual.assetSha256, sourceProtectedHash: before, candidateProtectedHash: protectedHash(q), status: 'CANDIDATE_BOUND_NO_PASS' });
      }
    }
    const basename = path.basename(sourcePath);
    const outputName = `${String(candidateFiles.length + 1).padStart(3, '0')}-${basename}`;
    fs.writeFileSync(path.join(OUT, outputName), `window.examTitle = ${JSON.stringify(candidate.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidateQuestions, null, 2)};\n`, 'utf8');
    candidateFiles.push({ sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r7/exams/${outputName}`, sourceQuestionCount: source.questionBank.length, targetQuestionCount: targetRows.length, sourceFileSha256: sha(fs.readFileSync(path.join(ROOT, sourcePath))), candidateFileSha256: sha(fs.readFileSync(path.join(OUT, outputName))) });
  }
  const output = { schemaVersion: 'HS_QUADRATIC_FULL_CANDIDATE_BANK_MANIFEST_R7', status: 'FULL_CANDIDATE_BANK_BUILT_NO_PASS', productionAuthorized: false, scope: { targetQuestionCount: inventory.length, sourceFileCount: sourcePaths.length, candidateFileCount: candidateFiles.length }, candidateSolutionRepairSourceFiles: [...TEMPLATE_BANKS.keys()], candidateVisualRows: rows, candidateVisualCount: rows.length, candidateFiles, protectedParity: rows.every(row => row.sourceProtectedHash === row.candidateProtectedHash), sourceHoldCount: 5, note: 'All target-bearing source banks are copied into generated candidate paths. Only previously reviewed candidate solution/visual fields are bound; source answer/content holds remain unchanged and no final closure is claimed.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.scope.targetQuestionCount, sourceFiles: output.scope.sourceFileCount, candidateFiles: output.scope.candidateFileCount, candidateVisualCount: output.candidateVisualCount, protectedParity: output.protectedParity, sourceHoldCount: output.sourceHoldCount }, null, 2));
}
main();
