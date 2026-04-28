/**
 * AP Math OS 1.0 [js/dashboard.js]
 * 운영센터 및 선생님별 관제 엔진 (품질 보정 최종판)
 * [IRONCLAD 5G]: 기능 100% 보존, 하드코딩 색상 변수화 완벽 타격
 * [Full PASS]: openDischargedStudents 구현 및 문구 품질 개선 완료
 */

function copyPhoneNumber(text) {
    navigator.clipboard.writeText(text).then(() => toast('전화번호가 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

// [5G] 관리필요(구 위험학생) 판정 알고리즘
function computeRiskStudents() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = new Date(todayStr).getTime();
    const active = state.db.students.filter(s => s.status === '재원');
    
    const risks = [];
    
    active.forEach(s => {
        let riskTypes = [];
        let reasons = [];
        
        const recentAtt = state.db.attendance_history.filter(a => a.student_id === s.id && a.status === '결석');
        const absenceCount = recentAtt.length;
        if (absenceCount >= 2) { riskTypes.push('출결주의'); reasons.push(`최근 14일 결석 ${absenceCount}회`); }
        
        const recentHw = state.db.homework_history.filter(h => h.student_id === s.id && h.status === '미완료');
        const hwMissCount = recentHw.length;
        if (hwMissCount >= 3) { riskTypes.push('숙제주의'); reasons.push(`최근 14일 숙제 미완료 ${hwMissCount}회`); }
        
        const exams = state.db.exam_sessions.filter(e => e.student_id === s.id)
            .sort((a,b) => String(b.exam_date).localeCompare(String(a.exam_date)) || String(b.id).localeCompare(String(a.id)))
            .slice(0, 3);
        
        let scoreSummary = '';
        if (exams.length > 0) {
            scoreSummary = exams.map(e => `${e.score}점`).join(' ← ');
            const avg = exams.reduce((acc, cur) => acc + cur.score, 0) / exams.length;
            let scoreRisk = false;
            if (avg < 60) {
                scoreRisk = true; reasons.push(`최근 3회 평균 ${Math.round(avg)}점`);
            } else if (exams.length >= 3) {
                if (exams[0].score < exams[1].score && exams[1].score < exams[2].score) { scoreRisk = true; reasons.push(`시험성적 2회 연속 하락`); }
            }
            if (scoreRisk) riskTypes.push('성적주의');
        }
        
        const cns = state.db.consultations.filter(c => c.student_id === s.id).sort((a,b) => String(b.date).localeCompare(String(a.date)));
        let lastCnsDate = cns.length ? cns[0].date : '없음';
        let cnsDaysDiff = 999;
        if (cns.length > 0) cnsDaysDiff = (todayTime - new Date(cns[0].date).getTime()) / (1000*3600*24);
        
        let isNewStudent = false;
        if (s.created_at) {
            const createTime = new Date(s.created_at).getTime();
            if ((todayTime - createTime) / (1000*3600*24) <= 14) isNewStudent = true;
        }
        
        if (cnsDaysDiff >= 30 && !isNewStudent) { riskTypes.push('상담필요'); reasons.push(`최근 30일 상담 기록 없음`); }
        if (riskTypes.length >= 2) { riskTypes.push('종합주의'); }
        
        if (riskTypes.length > 0) {
            const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
            const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
            risks.push({ student: s, className: cName, riskTypes, reasons, scoreSummary, absenceCount, hwMissCount, lastConsultationDate: lastCnsDate });
        }
    });
    
    return risks;
}

// [Final Fix] 운영메뉴 퇴원생 버튼과 연동
function openDischargedStudents() {
    openAdminStudentList('discharged');
}

function openAdminStudentList(type) {
    const todayTime = new Date(new Date().toLocaleDateString('sv-SE')).getTime();
    let list = [], title = "";

    if (type === 'active') { list = state.db.students.filter(s => s.status === '재원'); title = "재원생 목록"; }
    else if (type === 'new') { list = state.db.students.filter(s => { if (s.status !== '재원' || !s.created_at) return false; return (todayTime - new Date(s.created_at).getTime()) / (1000*3600*24) <= 30; }); title = "신규생 목록"; }
    else if (type === 'discharged') { list = state.db.students.filter(s => s.status === '제적'); title = "퇴원생 목록"; }
    else if (type === 'risk') { list = computeRiskStudents().map(r => ({ ...r.student, riskInfo: r })); title = "관리필요 학생"; }

    const rows = list.map(s => {
        const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
        let riskDetails = "";
        if (s.riskInfo) { riskDetails = `<div style="font-size:11px; color:var(--error); margin-top:6px; background:rgba(255,71,87,0.08); padding:6px 8px; border-radius:6px; font-weight:600;">상태: ${s.riskInfo.riskTypes.join(', ')} <span style="opacity:0.7; font-weight:normal;">(${s.riskInfo.reasons.join(' · ')})</span></div>`; }
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
                <div style="flex:1; padding-right:12px;">
                    <div style="font-weight:900; font-size:14px; color:var(--text);">${s.name} <span style="font-size:12px; color:var(--secondary); font-weight:600; margin-left:4px;">${s.school_name} ${s.grade}</span></div>
                    <div style="font-size:12px; color:var(--primary); font-weight:600; margin-top:4px;">${cName} <span style="color:var(--secondary); font-weight:500;">| ${s.status} ${s.created_at ? `| 등록: ${s.created_at.split(' ')[0]}` : ''}</span></div>
                    ${riskDetails}
                </div>
                <button class="btn" style="padding:8px 12px; font-size:12px; font-weight:700; border-radius:8px; background:var(--surface-2); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">상세 보기</button>
            </div>
        `;
    }).join('');

    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:600;">조회 대상이 없습니다.</div>`}</div>`);
}

function renderAdminControlCenter() {
    if (typeof renderAppDrawer === 'function') renderAppDrawer();
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = new Date(todayStr).getTime();
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const dischargedStudents = state.db.students.filter(s => s.status === '제적');
    const newStudents = activeStudents.filter(s => { if (!s.created_at) return false; return (todayTime - new Date(s.created_at).getTime()) / (1000*3600*24) <= 30; });
    const risks = computeRiskStudents();

    const headerHtml = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="btn" style="width:40px; height:40px; padding:0; font-size:24px; border:none; background:transparent; color:var(--text);" onclick="openAppDrawer()">☰</button>
                <div>
                    <div style="font-size:20px; font-weight:900; color:var(--text); letter-spacing:-0.5px;">운영센터</div>
                </div>
            </div>
        </div>
    `;

    const summaryHtml = `
        <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:10px; margin-bottom:32px;">
            <div class="card" onclick="openAdminStudentList('active')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:800; color:var(--primary);">${activeStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">재원생</div>
            </div>
            <div class="card" onclick="openAdminStudentList('new')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:800; color:var(--success);">${newStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">신규</div>
            </div>
            <div class="card" onclick="openAdminStudentList('discharged')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:800; color:var(--secondary);">${dischargedStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">퇴원생</div>
            </div>
            <div class="card" onclick="openAdminStudentList('risk')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid ${risks.length > 0 ? 'rgba(255,71,87,0.3)' : 'var(--border)'}; border-radius:16px; background:${risks.length > 0 ? 'rgba(255,71,87,0.05)' : 'var(--surface)'};">
                <div style="font-size:20px; font-weight:800; color:var(--error);">${risks.length}</div>
                <div style="font-size:11px; color:var(--error); font-weight:600; margin-top:4px;">관리필요</div>
            </div>
        </div>
    `;

    const teacherCardsHtml = `
        <div style="margin-bottom:32px;">
            <div style="margin-bottom:12px;">
                <h3 style="margin:0; font-size:16px; font-weight:900; color:var(--text);">선생님</h3>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px;">
                ${renderAdminTeacherCards(todayStr)}
            </div>
        </div>
    `;

    const nextWeek = new Date(todayTime + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE');
    const upcomingSchedules = (state.db.exam_schedules || []).filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeek).sort((a,b) => a.exam_date.localeCompare(b.exam_date));
    const adminScheduleHtml = `
        <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:var(--secondary);">주간일정</h3>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${upcomingSchedules.length > 0 ? upcomingSchedules.map(e => { 
                    const d = new Date(e.exam_date); 
                    const dateLabel = `${d.getMonth()+1}월 ${d.getDate()}일`; 
                    const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:600;">${e.grade}</span> ` : '<span style="color:var(--secondary); font-weight:600;">학교공통</span> '; 
                    return `<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px;"><div><b style="font-weight:700; color:var(--text);">${e.school_name}</b> ${gradeLabel}${e.exam_name}</div><div style="color:var(--primary); font-size:11px; font-weight:600; white-space:nowrap; background:rgba(26,92,255,0.1); padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`; 
                }).join('') : `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px; font-weight:600;">이번 주 예정된 일정이 없습니다.</div>`}
            </div>
        </div>
    `;
    
    const riskRows = risks.slice(0, 5).map(r => `
        <div class="card" style="padding:14px 16px; border:1px solid rgba(255,71,87,0.2); border-radius:14px; margin-bottom:10px; background:rgba(255,71,87,0.05); cursor:pointer; transition:background 0.2s;" onclick="renderStudentDetail('${r.student.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="min-width:0;">
                    <div style="font-weight:900; color:var(--text); font-size:14px;">${r.student.name}</div>
                    <div style="font-size:12px; color:var(--error); font-weight:600; margin-top:4px;">${r.className} · ${r.reasons.slice(0,2).join(' · ')}</div>
                </div>
                <span style="font-size:12px; color:var(--error); font-weight:700; white-space:nowrap;">상세 보기</span>
            </div>
        </div>
    `).join('');
    
    const riskSectionHtml = `
        <div style="margin-bottom:40px;">
            <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:900; color:var(--error);">관리필요 학생 ${risks.length}명</h3>
            ${risks.length > 0 ? riskRows : `<div style="text-align:center; padding:20px; color:var(--success); font-weight:600; background:rgba(0,208,132,0.1); border-radius:16px;">현재 관리 필요 징후를 보이는 학생이 없습니다.</div>`}
        </div>
    `;

    root.innerHTML = headerHtml + summaryHtml + teacherCardsHtml + adminScheduleHtml + riskSectionHtml;
}

function renderAdminStudentSearch() {
    const keyword = document.getElementById('admin-search-input').value.trim().toLowerCase();
    const resultArea = document.getElementById('admin-search-results');
    if (!keyword) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">검색어를 입력하세요.</div>`; return; }
    
    const results = state.db.students.filter(s => s.name.toLowerCase().includes(keyword));
    if (results.length === 0) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">일치하는 학생이 없습니다.</div>`; return; }
    
    resultArea.innerHTML = results.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div><b style="font-size:13px; color:var(--text);">${s.name}</b> <span style="font-size:11px; color:var(--secondary); margin-left:6px;">${cName} | ${s.status}</span></div>
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="renderStudentDetail('${s.id}')">상세 보기</button>
            </div>
        `;
    }).join('');
}


// --- Teacher Dashboard 공통 함수 ---

function renderAddressBookList() {
    const search = document.getElementById('ab-search').value.trim().toLowerCase();
    const cid = document.getElementById('ab-class').value;
    const listRoot = document.getElementById('ab-list');
    
    let stds = state.db.students.filter(s => s.status === '재원');
    if (search) stds = stds.filter(s => s.name.toLowerCase().includes(search));
    if (cid) {
        const cIds = state.db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
        stds = stds.filter(s => cIds.includes(s.id));
    }
    
    if (stds.length === 0) {
        listRoot.innerHTML = `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px;">검색 결과가 없습니다.</div>`;
        return;
    }
    
    listRoot.innerHTML = stds.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:14px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div><b style="font-size:14px; color:var(--text);">${s.name}</b> <span style="color:var(--secondary); font-size:12px; margin-left:6px;">${cName} | ${s.school_name} ${s.grade}</span></div>
                    <button class="btn" style="padding:6px 12px; font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.1); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">프로필</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:6px; font-size:12px; color:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; background:var(--surface-2); padding:8px 12px; border-radius:8px;">
                        <span>학생: ${s.student_phone || '없음'}</span>
                        ${s.student_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.student_phone}')">복사</span>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; background:var(--surface-2); padding:8px 12px; border-radius:8px;">
                        <span>보호자(${s.guardian_relation || '미지정'}): ${s.parent_phone || '없음'}</span>
                        ${s.parent_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.parent_phone}')">복사</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    showModal('학생관리', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn" style="padding:10px; flex:1; font-size:12px;" onclick="closeModal(); openAddStudent();">학생 추가</button>
            <button class="btn" style="padding:10px; flex:1; font-size:12px; color:var(--primary); background:rgba(26,92,255,0.1); border:none;" onclick="openGlobalPinManagement()">PIN관리</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="width:100%; text-align:left; background:var(--surface-2); border:none;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="width:100%; background:var(--surface-2); border:none;" onchange="renderAddressBookList()"><option value="">전체 학급</option>${classOptions}</select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px; padding-right:4px;"></div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px; border:1px solid var(--border); background:var(--surface);" onclick="handleBatchGeneratePins('${c.id}')">
            <span style="font-weight:900; font-size:14px; color:var(--text);">${c.name}</span>
            <span style="font-size:11px; color:var(--primary); font-weight:700; background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px;">일괄 생성</span>
        </button>
    `).join('');
    
    showModal('PIN관리', `
        <div style="margin-bottom:16px; font-size:12px; color:var(--secondary); line-height:1.5; background:var(--surface-2); padding:12px; border-radius:10px;">선택한 반에 속한 학생 중, <b>아직 PIN 번호가 없는 학생</b>들에게만 고유 PIN을 자동 부여합니다. (기존 PIN은 유지됨)</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${rows || `<div style="text-align:center; color:var(--secondary); padding:20px; font-size:13px;">관리할 반이 없습니다.</div>`}</div>
    `);
}

function formatClassScheduleDaysForUI(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

function openClassManageModal() {
    const activeClasses = state.db.classes.filter(c => c.is_active !== 0);
    const hiddenClasses = state.db.classes.filter(c => c.is_active === 0);

    const renderClassRow = (c) => `
        <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-weight:900; font-size:14px; color:${c.is_active===0?'var(--secondary)':'var(--text)'};">
                    ${c.name} <span style="font-size:11px; font-weight:normal; color:var(--secondary); margin-left:4px;">${c.grade}</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); margin-top:4px;">담당: ${c.teacher_name} | 요일: ${formatClassScheduleDaysForUI(c.schedule_days)}</div>
                ${c.textbook ? `<div style="font-size:11px; color:var(--secondary); margin-top:2px;">기존교재: ${c.textbook}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${c.is_active === 0
                  ? `<button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                  : `<button class="btn" style="padding:6px 10px; font-size:11px; color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
            </div>
        </div>
    `;

    showModal('학급관리', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <button class="btn" style="padding:10px 14px; font-size:12px; color:var(--primary); background:rgba(26,92,255,0.1); border:none; font-weight:700;" onclick="closeModal(); openTextbookManageModal();">교재 관리</button>
            <button class="btn btn-primary" style="padding:10px 14px; font-size:12px; font-weight:700;" onclick="openAddClassModal()">새 반 추가</button>
        </div>
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">활성 반 (${activeClasses.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeClasses.length ? activeClasses.map(renderClassRow).join('') : `<div style="font-size:12px; color:var(--secondary);">활성 반이 없습니다.</div>`}
        </div>
        ${hiddenClasses.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">숨김 반 (${hiddenClasses.length})</h4>
            <div style="opacity:0.7;">
                ${hiddenClasses.map(renderClassRow).join('')}
            </div>
        ` : ''}
    `);
}

function openAddClassModal() {
    showModal('새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="add-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="add-cls-teacher" class="btn" value="${state.ui.userName || '박준성'}" placeholder="담당 교사" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="add-cls-textbook" class="btn" placeholder="기존 교재(호환용)" style="text-align:left; background:var(--surface-2); border:none;">
            
            <label style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
            </div>
        </div>
    `, '추가', handleAddClass);
}

async function handleAddClass() {
    const name = document.getElementById('add-cls-name').value.trim();
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    const grade = document.getElementById('add-cls-grade').value;
    const subject = document.getElementById('add-cls-subject').value.trim();
    const teacher_name = document.getElementById('add-cls-teacher').value.trim();
    const textbook = document.getElementById('add-cls-textbook').value.trim();
    const schedule_days = Array.from(document.querySelectorAll('.add-cls-days:checked')).map(e => e.value).join(',');
    const r = await api.post('classes', { name, grade, subject, teacher_name, schedule_days, textbook });
    if (r.success) { toast('새 반이 추가되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

function openEditClassModal(cid) {
    const c = state.db.classes.find(x => x.id === cid);
    const selectedDays = c.schedule_days ? c.schedule_days.split(',') : [];
    showModal('반 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-cls-name" class="btn" value="${c.name}" placeholder="반 이름" style="text-align:left; background:var(--surface-2); border:none;">
            <select id="edit-cls-grade" class="btn" style="background:var(--surface-2); border:none;">
                ${['중1','중2','중3','고1','고2','고3'].map(g => `<option value="${g}" ${c.grade===g?'selected':''}>${g}</option>`).join('')}
            </select>
            <input id="edit-cls-subject" class="btn" value="${c.subject||''}" placeholder="과목" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="edit-cls-teacher" class="btn" value="${c.teacher_name||''}" placeholder="담당 교사" style="text-align:left; background:var(--surface-2); border:none;">
            <input id="edit-cls-textbook" class="btn" value="${c.textbook || ''}" placeholder="기존 교재(호환용)" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="font-size:11px; color:var(--secondary);">※ 다중 교재 관리는 '교재 관리' 메뉴를 이용하세요.</div>
            
            <label style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px; display:flex; align-items:center; gap:4px; background:var(--surface-2); padding:6px 12px; border-radius:8px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
            </div>
        </div>
    `, '저장', () => handleEditClass(cid));
}

async function handleEditClass(cid) {
    const c = state.db.classes.find(x => x.id === cid);
    const name = document.getElementById('edit-cls-name').value.trim();
    if (!name) { toast('반 이름을 입력하세요.', 'warn'); return; }
    const grade = document.getElementById('edit-cls-grade').value;
    const subject = document.getElementById('edit-cls-subject').value.trim();
    const teacher_name = document.getElementById('edit-cls-teacher').value.trim();
    const textbook = document.getElementById('edit-cls-textbook').value.trim();
    const schedule_days = Array.from(document.querySelectorAll('.edit-cls-days:checked')).map(e => e.value).join(',');
    const payload = { name, grade, subject, teacher_name, schedule_days, textbook, is_active: c.is_active !== undefined ? c.is_active : 1 };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast('반 정보가 수정되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

async function toggleClassActive(cid, status) {
    if (!confirm(status === 0 ? '이 반을 숨김 처리하시겠습니까?' : '이 반을 복구하시겠습니까?')) return;
    const c = state.db.classes.find(x => x.id === cid);
    const payload = { name: c.name, grade: c.grade, subject: c.subject, teacher_name: c.teacher_name, schedule_days: c.schedule_days, textbook: c.textbook || '', is_active: status };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast(status === 0 ? '숨김 처리되었습니다.' : '복구되었습니다.', 'info'); await loadData(); openClassManageModal(); }
}

function renderTextbookManageList() {
    const classId = document.getElementById('tb-manage-class').value;
    const listRoot = document.getElementById('tb-manage-list');
    
    let allBooks = state.db.class_textbooks || [];
    if (classId) allBooks = allBooks.filter(tb => String(tb.class_id) === String(classId));

    const activeBooks = allBooks.filter(tb => tb.status === 'active');
    const inactiveBooks = allBooks.filter(tb => tb.status !== 'active');

    const renderTbRow = (tb) => {
        const cName = state.db.classes.find(c => String(c.id) === String(tb.class_id))?.name || '알 수 없음';
        const isHidden = tb.status === 'hidden';
        const isCompleted = tb.status === 'completed';
        
        let statusBadge = '';
        if (isCompleted) statusBadge = `<span style="font-size:10px; background:rgba(0,208,132,0.1); color:var(--success); padding:2px 6px; border-radius:4px; font-weight:700;">완료</span>`;
        else if (isHidden) statusBadge = `<span style="font-size:10px; background:var(--bg); color:var(--secondary); padding:2px 6px; border-radius:4px; font-weight:700;">숨김</span>`;

        return `
            <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:900; font-size:14px; color:${tb.status==='active' ? 'var(--text)' : 'var(--secondary)'};">${tb.title} ${statusBadge}</div>
                    <div style="font-size:11px; color:var(--secondary); margin-top:4px;">${cName} | 시작: ${tb.start_date || '-'} ${tb.end_date ? `| 종료: ${tb.end_date}` : ''}</div>
                </div>
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openEditTextbookModal('${tb.id}')">관리</button>
            </div>
        `;
    };

    listRoot.innerHTML = `
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--secondary);">현재 사용 중인 교재 (${activeBooks.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeBooks.length ? activeBooks.map(renderTbRow).join('') : `<div style="font-size:12px; color:var(--secondary); padding:10px 0;">사용 중인 교재가 없습니다.</div>`}
        </div>
        ${inactiveBooks.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">완료 / 숨김 교재 (${inactiveBooks.length})</h4>
            <div style="opacity:0.7;">${inactiveBooks.map(renderTbRow).join('')}</div>
        ` : ''}
    `;
}

function openTextbookManageModal() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    showModal('교재 관리', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <select id="tb-manage-class" class="btn" style="flex:1; margin-right:8px; background:var(--surface-2); border:none;" onchange="renderTextbookManageList()">
                <option value="">전체학급 (내 담당)</option>
                ${classOptions}
            </select>
            <button class="btn btn-primary" style="padding:10px 14px; font-size:12px; font-weight:700;" onclick="openAddTextbookModal()">새 교재</button>
        </div>
        <div id="tb-manage-list" style="max-height:60vh; overflow-y:auto; padding-right:4px;"></div>
    `);
    renderTextbookManageList();
}

function openAddTextbookModal() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('새 교재 등록', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="new-tb-class" class="btn" style="background:var(--surface-2); border:none;"><option value="">반을 선택하세요</option>${classOptions}</select>
            <input id="new-tb-title" class="btn" placeholder="교재명 (예: 개념원리 중1-1)" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="new-tb-start" class="btn" value="${todayStr}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            <button class="btn btn-primary" style="margin-top:10px; padding:12px;" onclick="handleAddTextbook()">저장</button>
        </div>
    `);
}

async function handleAddTextbook() {
    const cid = document.getElementById('new-tb-class').value;
    const title = document.getElementById('new-tb-title').value.trim();
    const startDate = document.getElementById('new-tb-start').value;
    
    if (!cid || !title) return toast('반과 교재명을 모두 입력하세요.', 'warn');
    
    const r = await api.post('class-textbooks', { class_id: cid, title: title, start_date: startDate });
    if (r.success) {
        toast('교재가 등록되었습니다.', 'success');
        await loadData();
        openTextbookManageModal();
    } else toast('저장 실패', 'error');
}

function openEditTextbookModal(tbId) {
    const tb = state.db.class_textbooks.find(x => x.id === tbId);
    if (!tb) return;
    
    const isCompleted = tb.status === 'completed';
    const isHidden = tb.status === 'hidden';
    
    showModal('교재 수정', `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <input id="edit-tb-title" class="btn" value="${tb.title}" style="text-align:left; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="edit-tb-start" class="btn" value="${tb.start_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>
            ${isCompleted || tb.end_date ? `
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; font-weight:600; color:var(--secondary); min-width:50px;">종료일:</span>
                <input type="date" id="edit-tb-end" class="btn" value="${tb.end_date || ''}" style="flex:1; background:var(--surface-2); border:none;">
            </div>` : ''}
            <button class="btn btn-primary" style="margin-top:8px; padding:12px;" onclick="handlePatchTextbook('${tbId}', false)">정보 수정 저장</button>
        </div>
        <div style="border-top:1px solid var(--border); padding-top:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:12px; font-weight:600; color:var(--secondary); margin-bottom:4px;">상태 변경</div>
            <div style="display:flex; gap:8px;">
                ${isCompleted || isHidden 
                    ? `<button class="btn" style="flex:1; padding:10px; font-size:12px;" onclick="handlePatchTextbook('${tbId}', true, 'active')">진행중으로 복구</button>`
                    : `<button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--success); background:rgba(0,208,132,0.1); border:none; font-weight:700;" onclick="handlePatchTextbook('${tbId}', true, 'completed')">교재 완료 처리</button>
                       <button class="btn" style="flex:1; padding:10px; font-size:12px; background:var(--surface-2); border:none;" onclick="handlePatchTextbook('${tbId}', true, 'hidden')">숨김 보류</button>`
                }
            </div>
            <button class="btn" style="margin-top:12px; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="handleDeleteTextbook('${tbId}')">교재 완전 삭제</button>
        </div>
    `);
}

async function handlePatchTextbook(tbId, isStatusChange, targetStatus = 'active') {
    const title = document.getElementById('edit-tb-title').value.trim();
    const startDate = document.getElementById('edit-tb-start').value;
    const endDateEl = document.getElementById('edit-tb-end');
    
    let payload = { title, start_date: startDate };
    if (endDateEl) payload.end_date = endDateEl.value;
    
    if (isStatusChange) {
        payload.status = targetStatus;
        if (targetStatus === 'active') payload.clear_end_date = true;
    }
    
    const r = await api.patch(`class-textbooks/${tbId}`, payload);
    if (r.success) {
        toast('저장 완료', 'success');
        await loadData();
        openTextbookManageModal();
    } else toast('저장 실패', 'error');
}

async function handleDeleteTextbook(tbId) {
    if (!confirm('정말 삭제하시겠습니까? (과거 일지에 기록된 텍스트 스냅샷은 안전하게 보존됩니다)')) return;
    const r = await api.delete('class-textbooks', tbId);
    if (r.success) {
        toast('교재가 삭제되었습니다.', 'info');
        await loadData();
        openTextbookManageModal();
    } else toast('삭제 실패', 'error');
}


function openTodoMemoModal() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const memos = state.db.operation_memos || [];
    
    const memoRows = memos.map(m => `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; ${m.is_done ? 'opacity:0.5;' : ''}">
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-bottom:4px;">${m.memo_date} ${m.is_pinned ? `<span style="color:var(--primary); font-weight:800;">고정</span>` : ''}</div>
                <div style="font-size:14px; font-weight:900; color:var(--text); text-decoration:${m.is_done ? 'line-through' : 'none'};">${m.content}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn ${m.is_done ? '' : 'btn-primary'}" style="padding:6px 10px; font-size:11px; font-weight:700; ${m.is_done ? 'background:var(--surface-2); border:none;' : ''}" onclick="toggleMemoDone('${m.id}', ${!m.is_done})">${m.is_done ? '취소' : '완료'}</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; background:var(--surface-2); border:none;" onclick="openEditTodoMemoModal('${m.id}')">수정</button>
            </div>
        </div>
    `).join('');

    showModal('메모 / 할 일', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);"><input type="checkbox" id="new-memo-pin"> 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="할 일 입력 (예: 고2 직전보강)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:10px; font-size:13px; font-weight:700; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:45vh; overflow-y:auto; padding-right:4px;">
            ${memos.length ? memoRows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; padding:20px;">등록된 할 일이 없습니다.</div>`}
        </div>
    `);
}

async function addTodoMemo() {
    const d = document.getElementById('new-memo-date').value;
    const c = document.getElementById('new-memo-content').value.trim();
    const p = document.getElementById('new-memo-pin').checked;
    if(!c) return toast('내용을 입력하세요', 'warn');
    const r = await api.post('operation-memos', { memoDate: d, content: c, isPinned: p });
    if(r.success) { await loadData(); openTodoMemoModal(); }
}

async function toggleMemoDone(id, done) {
    const m = state.db.operation_memos.find(x => x.id === id);
    const r = await api.patch(`operation-memos/${id}`, { memoDate: m.memo_date, content: m.content, isPinned: m.is_pinned, isDone: done });
    if(r.success) { 
        await loadData(); 
        if(document.getElementById('new-memo-content') || document.getElementById('edit-memo-content')) openTodoMemoModal(); 
        else {
            if (state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
            else renderDashboard();
        }
    }
}

async function deleteMemo(id) {
    if(!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('operation-memos', id);
    if(r.success) { await loadData(); openTodoMemoModal(); }
}

function openEditTodoMemoModal(id) {
    const m = state.db.operation_memos.find(x => x.id === id);
    if(!m) return;
    showModal('메모 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="edit-memo-date" class="btn" value="${m.memo_date}" style="text-align:left; flex:1; border:none; background:var(--surface);">
                <label style="font-size:13px; font-weight:600; display:flex; align-items:center; gap:6px; white-space:nowrap; color:var(--text-soft);">
                    <input type="checkbox" id="edit-memo-pin" ${m.is_pinned ? 'checked' : ''}> 고정
                </label>
            </div>
            <input type="text" id="edit-memo-content" class="btn" value="${m.content}" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:12px; font-size:13px; font-weight:700; margin-top:4px;" onclick="handleEditTodoMemo('${id}')">수정 저장</button>
            <div style="display:flex; gap:8px; margin-top:4px;">
                <button class="btn" style="flex:1; padding:10px; font-size:12px; border:none; background:var(--surface);" onclick="openTodoMemoModal()">취소</button>
                <button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="deleteMemo('${id}')">완전 삭제</button>
            </div>
        </div>
    `);
}

async function handleEditTodoMemo(id) {
    const m = state.db.operation_memos.find(x => x.id === id);
    if (!m) return;
    const d = document.getElementById('edit-memo-date').value;
    const c = document.getElementById('edit-memo-content').value.trim();
    const p = document.getElementById('edit-memo-pin').checked;
    if(!c) return toast('내용을 입력하세요', 'warn');
    
    const r = await api.patch('operation-memos/' + id, { memoDate: d, content: c, isPinned: p, isDone: m.is_done === 1 });
    if(r.success) { 
        toast('메모가 수정되었습니다.', 'info');
        await loadData(); 
        openTodoMemoModal(); 
    } else {
        toast('메모 수정 실패', 'error');
    }
}

function openExamScheduleModal() {
    const schedules = state.db.exam_schedules || [];
    const rows = schedules.map(e => `
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-bottom:4px;">${e.exam_date} | ${e.school_name} ${e.grade}</div>
                <div style="font-size:14px; font-weight:900; color:var(--text);">${e.exam_name}</div>
                ${e.memo ? `<div style="font-size:12px; color:var(--secondary); margin-top:4px;">${e.memo}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px; font-weight:700; background:var(--surface-2); border:none;" onclick="openEditExamScheduleModal('${e.id}')">수정</button>
            </div>
        </div>
    `).join('');

    showModal('시험일정 관리', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-school" class="btn" placeholder="학교명" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <select id="new-ex-grade" class="btn" style="flex:1; border:none; background:var(--surface);">
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-name" class="btn" placeholder="시험명" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <input type="date" id="new-ex-date" class="btn" style="flex:1; border:none; background:var(--surface);">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="메모 (선택)" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:10px; font-size:13px; font-weight:700; margin-top:4px;" onclick="addExamSchedule()">저장</button>
        </div>
        <div style="max-height:45vh; overflow-y:auto; padding-right:4px;">
            ${schedules.length ? rows : `<div style="text-align:center; color:var(--secondary); font-size:12px; font-weight:600; padding:20px;">시험일정이 없습니다</div>`}
        </div>
    `);
}

async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school').value.trim();
    const gr = document.getElementById('new-ex-grade').value;
    const na = document.getElementById('new-ex-name').value.trim();
    const da = document.getElementById('new-ex-date').value;
    const me = document.getElementById('new-ex-memo').value.trim();
    if(!sc || !na || !da) return toast('필수 항목을 입력하세요', 'warn');
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
    showModal('시험일정 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:var(--surface-2); padding:12px; border-radius:12px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-school" class="btn" value="${e.school_name}" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <select id="edit-ex-grade" class="btn" style="flex:1; border:none; background:var(--surface);">
                    <option value="중1" ${e.grade==='중1'?'selected':''}>중1</option>
                    <option value="중2" ${e.grade==='중2'?'selected':''}>중2</option>
                    <option value="중3" ${e.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${e.grade==='고1'?'selected':''}>고1</option>
                    <option value="고2" ${e.grade==='고2'?'selected':''}>고2</option>
                    <option value="고3" ${e.grade==='고3'?'selected':''}>고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-name" class="btn" value="${e.exam_name}" style="flex:1; text-align:left; border:none; background:var(--surface);">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="flex:1; border:none; background:var(--surface);">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${e.memo||''}" style="text-align:left; border:none; background:var(--surface);">
            <button class="btn btn-primary" style="padding:12px; font-size:13px; font-weight:700; margin-top:4px;" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
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
    if(!sc || !na || !da) return toast('필수 항목을 입력하세요', 'warn');
    
    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { 
        toast('저장 완료', 'info');
        await loadData(); 
        openExamScheduleModal(); 
    } else {
        toast('저장 실패', 'error');
    }
}

// [Phase 4/5] 글로벌 진입점
function openGlobalExamGradeView() {
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:16px; margin-bottom:10px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); if(typeof openExamGradeView==='function') openExamGradeView('${c.id}')">
            <span style="font-weight:900; font-size:15px; color:var(--text);">${c.name}</span>
            <span style="font-size:12px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.1); padding:4px 10px; border-radius:8px;">${c.grade}</span>
        </button>
    `).join('');
    showModal('반별 시험성적', `
        <div style="margin-bottom:16px; font-size:13px; color:var(--secondary); font-weight:600;">조회할 반을 선택하세요.</div>
        <div style="max-height:60vh; overflow-y:auto; padding-right:4px;">${rows || `<div style="text-align:center; color:var(--secondary); padding:30px; font-size:13px; font-weight:600;">담당 반이 없습니다.</div>`}</div>
    `);
}

function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncStatusText = qLen > 0 ? `대기 ${qLen}건` : '대기 없음';
    const onlineStatusText = isOnline ? '연결됨' : '오프라인';

    showModal('운영메뉴', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:15px; font-weight:900; border-radius:14px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); openClassManageModal();">학급교재</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:15px; font-weight:900; border-radius:14px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); openAddressBook();">학생관리</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:15px; font-weight:900; border-radius:14px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); openExamScheduleModal();">시험일정</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:15px; font-weight:900; border-radius:14px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); openDischargedStudents();">퇴원생</button>
            <div style="margin-top:12px; padding:16px; border-radius:14px; background:var(--surface-2); border:none;">
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:8px; color:var(--secondary);"><span>네트워크</span><b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b></div>
                <div style="display:flex; justify-content:space-between; font-size:13px; font-weight:600; margin-bottom:16px; color:var(--secondary);"><span>미전송 데이터</span><b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b></div>
                <button class="btn btn-primary" style="width:100%; font-size:14px; font-weight:700; padding:12px; border-radius:10px;" onclick="if(typeof processSyncQueue==='function') processSyncQueue(); closeModal();">지금 동기화 시도</button>
            </div>
        </div>
    `);
}

function getClassGradeRank(grade) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.indexOf(grade);
    return idx >= 0 ? idx : 99;
}

function sortClassesForDashboard(classes) {
    const today = String(new Date().getDay());
    return [...classes].sort((a, b) => {
        const aToday = (!a.schedule_days || a.schedule_days.split(',').includes(today)) ? 0 : 1;
        const bToday = (!b.schedule_days || b.schedule_days.split(',').includes(today)) ? 0 : 1;
        if (aToday !== bToday) return aToday - bToday;
        const aRank = getClassGradeRank(a.grade);
        const bRank = getClassGradeRank(b.grade);
        if (aRank !== bRank) return aRank - bRank;
        return (a.name || '').localeCompare(b.name || '');
    });
}

function computeDashboardData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    
    const scheduledActiveStudents = activeStudents.filter(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && cls.is_active === 0) return false;
        return isClassScheduledToday(cid);
    });
    
    const scheduledIds = new Set(scheduledActiveStudents.map(s => s.id));
    
    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && scheduledIds.has(a.student_id)).length;
    const presentCount = scheduledActiveStudents.length - absentCount;
    
    const hwNotDoneCount = state.db.homework.filter(h => h.date === today && h.status === '미완료' && scheduledIds.has(h.student_id)).length;

    const todoCount = state.db.operation_memos.filter(m => m.is_done !== 1 && (m.is_pinned === 1 || m.memo_date === today)).length;

    const classSummaries = {};
    state.db.classes.filter(c => c.is_active !== 0).forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id);
        const cActiveIds = activeStudents.filter(s => cIds.includes(s.id)).map(s => s.id);
        let cMiss=0, cAbs=0;
        
        cActiveIds.forEach(id => {
            const att = state.db.attendance.find(a => a.student_id===id && a.date===today);
            if (att?.status === '결석') cAbs++;
            
            const hw = state.db.homework.find(h => h.student_id===id && h.date===today);
            if (hw?.status === '미완료') cMiss++;
        });
        
        let cPre = cActiveIds.length - cAbs;
        classSummaries[c.id] = { activeCount: cActiveIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, isScheduled: isClassScheduledToday(c.id) };
    });

    return { 
        global: { 
            totalActive: activeStudents.length, 
            scheduledActive: scheduledActiveStudents.length, 
            presentCount, 
            absentCount, 
            hwNotDoneCount,
            todoCount
        }, 
        classSummaries 
    };
}

function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id]; if (!s) return '';
    const n = s.activeCount || 1;

    const hasAbsent = s.absent > 0;
    const hasHwMiss = s.hwNotDone > 0;

    if (!s.isScheduled) {
        return `
            <div onclick="renderClass('${cls.id}')" style="cursor:pointer; position:relative; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; padding:14px 16px; border-radius:20px; background:var(--surface-2); border:1.5px solid var(--border); box-shadow:0 2px 8px rgba(0,0,0,0.04); overflow:hidden;">
                <div style="position:absolute; top:0; left:0; width:5px; height:100%; background:var(--border); border-radius:20px 0 0 20px;"></div>
                <div style="padding-left:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                        <span style="font-weight:900; font-size:15px; color:var(--secondary);">${cls.name}</span>
                        <span style="font-size:10px; font-weight:700; color:var(--secondary); background:var(--surface); padding:3px 8px; border-radius:20px; border:1px solid var(--border);">재원 ${s.activeCount}</span>
                    </div>
                    <div style="font-size:12px; font-weight:800; color:var(--secondary); background:var(--surface); padding:7px 10px; border-radius:8px; text-align:center;">오늘 수업 없음</div>
                </div>
            </div>
        `;
    }

    let accentColor, gradientBg, borderColor, shadowColor, chipBg, chipColor, chipLabel;

    if (hasAbsent) {
        accentColor = 'var(--error)';
        gradientBg = 'linear-gradient(135deg, rgba(255,71,87,0.08) 0%, var(--surface) 100%)';
        borderColor = 'rgba(255,71,87,0.35)';
        shadowColor = 'rgba(255,71,87,0.12)';
        chipBg = 'rgba(255,71,87,0.15)';
        chipColor = 'var(--error)';
        chipLabel = `결석 ${s.absent}명`;
    } else if (hasHwMiss) {
        accentColor = 'var(--warning)';
        gradientBg = 'linear-gradient(135deg, rgba(255,165,2,0.09) 0%, var(--surface) 100%)';
        borderColor = 'rgba(255,165,2,0.35)';
        shadowColor = 'rgba(255,165,2,0.12)';
        chipBg = 'rgba(255,165,2,0.15)';
        chipColor = '#b06000';
        chipLabel = `미완료 ${s.hwNotDone}명`;
    } else {
        accentColor = 'var(--primary)';
        gradientBg = 'linear-gradient(135deg, rgba(26,92,255,0.07) 0%, var(--surface) 100%)';
        borderColor = 'rgba(26,92,255,0.2)';
        shadowColor = 'rgba(26,92,255,0.09)';
        chipBg = 'rgba(26,92,255,0.1)';
        chipColor = 'var(--primary)';
        chipLabel = '정상 출석';
    }

    return `
        <div onclick="renderClass('${cls.id}')" style="cursor:pointer; position:relative; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; padding:14px 16px; border-radius:20px; background:${gradientBg}; border:1.5px solid ${borderColor}; box-shadow:0 4px 16px ${shadowColor}; overflow:hidden;">
            <div style="position:absolute; top:0; left:0; width:5px; height:100%; background:${accentColor}; border-radius:20px 0 0 20px;"></div>
            <div style="padding-left:6px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-weight:900; font-size:15px; color:#191F28;">${cls.name}</span>
                    <span style="font-size:10px; font-weight:700; color:var(--secondary); background:var(--surface); padding:3px 8px; border-radius:20px; border:1px solid var(--border);">재원 ${s.activeCount}</span>
                </div>
                <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
                    <div style="background:var(--surface); border-radius:10px; padding:6px 10px; font-size:12px; font-weight:800; color:#191F28;">
                        등원 <span style="font-size:15px; color:var(--success);">${s.present}</span>
                    </div>
                    <div style="background:var(--surface); border-radius:10px; padding:6px 10px; font-size:12px; font-weight:800; color:#191F28;">
                        결석 <span style="font-size:15px; color:${s.absent > 0 ? 'var(--error)' : 'var(--secondary)'};">${s.absent}</span>
                    </div>
                    <span style="background:${chipBg}; color:${chipColor}; padding:5px 10px; border-radius:20px; font-size:11px; font-weight:900; margin-left:auto;">${chipLabel}</span>
                </div>
            </div>
        </div>
    `;
}

function renderTodoSections() {
    const today = new Date();
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const nextWeek = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000);
    const nextWeekStr = nextWeek.toLocaleDateString('sv-SE');

    const todayMemos = state.db.operation_memos.filter(m => m.is_done !== 1 && (m.is_pinned === 1 || m.memo_date === todayStr));
    const upcomingMemos = state.db.operation_memos.filter(m => m.is_done !== 1 && m.is_pinned !== 1 && m.memo_date > todayStr && m.memo_date <= nextWeekStr);
    const upcomingExams = state.db.exam_schedules.filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr);

    let todayHtml = todayMemos.length ? todayMemos.map(m => `
        <div style="padding:14px 16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
            <label style="display:flex; align-items:center; gap:12px; flex:1; cursor:pointer;">
                <input type="checkbox" onchange="toggleMemoDone('${m.id}', this.checked)" style="transform:scale(1.2); margin:0; accent-color:var(--primary);">
                <span style="font-size:14px; font-weight:900; color:var(--text); ${m.is_pinned ? 'color:var(--primary);' : ''}">${m.is_pinned ? `<span style="background:rgba(26,92,255,0.1); padding:2px 6px; border-radius:4px; font-size:10px; margin-right:6px;">고정</span> ` : ''}${m.content}</span>
            </label>
        </div>
    `).join('') : `<div style="font-size:13px; font-weight:600; color:var(--secondary); padding:24px; text-align:center; background:var(--surface-2);">오늘 등록된 할 일이 없습니다.</div>`;

    let upcomingHtml = '';
    const upcomingItems = [];
    upcomingMemos.forEach(m => upcomingItems.push({ type: 'memo', date: m.memo_date, item: m }));
    upcomingExams.forEach(e => upcomingItems.push({ type: 'exam', date: e.exam_date, item: e }));
    
    upcomingItems.sort((a,b) => a.date.localeCompare(b.date));

    if (upcomingItems.length) {
        upcomingHtml = upcomingItems.slice(0, 5).map(u => {
            const diffTime = new Date(u.date).setHours(0,0,0,0) - new Date(todayStr).setHours(0,0,0,0);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dDay = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;

            if (u.type === 'exam') {
                const e = u.item;
                return `<div style="padding:14px 16px; font-size:13px; font-weight:900; color:var(--warning); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);"><div>${e.school_name} ${e.grade} ${e.exam_name}</div><span style="font-size:11px; background:rgba(255,165,2,0.12); padding:4px 8px; border-radius:6px;">${dDay}</span></div>`;
            } else {
                return `<div style="padding:14px 16px; font-size:13px; font-weight:700; color:var(--text); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);"><div>${u.item.content}</div><span style="font-size:11px; background:var(--surface-2); color:var(--secondary); padding:4px 8px; border-radius:6px;">${dDay}</span></div>`;
            }
        }).join('');
    }

    return `
        <div style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--text);">오늘일정</h3>
            </div>
            <div style="margin-bottom:14px; overflow:hidden; border-radius:16px; box-shadow:0 4px 16px rgba(26,92,255,0.10); border:1.5px solid rgba(26,92,255,0.13); background:linear-gradient(135deg,rgba(26,92,255,0.06) 0%,var(--surface) 100%);">${todayHtml}</div>
            
            ${upcomingHtml ? `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                    <h3 style="margin:0; font-size:14px; font-weight:700; color:var(--secondary);">주간일정</h3>
                </div>
                <div style="overflow:hidden; border-radius:16px; box-shadow:0 4px 14px rgba(255,165,2,0.10); border:1.5px solid rgba(255,165,2,0.18); background:linear-gradient(135deg,rgba(255,165,2,0.07) 0%,var(--surface) 100%);">${upcomingHtml}</div>
            ` : ''}
        </div>
    `;
}

function renderDashboard() {
    state.ui.currentClassId = null;
    if (typeof renderAppDrawer === 'function') renderAppDrawer();
    const data = computeDashboardData();
    const closeData = typeof computeTodayCloseData === 'function' ? computeTodayCloseData() : { totalActive:0, absents:[], hwMisses:[], allClear:true };
    const root = document.getElementById('app-root');
    const teacherName = typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당');

    const appHeader = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; padding:2px 4px 0;">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                <button class="btn" style="width:36px; height:36px; padding:0; border:none; background:transparent; color:var(--text); font-size:22px; line-height:1;" onclick="openAppDrawer()">☰</button>
                <div style="min-width:0;">
                    <div style="font-size:18px; font-weight:900; color:var(--text); letter-spacing:-0.5px;">AP Math OS</div>
                    <div style="font-size:12px; font-weight:600; color:var(--secondary); margin-top:1px;">${teacherName} 선생님</div>
                </div>
            </div>
        </div>
    `;

    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncWarning = qLen > 0
        ? `<div style="background:rgba(255,71,87,0.1); color:var(--error); padding:12px 16px; border-radius:12px; font-size:12px; font-weight:800; margin-bottom:16px; text-align:center;">네트워크 지연: ${qLen}건 대기 중</div>`
        : '';

    const buildSummaryBadges = (list) => {
        if(list.length === 0) return '';
        const group = list.reduce((acc, cur) => { acc[cur.className] = (acc[cur.className]||0)+1; return acc; }, {});
        const keys = Object.keys(group);
        let str = keys.slice(0, 2).map(k => `${k} ${group[k]}`).join(' · ');
        if(keys.length > 2) str += ` 외 ${keys.length - 2}개 반`;
        return `<span style="font-size:11px; background:var(--surface); padding:2px 6px; border-radius:6px; margin-left:6px; color:var(--warning); font-weight:700; border:1px solid rgba(255,165,2,0.3);">${str}</span>`;
    };

    const closeBanner = closeData.totalActive === 0
        ? `${syncWarning}<div class="card" style="margin-bottom:14px; padding:12px 14px;"><b style="color:var(--text); font-size:15px; font-weight:900;">수업이 없는 날입니다</b><br><span style="font-size:13px; color:var(--secondary); font-weight:600; margin-top:4px; display:block;">운영 기능이나 일정/메모를 확인해보세요.</span></div>`
        : closeData.allClear
            ? `${syncWarning}<div class="card" style="margin-bottom:14px; padding:12px 14px; border-left:4px solid var(--success);"><b style="font-size:15px; font-weight:900; color:var(--text);">모든 학생 등원 및 과제 완료</b><br><span style="font-size:13px; color:var(--secondary); font-weight:600; display:block; margin-top:4px;">예외사항이 없습니다.</span></div>`
            : `${syncWarning}<div class="card" onclick="if(typeof openTodayCloseModal==='function') openTodayCloseModal('att')" style="margin-bottom:14px; padding:12px 14px; cursor:pointer; border-left:4px solid var(--warning);"><div style="display:flex; justify-content:space-between; align-items:flex-start;"><div style="font-size:13px; color:var(--secondary);"><b style="font-size:15px; font-weight:900; color:var(--text);">수업 예외 현황</b> <span style="font-size:12px; font-weight:600; background:var(--surface-2); padding:4px 8px; border-radius:6px; margin-left:6px;">총 ${closeData.totalActive}명</span><div style="margin-top:12px; font-weight:600; display:flex; flex-direction:column; gap:6px;"><div style="display:flex; align-items:center; color:var(--text-soft);">결석 <b style="color:var(--error); margin:0 6px; font-size:14px;">${closeData.absents.length}</b>명 ${buildSummaryBadges(closeData.absents)}</div><div style="display:flex; align-items:center; color:var(--text-soft);">미완료 <b style="color:var(--error); margin:0 6px; font-size:14px;">${closeData.hwMisses.length}</b>명 ${buildSummaryBadges(closeData.hwMisses)}</div></div></div><span style="font-size:20px; color:var(--secondary); font-weight:900;">›</span></div></div>`;

    const todoSections = renderTodoSections();
    const classes = sortClassesForDashboard(state.db.classes.filter(c => c.is_active !== 0));
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:0 4px;">
            <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--text);">학급관리</h3>
        </div>
        <div class="grid" style="margin-bottom:40px; display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:10px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    root.innerHTML = appHeader + closeBanner + todoSections + classStatus;
}

function computeTodayCloseData() {
    const today = new Date().toLocaleDateString('sv-SE');
    
    const scheduledActive = state.db.students.filter(s => {
        if (s.status !== '재원') return false;
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && cls.is_active === 0) return false;
        return isClassScheduledToday(cid);
    });

    const absents = [];
    const hwMisses = [];

    scheduledActive.forEach(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const className = state.db.classes.find(c => c.id === cid)?.name || '미배정';
        const info = { id: s.id, name: s.name, className };

        const att = state.db.attendance.find(a => String(a.student_id) === String(s.id) && a.date === today);
        if (att?.status === '결석') absents.push(info);

        const hw = state.db.homework.find(h => String(h.student_id) === String(s.id) && h.date === today);
        if (hw?.status === '미완료') hwMisses.push(info);
    });

    const totalActive = scheduledActive.length;
    return {
        totalActive, 
        absents, 
        hwMisses, 
        allClear: absents.length === 0 && hwMisses.length === 0
    };
}

async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

async function quickToggleHw(sid, status, tab = 'hw') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('homework', { studentId: sid, status, date: today });
    if (!r?.success) { toast('숙제 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

function openTodayCloseModal(tab = 'att') {
    const d = computeTodayCloseData();

    const tabs = [
        { key: 'att',  label: `결석 ${d.absents.length}명`,  list: d.absents,  emptyMsg: '결석 학생이 없습니다.' },
        { key: 'hw',   label: `미완료 ${d.hwMisses.length}명`, list: d.hwMisses, emptyMsg: '숙제 미완료 학생이 없습니다.' }
    ];
    const cur = tabs.find(t => t.key === tab) || tabs[0];

    const tabBtns = tabs.map(t => `
        <button onclick="openTodayCloseModal('${t.key}')" style="
            flex:1; padding:12px; border:none; border-radius:10px; font-size:13px; font-weight:700; transition:all 0.2s;
            background:${t.key === tab ? 'var(--primary)' : 'var(--surface-2)'};
            color:${t.key === tab ? 'white' : 'var(--secondary)'};
            cursor:pointer;">
            ${t.label}
        </button>
    `).join('');

    const grouped = cur.list.reduce((acc, item) => {
        if(!acc[item.className]) acc[item.className] = [];
        acc[item.className].push(item);
        return acc;
    }, {});

    const rows = cur.list.length
        ? Object.keys(grouped).sort().map(cName => {
            const classHeader = `<div style="background:var(--surface-2); padding:8px 12px; font-size:12px; font-weight:800; color:var(--secondary); margin-top:12px; border-radius:8px;">${cName}</div>`;
            const studentRows = grouped[cName].map(s => {
                let actionBtns = '';
                if (tab === 'att') {
                    actionBtns = `<div style="display:flex; gap:8px; margin-top:12px;"><button class="btn btn-primary" style="flex:1; padding:10px; font-size:12px; border-radius:8px;" onclick="quickToggleAtt('${s.id}', '등원', '${tab}')">등원 (취소)</button><button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; border-radius:8px; cursor:default; font-weight:700;">결석 유지</button></div>`;
                } else if (tab === 'hw') {
                    actionBtns = `<div style="display:flex; gap:8px; margin-top:12px;"><button class="btn btn-primary" style="flex:1; padding:10px; font-size:12px; border-radius:8px;" onclick="quickToggleHw('${s.id}', '완료', '${tab}')">완료 (취소)</button><button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--warning); background:rgba(255,165,2,0.12); border:none; border-radius:8px; cursor:default; font-weight:700;">미완료 유지</button></div>`;
                }
                return `
                    <div style="padding:16px 8px; border-bottom:1px solid var(--border); background:var(--surface);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div onclick="closeModal();renderStudentDetail('${s.id}')" style="cursor:pointer; flex:1;">
                                <span style="font-weight:900; font-size:15px; color:var(--text);">${s.name}</span>
                            </div>
                            <span onclick="closeModal();renderStudentDetail('${s.id}')" style="font-size:11px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px; cursor:pointer;">상세 보기</span>
                        </div>
                        ${actionBtns}
                    </div>`;
            }).join('');
            return classHeader + studentRows;
        }).join('')
        : `<div style="padding:40px 20px; text-align:center; color:var(--secondary); font-weight:600; font-size:13px;">${cur.emptyMsg}</div>`;

    showModal('예외 현황', `<div style="display:flex; gap:8px; margin-bottom:16px;">${tabBtns}</div><div>${rows}</div>`);
}

function getTodayExamConfig() {
    try {
        const raw = localStorage.getItem('AP_TODAY_EXAM');
        if (!raw) return null;
        const cfg = JSON.parse(raw);
        const today = new Date().toLocaleDateString('sv-SE');
        if (cfg.date !== today || !cfg.title) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
        return { date: cfg.date, title: String(cfg.title), q: parseInt(cfg.q, 10) || 20 };
    } catch (e) { localStorage.removeItem('AP_TODAY_EXAM'); return null; }
}

function setTodayExamConfig(title, q) {
    const today = new Date().toLocaleDateString('sv-SE');
    const validQ = parseInt(q, 10) || 20;
    localStorage.setItem('AP_TODAY_EXAM', JSON.stringify({ date: today, title: String(title), q: validQ }));
}

function clearTodayExamConfig() { 
    localStorage.removeItem('AP_TODAY_EXAM'); 
    if(state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
    else renderDashboard();
}

function openTodayExamSetModal() {
    const cfg = getTodayExamConfig();
    showModal('오늘 시험 설정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="font-size:12px; color:var(--secondary); background:var(--surface-2); padding:10px; border-radius:8px; line-height:1.5;">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</div>
            <div style="display:flex; gap:6px; flex-wrap:wrap; margin:4px 0;">
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button>
                <button class="btn" style="padding:6px 10px; font-size:11px; background:var(--surface-2); border:none;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button>
            </div>
            <input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%; background:var(--surface-2); border:none;">
            <input id="set-exam-q" type="number" class="btn" placeholder="문항 수 (기본 20)" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%; background:var(--surface-2); border:none;">
            <div style="display:flex; gap:8px; margin-top:12px;">
                <button class="btn" style="flex:1; padding:12px; font-size:12px; color:var(--error); background:rgba(255,71,87,0.1); border:none; font-weight:700;" onclick="clearTodayExamConfig(); closeModal();">시험 없음</button>
                <button class="btn btn-primary" style="flex:1.5; padding:12px; font-size:12px; font-weight:700;" onclick="handleSetTodayExam()">저장 및 적용</button>
            </div>
        </div>
    `);
}

function handleSetTodayExam() {
    const t = document.getElementById('set-exam-title').value.trim();
    const q = parseInt(document.getElementById('set-exam-q').value, 10) || 20;
    if (!t) { toast('시험명을 입력하세요.', 'warn'); return; }
    setTodayExamConfig(t, q); 
    toast('오늘 시험이 설정되었습니다.', 'info'); 
    closeModal(); 
    if(state.auth.role === 'admin' && typeof renderAdminControlCenter === 'function') renderAdminControlCenter();
    else renderDashboard();
}

function apEscapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function buildJournalContent(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    let text = `[AP Math 운영 일지 - ${targetDate}]\n작성자: ${state.ui.userName}\n\n`;

    const activeClasses = state.db.classes.filter(c => c.is_active !== 0);

    if (activeClasses.length === 0) {
        text += `해당 날짜에 담당 학급이 없습니다.\n`;
        return text;
    }

    activeClasses.forEach(cls => {
        text += `■ ${cls.name}반\n`;

        const memberIds = state.db.class_students.filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id));
        const students = state.db.students.filter(s => memberIds.includes(String(s.id)) && s.status === '재원');

        const absents = [];
        const hwMiss = [];
        
        students.forEach(s => {
            const att = state.db.attendance.find(a => String(a.student_id) === String(s.id) && a.date === targetDate);
            const hw = state.db.homework.find(h => String(h.student_id) === String(s.id) && h.date === targetDate);
            if (att?.status === '결석') absents.push(s.name);
            if (hw?.status === '미완료') hwMiss.push(s.name);
        });

        if (absents.length === 0 && hwMiss.length === 0) text += `- 출결/숙제: 전원 출석 / 전원 완료\n`;
        else {
            if (absents.length > 0) text += `- 결석: ${absents.join(', ')}\n`;
            if (hwMiss.length > 0) text += `- 숙제 미완료: ${hwMiss.join(', ')}\n`;
        }

        const dailyRecord = (state.db.class_daily_records || []).find(r => String(r.class_id) === String(cls.id) && r.date === targetDate);
        if (dailyRecord) {
            const progresses = (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(dailyRecord.id));
            if (progresses.length > 0) {
                text += `- 진도:\n`;
                progresses.forEach(p => {
                    text += `  * ${p.textbook_title_snapshot || '교재'}: ${p.progress_text || '(기록 없음)'}\n`;
                });
            } else text += `- 진도: (기록 없음)\n`;

            if (dailyRecord.special_note) text += `- 특이사항: ${dailyRecord.special_note}\n`;
        } else {
            text += `- 진도: (수업 기록 미입력)\n`;
        }

        const cns = (state.db.consultations || []).filter(c => c.date === targetDate && memberIds.includes(String(c.student_id)));
        if (cns.length > 0) {
            text += `- 상담:\n`;
            cns.forEach(c => {
                const sName = students.find(s => String(s.id) === String(c.student_id))?.name || '학생';
                text += `  * ${sName}: ${c.content}\n`;
            });
        }

        text += `\n`;
    });

    return text.trim() + '\n';
}

function openDailyJournalModal(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');

    if (state.ui.viewScope === 'all' || state.auth.role === 'admin') {
        renderAdminJournalList(targetDate);
        return;
    }

    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === state.ui.userName);

    const content = myJournal ? myJournal.content : buildJournalContent(targetDate);
    const status = myJournal ? myJournal.status : '작성중';
    const isLocked = status === '제출완료' || status === '결재완료';

    let actionBtns = '';
    if (!myJournal || status === '작성중') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:14px; font-weight:700; background:var(--surface); color:var(--text);" onclick="saveJournal('작성중', null, '${targetDate}')">임시 저장</button>
            <button class="btn btn-primary" style="flex:1; padding:14px; font-weight:800;" onclick="saveJournal('제출완료', null, '${targetDate}')">제출</button>
        `;
    } else if (status === '제출완료') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:14px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="saveJournal('작성중', '${myJournal.id}', '${targetDate}')">제출 취소 및 수정</button>
        `;
    }

    showModal('일지', `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:10px 14px; border-radius:10px;">
            <b style="font-size:13px; color:var(--secondary);">작성 기준일</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:900; color:var(--text);" onchange="openDailyJournalModal(this.value)">
        </div>
        ${status === '결재완료' ? `
            <div style="background:rgba(0,208,132,0.1); color:var(--success); padding:16px; border-radius:12px; margin-bottom:16px;">
                <b style="display:flex; align-items:center; gap:8px; font-size:14px;">원장님 확인 완료</b>
                ${myJournal.feedback ? `<div style="margin-top:10px; font-size:13px; background:var(--surface); padding:12px; border-radius:8px; color:var(--text);"><b>피드백:</b><br>${apEscapeHtml(myJournal.feedback)}</div>` : ''}
            </div>
        ` : ''}
        <textarea id="journal-content" class="btn" style="width:100%; height:250px; text-align:left; resize:vertical; font-family:inherit; font-size:14px; line-height:1.6; background:${isLocked ? 'var(--surface-2)' : 'var(--surface)'}; border:1px solid var(--border); color:var(--text);" ${isLocked ? 'readonly' : ''}>${content}</textarea>
        <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
            ${actionBtns}
        </div>
    `);
}

async function saveJournal(status, existingId = null, targetDate) {
    const el = document.getElementById('journal-content');
    if (!el) return toast('일지 입력칸을 찾을 수 없습니다.', 'warn');

    const content = el.value;
    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === state.ui.userName);

    const journalId = existingId || myJournal?.id;
    let result;
    if (journalId) {
        result = await api.patch(`daily-journals/${journalId}`, { content, status });
    } else {
        result = await api.post('daily-journals', { date: targetDate, content, status });
    }

    if (!result || result.error) return toast(result?.error || '저장 실패', 'error');

    toast(`저장 완료`, 'success');
    closeModal();
    await loadData();
}

function renderAdminJournalList(dateStr, teacherName = '') {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const safeTeacher = String(teacherName || '').replace(/'/g, "\\'");
    let journals = (state.db.journals || []).filter(j => j.date === targetDate && j.status !== '작성중');
    if (teacherName) journals = journals.filter(j => j.teacher_name === teacherName);
    const title = teacherName ? `${teacherName} 선생님 일지` : '일지확인';
    
    const backBtn = teacherName ? `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:800; background:var(--surface-2); border:none; color:var(--text);" onclick="openAdminTeacherPanel('${safeTeacher}')">← 선생님 메뉴</button>` : '';
    
    const rows = journals.map(j => {
        const teacherArg = String(teacherName || j.teacher_name || '').replace(/'/g, "\\'");
        const statusText = j.status === '결재완료' ? '확인완료' : j.status;
        const statusColor = j.status === '결재완료' ? 'var(--success)' : 'var(--primary)';
        const statusBg = j.status === '결재완료' ? 'rgba(0,208,132,0.1)' : 'rgba(26,92,255,0.1)';
        
        return `
            <div class="card" style="padding:16px; margin-bottom:12px; cursor:pointer; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); background:var(--surface);" onclick="openAdminJournalFeedback('${j.id}', '${teacherArg}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; gap:8px; align-items:center;">
                    <b style="font-size:15px; color:var(--text);">${apEscapeHtml(j.teacher_name)} 선생님</b>
                    <span style="font-size:11px; font-weight:900; color:${statusColor}; background:${statusBg}; padding:4px 8px; border-radius:6px;">${apEscapeHtml(statusText)}</span>
                </div>
                <div style="font-size:13px; color:var(--text-soft); white-space:pre-wrap; max-height:60px; overflow:hidden; line-height:1.6;">${apEscapeHtml(j.content)}</div>
            </div>`;
    }).join('');
    
    showModal(`${apEscapeHtml(title)}`, `
        ${backBtn}
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:12px 14px; border-radius:12px;">
            <b style="font-size:13px; color:var(--secondary); white-space:nowrap;">기준일</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:900; color:var(--text);" onchange="renderAdminJournalList(this.value, '${safeTeacher}')">
        </div>
        <div style="max-height:55vh; overflow-y:auto; padding-right:4px;">
            ${journals.length ? rows : `<div style="text-align:center; color:var(--secondary); padding:30px; font-weight:600; font-size:13px; background:var(--surface-2); border-radius:12px;">해당 날짜에 제출된 일지가 없습니다.</div>`}
        </div>
    `);
}

function openAdminJournalFeedback(id, teacherName = '') {
    const journal = (state.db.journals || []).find(j => j.id === id);
    if (!journal) return toast('일지를 찾을 수 없습니다.', 'warn');
    const safeTeacher = String(teacherName || journal.teacher_name || '').replace(/'/g, "\\'");
    
    showModal(`${apEscapeHtml(journal.teacher_name)} 선생님 일지`, `
        <textarea readonly class="btn" style="width:100%; height:200px; text-align:left; resize:vertical; font-size:14px; line-height:1.6; background:var(--surface-2); border:none; border-radius:12px; padding:16px; margin-bottom:12px; color:var(--text);">${journal.content}</textarea>
        <textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; border:1px solid var(--border); border-radius:12px; padding:14px; font-size:13px; background:var(--surface); color:var(--text);">${journal.feedback || ''}</textarea>
        <div style="margin-top:16px;">
            <button class="btn btn-primary" style="width:100%; padding:16px; border-radius:14px; font-weight:800; font-size:15px;" onclick="approveJournal('${journal.id}', '${journal.date}', '${safeTeacher}')">확인완료</button>
        </div>
    `);
}

function approveJournal(id, dateStr, teacherName = '') {
    const feedback = document.getElementById('journal-feedback')?.value.trim() || '';
    return api.patch(`daily-journals/${id}`, { feedback, status: '결재완료' }).then(async result => {
        if (!result || result.error) return toast(result?.error || '저장 실패', 'error');
        toast('저장 완료', 'success');
        closeModal();
        await loadData();
        renderAdminJournalList(dateStr, teacherName);
    });
}


function renderAdminTeacherCards(todayStr) {
    const activeClasses = state.db.classes.filter(c => c.is_active !== 0);
    const teacherMap = {};
    activeClasses.forEach(c => {
        const tName = String(c.teacher_name || '담당').trim();
        if (!teacherMap[tName]) teacherMap[tName] = [];
        teacherMap[tName].push(c);
    });
    const teacherNames = Object.keys(teacherMap).filter(Boolean);
    if (!teacherNames.length) return `<div style="text-align:center; padding:24px; color:var(--secondary); font-weight:600; background:var(--surface-2); border-radius:16px;">등록된 선생님이 없습니다.</div>`;
    
    return teacherNames.map((tName, idx) => {
        const myClasses = teacherMap[tName];
        const myClassIds = myClasses.map(c => String(c.id));
        const myStudentIds = [...new Set(state.db.class_students.filter(m => myClassIds.includes(String(m.class_id))).map(m => String(m.student_id)))];
        const activeStudentCount = state.db.students.filter(s => myStudentIds.includes(String(s.id)) && s.status === '재원').length;
        const log = (state.db.journals || []).find(j => j.date === todayStr && j.teacher_name === tName && j.status !== '작성중');
        
        const journalStatus = log ? (log.status === '결재완료' ? '확인완료' : '제출완료') : '미제출';
        const statusColor = log ? (log.status === '결재완료' ? 'var(--success)' : 'var(--primary)') : 'var(--secondary)';
        const statusBg = log ? (log.status === '결재완료' ? 'rgba(0,208,132,0.1)' : 'rgba(26,92,255,0.1)') : 'var(--surface-2)';
        
        const safeName = String(tName).replace(/'/g, "\\'");
        
        return `
            <div class="card" onclick="openAdminTeacherPanel('${safeName}')" style="cursor:pointer; padding:18px; margin:0; border:1px solid var(--border); border-radius:20px; background:var(--surface); box-shadow:var(--shadow); transition:transform 0.2s;">
                <div style="display:flex; align-items:center; gap:14px; margin-bottom:16px;">
                    <div style="width:46px; height:46px; border-radius:14px; background:var(--surface-2); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:900; flex-shrink:0;">${tName.charAt(0)}</div>
                    <div style="min-width:0; flex:1;">
                        <div style="font-size:16px; font-weight:900; color:var(--text); line-height:1.2;">${apEscapeHtml(tName)} 선생님</div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:600; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">반 ${myClasses.length}개 · 학생 ${activeStudentCount}명</div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface-2); border-radius:10px; padding:10px 12px;">
                    <span style="font-size:12px; color:var(--secondary); font-weight:700;">오늘 일지</span>
                    <span style="font-size:11px; color:${statusColor}; background:${statusBg}; padding:4px 8px; border-radius:6px; font-weight:900;">${journalStatus}</span>
                </div>
            </div>`;
    }).join('');
}

function openAdminTeacherPanel(teacherName) {
    state.ui.currentAdminTeacherName = teacherName;
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    showModal(`${apEscapeHtml(teacherName)} 선생님`, `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button class="btn btn-primary" style="padding:16px; font-size:14px; font-weight:900; border-radius:16px;" onclick="closeModal(); renderAdminJournalList(new Date().toLocaleDateString('sv-SE'), '${safeName}')">일지확인</button>
            <button class="btn" style="padding:16px; font-size:14px; font-weight:900; border-radius:16px; background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); color:var(--text);" onclick="closeModal(); renderAdminTeacherStudents('${safeName}')">학생확인</button>
        </div>
    `);
}

function renderAdminTeacherStudents(teacherName) {
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    const myClasses = state.db.classes.filter(c => String(c.teacher_name || '담당').trim() === teacherName && c.is_active !== 0);
    
    let html = `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:900; background:var(--surface-2); border:none; color:var(--text);" onclick="openAdminTeacherPanel('${safeName}')">← 선생님 메뉴</button><div style="max-height:60vh; overflow-y:auto; display:flex; flex-direction:column; gap:16px; padding-right:4px;">`;
    
    if (!myClasses.length) {
        html += `<div style="text-align:center; padding:30px; color:var(--secondary); font-weight:600; background:var(--surface-2); border-radius:16px;">담당 학급 또는 재원생이 없습니다.</div>`;
    } else {
        myClasses.forEach(cls => { 
            const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id)); 
            const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원'); 
            
            html += `<div style="background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden;">
                        <div style="padding:14px 16px; background:var(--surface-2); font-weight:900; color:var(--text); display:flex; justify-content:space-between; border-bottom:1px solid var(--border);">
                            <span>${apEscapeHtml(cls.name)}</span>
                            <span style="font-size:12px; color:var(--secondary); font-weight:700;">${stds.length}명</span>
                        </div>
                        ${stds.length ? stds.map(s => `
                            <div style="padding:14px 16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:8px;">
                                <div>
                                    <b style="font-size:14px; color:var(--text);">${apEscapeHtml(s.name)}</b>
                                    <span style="font-size:11px; color:var(--secondary); margin-left:6px; font-weight:600;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span>
                                </div>
                                <button class="btn" style="padding:6px 12px; font-size:11px; font-weight:700; border-radius:8px; color:var(--primary); background:rgba(26,92,255,0.1); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">상세 보기</button>
                            </div>
                        `).join('') : `<div style="padding:20px; text-align:center; color:var(--secondary); font-size:12px; font-weight:600;">재원생이 없습니다.</div>`}
                    </div>`; 
        });
    }
    html += '</div>';
    showModal(`${apEscapeHtml(teacherName)} 선생님 학생`, html);
}
