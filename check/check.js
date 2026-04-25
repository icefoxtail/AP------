const CONFIG = { API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api' };

const params = new URLSearchParams(location.search);
const examTitle = params.get('exam') || '오답 체크';

// 보강: qCount 안전 제한 (최소 1, 최대 50, 기본값 20)
const rawQ = parseInt(params.get('q'), 10);
const qCount = Number.isFinite(rawQ) ? Math.min(Math.max(rawQ, 1), 50) : 20;

const today = new Date().toISOString().slice(0, 10);

let db = { students: [], classes: [], class_students: [], exam_sessions: [] };
let wrongSet = new Set();

document.getElementById('exam-title').textContent = examTitle;
document.getElementById('exam-meta').textContent = `총 ${qCount}문항 · ${today}`;

async function init() {
    const r = await fetch(`${CONFIG.API_BASE}/initial-data`);
    const data = await r.json();
    db.students = data.students || [];
    db.classes = data.classes || [];
    db.class_students = data.class_students || [];
    db.exam_sessions = data.exam_sessions || [];
    renderClassSelect();
    renderQGrid();
}

function renderClassSelect() {
    const sel = document.getElementById('class-select');
    db.classes.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name;
        sel.appendChild(opt);
    });
}

function onClassChange() {
    const cid = document.getElementById('class-select').value;
    const sel = document.getElementById('student-select');
    sel.innerHTML = '<option value="">학생을 선택하세요</option>';
    if (!cid) { sel.disabled = true; return; }

    const sids = db.class_students.filter(m => m.class_id === cid).map(m => m.student_id);
    const stds = db.students.filter(s => sids.includes(s.id) && s.status === '재원');
    stds.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = `${s.name} · ${s.school_name || ''} · ${s.grade || ''}`;
        sel.appendChild(opt);
    });
    sel.disabled = false;
    sel.onchange = () => {
        const show = !!sel.value;
        document.getElementById('step-omr').classList.toggle('hidden', !show);
        document.getElementById('submit-btn').classList.toggle('hidden', !show);
    };
}

function renderQGrid() {
    const grid = document.getElementById('q-grid');
    grid.innerHTML = '';
    for (let i = 1; i <= qCount; i++) {
        const btn = document.createElement('button');
        btn.className = 'q-btn';
        btn.textContent = i;
        btn.dataset.q = i;
        btn.onclick = () => {
            const q = String(i);
            if (wrongSet.has(q)) { wrongSet.delete(q); btn.classList.remove('wrong'); }
            else { wrongSet.add(q); btn.classList.add('wrong'); }
        };
        grid.appendChild(btn);
    }
}

function handleSubmit() {
    const studentId = document.getElementById('student-select').value;
    const studentText = document.getElementById('student-select').selectedOptions[0]?.textContent || '';
    if (!studentId) { showToast('학생을 선택해주세요'); return; }

    const wrongIds = Array.from(wrongSet).sort((a, b) => parseInt(a) - parseInt(b));
    const score = Math.round(((qCount - wrongIds.length) / qCount) * 100);

    document.getElementById('confirm-name').textContent = studentText;
    document.getElementById('confirm-exam').textContent = examTitle;
    document.getElementById('confirm-total').textContent = `${qCount}문항`;
    document.getElementById('confirm-wrong').textContent = wrongIds.length > 0 ? wrongIds.map(q => q + '번').join(', ') : '없음';
    document.getElementById('confirm-score').textContent = `${score}점`;

    // 보강: 중복 제출 경고 기준 (student_id + exam_title 만 포함)
    const isDuplicate = db.exam_sessions.some(
        es => es.student_id === studentId && es.exam_title === examTitle
    );
    const warnEl = document.getElementById('confirm-warn');
    if (isDuplicate) {
        warnEl.textContent = '이미 같은 시험명으로 제출한 기록이 있습니다. 다시 제출하면 새 기록으로 추가됩니다.';
        warnEl.classList.remove('hidden');
    } else {
        warnEl.classList.add('hidden');
    }

    document.getElementById('step-select').classList.add('hidden');
    document.getElementById('step-omr').classList.add('hidden');
    document.getElementById('submit-btn').classList.add('hidden');
    document.getElementById('step-confirm').classList.remove('hidden');
}

function handleBackToEdit() {
    document.getElementById('step-confirm').classList.add('hidden');
    document.getElementById('step-select').classList.remove('hidden');
    
    // 보강: 뒤로가기 시 학생 미선택 상태 방어
    const hasStudent = !!document.getElementById('student-select').value;
    document.getElementById('step-omr').classList.toggle('hidden', !hasStudent);
    document.getElementById('submit-btn').classList.toggle('hidden', !hasStudent);
}

async function handleFinalSubmit() {
    const studentId = document.getElementById('student-select').value;
    const wrongIds = Array.from(wrongSet).sort((a, b) => parseInt(a) - parseInt(b));
    const score = Math.round(((qCount - wrongIds.length) / qCount) * 100);

    const finalBtn = document.querySelector('#step-confirm .action-btn.primary');
    finalBtn.disabled = true;
    finalBtn.textContent = '저장 중...';

    try {
        const r = await fetch(`${CONFIG.API_BASE}/exam-sessions/new`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                student_id: studentId,
                exam_title: examTitle,
                score,
                wrong_ids: wrongIds,
                exam_date: today
            })
        });
        const data = await r.json();
        if (data.success) {
            document.getElementById('step-confirm').classList.add('hidden');
            document.getElementById('done-score').textContent = score;
            document.getElementById('done-wrong').textContent = wrongIds.length > 0
                ? `오답: ${wrongIds.map(q => q + '번').join(', ')}`
                : '오답 없음 🎉';
            document.getElementById('step-done').classList.remove('hidden');
        } else {
            showToast('저장 실패. 다시 시도해주세요');
            finalBtn.disabled = false;
            finalBtn.textContent = '최종 제출';
        }
    } catch (e) {
        showToast('네트워크 오류');
        finalBtn.disabled = false;
        finalBtn.textContent = '최종 제출';
    }
}

function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2500);
}

init();