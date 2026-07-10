import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['archive-render.js', 'report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const storage = new Map();
const context = {
  state: { db: {} },
  window: {},
  document: {
    body: { classList: { add: () => {}, remove: () => {} } },
    head: { appendChild: () => {} },
    getElementById: () => null,
    createElement: tag => ({ tagName: tag, id: '', textContent: '' }),
    querySelectorAll: () => []
  },
  localStorage: {
    getItem: key => storage.get(key) || null,
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: key => storage.delete(key)
  },
  toast: () => {},
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const SAMPLE_SEED = 20260710;
const SAMPLE_TARGET = 360;
const grades = ['중1', '중2', '중3'];
const exams = [
  ['1학기 중간', '2026-05-01'],
  ['1학기 기말', '2026-07-01'],
  ['2학기 중간', '2026-10-01'],
  ['2학기 기말', '2026-12-01']
];
const boundaryScores = [0, 50, 60, 70, 80, 90, 100];
const wrongCounts = [0, 1, 5, 6];
const names = ['김예준', '이지우', '서윤', '민석', '하린', '오율'];
const averageModes = ['overall-lower1', 'overall-same', 'overall-higher1', 'class-lower1', 'class-same', 'class-higher1', 'between', 'overall-only', 'class-only', 'none'];
const sourceModes = ['basic', 'ai', 'saved-all', 'saved-partial', 'ai-empty'];
const wrongPatterns = [
  { label: 'easy', rates: [94, 91, 88, 92, 89, 90], units: ['일차방정식', '계산과 검산'] },
  { label: 'hard', rates: [38, 32, 41, 28, 36, 44], units: ['함수의 활용', '도형'] },
  { label: 'mixed', rates: [92, 35, 68, 42, 88, 55], units: ['계산과 검산', '조건 해석'] },
  { label: 'same-unit', rates: [72, 64, 58, 49, 43, 39], units: ['연립방정식'] },
  { label: 'spread', rates: [82, 61, 45, 74, 53, 36], units: ['조건 해석', '계산과 검산', '풀이 순서', '개념 재정리'] }
];
const banned = [
  '향후', '시사점', '유의미한', '다각도로', '체계적인 관리', '개선이 기대됩니다',
  '도움이 될 것으로 보입니다', '종합적으로 파악', '확인이 필요합니다', '보완 포인트',
  '보완 지점', '학습 흐름', '풀이 흐름', '우선 확인 문항', '우선확인문항',
  '실제 문항', '먼저 볼 문항', '아카이브', '코호트', 'blueprint', 'review_text', 'raw data',
  '기준으로 보면', '이 리포트에', '것으로 보입니다'
];

function createPrng(seed) {
  let value = seed >>> 0;
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0;
    return value / 0x100000000;
  };
}

function pick(list, prng) {
  return list[Math.floor(prng() * list.length) % list.length];
}

function plain(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?。]|[다요]\.)\s+|(?<=[다요])\s+(?=[가-힣A-Z0-9])/)
    .map(sentence => sentence.trim())
    .filter(sentence => sentence.length >= 12);
}

function normalizeSentence(sentence) {
  return String(sentence || '')
    .normalize('NFKC')
    .replace(/[0-9]+(?:\.[0-9]+)?/g, '#')
    .replace(/[^\p{L}\p{N}#]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function sentenceSkeleton(sentence) {
  return normalizeSentence(sentence)
    .replace(/#점|#개|#번|#%|#/g, '#')
    .replace(/중[123]/g, '중#')
    .replace(/[가-힣]{2,4}(?= 학생|의|은|는|이|가)/g, '학생');
}

function makeAverages(score, mode) {
  const low = Math.max(0, score - 1);
  const high = Math.min(100, score + 1);
  if (mode === 'overall-lower1') return { overall: low, classAvg: null };
  if (mode === 'overall-same') return { overall: score, classAvg: null };
  if (mode === 'overall-higher1') return { overall: high, classAvg: null };
  if (mode === 'class-lower1') return { overall: null, classAvg: low };
  if (mode === 'class-same') return { overall: null, classAvg: score };
  if (mode === 'class-higher1') return { overall: null, classAvg: high };
  if (mode === 'between') return { overall: high, classAvg: low };
  if (mode === 'overall-only') return { overall: Math.max(0, score - 4), classAvg: null };
  if (mode === 'class-only') return { overall: null, classAvg: Math.max(0, score - 3) };
  return { overall: null, classAvg: null };
}

function sampleDb(sample) {
  const archiveFile = `sample-${sample.index}.js`;
  const sessionId = `session-${sample.index}`;
  const studentId = `student-${sample.index}`;
  const classId = `class-${sample.index}`;
  const { overall, classAvg } = makeAverages(sample.score, sample.averageMode);
  const wrongNos = Array.from({ length: sample.wrongCount }, (_, index) => index + 2);
  const allQuestionStats = Array.from({ length: 20 }, (_, index) => {
    const qNo = index + 1;
    const wrongIndex = wrongNos.indexOf(qNo);
    const patternRate = wrongIndex >= 0 ? sample.pattern.rates[wrongIndex % sample.pattern.rates.length] : 76;
    return {
      questionNo: qNo,
      takers: 20,
      wrongCount: Math.max(0, Math.round(20 * (100 - patternRate) / 100)),
      correctRate: patternRate
    };
  });
  const otherSessions = [];
  if (overall !== null) {
    otherSessions.push({ id: `${sessionId}-overall`, student_id: `peer-${sample.index}`, archive_file: archiveFile, exam_title: sample.examTitle, exam_date: sample.examDate, score: overall, question_count: 20 });
  }
  if (classAvg !== null) {
    otherSessions.push({ id: `${sessionId}-class`, student_id: `peer-class-${sample.index}`, archive_file: archiveFile, exam_title: sample.examTitle, exam_date: sample.examDate, score: classAvg, question_count: 20 });
  }
  return {
    students: [
      { id: studentId, name: sample.name, grade: sample.grade },
      { id: `peer-${sample.index}`, name: '비교학생', grade: sample.grade },
      { id: `peer-class-${sample.index}`, name: '반학생', grade: sample.grade }
    ],
    classes: [{ id: classId, name: `${sample.grade} AP반`, grade: sample.grade }],
    class_students: [
      { class_id: classId, student_id: studentId },
      { class_id: classId, student_id: `peer-class-${sample.index}` }
    ],
    exam_sessions: [
      { id: sessionId, student_id: studentId, archive_file: archiveFile, exam_title: sample.examTitle, exam_date: sample.examDate, score: sample.score, question_count: 20 },
      ...otherSessions
    ],
    wrong_answers: wrongNos.map(question_id => ({ session_id: sessionId, student_id: studentId, question_id })),
    exam_blueprints: Array.from({ length: 20 }, (_, index) => ({
      archive_file: archiveFile,
      question_no: index + 1,
      standard_unit: sample.pattern.units[index % sample.pattern.units.length],
      difficulty: index % 5 === 0 ? '어려움' : '보통',
      points: 5
    })),
    exam_question_reviews: wrongNos.map((questionNo, index) => ({
      archive_file: archiveFile,
      question_no: String(questionNo),
      review_text: JSON.stringify({
        concept: sample.pattern.units[index % sample.pattern.units.length],
        tag: sample.pattern.label === 'easy' ? '계산과 검산' : sample.pattern.label === 'hard' ? '조건 해석' : '풀이 순서',
        trap: index % 2 ? '조건을 식으로 바꾸는 단계' : '부호를 끝까지 확인하는 부분'
      })
    })),
    report_exam_cohort_stats: [{
      session_id: sessionId,
      cohortScope: 'grade_archive_exam',
      gradeExamAverage: overall,
      gradeExamCount: overall === null ? 0 : 20,
      questionStats: allQuestionStats
    }],
    exam_analysis_meta: [],
    exam_student_reports: []
  };
}

function archiveDetailsFor(sample) {
  const details = Array.from({ length: 20 }, (_, index) => {
    const questionNo = index + 1;
    const longText = sample.index % 9 === 0
      ? '조건이 길게 제시된 문항입니다. 직사각형의 가로와 세로, 이동한 거리, 합의 범위를 모두 비교하여 식을 세우세요. '.repeat(4)
      : `${questionNo}번 문항입니다. 주어진 조건을 식으로 옮겨 값을 구하세요.`;
    const content = sample.index % 11 === 0
      ? `${longText}<table><tr><th>구분</th><th>값</th></tr><tr><td>처음</td><td>$x+2$</td></tr><tr><td>나중</td><td>$2x-1$</td></tr></table>`
      : sample.index % 10 === 0
        ? `${longText} $\\frac{x+1}{2}=\\sqrt{9}$ 이고 $x^2-3x+2=0$입니다.`
        : longText;
    return context.reportCenterNormalizeQuestionDetail({
      content,
      choices: ['① x=1', '② x=2', '③ x=3', '④ x=4'],
      answer: '②',
      solution: '조건을 식으로 정리한 뒤 계산합니다.'
    }, questionNo, {
      questionNo,
      unit: sample.pattern.units[index % sample.pattern.units.length],
      correctRate: sample.pattern.rates[index % sample.pattern.rates.length]
    });
  });
  return { ok: true, status: 'loaded', details, message: '문항 원문을 불러왔습니다.' };
}

function applySourceMode(sample, db) {
  context.window.AP_REPORT_AI_ANALYSIS_CACHE = {};
  sample.beforeCopy = '';
  if (sample.sourceMode === 'ai' || sample.sourceMode === 'ai-empty') {
    const legacyCopy = '향후 시사점을 종합적으로 파악해 체계적인 관리가 필요합니다.';
    const payload = sample.sourceMode === 'ai-empty'
      ? { source: 'ai', summary: '', parentMessage: '', nextActions: [] }
      : {
          source: 'ai',
          summary: `${legacyCopy} 수업에서 오답 문항을 다시 정리했습니다. 다음 단원은 예정대로 이어갑니다.`,
          parentMessage: `안녕하세요. AP수학입니다. ${legacyCopy} 오답 정리는 수업에서 마쳤습니다.`,
          nextActions: ['수업에서 다시 정리했습니다.', '다음 수업부터 새 단원으로 이어갑니다.']
        };
    sample.beforeCopy = [payload.summary, payload.parentMessage, ...(payload.nextActions || [])].join(' ').trim();
    context.reportCenterSetCachedAiAnalysis(`session-${sample.index}`, payload);
  }
  if (sample.sourceMode === 'saved-all' || sample.sourceMode === 'saved-partial') {
    const legacyCopy = '보완 포인트와 학습 흐름 확인이 필요합니다.';
    const fields = sample.sourceMode === 'saved-all'
      ? {
          diagnosisText: `저장된 핵심 진단입니다. ${legacyCopy} 수업에서 다시 확인했습니다.`,
          teacherSummaryText: `저장된 담임 총평입니다. ${legacyCopy} 다음 지도는 예정대로 이어갑니다.`,
          planText: `저장된 학습 관리 방향입니다. 다음 수업부터 유사문항을 더 풀겠습니다.`,
          parentText: `저장된 학부모 안내입니다. 오답 정리는 수업에서 마쳤습니다.`
        }
      : {
          parentText: `일부 수정된 학부모 안내입니다. ${legacyCopy} 오답 정리는 수업에서 마쳤습니다.`
        };
    sample.beforeCopy = Object.values(fields).join(' ').trim();
    db.exam_student_reports.push({
      archive_file: `sample-${sample.index}.js`,
      student_id: `student-${sample.index}`,
      report_type: 'school_exam_detail',
      session_id: `session-${sample.index}`,
      fields_json: JSON.stringify(fields)
    });
  }
}

function buildSamples() {
  const prng = createPrng(SAMPLE_SEED);
  const samples = [];
  let index = 0;
  for (const grade of grades) {
    for (const [examLabel, examDate] of exams) {
      for (const score of boundaryScores) {
        for (const wrongCount of wrongCounts) {
          samples.push({
            index,
            grade,
            examTitle: `${grade} ${examLabel} 학교시험`,
            examDate,
            score,
            wrongCount,
            pattern: pick(wrongPatterns, prng),
            averageMode: pick(averageModes, prng),
            sourceMode: pick(sourceModes, prng),
            name: pick(names, prng)
          });
          index += 1;
        }
      }
    }
  }
  while (samples.length < SAMPLE_TARGET) {
    const [examLabel, examDate] = pick(exams, prng);
    samples.push({
      index,
      grade: pick(grades, prng),
      examTitle: `${pick(grades, prng)} ${examLabel} 학교시험`,
      examDate,
      score: pick(boundaryScores, prng),
      wrongCount: pick(wrongCounts, prng),
      pattern: pick(wrongPatterns, prng),
      averageMode: pick(averageModes, prng),
      sourceMode: pick(sourceModes, prng),
      name: pick(names, prng)
    });
    index += 1;
  }
  averageModes.forEach((mode, offset) => {
    samples[offset].averageMode = mode;
  });
  sourceModes.forEach((mode, offset) => {
    samples[offset].sourceMode = mode;
  });
  return samples;
}

const samples = buildSamples();
assert.ok(samples.length >= 300);
assert.equal(SAMPLE_SEED, 20260710);
assert.deepEqual(new Set(samples.map(sample => sample.grade)), new Set(grades));
assert.deepEqual(new Set(samples.map(sample => sample.score)), new Set(boundaryScores));
assert.deepEqual(new Set(samples.map(sample => sample.wrongCount)), new Set(wrongCounts));
assert.ok(averageModes.every(mode => samples.some(sample => sample.averageMode === mode)));
assert.ok(sourceModes.every(mode => samples.some(sample => sample.sourceMode === mode)));
for (const [examLabel] of exams) {
  assert.ok(samples.some(sample => sample.examTitle.includes(examLabel)), `${examLabel} missing`);
}

const representative = [];
const semanticWarnings = [];
let changedSentenceCount = 0;
let checked = 0;

for (const sample of samples) {
  storage.clear();
  const db = sampleDb(sample);
  applySourceMode(sample, db);
  context.state.db = db;
  const archiveDetails = archiveDetailsFor(sample);
  const data = context.reportCenterWithArchiveDetails(
    context.reportCenterGetExamReportData(`student-${sample.index}`, `session-${sample.index}`),
    archiveDetails
  );
  const questionDetailMap = context.reportCenterGetQuestionDetailMap(data);
  const parentRows = context.reportCenterSortWrongRowsByQuestionNo(
    context.reportCenterSelectParentReportWrongRows(data.stats.wrongRows, 5)
  );
  const usedQuestionComments = [];
  const questionCommentBlocks = parentRows.map(row => context.reportCenterBuildParentQuestionParagraph(row, questionDetailMap.get(String(row.questionNo)), { usedComments: usedQuestionComments }));
  const blocks = {
    title: `${sample.examTitle} 분석 리포트`,
    diagnosis: context.reportCenterBuildSchoolExamDiagnosisText(data, parentRows),
    teacher: context.reportCenterBuildSchoolExamTeacherSummary(data),
    questionComments: questionCommentBlocks.join(' '),
    plan: context.reportCenterBuildAcademyActionPlan(data).join('\n'),
    parent: context.reportCenterBuildRichParentMessage(data, parentRows),
    compact: context.reportCenterBuildCompactParentMessage(data),
    kakao: context.reportCenterBuildExamPreview(`student-${sample.index}`, `session-${sample.index}`),
    detail: plain(context.reportCenterBuildSchoolExamDetailedParentReport(`student-${sample.index}`, `sample-${sample.index}.js`, { archiveDetails })),
    print: plain(context.reportCenterBuildSchoolExamDetailedPrintDocument(`student-${sample.index}`, `session-${sample.index}`, { archiveDetails })),
    simple: plain(context.reportCenterBuildSchoolExamSimpleParentReport(`student-${sample.index}`, `sample-${sample.index}.js`))
  };
  const text = Object.values(blocks).flat().join('\n');
  const hits = banned.filter(word => text.includes(word));
  assert.deepEqual(hits, [], `forbidden copy in sample ${sample.index}: ${hits.join(', ')}`);
  assert.doesNotMatch(text, /(예준는|민석는|하린는|오율는|지우이는)/, `bad josa in sample ${sample.index}`);
  assert.doesNotMatch(text, /오답 정리(?:를)? 앞으로|앞으로 .*오답 정리(?:를)? 마치/, `wrong tense for completed review in sample ${sample.index}`);
  assert.doesNotMatch(text, /다음 (?:단원|수업|진도)[^.?!]*(?:했습니다|마쳤습니다|정리했습니다)/, `wrong tense for future lesson in sample ${sample.index}`);
  if (sample.wrongCount === 0) {
    assert.doesNotMatch(blocks.parent, /오답 \d+개 중|오답 관리|대표 오답/, `perfect score wrong-copy in sample ${sample.index}`);
  }
  if (sample.wrongCount === 1) {
    assert.doesNotMatch(blocks.parent, /오답 1개 중|문항들|여러 문항/, `singular wrong-count copy in sample ${sample.index}`);
  }
  assert.match(text, new RegExp(String(sample.score)), `score missing in sample ${sample.index}`);
  assert.match(text, new RegExp(sample.examTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `exam title missing in sample ${sample.index}`);
  parentRows.forEach(row => assert.match(text, new RegExp(`${row.questionNo}번`), `question number missing in sample ${sample.index}`));
  assert.ok(parentRows.length <= 5, 'parent report should keep max 5 representative wrong questions');
  assert.deepEqual(parentRows.map(row => row.questionNo), parentRows.map(row => row.questionNo).sort((a, b) => a - b));

  const sentenceCounts = new Map();
  for (const block of [blocks.diagnosis, blocks.teacher, blocks.plan, blocks.parent]) {
    for (const sentence of splitSentences(block)) {
      const key = normalizeSentence(sentence);
      sentenceCounts.set(key, (sentenceCounts.get(key) || 0) + 1);
    }
  }
  const exactDuplicates = Array.from(sentenceCounts.entries()).filter(([, count]) => count > 1);
  assert.deepEqual(exactDuplicates, [], `exact duplicate sentence in sample ${sample.index}`);

  const skeletonCounts = new Map();
  for (const comment of questionCommentBlocks) {
    for (const sentence of splitSentences(comment)) {
      const key = sentenceSkeleton(sentence);
      skeletonCounts.set(key, (skeletonCounts.get(key) || 0) + 1);
    }
  }
  const repeatedSkeletons = Array.from(skeletonCounts.entries()).filter(([, count]) => count >= 3);
  assert.deepEqual(repeatedSkeletons, [], `question comment skeleton repeated in sample ${sample.index}`);

  const comparable = [blocks.diagnosis, blocks.teacher, blocks.plan, blocks.parent].filter(Boolean);
  comparable.forEach((left, leftIndex) => {
    comparable.slice(leftIndex + 1).forEach(right => {
      if (context.reportCenterIsDuplicateText(left, right)) {
        semanticWarnings.push({ sample: sample.index, left: left.slice(0, 90), right: right.slice(0, 90), decision: 'reviewed-duplicate-not-allowed' });
      }
      assert.equal(context.reportCenterIsDuplicateText(left, right), false, `duplicate block in sample ${sample.index}`);
    });
  });

  if (sample.beforeCopy) {
    const beforeSentences = splitSentences(sample.beforeCopy).map(normalizeSentence);
    const afterSentences = new Set(splitSentences(text).map(normalizeSentence));
    const changed = beforeSentences.filter(sentence => sentence && !afterSentences.has(sentence));
    changedSentenceCount += changed.length;
    assert.ok(changed.length > 0, `saved/AI baseline did not change in sample ${sample.index}`);
  }

  if (representative.length < 50 && (sample.index % 5 === 0 || sample.sourceMode !== 'basic')) {
    representative.push({
      grade: sample.grade,
      score: sample.score,
      wrongCount: sample.wrongCount,
      averageMode: sample.averageMode,
      sourceMode: sample.sourceMode,
      title: blocks.title,
      diagnosis: blocks.diagnosis,
      teacher: blocks.teacher,
      parent: blocks.parent
    });
  }
  checked += 1;
}

assert.ok(representative.length >= 50);
assert.ok(changedSentenceCount > 0);
assert.equal(checked, samples.length);
assert.deepEqual(semanticWarnings, []);

console.log(`report school exam copy sampling test passed (${checked} samples, representative ${representative.length}, seed ${SAMPLE_SEED})`);
