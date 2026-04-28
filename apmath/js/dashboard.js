/**
 * AP Math OS v26.1.2 [js/dashboard.js]
 * 대시보드 및 원장 전용 학원 운영센터 (5G Phase 3 - 운영센터 심화 및 모바일 최적화)
 * Phase 4/5: 메인 4대 액션 재배치, 예외 정책 통계 보정, 일지 날짜 선택 지원 및 필터 오류 수정
 */

function copyPhoneNumber(text) {
    navigator.clipboard.writeText(text).then(() => toast('전화번호가 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

// [5G] 위험학생 판정 알고리즘
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
        if (absenceCount >= 2) { riskTypes.push('출결위험'); reasons.push(`최근 14일 결석 ${absenceCount}회`); }
        
        const recentHw = state.db.homework_history.filter(h => h.student_id === s.id && h.status === '미완료');
        const hwMissCount = recentHw.length;
        if (hwMissCount >= 3) { riskTypes.push('숙제위험'); reasons.push(`최근 14일 숙제 미완료 ${hwMissCount}회`); }
        
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
            if (scoreRisk) riskTypes.push('시험성적위험');
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
        
        if (cnsDaysDiff >= 30 && !isNewStudent) { riskTypes.push('관리위험'); reasons.push(`최근 30일 상담 기록 없음`); }
        if (riskTypes.length >= 2) { riskTypes.push('복합위험'); }
        
        if (riskTypes.length > 0) {
            const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
            const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
            risks.push({ student: s, className: cName, riskTypes, reasons, scoreSummary, absenceCount, hwMissCount, lastConsultationDate: lastCnsDate });
        }
    });
    
    return risks;
}

function openAdminStudentList(type) {
    const todayTime = new Date(new Date().toLocaleDateString('sv-SE')).getTime();
    let list = [], title = "";

    if (type === 'active') { list = state.db.students.filter(s => s.status === '재원'); title = "재원생 목록"; }
    else if (type === 'new') { list = state.db.students.filter(s => { if (s.status !== '재원' || !s.created_at) return false; return (todayTime - new Date(s.created_at).getTime()) / (1000*3600*24) <= 30; }); title = "신규생 목록 (최근 30일)"; }
    else if (type === 'discharged') { list = state.db.students.filter(s => s.status === '제적'); title = "퇴원생 목록"; }
    else if (type === 'risk') { list = computeRiskStudents().map(r => ({ ...r.student, riskInfo: r })); title = "위험학생 목록"; }

    const rows = list.map(s => {
        const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
        let riskDetails = "";
        if (s.riskInfo) { riskDetails = `<div style="font-size:11px; color:var(--error); margin-top:4px;"><b>위험:</b> ${s.riskInfo.riskTypes.join(', ')} (${s.riskInfo.reasons.join(' · ')})</div>`; }
        return `
            <div style="padding:12px 4px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div style="flex:1; padding-right:10px;">
                    <div style="font-weight:700; font-size:14px;">${s.name} <span style="font-size:11px; color:var(--secondary); font-weight:normal;">${s.school_name} ${s.grade} | ${cName}</span></div>
                    <div style="font-size:11px; color:var(--secondary); margin-top:2px;">상태: ${s.status} ${s.created_at ? `| 등록: ${s.created_at.split(' ')[0]}` : ''}</div>
                    ${riskDetails}
                </div>
                <button class="btn" style="padding:6px 12px; font-size:11px; white-space:nowrap;" onclick="closeModal(); renderStudentDetail('${s.id}')">상세</button>
            </div>
        `;
    }).join('');

    showModal(`📋 ${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:5px;">${rows || '<div style="text-align:center; padding:30px; opacity:0.5;">대상 학생이 없습니다.</div>'}</div>`);
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

    const headerHtml = `<div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; padding:2px 2px 0;"><div style="display:flex; align-items:center; gap:12px; min-width:0;"><button class="btn" style="width:44px; height:44px; padding:0; font-size:20px; border:none; border-radius:14px; background:#fff; box-shadow:0 4px 14px rgba(12,68,124,0.08); line-height:1;" onclick="openAppDrawer()">☰</button><div><div style="font-size:20px; font-weight:950; color:#1a1a1a; letter-spacing:-0.6px; line-height:1.2;">운영센터</div><div style="font-size:13px; font-weight:800; color:var(--secondary); margin-top:2px;">선생님별 일지와 학생 현황</div></div></div><div style="font-size:11px; font-weight:900; color:#0C447C; background:#E6F1FB; padding:7px 10px; border-radius:999px; white-space:nowrap;">원장</div></div>`;

    const summaryHtml = `<div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:9px; margin-bottom:22px;"><div class="card" onclick="openAdminStudentList('active')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border:none; border-radius:18px; background:#fff; box-shadow:0 6px 18px rgba(12,68,124,0.05);"><div style="font-size:22px; font-weight:950; color:#1a1a1a;">${activeStudents.length}</div><div style="font-size:11px; color:var(--secondary); font-weight:800; margin-top:4px;">재원생</div></div><div class="card" onclick="openAdminStudentList('new')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border:none; border-radius:18px; background:#fff; box-shadow:0 6px 18px rgba(30,107,52,0.05);"><div style="font-size:22px; font-weight:950; color:var(--success);">${newStudents.length}</div><div style="font-size:11px; color:var(--secondary); font-weight:800; margin-top:4px;">신규</div></div><div class="card" onclick="openAdminStudentList('discharged')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border:none; border-radius:18px; background:#fff; box-shadow:0 6px 18px rgba(12,68,124,0.04);"><div style="font-size:22px; font-weight:950; color:var(--secondary);">${dischargedStudents.length}</div><div style="font-size:11px; color:var(--secondary); font-weight:800; margin-top:4px;">퇴원생</div></div><div class="card" onclick="openAdminStudentList('risk')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border:none; border-radius:18px; background:${risks.length > 0 ? '#FFF2F1' : '#fff'}; box-shadow:0 6px 18px rgba(217,48,37,0.06);"><div style="font-size:22px; font-weight:950; color:var(--error);">${risks.length}</div><div style="font-size:11px; color:var(--secondary); font-weight:800; margin-top:4px;">위험학생</div></div></div>`;

    const teacherCardsHtml = `<div style="margin-bottom:24px;"><div style="margin:0 2px 12px;"><h3 style="margin:0; font-size:18px; font-weight:950; color:#1a1a1a; letter-spacing:-0.4px;">선생님</h3><div style="font-size:12px; font-weight:800; color:var(--secondary); margin-top:3px;">카드를 눌러 일지확인과 학생확인을 선택합니다.</div></div><div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px;">${renderAdminTeacherCards(todayStr)}</div></div>`;

    const nextWeek = new Date(todayTime + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE');
    const upcomingSchedules = (state.db.exam_schedules || []).filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeek).sort((a,b) => a.exam_date.localeCompare(b.exam_date));
    const adminScheduleHtml = `<div style="margin-bottom:24px;"><h3 style="margin:0 0 12px 2px; font-size:17px; font-weight:950; color:#1a1a1a;">주간일정</h3><div class="card" style="padding:0; overflow:hidden; border:none; border-radius:20px; box-shadow:0 6px 18px rgba(12,68,124,0.05); background:#fff;">${upcomingSchedules.length > 0 ? upcomingSchedules.map(e => { const d = new Date(e.exam_date); const dateLabel = `${d.getMonth()+1}월 ${d.getDate()}일`; const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:800;">${e.grade}</span> ` : '<span style="color:var(--secondary); font-weight:800;">학교공통</span> '; return `<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid #f1f3f4; font-size:13px; gap:10px;"><div><b>${e.school_name}</b> ${gradeLabel}${e.exam_name}</div><div style="color:var(--secondary); font-size:11px; white-space:nowrap;">${dateLabel}</div></div>`; }).join('') : '<div style="text-align:center; padding:22px; color:var(--secondary); font-size:13px; font-weight:800;">이번 주 예정된 일정이 없습니다.</div>'}</div></div>`;
    const riskRows = risks.slice(0, 5).map(r => `<div class="card" style="padding:14px 16px; border:none; border-radius:18px; margin-bottom:10px; background:#fff; box-shadow:0 6px 18px rgba(217,48,37,0.05); cursor:pointer;" onclick="renderStudentDetail('${r.student.id}')"><div style="display:flex; justify-content:space-between; align-items:center; gap:10px;"><div style="min-width:0;"><div style="font-weight:950; color:#1a1a1a; font-size:15px;">${r.student.name}</div><div style="font-size:12px; color:var(--secondary); font-weight:800; margin-top:3px;">${r.className} · ${r.reasons.slice(0,2).join(' · ')}</div></div><span style="font-size:12px; color:var(--error); font-weight:950; white-space:nowrap;">상세보기 ›</span></div></div>`).join('');
    const riskSectionHtml = `<div style="margin-bottom:40px;"><h3 style="margin:0 0 12px 2px; font-size:17px; font-weight:950; color:#d93025;">위험학생 ${risks.length}</h3>${risks.length > 0 ? riskRows : '<div style="text-align:center; padding:24px; color:var(--success); font-weight:900; background:#fff; border-radius:20px; box-shadow:0 6px 18px rgba(30,107,52,0.04);">현재 위험 징후를 보이는 학생이 없습니다.</div>'}</div>`;

    root.innerHTML = headerHtml + summaryHtml + teacherCardsHtml + adminScheduleHtml + riskSectionHtml;
    const scopeBtn = document.querySelector('header nav button');
    if (scopeBtn) scopeBtn.style.display = 'none';
}

function renderAdminStudentSearch() {
    const keyword = document.getElementById('admin-search-input').value.trim().toLowerCase();
    const resultArea = document.getElementById('admin-search-results');
    if (!keyword) { resultArea.innerHTML = '<div style="color:var(--secondary);">검색어를 입력하세요.</div>'; return; }
    
    const results = state.db.students.filter(s => s.name.toLowerCase().includes(keyword));
    if (results.length === 0) { resultArea.innerHTML = '<div style="color:var(--secondary);">일치하는 학생이 없습니다.</div>'; return; }
    
    resultArea.innerHTML = results.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:8px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div><b style="font-size:14px;">${s.name}</b> <span style="font-size:12px; color:var(--secondary);">${cName} | ${s.status}</span></div>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="renderStudentDetail('${s.id}')">상세</button>
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
        listRoot.innerHTML = '<div style="text-align:center; padding:20px; color:var(--secondary);">검색 결과가 없습니다.</div>';
        return;
    }
    
    listRoot.innerHTML = stds.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:12px 4px; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                    <div><b style="font-size:15px;">${s.name}</b> <span style="color:var(--secondary); font-size:12px;">${cName} | ${s.school_name} ${s.grade}</span></div>
                    <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--primary);" onclick="closeModal(); renderStudentDetail('${s.id}')">상세 ➔</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:12px; color:var(--secondary);">
                    <div style="display:flex; justify-content:space-between; background:#f8f9fa; padding:6px 10px; border-radius:6px;">
                        <span>학생: ${s.student_phone || '없음'}</span>
                        ${s.student_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.student_phone}')">복사</span>` : ''}
                    </div>
                    <div style="display:flex; justify-content:space-between; background:#f8f9fa; padding:6px 10px; border-radius:6px;">
                        <span>보호자(${s.guardian_relation || '미지정'}): ${s.parent_phone || '없음'}</span>
                        ${s.parent_phone ? `<span style="color:var(--primary); cursor:pointer; font-weight:700;" onclick="copyPhoneNumber('${s.parent_phone}')">복사</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openAddressBook() {
    // [Phase 4/5 픽스] teacher_name 필터 제거, initial-data에서 내려준 classes 그대로 사용
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    showModal('📒 주소록 및 학생 관리', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn" style="padding:8px; flex:1; font-size:11px;" onclick="closeModal(); openAddStudent();">👤 학생 추가</button>
            <button class="btn" style="padding:8px; flex:1; font-size:11px; color:var(--primary); border-color:var(--primary);" onclick="openGlobalPinManagement()">🔑 PIN관리</button>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="flex:1; text-align:left;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="flex:1;" onchange="renderAddressBookList()"><option value="">전체학급</option>${classOptions}</select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px;"></div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    // [Phase 4/5 픽스] teacher_name 필터 제거
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:12px; margin-bottom:6px;" onclick="handleBatchGeneratePins('${c.id}')">
            <span style="font-weight:bold;">${c.name}</span><span style="font-size:11px; color:var(--primary);">이 반 PIN 일괄 생성</span>
        </button>
    `).join('');
    
    showModal('🔑 PIN관리', `
        <div style="margin-bottom:12px; font-size:12px; color:var(--secondary); line-height:1.5;">선택한 반에 속한 학생 중, <b>아직 PIN 번호가 없는 학생</b>들에게만 고유 PIN을 자동 부여합니다. (기존 PIN은 유지됨)</div>
        <div style="max-height:60vh; overflow-y:auto;">${rows || '<div style="text-align:center; opacity:0.5; padding:20px;">관리할 반이 없습니다.</div>'}</div>
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
        <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div>
                <div style="font-weight:bold; font-size:14px; color:${c.is_active===0?'var(--secondary)':'var(--primary)'};">
                    ${c.name} <span style="font-size:11px; font-weight:normal; color:var(--secondary);">(${c.grade})</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); margin-top:4px;">담당: ${c.teacher_name} | 요일: ${formatClassScheduleDaysForUI(c.schedule_days)}</div>
                ${c.textbook ? `<div style="font-size:10px; color:#5f6368; margin-top:2px;">기존교재: ${c.textbook}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditClassModal('${c.id}')">수정</button>
                ${c.is_active === 0
                  ? `<button class="btn btn-primary" style="padding:4px 8px; font-size:11px;" onclick="toggleClassActive('${c.id}', 1)">복구</button>`
                  : `<button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="toggleClassActive('${c.id}', 0)">숨김</button>`
                }
            </div>
        </div>
    `;

    showModal('🏫 반 관리', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <button class="btn" style="padding:8px 14px; font-size:11px; color:var(--primary); border-color:var(--primary);" onclick="closeModal(); openTextbookManageModal();">📚 교재 관리</button>
            <button class="btn btn-primary" style="padding:8px 14px;" onclick="openAddClassModal()">➕ 새 반 추가</button>
        </div>
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--primary);">활성 반 (${activeClasses.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeClasses.length ? activeClasses.map(renderClassRow).join('') : '<div style="font-size:12px; color:var(--secondary);">활성 반이 없습니다.</div>'}
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
    showModal('➕ 새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left;">
            <select id="add-cls-grade" class="btn">
                <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left;">
            <input id="add-cls-teacher" class="btn" value="${state.ui.userName || '박준성'}" placeholder="담당 교사" style="text-align:left;">
            <input id="add-cls-textbook" class="btn" placeholder="기존 교재(호환용)" style="text-align:left;">
            
            <label style="font-size:12px; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="${i}" class="add-cls-days"> ${d}</label>`).join('')}
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
            <input id="edit-cls-name" class="btn" value="${c.name}" placeholder="반 이름" style="text-align:left;">
            <select id="edit-cls-grade" class="btn">
                ${['중1','중2','중3','고1','고2','고3'].map(g => `<option value="${g}" ${c.grade===g?'selected':''}>${g}</option>`).join('')}
            </select>
            <input id="edit-cls-subject" class="btn" value="${c.subject||''}" placeholder="과목" style="text-align:left;">
            <input id="edit-cls-teacher" class="btn" value="${c.teacher_name||''}" placeholder="담당 교사" style="text-align:left;">
            <input id="edit-cls-textbook" class="btn" value="${c.textbook || ''}" placeholder="기존 교재(호환용)" style="text-align:left;">
            <div style="font-size:10px; color:var(--secondary);">※ 다중 교재 관리는 '교재 관리' 메뉴를 이용하세요.</div>
            
            <label style="font-size:12px; color:var(--secondary); margin-top:8px;">수업 요일 (미선택 시 매일)</label>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                ${['일','월','화','수','목','금','토'].map((d,i)=>`<label style="cursor:pointer; font-size:13px;"><input type="checkbox" value="${i}" class="edit-cls-days" ${selectedDays.includes(String(i))?'checked':''}> ${d}</label>`).join('')}
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

// [Phase 4/5] 독립된 교재 관리 (class_textbooks 연동)
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
        if (isCompleted) statusBadge = '<span style="font-size:10px; background:#e6f4ea; color:#1e6b34; padding:2px 6px; border-radius:4px; font-weight:700;">완료</span>';
        else if (isHidden) statusBadge = '<span style="font-size:10px; background:#f1f3f4; color:var(--secondary); padding:2px 6px; border-radius:4px; font-weight:700;">숨김</span>';

        return `
            <div style="padding:12px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:bold; font-size:14px; color:${tb.status==='active' ? 'var(--primary)' : 'var(--secondary)'};">${tb.title} ${statusBadge}</div>
                    <div style="font-size:11px; color:var(--secondary); margin-top:4px;">${cName} | 시작: ${tb.start_date || '-'} ${tb.end_date ? `| 종료: ${tb.end_date}` : ''}</div>
                </div>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditTextbookModal('${tb.id}')">관리</button>
            </div>
        `;
    };

    listRoot.innerHTML = `
        <h4 style="margin:0 0 8px 0; font-size:13px; color:var(--primary);">현재 사용 중인 교재 (${activeBooks.length})</h4>
        <div style="margin-bottom:20px;">
            ${activeBooks.length ? activeBooks.map(renderTbRow).join('') : '<div style="font-size:12px; color:var(--secondary); padding:10px 0;">사용 중인 교재가 없습니다.</div>'}
        </div>
        ${inactiveBooks.length ? `
            <h4 style="margin:20px 0 8px 0; font-size:13px; color:var(--secondary);">완료 / 숨김 교재 (${inactiveBooks.length})</h4>
            <div style="opacity:0.7;">${inactiveBooks.map(renderTbRow).join('')}</div>
        ` : ''}
    `;
}

function openTextbookManageModal() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    
    showModal('📚 학급교재', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <select id="tb-manage-class" class="btn" style="flex:1; margin-right:8px;" onchange="renderTextbookManageList()">
                <option value="">전체학급 (내 담당)</option>
                ${classOptions}
            </select>
            <button class="btn btn-primary" style="padding:8px 14px;" onclick="openAddTextbookModal()">➕ 새 교재 등록</button>
        </div>
        <div id="tb-manage-list" style="max-height:60vh; overflow-y:auto; padding-right:5px;"></div>
    `);
    renderTextbookManageList();
}

function openAddTextbookModal() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('➕ 새 교재 등록', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="new-tb-class" class="btn"><option value="">반을 선택하세요</option>${classOptions}</select>
            <input id="new-tb-title" class="btn" placeholder="교재명 (예: 개념원리 중1-1)" style="text-align:left;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="new-tb-start" class="btn" value="${todayStr}" style="flex:1;">
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
    } else toast('저장실패', 'error');
}

function openEditTextbookModal(tbId) {
    const tb = state.db.class_textbooks.find(x => x.id === tbId);
    if (!tb) return;
    
    const isCompleted = tb.status === 'completed';
    const isHidden = tb.status === 'hidden';
    
    showModal('📝 교재 관리', `
        <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:16px;">
            <input id="edit-tb-title" class="btn" value="${tb.title}" style="text-align:left;">
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; color:var(--secondary); min-width:50px;">시작일:</span>
                <input type="date" id="edit-tb-start" class="btn" value="${tb.start_date || ''}" style="flex:1;">
            </div>
            ${isCompleted || tb.end_date ? `
            <div style="display:flex; gap:8px; align-items:center;">
                <span style="font-size:12px; color:var(--secondary); min-width:50px;">종료일:</span>
                <input type="date" id="edit-tb-end" class="btn" value="${tb.end_date || ''}" style="flex:1;">
            </div>` : ''}
            <button class="btn btn-primary" style="margin-top:4px; padding:10px;" onclick="handlePatchTextbook('${tbId}', false)">정보 수정 저장</button>
        </div>
        <div style="border-top:1px solid var(--border); padding-top:16px; display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:12px; color:var(--secondary); margin-bottom:4px;">상태 변경</div>
            <div style="display:flex; gap:8px;">
                ${isCompleted || isHidden 
                    ? `<button class="btn" style="flex:1; padding:10px; font-size:12px;" onclick="handlePatchTextbook('${tbId}', true, 'active')">🔄 진행중으로 복구</button>`
                    : `<button class="btn" style="flex:1; padding:10px; font-size:12px; color:var(--success); border-color:var(--success);" onclick="handlePatchTextbook('${tbId}', true, 'completed')">✅ 교재 완료 처리</button>
                       <button class="btn" style="flex:1; padding:10px; font-size:12px;" onclick="handlePatchTextbook('${tbId}', true, 'hidden')">👀 숨김 (보류)</button>`
                }
            </div>
            <button class="btn" style="margin-top:12px; padding:10px; font-size:12px; color:var(--error); border-color:var(--error);" onclick="handleDeleteTextbook('${tbId}')">🗑️ 이 교재 완전 삭제</button>
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
        toast('저장완료', 'success');
        await loadData();
        openTextbookManageModal();
    } else toast('저장실패', 'error');
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
        <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; ${m.is_done ? 'opacity:0.5;' : ''}">
            <div style="flex:1;">
                <div style="font-size:11px; color:var(--secondary); margin-bottom:4px;">${m.memo_date} ${m.is_pinned ? '<span style="color:var(--primary); font-weight:bold;">📌 고정</span>' : ''}</div>
                <div style="font-size:14px; text-decoration:${m.is_done ? 'line-through' : 'none'};">${m.content}</div>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn ${m.is_done ? '' : 'btn-primary'}" style="padding:4px 8px; font-size:11px;" onclick="toggleMemoDone('${m.id}', ${!m.is_done})">${m.is_done ? '취소' : '완료'}</button>
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditTodoMemoModal('${m.id}')">수정</button>
                <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="deleteMemo('${m.id}')">삭제</button>
            </div>
        </div>
    `).join('');

    showModal('📝 할 일 관리', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1;">
                <label style="font-size:13px; display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="new-memo-pin"> 📌 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="할 일 입력 (예: 고2 시험대비 직전보강)" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:40vh; overflow-y:auto;">
            ${memos.length ? memoRows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">등록된 할 일이 없습니다.</div>'}
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
    showModal('📝 할 일 메모 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="edit-memo-date" class="btn" value="${m.memo_date}" style="text-align:left; flex:1;">
                <label style="font-size:13px; display:flex; align-items:center; gap:4px; white-space:nowrap;">
                    <input type="checkbox" id="edit-memo-pin" ${m.is_pinned ? 'checked' : ''}> 📌 고정
                </label>
            </div>
            <input type="text" id="edit-memo-content" class="btn" value="${m.content}" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="handleEditTodoMemo('${id}')">수정 저장</button>
            <button class="btn" style="padding:8px; font-size:12px;" onclick="openTodoMemoModal()">취소 및 목록으로</button>
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
        <div style="padding:10px 0; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="flex:1;">
                <div style="font-size:11px; color:var(--secondary); margin-bottom:4px;">${e.exam_date} | ${e.school_name} ${e.grade}</div>
                <div style="font-size:14px; font-weight:bold;">${e.exam_name}</div>
                ${e.memo ? `<div style="font-size:12px; color:var(--secondary); margin-top:2px;">${e.memo}</div>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="openEditExamScheduleModal('${e.id}')">수정</button>
                <button class="btn" style="padding:4px 8px; font-size:11px; color:var(--error); border-color:var(--border);" onclick="deleteExamSchedule('${e.id}')">삭제</button>
            </div>
        </div>
    `).join('');

    showModal('📅 시험일정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-school" class="btn" placeholder="학교명" style="flex:1; text-align:left;">
                <select id="new-ex-grade" class="btn" style="flex:1;">
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="new-ex-name" class="btn" placeholder="시험명 (예: 기말고사)" style="flex:1; text-align:left;">
                <input type="date" id="new-ex-date" class="btn" style="flex:1;">
            </div>
            <input type="text" id="new-ex-memo" class="btn" placeholder="메모 (선택)" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="addExamSchedule()">저장</button>
        </div>
        <div style="max-height:40vh; overflow-y:auto;">
            ${schedules.length ? rows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">시험일정이 없습니다</div>'}
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
    showModal('📅 시험일정 수정', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-school" class="btn" value="${e.school_name}" style="flex:1; text-align:left;">
                <select id="edit-ex-grade" class="btn" style="flex:1;">
                    <option value="중1" ${e.grade==='중1'?'selected':''}>중1</option>
                    <option value="중2" ${e.grade==='중2'?'selected':''}>중2</option>
                    <option value="중3" ${e.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${e.grade==='고1'?'selected':''}>고1</option>
                    <option value="고2" ${e.grade==='고2'?'selected':''}>고2</option>
                    <option value="고3" ${e.grade==='고3'?'selected':''}>고3</option>
                </select>
            </div>
            <div style="display:flex; gap:8px;">
                <input type="text" id="edit-ex-name" class="btn" value="${e.exam_name}" style="flex:1; text-align:left;">
                <input type="date" id="edit-ex-date" class="btn" value="${e.exam_date}" style="flex:1;">
            </div>
            <input type="text" id="edit-ex-memo" class="btn" value="${e.memo||''}" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="handleEditExamSchedule('${id}')">수정 저장</button>
            <button class="btn" style="padding:8px; font-size:12px;" onclick="openExamScheduleModal()">취소 및 목록으로</button>
        </div>
    `);
}

async function handleEditExamSchedule(id) {
    const sc = document.getElementById('edit-ex-school').value.trim();
    const gr = document.getElementById('edit-ex-grade').value;
    const na = document.getElementById('edit-ex-name').value.trim();
    const da = document.getElementById('edit-ex-date').value;
    const me = document.getElementById('edit-ex-memo').value.trim();
    if(!sc || !na || !da) return toast('필수 항목을 입력하세요', 'warn');
    
    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { 
        toast('저장완료', 'info');
        await loadData(); 
        openExamScheduleModal(); 
    } else {
        toast('저장실패', 'error');
    }
}

// [Phase 4/5] 4대 액션 중 '시험시험성적'의 글로벌 진입점 (teacher_name 필터 제거)
function openGlobalExamGradeView() {
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px;" onclick="closeModal(); if(typeof openExamGradeView==='function') openExamGradeView('${c.id}')">
            <span style="font-weight:bold; color:var(--primary);">${c.name}</span>
            <span style="font-size:12px; color:var(--secondary);">${c.grade}</span>
        </button>
    `).join('');
    showModal('📊 전체 반별 시험시험성적', `
        <div style="margin-bottom:12px; font-size:12px; color:var(--secondary);">조회할 반을 선택하세요.</div>
        <div style="max-height:60vh; overflow-y:auto;">${rows || '<div style="text-align:center; opacity:0.5; padding:20px;">담당 반이 없습니다.</div>'}</div>
    `);
}

function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncStatusText = qLen > 0 ? `대기 ${qLen}건` : '대기 없음';
    const onlineStatusText = isOnline ? '온라인' : '오프라인';

    showModal('⚙️ 운영메뉴', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:14px; font-weight:900; border-radius:16px; background:#fff; border:1px solid var(--border);" onclick="closeModal(); openClassManageModal();">🏫 학급교재</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:14px; font-weight:900; border-radius:16px; background:#fff; border:1px solid var(--border);" onclick="closeModal(); openAddressBook();">👥 학생관리</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:14px; font-weight:900; border-radius:16px; background:#fff; border:1px solid var(--border);" onclick="closeModal(); openExamScheduleModal();">📅 시험일정</button>
            <button class="btn" style="width:100%; justify-content:flex-start; padding:16px; font-size:14px; font-weight:900; border-radius:16px; background:#fff; border:1px solid var(--border);" onclick="closeModal(); openDischargedStudents();">🗄️ 퇴원생</button>
            <div style="margin-top:6px; padding:16px; border-radius:16px; background:#f8f9fa; border:1px dashed var(--border);">
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;"><span>네트워크</span><b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b></div>
                <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:12px;"><span>미전송 데이터</span><b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b></div>
                <button class="btn btn-primary" style="width:100%; font-size:12px; padding:10px; border-radius:12px;" onclick="if(typeof processSyncQueue==='function') processSyncQueue(); closeModal();">지금 동기화</button>
            </div>
        </div>
    `);
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
    
    // 결석자만 체크 (나머진 다 등원)
    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && scheduledIds.has(a.student_id)).length;
    const presentCount = scheduledActiveStudents.length - absentCount;
    
    // 숙제 미완료자만 체크 (나머진 다 완료)
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
    const attRate = Math.round((s.present / n) * 100);
    const hwRate = Math.round(((n - s.hwNotDone) / n) * 100);
    
    if (!s.isScheduled) {
        return `
            <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 120px; padding: 16px; opacity:0.8;">
                <div>
                    <div style="font-weight:800; font-size:17px; display:flex; justify-content:space-between;">
                        ${cls.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary);">재원 ${s.activeCount}</span>
                    </div>
                </div>
                <div style="margin-top:16px; font-size:13px; color:var(--secondary); text-align:center; background:#f8f9fa; padding:8px; border-radius:6px;">
                    오늘 수업 없음
                </div>
            </div>
        `;
    }

    return `
        <div class="card" onclick="renderClass('${cls.id}')" style="cursor:pointer; margin-bottom:0; display:flex; flex-direction:column; justify-content:space-between; min-height: 120px; padding: 16px;">
            <div>
                <div style="font-weight:800; font-size:17px; display:flex; justify-content:space-between;">
                    ${cls.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary);">재원 ${s.activeCount}</span>
                </div>
                <div style="font-size:13px; color:var(--secondary); margin-top:6px;">
                    등원 ${s.present} <span style="opacity:0.3;">|</span> <span style="color:${s.absent > 0 ? 'var(--error)' : 'inherit'}; font-weight:${s.absent > 0 ? '700' : 'normal'};">결석 ${s.absent}</span>
                </div>
            </div>
            <div style="display:flex; gap:6px; margin-top:10px;">
                <span style="background:${s.hwNotDone > 0 ? '#fef7e0' : '#f1f3f4'}; color:${s.hwNotDone > 0 ? '#b06000' : '#5f6368'}; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">숙제 미완료 ${s.hwNotDone}</span>
            </div>
            <div style="margin-top:8px; font-size:11px; color:var(--secondary); opacity:0.75;">
                출석 ${attRate}% · 숙제 ${hwRate}%
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
        <div style="padding:10px 4px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
            <div style="display:flex; align-items:center; gap:10px; flex:1;">
                <input type="checkbox" onchange="toggleMemoDone('${m.id}', this.checked)" style="transform:scale(1.2);">
                <span style="font-size:14px; ${m.is_pinned ? 'font-weight:bold; color:var(--primary);' : ''}">${m.is_pinned ? '📌 ' : ''}${m.content}</span>
            </div>
        </div>
    `).join('') : '<div style="font-size:12px; color:var(--secondary); padding:10px 4px;">오늘 등록된 할 일이 없습니다.</div>';

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
                return `<div style="padding:8px 4px; font-size:13px; color:#b06000; border-bottom:1px solid var(--border);">[시험] ${e.school_name} ${e.grade} ${e.exam_name} <b style="margin-left:4px; font-size:11px; background:#fef7e0; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            } else {
                return `<div style="padding:8px 4px; font-size:13px; color:var(--secondary); border-bottom:1px solid var(--border);">${u.item.content} <b style="margin-left:4px; font-size:11px; background:#f1f3f4; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            }
        }).join('');
    }

    return `
        <div style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 style="margin:0; font-size:16px;">📝 오늘일정</h3>
            </div>
            <div class="card" style="margin-bottom:16px; padding:8px 12px;">${todayHtml}</div>
            
            ${upcomingHtml ? `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h3 style="margin:0; font-size:15px; color:var(--secondary);">📅 주간일정</h3>
                </div>
                <div class="card" style="padding:8px 12px;">${upcomingHtml}</div>
            ` : ''}
        </div>
    `;
}

// [Phase 4/5] 대시보드 렌더링 로직 (4대 액션 고정 & 예외 현황)
function renderDashboard() {
    state.ui.currentClassId = null;
    if (typeof renderAppDrawer === 'function') renderAppDrawer();
    const data = computeDashboardData();
    const closeData = typeof computeTodayCloseData === 'function' ? computeTodayCloseData() : { totalActive:0, absents:[], hwMisses:[], allClear:true };
    const root = document.getElementById('app-root');
    const teacherName = typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당');

    const appHeader = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px; padding:2px 2px 0;">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                <button class="btn" style="width:44px; height:44px; padding:0; font-size:20px; border:none; border-radius:14px; background:#fff; box-shadow:0 4px 14px rgba(12,68,124,0.08); line-height:1;" onclick="openAppDrawer()">☰</button>
                <div style="min-width:0;">
                    <div style="font-size:20px; font-weight:950; color:#1a1a1a; letter-spacing:-0.6px; line-height:1.2;">AP Math OS</div>
                    <div style="font-size:13px; font-weight:800; color:var(--secondary); margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${teacherName} 선생님</div>
                </div>
            </div>
            <div style="font-size:11px; font-weight:900; color:#0C447C; background:#E6F1FB; padding:7px 10px; border-radius:999px; white-space:nowrap;">수업운영</div>
        </div>
    `;

    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncWarning = qLen > 0
        ? `<div style="background:#fce8e6; color:#c5221f; padding:11px 14px; border-radius:16px; font-size:12px; font-weight:900; margin-bottom:14px; text-align:center; border:1px solid #f9d2ce;">⚠️ 동기화 대기 ${qLen}건</div>`
        : '';

    const buildSummaryBadges = (list) => {
        if(list.length === 0) return '';
        const group = list.reduce((acc, cur) => { acc[cur.className] = (acc[cur.className]||0)+1; return acc; }, {});
        const keys = Object.keys(group);
        let str = keys.slice(0, 2).map(k => `${k} ${group[k]}`).join(' · ');
        if(keys.length > 2) str += ` 외 ${keys.length - 2}개 반`;
        return `<span style="font-size:11px; background:#fff; padding:3px 7px; border-radius:7px; margin-left:4px; color:#7a4f00;">${str}</span>`;
    };

    const closeBanner = closeData.totalActive === 0
        ? `${syncWarning}<div style="display:flex; align-items:center; gap:12px; background:#fff; border:1px solid rgba(12,68,124,0.06); border-radius:20px; padding:16px; margin-bottom:18px; color:var(--secondary); box-shadow:0 6px 18px rgba(12,68,124,0.05);"><span style="font-size:28px;">☕</span><div><b style="color:#1a1a1a; font-size:15px;">오늘은 예정된 정규 수업이 없습니다.</b><br><span style="font-size:12px;">사이드바에서 필요한 운영 기능을 확인하세요.</span></div></div>`
        : closeData.allClear
            ? `${syncWarning}<div style="display:flex; align-items:center; gap:12px; background:#E8F7EE; border:1px solid #C7EBD3; border-radius:20px; padding:16px; margin-bottom:18px; color:#1e6b34; box-shadow:0 6px 18px rgba(30,107,52,0.06);"><span style="font-size:28px;">✅</span><div><b style="font-size:15px;">오늘 수업 예외사항 없음</b><br><span style="font-size:12px; font-weight:700; opacity:0.9;">전원 출석 및 전원 숙제 완료</span></div></div>`
            : `${syncWarning}<div onclick="if(typeof openTodayCloseModal==='function') openTodayCloseModal('att')" style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#FFF8E1; border:1px solid #F9E0A1; border-radius:20px; padding:16px; margin-bottom:18px; cursor:pointer; box-shadow:0 6px 18px rgba(249,171,0,0.08);"><div style="display:flex; align-items:flex-start; gap:12px; min-width:0;"><span style="font-size:28px; line-height:1;">📋</span><div style="font-size:13px; color:#7a4f00; line-height:1.55;"><b style="font-size:15px;">오늘 수업 예외 현황</b><br>결석 <b>${closeData.absents.length}</b>명 ${buildSummaryBadges(closeData.absents)}<br>숙제 미완료 <b>${closeData.hwMisses.length}</b>명 ${buildSummaryBadges(closeData.hwMisses)}</div></div><span style="font-size:22px; color:#f9ab00; font-weight:900;">›</span></div>`;

    const todoSections = renderTodoSections();
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin:4px 2px 12px;">
            <div>
                <h3 style="margin:0; font-size:18px; font-weight:950; color:#1a1a1a; letter-spacing:-0.4px;">학급관리</h3>
                <div style="font-size:12px; font-weight:800; color:var(--secondary); margin-top:3px;">오늘 수업 처리와 반별 현황</div>
            </div>
        </div>
        <div class="grid" style="margin-bottom:40px; display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:12px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
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

// [Phase 4/5 픽스] 모달 탭명 변경 및 결석/미완료 리스트 표시
function openTodayCloseModal(tab = 'att') {
    const d = computeTodayCloseData();

    const tabs = [
        { key: 'att',  label: `결석 학생 ${d.absents.length}`,  list: d.absents,  emptyMsg: '결석자 없음 ✅' },
        { key: 'hw',   label: `숙제 미완료 ${d.hwMisses.length}`, list: d.hwMisses, emptyMsg: '미완료자 없음 ✅' }
    ];
    const cur = tabs.find(t => t.key === tab) || tabs[0];

    const tabBtns = tabs.map(t => `
        <button onclick="openTodayCloseModal('${t.key}')" style="
            flex:1; padding:10px 4px; border:none; border-radius:8px; font-size:12px; font-weight:700;
            background:${t.key === tab ? 'var(--primary)' : '#f1f3f4'};
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
            const classHeader = `<div style="background:#f1f3f4; padding:6px 10px; font-size:12px; font-weight:bold; color:var(--secondary); margin-top:8px; border-radius:4px;">${cName}</div>`;
            const studentRows = grouped[cName].map(s => {
                let actionBtns = '';
                if (tab === 'att') {
                    actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleAtt('${s.id}', '등원', '${tab}')">✅ 등원 (취소)</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--error); border-color:var(--error); cursor:default;">❌ 결석됨</button></div>`;
                } else if (tab === 'hw') {
                    actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleHw('${s.id}', '완료', '${tab}')">✅ 완료 (취소)</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--warning); border-color:var(--warning); cursor:default;">⚠️ 미완료됨</button></div>`;
                }
                return `
                    <div style="padding:14px 4px; border-bottom:1px solid var(--border);">
                        <div style="display:flex; justify-content:space-between; align-items:center;">
                            <div onclick="closeModal();renderStudentDetail('${s.id}')" style="cursor:pointer; flex:1;">
                                <span style="font-weight:700; font-size:15px;">${s.name}</span>
                            </div>
                            <span onclick="closeModal();renderStudentDetail('${s.id}')" style="font-size:12px; color:var(--primary); cursor:pointer;">→ 프로필</span>
                        </div>
                        ${actionBtns}
                    </div>`;
            }).join('');
            return classHeader + studentRows;
        }).join('')
        : `<div style="padding:32px 16px; text-align:center; color:var(--success); font-weight:700; font-size:14px;">${cur.emptyMsg}</div>`;

    showModal('📋 오늘 예외 현황', `<div style="display:flex; gap:6px; margin-bottom:16px;">${tabBtns}</div><div>${rows}</div>`);
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
    showModal('⚙️ 오늘 시험 설정', `<div style="display:flex; flex-direction:column; gap:12px;"><p style="margin:0; font-size:13px; color:var(--secondary);">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</p><div style="display:flex; gap:4px; flex-wrap:wrap; margin:6px 0;"><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button></div><input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%;"><input id="set-exam-q" type="number" class="btn" placeholder="문항 수" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%;"><div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; min-width:120px; padding:12px;" onclick="handleSetTodayExam()">저장 및 적용</button><button class="btn" style="flex:1; min-width:120px; padding:12px; color:var(--error); border-color:var(--error);" onclick="clearTodayExamConfig(); closeModal();">시험 없음 처리</button></div></div>`);
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

// [Phase 4/5 픽스] 날짜를 인자로 받아 해당 날짜의 일지를 생성
function buildJournalContent(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    let text = `[AP Math 운영 일지 - ${targetDate}]\n작성자: ${state.ui.userName}\n\n`;

    // 날짜 무관하게 해당 선생님의 반을 불러옴
    const activeClasses = state.db.classes.filter(c => c.is_active !== 0);

    if (activeClasses.length === 0) {
        text += `✅ 담당 학급이 없습니다.\n`;
        return text;
    }

    activeClasses.forEach(cls => {
        text += `■ ${cls.name}반\n`;

        // 1. 출결 / 숙제 수집 (해당 날짜 기준)
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

        // 2. 수업 기록 수집 (해당 날짜 기준 DB 연동)
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

        // 3. 상담 내역 수집
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

// [Phase 4/5 픽스] 날짜 선택 기능 추가
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
            <button class="btn" style="flex:1; padding:12px;" onclick="saveJournal('작성중', null, '${targetDate}')">💾 임시 저장</button>
            <button class="btn btn-primary" style="flex:1; padding:12px;" onclick="saveJournal('제출완료', null, '${targetDate}')">🚀 원장님께 제출</button>
        `;
    } else if (status === '제출완료') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:12px; color:var(--error); border-color:var(--error);" onclick="saveJournal('작성중', '${myJournal.id}', '${targetDate}')">↩️ 제출 취소 및 수정</button>
        `;
    }

    showModal(`📝 일지 작성 및 제출`, `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; background:#f8f9fa; padding:8px; border-radius:8px; border:1px solid var(--border);">
            <b style="font-size:13px; color:var(--primary);">작성 기준일:</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left;" onchange="openDailyJournalModal(this.value)">
        </div>
        ${status === '결재완료' ? `
            <div style="background:#e6f4ea; border:1px solid #a8d5b5; color:#1e6b34; padding:12px; border-radius:8px; margin-bottom:12px;">
                <b style="display:flex; align-items:center; gap:6px;"><span style="font-size:18px;">✅</span> 원장님 결재 완료</b>
                ${myJournal.feedback ? `<div style="margin-top:8px; font-size:13px; background:white; padding:8px; border-radius:4px;"><b>원장님 코멘트:</b><br>${apEscapeHtml(myJournal.feedback)}</div>` : ''}
            </div>
        ` : ''}
        <textarea id="journal-content" class="btn" style="width:100%; height:230px; text-align:left; resize:vertical; font-family:inherit; font-size:13px; line-height:1.6;" ${isLocked ? 'readonly' : ''}>${content}</textarea>
        <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
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

    if (!result || result.error) return toast(result?.error || '일지 저장실패', 'error');

    toast(`${targetDate} 일지가 ${status} 처리되었습니다.`, 'success');
    closeModal();
    await loadData();
}

function renderAdminJournalList(dateStr, teacherName = '') {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const safeTeacher = String(teacherName || '').replace(/'/g, "\\'");
    let journals = (state.db.journals || []).filter(j => j.date === targetDate && j.status !== '작성중');
    if (teacherName) journals = journals.filter(j => j.teacher_name === teacherName);
    const title = teacherName ? `${teacherName} 선생님 일지확인` : '일지확인';
    const backBtn = teacherName ? `<button class="btn" style="width:100%; margin-bottom:12px; padding:12px; border-radius:14px; font-weight:900;" onclick="openAdminTeacherPanel('${safeTeacher}')">← 선생님 메뉴</button>` : '';
    const rows = journals.map(j => {
        const teacherArg = String(teacherName || j.teacher_name || '').replace(/'/g, "\\'");
        const statusText = j.status === '결재완료' ? '확인완료' : j.status;
        return `<div class="card" style="padding:14px; margin-bottom:10px; cursor:pointer; border:none; border-radius:18px; box-shadow:0 6px 18px rgba(12,68,124,0.05); background:#fff;" onclick="openAdminJournalFeedback('${j.id}', '${teacherArg}')"><div style="display:flex; justify-content:space-between; margin-bottom:8px; gap:8px; align-items:center;"><b style="font-size:15px; color:#1a1a1a;">${apEscapeHtml(j.teacher_name)} 선생님</b><span style="font-size:11px; font-weight:950; color:${j.status === '결재완료' ? 'var(--success)' : 'var(--primary)'}; background:${j.status === '결재완료' ? '#e6f4ea' : '#e8f0fe'}; padding:4px 8px; border-radius:8px;">${apEscapeHtml(statusText)}</span></div><div style="font-size:12px; color:var(--secondary); white-space:pre-wrap; max-height:58px; overflow:hidden; line-height:1.55;">${apEscapeHtml(j.content)}</div></div>`;
    }).join('');
    showModal(`📑 ${apEscapeHtml(title)}`, `${backBtn}<div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; background:#f8f9fa; padding:10px; border-radius:14px; border:1px solid var(--border);"><b style="font-size:13px; color:var(--primary); white-space:nowrap;">기준일</b><input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border-radius:10px;" onchange="renderAdminJournalList(this.value, '${safeTeacher}')"></div><div style="max-height:55vh; overflow-y:auto;">${journals.length ? rows : '<div style="text-align:center; opacity:0.55; padding:28px; font-weight:800; background:#f8f9fa; border-radius:18px;">해당 날짜에 제출된 일지가 없습니다.</div>'}</div>`);
}

function openAdminJournalFeedback(id, teacherName = '') {
    const journal = (state.db.journals || []).find(j => j.id === id);
    if (!journal) return toast('일지를 찾을 수 없습니다.', 'warn');
    const safeTeacher = String(teacherName || journal.teacher_name || '').replace(/'/g, "\\'");
    showModal(`${apEscapeHtml(journal.teacher_name)} 선생님 일지확인`, `<textarea readonly class="btn" style="width:100%; height:180px; text-align:left; resize:vertical; font-size:13px; line-height:1.65; background:#f8f9fa; border-radius:16px; padding:14px;">${journal.content}</textarea><textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; margin-top:12px; border-radius:16px; padding:14px;">${journal.feedback || ''}</textarea><div style="margin-top:12px;"><button class="btn btn-primary" style="width:100%; padding:14px; border-radius:16px; font-weight:950;" onclick="approveJournal('${journal.id}', '${journal.date}', '${safeTeacher}')">확인완료</button></div>`);
}

function approveJournal(id, dateStr, teacherName = '') {
    const feedback = document.getElementById('journal-feedback')?.value.trim() || '';
    return api.patch(`daily-journals/${id}`, { feedback }).then(async result => {
        if (!result || result.error) return toast(result?.error || '저장실패', 'error');
        toast('저장완료', 'success');
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
    if (!teacherNames.length) return '<div style="text-align:center; padding:22px; color:var(--secondary); font-weight:800; background:#fff; border-radius:18px;">등록된 선생님이 없습니다.</div>';
    const avatarColors = ['#E6F1FB:#0C447C', '#E1F5EE:#085041', '#EEEDFE:#3C3489', '#FAEEDA:#633806', '#FBEAF0:#72243E'];
    return teacherNames.map((tName, idx) => {
        const colors = avatarColors[idx % avatarColors.length].split(':');
        const myClasses = teacherMap[tName];
        const myClassIds = myClasses.map(c => String(c.id));
        const myStudentIds = [...new Set(state.db.class_students.filter(m => myClassIds.includes(String(m.class_id))).map(m => String(m.student_id)))];
        const activeStudentCount = state.db.students.filter(s => myStudentIds.includes(String(s.id)) && s.status === '재원').length;
        const log = (state.db.journals || []).find(j => j.date === todayStr && j.teacher_name === tName && j.status !== '작성중');
        const journalStatus = log ? (log.status === '결재완료' ? '확인완료' : '제출완료') : '미제출';
        const statusColor = log ? (log.status === '결재완료' ? 'var(--success)' : 'var(--primary)') : 'var(--secondary)';
        const safeName = String(tName).replace(/'/g, "\\'");
        return `<div class="card" onclick="openAdminTeacherPanel('${safeName}')" style="cursor:pointer; padding:18px; margin:0; border:none; border-radius:22px; background:#fff; box-shadow:0 8px 24px rgba(12,68,124,0.06);"><div style="display:flex; align-items:center; gap:13px; margin-bottom:14px;"><div style="width:48px; height:48px; border-radius:17px; background:${colors[0]}; color:${colors[1]}; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:950; flex-shrink:0;">${tName.charAt(0)}</div><div style="min-width:0; flex:1;"><div style="font-size:16px; font-weight:950; color:#1a1a1a; line-height:1.2;">${apEscapeHtml(tName)} 선생님</div><div style="font-size:12px; color:var(--secondary); font-weight:800; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">반 ${myClasses.length}개 · 학생 ${activeStudentCount}명</div></div></div><div style="display:flex; justify-content:space-between; align-items:center; gap:8px; background:#f8f9fa; border-radius:14px; padding:10px 12px;"><span style="font-size:12px; color:var(--secondary); font-weight:900;">오늘 일지</span><span style="font-size:12px; color:${statusColor}; font-weight:950;">${journalStatus}</span></div></div>`;
    }).join('');
}

function openAdminTeacherPanel(teacherName) {
    state.ui.currentAdminTeacherName = teacherName;
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    showModal(`${apEscapeHtml(teacherName)} 선생님`, `<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;"><button class="btn btn-primary" style="padding:18px 8px; font-size:14px; font-weight:950; border-radius:18px; min-height:86px; display:flex; flex-direction:column; gap:8px; align-items:center; justify-content:center;" onclick="closeModal(); renderAdminJournalList(new Date().toLocaleDateString('sv-SE'), '${safeName}')"><span style="font-size:24px;">📑</span>일지확인</button><button class="btn" style="padding:18px 8px; font-size:14px; font-weight:950; border-radius:18px; min-height:86px; display:flex; flex-direction:column; gap:8px; align-items:center; justify-content:center; background:#f8f9fa; border:1px solid var(--border);" onclick="closeModal(); renderAdminTeacherStudents('${safeName}')"><span style="font-size:24px;">👥</span>학생확인</button></div>`);
}

function renderAdminTeacherStudents(teacherName) {
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    const myClasses = state.db.classes.filter(c => String(c.teacher_name || '담당').trim() === teacherName && c.is_active !== 0);
    let html = `<button class="btn" style="width:100%; margin-bottom:12px; padding:12px; border-radius:14px; font-weight:900;" onclick="openAdminTeacherPanel('${safeName}')">← 선생님 메뉴</button><div style="max-height:60vh; overflow-y:auto; display:flex; flex-direction:column; gap:12px;">`;
    if (!myClasses.length) html += '<div style="text-align:center; padding:28px; color:var(--secondary); font-weight:800; background:#f8f9fa; border-radius:18px;">담당 학급 또는 재원생이 없습니다.</div>';
    else myClasses.forEach(cls => { const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id)); const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원'); html += `<div style="background:#fff; border:1px solid var(--border); border-radius:18px; overflow:hidden;"><div style="padding:12px 14px; background:#f8f9fa; font-weight:950; color:#1a1a1a; display:flex; justify-content:space-between;"><span>${apEscapeHtml(cls.name)}</span><span style="font-size:12px; color:var(--secondary);">${stds.length}명</span></div>${stds.length ? stds.map(s => `<div style="padding:12px 14px; border-top:1px solid #f1f3f4; display:flex; justify-content:space-between; align-items:center; gap:8px;"><div><b>${apEscapeHtml(s.name)}</b><span style="font-size:12px; color:var(--secondary); margin-left:6px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div><button class="btn" style="padding:6px 10px; font-size:11px; border-radius:10px;" onclick="closeModal(); renderStudentDetail('${s.id}')">상세보기</button></div>`).join('') : '<div style="padding:16px; color:var(--secondary); font-size:12px;">재원생이 없습니다.</div>'}</div>`; });
    html += '</div>';
    showModal(`${apEscapeHtml(teacherName)} 선생님 학생확인`, html);
}

