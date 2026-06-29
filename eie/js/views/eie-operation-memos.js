(function () {
    var memoModalRows = [];

    function esc(value) {
        if (window.EieApp && typeof EieApp.escapeHtml === 'function') return EieApp.escapeHtml(value);
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    // 운영 카드는 원장 대시보드(.eie-v2-screen 밖)와 선생님 대시보드(.eie-v2-screen 안)
    // 양쪽에 같은 톤으로 보여야 하므로, 카드 자체를 .eie-v2-screen 으로 감싸 EIE
    // 패널 토큰(버튼/표면/다크모드 색)이 항상 해석되게 한다. display:contents 라
    // 레이아웃/min-height 체인에는 영향이 없다.
    function eieScreenWrap(inner) {
        return '<div class="eie-v2-screen" style="display:contents">' + inner + '</div>';
    }

    function jsArg(value) {
        return esc(JSON.stringify(String(value == null ? '' : value)));
    }

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
    }

    function addDays(iso, days) {
        var date = new Date(String(iso || todayIso()) + 'T00:00:00');
        date.setDate(date.getDate() + Number(days || 0));
        return date.toLocaleDateString('sv-SE');
    }

    function toBool(value) {
        return value === true || value === 1 || value === '1' || value === 'true';
    }

    function memoRowsFromData(data) {
        var payload = data && (data.operationMemos || data.operation_memos || data.memos || data.items || data.data || data);
        return Array.isArray(payload) ? payload : [];
    }

    function memoId(row) {
        return row && (row.id || row.memo_id || row.memoId || '');
    }

    function memoDate(row) {
        return String((row && (row.memo_date || row.memoDate || row.date)) || todayIso()).slice(0, 10);
    }

    function memoContent(row) {
        return (row && (row.content || row.memo || row.text || row.title)) || '';
    }

    function memoPinned(row) {
        return toBool(row && (row.is_pinned != null ? row.is_pinned : row.isPinned));
    }

    function memoDone(row) {
        return toBool(row && (row.is_done != null ? row.is_done : row.isDone));
    }

    function formatShortDate(iso) {
        var parts = String(iso || '').split('-');
        if (parts.length < 3) return esc(iso);
        return Number(parts[1]) + '/' + Number(parts[2]);
    }

    function dateBadge(row) {
        if (memoPinned(row)) return '고정';
        return formatShortDate(memoDate(row));
    }

    function visibleMemos(rows) {
        var today = todayIso();
        var until = addDays(today, 7);
        return rows.filter(function (row) {
            if (memoDone(row)) return false;
            if (memoPinned(row)) return true;
            var date = memoDate(row);
            return date >= today && date <= until;
        }).sort(function (a, b) {
            if (memoPinned(a) !== memoPinned(b)) return memoPinned(a) ? -1 : 1;
            var dateCompare = memoDate(a).localeCompare(memoDate(b));
            if (dateCompare) return dateCompare;
            return String(b.created_at || b.createdAt || '').localeCompare(String(a.created_at || a.createdAt || ''));
        });
    }

    function notify(message, type) {
        if (typeof window.toast === 'function') window.toast(message, type || 'info');
    }

    // CRUD 성공 후 현재 라우트(원장/선생님 대시보드)를 다시 그려 메모 카드를
    // 최신화한다. READ_CACHE 무효화는 EieApi가 mutation 성공 시 처리한다.
    function refreshDashboardCards() {
        if (typeof window.refreshEieOperationDashboardCards === 'function') {
            try { return window.refreshEieOperationDashboardCards(); } catch (err) { /* 갱신 실패가 흐름을 깨지 않게 */ }
        }
        return undefined;
    }

    function openCompatModal(title, body) {
        if (typeof window.openModal === 'function') {
            window.openModal(title, body);
            return;
        }
        if (typeof window.showModal === 'function') {
            window.showModal(title, body);
            return;
        }
        notify(title, 'info');
    }

    function renderEmpty() {
        return '<div class="eie-operation-empty" style="padding:12px 0;color:var(--eie-p-text-sub);font-size:13px;">표시할 메모가 없습니다.</div>';
    }

    function renderMemoRow(row, compact, mode) {
        var id = memoId(row);
        var label = memoPinned(row) ? '고정' : formatShortDate(memoDate(row));
        var isTeacher = String(mode || 'owner') === 'teacher';
        var rowAction = compact && !isTeacher
            ? 'event.stopPropagation(); openEieTodoMemoModal()'
            : 'event.stopPropagation(); openEditEieTodoMemoModal(' + jsArg(id) + ')';
        return '<div class="eie-operation-memo-row" style="display:grid;grid-template-columns:24px 1fr auto;gap:8px;align-items:center;padding:8px 0;border-top:1px solid var(--eie-p-border);">'
            + '<input type="checkbox" aria-label="메모 완료" onclick="event.stopPropagation()" onchange="toggleEieMemoDone(' + jsArg(id) + ', this.checked)"' + (memoDone(row) ? ' checked' : '') + '>'
            + '<button type="button" onclick="' + rowAction + '" style="appearance:none;border:0;background:transparent;text-align:left;padding:0;min-width:0;cursor:pointer;">'
            + '<span style="display:block;font-size:' + (compact ? '13px' : '14px') + ';font-weight:600;color:var(--eie-p-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(memoContent(row)) + '</span>'
            + '</button>'
            + '<span style="font-size:12px;color:var(--eie-p-btn-save-bg);font-weight:700;">' + esc(label) + '</span>'
            + '</div>';
    }

    function renderEieMemoDashboardCard(data, options) {
        var mode = options && options.mode ? String(options.mode) : 'owner';
        var rows = visibleMemos(memoRowsFromData(data));
        var today = formatShortDate(todayIso());
        var openAction = mode === 'teacher' ? '' : ' onclick="openEieTodoMemoModal()"';
        var openStyle = mode === 'teacher' ? 'flex:1;' : 'flex:1;cursor:pointer;';
        return eieScreenWrap('<section class="eie-operation-card eie-operation-memos-card eie-p-card" data-eie-operation-mode="' + esc(mode) + '" style="min-height:100%;display:flex;flex-direction:column;gap:8px;color:var(--eie-p-text);">'
            + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
            + '<div style="min-width:0;"><h2 style="margin:0;font-size:16px;line-height:1.2;">메모</h2>'
            + '<p style="margin:3px 0 0;color:var(--eie-p-text-sub);font-size:12px;line-height:1.2;">내 개인 메모</p></div>'
            + '<span style="font-size:12px;color:var(--eie-p-text-sub);">' + esc(today) + '</span>'
            + '</div>'
            + '<div' + openAction + ' style="' + openStyle + '">'
            + (rows.length ? rows.map(function (row) { return renderMemoRow(row, true, mode); }).join('') : renderEmpty())
            + '</div>'
            + '<div class="eie-operation-card-footer">'
            + '<button type="button" class="eie-p-btn-new eie-operation-add-btn" onclick="event.stopPropagation(); openEieTodoMemoModal()">+ 메모 추가</button>'
            + '</div>'
            + '</section>');
    }

    async function loadMemos() {
        if (!window.EieApi || typeof EieApi.getOperationMemos !== 'function') {
            throw new Error('메모 API를 찾을 수 없습니다.');
        }
        var payload = await EieApi.getOperationMemos();
        return memoRowsFromData(payload);
    }

    function renderMemoModal(rows) {
        var list = rows.length
            ? rows.map(function (row) { return renderMemoRow(row, false); }).join('')
            : renderEmpty();
        return '<div class="eie-v2-screen">'
            + '<div class="eie-p-card" style="box-shadow:none;border:0;background:transparent;padding:0;gap:10px;">'
            + '<div style="display:grid;grid-template-columns:140px 1fr auto;gap:8px;align-items:end;">'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">날짜<input id="eie-new-memo-date" type="date" value="' + esc(todayIso()) + '"></label>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">내용<input id="eie-new-memo-content" type="text" placeholder="메모 입력" onkeydown="if(event.key===\'Enter\') addEieTodoMemo()"></label>'
            + '<label style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--eie-p-text-sub);padding-bottom:8px;"><input id="eie-new-memo-pinned" type="checkbox">고정</label>'
            + '</div>'
            + '<button type="button" class="eie-p-btn-new" onclick="addEieTodoMemo()" style="width:100%;">추가</button>'
            + '<div style="margin-top:10px;">' + list + '</div>'
            + '</div>'
            + '</div>';
    }

    async function openEieTodoMemoModal() {
        try {
            memoModalRows = await loadMemos();
            openCompatModal('메모', renderMemoModal(memoModalRows));
        } catch (err) {
            notify(err && err.message ? err.message : '메모를 불러오지 못했습니다.', 'error');
        }
    }

    async function addEieTodoMemo() {
        var contentEl = document.getElementById('eie-new-memo-content');
        var dateEl = document.getElementById('eie-new-memo-date');
        var pinnedEl = document.getElementById('eie-new-memo-pinned');
        var content = contentEl ? contentEl.value.trim() : '';
        if (!content) {
            notify('메모 내용을 입력해 주세요.', 'warn');
            return;
        }
        try {
            await EieApi.createOperationMemo({
                content: content,
                memoDate: dateEl && dateEl.value ? dateEl.value : todayIso(),
                isPinned: !!(pinnedEl && pinnedEl.checked)
            });
            notify('메모를 추가했습니다.', 'success');
            await openEieTodoMemoModal();
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '메모 추가에 실패했습니다.', 'error');
        }
    }

    async function toggleEieMemoDone(id, done) {
        if (!id) return;
        try {
            await EieApi.updateOperationMemo(id, { isDone: !!done });
            notify(done ? '메모를 완료했습니다.' : '메모 완료를 해제했습니다.', 'success');
            // 모달이 열려 있으면 모달 목록도 갱신하되, 대시보드 카드는 모달 여부와
            // 무관하게 항상 다시 그린다(카드에서 직접 체크한 경우 즉시 사라지도록).
            var overlay = document.getElementById('eie-compat-modal-overlay');
            if (overlay && overlay.style.display !== 'none') await openEieTodoMemoModal();
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '메모 상태 변경에 실패했습니다.', 'error');
        }
    }

    async function deleteEieMemo(id) {
        if (!id) return;
        if (!window.confirm || window.confirm('메모를 삭제할까요?')) {
            try {
                await EieApi.deleteOperationMemo(id);
                notify('메모를 삭제했습니다.', 'success');
                await openEieTodoMemoModal();
                refreshDashboardCards();
            } catch (err) {
                notify(err && err.message ? err.message : '메모 삭제에 실패했습니다.', 'error');
            }
        }
    }

    async function openEditEieTodoMemoModal(id) {
        try {
            if (!memoModalRows.length) memoModalRows = await loadMemos();
            var row = memoModalRows.find(function (item) { return String(memoId(item)) === String(id); });
            if (!row) throw new Error('메모를 찾을 수 없습니다.');
            openCompatModal('메모 수정', '<div class="eie-v2-screen">'
                + '<div class="eie-p-card" style="box-shadow:none;border:0;background:transparent;padding:0;gap:10px;">'
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">날짜<input id="eie-edit-memo-date" type="date" value="' + esc(memoDate(row)) + '"></label>'
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">내용<textarea id="eie-edit-memo-content" rows="4">' + esc(memoContent(row)) + '</textarea></label>'
                + '<label style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--eie-p-text-sub);"><input id="eie-edit-memo-pinned" type="checkbox"' + (memoPinned(row) ? ' checked' : '') + '>고정</label>'
                + '<label style="display:flex;gap:6px;align-items:center;font-size:12px;color:var(--eie-p-text-sub);"><input id="eie-edit-memo-done" type="checkbox"' + (memoDone(row) ? ' checked' : '') + '>완료</label>'
                + '<div style="display:flex;gap:8px;justify-content:flex-end;">'
                + '<button type="button" class="eie-p-btn-danger" onclick="deleteEieMemo(' + jsArg(id) + ')">삭제</button>'
                + '<button type="button" class="eie-p-btn-save" onclick="handleEditEieTodoMemo(' + jsArg(id) + ')">저장</button>'
                + '</div>'
                + '</div>'
                + '</div>');
        } catch (err) {
            notify(err && err.message ? err.message : '메모 수정창을 열지 못했습니다.', 'error');
        }
    }

    async function handleEditEieTodoMemo(id) {
        var dateEl = document.getElementById('eie-edit-memo-date');
        var contentEl = document.getElementById('eie-edit-memo-content');
        var pinnedEl = document.getElementById('eie-edit-memo-pinned');
        var doneEl = document.getElementById('eie-edit-memo-done');
        var content = contentEl ? contentEl.value.trim() : '';
        if (!content) {
            notify('메모 내용을 입력해 주세요.', 'warn');
            return;
        }
        try {
            await EieApi.updateOperationMemo(id, {
                content: content,
                memoDate: dateEl && dateEl.value ? dateEl.value : todayIso(),
                isPinned: !!(pinnedEl && pinnedEl.checked),
                isDone: !!(doneEl && doneEl.checked)
            });
            notify('메모를 저장했습니다.', 'success');
            await openEieTodoMemoModal();
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '메모 저장에 실패했습니다.', 'error');
        }
    }

    window.renderEieMemoDashboardCard = renderEieMemoDashboardCard;
    window.openEieTodoMemoModal = openEieTodoMemoModal;
    window.addEieTodoMemo = addEieTodoMemo;
    window.toggleEieMemoDone = toggleEieMemoDone;
    window.deleteEieMemo = deleteEieMemo;
    window.openEditEieTodoMemoModal = openEditEieTodoMemoModal;
    window.handleEditEieTodoMemo = handleEditEieTodoMemo;
    window.EieOperationMemos = {
        renderDashboardCard: renderEieMemoDashboardCard,
        openModal: openEieTodoMemoModal,
        add: addEieTodoMemo,
        toggleDone: toggleEieMemoDone,
        remove: deleteEieMemo,
        openEdit: openEditEieTodoMemoModal,
        saveEdit: handleEditEieTodoMemo
    };
})();
