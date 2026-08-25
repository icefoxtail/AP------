import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

/**
 * Resolve the 28 assignments that were held by the frozen fallback-safety
 * audit.  The old audit remains an immutable baseline; this tool records the
 * question-level human adjudication and changes only the four operational
 * sub-unit fields in the listed production JS questions.
 */
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '../..');
const auditPath = path.join(archiveDir, '_generated/intelligence/phase3/fallback-safety-audit/archive-subunit-fallback-safety-audit-v1.json');
const masterPath = path.join(archiveDir, 'data/master_tables/js_archive_tag_master.json');
const outputDir = path.join(archiveDir, '_generated/intelligence/phase3/fallback-adjudication');
const outputPath = path.join(outputDir, 'archive-subunit-fallback-manual-adjudication-v1.json');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const metadataFields = new Set(['subUnitKey', 'subUnit', 'subUnitConfidence', 'subUnitClassificationDepth']);

// The expected current key is checked before writing.  This prevents a later
// rerun from silently applying a decision to a changed question slot.
const decisions = [
  {
    sourceArchiveFile: 'original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js',
    sourceOrdinal: 9,
    expectedCurrentSubUnitKey: 'M2-04-LINEAR_FUNCTION_EQUATION',
    targetSubUnitKey: 'M2-04-LINEAR_FUNCTION_EQUATION',
    rationale: '두 직선의 기울기 관계(평행)를 판정하는 문항이므로 일차함수와 일차방정식의 관계로 확정했다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js',
    sourceOrdinal: 23,
    expectedCurrentSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    targetSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    rationale: '그래프의 기울기·절편 오류를 읽고 일차함수 식을 복원하는 문항으로 뜻과 그래프에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2mid/23_향림중_2학기_중간_중2_수학.js',
    sourceOrdinal: 4,
    expectedCurrentSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    targetSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    rationale: '두 점을 지나는 직선의 식을 구하는 문항으로 일차함수의 뜻과 그래프에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2mid/24_향림중_2학기_중간_중2_수학.js',
    sourceOrdinal: 5,
    expectedCurrentSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    targetSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    rationale: '두 점을 지나는 일차함수의 식을 직접 구하는 문항으로 뜻과 그래프에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2mid/24_향림중_2학기_중간_중2_수학.js',
    sourceOrdinal: 8,
    expectedCurrentSubUnitKey: 'M2-04-LINEAR_FUNCTION_EQUATION',
    targetSubUnitKey: 'M2-04-LINEAR_FUNCTION_BASIC',
    rationale: 'y축과 평행한 직선의 x좌표 조건을 묻는 그래프 문항이다. 두 직선의 교점·연립방정식 관계가 아니므로 평행 키워드만으로 관계 단원에 두지 않았다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/22_풍덕중_2학기_기말_중2_기출.js',
    sourceOrdinal: 21,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '중단된 경기 이후 승부가 끝나는 경기 순서를 나누어 경우를 세고 확률을 합산하는 문항이므로 경우의 수와 확률로 확정했다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/23_금당중_2학기_기말_중2_기출.js',
    sourceOrdinal: 17,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '대표 2명을 뽑는 전체·사건의 경우를 열거해 확률을 판단하는 문항으로 경우의 수와 확률에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/23_매산중_2학기_기말_중2_기출.js',
    sourceOrdinal: 17,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    rationale: '확률의 범위, 여사건, 반드시·절대로 일어나지 않는 사건의 성질을 묻는 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js',
    sourceOrdinal: 24,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '3전 2선승 경기의 종료 시점과 경기 순서를 나누어 확률을 계산하므로 경우의 수와 확률에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/23_이수중_2학기_기말_중2_기출.js',
    sourceOrdinal: 23,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '대표 선발의 전체 경우와 남학생만 뽑는 경우를 세어 여학생 포함 확률을 구하는 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/24_향림중_2학기_기말_중2_기출.js',
    sourceOrdinal: 19,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    rationale: '등분 원판의 표본공간에서 사건이 일어날 확률을 묻는 기본 확률 문항으로 확률의 뜻과 성질에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js',
    sourceOrdinal: 16,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    rationale: '확률 p의 범위와 여사건·확실·불가능 사건의 성질을 확인하는 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js',
    sourceOrdinal: 22,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '두 주사위 눈의 합에 해당하는 순서쌍을 직접 열거해 확률을 구하는 도형 이동 문항으로 경우의 수와 확률에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m2/2final/25_팔마중_2학기_기말_중2_기출.js',
    sourceOrdinal: 20,
    expectedCurrentSubUnitKey: 'M2-08-PROBABILITY_BASIC',
    targetSubUnitKey: 'M2-08-PROBABILITY_COUNTING',
    rationale: '먼저 2승하는 경기의 종료 시점과 앞선 두 경기의 승패 순서를 나누어 경우를 세는 문항으로 경우의 수와 확률에 해당한다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/22_신흥중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 12,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '중근 조건과 근과 계수의 관계를 이용하는 이차방정식 문항으로 활용형 문항이 아니다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/22_연향중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 6,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '판별식이 0이 되는 중근 조건을 계산하는 순수 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/22_팔마중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 7,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '전개·완전제곱과 중근 조건을 이용해 상수와 근을 구하는 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/23_매산중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 10,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '제시된 식 중 중근을 갖는 이차방정식을 판별하는 기본 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/23_매산중_1학기_기말_중3_수학c.js',
    sourceOrdinal: 10,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '제시된 식 중 중근을 갖는 이차방정식을 판별하는 기본 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 9,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '자연수 계수 조건 아래에서 판별식과 최소값을 이용하는 이차방정식 문항으로 실생활 활용형이 아니다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/24_연향중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 6,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '중근 조건과 근을 계산하는 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/24_왕운중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 16,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '주사위가 정하는 계수에 대해 판별식이 0인 경우를 세는 문항이지만 핵심 개념은 이차방정식의 중근이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/25_연향중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 2,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '여러 이차방정식에서 중근 여부를 판별하는 기본 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/25_왕운중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 4,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '판별식이 0이 되는 상수와 중근을 구하는 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/25_왕운중_1학기_기말_중3_기출c.js',
    sourceOrdinal: 8,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '주사위 계수 조건에서 중근이 되는지 판별하는 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/26_삼산중_1학기_기말_중3_기출.js',
    sourceOrdinal: 2,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '중근을 갖는 이차방정식을 고르는 기본 판별 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/26_왕운중_1학기_기말_중3_기출.js',
    sourceOrdinal: 4,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '양수 매개변수에 대한 중근 조건을 구하는 이차방정식 문항이다.'
  },
  {
    sourceArchiveFile: 'original/middle/m3/1final/26_팔마중_1학기_기말_중3_기출.js',
    sourceOrdinal: 4,
    expectedCurrentSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    targetSubUnitKey: 'M3-03-QUADRATIC_EQUATION',
    rationale: '완전제곱 및 판별식으로 중근 조건을 구하는 이차방정식 문항이다.'
  }
];

function writeTextWithRetry(filePath, value) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try { fs.writeFileSync(filePath, value, 'utf8'); return; } catch (error) {
      lastError = error;
      if (attempt < 11) {
        const wait = new Int32Array(new SharedArrayBuffer(4));
        Atomics.wait(wait, 0, 0, 150);
      }
    }
  }
  throw lastError;
}

function loadQuestionBank(source, file) {
  const context = { window: {}, console };
  vm.runInNewContext(source, context, { timeout: 2000, filename: file });
  if (!Array.isArray(context.window.questionBank)) throw new Error(`questionBank missing: ${file}`);
  return context.window.questionBank;
}

function replaceQuestionBank(source, enriched, file) {
  const assignment = /window\.questionBank\s*=/.exec(source);
  if (!assignment) throw new Error(`questionBank assignment missing: ${file}`);
  const expressionStart = assignment.index + assignment[0].length;
  let start = expressionStart;
  while (/\s/.test(source[start] || '')) start += 1;
  if (source[start] !== '[') throw new Error(`questionBank is not an array literal: ${file}`);
  let depth = 0; let quote = ''; let escaped = false; let end = -1;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (character === '\\') { escaped = true; continue; }
      if (character === quote) quote = '';
      continue;
    }
    if (character === '"' || character === "'" || character === '`') { quote = character; continue; }
    if (character === '[') depth += 1;
    else if (character === ']') { depth -= 1; if (depth === 0) { end = index; break; } }
  }
  if (end < 0) throw new Error(`questionBank array end missing: ${file}`);
  return `${source.slice(0, start)}${JSON.stringify(enriched, null, 2)}${source.slice(end + 1)}`;
}

function withoutMetadata(question) {
  return Object.fromEntries(Object.entries(question).filter(([key]) => !metadataFields.has(key)));
}

function excerpt(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, 360);
}

function decisionKey(decision) {
  return `${decision.sourceArchiveFile}#${decision.sourceOrdinal}`;
}

export function applyFallbackManualAdjudicationV1() {
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
  const masterByKey = new Map(master.filter(row => row.status === 'active' && row.keyType === 'subUnitKey').map(row => [row.key, row]));
  if (audit.overlay.length !== 28) throw new Error(`fallback audit baseline changed: ${audit.overlay.length}`);
  if (decisions.length !== audit.overlay.length) throw new Error(`decision count mismatch: ${decisions.length}/${audit.overlay.length}`);
  const decisionByKey = new Map(decisions.map(item => [decisionKey(item), item]));
  if (decisionByKey.size !== decisions.length) throw new Error('duplicate decision source slots');
  const auditByKey = new Map(audit.overlay.map(item => [decisionKey(item), item]));
  for (const decision of decisions) {
    const auditRow = auditByKey.get(decisionKey(decision));
    if (!auditRow) throw new Error(`decision is not in fallback audit: ${decisionKey(decision)}`);
    if (auditRow.standardUnitKey !== masterByKey.get(decision.targetSubUnitKey)?.standardUnitKey) {
      throw new Error(`audit/master parent mismatch: ${decisionKey(decision)}`);
    }
    if (!masterByKey.has(decision.targetSubUnitKey)) throw new Error(`inactive/missing target key: ${decision.targetSubUnitKey}`);
  }

  const grouped = new Map();
  for (const decision of decisions) {
    if (!grouped.has(decision.sourceArchiveFile)) grouped.set(decision.sourceArchiveFile, []);
    grouped.get(decision.sourceArchiveFile).push(decision);
  }
  const files = [];
  const review = [];
  let updatedQuestions = 0;
  const changedFieldCounts = { subUnitKey: 0, subUnit: 0, subUnitConfidence: 0, subUnitClassificationDepth: 0 };
  const confidence = 'category_or_cue_inferred';
  const classificationDepth = 'complete_category';

  for (const relativeFile of [...grouped.keys()].sort((a, b) => a.localeCompare(b, 'en'))) {
    const filePath = path.join(archiveDir, 'exams', ...relativeFile.split('/'));
    const before = fs.readFileSync(filePath, 'utf8');
    const questions = loadQuestionBank(before, relativeFile);
    const items = grouped.get(relativeFile);
    const byOrdinal = new Map(items.map(item => [item.sourceOrdinal, item]));
    const enriched = questions.map((question, index) => {
      const ordinal = index + 1;
      const item = byOrdinal.get(ordinal);
      if (!item) return question;
      if (question.standardUnitKey !== masterByKey.get(item.targetSubUnitKey).standardUnitKey) {
        throw new Error(`standard unit mismatch: ${relativeFile}#${ordinal}`);
      }
      if (question.subUnitKey !== item.expectedCurrentSubUnitKey) {
        throw new Error(`current key changed before apply: ${relativeFile}#${ordinal} ${question.subUnitKey}/${item.expectedCurrentSubUnitKey}`);
      }
      const masterRow = masterByKey.get(item.targetSubUnitKey);
      const next = {
        ...question,
        subUnitKey: item.targetSubUnitKey,
        subUnit: masterRow.subUnit || masterRow.labelKo || item.targetSubUnitKey,
        subUnitConfidence: confidence,
        subUnitClassificationDepth: classificationDepth
      };
      for (const field of metadataFields) if (question[field] !== next[field]) changedFieldCounts[field] += 1;
      review.push({
        sourceArchiveFile: relativeFile,
        sourceOrdinal: ordinal,
        questionUid: auditByKey.get(decisionKey(item)).questionUid,
        standardUnitKey: question.standardUnitKey,
        standardUnit: question.standardUnit,
        previous: {
          subUnitKey: question.subUnitKey,
          subUnit: question.subUnit,
          subUnitConfidence: question.subUnitConfidence,
          subUnitClassificationDepth: question.subUnitClassificationDepth
        },
        adjudicated: {
          subUnitKey: next.subUnitKey,
          subUnit: next.subUnit,
          subUnitConfidence: next.subUnitConfidence,
          subUnitClassificationDepth: next.subUnitClassificationDepth
        },
        decision: 'promote',
        rationale: item.rationale,
        evidence: {
          contentExcerpt: excerpt(question.content),
          answerExcerpt: excerpt(question.answer),
          solutionExcerpt: excerpt(question.solution)
        }
      });
      return next;
    });
    if (review.filter(item => item.sourceArchiveFile === relativeFile).length !== items.length) throw new Error(`review row mismatch: ${relativeFile}`);
    const beforePayload = JSON.stringify(questions.map(withoutMetadata));
    const after = replaceQuestionBank(before, enriched, relativeFile);
    const validated = loadQuestionBank(after, relativeFile);
    const afterPayload = JSON.stringify(validated.map(withoutMetadata));
    if (beforePayload !== afterPayload) throw new Error(`non-metadata content changed: ${relativeFile}`);
    if (validated.length !== questions.length) throw new Error(`post-write question count mismatch: ${relativeFile}`);
    writeTextWithRetry(filePath, after);
    const changed = enriched.filter((question, index) => JSON.stringify(question) !== JSON.stringify(questions[index])).length;
    if (changed !== items.length) throw new Error(`changed question count mismatch: ${relativeFile} ${changed}/${items.length}`);
    files.push({ sourceArchiveFile: relativeFile, questionCount: validated.length, updatedQuestions: changed, beforeDigest: sha256(before), afterDigest: sha256(after) });
    updatedQuestions += changed;
  }

  const stable = {
    schemaVersion: 'archive-subunit-fallback-manual-adjudication-v1',
    baselineAuditDigest: audit.digest,
    productionWriteAllowed: true,
    status: 'RESOLVED_MANUAL_ADJUDICATION',
    writes: { targetProductionJs: true, otherProductionJs: false, master: false, database: false, questionIndex: false, identity: false, commit: false, push: false },
    totals: {
      fallbackAssignments: decisions.length,
      reviewedQuestions: review.length,
      updatedQuestions,
      sourceFiles: files.length,
      changedFieldCounts,
      targetSubUnitCounts: review.reduce((counts, row) => { counts[row.adjudicated.subUnitKey] = (counts[row.adjudicated.subUnitKey] || 0) + 1; return counts; }, {})
    },
    gates: {
      allFallbackAssignmentsReviewed: review.length === 28,
      allTargetKeysActive: review.every(row => masterByKey.has(row.adjudicated.subUnitKey)),
      targetParentsMatch: review.every(row => masterByKey.get(row.adjudicated.subUnitKey)?.standardUnitKey === row.standardUnitKey),
      onlySubUnitMetadataChanged: true,
      fallbackAssignmentsResolved: true,
      noDbIndexIdentityWrites: true,
      commitOrPush: false
    },
    files,
    review
  };
  return { generatedAt: new Date().toISOString(), digest: sha256(JSON.stringify(stable)), ...stable };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const report = applyFallbackManualAdjudicationV1();
  fs.mkdirSync(outputDir, { recursive: true });
  writeTextWithRetry(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ output: path.relative(archiveDir, outputPath).replaceAll('\\', '/'), digest: report.digest, status: report.status, totals: report.totals, gates: report.gates }, null, 2));
}
