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
        return rowsFromPayload(payload, ['confirmed_students', 'students', 'student_seeds', 'rows'])
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

    const DASHBOARD_TEACHER_ROSTER = ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily', 'Foreigner'];

    function teacherKey(value) {
        return window.EieClassroomScope?.teacherKey
            ? EieClassroomScope.teacherKey(value)
            : String(value || '').trim().replace(/\s+/g, '').toLowerCase();
    }

    function canonicalDashboardTeacherName(value) {
        const key = teacherKey(value);
        return DASHBOARD_TEACHER_ROSTER.find(name => teacherKey(name) === key) || '';
    }

    function uniqueNames(values) {
        const seen = {};
        return (Array.isArray(values) ? values : []).map(value => String(value || '').trim()).filter(name => {
            const key = teacherKey(name);
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

    function todayIso() {
        const d = new Date();
        return d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0');
    }

    function recentStudentCount(rows) {
        const today = todayIso();
        return rows.filter(row => {
            const raw = String(row?.created_at || '').trim();
            return raw.slice(0, 10) === today;
        }).length;
    }

    function buildGradeHoverGrid(rows) {
        const group1 = ['초1', '초2', '초3', '초4', '초5', '초6'];
        const group2 = ['중1', '중2', '중3', '고1', '고2', '고3'];
        const counts = {};
        (rows || []).forEach(row => {
            const grade = String(row?.grade || row?.grade_raw || '').trim();
            if (grade) counts[grade] = (counts[grade] || 0) + 1;
        });
        const chip = (grade) => {
            const n = counts[grade] || 0;
            return `<span class="eie-admin-mini-metric__grade-chip${n === 0 ? ' is-zero' : ''}">${esc(grade)}<em>${n}</em></span>`;
        };
        return `<div class="eie-admin-mini-metric__grade-grid">
            <div class="eie-admin-mini-metric__grade-row">${group1.map(chip).join('')}</div>
            <div class="eie-admin-mini-metric__grade-row">${group2.map(chip).join('')}</div>
        </div>`;
    }

    async function loadDashboardData() {
        const currentState = window.EieState?.get?.() || {};
        const data = {
            timetableCells: Array.isArray(currentState.timetableCells) ? currentState.timetableCells : [],
            students: Array.isArray(currentState.db?.students) && currentState.db.students.length
                ? currentState.db.students
                : Array.isArray(currentState.studentSeeds) ? currentState.studentSeeds : [],
            needsReview: Array.isArray(currentState.needsReview) ? currentState.needsReview : [],
            teachers: [],
            attendanceRows: [],
            errors: []
        };

        if (!window.EieApi) return data;

        const [timetableResult, studentsResult, needsReviewResult, teachersResult, attendanceResult] = await Promise.allSettled([
            window.EieApi.getTimetable(null, { status: 'active,needs_review,hidden' }),
            window.EieApi.getStudents ? window.EieApi.getStudents() : window.EieApi.getStudentSeeds(),
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
            if (window.EieState?.setStudents) window.EieState.setStudents(data.students);
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
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="attendance" aria-label="EIE 출석부" title="출석부">출석부</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="timetable" aria-label="EIE 시간표" title="시간표">시간표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" disabled aria-label="EIE 성적표 준비중" title="준비중">성적표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="management" aria-label="EIE 관리" title="관리">관리</button>
            </div>
        `;
    }

    function renderMiniMetric(label, value, route, hoverContent) {
        const routeAttr = route ? ` data-eie-route="${esc(route)}"` : '';
        const countText = Number(value || 0).toLocaleString('ko-KR');
        let innerHtml = '';
        if (typeof hoverContent === 'string' && hoverContent) {
            innerHtml = hoverContent;
        } else if (Array.isArray(hoverContent) && hoverContent.length) {
            innerHtml = hoverContent.map(row => `
                <div class="eie-admin-mini-metric__hover-row">
                    <span>${esc(row.label)}</span>
                    <strong>${Number(row.value || 0).toLocaleString('ko-KR')}명</strong>
                </div>
            `).join('');
        }
        const hoverAttrs = innerHtml
            ? ` onclick="event.stopPropagation(); this.querySelector('.eie-admin-mini-metric__hover')?.classList.toggle('is-visible')" onmouseenter="this.querySelector('.eie-admin-mini-metric__hover')?.classList.add('is-visible')" onmouseleave="this.querySelector('.eie-admin-mini-metric__hover')?.classList.remove('is-visible')" onfocus="this.querySelector('.eie-admin-mini-metric__hover')?.classList.add('is-visible')" onblur="this.querySelector('.eie-admin-mini-metric__hover')?.classList.remove('is-visible')"`
            : '';
        const hoverPanel = innerHtml
            ? `<div class="eie-admin-mini-metric__hover" aria-hidden="true">
                    <div class="eie-admin-mini-metric__hover-title">${esc(label)} ${countText}명</div>
                    ${innerHtml}
                </div>`
            : '';
        return `
            <button class="ap-admin-mini-metric eie-admin-mini-metric eie-surface-inner-card" type="button"${routeAttr} aria-label="${esc(label)} ${countText}명" title="${esc(label)} ${countText}명"${hoverAttrs}>
                <span>${esc(label)}</span>
                ${hoverPanel}
            </button>
        `;
    }

    function renderOverview(data) {
        const students = data.students || [];
        const today = todayIso();
        const recentStudents = students.filter(row => {
            const raw = String(row?.created_at || '').trim();
            return raw.slice(0, 10) === today;
        });
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">오늘 운영</h3>
                </div>
                <div class="ap-admin-overview-grid eie-admin-overview-grid eie-surface-toolbar eie-surface-toolbar--two" aria-label="오늘 운영">
                    ${renderMiniMetric('재원', students.length, 'students', buildGradeHoverGrid(students))}
                    ${renderMiniMetric('최근 등록', recentStudentCount(students), '', null)}
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
        const allowedKeys = new Set(uniqueNames(values).map(canonicalDashboardTeacherName).filter(Boolean).map(teacherKey));
        return DASHBOARD_TEACHER_ROSTER.filter(name => allowedKeys.has(teacherKey(name)));
    }

    function teacherCellsForDashboard(name, cells) {
        if (window.EieClassroomScope?.cellsForTeacher) {
            return EieClassroomScope.cellsForTeacher({
                teacherName: name,
                role: 'teacher',
                cells: cells || []
            });
        }
        return [];
    }

    function periodNumberOf(cell) {
        const raw = Number(cell?.period_order);
        if (Number.isFinite(raw) && raw > 0) return raw;
        const label = String(cell?.period_label || '').match(/\d+/);
        return label ? Number(label[0]) : 0;
    }

    function rawOfDashboard(row) {
        if (window.EieClassroomScope?.rawOf) return EieClassroomScope.rawOf(row);
        if (row?.raw && typeof row.raw === 'object') return row.raw;
        if (!row?.raw_meta_json) return {};
        try {
            const parsed = JSON.parse(row.raw_meta_json);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function normalizeDashboardText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function classNameOfCell(cell) {
        const raw = rawOfDashboard(cell);
        return normalizeDashboardText(
            cell?.class_name_raw ||
            cell?.raw_class_name ||
            cell?.class_name ||
            cell?.classTitle ||
            cell?.title ||
            cell?.name ||
            cell?.display_name ||
            cell?.class_label ||
            cell?.material_text ||
            cell?.material ||
            raw?.class_name_raw ||
            raw?.raw_class_name ||
            raw?.class_name ||
            raw?.classTitle ||
            raw?.title ||
            raw?.name ||
            raw?.display_name ||
            raw?.class_label ||
            raw?.material_text ||
            raw?.material ||
            ''
        );
    }

    function studentCountOfCell(cell) {
        const assigned = assignedStudentsOf(cell);
        if (assigned.length) return assigned.length;
        const raw = rawOfDashboard(cell);
        const count = Number(
            cell?.student_count ||
            cell?.studentCount ||
            cell?.enrolled_count ||
            cell?.enrolledCount ||
            raw?.student_count ||
            raw?.studentCount ||
            raw?.enrolled_count ||
            raw?.enrolledCount ||
            0
        );
        return Number.isFinite(count) && count > 0 ? count : null;
    }

    function dayTeacherSourcesOf(cell) {
        const raw = rawOfDashboard(cell);
        return [
            cell?.day_teachers,
            cell?.teacher_names_by_day,
            cell?.weekday_teachers,
            raw?.day_teachers,
            raw?.teacher_names_by_day,
            raw?.weekday_teachers
        ].filter(source => source && typeof source === 'object');
    }

    function daySpecificTeacherNames(cell, today) {
        const names = [];
        const aliases = window.EieClassroomScope?.dayAliases ? EieClassroomScope.dayAliases(today) : [today];
        dayTeacherSourcesOf(cell).forEach(source => {
            aliases.forEach(alias => {
                if (Object.prototype.hasOwnProperty.call(source, alias)) {
                    names.push(...(window.EieClassroomScope?.asTeacherList ? EieClassroomScope.asTeacherList(source[alias]) : [source[alias]]));
                }
            });
        });
        return uniqueNames(names);
    }

    function cellAppliesToDashboardDate(cell, today) {
        if (window.EieClassroomScope?.isCellOnDate && EieClassroomScope.isCellOnDate(cell, today)) return true;
        return daySpecificTeacherNames(cell, today).length > 0;
    }

    function cellBelongsToTeacherOnDate(cell, name, today) {
        const dayTeachers = daySpecificTeacherNames(cell, today);
        if (dayTeachers.length) return dayTeachers.some(teacher => teacherKey(teacher) === teacherKey(name));
        return teacherCellsForDashboard(name, [cell]).length > 0;
    }

    function dashboardPeriodsForToday(cells, today) {
        const todayCells = (Array.isArray(cells) ? cells : []).filter(cell =>
            cellAppliesToDashboardDate(cell, today)
        );
        const sourceCells = todayCells.length ? todayCells : (Array.isArray(cells) ? cells : []);
        const maxPeriod = Math.min(8, Math.max(4, sourceCells.reduce((max, cell) => Math.max(max, periodNumberOf(cell)), 0)));
        return Array.from({ length: maxPeriod }, (_, index) => index + 1);
    }

    function periodRowsForTeacher(name, cells, today, periods) {
        const todayCells = (Array.isArray(cells) ? cells : []).filter(cell =>
            cellAppliesToDashboardDate(cell, today) && cellBelongsToTeacherOnDate(cell, name, today)
        );
        return (periods || []).map(periodNo => {
            const periodCells = todayCells.filter(cell => periodNumberOf(cell) === periodNo);
            const classNames = uniqueNames(periodCells.map(classNameOfCell).filter(Boolean));
            const counts = periodCells.map(studentCountOfCell);
            const canShowCount = counts.length > 0 && counts.every(count => Number.isFinite(count) && count > 0);
            return {
                periodNo,
                className: classNames.length ? classNames.join(' / ') : '',
                studentCount: canShowCount ? counts.reduce((sum, count) => sum + count, 0) : null
            };
        });
    }

    function renderTeacherPeriodRows(rows) {
        return `
            <div class="eie-admin-teacher-periods">
                ${(rows || []).map(row => `
                    <div class="eie-admin-teacher-period-row">
                        <span class="eie-admin-teacher-period-no">${esc(row.periodNo)}</span>
                        <span class="eie-admin-teacher-period-class${row.className ? '' : ' is-empty'}">${esc(row.className || '')}</span>
                        <span class="eie-admin-teacher-period-count${row.studentCount ? '' : ' is-empty'}">${row.studentCount ? `재원${esc(row.studentCount)}` : ''}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderTeacherStatus(data) {
        const today = todayIso();
        const teacherNames = teacherNamesForDashboard(data);
        const periods = dashboardPeriodsForToday(data.timetableCells, today);
        const cards = teacherNames.map(name => {
            const periodRows = periodRowsForTeacher(name, data.timetableCells, today, periods);
            return `
                <article class="card ap-admin-teacher-card eie-admin-teacher-card eie-admin-teacher-card--readonly" aria-label="${esc(name)} 선생님 오늘 수업">
                    <div class="admin-teacher-card__head">
                        <div class="admin-teacher-card__name">${esc(name)} 선생님</div>
                    </div>
                    ${renderTeacherPeriodRows(periodRows)}
                </article>
            `;
        }).join('');

        const DAY_LABELS = ['월', '화', '수', '목', '금'];
        const todayDow = new Date().getDay();
        const dayChips = DAY_LABELS.map((label, index) => {
            const isActive = (index + 1) === todayDow;
            return `<span class="eie-admin-day-chip${isActive ? ' is-active' : ''}">${esc(label)}</span>`;
        }).join('');

        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-teacher-status-head" style="margin-bottom:12px;">
                    <h3 class="ap-admin-section-title eie-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">선생님 현황</h3>
                    <div class="eie-admin-day-chips" aria-label="요일">${dayChips}</div>
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
                    ${renderWeeklySchedulePlaceholder()}
                    ${renderBottomSearchPlaceholder()}
                    ${renderNotice(data)}
                </section>
            </div>
        `;
    }

    window.EieDashboardView = { render };
})();
