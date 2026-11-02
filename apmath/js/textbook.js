/**
 * AP Math OS 1.0 [js/textbook.js]
 * Split from dashboard.js.
 *
 * 교재 추가·수정·삭제는 이 파일의 handleAddTextbook / handlePatchTextbook / handleDeleteTextbook 한 벌이다.
 * 진도 작업 화면(classroom.js 진도 구간 + ws-progress-books.js)이 이 함수들을 부르고,
 * 저장이 끝나면 응답으로 받은 행을 state.db에 바로 반영한 뒤 같은 자리에서 다시 그린다(전체 loadData·모달 재오픈 없음).
 * 옛 교재 모달 3종(openTextbookManageModal / openAddTextbookModal / openEditTextbookModal)은 호출처가 없어
 * 새 교재 관리 모드를 여는 얇은 래퍼만 남겼다(삭제는 별도 PR).
 */

function textbookJsArg(value) {
    if (typeof apJsArg === 'function') return apJsArg(value);
    return `'${apEscapeHtml(String(value ?? '')).replace(/'/g, '&#39;')}'`;
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
        : `<button type="button" class="btn apms-button apms-button--primary btn-primary apms-unified-primary" data-ws-textbook-submit onclick="${submitAction}">${apEscapeHtml(submitLabel)}</button>`;
    const titleId = apEscapeHtml(String(inputIds.title));
    const startId = apEscapeHtml(String(inputIds.startDate));

    return `<div class="ap-class-progress-inline-form apms-unified-form"${formId}>
        <div class="ap-class-progress-inline-form__head">
            <strong>새 교재 등록</strong>
            <button type="button" class="btn apms-button apms-button--quiet" onclick="${cancelAction}">취소</button>
        </div>
        <input type="hidden" id="${apEscapeHtml(String(inputIds.classId))}" value="${apEscapeHtml(classId)}">
        <label class="apms-unified-label" for="${titleId}">교재명</label>
        <input type="text" id="${titleId}" class="apms-unified-control" value="${apEscapeHtml(title)}" placeholder="예: 개념원리 중1-1" autocomplete="off">
        <label class="apms-unified-label" for="${startId}">시작일</label>
        <input type="date" id="${startId}" class="apms-unified-control" value="${apEscapeHtml(date)}">
        ${submitHtml}
    </div>`;
}

// ---- 교재 저장 한 벌: API 호출 → state.db 반영 → 열려 있는 진도 작업 화면을 같은 자리에서 갱신 ----

function upsertTextbookInDb(item) {
    if (!item || !item.id) return false;
    if (!state.db) state.db = {};
    const list = Array.isArray(state.db.class_textbooks) ? state.db.class_textbooks : [];
    const id = String(item.id);
    const index = list.findIndex(book => String(book?.id || '') === id);
    state.db.class_textbooks = index >= 0
        ? list.map((book, i) => (i === index ? { ...book, ...item } : book))
        : list.concat([item]);
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
    return true;
}

function removeTextbookFromDb(tbId) {
    const id = String(tbId || '');
    if (!id || !Array.isArray(state.db?.class_textbooks)) return false;
    state.db.class_textbooks = state.db.class_textbooks.filter(book => String(book?.id || '') !== id);
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
    return true;
}

function runTextbookMutation(label, task) {
    if (!state.ui) state.ui = {};
    if (state.ui.textbookMutationBusy) return Promise.resolve(null);
    state.ui.textbookMutationBusy = true;
    return Promise.resolve()
        .then(task)
        .catch(error => {
            console.error(`[${label}] failed:`, error);
            toast('교재 저장 중 오류가 발생했습니다.', 'error');
            return null;
        })
        .finally(() => { state.ui.textbookMutationBusy = false; });
}

function afterTextbookMutation(options = {}) {
    if (options.deferRefresh) return;
    if (typeof refreshClassProgressTextbooksFromDb === 'function') refreshClassProgressTextbooksFromDb(options);
}

// options.inputIds: 입력칸 ID(진도 모달의 과정 추가 패널은 따로 쓴다)
// options.binding: 새 교재를 만들 때 함께 보낼 과정 연결 { progress_curriculum_key, progress_level_key, progress_course_key }
// options.deferRefresh: true면 화면 갱신을 부른 쪽이 한다(과정 적용 흐름)
async function handleAddTextbook(options = {}) {
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

    return runTextbookMutation('handleAddTextbook', async () => {
        const r = await api.post('class-textbooks', {
            class_id: cid,
            title: title,
            start_date: startDate,
            ...(options.binding || {})
        });
        if (!r?.success) {
            toast(r?.message || r?.error || '교재 저장에 실패했습니다.', 'error');
            return null;
        }
        const item = r.item || r.textbook || null;
        if (item?.id) upsertTextbookInDb(item);
        else if (typeof loadData === 'function') await loadData(); // 응답에 행이 없으면 예전 방식으로 맞춘다
        toast('교재가 등록되었습니다.', 'success');
        afterTextbookMutation({ selectId: item?.id, deferRefresh: options.deferRefresh, closeAddForm: true });
        return item || { id: '' };
    });
}

async function handlePatchTextbook(tbId, isStatusChange, targetStatus = 'active') {
    const title = document.getElementById('edit-tb-title')?.value.trim() || '';
    const startDate = document.getElementById('edit-tb-start')?.value || '';
    const endDateEl = document.getElementById('edit-tb-end');
    if (!title) return toast('교재명을 입력하세요.', 'warn');

    const payload = { title, start_date: startDate };
    if (endDateEl) payload.end_date = endDateEl.value;

    if (isStatusChange) {
        payload.status = targetStatus;
        if (targetStatus === 'active') payload.clear_end_date = true;
    }
    return patchTextbookWithPayload(tbId, payload, isStatusChange);
}

// 입력칸을 거치지 않고 payload를 직접 보낼 때(상태 버튼). 필드 구성은 handlePatchTextbook과 같다.
function patchTextbookWithPayload(tbId, payload, isStatusChange) {
    return runTextbookMutation('handlePatchTextbook', async () => {
        const r = await api.patch(`class-textbooks/${tbId}`, payload);
        if (!r?.success) {
            toast(r?.message || r?.error || '교재 수정에 실패했습니다.', 'error');
            return null;
        }
        if (r.item?.id) upsertTextbookInDb(r.item);
        else if (typeof loadData === 'function') await loadData();
        toast(isStatusChange ? '교재 상태가 변경되었습니다.' : '교재 정보가 수정되었습니다.', 'success');
        afterTextbookMutation({ selectId: tbId });
        return r.item || { id: String(tbId) };
    });
}

async function handleDeleteTextbook(tbId) {
    if (!confirm('이 교재를 완전히 삭제하시겠습니까?')) return;
    return runTextbookMutation('handleDeleteTextbook', async () => {
        const r = await api.delete('class-textbooks', tbId);
        if (!r?.success) {
            toast(r?.message || r?.error || '교재 삭제에 실패했습니다.', 'error');
            return null;
        }
        removeTextbookFromDb(tbId);
        toast('교재가 삭제되었습니다.', 'info');
        afterTextbookMutation({ removedId: tbId });
        return { id: String(tbId), deleted: true };
    });
}

// ---- 옛 교재 모달 3종: 새 교재 관리 모드로 가는 얇은 래퍼 (호출처 없음, 삭제는 별도 PR) ----

function openTextbookManageModal() {
    if (typeof openGlobalTextbookManage === 'function') return openGlobalTextbookManage();
}

function openAddTextbookModal() {
    if (typeof openGlobalTextbookManage === 'function') return openGlobalTextbookManage({ addOpen: true });
}

function openEditTextbookModal(tbId) {
    const book = (state.db?.class_textbooks || []).find(item => String(item?.id || '') === String(tbId));
    if (!book || typeof openGlobalTextbookManage !== 'function') return;
    return openGlobalTextbookManage({ classId: String(book.class_id || ''), textbookId: String(book.id || '') });
}
