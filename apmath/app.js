/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * 통합 프론트엔드 엔진 - 29인 실데이터 및 운영 루프 완결판
 */

const CONFIG = {
    R2_URL: 'https://r2.ap-math.com',
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

const SEED_DATA = {
    classes: [
        { id: 'm1_a', name: '중1A', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_b', name: '중1B', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_c', name: '중1C', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_a', name: '중2A', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_b', name: '중2B', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_a', name: '중3A', grade: '중3', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_b', name: '중3B', grade: '중3', subject: '수학', teacher_name: '박준성' }
    ],
    students: [
        { id: 's01', name: '한세아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's02', name: '홍서령', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's03', name: '김수인', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's04', name: '김다희', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's05', name: '임진후', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's06', name: '황시아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's07', name: '남지율', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's08', name: '남지우', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's09', name: '최윤아', school_name: '왕의중', grade: '중1', status: '재원' },
        { id: 's10', name: '조희태', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's11', name: '임주현', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's12', name: '백주흔', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's13', name: '김도현', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's14', name: '임현성', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's15', name: '박현종', school_name: '왕의중', grade: '중2', status: '재원' },
        { id: 's16', name: '왕유준', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's17', name: '강형우', school_name: '동산중', grade: '중2', status: '재원' },
        { id: 's18', name: '이시온', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's19', name: '이상원', school_name: '삼산중', grade: '중3', status: '재원' },
        { id: 's20', name: '조예령', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's21', name: '유채민', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's22', name: '서유나', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's23', name: '박정원', school_name: '매산중', grade: '중3', status: '재원' },
        { id: 's24', name: '이시윤', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's25', name: '강현욱', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's26', name: '남지혁', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's27', name: '유예준', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's28', name: '김지융', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's29', name: '박현성', school_name: '왕운중', grade: '중3', status: '재원' }
    ],
    map: [
        { class_id: 'm1_a', student_id: 's01' }, { class_id: 'm1_a', student_id: 's02' }, { class_id: 'm1_a', student_id: 's03' }, { class_id: 'm1_a', student_id: 's04' }, { class_id: 'm1_a', student_id: 's05' },
        { class_id: 'm1_b', student_id: 's06' }, { class_id: 'm1_b', student_id: 's07' }, { class_id: 'm1_b', student_id: 's08' }, { class_id: 'm1_b', student_id: 's09' },
        { class_id: 'm1_c', student_id: 's10' }, { class_id: 'm1_c', student_id: 's11' },
        { class_id: 'm2_a', student_id: 's12' }, { class_id: 'm2_a', student_id: 's13' }, { class_id: 'm2_a', student_id: 's14' }, { class_id: 'm2_a', student_id: 's15' }, { class_id: 'm2_a', student_id: 's16' }, { class_id: 'm2_a', student_id: 's17' },
        { class_id: 'm3_a', student_id: 's18' }, { class_id: 'm3_a', student_id: 's19' }, { class_id: 'm3_a', student_id: 's20' }, { class_id: 'm3_a', student_id: 's21' }, { class_id: 'm3_a', student_id: 's22' },
        { class_id: 'm3_b', student_id: 's23' }, { class_id: 'm3_b', student_id: 's24' }, { class_id: 'm3_b', student_id: 's25' }, { class_id: 'm3_b', student_id: 's26' }, { class_id: 'm3_b', student_id: 's27' }, { class_id: 'm3_b', student_id: 's28' }, { class_id: 'm3_b', student_id: 's29' }
    ]
};

let state = {
    ui: { viewScope: 'teacher', userName: '박준성', currentClassId: null, showDischarged: false },
    db: { students: [], classes: [], class_students: [], attendance: [], homework: [], exam_sessions: [], wrong_answers: [] }
};

let syncQueue = JSON.parse(localStorage.getItem('AP_SYNC_QUEUE') || '[]');

const api = {
    async get(res) {
        try {
            const r = await fetch(`${CONFIG.API_BASE}/${res}`);
            return await r.json();
        } catch (e) {
            return {};
        }
    },
    async patch(res, d) {
        if (!navigator.onLine) return addToSyncQueue('PATCH', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, {
            method: 'PATCH',
            body: JSON.stringify(d),
            headers: { 'Content-Type': 'application/json' }
        });
        return await r.json();
    },
    async delete(res, id) {
        if (!navigator.onLine) return addToSyncQueue('DELETE', `${res}/${id}`, {});
        const r = await fetch(`${CONFIG.API_BASE}/${res}/${id}`, { method: 'DELETE' });
        return await r.json();
    },
    async post(res, d) {
        if (!navigator.onLine) return addToSyncQueue('POST', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, {
            method: 'POST',
            body: JSON.stringify(d),
            headers: { 'Content-Type': 'application/json' }
        });
        return await r.json();
    }
};

async function loadData(isInitial = false) {
    if (isInitial) toast('시스템 초기화 중...', 'info');

    const data = await api.get('initial-data');

    state.db = {
        classes: (data.classes && data.classes.length) ? data.classes : SEED_DATA.classes,
        students: (data.students && data.students.length) ? data.students : SEED_DATA.students,
        class_students: (data.class_students && data.class_students.length) ? data.class_students : SEED_DATA.map,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [],
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : []
    };

    if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
    else renderDashboard();
}

function addToSyncQueue(method, resource, data) {
    syncQueue.push({ id: Date.now(), method, resource, data });
    localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
    toast('오프라인: 대기열 저장', 'warn');
    return { success: true, offline: true };
}

async function processSyncQueue() {
    if (!navigator.onLine || syncQueue.length === 0) return;

    for (const task of [...syncQueue]) {
        try {
            await fetch(`${CONFIG.API_BASE}/${task.resource}`, {
                method: task.method,
                body: JSON.stringify(task.data),
                headers: { 'Content-Type': 'application/json' }
            });
            syncQueue = syncQueue.filter(t => t.id !== task.id);
            localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
        } catch (e) {
            break;
        }
    }

    toast('데이터 동기화 완료', 'info');
    await loadData();
}

function renderDashboard() {
    state.ui.currentClassId = null;

    const root = document.getElementById('app-root');
    const activeStds = state.db.students.filter(s => s.status === '재원');
    const classes = state.ui.viewScope === 'all'
        ? state.db.classes
        : state.db.classes.filter(c => c.teacher_name === state.ui.userName);

    root.innerHTML = `
        <div class="grid" style="margin-bottom: 24px;">
            <div class="card" style="border-left: 6px solid var(--primary);">
                <div style="font-size:12px; opacity:0.6;">전체 재원생</div>
                <div style="font-size:26px; font-weight:900;">${activeStds.length}명</div>
            </div>
            <div class="card" style="border-left: 6px solid var(--success);">
                <div style="font-size:12px; opacity:0.6;">오늘 등원</div>
                <div style="font-size:26px; font-weight:900;">${state.db.attendance.filter(a => a.status === '등원').length}명</div>
            </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; flex-wrap:wrap; gap:8px;">
            <h3 style="margin:0;">📂 학급 목록</h3>
            <button class="btn btn-primary" onclick="openAddStudent()">+ 학생 추가</button>
        </div>
        <div class="grid">${classes.map(c => `
            <div class="card" onclick="renderClass('${c.id}')" style="cursor:pointer;">
                <div style="font-weight:800; font-size:18px;">${c.name}</div>
                <div style="font-size:13px; opacity:0.6;">${c.grade} | ${state.db.class_students.filter(m => m.class_id === c.id).length}명</div>
            </div>
        `).join('')}</div>
    `;

    document.getElementById('scope-text').innerText =
        state.ui.viewScope === 'all' ? '전체 관리' : '내 담당';
}

function renderClass(cid) {
    state.ui.currentClassId = cid;

    const cls = state.db.classes.find(c => c.id === cid);
    const mIds = state.db.class_students
        .filter(m => m.class_id === cid)
        .map(m => m.student_id);

    const latestWrongCountMap = {};
    mIds.forEach(sid => {
        const latestSession = state.db.exam_sessions
            .filter(es => es.student_id === sid)
            .sort((a, b) => {
                const dateCompare = String(b.exam_date || '').localeCompare(String(a.exam_date || ''));
                if (dateCompare !== 0) return dateCompare;
                return String(b.id || '').localeCompare(String(a.id || ''));
            })[0];
        latestWrongCountMap[sid] = latestSession
            ? state.db.wrong_answers.filter(w => w.session_id === latestSession.id).length
            : 0;
    });

    const allStds = state.db.students.filter(s => mIds.includes(s.id));
    const stds = allStds
        .filter(s => state.ui.showDischarged ? true : s.status === '재원')
        .sort((a, b) => (latestWrongCountMap[b.id] || 0) - (latestWrongCountMap[a.id] || 0));

    const activeCount = allStds.filter(s => s.status === '재원').length;

    document.getElementById('app-root').innerHTML = `
        <div style="display:flex; gap:10px; margin-bottom:15px; align-items:center; flex-wrap:wrap;">
            <button class="btn" onclick="renderDashboard()">← 홈</button>
            <button class="btn" onclick="toggleShowDischarged()" style="${state.ui.showDischarged ? 'background:#f1f3f4;' : ''}">
                ${state.ui.showDischarged ? '👁 제적자 포함' : '재원만 보기'}
            </button>
            <button class="btn btn-primary" onclick="openAddStudent('${cid}')">+ 학생 추가</button>
        </div>
        <div class="card">
            <h2>${cls.name} 관리 <span style="font-weight:normal; opacity:0.5; font-size:14px;">(재원 ${activeCount}명)</span></h2>
            <table>
                <thead><tr><th>이름</th><th>학교</th><th style="text-align:right;">출결/숙제/성적</th></tr></thead>
                <tbody>${stds.map(s => {
                    const isDischarged = s.status === '제적';
                    const att = state.db.attendance.find(a => a.student_id === s.id);
                    const hw = state.db.homework.find(h => h.student_id === s.id);
                    const wc = latestWrongCountMap[s.id] || 0;
                    const badge = wc > 0
                        ? `<span style="display:inline-block;background:#fce8e6;color:#d93025;border-radius:20px;padding:1px 8px;font-size:11px;font-weight:700;margin-left:6px;">🔴 최근 오답 ${wc}개</span>`
                        : '';
                    const dischargedBadge = isDischarged
                        ? `<span style="display:inline-block;background:#f1f3f4;color:#5f6368;border-radius:20px;padding:1px 8px;font-size:11px;font-weight:700;margin-left:6px;">제적</span>`
                        : '';
                    return `
                        <tr style="${isDischarged ? 'opacity:0.5;' : ''}">
                            <td onclick="renderStudentDetail('${s.id}')" style="cursor:pointer;font-weight:800;color:var(--primary);">${s.name}${badge}${dischargedBadge}</td>
                            <td>${s.school_name}</td>
                            <td style="text-align:right;">
                                ${isDischarged ? '<span style="font-size:12px;opacity:0.4;">-</span>' : `
                                    <button class="btn ${att?.status === '등원' ? 'btn-primary' : ''}" style="padding:4px 8px;font-size:11px;" onclick="toggleAtt('${s.id}')">${att?.status || '미정'}</button>
                                    <button class="btn ${hw?.status === '완료' ? 'btn-primary' : ''}" style="padding:4px 8px;font-size:11px;" onclick="toggleHw('${s.id}')">${hw?.status || '미완료'}</button>
                                    <button class="btn btn-primary" style="padding:4px 8px;font-size:11px;" onclick="openOMR('${s.id}')">성적</button>
                                `}
                            </td>
                        </tr>
                    `;
                }).join('')}</tbody>
            </table>
        </div>
    `;
}

async function toggleAtt(sid) {
    const today = new Date().toLocaleDateString('sv-SE');
    const current = state.db.attendance.find(a => a.student_id === sid);
    const nextStatus = current?.status === '등원' ? '결석' : '등원';

    await api.patch('attendance', {
        studentId: sid,
        status: nextStatus,
        date: today
    });

    await loadData();
}

async function toggleHw(sid) {
    const today = new Date().toLocaleDateString('sv-SE');
    const current = state.db.homework.find(h => h.student_id === sid);
    const nextStatus = current?.status === '완료' ? '미완료' : '완료';

    await api.patch('homework', {
        studentId: sid,
        status: nextStatus,
        date: today
    });

    await loadData();
}

function openOMR(sid) {
    showModal('성적 및 오답 입력', `
        <div style="margin-bottom:10px;">시험명: <input type="text" id="omr-title" class="btn" value="단원평가" style="width:70%;"></div>
        <div class="omr-grid">${Array.from({ length: 10 }, (_, i) => `
            <div class="omr-item">Q${i + 1}<br><input type="checkbox" class="omr-q" value="${i + 1}"></div>
        `).join('')}</div>
    `, '저장', () => handleOMRSave(sid));
}

async function handleOMRSave(sid) {
    const title = document.getElementById('omr-title').value;
    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = (10 - wrs.length) * 10;

    const res = await api.patch('exam-sessions/new', {
        student_id: sid,
        exam_title: title,
        score,
        wrong_ids: wrs,
        exam_date: new Date().toLocaleDateString('sv-SE')
    });

    if (res.success) {
        toast(`${score}점 저장됨`, 'info');
        closeModal();
        await loadData();
    }
}

function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const exs = state.db.exam_sessions
        .filter(es => es.student_id === sid)
        .sort((a, b) => b.exam_date.localeCompare(a.exam_date));

    const examRows = exs.map(e => {
        const wrs = state.db.wrong_answers
            .filter(w => w.session_id === e.id)
            .map(w => `<span style="display:inline-block;background:#fce8e6;color:#d93025;border-radius:4px;padding:2px 7px;margin:2px;font-size:12px;font-weight:700;">Q${w.question_id}</span>`)
            .join('');

        return `
            <tr>
                <td>${e.exam_date}</td>
                <td>${e.exam_title || '-'}</td>
                <td style="text-align:center;"><b>${e.score}점</b></td>
                <td>${wrs || '<span style="opacity:0.4;font-size:12px;">없음</span>'}</td>
                <td><button class="btn" style="padding:2px 8px;font-size:11px;color:var(--error);border-color:var(--error);" onclick="handleDeleteSession('${e.id}', '${sid}')">삭제</button></td>
            </tr>
        `;
    }).join('');

    showModal(`${s.name} 프로필`, `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <p style="margin:0;"><b>학교:</b> ${s.school_name} &nbsp;|&nbsp; <b>학년:</b> ${s.grade}</p>
            <button class="btn" style="font-size:12px;padding:6px 12px;" onclick="openEditStudent('${sid}')">정보 수정</button>
        </div>
        <h4 style="margin-bottom:10px;">📋 성적 및 오답 이력</h4>
        ${exs.length ? `
            <table>
                <thead><tr><th>날짜</th><th>시험명</th><th>점수</th><th>오답</th><th></th></tr></thead>
                <tbody>${examRows}</tbody>
            </table>
        ` : '<p style="opacity:0.5;">성적 데이터 없음</p>'}
        ${s.status === '재원'
            ? `<button class="btn" onclick="handleDelete('${sid}')" style="color:var(--error);border-color:var(--error);margin-top:20px;">제적 처리</button>`
            : `<button class="btn btn-primary" onclick="handleRestore('${sid}')" style="margin-top:20px;">재원 복구</button>`
        }
    `);
}

async function handleDelete(sid) {
    if (!confirm('정말 제적하시겠습니까? 데이터는 보존됩니다.')) return;

    const r = await api.delete('students', sid);
    if (r.success) {
        toast('제적 완료', 'info');
        closeModal();
        await loadData();
    }
}

function toggleShowDischarged() {
    state.ui.showDischarged = !state.ui.showDischarged;
    renderClass(state.ui.currentClassId);
}

function openAddStudent(defaultClassId = '') {
    const classOptions = state.db.classes
        .map(c => `<option value="${c.id}" ${c.id === defaultClassId ? 'selected' : ''}>${c.name}</option>`)
        .join('');
    showModal('학생 추가', `
        <div style="display:flex;flex-direction:column;gap:12px;">
            <input id="add-name" class="btn" placeholder="이름" style="width:100%;text-align:left;">
            <input id="add-school" class="btn" placeholder="학교명" style="width:100%;text-align:left;">
            <select id="add-grade" class="btn" style="width:100%;">
                <option value="중1">중1</option>
                <option value="중2">중2</option>
                <option value="중3">중3</option>
            </select>
            <select id="add-class" class="btn" style="width:100%;">
                <option value="">반 선택 (선택사항)</option>
                ${classOptions}
            </select>
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    const name = document.getElementById('add-name').value.trim();
    const school_name = document.getElementById('add-school').value.trim();
    const grade = document.getElementById('add-grade').value;
    const class_id = document.getElementById('add-class').value;
    if (!name || !school_name) { toast('이름과 학교명을 입력해주세요', 'warn'); return; }
    const r = await api.post('students', { name, school_name, grade, class_id });
    if (r.success) { toast('학생 추가 완료', 'info'); closeModal(); await loadData(); }
}

async function handleRestore(sid) {
    if (!confirm('재원으로 복구하시겠습니까?')) return;
    const r = await fetch(`${CONFIG.API_BASE}/students/${sid}/restore`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }
    });
    const data = await r.json();
    if (data.success) { toast('재원 복구 완료', 'info'); closeModal(); await loadData(); }
}

async function handleDeleteSession(sessionId, sid) {
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 기록도 함께 삭제됩니다.')) return;

    const r = await fetch(`${CONFIG.API_BASE}/exam-sessions/${sessionId}`, { method: 'DELETE' });
    const data = await r.json();

    if (data.success) {
        toast('삭제 완료', 'info');
        closeModal();
        await loadData();
        renderStudentDetail(sid);
    }
}

function openEditStudent(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const currentClassId = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const classOptions = state.db.classes
        .map(c => `<option value="${c.id}" ${c.id === currentClassId ? 'selected' : ''}>${c.name}</option>`)
        .join('');
    showModal('학생 정보 수정', `
        <div style="display:flex;flex-direction:column;gap:12px;">
            <input id="edit-name" class="btn" value="${s.name}" style="width:100%;text-align:left;">
            <input id="edit-school" class="btn" value="${s.school_name || ''}" style="width:100%;text-align:left;">
            <select id="edit-grade" class="btn" style="width:100%;">
                <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option>
                <option value="중2" ${s.grade==='중2'?'selected':''}>중2</option>
                <option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
            </select>
            <select id="edit-class" class="btn" style="width:100%;">
                <option value="">반 미배정</option>
                ${classOptions}
            </select>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const name = document.getElementById('edit-name').value.trim();
    const school_name = document.getElementById('edit-school').value.trim();
    const grade = document.getElementById('edit-grade').value;
    const class_id = document.getElementById('edit-class').value;
    if (!name || !school_name) { toast('이름과 학교명을 입력해주세요', 'warn'); return; }
    const r = await fetch(`${CONFIG.API_BASE}/students/${sid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, school_name, grade, class_id })
    });
    const data = await r.json();
    if (data.success) {
        toast('수정 완료', 'info');
        closeModal();
        await loadData();
    }
}

function toggleScope() {
    state.ui.viewScope = state.ui.viewScope === 'teacher' ? 'all' : 'teacher';
    renderDashboard();
}

function toast(m, t = 'info') {
    const c = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${t}`;
    el.innerText = m;
    c.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}

function showModal(t, b, at = null, af = null) {
    document.getElementById('modal-title').innerText = t;
    document.getElementById('modal-body').innerHTML = b;
    const ab = document.getElementById('modal-action-btn');

    if (at && af) {
        ab.innerText = at;
        ab.onclick = af;
        ab.classList.remove('hidden');
    } else {
        ab.classList.add('hidden');
    }

    document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
}

window.onload = async () => {
    await loadData(true);
    if (navigator.onLine) await processSyncQueue();
};