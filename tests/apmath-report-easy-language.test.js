/**
 * AP Math Report Studio 문구 품질 회귀 테스트 (전문체 기준)
 *
 * 방향: 전문적이되 따뜻한 담임 선생님 톤. 코드는 확정 문구를 골라 슬롯만 채운다.
 * 검사: (1) AI식 모호어 0, (2) 과한 캐주얼 0, (3) 깨진 한국어 0, (4) 생성 결과 비어있지 않음.
 *
 * 실행: node tests/apmath-report-easy-language.test.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const reportSrc = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath', 'js', file), 'utf8'))
  .join('\n');

// 생성기가 reportCenterGetExamReportData를 부르는 경우(카톡 요약 등)를 위해 목으로 오버라이드한다.
const MOCK_STATS = {
    wrongRows: [
        { questionNo: 4, correctRate: 38, classCorrectRate: 45, unit: '이차함수', difficulty: '어려움' },
        { questionNo: 7, correctRate: 52, classCorrectRate: 60, unit: '이차함수', difficulty: '보통' },
        { questionNo: 9, correctRate: 71, classCorrectRate: 78, unit: '도형의 닮음', difficulty: '보통' },
        { questionNo: 15, correctRate: 30, classCorrectRate: 38, unit: '제곱근', difficulty: '매우 어려움' }
    ],
    rows: Array.from({ length: 20 }, (_, i) => ({ questionNo: i + 1, correctRate: 50, difficulty: '보통' })),
    bucket: {}, classAvg: 72, overallAvg: 68, className: '고1 A반', totalSessions: 24, classSessions: 8
};
const MOCK_DATA = {
    student: { id: 's1', name: '김민준', school_name: 'AP고', grade: '고1' },
    session: { id: 'e1', score: 78, question_count: 20, exam_title: '1학기 중간고사' },
    stats: MOCK_STATS, classInfo: { className: '고1 A반' },
    targetProgress: { targetScore: 90, currentAverage: 80, remainScore: 10 },
    archiveDetails: { status: 'loaded', details: [] }
};

function loadReportExports() {
    const body = reportSrc + `
        reportCenterGetExamReportData = function () { return MOCK_DATA; };
        return {
            reportCenterApplyEasyFinalLanguage,
            reportCenterBuildEasySummaryText,
            reportCenterBuildEasyTrendText,
            reportCenterBuildEasyWeaknessText,
            reportCenterBuildEasyPlanItems,
            reportCenterBuildEasyTeacherOpinionLines,
            reportCenterBuildEasyParentMessage,
            reportCenterBuildEasyKakaoSummary,
            reportCenterBuildParentQuestionInsight,
            reportCenterBuildPremiumQuestionRows,
            reportCenterBuildQuestionCommentCards,
            reportCenterBuildSingleExamSummaryText,
            reportCenterBuildTrendSummaryText,
            reportCenterBuildWeaknessSummaryText,
            reportHumanizeApMathText
        };`;
    const noop = () => {};
    const shim = new Proxy({}, { get: () => noop });
    return new Function('window', 'document', 'state', 'localStorage', 'navigator', 'console', 'MOCK_DATA', body)(
        {}, shim, { db: {} }, shim, shim, console, MOCK_DATA
    );
}

const R = loadReportExports();

// (1) AI식 모호어 — 전문체에서도 금지.
const AI_VAGUE = [
    '학습 흐름', '성취 흐름', '풀이 흐름', '현재 흐름', '시사점', '유의미한 자료',
    '다각도로', '향후', '체계적인 관리', '학습 폭', '보완 지점', '보완 포인트',
    '확인 포인트', '개선이 기대됩니다', '종합적으로 파악', '학습 방향 설정'
];
// (2) 과한 캐주얼 — 전문체로 통일하므로 금지.
const TOO_CASUAL = ['다 맞았습니다', '올려보겠습니다', '풀어보겠습니다', '다시 잡겠습니다'];
// (3) 깨진 한국어 — 조사/동사 파괴.
const BROKEN = ['문제은', '문제을', '문제과', '문제으로', '부분하겠', '다시 볼 부분하'];

function assertClean(label, text) {
    const out = String(text || '');
    AI_VAGUE.forEach(b => assert.ok(!out.includes(b), `[${label}] AI식 표현 "${b}" 잔존:\n  ${out}`));
    TOO_CASUAL.forEach(b => assert.ok(!out.includes(b), `[${label}] 과한 캐주얼 "${b}" 잔존:\n  ${out}`));
    BROKEN.forEach(b => assert.ok(!out.includes(b), `[${label}] 깨진 표현 "${b}" 잔존:\n  ${out}`));
}

let passed = 0;
const ok = () => { passed++; };

// ── 1. 정화기: AI식 모호어가 섞인 텍스트를 전문체로 정리(문장 보존) ──────
const AI_CORPUS = [
    '학생의 학습 흐름을 다각도로 분석한 유의미한 자료입니다.',
    '향후 체계적인 관리로 학습 폭을 넓혀가겠습니다.',
    '이번 평가의 보완 포인트와 확인 포인트를 정리했습니다. 개선이 기대됩니다.',
    '풀이 순서를 안정화합니다.'
];
AI_CORPUS.forEach((line, i) => {
    const out = R.reportCenterApplyEasyFinalLanguage(line);
    assertClean(`scrub#${i}`, out);
    assert.ok(/[가-힣]/.test(out), `[scrub#${i}] 정화 결과가 비어 있음: ${line}`);
    ok();
});

// 정화기는 전문 용어(문항/오답/풀이 과정/유사문항)를 캐주얼로 바꾸지 않는다.
const keepTerms = R.reportCenterApplyEasyFinalLanguage('3번 문항의 풀이 과정에서 오답이 나왔습니다.');
assert.ok(keepTerms.includes('문항') && keepTerms.includes('풀이 과정') && keepTerms.includes('오답'),
    `정화기가 전문 용어를 캐주얼로 바꿈: ${keepTerms}`);
ok();

// ── 2. 블록 생성기: 전문체 + 금지어 0 (오답 있음/만점) ────────────────
function mockData(wrong) {
    return wrong ? MOCK_DATA : { ...MOCK_DATA, stats: { ...MOCK_STATS, wrongRows: [] } };
}
const mockTrend = {
    selectedSessions: [{ score: 70 }, { score: 74 }, { score: 78 }],
    trend: { direction: 'up', bestScore: 78, worstScore: 70, scoreDelta: 8 },
    weaknessTrend: [{ unit: '이차함수', appearedInSessions: 2, resolved: false }]
};

[true, false].forEach(wrong => {
    const data = mockData(wrong);
    assertClean(`summary(wrong=${wrong})`, R.reportCenterBuildEasySummaryText(data, data.stats.wrongRows.length, 75));
    assertClean(`trend(wrong=${wrong})`, R.reportCenterBuildEasyTrendText(mockTrend));
    assertClean(`weakness(wrong=${wrong})`, R.reportCenterBuildEasyWeaknessText(mockTrend, data));
    assertClean(`plan(wrong=${wrong})`, R.reportCenterBuildEasyPlanItems(data, mockTrend).join(' '));
    assertClean(`teacher(wrong=${wrong})`, R.reportCenterBuildEasyTeacherOpinionLines(data, '검산 습관을 지도 중입니다.').join(' '));
    assertClean(`parent(wrong=${wrong})`, R.reportCenterBuildEasyParentMessage(data));
    assert.ok(R.reportCenterBuildEasyParentMessage(data).trim().length > 0, `parent(wrong=${wrong}) 비어 있음`);
    ok();
});
assertClean('kakao', R.reportCenterBuildEasyKakaoSummary('s1', 'e1'));
ok();

// ── 3. 문항 코멘트 bank: 정답률 전 구간 short/full 전문체 ────────────
[95, 80, 55, 30, null].forEach(rate => {
    const short = R.reportCenterBuildParentQuestionInsight({ questionNo: 5, unit: '대수', correctRate: rate }, null, { mode: 'short' });
    const full = R.reportCenterBuildParentQuestionInsight({ questionNo: 5, unit: '대수', correctRate: rate }, null, { mode: 'full', index: 0 });
    assertClean(`insightShort(${rate})`, short);
    assertClean(`insightFull(${rate})`, full);
    assert.ok(short && /[가-힣]/.test(short), `insightShort(${rate}) 비어 있음`);
    assert.ok(/5번/.test(full), `insightFull(${rate}) 슬롯 누락: ${full}`);
    ok();
});
// 표 해석(short)과 코멘트(full)는 서로 다른 길이/형태여야 한다(중복 방지).
const sShort = R.reportCenterBuildParentQuestionInsight({ questionNo: 7, unit: '대수', correctRate: 55 }, null, { mode: 'short' });
const sFull = R.reportCenterBuildParentQuestionInsight({ questionNo: 7, unit: '대수', correctRate: 55 }, null, { mode: 'full', index: 0 });
assert.ok(sShort !== sFull && sFull.length > sShort.length, '표 해석과 코멘트가 동일/중복됨');
ok();

// ── 4. 분석표/코멘트 렌더 조각 ───────────────────────────────────────
const many = { ...MOCK_DATA, stats: { ...MOCK_STATS, wrongRows: Array.from({ length: 8 }, (_, i) => ({
    questionNo: i + 1, correctRate: 30 + i * 7, classCorrectRate: 40 + i * 6, unit: i % 2 ? '이차함수' : '제곱근', difficulty: '보통'
})) } };
const countRows = html => (String(html).match(/aprc-qno/g) || []).length;
const detailedRows = R.reportCenterBuildPremiumQuestionRows(many, true, true);
assert.strictEqual(countRows(detailedRows), 8, `상세형 분석표 전체 8행 (실제 ${countRows(detailedRows)})`);
assertClean('detailedRows', detailedRows.replace(/<[^>]+>/g, ' '));
const comments = R.reportCenterBuildQuestionCommentCards(many, 4);
assert.strictEqual((comments.match(/aprc-qcomment-no/g) || []).length, 4, '코멘트 카드 4개');
assertClean('comments', comments.replace(/<[^>]+>/g, ' '));
ok();

// ── 5. '다듬기' 버튼(humanize): 전문체를 캐주얼로 망가뜨리지 않는다 ────
// 이미 전문체인 문구는 그대로 두고, AI식 모호어만 정리해야 한다.
const PRO_LINES = [
    '7번 문항은 이차함수 응용 유형으로, 조건을 식으로 옮기는 단계가 핵심입니다. 그 과정을 다시 짚어 주겠습니다.',
    '난도가 높았던 문항은 관련 개념을 다시 짚겠습니다.',
    '틀린 문항은 다음 수업에서 다시 풀이하고, 유사 유형까지 함께 점검하겠습니다.'
];
PRO_LINES.forEach((line, i) => {
    const out = R.reportHumanizeApMathText(line);
    assertClean(`humanizePro#${i}`, out);
    // 전문 용어가 캐주얼로 바뀌지 않아야 한다.
    assert.ok(!out.includes('푸는 과정') && !out.includes('비슷한 문제'),
        `[humanizePro#${i}] 다듬기가 전문 용어를 캐주얼로 바꿈:\n  ${out}`);
    ok();
});
// AI식 텍스트는 다듬기에서 정리된다.
assertClean('humanizeAi', R.reportHumanizeApMathText('학생의 학습 흐름을 다각도로 분석한 유의미한 자료입니다.'));
ok();

console.log(`apmath report copy(professional) checks passed (${passed} groups)`);
