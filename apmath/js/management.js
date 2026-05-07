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