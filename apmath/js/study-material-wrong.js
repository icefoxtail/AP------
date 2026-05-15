(function () {
    const stateKey = '__apStudyMaterialWrongState';
    window[stateKey] = window[stateKey] || {};
    Object.assign(window[stateKey], {
        tab: window[stateKey].tab || 'prepare',
        materials: window[stateKey].materials || [],
        assignments: window[stateKey].assignments || [],
        ranges: window[stateKey].ranges || [],
        entry: window[stateKey].entry || null,
        view: window[stateKey].view || null,
        output: window[stateKey].output || null,
        numberPicker: window[stateKey].numberPicker || null,
        entryFilters: window[stateKey].entryFilters || { grade: '', class_id: '', material_id: '' },
        viewFilters: window[stateKey].viewFilters || { grade: '', class_id: '', student_id: '', material_id: '' }
    });

    function st() { return window[stateKey]; }
    function h(value) {
        const esc = typeof apEscapeHtml === 'function'
            ? apEscapeHtml
            : (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
        return esc(value);
    }
    function today() { return new Date().toLocaleDateString('sv-SE'); }
    function notify(message, type = 'info') { if (typeof toast === 'function') toast(message, type); }
    async function call(method, path, body) {
        const headers = { 'Content-Type': 'application/json', ...(typeof getAuthHeader === 'function' ? getAuthHeader() : {}) };
        const res = await fetch(`${CONFIG.API_BASE}/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.success === false) throw new Error(data.message || data.error || '요청 실패');
        return data;
    }
    const get = (path) => call('GET', path);
    const post = (path, body) => call('POST', path, body);

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
            .smw-tab { flex:0 0 auto; min-height:34px; padding:0 14px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:13px; font-weight:800; }
            .smw-tab.active { background:rgba(26,92,255,.08); border-color:rgba(26,92,255,.20); color:var(--primary); }
            .smw-section { border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:12px; display:flex; flex-direction:column; gap:10px; }
            .smw-section-title { font-size:14px; font-weight:900; color:var(--text); line-height:1.3; }
            .smw-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
            .smw-grid.three { grid-template-columns:repeat(3,minmax(0,1fr)); }
            .smw-field { display:flex; flex-direction:column; gap:5px; min-width:0; }
            .smw-field label { font-size:11px; font-weight:800; color:var(--secondary); }
            .smw-field input, .smw-field select, .smw-field textarea { width:100%; box-sizing:border-box; border:1px solid var(--border); border-radius:12px; background:var(--surface-2); color:var(--text); padding:10px 11px; font-size:13px; font-weight:700; font-family:inherit; }
            .smw-field textarea { min-height:86px; resize:vertical; line-height:1.5; }
            .smw-actions { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
            .smw-list { display:flex; flex-direction:column; gap:8px; max-height:260px; overflow:auto; }
            .smw-row { border:1px solid var(--border); border-radius:14px; padding:11px; background:var(--surface); }
            .smw-title { font-size:13px; font-weight:900; color:var(--text); line-height:1.35; }
            .smw-meta { margin-top:5px; font-size:11px; font-weight:700; color:var(--secondary); line-height:1.45; }
            .smw-output { white-space:pre-wrap; border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface-2); color:var(--text); font-size:12px; font-weight:700; line-height:1.6; max-height:360px; overflow:auto; }
            .smw-help { font-size:11px; font-weight:800; color:var(--secondary); line-height:1.45; }
            .smw-table-wrap { overflow:auto; border:1px solid var(--border); border-radius:14px; }
            .smw-entry-table { width:100%; border-collapse:collapse; min-width:520px; }
            .smw-entry-table th, .smw-entry-table td { border-bottom:1px solid var(--border); padding:8px; font-size:12px; vertical-align:middle; }
            .smw-entry-table th { color:var(--secondary); font-weight:900; background:var(--surface-2); white-space:nowrap; }
            .smw-entry-table td { color:var(--text); font-weight:800; }
            .smw-status-btn { min-width:38px; min-height:34px; border-radius:10px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-weight:900; cursor:pointer; }
            .smw-status-btn.ok { color:var(--success); }
            .smw-status-btn.wrong { color:var(--error); }
            .smw-entry-input { width:100%; min-width:160px; border:1px solid var(--border); border-radius:10px; background:var(--surface-2); color:var(--text); padding:9px 10px; font-size:13px; font-weight:800; font-family:inherit; }
            .smw-picker-overlay { position:fixed; inset:0; z-index:1500; background:rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; padding:16px; }
            .smw-picker { width:min(720px,100%); max-height:86vh; overflow:auto; background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:16px; box-shadow:0 12px 34px rgba(0,0,0,.20); }
            .smw-picker-head { display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:12px; }
            .smw-picker-title { font-size:16px; font-weight:900; color:var(--text); }
            .smw-groups { display:flex; gap:6px; overflow-x:auto; padding:4px 0 10px; }
            .smw-group-btn { flex:0 0 auto; min-height:32px; padding:0 10px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:900; }
            .smw-group-btn.active { background:rgba(26,92,255,.10); border-color:rgba(26,92,255,.28); color:var(--primary); }
            .smw-num-grid { display:grid; grid-template-columns:repeat(10,minmax(0,1fr)); gap:5px; }
            .smw-num-btn { min-height:34px; border-radius:9px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:900; }
            .smw-num-btn.active { background:var(--primary); color:#fff; border-color:var(--primary); }
            @media (min-width:720px) { .smw-num-grid { grid-template-columns:repeat(15,minmax(0,1fr)); } }
            @media (min-width:1100px) { .smw-num-grid { grid-template-columns:repeat(20,minmax(0,1fr)); } }
            @media (max-width:720px) { .smw-grid, .smw-grid.three { grid-template-columns:1fr; } .smw-picker { padding:12px; } }
        `;
        document.head.appendChild(style);
    }

    function activeClasses() { return (state?.db?.classes || []).filter(c => Number(c.is_active ?? 1) !== 0); }
    function activeStudents() { return (state?.db?.students || []).filter(s => !['제적', '퇴원'].includes(String(s.status || '재원'))); }
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
    function filteredClassOptions(grade = '', selected = '', label = '전체 반') {
        return [`<option value="">${h(label)}</option>`].concat(
            filteredClassRows(grade).map(c => `<option value="${h(c.id)}" ${String(selected) === String(c.id) ? 'selected' : ''}>${h(c.name || c.id)}</option>`)
        ).join('');
    }
    function classStudentIds(classId) {
        return new Set((state?.db?.class_students || []).filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id)));
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
    function getSelectedMaterialById(materialId) {
        return (st().materials || []).find(m => String(m.id) === String(materialId));
    }

    function tabs() {
        const items = [['prepare', '준비'], ['entry', '입력'], ['view', '보기']];
        return `<div class="smw-tabs">${items.map(([key, label]) => `<button class="smw-tab ${st().tab === key ? 'active' : ''}" onclick="setStudyMaterialWrongTab('${key}')">${label}</button>`).join('')}</div>`;
    }

    function materialSection() {
        return `
            <div class="smw-section">
                <div class="smw-section-title">자료 등록</div>
                <div class="smw-grid">
                    <div class="smw-field"><label>자료 종류</label><select id="smw-material-type">
                        <option value="textbook">교과서</option><option value="problem_book">문제기본서</option><option value="progress_book">진도교재</option><option value="test_prep">시험대비교재</option><option value="review_print">복습프린트</option><option value="clinic_print">클리닉프린트</option><option value="school_material">학교자료</option>
                    </select></div>
                    <div class="smw-field"><label>자료명</label><input id="smw-title" placeholder="예: 쎈 중3-1"></div>
                    <div class="smw-field"><label>학년</label><input id="smw-grade" placeholder="예: 중3"></div>
                    <div class="smw-field"><label>학기</label><input id="smw-semester" placeholder="예: 1학기"></div>
                    <div class="smw-field"><label>시작 번호</label><input id="smw-start" type="number" inputmode="numeric"></div>
                    <div class="smw-field"><label>끝 번호</label><input id="smw-end" type="number" inputmode="numeric"></div>
                </div>
                <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterial()">등록</button><button class="btn" onclick="loadStudyMaterialWrongData()">새로고침</button></div>
                <div class="smw-list">${(st().materials || []).map(m => `<div class="smw-row"><div class="smw-title">${h(m.title)}</div><div class="smw-meta">${h(materialTypeLabel(m.material_type))} · ${h(m.grade || '-')} · ${h(m.semester || '-')} · ${h(m.number_start || '')}-${h(m.number_end || '')}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 자료가 없습니다.</div></div>'}</div>
            </div>
        `;
    }
    function rangeSection() {
        return `
            <div class="smw-section">
                <div class="smw-section-title">단원 설정</div>
                <div class="smw-field"><label>수업자료</label><select id="smw-range-material">${materialOptions()}</select></div>
                <div class="smw-field"><label>범위 붙여넣기</label><textarea id="smw-range-csv" placeholder="순서,대단원,소단원,시작번호,끝번호"></textarea></div>
                <div class="smw-actions"><button class="btn btn-primary" onclick="importStudyMaterialRanges()">등록</button><button class="btn" onclick="loadStudyMaterialRanges()">보기</button></div>
                <div id="smw-range-list" class="smw-list"></div>
            </div>
        `;
    }
    function assignmentRows() {
        return (st().assignments || []).map(a => `<div class="smw-row"><div class="smw-title">${h(a.assignment_title || a.material_title)}</div><div class="smw-meta">${h(a.class_name || a.class_id)} · ${h(a.material_title || a.material_id)} · ${h(a.assigned_date)}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">열린 자료가 없습니다.</div></div>';
    }
    function assignSection() {
        const f = st().entryFilters || {};
        return `
            <div class="smw-section">
                <div class="smw-section-title">반 배정</div>
                <div class="smw-grid">
                    <div class="smw-field"><label>학년</label><select id="smw-assign-grade" onchange="onStudyMaterialAssignGradeChange()">${gradeOptions(f.grade)}</select></div>
                    <div class="smw-field"><label>반</label><select id="smw-assign-class">${filteredClassOptions(f.grade, f.class_id, '반 선택')}</select></div>
                    <div class="smw-field"><label>수업자료</label><select id="smw-assign-material">${materialOptions(f.material_id)}</select></div>
                    <div class="smw-field"><label>날짜</label><input id="smw-assign-date" type="date" value="${today()}"></div>
                    <div class="smw-field"><label>이름</label><input id="smw-assign-title" placeholder="비워두면 자료명"></div>
                </div>
                <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterialAssignment()">배정</button><button class="btn" onclick="loadStudyMaterialAssignments()">보기</button></div>
                <div class="smw-list">${assignmentRows()}</div>
            </div>
        `;
    }
    function prepareForm() { return `${materialSection()}${rangeSection()}${assignSection()}`; }

    function entryForm() {
        const f = st().entryFilters || { grade: '', class_id: '', material_id: '' };
        return `
            <div class="smw-section">
                <div class="smw-section-title">입력</div>
                <div class="smw-grid three">
                    <div class="smw-field"><label>학년</label><select id="smw-entry-grade" onchange="onStudyMaterialEntryChange('grade')">${gradeOptions(f.grade)}</select></div>
                    <div class="smw-field"><label>반</label><select id="smw-entry-class" onchange="onStudyMaterialEntryChange('class')">${filteredClassOptions(f.grade, f.class_id, '반 선택')}</select></div>
                    <div class="smw-field"><label>수업자료</label><select id="smw-entry-material" onchange="onStudyMaterialEntryChange('material')">${materialOptions(f.material_id)}</select></div>
                </div>
                <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialEntrySheet()">불러오기</button><span class="smw-help">- 미입력 · O 정답 · X 오답 · 제출</span></div>
                ${renderEntryRows()}
            </div>
            ${renderWrongNumberPicker()}
        `;
    }
    function rowStatus(row) {
        if (row.ui_status) return row.ui_status;
        if (Number(row.is_submitted || 0) === 1) return '제출';
        return '-';
    }
    function renderEntryRows() {
        const entry = st().entry;
        if (!entry) return '<div class="smw-output">조건을 선택한 뒤 불러오세요.</div>';
        const rows = entry.students || [];
        if (!rows.length) return '<div class="smw-output">학생이 없습니다.</div>';
        return `
            <div class="smw-table-wrap">
                <table class="smw-entry-table">
                    <thead><tr><th>학생명</th><th>상태</th><th>오답번호</th><th>선택</th></tr></thead>
                    <tbody>${rows.map(row => {
                        const status = rowStatus(row);
                        const nums = (row.wrong_numbers || []).join(', ');
                        const cls = status === 'O' ? 'ok' : status === 'X' || status === '제출' ? 'wrong' : '';
                        return `<tr class="smw-entry-row" data-student-id="${h(row.student_id)}">
                            <td>${h(row.student_name || row.student_id)}</td>
                            <td><button type="button" id="smw-entry-status-${h(row.student_id)}" class="smw-status-btn ${cls}" onclick="toggleStudyMaterialEntryStatus('${h(row.student_id)}')">${h(status)}</button></td>
                            <td><input class="smw-entry-input" id="smw-entry-wrongs-${h(row.student_id)}" value="${h(nums)}" oninput="onStudyMaterialEntryInput('${h(row.student_id)}')" placeholder="12, 15, 22"></td>
                            <td><button type="button" class="btn" onclick="openWrongNumberPicker('${h(row.student_id)}')">선택</button></td>
                        </tr>`;
                    }).join('')}</tbody>
                </table>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="saveStudyMaterialTeacherBatch()">저장</button></div>
        `;
    }

    function parseWrongNumbersText(value) {
        const nums = String(value || '').match(/\d+/g) || [];
        return [...new Set(nums.map(Number).filter(Number.isFinite))].sort((a, b) => a - b);
    }
    function buildNumberGroups(startNo, endNo, size = 100) {
        const groups = [];
        let start = Number(startNo) || 1;
        const end = Math.max(start, Number(endNo) || start);
        while (start <= end) {
            const groupEnd = Math.min(start + size - 1, end);
            groups.push({ start, end: groupEnd, label: `${start}-${groupEnd}` });
            start = groupEnd + 1;
        }
        return groups;
    }
    function getEntryStudent(studentId) {
        return (st().entry?.students || []).find(row => String(row.student_id) === String(studentId));
    }
    function getEntryBounds() {
        const material = st().entry?.material || getSelectedMaterialById(st().entryFilters?.material_id) || {};
        const start = Number(material.number_start || 1);
        const end = Math.max(start, Number(material.number_end || start));
        return { start, end };
    }
    function renderWrongNumberPicker() {
        const picker = st().numberPicker;
        if (!picker) return '';
        const { start, end } = getEntryBounds();
        const groups = buildNumberGroups(start, end, 100);
        const group = groups.find(g => Number(g.start) === Number(picker.groupStart)) || groups[0] || { start, end };
        const selected = new Set((picker.selected || []).map(Number));
        const buttons = [];
        for (let no = group.start; no <= group.end; no += 1) {
            buttons.push(`<button type="button" class="smw-num-btn ${selected.has(no) ? 'active' : ''}" onclick="toggleWrongNumberPick(${no})">${no}</button>`);
        }
        return `
            <div id="smw-number-picker-overlay" class="smw-picker-overlay" onclick="if(event.target===this) closeWrongNumberPicker()">
                <div class="smw-picker" onclick="event.stopPropagation()">
                    <div class="smw-picker-head"><div><div class="smw-picker-title">${h(picker.studentName)} 번호 선택</div><div class="smw-meta">선택: ${(picker.selected || []).length ? (picker.selected || []).join(', ') : '-'}</div></div><button class="btn" onclick="closeWrongNumberPicker()">닫기</button></div>
                    <div class="smw-groups">${groups.map(g => `<button type="button" class="smw-group-btn ${g.start === group.start ? 'active' : ''}" onclick="setWrongNumberPickerGroup(${g.start}, ${g.end})">${g.label}</button>`).join('')}</div>
                    <div class="smw-num-grid">${buttons.join('')}</div>
                    <div class="smw-actions" style="margin-top:12px;"><button class="btn btn-primary" onclick="applyWrongNumberPicker()">적용</button><button class="btn" onclick="closeWrongNumberPicker()">닫기</button></div>
                </div>
            </div>
        `;
    }

    function getScope(prefix) {
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
        ['grade', 'class_id', 'student_id', 'material_id'].forEach(key => { if (scope[key]) params.set(key, scope[key]); });
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
    function viewForm() {
        const f = st().viewFilters || { grade: '', class_id: '', student_id: '', material_id: '' };
        return `
            <div class="smw-section">
                <div class="smw-section-title">보기</div>
                <div class="smw-grid">
                    <div class="smw-field"><label>학년</label><select id="smw-view-grade" onchange="onStudyMaterialViewChange('grade')">${gradeOptions(f.grade)}</select></div>
                    <div class="smw-field"><label>반</label><select id="smw-view-class" onchange="onStudyMaterialViewChange('class')">${filteredClassOptions(f.grade, f.class_id)}</select></div>
                    <div class="smw-field"><label>학생</label><select id="smw-view-student" onchange="onStudyMaterialViewChange('student')">${filteredStudentOptions(f.grade, f.class_id, f.student_id)}</select></div>
                    <div class="smw-field"><label>수업자료</label><select id="smw-view-material" onchange="onStudyMaterialViewChange('material')">${materialOptions(f.material_id, true)}</select></div>
                </div>
                <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialView()">조회</button>${st().view ? '<button class="btn" onclick="showStudyMaterialOutput()">출력</button>' : ''}</div>
                <div class="smw-output">${renderViewText()}</div>
                ${st().output ? `<div class="smw-output">${h(st().output)}</div>` : ''}
            </div>
        `;
    }
    function submissionStatusText(row) {
        if (!row) return '-';
        if (Number(row.is_submitted || 0) !== 1) return '-';
        if (Number(row.is_no_wrong || 0) === 1) return 'O';
        return (row.wrong_numbers || []).length ? 'X' : '제출';
    }
    function renderViewText() {
        const data = st().view;
        if (!data) return '조건을 선택하세요.';
        const lines = [renderScopeText(data.scope), ''];
        const submissions = data.submissions || [];
        lines.push('제출');
        lines.push(...(submissions.length ? submissions.map(s => `${s.student_name || s.student_id} ${s.status || submissionStatusText(s)}`) : ['결과가 없습니다.']));
        lines.push('', '오답');
        lines.push(...((data.top_wrong_numbers || []).length ? data.top_wrong_numbers.map(x => `${x.question_no}번 ${x.count}회`) : ['결과가 없습니다.']));
        lines.push('', '단원');
        lines.push(...((data.unit_counts || []).length ? data.unit_counts.map(x => `${x.unit_text || '단원 미지정'} ${x.count}개`) : ['결과가 없습니다.']));
        lines.push('', '학생별');
        const students = data.student_wrongs || [];
        lines.push(...(students.length ? students.map(x => `${x.student_name || x.student_id}: ${(x.wrong_numbers || []).length ? x.wrong_numbers.join(', ') : 'O'}`) : ['결과가 없습니다.']));
        if (data.scope?.type === 'student' && (data.items || []).length) {
            lines.push('', '오답번호');
            lines.push(...data.items.map(x => `${x.question_no}번${x.unit_text ? ` (${x.unit_text})` : ''}`));
        }
        return lines.join('\n');
    }
    function renderOutputText() {
        const data = st().view;
        if (!data) return '';
        const title = `${(data.scope?.label || '수업자료')} 오답번호`;
        const rows = data.student_wrongs || [];
        if (!rows.length && data.scope?.type === 'student' && (data.items || []).length) {
            const name = data.items[0].student_name || '학생';
            return `${title}\n\n${name}\n${data.items.map(x => x.question_no).join(', ')}`;
        }
        return [title, '', ...(rows.length ? rows.map(r => `${r.student_name || r.student_id}\n${(r.wrong_numbers || []).length ? r.wrong_numbers.join(', ') : 'O'}`) : ['결과가 없습니다.'])].join('\n');
    }

    function body() {
        return `<div class="smw-wrap">${tabs()}${st().tab === 'prepare' ? prepareForm() : st().tab === 'entry' ? entryForm() : viewForm()}</div>`;
    }
    function render() { injectStyle(); showModal('수업자료', body()); }

    window.openStudyMaterialWrongCenter = async function () {
        injectStyle();
        showModal('수업자료', '<div class="smw-output">불러오는 중입니다.</div>');
        await loadStudyMaterialWrongData();
    };
    window.setStudyMaterialWrongTab = function (tab) { st().tab = tab; st().output = null; render(); };
    window.loadStudyMaterialWrongData = async function () {
        const [materials, assignments] = await Promise.all([get('study-materials'), get('class-material-assignments')]);
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
        notify('등록했습니다.');
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
        if (!materialId) return notify('수업자료를 선택하세요.', 'warn');
        const res = await get(`material-unit-ranges?material_id=${encodeURIComponent(materialId)}`);
        const root = document.getElementById('smw-range-list');
        if (root) root.innerHTML = (res.items || []).map(r => `<div class="smw-row"><div class="smw-title">${h(r.unit_text)}</div><div class="smw-meta">${h(r.subunit_text || '')} · ${r.start_no}-${r.end_no}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 단원이 없습니다.</div></div>';
    };
    window.onStudyMaterialAssignGradeChange = function () {
        st().entryFilters.grade = document.getElementById('smw-assign-grade')?.value || '';
        st().entryFilters.class_id = '';
        render();
    };
    window.createStudyMaterialAssignment = async function () {
        await post('class-material-assignments', {
            class_id: document.getElementById('smw-assign-class')?.value,
            material_id: document.getElementById('smw-assign-material')?.value,
            assigned_date: document.getElementById('smw-assign-date')?.value || today(),
            assignment_title: document.getElementById('smw-assign-title')?.value
        });
        notify('배정했습니다.');
        await loadStudyMaterialAssignments();
    };
    window.loadStudyMaterialAssignments = async function () {
        const res = await get('class-material-assignments');
        st().assignments = res.items || [];
        render();
    };

    window.onStudyMaterialEntryChange = function (field) {
        const next = {
            grade: document.getElementById('smw-entry-grade')?.value || '',
            class_id: document.getElementById('smw-entry-class')?.value || '',
            material_id: document.getElementById('smw-entry-material')?.value || ''
        };
        if (field === 'grade') next.class_id = '';
        st().entryFilters = next;
        st().entry = null;
        render();
    };
    window.loadStudyMaterialEntrySheet = async function () {
        const f = {
            grade: document.getElementById('smw-entry-grade')?.value || '',
            class_id: document.getElementById('smw-entry-class')?.value || '',
            material_id: document.getElementById('smw-entry-material')?.value || ''
        };
        if (!f.class_id) return notify('반을 선택하세요.', 'warn');
        if (!f.material_id) return notify('수업자료를 선택하세요.', 'warn');
        st().entryFilters = f;
        const res = await get(`material-omr/entry-sheet?class_id=${encodeURIComponent(f.class_id)}&material_id=${encodeURIComponent(f.material_id)}`);
        st().entry = res;
        render();
    };
    window.toggleStudyMaterialEntryStatus = function (studentId) {
        const row = getEntryStudent(studentId);
        if (!row) return;
        const status = rowStatus(row);
        const next = status === 'O' ? '-' : 'O';
        row.ui_status = next;
        if (next === 'O') {
            row.wrong_numbers = [];
            const input = document.getElementById(`smw-entry-wrongs-${studentId}`);
            if (input) input.value = '';
        }
        render();
    };
    window.onStudyMaterialEntryInput = function (studentId) {
        const row = getEntryStudent(studentId);
        const input = document.getElementById(`smw-entry-wrongs-${studentId}`);
        if (!row || !input) return;
        const nums = parseWrongNumbersText(input.value);
        row.wrong_numbers = nums;
        row.ui_status = nums.length ? 'X' : '-';
        const status = document.getElementById(`smw-entry-status-${studentId}`);
        if (status) {
            status.textContent = row.ui_status;
            status.classList.toggle('wrong', row.ui_status === 'X');
            status.classList.toggle('ok', row.ui_status === 'O');
        }
    };
    window.openWrongNumberPicker = function (studentId) {
        const row = getEntryStudent(studentId);
        if (!row) return;
        const { start, end } = getEntryBounds();
        const input = document.getElementById(`smw-entry-wrongs-${studentId}`);
        const selected = parseWrongNumbersText(input?.value || (row.wrong_numbers || []).join(','));
        const groups = buildNumberGroups(start, end, 100);
        st().numberPicker = {
            studentId,
            studentName: row.student_name || row.student_id,
            groupStart: groups[0]?.start || start,
            groupEnd: groups[0]?.end || Math.min(end, start + 99),
            selected
        };
        render();
    };
    window.setWrongNumberPickerGroup = function (start, end) {
        if (!st().numberPicker) return;
        st().numberPicker.groupStart = Number(start);
        st().numberPicker.groupEnd = Number(end);
        render();
    };
    window.toggleWrongNumberPick = function (no) {
        if (!st().numberPicker) return;
        const n = Number(no);
        const selected = new Set((st().numberPicker.selected || []).map(Number));
        if (selected.has(n)) selected.delete(n);
        else selected.add(n);
        st().numberPicker.selected = [...selected].sort((a, b) => a - b);
        render();
    };
    window.applyWrongNumberPicker = function () {
        const picker = st().numberPicker;
        if (!picker) return;
        const row = getEntryStudent(picker.studentId);
        if (row) {
            row.wrong_numbers = [...(picker.selected || [])].sort((a, b) => a - b);
            row.ui_status = row.wrong_numbers.length ? 'X' : '-';
        }
        st().numberPicker = null;
        render();
    };
    window.closeWrongNumberPicker = function () { st().numberPicker = null; render(); };
    window.saveStudyMaterialTeacherBatch = async function () {
        const entry = st().entry;
        if (!entry?.assignment?.id) return notify('먼저 불러오세요.', 'warn');
        const { start, end } = getEntryBounds();
        const rows = [];
        let empty = 0;
        let okCount = 0;
        for (const row of (entry.students || [])) {
            const input = document.getElementById(`smw-entry-wrongs-${row.student_id}`);
            const nums = parseWrongNumbersText(input?.value || '');
            const status = row.ui_status || (nums.length ? 'X' : rowStatus(row));
            const isOk = status === 'O';
            if (!isOk && !nums.length) { empty += 1; continue; }
            for (const n of nums) {
                if (n < start || n > end) return notify(`${row.student_name || row.student_id} 번호 범위를 확인하세요.`, 'warn');
            }
            if (isOk) okCount += 1;
            rows.push({ student_id: row.student_id, wrong_numbers: isOk ? [] : nums, is_no_wrong: isOk ? 1 : 0 });
        }
        if (!rows.length) return notify('저장할 내용이 없습니다.', 'warn');
        if (!confirm(`저장 ${rows.length}명\n정답 ${okCount}명\n미입력 ${empty}명\n\n저장할까요?`)) return;
        const res = await post('material-omr/teacher-batch-save', { assignment_id: entry.assignment.id, rows });
        notify(`저장했습니다. (${res.saved || 0}명)`);
        await loadStudyMaterialEntrySheet();
    };

    window.onStudyMaterialViewChange = function (field) {
        const next = getScope('view');
        if (field === 'grade') { next.class_id = ''; next.student_id = ''; }
        if (field === 'class') next.student_id = '';
        st().viewFilters = next;
        st().view = null;
        st().output = null;
        render();
    };
    window.loadStudyMaterialView = async function () {
        const scope = getScope('view');
        if (!scope.type) return notify('학년을 선택하세요.', 'warn');
        st().viewFilters = scope;
        st().view = await get(`material-wrongs/scope?${scopeQuery(scope)}`);
        st().output = null;
        render();
    };
    window.showStudyMaterialOutput = function () { st().output = renderOutputText(); render(); };

    window.loadStudyMaterialWrongs = window.loadStudyMaterialView;
    window.loadStudyMaterialReview = window.loadStudyMaterialView;
    window.loadStudyMaterialStudentWrongs = window.loadStudyMaterialView;
    window.loadStudyMaterialClassWrongs = window.loadStudyMaterialView;
    window.loadStudyMaterialStudentReview = window.loadStudyMaterialView;
    window.loadStudyMaterialClassReview = window.loadStudyMaterialView;
})();
