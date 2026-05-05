/**
 * AP Math OS 1.0 [js/schedule.js]
 * Unified Schedule Manager:
 * - 일정관리 메뉴 하나
 * - 일정 유형은 시험 / 휴무 / 기타 세 개만 사용
 * - 시험은 exam_schedules API 사용
 * - 휴무/기타는 academy_schedules API 사용
 * - 휴무는 scheduleType 'closed', targetScope 'global'로 저장
 * - 기타는 주간일정 공유용 scheduleType 'etc', targetScope 'global'로 저장
 * - 시작일 필수, 종료일 선택 기반 날짜별 저장
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
function normalizeScheduleKind(row) {
    const rawKind = String(row?.kind || '').trim();
    if (rawKind === 'exam') return 'exam';
    if (rawKind === 'closed') return 'closed';
    if (rawKind === 'etc') return 'etc';

    const scheduleType = String(row?.schedule_type || row?.scheduleType || '').trim();
    if (scheduleType === 'closed') return 'closed';
    return 'etc';
}

function isGlobalAcademySchedule(row) {
    return String(row?.target_scope || row?.targetScope || 'global') === 'global';
}

function isClosedAcademySchedule(row) {
    return String(row?.schedule_type || row?.scheduleType || '') === 'closed';
}

function getScheduleKindOrder(kind) {
    if (kind === 'exam') return 0;
    if (kind === 'closed') return 1;
    return 2;
}

function getScheduleTypeLabel(type) {
    if (type === 'exam') return '시험';
    if (type === 'closed') return '휴무';
    return '기타';
}

function getScheduleTone(type) {
    if (type === 'exam') {
        return {
            color: 'var(--error)',
            bg: 'rgba(255,71,87,0.08)',
            border: 'rgba(255,71,87,0.18)'
        };
    }

    if (type === 'closed') {
        return {
            color: 'var(--warning)',
            bg: 'rgba(255,165,2,0.12)',
            border: 'rgba(255,165,2,0.22)'
        };
    }

    return {
        color: 'var(--primary)',
        bg: 'rgba(26,92,255,0.08)',
        border: 'rgba(26,92,255,0.16)'
    };
}

function parseScheduleDate(dateStr) {
    const parts = String(dateStr || '').split('-').map(Number);
    if (parts.length !== 3) return null;

    const [y, m, d] = parts;
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

    const date = new Date(y, m - 1, d);
    if (!Number.isFinite(date.getTime())) return null;
    return date;
}

function formatScheduleDate(date) {
    return date.toLocaleDateString('sv-SE');
}

function getDateRangeList(startDate, endDate) {
    const start = parseScheduleDate(startDate);
    if (!start) {
        toast('시작일을 입력하세요.', 'warn');
        return null;
    }

    const end = endDate ? parseScheduleDate(endDate) : start;
    if (!end) {
        toast('종료일을 확인하세요.', 'warn');
        return null;
    }

    if (end.getTime() < start.getTime()) {
        toast('종료일은 시작일보다 빠를 수 없습니다.', 'warn');
        return null;
    }

    const result = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cur.getTime() <= end.getTime()) {
        result.push(formatScheduleDate(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return result;
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
        target_scope: 'global'
    }));

    const academyRows = (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1')
        .filter(s => isGlobalAcademySchedule(s))
        .map(s => {
            const kind = isClosedAcademySchedule(s) ? 'closed' : 'etc';
            return {
                kind,
                id: s.id,
                date: s.schedule_date || '',
                title: s.title || (kind === 'closed' ? '휴무' : '일정'),
                school_name: '',
                grade: '',
                memo: s.memo || '',
                start_time: s.start_time || '',
                end_time: s.end_time || '',
                target_scope: s.target_scope || 'global'
            };
        });

    return [...examRows, ...academyRows].sort((a, b) => {
        const d = String(a.date || '').localeCompare(String(b.date || ''));
        if (d !== 0) return d;

        const ka = getScheduleKindOrder(a.kind);
        const kb = getScheduleKindOrder(b.kind);
        if (ka !== kb) return ka - kb;

        return String(a.title || '').localeCompare(String(b.title || ''), 'ko');
    });
}

function handleUnifiedScheduleTypeChange(prefix) {
    const typeEl = document.getElementById(`${prefix}-kind`);
    const schoolEl = document.getElementById(`${prefix}-school`);
    const gradeEl = document.getElementById(`${prefix}-grade`);
    const titleEl = document.getElementById(`${prefix}-title`);

    if (!typeEl) return;

    const kind = typeEl.value;
    const isExam = kind === 'exam';

    if (schoolEl) {
        schoolEl.disabled = !isExam;
        schoolEl.style.opacity = isExam ? '1' : '0.45';
    }
    if (gradeEl) {
        gradeEl.disabled = !isExam;
        gradeEl.style.opacity = isExam ? '1' : '0.45';
    }
    if (titleEl) {
        if (kind === 'exam') titleEl.placeholder = '시험명';
        else if (kind === 'closed') titleEl.placeholder = '휴무명 예) 학원방학, 추석연휴';
        else titleEl.placeholder = '일정명 예) 회의, 설명회, 공지';
    }
}

function collectUnifiedSchedulePayload(prefix) {
    const kind = document.getElementById(`${prefix}-kind`)?.value || 'exam';
    const title = document.getElementById(`${prefix}-title`)?.value.trim() || '';
    const startDate = document.getElementById(`${prefix}-date`)?.value || '';
    const endDate = document.getElementById(`${prefix}-end-date`)?.value || '';
    const memo = document.getElementById(`${prefix}-memo`)?.value.trim() || '';
    const dates = getDateRangeList(startDate, endDate);

    if (!dates) return null;

    if (kind !== 'closed' && !title) {
        toast('일정 내용을 입력하세요.', 'warn');
        return null;
    }

    if (kind === 'exam') {
        const schoolName = document.getElementById(`${prefix}-school`)?.value.trim() || '';
        const grade = document.getElementById(`${prefix}-grade`)?.value || '';

        return {
            kind,
            dates,
            buildPayload(date) {
                return {
                    schoolName,
                    grade,
                    examName: title,
                    examDate: date,
                    memo
                };
            }
        };
    }

    if (kind === 'closed') {
        return {
            kind,
            dates,
            buildPayload(date) {
                return {
                    scheduleType: 'closed',
                    title: title || '휴무',
                    scheduleDate: date,
                    startTime: '',
                    endTime: '',
                    targetScope: 'global',
                    studentId: '',
                    teacherName: '',
                    memo,
                    isClosed: true
                };
            }
        };
    }

    return {
        kind,
        dates,
        buildPayload(date) {
            return {
                scheduleType: 'etc',
                title,
                scheduleDate: date,
                startTime: '',
                endTime: '',
                targetScope: 'global',
                studentId: '',
                teacherName: '',
                memo,
                isClosed: false
            };
        }
    };
}

// ============================================================
// Render
// ============================================================
function renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr) {
    const examSchedules = state.db.exam_schedules || [];
    const academySchedules = (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1')
        .filter(s => isGlobalAcademySchedule(s));

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
        const hasClosedSchedule = academySchedules.some(s => s.schedule_date === dateStr && isClosedAcademySchedule(s));
        const hasEtcSchedule = academySchedules.some(s => s.schedule_date === dateStr && !isClosedAcademySchedule(s));

        calendarHtml += `
            <button type="button" class="exam-calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" aria-label="${dateStr}">
                <span>${d}</span>
                <span style="display:flex; gap:3px; align-items:center; justify-content:center; height:5px; margin-top:1px;">
                    <span class="exam-calendar-dot" style="background:${hasExamSchedule ? 'var(--error)' : 'transparent'};"></span>
                    <span class="exam-calendar-dot" style="background:${hasClosedSchedule ? 'var(--warning)' : 'transparent'};"></span>
                    <span class="exam-calendar-dot" style="background:${hasEtcSchedule ? 'var(--primary)' : 'transparent'};"></span>
                </span>
            </button>
        `;
    }

    calendarHtml += `
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; font-size:11px; font-weight:600; color:var(--secondary);">
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--error);margin-right:4px;"></span>시험</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--warning);margin-right:4px;"></span>휴무</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--primary);margin-right:4px;"></span>기타</span>
            </div>
        </div>
    `;

    return calendarHtml;
}

function renderUnifiedScheduleForm(prefix = 'new-sch', item = null, options = {}) {
    const kind = item?.kind || 'exam';
    const date = item?.date || new Date().toLocaleDateString('sv-SE');
    const title = item?.title || '';
    const memo = item?.memo || '';
    const schoolName = item?.school_name || '';
    const grade = item?.grade || '';
    const isEdit = options.isEdit === true;
    const kindDisabled = isEdit ? 'disabled' : '';
    const endDateDisabled = isEdit ? 'disabled' : '';

    return `
        <div class="exam-schedule-form">
            <div class="exam-schedule-row">
                <select id="${prefix}-kind" class="btn" style="border:none; background:var(--surface);" onchange="handleUnifiedScheduleTypeChange('${prefix}')" ${kindDisabled}>
                    <option value="exam" ${kind === 'exam' ? 'selected' : ''}>시험</option>
                    <option value="closed" ${kind === 'closed' ? 'selected' : ''}>휴무</option>
                    <option value="etc" ${kind === 'etc' ? 'selected' : ''}>기타</option>
                </select>
                <input type="text" id="${prefix}-title" class="btn" value="${apEscapeHtml(title)}" placeholder="일정 내용" style="text-align:left; border:none; background:var(--surface);">
            </div>

            <div class="exam-schedule-row">
                <input type="date" id="${prefix}-date" class="btn" value="${date}" style="border:none; background:var(--surface);">
                <input type="date" id="${prefix}-end-date" class="btn" value="" placeholder="종료일" style="border:none; background:var(--surface);" ${endDateDisabled}>
            </div>

            <div class="exam-schedule-row">
                <input type="text" id="${prefix}-school" class="btn" value="${apEscapeHtml(schoolName)}" placeholder="학교/장소 (시험 선택 시)" style="text-align:left; border:none; background:var(--surface);">
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

            <textarea id="${prefix}-memo" class="btn" placeholder="메모" style="width:100%; min-height:70px; text-align:left; border:none; background:var(--surface); resize:vertical; font-size:14px; font-weight:400; line-height:1.7;">${apEscapeHtml(memo)}</textarea>
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
        const subParts = [];

        if (s.kind === 'exam' && (s.school_name || s.grade)) {
            subParts.push(`${s.school_name || '일반'} ${s.grade || ''}`.trim());
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
            <div style="font-size:12px; font-weight:600; color:var(--secondary); line-height:1.45; margin-top:2px;">종료일은 긴 일정일 때만 선택합니다.</div>
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
        let successCount = 0;
        let failCount = 0;

        for (const date of payload.dates) {
            const r = payload.kind === 'exam'
                ? await api.post('exam-schedules', payload.buildPayload(date))
                : await api.post('academy-schedules', payload.buildPayload(date));

            if (r?.success) successCount++;
            else failCount++;
        }

        if (successCount > 0 && failCount === 0) {
            toast('일정이 저장되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }

        if (successCount > 0) {
            toast(`일부 일정만 저장되었습니다. 성공 ${successCount}건, 실패 ${failCount}건`, 'warn');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast('일정 저장에 실패했습니다.', 'error');
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
            target_scope: 'global'
        };
    } else {
        const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
        if (!s) return;

        const normalizedKind = isClosedAcademySchedule(s) ? 'closed' : 'etc';
        item = {
            kind: normalizedKind,
            id: s.id,
            date: s.schedule_date || '',
            title: s.title || (normalizedKind === 'closed' ? '휴무' : ''),
            school_name: '',
            grade: '',
            memo: s.memo || '',
            start_time: s.start_time || '',
            end_time: s.end_time || '',
            target_scope: s.target_scope || 'global'
        };
    }

    showModal('일정 수정', `
        ${renderUnifiedScheduleForm('edit-sch', item, { isEdit: true })}
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

    const date = payload.dates[0];
    const body = payload.buildPayload(date);

    try {
        const r = payload.kind === 'exam'
            ? await api.patch('exam-schedules/' + id, body)
            : await api.patch('academy-schedules/' + id, body);

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
    return addUnifiedSchedule();
}

function openEditAcademyScheduleModal(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return openEditUnifiedScheduleModal(kind, id);
}

async function handleEditAcademySchedule(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return handleEditUnifiedSchedule(kind, id);
}

async function deleteAcademySchedule(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return deleteUnifiedSchedule(kind, id);
}