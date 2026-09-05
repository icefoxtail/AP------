import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const SOURCE_REPORT = path.join(ROOT, 'docs', 'reports', 'high1-svg-exhaustive-20260905');
const REPORT = path.join(SOURCE_REPORT, 'unit-01-circle');
const KEYS = new Set(['H15-SA-11', 'H22-C2-03']);
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const rel = (filePath) => path.relative(ROOT, filePath).split(path.sep).join('/');
const runGit = (args) => { try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return ''; } };
function writeJson(name, value) { fs.writeFileSync(path.join(REPORT, name), `${JSON.stringify(value, null, 2)}\n`, 'utf8'); }
function csvEscape(value) { const text = Array.isArray(value) ? value.join('|') : value == null ? '' : String(value); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function writeCsv(name, rows) { const keys = Object.keys(rows[0] || {}); const lines = [keys.join(',')]; for (const row of rows) lines.push(keys.map((key) => csvEscape(row[key])).join(',')); fs.writeFileSync(path.join(REPORT, name), `${lines.join('\n')}\n`, 'utf8'); }

fs.mkdirSync(REPORT, { recursive: true });
const internal = JSON.parse(fs.readFileSync(path.join(SOURCE_REPORT, 'inventory_internal.json'), 'utf8'));
const rows = internal.allRows.filter((row) => KEYS.has(row.standardUnitKey));
const assetPaths = new Set(rows.flatMap((row) => row.assetRefs.filter((asset) => asset.exists && asset.resolvedPath.endsWith('.svg')).map((asset) => asset.resolvedPath)));
const assets = internal.assets.filter((asset) => assetPaths.has(asset.assetPath));
const sourcePaths = [...new Set(rows.map((row) => row.sourceJsPath))].sort();
const changed = runGit(['status', '--porcelain=v1']).split(/\r?\n/).filter(Boolean).map((line) => line.slice(3).replace(/^"|"$/g, ''));
const circleChanges = changed.filter((item) => sourcePaths.includes(item) || assetPaths.has(item));
const unitByKey = Object.fromEntries([...KEYS].map((key) => [key, { total: rows.filter((row) => row.standardUnitKey === key).length, existingSvg: rows.filter((row) => row.standardUnitKey === key && row.existingSvgStatus !== 'NONE').length }]));
const baseline = {
  generatedAtKst: '2026-09-05',
  phase: 'unit-01-circle',
  keys: [...KEYS],
  branch: runGit(['branch', '--show-current']),
  headSha: runGit(['rev-parse', 'HEAD']),
  originMainSha: runGit(['rev-parse', 'origin/main']),
  sourceFileCount: sourcePaths.length,
  questionCount: rows.length,
  uniqueSvgAssetCount: assets.length,
  unitByKey,
  protectedDiffCount: circleChanges.length,
  protectedDiffPaths: circleChanges,
  note: 'Other worktree changes are outside this phase scope and are preserved. No circle production file was changed during phase intake.',
};
writeJson('00_unit_baseline.json', baseline);
writeCsv('01_unit_inventory.csv', rows);
writeCsv('02_unit_svg_manifest.csv', assets.map((asset) => ({ assetPath: asset.assetPath, assetSha256: asset.assetSha256, byteCount: asset.byteCount, viewBox: asset.viewBox, preserveAspectRatio: asset.preserveAspectRatio, primitiveCounts: JSON.stringify(asset.counts), staticXmlStatus: asset.staticXmlStatus, forbiddenNodes: asset.forbiddenNodes, observedFactHash: asset.observedFactHash })));
writeCsv('03_unit_render_matrix.csv', sourcePaths.map((sourceJsPath) => ({ sourceJsPath, questionCount: rows.filter((row) => row.sourceJsPath === sourceJsPath).length, targetQuestionUids: rows.filter((row) => row.sourceJsPath === sourceJsPath).map((row) => row.questionUid), exam: 'NOT_TESTED', solution: 'NOT_TESTED', answer: 'NOT_TESTED', renderStatus: 'NOT_TESTED' })));
fs.writeFileSync(path.join(REPORT, '04_unit_findings.jsonl'), '', 'utf8');
fs.writeFileSync(path.join(REPORT, 'FINAL_REPORT.md'), [
  '# Unit 01 — 원의 방정식 전수 검수', '',
  '- 상태: `IN_PROGRESS`',
  `- 대상 key: ${[...KEYS].join(', ')}`,
  `- 원본 문항: **${rows.length}**`,
  `- 기존 unique SVG: **${assets.length}**`,
  `- source files: **${sourcePaths.length}**`,
  `- circle-scope protected diff: **${circleChanges.length}**`,
  '',
  '## 순서', '',
  '1. source-only 5문항 batch 전체 검토',
  '2. answer/solution 독립 parity',
  '3. 140개 SVG 실제 primitive·수학 사실 검수',
  '4. 영향 시험지 exam/solution/answer 렌더',
  '5. finding ledger 동결·핀포인트 수정·단원 보고',
  '',
  '아직 최종 PASS/SEALED를 선언하지 않는다.', '',
].join('\n'), 'utf8');
console.log(JSON.stringify({ phase: baseline.phase, questionCount: rows.length, uniqueSvgAssetCount: assets.length, sourceFileCount: sourcePaths.length, protectedDiffCount: circleChanges.length, status: 'UNIT_INTAKE_FROZEN' }, null, 2));
