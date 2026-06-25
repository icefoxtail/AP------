/**
 * AP Math OS 1.0 [js/schedule.js]
 * Unified Schedule Manager:
 * - 일정관리 메뉴 하나
 * - 일정 유형은 시험 / 휴무 / 기타 세 개만 사용
 * - 시험은 exam_schedules API 사용
 * - 휴무/기타는 academy_schedules API 사용
 * - 휴무는 scheduleType 'closed', targetScope 'global'로 저장
 * - 기타는 주간일정 공유용 scheduleType 'etc', targetScope 'global'로 저장
 * - 시작일 필수, 종료일 선택 기반 날짜별 저장
 */

// ============================================================
// Calendar
// ============================================================
function selectExamCalendarDate(dateStr) {
    const dateInput = document.getElementById('new-sch-date');
    if (dateInput) dateInput.value = dateStr;

    if (!state.ui) state.ui = {};
    state.ui.examCalendarMonth = `${dateStr.substring(0, 7)}-01`;
    state.ui.examCalendarSelectedDate = dateStr;

    document.querySelectorAll('.exam-calendar-day').forEach((el) => {
        el.classList.toggle('selected', el.getAttribute('data-date') === dateStr);
    });

    const list = document.querySelector('.exam-schedule-list');
    if (list) list.innerHTML = renderUnifiedScheduleList({ selectedDate: dateStr });
}

function bindExamCalendarDateClicks() {
    document.querySelectorAll('.exam-calendar-day').forEach((el) => {
        if (el.dataset.bound === '1') return;
        el.dataset.bound = '1';
        el.addEventListener('click', () => selectExamCalendarDate(el.getAttribute('data-date')));
    });
}

// ============================================================
// Helpers
// ============================================================
function normalizeScheduleKind(row) {
    const rawKind = String(row?.kind || '').trim();
    if (rawKind === 'exam') return 'exam';
    if (rawKind === 'closed') return 'closed';
    if (rawKind === 'etc') return 'etc';

    const scheduleType = String(row?.schedule_type || row?.scheduleType || '').trim();
    if (scheduleType === 'closed') return 'closed';
    return 'etc';
}

function isGlobalAcademySchedule(row) {
    return String(row?.target_scope || row?.targetScope || 'global') === 'global';
}

function isClosedAcademySchedule(row) {
    return String(row?.schedule_type || row?.scheduleType || '') === 'closed';
}

function getScheduleKindOrder(kind) {
    if (kind === 'exam') return 0;
    if (kind === 'closed') return 1;
    return 2;
}

function getScheduleTypeLabel(type) {
    if (type === 'exam') return '시험';
    if (type === 'closed') return '휴무';
    return '기타';
}

function getScheduleTone(type) {
    if (type === 'exam') {
        return {
            color: 'var(--error)',
            bg: 'rgba(255,71,87,0.08)',
            border: 'rgba(255,71,87,0.18)'
        };
    }

    if (type === 'closed') {
        return {
            color: 'var(--warning)',
            bg: 'rgba(255,165,2,0.12)',
            border: 'rgba(255,165,2,0.22)'
        };
    }

    return {
        color: 'var(--primary)',
        bg: 'rgba(26,92,255,0.08)',
        border: 'rgba(26,92,255,0.16)'
    };
}

function parseScheduleDate(dateStr) {
    const parts = String(dateStr || '').split('-').map(Number);
    if (parts.length !== 3) return null;

    const [y, m, d] = parts;
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

    const date = new Date(y, m - 1, d);
    if (!Number.isFinite(date.getTime())) return null;
    return date;
}

function formatScheduleDate(date) {
    return date.toLocaleDateString('sv-SE');
}

function addScheduleDays(date, days) {
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    next.setDate(next.getDate() + days);
    return next;
}

function formatUnifiedScheduleDateWithDay(dateStr) {
    const date = parseScheduleDate(dateStr);
    if (!date) return dateStr || '';

    const dayNames = ['\uc77c', '\uc6d4', '\ud654', '\uc218', '\ubaa9', '\uae08', '\ud1a0'];
    return `${date.getMonth() + 1}/${date.getDate()}(${dayNames[date.getDay()]})`;
}

function formatUnifiedScheduleDateRange(startDate, endDate) {
    if (endDate && endDate !== startDate) {
        return `${formatUnifiedScheduleDateWithDay(startDate)}~${formatUnifiedScheduleDateWithDay(endDate)}`;
    }
    return formatUnifiedScheduleDateWithDay(startDate);
}

function getScheduleSeriesId(row) {
    return String(row?.series_id || row?.seriesId || row?.id || '');
}

function getScheduleSeriesKind(row) {
    const kind = String(row?.series_kind || row?.seriesKind || 'single');
    return ['single', 'range', 'weekly'].includes(kind) ? kind : 'single';
}

function createScheduleSeriesId() {
    return `srs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getScheduleView() {
    if (!state.ui) state.ui = {};
    return ['month', 'week', 'agenda'].includes(state.ui.examCalendarView)
        ? state.ui.examCalendarView
        : 'month';
}

function setUnifiedScheduleView(view) {
    if (!state.ui) state.ui = {};
    state.ui.examCalendarView = ['month', 'week', 'agenda'].includes(view) ? view : 'month';
    openExamScheduleModal(state.ui.examCalendarMonth || '');
}

function toggleUnifiedScheduleCreateForm() {
    const form = document.getElementById('unified-schedule-create-form');
    if (!form) return;
    const isOpen = form.style.display !== 'none';
    form.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) handleUnifiedScheduleTypeChange('new-sch');
}

function parseScheduleTimeMinutes(timeText) {
    const match = String(timeText || '').trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return null;

    const hours = Number(match[1]);
    const minutes = Number(match[2]);
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
    return hours * 60 + minutes;
}

function isUnifiedScheduleVisible(row, now = new Date()) {
    const scheduleDate = parseScheduleDate(row?.date);
    if (!scheduleDate || !Number.isFinite(now?.getTime?.())) return true;

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (scheduleDate.getTime() < today.getTime()) return false;
    if (scheduleDate.getTime() > today.getTime()) return true;

    const endMinutes = parseScheduleTimeMinutes(row?.end_time);
    if (endMinutes === null) return true;

    const endAt = new Date(scheduleDate);
    endAt.setHours(Math.floor(endMinutes / 60), endMinutes % 60, 0, 0);
    return endAt.getTime() > now.getTime();
}

function getDateRangeList(startDate, endDate) {
    const start = parseScheduleDate(startDate);
    if (!start) {
        toast('시작일을 입력하세요.', 'warn');
        return null;
    }

    const end = endDate ? parseScheduleDate(endDate) : start;
    if (!end) {
        toast('종료일을 확인하세요.', 'warn');
        return null;
    }

    if (end.getTime() < start.getTime()) {
        toast('종료일은 시작일보다 빠를 수 없습니다.', 'warn');
        return null;
    }

    const result = [];
    const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    while (cur.getTime() <= end.getTime()) {
        result.push(formatScheduleDate(cur));
        cur.setDate(cur.getDate() + 1);
    }
    return result;
}

function getOccurrenceDateList(startDate, endDate, seriesKind = 'single', options = {}) {
    const preserveExamRange = options.preserveExamRange === true;
    if (seriesKind === 'single' && !preserveExamRange) {
        const start = parseScheduleDate(startDate);
        if (!start) {
            toast('시작일을 입력하세요.', 'warn');
            return null;
        }
        return [formatScheduleDate(start)];
    }

    if (seriesKind !== 'single' && !endDate) {
        toast('반복 일정은 종료일을 입력하세요.', 'warn');
        return null;
    }

    const dates = getDateRangeList(startDate, endDate);
    if (!dates || seriesKind !== 'weekly') return dates;

    const start = parseScheduleDate(startDate);
    return dates.filter(date => parseScheduleDate(date)?.getDay() === start?.getDay());
}

function groupAcademyScheduleRows(rows) {
    const grouped = new Map();

    rows.forEach((row) => {
        const seriesId = getScheduleSeriesId(row);
        if (!grouped.has(seriesId)) grouped.set(seriesId, []);
        grouped.get(seriesId).push(row);
    });

    return [...grouped.entries()].map(([seriesId, items]) => {
        items.sort((a, b) => String(a.schedule_date || '').localeCompare(String(b.schedule_date || '')));
        const first = items[0] || {};
        const last = items[items.length - 1] || first;
        const kind = isClosedAcademySchedule(first) ? 'closed' : 'etc';

        return {
            kind,
            id: first.id,
            series_id: seriesId,
            series_kind: getScheduleSeriesKind(first),
            series_until: first.series_until || last.schedule_date || first.schedule_date || '',
            date: first.schedule_date || '',
            end_date: last.schedule_date || first.schedule_date || '',
            occurrence_dates: items.map(item => item.schedule_date).filter(Boolean),
            occurrence_ids: items.map(item => item.id),
            title: first.title || (kind === 'closed' ? '휴무' : '일정'),
            school_name: '',
            grade: '',
            memo: first.memo || '',
            start_time: first.start_time || '',
            end_time: first.end_time || '',
            target_scope: first.target_scope || 'global',
            raw_items: items
        };
    });
}

function getUnifiedExamGroupKey(row) {
    return [
        String(row?.school_name || '').trim(),
        String(row?.grade || '').trim(),
        String(row?.exam_name || '').trim(),
        String(row?.memo || '').trim()
    ].join('|');
}

function buildUnifiedExamScheduleGroups(examRows) {
    const grouped = new Map();

    (examRows || []).forEach((row) => {
        if (!row?.exam_date) return;
        const key = getUnifiedExamGroupKey(row);
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(row);
    });

    const result = [];
    grouped.forEach((items) => {
        items.sort((a, b) => String(a.exam_date || '').localeCompare(String(b.exam_date || '')));

        let chunk = [];
        let prevDate = null;

        const flush = () => {
            if (!chunk.length) return;

            const uniqueDates = [...new Set(chunk.map(item => item.exam_date).filter(Boolean))].sort();
            const first = chunk[0] || {};
            const lastDate = uniqueDates[uniqueDates.length - 1] || first.exam_date || '';

            result.push({
                kind: 'exam',
                id: first.id,
                occurrence_ids: chunk.map(item => item.id).filter(id => id !== undefined && id !== null),
                date: uniqueDates[0] || first.exam_date || '',
                end_date: lastDate,
                title: first.exam_name || '일정',
                school_name: first.school_name || '',
                grade: first.grade || '',
                memo: first.memo || '',
                start_time: '',
                end_time: '',
                target_scope: 'global',
                occurrence_dates: uniqueDates,
                raw_items: chunk.slice()
            });
            chunk = [];
        };

        items.forEach((item) => {
            const currentDate = parseScheduleDate(item.exam_date);
            const prevDateStr = prevDate ? formatScheduleDate(prevDate) : '';
            const nextDateStr = prevDate ? formatScheduleDate(addScheduleDays(prevDate, 1)) : '';
            const isSameDate = prevDateStr && item.exam_date === prevDateStr;
            const isNextDate = nextDateStr && item.exam_date === nextDateStr;

            if (chunk.length && !isSameDate && !isNextDate) flush();

            chunk.push(item);
            if (currentDate) prevDate = currentDate;
        });

        flush();
    });

    return result;
}

function getUnifiedScheduleDisplayDateText(item) {
    return formatUnifiedScheduleDateRange(item?.date || '', item?.end_date || item?.date || '');
}

function isUnifiedScheduleInDate(item, dateStr) {
    if (!dateStr) return true;
    const start = item?.date || '';
    const end = item?.end_date || start;
    return start <= dateStr && dateStr <= end;
}

function isUnifiedScheduleOverlappingRange(item, startDate, endDate) {
    const start = item?.date || '';
    const end = item?.end_date || start;
    return start <= endDate && end >= startDate;
}

function getUnifiedScheduleOccurrenceIds(item) {
    const ids = item?.occurrenceIds || item?.occurrence_ids || [];
    return Array.isArray(ids) ? ids.map(id => String(id)).filter(Boolean) : [];
}

function getUnifiedExamGroupedItemByIds(occurrenceIds) {
    const ids = Array.isArray(occurrenceIds) ? occurrenceIds.map(id => String(id)) : [];
    if (ids.length < 2) return null;
    return buildUnifiedExamScheduleGroups(state.db.exam_schedules || [])
        .find(item => {
            const itemIds = getUnifiedScheduleOccurrenceIds(item);
            return itemIds.length === ids.length && ids.every(id => itemIds.includes(id));
        }) || null;
}

function getUnifiedSchedules(now = new Date()) {
    const examRows = buildUnifiedExamScheduleGroups(state.db.exam_schedules || []);

    const academyRows = (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1')
        .filter(s => isGlobalAcademySchedule(s));
    const academySeries = groupAcademyScheduleRows(academyRows);

    return [...examRows, ...academySeries].filter(s => {
        return isUnifiedScheduleVisible({ ...s, date: s.end_date || s.date }, now);
    }).sort((a, b) => {
        const d = String(a.date || '').localeCompare(String(b.date || ''));
        if (d !== 0) return d;

        const ka = getScheduleKindOrder(a.kind);
        const kb = getScheduleKindOrder(b.kind);
        if (ka !== kb) return ka - kb;

        return String(a.title || '').localeCompare(String(b.title || ''), 'ko');
    });
}

function handleUnifiedScheduleTypeChange(prefix) {
    const typeEl = document.getElementById(`${prefix}-kind`);
    const schoolEl = document.getElementById(`${prefix}-school`);
    const gradeEl = document.getElementById(`${prefix}-grade`);
    const titleEl = document.getElementById(`${prefix}-title`);
    const repeatEl = document.getElementById(`${prefix}-repeat`);
    const endDateEl = document.getElementById(`${prefix}-end-date`);
    const startTimeEl = document.getElementById(`${prefix}-start-time`);
    const endTimeEl = document.getElementById(`${prefix}-end-time`);

    if (!typeEl) return;

    const kind = typeEl.value;
    const isExam = kind === 'exam';

    if (schoolEl) {
        schoolEl.disabled = !isExam;
        schoolEl.style.opacity = isExam ? '1' : '0.45';
    }
    if (gradeEl) {
        gradeEl.disabled = !isExam;
        gradeEl.style.opacity = isExam ? '1' : '0.45';
    }
    if (titleEl) {
        if (kind === 'exam') titleEl.placeholder = '시험명';
        else if (kind === 'closed') titleEl.placeholder = '휴무명 예: 학원방학, 추석연휴';
        else titleEl.placeholder = '일정명 예: 회의, 설명회 공지';
    }
    if (repeatEl) {
        repeatEl.disabled = isExam;
        repeatEl.style.opacity = isExam ? '0.45' : '1';
        if (isExam) repeatEl.value = 'single';
    }
    if (startTimeEl) {
        startTimeEl.disabled = isExam;
        startTimeEl.style.opacity = isExam ? '0.45' : '1';
    }
    if (endTimeEl) {
        endTimeEl.disabled = isExam;
        endTimeEl.style.opacity = isExam ? '0.45' : '1';
    }
    if (endDateEl && repeatEl) {
        const requiresEndDate = !isExam && repeatEl.value !== 'single';
        endDateEl.required = requiresEndDate;
        endDateEl.style.opacity = isExam || requiresEndDate ? '1' : '0.7';
    }
}

function collectUnifiedSchedulePayload(prefix) {
    const kind = document.getElementById(`${prefix}-kind`)?.value || 'exam';
    const title = document.getElementById(`${prefix}-title`)?.value.trim() || '';
    const startDate = document.getElementById(`${prefix}-date`)?.value || '';
    const endDate = document.getElementById(`${prefix}-end-date`)?.value || '';
    const seriesKind = kind === 'exam'
        ? 'single'
        : (document.getElementById(`${prefix}-repeat`)?.value || 'single');
    const startTime = kind === 'exam' ? '' : (document.getElementById(`${prefix}-start-time`)?.value || '');
    const endTime = kind === 'exam' ? '' : (document.getElementById(`${prefix}-end-time`)?.value || '');
    const memo = document.getElementById(`${prefix}-memo`)?.value.trim() || '';
    const dates = getOccurrenceDateList(startDate, endDate, seriesKind, {
        preserveExamRange: kind === 'exam' && Boolean(endDate)
    });

    if (!dates) return null;

    if (kind !== 'closed' && !title) {
        toast('일정 내용을 입력하세요.', 'warn');
        return null;
    }

    if (kind === 'exam') {
        const schoolName = document.getElementById(`${prefix}-school`)?.value.trim() || '';
        const grade = document.getElementById(`${prefix}-grade`)?.value || '';

        return {
            kind,
            title,
            date: startDate,
            endDate,
            schoolName,
            grade,
            memo,
            dates,
            seriesId: '',
            seriesKind: 'single',
            seriesUntil: dates[dates.length - 1] || startDate,
            buildPayload(date) {
                return {
                    schoolName,
                    grade,
                    examName: title,
                    examDate: date,
                    memo
                };
            }
        };
    }

    if (startTime && endTime && parseScheduleTimeMinutes(endTime) <= parseScheduleTimeMinutes(startTime)) {
        toast('종료 시간은 시작 시간보다 늦어야 합니다.', 'warn');
        return null;
    }

    const seriesId = document.getElementById(`${prefix}-series-id`)?.value || createScheduleSeriesId();
    const seriesUntil = seriesKind === 'single' ? startDate : endDate;

    if (kind === 'closed') {
        return {
            kind,
            dates,
            seriesId,
            seriesKind,
            seriesUntil,
            buildPayload(date) {
                return {
                    scheduleType: 'closed',
                    title: title || '휴무',
                    scheduleDate: date,
                    startTime,
                    endTime,
                    targetScope: 'global',
                    studentId: '',
                    teacherName: '',
                    memo,
                    isClosed: true,
                    seriesId,
                    seriesKind,
                    seriesUntil
                };
            }
        };
    }

    return {
        kind,
        dates,
        seriesId,
        seriesKind,
        seriesUntil,
        buildPayload(date) {
            return {
                scheduleType: 'etc',
                title,
                scheduleDate: date,
                startTime,
                endTime,
                targetScope: 'global',
                studentId: '',
                teacherName: '',
                memo,
                isClosed: false,
                seriesId,
                seriesKind,
                seriesUntil
            };
        }
    };
}

// ============================================================
// Render
// ============================================================
function renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr) {
    const examSchedules = state.db.exam_schedules || [];
    const academySchedules = (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1')
        .filter(s => isGlobalAcademySchedule(s));
    const selectedDate = state.ui?.examCalendarSelectedDate || '';

    let calendarHtml = `
        <div class="exam-calendar-shell">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px;">
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${prevStr}')" aria-label="이전 달">&lt;</button>
                <div style="font-size:18px; font-weight:500; line-height:1.3; color:var(--text);">${targetYear}년 ${targetMonth + 1}월</div>
                <button class="btn ap-small-btn" style="background:var(--surface); border:none;" onclick="openExamScheduleModal('${nextStr}')" aria-label="다음 달">&gt;</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:13px; font-weight:500; line-height:1.3; color:var(--secondary); margin-bottom:8px;">
                <div style="color:var(--error);">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div style="color:var(--primary);">토</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, minmax(0, 1fr)); gap:4px;">
    `;

    for (let i = 0; i < firstDay; i++) {
        calendarHtml += `<div></div>`;
    }

    for (let d = 1; d <= lastDate; d++) {
        const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const hasExamSchedule = examSchedules.some(s => s.exam_date === dateStr);
        const dayAcademySchedules = academySchedules.filter(s => s.schedule_date === dateStr);
        const seriesBars = dayAcademySchedules.slice(0, 2).map((row) => {
            const tone = getScheduleTone(isClosedAcademySchedule(row) ? 'closed' : 'etc');
            const seriesId = getScheduleSeriesId(row);
            const seriesRows = academySchedules.filter(item => getScheduleSeriesId(item) === seriesId);
            const prevDate = new Date(targetYear, targetMonth, d - 1);
            const nextDate = new Date(targetYear, targetMonth, d + 1);
            const hasPrev = getScheduleSeriesKind(row) === 'range' && seriesRows.some(item => item.schedule_date === formatScheduleDate(prevDate));
            const hasNext = getScheduleSeriesKind(row) === 'range' && seriesRows.some(item => item.schedule_date === formatScheduleDate(nextDate));
            const positionClass = `${hasPrev ? ' has-prev' : ''}${hasNext ? ' has-next' : ''}`;
            return `<span class="exam-calendar-series-bar${positionClass}" style="--series-color:${tone.color}; --series-bg:${tone.bg};" title="${apEscapeHtml(row.title || '')}">${apEscapeHtml(row.title || '')}</span>`;
        }).join('');

        calendarHtml += `
            <button type="button" class="exam-calendar-day ${isToday ? 'today' : ''} ${selectedDate === dateStr ? 'selected' : ''}" data-date="${dateStr}" aria-label="${dateStr}">
                <span class="exam-calendar-day-number">${d}</span>
                <span class="exam-calendar-bars">${seriesBars}</span>
                <span style="display:flex; gap:3px; align-items:center; justify-content:center; height:5px;">
                    <span class="exam-calendar-dot" style="background:${hasExamSchedule ? 'var(--error)' : 'transparent'};"></span>
                </span>
            </button>
        `;
    }

    calendarHtml += `
            </div>
            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:10px; font-size:11px; font-weight:400; color:var(--secondary);">
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--error);margin-right:4px;"></span>시험</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--warning);margin-right:4px;"></span>휴무</span>
                <span><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--primary);margin-right:4px;"></span>기타</span>
            </div>
        </div>
    `;

    return calendarHtml;
}

function getWeekDates(baseDateStr) {
    const base = parseScheduleDate(baseDateStr) || new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        return formatScheduleDate(date);
    });
}

function renderUnifiedScheduleWeek(todayStr) {
    const baseDate = state.ui?.examCalendarSelectedDate || state.ui?.examCalendarMonth || todayStr;
    const weekDates = getWeekDates(baseDate);
    const schedules = getUnifiedSchedules(new Date(0))
        .filter(item => isUnifiedScheduleOverlappingRange(item, weekDates[0], weekDates[6]));
    const prevBase = parseScheduleDate(weekDates[0]);
    const nextBase = parseScheduleDate(weekDates[6]);
    prevBase.setDate(prevBase.getDate() - 7);
    nextBase.setDate(nextBase.getDate() + 7);

    return `
        <div class="exam-calendar-shell">
            <div class="exam-week-nav">
                <button class="btn ap-small-btn" onclick="openExamScheduleModal('${formatScheduleDate(prevBase)}')" aria-label="이전 주">&lt;</button>
                <div>${formatUnifiedScheduleDateWithDay(weekDates[0])} ~ ${formatUnifiedScheduleDateWithDay(weekDates[6])}</div>
                <button class="btn ap-small-btn" onclick="openExamScheduleModal('${formatScheduleDate(nextBase)}')" aria-label="다음 주">&gt;</button>
            </div>
            <div style="font-size:15px; font-weight:500; margin-bottom:10px;">이번 주 일정</div>
            <div class="exam-schedule-list">${renderUnifiedScheduleList({ items: schedules })}</div>
        </div>
    `;
}
function renderUnifiedScheduleAgenda() {
    return `
        <div class="exam-calendar-shell">
            <div style="font-size:15px; font-weight:500; margin-bottom:10px;">다가오는 일정</div>
            <div class="exam-agenda-list">${renderUnifiedScheduleList()}</div>
        </div>
    `;
}

function renderUnifiedScheduleForm(prefix = 'new-sch', item = null, options = {}) {
    const kind = item?.kind || 'exam';
    const date = item?.date || new Date().toLocaleDateString('sv-SE');
    const endDate = item?.end_date || '';
    const title = item?.title || '';
    const memo = item?.memo || '';
    const schoolName = item?.school_name || '';
    const grade = item?.grade || '';
    const startTime = item?.start_time || '';
    const endTime = item?.end_time || '';
    const seriesKind = item?.series_kind || 'single';
    const seriesId = item?.series_id || '';
    const isEdit = options.isEdit === true;
    const kindDisabled = isEdit ? 'disabled' : '';

    return `
        <div class="exam-schedule-form">
            <input type="hidden" id="${prefix}-series-id" value="${apEscapeHtml(seriesId)}">
            <input type="hidden" id="${prefix}-occurrence-date" value="${apEscapeHtml(item?.occurrence_date || date)}">
            <input type="hidden" id="${prefix}-series-start" value="${apEscapeHtml(date)}">
            <input type="hidden" id="${prefix}-series-end" value="${apEscapeHtml(endDate)}">
            <input type="hidden" id="${prefix}-series-kind" value="${apEscapeHtml(seriesKind)}">
            <div class="exam-schedule-row">
                <select id="${prefix}-kind" class="btn" style="border:none; background:var(--surface);" onchange="handleUnifiedScheduleTypeChange('${prefix}')" ${kindDisabled}>
                    <option value="exam" ${kind === 'exam' ? 'selected' : ''}>시험</option>
                    <option value="closed" ${kind === 'closed' ? 'selected' : ''}>휴무</option>
                    <option value="etc" ${kind === 'etc' ? 'selected' : ''}>기타</option>
                </select>
                <input type="text" id="${prefix}-title" class="btn" value="${apEscapeHtml(title)}" placeholder="일정 내용" style="text-align:left; border:none; background:var(--surface);">
            </div>

            <div class="exam-schedule-row">
                <input type="date" id="${prefix}-date" class="btn" value="${date}" style="border:none; background:var(--surface);">
                <input type="date" id="${prefix}-end-date" class="btn" value="${endDate}" placeholder="종료일" style="border:none; background:var(--surface);">
            </div>

            <div class="exam-schedule-row">
                <select id="${prefix}-repeat" class="btn" style="border:none; background:var(--surface);" onchange="handleUnifiedScheduleTypeChange('${prefix}')">
                    <option value="single" ${seriesKind === 'single' ? 'selected' : ''}>반복 안 함</option>
                    <option value="range" ${seriesKind === 'range' ? 'selected' : ''}>기간 전체 · 매일</option>
                    <option value="weekly" ${seriesKind === 'weekly' ? 'selected' : ''}>매주 · 같은 요일</option>
                </select>
                <div class="exam-schedule-time-row">
                    <input type="time" id="${prefix}-start-time" class="btn" value="${startTime}" aria-label="시작 시간">
                    <span>~</span>
                    <input type="time" id="${prefix}-end-time" class="btn" value="${endTime}" aria-label="종료 시간">
                </div>
            </div>

            <div class="exam-schedule-row">
                <input type="text" id="${prefix}-school" class="btn" value="${apEscapeHtml(schoolName)}" placeholder="학교/장소 (시험 선택 시)" style="text-align:left; border:none; background:var(--surface);">
                <select id="${prefix}-grade" class="btn" style="border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1" ${grade === '중1' ? 'selected' : ''}>중1</option>
                    <option value="중2" ${grade === '중2' ? 'selected' : ''}>중2</option>
                    <option value="중3" ${grade === '중3' ? 'selected' : ''}>중3</option>
                    <option value="고1" ${grade === '고1' ? 'selected' : ''}>고1</option>
                    <option value="고2" ${grade === '고2' ? 'selected' : ''}>고2</option>
                    <option value="고3" ${grade === '고3' ? 'selected' : ''}>고3</option>
                </select>
            </div>

            <textarea id="${prefix}-memo" class="btn" placeholder="메모" style="width:100%; min-height:70px; text-align:left; border:none; background:var(--surface); resize:vertical; font-size:14px; font-weight:400; line-height:1.7;">${apEscapeHtml(memo)}</textarea>
        </div>
    `;
}

function renderUnifiedScheduleList(options = {}) {
    const selectedDate = options.selectedDate || '';
    const sourceItems = Array.isArray(options.items) ? options.items : getUnifiedSchedules();
    const schedules = sourceItems.filter(item => {
        if (!selectedDate) return true;
        return isUnifiedScheduleInDate(item, selectedDate);
    });

    if (!schedules.length) {
        return `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:400; line-height:1.45; padding:20px;">${selectedDate ? `${apEscapeHtml(selectedDate)} 일정이 없습니다` : '등록된 일정이 없습니다'}</div>`;
    }

    return schedules.map(s => {
        const tone = getScheduleTone(s.kind);
        const timeText = [s.start_time, s.end_time].filter(Boolean).join(' - ');
        const dateText = getUnifiedScheduleDisplayDateText(s);
        const repeatText = s.series_kind === 'weekly' ? ' · 매주' : '';
        const titleParts = [];

        if (s.kind === 'exam' && (s.school_name || s.grade)) {
            titleParts.push(`${s.school_name || ''} ${s.grade || ''}`.trim());
        }
        titleParts.push(s.title || '');

        const editRow = selectedDate && Array.isArray(s.raw_items)
            ? s.raw_items.find(item => s.kind === 'exam' ? item.exam_date === selectedDate : item.schedule_date === selectedDate)
            : null;
        const editId = editRow?.id || s.id;
        const editSeriesArg = s.kind === 'exam' ? '' : (s.series_id || '');
        const occurrenceIds = getUnifiedScheduleOccurrenceIds(s);
        const isGroupedExam = s.kind === 'exam' && occurrenceIds.length > 1;
        const clickAction = isGroupedExam
            ? `openEditGroupedExamScheduleModal('${occurrenceIds.map(id => apEscapeHtml(id)).join(',')}')`
            : `openEditUnifiedScheduleModal('${s.kind}', '${editId}', '${apEscapeHtml(editSeriesArg)}')`;

        return `
            <button type="button" class="exam-schedule-item" style="border-color:${tone.border};" onclick="${clickAction}">
                <span style="flex:1; min-width:0; display:block; text-align:left;">
                    <span style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:5px;">
                        <span style="font-size:11px; font-weight:500; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:3px 8px; border-radius:8px;">${getScheduleTypeLabel(s.kind)}</span>
                        <span style="font-size:11px; font-weight:400; color:var(--secondary);">${apEscapeHtml(dateText || '')}${repeatText}${timeText ? ` · ${apEscapeHtml(timeText)}` : ''}</span>
                    </span>
                    <span style="display:block; font-size:15px; font-weight:500; line-height:1.35; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(titleParts.filter(Boolean).join(' '))}</span>
                    ${s.memo ? `<span style="display:block; font-size:12px; font-weight:500; line-height:1.45; color:var(--secondary); margin-top:4px; overflow-wrap:anywhere; white-space:pre-line;">${apEscapeHtml(s.memo)}</span>` : ''}
                    ${s.kind === 'exam' && (s.occurrence_dates || []).length > 1 ? `<span style="display:block; font-size:11px; font-weight:400; line-height:1.4; color:var(--secondary); margin-top:4px;">기간 시험 일정 · 개별 날짜 수정</span>` : ''}
                </span>
            </button>
        `;
    }).join('');
}
function openExamScheduleModal(baseDateStr = '') {
    if (typeof clearModalSteps === 'function') clearModalSteps();

    const todayStr = new Date().toLocaleDateString('sv-SE');

    if (!state.ui) state.ui = {};
    if (baseDateStr) {
        state.ui.examCalendarMonth = baseDateStr;
        if (getScheduleView() === 'week') state.ui.examCalendarSelectedDate = baseDateStr;
    } else if (!state.ui.examCalendarMonth) {
        state.ui.examCalendarMonth = todayStr;
    }

    const parts = state.ui.examCalendarMonth.split('-');
    const targetYear = parseInt(parts[0], 10);
    const targetMonth = parseInt(parts[1], 10) - 1;
    const firstDay = new Date(targetYear, targetMonth, 1).getDay();
    const lastDate = new Date(targetYear, targetMonth + 1, 0).getDate();
    const prevMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const nextMonthDate = new Date(targetYear, targetMonth + 1, 1);
    const prevStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const nextStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const view = getScheduleView();
    if (view === 'month') {
        const targetMonthKey = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}`;
        if (!state.ui.examCalendarSelectedDate || !state.ui.examCalendarSelectedDate.startsWith(targetMonthKey)) {
            state.ui.examCalendarSelectedDate = todayStr.startsWith(targetMonthKey)
                ? todayStr
                : `${targetMonthKey}-01`;
        }
    }
    const selectedDate = view === 'month' ? (state.ui.examCalendarSelectedDate || '') : '';
    const calendarContent = view === 'week'
        ? renderUnifiedScheduleWeek(todayStr)
        : view === 'agenda'
            ? renderUnifiedScheduleAgenda()
            : renderUnifiedScheduleCalendar(todayStr, targetYear, targetMonth, firstDay, lastDate, prevStr, nextStr);

    const body = `
        <style>
            .unified-schedule-modal .exam-schedule-form { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:14px; border-radius:14px; }
            .unified-schedule-modal .exam-schedule-row { display:flex; gap:10px; width:100%; }
            .unified-schedule-modal .exam-schedule-row > * { flex:1; min-width:0; width:100%; }
            .unified-schedule-modal .exam-calendar-shell { background:var(--surface-2); border-radius:14px; padding:12px; margin-bottom:16px; }
            .unified-schedule-modal .exam-view-toggle { display:flex; gap:4px; padding:4px; margin-bottom:12px; border-radius:12px; background:var(--surface-2); }
            .unified-schedule-modal .exam-view-toggle button { flex:1; min-height:36px; border:0; border-radius:9px; background:transparent; color:var(--secondary); cursor:pointer; }
            .unified-schedule-modal .exam-view-toggle button.active { background:var(--surface); color:var(--primary); box-shadow:0 1px 3px rgba(15,23,42,.08); }
            .unified-schedule-modal .exam-calendar-day { min-height:66px; background:var(--surface); border:1px solid transparent; border-radius:10px; padding:5px 3px; text-align:center; cursor:pointer; display:flex; flex-direction:column; align-items:stretch; justify-content:flex-start; gap:2px; font-size:14px; font-weight:500; line-height:1.2; color:var(--text); overflow:hidden; }
            .unified-schedule-modal .exam-calendar-day.today { border-color:var(--primary); color:var(--primary); }
            .unified-schedule-modal .exam-calendar-day.selected { background:rgba(26,92,255,0.08); border-color:var(--primary); color:var(--primary); }
            .unified-schedule-modal .exam-calendar-day-number { align-self:center; }
            .unified-schedule-modal .exam-calendar-bars { display:flex; flex-direction:column; gap:2px; min-height:24px; }
            .unified-schedule-modal .exam-calendar-series-bar { display:block; min-width:0; height:11px; padding:0 3px; border-radius:4px; background:var(--series-bg); color:var(--series-color); font-size:8px; line-height:11px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            .unified-schedule-modal .exam-calendar-series-bar.has-prev { margin-left:-4px; border-top-left-radius:0; border-bottom-left-radius:0; }
            .unified-schedule-modal .exam-calendar-series-bar.has-next { margin-right:-4px; border-top-right-radius:0; border-bottom-right-radius:0; }
            .unified-schedule-modal .exam-calendar-dot { width:4px; height:4px; border-radius:50%; margin-top:1px; display:inline-block; }
            .unified-schedule-modal .exam-schedule-list { max-height:38vh; overflow-y:auto; padding-right:2px; margin-bottom:12px; }
            .unified-schedule-modal .exam-schedule-item { width:100%; padding:12px 0; border:0; border-bottom:1px solid var(--border); background:transparent; display:flex; justify-content:space-between; align-items:center; gap:12px; cursor:pointer; color:inherit; }
            .unified-schedule-modal .exam-schedule-item:hover { background:rgba(15,23,42,0.03); }
            .unified-schedule-modal .exam-schedule-time-row { display:flex; align-items:center; gap:6px; }
            .unified-schedule-modal .exam-schedule-time-row input { min-width:0; flex:1; border:0; background:var(--surface); }
            .unified-schedule-modal .exam-schedule-scope { display:flex; gap:10px; margin:0 0 12px; padding:10px 12px; border-radius:12px; background:var(--surface-2); }
            .unified-schedule-modal .exam-schedule-scope label { flex:1; display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; }
            .unified-schedule-modal .exam-week-nav { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:12px; font-size:14px; font-weight:500; }
            .unified-schedule-modal .exam-week-nav button { border:0; background:var(--surface); }
            .unified-schedule-modal .exam-week-grid { display:grid; grid-template-columns:repeat(7,minmax(0,1fr)); gap:5px; }
            .unified-schedule-modal .exam-week-day { min-height:132px; padding:8px 5px; border:1px solid var(--border); border-radius:10px; background:var(--surface); color:var(--text); text-align:left; cursor:pointer; }
            .unified-schedule-modal .exam-week-day.today { border-color:var(--primary); }
            .unified-schedule-modal .exam-week-day-label { display:block; text-align:center; margin-bottom:8px; font-size:12px; font-weight:500; }
            .unified-schedule-modal .exam-week-items { display:flex; flex-direction:column; gap:4px; }
            .unified-schedule-modal .exam-week-item { display:block; padding:4px; border:1px solid; border-radius:6px; font-size:9px; line-height:1.3; overflow-wrap:anywhere; }
            .unified-schedule-modal .exam-week-empty { display:block; text-align:center; color:var(--secondary); font-size:9px; }
            .unified-schedule-modal .exam-agenda-list { max-height:42vh; overflow:auto; }
            @media (max-width:600px) {
                .unified-schedule-modal .exam-schedule-form { padding:12px; }
                .unified-schedule-modal .exam-schedule-row { flex-direction:column; }
                .unified-schedule-modal .exam-schedule-list { max-height:34vh; padding-right:0; }
                .unified-schedule-modal .exam-schedule-item { align-items:flex-start; }
                .unified-schedule-modal .exam-calendar-day { min-height:56px; padding:4px 1px; font-size:12px; }
                .unified-schedule-modal .exam-calendar-series-bar { font-size:0; height:8px; }
                .unified-schedule-modal .exam-week-grid { display:flex; flex-direction:column; }
                .unified-schedule-modal .exam-week-day { min-height:72px; }
                .unified-schedule-modal .exam-week-items { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); }
            }
        </style>

        <div class="unified-schedule-modal">
        <div class="exam-view-toggle" role="tablist" aria-label="일정 보기 방식">
            <button type="button" class="${view === 'month' ? 'active' : ''}" onclick="setUnifiedScheduleView('month')">월</button>
            <button type="button" class="${view === 'week' ? 'active' : ''}" onclick="setUnifiedScheduleView('week')">주</button>
            <button type="button" class="${view === 'agenda' ? 'active' : ''}" onclick="setUnifiedScheduleView('agenda')">목록</button>
        </div>

        ${calendarContent}
        ${view === 'month' ? `<div style="margin:18px 0 10px;">
            <div style="font-size:15px; font-weight:500; color:var(--text); line-height:1.35;">선택한 날짜 일정</div>
        </div>
        <div class="exam-schedule-list">${renderUnifiedScheduleList({ selectedDate })}</div>` : ''}

        <button class="btn btn-primary ap-primary-btn" style="width:100%; margin:4px 0 12px;" onclick="toggleUnifiedScheduleCreateForm()">+ 일정 등록</button>
        <div id="unified-schedule-create-form" style="display:none;">
            <div style="margin:6px 0 10px;">
                <div style="font-size:15px; font-weight:500; color:var(--text); line-height:1.35;">일정 등록</div>
            </div>
            ${renderUnifiedScheduleForm('new-sch')}
            <button class="btn btn-primary ap-primary-btn" style="width:100%; margin-bottom:16px;" onclick="addUnifiedSchedule()">일정 저장</button>
        </div>
        </div>
    `;

    showModal('일정관리', body);
    bindExamCalendarDateClicks();
    handleUnifiedScheduleTypeChange('new-sch');
}

// ============================================================
// Create / Edit / Delete
// ============================================================
async function addUnifiedSchedule() {
    const payload = collectUnifiedSchedulePayload('new-sch');
    if (!payload) return;

    try {
        if (payload.kind !== 'exam') {
            const response = payload.dates.length > 1
                ? await api.post('academy-schedules/batch', {
                    items: payload.dates.map(date => payload.buildPayload(date)),
                    seriesId: payload.seriesId,
                    seriesKind: payload.seriesKind,
                    seriesUntil: payload.seriesUntil
                })
                : await api.post('academy-schedules', payload.buildPayload(payload.dates[0]));

            if (response?.success) {
                toast('일정이 저장되었습니다.', 'success');
                await loadData();
                openExamScheduleModal();
                return;
            }

            toast(response?.message || response?.error || '일정 저장에 실패했습니다.', 'error');
            return;
        }

        const response = payload.dates.length > 1
            ? await api.post('exam-schedules/group', {
                schoolName: payload.schoolName,
                grade: payload.grade,
                examName: payload.title,
                startDate: payload.date,
                endDate: payload.endDate || payload.date,
                memo: payload.memo
            })
            : await api.post('exam-schedules', payload.buildPayload(payload.dates[0]));

        if (response?.success) {
            toast('일정이 저장되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }


        toast('일정 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[addUnifiedSchedule] failed:', e);
        toast('일정 저장 중 오류가 발생했습니다.', 'error');
    }
}

function openEditUnifiedScheduleModal(kind, id, seriesId = '') {
    let item = null;

    if (kind === 'exam') {
        const e = (state.db.exam_schedules || []).find(x => String(x.id) === String(id));
        if (!e) return;

        item = {
            kind: 'exam',
            id: e.id,
            date: e.exam_date || '',
            end_date: '',
            title: e.exam_name || '',
            school_name: e.school_name || '',
            grade: e.grade || '',
            memo: e.memo || '',
            start_time: '',
            end_time: '',
            target_scope: 'global'
        };
    } else {
        const academyRows = (state.db.academy_schedules || []).filter(x => String(x.is_deleted || 0) !== '1');
        const s = academyRows.find(x => String(x.id) === String(id));
        if (!s) return;

        const resolvedSeriesId = seriesId || getScheduleSeriesId(s);
        const seriesRows = academyRows
            .filter(row => getScheduleSeriesId(row) === resolvedSeriesId)
            .sort((a, b) => String(a.schedule_date || '').localeCompare(String(b.schedule_date || '')));
        const first = seriesRows[0] || s;
        const last = seriesRows[seriesRows.length - 1] || s;
        const normalizedKind = isClosedAcademySchedule(s) ? 'closed' : 'etc';
        item = {
            kind: normalizedKind,
            id: s.id,
            series_id: resolvedSeriesId,
            series_kind: getScheduleSeriesKind(first),
            date: first.schedule_date || '',
            end_date: last.schedule_date || first.schedule_date || '',
            title: first.title || (normalizedKind === 'closed' ? '휴무' : ''),
            school_name: '',
            grade: '',
            memo: first.memo || '',
            start_time: first.start_time || '',
            end_time: first.end_time || '',
            target_scope: first.target_scope || 'global',
            occurrence_date: s.schedule_date || first.schedule_date || '',
            occurrence_count: seriesRows.length
        };
    }

    const isSeries = kind !== 'exam' && item.occurrence_count > 1;
    const mutationSeriesArg = item.series_id || '';
    showModalStep('일정 수정', `
        <style>
            .unified-schedule-modal .exam-schedule-form { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:14px; border-radius:14px; }
            .unified-schedule-modal .exam-schedule-row { display:flex; gap:10px; width:100%; }
            .unified-schedule-modal .exam-schedule-row > * { flex:1; min-width:0; width:100%; }
            .unified-schedule-modal .exam-schedule-time-row { display:flex; align-items:center; gap:6px; }
            .unified-schedule-modal .exam-schedule-time-row input { min-width:0; flex:1; border:0; background:var(--surface); }
            .unified-schedule-modal .exam-schedule-scope { display:flex; gap:10px; margin:0 0 12px; padding:10px 12px; border-radius:12px; background:var(--surface-2); }
            .unified-schedule-modal .exam-schedule-scope label { flex:1; display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; }
            @media (max-width:600px) {
                .unified-schedule-modal .exam-schedule-form { padding:12px; }
                .unified-schedule-modal .exam-schedule-row { flex-direction:column; }
            }
        </style>
        <div class="unified-schedule-modal">
        ${renderUnifiedScheduleForm('edit-sch', item, { isEdit: true })}
        ${isSeries ? `<div class="exam-schedule-scope">
            <label><input type="radio" name="edit-sch-scope" value="one" onchange="handleUnifiedScheduleScopeChange()"> 이 날짜만</label>
            <label><input type="radio" name="edit-sch-scope" value="series" checked onchange="handleUnifiedScheduleScopeChange()"> 시리즈 전체</label>
        </div>` : ''}
        <div style="display:flex; gap:8px; align-items:center; margin-top:4px;">
            <button class="btn btn-primary" style="flex:1; min-height:0; padding:11px 16px; font-size:14px; font-weight:600; border-radius:var(--radius-md);" onclick="handleEditUnifiedSchedule('${kind}', '${id}', '${apEscapeHtml(mutationSeriesArg)}')">저장</button>
            <button class="btn btn-danger" style="flex:0 0 auto; min-height:0; padding:11px 18px; font-size:13px; font-weight:500; border-radius:var(--radius-md);" onclick="deleteUnifiedSchedule('${kind}', '${id}', '${apEscapeHtml(mutationSeriesArg)}')">삭제</button>
        </div>
        </div>
    `);

    handleUnifiedScheduleTypeChange('edit-sch');
}

function openEditGroupedExamScheduleModal(occurrenceIdsText) {
    const occurrenceIds = String(occurrenceIdsText || '').split(',').map(id => id.trim()).filter(Boolean);
    const item = getUnifiedExamGroupedItemByIds(occurrenceIds);
    if (!item) return toast('기간 시험 정보를 찾지 못했습니다.', 'error');

    const idsArg = occurrenceIds.map(id => apEscapeHtml(id)).join(',');
    showModalStep('일정 수정', `
        <style>
            .unified-schedule-modal .exam-schedule-form { display:flex; flex-direction:column; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:14px; border-radius:14px; }
            .unified-schedule-modal .exam-schedule-row { display:flex; gap:10px; width:100%; }
            .unified-schedule-modal .exam-schedule-row > * { flex:1; min-width:0; width:100%; }
            .unified-schedule-modal .exam-schedule-time-row { display:flex; align-items:center; gap:6px; }
            .unified-schedule-modal .exam-schedule-time-row input { min-width:0; flex:1; border:0; background:var(--surface); }
            @media (max-width:600px) {
                .unified-schedule-modal .exam-schedule-form { padding:12px; }
                .unified-schedule-modal .exam-schedule-row { flex-direction:column; }
            }
        </style>
        <div class="unified-schedule-modal">
            ${renderUnifiedScheduleForm('edit-sch', item, { isEdit: true })}
            <div style="display:flex; gap:8px; align-items:center; margin-top:4px;">
                <button class="btn btn-primary" style="flex:1; min-height:0; padding:11px 16px; font-size:14px; font-weight:600; border-radius:var(--radius-md);" onclick="handleEditGroupedExamSchedule('${idsArg}')">저장</button>
                <button class="btn btn-danger" style="flex:0 0 auto; min-height:0; padding:11px 18px; font-size:13px; font-weight:500; border-radius:var(--radius-md);" onclick="deleteGroupedExamSchedule('${idsArg}')">삭제</button>
            </div>
        </div>
    `);
    handleUnifiedScheduleTypeChange('edit-sch');
}

function getUnifiedScheduleMutationScope() {
    return document.querySelector('input[name="edit-sch-scope"]:checked')?.value || 'one';
}

function handleUnifiedScheduleScopeChange() {
    const scope = getUnifiedScheduleMutationScope();
    const dateEl = document.getElementById('edit-sch-date');
    const endDateEl = document.getElementById('edit-sch-end-date');
    const repeatEl = document.getElementById('edit-sch-repeat');
    if (!dateEl || !endDateEl || !repeatEl) return;

    if (scope === 'one') {
        dateEl.value = document.getElementById('edit-sch-occurrence-date')?.value || dateEl.value;
        endDateEl.value = '';
        repeatEl.value = 'single';
    } else {
        dateEl.value = document.getElementById('edit-sch-series-start')?.value || dateEl.value;
        endDateEl.value = document.getElementById('edit-sch-series-end')?.value || '';
        repeatEl.value = document.getElementById('edit-sch-series-kind')?.value || 'single';
    }
    handleUnifiedScheduleTypeChange('edit-sch');
}


async function handleEditUnifiedSchedule(kind, id, seriesId = '') {
    const payload = collectUnifiedSchedulePayload('edit-sch');
    if (!payload) return;

    const date = payload.dates[0];
    const body = payload.buildPayload(date);
    const scope = kind === 'exam' ? 'one' : getUnifiedScheduleMutationScope();
    if (scope === 'one' && kind !== 'exam' && seriesId) {
        body.seriesId = seriesId;
        body.seriesKind = document.getElementById('edit-sch-series-kind')?.value || body.seriesKind;
        body.seriesUntil = document.getElementById('edit-sch-series-end')?.value || body.seriesUntil;
    }

    try {
        let r;
        if (payload.kind === 'exam') {
            r = await api.patch('exam-schedules/' + id, body);
        } else if (scope === 'series' && seriesId) {
            const originalRows = (state.db.academy_schedules || [])
                .filter(row => String(row.is_deleted || 0) !== '1' && getScheduleSeriesId(row) === seriesId)
                .sort((a, b) => String(a.schedule_date || '').localeCompare(String(b.schedule_date || '')));
            const originalDates = originalRows.map(row => row.schedule_date);
            const datesChanged = originalDates.join('|') !== payload.dates.join('|')
                || getScheduleSeriesKind(originalRows[0]) !== payload.seriesKind;

            if (datesChanged) {
                const replacementSeriesId = createScheduleSeriesId();
                const buildReplacementPayload = itemDate => ({
                    ...payload.buildPayload(itemDate),
                    seriesId: replacementSeriesId
                });
                const created = payload.dates.length > 1
                    ? await api.post('academy-schedules/batch', {
                        items: payload.dates.map(buildReplacementPayload),
                        seriesId: replacementSeriesId,
                        seriesKind: payload.seriesKind,
                        seriesUntil: payload.seriesUntil
                    })
                    : await api.post('academy-schedules', buildReplacementPayload(payload.dates[0]));
                if (!created?.success) {
                    r = created;
                } else {
                    const removed = await api.delete('academy-schedules/series', encodeURIComponent(seriesId));
                    if (!removed?.success) {
                        await api.delete('academy-schedules/series', encodeURIComponent(replacementSeriesId));
                        toast(removed?.message || removed?.error || '기존 시리즈 삭제에 실패해 변경을 취소했습니다.', 'error');
                        return;
                    }
                    r = created;
                }
            } else {
                r = await api.patch(`academy-schedules/series/${encodeURIComponent(seriesId)}`, body);
            }
        } else {
            r = await api.patch('academy-schedules/' + id, body);
        }

        if (r?.success) {
            toast('일정이 수정되었습니다.', 'success');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast(r?.message || r?.error || '일정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditUnifiedSchedule] failed:', e);
        toast('일정 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function handleEditGroupedExamSchedule(occurrenceIdsText) {
    const occurrenceIds = String(occurrenceIdsText || '').split(',').map(id => id.trim()).filter(Boolean);
    if (occurrenceIds.length < 2) return toast('기간 시험 전체 수정은 2개 이상의 날짜가 필요합니다.', 'error');

    const payload = collectUnifiedSchedulePayload('edit-sch');
    if (!payload || payload.kind !== 'exam') return;

    try {
        const r = await api.patch('exam-schedules/group', {
            occurrenceIds,
            schoolName: payload.schoolName,
            grade: payload.grade,
            examName: payload.title,
            startDate: payload.date,
            endDate: payload.endDate || payload.date,
            memo: payload.memo
        });

        if (r?.success) {
            toast('기간 시험을 수정하였습니다.', 'success');
            await loadData();
            openExamScheduleModal(state.ui?.examCalendarMonth || '');
            return;
        }

        toast(r?.message || r?.error || '기간 시험 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditGroupedExamSchedule] failed:', e);
        toast('기간 시험 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteGroupedExamSchedule(occurrenceIdsText) {
    const occurrenceIds = String(occurrenceIdsText || '').split(',').map(id => id.trim()).filter(Boolean);
    if (occurrenceIds.length < 2) return toast('기간 시험 전체 삭제는 2개 이상의 날짜가 필요합니다.', 'error');

    const item = getUnifiedExamGroupedItemByIds(occurrenceIds);
    const title = item ? [item.school_name, item.grade, item.title].filter(Boolean).join(' ') : '기간 시험';
    const rangeText = item ? getUnifiedScheduleDisplayDateText(item) : '';
    if (!confirm(`${title} ${rangeText} 전체 일정을 삭제할까요?\n이 작업은 기간 내의 모든 날짜 시험 일정을 삭제합니다.`)) return;

    try {
        const r = await api.post('exam-schedules/group-delete', { occurrenceIds });
        if (r?.success) {
            toast('기간 시험을 삭제하였습니다.', 'info');
            await loadData();
            openExamScheduleModal(state.ui?.examCalendarMonth || '');
            return;
        }

        toast(r?.message || r?.error || '기간 시험 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteGroupedExamSchedule] failed:', e);
        toast('기간 시험 삭제 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteUnifiedSchedule(kind, id, seriesId = '') {
    const scope = kind === 'exam' ? 'one' : getUnifiedScheduleMutationScope();
    const isSeriesDelete = scope === 'series' && seriesId;
    if (!confirm(isSeriesDelete ? '기간 전체 일정을 삭제하시겠습니까?' : '이 일정을 삭제하시겠습니까?')) return;

    try {
        const r = kind === 'exam'
            ? await api.delete('exam-schedules', id)
            : isSeriesDelete
                ? await api.delete('academy-schedules/series', encodeURIComponent(seriesId))
                : await api.delete('academy-schedules', id);
        if (r?.success) {
            toast('일정이 삭제되었습니다.', 'info');
            await loadData();
            openExamScheduleModal();
            return;
        }

        toast(r?.message || r?.error || '일정 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[deleteUnifiedSchedule] failed:', e);
        toast('일정 삭제 중 오류가 발생했습니다.', 'error');
    }
}

// ============================================================
// 구버전 함수명 호환
// ============================================================
async function addExamSchedule() {
    const payload = collectUnifiedSchedulePayload('new-sch');
    if (!payload || payload.kind !== 'exam') return addUnifiedSchedule();
    return addUnifiedSchedule();
}

async function deleteExamSchedule(id) {
    return deleteUnifiedSchedule('exam', id);
}

function openEditExamScheduleModal(id) {
    return openEditUnifiedScheduleModal('exam', id);
}

async function handleEditExamSchedule(id) {
    return handleEditUnifiedSchedule('exam', id);
}

async function addAcademySchedule() {
    return addUnifiedSchedule();
}

function openEditAcademyScheduleModal(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return openEditUnifiedScheduleModal(kind, id);
}

async function handleEditAcademySchedule(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return handleEditUnifiedSchedule(kind, id);
}

async function deleteAcademySchedule(id) {
    const s = (state.db.academy_schedules || []).find(x => String(x.id) === String(id));
    const kind = s && isClosedAcademySchedule(s) ? 'closed' : 'etc';
    return deleteUnifiedSchedule(kind, id);
}
