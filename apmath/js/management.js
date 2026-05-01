/**
 * AP Math OS 1.0 [js/management.js]
 * Split from dashboard.js.
 */

function renderAddressBookList() {
    const search = document.getElementById('ab-search').value.trim().toLowerCase();
    const cid = document.getElementById('ab-class').value;
    const listRoot = document.getElementById('ab-list');
    
    let stds = state.db.students.filter(s => s.status === '재원');
    if (search) stds = stds.filter(s => s.name.toLowerCase().includes(search));
    if (cid) {
        const cIds = state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
        stds = stds.filter(s => cIds.includes(s.id));
    }
    
    if (stds.length === 0) {
        listRoot.innerHTML = `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px;">검색 결과가 없습니다.</div>`;
        return;
    }
    
    listRoot.innerHTML = stds.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:14px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div><b style="font-size:14px; color:var(--text);">${apEscapeHtml(s.name)}</b> <span style="color:var(--secondary); font-size:12px; margin-left:6px;">${apEscapeHtml(cName)} | ${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <button class="btn" style="padding:6px 12px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.1); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">프로필</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; background:var(--surface-2); padding:8px 12px; border-radius:8px;">
                        <span>학생: ${apEscapeHtml(s.student_phone || '없음')}</span>
                        ${s.student_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.student_phone}')">복사</span>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; background:var(--surface-2); padding:8px 12px; border-radius:8px;">
                        <span>보호자(${apEscapeHtml(s.guardian_relation || '미지정')}): ${apEscapeHtml(s.parent_phone || '없음')}</span>
                        ${s.parent_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.parent_phone}')">복사</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    const classOptions = state.db.classes.filter(c => Number(c.is_active) !== 0).map(c => `<option value="${c.id}">${apEscapeHtml(c.name)}</option>`).join('');
    showModal('학생관리', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn" style="padding:10px; flex:1; font-size:12px;" onclick="closeModal(); openAddStudent();">학생 추가</button>
            <button class="btn" style="padding:10px; flex:1; font-size:12px; color:var(--primary); background:rgba(26,92,255,0.1); border:none;" onclick="closeModal(); openGlobalPinManagement()">PIN관리</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="width:100%; text-align:left; background:var(--surface-2); border:none;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="width:100%; background:var(--surface-2); border:none;" onchange="renderAddressBookList()"><option value="">전체 학급</option>${classOptions}</select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px; padding-right:4px;"></div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    const classes = state.db.classes.filter(c => Number(c.is_active) !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px; border:1px solid var(--border); background:var(--surface);" onclick="if(typeof handleBatchGeneratePins==='function') handleBatchGeneratePins('${c.id}'); else toast('해당 기능은 학생관리 모듈에 있습니다.', 'warn');">
            <span style="font-weight:900; font-size:14px; color:var(--text);">${apEscapeHtml(c.name)}</span>
            <span style="font-size:11px; color:var(--primary); font-weight:700; background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px;">일괄 생성</span>
        </button>
    `).join('');
    
    showModal('PIN관리', `
        <div style="margin-bottom:16px; font-size:12px; color:var(--secondary); line-height:1.5; background:var(--surface-2); padding:12px; border-radius:10px;">선택한 반에 속한 학생 중, <b>아직 PIN 번호가 없는 학생</b>들에게만 고유 PIN을 자동 부여합니다. (기존 PIN은 유지됨)</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${rows || `<div style="text-align:center; color:var(--secondary); padding:20px; font-size:13px;">관리할 반이 없습니다.</div>`}</div>
    `);
}

function formatClassScheduleDaysForUI(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

function openClassManageModal() {
    const activeClasses = state.db.classes.filter(c => Number(c.is_active) !== 0);
    const hiddenClasses = state.db.classes.filter(c => Number(c.is_active) === 0);

    const renderClassRow = (c) => `
        <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1; cursor:pointer; padding-right:10px;" onclick="closeModal(); state.ui.currentClassId='${c.id}'; if(typeof renderClass==='function') renderClass('${c.id}');">
                <div style="font-weight:900; font-size:14px; color:${Number(c.is_active)===0?'var(--secondary)':'var(--text)'};">
                    ${apEscapeHtml(c.name)} <span style="font-size:11px; font-weight:normal; color:var(--secondary); margin-left:4px;">${apEscapeHtml(c.grade)}</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); margin-top:4px;">담당: ${apEscapeHtml(c.teacher_name)} | 요일: ${formatClassScheduleDaysForUI(c.schedule_days)}</div>
                ${c.textbook ? `<div style="font-size:11px; color:var(--secondary); margin-top:2px;">기존교재: ${apEscapeHtml(c.textbook)}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${Number(c.is_active) === 0
                  ? `<button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                  : `<button class="btn" style="padding:6px 10px; font-size:11px; color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
            </div>
        </div>
    `;

    showModal('학급관리', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <button class="btn" style="padding:10px 14px; font-size:12px; color:var(--primary); background:rgba(26,92,255,0.1); border:none; font-weight:700;" onclick="closeModal(); openTextbookManageModal();">교재 관리</button>
            <button class="btn btn-primary" style="padding:10px 14px; font-size:12px; font-weight:700;" onclick="openAddClassModal()">새 반 추가</button>
        </div>
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">활성 반 (${activeClasses.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeClasses.length ? activeClasses.map(renderClassRow).join('') : `<div style="font-size:12px; color:var(--secondary);">활성 반이 없습니다.</div>`}
        </div>
        ${hiddenClasses.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">숨김 반 (${hiddenClasses.length})</h4>
            <div style="opacity:0.7;">
                ${hiddenClasses.map(renderClassRow).join('')}
            </div>
        ` : ''}
    `);
}

function openAddClassModal() {
    showModal('새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="add-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="add-cls-teacher" class="btn" value="${apEscapeHtml(state.ui.userName || '박준성')}" placeholder="담당 교사" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="add-cls-textbook" class="btn" placeholder="기존 교재(호환용)" style="text-align:left; background:var(--surface-2); border:none;">
            
            <label style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
            </div>
        </div>
    `, '추가', handleAddClass);
}

async function handleAddClass() {
    const name = document.getElementById('add-cls-name').value.trim();
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }

    const grade = document.getElementById('add-cls-grade').value;
    const subject = document.getElementById('add-cls-subject').value.trim();
    const teacher_name = document.getElementById('add-cls-teacher').value.trim() || state.ui.userName || '박준성';
    const textbook = document.getElementById('add-cls-textbook').value.trim();
    const schedule_days = Array.from(document.querySelectorAll('.add-cls-days:checked')).map(e => e.value).join(',');

    const payload = {
        name,
        grade,
        subject,
        teacher_name,
        schedule_days,
        textbook,
        is_active: 1
    };

    const r = await api.post('classes', payload);

    if (r.success) {
        toast('새 반이 추가되었습니다.', 'success');
        state.ui.currentClassId = null;
        await loadData();
        openClassManageModal();
    } else {
        toast(r.message || r.error || '반 추가에 실패했습니다.', 'error');
    }
}

function openEditClassModal(cid) {
    const c = state.db.classes.find(x => x.id === cid);
    const selectedDays = c.schedule_days ? c.schedule_days.split(',') : [];
    showModal('반 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-cls-name" class="btn" value="${apEscapeHtml(c.name)}" placeholder="반 이름" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="edit-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                ${['중1','중2','중3','고1','고2','고3'].map(g => `<option value="${g}" ${c.grade===g?'selected':''}>${g}</option>`).join('')}
            </select>
            <input id="edit-cls-subject" class="btn" value="${apEscapeHtml(c.subject||'')}" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="edit-cls-teacher" class="btn" value="${apEscapeHtml(c.teacher_name||'')}" placeholder="담당 교사" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="edit-cls-textbook" class="btn" value="${apEscapeHtml(c.textbook || '')}" placeholder="기존 교재(호환용)" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="font-size:11px; color:var(--secondary);">※ 다중 교재 관리는 '교재 관리' 메뉴를 이용하세요.</div>
            
            <label style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
            </div>
        </div>
    `, '저장', () => handleEditClass(cid));
}

async function handleEditClass(cid) {
    const c = state.db.classes.find(x => x.id === cid);
    const name = document.getElementById('edit-cls-name').value.trim();
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    const grade = document.getElementById('edit-cls-grade').value;
    const subject = document.getElementById('edit-cls-subject').value.trim();
    const teacher_name = document.getElementById('edit-cls-teacher').value.trim();
    const textbook = document.getElementById('edit-cls-textbook').value.trim();
    const schedule_days = Array.from(document.querySelectorAll('.edit-cls-days:checked')).map(e => e.value).join(',');
    const payload = { name, grade, subject, teacher_name, schedule_days, textbook, is_active: c.is_active !== undefined ? Number(c.is_active) : 1 };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast('반 정보가 수정되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

async function toggleClassActive(cid, status) {
    if (!confirm(status === 0 ? '이 반을 숨김 처리하시겠습니까?' : '이 반을 복구하시겠습니까?')) return;
    const c = state.db.classes.find(x => x.id === cid);
    const payload = { name: c.name, grade: c.grade, subject: c.subject, teacher_name: c.teacher_name, schedule_days: c.schedule_days, textbook: c.textbook || '', is_active: status };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast(status === 0 ? '숨김 처리되었습니다.' : '복구되었습니다.', 'info'); await loadData(); openClassManageModal(); }
}
