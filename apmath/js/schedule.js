/**
 * AP Math OS 1.0 [js/schedule.js]
 * Split from dashboard.js.
 * Unified Schedule Manager:
 * - 일정관리 메뉴 하나
 * - 일정 등록 폼 하나
 * - 일정 유형은 시험 / 기타 두 개만 사용
 * - 시험은 exam_schedules API 사용
 * - 기타는 academy_schedules API 사용, scheduleType은 'etc' 고정
 */

// ============================================================
// Calendar
// ============================================================
function selectExamCalendarDate(dateStr) {
    const dateInput = document.getElementById('new-sch-date');
    if (dateInput) dateInput.value = dateStr;

    if (!state.ui) state.ui = {};
    state.ui.examCalendarMonth = `${dateStr.substring(0, 7)}-01`;

    document.querySelectorAll('.exam-calendar-day').forEach((el) => {
        el.classList.toggle('selected', el.getAttribute('data-date') === dateStr);
    });
}

function bindExamCalendarDateClicks() {
    document.querySelectorAll('.exam-calendar-day').forEach((el) => {
        el.addEventListener('click', () => selectExamCalendarDate(el.getAttribute('data-date')));
    });
}

// ============================================================
// Helpers
// ============================================================
function getScheduleStudentName(studentId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    return student ? student.name : '';
}

function getScheduleStudentOptions(selectedId = '') {
    return (state.db.students || [])
        .filter(s => s.status !== '퇴원' && s.status !== '제적')
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'))
        .map(s => `<option value="${apEscapeHtml(s.id)}" ${String(s.id) === String(selectedId) ? 'selected' : ''}>${apEscapeHtml(s.name || '')} ${s.school_name ? `(${apEscapeHtml(s.school_name)})` : ''}</option>`)
        .join('');
}

function getScheduleTypeLabel(type) {
    return type === 'exam' ? '시험' : '기타';
}

function getScheduleTone(type) {
    if (type === 'exam') {
        return {
            color: 'var(--error)',
            bg: 'rgba(255,71,87,0.08)',
            border: 'rgba(255,71,87,0.18)'
        };
    }
    return {
        color: 'var(--primary)',
        bg: 'rgba(26,92,255,0.08)',
        border: 'rgba(26,92,255,0.16)'
    };
}

function getUnifiedSchedules() {
    const examRows = (state.db.exam_schedules || []).map(e => ({
        kind: 'exam',
        id: e.id,
        date: e.exam_date || '',
        title: e.exam_name || '일정',
        school_name: e.school_name || '',
        grade: e.grade || '',
        memo: e.memo || '',
        start_time: '',
        end_time: '',
        target_scope: 'global',
        student_id: '',
        teacher_name: ''
    }));

    const etcRows = (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1')
        .map(s => ({
            kind: 'etc',
            id: s.id,
            date: s.schedule_date || '',
            title: s.title || '일정',
            school_name: '',
            grade: '',
            memo: s.memo || '',
            start_time: s.start_time || '',
            end_time: s.end_time || '',
            target_scope: s.target_scope || 'global',
            student_id: s.student_id || '',
            teacher_name: s.teacher_name || ''
        }));

    return [...examRows, ...etcRows].sort((a, b) => {
        const d = String(a.date || '').localeCompare(String(b.date || ''));
        if (d !== 0) return d;
        const k = String(a.kind || '').localeCompare(String(b.kind || ''));
        if (k !== 0) return k;
        return String(a.title || '').localeCompare(String(b.title || ''), 'ko');
    });
}

function handleUnifiedScheduleTypeChange(prefix) {
    const typeEl = document.getElementById(`${prefix}-kind`);
    const schoolEl = document.getElementById(`${prefix}-school`);
    const gradeEl = document.getElementById(`${prefix}-grade`);

    if (!typeEl) return;

    const isExam = typeEl.value === 'exam';
    if (schoolEl) schoolEl.disabled = !isExam;
    if (gradeEl) gradeEl.disabled = !isExam;
}

function handleUnifiedScheduleScopeChange(prefix) {
    handleUnifiedScheduleTypeChange(prefix);
}

function collectUnifiedSchedulePayload(prefix) {
    const kind = document.getElementById(`${prefix}-kind`)?.value || 'exam';
    const title = document.getElementById(`${prefix}-title`)?.value.trim() || '';
    const date = document.getElementById(`${prefix}-date`)?.value || '';
    const memo = document.getElementById(`${prefix}-memo`)?.value.trim() || '';

    if (!title || !date) {
        toast('일정 내용과 날짜를 입력하세요.', 'warn');
        return null;
    }

    if (kind === 'exam') {
        const schoolName = document.getElementById(`${prefix}-school`)?.value.trim() || '';
        const grade = document.getElementById(`${prefix}-grade`)?.value || '';

        return {
            kind,
            examPayload: {
                schoolName,
                grade,
                examName: title,
                examDate: date,
                memo
            }
        };
    }

    return {
        kind,
        etcPayload: {
            scheduleType: 'etc',
            title,
            scheduleDate: date,
            startTime: '',
            endTime: '',
            targetScope: 'teacher',
            studentId: '',
            teacherName: state.auth?.name || '',
            memo,
            isClosed: false
        }
    };
}

// ============================================================
// Render
// ============================================================
function renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr) {
    const examSchedules = state.db.exam_schedules || [];
    const etcSchedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1');

    let calendarHtml = `
        <div style="background:var(--surface-2); border-radius:14px; padding:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${prevStr}')">‹</button>
                <div style="font-size:18px; font-weight:700; line-height:1.3; color:var(--text);">${targetYear}년 ${targetMonth + 1}월</div>
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${nextStr}')">›</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:13px; font-weight:600; line-height:1.3; color:var(--secondary); margin-bottom:8px;">
                <div style="color:var(--error);">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div style="color:var(--primary);">토</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:4px;">
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += `<div></div>`;
    }

    for (let d = 1; d <= lastDate; d++) {
        const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const hasExamSchedule = examSchedules.some(s => s.exam_date === dateStr);
        const hasEtcSchedule = etcSchedules.some(s => s.schedule_date === dateStr);

        calendarHtml += `
            <button type="button" class="exam-calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" aria-label="${dateStr}">
                <span>${d}</span>
                <span style="display:flex; gap:3px; align-items:center; justify-content:center; height:5px; margin-top:1px;">
                    <span class="exam-calendar-dot" style="background:${hasExamSchedule ? 'var(--error)' : 'transparent'};"></span>
                    <span class="exam-calendar-dot" style="background:${hasEtcSchedule ? 'var(--primary)' : 'transparent'};"></span>
                </span>
            </button>
        `;
    }

    calendarHtml += `
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; font-size:11px; font-weight:600; color:var(--secondary);">
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--error);margin-right:4px;"></span>시험</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--primary);margin-right:4px;"></span>기타</span>
            </div>
        </div>
    `;

    return calendarHtml;
}

function renderUnifiedScheduleForm(prefix = 'new-sch', item = null) {
    const kind = item?.kind || 'exam';
    const date = item?.date || new Date().toLocaleDateString('sv-SE');
    const title = item?.title || '';
    const memo = item?.memo || '';
    const schoolName = item?.school_name || '';
    const grade = item?.grade || '';

    return `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <select id="${prefix}-kind" class="btn" style="border:none; background:var(--surface);" onchange="handleUnifiedScheduleTypeChange('${prefix}')">
                    <option value="exam" ${kind === 'exam' ? 'selected' : ''}>시험</option>
                    <option value="etc" ${kind === 'etc' ? 'selected' : ''}>기타</option>
                </select>
                <input type="text" id="${prefix}-title" class="btn" value="${apEscapeHtml(title)}" placeholder="일정 내용" style="text-align:left; border:none; background:var(--surface);">
            </div>

            <div class="exam-schedule-row">
                <input type="date" id="${prefix}-date" class="btn" value="${date}" style="border:none; background:var(--surface);">
                <input type="text" id="${prefix}-school" class="btn" value="${apEscapeHtml(schoolName)}" placeholder="학교/장소 (시험 선택 시)" style="text-align:left; border:none; background:var(--surface);">
            </div>

            <div class="exam-schedule-row">
                <select id="${prefix}-grade" class="btn" style="border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1" ${grade === '중1' ? 'selected' : ''}>중1</option>
                    <option value="중2" ${grade === '중2' ? 'selected' : ''}>중2</option>
                    <option value="중3" ${grade === '중3' ? 'selected' : ''}>중3</option>
                    <option value="고1" ${grade === '고1' ? 'selected' : ''}>고1</option>
                    <option value="고2" ${grade === '고2' ? 'selected' : ''}>고2</option>
                    <option value="고3" ${grade === '고3' ? 'selected' : ''}>고3</option>
                </select>
            </div>

            <textarea id="${prefix}-memo" class="btn" placeholder="메모" style="width:100%; min-height:86px; text-align:left; border:none; background:var(--surface); resize:vertical; font-size:14px; font-weight:400; line-height:1.7;">${apEscapeHtml(memo)}</textarea>
        </div>
    `;
}

function renderUnifiedScheduleList() {
    const schedules = getUnifiedSchedules();

    if (!schedules.length) {
        return `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.45; padding:20px;">등록된 일정이 없습니다</div>`;
    }

    return schedules.map(s => {
        const tone = getScheduleTone(s.kind);
        const timeText = [s.start_time, s.end_time].filter(Boolean).join(' - ');
        const studentName = s.target_scope === 'student' ? getScheduleStudentName(s.student_id) : '';
        const subParts = [];

        if (s.kind === 'exam') {
            if (s.school_name || s.grade) subParts.push(`${s.school_name || '일반'} ${s.grade || ''}`.trim());
        }

        return `
            <div class="exam-schedule-item" style="border-color:${tone.border};">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
                        <span style="font-size:11px; font-weight:600; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:3px 8px; border-radius:8px;">${getScheduleTypeLabel(s.kind)}</span>
                        <span style="font-size:11px; font-weight:600; color:var(--secondary);">${apEscapeHtml(s.date || '')}${timeText ? ` · ${apEscapeHtml(timeText)}` : ''}</span>
                    </div>
                    <div style="font-size:15px; font-weight:700; line-height:1.35; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(s.title || '')}</div>
                    ${subParts.length ? `<div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${apEscapeHtml(subParts.join(' · '))}</div>` : ''}
                    ${s.memo ? `<div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${apEscapeHtml(s.memo)}</div>` : ''}
                </div>
                <button class="btn ap-small-btn" style="background:var(--surface-2); border:none; flex:0 0 auto;" onclick="openEditUnifiedScheduleModal('${s.kind}', '${s.id}')">수정</button>
            </div>
        `;
    }).join('');
}

function openExamScheduleModal(baseDateStr = '') {
    const todayStr = new Date().toLocaleDateString('sv-SE');

    if (!state.ui) state.ui = {};
    if (baseDateStr) {
        state.ui.examCalendarMonth = baseDateStr;
    } else if (!state.ui.examCalendarMonth) {
        state.ui.examCalendarMonth = todayStr;
    }

    const parts = state.ui.examCalendarMonth.split('-');
    const targetYear = parseInt(parts[0], 10);
    const targetMonth = parseInt(parts[1], 10) - 1;
    const firstDay = new Date(targetYear, targetMonth, 1).getDay();
    const lastDate = new Date(targetYear, targetMonth + 1, 0).getDate();
    const prevMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const nextMonthDate = new Date(targetYear, targetMonth + 1, 1);
    const prevStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const nextStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`;

    const body = `
        <style>
            .exam-schedule-form { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:14px; border-radius:14px; }
            .exam-schedule-row { display:flex; gap:10px; width:100%; }
            .exam-schedule-row > * { flex:1; min-width:0; width:100%; }
            .exam-calendar-day { min-height:44px; background:var(--surface); border:1px solid transparent; border-radius:10px; padding:6px 0; text-align:center; cursor:pointer; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; font-size:15px; font-weight:600; line-height:1.2; color:var(--text); }
            .exam-calendar-day.today { border-color:var(--primary); color:var(--primary); }
            .exam-calendar-day.selected { background:rgba(26,92,255,0.08); border-color:var(--primary); color:var(--primary); }
            .exam-calendar-dot { width:4px; height:4px; border-radius:50%; margin-top:1px; display:inline-block; }
            .exam-schedule-list { max-height:38vh; overflow-y:auto; padding-right:2px; margin-bottom:12px; }
            .exam-schedule-item { padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; }
            @media (max-width:600px) {
                .exam-schedule-form { padding:12px; }
                .exam-schedule-row { flex-direction:column; }
                .exam-schedule-list { max-height:34vh; padding-right:0; }
                .exam-schedule-item { align-items:flex-start; }
            }
        </style>

        ${renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr)}

        <div style="margin:18px 0 10px;">
            <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.35;">일정 등록</div>
            <div style="font-size:12px; font-weight:600; color:var(--secondary); line-height:1.45; margin-top:2px;">시험 또는 기타를 선택해 하나의 입력창에서 등록합니다.</div>
        </div>

        ${renderUnifiedScheduleForm('new-sch')}

        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:16px;" onclick="addUnifiedSchedule()">일정 저장</button>

        <div style="margin:18px 0 10px;">
            <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.35;">일정 목록</div>
        </div>

        <div class="exam-schedule-list">
            ${renderUnifiedScheduleList()}
        </div>
    `;

    showModal('일정관리', body);
    bindExamCalendarDateClicks();
    handleUnifiedScheduleTypeChange('new-sch');
}

// ============================================================
// Create / Edit / Delete
// ============================================================
async function addUnifiedSchedule() {
    const payload = collectUnifiedSchedulePayload('new-sch');
    if (!payload) return;

    try {
        const r = payload.kind === 'exam'
            ? await api.post('exam-schedules', payload.examPayload)
            : await api.post('academy-schedules', payload.etcPayload);

        if (r?.success) {
            toast('일정이 저장되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast(r?.message || r?.error || '일정 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[addUnifiedSchedule] failed:', e);
        toast('일정 저장 중 오류가 발생했습니다.', 'error');
    }
}

function openEditUnifiedScheduleModal(kind, id) {
    let item = null;

    if (kind === 'exam') {
        const e = (state.db.exam_schedules || []).find(x => String(x.id) === String(id));
        if (!e) return;

        item = {
            kind: 'exam',
            id: e.id,
            date: e.exam_date || '',
            title: e.exam_name || '',
            school_name: e.school_name || '',
            grade: e.grade || '',
            memo: e.memo || '',
            start_time: '',
            end_time: '',
            target_scope: 'global',
            student_id: '',
            teacher_name: ''
        };
    } else {
        const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
        if (!s) return;

        item = {
            kind: 'etc',
            id: s.id,
            date: s.schedule_date || '',
            title: s.title || '',
            school_name: '',
            grade: '',
            memo: s.memo || '',
            start_time: s.start_time || '',
            end_time: s.end_time || '',
            target_scope: s.target_scope || 'global',
            student_id: s.student_id || '',
            teacher_name: s.teacher_name || ''
        };
    }

    showModal('일정 수정', `
        ${renderUnifiedScheduleForm('edit-sch', item)}
        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:10px;" onclick="handleEditUnifiedSchedule('${kind}', '${id}')">수정 저장</button>
        <div class="exam-schedule-row">
            <button class="btn ap-mid-btn" style="border:none; background:var(--surface);" onclick="openExamScheduleModal()">취소</button>
            <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteUnifiedSchedule('${kind}', '${id}')">삭제</button>
        </div>
    `);

    handleUnifiedScheduleTypeChange('edit-sch');
}

async function handleEditUnifiedSchedule(kind, id) {
    const payload = collectUnifiedSchedulePayload('edit-sch');
    if (!payload) return;

    try {
        const r = payload.kind === 'exam'
            ? await api.patch('exam-schedules/' + id, payload.examPayload)
            : await api.patch('academy-schedules/' + id, payload.etcPayload);

        if (r?.success) {
            toast('일정이 수정되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast(r?.message || r?.error || '일정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditUnifiedSchedule] failed:', e);
        toast('일정 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteUnifiedSchedule(kind, id) {
    if (!confirm('일정을 삭제하시겠습니까?')) return;

    try {
        const r = kind === 'exam'
            ? await api.delete('exam-schedules', id)
            : await api.delete('academy-schedules', id);

        if (r?.success) {
            toast('일정이 삭제되었습니다.', 'info');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast(r?.message || r?.error || '일정 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteUnifiedSchedule] failed:', e);
        toast('일정 삭제 중 오류가 발생했습니다.', 'error');
    }
}

// ============================================================
// 구버전 함수명 호환
// ============================================================
async function addExamSchedule() {
    const payload = collectUnifiedSchedulePayload('new-sch');
    if (!payload || payload.kind !== 'exam') return addUnifiedSchedule();
    return addUnifiedSchedule();
}

async function deleteExamSchedule(id) {
    return deleteUnifiedSchedule('exam', id);
}

function openEditExamScheduleModal(id) {
    return openEditUnifiedScheduleModal('exam', id);
}

async function handleEditExamSchedule(id) {
    return handleEditUnifiedSchedule('exam', id);
}

async function addAcademySchedule() {
    const payload = collectUnifiedSchedulePayload('new-sch');
    if (!payload || payload.kind !== 'etc') return addUnifiedSchedule();
    return addUnifiedSchedule();
}

function openEditAcademyScheduleModal(id) {
    return openEditUnifiedScheduleModal('etc', id);
}

async function handleEditAcademySchedule(id) {
    return handleEditUnifiedSchedule('etc', id);
}

async function deleteAcademySchedule(id) {
    return deleteUnifiedSchedule('etc', id);
}