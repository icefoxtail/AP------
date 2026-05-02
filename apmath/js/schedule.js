/**
 * AP Math OS 1.0 [js/schedule.js]
 * Split from dashboard.js.
 */

function selectExamCalendarDate(dateStr) {
    const dateInput = document.getElementById('new-ex-date');
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

function getAcademyScheduleTypeLabel(type) {
    const labels = {
        closed: '휴무',
        makeup: '보강',
        consultation: '상담',
        event: '행사',
        etc: '기타',
        exam: '시험'
    };
    return labels[type] || '기타';
}

function getAcademyScheduleStudentName(studentId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    return student ? student.name : '';
}

function getAcademyScheduleTone(type) {
    if (type === 'closed') return { color: 'var(--error)', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.18)' };
    if (type === 'makeup') return { color: 'var(--primary)', bg: 'rgba(26,92,255,0.08)', border: 'rgba(26,92,255,0.16)' };
    if (type === 'consultation') return { color: 'var(--success)', bg: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.16)' };
    return { color: 'var(--secondary)', bg: 'var(--surface-2)', border: 'var(--border)' };
}

function getAcademyScheduleStudentOptions(selectedId = '') {
    return (state.db.students || [])
        .filter(s => s.status !== '퇴원' && s.status !== '제적')
        .slice()
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')))
        .map(s => `<option value="${apEscapeHtml(s.id)}" ${String(s.id) === String(selectedId) ? 'selected' : ''}>${apEscapeHtml(s.name || '')} ${s.school_name ? `(${apEscapeHtml(s.school_name)})` : ''}</option>`)
        .join('');
}

function handleAcademyScheduleTypeChange(prefix) {
    const typeEl = document.getElementById(`${prefix}-type`);
    const scopeEl = document.getElementById(`${prefix}-scope`);
    const studentEl = document.getElementById(`${prefix}-student`);
    const closedEl = document.getElementById(`${prefix}-closed`);
    if (!typeEl || !scopeEl || !studentEl) return;

    const type = typeEl.value;
    if (type === 'makeup' || type === 'consultation') {
        scopeEl.value = 'student';
        scopeEl.disabled = true;
    } else {
        scopeEl.disabled = false;
    }

    if (closedEl) closedEl.value = type === 'closed' ? '1' : '0';
    studentEl.disabled = scopeEl.value !== 'student';
    if (studentEl.disabled) studentEl.value = '';
}

function collectAcademySchedulePayload(prefix) {
    const type = document.getElementById(`${prefix}-type`)?.value || '';
    const title = document.getElementById(`${prefix}-title`)?.value.trim() || '';
    const date = document.getElementById(`${prefix}-date`)?.value || '';
    const start = document.getElementById(`${prefix}-start`)?.value || '';
    const end = document.getElementById(`${prefix}-end`)?.value || '';
    const scope = document.getElementById(`${prefix}-scope`)?.value || 'global';
    const studentId = document.getElementById(`${prefix}-student`)?.value || '';
    const teacherName = document.getElementById(`${prefix}-teacher`)?.value.trim() || (state.auth?.name || '');
    const memo = document.getElementById(`${prefix}-memo`)?.value.trim() || '';

    if (!type || !title || !date) {
        toast('일정 유형, 제목, 날짜를 입력하세요.', 'warn');
        return null;
    }
    if ((scope === 'student' || type === 'makeup' || type === 'consultation') && !studentId) {
        toast('학생 대상 일정은 학생을 선택하세요.', 'warn');
        return null;
    }

    return {
        scheduleType: type,
        title,
        scheduleDate: date,
        startTime: start,
        endTime: end,
        targetScope: (type === 'makeup' || type === 'consultation') ? 'student' : scope,
        studentId,
        teacherName,
        memo,
        isClosed: type === 'closed'
    };
}

function renderScheduleTabs(activeTab) {
    const tabStyle = (tab) => {
        const isActive = tab === activeTab;
        return `flex:1; min-height:44px; border-radius:12px; border:1px solid ${isActive ? 'rgba(26,92,255,0.18)' : 'var(--border)'}; background:${isActive ? 'rgba(26,92,255,0.08)' : 'var(--surface)'}; color:${isActive ? 'var(--primary)' : 'var(--secondary)'}; font-size:13px; font-weight:700;`;
    };
    const month = state.ui?.examCalendarMonth || new Date().toLocaleDateString('sv-SE');
    return `
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn" style="${tabStyle('exam')}" onclick="openExamScheduleModal('${month}', 'exam')">시험일정</button>
            <button class="btn" style="${tabStyle('academy')}" onclick="openExamScheduleModal('${month}', 'academy')">운영일정</button>
        </div>
    `;
}

function renderExamScheduleContent(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr) {
    const schedules = state.db.exam_schedules || [];
    let calendarHtml = `
        <div style="background:var(--surface-2); border-radius:14px; padding:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${prevStr}', 'exam')">‹</button>
                <div style="font-size:18px; font-weight:700; line-height:1.3; color:var(--text);">${targetYear}년 ${targetMonth + 1}월</div>
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${nextStr}', 'exam')">›</button>
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
        const hasSchedule = schedules.some(s => s.exam_date === dateStr);
        calendarHtml += `
            <button type="button" class="exam-calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" aria-label="${dateStr}">
                <span>${d}</span>
                <span class="exam-calendar-dot" style="background:${hasSchedule ? 'var(--error)' : 'transparent'};"></span>
            </button>
        `;
    }

    calendarHtml += `</div></div>`;

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
        ${calendarHtml}
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
                <input type="text" id="new-ex-name" class="btn" placeholder="일정 내용 (선택)" style="text-align:left; border:none; background:var(--surface);">
                <input type="date" id="new-ex-date" class="btn" value="${todayStr}" style="border:none; background:var(--surface);">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="추가 메모 (선택)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary ap-primary-btn" onclick="addExamSchedule()">저장</button>
        </div>
        <div class="exam-schedule-list">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.45; padding:20px;">일정이 없습니다</div>`}
        </div>
    `;
}

function renderAcademyScheduleForm(prefix, item = null) {
    const type = item?.schedule_type || 'closed';
    const scope = item?.target_scope || (type === 'makeup' || type === 'consultation' ? 'student' : 'global');
    return `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <select id="${prefix}-type" class="btn" style="border:none; background:var(--surface);" onchange="handleAcademyScheduleTypeChange('${prefix}')">
                    <option value="closed" ${type === 'closed' ? 'selected' : ''}>휴무</option>
                    <option value="makeup" ${type === 'makeup' ? 'selected' : ''}>보강</option>
                    <option value="consultation" ${type === 'consultation' ? 'selected' : ''}>상담</option>
                    <option value="event" ${type === 'event' ? 'selected' : ''}>행사</option>
                    <option value="etc" ${type === 'etc' ? 'selected' : ''}>기타</option>
                </select>
                <input type="text" id="${prefix}-title" class="btn" value="${apEscapeHtml(item?.title || '')}" placeholder="제목" style="text-align:left; border:none; background:var(--surface);">
            </div>
            <div class="exam-schedule-row">
                <input type="date" id="${prefix}-date" class="btn" value="${item?.schedule_date || new Date().toLocaleDateString('sv-SE')}" style="border:none; background:var(--surface);">
                <input type="time" id="${prefix}-start" class="btn" value="${item?.start_time || ''}" style="border:none; background:var(--surface);">
                <input type="time" id="${prefix}-end" class="btn" value="${item?.end_time || ''}" style="border:none; background:var(--surface);">
            </div>
            <div class="exam-schedule-row">
                <select id="${prefix}-scope" class="btn" style="border:none; background:var(--surface);" onchange="handleAcademyScheduleTypeChange('${prefix}')">
                    <option value="global" ${scope === 'global' ? 'selected' : ''}>학원 전체</option>
                    <option value="student" ${scope === 'student' ? 'selected' : ''}>학생</option>
                </select>
                <select id="${prefix}-student" class="btn" style="border:none; background:var(--surface);">
                    <option value="">학생 선택</option>
                    ${getAcademyScheduleStudentOptions(item?.student_id || '')}
                </select>
            </div>
            <div class="exam-schedule-row">
                <input type="text" id="${prefix}-teacher" class="btn" value="${apEscapeHtml(item?.teacher_name || state.auth?.name || '')}" placeholder="담당자" style="text-align:left; border:none; background:var(--surface);">
                <input type="hidden" id="${prefix}-closed" value="${type === 'closed' ? '1' : '0'}">
            </div>
            <textarea id="${prefix}-memo" class="btn" placeholder="메모" style="width:100%; min-height:86px; text-align:left; border:none; background:var(--surface); resize:vertical; font-size:14px; font-weight:400; line-height:1.7;">${apEscapeHtml(item?.memo || '')}</textarea>
        </div>
    `;
}

function renderAcademyScheduleContent() {
    const schedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1');
    const rows = schedules.map(s => {
        const tone = getAcademyScheduleTone(s.schedule_type);
        const studentName = s.target_scope === 'student' ? getAcademyScheduleStudentName(s.student_id) : '';
        const timeText = [s.start_time, s.end_time].filter(Boolean).join(' - ');
        return `
            <div class="exam-schedule-item" style="border-color:${tone.border};">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
                        <span style="font-size:11px; font-weight:600; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:3px 8px; border-radius:8px;">${getAcademyScheduleTypeLabel(s.schedule_type)}</span>
                        <span style="font-size:11px; font-weight:600; color:var(--secondary);">${apEscapeHtml(s.schedule_date || '')}${timeText ? ` · ${apEscapeHtml(timeText)}` : ''}</span>
                    </div>
                    <div style="font-size:15px; font-weight:700; line-height:1.35; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(s.title || '')}</div>
                    <div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${s.target_scope === 'student' ? `학생: ${apEscapeHtml(studentName || s.student_id || '')}` : '학원 전체'}${s.teacher_name ? ` · 담당: ${apEscapeHtml(s.teacher_name)}` : ''}</div>
                    ${s.memo ? `<div style="font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere;">${apEscapeHtml(s.memo)}</div>` : ''}
                </div>
                <button class="btn ap-small-btn" style="background:var(--surface-2); border:none; flex:0 0 auto;" onclick="openEditAcademyScheduleModal('${s.id}')">수정</button>
            </div>
        `;
    }).join('');

    return `
        ${renderAcademyScheduleForm('new-academy')}
        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:14px;" onclick="addAcademySchedule()">운영일정 저장</button>
        <div class="exam-schedule-list">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.45; padding:20px;">운영일정이 없습니다</div>`}
        </div>
    `;
}

function openExamScheduleModal(baseDateStr = '', activeTab = 'exam') {
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
            .exam-calendar-dot { width:4px; height:4px; border-radius:50%; margin-top:1px; }
            .exam-schedule-list { max-height:30vh; overflow-y:auto; padding-right:2px; }
            .exam-schedule-item { padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; }
            @media (max-width:600px) {
                .exam-schedule-form { padding:12px; }
                .exam-schedule-row { flex-direction:column; }
                .exam-schedule-list { max-height:34vh; padding-right:0; }
                .exam-schedule-item { align-items:flex-start; }
            }
        </style>
        ${renderScheduleTabs(activeTab)}
        ${activeTab === 'academy' ? renderAcademyScheduleContent() : renderExamScheduleContent(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr)}
    `;

    showModal('일정 관리', body);
    if (activeTab === 'exam') bindExamCalendarDateClicks();
    if (activeTab === 'academy') handleAcademyScheduleTypeChange('new-academy');
}

async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school').value.trim();
    const gr = document.getElementById('new-ex-grade').value;
    const na = document.getElementById('new-ex-name').value.trim();
    const da = document.getElementById('new-ex-date').value;
    const me = document.getElementById('new-ex-memo').value.trim();
    if(!da) return toast('날짜를 선택하세요.', 'warn');
    const r = await api.post('exam-schedules', { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

async function deleteExamSchedule(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('exam-schedules', id);
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

function openEditExamScheduleModal(id) {
    const e = state.db.exam_schedules.find(x => x.id === id);
    if(!e) return;
    showModal('일정 수정', `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <input type="text" id="edit-ex-school" class="btn" value="${apEscapeHtml(e.school_name || '')}" placeholder="장소/학교 (선택)" style="text-align:left; border:none; background:var(--surface);">
                <select id="edit-ex-grade" class="btn" style="border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1" ${e.grade==='중1'?'selected':''}>중1</option>
                    <option value="중2" ${e.grade==='중2'?'selected':''}>중2</option>
                    <option value="중3" ${e.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${e.grade==='고1'?'selected':''}>고1</option>
                    <option value="고2" ${e.grade==='고2'?'selected':''}>고2</option>
                    <option value="고3" ${e.grade==='고3'?'selected':''}>고3</option>
                </select>
            </div>
            <div class="exam-schedule-row">
                <input type="text" id="edit-ex-name" class="btn" value="${apEscapeHtml(e.exam_name || '')}" placeholder="일정 내용 (선택)" style="text-align:left; border:none; background:var(--surface);">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="border:none; background:var(--surface);">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${apEscapeHtml(e.memo||'')}" placeholder="추가 메모" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary ap-primary-btn" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
            <div class="exam-schedule-row" style="margin-top:4px;">
                <button class="btn ap-mid-btn" style="border:none; background:var(--surface);" onclick="openExamScheduleModal()">취소</button>
                <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteExamSchedule('${id}')">완전 삭제</button>
            </div>
        </div>
    `);
}

async function handleEditExamSchedule(id) {
    const sc = document.getElementById('edit-ex-school').value.trim();
    const gr = document.getElementById('edit-ex-grade').value;
    const na = document.getElementById('edit-ex-name').value.trim();
    const da = document.getElementById('edit-ex-date').value.trim();
    const me = document.getElementById('edit-ex-memo').value.trim();
    if(!da) return toast('날짜를 선택하세요.', 'warn');

    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) {
        toast('저장 완료', 'info');
        await loadData();
        openExamScheduleModal();
    } else {
        toast('저장 실패', 'error');
    }
}

async function addAcademySchedule() {
    const payload = collectAcademySchedulePayload('new-academy');
    if (!payload) return;
    const r = await api.post('academy-schedules', payload);
    if (r.success) {
        toast('운영일정이 저장되었습니다.', 'success');
        await loadData();
        openExamScheduleModal('', 'academy');
    } else {
        toast(r.message || '운영일정 저장에 실패했습니다.', 'warn');
    }
}

function openEditAcademyScheduleModal(id) {
    const item = (state.db.academy_schedules || []).find(s => String(s.id) === String(id));
    if (!item) return;
    showModal('운영일정 수정', `
        ${renderAcademyScheduleForm('edit-academy', item)}
        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:10px;" onclick="handleEditAcademySchedule('${id}')">수정 저장</button>
        <div class="exam-schedule-row">
            <button class="btn ap-mid-btn" style="border:none; background:var(--surface);" onclick="openExamScheduleModal('', 'academy')">취소</button>
            <button class="btn ap-mid-btn" style="color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="deleteAcademySchedule('${id}')">삭제</button>
        </div>
    `);
    handleAcademyScheduleTypeChange('edit-academy');
}

async function handleEditAcademySchedule(id) {
    const payload = collectAcademySchedulePayload('edit-academy');
    if (!payload) return;
    const r = await api.patch('academy-schedules/' + id, payload);
    if (r.success) {
        toast('운영일정이 수정되었습니다.', 'success');
        await loadData();
        openExamScheduleModal('', 'academy');
    } else {
        toast(r.message || '운영일정 수정에 실패했습니다.', 'warn');
    }
}

async function deleteAcademySchedule(id) {
    if (!confirm('운영일정을 삭제하시겠습니까?')) return;
    const r = await api.delete('academy-schedules', id);
    if (r.success) {
        toast('운영일정이 삭제되었습니다.', 'info');
        await loadData();
        openExamScheduleModal('', 'academy');
    } else {
        toast('운영일정 삭제에 실패했습니다.', 'warn');
    }
}
