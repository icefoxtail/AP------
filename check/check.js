const CONFIG = { API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api' };

const params = new URLSearchParams(location.search);
const examTitle = params.get('exam') || '오답 체크';
const qCount = parseInt(params.get('q')) || 20;
const today = new Date().toISOString().slice(0, 10);

let db = { students: [], classes: [], class_students: [] };
let wrongSet = new Set();

document.getElementById('exam-title').textContent = examTitle;
document.getElementById('exam-meta').textContent = `총 ${qCount}문항 · ${today}`;

async function init() {
    const r = await fetch(`${CONFIG.API_BASE}/initial-data`);
    const data = await r.json();
    db.students = data.students || [];
    db.classes = data.classes || [];
    db.class_students = data.class_students || [];
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
        opt.textContent = s.name;
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

async function handleSubmit() {
    const studentId = document.getElementById('student-select').value;
    if (!studentId) { showToast('학생을 선택해주세요'); return; }

    const wrongIds = Array.from(wrongSet);
    const score = Math.round(((qCount - wrongIds.length) / qCount) * 100);

    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = '저장 중...';

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
            document.getElementById('step-select').classList.add('hidden');
            document.getElementById('step-omr').classList.add('hidden');
            btn.classList.add('hidden');
            document.getElementById('done-score').textContent = score;
            document.getElementById('done-wrong').textContent = wrongIds.length > 0
                ? `오답: ${wrongIds.map(q => q + '번').join(', ')}`
                : '오답 없음 🎉';
            document.getElementById('step-done').classList.remove('hidden');
        } else {
            showToast('저장 실패. 다시 시도해주세요');
            btn.disabled = false;
            btn.textContent = '제출하기';
        }
    } catch (e) {
        showToast('네트워크 오류');
        btn.disabled = false;
        btn.textContent = '제출하기';
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