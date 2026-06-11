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

    if (typeof injectDashboardRedesignStyles === 'function') injectDashboardRedesignStyles();

    const allActiveClasses = sortClassesForDashboard((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    const visibleClasses = allActiveClasses.filter(c => typeof isClassVisibleForCurrentTeacher === 'function' ? isClassVisibleForCurrentTeacher(c) : true);
    const visibleClassIds = new Set(visibleClasses.map(c => String(c.id)));
    const classStudentByStudentId = new Map((state.db.class_students || []).map(m => [String(m.student_id), String(m.class_id)]));
    const classById = new Map((state.db.classes || []).map(c => [String(c.id), c]));
    const activeStudents = (state.db.students || []).filter(s => String(s.status || '') === '재원');
    const visibleStudents = activeStudents.filter(s => {
        const cid = classStudentByStudentId.get(String(s.id));
        if (!cid) return true;
        return visibleClassIds.has(cid);
    });
    const studentScopeCounts = visibleStudents.reduce((acc, student) => {
        const cid = classStudentByStudentId.get(String(student.id));
        const cls = cid ? classById.get(String(cid)) : null;
        const isMiddle = cls ? isMiddleSchoolClass(cls) : !String(student.grade || '').startsWith('고');
        if (isMiddle) acc.middle += 1;
        else acc.high += 1;
        return acc;
    }, { middle: 0, high: 0 });

    const todayClassCount = visibleClasses.filter(c => data?.classSummaries?.[c.id]?.isScheduled).length;
    const absentCount = Number(data?.global?.absentCount || 0);
    const homeworkMissCount = Number(data?.global?.hwNotDoneCount || 0);
    const totalScopedStudents = studentScopeCounts.middle + studentScopeCounts.high;

    const metricRow = `
        <div class="ap-metric-container" aria-label="선생님 대시보드 요약">
            <div class="ap-metric-card ap-metric-card--summary">
                <div class="ap-metric-label">오늘 수업</div>
                <div class="ap-metric-value">${todayClassCount}개 반</div>
            </div>
            <div class="ap-metric-card ap-metric-card--summary">
                <div class="ap-metric-label">담당 학생</div>
                <div class="ap-metric-value ap-metric-value--split">중등 ${studentScopeCounts.middle} · 고등 ${studentScopeCounts.high}</div>
                <div class="ap-metric-sub">총 ${totalScopedStudents}명</div>
            </div>
            <div class="ap-metric-card ap-metric-card--summary ${absentCount || homeworkMissCount ? 'ap-metric-card--attention' : ''}">
                <div class="ap-metric-label">수업 체크</div>
                <div class="ap-metric-value ap-metric-value--split">결석 ${absentCount} · 숙제 ${homeworkMissCount}</div>
            </div>
        </div>
    `;

    const shortcutPanel = `
        <section class="ap-dash-card ap-dash-quick-panel" aria-label="시간표 출석부 아카이브">
            <div class="ap-dash-quick-grid">
                <button class="ap-dash-quick-card" type="button"
                        onclick="if(typeof renderTimetable === 'function') renderTimetable(); else toast('불러오기 실패','warn');">
                    <span class="ap-dash-quick-title">시간표</span>
                </button>
                <button class="ap-dash-quick-card" type="button"
                        onclick="if(typeof openAttendanceLedger === 'function') openAttendanceLedger(); else toast('불러오기 실패','warn');">
                    <span class="ap-dash-quick-title">출석부</span>
                </button>
                <button class="ap-dash-quick-card" type="button" onclick="openDashboardArchiveWindow(event);">
                    <span class="ap-dash-quick-title">아카이브</span>
                </button>
            </div>
        </section>
    `;

    const todayJournalCard = typeof renderTodayJournalCard === 'function' ? renderTodayJournalCard(data) : '';
    const todoSections = typeof renderTodoSections === 'function' ? renderTodoSections() : '';

    if (!state.ui.dashboardClassTab) state.ui.dashboardClassTab = 'all';

    // E. 학급관리 탭 — 학교급이 단일이면 탭 숨김, 사라진 자리에 구분선
    const hasMiddle = visibleClasses.some(c => isMiddleSchoolClass(c));
    const hasHigh = visibleClasses.some(c => !isMiddleSchoolClass(c));
    const isMultiGrade = hasMiddle && hasHigh;
    const tab = isMultiGrade ? state.ui.dashboardClassTab : 'all';

    const tabBtn = (key, label) => `<button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab === key ? 'var(--surface)' : 'transparent'}; color:${tab === key ? 'var(--text)' : 'var(--secondary)'}; box-shadow:${tab === key ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'}; border:none;" onclick="state.ui.dashboardClassTab='${key}'; renderDashboard()">${label}</button>`;

    const tabHtml = isMultiGrade ? `
        <div class="ap-dashboard-tabbar" style="display:flex; gap:8px; background:var(--surface-2); padding:4px; border-radius:12px; margin-bottom:12px;">
            ${tabBtn('all', '전체')}${tabBtn('middle', '중등')}${tabBtn('high', '고등')}
        </div>
    ` : `<div style="border-bottom:1px solid var(--border); margin-bottom:16px;"></div>`;

    const filteredClasses = visibleClasses.filter(c => {
        if (tab === 'middle') return isMiddleSchoolClass(c);
        if (tab === 'high') return !isMiddleSchoolClass(c);
        return true;
    });

    const classStatus = `
        <section class="ap-dash-card" style="margin-bottom:0;">
            <h3 class="ap-dash-card__title">학급관리</h3>
            ${tabHtml}
            <div class="ap-dashboard-class-list" style="display:flex; flex-direction:column; gap:8px;">${filteredClasses.map(c => renderClassSummaryCard(c, data)).join('')}</div>
        </section>
    `;

    root.innerHTML = `<style>body.ap-teacher-dashboard-mode #ap-system-gate, body.ap-teacher-dashboard-mode .ap-system-gate, body.ap-teacher-dashboard-mode [data-ap-system-gate="true"]{display:none!important;}</style><div class="ap-dashboard-shell ap-dash-redesign">
        ${metricRow}
        <div class="ap-dash-grid">
            <div class="ap-dash-main">
                ${classStatus}
            </div>
            <div class="ap-dash-side">
                ${todayJournalCard}
                ${todoSections}
                ${shortcutPanel}
                <div id="dashboard-onboarding-panel-root"></div>
            </div>
        </div>
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
