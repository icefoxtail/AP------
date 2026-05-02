/**
 * AP Math OS 1.0 [js/dashboard.js]
 * 운영센터 및 선생님별 관제 엔진 (Partner B 보정판)
 * [Minimalism Polish]: 학급 카드 및 마감 배너 은은한 테두리 기반 디자인 적용
 * [Claude Precision Fix]: Safari Date 파싱 버그, Timezone 어긋남, is_active 타입 캐스팅 완벽 방어
 * [Master Review Patch]: 14일 필터 적용, XSS 방어, 달력 상태 동기화, 중등부 필터 통합
 * [3rd Stabilization]: 날짜 파싱 헬퍼 통일(apParseLocalDateTime), 중등반 필터 완전 통일
 * [Partner B Fix]: 오늘 수업 요일 필터링 적용 및 시험 일정 필수 입력 해제
 * [Partner B Hotfix]: 학급 진입 시 state.ui.currentClassId 전역 상태 누락 버그 해결
 */

function copyPhoneNumber(text) {
    navigator.clipboard.writeText(text).then(() => toast('전화번호가 복사되었습니다.', 'info')).catch(() => toast('복사 실패', 'warn'));
}

function apEscapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function apParseLocalDateTime(value) {
    const str = String(value || '').trim();
    if (!str) return null;

    const datePart = str.split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);

    if (parts.length !== 3) return null;

    const [y, m, d] = parts;
    if (!Number.isFinite(y) || !Number.isFinite(m) || !Number.isFinite(d)) return null;

    const time = new Date(y, m - 1, d).getTime();
    return Number.isFinite(time) ? time : null;
}

function apFormatMonthDay(value) {
    const str = String(value || '').trim();
    const datePart = str.split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);

    if (parts.length !== 3) return '';

    const [, m, d] = parts;
    if (!Number.isFinite(m) || !Number.isFinite(d)) return '';

    return `${m}월 ${d}일`;
}

// [Partner B] 해당 반이 오늘 수업이 있는 날인지 판정하는 헬퍼
function getAcademyScheduleTypeLabelForDashboard(type) {
    const labels = {
        closed: '휴무',
        makeup: '보강',
        consultation: '상담',
        event: '행사',
        etc: '기타',
        exam: '시험'
    };
    return labels[type] || '기타';
}

function getAcademyScheduleToneForDashboard(type) {
    if (type === 'closed') return { color: 'var(--error)', bg: 'rgba(255,71,87,0.08)', border: 'rgba(255,71,87,0.16)' };
    if (type === 'makeup') return { color: 'var(--primary)', bg: 'rgba(26,92,255,0.08)', border: 'rgba(26,92,255,0.14)' };
    if (type === 'consultation') return { color: 'var(--success)', bg: 'rgba(0,208,132,0.08)', border: 'rgba(0,208,132,0.14)' };
    return { color: 'var(--secondary)', bg: 'var(--surface-2)', border: 'var(--border)' };
}

function getAcademyScheduleStudentNameForDashboard(studentId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    return student ? student.name : '';
}

function buildAcademyScheduleTitleForDashboard(item) {
    const label = getAcademyScheduleTypeLabelForDashboard(item.schedule_type);
    const studentName = item.target_scope === 'student' ? getAcademyScheduleStudentNameForDashboard(item.student_id) : '';
    const timeText = item.start_time ? ` ${item.start_time}` : '';
    const targetText = studentName ? ` · ${studentName}` : '';
    return `[${label}] ${item.title || '운영일정'}${targetText}${timeText}`;
}

function isClassScheduledTodayForDashboard(cid) {
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    if (!cls) return false;
    // 수업 요일 설정이 없으면 매일 수업으로 간주
    if (!cls.schedule_days) return true;
    
    const today = new Date().getDay(); // 0(일) ~ 6(토)
    const days = String(cls.schedule_days).split(',').map(d => d.trim());
    return days.includes(String(today));
}

function isMiddleSchoolClass(c) {
    const gradeText = String(c?.grade || '');
    const nameText = String(c?.name || '');

    if (
        gradeText.startsWith('고') ||
        nameText.startsWith('고') ||
        nameText.includes('고1') ||
        nameText.includes('고2') ||
        nameText.includes('고3') ||
        nameText.includes('고등')
    ) return false;

    return true;
}

function isClassVisibleForCurrentTeacher(c) {
    if (!c) return false;

    if (state?.auth?.role === 'admin') return true;
    if (state?.ui?.viewScope === 'all') return true;

    const currentTeacher = typeof getTeacherNameForUI === 'function'
        ? getTeacherNameForUI()
        : (state?.ui?.userName || state?.auth?.name || '');

    const normalizedCurrent = String(currentTeacher || '')
        .replace(/\s*선생님\s*$/g, '')
        .trim();

    const normalizedClassTeacher = String(c.teacher_name || '')
        .replace(/\s*선생님\s*$/g, '')
        .trim();

    if (!normalizedClassTeacher) return true;

    return normalizedClassTeacher === normalizedCurrent;
}

function getDashboardTodayStr() {
    if (typeof getOperationDate === 'function') return getOperationDate();
    return new Date().toLocaleDateString('sv-SE');
}

function getDashboardStudentClassId(studentId) {
    const mapping = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return mapping ? String(mapping.class_id) : '';
}

function getVisibleActiveStudentsForDashboard() {
    return (state.db.students || []).filter(s => {
        if (s.status !== '재원') return false;
        const cid = getDashboardStudentClassId(s.id);
        const cls = (state.db.classes || []).find(c => String(c.id) === String(cid));
        if (cls && Number(cls.is_active) === 0) return false;
        return !cls || isClassVisibleForCurrentTeacher(cls);
    });
}

function getTodayAcademySchedulesForDashboard(todayStr = getDashboardTodayStr()) {
    const visibleStudentIds = new Set(getVisibleActiveStudentsForDashboard().map(s => String(s.id)));
    return (state.db.academy_schedules || []).filter(s => {
        if (String(s.is_deleted || 0) === '1') return false;
        if (String(s.schedule_date || '') !== todayStr) return false;
        if (s.target_scope !== 'student') return true;
        return visibleStudentIds.has(String(s.student_id || ''));
    });
}

function getDashboardClosedStudentIdsForDate(studentIds, dateStr) {
    const idSet = new Set((studentIds || []).map(id => String(id)));
    const schedules = state.db.academy_schedules || [];
    const hasGlobalClosed = schedules.some(s =>
        String(s.is_deleted || 0) !== '1' &&
        String(s.schedule_date || '') === dateStr &&
        s.schedule_type === 'closed' &&
        s.target_scope !== 'student'
    );

    if (hasGlobalClosed) {
        return { hasGlobalClosed: true, closedStudentIds: new Set(idSet) };
    }

    const closedStudentIds = new Set(
        schedules
            .filter(s =>
                String(s.is_deleted || 0) !== '1' &&
                String(s.schedule_date || '') === dateStr &&
                s.schedule_type === 'closed' &&
                s.target_scope === 'student' &&
                idSet.has(String(s.student_id || ''))
            )
            .map(s => String(s.student_id || ''))
    );

    return { hasGlobalClosed: false, closedStudentIds };
}

function computeDashboardOperationSnapshot(data) {
    const todayStr = getDashboardTodayStr();
    const todaySchedules = getTodayAcademySchedulesForDashboard(todayStr);
    const globalClosed = todaySchedules.filter(s => s.schedule_type === 'closed' && s.target_scope !== 'student');
    const studentClosed = todaySchedules.filter(s => s.schedule_type === 'closed' && s.target_scope === 'student');
    const makeup = todaySchedules.filter(s => s.schedule_type === 'makeup');
    const consultation = todaySchedules.filter(s => s.schedule_type === 'consultation');
    const scheduledStudents = getVisibleActiveStudentsForDashboard().filter(s => {
        const cid = getDashboardStudentClassId(s.id);
        return isClassScheduledTodayForDashboard(cid);
    });
    const closedInfo = getDashboardClosedStudentIdsForDate(scheduledStudents.map(s => s.id), todayStr);
    const targetStudents = closedInfo.hasGlobalClosed ? [] : scheduledStudents.filter(s => !closedInfo.closedStudentIds.has(String(s.id)));
    const attendanceDone = new Set((state.db.attendance || []).filter(a => a.date === todayStr).map(a => String(a.student_id)));
    const homeworkDone = new Set((state.db.homework || []).filter(h => h.date === todayStr).map(h => String(h.student_id)));

    return {
        todayStr,
        globalClosed,
        studentClosed,
        makeup,
        consultation,
        scheduledClassCount: (state.db.classes || []).filter(c => Number(c.is_active) !== 0 && isClassVisibleForCurrentTeacher(c) && isClassScheduledTodayForDashboard(c.id)).length,
        attendancePending: targetStudents.filter(s => !attendanceDone.has(String(s.id))).length,
        homeworkPending: targetStudents.filter(s => !homeworkDone.has(String(s.id))).length,
        targetCount: targetStudents.length,
        data
    };
}

function renderDashboardOperationStatusCard(data) {
    const op = computeDashboardOperationSnapshot(data);
    const closedTitle = op.globalClosed.length
        ? `학원 휴무 ${op.globalClosed.length}건`
        : `학생 휴무 ${op.studentClosed.length}명`;
    const bannerHtml = op.globalClosed.length ? `
        <div style="margin-bottom:10px; padding:12px 14px; border-radius:14px; background:rgba(255,71,87,0.08); border:1px solid rgba(255,71,87,0.18); color:var(--error); font-size:13px; font-weight:700; line-height:1.5;">
            오늘은 학원 전체 휴무 일정이 있습니다. 출석/숙제 입력은 가능하지만 마감 대상에서는 제외해 확인하세요.
        </div>
    ` : '';

    const item = (label, value, color, bg, border) => `
        <div style="min-width:0; padding:12px 10px; border-radius:14px; background:${bg}; border:1px solid ${border};">
            <div style="font-size:11px; font-weight:600; color:var(--secondary); line-height:1.35; margin-bottom:5px;">${label}</div>
            <div style="font-size:20px; font-weight:700; color:${color}; line-height:1.2;">${value}</div>
        </div>
    `;

    return `
        <div style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">오늘 운영 상태</h3>
                <span style="font-size:11px; font-weight:600; color:var(--secondary);">${op.todayStr}</span>
            </div>
            ${bannerHtml}
            <div style="display:grid; grid-template-columns:repeat(2, minmax(0, 1fr)); gap:8px;">
                ${item('오늘 수업반', op.scheduledClassCount, 'var(--primary)', 'rgba(26,92,255,0.06)', 'rgba(26,92,255,0.14)')}
                ${item('오늘 휴무', closedTitle, 'var(--error)', 'rgba(255,71,87,0.06)', 'rgba(255,71,87,0.16)')}
                ${item('오늘 보강', `${op.makeup.length}건`, 'var(--primary)', 'rgba(26,92,255,0.06)', 'rgba(26,92,255,0.14)')}
                ${item('오늘 상담', `${op.consultation.length}건`, 'var(--success)', 'rgba(0,208,132,0.06)', 'rgba(0,208,132,0.14)')}
                ${item('미처리 출석', `${op.attendancePending}/${op.targetCount}`, op.attendancePending ? 'var(--warning)' : 'var(--success)', 'var(--surface)', 'var(--border)')}
                ${item('미처리 숙제', `${op.homeworkPending}/${op.targetCount}`, op.homeworkPending ? 'var(--warning)' : 'var(--success)', 'var(--surface)', 'var(--border)')}
            </div>
        </div>
    `;
}

// [5G] 관리필요(구 위험학생) 판정 알고리즘
function computeRiskStudents() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    
    if (todayTime === null) return [];

    const active = state.db.students.filter(s => s.status === '재원');

    const attendanceHistory = state.db.attendance_history || [];
    const homeworkHistory = state.db.homework_history || [];
    const examSessions = state.db.exam_sessions || [];
    const consultations = state.db.consultations || [];
    const classStudents = state.db.class_students || [];
    const classes = state.db.classes || [];
    
    // [Stabilization] 최근 14일 기준 생성
    const LOOKBACK_DAYS = 14;
    const cutoffTime = todayTime - (LOOKBACK_DAYS - 1) * 24 * 60 * 60 * 1000;

    const getRecordTime = apParseLocalDateTime;
    
    const risks = [];
    
    active.forEach(s => {
        let riskTypes = [];
        let reasons = [];
        
        // [Stabilization] 출결 14일 필터 실제 적용
        const recentAtt = attendanceHistory.filter(a => {
            if (String(a.student_id) !== String(s.id)) return false;
            if (a.status !== '결석') return false;
            const t = getRecordTime(a.date);
            return t !== null && t >= cutoffTime && t <= todayTime;
        });
        const absenceCount = recentAtt.length;
        if (absenceCount >= 2) { riskTypes.push('출결주의'); reasons.push(`최근 14일 결석 ${absenceCount}회`); }
        
        // [Stabilization] 숙제 14일 필터 실제 적용
        const recentHw = homeworkHistory.filter(h => {
            if (String(h.student_id) !== String(s.id)) return false;
            if (h.status !== '미완료') return false;
            const t = getRecordTime(h.date);
            return t !== null && t >= cutoffTime && t <= todayTime;
        });
        const hwMissCount = recentHw.length;
        if (hwMissCount >= 3) { riskTypes.push('숙제주의'); reasons.push(`최근 14일 숙제 미완료 ${hwMissCount}회`); }
        
        const exams = examSessions.filter(e => e.student_id === s.id)
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
        
        const cns = consultations.filter(c => c.student_id === s.id).sort((a,b) => String(b.date).localeCompare(String(a.date)));
        let lastCnsDate = cns.length ? cns[0].date : '없음';
        let cnsDaysDiff = 999;
        if (cns.length > 0) {
            const cnsTime = apParseLocalDateTime(cns[0].date);
            if (cnsTime !== null) {
                cnsDaysDiff = (todayTime - cnsTime) / (1000*3600*24);
            }
        }
        
        let isNewStudent = false;
        if (s.created_at) {
            const createTime = apParseLocalDateTime(s.created_at);
            if (createTime !== null && (todayTime - createTime) / (1000*3600*24) <= 14) isNewStudent = true;
        }
        
        if (cnsDaysDiff >= 30 && !isNewStudent) { riskTypes.push('상담필요'); reasons.push(`최근 30일 상담 기록 없음`); }
        
        // [Stabilization] 종합주의 중복 방어
        if (riskTypes.length >= 2 && !riskTypes.includes('종합주의')) { 
            riskTypes.push('종합주의'); 
        }
        
        if (riskTypes.length > 0) {
            const cId = classStudents.find(m => m.student_id === s.id)?.class_id;
            const cName = classes.find(c => c.id === cId)?.name || '미배정';
            risks.push({ student: s, className: cName, riskTypes, reasons, scoreSummary, absenceCount, hwMissCount, lastConsultationDate: lastCnsDate });
        }
    });
    
    return risks;
}

// [Final Fix] 운영메뉴 퇴원생 버튼과 연동
function openAdminDischargedStudents() {
    openAdminStudentList('discharged');
}

function openRiskStudentReport(studentId) {
    const risks = typeof computeRiskStudents === 'function' ? computeRiskStudents() : [];
    const risk = risks.find(r => String(r.student?.id) === String(studentId));
    if (typeof openStudentReportModal === 'function') {
        openStudentReportModal(studentId, { riskInfo: risk || null, title: '\uAD00\uB9AC\uD544\uC694 \uD559\uC0DD \uBB38\uAD6C \uC0DD\uC131' });
        return;
    }
    toast('\uBCF4\uACE0 \uBB38\uAD6C \uBAA8\uB4C8\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
}
async function restoreDischargedStudent(sid) {
    if (!confirm('이 학생을 재원으로 복구하시겠습니까?')) return;
    const r = await api.patch(`students/${sid}/restore`, {});
    if (r?.success) {
        await loadData();
        openAdminStudentList('discharged');
    } else {
        toast(r?.message || r?.error || '복구에 실패했습니다.', 'error');
    }
}

async function hideDischargedStudent(sid) {
    if (!confirm('이 퇴원생을 목록에서 숨기시겠습니까?')) return;
    const r = await api.patch(`students/${sid}/hide`, {});
    if (r?.success) {
        await loadData();
        openAdminStudentList('discharged');
    } else {
        toast(r?.message || r?.error || '숨김 처리에 실패했습니다.', 'error');
    }
}

function openAdminStudentList(type) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    let list = [], title = "";

    if (type === 'active') { 
        list = state.db.students.filter(s => s.status === '재원'); 
        title = "재원생 목록"; 
    } else if (type === 'new') { 
        list = state.db.students.filter(s => { 
            if (s.status !== '재원' || !s.created_at || todayTime === null) return false; 
            const createdTime = apParseLocalDateTime(s.created_at);
            if (createdTime === null) return false;
            return (todayTime - createdTime) / (1000*3600*24) <= 30; 
        }); 
        title = "신규생 목록"; 
    } else if (type === 'discharged') { 
        list = state.db.students.filter(s => s.status === '제적'); 
        title = "퇴원생 목록"; 
    } else if (type === 'risk') { 
        list = computeRiskStudents().map(r => ({ ...r.student, riskInfo: r })); 
        title = "관리필요 학생"; 
    }

    const rows = list.map(s => {
        const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
        let riskDetails = "";
        if (s.riskInfo) { riskDetails = `<div style="font-size:11px; color:var(--error); margin-top:6px; background:rgba(255,71,87,0.08); padding:6px 8px; border-radius:6px; font-weight:600;">상태: ${s.riskInfo.riskTypes.join(', ')} <span style="opacity:0.7; font-weight:normal;">(${s.riskInfo.reasons.join(' · ')})</span></div>`; }
        let actionButtons = '';
        if (type === 'discharged') {
            actionButtons = `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:700; border-radius:10px; background:var(--surface-2); border:none; cursor:pointer;" onclick="closeModal(); renderStudentDetail('${s.id}')">\uC0C1\uC138 \uBCF4\uAE30</button>
                    <button class="btn btn-primary" style="padding:7px 10px; font-size:11px; font-weight:700; border-radius:10px; box-shadow:none; cursor:pointer;" onclick="restoreDischargedStudent('${s.id}')">\uC7AC\uC6D0 \uBCF5\uAD6C</button>
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:700; border-radius:10px; background:var(--surface-2); color:var(--secondary); border:1px solid var(--border); cursor:pointer;" onclick="hideDischargedStudent('${s.id}')">\uC228\uAE40</button>
                </div>
            `;
        } else if (type === 'risk') {
            actionButtons = `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn" style="padding:8px 12px; font-size:12px; font-weight:700; border-radius:8px; background:var(--surface-2); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">\uC0C1\uC138 \uBCF4\uAE30</button>
                    <button class="btn btn-primary" style="min-height:36px; padding:8px 12px; font-size:12px; font-weight:700; border-radius:8px; box-shadow:none;" onclick="event.stopPropagation(); openRiskStudentReport('${s.id}')">\uBB38\uAD6C \uC0DD\uC131</button>
                </div>
            `;
        } else {
            actionButtons = `<button class="btn" style="padding:8px 12px; font-size:12px; font-weight:700; border-radius:8px; background:var(--surface-2); border:none;" onclick="closeModal(); renderStudentDetail('${s.id}')">\uC0C1\uC138 \uBCF4\uAE30</button>`;
        }
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
                <div style="flex:1; padding-right:12px;">
                    <div style="font-weight:700; font-size:14px; color:var(--text);">${apEscapeHtml(s.name)} <span style="font-size:12px; color:var(--secondary); font-weight:600; margin-left:4px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <div style="font-size:12px; color:var(--primary); font-weight:600; margin-top:4px;">${apEscapeHtml(cName)} <span style="color:var(--secondary); font-weight:500;">| ${apEscapeHtml(s.status)} ${s.created_at ? `| 등록: ${s.created_at.split(' ')[0]}` : ''}</span></div>
                    ${riskDetails}
                </div>
                ${actionButtons}
            </div>
        `;
    }).join('');

    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:600;">조회 대상이 없습니다.</div>`}</div>`);
}

function renderAdminControlCenter() {
    if (typeof renderAppDrawer === 'function') renderAppDrawer();
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const dischargedStudents = state.db.students.filter(s => s.status === '제적');
    const newStudents = activeStudents.filter(s => { 
        if (!s.created_at) return false; 
        const createdTime = apParseLocalDateTime(s.created_at);
        if (createdTime === null) return false;
        return (todayTime - createdTime) / (1000*3600*24) <= 30; 
    });
    const risks = computeRiskStudents();
    const operationStatusHtml = renderDashboardOperationStatusCard(computeDashboardData());

    const headerHtml = `
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:20px;">
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="btn" style="width:36px; height:36px; padding:0; font-size:20px; font-weight:700; line-height:1; display:flex; align-items:center; justify-content:center; border:none; background:transparent; color:var(--text); box-sizing:border-box;" onclick="openAppDrawer()"><span class="ap-hamburger-glyph">☰</span></button>
                <div>
                    <div style="font-size:20px; font-weight:700; color:var(--text); letter-spacing:-0.5px;">운영센터</div>
                </div>
            </div>
        </div>
    `;

    const summaryHtml = `
        <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:10px; margin-bottom:32px;">
            <div class="card" onclick="openAdminStudentList('active')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:700; color:var(--primary);">${activeStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">재원생</div>
            </div>
            <div class="card" onclick="openAdminStudentList('new')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:700; color:var(--success);">${newStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">신규</div>
            </div>
            <div class="card" onclick="openAdminStudentList('discharged')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:20px; font-weight:700; color:var(--secondary);">${dischargedStudents.length}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:600; margin-top:4px;">퇴원생</div>
            </div>
            <div class="card" onclick="openAdminStudentList('risk')" style="cursor:pointer; padding:16px 8px; text-align:center; margin:0; border:1px solid ${risks.length > 0 ? 'rgba(255,71,87,0.3)' : 'var(--border)'}; border-radius:16px; background:${risks.length > 0 ? 'rgba(255,71,87,0.05)' : 'var(--surface)'};">
                <div style="font-size:20px; font-weight:700; color:var(--error);">${risks.length}</div>
                <div style="font-size:11px; color:var(--error); font-weight:600; margin-top:4px;">관리필요</div>
            </div>
        </div>
    `;

    const teacherCardsHtml = `
        <div style="margin-bottom:32px;">
            <div style="margin-bottom:12px;">
                <h3 style="margin:0; font-size:16px; font-weight:700; color:var(--text);">선생님</h3>
            </div>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px;">
                ${renderAdminTeacherCards(todayStr)}
            </div>
        </div>
    `;

    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');
    const upcomingSchedules = (state.db.exam_schedules || []).filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr).sort((a,b) => a.exam_date.localeCompare(b.exam_date));
    const upcomingAcademySchedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1' && s.schedule_date > todayStr && s.schedule_date <= nextWeekStr);
    const adminScheduleItems = [];
    upcomingSchedules.forEach(e => adminScheduleItems.push({ type: 'exam', date: e.exam_date, item: e }));
    upcomingAcademySchedules.forEach(s => adminScheduleItems.push({ type: 'academy', date: s.schedule_date, item: s }));
    adminScheduleItems.sort((a,b) => a.date.localeCompare(b.date));
    const adminScheduleHtml = `
        <div style="margin-bottom:32px;">
            <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:var(--secondary);">주간일정</h3>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${adminScheduleItems.length > 0 ? adminScheduleItems.map(u => {
                    if (u.type === 'academy') {
                        const s = u.item;
                        const tone = getAcademyScheduleToneForDashboard(s.schedule_type);
                        const dateLabel = apFormatMonthDay(s.schedule_date) || s.schedule_date;
                        return `<div onclick="openExamScheduleModal('', 'academy')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px;"><div style="font-weight:700; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(buildAcademyScheduleTitleForDashboard(s))}</div><div style="color:${tone.color}; font-size:11px; font-weight:600; white-space:nowrap; background:${tone.bg}; border:1px solid ${tone.border}; padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`;
                    }
                    const e = u.item;
                    const dateLabel = apFormatMonthDay(e.exam_date) || e.exam_date; 
                    const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:600;">${apEscapeHtml(e.grade)}</span> ` : '<span style="color:var(--secondary); font-weight:600;">학교공통</span> '; 
                    return `<div style="display:flex; justify-content:space-between; align-items:center; padding:14px 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px;"><div><b style="font-weight:700; color:var(--text);">${apEscapeHtml(e.school_name)}</b> ${gradeLabel}${apEscapeHtml(e.exam_name)}</div><div style="color:var(--primary); font-size:11px; font-weight:600; white-space:nowrap; background:rgba(26,92,255,0.1); padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`; 
                }).join('') : `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px; font-weight:600;">이번 주 예정된 일정이 없습니다.</div>`}
            </div>
        </div>
    `;
    
    const riskRows = risks.slice(0, 5).map(r => `
        <div class="card" style="padding:14px 16px; border:1px solid rgba(255,71,87,0.2); border-radius:14px; margin-bottom:10px; background:rgba(255,71,87,0.05); cursor:pointer; transition:background 0.2s;" onclick="renderStudentDetail('${r.student.id}')">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="min-width:0;">
                    <div style="font-weight:700; color:var(--text); font-size:14px;">${apEscapeHtml(r.student.name)}</div>
                    <div style="font-size:12px; color:var(--error); font-weight:600; margin-top:4px;">${apEscapeHtml(r.className)} · ${apEscapeHtml(r.reasons.slice(0,2).join(' · '))}</div>
                </div>
                <div style="display:flex; gap:6px; align-items:center; flex-shrink:0;"><button class="btn btn-primary" style="min-height:36px; padding:7px 10px; font-size:11px; font-weight:700; border-radius:10px; box-shadow:none;" onclick="event.stopPropagation(); openRiskStudentReport('${r.student.id}')">\uBB38\uAD6C \uC0DD\uC131</button><span style="font-size:12px; color:var(--error); font-weight:700; white-space:nowrap;">\uC0C1\uC138 \uBCF4\uAE30</span></div>
            </div>
        </div>
    `).join('');
    
    const riskSectionHtml = `
        <div style="margin-bottom:40px;">
            <h3 style="margin:0 0 12px 0; font-size:15px; font-weight:700; color:var(--error);">관리필요 학생 ${risks.length}명</h3>
            ${risks.length > 0 ? riskRows : `<div style="text-align:center; padding:20px; color:var(--success); font-weight:600; background:rgba(0,208,132,0.1); border-radius:16px;">현재 관리 필요 징후를 보이는 학생이 없습니다.</div>`}
        </div>
    `;

    root.innerHTML = headerHtml + operationStatusHtml + summaryHtml + teacherCardsHtml + adminScheduleHtml + riskSectionHtml;
}

function renderAdminStudentSearch() {
    const inputEl = document.getElementById('admin-search-input');
    const resultArea = document.getElementById('admin-search-results');
    if (!inputEl || !resultArea) return;

    const keyword = inputEl.value.trim().toLowerCase();
    if (!keyword) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">검색어를 입력하세요.</div>`; return; }
    
    const results = state.db.students.filter(s => s.name.toLowerCase().includes(keyword));
    if (results.length === 0) { resultArea.innerHTML = `<div style="color:var(--secondary); font-size:13px; text-align:center; padding:10px;">일치하는 학생이 없습니다.</div>`; return; }
    
    resultArea.innerHTML = results.map(s => {
        const cName = state.db.classes.find(c => c.id === state.db.class_students.find(m => m.student_id === s.id)?.class_id)?.name || '미배정';
        return `
            <div style="padding:10px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
                <div><b style="font-size:13px; color:var(--text);">${apEscapeHtml(s.name)}</b> <span style="font-size:11px; color:var(--secondary); margin-left:6px;">${apEscapeHtml(cName)} | ${apEscapeHtml(s.status)}</span></div>
                <button class="btn" style="padding:6px 10px; font-size:11px;" onclick="renderStudentDetail('${s.id}')">상세 보기</button>
            </div>
        `;
    }).join('');
}


// --- Teacher Dashboard 공통 함수 ---

// Management, textbook, memo, and schedule modal functions are loaded from their split files.

// [Phase 4/5] 글로벌 진입점
function openGlobalExamGradeView() {
    const classes = state.db.classes.filter(c => Number(c.is_active) !== 0);
    const rows = classes.map(c => `
        <button class="btn" style="width:100%; justify-content:space-between; padding:16px; margin-bottom:10px; background:var(--surface); border:1px solid var(--border);" onclick="closeModal(); if(typeof openExamGradeView==='function') openExamGradeView('${c.id}')">
            <span style="font-weight:700; font-size:15px; color:var(--text);">${apEscapeHtml(c.name)}</span>
            <span style="font-size:12px; font-weight:700; color:var(--primary); background:rgba(26,92,255,0.1); padding:4px 10px; border-radius:8px;">${apEscapeHtml(c.grade)}</span>
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

    showModal('시스템·동기화 상태', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="padding:16px; border-radius:14px; background:var(--surface-2); border:none;">
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
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const parts = todayStr.split('-');
    const today = String(new Date(parts[0], parts[1]-1, parts[2]).getDay());

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
    const today = getDashboardTodayStr();
    const activeStudents = state.db.students.filter(s => s.status === '재원');
    const todayClosedInfo = getDashboardClosedStudentIdsForDate(activeStudents.map(s => s.id), today);
    
    const scheduledActiveStudents = todayClosedInfo.hasGlobalClosed ? [] : activeStudents.filter(s => {
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && Number(cls.is_active) === 0) return false;
        if (!isClassScheduledTodayForDashboard(cid)) return false;
        return !todayClosedInfo.closedStudentIds.has(String(s.id));
    });
    
    const scheduledIds = new Set(scheduledActiveStudents.map(s => s.id));
    
    const absentCount = state.db.attendance.filter(a => a.date === today && a.status === '결석' && scheduledIds.has(a.student_id)).length;
    const presentCount = scheduledActiveStudents.length - absentCount;
    
    const hwNotDoneCount = state.db.homework.filter(h => h.date === today && h.status === '미완료' && scheduledIds.has(h.student_id)).length;

    const todoCount = state.db.operation_memos.filter(m => {
        const isDone = m.is_done == 1 || m.is_done === true;
        const isPinned = m.is_pinned == 1 || m.is_pinned === true;
        return !isDone && (isPinned || m.memo_date === today);
    }).length;

    const classSummaries = {};
    state.db.classes.filter(c => Number(c.is_active) !== 0).forEach(c => {
        const cIds = state.db.class_students.filter(m => m.class_id === c.id).map(m => m.student_id);
        const cClosedInfo = getDashboardClosedStudentIdsForDate(cIds, today);
        const cActiveIds = cClosedInfo.hasGlobalClosed ? [] : activeStudents
            .filter(s => cIds.includes(s.id) && !cClosedInfo.closedStudentIds.has(String(s.id)))
            .map(s => s.id);
        let cMiss=0, cAbs=0;
        
        cActiveIds.forEach(id => {
            const att = state.db.attendance.find(a => a.student_id===id && a.date===today);
            if (att?.status === '결석') cAbs++;
            
            const hw = state.db.homework.find(h => h.student_id===id && h.date===today);
            if (hw?.status === '미완료') cMiss++;
        });
        
        let cPre = cActiveIds.length - cAbs;
        classSummaries[c.id] = { activeCount: cActiveIds.length, present: cPre, absent: cAbs, hwNotDone: cMiss, isScheduled: isClassScheduledTodayForDashboard(c.id) };
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

function openDashboardClass(cid) {
    const safeCid = String(cid || '');
    if (!safeCid) {
        toast('학급 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    if (!state.ui) state.ui = {};
    state.ui.currentClassId = safeCid;

    if (typeof renderClass === 'function') {
        renderClass(safeCid);
        return;
    }

    if (typeof window !== 'undefined' && typeof window.renderClass === 'function') {
        window.renderClass(safeCid);
        return;
    }

    console.error('[AP Math OS] renderClass is not available. classroom.js load/order check required.', safeCid);
    toast('학급 화면 모듈을 불러오지 못했습니다.', 'error');
}

// [POLISH] 학급 카드: 수평적 미니멀리즘 레이아웃
function renderClassSummaryCard(cls, data) {
    const s = data.classSummaries[cls.id]; if (!s) return '';

    if (!s.isScheduled) {
        return `
            <div onclick="openDashboardClass('${cls.id}')" style="cursor:pointer; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; padding:14px 16px; border-radius:16px; background:var(--surface-2); border:1px solid var(--border); box-shadow:0 2px 8px rgba(0,0,0,0.04); overflow:hidden;">
                <div style="font-weight:700; font-size:15px; color:var(--secondary); margin-bottom:12px;">${apEscapeHtml(cls.name)}</div>
                <div style="font-size:13px; font-weight:700; color:var(--secondary); background:var(--surface); padding:8px 10px; border-radius:10px; text-align:left;">오늘 수업 없음</div>
            </div>
        `;
    }

    const gradientBg = 'linear-gradient(135deg, rgba(26,92,255,0.04) 0%, var(--surface) 100%)';
    const borderColor = 'rgba(26,92,255,0.14)';
    const shadowColor = 'rgba(26,92,255,0.06)';

    return `
        <div onclick="openDashboardClass('${cls.id}')" style="cursor:pointer; display:flex; flex-direction:column; justify-content:space-between; min-height:100px; padding:14px 16px; border-radius:16px; background:${gradientBg}; border:1px solid ${borderColor}; box-shadow:0 4px 14px ${shadowColor}; overflow:hidden;">
            <div style="font-weight:700; font-size:15px; color:var(--text); margin-bottom:14px;">${apEscapeHtml(cls.name)}</div>
            <div style="display:flex; gap:6px; align-items:center;">
                <div style="background:var(--bg); border-radius:10px; padding:6px 10px; font-size:11px; font-weight:700; color:var(--secondary); border:1px solid var(--border);">재원 <span style="font-weight:700; color:var(--text); margin-left:2px;">${s.activeCount}</span></div>
                <div style="background:var(--bg); border-radius:10px; padding:6px 10px; font-size:11px; font-weight:700; color:var(--secondary); border:1px solid var(--border);">등원 <span style="font-weight:700; color:var(--success); margin-left:2px;">${s.present}</span></div>
                <div style="background:var(--bg); border-radius:10px; padding:6px 10px; font-size:11px; font-weight:700; color:var(--secondary); border:1px solid var(--border);">결석 <span style="font-weight:700; color:${s.absent > 0 ? 'var(--error)' : 'var(--text)'}; margin-left:2px;">${s.absent}</span></div>
            </div>
        </div>
    `;
}

// [POLISH] 일정 섹션: 오렌지(오늘) vs 보라(주간) 은은한 컬러 분리
function renderTodoSections() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');
    const getMemoDate = (m) => String(m.memo_date || m.memoDate || m.date || '').split('T')[0].split(' ')[0];
    const isMemoDone = (m) => m.is_done == 1 || m.is_done === true || m.isDone === true;
    const isMemoPinned = (m) => m.is_pinned == 1 || m.is_pinned === true || m.isPinned === true;

    const todayMemos = state.db.operation_memos.filter(m => {
        const memoDate = getMemoDate(m);
        return !isMemoDone(m) && (isMemoPinned(m) || memoDate === todayStr);
    });
    
    const upcomingMemos = state.db.operation_memos.filter(m => {
        const memoDate = getMemoDate(m);
        return !isMemoDone(m) && !isMemoPinned(m) && memoDate > todayStr && memoDate <= nextWeekStr;
    });
    
    const upcomingExams = state.db.exam_schedules.filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr);
    const todayAcademySchedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1' && s.schedule_date === todayStr);
    const upcomingAcademySchedules = (state.db.academy_schedules || []).filter(s => String(s.is_deleted || 0) !== '1' && s.schedule_date > todayStr && s.schedule_date <= nextWeekStr);

    let todayHtml = todayMemos.length ? todayMemos.map(m => {
        const isPinned = isMemoPinned(m);
        return `
        <div style="padding:14px 16px; border-bottom:1px solid rgba(255,165,2,0.1); display:flex; justify-content:space-between; align-items:center; background:transparent;">
            <label onclick="event.stopPropagation()" style="display:flex; align-items:center; gap:12px; flex:1; cursor:pointer;">
                <input type="checkbox" onclick="event.stopPropagation()" onchange="toggleMemoDone('${m.id}', this.checked)" style="transform:scale(1.15); margin:0; accent-color:rgba(255,165,2,0.8);">
                <span style="font-size:15px; font-weight:700; color:var(--text); ${isPinned ? 'color:var(--primary);' : ''}">${isPinned ? `<span style="background:rgba(26,92,255,0.1); padding:2px 6px; border-radius:10px; font-size:11px; margin-right:6px;">고정</span> ` : ''}${apEscapeHtml(m.content)}</span>
            </label>
        </div>
    `}).join('') : `<div style="font-size:13px; font-weight:600; color:var(--secondary); padding:24px; text-align:center;">오늘 등록된 할 일이 없습니다.</div>`;

    if (todayAcademySchedules.length) {
        const todayAcademyHtml = todayAcademySchedules.map(s => {
            const tone = getAcademyScheduleToneForDashboard(s.schedule_type);
            return `<div onclick="event.stopPropagation(); openExamScheduleModal('', 'academy')" style="cursor:pointer; padding:14px 16px; border-bottom:1px solid rgba(255,165,2,0.1); display:flex; justify-content:space-between; align-items:center; gap:10px; background:transparent;"><div style="font-size:13px; font-weight:700; color:var(--text); overflow-wrap:anywhere;">${apEscapeHtml(buildAcademyScheduleTitleForDashboard(s))}</div><span style="font-size:11px; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:4px 8px; border-radius:10px; font-weight:600; white-space:nowrap;">${getAcademyScheduleTypeLabelForDashboard(s.schedule_type)}</span></div>`;
        }).join('');
        todayHtml = todayMemos.length ? `${todayHtml}${todayAcademyHtml}` : todayAcademyHtml;
    }

    let upcomingHtml = '';
    const upcomingItems = [];
    upcomingMemos.forEach(m => upcomingItems.push({ type: 'memo', date: getMemoDate(m), item: m }));
    upcomingExams.forEach(e => upcomingItems.push({ type: 'exam', date: e.exam_date, item: e }));
    upcomingAcademySchedules.forEach(s => upcomingItems.push({ type: 'academy', date: s.schedule_date, item: s }));
    
    upcomingItems.sort((a,b) => a.date.localeCompare(b.date));

    if (upcomingItems.length) {
        upcomingHtml = upcomingItems.slice(0, 5).map(u => {
            const timeVal = apParseLocalDateTime(u.date);
            const diffTime = timeVal !== null ? (timeVal - todayTime) : 0;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const dDay = diffDays === 0 ? 'D-Day' : `D-${diffDays}`;

            if (u.type === 'exam') {
                const e = u.item;
                const displayTitle = e.exam_name ? `${apEscapeHtml(e.school_name || '일반')} ${apEscapeHtml(e.grade || '')} ${apEscapeHtml(e.exam_name)}` : `${apEscapeHtml(e.school_name || '일정 확인')}`;
                return `<div onclick="openExamScheduleModal()" style="cursor:pointer; padding:14px 16px; font-size:13px; font-weight:700; color:var(--text); border-bottom:1px solid rgba(110,84,255,0.08); display:flex; justify-content:space-between; align-items:center; background:transparent;"><div>${displayTitle}</div><span style="font-size:11px; color:rgba(110,84,255,0.8); background:rgba(110,84,255,0.08); padding:4px 8px; border-radius:10px; font-weight:700;">${dDay}</span></div>`;
            } else if (u.type === 'academy') {
                const s = u.item;
                const tone = getAcademyScheduleToneForDashboard(s.schedule_type);
                return `<div onclick="openExamScheduleModal('', 'academy')" style="cursor:pointer; padding:14px 16px; font-size:13px; font-weight:700; color:var(--text); border-bottom:1px solid rgba(110,84,255,0.08); display:flex; justify-content:space-between; align-items:center; gap:10px; background:transparent;"><div>${apEscapeHtml(buildAcademyScheduleTitleForDashboard(s))}</div><span style="font-size:11px; color:${tone.color}; background:${tone.bg}; border:1px solid ${tone.border}; padding:4px 8px; border-radius:10px; font-weight:600; white-space:nowrap;">${dDay}</span></div>`;
            } else {
                return `<div onclick="openTodoMemoModal()" style="cursor:pointer; padding:14px 16px; font-size:13px; font-weight:700; color:var(--text); border-bottom:1px solid rgba(110,84,255,0.08); display:flex; justify-content:space-between; align-items:center; background:transparent;"><div>${apEscapeHtml(u.item.content)}</div><span style="font-size:11px; background:rgba(110,84,255,0.08); color:rgba(110,84,255,0.8); padding:4px 8px; border-radius:10px; font-weight:700;">${dDay}</span></div>`;
            }
        }).join('');
    }

    return `
        <div style="margin-bottom:18px;">
            <div onclick="openTodoMemoModal()" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px; cursor:pointer;">
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">오늘일정</h3>
                <span style="font-size:11px; font-weight:700; color:var(--secondary);">관리</span>
            </div>
            <div onclick="openTodoMemoModal()" style="cursor:pointer; margin-bottom:18px; overflow:hidden; border-radius:16px; border:1px solid rgba(255,165,2,0.20); background:rgba(255,165,2,0.04); box-shadow:0 4px 12px rgba(255,165,2,0.04);">${todayHtml}</div>
            
            ${upcomingHtml ? `
                <div onclick="openExamScheduleModal()" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px; cursor:pointer;">
                    <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">주간일정</h3>
                    <span style="font-size:11px; font-weight:700; color:var(--secondary);">관리</span>
                </div>
<div style="overflow:hidden; border-radius:16px; border:1px solid rgba(110,84,255,0.15); background:rgba(110,84,255,0.03); box-shadow:0 4px 12px rgba(110,84,255,0.03);">${upcomingHtml}</div>            ` : ''}
        </div>
    `;
}

// [NEW] 오늘일지 카드 생성 함수 (요일 필터 정밀 적용)
function renderTodayJournalCard(data) {
    const todayClasses = state.db.classes.filter(c => {
        if (Number(c.is_active) === 0) return false;
        if (!isMiddleSchoolClass(c)) return false;
        if (!isClassVisibleForCurrentTeacher(c)) return false;

        const summary = data.classSummaries[c.id];
        // [Partner B] summary.isScheduled가 실제 요일 필터링 값을 가지고 있음
        if (!summary || !summary.isScheduled || summary.activeCount === 0) return false;
        return true;
    });

    let contentHtml = '';
    if (todayClasses.length === 0) {
        contentHtml = `<div style="font-size:13px; font-weight:600; color:var(--secondary); text-align:center; padding:18px 12px;">오늘 수업반 없음</div>`;
    } else {
        const classStrings = todayClasses.map(c => {
            const summary = data.classSummaries[c.id];
            return `${apEscapeHtml(c.name)} ${summary.present}/${summary.activeCount}`;
        });
        contentHtml = `<div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.55;">${classStrings.join(' · ')}</div>`;
    }

    return `
        <div style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">오늘일지</h3>
            </div>
            <div onclick="if(typeof openDailyJournalModal === 'function') openDailyJournalModal(); else toast('일지 기능을 불러오지 못했습니다.', 'warn');" style="background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:14px 16px; cursor:pointer; box-shadow:var(--shadow); display:flex; justify-content:space-between; align-items:center; gap:12px;">
                <div style="min-width:0; flex:1;">${contentHtml}</div>
                <span style="font-size:18px; font-weight:700; color:var(--primary); line-height:1; flex:0 0 auto;">›</span>
            </div>
        </div>
    `;
}

// [POLISH] 메인 대시보드: 제목 규격화 및 마감 배너 시각적 축소
function renderDashboard() {
    state.ui.currentClassId = null;
    if (typeof renderAppDrawer === 'function') renderAppDrawer();
    const data = computeDashboardData();
    const root = document.getElementById('app-root');

    const todayJournalCard = renderTodayJournalCard(data);
    const operationStatusCard = renderDashboardOperationStatusCard(data);

    const todoSections = renderTodoSections();
    
    // [Partner B] 대시보드 학급 목록에서도 필터링된 결과와 동기화
    const classes = sortClassesForDashboard(state.db.classes.filter(c => Number(c.is_active) !== 0));
    const classStatus = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:0 4px;">
            <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">학급관리</h3>
        </div>
        <div class="grid" style="margin-bottom:40px; display:grid; grid-template-columns:repeat(auto-fill, minmax(min(260px, 100%), 1fr)); gap:12px;">${classes.map(c => renderClassSummaryCard(c, data)).join('')}</div>
    `;

    root.innerHTML = `<div style="width:100%; max-width:none; margin:0; padding:0 16px 24px; box-sizing:border-box;">${operationStatusCard}${todayJournalCard}${todoSections}${classStatus}</div>`;
}

// [RESTORE] computeTodayCloseData: 원본 복구
function computeTodayCloseData() {
    const today = new Date().toLocaleDateString('sv-SE');

    const scheduledActive = state.db.students.filter(s => {
        if (s.status !== '재원') return false;
        const cid = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cls = state.db.classes.find(c => c.id === cid);
        if (cls && Number(cls.is_active) === 0) return false;
        return isClassScheduledTodayForDashboard(cid);
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

// [RESTORE] quickToggleAtt: 원본 복구
async function quickToggleAtt(sid, status, tab = 'att') {
    const today = new Date().toLocaleDateString('sv-SE');
    const r = await api.patch('attendance', { studentId: sid, status, date: today });
    if (!r?.success) { toast('출결 처리 실패', 'warn'); return; }
    await refreshDataOnly();
    openTodayCloseModal(tab);
}

// [RESTORE] quickToggleHw: 원본 복구
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

    // [Master Fix] 학급 정렬 알고리즘 적용
    const sortedClassNames = Object.keys(grouped).sort((a, b) => {
        const clsA = state.db.classes.find(c => c.name === a);
        const clsB = state.db.classes.find(c => c.name === b);
        const rankA = clsA ? getClassGradeRank(clsA.grade) : 99;
        const rankB = clsB ? getClassGradeRank(clsB.grade) : 99;
        if (rankA !== rankB) return rankA - rankB;
        return a.localeCompare(b);
    });

    const rows = cur.list.length
        ? sortedClassNames.map(cName => {
            const classHeader = `<div style="background:var(--surface-2); padding:8px 12px; font-size:12px; font-weight:700; color:var(--secondary); margin-top:12px; border-radius:8px;">${apEscapeHtml(cName)}</div>`;
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
                                <span style="font-weight:700; font-size:15px; color:var(--text);">${apEscapeHtml(s.name)}</span>
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

// [RESTORE] getTodayExamConfig: 원본 복구
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

// [RESTORE] setTodayExamConfig: 원본 복구
function setTodayExamConfig(title, q) {
    const today = new Date().toLocaleDateString('sv-SE');
    const validQ = parseInt(q, 10) || 20;
    localStorage.setItem('AP_TODAY_EXAM', JSON.stringify({ date: today, title: String(title), q: validQ }));
}

// [RESTORE] clearTodayExamConfig: 원본 복구
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

function buildJournalContent(dateStr) {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    let text = `[AP Math 운영 일지 - ${targetDate}]\n작성자: ${state.ui.userName}\n\n`;

    const parts = targetDate.split('-');
    const targetDayIdx = String(new Date(parts[0], parts[1]-1, parts[2]).getDay());

    const activeClasses = state.db.classes.filter(c => {
        if (Number(c.is_active) === 0) return false;
        if (!isMiddleSchoolClass(c)) return false;
        if (!isClassVisibleForCurrentTeacher(c)) return false;

        // 수업 요일이 비어 있으면 매일 수업으로 간주한다.
        if (!c.schedule_days) return true;

        // 제출일/선택일 기준 해당 요일 반만 출력한다.
        return String(c.schedule_days)
            .split(',')
            .map(v => v.trim())
            .includes(targetDayIdx);
    });

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
            cns.forEach(cn => {
                const sName = students.find(s => String(s.id) === String(cn.student_id))?.name || '학생';
                text += `  * ${sName}: ${cn.content}\n`;
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
            <button class="btn btn-primary" style="flex:1; padding:14px; font-weight:700;" onclick="saveJournal('제출완료', null, '${targetDate}')">제출</button>
        `;
    } else if (status === '제출완료') {
        actionBtns = `
            <button class="btn" style="flex:1; padding:14px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.1); border:none;" onclick="saveJournal('작성중', '${myJournal.id}', '${targetDate}')">제출 취소 및 수정</button>
        `;
    }

    showModal('일지', `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:10px 14px; border-radius:10px;">
            <b style="font-size:13px; color:var(--secondary);">작성 기준일</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:700; color:var(--text);" onchange="openDailyJournalModal(this.value)">
        </div>
        ${status === '결재완료' ? `
            <div style="background:rgba(0,208,132,0.1); color:var(--success); padding:16px; border-radius:12px; margin-bottom:16px;">
                <b style="display:flex; align-items:center; gap:8px; font-size:14px;">원장님 확인 완료</b>
                ${myJournal.feedback ? `<div style="margin-top:10px; font-size:13px; background:var(--surface); padding:12px; border-radius:8px; color:var(--text);"><b>피드백:</b><br>${apEscapeHtml(myJournal.feedback)}</div>` : ''}
            </div>
        ` : ''}
        <textarea id="journal-content" class="btn" style="width:100%; height:250px; text-align:left; resize:vertical; font-family:inherit; font-size:14px; line-height:1.6; background:${isLocked ? 'var(--surface-2)' : 'var(--surface)'}; border:1px solid var(--border); color:var(--text);" ${isLocked ? 'readonly' : ''}>${apEscapeHtml(content)}</textarea>
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
    
    const backBtn = teacherName ? `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:700; background:var(--surface-2); border:none; color:var(--text);" onclick="openAdminTeacherPanel('${safeTeacher}')">← 선생님 메뉴</button>` : '';
    
    const rows = journals.map(j => {
        const teacherArg = String(teacherName || j.teacher_name || '').replace(/'/g, "\\'");
        const statusText = j.status === '결재완료' ? '확인완료' : j.status;
        const statusColor = j.status === '결재완료' ? 'var(--success)' : 'var(--primary)';
        const statusBg = j.status === '결재완료' ? 'rgba(0,208,132,0.1)' : 'rgba(26,92,255,0.1)';
        
        return `
            <div class="card" style="padding:16px; margin-bottom:12px; cursor:pointer; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); background:var(--surface);" onclick="openAdminJournalFeedback('${j.id}', '${teacherArg}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; gap:8px; align-items:center;">
                    <b style="font-size:15px; color:var(--text);">${apEscapeHtml(j.teacher_name)} 선생님</b>
                    <span style="font-size:11px; font-weight:700; color:${statusColor}; background:${statusBg}; padding:4px 8px; border-radius:6px;">${apEscapeHtml(statusText)}</span>
                </div>
                <div style="font-size:13px; color:var(--text-soft); white-space:pre-wrap; max-height:60px; overflow:hidden; line-height:1.6;">${apEscapeHtml(j.content)}</div>
            </div>`;
    }).join('');
    
    showModal(`${apEscapeHtml(title)}`, `
        ${backBtn}
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:12px 14px; border-radius:12px;">
            <b style="font-size:13px; color:var(--secondary); white-space:nowrap;">기준일</b>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:700; color:var(--text);" onchange="renderAdminJournalList(this.value, '${safeTeacher}')">
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
        <textarea readonly class="btn" style="width:100%; height:200px; text-align:left; resize:vertical; font-size:14px; line-height:1.6; background:var(--surface-2); border:none; border-radius:12px; padding:16px; margin-bottom:12px; color:var(--text);">${apEscapeHtml(journal.content)}</textarea>
        <textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; border:1px solid var(--border); border-radius:12px; padding:14px; font-size:13px; background:var(--surface); color:var(--text);">${apEscapeHtml(journal.feedback || '')}</textarea>
        <div style="margin-top:16px;">
            <button class="btn btn-primary" style="width:100%; padding:16px; border-radius:14px; font-weight:700; font-size:15px;" onclick="approveJournal('${journal.id}', '${journal.date}', '${safeTeacher}')">확인완료</button>
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
    const activeClasses = state.db.classes.filter(c => Number(c.is_active) !== 0);
    const teacherMap = {};
    activeClasses.forEach(c => {
        const tName = String(c.teacher_name || '담당').trim();
        if (!teacherMap[tName]) teacherMap[tName] = [];
        teacherMap[tName].push(c);
    });
    const teacherNames = Object.keys(teacherMap).filter(Boolean);
    if (!teacherNames.length) return `<div style="text-align:center; padding:24px; color:var(--secondary); font-weight:600; background:var(--surface-2); border-radius:16px;">등록된 선생님이 없습니다.</div>`;
    
    return teacherNames.map(tName => {
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
                    <div style="width:46px; height:46px; border-radius:14px; background:var(--surface-2); color:var(--primary); display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; flex-shrink:0;">${tName.charAt(0)}</div>
                    <div style="min-width:0; flex:1;">
                        <div style="font-size:16px; font-weight:700; color:var(--text); line-height:1.2;">${apEscapeHtml(tName)} 선생님</div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:600; margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">반 ${myClasses.length}개 · 학생 ${activeStudentCount}명</div>
                    </div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface-2); border-radius:10px; padding:10px 12px;">
                    <span style="font-size:12px; color:var(--secondary); font-weight:700;">오늘 일지</span>
                    <span style="font-size:11px; color:${statusColor}; background:${statusBg}; padding:4px 8px; border-radius:6px; font-weight:700;">${journalStatus}</span>
                </div>
            </div>`;
    }).join('');
}

function openAdminTeacherPanel(teacherName) {
    state.ui.currentAdminTeacherName = teacherName;
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    showModal(`${apEscapeHtml(teacherName)} 선생님`, `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <button class="btn btn-primary" style="padding:16px; font-size:14px; font-weight:700; border-radius:16px;" onclick="closeModal(); renderAdminJournalList(new Date().toLocaleDateString('sv-SE'), '${safeName}')">일지확인</button>
            <button class="btn" style="padding:16px; font-size:14px; font-weight:700; border-radius:16px; background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); color:var(--text);" onclick="closeModal(); renderAdminTeacherStudents('${safeName}')">학생확인</button>
        </div>
    `);
}

function renderAdminTeacherStudents(teacherName) {
    const safeName = String(teacherName || '').replace(/'/g, "\\'");
    const myClasses = state.db.classes.filter(c => String(c.teacher_name || '담당').trim() === teacherName && Number(c.is_active) !== 0);
    
    let html = `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:700; background:var(--surface-2); border:none; color:var(--text);" onclick="openAdminTeacherPanel('${safeName}')">← 선생님 메뉴</button><div style="max-height:60vh; overflow-y:auto; display:flex; flex-direction:column; gap:16px; padding-right:4px;">`;
    
    if (!myClasses.length) {
        html += `<div style="text-align:center; padding:30px; color:var(--secondary); font-weight:600; background:var(--surface-2); border-radius:16px;">담당 학급 또는 재원생이 없습니다.</div>`;
    } else {
        myClasses.forEach(cls => { 
            const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cls.id)).map(m => String(m.student_id)); 
            const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원'); 
            
            html += `<div style="background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden;">
                        <div style="padding:14px 16px; background:var(--surface-2); font-weight:700; color:var(--text); display:flex; justify-content:space-between; border-bottom:1px solid var(--border);">
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
