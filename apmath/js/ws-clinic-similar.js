/* APMS M7 클리닉 — 유사문항 보기 (W 등급 작업 화면). 껍데기와 반·탭 전환은 ws-clinic-shell.js.
 *
 * 옛 흐름(전부 새 모달, 취소 = 반 화면): 유사문항 목록 → 단원 상세 → 유사문항 추천 → 바구니.
 *   단원 A에서 단원 B로 가려면 취소로 반 화면까지 나가 다시 들어와야 했다.
 * 새 흐름(한 화면): 왼쪽 취약 단원 목록 / 오른쪽 선택 단원의 [오답 문항 | 유사문항 추천 | 바구니].
 *   단원을 고르는 데 서버 왕복이 없고, 추천·담기·삭제가 모두 같은 자리에서 일어난다. 취소는 한 번에 닫는다.
 *
 * 재사용: computeClassWeakUnits·buildSimilarQuestionCandidates·addClinicCandidate·getClinicCart·saveClinicCart·
 *   openClinicWorksheet(core.js)는 그대로 부른다. 후보 담기·바구니는 이 브라우저 localStorage 이고 학생에게 가지 않는다.
 *   옛 모달 함수(openWeakUnitDetail·openSimilarQuestionRecommendations·openClinicBasketByKey)는 시험 상세·학생 상세가
 *   부르므로 core.js 에 그대로 남아 있다.
 */
let wsClinicSimilar = null;

function wsClinicUnitKey(unit) {
    return String((unit && (unit.key || unit.unitKey || unit.label)) || '');
}

async function wsClinicOpenSimilar(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    if (!cls) {
        toast('반 정보를 찾을 수 없습니다.', 'warn');
        return false;
    }
    // 모달 먼저 열고 "확인하는 중"은 그 자리에서 보인다.
    const token = wsClinicShow(classId, 'similar', wsClinicLoadingHtml('반 오답 단원을 확인하는 중입니다.'));
    const studentIds = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));
    const sessions = (state.db.exam_sessions || [])
        .filter(session => studentIds.has(String(session.student_id)) && String(session.archive_file || '').trim());
    try {
        await ensureBlueprintsForSessions(sessions);
    } catch (e) {
        console.warn('[ws-clinic] blueprint load failed:', e);
    }
    // 불러오는 동안 다른 반·탭으로 바꿨거나 닫았으면 이 응답으로 화면을 덮지 않는다.
    if (!wsClinicIsCurrent(token)) return false;

    const units = computeClassWeakUnits(classId);
    const context = { targetType: 'class', targetId: classId, targetLabel: cls.name || '반' };
    const contextKey = makeClinicContextKey(context);
    state.ui.activeClinicContext = state.ui.clinicContexts?.[contextKey] || null;
    wsClinicSimilar = {
        classId: String(classId), className: cls.name || '반', units, context, contextKey, token,
        selected: units.length ? 0 : -1,
        sub: units.length ? 'wrong' : 'basket',
        rec: {}
    };
    const view = document.getElementById('ws-clinic-view');
    if (!view) return false;
    view.innerHTML = wsClinicListHtml(wsClinicSimilar) + '<div class="apms-workspace__detail ws-clinic-detail" id="ws-clinic-detail"></div>';
    wsClinicRenderDetail();
    return true;
}

function wsClinicBasketItems() {
    const data = wsClinicSimilar;
    return data ? getClinicCartItemsForContext(data.contextKey) : [];
}

function wsClinicListHtml(data) {
    const hint = data.units.length
        ? `취약 단원 ${data.units.length}개 · 오답이 많은 순서입니다. 단원을 고르면 오른쪽에서 유사문항을 찾습니다.`
        : '제출된 OMR 오답과 단원 정보가 있어야 유사문항 추천 기준을 만들 수 있습니다.';
    const header = `
        <div class="apms-unified-context">
            <div class="apms-unified-context__name">${apEscapeHtml(data.className)}</div>
            <div class="apms-unified-context__meta">${apEscapeHtml(hint)}</div>
        </div>`;
    if (!data.units.length) {
        return `<div class="apms-workspace__list ws-clinic-list" id="ws-clinic-list">${header}<div class="ws-clinic-empty">아직 추천 가능한 오답 단원이 없습니다.</div></div>`;
    }
    const items = data.units.map((unit, index) => {
        const meta = [unit.unitKey, unit.studentCount ? `${unit.studentCount}명` : '', `오답 ${unit.count}회`].filter(Boolean).join(' · ');
        return `<button type="button" class="apms-workspace__item ws-clinic-unit${index === data.selected ? ' is-active' : ''}" aria-current="${index === data.selected ? 'true' : 'false'}" onclick="wsClinicSelectUnit(${index})"><span class="ws-clinic-unit__name">${index + 1}. ${apEscapeHtml(unit.label)}</span><span class="ws-clinic-unit__meta">${apEscapeHtml(meta)}</span></button>`;
    }).join('');
    return `<div class="apms-workspace__list ws-clinic-list" id="ws-clinic-list">${header}${items}</div>`;
}

// ---- 오른쪽 상세 -----------------------------------------------------------

function wsClinicWrongRowsHtml(unit) {
    const questions = Array.isArray(unit.questions) ? unit.questions : [];
    if (!questions.length) return '<div class="ws-clinic-empty">상세 오답 기록이 없습니다.</div>';
    return `<ul class="ws-clinic-rows">${questions.map(q => {
        const score = q.score !== undefined && q.score !== null && q.score !== '' ? ` · ${apEscapeHtml(q.score)}점` : '';
        return `<li class="ws-clinic-row">
            <div class="ws-clinic-row__main">
                <div class="ws-clinic-row__name">${apEscapeHtml(getStudentNameById(q.studentId))}</div>
                <div class="ws-clinic-row__meta">${apEscapeHtml(q.examTitle || '시험명 없음')} · ${apEscapeHtml(q.examDate || '')}${score}</div>
            </div>
            <span class="ws-clinic-row__q">Q${apEscapeHtml(q.questionId)}</span>
        </li>`;
    }).join('')}</ul>`;
}

function wsClinicRecHtml(data, unit) {
    const rec = data.rec[wsClinicUnitKey(unit)];
    if (!rec) return '';
    if (rec.status === 'loading') return wsClinicLoadingHtml('JS아카이브에서 유사문항을 찾는 중입니다.');
    if (rec.status === 'error') {
        return `<div class="ws-clinic-empty ws-clinic-empty--error">유사문항 추천을 불러오지 못했습니다. JS아카이브 db.js 또는 exams 경로를 확인하세요.<br><button type="button" class="btn apms-unified-quiet ws-clinic-btn" onclick="wsClinicLoadRecommendations(${data.selected}, true)">다시 찾기</button></div>`;
    }
    if (!rec.candidates.length) return '<div class="ws-clinic-empty">추천 가능한 유사문항을 아직 찾지 못했습니다.</div>';
    const inBasket = new Set(wsClinicBasketItems().map(item => item.id));
    return `<div class="ws-clinic-note">후보 ${rec.candidates.length}개 · 담은 문항은 "바구니"에서 모아 클리닉지로 출력합니다.</div>
        <div class="ws-clinic-cards">${rec.candidates.map(({ key, candidate: c }, idx) => {
            const normalized = typeof normalizeClinicBasketItem === 'function' ? normalizeClinicBasketItem(c, data.context) : null;
            const added = !!normalized && inBasket.has(normalized.id);
            const exact = c.matchType === 'standardUnitKey';
            return `<article class="ws-clinic-candidate">
                <div class="ws-clinic-candidate__head">
                    <div class="ws-clinic-candidate__title">${idx + 1}. ${apEscapeHtml(c.examTitle)}</div>
                    <span class="ws-clinic-badge ${exact ? 'ws-clinic-badge--ok' : 'ws-clinic-badge--warn'}">${exact ? '단원 일치' : '개념군 보완'}</span>
                </div>
                <div class="ws-clinic-row__meta">Q${apEscapeHtml(c.questionId)} · ${apEscapeHtml(c.standardUnit || '')}${c.level ? ` · ${apEscapeHtml(c.level)}` : ''}</div>
                <div class="ws-clinic-candidate__preview">${apEscapeHtml(c.contentPreview || '')}</div>
                <button type="button" class="btn ws-clinic-btn ws-clinic-btn--outline"${added ? ' disabled' : ''} onclick="wsClinicAddCandidate(${wsClinicJsArg(key)})">${added ? '바구니에 담김' : '클리닉 후보 담기'}</button>
            </article>`;
        }).join('')}</div>`;
}

function wsClinicBasketHtml(data) {
    const items = wsClinicBasketItems();
    const bar = `<div class="ws-clinic-basket-bar">
        <div class="ws-clinic-note">${apEscapeHtml(data.className)} 바구니 · 후보 ${items.length}개</div>
        <div class="ws-clinic-basket-actions">
            <button type="button" class="btn ws-clinic-btn ws-clinic-btn--danger"${items.length ? '' : ' disabled'} onclick="wsClinicClearBasket()">바구니 비우기</button>
            <button type="button" class="btn btn-primary ws-clinic-btn ws-clinic-btn--primary"${items.length ? '' : ' disabled'} onclick="wsClinicPrintBasket()">클리닉지 출력</button>
        </div>
    </div>`;
    if (!items.length) return `${bar}<div class="ws-clinic-empty">담긴 클리닉 후보가 없습니다. "유사문항 추천"에서 후보를 담아 보세요.</div>`;
    const groups = groupClinicItems(items);
    return `${bar}<div class="ws-clinic-basket">${groups.map(group => Object.values(group.units).map(unit => `
        <section class="ws-clinic-basket-unit">
            <div class="ws-clinic-basket-unit__title">${apEscapeHtml(unit.unitLabel)}${unit.unitKey && unit.unitKey !== unit.unitLabel ? ` <span class="ws-clinic-row__meta">${apEscapeHtml(unit.unitKey)}</span>` : ''}</div>
            ${unit.items.map(item => `
            <div class="ws-clinic-basket-item">
                <div class="ws-clinic-row__main">
                    <div class="ws-clinic-row__name">${apEscapeHtml(item.sourceTitle)}</div>
                    <div class="ws-clinic-row__meta">Q${apEscapeHtml(item.questionNo)}${item.level ? ` · ${apEscapeHtml(item.level)}` : ''} · ${item.matchType === 'standardUnitKey' ? '단원 일치' : item.matchType === 'conceptClusterKey' ? '개념군 보완' : '후보'}</div>
                    ${item.preview ? `<div class="ws-clinic-candidate__preview">${apEscapeHtml(item.preview)}</div>` : ''}
                </div>
                <button type="button" class="btn ws-clinic-btn ws-clinic-btn--danger" aria-label="${apEscapeHtml(`${item.sourceTitle} Q${item.questionNo} 삭제`)}" onclick="wsClinicRemoveCandidate(${wsClinicJsArg(item.id)})">삭제</button>
            </div>`).join('')}
        </section>`).join('')).join('')}</div>`;
}

function wsClinicRenderDetail(keepScroll) {
    const data = wsClinicSimilar;
    const box = document.getElementById('ws-clinic-detail');
    if (!data || !box) return;
    const scrollTop = keepScroll ? box.scrollTop : 0;
    const unit = data.units[data.selected];
    const basketCount = wsClinicBasketItems().length;
    let html;
    if (!unit) {
        // 추천 가능한 단원이 없어도 담아 둔 후보는 볼 수 있다.
        html = `<div class="ws-clinic-detail__head"><div class="ws-clinic-detail__title">클리닉 바구니</div></div>${wsClinicBasketHtml(data)}`;
    } else {
        const meta = [unit.unitKey ? `단원키 ${unit.unitKey}` : '', `오답 ${unit.count}회`, unit.studentCount ? `${unit.studentCount}명` : ''].filter(Boolean).join(' · ');
        const sub = (id, label, extra = '') => `<button type="button" class="ws-clinic-subtab${data.sub === id ? ' is-active' : ''}" aria-pressed="${data.sub === id ? 'true' : 'false'}" onclick="wsClinicSetSub('${id}')">${label}${extra}</button>`;
        const body = data.sub === 'rec' ? wsClinicRecHtml(data, unit) : data.sub === 'basket' ? wsClinicBasketHtml(data) : wsClinicWrongRowsHtml(unit);
        html = `
            <div class="ws-clinic-detail__head">
                <div class="ws-clinic-detail__title">${apEscapeHtml(unit.label || '취약 단원')}</div>
                <div class="ws-clinic-detail__meta">${apEscapeHtml(meta)}</div>
            </div>
            <div class="ws-clinic-subtabs" role="group" aria-label="단원 상세 보기">
                ${sub('wrong', '오답 문항', ` <span class="ws-clinic-count">${(unit.questions || []).length}</span>`)}
                ${sub('rec', '유사문항 추천')}
                ${sub('basket', '바구니', ` <span class="ws-clinic-count ws-clinic-basket-count">${basketCount}</span>`)}
            </div>
            <div class="ws-clinic-detail__body">${body}</div>`;
    }
    box.innerHTML = html;
    box.scrollTop = scrollTop;
}

function wsClinicRefreshListSelection() {
    const data = wsClinicSimilar;
    document.querySelectorAll('#ws-clinic-list .ws-clinic-unit').forEach((button, index) => {
        const selected = !!data && index === data.selected;
        button.classList.toggle('is-active', selected);
        button.setAttribute('aria-current', selected ? 'true' : 'false');
    });
}

// ---- 동작 ------------------------------------------------------------------

// 단원을 고른다. 서버 왕복 없이 오른쪽 상세만 바뀐다. 보고 있던 보기(오답 문항/추천/바구니)는 유지한다.
function wsClinicSelectUnit(index) {
    const data = wsClinicSimilar;
    const i = Number(index);
    if (!data || !data.units[i]) return;
    data.selected = i;
    wsClinicRefreshListSelection();
    wsClinicRenderDetail();
    if (data.sub === 'rec') wsClinicLoadRecommendations(i);
    // 휴대폰은 목록 위 · 상세 아래로 쌓여 있어 상세가 보이도록 내려 준다.
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 600px)').matches) {
        const detail = document.getElementById('ws-clinic-detail');
        if (detail && typeof detail.scrollIntoView === 'function') detail.scrollIntoView({ block: 'start' });
    }
}

function wsClinicSetSub(sub) {
    const data = wsClinicSimilar;
    if (!data || !['wrong', 'rec', 'basket'].includes(sub)) return;
    data.sub = sub;
    if (sub === 'rec' && data.selected >= 0) wsClinicLoadRecommendations(data.selected);
    wsClinicRenderDetail();
}

async function wsClinicLoadRecommendations(index, force) {
    const data = wsClinicSimilar;
    const unit = data && data.units[Number(index)];
    if (!unit) return;
    const key = wsClinicUnitKey(unit);
    const existing = data.rec[key];
    if (existing && (existing.status === 'loading' || (existing.status === 'ready' && !force))) return;
    data.rec[key] = { status: 'loading', candidates: [] };
    if (data.selected === Number(index) && data.sub === 'rec') wsClinicRenderDetail();
    let result;
    try {
        const candidates = await buildSimilarQuestionCandidates(unit, 10);
        if (!state.ui.recommendationCandidates) state.ui.recommendationCandidates = {};
        result = {
            status: 'ready',
            candidates: candidates.map((candidate, idx) => {
                const candidateKey = `rec_${Date.now()}_${idx}_${Math.random().toString(36).slice(2, 7)}`;
                state.ui.recommendationCandidates[candidateKey] = candidate;
                return { key: candidateKey, candidate };
            })
        };
    } catch (e) {
        console.warn('[ws-clinic] 유사문항 추천 실패:', e);
        result = { status: 'error', candidates: [] };
    }
    // 늦게 온 응답: 다른 반·탭으로 바뀌었거나 닫혔으면 버린다(그 반의 화면을 덮지 않는다).
    if (wsClinicSimilar !== data || !wsClinicIsCurrent(data.token)) return;
    data.rec[key] = result;
    const selected = data.units[data.selected];
    if (selected && wsClinicUnitKey(selected) === key && data.sub === 'rec') wsClinicRenderDetail(true);
}

function wsClinicAddCandidate(candidateKey) {
    const data = wsClinicSimilar;
    if (!data) return;
    state.ui.activeClinicContext = state.ui.clinicContexts?.[data.contextKey] || state.ui.activeClinicContext;
    addClinicCandidate(candidateKey, data.contextKey);
    wsClinicRenderDetail(true);
}

function wsClinicRemoveCandidate(itemId) {
    const data = wsClinicSimilar;
    const id = String(itemId || '');
    if (!data || !id) return;
    saveClinicCart(getClinicCart().filter(item => item.id !== id));
    toast('클리닉 후보를 삭제했습니다.', 'info');
    wsClinicRenderDetail(true);
}

function wsClinicClearBasket() {
    const data = wsClinicSimilar;
    const items = wsClinicBasketItems();
    if (!data || !items.length) {
        toast('비울 클리닉 후보가 없습니다.', 'warn');
        return;
    }
    if (!confirm(`${data.className} 바구니의 후보 ${items.length}개를 모두 비울까요?`)) return;
    const removeIds = new Set(items.map(item => item.id));
    saveClinicCart(getClinicCart().filter(item => !removeIds.has(item.id)));
    toast('클리닉 바구니를 비웠습니다.', 'info');
    wsClinicRenderDetail(true);
}

function wsClinicPrintBasket() {
    const data = wsClinicSimilar;
    if (!data) return;
    openClinicWorksheet(data.contextKey);
}
