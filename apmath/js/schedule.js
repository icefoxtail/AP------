/**
 * AP Math OS 1.0 [js/schedule.js]
 * Split from dashboard.js.
 * Unified Schedule Manager:
 * - 일정관리 하나에서 시험일정 + 기타일정 통합 관리
 * - 휴무/보강/상담/행사 세분화 제거
 * - 기타일정은 academy_schedules API를 사용하되 scheduleType은 'etc'로 고정
 */

function selectExamCalendarDate(dateStr) {
    const examDateInput = document.getElementById('new-ex-date');
    if (examDateInput) examDateInput.value = dateStr;

    const etcDateInput = document.getElementById('new-etc-date');
    if (etcDateInput) etcDateInput.value = dateStr;

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

function getEtcScheduleStudentName(studentId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    return student ? student.name : '';
}

function getEtcScheduleTone() {
    return {
        color: 'var(--primary)',
        bg: 'rgba(26,92,255,0.08)',
        border: 'rgba(26,92,255,0.16)'
    };
}

function getEtcScheduleStudentOptions(selectedId = '') {
    return (state.db.students || [])
        .filter(s => s.status !== '퇴원' && s.status !== '제적')
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'))
        .map(s => `<option value="${apEscapeHtml(s.id)}" ${String(s.id) === String(selectedId) ? 'selected' : ''}>${apEscapeHtml(s.name || '')} ${s.school_name ? `(${apEscapeHtml(s.school_name)})` : ''}</option>`)
        .join('');
}

function handleEtcScheduleScopeChange(prefix) {
    const scopeEl = document.getElementById(`${prefix}-scope`);
    const studentEl = document.getElementById(`${prefix}-student`);
    if (!scopeEl || !studentEl) return;

    studentEl.disabled = scopeEl.value !== 'student';
    if (studentEl.disabled) studentEl.value = '';
}

function collectEtcSchedulePayload(prefix) {
    const title = document.getElementById(`${prefix}-title`)?.value.trim() || '';
    const date = document.getElementById(`${prefix}-date`)?.value || '';
    const start = document.getElementById(`${prefix}-start`)?.value || '';
    const end = document.getElementById(`${prefix}-end`)?.value || '';
    const scope = document.getElementById(`${prefix}-scope`)?.value || 'global';
    const studentId = document.getElementById(`${prefix}-student`)?.value || '';
    const teacherName = document.getElementById(`${prefix}-teacher`)?.value.trim() || (state.auth?.name || '');
    const memo = document.getElementById(`${prefix}-memo`)?.value.trim() || '';

    if (!title || !date) {
        toast('기타일정 제목과 날짜를 입력하세요.', 'warn');
        return null;
    }

    if (scope === 'student' && !studentId) {
        toast('학생 대상 일정은 학생을 선택하세요.', 'warn');
        return null;
    }

    return {
        scheduleType: 'etc',
        title,
        scheduleDate: date,
        startTime: start,
        endTime: end,
        targetScope: scope,
        studentId,
        teacherName,
        memo,
        isClosed: false
    };
}

function renderScheduleSectionTitle(title, sub = '') {
    return `
        <div style="margin:18px 0 10px;">
            <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.35;">${apEscapeHtml(title)}</div>
            ${sub ? `<div style="font-size:12px; font-weight:600; color:var(--secondary); line-height:1.45; margin-top:2px;">${apEscapeHtml(sub)}</div>` : ''}
        </div>
    `;
}

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
                <div style="color:var(--error);">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div style="color:var(--primary);">토</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:4px;">
    `;

    for (let i = 0; i < firstDay; i++) calendarHtml += `<div></div>`;

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
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--error);margin-right:4px;"></span>시험일정</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--primary);margin-right:4px;"></span>기타일정</span>
            </div>
        </div>
    `;

    return calendarHtml;
}

function renderExamScheduleContent(todayStr) {
    const schedules = state.db.exam_schedules || [];

    const rows = schedules.map(e => `
        <div class="exam-schedule-item">
            <div style="flex:1; min-width:0;">
                <div style="font-size:11px; font-weight:600; line-height:1.35; color:var(--secondary); margin-bottom:4px;">${e.exam_date} | ${apEscapeHtml(e.school_name || '일반')} ${apEscapeHtml(e.grade || '')}</div>
                <div style="font-size:15px; font-weight:700; line-height:1.35; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(e.exam_name || '일정')}</div>
                ${e.memo ? `<div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${apEscapeHtml(e.memo)}</div>` : ''}
            </div>
            <button class="btn ap-small-btn" style="background:var(--surface-2); border:none; flex:0 0 auto;" onclick="openEditExamScheduleModal('${e.id}')">수정</button>
        </div>
    `).join('');

    return `
        ${renderScheduleSectionTitle('시험일정', '학교 시험, 단원평가, 월말평가 등 시험 관련 일정을 저장합니다.')}
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <input type="text" id="new-ex-school" class="btn" placeholder="장소/학교 (선택)" style="text-align:left; border:none; background:var(--surface);">
                <select id="new-ex-grade" class="btn" style="border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
            </div>
            <div class="exam-schedule-row">
                <input type="text" id="new-ex-name" class="btn" placeholder="시험일정 내용" style="text-align:left; border:none; background:var(--surface);">
                <input type="date" id="new-ex-date" class="btn" value="${todayStr}" style="border:none; background:var(--surface);">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="추가 메모 (선택)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary ap-primary-btn" onclick="addExamSchedule()">시험일정 저장</button>
        </div>
        <div class="exam-schedule-list">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.45; padding:20px;">시험일정이 없습니다</div>`}
        </div>
    `;
}

function renderEtcScheduleForm(prefix, item = null) {
    const scope = item?.target_scope || 'global';

    return `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <input type="text" id="${prefix}-title" class="btn" value="${apEscapeHtml(item?.title || '')}" placeholder="기타일정 내용" style="text-align:left; border:none; background:var(--surface);">
                <input type="date" id="${prefix}-date" class="btn" value="${item?.schedule_date || new Date().toLocaleDateString('sv-SE')}" style="border:none; background:var(--surface);">
            </div>
            <div class="exam-schedule-row">
                <input type="time" id="${prefix}-start" class="btn" value="${item?.start_time || ''}" style="border:none; background:var(--surface);">
                <input type="time" id="${prefix}-end" class="btn" value="${item?.end_time || ''}" style="border:none; background:var(--surface);">
            </div>
            <div class="exam-schedule-row">
                <select id="${prefix}-scope" class="btn" style="border:none; background:var(--surface);" onchange="handleEtcScheduleScopeChange('${prefix}')">
                    <option value="global" ${scope === 'global' ? 'selected' : ''}>학원 전체</option>
                    <option value="student" ${scope === 'student' ? 'selected' : ''}>학생</option>
                </select>
                <select id="${prefix}-student" class="btn" style="border:none; background:var(--surface);">
                    <option value="">학생 선택</option>
                    ${getEtcScheduleStudentOptions(item?.student_id || '')}
                </select>
            </div>
            <div class="exam-schedule-row">
                <input type="text" id="${prefix}-teacher" class="btn" value="${apEscapeHtml(item?.teacher_name || state.auth?.name || '')}" placeholder="담당자" style="text-align:left; border:none; background:var(--surface);">
            </div>
            <textarea id="${prefix}-memo" class="btn" placeholder="메모" style="width:100%; min-height:86px; text-align:left; border:none; background:var(--surface); resize:vertical; font-size:14px; font-weight:400; line-height:1.7;">${apEscapeHtml(item?.memo || '')}</textarea>
        </div>
    `;
}

function renderEtcScheduleContent() {
    const schedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1');

    const rows = schedules.map(s => {
        const tone = getEtcScheduleTone();
        const studentName = s.target_scope === 'student' ? getEtcScheduleStudentName(s.student_id) : '';
        const timeText = [s.start_time, s.end_time].filter(Boolean).join(' - ');

        return `
            <div class="exam-schedule-item" style="border-color:${tone.border};">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
                        <span style="font-size:11px; font-weight:600; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:3px 8px; border-radius:8px;">기타</span>
                        <span style="font-size:11px; font-weight:600; color:var(--secondary);">${apEscapeHtml(s.schedule_date || '')}${timeText ? ` · ${apEscapeHtml(timeText)}` : ''}</span>
                    </div>
                    <div style="font-size:15px; font-weight:700; line-height:1.35; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(s.title || '')}</div>
                    <div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${s.target_scope === 'student' ? `학생: ${apEscapeHtml(studentName || s.student_id || '')}` : '학원 전체'}${s.teacher_name ? ` · 담당: ${apEscapeHtml(s.teacher_name)}` : ''}</div>
                    ${s.memo ? `<div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${apEscapeHtml(s.memo)}</div>` : ''}
                </div>
                <button class="btn ap-small-btn" style="background:var(--surface-2); border:none; flex:0 0 auto;" onclick="openEditEtcScheduleModal('${s.id}')">수정</button>
            </div>
        `;
    }).join('');

    return `
        ${renderScheduleSectionTitle('기타일정', '휴무, 보강, 상담, 행사 등 시험 외 모든 일정을 여기에서 등록합니다.')}
        ${renderEtcScheduleForm('new-etc')}
        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:14px;" onclick="addEtcSchedule()">기타일정 저장</button>
        <div class="exam-schedule-list">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.45; padding:20px;">기타일정이 없습니다</div>`}
        </div>
    `;
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
            .exam-schedule-list { max-height:30vh; overflow-y:auto; padding-right:2px; margin-bottom:12px; }
            .exam-schedule-item { padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; }
            .schedule-divider { height:1px; background:var(--border); margin:18px 0 4px; }
            @media (max-width:600px) {
                .exam-schedule-form { padding:12px; }
                .exam-schedule-row { flex-direction:column; }
                .exam-schedule-list { max-height:34vh; padding-right:0; }
                .exam-schedule-item { align-items:flex-start; }
            }
        </style>
        ${renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr)}
        ${renderExamScheduleContent(todayStr)}
        <div class="schedule-divider"></div>
        ${renderEtcScheduleContent()}
    `;

    showModal('일정관리', body);
    bindExamCalendarDateClicks();
    handleEtcScheduleScopeChange('new-etc');
}

async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school')?.value.trim() || '';
    const gr = document.getElementById('new-ex-grade')?.value || '';
    const na = document.getElementById('new-ex-name')?.value.trim() || '';
    const da = document.getElementById('new-ex-date')?.value || '';
    const me = document.getElementById('new-ex-memo')?.value.trim() || '';
    if (!da) return toast('날짜를 선택하세요.', 'warn');

    try {
        const r = await api.post('exam-schedules', { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
        if (r?.success) {
            toast('시험일정이 저장되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '시험일정 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[addExamSchedule] failed:', e);
        toast('시험일정 저장 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteExamSchedule(id) {
    if (!confirm('시험일정을 삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('exam-schedules', id);
        if (r?.success) {
            toast('시험일정이 삭제되었습니다.', 'info');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '시험일정 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteExamSchedule] failed:', e);
        toast('시험일정 삭제 중 오류가 발생했습니다.', 'error');
    }
}

function openEditExamScheduleModal(id) {
    const e = state.db.exam_schedules.find(x => x.id === id);
    if (!e) return;

    showModal('시험일정 수정', `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <input type="text" id="edit-ex-school" class="btn" value="${apEscapeHtml(e.school_name || '')}" placeholder="장소/학교 (선택)" style="text-align:left; border:none; background:var(--surface);">
                <select id="edit-ex-grade" class="btn" style="border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1" ${e.grade === '중1' ? 'selected' : ''}>중1</option>
                    <option value="중2" ${e.grade === '중2' ? 'selected' : ''}>중2</option>
                    <option value="중3" ${e.grade === '중3' ? 'selected' : ''}>중3</option>
                    <option value="고1" ${e.grade === '고1' ? 'selected' : ''}>고1</option>
                    <option value="고2" ${e.grade === '고2' ? 'selected' : ''}>고2</option>
                    <option value="고3" ${e.grade === '고3' ? 'selected' : ''}>고3</option>
                </select>
            </div>
            <div class="exam-schedule-row">
                <input type="text" id="edit-ex-name" class="btn" value="${apEscapeHtml(e.exam_name || '')}" placeholder="시험일정 내용" style="text-align:left; border:none; background:var(--surface);">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="border:none; background:var(--surface);">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${apEscapeHtml(e.memo || '')}" placeholder="추가 메모" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary ap-primary-btn" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
            <div class="exam-schedule-row" style="margin-top:4px;">
                <button class="btn ap-mid-btn" style="border:none; background:var(--surface);" onclick="openExamScheduleModal()">취소</button>
                <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteExamSchedule('${id}')">완전 삭제</button>
            </div>
        </div>
    `);
}

async function handleEditExamSchedule(id) {
    const sc = document.getElementById('edit-ex-school')?.value.trim() || '';
    const gr = document.getElementById('edit-ex-grade')?.value || '';
    const na = document.getElementById('edit-ex-name')?.value.trim() || '';
    const da = document.getElementById('edit-ex-date')?.value.trim() || '';
    const me = document.getElementById('edit-ex-memo')?.value.trim() || '';
    if (!da) return toast('날짜를 선택하세요.', 'warn');

    try {
        const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
        if (r?.success) {
            toast('시험일정이 수정되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '시험일정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditExamSchedule] failed:', e);
        toast('시험일정 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function addEtcSchedule() {
    const payload = collectEtcSchedulePayload('new-etc');
    if (!payload) return;

    try {
        const r = await api.post('academy-schedules', payload);
        if (r?.success) {
            toast('기타일정이 저장되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '기타일정 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[addEtcSchedule] failed:', e);
        toast('기타일정 저장 중 오류가 발생했습니다.', 'error');
    }
}

function openEditEtcScheduleModal(id) {
    const item = (state.db.academy_schedules || []).find(s => String(s.id) === String(id));
    if (!item) return;

    showModal('기타일정 수정', `
        ${renderEtcScheduleForm('edit-etc', item)}
        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:10px;" onclick="handleEditEtcSchedule('${id}')">수정 저장</button>
        <div class="exam-schedule-row">
            <button class="btn ap-mid-btn" style="border:none; background:var(--surface);" onclick="openExamScheduleModal()">취소</button>
            <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteEtcSchedule('${id}')">삭제</button>
        </div>
    `);
    handleEtcScheduleScopeChange('edit-etc');
}

async function handleEditEtcSchedule(id) {
    const payload = collectEtcSchedulePayload('edit-etc');
    if (!payload) return;

    try {
        const r = await api.patch('academy-schedules/' + id, payload);
        if (r?.success) {
            toast('기타일정이 수정되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '기타일정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditEtcSchedule] failed:', e);
        toast('기타일정 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteEtcSchedule(id) {
    if (!confirm('기타일정을 삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('academy-schedules', id);
        if (r?.success) {
            toast('기타일정이 삭제되었습니다.', 'info');
            await loadData();
            openExamScheduleModal();
            return;
        }
        toast(r?.message || r?.error || '기타일정 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteEtcSchedule] failed:', e);
        toast('기타일정 삭제 중 오류가 발생했습니다.', 'error');
    }
}

/* 구버전 함수명 호환 */
async function addAcademySchedule() {
    return addEtcSchedule();
}

function openEditAcademyScheduleModal(id) {
    return openEditEtcScheduleModal(id);
}

async function handleEditAcademySchedule(id) {
    return handleEditEtcSchedule(id);
}

async function deleteAcademySchedule(id) {
    return deleteEtcSchedule(id);
}