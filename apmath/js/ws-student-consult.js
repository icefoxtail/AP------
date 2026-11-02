/**
 * AP Math OS [js/ws-student-consult.js]
 * M6 학생 상세 · 상담 탭을 같은 자리에서 처리한다.
 *
 * 옛 흐름: [+ 상담]/[수정] → 모달 단계(showModalStep)가 쌓임 → 저장 → closeModal(true)로 상세 전체를 닫음 →
 *          GET consultations 재조회 → 상세를 다시 엶. [흐름 요약]도 단계 모달.
 * 새 흐름: 상담 탭 안에 인라인 폼(추가·수정)과 흐름 요약 패널이 펼쳐지고, 저장하면 응답으로 state를 직접 고쳐
 *          탭만 그 자리에서 다시 그린다. 모달 단계는 쌓이지 않는다.
 *
 * 저장 payload·API는 student.js의 handleSaveConsultation / handleEditConsultation / handleDeleteConsultation이
 * 그대로 가진다(중복 저장 방지 clientRequestId, _consultSaveInFlight 포함). 입력 ID(cns-*, edit-cns-*)도 그대로다.
 * 반 화면에서 상담 버튼으로 바로 부르는 경우(학생 상세가 열려 있지 않음)는 옛 단일 모달 폼을 그대로 쓴다.
 */

var wsConsult = { sid: '', mode: '', cid: '', draft: null, threadSid: '' };

var WS_CONSULT_TYPES = ['학습', '태도', '성적', '신입', '기타'];

function wsConsultEsc(value) {
    return typeof apmsStudentDetailEsc === 'function' ? apmsStudentDetailEsc(value)
        : String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function wsConsultJs(value) {
    return typeof apmsStudentJsString === 'function' ? apmsStudentJsString(value) : wsConsultEsc(JSON.stringify(String(value ?? '')));
}

// 학생 상세(보기 모드)가 이 학생으로 화면에 떠 있는가
function wsConsultShell(sid) {
    const overlay = document.getElementById('modal-overlay');
    if (!overlay || !overlay.classList.contains('show') || overlay.classList.contains('hidden')) return null;
    const shell = document.querySelector('#modal-body .ap-student-detail-shell[data-student-detail-mode="view"]');
    if (!shell) return null;
    if (String(state.ui?.currentStudentDetailId || '') !== String(sid || '')) return null;
    return shell;
}

function wsConsultHost(sid) {
    return document.getElementById(`ws-consult-form-host-${sid}`);
}

function wsConsultIsInline(mode, sid, cid = '') {
    if (wsConsult.sid !== String(sid || '') || wsConsult.mode !== mode) return false;
    if (cid && wsConsult.cid !== String(cid)) return false;
    return !!wsConsultHost(sid)?.querySelector('[data-ws-consult-form]');
}

function wsConsultFormValues() {
    const form = document.querySelector('#modal-body [data-ws-consult-form]');
    if (!form) return null;
    const out = {};
    form.querySelectorAll('input, select, textarea').forEach(el => { if (el.id) out[el.id] = el.type === 'checkbox' ? el.checked : el.value; });
    return out;
}

function wsConsultIsDirty() {
    const now = wsConsultFormValues();
    if (!now || !wsConsult.baseline) return false;
    return JSON.stringify(now) !== JSON.stringify(wsConsult.baseline);
}

function wsConsultCaptureDraft(sid) {
    if (wsConsult.sid !== String(sid || '')) return;
    const values = wsConsultFormValues();
    if (values) wsConsult.draft = values;
}

function wsConsultFindRow(cid) {
    return (state.db.consultations || []).find(row => String(row.id) === String(cid)) || null;
}

function wsConsultTypeOptions(current) {
    const cur = String(current || '').trim();
    const custom = cur && !WS_CONSULT_TYPES.includes(cur) && cur !== '직접입력'
        ? `<option value="${wsConsultEsc(cur)}" selected>${wsConsultEsc(cur)}</option>` : '';
    return custom + WS_CONSULT_TYPES.map(t => `<option value="${t}"${t === cur ? ' selected' : ''}>${t}</option>`).join('') + '<option value="직접입력">직접입력...</option>';
}

// 상담 탭 맨 위(최근 상담 카드 안)에 들어가는 인라인 폼. renderStudentConsultationPinnedCard가 부른다.
function wsConsultFormHtml(sid) {
    const key = String(sid || '');
    if (wsConsult.sid !== key || !wsConsult.mode) return `<div class="ws-consult-form-host" id="ws-consult-form-host-${wsConsultEsc(key)}"></div>`;
    const edit = wsConsult.mode === 'edit';
    const p = edit ? 'edit-cns' : 'cns';
    const row = edit ? wsConsultFindRow(wsConsult.cid) : null;
    const draft = wsConsult.draft || {};
    const val = (id, fallback) => (Object.prototype.hasOwnProperty.call(draft, id) ? draft[id] : fallback);
    const today = new Date().toLocaleDateString('sv-SE');
    const date = val(`${p}-date`, row ? row.date : today);
    const typeSel = val(`${p}-type`, row ? row.type : '학습');
    const content = val(`${p}-content`, row ? row.content || '' : '');
    const action = val(`${p}-action`, row ? row.next_action || '' : '');
    const customType = val(`${p}-type-custom`, '');
    return `
        <div class="ws-consult-form-host" id="ws-consult-form-host-${wsConsultEsc(key)}">
            <div class="ws-consult-form apms-unified-form" data-ws-consult-form="${edit ? 'edit' : 'add'}" role="group" aria-label="${edit ? '상담 수정' : '상담 기록 추가'}">
                <div class="ws-consult-form__title">${edit ? '상담 수정' : '상담 기록 추가'}</div>
                <div class="ws-consult-form__grid">
                    <div>
                        <label class="apms-unified-label" for="${p}-date">상담일</label>
                        <input type="date" id="${p}-date" class="apms-unified-control" value="${wsConsultEsc(date)}">
                    </div>
                    <div>
                        <label class="apms-unified-label" for="${p}-type">상담 유형</label>
                        <select id="${p}-type" class="apms-unified-control" onchange="document.getElementById('${p}-type-custom-wrap').style.display=this.value==='직접입력'?'block':'none';">${wsConsultTypeOptions(typeSel)}</select>
                    </div>
                </div>
                <div id="${p}-type-custom-wrap" style="display:${typeSel === '직접입력' ? 'block' : 'none'};">
                    <label class="apms-unified-label" for="${p}-type-custom">직접 입력한 유형</label>
                    <input id="${p}-type-custom" class="apms-unified-control" type="text" value="${wsConsultEsc(customType)}" placeholder="태그 직접 입력">
                </div>
                <div>
                    <label class="apms-unified-label" for="${p}-content">상담 내용</label>
                    <textarea id="${p}-content" class="apms-unified-control ws-consult-form__content" placeholder="상담 내용을 입력하세요.">${wsConsultEsc(content)}</textarea>
                </div>
                <div>
                    <label class="apms-unified-label" for="${p}-action">조치 사항 (선택)</label>
                    <textarea id="${p}-action" class="apms-unified-control ws-consult-form__action" placeholder="조치 사항 (선택)">${wsConsultEsc(action)}</textarea>
                </div>
                <div id="consultation-ai-panel-wrap">${typeof consultationAiPanelHtml === 'function' ? consultationAiPanelHtml(edit ? 'edit' : 'add') : ''}</div>
                <div class="ws-consult-form__actions">
                    <button type="button" class="btn apms-button apms-button--quiet" onclick="wsConsultClose(${wsConsultJs(key)})">접기</button>
                    <button type="button" class="btn apms-button apms-button--primary btn-primary" data-ws-consult-save onclick="wsConsultSubmit()">${edit ? '수정 완료' : '저장'}</button>
                </div>
            </div>
        </div>`;
}

function wsConsultRefreshHost(sid) {
    const host = wsConsultHost(sid);
    if (!host) return false;
    host.outerHTML = wsConsultFormHtml(sid);
    const fresh = wsConsultHost(sid)?.querySelector('[data-ws-consult-form]');
    wsConsult.baseline = fresh ? wsConsultFormValues() : null;
    return true;
}

// openAddConsultationModal / openEditConsultation의 첫 줄에서 부른다. 처리했으면 true(옛 모달을 열지 않는다).
function wsConsultOpenInline(mode, sid, cid = '') {
    const key = String(sid || '');
    if (!wsConsultShell(key)) return false;
    if (mode === 'edit' && !wsConsultFindRow(cid)) return true;
    if (wsConsult.sid === key && wsConsult.mode && (wsConsult.mode !== mode || wsConsult.cid !== String(cid || '')) &&
        wsConsultIsDirty() && !window.confirm('작성 중인 상담 내용이 저장되지 않습니다. 다른 상담 폼으로 바꿀까요?')) return true;
    const reopen = wsConsult.sid === key && wsConsult.mode === mode && wsConsult.cid === String(cid || '');
    if (reopen && wsConsultIsInline(mode, key, cid)) {
        // 이미 열려 있으면 입력 중인 내용을 건드리지 않고 그 자리로 이동만 한다.
        const open = wsConsultHost(key);
        if (open && typeof open.scrollIntoView === 'function') open.scrollIntoView({ block: 'nearest' });
        document.getElementById(mode === 'edit' ? 'edit-cns-content' : 'cns-content')?.focus({ preventScroll: true });
        return true;
    }
    wsConsult = { sid: key, mode, cid: String(cid || ''), draft: null, baseline: null, threadSid: wsConsult.threadSid };
    if (typeof resetConsultationAiUiState === 'function') resetConsultationAiUiState(mode, key, cid || '');
    if (typeof setStudentDetailSubModal === 'function') setStudentDetailSubModal(mode === 'edit' ? 'consultation-edit' : 'consultation-add', key);
    if (state.ui.currentStudentDetailTab !== 'cns') renderStudentDetailTab(key, 'cns');
    wsConsultRefreshHost(key);
    const form = wsConsultHost(key);
    if (form && typeof form.scrollIntoView === 'function') form.scrollIntoView({ block: 'nearest' });
    const content = document.getElementById(mode === 'edit' ? 'edit-cns-content' : 'cns-content');
    if (content && typeof content.focus === 'function') content.focus({ preventScroll: true });
    return true;
}

function wsConsultSubmit() {
    if (wsConsult.mode === 'edit') return handleEditConsultation(wsConsult.cid, wsConsult.sid);
    if (wsConsult.mode === 'add') return handleSaveConsultation(wsConsult.sid);
}

function wsConsultReset() {
    const threadSid = wsConsult.threadSid;
    wsConsult = { sid: '', mode: '', cid: '', draft: null, baseline: null, threadSid };
    if (typeof setStudentDetailSubModal === 'function') setStudentDetailSubModal('', '');
}

function wsConsultClose(sid) {
    if (wsConsultIsDirty() && !window.confirm('작성 중인 상담 내용이 저장되지 않습니다. 접을까요?')) return;
    wsConsultReset();
    const host = wsConsultHost(sid);
    if (host) host.outerHTML = wsConsultFormHtml(sid);
    if (typeof markModalClean === 'function') markModalClean();
}

// 다른 탭·수정 화면으로 갈 때 작성 중인 폼이 있으면 확인한다. 가도 되면 true.
function wsConsultGuardLeave(sid, nextTab = '') {
    // 이 학생의 상세가 아직 화면에 없으면(새로 여는 중) 지난번 흐름 요약 패널 상태는 가져가지 않는다.
    if (!wsConsultShell(sid)) wsConsult.threadSid = '';
    if (!wsConsult.mode) return true;
    // 폼이 화면에 없으면(상세를 이미 닫았음) 남은 작성 상태만 비운다.
    if (!document.querySelector('#modal-body [data-ws-consult-form]')) { wsConsultReset(); return true; }
    if (String(wsConsult.sid) === String(sid || '') && nextTab === 'cns') return true;
    if (wsConsultIsDirty() && !window.confirm('작성 중인 상담 내용이 저장되지 않습니다. 이동할까요?')) return false;
    wsConsultReset();
    return true;
}

// 로컬 state에 상담 행을 넣거나 고친다(저장 응답으로 갱신, 전체 재조회 없음).
function wsConsultApplyRow(sid, row) {
    const key = String(sid || '');
    const full = Object.assign({ student_id: key, created_at: new Date().toISOString().slice(0, 19).replace('T', ' ') }, row);
    if (!Array.isArray(state.db.consultations)) state.db.consultations = [];
    const idx = state.db.consultations.findIndex(c => String(c.id) === String(full.id));
    if (idx >= 0) state.db.consultations[idx] = Object.assign({}, state.db.consultations[idx], full, { created_at: state.db.consultations[idx].created_at || full.created_at });
    else state.db.consultations.push(full);
    const detail = state.ui?.timetableStudentDetails?.[key];
    if (detail && Array.isArray(detail.consultations)) {
        const di = detail.consultations.findIndex(c => String(c.id) === String(full.id));
        if (di >= 0) detail.consultations[di] = Object.assign({}, detail.consultations[di], full);
        else detail.consultations.push(full);
    }
    return full;
}

function wsConsultRemoveRow(sid, cid) {
    const key = String(sid || '');
    state.db.consultations = (state.db.consultations || []).filter(c => String(c.id) !== String(cid));
    const detail = state.ui?.timetableStudentDetails?.[key];
    if (detail && Array.isArray(detail.consultations)) detail.consultations = detail.consultations.filter(c => String(c.id) !== String(cid));
    if (state.ui?.studentPinnedConsultationId && String(state.ui.studentPinnedConsultationId[key]) === String(cid)) delete state.ui.studentPinnedConsultationId[key];
    if (wsConsult.sid === key && wsConsult.mode === 'edit' && wsConsult.cid === String(cid)) wsConsultReset();
}

// 저장 성공 뒤: 폼을 접고 탭만 그 자리에서 다시 그린다. row가 없으면(응답에 id가 없을 때만) 그 학생 상담만 다시 읽는다.
async function wsConsultAfterSave(sid, mode, row) {
    const key = String(sid || '');
    wsConsultReset();
    let selectedId = '';
    if (row && row.id) {
        wsConsultApplyRow(key, row);
        selectedId = String(row.id);
    } else if (typeof ensureStudentConsultationsLoaded === 'function') {
        await ensureStudentConsultationsLoaded(key, { force: true, refresh: false });
    }
    if (!state.ui.studentPinnedConsultationId) state.ui.studentPinnedConsultationId = {};
    if (selectedId) state.ui.studentPinnedConsultationId[key] = selectedId;
    if (typeof markModalClean === 'function') markModalClean();
    if (wsConsultShell(key)) renderStudentDetailTab(key, 'cns');
}

// ---------------------------------------------------------------- 흐름 요약 (AI) 인라인 패널

function wsConsultThreadHtml(sid) {
    const key = String(sid || '');
    const open = wsConsult.threadSid === key;
    return `<div class="ws-consult-thread-host" id="ws-consult-thread-host-${wsConsultEsc(key)}">${open ? `
        <section class="ws-consult-thread" aria-label="상담 흐름 요약">
            <div class="ws-consult-thread__head"><strong>상담 흐름 요약</strong><button type="button" class="btn apms-button apms-button--quiet" onclick="wsConsultCloseThread(${wsConsultJs(key)})">접기</button></div>
            ${typeof consultationThreadSummaryModalHtml === 'function' ? consultationThreadSummaryModalHtml() : ''}
        </section>` : ''}</div>`;
}

function wsConsultRenderThread() {
    const key = wsConsult.threadSid;
    if (!key) return false;
    const host = document.getElementById(`ws-consult-thread-host-${key}`);
    if (!host) return false;
    host.outerHTML = wsConsultThreadHtml(key);
    return true;
}

function wsConsultCloseThread(sid) {
    wsConsult.threadSid = '';
    const host = document.getElementById(`ws-consult-thread-host-${sid}`);
    if (host) host.outerHTML = wsConsultThreadHtml(sid);
}

// openConsultationThreadSummaryModal의 첫 줄에서 부른다. 상세가 열려 있으면 모달 대신 상담 탭 안에 패널을 연다.
async function wsConsultOpenThread(sid) {
    const key = String(sid || '');
    if (!wsConsultShell(key)) return false;
    wsConsult.threadSid = key;
    if (state.ui.currentStudentDetailTab !== 'cns') renderStudentDetailTab(key, 'cns');
    else wsConsultRenderThread();
    await ensureStudentConsultationsLoaded(key);
    resetConsultationThreadAiUiState(key);
    wsConsultRenderThread();
    const rows = getStudentConsultationsFromState(key);
    if (!rows.length) {
        ensureConsultationThreadAiUiState().error = '상담 기록이 아직 없어 상담 흐름 요약을 만들 수 없습니다.';
        wsConsultRenderThread();
        return true;
    }
    const host = document.getElementById(`ws-consult-thread-host-${key}`);
    if (host && typeof host.scrollIntoView === 'function') host.scrollIntoView({ block: 'nearest' });
    await generateConsultationThreadSummary(key);
    return true;
}
