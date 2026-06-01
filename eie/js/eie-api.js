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

    async function get(path, kind) {
        try {
            return await request(path, { method: 'GET' });
        } catch (error) {
            if (error.status === 401) throw error;
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

