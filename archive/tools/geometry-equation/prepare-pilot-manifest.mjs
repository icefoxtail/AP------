import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const manifest = JSON.parse(fs.readFileSync(path.join(REPORTS, 'geometry_equation_manifest.json'), 'utf8'));

const buckets = new Map();
for (const row of manifest.rows) {
  const key = `${row.curriculumVersion}|${row.standardUnitKey}|${row.mappedUnitKey}`;
  if (!buckets.has(key)) buckets.set(key, []);
  buckets.get(key).push(row);
}

const selected = [];
for (const [bucket, rows] of [...buckets.entries()].sort()) {
  rows.sort((a, b) => `${a.sourceJsPath}:${String(a.id).padStart(4, '0')}`.localeCompare(`${b.sourceJsPath}:${String(b.id).padStart(4, '0')}`));
  const picks = rows.length <= 2 ? rows : [rows[0], rows.at(-1)];
  for (const row of picks) selected.push({ ...row, pilotBucket: bucket, pilotSelection: rows.length <= 2 ? 'ALL' : 'FIRST_LAST' });
}

const headers = ['pilotBucket', 'questionUid', 'qKey', 'sourceJsPath', 'id', 'standardUnitKey', 'mappedUnitKey', 'subUnitKey', 'visualRequirement', 'pilotSelection'];
const escape = (value) => {
  const text = value === null || value === undefined ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};
const csv = [headers.join(',')];
for (const row of selected) csv.push(headers.map((key) => escape(row[key])).join(','));
fs.writeFileSync(path.join(REPORTS, 'pilot_sample_manifest.csv'), `${csv.join('\n')}\n`, 'utf8');
fs.writeFileSync(path.join(REPORTS, 'pilot_sample_manifest.json'), JSON.stringify({ protocol: manifest.protocol, manifestSha: manifest.manifestSha || null, pilotMaxPerBucket: 2, sampleCount: selected.length, rows: selected }, null, 2) + '\n', 'utf8');

const summary = [...buckets.entries()].sort().map(([bucket, rows]) => ({ bucket, targetCount: rows.length, selectedCount: Math.min(2, rows.length), selectedQuestionUids: selected.filter((row) => row.pilotBucket === bucket).map((row) => row.questionUid) }));
fs.writeFileSync(path.join(REPORTS, 'pilot_sample_manifest.md'), [
  '# PILOT SYSTEM GATE 표본 manifest\n\n',
  `- 상태: \`PILOT_READY\`\n- 전체 target: ${manifest.rows.length}\n- 표본: ${selected.length}\n- bucket 수: ${summary.length}\n\n`,
  '| bucket | 전체 | 표본 | 문항 UID |\n|---|---:|---:|---|\n',
  ...summary.map((row) => `| ${row.bucket} | ${row.targetCount} | ${row.selectedCount} | ${row.selectedQuestionUids.join('<br>')} |\n`),
].join(''), 'utf8');
console.log(JSON.stringify({ status: 'PILOT_READY', sampleCount: selected.length, bucketCount: summary.length }, null, 2));
