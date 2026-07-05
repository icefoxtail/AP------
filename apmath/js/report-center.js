/**
 * AP Math OS 1.0 [js/report-center.js]
 * 리포트 센터 본체: 데이터/캐시·문항·난이도·AI 분석·문구 생성·스튜디오·모달 (report-text.js 이후 로드)
 */
/**
 * 학생의 최근 성적 평균 계산
 */
function reportCenterGetSortedStudentExamSessions(studentId) {
    return (state.db.exam_sessions || [])
        .filter(s => String(s.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));
}

function reportCenterEscape(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function reportCenterNormalizeMathText(text) {
    const raw = String(text ?? '');
    if (!raw || reportCenterLooksLikeCodeText(raw)) return raw;
    const masks = [];
    const mask = segment => {
        const key = `@@APMATH_MATH_${masks.length}@@`;
        masks.push(segment);
        return key;
    };
    let value = raw.replace(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g, mask);
    const wrap = expr => `$${expr}$`;
    const normalizeExpr = expr => String(expr || '')
        .replace(/([A-Za-z0-9])\^(?:\{([A-Za-z0-9+\-]+)\}|([A-Za-z0-9]+))/g, (_, base, braced, plain) => `${base}^{${braced || plain}}`)
        .replace(/√\s*\(([^()]+)\)/g, '\\sqrt{$1}')
        .replace(/sqrt\s*\(([^()]+)\)/gi, '\\sqrt{$1}');
    value = value.replace(/(?:√|sqrt)\s*\(([^()]+)\)/gi, match => mask(wrap(normalizeExpr(match))));
    value = value.replace(/\b([A-Za-z][A-Za-z0-9]*|\d+)\s*\/\s*([A-Za-z][A-Za-z0-9]*|\d+)\b/g, (match, left, right, offset, full) => {
        const prev = full[offset - 1] || '';
        const next = full[offset + match.length] || '';
        if (prev === '/' || next === '/' || /https?:$/i.test(full.slice(Math.max(0, offset - 8), offset))) return match;
        return wrap(`\\frac{${left}}{${right}}`);
    });
    value = value.replace(/(?<![@\w$\\])([A-Za-z][A-Za-z0-9]*(?:\^(?:\{[A-Za-z0-9+\-]+\}|[A-Za-z0-9]+))(?:\s*[+\-]\s*[A-Za-z0-9]+(?:\^(?:\{[A-Za-z0-9+\-]+\}|[A-Za-z0-9]+))?)*)/g, (match, expr) => wrap(normalizeExpr(expr).replace(/\s+/g, '')));
    return value.replace(/@@APMATH_MATH_(\d+)@@/g, (_, index) => masks[Number(index)] || '');
}

function reportCenterAttr(value) {
    return reportCenterEscape(String(value ?? ''));
}

function reportCenterNormalizeSentenceForCompare(value) {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[“”"'‘’「」『』()[\]{}<>·ㆍ,，.。!?！？:：;；/\\|~`…—–_-]/g, '')
        .replace(/(은|는|이|가|을|를|와|과|도|만|에서|으로|로|의|에|에게|께|부터|까지|처럼|보다|마다|이나|나|이며|이고|하고|하며)(?=\s|$)/g, '')
        .replace(/\s+/g, '')
        .replace(/(은|는|이|가|을|를|와|과|도|만|에서|으로|로|의|에|에게|께|부터|까지|처럼|보다|마다|이나|나|이며|이고|하고|하며|합니다|했습니다|됩니다|입니다|겠습니다)+$/g, '');
}

function reportCenterIsDuplicateText(a, b) {
    const left = reportCenterNormalizeSentenceForCompare(a);
    const right = reportCenterNormalizeSentenceForCompare(b);
    if (!left || !right) return false;
    return left === right || (Math.min(left.length, right.length) >= 18 && (left.includes(right) || right.includes(left)));
}

function reportCenterPickNonDuplicateText(primary, fallback, previousTexts = []) {
    const candidates = [primary, fallback].map(value => String(value || '').trim()).filter(Boolean);
    const previous = (Array.isArray(previousTexts) ? previousTexts : [previousTexts]).filter(Boolean);
    return candidates.find(candidate => !previous.some(text => reportCenterIsDuplicateText(candidate, text))) || '';
}

function reportCenterGetStudentClass(studentId) {
    const map = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    const cls = (state.db.classes || []).find(c => String(c.id) === String(map?.class_id));
    return { classMap: map || null, classId: map?.class_id || '', className: cls?.name || '반 미배정', cls: cls || null };
}

function reportCenterGetWrongIds(sessionId) {
    return (state.db.wrong_answers || [])
        .filter(w => String(w.session_id) === String(sessionId))
        .map(w => w.question_id)
        .sort((a, b) => Number(a) - Number(b));
}

function reportCenterFindBlueprint(session, questionNo) {
    const file = String(session?.archive_file || '').trim();
    const qNo = Number(questionNo);
    return (state.db.exam_blueprints || []).find(bp =>
        String(bp.archive_file || '') === file &&
        Number(bp.question_no) === qNo
    ) || null;
}

function reportCenterGetBlueprintSource(session, questionNo) {
    const bp = reportCenterFindBlueprint(session, questionNo);
    const sourceArchiveFile = String(bp?.source_archive_file || '').trim();
    const sourceQuestionNo = Number(bp?.source_question_no || 0);
    if (!sourceArchiveFile || !sourceQuestionNo) return null;
    return { blueprint: bp, sourceArchiveFile, sourceQuestionNo };
}

function reportCenterBuildWrongSummary(session) {
    if (!session) return [];
    const wrongIds = reportCenterGetWrongIds(session.id);
    return wrongIds.map(qNo => {
        const bp = reportCenterFindBlueprint(session, qNo);
        return {
            questionNo: qNo,
            unitKey: bp?.standard_unit_key || '',
            unit: bp?.standard_unit || '',
            course: bp?.standard_course || '',
            cluster: bp?.concept_cluster_key || ''
        };
    });
}


function reportCenterSameExamKey(session) {
    if (!session) return '';
    return [
        String(session.exam_title || '').trim(),
        String(session.exam_date || '').trim(),
        String(session.archive_file || '').trim(),
        String(session.question_count || '').trim()
    ].join('||');
}

function normalizeReportGrade(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const compact = raw.replace(/\s+/g, '');
    const middle = compact.match(/^(?:중|중등|중학교)?([123])(?:학년)?$/);
    if (middle) return `중${middle[1]}`;
    const high = compact.match(/^(?:고|고등|고등학교)([123])(?:학년)?$/);
    if (high) return `고${high[1]}`;
    return compact;
}

function reportCenterGetSessionGrade(session) {
    const student = (state.db.students || []).find(s => String(s.id) === String(session?.student_id));
    const studentGrade = normalizeReportGrade(student?.grade);
    if (studentGrade) return studentGrade;
    const classInfo = reportCenterGetStudentClass(session?.student_id);
    return normalizeReportGrade(classInfo.cls?.grade);
}

function reportCenterGetExamIdentity(session) {
    if (!session) return null;
    const archiveFile = String(session.archive_file || '').trim();
    const examTitle = String(session.exam_title || '').trim();
    const examDate = String(session.exam_date || '').trim();
    const questionCount = Number(session.question_count || 0);
    if (archiveFile) return { scope: 'grade_archive_exam', archiveFile };
    if (examTitle && examDate && questionCount) return { scope: 'grade_title_date_question_count', examTitle, examDate, questionCount };
    if (examTitle && examDate) return { scope: 'grade_title_date', examTitle, examDate };
    return null;
}

function isSameReportExam(baseSession, candidateSession) {
    const identity = reportCenterGetExamIdentity(baseSession);
    if (!identity || !candidateSession) return false;
    if (identity.scope === 'grade_archive_exam') {
        return String(candidateSession.archive_file || '').trim() === identity.archiveFile;
    }
    if (String(candidateSession.exam_title || '').trim() !== identity.examTitle) return false;
    if (String(candidateSession.exam_date || '').trim() !== identity.examDate) return false;
    if (identity.scope === 'grade_title_date_question_count') {
        return Number(candidateSession.question_count || 0) === identity.questionCount;
    }
    return true;
}

function isValidReportScore(session) {
    return Number.isFinite(Number(session?.score));
}

function buildGradeArchiveExamCohort(session) {
    if (!session) return [];
    const grade = reportCenterGetSessionGrade(session);
    const cohort = (state.db.exam_sessions || []).filter(e => {
        if (!isSameReportExam(session, e) || !isValidReportScore(e)) return false;
        return !grade || reportCenterGetSessionGrade(e) === grade;
    });
    return cohort.length ? cohort : (state.db.exam_sessions || []).filter(e => isSameReportExam(session, e) && isValidReportScore(e));
}

function reportCenterGetSameExamSessions(session) {
    return buildGradeArchiveExamCohort(session);
}

function reportCenterGetClassExamSessions(session, classId) {
    const same = reportCenterGetSameExamSessions(session);
    if (!classId) return same;
    const classStudentIds = new Set((state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id)));
    if (!classStudentIds.size) return [];
    return same.filter(e => classStudentIds.has(String(e.student_id)));
}

function reportCenterGetWrongSetBySession(sessionId) {
    return new Set(reportCenterGetWrongIds(sessionId).map(v => String(v)));
}

function calculateReportAverage(list) {
    const nums = (list || []).map(e => Number(e.score)).filter(v => Number.isFinite(v));
    return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
}

function calculateReportRank(session, list) {
    const score = Number(session?.score);
    if (!Number.isFinite(score)) return null;
    const scores = (list || []).map(e => Number(e.score)).filter(v => Number.isFinite(v));
    return scores.length ? scores.filter(v => v > score).length + 1 : null;
}

function buildReportCohortSummary(session, fallbackSessions = []) {
    const serverSummary = (state.db.report_exam_cohort_stats || [])
        .find(row => String(row.session_id) === String(session?.id));
    if (serverSummary) {
        return {
            cohortScope: serverSummary.cohortScope || 'grade_archive_exam',
            gradeExamAverage: Number.isFinite(Number(serverSummary.gradeExamAverage)) ? Number(serverSummary.gradeExamAverage) : null,
            gradeExamRank: Number.isFinite(Number(serverSummary.gradeExamRank)) ? Number(serverSummary.gradeExamRank) : null,
            gradeExamCount: Number(serverSummary.gradeExamCount || serverSummary.totalSubmitted || 0),
            questionStats: Array.isArray(serverSummary.questionStats) ? serverSummary.questionStats : []
        };
    }
    return {
        cohortScope: reportCenterGetExamIdentity(session)?.scope || 'class_fallback',
        gradeExamAverage: calculateReportAverage(fallbackSessions),
        gradeExamRank: calculateReportRank(session, fallbackSessions),
        gradeExamCount: (fallbackSessions || []).length,
        questionStats: []
    };
}

function reportCenterGetQuestionDifficultyLabel(correctRate) {
    if (!Number.isFinite(correctRate)) return '자료 부족';
    if (correctRate >= 85) return '쉬움';
    if (correctRate >= 65) return '보통';
    if (correctRate >= 45) return '어려움';
    return '매우 어려움';
}

function reportCenterGetWrongMeaning(correctRate, isStudentWrong) {
    if (!isStudentWrong) return '정답 처리';
    if (!Number.isFinite(correctRate)) return '비교 자료 부족';
    if (correctRate >= 85) return '개인 실수 가능성 큼';
    if (correctRate >= 65) return '주의 필요한 실수';
    if (correctRate >= 45) return '난도 있는 문항 오답';
    return '대부분 어려워한 문항';
}

function reportCenterBuildQuestionStats(session) {
    if (!session) {
        return { totalSessions: 0, classSessions: 0, rows: [], wrongRows: [], bucket: {}, overallAvg: null, classAvg: null };
    }

    const classInfo = reportCenterGetStudentClass(session.student_id);
    const allSessions = reportCenterGetSameExamSessions(session);
    const classSessions = reportCenterGetClassExamSessions(session, classInfo.classId);
    const cohortSummary = buildReportCohortSummary(session, allSessions);
    const serverQuestionStats = new Map((cohortSummary.questionStats || [])
        .map(row => [String(row.questionNo), row]));
    const studentWrongSet = reportCenterGetWrongSetBySession(session.id);
    const qCount = Number(session.question_count || 0);
    const maxQuestionNo = qCount || Math.max(
        0,
        ...reportCenterGetWrongIds(session.id).map(v => Number(v) || 0),
        ...(cohortSummary.questionStats || []).map(row => Number(row.questionNo) || 0),
        ...(state.db.wrong_answers || [])
            .filter(w => allSessions.some(e => String(e.id) === String(w.session_id)))
            .map(w => Number(w.question_id) || 0)
    );

    const allSessionIds = new Set(allSessions.map(e => String(e.id)));
    const classSessionIds = new Set(classSessions.map(e => String(e.id)));
    const allWrongRows = (state.db.wrong_answers || []).filter(w => allSessionIds.has(String(w.session_id)));
    const classWrongRows = (state.db.wrong_answers || []).filter(w => classSessionIds.has(String(w.session_id)));

    const rows = [];
    for (let i = 1; i <= maxQuestionNo; i++) {
        const q = String(i);
        const serverQuestion = serverQuestionStats.get(q);
        const localWrongCount = allWrongRows.filter(w => String(w.question_id) === q).length;
        const wrongCount = serverQuestion ? Number(serverQuestion.wrongCount || 0) : localWrongCount;
        const classWrongCount = classWrongRows.filter(w => String(w.question_id) === q).length;
        const correctRate = serverQuestion && Number.isFinite(Number(serverQuestion.correctRate))
            ? Number(serverQuestion.correctRate)
            : (allSessions.length ? Math.round(((allSessions.length - wrongCount) / allSessions.length) * 100) : null);
        const classCorrectRate = classSessions.length ? Math.round(((classSessions.length - classWrongCount) / classSessions.length) * 100) : null;
        const bp = reportCenterFindBlueprint(session, i);
        const isStudentWrong = studentWrongSet.has(q);
        rows.push({
            questionNo: i,
            isStudentWrong,
            wrongCount,
            correctRate,
            classWrongCount,
            classCorrectRate,
            difficulty: reportCenterGetQuestionDifficultyLabel(correctRate),
            meaning: reportCenterGetWrongMeaning(correctRate, isStudentWrong),
            unitKey: bp?.standard_unit_key || '',
            unit: bp?.standard_unit || '',
            course: bp?.standard_course || '',
            cluster: bp?.concept_cluster_key || ''
        });
    }

    const bucket = rows.reduce((acc, row) => {
        acc[row.difficulty] = (acc[row.difficulty] || 0) + 1;
        return acc;
    }, {});

    return {
        totalSessions: cohortSummary.gradeExamCount || allSessions.length,
        classSessions: classSessions.length,
        rows,
        wrongRows: rows.filter(r => r.isStudentWrong),
        bucket,
        overallAvg: cohortSummary.gradeExamAverage,
        classAvg: calculateReportAverage(classSessions),
        gradeExamAverage: cohortSummary.gradeExamAverage,
        gradeExamRank: cohortSummary.gradeExamRank,
        gradeExamCount: cohortSummary.gradeExamCount || allSessions.length,
        cohortScope: cohortSummary.cohortScope,
        className: classInfo.className
    };
}

function reportCenterBuildDifficultyChartHtml(stats) {
    if (!stats || !stats.rows || !stats.rows.length) return '';
    const order = ['쉬움', '보통', '어려움', '매우 어려움', '자료 부족'];
    const max = Math.max(1, ...order.map(k => stats.bucket[k] || 0));
    return `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px; display:flex; flex-direction:column; gap:9px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div style="font-size:13px; font-weight:700; color:var(--text);">문항 난이도 분포</div>
                <div style="font-size:11px; font-weight:700; color:var(--secondary);">전체 제출 ${reportCenterEscape(stats.totalSessions)}명 기준</div>
            </div>
            ${order.map(label => {
                const count = stats.bucket[label] || 0;
                const width = Math.max(3, Math.round((count / max) * 100));
                return `
                    <div style="display:grid; grid-template-columns:64px 1fr 34px; gap:8px; align-items:center;">
                        <div style="font-size:11px; font-weight:700; color:var(--secondary);">${label}</div>
                        <div style="height:9px; border-radius:999px; background:var(--surface-2); overflow:hidden; border:1px solid var(--border);">
                            <div style="height:100%; width:${width}%; border-radius:999px; background:var(--primary);"></div>
                        </div>
                        <div style="font-size:11px; font-weight:700; color:var(--text); text-align:right;">${count}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}


// ─────────────────────────────────────────
// [Report Center v3] 아카이브 문항 원문 연결
// ─────────────────────────────────────────

const REPORT_CENTER_ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';
const REPORT_CENTER_ARCHIVE_INDEX_URL = 'https://icefoxtail.github.io/AP------/archive/index';
const REPORT_CENTER_ARCHIVE_MIXER_URL = 'https://icefoxtail.github.io/AP------/archive/mixer.html';

function reportCenterArchiveCache() {
    window.AP_REPORT_ARCHIVE_CACHE = window.AP_REPORT_ARCHIVE_CACHE || {};
    return window.AP_REPORT_ARCHIVE_CACHE;
}

function reportCenterArchiveBankCache() {
    window.AP_REPORT_ARCHIVE_BANK_CACHE = window.AP_REPORT_ARCHIVE_BANK_CACHE || {};
    return window.AP_REPORT_ARCHIVE_BANK_CACHE;
}

function reportCenterGetCachedArchiveDetails(sessionId) {
    return reportCenterArchiveCache()[String(sessionId || '')] || null;
}

function reportCenterSetCachedArchiveDetails(sessionId, payload) {
    if (!sessionId) return payload;
    reportCenterArchiveCache()[String(sessionId)] = payload;
    return payload;
}

function reportCenterEncodeArchivePath(path) {
    return String(path || '')
        .split('/')
        .filter(Boolean)
        .map(part => encodeURIComponent(part))
        .join('/');
}

// 문항 이미지는 시험 js 파일과 같은 디렉터리 기준의 상대경로(예: "images/xxx.png").
// archiveInfo.url(전체 js URL)의 디렉터리에 상대경로를 이어붙여 절대 URL로 만든다.
function reportCenterResolveArchiveImageUrl(archiveInfo, image) {
    const src = String(image || '').trim();
    if (!src) return '';
    if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) return src;
    const rel = src.replace(/^\.\//, '').replace(/^\//, '').replace(/^archive\//i, '');
    // 실제 데이터는 image를 아카이브 루트 기준으로 저장한다(예: "assets/images/<학교>/q16.png").
    // assets/·data/·exams/ 로 시작하면 아카이브 루트 기준, 그 외(bare "images/…")만 시험 js 디렉터리 기준.
    if (/^(assets|data|exams)\//i.test(rel)) {
        return REPORT_CENTER_ARCHIVE_BASE_URL + reportCenterEncodeArchivePath(rel);
    }
    const baseUrl = String(archiveInfo?.url || '').trim();
    if (!baseUrl) return '';
    const dir = baseUrl.replace(/[?#].*$/, '').replace(/[^/]*$/, '');
    return dir + reportCenterEncodeArchivePath(rel);
}

function reportCenterNormalizeArchiveFile(raw) {
    const original = String(raw || '').trim();
    if (!original) {
        return { ok: false, type: 'none', original, path: '', url: '', message: '연결된 아카이브 파일이 없습니다.' };
    }

    if (/^MIXED:/i.test(original)) {
        return {
            ok: false,
            type: 'mixed',
            original,
            path: '',
            url: REPORT_CENTER_ARCHIVE_MIXER_URL,
            message: '믹서 출제물은 원본 문항 매핑 정보가 있어야 문항 원문을 직접 확인할 수 있습니다.'
        };
    }

    if (/^https?:\/\//i.test(original)) {
        return { ok: true, type: 'url', original, path: original, url: original, message: '' };
    }

    let path = original
        .replace(/^\.\//, '')
        .replace(/^\//, '')
        .replace(/^archive\//, '');

    if (!path.endsWith('.js')) path += '.js';
    if (!path.startsWith('exams/') && !path.startsWith('assets/') && !path.startsWith('data/')) {
        path = `exams/${path}`;
    }

    return {
        ok: true,
        type: 'archive',
        original,
        path,
        url: REPORT_CENTER_ARCHIVE_BASE_URL + reportCenterEncodeArchivePath(path),
        message: ''
    };
}

function reportCenterNormalizeExamAnalysisArchiveKey(raw) {
    const info = reportCenterNormalizeArchiveFile(raw || '');
    if (info.ok && info.path) return info.path;
    return String(info.original || raw || '').trim();
}

function reportCenterArchiveKeyCandidates(raw) {
    const key = reportCenterNormalizeExamAnalysisArchiveKey(raw);
    const candidates = new Set([key, String(raw || '').trim()]);
    if (key.startsWith('exams/')) candidates.add(key.replace(/^exams\//, ''));
    const info = reportCenterNormalizeArchiveFile(raw || '');
    if (info.path) candidates.add(info.path);
    if (info.original) candidates.add(info.original);
    return Array.from(candidates).filter(Boolean);
}

function reportCenterExamAnalysisUpdatedBy() {
    return state?.auth?.id || state?.auth?.name || 'local';
}

function reportCenterGetExamReviews(archiveFile) {
    const candidates = new Set(reportCenterArchiveKeyCandidates(archiveFile));
    const reviews = Array.isArray(state?.db?.exam_question_reviews) ? state.db.exam_question_reviews : [];
    const metas = Array.isArray(state?.db?.exam_analysis_meta) ? state.db.exam_analysis_meta : [];
    const meta = metas.find(row => candidates.has(String(row?.archive_file || '').trim())) || null;
    const byQuestion = new Map();
    reviews.forEach(row => {
        if (!candidates.has(String(row?.archive_file || '').trim())) return;
        const questionNo = String(row?.question_no ?? row?.questionNo ?? '').trim();
        if (!questionNo) return;
        byQuestion.set(questionNo, row);
    });
    return { meta, byQuestion };
}

function reportCenterUpsertExamReview(archiveFile, questionNo, patch = {}) {
    if (!state.db) state.db = {};
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const qNo = String(questionNo ?? '').trim();
    if (!archiveKey || !qNo) return null;
    const rows = Array.isArray(state.db.exam_question_reviews) ? state.db.exam_question_reviews : [];
    const now = new Date().toISOString();
    const next = {
        archive_file: archiveKey,
        question_no: qNo,
        ...(rows.find(row => String(row?.archive_file || '') === archiveKey && String(row?.question_no ?? row?.questionNo ?? '') === qNo) || {}),
        ...(patch && typeof patch === 'object' ? patch : {}),
        archive_file: archiveKey,
        question_no: qNo,
        updated_at: now,
        updated_by: patch?.updated_by || reportCenterExamAnalysisUpdatedBy()
    };
    const idx = rows.findIndex(row => String(row?.archive_file || '') === archiveKey && String(row?.question_no ?? row?.questionNo ?? '') === qNo);
    state.db.exam_question_reviews = idx >= 0
        ? rows.map((row, index) => index === idx ? next : row)
        : [...rows, next];
    return next;
}

function reportCenterUpsertExamMeta(archiveFile, patch = {}) {
    if (!state.db) state.db = {};
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (!archiveKey) return null;
    const rows = Array.isArray(state.db.exam_analysis_meta) ? state.db.exam_analysis_meta : [];
    const now = new Date().toISOString();
    const next = {
        archive_file: archiveKey,
        ...(rows.find(row => String(row?.archive_file || '') === archiveKey) || {}),
        ...(patch && typeof patch === 'object' ? patch : {}),
        archive_file: archiveKey,
        updated_at: now,
        updated_by: patch?.updated_by || reportCenterExamAnalysisUpdatedBy()
    };
    const idx = rows.findIndex(row => String(row?.archive_file || '') === archiveKey);
    state.db.exam_analysis_meta = idx >= 0
        ? rows.map((row, index) => index === idx ? next : row)
        : [...rows, next];
    return next;
}

function reportCenterBuildExamAnalysisFallbackOverview(archiveFile, rows = []) {
    const count = rows.length;
    const rates = rows.map(row => row.correctRate).filter(Number.isFinite);
    const avg = rates.length ? Math.round(rates.reduce((sum, rate) => sum + rate, 0) / rates.length) : null;
    const hardCount = rates.filter(rate => rate < 60).length;
    const unitNames = Array.from(new Set(rows.map(row => row.unit).filter(Boolean))).slice(0, 4);
    if (!count) return '분석할 문항 정보가 아직 없습니다.';
    const unitText = unitNames.length ? ` 주요 단원은 ${unitNames.join(', ')}입니다.` : '';
    const rateText = avg === null ? '정답률 비교 자료는 아직 충분하지 않습니다.' : `평균 정답률은 ${avg}%입니다.`;
    const hardText = hardCount ? ` 다시 확인할 문항은 ${hardCount}개입니다.` : ' 전반적으로 안정적으로 해결된 문항 구성입니다.';
    return `${count}개 문항 기준으로 정리했습니다. ${rateText}${hardText}${unitText}`;
}

function reportCenterBuildExamAnalysisArticle(archiveFile, opts = {}) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const candidates = new Set(reportCenterArchiveKeyCandidates(archiveFile));
    const blueprints = (Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [])
        .filter(row => candidates.has(String(row?.archive_file || '').trim()) || candidates.has(reportCenterNormalizeExamAnalysisArchiveKey(row?.archive_file || '')))
        .sort((a, b) => Number(a.question_no || a.questionNo || 0) - Number(b.question_no || b.questionNo || 0));
    const sessions = (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => candidates.has(String(session?.archive_file || '').trim()) || candidates.has(reportCenterNormalizeExamAnalysisArchiveKey(session?.archive_file || '')));
    const wrongs = Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : [];
    const store = reportCenterGetExamReviews(archiveFile);
    const total = sessions.length;
    const rows = blueprints.map(bp => {
        const qNo = String(bp.question_no ?? bp.questionNo ?? '').trim();
        const wrongCount = wrongs.filter(w => sessions.some(s => String(s.id) === String(w.session_id)) && String(w.question_id ?? w.question_no ?? w.questionNo) === qNo).length;
        const correctRate = total ? Math.round(((total - wrongCount) / total) * 100) : null;
        const saved = store.byQuestion.get(qNo) || null;
        return {
            questionNo: qNo,
            unit: bp.standard_unit || bp.unit || bp.unit_name || bp.standardUnit || '',
            level: bp.level || bp.difficulty || '',
            correctRate,
            classCorrectRate: correctRate,
            contentText: bp.content_text || bp.content || '',
            choices: Array.isArray(bp.choices) ? bp.choices : [],
            answer: saved?.answer || bp.answer || '',
            solutionText: bp.solution_text || bp.solution || '',
            reviewText: saved?.review_text || saved?.reviewText || ''
        };
    });
    const overviewText = store.meta?.overview_text || reportCenterBuildExamAnalysisFallbackOverview(archiveKey, rows);
    const unitCounts = new Map();
    rows.forEach(row => {
        const unit = row.unit || '단원 미지정';
        unitCounts.set(unit, (unitCounts.get(unit) || 0) + 1);
    });
    const unitItems = Array.from(unitCounts.entries())
        .map(([unit, count]) => `<li>${reportCenterEscape(unit)} <b>${count}</b></li>`)
        .join('');
    const cards = rows.map(row => reportCenterBuildQuestionReviewCard(row, {
        anonymized: true,
        showAnswer: opts.showAnswer !== false,
        showContent: opts.showContent !== false,
        showSolution: opts.showSolution !== false
    })).join('');
    return `
        <article class="aprc-exam-article" data-archive-file="${reportCenterAttr(archiveKey)}">
            <header class="aprc-exam-article-head">
                <h1>${reportCenterEscape(opts.title || '시험지 분석')}</h1>
                <p>${reportCenterArchiveTextToHtml(overviewText)}</p>
            </header>
            <section class="aprc-exam-article-stats">
                <div>문항 <b>${rows.length}</b></div>
                <div>응시 기록 <b>${total}</b></div>
            </section>
            ${unitItems ? `<section class="aprc-exam-article-units"><h2>단원 분포</h2><ul>${unitItems}</ul></section>` : ''}
            <section class="aprc-exam-article-questions">
                <h2>문항별 리뷰</h2>
                <div class="aprc-qreview-list">${cards}</div>
            </section>
        </article>
    `;
}

async function reportCenterCopyExamAnalysisArticle(archiveFile) {
    const html = reportCenterBuildExamAnalysisArticle(archiveFile);
    await reportCenterCopyText(html, '시험지 분석 HTML을 복사했습니다.');
    return html;
}

function reportCenterStripHtml(value) {
    const html = String(value || '');
    if (!html) return '';
    try {
        const div = document.createElement('div');
        div.innerHTML = html;
        return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
    } catch (e) {
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

function reportCenterLimitText(value, limit = 220) {
    const text = reportCenterStripHtml(value);
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function reportCenterTrimText(value, limit = 120) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function reportCenterClampText(value, limit = 220) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const max = Number(limit);
    if (!Number.isFinite(max) || max <= 0) return text;
    return text.length > max ? `${text.slice(0, Math.max(1, max - 1)).trim()}…` : text;
}

function reportCenterEnsureParentOpening(value) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    if (/^어머님[,，]?\s*안녕하세요[.!?。！？]?/.test(text)) return text;
    if (/^안녕하세요[,.]?\s*/.test(text)) return text.replace(/^안녕하세요[,.]?\s*/, '어머님, 안녕하세요. ');
    return `어머님, 안녕하세요. ${text}`;
}

function reportCenterExtractQuestionBankFromText(jsText) {
    const sandboxWindow = { questionBank: null, __questionBank: null };
    const sandboxDocument = {
        createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
        head: { appendChild() {} },
        body: { appendChild() {} },
        addEventListener() {},
        querySelector: () => null,
        querySelectorAll: () => []
    };

    try {
        const fn = new Function('window', 'document', `${jsText}\n;return window.questionBank || window.__questionBank || (typeof questionBank !== 'undefined' ? questionBank : null);`);
        return fn(sandboxWindow, sandboxDocument);
    } catch (e) {
        console.warn('[reportCenterExtractQuestionBankFromText] failed:', e);
        return null;
    }
}

function reportCenterNormalizeQuestionBank(bank) {
    if (Array.isArray(bank)) return bank;
    if (!bank || typeof bank !== 'object') return [];
    if (Array.isArray(bank.questions)) return bank.questions;
    if (Array.isArray(bank.items)) return bank.items;
    if (Array.isArray(bank.data)) return bank.data;
    return Object.values(bank).filter(v => v && typeof v === 'object');
}

function reportCenterGetQuestionNoValue(question, fallbackIndex) {
    const candidates = [
        question?.questionNo,
        question?.question_no,
        question?.no,
        question?.number,
        question?.qno,
        question?.qid,
        question?.id
    ];
    for (const value of candidates) {
        const match = String(value ?? '').match(/\d+/);
        if (match) return Number(match[0]);
    }
    return fallbackIndex + 1;
}

function reportCenterFindQuestionInBank(bank, questionNo) {
    const list = reportCenterNormalizeQuestionBank(bank);
    const qNo = Number(questionNo);
    if (!qNo || !list.length) return null;

    const direct = list.find((q, idx) => reportCenterGetQuestionNoValue(q, idx) === qNo);
    if (direct) return direct;

    return list[qNo - 1] || null;
}

function reportCenterNormalizeQuestionDetail(question, questionNo, statRow = null) {
    if (!question) {
        return {
            questionNo,
            found: false,
            content: '',
            contentText: '',
            choices: [],
            answer: '',
            solution: '',
            solutionText: '',
            image: '',
            imageSize: null,
            level: statRow?.difficulty || '',
            unit: statRow?.unit || '',
            unitKey: statRow?.unitKey || '',
            cluster: statRow?.cluster || '',
            correctRate: statRow?.correctRate ?? null,
            classCorrectRate: statRow?.classCorrectRate ?? null,
            meaning: statRow?.meaning || '문항 원문 확인 불가'
        };
    }

    const choices = Array.isArray(question.choices)
        ? question.choices
        : Array.isArray(question.options)
            ? question.options
            : [];

    return {
        questionNo,
        found: true,
        content: question.content || question.question || question.text || question.prompt || '',
        contentText: reportCenterLimitText(question.content || question.question || question.text || question.prompt || '', 260),
        choices: choices.map(v => reportCenterLimitText(v, 120)),
        answer: question.answer ?? question.correctAnswer ?? question.correct ?? question.ans ?? '',
        solution: question.solution || question.explanation || question.commentary || '',
        solutionText: reportCenterLimitText(question.solution || question.explanation || question.commentary || '', 260),
        image: question.image || question.imageUrl || question.img || question.figure || '',
        imageSize: question.imageSize || null,
        level: question.level || question.difficulty || statRow?.difficulty || '',
        unit: question.standardUnit || question.standard_unit || question.unit || statRow?.unit || '',
        unitKey: question.standardUnitKey || question.standard_unit_key || statRow?.unitKey || '',
        cluster: question.conceptClusterKey || question.concept_cluster_key || statRow?.cluster || '',
        correctRate: statRow?.correctRate ?? null,
        classCorrectRate: statRow?.classCorrectRate ?? null,
        meaning: statRow?.meaning || ''
    };
}

async function reportCenterFetchArchiveBankByFile(rawArchiveFile) {
    const archiveInfo = reportCenterNormalizeArchiveFile(rawArchiveFile || '');
    if (!archiveInfo.ok) {
        return {
            ok: false,
            archiveInfo,
            list: [],
            message: archiveInfo.message || '아카이브 파일을 확인할 수 없습니다.'
        };
    }

    const cacheKey = archiveInfo.url || archiveInfo.path || archiveInfo.original;
    const cached = reportCenterArchiveBankCache()[cacheKey];
    if (cached) return cached;

    try {
        const res = await fetch(archiveInfo.url, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const jsText = await res.text();
        const bank = reportCenterExtractQuestionBankFromText(jsText);
        const list = reportCenterNormalizeQuestionBank(bank);
        if (!list.length) throw new Error('questionBank empty');

        const payload = {
            ok: true,
            archiveInfo,
            list,
            totalQuestions: list.length,
            message: '아카이브 문항 원문을 불러왔습니다.'
        };
        reportCenterArchiveBankCache()[cacheKey] = payload;
        return payload;
    } catch (e) {
        const message = String(e?.message || '');
        const isNotFound = message.includes('HTTP 404');
        if (isNotFound) {
            console.info('[reportCenterFetchArchiveBankByFile] archive file not found:', archiveInfo.original || archiveInfo.path || archiveInfo.url);
        } else {
            console.warn('[reportCenterFetchArchiveBankByFile] failed:', e);
        }
        const payload = {
            ok: false,
            archiveInfo,
            list: [],
            message: isNotFound ? '문항 원문 파일을 찾을 수 없습니다.' : '문항 원문 로드 중 오류가 발생했습니다.'
        };
        reportCenterArchiveBankCache()[cacheKey] = payload;
        return payload;
    }
}

async function reportCenterBuildMixedArchiveQuestionDetails(session, wrongRows, archiveInfo) {
    let mappedCount = 0;
    let loadedCount = 0;

    const details = await Promise.all((wrongRows || []).map(async row => {
        const source = reportCenterGetBlueprintSource(session, row.questionNo);
        if (!source) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        mappedCount += 1;
        const sourcePayload = await reportCenterFetchArchiveBankByFile(source.sourceArchiveFile);
        if (!sourcePayload.ok) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        const question = reportCenterFindQuestionInBank(sourcePayload.list, source.sourceQuestionNo);
        if (!question) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        loadedCount += 1;
        return reportCenterNormalizeQuestionDetail(question, row.questionNo, row);
    }));

    return {
        ok: loadedCount > 0,
        status: loadedCount > 0 ? 'mixed-loaded' : 'mixed',
        archiveInfo,
        message: loadedCount > 0
            ? '믹서 출제물 원본 문항을 매핑을 통해 불러왔습니다.'
            : archiveInfo.message,
        details,
        mappedCount,
        loadedCount
    };
}

async function reportCenterFetchArchiveQuestionDetails(session) {
    if (!session) {
        return { ok: false, status: 'no-session', message: '평가 기록을 찾을 수 없습니다.', details: [] };
    }

    const cached = reportCenterGetCachedArchiveDetails(session.id);
    if (cached) return cached;

    const archiveInfo = reportCenterNormalizeArchiveFile(session.archive_file || '');
    const stats = reportCenterBuildQuestionStats(session);
    const wrongRows = stats.wrongRows || [];

    if (archiveInfo.type === 'mixed') {
        const payload = await reportCenterBuildMixedArchiveQuestionDetails(session, wrongRows, archiveInfo);
        return reportCenterSetCachedArchiveDetails(session.id, payload);
    }

    if (!archiveInfo.ok) {
        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: false,
            status: archiveInfo.type,
            archiveInfo,
            message: archiveInfo.message,
            details: wrongRows.map(row => reportCenterNormalizeQuestionDetail(null, row.questionNo, row))
        });
    }

    try {
        const sourcePayload = await reportCenterFetchArchiveBankByFile(session.archive_file || '');
        if (!sourcePayload.ok) throw new Error(sourcePayload.message || 'archive load failed');
        const list = sourcePayload.list;
        const details = wrongRows.map(row => {
            const q = reportCenterFindQuestionInBank(list, row.questionNo);
            return reportCenterNormalizeQuestionDetail(q, row.questionNo, row);
        });

        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: true,
            status: 'loaded',
            archiveInfo: sourcePayload.archiveInfo || archiveInfo,
            message: sourcePayload.message || '아카이브 문항 원문을 불러왔습니다.',
            totalQuestions: list.length,
            details
        });
    } catch (e) {
        const message = String(e?.message || '');
        const isNotFound = message.includes('HTTP 404');
        if (isNotFound) {
            console.info('[reportCenterFetchArchiveQuestionDetails] archive file not found; fallback to stats-only analysis.');
        } else {
            console.warn('[reportCenterFetchArchiveQuestionDetails] failed:', e);
        }
        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: false,
            status: isNotFound ? 'not-found' : 'fetch-failed',
            archiveInfo,
            message: '문항 원문 확인 불가 — 오답 번호/단원/정답률 기준 분석으로 표시합니다.',
            details: wrongRows.map(row => reportCenterNormalizeQuestionDetail(null, row.questionNo, row))
        });
    }
}

function reportCenterBuildArchiveSummaryText(detailsPayload) {
    if (!detailsPayload || !Array.isArray(detailsPayload.details) || !detailsPayload.details.length) return '';
    const lines = detailsPayload.details.map(d => {
        const rate = Number.isFinite(d.correctRate) ? `전체 정답률 ${d.correctRate}%` : '전체 정답률 자료 부족';
        const unit = d.unit ? ` / ${d.unit}` : '';
        const level = d.level ? ` / 난이도 ${d.level}` : '';
        const content = d.contentText ? ` / 문항: ${d.contentText}` : ' / 문항 원문 확인 불가';
        const answer = d.answer !== '' && d.answer !== null && d.answer !== undefined ? ` / 정답: ${d.answer}` : '';
        return `- ${d.questionNo}번${unit}${level}: ${rate} · ${d.meaning || '-'}${answer}${content}`;
    });
    return `[아카이브 문항 원문 확인]\n${lines.join('\n')}`;
}

function reportCenterPreserveArchiveText(value) {
    if (typeof value === 'function') return '';
    if (value && typeof value === 'object') return '';

    let text = String(value || '');

    text = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n')
        .replace(/<[^>]*>/g, ' ');

    text = text
        .replace(/([.?!\]）\)])\s*(ㄱ\.)/g, '$1\n$2')
        .replace(/\s*(ㄱ\.|ㄴ\.|ㄷ\.|ㄹ\.|ㅁ\.|ㅂ\.|ㅅ\.|ㅇ\.)\s*/g, '\n$1 ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    return text;
}

function reportCenterArchiveTextToHtml(value) {
    const text = reportCenterPreserveArchiveText(value);
    if (!text || reportCenterLooksLikeCodeText(text)) return '';
    return reportCenterEscape(reportCenterNormalizeMathText(text)).replace(/\n/g, '<br>');
}

function reportCenterEnsureMathJax() {
    return new Promise(resolve => {
        if (window.MathJax?.typesetPromise) {
            resolve(window.MathJax);
            return;
        }

        if (document.getElementById('report-center-mathjax-script')) {
            let attempts = 0;
            const wait = () => {
                if (window.MathJax?.typesetPromise) resolve(window.MathJax);
                else if (attempts++ > 80) resolve(null);
                else setTimeout(wait, 80);
            };
            wait();
            return;
        }

        window.MathJax = window.MathJax || {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
            },
            svg: { fontCache: 'global' }
        };

        const script = document.createElement('script');
        script.id = 'report-center-mathjax-script';
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        script.async = true;
        script.onload = () => resolve(window.MathJax);
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
    });
}

async function reportCenterTypesetMath(root) {
    const target = root || document.body;
    if (!target) return;
    const mj = await reportCenterEnsureMathJax();
    if (!mj?.typesetPromise) return;
    try {
        await mj.typesetPromise([target]);
    } catch (e) {
        console.warn('[reportCenterTypesetMath] MathJax failed:', e);
    }
}

async function reportCenterRenderMathInArchiveDetails() {
    const root = document.getElementById('report-center-archive-details');
    if (!root) return;
    await reportCenterTypesetMath(root);
}

function reportCenterRenderArchiveDetails(detailsPayload) {
    const root = document.getElementById('report-center-archive-details');
    if (!root) return;

    if (!detailsPayload) {
        root.innerHTML = '';
        return;
    }

    const archiveInfo = detailsPayload.archiveInfo || {};
    const detailRows = Array.isArray(detailsPayload.details) && detailsPayload.details.length
        ? detailsPayload.details.map(d => {
            const contentHtml = reportCenterArchiveTextToHtml(d.content);
            const answerHtml = reportCenterArchiveTextToHtml(d.answer);
            const answerRowHtml = answerHtml
                ? `<div style="font-size:12px; color:var(--primary); font-weight:700; margin-top:7px;">정답: <span class="report-archive-answer">${answerHtml}</span></div>`
                : '';
            return `
            <div style="padding:12px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
                    <div style="font-size:13px; font-weight:700; color:var(--text);">${reportCenterEscape(d.questionNo)}번 ${d.unit ? `· ${reportCenterEscape(d.unit)}` : ''}</div>
                    <div style="font-size:11px; font-weight:700; color:${d.found ? 'var(--primary)' : 'var(--secondary)'}; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 8px;">${d.found ? '원문 확인' : '원문 없음'}</div>
                </div>
                <div style="font-size:12px; color:var(--secondary); font-weight:700; margin-top:6px; line-height:1.55;">
                    ${Number.isFinite(d.correctRate) ? `전체 정답률 ${d.correctRate}%` : '전체 정답률 -'}${Number.isFinite(d.classCorrectRate) ? ` · 반 정답률 ${d.classCorrectRate}%` : ''} · ${reportCenterEscape(d.meaning || '-')}
                </div>
                ${contentHtml ? `<div class="report-archive-question-text" style="font-size:12px; color:var(--text); line-height:1.65; margin-top:8px; background:var(--surface-2); border-radius:10px; padding:9px 10px; white-space:normal;">${contentHtml}</div>` : ''}
                ${d.image && reportCenterResolveArchiveImageUrl(archiveInfo, d.image) ? `<img src="${reportCenterAttr(reportCenterResolveArchiveImageUrl(archiveInfo, d.image))}" alt="${reportCenterEscape(d.questionNo)}번 문항 그림" loading="lazy" style="max-width:100%; margin-top:8px; border-radius:10px; border:1px solid var(--border);" onerror="this.style.display='none'">` : ''}
                ${answerRowHtml}
                ${d.solutionText ? `<div style="font-size:12px; color:var(--secondary); line-height:1.6; margin-top:7px;">해설 요약: ${reportCenterEscape(d.solutionText)}</div>` : ''}
            </div>
        `;
        }).join('')
        : `<div style="padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">표시할 오답 문항이 없습니다.</div>`;

    root.innerHTML = `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                <div>
                    <div style="font-size:13px; font-weight:700; color:var(--text);">아카이브 문항 원문</div>
                    <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:3px; line-height:1.5;">${reportCenterEscape(detailsPayload.message || '')}</div>
                </div>
                <a href="${reportCenterAttr(archiveInfo.url || REPORT_CENTER_ARCHIVE_INDEX_URL)}" target="_blank" rel="noopener" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; white-space:nowrap;">아카이브 열기</a>
            </div>
            <div style="font-size:11px; color:var(--secondary); font-weight:700; word-break:break-all; margin-bottom:8px;">${reportCenterEscape(archiveInfo.original || archiveInfo.path || '')}</div>
            ${detailRows}
            <button class="btn" style="width:100%; min-height:42px; margin-top:10px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14); color:var(--primary);" onclick="reportCenterAppendArchiveSummaryToExamText('${reportCenterAttr(detailsPayload.sessionId || '')}')">원문 분석 요약을 본문에 추가</button>
        </div>
    `;
    reportCenterRenderMathInArchiveDetails();
}

async function reportCenterLoadArchiveQuestionDetails(studentId, sessionId, options = {}) {
    const root = document.getElementById('report-center-archive-details');
    const session = (state.db.exam_sessions || []).find(e => String(e.id) === String(sessionId));
    if (!session) {
        if (!options.silent) toast('평가 기록을 찾을 수 없습니다.', 'warn');
        return;
    }

    if (root) {
        root.innerHTML = `
            <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">
                아카이브 문항 원문을 확인하는 중입니다...
            </div>
        `;
    }

    const payload = await reportCenterFetchArchiveQuestionDetails(session);
    payload.sessionId = session.id;
    reportCenterSetCachedArchiveDetails(session.id, payload);
    reportCenterRenderArchiveDetails(payload);

    if (!options.silent) {
        toast(payload.ok ? '문항 원문을 불러왔습니다.' : '문항 원문 확인이 제한됩니다.', payload.ok ? 'success' : 'warn');
    }
}

async function reportCenterPreloadArchiveQuestionDetails(studentId, sessionId) {
    const session = (state.db.exam_sessions || []).find(e => String(e.id) === String(sessionId));
    if (!session || reportCenterGetCachedArchiveDetails(session.id)) return null;
    try {
        const payload = await reportCenterFetchArchiveQuestionDetails(session);
        payload.sessionId = session.id;
        return reportCenterSetCachedArchiveDetails(session.id, payload);
    } catch (e) {
        console.warn('[reportCenterPreloadArchiveQuestionDetails] failed:', e);
        return null;
    }
}

function reportCenterAppendArchiveSummaryToExamText(sessionId) {
    const cached = reportCenterGetCachedArchiveDetails(sessionId);
    const summary = reportCenterBuildArchiveSummaryText(cached);
    const textarea = document.getElementById('report-center-exam-text');
    if (!textarea || !summary) {
        toast('추가할 문항 원문 요약이 없습니다.', 'warn');
        return;
    }
    const current = textarea.value.trim();
    if (current.includes('[아카이브 문항 원문 확인]')) {
        toast('이미 본문에 추가되어 있습니다.', 'info');
        return;
    }
    textarea.value = `${current}\n\n${summary}`.trim();
    toast('문항 원문 요약을 본문에 추가했습니다.', 'success');
}

function reportCenterBuildArchiveStatusHtml(session) {
    const archiveInfo = reportCenterNormalizeArchiveFile(session?.archive_file || '');
    const safeStudentId = escapeReportJsString(session?.student_id || '');
    const safeSessionId = escapeReportJsString(session?.id || '');
    const linkUrl = archiveInfo.url || REPORT_CENTER_ARCHIVE_INDEX_URL;
    const desc = archiveInfo.type === 'mixed'
        ? '믹서 출제물입니다. 원본 문항 매핑이 있으면 후속 단계에서 개별 원문까지 연결합니다.'
        : archiveInfo.ok
            ? '연결된 JS아카이브 파일에서 오답 문항 원문을 확인합니다.'
            : archiveInfo.message;

    return `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px; display:flex; flex-direction:column; gap:9px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div>
                    <div style="font-size:13px; font-weight:700; color:var(--text);">아카이브 원문 연결</div>
                    <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:3px; line-height:1.5;">${reportCenterEscape(desc)}</div>
                </div>
                <a href="${reportCenterAttr(linkUrl)}" target="_blank" rel="noopener" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; white-space:nowrap;">열기</a>
            </div>
            <div style="font-size:11px; font-weight:700; color:var(--secondary); word-break:break-all; background:var(--surface-2); border-radius:10px; padding:8px 10px;">${reportCenterEscape(session?.archive_file || 'archive_file 없음')}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn" style="min-height:42px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14); color:var(--primary);" onclick="reportCenterLoadArchiveQuestionDetails('${safeStudentId}', '${safeSessionId}')">문항 원문 확인</button>
                <button class="btn" style="min-height:42px; font-size:12px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--text);" onclick="window.open('${REPORT_CENTER_ARCHIVE_MIXER_URL}', '_blank', 'noopener')">믹서 열기</button>
            </div>
        </div>
        <div id="report-center-archive-details"></div>
    `;
}


function reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session || !data.stats) return null;

    const stats = data.stats;
    const wrongRows = stats.wrongRows || [];
    const wrongCount = wrongRows.length;
    const qCount = Number(data.session.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const baseDiagnosisLines = reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo);
    const meaningLines = reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, null);
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 3);
    const recentAvg = getRecentAverage(data.student.id, 3);

    const nextActions = [];
    if (wrongRows.length) {
        const wrongNums = priorityRows.map(r => `${r.questionNo}번`).join(', ');
        if (wrongNums) nextActions.push(`${wrongNums}을 다시 풀이하고, 같은 유형의 문제까지 확인하겠습니다.`);
        nextActions.push('다음 수업에서 틀린 문항을 다시 풀이하고, 같은 유형의 문제로 한 번 더 연습하겠습니다.');
    } else {
        nextActions.push('잘 풀던 유형은 유지하면서, 한 단계 높은 난도의 문제로 이어가겠습니다.');
    }
    nextActions.push('필요하면 유사 유형의 문제를 더 연습하겠습니다.');

    const studentName = data.student.name || '학생';
    const parentMessage = reportCenterBuildEasyParentMessage(data);

    return {
        purpose: 'AI must improve this existing base report, not replace it from scratch.',
        achievementSummary: meaningLines[0] || '',
        evaluationMeaning: meaningLines,
        diagnosis: baseDiagnosisLines,
        nextPlanItems: nextActions,
        parentMessage,
        kakaoSummary: reportCenterBuildExamPreview(studentId, sessionId),
        teacherMemo: teacherMemo || '',
        constraints: [
            '기본 리포트보다 더 짧거나 딱딱하게 만들지 않는다.',
            '같은 문장을 반복하지 않는다.',
            '성취 확인으로 시작하고 보완은 관리 계획으로 표현한다.',
            'nextPlan과 nextActions는 중복되지 않게 역할을 분리한다.',
            '학부모용 문장에 확인 불가, 자료 없음, 아카이브, 시스템, 함수, 코드라는 표현을 쓰지 않는다.'
        ],
        metrics: {
            score: data.session.score,
            correctRate,
            recentAverage: recentAvg,
            overallAverage: stats.overallAvg,
            classAverage: stats.classAvg,
            gradeExamAverage: stats.gradeExamAverage,
            gradeExamRank: stats.gradeExamRank,
            gradeExamCount: stats.gradeExamCount,
            cohortScope: stats.cohortScope,
            totalSubmitted: stats.totalSessions,
            classSubmitted: stats.classSessions,
            wrongCount
        }
    };
}

function reportCenterBuildExamAiPayload(studentId, sessionId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const session = (state.db.exam_sessions || []).find(e => String(e.id) === String(sessionId));
    const stats = reportCenterBuildQuestionStats(session);
    const archiveQuestionDetails = session ? reportCenterGetCachedArchiveDetails(session.id) : null;
    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    const baseReportDraft = reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo);
    const trendData = reportCenterGetExamTrendData(studentId, { limit: 5 });
    return {
        reportType: 'exam_revision',
        revisionMode: true,
        instruction: '기존 기본 리포트를 처음부터 갈아엎지 말고, 중복을 줄이고 문장을 더 자연스럽고 신뢰감 있게 다듬어라. 최근 여러 시험의 점수 흐름을 먼저 해석하고, 최종 평가의 문항 분석은 마지막에 연결하라.',
        student: student ? {
            id: student.id,
            name: student.name,
            school: student.school_name,
            grade: student.grade,
            targetScore: student.target_score || null
        } : null,
        exam: session ? {
            id: session.id,
            title: session.exam_title,
            date: session.exam_date,
            score: session.score,
            questionCount: session.question_count,
            archiveFile: session.archive_file || ''
        } : null,
        cohort: {
            totalSubmitted: stats.totalSessions,
            classSubmitted: stats.classSessions,
            overallAverage: stats.overallAvg,
            classAverage: stats.classAvg,
            gradeExamAverage: stats.gradeExamAverage,
            gradeExamRank: stats.gradeExamRank,
            gradeExamCount: stats.gradeExamCount,
            cohortScope: stats.cohortScope,
            className: stats.className
        },
        questionAnalysis: stats.rows,
        wrongAnalysis: stats.wrongRows,
        selectedSessions: trendData.selectedSessions,
        examTrend: trendData.trend,
        weaknessTrend: trendData.weaknessTrend,
        finalSession: trendData.finalSession,
        baseReportDraft,
        archiveQuestionDetails: archiveQuestionDetails ? {
            status: archiveQuestionDetails.status,
            message: archiveQuestionDetails.message,
            archiveFile: archiveQuestionDetails.archiveInfo?.original || '',
            archiveUrl: archiveQuestionDetails.archiveInfo?.url || '',
            details: archiveQuestionDetails.details || []
        } : null,
        teacherMemo
    };
}

function reportCenterHasArchiveFile(session) {
    return !!String(session?.archive_file || session?.archiveFile || '').trim();
}

function reportCenterGetSchoolExamSessions() {
    return (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(reportCenterHasArchiveFile)
        .sort((a, b) =>
            String(b.exam_date || '').localeCompare(String(a.exam_date || '')) ||
            String(b.id || '').localeCompare(String(a.id || '')));
}

function reportCenterGetLegacyExamReportSessions(studentId = '') {
    return (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => !reportCenterHasArchiveFile(session))
        .filter(session => !studentId || String(session.student_id) === String(studentId))
        .sort((a, b) =>
            String(b.exam_date || '').localeCompare(String(a.exam_date || '')) ||
            String(b.id || '').localeCompare(String(a.id || '')));
}

function reportCenterMakeSchoolExamKey(session) {
    return reportCenterNormalizeExamAnalysisArchiveKey(session?.archive_file || session?.archiveFile || '');
}

function reportCenterGetSchoolExamGroups() {
    const byKey = new Map();
    reportCenterGetSchoolExamSessions().forEach(session => {
        const key = reportCenterMakeSchoolExamKey(session);
        if (!key) return;
        if (!byKey.has(key)) {
            byKey.set(key, {
                key,
                archiveFile: key,
                title: session.exam_title || session.title || key,
                school: session.school || session.school_name || '',
                grade: reportCenterGetSessionGrade(session) || session.grade || '',
                examDate: session.exam_date || '',
                sessions: [],
                classIds: new Set(),
                takerCount: 0,
                wrongInputCount: 0,
                questionCount: Number(session.question_count || 0) || 0,
                analysisStatus: null
            });
        }
        const group = byKey.get(key);
        group.sessions.push(session);
        group.takerCount += 1;
        const classId = reportCenterGetClassIdForSession(session);
        if (classId) group.classIds.add(String(classId));
        if (session.exam_date && String(session.exam_date) > String(group.examDate || '')) group.examDate = session.exam_date;
        if (!group.title && session.exam_title) group.title = session.exam_title;
        if (!group.school && (session.school || session.school_name)) group.school = session.school || session.school_name;
        if (!group.grade) group.grade = reportCenterGetSessionGrade(session) || session.grade || '';
        if (!group.questionCount && Number(session.question_count || 0)) group.questionCount = Number(session.question_count || 0);
        group.wrongInputCount += reportCenterGetWrongIds(session.id).length;
    });
    return Array.from(byKey.values()).map(group => {
        const reviews = reportCenterGetExamReviews(group.archiveFile);
        const blueprintCount = (Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [])
            .filter(bp => reportCenterNormalizeExamAnalysisArchiveKey(bp.archive_file || bp.archiveFile || '') === group.archiveFile)
            .length;
        return {
            ...group,
            classIds: Array.from(group.classIds),
            reviewCount: reviews.byQuestion.size,
            blueprintCount,
            analysisStatus: {
                label: blueprintCount && reviews.byQuestion.size >= blueprintCount ? '문항 분석 완료' : reviews.byQuestion.size ? '문항 분석 일부' : '문항 분석 대기',
                reviewed: reviews.byQuestion.size,
                total: blueprintCount
            }
        };
    }).sort((a, b) => String(b.examDate || '').localeCompare(String(a.examDate || '')) || String(a.title || '').localeCompare(String(b.title || ''), 'ko'));
}

function reportCenterGetSchoolExamGroupByKey(groupKey) {
    const normalized = reportCenterNormalizeExamAnalysisArchiveKey(groupKey || '');
    return reportCenterGetSchoolExamGroups().find(group =>
        String(group.key) === String(groupKey) ||
        String(group.archiveFile) === String(groupKey) ||
        String(group.archiveFile) === normalized
    ) || null;
}

function reportCenterGetClassName(classId) {
    return (Array.isArray(state?.db?.classes) ? state.db.classes : [])
        .find(cls => String(cls.id) === String(classId))?.name || '미배정';
}

function reportCenterGetClassIdForSession(session) {
    const direct = String(session?.class_id || session?.classId || '').trim();
    if (direct) return direct;
    return String(reportCenterGetStudentClass(session?.student_id).classId || '').trim();
}

function reportCenterGetGroupClasses(group) {
    const byClass = new Map();
    (group?.sessions || []).forEach(session => {
        const classId = reportCenterGetClassIdForSession(session);
        if (!byClass.has(classId)) byClass.set(classId, []);
        byClass.get(classId).push(session);
    });
    return Array.from(byClass.entries()).map(([classId, sessions]) => {
        const scores = sessions.map(session => Number(session.score)).filter(Number.isFinite);
        const avg = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
        const wrongCount = sessions.reduce((sum, session) => sum + reportCenterGetWrongIds(session.id).length, 0);
        return {
            classId,
            className: reportCenterGetClassName(classId),
            sessions,
            takerCount: sessions.length,
            avg,
            wrongCount
        };
    }).sort((a, b) => String(a.className).localeCompare(String(b.className), 'ko'));
}

function reportCenterGetGroupClassStudents(group, classId) {
    const targetClassId = String(classId || '');
    return (group?.sessions || [])
        .filter(session => String(reportCenterGetClassIdForSession(session)) === targetClassId)
        .map(session => {
            const student = (Array.isArray(state?.db?.students) ? state.db.students : [])
                .find(row => String(row.id) === String(session.student_id));
            return {
                studentId: String(session.student_id || ''),
                sessionId: String(session.id || ''),
                name: student?.name || session.student_name || '학생',
                score: session.score,
                wrongCount: reportCenterGetWrongIds(session.id).length
            };
        })
        .sort((a, b) => String(a.name).localeCompare(String(b.name), 'ko'));
}

function reportCenterGetRecentConsultations(studentId, limit = 5) {
    return (state.db.consultations || [])
        .filter(c => String(c.student_id) === String(studentId))
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        .slice(0, limit);
}

function reportCenterBuildDailyPreview(ctx) {
    const s = ctx.student;
    if (!s) return '';
    return buildParentReportText(ctx);
}

function reportCenterBuildExamPreview(studentId, sessionId = '') {
    return reportCenterBuildEasyKakaoSummary(studentId, sessionId);
}

function reportCenterBuildCounselPreview(studentId) {
    const ctx = buildReportContext(studentId);
    const student = ctx.student;
    if (!student) return '';

    const consultations = reportCenterGetRecentConsultations(studentId, 3);
    const exams = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))
        .slice(0, 5);
    const examLine = exams.length
        ? exams.map(e => `${e.exam_date || '-'} ${e.exam_title || '평가'} ${e.score}점`).join('\n')
        : '최근 시험 기록 없음';
    const consultLine = consultations.length
        ? consultations.map(c => `${c.date || '-'} ${c.type || '상담'}: ${c.content || ''}`).join('\n')
        : '최근 상담 기록 없음';

    return `[상담 리포트 초안]

학생: ${student.name}
학급: ${ctx.className || '미배정'}
기준일: ${ctx.today}

[최근 성적 흐름]
${examLine}

[최근 상담 기록]
${consultLine}

[현재 확인 포인트]
출결: ${ctx.attendance}
숙제: ${ctx.homework}
최근 진도: ${ctx.progressText || '최근 진도 기록 없음'}

[상담 방향]
최근 성적, 숙제, 출결, 상담 기록을 함께 보고 학습 습관과 반복 약점을 정리합니다.
학부모님께는 단순 점수보다 현재 흔들리는 원인과 다음 관리 방향을 중심으로 안내하는 것이 좋습니다.`;
}

function reportCenterCopyText(textareaId) {
    const text = document.getElementById(textareaId)?.value || '';
    if (!text.trim()) {
        toast('복사할 문구가 없습니다.', 'warn');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        toast('문구가 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function reportCenterPrintText(textareaId, title = 'AP Math Report') {
    const text = document.getElementById(textareaId)?.value || '';
    if (!text.trim()) {
        toast('출력할 내용이 없습니다.', 'warn');
        return;
    }

    const win = window.open('', '_blank');
    if (!win) {
        toast('팝업 차단을 해제한 뒤 다시 시도하세요.', 'warn');
        return;
    }

    win.document.write(`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${reportCenterEscape(title)}</title>
<style>
    body { font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 32px; color: #111827; line-height: 1.75; }
    .page { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 18px; font-size: 22px; letter-spacing: -0.5px; }
    pre { white-space: pre-wrap; word-break: keep-all; font-family: inherit; font-size: 14px; margin: 0; }
    @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="page">
<h1>${reportCenterEscape(title)}</h1>
<pre>${reportCenterEscape(text)}</pre>
</div>
<script>window.onload=function(){window.print();};<\/script>
</body>
</html>`);
    win.document.close();
}


function reportCenterEnsureWideOverlay() {
    let overlay = document.getElementById('report-center-wide-overlay');
    if (overlay) return overlay;

    const style = document.createElement('style');
    style.id = 'report-center-wide-style';
    style.textContent = `
        #report-center-wide-overlay { position:fixed; inset:0; z-index:1400; background:rgba(15,23,42,0.48); display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box; backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); }
        #report-center-wide-overlay.show { display:flex; }
        .report-center-wide-content { width:min(1120px, 100%); height:min(92vh, 980px); background:var(--surface); border:1px solid var(--border); border-radius:24px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 24px 80px rgba(15,23,42,0.22); }
        .report-center-wide-header { display:grid; grid-template-columns:84px 1fr 84px; align-items:center; gap:8px; min-height:58px; padding:12px 18px; border-bottom:1px solid var(--border); background:var(--surface); flex-shrink:0; }
        .report-center-wide-title { margin:0; text-align:center; font-size:20px; font-weight:700; color:var(--text); letter-spacing:-0.4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .report-center-wide-close { border:0; background:transparent; color:var(--secondary); font-size:15px; font-weight:700; font-family:inherit; text-align:left; cursor:pointer; padding:8px 0; }
        .report-center-wide-spacer { width:84px; }
        .report-center-wide-body { flex:1; min-height:0; overflow:auto; overflow-x:auto; padding:20px 22px 24px; box-sizing:border-box; -webkit-overflow-scrolling:touch; }
        .report-center-wide-body #report-center-premium-preview { max-width:100%; }
        .report-center-wide-body .aprc-document { min-width:760px; }
        /* 선택 카드(반/학생) — 클리닉 mode-card 디자인 언어 차용: 토큰·hover·active·focus 상태 */
        .aprc-pick-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(132px, 1fr)); gap:6px; }
        .aprc-pick-grid--wide { grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:8px; }
        .aprc-pick-card { display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:3px 8px; width:100%; min-height:56px; padding:11px 12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); text-align:left; cursor:pointer; box-shadow:none; font-family:inherit; transition:transform 150ms ease, background 180ms ease, border-color 180ms ease; }
        .aprc-pick-card:hover { background:var(--surface-2); border-color:rgba(var(--primary-rgb),0.22); }
        .aprc-pick-card:active { transform:scale(0.98); }
        .aprc-pick-card:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-pick-card--active { border-color:var(--primary); background:var(--primary-soft); }
        .aprc-pick-card__name { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; font-weight:800; color:var(--text); }
        .aprc-pick-card__go { font-size:11px; font-weight:800; color:var(--primary); white-space:nowrap; }
        .aprc-pick-card__meta { grid-column:1 / -1; font-size:11px; font-weight:700; color:var(--secondary); line-height:1.4; }
        /* 학생 피커: 체크박스 선택 카드 */
        .aprc-pick-grid--tight { grid-template-columns:repeat(auto-fit, minmax(128px, 1fr)); }
        .aprc-pick-label { display:grid; grid-template-columns:auto minmax(0,1fr) auto; align-items:center; gap:6px 8px; min-height:44px; padding:9px 10px; border:1px solid var(--border); border-radius:12px; background:var(--surface); cursor:pointer; transition:background 180ms ease, border-color 180ms ease; }
        .aprc-pick-label:hover { background:var(--surface-2); border-color:rgba(var(--primary-rgb),0.22); }
        .aprc-pick-label:focus-within { box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-pick-label:has(input:checked) { border-color:var(--primary); background:var(--primary-soft); }
        .aprc-pick-label__name { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; font-weight:800; color:var(--text); }
        .aprc-pick-label__meta { display:block; font-size:11px; font-weight:700; color:var(--secondary); margin-top:2px; }
        .aprc-pick-mini-btn { min-height:28px; min-width:34px; padding:4px 8px; border-radius:8px; font-size:11px; font-weight:900; background:var(--surface-2); border:1px solid var(--border); color:var(--text); cursor:pointer; font-family:inherit; transition:background 180ms ease, border-color 180ms ease, transform 150ms ease; }
        .aprc-pick-mini-btn:hover { background:var(--surface); border-color:rgba(var(--primary-rgb),0.22); }
        .aprc-pick-mini-btn:active { transform:scale(0.96); }
        .aprc-pick-mini-btn:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        /* 상담/상세 리포트 카드 (aprc-counsel-*) — 마크업만 있고 정의가 없어 겹침/벽글로 렌더되던 것 */
        .aprc-counsel-report { display:block; padding:16px; border:1px solid var(--border); border-radius:14px; background:var(--surface); }
        .aprc-counsel-report + .aprc-counsel-report { margin-top:12px; }
        .aprc-counsel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin:0 0 12px; padding-bottom:10px; border-bottom:1px solid var(--border); }
        .aprc-counsel-head > div { min-width:0; }
        .aprc-counsel-head h3 { margin:4px 0 0; font-size:16px; font-weight:900; color:var(--text); line-height:1.35; }
        .aprc-counsel-kicker { font-size:11px; font-weight:800; color:var(--secondary); line-height:1.4; }
        .aprc-counsel-section { margin:0 0 12px; }
        .aprc-counsel-section:last-child { margin-bottom:0; }
        .aprc-counsel-section p { margin:0; font-size:13px; font-weight:600; color:var(--text); line-height:1.7; word-break:keep-all; }
        .aprc-counsel-title { margin-bottom:5px; font-size:12px; font-weight:900; color:var(--secondary); }
        .aprc-counsel-field { display:block; margin:0 0 12px; }
        .aprc-counsel-field b { display:block; margin-bottom:5px; font-size:12px; font-weight:900; color:var(--secondary); }
        .aprc-counsel-field textarea { width:100%; min-height:84px; padding:10px 12px; border:1px solid var(--border); border-radius:10px; background:var(--surface-2); color:var(--text); font-family:inherit; font-size:13px; line-height:1.65; box-sizing:border-box; resize:vertical; }
        .aprc-counsel-actions { display:flex; gap:8px; margin-top:4px; }
        /* 섹션/버튼 규격 통일 (클리닉 section·apms-button 톤) */
        .aprc-section { padding:14px; border-radius:14px; background:var(--surface); border:1px solid var(--border); }
        .aprc-section-title { font-size:14px; font-weight:900; color:var(--text); margin-bottom:10px; }
        .aprc-back-btn { align-self:flex-start; min-height:34px; padding:7px 12px; border-radius:10px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border); color:var(--text); cursor:pointer; font-family:inherit; transition:transform 150ms ease, background 180ms ease, border-color 180ms ease; }
        .aprc-back-btn:hover { background:var(--surface); border-color:rgba(var(--primary-rgb),0.22); }
        .aprc-back-btn:active { transform:scale(0.98); }
        .aprc-back-btn:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-action-btn { display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:44px; padding:8px 12px; font-size:12px; font-weight:800; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); cursor:pointer; font-family:inherit; transition:transform 150ms ease, background 180ms ease, border-color 180ms ease; }
        .aprc-action-btn:hover { border-color:rgba(var(--primary-rgb),0.22); background:var(--surface); }
        .aprc-action-btn:active { transform:scale(0.98); }
        .aprc-action-btn:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-action-btn--primary { background:var(--primary); border-color:var(--primary); color:#fff; }
        .aprc-action-btn--primary:hover { background:var(--primary); border-color:var(--primary); filter:brightness(1.05); }
        .aprc-action-btn--accent { background:var(--primary-soft); border-color:rgba(var(--primary-rgb),0.18); color:var(--primary); }
        /* L0 시험 카드 + 상태 칩 */
        .aprc-exam-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:10px; }
        .aprc-exam-card { display:flex; flex-direction:column; align-items:stretch; gap:10px; min-height:148px; padding:14px; text-align:left; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); cursor:pointer; box-shadow:none; font-family:inherit; transition:transform 150ms ease, background 180ms ease, border-color 180ms ease; }
        .aprc-exam-card:hover { background:var(--surface-2); border-color:rgba(var(--primary-rgb),0.22); }
        .aprc-exam-card:active { transform:scale(0.98); }
        .aprc-exam-card:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-exam-card__title { display:block; font-size:14px; font-weight:900; color:var(--text); line-height:1.35; }
        .aprc-exam-card__sub { display:block; min-height:18px; font-size:12px; font-weight:700; color:var(--secondary); line-height:1.5; }
        .aprc-exam-card__chips { display:flex; gap:6px; flex-wrap:wrap; margin-top:auto; }
        .aprc-chip { padding:5px 8px; border-radius:999px; background:var(--bg); color:var(--secondary); font-size:11px; font-weight:800; white-space:nowrap; }
        .aprc-qtable-wrap { width:100%; overflow:auto; border:1px solid var(--border); border-radius:12px; background:var(--surface); }
        .aprc-qtable { width:100%; min-width:920px; border-collapse:separate; border-spacing:0; table-layout:fixed; font-size:12px; color:var(--text); }
        .aprc-qtable th:nth-child(1) { width:44px; }
        .aprc-qtable th:nth-child(2) { width:76px; }
        .aprc-qtable th:nth-child(3) { width:78px; }
        .aprc-qtable th:nth-child(4) { width:130px; }
        .aprc-qtable th:nth-child(6) { width:62px; }
        .aprc-qtable th:nth-child(7) { width:140px; }
        .aprc-qtable th:nth-child(8) { width:58px; }
        .aprc-qtable th:nth-child(9) { width:92px; }
        .aprc-qtable th { position:sticky; top:0; z-index:1; padding:9px 8px; background:var(--surface-2); color:var(--secondary); font-size:11px; font-weight:900; text-align:left; border-bottom:1px solid var(--border); white-space:nowrap; }
        .aprc-qtable td { padding:8px; border-bottom:1px solid var(--border); vertical-align:middle; line-height:1.35; }
        .aprc-qtable-row { cursor:pointer; transition:background 180ms ease, border-color 180ms ease; }
        .aprc-qtable-row:hover { background:var(--surface-2); }
        .aprc-qtable-row:focus-within { box-shadow:inset 0 0 0 3px rgba(var(--primary-rgb),0.14); }
        .aprc-qtable-row--boost td:first-child { border-left:4px solid var(--primary); }
        .aprc-qtable-toggle { width:26px; height:26px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--primary); font-size:12px; font-weight:900; cursor:pointer; font-family:inherit; }
        .aprc-qtable-toggle:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(var(--primary-rgb),0.14); }
        .aprc-qtable-chip { display:inline-flex; align-items:center; justify-content:center; max-width:100%; padding:4px 7px; border-radius:999px; background:var(--bg); color:var(--secondary); font-size:11px; font-weight:900; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .aprc-qtable-level--low { background:var(--bg); color:var(--secondary); }
        .aprc-qtable-level--midlow { background:rgba(20,184,166,0.12); color:#0f766e; }
        .aprc-qtable-level--mid { background:var(--primary-soft); color:var(--primary); }
        .aprc-qtable-level--high { background:rgba(245,158,11,0.14); color:#b45309; }
        .aprc-qtable-level--top { background:rgba(239,68,68,0.12); color:#dc2626; }
        .aprc-qtable-concept { display:flex; align-items:center; gap:5px; min-width:0; }
        .aprc-qtable-concept-text { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:800; }
        .aprc-qtable-muted { color:var(--secondary); opacity:0.78; font-weight:800; }
        .aprc-qtable-ai { padding:2px 5px; border-radius:999px; background:var(--primary-soft); color:var(--primary); font-size:10px; font-weight:900; }
        .aprc-qtable-rate { display:grid; gap:3px; min-width:0; }
        .aprc-qtable-rate-text { font-size:11px; font-weight:900; color:var(--text); white-space:nowrap; }
        .aprc-qtable-rate-sub { font-size:10px; font-weight:800; color:var(--secondary); white-space:nowrap; }
        .aprc-qtable-bar { height:5px; border-radius:999px; background:var(--bg); overflow:hidden; }
        .aprc-qtable-bar > span { display:block; height:100%; width:0; background:var(--primary); border-radius:999px; }
        .aprc-qtable-bar-fill--0 { width:0%; }
        .aprc-qtable-bar-fill--5 { width:5%; }
        .aprc-qtable-bar-fill--10 { width:10%; }
        .aprc-qtable-bar-fill--15 { width:15%; }
        .aprc-qtable-bar-fill--20 { width:20%; }
        .aprc-qtable-bar-fill--25 { width:25%; }
        .aprc-qtable-bar-fill--30 { width:30%; }
        .aprc-qtable-bar-fill--35 { width:35%; }
        .aprc-qtable-bar-fill--40 { width:40%; }
        .aprc-qtable-bar-fill--45 { width:45%; }
        .aprc-qtable-bar-fill--50 { width:50%; }
        .aprc-qtable-bar-fill--55 { width:55%; }
        .aprc-qtable-bar-fill--60 { width:60%; }
        .aprc-qtable-bar-fill--65 { width:65%; }
        .aprc-qtable-bar-fill--70 { width:70%; }
        .aprc-qtable-bar-fill--75 { width:75%; }
        .aprc-qtable-bar-fill--80 { width:80%; }
        .aprc-qtable-bar-fill--85 { width:85%; }
        .aprc-qtable-bar-fill--90 { width:90%; }
        .aprc-qtable-bar-fill--95 { width:95%; }
        .aprc-qtable-bar-fill--100 { width:100%; }
        .aprc-qtable-detail[hidden] { display:none; }
        .aprc-qtable-detail td { background:var(--bg); padding:12px 14px; border-bottom:1px solid var(--border); }
        .aprc-qtable-detail-panel { display:grid; gap:10px; }
        .aprc-qtable-detail-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .aprc-qtable-detail-item { min-width:0; padding:10px; border-radius:10px; background:var(--surface); border:1px solid var(--border); }
        .aprc-qtable-detail-label { display:block; margin-bottom:4px; font-size:11px; font-weight:900; color:var(--secondary); }
        .aprc-qtable-detail-body { font-size:12px; font-weight:750; color:var(--text); line-height:1.55; overflow-wrap:anywhere; }
        .aprc-qtable-wrong-groups { display:flex; flex-wrap:wrap; gap:6px; }
        .aprc-qtable-empty { padding:14px; font-size:12px; font-weight:800; color:var(--secondary); }
        @media (max-width:760px) {
            #report-center-wide-overlay { align-items:stretch; justify-content:stretch; padding:0; }
            .report-center-wide-content { width:100%; height:100%; max-height:none; border-radius:0; border:0; }
            .report-center-wide-header { grid-template-columns:56px 1fr 56px; min-height:56px; padding:10px 14px; }
            .report-center-wide-title { font-size:18px; }
            .report-center-wide-spacer { width:56px; }
            .report-center-wide-body { padding:16px 12px 22px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
            .report-center-wide-body #report-center-premium-preview { min-width:760px; width:760px; }
            .report-center-wide-body .aprc-document { min-width:760px; max-width:760px; }
        }
    `;
    if (!document.getElementById('report-center-wide-style')) document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.id = 'report-center-wide-overlay';
    overlay.innerHTML = `
        <div class="report-center-wide-content" onclick="event.stopPropagation()">
            <div class="report-center-wide-header">
                <button class="report-center-wide-close" onclick="reportCenterCloseWideOverlay()">취소</button>
                <h2 class="report-center-wide-title" id="report-center-wide-title">리포트 센터</h2>
                <div class="report-center-wide-spacer"></div>
            </div>
            <div class="report-center-wide-body" id="report-center-wide-body"></div>
        </div>
    `;
    overlay.onclick = function(event) {
        if (event.target === overlay) reportCenterCloseWideOverlay();
    };
    document.body.appendChild(overlay);
    reportCenterEnsureExamAnalysisTableEvents();
    return overlay;
}

function reportCenterShowWideModal(title, html) {
    const overlay = reportCenterEnsureWideOverlay();
    const titleEl = document.getElementById('report-center-wide-title');
    const bodyEl = document.getElementById('report-center-wide-body');
    overlay.classList.remove('show');
    overlay.style.pointerEvents = 'auto';
    if (titleEl) titleEl.innerText = title || '리포트 센터';
    if (bodyEl) {
        bodyEl.innerHTML = '';
        bodyEl.scrollTop = 0;
        bodyEl.innerHTML = html || '';
        reportCenterTypesetMath(bodyEl);
        const preload = bodyEl.querySelector?.('[data-report-preload-archive-session]');
        if (preload && typeof reportCenterPreloadArchiveQuestionDetails === 'function') {
            const preloadStudent = preload.getAttribute('data-report-preload-student') || '';
            const preloadSession = preload.getAttribute('data-report-preload-archive-session') || '';
            // 선로딩이 캐시를 새로 채우면 학생 화면을 다시 그려 실제 오답 문제가 나오게 한다.
            // 이미 캐시된 경우 preload가 null을 반환하므로 재렌더가 반복되지 않는다(루프 방지).
            Promise.resolve(reportCenterPreloadArchiveQuestionDetails(preloadStudent, preloadSession))
                .then(payload => {
                    if (!payload) return;
                    const nav = typeof reportCenterNavState === 'function' ? reportCenterNavState() : null;
                    const currentBody = document.getElementById('report-center-wide-body');
                    const currentPreload = currentBody?.querySelector?.('[data-report-preload-archive-session]');
                    const stillSameStudent = String(nav?.studentId || '') === String(preloadStudent || '');
                    const stillSameSession = String(currentPreload?.getAttribute('data-report-preload-archive-session') || '') === String(preloadSession || '');
                    if (nav && nav.level === 'student' && stillSameStudent && stillSameSession && typeof openReportCenterModal === 'function') {
                        openReportCenterModal(preloadStudent, 'daily', { forceDrilldown: true });
                    }
                })
                .catch(() => {});
        }
    }
    requestAnimationFrame(() => overlay.classList.add('show'));
}

function reportCenterCloseWideOverlay() {
    const overlay = document.getElementById('report-center-wide-overlay');
    const bodyEl = document.getElementById('report-center-wide-body');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.style.pointerEvents = 'auto';
    }
    if (bodyEl) bodyEl.innerHTML = '';
    window.AP_REPORT_CENTER_RENDER_TOKEN = (window.AP_REPORT_CENTER_RENDER_TOKEN || 0) + 1;
}

function reportCenterAdvancedMode() {
    try {
        return localStorage.getItem('apmath.reportCenter.advanced') === 'true';
    } catch (error) {
        return !!window.AP_REPORT_CENTER_ADVANCED_FALLBACK;
    }
}

function reportCenterSetAdvancedMode(enabled) {
    const next = !!enabled;
    try {
        localStorage.setItem('apmath.reportCenter.advanced', next ? 'true' : 'false');
    } catch (error) {
        window.AP_REPORT_CENTER_ADVANCED_FALLBACK = next;
    }
    return next;
}

function reportCenterNavState() {
    window.AP_REPORT_NAV = window.AP_REPORT_NAV || { level: 'list', archiveFile: '', studentId: '' };
    return window.AP_REPORT_NAV;
}

function reportCenterNavTo(level, params = {}) {
    const current = reportCenterNavState();
    window.AP_REPORT_NAV = {
        level: level || current.level || 'list',
        archiveFile: params.archiveFile !== undefined ? params.archiveFile : (current.archiveFile || ''),
        studentId: params.studentId !== undefined ? params.studentId : (current.studentId || '')
    };
    return window.AP_REPORT_NAV;
}

function reportCenterAdvancedToggleHtml(studentId, activeTab = 'daily') {
    const checked = reportCenterAdvancedMode() ? 'checked' : '';
    return `
        <label style="display:inline-flex; align-items:center; gap:8px; min-height:36px; padding:8px 10px; border-radius:999px; background:var(--surface); border:1px solid var(--border); font-size:12px; font-weight:800; color:var(--text); cursor:pointer;">
            <input type="checkbox" ${checked} style="width:16px; height:16px; accent-color:var(--primary);" onchange="reportCenterSetAdvancedMode(this.checked); openReportCenterModal('${escapeReportJsString(studentId)}', '${escapeReportJsString(activeTab)}')">
            <span>고급 보기</span>
        </label>
    `;
}

function reportCenterGetMenuItems() {
    return [
        { key: 'schoolExam', label: '학교시험 분석' },
        { key: 'daily', label: '오늘 리포트' },
        { key: 'exam', label: '평가 리포트' },
        { key: 'counsel', label: '상담 리포트' }
    ];
}

function reportCenterInternalMenuHtml(studentId, activeMenu = 'schoolExam') {
    const safeStudentId = escapeReportJsString(studentId || '');
    return `
        <div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:6px; background:var(--bg); padding:4px; border-radius:14px;">
            ${reportCenterGetMenuItems().map(item => {
                const active = activeMenu === item.key;
                const onclick = item.key === 'schoolExam'
                    ? `reportCenterNavTo('list', { archiveFile: '', studentId: '${safeStudentId}' }); openReportCenterModal('${safeStudentId}', 'daily', { forceDrilldown: true })`
                    : `openReportCenterModal('${safeStudentId}', '${item.key}', { forceAdvanced: true })`;
                return `
                    <button class="btn ${active ? 'btn-primary' : ''}" type="button"
                            style="min-height:42px; padding:8px 6px; font-size:12px; font-weight:800; border-radius:10px; box-shadow:none; ${active ? '' : 'background:var(--surface); border:1px solid var(--border);'}"
                            onclick="${onclick}">${item.label}</button>`;
            }).join('')}
        </div>
    `;
}

function openReportCenterHome(options = {}) {
    reportCenterExitSchoolExamPrintMode();
    const studentId = options.studentId || '';
    reportCenterNavTo('list', { archiveFile: '', studentId });
    reportCenterShowWideModal('리포트 센터', reportCenterBuildDrilldownShell(studentId));
}

function reportCenterExitSchoolExamPrintMode() {
    if (typeof document !== 'undefined' && document.body?.classList) {
        document.body.classList.remove('aprc-school-print-mode');
    }
}

function reportCenterBuildExamHubList() {
    const sessions = reportCenterGetSchoolExamSessions();
    const wrongRows = Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : [];
    const blueprints = Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [];
    const groups = new Map();
    sessions.forEach(session => {
        const archiveFile = reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '');
        if (!archiveFile) return;
        if (!groups.has(archiveFile)) {
            groups.set(archiveFile, {
                key: archiveFile,
                archiveFile,
                title: session.exam_title || session.title || archiveFile,
                school: session.school || session.school_name || '',
                grade: reportCenterGetSessionGrade(session) || session.grade || '',
                takers: 0,
                classIds: new Set(),
                wrongEntered: 0,
                reviewCount: 0,
                blueprintCount: 0,
                latestDate: session.exam_date || session.created_at || ''
            });
        }
        const row = groups.get(archiveFile);
        row.takers += 1;
        const classId = reportCenterGetClassIdForSession(session);
        if (classId) row.classIds.add(classId);
        if (session.exam_date && String(session.exam_date) > String(row.latestDate || '')) row.latestDate = session.exam_date;
        if (!row.title && session.exam_title) row.title = session.exam_title;
        if (!row.school && (session.school || session.school_name)) row.school = session.school || session.school_name;
        if (!row.grade) row.grade = reportCenterGetSessionGrade(session) || session.grade || '';
        const sessionWrong = wrongRows.some(w => String(w.session_id) === String(session.id));
        if (sessionWrong) row.wrongEntered += 1;
    });
    groups.forEach(row => {
        row.reviewCount = reportCenterGetExamReviews(row.archiveFile).byQuestion.size;
        row.blueprintCount = blueprints.filter(bp =>
            reportCenterNormalizeExamAnalysisArchiveKey(bp.archive_file || bp.archiveFile || '') === row.archiveFile
        ).length;
    });
    return Array.from(groups.values()).map(row => ({ ...row, classIds: Array.from(row.classIds || []) }))
        .sort((a, b) => String(b.latestDate || '').localeCompare(String(a.latestDate || '')) || String(a.title || '').localeCompare(String(b.title || '')));
}

function reportCenterRenderExamHubList(studentId) {
    const exams = reportCenterBuildExamHubList();
    if (!exams.length) {
        return `
            <div style="padding:18px; border-radius:12px; background:var(--bg); border:1px dashed var(--border); color:var(--secondary); font-size:13px; font-weight:700; line-height:1.6;">
                <div style="color:var(--text); font-size:15px; margin-bottom:4px;">아카이브 시험지와 연결된 학교시험 기록이 없습니다.</div>
                <div>QR/오답 입력 또는 시험지 연결 후 학교시험 분석을 사용할 수 있습니다.</div>
            </div>
        `;
    }
    return `
        <div class="aprc-exam-grid">
            ${exams.map(exam => `
                <button class="aprc-exam-card" type="button" data-archive-file="${reportCenterAttr(exam.archiveFile)}"
                        onclick="reportCenterNavTo('exam', { archiveFile: '${escapeReportJsString(exam.archiveFile)}' }); openReportCenterModal('${escapeReportJsString(studentId)}')">
                    <span class="aprc-exam-card__title">${reportCenterEscape(exam.title || '시험지')}</span>
                    <span class="aprc-exam-card__sub">${reportCenterEscape([exam.school, exam.grade].filter(Boolean).join(' · ') || '학교/학년 미지정')}</span>
                    <span class="aprc-exam-card__chips">
                        <span class="aprc-chip">${reportCenterEscape(exam.latestDate || '-')}</span>
                        <span class="aprc-chip">문항분석 ${exam.reviewCount}/${exam.blueprintCount || '-'}</span>
                        <span class="aprc-chip">응시 ${exam.takers}</span>
                        <span class="aprc-chip">반 ${exam.classIds?.length || 0}</span>
                        <span class="aprc-chip">오답입력 ${exam.wrongEntered}</span>
                    </span>
                </button>
            `).join('')}
        </div>
    `;
}

function reportCenterBuildCohortRates(archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const sessions = (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '') === archiveKey);
    const takers = sessions.length;
    const sessionIds = new Set(sessions.map(session => String(session.id)));
    const blueprints = (Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [])
        .filter(bp => reportCenterNormalizeExamAnalysisArchiveKey(bp.archive_file || bp.archiveFile || '') === archiveKey);
    const questionNos = new Set();
    blueprints.forEach(bp => {
        const qNo = String(bp.question_no ?? bp.questionNo ?? bp.no ?? '').trim();
        if (qNo) questionNos.add(qNo);
    });
    const wrongCounts = new Map();
    (Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : []).forEach(row => {
        if (!sessionIds.has(String(row.session_id))) return;
        const qNo = String(row.question_no ?? row.questionNo ?? row.question_id ?? row.questionId ?? '').trim();
        if (!qNo) return;
        questionNos.add(qNo);
        wrongCounts.set(qNo, (wrongCounts.get(qNo) || 0) + 1);
    });
    const rows = Array.from(questionNos)
        .sort((a, b) => Number(a) - Number(b) || String(a).localeCompare(String(b)))
        .map(questionNo => {
            const wrongCount = wrongCounts.get(questionNo) || 0;
            const correctRate = takers ? Math.round(((takers - wrongCount) / takers) * 100) : null;
            return { questionNo, takers, wrongCount, correctRate };
        });
    return { archiveFile: archiveKey, takers, rows };
}

function reportCenterQuestionNoCompare(a, b) {
    return Number(a) - Number(b) || String(a).localeCompare(String(b), 'ko');
}

function reportCenterReadCachedArchiveBank(archiveFile) {
    const cache = typeof reportCenterArchiveBankCache === 'function' ? reportCenterArchiveBankCache() : {};
    const candidates = new Set(reportCenterArchiveKeyCandidates(archiveFile));
    const info = reportCenterNormalizeArchiveFile(archiveFile || '');
    [info.url, info.path, info.original].filter(Boolean).forEach(value => candidates.add(value));
    for (const key of candidates) {
        const payload = cache[key];
        if (payload && Array.isArray(payload.list)) return payload;
    }
    return null;
}

function reportCenterGetCachedArchiveQuestion(archiveFile, questionNo) {
    const payload = reportCenterReadCachedArchiveBank(archiveFile);
    const qNo = String(questionNo ?? '').trim();
    return (payload?.list || []).find(row => String(row?.questionNo ?? row?.question_no ?? row?.no ?? '').trim() === qNo) || null;
}

function reportCenterExtractQuestionPoints(bp = {}, archiveQuestion = null) {
    const direct = bp.score ?? bp.points ?? bp.point ?? bp.point_value;
    if (direct !== undefined && direct !== null && String(direct).trim() !== '') return `${String(direct).trim().replace(/점$/, '')}점`;
    const text = String(bp.content || bp.content_text || archiveQuestion?.content || archiveQuestion?.contentText || '');
    const match = text.match(/\[(\d+(?:\.\d+)?)\s*점\]/);
    return match ? `${match[1]}점` : '-';
}

function reportCenterLevelClass(level) {
    const value = String(level || '').trim();
    if (/최상|매우\s*어려|top/i.test(value)) return 'top';
    if (/상|어려|high/i.test(value)) return 'high';
    if (/중하|mid\s*low/i.test(value)) return 'midlow';
    if (/중|보통|mid/i.test(value)) return 'mid';
    return 'low';
}

function reportCenterBuildQuestionWrongGroups(archiveFile, questionNo) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const sessions = (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '') === archiveKey);
    const sessionById = new Map(sessions.map(session => [String(session.id), session]));
    const students = Array.isArray(state?.db?.students) ? state.db.students : [];
    const groups = new Map();
    (Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : []).forEach(row => {
        if (!sessionById.has(String(row.session_id))) return;
        const qNo = String(row.question_no ?? row.questionNo ?? row.question_id ?? row.questionId ?? '').trim();
        if (qNo !== String(questionNo)) return;
        const session = sessionById.get(String(row.session_id));
        const student = students.find(item => String(item.id) === String(session.student_id));
        const classId = reportCenterGetClassIdForSession(session);
        const className = reportCenterGetClassName(classId);
        if (!groups.has(classId)) groups.set(classId, { classId, className, names: [] });
        groups.get(classId).names.push(student?.name || session.student_name || session.student_id || '학생');
    });
    return Array.from(groups.values()).map(group => ({
        ...group,
        names: Array.from(new Set(group.names)).sort((a, b) => String(a).localeCompare(String(b), 'ko'))
    })).filter(group => group.names.length);
}

function reportCenterBuildClassQuestionRates(archiveFile, classId) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (!classId) return new Map();
    const sessions = (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '') === archiveKey)
        .filter(session => String(reportCenterGetClassIdForSession(session)) === String(classId));
    const sessionIds = new Set(sessions.map(session => String(session.id)));
    const wrongCounts = new Map();
    (Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : []).forEach(row => {
        if (!sessionIds.has(String(row.session_id))) return;
        const qNo = String(row.question_no ?? row.questionNo ?? row.question_id ?? row.questionId ?? '').trim();
        if (!qNo) return;
        wrongCounts.set(qNo, (wrongCounts.get(qNo) || 0) + 1);
    });
    const result = new Map();
    if (!sessions.length) return result;
    wrongCounts.forEach((wrongCount, qNo) => {
        result.set(qNo, { takers: sessions.length, wrongCount, correctRate: Math.round(((sessions.length - wrongCount) / sessions.length) * 100) });
    });
    return result;
}

function reportCenterBuildExamAnalysisTableRows(archiveFile, opts = {}) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const candidates = new Set(reportCenterArchiveKeyCandidates(archiveFile));
    const reviews = reportCenterGetExamReviews(archiveKey);
    const rates = reportCenterBuildCohortRates(archiveKey);
    const ratesByQuestion = new Map((rates.rows || []).map(row => [String(row.questionNo), row]));
    const classRates = reportCenterBuildClassQuestionRates(archiveKey, opts.classId || '');
    const blueprints = (Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [])
        .filter(bp => candidates.has(String(bp.archive_file || bp.archiveFile || '').trim()) || candidates.has(reportCenterNormalizeExamAnalysisArchiveKey(bp.archive_file || bp.archiveFile || '')));
    const questionNos = new Set();
    blueprints.forEach(bp => {
        const qNo = String(bp.question_no ?? bp.questionNo ?? bp.no ?? '').trim();
        if (qNo) questionNos.add(qNo);
    });
    ratesByQuestion.forEach((_, qNo) => questionNos.add(qNo));
    reviews.byQuestion.forEach((_, qNo) => questionNos.add(qNo));
    return Array.from(questionNos).sort(reportCenterQuestionNoCompare).map(questionNo => {
        const bp = blueprints.find(row => String(row.question_no ?? row.questionNo ?? row.no ?? '').trim() === questionNo) || {};
        const review = reviews.byQuestion.get(questionNo) || null;
        const reviewData = reportCenterParseReviewJson(review?.review_text || review?.reviewText || '') || {};
        const rate = ratesByQuestion.get(questionNo) || { correctRate: null, wrongCount: 0, takers: rates.takers || 0 };
        const archiveQuestion = reportCenterGetCachedArchiveQuestion(archiveKey, questionNo);
        const hasReview = !!String(review?.review_text || review?.reviewText || '').trim();
        const concept = reviewData.concept || reportCenterFirstSentence(reviewData.asks) || bp.concept || bp.concept_text || bp.standard_unit || bp.standardUnit || '';
        const level = reviewData.level || reviewData.difficulty || bp.level || bp.difficulty || bp.question_level || reportCenterGetQuestionDifficultyLabel(Number(rate.correctRate));
        const questionType = bp.questionType || bp.question_type || reviewData.type || reviewData.questionType || '객관식';
        const classRate = classRates.get(questionNo) || null;
        const correctRate = Number(rate.correctRate);
        const classCorrectRate = Number(classRate?.correctRate);
        return {
            questionNo,
            questionType,
            level,
            levelClass: reportCenterLevelClass(level),
            unit: bp.standard_unit || bp.standardUnit || bp.unit || bp.unit_name || bp.chapter || '단원 미지정',
            concept,
            points: reportCenterExtractQuestionPoints(bp, archiveQuestion),
            correctRate: Number.isFinite(correctRate) ? correctRate : null,
            wrongCount: Number(rate.wrongCount) || 0,
            classCorrectRate: Number.isFinite(classCorrectRate) ? classCorrectRate : null,
            classWrongCount: Number(classRate?.wrongCount) || 0,
            needsClassBoost: Number.isFinite(correctRate) && Number.isFinite(classCorrectRate) && correctRate - classCorrectRate >= 20,
            tag: reportCenterResolveErrorTag(reviewData, Number.isFinite(correctRate) ? correctRate : null),
            answer: review?.answer || bp.answer || archiveQuestion?.answer || '-',
            content: archiveQuestion?.content || archiveQuestion?.contentText || bp.content || bp.content_text || '',
            choices: Array.isArray(archiveQuestion?.choices) ? archiveQuestion.choices : (Array.isArray(bp.choices) ? bp.choices : []),
            reviewData,
            hasReview,
            isAi: reviewData.source === 'ai',
            wrongGroups: reportCenterBuildQuestionWrongGroups(archiveKey, questionNo)
        };
    });
}

function reportCenterBuildWrongGroupChips(groups = []) {
    if (!groups.length) return '<span class="aprc-qtable-muted">오답 학생 없음</span>';
    return groups.map(group => {
        const names = group.names.length > 8 ? `${group.names.slice(0, 6).join(' ')} (${group.names.length}명)` : group.names.join(' ');
        return `<span class="aprc-qtable-chip">${reportCenterEscape(group.className)} · ${reportCenterEscape(names)}</span>`;
    }).join('');
}

function reportCenterBuildExamAnalysisDetailHtml(row, opts = {}) {
    const data = row.reviewData || {};
    const teach = opts.showTeach === false ? '' : (data.teach || '');
    const items = [
        ...(opts.includeContent ? [['문항 원문', [row.content, ...(row.choices || []).map((choice, index) => `${index + 1}. ${choice}`)].filter(Boolean).join('\n') || '-']] : []),
        ['묻는 것', data.asks || row.concept || '분석 대기'],
        ['함정', data.trap || '분석 대기'],
        ['풀이 포인트', data.key || '분석 대기'],
        ['지도 포인트', teach || '분석 대기'],
        ['정답', row.answer || '-']
    ];
    return `
        <div class="aprc-qtable-detail-panel">
            <div class="aprc-qtable-detail-grid">
                ${items.map(([label, body]) => `
                    <div class="aprc-qtable-detail-item">
                        <span class="aprc-qtable-detail-label">${reportCenterEscape(label)}</span>
                        <div class="aprc-qtable-detail-body">${reportCenterArchiveTextToHtml(reportCenterNormalizeMathText(body))}</div>
                    </div>
                `).join('')}
            </div>
            <div class="aprc-qtable-detail-item">
                <span class="aprc-qtable-detail-label">오답 학생 명단</span>
                <div class="aprc-qtable-wrong-groups">${reportCenterBuildWrongGroupChips(row.wrongGroups)}</div>
            </div>
        </div>
    `;
}

function reportCenterBuildExamAnalysisTableHtml(archiveFile, opts = {}) {
    const rows = Array.isArray(opts.rows) ? opts.rows : reportCenterBuildExamAnalysisTableRows(archiveFile, opts);
    if (!rows.length) return '<div class="aprc-qtable-empty">문항 분석표로 표시할 문항이 없습니다.</div>';
    return `
        <div class="aprc-qtable-wrap" data-aprc-qtable>
            <table class="aprc-qtable">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>유형</th>
                        <th>난도</th>
                        <th>단원</th>
                        <th>출제의도·개념</th>
                        <th>배점</th>
                        <th>전체 응시 정답률</th>
                        <th>오답</th>
                        <th>태그</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(row => {
                        const rate = row.correctRate === null ? '-' : `${row.correctRate}%`;
                        const barWidth = row.correctRate === null ? 0 : Math.round(Math.max(0, Math.min(100, row.correctRate)) / 5) * 5;
                        const classLine = row.classCorrectRate === null ? '' : `<span class="aprc-qtable-rate-sub">우리 반 ${row.classCorrectRate}%</span>`;
                        const concept = row.hasReview ? (row.concept || '분석 대기') : '분석 대기';
                        return `
                            <tr class="aprc-qtable-row ${row.needsClassBoost ? 'aprc-qtable-row--boost' : ''}" data-qtable-row="${reportCenterAttr(row.questionNo)}">
                                <td><button type="button" class="aprc-qtable-toggle" data-qtable-toggle aria-expanded="${opts.expandAll ? 'true' : 'false'}" aria-label="${reportCenterAttr(row.questionNo)}번 분석 펼치기">▶</button> ${reportCenterEscape(row.questionNo)}</td>
                                <td><span class="aprc-qtable-chip">${reportCenterEscape(row.questionType || '-')}</span></td>
                                <td><span class="aprc-qtable-chip aprc-qtable-level--${reportCenterAttr(row.levelClass)}">${reportCenterEscape(row.level || '-')}</span></td>
                                <td><span class="aprc-qtable-concept-text">${reportCenterEscape(row.unit || '-')}</span></td>
                                <td><span class="aprc-qtable-concept"><span class="aprc-qtable-concept-text ${row.hasReview ? '' : 'aprc-qtable-muted'}">${reportCenterArchiveTextToHtml(reportCenterNormalizeMathText(concept))}</span>${row.isAi ? '<span class="aprc-qtable-ai">AI</span>' : ''}${row.needsClassBoost ? '<span class="aprc-qtable-ai">수업 보강</span>' : ''}</span></td>
                                <td>${reportCenterEscape(row.points || '-')}</td>
                                <td><span class="aprc-qtable-rate"><span class="aprc-qtable-rate-text">전체 ${reportCenterEscape(rate)}</span>${classLine}<span class="aprc-qtable-bar"><span class="aprc-qtable-bar-fill--${barWidth}"></span></span></span></td>
                                <td>${reportCenterEscape(row.wrongCount)}</td>
                                <td><span class="aprc-qtable-chip">${reportCenterEscape(row.tag || '-')}</span></td>
                            </tr>
                            <tr class="aprc-qtable-detail" data-qtable-detail="${reportCenterAttr(row.questionNo)}" ${opts.expandAll ? '' : 'hidden'}>
                                <td colspan="9">${reportCenterBuildExamAnalysisDetailHtml(row, opts)}</td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function reportCenterBuildExamAnalysisPrintDocument(archiveFile, opts = {}) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const group = reportCenterGetSchoolExamGroupByKey(archiveKey);
    const hub = reportCenterBuildExamHubList().find(row => row.archiveFile === archiveKey) || { title: archiveKey, school: '', grade: '' };
    const sessions = group?.sessions || (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '') === archiveKey);
    const scores = sessions.map(session => Number(session.score)).filter(Number.isFinite);
    const avg = scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : null;
    const rows = reportCenterBuildExamAnalysisTableRows(archiveKey, opts);
    const unitCounts = new Map();
    const levelCounts = new Map();
    rows.forEach(row => {
        unitCounts.set(row.unit || '단원 미지정', (unitCounts.get(row.unit || '단원 미지정') || 0) + 1);
        levelCounts.set(row.level || '난도 미지정', (levelCounts.get(row.level || '난도 미지정') || 0) + 1);
    });
    const summaryList = counts => Array.from(counts.entries())
        .map(([label, count]) => `<span class="aprc-print-pill">${reportCenterEscape(label)} ${count}</span>`)
        .join('');
    return `
        <main class="aprc-exam-analysis-print" data-report-exam-analysis-print="${reportCenterAttr(archiveKey)}">
            <header class="aprc-print-head">
                <div class="aprc-print-brand">AP MATH REPORT</div>
                <h1>${reportCenterEscape(hub.title || archiveKey)} 분석표</h1>
                <p>${reportCenterEscape([hub.school, hub.grade].filter(Boolean).join(' · ') || archiveKey)} · 응시 ${sessions.length}명 · 전체 평균 ${avg === null ? '-' : `${avg}점`} · 작성일 ${new Date().toISOString().slice(0, 10)}</p>
            </header>
            <section class="aprc-print-summary">
                <div><strong>단원 분포</strong><div>${summaryList(unitCounts) || '<span class="aprc-print-muted">단원 정보 없음</span>'}</div></div>
                <div><strong>난도 분포</strong><div>${summaryList(levelCounts) || '<span class="aprc-print-muted">난도 정보 없음</span>'}</div></div>
            </section>
            ${reportCenterBuildExamAnalysisTableHtml(archiveKey, { ...opts, rows, expandAll: true, showTeach: opts.showTeach !== false, includeContent: !!opts.includeContent })}
        </main>
    `;
}

function reportCenterBuildExamAnalysisPrintShell(bodyHtml) {
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>학교시험 분석표 PDF</title>
<style>
    @page { size:A4; margin:12mm; }
    * { box-sizing:border-box; }
    html, body { margin:0; padding:0; background:#fff; color:#111827; }
    body { font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; font-size:11px; line-height:1.45; }
    .aprc-exam-analysis-print { max-width:186mm; margin:0 auto; padding:0; }
    .aprc-print-head { margin-bottom:8mm; border-bottom:2px solid #111827; padding-bottom:5mm; break-inside:avoid; page-break-inside:avoid; }
    .aprc-print-brand { font-size:10px; font-weight:900; color:#2563eb; letter-spacing:0.08em; }
    .aprc-print-head h1 { margin:2mm 0 1mm; font-size:20px; line-height:1.2; }
    .aprc-print-head p { margin:0; color:#475569; font-weight:700; }
    .aprc-print-summary { display:grid; grid-template-columns:1fr 1fr; gap:3mm; margin-bottom:5mm; break-inside:avoid; page-break-inside:avoid; }
    .aprc-print-summary > div { border:1px solid #dbe3ef; border-radius:8px; padding:3mm; }
    .aprc-print-summary strong { display:block; margin-bottom:2mm; font-size:11px; }
    .aprc-print-pill, .aprc-qtable-chip, .aprc-qtable-ai { display:inline-flex; align-items:center; margin:0 1.5mm 1.5mm 0; padding:1.2mm 2mm; border-radius:999px; background:#eef2ff; color:#1d4ed8; font-size:9px; font-weight:900; }
    .aprc-print-muted, .aprc-qtable-muted { color:#64748b; }
    .aprc-qtable-wrap { overflow:visible; border:0; }
    .aprc-qtable { width:100%; border-collapse:collapse; table-layout:fixed; font-size:9.5px; }
    .aprc-qtable th { padding:2mm 1.2mm; border:1px solid #cbd5e1; background:#f1f5f9; color:#334155; text-align:left; font-weight:900; }
    .aprc-qtable td { padding:1.8mm 1.2mm; border:1px solid #dbe3ef; vertical-align:top; }
    .aprc-qtable thead { display:table-header-group; }
    .aprc-qtable tbody { display:table-row-group; }
    .aprc-qtable tr, .aprc-qtable-detail, .aprc-qtable-detail-panel, .aprc-qtable-detail-item { break-inside:avoid; page-break-inside:avoid; }
    .aprc-qtable-toggle { display:none; }
    .aprc-qtable-concept { display:flex; gap:1.5mm; align-items:center; }
    .aprc-qtable-concept-text { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-weight:800; }
    .aprc-qtable-rate-text, .aprc-qtable-rate-sub { display:block; font-weight:900; white-space:nowrap; }
    .aprc-qtable-rate-sub { color:#64748b; font-size:9px; }
    .aprc-qtable-bar { display:block; height:1.3mm; margin-top:1mm; border-radius:999px; background:#e2e8f0; overflow:hidden; }
    .aprc-qtable-bar > span { display:block; height:100%; background:#2563eb; }
    .aprc-qtable-bar-fill--0 { width:0%; } .aprc-qtable-bar-fill--5 { width:5%; } .aprc-qtable-bar-fill--10 { width:10%; } .aprc-qtable-bar-fill--15 { width:15%; } .aprc-qtable-bar-fill--20 { width:20%; } .aprc-qtable-bar-fill--25 { width:25%; } .aprc-qtable-bar-fill--30 { width:30%; } .aprc-qtable-bar-fill--35 { width:35%; } .aprc-qtable-bar-fill--40 { width:40%; } .aprc-qtable-bar-fill--45 { width:45%; } .aprc-qtable-bar-fill--50 { width:50%; } .aprc-qtable-bar-fill--55 { width:55%; } .aprc-qtable-bar-fill--60 { width:60%; } .aprc-qtable-bar-fill--65 { width:65%; } .aprc-qtable-bar-fill--70 { width:70%; } .aprc-qtable-bar-fill--75 { width:75%; } .aprc-qtable-bar-fill--80 { width:80%; } .aprc-qtable-bar-fill--85 { width:85%; } .aprc-qtable-bar-fill--90 { width:90%; } .aprc-qtable-bar-fill--95 { width:95%; } .aprc-qtable-bar-fill--100 { width:100%; }
    .aprc-qtable-detail td { background:#f8fafc; }
    .aprc-qtable-detail-grid { display:grid; grid-template-columns:1fr 1fr; gap:2mm; }
    .aprc-qtable-detail-item { border:1px solid #e2e8f0; border-radius:6px; padding:2mm; background:#fff; }
    .aprc-qtable-detail-label { display:block; margin-bottom:1mm; color:#64748b; font-size:9px; font-weight:900; }
    .aprc-qtable-detail-body { font-size:10px; font-weight:700; overflow-wrap:anywhere; }
    .aprc-qtable-wrong-groups { display:flex; flex-wrap:wrap; gap:1.5mm; }
    @media print {
        html, body { background:#fff !important; }
        .aprc-exam-analysis-print { width:100% !important; max-width:186mm !important; }
        thead { display:table-header-group !important; }
        tr, .aprc-qtable-detail, .aprc-qtable-detail-panel, .aprc-qtable-detail-item { break-inside:avoid !important; page-break-inside:avoid !important; }
    }
</style>
<script>
    window.__AP_REPORT_PRINT_TRIGGERED = false;
    window.__AP_REPORT_TRIGGER_PRINT = function() {
        if (window.__AP_REPORT_PRINT_TRIGGERED) return;
        window.__AP_REPORT_PRINT_TRIGGERED = true;
        setTimeout(function() { try { window.focus(); } catch (e) {} window.print(); }, 200);
    };
    window.MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']] },
        svg: { fontCache: 'global' },
        startup: { pageReady: function() { return MathJax.startup.defaultPageReady().then(window.__AP_REPORT_TRIGGER_PRINT).catch(window.__AP_REPORT_TRIGGER_PRINT); } }
    };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" onerror="setTimeout(window.__AP_REPORT_TRIGGER_PRINT, 2500)"></script>
</head>
<body>
${bodyHtml}
<script>window.addEventListener('load', function(){ setTimeout(function(){ if (!window.__AP_REPORT_PRINT_TRIGGERED) window.__AP_REPORT_TRIGGER_PRINT(); }, 5000); });<\/script>
</body>
</html>`;
}

async function reportCenterOpenExamAnalysisPrintView(archiveFile, options = {}) {
    const includeContent = !!options.includeContent;
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (includeContent) {
        try { await reportCenterFetchArchiveBankByFile(archiveKey); } catch (e) { console.warn('[reportCenterOpenExamAnalysisPrintView] archive preload failed:', e); }
    }
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
        toast('팝업 차단을 해제한 뒤 다시 시도하세요.', 'warn');
        return null;
    }
    const html = reportCenterBuildExamAnalysisPrintShell(reportCenterBuildExamAnalysisPrintDocument(archiveKey, options));
    win.document.open();
    win.document.write(html);
    win.document.close();
    return html;
}

async function reportCenterBuildSchoolExamArchiveAiPayload(archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    try { await reportCenterFetchArchiveBankByFile(archiveKey); } catch (e) {}
    const group = reportCenterGetSchoolExamGroupByKey(archiveKey);
    const hub = reportCenterBuildExamHubList().find(row => row.archiveFile === archiveKey) || {};
    const rows = reportCenterBuildExamAnalysisTableRows(archiveKey);
    return {
        reportType: 'exam_archive_analysis',
        generatedFrom: 'AP_MATH_OS_SCHOOL_EXAM_ARCHIVE_ANALYSIS',
        archive_file: archiveKey,
        exam: {
            title: hub.title || group?.title || archiveKey,
            school: hub.school || group?.school || '',
            grade: hub.grade || group?.grade || '',
            takers: hub.takers || group?.takers || 0
        },
        instructions: [
            '문항별 JSON을 생성한다.',
            `tag는 ${reportCenterErrorTags().join('|')} 중 하나만 사용한다.`,
            '사람이 검수하기 쉬운 자연스러운 한국어 문장으로 작성한다.',
            '채점 메모 말투, 학부모 안내 말투, 책임 전가 표현을 쓰지 않는다.',
            '응답은 questions 배열 또는 JSON 배열로만 구성하고 각 항목은 questionNo, concept, tag, asks, trap, key, teach를 포함한다.'
        ].join('\n'),
        questions: rows.map(row => ({
            questionNo: row.questionNo,
            unit: row.unit,
            content: row.content || '',
            choices: row.choices || [],
            answer: row.answer || '',
            correctRate: row.correctRate,
            wrongCount: row.wrongCount,
            hasReview: row.hasReview
        }))
    };
}

function reportCenterParseArchiveAiResponse(payload) {
    let source = payload;
    if (typeof source === 'string') {
        const text = source.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
        try { source = JSON.parse(text); } catch (e) { return { overview: '', questions: [] }; }
    }
    if (source?.analysis) source = source.analysis;
    if (typeof source === 'string') return reportCenterParseArchiveAiResponse(source);
    const questions = Array.isArray(source)
        ? source
        : Array.isArray(source?.questions) ? source.questions
        : Array.isArray(source?.reviews) ? source.reviews
        : Array.isArray(source?.items) ? source.items
        : [];
    const overview = source?.overview_text || source?.overview || source?.summary || '';
    return { overview, questions };
}

function reportCenterNormalizeArchiveAiQuestion(item = {}) {
    const questionNo = String(item.questionNo ?? item.question_no ?? item.no ?? '').trim();
    if (!questionNo) return null;
    const allowedTags = new Set(reportCenterErrorTags());
    const tag = allowedTags.has(String(item.tag || '').trim()) ? String(item.tag).trim() : '개념 재정리';
    const result = {
        questionNo,
        concept: String(item.concept || '').trim(),
        tag,
        asks: String(item.asks || item.ask || '').trim(),
        trap: String(item.trap || '').trim(),
        key: String(item.key || item.solutionKey || '').trim(),
        teach: String(item.teach || item.teaching || '').trim(),
        source: 'ai'
    };
    return result.concept || result.asks || result.trap || result.key || result.teach ? result : null;
}

async function reportCenterPersistExamAnalysisToServer(archiveFile, reviews = [], meta = null) {
    if (typeof api === 'undefined' || !api || typeof api.post !== 'function') return null;
    try {
        return await api.post('exam-analysis', {
            archive_file: reportCenterNormalizeExamAnalysisArchiveKey(archiveFile),
            ...(meta ? { meta } : {}),
            reviews
        });
    } catch (e) {
        console.warn('[reportCenterPersistExamAnalysisToServer] failed:', e);
        return null;
    }
}

async function reportCenterRequestSchoolExamArchiveAiAnalysis(archiveFile, buttonEl = null, options = {}) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (!archiveKey) {
        toast('분석할 시험지를 찾지 못했습니다.', 'warn');
        return { saved: 0, skipped: 0 };
    }
    const rows = reportCenterBuildExamAnalysisTableRows(archiveKey);
    const emptyRows = rows.filter(row => !row.hasReview);
    if (!emptyRows.length && !options.overwrite) {
        if (typeof confirm === 'function' && confirm('모든 문항에 분석이 있습니다. 기존 분석을 덮어쓰고 다시 생성할까요?')) {
            options = { ...options, overwrite: true };
        } else {
            toast('모든 문항에 분석이 있습니다.', 'info');
            return { saved: 0, skipped: rows.length };
        }
    }
    if (typeof api === 'undefined' || !api || typeof api.post !== 'function') {
        toast('AI 분석 API가 연결되어 있지 않습니다.', 'warn');
        return { saved: 0, skipped: 0 };
    }
    if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, true, '분석 중');
    try {
        const payload = await reportCenterBuildSchoolExamArchiveAiPayload(archiveKey);
        const response = await api.post('ai/report-analysis', payload);
        if (!response || response.success === false) throw new Error(response?.message || response?.error || '시험지 분석 실패');
        const parsed = reportCenterParseArchiveAiResponse(response.analysis || response.data || response);
        const existing = reportCenterGetExamReviews(archiveKey);
        const reviewPayloads = [];
        let saved = 0;
        let skipped = 0;
        parsed.questions.map(reportCenterNormalizeArchiveAiQuestion).filter(Boolean).forEach(item => {
            const current = existing.byQuestion.get(String(item.questionNo));
            const hasHumanOrSaved = !!String(current?.review_text || current?.reviewText || '').trim();
            if (hasHumanOrSaved && !options.overwrite) {
                skipped += 1;
                return;
            }
            const reviewText = JSON.stringify(item);
            reportCenterUpsertExamReview(archiveKey, item.questionNo, {
                review_text: reviewText,
                answer: current?.answer || '',
                concept: item.concept,
                error_tag: item.tag,
                updated_by: 'ai'
            });
            reviewPayloads.push({ question_no: item.questionNo, review_text: reviewText, answer: current?.answer || '' });
            saved += 1;
        });
        const meta = reportCenterGetExamReviews(archiveKey).meta;
        const overviewText = String(parsed.overview || '').trim();
        const metaPatch = overviewText && !String(meta?.overview_text || '').trim() ? { overview_text: overviewText } : null;
        if (metaPatch) reportCenterUpsertExamMeta(archiveKey, metaPatch);
        if (reviewPayloads.length || metaPatch) reportCenterPersistExamAnalysisToServer(archiveKey, reviewPayloads, metaPatch);
        toast(`시험지 문항분석 ${saved}건을 반영했습니다.`, 'success');
        if (typeof openReportCenterModal === 'function') {
            try {
                const nav = typeof reportCenterNavState === 'function' ? reportCenterNavState() : null;
                openReportCenterModal(nav?.studentId || '', 'daily', { forceDrilldown: true });
            } catch (renderError) {
                console.warn('[reportCenterRequestSchoolExamArchiveAiAnalysis] refresh failed:', renderError);
            }
        }
        return { saved, skipped };
    } catch (e) {
        console.error('[reportCenterRequestSchoolExamArchiveAiAnalysis] failed:', e);
        toast('시험지 프리미엄 문항분석에 실패했습니다.', 'warn');
        return { saved: 0, skipped: 0, error: e };
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterEnsureExamAnalysisTableEvents() {
    if (typeof document === 'undefined' || typeof document.addEventListener !== 'function' || document.__aprcQtableEvents) return;
    document.__aprcQtableEvents = true;
    document.addEventListener('click', event => {
        const printButton = event.target?.closest?.('[data-exam-analysis-print]');
        if (printButton) {
            event.preventDefault();
            event.stopPropagation();
            const archiveFile = printButton.getAttribute('data-exam-analysis-print') || '';
            const root = printButton.closest('[data-report-drilldown-level="exam"]') || document;
            const includeContent = !!root.querySelector?.('[data-exam-analysis-print-content]')?.checked;
            const showTeach = root.querySelector?.('[data-exam-analysis-print-teach]')?.checked !== false;
            reportCenterOpenExamAnalysisPrintView(archiveFile, { includeContent, showTeach });
            return;
        }
        const archiveAiButton = event.target?.closest?.('[data-exam-archive-ai]');
        if (archiveAiButton) {
            event.preventDefault();
            event.stopPropagation();
            reportCenterRequestSchoolExamArchiveAiAnalysis(archiveAiButton.getAttribute('data-exam-archive-ai') || '', archiveAiButton);
            return;
        }
        const toggle = event.target?.closest?.('[data-qtable-toggle]');
        const row = toggle ? toggle.closest('[data-qtable-row]') : event.target?.closest?.('[data-qtable-row]');
        if (!row) return;
        const qNo = row.getAttribute('data-qtable-row');
        const detail = Array.from(row.parentElement?.querySelectorAll?.('[data-qtable-detail]') || [])
            .find(item => item.getAttribute('data-qtable-detail') === qNo);
        if (!detail) return;
        const open = detail.hasAttribute('hidden');
        detail.toggleAttribute('hidden', !open);
        const btn = row.querySelector('[data-qtable-toggle]');
        if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }, true); // 캡처 단계: 모달 컨테이너의 onclick stopPropagation이 버블을 끊어도 동작해야 함
}

function reportCenterBuildExamDashboard(studentId, archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    reportCenterLoadStudentReportsFromServer(archiveKey);
    reportCenterEnsureExamAnalysisTableEvents(); // 행 펼침/인쇄/AI 버튼 위임 핸들러 (정의만 있고 미호출이던 버그)
    const group = reportCenterGetSchoolExamGroupByKey(archiveFile) || reportCenterGetSchoolExamGroupByKey(archiveKey);
    const hub = reportCenterBuildExamHubList().find(row => row.archiveFile === archiveKey) || { archiveFile: archiveKey, title: archiveKey, takers: 0, reviewCount: 0, blueprintCount: 0 };
    const reviews = reportCenterGetExamReviews(archiveKey);
    const blueprints = (Array.isArray(state?.db?.exam_blueprints) ? state.db.exam_blueprints : [])
        .filter(bp => reportCenterNormalizeExamAnalysisArchiveKey(bp.archive_file || bp.archiveFile || '') === archiveKey);
    const sessions = group?.sessions || (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .filter(session => reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || '') === archiveKey);
    const wrongRows = Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : [];
    const rates = reportCenterBuildCohortRates(archiveKey);
    const students = Array.isArray(state?.db?.students) ? state.db.students : [];
    const unitCounts = new Map();
    const difficultyCounts = new Map();
    blueprints.forEach(bp => {
        const unit = String(bp.standard_unit || bp.standardUnit || bp.unit || bp.unit_name || bp.chapter || '단원 미지정').trim();
        const difficulty = String(bp.difficulty || bp.level || bp.question_level || '난도 미지정').trim();
        unitCounts.set(unit, (unitCounts.get(unit) || 0) + 1);
        difficultyCounts.set(difficulty, (difficultyCounts.get(difficulty) || 0) + 1);
    });
    const distributionHtml = (title, counts) => `
        <div style="padding:12px; border-radius:12px; background:var(--bg); border:1px solid var(--border);">
            <div style="font-size:12px; font-weight:900; color:var(--text); margin-bottom:8px;">${title}</div>
            ${counts.size ? Array.from(counts.entries()).map(([label, count]) => `
                <div style="display:flex; justify-content:space-between; gap:8px; font-size:12px; font-weight:700; color:var(--secondary); line-height:1.8;">
                    <span>${reportCenterEscape(label)}</span><span>${count}</span>
                </div>
            `).join('') : '<div style="font-size:12px; font-weight:700; color:var(--secondary);">블루프린트 없음</div>'}
        </div>
    `;
    const analysisRows = reportCenterBuildExamAnalysisTableRows(archiveKey);
    const reviewCount = analysisRows.filter(row => row.hasReview).length;
    const analysisTotal = blueprints.length || Number(hub.blueprintCount) || Number(sessions[0]?.question_count) || analysisRows.length || '-';
    const analysisTableHtml = reportCenterBuildExamAnalysisTableHtml(archiveKey, { rows: analysisRows });
    const studentRows = sessions
        .sort((a, b) => Number(b.score ?? -1) - Number(a.score ?? -1))
        .map(session => {
            const student = students.find(s => String(s.id) === String(session.student_id));
            const wrongCount = wrongRows.filter(row => String(row.session_id) === String(session.id)).length;
            return `
                <button class="aprc-pick-card" type="button" data-student-id="${reportCenterAttr(session.student_id)}"
                        onclick="reportCenterNavTo('student', { archiveFile: '${escapeReportJsString(archiveKey)}', studentId: '${escapeReportJsString(session.student_id)}' }); openReportCenterModal('${escapeReportJsString(studentId)}')">
                    <span class="aprc-pick-card__name">${reportCenterEscape(student?.name || session.student_name || session.student_id || '학생')}</span>
                    <span class="aprc-pick-card__go">보기</span>
                    <span class="aprc-pick-card__meta">${session.score ?? '-'}점 · 오답 ${wrongCount}</span>
                </button>
            `;
        }).join('');
    const classRows = reportCenterGetGroupClasses(group || { sessions });
    const classRowsHtml = classRows.map(row => `
        <button class="aprc-pick-card" type="button"
                onclick="reportCenterOpenStudentPicker('${escapeReportJsString(group?.key || archiveKey)}', '${escapeReportJsString(row.classId)}')">
            <span class="aprc-pick-card__name">${reportCenterEscape(row.className)}</span>
            <span class="aprc-pick-card__go">학생 리포트</span>
            <span class="aprc-pick-card__meta">${row.takerCount}명 응시 · 평균 ${row.avg === null ? '-' : `${row.avg}점`} · 오답 ${row.wrongCount}개</span>
        </button>
    `).join('');
    return `
        <div data-report-drilldown-level="exam" style="display:flex; flex-direction:column; gap:12px;">
            <button class="aprc-back-btn" type="button" onclick="reportCenterNavTo('list'); openReportCenterModal('${escapeReportJsString(studentId)}')">← 시험 목록</button>
            <section class="aprc-section">
                <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start; flex-wrap:wrap;">
                    <div style="min-width:0;">
                    <div style="font-size:16px; font-weight:900; color:var(--text);">${reportCenterEscape(hub.title || '시험지')}</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:5px;">${reportCenterEscape([hub.school, hub.grade].filter(Boolean).join(' · ') || archiveKey)}</div>
                    </div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <span class="aprc-chip">응시 ${hub.takers || sessions.length}</span>
                        <span class="aprc-chip">문항분석 ${hub.reviewCount}/${hub.blueprintCount || '-'}</span>
                    </div>
                </div>
                <div style="margin-top:10px; font-size:13px; font-weight:700; color:var(--text); line-height:1.7;">${reportCenterEscape(reviews.meta?.overview_text || reviews.meta?.overview || '저장된 시험지 총평이 없습니다.')}</div>
            </section>
            <section class="aprc-section">
                <div class="aprc-section-title">반 선택</div>
                <div class="aprc-pick-grid aprc-pick-grid--wide">${classRowsHtml || '<div style="font-size:12px; font-weight:700; color:var(--secondary);">응시 반이 없습니다.</div>'}</div>
            </section>
            <section class="aprc-section">
                <div class="aprc-section-title">학생 선택</div>
                <div class="aprc-pick-grid">${studentRows || '<div style="font-size:12px; font-weight:700; color:var(--secondary);">응시 학생이 없습니다.</div>'}</div>
            </section>
            <details class="school-exam-dashboard-collapse aprc-section">
                <summary style="cursor:pointer; font-size:14px; font-weight:900; color:var(--text);">시험 대시보드 보기</summary>
                <div style="display:flex; flex-direction:column; gap:12px; margin-top:12px;">
                    <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:8px;">
                        ${distributionHtml('단원 분포', unitCounts)}
                        ${distributionHtml('난도 분포', difficultyCounts)}
                    </div>
            <section class="aprc-section">
                <div style="display:flex; justify-content:space-between; gap:10px; margin-bottom:10px; align-items:center; flex-wrap:wrap;">
                    <div style="font-size:14px; font-weight:900; color:var(--text);">문항 분석 상태</div>
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <label style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:800; color:var(--secondary);"><input type="checkbox" data-exam-analysis-print-content>문항 원문 포함</label>
                        <label style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:800; color:var(--secondary);"><input type="checkbox" data-exam-analysis-print-teach checked>지도 포인트 포함</label>
                        <button type="button" class="aprc-action-btn aprc-action-btn--accent" data-exam-analysis-print="${reportCenterAttr(archiveKey)}">분석표 인쇄/PDF</button>
                        <button type="button" class="aprc-action-btn aprc-action-btn--accent" data-exam-archive-ai="${reportCenterAttr(archiveKey)}">시험지 프리미엄 문항분석</button>
                        <div style="font-size:12px; font-weight:800; color:var(--secondary);">${reviewCount}/${analysisTotal}</div>
                    </div>
                </div>
                ${analysisTableHtml}
            </section>
            <section class="aprc-section">
                <div class="aprc-section-title">전체 응시 정답률</div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    ${rates.rows.map(row => `<span class="aprc-chip">${reportCenterEscape(row.questionNo)}번 ${row.correctRate === null ? '-' : `${row.correctRate}%`}</span>`).join('') || '<span style="font-size:12px; font-weight:700; color:var(--secondary);">집계할 문항이 없습니다.</span>'}
                </div>
            </section>
                </div>
            </details>
        </div>
    `;
}

function reportCenterPickerKey(groupKey, classId = '') {
    return `${String(groupKey || '')}::${String(classId || '')}`;
}

function reportCenterBatchSelectionStore() {
    if (!window.AP_REPORT_BATCH_SELECTIONS || typeof window.AP_REPORT_BATCH_SELECTIONS !== 'object') {
        window.AP_REPORT_BATCH_SELECTIONS = {};
    }
    return window.AP_REPORT_BATCH_SELECTIONS;
}

function reportCenterEnsureBatchSelection(groupKey, classId, students) {
    const key = reportCenterPickerKey(groupKey, classId);
    const store = reportCenterBatchSelectionStore();
    const availableIds = students.map(row => String(row.studentId || '')).filter(Boolean);
    if (!Array.isArray(store[key])) store[key] = availableIds;
    store[key] = store[key].filter(id => availableIds.includes(String(id)));
    return store[key];
}

function reportCenterSetBatchSelection(groupKey, classId, selectedIds) {
    const key = reportCenterPickerKey(groupKey, classId);
    reportCenterBatchSelectionStore()[key] = Array.from(new Set((selectedIds || []).map(id => String(id)).filter(Boolean)));
}

function reportCenterToggleReportStudent(groupKey, classId, studentId, checked) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    const students = reportCenterGetGroupClassStudents(group, classId);
    const selected = new Set(reportCenterEnsureBatchSelection(groupKey, classId, students));
    if (checked) selected.add(String(studentId));
    else selected.delete(String(studentId));
    reportCenterSetBatchSelection(groupKey, classId, Array.from(selected));
    reportCenterOpenStudentPicker(groupKey, classId);
}

function reportCenterSelectAllReportStudents(groupKey, classId) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    const students = reportCenterGetGroupClassStudents(group, classId);
    reportCenterSetBatchSelection(groupKey, classId, students.map(row => row.studentId));
    reportCenterOpenStudentPicker(groupKey, classId);
}

function reportCenterClearReportStudents(groupKey, classId) {
    reportCenterSetBatchSelection(groupKey, classId, []);
    reportCenterOpenStudentPicker(groupKey, classId);
}

function reportCenterBuildStudentPickerView(groupKey, classId = '') {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) {
        return `
            <div data-report-drilldown-level="student-picker" style="padding:18px; border-radius:12px; background:var(--bg); border:1px dashed var(--border); color:var(--secondary); font-size:13px; font-weight:700;">
                선택한 시험지를 찾을 수 없습니다.
            </div>
        `;
    }

    const classes = reportCenterGetGroupClasses(group);
    const selectedClassId = classId || classes[0]?.classId || '';
    const students = reportCenterGetGroupClassStudents(group, selectedClassId);
    const selectedIds = new Set(reportCenterEnsureBatchSelection(group.key, selectedClassId, students));
    const selectedCount = students.filter(row => selectedIds.has(String(row.studentId))).length;
    const classTabs = classes.map(row => `
        <button class="btn ${String(row.classId) === String(selectedClassId) ? 'btn-primary' : ''}" type="button"
                style="min-height:36px; padding:7px 10px; border-radius:10px; font-size:12px; font-weight:800; box-shadow:none; ${String(row.classId) === String(selectedClassId) ? '' : 'background:var(--surface); border:1px solid var(--border);'}"
                onclick="reportCenterOpenStudentPicker('${escapeReportJsString(group.key)}', '${escapeReportJsString(row.classId)}')">
            ${reportCenterEscape(row.className)}
        </button>
    `).join('');
    const studentRows = students.map(row => {
        const checked = selectedIds.has(String(row.studentId));
        return `
            <label class="aprc-pick-label">
                <input type="checkbox" ${checked ? 'checked' : ''} onchange="reportCenterToggleReportStudent('${escapeReportJsString(group.key)}', '${escapeReportJsString(selectedClassId)}', '${escapeReportJsString(row.studentId)}', this.checked)">
                <span style="min-width:0; overflow:hidden;">
                    <span class="aprc-pick-label__name">${reportCenterEscape(row.name || row.studentName || '학생')}</span>
                    <span class="aprc-pick-label__meta">${row.score ?? '-'}점 · 오답 ${row.wrongCount}개</span>
                </span>
                <button class="aprc-pick-mini-btn" type="button" title="상세 리포트 보기" onclick="event.preventDefault(); reportCenterNavTo('student', { archiveFile: '${escapeReportJsString(group.archiveFile)}', studentId: '${escapeReportJsString(row.studentId)}' }); openReportCenterModal('${escapeReportJsString(row.studentId)}')">보기</button>
            </label>
        `;
    }).join('');

    return `
        <div data-report-drilldown-level="student-picker" style="display:flex; flex-direction:column; gap:12px;">
            <button class="aprc-back-btn" type="button" onclick="reportCenterNavTo('exam', { archiveFile: '${escapeReportJsString(group.archiveFile)}' }); openReportCenterModal('')">← 반/학생 선택</button>
            <section class="aprc-section">
                <div style="font-size:16px; font-weight:900; color:var(--text);">${reportCenterEscape(group.title || '학교시험')} 학생 선택</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:5px;">선택 ${selectedCount}명 / 응시 ${students.length}명</div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:12px;">${classTabs}</div>
            </section>
            <section class="aprc-section">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
                    <div style="font-size:14px; font-weight:900; color:var(--text);">학생 리포트</div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap;">
                        <button class="btn" type="button" style="min-height:34px; padding:7px 10px; border-radius:9px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="reportCenterSelectAllReportStudents('${escapeReportJsString(group.key)}', '${escapeReportJsString(selectedClassId)}')">전체 선택</button>
                        <button class="btn" type="button" style="min-height:34px; padding:7px 10px; border-radius:9px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="reportCenterClearReportStudents('${escapeReportJsString(group.key)}', '${escapeReportJsString(selectedClassId)}')">선택 해제</button>
                    </div>
                </div>
                <div class="aprc-pick-grid aprc-pick-grid--tight">${studentRows || '<div style="font-size:12px; font-weight:700; color:var(--secondary);">응시한 학생이 없습니다.</div>'}</div>
            </section>
            <button class="btn btn-primary" type="button" style="min-height:46px; border-radius:12px; font-size:13px; font-weight:900;" ${selectedCount ? '' : 'disabled'} onclick="reportCenterOpenBatchPrintView('${escapeReportJsString(group.key)}', '${escapeReportJsString(selectedClassId)}')">
                선택 학생 리포트 이어서 출력
            </button>
        </div>
    `;
}

function reportCenterBuildSchoolExamShell(studentId, bodyHtml) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    return `
        <div class="aprc-drilldown-shell" data-report-center-mode="drilldown" style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:14px 16px; border-radius:16px; background:var(--surface-2); border:1px solid var(--border);">
                <div>
                    <div style="font-size:20px; font-weight:900; color:var(--text); line-height:1.35;">리포트 센터</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px; line-height:1.5;">학교시험 분석, 학생 리포트, 상담/발송 문구를 한 곳에서 관리합니다.</div>
                    ${student ? `<div style="font-size:12px; font-weight:800; color:var(--primary); margin-top:6px;">${reportCenterEscape(student.name || '학생')} 학생</div>` : ''}
                </div>
                ${reportCenterAdvancedToggleHtml(studentId, 'daily')}
            </div>
            ${reportCenterInternalMenuHtml(studentId, 'schoolExam')}
            ${bodyHtml}
        </div>
    `;
}

function reportCenterOpenStudentPicker(groupKey, classId = '') {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) {
        toast('선택한 시험지를 찾을 수 없습니다.', 'warn');
        return;
    }
    reportCenterShowWideModal('리포트 센터', reportCenterBuildSchoolExamShell('', reportCenterBuildStudentPickerView(group.key, classId)));
}

function reportCenterBuildBatchPrintShell(bodyHtml) {
    reportCenterEnsurePremiumReportStyle();
    return `
        <div id="report-print-view" class="report-print-view report-center-batch-print-view">
            <div class="report-print-toolbar no-print">
                <button class="btn" type="button" onclick="openReportCenterHome()" style="min-height:38px; padding:8px 12px; border-radius:10px; font-weight:800;">리포트 센터</button>
                <button class="btn btn-primary" type="button" onclick="window.print()" style="min-height:38px; padding:8px 12px; border-radius:10px; font-weight:800;">인쇄/PDF 저장</button>
            </div>
            <div class="report-print-stage" id="report-print-document-root">${bodyHtml}</div>
        </div>
    `;
}

function reportCenterBuildBatchPrintDocument(items, options = {}) {
    const rows = Array.isArray(items) ? items : [];
    const reportKind = options.reportKind || 'schoolExamDetail';
    return rows.map((item, index) => `
        <section class="report-center-batch-page" data-report-center-batch-index="${index + 1}">
            ${reportKind === 'legacyExam'
                ? reportCenterBuildCleanPdfDocument(item.studentId, item.sessionId, {
                    teacherMemo: options.teacherMemo || '',
                    aiAnalysis: reportCenterGetCachedAiAnalysis(item.sessionId)
                })
                : reportCenterBuildSchoolExamDetailedPrintDocument(item.studentId, item.sessionId, {
                    archiveDetails: item.archiveDetails || null
                })}
        </section>
    `).join('');
}

async function reportCenterOpenBatchPrintView(groupKey, classId = '', studentIds = null) {
    const group = reportCenterGetSchoolExamGroupByKey(groupKey);
    if (!group) {
        toast('선택한 시험지를 찾을 수 없습니다.', 'warn');
        return;
    }
    const students = reportCenterGetGroupClassStudents(group, classId);
    const selected = Array.isArray(studentIds) && studentIds.length
        ? studentIds.map(id => String(id))
        : reportCenterEnsureBatchSelection(group.key, classId, students);
    const selectedSet = new Set(selected);
    const items = students
        .filter(row => selectedSet.has(String(row.studentId)))
        .map(row => ({ studentId: row.studentId, sessionId: row.sessionId }));
    if (!items.length) {
        toast('출력할 학생을 선택해 주세요.', 'warn');
        return;
    }
    const sessions = Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [];
    const itemsWithDetails = await Promise.all(items.map(async item => {
        const session = sessions.find(row => String(row.id) === String(item.sessionId));
        if (!session) return item;
        try {
            const archiveDetails = reportCenterGetCachedArchiveDetails(session.id) || await reportCenterFetchArchiveQuestionDetails(session);
            return { ...item, archiveDetails };
        } catch (e) {
            console.warn('[reportCenterOpenBatchPrintView] archive detail preload failed:', e);
            return item;
        }
    }));
    const root = document.getElementById('app-root') || document.body;
    document.querySelectorAll('#report-center-wide-overlay, .report-center-wide-overlay, .wide-overlay').forEach(el => el.remove());
    root.innerHTML = reportCenterBuildBatchPrintShell(reportCenterBuildBatchPrintDocument(itemsWithDetails, { reportKind: 'schoolExamDetail' }));
    reportCenterInjectPrintViewStyle();
    reportCenterTypesetMath(document.getElementById('report-print-document-root'));
    window.scrollTo(0, 0);
    toast(`${items.length}명 리포트를 출력 화면으로 열었습니다.`, 'success');
}

function reportCenterBuildSchoolExamStudentStatusBadges(studentId, session = {}) {
    const archiveFile = session.archive_file || session.archiveFile || '';
    const archiveDetails = reportCenterGetCachedArchiveDetails?.(session.id);
    const archiveText = archiveDetails?.ok
        ? '문항 원문 로드 완료'
        : archiveDetails && archiveDetails.ok === false
        ? '문항 원문 일부 없음'
        : '문항 원문 불러오는 중';
    const serverReport = reportCenterGetServerStudentReport(studentId, archiveFile, 'counsel');
    const savedFields = reportCenterGetSavedCounselFields(studentId, archiveFile);
    const saveText = serverReport ? '서버 저장본 적용' : savedFields ? '로컬 임시 저장' : '로컬 기본 리포트';
    const ai = typeof reportCenterGetCachedAiAnalysis === 'function' ? reportCenterGetCachedAiAnalysis(session.id) : null;
    const aiText = ai && reportCenterIsPremiumAiSource(ai.source) ? '프리미엄 분석 적용' : '기본 문구 사용 중';
    return `
        <div class="aprc-student-status-badges" data-report-student-status-badges="1" style="display:flex; gap:6px; flex-wrap:wrap;">
            ${[archiveText, saveText, aiText].map(text => `<span class="aprc-student-status-badge" style="display:inline-flex; align-items:center; min-height:26px; padding:4px 9px; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); color:var(--secondary); font-size:11px; font-weight:900;">${reportCenterEscape(text)}</span>`).join('')}
        </div>
    `;
}

function reportCenterBuildStudentView(studentId, archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const sessions = Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [];
    const session = sessions.find(row =>
        String(row.student_id) === String(studentId) &&
        reportCenterNormalizeExamAnalysisArchiveKey(row.archive_file || row.archiveFile || '') === archiveKey
    );
    if (!session) {
        return `
            <div data-report-drilldown-level="student" style="display:flex; flex-direction:column; gap:12px;">
                <button class="aprc-back-btn" type="button" onclick="reportCenterNavTo('exam', { archiveFile: '${escapeReportJsString(archiveKey)}' }); openReportCenterModal('${escapeReportJsString(studentId)}')">시험 대시보드</button>
                <div style="padding:18px; border-radius:12px; background:var(--bg); border:1px dashed var(--border); color:var(--secondary); font-size:13px; font-weight:700;">학생 응시 기록을 찾을 수 없습니다.</div>
            </div>
        `;
    }
    const students = Array.isArray(state?.db?.students) ? state.db.students : [];
    const student = students.find(row => String(row.id) === String(studentId));
    const wrongRows = (Array.isArray(state?.db?.wrong_answers) ? state.db.wrong_answers : [])
        .filter(row => String(row.session_id) === String(session.id));
    const data = reportCenterGetExamReportData(studentId, session.id);
    const detailedReport = reportCenterBuildSchoolExamDetailedParentReport(studentId, session.archive_file || archiveFile);
    const simpleReport = reportCenterBuildSchoolExamSimpleParentReport(studentId, session.archive_file || archiveFile);
    const counselReport = reportCenterBuildSchoolExamCounselReport(studentId, session.archive_file || archiveFile);
    const reviewCards = reportCenterBuildQuestionReviewCardsForReport(data, {
        limit: 8,
        showAnswer: false,
        showContent: true,
        showSolution: true
    });
    // 문제 원문은 평가 리포트와 동일한 로더/렌더러를 재사용한다(펼칠 때 지연 로드).
    const originalQuestionHtml = '<div id="report-center-archive-details"></div>';
    const premiumAi = typeof reportCenterGetCachedAiAnalysis === 'function' ? reportCenterGetCachedAiAnalysis(session.id) : null;
    const premiumActive = !!(premiumAi && reportCenterIsPremiumAiSource(premiumAi.source));
    const statusBadges = reportCenterBuildSchoolExamStudentStatusBadges(studentId, session);
    return `
        <div data-report-drilldown-level="student" style="display:flex; flex-direction:column; gap:12px;">
            <span data-report-preload-student="${reportCenterAttr(studentId)}" data-report-preload-archive-session="${reportCenterAttr(session.id)}" style="display:none;"></span>
            <button class="aprc-back-btn" type="button" onclick="reportCenterNavTo('exam', { archiveFile: '${escapeReportJsString(archiveKey)}' }); openReportCenterModal('${escapeReportJsString(studentId)}')">← 반/학생 선택</button>
            ${statusBadges}
            ${detailedReport}
            <details style="padding:0;">
                <summary style="cursor:pointer; min-height:38px; padding:9px 12px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); font-size:14px; font-weight:900; color:var(--text);">간단 리포트 보기</summary>
                <div style="margin-top:10px;">${simpleReport}</div>
            </details>
            ${counselReport}
            <section class="aprc-section">
                <div style="font-size:16px; font-weight:900; color:var(--text);">${reportCenterEscape(student?.name || session.student_name || '학생')} 리포트/상담</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:5px;">${reportCenterEscape(session.exam_title || '시험')} · ${session.score ?? '-'}점 · 오답 ${wrongRows.length}</div>
                <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-top:12px;">
                    <button type="button" class="aprc-action-btn aprc-action-btn--primary" onclick="reportCenterOpenSchoolExamDetailedPrintView('${escapeReportJsString(studentId)}', '${escapeReportJsString(session.id)}', event)">상세 리포트 출력</button>
                    <button type="button" class="aprc-action-btn" onclick="reportCenterCopyExamKakaoSummary('${escapeReportJsString(studentId)}', '${escapeReportJsString(session.id)}')">발송 문구 복사</button>
                </div>
                <div style="display:grid; grid-template-columns:${premiumActive ? 'repeat(2,minmax(0,1fr))' : '1fr'}; gap:8px; margin-top:8px;">
                    <button type="button" class="aprc-action-btn aprc-action-btn--accent" onclick="reportCenterRequestSchoolExamAiAnalysis('${escapeReportJsString(studentId)}', '${escapeReportJsString(session.id)}', this)">${premiumActive ? '프리미엄 분석 다시 실행' : '프리미엄 분석'}</button>
                    ${premiumActive ? `<button type="button" class="aprc-action-btn" onclick="reportCenterResetSchoolExamAiAnalysis('${escapeReportJsString(studentId)}', '${escapeReportJsString(session.id)}')">기본 문구로 복귀</button>` : ''}
                </div>
            </section>
            <details class="aprc-section">
                <summary style="cursor:pointer; font-size:14px; font-weight:900; color:var(--text);">선생님용 상세 분석 보기</summary>
                <div style="margin-top:10px;">${wrongRows.length ? `<div class="aprc-qreview-list">${reviewCards || '<div style="font-size:12px; font-weight:700; color:var(--secondary);">저장된 문항 분석이 없습니다.</div>'}</div>` : '<div style="font-size:12px; font-weight:700; color:var(--secondary);">오답 문항이 없습니다.</div>'}</div>
            </details>
            <details style="padding:14px; border-radius:14px; background:var(--surface); border:1px solid var(--border);" ontoggle="if(this.open){reportCenterLoadArchiveQuestionDetails('${escapeReportJsString(studentId)}','${escapeReportJsString(session.id)}',{ silent: true });}">
                <summary style="cursor:pointer; font-size:14px; font-weight:900; color:var(--text);">문제 원문 확인</summary>
                <div class="aprc-qreview-list" style="margin-top:10px;">${originalQuestionHtml}</div>
            </details>
        </div>
    `;
}

function reportCenterOpenStudentDrilldown(studentId, sessionId = '') {
    const session = (Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [])
        .find(row => String(row.student_id) === String(studentId) && (!sessionId || String(row.id) === String(sessionId)));
    if (session) {
        if (!reportCenterHasArchiveFile(session)) {
            openReportCenterExam(studentId, session.id);
            return;
        }
        reportCenterNavTo('student', {
            archiveFile: reportCenterNormalizeExamAnalysisArchiveKey(session.archive_file || session.archiveFile || ''),
            studentId
        });
    } else {
        reportCenterNavTo('list', { studentId });
    }
    openReportCenterModal(studentId, 'daily', { forceDrilldown: true });
}

function reportCenterBuildDrilldownShell(studentId) {
    const nav = reportCenterNavState();
    const shellStudentId = nav.level === 'student' ? (nav.studentId || studentId) : studentId;
    const student = (state.db.students || []).find(s => String(s.id) === String(shellStudentId));
    const name = student?.name || '학생';
    const bodyHtml = nav.level === 'student'
        ? reportCenterBuildStudentView(nav.studentId || studentId, nav.archiveFile)
        : nav.level === 'exam'
        ? reportCenterBuildExamDashboard(studentId, nav.archiveFile)
        : reportCenterRenderExamHubList(studentId);
    const contentHtml = nav.level === 'list' ? `
            <section data-report-drilldown-level="list" style="display:flex; flex-direction:column; gap:12px; padding:16px; border-radius:16px; background:var(--surface); border:1px solid var(--border);">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                    <div>
                        <div style="font-size:16px; font-weight:900; color:var(--text); line-height:1.35;">학교시험 분석 · 시험지 목록</div>
                        <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">응시한 학교 시험지를 기준으로 리포트를 탐색합니다.</div>
                    </div>
                    <button class="btn" type="button" style="min-height:38px; padding:8px 12px; border-radius:10px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="toast('시험지 찾기는 준비 중입니다.', 'info')">시험지 찾기</button>
                </div>
                ${bodyHtml}
            </section>
        ` : bodyHtml;
    return `
        <div class="aprc-drilldown-shell" data-report-center-mode="drilldown" style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding:14px 16px; border-radius:16px; background:var(--surface-2); border:1px solid var(--border);">
                <div>
                    <div style="font-size:20px; font-weight:900; color:var(--text); line-height:1.35;">리포트 센터</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px; line-height:1.5;">학교시험 분석, 학생 리포트, 상담/발송 문구를 한 곳에서 관리합니다.</div>
                    ${student ? `<div style="font-size:12px; font-weight:800; color:var(--primary); margin-top:6px;">${reportCenterEscape(name)} 학생</div>` : ''}
                </div>
                ${reportCenterAdvancedToggleHtml(studentId, 'daily')}
            </div>
            ${reportCenterInternalMenuHtml(studentId, 'schoolExam')}
            ${contentHtml}
        </div>
    `;
}

function reportCenterBaseShell(studentId, activeTab, bodyHtml) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const name = student?.name || '학생';
    const tabs = [
        { key: 'daily', label: '오늘 리포트' },
        { key: 'exam', label: '평가 리포트' },
        { key: 'counsel', label: '상담 리포트' }
    ];

    return `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="padding:14px 16px; border-radius:16px; background:var(--surface-2); border:1px solid var(--border);">
                <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.4;">${reportCenterEscape(name)} 리포트 센터</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px; line-height:1.5;">카톡 문구와 출력용 리포트를 목적별로 나눠 생성합니다.</div>
            </div>
            <div style="display:flex; justify-content:flex-end;">
                ${reportCenterAdvancedToggleHtml(studentId, activeTab)}
            </div>
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; background:var(--bg); padding:4px; border-radius:14px;">
                ${tabs.map(t => `
                    <button class="btn ${activeTab === t.key ? 'btn-primary' : ''}"
                            style="min-height:42px; padding:8px 6px; font-size:12px; font-weight:700; border-radius:10px; box-shadow:none; ${activeTab === t.key ? '' : 'background:var(--surface); border:1px solid var(--border);'}"
                            onclick="openReportCenterModal('${escapeReportJsString(studentId)}', '${t.key}')">${t.label}</button>
                `).join('')}
            </div>
            ${bodyHtml}
        </div>
    `;
}

function openReportCenterModal(studentId, activeTab = 'daily', options = {}) {
    const forceDrilldown = !!options.forceDrilldown;
    const forceAdvanced = !!options.forceAdvanced;
    if (!forceAdvanced && (forceDrilldown || !reportCenterAdvancedMode())) {
        reportCenterShowWideModal('리포트 센터', reportCenterBuildDrilldownShell(studentId));
        return;
    }
    if (activeTab === 'exam') return openReportCenterExam(studentId);
    if (activeTab === 'counsel') return openReportCenterCounsel(studentId);
    return openReportCenterDaily(studentId);
}

function openReportCenterDaily(studentId) {
    const ctx = buildReportContext(studentId);
    if (!ctx.student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const text = reportCenterBuildDailyPreview(ctx);
    const body = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">출결</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.attendance)}</div>
                </div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">숙제</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.homework)}</div>
                </div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">최근평균</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${ctx.avg === null ? '-' : `${ctx.avg}점`}</div>
                </div>
            </div>
            <textarea id="report-center-daily-text" class="btn" style="width:100%; min-height:300px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterCopyText('report-center-daily-text')">카톡 문구 복사</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportCenterPrintText('report-center-daily-text', 'AP Math 데일리 리포트')">출력</button>
            </div>
            <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="requestAiReport('${escapeReportJsString(studentId)}', 'parent')">AI 데일리 문구 생성</button>
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'daily', body));
}


// ─────────────────────────────────────────
// [Report Center v4] 프리미엄 PDF 평가 리포트 디자인 정식화
// ─────────────────────────────────────────

function reportCenterSafePercent(value) {
    return Number.isFinite(value) ? `${value}%` : '-';
}

function reportCenterGetTargetProgressForReport(studentId) {
    if (typeof computeStudentTargetProgress === 'function') {
        return computeStudentTargetProgress(studentId);
    }
    return null;
}

function reportCenterGetExamReportData(studentId, sessionId = '') {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const sessions = reportCenterGetSortedStudentExamSessions(studentId);
    const session = sessionId
        ? sessions.find(e => String(e.id) === String(sessionId))
        : sessions[0];

    if (!student || !session) {
        return { student: student || null, session: session || null, sessions, stats: null, wrongSummary: [], classInfo: reportCenterGetStudentClass(studentId), targetProgress: null, archiveDetails: null };
    }

    const stats = reportCenterBuildQuestionStats(session);
    const wrongSummary = reportCenterBuildWrongSummary(session);
    const classInfo = reportCenterGetStudentClass(studentId);
    const targetProgress = reportCenterGetTargetProgressForReport(studentId);
    const archiveDetails = reportCenterGetCachedArchiveDetails(session.id);

    return { student, session, sessions, stats, wrongSummary, classInfo, targetProgress, archiveDetails };
}

function reportCenterWithArchiveDetails(data, archiveDetails = null) {
    if (!data || !archiveDetails) return data;
    return { ...data, archiveDetails };
}

function reportCenterGetExamReportTeacherMemo() {
    const printMemo = document.getElementById('report-print-teacher-memo');
    if (printMemo) return String(printMemo.value || '').trim();
    return String(document.getElementById('report-center-exam-teacher-memo')?.value || window.AP_REPORT_PENDING_TEACHER_MEMO || '').trim();
}


function reportCenterAiAnalysisCache() {
    window.AP_REPORT_AI_ANALYSIS_CACHE = window.AP_REPORT_AI_ANALYSIS_CACHE || {};
    return window.AP_REPORT_AI_ANALYSIS_CACHE;
}

function reportCenterAiAnalysisStorageKey(sessionId) {
    return `AP_REPORT_AI_ANALYSIS_CACHE_${String(sessionId || '')}`;
}

function reportCenterIsPremiumAiSource(source) {
    const safe = String(source || '').toLowerCase();
    return safe === 'ai' || safe === 'gemini';
}

function reportCenterGetCachedAiAnalysis(sessionId) {
    const key = String(sessionId || '');
    if (!key) return null;

    const memory = reportCenterAiAnalysisCache()[key] || null;
    if (memory && reportCenterIsPremiumAiSource(memory.source)) return memory;

    try {
        const raw = localStorage.getItem(reportCenterAiAnalysisStorageKey(key));
        if (!raw) return null;
        const saved = reportCenterNormalizeAiAnalysis(JSON.parse(raw));
        if (!reportCenterIsPremiumAiSource(saved.source)) return null;
        reportCenterAiAnalysisCache()[key] = saved;
        return saved;
    } catch (e) {
        try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (removeErr) {}
        return null;
    }
}

function reportCenterSetCachedAiAnalysis(sessionId, payload) {
    if (!sessionId || !payload) return payload;
    const key = String(sessionId);
    const normalized = reportCenterNormalizeAiAnalysis(payload);
    if (!reportCenterIsPremiumAiSource(normalized.source)) {
        delete reportCenterAiAnalysisCache()[key];
        try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (e) {}
        return normalized;
    }
    reportCenterAiAnalysisCache()[key] = normalized;
    try { localStorage.setItem(reportCenterAiAnalysisStorageKey(key), JSON.stringify(normalized)); } catch (e) {}
    return normalized;
}

function reportCenterStudentReportSyncStore() {
    window.AP_REPORT_STUDENT_REPORT_SYNC = window.AP_REPORT_STUDENT_REPORT_SYNC || {};
    return window.AP_REPORT_STUDENT_REPORT_SYNC;
}

function reportCenterNormalizeJsonPayload(value) {
    if (value === undefined) return undefined;
    if (value === null) return null;
    return typeof value === 'string' ? value : JSON.stringify(value);
}

async function reportCenterSyncStudentReportToServer(archiveFile, studentId, patch = {}) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (!archiveKey || !studentId) return null;
    if (typeof api === 'undefined' || !api || typeof api.post !== 'function') return null;
    const body = {
        archive_file: archiveKey,
        student_id: String(studentId),
        report_type: patch.report_type || patch.reportType || 'counsel'
    };
    if (patch.session_id || patch.sessionId) body.session_id = patch.session_id || patch.sessionId;
    if (Object.prototype.hasOwnProperty.call(patch, 'fields_json') || Object.prototype.hasOwnProperty.call(patch, 'fieldsJson')) {
        body.fields_json = reportCenterNormalizeJsonPayload(patch.fields_json ?? patch.fieldsJson);
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'ai_json') || Object.prototype.hasOwnProperty.call(patch, 'aiJson')) {
        body.ai_json = reportCenterNormalizeJsonPayload(patch.ai_json ?? patch.aiJson);
    }
    try {
        return await api.post('student-reports', body);
    } catch (e) {
        console.warn('[reportCenterSyncStudentReportToServer] failed:', e);
        return null;
    }
}

function reportCenterUpsertStudentReportRows(rows = []) {
    if (!state.db) state.db = {};
    const existing = Array.isArray(state.db.exam_student_reports) ? state.db.exam_student_reports : [];
    const byKey = new Map(existing.map(row => [`${reportCenterNormalizeExamAnalysisArchiveKey(row.archive_file || row.archiveFile || '')}::${row.student_id || row.studentId || ''}::${row.report_type || row.reportType || 'counsel'}`, row]));
    rows.forEach(row => {
        const key = `${reportCenterNormalizeExamAnalysisArchiveKey(row.archive_file || row.archiveFile || '')}::${row.student_id || row.studentId || ''}::${row.report_type || row.reportType || 'counsel'}`;
        byKey.set(key, row);
    });
    state.db.exam_student_reports = Array.from(byKey.values());
    return state.db.exam_student_reports;
}

function reportCenterParseStudentReportJson(raw) {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try {
        const parsed = JSON.parse(String(raw));
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch (e) {
        return null;
    }
}

function reportCenterGetServerStudentReport(studentId, archiveFile, reportType = 'counsel') {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    return (Array.isArray(state?.db?.exam_student_reports) ? state.db.exam_student_reports : [])
        .find(row =>
            reportCenterNormalizeExamAnalysisArchiveKey(row.archive_file || row.archiveFile || '') === archiveKey &&
            String(row.student_id ?? row.studentId ?? '') === String(studentId) &&
            String(row.report_type ?? row.reportType ?? 'counsel') === String(reportType)
        ) || null;
}

function reportCenterHydrateStudentReportAiCache(archiveFile, rows = []) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    rows.forEach(row => {
        const ai = reportCenterParseStudentReportJson(row.ai_json ?? row.aiJson);
        if (!ai) return;
        const session = reportCenterFindStudentSchoolExamSession(row.student_id || row.studentId, archiveKey);
        if (!session || reportCenterGetCachedAiAnalysis(session.id)) return;
        reportCenterSetCachedAiAnalysis(session.id, ai);
    });
}

async function reportCenterLoadStudentReportsFromServer(archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    if (!archiveKey) return null;
    const store = reportCenterStudentReportSyncStore();
    if (store[archiveKey] === 'loaded' || store[archiveKey] === 'loading') return null;
    if (typeof api === 'undefined' || !api || typeof api.get !== 'function') return null;
    store[archiveKey] = 'loading';
    try {
        const r = await api.get(`student-reports?archive_file=${encodeURIComponent(archiveKey)}`);
        if (!r || r.success === false) throw new Error(r?.message || r?.error || 'student report load failed');
        const rows = Array.isArray(r.rows) ? r.rows : [];
        reportCenterUpsertStudentReportRows(rows);
        reportCenterHydrateStudentReportAiCache(archiveKey, rows);
        store[archiveKey] = 'loaded';
        return rows;
    } catch (e) {
        store[archiveKey] = 'failed';
        console.warn('[reportCenterLoadStudentReportsFromServer] failed:', e);
        return null;
    }
}

function reportCenterClearCachedAiAnalysis(sessionId) {
    if (!sessionId) return;
    const key = String(sessionId);
    delete reportCenterAiAnalysisCache()[key];
    try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (e) {}
}

function reportCenterResetExamAiAnalysis(studentId, sessionId = '') {
    reportCenterClearCachedAiAnalysis(sessionId);
    reportCenterRefreshPremiumExamPreview(studentId, sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
}

function reportCenterNormalizeAiAnalysis(raw = {}) {
    const safeString = (value) => String(value || '').trim();
    const safeHumanString = (value, blockKey = '') => reportCenterHumanizeKoreanText(safeString(value), {
        ...reportCenterDefaultTextOptions(),
        blockKey,
        source: 'ai'
    });
    const safeArray = (value, blockKey = '') => Array.isArray(value)
        ? value.map(v => safeHumanString(v, blockKey)).filter(Boolean).slice(0, 8)
        : [];
    const risk = safeString(raw.riskLevel || 'stable');
    return {
        summary: safeHumanString(raw.summary, 'summary'),
        diagnosis: safeHumanString(raw.diagnosis, 'teacherOpinion'),
        wrongAnalysis: safeHumanString(raw.wrongAnalysis, 'weakness'),
        nextPlan: safeHumanString(raw.nextPlan, 'plan'),
        parentMessage: safeHumanString(raw.parentMessage, 'parentMessage'),
        kakaoSummary: safeHumanString(raw.kakaoSummary, 'kakaoSummary'),
        teacherMemo: safeString(raw.teacherMemo),
        riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
        mainWeaknesses: safeArray(raw.mainWeaknesses, 'weakness'),
        nextActions: safeArray(raw.nextActions, 'plan'),
        trendSummary: safeHumanString(raw.trendSummary, 'trend'),
        trendDiagnosis: safeHumanString(raw.trendDiagnosis, 'teacherOpinion'),
        finalExamComment: safeHumanString(raw.finalExamComment, 'summary'),
        recurringWeaknesses: safeArray(raw.recurringWeaknesses, 'weakness'),
        longitudinalPlan: safeArray(raw.longitudinalPlan, 'plan'),
        source: safeString(raw.source || raw._source || ''),
        generatedAt: safeString(raw.generatedAt || new Date().toISOString())
    };
}

function reportCenterGetAiAnalysisForReport(sessionId, options = {}) {
    const candidate = options.aiAnalysis ? reportCenterNormalizeAiAnalysis(options.aiAnalysis) : reportCenterGetCachedAiAnalysis(sessionId);
    if (!candidate) return null;
    return reportCenterIsPremiumAiSource(candidate.source) ? candidate : null;
}

// 쉬운말 최종본으로 통합: 선생님 의견은 reportCenterBuildEasyTeacherOpinionLines로 일원화한다.
function reportCenterBuildExamDiagnosisLines(data, teacherMemo = '') {
    return reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo);
}

function reportCenterGetQuestionDetailMap(data) {
    const map = new Map();
    const details = data.archiveDetails?.details || [];
    details.forEach(d => map.set(String(d.questionNo), d));
    return map;
}


function reportCenterLooksLikeCodeText(value) {
    const text = String(value || '').trim();
    if (!text) return false;
    if (/function\s*\(|=>|\breturn\b|document\.|window\.|createElement|appendChild|querySelector|<script|onclick=|<svg|<canvas/i.test(text)) return true;
    if (/[{};]\s*(const|let|var|function)\b/i.test(text)) return true;
    return false;
}

function reportCenterSafeQuestionText(value, limit = 110) {
    if (typeof value === 'function') return '';
    if (value && typeof value === 'object') return '';
    const stripped = reportCenterStripHtml(value);
    if (!stripped || reportCenterLooksLikeCodeText(stripped)) return '';
    return reportCenterTrimText(stripped, limit);
}

function reportCenterBuildParentQuestionInsight(row, detail = null, opts = {}) {
    const qNo = row?.questionNo || detail?.questionNo || '';
    const reviewData = reportCenterParseReviewJson?.(row?.reviewText || row?.review_text || detail?.reviewText || detail?.review_text || '') || null;
    const unit = reviewData?.concept || row?.concept || detail?.concept || row?.unit || detail?.unit || '해당 단원';
    const rate = Number.isFinite(row?.correctRate) ? row.correctRate : null;
    const bank = REPORT_COPY_BANK.questionInsight;
    const tag = reportCenterResolveErrorTag({ ...(reviewData || {}), tag: row?.tag || reviewData?.tag }, rate);
    const key = tag === '계산·검산' ? 'easy'
        : tag === '풀이 순서' ? 'mid'
        : tag === '조건 해석' ? 'hard'
        : tag === '개념 재정리' ? 'veryHard'
        : rate === null ? 'unknown'
        : rate >= 85 ? 'easy'
        : rate >= 65 ? 'mid'
        : rate >= 45 ? 'hard'
        : 'veryHard';
    const entry = bank[key];
    if (opts.mode === 'short') return reportCopyFillSlots(entry.short, { qNo, unit });
    const cards = entry.cards;
    const idx = Number.isInteger(opts.index) ? opts.index : 0;
    return reportCopyFillSlots(cards[idx % cards.length], { qNo, unit });
}

function reportCenterErrorTags() {
    return ['계산·검산', '풀이 순서', '조건 해석', '개념 재정리'];
}

function reportCenterResolveErrorTag(reviewData = {}, correctRate = null) {
    const explicit = String(reviewData?.tag || '').trim();
    if (reportCenterErrorTags().includes(explicit)) return explicit;
    if (correctRate === null || correctRate === undefined || correctRate === '') return null;
    const rate = Number(correctRate);
    if (!Number.isFinite(rate)) return null;
    if (rate >= 85) return '계산·검산';
    if (rate >= 65) return '풀이 순서';
    if (rate >= 45) return '조건 해석';
    return '개념 재정리';
}

function reportCenterAssertParentSafe(text) {
    let value = String(text || '');
    value = value
        .replace(/코호트/g, '전체 응시')
        .replace(/raw|archive|아카이브|review_text|blueprint/gi, '')
        .replace(/묻는 것/g, '확인한 내용')
        .replace(/함정/g, '실수하기 쉬운 부분')
        .replace(/풀이 포인트/g, '다시 정리할 부분')
        // "정답률 7%의 매우 어려운 문항" 같은 서술형(%의)은 학부모 허용 — 통계 나열만 치환
        .replace(/전체\s*정답률\s*\d+(?:\.\d+)?%(?!의|로)/g, '많은 학생이 어려워한 문항')
        .replace(/반\s*정답률\s*\d+(?:\.\d+)?%(?!의|로)/g, '우리 반에서도 쉽지 않았던 문항')
        // 구문 전체 단위로 제거 (부분 삭제 시 "문항 원문 "처럼 덜렁 남는 것 방지)
        .replace(/문항 원문 확인 불가|비교 자료 부족|전체 정답률 자료 부족|자료 부족|데이터 없음|확인 불가/g, '')
        .replace(/풀이 시작점/g, '조건과 식을 세우는 순서')
        .replace(/안정적으로 잡겠습니다/g, '스스로 정리하는 연습을 하겠습니다')
        .replace(/오답 단원의 핵심 풀이/g, '틀린 문항의 풀이 과정')
        .replace(/오답 환원|답습 대응/g, '필요한 개념과 풀이 순서')
        .replace(/\s{2,}/g, ' ')
        .replace(/\s+([,.])/g, '$1')
        .trim();
    return value;
}

// 학부모 문장에 함정 원문을 얹어도 자연스러운지 판정한다.
// 한글이 충분하고 수식/기호가 과하지 않은 서술문만 통과(코드/수식 축약은 제외).
function reportCenterTrapReadsNatural(text) {
    const value = String(text || '').trim();
    if (!value) return false;
    const hangul = (value.match(/[가-힣]/g) || []).length;
    if (hangul < 6) return false;
    const symbols = (value.match(/[=^/√{}\\()|<>]/g) || []).length;
    return symbols <= 2 && (hangul / value.length) >= 0.4;
}

function reportCenterBuildParentSafeQuestionComment(row = {}, detail = null, opts = {}) {
    const reviewData = reportCenterParseReviewJson?.(row.reviewText || row.review_text || detail?.reviewText || detail?.review_text || '') || {};
    const concept = reviewData.concept || row.concept || detail?.concept || row.unit || row.unitKey || detail?.unit || '해당 단원';
    if (opts?.mode === 'short') {
        const shortText = row.short || row.shortComment || row.diagnosisShort || detail?.short || detail?.shortComment || detail?.diagnosisShort || '';
        const conceptText = concept && concept !== '해당 단원' ? String(concept).trim() : '';
        const joined = [shortText, conceptText].filter(Boolean).join(' · ');
        if (joined) return reportCenterAssertParentSafe(reportCenterNormalizeMathText(joined));
    }
    const rawTrap = reportCenterLooksLikeCodeText(reviewData.trap || '') ? '' : String(reviewData.trap || '').trim();
    const trap = reportCenterTrapReadsNatural(rawTrap) ? rawTrap : '';
    const base = reportCenterBuildParentQuestionInsight({ ...row, ...reviewData, unit: concept }, detail, opts);
    const trapSentence = trap
        ? ` 특히 ${trap.replace(/[.。]+$/g, '')} 부분을 다음 수업에서 다시 정리하겠습니다.`
        : '';
    const toned = typeof reportHumanizeApplyApMathTone === 'function'
        ? reportHumanizeApplyApMathTone(`${base}${trapSentence}`, 'parent')
        : `${base}${trapSentence}`;
    return reportCenterAssertParentSafe(reportCenterNormalizeMathText(toned));
}

// 학부모용 문항 3블록 서술: 해석(정답률+난도 헤드라인/이유) · 오답 의미 · 다음 수업 계획.
// 정답률/태그/개념/함정(자연문일 때만)을 근거로 생성 — 근거 밖 내용 창작 금지.
function reportCenterBuildParentQuestionNarrative(row = {}, detail = null) {
    const reviewData = reportCenterParseReviewJson?.(row.reviewText || row.review_text || detail?.reviewText || detail?.review_text || '') || {};
    const concept = String(reviewData.concept || row.concept || detail?.concept || row.unit || row.unitKey || detail?.unit || '').trim();
    const rate = Number.isFinite(Number(row.correctRate ?? detail?.correctRate)) ? Math.round(Number(row.correctRate ?? detail?.correctRate)) : null;
    const rawTag = String(reviewData.tag || row.tag || '').trim();
    const resolvedTag = reportCenterResolveErrorTag(reviewData, rate) || '';
    const tagText = `${rawTag} ${resolvedTag}`;
    const tag = /계산|검산|산술|부호/.test(tagText) ? 'calc'
        : /순서|절차|단계|풀이/.test(tagText) ? 'order'
        : /조건|해석|범위|경계/.test(tagText) ? 'condition'
        : /개념|정리|공식/.test(tagText) ? 'concept'
        : rate !== null && rate >= 85 ? 'calc'
        : rate !== null && rate >= 65 ? 'order'
        : rate !== null && rate >= 45 ? 'condition'
        : 'concept';
    const rawTrap = reportCenterLooksLikeCodeText(reviewData.trap || '') ? '' : String(reviewData.trap || '').trim();
    const trap = reportCenterTrapReadsNatural(rawTrap) ? rawTrap.replace(/[.!?。]+$/g, '') : '';

    const headline = rate === null
        ? (concept ? `${concept} 적용 과정을 확인하는 문항입니다.` : '핵심 개념 적용을 확인하는 문항입니다.')
        : rate >= 85 ? `전체 정답률 ${rate}%로 대부분 맞힌 기본 문항입니다.`
        : rate >= 65 ? '기본 개념은 잡혀 있어도 풀이 순서에서 실수가 나올 수 있는 문항입니다.'
        : rate >= 45 ? '전체적으로도 쉽지 않았던 적용 문항입니다.'
        : `전체 정답률 ${rate}%의 매우 어려운 최상위 문항입니다.`;

    const reason = trap
        ? `${trap} 부분에서 판단이 흔들리기 쉬웠던 문항입니다.`
        : concept
            ? `${concept} 개념을 문제 상황에 연결하는 과정이 핵심이었습니다.`
            : '';

    const meaningByTag = {
        calc: '대부분의 학생이 해결한 문항이기 때문에 개념 부족보다는 계산과 마무리 확인, 부호 검산 과정에서 실수가 있었을 가능성이 큽니다.',
        order: '개념은 알고 있어도 어느 단계부터 정리할지 흔들리면 감점될 수 있는 문항입니다.',
        condition: '조건을 식으로 옮기고 범위를 끝까지 확인하는 과정이 핵심이었습니다.',
        concept: '해당 개념을 문제에 적용하는 과정이 아직 충분히 안정되지 않은 것으로 보입니다.'
    };
    const actionByTag = {
        calc: '다음 수업에서는 풀이 후 검산 습관과 부호 확인을 바로 점검하겠습니다.',
        order: '같은 유형을 짧게 반복해 조건 표시와 식 세우는 순서를 확인하겠습니다.',
        condition: '조건을 먼저 정리하고 식을 세우는 첫 단계를 다시 연습하겠습니다.',
        concept: '기본 개념을 다시 확인한 뒤 유사 문항에 적용하는 연습을 진행하겠습니다.'
    };
    const keywordAction = /함수|그래프|활용/.test(concept)
        ? ' 특히 상황 해석, 표 만들기, 식 확인 순서로 풀이를 정리하겠습니다.'
        : /부등식|범위/.test(concept)
        ? ' 특히 범위 표시와 경계값 확인을 함께 점검하겠습니다.'
        : /이차방정식|방정식|식/.test(concept)
        ? ' 특히 조건 정리와 식 변형 과정을 한 줄씩 확인하겠습니다.'
        : /인수분해/.test(concept)
        ? ' 특히 부호 확인과 전개 검산을 함께 진행하겠습니다.'
        : /확률|경우/.test(concept)
        ? ' 특히 조건 분류와 중복 확인을 표로 정리하겠습니다.'
        : /도형/.test(concept)
        ? ' 특히 그림에 조건을 표시하고 관계식을 세우는 연습을 하겠습니다.'
        : '';
    const meaning = meaningByTag[tag] || '다음 수업에서 조건과 식을 세우는 순서를 함께 확인하겠습니다.';
    const action = (rate !== null && rate < 45)
        ? `최상위 난도 문항 대비 훈련으로 다음 시험 준비에 맞춰 진행하겠습니다.${keywordAction}`
        : `${actionByTag[tag] || '같은 유형을 다음 수업에서 다시 풀이하며 확인하겠습니다.'}${keywordAction}`;

    const clean = value => reportCenterAssertParentSafe(reportCenterNormalizeMathText(String(value || '')))
        .replace(/\b(raw|archive|blueprint|review_text)\b/gi, '')
        .replace(/자료 없음|확인 불가|못함|부족함|위험|왜곡/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim();
    return {
        headline: clean(headline),
        reason: clean(reason),
        meaning: clean(meaning),
        action: clean(action)
    };
}

function reportCenterFormatParentQuestionRate(value) {
    const rate = Number(value);
    return Number.isFinite(rate) ? `${Math.round(rate)}%` : '-';
}

function reportCenterBuildParentQuestionParagraph(row = {}, detail = null) {
    const reviewData = reportCenterParseReviewJson?.(row.reviewText || row.review_text || detail?.reviewText || detail?.review_text || '') || {};
    const qNo = row?.questionNo ?? row?.question_no ?? detail?.questionNo ?? detail?.question_no ?? '';
    const concept = String(reviewData.concept || row?.unit || row?.unitKey || row?.concept || detail?.unit || detail?.concept || '해당 단원').trim();
    const rate = Number(row?.correctRate ?? detail?.correctRate);
    const rateText = Number.isFinite(rate) ? `전체 정답률 ${Math.round(rate)}%의 ${reportCenterGetQuestionDifficultyLabel(rate)} 문항` : '난도를 함께 확인해야 하는 문항';
    const tagText = `${reviewData.tag || row?.tag || ''} ${reportCenterResolveErrorTag(reviewData, Number.isFinite(rate) ? rate : null) || ''}`;
    const trap = reportCenterTrapReadsNatural(reviewData.trap || '') ? String(reviewData.trap).trim() : '';
    const isEasyMiss = Number.isFinite(rate) && rate >= 85;
    const isHard = Number.isFinite(rate) && rate < 45;
    const isCondition = isHard || /조건|해석|범위|경계|함수|그래프|활용|부등식|방정식/.test(`${concept} ${tagText}`);

    const core = isEasyMiss
        ? `${concept}의 기본 풀이를 차분히 마무리해야 하는`
        : isCondition
            ? `${concept}에서 조건을 먼저 표시하고 식으로 연결해야 하는`
            : `${concept} 개념을 문제 상황에 맞게 적용해야 하는`;
    const meaning = isEasyMiss
        ? '개념 자체를 모른다기보다 계산 과정, 부호 확인, 답안 마무리 점검에서 흔들린 것'
        : isHard
            ? '정답률이 낮은 고난도 문항에서 조건 해석과 활용 흐름을 끝까지 이어가는 과정이 필요했던 것'
            : isCondition
                ? '문제의 조건을 식으로 옮기고 범위까지 확인하는 과정에서 흔들린 것'
                : '개념을 알고 있어도 문제 상황에 적용하는 순서를 정리하는 과정에서 흔들린 것';
    const trapSentence = trap ? (/[.!?。！？]$/.test(trap) ? trap : `${trap}.`) : '';
    const trapText = trapSentence ? ` 특히 ${trapSentence} 이 부분은 다음 수업에서 다시 짚겠습니다.` : '';
    const plan = isEasyMiss
        ? '풀이가 끝난 뒤 부호, 계산, 답안 범위를 다시 확인하는 습관까지 함께 점검하겠습니다'
        : isHard
            ? '조건을 먼저 표시하고 어떤 식을 세워야 하는지 확인한 뒤, 비슷한 고난도 활용 문항까지 이어서 풀어보겠습니다'
            : isCondition
                ? '조건을 먼저 표시하고, 식을 세운 뒤 범위까지 확인하는 순서로 다시 풀어보겠습니다'
                : '필요한 개념을 먼저 정리하고, 같은 유형의 문항으로 적용 순서를 반복하겠습니다';
    return reportCenterAssertParentSafe(
        `${qNo || ''}번은 ${core} 문제입니다. ${rateText}이라 이번에는 ${meaning}으로 보입니다.${trapText} 다음 수업에서는 ${plan}.`
    );
}

function reportCenterResolveAiParentToneBand(data = {}, selectedWrongRows = []) {
    const session = data?.session || {};
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(selectedWrongRows) && selectedWrongRows.length
        ? selectedWrongRows
        : (Array.isArray(stats.wrongRows) ? stats.wrongRows : []);
    const wrongCount = wrongRows.length;
    const score = Number(session.score);
    const overallAverage = Number(stats.overallAvg ?? stats.overallAverage ?? stats.averageScore);
    const questionCount = Number(
        session.question_count ?? session.questionCount ?? stats.questionCount ?? stats.totalQuestions ?? stats.totalCount
    );
    const correctRate = Number.isFinite(Number(stats.correctRate))
        ? Number(stats.correctRate)
        : (Number.isFinite(questionCount) && questionCount > 0 ? ((questionCount - wrongCount) / questionCount) * 100 : null);
    const wrongRatio = Number.isFinite(questionCount) && questionCount > 0 ? wrongCount / questionCount : null;
    const lowerScoreSupportMode = (
        (Number.isFinite(score) && Number.isFinite(overallAverage) && score <= overallAverage - 10) ||
        wrongCount >= 6 ||
        (Number.isFinite(correctRate) && correctRate < 65) ||
        (wrongRatio !== null && wrongRatio >= 0.35)
    );
    const perfect = !lowerScoreSupportMode && wrongCount === 0 && (
        (Number.isFinite(score) && score >= 100) ||
        (Number.isFinite(correctRate) && correctRate >= 100) ||
        (Number.isFinite(questionCount) && questionCount > 0)
    );
    const high = !lowerScoreSupportMode && !perfect && (
        (Number.isFinite(score) && score >= 90) ||
        wrongCount <= 1
    );
    if (lowerScoreSupportMode) return 'lower';
    if (perfect) return 'perfect';
    if (high) return 'high';
    return 'middle';
}

function reportCenterGetAiParentToneSeed(data = {}, selectedWrongRows = []) {
    const band = reportCenterResolveAiParentToneBand(data, selectedWrongRows);
    const seeds = {
        lower: {
            positiveAnchor: '이번 평가는 점수 자체보다 앞으로 어떤 부분을 먼저 정리하면 좋을지 확인하는 자료로 보시면 좋겠습니다.',
            teacherCareMessage: '학원에서는 확인할 문항을 차근차근 다시 살펴보며 조건 확인과 계산 검산 습관을 잡아가겠습니다.',
            parentReassurance: '가정에서는 문제를 많이 다시 풀게 하기보다 풀이 흔적을 가볍게 확인해 주시면 충분합니다.'
        },
        middle: {
            positiveAnchor: '지금의 학습 상태를 유지하면서 실수로 이어지는 부분을 줄이면 더 안정적인 결과로 이어질 수 있습니다.',
            teacherCareMessage: '학원에서는 확인할 문항을 다시 살펴보며 조건 해석과 식 정리를 함께 점검하겠습니다.',
            parentReassurance: '가정에서는 아이가 문제를 풀고 난 뒤 답을 한 번 더 확인하는 습관만 편하게 격려해 주시면 좋겠습니다.'
        },
        high: {
            positiveAnchor: '현재 성취를 바탕으로 심화 유형까지 자연스럽게 이어갈 수 있습니다.',
            teacherCareMessage: '학원에서는 현재의 좋은 결과를 유지하면서 심화 유형과 서술형 풀이까지 확장하겠습니다.',
            parentReassurance: '가정에서는 아이가 풀이 과정을 짧게 설명해보는 습관을 편하게 격려해 주시면 좋겠습니다.'
        },
        perfect: {
            positiveAnchor: '이번 평가는 전 문항을 정확히 해결하며 매우 안정적인 성취를 보여준 결과였습니다.',
            teacherCareMessage: '학원에서는 현재의 정확도를 유지하면서 심화 응용과 서술형 풀이까지 확장하겠습니다.',
            parentReassurance: '가정에서는 이번 성취를 충분히 칭찬해 주시면 좋겠습니다.'
        }
    };
    return { band, ...seeds[band] };
}

function reportCenterBuildRichParentMessage(data, selectedWrongRows = []) {
    const studentName = data?.student?.name || '학생';
    const session = data?.session || {};
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(selectedWrongRows) && selectedWrongRows.length
        ? selectedWrongRows
        : (Array.isArray(stats.wrongRows) ? stats.wrongRows : []);
    const score = Number(session.score);
    const scoreText = Number.isFinite(score) ? `${score}점` : '점수 확인이 필요한 결과';
    const examTitle = session.exam_title || session.examTitle || '이번 시험';
    const positionText = reportCenterBuildScorePositionText({ ...data, session, stats });
    const toneSeed = reportCenterGetAiParentToneSeed(data, wrongRows);
    const priorityRow = wrongRows[0] || null;
    const priorityNo = priorityRow?.questionNo ?? priorityRow?.question_no ?? '';
    const priorityUnit = priorityRow?.unit || priorityRow?.unitKey || priorityRow?.concept || '확인할 단원';
    const priorityRate = Number(priorityRow?.correctRate);
    const rateText = Number.isFinite(priorityRate) ? `정답률이 ${Math.round(priorityRate)}%` : '정답률 확인 대상';
    const wrongText = wrongRows.length
        ? `이번 리포트에서는 ${wrongRows.length}개 오답 중 ${priorityNo ? `${priorityNo}번` : '우선 문항'}을 우선 문항으로 잡아 설명드리겠습니다`
        : toneSeed.band === 'perfect'
            ? '이번 리포트에서는 현재 강점과 다음 확장 방향을 중심으로 안내드리겠습니다'
            : '오답 문항은 많지 않지만 풀이 과정과 답안 마무리는 한 번 더 살펴보겠습니다';
    const actionItems = typeof reportCenterBuildAcademyActionPlan === 'function'
        ? reportCenterBuildAcademyActionPlan(data)
        : [];
    const planText = (actionItems[0] || '틀린 문항을 다시 풀면서 조건 표시와 계산 마무리를 함께 확인하겠습니다.')
        .replace(/^다음 수업에서는\s*/, '');
    const planSentence = planText.replace(/[.。]\s*$/, '');
    const wrongFocus = wrongRows.length
        ? `특히 ${priorityNo ? `${priorityNo}번` : '우선 문항'}처럼 ${priorityUnit} 단원에서 ${rateText}였던 문항은 문제의 조건을 정리하고 식으로 연결하는 과정을 다시 볼 필요가 있습니다.`
        : toneSeed.band === 'perfect'
            ? '이번 결과는 다음 단원으로 넘어가기 전에 정확도와 풀이 완성도를 함께 확인하는 자료로 활용하겠습니다.'
            : '이번 결과는 다음 단원으로 넘어가기 전에 풀이 과정과 답안 마무리를 한 번 더 점검하는 자료로 활용하겠습니다.';
    const supportText = !wrongRows.length
        ? '현재 정확도를 유지하면서 난도를 높이는 방향으로 이어가겠습니다.'
        : wrongRows.some(row => Number(row.correctRate) >= 85)
        ? '정답률이 높은 문항에서의 실점은 개념 부족보다는 계산, 부호, 검산 과정의 실수 가능성이 커서 풀이 후 확인 습관을 함께 잡겠습니다.'
        : wrongRows.some(row => Number(row.correctRate) < 45)
            ? '정답률이 낮은 고난도 문항은 다음 시험 대비 과정에서 조건 정리와 활용 문제 훈련으로 따로 이어가겠습니다.'
            : '이번 오답은 조건을 정리하고 풀이 순서를 끝까지 이어가는 연습으로 충분히 보완할 수 있는 지점입니다.';
    return reportCenterAssertParentSafe([
        `안녕하세요, AP수학입니다. ${studentName} 학생은 ${examTitle}에서 ${scoreText}을 기록했습니다. 이번 시험 위치는 ${positionText}입니다.`,
        `${toneSeed.positiveAnchor} ${wrongFocus} ${wrongText}.`,
        `다음 수업에서는 ${planSentence}. ${supportText} ${toneSeed.teacherCareMessage}`,
        toneSeed.parentReassurance
    ].join('\n\n'));
}

function reportCenterBuildParentWrongQuestionCard(row, detail = null, options = {}) {
    const reviewData = reportCenterParseReviewJson?.(row?.reviewText || row?.review_text || detail?.reviewText || detail?.review_text || '') || {};
    const qNo = row?.questionNo ?? row?.question_no ?? detail?.questionNo ?? detail?.question_no ?? '';
    const unit = reviewData.concept || row?.unit || row?.unitKey || row?.concept || detail?.unit || detail?.concept || '단원 확인';
    const type = row?.type || row?.questionType || row?.kind || detail?.type || detail?.questionType || '유형 확인';
    const point = row?.point ?? row?.points ?? row?.score ?? detail?.point ?? detail?.points ?? '';
    const level = row?.level || row?.difficulty || detail?.level || detail?.difficulty || reportCenterGetQuestionDifficultyLabel(Number(row?.correctRate));
    const correctRate = reportCenterFormatParentQuestionRate(row?.correctRate ?? detail?.correctRate);
    const classCorrectRate = reportCenterFormatParentQuestionRate(row?.classCorrectRate ?? detail?.classCorrectRate);
    const comment = reportCenterBuildParentQuestionParagraph(row || {}, detail);
    const content = detail?.content || detail?.contentText || row?.content || row?.contentText || '';
    const safeContent = reportCenterArchiveTextToHtml(content);
    const choices = Array.isArray(detail?.choices) && detail.choices.length
        ? detail.choices
        : (Array.isArray(row?.choices) ? row.choices : []);
    const answer = detail?.answer ?? row?.answer ?? row?.correctAnswer ?? '';
    const showAnswer = options.showAnswer === true;
    const badge = Number(row?.correctRate ?? detail?.correctRate) < 45 ? '최상위 문항' : '우선 확인 문항';
    const meta = [
        unit,
        type,
        point ? `${point}점` : '',
        level,
        `전체 정답률 ${correctRate}`,
        `반 정답률 ${classCorrectRate}`
    ].filter(Boolean).map(reportCenterEscape).join(' · ');
    const choicesHtml = choices.length
        ? `<ol class="aprc-parent-question-choices">${choices.map(choice => `<li>${reportCenterArchiveTextToHtml(choice)}</li>`).join('')}</ol>`
        : '';
    const answerHtml = showAnswer && answer !== ''
        ? `<div class="aprc-parent-question-answer"><b>정답</b> ${reportCenterArchiveTextToHtml(answer)}</div>`
        : '';
    const originalHtml = safeContent || choicesHtml || answerHtml
        ? `${safeContent ? `<div class="aprc-parent-question-content">${safeContent}</div>` : ''}${choicesHtml}${answerHtml}`
        : '<p>문항 원문을 불러오지 못했습니다. 수업에서는 해당 문항을 직접 다시 확인합니다.</p>';

    return `
        <article class="aprc-parent-question-card">
            <header class="aprc-parent-question-head">
                <div>
                    <div class="aprc-parent-question-no">${reportCenterEscape(qNo)}번 · ${reportCenterEscape(unit)}</div>
                    <div class="aprc-parent-question-meta">${meta}</div>
                </div>
                <span class="aprc-parent-question-badge">${reportCenterEscape(badge)}</span>
            </header>
            <section class="aprc-parent-question-comment">
                <p>${reportCenterEscape(comment)}</p>
            </section>
            <section class="aprc-parent-question-original">
                <div class="aprc-parent-question-label">실제 문항</div>
                ${originalHtml}
            </section>
        </article>
    `;
}

function reportCenterSelectPriorityWrongRows(wrongRows = [], limit = 5) {
    return [...(wrongRows || [])].sort((a, b) => {
        const ar = Number.isFinite(a.correctRate) ? a.correctRate : -1;
        const br = Number.isFinite(b.correctRate) ? b.correctRate : -1;
        if (br !== ar) return br - ar;
        const acr = Number.isFinite(a.classCorrectRate) ? a.classCorrectRate : -1;
        const bcr = Number.isFinite(b.classCorrectRate) ? b.classCorrectRate : -1;
        if (bcr !== acr) return bcr - acr;
        const au = a.unit || a.unitKey ? 1 : 0;
        const bu = b.unit || b.unitKey ? 1 : 0;
        if (bu !== au) return bu - au;
        return Number(a.questionNo || 0) - Number(b.questionNo || 0);
    }).slice(0, limit);
}

function reportCenterSelectParentReportWrongRows(wrongRows = [], limit = 5) {
    const rows = Array.isArray(wrongRows) ? wrongRows : [];
    const keyOf = row => String(row?.questionNo ?? row?.question_no ?? row?.questionId ?? row?.question_id ?? row?.id ?? '');
    const byEasyMistake = [...rows].sort((a, b) => {
        const ar = Number.isFinite(Number(a.correctRate)) ? Number(a.correctRate) : -1;
        const br = Number.isFinite(Number(b.correctRate)) ? Number(b.correctRate) : -1;
        if (br !== ar) return br - ar;
        return Number(a.questionNo || a.question_id || 0) - Number(b.questionNo || b.question_id || 0);
    }).slice(0, 3);
    const byHardQuestion = [...rows].sort((a, b) => {
        const ar = Number.isFinite(Number(a.correctRate)) ? Number(a.correctRate) : 101;
        const br = Number.isFinite(Number(b.correctRate)) ? Number(b.correctRate) : 101;
        if (ar !== br) return ar - br;
        return Number(a.questionNo || a.question_id || 0) - Number(b.questionNo || b.question_id || 0);
    }).slice(0, 2);
    const merged = [];
    const seen = new Set();
    const pushUnique = row => {
        if (!row || merged.length >= limit) return;
        const key = keyOf(row);
        if (key && seen.has(key)) return;
        if (key) seen.add(key);
        merged.push(row);
    };
    byEasyMistake.forEach(pushUnique);
    byHardQuestion.forEach(pushUnique);
    reportCenterSelectPriorityWrongRows(rows, rows.length).forEach(pushUnique);
    return merged.slice(0, limit);
}

function reportCenterSelectExcellentRows(stats, limit = 3) {
    const rows = Array.isArray(stats?.rows) ? stats.rows : [];
    return [...rows]
        .filter(r => Number.isFinite(r.correctRate))
        .sort((a, b) => {
            if (a.correctRate !== b.correctRate) return a.correctRate - b.correctRate;
            return Number(a.questionNo || 0) - Number(b.questionNo || 0);
        })
        .slice(0, limit);
}

function reportCenterGetPremiumTableMeta(data) {
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) {
        return {
            mode: 'excellent',
            title: '우수 해결 문항 분석',
            note: '이번 시험은 전 문항을 정확히 풀었습니다. 아래에는 전체 기준에서 정답률이 낮았던 문항을 중심으로 정리했습니다.'
        };
    }
    if (wrongRows.length > 5) {
        return {
            mode: 'priority',
            title: '먼저 볼 문항 분석표',
            note: `이번 리포트에서는 먼저 볼 문항 5개를 중심으로 정리했습니다. 그 외 ${wrongRows.length - 5}개 문항은 클리닉 시간에 차례로 확인하겠습니다.`
        };
    }
    return {
        mode: 'wrong',
        title: '틀린 문항 분석표',
        note: '문항별 정답률과 단원 정보를 함께 정리했습니다. 다음 수업에서 틀린 문항을 다시 풀이하겠습니다.'
    };
}

// 상세형 전용: 우선 문항별 짧은 코멘트 카드 묶음.
function reportCenterBuildQuestionCommentCards(data, limit = 5) {
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) return '';
    const detailMap = reportCenterGetQuestionDetailMap(data);
    const rows = reportCenterSelectPriorityWrongRows(wrongRows, limit);
    return rows.map((row, index) => {
        const detail = detailMap.get(String(row.questionNo));
        const insight = reportCenterBuildParentSafeQuestionComment(row, detail, { mode: 'full', index });
        return `
            <div class="aprc-qcomment">
                <div class="aprc-qcomment-no">${reportCenterEscape(row.questionNo)}번<span>${reportCenterEscape(row.unit || row.unitKey || '')}</span></div>
                <p>${reportCenterEscape(insight)}</p>
            </div>
        `;
    }).join('');
}

function reportCenterFindStudentSchoolExamSession(studentId, archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    const sessions = Array.isArray(state?.db?.exam_sessions) ? state.db.exam_sessions : [];
    return sessions.find(row =>
        String(row.student_id) === String(studentId) &&
        reportCenterNormalizeExamAnalysisArchiveKey(row.archive_file || row.archiveFile || row.id || '') === archiveKey
    ) || sessions.find(row => String(row.id) === String(archiveFile) && String(row.student_id) === String(studentId)) || null;
}

function reportCenterBuildScoreMeaning(data) {
    const session = data?.session || {};
    const stats = data?.stats || {};
    const score = Number(session.score);
    const recent = reportCenterGetExamTrendData?.(session.student_id || data?.student?.id, { limit: 5 })?.trend || {};
    const recentDelta = Number(recent.scoreDelta);
    const avg = Number(stats.overallAvg);
    const comparedToAverage = Number.isFinite(score) && Number.isFinite(avg) ? score - avg : null;
    const comparedToRecent = Number.isFinite(recentDelta)
        ? (recentDelta > 0 ? '상승' : recentDelta < 0 ? '하락' : '유지')
        : '첫 평가';
    const level = Number.isFinite(score) && score >= 90 ? '우수'
        : comparedToAverage !== null && comparedToAverage >= 20 ? '안정'
        : Number.isFinite(score) && score >= 70 ? '관리'
        : '점검';
    const parentSentence = level === '우수'
        ? '이번 시험은 정확도가 안정적으로 확인되었습니다.'
        : level === '안정'
        ? '전체 응시 평균보다 높은 위치에서 안정적으로 마무리했습니다.'
        : level === '관리'
        ? '맞힌 부분을 유지하면서 틀린 문항의 원인을 다음 수업에서 정리하겠습니다.'
        : '기본 개념과 조건을 식으로 옮기는 순서를 다시 정리해 다음 시험을 준비하겠습니다.';
    return { level, comparedToAverage, comparedToRecent, parentSentence };
}

function reportCenterBuildStudentWrongCauseSummary(studentId, archiveFile) {
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    if (!session) return '상담에 사용할 시험 기록을 찾지 못했습니다.';
    const data = reportCenterGetExamReportData(studentId, session.id);
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    if (!wrongRows.length) return '이번 시험은 오답 문항이 없어 다음 단원 확장 학습에 집중하겠습니다.';
    const tagCounts = new Map();
    const store = reportCenterGetExamReviews(session.archive_file || archiveFile);
    wrongRows.forEach(row => {
        const saved = store.byQuestion?.get?.(String(row.questionNo)) || {};
        const reviewData = reportCenterParseReviewJson?.(saved.review_text || saved.reviewText || '') || {};
        const tag = reportCenterResolveErrorTag(reviewData, row.correctRate) || '재점검';
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
    const [topTag, count] = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1])[0] || [];
    if (count >= 2) return `${topTag} 유형이 여러 문항에서 반복되어, 다음 수업에서 같은 흐름으로 묶어 다시 정리하겠습니다.`;
    return reportCenterBuildWrongCauseSummary(data);
}

function reportCenterBuildSchoolExamParentReport(studentId, archiveFile) {
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    if (!session) return '';
    const data = reportCenterGetExamReportData(studentId, session.id);
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    const comments = wrongRows.slice(0, 4).map(row => reportCenterBuildParentSafeQuestionComment(row, row, { index: Number(row.questionNo) || 0 }));
    const actionItems = reportCenterBuildAcademyActionPlan(data);
    return reportCenterAssertParentSafe([
        reportCenterBuildCompactExamSummary(data),
        ...comments,
        ...actionItems,
        reportCenterBuildCompactParentMessage(data)
    ].filter(Boolean).join('\n'));
}

function reportCenterCounselEditKey(studentId, archiveFile) {
    return `${String(studentId || '')}::${reportCenterNormalizeExamAnalysisArchiveKey(archiveFile || '')}`;
}

function reportCenterSetCounselEditMode(studentId, archiveFile, enabled) {
    if (typeof studentId === 'boolean') {
        enabled = studentId;
        studentId = '';
        archiveFile = '';
    }
    window.AP_REPORT_COUNSEL_EDIT = window.AP_REPORT_COUNSEL_EDIT || {};
    window.AP_REPORT_COUNSEL_EDIT[reportCenterCounselEditKey(studentId, archiveFile)] = !!enabled;
    return !!enabled;
}

function reportCenterCounselEditMode(studentId, archiveFile) {
    return !!window.AP_REPORT_COUNSEL_EDIT?.[reportCenterCounselEditKey(studentId, archiveFile)];
}

// 상담 리포트 수정본은 시험(archive) 메타 안에서 학생 단위 맵으로 보관한다.
function reportCenterFindExamMetaRow(archiveFile) {
    const archiveKey = reportCenterNormalizeExamAnalysisArchiveKey(archiveFile);
    return (Array.isArray(state?.db?.exam_analysis_meta) ? state.db.exam_analysis_meta : [])
        .find(row => reportCenterNormalizeExamAnalysisArchiveKey(row?.archive_file || row?.archiveFile || '') === archiveKey) || null;
}

function reportCenterParseCounselReports(metaRow) {
    const raw = metaRow?.counsel_reports;
    if (!raw) return {};
    if (typeof raw === 'object') return { ...raw };
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    }
    return {};
}

function reportCenterGetSavedCounselFields(studentId, archiveFile) {
    const serverRow = reportCenterGetServerStudentReport(studentId, archiveFile, 'counsel');
    const serverFields = reportCenterParseStudentReportJson(serverRow?.fields_json ?? serverRow?.fieldsJson);
    if (serverFields) return serverFields;
    const reports = reportCenterParseCounselReports(reportCenterFindExamMetaRow(archiveFile));
    const saved = reports[String(studentId)];
    return saved && typeof saved === 'object' ? saved : null;
}

function reportCenterBuildSchoolExamSimpleParentReport(studentId, archiveFile) {
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    if (!session) return '<section class="aprc-counsel-report">간단 리포트를 만들 시험 기록이 없습니다.</section>';
    const data = reportCenterGetExamReportData(studentId, session.id);
    const student = data.student || {};
    const stats = data.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const actionItems = reportCenterBuildAcademyActionPlan(data);
    // 프리미엄 분석이 있으면 카톡/짧은 상담용 문구도 AI 요약·안내로 대체.
    const simpleAi = typeof reportCenterGetCachedAiAnalysis === 'function' ? reportCenterGetCachedAiAnalysis(session.id) : null;
    const isSimplePremium = !!(simpleAi && reportCenterIsPremiumAiSource(simpleAi.source));
    const simpleSummary = isSimplePremium
        ? (simpleAi.kakaoSummary || simpleAi.summary || reportCenterBuildCompactExamSummary(data))
        : reportCenterBuildCompactExamSummary(data);
    const simpleParent = isSimplePremium && simpleAi.parentMessage
        ? simpleAi.parentMessage
        : reportCenterBuildCompactParentMessage(data);
    const lines = [
        `${student.name || '학생'} · ${session.exam_title || '시험'} · ${session.score ?? '-'}점 · 오답 ${wrongRows.length}문항`,
        simpleSummary,
        wrongRows.length ? `${reportCenterShortQuestionList(wrongRows, 5)} 문항을 우선 복습합니다.` : '이번 시험은 오답 문항이 없어 다음 단원 확장 학습으로 이어갑니다.',
        actionItems.slice(0, 2).join(' '),
        simpleParent
    ].filter(Boolean);
    return `
        <article class="aprc-counsel-report" data-report-school-exam-simple="1">
            <header class="aprc-counsel-head">
                <div>
                    <div class="aprc-counsel-kicker">카톡/짧은 상담용</div>
                    <h3>간단 리포트</h3>
                </div>
            </header>
            ${lines.map((line, index) => `
                <section class="aprc-counsel-section" data-report-simple-line="${index + 1}">
                    <p>${reportCenterEscape(line).replace(/\n/g, '<br>')}</p>
                </section>
            `).join('')}
        </article>
    `;
}

function reportCenterBuildSchoolExamDetailedParentReport(studentId, archiveFile, options = {}) {
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    if (!session) return '<section class="aprc-counsel-report">상세 리포트를 만들 시험 기록이 없습니다.</section>';
    const hideInnerHeader = options.hideInnerHeader === true;
    const data = reportCenterWithArchiveDetails(
        reportCenterGetExamReportData(studentId, session.id),
        options.archiveDetails || null
    );
    const student = data.student || {};
    const stats = data.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const detailMap = reportCenterGetQuestionDetailMap(data);
    const parentWrongRows = reportCenterSelectParentReportWrongRows(wrongRows, 5);
    const omittedWrongCount = Math.max(0, wrongRows.length - parentWrongRows.length);
    const questionCards = parentWrongRows
        .map(row => reportCenterBuildParentWrongQuestionCard(row, detailMap.get(String(row.questionNo)), { showAnswer: false }))
        .join('');
    const actionItems = reportCenterBuildAcademyActionPlan(data);
    // 프리미엄 분석(학생별 저장분)이 있으면 문구를 그것으로 대체해 퀄리티를 올린다.
    const ai = typeof reportCenterGetCachedAiAnalysis === 'function' ? reportCenterGetCachedAiAnalysis(session.id) : null;
    const isPremium = !!(ai && reportCenterIsPremiumAiSource(ai.source));
    const summaryText = (isPremium && ai.summary) ? ai.summary : reportCenterBuildCompactExamSummary(data);
    const planText = isPremium
        ? ((Array.isArray(ai.nextActions) && ai.nextActions.length) ? ai.nextActions.join('\n') : (ai.nextPlan || actionItems.join('\n')))
        : (actionItems.join('\n') || reportCenterBuildCompactParentMessage(data));
    const parentText = (isPremium && ai.parentMessage) ? ai.parentMessage : reportCenterBuildRichParentMessage(data, parentWrongRows);
    const premiumBadge = isPremium
        ? ' <span class="aprc-school-detail-premium-badge">프리미엄 분석 적용</span>'
        : '';
    return `
        <article class="aprc-counsel-report" data-report-school-exam-detail="1">
            ${hideInnerHeader ? '' : `<header class="aprc-counsel-head">
                <div>
                    <div class="aprc-counsel-kicker">기본값 · 학부모 상담/출력용${premiumBadge}</div>
                    <h3>${reportCenterEscape(student.name || '학생')} 상세 학부모 리포트</h3>
                </div>
            </header>`}
            <section class="aprc-counsel-section">
                <div class="aprc-counsel-title">시험 요약</div>
                <p>${reportCenterEscape(summaryText).replace(/\n/g, '<br>')}</p>
            </section>
            <section class="aprc-counsel-section">
                <div class="aprc-counsel-title">다음 수업 계획</div>
                <p>${reportCenterEscape(planText).replace(/\n/g, '<br>')}</p>
            </section>
            <section class="aprc-counsel-section">
                <div class="aprc-counsel-title">실제 오답 문제</div>
                ${wrongRows.length ? '<p>먼저 볼 문항을 중심으로 정리했습니다.</p>' : ''}
                ${wrongRows.length
                    ? `<div class="aprc-qreview-list">${questionCards || '<p>오답 문항은 다음 수업에서 직접 풀이하며 정리해 안내드리겠습니다.</p>'}</div>${omittedWrongCount ? `<p>나머지 ${omittedWrongCount}개 문항은 클리닉/수업 시간에 차례로 확인하겠습니다.</p>` : ''}`
                    : '<p>이번 시험은 오답 문항이 없습니다. 다음 단원 확장 학습으로 이어가겠습니다.</p>'}
            </section>
            <section class="aprc-counsel-section">
                <div class="aprc-counsel-title">학부모 안내 문구</div>
                <p>${reportCenterEscape(parentText).replace(/\n/g, '<br>')}</p>
            </section>
        </article>
    `;
}

// 학교시험 학생 화면 전용 프리미엄 분석: 평가리포트와 동일한 AI 엔드포인트·세션 저장을 재사용하되,
// 결과를 드릴다운 학생 화면에 반영한다(sessionId 기준 저장 = 학생별 저장 = localStorage 영속).
async function reportCenterRequestSchoolExamAiAnalysis(studentId, sessionId, buttonEl = null) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('분석할 시험 기록이 없습니다.', 'warn');
        return;
    }
    // 문항 원문 캐시를 먼저 확보하면 payload 품질이 올라간다(있을 때만).
    if (typeof reportCenterPreloadArchiveQuestionDetails === 'function') {
        try { await reportCenterPreloadArchiveQuestionDetails(studentId, sessionId); } catch (e) {}
    }
    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    payload.generatedFrom = 'AP_MATH_OS_SCHOOL_EXAM_REPORT';
    if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, true, '분석 중');
    else toast('프리미엄 분석 중입니다...', 'info');
    try {
        const r = await api.post('ai/report-analysis', payload);
        if (!r || r.success === false) throw new Error(r?.message || r?.error || '프리미엄 분석 실패');
        const source = String(r.source || '').toLowerCase();
        if (source !== 'ai' && source !== 'gemini') {
            reportCenterClearCachedAiAnalysis(sessionId);
            toast('분석 결과가 기준에 맞지 않아 기본 리포트를 유지합니다.', 'warn');
            return;
        }
        const analysis = reportCenterNormalizeAiAnalysis(r.analysis || r.data || r);
        analysis.source = 'ai';
        reportCenterSetCachedAiAnalysis(sessionId, analysis);
        const syncResult = await reportCenterSyncStudentReportToServer(data.session.archive_file || data.session.archiveFile || '', data.student.id || studentId, {
            report_type: 'counsel',
            session_id: data.session.id || sessionId,
            ai_json: analysis
        });
        toast(syncResult
            ? '프리미엄 분석을 생성하고 서버에 저장했습니다.'
            : '프리미엄 분석은 적용했습니다. 서버 저장은 실패해 로컬 캐시로 유지됩니다.',
            syncResult ? 'success' : 'warn');
        if (typeof openReportCenterModal === 'function') openReportCenterModal(studentId, 'daily', { forceDrilldown: true });
    } catch (e) {
        console.error('[reportCenterRequestSchoolExamAiAnalysis] failed:', e);
        toast('프리미엄 분석에 실패했습니다. 기본 리포트를 유지합니다.', 'warn');
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterResetSchoolExamAiAnalysis(studentId, sessionId) {
    reportCenterClearCachedAiAnalysis(sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
    if (typeof openReportCenterModal === 'function') openReportCenterModal(studentId, 'daily', { forceDrilldown: true });
}

function reportCenterBuildSchoolExamDetailedPrintDocument(studentId, sessionId, options = {}) {
    const data = reportCenterWithArchiveDetails(
        reportCenterGetExamReportData(studentId, sessionId),
        options.archiveDetails || null
    );
    const student = data?.student || null;
    const session = data?.session || null;
    if (!student || !session) {
        return '<main class="aprc-pdf-document"><section class="aprc-pdf-panel aprc-empty-box">학교시험 상세 리포트를 만들 시험 기록이 없습니다.</section></main>';
    }
    const archiveFile = session.archive_file || session.archiveFile || '';
    const studentName = student.name || '학생';
    return `
        <main class="aprc-school-detail-document" data-report-school-exam-print="detail">
            <header class="aprc-school-detail-head">
                <div>
                    <div class="aprc-school-detail-brand">AP MATH REPORT</div>
                    <h1>${reportCenterEscape(studentName)} 상세 학부모 리포트</h1>
                    <p>학교시험 오답과 다음 수업 관리 계획을 정리했습니다.</p>
                </div>
            </header>
            ${reportCenterBuildSchoolExamDetailedParentReport(studentId, archiveFile, {
                archiveDetails: data.archiveDetails,
                printMode: true,
                hideInnerHeader: true
            })}
        </main>
    `;
}

function reportCenterBuildSchoolExamDetailedPrintShell(bodyHtml) {
    reportCenterEnsurePremiumReportStyle();
    return `
        <div id="report-print-view" class="report-print-view report-center-school-exam-print-view">
            <div class="report-print-toolbar no-print">
                <button class="btn" type="button" onclick="reportCenterExitSchoolExamPrintMode(); openReportCenterHome()" style="min-height:38px; padding:8px 12px; border-radius:10px; font-weight:800;">리포트 센터</button>
                <button class="btn btn-primary" type="button" onclick="window.print()" style="min-height:38px; padding:8px 12px; border-radius:10px; font-weight:800;">인쇄/PDF 저장</button>
            </div>
            <div class="report-print-stage" id="report-print-document-root">${bodyHtml}</div>
        </div>
    `;
}

async function reportCenterOpenSchoolExamDetailedPrintView(studentId, sessionId = '', event = null) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('출력할 학교시험 기록이 없습니다.', 'warn');
        return;
    }
    let archiveDetails = reportCenterGetCachedArchiveDetails(data.session.id);
    if (!archiveDetails) {
        archiveDetails = await reportCenterFetchArchiveQuestionDetails(data.session);
    }
    const root = document.getElementById('app-root') || document.body;
    document.querySelectorAll('#report-center-wide-overlay, .report-center-wide-overlay, .wide-overlay, .modal-backdrop').forEach(el => el.remove());
    if (document.body?.classList) document.body.classList.add('aprc-school-print-mode');
    root.innerHTML = reportCenterBuildSchoolExamDetailedPrintShell(
        reportCenterBuildSchoolExamDetailedPrintDocument(studentId, data.session.id, { archiveDetails })
    );
    reportCenterInjectPrintViewStyle();
    reportCenterTypesetMath(document.getElementById('report-print-document-root'));
    window.scrollTo(0, 0);
    toast('학교시험 상세 리포트 출력 화면을 열었습니다.', 'success');
}

function reportCenterBuildSchoolExamCounselReport(studentId, archiveFile, options = {}) {
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    if (!session) return '<section class="aprc-counsel-report">상담 리포트를 만들 시험 기록이 없습니다.</section>';
    const data = reportCenterGetExamReportData(studentId, session.id);
    const student = data.student || {};
    const stats = data.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const scoreMeaning = reportCenterBuildScoreMeaning(data);
    const parentReport = reportCenterBuildSchoolExamParentReport(studentId, session.archive_file || archiveFile);
    const wrongSummary = reportCenterBuildStudentWrongCauseSummary(studentId, session.archive_file || archiveFile);
    const comments = wrongRows.slice(0, 4).map((row, index) => reportCenterBuildParentSafeQuestionComment(row, row, { index }));
    const actionItems = reportCenterBuildAcademyActionPlan(data);
    const sections = {
        summary: `${student.name || '학생'} · ${session.exam_title || '시험'} · ${session.score ?? '-'}점 · 전체 응시 평균 ${stats.overallAvg ?? '-'}점 · 오답 ${wrongRows.length}문항`,
        meaning: scoreMeaning.parentSentence,
        cause: [wrongSummary, ...comments].filter(Boolean).join('\n'),
        counsel: wrongRows.length ? '상담에서는 맞힌 부분을 먼저 확인한 뒤, 다시 볼 문항에서 조건을 식으로 옮기는 순서를 짧게 설명하면 좋습니다.' : '상담에서는 정확도를 칭찬하고 다음 단원 확장 계획을 안내하면 좋습니다.',
        action: actionItems.join('\n'),
        parent: parentReport || reportCenterBuildCompactParentMessage(data)
    };
    // 우선순위: 저장된 수정본 > 프리미엄 AI > 기본 뱅크. 프리미엄이 있으면 뱅크 문구를 AI로 대체.
    const counselAi = typeof reportCenterGetCachedAiAnalysis === 'function' ? reportCenterGetCachedAiAnalysis(session.id) : null;
    if (counselAi && reportCenterIsPremiumAiSource(counselAi.source)) {
        if (counselAi.summary) sections.meaning = counselAi.summary;
        if (counselAi.wrongAnalysis) sections.cause = counselAi.wrongAnalysis;
        if (counselAi.diagnosis) sections.counsel = counselAi.diagnosis;
        if (Array.isArray(counselAi.nextActions) && counselAi.nextActions.length) sections.action = counselAi.nextActions.join('\n');
        else if (counselAi.nextPlan) sections.action = counselAi.nextPlan;
        if (counselAi.parentMessage) sections.parent = counselAi.parentMessage;
    }
    // 저장된 학생별 수정본이 있으면 자동 생성분을 덮어쓴다(재렌더 시 수정 반영).
    const savedFields = reportCenterGetSavedCounselFields(studentId, session.archive_file || archiveFile);
    if (savedFields) {
        Object.keys(sections).forEach(key => {
            if (typeof savedFields[key] === 'string' && savedFields[key].trim()) sections[key] = savedFields[key];
        });
    }
    const editMode = options.editMode ?? reportCenterCounselEditMode(studentId, session.archive_file || archiveFile);
    const field = (key, title) => editMode
        ? `<label class="aprc-counsel-field"><b>${title}</b><textarea data-report-counsel-field="${key}">${reportCenterEscape(sections[key])}</textarea></label>`
        : `<section class="aprc-counsel-section" data-report-counsel-section="${key}"><div class="aprc-counsel-title">${reportCenterEscape(title)}</div><p>${reportCenterEscape(sections[key]).replace(/\n/g, '<br>')}</p></section>`;
    return `
        <article class="aprc-counsel-report" data-report-school-exam-counsel="1">
            <header class="aprc-counsel-head">
                <div>
                    <div class="aprc-counsel-kicker">학생별 상담 리포트 1장</div>
                    <h3>${reportCenterEscape(student.name || '학생')} 상담 리포트</h3>
                </div>
                <button type="button" class="btn" onclick="reportCenterSetCounselEditMode('${escapeReportJsString(studentId)}','${escapeReportJsString(session.archive_file || archiveFile)}', ${editMode ? 'false' : 'true'}); openReportCenterModal('${escapeReportJsString(studentId)}')">${editMode ? '취소' : '수정'}</button>
            </header>
            ${field('summary', '상단 요약')}
            ${field('meaning', '이번 시험 총평')}
            ${field('cause', '오답 원인 요약')}
            ${field('counsel', '상담 포인트')}
            ${field('action', '학원 조치')}
            ${field('parent', '학부모 안내 문구')}
            ${editMode ? `<div class="aprc-counsel-actions"><button type="button" class="btn btn-primary" onclick="reportCenterSaveSchoolExamCounselReport('${escapeReportJsString(studentId)}','${escapeReportJsString(session.archive_file || archiveFile)}')">저장</button><button type="button" class="btn" onclick="reportCenterSetCounselEditMode('${escapeReportJsString(studentId)}','${escapeReportJsString(session.archive_file || archiveFile)}', false); openReportCenterModal('${escapeReportJsString(studentId)}')">취소</button></div>` : ''}
        </article>
    `;
}

async function reportCenterSaveSchoolExamCounselReport(studentId, archiveFile) {
    const fields = {};
    document.querySelectorAll('[data-report-counsel-field]').forEach(el => {
        fields[el.getAttribute('data-report-counsel-field')] = String(el.value || '').trim();
    });
    // 학생 단위로만 저장한다 — 시험 총평(overview_text)이나 다른 학생 상담본을 오염시키지 않는다.
    const reports = reportCenterParseCounselReports(reportCenterFindExamMetaRow(archiveFile));
    reports[String(studentId)] = fields;
    reportCenterUpsertExamMeta(archiveFile, { counsel_reports: JSON.stringify(reports) });
    const session = reportCenterFindStudentSchoolExamSession(studentId, archiveFile);
    const syncResult = await reportCenterSyncStudentReportToServer(archiveFile, studentId, {
        report_type: 'counsel',
        session_id: session?.id || '',
        fields_json: fields
    });
    reportCenterSetCounselEditMode(studentId, archiveFile, false);
    if (typeof toast === 'function') {
        toast(syncResult
            ? '상담 리포트를 서버에 저장했습니다.'
            : '서버 저장은 실패했습니다. 이 화면에는 로컬 임시 저장되었습니다.',
            syncResult ? 'success' : 'warn');
    }
    if (typeof openReportCenterModal === 'function' && typeof document?.getElementById === 'function') openReportCenterModal(studentId);
    return fields;
}

function reportCenterBuildDifficultyBarsForPremium(stats) {
    if (!stats || !stats.rows || !stats.rows.length) return '<div class="aprc-muted">난이도 비교 자료가 없습니다.</div>';
    const order = ['쉬움', '보통', '어려움', '매우 어려움', '자료 부족'];
    const max = Math.max(1, ...order.map(k => stats.bucket[k] || 0));
    return order.map(label => {
        const count = stats.bucket[label] || 0;
        const pct = Math.max(4, Math.round((count / max) * 100));
        return `
            <div class="aprc-bar-row">
                <div class="aprc-bar-label">${label}</div>
                <div class="aprc-bar-track"><div class="aprc-bar-fill" style="width:${pct}%;"></div></div>
                <div class="aprc-bar-count">${count}</div>
            </div>
        `;
    }).join('');
}

function reportCenterBuildScorePositionText(data) {
    const session = data.session;
    const stats = data.stats;
    if (!session || !stats) return '비교 자료가 부족합니다.';
    const score = Number(session.score);
    const parts = [];
    if (Number.isFinite(score) && stats.overallAvg !== null) {
        const diff = score - stats.overallAvg;
        parts.push(`전체 평균 대비 ${diff >= 0 ? '+' : ''}${diff}점`);
    }
    if (Number.isFinite(score) && stats.classAvg !== null) {
        const diff = score - stats.classAvg;
        parts.push(`${stats.className || '소속 반'} 평균 대비 ${diff >= 0 ? '+' : ''}${diff}점`);
    }
    return parts.length ? parts.join(' · ') : '동일 평가 비교 자료가 부족합니다.';
}

function reportCenterFirstSentence(value, limit = 72) {
    const text = reportCenterStripHtml(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const match = text.match(/^(.+?[.!?。！？]|.+?(?:습니다|합니다|됩니다|입니다|겠습니다)\.)/);
    return reportCenterTrimText(match ? match[1] : text, limit);
}

function reportCenterShortQuestionList(rows = [], limit = 5) {
    const nums = rows
        .map(r => r?.questionNo)
        .filter(v => v !== null && v !== undefined && String(v).trim() !== '')
        .slice(0, limit)
        .map(v => `${v}번`);
    return nums.length ? nums.join(', ') : '';
}

function reportCenterEasyWrongNums(data, limit = 5) {
    return reportCenterShortQuestionList(reportCenterSelectPriorityWrongRows(data?.stats?.wrongRows || [], limit), limit);
}

function reportCenterEasyScoreDeltaText(delta) {
    const scoreDelta = Number(delta);
    if (!Number.isFinite(scoreDelta)) return '';
    if (scoreDelta > 0) return `첫 시험보다 ${Math.abs(scoreDelta)}점 올랐습니다.`;
    if (scoreDelta < 0) return `첫 시험보다 ${Math.abs(scoreDelta)}점 낮아졌습니다.`;
    return '첫 시험과 같은 점수입니다.';
}

// [문구 톤] 아래 reportCenterBuildEasy* 계열은 함수명에 'Easy'가 남아 있으나,
// 현재는 '쉬운말'이 아니라 전문적+따뜻한 담임 톤의 확정 문구를 생성한다(2026-06-27 방향 전환).
// 이름은 호출처/스냅샷 영향이 커 유지하며, 톤 기준은 전문체임에 유의한다.
// 오답이 몰린 단원명을 최대 limit개까지 반환한다(없으면 '').
function reportCenterWrongUnitPhrase(data, limit = 2) {
    const wrongRows = data?.stats?.wrongRows || [];
    const units = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, limit);
    return units.length ? units.join(', ') : '';
}

// 전체 정답률이 낮았던(어려운) 문항을 정확히 해결했는지 = 이번 시험의 강점 신호.
function reportCenterHasStrengthSignal(data) {
    const stats = data?.stats || {};
    const rows = Array.isArray(stats.rows) ? stats.rows : [];
    const wrongNos = new Set((stats.wrongRows || []).map(r => String(r.questionNo)));
    return rows.some(r => !wrongNos.has(String(r.questionNo))
        && Number.isFinite(r.correctRate) && r.correctRate < 55);
}

// 이번 시험 요약: 절대 점수·정답률 수치는 카드가 담당하므로 여기서는 평균 대비 위치,
// 오답이 몰린 단원, 강점, 그리고 다음 수업에서 실제로 확인할 문항/유형을 문단으로 정리한다.
function reportCenterBuildEasySummaryText(data, wrongCount, correctRate = null) {
    const stats = data?.stats || {};
    if (!Number(wrongCount || 0)) {
        const strength = reportCenterHasStrengthSignal(data)
            ? ' 정답률이 낮았던 문항까지 정확히 해결한 만큼,'
            : '';
        return `이번 시험은 전 문항을 정확히 풀었습니다.${strength} 다음 수업에서는 다음 단원과 한 단계 높은 난도의 문제로 학습 범위를 넓혀가겠습니다. 지금의 강점이 이어지도록 수업 안에서 난도 조절과 풀이 점검을 함께 진행하겠습니다.`;
    }
    const unitPhrase = reportCenterWrongUnitPhrase(data, 2);
    const whereSentence = unitPhrase
        ? (Number(wrongCount) === 1
            ? `틀린 문항은 ${unitPhrase} 단원에서 나왔습니다.`
            : `틀린 ${wrongCount}문항은 주로 ${unitPhrase} 단원에 몰려 있습니다.`)
        : '';
    const strengthSentence = reportCenterHasStrengthSignal(data)
        ? '정답률이 낮았던 문항까지 정확히 해결한 부분은 이번 시험에서 특히 잘한 점입니다.'
        : '';
    const planSentence = '틀린 문항은 다음 수업과 보강에서 다시 풀고, 필요한 개념은 같은 유형 2~3문항으로 한 번 더 확인하겠습니다.';
    const hasClassAvg = stats.classAvg !== null && stats.classAvg !== undefined && stats.classAvg !== '';
    const classAvg = Number(stats.classAvg);
    const rawScore = Number(data?.session?.score);
    let leadSentence;
    if (Number.isFinite(rawScore) && hasClassAvg && Number.isFinite(classAvg)) {
        const diff = Math.abs(rawScore - classAvg);
        const overallDiff = stats.overallAvg !== null && stats.overallAvg !== undefined
            ? rawScore - Number(stats.overallAvg)
            : null;
        if (overallDiff !== null) {
            const classLabel = rawScore >= classAvg ? '높고' : '낮고';
            leadSentence = `이번 시험은 ${stats.className || '반'} 평균보다 ${diff}점 ${classLabel}, 전체 평균과 비교하면 ${Math.abs(overallDiff)}점 ${overallDiff >= 0 ? '높은' : '낮은'} 수준입니다.`;
        } else {
            leadSentence = `이번 시험은 ${stats.className || '반'} 평균보다 ${diff}점 ${rawScore >= classAvg ? '높습니다' : '낮습니다'}.`;
        }
    } else {
        leadSentence = `이번 시험에서는 ${wrongCount}문항을 틀렸습니다.`;
    }
    return [leadSentence, whereSentence, strengthSentence, planSentence].filter(Boolean).join(' ');
}

function reportCenterBuildEasyTrendText(trendData) {
    const selected = trendData?.selectedSessions || [];
    const trend = trendData?.trend || {};
    if (!selected.length) return '';
    if (selected.length === 1) return '이번이 첫 시험 기록입니다. 다음 시험부터 점수 변화를 함께 살펴 보여드리겠습니다.';
    const direction = trend.direction === 'up'
        ? '오르는'
        : trend.direction === 'down'
            ? '내리는'
            : '';
    const trendSentence = direction
        ? `최근 ${selected.length}회 시험은 점수가 ${direction} 추세입니다. 최고 ${trend.bestScore}점, 최저 ${trend.worstScore}점입니다.`
        : `최근 ${selected.length}회 시험은 점수가 큰 변화 없이 유지되고 있습니다. 최고 ${trend.bestScore}점, 최저 ${trend.worstScore}점입니다.`;
    const deltaSentence = reportCenterEasyScoreDeltaText(trend.scoreDelta);
    return `${trendSentence}${deltaSentence ? ` ${deltaSentence}` : ''}`;
}

function reportCenterBuildEasyWeaknessText(trendData, data) {
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) return '';
    const recurring = (trendData?.weaknessTrend || []).filter(item => item.appearedInSessions > 1 && !item.resolved);
    const recurringUnits = Array.from(new Set(recurring.map(item => item.unit).filter(Boolean))).slice(0, 2).join(', ');
    const priorityText = reportCenterEasyWrongNums(data, 3);
    if (recurring.length) {
        const head = recurringUnits
            ? `${recurringUnits} 단원은 최근에도 반복해서 어려워하는 부분입니다.`
            : '여러 차례 반복해서 틀리는 문항이 이어지고 있습니다.';
        return `${head} 반복 오답으로 따로 모아, 다음 수업과 보강에서 개념부터 다시 정리하고 같은 유형 2~3문항까지 이어서 확인하겠습니다.`;
    }
    if (priorityText) {
        return `${priorityText}을 먼저 다시 풀이하고, 같은 유형의 문제로 한 번 더 확인하겠습니다. 틀린 원인을 문항마다 짚어, 다음 시험 전까지 다시 볼 문항 목록으로 관리하겠습니다.`;
    }
    return '틀린 문항은 다음 수업에서 한 번 더 짚고, 필요한 개념은 보강에서 다시 정리해 유사 문항으로 확인하겠습니다.';
}

function reportCenterBuildEasyPlanItems(data, trendData = null) {
    const wrongRows = data?.stats?.wrongRows || [];
    const wrongNums = reportCenterEasyWrongNums(data, 5);
    const unitPhrase = reportCenterWrongUnitPhrase(data, 2);
    if (!wrongRows.length) {
        return [
            '잘 풀던 유형은 유지하면서, 한 단계 높은 난도의 문제로 이어가겠습니다.',
            '자주 실수가 나오는 유형은 미리 점검해 다음 시험까지 안정적으로 준비하겠습니다.'
        ];
    }
    const items = [];
    items.push(wrongNums
        ? `${wrongNums}을 다시 풀이하고, 같은 유형의 문제까지 함께 확인하겠습니다.`
        : '틀린 문항을 다시 풀이하고, 같은 유형의 문제로 한 번 더 연습하겠습니다.');
    items.push(unitPhrase
        ? `${unitPhrase} 단원은 개념부터 다시 정리한 뒤, 응용 문제로 넘어가 마무리까지 잡겠습니다.`
        : '틀린 원인을 문항별로 짚고, 부족한 개념은 다시 정리해 확실히 넘어가겠습니다.');
    items.push('반복해서 틀리는 부분은 따로 모아 관리하고, 다음 시험 전에 다시 점검하겠습니다.');
    return items;
}

function reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo = '') {
    const stats = data?.stats || {};
    const wrongRows = stats.wrongRows || [];
    const lines = [];
    if (!wrongRows.length) {
        const excellentNums = reportCenterShortQuestionList(reportCenterSelectExcellentRows(stats, 3), 3);
        lines.push(excellentNums
            ? `이번 시험은 전 문항을 정확히 풀었습니다. 특히 ${excellentNums}처럼 정답률이 낮았던 문항까지 정확히 해결한 점이 돋보였습니다.`
            : '이번 시험은 전 문항을 정확히 풀었습니다.');
        lines.push('다음 수업에서는 다음 단원과 한 단계 높은 난도의 문제로 학습 범위를 넓혀, 지금의 정확도를 유지하는지 함께 확인하겠습니다.');
    } else {
        const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
        const unitPhrase = reportCenterWrongUnitPhrase(data, 2);
        lines.push(unitPhrase
            ? `이번 오답은 ${unitPhrase} 단원에 주로 나왔습니다. 해당 단원은 다음 수업과 보강에서 다시 풀이하며 개념부터 정리하겠습니다.`
            : '이번에 틀린 문항을 기준으로, 다음 수업과 보강에서 다시 풀이하며 개념부터 정리하겠습니다.');
        if (hardWrongs.length) lines.push('난도가 높았던 문항은 관련 개념을 처음부터 다시 짚어, 비슷한 문제까지 충분히 연습하겠습니다.');
        lines.push('반복해서 틀리는 부분과 이번에 새로 틀린 부분을 나누어, 다음 시험 전까지 다시 풀 문항과 유사 문항으로 점검하겠습니다.');
    }
    if (teacherMemo) lines.push(`담임 메모는 다음 수업에 반영하겠습니다: ${teacherMemo}`);
    return lines;
}

function reportCenterBuildEasyParentMessage(data) {
    const studentName = data?.student?.name || '학생';
    const wrongRows = data?.stats?.wrongRows || [];
    const toneSeed = reportCenterGetAiParentToneSeed(data, wrongRows);
    if (!wrongRows.length) {
        return `안녕하세요, AP수학입니다.\n\n${studentName} 학생은 이번 시험에서 전 문항을 정확히 풀었습니다.\n${toneSeed.positiveAnchor} 다음 수업에서는 다음 단원과 한 단계 높은 난도의 문제로 학습 범위를 넓혀가겠습니다.\n${toneSeed.teacherCareMessage} ${toneSeed.parentReassurance}`;
    }
    return `안녕하세요, AP수학입니다.\n\n이번 리포트에는 점수와 함께 다시 볼 문항, 문항별 난도와 단원을 정리했습니다. ${toneSeed.positiveAnchor}\n틀린 문항은 다음 수업과 보강에서 다시 풀이하고, 필요한 개념은 처음부터 다시 정리해 같은 유형 2~3문항으로 확인하겠습니다.\n${toneSeed.teacherCareMessage} ${toneSeed.parentReassurance}`;
}

function reportCenterBuildEasyKakaoSummary(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const student = data.student;
    const session = data.session;
    if (!student || !session) return '';
    const wrongRows = data.stats?.wrongRows || [];
    const priorityText = reportCenterEasyWrongNums(data, 3);
    if (!wrongRows.length) {
        return `안녕하세요, AP수학입니다. ${student.name} 학생의 「${session.exam_title || '시험'}」 결과를 안내드립니다.\n이번 시험은 ${session.score}점으로 전 문항을 정확히 풀었습니다.\n다음 수업에서는 한 단계 높은 난도의 문제로 이어가겠습니다. 자세한 내용은 PDF 리포트에 정리했습니다.`;
    }
    const target = priorityText
        ? `틀린 문항은 ${priorityText}을 중심으로 다음 수업에서 다시 풀이하고, 유사 유형까지 함께 점검하겠습니다.`
        : '틀린 문항은 다음 수업에서 다시 풀이하고, 유사 유형까지 함께 점검하겠습니다.';
    return `안녕하세요, AP수학입니다. ${student.name} 학생의 「${session.exam_title || '시험'}」 결과를 안내드립니다.\n이번 시험은 ${session.score}점입니다. 자세한 내용은 PDF 리포트에 정리했습니다.\n${target}`;
}

function reportCenterBuildShortReportSummaryItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const rawAiSummary = reportCenterFirstSentence(aiAnalysis?.finalExamComment || aiAnalysis?.summary, 180);
    const rawAiWrong = reportCenterFirstSentence(aiAnalysis?.wrongAnalysis, 180);
    const rawAiPlan = reportCenterFirstSentence(aiAnalysis?.nextPlan, 180);
    const priorityText = reportCenterShortQuestionList(priorityRows, 5);

    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongRows.length) / qCount) * 100) : null;
    const position = reportCenterApplyEasyFinalLanguage(rawAiSummary || reportCenterBuildEasySummaryText(data, wrongRows.length, correctRate));
    const focus = reportCenterApplyEasyFinalLanguage(rawAiWrong || reportCenterBuildEasyWeaknessText(null, data));
    const plan = reportCenterApplyEasyFinalLanguage(rawAiPlan || reportCenterBuildEasyPlanItems(data).join(' '));

    return [
        { title: '현재 위치', text: reportCenterTrimText(position, 170) },
        { title: '우선 확인 문항', text: reportCenterTrimText(focus, 170) },
        { title: '다음 수업 방향', text: reportCenterTrimText(plan, 170) }
    ];
}

function reportCenterSoftenDiagnosisText(value) {
    let text = reportCenterStripHtml(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    text = text
        .replace(/틀렸/g, '다시 볼 부분이 있었')
        .replace(/부족/g, '다시 봐야')
        .replace(/낮은/g, '다시 볼')
        .replace(/못한/g, '아쉬웠던');
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(text), 950);
}

function reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo = '', aiAnalysis = null) {
    const aiDiagnosis = reportCenterSoftenDiagnosisText(aiAnalysis?.trendDiagnosis || aiAnalysis?.diagnosis);
    if (aiDiagnosis) {
        const paragraphs = String(aiDiagnosis)
            .split(/\n{2,}/)
            .map(v => v.trim())
            .filter(Boolean);
        if (paragraphs.length) return paragraphs.slice(0, 2).map(v => reportCenterTrimText(v, 520));

        const sentences = (aiDiagnosis.match(/[^.!?。！？]+[.!?。！？]?/g) || [aiDiagnosis])
            .map(s => s.trim())
            .filter(Boolean);
        if (sentences.length > 3) {
            const mid = Math.ceil(sentences.length / 2);
            return [
                reportCenterTrimText(sentences.slice(0, mid).join(' '), 520),
                reportCenterTrimText(sentences.slice(mid).join(' '), 520)
            ].filter(Boolean);
        }
        return [reportCenterTrimText(aiDiagnosis, 650)];
    }

    return reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo).map(line => reportCenterTrimText(line, 520));
}

function reportCenterBuildNextPlanItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const aiItems = Array.isArray(aiAnalysis?.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
        ? aiAnalysis.longitudinalPlan
        : (Array.isArray(aiAnalysis?.nextActions) ? aiAnalysis.nextActions : []);
    const splitAiPlan = aiAnalysis?.nextPlan
        ? (reportCenterStripHtml(aiAnalysis.nextPlan).match(/[^.!?。！？]+[.!?。！？]?/g) || []).map(s => s.trim()).filter(Boolean)
        : [];
    const items = [...aiItems, ...splitAiPlan]
        .map(item => reportCenterTrimText(item, 180))
        .filter(Boolean);

    if (items.length) return items.map(reportCenterApplyEasyFinalLanguage).slice(0, 4);
    return reportCenterBuildEasyPlanItems(data, null);
}


function reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, aiAnalysis = null) {
    const student = data?.student || {};
    const session = data?.session || {};
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const score = session.score ?? '-';
    const studentName = student.name || '학생';
    const items = [];
    const scoreBits = [`${studentName} 학생은 이번 시험에서 ${score}점을 받았습니다.`];

    if (correctRate !== null && correctRate !== undefined) scoreBits.push(`정답률은 ${correctRate}%입니다.`);
    if (stats.overallAvg !== null && stats.overallAvg !== undefined) scoreBits.push(`전체 평균은 ${stats.overallAvg}점입니다.`);
    if (stats.classAvg !== null && stats.classAvg !== undefined) scoreBits.push(`${stats.className || '소속 반'} 평균은 ${stats.classAvg}점입니다.`);
    items.push(scoreBits.join(' '));

    if (!wrongRows.length) {
        const excellentRows = reportCenterSelectExcellentRows(stats, 3);
        if (excellentRows.length) {
            items.push(`${excellentRows.map(r => `${r.questionNo}번`).join(', ')}처럼 정답률이 낮았던 문항까지 정확히 해결했습니다.`);
        } else {
            items.push('이번 시험은 전 문항을 정확히 풀었습니다.');
        }
        items.push('다음 수업에서는 한 단계 높은 난도의 문제로 이어가겠습니다.');
        return items.map(reportCenterApplyEasyFinalLanguage);
    }

    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const personalWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const priorityText = priorityRows.length ? priorityRows.map(r => `${r.questionNo}번`).join(', ') : '';

    if (wrongRows.length > 5) {
        items.push(`틀린 문항이 여러 개여서, 리포트에는 ${priorityText} 등 먼저 볼 문항 5개를 중심으로 정리했습니다.`);
    } else {
        items.push(priorityText ? `${priorityText}을 먼저 다시 풀이하고, 같은 유형의 문제로 한 번 더 확인하겠습니다.` : '틀린 문항은 다음 수업에서 다시 풀이하겠습니다.');
    }

    if (personalWrongs.length && hardWrongs.length) {
        items.push('실수로 놓친 문항과 난도가 높았던 문항을 나누어 점검하겠습니다.');
    } else if (personalWrongs.length) {
        items.push('대부분 학생이 맞힌 문항은 풀이 과정을 다시 확인하겠습니다.');
    } else if (hardWrongs.length) {
        items.push('난도가 높았던 문항은 풀이 순서와 관련 개념을 다시 짚겠습니다.');
    } else if (unitNames.length) {
        items.push('관련 개념을 다시 정리하고 같은 유형의 문제로 연습하겠습니다.');
    } else {
        items.push('풀이 과정을 다시 점검해 같은 유형에서 실수를 줄이겠습니다.');
    }

    if (aiAnalysis?.summary) {
        items[0] = reportCenterTrimText(aiAnalysis.summary, 150);
    }

    return items.map(reportCenterApplyEasyFinalLanguage);
}

/**
 * Legacy premium preview renderer.
 * PDF 출력/인쇄 경로에서는 사용하지 않는다.
 * PDF 출력은 reportCenterBuildCleanPdfDocument()를 사용한다.
 */
function reportCenterBuildPremiumExamReportHtml(studentId, sessionId = '', options = {}) {
    return reportCenterBuildCleanPdfDocument(studentId, sessionId, options);
}

function reportCenterBuildSingleExamSummaryText(data, wrongCount) {
    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - Number(wrongCount || 0)) / qCount) * 100) : null;
    return reportCenterBuildEasySummaryText(data, wrongCount, correctRate);
}

function reportCenterBuildTrendSummaryText(trendData, aiAnalysis = null) {
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiAnalysis?.trendSummary || reportCenterBuildEasyTrendText(trendData)), 320);
}

function reportCenterBuildWeaknessSummaryText(trendData, data, aiAnalysis = null) {
    const aiText = Array.isArray(aiAnalysis?.recurringWeaknesses) ? aiAnalysis.recurringWeaknesses.join(' ') : '';
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiText || aiAnalysis?.wrongAnalysis || reportCenterBuildEasyWeaknessText(trendData, data)), 320);
}

function reportCenterBuildRemediationText(data, trendData = null, aiAnalysis = null) {
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    const bank = REPORT_COPY_BANK.remediation || {};
    if (!wrongRows.length) return reportCopyFillSlots(bank.noWrong || '', {});
    const labels = reportCenterSelectPriorityWrongRows(wrongRows, 5)
        .map(row => reportCenterBuildParentQuestionInsight(row, null, { mode: 'short' }))
        .filter(Boolean)
        .filter((label, index, arr) => arr.indexOf(label) === index)
        .join(', ');
    return reportCopyFillSlots(bank.withWrong || '', { labels });
}

function reportCenterBuildWrongCareText(data, trendData = null) {
    const bank = REPORT_COPY_BANK.wrongCare || {};
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    if (!wrongRows.length) return reportCopyFillSlots(bank.noWrong || '', {});
    return [bank.line1, bank.line2].filter(Boolean).join('\n');
}

const AP_REPORT_STUDIO_BLOCKS = [
    ['summary', '이번 시험 요약'],
    ['trend', '추이 해석'],
    ['weakness', '다시 볼 부분'],
    ['remediation', '이번 시험 보완 방향'],
    ['wrongCare', 'AP수학 오답관리'],
    ['plan', '다음 수업 복습 계획'],
    ['teacherOpinion', '선생님 종합 의견'],
    ['parentMessage', '학부모님께 드리는 말씀'],
    ['kakaoSummary', '카톡 요약문']
];

function reportCenterCloneStudioValue(value) {
    try {
        return JSON.parse(JSON.stringify(value || null));
    } catch (e) {
        return null;
    }
}

function reportCenterStudioDefaultOptions() {
    return {
        includeScoreTrend: false,
        includeTrendGraph: false,
        includeDistributionGraph: false,
        includeWeaknessTrend: false,
        includeQuestionAnalysis: true,
        includeQuestionReview: true,
        includeQuestionReviewAnswer: false,
        includeRemediation: true,
        includeWrongCare: true,
        includeTeacherOpinion: true,
        includeParentMessage: true,
        includeSignature: true
    };
}

function reportCenterStudioResolveBlockText(block) {
    if (block?.isDirty) return String(block.userText ?? '');
    return String(block?.aiText || block?.autoText || '').trim();
}

function reportCenterStudioBlockIsDirty(studioState, blockKey) {
    return !!studioState?.blocks?.[blockKey]?.isDirty;
}

function reportCenterBuildStudioChartSources(data, trendData) {
    const trendRows = (trendData?.selectedSessions || []).map(row => ({
        id: row.id,
        label: row.title || row.date || '평가',
        date: row.date || '',
        score: row.score,
        classAvg: row.classAvg,
        overallAvg: row.overallAvg,
        visible: true
    }));
    const sameExamRows = reportCenterGetSameExamSessions(data?.session)
        .map((session, index) => ({
            id: session.id || `dist-${index}`,
            label: session.exam_title || `${index + 1}`,
            score: Number.isFinite(Number(session.score)) ? Number(session.score) : null,
            isStudent: String(session.id) === String(data?.session?.id),
            visible: true
        }))
        .filter(row => Number.isFinite(row.score));
    return { trendRows, distributionRows: sameExamRows };
}

function reportCenterBuildReportDraft(studentId, sessionId, context = {}) {
    const autoTexts = context.autoTexts || {};
    const aiAnalysis = context.aiAnalysis || null;
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(context.textOptions || {}) };
    const chartSources = reportCenterBuildStudioChartSources(context.data, context.trendData);
    const aiTexts = {
        summary: aiAnalysis?.finalExamComment || aiAnalysis?.summary || '',
        trend: aiAnalysis?.trendSummary || '',
        weakness: Array.isArray(aiAnalysis?.recurringWeaknesses) && aiAnalysis.recurringWeaknesses.length
            ? aiAnalysis.recurringWeaknesses.join('\n')
            : (aiAnalysis?.wrongAnalysis || ''),
        plan: Array.isArray(aiAnalysis?.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
            ? aiAnalysis.longitudinalPlan.join('\n')
            : (aiAnalysis?.nextPlan || ''),
        teacherOpinion: aiAnalysis?.trendDiagnosis || aiAnalysis?.diagnosis || '',
        parentMessage: aiAnalysis?.parentMessage || '',
        kakaoSummary: aiAnalysis?.kakaoSummary || ''
    };
    const blocks = {};
    AP_REPORT_STUDIO_BLOCKS.forEach(([key, label]) => {
        blocks[key] = {
            label,
            autoText: textOptions.humanize
                ? reportCenterHumanizeKoreanText(autoTexts[key], { ...textOptions, blockKey: key, source: 'auto' })
                : String(autoTexts[key] || ''),
            aiText: textOptions.humanize
                ? reportCenterHumanizeKoreanText(aiTexts[key], { ...textOptions, blockKey: key, source: 'ai' })
                : String(aiTexts[key] || ''),
            userText: '',
            isDirty: false
        };
    });
    return {
        studentId: String(studentId || ''),
        sessionId: String(sessionId || ''),
        mode: aiAnalysis ? 'premium' : 'basic',
        isEditMode: false,
        activeTab: 'text',
        snapshot: null,
        textOptions,
        humanizeWarnings: {},
        blocks,
        charts: {
            trendChart: {
                enabled: false,
                purpose: 'trend',
                type: 'line',
                title: '최근 평가 성적 추이',
                sourceData: reportCenterCloneStudioValue(chartSources.trendRows) || [],
                displayData: reportCenterCloneStudioValue(chartSources.trendRows) || [],
                options: {
                    showStudentScore: true,
                    showClassAverage: true,
                    showTotalAverage: false,
                    showDataLabels: true,
                    yMin: 0,
                    yMax: 100
                },
                isDirty: false
            },
            distributionChart: {
                enabled: false,
                purpose: 'distribution',
                type: 'histogram',
                title: '이번 시험 점수 분포',
                sourceData: reportCenterCloneStudioValue(chartSources.distributionRows) || [],
                displayData: reportCenterCloneStudioValue(chartSources.distributionRows) || [],
                options: {
                    binSize: 10,
                    showStudentMarker: true,
                    showDataLabels: true,
                    yMin: 0,
                    yMax: null
                },
                isDirty: false
            }
        },
        options: reportCenterStudioDefaultOptions()
    };
}

function reportCenterNormalizeStudioState(candidate, fallbackDraft) {
    const base = reportCenterCloneStudioValue(fallbackDraft) || {};
    const source = candidate && typeof candidate === 'object' ? candidate : {};
    const stateDraft = {
        ...base,
        ...source,
        blocks: { ...(base.blocks || {}) },
        charts: { ...(base.charts || {}) },
        textOptions: { ...reportCenterDefaultTextOptions(), ...(base.textOptions || {}), ...(source.textOptions || {}) },
        humanizeWarnings: { ...(base.humanizeWarnings || {}), ...(source.humanizeWarnings || {}) },
        options: { ...reportCenterStudioDefaultOptions(), ...(base.options || {}), ...(source.options || {}) }
    };
    Object.entries(source.blocks || {}).forEach(([key, block]) => {
        if (!stateDraft.blocks[key]) return;
        stateDraft.blocks[key] = { ...stateDraft.blocks[key], ...block };
    });
    Object.entries(source.charts || {}).forEach(([key, chart]) => {
        if (!stateDraft.charts[key]) return;
        stateDraft.charts[key] = {
            ...stateDraft.charts[key],
            ...chart,
            options: { ...(stateDraft.charts[key].options || {}), ...(chart.options || {}) },
            sourceData: Array.isArray(chart.sourceData) ? chart.sourceData : stateDraft.charts[key].sourceData,
            displayData: Array.isArray(chart.displayData) ? chart.displayData : stateDraft.charts[key].displayData
        };
    });
    if (!['text', 'chart', 'layout'].includes(stateDraft.activeTab)) stateDraft.activeTab = 'text';
    return stateDraft;
}

function reportCenterGetActiveStudioState(studentId, sessionId, fallbackDraft = null) {
    const current = window.AP_REPORT_STUDIO_STATE;
    const same = current
        && String(current.studentId || '') === String(studentId || '')
        && String(current.sessionId || '') === String(sessionId || '');
    const normalized = reportCenterNormalizeStudioState(same ? current : null, fallbackDraft || {});
    window.AP_REPORT_STUDIO_STATE = normalized;
    return normalized;
}

function reportCenterGetMatchingStudioState(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (
        studioState
        && String(studioState.studentId || '') === String(studentId || '')
        && String(studioState.sessionId || '') === String(sessionId || '')
    ) {
        return studioState;
    }
    return null;
}

function reportCenterMergeAiAnalysisIntoStudioState(studioState, aiAnalysis) {
    if (!studioState || !aiAnalysis) return studioState;
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    const aiTexts = {
        summary: aiAnalysis.finalExamComment || aiAnalysis.summary || '',
        trend: aiAnalysis.trendSummary || '',
        weakness: Array.isArray(aiAnalysis.recurringWeaknesses) && aiAnalysis.recurringWeaknesses.length
            ? aiAnalysis.recurringWeaknesses.join('\n')
            : (aiAnalysis.wrongAnalysis || ''),
        plan: Array.isArray(aiAnalysis.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
            ? aiAnalysis.longitudinalPlan.join('\n')
            : (aiAnalysis.nextPlan || ''),
        teacherOpinion: aiAnalysis.trendDiagnosis || aiAnalysis.diagnosis || '',
        parentMessage: aiAnalysis.parentMessage || '',
        kakaoSummary: aiAnalysis.kakaoSummary || ''
    };
    Object.entries(aiTexts).forEach(([key, value]) => {
        const block = studioState.blocks?.[key];
        if (!block) return;
        block.aiText = textOptions.humanize
            ? reportCenterHumanizeKoreanText(value, { ...textOptions, blockKey: key, source: 'ai' })
            : String(value || '');
        if (!block.isDirty && !String(block.userText || '').trim()) block.userText = '';
    });
    studioState.mode = 'premium';
    return studioState;
}

function reportCenterApplyStudioBlocks(studioState, texts) {
    const blocks = studioState?.blocks || {};
    Object.keys(texts).forEach(key => {
        if (blocks[key]) texts[key] = reportCenterStudioResolveBlockText(blocks[key]);
    });
    return texts;
}

function reportCenterReportChartRows(chartState) {
    return (chartState?.displayData || []).filter(row => row && row.visible !== false);
}

function reportCenterBuildReportChartHtml(chartState) {
    if (!chartState?.enabled) return '';
    if (chartState.purpose === 'distribution') {
        return chartState.type === 'frequencyPolygon'
            ? reportCenterBuildFrequencyPolygonSvg(chartState)
            : reportCenterBuildHistogramSvg(chartState);
    }
    return chartState.type === 'bar'
        ? reportCenterBuildBarChartSvg(chartState)
        : reportCenterBuildLineChartSvg(chartState);
}

function reportCenterBuildLineChartSvg(chartState) {
    const rows = reportCenterReportChartRows(chartState).map(row => ({
        ...row,
        label: row.label || row.title || row.date || '',
        date: row.date || '',
        title: row.label,
        overallAvg: row.overallAvg,
        classAvg: row.classAvg
    }));
    const options = chartState.options || {};
    const pickSeriesKey = () => {
        const candidates = [
            options.showStudentScore !== false ? 'score' : '',
            options.showClassAverage !== false ? 'classAvg' : '',
            options.showTotalAverage ? 'overallAvg' : ''
        ].filter(Boolean);
        return candidates.find(key => rows.some(row => Number.isFinite(Number(row[key])))) || '';
    };
    const primaryKey = pickSeriesKey();
    if (!primaryKey) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const scores = rows.map(row => Number(row[primaryKey])).filter(Number.isFinite);
    const firstScore = scores.length ? scores[0] : null;
    const latestScore = scores.length ? scores[scores.length - 1] : null;
    const scoreDelta = firstScore !== null && latestScore !== null ? latestScore - firstScore : null;
    const changes = scores.slice(1).map((score, index) => score - scores[index]);
    let direction = 'flat';
    if (changes.length) {
        const hasUp = changes.some(value => value > 0);
        const hasDown = changes.some(value => value < 0);
        direction = hasUp && hasDown ? 'mixed' : hasUp ? 'up' : hasDown ? 'down' : 'flat';
    }
    const trend = { firstScore, latestScore, scoreDelta, direction };
    return reportCenterBuildTrendSvg(trend, rows, options);
}

function reportCenterBuildBarChartSvg(chartState) {
    const rows = reportCenterReportChartRows(chartState);
    const series = [
        chartState.options?.showStudentScore !== false ? { key: 'score', label: '학생', color: '#2563eb' } : null,
        chartState.options?.showClassAverage !== false ? { key: 'classAvg', label: '반 평균', color: '#f59e0b' } : null,
        chartState.options?.showTotalAverage ? { key: 'overallAvg', label: '전체 평균', color: '#94a3b8' } : null
    ].filter(Boolean);
    if (!series.length) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const bars = [];
    rows.forEach((row, rowIndex) => {
        series.forEach((item, seriesIndex) => {
            const value = Number(row[item.key]);
            if (!Number.isFinite(value)) return;
            bars.push({ row, rowIndex, seriesIndex, seriesCount: series.length, value, ...item });
        });
    });
    if (!bars.length) return '<div class="aprc-trend-empty">표시할 그래프 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxValue = Number.isFinite(Number(chartState.options?.yMax)) ? Number(chartState.options.yMax) : 100;
    const minValue = Number.isFinite(Number(chartState.options?.yMin)) ? Number(chartState.options.yMin) : 0;
    const range = Math.max(10, maxValue - minValue);
    const slot = (width - left - 24) / Math.max(1, rows.length);
    const barScaleY = value => top + ((maxValue - Number(value)) / range) * (height - top - bottom);
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '성적 그래프')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            ${bars.map(bar => {
                const groupWidth = slot * 0.68;
                const barWidth = Math.max(8, Math.min(20, groupWidth / Math.max(1, bar.seriesCount)));
                const groupLeft = left + bar.rowIndex * slot + (slot - groupWidth) / 2;
                const x = groupLeft + bar.seriesIndex * barWidth;
                const y = barScaleY(bar.value);
                const h = height - bottom - y;
                const valueLabel = chartState.options?.showDataLabels === false ? '' : `<text x="${(x + barWidth / 2).toFixed(1)}" y="${y - 8}" text-anchor="middle" fill="#1e3a8a" font-size="10" font-weight="800">${reportCenterEscape(bar.value)}</text>`;
                return `<g><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${Math.max(2, h).toFixed(1)}" rx="4" fill="${bar.color}"/>${valueLabel}</g>`;
            }).join('')}
            ${rows.map((row, index) => {
                const x = left + index * slot + slot / 2;
                return `<text x="${x.toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="10">${reportCenterEscape(String(row.label || row.date || index + 1).slice(0, 10))}</text>`;
            }).join('')}
            <g transform="translate(${left},14)">${series.map((item, index) => `<rect x="${index * 78}" y="-8" width="10" height="10" rx="2" fill="${item.color}"/><text x="${index * 78 + 14}" y="1" fill="#64748b" font-size="10" font-weight="700">${reportCenterEscape(item.label)}</text>`).join('')}</g>
        </svg>`;
}

function reportCenterBuildDistributionBuckets(chartState) {
    const rows = reportCenterReportChartRows(chartState).filter(row => Number.isFinite(Number(row.score)));
    const binSize = Math.max(1, Number(chartState.options?.binSize || 10));
    const buckets = [];
    for (let start = 0; start < 100; start += binSize) {
        buckets.push({ label: `${start}-${Math.min(100, start + binSize - 1)}`, mid: start + binSize / 2, count: 0 });
    }
    rows.forEach(row => {
        const score = Math.max(0, Math.min(100, Number(row.score)));
        const index = Math.min(buckets.length - 1, Math.floor(score / binSize));
        buckets[index].count += 1;
    });
    return buckets;
}

function reportCenterBuildHistogramSvg(chartState) {
    const buckets = reportCenterBuildDistributionBuckets(chartState);
    const active = buckets.filter(bucket => bucket.count > 0);
    if (!active.length) return '<div class="aprc-trend-empty">표시할 분포 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxCount = Math.max(1, ...buckets.map(bucket => bucket.count));
    const rawYMin = Number(chartState.options?.yMin);
    const rawYMax = Number(chartState.options?.yMax);
    const axisMin = Number.isFinite(rawYMin) ? rawYMin : 0;
    const axisMax = Number.isFinite(rawYMax) && rawYMax > axisMin ? rawYMax : maxCount;
    const axisRange = Math.max(1, axisMax - axisMin);
    const slot = (width - left - 24) / buckets.length;
    const histogramScaleY = count => top + ((axisMax - Math.max(axisMin, Math.min(axisMax, count))) / axisRange) * (height - top - bottom);
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '점수 분포')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            ${buckets.map((bucket, index) => {
                const x = left + index * slot + 2;
                const y = histogramScaleY(bucket.count);
                const h = height - bottom - y;
                const countLabel = chartState.options?.showDataLabels === false || !bucket.count ? '' : `<text x="${(x + slot / 2).toFixed(1)}" y="${y - 7}" text-anchor="middle" fill="#115e59" font-size="11" font-weight="800">${bucket.count}</text>`;
                return `<g><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(8, slot - 4).toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" fill="#0f766e"/><text x="${(x + slot / 2).toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="9">${reportCenterEscape(bucket.label)}</text>${countLabel}</g>`;
            }).join('')}
        </svg>`;
}

function reportCenterBuildFrequencyPolygonSvg(chartState) {
    const buckets = reportCenterBuildDistributionBuckets(chartState);
    const active = buckets.filter(bucket => bucket.count > 0);
    if (!active.length) return '<div class="aprc-trend-empty">표시할 분포 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxCount = Math.max(1, ...buckets.map(bucket => bucket.count));
    const rawYMin = Number(chartState.options?.yMin);
    const rawYMax = Number(chartState.options?.yMax);
    const axisMin = Number.isFinite(rawYMin) ? rawYMin : 0;
    const axisMax = Number.isFinite(rawYMax) && rawYMax > axisMin ? rawYMax : maxCount;
    const axisRange = Math.max(1, axisMax - axisMin);
    const plotWidth = width - left - 24;
    const polygonScaleX = index => left + (plotWidth * index) / Math.max(1, buckets.length - 1);
    const polygonScaleY = count => top + ((axisMax - Math.max(axisMin, Math.min(axisMax, count))) / axisRange) * (height - top - bottom);
    const points = buckets.map((bucket, index) => `${polygonScaleX(index).toFixed(1)},${polygonScaleY(bucket.count).toFixed(1)}`).join(' ');
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '도수분포다각형')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            <polyline points="${points}" fill="none" stroke="#7c3aed" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            ${buckets.map((bucket, index) => {
                const x = polygonScaleX(index);
                const y = polygonScaleY(bucket.count);
                const countLabel = chartState.options?.showDataLabels === false ? '' : `<text x="${x.toFixed(1)}" y="${y - 9}" text-anchor="middle" fill="#6d28d9" font-size="10" font-weight="800">${bucket.count}</text>`;
                return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff" stroke="#7c3aed" stroke-width="2"/>${countLabel}<text x="${x.toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="9">${reportCenterEscape(bucket.label)}</text></g>`;
            }).join('')}
        </svg>`;
}

function reportCenterBuildTrendSvg(trend, selectedSessions = [], chartOptions = {}) {
    const rows = (selectedSessions || []).filter(row => Number.isFinite(Number(row.score)));
    if (rows.length < 2) return '<div class="aprc-trend-empty">첫 평가 기록입니다.</div>';
    const width = 680;
    const height = 210;
    const left = 46;
    const right = 22;
    const top = 24;
    const bottom = 42;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const includeStudent = chartOptions.showStudentScore !== false;
    const includeClass = chartOptions.showClassAverage !== false;
    const includeOverall = chartOptions.showTotalAverage !== false;
    const hasStudent = includeStudent && rows.some(row => Number.isFinite(row.score));
    const hasOverall = includeOverall && rows.some(row => Number.isFinite(row.overallAvg));
    const hasClass = includeClass && rows.some(row => Number.isFinite(row.classAvg));
    if (!hasStudent && !hasOverall && !hasClass) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const values = rows
        .flatMap(row => [
            includeStudent ? row.score : null,
            includeOverall ? row.overallAvg : null,
            includeClass ? row.classAvg : null
        ])
        .filter(Number.isFinite);
    const minValue = Number.isFinite(Number(chartOptions.yMin))
        ? Number(chartOptions.yMin)
        : Math.max(0, Math.floor((Math.min(...values, 100) - 10) / 10) * 10);
    const maxValue = Number.isFinite(Number(chartOptions.yMax))
        ? Number(chartOptions.yMax)
        : Math.min(100, Math.ceil((Math.max(...values, 0) + 10) / 10) * 10);
    const range = Math.max(10, maxValue - minValue);
    const trendScaleX = index => left + (rows.length === 1 ? plotWidth / 2 : (plotWidth * index) / (rows.length - 1));
    const trendScaleY = value => top + ((maxValue - Number(value)) / range) * plotHeight;
    const buildPoints = key => rows
        .map((row, index) => row[key] !== null && row[key] !== undefined && Number.isFinite(Number(row[key])) ? `${trendScaleX(index).toFixed(1)},${trendScaleY(row[key]).toFixed(1)}` : null);
    const buildSegments = (key, color, dash = '') => {
        const source = buildPoints(key);
        const segments = [];
        let current = [];
        source.forEach(point => {
            if (point) current.push(point);
            else if (current.length) {
                segments.push(current);
                current = [];
            }
        });
        if (current.length) segments.push(current);
        return segments.filter(segment => segment.length > 1).map(segment =>
            `<polyline points="${segment.join(' ')}" fill="none" stroke="${color}" stroke-width="2.2" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`
        ).join('');
    };
    const gridValues = [minValue, Math.round((minValue + maxValue) / 2), maxValue];
    const directionArrow = trend?.direction === 'up' ? '↗ 상승' : trend?.direction === 'down' ? '↘ 하강' : trend?.direction === 'mixed' ? '↕ 등락' : '→ 유지';
    const legendItems = [
        includeStudent ? '<line x1="0" y1="0" x2="20" y2="0" stroke="#2563eb" stroke-width="2.5"/><text x="25" y="3" fill="#64748b" font-size="9">학생</text>' : '',
        hasOverall ? '<line x1="74" y1="0" x2="94" y2="0" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 5"/><text x="99" y="3" fill="#64748b" font-size="9">전체 평균</text>' : '',
        hasClass ? '<line x1="160" y1="0" x2="180" y2="0" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 4"/><text x="185" y="3" fill="#64748b" font-size="9">반 평균</text>' : ''
    ].join('');
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="최근 평가 점수 추이">
            ${gridValues.map(value => `<g><line x1="${left}" y1="${trendScaleY(value)}" x2="${width - right}" y2="${trendScaleY(value)}" stroke="#e2e8f0" stroke-width="1"/><text x="${left - 8}" y="${trendScaleY(value) + 4}" text-anchor="end" fill="#64748b" font-size="12">${value}</text></g>`).join('')}
            ${hasOverall ? buildSegments('overallAvg', '#94a3b8', '7 5') : ''}
            ${hasClass ? buildSegments('classAvg', '#f59e0b', '3 4') : ''}
            ${includeStudent ? buildSegments('score', '#2563eb') : ''}
            ${includeStudent ? rows.map((row, index) => {
                const isLast = index === rows.length - 1;
                const label = chartOptions.showDataLabels === false ? '' : `<text x="${trendScaleX(index)}" y="${trendScaleY(row.score) - 10}" text-anchor="middle" fill="#1e3a8a" font-size="12" font-weight="800">${reportCenterEscape(row.score)}</text>`;
                return `<g><circle cx="${trendScaleX(index)}" cy="${trendScaleY(row.score)}" r="${isLast ? 6 : 4}" fill="${isLast ? '#1d4ed8' : '#ffffff'}" stroke="#2563eb" stroke-width="2.5"/>${label}</g>`;
            }).join('') : ''}
            ${rows.map((row, index) => `<text x="${trendScaleX(index)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="11">${reportCenterEscape(String(row.label || row.date || `${index + 1}회`).slice(0, 10).replace('-', '.'))}</text>`).join('')}
            <text x="${width - right}" y="14" text-anchor="end" fill="${trend?.direction === 'down' ? '#dc2626' : trend?.direction === 'up' ? '#16a34a' : '#475569'}" font-size="12" font-weight="800">${directionArrow}</text>
            <g transform="translate(${left},${height - 2})">${legendItems}</g>
        </svg>`;
}

function reportCenterBuildWeaknessTrendTable(weaknessTrend = []) {
    const rows = weaknessTrend.slice(0, 6);
    if (!rows.length) return '';
    return `
        <table class="aprc-weakness-table">
            <thead><tr><th>단원</th><th>틀린 문항</th><th>나온 회차</th><th>최근 확인</th><th>상태</th></tr></thead>
            <tbody>${rows.map(row => `<tr><td>${reportCenterEscape(row.unit || row.unitKey)}</td><td>${row.wrongCount}회</td><td>${row.appearedInSessions}회</td><td>${reportCenterEscape(row.lastSeenDate || '-')}</td><td><span class="aprc-weakness-status ${row.resolved ? 'is-resolved' : 'is-active'}">${row.resolved ? '정리됨' : '다시 볼 부분'}</span></td></tr>`).join('')}</tbody>
        </table>`;
}

function reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const aiAnalysis = reportCenterGetCachedAiAnalysis(sessionId);
    const trendData = reportCenterGetExamTrendData(studentId, { limit: 5 });
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    const wrongCount = wrongRows.length;
    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const base = reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo);
    const autoTexts = {
        summary: reportCenterBuildSingleExamSummaryText(data, wrongCount),
        trend: reportCenterBuildTrendSummaryText(trendData, aiAnalysis),
        weakness: reportCenterBuildWeaknessSummaryText(trendData, data, aiAnalysis),
        remediation: reportCenterBuildRemediationText(data, trendData, aiAnalysis),
        wrongCare: reportCenterBuildWrongCareText(data, trendData),
        plan: (aiAnalysis ? reportCenterBuildNextPlanItems(data, aiAnalysis) : reportCenterBuildEasyPlanItems(data, trendData)).join('\n'),
        teacherOpinion: reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo, aiAnalysis).slice(0, 2).join('\n\n'),
        parentMessage: base?.parentMessage || '',
        kakaoSummary: reportCenterBuildExamPreview(studentId, sessionId)
    };
    if (correctRate !== null && !autoTexts.summary) autoTexts.summary = `이번 시험 정답률은 ${correctRate}%입니다. 틀린 문항은 다음 수업에서 다시 점검하겠습니다.`;
    const draft = reportCenterBuildReportDraft(studentId, sessionId, { data, trendData, aiAnalysis, autoTexts });
    return reportCenterGetActiveStudioState(studentId, sessionId, draft);
}

function reportCenterImportExamReviewsToStudio(studentId, sessionId) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const archiveFile = data?.session?.archive_file || '';
    if (!archiveFile) {
        toast('연결된 시험지가 없어 불러올 분석이 없습니다.', 'warn');
        return;
    }
    const teacherMemo = reportCenterSyncPrintMemoToCenter();
    const studioState = reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo);
    const store = reportCenterGetExamReviews(archiveFile);
    studioState.examReviews = {
        archiveFile: reportCenterNormalizeExamAnalysisArchiveKey(archiveFile),
        meta: store.meta,
        byQuestion: Object.fromEntries(store.byQuestion.entries())
    };
    studioState.options = {
        ...reportCenterStudioDefaultOptions(),
        ...(studioState.options || {}),
        includeQuestionReview: true
    };
    window.AP_REPORT_STUDIO_STATE = studioState;
    reportCenterRerenderPrintShell(studentId, sessionId);
    toast(store.byQuestion.size ? '저장된 시험지 분석을 불러왔습니다.' : '저장된 문항 분석이 아직 없습니다.', store.byQuestion.size ? 'success' : 'info');
}

function reportCenterRenderStudioToolbar(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    if (!reportCenterAdvancedMode()) {
        return `
            <button class="btn" onclick="reportCenterClosePrintView()">돌아가기</button>
            <button class="btn report-print-action-print" onclick="reportCenterPrintCleanPdf('${safeStudent}', '${safeSession}')">인쇄하기</button>
        `;
    }
    if (studioState?.isEditMode) {
        return `
            <button class="btn btn-primary" onclick="reportCenterCompleteStudioEdit('${safeStudent}', '${safeSession}')">편집 완료</button>
            <button class="btn" onclick="reportCenterCancelStudioEdit('${safeStudent}', '${safeSession}')">취소</button>
            <button class="btn report-print-premium-btn" onclick="reportCenterApplyStudioAiText('${safeStudent}', '${safeSession}')">AI 문구 적용</button>
            <button class="btn" onclick="reportCenterApplyStudioBasicText('${safeStudent}', '${safeSession}')">기본 문구 적용</button>
            <button class="btn" onclick="reportCenterResetStudioChartData('${safeStudent}', '${safeSession}')">실제 데이터 복구</button>
            <button class="btn report-print-action-print" onclick="reportCenterPrintCleanPdf('${safeStudent}', '${safeSession}')">인쇄하기</button>
        `;
    }
    return `
        <button class="btn report-print-premium-btn" onclick="reportCenterRequestPrintViewAiAnalysis('${safeStudent}', '${safeSession}', this)">프리미엄 분석</button>
        <button class="btn btn-primary" onclick="reportCenterEnterStudioEdit('${safeStudent}', '${safeSession}')">편집</button>
        <button class="btn" onclick="reportCenterResetPrintViewAiAnalysis('${safeStudent}', '${safeSession}')">기본 리포트</button>
        <button class="btn" onclick="reportCenterClosePrintView()">돌아가기</button>
        <button class="btn report-print-action-print" onclick="reportCenterPrintCleanPdf('${safeStudent}', '${safeSession}')">인쇄하기</button>
    `;
}

function reportCenterRenderStudioPanel(studentId, sessionId, studioState) {
    if (!reportCenterAdvancedMode()) return '';
    if (!studioState?.isEditMode) return '';
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const activeTab = studioState.activeTab || 'text';
    const tabButton = (tab, label) => `<button type="button" class="${activeTab === tab ? 'is-active' : ''}" onclick="reportCenterSetStudioTab('${safeStudent}', '${safeSession}', '${tab}')">${label}</button>`;
    const body = activeTab === 'chart'
        ? reportCenterRenderStudioChartTab(studentId, sessionId, studioState)
        : activeTab === 'layout'
            ? reportCenterRenderStudioLayoutTab(studentId, sessionId, studioState)
            : reportCenterRenderStudioTextTab(studentId, sessionId, studioState);
    return `
        <aside class="report-studio-panel no-print">
            <div class="report-studio-tabs">
                ${tabButton('text', '문구')}
                ${tabButton('chart', '그래프')}
                ${tabButton('layout', '표/구성')}
            </div>
            <div class="report-studio-body">${body}</div>
        </aside>
    `;
}

function reportCenterRenderStudioTextTab(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    const toneOptions = [
        ['calm_parent', '차분한 학부모용'],
        ['warm_encourage', '따뜻한 격려형'],
        ['analytic', '정확한 분석형'],
        ['kakao_short', '짧은 카톡형']
    ];
    const lengthOptions = [
        ['standard', '표준형'],
        ['detailed', '상세형']
    ];
    const warnings = Object.values(studioState.humanizeWarnings || {}).flat().filter(Boolean);
    const controls = `
        <div class="report-studio-humanize-tools">
            <label class="report-studio-field compact">
                <span>문구 스타일</span>
                <select onchange="reportCenterHandleStudioTextOptionChange('${safeStudent}', '${safeSession}', 'tone', this.value)">
                    ${toneOptions.map(([value, label]) => `<option value="${value}" ${textOptions.tone === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <label class="report-studio-field compact">
                <span>문구 길이</span>
                <select onchange="reportCenterHandleStudioTextOptionChange('${safeStudent}', '${safeSession}', 'length', this.value)">
                    ${lengthOptions.map(([value, label]) => `<option value="${value}" ${textOptions.length === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <div class="report-studio-humanize-actions">
                <button type="button" onclick="reportCenterApplyStudioBasicText('${safeStudent}', '${safeSession}')">기본 문구 다시 적용</button>
                <button type="button" onclick="reportCenterHumanizeStudioBlocks('${safeStudent}', '${safeSession}')">문구 자연스럽게 다듬기</button>
            </div>
            <p>문구 다듬기는 점수·문항번호·단원명은 바꾸지 않고, 표현만 자연스럽게 정리합니다.</p>
            ${warnings.length ? `<div class="report-studio-humanize-warning">${reportCenterEscape(Array.from(new Set(warnings)).slice(0, 3).join(' '))}</div>` : ''}
        </div>
    `;
    const fields = AP_REPORT_STUDIO_BLOCKS.map(([key, label]) => {
        const block = studioState.blocks?.[key] || { label, userText: '', aiText: '', autoText: '' };
        const value = reportCenterStudioResolveBlockText(block);
        return `
            <label class="report-studio-field">
                <span>${reportCenterEscape(block.label || label)}</span>
                <textarea oninput="reportCenterHandleStudioBlockInput('${safeStudent}', '${safeSession}', '${key}', this.value)">${reportCenterEscape(value)}</textarea>
            </label>
        `;
    }).join('');
    return `${controls}${fields}`;
}

function reportCenterRenderStudioLayoutTab(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const options = { ...reportCenterStudioDefaultOptions(), ...(studioState.options || {}) };
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    const isDetailed = textOptions.length === 'detailed';
    // scope 'detailed'인 항목은 상세형에서만 실제로 출력된다(표준형은 1장 서술 중심).
    const rows = [
        ['includeScoreTrend', '성적 추이 분석 포함 (최근 5회 카드·지금 어디쯤 있나요)'],
        ['includeTrendGraph', '└ 성적 추이 그래프 포함', 'trendSub'],
        ['includeDistributionGraph', '점수 분포 그래프 포함'],
        ['includeWeaknessTrend', '계속 틀린 문제 표 포함'],
        ['includeQuestionAnalysis', '문항별 분석표 포함', 'detailed'],
        ['includeQuestionReview', '문항 리뷰 카드 포함', 'detailed'],
        ['includeQuestionReviewAnswer', '└ 문항 리뷰 정답 포함', 'detailed'],
        ['includeRemediation', '이번 시험 보완 방향 포함'],
        ['includeWrongCare', 'AP수학 오답관리 포함'],
        ['includeTeacherOpinion', '선생님 종합 의견 포함'],
        ['includeParentMessage', '학부모님께 드리는 말씀 포함'],
        ['includeSignature', '서명란 포함']
    ];
    const checks = rows.map(([key, label, scope]) => {
        const detailedOnly = scope === 'detailed';
        const trendSub = scope === 'trendSub';
        const disabled = (detailedOnly && !isDetailed) || (trendSub && !options.includeScoreTrend);
        const labelText = detailedOnly ? `${label} <em style="font-style:normal;color:#94a3b8;font-weight:700;">· 상세형 전용</em>` : label;
        return `
        <label class="report-studio-check"${disabled ? ' style="opacity:0.55;"' : ''}>
            <input type="checkbox" ${options[key] ? 'checked' : ''}${disabled ? ' disabled' : ''} onchange="reportCenterHandleStudioOptionChange('${safeStudent}', '${safeSession}', '${key}', this.checked)">
            <span>${labelText}</span>
        </label>
    `;
    }).join('');
    const note = isDetailed
        ? ''
        : `<p style="margin:8px 2px 0;font-size:12px;color:#64748b;font-weight:650;line-height:1.5;">문항별 분석표와 문제별 코멘트는 ‘문구 길이 → 상세형’에서만 출력됩니다. 표준형은 한 장 서술형으로 정리됩니다.</p>`;
    const importButton = `
        <div style="margin-top:12px; padding-top:12px; border-top:1px solid #e5e7eb;">
            <button type="button" class="btn" style="width:100%; min-height:38px; font-size:12px; font-weight:800;" onclick="reportCenterImportExamReviewsToStudio('${safeStudent}', '${safeSession}')">이 시험지 분석 불러오기</button>
        </div>
    `;
    return `${checks}${note}${importButton}`;
}

function reportCenterRenderStudioChartTab(studentId, sessionId, studioState) {
    return [
        reportCenterRenderStudioChartEditor(studentId, sessionId, 'trendChart', studioState.charts?.trendChart || {}),
        reportCenterRenderStudioChartEditor(studentId, sessionId, 'distributionChart', studioState.charts?.distributionChart || {})
    ].join('');
}

function reportCenterRenderStudioChartEditor(studentId, sessionId, chartKey, chartState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const isDistribution = chartState.purpose === 'distribution';
    const typeOptions = isDistribution
        ? [['histogram', '히스토그램'], ['frequencyPolygon', '도수분포다각형']]
        : [['line', '꺾은선 그래프'], ['bar', '막대그래프']];
    const rows = (chartState.displayData || []).map((row, index) => `
        <tr>
            <td><input type="checkbox" ${row.visible !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'visible', this.checked)"></td>
            <td><input value="${reportCenterAttr(row.label || row.title || row.date || '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'label', this.value)"></td>
            <td><input type="number" value="${reportCenterAttr(row.score ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'score', this.value)"></td>
            ${isDistribution ? '' : `<td><input type="number" value="${reportCenterAttr(row.classAvg ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'classAvg', this.value)"></td><td><input type="number" value="${reportCenterAttr(row.overallAvg ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'overallAvg', this.value)"></td>`}
            <td><button type="button" onclick="reportCenterResetStudioChartRow('${safeStudent}', '${safeSession}', '${chartKey}', ${index})">복구</button></td>
        </tr>
    `).join('');
    return `
        <section class="report-studio-chart-box">
            <h3>${isDistribution ? '이번 시험 점수 분포' : '최근 성적 추이'}</h3>
            <label class="report-studio-field compact">
                <span>그래프 종류</span>
                <select onchange="reportCenterHandleStudioChartField('${safeStudent}', '${safeSession}', '${chartKey}', 'type', this.value)">
                    ${typeOptions.map(([value, label]) => `<option value="${value}" ${chartState.type === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <div class="report-studio-chart-options">
                ${isDistribution ? `
                    <label>구간 <input type="number" min="1" max="50" value="${reportCenterAttr(chartState.options?.binSize ?? 10)}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'binSize', this.value)"></label>
                ` : `
                    <label><input type="checkbox" ${chartState.options?.showStudentScore !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showStudentScore', this.checked)"> 학생</label>
                    <label><input type="checkbox" ${chartState.options?.showClassAverage !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showClassAverage', this.checked)"> 반 평균</label>
                    <label><input type="checkbox" ${chartState.options?.showTotalAverage ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showTotalAverage', this.checked)"> 전체 평균</label>
                `}
                <label><input type="checkbox" ${chartState.options?.showDataLabels !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showDataLabels', this.checked)"> 점수 라벨 표시</label>
                <label>Y축 최소값 <input type="number" value="${reportCenterAttr(chartState.options?.yMin ?? '')}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'yMin', this.value)"></label>
                <label>Y축 최대값 <input type="number" value="${reportCenterAttr(chartState.options?.yMax ?? '')}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'yMax', this.value)"></label>
            </div>
            <div class="report-studio-table-wrap">
                <table class="report-studio-data-table">
                    <thead><tr><th>표시</th><th>라벨</th><th>점수</th>${isDistribution ? '' : '<th>반 평균</th><th>전체 평균</th>'}<th>복구</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="6">표시할 데이터가 없습니다.</td></tr>'}</tbody>
                </table>
            </div>
        </section>
    `;
}

function reportCenterRerenderPrintShell(studentId, sessionId) {
    const root = document.getElementById('app-root') || document.body;
    const view = document.getElementById('report-print-view');
    const toolbar = view?.querySelector('.report-print-toolbar');
    const shell = view?.querySelector('.report-studio-shell');
    const panelSlot = view?.querySelector('.report-studio-panel-slot');
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (toolbar) toolbar.innerHTML = reportCenterRenderStudioToolbar(studentId, sessionId, studioState);
    if (shell) shell.classList.toggle('is-editing', !!studioState?.isEditMode);
    if (panelSlot) panelSlot.innerHTML = reportCenterRenderStudioPanel(studentId, sessionId, studioState);
    reportCenterRefreshPrintViewReport(studentId, sessionId);
    if (!view && root) reportCenterOpenPrintView(studentId, sessionId);
}

function reportCenterEnterStudioEdit(studentId, sessionId) {
    const teacherMemo = reportCenterSyncPrintMemoToCenter();
    const studioState = reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo);
    studioState.snapshot = reportCenterCloneStudioValue({ ...studioState, snapshot: null });
    studioState.isEditMode = true;
    studioState.activeTab = studioState.activeTab || 'text';
    window.AP_REPORT_STUDIO_STATE = studioState;
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterCompleteStudioEdit(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState) {
        studioState.isEditMode = false;
        studioState.snapshot = null;
    }
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterCancelStudioEdit(studentId, sessionId) {
    const current = window.AP_REPORT_STUDIO_STATE;
    window.AP_REPORT_STUDIO_STATE = current?.snapshot
        ? reportCenterCloneStudioValue(current.snapshot)
        : reportCenterCreateStudioStateForPrintView(studentId, sessionId, reportCenterGetExamReportTeacherMemo());
    if (window.AP_REPORT_STUDIO_STATE) {
        window.AP_REPORT_STUDIO_STATE.isEditMode = false;
        window.AP_REPORT_STUDIO_STATE.snapshot = null;
    }
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterSetStudioTab(studentId, sessionId, tab) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState && ['text', 'chart', 'layout'].includes(tab)) studioState.activeTab = tab;
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterHandleStudioBlockInput(studentId, sessionId, blockKey, value) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const block = studioState?.blocks?.[blockKey];
    if (!block) return;
    block.userText = String(value || '');
    block.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioOptionChange(studentId, sessionId, key, checked) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    studioState.options = { ...reportCenterStudioDefaultOptions(), ...(studioState.options || {}), [key]: !!checked };
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioTextOptionChange(studentId, sessionId, key, value) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    const current = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    if (key === 'tone' && !['calm_parent', 'warm_encourage', 'analytic', 'kakao_short'].includes(value)) return;
    if (key === 'length' && !['standard', 'detailed'].includes(value)) return;
    studioState.textOptions = { ...current, [key]: value };
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterApplyHumanizedTextToBlock(blockKey, text, options = {}) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const block = studioState?.blocks?.[blockKey];
    if (!block) return '';
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}), ...options, blockKey };
    const polished = reportCenterHumanizeKoreanText(text, textOptions);
    block.userText = polished;
    block.isDirty = true;
    studioState.humanizeWarnings = {
        ...(studioState.humanizeWarnings || {}),
        [blockKey]: reportCenterBuildHumanizeWarnings(polished, textOptions)
    };
    return polished;
}

function reportCenterApplyHumanizedTextToAllBlocks(options = {}) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState?.blocks) return { changed: 0, warnings: [] };
    studioState.snapshot = reportCenterCloneStudioValue({ ...studioState, snapshot: null });
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}), ...options };
    let changed = 0;
    const warnings = [];
    Object.entries(studioState.blocks).forEach(([blockKey, block]) => {
        const currentText = reportCenterStudioResolveBlockText(block);
        const polished = reportCenterHumanizeKoreanText(currentText, { ...textOptions, blockKey, includeDirty: true });
        block.userText = polished;
        block.isDirty = true;
        if (polished !== String(currentText || '').trim()) changed += 1;
        const blockWarnings = reportCenterBuildHumanizeWarnings(polished, { ...textOptions, blockKey });
        if (blockWarnings.length) warnings.push(...blockWarnings);
        studioState.humanizeWarnings = { ...(studioState.humanizeWarnings || {}), [blockKey]: blockWarnings };
    });
    return { changed, warnings };
}

function reportCenterHumanizeStudioBlocks(studentId, sessionId) {
    const result = reportCenterApplyHumanizedTextToAllBlocks({ includeDirty: true });
    reportCenterRerenderPrintShell(studentId, sessionId);
    if (typeof toast === 'function') {
        toast(
            result.changed ? '문구를 자연스럽게 다듬었습니다. 점수와 문항 정보는 변경하지 않았습니다.' : '크게 다듬을 표현이 없습니다.',
            result.changed ? 'success' : 'info'
        );
    }
}

function reportCenterApplyStudioAiText(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    Object.values(studioState.blocks || {}).forEach(block => {
        block.userText = String(block.aiText || '');
        block.isDirty = !!block.userText;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterApplyStudioBasicText(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    Object.values(studioState.blocks || {}).forEach(block => {
        block.userText = String(block.autoText || '');
        block.isDirty = !!block.userText;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterNumberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function reportCenterHandleStudioChartField(studentId, sessionId, chartKey, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart) return;
    chart[key] = value;
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioChartOption(studentId, sessionId, chartKey, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart) return;
    chart.options = { ...(chart.options || {}), [key]: typeof value === 'boolean' ? value : reportCenterNumberOrNull(value) };
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioChartRowChange(studentId, sessionId, chartKey, index, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    const row = chart?.displayData?.[index];
    if (!row) return;
    row[key] = key === 'visible' ? !!value : ['score', 'classAvg', 'overallAvg'].includes(key) ? reportCenterNumberOrNull(value) : String(value || '');
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterResetStudioChartRow(studentId, sessionId, chartKey, index) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart?.sourceData?.[index]) return;
    chart.displayData[index] = reportCenterCloneStudioValue(chart.sourceData[index]);
    chart.isDirty = JSON.stringify(chart.displayData) !== JSON.stringify(chart.sourceData);
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterResetStudioChartData(studentId, sessionId) {
    const charts = window.AP_REPORT_STUDIO_STATE?.charts || {};
    Object.values(charts).forEach(chart => {
        chart.displayData = reportCenterCloneStudioValue(chart.sourceData) || [];
        chart.isDirty = false;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterPrintPremiumExamReport(studentId, sessionId = '') {
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
        toast('팝업 차단을 해제한 뒤 다시 시도하세요.', 'warn');
        return;
    }

    try {
        win.document.open();
        win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AP Math 평가 리포트</title><style>body{margin:0;padding:32px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc;color:#334155;text-align:center;} .box{max-width:420px;margin:12vh auto;padding:24px;border:1px solid #e5e7eb;border-radius:18px;background:#fff;} b{display:block;color:#0f172a;font-size:17px;margin-bottom:8px;}</style></head><body><div class="box"><b>리포트를 생성 중입니다.</b><div>잠시만 기다려 주세요.</div></div></body></html>`);
        win.document.close();
    } catch (e) {
        console.error('[reportCenterPrintPremiumExamReport] pre-open write failed:', e);
    }

    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        try {
            win.document.open();
            win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>AP Math 평가 리포트</title></head><body style="font-family:sans-serif;padding:32px;">출력할 평가 기록이 없습니다.</body></html>`);
            win.document.close();
        } catch (e) {}
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    const html = reportCenterBuildPrintDocument(studentId, sessionId, teacherMemo);

    try {
        win.document.open();
        win.document.write(html);
        win.document.close();
        try { win.focus(); } catch (e) {}
        toast('PDF 출력 창을 열었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterPrintPremiumExamReport] failed:', e);
        toast('PDF 출력 창을 여는 중 오류가 발생했습니다.', 'warn');
        try { win.close(); } catch (closeErr) {}
    }
}

function reportCenterOpenPrintView(studentId, sessionId = '', event = null) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    reportCenterEnsurePremiumReportStyle();
    const studioState = reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo);
    const reportHtml = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState
    });

    const root = document.getElementById('app-root') || document.body;
    [
        '#report-center-wide-overlay',
        '.report-center-wide-overlay',
        '.wide-overlay'
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });

    [
        '#modal-overlay',
        '.modal-overlay',
        '#student-profile-modal',
        '.student-profile-modal',
        '.profile-modal',
        '.modal'
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('show');
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
        });
    });

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    window.AP_REPORT_PRINT_RETURN = {
        studentId,
        sessionId,
        scrollY: window.scrollY || 0
    };

    root.innerHTML = `
        <div id="report-print-view" class="report-print-view">
            <div class="report-print-toolbar no-print">
                ${reportCenterRenderStudioToolbar(studentId, sessionId, studioState)}
            </div>
            <div class="report-studio-shell ${studioState.isEditMode ? 'is-editing' : ''}">
                <div class="report-print-stage">
                    ${reportHtml}
                </div>
                <div class="report-studio-panel-slot">
                    ${reportCenterRenderStudioPanel(studentId, sessionId, studioState)}
                </div>
            </div>
        </div>
    `;
    const printStage = root.querySelector('.report-print-stage');
    if (printStage) {
        printStage.innerHTML = `<div id="report-print-document-root">${reportHtml}</div>`;
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    reportCenterInjectPrintViewStyle();
    reportCenterTypesetMath(document.getElementById('report-print-document-root'));
    window.scrollTo(0, 0);
}

function reportCenterSyncPrintMemoToCenter() {
    const printMemo = document.getElementById('report-print-teacher-memo');
    const memo = printMemo
        ? String(printMemo.value || '').trim()
        : reportCenterGetExamReportTeacherMemo();
    window.AP_REPORT_PENDING_TEACHER_MEMO = memo;
    const centerMemo = document.getElementById('report-center-exam-teacher-memo');
    if (centerMemo) centerMemo.value = memo;
    return memo;
}

function reportCenterRefreshPrintViewReport(studentId, sessionId = '') {
    const root = document.getElementById('report-print-document-root') || document.querySelector('.report-print-stage');
    if (!root) return;
    reportCenterEnsurePremiumReportStyle();
    reportCenterInjectPrintViewStyle();
    const teacherMemo = reportCenterSyncPrintMemoToCenter();
    root.innerHTML = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState: reportCenterGetMatchingStudioState(studentId, sessionId)
    });
    reportCenterTypesetMath(root);
}

function reportCenterHandlePrintViewMemoInput(studentId, sessionId = '') {
    reportCenterSyncPrintMemoToCenter();
    clearTimeout(window.AP_REPORT_PRINT_MEMO_TIMER);
    window.AP_REPORT_PRINT_MEMO_TIMER = setTimeout(() => {
        reportCenterRefreshPrintViewReport(studentId, sessionId);
    }, 180);
}

async function reportCenterRequestPrintViewAiAnalysis(studentId, sessionId, buttonEl = null) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('정리할 평가 기록이 없습니다.', 'warn');
        return;
    }

    reportCenterSyncPrintMemoToCenter();
    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    payload.teacherMemo = reportCenterGetExamReportTeacherMemo();
    payload.generatedFrom = 'AP_MATH_OS_REPORT_CENTER_PRINT_VIEW';

    if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, true, '분석 중');
    else toast('리포트 문장을 정리하는 중입니다.', 'info');

    try {
        const r = await api.post('ai/report-analysis', payload);
        if (!r || r.success === false) {
            throw new Error(r?.message || r?.error || '프리미엄 분석 실패');
        }
        const source = String(r.source || '').toLowerCase();
        const isPremiumSource = source === 'ai' || source === 'gemini';
        if (!isPremiumSource) {
            reportCenterClearCachedAiAnalysis(sessionId);
            reportCenterRefreshPrintViewReport(studentId, sessionId);
            const warning = reportCenterTrimText(r.warning || r.message || r.error || '분석 결과가 기준에 맞지 않았습니다.', 140);
            console.warn('[reportCenterRequestPrintViewAiAnalysis] fallback ignored:', r);
            toast(`분석 결과가 기준에 맞지 않아 기본 리포트를 유지합니다. ${warning}`, 'warn');
            return;
        }
        const analysis = reportCenterNormalizeAiAnalysis(r.analysis || r.data || r);
        analysis.source = 'ai';
        reportCenterSetCachedAiAnalysis(sessionId, analysis);
        if (window.AP_REPORT_STUDIO_STATE) {
            reportCenterMergeAiAnalysisIntoStudioState(window.AP_REPORT_STUDIO_STATE, analysis);
        }
        reportCenterRefreshPrintViewReport(studentId, sessionId);
        toast('리포트 문장이 정리되어 반영되었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterRequestPrintViewAiAnalysis] failed:', e);
        toast('프리미엄 분석에 실패했습니다. 기본 리포트를 유지합니다.', 'warn');
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterResetPrintViewAiAnalysis(studentId, sessionId = '') {
    reportCenterSyncPrintMemoToCenter();
    reportCenterClearCachedAiAnalysis(sessionId);
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState?.blocks) {
        Object.values(studioState.blocks).forEach(block => {
            block.aiText = '';
            if (!block.isDirty) block.userText = '';
        });
        studioState.mode = 'basic';
    }
    reportCenterRefreshPrintViewReport(studentId, sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
}

function reportCenterClosePrintView() {
    const ret = window.AP_REPORT_PRINT_RETURN || {};
    const memo = reportCenterSyncPrintMemoToCenter();

    if (typeof renderDashboard === 'function') {
        renderDashboard();
    } else if (typeof renderApp === 'function') {
        renderApp();
    } else {
        location.reload();
        return;
    }

    setTimeout(() => {
        if (ret.studentId) openReportCenterExam(ret.studentId, ret.sessionId || '');
        setTimeout(() => {
            const centerMemo = document.getElementById('report-center-exam-teacher-memo');
            if (centerMemo) {
                centerMemo.value = memo;
                reportCenterRefreshPremiumExamPreview(ret.studentId, ret.sessionId || '');
            }
            if (Number.isFinite(Number(ret.scrollY))) window.scrollTo(0, Number(ret.scrollY));
        }, 160);
    }, 100);
}

function reportCenterInjectPrintViewStyle() {
    let style = document.getElementById('report-print-view-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'report-print-view-style';
        document.head.appendChild(style);
    }

    style.textContent = `
        .report-print-view {
            position:relative;
            z-index:3000;
            min-height:100vh;
            background:#f1f5f9;
            padding:18px;
            box-sizing:border-box;
        }

        /* 학교시험 상세 출력: 상담/상세 카드 스타일 (인쇄용 — 흑백 안전) */
        .report-print-view .aprc-counsel-report { display:block; padding:0; border:0; background:transparent; }
        .report-print-view .aprc-counsel-head { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; margin:0 0 14px; padding-bottom:10px; border-bottom:1.5px solid #0f172a; }
        .report-print-view .aprc-counsel-head h3 { margin:4px 0 0; font-size:17px; font-weight:900; color:#0f172a; line-height:1.35; }
        .report-print-view .aprc-counsel-kicker { font-size:11px; font-weight:800; color:#64748b; }
        .report-print-view .aprc-counsel-head button { display:none; }
        .report-print-view .aprc-counsel-section { margin:0 0 14px; break-inside:avoid; page-break-inside:avoid; }
        .report-print-view .aprc-counsel-section p { margin:0; font-size:12.5px; font-weight:600; color:#111827; line-height:1.75; word-break:keep-all; }
        .report-print-view .aprc-counsel-title { margin-bottom:5px; font-size:11.5px; font-weight:900; color:#475569; }

        .report-print-toolbar {
            position:sticky;
            top:0;
            z-index:20;
            display:flex;
            flex-wrap:wrap;
            gap:8px;
            justify-content:space-between;
            align-items:center;
            max-width:190mm;
            margin:0 auto 14px;
            padding:10px;
            background:rgba(255,255,255,0.94);
            border:1px solid var(--border);
            border-radius:14px;
            backdrop-filter:blur(8px);
            -webkit-backdrop-filter:blur(8px);
        }

        .report-print-toolbar .btn {
            min-height:42px;
            font-size:13px;
            font-weight:700;
            border-radius:12px;
            flex:0 0 auto;
            min-width:104px;
        }

        .report-print-toolbar .report-print-action-print {
            margin-left:auto;
        }

        .report-print-toolbar .report-print-premium-btn {
            background:linear-gradient(135deg,#6d28d9,#2563eb);
            color:#fff;
            border-color:transparent;
            box-shadow:0 10px 22px rgba(37,99,235,.22);
        }

        .report-print-toolbar .report-print-premium-btn:hover {
            filter:brightness(1.03);
        }

        .report-print-control-panel {
            max-width:190mm;
            margin:0 auto 14px;
            padding:12px;
            background:#ffffff;
            border:1px solid var(--border);
            border-radius:14px;
            box-sizing:border-box;
        }

        .report-print-control-panel label {
            display:block;
            margin-bottom:7px;
            color:#334155;
            font-size:12px;
            font-weight:800;
        }

        .report-print-control-panel textarea {
            width:100%;
            min-height:76px;
            padding:12px;
            border:1px solid var(--border);
            border-radius:12px;
            background:var(--surface);
            color:var(--text);
            box-sizing:border-box;
            resize:vertical;
            font:inherit;
            font-size:13px;
            line-height:1.55;
        }

        .report-print-stage {
            width:100%;
            overflow-x:auto;
            -webkit-overflow-scrolling:touch;
            padding-bottom:24px;
        }

        .report-center-school-exam-print-view {
            background:#eef2f7;
            min-height:100vh;
        }

        .report-center-school-exam-print-view .report-print-toolbar {
            position:sticky;
            top:0;
            z-index:20;
        }

        .report-center-school-exam-print-view .report-print-stage {
            max-width:210mm;
            margin:0 auto;
            padding:16mm 0;
            overflow:visible;
        }

        .aprc-school-detail-document {
            width:186mm;
            margin:0 auto;
            background:#fff;
            color:#111827;
            padding:14mm;
            box-sizing:border-box;
        }

        .aprc-school-detail-head {
            position:relative;
            display:block;
            padding-bottom:6mm;
            margin-bottom:8mm;
            border-bottom:2px solid #111827;
            break-inside:avoid;
            page-break-inside:avoid;
        }

        .aprc-school-detail-head .aprc-school-detail-brand,
        .aprc-school-detail-head .aprc-brand {
            font-size:11px;
            line-height:1.2;
            font-weight:900;
            color:#1d4ed8;
            letter-spacing:0;
        }

        .aprc-school-detail-head h1,
        .aprc-school-detail-head .aprc-title {
            margin:2mm 0 1.5mm;
            font-size:22px;
            line-height:1.25;
            font-weight:900;
            color:#111827;
        }

        .aprc-school-detail-head p,
        .aprc-school-detail-head .aprc-subtitle {
            margin:0;
            line-height:1.5;
            color:#475569;
            font-weight:700;
        }

        .aprc-school-detail-premium-badge {
            padding:2px 8px;
            border-radius:999px;
            background:rgba(26,92,255,0.1);
            color:var(--primary);
            font-size:11px;
            font-weight:900;
        }

        .aprc-parent-question-card {
            border:1px solid #dbeafe;
            border-radius:14px;
            padding:14px;
            background:#fff;
            break-inside:avoid;
            page-break-inside:avoid;
        }

        .aprc-parent-question-card + .aprc-parent-question-card {
            margin-top:10px;
        }

        .aprc-parent-question-head {
            display:flex;
            justify-content:space-between;
            gap:12px;
            align-items:flex-start;
            padding-bottom:10px;
            border-bottom:1px solid #e5e7eb;
        }

        .aprc-parent-question-no {
            font-size:15px;
            font-weight:900;
            color:#111827;
        }

        .aprc-parent-question-meta {
            margin-top:4px;
            font-size:12px;
            font-weight:800;
            color:#64748b;
            line-height:1.5;
        }

        .aprc-parent-question-badge {
            border-radius:999px;
            padding:4px 9px;
            font-size:11px;
            font-weight:900;
            background:#eff6ff;
            color:#1d4ed8;
            white-space:nowrap;
        }

        .aprc-parent-question-card section {
            margin-top:12px;
        }

        .aprc-parent-question-label {
            margin-bottom:5px;
            font-size:12px;
            font-weight:900;
            color:#1d4ed8;
        }

        .aprc-parent-question-card p {
            margin:0;
            line-height:1.65;
            font-size:13px;
            color:#111827;
        }

        .aprc-parent-question-content,
        .aprc-parent-question-choices,
        .aprc-parent-question-answer {
            margin:0;
            line-height:1.65;
            font-size:12.5px;
            color:#111827;
        }

        .aprc-parent-question-choices {
            padding-left:18px;
        }

        .report-studio-shell {
            display:block;
            max-width:100%;
        }

        .report-studio-shell.is-editing {
            display:grid;
            grid-template-columns:minmax(0,1fr) minmax(320px,380px);
            gap:14px;
            align-items:start;
        }

        .report-studio-shell.is-editing .report-print-stage .aprc-pdf-document {
            margin:0 0 0 auto;
        }

        .report-studio-panel-slot {
            min-width:0;
        }

        .report-studio-panel {
            position:sticky;
            top:76px;
            max-height:calc(100vh - 92px);
            overflow:auto;
            padding:12px;
            border:1px solid #cbd5e1;
            border-radius:8px;
            background:#ffffff;
            box-shadow:0 16px 38px rgba(15,23,42,.14);
        }

        .report-studio-tabs {
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:6px;
            margin-bottom:12px;
        }

        .report-studio-tabs button,
        .report-studio-data-table button {
            min-height:34px;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#f8fafc;
            color:#334155;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .report-studio-tabs button.is-active {
            background:#0f766e;
            border-color:#0f766e;
            color:#ffffff;
        }

        .report-studio-field {
            display:block;
            margin-bottom:12px;
        }

        .report-studio-humanize-tools {
            margin-bottom:14px;
            padding:10px;
            border:1px solid #e2e8f0;
            border-radius:8px;
            background:#f8fafc;
        }

        .report-studio-humanize-actions {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:6px;
            margin:8px 0;
        }

        .report-studio-humanize-actions button {
            min-height:34px;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#ffffff;
            color:#0f172a;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .report-studio-humanize-tools p,
        .report-studio-humanize-warning {
            margin:6px 0 0;
            color:#64748b;
            font-size:11px;
            font-weight:700;
            line-height:1.45;
        }

        .report-studio-humanize-warning {
            color:#b45309;
        }

        .report-studio-field.compact {
            margin-bottom:8px;
        }

        .report-studio-field > span {
            display:block;
            margin-bottom:6px;
            color:#0f172a;
            font-size:12px;
            font-weight:850;
        }

        .report-studio-field textarea,
        .report-studio-field select,
        .report-studio-data-table input,
        .report-studio-chart-options input {
            width:100%;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#ffffff;
            color:#0f172a;
            box-sizing:border-box;
            font:inherit;
            font-size:12px;
        }

        .report-studio-field textarea {
            min-height:86px;
            padding:9px;
            resize:vertical;
            line-height:1.5;
        }

        .report-studio-field select {
            min-height:36px;
            padding:0 8px;
        }

        .report-studio-check {
            display:flex;
            align-items:center;
            gap:8px;
            min-height:38px;
            border-bottom:1px solid #e2e8f0;
            color:#334155;
            font-size:13px;
            font-weight:750;
        }

        .report-studio-check input {
            width:16px;
            height:16px;
        }

        .report-studio-chart-box {
            margin-bottom:14px;
            padding-bottom:14px;
            border-bottom:1px solid #e2e8f0;
        }

        .report-studio-chart-box h3 {
            margin:0 0 10px;
            color:#0f172a;
            font-size:14px;
            font-weight:900;
        }

        .report-studio-chart-options {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:7px;
            margin:8px 0 10px;
            color:#334155;
            font-size:12px;
            font-weight:750;
        }

        .report-studio-chart-options label {
            display:flex;
            align-items:center;
            gap:6px;
        }

        .report-studio-chart-options input[type="checkbox"] {
            width:15px;
            height:15px;
        }

        .report-studio-table-wrap {
            overflow:auto;
            border:1px solid #e2e8f0;
            border-radius:8px;
        }

        .report-studio-data-table {
            width:100%;
            min-width:520px;
            border-collapse:collapse;
            table-layout:fixed;
            font-size:11px;
        }

        .report-studio-data-table th,
        .report-studio-data-table td {
            padding:5px;
            border-bottom:1px solid #e2e8f0;
            text-align:left;
            vertical-align:middle;
        }

        .report-studio-data-table th {
            background:#f8fafc;
            color:#475569;
            font-weight:850;
        }

        .report-studio-data-table input {
            min-height:30px;
            padding:0 6px;
        }

        .report-print-stage .aprc-pdf-document {
            width:190mm;
            min-width:190mm;
            max-width:190mm;
            margin:0 auto;
            background:#fff;
            padding:8mm 9mm;
            box-sizing:border-box;
        }

        .report-center-batch-page {
            display:block;
            break-after:page;
            page-break-after:always;
            margin-bottom:18px;
        }

        .report-center-batch-page:last-child {
            break-after:auto;
            page-break-after:auto;
            margin-bottom:0;
        }

        .report-print-stage .aprc-pdf-header {
            display:grid;
            grid-template-columns:minmax(0,1fr) 40mm;
            align-items:start;
            column-gap:10mm;
            padding:10mm 0 8mm;
        }

        .report-print-stage .aprc-pdf-header > div:first-child {
            min-width:0;
            padding-right:0;
        }

        .report-print-stage .aprc-pdf-header .aprc-title {
            line-height:1.25;
        }

        .report-print-stage .aprc-pdf-header .aprc-subtitle {
            line-height:1.45;
        }

        .report-print-stage .aprc-pdf-header .aprc-signature-boxes {
            padding-top:0;
            min-width:40mm;
            width:40mm;
            grid-template-rows:6mm 20mm;
            justify-self:end;
        }

        .report-print-stage .aprc-pdf-header .aprc-signature-cells > div {
            height:20mm;
        }

        .report-print-stage .aprc-pdf-student-band {
            display:grid;
            grid-template-columns:minmax(0,1fr) minmax(38mm,72mm);
            align-items:center;
            column-gap:8mm;
            margin-top:8mm;
            padding-top:5mm;
        }

        .report-print-stage .aprc-pdf-student-band > div:first-child {
            min-width:0;
        }

        .report-print-stage .aprc-exam-meta {
            text-align:right;
            max-width:none;
            word-break:keep-all;
            overflow-wrap:break-word;
        }

        @media (max-width:840px) {
            .report-print-view { padding:10px; }
            .report-print-toolbar { margin-bottom:10px; }
            .report-studio-shell.is-editing { display:block; }
            .report-studio-panel { position:relative; top:auto; max-height:none; margin-top:12px; }
        }

        @media print {
            .no-print,
            .report-print-toolbar,
            .app-header,
            .mobile-header,
            .topbar,
            #report-center-wide-overlay {
                display:none !important;
            }

            html,
            body {
                background:#fff !important;
                margin:0 !important;
                padding:0 !important;
                overflow:visible !important;
            }

            .report-print-view {
                padding:0 !important;
                background:#fff !important;
            }

            .report-print-stage {
                overflow:visible !important;
                background:#fff !important;
                padding:0 !important;
            }

            .report-center-school-exam-print-view,
            .report-center-school-exam-print-view .report-print-stage {
                background:#fff !important;
                padding:0 !important;
                margin:0 !important;
            }

            .report-print-stage .aprc-pdf-document {
                width:100% !important;
                max-width:186mm !important;
                margin:0 auto !important;
                padding:0 !important;
            }

            .aprc-school-detail-document {
                width:100% !important;
                max-width:186mm !important;
                padding:0 !important;
                margin:0 auto !important;
            }

            .aprc-school-detail-head,
            .aprc-counsel-section,
            .aprc-qreview-card,
            .aprc-parent-question-card {
                break-inside:avoid !important;
                page-break-inside:avoid !important;
            }

            .report-center-batch-page {
                margin-bottom:0 !important;
            }

            @page {
                size:A4;
                margin:12mm;
            }
        }
    `;
}

function reportCenterCopyExamKakaoSummary(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('복사할 평가 기록이 없습니다.', 'warn');
        return;
    }
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const matchingStudioState = studioState
        && String(studioState.studentId || '') === String(studentId || '')
        && String(studioState.sessionId || '') === String(sessionId || '')
        ? studioState
        : null;
    const kakaoBlock = matchingStudioState?.blocks?.kakaoSummary;
    let text;
    let usesStudioKakao = false;
    if (kakaoBlock?.isDirty) {
        text = String(kakaoBlock.userText ?? '');
        usesStudioKakao = true;
    } else {
        const studioKakao = reportCenterStudioResolveBlockText(kakaoBlock);
        if (studioKakao) {
            text = studioKakao;
            usesStudioKakao = true;
        }
    }
    const aiAnalysis = reportCenterGetAiAnalysisForReport(sessionId);
    if (text === undefined) text = aiAnalysis?.kakaoSummary || reportCenterBuildExamPreview(studentId, sessionId);
    if (!String(text || '').trim()) {
        toast('복사할 카톡 문구가 없습니다.', 'warn');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        toast(usesStudioKakao || aiAnalysis?.kakaoSummary ? '정리된 카톡 요약문이 복사되었습니다.' : '카톡 요약문이 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function reportCenterRefreshPremiumExamPreview(studentId, sessionId = '') {
    const root = document.getElementById('report-center-premium-preview');
    if (!root) return;

    reportCenterEnsurePremiumReportStyle();

    root.innerHTML = reportCenterBuildPremiumExamReportHtml(studentId, sessionId, { teacherMemo: reportCenterGetExamReportTeacherMemo(), aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId) });
}

function openReportCenterExam(studentId, selectedSessionId = '') {
    window.AP_REPORT_CENTER_RENDER_TOKEN = (window.AP_REPORT_CENTER_RENDER_TOKEN || 0) + 1;
    const renderToken = window.AP_REPORT_CENTER_RENDER_TOKEN;
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    if (!student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const sessions = reportCenterGetLegacyExamReportSessions(studentId)
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));

    const selected = selectedSessionId
        ? sessions.find(e => String(e.id) === String(selectedSessionId))
        : sessions[0];

    const data = selected ? reportCenterGetExamReportData(studentId, selected.id) : null;
    const stats = data?.stats || null;
    const wrongSummary = selected ? reportCenterBuildWrongSummary(selected) : [];
    const archiveStatusHtml = selected ? reportCenterBuildArchiveStatusHtml(selected) : '';
    const wrongRows = stats && stats.wrongRows.length
        ? stats.wrongRows.map(w => `
            <tr>
                <td style="padding:8px; border-bottom:1px solid var(--border); font-weight:700; white-space:nowrap;">${reportCenterEscape(w.questionNo)}번</td>
                <td style="padding:8px; border-bottom:1px solid var(--border);">${reportCenterEscape(w.unit || '-')}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border); white-space:nowrap;">${Number.isFinite(w.correctRate) ? `${w.correctRate}%` : '-'}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border); white-space:nowrap;">${Number.isFinite(w.classCorrectRate) ? `${w.classCorrectRate}%` : '-'}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border);">${reportCenterEscape(w.meaning || '-')}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" style="padding:14px; text-align:center; color:var(--secondary); font-weight:700;">오답 문항이 없거나 비교 자료가 없습니다.</td></tr>`;

    const selectedId = selected?.id || '';

    const body = sessions.length ? `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <select class="btn" style="width:100%; min-height:46px; text-align:left; background:var(--surface); border:1px solid var(--border); font-weight:700;" onchange="event.stopPropagation(); openReportCenterExam('${escapeReportJsString(studentId)}', this.value)">
                ${sessions.map(e => `<option value="${reportCenterAttr(e.id)}" ${String(e.id) === String(selected?.id) ? 'selected' : ''}>${reportCenterEscape(e.exam_date || '-')} · ${reportCenterEscape(e.exam_title || '평가')} · ${reportCenterEscape(e.score)}점</option>`).join('')}
            </select>

            <div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">점수</div><div style="font-size:15px; font-weight:700; color:var(--primary); margin-top:2px;">${reportCenterEscape(selected?.score ?? '-')}점</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">전체 평균</div><div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${stats?.overallAvg === null ? '-' : `${stats?.overallAvg}점`}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">제출</div><div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${stats?.totalSessions || 0}명</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">오답</div><div style="font-size:15px; font-weight:700; color:var(--error); margin-top:2px;">${wrongSummary.length}개</div></div>
            </div>

            <div style="padding:13px 14px; border:1px solid rgba(26,92,255,0.16); border-radius:14px; background:rgba(26,92,255,0.06); color:var(--primary); font-size:12px; font-weight:700; line-height:1.55;">
                출력용 리포트는 A4 자연 흐름형 PDF로 저장/인쇄합니다. 브라우저가 페이지를 나누되, 표와 주요 안내 문구가 중간에서 잘리지 않도록 구성됩니다.
            </div>

            ${archiveStatusHtml}

            <div style="border:1px solid var(--border); border-radius:14px; overflow:auto; background:var(--surface);">
                <table style="width:100%; min-width:620px; border-collapse:collapse; font-size:12px;">
                    <thead style="background:var(--surface-2); color:var(--secondary);">
                        <tr><th style="padding:8px; text-align:left;">오답</th><th style="padding:8px; text-align:left;">단원</th><th style="padding:8px; text-align:left;">전체 정답률</th><th style="padding:8px; text-align:left;">반 정답률</th><th style="padding:8px; text-align:left;">해석</th></tr>
                    </thead>
                    <tbody>${wrongRows}</tbody>
                </table>
            </div>

            <textarea id="report-center-exam-teacher-memo" class="btn" placeholder="선생님 추가 메모: 수업 태도, 시험 당시 특이사항, 가정 전달 포인트" style="width:100%; min-height:74px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:13px; font-size:13px; line-height:1.6; resize:vertical; font-family:inherit;" oninput="reportCenterRefreshPremiumExamPreview('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}')"></textarea>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button type="button" class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterOpenPrintView('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}', event)">리포트보기/프리미엄분석</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="reportCenterCopyExamKakaoSummary('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}')">카톡 요약 복사</button>
            </div>
        </div>
    ` : `
        <div style="padding:34px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px;">
            평가 기록이 없습니다.
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'exam', body));
    if (selected) {
        setTimeout(() => {
            if (window.AP_REPORT_CENTER_RENDER_TOKEN !== renderToken) return;
            reportCenterLoadArchiveQuestionDetails(studentId, selected.id, { silent: true }).then(() => {
                if (window.AP_REPORT_CENTER_RENDER_TOKEN !== renderToken) return;
                reportCenterRefreshPremiumExamPreview(studentId, selected.id);
            }).catch(() => {});
        }, 80);
    }
}


async function reportCenterRequestExamAiAnalysis(studentId, sessionId, buttonEl = null) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('정리할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    payload.teacherMemo = reportCenterGetExamReportTeacherMemo();
    payload.generatedFrom = 'AP_MATH_OS_REPORT_CENTER_4D5';

    if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, true, '분석 중');
    else toast('리포트 문장을 정리하는 중입니다.', 'info');

    try {
        const r = await api.post('ai/report-analysis', payload);
        if (!r || r.success === false) {
            throw new Error(r?.message || r?.error || '프리미엄 분석 실패');
        }
        const source = String(r.source || '').toLowerCase();
        const isPremiumSource = source === 'ai' || source === 'gemini';
        if (!isPremiumSource) {
            reportCenterClearCachedAiAnalysis(sessionId);
            reportCenterRefreshPremiumExamPreview(studentId, sessionId);
            const warning = reportCenterTrimText(r.warning || r.message || r.error || '분석 결과가 기준에 맞지 않았습니다.', 140);
            console.warn('[reportCenterRequestExamAiAnalysis] fallback ignored:', r);
            toast(`분석 결과가 기준에 맞지 않아 기본 리포트를 유지합니다. ${warning}`, 'warn');
            return;
        }
        const analysis = reportCenterNormalizeAiAnalysis(r.analysis || r.data || r);
        analysis.source = 'ai';
        reportCenterSetCachedAiAnalysis(sessionId, analysis);
        reportCenterRefreshPremiumExamPreview(studentId, sessionId);
        toast('리포트 문장이 정리되어 반영되었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterRequestExamAiAnalysis] failed:', e);
        toast('프리미엄 분석에 실패했습니다. 기본 리포트를 유지합니다.', 'warn');
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterCopyExamAiPayload(studentId, sessionId) {
    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    const memo = document.getElementById('report-center-exam-teacher-memo')?.value || '';
    payload.teacherMemo = memo;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
        toast('분석 자료가 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function openReportCenterCounsel(studentId) {
    const ctx = buildReportContext(studentId);
    if (!ctx.student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const text = reportCenterBuildCounselPreview(studentId);
    const consultations = reportCenterGetRecentConsultations(studentId, 5);
    const consultHtml = consultations.length
        ? consultations.map(c => `
            <div style="padding:10px 0; border-bottom:1px solid var(--border);">
                <div style="font-size:12px; font-weight:700; color:var(--secondary);">${reportCenterEscape(c.date || '-')} · ${reportCenterEscape(c.type || '상담')}</div>
                <div style="font-size:13px; font-weight:700; color:var(--text); line-height:1.5; margin-top:4px;">${reportCenterEscape(c.content || '')}</div>
            </div>
        `).join('')
        : `<div style="padding:18px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">최근 상담 기록이 없습니다.</div>`;

    const body = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">출결</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.attendance)}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">숙제</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.homework)}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">최근평균</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${ctx.avg === null ? '-' : `${ctx.avg}점`}</div></div>
            </div>
            <div style="padding:12px 14px; border-radius:14px; background:var(--surface); border:1px solid var(--border); max-height:170px; overflow-y:auto;">
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-bottom:4px;">최근 상담 기록</div>
                ${consultHtml}
            </div>
            <textarea id="report-center-counsel-text" class="btn" style="width:100%; min-height:320px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterCopyText('report-center-counsel-text')">상담 요약 복사</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportCenterPrintText('report-center-counsel-text', 'AP Math 상담 리포트')">출력</button>
            </div>
            <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="copyReport('${escapeReportJsString(studentId)}', 'counsel')">기존 상담용 문구 열기</button>
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'counsel', body));
}


// ─────────────────────────────────────────
// [학부모 리포트 카드 v1]
// ─────────────────────────────────────────

function reportCenterGetExamTrendData(studentId, options = {}) {
    const parsedLimit = Number(options?.limit);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : 5;
    const recentSessions = reportCenterGetSortedStudentExamSessions(studentId).slice(0, limit);
    const selectedSessions = recentSessions.slice().reverse().map(session => {
        const stats = reportCenterBuildQuestionStats(session);
        const questionCount = Number(session.question_count || 0);
        const wrongCount = reportCenterGetWrongIds(session.id).length;
        return {
            id: session.id,
            date: session.exam_date || '',
            title: session.exam_title || '평가',
            score: Number.isFinite(Number(session.score)) ? Number(session.score) : null,
            questionCount,
            wrongCount,
            correctRate: questionCount ? Math.round(((questionCount - wrongCount) / questionCount) * 100) : null,
            overallAvg: stats.overallAvg !== null && stats.overallAvg !== undefined && Number.isFinite(Number(stats.overallAvg)) ? Number(stats.overallAvg) : null,
            classAvg: stats.classAvg !== null && stats.classAvg !== undefined && Number.isFinite(Number(stats.classAvg)) ? Number(stats.classAvg) : null
        };
    });
    const scores = selectedSessions.map(row => row.score).filter(Number.isFinite);
    const firstScore = scores.length ? scores[0] : null;
    const latestScore = scores.length ? scores[scores.length - 1] : null;
    const scoreDelta = firstScore !== null && latestScore !== null ? latestScore - firstScore : null;
    const changes = scores.slice(1).map((score, index) => score - scores[index]);
    let direction = 'flat';
    if (changes.length) {
        const hasUp = changes.some(value => value > 0);
        const hasDown = changes.some(value => value < 0);
        direction = hasUp && hasDown ? 'mixed' : hasUp ? 'up' : hasDown ? 'down' : 'flat';
    }

    const latestSessionId = selectedSessions[selectedSessions.length - 1]?.id;
    const latestWrongUnits = new Set();
    const weaknessMap = new Map();
    selectedSessions.forEach(row => {
        const seenInSession = new Set();
        const rawSession = recentSessions.find(session => String(session.id) === String(row.id)) || { id: row.id };
        reportCenterBuildWrongSummary(rawSession).forEach(item => {
            const unitKey = String(item.unitKey || item.unit || '').trim();
            if (!unitKey) return;
            const unit = String(item.unit || item.unitKey || '').trim();
            const mapItem = weaknessMap.get(unitKey) || {
                unitKey,
                unit,
                wrongCount: 0,
                appearedInSessions: 0,
                lastSeenDate: '',
                resolved: false
            };
            mapItem.wrongCount += 1;
            if (!seenInSession.has(unitKey)) {
                mapItem.appearedInSessions += 1;
                seenInSession.add(unitKey);
            }
            if (String(row.date || '') >= String(mapItem.lastSeenDate || '')) mapItem.lastSeenDate = row.date || '';
            weaknessMap.set(unitKey, mapItem);
            if (String(row.id) === String(latestSessionId)) latestWrongUnits.add(unitKey);
        });
    });
    const weaknessTrend = Array.from(weaknessMap.values())
        .map(item => ({ ...item, resolved: !latestWrongUnits.has(item.unitKey) }))
        .sort((a, b) => b.appearedInSessions - a.appearedInSessions || b.wrongCount - a.wrongCount || String(b.lastSeenDate).localeCompare(String(a.lastSeenDate)));

    const finalSession = selectedSessions[selectedSessions.length - 1] || null;
    const averageScore = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null;
    const recentAverage = scores.length
        ? Math.round(scores.slice(-Math.min(3, scores.length)).reduce((sum, value) => sum + value, 0) / Math.min(3, scores.length))
        : null;
    const trendComment = selectedSessions.length < 2
        ? (selectedSessions.length === 1 ? '첫 평가 기록입니다.' : '평가 추이를 계산할 기록이 없습니다.')
        : direction === 'up'
            ? `첫 평가보다 최근 평가가 ${Math.abs(scoreDelta)}점 상승했습니다.`
            : direction === 'down'
                ? `첫 평가보다 최근 평가가 ${Math.abs(scoreDelta)}점 하락했습니다.`
                : direction === 'mixed'
                    ? `최근 ${selectedSessions.length}회 점수가 오르내리는 혼합 흐름입니다.`
                    : `최근 ${selectedSessions.length}회 점수가 같은 수준을 유지하고 있습니다.`;
    let scorePosition = '동일 평가 비교 자료가 부족합니다.';
    if (finalSession && Number.isFinite(finalSession.score)) {
        if (Number.isFinite(finalSession.overallAvg)) {
            const diff = finalSession.score - finalSession.overallAvg;
            scorePosition = `최종 평가는 전체 평균보다 ${Math.abs(diff)}점 ${diff >= 0 ? '높습니다' : '낮습니다'}.`;
        } else if (Number.isFinite(finalSession.classAvg)) {
            const diff = finalSession.score - finalSession.classAvg;
            scorePosition = `최종 평가는 반 평균보다 ${Math.abs(diff)}점 ${diff >= 0 ? '높습니다' : '낮습니다'}.`;
        }
    }
    const activeWeaknesses = weaknessTrend.filter(item => !item.resolved).slice(0, 2);
    const nextPlan = activeWeaknesses.length
        ? [
            '여러 번 틀린 문제부터 다시 풀어보겠습니다.',
            '관련 개념을 짧게 다시 보고 비슷한 문제로 한 번 더 연습하겠습니다.',
            '푸는 순서를 한 번 더 정리하겠습니다.',
            '검산하는 습관을 같이 잡겠습니다.'
        ]
        : ['이번에 틀린 문제를 다시 풀어보겠습니다.', '비슷한 문제로 한 번 더 연습하겠습니다.', '검산하는 습관을 같이 잡겠습니다.'];

    return {
        selectedSessions,
        trend: {
            firstScore,
            latestScore,
            scoreDelta,
            direction,
            bestScore: scores.length ? Math.max(...scores) : null,
            worstScore: scores.length ? Math.min(...scores) : null,
            averageScore,
            recentAverage,
            hasMultipleSessions: selectedSessions.length >= 2
        },
        weaknessTrend,
        finalSession,
        finalEvaluation: { scorePosition, trendComment, nextPlan }
    };
}

