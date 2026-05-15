(function () {
    const stateKey = '__apStudyMaterialWrongState';
    window[stateKey] = window[stateKey] || {
        tab: 'materials',
        materials: [],
        assignments: [],
        overview: null,
        wrongs: null,
        review: null,
        wrongFilters: { grade: '', class_id: '', student_id: '', material_id: '' },
        reviewFilters: { grade: '', class_id: '', student_id: '', material_id: '' }
    };

    function st() { return window[stateKey]; }
    function h(value) {
        const esc = typeof apEscapeHtml === 'function'
            ? apEscapeHtml
            : (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
        return esc(value);
    }
    function today() {
        return new Date().toLocaleDateString('sv-SE');
    }
    function notify(message, type = 'info') {
        if (typeof toast === 'function') toast(message, type);
    }
    async function call(method, path, body) {
        const headers = { 'Content-Type': 'application/json', ...(typeof getAuthHeader === 'function' ? getAuthHeader() : {}) };
        const res = await fetch(`${CONFIG.API_BASE}/${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) throw new Error(data.message || data.error || '요청 실패');
        return data;
    }
    const get = (path) => call('GET', path);
    const post = (path, body) => call('POST', path, body);
    const patch = (path, body) => call('PATCH', path, body);

    function statusLabel(value) {
        const map = {
            active: '사용 중',
            inactive: '사용 안 함',
            deleted: '삭제됨'
        };
        return map[String(value || '').trim()] || String(value || '');
    }
    function materialTypeLabel(value) {
        const map = {
            textbook: '교과서',
            problem_book: '문제기본서',
            progress_book: '진도교재',
            test_prep: '시험대비교재',
            review_print: '복습프린트',
            clinic_print: '클리닉프린트',
            school_material: '학교자료'
        };
        return map[String(value || '').trim()] || String(value || '');
    }

    function injectStyle() {
        if (document.getElementById('study-material-wrong-style')) return;
        const style = document.createElement('style');
        style.id = 'study-material-wrong-style';
        style.textContent = `
            .smw-wrap { display:flex; flex-direction:column; gap:14px; }
            .smw-tabs { display:flex; gap:6px; overflow-x:auto; padding-bottom:4px; }
            .smw-tab { flex:0 0 auto; min-height:34px; padding:0 11px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:800; }
            .smw-tab.active { background:rgba(26,92,255,.08); border-color:rgba(26,92,255,.20); color:var(--primary); }
            .smw-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
            .smw-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
            .smw-field label { font-size:11px; font-weight:800; color:var(--secondary); }
            .smw-field input, .smw-field select, .smw-field textarea { width:100%; box-sizing:border-box; border:1px solid var(--border); border-radius:12px; background:var(--surface-2); color:var(--text); padding:10px 11px; font-size:13px; font-weight:700; font-family:inherit; }
            .smw-field textarea { min-height:104px; resize:vertical; line-height:1.5; }
            .smw-actions { display:flex; flex-wrap:wrap; gap:8px; }
            .smw-list { display:flex; flex-direction:column; gap:8px; max-height:320px; overflow:auto; }
            .smw-row { border:1px solid var(--border); border-radius:14px; padding:11px; background:var(--surface); }
            .smw-title { font-size:13px; font-weight:800; color:var(--text); line-height:1.35; }
            .smw-meta { margin-top:5px; font-size:11px; font-weight:700; color:var(--secondary); line-height:1.45; }
            .smw-output { white-space:pre-wrap; border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface-2); color:var(--text); font-size:12px; font-weight:700; line-height:1.6; max-height:360px; overflow:auto; }
            @media (max-width:720px) { .smw-grid { grid-template-columns:1fr; } }
        `;
        document.head.appendChild(style);
    }

    function activeClasses() {
        return (state?.db?.classes || []).filter(c => Number(c.is_active ?? 1) !== 0);
    }
    function activeStudents() {
        return (state?.db?.students || []).filter(s => String(s.status || '재원') !== '퇴원');
    }
    function gradeSortValue(value) {
        const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
        const idx = order.indexOf(String(value || '').trim());
        return idx >= 0 ? idx : 99;
    }
    function gradeOptions(selected = '') {
        const grades = new Set();
        activeClasses().forEach(c => { if (c.grade) grades.add(String(c.grade).trim()); });
        activeStudents().forEach(s => { if (s.grade) grades.add(String(s.grade).trim()); });
        return ['<option value="">학년 선택</option>'].concat(
            [...grades].sort((a, b) => gradeSortValue(a) - gradeSortValue(b) || a.localeCompare(b, 'ko'))
                .map(g => `<option value="${h(g)}" ${String(selected) === String(g) ? 'selected' : ''}>${h(g)}</option>`)
        ).join('');
    }
    function filteredClassRows(grade = '') {
        const g = String(grade || '').trim();
        return activeClasses()
            .filter(c => !g || String(c.grade || '').trim() === g)
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }
    function filteredClassOptions(grade = '', selected = '') {
        return ['<option value="">전체 반</option>'].concat(
            filteredClassRows(grade).map(c => `<option value="${h(c.id)}" ${String(selected) === String(c.id) ? 'selected' : ''}>${h(c.name || c.id)}</option>`)
        ).join('');
    }
    function classStudentIds(classId) {
        return new Set((state?.db?.class_students || [])
            .filter(m => String(m.class_id) === String(classId))
            .map(m => String(m.student_id)));
    }
    function filteredStudentRows(grade = '', classId = '') {
        const g = String(grade || '').trim();
        const ids = classId ? classStudentIds(classId) : null;
        return activeStudents()
            .filter(s => !ids || ids.has(String(s.id)))
            .filter(s => !g || String(s.grade || '').trim() === g)
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }
    function filteredStudentOptions(grade = '', classId = '', selected = '') {
        return ['<option value="">전체 학생</option>'].concat(
            filteredStudentRows(grade, classId).map(s => `<option value="${h(s.id)}" ${String(selected) === String(s.id) ? 'selected' : ''}>${h(s.name || s.id)}</option>`)
        ).join('');
    }
    function materialOptions(selected = '', includeAll = false) {
        const first = includeAll ? ['<option value="">전체 자료</option>'] : [];
        return first.concat((st().materials || []).map(m => `<option value="${h(m.id)}" ${String(selected) === String(m.id) ? 'selected' : ''}>${h(m.title || m.id)}</option>`)).join('');
    }
    function optionRows(rows, labelKey = 'name') {
        return (rows || []).map(row => `<option value="${h(row.id)}">${h(row[labelKey] || row.title || row.name || row.id)}</option>`).join('');
    }

    function tabs() {
        const items = [
            ['materials', '자료 등록'],
            ['ranges', '단원 설정'],
            ['assign', '반 배정'],
            ['overview', '제출 확인'],
            ['wrongs', '오답 확인'],
            ['review', '복습 출력']
        ];
        return `<div class="smw-tabs">${items.map(([key, label]) => `<button class="smw-tab ${st().tab === key ? 'active' : ''}" onclick="setStudyMaterialWrongTab('${key}')">${label}</button>`).join('')}</div>`;
    }

    function materialForm() {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>자료종류</label><select id="smw-material-type">
                    <option value="textbook">교과서</option><option value="problem_book">문제기본서</option><option value="progress_book">진도교재</option><option value="test_prep">시험대비교재</option><option value="review_print">복습프린트</option><option value="clinic_print">클리닉프린트</option><option value="school_material">학교자료</option>
                </select></div>
                <div class="smw-field"><label>자료명</label><input id="smw-title" placeholder="예: 쎈 중3-1"></div>
                <div class="smw-field"><label>학년</label><input id="smw-grade" placeholder="예: 중3"></div>
                <div class="smw-field"><label>학기</label><input id="smw-semester" placeholder="예: 1학기"></div>
                <div class="smw-field"><label>시작번호</label><input id="smw-start" type="number" inputmode="numeric"></div>
                <div class="smw-field"><label>끝번호</label><input id="smw-end" type="number" inputmode="numeric"></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterial()">등록</button><button class="btn" onclick="loadStudyMaterialWrongData()">새로고침</button></div>
            <div class="smw-list">${(st().materials || []).map(m => `<div class="smw-row"><div class="smw-title">${h(m.title)}</div><div class="smw-meta">${h(materialTypeLabel(m.material_type))} · ${h(m.grade || '-')} · ${h(m.semester || '-')} · ${h(m.number_start || '')}-${h(m.number_end || '')} · ${h(statusLabel(m.status || 'active'))}</div><div class="smw-actions" style="margin-top:8px;"><button class="btn" onclick="disableStudyMaterial('${h(m.id)}')">비활성화</button></div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 자료가 없습니다.</div></div>'}</div>
        `;
    }

    function rangesForm() {
        return `
            <div class="smw-field"><label>수업자료</label><select id="smw-range-material">${materialOptions()}</select></div>
            <div class="smw-field"><label>범위 붙여넣기</label><textarea id="smw-range-csv" placeholder="순서,대단원,소단원,시작번호,끝번호"></textarea></div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="importStudyMaterialRanges()">등록</button><button class="btn" onclick="loadStudyMaterialRanges()">보기</button></div>
            <div id="smw-range-list" class="smw-list"></div>
        `;
    }

    function assignForm() {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>반</label><select id="smw-assign-class">${optionRows(activeClasses(), 'name')}</select></div>
                <div class="smw-field"><label>수업자료</label><select id="smw-assign-material">${materialOptions()}</select></div>
                <div class="smw-field"><label>배정일</label><input id="smw-assign-date" type="date" value="${today()}"></div>
                <div class="smw-field"><label>배정명</label><input id="smw-assign-title" placeholder="비워두면 자료명 기반"></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterialAssignment()">열기</button><button class="btn" onclick="loadStudyMaterialAssignments()">보기</button></div>
            <div class="smw-list">${assignmentRows()}</div>
        `;
    }

    function assignmentRows() {
        return (st().assignments || []).map(a => `<div class="smw-row"><div class="smw-title">${h(a.assignment_title || a.material_title)}</div><div class="smw-meta">${h(a.class_name || a.class_id)} · ${h(a.material_title || a.material_id)} · ${h(a.assigned_date)} · ${h(statusLabel(a.status || 'active'))}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">열린 자료가 없습니다.</div></div>';
    }

    function overviewForm() {
        return `
            <div class="smw-field"><label>배정</label><select id="smw-overview-assignment">${optionRows(st().assignments, 'assignment_title')}</select></div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialOverview()">조회</button></div>
            <div class="smw-output">${renderOverviewText()}</div>
        `;
    }
    function renderOverviewText() {
        const data = st().overview;
        if (!data) return '조건을 선택하세요.';
        return (data.students || []).map(s => `${s.student_name || s.student_id} · ${s.status} · ${Array.isArray(s.wrong_numbers) ? s.wrong_numbers.join(', ') : ''}`).join('\n') || '결과가 없습니다.';
    }

    function scopeControls(prefix, filters) {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>학년</label><select id="smw-${prefix}-grade" onchange="onStudyMaterialScopeChange('${prefix}', 'grade')">${gradeOptions(filters.grade)}</select></div>
                <div class="smw-field"><label>반</label><select id="smw-${prefix}-class" onchange="onStudyMaterialScopeChange('${prefix}', 'class')">${filteredClassOptions(filters.grade, filters.class_id)}</select></div>
                <div class="smw-field"><label>학생</label><select id="smw-${prefix}-student" onchange="onStudyMaterialScopeChange('${prefix}', 'student')">${filteredStudentOptions(filters.grade, filters.class_id, filters.student_id)}</select></div>
                <div class="smw-field"><label>수업자료</label><select id="smw-${prefix}-material" onchange="onStudyMaterialScopeChange('${prefix}', 'material')">${materialOptions(filters.material_id, true)}</select></div>
            </div>
        `;
    }
    function wrongsForm() {
        const filters = st().wrongFilters;
        return `
            ${scopeControls('wrong', filters)}
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialWrongs()">조회</button></div>
            <div class="smw-output">${renderWrongsText()}</div>
        `;
    }
    function reviewForm() {
        const filters = st().reviewFilters;
        return `
            ${scopeControls('review', filters)}
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialReview()">복습지 보기</button></div>
            <div class="smw-output">${renderReviewText()}</div>
        `;
    }
    function getStudyMaterialScope(prefix) {
        const scope = {
            grade: String(document.getElementById(`smw-${prefix}-grade`)?.value || '').trim(),
            class_id: String(document.getElementById(`smw-${prefix}-class`)?.value || '').trim(),
            student_id: String(document.getElementById(`smw-${prefix}-student`)?.value || '').trim(),
            material_id: String(document.getElementById(`smw-${prefix}-material`)?.value || '').trim()
        };
        scope.type = scope.student_id ? 'student' : scope.class_id ? 'class' : scope.grade ? 'grade' : '';
        return scope;
    }
    function scopeQuery(scope) {
        const params = new URLSearchParams();
        ['grade', 'class_id', 'student_id', 'material_id'].forEach(key => {
            if (scope[key]) params.set(key, scope[key]);
        });
        return params.toString();
    }
    function renderScopeText(scope) {
        if (!scope) return '현재 범위: -';
        if (scope.label) return `현재 범위: ${scope.label}`;
        const parts = [];
        if (scope.grade) parts.push(scope.grade);
        const cls = activeClasses().find(c => String(c.id) === String(scope.class_id));
        if (cls) parts.push(cls.name);
        const student = activeStudents().find(s => String(s.id) === String(scope.student_id));
        if (student) parts.push(student.name);
        const material = st().materials.find(m => String(m.id) === String(scope.material_id));
        if (material) parts.push(material.title);
        return `현재 범위: ${parts.join(' / ') || '-'}`;
    }

    function renderWrongsText() {
        const data = st().wrongs;
        if (!data) return '조건을 선택하세요.';
        const lines = [renderScopeText(data.scope), ''];
        if (data.scope?.type === 'student') {
            lines.push('오답 번호');
            const items = data.items || [];
            lines.push(...(items.length ? items.map(x => `${x.question_no}번 · ${x.unit_text || '단원 미지정'}`) : ['결과가 없습니다.']));
            return lines.join('\n');
        }
        lines.push('자주 틀린 번호');
        lines.push(...((data.top_wrong_numbers || []).length ? data.top_wrong_numbers.map(x => `${x.question_no}번 ${x.count}회`) : ['결과가 없습니다.']));
        lines.push('', '단원별 오답');
        lines.push(...((data.unit_counts || []).length ? data.unit_counts.map(x => `${x.unit_text || '단원 미지정'} ${x.count}개`) : ['결과가 없습니다.']));
        lines.push('', '학생별 오답');
        lines.push(...((data.student_wrongs || []).length ? data.student_wrongs.map(x => `${x.student_name || x.student_id}: ${(x.wrong_numbers || []).join(', ')}`) : ['결과가 없습니다.']));
        return lines.join('\n');
    }

    function renderReviewText() {
        const data = st().review;
        const rows = data?.items || [];
        if (!data) return '조건을 선택하세요.';
        const byStudent = new Map();
        rows.forEach(r => {
            const key = r.student_name || r.student_id || '학생';
            const list = byStudent.get(key) || [];
            list.push(r);
            byStudent.set(key, list);
        });
        const blocks = [...byStudent.entries()].map(([name, list]) => {
            const title = list[0]?.material_title || '수업자료';
            const lines = list.map(r => `- ${r.question_no}번${r.unit_text ? ` (${r.unit_text})` : ''}`).join('\n');
            return `${name} 복습지\n\n${title}\n${lines}\n\n복습 방법\n1. 위 번호만 다시 풀기\n2. 풀이 과정을 표시하기\n3. 다음 수업 때 확인`;
        });
        return [renderScopeText(data.scope), '', ...(blocks.length ? blocks : ['결과가 없습니다.'])].join('\n');
    }

    function body() {
        const current = st().tab;
        return `<div class="smw-wrap">${tabs()}${current === 'materials' ? materialForm() : current === 'ranges' ? rangesForm() : current === 'assign' ? assignForm() : current === 'overview' ? overviewForm() : current === 'wrongs' ? wrongsForm() : reviewForm()}</div>`;
    }
    function render() {
        injectStyle();
        showModal('수업자료', body());
    }

    window.openStudyMaterialWrongCenter = async function () {
        injectStyle();
        showModal('수업자료', '<div class="smw-output">불러오는 중입니다.</div>');
        await loadStudyMaterialWrongData();
    };
    window.setStudyMaterialWrongTab = function (tab) {
        st().tab = tab;
        render();
    };
    window.onStudyMaterialScopeChange = function (prefix, field) {
        const key = prefix === 'review' ? 'reviewFilters' : 'wrongFilters';
        const next = getStudyMaterialScope(prefix);
        if (field === 'grade') {
            next.class_id = '';
            next.student_id = '';
        }
        if (field === 'class') next.student_id = '';
        st()[key] = next;
        render();
    };
    window.loadStudyMaterialWrongData = async function () {
        const [materials, assignments] = await Promise.all([
            get('study-materials'),
            get('class-material-assignments')
        ]);
        st().materials = materials.items || [];
        st().assignments = assignments.items || [];
        render();
    };
    window.createStudyMaterial = async function () {
        await post('study-materials', {
            material_type: document.getElementById('smw-material-type')?.value,
            title: document.getElementById('smw-title')?.value,
            grade: document.getElementById('smw-grade')?.value,
            semester: document.getElementById('smw-semester')?.value,
            numbering_type: 'global',
            number_start: Number(document.getElementById('smw-start')?.value || 0) || null,
            number_end: Number(document.getElementById('smw-end')?.value || 0) || null
        });
        notify('자료를 등록했습니다.');
        await loadStudyMaterialWrongData();
    };
    window.disableStudyMaterial = async function (id) {
        await patch(`study-materials/${encodeURIComponent(id)}/disable`, {});
        notify('비활성화했습니다.');
        await loadStudyMaterialWrongData();
    };
    window.importStudyMaterialRanges = async function () {
        const materialId = document.getElementById('smw-range-material')?.value;
        const lines = String(document.getElementById('smw-range-csv')?.value || '').split(/\r?\n/).map(v => v.trim()).filter(Boolean);
        const items = lines.filter(line => !/^순서\s*,|^unit_order\s*,/i.test(line)).map(line => {
            const [unit_order, unit_text, subunit_text, start_no, end_no] = line.split(',').map(v => v.trim());
            return { unit_order: Number(unit_order) || 0, unit_text, subunit_text, start_no: Number(start_no), end_no: Number(end_no) };
        });
        const res = await post('material-unit-ranges/import', { material_id: materialId, items });
        notify(`저장 ${res.inserted || 0} · 갱신 ${res.updated || 0} · 제외 ${res.skipped || 0}`);
        await loadStudyMaterialRanges();
    };
    window.loadStudyMaterialRanges = async function () {
        const materialId = document.getElementById('smw-range-material')?.value;
        const res = await get(`material-unit-ranges?material_id=${encodeURIComponent(materialId)}`);
        const root = document.getElementById('smw-range-list');
        if (root) root.innerHTML = (res.items || []).map(r => `<div class="smw-row"><div class="smw-title">${h(r.unit_text)}</div><div class="smw-meta">${h(r.subunit_text || '')} · ${r.start_no}-${r.end_no}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 단원이 없습니다.</div></div>';
    };
    window.createStudyMaterialAssignment = async function () {
        await post('class-material-assignments', {
            class_id: document.getElementById('smw-assign-class')?.value,
            material_id: document.getElementById('smw-assign-material')?.value,
            assigned_date: document.getElementById('smw-assign-date')?.value || today(),
            assignment_title: document.getElementById('smw-assign-title')?.value
        });
        notify('배정을 생성했습니다.');
        await loadStudyMaterialAssignments();
    };
    window.loadStudyMaterialAssignments = async function () {
        const res = await get('class-material-assignments');
        st().assignments = res.items || [];
        render();
    };
    window.loadStudyMaterialOverview = async function () {
        const id = document.getElementById('smw-overview-assignment')?.value;
        st().overview = await get(`material-omr/overview?assignment_id=${encodeURIComponent(id)}`);
        render();
    };
    window.loadStudyMaterialWrongs = async function () {
        const scope = getStudyMaterialScope('wrong');
        if (!scope.type) {
            notify('학년을 선택하세요.', 'warn');
            return;
        }
        st().wrongFilters = scope;
        st().wrongs = await get(`material-wrongs/scope?${scopeQuery(scope)}`);
        render();
    };
    window.loadStudyMaterialReview = async function () {
        const scope = getStudyMaterialScope('review');
        if (!scope.type) {
            notify('학년을 선택하세요.', 'warn');
            return;
        }
        st().reviewFilters = scope;
        st().review = await get(`material-review/scope?${scopeQuery(scope)}`);
        render();
    };
    window.loadStudyMaterialStudentWrongs = function () { return window.loadStudyMaterialWrongs(); };
    window.loadStudyMaterialClassWrongs = function () { return window.loadStudyMaterialWrongs(); };
    window.loadStudyMaterialStudentReview = function () { return window.loadStudyMaterialReview(); };
    window.loadStudyMaterialClassReview = function () { return window.loadStudyMaterialReview(); };
})();
