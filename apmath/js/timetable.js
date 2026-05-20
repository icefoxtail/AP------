/**
 * AP Math OS [js/timetable.js]
 * 시간표 - 기존 반 카드 데이터 기반 PC 풀스크린 엑셀형 시간표
 * 원본 데이터: state.allDb / state.db
 * 새 DB 테이블 없음. timetable_cells / timetable_cell_students 생성 금지.
 *
 * 반영 사항:
 * - 시간표 내부 햄버거 제거
 * - 모바일 가로 드래그 유지
 * - 탭 토글 전역 함수(window.ttSetSection, window.ttSetMyOnly) 분리로 호출 오류 해결
 * - 모바일/PC 공통으로 JS 실측 기반으로 화면 하단까지 표를 꽉 채우도록 통합 (applyTimetableFit)
 * - 중등부/고등부는 표시 교사 목록 기준으로 열을 생성
 * - 내 반 보기는 현재 로그인 교사 열만 남기고 다른 교사 열 제거
 * - 원장/admin은 내 반 보기 비활성화, 전체 보기 고정
 * - 모바일은 중등/고등, 전체보기/내반보기 모두 148px 고정
 * - 내 반 보기는 teacher_name과 현재 로그인 이름(t1->박준성 명시적 매핑 포함)만으로 필터링
 * - 전체보기 버튼 좌측 마진(margin-left: auto) 제거로 탭 스크롤 간섭 방지
 * - 와이드 모니터 해상도 대응(1440px 상한 및 가운데 정렬) 적용
 */

// ────────────────────────────────────────────
// 설정
// ────────────────────────────────────────────

var TIMETABLE_STUDENT_SLOT_COUNT = 8;
var TIMETABLE_FIXED_TEACHERS = ['정겨운', '정의한', '박준성'];
var TIMETABLE_MIDDLE_DAY_GROUPS = ['mwf', 'ttf'];
var TIMETABLE_MIDDLE_PERIODS = [
    { key: '1교시', label: '1교시', time: '4:50~6:20' },
    { key: '2교시', label: '2교시', time: '6:30~8:00' },
    { key: '3교시', label: '3교시', time: '8:00~9:30' }
];
var TIMETABLE_MIDDLE_DAY_GROUP_DAYS = {
    mwf: ['mon', 'wed', 'fri'],
    ttf: ['tue', 'thu', 'fri']
};
var TIMETABLE_MIDDLE_PERIOD_TIMES = {
    '1교시': { start: '16:50', end: '18:20', legacy: '1교시 4:50~6:20' },
    '2교시': { start: '18:30', end: '20:00', legacy: '2교시 6:30~8:00' },
    '3교시': { start: '20:00', end: '21:30', legacy: '3교시 8:00~9:30' }
};
var TIMETABLE_HIGH_GRADES = ['고1', '고2', '고3'];
var TIMETABLE_FIT_BOUND = false;
var TIMETABLE_FIT_TIMER = null;

// ────────────────────────────────────────────
// 와이드 모드 및 CSS
// ────────────────────────────────────────────

function enterTimetableWideMode() {
    var root = document.getElementById('app-root');
    var main = root ? root.closest('main') : null;
    if (main) main.classList.add('ap-timetable-wide-main');
}

function leaveTimetableWideMode() {
    var main = document.querySelector('main.ap-timetable-wide-main');
    if (main) main.classList.remove('ap-timetable-wide-main');
}

function installTimetableStyle() {
    if (document.getElementById('ap-timetable-style')) return;

    var style = document.createElement('style');
    style.id = 'ap-timetable-style';
    style.textContent = [
        '@media (min-width:901px) {',
        '  main.ap-timetable-wide-main { max-width: 1440px !important; width:calc(100vw - 56px) !important; margin: 0 auto !important; padding-left:24px !important; padding-right:24px !important; }',
        '  body.ap-drawer-expanded main.ap-timetable-wide-main { width:calc(100vw - 260px) !important; margin: 0 auto !important; }',
        '}',
        '#timetable-root { max-width:none !important; width:100% !important; overflow:hidden; padding-bottom:0 !important; }',
        '.tt-page-title { font-size:17px; font-weight:700; color:var(--text); min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-tab-scroll { display:flex; align-items:center; gap:8px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding:4px 0 14px; white-space:nowrap; scrollbar-width:none; }',
        '.tt-tab-scroll::-webkit-scrollbar { display:none; }',
        '.tt-tab-scroll .tab-btn { flex:0 0 auto; white-space:nowrap; min-width:auto; padding:10px 16px; font-size:13px; font-weight:600; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:var(--surface); color:var(--secondary); transition:all 0.2s; cursor:pointer; }',
        '.tt-tab-scroll .tab-btn.active { background:var(--text); color:var(--surface); border-color:var(--text); font-weight:700; }',

        '.tt-table-wrap { overflow-x:auto; overflow-y:hidden; border-radius:8px; border:1px solid rgba(0,0,0,0.08); background:var(--surface); -webkit-overflow-scrolling:touch; }',
        '@media (max-width:900px) { .tt-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; } }',
        '.tt-table { border-collapse:collapse; background:var(--surface); font-family:inherit; table-layout:fixed; width:auto; height:100%; }',
        '.tt-table tbody { overflow:hidden; }',
        '.tt-table-middle, .tt-table-high { width:auto; min-width:auto; }',
        '.tt-row-fixed { height:auto; min-height:0; }',

        '.tt-card { background:var(--surface); border:1px solid rgba(0,0,0,0.06); border-radius:8px; padding:6px 8px; margin-bottom:4px; width:100%; min-height:auto; display:flex; flex-direction:column; box-sizing:border-box; overflow:hidden; transition:border-color 0.2s, transform 0.2s; gap:2px; }',
        '@media (hover: hover) { .tt-card:hover { border-color:rgba(0,0,0,0.18); transform:translateY(-1px); box-shadow:0 2px 6px rgba(0,0,0,0.02); } }',
        '.tt-card-hdr { display:flex; align-items:center; gap:4px; margin-bottom:2px; flex-shrink:0; }',
        '.tt-cls-name { font-size:13px; font-weight:700; color:var(--text); cursor:pointer; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; letter-spacing:-0.2px; }',
        '.tt-cls-name:hover { color:var(--primary); text-decoration:underline; }',
        '.tt-book { flex-shrink:0; display:flex; flex-direction:column; gap:1px; margin-bottom:2px; }',
        '.tt-book-line { font-size:10px; color:var(--secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; line-height:1.2; letter-spacing:-0.2px; }',
        '.tt-progress { font-size:10px; color:var(--primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; display:block; line-height:1.2; letter-spacing:-0.2px; }',
        '.tt-std-list { display:grid; grid-template-columns:1fr 1fr; row-gap:2px; column-gap:4px; margin-top:2px; flex:1 1 auto; min-height:0; }',
        '.tt-std-slot { min-width:0; min-height:18px; display:flex; align-items:center; justify-content:flex-start; border-radius:4px; overflow:hidden; }',
        '.tt-std-name { display:block; width:100%; min-width:0; font-size:12px; font-weight:600; color:var(--text-soft); cursor:pointer; padding:2px 3px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:left; line-height:1.2; letter-spacing:-0.2px; }',
        '@media (hover: hover) { .tt-std-name:hover { background:var(--surface-2); color:var(--text); } }',
        '.tt-std-name.tt-new { color:#1A5CFF !important; }',
        '.tt-std-name.tt-leave { color:#FF8C00 !important; }',
        '.tt-std-name[draggable="true"] { cursor:grab; }',
        '.tt-std-name[draggable="true"]:active { cursor:grabbing; }',
        '.tt-std-empty { display:block; width:100%; min-height:18px; border:1px dashed rgba(0,0,0,0.1); border-radius:4px; cursor:pointer; background:transparent; color:var(--secondary); font-size:10.5px; font-weight:600; line-height:16px; text-align:left; padding:0 3px; font-family:inherit; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; grid-column:span 2; letter-spacing:-0.2px; }',
        '@media (hover: hover) { .tt-std-empty:hover { color:var(--primary); border-color:rgba(26,92,255,0.3); background:rgba(26,92,255,0.03); } }',
        '.tt-std-slot-more { display:flex; align-items:center; justify-content:flex-start; width:100%; min-height:18px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.05); border-radius:4px; cursor:pointer; padding:0 3px; box-sizing:border-box; grid-column:span 2; letter-spacing:-0.2px; }',
        '.tt-card.tt-drop-ready { border-color:rgba(26,92,255,0.45); background:rgba(26,92,255,0.03); }',
        '.tt-card[draggable="true"] { cursor:grab; }',
        '.tt-card[draggable="true"]:active { cursor:grabbing; }',
        '.tt-cell-drop-ready { outline:2px solid rgba(26,92,255,0.32); outline-offset:-2px; background:rgba(26,92,255,0.04) !important; }',
        '.tt-add-class-cell { width:100%; min-height:30px; border:1px dashed rgba(26,92,255,0.28); border-radius:6px; background:rgba(26,92,255,0.035); color:var(--primary); font-size:11px; font-weight:800; cursor:pointer; font-family:inherit; }',
        '@media (hover: hover) { .tt-add-class-cell:hover { background:rgba(26,92,255,0.08); } }',
        '.tt-row-label { font-weight:700; font-size:13px; color:var(--text); text-align:center; white-space:nowrap; letter-spacing:-0.3px; line-height:1.3; }',
        '.tt-row-sublabel { font-size:10px; color:var(--secondary); text-align:center; margin-top:2px; white-space:nowrap; letter-spacing:-0.2px; line-height:1.3; }',
        '.tt-high-class-wrap { display:flex; flex-direction:column; gap:2px; margin-bottom:4px; }',
        '.tt-high-class-wrap:last-child { margin-bottom:0; }',
        '.tt-high-class-meta { font-size:10px; font-weight:700; color:var(--secondary); line-height:1.2; padding:0 2px 2px; white-space:normal; word-break:keep-all; letter-spacing:-0.2px; }',
        '.tt-high-class-meta-line { display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'
    ].join('\n');

    document.head.appendChild(style);
}

// ────────────────────────────────────────────
// 화면 핏 (PC/모바일 공통)
// ────────────────────────────────────────────

function scheduleTimetableFit() {
    clearTimeout(TIMETABLE_FIT_TIMER);
    TIMETABLE_FIT_TIMER = setTimeout(function() {
        applyTimetableFit();
        setTimeout(applyTimetableFit, 120);
    }, 0);
}

function bindTimetableFitEvents() {
    if (TIMETABLE_FIT_BOUND) return;
    TIMETABLE_FIT_BOUND = true;

    window.addEventListener('resize', scheduleTimetableFit);
    window.addEventListener('orientationchange', function() {
        setTimeout(scheduleTimetableFit, 250);
    });
}

function applyTimetableFit() {
    var root = document.getElementById('timetable-root');
    var wrap = document.querySelector('#timetable-grid-wrapper .tt-table-wrap');
    var table = wrap ? wrap.querySelector('.tt-table') : null;
    var thead = table ? table.querySelector('thead') : null;
    var rows = table ? Array.prototype.slice.call(table.querySelectorAll('tbody .tt-row-fixed')) : [];

    if (!root || !wrap || !table || !rows.length) return;

    applyTimetableResponsiveWidth();

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var wrapTop = wrap.getBoundingClientRect().top;
    
    // [Fix] 가로 스크롤바가 화면 하단에 너무 딱 붙지 않도록 안전 여백 확보 (미세 세로 스크롤/드래그 방지)
    var isMobile = window.innerWidth <= 900;
    var bottomPadding = isMobile ? 10 : 14;
    
    var availableHeight = Math.floor(viewportHeight - wrapTop - bottomPadding);

    if (!Number.isFinite(availableHeight) || availableHeight < 280) {
        availableHeight = 280;
    }

    wrap.style.height = availableHeight + 'px';
    wrap.style.maxHeight = availableHeight + 'px';
    wrap.style.overflowX = isMobile ? 'auto' : 'hidden';
    wrap.style.overflowY = 'hidden';
    table.style.height = availableHeight + 'px';

    var theadHeight = thead ? Math.ceil(thead.getBoundingClientRect().height) : 0;
    var bodyHeight = availableHeight - theadHeight;

    if (!Number.isFinite(bodyHeight) || bodyHeight < 180) {
        bodyHeight = availableHeight;
    }

    var rowHeight = Math.floor(bodyHeight / rows.length);
    if (rowHeight < 60) rowHeight = 60;

    rows.forEach(function(row) {
        row.style.height = rowHeight + 'px';
        row.style.minHeight = rowHeight + 'px';
    });
}

// ────────────────────────────────────────────
// 전역 데이터 접근 및 권한
// ────────────────────────────────────────────

function _getAllDb() {
    return (typeof state !== 'undefined') ? (state.allDb || state.db || {}) : {};
}

function _ttNormalizeTeacherName(name) {
    var str = String(name || '').trim();
    if (!str) return '';
    str = str.replace(/\s*선생님\s*$/g, '').trim();

    var map = {
        'teacher1': '박준성',
        '선생님1': '박준성',
        't1': '박준성',
        'teacher2': '정겨운',
        '선생님2': '정겨운',
        't2': '정겨운',
        'teacher3': '정의한',
        '선생님3': '정의한',
        't3': '정의한'
    };

    return map[str.toLowerCase()] || str;
}

function _ttFirstValidTeacherName(candidates) {
    var known = TIMETABLE_FIXED_TEACHERS;

    for (var i = 0; i < candidates.length; i++) {
        var value = _ttNormalizeTeacherName(candidates[i]);
        if (value && known.indexOf(value) !== -1) return value;
    }

    return '';
}

function _ttGetCurrentTeacherName() {
    var candidates = [];

    if (typeof getTeacherNameForUI === 'function') {
        candidates.push(getTeacherNameForUI());
    }

    if (typeof state !== 'undefined') {
        candidates.push(
            state.ui && state.ui.userName,
            state.ui && state.ui.teacherName,
            state.ui && state.ui.teacher_name,
            state.auth && state.auth.name,
            state.auth && state.auth.teacher_name,
            state.auth && state.auth.teacherName,
            state.auth && state.auth.display_name,
            state.auth && state.auth.displayName,
            state.auth && state.auth.user_name,
            state.auth && state.auth.userName,
            state.auth && state.auth.user && state.auth.user.name,
            state.auth && state.auth.user && state.auth.user.teacher_name,
            state.auth && state.auth.user && state.auth.user.teacherName,
            state.auth && state.auth.user && state.auth.user.display_name,
            state.auth && state.auth.user && state.auth.user.displayName,
            state.user && state.user.name,
            state.user && state.user.teacher_name,
            state.user && state.user.teacherName,
            state.user && state.user.display_name,
            state.user && state.user.displayName
        );

        var loginId = String(
            (state.auth && (state.auth.login_id || state.auth.loginId || state.auth.id || state.auth.username)) ||
            (state.auth && state.auth.user && (state.auth.user.login_id || state.auth.user.loginId || state.auth.user.id || state.auth.user.username)) ||
            ''
        ).trim();

        if (loginId) {
            candidates.push(loginId);
        }
    }

    try {
        var session = JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null');
        if (session) {
            candidates.push(
                session.name,
                session.teacher_name,
                session.teacherName,
                session.display_name,
                session.displayName,
                session.user_name,
                session.userName,
                session.user && session.user.name,
                session.user && session.user.teacher_name,
                session.user && session.user.teacherName,
                session.user && session.user.display_name,
                session.user && session.user.displayName
            );

            var sessionLoginId = String(
                session.login_id || session.loginId || session.id || session.username ||
                (session.user && (session.user.login_id || session.user.loginId || session.user.id || session.user.username)) ||
                ''
            ).trim();

            if (sessionLoginId) {
                candidates.push(sessionLoginId);
            }
        }
    } catch (e) {}

    return _ttFirstValidTeacherName(candidates);
}

function getTimetableVisibleTeachers() {
    if (isTimetableAdminMode()) return TIMETABLE_FIXED_TEACHERS.slice();

    var isMyOnly = isTimetableAdminMode() ? false : !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    if (!isMyOnly) return TIMETABLE_FIXED_TEACHERS.slice();

    var current = _ttGetCurrentTeacherName();
    if (!current) return [];
    return TIMETABLE_FIXED_TEACHERS.indexOf(current) !== -1 ? [current] : [];
}

function getTimetableMergedClass(cls) {
    if (!cls) return cls;
    var db = _getAllDb();
    var realClass = (db.classes || []).find(function(c) {
        return String(c.id) === String(cls.id);
    });
    if (!realClass) return cls;

    var merged = Object.assign({}, realClass, cls);
    merged.teacher_name = cls.teacher_name || cls.teacherName || cls.teacher || realClass.teacher_name || realClass.teacherName || realClass.teacher || '';
    merged.grade = cls.grade || realClass.grade || '';
    merged.name = cls.name || realClass.name || '';
    merged.schedule_days = cls.schedule_days || realClass.schedule_days || '';
    merged.time_label = cls.time_label || realClass.time_label || '';
    merged.is_active = typeof cls.is_active !== 'undefined' ? cls.is_active : realClass.is_active;
    return merged;
}

function getTimetableViewportWidth() {
    var root = document.getElementById('timetable-root');
    var width = root ? root.getBoundingClientRect().width : 0;
    return Math.floor(width || window.innerWidth || document.documentElement.clientWidth || 390);
}

function getTimetableColumnPlan(section, visibleTeachers) {
    var teachers = visibleTeachers && visibleTeachers.length ? visibleTeachers : [];
    var isMobile = window.innerWidth <= 900;
    var labelWidth = isMobile ? 58 : 70;
    var teacherSlots = section === 'middle'
        ? TIMETABLE_MIDDLE_DAY_GROUPS.length * teachers.length
        : teachers.length;
    var teacherWidth = 200;

    if (isMobile) {
        teacherWidth = 148;
    }

    var tableWidth = labelWidth + teacherWidth * teacherSlots;

    return {
        labelWidth: labelWidth,
        teacherWidth: teacherWidth,
        teacherSlots: teacherSlots,
        tableWidth: tableWidth
    };
}

function buildTimetableColgroup(section, visibleTeachers) {
    var plan = getTimetableColumnPlan(section, visibleTeachers);
    var html = '<colgroup><col style="width:' + plan.labelWidth + 'px">';
    for (var i = 0; i < plan.teacherSlots; i++) {
        html += '<col style="width:' + plan.teacherWidth + 'px">';
    }
    html += '</colgroup>';
    return html;
}

function applyTimetableResponsiveWidth() {
    var table = document.querySelector('#timetable-grid-wrapper .tt-table');
    if (!table) return;

    var section = table.classList.contains('tt-table-high') ? 'high' : 'middle';
    var visibleTeachers = getTimetableVisibleTeachers();
    if (!visibleTeachers.length) return;

    var plan = getTimetableColumnPlan(section, visibleTeachers);
    table.style.width = plan.tableWidth + 'px';
    table.style.minWidth = plan.tableWidth + 'px';

    var cols = table.querySelectorAll('colgroup col');
    if (cols.length > 0) {
        cols[0].style.width = plan.labelWidth + 'px';
        for (var i = 1; i < cols.length; i++) {
            cols[i].style.width = plan.teacherWidth + 'px';
        }
    }
}

function getTimetableClassTeacherName(cls) {
    if (!cls) return '';
    var direct = _ttNormalizeTeacherName(cls.teacher_name || cls.teacherName || cls.teacher || '');
    if (direct) return direct;

    var db = _getAllDb();
    var realClass = (db.classes || []).find(function(c) {
        return String(c.id) === String(cls.id);
    });
    return realClass ? _ttNormalizeTeacherName(realClass.teacher_name || realClass.teacherName || realClass.teacher || '') : '';
}

function isTimetableMyClass(cls) {
    if (!cls) return false;
    var current = _ttGetCurrentTeacherName();
    var classTeacher = getTimetableClassTeacherName(cls);
    if (!current) return false;
    if (!classTeacher) return false;
    return classTeacher === current;
}

function openTimetableClass(classId) {
    if (isTimetableDraftMode()) return;
    if (typeof canCurrentUserAccessClass === 'function' && !canCurrentUserAccessClass(classId)) {
        if (typeof toast === 'function') toast('담당 반만 운영할 수 있습니다.', 'warn');
        return;
    }

    leaveTimetableWideMode();
    if (typeof state !== 'undefined' && state.ui) {
        state.ui.currentClassId = String(classId);
        state.ui.returnView = { type: 'timetable' };
    }

    if (typeof renderClass === 'function') renderClass(String(classId));
    else if (typeof toast === 'function') toast('반 화면을 불러오지 못했습니다.', 'warn');
}

function openEditStudentFromTimetable(studentId) {
    if (typeof canCurrentUserAccessStudent === 'function' && !canCurrentUserAccessStudent(studentId)) {
        if (typeof toast === 'function') toast('담당 학생만 수정할 수 있습니다.', 'warn');
        return;
    }

    if (typeof state !== 'undefined' && state.ui) state.ui.returnView = { type: 'timetable' };

    if (typeof openEditStudent === 'function') {
        openEditStudent(String(studentId), { returnTo: { type: 'timetable' } });
    }
}

function openAddStudentToClass(classId) {
    if (typeof canCurrentUserAccessClass === 'function' && !canCurrentUserAccessClass(classId)) {
        if (typeof toast === 'function') toast('담당 반에만 학생을 추가할 수 있습니다.', 'warn');
        return;
    }

    if (typeof state !== 'undefined' && state.ui) state.ui.returnView = { type: 'timetable' };

    if (typeof openAddStudent === 'function') {
        openAddStudent(String(classId), { returnTo: { type: 'timetable' } });
    }
}

// ────────────────────────────────────────────
// 유틸리티
// ────────────────────────────────────────────

function isTimetableAdminMode() {
    if (typeof state === 'undefined') return false;
    var role = String(state.auth && state.auth.role || '').trim().toLowerCase();
    var scope = String(state.ui && state.ui.viewScope || '').trim().toLowerCase();
    var name = String(state.auth && state.auth.name || state.ui && state.ui.userName || '').trim();
    return role === 'admin' ||
        role === 'owner' ||
        role === 'director' ||
        role === 'master' ||
        scope === 'admin' ||
        name === '원장' ||
        /원장/.test(name);
}

function ensureTimetableVersionUiState() {
    if (typeof state === 'undefined') return {};
    if (!state.ui) state.ui = {};
    if (!Array.isArray(state.ui.timetableVersions)) state.ui.timetableVersions = [];
    if (!Array.isArray(state.ui.draftTimetableVersions)) state.ui.draftTimetableVersions = [];
    if (!Array.isArray(state.ui.selectedTimetableVersionSlots)) state.ui.selectedTimetableVersionSlots = [];
    if (!Array.isArray(state.ui.selectedTimetableVersionClasses)) state.ui.selectedTimetableVersionClasses = [];
    if (!Array.isArray(state.ui.selectedTimetableVersionNewStudents)) state.ui.selectedTimetableVersionNewStudents = [];
    if (!state.ui.timetableViewMode) state.ui.timetableViewMode = 'active';
    if (typeof state.ui.selectedTimetableVersionId === 'undefined') state.ui.selectedTimetableVersionId = null;
    if (typeof state.ui.selectedTimetableVersion === 'undefined') state.ui.selectedTimetableVersion = null;
    if (typeof state.ui.activeTimetableVersion === 'undefined') state.ui.activeTimetableVersion = null;
    if (typeof state.ui.timetableDraftPreviewResult === 'undefined') state.ui.timetableDraftPreviewResult = null;
    if (typeof state.ui.timetableVersionsLoadFailedAt === 'undefined') state.ui.timetableVersionsLoadFailedAt = 0;
    if (typeof state.ui.timetableVersionsLoadError === 'undefined') state.ui.timetableVersionsLoadError = '';
    return state.ui;
}

function getTimetableTodayString() {
    if (typeof getTodayStr === 'function') return getTodayStr();
    return new Date().toLocaleDateString('sv-SE');
}

function isTimetableDraftMode() {
    var ui = ensureTimetableVersionUiState();
    return isTimetableAdminMode() && ui.timetableViewMode === 'draft' && !!ui.selectedTimetableVersionId;
}

function isTimetableDraftSection(section) {
    return isTimetableDraftMode() && String(section || '') === 'middle';
}

function getTimetableVersionList() {
    return ensureTimetableVersionUiState().timetableVersions || [];
}

function getActiveTimetableVersionForView() {
    var ui = ensureTimetableVersionUiState();
    if (ui.activeTimetableVersion) return ui.activeTimetableVersion;
    return getTimetableVersionList().find(function(version) {
        return String(version && version.status || '') === 'active';
    }) || null;
}

function getDraftTimetableVersionsForView() {
    return getTimetableVersionList()
        .filter(function(version) {
            var status = String(version && version.status || '');
            return status === 'draft' || status === 'scheduled';
        })
        .sort(function(a, b) {
            return Number(a && a.school_year || 0) - Number(b && b.school_year || 0);
        });
}

function getSelectedTimetableVersionForView() {
    var ui = ensureTimetableVersionUiState();
    if (ui.selectedTimetableVersion && String(ui.selectedTimetableVersion.id || '') === String(ui.selectedTimetableVersionId || '')) {
        return ui.selectedTimetableVersion;
    }
    return getTimetableVersionList().find(function(version) {
        return String(version && version.id || '') === String(ui.selectedTimetableVersionId || '');
    }) || null;
}

function getTimetableDraftSlotRows(classId) {
    var ui = ensureTimetableVersionUiState();
    var identities = getTimetableClassIdentityValues(classId);
    return (ui.selectedTimetableVersionSlots || [])
        .filter(function(slot) {
            if (!classId) return true;
            var rowIds = [slot.version_class_id, slot.class_id, slot.source_class_id].map(function(v) { return String(v || '').trim(); });
            return rowIds.some(function(v) { return v && identities.indexOf(v) !== -1; });
        })
        .map(function(slot) {
            var classKey = String(slot.version_class_id || slot.class_id || slot.source_class_id || '').trim();
            return {
                id: slot.id || '',
                class_id: classKey,
                version_class_id: slot.version_class_id || null,
                source_class_id: slot.source_class_id || null,
                version_id: slot.version_id || '',
                day_of_week: normalizeTimetableSlotDay(slot.day_of_week || slot.day || ''),
                start_time: normalizeTimetableTime(slot.start_time || ''),
                end_time: normalizeTimetableTime(slot.end_time || ''),
                room_name: slot.room_name || null,
                memo: slot.memo || null
            };
        })
        .filter(function(slot) { return slot.day_of_week && slot.start_time && slot.end_time; });
}

function getTimetableStatusLabel(status) {
    var map = {
        active: '운영 중 ✓',
        draft: '초안 ✓',
        scheduled: '적용 예정',
        cancelled: '취소됨 ✓',
        archived: '보관됨'
    };
    return map[String(status || '').toLowerCase()] || String(status || '-');
}

function shouldShowNextYearDraftPrompt(now) {
    var date = now instanceof Date ? now : new Date();
    return date.getMonth() === 11;
}

function getNextTimetableDraftYear(now) {
    var date = now instanceof Date ? now : new Date();
    return date.getFullYear() + 1;
}

function getTimetableDueDraftVersions(now) {
    var today = (now instanceof Date ? now : new Date()).toLocaleDateString('sv-SE');
    return getDraftTimetableVersionsForView().filter(function(version) {
        var effectiveFrom = String(version && version.effective_from || '').trim();
        return !!effectiveFrom && effectiveFrom <= today;
    });
}

async function loadTimetableVersionsForView(options) {
    options = options || {};
    var ui = ensureTimetableVersionUiState();
    var shouldRerender = false;
    if (!isTimetableAdminMode()) return [];
    if (ui.timetableVersionsLoading) return ui.timetableVersionsLoading;
    if (!options.force && ui.timetableVersionsLoaded && Array.isArray(ui.timetableVersions)) {
        return ui.timetableVersions;
    }

    ui.timetableVersionsLoading = api.get('timetable-versions')
        .then(function(res) {
            if (!res || res.success === false || !Array.isArray(res.timetable_versions)) {
                throw new Error((res && res.error) || 'timetable versions load failed');
            }
            var rows = Array.isArray(res && res.timetable_versions) ? res.timetable_versions : [];
            ui.timetableVersions = rows;
            ui.activeTimetableVersion = rows.find(function(version) { return String(version && version.status || '') === 'active'; }) || null;
            ui.draftTimetableVersions = getDraftTimetableVersionsForView();
            if (ui.selectedTimetableVersionId) {
                ui.selectedTimetableVersion = rows.find(function(version) {
                    return String(version && version.id || '') === String(ui.selectedTimetableVersionId || '');
                }) || ui.selectedTimetableVersion || null;
            }
            ui.timetableVersionsLoaded = true;
            ui.timetableVersionsLoadFailedAt = 0;
            ui.timetableVersionsLoadError = '';
            shouldRerender = true;
            return rows;
        })
        .catch(function(err) {
            console.warn('[loadTimetableVersionsForView] failed:', err);
            ui.timetableVersionsLoadFailedAt = Date.now();
            ui.timetableVersionsLoadError = String(err && err.message ? err.message : err || 'timetable versions load failed');
            return ui.timetableVersions || [];
        })
        .finally(function() {
            ui.timetableVersionsLoading = null;
            if (shouldRerender && typeof renderTimetable === 'function') renderTimetable();
        });

    return ui.timetableVersionsLoading;
}

function ensureTimetableVersionsLoaded() {
    var ui = ensureTimetableVersionUiState();
    var failedAt = Number(ui.timetableVersionsLoadFailedAt || 0);
    if (!isTimetableAdminMode()) return Promise.resolve([]);
    if (ui.timetableVersionsLoading) return ui.timetableVersionsLoading;
    if (ui.timetableVersionsLoaded && Array.isArray(ui.timetableVersions)) return Promise.resolve(ui.timetableVersions);
    if (failedAt && Date.now() - failedAt < 60000) return Promise.resolve(ui.timetableVersions || []);
    return loadTimetableVersionsForView();
}


async function openTimetableDraftVersion(versionId) {
    var ui = ensureTimetableVersionUiState();
    var targetId = String(versionId || '').trim();
    if (!targetId || !isTimetableAdminMode()) return;
    var res = await api.get('timetable-versions/' + encodeURIComponent(targetId));
    if (!res || res.success === false || !res.timetable_version) return;
    ui.timetableViewMode = 'draft';
    ui.selectedTimetableVersionId = res.timetable_version.id;
    ui.selectedTimetableVersion = res.timetable_version;
    ui.selectedTimetableVersionClasses = Array.isArray(res.timetable_version_classes) ? res.timetable_version_classes : [];
    ui.selectedTimetableVersionSlots = Array.isArray(res.timetable_version_slots) ? res.timetable_version_slots : [];
    ui.selectedTimetableVersionStudentAssignments = Array.isArray(res.timetable_version_student_assignments) ? res.timetable_version_student_assignments : [];
    ui.selectedTimetableVersionNewStudents = Array.isArray(res.timetable_version_new_students) ? res.timetable_version_new_students : [];
    ui.timetableDraftPreviewResult = null;
    renderTimetable();
}


function returnToActiveTimetableView() {
    var ui = ensureTimetableVersionUiState();
    ui.timetableViewMode = 'active';
    ui.selectedTimetableVersionId = null;
    ui.selectedTimetableVersion = null;
    ui.selectedTimetableVersionClasses = [];
    ui.selectedTimetableVersionSlots = [];
    ui.selectedTimetableVersionStudentAssignments = [];
    ui.selectedTimetableVersionNewStudents = [];
    ui.timetableDraftPreviewResult = null;
    renderTimetable();
}

function getTimetableDraftVersionClassRows(renderableOnly) {
    var ui = ensureTimetableVersionUiState();
    var rows = Array.isArray(ui.selectedTimetableVersionClasses) ? ui.selectedTimetableVersionClasses.slice() : [];
    if (!renderableOnly) return rows;
    return rows.filter(function(row) {
        var status = String(row && row.status || 'draft').trim().toLowerCase();
        return status !== 'excluded' && status !== 'graduating_excluded';
    });
}

function parseTimetableJsonValue(value) {
    if (!value) return {};
    if (typeof value === 'object') return value;
    if (typeof value !== 'string') return {};
    try {
        var parsed = JSON.parse(value);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        return {};
    }
}

function buildTimetableClassFromVersionClass(row) {
    row = row || {};
    var memo = parseTimetableJsonValue(row.memo);
    var versionClassId = String(row.id || row.version_class_id || '').trim();
    var sourceClassId = String(row.source_class_id || '').trim();
    return {
        id: versionClassId || sourceClassId,
        version_class_id: versionClassId || null,
        source_class_id: sourceClassId || null,
        name: row.name_snapshot || row.source_name || '',
        grade: row.next_grade || row.grade_snapshot || row.source_grade || '',
        subject: row.subject_snapshot || '수학',
        teacher_name: row.teacher_name_snapshot || '',
        schedule_days: row.schedule_days_snapshot || '',
        time_label: row.time_label_snapshot || '',
        day_group: memo.day_group || row.day_group || '',
        textbook: memo.textbook || row.textbook_snapshot || '',
        is_active: 1,
        timetable_version_status: row.status || 'draft',
        timetable_version_excluded_reason: row.excluded_reason || null,
        is_new: Number(row.is_new || 0),
        __timetable_version_class: 1
    };
}

function getTimetableDraftVersionClassByAnyId(classId) {
    var cid = String(classId || '').trim();
    if (!cid) return null;
    return getTimetableDraftVersionClassRows(false).find(function(row) {
        return String(row.id || '') === cid ||
            String(row.version_class_id || '') === cid ||
            String(row.source_class_id || '') === cid;
    }) || null;
}

function getTimetableClassIdentityValues(classId, cls) {
    var values = [];
    var push = function(value) {
        var text = String(value || '').trim();
        if (text && values.indexOf(text) === -1) values.push(text);
    };
    push(classId);
    if (cls) {
        push(cls.id);
        push(cls.version_class_id);
        push(cls.source_class_id);
    }
    var versionClass = getTimetableDraftVersionClassByAnyId(classId || (cls && cls.id));
    if (versionClass) {
        push(versionClass.id);
        push(versionClass.version_class_id);
        push(versionClass.source_class_id);
    }
    return values;
}

function isTimetableDraftClassRow(cls) {
    return !!(cls && (cls.__timetable_version_class || cls.version_class_id));
}

function getTimetableDraftRowClassId(row) {
    return String(row && (row.version_class_id || row.class_id || row.source_class_id) || '').trim();
}

function syncSelectedTimetableVersionSlotsInState(classId, slots) {
    var ui = ensureTimetableVersionUiState();
    var versionId = String(ui.selectedTimetableVersionId || '');
    var classRows = Array.isArray(slots) ? slots : [];
    var identities = getTimetableClassIdentityValues(classId);
    ui.selectedTimetableVersionSlots = (ui.selectedTimetableVersionSlots || [])
        .filter(function(row) {
            if (String(row.version_id || versionId) !== versionId) return true;
            var rowIds = [row.version_class_id, row.class_id, row.source_class_id].map(function(v) { return String(v || '').trim(); });
            return !rowIds.some(function(v) { return v && identities.indexOf(v) !== -1; });
        })
        .concat(classRows.map(function(row) {
            return Object.assign({}, row, { version_id: row.version_id || versionId });
        }));
}

function getTimetableDraftAssignmentRows(classId) {
    var ui = ensureTimetableVersionUiState();
    var rows = Array.isArray(ui.selectedTimetableVersionStudentAssignments) ? ui.selectedTimetableVersionStudentAssignments : [];
    if (!classId) return rows.slice();
    var identities = getTimetableClassIdentityValues(classId);
    return rows.filter(function(row) {
        var rowIds = [row.version_class_id, row.class_id, row.source_class_id].map(function(v) { return String(v || '').trim(); });
        return rowIds.some(function(v) { return v && identities.indexOf(v) !== -1; });
    });
}

function syncSelectedTimetableVersionStudentAssignmentsInState(assignments, classId) {
    var ui = ensureTimetableVersionUiState();
    var rows = Array.isArray(assignments) ? assignments.slice() : [];
    if (!classId) {
        ui.selectedTimetableVersionStudentAssignments = rows;
        return;
    }
    var identities = getTimetableClassIdentityValues(classId);
    ui.selectedTimetableVersionStudentAssignments = (ui.selectedTimetableVersionStudentAssignments || [])
        .filter(function(row) {
            var rowIds = [row.version_class_id, row.class_id, row.source_class_id].map(function(v) { return String(v || '').trim(); });
            return !rowIds.some(function(v) { return v && identities.indexOf(v) !== -1; });
        })
        .concat(rows);
}

function mergeTimetableArrayById(target, row) {
    if (!row || !row.id) return Array.isArray(target) ? target : [];
    var arr = Array.isArray(target) ? target.slice() : [];
    arr = arr.filter(function(item) { return String(item && item.id || '') !== String(row.id); });
    arr.push(row);
    return arr;
}

function syncTimetableDraftClassInState(versionClass) {
    if (!versionClass || !versionClass.id || typeof state === 'undefined') return;
    var ui = ensureTimetableVersionUiState();
    ui.selectedTimetableVersionClasses = mergeTimetableArrayById(ui.selectedTimetableVersionClasses, versionClass);
}

function syncTimetableDraftStudentInState(student) {
    if (!student || !student.id || typeof state === 'undefined') return;
    var ui = ensureTimetableVersionUiState();
    ui.selectedTimetableVersionNewStudents = mergeTimetableArrayById(ui.selectedTimetableVersionNewStudents, student);
    if (!state.db) state.db = {};
    state.db.timetable_students = mergeTimetableArrayById(state.db.timetable_students, student);
    if (state.allDb) state.allDb.timetable_students = mergeTimetableArrayById(state.allDb.timetable_students, student);
}

function getSelectedTimetableDraftSchoolYear() {
    var version = getSelectedTimetableVersionForView();
    return Number(version && version.school_year || 0);
}

function parseTimetableAssignmentMemo(row) {
    var raw = row && row.memo;
    if (!raw) return {};
    if (typeof raw === 'object') return raw;
    if (typeof raw !== 'string') return {};
    try {
        var parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('[parseTimetableAssignmentMemo] invalid memo JSON ignored');
        return {};
    }
}

function getTimetableAssignmentSnapshotName(row, memoInfo) {
    var memo = memoInfo || parseTimetableAssignmentMemo(row);
    return String(
        (row && row.student_name_snapshot) ||
        memo.student_name_snapshot ||
        memo.student_name ||
        memo.name ||
        ''
    ).trim();
}

function getTimetableAssignmentDisplayGrade(row, student, memoInfo) {
    var memo = memoInfo || parseTimetableAssignmentMemo(row);
    var raw =
        memo.next_grade ||
        (row && row.next_grade) ||
        (student && student.grade) ||
        memo.source_grade ||
        (row && row.source_grade) ||
        '';
    return normalizeTimetableGradeLabel(raw);
}

function normalizeTimetableGradeLabel(value) {
    var text = String(value || '').trim();
    if (/중\s*1|중1|예비\s*중\s*1/.test(text)) return '중1';
    if (/중\s*2|중2|예비\s*중\s*2/.test(text)) return '중2';
    if (/중\s*3|중3|예비\s*중\s*3/.test(text)) return '중3';
    if (/고\s*1|고1|예비\s*고\s*1/.test(text)) return '고1';
    if (/고\s*2|고2|예비\s*고\s*2/.test(text)) return '고2';
    if (/고\s*3|고3|예비\s*고\s*3/.test(text)) return '고3';
    return text;
}

function shouldHideGraduatingMiddleClassInDraft(cls, baseDate) {
    if (!isTimetableDraftMode() || !cls) return false;
    var now = baseDate || new Date();
    var draftYear = getSelectedTimetableDraftSchoolYear();
    if (now.getMonth() !== 11) return false;
    if (draftYear !== now.getFullYear() + 1) return false;
    if (Number(cls.is_active) === 0) return false;
    var assignmentRows = getTimetableDraftAssignmentRows(cls.id);
    var sourceGrades = assignmentRows
        .map(function(row) {
            var memoInfo = parseTimetableAssignmentMemo(row);
            return normalizeTimetableGradeLabel(memoInfo.source_grade || row.source_grade || '');
        })
        .filter(Boolean);
    if (sourceGrades.length && sourceGrades.length === assignmentRows.length) {
        return sourceGrades.every(function(grade) { return grade === '중3'; });
    }
    return false;
}

async function saveTimetableDraftEffectiveDate() {
    var ui = ensureTimetableVersionUiState();
    if (!isTimetableAdminMode() || !isTimetableDraftMode() || !ui.selectedTimetableVersionId) return;
    var input = document.getElementById('tt-draft-effective-from');
    var value = input ? String(input.value || '').trim() : '';
    if (!value) {
        if (typeof toast === 'function') toast('적용일을 선택하세요.', 'warn');
        return;
    }
    try {
        var res = await api.patch('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId), { effective_from: value });
        if (!res || res.success === false) throw new Error((res && res.error) || 'effective date save failed');
        ui.selectedTimetableVersion = res.timetable_version || Object.assign({}, ui.selectedTimetableVersion || {}, { effective_from: value });
        ui.timetableVersions = (ui.timetableVersions || []).map(function(version) {
            return String(version.id) === String(ui.selectedTimetableVersionId) ? ui.selectedTimetableVersion : version;
        });
        if (typeof toast === 'function') toast('적용일이 저장되었습니다.', 'info');
        renderTimetable();
    } catch (e) {
        console.error('[saveTimetableDraftEffectiveDate] failed:', e);
        if (typeof toast === 'function') toast('적용일 저장에 실패했습니다.', 'warn');
    }
}

function openTimetableDraftActivateConfirm() {
    var ui = ensureTimetableVersionUiState();
    var version = getSelectedTimetableVersionForView();
    if (!isTimetableAdminMode() || !isTimetableDraftMode() || !ui.selectedTimetableVersionId || !version) return;
    var effective = String(version.effective_from || '').trim() || '미지정';
    var isFuture = /^\d{4}-\d{2}-\d{2}$/.test(effective) && effective > getTimetableTodayString();
    var futureWarn = isFuture
        ? '<div style="padding:10px 12px; border:1px solid rgba(255,149,0,0.24); background:rgba(255,149,0,0.08); border-radius:8px; font-size:12px; font-weight:700; line-height:1.5;">적용일이 아직 지나지 않았습니다. 그래도 적용하면 지금 운영 시간표로 반영됩니다.</div>'
        : '';
    var body = '' +
        '<div style="display:flex; flex-direction:column; gap:12px; padding:0 4px 4px;">' +
            '<div style="font-size:14px; font-weight:800; color:var(--text); line-height:1.5;">' + apEscapeHtml(version.title || '시간표 초안') + '</div>' +
            '<div style="font-size:13px; font-weight:700; color:var(--secondary); line-height:1.5;">적용일: ' + apEscapeHtml(effective) + '</div>' +
            futureWarn +
            '<div style="padding:10px 12px; border:1px solid var(--border); background:var(--surface-2); border-radius:8px; font-size:12px; font-weight:700; color:var(--secondary); line-height:1.5;">적용하면 개편안의 반, 시간, 학생 배치가 운영 기준으로 반영됩니다.</div>' +
            '<div style="display:flex; justify-content:flex-end; gap:8px; padding-top:4px;">' +
                '<button class="btn" onclick="closeModal()">취소</button>' +
                '<button class="btn btn-primary" onclick="window.ttActivateDraftVersion()">개편 시간표 적용</button>' +
            '</div>' +
        '</div>';
    if (typeof showModalStep === 'function') showModalStep('개편 시간표 적용', body); else showModal('개편 시간표 적용', body);
}

async function confirmTimetableDraftActivate() {
    var ui = ensureTimetableVersionUiState();
    if (!isTimetableAdminMode() || !isTimetableDraftMode() || !ui.selectedTimetableVersionId) return;
    var actionBtn = document.querySelector('#modal-body .btn-primary');
    if (actionBtn && actionBtn.disabled) return;
    if (actionBtn) actionBtn.disabled = true;
    try {
        var res = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/activate', {});
        if (!res || res.success === false) throw new Error((res && res.error) || 'activate failed');
        if (typeof toast === 'function') toast('운영 시간표에 적용되었습니다.', 'info');
        if (typeof closeModal === 'function') closeModal(true);
        await loadTimetableVersionsForView({ force: true });
        returnToActiveTimetableView();
        if (typeof loadInitialData === 'function') loadInitialData();
    } catch (e) {
        console.error('[confirmTimetableDraftActivate] failed:', e);
        if (typeof toast === 'function') toast('개편 시간표 적용에 실패했습니다.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    }
}

function openTimetableDraftAddStudentModal(classId) {
    if (!isTimetableAdminMode() || !isTimetableDraftMode()) return;
    var cls = findTimetableClassById(classId);
    if (!cls) return;
    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.pendingTimetableDraftAddStudent = { classId: String(classId) };
    }
    showModal('학생 추가', '' +
        '<div style="display:flex; flex-direction:column; gap:10px;">' +
            '<div style="font-size:13px; font-weight:800; color:var(--text); line-height:1.5;">' + apEscapeHtml(cls.name || '') + '</div>' +
            '<input id="tt-draft-student-name" class="btn" placeholder="학생 이름" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<input id="tt-draft-student-school" class="btn" placeholder="학교" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<select id="tt-draft-student-grade" class="btn" style="background:var(--surface-2); border:none;">' +
                ['중1','중2','중3','고1','고2','고3'].map(function(g) { return '<option value="' + g + '"' + (String(cls.grade || '') === g ? ' selected' : '') + '>' + g + '</option>'; }).join('') +
            '</select>' +
            '<input id="tt-draft-student-pin" class="btn" placeholder="PIN은 비워두면 자동 발급" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<input id="tt-draft-student-memo" class="btn" placeholder="메모" style="text-align:left; background:var(--surface-2); border:none;">' +
        '</div>',
        '추가',
        confirmTimetableDraftAddStudent
    );
}

async function confirmTimetableDraftAddStudent() {
    var ui = ensureTimetableVersionUiState();
    var pending = (typeof state !== 'undefined' && state.ui) ? state.ui.pendingTimetableDraftAddStudent : null;
    var classId = pending ? String(pending.classId || '').trim() : '';
    if (!isTimetableAdminMode() || !isTimetableDraftMode() || !ui.selectedTimetableVersionId || !classId) return;
    var name = String((document.getElementById('tt-draft-student-name') || {}).value || '').trim();
    if (!name) {
        if (typeof toast === 'function') toast('학생 이름을 입력하세요.', 'warn');
        return;
    }
    var payload = {
        class_id: classId,
        version_class_id: classId,
        name: name,
        school_name: String((document.getElementById('tt-draft-student-school') || {}).value || '').trim(),
        grade: String((document.getElementById('tt-draft-student-grade') || {}).value || '').trim(),
        student_pin: String((document.getElementById('tt-draft-student-pin') || {}).value || '').trim(),
        memo: String((document.getElementById('tt-draft-student-memo') || {}).value || '').trim()
    };
    var actionBtn = document.querySelector('#modal-body .btn-primary');
    if (actionBtn && actionBtn.disabled) return;
    if (actionBtn) actionBtn.disabled = true;
    try {
        var res = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/students/draft-create', payload);
        if (!res || res.success === false || !res.student) throw new Error((res && (res.message || res.error)) || 'student create failed');
        syncTimetableDraftStudentInState(res.student);
        syncSelectedTimetableVersionStudentAssignmentsInState(res.timetable_version_student_assignments || [{
            version_id: ui.selectedTimetableVersionId,
            class_id: classId,
            version_class_id: classId,
            student_id: res.student.id,
            student_name_snapshot: res.student.name
        }], classId);
        if (state && state.ui) state.ui.pendingTimetableDraftAddStudent = null;
        if (typeof closeModal === 'function') closeModal(true);
        if (typeof toast === 'function') toast('학생이 추가되었습니다.', 'info');
        renderTimetable();
    } catch (e) {
        console.error('[confirmTimetableDraftAddStudent] failed:', e);
        if (typeof toast === 'function') toast('학생 추가에 실패했습니다.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    }
}

async function createNextYearTimetableDraft() {
    if (!isTimetableAdminMode()) return;
    var targetYear = getNextTimetableDraftYear(new Date());
    var res = await api.post('timetable-versions/create-next-draft', { school_year: targetYear });
    if (!res || res.success === false || !res.timetable_version) return;
    await loadTimetableVersionsForView({ force: true });
    await openTimetableDraftVersion(res.timetable_version.id);
}

async function runTimetableDraftScanPreview() {
    var ui = ensureTimetableVersionUiState();
    if (!isTimetableAdminMode() || !isTimetableDraftMode() || !ui.selectedTimetableVersionId) return;
    var res = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/scan-preview', {});
    if (!res || res.success === false) return;
    ui.timetableDraftPreviewResult = {
        version_id: res.version_id || ui.selectedTimetableVersionId,
        counts: res.counts || { student: 0, teacher: 0, room: 0, total: 0 },
        conflicts: Array.isArray(res.conflicts) ? res.conflicts : []
    };
    var counts = ui.timetableDraftPreviewResult.counts || {};
    if (typeof toast === 'function') {
        toast(
            '충돌 확인 결과: 학생 ' + Number(counts.student || 0) + '건 · 선생님 ' + Number(counts.teacher || 0) + '건 · 교실 ' + Number(counts.room || 0) + '건',
            Number(counts.student || 0) > 0 ? 'warn' : 'info'
        );
    }
    renderTimetable();
}

function getTimetableConflictDayLabel(day) {
    var map = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };
    var normalized = normalizeTimetableSlotDay(day);
    return map[normalized] || String(day || '-');
}

function getTimetableConflictClassLabel(classId) {
    var cls = findTimetableClassById(classId);
    var name = cls && cls.name ? cls.name : String(classId || '-');
    var teacher = cls && cls.teacher_name ? ' · ' + cls.teacher_name : '';
    return name + teacher;
}

function getTimetableConflictTargetLabel(conflict) {
    var type = String(conflict && conflict.conflict_type || '');
    var target = String(conflict && conflict.target_id || '').trim();
    if (type === 'student') {
        var student = findTimetableStudentById(target);
        return student && student.name ? student.name : (target || '학생 확인');
    }
    if (type === 'teacher') return target || '선생님 확인';
    if (type === 'room') return target || '교실 확인';
    return target || '대상 확인';
}

function getTimetableConflictTypeMeta(type) {
    if (type === 'student') {
        return {
            title: '학생 충돌',
            badge: '위험',
            tone: 'danger',
            guide: '같은 시간에 두 반 이상 배정된 학생이 있습니다. 운영 전 반드시 해소해야 합니다.',
            border: 'rgba(255,59,48,0.22)',
            bg: 'rgba(255,59,48,0.06)',
            color: '#C2410C'
        };
    }
    if (type === 'teacher') {
        return {
            title: '선생님 확인',
            badge: '운영 예외 가능',
            tone: 'warning',
            guide: '합반·클리닉·격주 수업 등 운영상 허용되는 경우도 있습니다. 학생 충돌과 구분해서 검토하세요.',
            border: 'rgba(255,149,0,0.24)',
            bg: 'rgba(255,149,0,0.08)',
            color: '#B45309'
        };
    }
    if (type === 'room') {
        return {
            title: '교실 확인',
            badge: '교실 배정 확인',
            tone: 'info',
            guide: '같은 교실에 시간이 겹치는 수업이 있습니다. 배정을 확인해주세요.',
            border: 'rgba(0,122,255,0.20)',
            bg: 'rgba(0,122,255,0.06)',
            color: 'var(--primary)'
        };
    }
    return {
        title: '기타 확인',
        badge: '확인',
        tone: 'info',
        guide: '시간표 충돌 후보입니다.',
        border: 'var(--border)',
        bg: 'var(--surface-2)',
        color: 'var(--text)'
    };
}

function groupTimetableDraftPreviewConflicts(conflicts) {
    var grouped = { student: [], teacher: [], room: [] };
    (Array.isArray(conflicts) ? conflicts : []).forEach(function(conflict) {
        var type = String(conflict && conflict.conflict_type || '');
        if (!grouped[type]) grouped[type] = [];
        grouped[type].push(conflict);
    });
    return grouped;
}

function buildTimetableConflictRowHtml(conflict) {
    var classA = getTimetableConflictClassLabel(conflict && conflict.class_a_id);
    var classB = getTimetableConflictClassLabel(conflict && conflict.class_b_id);
    var day = getTimetableConflictDayLabel(conflict && conflict.day_of_week);
    var time = String(conflict && conflict.overlap_start || '-').slice(0, 5) + '~' + String(conflict && conflict.overlap_end || '-').slice(0, 5);
    var target = getTimetableConflictTargetLabel(conflict);
    return '' +
        '<div style="padding:12px 0; border-top:1px solid rgba(0,0,0,0.06);">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:6px;">' +
                '<div style="font-size:13px; font-weight:800; color:var(--text); line-height:1.5;">' + apEscapeHtml(target) + '</div>' +
                '<div style="font-size:12px; font-weight:800; color:var(--secondary); white-space:nowrap; line-height:1.5;">' + apEscapeHtml(day + ' ' + time) + '</div>' +
            '</div>' +
            '<div style="display:grid; grid-template-columns:1fr; gap:6px; font-size:12px; font-weight:700; color:var(--secondary); line-height:1.5;">' +
                '<div><span style="color:var(--text);">반 A</span> · ' + apEscapeHtml(classA) + '</div>' +
                '<div><span style="color:var(--text);">반 B</span> · ' + apEscapeHtml(classB) + '</div>' +
            '</div>' +
        '</div>';
}

function buildTimetableConflictSectionHtml(type, rows) {
    var meta = getTimetableConflictTypeMeta(type);
    rows = Array.isArray(rows) ? rows : [];
    return '' +
        '<section style="border:1px solid ' + meta.border + '; background:' + meta.bg + '; border-radius:14px; padding:14px;">' +
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">' +
                '<div>' +
                    '<div style="font-size:14px; font-weight:900; color:var(--text); line-height:1.4;">' + apEscapeHtml(meta.title) + ' ' + apEscapeHtml(String(rows.length)) + '건</div>' +
                    '<div style="font-size:12px; font-weight:700; color:var(--secondary); line-height:1.5; margin-top:4px;">' + apEscapeHtml(meta.guide) + '</div>' +
                '</div>' +
                '<span class="std-badge" style="background:rgba(255,255,255,0.75); color:' + meta.color + '; border:1px solid ' + meta.border + '; white-space:nowrap;">' + apEscapeHtml(meta.badge) + '</span>' +
            '</div>' +
            (rows.length ? rows.map(buildTimetableConflictRowHtml).join('') : '<div style="padding:12px 0 2px; font-size:12px; color:var(--secondary); font-weight:700;">충돌 없음</div>') +
        '</section>';
}

function buildTimetableDraftConflictDetailsHtml() {
    var ui = ensureTimetableVersionUiState();
    var result = ui.timetableDraftPreviewResult || {};
    var counts = result.counts || { student: 0, teacher: 0, room: 0, total: 0 };
    var grouped = groupTimetableDraftPreviewConflicts(result.conflicts || []);
    var total = Number(counts.total || (result.conflicts || []).length || 0);
    var summaryTone = Number(counts.student || 0) > 0
        ? 'border:1px solid rgba(255,59,48,0.22); background:rgba(255,59,48,0.06); color:#C2410C;'
        : 'border:1px solid rgba(0,122,255,0.20); background:rgba(0,122,255,0.06); color:var(--primary);';
    return '' +
        '<div style="display:flex; flex-direction:column; gap:12px;">' +
            '<div style="padding:12px 14px; border-radius:14px; ' + summaryTone + ' font-size:13px; font-weight:800; line-height:1.5;">' +
                '총 ' + apEscapeHtml(String(total)) + '건 · 학생 ' + apEscapeHtml(String(Number(counts.student || 0))) + '건 · 선생님 ' + apEscapeHtml(String(Number(counts.teacher || 0))) + '건 · 교실 ' + apEscapeHtml(String(Number(counts.room || 0))) + '건' +
            '</div>' +
            buildTimetableConflictSectionHtml('student', grouped.student || []) +
            buildTimetableConflictSectionHtml('teacher', grouped.teacher || []) +
            buildTimetableConflictSectionHtml('room', grouped.room || []) +
        '</div>';
}

function openTimetableDraftConflictDetailsModal() {
    var ui = ensureTimetableVersionUiState();
    if (!ui.timetableDraftPreviewResult) {
        if (typeof toast === 'function') toast('충돌 확인을 먼저 실행해주세요.', 'warn');
        return;
    }
    if (typeof showModalStep === 'function') showModalStep('충돌 확인 결과', buildTimetableDraftConflictDetailsHtml()); else showModal('충돌 확인 결과', buildTimetableDraftConflictDetailsHtml());
}




function getTimetableHeaderActionButtonStyle() {
    return 'min-height:28px; padding:5px 9px; font-size:11px; font-weight:700; border-radius:999px; ' +
        'background:var(--surface); color:var(--secondary); border:1px solid var(--border); box-shadow:none;';
}


function buildTimetableVersionHeaderActionsHtml() {
    if (!isTimetableAdminMode()) return '';

    var draftVersions = getDraftTimetableVersionsForView();
    var selectedVersion = getSelectedTimetableVersionForView();
    var primaryDraft = draftVersions[0] || null;
    var nextYear = getNextTimetableDraftYear(new Date());
    var hasNextYearDraft = draftVersions.some(function(version) {
        return Number(version && version.school_year || 0) === nextYear;
    });
    var shouldShowCreate = shouldShowNextYearDraftPrompt(new Date()) && !hasNextYearDraft;
    var btnStyle = getTimetableHeaderActionButtonStyle();
    var html = '<div style="margin-left:auto; display:flex; align-items:center; justify-content:flex-end; gap:6px; min-width:0;">';

    if (isTimetableDraftMode() && selectedVersion) {
        html += '<span style="font-size:12px; font-weight:800; color:var(--text); white-space:nowrap;">' + apEscapeHtml(selectedVersion.title || '시간표 초안') + '</span>';
        html += '<span style="font-size:11px; font-weight:700; color:var(--secondary); white-space:nowrap;">상태: ' + apEscapeHtml(getTimetableStatusLabel(selectedVersion.status)) + '</span>';
        html += '<input id="tt-draft-effective-from" type="date" value="' + apEscapeHtml(selectedVersion.effective_from || '') + '" style="height:28px; width:132px; padding:0 8px; border:1px solid var(--border); border-radius:999px; background:var(--surface); font-size:11px; font-weight:800; color:var(--text);">';
        html += '<button class="btn" style="' + btnStyle + '" onclick="window.ttSaveDraftEffectiveDate()">저장</button>';
        html += '<button class="btn" style="' + btnStyle + '" onclick="window.ttReturnActiveView()">운영 시간표로 이동</button>';
        html += '<button class="btn" style="' + btnStyle + '" onclick="window.ttScanDraftPreview()">충돌 확인</button>';
        html += '<button class="btn btn-primary" style="min-height:28px; padding:5px 10px; font-size:11px; font-weight:800; border-radius:999px;" onclick="window.ttOpenDraftActivateConfirm()">개편 시간표 적용</button>';
    } else if (primaryDraft) {
        html += '<button class="btn" style="' + btnStyle + '" onclick="window.ttOpenDraftVersion(\'' + apEscapeHtml(String(primaryDraft.id || '')) + '\')">개편시간표</button>';
    } else if (shouldShowCreate) {
        html += '<button class="btn" style="' + btnStyle + '" onclick="window.ttCreateNextDraft()">개편시간표</button>';
    }

    html += '</div>';
    return html;
}

function buildTimetableVersionBannerHtml() {
    if (!isTimetableAdminMode()) return '';

    var ui = ensureTimetableVersionUiState();
    var dueVersions = getTimetableDueDraftVersions(new Date());
    var previewCounts = ui.timetableDraftPreviewResult && ui.timetableDraftPreviewResult.counts
        ? ui.timetableDraftPreviewResult.counts
        : null;
    var html = '';

    if (dueVersions.length > 0) {
        var dueVersion = dueVersions[0];
        html += '' +
            '<div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px 10px; padding:10px 12px; margin-bottom:10px; border:1px solid rgba(255,149,0,0.24); background:rgba(255,149,0,0.08); border-radius:10px;">' +
                '<div style="font-size:12px; font-weight:800; color:var(--text);">적용 예정일이 지났습니다. 초안을 확인하고 운영 시간표에 반영해주세요.</div>' +
                '<button class="btn" style="' + getTimetableHeaderActionButtonStyle() + '" onclick="window.ttOpenDraftVersion(\'' + apEscapeHtml(String(dueVersion.id || '')) + '\')">개편안 보기</button>' +
            '</div>';
    }

    if (previewCounts) {
        html += '' +
            '<div style="display:flex; flex-wrap:wrap; gap:8px 12px; padding:10px 12px; margin-bottom:10px; border:1px solid rgba(0,0,0,0.08); background:var(--surface); border-radius:10px; font-size:12px; font-weight:700; color:var(--text);">' +
                '<span>충돌 확인 결과</span>' +
                '<span>학생 충돌 ' + apEscapeHtml(String(Number(previewCounts.student || 0))) + '건</span>' +
                '<span>선생님 확인 ' + apEscapeHtml(String(Number(previewCounts.teacher || 0))) + '건</span>' +
                '<span>교실 확인 ' + apEscapeHtml(String(Number(previewCounts.room || 0))) + '건</span>' +
                (Number(previewCounts.student || 0) > 0 ? '<span style="color:#C2410C;">확인 필요</span>' : '') +
                (Number(previewCounts.total || 0) > 0 ? '<button class="btn" style="margin-left:auto; ' + getTimetableHeaderActionButtonStyle() + '" onclick="window.ttOpenDraftConflictDetails()">상세 보기</button>' : '') +
            '</div>';
    }

    return html;
}

window.ttOpenDraftVersion = function(versionId) {
    openTimetableDraftVersion(versionId);
};

window.ttReturnActiveView = function() {
    returnToActiveTimetableView();
};

window.ttCreateNextDraft = function() {
    createNextYearTimetableDraft();
};

window.ttScanDraftPreview = function() {
    runTimetableDraftScanPreview();
};

window.ttOpenDraftConflictDetails = function() {
    openTimetableDraftConflictDetailsModal();
};

window.ttSaveDraftEffectiveDate = function() {
    saveTimetableDraftEffectiveDate();
};

window.ttOpenDraftActivateConfirm = function() {
    openTimetableDraftActivateConfirm();
};

window.ttActivateDraftVersion = function() {
    confirmTimetableDraftActivate();
};


function getTimetableClassList() {
    if (isTimetableDraftMode()) {
        return getTimetableDraftVersionClassRows(true)
            .map(buildTimetableClassFromVersionClass)
            .filter(function(cls) { return !!(cls && cls.id); });
    }
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};
    var sources = [
        mainDb.timetable_classes,
        db.timetable_classes,
        allDb.timetable_classes,
        mainDb.classes,
        db.classes,
        allDb.classes
    ];
    var byId = {};
    sources.forEach(function(source) {
        (Array.isArray(source) ? source : []).forEach(function(row) {
            if (!row || !row.id) return;
            var id = String(row.id);
            byId[id] = Object.assign({}, byId[id] || {}, row);
        });
    });
    return Object.keys(byId).map(function(id) {
        return getTimetableMergedClass(byId[id]);
    });
}

function findTimetableClassById(classId) {
    var cid = String(classId || '');
    return getTimetableClassList().find(function(c) { return String(c.id) === cid; }) || null;
}

function findTimetableStudentById(studentId) {
    var sid = String(studentId || '');
    if (isTimetableDraftMode()) {
        var ui = ensureTimetableVersionUiState();
        var draftStudent = (ui.selectedTimetableVersionNewStudents || []).find(function(s) {
            return String(s.id || s.temp_student_id || '') === sid;
        });
        if (draftStudent) return draftStudent;
        var assignment = getTimetableDraftAssignmentRows().find(function(row) {
            return String(row.student_id || row.temp_student_id || '') === sid;
        });
        if (assignment) {
            var snapshot = parseTimetableJsonValue(assignment.student_snapshot);
            return {
                id: sid,
                name: (snapshot && snapshot.name) || getTimetableAssignmentSnapshotName(assignment) || assignment.student_name_snapshot || '',
                grade: (snapshot && snapshot.grade) || assignment.next_grade || assignment.source_grade || '',
                status: assignment.temp_student_id ? '입학예정' : ''
            };
        }
    }
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};
    var source = _ttFirstNonEmptyArray(
        mainDb.timetable_students,
        db.timetable_students,
        allDb.timetable_students,
        mainDb.students,
        db.students,
        allDb.students
    );
    return source.find(function(s) { return String(s.id) === sid; }) || null;
}


function getTimetableClassStudentRows() {
    if (isTimetableDraftMode()) {
        return getTimetableDraftAssignmentRows();
    }
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};
    return _ttFirstNonEmptyArray(
        mainDb.timetable_class_students,
        db.timetable_class_students,
        allDb.timetable_class_students,
        mainDb.class_students,
        db.class_students,
        allDb.class_students
    );
}

function getTimetableStudentClassIds(studentId) {
    var sid = String(studentId || '');
    var seen = {};
    return getTimetableClassStudentRows()
        .filter(function(row) { return String(row.student_id) === sid; })
        .map(function(row) { return getTimetableDraftRowClassId(row); })
        .filter(function(classId) {
            if (!classId || seen[classId]) return false;
            seen[classId] = true;
            return true;
        });
}

function getTimetableClassSlots(classId) {
    var cls = findTimetableClassById(classId);
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};
    var slots = [];

    if (isTimetableDraftSection(getTimetableSectionForClass(cls))) {
        slots = getTimetableDraftSlotRows(classId).map(function(slot) {
            return {
                day: String(slot.day_of_week || '').trim(),
                start: String(slot.start_time || '').trim(),
                end: String(slot.end_time || '').trim()
            };
        });
    } else {
        slots = _ttFirstNonEmptyArray(mainDb.class_time_slots, db.class_time_slots, allDb.class_time_slots)
            .filter(function(slot) { return String(slot.class_id) === String(classId); })
            .map(function(slot) {
                return {
                    day: String(slot.day_of_week || slot.day || '').trim(),
                    start: String(slot.start_time || '').trim(),
                    end: String(slot.end_time || '').trim()
                };
            })
            .filter(function(slot) { return slot.day && slot.start && slot.end; });
    }

    if (slots.length) return slots;
    if (isTimetableDraftSection(getTimetableSectionForClass(cls))) return [];
    if (!cls) return [];
    return getTimetableClassFallbackDays(cls).map(function(day) {
        return {
            day: day,
            start: getTimetablePeriodKey(cls),
            end: getTimetablePeriodKey(cls),
            fallback: true
        };
    }).filter(function(slot) { return slot.day && slot.start && slot.start !== 'unknown'; });
}

function ensureTimetableClassTimeSlotsLoaded() {
    if (typeof state === 'undefined' || !state.db || typeof api === 'undefined' || typeof api.get !== 'function') return;
    if (state.ui && state.ui.timetableSlotsLoaded) return;
    if (state.ui && state.ui.timetableSlotsLoading) return;
    if (Array.isArray(state.db.class_time_slots) && state.db.class_time_slots.length) return;

    if (!state.ui) state.ui = {};
    state.ui.timetableSlotsLoading = true;
    api.get('class-time-slots')
        .then(function(res) {
            var rows = Array.isArray(res && res.class_time_slots) ? res.class_time_slots : [];
            state.db.class_time_slots = rows;
            if (state.allDb) state.allDb.class_time_slots = rows;
            state.ui.timetableSlotsLoaded = true;
            state.ui.timetableSlotsLoading = false;
            if (typeof renderTimetable === 'function') renderTimetable();
        })
        .catch(function(e) {
            console.warn('[ensureTimetableClassTimeSlotsLoaded] failed:', e);
            state.ui.timetableSlotsLoading = false;
        });
}

function getTimetableClassSlotRows(classId) {
    var cls = findTimetableClassById(classId);
    if (isTimetableDraftSection(getTimetableSectionForClass(cls))) {
        return getTimetableDraftSlotRows(classId);
    }
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};
    return _ttFirstNonEmptyArray(mainDb.class_time_slots, db.class_time_slots, allDb.class_time_slots)
        .filter(function(slot) { return String(slot.class_id) === String(classId); })
        .map(function(slot) {
            return {
                id: slot.id || '',
                class_id: slot.class_id,
                day_of_week: normalizeTimetableSlotDay(slot.day_of_week || slot.day || ''),
                start_time: normalizeTimetableTime(slot.start_time || ''),
                end_time: normalizeTimetableTime(slot.end_time || ''),
                room_name: slot.room_name || null,
                memo: slot.memo || null
            };
        })
        .filter(function(slot) { return slot.day_of_week && slot.start_time && slot.end_time; });
}

function normalizeTimetableSlotDay(day) {
    var raw = String(day || '').trim().toLowerCase();
    var map = {
        '1': 'mon', '2': 'tue', '3': 'wed', '4': 'thu', '5': 'fri', '6': 'sat', '0': 'sun', '7': 'sun',
        monday: 'mon', mon: 'mon',
        tuesday: 'tue', tue: 'tue',
        wednesday: 'wed', wed: 'wed',
        thursday: 'thu', thu: 'thu',
        friday: 'fri', fri: 'fri',
        saturday: 'sat', sat: 'sat',
        sunday: 'sun', sun: 'sun'
    };
    return map[raw] || raw;
}

function normalizeTimetableTime(value) {
    var m = String(value || '').trim().match(/^(\d{1,2}):(\d{2})/);
    if (!m) return '';
    return String(Number(m[1])).padStart(2, '0') + ':' + m[2];
}

function getTimetableMiddlePeriodFromSlot(slot) {
    var start = normalizeTimetableTime(slot && slot.start_time);
    var end = normalizeTimetableTime(slot && slot.end_time);
    if ((start === '16:50' || start === '04:50') && (end === '18:20' || end === '06:20')) return '1교시';
    if ((start === '18:30' || start === '06:30') && (end === '20:00' || end === '08:00')) return '2교시';
    if ((start === '20:00' || start === '08:00') && (end === '21:30' || end === '09:30')) return '3교시';
    if (start === '16:50' || start === '04:50') return '1교시';
    if (start === '18:30' || start === '06:30') return '2교시';
    if (start === '20:00' || start === '08:00') return '3교시';
    return '';
}

function getTimetableMiddleGroupFromSlotDays(days) {
    var set = {};
    days.forEach(function(day) { set[normalizeTimetableSlotDay(day)] = true; });
    if (set.mon && set.wed && set.fri) return 'mwf';
    if (set.tue && set.thu && set.fri) return 'ttf';
    return '';
}

function getTimetableFallbackPlacementRows(cls) {
    var dg = getTimetableDayGroup(cls);
    var period = getTimetablePeriodKey(cls);
    if (TIMETABLE_MIDDLE_DAY_GROUPS.indexOf(dg) === -1 || period === 'unknown') return [];
    return [{
        class_id: cls.id,
        section: getTimetableSectionForClass(cls),
        day_group: dg,
        period_key: period,
        teacher_name: getTimetableClassTeacherName(cls),
        source: 'fallback'
    }];
}

function getTimetablePlacementRows(cls) {
    var slots = getTimetableClassSlotRows(cls && cls.id);
    if (!slots.length) {
        return getTimetableFallbackPlacementRows(cls);
    }

    var grouped = {};
    slots.forEach(function(slot) {
        var period = getTimetableMiddlePeriodFromSlot(slot);
        if (!period) return;
        var key = period;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(slot.day_of_week);
    });

    var rows = Object.keys(grouped).map(function(period) {
        var dg = getTimetableMiddleGroupFromSlotDays(grouped[period]);
        if (!dg) return null;
        return {
            class_id: cls.id,
            section: 'middle',
            day_group: dg,
            period_key: period,
            teacher_name: getTimetableClassTeacherName(cls),
            source: 'class_time_slots'
        };
    }).filter(Boolean);

    if (!rows.length) {
        return getTimetableFallbackPlacementRows(cls);
    }
    if (rows.length > 1 && typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        if (!state.ui.timetablePlacementWarnings) state.ui.timetablePlacementWarnings = {};
        state.ui.timetablePlacementWarnings[String(cls.id)] = rows.length;
    }
    return [rows[0]];
}

function getTimetableClassFallbackDays(cls) {
    var raw = String(cls && cls.schedule_days || '').trim();
    if (!raw) return [];
    return raw.split(/[,\s\/|]+/)
        .map(function(day) { return String(day || '').trim(); })
        .filter(Boolean);
}

function parseTimetableMinutes(value) {
    var m = String(value || '').match(/(\d{1,2}):(\d{2})/);
    if (!m) return null;
    return Number(m[1]) * 60 + Number(m[2]);
}

function doTimetableSlotsOverlap(a, b) {
    if (!a || !b || String(a.day) !== String(b.day)) return false;
    if (a.fallback || b.fallback) return String(a.start || '') === String(b.start || '');
    var aStart = parseTimetableMinutes(a.start);
    var aEnd = parseTimetableMinutes(a.end);
    var bStart = parseTimetableMinutes(b.start);
    var bEnd = parseTimetableMinutes(b.end);
    if (aStart === null || aEnd === null || bStart === null || bEnd === null) return false;
    return aStart < bEnd && bStart < aEnd;
}

function hasTimetableTransferTimeConflict(studentId, sourceClassId, targetClassId) {
    var targetSlots = getTimetableClassSlots(targetClassId);
    if (!targetSlots.length) return false;
    return getTimetableStudentClassIds(studentId)
        .filter(function(classId) {
            return String(classId) !== String(sourceClassId) && String(classId) !== String(targetClassId);
        })
        .some(function(classId) {
            var otherSlots = getTimetableClassSlots(classId);
            return targetSlots.some(function(targetSlot) {
                return otherSlots.some(function(otherSlot) {
                    return doTimetableSlotsOverlap(targetSlot, otherSlot);
                });
            });
        });
}


function handleTimetableStudentDragStart(event) {
    if (!isTimetableAdminMode()) {
        if (event && event.preventDefault) event.preventDefault();
        return false;
    }
    if (event && event.stopPropagation) event.stopPropagation();
    var el = event && event.currentTarget;
    if (!el || !event.dataTransfer) return true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({
        drag_type: 'student',
        student_id: el.getAttribute('data-student-id') || '',
        source_class_id: el.getAttribute('data-source-class-id') || ''
    }));
    return true;
}

function handleTimetableClassDragOver(event) {
    if (!isTimetableAdminMode()) return false;
    var targetClassId = event && event.currentTarget ? event.currentTarget.getAttribute('data-drop-class-id') : '';
    if (!targetClassId) return false;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('tt-drop-ready');
    return false;
}

function handleTimetableClassDragLeave(event) {
    if (event && event.currentTarget) event.currentTarget.classList.remove('tt-drop-ready');
}

function readTimetableDropPayload(event) {
    if (!event || !event.dataTransfer) return {};
    try {
        return JSON.parse(event.dataTransfer.getData('text/plain') || '{}') || {};
    } catch (e) {
        return {};
    }
}

async function assignTimetableDraftStudent(studentId, sourceClassId, targetClassId) {
    var ui = ensureTimetableVersionUiState();
    if (!ui.selectedTimetableVersionId || !studentId || !targetClassId) return false;
    try {
        var res = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/students/assign', {
            student_id: studentId,
            source_class_id: sourceClassId || '',
            target_class_id: targetClassId,
            version_class_id: targetClassId
        });
        if (!res || res.success === false) throw new Error((res && res.error) || 'draft assign failed');
        syncSelectedTimetableVersionStudentAssignmentsInState(res.timetable_version_student_assignments || []);
        if (typeof toast === 'function') toast('새학기 학생 배치가 변경되었습니다.', 'info');
        renderTimetable();
        return true;
    } catch (e) {
        console.error('[assignTimetableDraftStudent] failed:', e);
        if (typeof toast === 'function') toast('학생 배치에 실패했습니다.', 'warn');
        return false;
    }
}


function handleTimetableClassDrop(event) {
    if (!isTimetableAdminMode()) return false;
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.stopPropagation) event.stopPropagation();
    if (event && event.currentTarget) event.currentTarget.classList.remove('tt-drop-ready');

    var payload = readTimetableDropPayload(event);
    if (payload.drag_type === 'class-card') {
        var cellEl = event && event.currentTarget && event.currentTarget.closest
            ? event.currentTarget.closest('[data-timetable-cell]')
            : null;
        if (cellEl) {
            var target = getTimetableCellContext(cellEl);
            var movingClassId = String(payload.class_id || '').trim();
            var movingClass = findTimetableClassById(movingClassId);
            if (movingClassId && target && movingClass) {
                openTimetableClassMoveConfirmModal({ classId: movingClassId, cls: movingClass, target: target });
            }
        }
        return false;
    }

    if (payload.drag_type && payload.drag_type !== 'student') return false;
    var studentId = String(payload.student_id || '').trim();
    var sourceClassId = String(payload.source_class_id || '').trim();
    var targetClassId = event && event.currentTarget ? String(event.currentTarget.getAttribute('data-drop-class-id') || '').trim() : '';

    if (!studentId || !sourceClassId || !targetClassId) return false;
    if (sourceClassId === targetClassId) return false;

    var student = findTimetableStudentById(studentId);
    var sourceClass = findTimetableClassById(sourceClassId);
    var targetClass = findTimetableClassById(targetClassId);
    if (!student || !sourceClass || !targetClass) {
        if (typeof toast === 'function') toast('학생 또는 반 정보를 찾을 수 없습니다.', 'warn');
        return false;
    }

    if (isTimetableDraftMode()) {
        assignTimetableDraftStudent(studentId, sourceClassId, targetClassId);
        return false;
    }

    openTimetableTransferConfirmModal({
        studentId: studentId,
        sourceClassId: sourceClassId,
        targetClassId: targetClassId,
        student: student,
        sourceClass: sourceClass,
        targetClass: targetClass,
        hasConflict: hasTimetableTransferTimeConflict(studentId, sourceClassId, targetClassId)
    });
    return false;
}


function handleTimetableClassCardDragStart(event) {
    if (!isTimetableAdminMode()) {
        if (event && event.preventDefault) event.preventDefault();
        return false;
    }
    if (event && event.target && event.target.closest && event.target.closest('.tt-std-name, .tt-std-empty, .tt-std-slot')) {
        if (event.preventDefault) event.preventDefault();
        if (event.stopPropagation) event.stopPropagation();
        return false;
    }
    var el = event && event.currentTarget;
    if (!el || !event.dataTransfer) return true;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', JSON.stringify({
        drag_type: 'class-card',
        class_id: el.getAttribute('data-drag-class-id') || ''
    }));
    return true;
}

function handleTimetableCellDragOver(event) {
    if (!isTimetableAdminMode()) return false;
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    if (event.currentTarget) event.currentTarget.classList.add('tt-cell-drop-ready');
    return false;
}

function handleTimetableCellDragLeave(event) {
    if (event && event.currentTarget) event.currentTarget.classList.remove('tt-cell-drop-ready');
}

function getTimetableCellContext(el) {
    if (!el) return null;
    return {
        section: el.getAttribute('data-section') || '',
        day_group: el.getAttribute('data-day-group') || '',
        period_key: el.getAttribute('data-period-key') || '',
        teacher_name: el.getAttribute('data-teacher-name') || '',
        grade: el.getAttribute('data-grade') || '',
        start_time: el.getAttribute('data-start-time') || '',
        end_time: el.getAttribute('data-end-time') || ''
    };
}

function handleTimetableCellDrop(event) {
    if (!isTimetableAdminMode()) {
        if (typeof toast === 'function') toast('원장 계정으로만 이용할 수 있습니다.', 'warn');
        return false;
    }
    if (event && event.preventDefault) event.preventDefault();
    if (event && event.currentTarget) event.currentTarget.classList.remove('tt-cell-drop-ready');
    var payload = readTimetableDropPayload(event);
    if (payload.drag_type !== 'class-card') return false;
    var classId = String(payload.class_id || '').trim();
    var target = getTimetableCellContext(event.currentTarget);
    var cls = findTimetableClassById(classId);
    if (!classId || !target || !cls) return false;
    if (target.section !== 'middle') {
        if (typeof toast === 'function') toast('고등부 시간표 이동은 아직 지원되지 않습니다.', 'warn');
        return false;
    }
    openTimetableClassMoveConfirmModal({ classId: classId, cls: cls, target: target });
    return false;
}

function describeTimetablePlacement(row) {
    if (!row) return '-';
    var dg = row.day_group === 'mwf' ? '월수금' : (row.day_group === 'ttf' ? '화목금' : row.day_group || '-');
    return [dg, row.period_key || '-', row.teacher_name || '-'].join(' / ');
}

function openTimetableClassMoveConfirmModal(ctx) {
    var current = getTimetablePlacementRows(ctx.cls)[0] || null;
    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.pendingTimetableClassMove = {
            classId: ctx.classId,
            target: ctx.target
        };
    }
    showModal('반 시간표 이동 확인', '' +
        '<div style="display:flex; flex-direction:column; gap:12px; padding:0 4px 4px;">' +
            '<div style="font-size:14px; font-weight:800; color:var(--text);">' + apEscapeHtml(ctx.cls.name || '') + '</div>' +
            '<div style="display:grid; grid-template-columns:86px 1fr; gap:8px 10px; font-size:13px; line-height:1.5;">' +
                '<div style="color:var(--secondary); font-weight:700;">현재 위치</div>' +
                '<div style="font-weight:700;">' + apEscapeHtml(describeTimetablePlacement(current)) + '</div>' +
                '<div style="color:var(--secondary); font-weight:700;">이동할 위치</div>' +
                '<div style="font-weight:700;">' + apEscapeHtml(describeTimetablePlacement({ day_group: ctx.target.day_group, period_key: ctx.target.period_key, teacher_name: ctx.target.teacher_name })) + '</div>' +
                '<div style="color:var(--secondary); font-weight:700;">담당 선생님</div>' +
                '<div style="font-weight:700;">' + apEscapeHtml(ctx.target.teacher_name || '') + '</div>' +
            '</div>' +
            '<div style="padding:10px 12px; border:1px solid var(--border); background:var(--surface-2); color:var(--secondary); border-radius:8px; font-size:13px; font-weight:700; line-height:1.5;">저장 후 충돌 여부가 확인됩니다.</div>' +
            '<div style="display:flex; justify-content:flex-end; gap:8px; padding-top:4px;">' +
                '<button class="btn" onclick="closeModal(true)">취소</button>' +
                '<button class="btn btn-primary" onclick="confirmTimetableClassMove()">이동하기</button>' +
            '</div>' +
        '</div>');
}

function buildTimetableSlotsForCell(classId, target) {
    var time = TIMETABLE_MIDDLE_PERIOD_TIMES[target.period_key] || null;
    var days = TIMETABLE_MIDDLE_DAY_GROUP_DAYS[target.day_group] || [];
    if (!time || !days.length) return [];
    return days.map(function(day) {
        return {
            class_id: classId,
            day_of_week: day,
            start_time: time.start,
            end_time: time.end,
            room_name: null,
            memo: isTimetableDraftMode() ? 'draft timetable placement' : 'timetable cell placement'
        };
    });
}

function syncTimetableClassSlotsInState(classId, slots) {
    if (typeof state === 'undefined' || !state.db) return;
    var applyRows = function(dbObj) {
        if (!dbObj) return;
        var existing = Array.isArray(dbObj.class_time_slots) ? dbObj.class_time_slots : [];
        dbObj.class_time_slots = existing.filter(function(row) {
            return String(row.class_id) !== String(classId);
        }).concat(slots || []);
    };
    applyRows(state.db);
    if (state.allDb) applyRows(state.allDb);
}

function syncTimetableClassCompatInState(classId, target) {
    if (typeof state === 'undefined' || !state.db) return;
    var days = target.day_group === 'mwf' ? '1,3,5' : '2,4,5';
    var time = TIMETABLE_MIDDLE_PERIOD_TIMES[target.period_key] || {};
    var patchClass = function(dbObj) {
        if (!dbObj || !Array.isArray(dbObj.classes)) return;
        dbObj.classes.forEach(function(cls) {
            if (String(cls.id) === String(classId)) {
                cls.schedule_days = days;
                cls.day_group = target.day_group;
                cls.time_label = time.legacy || cls.time_label || '';
                cls.teacher_name = target.teacher_name || cls.teacher_name || '';
            }
        });
    };
    patchClass(state.db);
    if (state.allDb) patchClass(state.allDb);
}

async function updateTimetableClassCompat(classId, target) {
    var cls = findTimetableClassById(classId);
    if (!cls || typeof api === 'undefined' || typeof api.patch !== 'function') return;
    var time = TIMETABLE_MIDDLE_PERIOD_TIMES[target.period_key] || {};
    await api.patch('classes/' + encodeURIComponent(classId), {
        name: cls.name || '',
        grade: cls.grade || '',
        subject: cls.subject || '수학',
        teacher_name: target.teacher_name || cls.teacher_name || '',
        schedule_days: target.day_group === 'mwf' ? '1,3,5' : '2,4,5',
        day_group: target.day_group,
        time_label: time.legacy || cls.time_label || ''
    });
}

async function confirmTimetableClassMove() {
    if (!isTimetableAdminMode()) {
        if (typeof toast === 'function') toast('원장 계정으로만 이용할 수 있습니다.', 'warn');
        return;
    }
    var pending = (typeof state !== 'undefined' && state.ui) ? state.ui.pendingTimetableClassMove : null;
    if (!pending || !pending.classId || !pending.target) return;
    var slots = buildTimetableSlotsForCell(pending.classId, pending.target);
    if (!slots.length) {
        if (typeof toast === 'function') toast('이동에 실패했습니다. 다시 시도해주세요.', 'warn');
        return;
    }
    var actionBtn = document.querySelector('#modal-body .btn-primary');
    if (actionBtn && actionBtn.disabled) return;
    if (actionBtn) actionBtn.disabled = true;

    try {
        var result = null;
        if (isTimetableDraftMode()) {
            var ui = ensureTimetableVersionUiState();
            if (!ui.selectedTimetableVersionId) throw new Error('draft version id missing');
            result = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/slots/replace-class-slots', {
                class_id: pending.classId,
                version_class_id: pending.classId,
                slots: slots
            });
        } else {
            result = await api.post('class-time-slots/replace-class-slots', {
                class_id: pending.classId,
                slots: slots
            });
        }
        if (!result || !result.success) throw new Error((result && result.error) || 'replace failed');
        if (isTimetableDraftMode()) {
            syncSelectedTimetableVersionSlotsInState(pending.classId, result.timetable_version_slots || slots);
        } else {
            await updateTimetableClassCompat(pending.classId, pending.target);
            syncTimetableClassSlotsInState(pending.classId, result.class_time_slots || slots);
            syncTimetableClassCompatInState(pending.classId, pending.target);
            try {
                var scan = await api.post('timetable-conflicts/scan', {});
                if (scan && Number(scan.count || 0) > 0 && typeof toast === 'function') toast('시간 충돌이 감지되었습니다.', 'warn');
            } catch (scanError) {
                console.warn('[confirmTimetableClassMove] conflict scan failed:', scanError);
            }
        }
        if (state && state.ui) state.ui.pendingTimetableClassMove = null;
        if (typeof closeModal === 'function') closeModal(true);
        if (typeof toast === 'function') toast(isTimetableDraftMode() ? '초안이 저장되었습니다.' : '이동이 완료되었습니다.', 'info');
        renderTimetable();
    } catch (e) {
        console.error('[confirmTimetableClassMove] failed:', e);
        if (typeof toast === 'function') toast(isTimetableDraftMode() ? '초안 저장에 실패했습니다.' : '이동에 실패했습니다. 다시 시도해주세요.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    }
}

function buildTimetableCellAttrs(section, data) {
    if (!isTimetableAdminMode()) return '';
    return ' data-timetable-cell="1"' +
        ' data-section="' + apEscapeHtml(section || '') + '"' +
        ' data-day-group="' + apEscapeHtml(data.day_group || '') + '"' +
        ' data-period-key="' + apEscapeHtml(data.period_key || '') + '"' +
        ' data-teacher-name="' + apEscapeHtml(data.teacher_name || '') + '"' +
        ' data-grade="' + apEscapeHtml(data.grade || '') + '"' +
        ' data-start-time="' + apEscapeHtml(data.start_time || '') + '"' +
        ' data-end-time="' + apEscapeHtml(data.end_time || '') + '"' +
        ' ondragover="handleTimetableCellDragOver(event)"' +
        ' ondragleave="handleTimetableCellDragLeave(event)"' +
        ' ondrop="handleTimetableCellDrop(event)"';
}


function buildTimetableAddClassButton(cell) {
    if (!isTimetableAdminMode() || cell.section !== 'middle') return '';
    var encoded = encodeURIComponent(JSON.stringify(cell));
    return '<button class="tt-add-class-cell" onclick="event.stopPropagation();openTimetableAddClassModal(\'' + encoded + '\')">+ 반 추가</button>';
}


function openTimetableAddClassModal(encodedCell) {
    if (!isTimetableAdminMode()) return;
    var cell = null;
    try {
        cell = JSON.parse(decodeURIComponent(encodedCell || ''));
    } catch (e) {
        cell = null;
    }
    if (!cell) return;
    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.pendingTimetableAddClass = cell;
    }
    var suggested = suggestTimetableClassName('중1');
    var dgLabel = cell.day_group === 'mwf' ? '월수금' : '화목금';
    showModal('반 추가', '' +
        '<div style="display:flex; flex-direction:column; gap:10px;">' +
            '<input id="tt-add-class-name" class="btn" value="' + apEscapeHtml(suggested) + '" placeholder="반 이름" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<select id="tt-add-class-grade" class="btn" style="background:var(--surface-2); border:none;">' +
                ['중1','중2','중3'].map(function(g) { return '<option value="' + g + '"' + (g === '중1' ? ' selected' : '') + '>' + g + '</option>'; }).join('') +
            '</select>' +
            '<input id="tt-add-class-teacher" class="btn" value="' + apEscapeHtml(cell.teacher_name || '') + '" placeholder="담당 선생님" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<input id="tt-add-class-subject" class="btn" value="수학" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">' +
            '<div style="display:grid; grid-template-columns:80px 1fr; gap:8px 10px; font-size:13px; font-weight:700; color:var(--secondary);">' +
                '<div>요일 그룹</div><div style="color:var(--text);">' + apEscapeHtml(dgLabel) + '</div>' +
                '<div>교시</div><div style="color:var(--text);">' + apEscapeHtml(cell.period_key || '') + '</div>' +
            '</div>' +
        '</div>',
        '추가',
        confirmTimetableAddClass
    );
}

function suggestTimetableClassName(grade) {
    var db = _getAllDb();
    var existing = (db.classes || []).map(function(c) { return String(c.name || ''); });
    var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    for (var i = 0; i < letters.length; i++) {
        var name = String(grade || '중1') + letters[i];
        if (existing.indexOf(name) === -1) return name;
    }
    return '';
}


async function confirmTimetableAddClass() {
    if (!isTimetableAdminMode()) return;
    var cell = (typeof state !== 'undefined' && state.ui) ? state.ui.pendingTimetableAddClass : null;
    if (!cell) return;
    var name = (document.getElementById('tt-add-class-name') || {}).value || '';
    var grade = (document.getElementById('tt-add-class-grade') || {}).value || '중1';
    var teacherName = (document.getElementById('tt-add-class-teacher') || {}).value || cell.teacher_name || '';
    var subject = (document.getElementById('tt-add-class-subject') || {}).value || '수학';
    name = String(name).trim();
    if (!name) {
        if (typeof toast === 'function') toast('반 이름을 입력하세요.', 'warn');
        return;
    }
    var time = TIMETABLE_MIDDLE_PERIOD_TIMES[cell.period_key] || {};
    var payload = {
        name: name,
        grade: grade,
        subject: subject,
        teacher_name: teacherName,
        schedule_days: cell.day_group === 'mwf' ? '1,3,5' : '2,4,5',
        day_group: cell.day_group,
        time_label: time.legacy || '',
        is_active: isTimetableDraftMode() ? 0 : 1,
        timetable_cell_create: true
    };
    var actionBtn = document.querySelector('#modal-body .btn-primary');
    if (actionBtn && actionBtn.disabled) return;
    if (actionBtn) actionBtn.disabled = true;
    try {
        var slots;
        var created;
        var classId;
        if (isTimetableDraftMode()) {
            var ui = ensureTimetableVersionUiState();
            if (!ui.selectedTimetableVersionId) throw new Error('selected version missing');
            classId = 'preview_' + Date.now();
            slots = buildTimetableSlotsForCell(classId, cell);
            created = await api.post('timetable-versions/' + encodeURIComponent(ui.selectedTimetableVersionId) + '/classes/draft-create', Object.assign({}, payload, { slots: slots }));
            classId = created && (created.id || (created.class && created.class.id));
            if (!created || !created.success || !classId) throw new Error((created && created.error) || 'draft class create failed');
            syncTimetableDraftClassInState(created.timetable_version_class || created.class || Object.assign({ id: classId }, payload));
            syncSelectedTimetableVersionSlotsInState(classId, created.timetable_version_slots || []);
            syncSelectedTimetableVersionStudentAssignmentsInState((getTimetableDraftAssignmentRows()).concat(created.timetable_version_student_assignments || []));
        } else {
            created = await api.post('classes', payload);
            classId = created && (created.id || (created.class && created.class.id));
            if (!created || !created.success || !classId) throw new Error((created && created.error) || 'class create failed');
            slots = buildTimetableSlotsForCell(classId, cell);
            var slotResult = await api.post('class-time-slots/replace-class-slots', { class_id: classId, slots: slots });
            if (!slotResult || !slotResult.success) throw new Error((slotResult && slotResult.error) || 'slot create failed');
            if (!state.db.classes) state.db.classes = [];
            state.db.classes.push(created.class || Object.assign({ id: classId }, payload));
            syncTimetableClassSlotsInState(classId, slotResult.class_time_slots || slots);
            try {
                var scan = await api.post('timetable-conflicts/scan', {});
                if (scan && Number(scan.count || 0) > 0 && typeof toast === 'function') toast('시간 충돌이 감지되었습니다.', 'warn');
            } catch (scanError) {
                console.warn('[confirmTimetableAddClass] conflict scan failed:', scanError);
            }
        }
        if (state && state.ui) state.ui.pendingTimetableAddClass = null;
        if (typeof closeModal === 'function') closeModal(true);
        if (typeof toast === 'function') toast(isTimetableDraftMode() ? '개편안 반이 추가되었습니다.' : '이동이 완료되었습니다.', 'info');
        renderTimetable();
    } catch (e) {
        console.error('[confirmTimetableAddClass] failed:', e);
        if (typeof toast === 'function') toast('이동에 실패했습니다. 다시 시도해주세요.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    }
}

function openTimetableTransferConfirmModal(ctx) {
    var warningHtml = ctx.hasConflict
        ? '<div style="padding:10px 12px; border:1px solid rgba(255,149,0,0.25); background:rgba(255,149,0,0.08); color:var(--text); border-radius:8px; font-size:13px; font-weight:700; line-height:1.5;">시간 충돌이 있을 수 있습니다. 이동 전 확인해주세요.</div>'
        : '<div style="padding:10px 12px; border:1px solid var(--border); background:var(--surface-2); color:var(--secondary); border-radius:8px; font-size:13px; font-weight:700; line-height:1.5;">시간 충돌 없음</div>';

    showModal('전반 확인', '' +
        '<div style="display:flex; flex-direction:column; gap:12px; padding:0 4px 4px;">' +
            '<div style="font-size:14px; font-weight:700; color:var(--text); line-height:1.5;">' + apEscapeHtml(ctx.student.name || '') + '</div>' +
            '<div style="display:grid; grid-template-columns:78px 1fr; gap:8px 10px; font-size:13px; line-height:1.5;">' +
                '<div style="color:var(--secondary); font-weight:700;">현재 반</div>' +
                '<div style="color:var(--text); font-weight:700;">' + apEscapeHtml(ctx.sourceClass.name || '') + '</div>' +
                '<div style="color:var(--secondary); font-weight:700;">이동할 반</div>' +
                '<div style="color:var(--text); font-weight:700;">' + apEscapeHtml(ctx.targetClass.name || '') + '</div>' +
            '</div>' +
            warningHtml +
            '<div style="display:flex; justify-content:flex-end; gap:8px; padding-top:4px;">' +
                '<button class="btn" onclick="closeModal(true)">취소</button>' +
                '<button class="btn btn-primary" onclick="confirmTimetableStudentTransfer()">전반하기</button>' +
            '</div>' +
        '</div>');

    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.pendingTimetableTransfer = {
            studentId: ctx.studentId,
            sourceClassId: ctx.sourceClassId,
            targetClassId: ctx.targetClassId
        };
    }
}

function updateTimetableTransferClassRows(tableName, studentId, sourceClassId, targetClassId, serverRows, options) {
    options = options || {};
    if (typeof state === 'undefined' || !state.db) return;
    var skipCreateWhenEmpty = !!options.skipCreateWhenEmpty;
    var sid = String(studentId || '');
    var sourceCid = String(sourceClassId || '');
    var targetCid = String(targetClassId || '');
    var applyRows = function(dbObj) {
        if (!dbObj) return;
        if (skipCreateWhenEmpty && (!Array.isArray(dbObj[tableName]) || dbObj[tableName].length === 0)) return;
        var existing = Array.isArray(dbObj[tableName]) ? dbObj[tableName] : [];
        var otherRows = existing.filter(function(row) {
            if (String(row.student_id) !== sid) return true;
            return String(row.class_id) !== sourceCid && String(row.class_id) !== targetCid;
        });
        var targetRow = Array.isArray(serverRows)
            ? serverRows.find(function(row) { return String(row.student_id) === sid && String(row.class_id) === targetCid; })
            : null;
        dbObj[tableName] = otherRows.concat(targetRow || { class_id: targetCid, student_id: sid });
    };

    applyRows(state.db);
    if (state.allDb) applyRows(state.allDb);
}

function updateTimetableTransferEnrollmentRows(studentId, serverRows) {
    if (typeof state === 'undefined' || !state.db || !Array.isArray(serverRows)) return;
    var sid = String(studentId || '');
    var applyRows = function(dbObj) {
        if (!dbObj) return;
        var existing = Array.isArray(dbObj.student_enrollments) ? dbObj.student_enrollments : [];
        dbObj.student_enrollments = existing
            .filter(function(row) { return String(row.student_id || '') !== sid; })
            .concat(serverRows);
    };
    applyRows(state.db);
    if (state.allDb) applyRows(state.allDb);
}

async function confirmTimetableStudentTransfer() {
    if (!isTimetableAdminMode() || isTimetableDraftMode()) {
        if (typeof toast === 'function') toast('원장모드에서만 전반할 수 있습니다.', 'warn');
        return;
    }

    var pending = (typeof state !== 'undefined' && state.ui) ? state.ui.pendingTimetableTransfer : null;
    var studentId = pending ? String(pending.studentId || '').trim() : '';
    var sourceClassId = pending ? String(pending.sourceClassId || '').trim() : '';
    var targetClassId = pending ? String(pending.targetClassId || '').trim() : '';
    if (!studentId || !sourceClassId || !targetClassId || sourceClassId === targetClassId) {
        if (typeof toast === 'function') toast('전반에 실패했습니다. 다시 시도해주세요.', 'warn');
        return;
    }

    var actionBtn = document.querySelector('#modal-body .btn-primary');
    if (actionBtn && actionBtn.disabled) return;
    if (actionBtn) actionBtn.disabled = true;
    if (typeof toast === 'function') toast('전반 처리 중…', 'info');

    try {
        var result = await api.post('enrollments/transfer', {
            student_id: studentId,
            source_class_id: sourceClassId,
            target_class_id: targetClassId,
            memo: '전체시간표 드래그 전반'
        });

        if (result && result.success) {
            updateTimetableTransferClassRows('class_students', studentId, sourceClassId, targetClassId, result.class_students);
            updateTimetableTransferClassRows('timetable_class_students', studentId, sourceClassId, targetClassId, null, { skipCreateWhenEmpty: true });
            updateTimetableTransferEnrollmentRows(studentId, result.student_enrollments);
            if (state && state.ui) state.ui.pendingTimetableTransfer = null;
            if (typeof closeModal === 'function') closeModal(true);
            if (typeof toast === 'function') toast('전반이 완료되었습니다.', 'info');
            renderTimetable();
            return;
        }

        if (typeof toast === 'function') toast('전반에 실패했습니다. 다시 시도해주세요.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    } catch (e) {
        console.error('[confirmTimetableStudentTransfer] failed:', e);
        if (typeof toast === 'function') toast('전반에 실패했습니다. 다시 시도해주세요.', 'warn');
        if (actionBtn) actionBtn.disabled = false;
    }
}

function getTimetableDateTitle() {
    var now = new Date();
    var yy = String(now.getFullYear()).slice(2);
    var mm = now.getMonth() + 1;
    if (isTimetableDraftMode()) {
        var version = getSelectedTimetableVersionForView();
        var effectiveFrom = String(version && version.effective_from || '').trim();
        var targetYear = Number(version && version.school_year || 0) || now.getFullYear() + 1;
        var targetMonth = 1;
        var matched = effectiveFrom.match(/^(\d{4})-(\d{2})-/);
        if (matched) {
            targetYear = Number(matched[1]) || targetYear;
            targetMonth = Number(matched[2]) || targetMonth;
        }
        return 'AP수학 시간표 (' + String(targetYear).slice(2) + '년 ' + targetMonth + '월 예정)';
    }
    return 'AP수학 시간표 (' + yy + '년 ' + mm + '월)';
}

function getTimetableSectionForClass(cls) {
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    if (/고1|고2|고3|고등/.test(text)) return 'high';
    return 'middle';
}

function getTimetableHighGrade(cls) {
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    if (/고3/.test(text)) return '고3';
    if (/고2/.test(text)) return '고2';
    if (/고1/.test(text)) return '고1';
    return '고등';
}

function getTimetableDayGroup(cls) {
    var days = String(cls.schedule_days || '');
    if (!days) return 'custom';

    var arr = days.split(',').map(function(d) { return d.trim(); }).filter(Boolean);
    var has1 = arr.indexOf('1') !== -1;
    var has2 = arr.indexOf('2') !== -1;
    var has3 = arr.indexOf('3') !== -1;
    var has4 = arr.indexOf('4') !== -1;

    if (has1 && has3) return 'mwf';
    if (has2 && has4) return 'ttf';
    return 'custom';
}

function getTimetablePeriodKey(cls) {
    var tl = String(cls.time_label || '');
    if (!tl || tl === '시간 미지정') return 'unknown';

    if (tl.indexOf('1교시') !== -1 || tl.indexOf('4:50') !== -1 || tl.indexOf('4:50~6:20') !== -1) return '1교시';
    if (tl.indexOf('2교시') !== -1 || tl.indexOf('6:30') !== -1 || tl.indexOf('6:30~8:00') !== -1) return '2교시';
    if (tl.indexOf('3교시') !== -1 || tl.indexOf('8:00') !== -1 || tl.indexOf('8:00~9:30') !== -1) return '3교시';

    if (tl.indexOf('4:20') !== -1 || tl.indexOf('4:30') !== -1 || tl.indexOf('5:00') !== -1) return '1교시';
    if (tl.indexOf('6:00') !== -1) return '2교시';
    if (tl.indexOf('7:40') !== -1) return '3교시';

    return 'unknown';
}

function getTimetableActiveTextbooks(classId) {
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};

    var textbookSource =
        mainDb.timetable_class_textbooks ||
        db.timetable_class_textbooks ||
        allDb.timetable_class_textbooks ||
        mainDb.class_textbooks ||
        db.class_textbooks ||
        allDb.class_textbooks ||
        [];

    var books = textbookSource.filter(function(tb) {
        return String(tb.class_id) === String(classId) && tb.status === 'active';
    });

    if (books.length > 0) {
        return books.map(function(tb) { return String(tb.title || '').trim(); }).filter(Boolean);
    }

    var classSource =
        mainDb.timetable_classes ||
        db.timetable_classes ||
        allDb.timetable_classes ||
        mainDb.classes ||
        db.classes ||
        allDb.classes ||
        [];

    var cls = classSource.find(function(c) { return String(c.id) === String(classId); });
    if (cls && cls.textbook) return [cls.textbook];
    return ['교재 미등록'];
}

function getTimetableRecentProgress(classId) {
    var db = _getAllDb();
    var records = (db.class_daily_records || [])
        .filter(function(r) { return String(r.class_id) === String(classId); })
        .sort(function(a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });

    if (records.length === 0) return null;

    var latest = records[0];
    var progresses = (db.class_daily_progress || [])
        .filter(function(p) { return String(p.record_id) === String(latest.id); });

    if (progresses.length === 0) return null;

    var items = progresses.map(function(p) {
        var t = String(p.textbook_title_snapshot || '').trim();
        var prog = String(p.progress_text || '').trim();
        var cleanProg = prog.replace(/^\[단원선택\][^\n]*\n?/, '').trim();
        if (t && cleanProg) return t + ' ' + cleanProg;
        return t || cleanProg;
    }).filter(Boolean);

    return items.length > 0 ? { date: latest.date, text: items.join(' / ') } : null;
}

// ────────────────────────────────────────────
// 학생 정보 및 배지
// ────────────────────────────────────────────

function _ttNormalizeDateString(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    var m = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!m) return '';
    return [m[1], String(m[2]).padStart(2, '0'), String(m[3]).padStart(2, '0')].join('-');
}

function _ttGetStudentJoinDate(s) {
    if (!s) return '';
    return _ttNormalizeDateString(
        s.join_date || s.joined_at || s.enrolled_at || s.enrollment_date ||
        s.registered_at || s.registration_date || s.created_at || s.createdAt || ''
    );
}

function _ttIsStudentNewByJuneFirst(s) {
    var joinDate = _ttGetStudentJoinDate(s);
    if (!joinDate) return false;
    var year = new Date().getFullYear();
    return joinDate >= String(year) + '-06-01';
}

function _ttIsStudentNew(s) {
    if (!s) return false;
    if (typeof isStudentNewMember === 'function' && isStudentNewMember(s)) return true;
    if (String(s.memo || '').indexOf('#신입') !== -1) return true;
    return _ttIsStudentNewByJuneFirst(s);
}

function _ttIsStudentLeave(s) {
    if (typeof isStudentOnLeave === 'function') return isStudentOnLeave(s);
    return !!(s && (s.status === '휴원' || String(s.memo || '').indexOf('#휴원') !== -1));
}

function _ttFirstNonEmptyArray() {
    for (var i = 0; i < arguments.length; i++) {
        if (Array.isArray(arguments[i]) && arguments[i].length > 0) return arguments[i];
    }
    return [];
}


function getTimetableClassStudentsWithInfo(classId) {
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};

    var csSource = getTimetableClassStudentRows();

    var stSources = [
        mainDb.timetable_students,
        db.timetable_students,
        allDb.timetable_students,
        mainDb.students,
        db.students,
        allDb.students
    ];
    var studentMap = {};
    stSources.forEach(function(source) {
        (Array.isArray(source) ? source : []).forEach(function(s) {
            if (!s || !s.id) return;
            var id = String(s.id);
            studentMap[id] = Object.assign({}, studentMap[id] || {}, s);
        });
    });
    var stSource = Object.keys(studentMap).map(function(id) { return studentMap[id]; });

    if (isTimetableDraftMode()) {
        return getTimetableDraftAssignmentRows(classId)
            .map(function(row) {
                var studentId = String(row.student_id || row.temp_student_id || '');
                var snapshot = parseTimetableJsonValue(row.student_snapshot);
                var s = studentMap[studentId] || (snapshot && snapshot.name ? Object.assign({ id: studentId, status: '입학예정' }, snapshot) : null);
                var memoInfo = parseTimetableAssignmentMemo(row);
                var name = String(
                    (s && s.name) ||
                    getTimetableAssignmentSnapshotName(row, memoInfo) ||
                    '이름 없음'
                ).trim();
                var displayGrade = getTimetableAssignmentDisplayGrade(row, s, memoInfo);
                if (!studentId || !name) return null;
                return {
                    id: studentId,
                    name: name,
                    grade: displayGrade,
                    sourceGrade: memoInfo.source_grade || row.source_grade || '',
                    nextGrade: memoInfo.next_grade || row.next_grade || displayGrade || '',
                    isNew: !!(row.temp_student_id || row.student_snapshot || (s && s.status === '입학예정') || String((s && s.memo) || row.memo || '').indexOf('#새학기') !== -1),
                    isLeave: _ttIsStudentLeave(s)
                };
            })
            .filter(Boolean)
            .sort(function(a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ko'); });
    }

    var sIds = csSource
        .filter(function(cs) { return String(cs.class_id) === String(classId); })
        .map(function(cs) { return String(cs.student_id); });

    return stSource
        .filter(function(s) {
            if (sIds.indexOf(String(s.id)) === -1) return false;
            if (s.status === '재원') return true;
            if (s.status === '휴원') return true;
            if (isTimetableDraftMode() && s.status === '입학예정') return true;
            if (String(s.memo || '').indexOf('#휴원') !== -1) return true;
            if (isTimetableDraftMode() && String(s.memo || '').indexOf('#새학기') !== -1) return true;
            return false;
        })
        .map(function(s) {
            return { id: s.id, name: s.name, isNew: _ttIsStudentNew(s) || (isTimetableDraftMode() && s.status === '입학예정'), isLeave: _ttIsStudentLeave(s) };
        })
        .sort(function(a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ko'); });
}

// ────────────────────────────────────────────
// 반 카드
// ────────────────────────────────────────────


function buildTimetableStudentSlot(student, classId) {
    if (!student) {
        var addHandler = isTimetableDraftMode()
            ? 'openTimetableDraftAddStudentModal(\'' + apEscapeHtml(String(classId)) + '\')'
            : 'openAddStudentToClass(\'' + apEscapeHtml(String(classId)) + '\')';
        return '' +
            '<div class="tt-std-slot">' +
                '<button class="tt-std-empty" onclick="event.stopPropagation();' + addHandler + '" title="빈칸 클릭 → 새 학생 추가">' +
                    '+' +
                '</button>' +
            '</div>';
    }

    var cls = 'tt-std-name' + (student.isNew ? ' tt-new' : '') + (student.isLeave ? ' tt-leave' : '');
    var nameText = apEscapeHtml(student.name) + (student.isNew ? '<span style="font-size:10px; margin-left:2px; font-weight:700;">(신)</span>' : '');
    var dragAttrs = isTimetableAdminMode()
        ? ' draggable="true" data-student-id="' + apEscapeHtml(String(student.id)) + '" data-source-class-id="' + apEscapeHtml(String(classId)) + '" ondragstart="handleTimetableStudentDragStart(event)" ondragend="if(event.stopPropagation)event.stopPropagation();"'
        : '';

    return '' +
        '<div class="tt-std-slot">' +
            '<span class="' + cls + '"' + dragAttrs + ' onclick="event.stopPropagation();openEditStudentFromTimetable(\'' + apEscapeHtml(String(student.id)) + '\')" title="클릭 → 정보 수정">' +
                nameText +
            '</span>' +
        '</div>';
}


function buildTimetableStudentSlots(students, classId) {
    var maxVisible = TIMETABLE_STUDENT_SLOT_COUNT;
    var slots = [];
    var displayCount = Math.min(students.length, maxVisible);

    for (var i = 0; i < displayCount; i++) {
        slots.push(buildTimetableStudentSlot(students[i], classId));
    }

    if (students.length > maxVisible) {
        var remain = students.length - maxVisible;
        var moreClick = isTimetableDraftMode() ? 'event.stopPropagation();' : 'event.stopPropagation();openTimetableClass(\'' + apEscapeHtml(String(classId)) + '\')';
        slots.push(
            '<div class="tt-std-slot tt-std-slot-more" onclick="' + moreClick + '" title="클릭 시 반 상세로 이동">' +
                '+' + remain +
            '</div>'
        );
    }

    slots.push(buildTimetableStudentSlot(null, classId));
    return '<div class="tt-std-list">' + slots.join('') + '</div>';
}

function buildTimetableCard(cls, options) {
    options = options || {};
    var classId = cls.id;
    var books = getTimetableActiveTextbooks(classId);
    var progress = getTimetableRecentProgress(classId);
    var students = getTimetableClassStudentsWithInfo(classId);

    var headerClick = isTimetableDraftMode() ? 'event.stopPropagation();' : 'event.stopPropagation();openTimetableClass(\'' + apEscapeHtml(String(classId)) + '\')';
    var hdrHtml = '<div class="tt-card-hdr">' +
        '<span class="tt-cls-name" onclick="' + headerClick + '">' +
            apEscapeHtml(cls.name) +
        '</span>' +
    '</div>';

    var bookHtml = books.length > 0
        ? '<div class="tt-book">' + books.map(function(b) {
            return '<span class="tt-book-line">' + apEscapeHtml(b) + '</span>';
        }).join('') + '</div>'
        : '<div class="tt-book"><span class="tt-book-line">교재 미등록</span></div>';

    var progressHtml = progress
        ? '<div class="tt-progress" title="' + apEscapeHtml(progress.date) + '">' + apEscapeHtml(progress.text) + '</div>'
        : '<div class="tt-progress" style="color:transparent;user-select:none;">-</div>';
    var cardDragAttrs = isTimetableAdminMode() && options.enableClassDrag !== false
        ? ' draggable="true" data-drag-class-id="' + apEscapeHtml(String(classId)) + '" ondragstart="handleTimetableClassCardDragStart(event)"'
        : '';
    var dropAttrs = isTimetableAdminMode()
        ? ' data-drop-class-id="' + apEscapeHtml(String(classId)) + '" ondragover="handleTimetableClassDragOver(event)" ondragleave="handleTimetableClassDragLeave(event)" ondrop="handleTimetableClassDrop(event)"'
        : '';

    return '<div class="tt-card"' + cardDragAttrs + dropAttrs + '>' + hdrHtml + bookHtml + progressHtml + buildTimetableStudentSlots(students, classId) + '</div>';
}

function getTimetableHighScheduleLines(cls) {
    var slotRows = getTimetableClassSlotRows(cls && cls.id);
    if (slotRows.length) {
        var dayLabel = { mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토', sun: '일' };
        var groupedSlots = {};
        slotRows.forEach(function(slot) {
            var key = slot.start_time + '~' + slot.end_time;
            if (!groupedSlots[key]) groupedSlots[key] = [];
            groupedSlots[key].push(dayLabel[slot.day_of_week] || slot.day_of_week);
        });
        return Object.keys(groupedSlots).map(function(time) {
            return groupedSlots[time].join('·') + ' ' + time;
        });
    }
    var raw = String(
        cls.schedule_text || cls.schedule_note || cls.schedule_detail || cls.high_schedule || cls.timetable_note || ''
    ).trim();

    if (raw) {
        return raw
            .replace(/\r\n/g, '\n')
            .replace(/\s*[\/|,]\s*/g, '\n')
            .split('\n')
            .map(function(line) { return String(line || '').trim(); })
            .filter(Boolean);
    }

    var dayFields = [
        { key: 'mon_time', label: '월' },
        { key: 'tue_time', label: '화' },
        { key: 'wed_time', label: '수' },
        { key: 'thu_time', label: '목' },
        { key: 'fri_time', label: '금' },
        { key: 'sat_time', label: '토' },
        { key: 'sun_time', label: '일' }
    ];
    var grouped = {};

    dayFields.forEach(function(item) {
        var time = String(cls[item.key] || '').trim();
        if (!time) return;
        if (!grouped[time]) grouped[time] = [];
        grouped[time].push(item.label);
    });

    var lines = Object.keys(grouped).map(function(time) {
        return grouped[time].join('·') + ' ' + time;
    });

    if (lines.length > 0) return lines;

    var fallbackTime = String(cls.time_label || '').trim();
    if (fallbackTime && fallbackTime !== '시간 미지정') return [fallbackTime];

    return [''];
}

function buildTimetableHighCardBlock(cls) {
    var lines = getTimetableHighScheduleLines(cls);
    var metaHtml = lines.map(function(line) {
        return '<span class="tt-high-class-meta-line">' + apEscapeHtml(line) + '</span>';
    }).join('');

    return '<div class="tt-high-class-wrap">' +
        '<div class="tt-high-class-meta">' + metaHtml + '</div>' +
        buildTimetableCard(cls, { enableClassDrag: false }) +
    '</div>';
}

// ────────────────────────────────────────────
// 메인 렌더링 및 탭 전역 함수
// ────────────────────────────────────────────

window.ttSetSection = function(sec) {
    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.timetableSection = sec;
    }
    renderTimetable();
};

window.ttSetMyOnly = function(isMy) {
    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        state.ui.timetableMyOnly = isTimetableAdminMode() ? false : isMy;
    }
    renderTimetable();
};

function renderTimetable() {
    var root = document.getElementById('app-root');
    if (!root) return;

    installTimetableStyle();
    bindTimetableFitEvents();
    enterTimetableWideMode();
    ensureTimetableClassTimeSlotsLoaded();
    ensureTimetableVersionUiState();
    if (isTimetableAdminMode()) ensureTimetableVersionsLoaded();

    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        if (!state.ui.timetableSection) state.ui.timetableSection = 'middle';
        state.ui.timetablePlacementWarnings = {};

        if (isTimetableAdminMode()) {
            state.ui.timetableMyOnly = false;
        } else if (typeof state.ui.timetableMyOnly === 'undefined') {
            state.ui.timetableMyOnly = false;
        }
    }

    var section = (typeof state !== 'undefined' && state.ui && state.ui.timetableSection) || 'middle';
    var isAdminUserForTimetable = isTimetableAdminMode();
    var myOnly = isAdminUserForTimetable ? false : !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    var title = getTimetableDateTitle();
    var isMid = section === 'middle';

    root.innerHTML =
        '<div id="timetable-root" style="width:100%; padding:0; box-sizing:border-box;">' +
            '<div style="display:flex; align-items:center; gap:10px; padding:8px 0 12px;">' +
                '<div class="tt-page-title">' + apEscapeHtml(title) + '</div>' +
                buildTimetableVersionHeaderActionsHtml() +
            '</div>' +
            buildTimetableVersionBannerHtml() +
            '<div class="tt-tab-scroll">' +
                '<button class="tab-btn' + (isMid ? ' active' : '') + '" onclick="window.ttSetSection(\'middle\')">중등부</button>' +
                '<button class="tab-btn' + (!isMid ? ' active' : '') + '" onclick="window.ttSetSection(\'high\')">고등부</button>' +
                '<button class="tab-btn' + (!myOnly ? ' active' : '') + '" onclick="window.ttSetMyOnly(false)">전체 보기</button>' +
                (isAdminUserForTimetable ? '' : '<button class="tab-btn' + (myOnly ? ' active' : '') + '" onclick="window.ttSetMyOnly(true)">내 반 보기</button>') +
            '</div>' +
            '<div id="timetable-grid-wrapper"></div>' +
        '</div>';

    renderTimetableGrid(section);
}


function renderTimetableGrid(section) {
    var wrapper = document.getElementById('timetable-grid-wrapper');
    if (!wrapper) return;

    var db = _getAllDb();
    var allClasses;
    if (isTimetableDraftMode()) {
        allClasses = getTimetableClassList().filter(function(c) {
            return !!(c && c.id);
        });
    } else {
        var timetableSource = (Array.isArray(db.timetable_classes) && db.timetable_classes.length > 0)
            ? db.timetable_classes
            : (db.classes || []);
        var sourceById = {};
        getTimetableClassList().forEach(function(cls) {
            if (cls && cls.id) sourceById[String(cls.id)] = cls;
        });
        timetableSource.forEach(function(cls) {
            if (cls && cls.id) sourceById[String(cls.id)] = getTimetableMergedClass(cls);
        });
        allClasses = Object.keys(sourceById)
            .map(function(id) { return sourceById[id]; })
            .filter(function(c) { return c && Number(c.is_active) !== 0; });
    }

    var visibleTeachers = getTimetableVisibleTeachers();
    var isMyOnly = isTimetableAdminMode() ? false : !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    var sClasses = allClasses.filter(function(cls) { return getTimetableSectionForClass(cls) === section; });
    if (isTimetableDraftMode()) {
        sClasses = sClasses.filter(function(cls) {
            return !shouldHideGraduatingMiddleClassInDraft(cls);
        });
    }
    if (isMyOnly) {
        sClasses = sClasses.filter(isTimetableMyClass);
    }

    if (isMyOnly && !visibleTeachers.length) {
        wrapper.innerHTML = '<div style="padding:28px;text-align:center;color:var(--secondary);font-size:13px;font-weight:700;background:var(--surface);border:1px solid rgba(0,0,0,0.08);border-radius:8px;">교사 정보를 불러올 수 없습니다.</div>';
        return;
    }

    if (section === 'middle') _renderMiddleGrid(sClasses, wrapper, visibleTeachers);
    else _renderHighGrid(sClasses, wrapper, visibleTeachers);

    scheduleTimetableFit();
}

// ────────────────────────────────────────────
// 중등부 그리드
// ────────────────────────────────────────────

function _renderMiddleGrid(sClasses, wrapper, visibleTeachers) {
    var teachers = visibleTeachers && visibleTeachers.length ? visibleTeachers : TIMETABLE_FIXED_TEACHERS.slice();
    var dgBg  = { mwf: 'rgba(255,71,87,0.015)', ttf: 'rgba(26,92,255,0.015)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.03)',  ttf: 'rgba(26,92,255,0.03)' };
    var plan = getTimetableColumnPlan('middle', teachers);
    var totalCols = 1 + (TIMETABLE_MIDDLE_DAY_GROUPS.length * teachers.length);

    var hr1 = '<th style="width:' + plan.labelWidth + 'px; position:sticky; left:0; top:0; z-index:31; background:var(--surface); padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-weight:700; color:var(--secondary); text-align:center;">교시</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        var lbl = dg === 'mwf' ? '월수금' : '화목금';
        hr1 += '<th colspan="' + teachers.length + '" style="position:sticky; top:0; z-index:20; background:' + dgHdr[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + lbl + '</th>';
    });

    var hr2 = '<th style="width:' + plan.labelWidth + 'px; position:sticky; left:0; top:0; z-index:31; background:var(--surface); padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        teachers.forEach(function(t) {
            hr2 += '<th style="width:' + plan.teacherWidth + 'px; position:sticky; top:0; z-index:20; background:' + dgBg[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
        });
    });

    var colgroup = buildTimetableColgroup('middle', teachers);

    var bodyHtml = '';
    TIMETABLE_MIDDLE_PERIODS.forEach(function(p) {
        var cells = '<td style="width:' + plan.labelWidth + 'px; position:sticky; left:0; z-index:10; background:var(--surface); padding:6px 2px; border:1px solid rgba(0,0,0,0.05); text-align:center; vertical-align:middle;">' +
            '<div class="tt-row-label">' + apEscapeHtml(p.label) + '</div>' +
            '<div class="tt-row-sublabel">' + apEscapeHtml(p.time) + '</div>' +
        '</td>';

        TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
            teachers.forEach(function(t) {
                var matched = sClasses.filter(function(cls) {
                    return getTimetablePlacementRows(cls).some(function(row) {
                        return row.day_group === dg &&
                               row.teacher_name === t &&
                               row.period_key === p.key;
                    });
                });
                var time = TIMETABLE_MIDDLE_PERIOD_TIMES[p.key] || {};
                var cell = {
                    section: 'middle',
                    day_group: dg,
                    period_key: p.key,
                    teacher_name: t,
                    grade: '',
                    start_time: time.start || '',
                    end_time: time.end || ''
                };
                var cellAttrs = buildTimetableCellAttrs('middle', cell);
                var addBtn = matched.length === 0 ? buildTimetableAddClassButton(cell) : '';

                if (matched.length === 0) {
                    cells += '<td' + cellAttrs + ' style="width:' + plan.teacherWidth + 'px; background:' + dgBg[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;">' + addBtn + '</td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td' + cellAttrs + ' style="width:' + plan.teacherWidth + 'px; background:' + dgBg[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;">' + cards + '</td>';
                }
            });
        });
        bodyHtml += '<tr class="tt-row-fixed">' + cells + '</tr>';
    });

    var unmappedCount = sClasses.filter(function(cls) {
        var rows = getTimetablePlacementRows(cls);
        if (!rows.length) return true;
        return rows.some(function(row) {
            return TIMETABLE_MIDDLE_DAY_GROUPS.indexOf(row.day_group) === -1 ||
                teachers.indexOf(row.teacher_name) === -1 ||
                !row.period_key;
        });
    }).length;

    var warnHtml = unmappedCount > 0
        ? '<div style="color:var(--error); font-size:12px; font-weight:700; padding:10px 14px; background:rgba(255,71,87,0.06); border-radius:8px; margin-bottom:10px; border:1px solid rgba(255,71,87,0.1);">⚠️ 교시 미배정 반 ' + unmappedCount + '개</div>'
        : '';

    wrapper.innerHTML = warnHtml +
        '<div class="tt-table-wrap">' +
            '<table class="tt-table tt-table-middle" style="width:' + plan.tableWidth + 'px;min-width:' + plan.tableWidth + 'px;">' +
                colgroup +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="' + totalCols + '">해당하는 반이 없습니다.</td></tr>') + '</tbody>' +
            '</table>' +
        '</div>';
}

// ────────────────────────────────────────────
// 고등부 그리드
// ────────────────────────────────────────────

function _renderHighGrid(sClasses, wrapper, visibleTeachers) {
    var teachers = visibleTeachers && visibleTeachers.length ? visibleTeachers : TIMETABLE_FIXED_TEACHERS.slice();
    var highBg = 'rgba(0,0,0,0.01)';
    var highHdr = 'rgba(0,0,0,0.02)';
    var plan = getTimetableColumnPlan('high', teachers);
    var totalCols = 1 + teachers.length;

    var hr = '<th style="width:' + plan.labelWidth + 'px; position:sticky; left:0; top:0; z-index:31; background:var(--surface); padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-weight:700; color:var(--secondary); text-align:center;">학년</th>';
    teachers.forEach(function(t) {
        hr += '<th style="width:' + plan.teacherWidth + 'px; position:sticky; top:0; z-index:20; background:' + highHdr + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
    });

    var colgroup = buildTimetableColgroup('high', teachers);

    var bodyHtml = '';
    TIMETABLE_HIGH_GRADES.forEach(function(grade) {
        var cells = '<td style="width:' + plan.labelWidth + 'px; position:sticky; left:0; z-index:10; background:var(--surface); padding:6px 2px; border:1px solid rgba(0,0,0,0.05); text-align:center; vertical-align:middle;">' +
            '<div class="tt-row-label" style="font-size:14px;">' + apEscapeHtml(grade) + '</div>' +
        '</td>';

        teachers.forEach(function(t) {
            var matched = sClasses.filter(function(cls) {
                return getTimetableClassTeacherName(cls) === t && getTimetableHighGrade(cls) === grade;
            });

            if (matched.length === 0) {
                cells += '<td style="width:' + plan.teacherWidth + 'px; background:' + highBg + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;"></td>';
            } else {
                var cards = matched.map(function(cls) { return buildTimetableHighCardBlock(cls); }).join('');
                cells += '<td style="width:' + plan.teacherWidth + 'px; background:' + highBg + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;">' + cards + '</td>';
            }
        });

        bodyHtml += '<tr class="tt-row-fixed">' + cells + '</tr>';
    });

    wrapper.innerHTML =
        '<div class="tt-table-wrap">' +
            '<table class="tt-table tt-table-high" style="width:' + plan.tableWidth + 'px;min-width:' + plan.tableWidth + 'px;">' +
                colgroup +
                '<thead><tr>' + hr + '</tr></thead>' +
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="' + totalCols + '">해당하는 반이 없습니다.</td></tr>') + '</tbody>' +
            '</table>' +
        '</div>';
}
