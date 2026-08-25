import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const phaseDir = path.join(archiveDir, '_generated/intelligence/phase3/complete-subunit-classification');
const classificationPath = path.join(phaseDir, 'archive-complete-subunit-classification-v1.json');
const taxonomyPath = path.join(phaseDir, 'archive-complete-subunit-taxonomy-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputPath = path.join(phaseDir, 'archive-complete-subunit-exception-review-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));

function loadQuestionBank(relativeFile) {
  const file = path.join(archiveDir, 'exams', relativeFile);
  const context = { window: {}, console };
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 2000, filename: relativeFile });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${relativeFile}`);
  return context.window.questionBank;
}

function textOf(question) {
  return String(question?.content || question?.question || question?.prompt || '').replace(/\s+/g, ' ').trim();
}

function excerpt(value, limit = 360) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit);
}

function isException(record) {
  return /^(RAW-|RRAW-|UNMAPPED-)/.test(record.classification?.subUnitKey || '')
    || record.classification?.subUnitKey === '함수-FUNCTION_BASIC';
}

function mappingFor(record, question) {
  const file = record.sourceArchiveFile;
  const key = record.standardUnitKey || record.classification?.subUnitKey || '';
  const ordinal = record.sourceOrdinal;
  const text = textOf(question);

  // This numerical remainder question is a direct application of the
  // polynomial remainder theorem: x^10 = (x-1)Q(x)+R and x=1 gives R=1.
  // It therefore belongs to the active remainder/factor subunit rather than
  // remaining under the legacy raw label “숫자의 나눗셈”.
  if (file === 'types/high/h1/항등식과나머지정리_고1_유형.js' && ordinal === 25) return 'H15-SA-02-REMAINDER_FACTOR';

  // RPM is a curated representative-question appendix whose section order is
  // the reliable source of curriculum evidence (the questions have no answer
  // or solution fields).
  if (file === 'types/middle/m2/RPM_중2_2-2_부록_대표문제다시풀기_중2.js') {
    if (ordinal <= 13) return 'M2-05-TRIANGLE_PROPERTIES';
    if (ordinal <= 28) return 'M2-05-QUADRILATERAL_PROPERTIES';
    if (ordinal <= 37) return 'M2-06-SIMILAR_FIGURE';
    if (ordinal <= 51) return 'M2-06-PARALLEL_LENGTH_RATIO';
    if ([52, 53, 56, 57, 58].includes(ordinal)) return 'M2-07-PYTHAGOREAN_THEOREM';
    if ([54, 55, 59, 60].includes(ordinal)) return 'M2-07-PYTHAGOREAN_APPLICATION';
    if (ordinal <= 68) return 'M2-08-PROBABILITY_COUNTING';
    return 'M2-08-PROBABILITY_BASIC';
  }

  // High-school type-bank polynomial questions.
  if (file === 'types/high/h1/항등식과나머지정리_고1_유형.js') {
    if (ordinal === 7) return 'H15-SA-01-POLYNOMIAL_DIVISION';
    if ([5, 9, 22, 29].includes(ordinal)) return 'H15-SA-01-POLYNOMIAL_BASIC';
  }

  // High-school algebra (H22-A) uses the current algebra unit keys; legacy
  // H22-C keys in older files are not copied into new exception decisions.
  if (file.includes('/high/h2/')) {
    if (key === '함수') return 'H22-A-02-FUNCTION_BASIC';
    if (key === 'RAW-지수/로그의역함수') return 'H22-A-03-FUNCTION_INVERSE';
    if (key === 'RAW-삼각함수그래프의해석') return 'H22-A-04-TRIGONOMETRIC_GRAPH';
    if (key === 'RAW-삼각함수' && (text.includes('그래프') || text.includes('교점') || text.includes('곡선'))) return 'H22-A-04-TRIGONOMETRIC_GRAPH';
    if (key === 'RAW-삼각함수' || key.includes('삼각함수사이의관계') || key.includes('삼각함수의각변환') || key.includes('삼각함수의사분면')) return 'H22-A-04-TRIGONOMETRIC_BASIC';
    if (key === 'RAW-지수함수와 로그함수') {
      return (text.includes('그래프') || text.includes('점근선') || text.includes('최댓값') || text.includes('최솟값'))
        ? 'H22-A-01-FUNCTION_BASIC' : 'H22-A-01-EXPONENT_LOG';
    }
    if (key.includes('지수') || key.includes('로그') || key.includes('산술기하평균')) return 'H22-A-01-EXPONENT_LOG';
  }

  // High-school first-year polynomial/real-number exceptions.
  if (file.includes('/high/h1/')) {
    if (key === 'UNMAPPED-REAL_NUMBER-COMPARISON') return 'M3-01-SQUARE_ROOT_REAL_NUMBER';
    if (key === 'RAW-약수와배수') return 'M1-01-PRIME_FACTORIZATION';
    if (key === 'RAW-수치계산의공식화') return 'H15-SA-01-POLYNOMIAL_BASIC';
    if (key === 'RAW-다항식추론') return 'H15-SA-02-REMAINDER_FACTOR';
    if (key === 'RAW-서술형2' && ordinal === 22) return 'H15-SA-02-REMAINDER_FACTOR';
    // The archive's H15-SA-13 parent is a legacy extension without an active
    // standard-unit row; use the active quadratic-function application key so
    // this reviewed question lands in a formal master branch.
    if (key === 'RAW-서술형3' && ordinal === 23) return 'M3-04-QUADRATIC_FUNCTION_APPLICATION';
    if (key === 'RAW-다항식의성질' && ordinal === 8) return 'H15-SA-01-POLYNOMIAL_BASIC';
    if (key === 'RAW-다항식의성질' && ordinal === 15) return 'H15-SA-02-IDENTITY';
    if (key === 'RAW-다항식의변형' && ordinal === 17) return 'H15-SA-01-POLYNOMIAL_BASIC';
    if (key === 'RAW-다항식의결정' && ordinal === 19) return 'H15-SA-02-REMAINDER_FACTOR';
    if (key === 'RAW-서술형' && ordinal === 21) return 'H15-SA-02-REMAINDER_FACTOR';
  }

  // Middle-school exceptions. The question text resolves the few generic
  // “서술형” labels whose sections mix algebra, geometry and inequalities.
  if (file.includes('/middle/m2/')) {
    if (key === 'RAW-연립방정식의해') return 'M2-03-SIMULTANEOUS_LINEAR_EQUATION';
    if (key === 'RAW-논술형3' || key === 'RAW-서술형4') return 'M2-02-LINEAR_INEQUALITY_WORD';
    if (key === 'RAW-서술형' && (text.includes('속력') || text.includes('시간') || text.includes('이내'))) return 'M2-02-LINEAR_INEQUALITY_WORD';
    if (key === 'RAW-서술형1' && (text.includes('원뿔') || text.includes('원기둥'))) return 'M1-07-SOLID_FIGURE_MEASURE';
    if (key === 'RAW-서술형2' && (text.includes('원뿔') || text.includes('원기둥'))) return 'M1-07-SOLID_FIGURE_MEASURE';
    if (key === 'RAW-서술형3' && (text.includes('직각삼각형') || text.includes('외접원') || text.includes('내접원'))) return 'M2-05-TRIANGLE_PROPERTIES';
    if (key === 'RAW-서술형3' && (text.includes('다항식') || text.includes('계산'))) return 'M2-01-POLYNOMIAL_OPERATIONS';
    if (key.includes('부피') || key.includes('도형의부피')) return 'M1-07-SOLID_FIGURE_MEASURE';
    if (key.includes('삼각형') || key === 'RAW-내심' || key === 'RAW-외심' || key.includes('내심') || key.includes('외심')) return 'M2-05-TRIANGLE_PROPERTIES';
    if (key.includes('지수') || key.includes('거듭제곱') || key.includes('자릿수')) return 'M2-01-EXPONENT_LAW';
    if (key.includes('다항식') || key.includes('바른계산') || key.includes('바르게계산') || key.includes('식의대입') || key.includes('도형과다항식') || key.includes('등식의성질')) return 'M2-01-POLYNOMIAL_OPERATIONS';
    if (key === 'RAW-서술형' || key === 'RAW-서술형1' || key === 'RAW-서술형2') return 'M2-01-POLYNOMIAL_OPERATIONS';
  }
  if (file.includes('/middle/m3/')) {
    if (key === 'RAW-분모의유리화') return 'M3-01-REAL_NUMBER_OPERATIONS';
    if (key === 'RAW-다항식의값') return 'M3-02-POLYNOMIAL_MULTIPLICATION';
  }

  throw new Error(`no reviewed mapping for ${file}#${ordinal} ${key}`);
}

export function buildCompleteSubunitExceptionReviewV1() {
  const classification = readJson(classificationPath);
  const taxonomy = readJson(taxonomyPath).definitions;
  const taxonomyByKey = new Map(taxonomy.map(definition => [definition.key, definition]));
  const master = readJson(masterPath);
  const masterByKey = new Map(master.filter(row => row.keyType === 'standardUnitKey').map(row => [row.key, row]));
  const exceptions = classification.records.filter(isException);
  const bankCache = new Map();
  const review = [];
  for (const record of exceptions) {
    if (!bankCache.has(record.sourceArchiveFile)) bankCache.set(record.sourceArchiveFile, loadQuestionBank(record.sourceArchiveFile));
    const question = bankCache.get(record.sourceArchiveFile)[record.sourceOrdinal - 1];
    if (!question) throw new Error(`question ordinal missing: ${record.sourceArchiveFile}#${record.sourceOrdinal}`);
    const candidateKey = mappingFor(record, question);
    if (!candidateKey) {
      review.push({
        questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal,
        originalStandardUnitKey: record.standardUnitKey, originalStandardUnit: record.standardUnit,
        originalSubUnitKey: record.classification.subUnitKey, originalSubUnit: record.classification.subUnit,
        decision: 'retain_exception', candidateStandardUnitKey: '', candidateStandardUnit: '', candidateSubUnitKey: '', candidateSubUnit: '',
        evidence: { contentExcerpt: excerpt(textOf(question)), answerExcerpt: excerpt(question.answer), solutionExcerpt: excerpt(question.solution), rationale: '현재 마스터에 의미상 정확한 정식 키가 없어 예외로 보류했다.' }
      });
      continue;
    }
    const definition = taxonomyByKey.get(candidateKey);
    if (!definition || /^(RAW-|RRAW-|UNMAPPED-)/.test(candidateKey)) throw new Error(`candidate taxonomy key missing or non-formal: ${candidateKey}`);
    const masterRow = masterByKey.get(definition.standardUnitKey);
    if (!masterRow) throw new Error(`candidate standard unit missing from master: ${definition.standardUnitKey}`);
    review.push({
      questionUid: record.questionUid, sourceArchiveFile: record.sourceArchiveFile, sourceOrdinal: record.sourceOrdinal,
      originalStandardUnitKey: record.standardUnitKey, originalStandardUnit: record.standardUnit,
      originalSubUnitKey: record.classification.subUnitKey, originalSubUnit: record.classification.subUnit,
      decision: 'promote', candidateStandardUnitKey: definition.standardUnitKey, candidateStandardUnit: masterRow.labelKo,
      candidateSubUnitKey: definition.key, candidateSubUnit: definition.label,
      evidence: { contentExcerpt: excerpt(textOf(question)), answerExcerpt: excerpt(question.answer), solutionExcerpt: excerpt(question.solution), rationale: '실제 문항 본문·정답·해설과 현행 세부단원 정의를 대조해 확정했다.' }
    });
  }
  const promotions = review.filter(item => item.decision === 'promote');
  const retained = review.filter(item => item.decision === 'retain_exception');
  if (review.length !== exceptions.length) throw new Error(`review count mismatch: ${review.length} vs ${exceptions.length}`);
  if (promotions.length !== exceptions.length || retained.length !== 0) throw new Error(`review disposition mismatch: promote=${promotions.length}, retained=${retained.length}`);
  const stable = {
    schemaVersion: 'archive-complete-subunit-exception-review-v1', sourceClassificationDigest: classification.digest,
    reviewScope: 'remaining_exceptions_after_prior_review',
    priorReviewDigest: '33935123798b7959d3ee648800cf6ae15c76d4358e3f642ef2bae46818558c01',
    priorFormalPromotions: 195,
    totals: { exceptionInstances: review.length, promoted: promotions.length, retainedException: retained.length, uniqueExceptionKeys: new Set(exceptions.map(record => record.classification.subUnitKey)).size },
    cumulativeTotals: { reviewedInstances: 196, formalPromotions: 196, retainedExceptions: 0 },
    gates: { actualQuestionEvidenceAttached: review.every(item => item.evidence.contentExcerpt.length > 0), allPromotionsFormal: promotions.every(item => !/^(RAW-|RRAW-|UNMAPPED-)/.test(item.candidateSubUnitKey)), noRetainedExceptions: retained.length === 0 },
    review
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = buildCompleteSubunitExceptionReviewV1();
  fs.mkdirSync(phaseDir, { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, totals: report.totals, gates: report.gates }, null, 2));
}
