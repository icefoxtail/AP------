/**
 * AP Math OS [cumulative.js]
 * 출석부 장부 + 학교 성적표 일괄입력 장부.
 * QR/OMR exam_sessions 와 완전히 별도.
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

async function loadMonthlyAttendance(month) {
    const safeMonth = String(month || new Date().toLocaleDateString('sv-SE').slice(0, 7)).trim();
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    if (state.ui.monthlyAttendanceCache[safeMonth]) return state.ui.monthlyAttendanceCache[safeMonth];
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

function renderAttendanceCellContent(studentId, date) {
    const schedule = getMonthlyScheduleBadges(studentId, date);
    if (schedule.globalClosed || schedule.studentClosed) {
        return '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:26px;border-radius:6px;font-size:11px;font-weight:700;color:#e53935;background:rgba(229,57,53,0.09);">휴</span>';
    }
    const status = getMonthlyAttendanceStatus(studentId, date);
    if (status.attendance === '등원') {
        return '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:26px;border-radius:6px;font-size:15px;font-weight:700;color:var(--success);">○</span>';
    }
    if (status.attendance === '결석') {
        return '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:26px;border-radius:6px;font-size:11px;font-weight:700;color:#e53935;background:rgba(229,57,53,0.09);">결</span>';
    }
    return '<span style="display:inline-flex;align-items:center;justify-content:center;width:28px;height:26px;border-radius:6px;font-size:13px;font-weight:600;color:var(--border);">-</span>';
}

function _ensureAttOverlay() {
    let ov = document.getElementById('att-ledger-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'att-ledger-overlay';
        document.body.appendChild(ov);
    }
    return ov;
}

function openAttendanceLedger() {
    if (!state.ui.attendanceLedgerMonth) {
        state.ui.attendanceLedgerMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7);
    }
    const ov = _ensureAttOverlay();
    const activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const classOptions = activeClasses.map(c =>
        `<option value="${apEscapeHtml(c.id)}">${apEscapeHtml(c.name)}</option>`
    ).join('');

    ov.style.cssText = 'position:fixed;inset:0;z-index:10000;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;';
    ov.innerHTML = `
<style>
#att-ledger-overlay *{box-sizing:border-box;}
#att-hdr{flex-shrink:0;display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--surface);flex-wrap:wrap;}
#att-hdr h2{margin:0;font-size:15px;font-weight:700;color:var(--text);flex-shrink:0;}
.att-ctrl{height:36px;padding:0 10px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;}
#att-body{flex:1;overflow:auto;position:relative;}
#att-tbl{border-collapse:collapse;width:max-content;min-width:100%;}
#att-tbl th,#att-tbl td{border-bottom:1px solid var(--border);}
#att-tbl thead th{position:sticky;top:0;z-index:2;background:var(--surface);}
#att-tbl .att-nc{position:sticky;left:0;z-index:1;background:var(--surface);}
#att-tbl thead .att-nc{z-index:3;}
.att-dc{padding:4px 1px;text-align:center;width:34px;min-width:34px;cursor:pointer;user-select:none;}
.att-dc:active{opacity:.7;}
.att-hol{cursor:default;}
.att-grp td{background:var(--surface-2) !important;font-size:12px;font-weight:700;color:var(--text);padding:5px 10px;}
#att-legend{padding:6px 14px;font-size:11px;font-weight:600;color:var(--secondary);display:flex;gap:12px;flex-wrap:wrap;flex-shrink:0;border-bottom:1px solid var(--border);background:var(--surface);}
</style>
<div id="att-hdr">
  <h2>출석부</h2>
  <input type="month" class="att-ctrl" id="att-mon" value="${apEscapeHtml(state.ui.attendanceLedgerMonth)}"
    onchange="state.ui.attendanceLedgerMonth=this.value; loadMonthlyAttendance(this.value).then(()=>renderAttendanceLedgerTable());">
  <select class="att-ctrl" id="att-cls" onchange="renderAttendanceLedgerTable()">
    <option value="">전체 반</option>${classOptions}
  </select>
  <div style="flex:1;"></div>
  <button class="att-ctrl" onclick="closeAttendanceLedger()">닫기</button>
</div>
<div id="att-legend">
  <span>○ 등원</span><span>결 결석</span><span>- 미기록</span><span>휴 휴무</span>
</div>
<div id="att-body">
  <div id="att-tbl-root"></div>
</div>`;

    loadMonthlyAttendance(state.ui.attendanceLedgerMonth).then(() => renderAttendanceLedgerTable());
}

function closeAttendanceLedger() {
    const ov = document.getElementById('att-ledger-overlay');
    if (ov) ov.style.display = 'none';
}

function renderAttendanceLedgerTable() {
    const root = document.getElementById('att-tbl-root');
    if (!root) return;

    const month = state.ui.attendanceLedgerMonth || new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const days = getMonthDays(month);
    const classId = document.getElementById('att-cls')?.value || '';
    const activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
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
        return `<th style="padding:5px 1px;width:34px;min-width:34px;text-align:center;${style}"><div style="font-size:12px;font-weight:700;line-height:1.3;">${num}</div><div style="font-size:10px;font-weight:600;line-height:1.3;">${dayName}</div></th>`;
    }).join('');

    const bodyRows = grouped.map(g => {
        const groupRow = `<tr class="att-grp"><td colspan="${days.length + 1}" style="position:sticky;left:0;z-index:1;">${apEscapeHtml(g.cls.name)}</td></tr>`;
        const sRows = g.students.map(s => {
            const sid = String(s.id);
            const dateCells = days.map(d => {
                const sched = getMonthlyScheduleBadges(sid, d);
                const isHol = sched.globalClosed || sched.studentClosed;
                const cls = isHol ? 'att-dc att-hol' : 'att-dc';
                const click = isHol ? '' : `onclick="toggleAttendanceCellStatus('${sid}','${d}')"`;
                return `<td class="${cls}" id="att-cell-${sid}-${d}" ${click}>${renderAttendanceCellContent(sid, d)}</td>`;
            }).join('');
            return `<tr>
<td class="att-nc" style="padding:7px 10px;min-width:96px;white-space:nowrap;">
  <div style="font-size:13px;font-weight:700;color:var(--text);">${apEscapeHtml(s.name)}</div>
  <div style="font-size:10px;font-weight:600;color:var(--secondary);">${apEscapeHtml(s.grade || '')}</div>
</td>${dateCells}</tr>`;
        }).join('');
        return groupRow + sRows;
    }).join('');

    const empty = `<tr><td colspan="${days.length + 1}" style="padding:32px;text-align:center;color:var(--secondary);font-size:13px;font-weight:600;">표시할 학생이 없습니다.</td></tr>`;

    root.innerHTML = `<table id="att-tbl">
<thead><tr>
  <th class="att-nc" style="padding:6px 10px;min-width:96px;text-align:left;font-size:11px;font-weight:700;color:var(--secondary);">학생</th>
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
    else next = '미기록';

    // 낙관적 업데이트
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
        // 실패 시 롤백
        if (existing) {
            existing.status = current;
        } else {
            data.attendance = data.attendance.filter(a => !(String(a.student_id) === sid && String(a.date) === date));
        }
        if (cellEl) cellEl.innerHTML = renderAttendanceCellContent(sid, date);
        toast('출석 저장에 실패했습니다.', 'warn');
    }
}

// ── 학교 성적표 장부 ─────────────────────────────────────────────

function _ensureSebOverlay() {
    let ov = document.getElementById('seb-ledger-overlay');
    if (!ov) {
        ov = document.createElement('div');
        ov.id = 'seb-ledger-overlay';
        document.body.appendChild(ov);
    }
    return ov;
}

function openSchoolExamLedger() {
    const ov = _ensureSebOverlay();
    const currentYear = new Date().getFullYear();
    const activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const classOptions = activeClasses.map(c =>
        `<option value="${apEscapeHtml(c.id)}">${apEscapeHtml(c.name)}</option>`
    ).join('');

    ov.style.cssText = 'position:fixed;inset:0;z-index:10000;background:var(--bg);display:flex;flex-direction:column;overflow:hidden;';
    ov.innerHTML = `
<style>
#seb-ledger-overlay *{box-sizing:border-box;}
#seb-hdr{flex-shrink:0;padding:10px 14px;border-bottom:1px solid var(--border);background:var(--surface);}
#seb-hdr h2{margin:0 0 8px 0;font-size:15px;font-weight:700;color:var(--text);}
#seb-frow{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.seb-ctrl{height:36px;padding:0 10px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;}
#seb-body{flex:1;overflow:auto;padding-bottom:68px;}
#seb-tbl{border-collapse:collapse;width:100%;}
#seb-tbl th{position:sticky;top:0;background:var(--surface);z-index:1;font-size:12px;font-weight:700;color:var(--secondary);padding:10px 14px;text-align:left;border-bottom:1px solid var(--border);}
#seb-tbl td{padding:8px 14px;border-bottom:1px solid var(--border);}
.seb-inp{width:100%;max-width:110px;height:40px;padding:0 10px;border-radius:9px;border:1px solid var(--border);background:var(--surface-2);color:var(--text);font-size:14px;font-weight:600;text-align:center;font-family:inherit;}
#seb-bar{position:fixed;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--border);padding:10px 14px;display:flex;gap:10px;align-items:center;z-index:10001;}
@media(max-width:600px){#seb-frow{gap:6px;}.seb-inp{max-width:90px;}}
</style>
<div id="seb-hdr">
  <h2>학교 성적표</h2>
  <div id="seb-frow">
    <select class="seb-ctrl" id="seb-cls" onchange="renderSchoolExamBatchTable()">
      <option value="">반 선택</option>${classOptions}
    </select>
    <input type="number" class="seb-ctrl" id="seb-yr" value="${currentYear}" min="2020" max="2035" style="width:88px;" oninput="renderSchoolExamBatchTable()">
    <select class="seb-ctrl" id="seb-sem" onchange="renderSchoolExamBatchTable()">
      <option value="1학기">1학기</option>
      <option value="2학기">2학기</option>
    </select>
    <select class="seb-ctrl" id="seb-typ" onchange="renderSchoolExamBatchTable()">
      <option value="midterm">중간</option>
      <option value="final">기말</option>
      <option value="performance">수행</option>
      <option value="etc">기타</option>
    </select>
    <input type="text" class="seb-ctrl" id="seb-subj" value="수학" placeholder="과목" style="width:76px;" oninput="renderSchoolExamBatchTable()">
    <div style="flex:1;"></div>
    <button class="seb-ctrl" onclick="closeSchoolExamLedger()">닫기</button>
  </div>
</div>
<div id="seb-body">
  <div id="seb-tbl-root"></div>
</div>
<div id="seb-bar">
  <span id="seb-cnt" style="font-size:13px;font-weight:600;color:var(--secondary);"></span>
  <div style="flex:1;"></div>
  <button id="seb-save-btn" onclick="saveSchoolExamBatch()"
    style="height:42px;padding:0 28px;border-radius:11px;background:var(--primary);color:#fff;font-size:14px;font-weight:700;border:none;cursor:pointer;font-family:inherit;">
    전체 저장
  </button>
</div>`;

    renderSchoolExamBatchTable();
}

function closeSchoolExamLedger() {
    const ov = document.getElementById('seb-ledger-overlay');
    if (ov) ov.style.display = 'none';
}

function renderSchoolExamBatchTable() {
    const root = document.getElementById('seb-tbl-root');
    if (!root) return;

    const classId = document.getElementById('seb-cls')?.value || '';
    const examYear = Number(document.getElementById('seb-yr')?.value || 0);
    const semester = document.getElementById('seb-sem')?.value || '1학기';
    const examType = document.getElementById('seb-typ')?.value || 'midterm';
    const subject = (document.getElementById('seb-subj')?.value || '').trim();

    const cntEl = document.getElementById('seb-cnt');

    if (!classId) {
        root.innerHTML = '<div style="padding:48px;text-align:center;color:var(--secondary);font-size:14px;font-weight:600;">반을 선택하면 학생 목록이 표시됩니다.</div>';
        if (cntEl) cntEl.textContent = '';
        return;
    }

    const students = getCumulativeVisibleStudents({ classId });
    if (cntEl) cntEl.textContent = `${students.length}명`;

    if (!students.length) {
        root.innerHTML = '<div style="padding:48px;text-align:center;color:var(--secondary);font-size:14px;font-weight:600;">해당 반에 재원 학생이 없습니다.</div>';
        return;
    }

    const records = (state.db.school_exam_records || []).filter(r =>
        String(r.is_deleted || 0) !== '1' &&
        Number(r.exam_year) === examYear &&
        String(r.semester || '') === semester &&
        String(r.exam_type || '') === examType &&
        String(r.subject || '') === subject
    );

    const rows = students.map(s => {
        const existing = records.find(r => String(r.student_id) === String(s.id));
        const score = existing?.score !== null && existing?.score !== undefined ? existing.score : '';
        const clsName = getCumulativeClassName(getCumulativeClassIdForStudent(s.id));
        return `<tr>
<td style="min-width:110px;">
  <div style="font-size:13px;font-weight:700;color:var(--text);white-space:nowrap;">${apEscapeHtml(s.name)}</div>
  <div style="font-size:11px;font-weight:600;color:var(--secondary);margin-top:2px;">${apEscapeHtml(clsName)} ${apEscapeHtml(s.grade || '')}</div>
</td>
<td style="min-width:130px;">
  <input type="number" class="seb-inp" id="seb-score-${apEscapeHtml(String(s.id))}"
    value="${score}" placeholder="미응시" min="0" max="100">
</td>
</tr>`;
    }).join('');

    root.innerHTML = `<table id="seb-tbl">
<thead><tr><th>학생</th><th>점수 (0–100)</th></tr></thead>
<tbody>${rows}</tbody>
</table>`;
}

async function saveSchoolExamBatch() {
    const classId = document.getElementById('seb-cls')?.value || '';
    const examYear = Number(document.getElementById('seb-yr')?.value || 0);
    const semester = document.getElementById('seb-sem')?.value || '1학기';
    const examType = document.getElementById('seb-typ')?.value || 'midterm';
    const subject = (document.getElementById('seb-subj')?.value || '').trim();

    if (!classId) return toast('반을 선택하세요.', 'warn');
    if (!examYear) return toast('연도를 입력하세요.', 'warn');
    if (!subject) return toast('과목을 입력하세요.', 'warn');

    const students = getCumulativeVisibleStudents({ classId });
    if (!students.length) return toast('재원 학생이 없습니다.', 'warn');

    const records = [];
    for (const s of students) {
        const inp = document.getElementById(`seb-score-${s.id}`);
        const val = (inp?.value ?? '').trim();
        if (val !== '') {
            const n = Number(val);
            if (!Number.isFinite(n) || n < 0 || n > 100) {
                return toast(`${s.name}: 점수는 0~100 범위의 숫자여야 합니다.`, 'warn');
            }
        }
        records.push({ studentId: s.id, score: val === '' ? null : Number(val) });
    }

    const btn = document.getElementById('seb-save-btn');
    if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }

    try {
        const r = await api.post('school-exam-records/batch', {
            classId, examYear, semester, examType, subject, records
        });
        if (r?.success) {
            toast('저장되었습니다.', 'success');
            await loadData();
            renderSchoolExamBatchTable();
        } else {
            toast(r?.message || '저장에 실패했습니다.', 'warn');
        }
    } catch {
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
