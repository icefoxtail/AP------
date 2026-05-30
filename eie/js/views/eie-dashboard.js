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

    function assignedStudentCount(cells) {
        return cells.reduce((sum, cell) => {
            const assigned = Array.isArray(cell?.assigned_students) ? cell.assigned_students : [];
            return sum + assigned.length;
        }, 0);
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
            window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' }),
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
                <a class="owner-brand-tab eie-admin-shortcut eie-surface-action" href="../apmath/index.html" aria-label="AP MATH 원장 대시보드로 이동">AP MATH</a>
                <button class="owner-brand-tab owner-brand-tab--current eie-admin-shortcut eie-surface-action eie-surface-action--current is-active" type="button" data-eie-route="dashboard" aria-current="page" aria-label="EIE 대시보드">EIE</button>
            </div>
        `;
    }

    function renderActionGrid() {
        return `
            <div class="eie-admin-shortcuts eie-admin-action-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="EIE 바로가기">
                <button class="eie-admin-shortcut eie-surface-action" type="button" data-eie-route="classroom" aria-label="EIE 출석부" title="출석부">출석부</button>
                <button class="eie-admin-shortcut eie-surface-action" type="button" data-eie-route="timetable" aria-label="EIE 시간표" title="시간표">시간표</button>
                <button class="eie-admin-shortcut eie-surface-action" type="button" data-eie-route="students" aria-label="EIE 학생관리" title="학생관리">학생관리</button>
                <button class="eie-admin-shortcut eie-surface-action" type="button" data-eie-route="management" aria-label="EIE 관리" title="관리">관리</button>
            </div>
        `;
    }

    function renderMiniMetric(label, value, route) {
        return `
            <button class="eie-admin-mini-metric eie-surface-inner-card" type="button" data-eie-route="${esc(route || 'students')}" aria-label="${esc(label)} 보기" title="${esc(label)}">
                <span>${esc(label)}</span>
                <strong>${Number(value || 0).toLocaleString('ko-KR')}</strong>
            </button>
        `;
    }

    function renderOverview(data) {
        const students = data.students || [];
        return `
            <div class="eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="eie-admin-section-title">오늘 운영</h3>
                </div>
                <div class="eie-admin-overview-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="오늘 운영">
                    ${renderMiniMetric('재원', students.length, 'students')}
                    ${renderMiniMetric('최근 등록', recentStudentCount(students), 'students')}
                    ${renderMiniMetric('퇴원', countByStatus(students, '퇴원'), 'students')}
                    ${renderMiniMetric('휴원', countByStatus(students, '휴원'), 'students')}
                </div>
            </div>
        `;
    }

    function renderStatusCard(kicker, title, copy, route) {
        return `
            <button class="eie-admin-status-card eie-surface-big-card" type="button" data-eie-route="${esc(route)}" aria-label="${esc(title)} 보기" title="${esc(title)}">
                <span class="eie-admin-card-kicker">${esc(kicker)}</span>
                <strong>${esc(title)}</strong>
                <small>${esc(copy)}</small>
            </button>
        `;
    }

    function renderStatusGrid(data) {
        const cellCount = (data.timetableCells || []).length;
        const studentCount = (data.students || []).length;
        const assignedCount = assignedStudentCount(data.timetableCells || []);
        return `
            <div class="eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="eie-admin-section-title">EIE 현황</h3>
                </div>
                <div class="eie-admin-status-grid">
                    ${renderStatusCard(`${cellCount.toLocaleString('ko-KR')}개 수업`, '시간표', '수업 셀과 배정 상태를 확인합니다.', 'timetable')}
                    ${renderStatusCard('확인용', '새 시간표', '요일·선생님별 보기로 확인합니다.', 'timetable-v2')}
                    ${renderStatusCard(`${studentCount.toLocaleString('ko-KR')}명`, '학생관리', '학생 후보와 연락처는 상세에서 확인합니다.', 'students')}
                    ${renderStatusCard(`${assignedCount.toLocaleString('ko-KR')}개 배정`, '클래스룸', '수업 운영 화면으로 이동합니다.', 'classroom')}
                </div>
            </div>
        `;
    }

    function renderRecentStudents(data) {
        const rows = (data.students || []).slice(0, 6);
        const rowHtml = rows.map(student => `
            <button class="eie-admin-recent-row" type="button" data-eie-route="students" aria-label="${esc(student.name || '학생')} 확인" title="${esc(student.name || '학생')}">
                <span>
                    <strong>${esc(student.name || '이름 없음')}</strong>
                    <small>${esc([student.grade, student.status].filter(Boolean).join(' · ') || 'EIE 학생')}</small>
                </span>
                <em>상세</em>
            </button>
        `).join('');

        return `
            <div class="eie-admin-section">
                <div class="eie-admin-section-title-row eie-admin-section-title-row--split">
                    <h3 class="eie-admin-section-title">최근 등록 원생</h3>
                    <span>표시 ${rows.length}명</span>
                </div>
                <div class="eie-admin-recent-list">
                    ${rowHtml || '<div class="eie-admin-empty-row">표시할 학생 정보가 없습니다.</div>'}
                </div>
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
                    ${renderStatusGrid(data)}
                    ${renderRecentStudents(data)}
                    ${renderNotice(data)}
                </section>
            </div>
        `;
    }

    window.EieDashboardView = { render };
})();
