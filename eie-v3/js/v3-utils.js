// v3-utils.js — V3 순수 유틸 함수 모음 (DOM 의존 없음)
// V2 IIFE 내부 함수를 복사·정리하여 window.V3Utils 로 전역 노출

(function () {
    const DAY_ORDER = ['월', '화', '수', '목', '금', '토', '일'];
    const HOMEROOM_COLUMN_TEACHERS = ['Carmen', 'Zoe', 'IVY', 'STACY', 'Lily'];

    function normalizeKey(value) {
        return String(value == null ? '' : value).trim();
    }

    function normalizeTime(value) {
        const raw = normalizeKey(value);
        if (!raw) return '';
        const match = raw.match(/(\d{1,2})[:시]\s*(\d{1,2})?/);
        if (!match) return raw;
        const hour = Number(match[1]);
        const minute = Number(match[2] || 0);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return raw;
        return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
    }

    function timeToMinutes(value) {
        const time = normalizeTime(value);
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (!match) return null;
        const hour = Number(match[1]);
        const minute = Number(match[2]);
        if (!Number.isFinite(hour) || !Number.isFinite(minute)) return null;
        return hour * 60 + minute;
    }

    function minutesToTime(value) {
        const minutes = Number(value);
        if (!Number.isFinite(minutes)) return '';
        const hour = Math.floor(minutes / 60);
        const minute = minutes % 60;
        return String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0');
    }

    function normalizeDay(value) {
        const raw = normalizeKey(value);
        if (!raw) return '';
        const compact = raw.replace(/요일/g, '').trim();
        const found = DAY_ORDER.find(function (day) { return compact.includes(day); });
        return found || '';
    }

    function getRawMeta(row) {
        const value = row && row.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try { return JSON.parse(value); } catch (e) { return {}; }
    }

    function uniqueNames(rows) {
        const seen = new Set();
        return (Array.isArray(rows) ? rows : []).map(normalizeKey).filter(function (name) {
            const key = name.toLowerCase();
            if (!name || seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function asTeacherList(value) {
        if (Array.isArray(value)) return uniqueNames(value.reduce(function (acc, item) { return acc.concat(asTeacherList(item)); }, []));
        const text = normalizeKey(value);
        if (!text) return [];
        return uniqueNames(text.split(/[,+/]/).map(normalizeKey).filter(Boolean));
    }

    function dayTeacherSource(row) {
        const meta = getRawMeta(row);
        return (row && row.day_teachers)
            || (row && row.teacher_names_by_day)
            || (row && row.weekday_teachers)
            || meta.day_teachers
            || meta.teacher_names_by_day
            || meta.weekday_teachers
            || null;
    }

    function dayTeacherValues(row, day) {
        const source = dayTeacherSource(row);
        if (!source || typeof source !== 'object') return [];
        const key1 = day;
        const key2 = day + '요일';
        const key3 = day && day.toLowerCase ? day.toLowerCase() : day;
        return asTeacherList(source[key1] || source[key2] || source[key3] || '');
    }

    function getClassName(row) {
        return normalizeKey((row && (row.class_name_raw || row.class_name || row.name)) || '수업명 없음');
    }

    function compactClassName(value) {
        return normalizeKey(value)
            .replace(/\([^)]*\)/g, ' ')
            .replace(/\[[^\]]*\]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function materialText(row) {
        const meta = getRawMeta(row);
        const direct = normalizeKey(
            (row && (row.material_text || row.material || row.textbook || row.book_name)) ||
            meta.material_text || meta.material || meta.textbook || meta.book_name || meta.book || ''
        );
        if (direct) return direct;
        const compact = compactClassName((row && (row.class_name_raw || row.class_name || row.name)) || '');
        if (!compact) return '';
        const parts = compact.split(/\s+/).filter(Boolean);
        if (parts.length >= 2 && /^[A-Za-z]+$/i.test(parts[0]) && /^\d+(?:[-.]\d+)?$/.test(parts[1])) {
            return parts[0] + ' ' + parts[1];
        }
        return parts[0] || compact;
    }

    function materialLabel(row) {
        return materialText(row) || '교재 없음';
    }

    function materialKey(row) {
        return normalizeKey(materialText(row) || getClassName(row) || (row && (row.id || row.cell_id)) || '').toLowerCase();
    }

    function isForeignerTeacher(value) {
        const text = normalizeKey(value).toLowerCase();
        return text === 'foreigner'
            || text === 'foreign'
            || text.startsWith('forei')
            || text.includes('원어민')
            || text.includes('외국인');
    }

    function getTeacherNames(row) {
        const meta = getRawMeta(row);
        const values = [];
        if (Array.isArray(row && row.teacher_names)) values.push.apply(values, row.teacher_names);
        if (Array.isArray(meta.teacher_names)) values.push.apply(values, meta.teacher_names);
        values.push(normalizeKey((row && (row.homeroom_teacher)) || meta.homeroom_teacher || ''));
        const rawTeacher = normalizeKey((row && (row.teacher_name_raw || row.teacher_name || row.teacher)) || '');
        rawTeacher.split(',').forEach(function (t) { values.push(t); });
        return uniqueNames(values);
    }

    function getPrimaryTeacherName(row) {
        const meta = getRawMeta(row);
        const explicit = normalizeKey((row && row.homeroom_teacher) || meta.homeroom_teacher || '');
        if (explicit && !isForeignerTeacher(explicit)) return explicit;
        const names = getTeacherNames(row).filter(function (name) { return !isForeignerTeacher(name); });
        const fallback = normalizeKey((row && (row.teacher_name_raw || row.teacher_name || row.teacher)) || '미정') || '미정';
        if (names.length) return names[0];
        return (fallback && !isForeignerTeacher(fallback)) ? fallback : '미정';
    }

    function teacherKey(value) {
        return normalizeKey(value || '미정').toLowerCase();
    }

    function normalizeStudentName(value) {
        return normalizeKey(value).replace(/\s+/g, ' ');
    }

    function isPausedStudent(row) {
        const meta = getRawMeta(row);
        const status = normalizeKey((row && (row.status || row.student_status || row.match_status)) || meta.status || '').toLowerCase();
        const type = normalizeKey((row && row.student_type) || meta.student_type || '').replace(/\s+/g, '');
        const memo = normalizeKey((row && row.memo) || meta.memo || '');
        return status === 'paused' || status === 'on_leave' || status === 'leave' || status === '휴원' ||
            type.includes('휴원') || memo.includes('#휴원');
    }

    function studentStableLaneKey(student) {
        return normalizeKey(
            (student && (
                student.student_id || student.confirmed_student_id || student.matched_student_id ||
                student.canonical_student_id || student.id || student.pin || student.student_pin ||
                student.name || student.display_name || student.student_name_raw
            )) || ''
        ).toLowerCase();
    }

    window.V3Utils = {
        DAY_ORDER: DAY_ORDER,
        HOMEROOM_COLUMN_TEACHERS: HOMEROOM_COLUMN_TEACHERS,
        normalizeKey: normalizeKey,
        normalizeTime: normalizeTime,
        timeToMinutes: timeToMinutes,
        minutesToTime: minutesToTime,
        normalizeDay: normalizeDay,
        getRawMeta: getRawMeta,
        dayTeacherSource: dayTeacherSource,
        dayTeacherValues: dayTeacherValues,
        getClassName: getClassName,
        materialText: materialText,
        materialLabel: materialLabel,
        materialKey: materialKey,
        getTeacherNames: getTeacherNames,
        getPrimaryTeacherName: getPrimaryTeacherName,
        teacherKey: teacherKey,
        uniqueNames: uniqueNames,
        isForeignerTeacher: isForeignerTeacher,
        normalizeStudentName: normalizeStudentName,
        isPausedStudent: isPausedStudent,
        studentStableLaneKey: studentStableLaneKey,
        asTeacherList: asTeacherList
    };
})();
