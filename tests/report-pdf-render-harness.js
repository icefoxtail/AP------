/**
 * 리포트 PDF 렌더 검증 하니스 (재현 가능, 앱 미구동)
 *
 * 목적: 표준형/상세형 리포트를 목 데이터로 렌더해 (1) 페이지 높이 측정,
 *       (2) 깨진 한국어/금지어가 출력에 없는지 정적 검사, (3) 미리보기 HTML 생성.
 *
 * 실행:
 *   node tests/report-pdf-render-harness.js            # 검사 + 측정값 출력
 *   node tests/report-pdf-render-harness.js --html DIR # 미리보기 HTML도 DIR에 생성
 *
 * report.js를 샌드박스 로드하고 데이터 제공 함수만 목으로 오버라이드한다.
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '..');
const reportSrc = fs.readFileSync(path.join(root, 'apmath', 'js', 'report.js'), 'utf8');

const htmlFlagIdx = process.argv.indexOf('--html');
const htmlDir = htmlFlagIdx !== -1 ? process.argv[htmlFlagIdx + 1] : '';

const stats = {
    wrongRows: [
        { questionNo: 4,  correctRate: 38, classCorrectRate: 45, unit: '이차함수',   unitKey: 'u1', difficulty: '어려움',     meaning: '' },
        { questionNo: 7,  correctRate: 52, classCorrectRate: 60, unit: '이차함수',   unitKey: 'u1', difficulty: '보통',       meaning: '' },
        { questionNo: 9,  correctRate: 71, classCorrectRate: 78, unit: '도형의 닮음', unitKey: 'u2', difficulty: '보통',       meaning: '' },
        { questionNo: 12, correctRate: 88, classCorrectRate: 92, unit: '도형의 닮음', unitKey: 'u2', difficulty: '쉬움',       meaning: '' },
        { questionNo: 15, correctRate: 30, classCorrectRate: 38, unit: '제곱근',     unitKey: 'u3', difficulty: '매우 어려움', meaning: '' },
        { questionNo: 17, correctRate: 64, classCorrectRate: 70, unit: '제곱근',     unitKey: 'u3', difficulty: '보통',       meaning: '' },
        { questionNo: 18, correctRate: 47, classCorrectRate: 55, unit: '이차방정식', unitKey: 'u4', difficulty: '어려움',     meaning: '' },
        { questionNo: 20, correctRate: 22, classCorrectRate: 33, unit: '이차방정식', unitKey: 'u4', difficulty: '매우 어려움', meaning: '' }
    ],
    rows: Array.from({ length: 20 }, (_, i) => ({ questionNo: i + 1, correctRate: 40 + (i * 3) % 60, difficulty: '보통' })),
    bucket: { '쉬움': 4, '보통': 9, '어려움': 4, '매우 어려움': 2, '자료 부족': 1 },
    classAvg: 72, overallAvg: 68, className: '고1 A반',
    totalSessions: 24, classSessions: 8
};

const MOCK = {
    data: {
        student: { id: 's1', name: '김민준', school_name: 'AP고등학교', grade: '고1' },
        session: { id: 'e1', score: 78, question_count: 20, exam_title: '1학기 중간고사', exam_date: '2026-05-02' },
        stats,
        classInfo: { className: '고1 A반' },
        targetProgress: { targetScore: 90, currentAverage: 80, remainScore: 10 },
        archiveDetails: { status: 'loaded', details: [], message: '문제 원문 일부를 확인했습니다.' }
    },
    trend: {
        selectedSessions: [{ score: 70, label: '3월' }, { score: 74, label: '4월' }, { score: 78, label: '중간' }],
        trend: { firstScore: 70, latestScore: 78, averageScore: 74, recentAverage: 76, direction: 'up', bestScore: 78, worstScore: 70, scoreDelta: 8, hasMultipleSessions: true },
        weaknessTrend: [
            { unit: '이차함수', unitKey: 'u1', wrongCount: 2, appearedInSessions: 2, lastSeenDate: '2026-05-02', resolved: false },
            { unit: '제곱근', unitKey: 'u3', wrongCount: 1, appearedInSessions: 1, lastSeenDate: '2026-05-02', resolved: false }
        ],
        finalSession: { score: 78, overallAvg: 68, classAvg: 72 },
        finalEvaluation: { scorePosition: '', trendComment: '', nextPlan: [] }
    }
};

function loadBuilder() {
    const body = reportSrc + `
        reportCenterGetExamReportData = function () { return MOCK.data; };
        reportCenterGetExamTrendData = function () { return MOCK.trend; };
        reportCenterGetAiAnalysisForReport = function () { return null; };
        reportCenterGetCachedAiAnalysis = function () { return null; };
        reportCenterGetExamReportTeacherMemo = function () { return '계산 실수가 잦아 검산 습관을 같이 잡는 중입니다.'; };
        reportCenterGetMatchingStudioState = function () { return null; };
        return { reportCenterBuildCleanPdfDocument, reportCenterBuildCleanPdfShell };`;
    const noop = () => {};
    const shim = new Proxy({}, { get: () => noop });
    return new Function('window', 'document', 'state', 'localStorage', 'navigator', 'console', 'MOCK', body)(
        {}, shim, { db: {} }, shim, shim, console, MOCK
    );
}

function studioState(length) {
    const detailed = length === 'detailed';
    return {
        textOptions: { tone: 'calm_parent', length, humanize: true },
        options: {
            includeTrendGraph: detailed, includeDistributionGraph: false, includeWeaknessTrend: detailed,
            includeQuestionAnalysis: true, includeTeacherOpinion: true, includeParentMessage: true, includeSignature: true
        },
        blocks: {}, charts: {}
    };
}

// 전문체 기준, 출력 본문(태그 제거)에 남으면 안 되는 표현.
const BANNED = [
    // AI식 모호어
    '학습 흐름', '성취 흐름', '풀이 흐름', '현재 흐름', '시사점', '유의미한 자료',
    '다각도로', '향후', '체계적인 관리', '학습 폭', '보완 지점', '보완 포인트', '확인 포인트', '개선이 기대됩니다',
    // 과한 캐주얼 (전문체로 통일)
    '다 맞았습니다', '올려보겠습니다', '풀어보겠습니다', '다시 잡겠습니다',
    // 깨진 한국어
    '문제은', '문제을', '문제과', '문제으로', '부분하겠', '다시 볼 부분하'
];

const B = loadBuilder();
let fail = 0;

['standard', 'detailed'].forEach(length => {
    const doc = B.reportCenterBuildCleanPdfDocument('s1', 'e1', { studioState: studioState(length), length });
    const textOnly = doc.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const hits = BANNED.filter(b => textOnly.includes(b));
    const rows = (doc.match(/aprc-qno/g) || []).length;
    const hasComment = doc.includes('aprc-qcomment-list');
    console.log(`[${length}] 분석표 ${rows}행 · 문제별코멘트 ${hasComment ? '있음' : '없음'} · 금지/깨짐 ${hits.length ? 'FAIL → ' + hits.join(', ') : '0 (OK)'}`);
    if (hits.length) fail++;

    if (htmlDir) {
        const out = path.join(htmlDir, `report-${length}.html`);
        fs.writeFileSync(out, B.reportCenterBuildCleanPdfShell(doc), 'utf8');
        console.log(`        → ${out}`);
    }
});

assert.strictEqual(fail, 0, '렌더 출력에 금지어/깨진 한국어가 남아 있습니다.');
console.log('report pdf render harness: OK (출력에 금지어/깨진 한국어 0)');
