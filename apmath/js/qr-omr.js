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
                <span style="font-weight:700; color:var(--text); font-size:15px;">${cls.name}</span>
            </div>

            <div>
                <label style="font-size:12px; font-weight:700; color:var(--secondary);">시험명 선택/입력</label>
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
                    <label style="font-size:12px; font-weight:700; color:var(--secondary);">문항 수 (1~50)</label>
                    <input id="qr-q" type="number" class="btn" value="20" min="1" max="50" style="width:100%; text-align:center; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:15px; font-weight:700;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px; font-weight:700; color:var(--secondary);">시험 날짜</label>
                    <input id="qr-date" type="date" class="btn" value="${today}" style="width:100%; text-align:center; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:14px; font-weight:700;">
                </div>
            </div>

            <div>
                <label style="font-size:12px; font-weight:700; color:var(--secondary);">JS아카이브 파일명 (선택)</label>
                <input id="qr-archiveFile" class="btn" value="${lastArchiveFile}" placeholder="예: exams/기출.js" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; margin-top:8px; border-radius:14px; font-size:14px;">
                <div style="font-size:11px; color:var(--secondary); line-height:1.5; margin-top:8px; font-weight:600;">
                    비워두면 일반 문항 QR로 생성됩니다. JS아카이브와 연결하려면 파일명을 정확히 입력하세요.
                </div>
            </div>

            <div id="qr-result-area" class="hidden" style="margin-top:20px;">
                <div style="background:var(--surface); border:1px solid rgba(26,92,255,0.2); border-radius:24px; padding:28px 20px; text-align:center; box-shadow:0 12px 32px rgba(26,92,255,0.08);">
                    <div style="font-size:18px; font-weight:700; color:var(--text); letter-spacing:-0.5px;">AP Math OS</div>
                    <div style="font-size:13px; font-weight:700; color:var(--primary); margin-bottom:24px;">모바일 오답 체크 전용 접속 QR</div>
                    
                    <div style="display:inline-block; padding:12px; background:#fff; border-radius:16px; box-shadow:0 4px 16px rgba(0,0,0,0.06); margin-bottom:20px; border:1px solid var(--border);">
                        <img id="qr-img" style="width:180px; height:180px; display:block;">
                    </div>
                    
                    <div id="qr-url" style="font-size:12px; word-break:break-all; background:var(--bg); padding:12px 16px; border-radius:12px; margin-bottom:24px; color:var(--secondary); font-weight:600; text-align:left;"></div>
                    
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-primary" style="flex:1.5; padding:16px; border-radius:16px; font-size:14px; font-weight:700;" onclick="shareQrUrl()">카카오톡 공유</button>
                        <button class="btn" style="flex:1; padding:16px; border-radius:16px; font-size:14px; background:var(--bg); border:none; font-weight:700;" onclick="copyQrUrl()">URL 복사</button>
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

    toast('QR 코드가 생성되었습니다.', 'info');

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
        toast('URL 복사 완료!', 'info');
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
    const classStudents = state.db.class_students || [];
    const students = state.db.students || [];
    const examSessions = state.db.exam_sessions || [];

    const ids = classStudents.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const aIds = active.map(s => String(s.id));
    const sessions = examSessions.filter(es => es.exam_date === examDate && es.exam_title === examTitle && aIds.includes(String(es.student_id)));
    const submittedIds = new Set(sessions.map(es => String(es.student_id)));
    const submitted = active.filter(s => submittedIds.has(String(s.id))).map(s => {
        const sess = sessions.find(ts => String(ts.student_id) === String(s.id));
        return { ...s, score: sess?.score ?? '' };
    });
    const pending = active.filter(s => !submittedIds.has(String(s.id)));
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

    showModal('제출 현황', `
        <div style="background:var(--bg);padding:14px 18px;border-radius:14px;font-size:13px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:center;">
            <div>
                <div style="font-weight:700;color:var(--text);font-size:15px;margin-bottom:2px;">${examTitle}</div>
                <div style="font-size:12px;color:var(--secondary);font-weight:700;">${safeDate}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:11px;color:var(--secondary);font-weight:700;margin-bottom:2px;">전체 ${submitted.length + pending.length}명</div>
                <div style="font-size:15px;color:var(--primary);font-weight:700;">${submitted.length}명 제출</div>
            </div>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--success);"></span>
            <h4 style="margin:0;font-size:14px;font-weight:700;color:var(--text);">제출 완료 (${submitted.length})</h4>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:8px 0;margin-bottom:28px;">
            <table style="width:100%;font-size:14px;">
                ${submitted.map(s => `<tr style="border-bottom:1px solid var(--bg);"><td style="padding:12px 20px;font-weight:700;color:var(--text);">${s.name}</td><td style="padding:12px 20px;text-align:right;font-weight:700;color:var(--primary);">${s.score}점</td></tr>`).join('') || '<tr><td colspan="2" style="padding:24px;color:var(--secondary);text-align:center;font-weight:700;">제출한 학생이 없습니다.</td></tr>'}
            </table>
        </div>

        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--error);"></span>
            <h4 style="margin:0;font-size:14px;font-weight:700;color:var(--text);">미제출 (${pending.length})</h4>
        </div>
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:8px 0;">
            <table style="width:100%;font-size:14px;">
                ${pending.map(s => `<tr style="border-bottom:1px solid var(--bg);"><td style="padding:12px 20px;font-weight:700;color:var(--text);">${s.name}</td><td style="padding:10px 16px;text-align:right;"><button class="btn btn-primary" style="min-height:36px;padding:8px 14px;font-size:12px;font-weight:700;border-radius:10px;" onclick="closeModal();openOMR('${s.id}', '${safeExamTitleForJs}')">\uC131\uC801 \uC785\uB825</button></td></tr>`).join('') || '<tr><td colspan="2" style="padding:24px;color:var(--secondary);text-align:center;font-weight:700;">\uBBF8\uC81C\uCD9C \uD559\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</td></tr>'}
            </table>
        </div>
    `);
}

/**
 * 성적 직접 입력 모달 (OMR) 오픈
 */
function openOMR(sid, presetTitle = '') {
    const todayExam = getTodayExamConfig();
    const defaultTitle = presetTitle || todayExam?.title || '단원평가';
    
    const mapObj = state.db.class_students.find(m => m.student_id === sid);
    const classId = mapObj ? mapObj.class_id : '';
    
    // [Fix 1] 동적 문항수(q) 처리 로직 (시그니처 확장 없이)
    const inferredQ = todayExam?.q || findExamQuestionCount(presetTitle, classId) || 20;
    const defaultQ = Math.min(Math.max(parseInt(inferredQ) || 20, 1), 50);

    const defaultArchiveFile = normalizeQrArchiveFile(
        localStorage.getItem('AP_LAST_ARCHIVE_FILE') || ''
    );

    const checkedWrongIds = [];

    showModal('성적 직접 입력', `
        <div style="display:flex;flex-direction:column;gap:18px;">
            <div style="display:flex; gap:12px;">
                <div style="flex:2;">
                    <label style="font-size:12px;font-weight:700;color:var(--secondary);margin-bottom:8px;display:block;">시험명</label>
                    <input id="omr-title" class="btn" value="${defaultTitle}" style="width:100%;text-align:left;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:14px;">
                </div>
                <div style="flex:1;">
                    <label style="font-size:12px;font-weight:700;color:var(--secondary);margin-bottom:8px;display:block;">문항 수</label>
                    <input id="omr-q" type="number" class="btn" value="${defaultQ}" min="1" max="50" style="width:100%;text-align:center;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:15px;font-weight:700;" oninput="rebuildOmrGrid()">
                </div>
            </div>
            
            <div>
                <label style="font-size:12px;font-weight:700;color:var(--secondary);margin-bottom:8px;display:block;">아카이브 파일명 (선택)</label>
                <input id="omr-archiveFile" class="btn" value="${defaultArchiveFile}" placeholder="exams/기출.js" style="width:100%;text-align:left;background:var(--bg);border:none;padding:14px;border-radius:12px;font-size:13px;">
            </div>

            <div style="margin-top:14px;">
                <div style="font-size:14px;font-weight:700;color:var(--text);margin-bottom:16px;">틀린 번호를 선택하세요</div>
                <div id="omr-grid-wrap">
                    <div class="omr-grid" style="gap:14px;">${buildOmrItems(defaultQ, checkedWrongIds)}</div>
                </div>
            </div>
        </div>
    `, '저장', () => handleOMRSave(sid));
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
            <div style="width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; background:${bg}; color:${color}; border:2px solid ${border}; box-shadow:${shadow}; transition:all 0.15s cubic-bezier(0.4, 0, 0.2, 1);">
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

async function handleOMRSave(sid) {
    const title = document.getElementById('omr-title').value.trim();
    // [Fix 2] 점수 계산 및 리로드 경량화 적용
    let q = parseInt(document.getElementById('omr-q')?.value) || 10;
    q = Math.max(1, Math.min(50, q)); 

    const wrs = Array.from(document.querySelectorAll('.omr-q:checked')).map(el => el.value);
    const score = Math.round((q - wrs.length) * (100 / q));
    
    let archiveFile = normalizeQrArchiveFile(document.getElementById('omr-archiveFile')?.value || '');
    
    let classId = state.ui?.currentClassId;
    if (!classId) {
        const mapObj = state.db.class_students.find(m => m.student_id === sid);
        classId = mapObj ? mapObj.class_id : null;
    }

    const savedExamDate = new Date().toLocaleDateString('sv-SE');

    const payload = {
        student_id: sid, 
        exam_title: title, 
        score: score, 
        wrong_ids: wrs, 
        exam_date: savedExamDate, 
        question_count: q, 
        class_id: classId
    };

    if (archiveFile) {
        payload.archive_file = archiveFile;
        localStorage.setItem('AP_LAST_ARCHIVE_FILE', archiveFile);
    }
    
    const endpoint = 'exam-sessions/new';
    const r = await api.patch(endpoint, payload);
    
    if (!r?.success) {
        toast('저장실패', 'warn');
        return;
    }
    
    toast(`저장완료 (${score}점)`, 'info'); 
    closeModal(); 
    
    // 전체 loadData() 대신 부분 갱신 및 가벼운 라우팅으로 성능 최적화
    await refreshDataOnly();

    if (state.ui.currentClassId) {
        renderClass(state.ui.currentClassId);
    } else {
        renderDashboard();
    }
}
// ─────────────────────────────────────────────
// [OMR 입력] 선생님용 일괄 오답 입력 화면
// - 사이드바 독립 메뉴 진입
// - 출석부형 전체 화면 구조
// - 기본 O / 클릭 시 X / 저장 시 X만 wrong_answers 반영
// ─────────────────────────────────────────────
function omrEscape(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function omrGradeRank(value) {
    const text = String(value || '');
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function omrClassGrade(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    return order.find(g => text.includes(g)) || String(cls?.grade || '').trim();
}

function sortOmrClasses(classes = []) {
    return [...classes].sort((a, b) => {
        const gradeDiff = omrGradeRank(a.grade || a.name) - omrGradeRank(b.grade || b.name);
        if (gradeDiff !== 0) return gradeDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
    });
}

function sortOmrStudents(students = []) {
    return [...students].sort((a, b) => {
        const aClass = getOmrClassName(getOmrClassIdForStudent(a.id));
        const bClass = getOmrClassName(getOmrClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko', { numeric: true });
        if (classDiff !== 0) return classDiff;

        const gradeDiff = omrGradeRank(a.grade) - omrGradeRank(b.grade);
        if (gradeDiff !== 0) return gradeDiff;

        return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
    });
}

function getOmrClassIdForStudent(studentId) {
    const map = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return map ? String(map.class_id) : '';
}

function getOmrClassName(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    return cls ? String(cls.name || '') : '';
}

function getOmrVisibleClasses() {
    return sortOmrClasses((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
}

function getOmrAvailableGrades() {
    const grades = new Set();
    getOmrVisibleClasses().forEach(c => {
        const g = omrClassGrade(c);
        if (g) grades.add(g);
    });
    (state.db.students || []).forEach(s => {
        const g = String(s.grade || '').trim();
        if (g) grades.add(g);
    });
    return ['중1', '중2', '중3', '고1', '고2', '고3'].filter(g => grades.has(g));
}

function getOmrFilteredClasses() {
    const ui = state.ui.omrInput || {};
    const grade = String(ui.grade || '').trim();
    if (!grade) return [];

    return getOmrVisibleClasses().filter(c =>
        `${c.grade || ''} ${c.name || ''}`.includes(grade)
    );
}

function getOmrVisibleStudents() {
    const ui = state.ui.omrInput || {};
    const grade = String(ui.grade || '').trim();
    const classId = String(ui.classId || '').trim();

    if (!grade) return [];

    const activeStudents = (state.db.students || []).filter(s => String(s.status || '재원') === '재원');
    const allowedClasses = getOmrFilteredClasses();
    const allowedClassIds = new Set(allowedClasses.map(c => String(c.id)));

    let allowedStudentIds = new Set((state.db.class_students || [])
        .filter(m => allowedClassIds.has(String(m.class_id)))
        .map(m => String(m.student_id)));

    if (classId) {
        allowedStudentIds = new Set((state.db.class_students || [])
            .filter(m => String(m.class_id) === classId)
            .map(m => String(m.student_id)));
    }

    const students = activeStudents.filter(s => {
        const sid = String(s.id);
        if (!allowedStudentIds.has(sid)) return false;
        return `${s.grade || ''} ${getOmrClassName(getOmrClassIdForStudent(sid))}`.includes(grade);
    });

    return sortOmrStudents(students);
}

function getOmrExistingSession(studentId) {
    const ui = state.ui.omrInput || {};
    const examTitle = String(ui.examTitle || '').trim();
    const examDate = String(ui.examDate || '').trim();
    if (!examTitle || !examDate) return null;

    const classId = getOmrClassIdForStudent(studentId);
    return (state.db.exam_sessions || [])
        .filter(e =>
            String(e.student_id) === String(studentId) &&
            String(e.exam_title || '') === examTitle &&
            String(e.exam_date || '') === examDate &&
            (!e.class_id || !classId || String(e.class_id) === String(classId))
        )
        .sort((a, b) => String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || '')))[0] || null;
}

function getOmrExistingWrongSet(studentId) {
    const sess = getOmrExistingSession(studentId);
    if (!sess) return new Set();
    return new Set((state.db.wrong_answers || [])
        .filter(w => String(w.session_id) === String(sess.id))
        .map(w => String(w.question_id)));
}


function makeOmrHistoryKey(item = {}) {
    return [
        item.examDate || '',
        item.examTitle || '',
        String(item.questionCount || ''),
        item.archiveFile || ''
    ].map(v => encodeURIComponent(String(v))).join('|');
}

function getOmrHistoricalExamList() {
    const students = getOmrVisibleStudents();
    if (!students.length) return [];

    const studentIds = new Set(students.map(s => String(s.id)));
    const map = new Map();

    (state.db.exam_sessions || []).forEach(es => {
        const sid = String(es.student_id || '');
        const examTitle = String(es.exam_title || '').trim();
        const examDate = String(es.exam_date || '').trim();
        if (!studentIds.has(sid) || !examTitle || !examDate) return;

        const questionCount = Math.max(1, Math.min(80, parseInt(es.question_count, 10) || 25));
        const archiveFile = normalizeQrArchiveFile(es.archive_file || '');
        const item = { examTitle, examDate, questionCount, archiveFile };
        const key = makeOmrHistoryKey(item);

        if (!map.has(key)) {
            map.set(key, { ...item, count: 0, updatedAt: '' });
        }

        const row = map.get(key);
        row.count += 1;
        const updatedAt = String(es.updated_at || es.created_at || '');
        if (updatedAt > row.updatedAt) row.updatedAt = updatedAt;
    });

    return Array.from(map.values()).sort((a, b) =>
        String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
        String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')) ||
        String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko', { numeric: true })
    );
}

function getOmrSelectedHistoryKey() {
    const ui = state.ui.omrInput || {};
    if (!ui.examTitle || !ui.examDate) return '';
    return makeOmrHistoryKey({
        examTitle: ui.examTitle,
        examDate: ui.examDate,
        questionCount: ui.questionCount || 25,
        archiveFile: ui.archiveFile || ''
    });
}

function buildOmrHistoryOptions() {
    const list = getOmrHistoricalExamList();
    const selectedKey = getOmrSelectedHistoryKey();

    if (!list.length) {
        return '<option value="">기존 시험 없음</option>';
    }

    return '<option value="">기존 시험 불러오기</option>' + list.map(item => {
        const key = makeOmrHistoryKey(item);
        const label = `${item.examDate} · ${item.examTitle} · ${item.questionCount}문항${item.count ? ` · ${item.count}명` : ''}`;
        return `<option value="${omrEscape(key)}"${selectedKey === key ? ' selected' : ''}>${omrEscape(label)}</option>`;
    }).join('');
}

function handleOmrHistoryChange() {
    const selectedKey = document.getElementById('omr-history')?.value || '';
    if (!selectedKey) return;

    const item = getOmrHistoricalExamList().find(x => makeOmrHistoryKey(x) === selectedKey);
    if (!item) {
        toast('불러올 시험을 찾을 수 없습니다.', 'warn');
        return;
    }

    const ui = ensureOmrInputState();
    ui.examTitle = item.examTitle || '';
    ui.examDate = item.examDate || new Date().toLocaleDateString('sv-SE');
    ui.questionCount = item.questionCount || 25;
    ui.archiveFile = item.archiveFile || '';
    ui.answers = {};
    ui.examSelected = true;

    renderOmrInput();
}

function ensureOmrInputState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.omrInput) {
        state.ui.omrInput = {
            examTitle: '',
            examDate: new Date().toLocaleDateString('sv-SE'),
            questionCount: 25,
            grade: '',
            classId: '',
            archiveFile: localStorage.getItem('AP_LAST_ARCHIVE_FILE') || '',
            answers: {},
            examSelected: false
        };
    }
    if (!state.ui.omrInput.answers) state.ui.omrInput.answers = {};
    return state.ui.omrInput;
}

function resetOmrAnswerDraft() {
    const ui = ensureOmrInputState();
    ui.answers = {};
}

function getOmrWrongSet(studentId) {
    const ui = ensureOmrInputState();
    const sid = String(studentId);
    if (!ui.answers[sid]) {
        ui.answers[sid] = {};
        getOmrExistingWrongSet(sid).forEach(q => { ui.answers[sid][String(q)] = true; });
    }
    return ui.answers[sid];
}

function isOmrWrong(studentId, questionNo) {
    return !!getOmrWrongSet(studentId)[String(questionNo)];
}

function installOmrInputStyle() {
    if (document.getElementById('ap-omr-input-style')) return;
    const style = document.createElement('style');
    style.id = 'ap-omr-input-style';
    style.textContent = `
        #omr-main { width:100%; max-width:1150px; margin:0 auto; height:calc(100vh - 56px); display:flex; flex-direction:column; padding:12px 16px 0; box-sizing:border-box; }
        #omr-header-row { display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:10px; margin-bottom:10px; flex-shrink:0; }
        #omr-title { font-size:18px; font-weight:800; color:var(--text); letter-spacing:-0.5px; white-space:nowrap; }
        #omr-controls { display:grid; grid-template-columns:1.4fr 140px 118px 120px 1fr; gap:8px; margin-bottom:8px; flex-shrink:0; }
        .omr-ctrl { height:36px; min-height:36px; padding:0 10px; border-radius:9px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:13px; font-weight:700; font-family:inherit; }
        .omr-ctrl.omr-text { text-align:left; }
        #omr-sub-controls { display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-bottom:8px; flex-shrink:0; }
        #omr-guide { font-size:11px; font-weight:700; color:var(--secondary); display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px; flex-shrink:0; }
        .omr-guide-item { display:inline-flex; align-items:center; gap:4px; min-height:22px; padding:2px 7px; border-radius:999px; border:1px solid var(--border); background:var(--surface); white-space:nowrap; line-height:1; }
        #omr-tbl-wrap { flex:1; overflow:auto; border:1px solid var(--border); border-radius:12px 12px 0 0; background:var(--surface); -webkit-overflow-scrolling:touch; }
        #omr-tbl { border-collapse:separate; border-spacing:0; width:max-content; min-width:100%; margin:0; }
        #omr-tbl th, #omr-tbl td { border-right:1px solid var(--border); border-bottom:1px solid var(--border); padding:0; text-align:center; vertical-align:middle; height:34px; min-width:38px; color:var(--text); background:var(--surface); }
        #omr-tbl th { position:sticky; top:0; z-index:5; height:34px; background:var(--surface-2); font-size:11px; font-weight:800; color:var(--secondary); }
        #omr-tbl .omr-name-head, #omr-tbl .omr-name-cell { position:sticky; left:0; z-index:6; min-width:116px; max-width:116px; width:116px; text-align:left; padding:0 8px; box-shadow:1px 0 0 var(--border); }
        #omr-tbl .omr-name-head { z-index:9; background:var(--surface-2); }
        #omr-tbl .omr-name-cell { background:var(--surface); }
        .omr-name-main { font-size:13px; font-weight:800; color:var(--text); line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .omr-name-sub { margin-top:2px; font-size:10px; font-weight:700; color:var(--secondary); line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .omr-cell-btn { width:100%; height:100%; min-height:34px; border:0; background:transparent; color:var(--success); font-size:13px; font-weight:800; font-family:inherit; cursor:pointer; border-radius:0; display:flex; align-items:center; justify-content:center; }
        .omr-cell-btn.wrong { color:var(--error); background:rgba(232,65,79,0.08); }
        .omr-cell-btn.blank { cursor:default; color:transparent; background:transparent; }
        .omr-cell-btn:disabled { opacity:1; }
        .omr-footer { display:flex; gap:8px; justify-content:space-between; align-items:center; padding:10px 0 calc(10px + env(safe-area-inset-bottom)); flex-shrink:0; }
        .omr-footer-info { font-size:12px; font-weight:700; color:var(--secondary); line-height:1.4; }
        .omr-save-btn { min-height:42px; padding:0 18px; border-radius:12px; font-size:13px; font-weight:800; }
        @media (max-width:900px) {
            #omr-main { height:calc(100vh - 58px); padding:10px 10px 0; }
            #omr-controls { grid-template-columns:1fr 108px; gap:7px; }
            #omr-sub-controls { display:grid; grid-template-columns:1fr 1fr; gap:7px; }
            .omr-ctrl { width:100%; font-size:12px; }
            #omr-tbl .omr-name-head, #omr-tbl .omr-name-cell { min-width:92px; max-width:92px; width:92px; padding:0 6px; }
            #omr-tbl th, #omr-tbl td { min-width:34px; height:32px; }
            .omr-cell-btn { min-height:32px; font-size:12px; }
            .omr-name-main { font-size:12px; }
            .omr-name-sub { font-size:9px; }
        }
    `;
    document.head.appendChild(style);
}

function updateOmrInputFromControls({ resetAnswers = true, resetExamSelection = false } = {}) {
    const ui = ensureOmrInputState();
    const prevKey = `${ui.examTitle}|${ui.examDate}|${ui.questionCount}|${ui.grade}|${ui.classId}`;
    const prevExamKey = `${ui.examTitle}|${ui.examDate}|${ui.questionCount}|${ui.archiveFile || ''}`;

    ui.examTitle = document.getElementById('omr-exam-title')?.value.trim() || '';
    ui.examDate = document.getElementById('omr-exam-date')?.value || ui.examDate || new Date().toLocaleDateString('sv-SE');
    ui.questionCount = Math.max(1, Math.min(80, parseInt(document.getElementById('omr-question-count')?.value, 10) || 25));
    ui.grade = document.getElementById('omr-grade')?.value || '';
    ui.classId = document.getElementById('omr-class')?.value || '';
    ui.archiveFile = normalizeQrArchiveFile(document.getElementById('omr-archive-file')?.value || '');

    const nextKey = `${ui.examTitle}|${ui.examDate}|${ui.questionCount}|${ui.grade}|${ui.classId}`;
    const nextExamKey = `${ui.examTitle}|${ui.examDate}|${ui.questionCount}|${ui.archiveFile || ''}`;

    if (resetAnswers && prevKey !== nextKey) ui.answers = {};
    if (resetExamSelection && prevExamKey !== nextExamKey) {
        ui.examSelected = false;
        ui.answers = {};
    }

    if (ui.examTitle) localStorage.setItem('AP_LAST_EXAM_NAME', ui.examTitle);
    if (ui.archiveFile) localStorage.setItem('AP_LAST_ARCHIVE_FILE', ui.archiveFile);
}

function handleOmrGradeChange() {
    const ui = ensureOmrInputState();
    updateOmrInputFromControls({ resetAnswers: true, resetExamSelection: false });
    ui.classId = '';
    ui.answers = {};
    renderOmrInput();
}

function handleOmrClassChange() {
    updateOmrInputFromControls({ resetAnswers: true, resetExamSelection: false });
    renderOmrInput();
}

function handleOmrMetaChange() {
    updateOmrInputFromControls({ resetAnswers: true, resetExamSelection: true });
    renderOmrInput();
}

function buildOmrGradeOptions(selectedGrade) {
    const grades = getOmrAvailableGrades();
    return `<option value="">학년 선택</option>` + grades.map(g => `<option value="${omrEscape(g)}"${String(selectedGrade || '') === g ? ' selected' : ''}>${omrEscape(g)}</option>`).join('');
}

function buildOmrClassOptions(selectedClassId) {
    const ui = state.ui.omrInput || {};
    const grade = String(ui.grade || '').trim();
    if (!grade) return `<option value="">먼저 학년 선택</option>`;

    const classes = getOmrFilteredClasses();
    return `<option value="">${omrEscape(grade)} 전체</option>` + classes.map(c => `<option value="${omrEscape(c.id)}"${String(selectedClassId || '') === String(c.id) ? ' selected' : ''}>${omrEscape(c.name)}</option>`).join('');
}

function isOmrExamReady() {
    const ui = ensureOmrInputState();
    const title = String(ui.examTitle || '').trim();
    const date = String(ui.examDate || '').trim();
    const qCount = Number(ui.questionCount || 0);
    return !!(ui.examSelected && title && date && Number.isFinite(qCount) && qCount > 0);
}

function activateCurrentOmrExam() {
    updateOmrInputFromControls({ resetAnswers: true, resetExamSelection: false });
    const ui = ensureOmrInputState();
    if (!String(ui.examTitle || '').trim() || !String(ui.examDate || '').trim()) {
        toast('시험명과 시험일을 먼저 입력하세요.', 'warn');
        return;
    }
    ui.examSelected = true;
    ui.answers = {};
    renderOmrInput();
}

function renderOmrInputTable(students, questionCount) {
    const ready = isOmrExamReady();
    const head = Array.from({ length: questionCount }, (_, idx) => `<th>${idx + 1}</th>`).join('');
    const rows = students.map(s => {
        const className = getOmrClassName(getOmrClassIdForStudent(s.id));
        const cells = Array.from({ length: questionCount }, (_, idx) => {
            const q = idx + 1;
            if (!ready) {
                return `<td><button type="button" id="omr-cell-${omrEscape(s.id)}-${q}" class="omr-cell-btn blank" disabled></button></td>`;
            }
            const wrong = isOmrWrong(s.id, q);
            return `<td><button type="button" id="omr-cell-${omrEscape(s.id)}-${q}" class="omr-cell-btn ${wrong ? 'wrong' : ''}" onclick="toggleOmrCell('${omrEscape(s.id)}', ${q})">${wrong ? 'X' : 'O'}</button></td>`;
        }).join('');
        return `
            <tr>
                <td class="omr-name-cell">
                    <div class="omr-name-main">${omrEscape(s.name)}</div>
                    <div class="omr-name-sub">${omrEscape(className || '미배정')}</div>
                </td>
                ${cells}
            </tr>
        `;
    }).join('');

    return `
        <table id="omr-tbl">
            <thead>
                <tr><th class="omr-name-head">학생명</th>${head}</tr>
            </thead>
            <tbody>
                ${rows || `<tr><td class="omr-name-cell" style="height:72px;">대상 없음</td><td colspan="${questionCount}" style="font-size:13px;font-weight:700;color:var(--secondary);min-width:260px;">학년을 선택하면 학생 목록이 표시됩니다.</td></tr>`}
            </tbody>
        </table>
    `;
}

function openOmrInput() {
    if (state?.auth?.role === 'admin') {
        toast('OMR 입력은 선생님 계정에서 사용합니다.', 'warn');
        return;
    }
    ensureOmrInputState();
    renderOmrInput();
}

function renderOmrInput() {
    installOmrInputStyle();
    if (typeof enterTimetableWideMode === 'function') enterTimetableWideMode();

    const root = document.getElementById('app-root');
    if (!root) return;

    const ui = ensureOmrInputState();
    const today = new Date().toLocaleDateString('sv-SE');
    if (!ui.examDate) ui.examDate = today;
    if (!ui.questionCount) ui.questionCount = 25;

    const students = getOmrVisibleStudents();
    const examReady = isOmrExamReady();
    const wrongTotal = examReady ? students.reduce((sum, s) => {
        const set = getOmrWrongSet(s.id);
        return sum + Object.keys(set).filter(k => set[k]).length;
    }, 0) : 0;
    const footerInfoText = examReady ? `대상 ${students.length}명 · X ${wrongTotal}개` : `대상 ${students.length}명 · 시험 선택 전`;

    root.innerHTML = `
        <div id="omr-main">
            <div id="omr-header-row">
                <div id="omr-title">OMR 입력</div>
                <button class="btn" style="height:36px; min-height:36px; padding:0 12px; font-size:12px; font-weight:800; border-radius:9px;" onclick="goOmrInputHome()">AP MATH</button>
            </div>

            <div id="omr-controls">
                <input id="omr-exam-title" class="omr-ctrl omr-text" value="${omrEscape(ui.examTitle)}" placeholder="시험명" onchange="handleOmrMetaChange()">
                <input id="omr-exam-date" type="date" class="omr-ctrl" value="${omrEscape(ui.examDate)}" onchange="handleOmrMetaChange()">
                <input id="omr-question-count" type="number" min="1" max="80" class="omr-ctrl" value="${Number(ui.questionCount) || 25}" onchange="handleOmrMetaChange()">
                <select id="omr-grade" class="omr-ctrl" onchange="handleOmrGradeChange()">${buildOmrGradeOptions(ui.grade)}</select>
                <select id="omr-class" class="omr-ctrl" onchange="handleOmrClassChange()">${buildOmrClassOptions(ui.classId)}</select>
            </div>

            <div id="omr-sub-controls">
                <select id="omr-history" class="omr-ctrl" style="min-width:220px;" onchange="handleOmrHistoryChange()">${buildOmrHistoryOptions()}</select>
                <input id="omr-archive-file" class="omr-ctrl omr-text" value="${omrEscape(ui.archiveFile || '')}" placeholder="JS아카이브 파일명 선택 입력" onchange="handleOmrMetaChange()">
                <button class="btn" style="height:36px; min-height:36px; padding:0 12px; font-size:12px; font-weight:800; border-radius:9px;" onclick="activateCurrentOmrExam()">현재 시험 다시 불러오기</button>
            </div>

            <div id="omr-guide">
                <span class="omr-guide-item"><b style="color:var(--success);">O</b> 맞음</span>
                <span class="omr-guide-item"><b style="color:var(--error);">X</b> 틀림</span>
                <span class="omr-guide-item">틀린 문제만 눌러 X로 바꾼 뒤 저장</span>
                <span class="omr-guide-item">기존 시험 선택 시 저장된 X 상태 복원</span>
            </div>

            <div id="omr-tbl-wrap">${renderOmrInputTable(students, Number(ui.questionCount) || 25)}</div>

            <div class="omr-footer">
                <div class="omr-footer-info">${omrEscape(footerInfoText)}</div>
                <button class="btn btn-primary omr-save-btn" onclick="saveOmrInputBulk(this)">전체 저장</button>
            </div>
        </div>
    `;
}

function toggleOmrCell(studentId, questionNo) {
    if (!isOmrExamReady()) {
        toast('시험명을 먼저 선택하거나 입력하세요.', 'warn');
        return;
    }

    const set = getOmrWrongSet(studentId);
    const key = String(questionNo);
    set[key] = !set[key];

    const btn = document.getElementById(`omr-cell-${studentId}-${questionNo}`);
    if (btn) {
        btn.classList.toggle('wrong', !!set[key]);
        btn.textContent = set[key] ? 'X' : 'O';
    }

    const students = getOmrVisibleStudents();
    const wrongTotal = students.reduce((sum, s) => sum + Object.keys(getOmrWrongSet(s.id)).filter(k => getOmrWrongSet(s.id)[k]).length, 0);
    const info = document.querySelector('.omr-footer-info');
    if (info) info.textContent = `대상 ${students.length}명 · X ${wrongTotal}개`;
}

async function saveOmrInputBulk(button) {
    updateOmrInputFromControls({ resetAnswers: false });
    const ui = ensureOmrInputState();
    const students = getOmrVisibleStudents();

    if (!ui.examTitle || !ui.examDate) {
        toast('시험명과 시험일을 입력하세요.', 'warn');
        return;
    }
    if (!students.length) {
        toast('저장할 학생이 없습니다.', 'warn');
        return;
    }

    const qCount = Math.max(1, Math.min(80, Number(ui.questionCount) || 25));
    const rows = students.map(s => {
        const wrongSet = getOmrWrongSet(s.id);
        const wrongIds = Object.keys(wrongSet)
            .filter(k => wrongSet[k])
            .map(k => Number(k))
            .filter(n => Number.isFinite(n) && n >= 1 && n <= qCount)
            .sort((a, b) => a - b)
            .map(String);
        return {
            student_id: String(s.id),
            class_id: getOmrClassIdForStudent(s.id),
            wrong_ids: wrongIds
        };
    });

    if (typeof setButtonBusy === 'function') setButtonBusy(button, true, '저장 중');

    try {
        const r = await api.post('exam-sessions/bulk-omr', {
            exam_title: ui.examTitle,
            exam_date: ui.examDate,
            question_count: qCount,
            archive_file: ui.archiveFile || '',
            rows
        });

        if (r?.success) {
            toast(`OMR 입력이 저장되었습니다. (${r.saved || rows.length}명)`, 'success');
            if (typeof refreshDataOnly === 'function') await refreshDataOnly();
            resetOmrAnswerDraft();
            renderOmrInput();
            return;
        }

        toast(r?.message || r?.error || 'OMR 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[saveOmrInputBulk] failed:', e);
        toast('OMR 저장 중 오류가 발생했습니다.', 'error');
    } finally {
        if (typeof setButtonBusy === 'function') setButtonBusy(button, false);
    }
}

function goOmrInputHome() {
    if (typeof leaveTimetableWideMode === 'function') leaveTimetableWideMode();
    if (typeof goHome === 'function') return goHome();
    if (typeof renderDashboard === 'function') return renderDashboard();
}

window.openOmrInput = openOmrInput;
window.renderOmrInput = renderOmrInput;
window.toggleOmrCell = toggleOmrCell;
window.saveOmrInputBulk = saveOmrInputBulk;
window.handleOmrGradeChange = handleOmrGradeChange;
window.handleOmrClassChange = handleOmrClassChange;
window.handleOmrMetaChange = handleOmrMetaChange;
window.handleOmrHistoryChange = handleOmrHistoryChange;
window.activateCurrentOmrExam = activateCurrentOmrExam;
window.goOmrInputHome = goOmrInputHome;
