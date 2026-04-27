/**
 * AP Math OS v26.1.2 [IRONCLAD]
 * QR 3.0 학생용 오답 체크 엔진 (5G: 학생 점수 은닉 및 PIN 보안 방어 강화)
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
    pinVerified: false
};

async function init() {
    const params = new URLSearchParams(window.location.search);
    state.config.classId = params.get('class');
    state.config.exam = params.get('exam'); 
    state.config.q = parseInt(params.get('q')) || 0;
    state.config.date = params.get('date') || new Date().toLocaleDateString('sv-SE');

    if (!state.config.classId || !state.config.exam || state.config.q < 1 || state.config.q > 50) {
        renderError('잘못된 접근이거나 시험 정보(문항 수 1~50)가 유효하지 않습니다.');
        return;
    }

    await refreshData();
    checkPendingSubmit();
}

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

function render() {
    const root = document.getElementById('app-root');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const isDateMismatch = state.config.date !== todayStr;

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
        root.innerHTML = banner + `
            <div class="card" style="text-align:center;">
                <div style="font-size:20px; font-weight:800; margin-bottom:8px;">${state.selectedStudent.name} 학생</div>
                <div style="color:var(--text-sec); margin-bottom:20px;">제출 전 마지막으로 확인하세요.</div>
                
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
        const correctCount = state.config.q - state.wrongIds.length;
        
        root.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <div style="font-size:64px; margin-bottom:20px;">🎉</div>
                <h2 style="margin:0 0 10px 0;">제출 완료!</h2>
                <p style="color:var(--text-sec); margin-bottom:30px;">
                    ${state.selectedStudent.name} 학생의 데이터가<br>선생님께 정상적으로 전달되었습니다.
                </p>
                <div class="card" style="text-align:left;">
                    <div style="font-weight:800; font-size:18px; color:var(--primary); margin-bottom:10px;">정답 ${correctCount}개 / 오답 ${state.wrongIds.length}개</div>
                    <div style="font-size:14px; color:var(--text-sec);">
                        <b>시험:</b> ${state.config.exam}<br>
                        <b>오답 번호:</b> ${state.wrongIds.sort((a,b)=>a-b).join(', ') || '없음'}
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

function toggleWrong(num) {
    if (state.wrongIds.includes(num)) {
        state.wrongIds = state.wrongIds.filter(id => id !== num);
    } else {
        state.wrongIds.push(num);
        if (navigator.vibrate) navigator.vibrate(30);
    }
    render();
}

function selectStudent(sid) {
    state.selectedStudent = state.students.find(s => s.id === sid);
    state.pinVerified = false;
    state.wrongIds = [];
    render();
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function goToStep(s) {
    if (s === 'input' && !state.pinVerified) {
        state.step = 'pin';
    } else {
        state.step = s;
    }
    window.scrollTo(0, 0);
    render();
}

async function submit() {
    if (state.isSubmitting) return;
    
    try {
        const checkRes = await fetch(`${CONFIG.API_BASE}/check-init?class=${state.config.classId}&exam=${encodeURIComponent(state.config.exam)}&date=${state.config.date}`);
        const checkData = await checkRes.json();
        const alreadyDone = (checkData.submitted_sessions || []).some(ss => ss.student_id === state.selectedStudent.id);
        
        if (alreadyDone) {
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

function checkPendingSubmit() {
    const pending = localStorage.getItem(STORAGE_KEYS.PENDING);
    if (!pending) return;

    // 동일 기기 네트워크 실패 복구용
    // (추후 PIN 재검증 추가 고려)
    const { payload, studentName } = JSON.parse(pending);
    
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