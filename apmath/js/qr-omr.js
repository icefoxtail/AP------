/**
 * AP Math OS v26.1.2 [js/qr-omr.js]
 * QR 코드 생성 및 OMR 성적 입력 도구 (5G-3: 경로 안정화 및 카카오톡 공유 추가)
 */

/**
 * [5G-3] 학생용 QR 접속 기본 URL 계산 (경로 안정화)
 */
function getCheckBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname;

    // index.html 경로 제거
    path = path.replace(/\/index\.html$/, '/');

    // 파일명이 포함된 경우를 대비해 마지막 슬래시 기준으로 경로 추출
    if (!path.endsWith('/')) {
        path = path.substring(0, path.lastIndexOf('/') + 1);
    }

    return origin + path + 'check/';
}

/**
 * archiveFile 입력값 정규화
 * - 빈 값이면 ''
 * - MIXED:<key>는 그대로 유지
 * - exams/ 접두사가 없고 .js 파일이면 exams/를 붙임
 */
function normalizeQrArchiveFile(raw = '') {
    const s = String(raw || '').trim();
    if (!s) return '';
    if (s.startsWith('MIXED:')) return s;
    if (s.startsWith('exams/')) return s;
    if (s.endsWith('.js')) return 'exams/' + s;
    return s;
}

/**
 * QR 코드 생성 모달 오픈
 */
function openQrGenerator(cid) {
    const cls = state.db.classes.find(c => c.id === cid);
    const today = new Date().toLocaleDateString('sv-SE');
    const lastArchiveFile = localStorage.getItem('AP_LAST_ARCHIVE_FILE') || '';

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

            <div>
                <label style="font-size:12px; color:var(--secondary);">JS아카이브 파일명 / archiveFile 선택 입력:</label>
                <input id="qr-archiveFile" class="btn" value="${lastArchiveFile}" placeholder="예: exams/26_효천고_1학기_중간_고1_기출.js" style="width:100%; text-align:left;">
                <div style="font-size:11px; color:var(--secondary); line-height:1.4; margin-top:4px;">
                    비워두면 일반 단원평가 QR로 생성됩니다. JS아카이브 시험지와 연결하려면 <b>exams/파일명.js</b> 형식으로 입력하세요.
                </div>
            </div>

            <div id="qr-result-area" class="hidden" style="text-align:center; margin-top:15px; border-top:1px solid var(--border); padding-top:15px;">
                <img id="qr-img" style="width:180px; max-width:80vw; height:auto; margin-bottom:10px; border: 1px solid #ddd; padding: 5px; background: white;">
                <div id="qr-url" style="font-size:11px; word-break:break-all; background:#f1f3f4; padding:8px; border-radius:8px; margin-bottom:10px; color:var(--secondary);"></div>
                
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn btn-primary" style="flex:1; min-width:120px; padding:12px;" onclick="shareQrUrl()">카카오톡 공유</button>
                    <button class="btn" style="flex:1; min-width:120px; padding:12px;" onclick="copyQrUrl()">URL 복사</button>
                </div>
            </div>
        </div>
    `, 'QR 코드 생성', generateQrCode);
}

/**
 * QR 코드 생성 실행
 */
function generateQrCode() {
    const cid = state.ui.currentClassId;
    const exam = document.getElementById('qr-exam').value.trim();
    const q = parseInt(document.getElementById('qr-q').value) || 20;
    const date = document.getElementById('qr-date').value;
    const archiveFile = normalizeQrArchiveFile(document.getElementById('qr-archiveFile')?.value || '');

    if (!exam || q < 1 || q > 50) {
        toast('입력 정보를 확인하세요 (문항 수 1~50).', 'warn');
        return;
    }

    // [5G-3] 보정된 baseUrl 적용 (apmath 경로 보존)
    const baseUrl = getCheckBaseUrl();
    const params = new URLSearchParams();
    params.set('class', cid);
    params.set('exam', exam);
    params.set('q', String(q));
    params.set('date', date);
    if (archiveFile) params.set('archiveFile', archiveFile);

    const fullUrl = `${baseUrl}?${params.toString()}`;
    
    const qrImg = document.getElementById('qr-img');
    qrImg.onerror = () => toast('QR 이미지 생성 실패. URL 복사를 사용하세요.', 'warn');
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}`;
    
    document.getElementById('qr-url').innerText = fullUrl;
    document.getElementById('qr-result-area').classList.remove('hidden');

    localStorage.setItem('AP_LAST_EXAM_NAME', exam);
    if (archiveFile) localStorage.setItem('AP_LAST_ARCHIVE_FILE', archiveFile);

    toast('QR 코드가 생성되었습니다.', 'info');

    const bindTodayExam = confirm('이 시험을 오늘 마감 기준으로 설정할까요?');
    if (bindTodayExam) {
        setTodayExamConfig(exam, q);
        toast('오늘 시험 기준으로 설정되었습니다.', 'info');
    }
}

/**
 * [5G-3] 카카오톡(Web Share API) 공유 함수
 */
function shareQrUrl() {
    const url = document.getElementById('qr-url')?.innerText || '';
    const exam = document.getElementById('qr-exam')?.value?.trim() || '시험';
    const q = document.getElementById('qr-q')?.value || '';
    const clsName = state.db.classes.find(c => c.id === state.ui.currentClassId)?.name || '';

    const shareText = `[AP Math OS]\n${clsName} ${exam}\n${q}문항 오답 체크 링크입니다.\n${url}`;

    if (navigator.share) {
        navigator.share({
            title: 'AP Math OS 오답 체크',
            text: shareText,
            url: url
        }).then(() => {
            toast('공유창을 열었습니다.', 'info');
        }).catch(() => {
            copyQrUrl();
        });
    } else {
        copyQrUrl();
        toast('공유 기능을 지원하지 않아 URL을 복사했습니다.', 'warn');
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
        const btn = document.querySelector('#qr-result-area .btn:not(.btn-primary)');
        if (btn) {
            const t = btn.innerText;
            btn.innerText = '복사됨 ✅';
            setTimeout(() => btn.innerText = t, 1000);
        }
    }).catch(() => toast('복사 실패', 'warn'));
}

/**
 * 학급의 시험 제출 통계 계산
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
 * [5G-2/3] 특정 시험의 문항 수를 DB에서 추론하는 헬퍼 함수
 */
function findExamQuestionCount(examTitle = '', classId = '') {
    if (!examTitle) return 0;
    const ids = classId
        ? state.db.class_students.filter(m => m.class_id === classId).map(m => m.student_id)
        : state.db.students.map(s => s.id);

    const found = state.db.exam_sessions.find(es =>
        es.exam_title === examTitle &&
        ids.includes(es.student_id) &&
        parseInt(es.question_count) > 0
    );

    return found ? parseInt(found.question_count) : 0;
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
            if (!title) {
                toast('시험명을 입력하세요.', 'warn');
                return;
            }
            localStorage.setItem('AP_LAST_EXAM_NAME', title);
            openQrSubmitStatus(classId, title, date);
        });
        return;
    }

    const { submitted, pending } = computeQrSubmitStatus(classId, examTitle, safeDate);
    const safeExamTitleForJs = String(examTitle).replace(/'/g, "\\'");
    
    // [5G-3] 문항 수 추론 포함
    const inferredQCount = findExamQuestionCount(examTitle, classId);
    const lastArchiveFile = normalizeQrArchiveFile(localStorage.getItem('AP_LAST_ARCHIVE_FILE') || '');
    const safeArchiveFileForJs = String(lastArchiveFile).replace(/'/g, "\\'");
    
    showModal('📊 제출 현황', `
        <div style="background:#f8f9fa;padding:10px;border-radius:8px;font-size:13px;margin-bottom:12px;">
            <b>${examTitle}</b> · ${safeDate} · ${submitted.length + pending.length}명 중 <b>${submitted.length}명 제출</b>
        </div>
        <h4 style="color:var(--success);margin:10px 0 5px;">✅ 제출 (${submitted.length})</h4>
        <table style="font-size:12px;">${submitted.map(s => `<tr><td>${s.name}</td><td style="text-align:right;"><b>${s.score}점</b></td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5;text-align:center;">없음</td></tr>'}</table>
        <h4 style="color:var(--error);margin:16px 0 5px;">⏳ 미제출 (${pending.length})</h4>
        <table style="font-size:12px;">${pending.map(s => `<tr><td>${s.name}</td><td style="text-align:right;"><button class="btn" style="padding:2px 8px;font-size:10px;" onclick="closeModal();openOMR('${s.id}', '${safeExamTitleForJs}', ${inferredQCount}, '${classId}', '', '${safeArchiveFileForJs}')">성적 입력</button></td></tr>`).join('') || '<tr><td colspan="2" style="opacity:0.5;text-align:center;">없음</td></tr>'}</table>
    `);
}

/**
 * 성적 입력 모달 (OMR) 오픈 - 동적 추론 및 오답 프리체크
 */
function openOMR(sid, presetTitle = '', presetQ = 0, presetClassId = '', sessionId = '', presetArchiveFile = '') {
    const todayExam = getTodayExamConfig();
    const defaultTitle = presetTitle || todayExam?.title || '단원평가';

    const session = sessionId ? state.db.exam_sessions.find(es => es.id === sessionId) : null;
    
    const inferredQ = session?.question_count 
        || presetQ 
        || findExamQuestionCount(presetTitle, presetClassId) 
        || todayExam?.q 
        || 20;

    const defaultQ = Math.min(Math.max(parseInt(inferredQ) || 20, 1), 50);

    const defaultArchiveFile = normalizeQrArchiveFile(
        session?.archive_file ||
        presetArchiveFile ||
        localStorage.getItem('AP_LAST_ARCHIVE_FILE') ||
        ''
    );

    // [5G-2/3] 기존 오답 번호 추출 (프리체크용)
    const checkedWrongIds = sessionId 
        ? state.db.wrong_answers
            .filter(w => w.session_id === sessionId)
            .map(w => String(w.question_id))
        : [];

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
            <div>
                <label style="font-size:12px;color:var(--secondary);">JS아카이브 파일명 / archiveFile 선택 입력</label>
                <input id="omr-archiveFile" class="btn" value="${defaultArchiveFile}" placeholder="예: exams/26_효천고_1학기_중간_고1_기출.js" style="width:100%;text-align:left;">
                <div style="font-size:11px;color:var(--secondary);line-height:1.4;margin-top:4px;">
                    JS아카이브 시험지와 연결하면 오답 단원 분석과 클리닉 추천에 사용됩니다. 일반 시험이면 비워두세요.
                </div>
            </div>
            <div id="omr-grid-wrap">
                <div class="omr-grid">${buildOmrItems(defaultQ, checkedWrongIds)}</div>
            </div>
        </div>
    `, '저장', () => handleOMRSave(sid, presetClassId, sessionId));
}

// [5G-2/3] 오답 프리체크를 위한 build 함수 확장
function buildOmrItems(q, checkedIds = []) {
    return Array.from({length: q}, (_, i) => {
        const qNum = String(i + 1);
        const isChecked = checkedIds.includes(qNum) ? 'checked' : '';
        return `<div class="omr-item">Q${qNum}<br><input type="checkbox" class="omr-q" value="${qNum}" ${isChecked}></div>`;
    }).join('');
}

function rebuildOmrGrid() {
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); 
    const currentChecked = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const wrap = document.getElementById('omr-grid-wrap');
    if (wrap) wrap.innerHTML = `<div class="omr-grid">${buildOmrItems(q, currentChecked)}</div>`;
}

async function handleOMRSave(sid, presetClassId = '', sessionId = '') {
    const title = document.getElementById('omr-title').value.trim();
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); 

    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = Math.round(((q - wrs.length) / q) * 100);
    const archiveFile = normalizeQrArchiveFile(document.getElementById('omr-archiveFile')?.value || '');
    
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

    if (archiveFile) {
        payload.archive_file = archiveFile;
        localStorage.setItem('AP_LAST_ARCHIVE_FILE', archiveFile);
    }
    
    const endpoint = sessionId ? `exam-sessions/${sessionId}` : 'exam-sessions/new';
    const r = await api.patch(endpoint, payload);
    
    if (!r?.success) {
        toast('저장 실패', 'warn');
        return;
    }
    
    toast(`${score}점 저장됨`, 'info'); 
    closeModal(); 
    await loadData();
}