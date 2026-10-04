import { makeId } from './foundation-db.js';

export function timeToMinutes(value) {
  const [h, m] = String(value || '').split(':').map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

export function isTimeOverlap(aStart, aEnd, bStart, bEnd) {
  const as = timeToMinutes(aStart);
  const ae = timeToMinutes(aEnd);
  const bs = timeToMinutes(bStart);
  const be = timeToMinutes(bEnd);
  if ([as, ae, bs, be].some(v => v === null)) return false;
  return as < be && bs < ae;
}

export function overlapRange(a, b) {
  return {
    start: a.start_time > b.start_time ? a.start_time : b.start_time,
    end: a.end_time < b.end_time ? a.end_time : b.end_time
  };
}

export function uniqSortedPair(a, b) {
  return [String(a || ''), String(b || '')].sort();
}

export function parseFoundationDays(scheduleDays, dayGroup) {
  const source = String(scheduleDays || dayGroup || '').trim();
  if (!source) return [];
  const dayMap = {
    '0': 'sun', '1': 'mon', '2': 'tue', '3': 'wed', '4': 'thu', '5': 'fri', '6': 'sat', '7': 'sun',
    mon: 'mon', monday: 'mon', m: 'mon', 월: 'mon',
    tue: 'tue', tuesday: 'tue', tu: 'tue', 화: 'tue',
    wed: 'wed', wednesday: 'wed', w: 'wed', 수: 'wed',
    thu: 'thu', thursday: 'thu', th: 'thu', 목: 'thu',
    fri: 'fri', friday: 'fri', f: 'fri', 금: 'fri',
    sat: 'sat', saturday: 'sat', sa: 'sat', 토: 'sat',
    sun: 'sun', sunday: 'sun', su: 'sun', 일: 'sun'
  };
  const groupMap = {
    mwf: ['mon', 'wed', 'fri'],
    ttf: ['tue', 'thu', 'fri'],
    tt: ['tue', 'thu'],
    twothu: ['tue', 'thu'],
    weekend: ['sat', 'sun']
  };
  const compact = source.toLowerCase().replace(/\s+/g, '');
  if (groupMap[compact]) return groupMap[compact];

  const days = [];
  const add = (day) => {
    if (day && !days.includes(day)) days.push(day);
  };
  for (const token of source.split(/[,/|·\s]+/).map(v => v.trim()).filter(Boolean)) {
    add(dayMap[token.toLowerCase()] || dayMap[token]);
  }
  if (!days.length) {
    for (const char of source) add(dayMap[char]);
  }
  return days;
}

export function getMathLessonDurationMinutes(cls) {
  const grade = String(cls?.grade || '').trim();
  if (/중[123]?/.test(grade) || grade === '중') return 90;
  if (/고[123]?/.test(grade) || grade === '고') return 120;
  return null;
}

function isFoundationMathClass(cls) {
  const subject = String(cls?.subject || '').trim();
  if (subject && subject !== '수학') return false;
  return getMathLessonDurationMinutes(cls) !== null;
}

export function normalizeFoundationHour(hour) {
  if (!Number.isFinite(hour)) return null;
  if (hour >= 1 && hour <= 11) return hour + 12;
  if (hour === 12) return 12;
  if (hour >= 13 && hour <= 23) return hour;
  return null;
}

export function formatFoundationTime(hour, minute) {
  if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
  if (minute < 0 || minute > 59) return null;
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function addMinutesToTime(time, minutes) {
  const match = String(time || '').trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match || !Number.isFinite(Number(minutes))) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  const total = hour * 60 + minute + Number(minutes);
  if (total > 24 * 60) return null;
  return formatFoundationTime(Math.floor(total / 60), total % 60);
}

export function normalizeFoundationTimeRange(first, second) {
  const startHour = normalizeFoundationHour(Number(first?.hour));
  const endHour = normalizeFoundationHour(Number(second?.hour));
  const startMinute = Number(first?.minute);
  const endMinute = Number(second?.minute);
  if (startHour === null || endHour === null) return null;
  const start = formatFoundationTime(startHour, startMinute);
  const end = formatFoundationTime(endHour, endMinute);
  if (!start || !end || start >= end) return null;
  return { start_time: start, end_time: end };
}

export function normalizeFoundationTimePart(value) {
  const match = String(value || '').trim().match(/(\d{1,2})\s*:\s*(\d{1,2})/);
  if (!match) return null;
  const normalizedHour = normalizeFoundationHour(Number(match[1]));
  const minute = Number(match[2]);
  if (normalizedHour === null) return null;
  return formatFoundationTime(normalizedHour, minute);
}

export function parseDaysFromText(text) {
  const source = String(text || '').trim();
  if (!source) return [];
  const dayMap = {
    월: 'mon', 화: 'tue', 수: 'wed', 목: 'thu', 금: 'fri', 토: 'sat', 일: 'sun',
    mon: 'mon', monday: 'mon',
    tue: 'tue', tuesday: 'tue',
    wed: 'wed', wednesday: 'wed',
    thu: 'thu', thursday: 'thu',
    fri: 'fri', friday: 'fri',
    sat: 'sat', saturday: 'sat',
    sun: 'sun', sunday: 'sun'
  };
  const days = [];
  const add = (day) => {
    if (day && !days.includes(day)) days.push(day);
  };
  for (const char of source) add(dayMap[char]);
  for (const token of source.toLowerCase().split(/[,/|·\s]+/).map(v => v.trim()).filter(Boolean)) add(dayMap[token]);
  return days;
}

function extractStartTimeFromText(text) {
  return normalizeFoundationTimePart(text);
}

function extractExplicitFoundationTimeRange(text) {
  const raw = String(text || '').trim();
  if (!raw) return null;
  const matches = [...raw.matchAll(/(\d{1,2})\s*:\s*(\d{1,2})/g)];
  if (matches.length < 2) return null;
  return normalizeFoundationTimeRange(
    { hour: Number(matches[0][1]), minute: Number(matches[0][2]) },
    { hour: Number(matches[1][1]), minute: Number(matches[1][2]) }
  );
}

export function parseLabeledTimeSegments(timeLabel) {
  const raw = String(timeLabel || '').trim();
  if (!raw) return [];
  const segments = [];
  const pushSegment = (text) => {
    const days = parseDaysFromText(text);
    const startTime = extractStartTimeFromText(text);
    if (days.length && startTime) segments.push({ days, start_time: startTime, source: String(text || '').trim() });
  };

  for (const part of raw.split(/[,/]+/).map(v => v.trim()).filter(Boolean)) pushSegment(part);
  if (segments.length) return segments;

  const labeledPattern = /([월화수목금토일]+)\s*[^0-9월화수목금토일]*(\d{1,2}\s*:\s*\d{1,2})/g;
  for (const match of raw.matchAll(labeledPattern)) pushSegment(`${match[1]} ${match[2]}`);
  return segments;
}

export function parseFoundationTimeLabel(timeLabel, cls) {
  const duration = getMathLessonDurationMinutes(cls);
  const startTime = extractStartTimeFromText(timeLabel);
  const endTime = startTime && duration !== null ? addMinutesToTime(startTime, duration) : null;
  if (!startTime || !endTime) return null;
  return { start_time: startTime, end_time: endTime, explicit_range: extractExplicitFoundationTimeRange(timeLabel) };
}

export function buildClassTimeSlotPreviewRows(cls, existingSlots) {
  if (!cls?.id) return { rows: [], skipped: [{ reason: 'missing class id', class_id: cls?.id || null }] };
  if (String(cls.is_active ?? '1') === '0') return { rows: [], skipped: [{ reason: 'inactive class', class_id: cls.id, class_name: cls.name || '' }] };
  if (!isFoundationMathClass(cls)) {
    return {
      rows: [],
      skipped: [{ reason: 'not middle/high math class', class_id: cls.id, class_name: cls.name || '', grade: cls.grade || '', subject: cls.subject || '' }]
    };
  }

  const duration = getMathLessonDurationMinutes(cls);
  const labeledSegments = parseLabeledTimeSegments(cls.time_label);
  const sources = labeledSegments.length
    ? labeledSegments
    : [{ days: parseFoundationDays(cls.schedule_days, cls.day_group), start_time: extractStartTimeFromText(cls.time_label), source: String(cls.time_label || '').trim() }];
  const rows = [];
  const skipped = [];

  for (const source of sources) {
    const days = source.days || [];
    const startTime = source.start_time || null;
    const endTime = startTime ? addMinutesToTime(startTime, duration) : null;
    if (!days.length || !startTime || !endTime) {
      skipped.push({
        reason: !days.length ? 'day parse failed' : (!startTime ? 'time parse failed' : 'end time exceeds 24:00'),
        class_id: cls.id,
        class_name: cls.name || '',
        grade: cls.grade || '',
        subject: cls.subject || '',
        schedule_days: cls.schedule_days || '',
        day_group: cls.day_group || '',
        time_label: cls.time_label || '',
        source: source.source || ''
      });
      continue;
    }
    const explicitRange = extractExplicitFoundationTimeRange(source.source || cls.time_label);
    const mismatch = explicitRange && explicitRange.end_time !== endTime;
    for (const day of days) {
      const key = `${cls.id}|${day}|${startTime}|${endTime}`;
      rows.push({
        row: {
          id: makeId('cts'),
          class_id: cls.id,
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
          room_name: null,
          memo: 'foundation sync from classes.time_label'
        },
        detail: {
          class_id: cls.id,
          class_name: cls.name || '',
          grade: cls.grade || '',
          source: source.source || cls.time_label || '',
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
          duration_minutes: duration,
          reason: existingSlots?.has(key)
            ? 'duplicate existing class/day/time'
            : (mismatch ? `insertable; source end ${explicitRange.end_time} recalculated by grade duration` : 'insertable')
        }
      });
    }
  }
  return { rows, skipped };
}

export function isMiddleGrade(grade) {
  return /^중[123]?/.test(String(grade || '').trim());
}

export function isHighGrade(grade) {
  return /^고[123]?/.test(String(grade || '').trim());
}

export function getClassGradeType(cls) {
  if (isMiddleGrade(cls?.grade)) return 'middle';
  if (isHighGrade(cls?.grade)) return 'high';
  return 'unknown';
}

export function getTeacherConflictExceptionReason(classA, classB, dayOfWeek) {
  const aType = getClassGradeType(classA);
  const bType = getClassGradeType(classB);
  if (aType === 'middle' && bType === 'middle' && dayOfWeek === 'fri') return 'middle_friday_combined_or_clinic';
  if (aType === 'high' && bType === 'high') return 'high_combined_class';
  return '';
}

export function buildConflictKey(conflict) {
  return [
    conflict.conflict_type,
    conflict.target_id,
    conflict.class_a_id,
    conflict.class_b_id,
    conflict.day_of_week,
    conflict.overlap_start,
    conflict.overlap_end
  ].join('|');
}
