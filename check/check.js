/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * QR 3.0 학생용 오답 체크 엔진 (5F: 학생 개인 고유번호 PIN 인증 및 방어 추가)
 */

const CONFIG = {
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

const STORAGE_KEYS = {
    PENDING: 'APMATH_CHECK_PENDING_SUBMIT'
};

let state = {
    step: 'select', // select | pin | input | confirm | done
    config: { classId: '', exam: '', q: 0, date: '' },
    students: [],
    submittedSessions: [],
    className: '',
    selectedStudent: null,
    wrongIds: [], // 숫자로 저장
    isSubmitting: false,
    searchKeyword: '',
    pinVerified: false // [5F] 추가
};

/**
 * 초기화 및 파라미터 검증
 */
async function init() {
    const params = new URLSearchParams(window.location.search);
    state.config.classId = params.get('class');
    state.config.exam = params.get('exam'); // 필수
    state.config.q = parseInt(params.get('q')) || 0;
    state.config.date = params.get('date') || new Date().toLocaleDateString('sv-SE');

    // 1. 필수 파라미터 누락 및 유효성 검사
    if (!state.config.classId || !state.config.exam || state.config.q < 1 || state.config.q > 50) {
        renderError('잘못된 접근이거나 시험 정보(문항 수 1~50)가 유효하지 않습니다.');
        return;
    }

    // 2. 데이터 로드 (check-init)
    await refreshData();

    // 3. 네트워크 실패 백업 확인
    checkPendingSubmit();
}

/**
 * 서버 데이터 갱신 (반 학생 및 오늘 제출 이력)
 */
async function refreshData() {
    try {
        const res = await fetch(`${CONFIG.API_BASE}/check-init?class=${state.config.classId}&exam=${encodeURIComponent(state.config.exam)}&date=${state.config.date}`);
        const data = await res.json();
        
        state.students = data.students || [];
        state.submittedSessions = data.submitted_sessions || [];
        state.className = data.class_name;
        
        render();
    } catch (e) {
        renderError('서버와 연결할 수 없습니다. 인터넷 연결을 확인하세요.');
    }
}

/**
 * 메인 렌더러 (위저드 방식)
 */
function render() {
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const isDateMismatch = state.config.date !== todayStr;

    // 상단 공통 정보 배너
    const banner = `
        <div class="info-banner">
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <b>${state.className}</b> · <b>${state.config.exam}</b><br>
                    ${state.config.q}문항 · ${state.config.date}
                </div>
                ${isDateMismatch ? '<span class="warning-text">날짜 불일치</span>' : ''}
            </div>
            ${isDateMismatch ? '<div style="font-size:11px; margin-top:5px; opacity:0.8;">※ 이 QR은 오늘 날짜와 다릅니다. 선생님께 확인하세요.</div>' : ''}
        </div>
    `;

    if (state.step === 'select') {
        const filtered = state.students.filter(s => s.name.includes(state.searchKeyword));
        const list = filtered.map(s => {
            const isDone = state.submittedSessions.some(ss => ss.student_id === s.id);
            const isSelected = state.selectedStudent?.id === s.id;
            return `
                <div class="student-btn ${isDone ? 'done' : ''} ${isSelected ? 'selected' : ''}" 
                     onclick="${isDone ? `showToast('이미 제출된 시험입니다.')` : `selectStudent('${s.id}')`}">
                    ${isDone ? '<span class="badge-done">제출완료</span>' : ''}
                    ${s.name}
                    <span class="school-tag">${s.school_name.slice(0, 4)}</span>
                </div>
            `;
        }).join('');

        root.innerHTML = banner + `
            <input type="text" class="search-input" placeholder="이름 검색..." value="${state.searchKeyword}" oninput="state.searchKeyword=this.value; render();">
            <h3 style="margin: 8px 0 16px 0;">본인 이름을 선택하세요</h3>
            <div class="student-grid">${list || '<p style="grid-column:span 2; text-align:center; opacity:0.5;">학생이 없습니다.</p>'}</div>
            
            <div class="bottom-bar ${!state.selectedStudent ? 'hidden' : ''}">
                <div style="text-align:center; margin-bottom:10px; font-weight:800; font-size:18px; color:var(--primary);">
                    ${state.selectedStudent?.name} 학생이 맞습니까?
                </div>
                <button class="btn-main" onclick="goToStep('pin')">예, 맞습니다</button>
            </div>
        `;
    } 
    // [5F] 학생 PIN 검증 단계
    else if (state.step === 'pin') {
        root.innerHTML = banner + `
            <div class="card" style="text-align:center; padding:30px 20px;">
                <h3 style="color:var(--primary); margin-bottom:8px;">고유 번호 확인</h3>
                <p style="color:var(--secondary); font-size:13px; margin-bottom:24px;">본인의 4자리 번호를 입력하세요</p>
                <input id="pin-input" type="number" maxlength="4" placeholder="••••" inputmode="numeric"
                    style="font-size:32px; text-align:center; width:160px; letter-spacing:12px; border:2px solid var(--border); border-radius:12px; padding:16px; outline:none;"
                    oninput="if(this.value.length>4)this.value=this.value.slice(0,4)">
                <div id="pin-error" style="color:var(--error); font-size:13px; margin-top:12px; min-height:18px; font-weight:600;"></div>
            </div>
            <div class="bottom-bar" style="display:flex; gap:10px;">
                <button class="btn-sub" style="flex:1;" onclick="state.pinVerified=false; state.wrongIds=[]; state.step='select'; render();">이름 다시 선택</button>
                <button class="btn-main" style="flex:2;" onclick="verifyPin()">확인</button>
            </div>
        `;
    }
    else if (state.step === 'input') {
        const omr = Array.from({ length: state.config.q }, (_, i) => {
            const num = i + 1;
            return `<div class="omr-btn ${state.wrongIds.includes(num) ? 'active' : ''}" onclick="toggleWrong(${num})">${num}</div>`;
        }).join('');

        root.innerHTML = banner + `
            <div class="card" style="padding-bottom:100px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                    <h3 style="margin:0;">틀린 번호 체크</h3>
                    <div style="color:var(--error); font-weight:800;">오답 ${state.wrongIds.length}개</div>
                </div>
                <div class="omr-grid">${omr}</div>
                <button class="btn-sub" style="width:100%; margin-top:10px;" onclick="state.wrongIds=[]; render();">체크 모두 해제</button>
            </div>
            <div class="bottom-bar">
                <button class="btn-main" style="background:var(--success);" onclick="state.wrongIds=[]; goToStep('confirm');">모두 맞음 (100점)</button>
                <button class="btn-main" onclick="goToStep('confirm')" ${state.wrongIds.length === 0 ? 'style="display:none;"' : ''}>오답 ${state.wrongIds.length}개 제출</button>
                <button class="btn-sub" onclick="state.pinVerified=false; state.wrongIds=[]; state.step='select'; render();">이름 다시 선택</button>
            </div>
        `;
    }
    else if (state.step === 'confirm') {
        const score = Math.round(((state.config.q - state.wrongIds.length) / state.config.q) * 100);
        root.innerHTML = banner + `
            <div class="card" style="text-align:center;">
                <div style="font-size:20px; font-weight:800; margin-bottom:8px;">${state.selectedStudent.name} 학생</div>
                <div style="color:var(--text-sec); margin-bottom:20px;">제출 전 마지막으로 확인하세요.</div>
                <div style="font-size:48px; font-weight:900; color:var(--primary); margin-bottom:16px;">${score}점</div>
                <div style="background:var(--bg); padding:16px; border-radius:12px; text-align:left; font-size:14px;">
                    <b>오답 수:</b> ${state.wrongIds.length}개<br>
                    <b>오답 번호:</b> ${state.wrongIds.sort((a,b)=>a-b).join(', ') || '없음 (다 맞음)'}
                </div>
            </div>
            <div class="bottom-bar">
                <button class="btn-main" id="submit-btn" onclick="submit()" ${state.isSubmitting ? 'disabled' : ''}>
                    ${state.isSubmitting ? '제출 중...' : '확인했습니다. 제출합니다'}
                </button>
                <button class="btn-sub" onclick="goToStep('input')">수정하기</button>
            </div>
        `;
    }
    else if (state.step === 'done') {
        const score = Math.round(((state.config.q - state.wrongIds.length) / state.config.q) * 100);
        root.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:64px; margin-bottom:20px;">🎉</div>
                <h2 style="margin:0 0 10px 0;">제출 완료!</h2>
                <p style="color:var(--text-sec); margin-bottom:30px;">
                    ${state.selectedStudent.name} 학생의 데이터가<br>선생님께 정상적으로 전달되었습니다.
                </p>
                <div class="card" style="text-align:left;">
                    <div style="font-weight:800; font-size:18px; color:var(--primary); margin-bottom:10px;">${score}점</div>
                    <div style="font-size:14px; color:var(--text-sec);">
                        <b>시험:</b> ${state.config.exam}<br>
                        <b>오답:</b> ${state.wrongIds.sort((a,b)=>a-b).join(', ') || '없음'}
                    </div>
                </div>
                <button class="btn-main" onclick="location.reload()">처음으로 돌아가기</button>
                <p id="timer" style="font-size:12px; margin-top:20px; color:var(--text-sec); opacity:0.6;">
                    10초 후 자동으로 초기화됩니다.
                </p>
            </div>
        `;
        startAutoReset();
    }
}

/**
 * [5F] 서버에 PIN 검증 요청
 */
async function verifyPin() {
    const input = document.getElementById('pin-input').value;
    if (input.length !== 4) {
        document.getElementById('pin-error').innerText = '4자리 숫자를 입력하세요.';
        return;
    }
    try {
        const res = await fetch(`${CONFIG.API_BASE}/check-pin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ student_id: state.selectedStudent.id, pin: input })
        });
        const data = await res.json();
        if (res.ok && data.success) {
            state.pinVerified = true;
            goToStep('input');
        } else {
            document.getElementById('pin-error').innerText = data.message || '번호가 맞지 않습니다.';
        }
    } catch (err) {
        document.getElementById('pin-error').innerText = '네트워크 오류가 발생했습니다.';
    }
}

/**
 * 오답 번호 토글
 */
function toggleWrong(num) {
    if (state.wrongIds.includes(num)) {
        state.wrongIds = state.wrongIds.filter(id => id !== num);
    } else {
        state.wrongIds.push(num);
        if (navigator.vibrate) navigator.vibrate(30);
    }
    render();
}

/**
 * 학생 선택
 */
function selectStudent(sid) {
    state.selectedStudent = state.students.find(s => s.id === sid);
    state.pinVerified = false; // [5F 보완] 학생 변경 시 PIN 상태 초기화
    state.wrongIds = [];       // [5F 보완] 학생 변경 시 오답 초기화
    render();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

/**
 * 단계 이동
 */
function goToStep(s) {
    // [5F 보완] 비정상적인 단계 이동 방어 (PIN 미인증 시 입력화면 진입 불가)
    if (s === 'input' && !state.pinVerified) {
        state.step = 'pin';
    } else {
        state.step = s;
    }
    window.scrollTo(0, 0);
    render();
}

/**
 * 최종 제출 로직 (안전 장치 및 중복 보정 반영)
 */
async function submit() {
    if (state.isSubmitting) return;
    
    // 1. 제출 전 최신 데이터로 중복 제출 최종 확인 (보정 반영)
    try {
        const checkRes = await fetch(`${CONFIG.API_BASE}/check-init?class=${state.config.classId}&exam=${encodeURIComponent(state.config.exam)}&date=${state.config.date}`);
        const checkData = await checkRes.json();
        const alreadyDone = (checkData.submitted_sessions || []).some(ss => ss.student_id === state.selectedStudent.id);
        
        if (alreadyDone) {
            // 보정: 이미 제출된 경우 localStorage 백업도 즉시 삭제하여 무한 루프 방지
            localStorage.removeItem(STORAGE_KEYS.PENDING);
            alert('이미 제출이 완료된 시험입니다. 임시 보관 데이터는 삭제했습니다.');
            location.reload();
            return;
        }
    } catch (e) {
        console.warn('중복 체크 실패, 진행 시도');
    }

    state.isSubmitting = true;
    render();

    // 2. 오답 번호 최종 유효성 검증 (1 ~ q 사이인지)
    const validWrongs = state.wrongIds.filter(id => id >= 1 && id <= state.config.q);
    const score = Math.round(((state.config.q - validWrongs.length) / state.config.q) * 100);

    const payload = {
        student_id: state.selectedStudent.id,
        exam_title: state.config.exam,
        score: score,
        wrong_ids: validWrongs.map(String),
        exam_date: state.config.date,
        question_count: state.config.q,
        class_id: state.config.classId
    };

    try {
        const res = await fetch(`${CONFIG.API_BASE}/exam-sessions/new`, {
            method: 'PATCH',
            body: JSON.stringify(payload),
            headers: { 'Content-Type': 'application/json' }
        });

        if (res.ok) {
            localStorage.removeItem(STORAGE_KEYS.PENDING);
            state.step = 'done';
            render();
        } else {
            throw new Error('Server Error');
        }
    } catch (e) {
        // 네트워크 실패 시 백업 저장
        localStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify({
            payload,
            timestamp: Date.now(),
            studentName: state.selectedStudent.name
        }));
        showToast('네트워크 오류! 제출 데이터가 기기에 임시 보관되었습니다.');
        state.isSubmitting = false;
        render();
    }
}

/**
 * 임시 백업 확인 및 복구
 */
function checkPendingSubmit() {
    const pending = localStorage.getItem(STORAGE_KEYS.PENDING);
    if (!pending) return;

    // [5F 보완] 동일 기기 네트워크 실패 복구용
    // (보안 강화를 원하면 추후 PIN 재검증으로 이동)
    const { payload, studentName } = JSON.parse(pending);
    
    // 현재 접속한 QR 정보와 백업 정보가 일치할 때만 복구 안내
    if (payload.exam_title === state.config.exam && payload.exam_date === state.config.date) {
        if (confirm(`${studentName} 학생의 보내지 못한 데이터가 있습니다. 지금 다시 제출할까요?`)) {
            state.selectedStudent = state.students.find(s => s.id === payload.student_id);
            state.wrongIds = payload.wrong_ids.map(Number);
            if (state.selectedStudent) {
                submit();
            }
        } else {
            if (confirm('임시 보관된 데이터를 삭제하시겠습니까?')) {
                localStorage.removeItem(STORAGE_KEYS.PENDING);
            }
        }
    }
}

/**
 * 자동 초기화 타이머
 */
function startAutoReset() {
    let count = 10;
    const itv = setInterval(() => {
        count--;
        const el = document.getElementById('timer');
        if (el) el.innerText = `${count}초 후 자동으로 초기화됩니다.`;
        if (count <= 0) {
            clearInterval(itv);
            location.reload();
        }
    }, 1000);
}

/**
 * 유틸리티
 */
function showToast(m) {
    const t = document.getElementById('toast');
    t.innerText = m;
    t.style.opacity = '1';
    setTimeout(() => t.style.opacity = '0', 2500);
}

function renderError(m) {
    document.getElementById('app-root').innerHTML = `
        <div class="card" style="margin-top: 50px; text-align: center; border-color: var(--error);">
            <div style="font-size: 40px; margin-bottom: 20px;">⚠️</div>
            <div style="color: var(--error); font-weight: 800; font-size: 18px;">접근 제한</div>
            <p style="color: var(--text-sec); margin-top: 10px;">${m}</p>
            <button class="btn-main" style="margin-top: 20px;" onclick="location.reload()">새로고침</button>
        </div>
    `;
}

window.onload = init;