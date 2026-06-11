/**
 * AP Math OS 1.0 [js/dashboard.js]
 * 원장님·선생님별 대시보드 엔진
 * [Dashboard Polish]: 52px 카드 높이 통일, 상단 바로가기 탭형 배치, 오늘일지 제목 외부 배치
 * [Schedule/Memo]: 오늘일정·주간일정 관리 버튼 제거, 일정 행 52px 규격 통일
 * [Class Filter]: 학급관리 전체/중등/고등 탭 필터 유지
 * [Stability]: 공휴일/휴무일 감지, Safari 안전 날짜 파싱, 교사별 표시 범위 유지
 */

function copyPhoneNumber(text) {
    const value = String(text || '').trim();
    if (!value) return;

    const showCopied = () => toast('전화번호가 복사되었습니다.', 'info');
    const showCopyFailed = (err) => {
        console.warn('[AP Math OS] phone copy failed:', err);
        toast('복사 실패', 'warn');
    };
    const fallbackCopy = () => {
        const textarea = document.createElement('textarea');
        textarea.value = value;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '0';
        document.body.appendChild(textarea);
        textarea.select();

        let copied = false;
        try {
            copied = document.execCommand('copy');
        } catch (err) {
            document.body.removeChild(textarea);
            showCopyFailed(err);
            return;
        }

        document.body.removeChild(textarea);
        if (copied) showCopied();
        else showCopyFailed(new Error('fallback copy returned false'));
    };

    if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(value).then(showCopied).catch(fallbackCopy);
    } else {
        fallbackCopy();
    }
}

function apEscapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function apParseLocalDateTime(value) {
    const str = String(value || '').trim();
    if (!str) return null;

    const datePart = str.split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);

    if (parts.length !== 3) return null;

    const [y, m, d] = parts;
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

    const time = new Date(y, m - 1, d).getTime();
    return Number.isFinite(time) ? time : null;
}

function apFormatMonthDay(value) {
    const str = String(value || '').trim();
    const datePart = str.split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);

    if (parts.length !== 3) return '';

    const [, m, d] = parts;
    if (!Number.isFinite(m) || !Number.isFinite(d)) return '';

    return `${m}월 ${d}일`;
}

const DASH_HOLIDAYS = [
    '2026-01-01', '2026-02-16', '2026-02-17', '2026-02-18', '2026-03-01', '2026-03-02',
    '2026-05-01', '2026-05-05', '2026-05-24', '2026-05-25', '2026-06-06', '2026-07-17',
    '2026-08-15', '2026-08-17', '2026-09-24', '2026-09-25', '2026-09-26', '2026-10-03',
    '2026-10-05', '2026-10-09', '2026-12-25'
];

function isDashboardHoliday(dateStr) {
    if (DASH_HOLIDAYS.includes(dateStr)) return true;
    if (state.db.academy_schedules) {
        return state.db.academy_schedules.some(s =>
            String(s.is_deleted || 0) !== '1' &&
            s.schedule_date === dateStr &&
            s.schedule_type === 'closed' &&
            s.target_scope !== 'student'
        );
    }
    return false;
}

function isClassScheduledOnDateForDashboard(cid, dateStr) {
    const targetDateStr = String(dateStr || new Date().toLocaleDateString('sv-SE')).slice(0, 10);
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    if (!cls) return false;
    if (isDashboardHoliday(targetDateStr)) return false;

    const targetDate = dashboardDateFromLocalString(targetDateStr) || new Date();
    const targetKey = DASHBOARD_DAY_ORDER[targetDate.getDay()];
    const classDayKeys = dashboardGetClassDayKeys(cls);

    // 학급관리 활성 표시는 출결 기록이 아니라 실제 수업 요일만 기준으로 한다.
    // class_time_slots가 있으면 이를 우선하고, 없을 때만 classes의 요일 필드를 보조로 사용한다.
    if (!classDayKeys.length) return false;
    return classDayKeys.includes(targetKey);
}

function isClassScheduledTodayForDashboard(cid) {
    return isClassScheduledOnDateForDashboard(cid, new Date().toLocaleDateString('sv-SE'));
}

function isMiddleSchoolClass(c) {
    const gradeText = String(c?.grade || '');
    const nameText = String(c?.name || '');

    if (
        gradeText.startsWith('고') ||
        nameText.startsWith('고') ||
        nameText.includes('고1') ||
        nameText.includes('고2') ||
        nameText.includes('고3') ||
        nameText.includes('고등')
    ) return false;

    return true;
}

function isClassVisibleForCurrentTeacher(c) {
    if (!c) return false;

    if (state?.auth?.role === 'admin') return true;
    if (state?.ui?.viewScope === 'all') return true;

    const currentTeacher = typeof getTeacherNameForUI === 'function'
        ? getTeacherNameForUI()
        : (state?.ui?.userName || state?.auth?.name || '');

    const normalizedCurrent = String(currentTeacher || '')
        .replace(/\s*선생님\s*$/g, '')
        .trim();

    const normalizedClassTeacher = String(c.teacher_name || '')
        .replace(/\s*선생님\s*$/g, '')
        .trim();

    if (!normalizedClassTeacher) return true;

    return normalizedClassTeacher === normalizedCurrent;
}

// [5G] 관리필요(구 위험학생) 판정 알고리즘

// [Dashboard Ops] 일지 대상일·퇴근 마감·집중케어 공통 유틸
const DASHBOARD_JOURNAL_BASE_DAYS = ['wed', 'thu'];
const DASHBOARD_DAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DASHBOARD_DAY_LABELS = { sun: '일', mon: '월', tue: '화', wed: '수', thu: '목', fri: '금', sat: '토' };
const DASHBOARD_DAY_INDEX_TO_KEY = { 0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 7: 'sun' };

function dashboardEscapeAttr(value) {
    const jsSafe = String(value || '')
        .replace(/\\/g, '\\\\')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029')
        .replace(/'/g, "\\'");
    return jsSafe
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function dashboardDateFromLocalString(dateStr) {
    const parts = String(dateStr || '').split('-').map(Number);
    if (parts.length !== 3 || parts.some(v => !Number.isFinite(v))) return null;
    return new Date(parts[0], parts[1] - 1, parts[2]);
}

function dashboardDateStringFromDate(date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) return '';
    return date.toLocaleDateString('sv-SE');
}

function dashboardGetWeekDates(baseDateStr) {
    const base = dashboardDateFromLocalString(baseDateStr || new Date().toLocaleDateString('sv-SE')) || new Date();
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    start.setDate(start.getDate() - start.getDay());
    return DASHBOARD_DAY_ORDER.map((key, idx) => {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + idx);
        return { key, label: DASHBOARD_DAY_LABELS[key], date: dashboardDateStringFromDate(d), dayIndex: idx };
    });
}

function dashboardNormalizeTeacherName(name) {
    return String(name || '').replace(/\s*선생님\s*$/g, '').trim();
}

function dashboardAddDayKey(list, key) {
    const normalized = String(key || '').trim();
    if (DASHBOARD_DAY_ORDER.includes(normalized) && !list.includes(normalized)) list.push(normalized);
}

function dashboardParseDayKeysFromText(value, options = {}) {
    const source = String(value || '').trim();
    const days = [];
    if (!source) return days;

    const allowNumeric = options.allowNumeric !== false;
    const tokenMap = {
        sun: 'sun', sunday: 'sun', su: 'sun', 일: 'sun', 일요일: 'sun',
        mon: 'mon', monday: 'mon', m: 'mon', 월: 'mon', 월요일: 'mon',
        tue: 'tue', tuesday: 'tue', tu: 'tue', 화: 'tue', 화요일: 'tue',
        wed: 'wed', wednesday: 'wed', w: 'wed', 수: 'wed', 수요일: 'wed',
        thu: 'thu', thursday: 'thu', th: 'thu', 목: 'thu', 목요일: 'thu',
        fri: 'fri', friday: 'fri', f: 'fri', 금: 'fri', 금요일: 'fri',
        sat: 'sat', saturday: 'sat', sa: 'sat', 토: 'sat', 토요일: 'sat'
    };

    if (allowNumeric) {
        Object.assign(tokenMap, { '0': 'sun', '1': 'mon', '2': 'tue', '3': 'wed', '4': 'thu', '5': 'fri', '6': 'sat', '7': 'sun' });
    }

    const groupMap = {
        mwf: ['mon', 'wed', 'fri'],
        mtwthf: ['mon', 'tue', 'wed', 'thu', 'fri'],
        weekday: ['mon', 'tue', 'wed', 'thu', 'fri'],
        weekdays: ['mon', 'tue', 'wed', 'thu', 'fri'],
        ttf: ['tue', 'thu', 'fri'],
        tt: ['tue', 'thu'],
        weekend: ['sat', 'sun']
    };

    const compact = source.toLowerCase().replace(/\s+/g, '');
    if (groupMap[compact]) return [...groupMap[compact]];
    if (allowNumeric && options.allowNumericSequence === true && /^[0-7]+$/.test(compact)) {
        for (const ch of compact) dashboardAddDayKey(days, tokenMap[ch]);
        return days;
    }

    source.split(/[,/|·\s]+/).map(v => v.trim()).filter(Boolean).forEach(token => {
        const lower = token.toLowerCase();
        if (groupMap[lower]) groupMap[lower].forEach(day => dashboardAddDayKey(days, day));
        else dashboardAddDayKey(days, tokenMap[lower] || tokenMap[token]);
    });

    const koreanDayMap = { 일: 'sun', 월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat' };
    for (const ch of source) dashboardAddDayKey(days, koreanDayMap[ch]);
    return days;
}

function dashboardGetClassTimeSlotRows(cls) {
    const cid = String(cls?.id || '');
    if (!cid || !Array.isArray(state?.db?.class_time_slots)) return [];
    return state.db.class_time_slots.filter(slot => String(slot?.class_id || '') === cid);
}

function dashboardGetClassDayKeys(cls) {
    const days = [];
    const slotRows = dashboardGetClassTimeSlotRows(cls);

    if (slotRows.length) {
        slotRows.forEach(slot => {
            dashboardParseDayKeysFromText(slot?.day_of_week ?? slot?.day ?? slot?.weekday ?? '', { allowNumeric: true })
                .forEach(day => dashboardAddDayKey(days, day));
        });
        if (days.length) return DASHBOARD_DAY_ORDER.filter(day => days.includes(day));
    }

    dashboardParseDayKeysFromText(cls?.schedule_days, { allowNumeric: true, allowNumericSequence: true }).forEach(day => dashboardAddDayKey(days, day));
    dashboardParseDayKeysFromText(cls?.day_group, { allowNumeric: true }).forEach(day => dashboardAddDayKey(days, day));
    dashboardParseDayKeysFromText(cls?.time_label, { allowNumeric: false }).forEach(day => dashboardAddDayKey(days, day));
    return DASHBOARD_DAY_ORDER.filter(day => days.includes(day));
}

function dashboardGetTeacherClasses(teacherName = '') {
    const classes = state?.db?.classes || [];
    const target = dashboardNormalizeTeacherName(teacherName || state?.ui?.userName || state?.auth?.name || '');
    return classes.filter(c => {
        if (Number(c?.is_active) === 0) return false;
        if (!target) return isClassVisibleForCurrentTeacher(c);
        const classTeacher = dashboardNormalizeTeacherName(c?.teacher_name || '');
        return classTeacher === target;
    });
}

function dashboardGetJournalTargetDayKeys(teacherName = '', classRows = null) {
    // AP Math 운영 기준: 대시보드 일지 확인은 수/목 2일만 본다.
    // 실제 수업 요일 예외를 섞으면 선생님 현황 카드가 다시 경고판처럼 복잡해지므로 추가하지 않는다.
    return DASHBOARD_DAY_ORDER.filter(day => DASHBOARD_JOURNAL_BASE_DAYS.includes(day));
}

function dashboardFindJournal(dateStr, teacherName = '') {
    const targetTeacher = dashboardNormalizeTeacherName(teacherName || state?.ui?.userName || state?.auth?.name || '');
    return (state?.db?.journals || []).find(j => {
        const sameDate = String(j?.date || '') === String(dateStr || '');
        if (!sameDate) return false;
        if (!targetTeacher) return true;
        return dashboardNormalizeTeacherName(j?.teacher_name || '') === targetTeacher;
    });
}

function dashboardIsJournalDone(journal) {
    const status = String(journal?.status || '').trim();
    if (!journal) return false;
    return status === '제출완료' || status === '결재완료' || !!String(journal?.content || '').trim();
}

function openDashboardArchiveWindow(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const url = '../archive/index';
    window.open(url, '_blank', 'noopener');
}

function openAdminAssessmentArchiveWindow(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const url = '../archive/assessment/assessment-mvp.html';
    window.open(url, '_blank', 'noopener');
}

function renderDashboardJournalWeekMatrix(teacherName = '', baseDateStr = null, classRows = null) {
    injectDashboardOpsStyles();
    const week = dashboardGetWeekDates(baseDateStr || new Date().toLocaleDateString('sv-SE'));
    const targetDays = dashboardGetJournalTargetDayKeys(teacherName, classRows);
    const safeTeacher = dashboardEscapeAttr(teacherName || state?.ui?.userName || '');
    const cells = week
        .filter(day => targetDays.includes(day.key))
        .map(day => {
            const journal = dashboardFindJournal(day.date, teacherName);
            const done = dashboardIsJournalDone(journal);
            const holiday = isDashboardHoliday(day.date);
            const statusText = done ? '제출완료' : (holiday ? '휴무' : '미작성');
            const click = teacherName
                ? `renderAdminJournalList('${day.date}', '${safeTeacher}')`
                : `openDailyJournalModal('${day.date}')`;
            const labelText = `${day.label} ${apFormatMonthDay(day.date) || day.date}`;
            const ariaText = `${labelText} ${statusText} 일지 열기`;
            // D. 미작성 행 = 좌측 보더 액센트(status-pending) + 즉시 작성 버튼. 제출완료/휴무는 배지만.
            const isPending = !done && !holiday;
            const badgeClass = done ? 'ap-badge--complete' : (holiday ? 'ap-badge--holiday' : 'ap-badge--pending');
            const right = (isPending && !teacherName)
                ? `<div style="display:flex; gap:8px; align-items:center;">
                       <span class="ap-badge ${badgeClass}">${apEscapeHtml(statusText)}</span>
                       <button type="button" class="ap-inline-btn" onclick="event.stopPropagation(); ${click}">일지 작성</button>
                   </div>`
                : `<span class="ap-badge ${badgeClass}">${apEscapeHtml(statusText)}</span>`;
            return `
                <div class="ap-list-row${isPending ? ' status-pending' : ''}" style="cursor:pointer;" onclick="event.stopPropagation(); ${click}" role="button" tabindex="0" aria-label="${apEscapeHtml(ariaText)}">
                    <span style="font-size:13px; font-weight:400; white-space:nowrap; color:var(--text);">${apEscapeHtml(labelText)}</span>
                    ${right}
                </div>
            `;
        }).join('');

    if (!cells.trim()) {
        return `<div class="journal-matrix journal-matrix--empty" style="display:flex; min-height:50px; align-items:center; justify-content:center; border-radius:6px; border:1px solid var(--border); background:var(--surface);"><span class="journal-matrix__empty" style="color:var(--secondary); font-size:13px; font-weight:600;">이번 주 작성 대상일이 없습니다.</span></div>`;
    }
    return `<div class="journal-matrix" data-teacher="${apEscapeHtml(teacherName || '')}" style="display:flex; flex-direction:column; gap:8px;">${cells}</div>`;
}

function dashboardGetStudentClassInfo(studentId) {
    const classStudents = state?.db?.class_students || [];
    const classes = state?.db?.classes || [];
    const map = classStudents.find(m => String(m?.student_id) === String(studentId));
    const cls = classes.find(c => String(c?.id) === String(map?.class_id || '')) || null;
    return { classId: map?.class_id || '', className: cls?.name || '미배정', cls };
}

function dashboardGroupByClass(items) {
    return (items || []).reduce((acc, item) => {
        const key = item?.className || '미배정';
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}

function dashboardHasMakeupAfter(studentId, dateStr) {
    const sid = String(studentId || '');
    const start = String(dateStr || '').slice(0, 10);
    if (!sid || !start) return false;

    const hasAttendanceMakeup = (state?.db?.attendance_history || state?.db?.attendance || []).some(a => {
        if (String(a?.student_id || '') !== sid) return false;
        const date = String(a?.date || '').slice(0, 10);
        if (!date || date < start) return false;
        const hay = `${a?.status || ''} ${a?.tags || ''} ${a?.memo || ''}`;
        return hay.includes('보강');
    });
    if (hasAttendanceMakeup) return true;

    return (state?.db?.academy_schedules || []).some(s => {
        if (String(s?.is_deleted || 0) === '1') return false;
        if (String(s?.student_id || '') !== sid) return false;
        const date = String(s?.schedule_date || '').slice(0, 10);
        if (!date || date < start) return false;
        const hay = `${s?.schedule_type || ''} ${s?.title || ''} ${s?.memo || ''}`;
        return hay.includes('보강') || /makeup/i.test(hay);
    });
}

function dashboardHasConsultationAfter(studentId, dateStr) {
    const sid = String(studentId || '');
    const start = String(dateStr || '').slice(0, 10);
    if (!sid || !start) return false;
    return (state?.db?.consultations || []).some(c => {
        if (String(c?.student_id || '') !== sid) return false;
        const date = String(c?.date || c?.consultation_date || c?.created_at || '').slice(0, 10);
        return !!date && date >= start;
    });
}

function dashboardGetClassProgressRecord(classId, dateStr) {
    return (state?.db?.class_daily_records || []).find(r => String(r?.class_id || '') === String(classId) && String(r?.date || '') === String(dateStr));
}

function dashboardGetScheduledClassesForDate(dateStr, teacherName = '') {
    const dateObj = dashboardDateFromLocalString(dateStr);
    const dayKey = dateObj ? DASHBOARD_DAY_INDEX_TO_KEY[dateObj.getDay()] : '';
    const dayIdx = dateObj ? String(dateObj.getDay()) : '';
    const targetTeacher = dashboardNormalizeTeacherName(teacherName || state?.ui?.userName || state?.auth?.name || '');
    return (state?.db?.classes || []).filter(cls => {
        if (Number(cls?.is_active) === 0) return false;
        if (!isClassVisibleForCurrentTeacher(cls) && !targetTeacher) return false;
        if (targetTeacher && dashboardNormalizeTeacherName(cls?.teacher_name || '') !== targetTeacher) return false;
        const keys = dashboardGetClassDayKeys(cls);
        if (keys.length) return keys.includes(dayKey);
        if (cls?.schedule_days) return String(cls.schedule_days).split(',').map(v => v.trim()).includes(dayIdx);
        return false;
    });
}

function renderJournalDraftPreview(dateStr) {
    return `
        <div class="journal-draft journal-draft--simple">
            <pre class="journal-draft__plain">${apEscapeHtml(buildJournalContent(dateStr))}</pre>
        </div>
    `;
}

function injectDashboardOpsStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('dashboard-foundation-css')) return;
    if (document.querySelector('link[href$="dashboard-foundation.css"]')) return;

    const link = document.createElement('link');
    link.id = 'dashboard-foundation-css';
    link.rel = 'stylesheet';
    link.href = './css/dashboard-foundation.css';
    document.head.appendChild(link);
}

/* ============================================================
 * [REDESIGN] 선생님 대시보드 리디자인 (확정안 A~H)
 * - 스펙의 하드코딩 hex → 디자인 토큰(var(--*)) 매핑
 * - 이모지 → 인라인 SVG (currentColor, 외부 의존성 없음)
 * ============================================================ */
function injectDashboardRedesignStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('dashboard-redesign-css')) return;
    const style = document.createElement('style');
    style.id = 'dashboard-redesign-css';
    style.textContent = `
    body.ap-teacher-dashboard-mode main#app-root {
        width:100% !important;
        max-width:none !important;
        padding-left:clamp(18px, 3vw, 48px) !important;
        padding-right:clamp(18px, 3vw, 48px) !important;
        box-sizing:border-box;
    }
    .ap-dash-redesign { width:100%; max-width:100%; padding:0 0 24px; box-sizing:border-box; }
    @media (max-width:640px){
        body.ap-teacher-dashboard-mode main#app-root { padding-left:14px !important; padding-right:14px !important; }
        .ap-dash-redesign{ padding-bottom:16px; }
    }

    /* B. 상단 요약 카드: 이동 기능 없이 상태만 표시 */
    .ap-metric-container { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:16px; margin-bottom:24px; }
    @media (max-width:760px){ .ap-metric-container{ grid-template-columns:1fr; gap:10px; margin-bottom:16px; } }
    .ap-metric-card { background:var(--surface); border:1px solid var(--border); border-radius:8px; padding:14px 18px; transition:border-color .2s ease, box-shadow .2s ease; }
    .ap-metric-card--summary { cursor:default; }
    .ap-metric-card--attention { border-left:3px solid var(--warning); }
    .ap-metric-label { font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:4px; line-height:1.3; }
    .ap-metric-value { font-size:20px; font-weight:700; color:var(--text); line-height:1.25; }
    .ap-metric-value--split { font-size:18px; }
    .ap-metric-sub { margin-top:3px; font-size:12px; font-weight:500; color:var(--secondary); line-height:1.35; }

    /* A. 8:4 대시보드 그리드 */
    .ap-dash-grid { display:grid; grid-template-columns:1fr; gap:24px; }
    @media (min-width:1024px){
        .ap-dash-grid { grid-template-columns:repeat(12,minmax(0,1fr)); align-items:start; }
        .ap-dash-main { grid-column:span 8 / span 8; min-width:0; }
        .ap-dash-side { grid-column:span 4 / span 4; min-width:0; }
    }

    /* C. 카드 / 리스트 간격 통일 */
    .ap-dash-card { background:var(--surface); border:1px solid var(--border); border-radius:6px; padding:20px 24px; margin-bottom:24px; }
    .ap-dash-card:last-child { margin-bottom:0; }
    .ap-dash-card__title { margin:0 0 12px; font-size:15px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px; line-height:1.35; }
    .ap-list-row { display:flex; justify-content:space-between; align-items:center; gap:8px; padding:12px 16px; background:var(--surface); border:1px solid var(--border); border-radius:4px; margin-bottom:8px; box-sizing:border-box; font-size:13px; font-weight:500; line-height:1.35; }
    .ap-list-row:last-child { margin-bottom:0; }
    .ap-dash-redesign .ap-dashboard-class-list .ap-class-row__name { font-size:14px; font-weight:600; }
    .ap-dash-redesign .ap-dashboard-class-list .ap-class-row__meta { font-size:13px; font-weight:500; }
    .ap-dash-redesign .ap-class-chip { font-size:12px; font-weight:500; }

    /* D. 오늘일지 미작성 행 — border / border-left 분리 선언 */
    .ap-list-row.status-pending {
        border:1px solid color-mix(in srgb, var(--danger) 35%, var(--border));
        border-left:3px solid var(--danger);
        background:color-mix(in srgb, var(--danger) 8%, var(--surface));
    }
    .ap-badge { font-size:12px; font-weight:500; padding:3px 8px; border-radius:999px; white-space:nowrap; }
    .ap-badge--complete { color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); }
    .ap-badge--pending { color:var(--danger); background:color-mix(in srgb, var(--danger) 12%, var(--surface)); border:1px solid color-mix(in srgb, var(--danger) 30%, var(--border)); }
    .ap-badge--holiday { color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); }
    .ap-inline-btn { font-size:12px; font-weight:600; padding:6px 12px; border-radius:6px; border:1px solid var(--danger); background:var(--danger); color:#fff; cursor:pointer; white-space:nowrap; }
    .ap-inline-btn--ghost { background:var(--surface); color:var(--primary); border:1px solid var(--border); }

    /* F. 오늘일정 빈 상태 + 인라인 폼 */
    .ap-empty-state { display:flex; flex-direction:row; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; min-height:42px; text-align:left; color:var(--secondary); border:1px solid var(--border); border-radius:6px; background:var(--surface); box-sizing:border-box; }
    .ap-empty-state p { margin:0; font-size:13px; font-weight:500; line-height:1.3; }
    .ap-empty-state .ap-empty-icon { display:none; }
    .ap-inline-form { display:flex; flex-wrap:wrap; gap:8px; margin-top:12px; }
    .ap-inline-form input { flex:1 1 120px; min-width:0; height:38px; padding:0 12px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text); font-size:13px; box-sizing:border-box; }
    .ap-inline-form input[type="date"] { flex:0 0 auto; }

    /* G. 주간일정 2단 스플릿 */
    .ap-weekly-split { display:grid; grid-template-columns:1fr; gap:16px; }
    @media (min-width:640px){ .ap-weekly-split { grid-template-columns:1fr 1fr; } }
    .ap-split-cell { min-width:0; }
    .ap-split-label { font-size:12px; font-weight:600; color:var(--secondary); margin:0 0 8px; }
    .ap-split-cell p { margin:0 0 4px; font-size:13px; font-weight:500; color:var(--text); display:flex; align-items:center; gap:6px; }
    .ap-split-cell .ap-split-meta { font-size:12px; font-weight:500; color:var(--secondary); }
    .ap-empty-notice { font-size:13px; font-weight:500; color:var(--secondary); }

    /* 오른쪽 하단 이동 버튼 */
    .ap-dash-quick-panel { margin-top:16px; padding:0; background:transparent; border:none; box-shadow:none; }
    .ap-dash-quick-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
    .ap-dash-quick-card { min-width:0; height:auto; min-height:64px; padding:14px 10px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); cursor:pointer; text-align:center; display:flex; align-items:center; justify-content:center; transition:border-color .18s ease, background .18s ease; box-sizing:border-box; }
    .ap-dash-quick-card:hover { border-color:var(--primary); background:var(--surface-2); }
    .ap-dash-quick-title { font-size:14px; font-weight:600; line-height:1.25; }
    @media (max-width:420px){ .ap-dash-quick-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; } .ap-dash-quick-card { min-height:48px; padding:10px 6px; } .ap-dash-quick-title { font-size:12px; font-weight:600; } }
    `;
    document.head.appendChild(style);
}

// H. 인라인 SVG 아이콘 (이모지 전면 제거). currentColor 상속.
function apDashIcon(name, size = 16) {
    const a = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0; vertical-align:middle;"`;
    const paths = {
        // ti ti-calendar
        calendar: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 11h16"/>',
        // ti ti-tools
        tools: '<path d="M3 21h4L20 8a1.5 1.5 0 0 0-4-4L3 17v4"/><path d="M14.5 5.5l4 4"/><path d="M12 8l-5-5-3 3 5 5"/>',
        // ti ti-speakerphone
        speakerphone: '<path d="M18 8a3 3 0 0 1 0 6"/><path d="M10 8v8H7l-3-3v-2l3-3h3z"/><path d="M10 8l8-3v14l-8-3"/>'
    };
    return `<svg ${a} aria-hidden="true">${paths[name] || ''}</svg>`;
}

// B. "미작성 일지" 메트릭: 이번 주 작성 대상일 중 미작성(휴무 제외) 건수
function computeMissingJournalCount(teacherName = '') {
    try {
        const week = dashboardGetWeekDates(new Date().toLocaleDateString('sv-SE'));
        const targetDays = dashboardGetJournalTargetDayKeys(teacherName);
        return week
            .filter(day => targetDays.includes(day.key))
            .filter(day => {
                const journal = dashboardFindJournal(day.date, teacherName);
                if (dashboardIsJournalDone(journal)) return false;
                if (isDashboardHoliday(day.date)) return false;
                return true;
            }).length;
    } catch (e) {
        return 0;
    }
}

// F. 오늘일정 인라인 폼 토글 / 저장
function apDashToggleScheduleForm(btn) {
    const form = document.getElementById('ap-dash-inline-form');
    if (!form) return;
    const open = form.style.display === 'none' || !form.style.display;
    form.style.display = open ? 'flex' : 'none';
    if (btn) btn.textContent = open ? '닫기' : '+ 일정 추가';
    if (open) {
        const c = document.getElementById('ap-dash-inline-content');
        if (c) c.focus();
    }
}

async function apDashSaveInlineSchedule() {
    const dateEl = document.getElementById('ap-dash-inline-date');
    const contentEl = document.getElementById('ap-dash-inline-content');
    const d = dateEl?.value || new Date().toLocaleDateString('sv-SE');
    const c = (contentEl?.value || '').trim();
    if (!c) { toast('일정 내용을 입력하세요', 'warn'); return; }
    try {
        const r = await api.post('operation-memos', { memoDate: d, content: c, isPinned: false });
        if (r?.success) {
            toast('일정이 저장되었습니다.', 'success');
            await loadData();
            renderDashboard();
            return;
        }
        toast(r?.message || r?.error || '일정 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[apDashSaveInlineSchedule] failed:', e);
        toast('일정 저장 중 오류가 발생했습니다.', 'error');
    }
}

function computeRiskStudents() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    if (todayTime === null) return [];

    const active = (state?.db?.students || []).filter(s => String(s?.status || '') === '재원');
    const attendanceHistory = state?.db?.attendance_history || [];
    const homeworkHistory = state?.db?.homework_history || [];
    const consultations = state?.db?.consultations || [];
    const classStudents = state?.db?.class_students || [];
    const classes = state?.db?.classes || [];

    const classById = typeof apmsGetDataIndexes === 'function'
        ? apmsGetDataIndexes().classesById
        : new Map(classes.map(c => [String(c.id), c]));
    const classMapByStudentId = typeof apmsGetDataIndexes === 'function'
        ? apmsGetDataIndexes().classStudentByStudentId
        : new Map(classStudents.map(m => [String(m.student_id), m]));

    const LOOKBACK_DAYS = 14;
    const cutoffTime = todayTime - (LOOKBACK_DAYS - 1) * 24 * 60 * 60 * 1000;
    const recentAlertCutoff = todayTime - 3 * 24 * 60 * 60 * 1000;

    const countMapByStudent = (rows, matcher) => {
        const map = new Map();
        rows.forEach(row => {
            const sid = String(row?.student_id || '');
            if (!sid || !matcher(row)) return;
            const t = apParseLocalDateTime(row.date || row.created_at || row.updated_at);
            if (t === null || t < cutoffTime || t > todayTime) return;
            const cur = map.get(sid) || { count: 0, recent: 0 };
            cur.count += 1;
            if (t >= recentAlertCutoff) cur.recent += 1;
            map.set(sid, cur);
        });
        return map;
    };

    const absenceMap = countMapByStudent(attendanceHistory, row => String(row?.status || '').trim() === '결석');
    const homeworkMissMap = countMapByStudent(homeworkHistory, row => String(row?.status || '').trim() === '미완료');
    const makeupMap = countMapByStudent(attendanceHistory, row => {
        const hay = `${row?.status || ''} ${row?.tags || ''} ${row?.memo || ''}`;
        return hay.includes('보강');
    });

    const consultationMap = new Map();
    consultations.forEach(row => {
        const sid = String(row?.student_id || '');
        if (!sid) return;
        const dateText = String(row?.date || row?.consultation_date || row?.created_at || '').slice(0, 10);
        const t = apParseLocalDateTime(dateText);
        if (t === null || t < cutoffTime || t > todayTime) return;
        const cur = consultationMap.get(sid) || { count: 0, recent: 0 };
        cur.count += 1;
        if (t >= recentAlertCutoff) cur.recent += 1;
        consultationMap.set(sid, cur);
    });

    const risks = [];
    const clearedCareLogs = [];

    active.forEach(s => {
        const sid = String(s?.id || '');
        if (!sid) return;

        const absences = absenceMap.get(sid) || { count: 0, recent: 0 };
        const hwMisses = homeworkMissMap.get(sid) || { count: 0, recent: 0 };
        const makeups = makeupMap.get(sid) || { count: 0, recent: 0 };
        const studentConsults = consultationMap.get(sid) || { count: 0, recent: 0 };

        const baseReasons = [];
        const offsetReasons = [];
        let internalScore = 50;

        if (absences.count > 0) {
            internalScore += absences.count * 20;
            baseReasons.push(`최근 14일 결석 ${absences.count}회`);
        }
        if (hwMisses.count > 0) {
            internalScore += hwMisses.count * 10;
            baseReasons.push(`최근 14일 숙제 미완료 ${hwMisses.count}회`);
        }

        const beforeOffsetScore = internalScore;

        if (makeups.count > 0) {
            internalScore -= makeups.count * 20;
            offsetReasons.push(`보강 ${makeups.count}회`);
        }
        if (studentConsults.count > 0) {
            internalScore -= studentConsults.count * 30;
            offsetReasons.push(`상담 ${studentConsults.count}회`);
        }

        internalScore = Math.max(50, Math.min(150, internalScore));
        const displayScore = internalScore - 50;

        if (!baseReasons.length) return;

        const cId = classMapByStudentId.get(sid)?.class_id;
        const cName = classById.get(String(cId || ''))?.name || '미배정';
        const recentNegative = absences.recent + hwMisses.recent;
        const recentPositive = makeups.recent + studentConsults.recent;
        let trend = '▬';
        if (recentNegative > recentPositive) trend = '▲';
        else if (recentPositive > recentNegative) trend = '▼';

        if (displayScore <= 0) {
            clearedCareLogs.push({
                student_id: sid,
                student_name: s.name || '',
                class_name: cName,
                base_reasons: baseReasons,
                offset_reasons: offsetReasons,
                internal_score_before_offset: beforeOffsetScore,
                internal_score_after_offset: internalScore,
                display_score_after_offset: displayScore,
                cleared_at: new Date().toISOString(),
                summary: `${s.name || '학생'}: ${baseReasons.join(' · ')} → ${offsetReasons.join(' · ') || '후속 조치'}로 해소`
            });
            return;
        }

        const riskTypes = ['집중케어'];
        if (absences.count > 0) riskTypes.push('출결주의');
        if (hwMisses.count > 0) riskTypes.push('숙제주의');

        risks.push({
            student: s,
            className: cName,
            riskTypes: [...new Set(riskTypes)],
            reasons: [`${baseReasons.join(' · ')}${offsetReasons.length ? ` / 상쇄: ${offsetReasons.join(' · ')}` : ''} (위험지수: ${displayScore}점)`],
            scoreSummary: '',
            absenceCount: absences.count,
            hwMissCount: hwMisses.count,
            riskScore: displayScore,
            trend,
            offsetReasons
        });
    });

    if (!state.dashboard) state.dashboard = {};
    state.dashboard.clearedCareLogs = clearedCareLogs;
    state.dashboardClearedCareLogs = clearedCareLogs;

    return risks.sort((a, b) => Number(b.riskScore || 0) - Number(a.riskScore || 0));
}


// [Final Fix] 관리 메뉴 퇴원생 버튼과 연동
function openDischargedStudents() {
    openAdminStudentList('discharged');
}

function openRiskStudentReport(studentId) {
    const risks = typeof computeRiskStudents === 'function' ? computeRiskStudents() : [];
    const risk = risks.find(r => String(r.student?.id) === String(studentId));
    if (typeof openStudentReportModal === 'function') {
        openStudentReportModal(studentId, { riskInfo: risk || null, title: '관리필요 학생 문구 생성' });
        return;
    }
    toast('보고 문구 모듈을 불러오지 못했습니다.', 'warn');
}

async function restoreDischargedStudent(sid) {
    if (!confirm('이 학생을 재원으로 복구하시겠습니까?')) return;
    const r = await api.patch(`students/${sid}/restore`, {});
    if (r?.success) { await loadData(); openAdminStudentList('discharged'); }
    else toast(r?.message || r?.error || '복구에 실패했습니다.', 'error');
}

async function hideDischargedStudent(sid) {
    if (!confirm('퇴원생 목록에서 숨길까요?')) return;
    const r = await api.patch(`students/${sid}/hide`, {});
    if (r?.success) { await loadData(); openAdminStudentList('discharged'); }
    else toast(r?.message || r?.error || '목록숨김 처리에 실패했습니다.', 'error');
}

async function purgeHiddenStudent(sid) {
    if (!sid) return;
    const first = confirm('이 숨김 학생을 DB에서 완전 삭제할까요?');
    if (!first) return;
    const second = confirm('완전 삭제는 중복 생성된 학생 정리용입니다. 삭제 후 복구할 수 없습니다. 계속할까요?');
    if (!second) return;
    const r = await api.delete('students', `${sid}/purge`);
    if (r?.success) {
        toast('숨김 학생이 완전 삭제되었습니다.', 'info');
        await loadData();
        openAdminStudentList('hidden');
        return;
    }
    toast(r?.message || r?.error || '완전 삭제에 실패했습니다.', 'error');
}

function openAdminStudentList(type) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    let list = [], title = "";

    if (type === 'active') { 
        list = state.db.students.filter(s => adminNormalizeStatus(s.status) === '재원'); 
        title = "재원생 목록"; 
    } else if (type === 'new') { 
        list = state.db.students.filter(s => { 
            if (adminNormalizeStatus(s.status) !== '재원' || !s.created_at || todayTime === null) return false; 
            const createdTime = apParseLocalDateTime(s.created_at);
            if (createdTime === null) return false;
            return (todayTime - createdTime) / (1000*3600*24) <= 60;
        });
        title = "최근 등록 원생"; 
    } else if (type === 'discharged') { 
        list = state.db.students.filter(s => adminNormalizeStatus(s.status) === '제적'); 
        title = "퇴원생 목록"; 
    } else if (type === 'hidden') {
        list = state.db.students.filter(s => adminNormalizeStatus(s.status) === '숨김');
        title = "숨김 학생";
    } else if (type === 'risk') { 
        list = computeRiskStudents().map(r => ({ ...r.student, riskInfo: r })); 
        title = "관리필요 학생"; 
    }

    const rows = list.map(s => {
        const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
        let riskDetails = "";
        if (s.riskInfo) { riskDetails = `<div style="font-size:11px; color:var(--error); margin-top:6px; background:rgba(var(--error-rgb),0.10); padding:6px 8px; border-radius:6px; font-weight:600;">상태: ${s.riskInfo.riskTypes.join(', ')} <span style="opacity:0.7; font-weight:normal;">(${s.riskInfo.reasons.join(' · ')})</span></div>`; }
        const actionButtons = type === 'hidden'
            ? `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn btn-primary" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; box-shadow:none; cursor:pointer;" onclick="restoreDischargedStudent('${s.id}')">복구</button>
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; color:var(--error); background:rgba(var(--error-rgb),0.08); border:1px solid rgba(var(--error-rgb),0.16); cursor:pointer;" onclick="purgeHiddenStudent('${s.id}')">완전 삭제</button>
                </div>
            `
            : type === 'discharged'
            ? `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none; cursor:pointer;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</button>
                    <button class="btn btn-primary" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; box-shadow:none; cursor:pointer;" onclick="restoreDischargedStudent('${s.id}')">복구</button>
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); color:var(--secondary); border:1px solid var(--border); cursor:pointer;" onclick="hideDischargedStudent('${s.id}')">목록숨김</button>
                </div>
            `
            : `<button class="btn" style="padding:8px 12px; font-size:12px; font-weight:500; border-radius:8px; background:var(--surface-2); border:none;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</button>`;
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
                <div style="flex:1; padding-right:12px;">
                    <div style="font-weight:500; font-size:14px; color:var(--text);">${apEscapeHtml(s.name)} <span style="font-size:12px; color:var(--secondary); font-weight:400; margin-left:4px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <div style="font-size:12px; color:var(--text); font-weight:500; margin-top:4px;">${apEscapeHtml(cName)} <span style="color:var(--secondary); font-weight:500;">| ${apEscapeHtml(s.status)} ${s.created_at ? `| 등록: ${s.created_at.split(' ')[0]}` : ''}</span></div>
                    ${riskDetails}
                </div>
                ${actionButtons}
            </div>
        `;
    }).join('');

    const hiddenSwitch = (type === 'discharged' || type === 'hidden') ? `
        <div style="display:flex; gap:8px; margin:-4px -4px 12px;">
            <button class="btn ${type === 'discharged' ? 'btn-primary' : ''}" style="flex:1; min-height:38px; font-size:12px; font-weight:500; border-radius:12px;" onclick="openAdminStudentList('discharged')">퇴원생</button>
            <button class="btn ${type === 'hidden' ? 'btn-primary' : ''}" style="flex:1; min-height:38px; font-size:12px; font-weight:500; border-radius:12px;" onclick="openAdminStudentList('hidden')">숨김 학생</button>
        </div>
    ` : '';
    const gradeSummary = (type === 'discharged' || type === 'active' || type === 'new') ? adminRenderStudentGradeSummary(list) : '';
    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${hiddenSwitch}${gradeSummary}${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:400;">조회 대상이 없습니다.</div>`}</div>`);
}


function openAdminOperationMenu() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const isAdmin = String(state?.auth?.role || '') === 'admin';
    const showBillingAccountingFoundationEntry = false;
    const cardStyle = 'padding:16px; border:1px solid var(--border); border-radius:16px; background:var(--surface); text-align:left; cursor:pointer; box-shadow:none; min-height:92px; align-items:flex-start; justify-content:flex-start; flex-direction:column; gap:6px;';
    const titleStyle = 'font-size:14px; font-weight:500; color:var(--text); line-height:1.35;';
    const descStyle = 'font-size:12px; font-weight:500; color:var(--secondary); line-height:1.5; margin-top:4px;';

    showModal('관리', `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;">
            <button class="btn" style="${cardStyle}" onclick="openAdminTeacherAccountManage()">
                <div style="${titleStyle}">선생님 계정</div>
                <div style="${descStyle}">선생님 계정 생성, 권한 수정, 비밀번호 초기화</div>
            </button>
            <button class="btn" style="${cardStyle}" onclick="renderAdminJournalList('${todayStr}')">
                <div style="${titleStyle}">일지 확인</div>
                <div style="${descStyle}">제출된 일지를 날짜별로 확인하고 피드백 작성</div>
            </button>
            <button class="btn" style="${cardStyle}" onclick="openAdminStudentList('discharged')">
                <div style="${titleStyle}">퇴원생 관리</div>
                <div style="${descStyle}">퇴원/숨김 학생 조회, 복구, 중복 생성 정리</div>
            </button>
            ${isAdmin && showBillingAccountingFoundationEntry ? `
            <button class="btn" style="${cardStyle}" onclick="if(typeof openBillingAccountingFoundationModal==='function') openBillingAccountingFoundationModal(); else toast('수납·출납 foundation 화면을 불러오지 못했습니다.', 'warn');">
                <div style="${titleStyle}">수납·출납 foundation</div>
                <div style="${descStyle}">결제수단, 수납 정책, 요약, 조회 목록 확인</div>
            </button>
            ` : ''}
        </div>
        <div class="ap-soft-note" style="margin-top:14px; padding:12px 14px;">
            반 담당 변경과 담임 일괄 변경은 Worker 구조분리 이후 별도 연결합니다.
        </div>
    `);
}

function openAdminPinBatchModal() {
    const activeStudents = (state.db.students || []).filter(s => String(s.status || '재원') === '재원');
    const missingPins = activeStudents.filter(s => !String(s.student_pin || '').trim());

    const gradeOrder = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const gradeCounts = gradeOrder
        .map(grade => {
            const total = activeStudents.filter(s => String(s.grade || '').includes(grade)).length;
            const missing = missingPins.filter(s => String(s.grade || '').includes(grade)).length;
            return { grade, total, missing };
        })
        .filter(row => row.total > 0 || row.missing > 0);

    const gradeHtml = gradeCounts.map(row => `
        <div style="display:flex; justify-content:space-between; align-items:center; min-height:32px; padding:6px 0; border-bottom:1px solid var(--border);">
            <span style="font-size:13px; font-weight:500; color:var(--text);">${apEscapeHtml(row.grade)}</span>
            <span style="font-size:12px; font-weight:500; color:var(--secondary);">미발급 ${row.missing}명 / 재원 ${row.total}명</span>
        </div>
    `).join('');

    showModal('PIN 생성', `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div class="ap-soft-note" style="padding:12px 14px;">
                PIN 없는 재원생에게만 학년 규칙에 맞춰 번호를 부여합니다. 기존 PIN은 바뀌지 않습니다.
            </div>

            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:10px; margin-bottom:10px;">
                    <div>
                        <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.35;">미발급 PIN</div>
                        <div style="font-size:12px; font-weight:500; color:var(--secondary); line-height:1.45; margin-top:2px;">대상 ${missingPins.length}명 / 재원 ${activeStudents.length}명</div>
                    </div>
                    <div style="font-size:20px; font-weight:500; color:var(--text); line-height:1;">${missingPins.length}</div>
                </div>
                <button class="btn btn-primary" style="width:100%; min-height:52px; border-radius:14px; font-size:14px; font-weight:500; box-shadow:none;" onclick="handleAdminBatchGeneratePins()" ${missingPins.length ? '' : 'disabled'}>
                    미발급 PIN 생성
                </button>
            </div>

            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:12px 14px;">
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:6px;">학년별 현황</div>
                ${gradeHtml || `<div style="font-size:13px; color:var(--secondary); font-weight:500; text-align:center; padding:16px 0;">재원생 정보가 없습니다.</div>`}
            </div>
        </div>
    `);
}

function getAdminClassGradeRank(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

async function handleAdminBatchGeneratePins() {
    const activeStudents = (state.db.students || []).filter(s => String(s.status || '재원') === '재원');
    const missingPins = activeStudents.filter(s => !String(s.student_pin || '').trim());

    if (!missingPins.length) {
        toast('PIN 미발급 학생이 없습니다.', 'info');
        return;
    }

    if (!confirm(`PIN 없는 학생 ${missingPins.length}명에게 번호를 생성할까요?\n기존 PIN은 바뀌지 않습니다.`)) return;

    try {
        const r = await api.post('students/batch-pins', {});
        if (r?.success) {
            toast(`PIN ${r.count || 0}개 생성 완료`, 'success');
            await loadData();
            openAdminPinBatchModal();
            return;
        }
        toast(r?.message || r?.error || 'PIN 생성에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminBatchGeneratePins] failed:', e);
        toast('PIN 생성 중 오류가 발생했습니다.', 'error');
    }
}

function getAdminTeacherRows() {
    return Array.isArray(state?.ui?.adminTeacherRows) ? state.ui.adminTeacherRows : [];
}

function adminTeacherRoleLabel(role) {
    return String(role || '') === 'admin' ? '원장' : '선생님';
}

async function openAdminTeacherAccountManage() {
    showModal('선생님 계정', `<div style="text-align:center; padding:36px; color:var(--secondary); font-size:13px; font-weight:500;">선생님 계정을 불러오는 중입니다.</div>`);

    try {
        const data = await api.get('teachers');
        if (data?.error) return toast(data.error || '선생님 계정을 불러오지 못했습니다.', 'error');
        if (!state.ui) state.ui = {};
        state.ui.adminTeacherRows = Array.isArray(data.teachers) ? data.teachers : [];
        renderAdminTeacherAccountManage();
    } catch (e) {
        console.error('[openAdminTeacherAccountManage] failed:', e);
        toast('선생님 계정 조회 중 오류가 발생했습니다.', 'error');
    }
}

function renderAdminTeacherAccountManage() {
    const teachers = getAdminTeacherRows().slice().sort((a, b) => {
        const ar = String(a.role || '') === 'admin' ? 0 : 1;
        const br = String(b.role || '') === 'admin' ? 0 : 1;
        if (ar !== br) return ar - br;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });

    const rows = teachers.map(t => {
        const safeId = apEscapeHtml(String(t.id || ''));
        const role = String(t.role || 'teacher');
        const roleColor = role === 'admin' ? 'var(--error)' : 'var(--text)';
        const roleBg = role === 'admin' ? 'rgba(var(--error-rgb),0.10)' : 'var(--surface-2)';
        return `
            <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px;">
                <div style="min-width:0; flex:1;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span style="font-size:14px; color:var(--text); line-height:1.35;; font-weight:500;">${apEscapeHtml(t.name || '')}</span>
                        <span style="font-size:11px; font-weight:500; color:${roleColor}; background:${roleBg}; padding:3px 8px; border-radius:999px;">${adminTeacherRoleLabel(role)}</span>
                    </div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-top:4px; line-height:1.4;">ID ${apEscapeHtml(t.login_id || '')}</div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
                    <button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="openAdminEditTeacherModal('${safeId}')">수정</button>
                    <button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:rgba(var(--warning-rgb),0.12); color:var(--warning); border:none;" onclick="openAdminResetTeacherPasswordModal('${safeId}')">PW 초기화</button>
                </div>
            </div>
        `;
    }).join('');

    showModal('선생님 계정', `
        <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500; margin-bottom:14px;" onclick="openAdminCreateTeacherModal()">새 선생님 계정</button>
        <div style="max-height:58vh; overflow-y:auto; padding-right:4px;">
            ${rows || `<div style="text-align:center; padding:28px; color:var(--secondary); font-size:13px; font-weight:500;">등록된 선생님 계정이 없습니다.</div>`}
        </div>
    `);
}

function openAdminCreateTeacherModal() {
    showModal('새 선생님 계정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="admin-new-teacher-name" class="btn" placeholder="이름" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="admin-new-teacher-login" class="btn" placeholder="로그인 ID" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="admin-new-teacher-password" type="password" class="btn" placeholder="초기 비밀번호" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <select id="admin-new-teacher-role" class="btn" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
                <option value="teacher">선생님</option>
                <option value="admin">원장</option>
            </select>
            <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5; background:var(--surface-2); padding:10px 12px; border-radius:12px;">계정 생성 후 담당반 배정은 반 관리/담당 변경 메뉴에서 별도로 진행합니다.</div>
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminCreateTeacher()">생성</button>
        </div>
    `);
}

async function handleAdminCreateTeacher() {
    const name = document.getElementById('admin-new-teacher-name')?.value.trim() || '';
    const loginId = document.getElementById('admin-new-teacher-login')?.value.trim() || '';
    const password = document.getElementById('admin-new-teacher-password')?.value.trim() || '';
    const role = document.getElementById('admin-new-teacher-role')?.value || 'teacher';

    if (!name || !loginId || !password) return toast('이름, ID, 비밀번호를 모두 입력하세요.', 'warn');
    if (password.length < 4) return toast('비밀번호는 4자 이상으로 입력하세요.', 'warn');

    try {
        const r = await api.post('teachers', { name, login_id: loginId, password, role });
        if (r?.success) {
            toast('선생님 계정이 생성되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '선생님 계정 생성에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminCreateTeacher] failed:', e);
        toast('선생님 계정 생성 중 오류가 발생했습니다.', 'error');
    }
}

function openAdminEditTeacherModal(teacherId) {
    const teacher = getAdminTeacherRows().find(t => String(t.id) === String(teacherId));
    if (!teacher) return toast('선생님 계정을 찾을 수 없습니다.', 'warn');

    showModal('선생님 계정 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:12px; color:var(--secondary); font-weight:500; padding:0 4px;">로그인 ID: ${apEscapeHtml(teacher.login_id || '')}</div>
            <input id="admin-edit-teacher-name" class="btn" value="${apEscapeHtml(teacher.name || '')}" placeholder="이름" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <select id="admin-edit-teacher-role" class="btn" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
                <option value="teacher" ${String(teacher.role || '') !== 'admin' ? 'selected' : ''}>선생님</option>
                <option value="admin" ${String(teacher.role || '') === 'admin' ? 'selected' : ''}>원장</option>
            </select>
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminUpdateTeacher('${apEscapeHtml(String(teacher.id || ''))}')">저장</button>
        </div>
    `);
}

async function handleAdminUpdateTeacher(teacherId) {
    const name = document.getElementById('admin-edit-teacher-name')?.value.trim() || '';
    const role = document.getElementById('admin-edit-teacher-role')?.value || 'teacher';
    if (!name) return toast('이름을 입력하세요.', 'warn');

    try {
        const r = await api.patch(`teachers/${teacherId}`, { name, role });
        if (r?.success) {
            toast('선생님 계정이 수정되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '선생님 계정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminUpdateTeacher] failed:', e);
        toast('선생님 계정 수정 중 오류가 발생했습니다.', 'error');
    }
}

function openAdminResetTeacherPasswordModal(teacherId) {
    const teacher = getAdminTeacherRows().find(t => String(t.id) === String(teacherId));
    if (!teacher) return toast('선생님 계정을 찾을 수 없습니다.', 'warn');

    showModal('비밀번호 초기화', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5; background:var(--surface-2); padding:12px; border-radius:12px;">${apEscapeHtml(teacher.name || '')} 선생님의 비밀번호를 새 값으로 초기화합니다.</div>
            <input id="admin-reset-teacher-password" type="password" class="btn" placeholder="새 비밀번호" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminResetTeacherPassword('${apEscapeHtml(String(teacher.id || ''))}')">초기화</button>
        </div>
    `);
}

async function handleAdminResetTeacherPassword(teacherId) {
    const newPassword = document.getElementById('admin-reset-teacher-password')?.value.trim() || '';
    if (!newPassword) return toast('새 비밀번호를 입력하세요.', 'warn');
    if (newPassword.length < 4) return toast('비밀번호는 4자 이상으로 입력하세요.', 'warn');
    if (!confirm('비밀번호를 초기화할까요?')) return;

    try {
        const r = await api.patch(`teachers/${teacherId}/reset-password`, { new_password: newPassword });
        if (r?.success) {
            toast('비밀번호가 초기화되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '비밀번호 초기화에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminResetTeacherPassword] failed:', e);
        toast('비밀번호 초기화 중 오류가 발생했습니다.', 'error');
    }
}

// ─────────────────────────────────────────────
// [Admin Overview] 원장모드 상시 운영 요약
// ─────────────────────────────────────────────
function adminNormalizeStatus(value) {
    return String(value || '재원').trim() || '재원';
}

function adminGetStudentClassMap(studentId) {
    if (typeof apmsGetClassStudentMap === 'function') return apmsGetClassStudentMap(studentId);
    return (state.db.class_students || []).find(m => String(m.student_id) === String(studentId)) || null;
}

function adminGetClassById(classId) {
    if (typeof apmsGetClassById === 'function') return apmsGetClassById(classId);
    return (state.db.classes || []).find(c => String(c.id) === String(classId)) || null;
}

function adminGetStudentClass(studentId) {
    const map = adminGetStudentClassMap(studentId);
    return map ? adminGetClassById(map.class_id) : null;
}

function adminGetClassStudentIds(classId) {
    if (typeof apmsGetClassStudentIds === 'function') return apmsGetClassStudentIds(classId);
    return (state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id));
}

function adminGetCreatedDateText(student) {
    return String(student?.created_at || '').split('T')[0].split(' ')[0];
}

function adminGetDaysSince(dateText, todayTime) {
    const time = apParseLocalDateTime(dateText);
    if (time === null) return null;
    return Math.max(0, Math.floor((todayTime - time) / (1000 * 60 * 60 * 24)) + 1);
}

function adminIsRecentStudent(student, todayTime, days = 30) {
    const createdDate = adminGetCreatedDateText(student);
    const createdTime = apParseLocalDateTime(createdDate);
    if (createdTime === null) return false;
    const diff = (todayTime - createdTime) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < days;
}

function adminBuildOverviewData(todayStr, todayTime) {
    const students = state.db.students || [];
    const classes = state.db.classes || [];
    const maps = state.db.class_students || [];

    const activeStudents = students.filter(s => adminNormalizeStatus(s.status) === '재원');
    const dischargedStudents = students.filter(s => adminNormalizeStatus(s.status) === '제적');
    const leaveStudents = students.filter(s => adminNormalizeStatus(s.status) === '휴원');
    const recentStudents = activeStudents
        .filter(s => adminIsRecentStudent(s, todayTime, 60))
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));

    const unassignedStudents = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return true;
        const cls = adminGetClassById(map.class_id);
        return !cls;
    });

    const teacherlessClasses = classes.filter(c => {
        if (Number(c.is_active) === 0) return false;
        const teacherName = String(c.teacher_name || '').trim();
        return !teacherName || teacherName === '담당';
    });

    const cleanupStudents = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return false;
        const cls = adminGetClassById(map.class_id);
        return !cls || Number(cls.is_active) === 0;
    });

    return {
        todayStr,
        todayTime,
        activeStudents,
        dischargedStudents,
        leaveStudents,
        recentStudents,
        unassignedStudents,
        teacherlessClasses,
        cleanupStudents
    };
}

// [라우트 안전장치] 학생 클릭/상세 진입은 무조건 보기모드.
// 과거 edit 직행 위험을 제거하기 위해 detail wrapper로 위임한다.
function adminOpenStudentEditOrDetail(studentId) {
    return adminOpenDashboardStudentDetail(studentId);
}

function adminOpenDashboardStudentDetail(studentId) {
    if (!studentId) return;
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'dashboard' });
    if (typeof openStudentDetail === 'function') return openStudentDetail(studentId, { mode: 'view', returnTo: { type: 'dashboard' } });
    if (typeof renderStudentDetail === 'function') return renderStudentDetail(studentId, { returnTo: { type: 'dashboard' } });
    toast('학생 화면을 불러오지 못했습니다.', 'warn');
}

// [라우트 안전장치] 수정 버튼 전용. 학생 클릭 onclick에서는 호출 금지.
function adminOpenDashboardStudentEdit(studentId) {
    if (!studentId) return;
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'dashboard' });
    if (typeof openStudentDetail === 'function') return openStudentDetail(studentId, { mode: 'edit', returnTo: { type: 'dashboard' } });
    if (typeof openEditStudent === 'function') return openEditStudent(studentId, { returnTo: { type: 'dashboard' } });
    toast('학생 수정 화면을 불러오지 못했습니다.', 'warn');
}

function adminBuildGradeHoverRows(students = []) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const counts = {};
    (students || []).forEach(student => {
        const grade = String(student?.grade || student?.grade_raw || '미지정').trim() || '미지정';
        counts[grade] = (counts[grade] || 0) + 1;
    });
    const labels = Object.keys(counts).sort((a, b) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        return a.localeCompare(b, 'ko');
    });
    return labels.map(label => ({ label, value: counts[label] }));
}

function renderAdminMiniMetric(label, value, tone = 'text', onclick = '', hoverRows = []) {
    const colorMap = {
        primary: 'var(--text)',
        success: 'var(--text)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        secondary: 'var(--secondary)',
        text: 'var(--text)'
    };
    const color = colorMap[tone] || colorMap.text;
    const clickAttr = onclick ? ` onclick="${onclick}"` : '';
    const cursor = onclick ? 'cursor:pointer;' : '';
    const roleAttr = onclick ? ' role="button" tabindex="0"' : '';
    const safeLabel = apEscapeHtml(label);
    const safeValue = apEscapeHtml(String(value ?? 0));
    const hoverText = dashboardEscapeAttr(`${label} ${value ?? 0}명`);
    const rows = Array.isArray(hoverRows) ? hoverRows : [];
    const hoverHtml = rows.length
        ? `<div class="ap-admin-mini-metric__hover" style="position:absolute; left:50%; bottom:calc(100% + 8px); transform:translateX(-50%); min-width:132px; padding:10px 12px; border-radius:12px; background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); color:var(--text); font-size:12px; font-weight:500; line-height:1.45; opacity:0; pointer-events:none; z-index:20; transition:opacity .14s ease, transform .14s ease;">
            <div style="font-size:12px; font-weight:700; margin-bottom:6px; white-space:nowrap;">${safeLabel} ${safeValue}명</div>
            ${rows.map(row => `<div style="display:flex; justify-content:space-between; gap:12px; white-space:nowrap;"><span>${apEscapeHtml(row.label)}</span><strong>${apEscapeHtml(String(row.value || 0))}명</strong></div>`).join('')}
        </div>`
        : '';
    return `
        <div class="ap-admin-mini-metric"${roleAttr} aria-label="${hoverText}"${clickAttr} style="${cursor} position:relative; min-height:44px; padding:0 10px; border-radius:12px; background:var(--surface); border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; box-sizing:border-box; box-shadow:none;" onmouseenter="this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('opacity','1'); this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('transform','translateX(-50%) translateY(-2px)')" onmouseleave="this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('opacity','0'); this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('transform','translateX(-50%)')">
            <div style="font-size:13px; font-weight:500; color:${color}; line-height:1.25; white-space:nowrap;">${safeLabel}</div>
            ${hoverHtml}
        </div>
    `;
}

function renderAdminAssessmentArchiveMetric(url = '../archive/assessment/assessment-mvp.html') {
    return `
        <div class="ap-admin-mini-metric ap-admin-assessment-card" role="button" tabindex="0" title="진단평가 · 단원평가 · 중간·기말평가" aria-label="시험지 보관함: 진단평가, 단원평가, 중간·기말평가" data-assessment-archive-url="${url}" onclick="openAdminAssessmentArchiveWindow(event)" style="cursor:pointer; min-height:44px; padding:0 10px; border-radius:12px; background:var(--surface); border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; box-sizing:border-box; box-shadow:none;">
            <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.25; white-space:nowrap;">시험지 보관함</div>
        </div>
    `;
}

function renderAdminStudentOverviewPanel(data) {
    return `
        <div class="ap-admin-section" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">오늘 운영</h3>
            </div>
            <div class="ap-admin-overview-grid" style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px; padding:4px; border:1px solid var(--border); border-radius:16px; background:var(--surface-2);">
                ${renderAdminMiniMetric('재원', data.activeStudents.length, 'primary', "openAdminStudentGradeModal('active')", adminBuildGradeHoverRows(data.activeStudents))}
                ${renderAdminMiniMetric('최근등록', data.recentStudents.length, 'success', "openAdminStudentGradeModal('new')", adminBuildGradeHoverRows(data.recentStudents))}
                ${renderAdminMiniMetric('퇴원', data.dischargedStudents.length, 'secondary', "openAdminStudentList('discharged')", adminBuildGradeHoverRows(data.dischargedStudents))}
                ${renderAdminAssessmentArchiveMetric('../archive/assessment/assessment-mvp.html')}
            </div>
        </div>
    `;
}

function renderAdminNeedCheckPanel(data) {
    const items = [
        { label: '반 배정 필요', value: data.unassignedStudents.length, action: 'openAdminUnassignedStudentList()' },
        { label: '담당 선생님 미지정', value: data.teacherlessClasses.length, unit: '개', action: 'openAdminTeacherlessClassList()' },
        { label: '반 정리 필요', value: data.cleanupStudents.length, action: 'openAdminClassCleanupList()' }
    ];

    return `
        <div class="ap-admin-section" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">확인 필요</h3>
            </div>
            <div class="ap-admin-check-grid" style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                ${items.map(item => {
                    const hasIssue = Number(item.value || 0) > 0;
                    return `
                        <button class="btn ap-admin-check-item" style="min-height:52px; padding:0 10px; border-radius:16px; border:1px solid ${hasIssue ? 'rgba(var(--error-rgb),0.20)' : 'var(--border)'}; background:${hasIssue ? 'rgba(255,71,87,0.045)' : 'var(--surface)'}; box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:8px;" onclick="${item.action}">
                            <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--text); font-size:12px; font-weight:500;">${item.label}</span>
                            <span style="flex-shrink:0; font-size:13px; font-weight:500; color:${hasIssue ? 'var(--error)' : 'var(--secondary)'};">${item.value}${item.unit || '명'}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderAdminNewStudentPanel(data) {
    const INITIAL_LIMIT = 10;
    const allList = Array.isArray(data.recentStudents) ? data.recentStudents : [];
    const visibleList = allList.slice(0, INITIAL_LIMIT);
    const hiddenList = allList.slice(INITIAL_LIMIT);

    const buildRow = s => {
        const cls = adminGetStudentClass(s.id);
        const days = adminGetDaysSince(adminGetCreatedDateText(s), data.todayTime);
        const attCount = (state.db.attendance_history || state.db.attendance || []).filter(a => String(a.student_id) === String(s.id)).length;
        const hwCount = (state.db.homework_history || state.db.homework || []).filter(h => String(h.student_id) === String(s.id)).length;
        const examCount = (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(s.id)).length;
        const hasClass = !!cls;
        const recordText = examCount > 0 ? `시험 ${examCount}회` : (attCount + hwCount > 0 ? `기록 ${attCount + hwCount}회` : '기록 없음');
        return `
            <div class="ap-admin-recent-student-row" onclick="adminOpenDashboardStudentDetail('${s.id}')" style="height:46px; min-height:46px; padding:0 12px; display:flex; align-items:center; justify-content:space-between; gap:10px; cursor:pointer; box-sizing:border-box;">
                <div style="min-width:0; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; color:var(--text); white-space:nowrap; font-weight:500;">${apEscapeHtml(s.name)}</span>
                    <span style="font-size:11px; color:var(--secondary); font-weight:500; white-space:nowrap;">등록 ${days || '-'}일차</span>
                </div>
                <div style="display:flex; align-items:center; gap:5px; flex-shrink:0; min-width:0;">
                    <span style="font-size:10.5px; font-weight:500; color:${hasClass ? 'var(--text)' : 'var(--error)'}; background:${hasClass ? 'var(--surface-2)' : 'rgba(var(--error-rgb),0.10)'}; border:1px solid ${hasClass ? 'var(--border)' : 'rgba(var(--error-rgb),0.16)'}; padding:3px 6px; border-radius:999px; white-space:nowrap;">${hasClass ? apEscapeHtml(cls.name) : '반 배정 필요'}</span>
                    <span style="font-size:10.5px; font-weight:500; color:var(--secondary); background:var(--surface-2); padding:3px 6px; border-radius:999px; white-space:nowrap;">${recordText}</span>
                </div>
            </div>
        `;
    };

    const visibleRows = visibleList.map(buildRow).join('');
    const hiddenRows = hiddenList.map(buildRow).join('');
    const moreBtn = hiddenList.length > 0 ? `
        <div id="ap-new-student-more-wrap">
            <div id="ap-new-student-hidden" style="display:none;">${hiddenRows}</div>
            <button onclick="(function(){var h=document.getElementById('ap-new-student-hidden');var b=document.getElementById('ap-new-student-more-btn');if(!h||!b)return;var open=h.style.display!=='none';h.style.display=open?'none':'block';b.textContent=open?'▼ ${hiddenList.length}명 더 보기':'▲ 접기';})()" id="ap-new-student-more-btn" style="width:100%; height:38px; border:none; border-top:1px solid var(--border); background:transparent; color:var(--secondary); font-size:12px; font-weight:600; cursor:pointer;">▼ ${hiddenList.length}명 더 보기</button>
        </div>` : '';

    return `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">최근 등록 원생</h3>
                <span style="font-size:12px; font-weight:400; color:var(--secondary);">최근 2개월 ${allList.length}명</span>
            </div>
            <div class="card ap-admin-recent-student-grid" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${visibleRows || `<div style="height:52px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">최근 등록 원생이 없습니다.</div>`}
                ${moreBtn}
            </div>
        </div>
    `;
}


function adminGetGradeLabel(student) {
    const text = String((student && (student.grade || student.school_grade || student.memo)) || '').trim();
    if (/중\s*1|중1/.test(text)) return '중1';
    if (/중\s*2|중2/.test(text)) return '중2';
    if (/중\s*3|중3/.test(text)) return '중3';
    if (/고\s*1|고1/.test(text)) return '고1';
    if (/고\s*2|고2/.test(text)) return '고2';
    if (/고\s*3|고3/.test(text)) return '고3';
    return text || '기타';
}

function adminGetGradeOrder(label) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const idx = order.indexOf(String(label || ''));
    return idx >= 0 ? idx : 98;
}

function adminGetStudentListByType(type) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const students = state.db.students || [];
    const activeStudents = students.filter(s => adminNormalizeStatus(s.status) === '재원');
    if (type === 'new') {
        return activeStudents
            .filter(s => adminIsRecentStudent(s, todayTime, 60))
            .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }
    if (type === 'leave') return students.filter(s => adminNormalizeStatus(s.status) === '휴원');
    if (type === 'discharged') return students.filter(s => adminNormalizeStatus(s.status) === '제적');
    return activeStudents.sort((a, b) => adminGetGradeOrder(adminGetGradeLabel(a)) - adminGetGradeOrder(adminGetGradeLabel(b)) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function adminRenderStudentGradeSummary(list) {
    const students = Array.isArray(list) ? list : [];
    const grades = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    students.forEach(s => {
        const grade = adminGetGradeLabel(s);
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    const chips = [
        `<span style="min-height:30px; padding:6px 10px; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); color:var(--text); font-size:12px; font-weight:500; display:flex; align-items:center;">총 ${students.length}명</span>`,
        ...grades.map(g => {
            const count = Number(gradeCounts[g] || 0);
            if (count === 0) return '';
            return `<span style="min-height:30px; padding:6px 10px; border-radius:999px; background:var(--surface); border:1px solid var(--border); color:var(--text); font-size:12px; font-weight:500; display:flex; align-items:center;">${apEscapeHtml(g)} ${count}명</span>`;
        })
    ].join('');
    return `<div style="display:flex; flex-wrap:wrap; gap:6px; margin:0 0 12px 0;">${chips}</div>`;
}

function adminEnsureStudentGradeModalState(type) {
    if (!state.ui) state.ui = {};
    if (!state.ui.adminStudentGradeModal || state.ui.adminStudentGradeModal.type !== type) {
        state.ui.adminStudentGradeModal = { type, grade: '전체', keyword: '' };
    }
    return state.ui.adminStudentGradeModal;
}

function openAdminStudentGradeModal(type) {
    adminEnsureStudentGradeModalState(type || 'active');
    renderAdminStudentGradeModal();
}

function adminSetStudentGradeModalGrade(grade) {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    modal.grade = String(grade || '전체');
    renderAdminStudentGradeModal();
}

function adminHandleStudentGradeModalSearch(value) {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    modal.keyword = String(value || '').trim();
    const body = document.getElementById('admin-student-grade-modal-body');
    if (body) body.innerHTML = renderAdminStudentGradeModalBody();
}

function renderAdminStudentGradeModalBody() {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    const list = adminGetStudentListByType(modal.type);
    const keyword = adminNormalizeSearchValue(modal.keyword || '');
    const grades = ['전체', '중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    list.forEach(s => {
        const grade = adminGetGradeLabel(s);
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    const filtered = list.filter(s => {
        const grade = adminGetGradeLabel(s);
        const cls = adminGetStudentClass(s.id);
        if (modal.grade !== '전체' && grade !== modal.grade) return false;
        if (!keyword) return true;
        return adminSearchIncludes([s.name, s.school_name, s.grade, s.status, s.phone, cls && cls.name], modal.keyword);
    });
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const chips = grades.map(g => {
        const count = g === '전체' ? list.length : Number(gradeCounts[g] || 0);
        if (g !== '전체' && count === 0) return '';
        const active = modal.grade === g;
        return `<button class="btn" style="min-height:34px; padding:6px 10px; font-size:12px; font-weight:500; border-radius:999px; border:1px solid var(--border); background:${active ? 'var(--surface-2)' : 'var(--surface)'}; color:var(--text); box-shadow:none;" onclick="adminSetStudentGradeModalGrade('${apEscapeHtml(g)}')">${apEscapeHtml(g)} ${count}</button>`;
    }).join('');
    const rows = filtered.map(s => {
        const cls = adminGetStudentClass(s.id);
        const grade = adminGetGradeLabel(s);
        const days = adminGetDaysSince(adminGetCreatedDateText(s), todayTime);
        const subText = [cls ? cls.name : '미배정', s.school_name || '', grade].filter(Boolean).join(' · ');
        const recentText = modal.type === 'new' ? `<span style="font-size:11px; font-weight:500; color:var(--secondary); background:var(--surface-2); padding:3px 7px; border-radius:999px; white-space:nowrap;">등록 ${days || '-'}일차</span>` : '';
        return `
            <div style="padding:13px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--surface);">
                <button class="btn" style="flex:1; min-width:0; padding:0; border:none; background:transparent; box-shadow:none; text-align:left; display:block;" onclick="adminOpenStudentEditOrDetail('${apEscapeHtml(String(s.id || ''))}')">
                    <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(s.name || '')}</div>
                    <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:4px; line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(subText)}</div>
                </button>
                ${recentText}
            </div>
        `;
    }).join('');
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="search" autocomplete="off" value="${apEscapeHtml(modal.keyword || '')}" placeholder="학생 이름 검색" oninput="adminHandleStudentGradeModalSearch(this.value)" style="width:100%; height:42px; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); padding:0 13px; font-size:13px; font-weight:500; box-sizing:border-box;">
            <div style="display:flex; flex-wrap:wrap; gap:6px;">${chips}</div>
            <div style="font-size:12px; font-weight:400; color:var(--secondary); padding:0 2px;">총 ${filtered.length}명</div>
            <div style="max-height:54vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${rows || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">조회 대상이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function renderAdminStudentGradeModal() {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    const title = modal.type === 'new' ? '최근 등록' : '재원';
    showModal(title, `<div id="admin-student-grade-modal-body">${renderAdminStudentGradeModalBody()}</div>`);
}

function adminGetConsultationDate(row) {
    return String(row?.date || row?.consultation_date || row?.created_at || '').slice(0, 10);
}

function adminConsultationSortValue(row) {
    return String(row?.date || row?.consultation_date || row?.created_at || '').replace(/[^0-9]/g, '');
}

function adminGetStudentById(studentId) {
    return (state.db.students || []).find(s => String(s.id) === String(studentId)) || null;
}

function adminGetConsultationRows() {
    return (state.db.consultations || [])
        .slice()
        .sort((a, b) => String(adminConsultationSortValue(b)).localeCompare(String(adminConsultationSortValue(a))) || String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(b.id || '').localeCompare(String(a.id || '')));
}

function adminGetRecentConsultationRows(days = 14) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    return adminGetConsultationRows().filter(row => {
        const date = adminGetConsultationDate(row);
        const time = apParseLocalDateTime(date);
        if (time === null) return false;
        const diff = (todayTime - time) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= days;
    });
}

function adminConsultationRowStudentName(row) {
    const student = adminGetStudentById(row?.student_id);
    return (student && student.name) || row?.student_name_snapshot || '학생 확인';
}

function adminRecentConsultationPreviewText(row) {
    const content = String(row?.content || '').replace(/\s+/g, ' ').trim();
    return content || '상담 내용 없음';
}

function adminRenderConsultationHistoryRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    return list.map(row => {
        const date = adminGetConsultationDate(row) || '-';
        const type = String(row?.type || '상담').trim() || '상담';
        const content = String(row?.content || '').trim();
        const nextAction = String(row?.next_action || row?.nextAction || '').trim();
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); background:var(--surface);">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.35;">${apEscapeHtml(date)} · ${apEscapeHtml(type)}</div>
                </div>
                <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.55; white-space:pre-wrap;">${apEscapeHtml(content || '내용 없음')}</div>
                ${nextAction ? `<div style="margin-top:8px; font-size:12px; font-weight:400; color:var(--secondary); line-height:1.45; white-space:pre-wrap;">다음 조치 · ${apEscapeHtml(nextAction)}</div>` : ''}
            </div>
        `;
    }).join('') || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">상담 기록이 없습니다.</div>`;
}

function openAdminStudentConsultationHistory(studentId) {
    const sid = String(studentId || '').trim();
    const student = adminGetStudentById(sid);
    const rows = adminGetConsultationRows().filter(row => String(row.student_id || '') === sid);
    const studentName = student ? student.name : '학생 확인';
    const detailBtn = student ? `<button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); box-shadow:none;" onclick="adminOpenStudentEditOrDetail('${apEscapeHtml(sid)}')">학생 상세</button>` : '';
    showModal(`상담 이력 · ${studentName}`, `
        <div style="display:flex; flex-direction:column; gap:10px; margin:-4px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:0 2px;">
                <div style="font-size:12px; font-weight:400; color:var(--secondary);">총 ${rows.length}건</div>
                ${detailBtn}
            </div>
            <div style="max-height:58vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${adminRenderConsultationHistoryRows(rows)}
            </div>
        </div>
    `);
}

function renderAdminRecentConsultationPanel() {
    const recentRows = adminGetRecentConsultationRows(14);
    const byStudent = [];
    const seen = new Set();
    recentRows.forEach(row => {
        const sid = String(row.student_id || '').trim();
        if (!sid || seen.has(sid)) return;
        seen.add(sid);
        byStudent.push(row);
    });
    const rows = byStudent.slice(0, 8).map(row => {
        const sid = String(row.student_id || '').trim();
        const student = adminGetStudentById(sid);
        const cls = student ? adminGetStudentClass(student.id) : null;
        const type = String(row?.type || '상담').trim() || '상담';
        const nextAction = String(row?.next_action || row?.nextAction || '').trim();
        const preview = adminRecentConsultationPreviewText(row);
        const meta = [adminGetConsultationDate(row), cls && cls.name].filter(Boolean).join(' · ');
        return `
            <button class="btn ap-admin-consultation-row" style="width:100%; min-height:68px; padding:10px 12px; border:none; border-bottom:1px solid var(--border); border-radius:0; background:var(--surface); box-shadow:none; display:grid; grid-template-columns:minmax(0, 1fr) auto; align-items:center; gap:12px; text-align:left;" onclick="openAdminStudentConsultationHistory('${apEscapeHtml(sid)}')">
                <span style="min-width:0; display:flex; flex-direction:column; gap:4px;">
                    <span style="display:flex; align-items:center; gap:7px; min-width:0;">
                        <span style="font-size:13px; font-weight:700; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(adminConsultationRowStudentName(row))}</span>
                        <span style="flex-shrink:0; font-size:10px; font-weight:700; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:2px 7px;">${apEscapeHtml(type)}</span>
                    </span>
                    <span style="font-size:12px; font-weight:500; color:var(--secondary); line-height:1.45; overflow:hidden; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical;">${apEscapeHtml(preview)}</span>
                </span>
                <span style="flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:5px; max-width:210px;">
                    <span style="font-size:11px; font-weight:500; color:var(--secondary); white-space:nowrap;">${apEscapeHtml(meta)}</span>
                    ${nextAction ? `<span style="max-width:100%; font-size:11px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">다음 조치 · ${apEscapeHtml(nextAction)}</span>` : '<span style="font-size:11px; font-weight:500; color:var(--secondary);">후속 없음</span>'}
                </span>
            </button>
        `;
    }).join('');

    return `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">최근 상담</h3>
                <button class="btn" style="min-height:30px; padding:5px 10px; font-size:11px; font-weight:500; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); box-shadow:none;" onclick="openAdminConsultationCenter()">상담 전체 보기</button>
            </div>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${rows || `<div style="height:54px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">최근 상담 기록이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function openAdminConsultationCenter() {
    if (!state.ui) state.ui = {};
    state.ui.adminConsultationSearchKeyword = '';
    showModal('상담 전체 보기', `<div id="admin-consultation-center-body">${renderAdminConsultationCenterBody('')}</div>`);
}

function handleAdminConsultationSearchInput(value) {
    if (!state.ui) state.ui = {};
    state.ui.adminConsultationSearchKeyword = String(value || '').trim();
    const body = document.getElementById('admin-consultation-center-body');
    if (body) body.innerHTML = renderAdminConsultationCenterBody(state.ui.adminConsultationSearchKeyword);
}

function renderAdminConsultationCenterBody(keyword) {
    const key = String(keyword || '').trim();
    const baseRows = key ? adminGetConsultationRows() : adminGetRecentConsultationRows(14);
    const filtered = baseRows.filter(row => {
        if (!key) return true;
        const student = adminGetStudentById(row.student_id);
        const cls = student ? adminGetStudentClass(student.id) : null;
        return adminSearchIncludes([
            student && student.name,
            student && student.school_name,
            student && student.grade,
            cls && cls.name,
            row.type,
            row.content,
            row.next_action
        ], key);
    }).slice(0, 30);
    const rows = filtered.map(row => {
        const sid = String(row.student_id || '').trim();
        const student = adminGetStudentById(sid);
        const cls = student ? adminGetStudentClass(student.id) : null;
        const meta = [adminGetConsultationDate(row), cls && cls.name, row.type].filter(Boolean).join(' · ');
        return `
            <button class="btn" style="min-height:52px; padding:10px 12px; border:none; border-bottom:1px solid var(--border); border-radius:0; background:var(--surface); box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:12px;" onclick="openAdminStudentConsultationHistory('${apEscapeHtml(sid)}')">
                <span style="min-width:0; text-align:left;">
                    <span style="display:block; font-size:13px; font-weight:500; color:var(--text); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(adminConsultationRowStudentName(row))}</span>
                    <span style="display:block; font-size:11px; font-weight:500; color:var(--secondary); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(meta)}</span>
                </span>
                <span style="flex-shrink:0; font-size:11px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); padding:4px 8px; border-radius:999px;">보기</span>
            </button>
        `;
    }).join('');
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="search" autocomplete="off" value="${apEscapeHtml(key)}" placeholder="학생 이름 검색" oninput="handleAdminConsultationSearchInput(this.value)" style="width:100%; height:42px; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); padding:0 13px; font-size:13px; font-weight:500; box-sizing:border-box;">
            <div style="font-size:12px; font-weight:400; color:var(--secondary); padding:0 2px;">${key ? '검색 결과' : '최근 2주'} ${filtered.length}건</div>
            <div style="max-height:56vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${rows || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">상담 기록이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function openAdminLeaveStudentList() {
    const list = (state.db.students || []).filter(s => adminNormalizeStatus(s.status) === '휴원');
    renderAdminSimpleStudentList('휴원생 목록', list, false, true);
}

function openAdminUnassignedStudentList() {
    const activeStudents = (state.db.students || []).filter(s => adminNormalizeStatus(s.status) === '재원');
    const list = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return true;
        return !adminGetClassById(map.class_id);
    });
    renderAdminSimpleStudentList('반 배정 필요', list, true);
}

function openAdminClassCleanupList() {
    const list = (state.db.students || []).filter(s => {
        if (adminNormalizeStatus(s.status) !== '재원') return false;
        const map = adminGetStudentClassMap(s.id);
        if (!map) return false;
        const cls = adminGetClassById(map.class_id);
        return !cls || Number(cls.is_active) === 0;
    });
    renderAdminSimpleStudentList('반 정리 필요', list, true);
}

function openAdminTeacherlessClassList() {
    const classes = (state.db.classes || []).filter(c => {
        if (Number(c.is_active) === 0) return false;
        const teacherName = String(c.teacher_name || '').trim();
        return !teacherName || teacherName === '담당';
    });

    const rows = classes.map(c => `
        <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--surface);">
            <div style="min-width:0;">
                <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35;">${apEscapeHtml(c.name || '')}</div>
                <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:3px;">${apEscapeHtml(c.grade || '')} · 담당 선생님 미지정</div>
            </div>
            <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="closeModal(true); if(typeof openClassManageModal==='function') openClassManageModal(); else toast('반 관리 화면을 불러오지 못했습니다.', 'warn');">반 관리</button>
        </div>
    `).join('');

    showModal(`담당 선생님 미지정 (${classes.length}개)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:500;">확인할 반이 없습니다.</div>`}</div>`);
}

function renderAdminSimpleStudentList(title, list, editable = false, showGradeSummary = false) {
    const rows = list.map(s => {
        const cls = adminGetStudentClass(s.id);
        const classText = cls ? cls.name : '미배정';
        const status = adminNormalizeStatus(s.status);
        const action = editable
            ? `<button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); color:var(--text); border:1px solid var(--border);" onclick="adminOpenDashboardStudentEdit('${s.id}')">수정</button>`
            : `<button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세</button>`;
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; background:var(--surface);">
                <div style="min-width:0; flex:1;">
                    <div style="font-weight:500; font-size:14px; color:var(--text); line-height:1.35;">${apEscapeHtml(s.name || '')} <span style="font-size:12px; color:var(--secondary); font-weight:500; margin-left:4px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <div style="font-size:12px; color:var(--text); font-weight:500; margin-top:4px;">${apEscapeHtml(classText)} <span style="color:var(--secondary); font-weight:500;">| ${apEscapeHtml(status)}</span></div>
                </div>
                ${action}
            </div>
        `;
    }).join('');

    const gradeSummary = showGradeSummary ? adminRenderStudentGradeSummary(list) : '';
    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${gradeSummary}${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:500;">조회 대상이 없습니다.</div>`}</div>`);
}


// ─────────────────────────────────────────────
// [Admin Search] 원장모드 전체 검색
// ─────────────────────────────────────────────
function adminNormalizeSearchValue(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
}

function adminSearchIncludes(values, keyword) {
    const key = adminNormalizeSearchValue(keyword);
    if (!key) return false;
    return values.some(value => adminNormalizeSearchValue(value).includes(key));
}

function adminGetSearchClassNameByStudentId(studentId) {
    const cls = adminGetStudentClass(studentId);
    return cls ? String(cls.name || '') : '미배정';
}

function adminGetSearchClassNameByClassId(classId) {
    const cls = adminGetClassById(classId);
    return cls ? String(cls.name || '') : '미배정';
}

function adminGetAssignmentTypeLabel(row) {
    const sourceType = String(row?.source_type || '').trim().toLowerCase();
    const archiveFile = String(row?.archive_file || '').trim();
    if (sourceType === 'clinic') return '클리닉';
    if (sourceType === 'mixed' || archiveFile.startsWith('MIXED:')) return '믹서';
    if (archiveFile) return '아카이브';
    return '자료';
}

function adminBuildGlobalSearchResults(keyword) {
    const key = String(keyword || '').trim();
    if (!key) return [];

    const results = [];
    const students = state.db.students || [];
    const classes = state.db.classes || [];
    const examSchedules = state.db.exam_schedules || [];
    const assignments = state.db.class_exam_assignments || [];

    students.forEach(s => {
        const className = adminGetSearchClassNameByStudentId(s.id);
        if (!adminSearchIncludes([s.name, s.school_name, s.grade, s.status, s.phone, className], key)) return;
        results.push({
            type: 'student',
            label: s.name || '학생',
            meta: `${className} · ${s.school_name || ''} ${s.grade || ''}`.trim(),
            desc: adminNormalizeStatus(s.status),
            actionLabel: '학생 보기',
            studentId: s.id
        });
    });

    classes.forEach(c => {
        if (Number(c.is_active) === 0) return;
        if (!adminSearchIncludes([c.name, c.grade, c.teacher_name], key)) return;
        const count = adminGetClassStudentIds(c.id)
            .filter(id => students.some(s => String(s.id) === String(id) && adminNormalizeStatus(s.status) === '재원'))
            .length;
        results.push({
            type: 'class',
            label: c.name || '반',
            meta: `${c.grade || ''} · ${c.teacher_name || '담당 미지정'}`,
            desc: `재원 ${count}명`,
            actionLabel: '반 열기',
            classId: c.id
        });
    });

    examSchedules.forEach(e => {
        if (!adminSearchIncludes([e.school_name, e.grade, e.exam_name, e.exam_date], key)) return;
        results.push({
            type: 'exam',
            label: `${e.school_name || '학교'} ${e.exam_name || '시험'}`.trim(),
            meta: `${e.grade || '학교공통'} · ${e.exam_date || ''}`,
            desc: '시험일정',
            actionLabel: '일정 보기',
            examDate: e.exam_date
        });
    });

    assignments.forEach(row => {
        const className = adminGetSearchClassNameByClassId(row.class_id);
        if (!adminSearchIncludes([row.exam_title, row.exam_date, row.archive_file, row.source_type, className], key)) return;
        results.push({
            type: 'assignment',
            label: row.exam_title || '배정 자료',
            meta: `${className} · ${row.exam_date || ''}`,
            desc: `${adminGetAssignmentTypeLabel(row)} · ${Number(row.question_count || 0) ? `${row.question_count}문항` : '문항 수 없음'}`,
            actionLabel: '반 열기',
            classId: row.class_id
        });
    });

    const typeOrder = { student: 0, class: 1, exam: 2, assignment: 3 };
    results.sort((a, b) => {
        const ao = typeOrder[a.type] ?? 99;
        const bo = typeOrder[b.type] ?? 99;
        if (ao !== bo) return ao - bo;
        return String(a.label || '').localeCompare(String(b.label || ''), 'ko');
    });

    return results.slice(0, 18);
}

function adminSearchTypeLabel(type) {
    if (type === 'student') return '학생';
    if (type === 'class') return '반';
    if (type === 'exam') return '시험';
    if (type === 'assignment') return '자료';
    return '검색';
}

function renderAdminGlobalSearchResults(results) {
    if (!results.length) {
        return `<div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">검색 결과가 없습니다.</div>`;
    }

    return results.map((item, idx) => `
        <button class="btn ap-admin-search-row"
                style="width:100%; min-height:48px; padding:8px 10px; border-radius:12px; border:1px solid var(--border); background:var(--surface); box-shadow:none; display:flex; justify-content:space-between; align-items:center; gap:10px; text-align:left;"
                onclick="openAdminGlobalSearchResult(${idx})">
            <div style="min-width:0; flex:1;">
                <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                    <span style="flex-shrink:0; font-size:10px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); padding:2px 7px; border-radius:999px;">${adminSearchTypeLabel(item.type)}</span>
                    <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; color:var(--text); font-weight:500;">${apEscapeHtml(item.label)}</span>
                </div>
                <div style="margin-top:3px; font-size:11px; font-weight:500; color:var(--secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(item.meta || '')}${item.desc ? ` · ${apEscapeHtml(item.desc)}` : ''}</div>
            </div>
            <span style="flex-shrink:0; font-size:11px; font-weight:500; color:var(--secondary);">${apEscapeHtml(item.actionLabel || '열기')}</span>
        </button>
    `).join('');
}

function handleAdminGlobalSearchInput(value) {
    const area = document.getElementById('admin-global-search-results');
    if (!area) return;

    const keyword = String(value || '').trim();
    if (!state.ui) state.ui = {};
    if (!keyword) {
        state.ui.adminGlobalSearchResults = [];
        area.innerHTML = `<div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">학생, 반, 학교, 시험, 자료를 검색하세요.</div>`;
        return;
    }

    const results = adminBuildGlobalSearchResults(keyword);
    state.ui.adminGlobalSearchResults = results;
    area.innerHTML = renderAdminGlobalSearchResults(results);
}

function openAdminGlobalSearchResult(index) {
    const item = (state.ui?.adminGlobalSearchResults || [])[Number(index)];
    if (!item) return toast('검색 결과를 찾을 수 없습니다.', 'warn');

    if (item.type === 'student' && item.studentId) {
        openStudentDetail(item.studentId, { mode: 'view', returnTo: { type: 'dashboard' } });
        return;
    }

    if ((item.type === 'class' || item.type === 'assignment') && item.classId) {
        if (typeof renderClass === 'function') renderClass(String(item.classId));
        else toast('반 화면을 불러오지 못했습니다.', 'warn');
        return;
    }

    if (item.type === 'exam') {
        if (typeof openExamScheduleModal === 'function') openExamScheduleModal();
        else toast('시험일정 화면을 불러오지 못했습니다.', 'warn');
        return;
    }

    toast('이 항목은 바로 열 수 없습니다.', 'warn');
}

function renderAdminGlobalSearchPanel() {
    return `
        <div class="ap-admin-global-search">
            <div class="ap-admin-global-search__field">
                <svg class="ap-admin-global-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="M21 21L16.65 16.65M10.8 18.1C6.77 18.1 3.5 14.83 3.5 10.8C3.5 6.77 6.77 3.5 10.8 3.5C14.83 3.5 18.1 6.77 18.1 10.8C18.1 14.83 14.83 18.1 10.8 18.1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <input id="admin-global-search-input"
                       type="search"
                       autocomplete="off"
                       placeholder="학생 · 반 · 학교 · 시험 · 자료 검색"
                       oninput="handleAdminGlobalSearchInput(this.value)"
                       style="width:100%; height:42px; border:0; background:transparent; color:var(--text); padding:0 14px 0 38px; font-size:14px; font-weight:500; box-sizing:border-box;">
            </div>
            <div id="admin-global-search-results" class="ap-admin-global-search__results">
                <div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">학생, 반, 학교, 시험, 자료를 검색하세요.</div>
            </div>
        </div>
    `;
}


function renderAdminControlCenter() {
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('ap-teacher-dashboard-mode');
        document.body.classList.add('ap-owner-dashboard-bg');
    }
    const dashboardRole = String((typeof state !== 'undefined' && state?.auth?.role) || '').toLowerCase();
    if (typeof renderAppDrawer === 'function' && dashboardRole === 'admin') {
        renderAppDrawer();
    } else if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
    }
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const adminOverviewData = adminBuildOverviewData(todayStr, todayTime);
    const adminGlobalSearchPanel = typeof renderAdminGlobalSearchPanel === 'function' ? renderAdminGlobalSearchPanel() : '';

    const adminSystemGateHtml = `
        <div id="ap-system-gate" class="owner-brand-tabs ap-admin-app-gate ap-surface-toolbar ap-surface-toolbar--two" data-ap-system-gate="true" role="navigation" aria-label="시스템 전환">
            <button class="owner-brand-tab owner-brand-tab--current btn ap-surface-action ap-surface-action--current" type="button" aria-current="page" onclick="void(0)">AP MATH</button>
            <a class="owner-brand-tab btn ap-surface-action" href="../eie/index.html#dashboard" aria-label="EIE 대시보드로 이동">EIE</a>
        </div>
    `;

    const adminShortcutRow = `
        <div class="ap-admin-shortcuts ap-admin-action-grid ap-surface-toolbar ap-surface-toolbar--four" aria-label="원장님 바로가기">
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof openAttendanceLedger === 'function') openAttendanceLedger(); else toast('불러오기 실패', 'warn');">
                출석부
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof renderTimetable === 'function') renderTimetable(); else toast('불러오기 실패', 'warn');">
                시간표
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof openSchoolExamLedger === 'function') openSchoolExamLedger(); else toast('불러오기 실패', 'warn');">
                성적표
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="openAdminOperationMenu()">
                관리
            </button>
        </div>
    `;

    const todayOverviewHtml = renderAdminStudentOverviewPanel(adminOverviewData);
    const needCheckHtml = renderAdminNeedCheckPanel(adminOverviewData);
    const recentStudentsHtml = renderAdminNewStudentPanel(adminOverviewData);
    const recentConsultationHtml = renderAdminRecentConsultationPanel();

    const teacherCardsHtml = `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div style="margin-bottom:12px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">선생님 현황</h3>
            </div>
            <div class="ap-admin-teacher-grid" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:12px; align-items:stretch;">
                ${renderAdminTeacherCards(todayStr)}
            </div>
        </div>
    `;

    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');
    const adminWeeklyItems = [];

    (state.db.exam_schedules || [])
        .filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr)
        .forEach(e => adminWeeklyItems.push({ type: 'exam', date: e.exam_date, item: e }));

    (state.db.academy_schedules || [])
        .filter(s =>
            String(s.is_deleted || 0) !== '1' &&
            String(s.target_scope || 'global') === 'global' &&
            s.schedule_date >= todayStr &&
            s.schedule_date <= nextWeekStr
        )
        .forEach(s => adminWeeklyItems.push({ type: 'academy', date: s.schedule_date, item: s }));

    adminWeeklyItems.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

    const adminScheduleHtml = `
        <div class="ap-admin-section" style="margin-bottom:32px;">
            <h3 class="ap-admin-section-title" style="margin:0 0 12px 0; font-size:14px; font-weight:500; color:var(--secondary);">주간일정</h3>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${adminWeeklyItems.length > 0 ? adminWeeklyItems.map(w => {
                    const dateLabel = apFormatMonthDay(w.date) || w.date;
                    if (w.type === 'exam') {
                        const e = w.item;
                        const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:500;">${apEscapeHtml(e.grade)}</span> ` : '<span style="color:var(--secondary); font-weight:500;">학교공통</span> ';
                        return `<div style="display:flex; justify-content:space-between; align-items:center; min-height:52px; padding:0 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px; box-sizing:border-box;"><div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:11px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.10); padding:3px 8px; border-radius:8px; margin-right:6px;">시험</span><span style="font-weight:500; color:var(--text);">${apEscapeHtml(e.school_name)}</span> ${gradeLabel}${apEscapeHtml(e.exam_name)}</div><div style="color:var(--secondary); font-size:11px; font-weight:500; white-space:nowrap; background:var(--surface-2); border:1px solid var(--border); padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`;
                    }
                    const s = w.item;
                    const isClosed = s.schedule_type === 'closed' || s.is_closed === true || s.is_closed === 1;
                    const label = isClosed ? '휴무' : '기타';
                    const labelColor = isClosed ? 'var(--warning)' : 'var(--secondary)';
                    const labelBg = isClosed ? 'rgba(var(--warning-rgb),0.12)' : 'var(--surface-2)';
                    const title = s.title || (isClosed ? '휴무' : '일정');
                    return `<div style="display:flex; justify-content:space-between; align-items:center; min-height:52px; padding:0 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px; box-sizing:border-box;"><div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:11px; font-weight:500; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">${label}</span><span style="font-weight:500; color:var(--text);">${apEscapeHtml(title)}</span>${s.memo ? ` <span style="color:var(--secondary); font-weight:500;">${apEscapeHtml(s.memo)}</span>` : ''}</div><div style="color:var(--secondary); font-size:11px; font-weight:500; white-space:nowrap; background:var(--surface-2); border:1px solid var(--border); padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`;
                }).join('') : `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px; font-weight:500;">이번 주 예정된 일정이 없습니다.</div>`}
            </div>
        </div>
    `;
    
    const adminBottomSearchHtml = adminGlobalSearchPanel ? `
        <div class="ap-admin-bottom-search" aria-label="원장님 하단 검색">
            ${adminGlobalSearchPanel}
        </div>
    ` : '';
    const adminUnifiedStyle = `
        <style>
            #ap-admin-dashboard { width:100%; max-width:850px; margin:0 auto; padding:0 16px 24px; box-sizing:border-box; }
            #ap-admin-dashboard .card,
            #ap-admin-dashboard .ap-admin-card,
            #ap-admin-dashboard .ap-admin-mini-metric,
            #ap-admin-dashboard .ap-admin-check-item,
            #ap-admin-dashboard .ap-admin-search-row {
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface) !important;
                box-shadow:none !important;
                box-sizing:border-box !important;
            }
            #ap-admin-dashboard .card[onclick],
            #ap-admin-dashboard .ap-admin-card[onclick],
            #ap-admin-dashboard button {
                -webkit-tap-highlight-color:transparent;
            }
            @media (hover:hover) {
                #ap-admin-dashboard .card[onclick]:hover,
                #ap-admin-dashboard .ap-admin-card[onclick]:hover,
                #ap-admin-dashboard .ap-admin-teacher-card:hover {
                    transform:translateY(-1px);
                    border-color:var(--border) !important;
                }
            }
            #ap-admin-dashboard .ap-admin-section,
            #ap-admin-dashboard .ap-dashboard-section {
                border:0 !important;
                background:transparent !important;
                box-shadow:none !important;
                border-radius:0 !important;
                padding:0 !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts,
            #ap-admin-dashboard .ap-admin-app-gate {
                display:grid !important;
                gap:8px !important;
                padding:4px !important;
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface-2) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-overview-grid {
                display:grid !important;
                gap:8px !important;
                padding:4px !important;
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface-2) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts {
                grid-template-columns:repeat(4, minmax(0, 1fr));
                margin-bottom:18px !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts .btn,
            #ap-admin-dashboard .ap-admin-app-gate .btn {
                height:44px !important;
                min-height:44px !important;
                max-height:44px !important;
                padding:0 10px !important;
                border-radius:12px !important;
                border:1px solid var(--border) !important;
                background:var(--surface) !important;
                color:var(--text) !important;
                box-shadow:none !important;
                font-size:13px !important;
                font-weight:500 !important;
                line-height:1.2 !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts .ap-admin-action-card {
                height:44px !important;
                min-height:44px !important;
                max-height:44px !important;
                border-radius:12px !important;
                font-size:13px !important;
                font-weight:500 !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search {
                margin-top:30px !important;
                padding-top:4px !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search .ap-admin-global-search {
                width:100% !important;
                max-width:none !important;
                flex:0 0 auto !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search .ap-admin-global-search__field {
                height:48px !important;
                border-radius:16px !important;
            }
            #ap-admin-dashboard .ap-admin-summary-grid,
            #ap-admin-dashboard .ap-admin-teacher-grid {
                align-items:stretch !important;
            }
            #ap-admin-dashboard .ap-admin-summary-grid .card,
            #ap-admin-dashboard .ap-admin-mini-metric {
                min-height:44px !important;
                display:flex !important;
                flex-direction:column !important;
                align-items:center !important;
                justify-content:center !important;
                padding:0 10px !important;
            }
            #ap-admin-dashboard .ap-admin-assessment-card {
                min-height:44px !important;
                align-items:center !important;
                justify-content:center !important;
                padding:0 10px !important;
            }
            #ap-admin-dashboard .ap-admin-teacher-grid .card {
                min-height:164px !important;
                height:100% !important;
                display:flex !important;
                flex-direction:column !important;
                justify-content:space-between !important;
                padding:16px !important;
            }
            #ap-admin-dashboard .ap-admin-teacher-card .btn {
                background:var(--surface-2) !important;
                color:var(--text) !important;
                border:1px solid var(--border) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-section { margin-bottom:28px !important; }
            #ap-admin-dashboard .ap-admin-section-title { font-size:14px !important; font-weight:500 !important; letter-spacing:0 !important; }
            #ap-admin-dashboard .ap-admin-dashboard-head {
                position:relative;
            }
            #ap-admin-dashboard .ap-admin-global-search {
                position:relative;
                width:min(420px, 48vw);
                flex:0 1 420px;
                z-index:5;
            }
            #ap-admin-dashboard .ap-admin-global-search__field {
                position:relative;
                height:42px;
                border:1px solid var(--border);
                border-radius:999px;
                background:var(--surface);
                box-shadow:none;
                overflow:hidden;
            }
            #ap-admin-dashboard .ap-admin-global-search__icon {
                position:absolute;
                left:14px;
                top:50%;
                transform:translateY(-50%);
                color:var(--secondary);
                pointer-events:none;
            }
            #ap-admin-dashboard .ap-admin-global-search__results {
                display:none;
                position:absolute;
                top:48px;
                left:0;
                right:0;
                flex-direction:column;
                gap:7px;
                padding:8px;
                border:1px solid var(--border);
                border-radius:16px;
                background:var(--surface);
                box-shadow:0 12px 28px rgba(15,23,42,0.12);
                max-height:320px;
                overflow-y:auto;
            }
            #ap-admin-dashboard .ap-admin-global-search:focus-within .ap-admin-global-search__results {
                display:flex;
            }
            #ap-admin-dashboard .ap-admin-recent-student-grid {
                display:grid !important;
                grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
                gap:1px !important;
                max-height:360px !important;
                overflow:auto !important;
                background:rgba(15,23,42,0.08) !important;
            }
            #ap-admin-dashboard .ap-admin-recent-student-grid > * {
                background:var(--surface) !important;
            }
            #ap-admin-dashboard .ap-admin-recent-student-row:hover {
                background:var(--surface-2) !important;
            }

            #ap-admin-dashboard .ap-admin-overview-grid {
                grid-template-columns:repeat(4, minmax(0, 1fr)) !important;
            }
            @media (max-width:1024px) and (min-width:721px) {
                #ap-admin-dashboard .ap-admin-teacher-grid { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
            }
            #ap-admin-dashboard .ap-admin-check-item {
                -webkit-tap-highlight-color:transparent;
            }
            #ap-admin-dashboard .ap-admin-check-grid {
                grid-template-columns:repeat(3, minmax(0, 1fr)) !important;
            }
            @media (max-width:720px) {
                #ap-admin-dashboard .ap-admin-dashboard-head { flex-direction:column !important; align-items:stretch !important; gap:10px !important; }
                #ap-admin-dashboard .ap-admin-global-search { width:100% !important; flex:0 0 auto !important; }
                #ap-admin-dashboard .ap-admin-shortcuts { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
                #ap-admin-dashboard .ap-admin-overview-grid { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
                #ap-admin-dashboard .ap-admin-teacher-grid { grid-template-columns:1fr !important; }
                #ap-admin-dashboard .ap-admin-recent-student-grid { grid-template-columns:1fr !important; max-height:420px !important; }
                #ap-admin-dashboard .ap-admin-check-grid { grid-template-columns:1fr !important; }
                #ap-admin-dashboard .ap-admin-check-item { min-height:50px !important; }
            }
            @media (max-width:480px) {
                #ap-admin-dashboard { padding-left:14px !important; padding-right:14px !important; }
                #ap-admin-dashboard .ap-admin-shortcuts { gap:6px !important; }
                #ap-admin-dashboard .ap-admin-shortcuts .btn { font-size:13px !important; padding:0 8px !important; }
                #ap-admin-dashboard .ap-admin-summary-grid { gap:8px !important; }
                #ap-admin-dashboard .ap-admin-summary-grid .card { min-height:78px !important; }
            }
        </style>
    `;

    root.innerHTML = `<div id="ap-admin-dashboard" class="owner-dashboard-shell">
        ${adminUnifiedStyle}
        ${adminSystemGateHtml}
        ${adminShortcutRow}
        <div id="ap-admin-diagnostic-alert-anchor"></div>
        ${todayOverviewHtml}
        ${teacherCardsHtml}
        ${recentConsultationHtml}
        ${recentStudentsHtml}
        ${needCheckHtml}
        ${adminScheduleHtml}
        ${adminBottomSearchHtml}
    </div>`;

    if (typeof apRefreshPublicInquiryFloating === 'function') {
        apRefreshPublicInquiryFloating(0);
    }
    if (typeof apRenderAdminDiagnosticAssessmentAlert === 'function') {
        apRenderAdminDiagnosticAssessmentAlert();
    }
}

function renderAdminStudentSearch() {
    const keyword = document.getElementById('admin-search-input').value.trim().toLowerCase();
    const resultArea = document.getElementById('admin-search-results');
    if (!keyword) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">검색어를 입력하세요.</div>`; return; }
    
    const results = state.db.students.filter(s => s.name.toLowerCase().includes(keyword));
    if (results.length === 0) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">일치하는 학생이 없습니다.</div>`; return; }
    
    resultArea.innerHTML = results.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div><span style="font-size:13px; color:var(--text);; font-weight:500;">${apEscapeHtml(s.name)}</span> <span style="font-size:11px; color:var(--secondary); margin-left:6px;">${apEscapeHtml(cName)} | ${apEscapeHtml(s.status)}</span></div>
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</button>
            </div>
        `;
    }).join('');
}


// --- Teacher Dashboard 공통 함수 ---


























// [Partner B] 필수 입력 제거: 날짜만 있으면 저장 가능




// [Phase 4/5] 글로벌 진입점
function openGlobalExamGradeView() {
    const classes = state.db.classes.filter(c => Number(c.is_active) !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:16px; margin-bottom:10px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); if(typeof openExamGradeView==='function') openExamGradeView('${c.id}')">
            <span style="font-weight:500; font-size:15px; color:var(--text);">${apEscapeHtml(c.name)}</span>
            <span style="font-size:12px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); padding:4px 10px; border-radius:8px;">${apEscapeHtml(c.grade)}</span>
        </button>
    `).join('');
    showModal('반별 시험성적', `
        <div style="margin-bottom:16px; font-size:13px; color:var(--secondary); font-weight:500;">조회할 반을 선택하세요.</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${rows || `<div style="text-align:center; color:var(--secondary); padding:30px; font-size:13px; font-weight:500;">담당 반이 없습니다.</div>`}</div>
    `);
}

function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncStatusText = qLen > 0 ? `대기 ${qLen}건` : '대기 없음';
    const onlineStatusText = isOnline ? '연결됨' : '오프라인';

    showModal('시스템·동기화 상태', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:16px; border-radius:14px; background:var(--surface-2); border:none;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:500; margin-bottom:8px; color:var(--secondary);"><span>네트워크</span><span style="color:${isOnline ? 'var(--success)' : 'var(--error)'}; font-weight:500;">${onlineStatusText}</span></div>
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:500; margin-bottom:16px; color:var(--secondary);"><span>미전송 데이터</span><span style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}; font-weight:500;">${syncStatusText}</span></div>
                <button class="btn btn-primary" style="width:100%; font-size:14px; font-weight:500; padding:12px; border-radius:10px;" onclick="if(typeof processSyncQueue==='function') processSyncQueue(); closeModal();">지금 동기화 시도</button>
            </div>
        </div>
    `);
}

function getClassGradeRank(grade) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.indexOf(grade);
    return idx >= 0 ? idx : 99;
}

function sortClassesForDashboard(classes) {
    return [...classes].sort((a, b) => {
        const aToday = isClassScheduledTodayForDashboard(a.id) ? 0 : 1;
        const bToday = isClassScheduledTodayForDashboard(b.id) ? 0 : 1;
        if (aToday !== bToday) return aToday - bToday;
        const aRank = getClassGradeRank(a.grade);
        const bRank = getClassGradeRank(b.grade);
        if (aRank !== bRank) return aRank - bRank;
        return (a.name || '').localeCompare(b.name || '');
    });
}

function computeDashboardData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    
    const scheduledActiveStudents = activeStudents.filter(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && Number(cls.is_active) === 0) return false;
        return isClassScheduledTodayForDashboard(cid);
    });
    
    const scheduledIds = new Set(scheduledActiveStudents.map(s => s.id));
    
    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && scheduledIds.has(a.student_id)).length;
    const presentCount = scheduledActiveStudents.length - absentCount;
    
    const hwNotDoneCount = state.db.homework.filter(h => h.date === today && h.status === '미완료' && scheduledIds.has(h.student_id)).length;

    const todoCount = state.db.operation_memos.filter(m => {
        const isDone = m.is_done == 1 || m.is_done === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return !isDone && (isPinned || m.memo_date === today);
    }).length;

    const classSummaries = {};
    state.db.classes.filter(c => Number(c.is_active) !== 0).forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id);
        const cActiveIds = activeStudents.filter(s => cIds.includes(s.id)).map(s => s.id);
        let cMiss=0, cAbs=0;
        
        cActiveIds.forEach(id => {
            const att = state.db.attendance.find(a => a.student_id===id && a.date===today);
            if (att?.status === '결석') cAbs++;
            
            const hw = state.db.homework.find(h => h.student_id===id && h.date===today);
            if (hw?.status === '미완료') cMiss++;
        });
        
        let cPre = cActiveIds.length - cAbs;
        classSummaries[c.id] = { activeCount: cActiveIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, isScheduled: isClassScheduledTodayForDashboard(c.id) };
    });

    return { 
        global: { 
            totalActive: activeStudents.length, 
            scheduledActive: scheduledActiveStudents.length, 
            presentCount, 
            absentCount, 
            hwNotDoneCount,
            todoCount
        }, 
        classSummaries 
    };
}

function openDashboardClass(cid) {
    const safeCid = String(cid || '');
    if (!safeCid) {
        toast('학급 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    if (!state.ui) state.ui = {};
    state.ui.currentClassId = safeCid;

    if (typeof renderClass === 'function') {
        renderClass(safeCid);
        return;
    }

    if (typeof window !== 'undefined' && typeof window.renderClass === 'function') {
        window.renderClass(safeCid);
        return;
    }

    console.error('[AP Math OS] renderClass is not available. classroom.js load/order check required.', safeCid);
    toast('학급 화면 모듈을 불러오지 못했습니다.', 'error');
}

// [POLISH] 학급 카드: 수평적 미니멀리즘 레이아웃
function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id];
    if (!s) return '';

    const safeCid = dashboardEscapeAttr(cls.id);
    const safeName = apEscapeHtml(cls.name || '');

    if (!s.isScheduled) {
        return `
            <div class="ap-class-row ap-class-row--empty" onclick="openDashboardClass('${safeCid}')">
                <div class="ap-class-row__name ap-class-row__name--inactive">${safeName}</div>
                <div class="ap-class-row__meta">수업 없음</div>
            </div>
        `;
    }

    return `
        <div class="ap-class-row ap-class-row--scheduled" onclick="openDashboardClass('${safeCid}')">
            <div class="ap-class-row__name">${safeName}</div>
            <div class="ap-class-row__chips" aria-label="${safeName} 출결 요약">
                <span class="ap-class-chip">재원 ${apEscapeHtml(String(s.activeCount))}</span>
                <span class="ap-class-chip">등원 ${apEscapeHtml(String(s.present))}</span>
                <span class="ap-class-chip">결석 ${apEscapeHtml(String(s.absent))}</span>
            </div>
        </div>
    `;
}

// [POLISH] 일정 섹션: 오렌지(오늘) vs 보라(주간) 은은한 컬러 분리
function renderTodoSections() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');
    const getMemoDate = (m) => String(m.memo_date || m.memoDate || m.date || '').split('T')[0].split(' ')[0];
    const isMemoDone = (m) => m.is_done == 1 || m.is_done === true || m.isDone === true;
    const isMemoPinned = (m) => m.is_pinned == 1 || m.is_pinned === true || m.isPinned === true;

    const rowBase = `
        height:52px;
        min-height:52px;
        max-height:52px;
        padding:0 16px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        box-sizing:border-box;
        overflow:hidden;
    `;

    const todayMemos = state.db.operation_memos.filter(m => {
        const memoDate = getMemoDate(m);
        return !isMemoDone(m) && (isMemoPinned(m) || memoDate === todayStr);
    });
    
    const upcomingExams = state.db.exam_schedules.filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr);
    const upcomingAcademySchedules = (state.db.academy_schedules || []).filter(s =>
        String(s.is_deleted || 0) !== '1' &&
        String(s.target_scope || 'global') === 'global' &&
        s.schedule_date >= todayStr &&
        s.schedule_date <= nextWeekStr
    );

    const todayHtml = todayMemos.length ? todayMemos.map(m => {
        const isPinned = isMemoPinned(m);
        return `
        <div style="${rowBase} border-bottom:1px solid rgba(99,102,241,0.1); background:transparent;">
            <label onclick="event.stopPropagation()" style="display:flex; align-items:center; gap:12px; flex:1; min-width:0; cursor:pointer;">
                <input type="checkbox" onclick="event.stopPropagation()" onchange="toggleMemoDone('${m.id}', this.checked)" style="transform:scale(1.15); margin:0; accent-color:#6366f1; flex-shrink:0;">
                <span style="font-size:13px; font-weight:400; color:var(--text); ${isPinned ? 'color:var(--text);' : ''} white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                    ${isPinned ? `<span style="background:var(--surface-2); border:1px solid var(--border); padding:2px 6px; border-radius:10px; font-size:11px; margin-right:6px;">고정</span> ` : ''}${apEscapeHtml(m.content)}
                </span>
            </label>
        </div>
    `}).join('') : `<div style="${rowBase} justify-content:center; font-size:13px; font-weight:400; color:var(--secondary); text-align:center;">오늘 등록된 할 일이 없습니다.</div>`;

    let upcomingHtml = '';
    const upcomingItems = [];
    upcomingExams.forEach(e => upcomingItems.push({ type: 'exam', date: e.exam_date, item: e }));
    upcomingAcademySchedules.forEach(s => upcomingItems.push({ type: 'academy', date: s.schedule_date, item: s }));
    
    upcomingItems.sort((a,b) => a.date.localeCompare(b.date));

    if (upcomingItems.length) {
        upcomingHtml = upcomingItems.slice(0, 5).map(u => {
            const timeVal = apParseLocalDateTime(u.date);
            const diffTime = timeVal !== null ? (timeVal - todayTime) : 0;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dDay = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;

            if (u.type === 'exam') {
                const e = u.item;
                const displayTitle = e.exam_name ? `${apEscapeHtml(e.school_name || '일반')} ${apEscapeHtml(e.grade || '')} ${apEscapeHtml(e.exam_name)}` : `${apEscapeHtml(e.school_name || '일정 확인')}`;
                return `<div onclick="event.stopPropagation(); openExamScheduleModal()" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid var(--border); background:transparent;">
                    <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${displayTitle}</div>
                    <span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${dDay}</span>
                </div>`;
            }

            const s = u.item;
            const isClosed = s.schedule_type === 'closed' || s.is_closed === true || s.is_closed === 1;
            const label = isClosed ? '휴무' : '기타';
            const labelColor = isClosed ? 'var(--warning)' : 'var(--secondary)';
            const labelBg = isClosed ? 'rgba(var(--warning-rgb),0.12)' : 'var(--surface-2)';
            const title = s.title || (isClosed ? '휴무' : '일정');
            return `<div onclick="event.stopPropagation(); openExamScheduleModal()" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid var(--border); background:transparent;">
                <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">${label}</span>${apEscapeHtml(title)}${s.memo ? ` <span style="color:var(--secondary); font-weight:400;">${apEscapeHtml(s.memo)}</span>` : ''}</div>
                <span style="font-size:12px; background:var(--surface-2); color:var(--secondary); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${dDay}</span>
            </div>`;
        }).join('');
    }

    const onboardingWeeklyHtml = typeof renderOnboardingWeeklyScheduleRows === 'function' ? renderOnboardingWeeklyScheduleRows() : '';
    const onboardingWeeklyCount = typeof getDashboardWeeklyOnboardingTasks === 'function' ? getDashboardWeeklyOnboardingTasks().length : 0;
    const hasCleaningSchedule = true;
    const hasWeeklyItems = upcomingItems.length > 0 || onboardingWeeklyCount > 0 || hasCleaningSchedule;

    // 청소 당번 계산 (매주 월요일 기준 순환)
    const CLEANING_ROSTER = ['정겨운', '박준성', '정의한', '원장님'];
    const CLEANING_REF_MONDAY = new Date('2026-06-09T00:00:00'); // 기준: 박준성(index 1)
    const todayDate = new Date(todayStr + 'T00:00:00');
    const todayDay = todayDate.getDay(); // 0=일,1=월,...,6=토
    const diffToMonday = todayDay === 0 ? -6 : 1 - todayDay;
    const thisMonday = new Date(todayDate);
    thisMonday.setDate(todayDate.getDate() + diffToMonday);
    const weekDiff = Math.round((thisMonday - CLEANING_REF_MONDAY) / (7 * 24 * 60 * 60 * 1000));
    const cleaningPerson = CLEANING_ROSTER[((1 + weekDiff) % 4 + 4) % 4];
    const iconTools = typeof apDashIcon === 'function' ? apDashIcon('tools', 14) : '';
    const iconCalendar = typeof apDashIcon === 'function' ? apDashIcon('calendar', 28) : '';
    const iconSpeaker = typeof apDashIcon === 'function' ? apDashIcon('speakerphone', 14) : '';

    // G. 좌: 고정 루틴(청소 당번 + 신입생 상담 등 반복 항목) / 우: 학원 공지(예정 일정, 빈 상태 처리)
    const cleaningHtml = `
        <p><span style="color:var(--secondary);">${iconTools}</span> 청소 당번: <strong style="color:var(--primary);">${apEscapeHtml(cleaningPerson)}</strong></p>
        <span class="ap-split-meta">매주 월요일</span>`;

    // 공지 컨테이너는 항상 렌더(비동기 신입생 상담 행 주입 대상). 빈 안내는 토글.
    const noticeEmpty = !(upcomingHtml || onboardingWeeklyHtml);
    const noticeHtml = `
        ${upcomingHtml || ''}
        <div id="dashboard-onboarding-weekly-items">${onboardingWeeklyHtml}</div>
        <p id="weekly-notice-empty" class="ap-empty-notice"${noticeEmpty ? '' : ' style="display:none;"'}>등록된 공지가 없습니다.</p>`;

    // F. 오늘일정 빈 상태 + 인라인 폼 (페이지 전환 없이 펼침)
    const todayBodyHtml = todayMemos.length
        ? `<div class="ap-dashboard-surface-list ap-dashboard-surface-list--today" onclick="openTodoMemoModal()" style="cursor:pointer; overflow:hidden; border-radius:6px; border:1px solid var(--border); background:var(--surface);">${todayHtml}</div>`
        : `<div class="ap-empty-state">
                <span class="ap-empty-icon">${iconCalendar}</span>
                <p>오늘 등록된 일정이 없습니다.</p>
                <button type="button" class="ap-inline-btn ap-inline-btn--ghost" onclick="apDashToggleScheduleForm(this)">+ 일정 추가</button>
           </div>
           <div id="ap-dash-inline-form" class="ap-inline-form" style="display:none;">
                <input type="date" id="ap-dash-inline-date" value="${todayStr}">
                <input type="text" id="ap-dash-inline-content" placeholder="일정 내용"
                       onkeydown="if(event.key==='Enter') apDashSaveInlineSchedule();">
                <button type="button" class="ap-inline-btn" onclick="apDashSaveInlineSchedule()">저장</button>
           </div>`;

    return `
        <section class="ap-dash-card">
            <h3 class="ap-dash-card__title">오늘일정</h3>
            ${todayBodyHtml}
        </section>

        <section class="ap-dash-card" id="dashboard-weekly-schedule-section" data-regular-weekly-count="${upcomingItems.length}" data-has-cleaning-schedule="${hasCleaningSchedule ? '1' : '0'}">
            <h3 class="ap-dash-card__title">주간일정</h3>
            <div id="dashboard-weekly-schedule-list" class="ap-weekly-split">
                <div class="ap-split-cell">
                    <p class="ap-split-label">고정 루틴</p>
                    ${cleaningHtml}
                </div>
                <div class="ap-split-cell">
                    <p class="ap-split-label"><span style="color:var(--secondary);">${iconSpeaker}</span> 학원 공지</p>
                    ${noticeHtml}
                </div>
            </div>
        </section>
    `;
}

// [NEW] 오늘일지 카드 생성 함수 (요일 필터 정밀 적용)

function renderTodayJournalCard(data) {
    injectDashboardOpsStyles();
    return `
        <section id="ap-dash-journal-section" class="ap-dash-card">
            <h3 class="ap-dash-card__title">오늘일지</h3>
            ${renderDashboardJournalWeekMatrix('', new Date().toLocaleDateString('sv-SE'))}
        </section>
    `;
}


// [POLISH] 메인 대시보드: 제목 규격화 및 마감 배너 시각적 축소

function ensureDashboardOnboardingState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.dashboardOnboardingTasks) {
        state.ui.dashboardOnboardingTasks = {
            loading: false,
            loadedAt: 0,
            tasks: [],
            inFlight: null,
            selectedTaskId: '',
            error: ''
        };
    }
    return state.ui.dashboardOnboardingTasks;
}

async function fetchOnboardingTasks() {
    const store = ensureDashboardOnboardingState();
    if (store.inFlight) return store.inFlight;
    store.loading = true;
    const promise = api.get('onboarding/tasks')
        .then(res => {
            store.tasks = Array.isArray(res?.tasks) ? res.tasks : [];
            store.loadedAt = Date.now();
            return store.tasks;
        })
        .catch(err => {
            console.error('[fetchOnboardingTasks] failed:', err);
            store.tasks = [];
            store.error = '신입생 상담 일정을 불러오지 못했습니다.';
            return [];
        })
        .finally(() => {
            store.loading = false;
            store.inFlight = null;
        });
    store.inFlight = promise;
    return promise;
}

function getOnboardingTaskLabel(task) {
    const type = String(task?.task_type || '');
    if (type === 'intro') return '신입생 상담';
    if (type === 'week1') return '1주차 상담';
    if (type === 'month1') return '1개월 상담';
    return '신입생 상담';
}

function getOnboardingPanelGuide(task) {
    const type = String(task?.task_type || '');
    if (type === 'intro') {
        return {
            purpose: '신입생과 학부모님이 학원에 처음 안착하는 첫 단계입니다.',
            guide: '첫 수업 요일과 시간, 준비물, 교재 흐름을 짧게 확인해 주세요.\n학부모님께는 부담스럽지 않게 담임 인사 정도로 안내하면 충분합니다.'
        };
    }
    if (type === 'week1') {
        return {
            purpose: '첫 주 수업을 지나며 학원 수업과 숙제 흐름에 무리 없이 적응하고 있는지 확인하는 단계입니다.',
            guide: '수업 집중도, 숙제 적응, 등원 후 집에서 보이는 반응을 가볍게 확인해 주세요.\n필요하면 학생 상담 탭에 상담 기록을 남기면 됩니다.'
        };
    }
    return {
        purpose: '한 달간의 수업 흐름을 바탕으로 앞으로의 공부 방향을 한 번 정리해 주는 단계입니다.',
        guide: '좋았던 점, 더 볼 부분, 다음 달 지도 방향을 중심으로 확인해 주세요.\n실제 상담 기록은 학생 상담 탭에서 남깁니다.'
    };
}

function getDashboardOnboardingDate(value) {
    const text = String(value || '').trim().split('T')[0].split(' ')[0];
    return apParseLocalDateTime(text);
}

function getDashboardOnboardingDueLabel(task) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    const dueTime = getDashboardOnboardingDate(task?.due_date);
    if (todayTime === null || dueTime === null) return '';
    const diffDays = Math.round((dueTime - todayTime) / (24 * 60 * 60 * 1000));
    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return `D+${Math.abs(diffDays)}`;
}

function getDashboardWeeklyOnboardingTasks(tasks = null) {
    const source = Array.isArray(tasks) ? tasks : (ensureDashboardOnboardingState().tasks || []);
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    if (todayTime === null) return [];
    const minTime = todayTime - 3 * 24 * 60 * 60 * 1000;
    const maxTime = todayTime + 3 * 24 * 60 * 60 * 1000;

    return source
        .filter(task => {
            const status = String(task?.status || task?.effective_status || '');
            if (status === 'completed' || status === 'skipped') return false;

            const visibleTime = getDashboardOnboardingDate(task?.visible_from);
            const dueTime = getDashboardOnboardingDate(task?.due_date);
            if (visibleTime !== null && visibleTime > todayTime) return false;
            if (dueTime === null) return false;
            return dueTime >= minTime && dueTime <= maxTime;
        })
        .sort((a, b) =>
            String(a?.due_date || '').localeCompare(String(b?.due_date || '')) ||
            Number(a?.task_order || 0) - Number(b?.task_order || 0) ||
            String(a?.student_name || '').localeCompare(String(b?.student_name || ''), 'ko')
        );
}

function renderOnboardingWeeklyScheduleRows(tasks = null) {
    const visibleTasks = getDashboardWeeklyOnboardingTasks(tasks);
    if (!visibleTasks.length) return '';

    const rowBase = `
        height:52px;
        min-height:52px;
        max-height:52px;
        padding:0 16px;
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:12px;
        box-sizing:border-box;
        overflow:hidden;
    `;

    return visibleTasks.map(task => {
        const taskId = apEscapeHtml(String(task?.id || ''));
        const label = getOnboardingTaskLabel(task);
        const studentName = task?.student_name || '학생';
        const className = task?.class_name || '';
        const dueLabel = getDashboardOnboardingDueLabel(task);

        return `<div onclick="event.stopPropagation(); openOnboardingTask('${taskId}')" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid rgba(15,23,42,0.08); background:transparent;">
            <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                <span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">상담</span>${apEscapeHtml(label)} · ${apEscapeHtml(studentName)}${className ? ` <span style="color:var(--secondary); font-weight:400;">${apEscapeHtml(className)}</span>` : ''}
            </div>
            ${dueLabel ? `<span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${apEscapeHtml(dueLabel)}</span>` : ''}
        </div>`;
    }).join('');
}

function getSelectedOnboardingTask() {
    const store = ensureDashboardOnboardingState();
    return (store.tasks || []).find(task => String(task?.id || '') === String(store.selectedTaskId || '')) || null;
}

function openOnboardingTask(taskId) {
    const store = ensureDashboardOnboardingState();
    store.selectedTaskId = String(taskId || '');
    store.error = '';
    updateDashboardOnboardingTasksSection();
}

function closeOnboardingTaskPanel() {
    const store = ensureDashboardOnboardingState();
    store.selectedTaskId = '';
    store.error = '';
    updateDashboardOnboardingTasksSection();
}

function openOnboardingStudentConsultation(taskId) {
    const store = ensureDashboardOnboardingState();
    const task = (store.tasks || []).find(row => String(row?.id || '') === String(taskId || ''));
    const studentId = String(task?.student_id || '');
    if (!studentId) {
        if (typeof toast === 'function') toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    store.selectedTaskId = '';
    store.error = '';
    updateDashboardOnboardingTasksSection();

    if (typeof openStudentDetail === 'function') {
        openStudentDetail(studentId, { mode: 'view', tab: 'cns', returnTo: { type: 'dashboard' } });
        return;
    }
    if (typeof renderStudentDetailTab === 'function') {
        renderStudentDetailTab(studentId, 'cns');
        return;
    }

    if (typeof toast === 'function') toast('학생 상담 탭을 열 수 없습니다.', 'warn');
}

async function hideOnboardingTask(taskId) {
    const store = ensureDashboardOnboardingState();
    const task = (store.tasks || []).find(row => String(row?.id || '') === String(taskId || ''));
    if (!task) return;

    try {
        const result = await api.post(`onboarding/tasks/${taskId}/skip`, {});
        if (result?.success) {
            store.selectedTaskId = '';
            store.error = '';
            await refreshOnboardingTasksAfterAction();
            return;
        }
        store.error = result?.error || '숨김 처리에 실패했습니다.';
    } catch (err) {
        console.error('[hideOnboardingTask] failed:', err);
        store.error = '숨김 처리에 실패했습니다.';
    }
    updateDashboardOnboardingTasksSection();
}

async function refreshOnboardingTasksAfterAction() {
    const store = ensureDashboardOnboardingState();
    store.inFlight = null;
    await fetchOnboardingTasks();
    updateDashboardOnboardingTasksSection();
}

function renderOnboardingPanel() {
    const store = ensureDashboardOnboardingState();
    const task = getSelectedOnboardingTask();
    if (!task) return '';

    const guide = getOnboardingPanelGuide(task);
    const taskId = apEscapeHtml(String(task.id || ''));
    const title = `${getOnboardingTaskLabel(task)} · ${task.student_name || ''}`.trim();

    return `<div class="ap-onboarding-panel-backdrop" style="position:fixed; inset:0; z-index:80; background:rgba(15,23,42,0.10);" onclick="closeOnboardingTaskPanel()"></div>
        <aside class="ap-onboarding-panel" style="position:fixed; top:0; right:0; bottom:0; z-index:81; width:min(420px, 100vw); background:var(--surface); border-left:1px solid var(--border); box-shadow:-12px 0 30px rgba(15,23,42,0.12); display:flex; flex-direction:column;">
            <div style="padding:16px 18px 12px; border-bottom:1px solid var(--border); display:flex; gap:12px; justify-content:space-between; align-items:flex-start;">
                <div style="min-width:0;">
                    <div style="font-size:15px; font-weight:500; color:var(--text); line-height:1.4; overflow-wrap:anywhere;">${apEscapeHtml(title)}</div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5; margin-top:3px;">${apEscapeHtml(task.class_name || '')}</div>
                </div>
                <button type="button" class="btn apms-button apms-button--quiet" style="width:34px; height:34px; min-height:34px; padding:0; border-radius:10px;" onclick="closeOnboardingTaskPanel()">×</button>
            </div>
            <div style="padding:16px 18px 18px; overflow:auto; display:flex; flex-direction:column; gap:14px;">
                <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.4;">상담 가이드</div>
                <section style="padding:14px; border:1px solid var(--border); border-radius:14px; background:var(--surface-2); display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:5px;">목적</div>
                        <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.65; white-space:pre-wrap;">${apEscapeHtml(guide.purpose)}</div>
                    </div>
                    <div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:5px;">확인할 것</div>
                        <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.65; white-space:pre-wrap;">${apEscapeHtml(guide.guide)}</div>
                    </div>
                </section>
                <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.6;">실제 상담 기록은 학생 상담 탭에서 남깁니다. 숨김은 주간일정에서만 사라지며 상담 기록을 만들지 않습니다.</div>
                ${store.error ? `<div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(store.error)}</div>` : ''}
            </div>
            <div style="padding:12px 18px 18px; border-top:1px solid var(--border); display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button type="button" class="btn apms-button apms-button--quiet" style="min-height:40px; border-radius:10px; font-size:13px; font-weight:500;" onclick="openOnboardingStudentConsultation('${taskId}')">상담</button>
                <button type="button" class="btn apms-button apms-button--quiet" style="min-height:40px; border-radius:10px; font-size:13px; font-weight:500;" onclick="hideOnboardingTask('${taskId}')">숨김</button>
            </div>
        </aside>`;
}

function updateDashboardOnboardingTasksSection() {
    const weeklyTarget = document.getElementById('dashboard-onboarding-weekly-items');
    const weeklySection = document.getElementById('dashboard-weekly-schedule-section');
    const onboardingHtml = renderOnboardingWeeklyScheduleRows();
    const onboardingCount = getDashboardWeeklyOnboardingTasks().length;

    if (weeklyTarget) weeklyTarget.innerHTML = onboardingHtml;
    if (weeklySection) {
        const regularCount = Number(weeklySection.dataset.regularWeeklyCount || 0);
        const hasCleaningSchedule = weeklySection.dataset.hasCleaningSchedule === '1';
        weeklySection.style.display = (regularCount > 0 || onboardingCount > 0 || hasCleaningSchedule) ? '' : 'none';
        // G. 학원 공지 빈 안내 토글 (예정 일정 + 비동기 상담 행 기준)
        const noticeEmpty = document.getElementById('weekly-notice-empty');
        if (noticeEmpty) noticeEmpty.style.display = (regularCount > 0 || onboardingCount > 0) ? 'none' : '';
    }

    const panelTarget = document.getElementById('dashboard-onboarding-panel-root') || document.getElementById('dashboard-onboarding-tasks-root');
    if (panelTarget) panelTarget.innerHTML = renderOnboardingPanel();
}

function queueDashboardOnboardingTasksLoad() {
    const store = ensureDashboardOnboardingState();
    updateDashboardOnboardingTasksSection();
    if (store.loading) return;
    const now = Date.now();
    if (store.loadedAt && now - store.loadedAt < 60 * 1000) return;
    fetchOnboardingTasks().then(updateDashboardOnboardingTasksSection);
}
function renderDashboard() {
    const role = state?.auth?.role;

    if (role !== 'admin' && typeof apRemovePublicInquiryFloating === 'function') {
        apRemovePublicInquiryFloating();
    }

    // 원장님: admin 전용 대시보드 (AP MATH / EIE 게이트 포함)
    if (role === 'admin') {
        if (typeof renderAdminDashboardView === 'function') {
            return renderAdminDashboardView();
        }
        // fallback: 게이트 없이 기존 원장님 화면
        if (typeof renderAdminControlCenter === 'function') {
            return renderAdminControlCenter();
        }
        return;
    }

    // 영어관 선생님은 APMS 선생님 화면을 렌더링하지 않고 전용 화면으로 보낸다.
    if (role === 'eieteacher') {
        if (typeof removeAppDrawer === 'function') removeAppDrawer();
        if (typeof window !== 'undefined') {
            window.location.href = '../eie/index.html#dashboard';
        }
        return;
    }

    // AP 선생님 / 일반 teacher: 선생님 전용 대시보드
    if (typeof renderTeacherDashboardView === 'function') {
        return renderTeacherDashboardView();
    }

    // fallback: dashboard-teacher.js 미로드 시 기존 선생님 화면 직접 렌더링
    state.ui.currentClassId = null;
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.add('ap-teacher-dashboard-mode');
        document.body.classList.remove('ap-owner-dashboard-bg');
    }
    if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('#ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
    }
    const data = computeDashboardData();
    const root = document.getElementById('app-root');

    const shortcutRow = `
        <div class="ap-dashboard-shortcuts ap-dashboard-action-grid ap-dashboard-action-grid--teacher-quick ap-surface-toolbar ap-surface-toolbar--three">
            <button class="btn ap-dashboard-action-button ap-surface-action"
                    onclick="if(typeof renderTimetable === 'function') renderTimetable(); else toast('불러오기 실패', 'warn');">
                시간표
            </button>
            <button class="btn ap-dashboard-action-button ap-surface-action"
                    onclick="if(typeof openAttendanceLedger === 'function') openAttendanceLedger(); else toast('불러오기 실패', 'warn');">
                출석부
            </button>
            <button class="btn ap-dashboard-action-button ap-surface-action"
                    onclick="openDashboardArchiveWindow(event);">
                아카이브
            </button>
        </div>
    `;

    const todayJournalCard = typeof renderTodayJournalCard === 'function' ? renderTodayJournalCard(data) : '';
    const todoSections = renderTodoSections();

    if (!state.ui.dashboardClassTab) state.ui.dashboardClassTab = 'all';
    const tab = state.ui.dashboardClassTab;

    const tabHtml = `
        <div class="ap-dashboard-tabbar" style="display:flex; gap:8px; background:var(--surface-2); padding:4px; border-radius:12px; margin-bottom:12px;">
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab==='all'?'var(--surface)':'transparent'}; color:${tab==='all'?'var(--text)':'var(--secondary)'}; box-shadow:${tab==='all'?'0 1px 2px rgba(0,0,0,0.05)':'none'}; border:none;" onclick="state.ui.dashboardClassTab='all'; renderDashboard()">전체</button>
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab==='middle'?'var(--surface)':'transparent'}; color:${tab==='middle'?'var(--text)':'var(--secondary)'}; box-shadow:${tab==='middle'?'0 1px 2px rgba(0,0,0,0.05)':'none'}; border:none;" onclick="state.ui.dashboardClassTab='middle'; renderDashboard()">중등</button>
            <button class="btn" style="flex:1; height:44px; min-height:44px; max-height:44px; padding:0 12px; border-radius:10px; font-size:13px; font-weight:500; background:${tab==='high'?'var(--surface)':'transparent'}; color:${tab==='high'?'var(--text)':'var(--secondary)'}; box-shadow:${tab==='high'?'0 1px 2px rgba(0,0,0,0.05)':'none'}; border:none;" onclick="state.ui.dashboardClassTab='high'; renderDashboard()">고등</button>
        </div>
    `;

    let filteredClasses = sortClassesForDashboard(state.db.classes.filter(c => Number(c.is_active) !== 0));
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
        <div id="dashboard-onboarding-tasks-root"></div>
        ${todoSections}
        ${classStatus}
    </div>`;
    queueDashboardOnboardingTasksLoad();
}

// [RESTORE] computeTodayCloseData: 원본 복구

function computeTodayCloseData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const students = state?.db?.students || [];
    const classStudents = state?.db?.class_students || [];
    const classes = state?.db?.classes || [];
    const attendance = state?.db?.attendance || [];
    const homework = state?.db?.homework || [];

    const scheduledActive = students.filter(s => {
        if (String(s?.status || '') !== '재원') return false;
        const cid = classStudents.find(m => String(m?.student_id) === String(s?.id))?.class_id;
        const cls = classes.find(c => String(c?.id) === String(cid || ''));
        if (cls && Number(cls.is_active) === 0) return false;
        return isClassScheduledTodayForDashboard(cid);
    });

    const absents = [];
    const hwMisses = [];

    scheduledActive.forEach(s => {
        const cid = classStudents.find(m => String(m?.student_id) === String(s?.id))?.class_id;
        const className = classes.find(c => String(c?.id) === String(cid || ''))?.name || '미배정';
        const info = { id: s.id, name: s.name, className };

        const att = attendance.find(a => String(a?.student_id) === String(s.id) && String(a?.date) === today);
        if (att?.status === '결석') absents.push(info);

        const hw = homework.find(h => String(h?.student_id) === String(s.id) && String(h?.date) === today);
        if (hw?.status === '미완료') hwMisses.push(info);
    });

    const totalActive = scheduledActive.length;
    return {
        totalActive,
        absents,
        hwMisses,
        allClear: absents.length === 0 && hwMisses.length === 0
    };
}


// [RESTORE] quickToggleAtt: 원본 복구
async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(1);
}

// [RESTORE] quickToggleHw: 원본 복구
async function quickToggleHw(sid, status, tab = 'hw') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('homework', { studentId: sid, status, date: today });
    if (!r?.success) { toast('숙제 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(1);
}


function renderDailyClosePanel(step = 1) {
    injectDashboardOpsStyles();
    const d = computeTodayCloseData();
    const risks = typeof computeRiskStudents === 'function' ? computeRiskStudents() : [];
    const clearedLogs = state?.dashboard?.clearedCareLogs || state?.dashboardClearedCareLogs || [];
    const today = new Date().toLocaleDateString('sv-SE');

    const renderStudentGroups = (items, type) => {
        if (!items.length) return `<div class="daily-close-empty">${type === 'att' ? '결석 학생이 없습니다.' : '숙제 미완료 학생이 없습니다.'}</div>`;
        const grouped = dashboardGroupByClass(items);
        const sortedClassNames = Object.keys(grouped).sort((a, b) => {
            const clsA = (state?.db?.classes || []).find(c => c.name === a);
            const clsB = (state?.db?.classes || []).find(c => c.name === b);
            const rankA = clsA ? getClassGradeRank(clsA.grade) : 99;
            const rankB = clsB ? getClassGradeRank(clsB.grade) : 99;
            if (rankA !== rankB) return rankA - rankB;
            return a.localeCompare(b, 'ko');
        });
        return `<div class="daily-close-list">${sortedClassNames.map(cName => `
            <div class="daily-close-class-group">
                <div class="daily-close-class-group__head">${apEscapeHtml(cName)}</div>
                ${grouped[cName].map(s => `
                    <div class="daily-close-student">
                        <div class="daily-close-student__row">
                            <span class="daily-close-student__name">${apEscapeHtml(s.name)}</span>
                            <span class="daily-close-student__link" onclick="openStudentDetail('${dashboardEscapeAttr(s.id)}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</span>
                        </div>
                        <div class="daily-close-student__actions">
                            ${type === 'att'
                                ? `<button class="btn btn-primary" onclick="quickToggleAtt('${dashboardEscapeAttr(s.id)}', '등원', 'step1')">등원 (취소)</button><button class="btn" disabled>결석 유지</button>`
                                : `<button class="btn btn-primary" onclick="quickToggleHw('${dashboardEscapeAttr(s.id)}', '완료', 'step1')">완료 (취소)</button><button class="btn" disabled>미완료 유지</button>`}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('')}</div>`;
    };

    const renderCareLogs = () => {
        const activeCare = risks.slice(0, 8).map(r => `
            <div class="care-log-item">
                <div class="care-log-item__title">${apEscapeHtml(r.student?.name || '')} <span class="care-risk-badge">${apEscapeHtml(String(r.riskScore || 0))}점</span></div>
                <div class="care-log-item__text">${apEscapeHtml(r.className || '미배정')} · ${apEscapeHtml((r.reasons || []).join(' · '))}</div>
            </div>
        `).join('');
        const cleared = clearedLogs.slice(0, 8).map(log => `
            <div class="care-log-item">
                <div class="care-log-item__title">${apEscapeHtml(log.student_name || '')} <span class="care-risk-cleared">해소</span></div>
                <div class="care-log-item__text">${apEscapeHtml(log.summary || '')}</div>
            </div>
        `).join('');
        if (!activeCare && !cleared) return `<div class="daily-close-empty">보강/상담 상쇄로 확인할 집중케어 변동이 없습니다.</div>`;
        return `<div class="care-log-list">${activeCare}${cleared}</div>`;
    };

    const progress = [
        { no: 1, label: '예외 확인' },
        { no: 2, label: '상쇄 확인' },
        { no: 3, label: '일지 검토' }
    ].map(item => `<div class="daily-close-progress__item ${Number(step) === item.no ? 'daily-close-progress__item--active' : ''}">${item.no}. ${item.label}</div>`).join('');

    const stepHtml = `
        <div class="daily-close-step ${Number(step) === 1 ? 'daily-close-step--active' : ''}">
            <div class="daily-close-step__header">Step 1. 오늘 예외 확인</div>
            <div class="daily-close-step__body">
                ${renderStudentGroups(d.absents || [], 'att')}
                ${renderStudentGroups(d.hwMisses || [], 'hw')}
            </div>
        </div>
        <div class="daily-close-step ${Number(step) === 2 ? 'daily-close-step--active' : ''}">
            <div class="daily-close-step__header">Step 2. 보강/상담 상쇄 확인</div>
            <div class="daily-close-step__body">${renderCareLogs()}</div>
        </div>
        <div class="daily-close-step ${Number(step) === 3 ? 'daily-close-step--active' : ''}">
            <div class="daily-close-step__header">Step 3. 일지 초안 검토</div>
            <div class="daily-close-step__body">
                ${renderJournalDraftPreview(today)}
            </div>
        </div>
    `;

    const prevBtn = Number(step) <= 1
        ? `<button class="btn" onclick="closeModal()">취소</button>`
        : `<button class="btn" onclick="openTodayCloseModal(${Number(step) - 1})">이전</button>`;
    const nextBtn = Number(step) >= 3
        ? `<button class="btn btn-primary" onclick="openDailyJournalModal('${today}')">일지 작성</button>`
        : `<button class="btn btn-primary" onclick="openTodayCloseModal(${Number(step) + 1})">다음</button>`;

    return `
        <div class="daily-close-panel">
            <div class="daily-close-progress">${progress}</div>
            ${stepHtml}
            <div class="daily-close-actions">${prevBtn}${nextBtn}</div>
        </div>
    `;
}

function openTodayCloseModal(step = 1) {
    const numericStep = Number(step);
    const safeStep = Number.isFinite(numericStep) ? Math.max(1, Math.min(3, numericStep)) : 1;
    if (!state.ui) state.ui = {};
    state.ui.dailyCloseStep = safeStep;
    showModal('예외 현황', renderDailyClosePanel(safeStep));
}


// [RESTORE] getTodayExamConfig: 원본 복구
function getTodayExamConfig() {
    try {
        const raw = localStorage.getItem('AP_TODAY_EXAM');
        if (!raw) return null;
        const cfg = JSON.parse(raw);
        const today = new Date().toLocaleDateString('sv-SE');
        if (cfg.date !== today || !cfg.title) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
        return { date: cfg.date, title: String(cfg.title), q: parseInt(cfg.q, 10) || 20 };
    } catch (e) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
}

// [RESTORE] setTodayExamConfig: 원본 복구
function setTodayExamConfig(title, q) {
    const today = new Date().toLocaleDateString('sv-SE');
    const validQ = parseInt(q, 10) || 20;
    localStorage.setItem('AP_TODAY_EXAM', JSON.stringify({ date: today, title: String(title), q: validQ }));
}

// [RESTORE] clearTodayExamConfig: 원본 복구
function clearTodayExamConfig() {
    localStorage.removeItem('AP_TODAY_EXAM');
    if(state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
    else renderDashboard();
}

function openTodayExamSetModal() {
    const cfg = getTodayExamConfig();
    showModal('오늘 시험 설정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:12px; color:var(--secondary); background:var(--surface-2); padding:10px; border-radius:8px; line-height:1.5;">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin:4px 0;">
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button>
            </div>
            <input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%; background:var(--surface-2); border:none;">
            <input id="set-exam-q" type="number" class="btn" placeholder="문항 수 (기본 20)" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="btn" style="flex:1; padding:12px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:500;" onclick="clearTodayExamConfig(); closeModal();">시험 없음</button>
                <button class="btn btn-primary" style="flex:1.5; padding:12px; font-size:12px; font-weight:500;" onclick="handleSetTodayExam()">저장 및 적용</button>
            </div>
        </div>
    `);
}

function handleSetTodayExam() {
    const t = document.getElementById('set-exam-title').value.trim();
    const q = parseInt(document.getElementById('set-exam-q').value, 10) || 20;
    if (!t) { toast('시험명을 입력하세요.', 'warn'); return; }
    setTodayExamConfig(t, q); 
    toast('오늘 시험이 설정되었습니다.', 'info'); 
    closeModal(); 
    if(state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
    else renderDashboard();
}

function extractJournalUnitAndNote(rawNote) {
    const raw = String(rawNote || '').trim();
    const result = { units: '', note: '' };
    if (!raw) return result;

    const match = raw.match(/^\[단원선택\]\s*([^\n]*)\n?/);
    if (!match) {
        result.note = raw;
        return result;
    }

    result.units = String(match[1] || '').trim();
    result.note = raw.replace(/^\[단원선택\]\s*[^\n]*\n?/, '').trim();
    return result;
}

function compactJournalUnitText(text) {
    return String(text || '').replace(/\s+/g, '').trim();
}

function formatJournalProgressLine(progress, unitText) {
    const title = String(progress?.textbook_title_snapshot || '교재').trim() || '교재';
    const progressText = String(progress?.progress_text || '').trim() || '(기록 없음)';
    const compactUnit = compactJournalUnitText(unitText);

    if (compactUnit) {
        return `  * ${title} ${compactUnit}-${progressText}`;
    }

    return `  * ${title}: ${progressText}`;
}

function appendJournalNote(text, note) {
    const clean = String(note || '').trim();
    if (!clean) return text;

    const lines = clean.split('\n').map(v => v.trim()).filter(Boolean);
    if (lines.length === 0) return text;

    if (lines.length === 1) {
        return text + `- 특이사항: ${lines[0]}\n`;
    }

    text += `- 특이사항:\n`;
    lines.forEach(line => {
        text += `  ${line}\n`;
    });
    return text;
}


function dashboardFormatConsultationFullText(row) {
    const bodyFields = [
        row?.content,
        row?.memo,
        row?.note,
        row?.consultation_content,
        row?.body,
        row?.description,
        row?.summary
    ];
    const mainBody = bodyFields
        .map(v => String(v || '').trim())
        .find(Boolean) || '';
    const nextAction = String(row?.next_action || row?.nextAction || row?.follow_up || row?.followUp || '').trim();
    const parts = [];
    if (mainBody) parts.push(mainBody);
    if (nextAction) parts.push(`다음 조치: ${nextAction}`);
    return parts.join('\n');
}


function dashboardGetJournalClassRows(targetDate) {
    return (state.db.classes || []).filter(c => {
        if (Number(c.is_active) === 0) return false;
        if (!isMiddleSchoolClass(c)) return false;
        if (!isClassVisibleForCurrentTeacher(c)) return false;

        return isClassScheduledOnDateForDashboard(c.id, targetDate);
    });
}

function dashboardGetConsultationDate(cn) {
    return String(cn?.consultation_date || cn?.date || cn?.created_at || '').slice(0, 10);
}

function dashboardGetConsultationBody(cn) {
    return String(
        cn?.content ??
        cn?.memo ??
        cn?.note ??
        cn?.consultation_content ??
        cn?.body ??
        cn?.description ??
        cn?.summary ??
        ''
    ).trim();
}

function dashboardGetJournalConsultationsForClass(targetDate, memberIds) {
    const memberSet = new Set((memberIds || []).map(id => String(id)));
    return (state.db.consultations || []).filter(cn => {
        if (dashboardGetConsultationDate(cn) !== targetDate) return false;
        return memberSet.has(String(cn?.student_id || ''));
    });
}

function dashboardFormatJournalConsultationEntry(cn, students) {
    const sName = (students || []).find(s => String(s.id) === String(cn?.student_id))?.name || cn?.student_name_snapshot || cn?.student_name || '학생';
    const body = dashboardGetConsultationBody(cn);
    let text = `  * ${sName}\n`;
    if (body) {
        body.split(/\r?\n/).forEach(line => {
            text += `    ${line}\n`;
        });
    } else {
        text += `    상담 내용 없음\n`;
    }
    return text;
}

function dashboardJournalAlreadyHasConsultation(content, cn, students) {
    const source = String(content || '');
    const sName = (students || []).find(s => String(s.id) === String(cn?.student_id))?.name || cn?.student_name_snapshot || cn?.student_name || '학생';
    const body = dashboardGetConsultationBody(cn);
    if (!body) {
        // 상담 내용이 없는 경우: buildJournalContent가 생성하는 "  * 학생이름" 패턴으로 확인
        return Boolean(sName && source.includes(`  * ${sName}`));
    }
    const normalizedBody = body.replace(/\r\n/g, '\n').trim();
    if (normalizedBody && source.replace(/\r\n/g, '\n').includes(normalizedBody)) return true;
    const firstLine = normalizedBody.split('\n').find(Boolean);
    if (firstLine && firstLine.length >= 12 && source.includes(firstLine)) return true;
    return Boolean(sName && source.includes(sName) && source.includes(body.slice(0, Math.min(30, body.length))));
}

function dashboardInsertJournalConsultationsIntoClassSection(content, className, entries) {
    if (!entries.length) return content;
    const source = String(content || '');
    const header = `■ ${className}반`;
    const start = source.indexOf(header);
    const entryText = entries.join('');

    if (start < 0) {
        return `${source.trimEnd()}\n\n■ ${className}반\n- 상담:\n${entryText}`;
    }

    const nextStart = source.indexOf('\n■ ', start + header.length);
    const sectionEnd = nextStart >= 0 ? nextStart : source.length;
    const section = source.slice(start, sectionEnd);
    const hasConsultationTitle = /\n- 상담:\s*\n/.test(section);
    const insertion = hasConsultationTitle ? entryText : `- 상담:\n${entryText}`;
    const trimmedSectionEnd = sectionEnd - (source.slice(0, sectionEnd).match(/\s*$/)?.[0]?.length || 0);
    const safeInsertAt = Math.max(start + header.length, trimmedSectionEnd);

    return source.slice(0, safeInsertAt) + `\n${insertion}` + source.slice(safeInsertAt);
}

function mergeJournalConsultationsIntoContent(content, targetDate) {
    const classes = dashboardGetJournalClassRows(targetDate);
    let merged = String(content || '').trimEnd();
    if (!merged) merged = buildJournalContent(targetDate).trimEnd();

    classes.forEach(cls => {
        const memberIds = (state.db.class_students || []).filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id));
        const students = (state.db.students || []).filter(s => memberIds.includes(String(s.id)) && s.status === '재원');
        const missingEntries = dashboardGetJournalConsultationsForClass(targetDate, memberIds)
            .filter(cn => !dashboardJournalAlreadyHasConsultation(merged, cn, students))
            .map(cn => dashboardFormatJournalConsultationEntry(cn, students));

        if (missingEntries.length > 0) {
            merged = dashboardInsertJournalConsultationsIntoClassSection(merged, cls.name, missingEntries);
        }
    });

    return merged.trim() + '\n';
}

function buildJournalContent(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    let text = `[AP Math 운영 일지 - ${targetDate}]\n작성자: ${state.ui.userName}\n\n`;

    const activeClasses = dashboardGetJournalClassRows(targetDate);

    if (activeClasses.length === 0) {
        text += `해당 날짜에 담당 학급이 없습니다.\n`;
        return text;
    }

    activeClasses.forEach(cls => {
        text += `■ ${cls.name}반\n`;

        const memberIds = (state.db.class_students || []).filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id));
        const students = (state.db.students || []).filter(s => memberIds.includes(String(s.id)) && s.status === '재원');
        const total = students.length;

        const absents = [];
        const lates = [];
        const makeups = []; // { name, makeupTags: string[] }
        const hwMiss = [];
        const MAKEUP_LABEL_MAP = {
            'makeup:progress': '진도',
            'makeup:homework': '숙제',
            'makeup:absence': '결석',
            'makeup:exam': '시험',
            'makeup:other': '기타',
        };

        students.forEach(s => {
            const att = (state.db.attendance || []).find(a => String(a.student_id) === String(s.id) && a.date === targetDate);
            const hw = (state.db.homework || []).find(h => String(h.student_id) === String(s.id) && h.date === targetDate);
            const attStatus = String(att?.status || '').trim();
            const tagList = String(att?.tags || '')
                .split(',')
                .map(v => v.trim())
                .filter(Boolean);

            if (attStatus === '결석') absents.push(s.name);
            if (attStatus === '지각' || tagList.includes('지각')) lates.push(s.name);
            const makeupTags = tagList.filter(t => t.startsWith('makeup:'));
            if (attStatus === '보강' || tagList.includes('보강') || makeupTags.length > 0) {
                makeups.push({ name: s.name, makeupTags });
            }
            if (hw?.status === '미완료') hwMiss.push(s.name);
        });

        const attendanceCount = Math.max(0, total - absents.length);
        const homeworkCount = Math.max(0, total - hwMiss.length);

        text += `- 출석: ${attendanceCount}/${total}\n`;
        text += `- 숙제: ${homeworkCount}/${total}\n`;
        if (absents.length > 0) text += `- 결석: ${absents.join(', ')}\n`;
        if (lates.length > 0) text += `- 지각: ${lates.join(', ')}\n`;
        if (makeups.length > 0) {
            const makeupStr = makeups.map(m => {
                if (!m.makeupTags.length) return m.name;
                const labels = m.makeupTags.map(t => MAKEUP_LABEL_MAP[t] || t).join('·');
                return `${m.name}(${labels})`;
            }).join(', ');
            text += `- 보강: ${makeupStr}\n`;
        }
        if (hwMiss.length > 0) text += `- 숙제 미완료: ${hwMiss.join(', ')}\n`;

        const dailyRecord = (state.db.class_daily_records || []).find(r => String(r.class_id) === String(cls.id) && r.date === targetDate);
        if (dailyRecord) {
            const noteData = extractJournalUnitAndNote(dailyRecord.special_note);
            const progresses = (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(dailyRecord.id));
            if (progresses.length > 0) {
                text += `- 진도:\n`;
                progresses.forEach(p => {
                    text += formatJournalProgressLine(p, noteData.units) + `\n`;
                });
            } else text += `- 진도: (기록 없음)\n`;

            text = appendJournalNote(text, noteData.note);
        } else {
            text += `- 진도: (수업 기록 미입력)\n`;
        }

        const cns = dashboardGetJournalConsultationsForClass(targetDate, memberIds);
        if (cns.length > 0) {
            text += `- 상담:\n`;
            cns.forEach(cn => {
                text += dashboardFormatJournalConsultationEntry(cn, students);
            });
        }

        text += `\n`;
    });

    return text.trim() + '\n';
}


function openDailyJournalModal(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');

    if (state.ui.viewScope === 'all' || state.auth.role === 'admin') {
        renderAdminJournalList(targetDate);
        return;
    }

    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === state.ui.userName);

    const status = myJournal ? myJournal.status : '작성중';
    const isLocked = status === '제출완료' || status === '결재완료';
    const content = isLocked
        ? (myJournal?.content || buildJournalContent(targetDate))
        : mergeJournalConsultationsIntoContent(myJournal?.content || buildJournalContent(targetDate), targetDate);

    let actionBtns = '';
    if (!myJournal || status === '작성중') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:14px; font-weight:500; background:var(--surface); color:var(--text);" onclick="saveJournal('작성중', null, '${targetDate}')">임시 저장</button>
            <button class="btn btn-primary" style="flex:1; padding:14px; font-weight:500;" onclick="saveJournal('제출완료', null, '${targetDate}')">제출</button>
        `;
    } else if (status === '제출완료') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:14px; font-weight:500; color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="saveJournal('작성중', '${myJournal.id}', '${targetDate}')">제출 취소 및 수정</button>
        `;
    }

    showModal('일지', `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:10px 14px; border-radius:10px;">
            <span style="font-size:13px; color:var(--secondary);; font-weight:500;">작성 기준일</span>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:500; color:var(--text);" onchange="openDailyJournalModal(this.value)">
        </div>
        ${status === '결재완료' ? `
            <div style="background:rgba(var(--success-rgb),0.10); color:var(--success); padding:16px; border-radius:12px; margin-bottom:16px;">
                <span style="display:flex; align-items:center; gap:8px; font-size:14px;; font-weight:500;">원장님 확인 완료</span>
                ${myJournal.feedback ? `<div style="margin-top:10px; font-size:13px; background:var(--surface); padding:12px; border-radius:8px; color:var(--text);"><span style="font-weight:500;">피드백:</span><br>${apEscapeHtml(myJournal.feedback)}</div>` : ''}
            </div>
        ` : ''}
        <textarea id="journal-content" class="btn" style="width:100%; height:250px; text-align:left; resize:vertical; font-family:inherit; font-size:14px; line-height:1.6; background:${isLocked ? 'var(--surface-2)' : 'var(--surface)'}; border:1px solid var(--border); color:var(--text);" ${isLocked ? 'readonly' : ''}>${apEscapeHtml(content)}</textarea>
        <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
            ${actionBtns}
        </div>
    `);
}

async function saveJournal(status, existingId = null, targetDate) {
    const el = document.getElementById('journal-content');
    if (!el) return toast('일지 입력칸을 찾을 수 없습니다.', 'warn');

    const content = el.value;
    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === state.ui.userName);

    const journalId = existingId || myJournal?.id;
    let result;
    if (journalId) {
        result = await api.patch(`daily-journals/${journalId}`, { content, status });
    } else {
        result = await api.post('daily-journals', { date: targetDate, content, status });
    }

    if (!result || result.error) return toast(result?.error || '저장 실패', 'error');

    toast(`저장 완료`, 'success');
    closeModal();
    await loadData();
}

function renderAdminJournalList(dateStr, teacherName = '') {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const safeTeacher = dashboardEscapeAttr(teacherName || '');
    let journals = (state.db.journals || []).filter(j => j.date === targetDate && j.status !== '작성중');
    if (teacherName) journals = journals.filter(j => j.teacher_name === teacherName);
    const title = teacherName ? `${teacherName} 선생님 일지` : '일지확인';
    
    const backBtn = teacherName ? `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:500; background:var(--surface-2); border:none; color:var(--text);" onclick="closeModal(true)">닫기</button>` : '';
    
    const rows = journals.map(j => {
        const teacherArg = dashboardEscapeAttr(teacherName || j.teacher_name || '');
        const statusText = j.status === '결재완료' ? '확인완료' : j.status;
        const statusColor = 'var(--secondary)';
        const statusBg = 'var(--surface-2)';
        
        return `
            <div class="card" style="padding:16px; margin-bottom:12px; cursor:pointer; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); background:var(--surface);" onclick="openAdminJournalFeedback('${j.id}', '${teacherArg}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; gap:8px; align-items:center;">
                    <span style="font-size:15px; color:var(--text);; font-weight:500;">${apEscapeHtml(j.teacher_name)} 선생님</span>
                    <span style="font-size:11px; font-weight:500; color:${statusColor}; background:${statusBg}; border:1px solid var(--border); padding:4px 8px; border-radius:6px;">${apEscapeHtml(statusText)}</span>
                </div>
                <div style="font-size:13px; color:var(--text-soft); white-space:pre-wrap; max-height:60px; overflow:hidden; line-height:1.6;">${apEscapeHtml(j.content)}</div>
            </div>`;
    }).join('');
    
    showModal(`${apEscapeHtml(title)}`, `
        ${backBtn}
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:12px 14px; border-radius:12px;">
            <span style="font-size:13px; color:var(--secondary); white-space:nowrap;; font-weight:500;">기준일</span>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:500; color:var(--text);" onchange="renderAdminJournalList(this.value, '${safeTeacher}')">
        </div>
        <div style="max-height:55vh; overflow-y:auto; padding-right:4px;">
            ${journals.length ? rows : `<div style="text-align:center; color:var(--secondary); padding:30px; font-weight:500; font-size:13px; background:var(--surface-2); border-radius:12px;">해당 날짜에 제출된 일지가 없습니다.</div>`}
        </div>
    `);
}

function openAdminJournalFeedback(id, teacherName = '') {
    const journal = (state.db.journals || []).find(j => j.id === id);
    if (!journal) return toast('일지를 찾을 수 없습니다.', 'warn');
    const safeTeacher = dashboardEscapeAttr(teacherName || journal.teacher_name || '');
    
    showModal(`${apEscapeHtml(journal.teacher_name)} 선생님 일지`, `
        <textarea readonly class="btn" style="width:100%; height:200px; text-align:left; resize:vertical; font-size:14px; line-height:1.6; background:var(--surface-2); border:none; border-radius:12px; padding:16px; margin-bottom:12px; color:var(--text);">${apEscapeHtml(journal.content)}</textarea>
        <textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; border:1px solid var(--border); border-radius:12px; padding:14px; font-size:13px; background:var(--surface); color:var(--text);">${apEscapeHtml(journal.feedback || '')}</textarea>
        <div style="margin-top:16px;">
            <button class="btn btn-primary" style="width:100%; padding:16px; border-radius:14px; font-weight:500; font-size:15px;" onclick="approveJournal('${journal.id}', '${journal.date}', '${safeTeacher}')">확인완료</button>
        </div>
    `);
}

function approveJournal(id, dateStr, teacherName = '') {
    const feedback = document.getElementById('journal-feedback')?.value.trim() || '';
    return api.patch(`daily-journals/${id}`, { feedback, status: '결재완료' }).then(async result => {
        if (!result || result.error) return toast(result?.error || '저장 실패', 'error');
        toast('저장 완료', 'success');
        closeModal();
        await loadData();
        renderAdminJournalList(dateStr, teacherName);
    });
}

function formatAdminRecentJournalDate(dateStr) {
    const datePart = String(dateStr || '').split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => !Number.isFinite(n))) return datePart;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${parts[1]}/${parts[2]} ${weekdays[date.getDay()] || ''}`.trim();
}

function getAdminRecentTeacherJournals(teacherName, baseDateStr = '', days = 30) {
    const baseTime = apParseLocalDateTime(baseDateStr || new Date().toLocaleDateString('sv-SE'));
    if (baseTime === null) return [];
    return (state.db.journals || [])
        .filter(j => {
            if (String(j?.teacher_name || '') !== String(teacherName || '')) return false;
            if (String(j?.status || '') === '작성중') return false;
            const time = apParseLocalDateTime(j?.date);
            if (time === null) return false;
            const diff = (baseTime - time) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff < days;
        })
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function openAdminRecentTeacherJournals(teacherName, baseDateStr = '') {
    const safeTeacher = dashboardEscapeAttr(teacherName || '');
    const rows = getAdminRecentTeacherJournals(teacherName, baseDateStr, 30).map(j => `
        <button type="button" class="btn" style="width:100%; min-height:44px; padding:0 14px; margin-bottom:6px; border-radius:12px; border:1px solid var(--border); background:var(--surface); color:var(--text); box-shadow:none; justify-content:flex-start; font-size:14px; font-weight:500;" onclick="openAdminJournalFeedback('${dashboardEscapeAttr(String(j.id || ''))}', '${safeTeacher}')">
            ${apEscapeHtml(formatAdminRecentJournalDate(j.date))}
        </button>
    `).join('');
    showModal('최근 일지', `<div style="max-height:55vh; overflow-y:auto;">${rows}</div>`);
}


function renderAdminTeacherCards(todayStr) {
    injectDashboardOpsStyles();
    const activeClasses = (state?.db?.classes || []).filter(c => Number(c?.is_active) !== 0);
    const teacherMap = {};
    activeClasses.forEach(c => {
        const tName = String(c.teacher_name || '담당').trim();
        if (!tName || tName === '담당') return;
        if (!teacherMap[tName]) teacherMap[tName] = [];
        teacherMap[tName].push(c);
    });
    const teacherNames = Object.keys(teacherMap).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ko'));
    if (!teacherNames.length) return `<div class="daily-close-empty">등록된 선생님이 없습니다.</div>`;

    return teacherNames.map(tName => {
        const myClasses = teacherMap[tName];
        const safeName = dashboardEscapeAttr(tName);

        return `
            <div class="card ap-admin-teacher-card">
                <div class="admin-teacher-card__head">
                    <div class="admin-teacher-card__name">${apEscapeHtml(tName)} 선생님</div>
                    <div class="admin-teacher-card__quick-actions">
                        <button class="btn admin-teacher-card__quick-action" onclick="event.stopPropagation(); renderAdminTeacherStudents('${safeName}')">담당반</button>
                        <button class="btn admin-teacher-card__quick-action" onclick="event.stopPropagation(); renderAdminTeacherAllStudents('${safeName}')">재원</button>
                    </div>
                </div>
                <div class="admin-teacher-card__journal">
                    <div class="admin-teacher-card__journal-title" style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <span>이번 주 일지</span>
                        <button type="button" class="btn admin-teacher-card__quick-action" style="min-height:28px; height:28px; padding:0 8px; font-size:11px;" onclick="event.stopPropagation(); openAdminRecentTeacherJournals('${safeName}')">최근 일지</button>
                    </div>
                    ${renderDashboardJournalWeekMatrix(tName, todayStr, myClasses)}
                </div>
            </div>`;
    }).join('');
}


function openAdminTeacherPanel(teacherName) {
    state.ui.currentAdminTeacherName = teacherName;
    const safeName = dashboardEscapeAttr(teacherName || '');
    renderAdminJournalList(new Date().toLocaleDateString('sv-SE'), safeName);
}


function renderAdminTeacherAllStudents(teacherName) {
    injectDashboardOpsStyles();
    const myClasses = (state?.db?.classes || []).filter(c => String(c.teacher_name || '담당').trim() === teacherName && Number(c.is_active) !== 0);
    const myClassIds = myClasses.map(c => String(c.id));
    const myStudentIds = [...new Set((state?.db?.class_students || [])
        .filter(m => myClassIds.includes(String(m.class_id)))
        .map(m => String(m.student_id)))];
    const gradeOrder = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    gradeOrder.forEach(label => { gradeCounts[label] = 0; });
    let totalCount = 0;
    (state?.db?.students || [])
        .filter(s => myStudentIds.includes(String(s.id)) && adminNormalizeStatus(s.status) === '재원')
        .forEach(s => {
            const grade = adminGetGradeLabel(s);
            const label = gradeOrder.includes(grade) ? grade : '기타';
            gradeCounts[label] += 1;
            totalCount += 1;
        });

    const chips = gradeOrder
        .filter(label => gradeCounts[label] > 0)
        .map(label => `<span class="admin-teacher-grade-pill"><span>${apEscapeHtml(label)}</span><span>${gradeCounts[label]}명</span></span>`)
        .join('');

    showModal(`${apEscapeHtml(teacherName)} 선생님 재원`, `
        <div class="admin-teacher-grade-pills">
            ${totalCount > 0 ? `<span class="admin-teacher-grade-pill admin-teacher-grade-pill--total"><span>총원</span><span>${totalCount}명</span></span>${chips}` : `<div class="daily-close-empty">재원생이 없습니다.</div>`}
        </div>
    `);
}


function renderAdminTeacherStudents(teacherName) {
    const myClasses = sortClassesForDashboard(state.db.classes.filter(c => String(c.teacher_name || '담당').trim() === teacherName && Number(c.is_active) !== 0));
    const rows = myClasses.map(cls => {
        const safeClassId = dashboardEscapeAttr(cls.id || '');
        const isToday = isClassScheduledTodayForDashboard(cls.id);
        return `
            <button class="btn" style="width:100%; min-height:50px; padding:10px 12px; border-radius:14px; border:1px solid var(--border); background:var(--surface); box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:12px; text-align:left;" onclick="closeModal(true); if(typeof renderClass==='function') renderClass('${safeClassId}'); else toast('반 화면을 불러오지 못했습니다.', 'warn');">
                <div style="min-width:0; flex:1;">
                    <div style="font-size:14px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(cls.name || '')}</div>
                    <div style="font-size:11px; font-weight:500; color:var(--secondary); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(cls.grade || '')}${cls.time_label ? ` · ${apEscapeHtml(cls.time_label)}` : ''}</div>
                </div>
                <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                    <span style="font-size:11px; font-weight:500; color:${isToday ? 'var(--text)' : 'var(--secondary)'}; background:var(--surface-2); border:1px solid var(--border); padding:4px 8px; border-radius:999px; white-space:nowrap;">${isToday ? '오늘 수업' : '수업 없음'}</span>
                    <span style="font-size:18px; font-weight:500; color:var(--secondary); line-height:1;">›</span>
                </div>
            </button>
        `;
    }).join('');

    showModal(`${apEscapeHtml(teacherName)} 선생님 담당반`, `
        <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="max-height:56vh; overflow-y:auto; display:flex; flex-direction:column; gap:7px; padding-right:4px;">
                ${rows || `<div style="text-align:center; padding:30px; color:var(--secondary); font-weight:500; background:var(--surface-2); border-radius:16px;">담당반이 없습니다.</div>`}
            </div>
        </div>
    `);
}

// [Button Audit Patch] Split-module duplicate handlers removed from dashboard.js.
// Source of truth: management.js, textbook.js, memo.js, schedule.js.

