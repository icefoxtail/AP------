(function () {
    // APMS 복사 코드가 기대하는 window.api.get/post/patch/delete 형태를 EIE에서 제공한다.
    //
    // Round 1.1 정책 (B안 확정):
    // - Worker endpoint가 확인되지 않은 쓰기 API는 EIE_NOT_IMPLEMENTED로 명확히 막는다.
    // - GET 계열은 화면 렌더를 위해 빈 배열 fallback 가능.
    // - GET students는 APMS형 { success: true, data: [...] } 구조로 normalize해서 반환한다.
    //
    // window.api 정책:
    // - window.api가 없으면 window.api = window.EieApmsApi로 설정.
    // - 이미 window.api가 있으면 window.eieApiAdapter를 제공하고 덮어쓰지 않는다.
    //
    // timetable_cell_id를 class_id adapter로 사용하는 정책:
    // - EIE에 eie_classes 테이블이 없어 1차에서는 timetable_cell_id로 class_id 역할을 대리한다.
    // - 정책 근거: docs/EIE_APMS_STATE_API_COMPAT_SPEC.md
    //
    // Worker에 실제 존재하는 endpoint (Round 1 기준):
    // - GET /api/eie/confirmed-students
    // - GET /api/eie/timetable
    // - POST /api/eie/timetable-cells
    // - PATCH /api/eie/timetable-cells/{id}
    // - PATCH /api/eie/timetable-cells/{id}/status
    //
    // Worker에 없는 쓰기 endpoint (모두 EIE_NOT_IMPLEMENTED):
    // - POST students, PATCH students/{id}, PATCH/POST students/{id}/status
    // - POST/PATCH/DELETE consultations
    // - POST/PATCH parent-foundation/contacts
    // - POST/PATCH attendance, homework, class-daily-records
    // - POST timetable-cells/{id}/students
    // - DELETE timetable-cells/{id}/students/{studentId}

    function makeNotImplementedError(method, path) {
        var err = new Error('EIE API endpoint not implemented: ' + method + ' ' + path);
        err.code = 'EIE_NOT_IMPLEMENTED';
        err.path = path;
        err.method = method;
        return err;
    }

    function mapPath(method, path) {
        var clean = String(path || '').replace(/^\/+/, '');

        // ── timetable-cells/{id}/students/{studentId} DELETE ──────────────────
        // Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        var cellStudentDeleteMatch = clean.match(/^timetable-cells\/([^/]+)\/students\/([^/?#]+)/);
        if (cellStudentDeleteMatch && method === 'DELETE') {
            return { type: 'not_implemented' };
        }

        // ── timetable-cells/{id}/students POST ────────────────────────────────
        // Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        var cellStudentPostMatch = clean.match(/^timetable-cells\/([^/]+)\/students$/);
        if (cellStudentPostMatch && method === 'POST') {
            return { type: 'not_implemented' };
        }

        // ── students/{id}/status PATCH/POST ───────────────────────────────────
        // Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        var studentStatusMatch = clean.match(/^students\/([^/]+)\/status$/);
        if (studentStatusMatch && (method === 'PATCH' || method === 'POST')) {
            return { type: 'not_implemented' };
        }

        // ── students/{id} PATCH ───────────────────────────────────────────────
        // Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        var studentIdPatchMatch = clean.match(/^students\/([^/]+)$/);
        if (studentIdPatchMatch && method === 'PATCH') {
            return { type: 'not_implemented' };
        }

        // ── students GET ──────────────────────────────────────────────────────
        // APMS형 { success: true, data: [...] } 구조로 normalize해서 반환한다.
        if (clean === 'students' && method === 'GET') {
            return {
                type: 'fn',
                fn: async function () {
                    var payload = await window.EieApi.getStudents();
                    var foundation = (window.EieApmsState && typeof window.EieApmsState.normalizeFoundation === 'function')
                        ? window.EieApmsState.normalizeFoundation(payload, null)
                        : { students: [] };
                    return {
                        success: true,
                        data: Array.isArray(foundation.students) ? foundation.students : [],
                        raw: payload
                    };
                }
            };
        }

        // ── students POST ─────────────────────────────────────────────────────
        // Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        if (clean === 'students' && method === 'POST') {
            return { type: 'not_implemented' };
        }

        // ── timetable / timetable-cells GET ───────────────────────────────────
        // Worker endpoint 실존: GET /api/eie/timetable
        if ((clean === 'timetable' || clean === 'timetable-cells') && method === 'GET') {
            return { type: 'fn', fn: function () { return EieApi.getTimetable(); } };
        }

        // ── timetable-cells POST (셀 생성) ────────────────────────────────────
        // Worker endpoint 실존: POST /api/eie/timetable-cells
        if (clean === 'timetable-cells' && method === 'POST') {
            return { type: 'fn', fn: function (payload) { return EieApi.createTimetableCell(payload); } };
        }

        // ── timetable-cells/{id} PATCH (셀 수정) ─────────────────────────────
        // Worker endpoint 실존: PATCH /api/eie/timetable-cells/{id}
        var cellIdPatchMatch = clean.match(/^timetable-cells\/([^/]+)$/);
        if (cellIdPatchMatch && method === 'PATCH') {
            return { type: 'fn', fn: function (payload) { return EieApi.updateTimetableCell(cellIdPatchMatch[1], payload); } };
        }

        // ── consultations GET → 빈 배열 fallback ─────────────────────────────
        // Worker endpoint 없음, GET는 화면 렌더를 위해 빈 배열 허용
        if (clean === 'consultations' || clean.startsWith('consultations?') || clean.startsWith('consultations/')) {
            if (method === 'GET') return { type: 'empty', data: [] };
            return { type: 'not_implemented' };
        }

        // ── parent-foundation/contacts GET → state 필터 ───────────────────────
        // 쓰기는 Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        if (clean.startsWith('parent-foundation/contacts')) {
            if (method === 'GET') {
                var qstart = clean.indexOf('?');
                var params = qstart >= 0 ? new URLSearchParams(clean.slice(qstart + 1)) : new URLSearchParams();
                var studentId = params.get('student_id');
                return {
                    type: 'state_filter',
                    fn: function () {
                        var contacts = (EieState.get().db.parent_contacts) || [];
                        var data = studentId
                            ? contacts.filter(function (c) { return String(c.student_id) === String(studentId); })
                            : contacts;
                        return { success: true, data: data };
                    }
                };
            }
            return { type: 'not_implemented' };
        }

        // ── attendance / homework / class-daily-records ───────────────────────
        // GET는 빈 배열 fallback, 쓰기는 Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        var writeBlockPrefixes = ['attendance', 'homework', 'class-daily-records'];
        for (var i = 0; i < writeBlockPrefixes.length; i++) {
            var prefix = writeBlockPrefixes[i];
            if (clean === prefix || clean.startsWith(prefix + '?') || clean.startsWith(prefix + '/')) {
                if (method === 'GET') return { type: 'empty', data: [] };
                return { type: 'not_implemented' };
            }
        }

        // ── fallback: EieApi.request로 위임 ──────────────────────────────────
        return { type: 'request', path: clean };
    }

    async function callMapped(method, path, payload) {
        var mapped = mapPath(method, path);
        if (mapped.type === 'fn') return mapped.fn(payload);
        if (mapped.type === 'empty') return { success: true, data: mapped.data };
        if (mapped.type === 'state_filter') return mapped.fn();
        if (mapped.type === 'not_implemented') throw makeNotImplementedError(method, path);
        // type === 'request'
        var opts = { method: method };
        if (payload != null) opts.body = payload;
        return EieApi.request(mapped.path, opts);
    }

    function isReady() {
        return !!(window.EieApi && typeof EieApi.request === 'function');
    }

    window.EieApmsApi = {
        get: function (path) { return callMapped('GET', path, undefined); },
        post: function (path, payload) { return callMapped('POST', path, payload); },
        patch: function (path, payload) { return callMapped('PATCH', path, payload); },
        'delete': function (path, payload) { return callMapped('DELETE', path, payload); },
        isReady: isReady,
        mapPath: mapPath
    };

    if (!window.api) {
        window.api = window.EieApmsApi;
    } else {
        window.eieApiAdapter = window.EieApmsApi;
    }
})();
