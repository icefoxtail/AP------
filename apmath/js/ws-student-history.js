/**
 * AP Math OS [js/ws-student-history.js]
 * M6 학생 상세 · 상태 변경 이력 / 반 이동 이력을 모달 대신 기본 탭 안 접이식 구역으로 보여 준다.
 *
 * 옛 흐름: [상태 변경 이력] [반 이동 이력] 버튼 → 모달 단계(showModalStep)가 쌓임 → 닫으면 상세로 복귀.
 * 새 흐름: "학생 관리" 카드 안 <details> 두 개. 누르면 그 자리에서 펼쳐지고, 펼친 상태는 탭을 다시 그려도 유지된다.
 * 데이터는 그대로 학생 상세가 이미 불러오는 lazy 데이터(detail-data)를 쓴다. 저장 없는 읽기 구역이라 payload·API 변경 없음.
 */

var wsHistoryOpen = { status: false, transfer: false };

var WS_HISTORY_KINDS = {
    status: { label: '상태 변경 이력', count: sid => getStudentStatusHistoryRows(sid).length, html: sid => renderStudentStatusHistoryModalHtml(sid) },
    transfer: { label: '반 이동 이력', count: sid => getStudentClassTransferHistoryRows(sid).length, html: sid => renderStudentClassTransferHistoryModalHtml(sid) }
};

function wsHistoryJs(value) {
    return typeof apmsStudentJsString === 'function' ? apmsStudentJsString(value) : "'" + String(value ?? '').replace(/[\\']/g, '\\$&') + "'";
}

// renderStudentOperationHistorySection가 버튼 두 개 대신 이 구역을 그린다.
function wsHistoryHtml(sid) {
    const key = String(sid || '');
    const lazy = typeof getStudentDetailLazyState === 'function' ? getStudentDetailLazyState(key) : { loadedAt: '' };
    return `
        <div class="ws-history-list">
            ${Object.keys(WS_HISTORY_KINDS).map(kind => {
                const def = WS_HISTORY_KINDS[kind];
                const open = !!wsHistoryOpen[kind];
                const body = !open ? '' : (lazy.loadedAt
                    ? def.html(key)
                    : '<div class="ws-history__loading">학생 이력 데이터를 불러오는 중입니다.</div>');
                return `
            <details class="ws-history" data-ws-history="${kind}"${open ? ' open' : ''} ontoggle="wsHistoryToggle(${wsHistoryJs(key)}, '${kind}', this.open)">
                <summary><span>${def.label}</span><span class="ws-history__count">${lazy.loadedAt ? `${def.count(key)}건` : ''}</span></summary>
                <div class="ws-history__body" id="ws-history-body-${kind}-${typeof apmsStudentDetailEsc === 'function' ? apmsStudentDetailEsc(key) : key}">${body}</div>
            </details>`;
            }).join('')}
        </div>`;
}

function wsHistoryFill(sid, kind) {
    const body = document.getElementById(`ws-history-body-${kind}-${sid}`);
    if (!body) return;
    const lazy = getStudentDetailLazyState(sid);
    body.innerHTML = lazy.loadedAt ? WS_HISTORY_KINDS[kind].html(sid) : '<div class="ws-history__loading">학생 이력 데이터를 불러오는 중입니다.</div>';
}

// <details>의 열림/닫힘. 이력 데이터가 아직이면 불러오고(다 오면 학생 상세가 알아서 그 자리를 다시 그린다) 본문을 채운다.
function wsHistoryToggle(sid, kind, isOpen) {
    if (!WS_HISTORY_KINDS[kind]) return;
    wsHistoryOpen[kind] = !!isOpen;
    if (!isOpen) return;
    wsHistoryFill(sid, kind);
    const lazy = getStudentDetailLazyState(sid);
    if (!lazy.loadedAt && typeof ensureStudentDetailLazyData === 'function') {
        Promise.resolve(ensureStudentDetailLazyData(sid, { refresh: false })).then(() => wsHistoryFill(sid, kind));
    }
}

// 옛 열기 함수(openStudentStatusHistoryModal / openStudentClassTransferHistoryModal)의 첫 줄에서 부른다.
// 이력 구역이 화면에 있으면 그 자리를 펼치고 true, 없으면 false(옛 모달 경로).
function wsHistoryOpenInline(kind, sid) {
    const key = String(sid || '');
    const el = document.querySelector(`#modal-body .ws-history[data-ws-history="${kind}"]`);
    if (!el || String(state.ui?.currentStudentDetailId || '') !== key) return false;
    el.open = true;
    wsHistoryToggle(key, kind, true);
    if (typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' });
    return true;
}
