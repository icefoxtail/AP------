import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../../../..');
const sourcePath = path.join(
  repoRoot,
  'docs',
  'rules',
  '01_CANONICAL',
  'taxonomy',
  'rpm-primary-v1.0',
  '00_POLICY',
  'CANONICAL_MASTER.json'
);
const outputPath = path.join(
  repoRoot,
  'apmath',
  'worker-backup',
  'worker',
  'helpers',
  'class-progress-taxonomy.js'
);

function courseLabel(record) {
  if (record.level === 'middle') {
    const match = String(record.scope || '').match(/^M([1-3])-(1|2)$/);
    if (match) return `중${match[1]} 과정 · ${match[2]}학기`;
  }
  return String(record.scope || '').replaceAll('_', ' ');
}

function gradeKey(record) {
  if (record.level === 'middle') {
    const match = String(record.scope || '').match(/^M([1-3])-/);
    return match ? `중${match[1]}` : '';
  }

  const currentHighCourseGrades = {
    공통수학1: '고1',
    공통수학2: '고1',
    대수: '고2',
    미적분I: '고2',
    미적분II: '고3',
    확률과통계: '고2',
    기하: '고2'
  };
  const legacyHighCourseGrades = {
    수학_상: '고1',
    수학_하: '고1',
    수학I: '고2',
    수학II: '고2',
    미적분: '고3',
    확률과통계: '고3',
    기하: '고3'
  };
  const source = record.curriculum === '2022' ? currentHighCourseGrades : legacyHighCourseGrades;
  return source[String(record.scope || '')] || '';
}

function encodePathPart(value) {
  return encodeURIComponent(String(value || '').trim());
}

function buildProjection() {
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const seen = new Map();
  const records = [];

  for (const record of source.records || []) {
    if (!record || record.defaultSelectable === false) continue;

    const curriculumKey = String(record.curriculum || '').trim();
    const level = String(record.level || '').trim();
    const courseKey = String(record.scope || '').trim();
    const l1 = String(record.majorUnit || '').trim();
    const l2 = String(record.midUnit || '').trim();
    if (!curriculumKey || !level || !courseKey || !l1 || !l2) continue;

    const canonicalPathKey = [curriculumKey, level, courseKey, l1, l2]
      .map(encodePathPart)
      .join('/');
    const key = canonicalPathKey;
    if (seen.has(key)) {
      throw new Error(`duplicate canonical classroom progress path: ${key}`);
    }
    seen.set(key, true);
    records.push({
      curriculumKey,
      level,
      courseKey,
      courseLabel: courseLabel(record),
      gradeKey: gradeKey(record),
      canonicalPathKey,
      l1,
      l2,
      label: `${l1} · ${l2}`
    });
  }

  return {
    sourceVersion: String(source.authorityVersion || source.schemaVersion || ''),
    records
  };
}

function renderModule(projection) {
  return [
    '// GENERATED FILE. Do not edit manually.',
    '// Source: docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
    `// Source authority: ${projection.sourceVersion}`,
    '',
    `export const CLASS_PROGRESS_TAXONOMY_VERSION = ${JSON.stringify(projection.sourceVersion)};`,
    `export const CLASS_PROGRESS_TAXONOMY = ${JSON.stringify(projection.records, null, 2)};`,
    ''
  ].join('\n');
}

const rendered = renderModule(buildProjection());
const checkOnly = process.argv.includes('--check');
if (checkOnly) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
  if (current !== rendered) {
    console.error(`classroom progress taxonomy projection is stale: ${path.relative(repoRoot, outputPath)}`);
    process.exitCode = 1;
  }
} else {
  fs.writeFileSync(outputPath, rendered, 'utf8');
  console.log(`wrote ${path.relative(repoRoot, outputPath)} (${buildProjection().records.length} paths)`);
}
