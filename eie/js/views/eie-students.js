(function () {
    function escapeHtml(value) {
        if (window.EieApp?.escapeHtml) return window.EieApp.escapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    let _students = [];
    let _error = '';
    let _selectedStudentId = '';

    function resolveAuthHeader() {
        const keys = [
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

    async function loadConfirmedStudents() {
        const base = EieApi.resolveApiBase();
        const url = `${base}/confirmed-students`;
        const headers = { 'Content-Type': 'application/json' };
        const authHeader = resolveAuthHeader();
        if (authHeader) headers.Authorization = authHeader;

        const response = await fetch(url, { method: 'GET', headers });
        let data = null;
        try {
            const text = await response.text();
            if (text) data = JSON.parse(text);
        } catch (_) { /* non-JSON body — leave data null */ }

        if (!response.ok || data?.success === false) {
            const msg = data?.error || data?.message || response.statusText || '학생 목록을 불러오지 못했습니다.';
            const err = new Error(msg);
            err.status = response.status;
            throw err;
        }
        return data;
    }

    function asStudentRows(data) {
        if (Array.isArray(data?.data)) return data.data;
        if (Array.isArray(data?.confirmed_students)) return data.confirmed_students;
        if (Array.isArray(data?.students)) return data.students;
        if (Array.isArray(data?.rows)) return data.rows;
        return [];
    }

    function pickPhone(student) {
        if (student?.phone_raw) return student.phone_raw;
        if (student?.phone) return student.phone;
        if (student?.normalized_phone) return student.normalized_phone;
        if (student?.primary_phone) return student.primary_phone;
        const contacts = Array.isArray(student?.contacts) ? student.contacts : [];
        if (contacts[0]?.phone_raw) return contacts[0].phone_raw;
        if (contacts[0]?.phone) return contacts[0].phone;
        return '';
    }

    function studentDisplayName(student) {
        return student?.display_name || student?.name || student?.normalized_name || '-';
    }

    function gradeLabel(student) {
        return student?.grade_raw || student?.grade || '-';
    }

    function statusLabel(student) {
        const s = student?.status || 'active';
        if (s === 'active' || s === 'imported') return '운영';
        if (s === 'archived') return '보관';
        if (s === 'hidden') return '숨김';
        if (s === 'needs_review') return '확인 필요';
        return s;
    }

    function statusClass(student) {
        const s = student?.status || 'active';
        if (s === 'active' || s === 'imported') return 'is-ok';
        if (s === 'needs_review') return 'is-warn';
        return 'is-muted';
    }

    function renderStudentRow(student) {
        const id = String(student?.id || '');
        const isSelected = id && id === _selectedStudentId;
        const name = studentDisplayName(student);
        const grade = gradeLabel(student);
        const status = statusLabel(student);
        const stClass = statusClass(student);
        const assignmentCount = String(Number(student?.assignment_count || 0));
        return `
            <tr class="eie-student-row${isSelected ? ' is-selected' : ''}"
                onclick="EieStudentsView.selectStudent(${escapeHtml(JSON.stringify(id))})"
                tabindex="0"
                role="button"
                aria-selected="${isSelected ? 'true' : 'false'}">
                <td>${escapeHtml(name)}</td>
                <td>${escapeHtml(grade)}</td>
                <td><span class="eie-status ${escapeHtml(stClass)}">${escapeHtml(status)}</span></td>
                <td>${escapeHtml(assignmentCount)}</td>
            </tr>
        `;
    }

    function renderStudentList(students) {
        if (!students.length) {
            return '<div class="eie-empty-box">등록된 학생이 없습니다.</div>';
        }
        return `
            <div class="eie-students-table-wrap">
                <table class="eie-students-table" aria-label="확정 학생 목록">
                    <thead>
                        <tr>
                            <th scope="col">이름</th>
                            <th scope="col">학년</th>
                            <th scope="col">상태</th>
                            <th scope="col">수업 수</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(renderStudentRow).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderDetailPanel(student) {
        const phone = pickPhone(student) || '-';
        const name = studentDisplayName(student);
        const grade = gradeLabel(student);
        const status = statusLabel(student);
        const assignmentCount = String(Number(student?.assignment_count || 0));
        const contactCount = String(Number(student?.contact_count || 0));
        return `
            <aside class="eie-editor-panel eie-student-detail-panel" aria-label="학생 상세">
                <div class="eie-editor-head">
                    <h2>학생 상세</h2>
                    <button type="button" class="eie-icon-button" onclick="EieStudentsView.closeDetail()">닫기</button>
                </div>
                <div class="eie-student-detail-title">
                    <strong>${escapeHtml(name)}</strong>
                </div>
                <div class="eie-detail-grid">
                    <div class="eie-detail-row"><span>이름</span><strong>${escapeHtml(name)}</strong></div>
                    <div class="eie-detail-row"><span>학년</span><strong>${escapeHtml(grade)}</strong></div>
                    <div class="eie-detail-row"><span>상태</span><strong>${escapeHtml(status)}</strong></div>
                    <div class="eie-detail-row"><span>수업 수</span><strong>${escapeHtml(assignmentCount)}</strong></div>
                    <div class="eie-detail-row"><span>연락처 수</span><strong>${escapeHtml(contactCount)}</strong></div>
                    <div class="eie-detail-row"><span>전화번호</span><strong>${escapeHtml(phone)}</strong></div>
                </div>
                <div class="eie-api-note">전화번호는 학생 상세에서만 표시됩니다.</div>
            </aside>
        `;
    }

    function getSelectedStudent() {
        if (!_selectedStudentId) return null;
        return _students.find(s => String(s?.id || '') === _selectedStudentId) || null;
    }

    async function rerender() {
        const html = await EieStudentsView.render();
        await EieApp.mount(html);
    }

    window.EieStudentsView = {
        async render() {
            _error = '';
            try {
                const data = await loadConfirmedStudents();
                _students = asStudentRows(data);
                if (data?.fallback || (data?.stub && !_students.length)) {
                    _error = data?.error || '학생 목록을 불러오지 못했습니다.';
                }
            } catch (err) {
                _students = [];
                _error = err?.message || '학생 목록을 불러오지 못했습니다.';
            }

            const selectedStudent = getSelectedStudent();
            const listHtml = (_error && !_students.length)
                ? `<div class="eie-error-box">학생 목록을 불러오지 못했습니다.</div>`
                : renderStudentList(_students);

            return `
                <section aria-labelledby="eie-students-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">EIE 학생관리</p>
                        <h1 id="eie-students-title" class="eie-panel-title">확정 학생 목록</h1>
                        <p class="eie-panel-copy">확정된 학생 ${escapeHtml(String(_students.length))}명 기준입니다. 학생을 클릭하면 상세에서 전화번호를 확인할 수 있습니다.</p>
                        ${_error ? `<div class="eie-error-box">${escapeHtml(_error)}</div>` : ''}
                        <div class="eie-students-layout">
                            <div class="eie-students-main">
                                ${listHtml}
                            </div>
                            ${selectedStudent ? renderDetailPanel(selectedStudent) : ''}
                        </div>
                    </div>
                </section>
            `;
        },

        selectStudent(id) {
            const next = String(id || '');
            _selectedStudentId = next === _selectedStudentId ? '' : next;
            rerender();
        },

        closeDetail() {
            _selectedStudentId = '';
            rerender();
        }
    };
})();
