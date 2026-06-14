(function () {
  const MAX_MEMOS = 3;
  const STORAGE_PREFIX = 'apmath.dashboardAssistantMemos.hidden.';
  const JOURNAL_DAYS = new Set(['wed', 'thu']);
  const ABSENT_TEXTS = new Set(['결석', '欠席']);
  const HOMEWORK_MISSING_RE = /미제출|미완료|미수행|누락|안\s*함|missing|incomplete/i;

  function str(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return str(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeId(value) {
    return str(value);
  }

  function formatStudent(student) {
    const name = str(student && student.name) || '학생';
    const grade = str(student && student.grade);
    return grade ? `${name}(${grade})` : name;
  }

  function rowsForClass(db, classId) {
    return (db.class_students || []).filter(row => normalizeId(row.class_id) === normalizeId(classId));
  }

  function findStudent(db, studentId) {
    return (db.students || []).find(student => normalizeId(student.id) === normalizeId(studentId));
  }

  function hasMakeupAfter(db, studentId, dateStr) {
    const sid = normalizeId(studentId);
    const start = str(dateStr).slice(0, 10);
    if (!sid || !start) return false;

    const hasAttendanceMakeup = (db.attendance_history || db.attendance || []).some(row => {
      if (normalizeId(row.student_id) !== sid) return false;
      const rowDate = str(row.date || row.created_at || row.updated_at).slice(0, 10);
      if (!rowDate || rowDate < start) return false;
      const hay = `${str(row.status)} ${str(row.tags)} ${str(row.memo)}`;
      return hay.includes('보강') || /makeup/i.test(hay);
    });

    if (hasAttendanceMakeup) return true;

    return (db.academy_schedules || []).some(row => {
      if (normalizeId(row.student_id) !== sid) return false;
      const rowDate = str(row.schedule_date || row.date).slice(0, 10);
      if (!rowDate || rowDate < start) return false;
      const hay = `${str(row.schedule_type)} ${str(row.title)} ${str(row.memo)}`;
      return hay.includes('보강') || /makeup/i.test(hay);
    });
  }

  function buildAbsenceMemos(input) {
    const db = input.db || {};
    const previousByClass = input.previousClassDateById || {};
    const memos = [];

    (input.scheduledClasses || []).forEach(cls => {
      const classId = normalizeId(cls.id);
      const previousDate = str(previousByClass[classId]).slice(0, 10);
      if (!classId || !previousDate) return;

      rowsForClass(db, classId).forEach(map => {
        const student = findStudent(db, map.student_id);
        if (!student) return;

        const absent = (db.attendance_history || db.attendance || []).some(row => {
          return normalizeId(row.class_id) === classId &&
            normalizeId(row.student_id) === normalizeId(student.id) &&
            str(row.date).slice(0, 10) === previousDate &&
            ABSENT_TEXTS.has(str(row.status));
        });

        if (!absent || hasMakeupAfter(db, student.id, previousDate)) return;

        memos.push({
          id: `absence:${classId}:${normalizeId(student.id)}:${previousDate}`,
          type: 'absence',
          priority: 10,
          text: `${formatStudent(student)} 지난 시간에 결석했어요. 보강 확인하세요.`,
          detail: `지난 수업: ${str(cls.name)} · ${previousDate}`
        });
      });
    });

    return memos;
  }

  function buildJournalDayMemo(input) {
    if (input.isHoliday) return [];
    if (!JOURNAL_DAYS.has(str(input.dayKey))) return [];
    return [{
      id: `journal-day:${str(input.todayStr).slice(0, 10)}`,
      type: 'journal-day',
      priority: 20,
      text: '오늘은 일지를 제출하는 날이에요.',
      detail: ''
    }];
  }

  function recordHasContent(record) {
    return !!str(
      record && (
        record.content ||
        record.progress ||
        record.memo ||
        record.summary ||
        record.lesson_content ||
        record.homework ||
        record.next_plan
      )
    );
  }

  function buildRecordGapMemos(input) {
    const db = input.db || {};
    const previousByClass = input.previousClassDateById || {};

    return (input.scheduledClasses || []).map(cls => {
      const classId = normalizeId(cls.id);
      const previousDate = str(previousByClass[classId]).slice(0, 10);
      if (!classId || !previousDate) return null;

      const record = (db.class_daily_records || []).find(row =>
        normalizeId(row.class_id) === classId &&
        str(row.date).slice(0, 10) === previousDate &&
        recordHasContent(row)
      );

      if (record) return null;

      return {
        id: `record-gap:${classId}:${previousDate}`,
        type: 'record-gap',
        priority: 30,
        text: `${str(cls.name)} 지난 수업 진도 기록이 비어 있어요.`,
        detail: `지난 수업: ${str(cls.name)} · ${previousDate}`
      };
    }).filter(Boolean).slice(0, 1);
  }

  function buildHomeworkMemo(input) {
    const db = input.db || {};
    const studentIds = new Set();

    (input.scheduledClasses || []).forEach(cls => {
      rowsForClass(db, cls.id).forEach(row => studentIds.add(normalizeId(row.student_id)));
    });

    const counts = new Map();
    (db.homework_history || db.homework || []).forEach(row => {
      const sid = normalizeId(row.student_id);
      if (!studentIds.has(sid)) return;
      const hay = `${str(row.status)} ${str(row.result)} ${str(row.memo)}`;
      if (!HOMEWORK_MISSING_RE.test(hay)) return;
      counts.set(sid, (counts.get(sid) || 0) + 1);
    });

    const students = Array.from(counts.entries())
      .filter(([, count]) => count >= 2)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([sid]) => findStudent(db, sid))
      .filter(Boolean);

    if (!students.length) return [];

    return [{
      id: `homework-repeat:${students.map(student => normalizeId(student.id)).join('-')}`,
      type: 'homework-repeat',
      priority: 40,
      text: `${students.map(formatStudent).join(', ')} 숙제 미제출이 이어지고 있어요.`,
      detail: '최근 숙제 기록 기준'
    }];
  }

  function buildDashboardAssistantMemos(input) {
    const source = input || {};
    const candidates = []
      .concat(buildAbsenceMemos(source))
      .concat(buildJournalDayMemo(source))
      .concat(buildRecordGapMemos(source))
      .concat(buildHomeworkMemo(source));

    const unique = [];
    const seen = new Set();
    candidates.sort((a, b) => a.priority - b.priority).forEach(memo => {
      if (!memo || seen.has(memo.id)) return;
      seen.add(memo.id);
      unique.push(memo);
    });

    return unique.slice(0, MAX_MEMOS);
  }

  function hiddenKey(dateStr) {
    return STORAGE_PREFIX + str(dateStr).slice(0, 10);
  }

  function getStorage() {
    try {
      return window.localStorage || null;
    } catch (e) {
      return null;
    }
  }

  function readHiddenIds(dateStr) {
    try {
      const storage = getStorage();
      const raw = storage && storage.getItem(hiddenKey(dateStr));
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed.map(str) : []);
    } catch (e) {
      return new Set();
    }
  }

  function writeHiddenIds(dateStr, ids) {
    try {
      const storage = getStorage();
      if (storage) storage.setItem(hiddenKey(dateStr), JSON.stringify(Array.from(ids)));
    } catch (e) {}
  }

  function filterHiddenDashboardAssistantMemos(dateStr, memos) {
    const hidden = readHiddenIds(dateStr);
    return (memos || []).filter(memo => !hidden.has(str(memo.id)));
  }

  function hideDashboardAssistantMemo(dateStr, memoId) {
    const hidden = readHiddenIds(dateStr);
    hidden.add(str(memoId));
    writeHiddenIds(dateStr, hidden);
  }

  function renderDashboardAssistantMemos(todayStr, memos) {
    const visible = filterHiddenDashboardAssistantMemos(todayStr, memos);
    if (!visible.length) return '';

    return `<div class="ap-assistant-memos" data-date="${escapeHtml(todayStr)}">${visible.map(memo => `
      <div class="ap-assistant-memo" data-memo-id="${escapeHtml(memo.id)}" onclick="apDashToggleAssistantMemo(event, this)">
        <div class="ap-assistant-memo__text">${escapeHtml(memo.text)}</div>
        <div class="ap-assistant-memo__details">
          ${memo.detail ? `<div class="ap-assistant-memo__detail">${escapeHtml(memo.detail)}</div>` : ''}
          <button type="button" class="ap-assistant-memo__hide" onclick="apDashHideAssistantMemo(event, '${escapeHtml(todayStr)}', '${escapeHtml(memo.id)}')">숨김</button>
        </div>
      </div>
    `).join('')}</div>`;
  }

  function apDashToggleAssistantMemo(event, el) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    if (!el || !el.classList) return;
    document.querySelectorAll('.ap-assistant-memo.is-open').forEach(node => {
      if (node !== el) node.classList.remove('is-open');
    });
    el.classList.toggle('is-open');
  }

  function apDashHideAssistantMemo(event, dateStr, memoId) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    hideDashboardAssistantMemo(dateStr, memoId);
    const node = event && event.target && event.target.closest ? event.target.closest('.ap-assistant-memo') : null;
    if (node) node.remove();
    document.querySelectorAll('.ap-assistant-memos').forEach(wrap => {
      if (!wrap.querySelector('.ap-assistant-memo')) wrap.remove();
    });
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', function (event) {
      if (event.target && event.target.closest && event.target.closest('.ap-assistant-memo')) return;
      document.querySelectorAll('.ap-assistant-memo.is-open').forEach(node => node.classList.remove('is-open'));
    });
  }

  window.buildDashboardAssistantMemos = buildDashboardAssistantMemos;
  window.renderDashboardAssistantMemos = renderDashboardAssistantMemos;
  window.filterHiddenDashboardAssistantMemos = filterHiddenDashboardAssistantMemos;
  window.hideDashboardAssistantMemo = hideDashboardAssistantMemo;
  window.apDashToggleAssistantMemo = apDashToggleAssistantMemo;
  window.apDashHideAssistantMemo = apDashHideAssistantMemo;
})();
