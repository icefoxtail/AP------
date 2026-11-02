/**
 * AP Math OS [js/nav-quickfind.js] — 빠른 찾기 (학생·반·기능 이름·시험일정 검색)
 *
 * 구성
 *   1) 검색 코어(순수 함수, DOM·state 의존 없음): apmsQuickFindSearch(query, ctx, options)
 *   2) 화면: 공통 모달(P 등급, apms-modal--panel) 위에 입력칸 + 결과 목록. 휴대폰은 전체 화면, PC·태블릿은 상단 가운데.
 *   3) 열기: 헤더 돋보기 버튼(휴대폰·PC), PC Ctrl+K · "/" (입력칸에 포커스가 있을 때 "/"는 무시)
 *
 * 규칙 (docs/plans/2026-11-02-apms-navigation-plan-v0.1.md 4.4, 결정 D2)
 *   - state.db에 있는 자료만 검색한다. 서버 호출 없음.
 *   - 기능 목록은 서랍(ui.js buildDrawerMenu)과 같은 권한 기준이다. 서랍에 없는 기능(원장의 교재·클리닉·원내평가 등)은 보이지 않는다.
 *     tests/apms-quickfind.test.js가 서랍 항목과 이 표(APMS_QF_FEATURES)가 어긋나면 실패하게 고정한다.
 *   - 전화번호는 검색 대상이지만 결과에는 뒤 4자리만 보인다.
 *   - 반 이름은 apmsClassLabel 규칙(학년 중복 금지, 동명 반이면 담당 표기)을 따른다.
 */

// ── 기능 이름 표 ──────────────────────────────────────────────
// id        runner 이름(APMS_QF_RUNNERS 키)
// roles     이 기능이 서랍에 있는 권한 ('admin' | 'teacher')
// markers   서랍 항목의 onclick 안에 나타나는 문자열(권한 일치 테스트용)
// keywords  별칭. 공백 없이 비교한다.
const APMS_QF_FEATURES = Object.freeze([
    { id: 'progress',   label: '진도·교재',        hint: '진도 입력, 교재 관리',   roles: ['teacher'],          markers: ['openGlobalTextbookManage'], keywords: ['진도', '교재', '교재관리', '진도관리', '진도교재', '수업진도'] },
    { id: 'clinic',     label: '클리닉',           hint: '오답 클리닉, 유사문항',  roles: ['teacher'],          markers: ['openClinicCenter'],        keywords: ['클리닉', '오답', '오답클리닉', '유사문항', '유사', '오답노트'] },
    { id: 'exam',       label: '원내평가·OMR',     hint: '성적 입력, OMR 채점',    roles: ['teacher'],          markers: ['openGlobalExamGradeView', 'openOmrInput'], keywords: ['원내평가', 'omr', '성적입력', '성적', '채점', '시험입력', '평가'] },
    { id: 'timetable',  label: '시간표',           hint: '반별 요일·시간',         roles: ['admin', 'teacher'], markers: ['openLiveTimetable'],       keywords: ['시간표', '수업시간', '타임테이블'] },
    { id: 'attendance', label: '출석부',           hint: '출결 기록',              roles: ['teacher'],          markers: ['openAttendanceLedger'],    keywords: ['출석부', '출석', '출결', '결석'] },
    { id: 'journal',    label: '일지',             hint: '수업·업무 일지',         roles: ['teacher'],          markers: ['openDailyJournalModal'],   keywords: ['일지', '수업일지', '업무일지'] },
    { id: 'memo',       label: '메모',             hint: '할 일 메모',             roles: ['teacher'],          markers: ['openTodoMemoModal'],       keywords: ['메모', '할일', '투두', '노트'] },
    { id: 'classManage', label: '반 관리',         hint: '반 추가·수정',           roles: ['admin', 'teacher'], markers: ['openClassManageModal'],    keywords: ['반관리', '학급', '학급관리', '반추가', '반수정', '반'] },
    { id: 'students',   label: '학생 관리',        hint: '학생 목록·추가',         roles: ['admin', 'teacher'], markers: ['openAddressBook'],         keywords: ['학생관리', '학생', '주소록', '학생추가', '신규학생', '원생', '연락처'] },
    { id: 'discharged', label: '퇴원생',           hint: '퇴원 학생 목록',         roles: ['admin', 'teacher'], markers: ['openDischargedStudents', 'openWithdrawalReport'], keywords: ['퇴원', '퇴원생', '퇴원학생', '퇴원관리'] },
    { id: 'schedule',   label: '일정',             hint: '시험·학사 일정',         roles: ['admin', 'teacher'], markers: ['openExamScheduleModal'],   keywords: ['일정', '일정관리', '시험일정', '학사일정', '달력', '캘린더'] },
    { id: 'material',   label: '수업자료',         hint: '수업자료·오답 자료',     roles: ['teacher'],          markers: ['openStudyMaterialWrongCenter'], keywords: ['수업자료', '자료', '학습자료'] },
    { id: 'vault',      label: '시험지 보관함',    hint: '시험지 만들기·보관',     roles: ['teacher'],          markers: ['assessment-mvp.html'],     keywords: ['시험지', '시험지보관함', '보관함', '출제', '출력'] },
    { id: 'archive',    label: '아카이브',         hint: '기출 자료실',            roles: ['admin'],            markers: ['openDashboardArchiveWindow'], keywords: ['아카이브', '기출', '기출문제', '자료실'] },
    { id: 'playground', label: '도형·함수 실험실', hint: '도형 실험',              roles: ['admin', 'teacher'], markers: ['playground/index.html'],   keywords: ['도형', '함수', '실험실', '도형실험실', '그래프'] },
    { id: 'report',     label: '리포트 센터',      hint: '학부모 리포트',          roles: ['teacher'],          markers: ['openReportCenterHome'],    keywords: ['리포트', '리포트센터', '보고서', '학부모리포트'] },
    { id: 'school',     label: '학교성적',         hint: '학교 시험 성적',         roles: ['teacher'],          markers: ['openSchoolExamLedger'],    keywords: ['학교성적', '내신', '학교시험', '성적표'] },
    { id: 'diagnostic', label: '진단평가',         hint: '진단평가 관리',          roles: ['admin'],            markers: ['openAdminDiagnosticPanel'], keywords: ['진단평가', '진단', '레벨테스트'] },
    { id: 'manage',     label: '관리',             hint: '운영 관리 메뉴',         roles: ['admin'],            markers: ['openAdminOperationMenu'],  keywords: ['관리', '운영', '운영관리', '설정'] },
    { id: 'sync',       label: '시스템 동기화',    hint: '자료 새로 불러오기',     roles: ['admin', 'teacher'], markers: ['openOperationMenu'],       keywords: ['동기화', '시스템', '싱크', '새로고침'] },
    { id: 'manual',     label: '사용설명서',       hint: '사용 방법 보기',         roles: ['admin', 'teacher'], markers: ['openManualCenter'],        keywords: ['사용설명서', '설명서', '매뉴얼', '도움말', '사용법'] }
]);

const APMS_QF_TYPE_LABEL = Object.freeze({ feature: '기능', class: '반', student: '학생', exam: '일정', assignment: '자료' });
const APMS_QF_TYPE_ORDER = Object.freeze({ feature: 0, class: 1, student: 2, exam: 3, assignment: 4 });
const APMS_QF_DEFAULT_LIMIT = 20;

// ── 검색 코어 (순수 함수) ─────────────────────────────────────
function apmsQfNorm(value) {
    return String(value == null ? '' : value).toLowerCase().replace(/\s+/g, '');
}

function apmsQfDigits(value) {
    return String(value == null ? '' : value).replace(/\D+/g, '');
}

// 전화번호는 뒤 4자리만 보인다. 4자리 미만이면 아무것도 보이지 않는다.
function apmsQfMaskPhone(phone) {
    const digits = apmsQfDigits(phone);
    return digits.length >= 4 ? '****' + digits.slice(-4) : '';
}

function apmsQfFieldScore(value, key) {
    const text = apmsQfNorm(value);
    if (!text || !key) return 0;
    if (text === key) return 100;
    if (text.startsWith(key)) return 80;
    if (text.includes(key)) return 50;
    return 0;
}

// fields: [{ v, w }]. 전체 문자열(공백 제거)이 한 칸에 맞거나, 공백으로 나눈 낱말이 모두 어느 칸엔가 맞으면 통과.
function apmsQfItemScore(fields, query) {
    const raw = String(query == null ? '' : query).trim();
    if (!raw) return 0;
    const whole = apmsQfNorm(raw);
    let best = 0;
    fields.forEach(f => { best = Math.max(best, apmsQfFieldScore(f.v, whole) * (f.w == null ? 1 : f.w)); });
    const tokens = raw.split(/\s+/).map(apmsQfNorm).filter(Boolean);
    if (tokens.length > 1) {
        let sum = 0;
        let all = true;
        tokens.forEach(token => {
            let tokenBest = 0;
            fields.forEach(f => { tokenBest = Math.max(tokenBest, apmsQfFieldScore(f.v, token) * (f.w == null ? 1 : f.w)); });
            if (!tokenBest) all = false;
            sum += tokenBest;
        });
        if (all) best = Math.max(best, sum / tokens.length);
    }
    return best;
}

function apmsQfPhoneScore(phones, query) {
    const digits = apmsQfDigits(query);
    const onlyNumeric = /^[\d\s-]+$/.test(String(query || '').trim());
    if (!onlyNumeric || digits.length < 3) return 0;
    return phones.some(p => apmsQfDigits(p).includes(digits)) ? 55 : 0;
}

function apmsQfClassLabel(cls, peers) {
    if (typeof apmsClassLabel === 'function') return apmsClassLabel(cls, peers);
    const name = String((cls && cls.name) || '').trim();
    const grade = String((cls && cls.grade) || '').trim();
    return { text: name ? (grade && !name.includes(grade) ? grade + ' ' + name : name) : (grade || '반'), teacher: '' };
}

function apmsQfFeaturesForRole(role) {
    return APMS_QF_FEATURES.filter(f => f.roles.indexOf(role) !== -1);
}

function apmsQfIsDate(value) {
    return /^\d{4}-\d{2}-\d{2}/.test(String(value || ''));
}

/**
 * ctx: { role, students, classes, class_students, exam_schedules, class_exam_assignments, today, canSeeClass(cls) }
 * options: { types: ['feature','class','student','exam','assignment'], limit }
 * 반환: { items, total } — items는 점수 높은 순 상위 limit개. query가 비면 빈 목록.
 */
function apmsQuickFindSearch(query, ctx, options) {
    const opts = options || {};
    const limit = Number(opts.limit) > 0 ? Number(opts.limit) : APMS_QF_DEFAULT_LIMIT;
    const types = Array.isArray(opts.types) ? opts.types : ['feature', 'class', 'student', 'exam', 'assignment'];
    const want = type => types.indexOf(type) !== -1;
    const c = ctx || {};
    const role = String(c.role || '').toLowerCase() === 'admin' ? 'admin' : 'teacher';
    const q = String(query == null ? '' : query).trim();
    if (!q) return { items: [], total: 0 };

    const classes = Array.isArray(c.classes) ? c.classes : [];
    const students = Array.isArray(c.students) ? c.students : [];
    const canSee = typeof c.canSeeClass === 'function' ? c.canSeeClass : () => true;
    const visibleClasses = classes.filter(cls => cls && Number(cls.is_active) !== 0 && canSee(cls));
    const visibleIds = new Set(visibleClasses.map(cls => String(cls.id)));
    const classById = new Map(classes.map(cls => [String(cls.id), cls]));

    const studentClassId = new Map();
    const memberCount = new Map();
    const studentById = new Map(students.map(s => [String(s.id), s]));
    (Array.isArray(c.class_students) ? c.class_students : []).forEach(m => {
        const sid = String(m.student_id);
        if (!studentClassId.has(sid)) studentClassId.set(sid, String(m.class_id));
        const s = studentById.get(sid);
        if (s && String(s.status || '재원').trim() === '재원') {
            const cid = String(m.class_id);
            memberCount.set(cid, (memberCount.get(cid) || 0) + 1);
        }
    });
    const labelOf = cls => apmsQfClassLabel(cls, visibleClasses);

    const found = [];

    if (want('feature')) {
        apmsQfFeaturesForRole(role).forEach(f => {
            const fields = [{ v: f.label, w: 1 }].concat(f.keywords.map(k => ({ v: k, w: 0.95 })));
            const score = apmsQfItemScore(fields, q);
            if (!score) return;
            found.push({ type: 'feature', id: f.id, title: f.label, sub: f.hint, score, action: { kind: 'feature', featureId: f.id } });
        });
    }

    if (want('class')) {
        visibleClasses.forEach(cls => {
            const label = labelOf(cls);
            const teacher = String(cls.teacher_name || '').trim();
            const score = apmsQfItemScore([
                { v: label.text, w: 1 }, { v: cls.name, w: 1 }, { v: cls.grade, w: 0.6 }, { v: teacher, w: 0.6 }
            ], q);
            if (!score) return;
            const count = memberCount.get(String(cls.id)) || 0;
            found.push({
                type: 'class', id: String(cls.id), title: label.text, teacherTag: label.teacher,
                sub: [teacher || '담당 미지정', '재원 ' + count + '명'].join(' · '),
                score, action: { kind: 'class', classId: String(cls.id) }, ref: cls, count
            });
        });
    }

    if (want('student')) {
        students.forEach(s => {
            const cid = studentClassId.get(String(s.id)) || '';
            if (cid && !visibleIds.has(cid) && !canSee(classById.get(cid) || {})) return; // 보이지 않는 반의 학생은 숨긴다
            const cls = cid ? classById.get(cid) : null;
            const classLabel = cls ? labelOf(cls) : null;
            const classText = classLabel ? classLabel.text : '미배정';
            // 같은 이름의 반이 담당별로 따로 있으면 학생 줄에도 담당을 붙여 어느 반인지 알 수 있게 한다
            const classShown = classLabel && classLabel.teacher ? classText + '(' + classLabel.teacher + ')' : classText;
            const school = String(s.school_name || s.school || '').trim();
            const grade = String(s.grade || '').trim();
            const status = String(s.status || '재원').trim() || '재원';
            let score = apmsQfItemScore([
                { v: s.name, w: 1 }, { v: classText, w: 0.7 }, { v: school, w: 0.6 }, { v: grade, w: 0.6 }, { v: status, w: 0.3 }
            ], q);
            const phoneScore = apmsQfPhoneScore([s.phone, s.guardian_phone], q);
            let phoneTail = '';
            if (phoneScore > score) {
                score = phoneScore;
                const hit = [s.phone, s.guardian_phone].find(p => apmsQfDigits(p).includes(apmsQfDigits(q)));
                phoneTail = apmsQfMaskPhone(hit);
            }
            if (!score) return;
            if (status !== '재원') score -= 4; // 재원생이 먼저
            const parts = [classShown, (school + ' ' + grade).trim()];
            if (status !== '재원') parts.push(status);
            if (phoneTail) parts.push('전화 ' + phoneTail);
            found.push({
                type: 'student', id: String(s.id), title: String(s.name || '학생'),
                sub: parts.filter(Boolean).join(' · '),
                score, action: { kind: 'student', studentId: String(s.id), classId: cid },
                // 결과 목록(화면·state)으로 전화번호가 새어 나가지 않게 전화 칸은 뺀 사본을 둔다
                ref: Object.assign({}, s, { phone: undefined, guardian_phone: undefined }), className: classShown, status
            });
        });
    }

    if (want('exam')) {
        (Array.isArray(c.exam_schedules) ? c.exam_schedules : []).forEach(e => {
            const score = apmsQfItemScore([
                { v: e.school_name, w: 1 }, { v: e.exam_name, w: 1 }, { v: e.grade, w: 0.6 }, { v: e.exam_date, w: 0.8 },
                { v: '일정', w: 0.3 }, { v: '시험일정', w: 0.3 }
            ], q);
            if (!score) return;
            found.push({
                type: 'exam', id: String(e.id || e.exam_date || ''), title: (String(e.school_name || '학교') + ' ' + String(e.exam_name || '시험')).trim(),
                sub: [e.grade || '학교공통', e.exam_date || ''].filter(Boolean).join(' · '),
                score, action: { kind: 'exam', date: apmsQfIsDate(e.exam_date) ? String(e.exam_date).slice(0, 10) : '' }, ref: e
            });
        });
    }

    if (want('assignment')) {
        (Array.isArray(c.class_exam_assignments) ? c.class_exam_assignments : []).forEach(row => {
            const cid = String(row.class_id || '');
            const cls = classById.get(cid);
            if (!cls || !visibleIds.has(cid)) return;
            const classLabel = labelOf(cls);
            const classText = classLabel.text;
            const classShown = classLabel.teacher ? classText + '(' + classLabel.teacher + ')' : classText;
            const score = apmsQfItemScore([
                { v: row.exam_title, w: 1 }, { v: classText, w: 0.7 }, { v: row.exam_date, w: 0.6 }, { v: row.archive_file, w: 0.5 }
            ], q);
            if (!score) return;
            found.push({
                type: 'assignment', id: String(row.id || cid + ':' + row.exam_title), title: String(row.exam_title || '배정 자료'),
                sub: [classShown, row.exam_date || ''].filter(Boolean).join(' · '),
                score, action: { kind: 'class', classId: cid }, ref: row, className: classShown
            });
        });
    }

    const today = String(c.today || '');
    found.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        const ao = APMS_QF_TYPE_ORDER[a.type];
        const bo = APMS_QF_TYPE_ORDER[b.type];
        if (ao !== bo) return ao - bo;
        if (a.type === 'exam') { // 다가오는 일정이 먼저
            const ad = String(a.ref.exam_date || '');
            const bd = String(b.ref.exam_date || '');
            const au = today && ad >= today;
            const bu = today && bd >= today;
            if (au !== bu) return au ? -1 : 1;
            if (ad !== bd) return ad < bd ? -1 : 1;
        }
        return String(a.title).localeCompare(String(b.title), 'ko');
    });

    return { items: found.slice(0, limit), total: found.length };
}

// 입력이 비었을 때 보여 줄 바로 가기(권한에 맞는 기능 앞쪽 몇 개)
function apmsQuickFindShortcuts(role, count) {
    const preferred = ['progress', 'clinic', 'exam', 'classManage', 'students', 'schedule', 'timetable', 'attendance'];
    const mine = apmsQfFeaturesForRole(String(role || '').toLowerCase() === 'admin' ? 'admin' : 'teacher');
    const ordered = preferred.map(id => mine.find(f => f.id === id)).filter(Boolean)
        .concat(mine.filter(f => preferred.indexOf(f.id) === -1));
    return ordered.slice(0, count || 8).map(f => ({
        type: 'feature', id: f.id, title: f.label, sub: f.hint, score: 0, action: { kind: 'feature', featureId: f.id }
    }));
}

// ── 기능 실행기 ───────────────────────────────────────────────
function apmsQfCall(name, args, notReady) {
    if (typeof window !== 'undefined' && typeof window[name] === 'function') return window[name].apply(null, args || []);
    if (typeof toast === 'function') toast((notReady || '이 기능') + '을(를) 불러오지 못했습니다.', 'warn');
    return null;
}

const APMS_QF_RUNNERS = {
    progress: () => apmsQfCall('openGlobalTextbookManage', [], '진도·교재'),
    clinic: () => apmsQfCall('openClinicCenter', [], '클리닉'),
    exam: () => (typeof openGlobalExamGradeView === 'function'
        ? openGlobalExamGradeView()
        : apmsQfCall('openExamWorkspace', [''], '원내평가·OMR')),
    timetable: () => (typeof openLiveTimetable === 'function'
        ? openLiveTimetable()
        : apmsQfCall('renderTimetable', [], '시간표')),
    attendance: () => (typeof openAttendanceLedger === 'function'
        ? openAttendanceLedger()
        : apmsQfCall('renderAttendanceLedger', [], '출석부')),
    journal: () => apmsQfCall('openDailyJournalModal', [], '일지'),
    memo: () => apmsQfCall('openTodoMemoModal', [], '메모'),
    classManage: () => apmsQfCall('openClassManageModal', [], '반 관리'),
    students: () => apmsQfCall('openAddressBook', [], '학생 관리'),
    discharged: ctx => (ctx.role === 'admin'
        ? apmsQfCall('openDischargedStudents', [], '퇴원생')
        : apmsQfCall('openWithdrawalReport', [], '퇴원생')),
    schedule: () => apmsQfCall('openExamScheduleModal', [], '일정'),
    material: () => apmsQfCall('openStudyMaterialWrongCenter', [], '수업자료'),
    vault: () => window.open(typeof appendArchiveSessionToUrlForUi === 'function'
        ? appendArchiveSessionToUrlForUi('../archive/assessment/assessment-mvp.html')
        : '../archive/assessment/assessment-mvp.html', '_blank', 'noopener'),
    archive: () => apmsQfCall('openDashboardArchiveWindow', [], '아카이브'),
    playground: () => window.open('./playground/index.html', '_blank', 'noopener'),
    report: () => apmsQfCall('openReportCenterHome', [], '리포트 센터'),
    school: () => (typeof openSchoolExamLedger === 'function'
        ? openSchoolExamLedger()
        : apmsQfCall('openCumulativeOpsModal', ['school'], '학교성적')),
    diagnostic: () => apmsQfCall('openAdminDiagnosticPanel', [], '진단평가'),
    manage: () => apmsQfCall('openAdminOperationMenu', [], '관리'),
    sync: () => apmsQfCall('openOperationMenu', [], '시스템 동기화'),
    manual: () => apmsQfCall('openManualCenter', [], '사용설명서')
};

// ── 화면 ──────────────────────────────────────────────────────
const apmsQfState = { items: [], active: 0, query: '', total: 0 };

function apmsQfRole() {
    if (typeof state === 'undefined' || !state || !state.auth || !state.auth.role) return 'none';
    return typeof getDrawerRoleKey === 'function' ? getDrawerRoleKey() : (String(state.auth.role).toLowerCase() === 'admin' ? 'admin' : 'teacher');
}

function apmsQfBuildContext() {
    const role = apmsQfRole();
    const db = (typeof state !== 'undefined' && state && state.db) || {};
    return {
        role,
        students: db.students || [],
        classes: db.classes || [],
        class_students: db.class_students || [],
        exam_schedules: db.exam_schedules || [],
        class_exam_assignments: db.class_exam_assignments || [],
        today: new Date().toLocaleDateString('sv-SE'),
        canSeeClass: role === 'admin'
            ? () => true
            : cls => (typeof isClassroomClassAccessible === 'function'
                ? isClassroomClassAccessible(cls.id)
                : (typeof isClassVisibleForCurrentTeacher === 'function' ? isClassVisibleForCurrentTeacher(cls) : true))
    };
}

function apmsQfEsc(value) {
    return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function apmsQfOverlayOpen() {
    const overlay = document.getElementById('modal-overlay');
    return !!overlay && !overlay.classList.contains('hidden');
}

// 닫은 모달의 본문은 DOM에 남아 있으므로, 입력칸이 있고 모달이 실제로 열려 있을 때만 "열림"으로 본다.
function apmsQfIsOpen() {
    return !!document.getElementById('apms-qf-input') && apmsQfOverlayOpen();
}

function apmsQfRenderList() {
    const list = document.getElementById('apms-qf-list');
    const status = document.getElementById('apms-qf-status');
    const input = document.getElementById('apms-qf-input');
    if (!list || !status) return;
    const q = apmsQfState.query.trim();
    const items = apmsQfState.items;

    if (!items.length) {
        list.innerHTML = '';
        status.textContent = q ? '“' + q + '”에 맞는 학생·반·기능이 없습니다. 다른 이름으로 찾아 보세요.' : '';
    } else if (!q) {
        status.textContent = '바로 가기';
    } else if (apmsQfState.total > items.length) {
        status.textContent = '총 ' + apmsQfState.total + '건 중 ' + items.length + '건만 보입니다. 더 입력해서 좁혀 보세요.';
    } else {
        status.textContent = apmsQfState.total + '건';
    }

    list.innerHTML = items.map((item, idx) => {
        const active = idx === apmsQfState.active;
        const tag = item.teacherTag ? ' <span class="apms-class-label__teacher">' + apmsQfEsc(item.teacherTag) + '</span>' : '';
        return '<button type="button" role="option" id="apms-qf-opt-' + idx + '" class="apms-qf__row' + (active ? ' is-active' : '') + '" data-idx="' + idx + '" aria-selected="' + (active ? 'true' : 'false') + '">'
            + '<span class="apms-qf__badge apms-qf__badge--' + item.type + '">' + apmsQfEsc(APMS_QF_TYPE_LABEL[item.type] || '') + '</span>'
            + '<span class="apms-qf__text"><span class="apms-qf__title">' + apmsQfEsc(item.title) + tag + '</span>'
            + '<span class="apms-qf__sub">' + apmsQfEsc(item.sub || '') + '</span></span>'
            + '<span class="apms-qf__go" aria-hidden="true">열기</span></button>';
    }).join('');

    if (input) {
        input.setAttribute('aria-expanded', items.length ? 'true' : 'false');
        if (items.length) input.setAttribute('aria-activedescendant', 'apms-qf-opt-' + apmsQfState.active);
        else input.removeAttribute('aria-activedescendant');
    }
}

function apmsQfUpdate(value) {
    apmsQfState.query = String(value == null ? '' : value);
    const ctx = apmsQfBuildContext();
    if (!apmsQfState.query.trim()) {
        apmsQfState.items = apmsQuickFindShortcuts(ctx.role, 8);
        apmsQfState.total = apmsQfState.items.length;
    } else {
        const result = apmsQuickFindSearch(apmsQfState.query, ctx, { limit: APMS_QF_DEFAULT_LIMIT });
        apmsQfState.items = result.items;
        apmsQfState.total = result.total;
    }
    apmsQfState.active = 0;
    apmsQfRenderList();
}

function apmsQfMoveActive(delta) {
    const n = apmsQfState.items.length;
    if (!n) return;
    apmsQfState.active = (apmsQfState.active + delta + n) % n;
    apmsQfRenderList();
    const row = document.getElementById('apms-qf-opt-' + apmsQfState.active);
    if (row && typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
}

function apmsQfStudentReturnTo(classId) {
    const shell = typeof document !== 'undefined' ? document.querySelector('.ap-classroom-shell') : null;
    const shownClass = shell ? String(shell.getAttribute('data-class-id') || '') : '';
    if (shownClass) return { type: 'classDetail', classId: shownClass };
    return { type: 'dashboard' };
}

function apmsQfOpenItem(item) {
    if (!item || !item.action) return;
    const ctx = apmsQfBuildContext();
    const action = item.action;
    if (typeof closeModal === 'function') closeModal(true);
    if (action.kind === 'student') {
        if (typeof openStudentDetail === 'function') openStudentDetail(action.studentId, { mode: 'view', returnTo: apmsQfStudentReturnTo(action.classId) });
        else toast('학생 화면을 불러오지 못했습니다.', 'warn');
    } else if (action.kind === 'class') {
        if (typeof renderClass === 'function') renderClass(String(action.classId));
        else toast('반 화면을 불러오지 못했습니다.', 'warn');
    } else if (action.kind === 'exam') {
        apmsQfCall('openExamScheduleModal', action.date ? [action.date] : [], '일정');
    } else if (action.kind === 'feature') {
        const run = APMS_QF_RUNNERS[action.featureId];
        if (run) run(ctx);
    }
}

function apmsQuickFindOpenResult(index) {
    apmsQfOpenItem(apmsQfState.items[Number(index)]);
}

function apmsQfOnKeydown(event) {
    if (event.isComposing || event.keyCode === 229) return; // 한글 조합 중 Enter·방향키는 건드리지 않는다
    if (event.key === 'ArrowDown') { event.preventDefault(); apmsQfMoveActive(1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); apmsQfMoveActive(-1); }
    else if (event.key === 'Enter') { event.preventDefault(); apmsQuickFindOpenResult(apmsQfState.active); }
}

function apmsQuickFindOpen(initialQuery) {
    const role = apmsQfRole();
    if (role === 'none') return false;
    if (typeof showModal !== 'function') return false;
    if (apmsQfIsOpen()) {
        const input = document.getElementById('apms-qf-input');
        if (input) input.focus();
        return true;
    }
    if (apmsQfOverlayOpen()) return false; // 다른 모달 위에 겹쳐 열지 않는다(입력 중인 내용 보호)
    if (typeof closeAppDrawer === 'function') { try { closeAppDrawer(); } catch (e) { /* 서랍이 없으면 무시 */ } }

    showModal('빠른 찾기', `
        <div class="apms-modal apms-modal--panel apms-quickfind" data-apms-nodirty>
            <div class="apms-modal__body apms-qf">
                <div class="apms-qf__field">
                    <svg class="apms-qf__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M21 21L16.65 16.65M10.8 18.1C6.77 18.1 3.5 14.83 3.5 10.8C3.5 6.77 6.77 3.5 10.8 3.5C14.83 3.5 18.1 6.77 18.1 10.8C18.1 14.83 14.83 18.1 10.8 18.1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <input id="apms-qf-input" class="apms-qf__input" type="search" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="go"
                           role="combobox" aria-label="학생, 반, 기능 이름 찾기" aria-autocomplete="list" aria-expanded="false" aria-controls="apms-qf-list"
                           placeholder="학생 · 반 · 기능 이름 (예: 클리닉, 중3A)">
                </div>
                <div id="apms-qf-status" class="apms-qf__status" role="status" aria-live="polite"></div>
                <div id="apms-qf-list" class="apms-qf__list" role="listbox" aria-label="찾기 결과"></div>
            </div>
        </div>`);

    const input = document.getElementById('apms-qf-input');
    const list = document.getElementById('apms-qf-list');
    if (!input || !list) return false;
    input.addEventListener('input', () => apmsQfUpdate(input.value));
    input.addEventListener('keydown', apmsQfOnKeydown);
    list.addEventListener('click', event => {
        const row = event.target && event.target.closest ? event.target.closest('.apms-qf__row') : null;
        if (row) apmsQuickFindOpenResult(row.getAttribute('data-idx'));
    });
    list.addEventListener('mousemove', event => {
        const row = event.target && event.target.closest ? event.target.closest('.apms-qf__row') : null;
        if (!row) return;
        const idx = Number(row.getAttribute('data-idx'));
        if (idx !== apmsQfState.active) {
            apmsQfState.active = idx;
            list.querySelectorAll('.apms-qf__row').forEach(el => {
                const on = Number(el.getAttribute('data-idx')) === idx;
                el.classList.toggle('is-active', on);
                el.setAttribute('aria-selected', on ? 'true' : 'false');
            });
            input.setAttribute('aria-activedescendant', 'apms-qf-opt-' + idx);
        }
    });
    if (initialQuery) input.value = String(initialQuery);
    apmsQfUpdate(input.value);
    setTimeout(() => { if (document.activeElement !== input) input.focus(); }, 60);
    return true;
}

// ── 열기: 단축키, 버튼 표시 ───────────────────────────────────
function apmsQfIsTyping(target) {
    if (!target || !target.tagName) return false;
    const tag = String(target.tagName).toUpperCase();
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || !!target.isContentEditable;
}

function apmsQfOnGlobalKey(event) {
    if (!event || event.defaultPrevented) return;
    const key = String(event.key || '');
    const isCtrlK = (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && key.toLowerCase() === 'k';
    const isSlash = key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey && !apmsQfIsTyping(event.target);
    if (!isCtrlK && !isSlash) return;
    if (apmsQfRole() === 'none') return;
    if (isCtrlK) event.preventDefault(); // 브라우저 주소창 검색으로 가지 않게
    if (apmsQfIsOpen()) {
        if (isCtrlK) { const input = document.getElementById('apms-qf-input'); if (input) { input.focus(); input.select(); } }
        return;
    }
    if (isSlash) event.preventDefault();
    apmsQuickFindOpen();
}

function apmsQuickFindSyncButtons() {
    const visible = apmsQfRole() !== 'none';
    document.querySelectorAll('.apms-qf-open').forEach(btn => { btn.hidden = !visible; });
}

if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
    if (!document.__apmsQuickFindBound) {
        document.__apmsQuickFindBound = true;
        document.addEventListener('keydown', apmsQfOnGlobalKey);
        const init = () => {
            apmsQuickFindSyncButtons();
            // 로그인·계정 전환 때 헤더의 사용자 이름이 바뀐다. 그때 버튼 표시도 다시 정한다.
            if (typeof MutationObserver === 'function') {
                const observer = new MutationObserver(apmsQuickFindSyncButtons);
                ['mobile-header-user', 'desktop-header-user'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) observer.observe(el, { childList: true, characterData: true, subtree: true });
                });
                const topbar = document.querySelector('.desktop-topbar');
                if (topbar) observer.observe(topbar, { childList: true });
            }
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
        else init();
    }
}

if (typeof window !== 'undefined') {
    window.apmsQuickFindOpen = apmsQuickFindOpen;
    window.apmsQuickFindSearch = apmsQuickFindSearch;
}
