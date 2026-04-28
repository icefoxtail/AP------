/**
 * AP Math OS 1.0 [js/student.js]
 * 학생 관리 및 프로필 관제 홈 (Master Level UI/UX)
 * [IRONCLAD 5G]: 3단 탭 시스템, Chart.js 성적 시각화, 알림톡 미리보기 시스템 도입
 * [Final Polish]: 정렬 버그 수정, 이모지 제거 및 클립보드 예외 처리 적용
 */

/**
 * 학생 상세 진입점 (기존 유지)
 */
async function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    // 기본 데이터 로드 및 전처리는 기존 로직 보존
    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    await ensureBlueprintsForSessions(exs);

    // 탭 전환을 위한 내부 렌더링 함수 호출 (기본값: 성적분석)
    renderStudentDetailTab(sid, 'grade');
}

/**
 * 탭별 내용 렌더링 엔진
 */
function renderStudentDetailTab(sid, tab) {
    const s = state.db.students.find(st => st.id === sid);
    const mIds = state.db.class_students.find(m => String(m.student_id) === String(sid));
    const cls = state.db.classes.find(c => String(c.id) === String(mIds?.class_id));

    // 1. 프로필 헤더 (공통)
    const headerHtml = `
        <div style="margin-bottom:24px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h1 style="margin:0; font-size:26px; font-weight:900; color:#191F28;">${s.name}</h1>
                    <div style="display:flex; gap:6px; margin-top:8px; flex-wrap:wrap;">
                        <span style="background:rgba(26,92,255,0.1); color:var(--primary); padding:4px 10px; border-radius:100px; font-size:12px; font-weight:800;">${s.school_name} ${s.grade}</span>
                        <span style="background:var(--bg); color:var(--secondary); padding:4px 10px; border-radius:100px; font-size:12px; font-weight:800;">${cls?.name || '반 미배정'}</span>
                        ${s.student_pin ? `<span style="background:#191F28; color:#fff; padding:4px 10px; border-radius:100px; font-size:11px; font-weight:700; letter-spacing:1px;">PIN ${s.student_pin}</span>` : ''}
                    </div>
                </div>
                <button class="btn" style="padding:10px; font-size:12px; background:var(--bg); border:none;" onclick="openEditStudent('${sid}')">정보 수정</button>
            </div>
            
            <div style="margin-top:20px; display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                <div style="background:var(--bg); padding:12px; border-radius:16px;">
                    <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:4px;">학생 연락처</div>
                    <div style="font-size:13px; font-weight:800; color:var(--primary); cursor:pointer;" onclick="copyPhoneNumber('${s.student_phone}')">${s.student_phone || '미등록'}</div>
                </div>
                <div style="background:var(--bg); padding:12px; border-radius:16px;">
                    <div style="font-size:11px; color:var(--secondary); font-weight:700; margin-bottom:4px;">보호자 (${s.guardian_relation || '미지정'})</div>
                    <div style="font-size:13px; font-weight:800; color:var(--primary); cursor:pointer;" onclick="copyPhoneNumber('${s.parent_phone}')">${s.parent_phone || '미등록'}</div>
                </div>
            </div>
        </div>
    `;

    // 2. 탭 바 (공통)
    const tabBarHtml = `
        <div class="tab-bar">
            <button class="tab-btn ${tab==='grade'?'active':''}" onclick="renderStudentDetailTab('${sid}','grade')">성적분석</button>
            <button class="tab-btn ${tab==='weak'?'active':''}" onclick="renderStudentDetailTab('${sid}','weak')">취약단원</button>
            <button class="tab-btn ${tab==='cns'?'active':''}" onclick="renderStudentDetailTab('${sid}','cns')">상담기록</button>
        </div>
    `;

    // 3. 탭별 본문 생성
    let bodyHtml = '';
    if (tab === 'grade') bodyHtml = renderGradeTab(sid);
    else if (tab === 'weak') bodyHtml = renderWeakTab(sid);
    else if (tab === 'cns') bodyHtml = renderCnsTab(sid);

    // 4. 하단 액션바 (이모지 제거됨)
    const footerHtml = `
        <div style="margin-top:24px; padding-top:20px; border-top:1.5px dashed var(--border); display:flex; gap:10px;">
            <button class="btn btn-primary" style="flex:1.5; font-size:13px; font-weight:800;" onclick="openReportPreview('${sid}')">알림톡 문구 생성</button>
            <button class="btn" style="flex:1; font-size:13px; font-weight:800; color:var(--primary); border-color:var(--primary);" onclick="openClinicBasketForStudent('${sid}')">클리닉 바구니</button>
        </div>
    `;

    showModal(`${s.name} 프로필`, headerHtml + tabBarHtml + bodyHtml + footerHtml);
    
    if (tab === 'grade') setTimeout(() => drawGradeChart(sid), 50);
}

/**
 * [Tab 1] 성적분석 렌더러
 */
function renderGradeTab(sid) {
    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    
    const chartArea = exs.length > 0 
        ? `<div style="margin-bottom:24px; padding:10px; background:var(--surface); border:1px solid var(--border); border-radius:18px;">
             <canvas id="studentGradeChart" style="width:100%; height:180px;"></canvas>
           </div>`
        : `<div style="padding:40px 20px; text-align:center; color:var(--secondary); background:var(--bg); border-radius:18px; margin-bottom:20px; font-size:13px; font-weight:700;">누적된 성적 기록이 없습니다.</div>`;

    const historyRows = exs.map(e => {
        const wrs = state.db.wrong_answers
            .filter(w => w.session_id === e.id)
            .sort((a,b)=>Number(a.question_id)-Number(b.question_id))
            .map(w => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(e, w.question_id) : `<span style="font-size:10px; padding:2px 6px; background:#f1f3f4; border-radius:4px; margin:1px;">Q${w.question_id}</span>`)
            .join('');
            
        return `
            <div style="padding:16px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                    <div>
                        <div style="font-size:14px; font-weight:800; color:#191F28;">${e.exam_title}</div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:600; margin-top:2px;">${e.exam_date}</div>
                    </div>
                    <div style="font-size:18px; font-weight:900; color:var(--primary);">${e.score}점</div>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:2px; margin-bottom:12px;">${wrs || '<span style="font-size:11px; color:var(--secondary);">오답 없음</span>'}</div>
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button class="btn" style="padding:6px 12px; font-size:11px; color:var(--warning); border:none; background:rgba(255,165,2,0.1);" onclick="handleResetSessionWrongs('${e.id}','${sid}')">오답 초기화</button>
                    <button class="btn" style="padding:6px 12px; font-size:11px; color:var(--error); border:none; background:rgba(255,71,87,0.1);" onclick="handleDeleteSession('${e.id}','${sid}')">기록 삭제</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div>
            <h4 style="margin:0 0 12px 0; font-size:15px; font-weight:900;">최근 성적 추이</h4>
            ${chartArea}
            <h4 style="margin:24px 0 12px 0; font-size:15px; font-weight:900;">전체 시험 이력</h4>
            <div style="max-height:400px; overflow-y:auto; padding-right:4px;">${historyRows || '<p style="text-align:center; padding:20px; color:var(--secondary);">기록 없음</p>'}</div>
        </div>
    `;
}

/**
 * [Tab 2] 취약단원 렌더러
 */
function renderWeakTab(sid) {
    const weakUnits = typeof computeStudentWeakUnits === 'function' ? computeStudentWeakUnits(sid) : [];
    const s = state.db.students.find(st => st.id === sid);

    return `
        <div>
            <h4 style="margin:0 0 4px 0; font-size:15px; font-weight:900;">취약 단원 분석</h4>
            <p style="margin:0 0 16px 0; font-size:12px; color:var(--secondary); font-weight:600;">단원을 누르면 상세 오답과 추천 문항을 확인합니다.</p>
            ${typeof renderWeakUnitSummary === 'function' 
                ? renderWeakUnitSummary(weakUnits, '누적 오답 데이터가 없습니다.', { clickable: true, mode: 'student', titlePrefix: `${s.name} 취약 단원`, context: { targetType: 'student', targetId: sid, targetLabel: s.name } })
                : '<div style="padding:20px; text-align:center;">데이터를 불러올 수 없습니다.</div>'}
        </div>
    `;
}

/**
 * [Tab 3] 상담기록 렌더러
 */
function renderCnsTab(sid) {
    const cnsList = (state.db.consultations || []).filter(c => c.student_id === sid).sort((a,b) => String(b.date).localeCompare(String(a.date)));

    const cnsCards = cnsList.map(c => `
        <div class="card" style="padding:16px; margin-bottom:12px; border:1px solid var(--border); box-shadow:none; background:var(--surface);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:12px; font-weight:800; color:var(--secondary);">${c.date}</span>
                    <span style="background:rgba(26,92,255,0.1); color:var(--primary); padding:2px 8px; border-radius:6px; font-size:11px; font-weight:800;">${c.type}</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <span style="cursor:pointer; color:var(--primary); font-size:12px; font-weight:700;" onclick="openEditConsultation('${c.id}', '${sid}')">수정</span>
                    <span style="cursor:pointer; color:var(--error); font-size:12px; font-weight:700;" onclick="handleDeleteConsultation('${c.id}', '${sid}')">삭제</span>
                </div>
            </div>
            <div style="font-size:14px; font-weight:600; line-height:1.6; color:#191F28; white-space:pre-wrap;">${apEscapeHtml(c.content)}</div>
            ${c.next_action ? `
                <div style="margin-top:12px; padding:10px; background:rgba(255,165,2,0.1); border-radius:10px; font-size:12px; color:#b06000; font-weight:700;">
                    <b>조치:</b> ${apEscapeHtml(c.next_action)}
                </div>` : ''}
        </div>
    `).join('');

    return `
        <div>
            <button class="btn btn-primary" style="width:100%; margin-bottom:20px; padding:14px; font-size:14px; font-weight:800; border-radius:16px;" onclick="openAddConsultationModal('${sid}')">새 상담 기록하기</button>
            <div style="max-height:450px; overflow-y:auto; padding-right:4px;">
                ${cnsCards || '<div style="text-align:center; padding:40px; color:var(--secondary); font-weight:600;">상담 기록이 없습니다.</div>'}
            </div>
        </div>
    `;
}

/**
 * Chart.js 그리기 엔진
 */
let currentStudentChart = null;
function drawGradeChart(sid) {
    const canvas = document.getElementById('studentGradeChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>a.exam_date.localeCompare(b.exam_date)).slice(-7);
    if (!exs.length) return;

    if (currentStudentChart) { currentStudentChart.destroy(); }

    currentStudentChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: exs.map(e => e.exam_date.slice(5)),
            datasets: [{
                label: '점수',
                data: exs.map(e => e.score),
                borderColor: '#1A5CFF',
                backgroundColor: 'rgba(26,92,255,0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: '#1A5CFF',
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { stepSize: 20, font: { weight: 'bold' } }, grid: { color: '#E5E8EB' } },
                x: { grid: { display: false }, ticks: { font: { weight: 'bold' } } }
            }
        }
    });
}

/**
 * 알림톡 문구 미리보기 및 복사 시스템 (버그 수정본)
 */
function openReportPreview(sid) {
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

    // [수정] 최근 시험 정렬 버그 해결
    const lastExam = (state.db.exam_sessions || [])
        .filter(e => e.student_id === sid)
        .sort((a,b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))[0];
    let examText = lastExam ? `\n\n[최근 평가]\n${lastExam.exam_title}: ${lastExam.score}점` : '';

    const template = `안녕하세요 학부모님, AP수학입니다.\n\n오늘 ${s.name}이는 ${progressText}${examText}${cnsText}\n\n궁금하신 점은 언제든 편하게 문의주세요. 감사합니다!`;

    showModal('알림톡 문구 미리보기', `
        <div style="background:var(--bg); padding:16px; border-radius:18px; margin-bottom:16px;">
            <p style="margin:0 0 10px 0; font-size:12px; color:var(--secondary); font-weight:700;">내용을 확인하고 필요하면 수정하세요.</p>
            <textarea id="report-preview-text" class="btn" style="width:100%; height:280px; text-align:left; background:var(--surface); border:none; padding:16px; font-size:14px; line-height:1.7; resize:none; font-family:inherit;">${template}</textarea>
        </div>
    `, '최종 복사하기', () => {
        const text = document.getElementById('report-preview-text').value;
        // [수정] 클립보드 복사 실패 처리 추가
        navigator.clipboard.writeText(text).then(() => {
            toast('문구가 복사되었습니다!', 'success');
            closeModal();
        }).catch(() => {
            toast('복사에 실패했습니다.', 'warn');
        });
    });
}

/**
 * 기존 기능 보존 (상담/정보수정/삭제)
 */
function openAddConsultationModal(sid) {
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('상담 기록 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; gap:8px;">
                <input type="date" id="cns-date" class="btn" value="${todayStr}" style="flex:1;">
                <select id="cns-type" class="btn" style="flex:1;">
                    <option value="학습">학습</option><option value="태도">태도</option><option value="성적">성적</option><option value="기타">기타</option>
                </select>
            </div>
            <textarea id="cns-content" class="btn" placeholder="상담 내용을 입력하세요." style="text-align:left; height:120px;"></textarea>
            <textarea id="cns-action" class="btn" placeholder="조치 사항 (선택)" style="text-align:left; height:60px;"></textarea>
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
    if (r.success) { toast('저장완료', 'success'); closeModal(); await loadData(); renderStudentDetailTab(sid, 'cns'); }
}

function openEditConsultation(cid, sid) {
    const c = state.db.consultations.find(x => x.id === cid);
    if (!c) return;
    showModal('상담 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; gap:8px;">
                <input type="date" id="edit-cns-date" class="btn" value="${c.date}" style="flex:1;">
                <select id="edit-cns-type" class="btn" style="flex:1;">
                    <option value="학습" ${c.type==='학습'?'selected':''}>학습</option>
                    <option value="태도" ${c.type==='태도'?'selected':''}>태도</option>
                    <option value="성적" ${c.type==='성적'?'selected':''}>성적</option>
                </select>
            </div>
            <textarea id="edit-cns-content" class="btn" style="text-align:left; height:120px;">${c.content}</textarea>
            <textarea id="edit-cns-action" class="btn" style="text-align:left; height:60px;">${c.next_action||''}</textarea>
        </div>
    `, '수정 완료', () => handleEditConsultation(cid, sid));
}

async function handleEditConsultation(cid, sid) {
    const date = document.getElementById('edit-cns-date').value;
    const type = document.getElementById('edit-cns-type').value;
    const content = document.getElementById('edit-cns-content').value.trim();
    const nextAction = document.getElementById('edit-cns-action').value.trim();
    const r = await api.patch(`consultations/${cid}`, { date, type, content, nextAction });
    if (r.success) { toast('수정완료', 'info'); closeModal(); await loadData(); renderStudentDetailTab(sid, 'cns'); }
}

async function handleDeleteConsultation(cid, sid) {
    if (!confirm('삭제하시겠습니까?')) return;
    const r = await api.delete('consultations', cid);
    if (r.success) { toast('삭제완료', 'info'); await loadData(); renderStudentDetailTab(sid, 'cns'); }
}

async function handleDelete(sid) {
    if (confirm('이 학생을 퇴원 처리하시겠습니까?')) { await api.delete('students', sid); closeModal(); await loadData(); }
}

async function handleRestore(sid) {
    if (confirm('이 학생을 재원으로 복구하시겠습니까?')) { await api.patch(`students/${sid}/restore`, {}); closeModal(); await loadData(); }
}

async function handleDeleteSession(eid, sid) {
    if (!confirm('시험 기록을 삭제하시겠습니까?')) return;
    const r = await api.delete('exam-sessions', eid);
    if (r?.success) { toast('삭제완료', 'info'); await loadData(); renderStudentDetailTab(sid, 'grade'); }
}

async function handleResetSessionWrongs(eid, sid) {
    if (!confirm('오답만 초기화하시겠습니까?')) return;
    const r = await api.delete('exam-sessions', `${eid}/wrongs`);
    if (r?.success) { toast('초기화완료', 'info'); await loadData(); renderStudentDetailTab(sid, 'grade'); }
}

function openEditStudent(sid) {
    const s = state.db.students.find(st => st.id === sid);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = state.db.classes.filter(c => c.is_active !== 0 || c.id === curCid).map(c => `<option value="${c.id}" ${c.id===curCid?'selected':''}>${c.name}</option>`).join('');
    
    showModal('학생 정보 수정', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="edit-name" class="btn" value="${s.name}" style="text-align:left;">
            <input id="edit-school" class="btn" value="${s.school_name}" style="text-align:left;">
            <select id="edit-grade" class="btn">
                <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option><option value="중2" ${s.grade==='중2'?'selected':''}>중2</option><option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
                <option value="고1" ${s.grade==='고1'?'selected':''}>고1</option><option value="고2" ${s.grade==='고2'?'selected':''}>고2</option><option value="고3" ${s.grade==='고3'?'selected':''}>고3</option>
            </select>
            <select id="edit-class" class="btn"><option value="">반 미배정</option>${opts}</select>
            <input id="edit-student-phone" class="btn" value="${s.student_phone||''}" placeholder="학생 전화번호" style="text-align:left;">
            <input id="edit-parent-phone" class="btn" value="${s.parent_phone||''}" placeholder="학부모 전화번호" style="text-align:left;">
            <input id="edit-guardian-rel" class="btn" value="${s.guardian_relation||''}" placeholder="보호자 관계" style="text-align:left;">
            <input id="edit-student-pin" class="btn" value="${s.student_pin||''}" placeholder="PIN (4자리)" maxlength="4" style="text-align:left;">
            <textarea id="edit-memo" class="btn" placeholder="메모" style="text-align:left; height:60px;">${s.memo||''}</textarea>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const pin = document.getElementById('edit-student-pin').value.trim();
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }
          
    await api.patch(`students/${sid}`, { 
        name: document.getElementById('edit-name').value, 
        school_name: document.getElementById('edit-school').value, 
        grade: document.getElementById('edit-grade').value, 
        class_id: document.getElementById('edit-class').value, 
        student_phone: document.getElementById('edit-student-phone').value, 
        parent_phone: document.getElementById('edit-parent-phone').value, 
        guardian_relation: document.getElementById('edit-guardian-rel').value, 
        memo: document.getElementById('edit-memo').value,
        student_pin: pin 
    });
    closeModal(); await loadData();
}

function openAddStudent(defaultCid = '') {
    const opts = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${c.id===defaultCid?'selected':''}>${c.name}</option>`).join('');
    showModal('신규 학생 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <input id="add-name" class="btn" placeholder="이름 (필수)" style="text-align:left;">
            <input id="add-school" class="btn" placeholder="학교 (필수)" style="text-align:left;">
            <select id="add-class" class="btn"><option value="">반 선택</option>${opts}</select>
            <input id="add-student-pin" class="btn" placeholder="PIN (4자리 숫자, 선택)" maxlength="4" style="text-align:left;">
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    const n = document.getElementById('add-name').value.trim(), sc = document.getElementById('add-school').value.trim();
    if(!n || !sc) { toast('이름과 학교를 입력해주세요.', 'warn'); return; }
    await api.post('students', { name: n, school_name: sc, class_id: document.getElementById('add-class').value, student_pin: document.getElementById('add-student-pin').value.trim() });
    closeModal(); await loadData();
}

function openDischargedStudents() {
    const discharged = state.db.students.filter(s => s.status === '제적');
    const rows = discharged.map(s => `
        <div style="padding:16px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
            <div><b style="font-size:15px;">${s.name}</b> <span style="font-size:12px; color:var(--secondary);">${s.school_name}</span></div>
            <button class="btn btn-primary" style="padding:6px 12px; font-size:11px;" onclick="handleRestore('${s.id}')">재원 복구</button>
        </div>
    `).join('');
    showModal('퇴원생 관리', `<div style="max-height:60vh; overflow-y:auto; margin:-20px;">${rows || '<div style="padding:40px; text-align:center; color:var(--secondary);">퇴원생이 없습니다.</div>'}</div>`);
}