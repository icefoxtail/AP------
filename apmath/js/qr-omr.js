/**
 * AP Math OS v26.1.2 [js/qr-omr.js]
 * QR 코드 생성 및 OMR 성적 입력 도구 (5F: sessionId 연동 및 OMR 동적 생성)
 */

/**
 * QR 코드 생성 모달 오픈
 */
function openQrGenerator(cid) {
    const cls = state.db.classes.find(c => c.id === cid);
    const today = new Date().toLocaleDateString('sv-SE');
    showModal('📱 시험 QR 생성', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <p style="margin:0;"><b>대상 학급:</b> ${cls.name}</p>
            <div>
                <label style="font-size:12px; color:var(--secondary);">시험명 선택/입력:</label>
                <div style="display:flex; gap:4px; flex-wrap:wrap; margin:6px 0;">
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='쪽지시험'">쪽지시험</button>
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='단원평가'">단원평가</button>
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='월말평가'">월말평가</button>
                    <button class="btn" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('qr-exam').value='모의고사'">모의고사</button>
                </div>
                <input id="qr-exam" class="btn" value="단원평가" style="width:100%; text-align:left;">
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary);">문항 수 (1~50):</label>
                <input id="qr-q" type="number" class="btn" value="20" min="1" max="50" style="width:100%; text-align:left;">
            </div>
            <div>
                <label style="font-size:12px; color:var(--secondary);">시험 날짜:</label>
                <input id="qr-date" type="date" class="btn" value="${today}" style="width:100%; text-align:left;">
            </div>
            <div id="qr-result-area" class="hidden" style="text-align:center; margin-top:15px; border-top:1px solid var(--border); padding-top:15px;">
                <img id="qr-img" style="width:180px; height:180px; margin-bottom:10px; border: 1px solid #ddd; padding: 5px; background: white;">
                <div id="qr-url" style="font-size:11px; word-break:break-all; background:#f1f3f4; padding:8px; border-radius:8px; margin-bottom:10px; color:var(--secondary);"></div>
                <button class="btn btn-primary" style="width:100%;" onclick="copyQrUrl()">URL 복사</button>
            </div>
        </div>
    `, 'QR 코드 생성', generateQrCode);
}

/**
 * QR 코드 생성 실행 및 마감 기준 설정 (4E UX 반영)
 */
function generateQrCode() {
    const cid = state.ui.currentClassId;
    const exam = document.getElementById('qr-exam').value.trim();
    const q = parseInt(document.getElementById('qr-q').value) || 20;
    const date = document.getElementById('qr-date').value;

    if (!exam || q < 1 || q > 50) { toast('입력 정보를 확인하세요 (문항 수 1~50).', 'warn'); return; }

    const appBasePath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/apmath\/?$/, '/');
    const baseUrl = window.location.origin + appBasePath + 'check/';
    const fullUrl = `${baseUrl}?class=${cid}&exam=${encodeURIComponent(exam)}&q=${q}&date=${date}`;
    
    const qrImg = document.getElementById('qr-img');
    qrImg.onerror = () => toast('QR 이미지 생성 실패. URL 복사를 사용하세요.', 'warn');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
    
    document.getElementById('qr-url').innerText = fullUrl;
    document.getElementById('qr-result-area').classList.remove('hidden');
    localStorage.setItem('AP_LAST_EXAM_NAME', exam);
    toast('QR 코드가 생성되었습니다.', 'info');

    const bindTodayExam = confirm('이 시험을 오늘 마감 기준으로 설정할까요?');
    if (bindTodayExam) {
        setTodayExamConfig(exam, q);
        toast('오늘 시험 기준으로 설정되었습니다.', 'info');
    }
}

/**
 * QR URL 복사
 */
function copyQrUrl() {
    const url = document.getElementById('qr-url')?.innerText || '';
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
        toast('URL 복사 완료!', 'info');
        const btn = document.querySelector('#qr-result-area .btn-primary');
        if (btn) { const t = btn.innerText; btn.innerText = '복사됨 ✅'; setTimeout(() => btn.innerText = t, 1000); }
    }).catch(() => toast('복사 실패', 'warn'));
}

/**
 * 학급의 시험 제출 통계 계산 (4E 복구본 원본)
 */
function computeQrSubmitStatus(classId, examTitle, examDate) {
    const ids = state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id);
    const active = state.db.students.filter(s => ids.includes(s.id) && s.status === '재원');
    const aIds = active.map(s => s.id);
    const sessions = state.db.exam_sessions.filter(es => es.exam_date === examDate && es.exam_title === examTitle && aIds.includes(es.student_id));
    const submittedIds = new Set(sessions.map(es => es.student_id));
    const submitted = active.filter(s => submittedIds.has(s.id)).map(s => {
        const sess = sessions.find(ts => ts.student_id === s.id);
        return { ...s, score: sess?.score ?? '' };
    });
    const pending = active.filter(s => !submittedIds.has(s.id));
    return { submitted, pending };
}

/**
 * 시험 제출 현황 모달 오픈
 */
function openQrSubmitStatus(classId, examTitle = '', examDate = '') {
    const today = new Date().toLocaleDateString('sv-SE');
    const cls = state.db.classes.find(c => c.id === classId);
    const safeDate = examDate || today;
    if (!examTitle) {
        const lastExam = localStorage.getItem('AP_LAST_EXAM_NAME') || '';
        showModal('📊 제출 현황', `
            <div style="display:flex;flex-direction:column;gap:10px;">
                <p style="margin:0;font-size:13px;color:var(--secondary);"><b>${cls?.name || ''}</b> 확인할 시험명을 입력하세요.</p>
                <input id="qr-status-exam" class="btn" placeholder="시험명 (예: 단원평가)" value="${lastExam}" style="width:100%;text-align:left;">
                <input id="qr-status-date" type="date" class="btn" value="${safeDate}" style="width:100%;">
            </div>
        `, '현황 보기', () => {
            const title = document.getElementById('qr-status-exam').value.trim();
            const date = document.getElementById('qr-status-date').value;
            if (!title) { toast('시험명을 입력하세요.', 'warn'); return; }
            localStorage.setItem('AP_LAST_EXAM_NAME', title);
            openQrSubmitStatus(classId, title, date);
        });
        return;
    }
    const { submitted, pending } = computeQrSubmitStatus(classId, examTitle, safeDate);
    const safeExamTitleForJs = String(examTitle).replace(/'/g, "\\'");
    
    showModal('📊 제출 현황', `
        <div style="background:#f8f9fa;padding:10px;border-radius:8px;font-size:13px;margin-bottom:12px;">
            <b>${examTitle}</b> · ${safeDate} · ${submitted.length + pending.length}명 중 <b>${submitted.length}명 제출</b>
        </div>
        <h4 style="color:var(--success);margin:10px 0 5px;">✅ 제출 (${submitted.length})</h4>
        <table style="font-size:12px;">${submitted.map(s => `<tr><td>${s.name}</td><td style="text-align:right;"><b>${s.score}점</b></td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5;text-align:center;">없음</td></tr>'}</table>
        <h4 style="color:var(--error);margin:16px 0 5px;">⏳ 미제출 (${pending.length})</h4>
        <table style="font-size:12px;">${pending.map(s => `<tr><td>${s.name}</td><td style="text-align:right;"><button class="btn" style="padding:2px 8px;font-size:10px;" onclick="closeModal();openOMR('${s.id}', '${safeExamTitleForJs}', 0, '${classId}', '')">성적 입력</button></td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5;text-align:center;">없음</td></tr>'}</table>
    `);
}

/**
 * [5F] 성적 입력 모달 (OMR) 오픈 - 동적 렌더링 및 sessionId 지원
 */
function openOMR(sid, presetTitle = '', presetQ = 0, presetClassId = '', sessionId = '') {
    const todayExam = getTodayExamConfig();
    const defaultTitle = presetTitle || todayExam?.title || '단원평가';
    const defaultQ = presetQ || todayExam?.q || 20;

    showModal('성적 직접 입력', `
        <div style="display:flex;flex-direction:column;gap:10px;">
            <div>
                <label style="font-size:12px;color:var(--secondary);">시험명</label>
                <input id="omr-title" class="btn" value="${defaultTitle}" style="width:100%;text-align:left;">
            </div>
            <div>
                <label style="font-size:12px;color:var(--secondary);">문항 수</label>
                <input id="omr-q" type="number" class="btn" value="${defaultQ}" min="1" max="50" style="width:100%;text-align:left;" oninput="rebuildOmrGrid()">
            </div>
            <div id="omr-grid-wrap">
                <div class="omr-grid">${buildOmrItems(defaultQ)}</div>
            </div>
        </div>
    `, '저장', () => handleOMRSave(sid, presetClassId, sessionId));
}

function buildOmrItems(q) {
    return Array.from({length: q}, (_, i) =>
        `<div class="omr-item">Q${i+1}<br><input type="checkbox" class="omr-q" value="${i+1}"></div>`
    ).join('');
}

function rebuildOmrGrid() {
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); // Clamp 1~50
    const wrap = document.getElementById('omr-grid-wrap');
    if (wrap) wrap.innerHTML = `<div class="omr-grid">${buildOmrItems(q)}</div>`;
}

/**
 * [5F] 성적 저장 실행 - sessionId 연동, classId fallback 및 점수 계산 반영
 */
async function handleOMRSave(sid, presetClassId = '', sessionId = '') {
    const title = document.getElementById('omr-title').value.trim();
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); // 저장 직전 1~50 clamp

    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = Math.round(((q - wrs.length) / q) * 100);
    
    // ClassId 결정 우선순위
    let classId = presetClassId || state.ui?.currentClassId;
    if (!classId) {
        const mapObj = state.db.class_students.find(m => m.student_id === sid);
        classId = mapObj ? mapObj.class_id : null;
    }

    const payload = {
        student_id: sid, 
        exam_title: title, 
        score: score, 
        wrong_ids: wrs, 
        exam_date: new Date().toLocaleDateString('sv-SE'), 
        question_count: q, 
        class_id: classId
    };
    
    const endpoint = sessionId ? `exam-sessions/${sessionId}` : 'exam-sessions/new';
    const r = await api.patch(endpoint, payload);
    
    if (!r?.success) { toast('저장 실패', 'warn'); return; }
    
    toast(`${score}점 저장됨`, 'info'); 
    closeModal(); 
    await loadData();
}