/**
 * AP Math OS [cumulative.js]
 * 출석부 + 성적표
 * QR/OMR exam_sessions 와 완전히 별도.
 *
 * 화면 규칙:
 * - 출석부/성적표 상단 헤더는 대시보드 헤더와 같은 AP MATH 로고 구조를 따른다.
 * - 별도 뒤로가기 버튼과 닫기 버튼을 두지 않는다.
 * - AP MATH 로고 클릭으로 대시보드로 나간다.
 * - 날짜/필터/반 선택 컨트롤은 헤더 안에 두지 않고 헤더 아래 본문 상단에 둔다.
 * - 반명과 학생명 등 좌측 주요 정보는 스티키(Sticky)로 고정한다.
 * - 모든 셀(이름, 날짜, 데이터)은 가운데 정렬을 원칙으로 한다.
 */

// ── 공통 헬퍼 ─────────────────────────────────────────────────────

function getCumulativeClassIdForStudent(studentId) {
    const mapping = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return mapping ? String(mapping.class_id) : '';
}

function getCumulativeClassName(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    return cls ? cls.name : '';
}

function getCumulativeStudent(studentId) {
    return (state.db.students || []).find(s => String(s.id) === String(studentId));
}

function getCumulativeExamTypeLabel(type) {
    const map = { midterm: '중간', final: '기말', performance: '수행', etc: '기타' };
    return map[type] || type || '기타';
}

function getCumulativeGradeRankText(value) {
    const text = String(value || '');
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function getCumulativeVisibleStudents(filters = {}) {
    let students = (state.db.students || []).filter(s => s.status === '재원');
    if (filters.classId) {
        const ids = (state.db.class_students || [])
            .filter(m => String(m.class_id) === String(filters.classId))
            .map(m => String(m.student_id));
        students = students.filter(s => ids.includes(String(s.id)));
    }
    if (filters.grade) {
        students = students.filter(s => String(s.grade || '').includes(filters.grade));
    }
    return students.sort((a, b) => {
        const gradeDiff = getCumulativeGradeRankText(a.grade) - getCumulativeGradeRankText(b.grade);
        if (gradeDiff !== 0) return gradeDiff;
        const aClass = getCumulativeClassName(getCumulativeClassIdForStudent(a.id));
        const bClass = getCumulativeClassName(getCumulativeClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko');
        if (classDiff !== 0) return classDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function sortCumulativeClasses(classes = []) {
    return [...classes].sort((a, b) => {
        const gradeDiff = getCumulativeGradeRankText(a.grade || a.name) - getCumulativeGradeRankText(b.grade || b.name);
        if (gradeDiff !== 0) return gradeDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function sortCumulativeStudents(students = []) {
    return [...students].sort((a, b) => {
        const aClass = getCumulativeClassName(getCumulativeClassIdForStudent(a.id));
        const bClass = getCumulativeClassName(getCumulativeClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko');
        if (classDiff !== 0) return classDiff;
        const gradeDiff = getCumulativeGradeRankText(a.grade) - getCumulativeGradeRankText(b.grade);
        if (gradeDiff !== 0) return gradeDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

// ── 월 출석 데이터 로드/캐시 ─────────────────────────────────────

function getMonthDays(month) {
    const m = String(month || '').trim();
    if (!/^\d{4}-\d{2}$/.test(m)) return [];
    const [year, monthNo] = m.split('-').map(Number);
    const endDay = new Date(year, monthNo, 0).getDate();
    return Array.from({ length: endDay }, (_, idx) => `${m}-${String(idx + 1).padStart(2, '0')}`);
}

async function loadMonthlyAttendance(month, force = false) {
    const safeMonth = String(month || new Date().toLocaleDateString('sv-SE').slice(0, 7)).trim();
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};

    if (!force && state.ui.monthlyAttendanceCache[safeMonth]) {
        return state.ui.monthlyAttendanceCache[safeMonth];
    }

    const data = await api.get(`attendance-month?month=${encodeURIComponent(safeMonth)}`);
    const payload = data?.success ? {
        month: safeMonth,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        academy_schedules: Array.isArray(data.academy_schedules) ? data.academy_schedules : []
    } : { month: safeMonth, attendance: [], homework: [], academy_schedules: [] };

    state.ui.monthlyAttendanceCache[safeMonth] = payload;
    return payload;
}

function getMonthlyAttendanceData() {
    const month = state.ui.attendanceLedgerMonth || state.ui.monthlyAttendanceMonth
        || new Date().toLocaleDateString('sv-SE').slice(0, 7);
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    return state.ui.monthlyAttendanceCache[month] || { month, attendance: [], homework: [], academy_schedules: [] };
}

function getMonthlyAttendanceStatus(studentId, date) {
    const data = getMonthlyAttendanceData();
    const sid = String(studentId);
    const attendance = (data.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === date);
    const homework = (data.homework || []).find(h => String(h.student_id) === sid && String(h.date || '') === date);
    return { attendance: attendance?.status || '', homework: homework?.status || '' };
}

function getMonthlyScheduleBadges(studentId, date) {
    const data = getMonthlyAttendanceData();
    const sid = String(studentId);
    const schedules = (data.academy_schedules || []).filter(s => {
        if (String(s.is_deleted || 0) === '1') return false;
        if (String(s.schedule_date || '') !== date) return false;
        if (s.target_scope === 'student') return String(s.student_id || '') === sid;
        return true;
    });
    return {
        globalClosed: schedules.some(s => s.schedule_type === 'closed' && s.target_scope !== 'student'),
        studentClosed: schedules.some(s => s.schedule_type === 'closed' && s.target_scope === 'student'),
        makeup: schedules.some(s => s.schedule_type === 'makeup' && s.target_scope === 'student'),
        consultation: schedules.some(s => s.schedule_type === 'consultation' && s.target_scope === 'student')
    };
}

function getAttendanceStudentJoinedDate(student) {
    if (!student) return '';
    const raw = String(
        student.join_date || student.joined_at || student.enrolled_at || student.enrollment_date ||
        student.registered_at || student.registration_date || student.created_at || student.createdAt || ''
    ).trim();
    const m = raw.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (!m) return '';
    return [m[1], String(m[2]).padStart(2, '0'), String(m[3]).padStart(2, '0')].join('-');
}

function isAttendanceNewStudent(student) {
    const joined = getAttendanceStudentJoinedDate(student);
    if (!joined) return false;
    const year = new Date().getFullYear();
    return joined >= `${year}-06-01`;
}

function isAttendanceLeaveStudent(student) {
    return !!(student && (student.status === '휴원' || String(student.memo || '').includes('#휴원')));
}

function getAttendanceStudentNameStyle(student) {
    if (isAttendanceLeaveStudent(student)) return 'color:#FF8C00;';
    if (isAttendanceNewStudent(student)) return 'color:var(--primary);';
    return 'color:var(--text);';
}

// ── 출석부 장부 ──────────────────────────────────────────────────

function _attDayName(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
}

function _attDayStyle(dateStr) {
    const day = new Date(dateStr + 'T00:00:00').getDay();
    if (day === 0) return 'color:#e53935;';
    if (day === 6) return 'color:#1565c0;';
    return 'color:var(--secondary);';
}

function goAttendanceHome() {
    closeAttendanceLedger();
    closeSchoolExamLedger();

    if (typeof state !== 'undefined' && state.ui) {
        state.ui.currentClassId = null;
        state.ui.returnView = null;
    }

    if (typeof goHome === 'function') {
        goHome();
        return;
    }

    if (state?.auth?.role === 'admin' && typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
        return;
    }

    if (typeof renderDashboard === 'function') {
        renderDashboard();
        return;
    }
}

function closeAttendanceLedger() {
    if (typeof leaveTimetableWideMode === 'function') leaveTimetableWideMode();
}

function openEditStudentFromAttendance(sid) {
    state.ui.returnView = { type: 'attendance' };
    if (typeof openEditStudent === 'function') openEditStudent(sid, { returnTo: { type: 'attendance' } });
}

function openAddStudentFromAttendance(classId) {
    state.ui.returnView = { type: 'attendance' };
    if (typeof openAddStudent === 'function') openAddStudent(classId, { returnTo: { type: 'attendance' } });
}

function renderAttendanceCellContent(studentId, date) {
    const schedule = getMonthlyScheduleBadges(studentId, date);
    if (schedule.globalClosed || schedule.studentClosed) {
        return '<span class="att-sign" style="font-size:10px;font-weight:700;color:#e53935;background:rgba(229,57,53,0.09);">휴</span>';
    }

    const status = getMonthlyAttendanceStatus(studentId, date);
    const att = status.attendance || '';

    if (att === '등원') return '<span class="att-sign" style="font-size:14px;font-weight:800;color:var(--success);">○</span>';
    if (att === '결석') return '<span class="att-sign" style="font-size:14px;font-weight:800;color:#e53935;">×</span>';
    if (att === '지각') return '<span class="att-sign" style="font-size:13px;font-weight:800;color:#f59f00;">△</span>';
    if (att === '보강') return '<span class="att-sign" style="font-size:14px;font-weight:800;color:var(--primary);">＋</span>';
    if (att === '상담') return '<span class="att-sign" style="font-size:13px;font-weight:800;color:#7c3aed;">★</span>';

    return '<span class="att-sign" style="font-size:12px;font-weight:700;color:var(--border);">-</span>';
}

function openAttendanceLedger() {
    if (!state.ui.attendanceLedgerMonth) {
        state.ui.attendanceLedgerMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7);
    }
    
    if (typeof enterTimetableWideMode === 'function') enterTimetableWideMode();

    var root = document.getElementById('app-root');
    if (!root) return;

    var activeClasses = sortCumulativeClasses((state.db.classes || []).filter(function(c) { return Number(c.is_active) !== 0; }));
    var classOptions = activeClasses.map(function(c) {
        return '<option value="' + apEscapeHtml(c.id) + '">' + apEscapeHtml(c.name) + '</option>';
    }).join('');

    root.innerHTML = `
<style>
#att-main { width: 100%; height: calc(100vh - 56px); display: flex; flex-direction: column; padding: 12px 16px 0; box-sizing: border-box; }
#att-header-row { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 12px; flex-shrink: 0; }
#att-title { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; white-space: nowrap; }
#att-controls { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.att-ctrl { height: 36px; padding: 0 10px; border-radius: 9px; border: 1px solid var(--border); background: var(--surface); color: var(--text); font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
#att-legend { font-size: 11px; font-weight: 600; color: var(--secondary); display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; flex-shrink: 0; }
#att-tbl-wrap { flex: 1; overflow: auto; border: 1px solid var(--border); border-radius: 12px 12px 0 0; background: var(--surface); }
#att-tbl { border-collapse: collapse; width: max-content; }
#att-tbl th, #att-tbl td { border-bottom: 1px solid var(--border); border-right: 1px solid var(--border); text-align: center; } 
#att-tbl thead th { position: sticky; top: 0; z-index: 10; background: var(--surface); box-shadow: 0 1px 0 var(--border); padding: 6px 0; }
.att-nc { position: sticky; left: 0; z-index: 11; background: var(--surface); border-right: 2px solid var(--border) !important; text-align: center; } 
#att-tbl thead .att-nc { z-index: 12; }
.att-dc { padding: 3px; text-align: center; width: 32px; min-width: 32px; cursor: pointer; user-select: none; }
.att-dc:active { opacity: .7; }
.att-hol { cursor: default; }
.att-grp-row td { background: var(--surface-2); }
.att-grp-nc { position: sticky; left: 0; z-index: 11; background: var(--surface-2); font-size: 12px; font-weight: 800; color: var(--text); padding: 5px 12px; text-align: center; border-right: 2px solid var(--border) !important; } 
.att-student-nc { padding: 4px 12px; min-width: 90px; text-align: center; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.att-student-nc:hover { background: var(--surface-2); }
.att-sign { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 6px; }
</style>
<div id="att-main">
  <div id="att-header-row">
    <div id="att-title">출석부</div>
    <div id="att-controls"> 
      <input type="month" class="att-ctrl" id="att-mon" value="${apEscapeHtml(state.ui.attendanceLedgerMonth)}" onchange="state.ui.attendanceLedgerMonth=this.value; loadMonthlyAttendance(this.value, true).then(()=>renderAttendanceLedgerTable());">
      <select class="att-ctrl" id="att-sec" onchange="renderAttendanceLedgerTable()">
        <option value="">전체 (중/고)</option>
        <option value="middle">중등부</option>
        <option value="high">고등부</option>
      </select>
      <select class="att-ctrl" id="att-cls" onchange="renderAttendanceLedgerTable()">
        <option value="">전체 반</option>${classOptions}
      </select>
    </div>
  </div>
  <div id="att-legend">
    <span>○ 등원</span><span>× 결석</span><span>△ 지각</span><span>＋ 보강</span><span>★ 상담</span><span>- 미기록</span><span>휴 휴무</span>
  </div>
  <div id="att-tbl-wrap">
    <div id="att-tbl-root"></div>
  </div>
</div>`;

    loadMonthlyAttendance(state.ui.attendanceLedgerMonth, true).then(function() { renderAttendanceLedgerTable(); });
}

function renderAttendanceLedgerTable() {
    const root = document.getElementById('att-tbl-root');
    if (!root) return;

    const month = state.ui.attendanceLedgerMonth || new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const days = getMonthDays(month);
    const classId = document.getElementById('att-cls')?.value || '';
    const section = document.getElementById('att-sec')?.value || '';

    let activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));

    if (section) {
        activeClasses = activeClasses.filter(c => {
            const isHigh = /고1|고2|고3|고등/.test(String(c.grade || '') + ' ' + String(c.name || ''));
            return section === 'high' ? isHigh : !isHigh;
        });
    }

    const students = sortCumulativeStudents(getCumulativeVisibleStudents({ classId }));

    const grouped = activeClasses
        .filter(c => !classId || String(c.id) === String(classId))
        .map(cls => ({
            cls,
            students: students.filter(s => String(getCumulativeClassIdForStudent(s.id)) === String(cls.id))
        }))
        .filter(g => g.students.length);

    const headerCells = days.map(d => {
        const num = Number(d.slice(-2));
        const dayName = _attDayName(d);
        const style = _attDayStyle(d);
        return `<th style="width:32px;min-width:32px;${style}"><div style="font-size:11px;font-weight:700;line-height:1.2;text-align:center;">${num}</div><div style="font-size:10px;font-weight:600;line-height:1.2;text-align:center;">${dayName}</div></th>`;
    }).join('');

    const bodyRows = grouped.map(g => {
        const classEmptyCols = days.map(() => '<td></td>').join('');
        const groupRow = `<tr class="att-grp-row"><td class="att-grp-nc">${apEscapeHtml(g.cls.name)}</td>${classEmptyCols}</tr>`;
        
        const sRows = g.students.map(s => {
            const sid = String(s.id);
            const dateCells = days.map(d => {
                const sched = getMonthlyScheduleBadges(sid, d);
                const isHol = sched.globalClosed || sched.studentClosed;
                const cls = isHol ? 'att-dc att-hol' : 'att-dc';
                const click = isHol ? '' : `onclick="toggleAttendanceCellStatus('${sid}','${d}')"`;
                return `<td class="${cls}" id="att-cell-${sid}-${d}" ${click}>${renderAttendanceCellContent(sid, d)}</td>`;
            }).join('');
            
            const nameStyle = getAttendanceStudentNameStyle(s);
            return `<tr><td class="att-nc att-student-nc" style="${nameStyle}" onclick="openEditStudentFromAttendance('${sid}')">${apEscapeHtml(s.name)}</td>${dateCells}</tr>`;
        }).join('');
        
        const emptyCols = days.map(() => '<td></td>').join('');
        const emptyRow = `<tr onclick="openAddStudentFromAttendance('${apEscapeHtml(String(g.cls.id))}')" style="cursor:pointer;" onmouseover="this.style.background='rgba(26,92,255,0.04)'" onmouseout="this.style.background=''">
            <td class="att-nc att-student-nc" style="color:var(--secondary);text-align:center;font-size:15px;font-weight:800;">+</td>${emptyCols}</tr>`;
        
        return groupRow + sRows + emptyRow;
    }).join('');

    const empty = `<tr><td colspan="${days.length + 1}" style="padding:40px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;">표시할 학생이 없습니다.</td></tr>`;

    root.innerHTML = `<table id="att-tbl">
<thead><tr>
  <th class="att-nc" style="padding:6px 12px;min-width:90px;text-align:center;font-size:11px;font-weight:700;color:var(--secondary);">이름</th>
  ${headerCells}
</tr></thead>
<tbody>${bodyRows || empty}</tbody>
</table>`;
}

async function toggleAttendanceCellStatus(studentId, date) {
    const sched = getMonthlyScheduleBadges(studentId, date);
    if (sched.globalClosed || sched.studentClosed) return;

    const data = getMonthlyAttendanceData();
    if (!data.attendance) data.attendance = [];

    const sid = String(studentId);
    const existing = data.attendance.find(a => String(a.student_id) === sid && String(a.date) === date);
    const current = existing?.status || '';

    let next;
    if (!current || current === '미기록') next = '등원';
    else if (current === '등원') next = '결석';
    else if (current === '결석') next = '지각';
    else if (current === '지각') next = '보강';
    else if (current === '보강') next = '상담';
    else next = '미기록';

    if (existing) {
        existing.status = next;
    } else {
        data.attendance.push({ student_id: sid, date, status: next });
    }

    const cellEl = document.getElementById(`att-cell-${studentId}-${date}`);
    if (cellEl) cellEl.innerHTML = renderAttendanceCellContent(sid, date);

    try {
        const r = await api.patch('attendance', { studentId, date, status: next });
        if (!r?.success) throw new Error(r?.message || 'fail');
    } catch {
        if (existing) {
            existing.status = current;
        } else {
            data.attendance = data.attendance.filter(a => !(String(a.student_id) === sid && String(a.date) === date));
        }
        if (cellEl) cellEl.innerHTML = renderAttendanceCellContent(sid, date);
        toast('출석 저장에 실패했습니다.', 'warn');
    }
}

// ── 성적표 장부 (개편) ─────────────────────────────────────────────

var SEB_COLS = [
    { semester: '1학기', examType: 'midterm', key: '1H-mid', label: '중간' },
    { semester: '1학기', examType: 'final',   key: '1H-fin', label: '기말' },
    { semester: '2학기', examType: 'midterm', key: '2H-mid', label: '중간' },
    { semester: '2학기', examType: 'final',   key: '2H-fin', label: '기말' }
];

function getSebExamRecord(studentId, year, semester, examType) {
    return (state.db.school_exam_records || []).find(function(r) {
        return String(r.student_id) === String(studentId) &&
               Number(r.exam_year) === Number(year) &&
               String(r.semester || '') === semester &&
               String(r.exam_type || '') === examType &&
               String(r.subject || '') === '수학' &&
               String(r.is_deleted || 0) !== '1';
    });
}

function getSebVisibleStudents() {
    var section = state.ui.schoolExamSection || 'middle';
    var classId = state.ui.schoolExamClassId || '';
    var teacherFilter = state.ui.schoolExamTeacher || '';

    var students = getCumulativeVisibleStudents({ classId: classId });

    if (teacherFilter) {
        var tClassIds = (state.db.classes || [])
            .filter(function(c) { return c.teacher_name === teacherFilter; })
            .map(function(c) { return String(c.id); });
        students = students.filter(function(s) {
            return tClassIds.indexOf(getCumulativeClassIdForStudent(s.id)) !== -1;
        });
    }

    students = students.filter(function(s) {
        var grade = String(s.grade || '');
        var isHigh = /고1|고2|고3/.test(grade);
        return section === 'high' ? isHigh : !isHigh;
    });

    return students;
}

function _sebToggleSortCol() {
    var el = document.getElementById('seb-sort-col');
    var sortEl = document.getElementById('seb-sort');
    if (el && sortEl) el.style.display = sortEl.value === 'score-desc' ? 'block' : 'none';
}

function closeSchoolExamLedger() {
    if (typeof leaveTimetableWideMode === 'function') leaveTimetableWideMode();
}

function openSchoolExamLedger() {
    var currentYear = new Date().getFullYear();
    var isAdmin = !!(state.auth && state.auth.role === 'admin');

    if (!state.ui.schoolExamYear) state.ui.schoolExamYear = currentYear;
    if (!state.ui.schoolExamSection) state.ui.schoolExamSection = 'middle';
    if (!state.ui.schoolExamClassId) state.ui.schoolExamClassId = '';
    if (!state.ui.schoolExamTeacher) state.ui.schoolExamTeacher = '';
    if (!state.ui.schoolExamSort) state.ui.schoolExamSort = 'default';
    if (!state.ui.schoolExamSortCol) state.ui.schoolExamSortCol = '1H-mid';

    if (typeof enterTimetableWideMode === 'function') enterTimetableWideMode();

    var root = document.getElementById('app-root');
    if (!root) return;

    var section = state.ui.schoolExamSection;
    var sort = state.ui.schoolExamSort;
    var sortCol = state.ui.schoolExamSortCol;
    var year = Number(state.ui.schoolExamYear) || currentYear;
    var teacherFilter = state.ui.schoolExamTeacher;

    var activeClasses = sortCumulativeClasses((state.db.classes || []).filter(function(c) {
        return Number(c.is_active) !== 0;
    }));
    var sectionClasses = activeClasses.filter(function(c) {
        var isHigh = /고1|고2|고3/.test(String(c.grade || '') + ' ' + String(c.name || ''));
        return section === 'high' ? isHigh : !isHigh;
    });
    var filteredClasses = teacherFilter
        ? sectionClasses.filter(function(c) { return c.teacher_name === teacherFilter; })
        : sectionClasses;

    var classOptions = '<option value="">전체</option>' + filteredClasses.map(function(c) {
        return '<option value="' + apEscapeHtml(c.id) + '"' +
            (String(c.id) === String(state.ui.schoolExamClassId) ? ' selected' : '') +
            '>' + apEscapeHtml(c.name) + '</option>';
    }).join('');

    var yearOptions = Array.from({length: 5}, function(_, i) { return currentYear - 2 + i; }).map(function(y) {
        return '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
    }).join('');

    var teacherHtml = '';
    if (isAdmin) {
        var teachers = [];
        var seen = {};
        (state.db.classes || []).forEach(function(c) {
            var t = c.teacher_name || '';
            if (t && !seen[t]) { seen[t] = true; teachers.push(t); }
        });
        teachers.sort();
        var tOpts = '<option value="">전체 선생님</option>' + teachers.map(function(t) {
            return '<option value="' + apEscapeHtml(t) + '"' + (t === teacherFilter ? ' selected' : '') + '>' + apEscapeHtml(t) + '</option>';
        }).join('');
        teacherHtml = '<select class="seb-ctrl" id="seb-teacher" onchange="state.ui.schoolExamTeacher=this.value;state.ui.schoolExamClassId=\'\';openSchoolExamLedger()">' + tOpts + '</select>';
    }

    root.innerHTML = `
<style>
/* 성적표 스타일 */
#seb-main { width: 100%; height: calc(100vh - 56px); display: flex; flex-direction: column; padding: 16px 16px 0; box-sizing: border-box; }
.seb-ctrl { height: 44px; min-height: 44px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
#seb-body { flex: 1; overflow: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; }
#seb-tbl { border-collapse: collapse; width: max-content; min-width: 100%; background: var(--surface); }
#seb-tbl th { position: sticky; top: 0; background: var(--surface); z-index: 2; font-size: 12px; font-weight: 700; color: var(--secondary); padding: 10px 4px; text-align: center; white-space: nowrap; box-shadow: 0 1px 0 var(--border); } 
#seb-tbl td { padding: 5px 3px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: center; } 
.seb-sticky-g { position: sticky; left: 0; z-index: 1; background: var(--surface); width: 36px; min-width: 36px; font-size: 12px; font-weight: 700; color: var(--secondary); text-align: center; border-right: 1px solid var(--border); }
.seb-sticky-c { position: sticky; left: 36px; z-index: 1; background: var(--surface); width: 64px; min-width: 64px; font-size: 12px; font-weight: 800; color: var(--primary); text-align: center; border-right: 1px solid var(--border); white-space: nowrap; }
.seb-sticky-n { position: sticky; left: 100px; z-index: 1; background: var(--surface); width: 76px; min-width: 76px; font-size: 13px; font-weight: 700; color: var(--text); padding: 6px 8px; border-right: 1px solid var(--border); white-space: nowrap; text-align: center; } 
#seb-tbl thead .seb-sticky-g, #seb-tbl thead .seb-sticky-c, #seb-tbl thead .seb-sticky-n { z-index: 3; }
.seb-inp { width: 70px; height: 38px; padding: 0 4px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 14px; font-weight: 700; text-align: center; font-family: inherit; }
.seb-inp:focus { outline: none; border-color: var(--primary); background: var(--surface); }
.seb-tab-wrap { display: flex; gap: 4px; background: var(--bg); padding: 4px; border-radius: 14px; }
.seb-tab { flex: 1; height: 40px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.seb-tab.active { background: var(--text); color: var(--surface); }
.seb-tab:not(.active) { background: transparent; color: var(--secondary); }
.seb-border2 { border-left: 2px solid rgba(0,0,0,0.08) !important; }
</style>
<div id="seb-main">
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-shrink:0;">
    <div style="font-size:20px;font-weight:700;color:var(--text);letter-spacing:-0.5px;cursor:pointer;white-space:nowrap;" onclick="closeSchoolExamLedger()">성적표</div>
    <select class="seb-ctrl" id="seb-yr" style="width:86px;" onchange="state.ui.schoolExamYear=Number(this.value);renderSchoolExamBatchTable()">${yearOptions}</select>
  </div>
  <div class="seb-tab-wrap" style="margin-bottom:10px;flex-shrink:0;">
    <button class="seb-tab ${section === 'middle' ? 'active' : ''}" onclick="state.ui.schoolExamSection='middle';state.ui.schoolExamClassId='';openSchoolExamLedger()">중등</button>
    <button class="seb-tab ${section === 'high' ? 'active' : ''}" onclick="state.ui.schoolExamSection='high';state.ui.schoolExamClassId='';openSchoolExamLedger()">고등</button>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:10px;flex-shrink:0;flex-wrap:wrap;">
    ${teacherHtml}
    <select class="seb-ctrl" id="seb-cls" style="flex:2;" onchange="state.ui.schoolExamClassId=this.value;renderSchoolExamBatchTable()">${classOptions}</select>
    <select class="seb-ctrl" id="seb-sort" style="flex:1;" onchange="state.ui.schoolExamSort=this.value;_sebToggleSortCol();renderSchoolExamBatchTable()">
      <option value="default"${sort === 'default' ? ' selected' : ''}>기본순</option>
      <option value="score-desc"${sort === 'score-desc' ? ' selected' : ''}>성적순 ↓</option>
      <option value="name-desc"${sort === 'name-desc' ? ' selected' : ''}>이름순 ↓</option>
    </select>
    <select class="seb-ctrl" id="seb-sort-col" style="flex:1;display:${sort === 'score-desc' ? 'block' : 'none'};" onchange="state.ui.schoolExamSortCol=this.value;renderSchoolExamBatchTable()">
      <option value="1H-mid"${sortCol === '1H-mid' ? ' selected' : ''}>1학기 중간</option>
      <option value="1H-fin"${sortCol === '1H-fin' ? ' selected' : ''}>1학기 기말</option>
      <option value="2H-mid"${sortCol === '2H-mid' ? ' selected' : ''}>2학기 중간</option>
      <option value="2H-fin"${sortCol === '2H-fin' ? ' selected' : ''}>2학기 기말</option>
    </select>
  </div>
  <div id="seb-body"><div id="seb-tbl-root"></div></div>
  <div style="flex-shrink:0;display:flex;align-items:center;justify-content:space-between;padding:0 0 24px;">
    <span id="seb-cnt" style="font-size:13px;font-weight:600;color:var(--secondary);"></span>
    <button class="btn btn-primary" id="seb-save-btn" onclick="saveSchoolExamBatch()" style="height:48px;padding:0 32px;border-radius:14px;font-size:14px;font-weight:700;border:none;box-shadow:none;">전체 저장</button>
  </div>
</div>`;

    renderSchoolExamBatchTable();
}

function renderSchoolExamBatchTable() {
    var root = document.getElementById('seb-tbl-root');
    if (!root) return;

    var year = Number(state.ui.schoolExamYear) || new Date().getFullYear();
    var sort = state.ui.schoolExamSort || 'default';
    var sortColKey = state.ui.schoolExamSortCol || '1H-mid';
    var cntEl = document.getElementById('seb-cnt');

    var students = getSebVisibleStudents();

    if (sort === 'name-desc') {
        students = students.slice().sort(function(a, b) {
            return String(b.name || '').localeCompare(String(a.name || ''), 'ko');
        });
    } else if (sort === 'score-desc') {
        var sc = null;
        SEB_COLS.forEach(function(c) { if (c.key === sortColKey) sc = c; });
        students = students.slice().sort(function(a, b) {
            var ra = sc ? getSebExamRecord(a.id, year, sc.semester, sc.examType) : null;
            var rb = sc ? getSebExamRecord(b.id, year, sc.semester, sc.examType) : null;
            var sa = (ra && ra.score !== null && ra.score !== '' && ra.score !== undefined) ? Number(ra.score) : -1;
            var sb = (rb && rb.score !== null && rb.score !== '' && rb.score !== undefined) ? Number(rb.score) : -1;
            return sb - sa;
        });
    }

    if (cntEl) cntEl.textContent = students.length + '명';

    if (!students.length) {
        root.innerHTML = '<div style="padding:48px;text-align:center;color:var(--secondary);font-size:14px;font-weight:600;">표시할 학생이 없습니다.</div>';
        return;
    }

    var hRow1 = '<th rowspan="2" class="seb-sticky-g">학년</th>' +
        '<th rowspan="2" class="seb-sticky-c">반</th>' +
        '<th rowspan="2" class="seb-sticky-n">이름</th>' + 
        '<th colspan="2" class="seb-border2" style="padding:8px;">1학기</th>' +
        '<th colspan="2" class="seb-border2" style="padding:8px;">2학기</th>';
    var hRow2 = '<th class="seb-border2">중간</th><th>기말</th><th class="seb-border2">중간</th><th>기말</th>';

    var bodyRows = '';
    var classFilter = state.ui.schoolExamClassId || '';

    if (sort === 'default') {
        var gradeOrder = ['중1','중2','중3','고1','고2','고3'];
        var byGrade = {};
        students.forEach(function(s) {
            var g = String(s.grade || '기타');
            if (!byGrade[g]) byGrade[g] = [];
            byGrade[g].push(s);
        });

        gradeOrder.forEach(function(grade) {
            var gs = byGrade[grade];
            if (!gs || !gs.length) return;

            var byClass = {};
            var classOrder = [];
            gs.forEach(function(s) {
                var cid = getCumulativeClassIdForStudent(s.id);
                var cn = getCumulativeClassName(cid) || '미배정';
                if (!byClass[cn]) { byClass[cn] = []; classOrder.push(cn); }
                byClass[cn].push(s);
            });

            var gradePrinted = false;
            classOrder.forEach(function(cn) {
                var list = byClass[cn] || [];
                list.forEach(function(s, idx) {
                    var gradeText = gradePrinted ? '' : grade;
                    var classText = idx === 0 ? cn : '';
                    bodyRows += _buildSebRow(s, year, gradeText, classText);
                    gradePrinted = true;
                });
            });
        });
    } else {
        students.forEach(function(s) {
            var cn = getCumulativeClassName(getCumulativeClassIdForStudent(s.id)) || '';
            bodyRows += _buildSebRow(s, year, String(s.grade || ''), cn);
        });
    }

    root.innerHTML = '<table id="seb-tbl">' +
        '<thead><tr>' + hRow1 + '</tr><tr>' + hRow2 + '</tr></thead>' +
        '<tbody>' + (bodyRows || '<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--secondary);">학생 없음</td></tr>') +
        '</tbody></table>';
}

function _buildSebRow(s, year, gradeText, classText) {
    var sid = String(s.id);
    var cols = SEB_COLS.map(function(col, i) {
        var rec = getSebExamRecord(sid, year, col.semester, col.examType);
        var val = (rec && rec.score !== null && rec.score !== undefined && rec.score !== '') ? rec.score : '';
        var border = (i === 0 || i === 2) ? ' class="seb-border2"' : '';
        return '<td' + border + ' style="text-align:center;">' +
            '<input type="number" class="seb-inp" id="seb-inp-' + sid + '-' + col.key + '" value="' + val + '" min="0" max="100"></td>';
    }).join('');
    return '<tr>' +
        '<td class="seb-sticky-g">' + apEscapeHtml(gradeText || '') + '</td>' +
        '<td class="seb-sticky-c">' + apEscapeHtml(classText || '') + '</td>' +
        '<td class="seb-sticky-n">' + apEscapeHtml(s.name) + '</td>' +
        cols + '</tr>';
}

async function saveSchoolExamBatch() {
    var year = Number(state.ui.schoolExamYear) || new Date().getFullYear();
    var students = getSebVisibleStudents();
    if (!students.length) return toast('저장할 학생이 없습니다.', 'warn');

    for (var i = 0; i < students.length; i++) {
        for (var j = 0; j < SEB_COLS.length; j++) {
            var inp = document.getElementById('seb-inp-' + students[i].id + '-' + SEB_COLS[j].key);
            if (!inp) continue;
            var val = (inp.value || '').trim();
            if (val !== '') {
                var n = Number(val);
                if (!Number.isFinite(n) || n < 0 || n > 100)
                    return toast(students[i].name + ': 0~100 사이 숫자여야 합니다.', 'warn');
            }
        }
    }

    var btn = document.getElementById('seb-save-btn');
    if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }

    try {
        for (var ci = 0; ci < SEB_COLS.length; ci++) {
            var col = SEB_COLS[ci];
            var records = students.map(function(s) {
                var inp2 = document.getElementById('seb-inp-' + s.id + '-' + col.key);
                var v = inp2 ? (inp2.value || '').trim() : '';
                return { studentId: s.id, score: v === '' ? null : Number(v) };
            });
            await api.post('school-exam-records/batch', {
                examYear: year, semester: col.semester, examType: col.examType, subject: '수학', records: records
            });
        }
        toast('저장되었습니다.', 'success');
        await loadData();
        renderSchoolExamBatchTable();
    } catch(e) {
        toast('저장에 실패했습니다.', 'warn');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '전체 저장'; }
    }
}

// ── 진입점 (사이드바/메뉴에서 호출) ─────────────────────────────

function openCumulativeOpsModal(mode = 'attendance') {
    if (mode === 'school') {
        openSchoolExamLedger();
    } else {
        openAttendanceLedger();
    }
}

function switchCumulativeOpsTab(tab) {
    if (tab === 'school') openSchoolExamLedger();
    else openAttendanceLedger();
}

// ── student.js 호환용 헬퍼 (읽기 전용 표시 지원) ────────────────

function getCumulativeRecordKey(record) {
    return [record.exam_year || '', record.semester || '', record.exam_type || '', record.subject || ''].join('|');
}

function getRecentSchoolExamColumns(records, limit = 4) {
    const seen = new Set();
    const columns = [];
    [...records]
        .filter(r => String(r.is_deleted || 0) !== '1')
        .sort((a, b) => {
            const yd = Number(b.exam_year || 0) - Number(a.exam_year || 0);
            if (yd !== 0) return yd;
            return String(b.created_at || '').localeCompare(String(a.created_at || ''));
        })
        .forEach(r => {
            const key = getCumulativeRecordKey(r);
            if (seen.has(key)) return;
            seen.add(key);
            columns.push({ key, examYear: r.exam_year, semester: r.semester || '', examType: r.exam_type || '', subject: r.subject || '' });
        });
    return columns.slice(0, limit);
}

function getSchoolExamRecordForCell(records, studentId, column) {
    return records.find(r => String(r.student_id) === String(studentId) && getCumulativeRecordKey(r) === column.key);
}

function renderSchoolExamScoreCell(record) {
    if (!record) return '<span style="color:var(--secondary);font-weight:600;">-</span>';
    const score = record.score;
    const scoreText = score === null || score === undefined || score === '' ? '미응시' : `${score}`;
    const target = record.target_score_snapshot;
    const diff = (score !== null && score !== undefined && score !== '' && target !== null && target !== undefined && target !== '')
        ? Number(score) - Number(target) : null;
    const diffText = (diff === null || !Number.isFinite(diff)) ? '' :
        `<div style="font-size:10px;font-weight:600;color:${diff >= 0 ? 'var(--success)' : 'var(--error)'};margin-top:2px;">목표 ${diff >= 0 ? '+' : ''}${diff}</div>`;
    return `<span style="font-size:13px;font-weight:700;color:var(--text);">${scoreText}${diffText}</span>`;
}

function computeSchoolExamTrend(records, studentId) {
    const list = records
        .filter(r => String(r.student_id) === String(studentId) && r.score !== null && r.score !== undefined && r.score !== '')
        .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')));
    if (!list.length) return { avg: '-', trend: '-' };
    const scores = list.map(r => Number(r.score)).filter(Number.isFinite);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '-';
    const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : null;
    return { avg, trend: trend === null ? '-' : `${trend >= 0 ? '+' : ''}${trend}` };
}

// student.js에서 학교성적 모달이 필요한 경우를 위해 유지
function openSchoolExamRecordModal(recordId = '', studentId = '') {
    const record = recordId ? (state.db.school_exam_records || []).find(r => String(r.id) === String(recordId)) : null;
    const selectedStudentId = studentId || record?.student_id || '';
    const currentYear = new Date().getFullYear();
    const studentOptions = getCumulativeVisibleStudents({})
        .map(s => `<option value="${apEscapeHtml(s.id)}" ${String(s.id) === String(selectedStudentId) ? 'selected' : ''}>${apEscapeHtml(s.name || '')} ${s.school_name ? `(${apEscapeHtml(s.school_name)})` : ''}</option>`)
        .join('');
    const student = selectedStudentId ? getCumulativeStudent(selectedStudentId) : null;
    const targetScore = record?.target_score_snapshot ?? student?.target_score ?? '';

    showModal(record ? '학교시험 성적 수정' : '학교시험 성적 추가', `
<div style="display:flex;flex-direction:column;gap:10px;">
  <select id="ser-student" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);" onchange="openSchoolExamRecordModal('${recordId}',this.value)">
    <option value="">학생 선택</option>${studentOptions}
  </select>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-school" class="btn" value="${apEscapeHtml(record?.school_name || student?.school_name || '')}" placeholder="학교" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <input id="ser-grade" class="btn" value="${apEscapeHtml(record?.grade || student?.grade || '')}" placeholder="학년" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-year" type="number" class="btn" value="${record?.exam_year || currentYear}" placeholder="연도" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <select id="ser-semester" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
      ${['1학기','2학기'].map(v => `<option value="${v}" ${String(record?.semester || '') === v ? 'selected' : ''}>${v}</option>`).join('')}
    </select>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <select id="ser-type" class="btn" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
      ${[['midterm','중간'],['final','기말'],['performance','수행'],['etc','기타']].map(([v,l]) => `<option value="${v}" ${String(record?.exam_type || 'midterm') === v ? 'selected' : ''}>${l}</option>`).join('')}
    </select>
    <input id="ser-subject" class="btn" value="${apEscapeHtml(record?.subject || '수학')}" placeholder="과목" style="min-height:44px;text-align:left;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
    <input id="ser-score" type="number" class="btn" value="${record?.score ?? ''}" placeholder="점수/미응시 공란" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
    <input id="ser-target" type="number" class="btn" value="${targetScore}" placeholder="목표점수" style="min-height:44px;font-size:13px;font-weight:600;background:var(--surface-2);border:1px solid var(--border);">
  </div>
  <textarea id="ser-memo" class="btn" placeholder="메모" style="height:84px;text-align:left;resize:vertical;font-size:13px;font-weight:500;line-height:1.6;background:var(--surface-2);border:1px solid var(--border);">${apEscapeHtml(record?.memo || '')}</textarea>
  <button class="btn btn-primary" style="width:100%;min-height:48px;font-size:14px;font-weight:700;border-radius:12px;" onclick="saveSchoolExamRecord('${recordId || ''}')">저장</button>
  ${record ? `<button class="btn" style="width:100%;min-height:42px;font-size:13px;font-weight:700;color:var(--error);background:rgba(255,71,87,0.08);border:1px solid rgba(255,71,87,0.16);border-radius:12px;" onclick="deleteSchoolExamRecord('${record.id}')">삭제</button>` : ''}
</div>`);
}

async function saveSchoolExamRecord(recordId = '') {
    const studentId = document.getElementById('ser-student')?.value || '';
    if (!studentId) return toast('학생을 선택하세요.', 'warn');
    const student = getCumulativeStudent(studentId);
    const payload = {
        studentId,
        classId: getCumulativeClassIdForStudent(studentId),
        schoolName: document.getElementById('ser-school')?.value.trim() || student?.school_name || '',
        grade: document.getElementById('ser-grade')?.value.trim() || student?.grade || '',
        examYear: Number(document.getElementById('ser-year')?.value || 0),
        semester: document.getElementById('ser-semester')?.value || '',
        examType: document.getElementById('ser-type')?.value || 'midterm',
        subject: document.getElementById('ser-subject')?.value.trim() || '수학',
        score: document.getElementById('ser-score')?.value ?? '',
        targetScoreSnapshot: document.getElementById('ser-target')?.value ?? '',
        memo: document.getElementById('ser-memo')?.value.trim() || ''
    };
    if (!payload.examYear || !payload.examType || !payload.subject) return toast('연도, 시험유형, 과목을 확인하세요.', 'warn');
    const r = recordId
        ? await api.patch(`school-exam-records/${recordId}`, payload)
        : await api.post('school-exam-records', payload);
    if (r?.success) {
        toast('학교시험 성적이 저장되었습니다.', 'success');
        await loadData();
        closeModal();
    } else {
        toast(r?.message || '학교시험 성적 저장에 실패했습니다.', 'warn');
    }
}

async function deleteSchoolExamRecord(recordId) {
    if (!recordId) return;
    if (!confirm('학교시험 성적 기록을 삭제할까요?')) return;
    const r = await api.delete('school-exam-records', recordId);
    if (r?.success) {
        toast('학교시험 성적 기록이 삭제되었습니다.', 'info');
        await loadData();
        closeModal();
    } else {
        toast('학교시험 성적 삭제에 실패했습니다.', 'warn');
    }
}