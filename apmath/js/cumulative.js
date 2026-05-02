/**
 * AP Math OS [cumulative.js]
 * School exam cumulative records. This is separate from QR/OMR exam_sessions.
 */

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

function getCumulativeRecordKey(record) {
    return [
        record.exam_year || '',
        record.semester || '',
        record.exam_type || '',
        record.subject || ''
    ].join('|');
}

function getRecentSchoolExamColumns(records, limit = 4) {
    const seen = new Set();
    const columns = [];
    [...records]
        .filter(r => String(r.is_deleted || 0) !== '1')
        .sort((a, b) => {
            const yearDiff = Number(b.exam_year || 0) - Number(a.exam_year || 0);
            if (yearDiff !== 0) return yearDiff;
            return String(b.created_at || '').localeCompare(String(a.created_at || ''));
        })
        .forEach(r => {
            const key = getCumulativeRecordKey(r);
            if (seen.has(key)) return;
            seen.add(key);
            columns.push({
                key,
                examYear: r.exam_year,
                semester: r.semester || '',
                examType: r.exam_type || '',
                subject: r.subject || ''
            });
        });
    return columns.slice(0, limit);
}

function getSchoolExamRecordForCell(records, studentId, column) {
    return records.find(r => String(r.student_id) === String(studentId) && getCumulativeRecordKey(r) === column.key);
}

function renderSchoolExamScoreCell(record) {
    if (!record) return '<span style="color:var(--secondary); font-weight:600;">-</span>';
    const score = record.score;
    const scoreText = score === null || score === undefined || score === '' ? '미응시' : `${score}`;
    const target = record.target_score_snapshot;
    const diff = score !== null && score !== undefined && score !== '' && target !== null && target !== undefined && target !== ''
        ? Number(score) - Number(target)
        : null;
    const diffText = diff === null || !Number.isFinite(diff) ? '' : `<div style="font-size:10px; font-weight:600; color:${diff >= 0 ? 'var(--success)' : 'var(--error)'}; margin-top:2px;">목표 ${diff >= 0 ? '+' : ''}${diff}</div>`;
    return `<button class="btn" style="min-width:58px; padding:7px 8px; min-height:36px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); font-size:12px; font-weight:700; color:var(--text);" onclick="openSchoolExamRecordModal('${record.id}')">${scoreText}${diffText}</button>`;
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

function openCumulativeOpsModal(mode = 'attendance') {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const activeMode = mode === 'school' ? 'school' : 'attendance';
    state.ui.cumulativeTab = activeMode;
    if (!state.ui.monthlyAttendanceMonth) state.ui.monthlyAttendanceMonth = currentMonth;
    const classOptions = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0))
        .map(c => `<option value="${apEscapeHtml(c.id)}">${apEscapeHtml(c.name || '')}</option>`)
        .join('');
    const title = activeMode === 'school' ? '학교 성적표' : '출석부';
    const schoolPanelHtml = `
        <div id="cum-school-panel">
            <div class="cum-filter-grid cum-school-filter-grid">
                <select id="cum-class" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
                    <option value="">전체 반</option>${classOptions}
                </select>
                <select id="cum-grade" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
                    <option value="">전체 학년</option>
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
                <input id="cum-year" type="number" class="btn" value="${currentYear}" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
            </div>
            <button class="btn btn-primary" style="width:100%; min-height:44px; font-size:13px; font-weight:700; border-radius:12px; margin-bottom:10px;" onclick="openSchoolExamRecordModal()">학교시험 성적 추가</button>
            <div id="school-exam-cumulative-root"></div>
        </div>
    `;
    const attendancePanelHtml = `
        <div id="cum-attendance-panel">
            <div class="cum-filter-grid">
                <input id="monthly-att-month" type="month" class="btn" value="${state.ui.monthlyAttendanceMonth}" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="state.ui.monthlyAttendanceMonth=this.value; loadMonthlyAttendance(this.value).then(() => renderMonthlyAttendanceTable())">
                <select id="monthly-att-class" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderMonthlyAttendanceTable()">
                    <option value="">전체 반</option>${classOptions}
                </select>
                <select id="monthly-att-mode" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderMonthlyAttendanceTable()">
                    <option value="all">전체</option>
                    <option value="attendance">출석만</option>
                    <option value="homework">숙제 포함</option>
                </select>
            </div>
            <div id="monthly-attendance-root"></div>
        </div>
    `;

    showModal(title, `
        <style>
            .cum-modal-shell { max-width:100%; overflow-x:hidden; }
            .cum-filter-grid { display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px; margin-bottom:10px; }
            .cum-scroll-table { overflow:auto; max-width:100%; border:1px solid var(--border); border-radius:14px; background:var(--surface); max-height:58vh; }
            .cum-legend { display:flex; flex-wrap:wrap; gap:6px 10px; margin-bottom:8px; font-size:11px; font-weight:600; color:var(--secondary); line-height:1.45; }
            @media (max-width:720px) {
                .cum-filter-grid { grid-template-columns:1fr; }
                .cum-school-filter-grid { grid-template-columns:1fr 1fr; }
                .cum-school-filter-grid #cum-year { grid-column:1 / -1; }
                #monthly-att-class { display:block; width:100%; }
            }
        </style>
        <div class="cum-modal-shell" style="display:flex; flex-direction:column; gap:12px;">
            ${activeMode === 'school' ? schoolPanelHtml : attendancePanelHtml}
        </div>
    `);
    if (activeMode === 'attendance') {
        loadMonthlyAttendance(state.ui.monthlyAttendanceMonth).then(() => renderMonthlyAttendanceTable());
    } else {
        renderSchoolExamCumulativeTable();
    }
}

function switchCumulativeOpsTab(tab) {
    state.ui.cumulativeTab = tab === 'attendance' ? 'attendance' : 'school';
    openCumulativeOpsModal(state.ui.cumulativeTab);
}

function renderSchoolExamCumulativeTable(options = {}) {
    const root = document.getElementById('school-exam-cumulative-root');
    if (!root) return;
    const classId = options.classId !== undefined ? options.classId : (document.getElementById('cum-class')?.value || '');
    const grade = options.grade !== undefined ? options.grade : (document.getElementById('cum-grade')?.value || '');
    const year = options.year !== undefined ? options.year : (document.getElementById('cum-year')?.value || '');
    const filters = { classId, grade };
    const students = getCumulativeVisibleStudents(filters);
    let records = (state.db.school_exam_records || []).filter(r => String(r.is_deleted || 0) !== '1');
    if (year) records = records.filter(r => String(r.exam_year || '') === String(year));
    if (classId) records = records.filter(r => String(r.class_id || getCumulativeClassIdForStudent(r.student_id)) === String(classId));
    if (grade) records = records.filter(r => String(r.grade || getCumulativeStudent(r.student_id)?.grade || '').includes(grade));
    const columns = getRecentSchoolExamColumns(records, 4);

    const header = columns.map(c => `
        <th style="padding:10px 8px; min-width:74px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border); text-align:center;">
            ${apEscapeHtml(c.examYear)}<br>${apEscapeHtml(c.semester || '')} ${apEscapeHtml(getCumulativeExamTypeLabel(c.examType))}<br>${apEscapeHtml(c.subject)}
        </th>
    `).join('');

    const rows = students.map(s => {
        const sid = String(s.id);
        const clsName = getCumulativeClassName(getCumulativeClassIdForStudent(sid));
        const trend = computeSchoolExamTrend(records, sid);
        const cells = columns.map(c => `<td style="padding:8px; text-align:center; border-bottom:1px solid var(--border);">${renderSchoolExamScoreCell(getSchoolExamRecordForCell(records, sid, c))}</td>`).join('');
        return `
            <tr>
                <td style="position:sticky; left:0; z-index:1; background:var(--surface); padding:10px 8px; min-width:120px; border-bottom:1px solid var(--border);">
                    <div style="font-size:13px; font-weight:700; color:var(--text);">${apEscapeHtml(s.name || '')}</div>
                    <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-top:2px;">${apEscapeHtml(clsName)} ${apEscapeHtml(s.grade || '')}</div>
                </td>
                ${cells}
                <td style="padding:8px; min-width:58px; text-align:center; border-bottom:1px solid var(--border); font-size:12px; font-weight:700; color:var(--primary);">${trend.avg}</td>
                <td style="padding:8px; min-width:58px; text-align:center; border-bottom:1px solid var(--border); font-size:12px; font-weight:700; color:${String(trend.trend).startsWith('-') ? 'var(--error)' : 'var(--success)'};">${trend.trend}</td>
                <td style="padding:8px; min-width:64px; text-align:center; border-bottom:1px solid var(--border);">
                    <button class="btn" style="min-height:34px; padding:6px 8px; font-size:11px; font-weight:700; border-radius:9px; background:var(--surface-2); border:1px solid var(--border);" onclick="openSchoolExamRecordModal('', '${sid}')">추가</button>
                </td>
            </tr>
        `;
    }).join('');

    root.innerHTML = `
        <div style="font-size:12px; font-weight:600; color:var(--secondary); line-height:1.45; margin-bottom:8px;">최근 4회 기준 학교시험 누적표입니다. QR/OMR 성적과 별도로 관리됩니다.</div>
        <div class="cum-scroll-table">
            <table style="width:100%; border-collapse:collapse; min-width:${Math.max(520, 280 + columns.length * 82)}px;">
                <thead>
                    <tr>
                        <th style="position:sticky; left:0; z-index:2; background:var(--surface); padding:10px 8px; min-width:120px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border); text-align:left;">학생</th>
                        ${header || '<th style="padding:14px; font-size:12px; font-weight:600; color:var(--secondary); border-bottom:1px solid var(--border);">기록 없음</th>'}
                        <th style="padding:10px 8px; min-width:58px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">평균</th>
                        <th style="padding:10px 8px; min-width:58px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">등락</th>
                        <th style="padding:10px 8px; min-width:64px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">입력</th>
                    </tr>
                </thead>
                <tbody>${rows || `<tr><td colspan="${columns.length + 4}" style="padding:28px; text-align:center; color:var(--secondary); font-size:13px; font-weight:600;">표시할 학생이 없습니다.</td></tr>`}</tbody>
            </table>
        </div>
    `;
}

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
    const month = document.getElementById('monthly-att-month')?.value || state.ui.monthlyAttendanceMonth || new Date().toLocaleDateString('sv-SE').slice(0, 7);
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

function renderMonthlyAttendanceCell(studentId, date) {
    const mode = document.getElementById('monthly-att-mode')?.value || 'all';
    const status = getMonthlyAttendanceStatus(studentId, date);
    const schedule = getMonthlyScheduleBadges(studentId, date);
    const chips = [];

    if (schedule.globalClosed || schedule.studentClosed) {
        chips.push({ text: '휴', color: 'var(--error)', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.18)' });
    } else {
        if (schedule.makeup) chips.push({ text: '보', color: 'var(--primary)', bg: 'rgba(26,92,255,0.08)', border: 'rgba(26,92,255,0.16)' });
        if (schedule.consultation) chips.push({ text: '상', color: 'var(--success)', bg: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.16)' });
        if (mode !== 'homework') {
            if (status.attendance === '등원') chips.push({ text: '○', color: 'var(--success)', bg: 'rgba(0,208,132,0.06)', border: 'rgba(0,208,132,0.14)' });
            else if (status.attendance === '결석') chips.push({ text: '결', color: 'var(--error)', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.18)' });
            else chips.push({ text: '-', color: 'var(--secondary)', bg: 'var(--surface-2)', border: 'var(--border)' });
        }
        if (mode !== 'attendance' && status.homework === '미완료') {
            chips.push({ text: '미', color: 'var(--warning)', bg: 'rgba(255,165,2,0.10)', border: 'rgba(255,165,2,0.20)' });
        }
    }

    return `<div style="display:flex; justify-content:center; align-items:center; gap:2px; min-height:32px;">${chips.map(chip => `<span style="display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:22px; padding:0 5px; border-radius:999px; font-size:11px; font-weight:700; color:${chip.color}; background:${chip.bg}; border:1px solid ${chip.border}; line-height:1;">${chip.text}</span>`).join('')}</div>`;
}

function renderMonthlyAttendanceTable() {
    const root = document.getElementById('monthly-attendance-root');
    if (!root) return;

    const month = document.getElementById('monthly-att-month')?.value || state.ui.monthlyAttendanceMonth || new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const days = getMonthDays(month);
    const activeClasses = sortCumulativeClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 720px)').matches;
    const classSelect = document.getElementById('monthly-att-class');
    let classId = classSelect?.value || '';

    if (isMobile && !classId && activeClasses.length) {
        classId = String(activeClasses[0].id);
        if (classSelect) classSelect.value = classId;
    }

    if (isMobile && !classId) {
        root.innerHTML = `<div style="padding:24px; text-align:center; color:var(--secondary); font-size:13px; font-weight:600; background:var(--surface-2); border-radius:14px;">표시할 반이 없습니다.</div>`;
        return;
    }

    let students = sortCumulativeStudents(getCumulativeVisibleStudents({ classId }));
    const grouped = activeClasses
        .filter(c => !classId || String(c.id) === String(classId))
        .map(cls => ({
            cls,
            students: students.filter(s => String(getCumulativeClassIdForStudent(s.id)) === String(cls.id))
        }))
        .filter(group => group.students.length);

    const headerCells = days.map(d => `<th style="position:sticky; top:0; z-index:2; background:var(--surface); padding:8px 5px; min-width:42px; border-bottom:1px solid var(--border); font-size:11px; font-weight:700; color:var(--secondary); text-align:center;">${Number(d.slice(-2))}</th>`).join('');
    const bodyRows = grouped.map(group => `
        <tr>
            <td colspan="${days.length + 1}" style="position:sticky; left:0; z-index:3; background:var(--surface-2); padding:8px 10px; font-size:12px; font-weight:700; color:var(--text); border-bottom:1px solid var(--border);">${apEscapeHtml(group.cls.name || '')}</td>
        </tr>
        ${group.students.map(s => `
            <tr>
                <td style="position:sticky; left:0; z-index:1; background:var(--surface); min-width:118px; padding:9px 8px; border-bottom:1px solid var(--border);">
                    <div style="font-size:13px; font-weight:700; color:var(--text); line-height:1.35;">${apEscapeHtml(s.name || '')}</div>
                    <div style="font-size:10px; font-weight:600; color:var(--secondary); line-height:1.35;">${apEscapeHtml(s.grade || '')}</div>
                </td>
                ${days.map(d => `<td style="padding:5px 4px; min-width:42px; text-align:center; border-bottom:1px solid var(--border);">${renderMonthlyAttendanceCell(s.id, d)}</td>`).join('')}
            </tr>
        `).join('')}
    `).join('');

    root.innerHTML = `
        <div class="cum-legend">
            <span>○ 등원</span><span>결 결석</span><span>- 미기록</span><span>휴 휴무</span><span>보 보강</span><span>상 상담</span><span>미 숙제 미완료</span>
        </div>
        <div class="cum-scroll-table">
            <table style="width:100%; border-collapse:collapse; min-width:${Math.max(760, 120 + days.length * 42)}px;">
                <thead>
                    <tr>
                        <th style="position:sticky; top:0; left:0; z-index:4; background:var(--surface); padding:8px; min-width:118px; border-bottom:1px solid var(--border); font-size:11px; font-weight:700; color:var(--secondary); text-align:left;">학생</th>
                        ${headerCells}
                    </tr>
                </thead>
                <tbody>${bodyRows || `<tr><td colspan="${days.length + 1}" style="padding:28px; text-align:center; color:var(--secondary); font-size:13px; font-weight:600;">표시할 학생이 없습니다.</td></tr>`}</tbody>
            </table>
        </div>
    `;
}


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
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="ser-student" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="openSchoolExamRecordModal('${recordId}', this.value)">
                <option value="">학생 선택</option>${studentOptions}
            </select>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-school" class="btn" value="${apEscapeHtml(record?.school_name || student?.school_name || '')}" placeholder="학교" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <input id="ser-grade" class="btn" value="${apEscapeHtml(record?.grade || student?.grade || '')}" placeholder="학년" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-year" type="number" class="btn" value="${record?.exam_year || currentYear}" placeholder="연도" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <select id="ser-semester" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                    ${['1학기','2학기'].map(v => `<option value="${v}" ${String(record?.semester || '') === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <select id="ser-type" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                    ${[['midterm','중간'],['final','기말'],['performance','수행'],['etc','기타']].map(([v, label]) => `<option value="${v}" ${String(record?.exam_type || 'midterm') === v ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
                <input id="ser-subject" class="btn" value="${apEscapeHtml(record?.subject || '수학')}" placeholder="과목" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-score" type="number" class="btn" value="${record?.score ?? ''}" placeholder="점수/미응시 공란" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <input id="ser-target" type="number" class="btn" value="${targetScore}" placeholder="목표점수" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <textarea id="ser-memo" class="btn" placeholder="메모" style="height:84px; text-align:left; resize:vertical; font-size:13px; font-weight:500; line-height:1.6; background:var(--surface-2); border:1px solid var(--border);">${apEscapeHtml(record?.memo || '')}</textarea>
            <button class="btn btn-primary" style="width:100%; min-height:48px; font-size:14px; font-weight:700; border-radius:12px;" onclick="saveSchoolExamRecord('${recordId || ''}')">저장</button>
            ${record ? `<button class="btn" style="width:100%; min-height:42px; font-size:13px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.08); border:1px solid rgba(255,71,87,0.16); border-radius:12px;" onclick="deleteSchoolExamRecord('${record.id}')">삭제</button>` : ''}
        </div>
    `);
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
        openCumulativeOpsModal('school');
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
        openCumulativeOpsModal('school');
    } else {
        toast('학교시험 성적 삭제에 실패했습니다.', 'warn');
    }
}
