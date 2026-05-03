/**
 * AP Math OS 1.0 [js/textbook.js]
 * Split from dashboard.js.
 */

function renderTextbookManageList() {
    const listRoot = document.getElementById('tb-manage-list');
    if (!listRoot) return;
    
    const allBooks = state.db.class_textbooks || [];
    const activeBooks = allBooks.filter(tb => tb.status === 'active');
    const inactiveBooks = allBooks.filter(tb => tb.status !== 'active');

    const renderTbRow = (tb) => {
        const cName = state.db.classes.find(c => String(c.id) === String(tb.class_id))?.name || '알 수 없음';
        const isHidden = tb.status === 'hidden';
        const isCompleted = tb.status === 'completed';
        
        let statusBadge = '';
        if (isCompleted) statusBadge = `<span style="font-size:10px; background:rgba(0,208,132,0.1); color:var(--success); padding:2px 6px; border-radius:4px; font-weight:700;">완료</span>`;
        else if (isHidden) statusBadge = `<span style="font-size:10px; background:var(--bg); color:var(--secondary); padding:2px 6px; border-radius:4px; font-weight:700;">숨김</span>`;

        return `
            <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="min-width:0;">
                    <div style="font-weight:700; font-size:14px; color:${tb.status==='active' ? 'var(--text)' : 'var(--secondary)'}; line-height:1.4;">${apEscapeHtml(tb.title)} ${statusBadge}</div>
                    <div style="font-size:11px; color:var(--secondary); margin-top:4px; line-height:1.5;">${apEscapeHtml(cName)} | 시작: ${tb.start_date || '-'} ${tb.end_date ? `| 종료: ${tb.end_date}` : ''}</div>
                </div>
                <button class="btn" style="padding:6px 10px; font-size:11px; flex-shrink:0;" onclick="openEditTextbookModal('${tb.id}')">관리</button>
            </div>
        `;
    };

    listRoot.innerHTML = `
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">현재 사용 중인 교재 (${activeBooks.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeBooks.length ? activeBooks.map(renderTbRow).join('') : `<div style="font-size:12px; color:var(--secondary); padding:10px 0;">사용 중인 교재가 없습니다.</div>`}
        </div>
        ${inactiveBooks.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">완료 / 숨김 교재 (${inactiveBooks.length})</h4>
            <div style="opacity:0.7;">${inactiveBooks.map(renderTbRow).join('')}</div>
        ` : ''}
    `;
}

function openTextbookManageModal(options = {}) {
    state.ui.textbookReturnView = options.returnTo || state.ui.textbookReturnView || { type: 'classManage' };
    setModalReturnView(state.ui.textbookReturnView);
    showModal('교재 관리', `
        <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:16px;">
            <button class="btn btn-primary" style="padding:10px 14px; font-size:12px; font-weight:700;" onclick="openAddTextbookModal()">새 교재</button>
        </div>
        <div id="tb-manage-list" style="max-height:60vh; overflow-y:auto; padding-right:4px;"></div>
    `);
    renderTextbookManageList();
}

function openAddTextbookModal() {
    setModalReturnView({ type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'classManage' } });
    const classOptions = state.db.classes.filter(c => Number(c.is_active) !== 0).map(c => `<option value="${c.id}">${apEscapeHtml(c.name)}</option>`).join('');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('새 교재 등록', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="new-tb-class" class="btn" style="background:var(--surface-2); border:none;"><option value="">반을 선택하세요</option>${classOptions}</select>
            <input id="new-tb-title" class="btn" placeholder="교재명 (예: 개념원리 중1-1)" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="new-tb-start" class="btn" value="${todayStr}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            <button class="btn btn-primary" style="margin-top:10px; padding:12px;" onclick="handleAddTextbook()">저장</button>
        </div>
    `);
}

async function handleAddTextbook() {
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'classManage' } };
    const cid = document.getElementById('new-tb-class')?.value || '';
    const title = document.getElementById('new-tb-title')?.value.trim() || '';
    const startDate = document.getElementById('new-tb-start')?.value || '';

    if (!cid || !title) return toast('반과 교재명을 모두 입력하세요.', 'warn');

    try {
        const r = await api.post('class-textbooks', { class_id: cid, title: title, start_date: startDate });
        if (r?.success) {
            toast('교재가 등록되었습니다.', 'success');
            await loadData();
            returnToPreviousManagementView('dashboard', returnCtx);
            return;
        }
        toast(r?.message || r?.error || '교재 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAddTextbook] failed:', e);
        toast('교재 저장 중 오류가 발생했습니다.', 'error');
    }
}


function openEditTextbookModal(tbId) {
    setModalReturnView({ type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'classManage' } });
    const tb = state.db.class_textbooks.find(x => x.id === tbId);
    if (!tb) return;
    
    const isCompleted = tb.status === 'completed';
    const isHidden = tb.status === 'hidden';
    
    showModal('교재 수정', `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <input id="edit-tb-title" class="btn" value="${apEscapeHtml(tb.title)}" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="edit-tb-start" class="btn" value="${tb.start_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            ${isCompleted || tb.end_date ? `
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">종료일:</span>
                <input type="date" id="edit-tb-end" class="btn" value="${tb.end_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>` : ''}
            <button class="btn btn-primary" style="margin-top:8px; padding:12px;" onclick="handlePatchTextbook('${tbId}', false)">정보 수정 저장</button>
        </div>
        <div style="border-top:1px solid var(--border); padding-top:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:12px; font-weight:600; color:var(--secondary); margin-bottom:4px;">상태 변경</div>
            <div style="display:flex; gap:8px;">
                ${isCompleted || isHidden 
                    ? `<button class="btn" style="flex:1; padding:10px; font-size:12px;" onclick="handlePatchTextbook('${tbId}', true, 'active')">진행중으로 복구</button>`
                    : `<button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--success); background:rgba(0,208,132,0.1); border:none; font-weight:700;" onclick="handlePatchTextbook('${tbId}', true, 'completed')">교재 완료 처리</button>
                       <button class="btn" style="flex:1; padding:10px; font-size:12px; background:var(--surface-2); border:none;" onclick="handlePatchTextbook('${tbId}', true, 'hidden')">숨김 보류</button>`
                }
            </div>
            <button class="btn" style="margin-top:12px; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="handleDeleteTextbook('${tbId}')">교재 완전 삭제</button>
        </div>
    `);
}

async function handlePatchTextbook(tbId, isStatusChange, targetStatus = 'active') {
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'classManage' } };
    const title = document.getElementById('edit-tb-title')?.value.trim() || '';
    const startDate = document.getElementById('edit-tb-start')?.value || '';
    const endDateEl = document.getElementById('edit-tb-end');
    if (!title) return toast('교재명을 입력하세요.', 'warn');

    let payload = { title, start_date: startDate };
    if (endDateEl) payload.end_date = endDateEl.value;

    if (isStatusChange) {
        payload.status = targetStatus;
        if (targetStatus === 'active') payload.clear_end_date = true;
    }

    try {
        const r = await api.patch(`class-textbooks/${tbId}`, payload);
        if (r?.success) {
            toast(isStatusChange ? '교재 상태가 변경되었습니다.' : '교재 정보가 수정되었습니다.', 'success');
            await loadData();
            returnToPreviousManagementView('dashboard', returnCtx);
            return;
        }
        toast(r?.message || r?.error || '교재 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handlePatchTextbook] failed:', e);
        toast('교재 수정 중 오류가 발생했습니다.', 'error');
    }
}


async function handleDeleteTextbook(tbId) {
    if (!confirm('이 교재를 완전히 삭제하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'classManage' } };

    try {
        const r = await api.delete('class-textbooks', tbId);
        if (r?.success) {
            toast('교재가 삭제되었습니다.', 'info');
            await loadData();
            returnToPreviousManagementView('dashboard', returnCtx);
            return;
        }
        toast(r?.message || r?.error || '교재 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteTextbook] failed:', e);
        toast('교재 삭제 중 오류가 발생했습니다.', 'error');
    }
}

