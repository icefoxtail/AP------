/**
 * AP Math OS 1.0 [js/memo.js]
 * Split from dashboard.js.
 */

function openTodoMemoModal() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const memos = state.db.operation_memos || [];
    
    const memoRows = memos.map(m => {
        const isDone = m.is_done == 1 || m.is_done === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; ${isDone ? 'opacity:0.5;' : ''}">
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-bottom:4px;">${apEscapeHtml(m.memo_date)} ${isPinned ? `<span style="color:var(--primary); font-weight:700;">고정</span>` : ''}</div>
                <div style="font-size:14px; font-weight:700; color:var(--text); text-decoration:${isDone ? 'line-through' : 'none'};">${apEscapeHtml(m.content)}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn ${isDone ? '' : 'btn-primary'}" style="padding:6px 10px; font-size:11px; font-weight:700; ${isDone ? 'background:var(--surface-2); border:none;' : ''}" onclick="toggleMemoDone('${m.id}', ${!isDone})">${isDone ? '취소' : '완료'}</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; background:var(--surface-2); border:none;" onclick="openEditTodoMemoModal('${m.id}')">수정</button>
            </div>
        </div>
    `}).join('');

    showModal('메모 / 할 일', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);"><input type="checkbox" id="new-memo-pin"> 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="할 일 입력 (예: 고2 직전보강)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:10px; font-size:13px; font-weight:700; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:45vh; overflow-y:auto; padding-right:4px;">
            ${memos.length ? memoRows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; padding:20px;">등록된 할 일이 없습니다.</div>`}
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
    const m = state.db.operation_memos.find(x => String(x.id) === String(id));
    if (!m) {
        toast('메모를 찾을 수 없습니다.', 'warn');
        return;
    }
    const p = m.is_pinned == 1 || m.is_pinned === true;
    const r = await api.patch(`operation-memos/${id}`, { memoDate: m.memo_date, content: m.content, isPinned: p, isDone: done });
    if(r.success) { 
        await loadData(); 
        if(document.getElementById('new-memo-content') || document.getElementById('edit-memo-content')) openTodoMemoModal(); 
        else {
            if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
            else renderDashboard();
        }
    }
}

async function deleteMemo(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('operation-memos', id);
    if(r.success) { await loadData(); openTodoMemoModal(); }
}

function openEditTodoMemoModal(id) {
    const m = state.db.operation_memos.find(x => x.id === id);
    if(!m) return;
    const isPinned = m.is_pinned == 1 || m.is_pinned === true;
    showModal('메모 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="edit-memo-date" class="btn" value="${m.memo_date}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);">
                    <input type="checkbox" id="edit-memo-pin" ${isPinned ? 'checked' : ''}> 고정
                </label>
            </div>
            <input type="text" id="edit-memo-content" class="btn" value="${apEscapeHtml(m.content)}" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:12px; font-size:13px; font-weight:700; margin-top:4px;" onclick="handleEditTodoMemo('${id}')">수정 저장</button>
            <div style="display:flex; gap:8px; margin-top:4px;">
                <button class="btn" style="flex:1; padding:10px; font-size:12px; border:none; background:var(--surface);" onclick="openTodoMemoModal()">취소</button>
                <button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="deleteMemo('${id}')">완전 삭제</button>
            </div>
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
    
    const isDone = m.is_done == 1 || m.is_done === true;
    const r = await api.patch('operation-memos/' + id, { memoDate: d, content: c, isPinned: p, isDone: isDone });
    if(r.success) { 
        toast('메모가 수정되었습니다.', 'info');
        await loadData(); 
        openTodoMemoModal(); 
    } else {
        toast('메모 수정 실패', 'error');
    }
}
