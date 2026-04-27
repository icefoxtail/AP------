/**
 * AP Math OS v26.1.2 [js/student.js]
 * 학생 관리, 인적사항 수정 및 상담 기록 엔진 (4단계: 학생 상세 보관소 UI 정리)
 */

function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    const exs = state.db.exam_sessions.filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    const rows = exs.map(e => {
        const wrs = state.db.wrong_answers.filter(w => w.session_id === e.id).map(w => `<span style="display:inline-block;background:#fce8e6;color:#d93025;border-radius:4px;padding:2px 6px;margin:2px;font-size:11px;font-weight:700;">Q${w.question_id}</span>`).join('');
        return `<tr><td>${e.exam_date}</td><td>${e.exam_title}</td><td style="text-align:center;"><b>${e.score}점</b></td><td><div style="display:flex;flex-wrap:wrap;gap:2px;">${wrs||'없음'}</div></td><td><button class="btn" style="color:var(--error); padding:2px 8px; font-size:11px;" onclick="handleDeleteSession('${e.id}','${sid}')">삭제</button></td></tr>`;
    }).join('');
    
    const cnsList = state.db.consultations.filter(c => c.student_id === sid).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.id).localeCompare(String(a.id)));
    const cnsRows = cnsList.map(c => `
        <div style="border-bottom:1px solid var(--border); padding:10px 0;">
            <div style="font-size:11px; color:var(--secondary); margin-bottom:4px; display:flex; justify-content:space-between;">
                <span>${c.date} | <span style="font-weight:700; color:var(--primary);">${c.type}</span></span>
                <div>
                    <span style="cursor:pointer; color:var(--primary); margin-right:8px;" onclick="openEditConsultation('${c.id}', '${sid}')">수정</span>
                    <span style="cursor:pointer; color:var(--error);" onclick="handleDeleteConsultation('${c.id}', '${sid}')">삭제</span>
                </div>
            </div>
            <div style="font-size:13px; margin-bottom:6px; white-space:pre-wrap;">${escapeHtmlForTextarea(c.content)}</div>
            ${c.next_action ? `<div style="font-size:12px; color:#b06000; background:#fef7e0; padding:6px 8px; border-radius:6px;"><b>👉 조치:</b> ${escapeHtmlForTextarea(c.next_action)}</div>` : ''}
        </div>
    `).join('');

    const todayStr = new Date().toLocaleDateString('sv-SE');

    const extraInfoHtml = (s.guardian_relation || s.memo) ? `
        <div style="margin-top:8px; font-size:12px; background:#f1f3f4; padding:8px 10px; border-radius:6px; color:var(--secondary);">
            ${s.guardian_relation ? `<div style="margin-bottom:4px;"><b>보호자 관계:</b> ${s.guardian_relation}</div>` : ''}
            ${s.memo ? `<div><b>메모:</b> ${s.memo}</div>` : ''}
        </div>
    ` : '';

    // 4단계: 섹션 2. 상담 기록 (접힘 UI 기본 적용)
    const consultationHTML = `
        <div style="margin-top:20px; border-top:2px solid var(--border); padding-top:16px;">
            <h4 style="margin:0 0 10px 0;">💬 학생 상담 기록</h4>
            <details style="margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px; border:1px solid var(--border);">
                <summary style="font-size:13px; font-weight:700; cursor:pointer; color:var(--primary);">➕ 새 상담 기록하기</summary>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
                    <div style="display:flex; gap:8px;">
                        <input type="date" id="cns-date" class="btn" value="${todayStr}" style="flex:1;">
                        <select id="cns-type" class="btn" style="flex:1;">
                            <option value="학습">학습</option>
                            <option value="태도">태도</option>
                            <option value="출결">출결</option>
                            <option value="성적">성적</option>
                            <option value="상담">일반 상담</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <textarea id="cns-content" class="btn" placeholder="상담 내용을 입력하세요." style="text-align:left; resize:vertical; min-height:80px; line-height:1.5;"></textarea>
                    <textarea id="cns-action" class="btn" placeholder="다음 조치사항 (선택)" style="text-align:left; resize:vertical; min-height:50px; line-height:1.5;"></textarea>
                    <button class="btn btn-primary" onclick="handleSaveConsultation('${sid}')" style="padding:10px;">기록 저장</button>
                </div>
            </details>
            <div style="max-height:250px; overflow-y:auto; padding-right:4px;">
                ${cnsRows || '<div style="font-size:13px; color:var(--secondary); text-align:center; padding:16px; background:#f1f3f4; border-radius:8px;">등록된 상담 기록이 없습니다.</div>'}
            </div>
        </div>
    `;

    // 4단계: 섹션 4. 보고 문구 (접힘 영역으로 묶고 AI 버튼 숨김)
    const reportButtons = `
        <div style="margin-top:20px; border-top:2px solid var(--border); padding-top:16px;">
            <details>
                <summary style="font-size:13px; font-weight:700; cursor:pointer; color:var(--secondary);">📋 보고 문구 복사 도구</summary>
                <div style="display:flex; gap:6px; margin-top:12px;">
                    <button class="btn btn-primary" onclick="copyReport('${sid}', 'parent')" style="flex:1; font-size:11px; padding:10px 4px;">학부모용</button>
                    <button class="btn" onclick="copyReport('${sid}', 'student')" style="flex:1; font-size:11px; padding:10px 4px; border-color:var(--primary); color:var(--primary);">학생용</button>
                    <button class="btn" onclick="copyReport('${sid}', 'memo')" style="flex:1; font-size:11px; padding:10px 4px;">상담용</button>
                </div>
                </details>
        </div>
    `;

    // 4단계: 모달 조립 (순서 정립 및 퇴원 버튼 하단 이동)
    showModal(`${s.name} 프로필`, `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:5px;">
            <div style="flex:1;">
                <p style="margin:0; font-weight:bold;">${s.school_name} | ${s.grade}</p>
                <p style="margin:4px 0 0 0; font-size:13px; color:var(--secondary);">상태: <span style="color:var(--primary); font-weight:bold;">${s.status === '제적' ? '퇴원생' : '재원생'}</span></p>
                ${extraInfoHtml}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
                <button class="btn" style="font-size:11px; padding:6px 10px;" onclick="openEditStudent('${sid}')">정보 수정</button>
            </div>
        </div>
        
        ${consultationHTML}

        <div style="margin-top:20px; border-top:2px solid var(--border); padding-top:16px;">
            <h4 style="margin:0 0 10px 0;">📊 성적 및 오답 이력</h4>
            <table><thead><tr><th>날짜</th><th>시험명</th><th>점수</th><th>오답</th><th></th></tr></thead><tbody>${rows||'<tr><td colspan=\"5\">기록 없음</td></tr>'}</tbody></table>
        </div>
        
        ${reportButtons}
        
        <div style="margin-top:20px; padding-top:16px; border-top:1px dashed var(--border); text-align:right;">
            ${s.status === '재원' 
                ? `<button class="btn" style="font-size:12px; padding:6px 12px; color:var(--error); border-color:transparent;" onclick="handleDelete('${sid}')">학생 퇴원 처리</button>` 
                : `<button class="btn btn-primary" style="font-size:13px; padding:10px; width:100%;" onclick="handleRestore('${sid}')">재원 복구</button>`}
        </div>
    `);
}

function openEditConsultation(cid, sid) {
    const c = state.db.consultations.find(x => x.id === cid);
    if (!c) return;
    
    showModal('상담 기록 수정', `
        <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; gap:8px;">
                <input type="date" id="edit-cns-date" class="btn" value="${c.date}" style="flex:1;">
                <select id="edit-cns-type" class="btn" style="flex:1;">
                    <option value="학습" ${c.type==='학습'?'selected':''}>학습</option>
                    <option value="태도" ${c.type==='태도'?'selected':''}>태도</option>
                    <option value="출결" ${c.type==='출결'?'selected':''}>출결</option>
                    <option value="성적" ${c.type==='성적'?'selected':''}>성적</option>
                    <option value="상담" ${c.type==='상담'?'selected':''}>일반 상담</option>
                    <option value="기타" ${c.type==='기타'?'selected':''}>기타</option>
                </select>
            </div>
            <textarea id="edit-cns-content" class="btn" placeholder="상담 내용을 입력하세요." style="text-align:left; resize:vertical; min-height:80px; line-height:1.5;">${c.content}</textarea>
            <textarea id="edit-cns-action" class="btn" placeholder="다음 조치사항 (선택)" style="text-align:left; resize:vertical; min-height:50px; line-height:1.5;">${c.next_action||''}</textarea>
        </div>
    `, '수정 저장', () => handleEditConsultation(cid, sid));
}

async function handleEditConsultation(cid, sid) {
    const date = document.getElementById('edit-cns-date').value;
    const type = document.getElementById('edit-cns-type').value;
    const content = document.getElementById('edit-cns-content').value.trim();
    const nextAction = document.getElementById('edit-cns-action').value.trim();

    if (!content) { toast('상담 내용을 입력하세요.', 'warn'); return; }

    const r = await api.patch(`consultations/${cid}`, { date, type, content, nextAction });
    if (r.success) {
        toast('상담 기록이 수정되었습니다.', 'info');
        closeModal();
        await loadData();
        renderStudentDetail(sid);
    } else {
        toast('상담 수정 실패', 'error');
    }
}

async function handleDeleteConsultation(cid, sid) {
    if (confirm('이 상담 기록을 삭제하시겠습니까?')) {
        const r = await api.delete('consultations', cid);
        if (r.success) {
            toast('상담 기록이 삭제되었습니다.', 'info');
            await loadData();
            renderStudentDetail(sid);
        } else {
            toast('상담 삭제 실패', 'error');
        }
    }
}

async function handleSaveConsultation(sid) {
    const date = document.getElementById('cns-date').value;
    const type = document.getElementById('cns-type').value;
    const content = document.getElementById('cns-content').value.trim();
    const nextAction = document.getElementById('cns-action').value.trim();

    if (!content) { toast('상담 내용을 입력하세요.', 'warn'); return; }

    const r = await api.post('consultations', { studentId: sid, date, type, content, nextAction });
    if (r.success) {
        toast('상담 기록이 저장되었습니다.', 'info');
        await loadData();
        renderStudentDetail(sid);
    } else {
        toast('상담 저장 실패', 'error');
    }
}

async function handleDelete(sid) {
    if (confirm('이 학생을 퇴원 처리하시겠습니까?')) {
        await api.delete('students', sid);
        closeModal();
        await loadData();
    }
}

async function handleRestore(sid) {
    if (confirm('이 학생을 재원으로 복구하시겠습니까?')) {
        await api.patch(`students/${sid}/restore`, {});
        closeModal();
        await loadData();
    }
}

async function handleDeleteSession(eid, sid) {
    if(confirm('기록을 삭제하시겠습니까?')) {
        await api.delete('exam-sessions', eid);
        closeModal();
        await loadData();
        renderStudentDetail(sid);
    }
}

function openEditStudent(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = state.db.classes
        .filter(c => c.is_active !== 0 || c.id === curCid)
        .map(c => `<option value="${c.id}" ${c.id===curCid?'selected':''}>${c.name}</option>`)
        .join('');
    
    showModal('학생 정보 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-name" class="btn" value="${s.name}" style="text-align:left;">
            <input id="edit-school" class="btn" value="${s.school_name}" style="text-align:left;">
            <select id="edit-grade" class="btn">
                <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option>
                <option value="중2" ${s.grade==='중2'?'selected':''}>중2</option>
                <option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
                <option value="고1" ${s.grade==='고1'?'selected':''}>고1</option>
                <option value="고2" ${s.grade==='고2'?'selected':''}>고2</option>
                <option value="고3" ${s.grade==='고3'?'selected':''}>고3</option>
            </select>
            <select id="edit-class" class="btn"><option value="">반 미배정</option>${opts}</select>
            
            <hr style="border:0; border-top:1px solid var(--border); margin:10px 0;">
            <label style="font-size:12px; color:var(--secondary);">연락처 및 특이사항</label>
            
            <input id="edit-student-phone" class="btn" value="${s.student_phone||''}" placeholder="학생 전화번호 (예: 010-1234-5678)" style="text-align:left;">
            <input id="edit-parent-phone" class="btn" value="${s.parent_phone||''}" placeholder="학부모 전화번호 (예: 010-1234-5678)" style="text-align:left;">
            <input id="edit-guardian-rel" class="btn" value="${s.guardian_relation||''}" placeholder="보호자 관계 (예: 어머님, 아버님)" style="text-align:left;">
            <textarea id="edit-memo" class="btn" placeholder="학생 특이사항 메모" style="text-align:left; resize:vertical; min-height:60px; line-height:1.5;">${s.memo||''}</textarea>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const n = document.getElementById('edit-name').value, 
          sc = document.getElementById('edit-school').value, 
          g = document.getElementById('edit-grade').value, 
          c = document.getElementById('edit-class').value,
          sp = document.getElementById('edit-student-phone').value.trim(),
          pp = document.getElementById('edit-parent-phone').value.trim(),
          gr = document.getElementById('edit-guardian-rel').value.trim(),
          memo = document.getElementById('edit-memo').value.trim();
          
    await api.patch(`students/${sid}`, { 
        name: n, school_name: sc, grade: g, class_id: c,
        student_phone: sp, parent_phone: pp, guardian_relation: gr, memo: memo 
    });
    
    closeModal();
    await loadData();
}

function openAddStudent(defaultCid = '') {
    const opts = state.db.classes
        .filter(c => c.is_active !== 0)
        .map(c => `<option value="${c.id}" ${c.id===defaultCid?'selected':''}>${c.name}</option>`)
        .join('');

    showModal('신규 학생 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-name" class="btn" placeholder="이름" style="text-align:left;">
            <input id="add-school" class="btn" placeholder="학교" style="text-align:left;">
            <select id="add-grade" class="btn">
                <option value="중1">중1</option>
                <option value="중2">중2</option>
                <option value="중3">중3</option>
                <option value="고1">고1</option>
                <option value="고2">고2</option>
                <option value="고3">고3</option>
            </select>
            <select id="add-class" class="btn"><option value="">반 선택</option>${opts}</select>
        </div>
    `, '추가', handleAddStudent);
}

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