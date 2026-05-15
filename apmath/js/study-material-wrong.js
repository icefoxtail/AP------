(function () {
    const stateKey = '__apStudyMaterialWrongState';
    window[stateKey] = window[stateKey] || {
        tab: 'materials',
        materials: [],
        assignments: [],
        overview: null,
        wrongs: null,
        review: null
    };

    function st() { return window[stateKey]; }
    function h(value) {
        const esc = typeof apEscapeHtml === 'function' ? apEscapeHtml : (v) => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));
        return esc(value);
    }
    function today() {
        return new Date().toLocaleDateString('sv-SE');
    }
    function optionRows(rows, labelKey = 'name') {
        return (rows || []).map(row => `<option value="${h(row.id)}">${h(row[labelKey] || row.title || row.name || row.id)}</option>`).join('');
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

    function materialOptions() {
        return optionRows(st().materials, 'title');
    }
    function classOptions() {
        return optionRows((state?.db?.classes || []).filter(c => Number(c.is_active ?? 1) !== 0), 'name');
    }
    function studentOptions() {
        return optionRows(state?.db?.students || [], 'name');
    }

    function tabs() {
        const items = [
            ['materials', '수업자료 관리'],
            ['ranges', '단원 번호'],
            ['assign', '배정'],
            ['overview', '제출 현황'],
            ['wrongs', '오답 조회'],
            ['review', '복습 지시표']
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
            <div class="smw-list">${(st().materials || []).map(m => `<div class="smw-row"><div class="smw-title">${h(m.title)}</div><div class="smw-meta">${h(m.material_type)} · ${h(m.grade || '-')} · ${h(m.semester || '-')} · ${h(m.number_start || '')}-${h(m.number_end || '')} · ${h(m.status || 'active')}</div><div class="smw-actions" style="margin-top:8px;"><button class="btn" onclick="disableStudyMaterial('${h(m.id)}')">비활성화</button></div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 수업자료가 없습니다.</div></div>'}</div>
        `;
    }

    function rangesForm() {
        return `
            <div class="smw-field"><label>수업자료</label><select id="smw-range-material">${materialOptions()}</select></div>
            <div class="smw-field"><label>CSV 붙여넣기</label><textarea id="smw-range-csv" placeholder="unit_order,unit_text,subunit_text,start_no,end_no"></textarea></div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="importStudyMaterialRanges()">CSV import</button><button class="btn" onclick="loadStudyMaterialRanges()">목록 조회</button></div>
            <div id="smw-range-list" class="smw-list"></div>
        `;
    }

    function assignForm() {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>반</label><select id="smw-assign-class">${classOptions()}</select></div>
                <div class="smw-field"><label>수업자료</label><select id="smw-assign-material">${materialOptions()}</select></div>
                <div class="smw-field"><label>배정일</label><input id="smw-assign-date" type="date" value="${today()}"></div>
                <div class="smw-field"><label>배정명</label><input id="smw-assign-title" placeholder="비워두면 자료명 기반"></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterialAssignment()">배정 생성</button><button class="btn" onclick="loadStudyMaterialAssignments()">배정 목록</button></div>
            <div class="smw-list">${assignmentRows()}</div>
        `;
    }

    function assignmentRows() {
        return (st().assignments || []).map(a => `<div class="smw-row"><div class="smw-title">${h(a.assignment_title || a.material_title)}</div><div class="smw-meta">${h(a.class_name || a.class_id)} · ${h(a.material_title || a.material_id)} · ${h(a.assigned_date)} · ${h(a.status || 'active')}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">조회된 배정이 없습니다.</div></div>';
    }

    function overviewForm() {
        return `
            <div class="smw-field"><label>배정</label><select id="smw-overview-assignment">${optionRows(st().assignments, 'assignment_title')}</select></div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialOverview()">제출 현황 조회</button></div>
            <div class="smw-output">${renderOverviewText()}</div>
        `;
    }

    function renderOverviewText() {
        const data = st().overview;
        if (!data) return '배정을 선택한 뒤 제출 현황을 조회하세요.';
        return (data.students || []).map(s => `${s.student_name || s.student_id} · ${s.status} · ${Array.isArray(s.wrong_numbers) ? s.wrong_numbers.join(', ') : ''}`).join('\n') || '조회 결과가 없습니다.';
    }

    function wrongsForm() {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>학생</label><select id="smw-wrong-student">${studentOptions()}</select></div>
                <div class="smw-field"><label>반</label><select id="smw-wrong-class">${classOptions()}</select></div>
                <div class="smw-field"><label>수업자료</label><select id="smw-wrong-material">${materialOptions()}</select></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialStudentWrongs()">학생별 오답</button><button class="btn" onclick="loadStudyMaterialClassWrongs()">반별 오답</button></div>
            <div class="smw-output">${renderWrongsText()}</div>
        `;
    }

    function renderWrongsText() {
        const data = st().wrongs;
        if (!data) return '조회 조건을 선택하세요.';
        if (data.items) return data.items.map(x => `${x.question_no}번 · ${x.unit_text || '단원 미지정'} · ${x.type_text || ''} ${x.tags || ''}`).join('\n') || '오답이 없습니다.';
        return [
            'TOP 오답',
            ...(data.top_wrong_numbers || []).map(x => `${x.question_no}번 ${x.count}회`),
            '',
            '단원별',
            ...(data.unit_counts || []).map(x => `${x.unit_text} ${x.count}개`)
        ].join('\n');
    }

    function reviewForm() {
        return `
            <div class="smw-grid">
                <div class="smw-field"><label>학생</label><select id="smw-review-student">${studentOptions()}</select></div>
                <div class="smw-field"><label>반</label><select id="smw-review-class">${classOptions()}</select></div>
                <div class="smw-field"><label>수업자료</label><select id="smw-review-material">${materialOptions()}</select></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="loadStudyMaterialStudentReview()">학생 지시표</button><button class="btn" onclick="loadStudyMaterialClassReview()">반 지시표</button></div>
            <div class="smw-output">${renderReviewText()}</div>
        `;
    }

    function renderReviewText() {
        const rows = st().review?.items || [];
        if (!rows.length) return '복습 지시표를 조회하세요.';
        const title = rows[0].material_title || '수업자료';
        const byStudent = new Map();
        rows.forEach(r => {
            const list = byStudent.get(r.student_name || r.student_id) || [];
            list.push(r);
            byStudent.set(r.student_name || r.student_id, list);
        });
        return [...byStudent.entries()].map(([name, list]) => {
            const lines = list.map(r => `- ${r.question_no}번${r.unit_text ? ` (${r.unit_text})` : ''}`).join('\n');
            return `${name} 복습 지시표\n\n${title}\n\n${lines}\n\n복습 방법\n1. 위 번호만 다시 풀기\n2. 풀이 과정을 표시하기\n3. 다음 수업 때 선생님께 확인`;
        }).join('\n\n---\n\n');
    }

    function body() {
        const current = st().tab;
        return `<div class="smw-wrap">${tabs()}${current === 'materials' ? materialForm() : current === 'ranges' ? rangesForm() : current === 'assign' ? assignForm() : current === 'overview' ? overviewForm() : current === 'wrongs' ? wrongsForm() : reviewForm()}</div>`;
    }

    function render() {
        injectStyle();
        showModal('수업자료 오답', body());
    }

    window.openStudyMaterialWrongCenter = async function () {
        injectStyle();
        showModal('수업자료 오답', '<div class="smw-output">불러오는 중입니다.</div>');
        await loadStudyMaterialWrongData();
    };
    window.setStudyMaterialWrongTab = function (tab) {
        st().tab = tab;
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
        toast('수업자료를 등록했습니다.');
        await loadStudyMaterialWrongData();
    };
    window.disableStudyMaterial = async function (id) {
        await patch(`study-materials/${encodeURIComponent(id)}/disable`, {});
        toast('비활성화했습니다.');
        await loadStudyMaterialWrongData();
    };
    window.importStudyMaterialRanges = async function () {
        const materialId = document.getElementById('smw-range-material')?.value;
        const lines = String(document.getElementById('smw-range-csv')?.value || '').split(/\r?\n/).map(v => v.trim()).filter(Boolean);
        const items = lines.filter(line => !/^unit_order\s*,/i.test(line)).map(line => {
            const [unit_order, unit_text, subunit_text, start_no, end_no] = line.split(',').map(v => v.trim());
            return { unit_order: Number(unit_order) || 0, unit_text, subunit_text, start_no: Number(start_no), end_no: Number(end_no) };
        });
        const res = await post('material-unit-ranges/import', { material_id: materialId, items });
        toast(`저장 ${res.inserted || 0} · 갱신 ${res.updated || 0} · 제외 ${res.skipped || 0}`);
        await loadStudyMaterialRanges();
    };
    window.loadStudyMaterialRanges = async function () {
        const materialId = document.getElementById('smw-range-material')?.value;
        const res = await get(`material-unit-ranges?material_id=${encodeURIComponent(materialId)}`);
        const root = document.getElementById('smw-range-list');
        if (root) root.innerHTML = (res.items || []).map(r => `<div class="smw-row"><div class="smw-title">${h(r.unit_text)}</div><div class="smw-meta">${h(r.subunit_text || '')} · ${r.start_no}-${r.end_no}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 범위가 없습니다.</div></div>';
    };
    window.createStudyMaterialAssignment = async function () {
        await post('class-material-assignments', {
            class_id: document.getElementById('smw-assign-class')?.value,
            material_id: document.getElementById('smw-assign-material')?.value,
            assigned_date: document.getElementById('smw-assign-date')?.value || today(),
            assignment_title: document.getElementById('smw-assign-title')?.value
        });
        toast('배정을 생성했습니다.');
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
    window.loadStudyMaterialStudentWrongs = async function () {
        const studentId = document.getElementById('smw-wrong-student')?.value;
        const materialId = document.getElementById('smw-wrong-material')?.value;
        st().wrongs = await get(`material-wrongs/student?student_id=${encodeURIComponent(studentId)}&material_id=${encodeURIComponent(materialId)}`);
        render();
    };
    window.loadStudyMaterialClassWrongs = async function () {
        const classId = document.getElementById('smw-wrong-class')?.value;
        const materialId = document.getElementById('smw-wrong-material')?.value;
        st().wrongs = await get(`material-wrongs/class?class_id=${encodeURIComponent(classId)}&material_id=${encodeURIComponent(materialId)}`);
        render();
    };
    window.loadStudyMaterialStudentReview = async function () {
        const studentId = document.getElementById('smw-review-student')?.value;
        const materialId = document.getElementById('smw-review-material')?.value;
        st().review = await get(`material-review/student?student_id=${encodeURIComponent(studentId)}&material_id=${encodeURIComponent(materialId)}`);
        render();
    };
    window.loadStudyMaterialClassReview = async function () {
        const classId = document.getElementById('smw-review-class')?.value;
        const materialId = document.getElementById('smw-review-material')?.value;
        st().review = await get(`material-review/class?class_id=${encodeURIComponent(classId)}&material_id=${encodeURIComponent(materialId)}`);
        render();
    };
})();
