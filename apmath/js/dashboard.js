/**
 * AP Math OS v26.1.2 [js/dashboard.js]
 * 대시보드 계산, 렌더링 및 학원 운영 메뉴 엔진 (3C: 메인 UX 간소화 및 성적 노출 제거)
 */

function copyPhoneNumber(text) {
    navigator.clipboard.writeText(text).then(() => toast('전화번호가 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

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
    
    showModal('📒 주소록', `
        <div style="display:flex; gap:8px; margin-bottom:12px;">
            <input id="ab-search" class="btn" placeholder="이름 검색" style="flex:1; text-align:left;" oninput="renderAddressBookList()">
            <select id="ab-class" class="btn" style="flex:1;" onchange="renderAddressBookList()">
                <option value="">전체 반 (활성)</option>
                ${classOptions}
            </select>
        </div>
        <div id="ab-list" style="max-height:60vh; overflow-y:auto; font-size:13px;">
        </div>
    `);
    renderAddressBookList();
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
        <div style="display:flex; justify-content:flex-end; margin-bottom:12px;">
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
                <option value="중1">중1</option>
                <option value="중2">중2</option>
                <option value="중3">중3</option>
                <option value="고1">고1</option>
                <option value="고2">고2</option>
                <option value="고3">고3</option>
            </select>
            <input id="add-cls-subject" class="btn" value="수학" placeholder="과목" style="text-align:left;">
            <input id="add-cls-teacher" class="btn" value="박준성" placeholder="담당 교사" style="text-align:left;">
            
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
    const schedule_days = Array.from(document.querySelectorAll('.add-cls-days:checked')).map(e => e.value).join(',');
    const r = await api.post('classes', { name, grade, subject, teacher_name, schedule_days });
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
    const schedule_days = Array.from(document.querySelectorAll('.edit-cls-days:checked')).map(e => e.value).join(',');
    const payload = { name, grade, subject, teacher_name, schedule_days, is_active: c.is_active !== undefined ? c.is_active : 1 };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast('반 정보가 수정되었습니다.', 'success'); await loadData(); openClassManageModal(); }
}

async function toggleClassActive(cid, status) {
    if (!confirm(status === 0 ? '이 반을 숨김 처리하시겠습니까?' : '이 반을 복구하시겠습니까?')) return;
    const c = state.db.classes.find(x => x.id === cid);
    const payload = { name: c.name, grade: c.grade, subject: c.subject, teacher_name: c.teacher_name, schedule_days: c.schedule_days, is_active: status };
    const r = await api.patch(`classes/${cid}`, payload);
    if (r.success) { toast(status === 0 ? '숨김 처리되었습니다.' : '복구되었습니다.', 'info'); await loadData(); openClassManageModal(); }
}

function openOperationMenu() {
    const isOnline = navigator.onLine;
    const qLen = syncQueue.length;
    const syncStatusText = qLen > 0 ? `⚠️ 대기 중 ${qLen}건` : "✅ 대기 없음";
    const onlineStatusText = isOnline ? "🟢 온라인" : "🔴 오프라인";

    showModal('⚙️ 학원 운영 관리', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="padding-bottom:16px; border-bottom:1px solid var(--border);">
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">운영 및 학생 관리</label>
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openClassManageModal();">
                        🏫 반 관리 (추가 / 수정 / 숨김 / 요일)
                    </button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAddStudent();">
                        👤 학생 추가
                    </button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openAddressBook();">
                        📒 주소록 (학생/학부모 연락처 조회)
                    </button>
                    <button class="btn" style="width:100%; justify-content:flex-start; padding:14px;" onclick="closeModal(); openDischargedStudents();">
                        🗄️ 퇴원생 목록 조회 / 복구
                    </button>
                </div>
            </div>

            <div>
                <label style="font-size:12px; color:var(--secondary); margin-bottom:8px; display:block;">시스템 및 동기화 상태</label>
                <div class="card" style="margin:0; padding:12px; background:#f8f9fa; border-style:dashed;">
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:8px;">
                        <span>네트워크 상태:</span>
                        <b style="color:${isOnline ? 'var(--success)' : 'var(--error)'}">${onlineStatusText}</b>
                    </div>
                    <div style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:12px;">
                        <span>미전송 데이터:</span>
                        <b style="color:${qLen > 0 ? 'var(--warning)' : 'var(--success)'}">${syncStatusText}</b>
                    </div>
                    <button class="btn btn-primary" style="width:100%; font-size:12px; padding:8px;" onclick="processSyncQueue(); closeModal();">
                        🔄 지금 동기화 시도
                    </button>
                </div>
            </div>
        </div>
    `);
}

function computeDashboardData() {
    const today = new Date().toLocaleDateString('sv-SE');
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const activeIds = new Set(activeStudents.map(s => s.id));
    const todayAtt = state.db.attendance.filter(a => a.date === today && activeIds.has(a.student_id));
    const presentCount = todayAtt.filter(a => a.status === '등원').length;
    const absentCount = todayAtt.filter(a => a.status === '결석').length;
    const todayHw = state.db.homework.filter(h => h.date === today && activeIds.has(h.student_id));
    const hwDoneCount = todayHw.filter(h => h.status === '완료').length;
    const hwNotDoneCount = Math.max(activeStudents.length - hwDoneCount, 0);
    const attHis = state.db.attendance_history || [];
    const hwHis = state.db.homework_history || [];
    const examsByStudent = new Map();
    state.db.exam_sessions.forEach(es => { if (!examsByStudent.has(es.student_id)) examsByStudent.set(es.student_id, []); examsByStudent.get(es.student_id).push(es); });
    const wrongBySession = new Map();
    state.db.wrong_answers.forEach(w => { wrongBySession.set(w.session_id, (wrongBySession.get(w.session_id) || 0) + 1); });
    const studentsData = {};
    let wrongRiskCount = 0;
    const priorityAll = [];
    activeStudents.forEach(s => {
        const sid = s.id;
        const absCount = attHis.filter(a => a.student_id === sid && a.status === '결석').length;
        const hwMissCount = hwHis.filter(h => h.student_id === sid && h.status !== '완료').length;
        let isWrongRisk = false;
        const sExams = examsByStudent.get(sid) || [];
        if (sExams.length > 0) {
            sExams.sort((a,b) => String(b.exam_date).localeCompare(String(a.exam_date)) || String(b.id).localeCompare(String(a.id)));
            if ((wrongBySession.get(sExams[0].id) || 0) >= RISK_WRONG_THRESHOLD) isWrongRisk = true;
        }
        const isAbsenceRisk = absCount >= RISK_ABSENCE_THRESHOLD;
        const isHwRisk = hwMissCount >= RISK_HOMEWORK_THRESHOLD;
        const riskScore = (isAbsenceRisk?1:0) + (isHwRisk?1:0) + (isWrongRisk?1:0);
        const rankWeight = riskScore * 1000 + (isAbsenceRisk?500:0) + (isWrongRisk?100:0);
        const sd = { id: sid, name: s.name, tags: [], riskScore, rankWeight, riskLevel: riskScore===3?'🔴 긴급':riskScore===2?'🟠 주의':riskScore===1?'🟡 관찰':'', className: state.db.classes.find(c => c.id === (state.db.class_students.find(m => m.student_id===sid)?.class_id))?.name || '미배정' };
        if (isAbsenceRisk) sd.tags.push('결석누적'); if (isHwRisk) sd.tags.push('숙제미달'); if (isWrongRisk) sd.tags.push('오답경고');
        if (isWrongRisk) wrongRiskCount++;
        studentsData[sid] = sd;
        if (riskScore >= 1 && !isRiskMuted(sid)) priorityAll.push(sd);
    });
    priorityAll.sort((a, b) => b.rankWeight - a.rankWeight || a.name.localeCompare(b.name));
    const classSummaries = {};
    state.db.classes.filter(c => c.is_active !== 0).forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id).filter(id => activeIds.has(id));
        let cRisk=0, cMiss=0, cAbs=0, cPre=0;
        cIds.forEach(id => {
            const att = todayAtt.find(a => a.student_id===id);
            if (att?.status==='등원') cPre++; if (att?.status==='결석') cAbs++;
            if (todayHw.find(h => h.student_id===id)?.status!=='완료') cMiss++;
            if (studentsData[id]?.riskScore >= 1) cRisk++;
        });
        classSummaries[c.id] = { activeCount: cIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, riskCount: cRisk };
    });
    return { global: { totalActive: activeStudents.length, presentCount, absentCount, hwDoneCount, hwNotDoneCount, wrongRiskCount }, priorityTop: priorityAll.slice(0, 1), classSummaries };
}

/**
 * 3C: 학급 요약 카드 성적 표시 제거
 */
function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id]; if (!s) return '';
    const n = s.activeCount || 1;
    const attRate = Math.round((s.present / n) * 100);
    const hwRate = Math.round(((n - s.hwNotDone) / n) * 100);
    
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
                <span style="background:${s.hwNotDone > 0 ? '#fef7e0' : '#f1f3f4'}; color:${s.hwNotDone > 0 ? '#b06000' : '#5f6368'}; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">숙제 ${s.hwNotDone}</span>
                ${s.riskCount > 0 ? `<span style="background:#fce8e6; color:#c5221f; padding:2px 7px; border-radius:4px; font-size:11px; font-weight:700;">위험 ${s.riskCount}</span>` : ''}
            </div>
            <div style="margin-top:8px; font-size:11px; color:var(--secondary); opacity:0.75;">
                출석 ${attRate}% · 숙제 ${hwRate}%
            </div>
        </div>
    `;
}

/**
 * 3C: 메인 대시보드 렌더링 (성적 배지 및 미입력 제거)
 */
function renderDashboard() {
    state.ui.currentClassId = null;
    const data = computeDashboardData();
    const todayExam = getTodayExamConfig();
    const closeData = computeTodayCloseData(todayExam);
    const root = document.getElementById('app-root');

    const academyStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="margin:0; font-size:16px;">🏢 학원 현황</h3>
            </div>
            <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="openOperationMenu()">⚙️ 운영</button>
                <button class="btn btn-primary" style="padding:6px 10px; font-size:11px;" onclick="copyAcademySummary()">📋 요약 복사</button>
            </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:10px; margin-bottom:28px;">
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--primary);"><div style="font-size:22px; font-weight:900;">${data.global.totalActive}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">재원생</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--success);"><div style="font-size:22px; font-weight:900; color:var(--success);">${data.global.presentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">등원</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--error);"><div style="font-size:22px; font-weight:900; color:var(--error);">${data.global.absentCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">결석</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid var(--warning);"><div style="font-size:22px; font-weight:900; color:var(--warning);">${data.global.hwNotDoneCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">숙제미달</div></div>
            <div class="card" style="padding:14px 8px; text-align:center; margin:0; border-bottom: 3px solid #c5221f;"><div style="font-size:22px; font-weight:900; color:#c5221f;">${data.global.wrongRiskCount}</div><div style="font-size:11px; color:var(--secondary); margin-top:4px;">오답위험</div></div>
        </div>
    `;

    const syncWarning = syncQueue.length > 0 
        ? `<div style="background:#fce8e6; color:#c5221f; padding:8px 16px; border-radius:8px; font-size:12px; font-weight:700; margin-bottom:12px; text-align:center; border:1px solid #f9d2ce;">⚠️ 인터넷 끊김: ${syncQueue.length}건의 마감 데이터 대기 중</div>` 
        : '';

    const closeBanner = closeData.totalActive === 0
        ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#f1f3f4; border:1px solid var(--border); border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:var(--secondary);">
            <span style="font-size:20px;">☕</span>
            <div><b>오늘은 예정된 정규 수업이 없습니다.</b></div>
          </div>`
        : closeData.allClear
            ? `${syncWarning}<div style="display:flex; align-items:center; gap:10px; background:#e6f4ea; border:1px solid #a8d5b5; border-radius:12px; padding:14px 16px; margin-bottom:20px; font-size:14px; color:#1e6b34;">
                <span style="font-size:20px;">✅</span>
                <div><b>오늘 수업 마감 완료</b><br><span style="font-size:12px; opacity:0.8;">출결·숙제 기록이 완료되었습니다.</span></div>
              </div>`
            : `${syncWarning}<div onclick="openTodayCloseModal('att')" style="display:flex; align-items:center; justify-content:space-between; gap:10px; background:#fff8e1; border:1px solid #f9ab00; border-radius:12px; padding:14px 16px; margin-bottom:20px; cursor:pointer;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:20px;">📋</span>
                    <div style="font-size:14px; color:#7a4f00;">
                        <b>오늘 수업 마감 체크</b> <span style="font-size:11px; opacity:0.7;">(오늘 대상 ${closeData.totalActive}명)</span><br>
                        <span style="font-size:12px;">
                            출결 미처리 <b>${closeData.noAtt.length}</b>명 &nbsp;·&nbsp;
                            숙제 미처리 <b>${closeData.noHw.length}</b>명
                        </span>
                    </div>
                </div>
                <span style="font-size:18px; color:#f9ab00;">›</span>
              </div>`;

    const classes = state.ui.viewScope === 'all' ? state.db.classes.filter(c => c.is_active !== 0) : state.db.classes.filter(c => c.teacher_name === state.ui.userName && c.is_active !== 0);
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap;">
            <h3 style="margin:0; font-size:16px;">📂 학급별 운영 현황</h3>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button class="btn btn-primary" style="padding:6px 12px; font-size:12px;" onclick="renderAttendanceLedger()">📋 출석부</button>
            </div>
        </div>
        <div class="grid" style="margin-bottom:32px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    let prioSec = '';
    if (data.priorityTop.length > 0) {
        const s = data.priorityTop[0];
        prioSec = `
            <h3 style="margin:0 0 12px 0; font-size:16px; color:var(--error);">🎯 집중 확인 학생</h3>
            <div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; border-left: 5px solid var(--error);" onclick="renderStudentDetail('${s.id}')">
                <div>
                    <div style="font-weight:800; font-size:16px;">${s.name} <span style="font-size:12px; font-weight:normal; color:var(--secondary); margin-left:6px;">${s.className}</span></div>
                    <div style="display:flex; gap:4px; margin-top:6px;">
                        ${s.tags.map(t => `<span style="background:#fce8e6; color:#c5221f; padding:1px 6px; border-radius:4px; font-size:11px; font-weight:700;">${t}</span>`).join('')}
                        <span style="font-size:12px; margin-left:4px;">${s.riskLevel}</span>
                    </div>
                </div>
                <button class="btn" style="padding:8px 16px; font-size:13px; font-weight:700; border-color:var(--border);" onclick="event.stopPropagation(); muteRiskStudent('${s.id}')">확인</button>
            </div>
        `;
    } else {
        prioSec = `<div style="text-align:center; padding:20px; opacity:0.5; font-size:13px;">✅ 현재 집중 확인이 필요한 학생이 없습니다.</div>`;
    }

    root.innerHTML = academyStatus + closeBanner + classStatus + prioSec;
    document.getElementById('scope-text').innerText = state.ui.viewScope === 'all' ? '전체 관리' : '내 담당';
}

function getMutedRisks() { return JSON.parse(localStorage.getItem(RISK_MUTE_KEY) || '{}'); }
function saveMutedRisks(data) { localStorage.setItem(RISK_MUTE_KEY, JSON.stringify(data)); }

function muteRiskStudent(sid) { 
    const muted = getMutedRisks(); 
    muted[sid] = new Date().toLocaleDateString('sv-SE'); 
    saveMutedRisks(muted); toast('확인 처리 완료', 'info'); renderDashboard(); 
}

function dateToDayIndex(str) { 
    const [y, m, d] = String(str).split('-').map(Number); 
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000); 
}

function isRiskMuted(sid) {
    const muted = getMutedRisks(); 
    const mutedDate = muted[sid]; if (!mutedDate) return false;
    const today = new Date().toLocaleDateString('sv-SE');
    const diff = dateToDayIndex(today) - dateToDayIndex(mutedDate);
    return diff >= 0 && diff < RISK_MUTE_DAYS;
}

function isClassScheduledToday(clsId) {
    const cls = state.db.classes.find(c => c.id === clsId);
    if (!cls || !cls.schedule_days) return true;
    const todayIdx = String(new Date().getDay());
    return cls.schedule_days.split(',').includes(todayIdx);
}

function computeTodayCloseData(todayExam = getTodayExamConfig()) {
    const today = new Date().toLocaleDateString('sv-SE');
    const scheduledActive = state.db.students.filter(s => {
        if (s.status !== '재원') return false;
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        return isClassScheduledToday(cid);
    });
    const activeIds = new Set(scheduledActive.map(s => s.id));
    const attTodaySet = new Set(state.db.attendance.filter(a => a.date === today && activeIds.has(a.student_id)).map(a => a.student_id));
    const hwTodaySet = new Set(state.db.homework.filter(h => h.date === today && activeIds.has(h.student_id)).map(h => h.student_id));
    const testTodaySet = todayExam ? new Set(state.db.exam_sessions.filter(es => es.exam_date === today && es.exam_title === todayExam.title && activeIds.has(es.student_id)).map(es => es.student_id)) : new Set();
    const noAtt = [], noHw = [], noTest = [];
    scheduledActive.forEach(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const className = state.db.classes.find(c => c.id === cid)?.name || '미배정';
        const info = { id: s.id, name: s.name, className };
        if (!attTodaySet.has(s.id)) noAtt.push(info);
        if (!hwTodaySet.has(s.id)) noHw.push(info);
        if (todayExam && !testTodaySet.has(s.id)) noTest.push(info);
    });
    const totalActive = scheduledActive.length;
    return {
        totalActive, todayExam, noAtt, attDone: totalActive - noAtt.length, noHw, hwDone: totalActive - noHw.length, noTest, testDone: todayExam ? totalActive - noTest.length : 0,
        allClear: totalActive > 0 && noAtt.length === 0 && noHw.length === 0
    };
}

async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly(); openTodayCloseModal(tab);
}

async function quickToggleHw(sid, status, tab = 'hw') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('homework', { studentId: sid, status, date: today });
    if (!r?.success) { toast('숙제 처리 실패', 'warn'); return; }
    await refreshDataOnly(); openTodayCloseModal(tab);
}

/**
 * 3C: 운영 요약 문구 성적 제거
 */
function buildAcademySummary() {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = getTodayExamConfig();
    const closeData = computeTodayCloseData(todayExam);
    let text = `[AP Math 운영 마감 보고 - ${today}]\n\n`;
    text += `오늘 수업 대상: ${closeData.totalActive}명\n`;
    text += `출결 처리: ${closeData.attDone}/${closeData.totalActive}\n`;
    text += `숙제 처리: ${closeData.hwDone}/${closeData.totalActive}\n`;
    if (closeData.totalActive === 0) text += `\n✅ 오늘은 예정된 정규 수업이 없습니다.`;
    else if (closeData.allClear) text += `\n✅ 오늘 운영 마감 완료`;
    else { text += `\n⚠️ 미처리 항목\n- 출결 미처리: ${closeData.noAtt.length}명\n- 숙제 미처리: ${closeData.noHw.length}명\n`; }
    return text;
}

function copyAcademySummary() {
    const text = buildAcademySummary();
    navigator.clipboard.writeText(text).then(() => toast('운영 요약이 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

/**
 * 3C: 오늘 마감 상세 모달 성적 탭 제거
 */
function openTodayCloseModal(tab = 'att') {
    const todayExam = getTodayExamConfig();
    const d = computeTodayCloseData(todayExam);
    const tabs = [
        { key: 'att',  label: `출결 미처리 ${d.noAtt.length}`,  list: d.noAtt,  emptyMsg: '모든 대상 출결 처리 완료 ✅' },
        { key: 'hw',   label: `숙제 미처리 ${d.noHw.length}`,   list: d.noHw,   emptyMsg: '모든 대상 숙제 처리 완료 ✅' }
    ];
    const cur = tabs.find(t => t.key === tab) || tabs[0];
    const tabBtns = tabs.map(t => `
        <button onclick="openTodayCloseModal('${t.key}')" style="flex:1; padding:10px 4px; border:none; border-radius:8px; font-size:12px; font-weight:700; background:${t.key === tab ? 'var(--primary)' : '#f1f3f4'}; color:${t.key === tab ? 'white' : 'var(--secondary)'}; cursor:pointer;">
            ${t.label}
        </button>
    `).join('');
    const rows = cur.list.length
        ? cur.list.map(s => {
            let actionBtns = '';
            if (tab === 'att') actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleAtt('${s.id}', '등원', '${tab}')">✅ 등원</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--error); border-color:var(--error);" onclick="quickToggleAtt('${s.id}', '결석', '${tab}')">❌ 결석</button></div>`;
            else if (tab === 'hw') actionBtns = `<div style="display:flex; gap:6px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; padding:12px; font-size:13px;" onclick="quickToggleHw('${s.id}', '완료', '${tab}')">✅ 완료</button><button class="btn" style="flex:1; padding:12px; font-size:13px; color:var(--warning); border-color:var(--warning);" onclick="quickToggleHw('${s.id}', '미완료', '${tab}')">❌ 미완료</button></div>`;
            return `<div style="padding:14px 4px; border-bottom:1px solid var(--border);"><div style="display:flex; justify-content:space-between; align-items:center;"><div onclick="closeModal();renderStudentDetail('${s.id}')" style="cursor:pointer; flex:1;"><span style="font-weight:700; font-size:15px;">${s.name}</span><span style="font-size:12px; color:var(--secondary); margin-left:8px;">${s.className}</span></div><span onclick="closeModal();renderStudentDetail('${s.id}')" style="font-size:12px; color:var(--primary); cursor:pointer;">→ 프로필</span></div>${actionBtns}</div>`;
        }).join('')
        : `<div style="padding:32px 16px; text-align:center; color:var(--success); font-weight:700; font-size:14px;">${cur.emptyMsg}</div>`;
    showModal('📋 오늘 마감 상세', `<div style="display:flex; gap:6px; margin-bottom:16px;">${tabBtns}</div><div>${rows}</div>`);
}

function openTodayExamSetModal() {
    const cfg = getTodayExamConfig();
    showModal('⚙️ 오늘 시험 설정', `<div style="display:flex; flex-direction:column; gap:12px;"><p style="margin:0; font-size:13px; color:var(--secondary);">오늘 전체 학급에 적용될 시험 기준을 설정합니다.<br>(QR 코드 생성 시에도 자동 연동됩니다)</p><div style="display:flex; gap:4px; flex-wrap:wrap; margin:6px 0;"><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='쪽지시험'">쪽지시험</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='단원평가'">단원평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='월말평가'">월말평가</button><button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('set-exam-title').value='모의고사'">모의고사</button></div><input id="set-exam-title" class="btn" placeholder="시험명 직접 입력" value="${cfg?.title || ''}" style="text-align:left; width:100%;"><input id="set-exam-q" type="number" class="btn" placeholder="문항 수" value="${cfg?.q || 20}" min="1" max="50" style="text-align:left; width:100%;"><div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;"><button class="btn btn-primary" style="flex:1; min-width:120px; padding:12px;" onclick="handleSetTodayExam()">저장 및 적용</button><button class="btn" style="flex:1; min-width:120px; padding:12px; color:var(--error); border-color:var(--error);" onclick="clearTodayExamConfig(); closeModal();">시험 없음 처리</button></div></div>`);
}

function handleSetTodayExam() {
    const t = document.getElementById('set-exam-title').value.trim();
    const q = parseInt(document.getElementById('set-exam-q').value, 10) || 20;
    if (!t) { toast('시험명을 입력하세요.', 'warn'); return; }
    setTodayExamConfig(t, q); toast('오늘 시험이 설정되었습니다.', 'info'); closeModal(); renderDashboard();
}