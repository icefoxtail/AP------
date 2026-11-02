/**
 * AP Math OS [js/ws-exam-workspace.js]
 * 원내평가·OMR 통합 작업 화면 (W 등급: .apms-modal--workspace). 2026-11-02 사용자 결정.
 *
 *   왼쪽: 시험 목록 (+ 새 시험)         오른쪽: 선택한 시험의 학생 표
 *   학생 줄의 [입력]/[수정]을 누르면 그 줄 바로 아래에 OMR 칸이 펼쳐지고, 저장하면 같은 표의 다음 미제출 학생으로 넘어간다.
 *
 * 원칙(apmath/DESIGN.md "통합 작업 화면 패턴"):
 *   - 모달을 갈아 끼우지 않는다. 시험 고르기·학생 입력·삭제는 모두 이 화면 안에서 끝난다.
 *   - 저장하면 응답으로 화면 자료를 고친다. 전체 initial-data를 다시 받지 않고 반 화면으로 나가지 않는다.
 *   - 저장 payload는 qr-omr.js의 submitOmrResult 한 곳에서 만든다(옛 "성적 직접 입력" 모달과 같다).
 *   - 늦게 온 응답이 새 화면을 덮지 않는다(reqId).
 * 자료 계산은 ws-exam-data.js, 옛 열기 함수(openExamGradeView/openExamDetail/openGlobalExamGradeView/openOMR)는 이 화면을 여는 얇은 진입이다.
 */

let wsx = null;

function wsxEsc(value) {
    return apEscapeHtml(String(value ?? ''));
}

function wsxToday() {
    return new Date().toLocaleDateString('sv-SE');
}

function wsxHasDom() {
    return typeof document !== 'undefined' && !!document.getElementById;
}

/** 이 화면이 아직 열려 있고(다른 모달로 바뀌거나 닫히지 않았고) 같은 요청인가. */
function wsxStale(req) {
    if (!wsx || wsx.reqId !== req) return true;
    if (!wsxHasDom()) return false;
    if (typeof isModalOpen === 'function' && !isModalOpen()) return true;
    return !document.getElementById('wsx-root');
}

function wsxClasses() {
    const list = (state.db.classes || []).filter(c => Number(c.is_active) !== 0);
    if (wsx && wsx.classId && !list.some(c => String(c.id) === String(wsx.classId))) {
        const current = (state.db.classes || []).find(c => String(c.id) === String(wsx.classId));
        if (current) list.unshift(current);
    }
    return list;
}

function wsxView() {
    return wsx ? wsx.drafts.concat(wsx.exams) : [];
}

function wsxSelectedExam() {
    return wsxView().find(e => e.key === wsx.selKey) || null;
}

function wsxDetail() {
    const exam = wsxSelectedExam();
    return exam && wsx.source ? wsExamBuildDetail(wsx.source, exam) : null;
}

function wsxDirty() {
    return !!(wsx && (wsx.dirty || wsx.newTouched));
}

function wsxConfirmLeave() {
    if (!wsxDirty()) return true;
    return confirm('입력한 내용이 저장되지 않았습니다. 이동할까요?');
}

function wsxKeepScroll(fn) {
    if (!wsxHasDom()) return fn();
    const ids = ['wsx-root', 'wsx-list', 'wsx-detail'];
    const saved = ids.map(id => { const el = document.getElementById(id); return el ? el.scrollTop : 0; });
    const out = fn();
    // 읽기는 위에서 한꺼번에, 쓰기는 여기서 한꺼번에 한다. 맨 위(0)였던 칸은 내용을 바꿔도 맨 위 그대로라
    // 다시 쓰지 않는다(쓰면 화면 배치를 그 자리에서 다시 계산해야 해서 처음 열 때 느려진다).
    ids.forEach((id, i) => {
        if (!(saved[i] > 0)) return;
        const el = document.getElementById(id);
        if (el) el.scrollTop = saved[i];
    });
    return out;
}

function wsxSet(id, html) {
    if (!wsxHasDom()) return false;
    const el = document.getElementById(id);
    if (!el) return false;
    el.innerHTML = html;
    return true;
}

// ───────────── 화면 조각 ─────────────

function wsxBarHtml() {
    const classes = wsxClasses();
    let left = '';
    if (classes.length < 2) {
        const only = classes[0];
        left = only ? `<span class="apms-unified-context__name wsx-bar__name">${wsxEsc(only.name)}</span>` : '';
    } else {
        left = `<div class="wsx-tabs" role="group" aria-label="반 전환">${classes.map(c => {
            const active = String(c.id) === String(wsx.classId);
            return `<button type="button" class="wsx-tab${active ? ' is-active' : ''}" aria-pressed="${active}" onclick="wsxSwitchClass(${apJsArg(c.id)})">${wsxEsc(c.name)}</button>`;
        }).join('')}</div>`;
    }
    // 옛 OMR 일괄 입력 화면(전체 학생 한 표 O/X)의 입구. 그 화면은 선생님 전용이라 원장에게는 숨긴다.
    const omrTable = (typeof state !== 'undefined' && state.auth && state.auth.role === 'admin')
        ? ''
        : '<button type="button" class="btn apms-unified-quiet wsx-btn wsx-bar__omr" id="wsx-omr-table" onclick="wsxOpenOmrTable()">표로 한 번에 입력</button>';
    return left + omrTable;
}

// 작업 화면을 닫고 일괄 OMR 입력 화면(openOmrInput)을 연다. 그 화면의 "AP MATH" 버튼은 이 반의 작업 화면으로 돌아온다(goOmrInputHome).
function wsxOpenOmrTable() {
    if (typeof openOmrInput !== 'function') { if (typeof toast === 'function') toast('OMR 일괄 입력 화면을 불러오지 못했습니다.', 'warn'); return; }
    if (!wsxConfirmLeave()) return;
    const classId = wsx ? String(wsx.classId || '') : '';
    if (typeof state !== 'undefined' && state.ui) {
        state.ui.omrReturnClassId = classId;
        if (typeof ensureOmrInputState === 'function') {
            const omr = ensureOmrInputState();
            if (classId && !omr.classId) omr.classId = classId;
        }
    }
    if (typeof closeModal === 'function') closeModal(true);
    window.setTimeout(() => openOmrInput(), 280);
}
window.wsxOpenOmrTable = wsxOpenOmrTable;

function wsxListHtml() {
    const exams = wsxView();
    const items = exams.map((exam, idx) => {
        const active = exam.key === wsx.selKey;
        const meta = exam.isDraft
            ? `${wsxEsc(exam.date)} · ${exam.qCount}문항 · 새 시험`
            : `${wsxEsc(exam.date)} · ${exam.qCount}문항 · 제출 ${exam.count}/${exam.targetCount}명 (${exam.pct}%)`;
        return `<button type="button" class="apms-workspace__item wsx-exam-item${active ? ' is-active' : ''}" aria-current="${active ? 'true' : 'false'}" onclick="wsxSelectExam(${idx})">
            <span class="wsx-exam-item__main">
                <span class="wsx-exam-item__title">${wsxEsc(exam.displayTitle)}</span>
                <span class="wsx-exam-item__meta">${meta}</span>
            </span>
            <span class="wsx-exam-item__avg" aria-label="평균 ${exam.avg === null ? '없음' : exam.avg + '점'}"><b>${exam.avg === null ? '-' : exam.avg}</b><span>평균</span></span>
        </button>`;
    }).join('');
    return `<div class="wsx-list__head">
            <span class="wsx-list__count">시험 ${exams.length}개</span>
            <button type="button" class="btn apms-unified-quiet wsx-btn" id="wsx-new-open" onclick="wsxOpenNewForm()">+ 새 시험</button>
        </div>
        ${items || '<div class="wsx-empty">시험 기록 없음<br>＋ 새 시험으로 첫 시험을 만드세요.</div>'}`;
}

function wsxWrongChip(session, qid) {
    const bp = typeof findBlueprintForWrong === 'function' ? findBlueprintForWrong(session, qid) : null;
    const unit = bp ? (bp.standard_unit || bp.standard_unit_key || '') : '';
    return `<span class="wsx-chip">Q${wsxEsc(qid)}${unit ? ` · ${wsxEsc(unit)}` : ''}</span>`;
}

function wsxWeakUnitsHtml(detail) {
    const items = wsExamWeakUnits(wsx.source, detail);
    if (!items.length) return '<div class="wsx-weak__empty">오답 단원 데이터 없음</div>';
    const cls = (state.db.classes || []).find(c => String(c.id) === String(wsx.classId));
    const context = { targetType: 'class', targetId: wsx.classId, targetLabel: cls?.name || '반', examTitle: detail.exam.title, examDate: detail.exam.date };
    const canOpen = typeof makeWeakUnitDetailKey === 'function' && typeof openWeakUnitDetail === 'function';
    return items.slice(0, 5).map((item, idx) => {
        const open = canOpen ? ` onclick="openWeakUnitDetail('${makeWeakUnitDetailKey(item, 'class', '반 취약 단원 상세', context)}')"` : '';
        const tag = canOpen ? 'button type="button"' : 'div';
        const end = canOpen ? 'button' : 'div';
        return `<${tag} class="wsx-weak__row"${open}>
            <span class="wsx-weak__label">${idx + 1}. ${wsxEsc(item.label)}${item.studentCount ? ` <span class="wsx-weak__sub">${item.studentCount}명</span>` : ''}</span>
            <span class="wsx-weak__count">${wsxEsc(item.count)}회${canOpen ? ' ›' : ''}</span>
        </${end}>`;
    }).join('');
}

function wsxPdfButtonHtml(detail) {
    const a = detail.matchedAssignment;
    if (!a?.id) return '';
    const status = String(a.pdf_status || 'pending');
    if (status === 'ready') return `<button type="button" class="btn apms-unified-quiet wsx-btn" onclick="downloadClassExamPdf(${apJsArg(a.id)}, ${apJsArg(detail.exam.title)}, ${apJsArg(detail.exam.date)})">출제본 PDF</button>`;
    if (status === 'generating') return '<button type="button" class="btn apms-unified-quiet wsx-btn" disabled>PDF 생성 중</button>';
    return `<button type="button" class="btn apms-unified-quiet wsx-btn" onclick="wsxRegeneratePdf()">${status === 'failed' ? 'PDF 다시 생성' : 'PDF 생성'}</button>`;
}

function wsxGridHtml(q, checked) {
    return Array.from({ length: q }, (_, i) => {
        const n = String(i + 1);
        const on = checked.has(n);
        return `<label class="wsx-q"><input type="checkbox" value="${n}"${on ? ' checked' : ''} onchange="wsxToggleQ(this)"><span>${n}</span></label>`;
    }).join('');
}

function wsxSummaryText(panel) {
    const wrong = panel.checked.size;
    return `틀린 ${wrong}개 · ${wsExamScore(panel.q, wrong)}점`;
}

function wsxPanelHtml(row) {
    const p = wsx.panel;
    if (p.loading) return '<div class="wsx-panel" id="wsx-panel"><div class="wsx-panel__loading">입력 칸을 불러오는 중…</div></div>';
    const statusText = typeof getOmrQuestionCountStatusText === 'function'
        ? getOmrQuestionCountStatusText(p.archiveFile, p.qSource, p.q) : '';
    return `<div class="wsx-panel" id="wsx-panel">
        <div class="wsx-panel__head">
            <div>
                <div class="wsx-panel__name">${wsxEsc(row.name)} ${p.sessionId ? '성적 수정' : '성적 입력'}</div>
                <div class="wsx-panel__hint">틀린 번호를 누르세요. ${wsxEsc(statusText)}</div>
            </div>
            <button type="button" class="btn apms-unified-quiet wsx-btn" onclick="wsxClosePanel()">접기</button>
        </div>
        <div class="wsx-panel__qrow">
            <label for="wsx-q" class="apms-unified-label">문항 수</label>
            <input id="wsx-q" type="number" inputmode="numeric" class="apms-unified-control wsx-qcount" min="1" max="50" value="${p.q}" oninput="wsxOnQCount(this.value)">
            <button type="button" class="btn apms-unified-quiet wsx-btn" onclick="wsxClearWrong()">전부 맞음</button>
        </div>
        <div class="wsx-grid" id="wsx-grid" role="group" aria-label="틀린 번호 선택">${wsxGridHtml(p.q, p.checked)}</div>
        <div class="wsx-panel__sum" id="wsx-sum" aria-live="polite">${wsxSummaryText(p)}</div>
        <div class="wsx-panel__foot">
            <button type="button" class="btn wsx-btn wsx-btn--danger" onclick="wsxExcludeStudent(${apJsArg(row.sid)})">이 학생 시험에서 삭제</button>
        </div>
    </div>`;
}

function wsxStudentsHtml(detail) {
    const filter = wsx.filter;
    const rows = detail.rows.filter(r => filter === 'pending' ? r.pending : filter === 'done' ? !r.pending : true);
    if (!rows.length) return `<div class="wsx-empty">${filter === 'pending' ? '미제출 학생이 없습니다.' : filter === 'done' ? '제출한 학생이 없습니다.' : '재원생이 없습니다.'}</div>`;
    return rows.map(r => {
        const open = wsx.panel && wsx.panel.sid === r.sid;
        const sess = r.session;
        const chips = r.pending ? '' : (r.wrongs.length
            ? r.wrongs.map(qid => wsxWrongChip(sess, qid)).join('')
            : '<span class="wsx-student__none">오답 없음</span>');
        return `<div class="wsx-student${open ? ' is-open' : ''}" data-sid="${wsxEsc(r.sid)}" data-pending="${r.pending ? 1 : 0}">
            <div class="wsx-student__row">
                <span class="wsx-student__name">${wsxEsc(r.name)}</span>
                <span class="wsx-student__score${r.pending ? ' is-pending' : ''}">${r.pending ? '미제출' : `${wsxEsc(r.score)}점`}</span>
                <button type="button" class="btn wsx-btn wsx-row-input${r.pending ? ' wsx-btn--primary' : ''}" aria-expanded="${open ? 'true' : 'false'}" onclick="wsxOpenPanel(${apJsArg(r.sid)})">${r.pending ? '입력' : '수정'}</button>
                ${chips ? `<span class="wsx-student__wrongs">${chips}</span>` : ''}
            </div>
            ${open ? wsxPanelHtml(r) : ''}
        </div>`;
    }).join('');
}

function wsxNewFormHtml() {
    const f = wsx.newForm;
    const chips = ['쪽지시험', '단원평가', '월말평가', '모의고사'].map(name =>
        `<button type="button" class="btn apms-unified-quiet wsx-btn" onclick="wsxPickTitle(${apJsArg(name)})">${name}</button>`).join('');
    const who = f.studentName ? `<div class="apms-unified-context__meta">${wsxEsc(f.studentName)} 학생의 성적을 먼저 입력합니다.</div>` : '';
    return `<form class="wsx-new apms-unified-form" onsubmit="wsxCreateExam(); return false;">
        <div class="apms-unified-context"><div class="apms-unified-context__name">새 시험 입력</div>${who}</div>
        <label class="apms-unified-label" for="wsx-new-title">시험명</label>
        <div class="wsx-new__chips">${chips}</div>
        <input id="wsx-new-title" class="apms-unified-control" value="${wsxEsc(f.title)}" placeholder="시험명 입력" oninput="wsxNewTouched()">
        <div class="apms-unified-grid">
            <div><label class="apms-unified-label" for="wsx-new-count">문항 수 (1~50)</label>
            <input id="wsx-new-count" type="number" inputmode="numeric" class="apms-unified-control" min="1" max="50" value="${wsxEsc(f.count)}" oninput="wsxNewTouched()"></div>
            <div><label class="apms-unified-label" for="wsx-new-date">시험 날짜</label>
            <input id="wsx-new-date" type="date" class="apms-unified-control" value="${wsxEsc(f.date)}" oninput="wsxNewTouched()"></div>
        </div>
        <div class="wsx-new__actions">
            ${wsxView().length ? '<button type="button" class="btn apms-unified-quiet wsx-btn" onclick="wsxCloseNewForm()">시험 목록으로</button>' : ''}
            <button type="submit" id="wsx-new-create" class="btn btn-primary apms-unified-primary wsx-btn">${f.studentName ? '시험 만들고 입력' : '시험 만들기'}</button>
        </div>
    </form>`;
}

function wsxDetailHtml() {
    if (wsx.loading) return '<div class="wsx-empty">시험 기록을 불러오는 중…</div>';
    if (wsx.newForm) return wsxNewFormHtml();
    const detail = wsxDetail();
    if (!detail) return '<div class="wsx-empty">왼쪽에서 시험을 고르면 학생별 점수와 입력 칸이 여기에 나옵니다.</div>';
    const exam = detail.exam;
    const meta = [exam.date, `${detail.qCount}문항`, `제출 ${detail.submittedCount}/${detail.total}명`, detail.avg === null ? '' : `평균 ${detail.avg}점`].filter(Boolean).join(' · ');
    const f = wsx.filter;
    const tab = (id, label, n) => `<button type="button" class="wsx-filter__btn${f === id ? ' is-active' : ''}" aria-pressed="${f === id}" onclick="wsxSetFilter('${id}')">${label} ${n}</button>`;
    return `<div class="wsx-detail__head">
            <div class="wsx-detail__title">${wsxEsc(exam.displayTitle)}</div>
            <div class="wsx-detail__meta">${wsxEsc(meta)}</div>
            <div class="wsx-detail__tools">
                ${wsxPdfButtonHtml(detail)}
                ${exam.isDraft ? '' : '<button type="button" class="btn wsx-btn wsx-btn--danger" onclick="wsxDeleteExam()">시험 기록 전체 삭제</button>'}
            </div>
        </div>
        <div class="wsx-filter" role="group" aria-label="학생 보기">${tab('all', '전체', detail.total)}${tab('pending', '미제출', detail.pendingCount)}${tab('done', '제출', detail.submittedCount)}</div>
        <div class="wsx-students" id="wsx-students">${wsxStudentsHtml(detail)}</div>
        <div class="wsx-weak"><div class="wsx-weak__title">반 취약 단원 TOP</div>${wsxWeakUnitsHtml(detail)}</div>`;
}

function wsxActionsHtml() {
    if (wsx.loading || wsx.newForm) return { html: '', hidden: true };
    if (wsx.panel && !wsx.panel.loading) {
        const detail = wsxDetail();
        const next = detail && wsx.panel.isPendingInput ? wsExamNextPendingStudent(detail.rows, wsx.panel.sid) : null;
        const dis = wsx.busy ? ' disabled' : '';
        return {
            hidden: false,
            html: `${next ? `<button type="button" id="wsx-skip" class="btn apms-unified-quiet"${dis} onclick="wsxSkipToNext()">건너뛰기</button>` : ''}
                <button type="button" id="wsx-save" class="btn ${next ? 'apms-unified-quiet' : 'btn-primary apms-unified-primary'}"${dis} onclick="wsxSavePanel(false)">저장</button>
                ${next ? `<button type="button" id="wsx-save-next" class="btn btn-primary apms-unified-primary"${dis} onclick="wsxSavePanel(true)">저장하고 다음</button>` : ''}`
        };
    }
    const detail = wsxDetail();
    if (detail && detail.pendingCount > 0 && !wsx.panel) {
        return { hidden: false, html: `<button type="button" id="wsx-next-pending" class="btn btn-primary apms-unified-primary" onclick="wsxStartPending()">다음 미제출 입력 (${detail.pendingCount}명)</button>` };
    }
    return { html: '', hidden: true };
}

function wsxShellHtml() {
    const actions = wsxActionsHtml();
    return `<div class="apms-modal apms-modal--workspace wsx" id="wsx-root">
        <div class="apms-workspace__bar" id="wsx-bar">${wsxBarHtml()}</div>
        <div class="apms-workspace">
            <div class="apms-workspace__list wsx-list" id="wsx-list">${wsx.loading ? '<div class="wsx-empty">불러오는 중…</div>' : wsxListHtml()}</div>
            <div class="apms-workspace__detail wsx-detail" id="wsx-detail">${wsxDetailHtml()}</div>
        </div>
        <div class="apms-modal__actions wsx-actions" id="wsx-actions"${actions.hidden ? ' hidden' : ''}>${actions.html}</div>
    </div>`;
}

function wsxMount() {
    showModal('원내평가', wsxShellHtml());
    if (typeof setModalDirtyChecker === 'function') setModalDirtyChecker(() => wsxDirty());
}

function wsxPaint(parts = ['bar', 'list', 'detail', 'actions']) {
    if (!wsx) return;
    if (!wsxHasDom() || !document.getElementById('wsx-root')) return wsxMount();
    wsxKeepScroll(() => {
        if (parts.includes('bar')) wsxSet('wsx-bar', wsxBarHtml());
        if (parts.includes('list')) wsxSet('wsx-list', wsx.loading ? '<div class="wsx-empty">불러오는 중…</div>' : wsxListHtml());
        if (parts.includes('detail')) wsxSet('wsx-detail', wsxDetailHtml());
        if (parts.includes('actions')) {
            const actions = wsxActionsHtml();
            const el = document.getElementById('wsx-actions');
            if (el) { el.innerHTML = actions.html; el.hidden = !!actions.hidden; }
        }
    });
}

function wsxScrollTo(id, block = 'nearest') {
    if (!wsxHasDom()) return;
    const el = document.getElementById(id);
    if (el && typeof el.scrollIntoView === 'function') {
        const calm = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        el.scrollIntoView({ block, behavior: calm ? 'auto' : 'smooth' });
    }
}

function wsxIsPhone() {
    return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(max-width: 600px)').matches;
}

// ───────────── 열기·불러오기 ─────────────

function wsxFreshState(classId) {
    return {
        classId: String(classId), reqId: wsx ? wsx.reqId + 1 : 1, panelReq: 0, reloadSeq: 0, source: null, exams: [], drafts: [], draftSeq: 0,
        selKey: '', filter: 'all', panel: null, dirty: false, newForm: null, newTouched: false, loading: true, busy: false, focusSid: ''
    };
}

function wsxDefaultNewForm(preset = {}, studentId = '') {
    const student = studentId ? (state.db.students || []).find(s => String(s.id) === String(studentId)) : null;
    return {
        title: String(preset.title || '단원평가'), date: String(preset.date || wsxToday()), count: String(preset.count || 20),
        studentId: studentId ? String(studentId) : '', studentName: student?.name || ''
    };
}

/**
 * 원내평가·OMR 작업 화면 열기.
 * opts.select      {title,date,archive}  그 시험을 고른 채로 연다(옛 openExamDetail).
 * opts.studentId   그 학생의 입력 칸을 바로 연다.
 * opts.newExam     {title,date,count}    새 시험 입력 칸을 미리 채워 연다(옛 "새 시험 입력", 학생 메뉴의 OMR).
 */
async function openExamWorkspace(classId, opts = {}) {
    let cid = String(classId || '');
    if (!cid) {
        const list = wsxClasses();
        const current = state.ui?.currentClassId ? list.find(c => String(c.id) === String(state.ui.currentClassId)) : null;
        cid = String((current || list[0] || {}).id || '');
    }
    if (!cid) {
        showModal('원내평가', '<div class="apms-modal apms-modal--confirm"><div class="apms-unified-context"><div class="apms-unified-context__name">담당 반이 없습니다.</div></div></div>');
        return false;
    }
    wsx = wsxFreshState(cid);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId: cid });
    wsxMount();
    await wsxLoadClass(cid, opts);
    return true;
}

async function wsxLoadClass(cid, opts = {}) {
    const req = wsx.reqId;
    let res = null;
    try {
        res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(cid)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
    } catch (e) { console.warn('[openExamWorkspace] fail', e); }
    if (wsxStale(req)) return;
    wsx.source = wsExamBuildSource(cid, res);
    wsx.exams = wsExamBuildExams(wsx.source);
    wsx.loading = false;
    wsxApplyOpenOptions(opts);
    wsxPaint();
    await wsxAfterSelect();
    if (wsxStale(req)) return;
    if (opts.studentId && wsx.selKey && !wsx.newForm) await wsxOpenPanel(String(opts.studentId), { skipConfirm: true });
}

function wsxFindExam(select) {
    if (!select) return null;
    const view = wsxView();
    const archive = normalizeClassroomArchiveFile(select.archive || '');
    return view.find(e => String(e.date) === String(select.date || '') && archive && normalizeClassroomArchiveFile(e.archiveFile || '') === archive)
        || view.find(e => String(e.date) === String(select.date || '') && String(e.title) === String(select.title || ''))
        || null;
}

function wsxApplyOpenOptions(opts) {
    const found = wsxFindExam(opts.select);
    if (found) {
        wsx.selKey = found.key;
    } else if (opts.newExam) {
        // 같은 이름·날짜의 시험이 이미 있으면 새로 만들지 않고 그 시험에서 입력한다.
        const existing = wsxFindExam({ title: opts.newExam.title, date: opts.newExam.date || wsxToday() });
        if (existing) wsx.selKey = existing.key;
        else { wsx.newForm = wsxDefaultNewForm(opts.newExam, opts.studentId); wsx.focusSid = opts.studentId ? String(opts.studentId) : ''; }
    } else if (opts.select && opts.studentId) {
        // 시험을 못 찾았지만 학생 입력으로 온 경우: 넘겨 받은 시험 정보로 새 시험 칸을 연다.
        wsx.newForm = wsxDefaultNewForm({ title: opts.select.title, date: opts.select.date }, opts.studentId);
        wsx.focusSid = String(opts.studentId);
    } else {
        const first = wsxView()[0];
        if (first) wsx.selKey = first.key;
    }
    if (!wsx.selKey && !wsx.newForm && !wsxView().length) wsx.newForm = wsxDefaultNewForm();
}

/** 시험을 고른 뒤: 오답 칩에 단원 이름이 붙도록 원문 청사진을 받는다(없어도 화면은 먼저 보인다). */
async function wsxAfterSelect() {
    const req = wsx.reqId;
    const detail = wsxDetail();
    if (!detail || typeof ensureBlueprintsForSessions !== 'function') return;
    const targets = detail.sessions.filter(s => s.archive_file);
    const files = targets.length ? targets : (detail.matchedAssignment?.archive_file
        ? [{ archive_file: detail.matchedAssignment.archive_file, question_count: detail.matchedAssignment.question_count }] : []);
    if (!files.length) return;
    try { await ensureBlueprintsForSessions(files); } catch (e) { console.warn(e); }
    if (wsxStale(req) || wsx.panel || wsx.newForm) return;
    wsxPaint(['detail']);
}

async function wsxReload() {
    const seq = ++wsx.reloadSeq;
    let res = null;
    try { res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(wsx.classId)}`); } catch (e) { console.warn(e); }
    if (!wsx || wsx.reloadSeq !== seq || wsxStale(wsx.reqId)) return false;
    if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
    wsx.source = wsExamBuildSource(wsx.classId, res);
    wsxRebuild();
    return true;
}

/** 자료가 바뀐 뒤 시험 목록을 다시 만들고, 고른 시험을 이어서 고른다(고른 시험이 사라지면 같은 이름의 새 시험 줄로 남긴다). */
function wsxRebuild(preferSessionId = '') {
    const prev = wsxSelectedExam();
    wsx.exams = wsExamBuildExams(wsx.source);
    let found = null;
    if (preferSessionId) found = wsx.exams.find(e => e.sessions.some(s => String(s.id) === String(preferSessionId))) || null;
    if (!found && prev && !prev.isDraft) {
        found = wsx.exams.find(e => e.key === prev.key)
            || wsx.exams.find(e => String(e.date) === String(prev.date) && String(e.title) === String(prev.title)) || null;
        if (!found) {
            const draft = wsExamMakeDraft({ title: prev.title, date: prev.date, questionCount: prev.qCount, seq: ++wsx.draftSeq });
            wsx.drafts.unshift(draft);
            found = draft;
        }
    }
    if (found && preferSessionId) wsx.drafts = wsx.drafts.filter(d => !(String(d.date) === String(found.date) && String(d.title) === String(found.title)));
    if (!found && wsx.selKey) found = wsxView().find(e => e.key === wsx.selKey) || null;
    wsx.selKey = found ? found.key : (wsxView()[0]?.key || '');
}

// ───────────── 목록·표 조작 ─────────────

async function wsxSwitchClass(classId) {
    if (String(classId) === String(wsx.classId)) return;
    if (!wsxConfirmLeave()) return;
    wsx = wsxFreshState(classId);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId: String(classId) });
    wsxPaint();
    await wsxLoadClass(String(classId), {});
}

async function wsxSelectExam(idx) {
    const exam = wsxView()[idx];
    if (!exam || (exam.key === wsx.selKey && !wsx.newForm)) {
        if (exam && wsxIsPhone()) wsxScrollTo('wsx-detail', 'start');
        return;
    }
    if (!wsxConfirmLeave()) return;
    wsx.selKey = exam.key;
    wsx.panel = null;
    wsx.dirty = false;
    wsx.newForm = null;
    wsx.newTouched = false;
    wsx.filter = 'all';
    wsxPaint();
    if (wsxIsPhone()) wsxScrollTo('wsx-detail', 'start');
    await wsxAfterSelect();
}

function wsxSetFilter(id) {
    wsx.filter = id;
    wsxPaint(['detail']);
}

// ───────────── 새 시험 ─────────────

function wsxOpenNewForm() {
    if (!wsxConfirmLeave()) return;
    wsx.panel = null;
    wsx.dirty = false;
    wsx.newForm = wsxDefaultNewForm();
    wsx.newTouched = false;
    wsxPaint(['detail', 'actions']);
    if (wsxIsPhone()) wsxScrollTo('wsx-detail', 'start');
}

function wsxCloseNewForm() {
    wsx.newForm = null;
    wsx.newTouched = false;
    if (!wsx.selKey) wsx.selKey = wsxView()[0]?.key || '';
    wsxPaint(['detail', 'actions']);
}

function wsxNewTouched() { if (wsx) wsx.newTouched = true; }

function wsxPickTitle(name) {
    const input = wsxHasDom() ? document.getElementById('wsx-new-title') : null;
    if (input) input.value = name;
    wsx.newTouched = true;
}

async function wsxCreateExam() {
    const form = wsx.newForm;
    if (!form) return;
    const val = id => (wsxHasDom() && document.getElementById(id) ? document.getElementById(id).value : '');
    const title = (val('wsx-new-title') || form.title).trim() || '단원평가';
    const date = val('wsx-new-date') || form.date || wsxToday();
    const count = Math.max(1, Math.min(50, parseInt(val('wsx-new-count') || form.count, 10) || 20));
    const existing = wsxView().find(e => String(e.title) === title && String(e.date) === date && !e.archiveFile);
    let exam = existing;
    if (!exam) {
        exam = wsExamMakeDraft({ title, date, questionCount: count, seq: ++wsx.draftSeq });
        wsx.drafts.unshift(exam);
    } else if (!exam.qCount) exam.qCount = count;
    const focus = form.studentId || wsx.focusSid || '';
    wsx.selKey = exam.key;
    wsx.newForm = null;
    wsx.newTouched = false;
    wsx.filter = focus ? 'all' : 'pending';
    wsx.focusSid = '';
    wsxPaint();
    if (focus) await wsxOpenPanel(focus, { skipConfirm: true });
    else if (wsxIsPhone()) wsxScrollTo('wsx-detail', 'start');
}

// ───────────── OMR 입력 칸 ─────────────

async function wsxOpenPanel(sid, options = {}) {
    if (!wsx) return;
    if (wsx.panel && wsx.panel.sid === String(sid) && !options.skipConfirm) { wsxScrollTo('wsx-panel', 'nearest'); return; }
    if (!options.skipConfirm && wsx.panel && !wsxConfirmLeave()) return;
    const detail = wsxDetail();
    const row = detail && detail.rows.find(r => r.sid === String(sid));
    if (!row) return;
    const req = wsx.reqId;
    const mine = ++wsx.panelReq;
    wsx.dirty = false;
    wsx.panel = { sid: row.sid, loading: true };
    if (wsx.filter === 'done' && row.pending) wsx.filter = 'all';
    wsxPaint(['detail', 'actions']);
    wsxScrollTo('wsx-panel', 'nearest');
    const exam = detail.exam;
    let ctx;
    try {
        ctx = await resolveOmrContext(row.sid, exam.title, detail.qCount, wsx.classId, row.sessionId || '',
            row.session?.archive_file || detail.archiveFile || '', 'examDetail', exam.date, '',
            row.session ? { session: row.session, wrongIds: row.wrongs } : {});
    } catch (e) {
        console.warn('[wsx] OMR context failed', e);
        toast('입력 칸을 열지 못했습니다.', 'warn');
        if (!wsxStale(req) && wsx.panelReq === mine) { wsx.panel = null; wsxPaint(['detail', 'actions']); }
        return;
    }
    if (wsxStale(req) || wsx.panelReq !== mine) return;
    wsx.panel = {
        sid: row.sid, loading: false, name: row.name, title: ctx.defaultTitle, examDate: ctx.defaultExamDate,
        archiveFile: ctx.defaultArchiveFile, classId: ctx.classId || wsx.classId, sessionId: ctx.presetSessionId || '',
        assignmentId: ctx.selectedAssignmentId, q: ctx.defaultQ, qSource: ctx.defaultQResolved?.source || '',
        checked: new Set(ctx.checkedWrongIds), isPendingInput: row.pending
    };
    wsxPaint(['detail', 'actions']);
    wsxScrollTo('wsx-panel', 'nearest');
}

function wsxClosePanel() {
    if (wsx.panel && !wsxConfirmLeave()) return;
    wsx.panelReq += 1;
    wsx.panel = null;
    wsx.dirty = false;
    wsxPaint(['detail', 'actions']);
}

function wsxToggleQ(input) {
    const p = wsx && wsx.panel;
    if (!p || p.loading) return;
    if (input.checked) p.checked.add(String(input.value)); else p.checked.delete(String(input.value));
    wsx.dirty = true;
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(20);
    wsxSet('wsx-sum', wsxSummaryText(p));
}

function wsxOnQCount(value) {
    const p = wsx && wsx.panel;
    if (!p || p.loading) return;
    const q = Math.max(1, Math.min(50, parseInt(value, 10) || 0));
    if (!q || q === p.q) return;
    p.q = q;
    p.checked = new Set(Array.from(p.checked).filter(n => Number(n) <= q));
    wsx.dirty = true;
    wsxSet('wsx-grid', wsxGridHtml(q, p.checked));
    wsxSet('wsx-sum', wsxSummaryText(p));
}

function wsxClearWrong() {
    const p = wsx && wsx.panel;
    if (!p || p.loading) return;
    p.checked = new Set();
    wsx.dirty = true;
    wsxSet('wsx-grid', wsxGridHtml(p.q, p.checked));
    wsxSet('wsx-sum', wsxSummaryText(p));
}

async function wsxStartPending() {
    const detail = wsxDetail();
    const next = detail && detail.rows.find(r => r.pending);
    if (next) await wsxOpenPanel(next.sid, { skipConfirm: true });
}

async function wsxSkipToNext() {
    const detail = wsxDetail();
    const p = wsx.panel;
    if (!detail || !p) return;
    const next = wsExamNextPendingStudent(detail.rows, p.sid);
    if (!next) return;
    if (!wsxConfirmLeave()) return;
    await wsxOpenPanel(next.sid, { skipConfirm: true });
}

/** 저장: payload는 submitOmrResult가 만든다. 응답으로 화면 자료만 고치고 서버에서 전체를 다시 받지 않는다. */
async function wsxSavePanel(goNext) {
    const p = wsx && wsx.panel;
    if (!p || p.loading || wsx.busy) return;
    const req = wsx.reqId;
    const wrongIds = Array.from(p.checked).sort((a, b) => Number(a) - Number(b));
    wsx.busy = true;
    wsxPaint(['actions']);
    let result = null;
    try {
        result = await submitOmrResult({
            sid: p.sid, title: p.title, wrongIds, examDate: p.examDate, sessionId: p.sessionId,
            assignmentId: p.assignmentId, classId: p.classId, archiveFile: p.archiveFile, questionCount: p.q
        });
    } catch (e) {
        console.warn('[wsx] save failed', e);
    }
    if (wsxStale(req)) return;
    wsx.busy = false;
    if (!result || !result.success) {
        toast('저장실패', 'warn');
        wsxPaint(['actions']);
        return;
    }
    const payload = result.payload;
    const existing = wsx.source.sessions.find(s => String(s.id) === String(result.id));
    const row = {
        ...(existing || {}),
        id: result.id, student_id: payload.student_id, class_id: payload.class_id, exam_title: payload.exam_title,
        exam_date: payload.exam_date, score: payload.score, question_count: payload.question_count,
        archive_file: payload.archive_file || existing?.archive_file || '',
        assignment_id: payload.assignment_id || existing?.assignment_id || ''
    };
    toast(`저장완료 (${result.score}점)`, 'info');
    if (!result.id) {
        // 서버가 새 세션 ID를 주지 않은 예외 경우에만 이 시험의 기록을 다시 받는다(전체 initial-data는 아니다).
        if (!(await wsxReload())) return;
    } else {
        wsExamApplySavedSession(wsx.source, row, wrongIds);
        wsExamMirrorSessionToAppState(row, wrongIds);
        wsxRebuild(result.id);
    }
    if (wsxStale(req)) return;
    if (typeof refreshClassroomStatusBoardAfterExamChange === 'function') refreshClassroomStatusBoardAfterExamChange(wsx.classId);
    const detail = wsxDetail();
    const next = goNext && p.isPendingInput && detail ? wsExamNextPendingStudent(detail.rows, p.sid) : null;
    wsx.panelReq += 1;
    wsx.panel = null;
    wsx.dirty = false;
    wsxPaint();
    if (next) await wsxOpenPanel(next.sid, { skipConfirm: true });
    else if (detail && detail.pendingCount === 0 && p.isPendingInput) toast('모든 학생의 성적이 입력되었습니다.', 'info');
}

// ───────────── 삭제·제외·PDF ─────────────

/** 확인 → 요청. 성공 여부만 돌려준다(화면 처리는 부르는 쪽). 옛 deleteExamSession도 이 함수를 쓴다. */
async function wsExamRequestExcludeStudent({ classId, studentId, examTitle, examDate, archiveFile = '', assignmentId = '' }) {
    if (!classId || !examTitle || !examDate || !studentId) return false;
    if (!confirm('이 학생을 이 시험에서 삭제할까요?\n제출 기록이 있으면 오답 기록도 함께 삭제됩니다.')) return false;
    try {
        const r = await api.post('class-exam-assignments/exclude-student', {
            class_id: classId, student_id: studentId, exam_title: examTitle, exam_date: examDate,
            archive_file: archiveFile || '', assignment_id: assignmentId || ''
        });
        if (!r?.success) { toast('삭제 실패', 'warn'); return false; }
        toast('학생을 시험에서 삭제했습니다.', 'info');
        return true;
    } catch (e) {
        console.warn(e);
        toast('삭제 실패', 'warn');
        return false;
    }
}

async function wsExamRequestDeleteSession(sessionId) {
    if (!sessionId) return false;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return false;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return false; }
    toast('기록이 삭제되었습니다.', 'info');
    return true;
}

async function wsExamRequestDeleteExam({ classId, examTitle, examDate, archiveFile = '', assignmentId = '' }) {
    if (!confirm('이 시험의 제출 기록 전체를 삭제할까요?\n오답 기록도 모두 삭제됩니다.')) return false;
    try {
        const archiveQuery = archiveFile ? `&archive=${encodeURIComponent(archiveFile)}` : '';
        const assignmentQuery = assignmentId ? `&assignment=${encodeURIComponent(assignmentId)}` : '';
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(examTitle)}&date=${encodeURIComponent(examDate)}${archiveQuery}${assignmentQuery}`;
        const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        if (typeof handlePlannerDirectFetchAuthStatus === 'function' && handlePlannerDirectFetchAuthStatus(r)) return false;
        const data = await r.json();
        if (!r.ok || !data.success) { toast('시험 전체삭제 실패', 'warn'); return false; }
        toast('시험 전체 기록이 삭제되었습니다.', 'info');
        return true;
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); return false; }
}

async function wsxExcludeStudent(sid) {
    const detail = wsxDetail();
    const row = detail && detail.rows.find(r => r.sid === String(sid));
    if (!row) return;
    const req = wsx.reqId;
    const ok = await wsExamRequestExcludeStudent({
        classId: wsx.classId, studentId: row.sid, examTitle: detail.exam.title, examDate: detail.exam.date,
        archiveFile: row.session?.archive_file || detail.archiveFile || '', assignmentId: detail.matchedAssignment?.id || ''
    });
    if (!ok || wsxStale(req)) return;
    // 서버가 배정·제외 목록을 새로 만들 수 있으므로 이 반의 시험 기록만 다시 받는다(전체 initial-data는 아니다).
    if (row.sessionId) wsExamRemoveSessionFromAppState(row.sessionId);
    wsx.panelReq += 1;
    wsx.panel = null;
    wsx.dirty = false;
    if (!(await wsxReload())) return;
    if (typeof refreshClassroomStatusBoardAfterExamChange === 'function') refreshClassroomStatusBoardAfterExamChange(wsx.classId);
    wsxPaint();
}

async function wsxDeleteExam() {
    const detail = wsxDetail();
    if (!detail || detail.exam.isDraft) return;
    const req = wsx.reqId;
    const ok = await wsExamRequestDeleteExam({
        classId: wsx.classId, examTitle: detail.exam.title, examDate: detail.exam.date,
        archiveFile: detail.archiveFile || '', assignmentId: detail.matchedAssignment?.id || ''
    });
    if (!ok || wsxStale(req)) return;
    const gone = new Set(detail.sessions.map(s => String(s.id)));
    gone.forEach(id => wsExamRemoveSessionFromAppState(id));
    wsx.source.sessions = wsx.source.sessions.filter(s => !gone.has(String(s.id)));
    wsx.source.wrongAnswers = wsx.source.wrongAnswers.filter(w => !gone.has(String(w.session_id)));
    if (detail.matchedAssignment?.id) {
        const aid = String(detail.matchedAssignment.id);
        wsx.source.assignments = wsx.source.assignments.filter(a => String(a.id) !== aid);
        wsx.source.exclusions = wsx.source.exclusions.filter(ex => String(ex.assignment_id) !== aid);
    }
    wsx.exams = wsExamBuildExams(wsx.source);
    wsx.selKey = wsxView()[0]?.key || '';
    wsx.panelReq += 1;
    wsx.panel = null;
    wsx.dirty = false;
    wsx.filter = 'all';
    if (typeof refreshClassroomStatusBoardAfterExamChange === 'function') refreshClassroomStatusBoardAfterExamChange(wsx.classId);
    if (!wsx.selKey) wsx.newForm = wsxDefaultNewForm();
    wsxPaint();
}

/** 시험지 PDF 생성 요청. 성공하면 갱신된 배정 행을, 실패하면 null을 돌려준다(옛 regenerateClassExamPdf도 이 함수를 쓴다). */
async function wsExamRequestRegeneratePdf(assignmentId) {
    if (!assignmentId) { toast('출제 정보를 찾을 수 없습니다.', 'warn'); return null; }
    try {
        toast('시험지 PDF를 생성하고 있습니다.', 'info');
        const result = await api.post(`class-exam-assignments/${encodeURIComponent(assignmentId)}/pdf`, {});
        if (result?.assignment?.pdf_status !== 'ready') throw new Error(result?.assignment?.pdf_error || 'PDF 생성 실패');
        toast('시험지 PDF가 준비되었습니다.', 'success');
        return result.assignment;
    } catch (e) {
        console.warn('[class exam pdf] regeneration failed:', e);
        toast(e.message || 'PDF 생성에 실패했습니다.', 'warn');
        return null;
    }
}

async function wsxRegeneratePdf() {
    const detail = wsxDetail();
    const a = detail && detail.matchedAssignment;
    if (!a?.id) return toast('출제 정보를 찾을 수 없습니다.', 'warn');
    const req = wsx.reqId;
    const updated = await wsExamRequestRegeneratePdf(a.id);
    if (!updated || wsxStale(req)) return;
    wsx.source.assignments = wsx.source.assignments.map(x => String(x.id) === String(a.id) ? { ...x, ...updated } : x);
    wsxRebuild();
    wsxPaint(['list', 'detail']);
}

// ───────────── 옛 진입에서 오는 길 ─────────────

/**
 * openOMR(학생 메뉴의 "OMR / 성적 입력", 옛 시험 상세의 [입력]/[수정])이 부르는 길.
 * 처리했으면 true. 반을 알 수 없으면 false를 돌려 옛 "성적 직접 입력" 모달이 대신 열리게 한다.
 */
async function openExamWorkspaceForOmr(sid, title, questionCount, classId, sessionId, archive, returnMode, date, assignmentId) {
    const session = sessionId ? (state.db.exam_sessions || []).find(r => String(r.id || '') === String(sessionId)) : null;
    const mapped = sid ? (state.db.class_students || []).find(m => String(m.student_id) === String(sid)) : null;
    const cid = String(session?.class_id || classId || mapped?.class_id || '');
    if (!cid) return false;
    const examTitle = session?.exam_title || title || '';
    const examDate = session?.exam_date || date || '';
    const examArchive = session?.archive_file || archive || '';
    if (session || (sessionId && examTitle && examDate)) {
        await openExamWorkspace(cid, { select: { title: examTitle, date: examDate, archive: examArchive }, studentId: sid });
    } else if (sid && examTitle && examDate && examArchive) {
        await openExamWorkspace(cid, { select: { title: examTitle, date: examDate, archive: examArchive }, studentId: sid, newExam: { title: examTitle, date: examDate, count: questionCount } });
    } else {
        await openExamWorkspace(cid, { newExam: { title: examTitle || '단원평가', date: examDate || wsxToday(), count: questionCount || 20 }, studentId: sid });
    }
    return true;
}
