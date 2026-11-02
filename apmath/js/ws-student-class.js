/**
 * AP Math OS [js/ws-student-class.js]
 * M4 반 관리 작업 화면 (W). 옛 모달 3개(학급관리 목록 / 새 반 추가 / 반 수정)를 한 화면으로 합쳤다.
 *
 * 구조: 왼쪽 반 목록(활성/숨김) + 오른쪽 선택한 반의 수정 폼(또는 같은 자리 새 반 폼) + 하단 고정 저장 줄.
 * - 목록에서 반을 고르는 데는 서버 호출이 없다.
 * - 저장·숨김·복구·보관 뒤에는 응답으로 state.db를 직접 고치고 이 화면만 다시 그린다.
 *   (옛 흐름: 저장 뒤 loadData() 전체 재조회 + 목록 모달 다시 열기)
 * - 저장 payload·API 경로는 management.js의 handleAddClass / handleEditClass / toggleClassActive /
 *   handleDeleteClass가 그대로 가진다. 이 파일은 화면과 로컬 상태 갱신만 맡는다.
 * - 입력 ID(add-cls-*, edit-cls-*)와 저장 함수 이름은 tests/apmath-modal-design-family.test.js가 지킨다.
 */

var wsClass = { selectedId: '', mode: 'idle', returnTo: null, snapshot: '', openSeq: 0 };

var WS_CLASS_GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
var WS_CLASS_DAYS = ['일', '월', '화', '수', '목', '금', '토'];

function wsClassEsc(value) {
    return typeof mgmtEscape === 'function' ? mgmtEscape(value) : String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

// onclick="" 안에 넣는 문자열 인자: JS 문자열로 만들고 HTML 속성용으로 다시 이스케이프한다.
function wsClassArg(value) {
    return wsClassEsc("'" + String(value ?? '').replace(/[\\']/g, '\\$&') + "'");
}

// 반 이름 표기 규칙(사용자 지시 2026-11-02): 학년을 이름에 겹쳐 쓰지 않는다("중3 · 중3A" 금지).
// 이름에 그 학년 글자가 없을 때만 앞에 붙이고("고1 심화반"), 같은 이름이 다른 담당과 함께 보일 때만 담당을 보조로 단다.
// 공통 함수 window.apmsClassLabel(cls, peers) → {text, teacher}가 있으면 그것을 먼저 쓴다.
function wsClassLabel(cls, peers) {
    if (typeof window !== 'undefined' && typeof window.apmsClassLabel === 'function') return window.apmsClassLabel(cls, peers);
    const name = String((cls && cls.name) || '').trim();
    const grade = String((cls && cls.grade) || '').trim();
    const text = grade && !name.includes(grade) ? `${grade} ${name}`.trim() : name;
    const labelOf = c => { const n = String((c && c.name) || '').trim(); const g = String((c && c.grade) || '').trim(); return g && !n.includes(g) ? `${g} ${n}`.trim() : n; };
    const teacher = String((cls && cls.teacher_name) || '').trim();
    const clash = (Array.isArray(peers) ? peers : []).some(o => o && String(o.id) !== String(cls && cls.id) && labelOf(o) === text && String(o.teacher_name || '').trim() !== teacher);
    return { text, teacher: clash ? teacher : '' };
}

function wsClassFind(cid) {
    return (state.db.classes || []).find(c => String(c.id) === String(cid)) || null;
}

function wsClassRoot() {
    return document.querySelector('#modal-body [data-ws-class]');
}

function wsClassIsOpen() {
    const overlay = document.getElementById('modal-overlay');
    return !!wsClassRoot() && !!overlay && overlay.classList.contains('show') && !overlay.classList.contains('hidden');
}

// ---------------------------------------------------------------- 목록

function wsClassRowHtml(c) {
    const hidden = Number(c.is_active) === 0;
    const active = String(c.id) === String(wsClass.selectedId) && wsClass.mode === 'edit';
    const meta = [
        c.teacher_name ? c.teacher_name : '담당 미지정',
        typeof formatClassScheduleDaysForUI === 'function' ? formatClassScheduleDaysForUI(c.schedule_days) : '',
        c.time_label || ''
    ].filter(Boolean).join(' · ');
    const count = typeof getClassStudentCount === 'function' ? getClassStudentCount(c.id) : 0;
    return `
        <button type="button" class="apms-workspace__item ws-class__item${active ? ' is-active' : ''}${hidden ? ' is-hidden' : ''}" data-class-id="${wsClassEsc(c.id)}" aria-current="${active ? 'true' : 'false'}" onclick="wsClassSelect(${wsClassArg(c.id)})">
            <span class="ws-class__item-head">
                <span class="ws-class__item-name">${wsClassEsc(wsClassLabel(c, state.db.classes).text)}</span>
                ${hidden ? '<span class="ws-chip ws-chip--muted">숨김</span>' : ''}
                <span class="ws-class__item-count">학생 ${count}명</span>
            </span>
            <span class="ws-class__item-meta">${wsClassEsc(meta)}</span>
        </button>`;
}

function wsClassListHtml() {
    const all = state.db.classes || [];
    const active = sortClassesForManagement(all.filter(c => Number(c.is_active) !== 0));
    const hidden = sortClassesForManagement(all.filter(c => Number(c.is_active) === 0));
    return `
        <div class="ws-class__section-title">활성 반 (${active.length})</div>
        ${active.length ? active.map(wsClassRowHtml).join('') : '<div class="ws-class__empty">활성 반이 없습니다. 위의 새 반 버튼으로 추가하세요.</div>'}
        ${hidden.length ? `<div class="ws-class__section-title">숨김 반 (${hidden.length})</div>${hidden.map(wsClassRowHtml).join('')}` : ''}`;
}

// ---------------------------------------------------------------- 폼 (입력 ID는 테스트가 지킨다)

function wsClassFormHtml(mode, c) {
    const p = mode === 'edit' ? 'edit' : 'add';
    const cls = c || {};
    const selectedDays = String(cls.schedule_days || '').split(',').filter(v => v !== '');
    const currentTime = String(cls.time_label || '');
    const periodTimes = ['4:50~6:20', '6:30~8:00', '8:00~9:30'];
    const selectedPeriod = periodTimes.includes(currentTime) ? currentTime : '';
    const grade = String(cls.grade || (p === 'add' ? '중1' : ''));
    const gradeList = grade && !WS_CLASS_GRADES.includes(grade) ? [grade, ...WS_CLASS_GRADES] : WS_CLASS_GRADES;
    const teacherDefault = p === 'add' ? (state.ui.userName || '') : (cls.teacher_name || '');
    return `
        <div class="apms-unified-form ws-class__form" data-ws-class-form="${p}">
            <label class="apms-unified-label" for="${p}-cls-name">반 이름</label>
            <input id="${p}-cls-name" class="btn apms-unified-control" value="${wsClassEsc(cls.name || '')}" placeholder="예: 중3A" maxlength="30" autocomplete="off">
            <div class="ws-class__grid">
                <div>
                    <label class="apms-unified-label" for="${p}-cls-grade">학년</label>
                    <select id="${p}-cls-grade" class="btn apms-unified-control">
                        ${gradeList.map(g => `<option value="${wsClassEsc(g)}"${g === grade ? ' selected' : ''}>${wsClassEsc(g)}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label class="apms-unified-label" for="${p}-cls-subject">과목</label>
                    <input id="${p}-cls-subject" class="btn apms-unified-control" value="${wsClassEsc(p === 'add' ? '수학' : (cls.subject || ''))}" placeholder="과목" autocomplete="off">
                </div>
                <div>
                    <label class="apms-unified-label" for="${p}-cls-teacher">담당 선생님</label>
                    <input id="${p}-cls-teacher" class="btn apms-unified-control" value="${wsClassEsc(teacherDefault)}" placeholder="담당 선생님" autocomplete="off">
                </div>
            </div>
            <div class="apms-unified-label" id="${p}-cls-days-label">수업 요일 (미선택 시 매일)</div>
            <div class="ws-class__days" role="group" aria-labelledby="${p}-cls-days-label">
                ${WS_CLASS_DAYS.map((d, i) => `<label class="apms-unified-day"><input type="checkbox" value="${i}" class="${p}-cls-days"${selectedDays.includes(String(i)) ? ' checked' : ''}> ${d}</label>`).join('')}
            </div>
            <div class="ws-class__grid">
                <div>
                    <label class="apms-unified-label" for="${p}-cls-period">시간 (교시)</label>
                    <select id="${p}-cls-period" class="btn apms-unified-control" onchange="syncClassPeriodTime('${p}')">
                        ${getTimeLabelOptions(selectedPeriod)}
                    </select>
                </div>
                <div>
                    <label class="apms-unified-label" for="${p}-cls-timelabel">시간 직접 입력</label>
                    <input id="${p}-cls-timelabel" class="btn apms-unified-control" value="${wsClassEsc(p === 'add' ? '' : currentTime)}" placeholder="예: 화.목 9:30~11:30" autocomplete="off">
                </div>
            </div>
        </div>`;
}

function wsClassFormValues() {
    const form = wsClassRoot()?.querySelector('[data-ws-class-form]');
    if (!form) return '';
    const out = [];
    form.querySelectorAll('input, select, textarea').forEach(el => {
        out.push(el.type === 'checkbox' ? (el.checked ? el.value : '') : el.value);
    });
    return JSON.stringify(out);
}

function wsClassIsDirty() {
    if (wsClass.mode !== 'edit' && wsClass.mode !== 'add') return false;
    return wsClassFormValues() !== wsClass.snapshot;
}

function wsClassConfirmLeave() {
    if (!wsClassIsDirty()) return true;
    return window.confirm('수정한 내용이 저장되지 않았습니다. 이동할까요?');
}

// ---------------------------------------------------------------- 상세 (오른쪽 칸)

function wsClassDetailHtml() {
    if (wsClass.mode === 'add') {
        return `
            <div class="ws-class__detail-head">
                <button type="button" class="btn apms-button apms-button--quiet ws-class__back" onclick="wsClassScrollToList()">↑ 반 목록</button>
                <div class="apms-unified-context__name">새 반 추가</div>
                <div class="apms-unified-context__meta">학년 · 담당 · 수업 요일 · 시간을 입력하고 아래 추가를 누르세요.</div>
            </div>
            ${wsClassFormHtml('add')}`;
    }
    const c = wsClassFind(wsClass.selectedId);
    if (wsClass.mode !== 'edit' || !c) {
        return `<div class="ws-class__placeholder">왼쪽에서 반을 고르면 여기서 수정합니다.<br>새 반은 위의 <b>새 반</b> 버튼으로 추가합니다.</div>`;
    }
    const hidden = Number(c.is_active) === 0;
    const count = typeof getClassStudentCount === 'function' ? getClassStudentCount(c.id) : 0;
    return `
        <div class="ws-class__detail-head">
            <button type="button" class="btn apms-button apms-button--quiet ws-class__back" onclick="wsClassScrollToList()">↑ 반 목록</button>
            <div class="ws-class__detail-title">
                <div>
                    <div class="apms-unified-context__name">${wsClassEsc(wsClassLabel(c, state.db.classes).text)}${hidden ? ' <span class="ws-chip ws-chip--muted">숨김</span>' : ''}</div>
                    <div class="apms-unified-context__meta">학생 ${count}명 · 반 정보 수정</div>
                </div>
                <button type="button" class="btn apms-button apms-button--quiet ws-class__open" onclick="wsClassOpenClassroom(${wsClassArg(c.id)})">반 화면 열기</button>
            </div>
        </div>
        ${wsClassFormHtml('edit', c)}
        <div class="ws-class__state">
            <div class="ws-class__state-title">반 상태</div>
            <div class="ws-class__state-note">${hidden
                ? '숨긴 반입니다. 복구하면 다시 반 목록과 시간표에 나옵니다.'
                : '숨기면 반 목록에서 빠집니다. 출결·성적·시험 기록은 지워지지 않습니다.'}</div>
            <div class="ws-class__state-actions">
                ${hidden
                    ? `<button type="button" class="btn apms-button apms-button--quiet" onclick="toggleClassActive(${wsClassArg(c.id)}, 1)">복구</button>`
                    : `<button type="button" class="btn apms-button apms-button--quiet" onclick="toggleClassActive(${wsClassArg(c.id)}, 0)">숨김</button>`}
                <button type="button" class="btn apms-button apms-button--quiet ws-class__danger" onclick="handleDeleteClass(${wsClassArg(c.id)})">반 보관</button>
            </div>
        </div>`;
}

function wsClassActionsHtml() {
    if (wsClass.mode === 'add') {
        return `<button type="button" id="ws-class-save" class="btn apms-button apms-button--primary btn-primary apms-unified-primary" onclick="wsClassSave()">추가</button>`;
    }
    if (wsClass.mode === 'edit') {
        return `<button type="button" id="ws-class-save" class="btn apms-button apms-button--primary btn-primary apms-unified-primary" onclick="wsClassSave()">저장</button>`;
    }
    return '';
}

// ---------------------------------------------------------------- 그리기

function wsClassRenderDetail() {
    const root = wsClassRoot();
    if (!root) return;
    const detail = root.querySelector('#ws-class-detail');
    const actions = root.querySelector('#ws-class-actions');
    if (detail) {
        detail.innerHTML = wsClassDetailHtml();
        detail.setAttribute('data-empty', wsClass.mode === 'idle' ? 'true' : 'false');
    }
    if (actions) {
        actions.innerHTML = wsClassActionsHtml();
        actions.hidden = wsClass.mode === 'idle';
    }
    wsClass.snapshot = wsClassFormValues();
}

function wsClassRenderList() {
    const root = wsClassRoot();
    const list = root && root.querySelector('#ws-class-list');
    if (!list) return;
    const top = list.scrollTop;
    list.innerHTML = wsClassListHtml();
    list.scrollTop = top;
    const addBtn = root.querySelector('#ws-class-add-btn');
    if (addBtn) addBtn.setAttribute('aria-pressed', wsClass.mode === 'add' ? 'true' : 'false');
    const summary = root.querySelector('#ws-class-summary');
    if (summary) {
        const all = state.db.classes || [];
        const hiddenCount = all.filter(c => Number(c.is_active) === 0).length;
        summary.textContent = `활성 ${all.length - hiddenCount}개${hiddenCount ? ` · 숨김 ${hiddenCount}개` : ''}`;
    }
}

function wsClassRender() {
    wsClassRenderList();
    wsClassRenderDetail();
}

function wsClassIsPhone() {
    return typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 600px)').matches;
}

function wsClassScrollToDetail() {
    if (!wsClassIsPhone()) return;
    const detail = wsClassRoot()?.querySelector('#ws-class-detail');
    if (detail && typeof detail.scrollIntoView === 'function') detail.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function wsClassScrollToList() {
    const list = wsClassRoot()?.querySelector('#ws-class-list');
    if (list && typeof list.scrollIntoView === 'function') list.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

// ---------------------------------------------------------------- 동작

function wsClassSelect(cid) {
    if (!wsClassRoot() || !wsClassFind(cid)) return;
    if (wsClass.mode === 'edit' && String(wsClass.selectedId) === String(cid)) { wsClassScrollToDetail(); return; }
    if (!wsClassConfirmLeave()) return;
    wsClass.selectedId = String(cid);
    wsClass.mode = 'edit';
    wsClassRender();
    wsClassScrollToDetail();
}

function wsClassStartAdd() {
    if (!wsClassRoot()) return;
    if (wsClass.mode !== 'add' && !wsClassConfirmLeave()) return;
    wsClass.selectedId = '';
    wsClass.mode = 'add';
    wsClassRender();
    wsClassScrollToDetail();
    const name = wsClassRoot()?.querySelector('#add-cls-name');
    if (name && !wsClassIsPhone() && typeof name.focus === 'function') name.focus();
}

function wsClassSave() {
    if (wsClass.mode === 'add') return handleAddClass();
    if (wsClass.mode === 'edit' && wsClass.selectedId) return handleEditClass(wsClass.selectedId, wsClass.returnTo || { type: 'classManage' });
}

function wsClassOpenClassroom(cid) {
    if (!wsClassConfirmLeave()) return;
    setManagementReturnView({ type: 'classManage' });
    closeModal(true);
    state.ui.currentClassId = String(cid);
    if (typeof renderClass === 'function') renderClass(String(cid));
}

// 저장 중에는 버튼을 잠가 두 번 눌러도 한 번만 보낸다.
function wsClassSetBusy(isBusy) {
    const btn = document.getElementById('ws-class-save');
    if (btn) {
        btn.disabled = !!isBusy;
        btn.textContent = isBusy ? '처리 중…' : (wsClass.mode === 'add' ? '추가' : '저장');
    }
    const root = wsClassRoot();
    if (root) root.querySelectorAll('.ws-class__state-actions button').forEach(b => { b.disabled = !!isBusy; });
}

// ---------------------------------------------------------------- 로컬 상태 갱신 (loadData 대신)

function wsClassRefreshBackdrop() {
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
    // loadData() 끝부분과 같은 그리기. 모달 뒤 화면의 반 수·이름을 맞춘다. 서버 조회는 하지 않는다.
    try {
        if (state.ui.currentClassId && typeof renderClass === 'function') renderClass(state.ui.currentClassId);
        else if (state.auth?.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
        else if (typeof renderDashboard === 'function') renderDashboard();
    } catch (error) {
        console.warn('[ws-student-class] backdrop refresh failed:', error);
    }
}

function wsClassSyncTimetableClass(row) {
    if (!Array.isArray(state.db.timetable_classes)) return;
    const idx = state.db.timetable_classes.findIndex(c => String(c.id) === String(row.id));
    if (Number(row.is_active) === 0) {
        if (idx >= 0) state.db.timetable_classes.splice(idx, 1);
        return;
    }
    const slim = { id: row.id, name: row.name, grade: row.grade, subject: row.subject, teacher_name: row.teacher_name, schedule_days: row.schedule_days, time_label: row.time_label, textbook: row.textbook || '', is_active: row.is_active };
    if (idx >= 0) state.db.timetable_classes[idx] = Object.assign({}, state.db.timetable_classes[idx], slim);
    else state.db.timetable_classes.push(slim);
}

// 서버 응답(또는 보낸 payload)을 state.db.classes에 반영한다. 선생님 계정이 다른 선생님 반을 만들면
// 서버가 다음 조회에서 돌려주지 않으므로 목록에도 넣지 않는다. 반환: 목록에 들어갔는지.
function wsClassApplyRow(row) {
    if (!row || !row.id) return false;
    if (!Array.isArray(state.db.classes)) state.db.classes = [];
    const idx = state.db.classes.findIndex(c => String(c.id) === String(row.id));
    const merged = Object.assign({}, idx >= 0 ? state.db.classes[idx] : {}, row);
    const visible = state.auth?.role === 'admin' || typeof isClassVisibleForCurrentTeacher !== 'function' || isClassVisibleForCurrentTeacher(merged);
    if (!visible) {
        if (idx >= 0) state.db.classes.splice(idx, 1);
        wsClassSyncTimetableClass(Object.assign({}, merged, { is_active: 0 }));
        return false;
    }
    if (idx >= 0) state.db.classes[idx] = merged;
    else state.db.classes.push(merged);
    wsClassSyncTimetableClass(merged);
    return true;
}

// 저장 성공 뒤 이 화면을 같은 자리에서 갱신한다. kind: 'add' | 'edit' | 'toggle' | 'archive'
function wsClassAfterMutation(kind, row) {
    const visible = wsClassApplyRow(row);
    if (kind === 'add') {
        if (visible) { wsClass.selectedId = String(row.id); wsClass.mode = 'edit'; }
        else { wsClass.selectedId = ''; wsClass.mode = 'add'; }
    } else if (!visible) {
        wsClass.selectedId = '';
        wsClass.mode = 'idle';
    }
    if (wsClassRoot()) {
        wsClassRender();
        if (kind === 'add') wsClassScrollToDetail();
        // 저장 직후에는 폼이 저장한 값 그대로이므로 변경 없음으로 다시 센다.
        if (typeof markModalClean === 'function') markModalClean();
    }
    wsClassRefreshBackdrop();
}

// ---------------------------------------------------------------- 열기

function openClassManageWorkspace(options = {}) {
    const opts = options || {};
    const returnTo = opts.returnTo && opts.returnTo.type === 'classDetail' && opts.selectId &&
        String(opts.returnTo.classId || '') === String(opts.selectId)
        ? { type: 'classDetail', classId: String(opts.selectId) }
        : { type: 'classManage' };
    setManagementReturnView({ type: 'classManage' });
    setModalReturnView(returnTo.type === 'classDetail' ? returnTo : null);

    wsClass.returnTo = returnTo;
    wsClass.openSeq += 1;
    const selected = opts.selectId ? wsClassFind(opts.selectId) : null;
    const noClass = !(state.db.classes || []).length;
    if (selected) { wsClass.selectedId = String(selected.id); wsClass.mode = 'edit'; }
    else if (opts.mode === 'add' || noClass) { wsClass.selectedId = ''; wsClass.mode = 'add'; }
    else { wsClass.selectedId = ''; wsClass.mode = 'idle'; }

    showModal('학급관리', `
        <div class="apms-modal apms-modal--workspace ws-class" data-ws-class>
            <div class="apms-workspace__bar ws-class__bar">
                <span class="ws-class__summary" id="ws-class-summary"></span>
                <button type="button" id="ws-class-add-btn" class="btn apms-button apms-button--primary btn-primary ws-class__add" aria-pressed="false" onclick="wsClassStartAdd()">+ 새 반</button>
            </div>
            <div class="apms-workspace">
                <div class="apms-workspace__list ws-class__list" id="ws-class-list" role="list"></div>
                <div class="apms-workspace__detail ws-class__detail" id="ws-class-detail" aria-live="polite"></div>
            </div>
            <div class="apms-modal__actions ws-class__actions" id="ws-class-actions"></div>
        </div>
    `);
    setModalDirtyChecker(wsClassIsDirty);
    wsClassRender();
    if (selected && opts.scroll !== false) setTimeout(() => {
        const row = wsClassRoot()?.querySelector('.ws-class__item.is-active');
        if (row && typeof row.scrollIntoView === 'function') row.scrollIntoView({ block: 'nearest' });
    }, 0);
}
