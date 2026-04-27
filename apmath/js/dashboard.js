/**
 * AP Math OS v26.1.2 [js/dashboard.js]
 * 대시보드 계산, 렌더링 및 학원 운영 메뉴 엔진 (4D 최종 보정: 문구 수정 및 일정/메모 수정 기능 추가)
 */

function copyPhoneNumber(text) {
    navigator.clipboard.writeText(text).then(() => toast('전화번호가 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

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
        listRoot.innerHTML = '<div style="text-align:center; padding:20px; color:var(--secondary);">검색 결과가 없습니다.</div>';
        return;
    }
    
    listRoot.innerHTML = stds.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:12px 4px; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div><b style="font-size:15px;">${s.name}</b> <span style="color:var(--secondary); font-size:12px;">${cName} | ${s.school_name} ${s.grade}</span></div>
                    <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--primary);" onclick="closeModal(); renderStudentDetail('${s.id}')">상세 ➔</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:12px; color:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; background:#f8f9fa; padding:6px 10px; border-radius:6px;">
                        <span>학생: ${s.student_phone || '없음'}</span>
                        ${s.student_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.student_phone}')">복사</span>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; background:#f8f9fa; padding:6px 10px; border-radius:6px;">
                        <span>보호자(${s.guardian_relation || '미지정'}): ${s.parent_phone || '없음'}</span>
                        ${s.parent_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.parent_phone}')">복사</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    showModal('📒 주소록', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="flex:1; text-align:left;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="flex:1;" onchange="renderAddressBookList()">
                <option value="">전체 반 (활성)</option>
                ${classOptions}
            </select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px;">
        </div>
    `);
    renderAddressBookList();
}

function formatClassScheduleDaysForUI(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

function openClassManageModal() {
    const activeClasses = state.db.classes.filter(c => c.is_active !== 0);
    const hiddenClasses = state.db.classes.filter(c => c.is_active === 0);

    const renderClassRow = (c) => `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-weight:bold; font-size:14px; color:${c.is_active===0?'var(--secondary)':'var(--primary)'};">
                    ${c.name} <span style="font-size:11px; font-weight:normal; color:var(--secondary);">(${c.grade})</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); margin-top:4px;">담당: ${c.teacher_name} | 요일: ${formatClassScheduleDaysForUI(c.schedule_days)}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${c.is_active === 0
                  ? `<button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                  : `<button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
            </div>
        </div>
    `;

    showModal('🏫 반 관리', `
        <div style="display:flex; justify-content:flex-end; margin-bottom:12px;">
            <button class="btn btn-primary" style="padding:8px 14px;" onclick="openAddClassModal()">➕ 새 반 추가</button>
        </div>
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--primary);">활성 반 (${activeClasses.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeClasses.length ? activeClasses.map(renderClassRow).join('') : '<div style="font-size:12px; color:var(--secondary);">활성 반이 없습니다.</div>'}
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
    showModal('➕ 새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left;">
            <select id="add-cls-grade" class="btn">
                <option value="중1">중1</option>
                <option value="중2">중2</option>
                <option value="중3">중3</option>
                <option value="고1">고1</option>
                <option value="고2">고2</option>
                <option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left;">
            <input id="add-cls-teacher" class="btn" value="박준성" placeholder="담당 교사" style="text-align:left;">
            
            <label style="font-size:12px; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
            </div>
        </div>
    `, '추가', handleAddClass);
}

async function handleAddClass() {
    const name = document.getElementById('add-cls-name').value.trim();
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    const grade = document.getElementById('add-cls-grade').value;
    const subject = document.getElementById('add-cls-subject').value.trim();
    const teacher_name = document.getElementById('add-cls-teacher').value.trim();
    const schedule_days = Array.from(document.querySelectorAll('.add-cls-days:checked')).map(e => e.value).join(',');
    const r = await api.post('classes', { name, grade, subject, teacher_name, schedule_days });
    if (r.success) { toast('새 반이 추가되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

function openEditClassModal(cid) {
    const c = state.db.classes.find(x => x.id === cid);
    const selectedDays = c.schedule_days ? c.schedule_days.split(',') : [];
    showModal('반 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-cls-name" class="btn" value="${c.name}" placeholder="반 이름" style="text-align:left;">
            <select id="edit-cls-grade" class="btn">
                ${['중1','중2','중3','고1','고2','고3'].map(g => `<option value="${g}" ${c.grade===g?'selected':''}>${g}</option>`).join('')}
            </select>
            <input id="edit-cls-subject" class="btn" value="${c.subject||''}" placeholder="과목" style="text-align:left;">
            <input id="edit-cls-teacher" class="btn" value="${c.teacher_name||''}" placeholder="담당 교사" style="text-align:left;">
            <label style="font-size:12px; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
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
    const schedule_days = Array.from(document.querySelectorAll('.edit-cls-days:checked')).map(e => e.value).join(',');
    const payload = { name, grade, subject, teacher_name, schedule_days, is_active: c.is_active !== undefined ? c.is_active : 1 };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast('반 정보가 수정되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

async function toggleClassActive(cid, status) {
    if (!confirm(status === 0 ? '이 반을 숨김 처리하시겠습니까?' : '이 반을 복구하시겠습니까?')) return;
    const c = state.db.classes.find(x => x.id === cid);
    const payload = { name: c.name, grade: c.grade, subject: c.subject, teacher_name: c.teacher_name, schedule_days: c.schedule_days, is_active: status };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast(status === 0 ? '숨김 처리되었습니다.' : '복구되었습니다.', 'info'); await loadData(); openClassManageModal(); }
}

// 4D: 할 일 메모 관리 모달
function openTodoMemoModal() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const memos = state.db.operation_memos || [];
    
    const memoRows = memos.map(m => `
        <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; ${m.is_done ? 'opacity:0.5;' : ''}">
            <div style="flex:1;">
                <div style="font-size:11px; color:var(--secondary); margin-bottom:4px;">${m.memo_date} ${m.is_pinned ? '<span style="color:var(--primary); font-weight:bold;">📌 고정</span>' : ''}</div>
                <div style="font-size:14px; text-decoration:${m.is_done ? 'line-through' : 'none'};">${m.content}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn ${m.is_done ? '' : 'btn-primary'}" style="padding:4px 8px; font-size:11px;" onclick="toggleMemoDone('${m.id}', ${!m.is_done})">${m.is_done ? '취소' : '완료'}</button>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditTodoMemoModal('${m.id}')">수정</button>
                <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="deleteMemo('${m.id}')">삭제</button>
            </div>
        </div>
    `).join('');

    showModal('📝 할 일 메모', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1;">
                <label style="font-size:13px; display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="new-memo-pin"> 📌 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="할 일 입력 (예: 고2 시험대비 직전보강)" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:40vh; overflow-y:auto;">
            ${memos.length ? memoRows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">등록된 할 일이 없습니다.</div>'}
        </div>
    `);
}

async function addTodoMemo() {
    const d = document.getElementById('new-memo-date').value;
    const c = document.getElementById('new-memo-content').value.trim();
    const p = document.getElementById('new-memo-pin').checked;
    if(!c) return toast('내용을 입력하세요', 'warn');
    const r = await api.post('operation-memos', { memoDate: d, content: c, isPinned: p });
    if(r.success) { await loadData(); openTodoMemoModal(); }
}

async function toggleMemoDone(id, done) {
    const m = state.db.operation_memos.find(x => x.id === id);
    const r = await api.patch(`operation-memos/${id}`, { memoDate: m.memo_date, content: m.content, isPinned: m.is_pinned, isDone: done });
    if(r.success) { 
        await loadData(); 
        if(document.getElementById('new-memo-content') || document.getElementById('edit-memo-content')) openTodoMemoModal(); 
        else renderDashboard();
    }
}

async function deleteMemo(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('operation-memos', id);
    if(r.success) { await loadData(); openTodoMemoModal(); }
}

// 4D: 할 일 메모 수정 기능
function openEditTodoMemoModal(id) {
    const m = state.db.operation_memos.find(x => x.id === id);
    if(!m) return;
    showModal('📝 할 일 메모 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="edit-memo-date" class="btn" value="${m.memo_date}" style="text-align:left; flex:1;">
                <label style="font-size:13px; display:flex; align-items:center; gap:4px; white-space:nowrap;">
                    <input type="checkbox" id="edit-memo-pin" ${m.is_pinned ? 'checked' : ''}> 📌 고정
                </label>
            </div>
            <input type="text" id="edit-memo-content" class="btn" value="${m.content}" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="handleEditTodoMemo('${id}')">수정 저장</button>
            <button class="btn" style="padding:8px; font-size:12px;" onclick="openTodoMemoModal()">취소 및 목록으로</button>
        </div>
    `);
}

async function handleEditTodoMemo(id) {
    const m = state.db.operation_memos.find(x => x.id === id);
    if (!m) return;
    const d = document.getElementById('edit-memo-date').value;
    const c = document.getElementById('edit-memo-content').value.trim();
    const p = document.getElementById('edit-memo-pin').checked;
    if(!c) return toast('내용을 입력하세요', 'warn');
    
    const r = await api.patch('operation-memos/' + id, { memoDate: d, content: c, isPinned: p, isDone: m.is_done === 1 });
    if(r.success) { 
        toast('메모가 수정되었습니다.', 'info');
        await loadData(); 
        openTodoMemoModal(); 
    } else {
        toast('메모 수정 실패', 'error');
    }
}

// 4D: 시험일정 보드 모달
function openExamScheduleModal() {
    const schedules = state.db.exam_schedules || [];
    const rows = schedules.map(e => `
        <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:11px; color:var(--secondary); margin-bottom:4px;">${e.exam_date} | ${e.school_name} ${e.grade}</div>
                <div style="font-size:14px; font-weight:bold;">${e.exam_name}</div>
                ${e.memo ? `<div style="font-size:12px; color:var(--secondary); margin-top:2px;">${e.memo}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditExamScheduleModal('${e.id}')">수정</button>
                <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="deleteExamSchedule('${e.id}')">삭제</button>
            </div>
        </div>
    `).join('');

    showModal('📅 시험일정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-school" class="btn" placeholder="학교명" style="flex:1; text-align:left;">
                <select id="new-ex-grade" class="btn" style="flex:1;">
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-name" class="btn" placeholder="시험명 (예: 기말고사)" style="flex:1; text-align:left;">
                <input type="date" id="new-ex-date" class="btn" style="flex:1;">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="메모 (선택)" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="addExamSchedule()">저장</button>
        </div>
        <div style="max-height:40vh; overflow-y:auto;">
            ${schedules.length ? rows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">등록된 시험일정이 없습니다.</div>'}
        </div>
    `);
}

async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school').value.trim();
    const gr = document.getElementById('new-ex-grade').value;
    const na = document.getElementById('new-ex-name').value.trim();
    const da = document.getElementById('new-ex-date').value;
    const me = document.getElementById('new-ex-memo').value.trim();
    if(!sc || !na || !da) return toast('필수 항목을 입력하세요', 'warn');
    const r = await api.post('exam-schedules', { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

async function deleteExamSchedule(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('exam-schedules', id);
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

// 4D: 시험일정 수정 기능
function openEditExamScheduleModal(id) {
    const e = state.db.exam_schedules.find(x => x.id === id);
    if(!e) return;
    showModal('📅 시험일정 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-school" class="btn" value="${e.school_name}" style="flex:1; text-align:left;">
                <select id="edit-ex-grade" class="btn" style="flex:1;">
                    <option value="중1" ${e.grade==='중1'?'selected':''}>중1</option>
                    <option value="중2" ${e.grade==='중2'?'selected':''}>중2</option>
                    <option value="중3" ${e.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${e.grade==='고1'?'selected':''}>고1</option>
                    <option value="고2" ${e.grade==='고2'?'selected':''}>고2</option>
                    <option value="고3" ${e.grade==='고3'?'selected':''}>고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-name" class="btn" value="${e.exam_name}" style="flex:1; text-align:left;">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="flex:1;">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${e.memo||''}" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
            <button class="btn" style="padding:8px; font-size:12px;" onclick="openExamScheduleModal()">취소 및 목록으로</button>
        </div>
    `);
}

async function handleEditExamSchedule(id) {
    const sc = document.getElementById('edit-ex-school').value.trim();
    const gr = document.getElementById('edit-ex-grade').value;
    const na = document.getElementById('edit-ex-name').value.trim();
    const da = document.getElementById('edit-ex-date').value;
    const me = document.getElementById('edit-ex-memo').value.trim();
    if(!sc || !na || !da) return toast('필수 항목을 입력하세요', 'warn');
    
    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { 
        toast('시험일정이 수정되었습니다.', 'info');
        await loadData(); 
        openExamScheduleModal(); 
    } else {
        toast('시험일정 수정 실패', 'error');
    }
}

/**
 * 4D: 운영 메뉴 순서 (할 일 메모, 시험일정 추가)
 */
function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = syncQueue.length;
    const syncStatusText = qLen > 0 ? `⚠️ 대기 중 ${qLen}건` : "✅ 대기 없음";
    const onlineStatusText = isOnline ? "🟢 온라인" : "🔴 오프라인";

    showModal('⚙️ 학원 운영 관리', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="padding-bottom:16px; border-bottom:1px solid var(--border);">
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">운영 및 관리 메뉴</label>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openClassManageModal();">🏫 반 관리 (추가/수정/숨김/요일)</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAddStudent();">👤 학생 추가</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAddressBook();">📒 주소록 (연락처 조회)</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openTodoMemoModal();">📝 할 일 메모</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openExamScheduleModal();">📅 시험일정</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openDischargedStudents();">🗄️ 퇴원생 조회/복구</button>
                </div>
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">시스템 및 동기화 상태</label>
                <div class="card" style="margin:0; padding:12px; background:#f8f9fa; border-style:dashed;">
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;"><span>네트워크:</span><b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b></div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:12px;"><span>미전송 데이터:</span><b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b></div>
                    <button class="btn btn-primary" style="width:100%; font-size:12px; padding:8px;" onclick="processSyncQueue(); closeModal();">🔄 지금 동기화 시도</button>
                </div>
            </div>
        </div>
    `);
}

function isClassScheduledToday(clsId) {
    const cls = state.db.classes.find(c => c.id === clsId);
    if (!cls || !cls.schedule_days) return true;
    const todayIdx = String(new Date().getDay());
    return cls.schedule_days.split(',').includes(todayIdx);
}

function computeDashboardData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    
    const scheduledActiveStudents = activeStudents.filter(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && cls.is_active === 0) return false;
        return isClassScheduledToday(cid);
    });
    
    const scheduledIds = new Set(scheduledActiveStudents.map(s => s.id));
    const scheduledAtt = state.db.attendance.filter(a => a.date === today && scheduledIds.has(a.student_id));
    const presentCount = scheduledAtt.filter(a => a.status === '등원').length;
    const absentCount = scheduledAtt.filter(a => a.status === '결석').length;
    
    // 4D: 숙제 미처리는 오늘 수업 대상 중 오늘 완료가 아닌 학생 수
    const scheduledHw = state.db.homework.filter(h => h.date === today && scheduledIds.has(h.student_id));
    const hwDoneCount = scheduledHw.filter(h => h.status === '완료').length;
    const hwNotDoneCount = Math.max(scheduledActiveStudents.length - hwDoneCount, 0);

    // 4D: 할 일 카드 미완료/오늘+고정 개수
    const todoCount = state.db.operation_memos.filter(m => m.is_done !== 1 && (m.is_pinned === 1 || m.memo_date === today)).length;

    const classSummaries = {};
    state.db.classes.filter(c => c.is_active !== 0).forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id);
        const cActiveIds = activeStudents.filter(s => cIds.includes(s.id)).map(s => s.id);
        let cMiss=0, cAbs=0, cPre=0;
        cActiveIds.forEach(id => {
            const att = state.db.attendance.find(a => a.student_id===id && a.date===today);
            if (att?.status==='등원') cPre++; if (att?.status==='결석') cAbs++;
            if (state.db.homework.find(h => h.student_id===id && h.date===today)?.status !== '완료') cMiss++;
        });
        classSummaries[c.id] = { activeCount: cActiveIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, isScheduled: isClassScheduledToday(c.id) };
    });

    return { 
        global: { 
            totalActive: activeStudents.length, 
            scheduledActive: scheduledActiveStudents.length, 
            presentCount, 
            absentCount, 
            hwNotDoneCount,
            todoCount
        }, 
        classSummaries 
    };
}

function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id]; if (!s) return '';
    const n = s.activeCount || 1;
    const attRate = Math.round((s.present / n) * 100);
    const hwRate = Math.round(((n - s.hwNotDone) / n) * 100);
    
    if (!s.isScheduled) {
        return `
            <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 120px; padding: 16px; opacity:0.8;">
                <div>
                    <div style="font-weight:800; font-size:17px; display:flex; justify-content:space-between;">
                        ${cls.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary);">재원 ${s.activeCount}</span>
                    </div>
                </div>
                <div style="margin-top:16px; font-size:13px; color:var(--secondary); text-align:center; background:#f8f9fa; padding:8px; border-radius:6px;">
                    오늘 수업 없음
                </div>
            </div>
        `;
    }

    return `
        <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 120px; padding: 16px;">
            <div>
                <div style="font-weight:800; font-size:17px; display:flex; justify-content:space-between;">
                    ${cls.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary);">재원 ${s.activeCount}</span>
                </div>
                <div style="font-size:13px; color:var(--secondary); margin-top:6px;">
                    등원 ${s.present} <span style="opacity:0.3;">|</span> <span style="color:${s.absent > 0 ? 'var(--error)' : 'inherit'}; font-weight:${s.absent > 0 ? '700' : 'normal'};">결석 ${s.absent}</span>
                </div>
            </div>
            <div style="display:flex; gap:6px; margin-top:10px;">
                <span style="background:${s.hwNotDone > 0 ? '#fef7e0' : '#f1f3f4'}; color:${s.hwNotDone > 0 ? '#b06000' : '#5f6368'}; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">숙제 ${s.hwNotDone}</span>
            </div>
            <div style="margin-top:8px; font-size:11px; color:var(--secondary); opacity:0.75;">
                출석 ${attRate}% · 숙제 ${hwRate}%
            </div>
        </div>
    `;
}

/**
 * 4D: 할 일 및 시험일정 섹션 렌더링
 */
function renderTodoSections() {
    const today = new Date();
    // KST 변환 보정 필요 시 (현행 날짜 문자열 체계 사용)
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekStr = nextWeek.toLocaleDateString('sv-SE');

    const todayMemos = state.db.operation_memos.filter(m => m.is_done !== 1 && (m.is_pinned === 1 || m.memo_date === todayStr));
    const upcomingMemos = state.db.operation_memos.filter(m => m.is_done !== 1 && m.is_pinned !== 1 && m.memo_date > todayStr && m.memo_date <= nextWeekStr);
    const upcomingExams = state.db.exam_schedules.filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr);

    let todayHtml = todayMemos.length ? todayMemos.map(m => `
        <div style="padding:10px 4px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px; flex:1;">
                <input type="checkbox" onchange="toggleMemoDone('${m.id}', this.checked)" style="transform:scale(1.2);">
                <span style="font-size:14px; ${m.is_pinned ? 'font-weight:bold; color:var(--primary);' : ''}">${m.is_pinned ? '📌 ' : ''}${m.content}</span>
            </div>
        </div>
    `).join('') : '<div style="font-size:12px; color:var(--secondary); padding:10px 4px;">오늘 등록된 할 일이 없습니다.</div>';

    let upcomingHtml = '';
    const upcomingItems = [];
    upcomingMemos.forEach(m => upcomingItems.push({ type: 'memo', date: m.memo_date, item: m }));
    upcomingExams.forEach(e => upcomingItems.push({ type: 'exam', date: e.exam_date, item: e }));
    
    upcomingItems.sort((a,b) => a.date.localeCompare(b.date));

    if (upcomingItems.length) {
        upcomingHtml = upcomingItems.slice(0, 5).map(u => {
            const diffTime = new Date(u.date).setHours(0,0,0,0) - new Date(todayStr).setHours(0,0,0,0);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dDay = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;

            if (u.type === 'exam') {
                const e = u.item;
                return `<div style="padding:8px 4px; font-size:13px; color:#b06000; border-bottom:1px solid var(--border);">[시험] ${e.school_name} ${e.grade} ${e.exam_name} <b style="margin-left:4px; font-size:11px; background:#fef7e0; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            } else {
                return `<div style="padding:8px 4px; font-size:13px; color:var(--secondary); border-bottom:1px solid var(--border);">${u.item.content} <b style="margin-left:4px; font-size:11px; background:#f1f3f4; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            }
        }).join('');
    }

    return `
        <div style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 style="margin:0; font-size:16px;">📝 오늘의 할 일</h3>
                <button class="btn" style="font-size:11px; padding:4px 8px;" onclick="openTodoMemoModal()">관리</button>
            </div>
            <div class="card" style="margin-bottom:16px; padding:8px 12px;">${todayHtml}</div>
            
            ${upcomingHtml ? `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h3 style="margin:0; font-size:15px; color:var(--secondary);">📅 이번 주 할 일</h3>
                </div>
                <div class="card" style="padding:8px 12px;">${upcomingHtml}</div>
            ` : ''}
        </div>
    `;
}

function renderDashboard() {
    state.ui.currentClassId = null;
    const data = computeDashboardData();
    const todayExam = getTodayExamConfig();
    const closeData = computeTodayCloseData();
    const root = document.getElementById('app-root');

    const academyStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:16px;">🏢 학원 현황 <span style="font-size:12px; font-weight:normal; color:var(--secondary); margin-left:4px;">(전체 재원 ${data.global.totalActive}명)</span></h3>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openOperationMenu()">⚙️ 운영</button>
                <button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="copyAcademySummary()">📋 요약 복사</button>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(80px, 1fr)); gap:10px; margin-bottom:28px;">
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--primary);"><div style="font-size:22px; font-weight:900;">${data.global.scheduledActive}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">오늘 수업</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--success);"><div style="font-size:22px; font-weight:900; color:var(--success);">${data.global.presentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">등원</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--error);"><div style="font-size:22px; font-weight:900; color:var(--error);">${data.global.absentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">결석</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid #b06000; cursor:pointer;" onclick="openTodoMemoModal()"><div style="font-size:22px; font-weight:900; color:#b06000;">${data.global.todoCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">할 일</div></div>
        </div>
    `;

    const syncWarning = syncQueue.length > 0 
        ? `<div style="background:#fce8e6; color:#c5221f; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; margin-bottom:12px; text-align:center; border:1px solid #f9d2ce;">⚠️ 인터넷 끊김: ${syncQueue.length}건의 데이터 대기 중</div>` 
        : '';

    const buildSummaryBadges = (list) => {
        if(list.length === 0) return '';
        const group = list.reduce((acc, cur) => { acc[cur.className] = (acc[cur.className]||0)+1; return acc; }, {});
        const keys = Object.keys(group);
        let str = keys.slice(0, 2).map(k => `${k} ${group[k]}`).join(' · ');
        if(keys.length > 2) str += ` 외 ${keys.length - 2}개 반`;
        return `<span style="font-size:11px; background:#fff; padding:2px 6px; border-radius:4px; margin-left:6px; color:#7a4f00;">${str}</span>`;
    };

    // 4D 최종 보정: "오늘 수업"
    const closeBanner = closeData.totalActive === 0
        ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#f1f3f4; border:1px solid var(--border); border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:var(--secondary);">
            <span style="font-size:20px;">☕</span>
            <div><b>오늘은 예정된 정규 수업이 없습니다.</b></div>
          </div>`
        : closeData.allClear
            ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#e6f4ea; border:1px solid #a8d5b5; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:#1e6b34;">
                <span style="font-size:20px;">✅</span>
                <div><b>오늘 수업 마감 완료</b><br><span style="font-size:12px; opacity:0.8;">출결·숙제 기록이 완료되었습니다.</span></div>
              </div>`
            : `${syncWarning}<div onclick="openTodayCloseModal('att')" style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#fff8e1; border:1px solid #f9ab00; border-radius:12px; padding:14px 16px; margin-bottom:20px; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">📋</span>
                    <div style="font-size:14px; color:#7a4f00;">
                        <b>오늘 마감 센터</b> <span style="font-size:11px; opacity:0.7;">(오늘 수업 ${closeData.totalActive}명)</span><br>
                        <div style="font-size:12px; margin-top:4px; line-height:1.6;">
                            출결 미처리 <b>${closeData.noAtt.length}</b>명 ${buildSummaryBadges(closeData.noAtt)}<br>
                            숙제 미처리 <b>${closeData.noHw.length}</b>명 ${buildSummaryBadges(closeData.noHw)}
                        </div>
                    </div>
                </div>
                <span style="font-size:18px; color:#f9ab00;">›</span>
              </div>`;

    const todoSections = renderTodoSections();

    const classes = state.ui.viewScope === 'all' 
        ? state.db.classes.filter(c => c.is_active !== 0) 
        : state.db.classes.filter(c => c.teacher_name === state.ui.userName && c.is_active !== 0);

    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap;">
            <h3 style="margin:0; font-size:16px;">📂 학급별 운영 현황</h3>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="renderAttendanceLedger()">📋 출석부</button>
            </div>
        </div>
        <div class="grid" style="margin-bottom:32px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    root.innerHTML = academyStatus + closeBanner + todoSections + classStatus;
    document.getElementById('scope-text').innerText = state.ui.viewScope === 'all' ? '전체 관리' : '내 담당';
}

function computeTodayCloseData(todayExam = null) {
    const today = new Date().toLocaleDateString('sv-SE');
    
    const scheduledActive = state.db.students.filter(s => {
        if (s.status !== '재원') return false;
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && cls.is_active === 0) return false;
        return isClassScheduledToday(cid);
    });

    const activeIds = new Set(scheduledActive.map(s => s.id));

    const attTodaySet = new Set(state.db.attendance.filter(a => a.date === today && activeIds.has(a.student_id)).map(a => a.student_id));
    const hwTodaySet = new Set(state.db.homework.filter(h => h.date === today && activeIds.has(h.student_id)).map(h => h.student_id));

    const noAtt = [], noHw = [];
    scheduledActive.forEach(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const className = state.db.classes.find(c => c.id === cid)?.name || '미배정';
        const info = { id: s.id, name: s.name, className };

        if (!attTodaySet.has(s.id)) noAtt.push(info);
        if (!hwTodaySet.has(s.id)) noHw.push(info);
    });

    const totalActive = scheduledActive.length;
    return {
        totalActive, noAtt, attDone: totalActive - noAtt.length,
        noHw, hwDone: totalActive - noHw.length,
        allClear: totalActive > 0 && noAtt.length === 0 && noHw.length === 0
    };
}

async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

async function quickToggleHw(sid, status, tab = 'hw') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('homework', { studentId: sid, status, date: today });
    if (!r?.success) { toast('숙제 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

function buildAcademySummary() {
    const today = new Date().toLocaleDateString('sv-SE');
    const closeData = computeTodayCloseData();

    let text = `[AP Math 운영 마감 보고 - ${today}]\n\n`;
    text += `오늘 수업: ${closeData.totalActive}명\n`;
    text += `출결 처리: ${closeData.attDone}/${closeData.totalActive}\n`;
    text += `숙제 처리: ${closeData.hwDone}/${closeData.totalActive}\n`;

    if (closeData.totalActive === 0) {
        text += `\n✅ 오늘은 예정된 정규 수업이 없습니다.`;
    } else if (closeData.allClear) {
        text += `\n✅ 오늘 운영 마감 완료`;
    } else {
        text += `\n⚠️ 미처리 항목\n`;
        if (closeData.noAtt.length > 0) {
            const listStr = closeData.noAtt.map(s => `${s.className} ${s.name}`).join(', ');
            text += `- 출결 미처리: ${closeData.noAtt.length}명 (${listStr})\n`;
        }
        if (closeData.noHw.length > 0) {
            const listStr = closeData.noHw.map(s => `${s.className} ${s.name}`).join(', ');
            text += `- 숙제 미처리: ${closeData.noHw.length}명 (${listStr})\n`;
        }
    }
    return text;
}

function copyAcademySummary() {
    const text = buildAcademySummary();
    navigator.clipboard.writeText(text).then(() => toast('운영 요약이 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

function openTodayCloseModal(tab = 'att') {
    const d = computeTodayCloseData();

    const tabs = [
        { key: 'att',  label: `출결 미처리 ${d.noAtt.length}`,  list: d.noAtt,  emptyMsg: '모든 대상 출결 처리 완료 ✅' },
        { key: 'hw',   label: `숙제 미처리 ${d.noHw.length}`,   list: d.noHw,   emptyMsg: '모든 대상 숙제 처리 완료 ✅' }
    ];
    const cur = tabs.find(t => t.key === tab) || tabs[0];

    const tabBtns = tabs.map(t => `
        <button onclick="openTodayCloseModal('${t.key}')" style="
            flex:1; padding:10px 4px; border:none; border-radius:8px; font-size:12px; font-weight:700;
            background:${t.key === tab ? 'var(--primary)' : '#f1f3f4'};
            color:${t.key === tab ? 'white' : 'var(--secondary)'};
            cursor:pointer;">
            ${t.label}
        </button>
    `).join('');

    const grouped = cur.list.reduce((acc, item) => {
        if(!acc[item.className]) acc[item.className] = [];
        acc[item.className].push(item);
        return acc;
    }, {});

    const rows = cur.list.length
        ? Object.keys(grouped).sort().map(cName => {
            const classHeader = `<div style="background:#f1f3f4; padding:6px 10px; font-size:12px; font-weight:bold; color:var(--secondary); margin-top:8px; border-radius:4px;">${cName}</div>`;
            const studentRows = grouped[cName].map(s => {
                let actionBtns = '';
                if (tab === 'att') {
                    actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleAtt('${s.id}', '등원', '${tab}')">✅ 등원</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--error); border-color:var(--error);" onclick="quickToggleAtt('${s.id}', '결석', '${tab}')">❌ 결석</button></div>`;
                } else if (tab === 'hw') {
                    actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleHw('${s.id}', '완료', '${tab}')">✅ 완료</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--warning); border-color:var(--warning);" onclick="quickToggleHw('${s.id}', '미완료', '${tab}')">❌ 미완료</button></div>`;
                }
                return `
                    <div style="padding:14px 4px; border-bottom:1px solid var(--border);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div onclick="closeModal();renderStudentDetail('${s.id}')" style="cursor:pointer; flex:1;">
                                <span style="font-weight:700; font-size:15px;">${s.name}</span>
                            </div>
                            <span onclick="closeModal();renderStudentDetail('${s.id}')" style="font-size:12px; color:var(--primary); cursor:pointer;">→ 프로필</span>
                        </div>
                        ${actionBtns}
                    </div>`;
            }).join('');
            return classHeader + studentRows;
        }).join('')
        : `<div style="padding:32px 16px; text-align:center; color:var(--success); font-weight:700; font-size:14px;">${cur.emptyMsg}</div>`;

    showModal('📋 오늘 마감 센터', `<div style="display:flex; gap:6px; margin-bottom:16px;">${tabBtns}</div><div>${rows}</div>`);
}

// 오늘 시험 설정 관련 기능 보존
function getTodayExamConfig() {
    try {
        const raw = localStorage.getItem('AP_TODAY_EXAM');
        if (!raw) return null;
        const cfg = JSON.parse(raw);
        const today = new Date().toLocaleDateString('sv-SE');
        if (cfg.date !== today || !cfg.title) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
        return { date: cfg.date, title: String(cfg.title), q: parseInt(cfg.q, 10) || 20 };
    } catch (e) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
}
function setTodayExamConfig(title, q) {
    const today = new Date().toLocaleDateString('sv-SE');
    const validQ = parseInt(q, 10) || 20;
    localStorage.setItem('AP_TODAY_EXAM', JSON.stringify({ date: today, title: String(title), q: validQ }));
}
function clearTodayExamConfig() { localStorage.removeItem('AP_TODAY_EXAM'); renderDashboard(); }
function openTodayExamSetModal() {
    const cfg = getTodayExamConfig();
    showModal('⚙️ 오늘 시험 설정', `<div style="display:flex; flex-direction:column; gap:12px;"><p style="margin:0; font-size:13px; color:var(--secondary);">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</p><div style="display:flex; gap:4px; flex-wrap:wrap; margin:6px 0;"><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button></div><input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%;"><input id="set-exam-q" type="number" class="btn" placeholder="문항 수" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%;"><div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; min-width:120px; padding:12px;" onclick="handleSetTodayExam()">저장 및 적용</button><button class="btn" style="flex:1; min-width:120px; padding:12px; color:var(--error); border-color:var(--error);" onclick="clearTodayExamConfig(); closeModal();">시험 없음 처리</button></div></div>`);
}
function handleSetTodayExam() {
    const t = document.getElementById('set-exam-title').value.trim();
    const q = parseInt(document.getElementById('set-exam-q').value, 10) || 20;
    if (!t) { toast('시험명을 입력하세요.', 'warn'); return; }
    setTodayExamConfig(t, q); toast('오늘 시험이 설정되었습니다.', 'info'); closeModal(); renderDashboard();
}