(function () {
    function esc(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function rowsFromPayload(payload, keys) {
        if (!payload) return [];
        for (const key of keys) {
            if (Array.isArray(payload?.[key])) return payload[key];
        }
        if (Array.isArray(payload?.data)) return payload.data;
        return [];
    }

    function normalizeStudentRows(payload) {
        return rowsFromPayload(payload, ['students', 'student_seeds', 'rows'])
            .map(row => ({
                ...row,
                id: row?.id || row?.student_id || row?.seed_id || row?.candidate_id || '',
                name: row?.name || row?.student_name || row?.student_name_raw || row?.display_name || '',
                status: row?.status || row?.student_status || '',
                grade: row?.grade || row?.grade_raw || '',
                created_at: row?.created_at || row?.createdAt || row?.imported_at || row?.updated_at || ''
            }))
            .filter(row => row.name || row.id);
    }

    function normalizeCellRows(payload) {
        return rowsFromPayload(payload, ['timetable_cells', 'cells', 'rows']);
    }

    function normalizeNeedsReviewRows(payload) {
        return rowsFromPayload(payload, ['needs_review', 'needsReview', 'rows']);
    }

    function countByStatus(rows, keyword) {
        return rows.filter(row => String(row?.status || '').includes(keyword)).length;
    }

    function recentStudentCount(rows) {
        const now = Date.now();
        const cutoff = now - 14 * 24 * 60 * 60 * 1000;
        return rows.filter(row => {
            const raw = String(row?.created_at || '').trim();
            if (!raw) return false;
            const time = Date.parse(raw);
            return Number.isFinite(time) && time >= cutoff;
        }).length;
    }

    async function loadDashboardData() {
        const currentState = window.EieState?.get?.() || {};
        const data = {
            timetableCells: Array.isArray(currentState.timetableCells) ? currentState.timetableCells : [],
            students: Array.isArray(currentState.studentSeeds) ? currentState.studentSeeds : [],
            needsReview: Array.isArray(currentState.needsReview) ? currentState.needsReview : [],
            errors: []
        };

        if (!window.EieApi) return data;

        const [timetableResult, studentsResult, needsReviewResult] = await Promise.allSettled([
            window.EieApi.getTimetable(null, { status: 'active,needs_review,hidden' }),
            window.EieApi.getStudentSeeds(),
            window.EieApi.getNeedsReview()
        ]);

        if (timetableResult.status === 'fulfilled') {
            data.timetableCells = normalizeCellRows(timetableResult.value);
            if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(data.timetableCells);
            if (timetableResult.value?.fallback && timetableResult.value?.error) data.errors.push(timetableResult.value.error);
        } else {
            data.errors.push(timetableResult.reason?.message || '시간표를 불러오지 못했습니다.');
        }

        if (studentsResult.status === 'fulfilled') {
            data.students = normalizeStudentRows(studentsResult.value);
            if (window.EieState?.setStudentSeeds) window.EieState.setStudentSeeds(data.students);
            if (studentsResult.value?.fallback && studentsResult.value?.error) data.errors.push(studentsResult.value.error);
        } else {
            data.errors.push(studentsResult.reason?.message || '학생 정보를 불러오지 못했습니다.');
        }

        if (needsReviewResult.status === 'fulfilled') {
            data.needsReview = normalizeNeedsReviewRows(needsReviewResult.value);
            if (window.EieState?.setNeedsReview) window.EieState.setNeedsReview(data.needsReview);
            if (needsReviewResult.value?.fallback && needsReviewResult.value?.error) data.errors.push(needsReviewResult.value.error);
        } else {
            data.errors.push(needsReviewResult.reason?.message || '확인 필요 항목을 불러오지 못했습니다.');
        }

        return data;
    }

    function renderGate() {
        return `
            <div class="owner-brand-tabs eie-admin-app-gate eie-surface-toolbar eie-surface-toolbar--two" role="navigation" aria-label="시스템 전환">
                <button class="owner-brand-tab eie-admin-shortcut eie-surface-action" type="button" aria-label="AP MATH 원장 대시보드로 이동" onclick="location.replace('../apmath/index.html')">AP MATH</button>
                <button class="owner-brand-tab owner-brand-tab--current eie-admin-shortcut eie-surface-action eie-surface-action--current is-active" type="button" data-eie-route="dashboard" aria-current="page" aria-label="EIE 대시보드">EIE</button>
            </div>
        `;
    }

    function renderActionGrid() {
        return `
            <div class="ap-admin-shortcuts ap-admin-action-grid eie-admin-shortcuts eie-admin-action-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="원장님 바로가기">
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" disabled aria-label="EIE 출석부 준비중" title="준비중">출석부</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="timetable-v2" aria-label="EIE 시간표" title="시간표">시간표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" disabled aria-label="EIE 성적표 준비중" title="준비중">성적표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="management" aria-label="EIE 관리" title="관리">관리</button>
            </div>
        `;
    }

    function renderMiniMetric(label, value, route) {
        const routeAttr = route ? ` data-eie-route="${esc(route)}"` : ' disabled';
        return `
            <button class="ap-admin-mini-metric eie-admin-mini-metric eie-surface-inner-card" type="button"${routeAttr} aria-label="${esc(label)} 보기" title="${esc(label)}">
                <span>${esc(label)}</span>
                <strong>${Number(value || 0).toLocaleString('ko-KR')}</strong>
            </button>
        `;
    }

    function renderOverview(data) {
        const students = data.students || [];
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">오늘 운영</h3>
                </div>
                <div class="ap-admin-overview-grid eie-admin-overview-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="오늘 운영">
                    ${renderMiniMetric('재원', students.length, 'students')}
                    ${renderMiniMetric('최근 등록', recentStudentCount(students))}
                    ${renderMiniMetric('대기', countByStatus(students, '대기'))}
                    ${renderMiniMetric('확인 필요', (data.needsReview || []).length)}
                </div>
            </div>
        `;
    }

    function renderPlaceholderCard(title, copy, route) {
        const routeAttr = route ? ` data-eie-route="${esc(route)}"` : ' disabled';
        return `
            <button class="card ap-admin-card eie-admin-placeholder-card eie-surface-big-card" type="button"${routeAttr} aria-label="${esc(title)}" title="${esc(title)}">
                <strong>${esc(title)}</strong>
                <small>${esc(copy || '준비중')}</small>
            </button>
        `;
    }

    function renderTeacherStatusPlaceholder() {
        return `
            <div class="ap-admin-section eie-admin-section">
                <div style="margin-bottom:12px;">
                    <h3 class="ap-admin-section-title eie-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">선생님 현황</h3>
                </div>
                <div class="ap-admin-teacher-grid eie-admin-teacher-grid">
                    ${renderPlaceholderCard('EIE 선생님 1', '계정/담당반 준비중')}
                    ${renderPlaceholderCard('EIE 선생님 2', '계정/담당반 준비중')}
                    ${renderPlaceholderCard('EIE 선생님 3', '계정/담당반 준비중')}
                </div>
            </div>
        `;
    }

    function renderRecentConsultationPlaceholder() {
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 상담</h3>
                </div>
                <div class="card eie-admin-empty-card">상담 기록 연동 준비중</div>
            </div>
        `;
    }

    function renderRecentStudents(data) {
        const rows = (data.students || []).slice(0, 6);
        const rowHtml = rows.map(student => `
            <button class="ap-admin-recent-student-row eie-admin-recent-row" type="button" data-eie-route="students" aria-label="${esc(student.name || '학생')} 확인" title="${esc(student.name || '학생')}">
                <span>
                    <strong>${esc(student.name || '이름 없음')}</strong>
                    <small>${esc([student.grade, student.status].filter(Boolean).join(' · ') || 'EIE 학생')}</small>
                </span>
                <em>상세</em>
            </button>
        `).join('');

        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row eie-admin-section-title-row--split">
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 등록 원생</h3>
                    <span>표시 ${rows.length}명</span>
                </div>
                <div class="ap-admin-recent-student-grid eie-admin-recent-list">
                    ${rowHtml || '<div class="eie-admin-empty-row">표시할 원생 정보가 없습니다.</div>'}
                </div>
            </div>
        `;
    }

    function renderNeedCheck(data) {
        const needsReview = data.needsReview || [];
        const errors = data.errors || [];
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">확인 필요</h3>
                </div>
                <div class="ap-admin-check-grid eie-admin-check-grid">
                    ${renderPlaceholderCard('검토 필요', `${needsReview.length.toLocaleString('ko-KR')}건`, 'students')}
                    ${renderPlaceholderCard('데이터 확인', errors.length ? '일부 데이터 확인 필요' : '준비중')}
                    ${renderPlaceholderCard('원장 확인', '준비중')}
                </div>
            </div>
        `;
    }

    function renderWeeklySchedulePlaceholder() {
        return `
            <div class="ap-admin-section eie-admin-section">
                <h3 class="ap-admin-section-title eie-admin-section-title" style="margin:0 0 12px 0; font-size:14px; font-weight:500; color:var(--secondary);">주간일정</h3>
                <div class="card eie-admin-empty-card">주간일정 연동 준비중</div>
            </div>
        `;
    }

    function renderBottomSearchPlaceholder() {
        return `
            <div class="ap-admin-bottom-search eie-admin-bottom-search" aria-label="원장님 하단 검색">
                <div class="card eie-admin-empty-card">통합 검색 준비중</div>
            </div>
        `;
    }

    function renderNotice(data) {
        const errors = [...new Set((data.errors || []).filter(Boolean).map(error => String(error).trim()).filter(Boolean))];
        if (!errors.length) return '';
        return `
            <div class="eie-dashboard-notice" role="status">
                운영 데이터를 일부 불러오지 못했습니다. ${esc(errors[0])}
            </div>
        `;
    }

    async function render() {
        const data = await loadDashboardData();

        return `
            <div class="owner-dashboard-shell">
                <section class="eie-admin-home" aria-label="EIE 원장님 대시보드">
                    ${renderGate()}
                    ${renderActionGrid()}
                    ${renderOverview(data)}
                    ${renderTeacherStatusPlaceholder()}
                    ${renderRecentConsultationPlaceholder()}
                    ${renderRecentStudents(data)}
                    ${renderNeedCheck(data)}
                    ${renderWeeklySchedulePlaceholder()}
                    ${renderBottomSearchPlaceholder()}
                    ${renderNotice(data)}
                </section>
            </div>
        `;
    }

    window.EieDashboardView = { render };
})();
