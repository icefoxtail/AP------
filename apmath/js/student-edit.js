// Phase 1b: student edit/create/delete handlers moved from student.js without logic changes.

function renderOnboardingStartedAtEditControl(options = {}) {
    const prefix = 'edit';
    const storedDate = normalizeOnboardingDate(options.value || options.onboarding_started_at || '');
    const alreadyChecked = options.alreadyAttending || options.already_attending;
    const helperText = storedDate
        ? '저장된 등원일입니다. 필요할 때만 수정하세요.'
        : '등원일이 없으면 비워둘 수 있습니다. 이미 등원 중이면 학년별 기준일이 제안됩니다.';
    return `
        <div class="ap-student-edit-stack">
            <input id="${prefix}-onboarding-started-at" type="date" value="${apEscapeHtml(storedDate)}">
            <label class="ap-student-edit-check">
                <input id="${prefix}-already-attending" type="checkbox" ${alreadyChecked ? 'checked' : ''} onchange="setOnboardingStartedAtSuggestion('${prefix}')">
                <span>이미 등원 중인 학생입니다</span>
            </label>
            <div class="ap-student-edit-help">${apmsStudentDetailEsc(helperText)}</div>
        </div>
    `;
}

function renderStudentDetailEditTabs(sid, activeEditTab = 'basic') {
    const student = getStudentProfileEditStudent(sid);
    const tabs = [
        { key: 'basic', label: '기본' },
        { key: 'cns', label: '상담' },
        { key: 'grade', label: '성적' }
    ].filter(item => item.key === 'basic' || student?.timetable_can_edit !== false);
    return `
        <div class="apms-eie-tabs ap-student-tabs">
            ${tabs.map(item => `
                <button
                    type="button"
                    class="apms-eie-tab ${item.key === activeEditTab ? 'is-active' : ''}"
                    onclick="switchStudentDetailEditTab(${apmsStudentJsString(sid)}, ${apmsStudentJsString(item.key)})"
                >${apmsStudentDetailEsc(item.label)}</button>
            `).join('')}
        </div>
    `;
}

function renderStudentEditBodyForTab(sid, editTab = 'basic') {
    const key = String(sid || '');
    if (editTab === 'cns') {
        const pinnedHtml = renderStudentConsultationPinnedCard(key);
        return `<div class="std-tab-content ap-student-tab-body">${pinnedHtml}${renderCnsTab(key)}</div>`;
    }
    if (editTab === 'grade') {
        return `<div class="std-tab-content ap-student-tab-body">${renderGradeTab(key)}</div>`;
    }
    return renderStudentEditBody(sid);
}

function switchStudentDetailEditTab(sid, tab) {
    if (!state.ui) state.ui = {};
    const student = getStudentProfileEditStudent(sid);
    if (tab !== 'basic' && student?.timetable_can_edit === false) return;
    const current = state.ui.currentStudentDetailEditTab || 'basic';
    if (current === tab) return;
    if (current === 'basic') {
        const nameInput = document.getElementById('edit-name');
        const classInput = document.getElementById('edit-class');
        const s = getStudentProfileEditStudent(sid);
        const currentClassId = getStudentProfileEditClassMapping(sid)?.class_id || '';
        const nameChanged = !!nameInput && !!s && nameInput.value.trim() !== String(s.name || '').trim();
        const classChanged = !!classInput && String(classInput.value || '') !== String(currentClassId || '');
        if (nameChanged || classChanged) {
            if (!confirm('기본정보 수정 내용이 저장되지 않습니다. 탭을 이동하시겠습니까?')) return;
        }
    }
    state.ui.currentStudentDetailEditTab = tab;
    renderStudentDetailShell(sid, { mode: 'edit' });
}

if (typeof window !== 'undefined') {
    window.switchStudentDetailEditTab = switchStudentDetailEditTab;
}

async function handleDelete(sid) {
    if (!confirm('이 학생을 퇴원 처리하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;

    try {
        const r = await api.delete('students', sid);
        if (r?.success) {
            toast('퇴원 처리되었습니다.', 'info');
            mergeStudentCreateResponseIntoState(r);
            mergeStudentEnrollmentRowsAfterEdit(sid, r.student_enrollments);
            closeModal();
            refreshCurrentStudentListViewAfterMutation(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '퇴원 처리에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDelete] failed:', e);
        toast('퇴원 처리 중 오류가 발생했습니다.', 'error');
    }
}

let restoreStudentSubmitting = false;

handleRestore.isReenrollmentModalOpen = function(sid) {
    const overlay = document.getElementById('modal-overlay');
    const marker = document.querySelector('[data-student-reenrollment]');
    return !!overlay
        && overlay.classList.contains('show')
        && !overlay.classList.contains('hidden')
        && String(marker?.dataset?.studentReenrollment || '') === String(sid || '');
};

async function handleRestore(sid) {
    if (restoreStudentSubmitting) {
        toast('다른 학생의 재등원 처리가 진행 중입니다.', 'info');
        return;
    }
    const student = state.db.students.find(row => String(row.id) === String(sid));
    if (!student) {
        toast('학생 정보를 찾을 수 없습니다.', 'error');
        return;
    }
    const currentClassId = state.db.class_students.find(row => String(row.student_id) === String(sid))?.class_id || '';
    const selectableClasses = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0));
    if (!selectableClasses.length) {
        toast('재등원할 활성 반이 없습니다.', 'warn');
        return;
    }
    const options = selectableClasses.map(cls => `
        <option value="${studentAttr(cls.id)}" ${String(cls.id) === String(currentClassId) ? 'selected' : ''}>${apEscapeHtml(apmsGetClassOptionDisplayLabel(cls, selectableClasses))}</option>
    `).join('');
    showModal('재등원 처리', `
        <div data-student-reenrollment="${studentAttr(sid)}" style="display:grid; gap:16px;">
            <div style="padding:14px; border:1px solid var(--border); border-radius:12px; background:var(--surface-2);">
                <div style="font-size:16px; font-weight:700; color:var(--text);">${apEscapeHtml(student.name || '학생')}</div>
                <div style="margin-top:5px; font-size:12px; line-height:1.55; color:var(--secondary);">기존 PIN, 상담·수업·시험·결제 이력은 유지되고 새 수강 기간이 시작됩니다.</div>
            </div>
            <label style="display:grid; gap:7px; font-size:13px; font-weight:600; color:var(--text);">
                재등원 반
                <select id="restore-class" class="std-input-base" style="width:100%; min-height:44px; box-sizing:border-box;">
                    <option value="">반 선택</option>${options}
                </select>
            </label>
            <label style="display:grid; gap:7px; font-size:13px; font-weight:600; color:var(--text);">
                재등원일
                <input id="restore-date" type="date" class="std-input-base" value="${studentAttr(getTodayKstDateText())}" max="${studentAttr(getTodayKstDateText())}" style="width:100%; min-height:44px; box-sizing:border-box;">
            </label>
        </div>
    `, '재등원', () => handleRestore.confirm(sid));
    requestAnimationFrame(() => document.getElementById('restore-class')?.focus());
}

handleRestore.confirm = async function(sid) {
    if (restoreStudentSubmitting || !handleRestore.isReenrollmentModalOpen(sid)) return;
    const classId = String(document.getElementById('restore-class')?.value || '').trim();
    const reenrollmentDate = String(document.getElementById('restore-date')?.value || '').trim();
    if (!classId) { toast('재등원할 반을 선택해 주세요.', 'warn'); return; }
    if (!reenrollmentDate) { toast('재등원일을 선택해 주세요.', 'warn'); return; }
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const actionBtn = document.getElementById('modal-action-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    restoreStudentSubmitting = true;
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.dataset.mutationPending = 'reenrollment';
    if (actionBtn) {
        actionBtn.disabled = true;
        actionBtn.textContent = '처리 중…';
    }
    if (cancelBtn) cancelBtn.disabled = true;

    try {
        const r = await api.patch(`students/${sid}/restore`, {
            class_id: classId,
            reenrollment_date: reenrollmentDate
        });
        if (r?.success) {
            toast('재등원 처리되었습니다.', 'success');
            mergeStudentCreateResponseIntoState(r);
            mergeStudentEnrollmentRowsAfterEdit(sid, r.student_enrollments);
            const refreshes = [];
            if (typeof loadStudentFoundationDetails === 'function') refreshes.push(loadStudentFoundationDetails(sid, { force: true }));
            if (typeof ensureStudentDetailLazyData === 'function') refreshes.push(ensureStudentDetailLazyData(sid, { force: true, refresh: false }));
            if (refreshes.length) await Promise.allSettled(refreshes);
            if (handleRestore.isReenrollmentModalOpen(sid)) {
                if (overlay) delete overlay.dataset.mutationPending;
                closeModal();
                if (typeof openWithdrawalReport === 'function') openWithdrawalReport();
                else refreshCurrentStudentListViewAfterMutation(returnCtx);
            } else {
                refreshCurrentStudentListViewAfterMutation(returnCtx);
            }
            return;
        }
        toast(r?.message || r?.error || '재등원 처리에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleRestore] failed:', e);
        toast('재등원 처리 중 오류가 발생했습니다.', 'error');
    } finally {
        restoreStudentSubmitting = false;
        if (overlay?.dataset?.mutationPending === 'reenrollment') delete overlay.dataset.mutationPending;
        if (handleRestore.isReenrollmentModalOpen(sid)) {
            const currentActionBtn = document.getElementById('modal-action-btn');
            const currentCancelBtn = document.getElementById('modal-cancel-btn');
            if (currentActionBtn) {
                currentActionBtn.disabled = false;
                currentActionBtn.textContent = '재등원';
            }
            if (currentCancelBtn) currentCancelBtn.disabled = false;
        }
    }
};

function sortClassesForStudentModal(classes = []) {
    const gradeRank = (cls) => {
        const text = `${cls?.grade || ''} ${cls?.name || ''}`;
        if (/중1/.test(text)) return 1;
        if (/중2/.test(text)) return 2;
        if (/중3/.test(text)) return 3;
        if (/고1/.test(text)) return 4;
        if (/고2/.test(text)) return 5;
        if (/고3/.test(text)) return 6;
        return 99;
    };

    return [...classes].sort((a, b) => {
        const diff = gradeRank(a) - gradeRank(b);
        if (diff !== 0) return diff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function inferGradeFromClass(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const m = text.match(/(중1|중2|중3|고1|고2|고3)/);
    return m ? m[1] : '';
}

function studentAttr(value) {
    return apEscapeHtml(String(value ?? ''));
}


var AP_HIGH_SUBJECTS = ['대수', '미적분Ⅰ', '확률과통계', '미적분Ⅱ', '기하'];
let addStudentSubmitting = false;

function getOnboardingStartDateInputId(prefix) {
    return `${prefix}-onboarding-started-at`;
}

function getTodayKstDateText() {
    return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
}

function getDateTextDaysAgo(days) {
    const date = new Date(`${getTodayKstDateText()}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() - Number(days || 0));
    return date.toISOString().slice(0, 10);
}

// 기존 재원생 학년별 기준 등원일.
// '이미 등원 중'(= 신입 온보딩 대상이 아닌 기존 재원생)일 때 사용한다.
function getDefaultOnboardingStartedAtByGradeText(gradeText) {
    const text = String(gradeText || '').trim();
    if (text.includes('중1')) return '2026-01-12';
    if (text.includes('중2')) return '2025-03-01';
    if (text.includes('중3')) return '2024-03-01';
    return '';
}

function getDefaultOnboardingStartedAtByGrade(student) {
    const rawGrade = String(
        student?.grade ||
        student?.student_grade ||
        student?.grade_label ||
        student?.school_grade ||
        student?.level ||
        ''
    ).trim();
    return getDefaultOnboardingStartedAtByGradeText(rawGrade);
}

// 폼에서 현재 학년 텍스트를 안전하게 읽는다(edit: 학년 select, add: 선택 반에서 추론).
function getOnboardingGradeTextForPrefix(prefix) {
    const direct = String(document.getElementById(`${prefix}-grade`)?.value || '').trim();
    if (direct) return direct;
    const classId = String(document.getElementById(`${prefix}-class`)?.value || '').trim();
    if (classId) {
        const cls = (state.db.classes || []).find(c => String(c.id) === classId);
        if (cls) return inferGradeFromClass(cls);
    }
    return '';
}

// '이미 등원 중' 체크박스 onchange.
// 체크 + 등원일이 비어 있을 때만 학년별 기준일을 제안한다.
// 기존/직접 입력값은 덮어쓰지 않고, 학년 불명이면 아무것도 하지 않는다. (today/7일전 fallback 없음)
function setOnboardingStartedAtSuggestion(prefix) {
    const checked = document.getElementById(`${prefix}-already-attending`)?.checked || false;
    const input = document.getElementById(getOnboardingStartDateInputId(prefix));
    if (!checked || !input) return;
    if (String(input.value || '').trim()) return;
    const defaultDate = getDefaultOnboardingStartedAtByGradeText(getOnboardingGradeTextForPrefix(prefix));
    if (!defaultDate) return;
    input.value = defaultDate;
}

function renderOnboardingStartedAtFields(prefix, options = {}) {
    const safePrefix = apEscapeHtml(prefix);
    const storedDate = normalizeOnboardingDate(options.value || options.onboarding_started_at || '');
    const isEdit = prefix === 'edit';
    const defaultDate = isEdit ? storedDate : (storedDate || getTodayKstDateText());
    const alreadyChecked = options.alreadyAttending || options.already_attending;
    const helperText = storedDate
        ? '저장된 등원일입니다. 필요할 때만 수정하세요.'
        : (isEdit ? '등원일이 없으면 비워둘 수 있습니다. 신입생 적응 확인이 필요할 때만 저장하세요.' : '신입생 적응 확인은 이 날짜를 기준으로 표시됩니다.');
    const attendingHint = storedDate
        ? '이미 등원 중으로 저장하면 신입생 상담 알림을 숨깁니다.'
        : '이미 등원 중인 학생이면 체크 후 저장하세요. 신입생 상담 알림을 만들지 않습니다.';
    return `
        <div class="std-input-base" style="display:flex; flex-direction:column; gap:8px;">
            <label for="${safePrefix}-onboarding-started-at" style="font-size:12px; font-weight:500; color:var(--secondary); line-height:1.4;">등원일</label>
            <input id="${safePrefix}-onboarding-started-at" type="date" value="${apEscapeHtml(defaultDate)}" style="width:100%; min-height:44px; box-sizing:border-box; padding:0 10px; border:1px solid var(--border); border-radius:10px; background:var(--surface); color:var(--text); font-size:13px; font-weight:500;">
            <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">${helperText}</div>
            <label style="display:flex; align-items:center; gap:7px; min-height:26px; font-size:13px; font-weight:500; color:var(--text); cursor:pointer;">
                <input id="${safePrefix}-already-attending" type="checkbox" ${alreadyChecked ? 'checked' : ''} onchange="setOnboardingStartedAtSuggestion('${safePrefix}')" style="width:15px; height:15px; accent-color:#6E66C9; cursor:pointer;">
                <span>이미 등원 중인 학생입니다</span>
            </label>
            <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">${attendingHint}</div>
        </div>
    `;
}

async function bootstrapOnboardingTasks(payload = {}) {
    const studentId = String(payload.student_id || payload.studentId || '').trim();
    const classId = String(payload.class_id || payload.classId || '').trim();
    if (!studentId || !classId) return null;
    const onboardingStartedAt = normalizeOnboardingDate(payload.onboarding_started_at || payload.onboardingStartedAt) || getTodayKstDateText();
    const alreadyAttending = !!(payload.already_attending || payload.alreadyAttending);
    try {
        const result = await api.post('onboarding/tasks/bootstrap', {
            student_id: studentId,
            class_id: classId,
            onboarding_started_at: onboardingStartedAt,
            already_attending: alreadyAttending ? 1 : 0
        });
        if (result?.success) {
            syncStudentOnboardingEntry(studentId, {
                ...result,
                onboarding_started_at: result.onboarding_started_at || onboardingStartedAt,
                already_attending: alreadyAttending || result.already_attending
            });
            if (typeof refreshOnboardingTasksAfterAction === 'function') {
                refreshOnboardingTasksAfterAction().catch?.(() => {});
            }
        }
        return result;
    } catch (e) {
        console.warn('[bootstrapOnboardingTasks] failed:', e);
        return null;
    }
}

function parseHighSubjects(value) {
    if (Array.isArray(value)) {
        return value.map(v => String(v || '').trim()).filter(Boolean);
    }
    const raw = String(value || '').trim();
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(v => String(v || '').trim()).filter(Boolean);
    } catch (e) {}
    return raw.split(',').map(v => v.trim()).filter(Boolean);
}

function isHighSubjectGrade(grade) {
    return String(grade || '').includes('고2') || String(grade || '').includes('고3');
}

function renderHighSubjectChecks(prefix, grade, excludedSubjects, options = {}) {
    const excluded = new Set(parseHighSubjects(excludedSubjects));
    const visible = isHighSubjectGrade(grade);
    const showTitle = options.showTitle !== false;
    const showDescription = options.showDescription !== false;
    return `
        <div id="${prefix}-high-subjects-wrap" style="display:${visible ? 'inline-block' : 'none'}; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:10px 12px;">
            ${showTitle ? '<div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:5px; line-height:1.4;">수강하지 않는 과목</div>' : ''}
            ${showDescription ? '<div style="font-size:11px; color:var(--muted); margin-bottom:9px; line-height:1.45;">수강 정보만 기록합니다. 체크 여부와 무관하게 반에 출제된 시험지는 모두 학생 포털에 표시됩니다.</div>' : ''}
            <div style="display:grid; width:100%; grid-template-columns:repeat(auto-fit, minmax(96px, 1fr)); gap:6px 10px;">
                ${AP_HIGH_SUBJECTS.map((subject, idx) => `
                    <label style="display:flex; align-items:center; gap:6px; min-height:24px; font-size:13px; font-weight:500; color:var(--text); cursor:pointer; white-space:nowrap;">
                        <input type="checkbox" class="${prefix}-high-subject" value="${apEscapeHtml(subject)}" ${excluded.has(subject) ? 'checked' : ''} style="width:15px; height:15px; accent-color:#6E66C9; cursor:pointer;">
                        <span>${apEscapeHtml(subject)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function syncHighSubjectWrap(prefix, grade) {
    const visible = isHighSubjectGrade(grade);
    const row = document.getElementById(`${prefix}-high-subjects-row`);
    if (row) row.style.display = visible ? '' : 'none';
    const wrap = document.getElementById(`${prefix}-high-subjects-wrap`);
    if (!wrap) return;
    wrap.style.display = visible ? 'inline-block' : 'none';
}

function syncEditStudentHighSubjects() {
    const grade = document.getElementById('edit-grade')?.value || '';
    syncHighSubjectWrap('edit', grade);
}

function syncAddStudentHighSubjects() {
    const classId = document.getElementById('add-class')?.value || '';
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    const grade = inferGradeFromClass(cls);
    syncHighSubjectWrap('add', grade);
}

function collectHighSubjectExclusions(prefix, grade) {
    if (!isHighSubjectGrade(grade)) return [];
    return Array.from(document.querySelectorAll(`.${prefix}-high-subject:checked`))
        .map(el => String(el.value || '').trim())
        .filter(Boolean);
}

function syncEditStudentGrade() {
    const classId = document.getElementById('edit-class')?.value || '';
    const cls = getStudentProfileEditableClasses().find(c => String(c.id) === String(classId));
    if (cls?.grade) {
        document.getElementById('edit-grade').value = cls.grade;
    }
    syncEditStudentHighSubjects();
}

// 기존 호출 호환용 wrapper (삭제 금지). 단일 셸의 edit mode로 위임한다.
function openEditStudent(sid, options = {}) {
    return openStudentDetail(sid, { ...options, mode: 'edit' });
}

function mergeStudentEnrollmentRowsAfterEdit(sid, rows) {
    if (!Array.isArray(rows)) return;
    const studentId = String(sid || '');
    ['db', 'allDb'].forEach(key => {
        if (!state[key]) return;
        const current = Array.isArray(state[key].student_enrollments) ? state[key].student_enrollments : [];
        state[key].student_enrollments = current
            .filter(row => String(row.student_id || '') !== studentId)
            .concat(rows);
    });
}

function getStudentProfileEditStudent(sid) {
    const key = String(sid || '');
    return [...(state.db.students || []), ...(state.db.timetable_students || [])]
        .find(student => String(student.id) === key) || null;
}

function getStudentProfileEditClassMapping(sid) {
    const key = String(sid || '');
    return (state.db.class_students || []).find(row => String(row.student_id) === key)
        || (state.db.timetable_class_students || []).find(row => String(row.student_id) === key)
        || null;
}

function getStudentProfileEditableClasses() {
    const rows = [...(state.db.classes || []), ...(state.db.timetable_classes || [])];
    const byId = new Map();
    rows.forEach(row => {
        const key = String(row?.id || '');
        if (key && !byId.has(key)) byId.set(key, row);
    });
    return Array.from(byId.values()).filter(row => Number(row.is_active) !== 0);
}

/**
 * edit mode 본문. 최근 상담 카드는 셸에서 공통 렌더하므로 여기서 다시 넣지 않는다.
 * 기존 input id는 handleEditStudent가 읽으므로 변경 금지.
 */
function renderStudentEditBody(sid) {
    const s = getStudentProfileEditStudent(sid);
    if (!s) return '<div class="ap-student-card">학생 정보를 찾을 수 없습니다.</div>';
    const current = getStudentProfileEditClassMapping(sid);
    // grade가 비어 있거나 반과 불일치하는 기존 데이터에서도 고2/고3 반 학생이면 내신 과목을 노출한다.
    const allEditableClasses = getStudentProfileEditableClasses();
    const currentClass = current ? allEditableClasses.find(c => String(c.id) === String(current.class_id)) : null;
    const effectiveGrade = s.grade || inferGradeFromClass(currentClass);
    const selectableClasses = sortClassesForStudentModal(allEditableClasses);
    const opts = selectableClasses.map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id) === String(current?.class_id) ? 'selected' : ''}>${apEscapeHtml(apmsGetClassOptionDisplayLabel(c, selectableClasses))}</option>`).join('');
    const canManageRecords = s.timetable_can_edit !== false;
    const isNew = isStudentNewMember(s);
    const isLeave = isStudentOnLeave(s);
    const onboardingEntry = getStudentOnboardingEntry(sid);
    const onboardingDate = getStudentOnboardingStartedAt(sid);
    const cleanMemo = '';

    return `
        <div class="apms-student-contrast ap-student-edit-body">
            <section class="ap-student-card">
                <div class="ap-student-section-head"><h3>기본 정보</h3><span>필수</span></div>
                <div class="ap-student-edit-list">
                    ${apStudentEditRow('이름', `<input id="edit-name" value="${studentAttr(s.name)}" placeholder="이름">`)}
                    ${apStudentEditRow('학교', `<input id="edit-school" value="${studentAttr(s.school_name)}" placeholder="학교">`)}
                    ${apStudentEditRow('학년', `<select id="edit-grade" onchange="syncEditStudentHighSubjects()">
                        <option value="중1" ${effectiveGrade==='중1'?'selected':''}>중1</option><option value="중2" ${effectiveGrade==='중2'?'selected':''}>중2</option><option value="중3" ${effectiveGrade==='중3'?'selected':''}>중3</option>
                        <option value="고1" ${effectiveGrade==='고1'?'selected':''}>고1</option><option value="고2" ${effectiveGrade==='고2'?'selected':''}>고2</option><option value="고3" ${effectiveGrade==='고3'?'selected':''}>고3</option>
                    </select>`)}
                    ${apStudentEditRow('배정 반', `<select id="edit-class" onchange="syncEditStudentGrade()"><option value="">반 미배정</option>${opts}</select>`)}
                    ${apStudentEditRow('수강하지 않는 과목', renderHighSubjectChecks('edit', effectiveGrade, s.high_subject_exclusions, { showTitle: false }), { wide: true, id: 'edit-high-subjects-row', style: isHighSubjectGrade(effectiveGrade) ? '' : 'display:none;' })}
                </div>
            </section>
            <section class="ap-student-card">
                <div class="ap-student-section-head"><h3>학생 상세 정보</h3><span>연락처 · 관리</span></div>
                <div class="ap-student-edit-list">
                    ${apStudentEditRow('학생 연락처', `<input id="edit-student-phone" type="tel" value="${studentAttr(s.student_phone || '')}" placeholder="학생 전화번호">`)}
                    ${apStudentEditRow('보호자 정보', `<div class="ap-student-edit-inline"><input id="edit-parent-phone" type="tel" value="${studentAttr(s.parent_phone || '')}" placeholder="보호자 전화번호"><input id="edit-guardian-rel" value="${studentAttr(s.guardian_relation || '')}" placeholder="관계"></div>`)}
                    ${apStudentEditRow('주소', `<input id="edit-student-address" value="${studentAttr(s.student_address || '')}" placeholder="주소">`)}
                    ${apStudentEditRow('차량', `<input id="edit-vehicle-info" value="${studentAttr(s.vehicle_info || '')}" placeholder="차량">`)}
                    ${apStudentEditRow('등원일', renderOnboardingStartedAtEditControl({ value: onboardingDate, alreadyAttending: onboardingEntry.already_attending }), { wide: true })}
                    ${apStudentEditRow('메모', `<textarea id="edit-memo" placeholder="메모">${apEscapeHtml(cleanMemo)}</textarea>`, { wide: true })}
                    ${apStudentEditRow('PIN 번호', `<div class="ap-student-edit-inline"><input id="edit-student-pin" value="${studentAttr(s.student_pin || '')}" placeholder="PIN (4자리 숫자)" maxlength="4" inputmode="numeric"><button type="button" class="btn ap-student-mini-btn" onclick="autoGenerateStudentPin(${apmsStudentJsString(sid)})">PIN 자동생성</button></div>`)}
                    ${apStudentEditRow('상태', `<div class="ap-student-edit-flags">
                        <label class="ap-student-edit-flag"><input type="checkbox" id="edit-is-new" ${isNew ? 'checked' : ''}><span>신입생</span></label>
                        ${canManageRecords
                            ? `<label class="ap-student-edit-flag is-warn"><input type="checkbox" id="edit-is-leave" ${isLeave ? 'checked' : ''}><span>휴원</span></label>`
                            : `<span class="apms-student-muted">${isLeave ? '휴원 · ' : ''}상태 변경은 담당 교사만 가능</span>`}
                    </div>`)}
                </div>
            </section>
            ${renderStudentRecentActivitySection(sid)}
            ${renderStudentHistorySection(sid)}
            ${s.timetable_can_edit !== false ? `<details class="apms-eie-form-drawer">
                <summary>퇴원 처리</summary>
                <div class="apms-eie-form-drawer-body">
                    <button type="button" class="btn apms-eie-form-danger" onclick="handleDelete('${sid}')">퇴원 처리</button>
                </div>
            </details>` : ''}
        </div>
    `;
}

let editStudentSubmitting = false;
function isSameStudentEditModalOpen(sid) {
    const overlay = document.getElementById('modal-overlay');
    return String(state.ui?.currentStudentDetailId || '') === String(sid)
        && state.ui?.currentStudentDetailMode === 'edit'
        && !!overlay
        && overlay.classList.contains('show')
        && !overlay.classList.contains('hidden');
}

async function handleEditStudent(sid) {
    if (editStudentSubmitting) {
        toast('학생 정보를 저장하고 있습니다.', 'info');
        return;
    }
    const returnCtx = state.ui?.currentStudentDetailReturnTo || state.ui?.modalReturnView || null;
    const currentStudent = getStudentProfileEditStudent(sid);
    const currentClassId = getStudentProfileEditClassMapping(sid)?.class_id || '';
    const canManageRecords = currentStudent?.timetable_can_edit !== false;
    const wasNewChecked = isStudentNewMember(currentStudent);
    const pin = document.getElementById('edit-student-pin')?.value.trim() || '';
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }

    const classId = document.getElementById('edit-class')?.value || '';
    const editGrade = document.getElementById('edit-grade')?.value || '';
    const grade = editGrade;

    const isNewChecked = document.getElementById('edit-is-new')?.checked || false;
    const requestedLeaveChecked = document.getElementById('edit-is-leave')?.checked || false;
    const currentStatus = normalizeStudentStatus(currentStudent?.status);
    const hasLegacyLeaveMemo = currentStatus === '재원' && String(currentStudent?.memo || '').indexOf('#휴원') !== -1;
    const currentWasLeave = currentStatus === '휴원' || hasLegacyLeaveMemo;
    const isLeaveChecked = canManageRecords ? requestedLeaveChecked : currentWasLeave;
    const nextStudentStatus = isLeaveChecked ? '휴원' : (currentWasLeave ? '재원' : currentStatus);
    const alreadyAttending = document.getElementById('edit-already-attending')?.checked || false;
    const currentOnboardingStartedAt = getStudentOnboardingStartedAt(sid);
    const onboardingInputRaw = normalizeOnboardingDate(document.getElementById(getOnboardingStartDateInputId('edit'))?.value || '');
    const onboardingDateChanged = !!onboardingInputRaw && String(currentOnboardingStartedAt || '') !== String(onboardingInputRaw);
    const cleanMemo = '';
    const memoParts = [];
    if (isNewChecked && !alreadyAttending) memoParts.push('#신입');
    if (isLeaveChecked) memoParts.push('#휴원');
    if (cleanMemo) memoParts.push(cleanMemo);
    const finalMemo = memoParts.join(' ').trim();
    const highSubjectExclusions = collectHighSubjectExclusions('edit', grade);
    const highSubjects = isHighSubjectGrade(grade) ? AP_HIGH_SUBJECTS : [];

    const studentPhoneInput = (document.getElementById('edit-student-phone')?.value || '').trim();
    const parentPhoneInput = (document.getElementById('edit-parent-phone')?.value || '').trim();
    // 기존 데이터('010' 등 자리표시 값)를 막지 않도록 형식만 느슨하게 검사한다.
    const phonePattern = /^[0-9+\-() ]*$/;
    if (!phonePattern.test(studentPhoneInput)) { toast('학생 연락처에 숫자와 -, +, 괄호만 입력할 수 있습니다.', 'warn'); return; }
    if (!phonePattern.test(parentPhoneInput)) { toast('보호자 연락처에 숫자와 -, +, 괄호만 입력할 수 있습니다.', 'warn'); return; }

    const payload = {
        name: document.getElementById('edit-name')?.value || '',
        school_name: document.getElementById('edit-school')?.value || '',
        grade,
        class_id: classId,
        student_phone: studentPhoneInput,
        parent_phone: parentPhoneInput,
        guardian_relation: document.getElementById('edit-guardian-rel')?.value || '',
        student_address: document.getElementById('edit-student-address')?.value || '',
        vehicle_info: document.getElementById('edit-vehicle-info')?.value || '',
        ...(canManageRecords ? { status: nextStudentStatus } : {}),
        memo: finalMemo,
        student_pin: pin,
        high_subjects: JSON.stringify(highSubjects),
        highSubjects: highSubjects,
        high_subject_exclusions: JSON.stringify(highSubjectExclusions),
        highSubjectExclusions: highSubjectExclusions,
        ...(onboardingDateChanged ? { onboarding_started_at: onboardingInputRaw, onboardingStartedAt: onboardingInputRaw } : {})
    };

    const actionBtn = document.getElementById('modal-action-btn');
    const cancelBtn = document.getElementById('modal-cancel-btn');
    const previousActionText = actionBtn?.textContent || '저장';
    editStudentSubmitting = true;
    if (actionBtn) {
        actionBtn.disabled = true;
        actionBtn.textContent = '저장 중…';
    }
    if (cancelBtn) cancelBtn.disabled = true;

    try {
        const r = await api.patch(`students/${sid}`, payload);
        if (r?.success) {
            const classChanged = String(classId || '') !== String(currentClassId || '');
            const becameNew = !wasNewChecked && isNewChecked;
            if (!!classId && onboardingDateChanged) {
                await bootstrapOnboardingTasks({
                    student_id: sid,
                    class_id: classId,
                    onboarding_started_at: onboardingInputRaw,
                    already_attending: alreadyAttending ? 1 : 0
                });
            }
            const mergedStudent = mergeStudentCreateResponseIntoState(r);
            const nextScopeOnly = mergedStudent?.timetable_scope_only === true;
            if (nextScopeOnly) {
                if (!state.ui.timetableStudentDetails) state.ui.timetableStudentDetails = {};
                const detail = state.ui.timetableStudentDetails[String(sid)] || {};
                state.ui.timetableStudentDetails[String(sid)] = {
                    ...detail,
                    student: mergedStudent || detail.student,
                    class_student: Object.prototype.hasOwnProperty.call(r, 'class_student') ? r.class_student : detail.class_student,
                    student_enrollments: Array.isArray(r.student_enrollments) ? r.student_enrollments : (detail.student_enrollments || []),
                    class_transfer_history: Array.isArray(r.class_transfer_history) ? r.class_transfer_history : (detail.class_transfer_history || [])
                };
            } else {
                if (state.ui.timetableStudentDetails) delete state.ui.timetableStudentDetails[String(sid)];
                mergeStudentEnrollmentRowsAfterEdit(sid, r.student_enrollments);
            }
            if (onboardingDateChanged) setStudentOnboardingStartedAtInState(sid, onboardingInputRaw);
            if (classChanged) {
                const refreshes = [];
                if (!nextScopeOnly && typeof loadStudentFoundationDetails === 'function') {
                    refreshes.push(loadStudentFoundationDetails(sid, { force: true }));
                }
                if (!nextScopeOnly && typeof ensureStudentDetailLazyData === 'function') {
                    refreshes.push(ensureStudentDetailLazyData(sid, { force: true, refresh: false }));
                }
                if (refreshes.length) await Promise.all(refreshes);
            }
            toast('학생 정보가 수정되었습니다.', 'success');
            let reopenedAfterClassChange = false;
            try {
                if (classChanged && typeof refreshDataOnly === 'function') await refreshDataOnly();
                if (returnCtx?.type === 'timetable' && typeof renderTimetable === 'function') renderTimetable();
                if (classChanged && isSameStudentEditModalOpen(sid)) {
                    await openStudentDetail(sid, {
                        mode: 'view',
                        tab: normalizeStudentDetailTab(state.ui?.currentStudentDetailTab || 'basic'),
                        returnTo: returnCtx
                    });
                    reopenedAfterClassChange = state.ui?.currentStudentDetailMode === 'view';
                }
            } catch (syncError) {
                console.warn('[handleEditStudent] post-save refresh failed:', syncError);
                toast('저장은 완료되었습니다. 최신 화면이 보이지 않으면 시간표를 다시 열어 주세요.', 'warn');
            }
            if (reopenedAfterClassChange) return;
            const stillEditingSameStudent = isSameStudentEditModalOpen(sid);
            if (stillEditingSameStudent) {
                // 수정 저장은 모달을 닫지 않고 같은 학생상세 보기 모드로 복귀한다.
                if (!nextScopeOnly) await loadStudentOnboardingDetails(sid, { force: true, classId, refresh: false });
                if (isSameStudentEditModalOpen(sid)) {
                    renderStudentDetailShell(sid, { mode: 'view', tab: normalizeStudentDetailTab(state.ui?.currentStudentDetailTab || 'basic'), returnTo: returnCtx });
                }
            }
            return;
        }
        toast(r?.message || r?.error || '학생 정보 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditStudent] failed:', e);
        toast('학생 정보 수정 중 오류가 발생했습니다.', 'error');
    } finally {
        editStudentSubmitting = false;
        const stillEditingSameStudent = isSameStudentEditModalOpen(sid);
        if (actionBtn && stillEditingSameStudent) {
            actionBtn.disabled = false;
            actionBtn.textContent = previousActionText;
        }
        if (cancelBtn && stillEditingSameStudent) cancelBtn.disabled = false;
    }
}

function openAddStudent(defaultCid = '', options = {}) {
    if (options.returnTo && typeof setModalReturnView === 'function') setModalReturnView(options.returnTo);
    const selectableClasses = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0));
    const opts = selectableClasses.map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id)===String(defaultCid)?'selected':''}>${apEscapeHtml(apmsGetClassOptionDisplayLabel(c, selectableClasses))}</option>`).join('');
    showModal('신규 학생 추가', `
        <div class="apms-student-contrast apms-student-form-view" style="display: flex; flex-direction: column; gap: 10px; padding: 0 16px 4px; box-sizing: border-box;">
            <input id="add-name" class="std-input-base" placeholder="이름 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <input id="add-school" class="std-input-base" placeholder="학교 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <select id="add-class" class="std-input-base" onchange="syncAddStudentHighSubjects()" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;"><option value="">반 선택</option>${opts}</select>
            <input id="add-student-phone" class="std-input-base" placeholder="학생 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <input id="add-parent-phone" class="std-input-base" placeholder="학부모 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <input id="add-guardian-rel" class="std-input-base" placeholder="보호자 관계" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <input id="add-student-address" class="std-input-base" placeholder="주소" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            <input id="add-vehicle-info" class="std-input-base" placeholder="차량" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight:500; outline: none;">
            ${renderOnboardingStartedAtFields('add')}
            ${renderHighSubjectChecks('add', inferGradeFromClass(state.db.classes.find(c => String(c.id) === String(defaultCid))), [])}
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    if (addStudentSubmitting) {
        toast('학생 등록을 처리 중입니다.', 'info');
        return;
    }

    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const n = document.getElementById('add-name')?.value.trim() || '';
    const sc = document.getElementById('add-school')?.value.trim() || '';
    const classId = document.getElementById('add-class')?.value || '';
    const studentPhone = document.getElementById('add-student-phone')?.value.trim() || '';
    const parentPhone = document.getElementById('add-parent-phone')?.value.trim() || '';
    const guardianRelation = document.getElementById('add-guardian-rel')?.value.trim() || '';
    const studentAddress = document.getElementById('add-student-address')?.value.trim() || '';
    const vehicleInfo = document.getElementById('add-vehicle-info')?.value.trim() || '';
    const addAlreadyAttending = document.getElementById('add-already-attending')?.checked || false;
    // 7일전 fallback 제거: 기존 재원생(이미 등원 중)은 학년별 기준일, 그 외 신규 등록은 오늘(기존 add 기본값) 사용.
    const addGradeDefault = addAlreadyAttending ? getDefaultOnboardingStartedAtByGradeText(getOnboardingGradeTextForPrefix('add')) : '';
    const addOnboardingStartedAt = normalizeOnboardingDate(document.getElementById(getOnboardingStartDateInputId('add'))?.value || '') || addGradeDefault || getTodayKstDateText();
    if (!n || !sc) { toast('이름과 학교를 입력해주세요.', 'warn'); return; }

    if (!classId) { toast('반을 선택하세요.', 'warn'); return; }
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) { toast('반 정보를 찾을 수 없습니다.', 'warn'); return; }
    const grade = inferGradeFromClass(cls);
    const highSubjectExclusions = collectHighSubjectExclusions('add', grade);
    const highSubjects = isHighSubjectGrade(grade) ? AP_HIGH_SUBJECTS : [];
    const payload = {
        name: n, school_name: sc, schoolName: sc, grade: grade || '',
        class_id: classId, classId: classId,
        student_phone: studentPhone, studentPhone: studentPhone,
        parent_phone: parentPhone, parentPhone: parentPhone,
        guardian_relation: guardianRelation, guardianRelation: guardianRelation,
        student_address: studentAddress, studentAddress: studentAddress,
        vehicle_info: vehicleInfo, vehicleInfo: vehicleInfo,
        high_subjects: JSON.stringify(highSubjects), highSubjects: highSubjects,
        high_subject_exclusions: JSON.stringify(highSubjectExclusions), highSubjectExclusions: highSubjectExclusions,
        onboarding_started_at: addOnboardingStartedAt, onboardingStartedAt: addOnboardingStartedAt,
        memo: ''
    };

    const actionBtn = document.getElementById('modal-action-btn');
    const originalActionText = actionBtn ? actionBtn.innerText : '';
    addStudentSubmitting = true;
    if (actionBtn) {
        actionBtn.disabled = true;
        actionBtn.innerText = '등록 중...';
    }

    try {
        const r = await api.post('students', payload);
        if (r?.success) {
            if (!r?.duplicate_ignored && r?.id && classId) bootstrapOnboardingTasks({
                student_id: r.id,
                class_id: classId,
                onboarding_started_at: addOnboardingStartedAt,
                already_attending: addAlreadyAttending ? 1 : 0
            }).catch(e => console.warn('[handleAddStudent] onboarding bootstrap failed:', e));
            toast(r?.duplicate_ignored ? '이미 등록 처리된 학생입니다.' : '학생이 추가되었습니다.', r?.duplicate_ignored ? 'info' : 'success');
            mergeStudentCreateResponseIntoState(r);
            if (r?.id && addOnboardingStartedAt) setStudentOnboardingStartedAtInState(r.id, addOnboardingStartedAt);
            closeModal();
            refreshCurrentStudentListViewAfterMutation(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '학생 추가에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAddStudent] failed:', e);
        toast('학생 추가 중 오류가 발생했습니다.', 'error');
    } finally {
        addStudentSubmitting = false;
        if (actionBtn) {
            actionBtn.disabled = false;
            actionBtn.innerText = originalActionText || '추가';
        }
    }
}

function openDischargedStudents() {
    const discharged = state.db.students.filter(s => isWithdrawnStudentStatus(s.status));
    const rows = discharged.map(s => `
        <div class="apms-discharged-student-row" style="padding: 14px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--surface);">
            <div><span style="font-size: 14px; font-weight:500; color: var(--text); line-height: 1.4;">${apEscapeHtml(s.name)}</span> <span style="font-size: 12px; color: var(--secondary); font-weight: 400; line-height: 1.5; margin-left: 4px;">${apEscapeHtml(s.school_name || '')}</span></div>
            <button class="btn apms-button apms-button--primary btn-primary" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:500; border-radius: 12px; box-shadow: none;" onclick="handleRestore('${s.id}')">재등원</button>
        </div>
    `).join('');
    showModal('퇴원생 관리', `<div class="apms-student-contrast apms-student-discharged-view" style="max-height: 60vh; overflow-y: auto; margin: -20px 0;">${rows || '<div class="apms-student-empty-state" style="padding: 40px; text-align: center; color: var(--secondary); font-weight:500; font-size: 13px; line-height: 1.5;">퇴원생이 없습니다.</div>'}</div>`);
}
