(function () {
    function esc(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function jsArg(value) {
        return esc(JSON.stringify(value));
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

    function rawOf(row) {
        if (!row || typeof row !== 'object') return {};
        if (row.raw && typeof row.raw === 'object') return row.raw;
        const raw = row.raw_meta_json || row.raw_json || row.meta_json;
        if (typeof raw === 'string' && raw.trim()) {
            try { return JSON.parse(raw); } catch (_) { return {}; }
        }
        return {};
    }

    function dashboardEnrollDateOf(row) {
        const raw = rawOf(row);
        return String(row?.enrollment_date || row?.first_attendance_date || row?.first_attended_at
            || raw.enrollment_date || raw.first_attendance_date || raw.first_attended_at || '').slice(0, 10);
    }

    function dateFromIso(value) {
        const raw = String(value || '').slice(0, 10);
        const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!match) return null;
        return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    }

    function isNewStudent(row) {
        const enrollDate = dateFromIso(dashboardEnrollDateOf(row));
        const today = dateFromIso(todayIso());
        if (!enrollDate || !today) return false;
        const from = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
        return enrollDate >= from && enrollDate <= today;
    }

    function recentStudentCount(rows) {
        return rows.filter(isNewStudent).length;
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
            consultations: Array.isArray(currentState.db?.consultations) ? currentState.db.consultations : [],
            errors: []
        };

        if (!window.EieApi) return data;

        const [timetableResult, studentsResult, needsReviewResult, teachersResult, attendanceResult, consultationsResult] = await Promise.allSettled([
            window.EieApi.getTimetable(null, { status: 'active,needs_review,hidden' }),
            window.EieApi.getStudents ? window.EieApi.getStudents() : window.EieApi.getStudentSeeds(),
            window.EieApi.getNeedsReview(),
            window.EieApi.getTeachers ? window.EieApi.getTeachers() : Promise.resolve({ teachers: [] }),
            window.EieApi.getAttendanceRecords ? window.EieApi.getAttendanceRecords({ date: todayIso() }) : Promise.resolve({ attendance_records: [] }),
            window.EieApi.getConsultations ? window.EieApi.getConsultations() : Promise.resolve({ consultations: data.consultations })
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

        if (consultationsResult.status === 'fulfilled') {
            data.consultations = rowsFromPayload(consultationsResult.value, ['consultations', 'rows']);
            if (window.EieState?.setConsultations) window.EieState.setConsultations(data.consultations);
        }

        return data;
    }

    function renderGate() {
        return `
            <div class="eie-owner-sysgate" role="navigation" aria-label="시스템 전환">
                <button class="eie-owner-sysgate__tab" type="button" aria-label="AP MATH 원장 대시보드로 이동" onclick="location.replace('../apmath/index.html')">AP MATH</button>
                <button class="eie-owner-sysgate__tab is-current" type="button" data-eie-route="dashboard" aria-current="page" aria-label="EIE 대시보드">EIE</button>
            </div>
        `;
    }

    function renderTopbar() {
        const now = new Date();
        const weekday = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()] || '';
        const dateLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${weekday}요일`;
        return `
            <div class="eie-owner-topbar">
                <div class="eie-owner-topbar__date">${esc(dateLabel)}</div>
                <div class="eie-owner-topbar__tools">
                    ${renderGate()}
                    <label class="eie-owner-search" aria-label="학생 · 반 통합 검색" title="통합 검색 (준비중)">
                        <svg class="eie-owner-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 21L16.65 16.65M10.8 18.1C6.77 18.1 3.5 14.83 3.5 10.8C3.5 6.77 6.77 3.5 10.8 3.5C14.83 3.5 18.1 6.77 18.1 10.8C18.1 14.83 14.83 18.1 10.8 18.1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        <input type="search" placeholder="학생 · 반 통합 검색" autocomplete="off" aria-label="학생 · 반 통합 검색">
                    </label>
                </div>
            </div>
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

    function openDashboardTeacher(teacherName) {
        if (window.EieTeacherView && typeof EieTeacherView.openTeacher === 'function') {
            EieTeacherView.openTeacher(teacherName);
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('teacher');
    }

    function openDashboardTeacherClassroom(teacherName) {
        if (window.EieClassroomView && typeof EieClassroomView.openTeacher === 'function') {
            EieClassroomView.openTeacher(teacherName);
            return;
        }
        openDashboardTeacher(teacherName);
    }

    function openDashboardTeacherStudents(teacherName) {
        if (window.EieStudentsView && typeof EieStudentsView.setTeacherFilter === 'function') {
            EieStudentsView.setTeacherFilter(teacherName);
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
    }

    function renderTeacherStatus(data) {
        const today = todayIso();
        const teacherNames = teacherNamesForDashboard(data);
        const periods = dashboardPeriodsForToday(data.timetableCells, today);
        const cards = teacherNames.map(name => {
            const periodRows = periodRowsForTeacher(name, data.timetableCells, today, periods);
            return `
                <article class="card ap-admin-teacher-card eie-admin-teacher-card eie-admin-teacher-card--readonly" aria-label="${esc(name)} 선생님 현황판">
                    <div class="admin-teacher-card__head">
                        <div class="admin-teacher-card__name">${esc(name)} 선생님</div>
                        <div class="admin-teacher-card__quick-actions">
                            <button class="btn admin-teacher-card__quick-action" type="button" onclick="event.stopPropagation(); openDashboardTeacherClassroom(${jsArg(name)})">담당반</button>
                            <button class="btn admin-teacher-card__quick-action" type="button" onclick="event.stopPropagation(); openDashboardTeacherStudents(${jsArg(name)})">재원</button>
                        </div>
                    </div>
                    <div class="admin-teacher-card__journal eie-admin-teacher-board">
                        <div class="admin-teacher-card__journal-title">
                            <span>선생님별 현황판</span>
                        </div>
                        ${renderTeacherPeriodRows(periodRows)}
                    </div>
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
                    <span class="eie-owner-panel-sub">EIE · ${teacherNames.length}명</span>
                    <div class="eie-admin-day-chips" aria-label="요일">${dayChips}</div>
                    <span class="eie-owner-panel-meta">${['일', '월', '화', '수', '목', '금', '토'][new Date().getDay()]} ${new Date().getMonth() + 1}/${new Date().getDate()} 기준</span>
                </div>
                <div class="ap-admin-teacher-grid eie-admin-teacher-grid">
                    ${cards || '<div class="card eie-admin-empty-card">등록된 선생님이 없습니다.</div>'}
                </div>
            </div>
        `;
    }

    function renderLegacyRecentConsultationPlaceholder() {
        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row">
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 상담</h3>
                </div>
                <div class="card eie-admin-empty-card">상담 기록 연동 준비중</div>
            </div>
        `;
    }

    function consultationDate(row) {
        return String(row?.date || row?.consultation_date || row?.created_at || '').slice(0, 10);
    }

    function consultationSortValue(row) {
        return String(row?.date || row?.consultation_date || row?.created_at || '').replace(/[^0-9]/g, '');
    }

    function consultationStudent(data, row) {
        const sid = String(row?.student_id || '').trim();
        return (data.students || []).find(student => studentIdOf(student) === sid) || null;
    }

    function consultationPreview(row) {
        return String(row?.content || '').replace(/\s+/g, ' ').trim() || '상담 내용 없음';
    }

    function openDashboardConsultationStudent(studentId) {
        if (window.EieStudentsView && typeof EieStudentsView.openDetail === 'function') {
            return EieStudentsView.openDetail(studentId, { route: 'dashboard' }, 'consultation');
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') return EieRouter.open('students');
    }

    function renderRecentConsultationPanel(data) {
        const rows = (data.consultations || [])
            .slice()
            .sort((a, b) => String(consultationSortValue(b)).localeCompare(String(consultationSortValue(a))))
            .slice(0, 8);
        const rowHtml = rows.map(row => {
            const sid = String(row?.student_id || '').trim();
            const student = consultationStudent(data, row);
            const name = student?.name || row?.student_name_snapshot || '학생 확인';
            const meta = [consultationDate(row), row?.type || '상담'].filter(Boolean).join(' · ');
            const nextAction = String(row?.next_action || row?.nextAction || '').trim();
            return `
                <button class="btn ap-admin-consultation-row eie-admin-consultation-row" type="button" onclick="openDashboardConsultationStudent(${jsArg(sid)})" aria-label="${esc(name)} 상담 확인" title="${esc(name)} 상담">
                    <span>
                        <strong>${esc(name)}</strong>
                        <small>${esc(consultationPreview(row))}</small>
                    </span>
                    <em>
                        <span>${esc(meta)}</span>
                        ${nextAction ? `<small>${esc(nextAction)}</small>` : ''}
                    </em>
                </button>
            `;
        }).join('');

        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row eie-admin-section-title-row--split">
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 상담</h3>
                    <button class="btn eie-admin-consultation-all" type="button" data-eie-route="students">상담 전체 보기</button>
                </div>
                <div class="card eie-admin-consultation-list">
                    ${rowHtml || '<div class="eie-admin-empty-card">최근 상담 기록이 없습니다.</div>'}
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
        return '';
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

    function renderActionGrid() {
        return `
            <div class="ap-admin-shortcuts ap-admin-action-grid eie-admin-shortcuts eie-admin-action-grid eie-surface-toolbar eie-surface-toolbar--four" aria-label="원장님 바로가기">
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="attendance" aria-label="EIE 출석부" title="출석부"><span class="eie-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="4" width="13" height="17" rx="2.2"/><path d="M9 4V3.2A1.2 1.2 0 0 1 10.2 2h3.6A1.2 1.2 0 0 1 15 3.2V4"/><path d="M8.6 12.4l2.1 2.1 4.1-4.2"/></svg></span>출석부</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="timetable" aria-label="EIE 시간표" title="시간표"><span class="eie-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 9.5h17"/><path d="M8 3.2v3.4M16 3.2v3.4"/><path d="M7.5 13h3M13.5 13h3M7.5 16.6h3"/></svg></span>시간표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="grades" aria-label="EIE 성적표" title="성적표"><span class="eie-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5v15a2 2 0 0 0 2 2h15"/><path d="M7.5 15l3.2-3.4 2.8 2 4.4-5.3"/></svg></span>성적표</button>
                <button class="btn ap-admin-action-card eie-admin-shortcut eie-surface-action" type="button" data-eie-route="management" aria-label="EIE 관리" title="관리"><span class="eie-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h8M16.5 7H20"/><path d="M4 17h3.5M11.5 17H20"/><circle cx="14.5" cy="7" r="2.3"/><circle cx="9" cy="17" r="2.3"/></svg></span>관리</button>
            </div>
        `;
    }

    function renderOwnerKpiCard(label, value, tone, route, hoverContent, unit = '명') {
        const toneClass = { primary: 'blue', success: 'green', secondary: 'amber', warning: 'amber', error: 'red' }[tone] || 'blue';
        const countText = Number(value || 0).toLocaleString('ko-KR');
        const clickAttr = route ? ` role="button" tabindex="0" data-eie-route="${esc(route)}"` : '';
        const chips = typeof hoverContent === 'string' && hoverContent
            ? `<div class="ap-owner-kpi__chips">${hoverContent}</div>`
            : '';
        return `
            <div class="ap-owner-kpi ap-owner-kpi--${toneClass} eie-owner-kpi"${clickAttr} aria-label="${esc(label)} ${countText}${esc(unit)}" title="${esc(label)}">
                <div class="ap-owner-kpi__top">
                    <span class="ap-owner-kpi__label">${esc(label)}</span>
                    <span class="ap-owner-kpi__eye" aria-hidden="true">
                        <svg class="ap-owner-kpi__eye-off" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3l18 18"/><path d="M10.6 10.6A2 2 0 0 0 13.4 13.4"/><path d="M9.5 5.2A10.4 10.4 0 0 1 12 5c5 0 8.5 4 10 7-0.5 1-1.3 2.1-2.3 3.1"/><path d="M6.6 6.6C4.5 8 3 10.1 2 12c1.5 3 5 7 10 7 1.6 0 3-.4 4.3-1"/></svg>
                        <svg class="ap-owner-kpi__eye-on" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </span>
                </div>
                <div class="ap-owner-kpi__num">${countText}<small>${esc(unit)}</small></div>
                ${chips}
            </div>
        `;
    }

    function renderStudentManagementCard() {
        return `
            <div class="ap-owner-kpi ap-owner-kpi--archive eie-owner-kpi eie-owner-kpi--students" role="button" tabindex="0" data-eie-route="students" aria-label="학생관리" title="학생관리">
                <div class="ap-owner-kpi__top">
                    <span class="ap-owner-kpi__label">학생관리</span>
                    <span class="ap-owner-kpi__arch-ico" aria-hidden="true">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </span>
                </div>
                <div class="ap-owner-kpi__arch-sub">학생 목록 · 상담 · 연락처</div>
            </div>
        `;
    }

    /* [REDESIGN] 운영 통계 카드 — AP 대시보드와 동일 언어.
       앞면은 큰 라인 아이콘 + 큰 라벨만(숫자/•• 없음), 호버 시 학년 브레이크다운 툴팁,
       카드 클릭 시 route로 이동. */
    function renderEieOverviewStatCard(label, tone, iconSvg, route, hoverGridHtml, onClick) {
        const toneClass = ['blue', 'green', 'amber', 'red'].includes(tone) ? tone : 'blue';
        const clickAttr = onClick ? ` role="button" tabindex="0" onclick="${esc(onClick)}"` : '';
        const routeAttr = !onClick && route ? ` role="button" tabindex="0" data-eie-route="${esc(route)}"` : '';
        const tip = hoverGridHtml
            ? `<div class="eie-owner-stat__tip"><div class="eie-owner-stat__tip-title">${esc(label)}</div>${hoverGridHtml}</div>`
            : '';
        return `
            <div class="eie-owner-stat eie-owner-stat--${toneClass}"${routeAttr} aria-label="${esc(label)} 상세 보기">
                <span class="eie-owner-stat__icon" aria-hidden="true">${iconSvg}</span>
                <span class="eie-owner-stat__title">${esc(label)}</span>
                ${tip}
            </div>
        `;
    }

    function renderOverview(data) {
        const students = data.students || [];
        const isDischarged = row => /퇴원|제적|discharged|inactive/i.test(String(row?.status || row?.student_status || ''));
        const activeStudents = students.filter(row => !isDischarged(row));
        const recentStudents = students.filter(isNewStudent);
        const dischargedStudents = students.filter(isDischarged);
        const icoActive = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20.5v-1.5a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4v1.5"/><circle cx="9.2" cy="7.5" r="3.6"/><path d="M21.5 20.5v-1.5a4 4 0 0 0-3-3.87"/><path d="M16.5 3.9a3.6 3.6 0 0 1 0 6.97"/></svg>';
        const icoRecent = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20.5v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1.5"/><circle cx="8" cy="7.5" r="3.6"/><path d="M19 7.5v6M22 10.5h-6"/></svg>';
        const icoLeave = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 21H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3H14"/><path d="M17.5 16l4-4-4-4"/><path d="M21.5 12H10"/></svg>';
        return `
            <div class="ap-admin-section eie-admin-section" style="margin-bottom:18px;">
                <div class="eie-owner-stat-grid" aria-label="오늘 운영">
                    ${renderEieOverviewStatCard('재원생', 'blue', icoActive, 'students', buildGradeHoverGrid(activeStudents))}
                    ${renderEieOverviewStatCard('최근 등록', 'green', icoRecent, 'students', buildGradeHoverGrid(recentStudents), "EieDashboardView.openStudentStatusFilter('new')")}
                    ${renderEieOverviewStatCard('퇴원', 'amber', icoLeave, 'students', buildGradeHoverGrid(dischargedStudents), "EieDashboardView.openStudentStatusFilter('inactive')")}
                </div>
            </div>
        `;
    }

    function openStudentStatusFilter(status) {
        if (window.EieStudentsView && typeof EieStudentsView.setStatusFilter === 'function') {
            EieStudentsView.setStatusFilter(status);
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
    }

    function openDashboardStudent(studentId) {
        if (studentId && window.EieStudentsView && typeof EieStudentsView.openDetail === 'function') {
            EieStudentsView.openDetail(studentId, { route: 'dashboard' }, 'basic');
            return;
        }
        if (window.EieRouter && typeof EieRouter.open === 'function') EieRouter.open('students');
    }

    function renderRecentStudents(data) {
        const rows = (data.students || []).slice(0, 10);
        const rowHtml = rows.map(student => {
            const sid = studentIdOf(student);
            return `
                <button class="ap-admin-recent-student-row eie-admin-recent-row" type="button" onclick="openDashboardStudent(${jsArg(sid)})" aria-label="${esc(student.name || '학생')} 상세" title="${esc(student.name || '학생')}">
                    <span>
                        <strong>${esc(student.name || '이름 없음')}</strong>
                        <small>${esc([student.grade, student.status].filter(Boolean).join(' · ') || 'EIE 학생')}</small>
                    </span>
                    <em>상세</em>
                </button>
            `;
        }).join('');

        return `
            <div class="ap-admin-section eie-admin-section">
                <div class="eie-admin-section-title-row eie-admin-section-title-row--split">
                    <h3 class="ap-admin-section-title eie-admin-section-title">최근 등록 학생</h3>
                    <button class="btn eie-admin-consultation-all" type="button" data-eie-route="students">전체 보기</button>
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
                <button class="card eie-admin-empty-card eie-owner-linked-card" type="button" data-eie-route="management">일정관리로 이동</button>
            </div>
        `;
    }

    function ownerMemoKey(dateStr) {
        return 'eie.owner.dashboard.memo.' + String(dateStr || todayIso()).slice(0, 10);
    }

    function readOwnerMemos(dateStr) {
        try {
            const raw = window.localStorage && window.localStorage.getItem(ownerMemoKey(dateStr));
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function writeOwnerMemos(dateStr, rows) {
        try {
            if (window.localStorage) window.localStorage.setItem(ownerMemoKey(dateStr), JSON.stringify(Array.isArray(rows) ? rows : []));
        } catch (error) {}
    }

    function renderOwnerMemoRows(dateStr) {
        const rows = readOwnerMemos(dateStr);
        if (!rows.length) {
            return `<div class="eie-owner-memo-empty">오늘 메모가 없습니다. 아래에서 추가하세요.</div>`;
        }
        return rows.map(row => {
            const id = String(row.id || '');
            const done = !!row.done;
            return `
                <label class="eie-owner-memo-row${done ? ' is-done' : ''}" onclick="event.stopPropagation()">
                    <input type="checkbox" ${done ? 'checked' : ''} onchange="toggleEieOwnerMemo(${jsArg(dateStr)}, ${jsArg(id)}, this.checked)">
                    <span>${esc(row.text || '')}</span>
                    <button type="button" aria-label="삭제" onclick="event.preventDefault(); event.stopPropagation(); removeEieOwnerMemo(${jsArg(dateStr)}, ${jsArg(id)})">×</button>
                </label>
            `;
        }).join('');
    }

    function refreshOwnerMemoPanel(dateStr) {
        const host = document.getElementById('eie-owner-memo-list');
        if (host) host.innerHTML = renderOwnerMemoRows(dateStr);
    }

    function addEieOwnerMemo(dateStr) {
        const input = document.getElementById('eie-owner-memo-input');
        const text = String(input && input.value || '').trim();
        if (!text) return;
        const rows = readOwnerMemos(dateStr);
        rows.push({ id: 'memo_' + Date.now().toString(36), text, done: false });
        writeOwnerMemos(dateStr, rows);
        if (input) input.value = '';
        refreshOwnerMemoPanel(dateStr);
    }

    function toggleEieOwnerMemo(dateStr, id, done) {
        const rows = readOwnerMemos(dateStr).map(row => String(row.id) === String(id) ? { ...row, done: !!done } : row);
        writeOwnerMemos(dateStr, rows);
        refreshOwnerMemoPanel(dateStr);
    }

    function removeEieOwnerMemo(dateStr, id) {
        const rows = readOwnerMemos(dateStr).filter(row => String(row.id) !== String(id));
        writeOwnerMemos(dateStr, rows);
        refreshOwnerMemoPanel(dateStr);
    }

    function handleOwnerMemoInputKey(event, dateStr) {
        if (event && event.key === 'Enter') {
            event.preventDefault();
            addEieOwnerMemo(dateStr);
        }
    }

    function renderTodayMemoPanel(dateStr) {
        return `
            <div class="ap-admin-section eie-admin-section eie-owner-memo-section" style="margin-bottom:0;">
                <div class="ap-owner-panel-head">
                    <h3 class="ap-admin-section-title ap-owner-panel-title">오늘 일정 · 메모</h3>
                    <span class="ap-owner-panel-meta">${esc(dateStr)}</span>
                </div>
                <div class="card eie-owner-memo-card">
                    <div id="eie-owner-memo-list" class="eie-owner-memo-list">${renderOwnerMemoRows(dateStr)}</div>
                    <div class="eie-owner-memo-add">
                        <input id="eie-owner-memo-input" type="text" placeholder="메모 추가" autocomplete="off" onkeydown="handleOwnerMemoInputKey(event, ${jsArg(dateStr)})">
                        <button type="button" onclick="addEieOwnerMemo(${jsArg(dateStr)})">추가</button>
                    </div>
                </div>
            </div>
        `;
    }

    async function render() {
        const data = await loadDashboardData();
        const today = todayIso();

        return `
            <div class="owner-dashboard-shell ap-owner-redesign">
                <section class="eie-admin-home" aria-label="EIE 원장 대시보드">
                    ${renderTopbar()}
                    ${renderActionGrid()}
                    ${renderOverview(data)}
                    <div class="ap-owner-grid">
                        <div class="ap-owner-cell ap-owner-cell--8">${renderTeacherStatus(data)}</div>
                        <div class="ap-owner-cell ap-owner-cell--4">${renderTodayMemoPanel(today)}</div>
                        <div class="ap-owner-cell ap-owner-cell--8">${renderRecentConsultationPanel(data)}</div>
                        <div class="ap-owner-cell ap-owner-cell--4">${renderWeeklySchedulePlaceholder()}</div>
                        <div class="ap-owner-cell ap-owner-cell--12">${renderRecentStudents(data)}</div>
                    </div>
                    ${renderBottomSearchPlaceholder()}
                    ${renderNotice(data)}
                </section>
            </div>
        `;
    }

    window.openDashboardTeacher = openDashboardTeacher;
    window.openDashboardTeacherClassroom = openDashboardTeacherClassroom;
    window.openDashboardTeacherStudents = openDashboardTeacherStudents;
    window.openDashboardStudent = openDashboardStudent;
    window.openDashboardStudentStatusFilter = openStudentStatusFilter;
    window.openDashboardConsultationStudent = openDashboardConsultationStudent;
    window.addEieOwnerMemo = addEieOwnerMemo;
    window.toggleEieOwnerMemo = toggleEieOwnerMemo;
    window.removeEieOwnerMemo = removeEieOwnerMemo;
    window.handleOwnerMemoInputKey = handleOwnerMemoInputKey;
    window.EieDashboardView = { render, openStudentStatusFilter };
})();
