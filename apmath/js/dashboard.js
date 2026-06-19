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

function renderDashboardHoverPreview(title, rows = [], options = {}) {
    const cleanTitle = String(title || '').trim();
    const cleanRows = (Array.isArray(rows) ? rows : [rows])
        .map(row => String(row || '').trim())
        .filter(Boolean);
    if (!cleanTitle && !cleanRows.length) return '';

    const classes = ['ap-hover-preview'];
    if (options.compact) classes.push('ap-hover-preview--compact');

    return `
        <div class="${classes.join(' ')}" role="tooltip">
            ${cleanTitle ? `<div class="ap-hover-preview__title">${apEscapeHtml(cleanTitle)}</div>` : ''}
            ${cleanRows.length ? `<div class="ap-hover-preview__body">${cleanRows.map(row => `<div class="ap-hover-preview__line">${apEscapeHtml(row)}</div>`).join('')}</div>` : ''}
        </div>
    `;
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

// 아카이브는 PWA scope(/apmath/) 밖이라 모바일 설치 앱에서 열면 외부 브라우저로 떠
// localStorage(APMATH_SESSION)가 공유되지 않는다. 세션 토큰을 URL 해시로 넘겨
// 아카이브 페이지가 자기 저장소에 복원하도록 한다(해시라 네트워크로는 전송되지 않음).
function appendArchiveSessionToUrl(url) {
    try {
        const s = (typeof getSession === 'function') ? getSession() : null;
        if (!s) return url;
        const payload = {
            login_id: s.login_id || '',
            id: s.id || '',
            name: s.name || '',
            role: s.role || '',
            session_token: s.session_token || '',
            expires_at: s.expires_at || ''
        };
        if (!payload.session_token && !payload.login_id) return url;
        const token = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
        return url + (url.indexOf('#') === -1 ? '#' : '&') + 'apmsess=' + token;
    } catch (e) {
        return url;
    }
}

function openDashboardArchiveWindow(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const url = appendArchiveSessionToUrl('../archive/index');
    window.open(url, '_blank', 'noopener');
}

function openAdminAssessmentArchiveWindow(event) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    const url = appendArchiveSessionToUrl('../archive/assessment/assessment-mvp.html');
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
            // Journal rows stay visually neutral; teachers can open rows when needed.
            const badgeClass = done ? 'ap-badge--complete' : (holiday ? 'ap-badge--holiday' : 'ap-badge--pending');
            const right = `<span class="ap-badge ${badgeClass}">${apEscapeHtml(statusText)}</span>`;
            return `
                <div class="ap-list-row" style="cursor:pointer;" onclick="event.stopPropagation(); ${click}" role="button" tabindex="0" aria-label="${apEscapeHtml(ariaText)}">
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

function dashboardGetPreviousScheduledDateForClass(cls, todayStr) {
    const today = dashboardDateFromLocalString(todayStr);
    if (!cls || !today) return '';
    const classDays = dashboardGetClassDayKeys(cls);
    if (!classDays.length) return '';

    for (let offset = 1; offset <= 14; offset += 1) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset);
        const dateStr = dashboardDateStringFromDate(d);
        if (isDashboardHoliday(dateStr)) continue;
        const key = DASHBOARD_DAY_INDEX_TO_KEY[d.getDay()];
        if (classDays.includes(key)) return dateStr;
    }

    return '';
}

function renderDashboardAssistantMemoBlock(todayStr, todayClasses) {
    if (typeof buildDashboardAssistantMemos !== 'function' || typeof renderDashboardAssistantMemos !== 'function') return '';

    const today = dashboardDateFromLocalString(todayStr) || new Date();
    const dayKey = DASHBOARD_DAY_INDEX_TO_KEY[today.getDay()];
    const previousClassDateById = {};
    (todayClasses || []).forEach(cls => {
        previousClassDateById[String(cls.id)] = dashboardGetPreviousScheduledDateForClass(cls, todayStr);
    });

    const memos = buildDashboardAssistantMemos({
        todayStr,
        dayKey,
        teacherName: state?.ui?.userName || state?.auth?.name || '',
        db: state?.db || {},
        scheduledClasses: todayClasses || [],
        isHoliday: isDashboardHoliday(todayStr),
        previousClassDateById
    });

    return renderDashboardAssistantMemos(todayStr, memos);
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
        max-width:1640px !important;
        margin-left:auto !important;
        margin-right:auto !important;
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
        border:1px solid var(--border);
        background:var(--surface);
    }
    .ap-badge { font-size:12px; font-weight:500; padding:3px 8px; border-radius:999px; white-space:nowrap; }
    .ap-badge--complete { color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); }
    .ap-badge--pending { color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); }
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
    .ap-dashboard-today-actions { display:flex; justify-content:flex-end; margin-top:10px; }

    /* G. 주간일정 2단 스플릿 */
    .ap-weekly-split { display:grid; grid-template-columns:1fr; gap:16px; }
    @media (min-width:640px){ .ap-weekly-split { grid-template-columns:minmax(150px,2fr) minmax(0,8fr); } }
    .ap-split-cell { min-width:0; }
    .ap-weekly-notice-cell { cursor:pointer; }
    .ap-split-label { font-size:12px; font-weight:600; color:var(--secondary); margin:0 0 8px; }
    .ap-split-cell p { margin:0 0 4px; font-size:13px; font-weight:500; color:var(--text); display:flex; align-items:center; gap:6px; }
    .ap-cleaning-routine { flex-wrap:nowrap; white-space:nowrap; }
    .ap-split-cell .ap-split-meta { font-size:12px; font-weight:500; color:var(--secondary); }
    .ap-empty-notice { font-size:13px; font-weight:500; color:var(--secondary); }

    .ap-hover-source { position:relative; overflow:visible !important; }

    .ap-hover-preview {
        position:absolute;
        left:12px;
        top:calc(100% + 8px);
        z-index:40;
        width:min(360px, calc(100vw - 48px));
        max-height:260px;
        overflow:auto;
        padding:12px 14px;
        border:1px solid var(--border);
        border-radius:8px;
        background:var(--surface);
        color:var(--text);
        box-shadow:0 14px 32px rgba(15,23,42,0.16);
        opacity:0;
        visibility:hidden;
        transform:translateY(-3px);
        pointer-events:none;
        transition:opacity .14s ease, transform .14s ease, visibility .14s ease;
        white-space:normal;
        text-align:left;
        box-sizing:border-box;
    }

    .ap-hover-source:hover > .ap-hover-preview,
    .ap-hover-source:focus-visible > .ap-hover-preview,
    .ap-hover-source:focus-within > .ap-hover-preview {
        opacity:1;
        visibility:visible;
        transform:translateY(0);
        pointer-events:auto;
    }

    .ap-hover-preview__title { margin:0 0 8px; font-size:13px; font-weight:700; line-height:1.35; color:var(--text); }
    .ap-hover-preview__body { display:flex; flex-direction:column; gap:5px; }
    .ap-hover-preview__line { font-size:12px; font-weight:500; line-height:1.5; color:var(--secondary); overflow-wrap:anywhere; }

    .ap-dashboard-class-list .ap-hover-preview {
        top:auto;
        bottom:calc(100% + 8px);
        transform:translateY(3px);
    }

    .ap-dashboard-class-list .ap-hover-source:hover > .ap-hover-preview,
    .ap-dashboard-class-list .ap-hover-source:focus-visible > .ap-hover-preview,
    .ap-dashboard-class-list .ap-hover-source:focus-within > .ap-hover-preview {
        transform:translateY(0);
    }

    /* 오른쪽 하단 이동 버튼 */
    .ap-dash-quick-panel { margin-top:16px; margin-bottom:8px; padding:0; background:transparent; border:none; box-shadow:none; }
    .ap-dash-quick-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
    .ap-dash-quick-card { min-width:0; height:auto; min-height:64px; padding:14px 10px; border:1px solid var(--border); border-radius:8px; background:var(--surface); color:var(--text); cursor:pointer; text-align:center; display:flex; align-items:center; justify-content:center; transition:border-color .18s ease, background .18s ease; box-sizing:border-box; }
    .ap-dash-quick-card:hover { border-color:var(--primary); background:var(--surface-2); }
    .ap-dash-quick-title { font-size:14px; font-weight:600; line-height:1.25; }
    @media (max-width:420px){ .ap-dash-quick-grid { grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; } .ap-dash-quick-card { min-height:52px; padding:10px 6px; } .ap-dash-quick-title { font-size:12px; font-weight:600; } }
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

        broom: '<path d="M4 20h8"/><path d="M7 20v-5l9.5-9.5a1.7 1.7 0 0 1 2.4 2.4L9.5 17.3"/><path d="M6 15h5l2 5H4l2-5z"/><path d="M15 7l2 2"/>',
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
function openRiskStudentReport(studentId) {
    const risks = typeof computeRiskStudents === 'function' ? computeRiskStudents() : [];
    const risk = risks.find(r => String(r.student?.id) === String(studentId));
    if (typeof openStudentReportModal === 'function') {
        openStudentReportModal(studentId, { riskInfo: risk || null, title: '관리필요 학생 문구 생성' });
        return;
    }
    toast('보고 문구 모듈을 불러오지 못했습니다.', 'warn');
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
function getDashboardClassStudentNames(classId) {
    const cid = String(classId || '');
    if (!cid) return [];

    const students = typeof apmsGetStudentsForClass === 'function'
        ? apmsGetStudentsForClass(cid)
        : (() => {
            const memberIds = (state?.db?.class_students || [])
                .filter(m => String(m?.class_id || '') === cid)
                .map(m => String(m?.student_id || ''))
                .filter(Boolean);
            return (state?.db?.students || []).filter(s => memberIds.includes(String(s?.id || '')));
        })();

    return (students || [])
        .filter(s => String(s?.status || '재원') === '재원')
        .map(s => String(s?.name || '').trim())
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, 'ko'));
}

function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id];
    if (!s) return '';

    const safeCid = dashboardEscapeAttr(cls.id);
    const safeName = apEscapeHtml(cls.name || '');
    const studentNames = getDashboardClassStudentNames(cls.id);
    const scheduleText = [cls.schedule_days, cls.time_label].map(v => String(v || '').trim()).filter(Boolean).join(' · ');
    const hoverRows = [
        scheduleText ? `수업: ${scheduleText}` : '',
        `재원 ${studentNames.length || s.activeCount || 0}명`,
        studentNames.length ? studentNames.join(', ') : '등록된 재원 학생이 없습니다.'
    ];
    const hoverPreview = renderDashboardHoverPreview(cls.name || '반 정보', hoverRows);

    if (!s.isScheduled) {
        return `
            <div class="ap-class-row ap-class-row--empty ap-hover-source" onclick="openDashboardClass('${safeCid}')" tabindex="0">
                <div class="ap-class-row__name ap-class-row__name--inactive">${safeName}</div>
                <div class="ap-class-row__meta">수업 없음</div>
                ${hoverPreview}
            </div>
        `;
    }

    return `
        <div class="ap-class-row ap-class-row--scheduled ap-hover-source" onclick="openDashboardClass('${safeCid}')" tabindex="0">
            <div class="ap-class-row__name">${safeName}</div>
            <div class="ap-class-row__chips" aria-label="${safeName} 출결 요약">
                <span class="ap-class-chip ap-class-chip--active">재원 ${apEscapeHtml(String(s.activeCount))}</span>
                <span class="ap-class-chip ap-class-chip--present">등원 ${apEscapeHtml(String(s.present))}</span>
                <span class="ap-class-chip ap-class-chip--absent">결석 ${apEscapeHtml(String(s.absent))}</span>
            </div>
            ${hoverPreview}
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
                const rawTitle = e.exam_name ? `${e.school_name || '일반'} ${e.grade || ''} ${e.exam_name}` : `${e.school_name || '일정 확인'}`;
                const displayTitle = apEscapeHtml(rawTitle);
                const preview = renderDashboardHoverPreview(rawTitle, [
                    `날짜: ${u.date}`,
                    e.memo ? `메모: ${e.memo}` : '',
                    `상태: ${dDay}`
                ]);
                return `<div class="ap-hover-source" onclick="event.stopPropagation(); openExamScheduleModal()" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid var(--border); background:transparent;" tabindex="0">
                    <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${displayTitle}</div>
                    <span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${dDay}</span>
                    ${preview}
                </div>`;
            }

            const s = u.item;
            const isClosed = s.schedule_type === 'closed' || s.is_closed === true || s.is_closed === 1;
            const label = isClosed ? '휴무' : '기타';
            const labelColor = isClosed ? 'var(--warning)' : 'var(--secondary)';
            const labelBg = isClosed ? 'rgba(var(--warning-rgb),0.12)' : 'var(--surface-2)';
            const title = s.title || (isClosed ? '휴무' : '일정');
            const timeText = [s.start_time, s.end_time].map(v => String(v || '').trim()).filter(Boolean).join('~');
            const preview = renderDashboardHoverPreview(title, [
                `분류: ${label}`,
                `날짜: ${s.schedule_date || u.date}`,
                timeText ? `시간: ${timeText}` : '',
                s.teacher_name ? `선생님: ${s.teacher_name}` : '',
                s.memo ? `메모: ${s.memo}` : ''
            ]);
            return `<div class="ap-hover-source" onclick="event.stopPropagation(); openExamScheduleModal()" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid var(--border); background:transparent;" tabindex="0">
                <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">${label}</span>${apEscapeHtml(title)}${s.memo ? ` <span style="color:var(--secondary); font-weight:400;">${apEscapeHtml(s.memo)}</span>` : ''}</div>
                <span style="font-size:12px; background:var(--surface-2); color:var(--secondary); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${dDay}</span>
                ${preview}
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
    const iconBroom = typeof apDashIcon === 'function' ? apDashIcon('broom', 14) : '';
    const iconCalendar = typeof apDashIcon === 'function' ? apDashIcon('calendar', 28) : '';
    const iconSpeaker = typeof apDashIcon === 'function' ? apDashIcon('speakerphone', 14) : '';

    // G. 좌: 고정 루틴(청소 당번 + 신입생 상담 등 반복 항목) / 우: 학원 공지(예정 일정, 빈 상태 처리)
    const cleaningHtml = `
        <p class="ap-cleaning-routine" aria-label="청소 당번 ${apEscapeHtml(cleaningPerson)}"><span style="color:var(--secondary);">${iconBroom}</span><strong style="color:var(--primary);">${apEscapeHtml(cleaningPerson)}</strong></p>
        <span class="ap-split-meta">매주 월요일</span>`;

    // 공지 컨테이너는 항상 렌더(비동기 신입생 상담 행 주입 대상). 빈 안내는 토글.
    const noticeEmpty = !(upcomingHtml || onboardingWeeklyHtml);
    const noticeHtml = `
        ${upcomingHtml || ''}
        <div id="dashboard-onboarding-weekly-items">${onboardingWeeklyHtml}</div>
        <p id="weekly-notice-empty" class="ap-empty-notice"${noticeEmpty ? '' : ' style="display:none;"'}>등록된 공지가 없습니다.</p>`;

    // F. 오늘일정 빈 상태 + 인라인 폼 (페이지 전환 없이 펼침)
    const todayClassesForAssistant = (state?.db?.classes || []).filter(cls => {
        if (Number(cls?.is_active) === 0) return false;
        if (!isClassVisibleForCurrentTeacher(cls)) return false;
        return isClassScheduledOnDateForDashboard(cls.id, todayStr);
    });
    const assistantMemoHtml = renderDashboardAssistantMemoBlock(todayStr, todayClassesForAssistant);

    const inlineScheduleFormHtml = `
           <div id="ap-dash-inline-form" class="ap-inline-form" style="display:none;">
                <input type="date" id="ap-dash-inline-date" value="${todayStr}">
                <input type="text" id="ap-dash-inline-content" placeholder="일정 내용"
                       onkeydown="if(event.key==='Enter') apDashSaveInlineSchedule();">
                <button type="button" class="ap-inline-btn" onclick="apDashSaveInlineSchedule()">저장</button>
           </div>`;

    const todayBodyHtml = todayMemos.length
        ? `<div class="ap-dashboard-surface-list ap-dashboard-surface-list--today" onclick="openTodoMemoModal()" style="cursor:pointer; overflow:hidden; border-radius:6px; border:1px solid var(--border); background:var(--surface);">${todayHtml}</div>
           <div class="ap-dashboard-today-actions">
                <button type="button" class="ap-inline-btn ap-inline-btn--ghost" onclick="apDashToggleScheduleForm(this)">+ 일정 추가</button>
           </div>
           ${inlineScheduleFormHtml}${assistantMemoHtml}`
        : `<div class="ap-empty-state">
                <span class="ap-empty-icon">${iconCalendar}</span>
                <p>오늘 등록된 일정이 없습니다.</p>
                <button type="button" class="ap-inline-btn ap-inline-btn--ghost" onclick="apDashToggleScheduleForm(this)">+ 일정 추가</button>
           </div>
           ${inlineScheduleFormHtml}${assistantMemoHtml}`;

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
                <div class="ap-split-cell ap-weekly-notice-cell"
                     role="button"
                     tabindex="0"
                     onclick="openExamScheduleModal()"
                     onkeydown="if(event.target===event.currentTarget&&(event.key==='Enter'||event.key===' ')){event.preventDefault(); openExamScheduleModal();}">
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
            <div class="ap-dash-inner-list ap-dash-inner-list--journal">
                ${renderDashboardJournalWeekMatrix('', new Date().toLocaleDateString('sv-SE'))}
            </div>
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
        const taskId = dashboardEscapeAttr(task?.id || '');
        const label = getOnboardingTaskLabel(task);
        const studentName = task?.student_name || '학생';
        const className = task?.class_name || '';
        const dueLabel = getDashboardOnboardingDueLabel(task);
        const preview = renderDashboardHoverPreview(label, [
            `학생: ${studentName}`,
            className ? `반: ${className}` : '',
            dueLabel ? `기한: ${dueLabel}` : '',
            task?.memo ? `메모: ${task.memo}` : ''
        ]);

        return `<div class="ap-hover-source" onclick="event.stopPropagation(); openOnboardingTask('${taskId}')" style="${rowBase} cursor:pointer; font-size:13px; font-weight:400; color:var(--text); border-bottom:1px solid rgba(15,23,42,0.08); background:transparent;" tabindex="0">
            <div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                <span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">상담</span>${apEscapeHtml(label)} · ${apEscapeHtml(studentName)}${className ? ` <span style="color:var(--secondary); font-weight:400;">${apEscapeHtml(className)}</span>` : ''}
            </div>
            ${dueLabel ? `<span style="font-size:12px; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:10px; font-weight:400; white-space:nowrap; flex-shrink:0;">${apEscapeHtml(dueLabel)}</span>` : ''}
            ${preview}
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

