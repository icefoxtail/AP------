/**
 * AP Math OS 1.0 [js/management.js]
 * Split from dashboard.js.
 */

function mgmtEscape(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function getClassStudentCount(classId) {
    const activeStudentIds = new Set((state.db.students || [])
        .filter(s => isActiveStudentStatus(s.status))
        .map(s => String(s.id)));
    return (state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId) && activeStudentIds.has(String(m.student_id)))
        .length;
}

function getStudentClass(studentId) {
    const map = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return (state.db.classes || []).find(c => String(c.id) === String(map?.class_id));
}

let addressBookSearchTimer = null;

function debounceRenderAddressBookList() {
    clearTimeout(addressBookSearchTimer);
    addressBookSearchTimer = setTimeout(renderAddressBookList, 180);
}

function renderAddressBookList() {
    const search = (document.getElementById('ab-search')?.value || '').trim().toLowerCase();
    const cid = document.getElementById('ab-class')?.value || '';
    const listRoot = document.getElementById('ab-list');
    if (!listRoot) return;

    let stds = (state.db.students || []).filter(s => {
        return isActiveStudentStatus(s.status);
    });

    if (cid) {
        const ids = new Set((state.db.class_students || [])
            .filter(m => String(m.class_id) === String(cid))
            .map(m => String(m.student_id)));
        stds = stds.filter(s => ids.has(String(s.id)));
    }

    if (search) {
        stds = stds.filter(s => {
            const cls = getStudentClass(s.id);
            const text = `${s.name || ''} ${s.school_name || ''} ${s.grade || ''} ${cls?.name || ''}`.toLowerCase();
            return text.includes(search);
        });
    }

    stds.sort((a, b) => {
        const statusRank = (s) => isActiveStudentStatus(s.status) ? 0 : 1;
        return statusRank(a) - statusRank(b)
            || String(a.grade || '').localeCompare(String(b.grade || ''), 'ko')
            || String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });

    if (stds.length === 0) {
        listRoot.innerHTML = `<div class="apms-student-empty-state" style="text-align:center; padding:28px; color:var(--secondary); font-size:13px; font-weight:500;">검색 결과가 없습니다.</div>`;
        return;
    }

    listRoot.innerHTML = stds.map(s => {
        const cls = getStudentClass(s.id);
        const status = normalizeStudentStatus(s.status);
        const isActive = isActiveStudentStatus(status);
        const statusStyle = isActive
            ? 'color:var(--success); background:rgba(0,208,132,0.08); border:1px solid rgba(0,208,132,0.15);'
            : 'color:var(--secondary); background:var(--surface-2); border:1px solid var(--border);';

        return `
            <div class="apms-student-list-row" style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; gap:12px; align-items:flex-start;">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
                        <span style="font-size:14px; color:var(--text); line-height:1.4;; font-weight:500;">${mgmtEscape(s.name)}</span>
                        <span style="font-size:11px; font-weight:500; padding:3px 7px; border-radius:999px; ${statusStyle}">${mgmtEscape(status)}</span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; font-size:12px; color:var(--secondary); line-height:1.5;">
                        <div><span style="color:var(--text);; font-weight:500;">반</span> ${mgmtEscape(cls?.name || '미배정')}</div>
                        <div><span style="color:var(--text);; font-weight:500;">학교</span> ${mgmtEscape(s.school_name || '-')} ${mgmtEscape(s.grade || '')}</div>
                        <div><span style="color:var(--text);; font-weight:500;">학생</span> ${mgmtEscape(s.student_phone || '-')}</div>
                        <div><span style="color:var(--text);; font-weight:500;">보호자</span> ${mgmtEscape(s.parent_phone || '-')} ${s.guardian_relation ? `(${mgmtEscape(s.guardian_relation)})` : ''}</div>
                    </div>
                </div>
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap; max-width:190px;">
                    <button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500;" onclick="setManagementReturnView({ type: 'addressBook' }); openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'addressBook' } })">상세</button>
                    <button class="btn apms-button apms-button--quiet apms-student-primary-soft" style="padding:6px 10px; font-size:11px; font-weight:500; color:var(--primary); background:rgba(var(--primary-rgb),0.08); border:none;" onclick="openStudentDetail('${s.id}', { mode: 'edit', returnTo: { type: 'addressBook' } })">수정</button>
                    ${isActive
                        ? `<button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="handleDelete('${s.id}')">퇴원</button>`
                        : `<button class="btn apms-button apms-button--primary btn-primary" style="padding:6px 10px; font-size:11px; font-weight:500;" onclick="handleRestore('${s.id}')">복구</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    setManagementReturnView({ type: 'addressBook' });
    setModalReturnView(null);
    const selectableClasses = sortClassesForManagement(state.db.classes || []);
    const classOptions = selectableClasses
        .map(c => `<option value="${mgmtEscape(c.id)}">${mgmtEscape(apmsGetClassOptionDisplayLabel(c, selectableClasses))}${Number(c.is_active) === 0 ? ' (숨김)' : ''}</option>`)
        .join('');

    showModal('학생관리', `
        <div class="apms-student-contrast apms-student-addressbook">
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding:10px; flex:1; font-size:12px; font-weight:500;" onclick="openAddStudent('', { returnTo: { type: 'addressBook' } });">학생 추가</button>
        </div>
        <div class="apms-student-filter-grid" style="display:grid; grid-template-columns:1fr 150px; gap:8px; margin-bottom:14px;">
            <input id="ab-search" class="btn apms-student-filter-input" placeholder="이름/학교/반 검색" style="width:100%; text-align:left; background:var(--surface-2); border:none;" oninput="debounceRenderAddressBookList()">
            <select id="ab-class" class="btn apms-student-filter-select" style="width:100%; background:var(--surface-2); border:none;" onchange="renderAddressBookList()"><option value="">전체 학생</option>${classOptions}</select>
        </div>
        <div class="apms-student-list-note" style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:8px;">재원생만 표시하고, 반 선택은 보조 필터로 사용합니다.</div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px; padding-right:4px;"></div>
        </div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    setModalReturnView({ type: 'addressBook' });
    const classes = sortClassesForManagement((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const rows = classes.map(c => `
        <button class="btn apms-button apms-button--quiet" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px; border:1px solid var(--border); background:var(--surface);" onclick="if(typeof handleBatchGeneratePins==='function') handleBatchGeneratePins('${c.id}'); else toast('해당 기능은 학생관리 모듈에 있습니다.', 'warn');">
            <span style="font-weight:500; font-size:14px; color:var(--text);">${mgmtEscape(c.name)}</span>
            <span style="font-size:11px; color:var(--primary); font-weight:500; background:rgba(var(--primary-rgb),0.1); padding:4px 8px; border-radius:6px;">일괄 생성</span>
        </button>
    `).join('');

    showModal('PIN관리', `
        <div style="margin-bottom:16px; font-size:12px; color:var(--secondary); line-height:1.5; background:var(--surface-2); padding:12px; border-radius:10px;">선택한 반에 속한 학생 중, <span style="font-weight:600;">아직 PIN 번호가 없는 학생</span>들에게만 고유 PIN을 자동 부여합니다. 기존 PIN은 유지됩니다.</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${rows || `<div style="text-align:center; color:var(--secondary); padding:20px; font-size:13px;">관리할 반이 없습니다.</div>`}</div>
    `);
}

function formatClassScheduleDaysForUI(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return String(daysStr).split(',').map(d => map[parseInt(d, 10)]).filter(Boolean).join('');
}

function getClassManageGradeRank(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function sortClassesForManagement(classes) {
    return [...classes].sort((a, b) => {
        const rankDiff = getClassManageGradeRank(a) - getClassManageGradeRank(b);
        if (rankDiff !== 0) return rankDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function getTimeLabelOptions(selectedTime) {
    const periods = [
        { value: '4:50~6:20', label: '4:50~6:20 (1교시)' },
        { value: '6:30~8:00', label: '6:30~8:00 (2교시)' },
        { value: '8:00~9:30', label: '8:00~9:30 (3교시)' }
    ];

    return `<option value="">선택 안 함</option>` + periods.map(p =>
        `<option value="${mgmtEscape(p.value)}" ${String(selectedTime || '') === p.value ? 'selected' : ''}>${mgmtEscape(p.label)}</option>`
    ).join('');
}

function syncClassPeriodTime(mode) {
    const prefix = mode === 'edit' ? 'edit' : 'add';
    const period = document.getElementById(`${prefix}-cls-period`)?.value || '';
    const timeInput = document.getElementById(`${prefix}-cls-timelabel`);
    if (!timeInput || !period) return;
    timeInput.value = period;
}

function renderClassManageRow(c) {
    const isHidden = Number(c.is_active) === 0;
    const studentCount = getClassStudentCount(c.id);
    const timeLabel = c.time_label || '-';

    return `
        <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; gap:12px; align-items:flex-start; opacity:${isHidden ? '0.68' : '1'};">
            <div style="flex:1; min-width:0; cursor:pointer;" onclick="setManagementReturnView({ type: 'classManage' }); closeModal(true); state.ui.currentClassId='${c.id}'; if(typeof renderClass==='function') renderClass('${c.id}');">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
                    <span style="font-size:15px; color:var(--text); line-height:1.35;; font-weight:500;">${mgmtEscape(c.name)}</span>
                    <span style="font-size:11px; font-weight:500; color:var(--primary); background:rgba(var(--primary-rgb),0.08); padding:3px 7px; border-radius:999px;">${mgmtEscape(c.grade || '-')}</span>
                    ${isHidden ? `<span style="font-size:11px; font-weight:500; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 7px; border-radius:999px;">숨김</span>` : ''}
                </div>
                <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; font-size:12px; color:var(--secondary); line-height:1.5;">
                    <div><span style="color:var(--text);; font-weight:500;">과목</span> ${mgmtEscape(c.subject || '수학')}</div>
                    <div><span style="color:var(--text);; font-weight:500;">담당</span> ${mgmtEscape(c.teacher_name || '-')}</div>
                    <div><span style="color:var(--text);; font-weight:500;">요일</span> ${mgmtEscape(formatClassScheduleDaysForUI(c.schedule_days))}</div>
                    <div><span style="color:var(--text);; font-weight:500;">시간</span> ${mgmtEscape(timeLabel)}</div>
                    <div><span style="color:var(--text);; font-weight:500;">학생</span> ${studentCount}명</div>
                </div>
            </div>
            <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap; max-width:210px;">
                <button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${isHidden
                    ? `<button class="btn apms-button apms-button--primary btn-primary" style="padding:6px 10px; font-size:11px; font-weight:500;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                    : `<button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500; color:var(--warning); background:rgba(255,165,2,0.1); border:none;" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
                <button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="handleDeleteClass('${c.id}')">보관</button>
            </div>
        </div>
    `;
}

function openClassManageModal() {
    setManagementReturnView({ type: 'classManage' });
    setModalReturnView(null);
    const activeClasses = sortClassesForManagement((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const hiddenClasses = sortClassesForManagement((state.db.classes || []).filter(c => Number(c.is_active) === 0));

    showModal('학급관리', `
        <div style="display:flex; justify-content:flex-end; align-items:center; gap:8px; margin-bottom:16px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding:10px 14px; font-size:12px; font-weight:500;" onclick="openAddClassModal()">새 반 추가</button>
        </div>
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">활성 반 (${activeClasses.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeClasses.length ? activeClasses.map(renderClassManageRow).join('') : `<div style="font-size:12px; color:var(--secondary); padding:14px 0;">활성 반이 없습니다.</div>`}
        </div>
        ${hiddenClasses.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">숨김 반 (${hiddenClasses.length})</h4>
            <div>${hiddenClasses.map(renderClassManageRow).join('')}</div>
        ` : ''}
    `);
}

function openAddClassModal() {
    setModalReturnView({ type: 'classManage' });
    showModal('새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="add-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="add-cls-teacher" class="btn" value="${mgmtEscape(state.ui.userName || '')}" placeholder="담당 선생님" style="text-align:left; background:var(--surface-2); border:none;">
            <label style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
            </div>
            <label style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:8px;">시간</label>
            <select id="add-cls-period" class="btn" style="background:var(--surface-2); border:none;" onchange="syncClassPeriodTime('add')">
                ${getTimeLabelOptions('')}
            </select>
            <input id="add-cls-timelabel" class="btn" placeholder="직접 입력 (예: 화.목 9:30~11:30)" style="text-align:left; background:var(--surface-2); border:none;">
        </div>
    `, '추가', handleAddClass);
}

async function handleAddClass() {
    const name = document.getElementById('add-cls-name')?.value.trim() || '';
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    if (name.length > 30) { toast('반 이름은 30자 이내로 입력하세요.', 'warn'); return; }

    const grade = document.getElementById('add-cls-grade')?.value || '';
    const subject = document.getElementById('add-cls-subject')?.value.trim() || '';
    const teacher_name = document.getElementById('add-cls-teacher')?.value.trim() || state.ui.userName || '';
    const schedule_days = Array.from(document.querySelectorAll('.add-cls-days:checked')).map(e => e.value).join(',');
    const periodTime = document.getElementById('add-cls-period')?.value || '';
    const manualTime = document.getElementById('add-cls-timelabel')?.value.trim() || '';
    const time_label = periodTime || manualTime;

    const payload = { name, grade, subject, teacher_name, schedule_days, is_active: 1, time_label };

    try {
        const r = await api.post('classes', payload);
        if (r?.success) {
            toast('새 반이 추가되었습니다.', 'success');
            state.ui.currentClassId = null;
            await loadData();
            openClassManageModal();
            return;
        }
        toast(r?.message || r?.error || '반 추가에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAddClass] failed:', e);
        toast('반 추가 중 오류가 발생했습니다.', 'error');
    }
}

function openEditClassModal(cid) {
    setModalReturnView({ type: 'classManage' });
    const c = (state.db.classes || []).find(x => String(x.id) === String(cid));
    if (!c) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    const selectedDays = c.schedule_days ? String(c.schedule_days).split(',') : [];
    const currentTime = c.time_label || '';
    const periodTimes = ['4:50~6:20', '6:30~8:00', '8:00~9:30'];
    const selectedPeriod = periodTimes.includes(currentTime) ? currentTime : '';

    showModal('반 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-cls-name" class="btn" value="${mgmtEscape(c.name)}" placeholder="반 이름" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="edit-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                ${['중1','중2','중3','고1','고2','고3'].map(g => `<option value="${g}" ${c.grade===g?'selected':''}>${g}</option>`).join('')}
            </select>
            <input id="edit-cls-subject" class="btn" value="${mgmtEscape(c.subject || '')}" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="edit-cls-teacher" class="btn" value="${mgmtEscape(c.teacher_name || '')}" placeholder="담당 선생님" style="text-align:left; background:var(--surface-2); border:none;">
            <label style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
            </div>
            <label style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:8px;">시간</label>
            <select id="edit-cls-period" class="btn" style="background:var(--surface-2); border:none;" onchange="syncClassPeriodTime('edit')">
                ${getTimeLabelOptions(selectedPeriod)}
            </select>
            <input id="edit-cls-timelabel" class="btn" value="${mgmtEscape(c.time_label || '')}" placeholder="직접 입력 (예: 화.목 9:30~11:30)" style="text-align:left; background:var(--surface-2); border:none;">
            <button class="btn apms-button apms-button--quiet" style="margin-top:6px; min-height:42px; color:var(--error); background:rgba(var(--error-rgb),0.08); border:1px solid rgba(var(--error-rgb),0.16); font-weight:500;" onclick="handleDeleteClass('${c.id}')">반 보관</button>
        </div>
    `, '저장', () => handleEditClass(cid));
}

async function handleEditClass(cid) {
    const c = (state.db.classes || []).find(x => String(x.id) === String(cid));
    if (!c) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    const name = document.getElementById('edit-cls-name')?.value.trim() || '';
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    const grade = document.getElementById('edit-cls-grade')?.value || '';
    const subject = document.getElementById('edit-cls-subject')?.value.trim() || '';
    const teacher_name = document.getElementById('edit-cls-teacher')?.value.trim() || '';
    const schedule_days = Array.from(document.querySelectorAll('.edit-cls-days:checked')).map(e => e.value).join(',');
    const periodTime = document.getElementById('edit-cls-period')?.value || '';
    const manualTime = document.getElementById('edit-cls-timelabel')?.value.trim() || '';
    const time_label = periodTime || manualTime;
    const payload = { name, grade, subject, teacher_name, schedule_days, time_label };

    try {
        const r = await api.patch(`classes/${cid}`, payload);
        if (r?.success) {
            toast('반 정보가 수정되었습니다.', 'success');
            await loadData();
            openClassManageModal();
            return;
        }
        toast(r?.message || r?.error || '반 정보 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditClass] failed:', e);
        toast('반 정보 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function toggleClassActive(cid, status) {
    if (!confirm(status === 0 ? '이 반을 숨김 처리하시겠습니까?' : '이 반을 복구하시겠습니까?')) return;
    const c = (state.db.classes || []).find(x => String(x.id) === String(cid));
    if (!c) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    const payload = { name: c.name, grade: c.grade, subject: c.subject, teacher_name: c.teacher_name, schedule_days: c.schedule_days, is_active: status, time_label: c.time_label || '' };

    try {
        const r = await api.patch(`classes/${cid}`, payload);
        if (r?.success) {
            toast(status === 0 ? '숨김 처리되었습니다.' : '복구되었습니다.', 'info');
            await loadData();
            openClassManageModal();
            return;
        }
        toast(r?.message || r?.error || '반 상태 변경에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[toggleClassActive] failed:', e);
        toast('반 상태 변경 중 오류가 발생했습니다.', 'error');
    }
}

async function handleDeleteClass(classId) {
    if (!classId) return;

    const first = confirm('\uC774 \uD559\uAE09\uC744 \uBCF4\uAD00 \uCC98\uB9AC\uD560\uAE4C\uC694?');
    if (!first) return;

    const second = confirm('\uAE30\uC874 \uCD9C\uACB0, \uC131\uC801, \uC2DC\uD5D8 \uAE30\uB85D\uC740 \uC0AD\uC81C\uB418\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uBCF4\uAD00 \uCC98\uB9AC \uD6C4 \uAE30\uBCF8 \uBAA9\uB85D\uC5D0\uC11C\uB294 \uC228\uACA8\uC9D1\uB2C8\uB2E4. \uACC4\uC18D\uD560\uAE4C\uC694?');
    if (!second) return;

    try {
        const r = await api.delete('classes', classId);

        if (r?.success) {
            toast('\uD559\uAE09\uC774 \uBCF4\uAD00 \uCC98\uB9AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.', 'info');
            await loadData();
            openClassManageModal();
            return;
        }

        toast(r?.message || r?.error || '\uD559\uAE09 \uBCF4\uAD00 \uCC98\uB9AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    } catch (e) {
        console.error('[handleDeleteClass] failed:', e);
        toast('\uD559\uAE09 \uBCF4\uAD00 \uCC98\uB9AC \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    }
}

function getBillingAccountingFoundationState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.billingAccountingFoundation) {
        const today = new Date();
        state.ui.billingAccountingFoundation = {
            tab: 'collect',
            loading: false,
            error: '',
            loadedAt: '',
            branch: 'all',
            year: today.getFullYear(),
            month: today.getMonth() + 1,
            methods: [],
            policies: [],
            transactions: [],
            cashbookEntries: [],
            refunds: [],
            carryovers: [],
            dailySummaries: [],
            monthlySummaries: [],
            closings: [],
            billingTemplates: [],
            payments: [],
            paymentItems: [],
            billingAdjustments: [],
            billingRuns: [],
            accountingSummary: null,
            methodForm: { id: '', method_key: 'card', name: '', category: '', is_active: 1, sort_order: 0, memo: '' },
            policyForm: { id: '', branch: 'all', rule_type: 'tuition', rule_key: '', name: '', value_json: '{\n  "amount": 0\n}', is_active: 1, memo: '' },
            cashbookForm: { id: '', entry_date: '', entry_type: 'income', category: '', branch: 'all', amount: '', payment_transaction_id: '', student_id: '', title: '', description: '', method_key: '', status: 'active', is_active: 1 },
            refundForm: { id: '', payment_id: '', payment_transaction_id: '', student_id: '', branch: 'apmath', refund_amount: '', refund_method_key: 'card', refund_date: '', reason: '', status: 'completed' },
            carryoverForm: { id: '', student_id: '', from_payment_id: '', to_payment_id: '', branch: 'apmath', amount: '', carryover_type: 'credit', reason: '', status: 'active' }
        };
    }
    return state.ui.billingAccountingFoundation;
}

// 수납 데스크 상태 — 운영자가 내부 ID를 몰라도 학생 검색→청구 선택→수납까지 완료하는 흐름.
function getBillingCollectState() {
    const ui = getBillingAccountingFoundationState();
    if (!ui.collect) {
        ui.collect = {
            search: '',
            studentId: '',
            studentName: '',
            filter: 'open',
            loading: false,
            error: '',
            payments: [],
            items: [],
            refunds: [],
            carryovers: [],
            adjustments: [],
            selectedPaymentId: '',
            methodKey: 'card'
        };
    }
    return ui.collect;
}

const billingAccountingSaveInFlight = new Set();

function billingAccountingClientRequestId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `baf-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function withBillingAccountingSaveGuard(key, action) {
    if (billingAccountingSaveInFlight.has(key)) return;
    billingAccountingSaveInFlight.add(key);
    const btn = document.activeElement && document.activeElement.tagName === 'BUTTON' ? document.activeElement : null;
    const originalText = btn ? btn.textContent : '';
    if (btn) {
        btn.disabled = true;
        btn.textContent = '저장 중...';
    }
    try {
        return await action();
    } finally {
        billingAccountingSaveInFlight.delete(key);
        if (btn) {
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }
}

function billingAccountingResetMethodForm() {
    const ui = getBillingAccountingFoundationState();
    ui.methodForm = { id: '', method_key: 'card', name: '', category: '', is_active: 1, sort_order: 0, memo: '' };
}

function billingAccountingResetPolicyForm() {
    const ui = getBillingAccountingFoundationState();
    ui.policyForm = { id: '', branch: 'all', rule_type: 'tuition', rule_key: '', name: '', value_json: '{\n  "amount": 0\n}', is_active: 1, memo: '' };
}

function billingAccountingResetCashbookForm() {
    const ui = getBillingAccountingFoundationState();
    ui.cashbookForm = { id: '', entry_date: '', entry_type: 'income', category: '', branch: 'all', amount: '', payment_transaction_id: '', student_id: '', title: '', description: '', method_key: '', status: 'active', is_active: 1 };
}

function billingAccountingResetRefundForm() {
    const ui = getBillingAccountingFoundationState();
    ui.refundForm = { id: '', payment_id: '', payment_transaction_id: '', student_id: '', branch: 'apmath', refund_amount: '', refund_method_key: 'card', refund_date: '', reason: '', status: 'completed' };
}

function billingAccountingResetCarryoverForm() {
    const ui = getBillingAccountingFoundationState();
    ui.carryoverForm = { id: '', student_id: '', from_payment_id: '', to_payment_id: '', branch: 'apmath', amount: '', carryover_type: 'credit', reason: '', status: 'active' };
}

function billingAccountingEscape(value) {
    return mgmtEscape(value);
}

// ── 수납 데스크 순수 계산 헬퍼 (테스트 대상: tests/apmath-billing-management-ui.test.js) ──

function billingCollectRemaining(payment) {
    const total = Number(payment?.total_amount || 0);
    const paid = Number(payment?.paid_amount || 0);
    if (!Number.isFinite(total) || !Number.isFinite(paid)) return 0;
    return Math.max(Math.round(total) - Math.round(paid), 0);
}

// 미납 구분: 기한 전(upcoming) / 오늘 마감(due_today) / 연체(overdue) / 기한 없음(no_due)
function billingCollectDueBucket(payment, todayStr) {
    const status = String(payment?.status || 'unpaid');
    if (status === 'paid') return 'paid';
    const due = String(payment?.due_date || '').slice(0, 10);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return 'no_due';
    if (due < todayStr) return 'overdue';
    if (due === todayStr) return 'due_today';
    return 'upcoming';
}

function billingCollectFilterPayments(payments, filter, todayStr) {
    const open = (payments || []).filter(p =>
        ['unpaid', 'partial'].includes(String(p?.status || 'unpaid')) && billingCollectRemaining(p) > 0
    );
    if (filter === 'upcoming') return open.filter(p => billingCollectDueBucket(p, todayStr) === 'upcoming');
    if (filter === 'due_today') return open.filter(p => billingCollectDueBucket(p, todayStr) === 'due_today');
    if (filter === 'overdue') return open.filter(p => billingCollectDueBucket(p, todayStr) === 'overdue');
    if (filter === 'partial') return open.filter(p => String(p?.status) === 'partial');
    return open;
}

function billingCollectValidateAmount(amount, remaining) {
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return { ok: false, message: '수납 금액을 1원 이상 입력하세요.' };
    if (Math.round(n) !== n) return { ok: false, message: '수납 금액은 원 단위 정수로 입력하세요.' };
    if (n > remaining) {
        return { ok: false, message: `남은 금액(${Number(remaining).toLocaleString('ko-KR')}원)을 초과해 수납할 수 없습니다. 초과분은 이월로 처리하세요.` };
    }
    return { ok: true, message: '' };
}

function billingCollectTodayString() {
    const now = new Date();
    const pad = (v) => String(v).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

function billingCollectBucketLabel(bucket) {
    if (bucket === 'overdue') return { label: '연체', style: 'color:var(--error); background:rgba(var(--error-rgb),0.08);' };
    if (bucket === 'due_today') return { label: '오늘 마감', style: 'color:var(--warning); background:rgba(245,159,0,0.12);' };
    if (bucket === 'upcoming') return { label: '기한 전', style: 'color:var(--success); background:rgba(0,208,132,0.08);' };
    if (bucket === 'paid') return { label: '완납', style: 'color:var(--secondary); background:var(--surface-2);' };
    return { label: '기한 없음', style: 'color:var(--secondary); background:var(--surface-2);' };
}

function billingCollectStatusLabel(status) {
    const map = { unpaid: '미납', partial: '부분납부', paid: '완납' };
    return map[String(status || 'unpaid')] || String(status || '미납');
}

function billingCollectMethodLabel(methodKey) {
    const map = { card: '카드', cash: '현금', bank_transfer: '계좌이체', kakaopay: '카카오페이', local_voucher: '지역상품권', mixed: '복합결제', other: '기타' };
    return map[String(methodKey || '')] || String(methodKey || '기타');
}

// 청구의 지점: 항목 branch를 따르고 없으면 apmath.
function billingCollectPaymentBranch(payment, items) {
    const item = (items || []).find(i => String(i.payment_id) === String(payment?.id) && i.branch);
    return item?.branch || 'apmath';
}

function billingAccountingFormatAmount(value) {
    const amount = Number(value || 0);
    if (!Number.isFinite(amount)) return '0';
    return amount.toLocaleString('ko-KR');
}

function billingAccountingBranchOptions(selected = 'all') {
    const options = [
        { value: 'all', label: 'all' },
        { value: 'apmath', label: 'AP Math' },
        { value: 'cmath', label: '씨매쓰 초등' },
        { value: 'eie', label: 'EIE 영어학원' }
    ];
    return options.map(option => `<option value="${option.value}" ${String(selected) === option.value ? 'selected' : ''}>${billingAccountingEscape(option.label)}</option>`).join('');
}

function billingAccountingMethodKeyOptions(selected = 'card') {
    const options = ['card', 'cash', 'bank_transfer', 'kakaopay', 'local_voucher', 'mixed', 'other'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingTransactionTypeOptions(selected = 'payment') {
    const options = ['payment', 'partial_payment'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingTransactionStatusOptions(selected = 'completed') {
    const options = ['completed'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingEntryTypeOptions(selected = 'income') {
    const options = ['income', 'expense', 'refund', 'adjustment', 'transfer'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingCarryoverStatusOptions(selected = 'active') {
    const options = ['active', 'cancelled', 'inactive'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingFormatJsonForEditor(value) {
    if (value === undefined || value === null || value === '') return '{\n  "amount": 0\n}';
    try {
        return JSON.stringify(typeof value === 'string' ? JSON.parse(value) : value, null, 2);
    } catch (e) {
        return String(value);
    }
}

// ── 수납 데스크 흐름 ──

let billingCollectSearchTimer = null;

function billingCollectMatchStudents(term) {
    const search = String(term || '').trim().toLowerCase();
    if (!search) return [];
    return (state.db.students || [])
        .filter(s => isActiveStudentStatus(s.status))
        .filter(s => {
            const cls = getStudentClass(s.id);
            const text = `${s.name || ''} ${s.school_name || ''} ${s.grade || ''} ${cls?.name || ''} ${s.student_phone || ''} ${s.parent_phone || ''}`.toLowerCase();
            return text.includes(search);
        })
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'))
        .slice(0, 12);
}

function billingCollectHandleSearchInput() {
    const collect = getBillingCollectState();
    collect.search = document.getElementById('baf-collect-search')?.value || '';
    clearTimeout(billingCollectSearchTimer);
    billingCollectSearchTimer = setTimeout(() => {
        const box = document.getElementById('baf-collect-student-results');
        if (box) box.innerHTML = renderBillingCollectStudentResults(collect.search);
    }, 180);
}

function renderBillingCollectStudentResults(term) {
    const matches = billingCollectMatchStudents(term);
    if (!String(term || '').trim()) {
        return `<div style="padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:500;">학생 이름, 학교, 반, 전화번호로 검색하세요.</div>`;
    }
    if (!matches.length) {
        return `<div style="padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:500;">검색 결과가 없습니다.</div>`;
    }
    return matches.map(s => {
        const cls = getStudentClass(s.id);
        return `
            <button class="btn apms-button apms-button--quiet" style="width:100%; justify-content:space-between; gap:8px; padding:12px; margin-bottom:6px; border:1px solid var(--border); background:var(--surface); text-align:left;" onclick="billingCollectSelectStudent('${billingAccountingEscape(s.id)}')">
                <span style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(s.name || '-')}</span>
                <span style="font-size:11px; color:var(--secondary); font-weight:500;">${billingAccountingEscape(cls?.name || '반 미배정')} · ${billingAccountingEscape(s.school_name || '-')}</span>
            </button>
        `;
    }).join('');
}

async function billingCollectSelectStudent(studentId) {
    const collect = getBillingCollectState();
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    if (!student) return toast('학생 정보를 찾을 수 없습니다.', 'warn');
    collect.studentId = String(student.id);
    collect.studentName = student.name || '';
    collect.selectedPaymentId = '';
    collect.filter = 'open';
    collect.showTimeline = false;
    collect.timeline = null;
    await billingCollectRefreshStudentBills();
    renderBillingAccountingFoundationModal();
}

function billingCollectClearStudent() {
    const collect = getBillingCollectState();
    collect.studentId = '';
    collect.studentName = '';
    collect.search = '';
    collect.selectedPaymentId = '';
    collect.payments = [];
    collect.items = [];
    collect.refunds = [];
    collect.carryovers = [];
    renderBillingAccountingFoundationModal();
}

function billingCollectSetFilter(filter) {
    const collect = getBillingCollectState();
    collect.filter = filter;
    renderBillingAccountingFoundationModal();
}

function billingCollectSelectPayment(paymentId) {
    const collect = getBillingCollectState();
    collect.selectedPaymentId = String(paymentId);
    renderBillingAccountingFoundationModal();
}

// 저장 후 "전체 다시 읽기" 대신 해당 학생의 청구와 요약만 확실히 갱신한다.
async function billingCollectRefreshStudentBills() {
    const collect = getBillingCollectState();
    if (!collect.studentId) return;
    collect.loading = true;
    collect.error = '';
    try {
        const sid = encodeURIComponent(collect.studentId);
        const [payments, items, refunds, carryovers] = await Promise.all([
            api.get(`billing-accounting-foundation/payments?student_id=${sid}&limit=100`),
            api.get(`billing-accounting-foundation/payment-items?student_id=${sid}&limit=200`),
            api.get(`billing-accounting-foundation/refund-records?student_id=${sid}&limit=100`),
            api.get(`billing-accounting-foundation/carryover-records?student_id=${sid}&limit=100`)
        ]);
        collect.payments = Array.isArray(payments?.payments) ? payments.payments : [];
        collect.items = Array.isArray(items?.payment_items) ? items.payment_items : [];
        collect.refunds = Array.isArray(refunds?.refunds) ? refunds.refunds : [];
        collect.carryovers = Array.isArray(carryovers?.carryovers) ? carryovers.carryovers : [];
        const adjustments = await api.get(`billing-accounting-foundation/billing-adjustments?student_id=${sid}&limit=200`);
        collect.adjustments = Array.isArray(adjustments?.billing_adjustments) ? adjustments.billing_adjustments : [];
    } catch (e) {
        collect.error = '청구 정보를 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.';
    } finally {
        collect.loading = false;
    }
}

async function billingCollectRefreshSummary() {
    const ui = getBillingAccountingFoundationState();
    const params = new URLSearchParams({ year: String(ui.year), month: String(ui.month) });
    if (ui.branch && ui.branch !== 'all') params.set('branch', ui.branch);
    try {
        const [summary, transactions] = await Promise.all([
            api.get(`billing-accounting-foundation/accounting-summary?${params.toString()}`),
            api.get('billing-accounting-foundation/payment-transactions?limit=20')
        ]);
        if (summary?.success) ui.accountingSummary = summary;
        if (Array.isArray(transactions?.transactions)) ui.transactions = transactions.transactions;
    } catch (e) {
        // 요약 갱신 실패는 수납 저장 자체를 되돌리지 않는다. 다음 조회에서 복구.
    }
}

async function saveBillingCollectTransaction() {
    const collect = getBillingCollectState();
    if (!collect.studentId) return toast('학생을 먼저 검색해 선택하세요.', 'warn');
    const payment = (collect.payments || []).find(p => String(p.id) === String(collect.selectedPaymentId));
    if (!payment) return toast('수납할 청구를 선택하세요.', 'warn');
    const remaining = billingCollectRemaining(payment);
    const amount = Number(document.getElementById('baf-collect-amount')?.value || 0);
    const check = billingCollectValidateAmount(amount, remaining);
    if (!check.ok) return toast(check.message, 'warn');
    const methodKey = document.getElementById('baf-collect-method')?.value || collect.methodKey || 'card';
    const transactionDate = (document.getElementById('baf-collect-date')?.value || '').trim() || billingCollectTodayString();
    const note = (document.getElementById('baf-collect-note')?.value || '').trim();
    collect.methodKey = methodKey;

    // 학생·청구·지점은 선택된 청구에서만 채운다(임의 불일치 입력 차단).
    const payload = {
        payment_id: payment.id,
        student_id: collect.studentId,
        branch: billingCollectPaymentBranch(payment, collect.items),
        transaction_type: amount < remaining ? 'partial_payment' : 'payment',
        method_key: methodKey,
        amount,
        transaction_date: transactionDate,
        status: 'completed',
        note
    };

    // 이중 클릭 방지: 같은 청구에 대한 저장은 동시에 1건만.
    return withBillingAccountingSaveGuard(`collect:${payment.id}`, async () => {
        const result = await api.post('billing-accounting-foundation/payment-transactions', { ...payload, clientRequestId: billingAccountingClientRequestId() });
        if (result?.success) {
            toast('수납이 저장되었습니다.', 'success');
            collect.selectedPaymentId = '';
            await billingCollectRefreshStudentBills();
            await billingCollectRefreshSummary();
            renderBillingAccountingFoundationModal();
            return;
        }
        if (result?.code === 'PAYMENT_OVER_ALLOCATED' || result?.code === 'PAYMENT_CONCURRENT_CONFLICT') {
            toast(result?.error || '청구 잔액이 변경되었습니다. 다시 확인해 주세요.', 'warn');
            await billingCollectRefreshStudentBills();
            renderBillingAccountingFoundationModal();
            return;
        }
        toast(result?.error || result?.message || '수납 저장에 실패했습니다.', 'warn');
    });
}

// 학생 360 수납 타임라인 (읽기 전용)
async function billingCollectToggleTimeline() {
    const collect = getBillingCollectState();
    if (!collect.studentId) return toast('학생을 먼저 선택하세요.', 'warn');
    if (collect.showTimeline) {
        collect.showTimeline = false;
        renderBillingAccountingFoundationModal();
        return;
    }
    const result = await api.get(`billing-accounting-foundation/student-timeline?student_id=${encodeURIComponent(collect.studentId)}`);
    if (!result?.success) return toast(result?.error || '타임라인을 불러오지 못했습니다.', 'warn');
    collect.timeline = result;
    collect.showTimeline = true;
    renderBillingAccountingFoundationModal();
}

function renderBillingCollectTimeline(collect) {
    const timeline = collect.timeline || {};
    const events = Array.isArray(timeline.events) ? timeline.events : [];
    const typeColor = (type, status) => {
        if (status === 'cancelled') return 'var(--secondary)';
        if (type === 'refund' || type === 'carryover_out') return 'var(--error)';
        if (type === 'billing') return 'var(--primary)';
        return 'var(--success)';
    };
    const rows = events.map(e => `
        <div style="display:flex; justify-content:space-between; gap:10px; padding:8px 0; border-bottom:1px solid var(--border); font-size:12px; line-height:1.5;">
            <span style="color:var(--secondary); font-weight:500; white-space:nowrap;">${billingAccountingEscape(e.date || '-')}</span>
            <span style="flex:1; color:var(--text); font-weight:500;">${billingAccountingEscape(e.label || '-')}</span>
            <span style="font-weight:600; white-space:nowrap; color:${typeColor(e.type, e.status)};">${billingAccountingFormatAmount(e.amount)}원</span>
        </div>
    `).join('');
    return `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:8px;">
                <div style="font-size:13px; font-weight:600; color:var(--text);">수납 타임라인 (읽기 전용)</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500;">미납 ${billingAccountingEscape(timeline.outstanding?.count ?? 0)}건 · ${billingAccountingFormatAmount(timeline.outstanding?.total)}원</div>
            </div>
            <div style="max-height:280px; overflow-y:auto;">${rows || `<div style="padding:12px; text-align:center; color:var(--secondary); font-size:12px;">기록이 없습니다.</div>`}</div>
        </div>
    `;
}

// 데스크 조정 입력: 할인은 음수, 추가 청구는 양수. 서버가 부호·사유·음수 청구를 재검증한다.
async function billingCollectAddAdjustment(paymentId) {
    const collect = getBillingCollectState();
    const payment = (collect.payments || []).find(p => String(p.id) === String(paymentId));
    if (!payment) return toast('청구를 찾을 수 없습니다.', 'warn');
    const raw = window.prompt('조정 금액을 입력하세요. 할인은 음수(예: -30000), 추가 청구는 양수(예: 20000).', '');
    if (raw === null) return;
    const amount = Math.round(Number(String(raw).replace(/,/g, '')));
    if (!Number.isFinite(amount) || amount === 0) return toast('조정 금액은 0이 아닌 정수여야 합니다.', 'warn');
    const reason = (window.prompt('조정 사유를 입력하세요.') || '').trim();
    if (!reason) return toast('조정 사유가 필요합니다.', 'warn');
    const payload = {
        payment_id: payment.id,
        adjustment_type: amount < 0 ? 'discount' : 'charge',
        name: amount < 0 ? '할인' : '추가 청구',
        amount,
        reason
    };
    return withBillingAccountingSaveGuard(`adjust:${payment.id}`, async () => {
        const result = await api.post('billing-accounting-foundation/billing-adjustments', { ...payload, clientRequestId: billingAccountingClientRequestId() });
        if (result?.success) {
            toast('조정이 반영되었습니다.', 'success');
            await billingCollectRefreshStudentBills();
            await billingCollectRefreshSummary();
            renderBillingAccountingFoundationModal();
            return;
        }
        toast(result?.error || result?.message || '조정 저장에 실패했습니다.', 'warn');
    });
}

async function billingCollectCancelAdjustment(adjustmentId) {
    const reason = (window.prompt('조정 취소 사유를 입력하세요.') || '').trim();
    if (!reason) return toast('취소 사유가 필요합니다.', 'warn');
    const result = await api.patch(`billing-accounting-foundation/billing-adjustments/${encodeURIComponent(adjustmentId)}/cancel`, { reason });
    if (result?.success) {
        toast('조정이 취소되었습니다.', 'success');
        await billingCollectRefreshStudentBills();
        await billingCollectRefreshSummary();
        renderBillingAccountingFoundationModal();
        return;
    }
    toast(result?.error || result?.message || '조정 취소에 실패했습니다.', 'warn');
}

// ── 내부 납부확인서 (LOOP 6) ──
// D-10(사업자 정보·공식성) 미결정: 공식 증명서가 아닌 내부 확인용 문서만 출력한다.

// A4 인쇄용 HTML (순수 함수 — 테스트 대상). 빈 필드는 '-'로 표기하고 넘침은 word-break로 방지.
function billingDocumentPrintHtml(doc) {
    let snapshot = {};
    try {
        snapshot = typeof doc.snapshot_json === 'string' ? JSON.parse(doc.snapshot_json) : (doc.snapshot_json || {});
    } catch (e) {
        snapshot = {};
    }
    const esc = billingAccountingEscape;
    const won = (v) => `${billingAccountingFormatAmount(v)}원`;
    const text = (v) => esc(String(v ?? '').trim() || '-');
    const rows = (list, render) => (Array.isArray(list) && list.length)
        ? list.map(render).join('')
        : `<tr><td colspan="3" style="text-align:center; color:#888;">-</td></tr>`;
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>납부확인서 ${esc(doc.document_no || '')}</title>
<style>
  @page { size: A4; margin: 18mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif; color: #222; font-size: 12px; line-height: 1.6; margin: 0; }
  .doc { max-width: 174mm; margin: 0 auto; word-break: break-all; }
  h1 { font-size: 20px; text-align: center; letter-spacing: 8px; margin: 0 0 4px; }
  .internal-badge { text-align: center; font-size: 11px; color: #b00; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; table-layout: fixed; }
  th, td { border: 1px solid #999; padding: 6px 8px; font-size: 11px; word-break: break-all; }
  th { background: #f2f2f2; font-weight: 600; text-align: left; }
  .amount { text-align: right; white-space: nowrap; }
  .section-title { font-size: 12px; font-weight: 700; margin: 14px 0 6px; }
  .totals td { font-weight: 700; background: #fafafa; }
  .footer { margin-top: 18px; font-size: 10px; color: #777; border-top: 1px solid #ccc; padding-top: 8px; }
</style>
</head>
<body>
<div class="doc">
  <h1>납부확인서</h1>
  <div class="internal-badge">※ 내부 확인용 문서 — 공식 증명서(교육비 납입증명 등)가 아닙니다 ※</div>
  <table>
    <tr><th style="width:22%;">문서 번호</th><td style="width:38%;">${text(doc.document_no)}</td><th style="width:18%;">발급일</th><td>${text(String(doc.issued_at || '').slice(0, 10))}</td></tr>
    <tr><th>학생</th><td>${text(snapshot.student_name)}</td><th>청구 연월</th><td>${snapshot.billing_year ? `${esc(snapshot.billing_year)}년 ${esc(snapshot.billing_month)}월` : '-'}</td></tr>
    <tr><th>납부기한</th><td>${text(snapshot.due_date)}</td><th>상태</th><td>${text(billingCollectStatusLabel(snapshot.payment_status))}</td></tr>
  </table>
  <div class="section-title">청구 항목</div>
  <table>
    <tr><th>항목</th><th style="width:20%;">구분</th><th style="width:24%;" class="amount">금액</th></tr>
    ${rows(snapshot.items, (i) => `<tr><td>${text(i.name)}</td><td>${text(i.item_type)}</td><td class="amount">${won(i.amount)}</td></tr>`)}
    ${(snapshot.adjustments || []).map((a) => `<tr><td>${text(a.name)} (조정)</td><td>${text(a.adjustment_type)}</td><td class="amount">${won(a.amount)}</td></tr>`).join('')}
  </table>
  <div class="section-title">수납 내역 (완료)</div>
  <table>
    <tr><th style="width:24%;">일자</th><th>구분/수단</th><th style="width:24%;" class="amount">금액</th></tr>
    ${rows(snapshot.transactions, (t) => `<tr><td>${text(t.date)}</td><td>${text(billingCollectMethodLabel(t.method))}</td><td class="amount">${won(t.amount)}</td></tr>`)}
  </table>
  ${(snapshot.refunds || []).length ? `
  <div class="section-title">환불 내역 (완료)</div>
  <table>
    <tr><th style="width:24%;">일자</th><th>사유</th><th style="width:24%;" class="amount">금액</th></tr>
    ${snapshot.refunds.map((r) => `<tr><td>${text(r.date)}</td><td>${text(r.reason)}</td><td class="amount">${won(r.amount)}</td></tr>`).join('')}
  </table>` : ''}
  <table class="totals">
    <tr><td style="width:40%;">청구액</td><td class="amount">${won(snapshot.billed_amount)}</td></tr>
    <tr><td>확인 납부액 (환불·이월 반영)</td><td class="amount">${won(snapshot.effective_paid)}</td></tr>
    <tr><td>남은 금액</td><td class="amount">${won(snapshot.outstanding_amount)}</td></tr>
  </table>
  <div class="footer">
    발급자: ${text(snapshot.issued_by)} · 이 문서는 발급 시점(${text(String(snapshot.issued_at || '').slice(0, 16).replace('T', ' '))})의 수납 원장을 기준으로 하며, 이후 변동은 반영되지 않습니다.
    취소·환불 시 이 문서는 재발급 문서로 대체됩니다. 문서 번호로 진위를 확인할 수 있습니다.
  </div>
</div>
</body>
</html>`;
}

function billingDocumentOpenPrint(doc) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return toast('팝업이 차단되어 인쇄 창을 열 수 없습니다.', 'warn');
    printWindow.document.write(billingDocumentPrintHtml(doc));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

async function billingCollectIssueDocument(paymentId) {
    const collect = getBillingCollectState();
    if (!collect.studentId) return toast('학생을 먼저 선택하세요.', 'warn');
    return withBillingAccountingSaveGuard(`document:${paymentId}`, async () => {
        const result = await api.post('billing-accounting-foundation/documents', {
            payment_id: paymentId,
            student_id: collect.studentId,
            clientRequestId: billingAccountingClientRequestId()
        });
        if (result?.success) {
            toast(`납부확인서가 발급되었습니다. (${result.document?.document_no || ''})`, 'success');
            billingDocumentOpenPrint(result.document);
            return;
        }
        toast(result?.error || result?.message || '납부확인서 발급에 실패했습니다.', 'warn');
    });
}

function renderBillingCollectPaymentCard(payment, collect, todayStr) {
    const remaining = billingCollectRemaining(payment);
    const bucket = billingCollectDueBucket(payment, todayStr);
    const bucketBadge = billingCollectBucketLabel(bucket);
    const itemNames = (collect.items || [])
        .filter(i => String(i.payment_id) === String(payment.id))
        .map(i => i.name)
        .filter(Boolean);
    const refunded = (collect.refunds || [])
        .filter(r => String(r.payment_id) === String(payment.id) && String(r.status || '') === 'completed')
        .reduce((sum, r) => sum + Number(r.refund_amount || 0), 0);
    const carriedIn = (collect.carryovers || [])
        .filter(c => String(c.to_payment_id) === String(payment.id) && String(c.status || 'active') === 'active')
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const carriedOut = (collect.carryovers || [])
        .filter(c => String(c.from_payment_id) === String(payment.id) && String(c.status || 'active') === 'active')
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);
    const activeAdjustments = (collect.adjustments || [])
        .filter(a => String(a.payment_id) === String(payment.id) && String(a.status || 'active') === 'active');
    const isSelected = String(collect.selectedPaymentId) === String(payment.id);

    return `
        <div style="padding:12px; border:1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}; border-radius:14px; background:var(--surface); margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:8px;">
                <div style="font-size:13px; font-weight:600; color:var(--text);">${billingAccountingEscape(payment.year)}년 ${billingAccountingEscape(payment.month)}월 청구</div>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <span style="font-size:11px; font-weight:500; padding:3px 8px; border-radius:999px; ${bucketBadge.style}">${bucketBadge.label}</span>
                    <span style="font-size:11px; font-weight:500; padding:3px 8px; border-radius:999px; color:var(--secondary); background:var(--surface-2);">${billingCollectStatusLabel(payment.status)}</span>
                </div>
            </div>
            <div style="font-size:12px; color:var(--secondary); margin-bottom:8px; line-height:1.5;">${billingAccountingEscape(itemNames.join(', ') || '청구 항목')}</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:6px; font-size:12px; line-height:1.5; margin-bottom:10px;">
                <div><span style="color:var(--secondary); font-weight:500;">청구액</span><br><span style="color:var(--text); font-weight:600;">${billingAccountingFormatAmount(payment.total_amount)}원</span></div>
                <div><span style="color:var(--secondary); font-weight:500;">수납액</span><br><span style="color:var(--text); font-weight:600;">${billingAccountingFormatAmount(payment.paid_amount)}원</span></div>
                <div><span style="color:var(--secondary); font-weight:500;">환불/이월</span><br><span style="color:var(--text); font-weight:600;">${billingAccountingFormatAmount(refunded + carriedOut)}원${carriedIn ? ` (+이월입금 ${billingAccountingFormatAmount(carriedIn)}원)` : ''}</span></div>
                <div><span style="color:var(--secondary); font-weight:500;">남은 금액</span><br><span style="color:${remaining > 0 ? 'var(--error)' : 'var(--success)'}; font-weight:600;">${billingAccountingFormatAmount(remaining)}원</span></div>
                <div><span style="color:var(--secondary); font-weight:500;">납부기한</span><br><span style="color:var(--text); font-weight:600;">${billingAccountingEscape(payment.due_date || '-')}</span></div>
            </div>
            ${activeAdjustments.length ? `
            <div style="margin-bottom:10px; padding:8px 10px; border-radius:10px; background:var(--surface-2);">
                ${activeAdjustments.map(adj => `
                    <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; font-size:12px; line-height:1.6;">
                        <span style="color:var(--secondary); font-weight:500;">${billingAccountingEscape(adj.name || '조정')} ${Number(adj.amount) < 0 ? '' : '+'}${billingAccountingFormatAmount(adj.amount)}원</span>
                        <button class="btn apms-button apms-button--quiet" style="padding:3px 8px; font-size:11px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="billingCollectCancelAdjustment('${billingAccountingEscape(adj.id)}')">취소</button>
                    </div>
                `).join('')}
            </div>` : ''}
            <div style="display:flex; gap:8px;">
                ${remaining > 0
                    ? `<button class="btn apms-button ${isSelected ? 'apms-button--primary btn-primary' : 'apms-button--quiet'}" style="flex:2; min-height:40px; font-size:12px; font-weight:500; ${isSelected ? '' : 'color:var(--primary); background:rgba(var(--primary-rgb),0.08); border:none;'}" onclick="billingCollectSelectPayment('${billingAccountingEscape(payment.id)}')">${isSelected ? '이 청구에 수납 입력 중' : '이 청구에 수납'}</button>`
                    : ''}
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:40px; font-size:12px; font-weight:500;" onclick="billingCollectAddAdjustment('${billingAccountingEscape(payment.id)}')">할인/추가 조정</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:40px; font-size:12px; font-weight:500;" onclick="billingCollectIssueDocument('${billingAccountingEscape(payment.id)}')">납부확인서</button>
            </div>
        </div>
    `;
}

function renderBillingCollectTab(ui) {
    const collect = getBillingCollectState();
    const todayStr = billingCollectTodayString();

    if (!collect.studentId) {
        return `
            <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5; margin-bottom:10px;">학생을 검색해 선택하면 미납 청구가 표시됩니다. 학생 번호나 청구 번호를 입력할 필요가 없습니다.</div>
            <input id="baf-collect-search" class="btn" value="${billingAccountingEscape(collect.search)}" placeholder="학생 이름/학교/반/전화번호 검색" style="width:100%; text-align:left; background:var(--surface-2); border:none; min-height:44px; margin-bottom:10px;" oninput="billingCollectHandleSearchInput()">
            <div id="baf-collect-student-results">${renderBillingCollectStudentResults(collect.search)}</div>
        `;
    }

    const openPayments = billingCollectFilterPayments(collect.payments, collect.filter, todayStr);
    const paidPayments = (collect.payments || []).filter(p => String(p.status) === 'paid');
    const filters = [
        { key: 'open', label: '전체 미납' },
        { key: 'upcoming', label: '기한 전' },
        { key: 'due_today', label: '오늘 마감' },
        { key: 'overdue', label: '연체' },
        { key: 'partial', label: '부분납부' }
    ];
    const filterChips = filters.map(f => `
        <button class="btn apms-button apms-button--quiet" style="padding:8px 12px; border-radius:999px; border:none; font-size:12px; font-weight:500; background:${collect.filter === f.key ? 'var(--primary)' : 'var(--surface-2)'}; color:${collect.filter === f.key ? '#fff' : 'var(--secondary)'};" onclick="billingCollectSetFilter('${f.key}')">${f.label}</button>
    `).join('');

    const selectedPayment = (collect.payments || []).find(p => String(p.id) === String(collect.selectedPaymentId));
    const selectedRemaining = selectedPayment ? billingCollectRemaining(selectedPayment) : 0;
    const collectForm = selectedPayment ? `
        <div style="padding:12px; border:1.5px solid var(--primary); border-radius:14px; background:var(--surface); margin-top:10px;">
            <div style="font-size:13px; font-weight:600; color:var(--text); margin-bottom:4px;">수납 입력 — ${billingAccountingEscape(collect.studentName)} · ${billingAccountingEscape(selectedPayment.year)}년 ${billingAccountingEscape(selectedPayment.month)}월</div>
            <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:10px;">남은 금액 ${billingAccountingFormatAmount(selectedRemaining)}원 이내로만 수납됩니다. 학생과 청구는 자동으로 연결됩니다.</div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:8px; margin-bottom:8px;">
                <input id="baf-collect-amount" class="btn" type="number" value="${billingAccountingEscape(selectedRemaining)}" min="1" max="${billingAccountingEscape(selectedRemaining)}" placeholder="수납 금액(원)" style="text-align:left; background:var(--surface-2); border:none; min-height:44px;">
                <select id="baf-collect-method" class="btn" style="background:var(--surface-2); border:none; min-height:44px;">
                    ${['card', 'cash', 'bank_transfer', 'kakaopay', 'local_voucher', 'mixed', 'other'].map(k => `<option value="${k}" ${collect.methodKey === k ? 'selected' : ''}>${billingCollectMethodLabel(k)}</option>`).join('')}
                </select>
                <input id="baf-collect-date" class="btn" type="date" value="${billingAccountingEscape(todayStr)}" style="text-align:left; background:var(--surface-2); border:none; min-height:44px;">
            </div>
            <input id="baf-collect-note" class="btn" placeholder="메모 (선택)" style="width:100%; text-align:left; background:var(--surface-2); border:none; min-height:44px;">
        </div>
    ` : '';

    return `
        <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:10px;">
            <div style="font-size:14px; font-weight:600; color:var(--text);">${billingAccountingEscape(collect.studentName)} 님의 청구</div>
            <div style="display:flex; gap:6px;">
                <button class="btn apms-button apms-button--quiet" style="padding:8px 12px; font-size:12px; font-weight:500;" onclick="billingCollectToggleTimeline()">${collect.showTimeline ? '타임라인 닫기' : '타임라인'}</button>
                <button class="btn apms-button apms-button--quiet" style="padding:8px 12px; font-size:12px; font-weight:500;" onclick="billingCollectClearStudent()">다른 학생 검색</button>
            </div>
        </div>
        ${collect.showTimeline ? renderBillingCollectTimeline(collect) : ''}
        ${collect.error ? `<div style="margin-bottom:10px; padding:10px 12px; border-radius:12px; background:rgba(var(--error-rgb),0.08); color:var(--error); font-size:12px; font-weight:500;">${billingAccountingEscape(collect.error)}</div>` : ''}
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px;">${filterChips}</div>
        ${collect.loading
            ? `<div style="padding:24px 12px; text-align:center; color:var(--secondary); font-size:12px; font-weight:500;">청구 정보를 불러오는 중...</div>`
            : (openPayments.length
                ? openPayments.map(p => renderBillingCollectPaymentCard(p, collect, todayStr)).join('')
                : renderBillingAccountingEmpty('이 조건의 미납 청구가 없습니다.'))}
        ${!collect.loading && paidPayments.length ? `<div style="font-size:11px; color:var(--secondary); font-weight:500; margin:4px 0 8px;">완납된 청구 ${paidPayments.length}건은 목록에서 제외했습니다.</div>` : ''}
        ${collectForm}
        ${selectedPayment ? `
        <div class="apms-collect-save" style="position:sticky; bottom:0; background:var(--surface); padding:10px 0 2px; display:flex; gap:8px; z-index:2;">
            <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:46px; font-size:13px; font-weight:600;" onclick="saveBillingCollectTransaction()">수납 저장</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:46px; font-size:13px; font-weight:500;" onclick="billingCollectSelectPayment('')">선택 해제</button>
        </div>` : ''}
    `;
}

async function billingAccountingFetchAll() {
    const ui = getBillingAccountingFoundationState();
    ui.loading = true;
    ui.error = '';
    renderBillingAccountingFoundationModal();

    const summaryParams = new URLSearchParams({
        year: String(ui.year),
        month: String(ui.month),
        limit: '20'
    });
    if (ui.branch && ui.branch !== 'all') summaryParams.set('branch', ui.branch);
    try {
        const requests = [
            ['billingTemplates', api.get('billing-accounting-foundation/billing-templates?limit=100')],
            ['payments', api.get('billing-accounting-foundation/payments?limit=50')],
            ['paymentItems', api.get('billing-accounting-foundation/payment-items?limit=100')],
            ['billingAdjustments', api.get('billing-accounting-foundation/billing-adjustments?limit=50')],
            ['billingRuns', api.get('billing-accounting-foundation/billing-runs?limit=50')],
            ['methods', api.get('billing-accounting-foundation/payment-methods?limit=100')],
            ['policies', api.get('billing-accounting-foundation/billing-policy-rules?limit=100')],
            ['transactions', api.get('billing-accounting-foundation/payment-transactions?limit=20')],
            ['cashbook', api.get('billing-accounting-foundation/cashbook-entries?limit=20')],
            ['refunds', api.get('billing-accounting-foundation/refund-records?limit=20')],
            ['carryovers', api.get('billing-accounting-foundation/carryover-records?limit=20')],
            ['closings', api.get('billing-accounting-foundation/closings?limit=50')],
            ['daily', api.get(`billing-accounting-foundation/daily-summaries?${summaryParams.toString()}`)],
            ['monthly', api.get(`billing-accounting-foundation/monthly-summaries?${summaryParams.toString()}`)],
            ['summary', api.get(`billing-accounting-foundation/accounting-summary?${summaryParams.toString()}`)]
        ];
        const results = await Promise.allSettled(requests.map(item => item[1]));
        const resolved = {};
        let failedCount = 0;
        const isOkResponse = response => response && !response.error && response.success !== false;

        results.forEach((result, index) => {
            const key = requests[index][0];
            if (result.status === 'fulfilled' && isOkResponse(result.value)) {
                resolved[key] = result.value;
            } else {
                failedCount += 1;
                resolved[key] = null;
            }
        });

        if (resolved.methods) ui.methods = Array.isArray(resolved.methods.payment_methods) ? resolved.methods.payment_methods : [];
        if (resolved.policies) ui.policies = Array.isArray(resolved.policies.policy_rules) ? resolved.policies.policy_rules : [];
        if (resolved.transactions) ui.transactions = Array.isArray(resolved.transactions.transactions) ? resolved.transactions.transactions : [];
        if (resolved.cashbook) ui.cashbookEntries = Array.isArray(resolved.cashbook.cashbook_entries) ? resolved.cashbook.cashbook_entries : [];
        if (resolved.refunds) ui.refunds = Array.isArray(resolved.refunds.refunds) ? resolved.refunds.refunds : [];
        if (resolved.carryovers) ui.carryovers = Array.isArray(resolved.carryovers.carryovers) ? resolved.carryovers.carryovers : [];
        if (resolved.closings) ui.closings = Array.isArray(resolved.closings.closings) ? resolved.closings.closings : [];
        if (resolved.daily) ui.dailySummaries = Array.isArray(resolved.daily.daily_summaries) ? resolved.daily.daily_summaries : [];
        if (resolved.monthly) ui.monthlySummaries = Array.isArray(resolved.monthly.monthly_summaries) ? resolved.monthly.monthly_summaries : [];
        if (resolved.billingTemplates) ui.billingTemplates = Array.isArray(resolved.billingTemplates.billing_templates) ? resolved.billingTemplates.billing_templates : [];
        if (resolved.payments) ui.payments = Array.isArray(resolved.payments.payments) ? resolved.payments.payments : [];
        if (resolved.paymentItems) ui.paymentItems = Array.isArray(resolved.paymentItems.payment_items) ? resolved.paymentItems.payment_items : [];
        if (resolved.billingAdjustments) ui.billingAdjustments = Array.isArray(resolved.billingAdjustments.billing_adjustments) ? resolved.billingAdjustments.billing_adjustments : [];
        if (resolved.billingRuns) ui.billingRuns = Array.isArray(resolved.billingRuns.billing_runs) ? resolved.billingRuns.billing_runs : [];
        if (resolved.summary) ui.accountingSummary = resolved.summary?.success ? resolved.summary : null;
        if (Object.values(resolved).some(Boolean)) ui.loadedAt = new Date().toISOString();
        if (failedCount > 0) {
            ui.error = '일부 수납·출납 foundation 자료를 불러오지 못했습니다.';
        }
    } catch (e) {
        ui.error = '수납·출납 foundation 조회 중 오류가 발생했습니다.';
    } finally {
        ui.loading = false;
        renderBillingAccountingFoundationModal();
    }
}

function setBillingAccountingFoundationTab(tab) {
    const ui = getBillingAccountingFoundationState();
    ui.tab = tab;
    renderBillingAccountingFoundationModal();
}

function editBillingAccountingMethod(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.methods || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.methodForm = {
        id: item.id || '',
        method_key: item.method_key || 'card',
        name: item.name || '',
        category: item.category || '',
        is_active: Number(item.is_active) === 0 ? 0 : 1,
        sort_order: Number(item.sort_order || 0),
        memo: item.memo || ''
    };
    ui.tab = 'methods';
    renderBillingAccountingFoundationModal();
}

function editBillingAccountingPolicy(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.policies || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.policyForm = {
        id: item.id || '',
        branch: item.branch || 'all',
        rule_type: item.rule_type || 'tuition',
        rule_key: item.rule_key || '',
        name: item.name || '',
        value_json: billingAccountingFormatJsonForEditor(item.value_json),
        is_active: Number(item.is_active) === 0 ? 0 : 1,
        memo: item.memo || ''
    };
    ui.tab = 'policies';
    renderBillingAccountingFoundationModal();
}

// 완료 수납은 메모(receipt_no/note 계열)만 수정 가능 — 금액·일자·대상 수정은 서버가 거부한다.
async function editBillingAccountingTransactionNote(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.transactions || []).find(row => String(row.id) === String(id));
    if (!item) return;
    const note = window.prompt('메모를 입력하세요. (완료된 수납의 금액·일자·대상은 수정할 수 없습니다)', item.note || '');
    if (note === null) return;
    const result = await api.patch(`billing-accounting-foundation/payment-transactions/${encodeURIComponent(id)}`, { note: note.trim() });
    if (result?.success) {
        toast('메모가 저장되었습니다.', 'success');
        await billingCollectRefreshSummary();
        renderBillingAccountingFoundationModal();
        return;
    }
    toast(result?.error || result?.message || '메모 저장에 실패했습니다.', 'warn');
}

function editBillingAccountingCashbook(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.cashbookEntries || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.cashbookForm = {
        id: item.id || '',
        entry_date: item.entry_date || '',
        entry_type: item.entry_type || 'income',
        category: item.category || '',
        branch: item.branch || 'all',
        amount: item.amount ?? '',
        payment_transaction_id: item.payment_transaction_id || '',
        student_id: item.student_id || '',
        title: item.title || '',
        description: item.description || '',
        method_key: item.method_key || '',
        status: item.status || 'active',
        is_active: Number(item.is_active) === 0 ? 0 : 1
    };
    ui.tab = 'cashbook';
    renderBillingAccountingFoundationModal();
}

function editBillingAccountingRefund(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.refunds || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.refundForm = {
        id: item.id || '',
        payment_id: item.payment_id || '',
        payment_transaction_id: item.payment_transaction_id || '',
        student_id: item.student_id || '',
        branch: item.branch || 'apmath',
        refund_amount: item.refund_amount ?? '',
        refund_method_key: item.refund_method_key || 'card',
        refund_date: item.refund_date || '',
        reason: item.reason || '',
        status: item.status || 'completed'
    };
    ui.tab = 'refunds';
    renderBillingAccountingFoundationModal();
}

function editBillingAccountingCarryover(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.carryovers || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.carryoverForm = {
        id: item.id || '',
        student_id: item.student_id || '',
        from_payment_id: item.from_payment_id || '',
        to_payment_id: item.to_payment_id || '',
        branch: item.branch || 'apmath',
        amount: item.amount ?? '',
        carryover_type: item.carryover_type || 'credit',
        reason: item.reason || '',
        status: item.status || 'active'
    };
    ui.tab = 'carryovers';
    renderBillingAccountingFoundationModal();
}

async function toggleBillingAccountingMethodActive(id, nextActive) {
    const result = await api.patch(`billing-accounting-foundation/payment-methods/${encodeURIComponent(id)}`, { is_active: nextActive });
    if (result?.success) {
        toast(nextActive ? '저장되었습니다.' : '비활성화되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
}

async function toggleBillingAccountingPolicyActive(id, nextActive) {
    const result = await api.patch(`billing-accounting-foundation/billing-policy-rules/${encodeURIComponent(id)}`, { is_active: nextActive });
    if (result?.success) {
        toast(nextActive ? '저장되었습니다.' : '비활성화되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingTransaction(id) {
    const reason = (window.prompt('수납 취소 사유를 입력하세요.') || '').trim();
    if (!reason) return toast('취소 사유가 필요합니다.', 'warn');
    const result = await api.patch(`billing-accounting-foundation/payment-transactions/${encodeURIComponent(id)}/cancel`, { reason });
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingRefund(id) {
    const reason = (window.prompt('환불 취소 사유를 입력하세요.') || '').trim();
    if (!reason) return toast('취소 사유가 필요합니다.', 'warn');
    const result = await api.patch(`billing-accounting-foundation/refund-records/${encodeURIComponent(id)}/cancel`, { reason });
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingCarryover(id) {
    const reason = (window.prompt('이월 취소 사유를 입력하세요. (양쪽 청구가 함께 원복됩니다)') || '').trim();
    if (!reason) return toast('취소 사유가 필요합니다.', 'warn');
    const result = await api.patch(`billing-accounting-foundation/carryover-records/${encodeURIComponent(id)}/cancel`, { reason });
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingCashbook(id) {
    const result = await api.patch(`billing-accounting-foundation/cashbook-entries/${encodeURIComponent(id)}/cancel`, {});
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function saveBillingAccountingMethod() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.methodForm || {};
    const payload = {
        method_key: document.getElementById('baf-method-key')?.value || form.method_key,
        name: (document.getElementById('baf-method-name')?.value || '').trim(),
        category: (document.getElementById('baf-method-category')?.value || '').trim(),
        is_active: Number(document.getElementById('baf-method-active')?.value || 1),
        sort_order: Number(document.getElementById('baf-method-sort')?.value || 0),
        memo: (document.getElementById('baf-method-memo')?.value || '').trim()
    };
    if (!payload.name) return toast('결제수단 이름을 입력하세요.', 'warn');
    const endpoint = form.id
        ? `billing-accounting-foundation/payment-methods/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/payment-methods';
    return withBillingAccountingSaveGuard(`method:${form.id || payload.method_key || payload.name}`, async () => {
    const body = form.id ? payload : { ...payload, clientRequestId: billingAccountingClientRequestId() };
    const result = form.id ? await api.patch(endpoint, body) : await api.post(endpoint, body);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetMethodForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
    });
}

async function saveBillingAccountingPolicy() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.policyForm || {};
    const valueJson = (document.getElementById('baf-policy-value-json')?.value || '').trim();
    try {
        if (valueJson) JSON.parse(valueJson);
    } catch (e) {
        toast('value_json 형식이 올바르지 않습니다.', 'warn');
        return;
    }
    const payload = {
        branch: document.getElementById('baf-policy-branch')?.value || form.branch,
        rule_type: (document.getElementById('baf-policy-type')?.value || '').trim(),
        rule_key: (document.getElementById('baf-policy-key')?.value || '').trim(),
        name: (document.getElementById('baf-policy-name')?.value || '').trim(),
        value_json: valueJson,
        is_active: Number(document.getElementById('baf-policy-active')?.value || 1),
        memo: (document.getElementById('baf-policy-memo')?.value || '').trim()
    };
    if (!payload.rule_type || !payload.rule_key || !payload.name) {
        toast('수납 정책 필수값을 입력하세요.', 'warn');
        return;
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/billing-policy-rules/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/billing-policy-rules';
    return withBillingAccountingSaveGuard(`policy:${form.id || `${payload.branch}:${payload.rule_type}:${payload.rule_key}`}`, async () => {
    const body = form.id ? payload : { ...payload, clientRequestId: billingAccountingClientRequestId() };
    const result = form.id ? await api.patch(endpoint, body) : await api.post(endpoint, body);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetPolicyForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
    });
}

async function saveBillingAccountingCashbook() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.cashbookForm || {};
    const payload = {
        entry_date: (document.getElementById('baf-cashbook-date')?.value || '').trim(),
        entry_type: document.getElementById('baf-cashbook-type')?.value || form.entry_type,
        category: (document.getElementById('baf-cashbook-category')?.value || '').trim(),
        branch: document.getElementById('baf-cashbook-branch')?.value || form.branch,
        amount: Number(document.getElementById('baf-cashbook-amount')?.value || 0),
        payment_transaction_id: (document.getElementById('baf-cashbook-transaction-id')?.value || '').trim(),
        student_id: (document.getElementById('baf-cashbook-student-id')?.value || '').trim(),
        title: (document.getElementById('baf-cashbook-title')?.value || '').trim(),
        description: (document.getElementById('baf-cashbook-description')?.value || '').trim(),
        method_key: document.getElementById('baf-cashbook-method-key')?.value || '',
        status: document.getElementById('baf-cashbook-status')?.value || form.status,
        is_active: Number(document.getElementById('baf-cashbook-active')?.value || form.is_active || 1)
    };
    if (!payload.entry_date || !payload.category || !payload.amount || !payload.title) {
        return toast('출납 장부 필수값을 입력하세요.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/cashbook-entries/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/cashbook-entries';
    return withBillingAccountingSaveGuard(`cashbook:${form.id || `${payload.entry_date}:${payload.entry_type}:${payload.amount}:${payload.title}`}`, async () => {
    const body = form.id ? payload : { ...payload, clientRequestId: billingAccountingClientRequestId() };
    const result = form.id ? await api.patch(endpoint, body) : await api.post(endpoint, body);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetCashbookForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
    });
}

async function saveBillingAccountingRefund() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.refundForm || {};
    const payload = {
        payment_id: (document.getElementById('baf-refund-payment-id')?.value || '').trim(),
        payment_transaction_id: (document.getElementById('baf-refund-transaction-id')?.value || '').trim(),
        student_id: (document.getElementById('baf-refund-student-id')?.value || '').trim(),
        branch: document.getElementById('baf-refund-branch')?.value || form.branch,
        refund_amount: Number(document.getElementById('baf-refund-amount')?.value || 0),
        refund_method_key: document.getElementById('baf-refund-method-key')?.value || form.refund_method_key,
        refund_date: (document.getElementById('baf-refund-date')?.value || '').trim(),
        reason: (document.getElementById('baf-refund-reason')?.value || '').trim(),
        status: document.getElementById('baf-refund-status')?.value || form.status
    };
    if (!payload.student_id || !payload.refund_amount || !payload.refund_date) {
        return toast('환불 기록 필수값을 입력하세요.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/refund-records/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/refund-records';
    return withBillingAccountingSaveGuard(`refund:${form.id || `${payload.student_id}:${payload.refund_date}:${payload.refund_amount}`}`, async () => {
    const body = form.id ? payload : { ...payload, clientRequestId: billingAccountingClientRequestId() };
    const result = form.id ? await api.patch(endpoint, body) : await api.post(endpoint, body);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetRefundForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
    });
}

async function saveBillingAccountingCarryover() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.carryoverForm || {};
    const payload = {
        student_id: (document.getElementById('baf-carryover-student-id')?.value || '').trim(),
        from_payment_id: (document.getElementById('baf-carryover-from-payment-id')?.value || '').trim(),
        to_payment_id: (document.getElementById('baf-carryover-to-payment-id')?.value || '').trim(),
        branch: document.getElementById('baf-carryover-branch')?.value || form.branch,
        amount: Number(document.getElementById('baf-carryover-amount')?.value || 0),
        carryover_type: (document.getElementById('baf-carryover-type')?.value || '').trim(),
        reason: (document.getElementById('baf-carryover-reason')?.value || '').trim(),
        status: document.getElementById('baf-carryover-status')?.value || form.status
    };
    payload.approved_by = (document.getElementById('baf-carryover-approver')?.value || '').trim();
    if (!payload.student_id || !payload.amount || !payload.carryover_type) {
        return toast('이월 기록 필수값을 입력하세요.', 'warn');
    }
    if (!payload.reason) {
        return toast('이월 사유를 입력하세요.', 'warn');
    }
    if (payload.carryover_type === 'opening_balance' && !payload.approved_by) {
        return toast('기초 선수금은 이관 승인자를 입력해야 합니다.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/carryover-records/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/carryover-records';
    return withBillingAccountingSaveGuard(`carryover:${form.id || `${payload.student_id}:${payload.amount}:${payload.carryover_type}`}`, async () => {
    const body = form.id ? payload : { ...payload, clientRequestId: billingAccountingClientRequestId() };
    const result = form.id ? await api.patch(endpoint, body) : await api.post(endpoint, body);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetCarryoverForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
    });
}

// 집계는 값 입력이 아니라 재계산만 가능 — 서버가 원장 SQL로만 upsert한다.
async function rebuildBillingAccountingSummaries() {
    const ui = getBillingAccountingFoundationState();
    return withBillingAccountingSaveGuard(`summary-rebuild:${ui.year}-${ui.month}`, async () => {
        const monthly = await api.post('billing-accounting-foundation/monthly-summaries', { year: ui.year, month: ui.month, branch: ui.branch });
        const daily = await api.post('billing-accounting-foundation/daily-summaries', { summary_date: billingCollectTodayString(), branch: ui.branch });
        if (monthly?.success || daily?.success) {
            toast('집계를 원장 기준으로 재계산했습니다.', 'success');
            await billingAccountingFetchAll();
            return;
        }
        toast(monthly?.error || daily?.error || '집계 재계산에 실패했습니다.', 'warn');
    });
}

async function reloadBillingAccountingSummaries() {
    const ui = getBillingAccountingFoundationState();
    const today = new Date();
    ui.branch = document.getElementById('baf-summary-branch')?.value || ui.branch;
    const year = Number(document.getElementById('baf-summary-year')?.value || ui.year);
    const month = Number(document.getElementById('baf-summary-month')?.value || ui.month);
    ui.year = Number.isFinite(year) && year >= 2000 && year <= 2100 ? Math.round(year) : today.getFullYear();
    ui.month = Number.isFinite(month) && month >= 1 && month <= 12 ? Math.round(month) : today.getMonth() + 1;
    await billingAccountingFetchAll();
}

function renderBillingAccountingEmpty(message) {
    return `<div style="padding:24px 12px; text-align:center; color:var(--secondary); font-size:12px; font-weight:500; background:var(--surface-2); border:1px dashed var(--border); border-radius:14px;">${billingAccountingEscape(message)}</div>`;
}

function renderBillingAccountingSimpleRows(rows, fields) {
    if (!rows.length) return renderBillingAccountingEmpty('조회 결과가 없습니다.');
    return rows.map(row => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            ${fields.map(field => `
                <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:6px; font-size:12px; line-height:1.5;">
                    <span style="color:var(--secondary); font-weight:500;">${billingAccountingEscape(field.label)}</span>
                    <span style="color:var(--text); font-weight:500; text-align:right; word-break:break-word;">${billingAccountingEscape(field.format ? field.format(row[field.key], row) : (row[field.key] ?? '-'))}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function renderBillingAccountingGroupedAmounts(grouped) {
    const entries = Object.entries(grouped || {});
    if (!entries.length) return renderBillingAccountingEmpty('조회 결과가 없습니다.');
    return entries.map(([key, value]) => `
        <div style="display:flex; justify-content:space-between; gap:12px; padding:9px 0; border-bottom:1px solid var(--border); font-size:12px; line-height:1.5;">
            <span style="color:var(--secondary); font-weight:500;">${billingAccountingEscape(key)}</span>
            <span style="color:var(--text); font-weight:500; text-align:right; word-break:break-word;">${billingAccountingEscape(billingAccountingFormatAmount(value))}</span>
        </div>
    `).join('');
}

function renderBillingAccountingSummaryTab(ui) {
    const summary = ui.accountingSummary || {};
    // 카드 클릭 시 원장 상세로 드릴다운
    const metricCards = [
        { label: '청구', value: summary.total_billed, drill: 'collect' },
        { label: '수납', value: summary.total_paid, drill: 'transactions' },
        { label: '환불', value: summary.total_refunded, drill: 'refunds' },
        { label: '이월', value: summary.total_carryover, drill: 'carryovers' },
        { label: '입금', value: summary.cashbook_income, drill: 'cashbook' },
        { label: '출금', value: summary.cashbook_expense, drill: 'cashbook' }
    ].map(item => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); min-width:0; cursor:pointer;" onclick="setBillingAccountingFoundationTab('${item.drill}')" title="원장 상세 보기">
            <div style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:6px;">${billingAccountingEscape(item.label)} ›</div>
            <div style="font-size:16px; color:var(--text); font-weight:500; line-height:1.3; word-break:break-word;">${billingAccountingEscape(billingAccountingFormatAmount(item.value))}</div>
        </div>
    `).join('');
    const dailyRows = renderBillingAccountingSimpleRows(ui.dailySummaries || [], [
        { key: 'summary_date', label: '일자' },
        { key: 'branch', label: 'branch' },
        { key: 'total_paid', label: '수납', format: value => billingAccountingFormatAmount(value) },
        { key: 'total_refunded', label: '환불', format: value => billingAccountingFormatAmount(value) },
        { key: 'total_outstanding', label: '미수', format: value => billingAccountingFormatAmount(value) }
    ]);
    const monthlyRows = renderBillingAccountingSimpleRows(ui.monthlySummaries || [], [
        { key: 'year', label: '연도' },
        { key: 'month', label: '월' },
        { key: 'branch', label: 'branch' },
        { key: 'total_paid', label: '수납', format: value => billingAccountingFormatAmount(value) },
        { key: 'total_refunded', label: '환불', format: value => billingAccountingFormatAmount(value) }
    ]);

    return `
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(120px,1fr)); gap:8px; margin-bottom:12px;">
            <select id="baf-summary-branch" class="btn" style="width:100%; background:var(--surface-2); border:none;">${billingAccountingBranchOptions(ui.branch)}</select>
            <input id="baf-summary-year" class="btn" type="number" value="${billingAccountingEscape(ui.year)}" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-summary-month" class="btn" type="number" min="1" max="12" value="${billingAccountingEscape(ui.month)}" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
        </div>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="reloadBillingAccountingSummaries()">조회</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500; color:var(--primary); background:rgba(var(--primary-rgb),0.08); border:none;" onclick="billingAccountingFetchAll()">새로고침</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="rebuildBillingAccountingSummaries()">집계 재계산</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:8px; margin-bottom:12px;">
            ${metricCards}
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:10px; margin-bottom:14px;">
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
                <div style="font-size:13px; font-weight:500; color:var(--text); margin-bottom:8px;">결제수단별</div>
                ${renderBillingAccountingGroupedAmounts(summary.by_method)}
            </div>
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
                <div style="font-size:13px; font-weight:500; color:var(--text); margin-bottom:8px;">상태별</div>
                ${renderBillingAccountingGroupedAmounts(summary.by_status)}
            </div>
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
                <div style="font-size:13px; font-weight:500; color:var(--text); margin-bottom:8px;">브랜치별</div>
                ${renderBillingAccountingGroupedAmounts(summary.by_branch)}
            </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;">
            <div>
                <div style="font-size:13px; font-weight:500; color:var(--text); margin-bottom:8px;">일별 요약</div>
                ${dailyRows}
            </div>
            <div>
                <div style="font-size:13px; font-weight:500; color:var(--text); margin-bottom:8px;">월별 요약</div>
                ${monthlyRows}
            </div>
        </div>
    `;
}

function renderBillingAccountingMethodsTab(ui) {
    const form = ui.methodForm || {};
    const rows = (ui.methods || []).map(item => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:8px;">
                <div>
                    <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(item.name || item.method_key || '-')}</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:500;">${billingAccountingEscape(item.method_key || '-')} · ${billingAccountingEscape(item.category || '-')} · sort ${billingAccountingEscape(item.sort_order ?? 0)}</div>
                </div>
                <div style="font-size:11px; font-weight:500; color:${Number(item.is_active) === 0 ? 'var(--secondary)' : 'var(--success)'};">${Number(item.is_active) === 0 ? '비활성화' : '사용중'}</div>
            </div>
            <div style="font-size:12px; color:var(--secondary); margin-bottom:10px; line-height:1.5;">${billingAccountingEscape(item.memo || '메모 없음')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingMethod('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--warning); background:rgba(245,159,0,0.12); border:none;" onclick="toggleBillingAccountingMethodActive('${billingAccountingEscape(item.id)}', ${Number(item.is_active) === 0 ? 1 : 0})">${Number(item.is_active) === 0 ? '활성화' : '비활성화'}</button>
            </div>
        </div>
    `).join('');

    return `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
            <select id="baf-method-key" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingMethodKeyOptions(form.method_key)}</select>
            <input id="baf-method-name" class="btn" value="${billingAccountingEscape(form.name)}" placeholder="결제수단" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-method-category" class="btn" value="${billingAccountingEscape(form.category)}" placeholder="category" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-method-sort" class="btn" type="number" value="${billingAccountingEscape(form.sort_order ?? 0)}" placeholder="sort_order" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="baf-method-active" class="btn" style="background:var(--surface-2); border:none;">
                <option value="1" ${Number(form.is_active) === 0 ? '' : 'selected'}>사용중</option>
                <option value="0" ${Number(form.is_active) === 0 ? 'selected' : ''}>비활성화</option>
            </select>
            <div></div>
        </div>
        <textarea id="baf-method-memo" class="btn" placeholder="memo" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.memo)}</textarea>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="saveBillingAccountingMethod()">저장</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="billingAccountingResetMethodForm(); renderBillingAccountingFoundationModal();">초기화</button>
        </div>
        <div>${rows || renderBillingAccountingEmpty('결제수단이 없습니다.')}</div>
    `;
}

function renderBillingAccountingPoliciesTab(ui) {
    const form = ui.policyForm || {};
    const rows = (ui.policies || []).map(item => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:8px;">
                <div>
                    <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(item.name || item.rule_key || '-')}</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:500;">${billingAccountingEscape(item.branch || 'all')} · ${billingAccountingEscape(item.rule_type || '-')} · ${billingAccountingEscape(item.rule_key || '-')}</div>
                </div>
                <div style="font-size:11px; font-weight:500; color:${Number(item.is_active) === 0 ? 'var(--secondary)' : 'var(--success)'};">${Number(item.is_active) === 0 ? '비활성화' : '사용중'}</div>
            </div>
            <pre style="margin:0 0 10px 0; padding:10px; background:var(--surface-2); border-radius:12px; font-size:11px; line-height:1.5; color:var(--text); white-space:pre-wrap; word-break:break-word;">${billingAccountingEscape(billingAccountingFormatJsonForEditor(item.value_json))}</pre>
            <div style="font-size:12px; color:var(--secondary); margin-bottom:10px; line-height:1.5;">${billingAccountingEscape(item.memo || '메모 없음')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingPolicy('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--warning); background:rgba(245,159,0,0.12); border:none;" onclick="toggleBillingAccountingPolicyActive('${billingAccountingEscape(item.id)}', ${Number(item.is_active) === 0 ? 1 : 0})">${Number(item.is_active) === 0 ? '활성화' : '비활성화'}</button>
            </div>
        </div>
    `).join('');

    return `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
            <select id="baf-policy-branch" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingBranchOptions(form.branch)}</select>
            <input id="baf-policy-type" class="btn" value="${billingAccountingEscape(form.rule_type)}" placeholder="rule_type" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-policy-key" class="btn" value="${billingAccountingEscape(form.rule_key)}" placeholder="rule_key" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-policy-name" class="btn" value="${billingAccountingEscape(form.name)}" placeholder="수납 정책" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="baf-policy-active" class="btn" style="background:var(--surface-2); border:none;">
                <option value="1" ${Number(form.is_active) === 0 ? '' : 'selected'}>사용중</option>
                <option value="0" ${Number(form.is_active) === 0 ? 'selected' : ''}>비활성화</option>
            </select>
            <div></div>
        </div>
        <textarea id="baf-policy-value-json" class="btn" placeholder="value_json" style="width:100%; min-height:104px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.value_json)}</textarea>
        <textarea id="baf-policy-memo" class="btn" placeholder="memo" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.memo)}</textarea>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="saveBillingAccountingPolicy()">저장</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="billingAccountingResetPolicyForm(); renderBillingAccountingFoundationModal();">초기화</button>
        </div>
        <div>${rows || renderBillingAccountingEmpty('수납 정책이 없습니다.')}</div>
    `;
}

function renderBillingAccountingListTab(ui, tab) {
    if (tab === 'transactions') {
        // 수납 입력은 '수납 데스크' 탭에서만 진행한다. 이 탭은 최근 거래 확인·메모 수정·취소 전용.
        // (raw student_id/payment_id 직접 입력 UI는 제거됨 — 학생 검색으로 대체)
        const typeLabel = (t) => ({ payment: '수납', partial_payment: '부분수납', refund: '환불', cancel: '취소', correction: '정정', carryover_in: '이월입금', carryover_out: '이월출금' }[String(t || '')] || String(t || '-'));
        const statusLabel = (s) => ({ completed: '완료', cancelled: '취소됨', pending: '대기', failed: '실패', corrected: '정정됨' }[String(s || '')] || String(s || '-'));
        const studentNameOf = (sid) => {
            const student = (state.db.students || []).find(x => String(x.id) === String(sid));
            return student?.name || '(미등록 학생)';
        };
        const rows = (ui.transactions || []).map(item => `
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; gap:10px; margin-bottom:8px; flex-wrap:wrap;">
                    <div>
                        <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(studentNameOf(item.student_id))} · ${billingAccountingFormatAmount(item.amount)}원</div>
                        <div style="font-size:11px; color:var(--secondary); font-weight:500;">${billingAccountingEscape(item.transaction_date || '-')} · ${billingAccountingEscape(typeLabel(item.transaction_type))} · ${billingAccountingEscape(billingCollectMethodLabel(item.method_key))} · ${billingAccountingEscape(statusLabel(item.status))}</div>
                    </div>
                </div>
                ${item.note ? `<div style="font-size:12px; color:var(--secondary); margin-bottom:8px; line-height:1.5;">${billingAccountingEscape(item.note)}</div>` : ''}
                <div style="display:flex; gap:8px;">
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingTransactionNote('${billingAccountingEscape(item.id)}')">메모 수정</button>
                    ${String(item.status || '') === 'cancelled'
                        ? `<button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--secondary); background:var(--surface-2); border:none;" disabled>취소됨</button>`
                        : `<button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="cancelBillingAccountingTransaction('${billingAccountingEscape(item.id)}')">취소</button>`}
                </div>
            </div>
        `).join('');
        return `
            <div style="margin-bottom:12px; padding:10px 12px; border-radius:12px; background:var(--surface-2); font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">새 수납 입력은 <b>수납 데스크</b> 탭에서 학생 검색으로 진행합니다. 완료된 수납은 금액·일자·대상을 수정할 수 없고, 잘못 입력한 경우 취소 후 다시 입력합니다.</div>
            <div>${rows || renderBillingAccountingEmpty('최근 수납 거래가 없습니다.')}</div>
        `;
    }
    if (tab === 'cashbook') {
        const form = ui.cashbookForm || {};
        const rows = (ui.cashbookEntries || []).map(item => `
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
                <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(item.title || '-')} · ${billingAccountingFormatAmount(item.amount)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:8px;">${billingAccountingEscape(item.entry_date || '-')} · ${billingAccountingEscape(item.entry_type || '-')} · ${billingAccountingEscape(item.category || '-')} · ${billingAccountingEscape(item.status || 'active')}</div>
                <div style="display:flex; gap:8px;">
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingCashbook('${billingAccountingEscape(item.id)}')">수정</button>
                    ${String(item.status || 'active') === 'cancelled' || Number(item.is_active) === 0
                        ? `<button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--secondary); background:var(--surface-2); border:none;" disabled>취소</button>`
                        : `<button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="cancelBillingAccountingCashbook('${billingAccountingEscape(item.id)}')">취소</button>`
                    }
                </div>
            </div>
        `).join('');
        return `
            <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
                <input id="baf-cashbook-date" class="btn" type="date" value="${billingAccountingEscape(form.entry_date)}" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-cashbook-type" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingEntryTypeOptions(form.entry_type)}</select>
                <input id="baf-cashbook-category" class="btn" value="${billingAccountingEscape(form.category)}" placeholder="category" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-cashbook-branch" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingBranchOptions(form.branch)}</select>
                <input id="baf-cashbook-amount" class="btn" type="number" value="${billingAccountingEscape(form.amount)}" placeholder="amount" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-cashbook-method-key" class="btn" value="${billingAccountingEscape(form.method_key)}" placeholder="method_key" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-cashbook-title" class="btn" value="${billingAccountingEscape(form.title)}" placeholder="title" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-cashbook-student-id" class="btn" value="${billingAccountingEscape(form.student_id)}" placeholder="student_id" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-cashbook-transaction-id" class="btn" value="${billingAccountingEscape(form.payment_transaction_id)}" placeholder="payment_transaction_id" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-cashbook-status" class="btn" style="background:var(--surface-2); border:none;">
                    <option value="active" ${String(form.status || 'active') === 'active' ? 'selected' : ''}>active</option>
                    <option value="inactive" ${String(form.status || '') === 'inactive' ? 'selected' : ''}>inactive</option>
                    <option value="corrected" ${String(form.status || '') === 'corrected' ? 'selected' : ''}>corrected</option>
                    <option value="cancelled" ${String(form.status || '') === 'cancelled' ? 'selected' : ''}>cancelled</option>
                </select>
                <select id="baf-cashbook-active" class="btn" style="background:var(--surface-2); border:none;">
                    <option value="1" ${Number(form.is_active) === 0 ? '' : 'selected'}>사용중</option>
                    <option value="0" ${Number(form.is_active) === 0 ? 'selected' : ''}>비활성화</option>
                </select>
            </div>
            <textarea id="baf-cashbook-description" class="btn" placeholder="description" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.description)}</textarea>
            <div style="display:flex; gap:8px; margin-bottom:6px;">
                <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="saveBillingAccountingCashbook()">저장</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="billingAccountingResetCashbookForm(); renderBillingAccountingFoundationModal();">초기화</button>
            </div>
            <div>${rows || renderBillingAccountingSimpleRows(ui.cashbookEntries || [], [
            { key: 'entry_date', label: '일자' },
            { key: 'branch', label: 'branch' },
            { key: 'entry_type', label: 'entry_type' },
            { key: 'title', label: '제목' },
            { key: 'amount', label: '금액', format: value => billingAccountingFormatAmount(value) }
        ])}</div>
        `;
    }
    if (tab === 'refunds') {
        const form = ui.refundForm || {};
        const rows = (ui.refunds || []).map(item => `
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
                <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(item.student_id || '-')} · ${billingAccountingFormatAmount(item.refund_amount)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:8px;">${billingAccountingEscape(item.refund_date || '-')} · ${billingAccountingEscape(item.status || '-')}</div>
                <div style="display:flex; gap:8px;">
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingRefund('${billingAccountingEscape(item.id)}')">수정</button>
                    <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="cancelBillingAccountingRefund('${billingAccountingEscape(item.id)}')">취소</button>
                </div>
            </div>
        `).join('');
        return `
            <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
                <input id="baf-refund-student-id" class="btn" value="${billingAccountingEscape(form.student_id)}" placeholder="student_id" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-refund-payment-id" class="btn" value="${billingAccountingEscape(form.payment_id)}" placeholder="payment_id" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-refund-transaction-id" class="btn" value="${billingAccountingEscape(form.payment_transaction_id)}" placeholder="payment_transaction_id" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-refund-branch" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingBranchOptions(form.branch)}</select>
                <input id="baf-refund-amount" class="btn" type="number" value="${billingAccountingEscape(form.refund_amount)}" placeholder="refund_amount" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-refund-method-key" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingMethodKeyOptions(form.refund_method_key)}</select>
                <input id="baf-refund-date" class="btn" type="date" value="${billingAccountingEscape(form.refund_date)}" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-refund-status" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingTransactionStatusOptions(form.status)}</select>
            </div>
            <textarea id="baf-refund-reason" class="btn" placeholder="reason" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.reason)}</textarea>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
                <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="saveBillingAccountingRefund()">저장</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="billingAccountingResetRefundForm(); renderBillingAccountingFoundationModal();">초기화</button>
            </div>
            <div>${rows || renderBillingAccountingSimpleRows(ui.refunds || [], [
            { key: 'refund_date', label: '일자' },
            { key: 'student_id', label: 'student_id' },
            { key: 'branch', label: 'branch' },
            { key: 'refund_amount', label: '환불', format: value => billingAccountingFormatAmount(value) },
            { key: 'status', label: 'status' }
        ])}</div>
        `;
    }
    const form = ui.carryoverForm || {};
    const rows = (ui.carryovers || []).map(item => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            <div style="font-size:13px; font-weight:500; color:var(--text);">${billingAccountingEscape(item.student_id || '-')} · ${billingAccountingFormatAmount(item.amount)}</div>
            <div style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:8px;">${billingAccountingEscape(item.carryover_type || '-')} · ${billingAccountingEscape(item.status || '-')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500;" onclick="editBillingAccountingCarryover('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:38px; font-size:12px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.08); border:none;" onclick="cancelBillingAccountingCarryover('${billingAccountingEscape(item.id)}')">취소</button>
            </div>
        </div>
    `).join('');
    return `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
            <input id="baf-carryover-student-id" class="btn" value="${billingAccountingEscape(form.student_id)}" placeholder="student_id" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-carryover-amount" class="btn" type="number" value="${billingAccountingEscape(form.amount)}" placeholder="amount" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-carryover-from-payment-id" class="btn" value="${billingAccountingEscape(form.from_payment_id)}" placeholder="from_payment_id" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-carryover-to-payment-id" class="btn" value="${billingAccountingEscape(form.to_payment_id)}" placeholder="to_payment_id" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="baf-carryover-branch" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingBranchOptions(form.branch)}</select>
            <select id="baf-carryover-type" class="btn" style="background:var(--surface-2); border:none;">
                <option value="credit" ${String(form.carryover_type || 'credit') === 'credit' ? 'selected' : ''}>일반 이월</option>
                <option value="opening_balance" ${String(form.carryover_type || '') === 'opening_balance' ? 'selected' : ''}>기초 선수금 (승인자 필수)</option>
            </select>
            <input id="baf-carryover-approver" class="btn" value="" placeholder="이관 승인자 (기초 선수금)" style="text-align:left; background:var(--surface-2); border:none;">
            <div></div>
        </div>
        <textarea id="baf-carryover-reason" class="btn" placeholder="이월 사유 (필수)" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.reason)}</textarea>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="saveBillingAccountingCarryover()">저장</button>
            <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="billingAccountingResetCarryoverForm(); renderBillingAccountingFoundationModal();">초기화</button>
        </div>
        <div>${rows || renderBillingAccountingSimpleRows(ui.carryovers || [], [
        { key: 'created_at', label: '생성일' },
        { key: 'student_id', label: 'student_id' },
        { key: 'branch', label: 'branch' },
        { key: 'carryover_type', label: 'carryover_type' },
        { key: 'amount', label: '금액', format: value => billingAccountingFormatAmount(value) },
        { key: 'status', label: 'status' }
    ])}</div>
    `;
}

async function saveBillingAccountingClosing() {
    const periodType = document.getElementById('baf-closing-type')?.value || 'month';
    const periodKey = (document.getElementById('baf-closing-key')?.value || '').trim();
    const branch = document.getElementById('baf-closing-branch')?.value || 'all';
    if (!periodKey) return toast('마감할 기간을 입력하세요. (월마감: 2026-07 / 일마감: 2026-07-14)', 'warn');
    if (!confirm(`${periodKey} 기간을 마감할까요? 마감 후에는 이 기간의 금액 기록을 생성·수정·취소할 수 없습니다.`)) return;
    return withBillingAccountingSaveGuard(`closing:${periodType}:${periodKey}:${branch}`, async () => {
        const result = await api.post('billing-accounting-foundation/closings', { period_type: periodType, period_key: periodKey, branch });
        if (result?.success) {
            toast('마감되었습니다.', 'success');
            await billingAccountingFetchAll();
            return;
        }
        toast(result?.error || result?.message || '마감에 실패했습니다.', 'warn');
    });
}

async function reopenBillingAccountingClosing(id) {
    const reason = (window.prompt('재오픈 사유를 입력하세요. (승인자·시각과 함께 감사 기록에 남습니다)') || '').trim();
    if (!reason) return toast('재오픈 사유가 필요합니다.', 'warn');
    const result = await api.patch(`billing-accounting-foundation/closings/${encodeURIComponent(id)}/reopen`, { reason });
    if (result?.success) {
        toast('재오픈되었습니다. 정정 후 다시 마감해 주세요.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '재오픈에 실패했습니다.', 'warn');
}

function renderBillingAccountingClosingsTab(ui) {
    const rows = (ui.closings || []).map(item => {
        const isClosed = String(item.status) === 'closed';
        return `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
                <div style="font-size:13px; font-weight:600; color:var(--text);">${billingAccountingEscape(item.period_key)} ${item.period_type === 'day' ? '일마감' : '월마감'}</div>
                <span style="font-size:11px; font-weight:500; padding:3px 8px; border-radius:999px; ${isClosed ? 'color:var(--error); background:rgba(var(--error-rgb),0.08);' : 'color:var(--warning); background:rgba(245,159,0,0.12);'}">${isClosed ? '마감됨' : '재오픈됨'}</span>
            </div>
            <div style="font-size:11px; color:var(--secondary); font-weight:500; margin-bottom:8px; line-height:1.6;">
                마감: ${billingAccountingEscape(item.closed_by || '-')} · ${billingAccountingEscape(String(item.closed_at || '').slice(0, 16).replace('T', ' '))}
                ${item.reopened_at ? `<br>재오픈: ${billingAccountingEscape(item.reopened_by || '-')} · ${billingAccountingEscape(String(item.reopened_at || '').slice(0, 16).replace('T', ' '))} · ${billingAccountingEscape(item.reopen_reason || '')}` : ''}
            </div>
            ${isClosed
                ? `<button class="btn apms-button apms-button--quiet" style="width:100%; min-height:38px; font-size:12px; font-weight:500; color:var(--warning); background:rgba(245,159,0,0.12); border:none;" onclick="reopenBillingAccountingClosing('${billingAccountingEscape(item.id)}')">재오픈 (사유 필수)</button>`
                : `<div style="font-size:11px; color:var(--secondary); font-weight:500;">정정 후 같은 기간을 다시 마감하면 새 스냅샷으로 재마감됩니다.</div>`}
        </div>
    `;
    }).join('');

    return `
        <div style="margin-bottom:12px; padding:10px 12px; border-radius:12px; background:var(--surface-2); font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">마감하면 해당 기간의 수납·환불·조정·이월·장부를 변경할 수 없습니다. 마감 시 원장 합계가 스냅샷으로 저장되며, 장부와 어긋나면 마감이 거부됩니다.</div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:8px; margin-bottom:8px;">
            <select id="baf-closing-type" class="btn" style="background:var(--surface-2); border:none; min-height:44px;">
                <option value="month">월마감</option>
                <option value="day">일마감</option>
            </select>
            <input id="baf-closing-key" class="btn" placeholder="2026-07 (월) / 2026-07-14 (일)" style="text-align:left; background:var(--surface-2); border:none; min-height:44px;">
            <select id="baf-closing-branch" class="btn" style="background:var(--surface-2); border:none; min-height:44px;">${billingAccountingBranchOptions('all')}</select>
        </div>
        <button class="btn apms-button apms-button--primary btn-primary" style="width:100%; min-height:44px; font-size:12px; font-weight:600; margin-bottom:14px;" onclick="saveBillingAccountingClosing()">마감 실행</button>
        <div>${rows || renderBillingAccountingEmpty('마감 이력이 없습니다.')}</div>
    `;
}

function renderBillingAccountingFoundationModal() {
    const ui = getBillingAccountingFoundationState();
    const tabs = [
        { key: 'collect', label: '수납 데스크' },
        { key: 'closings', label: '마감' },
        { key: 'summary', label: '일별 요약 / 월별 요약' },
        { key: 'methods', label: '결제수단' },
        { key: 'policies', label: '수납 정책' },
        { key: 'transactions', label: '수납 거래' },
        { key: 'cashbook', label: '출납 장부' },
        { key: 'refunds', label: '환불 기록' },
        { key: 'carryovers', label: '이월 기록' }
    ];

    const tabButtons = tabs.map(tab => `
        <button class="btn apms-button apms-button--quiet" style="padding:9px 12px; border-radius:10px; border:none; font-size:12px; font-weight:500; background:${ui.tab === tab.key ? 'var(--surface)' : 'transparent'}; color:${ui.tab === tab.key ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${ui.tab === tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'};" onclick="setBillingAccountingFoundationTab('${tab.key}')">${billingAccountingEscape(tab.label)}</button>
    `).join('');

    let body = '';
    if (ui.tab === 'collect') {
        // 수납 데스크는 자체 로딩 상태를 가진다 — 전체 fetch 로딩과 분리.
        body = renderBillingCollectTab(ui);
    } else if (ui.loading) {
        body = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">불러오는 중...</div>`;
    } else if (ui.tab === 'closings') {
        body = renderBillingAccountingClosingsTab(ui);
    } else if (ui.tab === 'summary') {
        body = renderBillingAccountingSummaryTab(ui);
    } else if (ui.tab === 'methods') {
        body = renderBillingAccountingMethodsTab(ui);
    } else if (ui.tab === 'policies') {
        body = renderBillingAccountingPoliciesTab(ui);
    } else {
        body = renderBillingAccountingListTab(ui, ui.tab);
    }

    showModal('수납·출납 관리', `
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; background:var(--surface-2); padding:4px; border-radius:12px;">
            ${tabButtons}
        </div>
        ${ui.error ? `<div style="margin-bottom:12px; padding:10px 12px; border-radius:12px; background:rgba(var(--error-rgb),0.08); color:var(--error); font-size:12px; font-weight:500;">${billingAccountingEscape(ui.error)}</div>` : ''}
        <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5; margin-bottom:12px;">수납을 저장하면 청구 상태·출납 장부·감사 기록이 자동 반영됩니다. 완료된 금액 기록은 수정하지 않고 취소 후 재입력합니다.</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${body}</div>
    `);
}

async function openBillingAccountingFoundationModal() {
    if (String(state?.auth?.role || '') !== 'admin') {
        toast('접근 권한이 없습니다.', 'warn');
        return;
    }
    const ui = getBillingAccountingFoundationState();
    ui.tab = ui.tab || 'collect';
    renderBillingAccountingFoundationModal();
    await billingAccountingFetchAll();
}
