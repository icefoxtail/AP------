import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const archiveDir = path.resolve(scriptDir, '..');
const repoRoot = path.resolve(archiveDir, '..');
const examsDir = path.join(archiveDir, 'exams');
const dbPath = path.join(archiveDir, 'db.js');
const indexPath = path.join(archiveDir, 'question-index.js');
const reportPath = path.join(archiveDir, 'question-index-report.md');
const auditPath = path.join(archiveDir, 'question-index-audit.md');

/*
 * 공식 표준단원키 마스터 테이블 (142개)
 * 출처(단일 원본): archive/textbook/# JS아카이브 표준단원키 마스터 테이블.md
 *   - 중등 23 + H22 56 + H15 63 = 142
 * mixer.html 의 MASTER_TABLE 과 동일 내용을 유지한다(mixer.html 은 이 단계에서 수정 금지).
 * 생성기는 이 테이블을 "공식 키 검증" 기준으로만 사용하며, 인덱스 레코드의 원문 값은 보존한다.
 */
const MASTER_TABLE = {
    "M1-01": { course: "중1 수학", unit: "소인수분해", order: 1 },
    "M1-02": { course: "중1 수학", unit: "정수와 유리수", order: 2 },
    "M1-03": { course: "중1 수학", unit: "문자와 식", order: 3 },
    "M1-04": { course: "중1 수학", unit: "좌표평면과 그래프", order: 4 },
    "M1-05": { course: "중1 수학", unit: "기본도형", order: 5 },
    "M1-06": { course: "중1 수학", unit: "평면도형의 성질", order: 6 },
    "M1-07": { course: "중1 수학", unit: "입체도형의 성질", order: 7 },
    "M1-08": { course: "중1 수학", unit: "자료의 정리와 해석", order: 8 },
    "M2-01": { course: "중2 수학", unit: "수와 식", order: 1 },
    "M2-02": { course: "중2 수학", unit: "일차부등식", order: 2 },
    "M2-03": { course: "중2 수학", unit: "연립일차방정식", order: 3 },
    "M2-04": { course: "중2 수학", unit: "일차함수와 그래프", order: 4 },
    "M2-05": { course: "중2 수학", unit: "도형의 성질", order: 5 },
    "M2-06": { course: "중2 수학", unit: "도형의 닮음", order: 6 },
    "M2-07": { course: "중2 수학", unit: "피타고라스 정리", order: 7 },
    "M2-08": { course: "중2 수학", unit: "확률", order: 8 },
    "M3-01": { course: "중3 수학", unit: "실수와 그 계산", order: 1 },
    "M3-02": { course: "중3 수학", unit: "다항식의 곱셈과 인수분해", order: 2 },
    "M3-03": { course: "중3 수학", unit: "이차방정식", order: 3 },
    "M3-04": { course: "중3 수학", unit: "이차함수와 그래프", order: 4 },
    "M3-05": { course: "중3 수학", unit: "삼각비", order: 5 },
    "M3-06": { course: "중3 수학", unit: "원의 성질", order: 6 },
    "M3-07": { course: "중3 수학", unit: "통계", order: 7 },
    "H22-C-01": { course: "공통수학1", unit: "다항식의 연산", order: 1 },
    "H22-C-02": { course: "공통수학1", unit: "항등식과 나머지 정리", order: 2 },
    "H22-C-03": { course: "공통수학1", unit: "인수분해", order: 3 },
    "H22-C-04": { course: "공통수학1", unit: "복소수와 이차방정식", order: 4 },
    "H22-C-05": { course: "공통수학1", unit: "이차방정식과 이차함수", order: 5 },
    "H22-C-06": { course: "공통수학1", unit: "여러 가지 방정식과 부등식", order: 6 },
    "H22-C-07": { course: "공통수학1", unit: "합의 법칙과 곱의 법칙", order: 7 },
    "H22-C-08": { course: "공통수학1", unit: "순열과 조합", order: 8 },
    "H22-C-09": { course: "공통수학1", unit: "행렬과 그 연산", order: 9 },
    "H22-C2-01": { course: "공통수학2", unit: "평면좌표", order: 1 },
    "H22-C2-02": { course: "공통수학2", unit: "직선의 방정식", order: 2 },
    "H22-C2-03": { course: "공통수학2", unit: "원의 방정식", order: 3 },
    "H22-C2-04": { course: "공통수학2", unit: "도형의 이동", order: 4 },
    "H22-C2-05": { course: "공통수학2", unit: "집합", order: 5 },
    "H22-C2-06": { course: "공통수학2", unit: "명제", order: 6 },
    "H22-C2-07": { course: "공통수학2", unit: "함수", order: 7 },
    "H22-C2-08": { course: "공통수학2", unit: "유리함수", order: 8 },
    "H22-C2-09": { course: "공통수학2", unit: "무리함수", order: 9 },
    "H22-A-01": { course: "대수", unit: "지수와 로그", order: 1 },
    "H22-A-02": { course: "대수", unit: "지수함수", order: 2 },
    "H22-A-03": { course: "대수", unit: "로그함수", order: 3 },
    "H22-A-04": { course: "대수", unit: "삼각함수", order: 4 },
    "H22-A-05": { course: "대수", unit: "사인법칙과 코사인법칙", order: 5 },
    "H22-A-06": { course: "대수", unit: "등차수열과 등비수열", order: 6 },
    "H22-A-07": { course: "대수", unit: "수열의 합", order: 7 },
    "H22-A-08": { course: "대수", unit: "수학적 귀납법", order: 8 },
    "H22-M1-01": { course: "미적분I", unit: "함수의 극한", order: 1 },
    "H22-M1-02": { course: "미적분I", unit: "함수의 연속", order: 2 },
    "H22-M1-03": { course: "미적분I", unit: "미분계수", order: 3 },
    "H22-M1-04": { course: "미적분I", unit: "도함수", order: 4 },
    "H22-M1-05": { course: "미적분I", unit: "도함수의 활용", order: 5 },
    "H22-M1-06": { course: "미적분I", unit: "부정적분", order: 6 },
    "H22-M1-07": { course: "미적분I", unit: "정적분", order: 7 },
    "H22-M1-08": { course: "미적분I", unit: "정적분의 활용", order: 8 },
    "H22-M2-01": { course: "미적분II", unit: "수열의 극한", order: 1 },
    "H22-M2-02": { course: "미적분II", unit: "급수", order: 2 },
    "H22-M2-03": { course: "미적분II", unit: "지수함수와 로그함수의 미분", order: 3 },
    "H22-M2-04": { course: "미적분II", unit: "삼각함수의 미분", order: 4 },
    "H22-M2-05": { course: "미적분II", unit: "여러 가지 미분법", order: 5 },
    "H22-M2-06": { course: "미적분II", unit: "도함수의 활용", order: 6 },
    "H22-M2-07": { course: "미적분II", unit: "여러 가지 적분법", order: 7 },
    "H22-M2-08": { course: "미적분II", unit: "정적분의 활용", order: 8 },
    "H22-PS-01": { course: "확률과 통계", unit: "순열과 조합", order: 1 },
    "H22-PS-02": { course: "확률과 통계", unit: "이항정리", order: 2 },
    "H22-PS-03": { course: "확률과 통계", unit: "확률의 뜻과 활용", order: 3 },
    "H22-PS-04": { course: "확률과 통계", unit: "조건부확률", order: 4 },
    "H22-PS-05": { course: "확률과 통계", unit: "확률분포", order: 5 },
    "H22-PS-06": { course: "확률과 통계", unit: "통계적 추정", order: 6 },
    "H22-GE-01": { course: "기하", unit: "이차곡선", order: 1 },
    "H22-GE-02": { course: "기하", unit: "이차곡선의 접선", order: 2 },
    "H22-GE-03": { course: "기하", unit: "공간도형", order: 3 },
    "H22-GE-04": { course: "기하", unit: "공간좌표", order: 4 },
    "H22-GE-05": { course: "기하", unit: "벡터의 연산", order: 5 },
    "H22-GE-06": { course: "기하", unit: "벡터의 성분", order: 6 },
    "H22-GE-07": { course: "기하", unit: "벡터의 내적", order: 7 },
    "H22-GE-08": { course: "기하", unit: "도형의 방정식", order: 8 },
    "H15-SA-01": { course: "수학(상)", unit: "다항식의 연산", order: 1 },
    "H15-SA-02": { course: "수학(상)", unit: "항등식과 나머지정리", order: 2 },
    "H15-SA-03": { course: "수학(상)", unit: "인수분해", order: 3 },
    "H15-SA-04": { course: "수학(상)", unit: "복소수", order: 4 },
    "H15-SA-05": { course: "수학(상)", unit: "이차방정식", order: 5 },
    "H15-SA-06": { course: "수학(상)", unit: "이차방정식의 근과 계수", order: 6 },
    "H15-SA-07": { course: "수학(상)", unit: "여러 가지 방정식", order: 7 },
    "H15-SA-08": { course: "수학(상)", unit: "여러 가지 부등식", order: 8 },
    "H15-SA-09": { course: "수학(상)", unit: "평면좌표", order: 9 },
    "H15-SA-10": { course: "수학(상)", unit: "직선의 방정식", order: 10 },
    "H15-SA-11": { course: "수학(상)", unit: "원의 방정식", order: 11 },
    "H15-SA-12": { course: "수학(상)", unit: "도형의 이동", order: 12 },
    "H15-SB-01": { course: "수학(하)", unit: "집합", order: 1 },
    "H15-SB-02": { course: "수학(하)", unit: "명제", order: 2 },
    "H15-SB-03": { course: "수학(하)", unit: "함수", order: 3 },
    "H15-SB-04": { course: "수학(하)", unit: "유리함수", order: 4 },
    "H15-SB-05": { course: "수학(하)", unit: "무리함수", order: 5 },
    "H15-SB-06": { course: "수학(하)", unit: "경우의 수", order: 6 },
    "H15-SB-07": { course: "수학(하)", unit: "순열", order: 7 },
    "H15-SB-08": { course: "수학(하)", unit: "조합", order: 8 },
    "H15-M1-01": { course: "수학I", unit: "지수의 뜻과 성질", order: 1 },
    "H15-M1-02": { course: "수학I", unit: "로그의 뜻과 성질", order: 2 },
    "H15-M1-03": { course: "수학I", unit: "지수함수", order: 3 },
    "H15-M1-04": { course: "수학I", unit: "로그함수", order: 4 },
    "H15-M1-05": { course: "수학I", unit: "삼각함수의 뜻과 값", order: 5 },
    "H15-M1-06": { course: "수학I", unit: "삼각함수의 그래프", order: 6 },
    "H15-M1-07": { course: "수학I", unit: "삼각방정식과 삼각부등식", order: 7 },
    "H15-M1-08": { course: "수학I", unit: "등차수열", order: 8 },
    "H15-M1-09": { course: "수학I", unit: "등비수열", order: 9 },
    "H15-M1-10": { course: "수학I", unit: "수열의 합", order: 10 },
    "H15-M1-11": { course: "수학I", unit: "수학적 귀납법", order: 11 },
    "H15-M2-01": { course: "수학II", unit: "함수의 극한", order: 1 },
    "H15-M2-02": { course: "수학II", unit: "함수의 연속", order: 2 },
    "H15-M2-03": { course: "수학II", unit: "미분계수", order: 3 },
    "H15-M2-04": { course: "수학II", unit: "도함수", order: 4 },
    "H15-M2-05": { course: "수학II", unit: "접선의 방정식", order: 5 },
    "H15-M2-06": { course: "수학II", unit: "도함수의 활용", order: 6 },
    "H15-M2-07": { course: "수학II", unit: "부정적분", order: 7 },
    "H15-M2-08": { course: "수학II", unit: "정적분", order: 8 },
    "H15-M2-09": { course: "수학II", unit: "적분의 활용", order: 9 },
    "H15-CALC-01": { course: "미적분", unit: "수열의 극한", order: 1 },
    "H15-CALC-02": { course: "미적분", unit: "급수", order: 2 },
    "H15-CALC-03": { course: "미적분", unit: "지수함수와 로그함수의 미분", order: 3 },
    "H15-CALC-04": { course: "미적분", unit: "삼각함수의 미분", order: 4 },
    "H15-CALC-05": { course: "미적분", unit: "여러 가지 미분법", order: 5 },
    "H15-CALC-06": { course: "미적분", unit: "도함수의 활용", order: 6 },
    "H15-CALC-07": { course: "미적분", unit: "여러 가지 적분법", order: 7 },
    "H15-CALC-08": { course: "미적분", unit: "정적분의 활용", order: 8 },
    "H15-PS-01": { course: "확률과 통계", unit: "순열과 조합", order: 1 },
    "H15-PS-02": { course: "확률과 통계", unit: "이항정리", order: 2 },
    "H15-PS-03": { course: "확률과 통계", unit: "확률의 뜻과 활용", order: 3 },
    "H15-PS-04": { course: "확률과 통계", unit: "조건부확률", order: 4 },
    "H15-PS-05": { course: "확률과 통계", unit: "확률분포", order: 5 },
    "H15-PS-06": { course: "확률과 통계", unit: "통계적 추정", order: 6 },
    "H15-GV-01": { course: "기하와 벡터", unit: "포물선", order: 1 },
    "H15-GV-02": { course: "기하와 벡터", unit: "타원", order: 2 },
    "H15-GV-03": { course: "기하와 벡터", unit: "쌍곡선", order: 3 },
    "H15-GV-04": { course: "기하와 벡터", unit: "이차곡선과 직선", order: 4 },
    "H15-GV-05": { course: "기하와 벡터", unit: "벡터의 연산", order: 5 },
    "H15-GV-06": { course: "기하와 벡터", unit: "평면벡터의 성분과 내적", order: 6 },
    "H15-GV-07": { course: "기하와 벡터", unit: "직선과 원의 방정식", order: 7 },
    "H15-GV-08": { course: "기하와 벡터", unit: "공간도형", order: 8 },
    "H15-GV-09": { course: "기하와 벡터", unit: "공간좌표", order: 9 }
};
const OFFICIAL_KEYS = new Set(Object.keys(MASTER_TABLE));

// 키 분류: official(마스터 등재) / raw(RAW- 임시 규약, 허용) / empty(빈 값) / invalid(그 외 비공식)
function classifyKey(key) {
    const k = String(key || '').trim();
    if (!k) return 'empty';
    if (OFFICIAL_KEYS.has(k)) return 'official';
    if (k.startsWith('RAW-')) return 'raw';
    return 'invalid';
}

function walkJsFiles(dir) {
    const files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) files.push(...walkJsFiles(full));
        else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
    }
    return files;
}

function normalizePath(value) {
    return String(value || '').replace(/\\/g, '/').replace(/^exams\//, '').trim();
}

/*
 * 인덱스 대상 시험지 파일 수집.
 *
 * 정합성 기준(SCOPE): 버전관리(git)에 등재된 시험지 JS만 인덱싱한다.
 *   - .gitignore 가 `*textbook*` 로 차단하는 외부 교재 문제은행(LIGHTSSEN/RPM/동아/마플/미래앤/비상 등)과
 *     미추적 *_pro.js 드래프트는 정식 아카이브가 아니므로 제외한다.
 *   - 이 범위가 db.js(210) 및 기존 산출물(210파일/5444문항)과 일치한다.
 * git 사용 불가 환경에서는 디렉터리 워크로 폴백하되 textbook 경로는 제외하고 그 사실을 리포트에 남긴다.
 */
function getTrackedExamFiles() {
    const out = execFileSync('git', ['-C', repoRoot, 'ls-files', '-z', '--', 'archive/exams/*.js'], { maxBuffer: 64 * 1024 * 1024 });
    return out.toString('utf8').split('\0').map(s => s.trim()).filter(Boolean).map(rel => path.join(repoRoot, rel));
}

function collectExamFiles() {
    try {
        const tracked = getTrackedExamFiles();
        if (tracked.length) return { files: tracked.sort(), scope: 'git-tracked' };
    } catch (error) {
        // fall through to directory walk
    }
    const walked = walkJsFiles(examsDir).filter(f => !normalizePath(path.relative(examsDir, f)).includes('textbook'));
    return { files: walked, scope: 'fs-walk(textbook 제외)' };
}

function runArchiveScript(file, code) {
    const context = {
        window: {},
        console: {
            log() {},
            warn() {},
            error() {}
        }
    };
    context.globalThis = context;
    vm.createContext(context);
    vm.runInContext(code, context, { filename: file });
    return context;
}

function stripHtml(value) {
    return String(value || '')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&amp;/gi, '&')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
}

function normalizeTags(value) {
    if (Array.isArray(value)) return value.map(v => String(v || '').trim()).filter(Boolean);
    if (typeof value === 'string') {
        return value.split(/[,\s]+/).map(v => v.trim()).filter(Boolean);
    }
    return [];
}

/*
 * 시각요소 판정(강화): mixer.html 의 hasVisualAsset 과 동일 기준.
 * 구형 문항은 별도 image 필드 없이 content 내부 <img>/<svg>/<table> 로 시각요소를 담는다.
 */
function visualFlags(q) {
    const content = String(q && q.content || '');
    const explicitImage = Boolean(q && q.image);
    const contentImg = /<img\b/i.test(content);
    const contentSvg = /<svg\b/i.test(content);
    const contentTable = /<table\b/i.test(content);
    return {
        explicitImage,
        contentImg,
        contentSvg,
        contentTable,
        hasVisual: explicitImage || contentImg || contentSvg || contentTable
    };
}

function addExample(bucket, sourceFile, q, slot) {
    if (bucket.length >= 5) return;
    const id = q && typeof q === 'object' && q.id !== undefined && q.id !== null && q.id !== '' ? q.id : `slot${slot}`;
    bucket.push(`${sourceFile}#${id}`);
}

function loadMainDb() {
    const dbCode = fs.readFileSync(dbPath, 'utf8');
    const context = runArchiveScript(dbPath, dbCode);
    const exams = context.window.mainDB && Array.isArray(context.window.mainDB.exams)
        ? context.window.mainDB.exams
        : [];
    return { exams, bytes: Buffer.byteLength(dbCode, 'utf8') };
}

const startedAt = new Date();
const db = loadMainDb();
const metaByFile = new Map(db.exams.map(ex => [normalizePath(ex.file), ex]));
const examScope = collectExamFiles();
const examFiles = examScope.files;

// 1차: 원본 문항을 그대로 레코드로 수집(중복 제거 전). _seq 는 원본 배열 순서(전역).
const rawRecords = [];
let seqCounter = 0;
const report = {
    generatedAt: startedAt.toISOString(),
    scope: examScope.scope,
    dbExamCount: db.exams.length,
    dbBytes: db.bytes,
    examFileCount: examFiles.length,
    examBytes: 0,
    sourceQuestionCount: 0,
    skippedUndefined: 0,
    examples: { skippedUndefined: [] },
    failures: []
};

// 원본 JS id 정합성: 파일별 id 사용 현황(중복 id / 빈 id)
const fileIdIssues = [];

for (const file of examFiles) {
    const sourceFile = normalizePath(path.relative(examsDir, file));
    try {
        const code = fs.readFileSync(file, 'utf8');
        report.examBytes += Buffer.byteLength(code, 'utf8');
        const context = runArchiveScript(file, code);
        const questions = context.window.questions || context.window.questionBank || context.questions || context.questionBank;
        if (!Array.isArray(questions)) {
            report.failures.push({ sourceFile, error: 'questions array not found' });
            continue;
        }

        const meta = metaByFile.get(sourceFile) || {};
        const idSlots = new Map(); // id(문자열) -> [slot,...] (빈 id 포함)
        for (let slot = 0; slot < questions.length; slot += 1) {
            const q = questions[slot];
            if (!q || typeof q !== 'object') {
                report.skippedUndefined += 1;
                addExample(report.examples.skippedUndefined, sourceFile, q, slot);
                continue;
            }

            const rawId = q.id ?? '';
            const id = rawId;
            const idKey = String(rawId);
            if (!idSlots.has(idKey)) idSlots.set(idKey, []);
            idSlots.get(idKey).push(slot);

            const contentRaw = String(q.content || '');
            const contentText = stripHtml(q.content);
            const choices = Array.isArray(q.choices) ? q.choices : [];
            const choicesText = stripHtml(choices.map(choice => String(choice || '')).join(' '));
            const standardUnit = String(q.standardUnit || '').trim();
            const standardUnitKey = String(q.standardUnitKey || '').trim();
            const rawStandardCourse = String(q.standardCourse || '').trim();
            const course = String(q.standardCourse || meta.primaryStandardCourse || '').trim();
            const level = String(q.level || '').trim();
            const tags = normalizeTags(q.tags);
            const vis = visualFlags(q);

            report.sourceQuestionCount += 1;
            rawRecords.push({
                _seq: seqCounter++,
                qKey: `${sourceFile}_${id}`,
                sourceFile,
                grade: String(meta.grade || '').trim(),
                subject: String(meta.subject || '').trim(),
                id,
                standardUnit,
                standardUnitKey,
                course,
                level,
                tags,
                hasImage: vis.hasVisual,
                contentText,
                choicesText,
                // 내부 감사용(인덱스 출력에는 포함하지 않음)
                _rawStandardCourse: rawStandardCourse,
                _hasChoicesArray: Array.isArray(q.choices),
                _tagsMissing: (q.tags === undefined || q.tags === null || q.tags === ''),
                _keyClass: classifyKey(standardUnitKey),
                _vis: vis
            });
        }

        // 파일 내 id 정합성 점검
        const dupIds = [];
        let emptyIdCount = 0;
        for (const [idKey, slots] of idSlots) {
            if (idKey === '') emptyIdCount += slots.length;
            else if (slots.length > 1) dupIds.push({ id: idKey, count: slots.length, slots });
        }
        if (dupIds.length || emptyIdCount) {
            fileIdIssues.push({ sourceFile, total: questions.length, dupIds, emptyIdCount });
        }
    } catch (error) {
        report.failures.push({ sourceFile, error: error && error.message ? error.message : String(error) });
    }
}

/*
 * 2차: qKey 중복 제거.
 * 유지 우선순위(작업지시 PART 3):
 *   1) 공식 standardUnitKey 보유
 *   2) standardUnit 과 course 모두 존재
 *   3) contentText 길이가 김
 *   4) choicesText 길이가 김
 *   5) 원본 배열에서 먼저 나온 레코드(_seq 작음)
 * qKey 규칙(sourceFile_id)은 유지하며 새 키로 치환하지 않는다.
 */
function isOfficial(rec) {
    return rec._keyClass === 'official';
}
function hasUnitAndCourse(rec) {
    return Boolean(rec.standardUnit && rec.course);
}
function preferred(a, b) {
    const ao = isOfficial(a) ? 1 : 0;
    const bo = isOfficial(b) ? 1 : 0;
    if (ao !== bo) return ao > bo ? a : b;
    const af = hasUnitAndCourse(a) ? 1 : 0;
    const bf = hasUnitAndCourse(b) ? 1 : 0;
    if (af !== bf) return af > bf ? a : b;
    if (a.contentText.length !== b.contentText.length) return a.contentText.length > b.contentText.length ? a : b;
    if (a.choicesText.length !== b.choicesText.length) return a.choicesText.length > b.choicesText.length ? a : b;
    return a._seq <= b._seq ? a : b;
}

const groups = new Map();
for (const rec of rawRecords) {
    if (!groups.has(rec.qKey)) groups.set(rec.qKey, []);
    groups.get(rec.qKey).push(rec);
}

const keepSeq = new Set();
const duplicateGroups = []; // 감사 기록용
for (const [qKey, recs] of groups) {
    if (recs.length === 1) {
        keepSeq.add(recs[0]._seq);
        continue;
    }
    let winner = recs[0];
    for (let i = 1; i < recs.length; i += 1) winner = preferred(winner, recs[i]);
    keepSeq.add(winner._seq);
    duplicateGroups.push({
        qKey,
        sourceFile: recs[0].sourceFile,
        kept: winner,
        skipped: recs.filter(r => r._seq !== winner._seq)
    });
}

// 최종 인덱스(원본 순서 보존). 내부 감사 필드(_*)는 출력에서 제거.
const finalRecords = rawRecords.filter(r => keepSeq.has(r._seq));
const index = finalRecords.map(r => ({
    qKey: r.qKey,
    sourceFile: r.sourceFile,
    grade: r.grade,
    subject: r.subject,
    id: r.id,
    standardUnit: r.standardUnit,
    standardUnitKey: r.standardUnitKey,
    course: r.course,
    level: r.level,
    tags: r.tags,
    hasImage: r.hasImage,
    contentText: r.contentText,
    choicesText: r.choicesText
}));

// ---- 집계: 최종 인덱스 레코드 기준 ----
const missing = { id: 0, content: 0, choices: 0, level: 0, standardUnit: 0, standardUnitKey: 0, standardCourse: 0, tags: 0 };
const missingExamples = { id: [], content: [], choices: [], level: [], standardUnit: [], standardUnitKey: [], standardCourse: [], tags: [] };
const visualTotals = { explicitImage: 0, contentImg: 0, contentSvg: 0, contentTable: 0, hasVisual: 0 };
const keyClassTotals = { official: 0, raw: 0, invalid: 0, empty: 0 };
const invalidKeyCounts = new Map(); // key -> { count, examples:[] }
const rawKeyCounts = new Map();

function pushExample(bucket, rec) {
    if (bucket.length >= 8) return;
    bucket.push(`${rec.sourceFile}#${rec.id === '' ? '(빈 id)' : rec.id}`);
}

for (const rec of finalRecords) {
    if (rec.id === '' || rec.id === null || rec.id === undefined) { missing.id += 1; pushExample(missingExamples.id, rec); }
    if (!rec.contentText) { missing.content += 1; pushExample(missingExamples.content, rec); }
    if (!rec._hasChoicesArray) { missing.choices += 1; pushExample(missingExamples.choices, rec); }
    if (!rec.level) { missing.level += 1; pushExample(missingExamples.level, rec); }
    if (!rec.standardUnit) { missing.standardUnit += 1; pushExample(missingExamples.standardUnit, rec); }
    if (!rec.standardUnitKey) { missing.standardUnitKey += 1; pushExample(missingExamples.standardUnitKey, rec); }
    if (!rec._rawStandardCourse) { missing.standardCourse += 1; pushExample(missingExamples.standardCourse, rec); }
    if (rec._tagsMissing) { missing.tags += 1; pushExample(missingExamples.tags, rec); }

    if (rec._vis.explicitImage) visualTotals.explicitImage += 1;
    if (rec._vis.contentImg) visualTotals.contentImg += 1;
    if (rec._vis.contentSvg) visualTotals.contentSvg += 1;
    if (rec._vis.contentTable) visualTotals.contentTable += 1;
    if (rec._vis.hasVisual) visualTotals.hasVisual += 1;

    keyClassTotals[rec._keyClass] += 1;
    if (rec._keyClass === 'invalid') {
        if (!invalidKeyCounts.has(rec.standardUnitKey)) invalidKeyCounts.set(rec.standardUnitKey, { count: 0, examples: [] });
        const e = invalidKeyCounts.get(rec.standardUnitKey);
        e.count += 1;
        if (e.examples.length < 5) e.examples.push(`${rec.sourceFile}#${rec.id}`);
    } else if (rec._keyClass === 'raw') {
        rawKeyCounts.set(rec.standardUnitKey, (rawKeyCounts.get(rec.standardUnitKey) || 0) + 1);
    }
}

// 중복 qKey 검증(최종 인덱스에 0이어야 함)
const finalKeyCounts = new Map();
for (const r of index) finalKeyCounts.set(r.qKey, (finalKeyCounts.get(r.qKey) || 0) + 1);
let finalDupCount = 0;
for (const c of finalKeyCounts.values()) if (c > 1) finalDupCount += 1;

const skippedTotal = duplicateGroups.reduce((acc, g) => acc + g.skipped.length, 0);

// ---- question-index.js 출력 ----
const indexJs = `// Generated by archive/tools/build-question-index.mjs\n// Generated at ${report.generatedAt}\nwindow.questionIndex=${JSON.stringify(index)};\n`;
fs.writeFileSync(indexPath, indexJs, 'utf8');
report.indexBytes = Buffer.byteLength(indexJs, 'utf8');

// ---- 리포트 헬퍼 ----
function listExamples(items) {
    return items.length ? items.map(item => `  - ${item}`).join('\n') : '  - 없음';
}

// ---- question-index-report.md ----
const reportMd = `# question-index 생성 리포트

- 생성 시각: ${report.generatedAt}
- 인덱싱 범위(SCOPE): ${report.scope} (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): ${report.dbExamCount}
- 시험지 파일 수: ${report.examFileCount}
- 원본 문항 수(중복 제거 전): ${report.sourceQuestionCount}
- 최종 인덱스 문항 수(중복 제거 후): ${index.length}
- 중복 qKey로 제외된 레코드: ${skippedTotal} (그룹 ${duplicateGroups.length})
- 최종 인덱스 중복 qKey: ${finalDupCount}
- undefined/비객체 문항 skip: ${report.skippedUndefined}
- db.js 크기: ${report.dbBytes} bytes
- 시험지 JS 총 크기: ${report.examBytes} bytes
- 인덱스 크기: ${report.indexBytes} bytes
- 로드 실패 파일: ${report.failures.length}

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(${index.length})" 기준이다.

## 표준단원키 분류 (공식 마스터 142개 기준)

- 공식(official): ${keyClassTotals.official}
- RAW-(임시 규약, 허용): ${keyClassTotals.raw} (distinct ${rawKeyCounts.size})
- 비공식(invalid): ${keyClassTotals.invalid} (distinct ${invalidKeyCounts.size})
- 빈 키(empty): ${keyClassTotals.empty}

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: ${missing.id}
- 누락 content: ${missing.content}
- 누락 choices: ${missing.choices}
- 누락 level: ${missing.level}
- 누락 standardUnit: ${missing.standardUnit}
- 누락 standardUnitKey: ${missing.standardUnitKey}
- 누락 standardCourse: ${missing.standardCourse}
- 누락 tags: ${missing.tags}

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: ${visualTotals.explicitImage}
- content 내부 <img>: ${visualTotals.contentImg}
- content 내부 <svg>: ${visualTotals.contentSvg}
- content 내부 <table>: ${visualTotals.contentTable}
- 시각요소 보유(hasImage=true, OR 합산): ${visualTotals.hasVisual}

## 누락 예시

### id
${listExamples(missingExamples.id)}

### content
${listExamples(missingExamples.content)}

### choices
${listExamples(missingExamples.choices)}

### level
${listExamples(missingExamples.level)}

### standardUnit
${listExamples(missingExamples.standardUnit)}

### standardUnitKey
${listExamples(missingExamples.standardUnitKey)}

### standardCourse
${listExamples(missingExamples.standardCourse)}

### tags
${listExamples(missingExamples.tags)}

### undefined/비객체 문항
${listExamples(report.examples.skippedUndefined)}

## 실패 파일

${report.failures.length ? report.failures.map(item => `- ${item.sourceFile}: ${item.error}`).join('\n') : '- 없음'}
`;
fs.writeFileSync(reportPath, reportMd, 'utf8');

// ---- question-index-audit.md ----
const invalidSorted = [...invalidKeyCounts.entries()].sort((a, b) => b[1].count - a[1].count);
const rawSorted = [...rawKeyCounts.entries()].sort((a, b) => b[1] - a[1]);

function recLine(rec) {
    return `key=${JSON.stringify(rec.standardUnitKey)} unit=${JSON.stringify(rec.standardUnit)} course=${JSON.stringify(rec.course)} class=${rec._keyClass} content=${rec.contentText.length}자`;
}

const dupAuditLines = duplicateGroups.map(g => {
    const kept = `  - KEPT   id=${JSON.stringify(g.kept.id)} ${recLine(g.kept)}`;
    const skipped = g.skipped.map(s => `  - SKIP   id=${JSON.stringify(s.id)} ${recLine(s)}`).join('\n');
    return `### ${g.qKey}\n- sourceFile: ${g.sourceFile}\n${kept}\n${skipped}`;
}).join('\n\n');

const idIssueLines = fileIdIssues.map(f => {
    const dup = f.dupIds.length
        ? f.dupIds.map(d => `  - 중복 id ${JSON.stringify(d.id)} ×${d.count} (slots ${d.slots.join(',')})`).join('\n')
        : '  - 중복 id 없음';
    const empty = f.emptyIdCount ? `\n  - 빈 id 문항: ${f.emptyIdCount}건` : '';
    return `### ${f.sourceFile} (총 ${f.total}문항)\n${dup}${empty}`;
}).join('\n\n');

const invalidLines = invalidSorted.length
    ? invalidSorted.map(([k, v]) => `- \`${k}\` — ${v.count}건 (예: ${v.examples.join(', ')})`).join('\n')
    : '- 없음';

const rawLines = rawSorted.length
    ? rawSorted.map(([k, c]) => `- \`${k}\` — ${c}건`).join('\n')
    : '- 없음';

const auditMd = `# question-index 데이터 정합성 감사 (PHASE 4.5)

- 생성 시각: ${report.generatedAt}
- 생성기: archive/tools/build-question-index.mjs
- 인덱싱 범위(SCOPE): ${report.scope}
  - git 버전관리에 등재된 시험지 JS만 인덱싱(${report.examFileCount}파일).
  - .gitignore \`*textbook*\` 로 차단되는 외부 교재 문제은행과 미추적 _pro 드래프트는 정식 아카이브가 아니므로 제외(db.js 210건과 일치).
- 공식 마스터 키 수: ${OFFICIAL_KEYS.size} (중등 23 + H22 56 + H15 63)
- 원본 문항 수: ${report.sourceQuestionCount}
- 최종 인덱스 문항 수: ${index.length}
- 중복 qKey 그룹: ${duplicateGroups.length} / 제외 레코드(duplicate_skipped): ${skippedTotal}
- 최종 인덱스 중복 qKey: ${finalDupCount} (0이어야 정상)

---

## 1. duplicate_skipped (qKey 중복 제거)

> 정책: 같은 qKey가 여러 레코드면 1개만 유지(KEPT), 나머지는 제외(SKIP).
> 유지 우선순위: ①공식 키 ②unit+course 존재 ③content 길이 ④choices 길이 ⑤원본 순서.
> qKey 규칙(sourceFile_id)은 유지하며 새 키로 치환하지 않는다.
> ※ 아래 그룹의 SKIP 레코드는 대부분 "내용이 다른 별개 문항"이 동일 id를 가져 qKey가 충돌한 경우다(2번 항목 참조).

${duplicateGroups.length ? dupAuditLines : '- 중복 qKey 없음'}

---

## 2. 원본 JS id 정합성 (root cause)

> qKey 충돌의 근본 원인. 원본 시험지 JS는 이 단계에서 수정하지 않으며 여기에만 기록한다.
> 동일 파일 내 같은 id가 2회 이상 쓰이면(내용이 다르더라도) 동일 qKey가 생성되어 1건만 인덱스에 남는다.
> 후속 단계에서 원본 JS의 id 재부여가 필요하다.

${fileIdIssues.length ? idIssueLines : '- id 중복/누락 파일 없음'}

---

## 3. invalid_standard_key (비공식 표준단원키)

> 공식 마스터(142) 에 없고 RAW- 규약도 아닌 키. 검색/자동출제에서 mixer 의 getStandardizedUnit 이 "미분류"로 처리한다.
> 원문 standardUnitKey 값은 인덱스에 보존한다(별도 치환/보정 없음).
> distinct ${invalidKeyCounts.size}종 / ${keyClassTotals.invalid}건

${invalidLines}

---

## 4. RAW- 키 (임시 규약, 허용)

> 마스터 테이블이 허용하는 임시 미분류 규약(standardUnitOrder 999). 비공식 오류와 구분한다.
> distinct ${rawKeyCounts.size}종 / ${keyClassTotals.raw}건

${rawLines}

---

## 5. 필드 누락 (최종 인덱스 ${index.length}건 기준)

| 필드 | 누락 수 |
|------|--------:|
| id | ${missing.id} |
| content | ${missing.content} |
| choices(배열) | ${missing.choices} |
| level | ${missing.level} |
| standardUnit | ${missing.standardUnit} |
| standardUnitKey | ${missing.standardUnitKey} |
| standardCourse | ${missing.standardCourse} |
| tags | ${missing.tags} |
| undefined/비객체(skip) | ${report.skippedUndefined} |

## 6. 시각요소 집계 (최종 인덱스 기준)

| 기준 | 수 |
|------|---:|
| q.image 보유 | ${visualTotals.explicitImage} |
| content <img> | ${visualTotals.contentImg} |
| content <svg> | ${visualTotals.contentSvg} |
| content <table> | ${visualTotals.contentTable} |
| 시각요소 보유(hasImage=true) | ${visualTotals.hasVisual} |

> hasImage 판정은 mixer.html 의 hasVisualAsset 과 동일(image OR content 내부 img/svg/table).
`;
fs.writeFileSync(auditPath, auditMd, 'utf8');

console.log(`scope: ${report.scope}; exam files: ${report.examFileCount}`);
console.log(`question-index generated: ${index.length} questions (source ${report.sourceQuestionCount}), ${report.indexBytes} bytes`);
console.log(`duplicate_skipped: ${skippedTotal} records in ${duplicateGroups.length} groups; final duplicate qKey: ${finalDupCount}`);
console.log(`key class: official=${keyClassTotals.official} raw=${keyClassTotals.raw} invalid=${keyClassTotals.invalid} empty=${keyClassTotals.empty} (invalid distinct=${invalidKeyCounts.size})`);
console.log(`visual: image=${visualTotals.explicitImage} img=${visualTotals.contentImg} svg=${visualTotals.contentSvg} table=${visualTotals.contentTable} total=${visualTotals.hasVisual}`);
