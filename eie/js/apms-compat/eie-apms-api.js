(function () {
    // APMS 복사 코드가 기대하는 window.api.get/post/patch/delete 형태를 EIE에서 제공한다.
    //
    // Round 1.5 정책:
    // - Worker endpoint가 실제 구현된 학생 CRUD (POST/PATCH/DELETE students)를 not_implemented에서 해제한다.
    // - 응답은 APMS 복사 코드가 받기 쉬운 { success:true, data: student, student } 형태로 normalize한다.
    // - 상담/숙제/출결/연락처 별도 CRUD는 계속 EIE_NOT_IMPLEMENTED로 차단한다.
    //
    // window.api 정책:
    // - window.api가 없으면 window.api = window.EieApmsApi로 설정.
    // - 이미 window.api가 있으면 window.eieApiAdapter를 제공하고 덮어쓰지 않는다.
    //
    // Worker에 실제 존재하는 endpoint (Round 1.5 기준):
    // - GET  /api/eie/confirmed-students
    // - GET  /api/eie/timetable
    // - POST /api/eie/timetable-cells
    // - PATCH /api/eie/timetable-cells/{id}
    // - PATCH /api/eie/timetable-cells/{id}/status
    // - POST  /api/eie/students          ← Round 1.5 신규
    // - PATCH /api/eie/students/{id}     ← Round 1.5 신규
    // - PATCH /api/eie/students/{id}/status ← Round 1.5 신규
    // - DELETE /api/eie/students/{id}    ← Round 1.5 신규
    //
    // 계속 EIE_NOT_IMPLEMENTED:
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

    // Worker가 반환하는 { success, student, data, contacts, warnings }를
    // APMS 복사 코드가 기대하는 { success, data, student } 형태로 normalize한다.
    function normalizeStudentWriteResult(result) {
        var student = result && (result.student || result.data);
        return {
            success: !!(result && result.success),
            data: student || null,
            student: student || null,
            contacts: (result && result.contacts) || [],
            warnings: (result && result.warnings) || [],
            soft_deleted: result && result.soft_deleted,
            archived: result && result.archived
        };
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
        // Round 1.5: Worker endpoint 구현 완료 → not_implemented 해제
        var studentStatusMatch = clean.match(/^students\/([^/]+)\/status$/);
        if (studentStatusMatch && (method === 'PATCH' || method === 'POST')) {
            var statusId = studentStatusMatch[1];
            return {
                type: 'fn',
                fn: async function (payload) {
                    var result = await EieApi.updateStudentStatus(statusId, payload && payload.status);
                    return normalizeStudentWriteResult(result);
                }
            };
        }

        // ── students/{id} DELETE ──────────────────────────────────────────────
        // Round 1.5: Worker endpoint 구현 완료 → not_implemented 해제 (soft delete)
        var studentIdDeleteMatch = clean.match(/^students\/([^/]+)$/);
        if (studentIdDeleteMatch && method === 'DELETE') {
            var deleteId = studentIdDeleteMatch[1];
            return {
                type: 'fn',
                fn: async function () {
                    var result = await EieApi.deleteStudent(deleteId);
                    return normalizeStudentWriteResult(result);
                }
            };
        }

        // ── students/{id} PATCH ───────────────────────────────────────────────
        // Round 1.5: Worker endpoint 구현 완료 → not_implemented 해제
        var studentIdPatchMatch = clean.match(/^students\/([^/]+)$/);
        if (studentIdPatchMatch && method === 'PATCH') {
            var patchId = studentIdPatchMatch[1];
            return {
                type: 'fn',
                fn: async function (payload) {
                    var result = await EieApi.updateStudent(patchId, payload);
                    return normalizeStudentWriteResult(result);
                }
            };
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
        // Round 1.5: Worker endpoint 구현 완료 → not_implemented 해제
        if (clean === 'students' && method === 'POST') {
            return {
                type: 'fn',
                fn: async function (payload) {
                    var result = await EieApi.createStudent(payload);
                    return normalizeStudentWriteResult(result);
                }
            };
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
        // 쓰기는 Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        if (clean === 'consultations' || clean.startsWith('consultations?') || clean.startsWith('consultations/')) {
            if (method === 'GET') {
                var cnsQstart = clean.indexOf('?');
                var cnsParams = cnsQstart >= 0 ? new URLSearchParams(clean.slice(cnsQstart + 1)) : new URLSearchParams();
                var cnsStudentId = cnsParams.get('student_id') || '';
                if (cnsStudentId) return { type: 'fn', fn: function () { return EieApi.getConsultations(cnsStudentId); } };
                return {
                    type: 'state_filter',
                    fn: function () {
                        var consultations = (EieState.get().db.consultations) || [];
                        return { success: true, data: consultations, consultations: consultations };
                    }
                };
            }
            if (clean === 'consultations' && method === 'POST') {
                return { type: 'fn', fn: function (payload) { return EieApi.createConsultation(payload); } };
            }
            var cnsIdMatch = clean.match(/^consultations\/([^/]+)$/);
            if (cnsIdMatch && method === 'PATCH') {
                return { type: 'fn', fn: function (payload) { return EieApi.updateConsultation(cnsIdMatch[1], payload); } };
            }
            if (cnsIdMatch && method === 'DELETE') {
                return { type: 'fn', fn: function () { return EieApi.deleteConsultation(cnsIdMatch[1]); } };
            }
            return { type: 'not_implemented' };
        }

        // ── parent-foundation/contacts GET → state 필터 ───────────────────────
        // 쓰기는 Worker endpoint 없음 → EIE_NOT_IMPLEMENTED
        if (clean.startsWith('parent-foundation/contacts')) {
            if (method === 'GET') {
                var qstart = clean.indexOf('?');
                var params = qstart >= 0 ? new URLSearchParams(clean.slice(qstart + 1)) : new URLSearchParams();
                var studentId = params.get('student_id');
                if (studentId) return { type: 'fn', fn: function () { return EieApi.getStudentContacts(studentId); } };
                return {
                    type: 'state_filter',
                    fn: function () {
                        var contacts = (EieState.get().db.parent_contacts) || [];
                        return { success: true, data: contacts, contacts: contacts };
                    }
                };
            }
            if (clean === 'parent-foundation/contacts' && method === 'POST') {
                return {
                    type: 'fn',
                    fn: function (payload) {
                        var contactStudentId = payload && payload.student_id;
                        if (!contactStudentId) throw makeNotImplementedError(method, path);
                        return EieApi.createStudentContact(contactStudentId, payload);
                    }
                };
            }
            var contactIdMatch = clean.match(/^parent-foundation\/contacts\/([^/]+)$/);
            if (contactIdMatch && method === 'PATCH') {
                return { type: 'fn', fn: function (payload) { return EieApi.updateStudentContact(contactIdMatch[1], payload); } };
            }
            if (contactIdMatch && method === 'DELETE') {
                return { type: 'fn', fn: function () { return EieApi.deleteStudentContact(contactIdMatch[1]); } };
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
