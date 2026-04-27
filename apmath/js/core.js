/**
 * AP Math OS v26.1.2 [js/core.js]
 * 핵심 설정 및 데이터 동기화 엔진 (4D: 할 일 메모 및 시험일정 추가)
 */

const CONFIG = {
    R2_URL: 'https://r2.ap-math.com',
    API_BASE: 'https://ap-math-os-v2612.js-pdf.workers.dev/api'
};

const SEED_DATA = {
    classes: [
        { id: 'm1_a', name: '중1A', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_b', name: '중1B', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm1_c', name: '중1C', grade: '중1', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_a', name: '중2A', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm2_b', name: '중2B', grade: '중2', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_a', name: '중3A', grade: '중3', subject: '수학', teacher_name: '박준성' },
        { id: 'm3_b', name: '중3B', grade: '중3', subject: '수학', teacher_name: '박준성' }
    ],
    students: [
        { id: 's01', name: '한세아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's02', name: '홍서령', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's03', name: '김수인', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's04', name: '김다희', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's05', name: '임진후', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's06', name: '황시아', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's07', name: '남지율', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's08', name: '남지우', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's09', name: '최윤아', school_name: '왕의중', grade: '중1', status: '재원' },
        { id: 's10', name: '조희태', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's11', name: '임주현', school_name: '왕운중', grade: '중1', status: '재원' },
        { id: 's12', name: '백주흔', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's13', name: '김도현', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's14', name: '임현성', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's15', name: '박현종', school_name: '왕의중', grade: '중2', status: '재원' },
        { id: 's16', name: '왕유준', school_name: '왕운중', grade: '중2', status: '재원' },
        { id: 's17', name: '강형우', school_name: '동산중', grade: '중2', status: '재원' },
        { id: 's18', name: '이시온', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's19', name: '이상원', school_name: '삼산중', grade: '중3', status: '재원' },
        { id: 's20', name: '조예령', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's21', name: '유채민', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's22', name: '서유나', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's23', name: '박정원', school_name: '매산중', grade: '중3', status: '재원' },
        { id: 's24', name: '이시윤', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's25', name: '강현욱', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's26', name: '남지혁', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's27', name: '유예준', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's28', name: '김지융', school_name: '왕운중', grade: '중3', status: '재원' },
        { id: 's29', name: '박현성', school_name: '왕운중', grade: '중3', status: '재원' }
    ],
    map: [
        { class_id: 'm1_a', student_id: 's01' }, { class_id: 'm1_a', student_id: 's02' }, { class_id: 'm1_a', student_id: 's03' }, { class_id: 'm1_a', student_id: 's04' }, { class_id: 'm1_a', student_id: 's05' },
        { class_id: 'm1_b', student_id: 's06' }, { class_id: 'm1_b', student_id: 's07' }, { class_id: 'm1_b', student_id: 's08' }, { class_id: 'm1_b', student_id: 's09' },
        { class_id: 'm1_c', student_id: 's10' }, { class_id: 'm1_c', student_id: 's11' },
        { class_id: 'm2_a', student_id: 's12' }, { class_id: 'm2_a', student_id: 's13' }, { class_id: 'm2_a', student_id: 's14' }, { class_id: 'm2_a', student_id: 's15' }, { class_id: 'm2_a', student_id: 's16' }, { class_id: 'm2_a', student_id: 's17' },
        { class_id: 'm3_a', student_id: 's18' }, { class_id: 'm3_a', student_id: 's19' }, { class_id: 'm3_a', student_id: 's20' }, { class_id: 'm3_a', student_id: 's21' }, { class_id: 'm3_a', student_id: 's22' },
        { class_id: 'm3_b', student_id: 's23' }, { class_id: 'm3_b', student_id: 's24' }, { class_id: 'm3_b', student_id: 's25' }, { class_id: 'm3_b', student_id: 's26' }, { class_id: 'm3_b', student_id: 's27' }, { class_id: 'm3_b', student_id: 's28' }, { class_id: 'm3_b', student_id: 's29' }
    ]
};

let state = {
    ui: { viewScope: 'teacher', userName: '박준성', currentClassId: null },
    db: { 
        students: [], classes: [], class_students: [], attendance: [], homework: [], 
        exam_sessions: [], wrong_answers: [], attendance_history: [], homework_history: [],
        consultations: [], operation_memos: [], exam_schedules: []
    }
};

let syncQueue = JSON.parse(localStorage.getItem('AP_SYNC_QUEUE') || '[]');

const RISK_LOOKBACK_DAYS = 14;
const RISK_ABSENCE_THRESHOLD = 2;
const RISK_HOMEWORK_THRESHOLD = 3;
const RISK_WRONG_THRESHOLD = 3;
const RISK_MUTE_DAYS = 2;
const RISK_MUTE_KEY = 'APMATH_MUTED_RISKS';

const api = {
    async get(res) {
        try { const r = await fetch(`${CONFIG.API_BASE}/${res}`); return await r.json(); } catch (e) { return {}; }
    },
    async patch(res, d) {
        if (!navigator.onLine) return addToSyncQueue('PATCH', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'PATCH', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json' } });
        return await r.json();
    },
    async delete(res, id) {
        if (!navigator.onLine) return addToSyncQueue('DELETE', `${res}/${id}`, {});
        const r = await fetch(`${CONFIG.API_BASE}/${res}/${id}`, { method: 'DELETE' });
        return await r.json();
    },
    async post(res, d) {
        if (!navigator.onLine) return addToSyncQueue('POST', res, d);
        const r = await fetch(`${CONFIG.API_BASE}/${res}`, { method: 'POST', body: JSON.stringify(d), headers: { 'Content-Type': 'application/json' } });
        return await r.json();
    }
};

async function loadData(isInitial = false) {
    if (isInitial) toast('시스템 초기화 중...', 'info');
    const data = await api.get('initial-data');
    state.db = {
        classes: (data.classes && data.classes.length) ? data.classes : SEED_DATA.classes,
        students: (data.students && data.students.length) ? data.students : SEED_DATA.students,
        class_students: (data.class_students && data.class_students.length) ? data.class_students : SEED_DATA.map,
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        homework: Array.isArray(data.homework) ? data.homework : [],
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [],
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [],
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [],
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
    };
    if (state.ui.currentClassId) renderClass(state.ui.currentClassId);
    else renderDashboard();
}

async function refreshDataOnly() {
    const data = await api.get('initial-data');
    state.db = { 
        ...state.db, 
        attendance: Array.isArray(data.attendance) ? data.attendance : [], 
        homework: Array.isArray(data.homework) ? data.homework : [], 
        exam_sessions: Array.isArray(data.exam_sessions) ? data.exam_sessions : [], 
        wrong_answers: Array.isArray(data.wrong_answers) ? data.wrong_answers : [], 
        attendance_history: Array.isArray(data.attendance_history) ? data.attendance_history : [], 
        homework_history: Array.isArray(data.homework_history) ? data.homework_history : [],
        consultations: Array.isArray(data.consultations) ? data.consultations : [],
        operation_memos: Array.isArray(data.operation_memos) ? data.operation_memos : [],
        exam_schedules: Array.isArray(data.exam_schedules) ? data.exam_schedules : []
    };
}

function addToSyncQueue(method, resource, data) {
    syncQueue.push({ id: Date.now(), method, resource, data });
    localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
    toast('오프라인: 대기열 저장', 'warn');
    return { success: true, offline: true };
}

async function processSyncQueue() {
    if (!navigator.onLine || syncQueue.length === 0) return;
    for (const task of [...syncQueue]) {
        try {
            await fetch(`${CONFIG.API_BASE}/${task.resource}`, { method: task.method, body: JSON.stringify(task.data), headers: { 'Content-Type': 'application/json' } });
            syncQueue = syncQueue.filter(t => t.id !== task.id);
            localStorage.setItem('AP_SYNC_QUEUE', JSON.stringify(syncQueue));
        } catch (e) { break; }
    }
    toast('동기화 완료', 'info'); await loadData();
}

async function goHome() { state.ui.currentClassId = null; await loadData(); }
function toggleScope() { state.ui.viewScope = state.ui.viewScope === 'teacher' ? 'all' : 'teacher'; renderDashboard(); }