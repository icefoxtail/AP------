import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoRoot = path.resolve(archiveDir, '..');
const canonicalPath = path.join(repoRoot, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const outputPath = path.join(outputDir, 'source_manifest.json');

const sha256 = value => crypto.createHash('sha256').update(String(value)).digest('hex');
const normalizeFile = value => String(value || '').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '').replace(/^\/+/, '').trim();

function readQuestion(file, ordinal) {
  const fullPath = path.join(archiveDir, 'exams', file);
  if (!fs.existsSync(fullPath)) throw new Error(`SOURCE_NOT_FOUND:${file}`);
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 3000 });
  const questions = context.window.questionBank || context.window.questions;
  if (!Array.isArray(questions) || !questions[Number(ordinal) - 1]) throw new Error(`SOURCE_ORDINAL_NOT_FOUND:${file}#${ordinal}`);
  return questions[Number(ordinal) - 1];
}

function sourceFiles() {
  const root = path.join(archiveDir, 'exams', 'original', 'high', 'h1');
  const files = [];
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile() && entry.name.endsWith('.js')) files.push(fullPath);
    }
  }
  visit(root);
  return files.sort((a, b) => normalizeFile(path.relative(path.join(archiveDir, 'exams'), a)).localeCompare(normalizeFile(path.relative(path.join(archiveDir, 'exams'), b)), 'ko'));
}

function loadQuestions(file) {
  const fullPath = path.join(archiveDir, 'exams', file);
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(fullPath, 'utf8'), context, { filename: fullPath, timeout: 3000 });
  const questions = context.window.questionBank || context.window.questions;
  if (!Array.isArray(questions)) throw new Error(`QUESTION_BANK_MISSING:${file}`);
  return questions;
}

function sourceFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null
  }));
}

function contentFingerprint(question) {
  return sha256(JSON.stringify({
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    image: question?.image ?? null
  }));
}

function curriculumKeyFromRecord(record) {
  const course = String(record?.standardCourse || record?.course || '');
  if (/공통수학/.test(course)) return '2022';
  if (/수학\s*\([상하]\)/.test(course) || /수학_[상하]/.test(course)) return '2015';
  return null;
}

function main() {
  const canonical = JSON.parse(fs.readFileSync(canonicalPath, 'utf8'));
  if (canonical.authorityStatus !== 'LOCKED' || canonical.authorityVersion !== 'RPM_PRIMARY_TAXONOMY_v1.0') throw new Error('CANONICAL_NOT_LOCKED');
  const raw = [];
  for (const fullPath of sourceFiles()) {
    const sourceArchiveFile = normalizeFile(path.relative(path.join(archiveDir, 'exams'), fullPath));
    const questions = loadQuestions(sourceArchiveFile);
    questions.forEach((question, index) => raw.push({ sourceArchiveFile, sourceOrdinal: index + 1, question }));
  }
  if (raw.length !== 2498) throw new Error(`RAW_HIGH1_SOURCE_COUNT_MISMATCH:${raw.length}`);
  const keys = raw.map(record => `${normalizeFile(record.sourceArchiveFile)}#${Number(record.sourceOrdinal)}`);
  const uniqueKeys = new Set(keys);
  if (uniqueKeys.size !== raw.length) throw new Error(`TARGET_SOURCE_KEY_DUPLICATE:${raw.length - uniqueKeys.size}`);
  const records = raw.map(record => {
    const sourceArchiveFile = normalizeFile(record.sourceArchiveFile);
    const sourceOrdinal = Number(record.sourceOrdinal);
    const question = record.question;
    return {
      manifestUid: `h1-direct-${sha256(`${sourceArchiveFile}#${sourceOrdinal}`).slice(0, 32)}`,
      sourceArchiveFile,
      sourceOrdinal,
      curriculumKey: curriculumKeyFromRecord(question),
      content: question.content ?? '',
      choices: Array.isArray(question.choices) ? question.choices : [],
      answer: question.answer ?? null,
      solution: question.solution ?? '',
      image: question.image ?? '',
      solutionImage: question.solutionImage ?? '',
      sourceFingerprint: sourceFingerprint(question),
      contentFingerprint: contentFingerprint(question)
    };
  });
  const cohortCounts = records.reduce((counts, record) => {
    counts[record.curriculumKey] = (counts[record.curriculumKey] || 0) + 1;
    return counts;
  }, {});
  const manifest = {
    schemaVersion: 'metadata-foundation-h1-direct-tagging-source-manifest-v1',
    scope: 'HIGH1_ONLY',
    sourceOnly: true,
    semanticDecisionFieldsExcluded: ['level', 'category', 'standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'L1', 'L2', 'L3', 'L4', 'difficultyBucket', 'previousReview', 'queueCandidateContext'],
    canonicalAuthority: {
      path: 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
      sha256: sha256(fs.readFileSync(canonicalPath, 'utf8')),
      authorityStatus: canonical.authorityStatus,
      authorityVersion: canonical.authorityVersion
    },
    rawDenominator: records.length,
    uniqueSourceKeys: uniqueKeys.size,
    cohortCounts,
    records
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(repoRoot, outputPath).replaceAll('\\', '/'), rawDenominator: manifest.rawDenominator, uniqueSourceKeys: manifest.uniqueSourceKeys, cohortCounts, sourceOnly: true }, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
