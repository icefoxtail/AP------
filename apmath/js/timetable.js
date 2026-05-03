/**
 * AP Math OS [js/timetable.js]
 * 전체 시간표 - 기존 반 카드 데이터 기반 PC 풀스크린 엑셀형 시간표
 * 원본 데이터: state.db.classes / class_students / students / class_textbooks
 * 새 DB 테이블 없음. timetable_cells / timetable_cell_students 생성 금지.
 *
 * v2 개편:
 * - 중등부: time_label 위치 기준 1교시/2교시/3교시 행 압축 (time_label 데이터 유지)
 * - 고등부: 고1/고2/고3 학년별 행 분류 (교시 기준 아님)
 * - 신입 표시: 파란색 + (신), 휴원 표시: 주황색
 * - PC: 학생명 1줄 8칸 슬롯, 모바일: 2줄 4×2 슬롯
 * - 학생칸 클릭 → 학생 수정, 빈칸 클릭 → 학생 추가
 * - 반 카드 제목 클릭 → renderClass, 복귀 context { type: 'timetable' }
 * - 시간표 → 반상세 → 닫기 = 시간표 복귀
 */

// ────────────────────────────────────────────
// 설정
// ────────────────────────────────────────────

var TIMETABLE_STUDENT_SLOT_COUNT = 8;

// ────────────────────────────────────────────
// 와이드 모드
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

        '.tt-card { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:5px 7px; margin-bottom:4px; min-width:90px; }',
        '.tt-card:last-child { margin-bottom:0; }',
        '.tt-card-hdr { display:flex; justify-content:space-between; align-items:center; gap:4px; margin-bottom:2px; }',
        '.tt-cls-name { font-size:12px; font-weight:700; color:var(--text); cursor:pointer; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-cls-name:hover { color:var(--primary); text-decoration:underline; }',
        '.tt-time { font-size:10px; color:var(--secondary); white-space:nowrap; flex-shrink:0; }',
        '.tt-book { font-size:10px; color:var(--secondary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-progress { font-size:10px; color:var(--primary); margin-bottom:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',

        '.tt-std-list { display:grid; grid-template-columns:repeat(8, minmax(0, 1fr)); gap:2px; margin-bottom:2px; align-items:center; }',
        '.tt-std-slot { min-width:0; min-height:20px; display:flex; align-items:center; justify-content:center; border-radius:4px; overflow:hidden; }',
        '.tt-std-name { display:block; width:100%; min-width:0; font-size:11px; font-weight:600; color:var(--text-soft); cursor:pointer; padding:2px 3px; border-radius:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-align:center; line-height:1.25; }',
        '.tt-std-name:hover { background:var(--surface-2); }',
        '.tt-std-name.tt-new { color:#1A5CFF !important; font-weight:700; }',
        '.tt-std-name.tt-leave { color:#FF8C00 !important; font-weight:700; }',
        '.tt-std-empty { display:block; width:100%; min-height:20px; border:1px dashed var(--border); border-radius:4px; cursor:pointer; background:transparent; color:var(--secondary); font-size:10px; font-weight:600; line-height:18px; text-align:center; padding:0 2px; font-family:inherit; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }',
        '.tt-std-empty:hover { color:var(--primary); border-color:var(--primary); background:rgba(26,92,255,0.06); }',

        '.tt-row-label { font-weight:700; font-size:13px; color:var(--text); text-align:center; white-space:nowrap; }',
        '.tt-row-sublabel { font-size:10px; color:var(--secondary); text-align:center; margin-top:2px; white-space:nowrap; }',

        '@media (max-width:900px) {',
        '  .tt-std-list { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:2px 4px; }',
        '  .tt-std-slot { min-height:24px; }',
        '  .tt-std-name { font-size:12px; min-height:24px; line-height:20px; padding:2px 3px; }',
        '  .tt-std-empty { min-height:24px; line-height:22px; font-size:11px; }',
        '  .tt-card { min-width:0; }',
        '  .tt-cls-name { font-size:13px; }',
        '}'
    ].join('\n');

    document.head.appendChild(style);
}

// ────────────────────────────────────────────
// 유틸
// ────────────────────────────────────────────

function getTimetableDateTitle() {
    var now = new Date();
    var yy = String(now.getFullYear()).slice(2);
    var mm = now.getMonth() + 1;
    return 'AP수학 시간표 (' + yy + '년 ' + mm + '월)';
}

// 중등/고등 분리 기준
function getTimetableSectionForClass(cls) {
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    if (/고1|고2|고3|고등/.test(text)) return 'high';
    return 'middle';
}

// 고등부 학년 판정
function getTimetableHighGrade(cls) {
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    if (/고3/.test(text)) return '고3';
    if (/고2/.test(text)) return '고2';
    if (/고1/.test(text)) return '고1';
    return '고등';
}

// 요일묶음
function getTimetableDayGroup(cls) {
    var dg = String(cls.day_group || '').trim();
    if (dg !== '') return dg;

    var days = String(cls.schedule_days || '');
    if (!days) return 'custom';

    var arr = days.split(',').map(function(d) { return d.trim(); }).filter(Boolean);
    if (arr.indexOf('1') !== -1 && arr.indexOf('3') !== -1 && arr.indexOf('5') !== -1) return 'mwf';
    if (arr.indexOf('2') !== -1 && arr.indexOf('4') !== -1) return 'ttf';
    if (arr.length > 0) return 'custom';
    return 'custom';
}

function getTimetableDayGroupLabel(dayGroup) {
    if (dayGroup === 'mwf') return '월수금';
    if (dayGroup === 'ttf') return '화목금';
    return '기타';
}

// time_label → 분 (정렬용)
function _ttParseTimeMinutes(label) {
    if (!label || label === '시간 미지정') return Infinity;

    var m = String(label).match(/(\d+):(\d+)/);
    if (!m) return Infinity;

    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

// 시간대 목록 (오름차순)
function getTimetableTimeList(classes) {
    var timeSet = {};

    classes.forEach(function(cls) {
        var tl = cls.time_label || '시간 미지정';
        timeSet[tl] = true;
    });

    var arr = Object.keys(timeSet);
    arr.sort(function(a, b) {
        var pa = _ttParseTimeMinutes(a);
        var pb = _ttParseTimeMinutes(b);

        if (pa === Infinity && pb === Infinity) return String(a).localeCompare(String(b), 'ko');
        if (pa === Infinity) return 1;
        if (pb === Infinity) return -1;

        return pa - pb;
    });

    return arr;
}

// 중등부 교시 매핑: time_label → '1교시','2교시','3교시',...
function getTimetablePeriodMap(classes) {
    var timeList = getTimetableTimeList(classes);
    var names = ['1교시', '2교시', '3교시', '4교시', '5교시', '6교시'];
    var map = {};

    timeList.forEach(function(tl, idx) {
        map[tl] = names[idx] || (String(idx + 1) + '교시');
    });

    return map;
}

// 교사 컬럼 목록 (mwf→ttf→custom, 교사명 가나다)
function getTimetableTeacherList(classes) {
    var dagOrder = { mwf: 0, ttf: 1, custom: 2 };
    var seen = {};
    var result = [];

    classes.forEach(function(cls) {
        var dg = getTimetableDayGroup(cls);
        var tn = cls.teacher_name || '미지정';
        var key = dg + '|' + tn;

        if (!seen[key]) {
            seen[key] = true;
            result.push({ day_group: dg, teacher_name: tn });
        }
    });

    result.sort(function(a, b) {
        var da = dagOrder[a.day_group] !== undefined ? dagOrder[a.day_group] : 2;
        var db = dagOrder[b.day_group] !== undefined ? dagOrder[b.day_group] : 2;

        if (da !== db) return da - db;
        return String(a.teacher_name).localeCompare(String(b.teacher_name), 'ko');
    });

    return result;
}

// active 교재 (없으면 classes.textbook fallback)
function getTimetableActiveTextbooks(classId) {
    var books = (state.db.class_textbooks || []).filter(function(tb) {
        return String(tb.class_id) === String(classId) && tb.status === 'active';
    });

    if (books.length > 0) {
        return books.map(function(tb) { return String(tb.title || '').trim(); }).filter(Boolean);
    }

    var cls = (state.db.classes || []).find(function(c) { return String(c.id) === String(classId); });
    if (cls && cls.textbook) return [cls.textbook];

    return [];
}

// 최근 진도 기록 (class_daily_records + class_daily_progress)
function getTimetableRecentProgress(classId) {
    var records = (state.db.class_daily_records || [])
        .filter(function(r) { return String(r.class_id) === String(classId); })
        .sort(function(a, b) { return String(b.date).localeCompare(String(a.date)); });

    if (records.length === 0) return null;

    var latest = records[0];
    var progresses = (state.db.class_daily_progress || [])
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
// 학생 정보 (신입/휴원 포함)
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
        s.join_date ||
        s.joined_at ||
        s.enrolled_at ||
        s.enrollment_date ||
        s.registered_at ||
        s.registration_date ||
        s.created_at ||
        s.createdAt ||
        ''
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

    // 선생님 수동 지정 우선
    if (typeof isStudentNewMember === 'function' && isStudentNewMember(s)) return true;
    if (String(s.memo || '').indexOf('#신입') !== -1) return true;

    // 자동 기준: 해당 연도 6월 1일 이후 등록
    return _ttIsStudentNewByJuneFirst(s);
}

function _ttIsStudentLeave(s) {
    if (typeof isStudentOnLeave === 'function') return isStudentOnLeave(s);
    return !!(s && (s.status === '휴원' || String(s.memo || '').indexOf('#휴원') !== -1));
}

function getTimetableClassStudentsWithInfo(classId) {
    var sIds = (state.db.class_students || [])
        .filter(function(cs) { return String(cs.class_id) === String(classId); })
        .map(function(cs) { return String(cs.student_id); });

    return (state.db.students || [])
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
// 네비게이션
// ────────────────────────────────────────────

function openTimetableClass(classId) {
    leaveTimetableWideMode();

    if (typeof state !== 'undefined' && state.ui) {
        state.ui.currentClassId = String(classId);
        state.ui.returnView = { type: 'timetable' };
    }

    if (typeof renderClass === 'function') renderClass(String(classId));
    else if (typeof toast === 'function') toast('반 화면을 불러오지 못했습니다.', 'warn');
}

function openEditStudentFromTimetable(studentId) {
    if (typeof state !== 'undefined' && state.ui) {
        state.ui.returnView = { type: 'timetable' };
    }

    if (typeof openEditStudent === 'function') {
        openEditStudent(String(studentId), { returnTo: { type: 'timetable' } });
    }
}

function openAddStudentToClass(classId) {
    if (typeof state !== 'undefined' && state.ui) {
        state.ui.returnView = { type: 'timetable' };
    }

    if (typeof openAddStudent === 'function') {
        openAddStudent(String(classId), { returnTo: { type: 'timetable' } });
    }
}

// ────────────────────────────────────────────
// 반 카드 빌더
// ────────────────────────────────────────────

function buildTimetableStudentSlot(student, classId, slotIndex) {
    if (!student) {
        return '' +
            '<div class="tt-std-slot tt-std-slot-empty">' +
                '<button class="tt-std-empty" onclick="event.stopPropagation();openAddStudentToClass(\'' + apEscapeHtml(String(classId)) + '\')" title="빈칸 클릭 → 새 학생 추가">' +
                    '+ 추가' +
                '</button>' +
            '</div>';
    }

    var cls = 'tt-std-name' + (student.isNew ? ' tt-new' : '') + (student.isLeave ? ' tt-leave' : '');
    var nameText = apEscapeHtml(student.name) + (student.isNew ? '<span style="font-size:9px;">(신)</span>' : '');

    return '' +
        '<div class="tt-std-slot">' +
            '<span class="' + cls + '" onclick="event.stopPropagation();openEditStudentFromTimetable(\'' + apEscapeHtml(String(student.id)) + '\')" title="클릭 → 정보 수정">' +
                nameText +
            '</span>' +
        '</div>';
}

function buildTimetableStudentSlots(students, classId) {
    var slotCount = Math.max(TIMETABLE_STUDENT_SLOT_COUNT, students.length);
    var slots = [];

    for (var i = 0; i < slotCount; i += 1) {
        slots.push(buildTimetableStudentSlot(students[i] || null, classId, i));
    }

    return '<div class="tt-std-list">' + slots.join('') + '</div>';
}

function buildTimetableCard(cls) {
    var classId = cls.id;
    var books = getTimetableActiveTextbooks(classId);
    var progress = getTimetableRecentProgress(classId);
    var students = getTimetableClassStudentsWithInfo(classId);
    var timeLabel = cls.time_label && cls.time_label !== '시간 미지정' ? cls.time_label : '';

    var hdrHtml = '<div class="tt-card-hdr">' +
        '<span class="tt-cls-name" onclick="event.stopPropagation();openTimetableClass(\'' + apEscapeHtml(String(classId)) + '\')">' +
            apEscapeHtml(cls.name) +
        '</span>' +
        (timeLabel ? '<span class="tt-time">' + apEscapeHtml(timeLabel) + '</span>' : '') +
    '</div>';

    var bookHtml = '';
    if (books.length > 0) {
        bookHtml = '<div class="tt-book">' + books.map(function(b) { return apEscapeHtml(b); }).join(' · ') + '</div>';
    }

    var progressHtml = '';
    if (progress) {
        progressHtml = '<div class="tt-progress" title="' + apEscapeHtml(progress.date) + '">' + apEscapeHtml(progress.text) + '</div>';
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

    var allClasses = (typeof state !== 'undefined' ? state.db.classes || [] : [])
        .filter(function(c) { return Number(c.is_active) !== 0; });

    var sClasses = allClasses.filter(function(cls) {
        return getTimetableSectionForClass(cls) === section;
    });

    if (sClasses.length === 0) {
        wrapper.innerHTML =
            '<div style="padding:48px 0; text-align:center; color:var(--secondary); font-size:14px;">' +
                (section === 'middle' ? '중등부' : '고등부') + ' 반 데이터가 없습니다.<br>' +
                '<span style="font-size:12px; margin-top:6px; display:inline-block;">학급관리에서 반을 추가하고 요일묶음과 시간대를 설정하세요.</span>' +
            '</div>';
        return;
    }

    if (section === 'middle') {
        _renderMiddleGrid(sClasses, wrapper);
    } else {
        _renderHighGrid(sClasses, wrapper);
    }
}

// ────────────────────────────────────────────
// 중등부 그리드: 행=교시, 열=요일묶음+교사
// ────────────────────────────────────────────

function _renderMiddleGrid(sClasses, wrapper) {
    var teachers = getTimetableTeacherList(sClasses);
    var timeList = getTimetableTimeList(sClasses);
    var periodMap = getTimetablePeriodMap(sClasses);

    var dagOrder = ['mwf', 'ttf', 'custom'];
    var activeDayGroups = dagOrder.filter(function(dg) {
        return teachers.some(function(t) { return t.day_group === dg; });
    });

    var teachersByDg = {};
    dagOrder.forEach(function(dg) {
        teachersByDg[dg] = teachers.filter(function(t) { return t.day_group === dg; });
    });

    var dgBg  = { mwf: 'rgba(255,71,87,0.06)',  ttf: 'rgba(26,92,255,0.06)',  custom: 'var(--surface-2)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.13)',  ttf: 'rgba(26,92,255,0.13)', custom: 'rgba(100,100,100,0.09)' };

    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20;';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    var hr1 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:72px; font-weight:700; color:var(--secondary); text-align:center;">교시</th>';
    activeDayGroups.forEach(function(dg) {
        var cnt = teachersByDg[dg].length;
        hr1 += '<th colspan="' + cnt + '" style="' + stickyTop + ' background:' + dgHdr[dg] + '; ' + cellBase + ' font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + getTimetableDayGroupLabel(dg) + '</th>';
    });

    var hr2 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:72px; font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    activeDayGroups.forEach(function(dg) {
        teachersByDg[dg].forEach(function(t) {
            hr2 += '<th style="' + stickyTop + ' background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px; font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t.teacher_name) + '</th>';
        });
    });

    var bodyHtml = '';
    timeList.forEach(function(timeLabel) {
        var periodLabel = periodMap[timeLabel] || timeLabel;
        var shortTime = (timeLabel && timeLabel !== '시간 미지정') ? timeLabel : '';

        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' min-width:72px; text-align:center; vertical-align:middle; padding:8px 4px;">' +
            '<div class="tt-row-label">' + apEscapeHtml(periodLabel) + '</div>' +
            (shortTime ? '<div class="tt-row-sublabel">' + apEscapeHtml(shortTime) + '</div>' : '') +
        '</td>';

        activeDayGroups.forEach(function(dg) {
            teachersByDg[dg].forEach(function(t) {
                var matched = sClasses.filter(function(cls) {
                    return getTimetableDayGroup(cls) === dg &&
                           (cls.teacher_name || '미지정') === t.teacher_name &&
                           (cls.time_label || '시간 미지정') === timeLabel;
                });

                if (matched.length === 0) {
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '"></td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px;">' + cards + '</td>';
                }
            });
        });

        bodyHtml += '<tr>' + cells + '</tr>';
    });

    wrapper.innerHTML =
        '<div style="overflow:auto; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px;">' +
            '<table style="border-collapse:collapse; background:var(--surface); font-family:inherit; width:max-content; min-width:100%;">' +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + bodyHtml + '</tbody>' +
            '</table>' +
        '</div>';
}

// ────────────────────────────────────────────
// 고등부 그리드: 행=고1/고2/고3, 열=요일묶음+교사
// ────────────────────────────────────────────

function _renderHighGrid(sClasses, wrapper) {
    var teachers = getTimetableTeacherList(sClasses);

    var dagOrder = ['mwf', 'ttf', 'custom'];
    var activeDayGroups = dagOrder.filter(function(dg) {
        return teachers.some(function(t) { return t.day_group === dg; });
    });

    var teachersByDg = {};
    dagOrder.forEach(function(dg) {
        teachersByDg[dg] = teachers.filter(function(t) { return t.day_group === dg; });
    });

    var allHighGrades = ['고1', '고2', '고3', '고등'];
    var gradePresent = {};
    sClasses.forEach(function(cls) {
        gradePresent[getTimetableHighGrade(cls)] = true;
    });

    var gradeRows = allHighGrades.filter(function(g) {
        return gradePresent[g];
    });

    var dgBg  = { mwf: 'rgba(255,71,87,0.06)',  ttf: 'rgba(26,92,255,0.06)',  custom: 'var(--surface-2)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.13)',  ttf: 'rgba(26,92,255,0.13)', custom: 'rgba(100,100,100,0.09)' };

    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20;';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var cellBase     = 'padding:6px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    var hr1 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:60px; font-weight:700; color:var(--secondary); text-align:center;">학년</th>';
    activeDayGroups.forEach(function(dg) {
        var cnt = teachersByDg[dg].length;
        hr1 += '<th colspan="' + cnt + '" style="' + stickyTop + ' background:' + dgHdr[dg] + '; ' + cellBase + ' font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + getTimetableDayGroupLabel(dg) + '</th>';
    });

    var hr2 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:60px; font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    activeDayGroups.forEach(function(dg) {
        teachersByDg[dg].forEach(function(t) {
            hr2 += '<th style="' + stickyTop + ' background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px; font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t.teacher_name) + '</th>';
        });
    });

    var bodyHtml = '';
    gradeRows.forEach(function(grade) {
        var gradeClasses = sClasses.filter(function(cls) {
            return getTimetableHighGrade(cls) === grade;
        });

        var cells = '<td style="' + stickyLeft + ' ' + cellBase + ' min-width:60px; text-align:center; vertical-align:middle; padding:8px 4px;">' +
            '<div class="tt-row-label" style="font-size:15px;">' + apEscapeHtml(grade) + '</div>' +
        '</td>';

        activeDayGroups.forEach(function(dg) {
            teachersByDg[dg].forEach(function(t) {
                var matched = gradeClasses.filter(function(cls) {
                    return getTimetableDayGroup(cls) === dg &&
                           (cls.teacher_name || '미지정') === t.teacher_name;
                });

                if (matched.length === 0) {
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '"></td>';
                } else {
                    var cards = matched.map(function(cls) { return buildTimetableCard(cls); }).join('');
                    cells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + ' min-width:130px;">' + cards + '</td>';
                }
            });
        });

        bodyHtml += '<tr>' + cells + '</tr>';
    });

    wrapper.innerHTML =
        '<div style="overflow:auto; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px;">' +
            '<table style="border-collapse:collapse; background:var(--surface); font-family:inherit; width:max-content; min-width:100%;">' +
                '<thead><tr>' + hr1 + '</tr><tr>' + hr2 + '</tr></thead>' +
                '<tbody>' + bodyHtml + '</tbody>' +
            '</table>' +
        '</div>';
}