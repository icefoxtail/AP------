/**
 * AP Math OS [js/ws-progress-books.js] — M8 진도·교재 작업 화면의 "교재 관리 모드"
 *
 * 진도 작업 화면(classroom.js openClassRecordModal)은 공통 W 등급 부품(.apms-modal--workspace) 위에 있고,
 * 이 파일은 그 안에서 교재를 관리하는 모드를 맡는다.
 *   - 목록 열: 진행 중/완료/숨김 교재를 고르는 목록(renderWsProgressManageList)
 *   - 상세 열: 고른 교재의 이름·날짜 수정, 상태 변경, 삭제(renderWsProgressTextbookEditor)
 *   - 교재를 저장하면(textbook.js handleAdd/Patch/DeleteTextbook) 응답 행을 state.db에 넣은 뒤
 *     refreshClassProgressTextbooksFromDb()가 같은 자리에서 다시 그린다. 전체 loadData()·모달 재오픈이 없다.
 *   - 서랍 "교재관리"(openGlobalTextbookManage)는 같은 화면을 교재 관리 모드 + 모든 반 탭으로 연다.
 * 저장 API 호출·payload는 textbook.js와 classroom.js(진도 저장)가 그대로 갖고 있다.
 */

function getWsProgressAllClasses() {
    const classes = Array.isArray(state.db?.classes) ? state.db.classes.slice() : [];
    const sorted = typeof sortClassesForManagement === 'function'
        ? sortClassesForManagement(classes)
        : classes.sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    // 숨김 반은 뒤로(안정 정렬이므로 학년·이름 순서는 유지된다).
    return sorted.sort((a, b) => (Number(a.is_active) === 0 ? 1 : 0) - (Number(b.is_active) === 0 ? 1 : 0));
}

// 서랍 "교재관리": 진도 작업 화면을 교재 관리 모드로, 반 탭은 모든 반으로 연다.
// options: { classId, textbookId, addOpen } — 옛 교재 모달 래퍼가 쓴다.
function openGlobalTextbookManage(options = {}) {
    const classes = getWsProgressAllClasses();
    if (!classes.length) return toast('관리할 반이 없습니다.', 'warn');
    const mine = classes.filter(cls => Number(cls.is_active) !== 0
        && (typeof isClassVisibleForCurrentTeacher !== 'function' || isClassVisibleForCurrentTeacher(cls)));
    const target = classes.find(cls => String(cls.id) === String(options.classId || '')) || mine[0] || classes[0];
    return openClassRecordModal(target.id, undefined, {
        mode: 'manage',
        classScope: 'all',
        textbookId: options.textbookId || '',
        addOpen: !!options.addOpen
    });
}

const WS_PROGRESS_STATUS_LABEL = Object.freeze({ active: '진행 중', completed: '완료', hidden: '숨김' });
const WS_PROGRESS_STATUS_CLASS = Object.freeze({ active: 'current', completed: 'complete', hidden: 'unlearned' });

function getWsProgressManageBooks() {
    const modalState = getClassProgressModalState();
    return Array.isArray(modalState.allBooks) ? modalState.allBooks : [];
}

// 교재 관리 모드에서 오른쪽 칸에 열린 교재: 고른 것 → 진도 입력에서 보던 것 → 첫 교재
function getWsProgressManageSelectedId() {
    const modalState = getClassProgressModalState();
    const books = getWsProgressManageBooks();
    const has = id => !!id && books.some(tb => String(tb?.id || '') === String(id));
    if (has(modalState.manageSelectedId)) return String(modalState.manageSelectedId);
    if (has(modalState.selectedTextbookId)) return String(modalState.selectedTextbookId);
    const first = books.find(tb => tb?.status === 'active') || books[0];
    return first ? String(first.id) : '';
}

function renderWsProgressManageItem(tb, selectedId) {
    const id = String(tb?.id || '');
    const status = String(tb?.status || 'active');
    const selected = id === selectedId;
    const range = tb?.isFallback
        ? '반 설정의 교재명'
        : `시작 ${tb?.start_date || '-'}${tb?.end_date ? ` · 종료 ${tb.end_date}` : ''}`;
    return `<article class="ws-progress-manage-item${selected ? ' is-selected' : ''}" data-textbook-id="${apEscapeHtml(id)}">
        <button type="button" class="ws-progress-manage-item__select" aria-pressed="${selected ? 'true' : 'false'}" onclick="wsProgressSelectManageBook(${classProgressJsArg(id)})">
            <span class="ws-progress-manage-item__title">${apEscapeHtml(String(tb?.title || ''))}</span>
            <span class="ap-class-progress-status ap-class-progress-status--${WS_PROGRESS_STATUS_CLASS[status] || 'current'}">${WS_PROGRESS_STATUS_LABEL[status] || '진행 중'}</span>
            <span class="ws-progress-manage-item__meta">${apEscapeHtml(range)}</span>
        </button>
    </article>`;
}

function renderWsProgressManageList() {
    const books = getWsProgressManageBooks();
    const selectedId = getWsProgressManageSelectedId();
    if (!books.length) return '<div class="apms-empty ap-class-progress-empty">등록된 교재가 없습니다. 위의 "교재 추가"로 이 반의 교재를 등록하세요.</div>';
    return ['active', 'completed', 'hidden'].map(status => {
        const items = books.filter(tb => String(tb?.status || 'active') === status);
        if (!items.length && status !== 'active') return '';
        return `<section class="ws-progress-manage-section">
            <div class="ws-progress-manage-section__head"><h4>${WS_PROGRESS_STATUS_LABEL[status]}</h4><span>${items.length}</span></div>
            ${items.length ? items.map(tb => renderWsProgressManageItem(tb, selectedId)).join('') : '<div class="apms-empty ap-class-progress-empty">진행 중인 교재가 없습니다.</div>'}
        </section>`;
    }).join('');
}

function renderWsProgressTextbookEditor() {
    const modalState = getClassProgressModalState();
    const books = getWsProgressManageBooks();
    const id = getWsProgressManageSelectedId();
    const book = books.find(tb => String(tb?.id || '') === id) || null;
    if (!book) {
        return `<div class="ws-progress-editor ws-progress-editor--empty">
            <div class="apms-empty">교재가 없습니다. 왼쪽 위 "교재 추가"로 ${apEscapeHtml(modalState.className || '이 반')}의 교재를 등록하세요.</div>
        </div>`;
    }
    const status = String(book.status || 'active');
    const chip = `<span class="ap-class-progress-status ap-class-progress-status--${WS_PROGRESS_STATUS_CLASS[status] || 'current'}">${WS_PROGRESS_STATUS_LABEL[status] || '진행 중'}</span>`;
    const head = `<div class="ap-class-progress-detail-head ws-progress-editor__head">
        <div class="ap-class-progress-detail-head__main">
            <div class="ap-class-progress-detail-head__title">${apEscapeHtml(String(book.title || ''))}</div>
            <div class="ap-class-progress-detail-head__meta">${apEscapeHtml(modalState.className || '')} · 교재 관리</div>
        </div>
        ${chip}
    </div>`;
    if (book.isFallback) {
        return `<div class="ws-progress-editor" data-selected-textbook-id="${apEscapeHtml(String(book.id))}">${head}
            <p class="ws-progress-editor__note">이 교재명은 반 설정에 적힌 값이라 여기서 고칠 수 없습니다. "교재 추가"로 교재를 등록하면 이 이름 대신 쓰입니다.</p>
        </div>`;
    }
    const idArg = classProgressJsArg(String(book.id));
    const showEnd = status === 'completed' || !!book.end_date;
    const field = (fieldId, label, type, value) => `<label class="apms-unified-label" for="${fieldId}">${label}</label>
        <input id="${fieldId}" type="${type}" class="apms-unified-control" value="${apEscapeHtml(String(value || ''))}" data-orig="${apEscapeHtml(String(value || ''))}" autocomplete="off">`;
    const stateButtons = status === 'active'
        ? `<button type="button" class="btn apms-button apms-button--quiet apms-unified-quiet" data-ws-textbook-complete onclick="submitClassProgressTextbookPatch(${idArg}, 'completed')">교재 완료 처리</button>
           <button type="button" class="btn apms-button apms-button--quiet apms-unified-quiet" data-ws-textbook-hide onclick="submitClassProgressTextbookPatch(${idArg}, 'hidden')">숨김 보류</button>`
        : `<button type="button" class="btn apms-button apms-button--quiet apms-unified-quiet" data-ws-textbook-restore onclick="submitClassProgressTextbookPatch(${idArg}, 'active')">진행 중으로 복구</button>`;
    return `<div class="ws-progress-editor" data-selected-textbook-id="${apEscapeHtml(String(book.id))}">
        ${head}
        <div class="ws-progress-editor__form apms-unified-form">
            ${field('edit-tb-title', '교재명', 'text', book.title)}
            ${field('edit-tb-start', '시작일', 'date', book.start_date)}
            ${showEnd ? field('edit-tb-end', '종료일', 'date', book.end_date) : ''}
            <div class="ws-progress-editor__save">
                <button type="button" class="btn apms-button apms-button--primary btn-primary apms-unified-primary" data-ws-textbook-save onclick="wsProgressSaveTextbookInfo(${idArg})">이름·날짜 저장</button>
            </div>
        </div>
        <section class="ws-progress-editor__section">
            <h4>상태 변경</h4>
            <div class="ws-progress-editor__buttons">${stateButtons}</div>
        </section>
        <section class="ws-progress-editor__section ws-progress-editor__section--danger">
            <h4>삭제</h4>
            <button type="button" class="btn apms-button apms-button--quiet apms-unified-quiet ws-progress-danger" data-ws-textbook-delete onclick="submitClassProgressTextbookDelete(${idArg})">교재 완전 삭제</button>
        </section>
    </div>`;
}

// 목록에서 교재를 고른다. 서버 호출 없이 상세 칸만 바뀐다. 이름·날짜를 고치다 만 칸이 있으면 한 번 확인한다.
function wsProgressSelectManageBook(textbookId) {
    const modalState = getClassProgressModalState();
    const id = String(textbookId || '');
    if (!id || id === String(modalState.manageSelectedId || '')) return;
    if (hasPendingWsProgressTextbookEdit()) {
        const message = '저장하지 않은 교재 수정이 있습니다. 저장하지 않고 다른 교재를 열까요?';
        const ok = typeof window !== 'undefined' && typeof window.confirm === 'function' ? window.confirm(message) : true;
        if (!ok) return;
    }
    modalState.manageSelectedId = id;
    renderClassProgressTextbookPanelInPlace(false);
    rerenderClassProgressTextbookDetail();
    scrollWsProgressDetailIntoView();
}

// 휴대폰처럼 목록 위·상세 아래로 쌓인 화면에서는 교재를 고르면 상세가 화면 밖에 있으므로 상세 위로 스크롤한다.
// 두 열이면(태블릿·PC) 아무것도 하지 않는다.
function scrollWsProgressDetailIntoView() {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;
    const layout = document.querySelector('.ws-progress__layout');
    const detail = document.querySelector('.ws-progress__detail');
    if (!layout || !detail || typeof detail.scrollIntoView !== 'function' || typeof window.getComputedStyle !== 'function') return;
    if (window.getComputedStyle(layout).flexDirection !== 'column') return;
    detail.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function wsProgressSaveTextbookInfo(textbookId) {
    if (typeof handlePatchTextbook !== 'function') return toast('교재관리 기능을 불러오지 못했습니다.', 'warn');
    return handlePatchTextbook(String(textbookId), false);
}

// 이름·날짜 칸을 사용자가 고쳤는데 아직 저장하지 않았는가 (닫기·반 전환·다른 교재 열기 때 확인용)
function hasPendingWsProgressTextbookEdit() {
    const modalState = getClassProgressModalState();
    if (!modalState.manageMode || typeof document === 'undefined') return false;
    return ['edit-tb-title', 'edit-tb-start', 'edit-tb-end'].some(fieldId => {
        const el = document.getElementById(fieldId);
        return !!el && el.dataset && typeof el.dataset.orig === 'string' && String(el.value || '') !== el.dataset.orig;
    });
}

function isWsProgressDraftChanged() {
    const modalState = getClassProgressModalState();
    const meta = state.ui?.classProgressModalMeta;
    if (!meta || typeof meta.draftBaseline !== 'string') return false;
    try {
        syncClassProgressTextbookDraftsFromDom();
        syncClassProgressUnitDraftsFromDom();
        syncClassProgressPhaseDraftFromDom();
        syncClassProgressCourseAddDraftFromDom();
    } catch (error) {
        console.warn('[isWsProgressDraftChanged] could not sync the current draft:', error);
    }
    return getClassProgressDraftFingerprint() !== meta.draftBaseline && String(meta.classId || '') === String(modalState.classId || '');
}

// 교재 저장(추가·수정·삭제) 뒤 같은 자리에서 갱신한다. state.db.class_textbooks가 이미 새 값이어야 한다.
// options: selectId(방금 추가·수정한 교재) · closeAddForm(추가 폼 닫고 새 교재 고르기) · removedId · deferRender(그리기는 부른 쪽이)
function refreshClassProgressTextbooksFromDb(options = {}) {
    const modalState = getClassProgressModalState();
    if (!modalState.classId || modalState.loading || !Array.isArray(modalState.books)) return false;
    const meta = state.ui?.classProgressModalMeta;
    const wasChanged = isWsProgressDraftChanged();

    const cid = String(modalState.classId);
    const cls = (state.db?.classes || []).find(item => String(item.id) === cid);
    const classBooks = (state.db?.class_textbooks || []).filter(tb => String(tb.class_id) === cid);
    let visibleBooks = classBooks.filter(tb => tb.status === 'active').concat(classBooks.filter(tb => tb.status === 'completed'));
    if (visibleBooks.length === 0 && cls?.textbook) {
        visibleBooks = [{ id: 'fallback', title: cls.textbook, status: 'active', isFallback: true }];
    }
    modalState.allBooks = classBooks.concat(visibleBooks.filter(tb => tb?.isFallback));
    modalState.books = visibleBooks;

    // 입력하던 진도 초안은 그대로 두고, 새로 보이게 된 교재만 저장된 값(없으면 빈 칸)으로 채운다.
    const previous = modalState.progressByTextbook || {};
    const saved = Array.isArray(modalState.savedProgressRows) ? modalState.savedProgressRows : [];
    const next = {};
    visibleBooks.forEach(tb => {
        const key = String(tb.id);
        if (previous[key]) { next[key] = previous[key]; return; }
        const prev = saved.find(row => String(row.textbook_id) === key
            || (tb.id === 'fallback' && row.textbook_title_snapshot === tb.title));
        const text = prev ? prev.progress_text : '';
        next[key] = { progressText: text, isChecked: !!(prev || text) };
    });
    modalState.progressByTextbook = next;

    const visibleIds = new Set(visibleBooks.map(tb => String(tb.id)));
    const allIds = new Set(modalState.allBooks.map(tb => String(tb.id)));
    if (options.removedId && String(modalState.manageSelectedId || '') === String(options.removedId)) modalState.manageSelectedId = '';
    if (options.selectId && allIds.has(String(options.selectId))) modalState.manageSelectedId = String(options.selectId);
    if (options.closeAddForm) {
        modalState.inlineAddOpen = false;
        if (options.selectId && visibleIds.has(String(options.selectId))) modalState.selectedTextbookId = String(options.selectId);
    }
    if (!visibleIds.has(String(modalState.selectedTextbookId || ''))) {
        const pick = visibleBooks.find(tb => tb.status === 'active') || visibleBooks[0] || null;
        modalState.selectedTextbookId = String(pick?.id || '');
    }

    if (options.deferRender) return true;
    renderClassProgressTextbookPanelInPlace(false);
    rerenderClassProgressTextbookDetail();
    // 교재만 바뀌었으면 "변경됨" 기준선을 새 상태로 옮긴다. 진도 입력이 있던 중이면 그대로 둔다.
    if (!wasChanged && meta) meta.draftBaseline = getClassProgressDraftFingerprint();
    const added = options.closeAddForm && options.selectId
        ? document.querySelector?.(`[data-textbook-id="${String(options.selectId).replace(/"/g, '')}"]`)
        : null;
    if (added && typeof added.scrollIntoView === 'function') added.scrollIntoView({ block: 'nearest' });
    return true;
}
