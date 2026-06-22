/**
 * AP Math OS [js/dashboard-admin.js]
 * 원장님(admin) 전용 대시보드 렌더러
 * renderAdminControlCenter() 렌더 완료 후 AP MATH / EIE 게이트를 안전하게 삽입한다.
 */

function apAdminDashboardRole() {
    return String((typeof state !== 'undefined' && state?.auth?.role) || '').toLowerCase();
}

function apAdminAcademyScheduleSeries(fromDate, toDate) {
    const groups = new Map();
    (state.db.academy_schedules || [])
        .filter(s => String(s.is_deleted || 0) !== '1' && String(s.target_scope || 'global') === 'global')
        .forEach((row) => {
            const key = String(row.series_id || row.id || '');
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(row);
        });

    return [...groups.values()].map((rows) => {
        rows.sort((a, b) => String(a.schedule_date || '').localeCompare(String(b.schedule_date || '')));
        const first = rows[0];
        const last = rows[rows.length - 1] || first;
        const visibleDate = rows.find(row => row.schedule_date >= fromDate && row.schedule_date <= toDate)?.schedule_date || '';
        return {
            ...first,
            schedule_date: visibleDate,
            range_start: first.schedule_date || '',
            range_end: last.schedule_date || first.schedule_date || '',
            occurrence_count: rows.length
        };
    }).filter(item => item.schedule_date);
}

function apRemoveAdminSystemGate() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
}

function apCreateAdminSystemGate() {
    const gate = document.createElement('div');
    gate.id = 'ap-system-gate';
    gate.className = 'owner-brand-tabs ap-admin-app-gate ap-surface-toolbar ap-surface-toolbar--two';
    gate.setAttribute('data-ap-system-gate', 'true');
    gate.setAttribute('role', 'navigation');
    gate.setAttribute('aria-label', '시스템 전환');
    gate.innerHTML = `
        <button class="owner-brand-tab owner-brand-tab--current btn ap-surface-action ap-surface-action--current"
                type="button"
                aria-current="page"
                onclick="void(0)">
            AP MATH
        </button>
        <button class="owner-brand-tab btn ap-surface-action"
                type="button"
                aria-label="EIE 대시보드로 이동"
                onclick="location.replace('../eie/index.html#dashboard')">
            EIE
        </button>
    `;

    return gate;
}

function apInsertAdminSystemGate(attempt = 0) {
    if (typeof document === 'undefined') return false;

    if (apAdminDashboardRole() !== 'admin') {
        document.body.classList.remove('ap-owner-dashboard-bg');
        apRemoveAdminSystemGate();
        return false;
    }

    const adminDash = document.getElementById('ap-admin-dashboard');
    if (!adminDash) {
        if (attempt === 0 && typeof requestAnimationFrame === 'function') {
            requestAnimationFrame(() => apInsertAdminSystemGate(1));
            return false;
        }
        if (attempt <= 1 && typeof setTimeout === 'function') {
            setTimeout(() => apInsertAdminSystemGate(2), 0);
            return false;
        }
        console.warn('[APMS dashboard-admin] #ap-admin-dashboard를 찾지 못해 AP/EIE 게이트를 삽입하지 못했습니다.');
        return false;
    }

    const existingGate = adminDash.querySelector('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]');
    if (existingGate) return true;

    apRemoveAdminSystemGate();
    adminDash.insertBefore(apCreateAdminSystemGate(), adminDash.firstChild);
    return true;
}


const AP_ADMIN_DIAGNOSTIC_RESULTS_LIST_KEY = 'apms.diagnostic.assessment.results';
const AP_ADMIN_DIAGNOSTIC_RESULT_PREFIX = 'apms.diagnostic.assessment.result.';
const AP_ADMIN_DIAGNOSTIC_ALERT_LIMIT = 10;

function apParseAdminDiagnosticJson(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
}

function apGetAdminDiagnosticItemTime(item) {
    const raw = item?.updatedAt || item?.completedAt || '';
    const time = raw ? Date.parse(raw) : 0;
    return Number.isFinite(time) ? time : 0;
}

function apGetAdminDiagnosticDisplayDate(item) {
    const raw = item?.examDate || item?.completedAt || item?.updatedAt || '';
    if (!raw) return '';
    return String(raw).slice(0, 10);
}

function apGetAdminDiagnosticAssessmentList() {
    if (typeof localStorage === 'undefined') return [];
    const list = apParseAdminDiagnosticJson(localStorage.getItem(AP_ADMIN_DIAGNOSTIC_RESULTS_LIST_KEY), []);
    if (!Array.isArray(list)) return [];
    const seen = new Set();
    return list
        .filter(item => item?.status === 'completed')
        .map(item => {
            const diagnosticId = String(item?.diagnosticId || '').trim();
            const detail = diagnosticId
                ? apParseAdminDiagnosticJson(localStorage.getItem(AP_ADMIN_DIAGNOSTIC_RESULT_PREFIX + diagnosticId), null)
                : null;
            return Object.assign({}, item, detail || {});
        })
        .filter(item => {
            const diagnosticId = String(item?.diagnosticId || '').trim();
            const packId = String(item?.packId || '').trim();
            if (!diagnosticId || !packId || seen.has(diagnosticId)) return false;
            seen.add(diagnosticId);
            return true;
        })
        .sort((a, b) => apGetAdminDiagnosticItemTime(b) - apGetAdminDiagnosticItemTime(a))
        .slice(0, AP_ADMIN_DIAGNOSTIC_ALERT_LIMIT);
}

function apBuildAdminDiagnosticReportUrl(item) {
    const diagnosticId = String(item?.diagnosticId || '').trim();
    const packId = String(item?.packId || '').trim();
    if (!diagnosticId || !packId) return '';
    const params = new URLSearchParams();
    params.set('packId', packId);
    params.set('diagnosticId', diagnosticId);
    params.set('mode', 'diagnostic-report');
    return `../archive/assessment/assessment-analysis.html?${params.toString()}`;
}

function openAdminDiagnosticPanel() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('apAdminDiagnosticModal')) return;

    const items = apGetAdminDiagnosticAssessmentList();

    const rows = items.length
        ? items.map(item => {
            const href = apBuildAdminDiagnosticReportUrl(item);
            const studentName = apEscapeHtml(String(item.studentName || '').trim() || '이름 미입력');
            const packTitle = apEscapeHtml(String(item.packTitle || item.title || '진단평가 결과').trim());
            const examDate = apEscapeHtml(apGetAdminDiagnosticDisplayDate(item));
            return `<a class="ap-diag-modal__row" href="${apEscapeHtml(href)}" target="_blank" rel="noopener">
                <span class="ap-diag-modal__name">${studentName}</span>
                <span class="ap-diag-modal__pack">${packTitle}</span>
                <span class="ap-diag-modal__date">${examDate}</span>
                <span class="ap-diag-modal__btn">결과표 열기</span>
            </a>`;
        }).join('')
        : `<p class="ap-diag-modal__empty">완료된 진단평가가 없습니다.</p>`;

    const modal = document.createElement('div');
    modal.id = 'apAdminDiagnosticModal';
    modal.innerHTML = `
        <div class="ap-diag-modal__backdrop" onclick="document.getElementById('apAdminDiagnosticModal')?.remove()"></div>
        <div class="ap-diag-modal__box">
            <div class="ap-diag-modal__header">
                <span>진단평가 결과</span>
                <button onclick="document.getElementById('apAdminDiagnosticModal')?.remove()" aria-label="닫기">✕</button>
            </div>
            <div class="ap-diag-modal__list">${rows}</div>
        </div>
        <style>
            #apAdminDiagnosticModal { position:fixed; inset:0; z-index:9999; display:flex; align-items:center; justify-content:center; }
            #apAdminDiagnosticModal .ap-diag-modal__backdrop { position:absolute; inset:0; background:rgba(0,0,0,.45); }
            #apAdminDiagnosticModal .ap-diag-modal__box { position:relative; background:var(--surface); border-radius:16px; width:min(560px,92vw); max-height:80vh; display:flex; flex-direction:column; box-shadow:0 8px 40px rgba(0,0,0,.18); }
            #apAdminDiagnosticModal .ap-diag-modal__header { display:flex; justify-content:space-between; align-items:center; padding:16px 18px 12px; font-size:15px; font-weight:800; border-bottom:1px solid var(--border); }
            #apAdminDiagnosticModal .ap-diag-modal__header button { background:none; border:none; cursor:pointer; font-size:18px; color:var(--secondary); padding:4px 6px; border-radius:8px; }
            #apAdminDiagnosticModal .ap-diag-modal__list { overflow-y:auto; padding:12px; display:flex; flex-direction:column; gap:8px; }
            #apAdminDiagnosticModal .ap-diag-modal__row { display:grid; grid-template-columns:1fr 1fr auto auto; align-items:center; gap:8px; padding:10px 12px; border:1px solid var(--border); border-radius:12px; background:var(--surface-2); text-decoration:none; color:var(--text); font-size:12px; font-weight:600; }
            #apAdminDiagnosticModal .ap-diag-modal__pack, #apAdminDiagnosticModal .ap-diag-modal__date { color:var(--secondary); }
            #apAdminDiagnosticModal .ap-diag-modal__btn { background:var(--surface); border:1px solid var(--border); border-radius:999px; padding:4px 10px; white-space:nowrap; }
            #apAdminDiagnosticModal .ap-diag-modal__empty { text-align:center; color:var(--secondary); padding:32px 0; font-size:13px; }
            @media (max-width:540px) { #apAdminDiagnosticModal .ap-diag-modal__row { grid-template-columns:1fr auto; } #apAdminDiagnosticModal .ap-diag-modal__pack { display:none; } }
        </style>`;
    document.body.appendChild(modal);
}

window.openAdminDiagnosticPanel = openAdminDiagnosticPanel;

function renderAdminDashboardView() {
    if (typeof document !== 'undefined') {
        document.body.classList.remove('ap-teacher-dashboard-mode');
        document.body.classList.add('ap-owner-dashboard-bg');
        apRemoveAdminSystemGate();
    }

    if (typeof renderAdminControlCenter === 'function') {
        renderAdminControlCenter();
    }

    apInsertAdminSystemGate(0);
}

function openDischargedStudents() {
    openAdminStudentList('discharged');
}

async function restoreDischargedStudent(sid) {
    if (!confirm('이 학생을 재원으로 복구하시겠습니까?')) return;
    const r = await api.patch(`students/${sid}/restore`, {});
    if (r?.success) { await loadData(); openAdminStudentList('discharged'); }
    else toast(r?.message || r?.error || '복구에 실패했습니다.', 'error');
}

async function hideDischargedStudent(sid) {
    if (!confirm('퇴원생 목록에서 숨길까요?')) return;
    const r = await api.patch(`students/${sid}/hide`, {});
    if (r?.success) { await loadData(); openAdminStudentList('discharged'); }
    else toast(r?.message || r?.error || '목록숨김 처리에 실패했습니다.', 'error');
}

async function purgeHiddenStudent(sid) {
    if (!sid) return;
    const first = confirm('이 숨김 학생을 DB에서 완전 삭제할까요?');
    if (!first) return;
    const second = confirm('완전 삭제는 중복 생성된 학생 정리용입니다. 삭제 후 복구할 수 없습니다. 계속할까요?');
    if (!second) return;
    const r = await api.delete('students', `${sid}/purge`);
    if (r?.success) {
        toast('숨김 학생이 완전 삭제되었습니다.', 'info');
        await loadData();
        openAdminStudentList('hidden');
        return;
    }
    toast(r?.message || r?.error || '완전 삭제에 실패했습니다.', 'error');
}

function openAdminStudentList(type) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr);
    let list = [], title = "";

    if (type === 'active') { 
        list = state.db.students.filter(s => adminNormalizeStatus(s.status) === '재원'); 
        title = "재원생 목록"; 
    } else if (type === 'new') { 
        list = state.db.students.filter(s => { 
            if (adminNormalizeStatus(s.status) !== '재원' || !s.created_at || todayTime === null) return false; 
            const createdTime = apParseLocalDateTime(s.created_at);
            if (createdTime === null) return false;
            return (todayTime - createdTime) / (1000*3600*24) <= 60;
        });
        title = "최근 등록 원생"; 
    } else if (type === 'discharged') { 
        list = state.db.students.filter(s => isWithdrawnStudentStatus(s.status));
        title = "퇴원생 목록"; 
    } else if (type === 'hidden') {
        list = state.db.students.filter(s => adminNormalizeStatus(s.status) === '숨김');
        title = "숨김 학생";
    } else if (type === 'risk') { 
        list = computeRiskStudents().map(r => ({ ...r.student, riskInfo: r })); 
        title = "관리필요 학생"; 
    }

    const rows = list.map(s => {
        const cId = state.db.class_students.find(m => m.student_id === s.id)?.class_id;
        const cName = state.db.classes.find(c => c.id === cId)?.name || '미배정';
        let riskDetails = "";
        if (s.riskInfo) { riskDetails = `<div style="font-size:11px; color:var(--error); margin-top:6px; background:rgba(var(--error-rgb),0.10); padding:6px 8px; border-radius:6px; font-weight:600;">상태: ${s.riskInfo.riskTypes.join(', ')} <span style="opacity:0.7; font-weight:normal;">(${s.riskInfo.reasons.join(' · ')})</span></div>`; }
        const actionButtons = type === 'hidden'
            ? `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn btn-primary" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; box-shadow:none; cursor:pointer;" onclick="restoreDischargedStudent('${s.id}')">복구</button>
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; color:var(--error); background:rgba(var(--error-rgb),0.08); border:1px solid rgba(var(--error-rgb),0.16); cursor:pointer;" onclick="purgeHiddenStudent('${s.id}')">완전 삭제</button>
                </div>
            `
            : type === 'discharged'
            ? `
                <div style="display:flex; gap:6px; justify-content:flex-end; flex-wrap:wrap;">
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none; cursor:pointer;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</button>
                    <button class="btn btn-primary" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; box-shadow:none; cursor:pointer;" onclick="restoreDischargedStudent('${s.id}')">복구</button>
                    <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); color:var(--secondary); border:1px solid var(--border); cursor:pointer;" onclick="hideDischargedStudent('${s.id}')">목록숨김</button>
                </div>
            `
            : `<button class="btn" style="padding:8px 12px; font-size:12px; font-weight:500; border-radius:8px; background:var(--surface-2); border:none;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세 보기</button>`;
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
                <div style="flex:1; padding-right:12px;">
                    <div style="font-weight:500; font-size:14px; color:var(--text);">${apEscapeHtml(s.name)} <span style="font-size:12px; color:var(--secondary); font-weight:400; margin-left:4px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <div style="font-size:12px; color:var(--text); font-weight:500; margin-top:4px;">${apEscapeHtml(cName)} <span style="color:var(--secondary); font-weight:500;">| ${apEscapeHtml(s.status)} ${s.created_at ? `| 등록: ${s.created_at.split(' ')[0]}` : ''}</span></div>
                    ${riskDetails}
                </div>
                ${actionButtons}
            </div>
        `;
    }).join('');

    const hiddenSwitch = (type === 'discharged' || type === 'hidden') ? `
        <div style="display:flex; gap:8px; margin:-4px -4px 12px;">
            <button class="btn ${type === 'discharged' ? 'btn-primary' : ''}" style="flex:1; min-height:38px; font-size:12px; font-weight:500; border-radius:12px;" onclick="openAdminStudentList('discharged')">퇴원생</button>
            <button class="btn ${type === 'hidden' ? 'btn-primary' : ''}" style="flex:1; min-height:38px; font-size:12px; font-weight:500; border-radius:12px;" onclick="openAdminStudentList('hidden')">숨김 학생</button>
        </div>
    ` : '';
    const gradeSummary = (type === 'discharged' || type === 'active' || type === 'new') ? adminRenderStudentGradeSummary(list) : '';
    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${hiddenSwitch}${gradeSummary}${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:400;">조회 대상이 없습니다.</div>`}</div>`);
}

function openAdminOperationMenu() {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const isAdmin = String(state?.auth?.role || '') === 'admin';
    const showBillingAccountingFoundationEntry = false;
    const cardStyle = 'padding:16px; border:1px solid var(--border); border-radius:16px; background:var(--surface); text-align:left; cursor:pointer; box-shadow:none; min-height:92px; align-items:flex-start; justify-content:flex-start; flex-direction:column; gap:6px;';
    const titleStyle = 'font-size:14px; font-weight:500; color:var(--text); line-height:1.35;';
    const descStyle = 'font-size:12px; font-weight:500; color:var(--secondary); line-height:1.5; margin-top:4px;';

    showModal('관리', `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;">
            <button class="btn" style="${cardStyle}" onclick="openAdminTeacherAccountManage()">
                <div style="${titleStyle}">선생님 계정</div>
                <div style="${descStyle}">선생님 계정 생성, 권한 수정, 비밀번호 초기화</div>
            </button>
            <button class="btn" style="${cardStyle}" onclick="renderAdminJournalList('${todayStr}')">
                <div style="${titleStyle}">일지 확인</div>
                <div style="${descStyle}">제출된 일지를 날짜별로 확인하고 피드백 작성</div>
            </button>
            <button class="btn" style="${cardStyle}" onclick="openAdminStudentList('discharged')">
                <div style="${titleStyle}">퇴원생 관리</div>
                <div style="${descStyle}">퇴원/숨김 학생 조회, 복구, 중복 생성 정리</div>
            </button>
            ${isAdmin && showBillingAccountingFoundationEntry ? `
            <button class="btn" style="${cardStyle}" onclick="if(typeof openBillingAccountingFoundationModal==='function') openBillingAccountingFoundationModal(); else toast('수납·출납 foundation 화면을 불러오지 못했습니다.', 'warn');">
                <div style="${titleStyle}">수납·출납 foundation</div>
                <div style="${descStyle}">결제수단, 수납 정책, 요약, 조회 목록 확인</div>
            </button>
            ` : ''}
        </div>
    `);
}

function openAdminPinBatchModal() {
    const activeStudents = (state.db.students || []).filter(s => isActiveStudentStatus(s.status));
    const missingPins = activeStudents.filter(s => !String(s.student_pin || '').trim());

    const gradeOrder = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const gradeCounts = gradeOrder
        .map(grade => {
            const total = activeStudents.filter(s => String(s.grade || '').includes(grade)).length;
            const missing = missingPins.filter(s => String(s.grade || '').includes(grade)).length;
            return { grade, total, missing };
        })
        .filter(row => row.total > 0 || row.missing > 0);

    const gradeHtml = gradeCounts.map(row => `
        <div style="display:flex; justify-content:space-between; align-items:center; min-height:32px; padding:6px 0; border-bottom:1px solid var(--border);">
            <span style="font-size:13px; font-weight:500; color:var(--text);">${apEscapeHtml(row.grade)}</span>
            <span style="font-size:12px; font-weight:500; color:var(--secondary);">미발급 ${row.missing}명 / 재원 ${row.total}명</span>
        </div>
    `).join('');

    showModal('PIN 생성', `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div class="ap-soft-note" style="padding:12px 14px;">
                PIN 없는 재원생에게만 학년 규칙에 맞춰 번호를 부여합니다. 기존 PIN은 바뀌지 않습니다.
            </div>

            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:14px;">
                <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:10px; margin-bottom:10px;">
                    <div>
                        <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.35;">미발급 PIN</div>
                        <div style="font-size:12px; font-weight:500; color:var(--secondary); line-height:1.45; margin-top:2px;">대상 ${missingPins.length}명 / 재원 ${activeStudents.length}명</div>
                    </div>
                    <div style="font-size:20px; font-weight:500; color:var(--text); line-height:1;">${missingPins.length}</div>
                </div>
                <button class="btn btn-primary" style="width:100%; min-height:52px; border-radius:14px; font-size:14px; font-weight:500; box-shadow:none;" onclick="handleAdminBatchGeneratePins()" ${missingPins.length ? '' : 'disabled'}>
                    미발급 PIN 생성
                </button>
            </div>

            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:12px 14px;">
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:6px;">학년별 현황</div>
                ${gradeHtml || `<div style="font-size:13px; color:var(--secondary); font-weight:500; text-align:center; padding:16px 0;">재원생 정보가 없습니다.</div>`}
            </div>
        </div>
    `);
}

async function handleAdminBatchGeneratePins() {
    const activeStudents = (state.db.students || []).filter(s => isActiveStudentStatus(s.status));
    const missingPins = activeStudents.filter(s => !String(s.student_pin || '').trim());

    if (!missingPins.length) {
        toast('PIN 미발급 학생이 없습니다.', 'info');
        return;
    }

    if (!confirm(`PIN 없는 학생 ${missingPins.length}명에게 번호를 생성할까요?\n기존 PIN은 바뀌지 않습니다.`)) return;

    try {
        const r = await api.post('students/batch-pins', {});
        if (r?.success) {
            toast(`PIN ${r.count || 0}개 생성 완료`, 'success');
            await loadData();
            openAdminPinBatchModal();
            return;
        }
        toast(r?.message || r?.error || 'PIN 생성에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminBatchGeneratePins] failed:', e);
        toast('PIN 생성 중 오류가 발생했습니다.', 'error');
    }
}

// ─────────────────────────────────────────────
// [Admin Overview] 원장모드 상시 운영 요약
// ─────────────────────────────────────────────

function getAdminClassGradeRank(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function adminNormalizeStatus(value) {
    return normalizeStudentStatus(value);
}

function adminGetStudentClassMap(studentId) {
    if (typeof apmsGetClassStudentMap === 'function') return apmsGetClassStudentMap(studentId);
    return (state.db.class_students || []).find(m => String(m.student_id) === String(studentId)) || null;
}

function adminGetClassById(classId) {
    if (typeof apmsGetClassById === 'function') return apmsGetClassById(classId);
    return (state.db.classes || []).find(c => String(c.id) === String(classId)) || null;
}

function adminGetStudentClass(studentId) {
    const map = adminGetStudentClassMap(studentId);
    return map ? adminGetClassById(map.class_id) : null;
}

function adminGetClassStudentIds(classId) {
    if (typeof apmsGetClassStudentIds === 'function') return apmsGetClassStudentIds(classId);
    return (state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id));
}

function adminGetCreatedDateText(student) {
    return String(student?.created_at || '').split('T')[0].split(' ')[0];
}

function adminGetDaysSince(dateText, todayTime) {
    const time = apParseLocalDateTime(dateText);
    if (time === null) return null;
    return Math.max(0, Math.floor((todayTime - time) / (1000 * 60 * 60 * 24)) + 1);
}

function adminIsRecentStudent(student, todayTime, days = 30) {
    const createdDate = adminGetCreatedDateText(student);
    const createdTime = apParseLocalDateTime(createdDate);
    if (createdTime === null) return false;
    const diff = (todayTime - createdTime) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff < days;
}

function adminBuildOverviewData(todayStr, todayTime) {
    const students = state.db.students || [];
    const classes = state.db.classes || [];
    const maps = state.db.class_students || [];

    const activeStudents = students.filter(s => adminNormalizeStatus(s.status) === '재원');
    const dischargedStudents = students.filter(s => isWithdrawnStudentStatus(s.status));
    const leaveStudents = students.filter(s => adminNormalizeStatus(s.status) === '휴원');
    const recentStudents = activeStudents
        .filter(s => adminIsRecentStudent(s, todayTime, 60))
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));

    const unassignedStudents = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return true;
        const cls = adminGetClassById(map.class_id);
        return !cls;
    });

    const teacherlessClasses = classes.filter(c => {
        if (Number(c.is_active) === 0) return false;
        const teacherName = String(c.teacher_name || '').trim();
        return !teacherName || teacherName === '담당';
    });

    const cleanupStudents = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return false;
        const cls = adminGetClassById(map.class_id);
        return !cls || Number(cls.is_active) === 0;
    });

    return {
        todayStr,
        todayTime,
        activeStudents,
        dischargedStudents,
        leaveStudents,
        recentStudents,
        unassignedStudents,
        teacherlessClasses,
        cleanupStudents
    };
}

// [라우트 안전장치] 학생 클릭/상세 진입은 무조건 보기모드.
// 과거 edit 직행 위험을 제거하기 위해 detail wrapper로 위임한다.

function adminOpenStudentEditOrDetail(studentId) {
    return adminOpenDashboardStudentDetail(studentId);
}

function adminOpenDashboardStudentDetail(studentId) {
    if (!studentId) return;
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'dashboard' });
    if (typeof openStudentDetail === 'function') return openStudentDetail(studentId, { mode: 'view', returnTo: { type: 'dashboard' } });
    if (typeof renderStudentDetail === 'function') return renderStudentDetail(studentId, { returnTo: { type: 'dashboard' } });
    toast('학생 화면을 불러오지 못했습니다.', 'warn');
}

// [라우트 안전장치] 수정 버튼 전용. 학생 클릭 onclick에서는 호출 금지.

function adminOpenDashboardStudentEdit(studentId) {
    if (!studentId) return;
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'dashboard' });
    if (typeof openStudentDetail === 'function') return openStudentDetail(studentId, { mode: 'edit', returnTo: { type: 'dashboard' } });
    if (typeof openEditStudent === 'function') return openEditStudent(studentId, { returnTo: { type: 'dashboard' } });
    toast('학생 수정 화면을 불러오지 못했습니다.', 'warn');
}

function adminBuildGradeHoverRows(students = []) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const counts = {};
    (students || []).forEach(student => {
        const grade = String(student?.grade || student?.grade_raw || '미지정').trim() || '미지정';
        counts[grade] = (counts[grade] || 0) + 1;
    });
    const labels = Object.keys(counts).sort((a, b) => {
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 || bi !== -1) return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        return a.localeCompare(b, 'ko');
    });
    return labels.map(label => ({ label, value: counts[label] }));
}

function renderAdminMiniMetric(label, value, tone = 'text', onclick = '', hoverRows = []) {
    const colorMap = {
        primary: 'var(--text)',
        success: 'var(--text)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        secondary: 'var(--secondary)',
        text: 'var(--text)'
    };
    const color = colorMap[tone] || colorMap.text;
    const clickAttr = onclick ? ` onclick="${onclick}"` : '';
    const cursor = onclick ? 'cursor:pointer;' : '';
    const roleAttr = onclick ? ' role="button" tabindex="0"' : '';
    const safeLabel = apEscapeHtml(label);
    const safeValue = apEscapeHtml(String(value ?? 0));
    const hoverText = dashboardEscapeAttr(`${label} ${value ?? 0}명`);
    const rows = Array.isArray(hoverRows) ? hoverRows : [];
    const hoverHtml = rows.length
        ? `<div class="ap-admin-mini-metric__hover" style="position:absolute; left:50%; bottom:calc(100% + 8px); transform:translateX(-50%); min-width:132px; padding:10px 12px; border-radius:12px; background:var(--surface); border:1px solid var(--border); box-shadow:var(--shadow); color:var(--text); font-size:12px; font-weight:500; line-height:1.45; opacity:0; pointer-events:none; z-index:20; transition:opacity .14s ease, transform .14s ease;">
            <div style="font-size:12px; font-weight:700; margin-bottom:6px; white-space:nowrap;">${safeLabel} ${safeValue}명</div>
            ${rows.map(row => `<div style="display:flex; justify-content:space-between; gap:12px; white-space:nowrap;"><span>${apEscapeHtml(row.label)}</span><strong>${apEscapeHtml(String(row.value || 0))}명</strong></div>`).join('')}
        </div>`
        : '';
    return `
        <div class="ap-admin-mini-metric"${roleAttr} aria-label="${hoverText}"${clickAttr} style="${cursor} position:relative; min-height:44px; padding:0 10px; border-radius:12px; background:var(--surface); border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; box-sizing:border-box; box-shadow:none;" onmouseenter="this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('opacity','1'); this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('transform','translateX(-50%) translateY(-2px)')" onmouseleave="this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('opacity','0'); this.querySelector('.ap-admin-mini-metric__hover')?.style.setProperty('transform','translateX(-50%)')">
            <div style="font-size:13px; font-weight:500; color:${color}; line-height:1.25; white-space:nowrap;">${safeLabel}</div>
            ${hoverHtml}
        </div>
    `;
}

function renderAdminAssessmentArchiveMetric(url = '../archive/assessment/assessment-mvp.html') {
    return `
        <div class="ap-admin-mini-metric ap-admin-assessment-card" role="button" tabindex="0" title="진단평가 · 단원평가 · 중간·기말평가" aria-label="시험지 보관함: 진단평가, 단원평가, 중간·기말평가" data-assessment-archive-url="${url}" onclick="openAdminAssessmentArchiveWindow(event)" style="cursor:pointer; min-height:44px; padding:0 10px; border-radius:12px; background:var(--surface); border:1px solid var(--border); display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; box-sizing:border-box; box-shadow:none;">
            <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.25; white-space:nowrap;">시험지 보관함</div>
        </div>
    `;
}

/* [REDESIGN] 운영 지표를 KPI 카드로 승격.
   - 숫자는 평소 blur로 가리고 마우스 호버 시에만 표시(원장님 요청).
   - tone/value/onclick/hoverRows 데이터는 기존과 동일 → 기능 변화 없음. */
function renderAdminKpiCard(label, value, tone, onclick, hoverRows = [], unit = '명') {
    const toneClass = { primary: 'blue', success: 'green', secondary: 'amber', warning: 'amber', error: 'red' }[tone] || 'blue';
    const rows = Array.isArray(hoverRows) ? hoverRows : [];
    const chips = rows.length
        ? `<div class="ap-owner-kpi__chips">${rows.map(r => `<span class="ap-owner-kpi__chip">${apEscapeHtml(r.label)} <b class="t-num">${apEscapeHtml(String(r.value || 0))}</b></span>`).join('')}</div>`
        : '';
    const clickAttr = onclick ? ` role="button" tabindex="0" onclick="${onclick}"` : '';
    return `
        <div class="ap-owner-kpi ap-owner-kpi--${toneClass}"${clickAttr} aria-label="${dashboardEscapeAttr(`${label} ${value}${unit}`)}">
            <div class="ap-owner-kpi__top">
                <span class="ap-owner-kpi__label">${apEscapeHtml(label)}</span>
                <span class="ap-owner-kpi__eye" aria-hidden="true">
                    <svg class="ap-owner-kpi__eye-off" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4l16 16"/><path d="M9.6 5.8A9.3 9.3 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-2.4 3.1M6.3 7.9A15.7 15.7 0 0 0 2.5 12S6 18.5 12 18.5c1 0 1.9-.2 2.7-.4"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>
                    <svg class="ap-owner-kpi__eye-on" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/></svg>
                </span>
            </div>
            <div class="ap-owner-kpi__num t-num">${apEscapeHtml(String(value ?? 0))}<small>${apEscapeHtml(unit)}</small></div>
            ${chips}
        </div>
    `;
}

/* [REDESIGN] 운영 통계 카드.
   - 앞면은 큰 라인 아이콘 + 큰 라벨만 노출한다(숫자/•• 표기 없음 — 원장님 요청: 숫자 노출 금지).
   - 마우스 호버 시 학년/구분별 브레이크다운 툴팁(실제 인원 포함)을 보여준다.
   - 카드 클릭 시 onclick(전체 원생 화면 등)으로 이동한다. */
function renderAdminOverviewStatCard(label, value, tone, iconSvg, onclick, hoverRows = [], unit = '명') {
    const rows = Array.isArray(hoverRows) ? hoverRows : [];
    const safeLabel = apEscapeHtml(label);
    const safeValue = apEscapeHtml(String(value ?? 0));
    const safeUnit = apEscapeHtml(unit);
    const toneClass = ['blue', 'green', 'amber', 'red'].includes(tone) ? tone : 'blue';
    const clickAttr = onclick ? ` role="button" tabindex="0" onclick="${onclick}"` : '';
    const tipRows = rows.map(r => `<div class="ap-owner-stat__tip-row"><span>${apEscapeHtml(r.label)}</span><strong class="t-num">${apEscapeHtml(String(r.value || 0))}</strong></div>`).join('');
    return `
        <div class="ap-owner-stat ap-owner-stat--${toneClass}"${clickAttr} aria-label="${dashboardEscapeAttr(`${label} 상세 보기`)}">
            <span class="ap-owner-stat__icon" aria-hidden="true">${iconSvg}</span>
            <span class="ap-owner-stat__title">${safeLabel}</span>
            <div class="ap-owner-stat__tip">
                <div class="ap-owner-stat__tip-title">${safeLabel} ${safeValue}${safeUnit}</div>
                ${tipRows}
            </div>
        </div>
    `;
}

function renderAdminStudentOverviewPanel(data) {
    const leaveCount = data.leaveStudents.length;
    const dischargedCount = data.dischargedStudents.length;
    const icoActive = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M16 20.5v-1.5a4 4 0 0 0-4-4H6.5a4 4 0 0 0-4 4v1.5"/><circle cx="9.2" cy="7.5" r="3.6"/><path d="M21.5 20.5v-1.5a4 4 0 0 0-3-3.87"/><path d="M16.5 3.9a3.6 3.6 0 0 1 0 6.97"/></svg>';
    const icoRecent = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20.5v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1.5"/><circle cx="8" cy="7.5" r="3.6"/><path d="M19 7.5v6M22 10.5h-6"/></svg>';
    const icoLeave = '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 21H6.5A2.5 2.5 0 0 1 4 18.5v-13A2.5 2.5 0 0 1 6.5 3H14"/><path d="M17.5 16l4-4-4-4"/><path d="M21.5 12H10"/></svg>';
    return `
        <div class="ap-admin-section" style="margin-bottom:18px;">
            <div class="ap-owner-stat-grid">
                ${renderAdminOverviewStatCard('재원생', data.activeStudents.length, 'blue', icoActive, "openAdminStudentGradeModal('active')", adminBuildGradeHoverRows(data.activeStudents))}
                ${renderAdminOverviewStatCard('최근 등록', data.recentStudents.length, 'green', icoRecent, "openAdminStudentGradeModal('new')", adminBuildGradeHoverRows(data.recentStudents))}
                ${renderAdminOverviewStatCard('휴원·퇴원', leaveCount + dischargedCount, 'amber', icoLeave, "openAdminStudentList('discharged')", [{ label: '휴원', value: leaveCount }, { label: '퇴원', value: dischargedCount }])}
            </div>
        </div>
    `;
}

/* [REDESIGN] 시험지 보관함 — KPI 카드 형태(숫자 없는 액션 카드). 기존 onclick 유지. */
function renderAdminAssessmentArchiveCard(url = '../archive/assessment/assessment-mvp.html') {
    return `
        <div class="ap-owner-kpi ap-owner-kpi--archive" role="button" tabindex="0" data-assessment-archive-url="${url}" onclick="openAdminAssessmentArchiveWindow(event)" title="진단평가 · 단원평가 · 중간·기말평가" aria-label="시험지 보관함">
            <div class="ap-owner-kpi__top">
                <span class="ap-owner-kpi__label">시험지 보관함</span>
                <span class="ap-owner-kpi__arch-ico" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="4" rx="1.5"/><path d="M5 8.5v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/><path d="M10 12h4"/></svg></span>
            </div>
            <div class="ap-owner-kpi__arch-sub">진단 · 단원 · 중간·기말 평가</div>
        </div>
    `;
}

/* ════════════════════════════════════════════════════════════
   [REDESIGN] 오늘 일정 · 메모 (원장님 전용, localStorage 기반)
   - '확인 필요' 패널을 대체. 서버 미연동 개인 메모.
   - 저장 키: apms.owner.memo.YYYY-MM-DD
   ════════════════════════════════════════════════════════════ */
function apOwnerMemoStorageKey(dateStr) {
    return 'apms.owner.memo.' + String(dateStr || new Date().toLocaleDateString('sv-SE'));
}

function apLoadOwnerMemos(dateStr) {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(apOwnerMemoStorageKey(dateStr));
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch { return []; }
}

function apSaveOwnerMemos(dateStr, list) {
    if (typeof localStorage === 'undefined') return;
    try { localStorage.setItem(apOwnerMemoStorageKey(dateStr), JSON.stringify(Array.isArray(list) ? list : [])); } catch {}
}

function apRenderOwnerMemoItems(dateStr) {
    const list = apLoadOwnerMemos(dateStr);
    if (!list.length) {
        return `<div class="ap-owner-memo__empty">오늘 메모가 없습니다. 아래에서 추가하세요.</div>`;
    }
    return list.map(m => {
        const id = dashboardEscapeAttr(String(m.id || ''));
        const done = m.done ? ' is-done' : '';
        return `
            <div class="ap-owner-memo__item${done}">
                <button type="button" class="ap-owner-memo__check" aria-label="완료 표시" onclick="apOwnerMemoToggle('${dateStr}','${id}')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.2 4 9.3-9.5"/></svg>
                </button>
                <span class="ap-owner-memo__text">${apEscapeHtml(String(m.text || ''))}</span>
                <button type="button" class="ap-owner-memo__del" aria-label="삭제" onclick="apOwnerMemoRemove('${dateStr}','${id}')">✕</button>
            </div>`;
    }).join('');
}

function apOwnerMemoRefresh(dateStr) {
    const host = document.getElementById('ap-owner-memo-list');
    if (host) host.innerHTML = apRenderOwnerMemoItems(dateStr);
}

function apOwnerMemoToggle(dateStr, id) {
    const list = apLoadOwnerMemos(dateStr);
    const item = list.find(m => String(m.id) === String(id));
    if (item) { item.done = !item.done; apSaveOwnerMemos(dateStr, list); apOwnerMemoRefresh(dateStr); }
}

function apOwnerMemoRemove(dateStr, id) {
    const list = apLoadOwnerMemos(dateStr).filter(m => String(m.id) !== String(id));
    apSaveOwnerMemos(dateStr, list);
    apOwnerMemoRefresh(dateStr);
}

function apOwnerMemoAdd(dateStr) {
    const input = document.getElementById('ap-owner-memo-input');
    if (!input) return;
    const text = String(input.value || '').trim();
    if (!text) return;
    const list = apLoadOwnerMemos(dateStr);
    list.push({ id: 'm' + Date.now().toString(36) + Math.floor(Math.random() * 1e4), text, done: false });
    apSaveOwnerMemos(dateStr, list);
    input.value = '';
    apOwnerMemoRefresh(dateStr);
}

function apOwnerMemoInputKey(event, dateStr) {
    if (event && event.key === 'Enter') { event.preventDefault(); apOwnerMemoAdd(dateStr); }
}

function renderAdminTodayMemoPanel(dateStr) {
    const safeDate = dashboardEscapeAttr(dateStr);
    const dateLabel = apFormatMonthDay(dateStr) || dateStr;
    return `
        <div class="ap-admin-section ap-owner-memo-section" style="margin-bottom:0;">
            <div class="ap-owner-panel-head">
                <h3 class="ap-admin-section-title ap-owner-panel-title">오늘 일정 · 메모</h3>
                <span class="ap-owner-panel-meta">${apEscapeHtml(dateLabel)}</span>
            </div>
            <div class="card ap-owner-memo-card">
                <div id="ap-owner-memo-list" class="ap-owner-memo__list">${apRenderOwnerMemoItems(dateStr)}</div>
                <div class="ap-owner-memo__add">
                    <input id="ap-owner-memo-input" type="text" placeholder="메모 추가" autocomplete="off" onkeydown="apOwnerMemoInputKey(event,'${safeDate}')">
                    <button type="button" class="ap-owner-memo__add-btn" onclick="apOwnerMemoAdd('${safeDate}')">추가</button>
                </div>
            </div>
        </div>
    `;
}

function renderAdminNeedCheckPanel(data) {
    const items = [
        { label: '반 배정 필요', value: data.unassignedStudents.length, action: 'openAdminUnassignedStudentList()' },
        { label: '담당 선생님 미지정', value: data.teacherlessClasses.length, unit: '개', action: 'openAdminTeacherlessClassList()' },
        { label: '반 정리 필요', value: data.cleanupStudents.length, action: 'openAdminClassCleanupList()' }
    ];

    return `
        <div class="ap-admin-section" style="margin-bottom:18px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">확인 필요</h3>
            </div>
            <div class="ap-admin-check-grid" style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                ${items.map(item => {
                    const hasIssue = Number(item.value || 0) > 0;
                    return `
                        <button class="btn ap-admin-check-item" style="min-height:52px; padding:0 10px; border-radius:16px; border:1px solid ${hasIssue ? 'rgba(var(--error-rgb),0.20)' : 'var(--border)'}; background:${hasIssue ? 'rgba(255,71,87,0.045)' : 'var(--surface)'}; box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:8px;" onclick="${item.action}">
                            <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; color:var(--text); font-size:12px; font-weight:500;">${item.label}</span>
                            <span style="flex-shrink:0; font-size:13px; font-weight:500; color:${hasIssue ? 'var(--error)' : 'var(--secondary)'};">${item.value}${item.unit || '명'}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

function renderAdminNewStudentPanel(data) {
    const INITIAL_LIMIT = 10;
    const allList = Array.isArray(data.recentStudents) ? data.recentStudents : [];
    const visibleList = allList.slice(0, INITIAL_LIMIT);
    const hiddenList = allList.slice(INITIAL_LIMIT);

    const buildRow = s => {
        const cls = adminGetStudentClass(s.id);
        const days = adminGetDaysSince(adminGetCreatedDateText(s), data.todayTime);
        const attCount = (state.db.attendance_history || state.db.attendance || []).filter(a => String(a.student_id) === String(s.id)).length;
        const hwCount = (state.db.homework_history || state.db.homework || []).filter(h => String(h.student_id) === String(s.id)).length;
        const examCount = (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(s.id)).length;
        const hasClass = !!cls;
        const recordText = examCount > 0 ? `시험 ${examCount}회` : (attCount + hwCount > 0 ? `기록 ${attCount + hwCount}회` : '기록 없음');
        return `
            <div class="ap-admin-recent-student-row" onclick="adminOpenDashboardStudentDetail('${s.id}')" style="height:46px; min-height:46px; padding:0 12px; display:flex; align-items:center; justify-content:space-between; gap:10px; cursor:pointer; box-sizing:border-box;">
                <div style="min-width:0; display:flex; align-items:center; gap:8px;">
                    <span style="font-size:13px; color:var(--text); white-space:nowrap; font-weight:500;">${apEscapeHtml(s.name)}</span>
                    <span style="font-size:11px; color:var(--secondary); font-weight:500; white-space:nowrap;">등록 ${days || '-'}일차</span>
                </div>
                <div style="display:flex; align-items:center; gap:5px; flex-shrink:0; min-width:0;">
                    <span style="font-size:10.5px; font-weight:500; color:${hasClass ? 'var(--text)' : 'var(--error)'}; background:${hasClass ? 'var(--surface-2)' : 'rgba(var(--error-rgb),0.10)'}; border:1px solid ${hasClass ? 'var(--border)' : 'rgba(var(--error-rgb),0.16)'}; padding:3px 6px; border-radius:999px; white-space:nowrap;">${hasClass ? apEscapeHtml(cls.name) : '반 배정 필요'}</span>
                    <span style="font-size:10.5px; font-weight:500; color:var(--secondary); background:var(--surface-2); padding:3px 6px; border-radius:999px; white-space:nowrap;">${recordText}</span>
                </div>
            </div>
        `;
    };

    const visibleRows = visibleList.map(buildRow).join('');
    const hiddenRows = hiddenList.map(buildRow).join('');
    const moreBtn = hiddenList.length > 0 ? `
        <div id="ap-new-student-more-wrap">
            <div id="ap-new-student-hidden" style="display:none;">${hiddenRows}</div>
            <button onclick="(function(){var h=document.getElementById('ap-new-student-hidden');var b=document.getElementById('ap-new-student-more-btn');if(!h||!b)return;var open=h.style.display!=='none';h.style.display=open?'none':'block';b.textContent=open?'▼ ${hiddenList.length}명 더 보기':'▲ 접기';})()" id="ap-new-student-more-btn" style="width:100%; height:38px; border:none; border-top:1px solid var(--border); background:transparent; color:var(--secondary); font-size:12px; font-weight:600; cursor:pointer;">▼ ${hiddenList.length}명 더 보기</button>
        </div>` : '';

    return `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">최근 등록 원생</h3>
                <span style="font-size:12px; font-weight:400; color:var(--secondary);">최근 2개월 ${allList.length}명</span>
            </div>
            <div class="card ap-admin-recent-student-grid" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${visibleRows || `<div style="height:52px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">최근 등록 원생이 없습니다.</div>`}
                ${moreBtn}
            </div>
        </div>
    `;
}

function adminGetGradeLabel(student) {
    const text = String((student && (student.grade || student.school_grade || student.memo)) || '').trim();
    if (/중\s*1|중1/.test(text)) return '중1';
    if (/중\s*2|중2/.test(text)) return '중2';
    if (/중\s*3|중3/.test(text)) return '중3';
    if (/고\s*1|고1/.test(text)) return '고1';
    if (/고\s*2|고2/.test(text)) return '고2';
    if (/고\s*3|고3/.test(text)) return '고3';
    return text || '기타';
}

function adminGetGradeOrder(label) {
    const order = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const idx = order.indexOf(String(label || ''));
    return idx >= 0 ? idx : 98;
}

function adminGetStudentListByType(type) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const students = state.db.students || [];
    const activeStudents = students.filter(s => adminNormalizeStatus(s.status) === '재원');
    if (type === 'new') {
        return activeStudents
            .filter(s => adminIsRecentStudent(s, todayTime, 60))
            .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }
    if (type === 'leave') return students.filter(s => adminNormalizeStatus(s.status) === '휴원');
    if (type === 'discharged') return students.filter(s => isWithdrawnStudentStatus(s.status));
    return activeStudents.sort((a, b) => adminGetGradeOrder(adminGetGradeLabel(a)) - adminGetGradeOrder(adminGetGradeLabel(b)) || String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function adminRenderStudentGradeSummary(list) {
    const students = Array.isArray(list) ? list : [];
    const grades = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    students.forEach(s => {
        const grade = adminGetGradeLabel(s);
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    const chips = [
        `<span style="min-height:30px; padding:6px 10px; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); color:var(--text); font-size:12px; font-weight:500; display:flex; align-items:center;">총 ${students.length}명</span>`,
        ...grades.map(g => {
            const count = Number(gradeCounts[g] || 0);
            if (count === 0) return '';
            return `<span style="min-height:30px; padding:6px 10px; border-radius:999px; background:var(--surface); border:1px solid var(--border); color:var(--text); font-size:12px; font-weight:500; display:flex; align-items:center;">${apEscapeHtml(g)} ${count}명</span>`;
        })
    ].join('');
    return `<div style="display:flex; flex-wrap:wrap; gap:6px; margin:0 0 12px 0;">${chips}</div>`;
}

function adminEnsureStudentGradeModalState(type) {
    if (!state.ui) state.ui = {};
    if (!state.ui.adminStudentGradeModal || state.ui.adminStudentGradeModal.type !== type) {
        state.ui.adminStudentGradeModal = { type, grade: '전체', keyword: '' };
    }
    return state.ui.adminStudentGradeModal;
}

function openAdminStudentGradeModal(type) {
    adminEnsureStudentGradeModalState(type || 'active');
    renderAdminStudentGradeModal();
}

function adminSetStudentGradeModalGrade(grade) {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    modal.grade = String(grade || '전체');
    renderAdminStudentGradeModal();
}

function adminHandleStudentGradeModalSearch(value) {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    modal.keyword = String(value || '').trim();
    const body = document.getElementById('admin-student-grade-modal-body');
    if (body) body.innerHTML = renderAdminStudentGradeModalBody();
}

function renderAdminStudentGradeModalBody() {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    const list = adminGetStudentListByType(modal.type);
    const keyword = adminNormalizeSearchValue(modal.keyword || '');
    const grades = ['전체', '중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    list.forEach(s => {
        const grade = adminGetGradeLabel(s);
        gradeCounts[grade] = (gradeCounts[grade] || 0) + 1;
    });
    const filtered = list.filter(s => {
        const grade = adminGetGradeLabel(s);
        const cls = adminGetStudentClass(s.id);
        if (modal.grade !== '전체' && grade !== modal.grade) return false;
        if (!keyword) return true;
        return adminSearchIncludes([s.name, s.school_name, s.grade, s.status, s.phone, cls && cls.name], modal.keyword);
    });
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const chips = grades.map(g => {
        const count = g === '전체' ? list.length : Number(gradeCounts[g] || 0);
        if (g !== '전체' && count === 0) return '';
        const active = modal.grade === g;
        return `<button class="btn" style="min-height:34px; padding:6px 10px; font-size:12px; font-weight:500; border-radius:999px; border:1px solid var(--border); background:${active ? 'var(--surface-2)' : 'var(--surface)'}; color:var(--text); box-shadow:none;" onclick="adminSetStudentGradeModalGrade(${apJsArg(g)})">${apEscapeHtml(g)} ${count}</button>`;
    }).join('');
    const rows = filtered.map(s => {
        const cls = adminGetStudentClass(s.id);
        const grade = adminGetGradeLabel(s);
        const days = adminGetDaysSince(adminGetCreatedDateText(s), todayTime);
        const subText = [cls ? cls.name : '미배정', s.school_name || '', grade].filter(Boolean).join(' · ');
        const recentText = modal.type === 'new' ? `<span style="font-size:11px; font-weight:500; color:var(--secondary); background:var(--surface-2); padding:3px 7px; border-radius:999px; white-space:nowrap;">등록 ${days || '-'}일차</span>` : '';
        return `
            <div style="padding:13px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--surface);">
                <button class="btn" style="flex:1; min-width:0; padding:0; border:none; background:transparent; box-shadow:none; text-align:left; display:block;" onclick="adminOpenStudentEditOrDetail('${apEscapeHtml(String(s.id || ''))}')">
                    <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(s.name || '')}</div>
                    <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:4px; line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(subText)}</div>
                </button>
                ${recentText}
            </div>
        `;
    }).join('');
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="search" autocomplete="off" value="${apEscapeHtml(modal.keyword || '')}" placeholder="학생 이름 검색" oninput="adminHandleStudentGradeModalSearch(this.value)" style="width:100%; height:42px; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); padding:0 13px; font-size:13px; font-weight:500; box-sizing:border-box;">
            <div style="display:flex; flex-wrap:wrap; gap:6px;">${chips}</div>
            <div style="font-size:12px; font-weight:400; color:var(--secondary); padding:0 2px;">총 ${filtered.length}명</div>
            <div style="max-height:54vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${rows || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">조회 대상이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function renderAdminStudentGradeModal() {
    const modal = adminEnsureStudentGradeModalState(state.ui?.adminStudentGradeModal?.type || 'active');
    const title = modal.type === 'new' ? '최근 등록' : '재원';
    showModal(title, `<div id="admin-student-grade-modal-body">${renderAdminStudentGradeModalBody()}</div>`);
}

function adminGetConsultationDate(row) {
    return String(row?.date || row?.consultation_date || row?.created_at || '').slice(0, 10);
}

function adminConsultationSortValue(row) {
    return String(row?.date || row?.consultation_date || row?.created_at || '').replace(/[^0-9]/g, '');
}

function adminGetStudentById(studentId) {
    return (state.db.students || []).find(s => String(s.id) === String(studentId)) || null;
}

function adminGetConsultationRows() {
    return (state.db.consultations || [])
        .slice()
        .sort((a, b) => String(adminConsultationSortValue(b)).localeCompare(String(adminConsultationSortValue(a))) || String(b.created_at || '').localeCompare(String(a.created_at || '')) || String(b.id || '').localeCompare(String(a.id || '')));
}

function adminGetRecentConsultationRows(days = 14) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    return adminGetConsultationRows().filter(row => {
        const date = adminGetConsultationDate(row);
        const time = apParseLocalDateTime(date);
        if (time === null) return false;
        const diff = (todayTime - time) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= days;
    });
}

function adminConsultationRowStudentName(row) {
    const student = adminGetStudentById(row?.student_id);
    return (student && student.name) || row?.student_name_snapshot || '학생 확인';
}

function adminRecentConsultationPreviewText(row) {
    const content = String(row?.content || '').replace(/\s+/g, ' ').trim();
    return content || '상담 내용 없음';
}

function adminRenderConsultationHistoryRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    return list.map(row => {
        const date = adminGetConsultationDate(row) || '-';
        const type = String(row?.type || '상담').trim() || '상담';
        const content = String(row?.content || '').trim();
        const nextAction = String(row?.next_action || row?.nextAction || '').trim();
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); background:var(--surface);">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.35;">${apEscapeHtml(date)} · ${apEscapeHtml(type)}</div>
                </div>
                <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.55; white-space:pre-wrap;">${apEscapeHtml(content || '내용 없음')}</div>
                ${nextAction ? `<div style="margin-top:8px; font-size:12px; font-weight:400; color:var(--secondary); line-height:1.45; white-space:pre-wrap;">다음 조치 · ${apEscapeHtml(nextAction)}</div>` : ''}
            </div>
        `;
    }).join('') || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">상담 기록이 없습니다.</div>`;
}

function openAdminStudentConsultationHistory(studentId) {
    const sid = String(studentId || '').trim();
    const student = adminGetStudentById(sid);
    const rows = adminGetConsultationRows().filter(row => String(row.student_id || '') === sid);
    const studentName = student ? student.name : '학생 확인';
    const detailBtn = student ? `<button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); box-shadow:none;" onclick="adminOpenStudentEditOrDetail('${apEscapeHtml(sid)}')">학생 상세</button>` : '';
    showModal(`상담 이력 · ${studentName}`, `
        <div style="display:flex; flex-direction:column; gap:10px; margin:-4px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:0 2px;">
                <div style="font-size:12px; font-weight:400; color:var(--secondary);">총 ${rows.length}건</div>
                ${detailBtn}
            </div>
            <div style="max-height:58vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${adminRenderConsultationHistoryRows(rows)}
            </div>
        </div>
    `);
}

function renderAdminRecentConsultationPanel() {
    const recentRows = adminGetRecentConsultationRows(14);
    const byStudent = [];
    const seen = new Set();
    recentRows.forEach(row => {
        const sid = String(row.student_id || '').trim();
        if (!sid || seen.has(sid)) return;
        seen.add(sid);
        byStudent.push(row);
    });
    const rows = byStudent.slice(0, 8).map(row => {
        const sid = String(row.student_id || '').trim();
        const student = adminGetStudentById(sid);
        const cls = student ? adminGetStudentClass(student.id) : null;
        const type = String(row?.type || '상담').trim() || '상담';
        const nextAction = String(row?.next_action || row?.nextAction || '').trim();
        const preview = adminRecentConsultationPreviewText(row);
        const meta = [adminGetConsultationDate(row), cls && cls.name].filter(Boolean).join(' · ');
        return `
            <button class="btn ap-admin-consultation-row" style="width:100%; min-height:68px; padding:10px 12px; border:none; border-bottom:1px solid var(--border); border-radius:0; background:var(--surface); box-shadow:none; display:grid; grid-template-columns:minmax(0, 1fr) auto; align-items:center; gap:12px; text-align:left;" onclick="openAdminStudentConsultationHistory('${apEscapeHtml(sid)}')">
                <span style="min-width:0; display:flex; flex-direction:column; gap:4px;">
                    <span style="display:flex; align-items:center; gap:7px; min-width:0;">
                        <span style="font-size:13px; font-weight:700; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(adminConsultationRowStudentName(row))}</span>
                        <span style="flex-shrink:0; font-size:10px; font-weight:700; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:2px 7px;">${apEscapeHtml(type)}</span>
                    </span>
                    <span style="font-size:12px; font-weight:500; color:var(--secondary); line-height:1.45; overflow:hidden; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical;">${apEscapeHtml(preview)}</span>
                </span>
                <span style="flex-shrink:0; display:flex; flex-direction:column; align-items:flex-end; gap:5px; max-width:210px;">
                    <span style="font-size:11px; font-weight:500; color:var(--secondary); white-space:nowrap;">${apEscapeHtml(meta)}</span>
                    ${nextAction ? `<span style="max-width:100%; font-size:11px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">다음 조치 · ${apEscapeHtml(nextAction)}</span>` : '<span style="font-size:11px; font-weight:500; color:var(--secondary);">후속 없음</span>'}
                </span>
            </button>
        `;
    }).join('');

    return `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                <h3 class="ap-admin-section-title" style="margin:0; font-size:14px; font-weight:500; color:var(--text);">최근 상담</h3>
                <button class="btn" style="min-height:30px; padding:5px 10px; font-size:11px; font-weight:500; border-radius:999px; background:var(--surface-2); border:1px solid var(--border); box-shadow:none;" onclick="openAdminConsultationCenter()">상담 전체 보기</button>
            </div>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${rows || `<div style="height:54px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">최근 상담 기록이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function openAdminConsultationCenter() {
    if (!state.ui) state.ui = {};
    state.ui.adminConsultationSearchKeyword = '';
    showModal('상담 전체 보기', `<div id="admin-consultation-center-body">${renderAdminConsultationCenterBody('')}</div>`);
}

function handleAdminConsultationSearchInput(value) {
    if (!state.ui) state.ui = {};
    state.ui.adminConsultationSearchKeyword = String(value || '').trim();
    const body = document.getElementById('admin-consultation-center-body');
    if (body) body.innerHTML = renderAdminConsultationCenterBody(state.ui.adminConsultationSearchKeyword);
}

function renderAdminConsultationCenterBody(keyword) {
    const key = String(keyword || '').trim();
    const baseRows = key ? adminGetConsultationRows() : adminGetRecentConsultationRows(14);
    const filtered = baseRows.filter(row => {
        if (!key) return true;
        const student = adminGetStudentById(row.student_id);
        const cls = student ? adminGetStudentClass(student.id) : null;
        return adminSearchIncludes([
            student && student.name,
            student && student.school_name,
            student && student.grade,
            cls && cls.name,
            row.type,
            row.content,
            row.next_action
        ], key);
    }).slice(0, 30);
    const rows = filtered.map(row => {
        const sid = String(row.student_id || '').trim();
        const student = adminGetStudentById(sid);
        const cls = student ? adminGetStudentClass(student.id) : null;
        const meta = [adminGetConsultationDate(row), cls && cls.name, row.type].filter(Boolean).join(' · ');
        return `
            <button class="btn" style="min-height:52px; padding:10px 12px; border:none; border-bottom:1px solid var(--border); border-radius:0; background:var(--surface); box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:12px;" onclick="openAdminStudentConsultationHistory('${apEscapeHtml(sid)}')">
                <span style="min-width:0; text-align:left;">
                    <span style="display:block; font-size:13px; font-weight:500; color:var(--text); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(adminConsultationRowStudentName(row))}</span>
                    <span style="display:block; font-size:11px; font-weight:500; color:var(--secondary); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(meta)}</span>
                </span>
                <span style="flex-shrink:0; font-size:11px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); padding:4px 8px; border-radius:999px;">보기</span>
            </button>
        `;
    }).join('');
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input type="search" autocomplete="off" value="${apEscapeHtml(key)}" placeholder="학생 이름 검색" oninput="handleAdminConsultationSearchInput(this.value)" style="width:100%; height:42px; border:1px solid var(--border); border-radius:14px; background:var(--surface); color:var(--text); padding:0 13px; font-size:13px; font-weight:500; box-sizing:border-box;">
            <div style="font-size:12px; font-weight:400; color:var(--secondary); padding:0 2px;">${key ? '검색 결과' : '최근 2주'} ${filtered.length}건</div>
            <div style="max-height:56vh; overflow-y:auto; border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                ${rows || `<div style="height:72px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">상담 기록이 없습니다.</div>`}
            </div>
        </div>
    `;
}

function openAdminLeaveStudentList() {
    const list = (state.db.students || []).filter(s => adminNormalizeStatus(s.status) === '휴원');
    renderAdminSimpleStudentList('휴원생 목록', list, false, true);
}

function openAdminUnassignedStudentList() {
    const activeStudents = (state.db.students || []).filter(s => adminNormalizeStatus(s.status) === '재원');
    const list = activeStudents.filter(s => {
        const map = adminGetStudentClassMap(s.id);
        if (!map) return true;
        return !adminGetClassById(map.class_id);
    });
    renderAdminSimpleStudentList('반 배정 필요', list, true);
}

function openAdminClassCleanupList() {
    const list = (state.db.students || []).filter(s => {
        if (adminNormalizeStatus(s.status) !== '재원') return false;
        const map = adminGetStudentClassMap(s.id);
        if (!map) return false;
        const cls = adminGetClassById(map.class_id);
        return !cls || Number(cls.is_active) === 0;
    });
    renderAdminSimpleStudentList('반 정리 필요', list, true);
}

function openAdminTeacherlessClassList() {
    const classes = (state.db.classes || []).filter(c => {
        if (Number(c.is_active) === 0) return false;
        const teacherName = String(c.teacher_name || '').trim();
        return !teacherName || teacherName === '담당';
    });

    const rows = classes.map(c => `
        <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px; background:var(--surface);">
            <div style="min-width:0;">
                <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35;">${apEscapeHtml(c.name || '')}</div>
                <div style="font-size:12px; font-weight:400; color:var(--secondary); margin-top:3px;">${apEscapeHtml(c.grade || '')} · 담당 선생님 미지정</div>
            </div>
            <button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="closeModal(true); if(typeof openClassManageModal==='function') openClassManageModal(); else toast('반 관리 화면을 불러오지 못했습니다.', 'warn');">반 관리</button>
        </div>
    `).join('');

    showModal(`담당 선생님 미지정 (${classes.length}개)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:500;">확인할 반이 없습니다.</div>`}</div>`);
}

function renderAdminSimpleStudentList(title, list, editable = false, showGradeSummary = false) {
    const rows = list.map(s => {
        const cls = adminGetStudentClass(s.id);
        const classText = cls ? cls.name : '미배정';
        const status = adminNormalizeStatus(s.status);
        const action = editable
            ? `<button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); color:var(--text); border:1px solid var(--border);" onclick="adminOpenDashboardStudentEdit('${s.id}')">수정</button>`
            : `<button class="btn" style="padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'dashboard' } })">상세</button>`;
        return `
            <div style="padding:14px 12px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; gap:12px; background:var(--surface);">
                <div style="min-width:0; flex:1;">
                    <div style="font-weight:500; font-size:14px; color:var(--text); line-height:1.35;">${apEscapeHtml(s.name || '')} <span style="font-size:12px; color:var(--secondary); font-weight:500; margin-left:4px;">${apEscapeHtml(s.school_name || '')} ${apEscapeHtml(s.grade || '')}</span></div>
                    <div style="font-size:12px; color:var(--text); font-weight:500; margin-top:4px;">${apEscapeHtml(classText)} <span style="color:var(--secondary); font-weight:500;">| ${apEscapeHtml(status)}</span></div>
                </div>
                ${action}
            </div>
        `;
    }).join('');

    const gradeSummary = showGradeSummary ? adminRenderStudentGradeSummary(list) : '';
    showModal(`${title} (${list.length}명)`, `<div style="max-height:65vh; overflow-y:auto; padding-right:4px; margin:-12px; background:var(--bg);">${gradeSummary}${rows || `<div style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:500;">조회 대상이 없습니다.</div>`}</div>`);
}


// ─────────────────────────────────────────────
// [Admin Search] 원장모드 전체 검색
// ─────────────────────────────────────────────

function adminNormalizeSearchValue(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
}

function adminSearchIncludes(values, keyword) {
    const key = adminNormalizeSearchValue(keyword);
    if (!key) return false;
    return values.some(value => adminNormalizeSearchValue(value).includes(key));
}

function adminGetSearchClassNameByStudentId(studentId) {
    const cls = adminGetStudentClass(studentId);
    return cls ? String(cls.name || '') : '미배정';
}

function adminGetSearchClassNameByClassId(classId) {
    const cls = adminGetClassById(classId);
    return cls ? String(cls.name || '') : '미배정';
}

function adminGetAssignmentTypeLabel(row) {
    const sourceType = String(row?.source_type || '').trim().toLowerCase();
    const archiveFile = String(row?.archive_file || '').trim();
    if (sourceType === 'clinic') return '클리닉';
    if (sourceType === 'mixed' || archiveFile.startsWith('MIXED:')) return '믹서';
    if (archiveFile) return '아카이브';
    return '자료';
}

function adminBuildGlobalSearchResults(keyword) {
    const key = String(keyword || '').trim();
    if (!key) return [];

    const results = [];
    const students = state.db.students || [];
    const classes = state.db.classes || [];
    const examSchedules = state.db.exam_schedules || [];
    const assignments = state.db.class_exam_assignments || [];

    students.forEach(s => {
        const className = adminGetSearchClassNameByStudentId(s.id);
        if (!adminSearchIncludes([s.name, s.school_name, s.grade, s.status, s.phone, className], key)) return;
        results.push({
            type: 'student',
            label: s.name || '학생',
            meta: `${className} · ${s.school_name || ''} ${s.grade || ''}`.trim(),
            desc: adminNormalizeStatus(s.status),
            actionLabel: '학생 보기',
            studentId: s.id
        });
    });

    classes.forEach(c => {
        if (Number(c.is_active) === 0) return;
        if (!adminSearchIncludes([c.name, c.grade, c.teacher_name], key)) return;
        const count = adminGetClassStudentIds(c.id)
            .filter(id => students.some(s => String(s.id) === String(id) && adminNormalizeStatus(s.status) === '재원'))
            .length;
        results.push({
            type: 'class',
            label: c.name || '반',
            meta: `${c.grade || ''} · ${c.teacher_name || '담당 미지정'}`,
            desc: `재원 ${count}명`,
            actionLabel: '반 열기',
            classId: c.id
        });
    });

    examSchedules.forEach(e => {
        if (!adminSearchIncludes([e.school_name, e.grade, e.exam_name, e.exam_date], key)) return;
        results.push({
            type: 'exam',
            label: `${e.school_name || '학교'} ${e.exam_name || '시험'}`.trim(),
            meta: `${e.grade || '학교공통'} · ${e.exam_date || ''}`,
            desc: '시험일정',
            actionLabel: '일정 보기',
            examDate: e.exam_date
        });
    });

    assignments.forEach(row => {
        const className = adminGetSearchClassNameByClassId(row.class_id);
        if (!adminSearchIncludes([row.exam_title, row.exam_date, row.archive_file, row.source_type, className], key)) return;
        results.push({
            type: 'assignment',
            label: row.exam_title || '배정 자료',
            meta: `${className} · ${row.exam_date || ''}`,
            desc: `${adminGetAssignmentTypeLabel(row)} · ${Number(row.question_count || 0) ? `${row.question_count}문항` : '문항 수 없음'}`,
            actionLabel: '반 열기',
            classId: row.class_id
        });
    });

    const typeOrder = { student: 0, class: 1, exam: 2, assignment: 3 };
    results.sort((a, b) => {
        const ao = typeOrder[a.type] ?? 99;
        const bo = typeOrder[b.type] ?? 99;
        if (ao !== bo) return ao - bo;
        return String(a.label || '').localeCompare(String(b.label || ''), 'ko');
    });

    return results.slice(0, 18);
}

function adminSearchTypeLabel(type) {
    if (type === 'student') return '학생';
    if (type === 'class') return '반';
    if (type === 'exam') return '시험';
    if (type === 'assignment') return '자료';
    return '검색';
}

function renderAdminGlobalSearchResults(results) {
    if (!results.length) {
        return `<div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">검색 결과가 없습니다.</div>`;
    }

    return results.map((item, idx) => `
        <button class="btn ap-admin-search-row"
                style="width:100%; min-height:48px; padding:8px 10px; border-radius:12px; border:1px solid var(--border); background:var(--surface); box-shadow:none; display:flex; justify-content:space-between; align-items:center; gap:10px; text-align:left;"
                onclick="openAdminGlobalSearchResult(${idx})">
            <div style="min-width:0; flex:1;">
                <div style="display:flex; align-items:center; gap:6px; min-width:0;">
                    <span style="flex-shrink:0; font-size:10px; font-weight:500; color:var(--text); background:var(--surface-2); border:1px solid var(--border); padding:2px 7px; border-radius:999px;">${adminSearchTypeLabel(item.type)}</span>
                    <span style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:13px; color:var(--text); font-weight:500;">${apEscapeHtml(item.label)}</span>
                </div>
                <div style="margin-top:3px; font-size:11px; font-weight:500; color:var(--secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(item.meta || '')}${item.desc ? ` · ${apEscapeHtml(item.desc)}` : ''}</div>
            </div>
            <span style="flex-shrink:0; font-size:11px; font-weight:500; color:var(--secondary);">${apEscapeHtml(item.actionLabel || '열기')}</span>
        </button>
    `).join('');
}

function handleAdminGlobalSearchInput(value) {
    const area = document.getElementById('admin-global-search-results');
    if (!area) return;

    const keyword = String(value || '').trim();
    if (!state.ui) state.ui = {};
    if (!keyword) {
        state.ui.adminGlobalSearchResults = [];
        area.innerHTML = `<div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">학생, 반, 학교, 시험, 자료를 검색하세요.</div>`;
        return;
    }

    const results = adminBuildGlobalSearchResults(keyword);
    state.ui.adminGlobalSearchResults = results;
    area.innerHTML = renderAdminGlobalSearchResults(results);
}

function openAdminGlobalSearchResult(index) {
    const item = (state.ui?.adminGlobalSearchResults || [])[Number(index)];
    if (!item) return toast('검색 결과를 찾을 수 없습니다.', 'warn');

    if (item.type === 'student' && item.studentId) {
        openStudentDetail(item.studentId, { mode: 'view', returnTo: { type: 'dashboard' } });
        return;
    }

    if ((item.type === 'class' || item.type === 'assignment') && item.classId) {
        if (typeof renderClass === 'function') renderClass(String(item.classId));
        else toast('반 화면을 불러오지 못했습니다.', 'warn');
        return;
    }

    if (item.type === 'exam') {
        if (typeof openExamScheduleModal === 'function') openExamScheduleModal();
        else toast('시험일정 화면을 불러오지 못했습니다.', 'warn');
        return;
    }

    toast('이 항목은 바로 열 수 없습니다.', 'warn');
}

function renderAdminGlobalSearchPanel() {
    return `
        <div class="ap-admin-global-search">
            <div class="ap-admin-global-search__field">
                <svg class="ap-admin-global-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                    <path d="M21 21L16.65 16.65M10.8 18.1C6.77 18.1 3.5 14.83 3.5 10.8C3.5 6.77 6.77 3.5 10.8 3.5C14.83 3.5 18.1 6.77 18.1 10.8C18.1 14.83 14.83 18.1 10.8 18.1Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
                <input id="admin-global-search-input"
                       type="search"
                       autocomplete="off"
                       placeholder="학생 · 반 · 학교 · 시험 · 자료 검색"
                       oninput="handleAdminGlobalSearchInput(this.value)"
                       style="width:100%; height:42px; border:0; background:transparent; color:var(--text); padding:0 14px 0 38px; font-size:14px; font-weight:500; box-sizing:border-box;">
            </div>
            <div id="admin-global-search-results" class="ap-admin-global-search__results">
                <div style="height:48px; display:flex; align-items:center; justify-content:center; color:var(--secondary); font-size:13px; font-weight:500;">학생, 반, 학교, 시험, 자료를 검색하세요.</div>
            </div>
        </div>
    `;
}

function renderAdminControlCenter() {
    if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('ap-teacher-dashboard-mode');
        document.body.classList.add('ap-owner-dashboard-bg');
    }
    const dashboardRole = String((typeof state !== 'undefined' && state?.auth?.role) || '').toLowerCase();
    if (typeof renderAppDrawer === 'function' && dashboardRole === 'admin') {
        renderAppDrawer();
    } else if (typeof document !== 'undefined' && typeof document.querySelectorAll === 'function') {
        document.querySelectorAll('#ap-system-gate, .ap-system-gate, .ap-admin-app-gate, [data-ap-system-gate="true"]').forEach(el => el.remove());
    }
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const todayTime = apParseLocalDateTime(todayStr) || Date.now();
    const adminOverviewData = adminBuildOverviewData(todayStr, todayTime);
    const adminGlobalSearchPanel = typeof renderAdminGlobalSearchPanel === 'function' ? renderAdminGlobalSearchPanel() : '';

    const adminSystemGateHtml = `
        <div id="ap-system-gate" class="ap-owner-sysgate" data-ap-system-gate="true" role="navigation" aria-label="시스템 전환">
            <button class="ap-owner-sysgate__tab is-current" type="button" aria-current="page" onclick="void(0)">AP MATH</button>
            <a class="ap-owner-sysgate__tab" href="../eie/index.html#dashboard" aria-label="EIE 대시보드로 이동">EIE</a>
        </div>
    `;

    const now = new Date();
    const weekdayKo = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()] || '';
    const fullDateLabel = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${weekdayKo}요일`;
    const baseDateLabel = `${weekdayKo} ${now.getMonth() + 1}/${now.getDate()} 기준`;

    const adminTopbarHtml = `
        <div class="ap-owner-topbar">
            <div class="ap-owner-topbar__date">${apEscapeHtml(fullDateLabel)}</div>
            <div class="ap-owner-topbar__tools">
                ${adminSystemGateHtml}
                ${adminGlobalSearchPanel}
            </div>
        </div>
    `;

    const adminShortcutRow = `
        <div class="ap-admin-shortcuts ap-admin-action-grid ap-surface-toolbar ap-surface-toolbar--five" aria-label="원장님 바로가기">
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof openAttendanceLedger === 'function') openAttendanceLedger(); else toast('불러오기 실패', 'warn');">
                <span class="ap-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5.5" y="4" width="13" height="17" rx="2.2"/><path d="M9 4V3.2A1.2 1.2 0 0 1 10.2 2h3.6A1.2 1.2 0 0 1 15 3.2V4"/><path d="M8.6 12.4l2.1 2.1 4.1-4.2"/></svg></span>
                출석부
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof renderTimetable === 'function') renderTimetable(); else toast('불러오기 실패', 'warn');">
                <span class="ap-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.4"/><path d="M3.5 9.5h17"/><path d="M8 3.2v3.4M16 3.2v3.4"/><path d="M7.5 13h3M13.5 13h3M7.5 16.6h3"/></svg></span>
                시간표
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="if(typeof openSchoolExamLedger === 'function') openSchoolExamLedger(); else toast('불러오기 실패', 'warn');">
                <span class="ap-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5v15a2 2 0 0 0 2 2h15"/><path d="M7.5 15l3.2-3.4 2.8 2 4.4-5.3"/></svg></span>
                성적표
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    data-assessment-archive-url="../archive/assessment/assessment-mvp.html"
                    onclick="openAdminAssessmentArchiveWindow(event)">
                <span class="ap-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="4.5" width="17" height="4.3" rx="1.5"/><path d="M5 8.8v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9"/><path d="M10 12.4h4"/></svg></span>
                시험지 보관함
            </button>
            <button class="btn ap-admin-action-card ap-surface-action"
                    onclick="openAdminOperationMenu()">
                <span class="ap-action-ico" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h8M16.5 7H20"/><path d="M4 17h3.5M11.5 17H20"/><circle cx="14.5" cy="7" r="2.3"/><circle cx="9" cy="17" r="2.3"/></svg></span>
                관리
            </button>
        </div>
    `;

    const todayOverviewHtml = renderAdminStudentOverviewPanel(adminOverviewData);
    const needCheckHtml = renderAdminNeedCheckPanel(adminOverviewData);
    const todayMemoHtml = renderAdminTodayMemoPanel(todayStr); /* [REDESIGN] 확인 필요 대체 */
    const recentStudentsHtml = renderAdminNewStudentPanel(adminOverviewData);
    const recentConsultationHtml = renderAdminRecentConsultationPanel();

    const adminActiveTeacherCount = (() => {
        const seen = new Set();
        (state?.db?.classes || []).forEach(c => {
            if (Number(c?.is_active) === 0) return;
            const t = String(c?.teacher_name || '담당').trim();
            if (t && t !== '담당') seen.add(t);
        });
        return seen.size;
    })();

    const teacherCardsHtml = `
        <div class="ap-admin-section" style="margin-bottom:28px;">
            <div class="ap-owner-panel-head" style="margin-bottom:12px;">
                <h3 class="ap-admin-section-title ap-owner-panel-title">선생님 현황</h3>
                <span class="ap-owner-panel-sub">AP MATH · ${adminActiveTeacherCount}명</span>
                <span class="ap-owner-panel-meta">${apEscapeHtml(baseDateLabel)}</span>
            </div>
            <div class="ap-admin-teacher-grid" style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:12px; align-items:stretch;">
                ${renderAdminTeacherCards(todayStr)}
            </div>
        </div>
    `;

    const nextWeekTime = todayTime + 7 * 24 * 60 * 60 * 1000;
    const nextWeekStr = new Date(nextWeekTime).toLocaleDateString('sv-SE');
    const adminWeeklyItems = [];

    (state.db.exam_schedules || [])
        .filter(e => e.exam_date >= todayStr && e.exam_date <= nextWeekStr)
        .forEach(e => adminWeeklyItems.push({ type: 'exam', date: e.exam_date, item: e }));

    apAdminAcademyScheduleSeries(todayStr, nextWeekStr)
        .forEach(s => adminWeeklyItems.push({ type: 'academy', date: s.schedule_date, item: s }));

    adminWeeklyItems.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));

    const adminScheduleHtml = `
        <div class="ap-admin-section" style="margin-bottom:32px;">
            <h3 class="ap-admin-section-title" style="margin:0 0 12px 0; font-size:14px; font-weight:500; color:var(--secondary);">주간일정</h3>
            <div class="card" style="padding:0; overflow:hidden; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                ${adminWeeklyItems.length > 0 ? adminWeeklyItems.map(w => {
                    const dateLabel = apFormatMonthDay(w.date) || w.date;
                    if (w.type === 'exam') {
                        const e = w.item;
                        const gradeLabel = e.grade ? `<span style="color:var(--secondary); font-weight:500;">${apEscapeHtml(e.grade)}</span> ` : '<span style="color:var(--secondary); font-weight:500;">학교공통</span> ';
                        return `<div style="display:flex; justify-content:space-between; align-items:center; min-height:52px; padding:0 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px; box-sizing:border-box;"><div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:11px; font-weight:500; color:var(--error); background:rgba(var(--error-rgb),0.10); padding:3px 8px; border-radius:8px; margin-right:6px;">시험</span><span style="font-weight:500; color:var(--text);">${apEscapeHtml(e.school_name)}</span> ${gradeLabel}${apEscapeHtml(e.exam_name)}</div><div style="color:var(--secondary); font-size:11px; font-weight:500; white-space:nowrap; background:var(--surface-2); border:1px solid var(--border); padding:2px 8px; border-radius:6px;">${dateLabel}</div></div>`;
                    }
                    const s = w.item;
                    const isClosed = s.schedule_type === 'closed' || s.is_closed === true || s.is_closed === 1;
                    const label = isClosed ? '휴무' : '기타';
                    const labelColor = isClosed ? 'var(--warning)' : 'var(--secondary)';
                    const labelBg = isClosed ? 'rgba(var(--warning-rgb),0.12)' : 'var(--surface-2)';
                    const title = s.title || (isClosed ? '휴무' : '일정');
                    const rangeLabel = s.range_end && s.range_end !== s.range_start
                        ? `${apFormatMonthDay(s.range_start) || s.range_start} ~ ${apFormatMonthDay(s.range_end) || s.range_end}`
                        : dateLabel;
                    return `<div style="display:flex; justify-content:space-between; align-items:center; min-height:52px; padding:0 16px; border-bottom:1px solid var(--border); font-size:13px; gap:10px; box-sizing:border-box;"><div style="min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><span style="font-size:11px; font-weight:500; color:var(--secondary); background:var(--surface-2); border:1px solid var(--border); padding:3px 8px; border-radius:8px; margin-right:6px;">${label}</span><span style="font-weight:500; color:var(--text);">${apEscapeHtml(title)}</span>${s.memo ? ` <span style="color:var(--secondary); font-weight:500;">${apEscapeHtml(s.memo)}</span>` : ''}</div><div style="color:var(--secondary); font-size:11px; font-weight:500; white-space:nowrap; background:var(--surface-2); border:1px solid var(--border); padding:2px 8px; border-radius:6px;">${apEscapeHtml(rangeLabel)}</div></div>`;
                }).join('') : `<div style="text-align:center; padding:20px; color:var(--secondary); font-size:13px; font-weight:500;">이번 주 예정된 일정이 없습니다.</div>`}
            </div>
        </div>
    `;

    const adminUnifiedStyle = `
        <style>
            #ap-admin-dashboard { width:100%; max-width:850px; margin:0 auto; padding:0 16px 24px; box-sizing:border-box; }
            #ap-admin-dashboard .card,
            #ap-admin-dashboard .ap-admin-card,
            #ap-admin-dashboard .ap-admin-mini-metric,
            #ap-admin-dashboard .ap-admin-check-item,
            #ap-admin-dashboard .ap-admin-search-row {
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface) !important;
                box-shadow:none !important;
                box-sizing:border-box !important;
            }
            #ap-admin-dashboard .card[onclick],
            #ap-admin-dashboard .ap-admin-card[onclick],
            #ap-admin-dashboard button {
                -webkit-tap-highlight-color:transparent;
            }
            @media (hover:hover) {
                #ap-admin-dashboard .card[onclick]:hover,
                #ap-admin-dashboard .ap-admin-card[onclick]:hover,
                #ap-admin-dashboard .ap-admin-teacher-card:hover {
                    transform:translateY(-1px);
                    border-color:var(--border) !important;
                }
            }
            #ap-admin-dashboard .ap-admin-section,
            #ap-admin-dashboard .ap-dashboard-section {
                border:0 !important;
                background:transparent !important;
                box-shadow:none !important;
                border-radius:0 !important;
                padding:0 !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts,
            #ap-admin-dashboard .ap-admin-app-gate {
                display:grid !important;
                gap:8px !important;
                padding:4px !important;
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface-2) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-overview-grid {
                display:grid !important;
                gap:8px !important;
                padding:4px !important;
                border:1px solid var(--border) !important;
                border-radius:16px !important;
                background:var(--surface-2) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts {
                grid-template-columns:repeat(5, minmax(0, 1fr));
                margin-bottom:18px !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts .btn,
            #ap-admin-dashboard .ap-admin-app-gate .btn {
                height:44px !important;
                min-height:44px !important;
                max-height:44px !important;
                padding:0 10px !important;
                border-radius:12px !important;
                border:1px solid var(--border) !important;
                background:var(--surface) !important;
                color:var(--text) !important;
                box-shadow:none !important;
                font-size:13px !important;
                font-weight:500 !important;
                line-height:1.2 !important;
            }
            #ap-admin-dashboard .ap-admin-shortcuts .ap-admin-action-card {
                height:44px !important;
                min-height:44px !important;
                max-height:44px !important;
                border-radius:12px !important;
                font-size:13px !important;
                font-weight:500 !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search {
                margin-top:30px !important;
                padding-top:4px !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search .ap-admin-global-search {
                width:100% !important;
                max-width:none !important;
                flex:0 0 auto !important;
            }
            #ap-admin-dashboard .ap-admin-bottom-search .ap-admin-global-search__field {
                height:48px !important;
                border-radius:16px !important;
            }
            #ap-admin-dashboard .ap-admin-summary-grid,
            #ap-admin-dashboard .ap-admin-teacher-grid {
                align-items:stretch !important;
            }
            #ap-admin-dashboard .ap-admin-summary-grid .card,
            #ap-admin-dashboard .ap-admin-mini-metric {
                min-height:44px !important;
                display:flex !important;
                flex-direction:column !important;
                align-items:center !important;
                justify-content:center !important;
                padding:0 10px !important;
            }
            #ap-admin-dashboard .ap-admin-assessment-card {
                min-height:44px !important;
                align-items:center !important;
                justify-content:center !important;
                padding:0 10px !important;
            }
            #ap-admin-dashboard .ap-admin-teacher-grid .card {
                min-height:164px !important;
                height:100% !important;
                display:flex !important;
                flex-direction:column !important;
                justify-content:space-between !important;
                padding:16px !important;
            }
            #ap-admin-dashboard .ap-admin-teacher-card .btn {
                background:var(--surface-2) !important;
                color:var(--text) !important;
                border:1px solid var(--border) !important;
                box-shadow:none !important;
            }
            #ap-admin-dashboard .ap-admin-section { margin-bottom:28px !important; }
            #ap-admin-dashboard .ap-admin-section-title { font-size:14px !important; font-weight:500 !important; letter-spacing:0 !important; }
            #ap-admin-dashboard .ap-admin-dashboard-head {
                position:relative;
            }
            #ap-admin-dashboard .ap-admin-global-search {
                position:relative;
                width:min(420px, 48vw);
                flex:0 1 420px;
                z-index:5;
            }
            #ap-admin-dashboard .ap-admin-global-search__field {
                position:relative;
                height:42px;
                border:1px solid var(--border);
                border-radius:999px;
                background:var(--surface);
                box-shadow:none;
                overflow:hidden;
            }
            #ap-admin-dashboard .ap-admin-global-search__icon {
                position:absolute;
                left:14px;
                top:50%;
                transform:translateY(-50%);
                color:var(--secondary);
                pointer-events:none;
            }
            #ap-admin-dashboard .ap-admin-global-search__results {
                display:none;
                position:absolute;
                top:48px;
                left:0;
                right:0;
                flex-direction:column;
                gap:7px;
                padding:8px;
                border:1px solid var(--border);
                border-radius:16px;
                background:var(--surface);
                box-shadow:0 12px 28px rgba(15,23,42,0.12);
                max-height:320px;
                overflow-y:auto;
            }
            #ap-admin-dashboard .ap-admin-global-search:focus-within .ap-admin-global-search__results {
                display:flex;
            }
            #ap-admin-dashboard .ap-admin-recent-student-grid {
                display:grid !important;
                grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
                gap:1px !important;
                max-height:360px !important;
                overflow:auto !important;
                background:rgba(15,23,42,0.08) !important;
            }
            #ap-admin-dashboard .ap-admin-recent-student-grid > * {
                background:var(--surface) !important;
            }
            #ap-admin-dashboard .ap-admin-recent-student-row:hover {
                background:var(--surface-2) !important;
            }

            #ap-admin-dashboard .ap-admin-overview-grid {
                grid-template-columns:repeat(4, minmax(0, 1fr)) !important;
            }
            @media (max-width:1024px) and (min-width:721px) {
                #ap-admin-dashboard .ap-admin-teacher-grid { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
            }
            #ap-admin-dashboard .ap-admin-check-item {
                -webkit-tap-highlight-color:transparent;
            }
            #ap-admin-dashboard .ap-admin-check-grid {
                grid-template-columns:repeat(3, minmax(0, 1fr)) !important;
            }
            @media (max-width:720px) {
                #ap-admin-dashboard .ap-admin-dashboard-head { flex-direction:column !important; align-items:stretch !important; gap:10px !important; }
                #ap-admin-dashboard .ap-admin-global-search { width:100% !important; flex:0 0 auto !important; }
                #ap-admin-dashboard .ap-admin-shortcuts { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
                #ap-admin-dashboard .ap-admin-overview-grid { grid-template-columns:repeat(2, minmax(0, 1fr)) !important; }
                #ap-admin-dashboard .ap-admin-teacher-grid { grid-template-columns:1fr !important; }
                #ap-admin-dashboard .ap-admin-recent-student-grid { grid-template-columns:1fr !important; max-height:420px !important; }
                #ap-admin-dashboard .ap-admin-check-grid { grid-template-columns:1fr !important; }
                #ap-admin-dashboard .ap-admin-check-item { min-height:50px !important; }
            }
            @media (max-width:480px) {
                #ap-admin-dashboard { padding-left:14px !important; padding-right:14px !important; }
                #ap-admin-dashboard .ap-admin-shortcuts { gap:6px !important; }
                #ap-admin-dashboard .ap-admin-shortcuts .btn { font-size:13px !important; padding:0 8px !important; }
                #ap-admin-dashboard .ap-admin-summary-grid { gap:8px !important; }
                #ap-admin-dashboard .ap-admin-summary-grid .card { min-height:78px !important; }
            }

            /* ════ [REDESIGN] 풀폭 12-col 관리형 레이아웃 ════ */
            #app-root { max-width:1340px !important; }
            #ap-admin-dashboard.owner-dashboard-shell { max-width:100% !important; padding-left:4px !important; padding-right:4px !important; }
            #ap-admin-dashboard .ap-admin-section-title { font-size:17px !important; font-weight:700 !important; letter-spacing:-0.02em !important; }
            /* 12-col grid */
            #ap-admin-dashboard .ap-owner-grid { display:grid !important; grid-template-columns:repeat(12, minmax(0,1fr)); gap:16px; align-items:start; margin-bottom:18px; }
            #ap-admin-dashboard .ap-owner-grid .ap-owner-cell { min-width:0; }
            #ap-admin-dashboard .ap-owner-cell--8 { grid-column:span 8; }
            #ap-admin-dashboard .ap-owner-cell--4 { grid-column:span 4; }
            #ap-admin-dashboard .ap-owner-cell--12 { grid-column:span 12; }
            #ap-admin-dashboard .ap-owner-grid .ap-admin-section { margin-bottom:0 !important; }
            /* KPI 카드 (숫자 호버 공개) */
            #ap-admin-dashboard .ap-owner-kpi-grid { display:grid !important; grid-template-columns:repeat(4, minmax(0,1fr)); gap:16px; }
            #ap-admin-dashboard .ap-owner-kpi { position:relative; border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:18px 20px; box-shadow:none; box-sizing:border-box; min-height:118px; display:flex; flex-direction:column; }
            #ap-admin-dashboard .ap-owner-kpi[role="button"] { cursor:pointer; }
            #ap-admin-dashboard .ap-owner-kpi__top { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
            #ap-admin-dashboard .ap-owner-kpi__label { font-size:13.5px; font-weight:600; color:var(--secondary); }
            #ap-admin-dashboard .ap-owner-kpi__eye { margin-left:auto; display:flex; color:#9aa3af; transition:color .16s; }
            #ap-admin-dashboard .ap-owner-kpi__eye-on { display:none; }
            #ap-admin-dashboard .ap-owner-kpi:hover .ap-owner-kpi__eye { color:var(--primary); }
            #ap-admin-dashboard .ap-owner-kpi:hover .ap-owner-kpi__eye-off { display:none; }
            #ap-admin-dashboard .ap-owner-kpi:hover .ap-owner-kpi__eye-on { display:block; }
            #ap-admin-dashboard .ap-owner-kpi__num { font-size:40px; font-weight:800; letter-spacing:-0.03em; line-height:1; color:var(--text); }
            #ap-admin-dashboard .ap-owner-kpi__num small { font-size:16px; font-weight:700; color:var(--secondary); margin-left:4px; }
            #ap-admin-dashboard .ap-owner-kpi__chips { display:flex; gap:7px; flex-wrap:wrap; margin-top:12px; }
            #ap-admin-dashboard .ap-owner-kpi__chip { font-size:11.5px; font-weight:600; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 9px; }
            #ap-admin-dashboard .ap-owner-kpi__num, #ap-admin-dashboard .ap-owner-kpi__chips { filter:blur(8px); opacity:.42; user-select:none; transition:filter .24s ease, opacity .24s ease; }
            #ap-admin-dashboard .ap-owner-kpi:hover .ap-owner-kpi__num, #ap-admin-dashboard .ap-owner-kpi:hover .ap-owner-kpi__chips { filter:blur(0); opacity:1; }
            #ap-admin-dashboard .ap-owner-kpi--archive .ap-owner-kpi__arch-ico { margin-left:auto; color:var(--primary); display:flex; }
            #ap-admin-dashboard .ap-owner-kpi--archive .ap-owner-kpi__arch-sub { font-size:12.5px; font-weight:600; color:var(--secondary); margin-top:auto; }
            /* 패널 헤더(메모) */
            #ap-admin-dashboard .ap-owner-panel-head { display:flex; align-items:center; gap:10px; margin-bottom:12px; padding:0 2px; }
            #ap-admin-dashboard .ap-owner-panel-title { margin:0; }
            #ap-admin-dashboard .ap-owner-panel-meta { margin-left:auto; font-size:12.5px; font-weight:600; color:var(--secondary); }
            /* 오늘 일정·메모 */
            #ap-admin-dashboard .ap-owner-memo-card { padding:10px 12px 12px !important; display:flex; flex-direction:column; }
            #ap-admin-dashboard .ap-owner-memo-card:hover { transform:none !important; box-shadow:none !important; }
            #ap-admin-dashboard .ap-owner-memo__list { display:flex; flex-direction:column; }
            #ap-admin-dashboard .ap-owner-memo__empty { padding:20px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; }
            #ap-admin-dashboard .ap-owner-memo__item { display:flex; align-items:flex-start; gap:10px; padding:10px; border-radius:9px; transition:background .12s; }
            #ap-admin-dashboard .ap-owner-memo__item:hover { background:var(--surface-2); }
            #ap-admin-dashboard .ap-owner-memo__check { flex:0 0 auto; width:19px; height:19px; margin-top:1px; border-radius:6px; border:1.7px solid var(--border); background:transparent; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; padding:0; }
            #ap-admin-dashboard .ap-owner-memo__check svg { opacity:0; }
            #ap-admin-dashboard .ap-owner-memo__item.is-done .ap-owner-memo__check { background:var(--success); border-color:var(--success); }
            #ap-admin-dashboard .ap-owner-memo__item.is-done .ap-owner-memo__check svg { opacity:1; }
            #ap-admin-dashboard .ap-owner-memo__text { flex:1; min-width:0; font-size:13.5px; font-weight:500; color:var(--text); line-height:1.5; word-break:break-word; }
            #ap-admin-dashboard .ap-owner-memo__item.is-done .ap-owner-memo__text { color:var(--secondary); text-decoration:line-through; }
            #ap-admin-dashboard .ap-owner-memo__del { flex:0 0 auto; border:0; background:transparent; color:#aeb6c0; font-size:13px; cursor:pointer; padding:2px 5px; border-radius:6px; line-height:1; }
            #ap-admin-dashboard .ap-owner-memo__del:hover { color:var(--error); background:var(--surface-2); }
            #ap-admin-dashboard .ap-owner-memo__add { display:flex; gap:8px; margin-top:6px; padding-top:9px; border-top:1px solid var(--border); }
            #ap-admin-dashboard .ap-owner-memo__add input { flex:1; min-width:0; height:38px; border:1px solid var(--border); border-radius:10px; background:var(--surface-2); color:var(--text); padding:0 12px; font-family:inherit; font-size:13px; outline:none; }
            #ap-admin-dashboard .ap-owner-memo__add-btn { flex:0 0 auto; height:38px; padding:0 15px; border-radius:10px; border:1px solid var(--primary); background:var(--primary); color:#fff; font-size:13px; font-weight:600; cursor:pointer; }
            @media (max-width:1180px) {
                #ap-admin-dashboard .ap-owner-cell--8 { grid-column:span 12; }
                #ap-admin-dashboard .ap-owner-cell--4 { grid-column:span 6; }
                #ap-admin-dashboard .ap-owner-kpi-grid { grid-template-columns:repeat(2, minmax(0,1fr)); }
            }
            @media (max-width:820px) {
                #ap-admin-dashboard .ap-owner-cell--8, #ap-admin-dashboard .ap-owner-cell--4 { grid-column:span 12; }
            }
            @media (max-width:560px) {
                #ap-admin-dashboard .ap-owner-kpi-grid { grid-template-columns:1fr; }
                #ap-admin-dashboard .ap-owner-kpi__num { font-size:34px; }
            }

            /* ════ [REDESIGN] 원장 상단 바 (날짜 · AP/EIE 토글 · 통합검색) ════ */
            #ap-admin-dashboard .ap-owner-topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:18px; }
            #ap-admin-dashboard .ap-owner-topbar__date { font-size:15px; font-weight:700; color:var(--text); letter-spacing:-0.01em; white-space:nowrap; }
            #ap-admin-dashboard .ap-owner-topbar__tools { display:flex; align-items:center; gap:12px; margin-left:auto; min-width:0; }
            #ap-admin-dashboard .ap-owner-sysgate { display:inline-flex; align-items:center; gap:4px; padding:4px; border:1px solid var(--border); border-radius:999px; background:var(--surface-2); flex:0 0 auto; }
            #ap-admin-dashboard .ap-owner-sysgate__tab { appearance:none; height:34px; padding:0 16px; border:0; border-radius:999px; background:transparent; color:var(--secondary); font-size:13px; font-weight:600; line-height:1; cursor:pointer; display:inline-flex; align-items:center; text-decoration:none; white-space:nowrap; }
            #ap-admin-dashboard .ap-owner-sysgate__tab.is-current { background:var(--surface); color:var(--text); box-shadow:0 1px 3px rgba(15,23,42,0.08); }
            #ap-admin-dashboard .ap-owner-panel-sub { font-size:12.5px; font-weight:600; color:var(--secondary); }

            /* ════ [REDESIGN] 액션 버튼 아이콘 (포인트 컬러) ════ */
            #ap-admin-dashboard .ap-admin-shortcuts .ap-admin-action-card { gap:8px; }
            #ap-admin-dashboard .ap-action-ico { display:inline-flex; align-items:center; justify-content:center; flex:0 0 auto; color:var(--primary); }
            #ap-admin-dashboard .ap-action-ico svg { display:block; }
            #ap-admin-dashboard .ap-admin-shortcuts .ap-admin-action-card:hover .ap-action-ico { color:var(--primary); }
            @media (max-width:480px) {
                #ap-admin-dashboard .ap-action-ico { display:none; }
            }

            /* ════ [REDESIGN] 운영 통계 카드 3개 (숫자 가림 + 호버 브레이크다운 + 클릭 이동) ════ */
            #ap-admin-dashboard .ap-owner-stat-grid { display:grid; grid-template-columns:repeat(3, minmax(0,1fr)); gap:16px; }
            #ap-admin-dashboard .ap-owner-stat { position:relative; overflow:visible; border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:20px 22px; min-height:118px; display:flex; flex-direction:column; justify-content:center; gap:14px; box-sizing:border-box; transition:border-color .16s ease, transform .16s ease; }
            #ap-admin-dashboard .ap-owner-stat[role="button"] { cursor:pointer; }
            #ap-admin-dashboard .ap-owner-stat__icon { display:inline-flex; align-items:center; justify-content:center; width:50px; height:50px; border-radius:15px; flex:0 0 auto; }
            #ap-admin-dashboard .ap-owner-stat__title { font-size:20px; font-weight:700; letter-spacing:-0.02em; color:var(--text); line-height:1.2; }
            #ap-admin-dashboard .ap-owner-stat--blue .ap-owner-stat__icon { color:var(--primary); background:rgba(var(--primary-rgb),0.11); }
            #ap-admin-dashboard .ap-owner-stat--green .ap-owner-stat__icon { color:var(--success); background:rgba(var(--success-rgb),0.13); }
            #ap-admin-dashboard .ap-owner-stat--amber .ap-owner-stat__icon { color:var(--warning); background:rgba(var(--warning-rgb),0.15); }
            #ap-admin-dashboard .ap-owner-stat--red .ap-owner-stat__icon { color:var(--error); background:rgba(var(--error-rgb),0.12); }
            @media (hover:hover) {
                #ap-admin-dashboard .ap-owner-stat[role="button"]:hover { transform:translateY(-1px); border-color:rgba(var(--primary-rgb),0.35); }
            }
            #ap-admin-dashboard .ap-owner-stat__tip { position:absolute; left:0; right:0; top:calc(100% + 8px); padding:12px 14px; border-radius:12px; background:var(--surface); border:1px solid var(--border); box-shadow:0 14px 32px rgba(15,23,42,0.16); opacity:0; transform:translateY(-4px); pointer-events:none; transition:opacity .15s ease, transform .15s ease; z-index:20; }
            #ap-admin-dashboard .ap-owner-stat:hover .ap-owner-stat__tip { opacity:1; transform:translateY(0); }
            #ap-admin-dashboard .ap-owner-stat__tip-title { font-size:12.5px; font-weight:700; color:var(--text); margin-bottom:6px; white-space:nowrap; }
            #ap-admin-dashboard .ap-owner-stat__tip-row { display:flex; justify-content:space-between; gap:12px; font-size:12px; font-weight:600; color:var(--secondary); padding:1px 0; white-space:nowrap; }
            @media (max-width:720px) {
                #ap-admin-dashboard .ap-owner-topbar { flex-direction:column; align-items:stretch; }
                #ap-admin-dashboard .ap-owner-topbar__tools { margin-left:0; flex-wrap:wrap; }
                #ap-admin-dashboard .ap-owner-topbar__tools .ap-admin-global-search { width:100%; flex:1 1 100%; }
                #ap-admin-dashboard .ap-owner-stat-grid { grid-template-columns:1fr; }
            }
        </style>
    `;

    root.innerHTML = `<div id="ap-admin-dashboard" class="owner-dashboard-shell ap-owner-redesign">
        ${adminUnifiedStyle}
        ${adminTopbarHtml}
        ${adminShortcutRow}
        <div id="ap-admin-diagnostic-alert-anchor"></div>
        ${todayOverviewHtml}
        <div class="ap-owner-grid">
            <div class="ap-owner-cell ap-owner-cell--8">${teacherCardsHtml}</div>
            <div class="ap-owner-cell ap-owner-cell--4">${todayMemoHtml}</div>
            <div class="ap-owner-cell ap-owner-cell--8">${recentConsultationHtml}</div>
            <div class="ap-owner-cell ap-owner-cell--4">${adminScheduleHtml}</div>
            <div class="ap-owner-cell ap-owner-cell--12">${recentStudentsHtml}</div>
        </div>
    </div>`;

    if (typeof apRefreshPublicInquiryFloating === 'function') {
        apRefreshPublicInquiryFloating(0);
    }
    if (typeof apRenderAdminDiagnosticAssessmentAlert === 'function') {
        apRenderAdminDiagnosticAssessmentAlert();
    }
}

function renderAdminJournalList(dateStr, teacherName = '') {
    const targetDate = dateStr || new Date().toLocaleDateString('sv-SE');
    const safeTeacher = dashboardEscapeAttr(teacherName || '');
    let journals = (state.db.journals || []).filter(j => j.date === targetDate && j.status !== '작성중');
    if (teacherName) journals = journals.filter(j => j.teacher_name === teacherName);
    const title = teacherName ? `${teacherName} 선생님 일지` : '일지확인';
    
    const backBtn = teacherName ? `<button class="btn" style="width:100%; margin-bottom:16px; padding:14px; border-radius:12px; font-weight:500; background:var(--surface-2); border:none; color:var(--text);" onclick="closeModal(true)">닫기</button>` : '';
    
    const rows = journals.map(j => {
        const teacherArg = dashboardEscapeAttr(teacherName || j.teacher_name || '');
        const statusText = j.status === '결재완료' ? '확인완료' : j.status;
        const statusColor = 'var(--secondary)';
        const statusBg = 'var(--surface-2)';
        
        return `
            <div class="card" style="padding:16px; margin-bottom:12px; cursor:pointer; border:1px solid var(--border); border-radius:16px; box-shadow:var(--shadow); background:var(--surface);" onclick="openAdminJournalFeedback('${j.id}', '${teacherArg}')">
                <div style="display:flex; justify-content:space-between; margin-bottom:10px; gap:8px; align-items:center;">
                    <span style="font-size:15px; color:var(--text);; font-weight:500;">${apEscapeHtml(j.teacher_name)} 선생님</span>
                    <span style="font-size:11px; font-weight:500; color:${statusColor}; background:${statusBg}; border:1px solid var(--border); padding:4px 8px; border-radius:6px;">${apEscapeHtml(statusText)}</span>
                </div>
                <div style="font-size:13px; color:var(--text-soft); white-space:pre-wrap; max-height:60px; overflow:hidden; line-height:1.6;">${apEscapeHtml(j.content)}</div>
            </div>`;
    }).join('');
    
    showModal(`${apEscapeHtml(title)}`, `
        ${backBtn}
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; background:var(--surface-2); padding:12px 14px; border-radius:12px;">
            <span style="font-size:13px; color:var(--secondary); white-space:nowrap;; font-weight:500;">기준일</span>
            <input type="date" class="btn" value="${targetDate}" style="flex:1; text-align:left; border:none; background:transparent; padding:0; height:auto; min-height:0; font-size:14px; font-weight:500; color:var(--text);" onchange="renderAdminJournalList(this.value, '${safeTeacher}')">
        </div>
        <div style="max-height:55vh; overflow-y:auto; padding-right:4px;">
            ${journals.length ? rows : `<div style="text-align:center; color:var(--secondary); padding:30px; font-weight:500; font-size:13px; background:var(--surface-2); border-radius:12px;">해당 날짜에 제출된 일지가 없습니다.</div>`}
        </div>
    `);
}

function openAdminJournalFeedback(id, teacherName = '') {
    const journal = (state.db.journals || []).find(j => j.id === id);
    if (!journal) return toast('일지를 찾을 수 없습니다.', 'warn');
    const safeTeacher = dashboardEscapeAttr(teacherName || journal.teacher_name || '');
    
    showModal(`${apEscapeHtml(journal.teacher_name)} 선생님 일지`, `
        <textarea readonly class="btn" style="width:100%; height:200px; text-align:left; resize:vertical; font-size:14px; line-height:1.6; background:var(--surface-2); border:none; border-radius:12px; padding:16px; margin-bottom:12px; color:var(--text);">${apEscapeHtml(journal.content)}</textarea>
        <textarea id="journal-feedback" class="btn" placeholder="선생님께 전달할 피드백 (선택)" style="width:100%; height:90px; text-align:left; resize:vertical; border:1px solid var(--border); border-radius:12px; padding:14px; font-size:13px; background:var(--surface); color:var(--text);">${apEscapeHtml(journal.feedback || '')}</textarea>
        <div style="margin-top:16px;">
            <button class="btn btn-primary" style="width:100%; padding:16px; border-radius:14px; font-weight:500; font-size:15px;" onclick="approveJournal('${journal.id}', '${journal.date}', '${safeTeacher}')">확인완료</button>
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

function formatAdminRecentJournalDate(dateStr) {
    const datePart = String(dateStr || '').split('T')[0].split(' ')[0];
    const parts = datePart.split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => !Number.isFinite(n))) return datePart;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${parts[1]}/${parts[2]} ${weekdays[date.getDay()] || ''}`.trim();
}

function getAdminRecentTeacherJournals(teacherName, baseDateStr = '', days = 30) {
    const baseTime = apParseLocalDateTime(baseDateStr || new Date().toLocaleDateString('sv-SE'));
    if (baseTime === null) return [];
    return (state.db.journals || [])
        .filter(j => {
            if (String(j?.teacher_name || '') !== String(teacherName || '')) return false;
            if (String(j?.status || '') === '작성중') return false;
            const time = apParseLocalDateTime(j?.date);
            if (time === null) return false;
            const diff = (baseTime - time) / (1000 * 60 * 60 * 24);
            return diff >= 0 && diff < days;
        })
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
}

function openAdminRecentTeacherJournals(teacherName, baseDateStr = '') {
    const safeTeacher = dashboardEscapeAttr(teacherName || '');
    const rows = getAdminRecentTeacherJournals(teacherName, baseDateStr, 30).map(j => `
        <button type="button" class="btn" style="width:100%; min-height:44px; padding:0 14px; margin-bottom:6px; border-radius:12px; border:1px solid var(--border); background:var(--surface); color:var(--text); box-shadow:none; justify-content:flex-start; font-size:14px; font-weight:500;" onclick="openAdminJournalFeedback('${dashboardEscapeAttr(String(j.id || ''))}', '${safeTeacher}')">
            ${apEscapeHtml(formatAdminRecentJournalDate(j.date))}
        </button>
    `).join('');
    showModal('최근 일지', `<div style="max-height:55vh; overflow-y:auto;">${rows}</div>`);
}

function injectAdminTeacherTooltipStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('admin-teacher-tooltip-css')) return;
    const style = document.createElement('style');
    style.id = 'admin-teacher-tooltip-css';
    style.textContent = `
        .ap-teacher-count-tip { position: relative; }
        .ap-teacher-count-tip::after {
            content: attr(data-tip);
            position: absolute;
            bottom: calc(100% + 6px);
            left: 50%;
            transform: translateX(-50%);
            white-space: nowrap;
            font-size: 11px;
            font-weight: 500;
            color: var(--surface);
            background: var(--text);
            padding: 3px 8px;
            border-radius: 6px;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
            z-index: 10;
        }
        .ap-teacher-count-tip:hover::after { opacity: 1; }
    `;
    document.head.appendChild(style);
}

function renderAdminTeacherCards(todayStr) {
    injectDashboardOpsStyles();
    injectAdminTeacherTooltipStyles();
    const activeClasses = (state?.db?.classes || []).filter(c => Number(c?.is_active) !== 0);
    const teacherMap = {};
    activeClasses.forEach(c => {
        const tName = String(c.teacher_name || '담당').trim();
        if (!tName || tName === '담당') return;
        if (!teacherMap[tName]) teacherMap[tName] = [];
        teacherMap[tName].push(c);
    });
    const teacherNames = Object.keys(teacherMap).filter(Boolean).sort((a, b) => a.localeCompare(b, 'ko'));
    if (!teacherNames.length) return `<div class="daily-close-empty">등록된 선생님이 없습니다.</div>`;

    return teacherNames.map(tName => {
        const myClasses = teacherMap[tName];
        const safeName = dashboardEscapeAttr(tName);
        const myClassIds = new Set(myClasses.map(c => String(c.id)));
        const myStudentIds = new Set(
            (state?.db?.class_students || [])
                .filter(m => myClassIds.has(String(m.class_id)))
                .map(m => String(m.student_id))
        );
        const activeCount = (state?.db?.students || [])
            .filter(s => myStudentIds.has(String(s.id)) && adminNormalizeStatus(s.status) === '재원')
            .length;

        return `
            <div class="card ap-admin-teacher-card">
                <div class="admin-teacher-card__head">
                    <div class="admin-teacher-card__name">${apEscapeHtml(tName)} 선생님</div>
                    <div class="admin-teacher-card__quick-actions">
                        <button class="btn admin-teacher-card__quick-action" onclick="event.stopPropagation(); renderAdminTeacherStudents('${safeName}')">담당반</button>
                        <button class="btn admin-teacher-card__quick-action ap-teacher-count-tip" data-tip="총원 ${activeCount}명" onclick="event.stopPropagation(); renderAdminTeacherAllStudents('${safeName}')">재원</button>
                    </div>
                </div>
                <div class="admin-teacher-card__journal">
                    <div class="admin-teacher-card__journal-title" style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
                        <span>이번 주 일지</span>
                        <button type="button" class="btn admin-teacher-card__quick-action" style="min-height:28px; height:28px; padding:0 8px; font-size:11px;" onclick="event.stopPropagation(); openAdminRecentTeacherJournals('${safeName}')">최근 일지</button>
                    </div>
                    ${renderDashboardJournalWeekMatrix(tName, todayStr, myClasses)}
                </div>
            </div>`;
    }).join('');
}

function openAdminTeacherPanel(teacherName) {
    state.ui.currentAdminTeacherName = teacherName;
    const safeName = dashboardEscapeAttr(teacherName || '');
    renderAdminJournalList(new Date().toLocaleDateString('sv-SE'), safeName);
}

function renderAdminTeacherAllStudents(teacherName) {
    injectDashboardOpsStyles();
    const myClasses = (state?.db?.classes || []).filter(c => String(c.teacher_name || '담당').trim() === teacherName && Number(c.is_active) !== 0);
    const myClassIds = myClasses.map(c => String(c.id));
    const myStudentIds = [...new Set((state?.db?.class_students || [])
        .filter(m => myClassIds.includes(String(m.class_id)))
        .map(m => String(m.student_id)))];
    const gradeOrder = ['중1', '중2', '중3', '고1', '고2', '고3', '기타'];
    const gradeCounts = {};
    gradeOrder.forEach(label => { gradeCounts[label] = 0; });
    let totalCount = 0;
    (state?.db?.students || [])
        .filter(s => myStudentIds.includes(String(s.id)) && adminNormalizeStatus(s.status) === '재원')
        .forEach(s => {
            const grade = adminGetGradeLabel(s);
            const label = gradeOrder.includes(grade) ? grade : '기타';
            gradeCounts[label] += 1;
            totalCount += 1;
        });

    const chips = gradeOrder
        .filter(label => gradeCounts[label] > 0)
        .map(label => `<span class="admin-teacher-grade-pill"><span>${apEscapeHtml(label)}</span><span>${gradeCounts[label]}명</span></span>`)
        .join('');

    showModal(`${apEscapeHtml(teacherName)} 선생님 재원`, `
        <div class="admin-teacher-grade-pills">
            ${totalCount > 0 ? `<span class="admin-teacher-grade-pill admin-teacher-grade-pill--total"><span>총원</span><span>${totalCount}명</span></span>${chips}` : `<div class="daily-close-empty">재원생이 없습니다.</div>`}
        </div>
    `);
}

function renderAdminTeacherStudents(teacherName) {
    const myClasses = sortClassesForDashboard(state.db.classes.filter(c => String(c.teacher_name || '담당').trim() === teacherName && Number(c.is_active) !== 0));
    const rows = myClasses.map(cls => {
        const safeClassId = dashboardEscapeAttr(cls.id || '');
        const isToday = isClassScheduledTodayForDashboard(cls.id);
        return `
            <button class="btn" style="width:100%; min-height:50px; padding:10px 12px; border-radius:14px; border:1px solid var(--border); background:var(--surface); box-shadow:none; display:flex; align-items:center; justify-content:space-between; gap:12px; text-align:left;" onclick="closeModal(true); if(typeof renderClass==='function') renderClass('${safeClassId}'); else toast('반 화면을 불러오지 못했습니다.', 'warn');">
                <div style="min-width:0; flex:1;">
                    <div style="font-size:14px; font-weight:500; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(cls.name || '')}</div>
                    <div style="font-size:11px; font-weight:500; color:var(--secondary); margin-top:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${apEscapeHtml(cls.grade || '')}${cls.time_label ? ` · ${apEscapeHtml(cls.time_label)}` : ''}</div>
                </div>
                <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
                    <span style="font-size:11px; font-weight:500; color:${isToday ? 'var(--text)' : 'var(--secondary)'}; background:var(--surface-2); border:1px solid var(--border); padding:4px 8px; border-radius:999px; white-space:nowrap;">${isToday ? '오늘 수업' : '수업 없음'}</span>
                    <span style="font-size:18px; font-weight:500; color:var(--secondary); line-height:1;">›</span>
                </div>
            </button>
        `;
    }).join('');

    showModal(`${apEscapeHtml(teacherName)} 선생님 담당반`, `
        <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="max-height:56vh; overflow-y:auto; display:flex; flex-direction:column; gap:7px; padding-right:4px;">
                ${rows || `<div style="text-align:center; padding:30px; color:var(--secondary); font-weight:500; background:var(--surface-2); border-radius:16px;">담당반이 없습니다.</div>`}
            </div>
        </div>
    `);
}

// [Button Audit Patch] Split-module duplicate handlers removed from dashboard.js.
// Source of truth: management.js, textbook.js, memo.js, schedule.js.

function getAdminTeacherRows() {
    return Array.isArray(state?.ui?.adminTeacherRows) ? state.ui.adminTeacherRows : [];
}

function adminTeacherRoleLabel(role) {
    return String(role || '') === 'admin' ? '원장' : '선생님';
}

async function openAdminTeacherAccountManage() {
    showModal('선생님 계정', `<div style="text-align:center; padding:36px; color:var(--secondary); font-size:13px; font-weight:500;">선생님 계정을 불러오는 중입니다.</div>`);

    try {
        const data = await api.get('teachers');
        if (data?.error) return toast(data.error || '선생님 계정을 불러오지 못했습니다.', 'error');
        if (!state.ui) state.ui = {};
        state.ui.adminTeacherRows = Array.isArray(data.teachers) ? data.teachers : [];
        renderAdminTeacherAccountManage();
    } catch (e) {
        console.error('[openAdminTeacherAccountManage] failed:', e);
        toast('선생님 계정 조회 중 오류가 발생했습니다.', 'error');
    }
}

function renderAdminTeacherAccountManage() {
    const teachers = getAdminTeacherRows().slice().sort((a, b) => {
        const ar = String(a.role || '') === 'admin' ? 0 : 1;
        const br = String(b.role || '') === 'admin' ? 0 : 1;
        if (ar !== br) return ar - br;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });

    const rows = teachers.map(t => {
        const safeId = apEscapeHtml(String(t.id || ''));
        const role = String(t.role || 'teacher');
        const roleColor = role === 'admin' ? 'var(--error)' : 'var(--text)';
        const roleBg = role === 'admin' ? 'rgba(var(--error-rgb),0.10)' : 'var(--surface-2)';
        return `
            <div style="padding:14px 0; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; gap:12px;">
                <div style="min-width:0; flex:1;">
                    <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                        <span style="font-size:14px; color:var(--text); line-height:1.35;; font-weight:500;">${apEscapeHtml(t.name || '')}</span>
                        <span style="font-size:11px; font-weight:500; color:${roleColor}; background:${roleBg}; padding:3px 8px; border-radius:999px;">${adminTeacherRoleLabel(role)}</span>
                    </div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-top:4px; line-height:1.4;">ID ${apEscapeHtml(t.login_id || '')}</div>
                </div>
                <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:flex-end;">
                    <button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:var(--surface-2); border:none;" onclick="openAdminEditTeacherModal('${safeId}')">수정</button>
                    <button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px; background:rgba(var(--warning-rgb),0.12); color:var(--warning); border:none;" onclick="openAdminResetTeacherPasswordModal('${safeId}')">PW 초기화</button>
                </div>
            </div>
        `;
    }).join('');

    showModal('선생님 계정', `
        <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500; margin-bottom:14px;" onclick="openAdminCreateTeacherModal()">새 선생님 계정</button>
        <div style="max-height:58vh; overflow-y:auto; padding-right:4px;">
            ${rows || `<div style="text-align:center; padding:28px; color:var(--secondary); font-size:13px; font-weight:500;">등록된 선생님 계정이 없습니다.</div>`}
        </div>
    `);
}

function openAdminCreateTeacherModal() {
    showModal('새 선생님 계정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="admin-new-teacher-name" class="btn" placeholder="이름" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="admin-new-teacher-login" class="btn" placeholder="로그인 ID" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <input id="admin-new-teacher-password" type="password" class="btn" placeholder="초기 비밀번호" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <select id="admin-new-teacher-role" class="btn" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
                <option value="teacher">선생님</option>
                <option value="admin">원장</option>
            </select>
            <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5; background:var(--surface-2); padding:10px 12px; border-radius:12px;">계정 생성 후 담당반 배정은 반 관리/담당 변경 메뉴에서 별도로 진행합니다.</div>
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminCreateTeacher()">생성</button>
        </div>
    `);
}

async function handleAdminCreateTeacher() {
    const name = document.getElementById('admin-new-teacher-name')?.value.trim() || '';
    const loginId = document.getElementById('admin-new-teacher-login')?.value.trim() || '';
    const password = document.getElementById('admin-new-teacher-password')?.value.trim() || '';
    const role = document.getElementById('admin-new-teacher-role')?.value || 'teacher';

    if (!name || !loginId || !password) return toast('이름, ID, 비밀번호를 모두 입력하세요.', 'warn');
    if (password.length < 4) return toast('비밀번호는 4자 이상으로 입력하세요.', 'warn');

    try {
        const r = await api.post('teachers', { name, login_id: loginId, password, role });
        if (r?.success) {
            toast('선생님 계정이 생성되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '선생님 계정 생성에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminCreateTeacher] failed:', e);
        toast('선생님 계정 생성 중 오류가 발생했습니다.', 'error');
    }
}

function openAdminEditTeacherModal(teacherId) {
    const teacher = getAdminTeacherRows().find(t => String(t.id) === String(teacherId));
    if (!teacher) return toast('선생님 계정을 찾을 수 없습니다.', 'warn');

    showModal('선생님 계정 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:12px; color:var(--secondary); font-weight:500; padding:0 4px;">로그인 ID: ${apEscapeHtml(teacher.login_id || '')}</div>
            <input id="admin-edit-teacher-name" class="btn" value="${apEscapeHtml(teacher.name || '')}" placeholder="이름" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <select id="admin-edit-teacher-role" class="btn" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
                <option value="teacher" ${String(teacher.role || '') !== 'admin' ? 'selected' : ''}>선생님</option>
                <option value="admin" ${String(teacher.role || '') === 'admin' ? 'selected' : ''}>원장</option>
            </select>
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminUpdateTeacher('${apEscapeHtml(String(teacher.id || ''))}')">저장</button>
        </div>
    `);
}

async function handleAdminUpdateTeacher(teacherId) {
    const name = document.getElementById('admin-edit-teacher-name')?.value.trim() || '';
    const role = document.getElementById('admin-edit-teacher-role')?.value || 'teacher';
    if (!name) return toast('이름을 입력하세요.', 'warn');

    try {
        const r = await api.patch(`teachers/${teacherId}`, { name, role });
        if (r?.success) {
            toast('선생님 계정이 수정되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '선생님 계정 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminUpdateTeacher] failed:', e);
        toast('선생님 계정 수정 중 오류가 발생했습니다.', 'error');
    }
}

function openAdminResetTeacherPasswordModal(teacherId) {
    const teacher = getAdminTeacherRows().find(t => String(t.id) === String(teacherId));
    if (!teacher) return toast('선생님 계정을 찾을 수 없습니다.', 'warn');

    showModal('비밀번호 초기화', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5; background:var(--surface-2); padding:12px; border-radius:12px;">${apEscapeHtml(teacher.name || '')} 선생님의 비밀번호를 새 값으로 초기화합니다.</div>
            <input id="admin-reset-teacher-password" type="password" class="btn" placeholder="새 비밀번호" style="width:100%; text-align:left; background:var(--surface-2); border:none;">
            <button class="btn btn-primary" style="width:100%; min-height:46px; border-radius:14px; font-size:13px; font-weight:500;" onclick="handleAdminResetTeacherPassword('${apEscapeHtml(String(teacher.id || ''))}')">초기화</button>
        </div>
    `);
}

async function handleAdminResetTeacherPassword(teacherId) {
    const newPassword = document.getElementById('admin-reset-teacher-password')?.value.trim() || '';
    if (!newPassword) return toast('새 비밀번호를 입력하세요.', 'warn');
    if (newPassword.length < 4) return toast('비밀번호는 4자 이상으로 입력하세요.', 'warn');
    if (!confirm('비밀번호를 초기화할까요?')) return;

    try {
        const r = await api.patch(`teachers/${teacherId}/reset-password`, { new_password: newPassword });
        if (r?.success) {
            toast('비밀번호가 초기화되었습니다.', 'success');
            await openAdminTeacherAccountManage();
            return;
        }
        toast(r?.message || r?.error || '비밀번호 초기화에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAdminResetTeacherPassword] failed:', e);
        toast('비밀번호 초기화 중 오류가 발생했습니다.', 'error');
    }
}

function apRemovePublicInquiryFloating() {
    if (typeof document === 'undefined') return;
    document.querySelectorAll('#apPublicInquiryFloatingStyle, #apPublicInquiryFloat').forEach(el => el.remove());
}

function apEnsurePublicInquiryFloatingStyle() {
    if (typeof document === 'undefined' || document.getElementById('apPublicInquiryFloatingStyle')) return;
    const style = document.createElement('style');
    style.id = 'apPublicInquiryFloatingStyle';
    style.textContent = `
        #apPublicInquiryFloat {
            position: fixed;
            right: 18px;
            bottom: 22px;
            z-index: 1200;
            width: 54px;
            height: 54px;
            border: 1px solid rgba(183, 20, 27, .24);
            border-radius: 999px;
            background: #b7141b;
            color: #fff;
            box-shadow: 0 16px 36px rgba(15, 23, 42, .24);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            animation: apPublicInquiryPulse 2.1s ease-in-out infinite;
        }
        #apPublicInquiryFloat:hover { transform: translateY(-1px); }
        #apPublicInquiryFloat .ap-inquiry-float-icon {
            font-size: 22px;
            line-height: 1;
        }
        #apPublicInquiryFloat .ap-inquiry-float-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            min-width: 21px;
            height: 21px;
            padding: 0 6px;
            border-radius: 999px;
            background: #fff;
            color: #b7141b;
            border: 1px solid rgba(183, 20, 27, .24);
            font-size: 11px;
            font-weight: 900;
            line-height: 19px;
            text-align: center;
            box-shadow: 0 6px 14px rgba(15, 23, 42, .16);
        }
        @keyframes apPublicInquiryPulse {
            0%, 100% { box-shadow: 0 14px 32px rgba(15, 23, 42, .22), 0 0 0 0 rgba(183, 20, 27, .28); }
            50% { box-shadow: 0 14px 32px rgba(15, 23, 42, .18), 0 0 0 9px rgba(183, 20, 27, 0); }
        }
        @media (max-width: 768px) {
            #apPublicInquiryFloat { right: 14px; bottom: 18px; width: 50px; height: 50px; }
            #apPublicInquiryFloat .ap-inquiry-float-icon { font-size: 20px; }
        }
    `;
    document.head.appendChild(style);
}

function apRenderPublicInquiryFloating(count) {
    if (typeof document === 'undefined') return;
    const safeCount = Number(count || 0);
    if (apAdminDashboardRole() !== 'admin' || safeCount <= 0) {
        apRemovePublicInquiryFloating();
        return;
    }
    apEnsurePublicInquiryFloatingStyle();
    let btn = document.getElementById('apPublicInquiryFloat');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'apPublicInquiryFloat';
        btn.type = 'button';
        btn.addEventListener('click', function() {
            if (typeof openPublicInquiryList === 'function') openPublicInquiryList('new');
            else if (typeof toast === 'function') toast('상담 신청 목록을 불러오지 못했습니다.', 'warn');
        });
        document.body.appendChild(btn);
    }
    const labelCount = safeCount > 99 ? '99+' : String(safeCount);
    btn.setAttribute('aria-label', `신규 상담 ${labelCount}건`);
    btn.title = `신규 상담 ${labelCount}건`;
    btn.innerHTML = `<span class="ap-inquiry-float-icon" aria-hidden="true">💬</span><span class="ap-inquiry-float-badge">${labelCount}</span>`;
}

async function apRefreshPublicInquiryFloating(attempt = 0) {
    if (apAdminDashboardRole() !== 'admin') {
        apRemovePublicInquiryFloating();
        return 0;
    }
    if (typeof api === 'undefined' || !api || typeof api.get !== 'function') {
        if (attempt < 2 && typeof setTimeout === 'function') setTimeout(() => apRefreshPublicInquiryFloating(attempt + 1), 350);
        return 0;
    }
    try {
        const res = await api.get('public-inquiries?status=new&limit=100');
        const rows = Array.isArray(res?.inquiries) ? res.inquiries : [];
        apRenderPublicInquiryFloating(rows.length);
        return rows.length;
    } catch (err) {
        apRemovePublicInquiryFloating();
        if (window.console && console.warn) console.warn('[APMS admin] public inquiry floating load failed', err);
        return 0;
    }
}


function apInquiryStatusLabel(status) {
    const map = { new: '신규', checked: '확인', done: '완료' };
    return map[String(status || 'new')] || '신규';
}

function apInquiryStatusStyle(status) {
    const s = String(status || 'new');
    if (s === 'done') return 'background:rgba(20,184,166,.12); color:#0f766e; border-color:rgba(20,184,166,.24);';
    if (s === 'checked') return 'background:rgba(37,99,235,.10); color:#1d4ed8; border-color:rgba(37,99,235,.20);';
    return 'background:rgba(183,20,27,.10); color:#b7141b; border-color:rgba(183,20,27,.20);';
}

function apRenderPublicInquiryRows(rows) {
    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
        return `<div style="padding:28px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">아직 접수된 상담 신청이 없습니다.</div>`;
    }
    return list.map(row => {
        const id = apEscapeHtml(row.id || '');
        const status = String(row.status || 'new');
        const date = apEscapeHtml(String(row.created_at || '').slice(0, 16));
        const interest = apEscapeHtml(row.interest || '미정');
        const grade = apEscapeHtml(row.student_grade || '학년 미입력');
        const name = apEscapeHtml(row.parent_name || '이름 없음');
        const phone = apEscapeHtml(row.phone || '연락처 없음');
        const message = apEscapeHtml(row.message || '문의 내용 없음');
        const memo = apEscapeHtml(row.memo || '');
        return `
            <article style="border:1px solid var(--border); border-radius:16px; background:var(--surface); padding:14px; display:grid; gap:10px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                    <div style="min-width:0;">
                        <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center; margin-bottom:6px;">
                            <span style="font-size:11px; font-weight:700; border:1px solid; border-radius:999px; padding:3px 8px; ${apInquiryStatusStyle(status)}">${apInquiryStatusLabel(status)}</span>
                            <span style="font-size:12px; color:var(--secondary); font-weight:500;">${date}</span>
                        </div>
                        <div style="font-size:15px; font-weight:800; color:var(--text);">${name} · ${phone}</div>
                        <div style="font-size:12px; color:var(--secondary); margin-top:3px;">${interest} · ${grade}</div>
                    </div>
                    <a class="btn" href="tel:${phone.replace(/[^0-9+]/g, '')}" style="padding:8px 10px; font-size:12px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border);">전화</a>
                </div>
                <div style="font-size:13px; line-height:1.55; color:var(--text); background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:10px; white-space:pre-wrap;">${message}</div>
                <textarea id="publicInquiryMemo-${id}" style="width:100%; min-height:64px; border:1px solid var(--border); border-radius:12px; padding:10px; font:inherit; font-size:13px; resize:vertical;" placeholder="처리 메모">${memo}</textarea>
                <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px;">
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px;" onclick="apUpdatePublicInquiry('${id}', 'new')">신규</button>
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px;" onclick="apUpdatePublicInquiry('${id}', 'checked')">확인</button>
                    <button class="btn" style="padding:9px 8px; font-size:12px; border-radius:10px; background:var(--text); color:white;" onclick="apUpdatePublicInquiry('${id}', 'done')">완료</button>
                </div>
            </article>
        `;
    }).join('');
}

async function openPublicInquiryList(statusFilter) {
    if (typeof showModal !== 'function') {
        if (typeof toast === 'function') toast('상담 신청 목록을 열 수 없습니다.', 'warn');
        return;
    }
    const filter = String(statusFilter || '').trim();
    window.__apPublicInquiryListFilter = filter;
    showModal(filter === 'new' ? '신규 상담 신청' : '상담 신청', `<div id="publicInquiryList" style="display:grid; gap:10px; min-height:120px;"><div style="padding:24px; text-align:center; color:var(--secondary);">상담 신청을 불러오는 중입니다.</div></div>`);
    try {
        const query = filter ? `public-inquiries?status=${encodeURIComponent(filter)}&limit=100` : 'public-inquiries?limit=100';
        const res = await api.get(query);
        const box = document.getElementById('publicInquiryList');
        if (!box) return;
        if (!res || res.error || res.success === false) {
            box.innerHTML = `<div style="padding:28px; text-align:center; color:var(--error); font-size:13px;">상담 신청 목록을 불러오지 못했습니다.</div>`;
            return;
        }
        box.innerHTML = apRenderPublicInquiryRows(res.inquiries || []);
    } catch (err) {
        const box = document.getElementById('publicInquiryList');
        if (box) box.innerHTML = `<div style="padding:28px; text-align:center; color:var(--error); font-size:13px;">상담 신청 목록을 불러오지 못했습니다.</div>`;
        if (window.console && console.warn) console.warn('[APMS admin] public inquiries load failed', err);
    }
}

async function apUpdatePublicInquiry(id, status) {
    const memoEl = document.getElementById(`publicInquiryMemo-${id}`);
    const memo = memoEl ? memoEl.value : '';
    try {
        const res = await api.patch(`public-inquiries/${encodeURIComponent(id)}`, { status, memo });
        if (!res || res.error || res.success === false) {
            if (typeof toast === 'function') toast(res?.message || res?.error || '상담 상태 저장 실패', 'error');
            return;
        }
        if (typeof toast === 'function') toast('상담 상태를 저장했습니다.', 'success');
        await openPublicInquiryList(window.__apPublicInquiryListFilter || '');
        await apRefreshPublicInquiryFloating();
    } catch (err) {
        if (typeof toast === 'function') toast('상담 상태 저장 중 오류가 발생했습니다.', 'error');
        if (window.console && console.warn) console.warn('[APMS admin] public inquiry update failed', err);
    }
}
