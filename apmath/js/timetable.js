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
        '  main.ap-timetable-wide-main { max-width:none !important; width:calc(100vw - 56px) !important; margin:0 !important; padding-left:24px !important; padding-right:24px !important; }',
        '  body.ap-drawer-expanded main.ap-timetable-wide-main { width:calc(100vw - 260px) !important; }',
        '}',
        '#timetable-root { max-width:none !important; width:100% !important; overflow:hidden; padding-bottom:0 !important; }',
        '.tt-page-title { font-size:17px; font-weight:700; color:var(--text); min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-tab-scroll { display:flex; align-items:center; gap:8px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding:4px 0 14px; white-space:nowrap; scrollbar-width:none; }',
        '.tt-tab-scroll::-webkit-scrollbar { display:none; }',
        '.tt-tab-scroll .tab-btn { flex:0 0 auto; white-space:nowrap; min-width:auto; padding:10px 16px; font-size:13px; font-weight:600; border-radius:8px; border:1px solid rgba(0,0,0,0.06); background:var(--surface); color:var(--secondary); transition:all 0.2s; cursor:pointer; }',
        '.tt-tab-scroll .tab-btn.active { background:var(--text); color:var(--surface); border-color:var(--text); font-weight:700; }',

        '.tt-table-wrap { overflow-x:auto; overflow-y:hidden; -webkit-overflow-scrolling:touch; border-radius:8px; border:1px solid rgba(0,0,0,0.08); background:var(--surface); }',
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
        '.tt-std-empty { display:block; width:100%; min-height:18px; border:1px dashed rgba(0,0,0,0.1); border-radius:4px; cursor:pointer; background:transparent; color:var(--secondary); font-size:10.5px; font-weight:600; line-height:16px; text-align:left; padding:0 3px; font-family:inherit; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; grid-column:span 2; letter-spacing:-0.2px; }',
        '@media (hover: hover) { .tt-std-empty:hover { color:var(--primary); border-color:rgba(26,92,255,0.3); background:rgba(26,92,255,0.03); } }',
        '.tt-std-slot-more { display:flex; align-items:center; justify-content:flex-start; width:100%; min-height:18px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.05); border-radius:4px; cursor:pointer; padding:0 3px; box-sizing:border-box; grid-column:span 2; letter-spacing:-0.2px; }',
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
    var bottomPadding = 0;
    var availableHeight = Math.floor(viewportHeight - wrapTop - bottomPadding);

    if (!Number.isFinite(availableHeight) || availableHeight < 280) {
        availableHeight = 280;
    }

    wrap.style.height = availableHeight + 'px';
    wrap.style.maxHeight = availableHeight + 'px';
    wrap.style.overflowX = 'auto';
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
    var isAdmin = !!(typeof state !== 'undefined' && state.auth && state.auth.role === 'admin');
    if (isAdmin) return TIMETABLE_FIXED_TEACHERS.slice();

    var isMyOnly = !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
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
    var teacherWidth = 220;

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

function getTimetableDateTitle() {
    var now = new Date();
    var yy = String(now.getFullYear()).slice(2);
    var mm = now.getMonth() + 1;
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

function getTimetableClassStudentsWithInfo(classId) {
    var db = _getAllDb();
    var mainDb = (typeof state !== 'undefined' && state.db) ? state.db : {};
    var allDb = (typeof state !== 'undefined' && state.allDb) ? state.allDb : {};

    var csSource =
        mainDb.timetable_class_students ||
        db.timetable_class_students ||
        allDb.timetable_class_students ||
        mainDb.class_students ||
        db.class_students ||
        allDb.class_students ||
        [];

    var stSource =
        mainDb.timetable_students ||
        db.timetable_students ||
        allDb.timetable_students ||
        mainDb.students ||
        db.students ||
        allDb.students ||
        [];

    var sIds = csSource
        .filter(function(cs) { return String(cs.class_id) === String(classId); })
        .map(function(cs) { return String(cs.student_id); });

    return stSource
        .filter(function(s) {
            if (sIds.indexOf(String(s.id)) === -1) return false;
            if (s.status === '재원') return true;
            if (s.status === '휴원') return true;
            if (String(s.memo || '').indexOf('#휴원') !== -1) return true;
            return false;
        })
        .map(function(s) {
            return { id: s.id, name: s.name, isNew: _ttIsStudentNew(s), isLeave: _ttIsStudentLeave(s) };
        })
        .sort(function(a, b) { return String(a.name || '').localeCompare(String(b.name || ''), 'ko'); });
}

// ────────────────────────────────────────────
// 반 카드
// ────────────────────────────────────────────

function buildTimetableStudentSlot(student, classId) {
    if (!student) {
        return '' +
            '<div class="tt-std-slot">' +
                '<button class="tt-std-empty" onclick="event.stopPropagation();openAddStudentToClass(\'' + apEscapeHtml(String(classId)) + '\')" title="빈칸 클릭 → 새 학생 추가">' +
                    '+ 추가' +
                '</button>' +
            '</div>';
    }

    var cls = 'tt-std-name' + (student.isNew ? ' tt-new' : '') + (student.isLeave ? ' tt-leave' : '');
    var nameText = apEscapeHtml(student.name) + (student.isNew ? '<span style="font-size:10px; margin-left:2px; font-weight:700;">(신)</span>' : '');

    return '' +
        '<div class="tt-std-slot">' +
            '<span class="' + cls + '" onclick="event.stopPropagation();openEditStudentFromTimetable(\'' + apEscapeHtml(String(student.id)) + '\')" title="클릭 → 정보 수정">' +
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
        slots.push(
            '<div class="tt-std-slot tt-std-slot-more" onclick="event.stopPropagation();openTimetableClass(\'' + apEscapeHtml(String(classId)) + '\')" title="클릭 시 반 상세로 이동">' +
                '+' + remain +
            '</div>'
        );
    }

    slots.push(buildTimetableStudentSlot(null, classId));
    return '<div class="tt-std-list">' + slots.join('') + '</div>';
}

function buildTimetableCard(cls) {
    var classId = cls.id;
    var books = getTimetableActiveTextbooks(classId);
    var progress = getTimetableRecentProgress(classId);
    var students = getTimetableClassStudentsWithInfo(classId);

    var hdrHtml = '<div class="tt-card-hdr">' +
        '<span class="tt-cls-name" onclick="event.stopPropagation();openTimetableClass(\'' + apEscapeHtml(String(classId)) + '\')">' +
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

    return '<div class="tt-card">' + hdrHtml + bookHtml + progressHtml + buildTimetableStudentSlots(students, classId) + '</div>';
}

function getTimetableHighScheduleLines(cls) {
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
        buildTimetableCard(cls) +
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
        state.ui.timetableMyOnly = isMy;
    }
    renderTimetable();
};

function renderTimetable() {
    var root = document.getElementById('app-root');
    if (!root) return;

    installTimetableStyle();
    bindTimetableFitEvents();
    enterTimetableWideMode();

    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        if (!state.ui.timetableSection) state.ui.timetableSection = 'middle';

        var isAdmin = !!(state.auth && state.auth.role === 'admin');
        if (isAdmin) {
            state.ui.timetableMyOnly = false;
        } else if (typeof state.ui.timetableMyOnly === 'undefined') {
            state.ui.timetableMyOnly = false;
        }
    }

    var section = (typeof state !== 'undefined' && state.ui && state.ui.timetableSection) || 'middle';
    var myOnly = !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    var isAdminUserForTimetable = !!(typeof state !== 'undefined' && state.auth && state.auth.role === 'admin');
    var title = getTimetableDateTitle();
    var isMid = section === 'middle';

    root.innerHTML =
        '<div id="timetable-root" style="width:100%; padding:0; box-sizing:border-box;">' +
            '<div style="display:flex; align-items:center; gap:10px; padding:8px 0 12px;">' +
                '<div class="tt-page-title">' + apEscapeHtml(title) + '</div>' +
            '</div>' +
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
    var timetableSource = (Array.isArray(db.timetable_classes) && db.timetable_classes.length > 0)
        ? db.timetable_classes
        : (db.classes || []);
    var allClasses = timetableSource
        .map(getTimetableMergedClass)
        .filter(function(c) { return Number(c.is_active) !== 0; });

    var visibleTeachers = getTimetableVisibleTeachers();
    var isMyOnly = !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    var sClasses = allClasses.filter(function(cls) { return getTimetableSectionForClass(cls) === section; });
    if (isMyOnly) {
        sClasses = sClasses.filter(isTimetableMyClass);
    }

    if (isMyOnly && !visibleTeachers.length) {
        wrapper.innerHTML = '<div style="padding:28px;text-align:center;color:var(--secondary);font-size:13px;font-weight:700;background:var(--surface);border:1px solid rgba(0,0,0,0.08);border-radius:8px;">현재 로그인 교사 정보를 확인하지 못했습니다.</div>';
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
                    return getTimetableDayGroup(cls) === dg &&
                           getTimetableClassTeacherName(cls) === t &&
                           getTimetablePeriodKey(cls) === p.key;
                });

                if (matched.length === 0) {
                    cells += '<td style="width:' + plan.teacherWidth + 'px; background:' + dgBg[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;"></td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td style="width:' + plan.teacherWidth + 'px; background:' + dgBg[dg] + '; padding:4px 6px; border:1px solid rgba(0,0,0,0.05); vertical-align:top;">' + cards + '</td>';
                }
            });
        });
        bodyHtml += '<tr class="tt-row-fixed">' + cells + '</tr>';
    });

    var unmappedCount = sClasses.filter(function(cls) {
        var dg = getTimetableDayGroup(cls);
        var teacher = getTimetableClassTeacherName(cls);
        if (TIMETABLE_MIDDLE_DAY_GROUPS.indexOf(dg) === -1) return false;
        if (teachers.indexOf(teacher) === -1) return false;
        return getTimetablePeriodKey(cls) === 'unknown';
    }).length;

    var warnHtml = unmappedCount > 0
        ? '<div style="color:var(--error); font-size:12px; font-weight:700; padding:10px 14px; background:rgba(255,71,87,0.06); border-radius:8px; margin-bottom:10px; border:1px solid rgba(255,71,87,0.1);">⚠️ 시간대(교시) 미지정 반: ' + unmappedCount + '개</div>'
        : '';

    wrapper.innerHTML = warnHtml +
        '<div class="tt-table-wrap">' +
            '<table class="tt-table tt-table-middle" style="width:' + plan.tableWidth + 'px;min-width:' + plan.tableWidth + 'px;">' +
                colgroup +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="' + totalCols + '">표시할 반이 없습니다.</td></tr>') + '</tbody>' +
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
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="' + totalCols + '">표시할 반이 없습니다.</td></tr>') + '</tbody>' +
            '</table>' +
        '</div>';
}