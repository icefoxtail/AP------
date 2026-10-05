import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const FACTS = JSON.parse(fs.readFileSync(path.join(REPORT, '25_additional_v1_expected_facts.json'), 'utf8'));
const INPUTS = [
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_금당고_1학기_중간_고1_기출_c-solution-repair.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_매산여고_1학기_중간_고1_기출_c-solution-repair.js',
  'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r5/exams/26_팔마고_1학기_중간_고1_기출_c-solution-repair.js',
];
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r6', 'exams');
const ASSET_ROOT = 'archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r6/assets';
const OUTPUT = path.join(REPORT, '30_additional_candidate_bank_manifest_r6.json');

function load(filePath) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: filePath, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function protectedHash(q) { return crypto.createHash('sha256').update(JSON.stringify({ id: q.id ?? null, content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null, image: q.image ?? null })).digest('hex'); }
function caseFor(uid) {
  if (uid.includes('26_금당고') && uid.endsWith('|6')) return 'hs-r6-geumdang-q6';
  if (uid.includes('26_금당고') && uid.endsWith('|9')) return 'hs-r6-geumdang-q9';
  if (uid.includes('26_금당고') && uid.endsWith('|16')) return 'hs-r6-geumdang-q16';
  if (uid.includes('26_매산여고') && uid.endsWith('|6')) return 'hs-r6-maesan-q6';
  if (uid.includes('26_매산여고') && uid.endsWith('|7')) return 'hs-r6-maesan-q7';
  if (uid.includes('26_매산여고') && uid.endsWith('|13')) return 'hs-r6-maesan-q13';
  if (uid.includes('26_매산여고') && uid.endsWith('|14')) return 'hs-r6-maesan-q14';
  if (uid.includes('26_팔마고') && uid.endsWith('|4')) return 'hs-r6-palma-q4';
  if (uid.includes('26_팔마고') && uid.endsWith('|5')) return 'hs-r6-palma-q5';
  throw new Error(`case mapping missing: ${uid}`);
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const byBasename = new Map(INPUTS.map(relative => [path.basename(relative).replace('-solution-repair.js', '.js'), relative]));
  const candidates = new Map();
  const rows = [];
  for (const item of FACTS.rows) {
    const basename = path.basename(item.questionUid.split('|')[0]);
    const input = byBasename.get(basename);
    if (!input) throw new Error(`input bank missing: ${basename}`);
    if (!candidates.has(basename)) {
      const source = load(path.join(ROOT, input));
      candidates.set(basename, { source, candidate: source.questionBank.map(q => ({ ...q })) });
    }
    const { candidate } = candidates.get(basename);
    const q = candidate.find(row => Number(row.id) === Number(item.questionUid.split('|').at(-1)));
    if (!q) throw new Error(`question missing: ${item.questionUid}`);
    const before = protectedHash(q); const caseId = caseFor(item.questionUid);
    q.solutionImage = `${ASSET_ROOT}/${caseId}.svg`;
    q.solutionImageAlt = '이차함수의 꼭짓점·접점·교점과 조건을 나타낸 해설 그래프';
    q.solutionImageCaption = '그래프에서 꼭짓점·교점·접점 또는 구간의 관계를 확인한다.';
    q.solutionImageSize = 'full';
    const after = protectedHash(q);
    if (before !== after) throw new Error(`protected hash changed: ${item.questionUid}`);
    const outputName = `${basename.replace(/\.js$/, '')}-visual-candidate.js`;
    const outputPath = path.join(OUT, outputName);
    rows.push({ questionUid: item.questionUid, sourceJsPath: `archive/exams/${item.questionUid.split('|')[0].replace(/^archive\/exams\//, '')}`, id: Number(item.questionUid.split('|').at(-1)), caseId, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r6/exams/${outputName}`, solutionImage: q.solutionImage, protectedHashBefore: before, protectedHashAfter: after, status: 'CANDIDATE_BANK_ATTACHED_NO_PASS' });
  }
  for (const [basename, { source, candidate }] of candidates) {
    const outputName = `${basename.replace(/\.js$/, '')}-visual-candidate.js`;
    fs.writeFileSync(path.join(OUT, outputName), `window.examTitle = ${JSON.stringify(source.examTitle)};\nwindow.questionBank = ${JSON.stringify(candidate, null, 2)};\n`, 'utf8');
  }
  const output = { schemaVersion: 'HS_QUADRATIC_ADDITIONAL_CANDIDATE_BANK_MANIFEST_R6', status: 'CANDIDATE_BANK_ATTACHED_NO_PASS', productionAuthorized: false, rows, note: 'Nine solution-repaired questions receive candidate solutionImage bindings. Source-hold questions are not attached.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, rows: rows.length, protectedParity: rows.every(row => row.protectedHashBefore === row.protectedHashAfter), candidateFiles: new Set(rows.map(row => row.candidatePath)).size }, null, 2));
}
main();
