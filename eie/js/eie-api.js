(function () {
    const PROD_WORKER_ORIGIN = 'https://wangji-eie-os.js-pdf.workers.dev';

    function trimSlash(value) {
        return String(value || '').replace(/\/+$/, '');
    }

    function resolveApiBase() {
        if (window.EIE_API_BASE) return trimSlash(window.EIE_API_BASE);
        const meta = document.querySelector('meta[name="eie-api-base"]');
        if (meta?.content) return trimSlash(meta.content);
        if (window.location.origin && /workers\.dev$/i.test(window.location.hostname)) {
            return `${trimSlash(window.location.origin)}/api/eie`;
        }
        return `${PROD_WORKER_ORIGIN}/api/eie`;
    }

    function findStoredAuthHeader() {
        const keys = [
            'WANGJI_EIE_SESSION_TOKEN',
            'WANGJI_AUTH_HEADER',
            'WANGJI_AUTH_TOKEN',
            'WANGJI_SESSION_TOKEN',
            'TEACHER_SESSION_TOKEN',
            'teacher_session_token',
            'session_token'
        ];
        for (const key of keys) {
            const value = window.localStorage ? window.localStorage.getItem(key) : '';
            if (!value) continue;
            const trimmed = String(value).trim();
            if (!trimmed) continue;
            if (/^(Bearer|Basic)\s+/i.test(trimmed)) return trimmed;
            return `Bearer ${trimmed}`;
        }
        return '';
    }

    function makeHeaders(extra) {
        const headers = {
            'Content-Type': 'application/json',
            ...(extra || {})
        };
        const authHeader = findStoredAuthHeader();
        if (authHeader) headers.Authorization = authHeader;
        return headers;
    }

    function stubResponse(kind) {
        if (kind === 'latest') return { success: true, stub: true, data: null, latest_import: null };
        if (kind === 'timetable') return { success: true, stub: true, data: [], timetable_cells: [] };
        if (kind === 'contact-seeds') return { success: true, stub: true, data: [], contact_seeds: [] };
        if (kind === 'needs-review') return { success: true, stub: true, data: [], needs_review: [] };
        return { success: true, stub: true, data: [], student_seeds: [] };
    }

    function normalizeError(error) {
        if (!error) return '요청을 처리하지 못했습니다.';
        if (typeof error === 'string') return error;
        return error.message || '요청을 처리하지 못했습니다.';
    }
    async function parseResponse(response) {
        const text = await response.text();
        if (!text) return null;
        try { return JSON.parse(text); }
        catch (error) { return { success: false, error: text }; }
    }

    async function request(path, options) {
        const url = `${resolveApiBase()}/${String(path || '').replace(/^\/+/, '')}`;
        const response = await fetch(url, {
            method: options?.method || 'GET',
            headers: makeHeaders(options?.headers),
            body: options?.body ? JSON.stringify(options.body) : undefined
        });
        const data = await parseResponse(response);
        if (!response.ok || data?.success === false) {
            const error = new Error(normalizeError(data?.error || data?.message || response.statusText));
            error.status = response.status;
            error.payload = data;
            throw error;
        }
        return data || { success: true };
    }

    // 조회 실패가 빈 데이터(stub)로 위장되므로, 사용자에게는 토스트로 알린다.
    // 화면 진입 시 여러 GET이 동시에 실패해도 도배되지 않도록 8초에 1회만 표시한다.
    let apiFailureToastAt = 0;
    function notifyGetFailure(path, error) {
        try {
            console.error('[EieApi] 조회 실패:', path, error);
            const now = Date.now();
            if (now - apiFailureToastAt < 8000) return;
            apiFailureToastAt = now;
            const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
            const msg = offline
                ? '오프라인 상태입니다. 네트워크 연결을 확인해 주세요.'
                : '서버 연결에 실패했습니다. 표시된 데이터가 최신이 아닐 수 있습니다.';
            if (typeof window.toast === 'function') window.toast(msg, 'error');
        } catch (e) { /* 알림 실패가 호출 흐름을 깨지 않도록 무시 */ }
    }

    async function get(path, kind) {
        try {
            return await request(path, { method: 'GET' });
        } catch (error) {
            if (error.status === 401) throw error;
            notifyGetFailure(path, error);
            return {
                ...stubResponse(kind),
                fallback: true,
                error: normalizeError(error)
            };
        }
    }

    window.EieApi = {
        resolveApiBase,
        getLatestImport() {
            return get('import/latest', 'latest');
        },
        getImport(importId) {
            return get(`import/${encodeURIComponent(importId)}`, 'latest');
        },
        getTimetable(importId, filters) {
            if (importId) return get(`import/${encodeURIComponent(importId)}/timetable-cells`, 'timetable');
            const params = new URLSearchParams();
            if (filters?.status) params.set('status', filters.status);
            const query = params.toString();
            return get(`timetable${query ? `?${query}` : ''}`, 'timetable');
        },
        getStudentSeeds(importId) {
            if (importId) return get(`import/${encodeURIComponent(importId)}/student-seeds`, 'student-seeds');
            return get('student-seeds', 'student-seeds');
        },
        getContactSeeds(importId) {
            if (importId) return get(`import/${encodeURIComponent(importId)}/contact-seeds`, 'contact-seeds');
            return get('contact-seeds', 'contact-seeds');
        },
        getNeedsReview(importId) {
            if (importId) return get(`import/${encodeURIComponent(importId)}/needs-review`, 'needs-review');
            return get('needs-review', 'needs-review');
        },
        async createImport(payload) {
            return request('import', {
                method: 'POST',
                body: payload || {}
            });
        },
        async createTimetableCell(payload) {
            return request('timetable-cells', {
                method: 'POST',
                body: payload || {}
            });
        },
        async updateTimetableCell(cellId, payload) {
            return request(`timetable-cells/${encodeURIComponent(cellId)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async updateTimetableCellStatus(cellId, status) {
            return request(`timetable-cells/${encodeURIComponent(cellId)}/status`, {
                method: 'PATCH',
                body: { status }
            });
        },
        async confirmStudentCandidate(payload) {
            return request('confirm-candidate', {
                method: 'POST',
                body: payload || {}
            });
        },

        // ── 학생 직접 등록/수정 ───────────────────────────────────────
        getStudents() {
            return get('confirmed-students', 'student-seeds');
        },
        async createStudent(payload) {
            return request('students', { method: 'POST', body: payload || {} });
        },
        async updateStudent(studentId, payload) {
            return request(`students/${encodeURIComponent(studentId)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async updateStudentStatus(studentId, status) {
            return request(`students/${encodeURIComponent(studentId)}/status`, {
                method: 'PATCH',
                body: { status }
            });
        },

        // ── 수업 배정/해제 ────────────────────────────────────────────
        async assignStudentToCell(cellId, studentId) {
            return request(`timetable-cells/${encodeURIComponent(cellId)}/students`, {
                method: 'POST',
                body: { student_id: studentId }
            });
        },
        async removeStudentFromCell(cellId, studentId) {
            return request(
                `timetable-cells/${encodeURIComponent(cellId)}/students/${encodeURIComponent(studentId)}`,
                { method: 'DELETE' }
            );
        },
        // 한 셀의 배정/해제를 한 번의 요청으로 처리. payload: { assign: [...], remove: [...] }
        async batchCellStudents(cellId, payload) {
            return request(`timetable-cells/${encodeURIComponent(cellId)}/students/batch`, {
                method: 'POST',
                body: payload || {}
            });
        },
        async deleteStudent(studentId) {
            return request(`students/${encodeURIComponent(studentId)}`, { method: 'DELETE' });
        },

        getStudentContacts(studentId) {
            return get(`students/${encodeURIComponent(studentId)}/contacts`, 'contact-seeds');
        },
        async createStudentContact(studentId, payload) {
            return request(`students/${encodeURIComponent(studentId)}/contacts`, {
                method: 'POST',
                body: payload || {}
            });
        },
        async updateStudentContact(contactId, payload) {
            return request(`student-contacts/${encodeURIComponent(contactId)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async deleteStudentContact(contactId) {
            return request(`student-contacts/${encodeURIComponent(contactId)}`, { method: 'DELETE' });
        },
        getConsultations(studentId) {
            const params = new URLSearchParams();
            if (studentId) params.set('student_id', studentId);
            return get(`consultations${params.toString() ? `?${params}` : ''}`, 'student-seeds');
        },
        async createConsultation(payload) {
            return request('consultations', { method: 'POST', body: payload || {} });
        },
        async updateConsultation(id, payload) {
            return request(`consultations/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async deleteConsultation(id) {
            return request(`consultations/${encodeURIComponent(id)}`, { method: 'DELETE' });
        },

        getAttendanceRecords(filters) {
            const params = new URLSearchParams();
            if (filters?.student_id || filters?.studentId) params.set('student_id', filters.student_id || filters.studentId);
            if (filters?.date) params.set('date', filters.date);
            if (filters?.month) params.set('month', filters.month);
            if (filters?.timetable_cell_id || filters?.cell_id || filters?.cellId) {
                params.set('timetable_cell_id', filters.timetable_cell_id || filters.cell_id || filters.cellId);
            }
            return get(`attendance-records${params.toString() ? `?${params}` : ''}`, 'student-seeds');
        },
        // 선택한 월(YYYY-MM)의 EIE 출석 기록 전체. 원장 월간 출석판 데이터 원천.
        getAttendanceMonth(month) {
            const value = String(month || '').trim();
            return get(`attendance-records?month=${encodeURIComponent(value)}`, 'student-seeds');
        },
        // 학생별 출석 저장(실제 입력 단위). date + timetable_cell_id + student_id 기준.
        async saveAttendanceRecord(payload) {
            return request('attendance-records', { method: 'POST', body: payload || {} });
        },

        getExamRecords(params) {
            const filters = params || {};
            const qs = new URLSearchParams();
            if (filters.student_id || filters.studentId) qs.set('student_id', filters.student_id || filters.studentId);
            if (filters.timetable_cell_id || filters.cell_id || filters.cellId) {
                qs.set('timetable_cell_id', filters.timetable_cell_id || filters.cell_id || filters.cellId);
            }
            if (filters.month) qs.set('month', filters.month);
            if (filters.category) qs.set('category', filters.category);
            return get(`exam-records${qs.toString() ? `?${qs}` : ''}`, 'student-seeds');
        },
        async createExamRecord(payload) {
            return request('exam-records', { method: 'POST', body: payload || {} });
        },
        async updateExamRecord(id, payload) {
            return request(`exam-records/${encodeURIComponent(id)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async deleteExamRecord(id) {
            return request(`exam-records/${encodeURIComponent(id)}`, { method: 'DELETE' });
        },
        async batchExamRecords(payload) {
            return request('exam-records/batch', { method: 'POST', body: payload || {} });
        },

        getTeachers() {
            return get('teachers', 'student-seeds');
        },
        async createTeacher(payload) {
            return request('teachers', { method: 'POST', body: payload || {} });
        },
        async updateTeacher(teacherId, payload) {
            return request(`teachers/${encodeURIComponent(teacherId)}`, {
                method: 'PATCH',
                body: payload || {}
            });
        },
        async resetTeacherPassword(teacherId, newPassword) {
            return request(`teachers/${encodeURIComponent(teacherId)}/reset-password`, {
                method: 'PATCH',
                body: { new_password: newPassword }
            });
        },
        async deleteTeacher(teacherId) {
            return request(`teachers/${encodeURIComponent(teacherId)}`, { method: 'DELETE' });
        },
        async seedDefaultTeachers() {
            return request('teachers/seed-defaults', { method: 'POST' });
        },

        // ── Generic public request methods (APMS compat layer용) ─────
        request(path, options) {
            return request(path, options);
        },
        get(path) {
            return request(path, { method: 'GET' });
        },
        post(path, payload) {
            return request(path, { method: 'POST', body: payload || {} });
        },
        patch(path, payload) {
            return request(path, { method: 'PATCH', body: payload || {} });
        },
        delete(path, payload) {
            const opts = { method: 'DELETE' };
            if (payload != null) opts.body = payload;
            return request(path, opts);
        },
        isAuthError(error) {
            return !!(error && (error.status === 401 || error.status === 403));
        }
    };
})();

