import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const FULL = JSON.parse(fs.readFileSync(path.join(REPORT, '103_specialist_candidate_bank_manifest_r13.json'), 'utf8'));
const OUT = path.join(ROOT, 'archive', '_generated', 'hs-quadratic-svg-upgrade-20260908', 'candidate-r13-scoped', 'exams');
const OUTPUT = path.join(REPORT, '110_scoped_candidate_bank_manifest_r13.json');
const TARGET_KEYS = new Set(['H15-SA-05', 'H15-SA-08', 'H15-SA-13', 'H22-C-05', 'H22-C-06']);
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function parseCsv(text) { const rows = []; let row = []; let cell = ''; let quoted = false; for (let index = 0; index < text.length; index += 1) { const ch = text[index]; const next = text[index + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; index += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; } if (cell || row.length) { row.push(cell); rows.push(row); } const headers = rows.shift(); return rows.map((values) => Object.fromEntries(headers.map((key, index) => [key, values[index] ?? '']))); }
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8')).filter((row) => TARGET_KEYS.has(row.standardUnitKey));
const idsBySource = new Map();
for (const row of inventory) { const sourcePath = row.sourceJsPath.startsWith('archive/') ? row.sourceJsPath : `archive/${row.sourceJsPath}`; if (!idsBySource.has(sourcePath)) idsBySource.set(sourcePath, []); idsBySource.get(sourcePath).push(Number(row.id)); }
const fullBySource = new Map(FULL.candidateFiles.map((file) => [file.sourcePath, file]));
const candidateFiles = [];
let count = 0;
fs.mkdirSync(OUT, { recursive: true });
for (const [sourcePath, ids] of idsBySource) {
  const full = fullBySource.get(sourcePath); if (!full) throw new Error(`missing full candidate ${sourcePath}`);
  const bank = load(full.candidatePath); const selected = bank.questionBank.filter((question) => ids.includes(Number(question.id)));
  if (selected.length !== ids.length) throw new Error(`id mismatch ${sourcePath}`);
  const outputName = `${String(candidateFiles.length + 1).padStart(3, '0')}-${path.basename(sourcePath)}`; const outputPath = path.join(OUT, outputName);
  fs.writeFileSync(outputPath, `window.examTitle = ${JSON.stringify(bank.examTitle)};\nwindow.questionBank = ${JSON.stringify(selected, null, 2)};\n`, 'utf8');
  candidateFiles.push({ sourcePath, candidatePath: `archive/_generated/hs-quadratic-svg-upgrade-20260908/candidate-r13-scoped/exams/${outputName}`, targetQuestionCount: selected.length, candidateFileSha256: sha(fs.readFileSync(outputPath)) }); count += selected.length;
}
const output = { schemaVersion: 'HS_QUADRATIC_SCOPED_CANDIDATE_BANK_MANIFEST_R13', status: 'SCOPED_CANDIDATE_BANK_BUILT_NO_PASS', productionAuthorized: false, targetQuestionCount: count, sourceFileCount: candidateFiles.length, candidateQuestionCount: count, declaredVisualCount: FULL.totalDeclaredCandidateVisualCount, candidateFiles, fullCandidateManifest: 'reports/hs-quadratic-svg-upgrade-20260908/103_specialist_candidate_bank_manifest_r13.json', note: 'Scoped candidate-r13 contains exactly the 430 target questions and latest unique candidate visual bindings. It is a v2 input draft, not a final PASS.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: output.status, targetQuestionCount: output.targetQuestionCount, sourceFileCount: output.sourceFileCount, candidateQuestionCount: output.candidateQuestionCount, declaredVisualCount: output.declaredVisualCount }, null, 2));
