(function () {
    function text(value) {
        return String(value == null ? '' : value).trim();
    }

    function rawOf(row) {
        if (row && row.raw && typeof row.raw === 'object') return row.raw;
        var value = row && row.raw_meta_json;
        if (!value) return {};
        if (typeof value === 'object') return value;
        try {
            var parsed = JSON.parse(value);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (error) {
            return {};
        }
    }

    function teacherKey(value) {
        return text(value)
            .replace(/선생님|선생|샘|teacher/gi, '')
            .replace(/\s+/g, '')
            .toLowerCase();
    }

    function uniqueNames(values) {
        var seen = {};
        var result = [];
        (Array.isArray(values) ? values : []).forEach(function (value) {
            asTeacherList(value).forEach(function (name) {
                var key = teacherKey(name);
                if (!key || seen[key]) return;
                seen[key] = true;
                result.push(name);
            });
        });
        return result.sort(function (a, b) { return a.localeCompare(b, 'ko'); });
    }

    function asTeacherList(value) {
        if (Array.isArray(value)) {
            var rows = [];
            value.forEach(function (item) { rows = rows.concat(asTeacherList(item)); });
            return rows;
        }
        if (value && typeof value === 'object') {
            var objectRows = [];
            Object.keys(value).forEach(function (key) { objectRows = objectRows.concat(asTeacherList(value[key])); });
            return objectRows;
        }
        return text(value).split(/[,+/]/).map(text).filter(Boolean);
    }

    function dayAliases(dateOrDay) {
        var raw = text(dateOrDay);
        var aliases = [];
        if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
            var date = new Date(raw + 'T00:00:00');
            if (!Number.isNaN(date.getTime())) {
                var ko = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
                var en = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][date.getDay()];
                aliases.push(ko, ko + '요일', en);
            }
        }
        if (raw) aliases.push(raw, raw.replace(/요일$/, ''), raw.toLowerCase());
        return uniqueNames(aliases);
    }

    function valuesFromDayMap(source, dateOrDay) {
        if (!source || typeof source !== 'object') return [];
        var values = [];
        dayAliases(dateOrDay).forEach(function (day) {
            values = values.concat(asTeacherList(source[day]));
        });
        return uniqueNames(values);
    }

    function allValuesFromDayMap(source) {
        if (!source || typeof source !== 'object') return [];
        var values = [];
        Object.keys(source).forEach(function (key) {
            values = values.concat(asTeacherList(source[key]));
        });
        return uniqueNames(values);
    }

    function teacherDaySources(cell) {
        var raw = rawOf(cell);
        return [
            cell && cell.day_teachers,
            cell && cell.teacher_names_by_day,
            cell && cell.weekday_teachers,
            raw.day_teachers,
            raw.teacher_names_by_day,
            raw.weekday_teachers
        ].filter(function (source) { return source && typeof source === 'object'; });
    }

    function displayTeacherNamesForCell(cell) {
        var raw = rawOf(cell);
        return uniqueNames([
            cell && cell.homeroom_teacher,
            raw.homeroom_teacher,
            cell && cell.teacher_name_raw,
            cell && cell.teacher_name,
            raw.teacher_name_raw,
            raw.teacher_name,
            Array.isArray(cell && cell.teacher_names) ? cell.teacher_names : [],
            Array.isArray(raw.teacher_names) ? raw.teacher_names : []
        ]);
    }

    function accessTeacherNamesForCell(cell) {
        var values = displayTeacherNamesForCell(cell);
        teacherDaySources(cell).forEach(function (source) {
            values = values.concat(allValuesFromDayMap(source));
        });
        (Array.isArray(cell && cell.assigned_students) ? cell.assigned_students : []).forEach(function (student) {
            var raw = rawOf(student);
            values = values.concat(Array.isArray(student && student.teacher_names) ? student.teacher_names : []);
            values = values.concat(Array.isArray(raw.teacher_names) ? raw.teacher_names : []);
            values = values.concat(student && (student.teacher_name || student.teacher_name_raw));
            values = values.concat(raw.teacher_name || raw.teacher_name_raw);
        });
        return uniqueNames(values);
    }

    function currentSession() {
        var storage = typeof window !== 'undefined' ? window.localStorage : null;
        var get = function (key) {
            return storage && typeof storage.getItem === 'function' ? text(storage.getItem(key)) : '';
        };
        return {
            teacherName: get('WANGJI_EIE_NAME') || get('WANGJI_EIE_LOGIN_ID'),
            role: get('WANGJI_EIE_ROLE'),
            loginId: get('WANGJI_EIE_LOGIN_ID')
        };
    }

    function isDirector(role, loginId) {
        var roleKey = teacherKey(role);
        var loginKey = teacherKey(loginId);
        return roleKey === 'admin' || roleKey === 'owner' || roleKey === 'director' || loginKey === 'admin';
    }

    function canUseCell(options) {
        var opts = options || {};
        if (isDirector(opts.role, opts.loginId)) return true;
        var targetKey = teacherKey(opts.teacherName || opts.loginId);
        if (!targetKey) return false;
        var explicitMatch = accessTeacherNamesForCell(opts.cell).map(teacherKey).some(function (key) {
            return key === targetKey;
        });
        if (explicitMatch) return true;
        var haystack = teacherKey([
            opts.cell && opts.cell.class_name_raw,
            opts.cell && opts.cell.raw_class_name,
            opts.cell && opts.cell.memo
        ].filter(Boolean).join(' '));
        return !!haystack && haystack.indexOf(targetKey) !== -1;
    }

    function cellsForTeacher(options) {
        var opts = options || {};
        return (Array.isArray(opts.cells) ? opts.cells : []).filter(function (cell) {
            return canUseCell({
                teacherName: opts.teacherName,
                role: opts.role,
                loginId: opts.loginId,
                cell: cell
            });
        });
    }

    function isCellOnDate(cell, dateOrDay) {
        var aliases = dayAliases(dateOrDay).map(teacherKey);
        if (!aliases.length) return false;
        var labels = [
            cell && cell.day_label,
            cell && cell.day,
            cell && cell.weekday
        ].map(teacherKey).filter(Boolean);
        return labels.some(function (label) {
            return aliases.some(function (alias) { return label.indexOf(alias) !== -1 || alias.indexOf(label) !== -1; });
        });
    }

    function todayCellsForTeacher(options) {
        var opts = options || {};
        return cellsForTeacher(opts).filter(function (cell) {
            return isCellOnDate(cell, opts.date);
        });
    }

    window.EieClassroomScope = {
        teacherKey: teacherKey,
        rawOf: rawOf,
        asTeacherList: asTeacherList,
        dayAliases: dayAliases,
        displayTeacherNamesForCell: displayTeacherNamesForCell,
        accessTeacherNamesForCell: accessTeacherNamesForCell,
        currentSession: currentSession,
        isDirector: isDirector,
        isCellOnDate: isCellOnDate,
        canUseCell: canUseCell,
        cellsForTeacher: cellsForTeacher,
        todayCellsForTeacher: todayCellsForTeacher
    };
})();
