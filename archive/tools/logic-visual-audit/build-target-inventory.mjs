import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const BASE = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const TARGET_KEYS = new Set(['H15-SB-01', 'H15-SB-02', 'H22-C2-05', 'H22-C2-06']);
const KEYWORD_RE = /집합|명제|조건|진리집합|필요조건|충분조건|대우|역|전칭|존재|반례|증명|여집합|교집합|합집합/;
const internal = JSON.parse(fs.readFileSync(path.join(BASE, 'inventory_internal.json'), 'utf8'));
const cache = new Map();
const loadBank = (sourceJsPath) => {
  if (cache.has(sourceJsPath)) return cache.get(sourceJsPath);
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, sourceJsPath.replaceAll('/', path.sep)), 'utf8'), context, { timeout: 5000 });
  cache.set(sourceJsPath, context.window.questionBank || []);
  return cache.get(sourceJsPath);
};
const rows = internal.allRows.filter((row) => TARGET_KEYS.has(row.standardUnitKey) && row.sourceJsPath.startsWith('archive/exams/original/high/h1/'));
const reverse = [];
const inventory = rows.map((row) => {
  const question = loadBank(row.sourceJsPath).find((item) => Number(item.id) === Number(row.id));
  const signal = row.visualRequirementCandidate === 'SVG_REQUIRED_MISSING' ? 'SHOULD_BE_REQUIRED' : row.visualRequirementCandidate === 'SVG_OPTIONAL' ? 'MAY_BE_OPTIONAL' : 'SHOULD_BE_EXEMPT';
  const sourceOnly = { questionUid: row.questionUid, examId: row.examId, sourceJsPath: row.sourceJsPath, id: row.id, standardUnitKey: row.standardUnitKey, standardUnit: row.standardUnit, subUnitKey: row.subUnitKey, subUnit: row.subUnit, content: question?.content || '', choices: question?.choices || [], problemImageRef: question?.image || '', curriculumBoundary: { curriculumVersion: row.curriculumVersion, standardCourse: row.standardCourse } };
  return { ...sourceOnly, sourceOnlyInputSha: sha256(sourceOnly), expectedVisualRequirementSignal: signal, visualTriageStatus: 'PENDING_INDEPENDENT_V1' };
});
for (const row of internal.allRows.filter((item) => item.sourceJsPath.startsWith('archive/exams/original/high/h1/') && !TARGET_KEYS.has(item.standardUnitKey))) {
  const q = loadBank(row.sourceJsPath).find((item) => Number(item.id) === Number(row.id));
  const text = `${q?.content || ''} ${(q?.choices || []).join(' ')}`;
  if (KEYWORD_RE.test(text)) reverse.push({ questionUid: row.questionUid, sourceJsPath: row.sourceJsPath, id: row.id, standardUnitKey: row.standardUnitKey, contentPreview: text.slice(0, 300), reverseScanStatus: 'SCOPE_CANDIDATE_REVIEW_REQUIRED' });
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'target_inventory.json'), JSON.stringify({ generatedAtKst: '2026-09-05', targetKeys: [...TARGET_KEYS], finalTargetCount: inventory.length, finalTargetUidSetSha: sha256(inventory.map((row) => row.questionUid).sort()), rows: inventory }, null, 2) + '\n', 'utf8');
fs.writeFileSync(path.join(OUT, 'reverse_scan_candidates.jsonl'), reverse.map((row) => JSON.stringify(row)).join('\n') + (reverse.length ? '\n' : ''), 'utf8');
fs.writeFileSync(path.join(OUT, 'target_inventory_summary.json'), JSON.stringify({ generatedAtKst: '2026-09-05', finalTargetCount: inventory.length, targetSourceFiles: new Set(inventory.map((row) => row.sourceJsPath)).size, v1TriageCoverageCount: inventory.length, reverseScanCandidateCount: reverse.length, v1TriageCoverage: 1, status: 'V1_SOURCE_ONLY_BUNDLE_READY' }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ finalTargetCount: inventory.length, sourceFiles: new Set(inventory.map((row) => row.sourceJsPath)).size, reverseScanCandidates: reverse.length, v1TriageCoverage: 1 }, null, 2));
