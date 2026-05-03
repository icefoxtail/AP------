/**
 * AP Math OS 1.0 [js/student.js]
 * 학생 관리 및 프로필 관제 홈
 * [Fixed Standard UI]: Typography(Fixed) & Spacing(Fixed) 전면 적용본
 */

// [UI Standard]: 공통 스타일 주입 (고정 규격 반영)
function injectStudentStyles() {
    if (document.getElementById('student-detail-style')) return;
    const style = document.createElement('style');
    style.id = 'student-detail-style';
    style.textContent = `
        .std-tab-content { animation: stdFadeIn 0.25s ease-out; }
        @keyframes stdFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .std-badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; line-height: 1.5; }
        .std-input-base { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 600; line-height: 1.4; }
    `;
    document.head.appendChild(style);
}

// ── 신입/휴원 상태 헬퍼 ──────────────────────────────────────────
function isStudentNewMember(s) {
    if (!s) return false;
    if (String(s.memo || '').indexOf('#신입') === -1) return false;
    
    if (s.created_at) {
        const createdTime = new Date(String(s.created_at).split(' ')[0]).getTime();
        if (!isNaN(createdTime) && (Date.now() - createdTime) / (1000 * 60 * 60 * 24) > 30) {
            return false;
        }
    }
    return true;
}

function isStudentOnLeave(s) {
    return !!(s && (s.status === '휴원' || String(s.memo || '').indexOf('#휴원') !== -1));
}

/**
 * 학생 상세 진입점 (기존 유지)
 */
async function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    await ensureBlueprintsForSessions(exs);

    renderStudentDetailTab(sid, 'grade');
}

function returnFromStudentFlow(ctx = null) {
    if (typeof returnToPreviousManagementView === 'function') {
        return returnToPreviousManagementView('dashboard', ctx);
    }

    closeModal();
    if (ctx?.type === 'addressBook' && typeof openAddressBook === 'function') return openAddressBook();
    if (ctx?.type === 'classDetail' && ctx.classId && typeof renderClass === 'function') return renderClass(ctx.classId);
    if (ctx?.type === 'studentDetail' && ctx.studentId && typeof renderStudentDetail === 'function') return renderStudentDetail(ctx.studentId);
    if (typeof renderDashboard === 'function') return renderDashboard();
}

/**
 * 탭별 내용 렌더링 엔진 (UI Standard 적용)
 */
function renderStudentDetailTab(sid, tab) {
    injectStudentStyles();
    const s = state.db.students.find(st => st.id === sid);
    const mIds = state.db.class_students.find(m => String(m.student_id) === String(sid));
    const cls = state.db.classes.find(c => String(c.id) === String(mIds?.class_id));
    const returnCtx = state.ui.returnView || {};
    if (returnCtx.type && typeof setModalReturnView === 'function') setModalReturnView(returnCtx);
    const backButton = returnCtx.type
        ? `<button class="btn" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; line-height: 1.2; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); color: var(--secondary); cursor: pointer; white-space: nowrap;" onclick="returnFromStudentFlow(state.ui.returnView)">뒤로</button>`
        : '';

    // 1. 프로필 헤더 (22px 대제목 및 고정 배지 규격)
    const headerHtml = `
        <div style="margin-bottom: 20px; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                <div style="min-width: 0;">
                    <h1 style="margin: 0; font-size: 22px; font-weight:700; color: var(--text); letter-spacing: -0.5px; line-height: 1.2;">${s.name}</h1>
                    <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
                        <span class="std-badge" style="background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);">${s.school_name} ${s.grade}</span>
                        <span class="std-badge" style="background: transparent; border: 1px solid var(--border); color: var(--secondary);">${cls?.name || '반 미배정'}</span>
                        ${s.student_pin ? `<span class="std-badge" style="background: var(--surface); border: 1px solid var(--border); color: var(--text); letter-spacing: 1px;">PIN ${s.student_pin}</span>` : ''}
                    </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                    ${backButton}
                    <button class="btn" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; line-height: 1.2; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); cursor: pointer; white-space: nowrap;" onclick="openEditStudent('${sid}', { returnTo: { type: 'studentDetail', studentId: '${sid}' } })">정보 수정</button>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: transparent; border: 1px solid var(--border); padding: 14px 12px; border-radius: 16px; min-width: 0;">
                    <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin-bottom: 4px; line-height: 1.5;">학생 연락처</div>
                    <div style="font-size: 13px; font-weight:700; color: var(--primary); cursor: pointer; line-height: 1.5; overflow-wrap: anywhere;" onclick="copyPhoneNumber('${s.student_phone}')">${s.student_phone || '미등록'}</div>
                </div>
                <div style="background: transparent; border: 1px solid var(--border); padding: 14px 12px; border-radius: 16px; min-width: 0;">
                    <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin-bottom: 4px; line-height: 1.5;">보호자 (${s.guardian_relation || '미지정'})</div>
                    <div style="font-size: 13px; font-weight:700; color: var(--primary); cursor: pointer; line-height: 1.5; overflow-wrap: anywhere;" onclick="copyPhoneNumber('${s.parent_phone}')">${s.parent_phone || '미등록'}</div>
                </div>
            </div>
        </div>
    `;

    // 2. 탭 바 (규격화된 행간 및 버튼)
    const tabBarHtml = `
        <div class="tab-bar" style="background: var(--bg); padding: 4px; border-radius: 16px; margin-bottom: 20px; display: flex; gap: 4px;">
            <button class="tab-btn ${tab==='grade'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','grade')">성적분석</button>
            <button class="tab-btn ${tab==='weak'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','weak')">취약단원</button>
            <button class="tab-btn ${tab==='cns'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','cns')">상담기록</button>
        </div>
    `;

    let bodyHtml = `<div class="std-tab-content">`;
    if (tab === 'grade') bodyHtml += renderGradeTab(sid);
    else if (tab === 'weak') bodyHtml += renderWeakTab(sid);
    else if (tab === 'cns') bodyHtml += renderCnsTab(sid);
    bodyHtml += `</div>`;

    // 4. 하단 액션바 (큰 CTA 버튼 규격: Min-H 52px / 14px)
    const footerHtml = `
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; gap: 10px;">
            <button class="btn btn-primary" style="flex: 1.5; min-height: 52px; font-size: 15px; font-weight:700; border-radius: 16px; box-shadow: none; cursor: pointer;" onclick="openReportPreview('${sid}')">알림톡 문구 생성</button>
            <button class="btn" style="flex: 1; min-height: 52px; font-size: 15px; font-weight:700; color: var(--primary); border: 1px solid var(--primary); background: transparent; border-radius: 16px; cursor: pointer;" onclick="openClinicBasketForStudent('${sid}')">클리닉 바구니</button>
        </div>
    `;

    showModal(`${s.name} 프로필`, `<div style="padding: 0 16px 4px; box-sizing: border-box;">${headerHtml}${tabBarHtml}${bodyHtml}${footerHtml}</div>`);
    if (tab === 'grade') setTimeout(() => drawGradeChart(sid), 50);
}

/**
 * [Tab 1] 성적분석 (16px 제목 및 14px 리스트 규격)
 */
function renderGradeTab(sid) {
    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    
    const chartArea = exs.length > 0 
        ? `<div style="margin-bottom: 24px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px;">
             <canvas id="studentGradeChart" style="width: 100%; height: 180px;"></canvas>
           </div>`
        : `<div style="padding: 40px 20px; text-align: center; color: var(--secondary); background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 20px; font-size: 13px; font-weight: 700; line-height: 1.5;">누적된 성적 기록이 없습니다.</div>`;

    const historyRows = exs.map(e => {
        const wrs = state.db.wrong_answers
            .filter(w => w.session_id === e.id)
            .sort((a,b)=>Number(a.question_id)-Number(b.question_id))
            .map(w => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(e, w.question_id) : `<span style="font-size: 11px; padding: 4px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; margin: 2px; color: var(--text-soft); font-weight: 600;">Q${w.question_id}</span>`)
            .join('');
            
        return `
            <div style="padding: 14px 4px; border-bottom: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                    <div style="min-width: 0;">
                        <div style="font-size: 15px; font-weight:700; color: var(--text); line-height: 1.4; overflow-wrap: anywhere;">${e.exam_title}</div>
                        <div style="font-size: 12px; color: var(--secondary); font-weight: 600; margin-top: 2px; line-height: 1.5;">${e.exam_date}</div>
                    </div>
                    <div style="font-size: 20px; font-weight:700; color: var(--primary); line-height: 1.2;">${e.score}점</div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">${wrs || '<span style="font-size: 11px; color: var(--secondary); font-weight: 600;">오답 없음</span>'}</div>
                <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                    <button class="btn" style="min-height: 32px; padding: 4px 8px; font-size: 11px; color: var(--warning); border: 1px solid rgba(255,165,2,0.2); background: rgba(255,165,2,0.05); border-radius: 10px; font-weight: 700; cursor: pointer;" onclick="handleResetSessionWrongs('${e.id}','${sid}')">오답 초기화</button>
                    <button class="btn" style="min-height: 32px; padding: 4px 8px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.2); background: rgba(255,71,87,0.05); border-radius: 10px; font-weight: 700; cursor: pointer;" onclick="handleDeleteSession('${e.id}','${sid}')">기록 삭제</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div>
            <h4 style="margin: 0 0 12px 4px; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">최근 성적 추이</h4>
            ${chartArea}
            <h4 style="margin: 24px 0 12px 4px; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">전체 시험 이력</h4>
            <div style="max-height: 400px; overflow-y: auto; padding-right: 4px;">${historyRows || '<p style="text-align: center; padding: 20px; color: var(--secondary); font-size: 13px; font-weight: 700;">기록 없음</p>'}</div>
        </div>
    `;
}

/**
 * [Tab 2] 취약단원 (16px 제목 및 캡션 규격)
 */
function renderWeakTab(sid) {
    const weakUnits = typeof computeStudentWeakUnits === 'function' ? computeStudentWeakUnits(sid) : [];
    const s = state.db.students.find(st => st.id === sid);

    return `
        <div style="padding: 0 4px;">
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">취약 단원 분석</h4>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: var(--secondary); font-weight: 600; line-height: 1.5;">단원을 누르면 상세 오답과 추천 문항을 확인합니다.</p>
            ${typeof renderWeakUnitSummary === 'function' 
                ? renderWeakUnitSummary(weakUnits, '누적 오답 데이터가 없습니다.', { clickable: true, mode: 'student', titlePrefix: `${s.name} 취약 단원`, context: { targetType: 'student', targetId: sid, targetLabel: s.name } })
                : '<div style="padding: 20px; text-align: center; color: var(--secondary); font-size: 13px; font-weight: 700;">데이터를 불러올 수 없습니다.</div>'}
        </div>
    `;
}

/**
 * [Tab 3] 상담기록 (18px 라운드 및 13px 본문 규격)
 */
function renderCnsTab(sid) {
    const cnsList = (state.db.consultations || []).filter(c => c.student_id === sid).sort((a,b) => String(b.date).localeCompare(String(a.date)));

    const cnsCards = cnsList.map(c => `
        <div class="card" style="padding: 16px; margin-bottom: 12px; border: 1px solid var(--border); border-radius: 16px; box-shadow: none; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight:700; color: var(--secondary); line-height: 1.5;">${c.date}</span>
                    <span class="std-badge" style="background: rgba(26,92,255,0.08); color: var(--primary); padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight:700; border: 1px solid rgba(26,92,255,0.15);">${c.type}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="cursor: pointer; color: var(--primary); font-size: 12px; font-weight:700;" onclick="openEditConsultation('${c.id}', '${sid}')">수정</span>
                    <span style="cursor: pointer; color: var(--error); font-size: 12px; font-weight:700;" onclick="handleDeleteConsultation('${c.id}', '${sid}')">삭제</span>
                </div>
            </div>
            <div style="font-size: 13px; font-weight: 700; line-height: 1.5; color: var(--text); white-space: pre-wrap;">${apEscapeHtml(c.content)}</div>
            ${c.next_action ? `
                <div style="margin-top: 12px; padding: 10px; background: rgba(255,165,2,0.06); border: 1px solid rgba(255,165,2,0.1); border-radius: 10px; font-size: 12px; color: var(--warning); font-weight: 700; line-height: 1.5;">
                    <b style="color: var(--warning);">조치:</b> ${apEscapeHtml(c.next_action)}
                </div>` : ''}
        </div>
    `).join('');

    return `
        <div style="padding: 0 4px;">
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 20px; min-height: 52px; font-size: 14px; font-weight:700; border-radius: 16px; box-shadow: none;" onclick="openAddConsultationModal('${sid}')">+ 새 상담 기록하기</button>
            <div style="max-height: 450px; overflow-y: auto; padding-right: 4px;">
                ${cnsCards || '<div style="text-align: center; padding: 40px; color: var(--secondary); font-size: 13px; font-weight: 700;">상담 기록이 없습니다.</div>'}
            </div>
        </div>
    `;
}

/**
 * Chart.js 그리기 엔진 (원본 로직 사수)
 */
let currentStudentChart = null;
function drawGradeChart(sid) {
    const canvas = document.getElementById('studentGradeChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>a.exam_date.localeCompare(b.exam_date)).slice(-7);
    if (!exs.length) return;

    if (currentStudentChart) { currentStudentChart.destroy(); }

    const isDark = document.body.classList.contains('dark');
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#1A5CFF';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : '#E5E8EB';
    const textColor = isDark ? '#A3B1C6' : '#6B7684';

    currentStudentChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: exs.map(e => e.exam_date.slice(5)),
            datasets: [{
                label: '점수',
                data: exs.map(e => e.score),
                borderColor: primaryColor,
                backgroundColor: isDark ? 'rgba(92,138,255,0.1)' : 'rgba(26,92,255,0.05)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: primaryColor,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { color: textColor, font: { weight: 'bold', size: 10 } }, grid: { color: gridColor, drawBorder: false } },
                x: { grid: { display: false }, ticks: { color: textColor, font: { weight: 'bold', size: 10 } } }
            }
        }
    });
}

/**
 * 알림톡 문구 미리보기 (CTA 및 입력창 규격)
 */
function openReportPreview(sid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const s = state.db.students.find(st => st.id === sid);
    const mIds = state.db.class_students.find(m => String(m.student_id) === String(sid));
    
    const lastRecord = (state.db.class_daily_records || [])
        .filter(r => String(r.class_id) === String(mIds?.class_id))
        .sort((a,b) => b.date.localeCompare(a.date))[0];
    
    let progressText = '정규 수업을 진행했습니다.';
    if (lastRecord) {
        const progresses = (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(lastRecord.id));
        if (progresses.length > 0) {
            progressText = progresses.map(p => `${p.textbook_title_snapshot} ${p.progress_text}`).join(', ') + '를 학습했습니다.';
        }
    }

    const lastCns = (state.db.consultations || []).filter(c => c.student_id === sid).sort((a,b) => b.date.localeCompare(a.date))[0];
    let cnsText = lastCns ? `\n\n[학습 피드백]\n${lastCns.content}` : '';

    const lastExam = (state.db.exam_sessions || [])
        .filter(e => e.student_id === sid)
        .sort((a,b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))[0];
    let examText = lastExam ? `\n\n[최근 평가]\n${lastExam.exam_title}: ${lastExam.score}점` : '';

    const template = `안녕하세요 학부모님, AP수학입니다.\n\n오늘 ${s.name}이는 ${progressText}${examText}${cnsText}\n\n궁금하신 점은 언제든 편하게 문의주세요. 감사합니다!`;

    showModal('알림톡 문구 미리보기', `
        <div style="background: var(--surface-2); border: 1px solid var(--border); padding: 16px; border-radius: 18px; margin-bottom: 16px;">
            <p style="margin: 0 0 10px 4px; font-size: 12px; color: var(--secondary); font-weight:700; line-height: 1.5;">내용을 확인하고 필요하면 수정하세요.</p>
            <textarea id="report-preview-text" class="std-input-base" style="height: 280px; text-align: left; background: var(--surface); border: 1px solid var(--border); line-height: 1.7; resize: none; font-size: 14px;">${template}</textarea>
        </div>
    `, '최종 복사하기', () => {
        const text = document.getElementById('report-preview-text').value;
        navigator.clipboard.writeText(text).then(() => {
            toast('문구가 복사되었습니다!', 'success');
            closeModal();
        }).catch(() => {
            toast('복사에 실패했습니다.', 'warn');
        });
    });
}

/**
 * 기존 기능 보존 및 규격화 (CRUD Flows)
 */
function openAddConsultationModal(sid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('상담 기록 추가', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="cns-date" class="std-input-base" value="${todayStr}" style="flex: 1.2;">
                <select id="cns-type" class="std-input-base" style="flex: 1;">
                    <option value="학습">학습</option><option value="태도">태도</option><option value="성적">성적</option><option value="기타">기타</option>
                </select>
            </div>
            <textarea id="cns-content" class="std-input-base" placeholder="상담 내용을 입력하세요." style="height: 140px;"></textarea>
            <textarea id="cns-action" class="std-input-base" placeholder="조치 사항 (선택)" style="height: 70px;"></textarea>
        </div>
    `, '저장', () => handleSaveConsultation(sid));
}

async function handleSaveConsultation(sid) {
    const date = document.getElementById('cns-date').value;
    const type = document.getElementById('cns-type').value;
    const content = document.getElementById('cns-content').value.trim();
    const nextAction = document.getElementById('cns-action').value.trim();
    if (!content) { toast('내용을 입력하세요.', 'warn'); return; }
    const r = await api.post('consultations', { studentId: sid, date, type, content, nextAction });
    if (r.success) { toast('저장완료', 'success'); closeModal(true); await loadData(); renderStudentDetailTab(sid, 'cns'); }
}

function openEditConsultation(cid, sid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const c = state.db.consultations.find(x => x.id === cid);
    if (!c) return;
    showModal('상담 수정', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="edit-cns-date" class="std-input-base" value="${c.date}" style="flex: 1.2;">
                <select id="edit-cns-type" class="std-input-base" style="flex: 1;">
                    <option value="학습" ${c.type==='학습'?'selected':''}>학습</option>
                    <option value="태도" ${c.type==='태도'?'selected':''}>태도</option>
                    <option value="성적" ${c.type==='성적'?'selected':''}>성적</option>
                </select>
            </div>
            <textarea id="edit-cns-content" class="std-input-base" style="height: 140px;">${c.content}</textarea>
            <textarea id="edit-cns-action" class="std-input-base" style="height: 70px;">${c.next_action||''}</textarea>
        </div>
    `, '수정 완료', () => handleEditConsultation(cid, sid));
}

async function handleEditConsultation(cid, sid) {
    const date = document.getElementById('edit-cns-date')?.value || '';
    const type = document.getElementById('edit-cns-type')?.value || '';
    const content = document.getElementById('edit-cns-content')?.value.trim() || '';
    const nextAction = document.getElementById('edit-cns-action')?.value.trim() || '';
    if (!content) return toast('상담 내용을 입력하세요.', 'warn');

    try {
        const r = await api.patch(`consultations/${cid}`, { date, type, content, nextAction });
        if (r?.success) {
            toast('상담 기록이 수정되었습니다.', 'info');
            closeModal(true);
            await loadData();
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(r?.message || r?.error || '상담 기록 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditConsultation] failed:', e);
        toast('상담 기록 수정 중 오류가 발생했습니다.', 'error');
    }
}


async function handleDeleteConsultation(cid, sid) {
    if (!confirm('삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('consultations', cid);
        if (r?.success) {
            toast('상담 기록이 삭제되었습니다.', 'info');
            await loadData();
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(r?.message || r?.error || '상담 기록 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteConsultation] failed:', e);
        toast('상담 기록 삭제 중 오류가 발생했습니다.', 'error');
    }
}


async function handleDelete(sid) {
    if (!confirm('이 학생을 퇴원 처리하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;

    try {
        const r = await api.delete('students', sid);
        if (r?.success) {
            toast('퇴원 처리되었습니다.', 'info');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '퇴원 처리에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDelete] failed:', e);
        toast('퇴원 처리 중 오류가 발생했습니다.', 'error');
    }
}


async function handleRestore(sid) {
    if (!confirm('이 학생을 재원으로 복구하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;

    try {
        const r = await api.patch(`students/${sid}/restore`, {});
        if (r?.success) {
            toast('재원으로 복구되었습니다.', 'info');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '재원 복구에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleRestore] failed:', e);
        toast('재원 복구 중 오류가 발생했습니다.', 'error');
    }
}


async function handleDeleteSession(eid, sid) {
    if (!confirm('시험 기록을 삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('exam-sessions', eid);
        if (r?.success) {
            toast('시험 기록이 삭제되었습니다.', 'info');
            await loadData();
            renderStudentDetailTab(sid, 'grade');
            return;
        }
        toast(r?.message || r?.error || '시험 기록 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteSession] failed:', e);
        toast('시험 기록 삭제 중 오류가 발생했습니다.', 'error');
    }
}


async function handleResetSessionWrongs(eid, sid) {
    if (!confirm('오답만 초기화하시겠습니까?')) return;

    try {
        const r = await api.delete('exam-sessions', `${eid}/wrongs`);
        if (r?.success) {
            toast('오답이 초기화되었습니다.', 'info');
            await loadData();
            renderStudentDetailTab(sid, 'grade');
            return;
        }
        toast(r?.message || r?.error || '오답 초기화에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleResetSessionWrongs] failed:', e);
        toast('오답 초기화 중 오류가 발생했습니다.', 'error');
    }
}


function sortClassesForStudentModal(classes = []) {
    const gradeRank = (cls) => {
        const text = `${cls?.grade || ''} ${cls?.name || ''}`;
        if (/중1/.test(text)) return 1;
        if (/중2/.test(text)) return 2;
        if (/중3/.test(text)) return 3;
        if (/고1/.test(text)) return 4;
        if (/고2/.test(text)) return 5;
        if (/고3/.test(text)) return 6;
        return 99;
    };

    return [...classes].sort((a, b) => {
        const diff = gradeRank(a) - gradeRank(b);
        if (diff !== 0) return diff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function inferGradeFromClass(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const m = text.match(/(중1|중2|중3|고1|고2|고3)/);
    return m ? m[1] : '';
}

function studentAttr(value) {
    return apEscapeHtml(String(value ?? ''));
}

function syncEditStudentGrade() {
    const classId = document.getElementById('edit-class')?.value || '';
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (cls?.grade) {
        document.getElementById('edit-grade').value = cls.grade;
    }
}


function openEditStudent(sid, options = {}) {
    const s = state.db.students.find(st => st.id === sid);
    if (options.returnTo && typeof setModalReturnView === 'function') setModalReturnView(options.returnTo);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0 || String(c.id) === String(curCid))).map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id)===String(curCid)?'selected':''}>${apEscapeHtml(String(c.name || ''))}</option>`).join('');

    const isNew = isStudentNewMember(s);
    const isLeave = isStudentOnLeave(s);
    // memo에서 태그 제거하여 실제 메모만 표시
    const cleanMemo = String(s.memo || '').replace(/#신입/g, '').replace(/#휴원/g, '').trim();

    showModal('학생 정보 수정', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <input id="edit-name" class="std-input-base" value="${studentAttr(s.name)}" placeholder="이름">
            <input id="edit-school" class="std-input-base" value="${studentAttr(s.school_name)}" placeholder="학교">
            <div style="display: flex; gap: 8px;">
                <select id="edit-grade" class="std-input-base" style="flex: 1;">
                    <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option><option value="중2" ${s.grade==='중2'?'selected':''}>중2</option><option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${s.grade==='고1'?'selected':''}>고1</option><option value="고2" ${s.grade==='고2'?'selected':''}>고2</option><option value="고3" ${s.grade==='고3'?'selected':''}>고3</option>
                </select>
                <select id="edit-class" class="std-input-base" style="flex: 1.5;" onchange="syncEditStudentGrade()"><option value="">반 미배정</option>${opts}</select>
            </div>
            <input id="edit-student-phone" class="std-input-base" value="${studentAttr(s.student_phone || '')}" placeholder="학생 전화번호">
            <input id="edit-parent-phone" class="std-input-base" value="${studentAttr(s.parent_phone || '')}" placeholder="학부모 전화번호">
            <input id="edit-guardian-rel" class="std-input-base" value="${studentAttr(s.guardian_relation || '')}" placeholder="보호자 관계">
            <input id="edit-student-pin" class="std-input-base" value="${studentAttr(s.student_pin || '')}" placeholder="PIN (4자리 숫자)" maxlength="4">
            <textarea id="edit-memo" class="std-input-base" placeholder="메모" style="height: 64px;">${apEscapeHtml(cleanMemo)}</textarea>
            <div style="display:flex; gap:20px; padding:4px 2px; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:10px 14px;">
                <label style="display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; cursor:pointer; color:${isNew ? '#1A5CFF' : 'var(--text)'};">
                    <input type="checkbox" id="edit-is-new" ${isNew ? 'checked' : ''} style="accent-color:#1A5CFF; width:15px; height:15px; cursor:pointer;">
                    <span>신입생</span>
                </label>
                <label style="display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; cursor:pointer; color:${isLeave ? '#FF8C00' : 'var(--text)'};">
                    <input type="checkbox" id="edit-is-leave" ${isLeave ? 'checked' : ''} style="accent-color:#FF8C00; width:15px; height:15px; cursor:pointer;">
                    <span>휴원</span>
                </label>
            </div>
            <div style="margin-top: 4px;">
                <button class="btn" style="width: 100%; min-height: 44px; color: var(--error); border: 1px solid rgba(255,71,87,0.2); background: rgba(255,71,87,0.05); font-weight:700; border-radius: 12px;" onclick="handleDelete('${sid}')">퇴원(제적) 처리</button>
            </div>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const pin = document.getElementById('edit-student-pin')?.value.trim() || '';
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }

    const classId = document.getElementById('edit-class')?.value || '';
    const editGrade = document.getElementById('edit-grade')?.value || '';
    const grade = editGrade;

    // 신입/휴원 태그를 memo에 반영
    const rawMemo = document.getElementById('edit-memo')?.value || '';
    const isNewChecked = document.getElementById('edit-is-new')?.checked || false;
    const isLeaveChecked = document.getElementById('edit-is-leave')?.checked || false;
    const cleanMemo = rawMemo.replace(/#신입/g, '').replace(/#휴원/g, '').trim();
    const memoParts = [];
    if (isNewChecked) memoParts.push('#신입');
    if (isLeaveChecked) memoParts.push('#휴원');
    if (cleanMemo) memoParts.push(cleanMemo);
    const finalMemo = memoParts.join(' ').trim();

    const payload = {
        name: document.getElementById('edit-name')?.value || '',
        school_name: document.getElementById('edit-school')?.value || '',
        grade,
        class_id: classId,
        student_phone: document.getElementById('edit-student-phone')?.value || '',
        parent_phone: document.getElementById('edit-parent-phone')?.value || '',
        guardian_relation: document.getElementById('edit-guardian-rel')?.value || '',
        memo: finalMemo,
        student_pin: pin
    };

    try {
        const r = await api.patch(`students/${sid}`, payload);
        if (r?.success) {
            toast('학생 정보가 수정되었습니다.', 'success');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '학생 정보 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditStudent] failed:', e);
        toast('학생 정보 수정 중 오류가 발생했습니다.', 'error');
    }
}


function openAddStudent(defaultCid = '', options = {}) {
    if (options.returnTo && typeof setModalReturnView === 'function') setModalReturnView(options.returnTo);
    const opts = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0)).map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id)===String(defaultCid)?'selected':''}>${apEscapeHtml(String(c.name || ''))}</option>`).join('');
    showModal('신규 학생 추가', `
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 0 16px 4px; box-sizing: border-box;">
            <input id="add-name" class="std-input-base" placeholder="이름 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-school" class="std-input-base" placeholder="학교 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <select id="add-class" class="std-input-base" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;"><option value="">반 선택</option>${opts}</select>
            <input id="add-student-phone" class="std-input-base" placeholder="학생 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-parent-phone" class="std-input-base" placeholder="학부모 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-guardian-rel" class="std-input-base" placeholder="보호자 관계" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-student-pin" class="std-input-base" placeholder="PIN (4자리 숫자, 선택)" maxlength="4" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const n = document.getElementById('add-name')?.value.trim() || '';
    const sc = document.getElementById('add-school')?.value.trim() || '';
    const classId = document.getElementById('add-class')?.value || '';
    const pin = document.getElementById('add-student-pin')?.value.trim() || '';
    const studentPhone = document.getElementById('add-student-phone')?.value.trim() || '';
    const parentPhone = document.getElementById('add-parent-phone')?.value.trim() || '';
    const guardianRelation = document.getElementById('add-guardian-rel')?.value.trim() || '';
    if (!n || !sc) { toast('이름과 학교를 입력해주세요.', 'warn'); return; }
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }

    if (!classId) { toast('반을 선택하세요.', 'warn'); return; }
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) { toast('반 정보를 찾을 수 없습니다.', 'warn'); return; }
    const grade = inferGradeFromClass(cls);
    const payload = {
        name: n,
        school_name: sc,
        schoolName: sc,
        grade: grade || '',
        class_id: classId,
        classId: classId,
        student_pin: pin || '',
        studentPin: pin || '',
        student_phone: studentPhone,
        studentPhone: studentPhone,
        parent_phone: parentPhone,
        parentPhone: parentPhone,
        guardian_relation: guardianRelation,
        guardianRelation: guardianRelation,
        memo: ''
    };

    try {
        const r = await api.post('students', payload);
        if (r?.success) {
            toast('학생이 추가되었습니다.', 'success');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '학생 추가에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAddStudent] failed:', e);
        toast('학생 추가 중 오류가 발생했습니다.', 'error');
    }
}


function openDischargedStudents() {
    const discharged = state.db.students.filter(s => s.status === '제적');
    const rows = discharged.map(s => `
        <div style="padding: 14px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--surface);">
            <div><b style="font-size: 14px; font-weight:700; color: var(--text); line-height: 1.4;">${apEscapeHtml(s.name)}</b> <span style="font-size: 12px; color: var(--secondary); font-weight: 600; line-height: 1.5; margin-left: 4px;">${apEscapeHtml(s.school_name || '')}</span></div>
            <button class="btn btn-primary" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; border-radius: 12px; box-shadow: none;" onclick="handleRestore('${s.id}')">재원 복구</button>
        </div>
    `).join('');
    showModal('퇴원생 관리', `<div style="max-height: 60vh; overflow-y: auto; margin: -20px 0;">${rows || '<div style="padding: 40px; text-align: center; color: var(--secondary); font-weight:700; font-size: 13px; line-height: 1.5;">퇴원생이 없습니다.</div>'}</div>`);
}