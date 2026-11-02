/* APMS M7 클리닉 작업 화면 껍데기 (2026-11-02, 모달 통합 M7)
 *
 * 옛 흐름: 반 화면 → 클리닉 메뉴(2버튼 모달) → 출력 센터 또는 유사문항 → 단원 → 추천 → 바구니(전부 새 모달).
 *          서랍에서는 반 고르기 모달이 한 단계 더 있었다.
 * 새 흐름: 모달 하나에서 "반 전환 탭" + "보기 탭(오답 출력 | 유사문항)". 반·탭을 바꿔도 모달이 닫히지 않는다.
 *
 * - 오답 출력: P 등급(전체 화면 패널). 출력 센터 본문(openClinicPrintCenter)은 그대로 두고 껍데기만 먼저 열어
 *   "불러오는 중"을 자리에서 보여 준다(느린 망에서도 누르면 바로 반응).
 * - 유사문항: W 등급(작업 화면). ws-clinic-similar.js 가 그린다.
 * - 취소(헤더)는 한 번에 닫고 시작한 반 화면으로 돌아간다. 아래쪽 취소 줄은 두지 않는다.
 * - 출제·출력 로직(clinicPrint*), 출제 payload·배정은 건드리지 않는다. 이 파일은 껍데기와 반 전환만 다룬다.
 * 공통 부품(.apms-modal*, .apms-workspace*, ui.js 닫기 정책)은 읽기만 한다. 스타일은 ws-clinic.css.
 */
let wsClinicState = { seq: 0, classId: '', view: 'print' };

function wsClinicJsArg(value) {
    return apEscapeHtml(JSON.stringify(String(value ?? '')));
}

// 반 전환 탭에 보일 반: 현재 사용자가 볼 수 있는 활성 반(+ 지금 열려는 반).
function wsClinicGetClassTabs(extraClassId = '') {
    const all = (state.db?.classes || []).filter(cls => Number(cls?.is_active ?? 1) !== 0);
    let visible = all.filter(cls => typeof isClassVisibleForCurrentTeacher === 'function' ? isClassVisibleForCurrentTeacher(cls) : true);
    const extra = all.find(cls => String(cls.id) === String(extraClassId));
    if (extra && !visible.some(cls => String(cls.id) === String(extra.id))) visible = [extra, ...visible];
    if (typeof sortClassesForDashboard === 'function') return sortClassesForDashboard(visible);
    return visible.sort((a, b) =>
        String(a.grade || '').localeCompare(String(b.grade || ''), 'ko') ||
        String(a.name || '').localeCompare(String(b.name || ''), 'ko')
    );
}

// 열 반 정하기: 지정한 반 → 지금 보고 있는 반 → 마지막으로 연 반 → 첫 반.
function wsClinicResolveClassId(classId = '') {
    const wanted = String(classId || '').trim();
    const tabs = wsClinicGetClassTabs(wanted);
    const has = id => !!id && tabs.some(cls => String(cls.id) === String(id));
    if (has(wanted)) return wanted;
    const current = String(state.ui?.currentClassId || '');
    if (has(current)) return current;
    if (has(wsClinicState.classId)) return wsClinicState.classId;
    return tabs.length ? String(tabs[0].id) : '';
}

// 반 탭 표기(사용자 지시 2026-11-02): 학년을 겹쳐 쓰지 않는다("중3A", 학년이 이름에 없을 때만 "고1 심화반").
// 지금 함께 보이는 반 중 같은 이름이 있고 담당이 다를 때만 담당 이름을 작은 보조 글자로 붙인다. 모달 제목에는 넣지 않는다.
// 공통 함수 window.apmsClassLabel(cls, peers) → {text, teacher} 가 있으면 그것을 먼저 쓴다.
function wsClinicClassLabel(cls, peers) {
    if (typeof window !== 'undefined' && typeof window.apmsClassLabel === 'function') {
        try {
            const shared = window.apmsClassLabel(cls, peers);
            if (shared && typeof shared.text === 'string') return { text: shared.text, teacher: shared.teacher || '' };
        } catch (e) { console.warn('[ws-clinic] apmsClassLabel failed:', e); }
    }
    const textOf = c => {
        const name = String(c?.name || '').trim() || '반 이름 없음';
        const grade = String(c?.grade || '').trim();
        return grade && !name.includes(grade) ? `${grade} ${name}` : name;
    };
    const teacherOf = c => String(c?.teacher_name || '').replace(/\s*선생님\s*$/g, '').trim();
    const text = textOf(cls);
    const clash = (peers || []).some(other => String(other?.id) !== String(cls?.id) && textOf(other) === text && teacherOf(other) !== teacherOf(cls));
    return { text, teacher: clash ? teacherOf(cls) : '' };
}

function wsClinicBarHtml(classId, view) {
    const tabs = wsClinicGetClassTabs(classId);
    const views = [['print', '오답 출력'], ['similar', '유사문항']];
    const viewTabs = views.map(([id, label]) => {
        const selected = id === view;
        return `<button type="button" role="tab" id="ws-clinic-viewtab-${id}" class="ws-clinic-viewtab${selected ? ' is-active' : ''}" aria-selected="${selected ? 'true' : 'false'}" aria-controls="ws-clinic-view" onclick="wsClinicSwitchView('${id}')">${label}</button>`;
    }).join('');
    const classTabs = tabs.map(cls => {
        const selected = String(cls.id) === String(classId);
        const label = wsClinicClassLabel(cls, tabs);
        return `<button type="button" class="ws-clinic-classtab${selected ? ' is-active' : ''}" data-class-id="${apEscapeHtml(String(cls.id))}" aria-pressed="${selected ? 'true' : 'false'}" onclick="wsClinicSwitchClass(${wsClinicJsArg(cls.id)})">${apEscapeHtml(label.text)}${label.teacher ? `<span class="ws-clinic-classtab__teacher">${apEscapeHtml(label.teacher)}</span>` : ''}</button>`;
    }).join('');
    return `
        <div class="ws-clinic__bar apms-workspace__bar">
            <div class="ws-clinic__viewtabs" role="tablist" aria-label="클리닉 보기">${viewTabs}</div>
            <nav class="ws-clinic__classtabs" role="group" aria-label="반 전환">${classTabs}</nav>
        </div>`;
}

// 껍데기를 그린다. 모달이 이미 열려 있으면 깜박임 없이 내용만 바뀐다(ui.js applyModalContent).
// 오답 출력 = P 등급, 유사문항 = W 등급. 보기 탭 위치는 두 등급에서 같다.
function wsClinicShow(classId, view, viewHtml) {
    wsClinicState.seq += 1;
    wsClinicState.classId = String(classId || '');
    wsClinicState.view = view === 'similar' ? 'similar' : 'print';
    const isSimilar = wsClinicState.view === 'similar';
    const viewBox = isSimilar
        ? `<div id="ws-clinic-view" class="apms-workspace ws-clinic-similar" role="tabpanel" aria-labelledby="ws-clinic-viewtab-similar">${viewHtml || ''}</div>`
        : `<div id="ws-clinic-view" class="apms-modal__body ws-clinic__view ws-clinic__view--print" role="tabpanel" aria-labelledby="ws-clinic-viewtab-print">${viewHtml || ''}</div>`;
    showModal('클리닉', `
        <div id="ws-clinic-root" class="apms-modal ${isSimilar ? 'apms-modal--workspace' : 'apms-modal--panel'} ws-clinic ws-clinic--${wsClinicState.view}" data-class-id="${apEscapeHtml(wsClinicState.classId)}">
            ${wsClinicBarHtml(wsClinicState.classId, wsClinicState.view)}
            ${viewBox}
        </div>`);
    wsClinicRevealActiveClassTab();
    return wsClinicState.seq;
}

function wsClinicLoadingHtml(message) {
    return `<div class="ws-clinic-loading" role="status" aria-live="polite">${apEscapeHtml(message || '불러오는 중입니다.')}</div>`;
}

// 늦게 온 응답 가드: 이 요청이 아직 화면에 떠 있는 가장 최근 요청인가.
function wsClinicIsCurrent(token) {
    return Number(token) === wsClinicState.seq &&
        typeof isModalOpen === 'function' && isModalOpen() &&
        !!document.getElementById('ws-clinic-root');
}

function wsClinicRevealActiveClassTab() {
    const nav = document.querySelector('.ws-clinic__classtabs');
    const active = nav && nav.querySelector('.ws-clinic-classtab.is-active');
    if (!nav || !active) return;
    nav.scrollLeft = Math.max(0, active.offsetLeft - Math.max(0, (nav.clientWidth - active.offsetWidth) / 2));
}

// 오답 출력(P): 껍데기를 먼저 열고 "불러오는 중"을 보인다. 출력 센터 본문은 openClinicPrintCenter 가 채운다.
function wsClinicBeginPrint(classId) {
    return wsClinicShow(classId, 'print', wsClinicLoadingHtml('시험 기록을 불러오는 중입니다.'));
}

function wsClinicMountPrint(token, html) {
    if (!wsClinicIsCurrent(token)) return false;
    const view = document.getElementById('ws-clinic-view');
    if (!view) return false;
    view.innerHTML = html;
    if (typeof markModalClean === 'function') markModalClean();
    return true;
}

// 진입점. 옛 openClinicCenter / openClinicClassPicker 가 부른다.
function wsClinicOpen(classId = '', view = '') {
    const resolved = wsClinicResolveClassId(classId);
    if (!resolved) {
        toast('선택할 반이 없습니다.', 'warn');
        return false;
    }
    const target = view === 'similar' || view === 'print' ? view : wsClinicState.view;
    if (target === 'similar') {
        if (typeof wsClinicOpenSimilar === 'function') return wsClinicOpenSimilar(resolved);
        toast('유사문항 화면을 불러오지 못했습니다. 새로고침 후 다시 시도하세요.', 'warn');
        return false;
    }
    if (typeof openClinicPrintCenter === 'function') return openClinicPrintCenter(resolved);
    toast('클리닉 출력 화면을 불러오지 못했습니다.', 'warn');
    return false;
}

// 반·보기를 바꾸면 지금 화면에서 고른 내용(시험·학생 선택 등)이 사라진다. 입력한 것이 있으면 한 번 묻는다.
function wsClinicConfirmLeave() {
    if (typeof isModalDirty !== 'function' || !isModalDirty()) return true;
    const message = '선택한 내용이 사라집니다. 계속할까요?';
    return typeof window !== 'undefined' && typeof window.confirm === 'function' ? window.confirm(message) : true;
}

function wsClinicSwitchClass(classId) {
    const id = String(classId || '');
    if (!id || id === wsClinicState.classId) return;
    if (!wsClinicConfirmLeave()) return;
    wsClinicOpen(id, wsClinicState.view);
}

function wsClinicSwitchView(view) {
    const target = view === 'similar' ? 'similar' : 'print';
    if (target === wsClinicState.view) return;
    if (!wsClinicConfirmLeave()) return;
    wsClinicOpen(wsClinicState.classId, target);
}
