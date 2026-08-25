import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const repoDir = path.resolve(archiveDir, '..');
const taxonomyPath = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-taxonomy-v1.json');
const classificationPath = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-classification-v1.json');
const masterDocPath = path.join(repoDir, 'docs/rules/JS아카이브_표준단원키_마스터테이블.md');
const reportPath = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification/archive-complete-subunit-master-registration-v1.json');
const marker = '## 자동 분류 taxonomy 정식 확장 (v1)';
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function conceptBySubUnit(classification) {
  const map = new Map();
  for (const record of classification.records) {
    const key = record.classification?.subUnitKey;
    if (key && !map.has(key)) map.set(key, record.classification.conceptClusterKey || '');
  }
  return map;
}

export function registerCompleteSubunitMasterV1() {
  const taxonomy = JSON.parse(fs.readFileSync(taxonomyPath, 'utf8'));
  const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
  const before = fs.readFileSync(masterDocPath, 'utf8');
  if (before.includes(marker)) throw new Error('master registration marker already exists; refusing duplicate append');
  const conceptMap = conceptBySubUnit(classification);
  const formal = taxonomy.definitions
    .filter(definition => definition.standardUnitKey && !/^R?RAW-/.test(definition.key) && !definition.key.startsWith('UNMAPPED-'))
    .filter(definition => !before.includes(`| ${definition.key} |`))
    .map(definition => ({
      standardUnitKey: definition.standardUnitKey,
      subUnitKey: definition.key,
      subUnit: definition.label,
      conceptClusterKey: conceptMap.get(definition.key) || definition.key.replaceAll('-', '_').toUpperCase()
    }))
    .sort((a, b) => a.subUnitKey.localeCompare(b.subUnitKey, 'en'));
  const usedKeys = new Set(classification.records.map(record => record.classification?.subUnitKey).filter(Boolean));
  const rows = formal.map(row => `| ${row.standardUnitKey} | ${row.subUnitKey} | ${row.subUnit.replaceAll('|', '\\|')} | ${row.conceptClusterKey} |`).join('\n');
  const section = [
    '',
    marker,
    '',
    '> 전체 분류본 v1에서 실제 사용된 정식 세부단원 키 중 기존 문서에 없던 항목을 자동 등록한 확장부다. RAW/UNMAPPED 키는 정식 master에 편입하지 않고 별도 예외로 관리한다.',
    '',
    '| standardUnitKey | subUnitKey | subUnit | conceptClusterKey |',
    '|---|---|---|---|',
    rows,
    ''
  ].join('\n');
  const after = `${before.replace(/\s*$/, '')}\n${section}`;
  fs.writeFileSync(masterDocPath, after, 'utf8');
  const report = {
    schemaVersion: 'archive-complete-subunit-master-registration-v1',
    generatedAt: new Date().toISOString(),
    sourceTaxonomyDigest: taxonomy.digest,
    sourceClassificationDigest: classification.digest,
    masterDocument: path.relative(repoDir, masterDocPath).replaceAll('\\', '/'),
    productionWriteAllowed: true,
    totals: {
      taxonomyDefinitions: taxonomy.definitions.length,
      formalDefinitionsRegistered: formal.length,
      formalDefinitionsActuallyUsed: [...usedKeys].filter(key => !/^R?RAW-|^UNMAPPED-/.test(key)).length,
      rawDefinitionsExcluded: taxonomy.definitions.filter(d => /^R?RAW-/.test(d.key)).length,
      unmappedDefinitionsExcluded: taxonomy.definitions.filter(d => d.key.startsWith('UNMAPPED-')).length
    },
    digest: sha256(after),
    registered: formal
  };
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return report;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = registerCompleteSubunitMasterV1();
  console.log(JSON.stringify({ output: path.relative(archiveDir, reportPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}
