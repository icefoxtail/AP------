import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const sourcePath = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue/archive-subunit-review-batch-001-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/coverage-queue');
const outputPath = path.join(outputDir, 'archive-subunit-coverage-batch-001-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalize = value => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\\[a-zA-Z]+/g, ' ').replace(/\s+/g, ' ').trim();
const aliases = {
  'RAW-피타고라스': 'M2-07-PYTHAGOREAN_APPLICATION',
  'RAW-피타고라스정리': 'M2-07-PYTHAGOREAN_THEOREM',
  'RAW-피타고라스정리활용': 'M2-07-PYTHAGOREAN_APPLICATION'
};
const extraCues = {
  'M2-01-EXPONENT_LAW': ['지수', '거듭제곱', '밑', '지수법칙'],
  'M3-03-QUADRATIC_EQUATION': ['이차방정식', '근', '인수분해', '판별식', '완전제곱'],
  'M2-07-PYTHAGOREAN_THEOREM': ['직각삼각형', '피타고라스', '빗변'],
  'M2-07-PYTHAGOREAN_APPLICATION': ['피타고라스', '초승달', '정사각형', '넓이'],
  'M2-08-PROBABILITY_BASIC': ['확률', '사건', '표본공간'],
  'M2-08-PROBABILITY_COUNTING': ['경우의 수', '경우', '순열', '조합']
};
const hits = (text, cues) => { const normalized = normalize(text); return cues.filter(cue => normalized.includes(cue)); };

export function adjudicateSubunitCoverageBatch001V1() {
  const packet = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const active = new Map(master.filter(item => item.keyType === 'subUnitKey' && item.status === 'active').map(item => [item.subUnitKey, item]));
  const records = packet.records.map(record => {
    const suggested = record.suggestedSubUnitKey || aliases[record.standardUnitKey] || '';
    const candidate = active.get(suggested);
    const content = `${record.source?.content ?? ''} ${(record.source?.choices ?? []).join(' ')}`;
    const solution = record.source?.solution ?? '';
    const cues = candidate ? [...new Set([candidate.subUnit, ...(extraCues[suggested] ?? [])])] : [];
    const contentCueHits = hits(content, cues);
    const solutionCueHits = hits(solution, cues);
    const independentSupport = Boolean(candidate && contentCueHits.length > 0 && solutionCueHits.length > 0);
    const status = independentSupport ? 'PILOT_CANDIDATE' : suggested && !candidate ? 'STANDARD_UNIT_FALLBACK' : 'PILOT_REVIEW_REQUIRED';
    return {
      reviewOrder: record.reviewOrder,
      questionUid: record.questionUid,
      sourceArchiveFile: record.sourceArchiveFile,
      sourceOrdinal: record.sourceOrdinal,
      standardUnitKey: record.standardUnitKey,
      standardUnit: record.standardUnit,
      semanticStatus: record.semanticStatus,
      proposedSubUnitKey: candidate?.subUnitKey ?? '',
      proposedSubUnit: candidate?.subUnit ?? '',
      contentCueHits,
      solutionCueHits,
      independentSupport,
      disposition: status,
      productionUsable: false,
      rationale: independentSupport
        ? '본문과 해설 모두에서 기존 master 세부키의 핵심 단서를 확인한 PILOT 후보. 운영 반영 전 추가 샘플·경계 검토 필요.'
        : status === 'STANDARD_UNIT_FALLBACK'
          ? '현재 master에 대응 세부키가 없어 표준단원 fallback 유지.'
          : '본문·해설 양쪽의 기존 세부키 근거가 충분히 일치하지 않아 세부키 확정 보류.'
    };
  });
  const counts = {}; for (const record of records) counts[record.disposition] = (counts[record.disposition] ?? 0) + 1;
  const stable = {
    schemaVersion: 'archive-subunit-coverage-batch-001-adjudication-v1',
    sourceDigest: packet.digest,
    masterDigest: sha256(JSON.stringify(master)),
    productionWriteAllowed: false,
    totals: { records: records.length, disposition: Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b, 'en'))), pilotCandidates: records.filter(record => record.disposition === 'PILOT_CANDIDATE').length, fallbackRecords: records.filter(record => record.disposition === 'STANDARD_UNIT_FALLBACK').length, reviewRequired: records.filter(record => record.disposition === 'PILOT_REVIEW_REQUIRED').length },
    records
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = adjudicateSubunitCoverageBatch001V1();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals }, null, 2));
}
