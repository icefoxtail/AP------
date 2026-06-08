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

    function normalizeTeacherRows(payload) {
        return rowsFromPayload(payload, ['teachers', 'rows', 'data'])
            .map(row => ({
                ...row,
                name: row?.name || row?.display_name || row?.teacher_name || '',
                role: row?.role || ''
            }))
            .filter(row => row.name && String(row.role || '').trim() !== 'disabled');
    }

    function uniqueNames(values) {
        const seen = {};
        return (Array.isArray(values) ? values : []).map(value => String(value || '').trim()).filter(name => {
            const key = window.EieClassroomScope?.teacherKey ? EieClassroomScope.teacherKey(name) : name.toLowerCase();
            if (!key || seen[key]) return false;
            seen[key] = true;
            return true;
        }).sort((a, b) => a.localeCompare(b, 'ko'));
    }

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
    }

    function studentIdOf(student) {
        return String(student?.student_id || student?.id || '').trim();
    }

    function assignedStudentsOf(cell) {
        return Array.isArray(cell?.assigned_students) ? cell.assigned_students : [];
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

    function buildGradeHoverRows(rows) {
        const order = ['초1', '초2', '초3', '초4', '초5', '초6', '중1', '중2', '중3', '고1', '고2', '고3'];
        const counts = {};
        (rows || []).forEach(row => {
            const grade = String(row?.grade || row?.grade_raw || '미지정').trim() || '미지정';
            counts[grade] = (counts[grade] || 0) + 1;
        });
        return Object.keys(counts)
            .sort((a, b) => {
                const ai = order.indexOf(a);
                const bi = order.indexOf(b);
                if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
                return a.localeCompare(b, 'ko');
            })
            .map(label => ({ label, value: counts[label] }));
    }

    async function loadDashboardData() {
        const currentState = window.EieState?.get?.() || {};
        const data = {
            timetableCells: Array.isArray(currentState.timetableCells) ? currentState.timetableCells : [],
            students: Array.isArray(currentState.studentSeeds) ? currentState.studentSeeds : [],
            needsReview: Array.isArray(currentState.needsReview) ? currentState.needsReview : [],
            teachers: [],
            attendanceRows: [],
            errors: []
        };

        if (!window.EieApi) return data;

        const [timetableResult, studentsResult, needsReviewResult, teachersResult, attendanceResult] = await Promise.allSettled([
            window.EieApi.getTimetable(null, { status: 'active,needs_review,hidden' }),
            window.EieApi.getStudentSeeds(),
            window.EieApi.getNeedsReview(),
            window.EieApi.getTeachers ? window.EieApi.getTeachers() : Promise.resolve({ teachers: [] }),
            window.EieApi.getAttendanceRecords ? window.EieApi.getAttendanceRecords({ date: todayIso() }) : Promise.resolve({ attendance_records: [] })
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

        if (teachersResult.status === 'fulfilled') {
            data.teachers = normalizeTeacherRows(teachersResult.value);
        }

        if (attendanceResult.status === 'fulfilled') {
            data.attendanceRows = rowsFromPayload(attendanceResult.value, ['attendance_records', 'attendance', 'rows']);
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
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="timetable" aria-label="EIE 시간표" title="시간표">시간표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" disabled aria-label="EIE 성적표 준비중" title="준비중">성적표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="management" aria-label="EIE 관리" title="관리">관리</button>
            </div>
        `;
    }

    function renderMiniMetric(label, value, route, hoverRows) {
        const routeAttr = route ? ` data-eie-route="${esc(route)}"` : '';
        const countText = Number(value || 0).toLocaleString('ko-KR');
        const rows = Array.isArray(hoverRows) ? hoverRows : [];
        const detailRows = rows.length
            ? rows.map(row => `
                <div class="eie-admin-mini-metric__hover-row">
                    <span>${esc(row.label)}</span>
                    <strong>${Number(row.value || 0).toLocaleString('ko-KR')}명</strong>
                </div>
            `).join('')
            : '';
        // APMATH PORT LOCK: today metrics must show label text only by default.
        // Counts/details belong only in the hover panel and are revealed by hover, focus, or click.
        return `
            <button class="ap-admin-mini-metric eie-admin-mini-metric eie-surface-inner-card" type="button"${routeAttr} aria-label="${esc(label)} ${countText}명" title="${esc(label)} ${countText}명" onclick="event.stopPropagation(); this.querySelector('.eie-admin-mini-metric__hover')?.classList.toggle('is-visible')" onmouseenter="this.querySelector('.eie-admin-mini-metric__hover')?.classList.add('is-visible')" onmouseleave="this.querySelector('.eie-admin-mini-metric__hover')?.classList.remove('is-visible')" onfocus="this.querySelector('.eie-admin-mini-metric__hover')?.classList.add('is-visible')" onblur="this.querySelector('.eie-admin-mini-metric__hover')?.classList.remove('is-visible')">
                <span>${esc(label)}</span>
                <div class="eie-admin-mini-metric__hover" aria-hidden="true">
                    <div class="eie-admin-mini-metric__hover-title">${esc(label)} ${countText}명</div>
                    ${detailRows}
                </div>
            </button>
        `;
    }

    function renderOverview(data) {
        const students = data.students || [];
        const recentStudents = students.filter(row => {
            const raw = String(row?.created_at || '').trim();
            if (!raw) return false;
            const time = Date.parse(raw);
            return Number.isFinite(time) && time >= Date.now() - 14 * 24 * 60 * 60 * 1000;
        });
        const waitingStudents = students.filter(row => String(row?.status || '').includes('대기'));
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">오늘 운영</h3>
                </div>
                <div class="ap-admin-overview-grid eie-admin-overview-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="오늘 운영">
                    ${renderMiniMetric('재원', students.length, 'students', buildGradeHoverRows(students))}
                    ${renderMiniMetric('최근 등록', recentStudentCount(students), '', buildGradeHoverRows(recentStudents))}
                    ${renderMiniMetric('대기', countByStatus(students, '대기'), '', buildGradeHoverRows(waitingStudents))}
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

    function attendanceRecordKey(row) {
        return String(row?.student_id || row?.studentId || row?.eie_student_id || '').trim()
            + '|'
            + String(row?.date || row?.attendance_date || '').slice(0, 10);
    }

    function teacherNamesForDashboard(data) {
        const values = (data.teachers || []).map(row => row.name);
        (data.timetableCells || []).forEach(cell => {
            if (window.EieClassroomScope?.accessTeacherNamesForCell) {
                values.push(...EieClassroomScope.accessTeacherNamesForCell(cell));
            }
        });
        return uniqueNames(values);
    }

    function teacherCellsForDashboard(name, cells) {
        if (window.EieClassroomScope?.cellsForTeacher) {
            return EieClassroomScope.cellsForTeacher({
                teacherName: name,
                role: 'owner',
                cells: cells || []
            });
        }
        return [];
    }

    function renderTeacherMetric(label, value) {
        return `<span class="admin-teacher-grade-pill"><span>${esc(label)}</span><span>${Number(value || 0).toLocaleString('ko-KR')}</span></span>`;
    }

    function renderTeacherStatus(data) {
        const today = todayIso();
        const teacherNames = teacherNamesForDashboard(data);
        const attendanceKeys = new Set((data.attendanceRows || []).map(attendanceRecordKey));
        const cards = teacherNames.map(name => {
            const teacherCells = teacherCellsForDashboard(name, data.timetableCells);
            const todayCells = window.EieClassroomScope?.isCellOnDate
                ? teacherCells.filter(cell => EieClassroomScope.isCellOnDate(cell, today))
                : [];
            const todayStudents = [];
            todayCells.forEach(cell => {
                assignedStudentsOf(cell).forEach(student => {
                    const sid = studentIdOf(student);
                    if (sid) todayStudents.push(sid);
                });
            });
            const completed = todayStudents.filter(sid => attendanceKeys.has(sid + '|' + today)).length;
            const unchecked = Math.max(0, todayStudents.length - completed);
            const nameArg = esc(JSON.stringify(name));
            return `
                <button class="card ap-admin-teacher-card eie-admin-teacher-card" type="button" onclick='event.stopPropagation(); EieClassroomView.openTeacher(${nameArg})' aria-label="${esc(name)} 선생님 클래스룸" title="${esc(name)} 선생님 클래스룸">
                    <div class="admin-teacher-card__head">
                        <div class="admin-teacher-card__name">${esc(name)} 선생님</div>
                        <div class="admin-teacher-card__quick-actions">
                            <span class="btn admin-teacher-card__quick-action">클래스룸</span>
                        </div>
                    </div>
                    <div class="admin-teacher-grade-pills">
                        ${renderTeacherMetric('오늘 수업', todayCells.length)}
                        ${renderTeacherMetric('담당/보조', teacherCells.length)}
                        ${renderTeacherMetric('출석 완료', completed)}
                        ${renderTeacherMetric('미확인', unchecked)}
                    </div>
                </button>
            `;
        }).join('');

        return `
            <div class="ap-admin-section eie-admin-section">
                <div style="margin-bottom:12px;">
                    <h3 class="ap-admin-section-title eie-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">선생님 현황</h3>
                </div>
                <div class="ap-admin-teacher-grid eie-admin-teacher-grid">
                    ${cards || '<div class="card eie-admin-empty-card">등록된 선생님이 없습니다.</div>'}
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
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 등록 학생</h3>
                    <span>표시 ${rows.length}명</span>
                </div>
                <div class="ap-admin-recent-student-grid eie-admin-recent-list">
                    ${rowHtml || '<div class="eie-admin-empty-row">표시할 학생 정보가 없습니다.</div>'}
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
                <section class="eie-admin-home" aria-label="EIE 원장 대시보드">
                    ${renderGate()}
                    ${renderActionGrid()}
                    ${renderOverview(data)}
                    ${renderTeacherStatus(data)}
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
