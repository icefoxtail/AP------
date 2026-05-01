/**
 * AP Math OS 1.0 [js/schedule.js]
 * Split from dashboard.js.
 */

function openExamScheduleModal(baseDateStr = '') {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    
    if (!state.ui) state.ui = {};
    if (baseDateStr) {
        state.ui.examCalendarMonth = baseDateStr;
    } else if (!state.ui.examCalendarMonth) {
        state.ui.examCalendarMonth = todayStr;
    }
    
    // 1. 기준 달력 연/월 계산
    let targetYear, targetMonth;
    const parts = state.ui.examCalendarMonth.split('-');
    targetYear = parseInt(parts[0], 10);
    targetMonth = parseInt(parts[1], 10) - 1;

    const firstDay = new Date(targetYear, targetMonth, 1).getDay();
    const lastDate = new Date(targetYear, targetMonth + 1, 0).getDate();

    // 2. 이전/다음 달 이동을 위한 날짜 문자열 계산
    const prevMonthDate = new Date(targetYear, targetMonth - 1, 1);
    const nextMonthDate = new Date(targetYear, targetMonth + 1, 1);
    const prevStr = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
    const nextStr = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}-01`;

    const schedules = state.db.exam_schedules || [];
    
    // 3. 달력 UI 렌더링
    let calendarHtml = `
        <div style="background:var(--surface-2); border-radius:12px; padding:12px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <button class="btn" style="padding:6px 12px; font-size:12px; background:var(--surface); border:none;" onclick="openExamScheduleModal('${prevStr}')">◀</button>
                <div style="font-size:15px; font-weight:900; color:var(--text);">${targetYear}년 ${targetMonth + 1}월</div>
                <button class="btn" style="padding:6px 12px; font-size:12px; background:var(--surface); border:none;" onclick="openExamScheduleModal('${nextStr}')">▶</button>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:12px; font-weight:700; color:var(--secondary); margin-bottom:8px;">
                <div style="color:var(--error);">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div style="color:var(--primary);">토</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px;">
    `;

    // 시작 요일 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        calendarHtml += `<div></div>`;
    }

    // 날짜 채우기
    for (let d = 1; d <= lastDate; d++) {
        const dateStr = `${targetYear}-${String(targetMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = dateStr === todayStr;
        const hasSchedule = schedules.some(s => s.exam_date === dateStr);
        
        let border = isToday ? '1px solid var(--primary)' : '1px solid transparent';
        let color = isToday ? 'var(--primary)' : 'var(--text)';
        
        const dot = hasSchedule
            ? `<div style="width:4px; height:4px; border-radius:50%; background:var(--error); margin:2px auto 0;"></div>`
            : `<div style="width:4px; height:4px; margin:2px auto 0;"></div>`;

        calendarHtml += `
            <div style="background:var(--surface); border:${border}; border-radius:8px; padding:8px 0; text-align:center; cursor:pointer; display:flex; flex-direction:column; align-items:center;" onclick="document.getElementById('new-ex-date').value='${dateStr}'; state.ui.examCalendarMonth='${dateStr.substring(0,7)}-01';">
                <span style="font-size:13px; font-weight:800; color:${color}; line-height:1;">${d}</span>
                ${dot}
            </div>
        `;
    }
    
    calendarHtml += `</div></div>`;

    // 4. 기존 일정 목록 렌더링
    const rows = schedules.map(e => `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-bottom:4px;">${e.exam_date} | ${apEscapeHtml(e.school_name || '일반')} ${apEscapeHtml(e.grade || '')}</div>
                <div style="font-size:14px; font-weight:900; color:var(--text);">${apEscapeHtml(e.exam_name || '일정')}</div>
                ${e.memo ? `<div style="font-size:12px; color:var(--secondary); margin-top:4px;">${apEscapeHtml(e.memo)}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; background:var(--surface-2); border:none;" onclick="openEditExamScheduleModal('${e.id}')">수정</button>
            </div>
        </div>
    `).join('');

    // 5. 모달 출력 (라벨 유연화)
    showModal('시험일정 관리', `
        ${calendarHtml}
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-school" class="btn" placeholder="장소/학교 (선택)" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <select id="new-ex-grade" class="btn" style="flex:1; border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-name" class="btn" placeholder="일정 내용 (선택)" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <input type="date" id="new-ex-date" class="btn" value="${todayStr}" style="flex:1; border:none; background:var(--surface);">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="추가 메모 (선택)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:10px; font-size:13px; font-weight:700; margin-top:4px;" onclick="addExamSchedule()">저장</button>
        </div>
        <div style="max-height:30vh; overflow-y:auto; padding-right:4px;">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; padding:20px;">일정이 없습니다</div>`}
        </div>
    `);
}

// [Partner B] 필수 입력 제거: 날짜만 있으면 저장 가능
async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school').value.trim();
    const gr = document.getElementById('new-ex-grade').value;
    const na = document.getElementById('new-ex-name').value.trim();
    const da = document.getElementById('new-ex-date').value;
    const me = document.getElementById('new-ex-memo').value.trim();
    if(!da) return toast('날짜를 선택하세요', 'warn');
    const r = await api.post('exam-schedules', { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

async function deleteExamSchedule(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('exam-schedules', id);
    if(r.success) { await loadData(); openExamScheduleModal(); }
}

function openEditExamScheduleModal(id) {
    const e = state.db.exam_schedules.find(x => x.id === id);
    if(!e) return;
    showModal('일정 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-school" class="btn" value="${apEscapeHtml(e.school_name || '')}" placeholder="장소/학교 (선택)" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <select id="edit-ex-grade" class="btn" style="flex:1; border:none; background:var(--surface);">
                    <option value="">공통/전체</option>
                    <option value="중1" ${e.grade==='중1'?'selected':''}>중1</option>
                    <option value="중2" ${e.grade==='중2'?'selected':''}>중2</option>
                    <option value="중3" ${e.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${e.grade==='고1'?'selected':''}>고1</option>
                    <option value="고2" ${e.grade==='고2'?'selected':''}>고2</option>
                    <option value="고3" ${e.grade==='고3'?'selected':''}>고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-name" class="btn" value="${apEscapeHtml(e.exam_name || '')}" placeholder="일정 내용 (선택)" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="flex:1; border:none; background:var(--surface);">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${apEscapeHtml(e.memo||'')}" placeholder="추가 메모" style="text-align:left; border:none; background:var(--surface);"><button class="btn btn-primary" style="padding:12px; font-size:13px; font-weight:700; margin-top:4px;" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
            <div style="display:flex; gap:8px; margin-top:4px;">
                <button class="btn" style="flex:1; padding:10px; font-size:12px; border:none; background:var(--surface);" onclick="openExamScheduleModal()">취소</button>
                <button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="deleteExamSchedule('${id}')">완전 삭제</button>
            </div>
        </div>
    `);
}

async function handleEditExamSchedule(id) {
    const sc = document.getElementById('edit-ex-school').value.trim();
    const gr = document.getElementById('edit-ex-grade').value;
    const na = document.getElementById('edit-ex-name').value.trim();
    const da = document.getElementById('edit-ex-date').value.trim();
    const me = document.getElementById('edit-ex-memo').value.trim();
    if(!da) return toast('날짜를 선택하세요', 'warn');
    
    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { 
        toast('저장 완료', 'info');
        await loadData(); 
        openExamScheduleModal(); 
    } else {
        toast('저장 실패', 'error');
    }
}
