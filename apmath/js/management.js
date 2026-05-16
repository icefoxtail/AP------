/**
 * AP Math OS 1.0 [js/management.js]
 * Split from dashboard.js.
 */

function mgmtEscape(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function getClassStudentCount(classId) {
    return (state.db.class_students || []).filter(m => String(m.class_id) === String(classId)).length;
}

function getStudentClass(studentId) {
    const map = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return (state.db.classes || []).find(c => String(c.id) === String(map?.class_id));
}

function renderAddressBookList() {
    const search = (document.getElementById('ab-search')?.value || '').trim().toLowerCase();
    const cid = document.getElementById('ab-class')?.value || '';
    const listRoot = document.getElementById('ab-list');
    if (!listRoot) return;

    let stds = (state.db.students || []).filter(s => {
        const status = String(s.status || '재원').trim();
        return status === '재원';
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
        const statusRank = (s) => String(s.status || '재원') === '재원' ? 0 : 1;
        return statusRank(a) - statusRank(b)
            || String(a.grade || '').localeCompare(String(b.grade || ''), 'ko')
            || String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });

    if (stds.length === 0) {
        listRoot.innerHTML = `<div style="text-align:center; padding:28px; color:var(--secondary); font-size:13px; font-weight:700;">검색 결과가 없습니다.</div>`;
        return;
    }

    listRoot.innerHTML = stds.map(s => {
        const cls = getStudentClass(s.id);
        const status = String(s.status || '재원');
        const isActive = status === '재원';
        const statusStyle = isActive
            ? 'color:var(--success); background:rgba(0,208,132,0.08); border:1px solid rgba(0,208,132,0.15);'
            : 'color:var(--secondary); background:var(--surface-2); border:1px solid var(--border);';

        return `
            <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; gap:12px; align-items:flex-start;">
                <div style="flex:1; min-width:0;">
                    <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:6px;">
                        <b style="font-size:14px; color:var(--text); line-height:1.4;">${mgmtEscape(s.name)}</b>
                        <span style="font-size:11px; font-weight:800; padding:3px 7px; border-radius:999px; ${statusStyle}">${mgmtEscape(status)}</span>
                    </div>
                    <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; font-size:12px; color:var(--secondary); line-height:1.5;">
                        <div><b style="color:var(--text);">반</b> ${mgmtEscape(cls?.name || '미배정')}</div>
                        <div><b style="color:var(--text);">학교</b> ${mgmtEscape(s.school_name || '-')} ${mgmtEscape(s.grade || '')}</div>
                        <div><b style="color:var(--text);">학생</b> ${mgmtEscape(s.student_phone || '-')}</div>
                        <div><b style="color:var(--text);">보호자</b> ${mgmtEscape(s.parent_phone || '-')} ${s.guardian_relation ? `(${mgmtEscape(s.guardian_relation)})` : ''}</div>
                    </div>
                </div>
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap; max-width:190px;">
                    <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700;" onclick="setManagementReturnView({ type: 'addressBook' }); closeModal(true); renderStudentDetail('${s.id}')">상세</button>
                    <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.08); border:none;" onclick="openEditStudent('${s.id}', { returnTo: { type: 'addressBook' } })">수정</button>
                    ${isActive
                        ? `<button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.08); border:none;" onclick="handleDelete('${s.id}')">퇴원</button>`
                        : `<button class="btn btn-primary" style="padding:6px 10px; font-size:11px; font-weight:700;" onclick="handleRestore('${s.id}')">복구</button>`
                    }
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    setManagementReturnView({ type: 'addressBook' });
    setModalReturnView(null);
    const classOptions = sortClassesForManagement(state.db.classes || [])
        .map(c => `<option value="${mgmtEscape(c.id)}">${mgmtEscape(c.name)}${Number(c.is_active) === 0 ? ' (숨김)' : ''}</option>`)
        .join('');

    showModal('학생관리', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn btn-primary" style="padding:10px; flex:1; font-size:12px; font-weight:800;" onclick="openAddStudent('', { returnTo: { type: 'addressBook' } });">학생 추가</button>
            <button class="btn" style="padding:10px; flex:1; font-size:12px; color:var(--primary); background:rgba(26,92,255,0.1); border:none; font-weight:800;" onclick="setModalReturnView({ type: 'addressBook' }); openGlobalPinManagement()">PIN관리</button>
        </div>
        <div style="display:grid; grid-template-columns:1fr 150px; gap:8px; margin-bottom:14px;">
            <input id="ab-search" class="btn" placeholder="이름/학교/반 검색" style="width:100%; text-align:left; background:var(--surface-2); border:none;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="width:100%; background:var(--surface-2); border:none;" onchange="renderAddressBookList()"><option value="">전체 학생</option>${classOptions}</select>
        </div>
        <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:8px;">재원생만 표시하고, 반 선택은 보조 필터로 사용합니다.</div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px; padding-right:4px;"></div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    setModalReturnView({ type: 'addressBook' });
    const classes = sortClassesForManagement((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px; border:1px solid var(--border); background:var(--surface);" onclick="if(typeof handleBatchGeneratePins==='function') handleBatchGeneratePins('${c.id}'); else toast('해당 기능은 학생관리 모듈에 있습니다.', 'warn');">
            <span style="font-weight:700; font-size:14px; color:var(--text);">${mgmtEscape(c.name)}</span>
            <span style="font-size:11px; color:var(--primary); font-weight:700; background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px;">일괄 생성</span>
        </button>
    `).join('');

    showModal('PIN관리', `
        <div style="margin-bottom:16px; font-size:12px; color:var(--secondary); line-height:1.5; background:var(--surface-2); padding:12px; border-radius:10px;">선택한 반에 속한 학생 중, <b>아직 PIN 번호가 없는 학생</b>들에게만 고유 PIN을 자동 부여합니다. 기존 PIN은 유지됩니다.</div>
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
                    <b style="font-size:15px; color:var(--text); line-height:1.35;">${mgmtEscape(c.name)}</b>
                    <span style="font-size:11px; font-weight:800; color:var(--primary); background:rgba(26,92,255,0.08); padding:3px 7px; border-radius:999px;">${mgmtEscape(c.grade || '-')}</span>
                    ${isHidden ? `<span style="font-size:11px; font-weight:800; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 7px; border-radius:999px;">숨김</span>` : ''}
                </div>
                <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:6px; font-size:12px; color:var(--secondary); line-height:1.5;">
                    <div><b style="color:var(--text);">과목</b> ${mgmtEscape(c.subject || '수학')}</div>
                    <div><b style="color:var(--text);">담당</b> ${mgmtEscape(c.teacher_name || '-')}</div>
                    <div><b style="color:var(--text);">요일</b> ${mgmtEscape(formatClassScheduleDaysForUI(c.schedule_days))}</div>
                    <div><b style="color:var(--text);">시간</b> ${mgmtEscape(timeLabel)}</div>
                    <div><b style="color:var(--text);">학생</b> ${studentCount}명</div>
                </div>
            </div>
            <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap; max-width:210px;">
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:800;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${isHidden
                    ? `<button class="btn btn-primary" style="padding:6px 10px; font-size:11px; font-weight:800;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                    : `<button class="btn" style="padding:6px 10px; font-size:11px; font-weight:800; color:var(--warning); background:rgba(255,165,2,0.1); border:none;" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:800; color:var(--error); background:rgba(255,71,87,0.08); border:none;" onclick="handleDeleteClass('${c.id}')">삭제</button>
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
            <button class="btn btn-primary" style="padding:10px 14px; font-size:12px; font-weight:800;" onclick="openAddClassModal()">새 반 추가</button>
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
            <label style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
            </div>
            <label style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:8px;">시간</label>
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
            <label style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
            </div>
            <label style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:8px;">시간</label>
            <select id="edit-cls-period" class="btn" style="background:var(--surface-2); border:none;" onchange="syncClassPeriodTime('edit')">
                ${getTimeLabelOptions(selectedPeriod)}
            </select>
            <input id="edit-cls-timelabel" class="btn" value="${mgmtEscape(c.time_label || '')}" placeholder="직접 입력 (예: 화.목 9:30~11:30)" style="text-align:left; background:var(--surface-2); border:none;">
            <button class="btn" style="margin-top:6px; min-height:42px; color:var(--error); background:rgba(255,71,87,0.08); border:1px solid rgba(255,71,87,0.16); font-weight:800;" onclick="handleDeleteClass('${c.id}')">반 삭제</button>
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

    const first = confirm('이 반을 삭제할까요?');
    if (!first) return;

    const second = confirm('반 삭제 시 반 배정, 교재, 진도, 시험 배정 등 연결 기록이 함께 삭제될 수 있습니다. 계속할까요?');
    if (!second) return;

    try {
        const r = await api.delete('classes', classId);

        if (r?.success) {
            toast('반이 삭제되었습니다.', 'info');
            await loadData();
            openClassManageModal();
            return;
        }

        toast(r?.message || r?.error || '반 삭제에 실패했습니다.', 'warn');
    } catch (e) {
        console.error('[handleDeleteClass] failed:', e);
        toast('반 삭제 중 오류가 발생했습니다.', 'warn');
    }
}

function getBillingAccountingFoundationState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.billingAccountingFoundation) {
        const today = new Date();
        state.ui.billingAccountingFoundation = {
            tab: 'summary',
            loading: false,
            error: '',
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
            methodForm: { id: '', method_key: 'card', name: '', category: '', is_active: 1, sort_order: 0, memo: '' },
            policyForm: { id: '', branch: 'all', rule_type: 'tuition', rule_key: '', name: '', value_json: '{\n  "amount": 0\n}', is_active: 1, memo: '' },
            transactionForm: { id: '', payment_id: '', student_id: '', branch: 'apmath', transaction_type: 'payment', method_key: 'card', amount: '', transaction_date: '', status: 'completed', receipt_no: '', external_provider: '', external_transaction_id: '', note: '' },
            cashbookForm: { id: '', entry_date: '', entry_type: 'income', category: '', branch: 'all', amount: '', payment_transaction_id: '', student_id: '', title: '', description: '', method_key: '' },
            refundForm: { id: '', payment_id: '', payment_transaction_id: '', student_id: '', branch: 'apmath', refund_amount: '', refund_method_key: 'card', refund_date: '', reason: '', status: 'completed' },
            carryoverForm: { id: '', student_id: '', from_payment_id: '', to_payment_id: '', branch: 'apmath', amount: '', carryover_type: 'credit', reason: '', status: 'active' }
        };
    }
    return state.ui.billingAccountingFoundation;
}

function billingAccountingResetMethodForm() {
    const ui = getBillingAccountingFoundationState();
    ui.methodForm = { id: '', method_key: 'card', name: '', category: '', is_active: 1, sort_order: 0, memo: '' };
}

function billingAccountingResetPolicyForm() {
    const ui = getBillingAccountingFoundationState();
    ui.policyForm = { id: '', branch: 'all', rule_type: 'tuition', rule_key: '', name: '', value_json: '{\n  "amount": 0\n}', is_active: 1, memo: '' };
}

function billingAccountingResetTransactionForm() {
    const ui = getBillingAccountingFoundationState();
    ui.transactionForm = { id: '', payment_id: '', student_id: '', branch: 'apmath', transaction_type: 'payment', method_key: 'card', amount: '', transaction_date: '', status: 'completed', receipt_no: '', external_provider: '', external_transaction_id: '', note: '' };
}

function billingAccountingResetCashbookForm() {
    const ui = getBillingAccountingFoundationState();
    ui.cashbookForm = { id: '', entry_date: '', entry_type: 'income', category: '', branch: 'all', amount: '', payment_transaction_id: '', student_id: '', title: '', description: '', method_key: '' };
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
    const options = ['payment', 'partial_payment', 'refund', 'cancel', 'correction', 'carryover_in', 'carryover_out'];
    return options.map(option => `<option value="${option}" ${String(selected) === option ? 'selected' : ''}>${billingAccountingEscape(option)}</option>`).join('');
}

function billingAccountingTransactionStatusOptions(selected = 'completed') {
    const options = ['pending', 'completed', 'cancelled', 'failed', 'corrected'];
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
        const [
            methodsRes,
            policiesRes,
            transactionsRes,
            cashbookRes,
            refundsRes,
            carryoversRes,
            dailyRes,
            monthlyRes
        ] = await Promise.all([
            api.get('billing-accounting-foundation/payment-methods?limit=100'),
            api.get('billing-accounting-foundation/billing-policy-rules?limit=100'),
            api.get('billing-accounting-foundation/payment-transactions?limit=20'),
            api.get('billing-accounting-foundation/cashbook-entries?limit=20'),
            api.get('billing-accounting-foundation/refund-records?limit=20'),
            api.get('billing-accounting-foundation/carryover-records?limit=20'),
            api.get(`billing-accounting-foundation/daily-summaries?${summaryParams.toString()}`),
            api.get(`billing-accounting-foundation/monthly-summaries?${summaryParams.toString()}`)
        ]);

        ui.methods = Array.isArray(methodsRes?.payment_methods) ? methodsRes.payment_methods : [];
        ui.policies = Array.isArray(policiesRes?.policy_rules) ? policiesRes.policy_rules : [];
        ui.transactions = Array.isArray(transactionsRes?.transactions) ? transactionsRes.transactions : [];
        ui.cashbookEntries = Array.isArray(cashbookRes?.cashbook_entries) ? cashbookRes.cashbook_entries : [];
        ui.refunds = Array.isArray(refundsRes?.refunds) ? refundsRes.refunds : [];
        ui.carryovers = Array.isArray(carryoversRes?.carryovers) ? carryoversRes.carryovers : [];
        ui.dailySummaries = Array.isArray(dailyRes?.daily_summaries) ? dailyRes.daily_summaries : [];
        ui.monthlySummaries = Array.isArray(monthlyRes?.monthly_summaries) ? monthlyRes.monthly_summaries : [];
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

function editBillingAccountingTransaction(id) {
    const ui = getBillingAccountingFoundationState();
    const item = (ui.transactions || []).find(row => String(row.id) === String(id));
    if (!item) return;
    ui.transactionForm = {
        id: item.id || '',
        payment_id: item.payment_id || '',
        student_id: item.student_id || '',
        branch: item.branch || 'apmath',
        transaction_type: item.transaction_type || 'payment',
        method_key: item.method_key || 'card',
        amount: item.amount ?? '',
        transaction_date: item.transaction_date || '',
        status: item.status || 'completed',
        receipt_no: item.receipt_no || '',
        external_provider: item.external_provider || '',
        external_transaction_id: item.external_transaction_id || '',
        note: item.note || ''
    };
    ui.tab = 'transactions';
    renderBillingAccountingFoundationModal();
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
        method_key: item.method_key || ''
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
    const result = await api.patch(`billing-accounting-foundation/payment-transactions/${encodeURIComponent(id)}/cancel`, {});
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingRefund(id) {
    const result = await api.patch(`billing-accounting-foundation/refund-records/${encodeURIComponent(id)}/cancel`, {});
    if (result?.success) {
        toast('취소되었습니다.', 'success');
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '취소에 실패했습니다.', 'warn');
}

async function cancelBillingAccountingCarryover(id) {
    const result = await api.patch(`billing-accounting-foundation/carryover-records/${encodeURIComponent(id)}/cancel`, {});
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
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetMethodForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
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
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetPolicyForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
}

async function saveBillingAccountingTransaction() {
    const ui = getBillingAccountingFoundationState();
    const form = ui.transactionForm || {};
    const payload = {
        payment_id: (document.getElementById('baf-transaction-payment-id')?.value || '').trim(),
        student_id: (document.getElementById('baf-transaction-student-id')?.value || '').trim(),
        branch: document.getElementById('baf-transaction-branch')?.value || form.branch,
        transaction_type: document.getElementById('baf-transaction-type')?.value || form.transaction_type,
        method_key: document.getElementById('baf-transaction-method-key')?.value || form.method_key,
        amount: Number(document.getElementById('baf-transaction-amount')?.value || 0),
        transaction_date: (document.getElementById('baf-transaction-date')?.value || '').trim(),
        status: document.getElementById('baf-transaction-status')?.value || form.status,
        receipt_no: (document.getElementById('baf-transaction-receipt')?.value || '').trim(),
        external_provider: (document.getElementById('baf-transaction-provider')?.value || '').trim(),
        external_transaction_id: (document.getElementById('baf-transaction-external-id')?.value || '').trim(),
        note: (document.getElementById('baf-transaction-note')?.value || '').trim()
    };
    if (!payload.student_id || !payload.method_key || !payload.amount || !payload.transaction_date) {
        return toast('수납 거래 필수값을 입력하세요.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/payment-transactions/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/payment-transactions';
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetTransactionForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
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
        method_key: document.getElementById('baf-cashbook-method-key')?.value || ''
    };
    if (!payload.entry_date || !payload.category || !payload.amount || !payload.title) {
        return toast('출납 장부 필수값을 입력하세요.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/cashbook-entries/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/cashbook-entries';
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetCashbookForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
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
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetRefundForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
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
    if (!payload.student_id || !payload.amount || !payload.carryover_type) {
        return toast('이월 기록 필수값을 입력하세요.', 'warn');
    }
    const endpoint = form.id
        ? `billing-accounting-foundation/carryover-records/${encodeURIComponent(form.id)}`
        : 'billing-accounting-foundation/carryover-records';
    const result = form.id ? await api.patch(endpoint, payload) : await api.post(endpoint, payload);
    if (result?.success) {
        toast('저장되었습니다.', 'success');
        billingAccountingResetCarryoverForm();
        await billingAccountingFetchAll();
        return;
    }
    toast(result?.error || result?.message || '저장에 실패했습니다.', 'warn');
}

async function reloadBillingAccountingSummaries() {
    const ui = getBillingAccountingFoundationState();
    ui.branch = document.getElementById('baf-summary-branch')?.value || ui.branch;
    ui.year = Number(document.getElementById('baf-summary-year')?.value || ui.year);
    ui.month = Number(document.getElementById('baf-summary-month')?.value || ui.month);
    await billingAccountingFetchAll();
}

function renderBillingAccountingEmpty(message) {
    return `<div style="padding:24px 12px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700; background:var(--surface-2); border:1px dashed var(--border); border-radius:14px;">${billingAccountingEscape(message)}</div>`;
}

function renderBillingAccountingSimpleRows(rows, fields) {
    if (!rows.length) return renderBillingAccountingEmpty('조회 결과가 없습니다.');
    return rows.map(row => `
        <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
            ${fields.map(field => `
                <div style="display:flex; justify-content:space-between; gap:12px; margin-bottom:6px; font-size:12px; line-height:1.5;">
                    <span style="color:var(--secondary); font-weight:700;">${billingAccountingEscape(field.label)}</span>
                    <span style="color:var(--text); font-weight:700; text-align:right; word-break:break-word;">${billingAccountingEscape(field.format ? field.format(row[field.key], row) : (row[field.key] ?? '-'))}</span>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function renderBillingAccountingSummaryTab(ui) {
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
        <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; margin-bottom:12px;">
            <select id="baf-summary-branch" class="btn" style="width:100%; background:var(--surface-2); border:none;">${billingAccountingBranchOptions(ui.branch)}</select>
            <input id="baf-summary-year" class="btn" type="number" value="${billingAccountingEscape(ui.year)}" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="baf-summary-month" class="btn" type="number" min="1" max="12" value="${billingAccountingEscape(ui.month)}" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
        </div>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="reloadBillingAccountingSummaries()">조회</button>
            <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800; color:var(--primary); background:rgba(26,92,255,0.08); border:none;" onclick="billingAccountingFetchAll()">새로고침</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;">
            <div>
                <div style="font-size:13px; font-weight:800; color:var(--text); margin-bottom:8px;">일별 요약</div>
                ${dailyRows}
            </div>
            <div>
                <div style="font-size:13px; font-weight:800; color:var(--text); margin-bottom:8px;">월별 요약</div>
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
                    <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.name || item.method_key || '-')}</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:700;">${billingAccountingEscape(item.method_key || '-')} · ${billingAccountingEscape(item.category || '-')} · sort ${billingAccountingEscape(item.sort_order ?? 0)}</div>
                </div>
                <div style="font-size:11px; font-weight:800; color:${Number(item.is_active) === 0 ? 'var(--secondary)' : 'var(--success)'};">${Number(item.is_active) === 0 ? '비활성화' : '사용중'}</div>
            </div>
            <div style="font-size:12px; color:var(--secondary); margin-bottom:10px; line-height:1.5;">${billingAccountingEscape(item.memo || '메모 없음')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingMethod('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; color:var(--warning); background:rgba(245,159,0,0.12); border:none;" onclick="toggleBillingAccountingMethodActive('${billingAccountingEscape(item.id)}', ${Number(item.is_active) === 0 ? 1 : 0})">${Number(item.is_active) === 0 ? '저장' : '비활성화'}</button>
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
            <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingMethod()">저장</button>
            <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetMethodForm(); renderBillingAccountingFoundationModal();">초기화</button>
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
                    <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.name || item.rule_key || '-')}</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:700;">${billingAccountingEscape(item.branch || 'all')} · ${billingAccountingEscape(item.rule_type || '-')} · ${billingAccountingEscape(item.rule_key || '-')}</div>
                </div>
                <div style="font-size:11px; font-weight:800; color:${Number(item.is_active) === 0 ? 'var(--secondary)' : 'var(--success)'};">${Number(item.is_active) === 0 ? '비활성화' : '사용중'}</div>
            </div>
            <pre style="margin:0 0 10px 0; padding:10px; background:var(--surface-2); border-radius:12px; font-size:11px; line-height:1.5; color:var(--text); white-space:pre-wrap; word-break:break-word;">${billingAccountingEscape(billingAccountingFormatJsonForEditor(item.value_json))}</pre>
            <div style="font-size:12px; color:var(--secondary); margin-bottom:10px; line-height:1.5;">${billingAccountingEscape(item.memo || '메모 없음')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingPolicy('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; color:var(--warning); background:rgba(245,159,0,0.12); border:none;" onclick="toggleBillingAccountingPolicyActive('${billingAccountingEscape(item.id)}', ${Number(item.is_active) === 0 ? 1 : 0})">${Number(item.is_active) === 0 ? '저장' : '비활성화'}</button>
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
            <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingPolicy()">저장</button>
            <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetPolicyForm(); renderBillingAccountingFoundationModal();">초기화</button>
        </div>
        <div>${rows || renderBillingAccountingEmpty('수납 정책이 없습니다.')}</div>
    `;
}

function renderBillingAccountingListTab(ui, tab) {
    if (tab === 'transactions') {
        const form = ui.transactionForm || {};
        const list = renderBillingAccountingSimpleRows(ui.transactions || [], [
            { key: 'transaction_date', label: '일자' },
            { key: 'student_id', label: 'student_id' },
            { key: 'branch', label: 'branch' },
            { key: 'method_key', label: '결제수단' },
            { key: 'amount', label: '금액', format: value => billingAccountingFormatAmount(value) },
            { key: 'status', label: 'status' }
        ]);
        const rows = (ui.transactions || []).map(item => `
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
                <div style="display:flex; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div>
                        <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.student_id || '-')} · ${billingAccountingFormatAmount(item.amount)}</div>
                        <div style="font-size:11px; color:var(--secondary); font-weight:700;">${billingAccountingEscape(item.transaction_date || '-')} · ${billingAccountingEscape(item.transaction_type || '-')} · ${billingAccountingEscape(item.status || '-')}</div>
                    </div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingTransaction('${billingAccountingEscape(item.id)}')">수정</button>
                    <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; color:var(--error); background:rgba(255,71,87,0.08); border:none;" onclick="cancelBillingAccountingTransaction('${billingAccountingEscape(item.id)}')">취소</button>
                </div>
            </div>
        `).join('');
        return `
            <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; margin-bottom:8px;">
                <input id="baf-transaction-student-id" class="btn" value="${billingAccountingEscape(form.student_id)}" placeholder="student_id" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-transaction-payment-id" class="btn" value="${billingAccountingEscape(form.payment_id)}" placeholder="payment_id" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-transaction-branch" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingBranchOptions(form.branch)}</select>
                <select id="baf-transaction-type" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingTransactionTypeOptions(form.transaction_type)}</select>
                <select id="baf-transaction-method-key" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingMethodKeyOptions(form.method_key)}</select>
                <input id="baf-transaction-amount" class="btn" type="number" value="${billingAccountingEscape(form.amount)}" placeholder="amount" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-transaction-date" class="btn" type="date" value="${billingAccountingEscape(form.transaction_date)}" style="text-align:left; background:var(--surface-2); border:none;">
                <select id="baf-transaction-status" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingTransactionStatusOptions(form.status)}</select>
                <input id="baf-transaction-receipt" class="btn" value="${billingAccountingEscape(form.receipt_no)}" placeholder="receipt_no" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-transaction-provider" class="btn" value="${billingAccountingEscape(form.external_provider)}" placeholder="external_provider" style="text-align:left; background:var(--surface-2); border:none;">
                <input id="baf-transaction-external-id" class="btn" value="${billingAccountingEscape(form.external_transaction_id)}" placeholder="external_transaction_id" style="text-align:left; background:var(--surface-2); border:none;">
                <div></div>
            </div>
            <textarea id="baf-transaction-note" class="btn" placeholder="note" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.note)}</textarea>
            <div style="display:flex; gap:8px; margin-bottom:14px;">
                <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingTransaction()">저장</button>
                <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetTransactionForm(); renderBillingAccountingFoundationModal();">초기화</button>
            </div>
            <div>${rows || list}</div>
        `;
    }
    if (tab === 'cashbook') {
        const form = ui.cashbookForm || {};
        const rows = (ui.cashbookEntries || []).map(item => `
            <div style="padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface); margin-bottom:8px;">
                <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.title || '-')} · ${billingAccountingFormatAmount(item.amount)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:8px;">${billingAccountingEscape(item.entry_date || '-')} · ${billingAccountingEscape(item.entry_type || '-')} · ${billingAccountingEscape(item.category || '-')}</div>
                <button class="btn" style="width:100%; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingCashbook('${billingAccountingEscape(item.id)}')">수정</button>
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
                <div></div>
            </div>
            <textarea id="baf-cashbook-description" class="btn" placeholder="description" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.description)}</textarea>
            <div style="display:flex; gap:8px; margin-bottom:6px;">
                <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingCashbook()">저장</button>
                <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetCashbookForm(); renderBillingAccountingFoundationModal();">초기화</button>
            </div>
            <div style="font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5; margin-bottom:12px;">출납 장부 취소/비활성화는 status/is_active schema 보강 후 가능합니다.</div>
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
                <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.student_id || '-')} · ${billingAccountingFormatAmount(item.refund_amount)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:8px;">${billingAccountingEscape(item.refund_date || '-')} · ${billingAccountingEscape(item.status || '-')}</div>
                <div style="display:flex; gap:8px;">
                    <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingRefund('${billingAccountingEscape(item.id)}')">수정</button>
                    <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; color:var(--error); background:rgba(255,71,87,0.08); border:none;" onclick="cancelBillingAccountingRefund('${billingAccountingEscape(item.id)}')">취소</button>
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
                <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingRefund()">저장</button>
                <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetRefundForm(); renderBillingAccountingFoundationModal();">초기화</button>
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
            <div style="font-size:13px; font-weight:800; color:var(--text);">${billingAccountingEscape(item.student_id || '-')} · ${billingAccountingFormatAmount(item.amount)}</div>
            <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:8px;">${billingAccountingEscape(item.carryover_type || '-')} · ${billingAccountingEscape(item.status || '-')}</div>
            <div style="display:flex; gap:8px;">
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800;" onclick="editBillingAccountingCarryover('${billingAccountingEscape(item.id)}')">수정</button>
                <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; color:var(--error); background:rgba(255,71,87,0.08); border:none;" onclick="cancelBillingAccountingCarryover('${billingAccountingEscape(item.id)}')">취소</button>
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
            <input id="baf-carryover-type" class="btn" value="${billingAccountingEscape(form.carryover_type)}" placeholder="carryover_type" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="baf-carryover-status" class="btn" style="background:var(--surface-2); border:none;">${billingAccountingCarryoverStatusOptions(form.status)}</select>
            <div></div>
        </div>
        <textarea id="baf-carryover-reason" class="btn" placeholder="reason" style="width:100%; min-height:72px; text-align:left; background:var(--surface-2); border:none; padding:12px; margin-bottom:8px;">${billingAccountingEscape(form.reason)}</textarea>
        <div style="display:flex; gap:8px; margin-bottom:14px;">
            <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="saveBillingAccountingCarryover()">저장</button>
            <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="billingAccountingResetCarryoverForm(); renderBillingAccountingFoundationModal();">초기화</button>
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

function renderBillingAccountingFoundationModal() {
    const ui = getBillingAccountingFoundationState();
    const tabs = [
        { key: 'summary', label: '일별 요약 / 월별 요약' },
        { key: 'methods', label: '결제수단' },
        { key: 'policies', label: '수납 정책' },
        { key: 'transactions', label: '수납 거래' },
        { key: 'cashbook', label: '출납 장부' },
        { key: 'refunds', label: '환불 기록' },
        { key: 'carryovers', label: '이월 기록' }
    ];

    const tabButtons = tabs.map(tab => `
        <button class="btn" style="padding:9px 12px; border-radius:10px; border:none; font-size:12px; font-weight:800; background:${ui.tab === tab.key ? 'var(--surface)' : 'transparent'}; color:${ui.tab === tab.key ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${ui.tab === tab.key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'};" onclick="setBillingAccountingFoundationTab('${tab.key}')">${billingAccountingEscape(tab.label)}</button>
    `).join('');

    let body = '';
    if (ui.loading) {
        body = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">불러오는 중...</div>`;
    } else if (ui.tab === 'summary') {
        body = renderBillingAccountingSummaryTab(ui);
    } else if (ui.tab === 'methods') {
        body = renderBillingAccountingMethodsTab(ui);
    } else if (ui.tab === 'policies') {
        body = renderBillingAccountingPoliciesTab(ui);
    } else {
        body = renderBillingAccountingListTab(ui, ui.tab);
    }

    showModal('수납·출납 foundation', `
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px; background:var(--surface-2); padding:4px; border-radius:12px;">
            ${tabButtons}
        </div>
        ${ui.error ? `<div style="margin-bottom:12px; padding:10px 12px; border-radius:12px; background:rgba(255,71,87,0.08); color:var(--error); font-size:12px; font-weight:700;">${billingAccountingEscape(ui.error)}</div>` : ''}
        <div style="font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5; margin-bottom:12px;">실제 수납 등록, 환불 처리, 이월 처리, 장부 자동 반영은 이번 단계에서 연결하지 않습니다.</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${body}</div>
    `);
}

async function openBillingAccountingFoundationModal() {
    const ui = getBillingAccountingFoundationState();
    ui.tab = ui.tab || 'summary';
    renderBillingAccountingFoundationModal();
    await billingAccountingFetchAll();
}
