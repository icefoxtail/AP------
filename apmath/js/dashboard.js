/**
 * AP Math OS 1.0 [dashboard_render_patch.js]
 * renderDashboard 관련 렌더 함수 ui.js 통일 패치 — Option A 확정
 *
 * 설계 원칙 (ui.js 기준 통일):
 * - 헤더: 모바일 고정 헤더(ui.js)가 담당 → renderDashboard 내부 헤더 없음
 * - 여백: 모든 콘텐츠 padding 0 16px 래퍼 하나로 통일
 * - border-radius: 16px(카드) / 10px(배지·태그) 2단계만
 * - font-size: 15px(본문) / 13px(보조) / 11px(태그) 3단계만
 * - font-weight: 800(기본) / 900(강조) 2단계만
 * - 색상: CSS변수만, rgba 직접 사용 없음
 */

// ============================================================
// [공통 토큰]
// ============================================================
const AP_UI_DS = {
    x:      '16px',
    r:      '16px',
    rSm:    '10px',
    fs:     '15px',
    fsSub:  '13px',
    fsTag:  '11px',
    fw:     '800',
    fwBold: '900',
};

// ============================================================
// [오늘일지 카드]
// ============================================================
function renderTodayJournalCard(data) {
    const todayClasses = state.db.classes.filter(c => {
        if (Number(c.is_active) === 0) return false;
        if (!isMiddleSchoolClass(c)) return false;
        const summary = data.classSummaries[c.id];
        if (!summary || !summary.isScheduled || summary.activeCount === 0) return false;
        return true;
    });

    let contentHtml = '';
    if (todayClasses.length === 0) {
        contentHtml = `
            <span style="
                font-size:${AP_UI_DS.fsSub};
                font-weight:${AP_UI_DS.fw};
                color:var(--secondary);
            ">오늘 수업반 없음</span>
        `;
    } else {
        const classStrings = todayClasses.map(c => {
            const s = data.classSummaries[c.id];
            return `
                <span style="white-space:nowrap;">
                    ${apEscapeHtml(c.name)}
                    <span style="color:var(--primary); font-weight:${AP_UI_DS.fwBold};">${s.present}</span><span style="color:var(--secondary);">/${s.activeCount}</span>
                </span>
            `;
        });
        contentHtml = `
            <div style="
                display:flex;
                flex-wrap:wrap;
                gap:10px;
                font-size:${AP_UI_DS.fs};
                font-weight:${AP_UI_DS.fw};
                color:var(--text);
                line-height:1.6;
            ">${classStrings.join('')}</div>
        `;
    }

    return `
        <div style="margin-bottom:20px;">
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:8px;
            ">
                <span style="
                    font-size:${AP_UI_DS.fs};
                    font-weight:${AP_UI_DS.fwBold};
                    color:var(--text);
                ">오늘일지</span>
            </div>
            <div
                onclick="if(typeof openDailyJournalModal==='function') openDailyJournalModal(); else toast('일지 기능을 불러오지 못했습니다.','warn');"
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:12px;
                    padding:14px ${AP_UI_DS.x};
                    background:var(--surface);
                    border:1px solid var(--border);
                    border-radius:${AP_UI_DS.r};
                    box-shadow:var(--shadow);
                    cursor:pointer;
                "
            >
                <div style="min-width:0; flex:1;">${contentHtml}</div>
                <span style="
                    font-size:20px;
                    font-weight:${AP_UI_DS.fwBold};
                    color:var(--primary);
                    line-height:1;
                    flex:0 0 auto;
                ">›</span>
            </div>
        </div>
    `;
}

// ============================================================
// [오늘일정 / 주간일정]
// ============================================================
function renderTodoSections() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');

    const todayMemos = state.db.operation_memos.filter(m => {
        const isDone  = m.is_done   == 1 || m.is_done   === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return !isDone && (isPinned || m.memo_date === todayStr);
    });

    const upcomingMemos = state.db.operation_memos.filter(m => {
        const isDone   = m.is_done   == 1 || m.is_done   === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return !isDone && !isPinned && m.memo_date > todayStr && m.memo_date <= nextWeekStr;
    });

    const upcomingExams = (state.db.exam_schedules || []).filter(e =>
        e.exam_date >= todayStr && e.exam_date <= nextWeekStr
    );

    // 오늘일정 행
    const todayRows = todayMemos.length
        ? todayMemos.map(m => {
            const isPinned = m.is_pinned == 1 || m.is_pinned === true;
            return `
                <div style="
                    padding:13px ${AP_UI_DS.x};
                    border-bottom:1px solid var(--border);
                    display:flex;
                    align-items:center;
                    gap:12px;
                ">
                    <input
                        type="checkbox"
                        onclick="event.stopPropagation()"
                        onchange="toggleMemoDone('${m.id}', this.checked)"
                        style="transform:scale(1.15); margin:0; flex:0 0 auto; accent-color:var(--primary);"
                    >
                    <span style="
                        font-size:${AP_UI_DS.fs};
                        font-weight:${AP_UI_DS.fw};
                        color:${isPinned ? 'var(--primary)' : 'var(--text)'};
                        flex:1;
                    ">${isPinned
                        ? `<span style="
                            font-size:${AP_UI_DS.fsTag};
                            font-weight:${AP_UI_DS.fwBold};
                            background:var(--surface-2);
                            color:var(--primary);
                            padding:2px 6px;
                            border-radius:${AP_UI_DS.rSm};
                            margin-right:6px;
                          ">고정</span>`
                        : ''}${apEscapeHtml(m.content)}</span>
                </div>
            `;
        }).join('')
        : `<div style="
            padding:22px ${AP_UI_DS.x};
            font-size:${AP_UI_DS.fsSub};
            font-weight:${AP_UI_DS.fw};
            color:var(--secondary);
            text-align:center;
          ">오늘 등록된 할 일이 없습니다.</div>`;

    // 주간일정 아이템
    const upcomingItems = [];
    upcomingMemos.forEach(m => upcomingItems.push({ type: 'memo', date: m.memo_date, item: m }));
    upcomingExams.forEach(e => upcomingItems.push({ type: 'exam', date: e.exam_date, item: e }));
    upcomingItems.sort((a, b) => a.date.localeCompare(b.date));

    const upcomingRows = upcomingItems.slice(0, 5).map(u => {
        const timeVal  = apParseLocalDateTime(u.date);
        const diffDays = timeVal !== null
            ? Math.ceil((timeVal - todayTime) / (1000 * 60 * 60 * 24))
            : 0;
        const dDay  = diffDays <= 0 ? 'D-Day' : `D-${diffDays}`;
        const label = u.type === 'exam'
            ? `${apEscapeHtml(u.item.school_name)} ${apEscapeHtml(u.item.grade)} ${apEscapeHtml(u.item.exam_name)}`
            : apEscapeHtml(u.item.content);
        const action = u.type === 'exam' ? 'openExamScheduleModal()' : 'openTodoMemoModal()';

        return `
            <div
                onclick="${action}"
                style="
                    padding:13px ${AP_UI_DS.x};
                    border-bottom:1px solid var(--border);
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                    cursor:pointer;
                "
            >
                <span style="
                    font-size:${AP_UI_DS.fs};
                    font-weight:${AP_UI_DS.fw};
                    color:var(--text);
                    flex:1;
                    min-width:0;
                ">${label}</span>
                <span style="
                    font-size:${AP_UI_DS.fsTag};
                    font-weight:${AP_UI_DS.fwBold};
                    color:var(--primary);
                    background:var(--surface-2);
                    padding:4px 8px;
                    border-radius:${AP_UI_DS.rSm};
                    white-space:nowrap;
                    flex:0 0 auto;
                ">${dDay}</span>
            </div>
        `;
    }).join('');

    return `
        <div style="margin-bottom:20px;">

            <!-- 오늘일정 -->
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:8px;
            ">
                <span style="font-size:${AP_UI_DS.fs}; font-weight:${AP_UI_DS.fwBold}; color:var(--text);">오늘일정</span>
                <button
                    onclick="openTodoMemoModal()"
                    style="
                        padding:0; border:0; background:transparent;
                        font-size:${AP_UI_DS.fsSub}; font-weight:${AP_UI_DS.fw};
                        color:var(--secondary); cursor:pointer; font-family:inherit;
                    "
                >관리</button>
            </div>
            <div
                onclick="openTodoMemoModal()"
                style="
                    cursor:pointer;
                    margin-bottom:20px;
                    border-radius:${AP_UI_DS.r};
                    border:1px solid var(--border);
                    background:var(--surface);
                    overflow:hidden;
                "
            >${todayRows}</div>

            ${upcomingItems.length ? `
            <!-- 주간일정 -->
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:8px;
            ">
                <span style="font-size:${AP_UI_DS.fs}; font-weight:${AP_UI_DS.fwBold}; color:var(--text);">주간일정</span>
                <button
                    onclick="openExamScheduleModal()"
                    style="
                        padding:0; border:0; background:transparent;
                        font-size:${AP_UI_DS.fsSub}; font-weight:${AP_UI_DS.fw};
                        color:var(--secondary); cursor:pointer; font-family:inherit;
                    "
                >관리</button>
            </div>
            <div style="
                border-radius:${AP_UI_DS.r};
                border:1px solid var(--border);
                background:var(--surface);
                overflow:hidden;
                margin-bottom:20px;
            ">${upcomingRows}</div>
            ` : ''}
        </div>
    `;
}

// ============================================================
// [학급 카드]
// ============================================================
function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id];
    if (!s) return '';

    if (!s.isScheduled) {
        return `
            <div
                onclick="renderClass('${cls.id}')"
                style="
                    cursor:pointer;
                    padding:14px ${AP_UI_DS.x};
                    border-radius:${AP_UI_DS.r};
                    border:1px solid var(--border);
                    background:var(--surface-2);
                    display:flex;
                    flex-direction:column;
                    justify-content:space-between;
                    min-height:90px;
                "
            >
                <span style="
                    font-size:${AP_UI_DS.fs};
                    font-weight:${AP_UI_DS.fwBold};
                    color:var(--secondary);
                    margin-bottom:10px;
                    display:block;
                ">${apEscapeHtml(cls.name)}</span>
                <span style="
                    font-size:${AP_UI_DS.fsSub};
                    font-weight:${AP_UI_DS.fw};
                    color:var(--secondary);
                    background:var(--surface);
                    border:1px solid var(--border);
                    padding:6px 10px;
                    border-radius:${AP_UI_DS.rSm};
                    text-align:center;
                ">오늘 수업 없음</span>
            </div>
        `;
    }

    return `
        <div
            onclick="renderClass('${cls.id}')"
            style="
                cursor:pointer;
                padding:14px ${AP_UI_DS.x};
                border-radius:${AP_UI_DS.r};
                border:1px solid var(--border);
                background:var(--surface);
                box-shadow:var(--shadow);
                display:flex;
                flex-direction:column;
                justify-content:space-between;
                min-height:90px;
            "
        >
            <span style="
                font-size:${AP_UI_DS.fs};
                font-weight:${AP_UI_DS.fwBold};
                color:var(--text);
                margin-bottom:12px;
                display:block;
            ">${apEscapeHtml(cls.name)}</span>

            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <span style="
                    font-size:${AP_UI_DS.fsSub};
                    font-weight:${AP_UI_DS.fw};
                    color:var(--secondary);
                    background:var(--surface-2);
                    border:1px solid var(--border);
                    padding:5px 10px;
                    border-radius:${AP_UI_DS.rSm};
                ">재원 <b style="font-weight:${AP_UI_DS.fwBold}; color:var(--text);">${s.activeCount}</b></span>

                <span style="
                    font-size:${AP_UI_DS.fsSub};
                    font-weight:${AP_UI_DS.fw};
                    color:var(--secondary);
                    background:var(--surface-2);
                    border:1px solid var(--border);
                    padding:5px 10px;
                    border-radius:${AP_UI_DS.rSm};
                ">등원 <b style="font-weight:${AP_UI_DS.fwBold}; color:var(--primary);">${s.present}</b></span>

                <span style="
                    font-size:${AP_UI_DS.fsSub};
                    font-weight:${AP_UI_DS.fw};
                    color:var(--secondary);
                    background:var(--surface-2);
                    border:1px solid var(--border);
                    padding:5px 10px;
                    border-radius:${AP_UI_DS.rSm};
                ">결석 <b style="font-weight:${AP_UI_DS.fwBold}; color:${s.absent > 0 ? 'var(--error)' : 'var(--text)'};">${s.absent}</b></span>
            </div>
        </div>
    `;
}

// ============================================================
// [메인 대시보드]
// ============================================================
function renderDashboard() {
    state.ui.currentClassId = null;
    if (typeof renderAppDrawer === 'function') renderAppDrawer();

    const data    = computeDashboardData();
    const root    = document.getElementById('app-root');
    const classes = sortClassesForDashboard(
        state.db.classes.filter(c => Number(c.is_active) !== 0)
    );

    const classGrid = `
        <div style="margin-bottom:40px;">
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                margin-bottom:8px;
            ">
                <span style="
                    font-size:${AP_UI_DS.fs};
                    font-weight:${AP_UI_DS.fwBold};
                    color:var(--text);
                ">학급관리</span>
            </div>
            <div style="
                display:grid;
                grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));
                gap:12px;
            ">
                ${classes.map(c => renderClassSummaryCard(c, data)).join('')}
            </div>
        </div>
    `;

    // 모든 콘텐츠를 padding 0 16px 래퍼 하나로 통일
    // 헤더는 ui.js 모바일 고정 헤더가 담당 → 내부 헤더 없음
    root.innerHTML = `
        <div style="padding:0 ${AP_UI_DS.x};">
            ${renderTodayJournalCard(data)}
            ${renderTodoSections()}
            ${classGrid}
        </div>
    `;
}
