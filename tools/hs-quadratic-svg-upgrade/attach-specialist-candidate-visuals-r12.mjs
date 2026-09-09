import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BASE = JSON.parse(fs.readFileSync(path.join(REPORT, '70_deterministic_candidate_bank_manifest_r11.json'), 'utf8'));
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '81_specialist_v1_expected_facts_r12.json'), 'utf8'));
const VISUALS = JSON.parse(fs.readFileSync(path.join(REPORT, '82_specialist_candidate_visual_manifest_r12.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r12', 'exams');
const OUTPUT = path.join(REPORT, '83_specialist_candidate_bank_manifest_r12.json');

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedHash(q) { return sha(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })); }
function key(sourcePath, id) { return `${sourcePath}|${id}`; }

const factByKey = new Map(FACTS.rows.map(row => [key(row.sourceJsPath, row.id), row]));
const visualByKey = new Map(VISUALS.rows.map(row => [key(row.questionUid.split('|')[0], row.questionUid.split('|').at(-1)), row]));
const rows = [];
const errors = [];
const candidateFiles = [];
let actualVisualCount = 0;
fs.mkdirSync(OUT, { recursive: true });

for (let index = 0; index < BASE.candidateFiles.length; index += 1) {
  const file = BASE.candidateFiles[index];
  const source = load(file.sourcePath);
  const candidate = load(file.candidatePath);
  for (const q of candidate.questionBank) {
    const visual = visualByKey.get(key(file.sourcePath, q.id));
    if (!visual) continue;
    const fact = factByKey.get(key(file.sourcePath, q.id));
    if (!fact) { errors.push(`FACT_MISSING:${file.sourcePath}|${q.id}`); continue; }
    const before = protectedHash(q);
    q.solutionImage = visual.assetPath;
    q.solutionImageAlt = '문항의 핵심 이차함수 그래프·부등식 해집합·조건 판정표를 나타낸 후보 해설 시각자료';
    q.solutionImageCaption = '후보 SVG: 문제 조건과 독립 계산으로 확정한 관계를 그림에서 확인한다.';
    q.solutionImageSize = 'full';
    if (before !== protectedHash(q)) errors.push(`PROTECTED_DRIFT:${file.sourcePath}|${q.id}`);
    rows.push({ questionUid: fact.questionUid, sourceJsPath: file.sourcePath, id: Number(q.id), caseId: visual.caseId, assetPath: visual.assetPath, protectedHashBefore: before, protectedHashAfter: protectedHash(q), status: 'SPECIALIST_CANDIDATE_VISUAL_BOUND_NO_PASS' });
  }
  actualVisualCount += candidate.questionBank.filter(q => q.solutionImage).length;
  const outputName = `${String(index + 1).padStart(3, '0')}-${path.basename(file.sourcePath)}`;
  const outputPath = path.join(OUT, outputName);
  fs.writeFileSync(outputPath, `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate.questionBank, null, 2)};\n`, 'utf8');
  candidateFiles.push({ sourcePath: file.sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r12/exams/${outputName}`, sourceQuestionCount: source.questionBank.length, candidateQuestionCount: candidate.questionBank.length, candidateFileSha256: sha(fs.readFileSync(outputPath)) });
}

if (rows.length !== FACTS.rows.length) errors.push(`ROW_COUNT:${rows.length}`);
if (new Set(rows.map(row => key(row.sourceJsPath, row.id))).size !== rows.length) errors.push('DUPLICATE_SPECIALIST_VISUAL_ROWS');
const supersededInheritedVisualCount = BASE.totalDeclaredCandidateVisualCount + rows.length - actualVisualCount;
const output = {
  schemaVersion: 'HS_QUADRATIC_SPECIALIST_CANDIDATE_BANK_MANIFEST_R12',
  status: errors.length ? 'SPECIALIST_CANDIDATE_BANK_FAIL' : 'SPECIALIST_CANDIDATE_BANK_ATTACHED_NO_PASS',
  productionAuthorized: false,
  baseCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/70_deterministic_candidate_bank_manifest_r11.json',
  v1Facts: 'reports/hs-quadratic-svg-upgrade-20260908/81_specialist_v1_expected_facts_r12.json',
  visualManifest: 'reports/hs-quadratic-svg-upgrade-20260908/82_specialist_candidate_visual_manifest_r12.json',
  targetQuestionCount: 430,
  candidateFileCount: candidateFiles.length,
  inheritedVisualCount: BASE.totalDeclaredCandidateVisualCount,
  attachedSpecialistVisualCount: rows.length,
  supersededInheritedVisualCount,
  totalDeclaredCandidateVisualCount: actualVisualCount,
  candidateFiles,
  rows,
  errors,
  note: 'Candidate-r12 carries prior explicitly declared visuals and adds/rebuilds 18 specialist-ready candidate visuals. Unique current visual count is used; superseded candidate bindings are not double-counted. Remaining specialist rows and final provider closure remain open.'
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, candidateFileCount: output.candidateFileCount, attachedSpecialistVisualCount: output.attachedSpecialistVisualCount, supersededInheritedVisualCount: output.supersededInheritedVisualCount, totalDeclaredCandidateVisualCount: output.totalDeclaredCandidateVisualCount, errors: output.errors.length }, null, 2));
