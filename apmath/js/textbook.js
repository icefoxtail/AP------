/**
 * AP Math OS 1.0 [js/textbook.js]
 * Split from dashboard.js.
 */

function textbookJsArg(value) {
    if (typeof apJsArg === 'function') return apJsArg(value);
    return `'${apEscapeHtml(String(value ?? '')).replace(/'/g, '&#39;')}'`;
}

function getGlobalTextbookManageState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.globalTextbookManage) {
        state.ui.globalTextbookManage = {
            active: false,
            selectedClassId: '',
            inlineAddOpen: false
        };
    }
    return state.ui.globalTextbookManage;
}

function isGlobalTextbookManageActive() {
    return !!getGlobalTextbookManageState().active
        && !!document.querySelector('#modal-body .ap-global-textbook-manage');
}

function renderTextbookInlineAddForm(options = {}) {
    const classId = String(options.classId || '');
    const date = String(options.date || new Date().toLocaleDateString('sv-SE'));
    const formId = options.formId ? ` id="${apEscapeHtml(String(options.formId))}"` : '';
    const title = String(options.title || '');
    const inputIds = {
        classId: 'new-tb-class',
        title: 'new-tb-title',
        startDate: 'new-tb-start',
        ...(options.inputIds || {})
    };
    const submitAction = options.submitAction || 'submitClassProgressTextbookAdd()';
    const cancelAction = options.cancelAction || 'cancelClassProgressTextbookInlineAction()';
    const submitLabel = String(options.submitLabel || '저장');
    const submitHtml = options.showSubmit === false
        ? ''
        : `<button type="button" class="btn apms-button apms-button--primary btn-primary" onclick="${submitAction}">${apEscapeHtml(submitLabel)}</button>`;

    return `<div class="ap-class-progress-inline-form"${formId}>
        <div class="ap-class-progress-inline-form__head">
            <strong>새 교재 등록</strong>
            <button type="button" class="btn apms-button apms-button--quiet" onclick="${cancelAction}">취소</button>
        </div>
        <input type="hidden" id="${apEscapeHtml(String(inputIds.classId))}" value="${apEscapeHtml(classId)}">
        <input type="text" id="${apEscapeHtml(String(inputIds.title))}" class="cls-input" value="${apEscapeHtml(title)}" placeholder="교재명 (예: 개념원리 중1-1)">
        <div class="ap-class-progress-inline-form__row">
            <label for="${apEscapeHtml(String(inputIds.startDate))}">시작일</label>
            <input type="date" id="${apEscapeHtml(String(inputIds.startDate))}" class="cls-input" value="${apEscapeHtml(date)}">
        </div>
        ${submitHtml}
    </div>`;
}

function renderTextbookManagementRow(tb, options = {}) {
    const status = tb?.status === 'completed' ? 'complete' : tb?.status === 'hidden' ? 'unlearned' : 'current';
    const statusLabel = tb?.status === 'completed' ? '완료' : tb?.status === 'hidden' ? '숨김' : '진행 중';
    const tbId = String(tb?.id || '');
    const patchAction = typeof options.patchAction === 'function'
        ? options.patchAction
        : (id, targetStatus) => `submitClassProgressTextbookPatch(${textbookJsArg(id)}, ${textbookJsArg(targetStatus)})`;
    const deleteAction = typeof options.deleteAction === 'function'
        ? options.deleteAction
        : id => `submitClassProgressTextbookDelete(${textbookJsArg(id)})`;
    const actionHtml = tb?.isFallback
        ? ''
        : `<div class="ap-class-progress-manage-row__actions">
            ${tb?.status === 'active'
                ? `<button type="button" class="btn apms-button apms-button--quiet" onclick="${patchAction(tbId, 'completed')}">교재 완료 처리</button>
                   <button type="button" class="btn apms-button apms-button--quiet" onclick="${patchAction(tbId, 'hidden')}">숨김 보류</button>`
                : `<button type="button" class="btn apms-button apms-button--quiet" onclick="${patchAction(tbId, 'active')}">진행중으로 복구</button>`}
            <button type="button" class="btn apms-button apms-button--quiet ap-class-progress-manage-row__delete" onclick="${deleteAction(tbId)}">교재 완전 삭제</button>
        </div>`;
    return `<article class="ap-class-progress-manage-row">
        <div class="ap-class-progress-manage-row__head">
            <strong>${apEscapeHtml(String(tb?.title || ''))}</strong>
            <span class="ap-class-progress-status ap-class-progress-status--${apEscapeHtml(status)}">${apEscapeHtml(statusLabel)}</span>
        </div>
        <div class="ap-class-progress-manage-row__meta">시작: ${apEscapeHtml(String(tb?.start_date || '-'))}${tb?.end_date ? ` · 종료: ${apEscapeHtml(String(tb.end_date))}` : ''}</div>
        ${actionHtml}
    </article>`;
}

function getGlobalTextbookManageClasses() {
    const classes = Array.isArray(state.db?.classes) ? state.db.classes.slice() : [];
    const sorted = typeof sortClassesForManagement === 'function'
        ? sortClassesForManagement(classes)
        : classes.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    return sorted.sort((a, b) => {
        const inactiveDiff = (Number(a.is_active) === 0 ? 1 : 0) - (Number(b.is_active) === 0 ? 1 : 0);
        return inactiveDiff;
    });
}

function getGlobalTextbookManageBooks(classId) {
    return (state.db.class_textbooks || []).filter(tb => String(tb.class_id) === String(classId));
}

function renderGlobalTextbookStatusCount(label, count, status) {
    return `<span class="ap-class-progress-status ap-class-progress-status--${status}">${label} ${count}</span>`;
}

function renderGlobalTextbookClassList() {
    const classes = getGlobalTextbookManageClasses();
    const allBooks = state.db.class_textbooks || [];
    const rows = classes.map(cls => {
        const books = allBooks.filter(tb => String(tb.class_id) === String(cls.id));
        const activeCount = books.filter(tb => tb.status === 'active').length;
        const completedCount = books.filter(tb => tb.status === 'completed').length;
        const hiddenCount = books.filter(tb => tb.status === 'hidden').length;
        const inactive = Number(cls.is_active) === 0;
        return `<button type="button" class="ap-global-textbook-class" onclick="selectGlobalTextbookClass(${textbookJsArg(cls.id)})">
            <span class="ap-global-textbook-class__main">
                <strong>${apEscapeHtml(String(cls.name || '이름 없는 반'))}</strong>
                ${inactive ? '<span class="ap-global-textbook-class__inactive">숨김 반</span>' : ''}
            </span>
            <span class="ap-global-textbook-class__counts">
                ${renderGlobalTextbookStatusCount('진행', activeCount, 'current')}
                ${renderGlobalTextbookStatusCount('완료', completedCount, 'complete')}
                ${renderGlobalTextbookStatusCount('숨김', hiddenCount, 'unlearned')}
            </span>
        </button>`;
    }).join('');

    return `<div class="ap-global-textbook-manage">
        <div class="ap-global-textbook-manage__intro">
            <strong>반을 선택하세요</strong>
            <span>선택한 반의 진행 중·완료·숨김 교재를 한 곳에서 관리합니다.</span>
        </div>
        <div class="ap-global-textbook-class-list">
            ${rows || '<div class="apms-empty">관리할 반이 없습니다.</div>'}
        </div>
    </div>`;
}

function renderGlobalTextbookManageSection(label, books, emptyLabel) {
    const items = Array.isArray(books) ? books : [];
    const patchAction = (id, status) => `submitGlobalTextbookPatch(${textbookJsArg(id)}, ${textbookJsArg(status)})`;
    const deleteAction = id => `submitGlobalTextbookDelete(${textbookJsArg(id)})`;
    return `<section class="ap-global-textbook-section">
        <div class="ap-global-textbook-section__head">
            <h4>${apEscapeHtml(label)}</h4>
            <span>${items.length}</span>
        </div>
        <div class="ap-class-progress-manage-list">
            ${items.length
                ? items.map(tb => renderTextbookManagementRow(tb, { patchAction, deleteAction })).join('')
                : `<div class="apms-empty">${apEscapeHtml(emptyLabel)}</div>`}
        </div>
    </section>`;
}

function renderGlobalTextbookClassPanel(cls) {
    const manageState = getGlobalTextbookManageState();
    const books = getGlobalTextbookManageBooks(cls.id);
    const activeBooks = books.filter(tb => tb.status === 'active');
    const completedBooks = books.filter(tb => tb.status === 'completed');
    const hiddenBooks = books.filter(tb => tb.status === 'hidden');
    const addHtml = manageState.inlineAddOpen
        ? renderTextbookInlineAddForm({
            classId: cls.id,
            date: new Date().toLocaleDateString('sv-SE'),
            submitAction: 'submitGlobalTextbookAdd()',
            cancelAction: 'cancelGlobalTextbookAdd()'
        })
        : '';

    return `<div class="ap-global-textbook-manage">
        <div class="ap-global-textbook-manage__context">
            <button type="button" class="btn apms-button apms-button--quiet" onclick="showGlobalTextbookClassList()">반 목록</button>
            <div class="ap-global-textbook-manage__context-main">
                <strong>${apEscapeHtml(String(cls.name || '이름 없는 반'))}</strong>
                <span>전체 교재 관리 · 진행 ${activeBooks.length} · 완료 ${completedBooks.length} · 숨김 ${hiddenBooks.length}</span>
            </div>
        </div>
        <section class="apms-card ap-class-progress-books ap-global-textbook-manage__card">
            <div class="ap-class-progress-panel-head">
                <h3>교재 관리</h3>
                <div class="ap-class-progress-panel-actions">
                    <button type="button" class="btn apms-button apms-button--quiet" aria-pressed="${manageState.inlineAddOpen ? 'true' : 'false'}" onclick="toggleGlobalTextbookAdd()">교재 추가</button>
                </div>
            </div>
            <div class="ap-class-progress-books__list">
                ${addHtml}
                ${renderGlobalTextbookManageSection('진행 중 교재', activeBooks, '진행 중인 교재가 없습니다.')}
                ${renderGlobalTextbookManageSection('완료 교재', completedBooks, '완료된 교재가 없습니다.')}
                ${renderGlobalTextbookManageSection('숨김 교재', hiddenBooks, '숨김 처리된 교재가 없습니다.')}
                <div class="ap-class-progress-inline-fields" aria-hidden="true">
                    <input type="hidden" id="edit-tb-title">
                    <input type="hidden" id="edit-tb-start">
                    <input type="hidden" id="edit-tb-end">
                </div>
            </div>
        </section>
    </div>`;
}

function renderGlobalTextbookManage() {
    const manageState = getGlobalTextbookManageState();
    const selectedClass = (state.db.classes || []).find(cls => String(cls.id) === String(manageState.selectedClassId));
    if (manageState.selectedClassId && !selectedClass) {
        manageState.selectedClassId = '';
        manageState.inlineAddOpen = false;
    }
    setModalBody(selectedClass ? renderGlobalTextbookClassPanel(selectedClass) : renderGlobalTextbookClassList());
}

function openGlobalTextbookManage() {
    const manageState = getGlobalTextbookManageState();
    manageState.active = true;
    manageState.selectedClassId = '';
    manageState.inlineAddOpen = false;
    if (state.ui) state.ui.classProgressInlineTextbookAction = null;
    setModalReturnView({ type: 'dashboard' });
    showModal('교재 관리', renderGlobalTextbookClassList());
}

function selectGlobalTextbookClass(classId) {
    const cls = (state.db.classes || []).find(item => String(item.id) === String(classId));
    if (!cls) return;
    const manageState = getGlobalTextbookManageState();
    manageState.selectedClassId = String(cls.id);
    manageState.inlineAddOpen = false;
    renderGlobalTextbookManage();
}

function showGlobalTextbookClassList() {
    const manageState = getGlobalTextbookManageState();
    manageState.selectedClassId = '';
    manageState.inlineAddOpen = false;
    renderGlobalTextbookManage();
}

function toggleGlobalTextbookAdd() {
    const manageState = getGlobalTextbookManageState();
    if (!manageState.selectedClassId) return;
    manageState.inlineAddOpen = !manageState.inlineAddOpen;
    renderGlobalTextbookManage();
}

function cancelGlobalTextbookAdd() {
    const manageState = getGlobalTextbookManageState();
    manageState.inlineAddOpen = false;
    renderGlobalTextbookManage();
}

function refreshGlobalTextbookManageAfterMutation() {
    if (!isGlobalTextbookManageActive()) return false;
    const manageState = getGlobalTextbookManageState();
    manageState.inlineAddOpen = false;
    renderGlobalTextbookManage();
    return true;
}

function submitGlobalTextbookAdd() {
    const manageState = getGlobalTextbookManageState();
    if (!manageState.selectedClassId) return toast('반을 먼저 선택하세요.', 'warn');
    if (typeof handleAddTextbook !== 'function') return toast('교재관리 기능을 불러오지 못했습니다.', 'warn');
    return handleAddTextbook();
}

function submitGlobalTextbookPatch(tbId, targetStatus) {
    const manageState = getGlobalTextbookManageState();
    const tb = getGlobalTextbookManageBooks(manageState.selectedClassId)
        .find(item => String(item.id) === String(tbId));
    if (!tb || typeof handlePatchTextbook !== 'function') return;
    const titleInput = document.getElementById('edit-tb-title');
    const startInput = document.getElementById('edit-tb-start');
    const endInput = document.getElementById('edit-tb-end');
    if (titleInput) titleInput.value = String(tb.title || '');
    if (startInput) startInput.value = String(tb.start_date || '');
    if (endInput) endInput.value = String(tb.end_date || '');
    return handlePatchTextbook(String(tbId), true, String(targetStatus || 'active'));
}

function submitGlobalTextbookDelete(tbId) {
    const manageState = getGlobalTextbookManageState();
    const tb = getGlobalTextbookManageBooks(manageState.selectedClassId)
        .find(item => String(item.id) === String(tbId));
    if (!tb || typeof handleDeleteTextbook !== 'function') return;
    return handleDeleteTextbook(String(tbId));
}

function resumeClassProgressAfterInlineTextbookAction(context) {
    if (!context?.classId || typeof openClassRecordModal !== 'function') return false;
    if (!state.ui) state.ui = {};
    if (context.courseApplyDraft) {
        state.ui.pendingClassProgressCourseApply = {
            ...context.courseApplyDraft,
            addedTextbookId: String(context.addedTextbookId || context.courseApplyDraft.addedTextbookId || '')
        };
    }
    state.ui.classProgressInlineTextbookAction = null;
    openClassRecordModal(context.classId, context.date);
    return true;
}

function renderTextbookManageList() {
    const listRoot = document.getElementById('tb-manage-list');
    if (!listRoot) return;

    const allBooks = state.db.class_textbooks || [];
    const activeBooks = allBooks.filter(tb => tb.status === 'active');
    const inactiveBooks = allBooks.filter(tb => tb.status !== 'active');

    const gradeOrder = ['중1','중2','중3','고1','고2','고3'];

    function getGradeRank(className) {
        for (let i = 0; i < gradeOrder.length; i++) {
            if (className && className.includes(gradeOrder[i])) return i;
        }
        return 99;
    }

    function groupAndSortBooks(books) {
        // 반별로 묶기
        const grouped = {};
        books.forEach(tb => {
            const cls = state.db.classes.find(c => String(c.id) === String(tb.class_id));
            const cName = cls?.name || '알 수 없음';
            if (!grouped[cName]) grouped[cName] = { cName, classId: tb.class_id, books: [] };
            grouped[cName].books.push(tb);
        });

        // 중1→고3 순 정렬
        return Object.values(grouped).sort((a, b) => {
            const ra = getGradeRank(a.cName);
            const rb = getGradeRank(b.cName);
            if (ra !== rb) return ra - rb;
            return a.cName.localeCompare(b.cName, 'ko');
        });
    }

    const renderTbRow = (tb) => {
        const isHidden = tb.status === 'hidden';
        const isCompleted = tb.status === 'completed';

        let statusBadge = '';
        if (isCompleted) statusBadge = `<span style="font-size:10px; background:rgba(0,208,132,0.1); color:var(--success); padding:2px 6px; border-radius:4px; font-weight:500;">완료</span>`;
        else if (isHidden) statusBadge = `<span style="font-size:10px; background:var(--bg); color:var(--secondary); padding:2px 6px; border-radius:4px; font-weight:500;">숨김</span>`;

        return `
            <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="min-width:0;">
                    <div style="font-weight:500; font-size:14px; color:${tb.status==='active' ? 'var(--text)' : 'var(--secondary)'}; line-height:1.4;">${apEscapeHtml(tb.title)} ${statusBadge}</div>
                    <div style="font-size:11px; color:var(--secondary); margin-top:2px; line-height:1.5;">시작: ${tb.start_date || '-'}${tb.end_date ? ` | 종료: ${tb.end_date}` : ''}</div>
                </div>
                <button class="btn apms-button apms-button--quiet" style="padding:6px 10px; font-size:11px; flex-shrink:0;" onclick="openEditTextbookModal('${tb.id}')">관리</button>
            </div>
        `;
    };

    const renderGroup = (groups) => groups.map(g => `
        <div style="margin-bottom:16px;">
            <div style="font-size:12px; font-weight:500; color:var(--primary); background:rgba(var(--primary-rgb),0.06); padding:6px 10px; border-radius:8px; margin-bottom:4px;">${apEscapeHtml(g.cName)}</div>
            ${g.books.map(renderTbRow).join('')}
        </div>
    `).join('');

    const activeGroups = groupAndSortBooks(activeBooks);
    const inactiveGroups = groupAndSortBooks(inactiveBooks);

    listRoot.innerHTML = `
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">현재 사용 중인 교재 (${activeBooks.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeGroups.length ? renderGroup(activeGroups) : `<div style="font-size:12px; color:var(--secondary); padding:10px 0;">사용 중인 교재가 없습니다.</div>`}
        </div>
        ${inactiveGroups.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">완료 / 숨김 교재 (${inactiveBooks.length})</h4>
            <div style="opacity:0.7;">${renderGroup(inactiveGroups)}</div>
        ` : ''}
    `;
}

function openTextbookManageModal(options = {}) {
    state.ui.textbookReturnView = options.returnTo || { type: 'dashboard' };
    setModalReturnView(state.ui.textbookReturnView);
    showModal('교재 관리', `
        <div style="display:flex; justify-content:flex-end; align-items:center; margin-bottom:16px;">
            <button class="btn apms-button apms-button--primary btn-primary" style="padding:10px 14px; font-size:12px; font-weight:500;" onclick="openAddTextbookModal()">새 교재</button>
        </div>
        <div id="tb-manage-list" style="max-height:60vh; overflow-y:auto; padding-right:4px;"></div>
    `);
    renderTextbookManageList();
}

function openAddTextbookModal() {
    setModalReturnView({ type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'dashboard' } });
    const classOptions = state.db.classes.filter(c => Number(c.is_active) !== 0).map(c => `<option value="${c.id}">${apEscapeHtml(c.name)}</option>`).join('');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('새 교재 등록', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="new-tb-class" class="btn" style="background:var(--surface-2); border:none;"><option value="">반을 선택하세요</option>${classOptions}</select>
            <input id="new-tb-title" class="btn" placeholder="교재명 (예: 개념원리 중1-1)" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:500; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="new-tb-start" class="btn" value="${todayStr}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            <button class="btn apms-button apms-button--primary btn-primary" style="margin-top:10px; padding:12px;" onclick="handleAddTextbook()">저장</button>
        </div>
    `);
}

async function handleAddTextbook(options = {}) {
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'dashboard' } };
    const inputIds = {
        classId: 'new-tb-class',
        title: 'new-tb-title',
        startDate: 'new-tb-start',
        ...(options.inputIds || {})
    };
    const cid = document.getElementById(inputIds.classId)?.value || '';
    const title = document.getElementById(inputIds.title)?.value.trim() || '';
    const startDate = document.getElementById(inputIds.startDate)?.value || '';

    if (!cid || !title) return toast('반과 교재명을 모두 입력하세요.', 'warn');

    try {
        const r = await api.post('class-textbooks', { class_id: cid, title: title, start_date: startDate });
        if (r?.success) {
            const inlineAction = state.ui?.classProgressInlineTextbookAction;
            if (inlineAction?.courseApplyDraft) {
                inlineAction.addedTextbookId = String(r.item?.id || r.textbook?.id || r.id || '');
            }
            toast('교재가 등록되었습니다.', 'success');
            await loadData();
            if (resumeClassProgressAfterInlineTextbookAction(state.ui?.classProgressInlineTextbookAction)) return;
            if (refreshGlobalTextbookManageAfterMutation()) return;
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
    setModalReturnView({ type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'dashboard' } });
    const tb = state.db.class_textbooks.find(x => x.id === tbId);
    if (!tb) return;
    
    const isCompleted = tb.status === 'completed';
    const isHidden = tb.status === 'hidden';
    
    showModal('교재 수정', `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <input id="edit-tb-title" class="btn" value="${apEscapeHtml(tb.title)}" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:500; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="edit-tb-start" class="btn" value="${tb.start_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            ${isCompleted || tb.end_date ? `
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:500; color:var(--secondary); min-width:50px;">종료일:</span>
                <input type="date" id="edit-tb-end" class="btn" value="${tb.end_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>` : ''}
            <button class="btn apms-button apms-button--primary btn-primary" style="margin-top:8px; padding:12px;" onclick="handlePatchTextbook('${tbId}', false)">정보 수정 저장</button>
        </div>
        <div style="border-top:1px solid var(--border); padding-top:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:4px;">상태 변경</div>
            <div style="display:flex; gap:8px;">
                ${isCompleted || isHidden 
                    ? `<button class="btn apms-button apms-button--quiet" style="flex:1; padding:10px; font-size:12px;" onclick="handlePatchTextbook('${tbId}', true, 'active')">진행중으로 복구</button>`
                    : `<button class="btn apms-button apms-button--quiet" style="flex:1; padding:10px; font-size:12px; color:var(--success); background:rgba(0,208,132,0.1); border:none; font-weight:500;" onclick="handlePatchTextbook('${tbId}', true, 'completed')">교재 완료 처리</button>
                       <button class="btn apms-button apms-button--quiet" style="flex:1; padding:10px; font-size:12px; background:var(--surface-2); border:none;" onclick="handlePatchTextbook('${tbId}', true, 'hidden')">숨김 보류</button>`
                }
            </div>
            <button class="btn apms-button apms-button--quiet" style="margin-top:12px; padding:10px; font-size:12px; color:var(--error); background:rgba(var(--error-rgb),0.1); border:none; font-weight:500;" onclick="handleDeleteTextbook('${tbId}')">교재 완전 삭제</button>
        </div>
    `);
}

async function handlePatchTextbook(tbId, isStatusChange, targetStatus = 'active') {
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'dashboard' } };
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
            if (resumeClassProgressAfterInlineTextbookAction(state.ui?.classProgressInlineTextbookAction)) return;
            if (refreshGlobalTextbookManageAfterMutation()) return;
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
    const returnCtx = state.ui.modalReturnView || { type: 'textbookManage', parentReturn: state.ui.textbookReturnView || { type: 'dashboard' } };

    try {
        const r = await api.delete('class-textbooks', tbId);
        if (r?.success) {
            toast('교재가 삭제되었습니다.', 'info');
            await loadData();
            if (resumeClassProgressAfterInlineTextbookAction(state.ui?.classProgressInlineTextbookAction)) return;
            if (refreshGlobalTextbookManageAfterMutation()) return;
            returnToPreviousManagementView('dashboard', returnCtx);
            return;
        }
        toast(r?.message || r?.error || '교재 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteTextbook] failed:', e);
        toast('교재 삭제 중 오류가 발생했습니다.', 'error');
    }
}
