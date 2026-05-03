/**
 * AP Math OS [js/timetable.js]
 * 시간표 - 기존 반 카드 데이터 기반 PC 풀스크린 엑셀형 시간표
 * 원본 데이터: state.allDb / state.db
 * 새 DB 테이블 없음. timetable_cells / timetable_cell_students 생성 금지.
 *
 * v2 개편:
 * - 데이터 조회: state.allDb 기반 전체 조회, 클릭 시 권한 검사 (Scope)
 * - 중등부: 1교시/2교시/3교시 고정 3행 압축 (시간 미지정은 WARN 표시)
 * - 고등부: 고1/고2/고3 학년별 고정 3행 분류
 * - 열 구조: [시간/학년] + [월수금 3인] + [화목금 3인] (무조건 7열 고정)
 * - 신입 표시: 파란색 + (신), 휴원 표시: 주황색
 * - 학생명은 반 카드 안에서 세로 목록으로 표시
 * - 학생 수 8명 초과 시 +N 항목으로 대체
 * - 학생칸 클릭 → 학생 수정, 빈칸 클릭 → 학생 추가 (권한 통제)
 */

// ────────────────────────────────────────────
// 설정 (고정 레이아웃 데이터)
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
// 와이드 모드 및 CSS 스타일
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
        '#timetable-root { max-width:none !important; width:100% !important; }',

        '.tt-card { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:7px 9px; margin-bottom:6px; min-width:110px; min-height:118px; display:flex; flex-direction:column; box-sizing:border-box; overflow:hidden; }',
        '.tt-card-hdr { display:flex; align-items:center; gap:4px; margin-bottom:3px; flex-shrink:0; }',
        '.tt-cls-name { font-size:12px; font-weight:700; color:var(--text); cursor:pointer; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-cls-name:hover { color:var(--primary); text-decoration:underline; }',
        '.tt-time { display:none; }',
        '.tt-book { font-size:10px; color:var(--secondary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; display:block; }',
        '.tt-progress { font-size:10px; color:var(--primary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex-shrink:0; display:block; }',

        '.tt-std-list { display:flex; flex-direction:column; gap:2px; margin-top:4px; flex:1 1 auto; min-height:0; }',
        '.tt-std-slot { min-width:0; min-height:18px; display:flex; align-items:center; justify-content:flex-start; border-radius:4px; overflow:hidden; }',
        '.tt-std-name { display:block; width:100%; min-width:0; font-size:11px; font-weight:600; color:var(--text-soft); cursor:pointer; padding:1px 3px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:left; line-height:1.25; }',
        '.tt-std-name:hover { background:var(--surface-2); }',
        '.tt-std-name.tt-new { color:#1A5CFF !important; font-weight:700; }',
        '.tt-std-name.tt-leave { color:#FF8C00 !important; font-weight:700; }',
        '.tt-std-empty { display:block; width:100%; min-height:20px; border:1px dashed var(--border); border-radius:4px; cursor:pointer; background:transparent; color:var(--secondary); font-size:10px; font-weight:600; line-height:18px; text-align:left; padding:0 4px; font-family:inherit; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-std-empty:hover { color:var(--primary); border-color:var(--primary); background:rgba(26,92,255,0.06); }',
        '.tt-std-slot-more { display:flex; align-items:center; justify-content:flex-start; width:100%; min-height:20px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.08); border-radius:4px; cursor:pointer; padding:0 4px; box-sizing:border-box; }',
        '.tt-std-slot-more:hover { background:rgba(26,92,255,0.15); }',

        '.tt-row-label { font-weight:700; font-size:13px; color:var(--text); text-align:center; white-space:nowrap; }',
        '.tt-row-sublabel { font-size:10px; color:var(--secondary); text-align:center; margin-top:2px; white-space:nowrap; }',

        '@media (max-width:900px) {',
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
// 전역 데이터 접근 및 권한 관리
// ────────────────────────────────────────────

function _getAllDb() {
    return (typeof state !== 'undefined') ? (state.allDb || state.db || {}) : {};
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

    if (typeof state !== 'undefined' && state.ui) {
        state.ui.returnView = { type: 'timetable' };
    }

    if (typeof openEditStudent === 'function') {
        openEditStudent(String(studentId), { returnTo: { type: 'timetable' } });
    }
}

function openAddStudentToClass(classId) {
    if (typeof canCurrentUserAccessClass === 'function' && !canCurrentUserAccessClass(classId)) {
        if (typeof toast === 'function') toast('담당 반에만 학생을 추가할 수 있습니다.', 'warn');
        return;
    }

    if (typeof state !== 'undefined' && state.ui) {
        state.ui.returnView = { type: 'timetable' };
    }

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
    // schedule_days만을 기준으로 요일묶음 파싱 (day_group 속성 완전 무시)
    var days = String(cls.schedule_days || '');
    if (!days) return 'custom';

    var arr = days.split(',').map(function(d) { return d.trim(); }).filter(Boolean);
    var has1 = arr.indexOf('1') !== -1;
    var has2 = arr.indexOf('2') !== -1;
    var has3 = arr.indexOf('3') !== -1;
    var has4 = arr.indexOf('4') !== -1;

    // 월,수 포함시 무조건 mwf / 화,목 포함시 무조건 ttf 로 판정
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
    var books = (db.class_textbooks || []).filter(function(tb) {
        return String(tb.class_id) === String(classId) && tb.status === 'active';
    });

    if (books.length > 0) {
        return books.map(function(tb) { return String(tb.title || '').trim(); }).filter(Boolean);
    }

    var cls = (db.classes || []).find(function(c) { return String(c.id) === String(classId); });
    if (cls && cls.textbook) return [cls.textbook];

    return [];
}

function getTimetableRecentProgress(classId) {
    var db = _getAllDb();
    var records = (db.class_daily_records || [])
        .filter(function(r) { return String(r.class_id) === String(classId); })
        .sort(function(a, b) { return String(b.date).localeCompare(String(a.date)); });

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
// 학생 정보 및 배지 처리
// ────────────────────────────────────────────

function _ttNormalizeDateString(value) {
    var raw = String(value || '').trim();
    if (!raw) return '';
    var m = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!m) return '';
    return [
        m[1],
        String(m[2]).padStart(2, '0'),
        String(m[3]).padStart(2, '0')
    ].join('-');
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
    var cutoff = String(year) + '-06-01';
    return joinDate >= cutoff;
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
            return {
                id: s.id,
                name: s.name,
                isNew: _ttIsStudentNew(s),
                isLeave: _ttIsStudentLeave(s)
            };
        })
        .sort(function(a, b) {
            return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
        });
}

// ────────────────────────────────────────────
// 반 카드 빌더
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
    var MAX_VISIBLE = TIMETABLE_STUDENT_SLOT_COUNT;
    var slots = [];
    var displayCount = Math.min(students.length, MAX_VISIBLE);

    for (var i = 0; i < displayCount; i++) {
        slots.push(buildTimetableStudentSlot(students[i], classId));
    }

    if (students.length > MAX_VISIBLE) {
        var remain = students.length - MAX_VISIBLE;
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

    var bookHtml = '';
    if (books.length > 0) {
        bookHtml = '<div class="tt-book">' + books.map(function(b) { return apEscapeHtml(b); }).join(' · ') + '</div>';
    } else {
        bookHtml = '<div class="tt-book">교재 미등록</div>';
    }

    var progressHtml = '';
    if (progress) {
        progressHtml = '<div class="tt-progress" title="' + apEscapeHtml(progress.date) + '">' + apEscapeHtml(progress.text) + '</div>';
    } else {
        progressHtml = '<div class="tt-progress" style="color:transparent;user-select:none;">-</div>'; // 높이 유지용 투명 텍스트
    }

    var stuHtml = buildTimetableStudentSlots(students, classId);

    return '<div class="tt-card">' + hdrHtml + bookHtml + progressHtml + stuHtml + '</div>';
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
    }

    var section = (typeof state !== 'undefined' && state.ui && state.ui.timetableSection) || 'middle';
    var title = getTimetableDateTitle();
    var isMid = section === 'middle';

    root.innerHTML =
        '<div id="timetable-root" style="width:100%; padding:0 0 48px; box-sizing:border-box;">' +
            '<div style="display:flex; align-items:center; gap:10px; padding:4px 0 12px;">' +
                '<button class="btn" style="min-height:36px; padding:8px 12px; font-size:15px; flex-shrink:0;" onclick="openAppDrawer()">&#9776;</button>' +
                '<div style="font-size:16px; font-weight:700; color:var(--text); flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + title + '</div>' +
            '</div>' +
            '<div class="tab-bar" style="max-width:220px; margin:0 0 16px;">' +
                '<button class="tab-btn' + (isMid ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableSection=\'middle\';} renderTimetable();">중등부</button>' +
                '<button class="tab-btn' + (!isMid ? ' active' : '') + '" onclick="if(typeof state!==\'undefined\'&&state.ui){state.ui.timetableSection=\'high\';} renderTimetable();">고등부</button>' +
            '</div>' +
            '<div id="timetable-grid-wrapper"></div>' +
        '</div>';

    renderTimetableGrid(section);
}

// ────────────────────────────────────────────
// 그리드 진입
// ────────────────────────────────────────────

function renderTimetableGrid(section) {
    var wrapper = document.getElementById('timetable-grid-wrapper');
    if (!wrapper) return;

    var db = _getAllDb();
    var timetableSource = (Array.isArray(db.timetable_classes) && db.timetable_classes.length > 0)
        ? db.timetable_classes
        : (db.classes || []);
    var allClasses = timetableSource.filter(function(c) { return Number(c.is_active) !== 0; });

    var sClasses = allClasses.filter(function(cls) {
        return getTimetableSectionForClass(cls) === section;
    });

    if (section === 'middle') {
        _renderMiddleGrid(sClasses, wrapper);
    } else {
        _renderHighGrid(sClasses, wrapper);
    }
}

// ────────────────────────────────────────────
// 중등부 그리드: 행=고정 3교시, 열=고정 6인 (총 7칸)
// ────────────────────────────────────────────

function _renderMiddleGrid(sClasses, wrapper) {
    var dgBg  = { mwf: 'rgba(255,71,87,0.06)',  ttf: 'rgba(26,92,255,0.06)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.13)',  ttf: 'rgba(26,92,255,0.13)' };

    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20;';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    // Header 1: Time + Day Groups
    var hr1 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:72px; font-weight:700; color:var(--secondary); text-align:center;">교시</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        var lbl = dg === 'mwf' ? '월수금' : '화목금';
        hr1 += '<th colspan="3" style="' + stickyTop + ' background:' + dgHdr[dg] + '; ' + cellBase + ' font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + lbl + '</th>';
    });

    // Header 2: Teachers
    var hr2 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:72px; font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    TIMETABLE_MIDDLE_DAY_GROUPS.forEach(function(dg) {
        TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
            hr2 += '<th style="' + stickyTop + ' background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px; font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
        });
    });

    // Body Rows
    var bodyHtml = '';
    TIMETABLE_MIDDLE_PERIODS.forEach(function(p) {
        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' min-width:72px; text-align:center; vertical-align:middle; padding:8px 4px;">' +
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
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + ' min-height:104px;"></td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px;">' + cards + '</td>';
                }
            });
        });
        bodyHtml += '<tr>' + cells + '</tr>';
    });

    // Unmapped Error Warning
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
        '<div style="overflow:auto; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px;">' +
            '<table style="border-collapse:collapse; background:var(--surface); font-family:inherit; width:max-content; min-width:100%;">' +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + bodyHtml + '</tbody>' +
            '</table>' +
        '</div>';
}

// ────────────────────────────────────────────
// 고등부 그리드: 행=고1/고2/고3, 열=고정 6인 (총 7칸)
// ────────────────────────────────────────────

function _renderHighGrid(sClasses, wrapper) {
    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20; background:var(--surface);';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    var hr = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:60px; font-weight:700; color:var(--secondary); text-align:center;">학년</th>';
    TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
        hr += '<th style="' + stickyTop + ' ' + cellBase + ' min-width:160px; font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t) + '</th>';
    });

    var bodyHtml = '';
    TIMETABLE_HIGH_GRADES.forEach(function(grade) {
        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' min-width:60px; text-align:center; vertical-align:middle; padding:8px 4px;">' +
            '<div class="tt-row-label" style="font-size:15px;">' + apEscapeHtml(grade) + '</div>' +
        '</td>';

        TIMETABLE_FIXED_TEACHERS.forEach(function(t) {
            var matched = sClasses.filter(function(cls) {
                return (cls.teacher_name || '').trim() === t &&
                       getTimetableHighGrade(cls) === grade;
            });

            if (matched.length === 0) {
                cells += '<td style="background:var(--surface); ' + cellBase + ' min-height:118px;"></td>';
            } else {
                var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                cells += '<td style="background:var(--surface); ' + cellBase + ' min-width:160px;">' + cards + '</td>';
            }
        });

        bodyHtml += '<tr>' + cells + '</tr>';
    });

    wrapper.innerHTML =
        '<div style="overflow:auto; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px;">' +
            '<table style="border-collapse:collapse; background:var(--surface); font-family:inherit; width:max-content; min-width:100%;">' +
                '<thead><tr>' + hr + '</tr></thead>' +
                '<tbody>' + bodyHtml + '</tbody>' +
            '</table>' +
        '</div>';
}
