/**
 * AP Math OS v26.1.2 [js/dashboard.js]
 * 대시보드 및 원장 전용 학원 운영센터 (5G Phase 3 - 운영센터 심화 및 모바일 최적화)
 * Phase 4/5: 메인 4대 액션 재배치, 예외 정책 통계 보정, 일지 날짜 선택 지원 및 필터 오류 수정
 * [2026-04-28 2차 보정]: 교사명 헬퍼 폴백 보강, 새 반 추가 하드코딩 제거, 일지 중등부/수업일 판정 및 문구 정밀화
 */

// [수정] 교사명 표시 우선순위 헬퍼
function getTeacherNameForUI() {
    const session = typeof getSession === 'function' ? getSession() : null;
    let name = state.ui?.userName || state.auth?.name || session?.name || '';
    name = String(name || '').trim();
    if (!name || name === '선생님1') return '담당';
    return name;
}

// [수정] 특정 날짜의 요일 기준 수업 여부 판정 헬퍼
function isClassScheduledOnDate(clsId, dateStr) {
    const cls = state.db.classes.find(c => String(c.id) === String(clsId));
    if (!cls || !cls.schedule_days) return true; // 설정 없으면 매일 수업으로 간주
    const dayIdx = String(new Date(dateStr).getDay());
    return cls.schedule_days.split(',').includes(dayIdx);
}

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
                if (exams[0].score < exams[1].score && exams[1].score < exams[2].score) { scoreRisk = true; reasons.push(`성적 2회 연속 하락`); }
            }
            if (scoreRisk) riskTypes.push('성적위험');
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

// [수정] 원장 화면에 이번 주 일정 추가 반영
function renderAdminControlCenter() {
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = new Date(todayStr).getTime();
    
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const dischargedStudents = state.db.students.filter(s => s.status === '제적');
    const newStudents = activeStudents.filter(s => { if (!s.created_at) return false; return (todayTime - new Date(s.created_at).getTime()) / (1000*3600*24) <= 30; });
    const risks = computeRiskStudents();

    const summaryHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0; font-size:18px;">🏢 학원 운영센터</h3>
            <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="openAdminJournalList(new Date().toLocaleDateString('sv-SE'))">📑 일지 결재함</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:10px; margin-bottom:28px;">
            <div class="card" onclick="openAdminStudentList('active')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border-bottom:3px solid var(--primary);"><div style="font-size:22px; font-weight:900;">${activeStudents.length}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">총 재원생</div></div>
            <div class="card" onclick="openAdminStudentList('new')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border-bottom:3px solid var(--success);"><div style="font-size:22px; font-weight:900; color:var(--success);">${newStudents.length}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">신규 (30일)</div></div>
            <div class="card" onclick="openAdminStudentList('discharged')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border-bottom:3px solid var(--secondary);"><div style="font-size:22px; font-weight:900; color:var(--secondary);">${dischargedStudents.length}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">퇴원생</div></div>
            <div class="card" onclick="openAdminStudentList('risk')" style="cursor:pointer; padding:14px 8px; text-align:center; margin:0; border-bottom:3px solid var(--error); background:${risks.length > 0 ? '#fce8e6' : 'white'};"><div style="font-size:22px; font-weight:900; color:var(--error);">${risks.length}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">위험학생</div></div>
        </div>
    `;

    // [추가] 원장용 이번 주 일정 영역
    const nextWeek = new Date(todayTime + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE');
    const upcomingSchedules = (state.db.exam_schedules || [])
        .filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeek)
        .sort((a,b) => a.exam_date.localeCompare(b.exam_date));

    const adminScheduleHtml = `
        <div class="card" style="margin-bottom:28px;">
            <h4 style="margin:0 0 12px 0; font-size:15px; color:var(--primary);">📅 이번 주 일정</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${upcomingSchedules.length > 0 ? upcomingSchedules.map(e => {
                    const d = new Date(e.exam_date);
                    const dateLabel = `${d.getMonth()+1}월 ${d.getDate()}일`;
                    const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:normal;">${e.grade}</span> ` : '';
                    return `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #f1f3f4; font-size:13px;">
                            <div><b>${e.school_name}</b> ${gradeLabel}${e.exam_name}</div>
                            <div style="color:var(--secondary); font-size:11px;">${dateLabel}</div>
                        </div>
                    `;
                }).join('') : '<div style="text-align:center; padding:10px; color:var(--secondary); font-size:12px;">이번 주 예정된 일정이 없습니다.</div>'}
            </div>
        </div>
    `;

    const searchHtml = `
        <div class="card" style="margin-bottom:28px;">
            <h4 style="margin:0 0 10px 0; font-size:14px;">🔍 학생 통합 검색</h4>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
                <input id="admin-search-input" class="btn" placeholder="이름으로 검색..." style="flex:1; min-width:180px; text-align:left;" onkeyup="if(event.key==='Enter') renderAdminStudentSearch()">
                <button class="btn btn-primary" style="min-width:80px;" onclick="renderAdminStudentSearch()">검색</button>
            </div>
            <div id="admin-search-results" style="margin-top:12px; font-size:13px; max-height:200px; overflow-y:auto;"></div>
        </div>
    `;

    const riskRows = risks.map(r => {
        const badges = r.riskTypes.map(t => {
            let color = 'var(--secondary)';
            if (t === '출결위험' || t === '숙제위험') color = '#f9ab00';
            if (t === '성적위험') color = 'var(--error)';
            if (t === '관리위험') color = '#b06000';
            if (t === '복합위험') color = '#d93025';
            return `<span style="font-size:10px; background:#f1f3f4; color:${color}; font-weight:800; padding:2px 6px; border-radius:4px; border:1px solid ${color};">${t}</span>`;
        }).join(' ');

        const reasonsHtml = r.reasons.map(reason => `<div style="font-size:12px; color:var(--secondary); margin-bottom:2px;">• ${reason}</div>`).join('');
        let recentDataHtml = '';
        if (r.scoreSummary) recentDataHtml += `<div style="font-size:11px; color:#5f6368; margin-top:6px;"><b>성적흐름:</b> ${r.scoreSummary}</div>`;
        if (r.lastConsultationDate !== '없음') recentDataHtml += `<div style="font-size:11px; color:#5f6368; margin-top:2px;"><b>마지막 상담:</b> ${r.lastConsultationDate}</div>`;

        return `
            <div style="padding:14px; border:1px solid var(--border); border-radius:8px; margin-bottom:10px; background:var(--surface); box-shadow:0 1px 3px rgba(0,0,0,0.05);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; flex-wrap:wrap; gap:8px;">
                    <div style="flex:1; min-width:150px;">
                        <div style="font-weight:800; font-size:15px; color:var(--primary); margin-bottom:4px;">${r.student.name} <span style="font-size:12px; color:var(--secondary); font-weight:normal;">${r.className} | ${r.student.school_name} ${r.student.grade}</span></div>
                        <div style="display:flex; gap:4px; flex-wrap:wrap;">${badges}</div>
                    </div>
                    <button class="btn" style="padding:6px 12px; font-size:11px; color:var(--primary); border-color:var(--border);" onclick="renderStudentDetail('${r.student.id}')">상세 정보</button>
                </div>
                <div style="background:#f8f9fa; padding:8px 10px; border-radius:6px; margin-top:8px;">
                    ${reasonsHtml}
                    ${recentDataHtml}
                </div>
            </div>
        `;
    }).join('');

    const riskSectionHtml = `
        <div>
            <h3 style="margin:0 0 12px 0; font-size:16px; color:var(--error);">🚨 집중 관리가 필요한 학생 (${risks.length})</h3>
            ${risks.length > 0 ? riskRows : '<div style="text-align:center; padding:30px; color:var(--success); font-weight:800; background:var(--surface); border-radius:8px; border:1px solid var(--border);">현재 위험 징후를 보이는 학생이 없습니다. 🎉</div>'}
        </div>
    `;

    root.innerHTML = summaryHtml + adminScheduleHtml + searchHtml + riskSectionHtml;
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
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    showModal('👥 학생 관리', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <button class="btn" style="padding:8px; flex:1; font-size:11px;" onclick="closeModal(); openAddStudent();">👤 학생 추가</button>
            <button class="btn" style="padding:8px; flex:1; font-size:11px; color:var(--primary); border-color:var(--primary);" onclick="openGlobalPinManagement()">🔑 통합 PIN 관리</button>
        </div>
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="flex:1; text-align:left;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="flex:1;" onchange="renderAddressBookList()"><option value="">전체 반 (활성)</option>${classOptions}</select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px;"></div>
    `);
    renderAddressBookList();
}

function openGlobalPinManagement() {
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:12px; margin-bottom:6px;" onclick="handleBatchGeneratePins('${c.id}')">
            <span style="font-weight:bold;">${c.name}</span><span style="font-size:11px; color:var(--primary);">이 반 PIN 일괄 생성</span>
        </button>
    `).join('');
    
    showModal('🔑 통합 PIN 관리', `
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

// [수정] 교사명 하드코딩 제거 및 헬퍼 적용
function openAddClassModal() {
    showModal('➕ 새 반 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-cls-name" class="btn" placeholder="반 이름 (예: 중3A)" style="text-align:left;">
            <select id="add-cls-grade" class="btn">
                <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left;">
            <input id="add-cls-teacher" class="btn" value="${getTeacherNameForUI()}" placeholder="담당 교사" style="text-align:left;">
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
    
    showModal('📚 반별 교재 관리', `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <select id="tb-manage-class" class="btn" style="flex:1; margin-right:8px;" onchange="renderTextbookManageList()">
                <option value="">전체 반 보기 (내 담당)</option>
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
    } else toast('등록 실패', 'error');
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
        toast('변경사항이 저장되었습니다.', 'success');
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

    showModal('📝 메모 관리', `
        <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px; background:#f8f9fa; padding:12px; border-radius:8px;">
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="new-memo-date" class="btn" value="${todayStr}" style="text-align:left; flex:1;">
                <label style="font-size:13px; display:flex; align-items:center; gap:4px; white-space:nowrap;"><input type="checkbox" id="new-memo-pin"> 📌 고정</label>
            </div>
            <input type="text" id="new-memo-content" class="btn" placeholder="메모 입력 (예: 고2 시험대비 직전보강)" style="text-align:left;">
            <button class="btn btn-primary" style="padding:8px; font-size:12px; margin-top:4px;" onclick="addTodoMemo()">저장</button>
        </div>
        <div style="max-height:40vh; overflow-y:auto;">
            ${memos.length ? memoRows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">등록된 메모가 없습니다.</div>'}
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
    showModal('📝 메모 수정', `
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
                <div style="font-size:11px; color:var(--secondary); margin-bottom:4px;">${e.exam_date} ${e.grade ? `| ${e.school_name} ${e.grade}` : `| ${e.school_name}`}</div>
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
                    <option value="">전체/공통</option>
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
            ${schedules.length ? rows : '<div style="text-align:center; color:var(--secondary); font-size:12px; padding:10px;">등록된 시험일정이 없습니다.</div>'}
        </div>
    `);
}

async function addExamSchedule() {
    const sc = document.getElementById('new-ex-school').value.trim();
    const gr = document.getElementById('new-ex-grade').value; // 공란 허용
    const na = document.getElementById('new-ex-name').value.trim();
    const da = document.getElementById('new-ex-date').value;
    const me = document.getElementById('new-ex-memo').value.trim();
    if(!sc || !na || !da) return toast('학교명, 시험명, 날짜는 필수입니다.', 'warn');
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
                    <option value="" ${!e.grade?'selected':''}>전체/공통</option>
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
    if(!sc || !na || !da) return toast('학교명, 시험명, 날짜는 필수입니다.', 'warn');
    
    const r = await api.patch('exam-schedules/' + id, { schoolName: sc, grade: gr, examName: na, examDate: da, memo: me });
    if(r.success) { 
        toast('시험일정이 수정되었습니다.', 'info');
        await loadData(); 
        openExamScheduleModal(); 
    } else {
        toast('시험일정 수정 실패', 'error');
    }
}

function openGlobalExamGradeView() {
    const classes = state.db.classes.filter(c => c.is_active !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:14px; margin-bottom:8px;" onclick="closeModal(); if(typeof openExamGradeView==='function') openExamGradeView('${c.id}')">
            <span style="font-weight:bold; color:var(--primary);">${c.name}</span>
            <span style="font-size:12px; color:var(--secondary);">${c.grade}</span>
        </button>
    `).join('');
    showModal('📊 전체 반별 시험·성적', `
        <div style="margin-bottom:12px; font-size:12px; color:var(--secondary);">조회할 반을 선택하세요.</div>
        <div style="max-height:60vh; overflow-y:auto;">${rows || '<div style="text-align:center; opacity:0.5; padding:20px;">담당 반이 없습니다.</div>'}</div>
    `);
}

function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncStatusText = qLen > 0 ? `⚠️ 대기 중 ${qLen}건` : "✅ 대기 없음";
    const onlineStatusText = isOnline ? "🟢 온라인" : "🔴 오프라인";

    showModal('⚙️ 백오피스 운영 관리', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="padding-bottom:16px; border-bottom:1px solid var(--border);">
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">운영 및 관리 메뉴</label>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openClassManageModal();">🏫 반 및 교재 관리</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAddressBook();">👥 학생 관리</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openExamScheduleModal();">📅 시험일정 관리</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openDischargedStudents();">🗄️ 퇴원생 조회 및 복구</button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAdminJournalList(new Date().toLocaleDateString('sv-SE'));">📑 일지 보관함 (과거 내역)</button>
                </div>
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">시스템 및 동기화 상태</label>
                <div class="card" style="margin:0; padding:12px; background:#f8f9fa; border-style:dashed;">
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;"><span>네트워크:</span><b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b></div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:12px;"><span>미전송 데이터:</span><b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b></div>
                    <button class="btn btn-primary" style="width:100%; font-size:12px; padding:8px;" onclick="if(typeof processSyncQueue==='function') processSyncQueue(); closeModal();">🔄 지금 동기화 시도</button>
                </div>
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
        return typeof isClassScheduledToday === 'function' ? isClassScheduledToday(cid) : true;
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
        classSummaries[c.id] = { activeCount: cActiveIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, isScheduled: typeof isClassScheduledToday === 'function' ? isClassScheduledToday(c.id) : true };
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
    `).join('') : '<div style="font-size:12px; color:var(--secondary); padding:10px 4px;">오늘 등록된 메모가 없습니다.</div>';

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
                const gradeLabel = e.grade ? ` ${e.grade}` : '';
                return `<div style="padding:8px 4px; font-size:13px; color:#b06000; border-bottom:1px solid var(--border);">[시험] ${e.school_name}${gradeLabel} ${e.exam_name} <b style="margin-left:4px; font-size:11px; background:#fef7e0; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            } else {
                return `<div style="padding:8px 4px; font-size:13px; color:var(--secondary); border-bottom:1px solid var(--border);">${u.item.content} <b style="margin-left:4px; font-size:11px; background:#f1f3f4; padding:2px 6px; border-radius:4px;">${dDay}</b></div>`;
            }
        }).join('');
    }

    return `
        <div style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <h3 style="margin:0; font-size:16px;">📝 오늘의 메모</h3>
            </div>
            <div class="card" style="margin-bottom:16px; padding:8px 12px;">${todayHtml}</div>
            
            ${upcomingHtml ? `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <h3 style="margin:0; font-size:15px; color:var(--secondary);">📅 이번 주 일정</h3>
                </div>
                <div class="card" style="padding:8px 12px;">${upcomingHtml}</div>
            ` : ''}
        </div>
    `;
}

function renderDashboard() {
    state.ui.currentClassId = null;
    const data = computeDashboardData();
    const closeData = typeof computeTodayCloseData === 'function' ? computeTodayCloseData() : { totalActive:0, absents:[], hwMisses:[], allClear:true };
    const root = document.getElementById('app-root');

    const teacherName = getTeacherNameForUI();

    const topActions = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="margin:0; font-size:16px;">🚀 ${teacherName} 선생님</h3>
            <button class="btn" style="padding:6px 10px; font-size:11px; border-color:var(--border);" onclick="openOperationMenu()">⚙️ 운영 메뉴</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:20px;">
            <button class="btn btn-primary" style="padding:12px 4px; font-size:12px; font-weight:800; display:flex; flex-direction:column; align-items:center; gap:6px; background:var(--primary); color:white; border:none;" onclick="openDailyJournalModal()">
                <span style="font-size:20px;">📝</span> 일지
            </button>
            <button class="btn" style="padding:12px 4px; font-size:12px; font-weight:800; border-color:var(--border); display:flex; flex-direction:column; align-items:center; gap:6px;" onclick="openTodoMemoModal()">
                <span style="font-size:20px;">✅</span> 메모
            </button>
            <button class="btn" style="padding:12px 4px; font-size:12px; font-weight:800; border-color:var(--border); display:flex; flex-direction:column; align-items:center; gap:6px;" onclick="if(typeof renderAttendanceLedger==='function') renderAttendanceLedger()">
                <span style="font-size:20px;">📋</span> 출석부
            </button>
            <button class="btn" style="padding:12px 4px; font-size:12px; font-weight:800; border-color:var(--border); display:flex; flex-direction:column; align-items:center; gap:6px;" onclick="openGlobalExamGradeView()">
                <span style="font-size:20px;">📊</span> 시험·성적
            </button>
        </div>
    `;

    const qLen = typeof syncQueue !== 'undefined' ? syncQueue.length : 0;
    const syncWarning = qLen > 0 
        ? `<div style="background:#fce8e6; color:#c5221f; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; margin-bottom:12px; text-align:center; border:1px solid #f9d2ce;">⚠️ 인터넷 끊김: ${qLen}건의 데이터 대기 중</div>` 
        : '';

    const buildSummaryBadges = (list) => {
        if(list.length === 0) return '';
        const group = list.reduce((acc, cur) => { acc[cur.className] = (acc[cur.className]||0)+1; return acc; }, {});
        const keys = Object.keys(group);
        let str = keys.slice(0, 2).map(k => `${k} ${group[k]}`).join(' · ');
        if(keys.length > 2) str += ` 외 ${keys.length - 2}개 반`;
        return `<span style="font-size:11px; background:#fff; padding:2px 6px; border-radius:4px; margin-left:6px; color:#7a4f00;">${str}</span>`;
    };

    const closeBanner = closeData.totalActive === 0
        ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#f1f3f4; border:1px solid var(--border); border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:var(--secondary);">
            <span style="font-size:20px;">☕</span>
            <div><b>오늘은 예정된 정규 수업이 없습니다.</b></div>
          </div>`
        : closeData.allClear
            ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#e6f4ea; border:1px solid #a8d5b5; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:#1e6b34;">
                <span style="font-size:20px;">✅</span>
                <div><b>오늘 수업 예외사항 없음</b><br><span style="font-size:12px; opacity:0.8;">전원 출석 및 전원 숙제 완료</span></div>
              </div>`
            : `${syncWarning}<div onclick="if(typeof openTodayCloseModal==='function') openTodayCloseModal('att')" style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#fff8e1; border:1px solid #f9ab00; border-radius:12px; padding:14px 16px; margin-bottom:20px; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">📋</span>
                    <div style="font-size:14px; color:#7a4f00;">
                        <b>오늘 수업 예외 현황</b> <span style="font-size:11px; opacity:0.7;">(총 ${closeData.totalActive}명 대상)</span><br>
                        <div style="font-size:12px; margin-top:4px; line-height:1.6;">
                            결석 학생 <b>${closeData.absents.length}</b>명 ${buildSummaryBadges(closeData.absents)}<br>
                            숙제 미완료 <b>${closeData.hwMisses.length}</b>명 ${buildSummaryBadges(closeData.hwMisses)}
                        </div>
                    </div>
                </div>
                <span style="font-size:18px; color:#f9ab00;">›</span>
              </div>`;

    const todoSections = renderTodoSections();

    const classes = state.db.classes.filter(c => c.is_active !== 0);

    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap;">
            <h3 style="margin:0; font-size:16px;">📂 학급 관리</h3>
        </div>
        <div class="grid" style="margin-bottom:32px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    root.innerHTML = topActions + closeBanner + todoSections + classStatus;
}

// [5G-2] 오늘의 예외 현황 계산 헬퍼 (classroom.js 의존성 보완)
function computeTodayCloseData() {
    const today = new Date().toLocaleDateString('sv-SE');
    
    const scheduledActive = state.db.students.filter(s => {
        if (s.status !== '재원') return false;
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && cls.is_active === 0) return false;
        return typeof isClassScheduledToday === 'function' ? isClassScheduledToday(cid) : true;
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

// [수정] 중등부 필터 및 실제 수업일 기반 로직, 반 이름 중복 보정
function buildJournalContent(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const teacherName = getTeacherNameForUI();
    let text = `[AP Math 운영 일지 - ${targetDate}]\n작성자: ${teacherName}\n\n`;

    const activeClasses = state.db.classes.filter(c => {
        if (c.is_active === 0) return false;
        const gradeMatch = c.grade && (c.grade.includes('중1') || c.grade.includes('중2') || c.grade.includes('중3'));
        const nameMatch = c.name && (c.name.startsWith('중1') || c.name.startsWith('중2') || c.name.startsWith('중3'));
        return gradeMatch || nameMatch;
    });

    const scheduledClasses = activeClasses.filter(cls => isClassScheduledOnDate(cls.id, targetDate));

    if (scheduledClasses.length === 0) {
        text += `✅ 해당 날짜에 중등부 수업 반이 없습니다.\n`;
        return text;
    }

    scheduledClasses.forEach(cls => {
        const classLabel = String(cls.name || '').endsWith('반') ? cls.name : `${cls.name}반`;
        text += `■ ${classLabel}\n`;

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
    const teacherName = getTeacherNameForUI();

    if (state.ui.viewScope === 'all' || state.auth.role === 'admin') {
        renderAdminJournalList(targetDate);
        return;
    }

    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === teacherName);

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
    const teacherName = getTeacherNameForUI();
    const journals = state.db.journals || [];
    const myJournal = journals.find(j => j.date === targetDate && j.teacher_name === teacherName);

    const journalId = existingId || myJournal?.id;
    let result;
    if (journalId) {
        result = await api.patch(`daily-journals/${journalId}`, { content, status });
    } else {
        result = await api.post('daily-journals', { date: targetDate, content, status });
    }

    if (!result || result.error) return toast(result?.error || '일지 저장 실패', 'error');

    toast(`${targetDate} 일지가 ${status} 처리되었습니다.`, 'success');
    closeModal();
    await loadData();
}

function renderAdminJournalList(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const journals = (state.db.journals || []).filter(j => j.date === targetDate && j.status !== '작성중');

    const rows = journals.map(j => `
        <div class="card" style="padding:12px; margin-bottom:10px; cursor:pointer; border-color:${j.status === '결재완료' ? '#34a853' : 'var(--primary)'};" onclick="openAdminJournalFeedback('${j.id}')">
            <div style="display:flex; justify-content:space-between; margin-bottom:6px; gap:8px;">
                <b style="font-size:15px;">${apEscapeHtml(j.teacher_name)} 선생님</b>
                <span style="font-size:11px; font-weight:bold; color:${j.status === '결재완료' ? 'var(--success)' : 'var(--primary)'}; background:${j.status === '결재완료' ? '#e6f4ea' : '#e8f0fe'}; padding:2px 6px; border-radius:4px;">${apEscapeHtml(j.status)}</span>
            </div>
            <div style="font-size:12px; color:var(--secondary); white-space:pre-wrap; max-height:48px; overflow:hidden; line-height:1.5;">${apEscapeHtml(j.content)}</div>
        </div>
    `).join('');

    showModal(`📑 일지 보관함`, `
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; background:#f8f9fa; padding:8px; border-radius:8px; border:1px solid var(--border);">
            <b style="font-size:13px; color:var(--primary);">결재 기준일:</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left;" onchange="renderAdminJournalList(this.value)">
        </div>
        <div style="max-height:55vh; overflow-y:auto;">${journals.length ? rows : '<div style="text-align:center; opacity:0.5; padding:20px;">제출된 일지가 없습니다.</div>'}</div>
    `);
}

function openAdminJournalFeedback(id) {
    const journal = (state.db.journals || []).find(j => j.id === id);
    if (!journal) return toast('일지를 찾을 수 없습니다.', 'warn');

    showModal(`결재: ${apEscapeHtml(journal.teacher_name)} 선생님 일지`, `
        <textarea readonly class="btn" style="width:100%; height:170px; text-align:left; resize:vertical; font-size:13px; line-height:1.6; background:#f8f9fa;">${journal.content}</textarea>
        <textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; margin-top:12px;">${journal.feedback || ''}</textarea>
        <div style="margin-top:12px;">
            <button class="btn btn-primary" style="width:100%; padding:12px;" onclick="approveJournal('${journal.id}', '${journal.date}')">✅ 피드백 저장 및 결재 완료</button>
        </div>
    `);
}

async function approveJournal(id, dateStr) {
    const feedback = document.getElementById('journal-feedback')?.value.trim() || '';
    const result = await api.patch(`daily-journals/${id}`, { feedback });
    if (!result || result.error) return toast(result?.error || '결재 실패', 'error');

    toast('결재가 완료되었습니다.', 'success');
    closeModal();
    await loadData();
    renderAdminJournalList(dateStr);
}