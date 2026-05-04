/**
 * AP Math OS [js/timetable.js]
 * 시간표 - 기존 반 카드 데이터 기반 PC 풀스크린 엑셀형 시간표
 * 원본 데이터: state.allDb / state.db
 * 새 DB 테이블 없음. timetable_cells / timetable_cell_students 생성 금지.
 *
 * 반영 사항:
 * - 시간표 내부 햄버거 제거
 * - 모바일 가로 드래그 유지
 * - 전체 보기 / 내 반 보기 토글 추가
 * - 중등부/고등부 표 색감 통일
 * - 첫 번째 열은 글자 크기에 맞게 축소
 * - 고등부 행 높이는 중등부 1교시/2교시/3교시 행 높이와 동일 적용
 * - 고등부 각 반 카드 위에 요일/시간 상세 2~3줄 표시 가능
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
        ':root { --tt-row-height: 330px; }',
        '@media (min-width:901px) {',
        '  main.ap-timetable-wide-main { max-width:none !important; width:calc(100vw - 56px) !important; margin:0 !important; padding-left:24px !important; padding-right:24px !important; }',
        '  body.ap-drawer-expanded main.ap-timetable-wide-main { width:calc(100vw - 260px) !important; }',
        '}',
        '#timetable-root { max-width:none !important; width:100% !important; }',
        '.tt-page-title { font-size:16px; font-weight:700; color:var(--text); min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-tab-scroll { display:flex; align-items:center; gap:8px; overflow-x:auto; -webkit-overflow-scrolling:touch; padding:0 0 12px; white-space:nowrap; scrollbar-width:none; }',
        '.tt-tab-scroll::-webkit-scrollbar { display:none; }',
        '.tt-tab-scroll .tab-btn { flex:0 0 auto; white-space:nowrap; min-width:auto; padding:10px 18px; }',
        '.tt-table-wrap { overflow:auto; -webkit-overflow-scrolling:touch; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px; }',
        '.tt-table { border-collapse:collapse; background:var(--surface); font-family:inherit; table-layout:fixed; width:100%; }',
        '.tt-table-middle { min-width:980px; }',
        '.tt-table-high { min-width:760px; }',
        '.tt-row-fixed { height:var(--tt-row-height); }',
        '.tt-card { background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:10px 12px; margin-bottom:6px; width:100%; min-height:148px; display:flex; flex-direction:column; box-sizing:border-box; overflow:hidden; }',
        '.tt-card-hdr { display:flex; align-items:center; gap:4px; margin-bottom:3px; flex-shrink:0; }',
        '.tt-cls-name { font-size:15px; font-weight:700; color:var(--text); cursor:pointer; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-cls-name:hover { color:var(--primary); text-decoration:underline; }',
        '.tt-book { font-size:10px; color:var(--secondary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; display:block; }',
        '.tt-progress { font-size:10px; color:var(--primary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; display:block; }',
        '.tt-std-list { display:grid; grid-template-columns:1fr 1fr; row-gap:2px; column-gap:4px; margin-top:4px; flex:1 1 auto; min-height:0; }',
        '.tt-std-slot { min-width:0; min-height:18px; display:flex; align-items:center; justify-content:flex-start; border-radius:4px; overflow:hidden; }',
        '.tt-std-name { display:block; width:100%; min-width:0; font-size:13px; font-weight:600; color:var(--text-soft); cursor:pointer; padding:1px 3px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:left; line-height:1.25; }',
        '.tt-std-name:hover { background:var(--surface-2); }',
        '.tt-std-name.tt-new { color:#1A5CFF !important; font-weight:700; }',
        '.tt-std-name.tt-leave { color:#FF8C00 !important; font-weight:700; }',
        '.tt-std-empty { display:block; width:100%; min-height:20px; border:1px dashed var(--border); border-radius:4px; cursor:pointer; background:transparent; color:var(--secondary); font-size:10px; font-weight:600; line-height:18px; text-align:left; padding:0 4px; font-family:inherit; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; grid-column:span 2; }',
        '.tt-std-empty:hover { color:var(--primary); border-color:var(--primary); background:rgba(26,92,255,0.06); }',
        '.tt-std-slot-more { display:flex; align-items:center; justify-content:flex-start; width:100%; min-height:20px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.08); border-radius:4px; cursor:pointer; padding:0 4px; box-sizing:border-box; grid-column:span 2; }',
        '.tt-std-slot-more:hover { background:rgba(26,92,255,0.15); }',
        '.tt-row-label { font-weight:700; font-size:13px; color:var(--text); text-align:center; white-space:nowrap; }',
        '.tt-row-sublabel { font-size:10px; color:var(--secondary); text-align:center; margin-top:2px; white-space:nowrap; }',
        '.tt-high-class-wrap { display:flex; flex-direction:column; gap:4px; margin-bottom:8px; }',
        '.tt-high-class-wrap:last-child { margin-bottom:0; }',
        '.tt-high-class-meta { font-size:11px; font-weight:700; color:var(--secondary); line-height:1.45; padding:0 2px 4px; white-space:normal; word-break:keep-all; }',
        '.tt-high-class-meta-line { display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '@media (max-width:900px) {',
        '  :root { --tt-row-height: 300px; }',
        '  .tt-card { min-height:132px; }',
        '  .tt-std-list { gap:2px; }',
        '  .tt-std-slot { min-height:20px; }',
        '  .tt-std-name { font-size:12px; min-height:20px; line-height:18px; padding:1px 3px; }',
        '  .tt-std-empty { min-height:22px; line-height:20px; font-size:11px; }',
        '  .tt-cls-name { font-size:13px; }',
        '}'
    ].join('\n');

    document.head.appendChild(style);
}

// ────────────────────────────────────────────
// 전역 데이터 접근 및 권한
// ────────────────────────────────────────────

function _getAllDb() {
    return (typeof state !== 'undefined') ? (state.allDb || state.db || {}) : {};
}

function _ttNormalizeTeacherName(name) {
    return String(name || '').replace(/\s*선생님\s*$/g, '').trim();
}

function _ttGetCurrentTeacherName() {
    if (typeof getTeacherNameForUI === 'function') return _ttNormalizeTeacherName(getTeacherNameForUI());
    if (typeof state !== 'undefined') {
        if (state.ui && state.ui.userName) return _ttNormalizeTeacherName(state.ui.userName);
        if (state.auth && state.auth.name) return _ttNormalizeTeacherName(state.auth.name);
    }
    try {
        var session = JSON.parse(localStorage.getItem('APMATH_SESSION') || 'null');
        if (session && session.name) return _ttNormalizeTeacherName(session.name);
    } catch (e) {}
    return '';
}

function isTimetableMyClass(cls) {
    if (!cls) return false;
    if (typeof canCurrentUserAccessClass === 'function') return !!canCurrentUserAccessClass(cls.id);

    var current = _ttGetCurrentTeacherName();
    var classTeacher = _ttNormalizeTeacherName(cls.teacher_name || '');

    if (!current) {
        if (typeof state !== 'undefined' && state.auth && state.auth.role === 'admin') return true;
        return true;
    }
    if (!classTeacher) return true;
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

function getTimetableDayGroupLabel(dayGroup) {
    if (dayGroup === 'mwf') return '월수금';
    if (dayGroup === 'ttf') return '화목금';
    return '기타';
}

function getTimetableScheduleDaysLabel(cls) {
    var days = String(cls.schedule_days || '');
    if (!days) return '요일 미지정';

    var map = { '0': '일', '1': '월', '2': '화', '3': '수', '4': '목', '5': '금', '6': '토' };
    var arr = days.split(',').map(function(d) { return d.trim(); }).filter(Boolean);
    var labels = arr.map(function(d) { return map[d] || ''; }).filter(Boolean);
    return labels.length ? labels.join('·') : '요일 미지정';
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
    var books = (db.class_textbooks || []).filter(function(tb) {
        return String(tb.class_id) === String(classId) && tb.status === 'active';
    });

    if (books.length > 0) {
        return books.map(function(tb) { return String(tb.title || '').trim(); }).filter(Boolean);
    }

    var cls = (db.classes || []).find(function(c) { return String(c.id) === String(classId); });
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
    var sIds = (db.class_students || [])
        .filter(function(cs) { return String(cs.class_id) === String(classId); })
        .map(function(cs) { return String(cs.student_id); });

    return (db.students || [])
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
    var nameText = apEscapeHtml(student.name) + (student.isNew ? '<span style="font-size:9px; margin-left:1px;">(신)</span>' : '');

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
        ? '<div class="tt-book">' + books.map(function(b) { return apEscapeHtml(b); }).join(' · ') + '</div>'
        : '<div class="tt-book">교재 미등록</div>';

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
    if (fallbackTime && fallbackTime !== '시간 미지정') return ['시간표 미세정보 없음 · ' + fallbackTime];

    return ['시간 미지정'];
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
// 메인 렌더링
// ────────────────────────────────────────────

function renderTimetable() {
    var root = document.getElementById('app-root');
    if (!root) return;

    installTimetableStyle();
    enterTimetableWideMode();

    if (typeof state !== 'undefined') {
        if (!state.ui) state.ui = {};
        if (!state.ui.timetableSection) state.ui.timetableSection = 'middle';
        if (typeof state.ui.timetableMyOnly === 'undefined') state.ui.timetableMyOnly = false;
    }

    var section = (typeof state !== 'undefined' && state.ui && state.ui.timetableSection) || 'middle';
    var myOnly = !!(typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly);
    var title = getTimetableDateTitle();
    var isMid = section === 'middle';

    root.innerHTML =
        '<div id="timetable-root" style="width:100%; padding:0 0 48px; box-sizing:border-box;">' +
            '<div style="display:flex; align-items:center; gap:10px; padding:4px 0 12px;">' +
                '<div class="tt-page-title">' + apEscapeHtml(title) + '</div>' +
            '</div>' +
            '<div class="tt-tab-scroll">' +
                '<button class="tab-btn' + (isMid ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableSection=\'middle\';} renderTimetable();">중등부</button>' +
                '<button class="tab-btn' + (!isMid ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableSection=\'high\';} renderTimetable();">고등부</button>' +
                '<button class="tab-btn' + (!myOnly ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableMyOnly=false;} renderTimetable();">전체 보기</button>' +
                '<button class="tab-btn' + (myOnly ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableMyOnly=true;} renderTimetable();">내 반 보기</button>' +
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
    var allClasses = timetableSource.filter(function(c) { return Number(c.is_active) !== 0; });

    var sClasses = allClasses.filter(function(cls) { return getTimetableSectionForClass(cls) === section; });
    if (typeof state !== 'undefined' && state.ui && state.ui.timetableMyOnly) {
        sClasses = sClasses.filter(isTimetableMyClass);
    }

    if (section === 'middle') _renderMiddleGrid(sClasses, wrapper);
    else _renderHighGrid(sClasses, wrapper);
}

// ────────────────────────────────────────────
// 중등부 그리드
// ────────────────────────────────────────────

function _renderMiddleGrid(sClasses, wrapper) {
    var dgBg  = { mwf: 'rgba(255,71,87,0.06)',  ttf: 'rgba(26,92,255,0.06)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.13)',  ttf: 'rgba(26,92,255,0.13)' };

    var firstCol = 'width:1%; min-width:max-content; white-space:nowrap;';
    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20;';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    var hr1 = '<th style="' + stickyCorner + ' ' + cellBase + ' ' + firstCol + ' font-weight:700; color:var(--secondary); text-align:center;">교시</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        var lbl = dg === 'mwf' ? '월수금' : '화목금';
        hr1 += '<th colspan="3" style="' + stickyTop + ' background:' + dgHdr[dg] + '; ' + cellBase + ' font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + lbl + '</th>';
    });

    var hr2 = '<th style="' + stickyCorner + ' ' + cellBase + ' ' + firstCol + ' font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
            hr2 += '<th style="' + stickyTop + ' background:' + dgBg[dg] + '; ' + cellBase + ' font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
        });
    });

    var bodyHtml = '';
    TIMETABLE_MIDDLE_PERIODS.forEach(function(p) {
        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' ' + firstCol + ' text-align:center; vertical-align:middle; padding:8px 6px;">' +
            '<div class="tt-row-label">' + apEscapeHtml(p.label) + '</div>' +
            '<div class="tt-row-sublabel">' + apEscapeHtml(p.time) + '</div>' +
        '</td>';

        TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
            TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
                var matched = sClasses.filter(function(cls) {
                    return getTimetableDayGroup(cls) === dg &&
                           (cls.teacher_name || '').trim() === t &&
                           getTimetablePeriodKey(cls) === p.key;
                });

                if (matched.length === 0) {
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '"></td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '">' + cards + '</td>';
                }
            });
        });
        bodyHtml += '<tr class="tt-row-fixed">' + cells + '</tr>';
    });

    var unmappedCount = sClasses.filter(function(cls) {
        var dg = getTimetableDayGroup(cls);
        var t = (cls.teacher_name || '').trim();
        if (TIMETABLE_MIDDLE_DAY_GROUPS.indexOf(dg) === -1) return false;
        if (TIMETABLE_FIXED_TEACHERS.indexOf(t) === -1) return false;
        return getTimetablePeriodKey(cls) === 'unknown';
    }).length;

    var warnHtml = unmappedCount > 0
        ? '<div style="color:var(--error); font-size:12px; font-weight:700; padding:10px 14px; background:rgba(255,71,87,0.08); border-radius:10px; margin-bottom:12px; border:1px solid rgba(255,71,87,0.15);">⚠️ 시간대(교시)를 판정할 수 없는 중등부 반이 ' + unmappedCount + '개 있습니다. 반 관리 메뉴에서 시간(예: 4:50~6:20, 6:30~8:00, 8:00~9:30)을 정확히 입력해주세요.</div>'
        : '';

    wrapper.innerHTML = warnHtml +
        '<div class="tt-table-wrap">' +
            '<table class="tt-table tt-table-middle">' +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="7">표시할 반이 없습니다.</td></tr>') + '</tbody>' +
            '</table>' +
        '</div>';
}

// ────────────────────────────────────────────
// 고등부 그리드
// ────────────────────────────────────────────

function _renderHighGrid(sClasses, wrapper) {
    var highBg = 'rgba(26,92,255,0.06)';
    var highHdr = 'rgba(26,92,255,0.13)';

    var firstCol = 'width:1%; min-width:max-content; white-space:nowrap;';
    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20; background:' + highHdr + ';';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    var hr = '<th style="' + stickyCorner + ' ' + cellBase + ' ' + firstCol + ' font-weight:700; color:var(--secondary); text-align:center;">학년</th>';
    TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
        hr += '<th style="' + stickyTop + ' ' + cellBase + ' font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
    });

    var bodyHtml = '';
    TIMETABLE_HIGH_GRADES.forEach(function(grade) {
        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' ' + firstCol + ' text-align:center; vertical-align:middle; padding:8px 6px;">' +
            '<div class="tt-row-label" style="font-size:15px;">' + apEscapeHtml(grade) + '</div>' +
        '</td>';

        TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
            var matched = sClasses.filter(function(cls) {
                return (cls.teacher_name || '').trim() === t && getTimetableHighGrade(cls) === grade;
            });

            if (matched.length === 0) {
                cells += '<td style="background:' + highBg + '; ' + cellBase + '"></td>';
            } else {
                var cards = matched.map(function(cls) { return buildTimetableHighCardBlock(cls); }).join('');
                cells += '<td style="background:' + highBg + '; ' + cellBase + '">' + cards + '</td>';
            }
        });

        bodyHtml += '<tr class="tt-row-fixed">' + cells + '</tr>';
    });

    wrapper.innerHTML =
        '<div class="tt-table-wrap">' +
            '<table class="tt-table tt-table-high">' +
                '<thead><tr>' + hr + '</tr></thead>' +
                '<tbody>' + (bodyHtml || '<tr><td style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;" colspan="4">표시할 반이 없습니다.</td></tr>') + '</tbody>' +
            '</table>' +
        '</div>';
}