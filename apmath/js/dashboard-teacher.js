/**
 * AP Math OS [js/dashboard-teacher.js]
 * AP 선생님 전용 대시보드 렌더러
 * AP 선생님 화면 전용 — 타 시스템 게이트 없음
 */

function apTeacherRemoveSystemGate() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
}

function renderTeacherDashboardView() {
    if (!state) return;

    state.ui.currentClassId = null;
    if (typeof document !== 'undefined') {
        document.body.classList.add('ap-teacher-dashboard-mode');
        document.body.classList.remove('ap-owner-dashboard-bg');
        apTeacherRemoveSystemGate();
    }
    if (typeof renderAppDrawer === 'function') {
        renderAppDrawer();
    }

    const data = computeDashboardData();
    const root = document.getElementById('app-root');

    const shortcutRow = `
        <div class="ap-dashboard-shortcuts ap-dashboard-action-grid ap-dashboard-action-grid--teacher-quick" style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; background:var(--surface-2); padding:4px; border:1px solid var(--border); border-radius:16px; margin-bottom:18px;">
            <button class="btn ap-dashboard-action-button"
                    style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:var(--surface); color:var(--text); box-shadow:none; border:1px solid var(--border);"
                    onclick="if(typeof renderTimetable === 'function') renderTimetable(); else toast('불러오기 실패', 'warn');">
                시간표
            </button>
            <button class="btn ap-dashboard-action-button"
                    style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:var(--surface); color:var(--text); box-shadow:none; border:1px solid var(--border);"
                    onclick="if(typeof openAttendanceLedger === 'function') openAttendanceLedger(); else toast('불러오기 실패', 'warn');">
                출석부
            </button>
            <button class="btn ap-dashboard-action-button"
                    style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:var(--surface); color:var(--text); box-shadow:0 1px 2px rgba(0,0,0,0.05); border:none;"
                    onclick="openDashboardArchiveWindow(event);">
                아카이브
            </button>
        </div>
    `;

    const todayJournalCard = typeof renderTodayJournalCard === 'function' ? renderTodayJournalCard(data) : '';
    const todoSections = typeof renderTodoSections === 'function' ? renderTodoSections() : '';

    if (!state.ui.dashboardClassTab) state.ui.dashboardClassTab = 'all';
    const tab = state.ui.dashboardClassTab;

    const tabHtml = `
        <div class="ap-dashboard-tabbar" style="display:flex; gap:8px; background:var(--surface-2); padding:4px; border-radius:12px; margin-bottom:12px;">
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab === 'all' ? 'var(--surface)' : 'transparent'}; color:${tab === 'all' ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${tab === 'all' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'}; border:none;" onclick="state.ui.dashboardClassTab='all'; renderDashboard()">전체</button>
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab === 'middle' ? 'var(--surface)' : 'transparent'}; color:${tab === 'middle' ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${tab === 'middle' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'}; border:none;" onclick="state.ui.dashboardClassTab='middle'; renderDashboard()">중등</button>
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab === 'high' ? 'var(--surface)' : 'transparent'}; color:${tab === 'high' ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${tab === 'high' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'}; border:none;" onclick="state.ui.dashboardClassTab='high'; renderDashboard()">고등</button>
        </div>
    `;

    let filteredClasses = sortClassesForDashboard(state.db.classes.filter(c => Number(c.is_active) !== 0 && isClassScheduledTodayForDashboard(c.id)));
    filteredClasses = filteredClasses.filter(c => {
        if (tab === 'middle') return isMiddleSchoolClass(c);
        if (tab === 'high') return !isMiddleSchoolClass(c);
        return true;
    });

    const classStatus = `
        <div class="ap-dashboard-section-head" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:0 4px;">
            <h3 style="margin:0; font-size:14px; font-weight:500; color:var(--text);">학급관리</h3>
        </div>
        ${tabHtml}
        <div class="ap-dashboard-class-list" style="display:flex; flex-direction:column; gap:8px; margin-bottom:40px;">${filteredClasses.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    root.innerHTML = `<style>body.ap-teacher-dashboard-mode #ap-system-gate, body.ap-teacher-dashboard-mode .ap-system-gate, body.ap-teacher-dashboard-mode [data-ap-system-gate="true"]{display:none!important;}</style><div class="ap-dashboard-shell" style="width:100%; max-width:850px; margin:0 auto; padding:0 16px 24px; box-sizing:border-box;">
        ${shortcutRow}
        ${todayJournalCard}
        ${todoSections}
        <div id="dashboard-onboarding-panel-root"></div>
        ${classStatus}
    </div>`;

    if (typeof queueDashboardOnboardingTasksLoad === 'function') {
        queueDashboardOnboardingTasksLoad();
    }

    if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(apTeacherRemoveSystemGate);
    }
    if (typeof setTimeout === 'function') {
        setTimeout(apTeacherRemoveSystemGate, 0);
    }
}
