/**
 * AP Math OS [js/timetable.js]
 * 전체 시간표 - 기존 반 카드 데이터 기반 PC 풀스크린 엑셀형 시간표
 * 원본 데이터: state.db.classes / class_students / students / class_textbooks
 * 새 DB 테이블 없음. timetable_cells / timetable_cell_students 생성 금지.
 */

// ──────────────────────────────────────────────
// 유틸
// ──────────────────────────────────────────────

function enterTimetableWideMode() {
    const root = document.getElementById('app-root');
    const main = root ? root.closest('main') : null;
    if (main) main.classList.add('ap-timetable-wide-main');
}

function leaveTimetableWideMode() {
    const main = document.querySelector('main.ap-timetable-wide-main');
    if (main) main.classList.remove('ap-timetable-wide-main');
}

function installTimetableStyle() {
    if (document.getElementById('ap-timetable-style')) return;
    const style = document.createElement('style');
    style.id = 'ap-timetable-style';
    style.textContent = `
        @media (min-width:901px) {
            main.ap-timetable-wide-main {
                max-width: none !important;
                width: calc(100vw - 56px) !important;
                margin: 0 !important;
                padding-left: 24px !important;
                padding-right: 24px !important;
            }
            body.ap-drawer-expanded main.ap-timetable-wide-main {
                width: calc(100vw - 260px) !important;
            }
        }
        #timetable-root {
            max-width: none !important;
            width: 100% !important;
        }
    `;
    document.head.appendChild(style);
}

function getTimetableDateTitle() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = now.getMonth() + 1;
    return 'AP수학 시간표 (' + yy + '년' + mm + '월)';
}

// 중등/고등 분리 기준
function getTimetableSectionForClass(cls) {
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    if (/고1|고2|고3|고등/.test(text)) return 'high';
    return 'middle';
}

// 요일묶음 판정: cls.day_group 우선, 없으면 schedule_days 추론
function getTimetableDayGroup(cls) {
    const dg = String(cls.day_group || '').trim();
    if (dg !== '') return dg;
    const days = String(cls.schedule_days || '');
    if (!days) return 'custom';
    const arr = days.split(',').map(function(d) { return d.trim(); }).filter(Boolean);
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

// time_label 앞 시간을 분 단위로 파싱 (정렬용)
function _ttParseTimeMinutes(label) {
    if (!label || label === '시간 미지정') return Infinity;
    var m = label.match(/(\d+):(\d+)/);
    if (!m) return Infinity;
    return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

// 시간대 목록 (정렬: 시간 오름차순, 미지정은 마지막)
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

// (day_group, teacher_name) 컬럼 목록 (정렬: mwf→ttf→custom, 교사명 가나다순)
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

// active 교재 목록 반환 (없으면 classes.textbook, 그것도 없으면 '교재 미등록')
function getTimetableActiveTextbooks(classId) {
    var books = (state.db.class_textbooks || []).filter(function(tb) {
        return String(tb.class_id) === String(classId) && tb.status === 'active';
    });
    if (books.length > 0) {
        return books.map(function(tb) { return String(tb.title || '').trim(); }).filter(Boolean);
    }
    var cls = (state.db.classes || []).find(function(c) { return String(c.id) === String(classId); });
    if (cls && cls.textbook) return [cls.textbook];
    return ['교재 미등록'];
}

// 재원 학생 이름 목록
function getTimetableClassStudents(classId) {
    var sIds = (state.db.class_students || [])
        .filter(function(cs) { return String(cs.class_id) === String(classId); })
        .map(function(cs) { return cs.student_id; });
    return (state.db.students || [])
        .filter(function(s) { return sIds.indexOf(s.id) !== -1 && s.status === '재원'; })
        .map(function(s) { return s.name; });
}

// 반 카드 클릭 → renderClass()로 이동
function openTimetableClass(classId) {
    leaveTimetableWideMode();
    if (typeof state !== 'undefined' && state.ui) state.ui.currentClassId = String(classId);
    if (typeof renderClass === 'function') renderClass(String(classId));
    else if (typeof toast === 'function') toast('반 화면을 불러오지 못했습니다.', 'warn');
}

// ──────────────────────────────────────────────
// 메인 렌더링
// ──────────────────────────────────────────────

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

// ──────────────────────────────────────────────
// 그리드 렌더링
// ──────────────────────────────────────────────

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
                '<span style="font-size:12px; margin-top:6px; display:inline-block;">' +
                    '학급관리에서 반을 추가하고 요일묶음과 시간대를 설정하세요.' +
                '</span>' +
            '</div>';
        return;
    }

    var teachers = getTimetableTeacherList(sClasses);
    var timeList = getTimetableTimeList(sClasses);
    var dagOrder = ['mwf', 'ttf', 'custom'];
    var activeDayGroups = dagOrder.filter(function(dg) {
        return teachers.some(function(t) { return t.day_group === dg; });
    });
    var teachersByDg = {};
    dagOrder.forEach(function(dg) {
        teachersByDg[dg] = teachers.filter(function(t) { return t.day_group === dg; });
    });

    // 색상 팔레트
    var dgBg  = { mwf: 'rgba(255,71,87,0.06)',  ttf: 'rgba(26,92,255,0.06)',  custom: 'var(--surface-2)' };
    var dgHdr = { mwf: 'rgba(255,71,87,0.13)',  ttf: 'rgba(26,92,255,0.13)', custom: 'rgba(100,100,100,0.09)' };
    var dgTb  = { mwf: 'rgba(255,71,87,0.03)',  ttf: 'rgba(26,92,255,0.03)', custom: 'rgba(100,100,100,0.03)' };

    var stickyCorner = 'position:sticky; left:0; top:0; z-index:31; background:var(--surface);';
    var stickyTop    = 'position:sticky; top:0; z-index:20;';
    var stickyLeft   = 'position:sticky; left:0; z-index:10; background:var(--surface);';
    var stickyLeftTb = 'position:sticky; left:0; z-index:10; background:var(--surface-2);';
    var cellBase = 'padding:8px 6px; border:1px solid var(--border); font-size:12px; vertical-align:top;';

    // ── 헤더 1행: 시간 + 요일묶음 그룹 헤더 ──
    var hr1 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:82px; font-weight:700; color:var(--secondary); text-align:center; white-space:nowrap;">시간</th>';
    activeDayGroups.forEach(function(dg) {
        var cnt = teachersByDg[dg].length;
        var lbl = getTimetableDayGroupLabel(dg);
        hr1 += '<th colspan="' + cnt + '" style="' + stickyTop + ' background:' + dgHdr[dg] + '; ' + cellBase + ' font-size:13px; font-weight:700; color:var(--text); text-align:center;">' + lbl + '</th>';
    });

    // ── 헤더 2행: 담당 교사 컬럼 ──
    var hr2 = '<th style="' + stickyCorner + ' ' + cellBase + ' min-width:82px; font-size:11px; font-weight:600; color:var(--secondary); text-align:center;">담당 교사</th>';
    activeDayGroups.forEach(function(dg) {
        teachersByDg[dg].forEach(function(t) {
            hr2 += '<th style="' + stickyTop + ' background:' + dgBg[dg] + '; ' + cellBase + ' min-width:110px; font-weight:700; color:var(--text); text-align:center;">' + apEscapeHtml(t.teacher_name) + '</th>';
        });
    });

    // ── 본문 행 ──
    var bodyHtml = '';

    timeList.forEach(function(timeLabel) {
        // 학생 행
        var sCells = '<td style="' + stickyLeft + ' ' + cellBase + ' font-weight:700; white-space:nowrap; text-align:center; vertical-align:middle; padding:8px 10px;">' + apEscapeHtml(timeLabel) + '</td>';
        // 교재 행
        var tCells = '<td style="' + stickyLeftTb + ' ' + cellBase + ' font-size:11px; color:var(--secondary); text-align:center; white-space:nowrap; vertical-align:middle; padding:5px 10px;">교재</td>';

        activeDayGroups.forEach(function(dg) {
            teachersByDg[dg].forEach(function(t) {
                var matched = sClasses.filter(function(cls) {
                    return getTimetableDayGroup(cls) === dg &&
                           (cls.teacher_name || '미지정') === t.teacher_name &&
                           (cls.time_label || '시간 미지정') === timeLabel;
                });

                if (matched.length === 0) {
                    sCells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '"></td>';
                    tCells += '<td style="background:' + dgTb[dg] + '; ' + cellBase + '"></td>';
                } else {
                    // 반 카드 목록
                    var cards = matched.map(function(cls) {
                        var students = getTimetableClassStudents(cls.id);
                        var stuHtml = students.length > 0
                            ? students.map(function(n) { return apEscapeHtml(n); }).join('<br>')
                            : '<span style="color:var(--secondary); font-size:11px;">학생 없음</span>';
                        return '<div onclick="openTimetableClass(\'' + cls.id + '\')" ' +
                               'title="' + apEscapeHtml(cls.name) + '" ' +
                               'style="cursor:pointer; padding:5px 7px; background:var(--surface); border-radius:7px; margin-bottom:4px; border:1px solid var(--border);" ' +
                               'onmouseover="this.style.background=\'var(--bg)\'" onmouseout="this.style.background=\'var(--surface)\'">' +
                                   '<div style="font-size:12px; font-weight:700; color:var(--text); margin-bottom:2px;">' + apEscapeHtml(cls.name) + '</div>' +
                                   '<div style="font-size:12px; color:var(--text-soft); line-height:1.55;">' + stuHtml + '</div>' +
                               '</div>';
                    }).join('');
                    sCells += '<td style="background:' + dgBg[dg] + '; ' + cellBase + '">' + cards + '</td>';

                    // 교재 셀
                    var tbParts = matched.map(function(cls) {
                        return getTimetableActiveTextbooks(cls.id).map(function(b) { return apEscapeHtml(b); }).join(', ');
                    }).join(' / ');
                    tCells += '<td style="background:' + dgTb[dg] + '; ' + cellBase + ' font-size:11px; color:var(--text-soft);">' + tbParts + '</td>';
                }
            });
        });

        bodyHtml += '<tr>' + sCells + '</tr>';
        bodyHtml += '<tr>' + tCells + '</tr>';
    });

    wrapper.innerHTML =
        '<div style="overflow:auto; max-height:calc(100vh - 175px); border:1px solid var(--border); border-radius:10px;">' +
            '<table style="border-collapse:collapse; background:var(--surface); font-family:inherit;">' +
                '<thead>' +
                    '<tr>' + hr1 + '</tr>' +
                    '<tr>' + hr2 + '</tr>' +
                '</thead>' +
                '<tbody>' + bodyHtml + '</tbody>' +
            '</table>' +
        '</div>';
}