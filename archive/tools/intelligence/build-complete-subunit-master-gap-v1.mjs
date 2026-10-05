import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const qaPath = path.join(outputDir, 'archive-complete-subunit-operational-qa-v1.json');
const classificationPath = path.join(outputDir, 'archive-complete-subunit-classification-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputPath = path.join(outputDir, 'archive-complete-subunit-master-gap-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function locateKey(records, key) {
  return records
    .filter(record => record.classification?.subUnitKey === key)
    .map(record => {
      const filePath = path.join(archiveDir, 'exams', record.sourceArchiveFile);
      const context = { window: {}, console };
      vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), context, { timeout: 2000, filename: record.sourceArchiveFile });
      const question = context.window.questionBank?.[record.sourceOrdinal - 1] || {};
      return {
        sourceArchiveFile: record.sourceArchiveFile,
        sourceOrdinal: record.sourceOrdinal,
        questionUid: record.questionUid,
        standardUnitKey: question.standardUnitKey || record.standardUnitKey || '',
        standardUnit: question.standardUnit || record.standardUnit || '',
        subUnit: question.subUnit || record.classification.subUnit || ''
      };
    });
}

export function buildCompleteSubunitMasterGapV1() {
  const qa = JSON.parse(fs.readFileSync(qaPath, 'utf8'));
  const classification = JSON.parse(fs.readFileSync(classificationPath, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const masterKeys = new Set(master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active').map(item => item.key));
  const rawKeys = qa.masterGaps.rawOrUnmapped;
  const invalidFormalKeys = qa.masterGaps.invalidFormal;
  const rawCounts = Object.fromEntries(rawKeys.map(key => [key, classification.records.filter(record => record.classification?.subUnitKey === key).length]));
  const invalidFormal = invalidFormalKeys.map(key => ({
    key,
    occurrences: locateKey(classification.records, key),
    masterKeyPresent: masterKeys.has(key),
    action: 'do_not_register',
    reason: '부모 standardUnitKey가 현재 master의 활성 표준단원 키가 아닌 legacy 값이므로 세부단원 master에 등록하지 않는다.',
    reReviewWhen: '해당 문항의 standardUnitKey를 H22-A-02 등 정식 표준단원 키로 canonicalize한 뒤 재분류'
  }));
  const stable = {
    schemaVersion: 'archive-complete-subunit-master-gap-v1',
    generatedAt: new Date().toISOString(),
    sourceQaDigest: qa.digest,
    sourceClassificationDigest: classification.digest,
    masterSubUnitCount: masterKeys.size,
    formalMasterAdditions: [],
    invalidFormal,
    rawOrUnmapped: { count: rawKeys.length, keys: rawKeys, occurrences: rawCounts, action: rawKeys.length === 0 ? 'closed' : 'retain_as_exception' }
  };
  return { ...stable, digest: sha256(JSON.stringify(stable)) };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildCompleteSubunitMasterGapV1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, formalMasterAdditions: report.formalMasterAdditions.length, invalidFormal: report.invalidFormal.length, rawOrUnmapped: report.rawOrUnmapped.count }, null, 2));
}
