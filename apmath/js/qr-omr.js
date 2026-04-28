/**
 * AP Math OS 1.0 [js/qr-omr.js]
 * QR 코드 생성 및 OMR 성적 입력 도구
 * [IRONCLAD 5G]: Master Level UI/UX (진짜 커스텀 원형 OMR 버튼, 고급 QR 쉐어 카드)
 */

/**
 * [5G-3] 학생용 QR 접속 기본 URL 계산 (경로 안정화)
 */
function getCheckBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname;

    path = path.replace(/\/index\.html$/, '/');

    if (!path.endsWith('/')) {
        path = path.substring(0, path.lastIndexOf('/') + 1);
    }

    return origin + path + 'check/';
}

/**
 * archiveFile 입력값 정규화
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
    state.ui.currentClassId = cid; 
    const cls = state.db.classes.find(c => c.id === cid);
    const today = new Date().toLocaleDateString('sv-SE');
    const lastArchiveFile = localStorage.getItem('AP_LAST_ARCHIVE_FILE') || '';

    showModal('QR 생성기', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--bg); padding:14px 18px; border-radius:14px; font-size:13px; display:flex; justify-content:space-between; align-items:center;">
                <span style="color:var(--secondary); font-weight:700;">대상 학급</span>
                <span style="font-weight:900; color:#191F28; font-size:15px;">${cls.name}</span>
            </div>

            <div>
                <label style="font-size:12px; font-weight:800; color:var(--secondary);">시험명 선택/입력</label>
                <div style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;">
                    <button class="btn" style="padding:8px 14px; font-size:13px; background:var(--bg); border:none; border-radius:10px;" onclick="document.getElementById('qr-exam').value='쪽지시험'">쪽지시험</button>
                    <button class="btn" style="padding:8px 14px; font-size:13px; background:var(--bg); border:none; border-radius:10px;" onclick="document.getElementById('qr-exam').value='단원평가'">단원평가</button>
                    <button class="btn" style="padding:8px 14px; font-size:13px; background:var(--bg); border:none; border-radius:10px;" onclick="document.getElementById('qr-exam').value='월말평가'">월말평가</button>
                    <button class="btn" style="padding:8px 14px; font-size:13px; background:var(--bg); border:none; border-radius:10px;" onclick="document.getElementById('qr-exam').value='모의고사'">모의고사</button>
                </div>
                <input id="qr-exam" class="btn" value="단원평가" placeholder="시험명 입력" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; border-radius:14px; font-size:15px;">
            </div>

            <div style="display:flex; gap:12px;">
                <div style="flex:1;">
                    <label style="font-size:12px; font-weight:800; color:var(--secondary);">문항 수 (1~50)</label>
                    <input id="qr-q" type="number" class="btn" value="20" min="1" max="50" style="width:100%; text-align:center; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:15px; font-weight:900;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px; font-weight:800; color:var(--secondary);">시험 날짜</label>
                    <input id="qr-date" type="date" class="btn" value="${today}" style="width:100%; text-align:center; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:14px; font-weight:700;">
                </div>
            </div>

            <div>
                <label style="font-size:12px; font-weight:800; color:var(--secondary);">JS아카이브 파일명 (선택)</label>
                <input id="qr-archiveFile" class="btn" value="${lastArchiveFile}" placeholder="예: exams/기출.js" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:14px;">
                <div style="font-size:11px; color:var(--secondary); line-height:1.5; margin-top:8px; font-weight:600;">
                    비워두면 일반 문항 QR로 생성됩니다. JS아카이브와 연결하려면 파일명을 정확히 입력하세요.
                </div>
            </div>

            <div id="qr-result-area" class="hidden" style="margin-top:20px;">
                <div style="background:var(--surface); border:1px solid rgba(26,92,255,0.2); border-radius:24px; padding:28px 20px; text-align:center; box-shadow:0 12px 32px rgba(26,92,255,0.08);">
                    <div style="font-size:18px; font-weight:950; color:#191F28; letter-spacing:-0.5px;">AP Math OS</div>
                    <div style="font-size:13px; font-weight:800; color:var(--primary); margin-bottom:24px;">모바일 오답 체크 전용 접속 QR</div>
                    
                    <div style="display:inline-block; padding:12px; background:#fff; border-radius:16px; box-shadow:0 4px 16px rgba(0,0,0,0.06); margin-bottom:20px; border:1px solid var(--border);">
                        <img id="qr-img" style="width:180px; height:180px; display:block;">
                    </div>
                    
                    <div id="qr-url" style="font-size:12px; word-break:break-all; background:var(--bg); padding:12px 16px; border-radius:12px; margin-bottom:24px; color:var(--secondary); font-weight:600; text-align:left;"></div>
                    
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1.5; padding:16px; border-radius:16px; font-size:14px; font-weight:900;" onclick="shareQrUrl()">카카오톡 공유</button>
                        <button class="btn" style="flex:1; padding:16px; border-radius:16px; font-size:14px; background:var(--bg); border:none; font-weight:800;" onclick="copyQrUrl()">URL 복사</button>
                    </div>
                </div>
            </div>
        </div>
    `, '생성', generateQrCode);
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
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(fullUrl)}`;
    
    document.getElementById('qr-url').innerText = fullUrl;
    document.getElementById('qr-result-area').classList.remove('hidden');

    localStorage.setItem('AP_LAST_EXAM_NAME', exam);
    if (archiveFile) localStorage.setItem('AP_LAST_ARCHIVE_FILE', archiveFile);

    toast('QR 코드가 생성되었습니다.', 'success');

    const bindTodayExam = confirm('이 시험을 오늘 마감 기준으로 설정할까요?');
    if (bindTodayExam) {
        setTodayExamConfig(exam, q);
        toast('오늘 시험 기준으로 설정되었습니다.', 'info');
    }
}

/**
 * 카카오톡(Web Share API) 공유 함수
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
        toast('URL 복사 완료!', 'success');
        const btn = document.querySelector('#qr-result-area .btn:not(.btn-primary)');
        if (btn) {
            const t = btn.innerText;
            btn.innerText = '복사됨';
            setTimeout(() => btn.innerText = t, 1500);
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
 * 특정 시험의 문항 수를 DB에서 추론하는 헬퍼 함수
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
        showModal('제출 현황 조회', `
            <div style="display:flex;flex-direction:column;gap:12px;">
                <p style="margin:0;font-size:13px;color:var(--secondary);font-weight:700;">조회할 시험명을 입력하세요.</p>
                <input id="qr-status-exam" class="btn" placeholder="시험명 입력 (예: 단원평가)" value="${lastExam}" style="width:100%;text-align:left;background:var(--bg);border:none;padding:16px;border-radius:12px;font-size:14px;">
                <input id="qr-status-date" type="date" class="btn" value="${safeDate}" style="width:100%;background:var(--bg);border:none;padding:16px;border-radius:12px;font-size:14px;font-weight:700;">
            </div>
        `, '조회', () => {
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
    const inferredQCount = findExamQuestionCount(examTitle, classId);
    const lastArchiveFile = normalizeQrArchiveFile(localStorage.getItem('AP_LAST_ARCHIVE_FILE') || '');
    const safeArchiveFileForJs = String(lastArchiveFile).replace(/'/g, "\\'");
    
    showModal('제출 현황', `
        <div style="background:var(--bg);padding:14px 18px;border-radius:14px;font-size:13px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
            <div>
                <div style="font-weight:900;color:#191F28;font-size:15px;margin-bottom:2px;">${examTitle}</div>
                <div style="font-size:12px;color:var(--secondary);font-weight:700;">${safeDate}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:11px;color:var(--secondary);font-weight:700;margin-bottom:2px;">전체 ${submitted.length + pending.length}명</div>
                <div style="font-size:15px;color:var(--primary);font-weight:900;">${submitted.length}명 제출</div>
            </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--success);"></span>
            <h4 style="margin:0;font-size:14px;font-weight:800;color:#191F28;">제출 완료 (${submitted.length})</h4>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:8px 0;margin-bottom:28px;">
            <table style="width:100%;font-size:14px;">
                ${submitted.map(s => `<tr style="border-bottom:1px solid var(--bg);"><td style="padding:12px 20px;font-weight:800;color:#191F28;">${s.name}</td><td style="padding:12px 20px;text-align:right;font-weight:900;color:var(--primary);">${s.score}점</td></tr>`).join('') || '<tr><td colspan="2" style="padding:24px;color:var(--secondary);text-align:center;font-weight:700;">제출한 학생이 없습니다.</td></tr>'}
            </table>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--error);"></span>
            <h4 style="margin:0;font-size:14px;font-weight:800;color:#191F28;">미제출 (${pending.length})</h4>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:8px 0;">
            <table style="width:100%;font-size:14px;">
                ${pending.map(s => `<tr style="border-bottom:1px solid var(--bg);"><td style="padding:12px 20px;font-weight:800;color:#191F28;">${s.name}</td><td style="padding:10px 16px;text-align:right;"><button class="btn btn-primary" style="padding:8px 14px;font-size:12px;font-weight:800;border-radius:10px;" onclick="closeModal();openOMR('${s.id}', '${safeExamTitleForJs}', ${inferredQCount}, '${classId}', '', '${safeArchiveFileForJs}')">성적 입력</button></td></tr>`).join('') || '<tr><td colspan="2" style="padding:24px;color:var(--secondary);text-align:center;font-weight:700;">미제출 학생이 없습니다.</td></tr>'}
            </table>
        </div>
    `);
}

/**
 * 성적 직접 입력 모달 (OMR) 오픈
 */
function openOMR(sid, presetTitle = '', presetQ = 0, presetClassId = '', sessionId = '', presetArchiveFile = '') {
    const todayExam = getTodayExamConfig();
    const defaultTitle = presetTitle || todayExam?.title || '단원평가';
    const session = sessionId ? state.db.exam_sessions.find(es => es.id === sessionId) : null;
    
    const inferredQ = session?.question_count || presetQ || findExamQuestionCount(presetTitle, presetClassId) || todayExam?.q || 20;
    const defaultQ = Math.min(Math.max(parseInt(inferredQ) || 20, 1), 50);

    const defaultArchiveFile = normalizeQrArchiveFile(
        session?.archive_file || presetArchiveFile || localStorage.getItem('AP_LAST_ARCHIVE_FILE') || ''
    );

    const checkedWrongIds = sessionId 
        ? state.db.wrong_answers.filter(w => w.session_id === sessionId).map(w => String(w.question_id))
        : [];

    showModal('성적 직접 입력', `
        <div style="display:flex;flex-direction:column;gap:18px;">
            <div style="display:flex; gap:12px;">
                <div style="flex:2;">
                    <label style="font-size:12px;font-weight:800;color:var(--secondary);margin-bottom:8px;display:block;">시험명</label>
                    <input id="omr-title" class="btn" value="${defaultTitle}" style="width:100%;text-align:left;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:14px;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px;font-weight:800;color:var(--secondary);margin-bottom:8px;display:block;">문항 수</label>
                    <input id="omr-q" type="number" class="btn" value="${defaultQ}" min="1" max="50" style="width:100%;text-align:center;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:15px;font-weight:900;" oninput="rebuildOmrGrid()">
                </div>
            </div>
            
            <div>
                <label style="font-size:12px;font-weight:800;color:var(--secondary);margin-bottom:8px;display:block;">아카이브 파일명 (선택)</label>
                <input id="omr-archiveFile" class="btn" value="${defaultArchiveFile}" placeholder="exams/기출.js" style="width:100%;text-align:left;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:13px;">
            </div>

            <div style="margin-top:14px;">
                <div style="font-size:14px;font-weight:900;color:#191F28;margin-bottom:16px;">틀린 번호를 선택하세요</div>
                <div id="omr-grid-wrap">
                    <div class="omr-grid" style="gap:14px;">${buildOmrItems(defaultQ, checkedWrongIds)}</div>
                </div>
            </div>
        </div>
    `, '저장', () => handleOMRSave(sid, presetClassId, sessionId));
}

/**
 * [Master] 숨겨진 체크박스와 CSS 커스텀 디자인을 활용한 완벽한 원형 햅틱 토글 버튼
 */
function buildOmrItems(q, checkedIds = []) {
    return Array.from({length: q}, (_, i) => {
        const qNum = String(i + 1);
        const isChecked = checkedIds.includes(qNum);
        
        // 초기 렌더링 스타일
        const bg = isChecked ? 'var(--primary)' : 'var(--surface)';
        const color = isChecked ? '#fff' : 'var(--secondary)';
        const border = isChecked ? 'var(--primary)' : 'var(--border)';
        const shadow = isChecked ? '0 4px 12px rgba(26,92,255,0.3)' : 'none';
        
        return `
        <label style="display:flex; flex-direction:column; align-items:center; justify-content:center; cursor:pointer; -webkit-tap-highlight-color:transparent;">
            <input type="checkbox" class="omr-q hidden" value="${qNum}" ${isChecked ? 'checked' : ''} onchange="
                if(navigator.vibrate) navigator.vibrate(20);
                const v = this.nextElementSibling;
                if(this.checked) {
                    v.style.background = 'var(--primary)';
                    v.style.color = '#fff';
                    v.style.borderColor = 'var(--primary)';
                    v.style.boxShadow = '0 4px 12px rgba(26,92,255,0.3)';
                    v.style.transform = 'scale(1.08)';
                } else {
                    v.style.background = 'var(--surface)';
                    v.style.color = 'var(--secondary)';
                    v.style.borderColor = 'var(--border)';
                    v.style.boxShadow = 'none';
                    v.style.transform = 'scale(1)';
                }
                setTimeout(() => v.style.transform = 'scale(1)', 150);
            " style="display:none;">
            <div style="width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:900; background:${bg}; color:${color}; border:2px solid ${border}; box-shadow:${shadow}; transition:all 0.15s cubic-bezier(0.4, 0, 0.2, 1);">
                ${qNum}
            </div>
        </label>`;
    }).join('');
}

function rebuildOmrGrid() {
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); 
    const currentChecked = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const wrap = document.getElementById('omr-grid-wrap');
    if (wrap) wrap.innerHTML = `<div class="omr-grid" style="gap:14px;">${buildOmrItems(q, currentChecked)}</div>`;
}

async function handleOMRSave(sid, presetClassId = '', sessionId = '') {
    const title = document.getElementById('omr-title').value.trim();
    let q = parseInt(document.getElementById('omr-q').value) || 20;
    q = Math.max(1, Math.min(50, q)); 

    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = Math.round(((q - wrs.length) / q) * 100);
    
    let archiveFile = normalizeQrArchiveFile(document.getElementById('omr-archiveFile')?.value || '');
    
    if (!archiveFile) {
        const session = sessionId ? state.db.exam_sessions.find(es => es.id === sessionId) : null;
        archiveFile = normalizeQrArchiveFile(session?.archive_file || '');
    }
    
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
        toast('저장실패', 'warn');
        return;
    }
    
    toast(`저장완료 (${score}점)`, 'success'); 
    closeModal(); 
    await loadData();
}