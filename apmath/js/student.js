/**
 * AP Math OS v26.1.2 [js/student.js]
 * 학생 관리, 퇴원생 관리 및 인적사항 수정 로직
 */

/**
 * 학생 상세 정보 모달 렌더링 (4G UX 반영: 퇴원 처리 버튼 위치 조정)
 */
function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) { toast('학생 정보 없음', 'warn'); return; }
    const exs = state.db.exam_sessions.filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    const rows = exs.map(e => {
        const wrs = state.db.wrong_answers.filter(w => w.session_id === e.id).map(w => `<span style="display:inline-block;background:#fce8e6;color:#d93025;border-radius:4px;padding:2px 6px;margin:2px;font-size:11px;font-weight:700;">Q${w.question_id}</span>`).join('');
        return `<tr><td>${e.exam_date}</td><td>${e.exam_title}</td><td style="text-align:center;"><b>${e.score}점</b></td><td><div style="display:flex;flex-wrap:wrap;gap:2px;">${wrs||'없음'}</div></td><td><button class="btn" style="color:var(--error); padding:2px 8px; font-size:11px;" onclick="handleDeleteSession('${e.id}','${sid}')">삭제</button></td></tr>`;
    }).join('');
    
    const reportButtons = `
        <div style="margin-top:20px;">
            <div style="font-size:11px; color:var(--secondary); margin-bottom:6px;">📋 즉시 복사</div>
            <div style="display:flex; gap:6px; margin-bottom:10px;">
                <button class="btn btn-primary" onclick="copyReport('${sid}', 'parent')" style="flex:1; font-size:11px; padding:8px 4px;">학부모용</button>
                <button class="btn" onclick="copyReport('${sid}', 'student')" style="flex:1; font-size:11px; padding:8px 4px; border-color:var(--primary); color:var(--primary);">학생용</button>
                <button class="btn" onclick="copyReport('${sid}', 'memo')" style="flex:1; font-size:11px; padding:8px 4px;">상담용</button>
            </div>
            <div style="font-size:11px; color:var(--secondary); margin-bottom:6px;">🤖 AI 생성 후 확인</div>
            <div style="display:flex; gap:6px;">
                <button class="btn" onclick="requestAiReport('${sid}', 'parent')" style="flex:1; font-size:11px; padding:8px 4px; border-color:#a8c7fa; color:#1a73e8; background:#e8f0fe;">🤖 학부모</button>
                <button class="btn" onclick="requestAiReport('${sid}', 'student')" style="flex:1; font-size:11px; padding:8px 4px; border-color:#a8c7fa; color:#1a73e8; background:#e8f0fe;">🤖 학생</button>
                <button class="btn" onclick="requestAiReport('${sid}', 'memo')" style="flex:1; font-size:11px; padding:8px 4px; border-color:#a8c7fa; color:#1a73e8; background:#e8f0fe;">🤖 상담</button>
            </div>
        </div>
    `;

    showModal(`${s.name} 프로필`, `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div>
                <p style="margin:0;">${s.school_name} | ${s.grade}</p>
                <p style="margin:4px 0 0 0; font-size:13px; color:var(--secondary);">상태: <span style="color:var(--primary); font-weight:bold;">${s.status === '제적' ? '퇴원생' : '재원생'}</span></p>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="font-size:11px; padding:4px 8px;" onclick="openEditStudent('${sid}')">정보 수정</button>
                ${s.status === '재원' ? `<button class="btn" style="font-size:11px; padding:4px 8px; color:var(--error); border-color:var(--border);" onclick="handleDelete('${sid}')">퇴원 처리</button>` : ''}
            </div>
        </div>
        <h4>성적 및 오답 이력</h4>
        <table><thead><tr><th>날짜</th><th>시험명</th><th>점수</th><th>오답</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan="5">기록 없음</td></tr>'}</tbody></table>
        ${reportButtons}
        ${s.status === '제적' ? `<button class="btn btn-primary" style="margin-top:20px; width:100%;" onclick="handleRestore('${sid}')">재원 복구</button>` : ''}
    `);
}

/**
 * 학생 퇴원 처리 (로직 유지)
 */
async function handleDelete(sid) {
    if (confirm('퇴원 처리하시겠습니까?')) {
        await api.delete('students', sid);
        closeModal();
        await loadData();
    }
}

/**
 * 학생 재원 복구 (로직 유지)
 */
async function handleRestore(sid) {
    if (confirm('재원으로 복구하시겠습니까?')) {
        await api.patch(`students/${sid}/restore`, {});
        closeModal();
        await loadData();
    }
}

/**
 * 특정 시험 기록 삭제
 */
async function handleDeleteSession(eid, sid) {
    if(confirm('기록을 삭제하시겠습니까?')) {
        await api.delete('exam-sessions', eid);
        closeModal();
        await loadData();
        renderStudentDetail(sid);
    }
}

/**
 * 학생 정보 수정 모달 오픈
 */
function openEditStudent(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = state.db.classes.map(c => `<option value="${c.id}" ${c.id===curCid?'selected':''}>${c.name}</option>`).join('');
    showModal('학생 정보 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-name" class="btn" value="${s.name}" style="text-align:left;">
            <input id="edit-school" class="btn" value="${s.school_name}" style="text-align:left;">
            <select id="edit-grade" class="btn">
                <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option>
                <option value="중2" ${s.grade==='중2'?'selected':''}>중2</option>
                <option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
            </select>
            <select id="edit-class" class="btn"><option value="">반 미배정</option>${opts}</select>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

/**
 * 학생 정보 수정 실행
 */
async function handleEditStudent(sid) {
    const n = document.getElementById('edit-name').value, 
          sc = document.getElementById('edit-school').value, 
          g = document.getElementById('edit-grade').value, 
          c = document.getElementById('edit-class').value;
    await api.patch(`students/${sid}`, { name: n, school_name: sc, grade: g, class_id: c });
    closeModal();
    await loadData();
}

/**
 * 신규 학생 추가 모달 오픈
 */
function openAddStudent(defaultCid = '') {
    const opts = state.db.classes.map(c => `<option value="${c.id}" ${c.id===defaultCid?'selected':''}>${c.name}</option>`).join('');
    showModal('신규 학생 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-name" class="btn" placeholder="이름" style="text-align:left;">
            <input id="add-school" class="btn" placeholder="학교" style="text-align:left;">
            <select id="add-grade" class="btn"><option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option></select>
            <select id="add-class" class="btn"><option value="">반 선택</option>${opts}</select>
        </div>
    `, '추가', handleAddStudent);
}

/**
 * 신규 학생 추가 실행
 */
async function handleAddStudent() {
    const n = document.getElementById('add-name').value, 
          sc = document.getElementById('add-school').value, 
          g = document.getElementById('add-grade').value, 
          c = document.getElementById('add-class').value;
    if(!n || !sc) return;
    await api.post('students', { name: n, school_name: sc, grade: g, class_id: c });
    closeModal();
    await loadData();
}

/**
 * 퇴원생 목록 조회 모달 오픈
 */
function openDischargedStudents() {
    const discharged = state.db.students.filter(s => s.status === '제적');
    const rows = discharged.length ? discharged.map(s => `
        <div style="padding:10px 4px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-weight:700; font-size:15px;">${s.name} <span style="font-size:12px; color:var(--secondary); font-weight:normal;">${s.school_name} ${s.grade}</span></div>
            </div>
            <button class="btn btn-primary" style="padding:6px 12px; font-size:11px;" onclick="handleRestore('${s.id}')">재원 복구</button>
        </div>
    `).join('') : `<div style="padding:32px 16px; text-align:center; color:var(--secondary); font-size:14px;">퇴원생이 없습니다.</div>`;

    showModal('🗄️ 퇴원생 목록', `
        <div style="max-height:60vh; overflow-y:auto;">
            ${rows}
        </div>
    `);
}