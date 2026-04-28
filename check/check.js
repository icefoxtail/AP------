/**
 * AP Math OS 1.0 [js/check.js]
 * QR 3.0 학생용 오답 체크 엔진
 * [IRONCLAD 5G]: Master Level UI/UX (상태 기반 렌더링, 햅틱 피드백, 플로팅 바텀 바 연동)
 * [Final Polish]: 버튼 style 중복 제거, 이모지 박멸, 테마 컬러 동기화
 */

const CONFIG = {
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

const STORAGE_KEYS = {
    PENDING: 'APMATH_CHECK_PENDING_SUBMIT'
};

let state = {
    step: 'select', // select | pin | input | confirm | done
    config: { classId: '', exam: '', q: 0, date: '', archiveFile: '' },
    students: [],
    submittedSessions: [],
    className: '',
    selectedStudent: null,
    wrongIds: [], // 숫자로 저장
    isSubmitting: false,
    searchKeyword: '',
    pinVerified: false
};

// [3B1] check-init URL 생성 헬퍼
function buildCheckInitUrl() {
    return `${CONFIG.API_BASE}/check-init`
        + `?class=${encodeURIComponent(state.config.classId)}`
        + `&exam=${encodeURIComponent(state.config.exam)}`
        + `&date=${encodeURIComponent(state.config.date)}`
        + `&q=${encodeURIComponent(state.config.q)}`
        + `&archiveFile=${encodeURIComponent(state.config.archiveFile || '')}`;
}

async function init() {
    const params = new URLSearchParams(window.location.search);
    state.config.classId = params.get('class');
    state.config.exam = params.get('exam'); 
    state.config.q = parseInt(params.get('q')) || 0;
    state.config.date = params.get('date') || new Date().toLocaleDateString('sv-SE');
    state.config.archiveFile = params.get('archiveFile') || '';

    if (!state.config.classId || !state.config.exam || state.config.q < 1 || state.config.q > 50) {
        renderError('잘못된 접근이거나 시험 정보(문항 수 1~50)가 유효하지 않습니다.');
        return;
    }

    await refreshData();
    checkPendingSubmit();
}

async function refreshData() {
    try {
        const res = await fetch(buildCheckInitUrl());
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
                    <b style="font-size:15px;">${state.className}</b> · <b style="font-size:15px;">${state.config.exam}</b><br>
                    <span style="opacity:0.9; margin-top:4px; display:inline-block;">${state.config.q}문항 · ${state.config.date}</span>
                </div>
                ${isDateMismatch ? '<span class="warning-text">날짜 불일치</span>' : ''}
            </div>
            ${isDateMismatch ? '<div style="font-size:11px; margin-top:8px; opacity:0.7; font-weight:600;">※ 오늘 날짜의 시험이 아닙니다. 담당 선생님께 확인하세요.</div>' : ''}
        </div>
    `;

    if (state.step === 'select') {
        const filtered = state.students.filter(s => s.name.includes(state.searchKeyword));
        const list = filtered.map(s => {
            const isDone = state.submittedSessions.some(ss => ss.student_id === s.id);
            const isSelected = state.selectedStudent?.id === s.id;
            return `
                <div class="student-btn ${isDone ? 'done' : ''} ${isSelected ? 'selected' : ''}" 
                     onclick="${isDone ? `showToast('이미 제출이 완료된 학생입니다.')` : `selectStudent('${s.id}')`}">
                    ${isDone ? '<span class="badge-done">제출완료</span>' : ''}
                    ${s.name}
                    <span class="school-tag">${s.school_name.slice(0, 5)}</span>
                </div>
            `;
        }).join('');

        root.innerHTML = banner + `
            <input type="text" class="search-input" placeholder="이름을 검색하세요" value="${state.searchKeyword}" oninput="state.searchKeyword=this.value; render();">
            <h3 style="margin: 20px 0 16px 0; font-size:16px; font-weight:900; color:var(--text);">본인 이름을 선택하세요</h3>
            <div class="student-grid">${list || '<p style="grid-column:span 2; text-align:center; opacity:0.5; font-size:14px; padding:20px;">해당하는 학생이 없습니다.</p>'}</div>
            
            <div class="bottom-bar ${!state.selectedStudent ? 'hidden' : ''}">
                <div style="text-align:center; margin-bottom:12px; font-weight:900; font-size:18px; color:var(--primary);">
                    ${state.selectedStudent?.name} 학생이 맞습니까?
                </div>
                <button class="btn-main" onclick="goToStep('pin')">예, 맞습니다</button>
            </div>
        `;
    } 
    else if (state.step === 'pin') {
        root.innerHTML = banner + `
            <div class="card" style="text-align:center; padding:40px 20px;">
                <h3 style="color:var(--primary); font-size:18px; font-weight:900; margin-bottom:8px;">고유 번호(PIN) 확인</h3>
                <p style="color:var(--text-sec); font-size:13px; font-weight:600; margin-bottom:28px;">본인의 4자리 번호를 입력하세요</p>
                <input id="pin-input" type="number" maxlength="4" placeholder="••••" inputmode="numeric"
                    style="font-size:32px; font-weight:900; color:var(--text); text-align:center; width:160px; letter-spacing:14px; border:2px solid var(--border); background:var(--bg); border-radius:16px; padding:16px; outline:none; transition:all 0.2s;"
                    onfocus="this.style.borderColor='var(--primary)'; this.style.background='#fff';"
                    onblur="this.style.borderColor='var(--border)'; this.style.background='var(--bg)';"
                    oninput="if(this.value.length>4)this.value=this.value.slice(0,4)">
                <div id="pin-error" style="color:var(--error); font-size:13px; margin-top:16px; min-height:20px; font-weight:700;"></div>
            </div>
            <div class="bottom-bar" style="display:flex; gap:8px;">
                <button class="btn-sub" style="flex:1;" onclick="state.pinVerified=false; state.wrongIds=[]; state.step='select'; render();">처음으로</button>
                <button class="btn-main" style="flex:2.5; margin:0;" onclick="verifyPin()">PIN 확인</button>
            </div>
        `;
    }
    else if (state.step === 'input') {
        const omr = Array.from({ length: state.config.q }, (_, i) => {
            const num = i + 1;
            return `<div class="omr-btn ${state.wrongIds.includes(num) ? 'active' : ''}" onclick="toggleWrong(${num})">${num}</div>`;
        }).join('');

        // style 중복 제거 적용
        const btnAllCorrectStyle = `background:var(--success); margin-bottom:8px; ${state.wrongIds.length !== 0 ? 'display:none;' : ''}`;
        const btnSubmitWrongsStyle = `margin-bottom:8px; ${state.wrongIds.length === 0 ? 'display:none;' : ''}`;

        root.innerHTML = banner + `
            <div class="card" style="padding-bottom:24px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                    <h3 style="margin:0; font-size:16px; font-weight:900;">틀린 번호 체크</h3>
                    <div style="color:var(--error); font-weight:900; background:rgba(255,71,87,0.1); padding:4px 10px; border-radius:8px; font-size:13px;">오답 ${state.wrongIds.length}개</div>
                </div>
                <div class="omr-grid">${omr}</div>
                <button class="btn-sub" style="width:100%; margin-top:24px; background:var(--bg);" onclick="state.wrongIds=[]; render();">선택 모두 해제</button>
            </div>
            <div class="bottom-bar">
                <button class="btn-main" style="${btnAllCorrectStyle}" onclick="state.wrongIds=[]; goToStep('confirm');">모두 맞음 (100점) 제출</button>
                <button class="btn-main" style="${btnSubmitWrongsStyle}" onclick="goToStep('confirm')">오답 ${state.wrongIds.length}개 제출하기</button>
                <button class="btn-sub" style="margin:0;" onclick="state.pinVerified=false; state.wrongIds=[]; state.step='select'; render();">처음으로</button>
            </div>
        `;
    }
    else if (state.step === 'confirm') {
        root.innerHTML = banner + `
            <div class="card" style="text-align:center; padding:32px 20px;">
                <div style="font-size:22px; font-weight:950; margin-bottom:10px; color:var(--text);">${state.selectedStudent.name} 학생</div>
                <div style="color:var(--text-sec); font-size:14px; font-weight:600; margin-bottom:24px;">제출 전 마지막으로 확인해 주세요.</div>
                
                <div style="background:var(--bg); padding:20px; border-radius:16px; text-align:left; font-size:15px; line-height:1.7;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <b style="color:var(--text-sec);">오답 개수</b>
                        <b style="color:var(--error); font-size:16px;">${state.wrongIds.length}개</b>
                    </div>
                    <hr style="border:0; border-top:1px dashed var(--border); margin:12px 0;">
                    <b style="color:var(--text-sec); display:block; margin-bottom:6px;">오답 번호</b>
                    <div style="font-weight:900; color:var(--text); word-break:keep-all;">
                        ${state.wrongIds.sort((a,b)=>a-b).join(', ') || '<span style="color:var(--success);">없음 (100점)</span>'}
                    </div>
                </div>
            </div>
            <div class="bottom-bar" style="display:flex; gap:8px;">
                <button class="btn-sub" style="flex:1; margin:0;" onclick="goToStep('input')">수정하기</button>
                <button class="btn-main" id="submit-btn" style="flex:2; margin:0;" onclick="submit()" ${state.isSubmitting ? 'disabled' : ''}>
                    ${state.isSubmitting ? '제출 중...' : '확인, 제출합니다'}
                </button>
            </div>
        `;
    }
    else if (state.step === 'done') {
        const correctCount = state.config.q - state.wrongIds.length;
        
        root.innerHTML = `
            <div style="text-align:center; padding:40px 20px;">
                <h2 style="margin:0 0 12px 0; font-size:26px; font-weight:950; color:var(--primary);">제출 완료</h2>
                <p style="color:var(--text-sec); font-size:15px; font-weight:600; margin-bottom:32px; line-height:1.5;">
                    <b style="color:var(--primary);">${state.selectedStudent.name}</b> 학생의 데이터가<br>선생님께 정상적으로 전달되었습니다.
                </p>
                <div class="card" style="text-align:left; padding:24px; background:#fff;">
                    <div style="font-weight:900; font-size:16px; color:var(--primary); margin-bottom:12px; padding-bottom:12px; border-bottom:1px solid var(--border);">
                        정답 ${correctCount}개 / 오답 ${state.wrongIds.length}개
                    </div>
                    <div style="font-size:14px; color:var(--text-sec); line-height:1.6;">
                        <b style="color:var(--text);">시험명:</b> ${state.config.exam}<br>
                        <b style="color:var(--text);">오답 번호:</b> ${state.wrongIds.sort((a,b)=>a-b).join(', ') || '없음'}
                    </div>
                </div>
                <button class="btn-main" onclick="location.reload()" style="margin-top:16px;">처음으로 돌아가기</button>
                <p id="timer" style="font-size:13px; font-weight:600; margin-top:24px; color:var(--text-sec); opacity:0.7;">
                    10초 후 자동으로 초기화됩니다.
                </p>
            </div>
        `;
        startAutoReset();
    }
}

async function verifyPin() {
    const input = document.getElementById('pin-input').value;
    const errorEl = document.getElementById('pin-error');
    if (input.length !== 4) {
        errorEl.innerText = '4자리 숫자를 정확히 입력하세요.';
        return;
    }
    
    errorEl.innerText = '확인 중...';
    errorEl.style.color = 'var(--primary)';

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
            errorEl.style.color = 'var(--error)';
            errorEl.innerText = data.message || '번호가 맞지 않습니다. 다시 확인해주세요.';
        }
    } catch (err) {
        errorEl.style.color = 'var(--error)';
        errorEl.innerText = '네트워크 오류가 발생했습니다.';
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
    setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 50);
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
        const checkRes = await fetch(buildCheckInitUrl());
        const checkData = await checkRes.json();
        const alreadyDone = (checkData.submitted_sessions || []).some(ss => ss.student_id === state.selectedStudent.id);
        
        if (alreadyDone) {
            localStorage.removeItem(STORAGE_KEYS.PENDING);
            alert('이미 제출이 완료된 시험입니다. 임시 보관 데이터는 삭제했습니다.');
            location.reload();
            return;
        }
    } catch (e) {
        console.warn('중복 제출 확인 실패, 제출 진행 시도');
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
        class_id: state.config.classId,
        archive_file: state.config.archiveFile || ''
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
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        } else {
            throw new Error('Server Error');
        }
    } catch (e) {
        localStorage.setItem(STORAGE_KEYS.PENDING, JSON.stringify({
            payload,
            timestamp: Date.now(),
            studentName: state.selectedStudent.name
        }));
        showToast('네트워크 오류! 제출 데이터가 기기에 안전하게 보관되었습니다.');
        state.isSubmitting = false;
        render();
    }
}

function checkPendingSubmit() {
    const pending = localStorage.getItem(STORAGE_KEYS.PENDING);
    if (!pending) return;

    const { payload, studentName } = JSON.parse(pending);
    
    if (payload.exam_title === state.config.exam && payload.exam_date === state.config.date) {
        if (confirm(`[네트워크 복구]\n${studentName} 학생의 전송 실패 데이터가 있습니다. 지금 다시 제출할까요?`)) {
            state.selectedStudent = state.students.find(s => s.id === payload.student_id);
            state.wrongIds = payload.wrong_ids.map(Number);
            if (state.selectedStudent) {
                submit();
            }
        } else {
            if (confirm('임시 보관된 데이터를 완전히 삭제하시겠습니까?')) {
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
    if (!t) return;
    t.innerText = m;
    t.style.opacity = '1';
    t.style.transform = 'translateY(0) translateX(-50%)';
    setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(20px) translateX(-50%)';
    }, 2500);
}

function renderError(m) {
    document.getElementById('app-root').innerHTML = `
        <div class="card" style="margin-top: 60px; text-align: center; border: 1px solid var(--error); box-shadow: 0 8px 32px rgba(220,38,38,0.1);">
            <div style="color: var(--error); font-weight: 900; font-size: 24px; letter-spacing: -0.5px; margin-bottom: 12px;">접근 제한</div>
            <p style="color: var(--text-sec); font-weight: 600; line-height: 1.5; margin: 0;">${m}</p>
            <button class="btn-main" style="margin-top: 32px;" onclick="location.reload()">새로고침</button>
        </div>
    `;
}

window.onload = init;