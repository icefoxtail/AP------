import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '59_clean_candidate_bank_manifest_r10.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '60_clean_candidate_bank_validation_r10.json');
function load(relative) { const context = { window: {} }; vm.createContext(context); vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 }); return JSON.parse(JSON.stringify(context.window)); }
function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }
function key(sourcePath, id) { return `${sourcePath}|${id}`; }
const errors = []; const candidateByPath = new Map(); const sourceByPath = new Map();
for (const file of MANIFEST.candidateFiles) { const source = load(file.sourcePath); const candidate = load(file.candidatePath); sourceByPath.set(file.sourcePath, source.questionBank); candidateByPath.set(file.sourcePath, candidate.questionBank); if (source.questionBank.length !== candidate.questionBank.length) errors.push(`COUNT:${file.sourcePath}`); if (JSON.stringify(source.questionBank.map(q => q.id)) !== JSON.stringify(candidate.questionBank.map(q => q.id))) errors.push(`ORDER:${file.sourcePath}`); }
const expectedVisualKeys = new Set(MANIFEST.rows.map(row => key(row.sourceJsPath, row.id))); const actualVisualRows = [];
for (const [sourcePath, source] of sourceByPath) { const candidate = candidateByPath.get(sourcePath); for (let i = 0; i < source.length; i += 1) { const sourceQ = source[i]; const candidateQ = candidate[i]; const itemKey = key(sourcePath, sourceQ.id); const contentAnswerSame = ['content', 'choices', 'answer'].every(field => JSON.stringify(sourceQ[field] ?? null) === JSON.stringify(candidateQ[field] ?? null)); if (!contentAnswerSame) errors.push(`CONTENT_CHOICES_ANSWER_DRIFT:${itemKey}`); if (candidateQ.solutionImage) actualVisualRows.push({ key: itemKey, asset: candidateQ.solutionImage }); } }
if (actualVisualRows.length !== MANIFEST.visualBindingCount) errors.push(`VISUAL_COUNT:${actualVisualRows.length}`);
if (new Set(actualVisualRows.map(row => row.key)).size !== actualVisualRows.length) errors.push('DUPLICATE_VISUAL_KEY');
for (const row of actualVisualRows) if (!expectedVisualKeys.has(row.key)) errors.push(`UNDECLARED_VISUAL:${row.key}`);
for (const row of MANIFEST.rows) { const candidate = candidateByPath.get(row.sourceJsPath)?.find(q => Number(q.id) === row.id); const asset = path.join(ROOT, row.assetPath); if (!candidate || candidate.solutionImage !== row.assetPath) errors.push(`BINDING:${row.questionUid}`); if (!fs.existsSync(asset)) errors.push(`MISSING_ASSET:${row.assetPath}`); }
const output = { schemaVersion: 'HS_QUADRATIC_CLEAN_CANDIDATE_BANK_VALIDATION_R10', status: errors.length ? 'CLEAN_CANDIDATE_BANK_VALIDATION_FAIL' : 'CLEAN_CANDIDATE_BANK_VALIDATED_NO_PASS', productionAuthorized: false, sourceFileCount: candidateByPath.size, candidateBankQuestionCount: [...candidateByPath.values()].reduce((sum, bank) => sum + bank.length, 0), candidateVisualCount: actualVisualRows.length, declaredVisualCount: MANIFEST.visualBindingCount, undeclaredVisualCount: errors.filter(error => error.startsWith('UNDECLARED_VISUAL')).length, errors, candidateFileHashes: MANIFEST.candidateFiles.map(file => ({ candidatePath: file.candidatePath, sha256: sha(fs.readFileSync(path.join(ROOT, file.candidatePath))) })), note: 'Clean r10 candidate bank starts from the repaired current source and contains only explicitly declared prior/new candidate solution and visual changes. No final production PASS is claimed.' };
fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8'); console.log(JSON.stringify({ status: output.status, sourceFileCount: output.sourceFileCount, candidateBankQuestionCount: output.candidateBankQuestionCount, candidateVisualCount: output.candidateVisualCount, errors: errors.length }, null, 2));
