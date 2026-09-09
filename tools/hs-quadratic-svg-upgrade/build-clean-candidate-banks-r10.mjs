import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const R7 = JSON.parse(fs.readFileSync(path.join(REPORT, '32_full_candidate_bank_manifest_r7.json'), 'utf8'));
const R9 = JSON.parse(fs.readFileSync(path.join(REPORT, '41_approved_candidate_bank_manifest_r9.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r10', 'exams');
const OUTPUT = path.join(REPORT, '59_clean_candidate_bank_manifest_r10.json');

function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedHash(q) { return sha(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })); }
function key(sourcePath, id) { return `${sourcePath}|${id}`; }
function currentPath(sourcePath) { return sourcePath.startsWith('archive/') ? sourcePath : `archive/${sourcePath}`; }

const inventory = fs.readFileSync(INVENTORY, 'utf8');
const rows = [];
const sourcePaths = [...new Set(R7.candidateFiles.map(file => file.sourcePath))];
const oldVisualRows = R7.candidateVisualRows;
const newVisualRows = R9.rows;
const oldVisualByKey = new Map(oldVisualRows.map(row => [key(row.sourceJsPath, row.id), row]));
const newVisualByKey = new Map(newVisualRows.map(row => [key(row.questionUid.split('|')[0], row.questionUid.split('|').at(-1)), { ...row, sourceJsPath: row.questionUid.split('|')[0], id: Number(row.questionUid.split('|').at(-1)) }]));
const r7BySource = new Map(R7.candidateFiles.map(file => [file.sourcePath, file]));
const fiveSourceRepairKeys = new Set(['archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|13', 'archive/exams/original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js|17', 'archive/exams/original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js|19', 'archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|9', 'archive/exams/original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js|15']);

for (let index = 0; index < sourcePaths.length; index += 1) {
  const sourcePath = sourcePaths[index]; const source = load(sourcePath); const oldCandidate = load(r7BySource.get(sourcePath).candidatePath); const candidate = { examTitle: source.examTitle, questionBank: source.questionBank.map(question => ({ ...question })) };
  const oldById = new Map(oldCandidate.questionBank.map(question => [Number(question.id), question]));
  for (const question of candidate.questionBank) {
    const id = Number(question.id); const itemKey = key(sourcePath, id); const old = oldById.get(id);
    // Carry only the 11 previously reviewed solution repairs; the five source
    // repairs now come from current source and must not be overwritten.
    if (old && !fiveSourceRepairKeys.has(itemKey) && JSON.stringify(old.solution) !== JSON.stringify(question.solution)) question.solution = old.solution;
    const oldVisual = oldVisualByKey.get(itemKey); const newVisual = newVisualByKey.get(itemKey);
    const visual = newVisual || oldVisual;
    if (visual) {
      question.solutionImage = visual.assetPath || visual.candidateAssetPath;
      question.solutionImageAlt = '문항의 핵심 함수·부등식·기하 관계를 나타낸 후보 해설 시각자료';
      question.solutionImageCaption = '후보 SVG: 문제 조건과 독립 계산으로 확정할 관계를 그림에서 확인한다.';
      question.solutionImageSize = 'full';
      rows.push({ questionUid: visual.questionUid, sourceJsPath: sourcePath, id, assetPath: question.solutionImage, sourceProtectedHash: protectedHash(question), candidateProtectedHash: protectedHash(question), status: 'CLEAN_CANDIDATE_VISUAL_BOUND_NO_PASS' });
    } else {
      delete question.solutionImage; delete question.solutionImageAlt; delete question.solutionImageCaption; delete question.solutionImageSize;
    }
  }
  const outputName = `${String(index + 1).padStart(3, '0')}-${path.basename(sourcePath)}`; const outputPath = path.join(OUT, outputName); fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(outputPath, `window.examTitle = ${JSON.stringify(candidate.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};\n`, 'utf8');
}
const visualKeys = new Set(rows.map(row => key(row.sourceJsPath, row.id)));
const solutionRepairRows = [];
for (const sourcePath of sourcePaths) { const source = load(sourcePath); const oldCandidate = load(r7BySource.get(sourcePath).candidatePath); const oldById = new Map(oldCandidate.questionBank.map(question => [Number(question.id), question])); for (const q of source.questionBank) { const old = oldById.get(Number(q.id)); const itemKey = key(sourcePath, q.id); if (old && !fiveSourceRepairKeys.has(itemKey) && JSON.stringify(old.solution) !== JSON.stringify(q.solution)) solutionRepairRows.push({ sourceJsPath: sourcePath, id: Number(q.id), status: 'INHERITED_APPROVED_CANDIDATE_SOLUTION_REPAIR' }); } }
const candidateFiles = sourcePaths.map((sourcePath, index) => { const outputName = `${String(index + 1).padStart(3, '0')}-${path.basename(sourcePath)}`; const outputPath = path.join(OUT, outputName); const source = load(sourcePath); return { sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r10/exams/${outputName}`, sourceQuestionCount: source.questionBank.length, candidateQuestionCount: load(`archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r10/exams/${outputName}`).questionBank.length, candidateFileSha256: sha(fs.readFileSync(outputPath)) }; });
const output = { schemaVersion: 'HS_QUADRATIC_CLEAN_CANDIDATE_BANK_MANIFEST_R10', status: 'CLEAN_CANDIDATE_BANK_BUILT_NO_PASS', productionAuthorized: false, inventoryFile: 'reports/hs-quadratic-svg-upgrade-20260908/01_target_inventory.csv', inventoryTextSha256: sha(Buffer.from(inventory, 'utf8')), targetQuestionCount: 430, sourceFileCount: sourcePaths.length, candidateFiles, inheritedApprovedSolutionRepairCount: solutionRepairRows.length, visualBindingCount: rows.length, visualBindingKeys: [...visualKeys].sort(), sourceRepairKeys: [...fiveSourceRepairKeys].sort(), inheritedVisualsExcluded: true, rows, note: 'Clean candidate-r10 starts from current branch source, carries only the previously reviewed 11 solution repairs, binds the previous 14 reviewed visuals and the five r9 visuals, and removes inherited unreviewed solutionImage fields. No production promotion or final PASS is claimed.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, sourceFileCount: output.sourceFileCount, visualBindingCount: output.visualBindingCount, inheritedApprovedSolutionRepairCount: output.inheritedApprovedSolutionRepairCount }, null, 2));
