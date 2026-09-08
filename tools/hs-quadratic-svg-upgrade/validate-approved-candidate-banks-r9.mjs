import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const INVENTORY = path.join(REPORT, '01_target_inventory.csv');
const REPAIRS = JSON.parse(fs.readFileSync(path.join(REPORT, '37_candidate_source_repair_manifest_r8.json'), 'utf8'));
const MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '41_approved_candidate_bank_manifest_r9.json'), 'utf8'));
const VISUALS = JSON.parse(fs.readFileSync(path.join(REPORT, '40_approved_candidate_visual_manifest_r9.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '46_approved_candidate_bank_validation_r9.json');

function parseCsv(text) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < text.length; i += 1) { const ch = text[i]; const next = text[i + 1]; if (quoted && ch === '"' && next === '"') { cell += '"'; i += 1; continue; } if (ch === '"') { quoted = !quoted; continue; } if (!quoted && ch === ',') { row.push(cell); cell = ''; continue; } if (!quoted && ch === '\n') { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; continue; } cell += ch; }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const headers = rows.shift(); return rows.map(values => Object.fromEntries(headers.map((key, i) => [key, values[i] ?? ''])));
}
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function protectedSource(q) { return JSON.stringify({ content: q.content ?? null, choices: q.choices ?? null, answer: q.answer ?? null }); }
function qkey(sourcePath, id) { return `${sourcePath}|${id}`; }

function main() {
  const inventory = parseCsv(fs.readFileSync(INVENTORY, 'utf8'));
  const errors = []; const sourceByPath = new Map(); const candidateByPath = new Map();
  for (const file of MANIFEST.candidateFiles) {
    const source = load(file.sourcePath); const candidate = load(file.candidatePath);
    sourceByPath.set(file.sourcePath, source.questionBank); candidateByPath.set(file.sourcePath, candidate.questionBank);
    if (source.questionBank.length !== candidate.questionBank.length) errors.push(`BANK_COUNT:${file.sourcePath}`);
    if (JSON.stringify(source.questionBank.map(q => q.id)) !== JSON.stringify(candidate.questionBank.map(q => q.id))) errors.push(`BANK_ORDER:${file.sourcePath}`);
  }
  const allowedContentAnswerDrift = new Set(REPAIRS.repairedRows.filter(row => row.fields.some(field => ['content', 'choices', 'answer'].includes(field))).map(row => qkey(row.sourceJsPath, row.id)));
  const actualContentAnswerDrift = [];
  for (const [sourcePath, source] of sourceByPath) {
    const candidate = candidateByPath.get(sourcePath);
    for (let i = 0; i < source.length; i += 1) {
      if (protectedSource(source[i]) !== protectedSource(candidate[i])) actualContentAnswerDrift.push(qkey(sourcePath, source[i].id));
    }
  }
  if (JSON.stringify([...actualContentAnswerDrift].sort()) !== JSON.stringify([...allowedContentAnswerDrift].sort())) errors.push('UNAUTHORIZED_CONTENT_CHOICES_ANSWER_DRIFT');
  const inventoryKeys = new Set(inventory.map(item => qkey(item.sourceJsPath, item.id)));
  for (const row of MANIFEST.rows) {
    const candidate = candidateByPath.get(row.questionUid.split('|')[0])?.find(q => Number(q.id) === Number(row.questionUid.split('|').at(-1)));
    const visual = VISUALS.rows.find(item => item.questionUid === row.questionUid);
    if (!inventoryKeys.has(qkey(row.questionUid.split('|')[0], row.questionUid.split('|').at(-1)))) errors.push(`OUTSIDE_INVENTORY:${row.questionUid}`);
    if (!candidate || candidate.solutionImage !== row.assetPath) errors.push(`VISUAL_BINDING:${row.questionUid}`);
    if (!visual || !fs.existsSync(path.join(ROOT, visual.assetPath)) || sha(fs.readFileSync(path.join(ROOT, visual.assetPath))) !== visual.assetSha256) errors.push(`ASSET_HASH:${row.questionUid}`);
  }
  const visualCount = [...candidateByPath.values()].flat().filter(q => q.solutionImage).length;
  const newVisualCount = MANIFEST.rows.length;
  const output = { schemaVersion: 'HS_QUADRATIC_APPROVED_CANDIDATE_BANK_VALIDATION_R9', status: errors.length ? 'CANDIDATE_BANK_VALIDATION_FAIL' : 'CANDIDATE_BANK_VALIDATED_NO_PASS', productionAuthorized: false, inventoryTargetCount: inventory.length, candidateFilesLoaded: candidateByPath.size, candidateBankQuestionCount: [...candidateByPath.values()].reduce((sum, bank) => sum + bank.length, 0), sourceCorrectedQuestionCount: REPAIRS.scope.repairedQuestionCount, expectedNewVisualCount: VISUALS.rows.length, newlyAttachedVisualCount: newVisualCount, candidateVisualCountIncludingInheritedSourceAndPriorCandidates: visualCount, actualContentChoicesAnswerDrift: actualContentAnswerDrift, errors, note: 'Candidate-r9 bank structure, scope, approved source field drift, and five new visual bindings were checked. The total visual count includes inherited source/candidate visual fields and is not used as a gate. This does not close provider-attested current pipeline or final production audit.' };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, inventoryTargetCount: output.inventoryTargetCount, candidateFilesLoaded: output.candidateFilesLoaded, candidateBankQuestionCount: output.candidateBankQuestionCount, candidateVisualCount: output.candidateVisualCount, errors: errors.length }, null, 2));
}
main();
