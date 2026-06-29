/**
 * AP Math OS 1.0 [js/memo.js]
 * Split from dashboard.js.
 */

const todoMemoSaveInFlight = new Set();

function todoMemoClientRequestId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    return `memo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function withTodoMemoSaveGuard(key, action) {
    if (todoMemoSaveInFlight.has(key)) return Promise.resolve();
    todoMemoSaveInFlight.add(key);
    const btn = document.activeElement && document.activeElement.tagName === 'BUTTON' ? document.activeElement : null;
    const originalText = btn ? btn.textContent : '';
    if (btn) {
        btn.disabled = true;
        btn.textContent = '저장 중...';
    }
    return Promise.resolve()
        .then(action)
        .finally(() => {
            todoMemoSaveInFlight.delete(key);
            if (btn) {
                btn.disabled = false;
                btn.textContent = originalText;
            }
        });
}

function normalizeTodoMemoRow(row, fallback = {}) {
    const source = row && typeof row === 'object' ? row : {};
    return {
        ...fallback,
        ...source,
        id: source.id || fallback.id,
        memo_date: source.memo_date || source.memoDate || fallback.memo_date || fallback.memoDate || new Date().toLocaleDateString('sv-SE'),
        content: source.content || fallback.content || '',
        is_pinned: source.is_pinned ?? source.isPinned ?? fallback.is_pinned ?? fallback.isPinned ?? false,
        is_done: source.is_done ?? source.isDone ?? fallback.is_done ?? fallback.isDone ?? false
    };
}

function todoMemoRowFromResponse(response, fallback) {
    return normalizeTodoMemoRow(
        response?.operation_memo || response?.operationMemo || response?.memo || response?.data || response?.item,
        fallback
    );
}

function upsertTodoMemoInState(row) {
    if (!state.db) state.db = {};
    const normalized = normalizeTodoMemoRow(row);
    if (!normalized.id) return;
    const rows = Array.isArray(state.db.operation_memos) ? state.db.operation_memos.slice() : [];
    const index = rows.findIndex(item => String(item.id) === String(normalized.id));
    if (index >= 0) rows[index] = { ...rows[index], ...normalized };
    else rows.unshift(normalized);
    state.db.operation_memos = rows;
}

function removeTodoMemoFromState(id) {
    if (!state.db) state.db = {};
    state.db.operation_memos = (state.db.operation_memos || []).filter(item => String(item.id) !== String(id));
}

function openTodoMemoModal() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const memos = state.db.operation_memos || [];
    
    const memoRows = memos.map(m => {
        const isDone = m.is_done == 1 || m.is_done === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; ${isDone ? 'opacity:0.5;' : ''}">
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:400; color:var(--secondary); margin-bottom:4px;">${apEscapeHtml(m.memo_date)} ${isPinned ? `<span style="color:var(--primary); font-weight:500;">고정</span>` : ''}</div>
                <div style="font-size:14px; font-weight:500; color:var(--text); text-decoration:${isDone ? 'line-through' : 'none'};">${apEscapeHtml(m.content)}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn ${isDone ? '' : 'btn-primary'}" style="padding:6px 10px; font-size:11px; font-weight:500; ${isDone ? 'background:var(--surface-2); border:none;' : ''}" onclick="toggleMemoDone('${m.id}', ${!isDone})">${isDone ? '취소' : '완료'}</button>
                <button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; font-weight:500; background:var(--surface-2); border:none;" onclick="openEditTodoMemoModal('${m.id}')">수정</button>
            </div>
        </div>
    `}).join('');

    showModal('메모', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:500; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);"><input type="checkbox" id="new-memo-pin"> 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="메모 입력 (예: 고2 직전보강)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding:10px; font-size:13px; font-weight:500; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:45vh; overflow-y:auto; padding-right:4px;">
            ${memos.length ? memoRows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:400; padding:20px;">표시할 메모가 없습니다.</div>`}
        </div>
    `);
}

async function addTodoMemo() {
    const d = document.getElementById('new-memo-date')?.value || '';
    const c = document.getElementById('new-memo-content')?.value.trim() || '';
    const p = !!document.getElementById('new-memo-pin')?.checked;
    if (!c) return toast('내용을 입력하세요', 'warn');

    return withTodoMemoSaveGuard(`add:${d}:${c}:${p}`, async () => {
    try {
        const clientRequestId = todoMemoClientRequestId();
        const r = await api.post('operation-memos', { memoDate: d, content: c, isPinned: p, clientRequestId });
        if (r?.success) {
            toast('메모가 저장되었습니다.', 'success');
            upsertTodoMemoInState(todoMemoRowFromResponse(r, { id: r?.id || clientRequestId, memo_date: d, content: c, is_pinned: p, is_done: false }));
            openTodoMemoModal();
            return;
        }
        toast(r?.message || r?.error || '메모 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[addTodoMemo] failed:', e);
        toast('메모 저장 중 오류가 발생했습니다.', 'error');
    }
    });
}


async function toggleMemoDone(id, done) {
    const m = state.db.operation_memos.find(x => String(x.id) === String(id));
    if (!m) {
        toast('메모를 찾을 수 없습니다.', 'warn');
        return;
    }
    const p = m.is_pinned == 1 || m.is_pinned === true;

    return withTodoMemoSaveGuard(`toggle:${id}:${done}`, async () => {
    try {
        const r = await api.patch(`operation-memos/${id}`, { memoDate: m.memo_date, content: m.content, isPinned: p, isDone: done });
        if (r?.success) {
            toast(done ? '완료 처리되었습니다.' : '완료가 취소되었습니다.', 'info');
            upsertTodoMemoInState(todoMemoRowFromResponse(r, { ...m, is_done: done, isDone: done }));
            if (document.getElementById('new-memo-content') || document.getElementById('edit-memo-content')) openTodoMemoModal();
            else {
                if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
                else renderDashboard();
            }
            return;
        }
        toast(r?.message || r?.error || '메모 상태 변경에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[toggleMemoDone] failed:', e);
        toast('메모 상태 변경 중 오류가 발생했습니다.', 'error');
    }
    });
}

function refreshAfterTodoMemoSource(source) {
    if (source === 'dashboard') {
        if (typeof closeModal === 'function') closeModal(true);
        if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
        else if (typeof renderDashboard === 'function') renderDashboard();
        return;
    }
    openTodoMemoModal();
}

async function deleteMemo(id, source = 'list') {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('operation-memos', id);
        if (r?.success) {
            toast('메모가 삭제되었습니다.', 'info');
            removeTodoMemoFromState(id);
            refreshAfterTodoMemoSource(source);
            return;
        }
        toast(r?.message || r?.error || '메모 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteMemo] failed:', e);
        toast('메모 삭제 중 오류가 발생했습니다.', 'error');
    }
}


function openEditTodoMemoModal(id, source = 'list') {
    const m = state.db.operation_memos.find(x => String(x.id) === String(id));
    if(!m) return;
    const isPinned = m.is_pinned == 1 || m.is_pinned === true;
    const safeSource = source === 'dashboard' ? 'dashboard' : 'list';
    const memoIdArg = typeof apJsArg === 'function' ? apJsArg(id) : `'${apEscapeHtml(String(id ?? ''))}'`;
    showModal('메모 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="edit-memo-date" class="btn" value="${m.memo_date}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:500; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);">
                    <input type="checkbox" id="edit-memo-pin" ${isPinned ? 'checked' : ''}> 고정
                </label>
            </div>
            <input type="text" id="edit-memo-content" class="btn" value="${apEscapeHtml(m.content)}" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding:12px; font-size:13px; font-weight:500; margin-top:4px;" onclick="handleEditTodoMemo(${memoIdArg}, '${safeSource}')">수정 저장</button>
            <div style="display:flex; gap:8px; margin-top:4px;">
                <button class="btn apms-button apms-button--quiet" style="flex:1; padding:10px; font-size:12px; border:none; background:var(--surface);" onclick="${safeSource === 'dashboard' ? 'closeModal(true)' : 'openTodoMemoModal()'}">취소</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; padding:10px; font-size:12px; color:var(--error); background:rgba(var(--error-rgb),0.1); border:none; font-weight:500;" onclick="deleteMemo(${memoIdArg}, '${safeSource}')">완전 삭제</button>
            </div>
        </div>
    `);
}

async function handleEditTodoMemo(id, source = 'list') {
    const m = state.db.operation_memos.find(x => String(x.id) === String(id));
    if (!m) return toast('메모를 찾을 수 없습니다.', 'warn');
    const d = document.getElementById('edit-memo-date')?.value || '';
    const c = document.getElementById('edit-memo-content')?.value.trim() || '';
    const p = !!document.getElementById('edit-memo-pin')?.checked;
    if (!c) return toast('내용을 입력하세요', 'warn');

    const isDone = m.is_done == 1 || m.is_done === true;
    return withTodoMemoSaveGuard(`edit:${id}`, async () => {
    try {
        const r = await api.patch('operation-memos/' + id, { memoDate: d, content: c, isPinned: p, isDone: isDone });
        if (r?.success) {
            toast('메모가 수정되었습니다.', 'info');
            upsertTodoMemoInState(todoMemoRowFromResponse(r, { ...m, memo_date: d, content: c, is_pinned: p, is_done: isDone }));
            refreshAfterTodoMemoSource(source);
            return;
        }
        toast(r?.message || r?.error || '메모 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditTodoMemo] failed:', e);
        toast('메모 수정 중 오류가 발생했습니다.', 'error');
    }
    });
}
