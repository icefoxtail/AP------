(function () {
    var scheduleModalState = { exam: [], academy: [] };
    var scheduleModalMode = 'owner';

    function esc(value) {
        if (window.EieApp && typeof EieApp.escapeHtml === 'function') return EieApp.escapeHtml(value);
        return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    // 카드를 .eie-v2-screen 으로 감싸 EIE 패널 토큰이 원장/선생님 양쪽에서 해석되게 한다.
    // display:contents 라 레이아웃 영향 없음. (eie-operation-memos.js 와 동일 패턴)
    function eieScreenWrap(inner) {
        return '<div class="eie-v2-screen" style="display:contents">' + inner + '</div>';
    }

    function jsArg(value) {
        return esc(JSON.stringify(String(value == null ? '' : value)));
    }

    function jsArrayArg(values) {
        return esc(JSON.stringify(Array.isArray(values) ? values.map(function (value) { return String(value == null ? '' : value); }) : []));
    }

    function todayIso() {
        return new Date().toLocaleDateString('sv-SE');
    }

    function addDays(iso, days) {
        var date = new Date(String(iso || todayIso()) + 'T00:00:00');
        date.setDate(date.getDate() + Number(days || 0));
        return date.toLocaleDateString('sv-SE');
    }

    function daysBetween(from, to) {
        var a = new Date(String(from || todayIso()) + 'T00:00:00');
        var b = new Date(String(to || todayIso()) + 'T00:00:00');
        return Math.round((b - a) / 86400000);
    }

    function eachDate(from, to) {
        var out = [];
        var date = new Date(String(from || todayIso()) + 'T00:00:00');
        var end = new Date(String(to || from || todayIso()) + 'T00:00:00');
        while (date <= end) {
            out.push(date.toLocaleDateString('sv-SE'));
            date.setDate(date.getDate() + 1);
        }
        return out;
    }

    function notify(message, type) {
        if (typeof window.toast === 'function') window.toast(message, type || 'info');
    }

    // CRUD 성공 후 현재 라우트(원장/선생님 대시보드)를 다시 그려 주간일정 카드를
    // 최신화한다. READ_CACHE 무효화는 EieApi가 mutation 성공 시 처리한다.
    function refreshDashboardCards() {
        if (typeof window.refreshEieOperationDashboardCards === 'function') {
            try { return window.refreshEieOperationDashboardCards(); } catch (err) { /* 갱신 실패가 흐름을 깨지 않게 */ }
        }
        return undefined;
    }

    function openCompatModal(title, body) {
        if (typeof window.openModal === 'function') {
            window.openModal(title, body);
            return;
        }
        if (typeof window.showModal === 'function') {
            window.showModal(title, body);
            return;
        }
        notify(title, 'info');
    }

    function toRows(payload, keys) {
        if (!payload) return [];
        for (var i = 0; i < keys.length; i += 1) {
            if (Array.isArray(payload[keys[i]])) return payload[keys[i]];
        }
        if (Array.isArray(payload.items)) return payload.items;
        if (Array.isArray(payload.data)) return payload.data;
        return Array.isArray(payload) ? payload : [];
    }

    function examRowsFromData(data) {
        return toRows(data, ['examSchedules', 'exam_schedules', 'exams']);
    }

    function academyRowsFromData(data) {
        return toRows(data, ['academySchedules', 'academy_schedules', 'academy']);
    }

    function rowId(row) {
        return row && (row.id || row.schedule_id || row.scheduleId || '');
    }

    function rowSeriesId(row) {
        return row && (row.series_id || row.seriesId || '');
    }

    function examStart(row) {
        return String((row && (row.exam_date || row.examDate || row.start_date || row.startDate || row.date)) || todayIso()).slice(0, 10);
    }

    function examEnd(row) {
        return String((row && (row.end_date || row.endDate || row.exam_date || row.examDate || row.date)) || examStart(row)).slice(0, 10);
    }

    function academyStart(row) {
        return String((row && (row.schedule_date || row.scheduleDate || row.start_date || row.startDate || row.date)) || todayIso()).slice(0, 10);
    }

    function academyEnd(row) {
        return String((row && (row.end_date || row.endDate || row.schedule_date || row.scheduleDate || row.date)) || academyStart(row)).slice(0, 10);
    }

    function examTitle(row) {
        var school = (row && (row.school_name || row.schoolName)) || '';
        var grade = (row && row.grade) || '';
        var name = (row && (row.exam_name || row.examName || row.title)) || '시험';
        return [school, grade, name].filter(Boolean).join(' ');
    }

    function academyType(row) {
        var type = String((row && (row.schedule_type || row.scheduleType || row.type)) || '').toLowerCase();
        if (type === 'closed' || type === 'holiday' || row && (row.is_closed || row.isClosed)) return 'closed';
        return 'notice';
    }

    function academyTitle(row) {
        return (row && (row.title || row.name || row.memo)) || (academyType(row) === 'closed' ? '학원 휴무' : '학원 일정');
    }

    function formatShortDate(iso) {
        var parts = String(iso || '').split('-');
        if (parts.length < 3) return esc(iso);
        return Number(parts[1]) + '/' + Number(parts[2]);
    }

    function formatRange(start, end) {
        if (!end || start === end) return formatShortDate(start);
        return formatShortDate(start) + '~' + formatShortDate(end);
    }

    function dDayLabel(start, end) {
        var today = todayIso();
        if (start <= today && today <= end) return start === end ? 'D-Day' : '진행중';
        var diff = daysBetween(today, start);
        if (diff > 0) return 'D-' + diff;
        return '종료';
    }

    // 같은 그룹키(시험: 학교+학년+시험명 / 학원: series_id)의 연속 날짜 행을 하나의
    // 기간 행으로 병합한다. 시험 일정 테이블에는 series 개념이 없어 range 생성 시
    // 날짜별로 분리 삽입되므로, 표시 단계에서 다시 묶어 "6/28~6/30" 형태로 보여준다.
    // 비연속 날짜는 별도 행으로 남긴다. occurrenceIds 에 묶인 원본 id 들을 보관한다.
    function mergeConsecutive(rows) {
        var byKey = {};
        var order = [];
        rows.forEach(function (r) {
            if (!byKey[r.groupKey]) { byKey[r.groupKey] = []; order.push(r.groupKey); }
            byKey[r.groupKey].push(r);
        });
        var out = [];
        order.forEach(function (key) {
            var list = byKey[key].slice().sort(function (a, b) { return a.start.localeCompare(b.start); });
            var run = null;
            list.forEach(function (r) {
                if (run && r.start <= addDays(run.end, 1)) {
                    if (r.end > run.end) run.end = r.end;
                    run.occurrenceIds.push(r.id);
                } else {
                    if (run) out.push(run);
                    run = {
                        kind: r.kind, id: r.id, seriesId: r.seriesId,
                        start: r.start, end: r.end, typeLabel: r.typeLabel,
                        title: r.title, raw: r.raw, occurrenceIds: [r.id]
                    };
                }
            });
            if (run) out.push(run);
        });
        return out;
    }

    function combinedRows(data, options) {
        var group = !!(options && options.group);
        var rows = [];
        examRowsFromData(data).forEach(function (row) {
            rows.push({
                kind: 'exam',
                id: rowId(row),
                seriesId: rowSeriesId(row),
                start: examStart(row),
                end: examEnd(row),
                typeLabel: '시험',
                title: examTitle(row),
                groupKey: 'exam|' + examTitle(row),
                raw: row
            });
        });
        academyRowsFromData(data).forEach(function (row) {
            var type = academyType(row);
            var sid = rowSeriesId(row);
            rows.push({
                kind: 'academy',
                id: rowId(row),
                seriesId: sid,
                start: academyStart(row),
                end: academyEnd(row),
                typeLabel: type === 'closed' ? '휴무' : '기타',
                title: academyTitle(row),
                groupKey: sid ? ('academy|' + sid) : ('academy-solo|' + rowId(row)),
                raw: row
            });
        });
        if (group) rows = mergeConsecutive(rows);
        var today = todayIso();
        var until = addDays(today, 7);
        return rows.filter(function (row) {
            return row.end >= today && row.start <= until;
        }).sort(function (a, b) {
            if (a.kind !== b.kind) return a.kind === 'exam' ? -1 : 1;
            var startCompare = a.start.localeCompare(b.start);
            if (startCompare) return startCompare;
            return a.title.localeCompare(b.title);
        });
    }

    function renderScheduleRow(row, editable, mode) {
        var occurrenceArg = mode === 'teacher' ? ', ' + jsArrayArg(row.occurrenceIds) : '';
        var open = editable
            ? 'event.stopPropagation(); openEditEieUnifiedScheduleModal(' + jsArg(row.kind) + ', ' + jsArg(row.id) + ', ' + jsArg(row.seriesId) + ', ' + jsArg(mode || 'owner') + occurrenceArg + ')'
            : 'event.stopPropagation(); openEieScheduleModal(' + jsArg(mode || 'owner') + ')';
        return '<button type="button" class="eie-operation-schedule-row" onclick="' + open + '" style="width:100%;display:grid;grid-template-columns:44px 1fr auto;gap:8px;align-items:center;text-align:left;padding:8px 0;border:0;border-top:1px solid var(--eie-p-border);background:transparent;cursor:pointer;">'
            + '<span style="font-size:12px;font-weight:800;color:' + (row.kind === 'exam' ? 'var(--eie-p-btn-save-bg)' : 'var(--eie-p-btn-new-bg)') + ';">[' + esc(row.typeLabel) + ']</span>'
            + '<span style="min-width:0;">'
            + '<span style="display:block;font-size:14px;font-weight:650;color:var(--eie-p-text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + esc(row.title) + '</span>'
            + '<span style="display:block;font-size:12px;color:var(--eie-p-text-sub);">' + esc(formatRange(row.start, row.end)) + '</span>'
            + '</span>'
            + '<span style="font-size:12px;color:var(--eie-p-text-sub);font-weight:700;">' + esc(dDayLabel(row.start, row.end)) + '</span>'
            + '</button>';
    }

    function renderEieWeeklyScheduleDashboardCard(data, options) {
        var mode = options && options.mode ? String(options.mode) : 'owner';
        // 대시보드 카드에서는 같은 시험/시리즈의 연속 날짜를 하나의 기간 행으로 묶어 보여준다.
        var rows = combinedRows(data, { group: true });
        return eieScreenWrap('<section class="eie-operation-card eie-operation-schedule-card eie-p-card" data-eie-operation-mode="' + esc(mode) + '" style="min-height:100%;display:flex;flex-direction:column;gap:8px;color:var(--eie-p-text);">'
            + '<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">'
            + '<div style="min-width:0;"><h2 style="margin:0;font-size:16px;line-height:1.2;">주간일정</h2>'
            + '<p style="margin:3px 0 0;color:var(--eie-p-text-sub);font-size:12px;line-height:1.2;">학원 공용 일정</p></div>'
            + '<span style="font-size:12px;color:var(--eie-p-text-sub);">7일</span>'
            + '</div>'
            + '<div onclick="openEieScheduleModal(' + jsArg(mode) + ')" style="flex:1;cursor:pointer;">'
            + (rows.length ? rows.map(function (row) { return renderScheduleRow(row, mode === 'teacher', mode); }).join('') : '<div style="padding:12px 0;color:var(--eie-p-text-sub);font-size:13px;">표시할 일정이 없습니다.</div>')
            + '</div>'
            + '<div class="eie-operation-card-footer">'
            + '<button type="button" class="eie-p-btn-new eie-operation-add-btn" onclick="event.stopPropagation(); openEieScheduleModal(' + jsArg(mode) + ')">+ 일정 추가</button>'
            + '</div>'
            + '</section>');
    }

    async function loadSchedules() {
        if (!window.EieApi || typeof EieApi.getExamSchedules !== 'function' || typeof EieApi.getAcademySchedules !== 'function') {
            throw new Error('일정 API를 찾을 수 없습니다.');
        }
        var from = todayIso();
        var to = addDays(from, 7);
        var results = await Promise.all([
            EieApi.getExamSchedules(),
            EieApi.getAcademySchedules({ from: from, to: to })
        ]);
        scheduleModalState.exam = examRowsFromData(results[0]);
        scheduleModalState.academy = academyRowsFromData(results[1]);
        return { examSchedules: scheduleModalState.exam, academySchedules: scheduleModalState.academy };
    }

    function renderScheduleModal(data, mode) {
        var isTeacher = String(mode || 'owner') === 'teacher';
        var rows = combinedRows(data, { group: isTeacher });
        var list = rows.length
            ? rows.map(function (row) { return renderScheduleRow(row, true, mode); }).join('')
            : '<div style="padding:12px 0;color:var(--eie-p-text-sub);font-size:13px;">표시할 일정이 없습니다.</div>';
        return '<div class="eie-v2-screen">'
            + '<div class="eie-p-card" style="box-shadow:none;border:0;background:transparent;padding:0;gap:10px;">'
            + '<div style="display:grid;grid-template-columns:96px 1fr 1fr;gap:8px;align-items:end;">'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">구분<select id="eie-new-schedule-kind"><option value="exam">시험</option><option value="closed">휴무</option><option value="notice">기타</option></select></label>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">시작<input id="eie-new-schedule-start" type="date" value="' + esc(todayIso()) + '"></label>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">종료<input id="eie-new-schedule-end" type="date" value="' + esc(todayIso()) + '"></label>'
            + '</div>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">제목<input id="eie-new-schedule-title" type="text" placeholder="일정 제목"></label>'
            + '<div style="display:grid;grid-template-columns:1fr 90px;gap:8px;">'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">학교<input id="eie-new-schedule-school" type="text" placeholder="시험 일정일 때 입력"></label>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">학년<input id="eie-new-schedule-grade" type="text"></label>'
            + '</div>'
            + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">메모<textarea id="eie-new-schedule-memo" rows="2"></textarea></label>'
            + '<button type="button" class="eie-p-btn-new" onclick="addEieUnifiedSchedule()" style="width:100%;">추가</button>'
            + '<div style="margin-top:10px;">' + list + '</div>'
            + '</div>'
            + '</div>';
    }

    async function openEieScheduleModal(mode) {
        mode = mode || 'owner';
        scheduleModalMode = mode;
        try {
            var data = await loadSchedules();
            openCompatModal('일정관리', renderScheduleModal(data, mode));
        } catch (err) {
            notify(err && err.message ? err.message : '일정을 불러오지 못했습니다.', 'error');
        }
    }

    async function addEieUnifiedSchedule() {
        var kind = document.getElementById('eie-new-schedule-kind');
        var start = document.getElementById('eie-new-schedule-start');
        var end = document.getElementById('eie-new-schedule-end');
        var title = document.getElementById('eie-new-schedule-title');
        var school = document.getElementById('eie-new-schedule-school');
        var grade = document.getElementById('eie-new-schedule-grade');
        var memo = document.getElementById('eie-new-schedule-memo');
        var scheduleKind = kind ? kind.value : 'exam';
        var startDate = start && start.value ? start.value : todayIso();
        var endDate = end && end.value ? end.value : startDate;
        var name = title ? title.value.trim() : '';
        if (!name) {
            notify('일정 제목을 입력해 주세요.', 'warn');
            return;
        }
        try {
            if (scheduleKind === 'exam') {
                var examPayload = {
                    schoolName: school ? school.value.trim() : '',
                    grade: grade ? grade.value.trim() : '',
                    examName: name,
                    examDate: startDate,
                    startDate: startDate,
                    endDate: endDate,
                    memo: memo ? memo.value.trim() : ''
                };
                if (endDate > startDate && typeof EieApi.createExamScheduleGroup === 'function') {
                    await EieApi.createExamScheduleGroup(examPayload);
                } else {
                    await EieApi.createExamSchedule(examPayload);
                }
            } else {
                var base = {
                    scheduleDate: startDate,
                    scheduleType: scheduleKind,
                    title: name,
                    memo: memo ? memo.value.trim() : '',
                    isClosed: scheduleKind === 'closed'
                };
                if (endDate > startDate && typeof EieApi.createAcademyScheduleBatch === 'function') {
                    var seriesId = 'series-' + Date.now();
                    await EieApi.createAcademyScheduleBatch({
                        seriesId: seriesId,
                        seriesKind: 'range',
                        seriesUntil: endDate,
                        items: eachDate(startDate, endDate).map(function (date) {
                            return Object.assign({}, base, { scheduleDate: date, seriesId: seriesId });
                        })
                    });
                } else {
                    await EieApi.createAcademySchedule(base);
                }
            }
            notify('일정을 추가했습니다.', 'success');
            await openEieScheduleModal(scheduleModalMode);
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '일정 추가에 실패했습니다.', 'error');
        }
    }

    function findSchedule(kind, id) {
        var rows = kind === 'exam' ? scheduleModalState.exam : scheduleModalState.academy;
        return rows.find(function (row) { return String(rowId(row)) === String(id); });
    }

    async function openEditEieUnifiedScheduleModal(kind, id, seriesId, mode, occurrenceIds) {
        mode = mode || 'owner';
        var groupedOccurrenceIds = Array.isArray(occurrenceIds) ? occurrenceIds.filter(Boolean) : [];
        try {
            if (!scheduleModalState.exam.length && !scheduleModalState.academy.length) await loadSchedules();
            var row = findSchedule(kind, id);
            if (!row) throw new Error('일정을 찾을 수 없습니다.');
            var isExam = kind === 'exam';
            var start = isExam ? examStart(row) : academyStart(row);
            var end = isExam ? examEnd(row) : academyEnd(row);
            var title = isExam ? ((row.exam_name || row.examName || row.title) || '') : academyTitle(row);
            openCompatModal('일정 수정', '<div class="eie-v2-screen">'
                + '<div class="eie-p-card" style="box-shadow:none;border:0;background:transparent;padding:0;gap:10px;">'
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">시작<input id="eie-edit-schedule-start" type="date" value="' + esc(start) + '"></label>'
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">종료<input id="eie-edit-schedule-end" type="date" value="' + esc(end) + '"></label>'
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">제목<input id="eie-edit-schedule-title" type="text" value="' + esc(title) + '"></label>'
                + (isExam
                    ? '<div style="display:grid;grid-template-columns:1fr 90px;gap:8px;"><label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">학교<input id="eie-edit-schedule-school" type="text" value="' + esc(row.school_name || row.schoolName || '') + '"></label><label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">학년<input id="eie-edit-schedule-grade" type="text" value="' + esc(row.grade || '') + '"></label></div>'
                    : '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">구분<select id="eie-edit-schedule-kind"><option value="notice"' + (academyType(row) !== 'closed' ? ' selected' : '') + '>기타</option><option value="closed"' + (academyType(row) === 'closed' ? ' selected' : '') + '>휴무</option></select></label>')
                + '<label style="display:grid;gap:4px;font-size:12px;color:var(--eie-p-text-sub);">메모<textarea id="eie-edit-schedule-memo" rows="3">' + esc(row.memo || '') + '</textarea></label>'
                + '<div style="display:flex;gap:8px;justify-content:flex-end;">'
                + '<button type="button" class="eie-p-btn-danger" onclick="deleteEieUnifiedSchedule(' + jsArg(kind) + ', ' + jsArg(id) + ', ' + jsArg(seriesId) + ', ' + jsArg(mode) + ', ' + jsArrayArg(groupedOccurrenceIds) + ')">삭제</button>'
                + '<button type="button" class="eie-p-btn-save" onclick="handleEditEieUnifiedSchedule(' + jsArg(kind) + ', ' + jsArg(id) + ', ' + jsArg(seriesId) + ', ' + jsArg(mode) + ', ' + jsArrayArg(groupedOccurrenceIds) + ')">저장</button>'
                + '</div>'
                + '</div>'
                + '</div>');
        } catch (err) {
            notify(err && err.message ? err.message : '일정 수정창을 열지 못했습니다.', 'error');
        }
    }

    async function handleEditEieUnifiedSchedule(kind, id, seriesId, mode, occurrenceIds) {
        mode = mode || 'owner';
        var groupedOccurrenceIds = Array.isArray(occurrenceIds) ? occurrenceIds.filter(Boolean) : [];
        var start = document.getElementById('eie-edit-schedule-start');
        var end = document.getElementById('eie-edit-schedule-end');
        var title = document.getElementById('eie-edit-schedule-title');
        var memo = document.getElementById('eie-edit-schedule-memo');
        var name = title ? title.value.trim() : '';
        if (!name) {
            notify('일정 제목을 입력해 주세요.', 'warn');
            return;
        }
        try {
            if (kind === 'exam') {
                var examPayload = {
                    schoolName: (document.getElementById('eie-edit-schedule-school') || {}).value || '',
                    grade: (document.getElementById('eie-edit-schedule-grade') || {}).value || '',
                    examName: name,
                    examDate: start && start.value ? start.value : todayIso(),
                    startDate: start && start.value ? start.value : todayIso(),
                    endDate: end && end.value ? end.value : (start && start.value ? start.value : todayIso()),
                    memo: memo ? memo.value.trim() : ''
                };
                if (mode === 'teacher' && groupedOccurrenceIds.length > 1 && typeof EieApi.updateExamScheduleGroup === 'function') {
                    examPayload.occurrenceIds = groupedOccurrenceIds;
                    await EieApi.updateExamScheduleGroup(examPayload);
                } else {
                    await EieApi.updateExamSchedule(id, examPayload);
                }
            } else {
                var typeEl = document.getElementById('eie-edit-schedule-kind');
                var type = typeEl ? typeEl.value : 'notice';
                var payload = {
                    scheduleDate: start && start.value ? start.value : todayIso(),
                    endDate: end && end.value ? end.value : (start && start.value ? start.value : todayIso()),
                    scheduleType: type,
                    title: name,
                    memo: memo ? memo.value.trim() : '',
                    isClosed: type === 'closed'
                };
                if (seriesId && typeof EieApi.updateAcademyScheduleSeries === 'function') {
                    await EieApi.updateAcademyScheduleSeries(seriesId, payload);
                } else {
                    await EieApi.updateAcademySchedule(id, payload);
                }
            }
            notify('일정을 저장했습니다.', 'success');
            await openEieScheduleModal(mode);
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '일정 저장에 실패했습니다.', 'error');
        }
    }

    async function deleteEieUnifiedSchedule(kind, id, seriesId, mode, occurrenceIds) {
        mode = mode || 'owner';
        var groupedOccurrenceIds = Array.isArray(occurrenceIds) ? occurrenceIds.filter(Boolean) : [];
        if (!id && !seriesId) return;
        if (window.confirm && !window.confirm('일정을 삭제할까요?')) return;
        try {
            if (kind === 'exam') {
                if (mode === 'teacher' && groupedOccurrenceIds.length > 1 && typeof EieApi.deleteExamScheduleGroup === 'function') {
                    await EieApi.deleteExamScheduleGroup(groupedOccurrenceIds);
                } else {
                    await EieApi.deleteExamSchedule(id);
                }
            } else if (seriesId && typeof EieApi.deleteAcademyScheduleSeries === 'function') {
                await EieApi.deleteAcademyScheduleSeries(seriesId);
            } else {
                await EieApi.deleteAcademySchedule(id);
            }
            notify('일정을 삭제했습니다.', 'success');
            await openEieScheduleModal(mode);
            refreshDashboardCards();
        } catch (err) {
            notify(err && err.message ? err.message : '일정 삭제에 실패했습니다.', 'error');
        }
    }

    window.renderEieWeeklyScheduleDashboardCard = renderEieWeeklyScheduleDashboardCard;
    window.openEieScheduleModal = openEieScheduleModal;
    window.addEieUnifiedSchedule = addEieUnifiedSchedule;
    window.openEditEieUnifiedScheduleModal = openEditEieUnifiedScheduleModal;
    window.handleEditEieUnifiedSchedule = handleEditEieUnifiedSchedule;
    window.deleteEieUnifiedSchedule = deleteEieUnifiedSchedule;
    window.EieOperationSchedule = {
        renderDashboardCard: renderEieWeeklyScheduleDashboardCard,
        openModal: openEieScheduleModal,
        add: addEieUnifiedSchedule,
        openEdit: openEditEieUnifiedScheduleModal,
        saveEdit: handleEditEieUnifiedSchedule,
        remove: deleteEieUnifiedSchedule
    };
})();
