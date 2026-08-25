import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanExamBank } from '../tag-enrichment/scripts/scan-exam-bank.mjs';
import { classifyItem, indexes } from './classify-pilot-hierarchical-v1.mjs';

/**
 * Rebuild the phase-2 source classification against the current operational
 * archive.  The frozen 16:00 pilot exclusions are historical evidence only;
 * this current baseline intentionally includes every DB/index-tracked file.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase2/archive-classification');
const outputPath = path.join(outputDir, 'archive-hierarchical-classification-v1.json');
const summaryPath = path.join(outputDir, 'archive-hierarchical-classification-v1.summary.md');
const frozenBackupPath = path.join(outputDir, 'archive-hierarchical-classification-frozen-20260822.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const rulesPath = path.join(archiveDir, 'tools/tag-enrichment/data/pattern-rules.seed.json');
const identityPath = path.join(archiveDir, 'data/question_identity_map.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function normalizeSourceFile(value) {
  return String(value || '').replace(/^archive\/exams\//, '').replaceAll('\\', '/');
}

function countBy(records, field) {
  const counts = {};
  for (const record of records) counts[record[field]] = (counts[record[field]] || 0) + 1;
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en')));
}

function buildRecords(inventory, identityMap, master, rules) {
  const identityByKey = new Map(identityMap.records.map(record => [`${record.sourceArchiveFile}#${record.sourceOrdinal}`, record]));
  const index = indexes(master);
  const records = [];
  const failures = [];
  for (const file of inventory.files) {
    const sourceArchiveFile = normalizeSourceFile(file.sourceFile);
    for (const question of file.questions) {
      const sourceOrdinal = question.originalIndex + 1;
      const identity = identityByKey.get(`${sourceArchiveFile}#${sourceOrdinal}`);
      if (!identity) {
        failures.push({ sourceArchiveFile, sourceOrdinal, reason: 'canonical identity missing' });
        continue;
      }
      const item = {
        questionUid: identity.questionUid,
        sourceArchiveFile,
        sourceOrdinal,
        existingMetadata: {
          standardUnitKey: question.standardUnitKey,
          standardUnit: question.standardUnit,
          standardCourse: question.standardCourse,
          difficultyBucket: question.level
        },
        sourceContext: {
          content: question.content,
          choices: question.choices,
          answer: question.answer,
          solution: question.solution,
          image: question.image
        }
      };
      records.push({
        questionUid: identity.questionUid,
        sourceArchiveFile,
        sourceOrdinal,
        standardUnitKey: question.standardUnitKey,
        standardUnit: question.standardUnit,
        classification: classifyItem(item, index, rules)
      });
    }
  }
  return { records, failures };
}

function summaryMarkdown(report) {
  const depthRows = Object.entries(report.totals.classificationDepth).map(([key, value]) => `| ${key} | ${value} |`).join('\n');
  return `# Current Operational Archive Hierarchical Classification v1\n\n- 기준: current operational JS, 2026-08-24\n- 세부단원 분류 파일: ${report.totals.scannedFiles}\n- 분류 문항: ${report.totals.classifiedRecords}\n- 제외 파일: ${report.totals.excludedRecords}\n- identity 실패: ${report.totals.identityFailures}\n\n| Classification depth | Count |\n|---|---:|\n${depthRows}\n\n이 스냅샷은 frozen 16:00 pilot exclusion을 적용하지 않고 현재 운영 파일 전체를 기준으로 재생성했다. production JS 반영은 complete-subunit apply 단계에서 별도로 통제한다.\n`;
}

export function rebaselineCurrentArchiveClassificationV1() {
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf8')).rules;
  const identityMap = JSON.parse(fs.readFileSync(identityPath, 'utf8'));
  const inventory = scanExamBank();
  const built = buildRecords(inventory, identityMap, master, rules);
  const stable = {
    schemaVersion: 'archive-hierarchical-classification-v1',
    baseline: 'current_operational_js_2026-08-24',
    sourceCommit: identityMap.sourceCommit,
    identityDigest: identityMap.identityDigest,
    masterDigest: sha256(JSON.stringify(master)),
    productionWriteAllowed: false,
    excludedSourceArchiveFiles: [],
    totals: {
      scannedFiles: inventory.files.length,
      scannedQuestions: identityMap.records.length,
      classifiedRecords: built.records.length,
      excludedRecords: identityMap.records.length - built.records.length,
      identityFailures: built.failures.length,
      recommendationEligible: built.records.filter(record => record.classification.recommendationEligible).length,
      classificationDepth: countBy(built.records.map(record => ({ classificationDepth: record.classification.classificationDepth })), 'classificationDepth'),
      confidence: countBy(built.records.map(record => ({ confidence: record.classification.confidence })), 'confidence')
    },
    failures: built.failures,
    outOfScopeFiles: [],
    records: built.records
  };
  if (stable.totals.scannedFiles !== 438 || stable.totals.scannedQuestions !== 10690 || stable.totals.classifiedRecords !== 10690) {
    throw new Error(`current baseline total mismatch: ${JSON.stringify(stable.totals)}`);
  }
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = rebaselineCurrentArchiveClassificationV1();
  fs.mkdirSync(outputDir, { recursive: true });
  if (fs.existsSync(outputPath) && !fs.existsSync(frozenBackupPath)) fs.copyFileSync(outputPath, frozenBackupPath);
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  fs.writeFileSync(summaryPath, summaryMarkdown(report), 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), backup: fs.existsSync(frozenBackupPath) ? path.relative(archiveDir, frozenBackupPath).replaceAll('\\', '/') : null, digest: report.digest, totals: report.totals }, null, 2));
}
