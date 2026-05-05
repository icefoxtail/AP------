/**
 * AP Math OS 1.0 [js/classroom.js]
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진
 * [Minimalism Polish]: 52px 카드 높이 통일, 아이콘 제거, 오늘 현황 레이아웃 분리
 * [Standard UI]: font-weight 700 상한선 준수, 영문 한글화 및 테이블 4열 수직 완벽 정렬
 * [Update]: 넓이 850px 고정, 닫기버튼 삭제 및 현황 배지 인라인 통합, 테이블 글자 +1px
 */

// ── 필수 유틸리티 (중복 선언 방어) ──────────────────────────────────
if (typeof apEscapeHtml !== 'function') {
    window.apEscapeHtml = function(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
}

// [UI Standard]: 클래스룸 전용 스타일 주입
function injectClassroomStyles() {
    if (document.getElementById('classroom-style')) return;
    const style = document.createElement('style');
    style.id = 'classroom-style';
    style.textContent = `
        .cls-fade-in { animation: clsFadeIn 0.25s ease-out; }
        @keyframes clsFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .cls-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 600; line-height: 1.4; }
    `;
    document.head.appendChild(style);
}

function formatClassScheduleDays(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

// [Master Review Patch] 공휴일 판별 (재선언 없이 기존 전역 변수 참조)
function isClassroomHoliday(dateStr) {
    if (typeof DASH_HOLIDAYS !== 'undefined' && Array.isArray(DASH_HOLIDAYS)) {
        if (DASH_HOLIDAYS.includes(dateStr)) return true;
    }
    if (typeof HOLIDAYS_2026 !== 'undefined' && Array.isArray(HOLIDAYS_2026)) {
        if (HOLIDAYS_2026.includes(dateStr)) return true;
    }
    if (state.db.academy_schedules) {
        return state.db.academy_schedules.some(s =>
            String(s.is_deleted || 0) !== '1' &&
            s.schedule_date === dateStr &&
            s.schedule_type === 'closed' &&
            s.target_scope !== 'student'
        );
    }
    return false;
}

function isClassScheduledOnDate(clsId, dateStr) {
    const cls = state.db.classes.find(c => String(c.id) === String(clsId));
    if (!cls) return true;

    if (isClassroomHoliday(dateStr)) {
        const cIds = state.db.class_students
            .filter(m => String(m.class_id) === String(clsId))
            .map(m => String(m.student_id));
        return state.db.attendance.some(
            a => a.date === dateStr &&
                 cIds.includes(String(a.student_id)) &&
                 a.status === '등원'
        );
    }

    if (!cls.schedule_days) return true;
    const dayIdx = String(new Date(dateStr + 'T00:00:00').getDay());
    return cls.schedule_days.split(',').includes(dayIdx);
}

// ── 출석 상태 헬퍼 ──────────────────────────────────────────────
function getAttendanceDisplayStatus(status, isClassDay = true) {
    const safe = String(status || '').trim();
    if (safe && safe !== '미기록') return safe;
    return isClassDay ? '등원' : '수업 없음';
}

function getNextAttendanceStatus(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') return '결석';
    if (cur === '결석') return '수업 없음';
    return '등원'; 
}

function getAttendanceStatusLabel(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') return '○ 등원';
    if (cur === '결석') return '× 결석';
    if (cur === '지각') return '△ 지각';
    if (cur === '보강') return '＋ 보강';
    if (cur === '상담') return '★ 상담';
    if (cur === '수업 없음') return '-'; 
    return '○ 등원';
}

function getAttendanceStatusStyle(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') {
        return 'background: rgba(0,208,132,0.08); color: var(--success); border: 1px solid rgba(0,208,132,0.15);';
    }
    if (cur === '결석') {
        return 'background: rgba(255,71,87,0.08); color: var(--error); font-weight: 700; border: 1px solid rgba(255,71,87,0.15);';
    }
    if (cur === '지각') {
        return 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight: 700; border: 1px solid rgba(255,165,2,0.18);';
    }
    if (cur === '보강') {
        return 'background: rgba(26,92,255,0.08); color: var(--primary); font-weight: 700; border: 1px solid rgba(26,92,255,0.15);';
    }
    if (cur === '상담') {
        return 'background: rgba(124,58,237,0.10); color: #7c3aed; font-weight: 700; border: 1px solid rgba(124,58,237,0.18);';
    }
    if (cur === '수업 없음') {
        return 'background: transparent; color: var(--border); font-weight: 700; border: 1px dashed var(--border); box-shadow: none;'; 
    }
    return 'background: var(--surface-2); color: var(--secondary); border: 1px solid var(--border);';
}

// ── 숙제 상태 헬퍼 ──────────────────────────────────────────────
function getHomeworkDisplayStatus(status, isClassDay = true) {
    const safe = String(status || '').trim();
    if (safe && safe !== '미기록') return safe;
    return isClassDay ? '완료' : '공란';
}

function getNextHomeworkStatus(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') return '미완료';
    if (cur === '미완료') return '공란';
    return '완료';
}

function getHomeworkStatusLabel(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') return '완료';
    if (cur === '미완료') return '미완료';
    if (cur === '공란') return '-'; 
    return '완료';
}

function getHomeworkStatusStyle(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') {
        return 'background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);';
    }
    if (cur === '미완료') {
        return 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight: 700; border: 1px solid rgba(255,165,2,0.15);';
    }
    if (cur === '공란') {
        return 'background: transparent; color: var(--border); font-weight: 700; border: 1px dashed var(--border); box-shadow: none;'; 
    }
    return 'background: var(--surface-2); color: var(--secondary); border: 1px solid var(--border);';
}

// [5G-2] PIN 일괄 배분 기능
async function handleBatchGeneratePins(classId) {
    if (!confirm('이 반에서 PIN이 아직 없는 학생들에게 고유 PIN을 일괄 배분하시겠습니까? (기존 PIN은 유지됨)')) return;
    const r = await api.post('students/batch-pins', { class_id: classId });
    if (r.success) {
        toast(`총 ${r.count}명의 학생에게 PIN이 자동 배분되었습니다.`, 'info');
        await loadData();
    } else {
        toast(r.message || '일괄 배분에 실패했습니다.', 'error');
    }
}

// [Phase 4/5] 요약 계산
function computeClassTodaySummary(classId) {
    const today = new Date().toLocaleDateString('sv-SE');
    const todayExam = typeof getTodayExamConfig === 'function' ? getTodayExamConfig() : null;
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const aIds = new Set(active.map(s => String(s.id)));
    const total = active.length;

    const hasActiveAttendance = state.db.attendance.some(a => a.date === today && ids.includes(String(a.student_id)) && a.status === '등원');
    const isScheduled = hasActiveAttendance || (isClassScheduledOnDate(classId, today) && !isClassroomHoliday(today));

    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };

    const todayAttMap = {};
    for (let i = 0; i < state.db.attendance.length; i++) {
        let a = state.db.attendance[i];
        if (a.date === today && aIds.has(String(a.student_id))) todayAttMap[a.student_id] = a.status;
    }
    const todayHwMap = {};
    for (let i = 0; i < state.db.homework.length; i++) {
        let h = state.db.homework[i];
        if (h.date === today && aIds.has(String(h.student_id))) todayHwMap[h.student_id] = h.status;
    }

    let attCount = 0; let hwCount = 0;
    active.forEach(s => {
        const attStatus = getAttendanceDisplayStatus(todayAttMap[s.id], isScheduled);
        if (attStatus === '등원') attCount++;
        const hwStatus = getHomeworkDisplayStatus(todayHwMap[s.id], isScheduled);
        if (hwStatus === '완료') hwCount++;
    });

    let test = 0;
    if (todayExam) {
        let testedIds = new Set();
        for (let i = 0; i < state.db.exam_sessions.length; i++) {
            let es = state.db.exam_sessions[i];
            if (es.exam_date === today && es.exam_title === todayExam.title && aIds.has(String(es.student_id))) testedIds.add(String(es.student_id));
        }
        test = testedIds.size;
    }
    return { att: attCount, hw: hwCount, test, total, isScheduled };
}

function openClassAttendance(cid) {
    state.ui.classDefaultTab = 'att';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

function openClassHomework(cid) {
    state.ui.classDefaultTab = 'hw';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

function isPlannerTargetClassName(className) {
    return String(className || '').includes('고1A');
}

// [UI Standard Applied]: 학급 메인 화면
function renderClass(cid) {
    injectClassroomStyles();
    const defaultTab = state.ui.classDefaultTab || '';
    state.ui.classDefaultTab = null;
    state.ui.currentClassId = String(cid);
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const mIds = state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id));
    const today = new Date().toLocaleDateString('sv-SE');
    
    const summary = computeClassTodaySummary(cid);
    const isPlannerTargetClass = isPlannerTargetClassName(cls?.name);
    const plannerButtonHtml = isPlannerTargetClass
        ? `<button class="btn" style="height: 52px; min-height: 52px; max-height: 52px; font-size: 13px; font-weight: 700; border-radius: 16px; background: rgba(124,58,237,0.06); border: 1px solid rgba(124,58,237,0.16); color: var(--text); box-shadow: none; display: flex; align-items: center; justify-content: center; padding: 0;" onclick="renderPlannerControl('${cid}')">플래너</button>`
        : '';

    const statusBarHtml = summary.isScheduled
        ? `<div style="display: flex; gap: 6px; align-items: center; flex-shrink: 0;">
             <div style="height: 26px; display: inline-flex; align-items: center; background: var(--bg); border-radius: 8px; padding: 0 8px; font-size: 11px; font-weight: 700; color: var(--secondary); border: 1px solid var(--border); white-space: nowrap;">출석 <span style="color: var(--text); margin-left: 4px;">${summary.att}/${summary.total}</span></div>
             <div style="height: 26px; display: inline-flex; align-items: center; background: var(--bg); border-radius: 8px; padding: 0 8px; font-size: 11px; font-weight: 700; color: var(--secondary); border: 1px solid var(--border); white-space: nowrap;">숙제 <span style="color: var(--text); margin-left: 4px;">${summary.hw}/${summary.total}</span></div>
           </div>`
        : `<span style="color: var(--warning); font-size: 13px; font-weight: 700; flex-shrink: 0;">정규 수업일 아님</span>`;

    const opToolsPanel = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding: 16px 16px 0; gap: 12px;">
            <div style="min-width: 0; flex: 1;">
                <div style="font-size: 19px; font-weight: 700; color: var(--text); letter-spacing: -0.5px; line-height: 1.2;">${apEscapeHtml(cls.name)}</div>
                <div style="font-size: 11px; font-weight: 600; color: var(--secondary); margin-top: 4px; line-height: 1.5;">${formatClassScheduleDays(cls.schedule_days)}</div>
            </div>
            ${statusBarHtml}
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(${isPlannerTargetClass ? 5 : 4}, minmax(0, 1fr)); gap: 10px; margin-bottom: 32px; padding: 0 16px;">
            <button class="btn" style="height: 52px; min-height: 52px; max-height: 52px; font-size: 13px; font-weight: 700; border-radius: 16px; background: rgba(26,92,255,0.05); border: 1px solid rgba(26,92,255,0.15); color: var(--text); display: flex; align-items: center; justify-content: center; padding: 0;" onclick="openQrGenerator('${cid}')">QR/OMR</button>
            <button class="btn" style="height: 52px; min-height: 52px; max-height: 52px; font-size: 13px; font-weight: 700; border-radius: 16px; background: rgba(225,29,72,0.05); border: 1px solid rgba(225,29,72,0.15); color: var(--text); display: flex; align-items: center; justify-content: center; padding: 0;" onclick="openExamGradeView('${cid}')">시험성적</button>
            <button class="btn" style="height: 52px; min-height: 52px; max-height: 52px; font-size: 13px; font-weight: 700; border-radius: 16px; background: rgba(5,150,105,0.05); border: 1px solid rgba(5,150,105,0.15); color: var(--text); display: flex; align-items: center; justify-content: center; padding: 0;" onclick="if(typeof openClinicBasketForClass==='function') openClinicBasketForClass('${cid}'); else toast('클리닉 준비중', 'warn');">클리닉</button>
            <button class="btn" style="height: 52px; min-height: 52px; max-height: 52px; font-size: 13px; font-weight: 700; border-radius: 16px; background: rgba(99,102,241,0.05); border: 1px solid rgba(99,102,241,0.15); color: var(--text); box-shadow: none; display: flex; align-items: center; justify-content: center; padding: 0;" onclick="openClassRecordModal('${cid}')">진도관리</button>
            ${plannerButtonHtml}
        </div>
    `;

    document.getElementById('app-root').innerHTML = `
        <div class="cls-fade-in" style="width: 100%; max-width: 850px; margin: 0 auto; box-sizing: border-box; padding-bottom: 24px;">
            ${opToolsPanel}
            
            <div style="margin: 0 16px 8px; padding: 0 4px; display: flex; justify-content: space-between; align-items: flex-end;">
                <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--text);">학생 명단</h3>
            </div>
            <div style="margin: 0 16px 32px;">
                <div class="card" style="padding: 8px 0; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                        <thead>
                            <tr style="background: var(--bg); border-bottom: 1px solid var(--border);">
                                <th style="width: 28%; padding: 10px 16px; font-size: 13px; color: var(--secondary); font-weight: 700; text-align: left;">이름</th>
                                <th style="width: 32%; padding: 10px 4px; font-size: 13px; color: var(--secondary); font-weight: 700; text-align: center;">학교</th>
                                <th style="width: 20%; padding: 10px 4px; font-size: 13px; color: var(--secondary); font-weight: 700; text-align: center;">출결</th>
                                <th style="width: 20%; padding: 10px 16px 10px 4px; font-size: 13px; color: var(--secondary); font-weight: 700; text-align: center;">숙제</th>
                            </tr>
                        </thead>
                        <tbody id="class-std-list"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    const todayAttMap = {};
    const todayHwMap = {};
    for (let i = 0; i < state.db.attendance.length; i++) {
        if (state.db.attendance[i].date === today) todayAttMap[state.db.attendance[i].student_id] = state.db.attendance[i].status;
    }
    for (let i = 0; i < state.db.homework.length; i++) {
        if (state.db.homework[i].date === today) todayHwMap[state.db.homework[i].student_id] = state.db.homework[i].status;
    }

    const listRoot = document.getElementById('class-std-list');
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    
    listRoot.innerHTML = stds.map(s => {
        const attStyle = getAttendanceStatusStyle(todayAttMap[s.id], summary.isScheduled);
        const attLabel = getAttendanceStatusLabel(todayAttMap[s.id], summary.isScheduled);
        const hwStyle = getHomeworkStatusStyle(todayHwMap[s.id], summary.isScheduled);
        const hwLabel = getHomeworkStatusLabel(todayHwMap[s.id], summary.isScheduled);

        return `<tr style="border-bottom: 1px solid var(--border);">
            <td onclick="setManagementReturnView({ type: 'classDetail', classId: '${cid}' }); renderStudentDetail('${s.id}')" style="padding: 8px 16px; cursor: pointer; font-weight:700; color: var(--text); font-size: 15px; line-height: 1.3; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${apEscapeHtml(s.name)}</td>
            <td style="padding: 8px 4px; color: var(--secondary); font-size: 13px; font-weight: 600; line-height: 1.3; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${apEscapeHtml(s.school_name)}</td>
            <td style="padding: 8px 4px; text-align: center; vertical-align: middle;">
                <button class="btn class-att-toggle" style="padding: 0; width: 100%; max-width: 64px; height: 38px; min-height: 38px; max-height: 38px; font-size: 13px; font-weight:700; border-radius: 10px; margin: 0 auto; display: flex; align-items: center; justify-content: center; ${attStyle}" onclick="toggleAtt('${s.id}')">${attLabel}</button>
            </td>
            <td style="padding: 8px 16px 8px 4px; text-align: center; vertical-align: middle;">
                <button class="btn class-hw-toggle" style="padding: 0; width: 100%; max-width: 56px; height: 38px; min-height: 38px; max-height: 38px; font-size: 13px; font-weight:700; border-radius: 10px; margin: 0 auto; display: flex; align-items: center; justify-content: center; ${hwStyle}" onclick="toggleHw('${s.id}')">${hwLabel}</button>
            </td>
        </tr>`;
    }).join('');

    if (defaultTab === 'att' || defaultTab === 'hw') {
        setTimeout(() => {
            const selector = defaultTab === 'att' ? '.class-att-toggle' : '.class-hw-toggle';
            const target = document.querySelector(selector);
            if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'center' }); target.focus({ preventScroll: true }); }
        }, 0);
    }
}

// 학년별 소단원 마스터 테이블
var MATH_CURRICULUM_UNITS = {
    '중1': ['소인수분해','정수와 유리수','문자와 식','좌표평면과 그래프','기본도형','평면도형의 성질','입체도형의 성질','자료의 정리와 해석'],
    '중2': ['수와 식','일차부등식','연립일차방정식','일차함수와 그래프','도형의 성질','도형의 닮음','피타고라스 정리','확률'],
    '중3': ['실수와 그 계산','다항식의 곱셈과 인수분해','이차방정식','이차함수와 그래프','삼각비','원의 성질','통계'],
    '고1': ['다항식의 연산','항등식과 나머지 정리','인수분해','복소수와 이차방정식','이차방정식과 이차함수','여러 가지 방정식과 부등식','합의 법칙과 곱의 법칙','순열과 조합','행렬과 그 연산','평면좌표','직선의 방정식','원의 방정식','도형의 이동','집합','명제','함수','유리함수','무리함수'],
    '고2': ['지수와 로그','지수함수','로그함수','삼각함수','사인법칙과 코사인법칙','등차수열과 등비수열','수열의 합','수학적 귀납법','함수의 극한','함수의 연속','미분계수','도함수','도함수의 활용','부정적분','정적분','정적분의 활용'],
    '고3': ['수열의 극한','급수','지수함수와 로그함수의 미분','삼각함수의 미분','여러 가지 미분법','도함수의 활용','여러 가지 적분법','정적분의 활용','순열과 조합','이항정리','확률의 뜻과 활용','조건부확률','확률분포','통계적 추정','이차곡선','이차곡선의 접선','공간도형','공간좌표','벡터의 연산','벡터의 성분','벡터의 내적','도형의 방정식']
};

function _getClassGradeKey(cls) {
    if (!cls) return '';
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    var match = text.match(/(중1|중2|중3|고1|고2|고3)/);
    return match ? match[1] : '';
}

function openClassRecordModal(cid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId: cid });
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const todayStr = new Date().toLocaleDateString('sv-SE');
    const allTextbooks = state.db.class_textbooks || [];
    let activeBooks = allTextbooks.filter(tb => String(tb.class_id) === String(cid) && tb.status === 'active');
    if (activeBooks.length === 0 && cls.textbook) activeBooks = [{ id: 'fallback', title: cls.textbook }];

    const existingRecord = (state.db.class_daily_records || []).find(r => String(r.class_id) === String(cid) && r.date === todayStr);
    const existingProgress = existingRecord ? (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(existingRecord.id)) : [];

    const booksHtml = activeBooks.length > 0 ? activeBooks.map((tb) => {
        const prevP = existingProgress.find(p => String(p.textbook_id) === String(tb.id) || (tb.id === 'fallback' && p.textbook_title_snapshot === tb.title));
        const progVal = prevP ? prevP.progress_text : '';
        const isChecked = (prevP || progVal) ? 'checked' : '';
        return `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight:700; min-width: 120px; color: var(--text); cursor: pointer; line-height: 1.5;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform: scale(1.1); accent-color: var(--primary);">
                ${apEscapeHtml(tb.title)}
            </label>
            <input type="text" class="cls-input record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="예: p.10~25" style="flex: 1; min-height: 44px;">
        </div>`;
    }).join('') : `<div style="font-size: 12px; color: var(--secondary); padding: 24px; text-align: center; background: var(--surface-2); border-radius: 16px; font-weight: 700; line-height: 1.5;">활성 교재 없음</div>`;

    const rawNote = existingRecord ? (existingRecord.special_note || '') : '';
    const unitLineMatch = rawNote.match(/^\[단원선택\]([^\n]*)\n?/);
    const prevSelectedUnits = unitLineMatch ? unitLineMatch[1].split(',').map(u => u.trim()).filter(Boolean) : [];
    const prevNote = rawNote.replace(/^\[단원선택\][^\n]*\n?/, '').trim();

    const gradeKey = _getClassGradeKey(cls);
    const units = gradeKey ? (MATH_CURRICULUM_UNITS[gradeKey] || []) : [];
    let unitsHtml = '';
    if (units.length > 0) {
        unitsHtml = `<div style="margin-bottom: 20px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
                <h4 style="margin:0;font-size:16px;font-weight:700;color:var(--text);line-height:1.3;">오늘 수업 단원 <span style="font-size:11px;font-weight:600;color:var(--secondary);">${gradeKey}</span></h4>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${units.map(u => {
                const checked = prevSelectedUnits.indexOf(u) !== -1 ? 'checked' : '';
                return `<label style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;cursor:pointer;padding:4px 8px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);white-space:nowrap;color:var(--text);">
                    <input type="checkbox" class="record-unit-check" value="${apEscapeHtml(u)}" ${checked} style="accent-color:var(--primary);cursor:pointer;">${apEscapeHtml(u)}</label>`;
            }).join('')}</div>
        </div>`;
    }

    showModal('진도관리', `${unitsHtml}<div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">교재별 진도</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--secondary); line-height: 1.5;">${todayStr}</span>
            </div>
            <div style="background: var(--surface); padding: 4px 0;">${booksHtml}</div>
        </div>
        <div style="margin-bottom: 32px;"><h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">특이사항</h4>
            <textarea id="record-special-note" class="cls-input" placeholder="수업 특이사항 메모" style="height: 100px; resize: none; padding: 14px; line-height: 1.6;">${apEscapeHtml(prevNote)}</textarea>
        </div>
        <button class="btn btn-primary" style="width: 100%; min-height: 52px; padding: 14px 16px; font-size: 14px; font-weight:700; border-radius: 14px; box-shadow: none;" onclick="saveClassRecord('${cid}', '${todayStr}')">기록 저장하기</button>`);
}

async function saveClassRecord(cid, dateStr) {
    const checks = document.querySelectorAll('.record-tb-check:checked');
    const progresses = [];
    checks.forEach(chk => {
        const tbId = chk.value;
        const progInput = document.getElementById(`progress_${tbId}`);
        progresses.push({ textbook_id: tbId === 'fallback' ? '' : tbId, textbook_title_snapshot: chk.getAttribute('data-title'), progress_text: progInput ? progInput.value.trim() : '' });
    });
    const selectedUnits = Array.from(document.querySelectorAll('.record-unit-check:checked')).map(cb => cb.value);
    let specialNote = document.getElementById('record-special-note')?.value.trim() || '';
    if (selectedUnits.length > 0) specialNote = '[단원선택] ' + selectedUnits.join(', ') + (specialNote ? '\n' + specialNote : '');
    const payload = { class_id: cid, date: dateStr, teacher_name: (typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당')), special_note: specialNote, progress: progresses };

    const r = await api.post('class-daily-records', payload);
    if (r?.success) { toast('저장 완료', 'success'); closeModal(true); await loadData(); renderClass(cid); }
}

let ledgerState = { date: new Date().toLocaleDateString('sv-SE'), classId: '', attendance: [], homework: [], mode: 'att' };
async function loadLedger() {
    try {
        const r = await fetch(`${CONFIG.API_BASE}/attendance-history?date=${ledgerState.date}`, { headers: getAuthHeader() });
        const data = await r.json();
        ledgerState.attendance = data.attendance || []; ledgerState.homework = data.homework || []; renderLedgerTable();
    } catch (e) { toast('데이터 로드 실패', 'warn'); }
}

function renderAttendanceLedger() {
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${String(c.id) === String(ledgerState.classId) ? 'selected' : ''}>${c.name}</option>`).join('');
    showModal('출석부', `<div style="display: flex; gap: 12px; flex-direction: column; margin-bottom: 16px; background: var(--surface-2); padding: 12px; border: 1px solid var(--border); border-radius: 16px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="ledger-date" class="cls-input" value="${ledgerState.date}" style="flex: 1.2; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="cls-input" style="flex: 1; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.classId=this.value;renderLedgerTable();"><option value="">전체 학급</option>${classOptions}</select>
            </div>
            <div style="display: flex; gap: 6px; background: var(--surface); padding: 4px; border: 1px solid var(--border); border-radius: 12px;">
                <button id="ledger-mode-att" class="btn" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='att';renderLedgerTable();">출결 기록</button>
                <button id="ledger-mode-hw" class="btn" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제 기록</button>
            </div>
        </div><div id="ledger-table-wrap" style="max-height: 55vh; overflow-y: auto; padding-right: 4px;"></div>`);
    loadLedger();
}

function renderLedgerTable() {
    const isAtt = ledgerState.mode === 'att';
    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;
    const recordMap = {}; records.forEach(r => { if (!r.date || r.date === ledgerState.date) recordMap[r.student_id] = r.status; });

    const rows = stds.map(s => {
        const sCid = cid || state.db.class_students.find(m => String(m.student_id) === String(s.id))?.class_id;
        const isScheduled = sCid ? isClassScheduledOnDate(sCid, ledgerState.date) : true;
        const recStatus = recordMap[s.id];
        const label = isAtt ? getAttendanceStatusLabel(recStatus, isScheduled) : getHomeworkStatusLabel(recStatus, isScheduled);
        const style = isAtt ? getAttendanceStatusStyle(recStatus, isScheduled) : getHomeworkStatusStyle(recStatus, isScheduled);
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--text); font-size: 14px; line-height: 1.4; text-align: left;">${apEscapeHtml(s.name)}</td>
            <td style="padding: 14px 4px; color: var(--secondary); font-size: 12px; font-weight: 600; line-height: 1.5; text-align: center;">${apEscapeHtml(s.school_name)}</td>
            <td style="padding: 14px 12px; text-align: center; vertical-align: middle;">
                <button class="btn" style="padding: 4px 10px; font-size: 12px; min-width: ${isAtt ? '76px' : '60px'}; font-weight:700; border-radius: 8px; margin: 0 auto; display: flex; align-items: center; justify-content: center; ${style}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${label}</button>
            </td>
        </tr>`;
    }).join('');
    
    const headerTitle = isAtt ? '출결' : '숙제';
    
    document.getElementById('ledger-table-wrap').innerHTML = `<div class="card" style="padding: 8px 0; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <thead><tr style="background: var(--bg); border-bottom: 1px solid var(--border);">
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: left;">이름</th>
                <th style="width: 40%; padding: 10px 4px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: center;">학교</th>
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: center;">${headerTitle}</th>
                </tr></thead>
                <tbody>${rows || '<tr><td colspan="3" style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:700;">조회 대상 없음</td></tr>'}</tbody>
            </table></div>`;
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleAtt(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => String(a.student_id) === String(sid) && a.date === today);
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextAttendanceStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next; else list.push({ student_id: sid, date: today, status: next });
    if (isLedger) renderLedgerTable(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();

    try {
        const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        if (typeof refreshDataOnly === 'function') {
            refreshDataOnly()
                .then(() => {
                    const month = today.slice(0, 7);
                    if (state.ui?.monthlyAttendanceCache) {
                        delete state.ui.monthlyAttendanceCache[month];
                    }
                })
                .catch(() => {});
        }
    } catch (e) {
        if (cur) cur.status = prevStatus;
        else {
            const idx = list.findIndex(a => String(a.student_id) === String(sid) && a.date === today);
            if (idx > -1) list.splice(idx, 1);
        }
        if (isLedger) renderLedgerTable(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleHw(sid, date) {
    const today = date || new Date().toLocaleDateString('sv-SE');
    const isLedger = !!date;
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => String(h.student_id) === String(sid) && h.date === today);
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextHomeworkStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next; else list.push({ student_id: sid, date: today, status: next });
    if (isLedger) renderLedgerTable(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();

    try {
        const r = await api.patch('homework', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        if (typeof refreshDataOnly === 'function') {
            refreshDataOnly()
                .then(() => {
                    const month = today.slice(0, 7);
                    if (state.ui?.monthlyAttendanceCache) {
                        delete state.ui.monthlyAttendanceCache[month];
                    }
                })
                .catch(() => {});
        }
    } catch (e) {
        if (cur) cur.status = prevStatus;
        else {
            const idx = list.findIndex(h => String(h.student_id) === String(sid) && h.date === today);
            if (idx > -1) list.splice(idx, 1);
        }
        if (isLedger) renderLedgerTable(); else if (state.ui.currentClassId) renderClass(state.ui.currentClassId); else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

function makeExamListKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = String(archiveFile || '');
    if (safeArchive) return `${safeTitle}||${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

function makeExamDetailKey(title, date) {
    return `${String(title || '')}||${String(date || '')}`;
}

async function openExamGradeView(classId) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const activeCount = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원').length;
    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(String(es.student_id)));
    let assignments = [];
    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) {
            sessions = res.sessions.filter(es => ids.includes(String(es.student_id)));
            const classStudentIdSet = new Set(ids);
            assignments = Array.isArray(res.assignments) ? res.assignments.filter(a => classStudentIdSet.size && String(a.class_id) === String(classId)) : [];
        }
    } catch (e) { console.warn('[openExamGradeView] fail', e); }

    const activeCountForAssignment = activeCount || ids.length;
    const grouped = {};
    sessions.forEach(s => {
        const key = makeExamListKey(s.exam_title, s.exam_date, s.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: s.exam_title, date: s.exam_date, archiveFile: s.archive_file || '', sessions: [], questionCount: s.question_count || 0, assignment: null };
        grouped[key].sessions.push(s);
        if (!grouped[key].questionCount && s.question_count) grouped[key].questionCount = s.question_count;
        if (!grouped[key].archiveFile && s.archive_file) grouped[key].archiveFile = s.archive_file;
    });

    assignments.forEach(a => {
        const key = makeExamListKey(a.exam_title, a.exam_date, a.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: a.exam_title, date: a.exam_date, archiveFile: a.archive_file || '', sessions: [], questionCount: a.question_count || 0, assignment: a };
        else {
            grouped[key].assignment = a;
            if (!grouped[key].questionCount && a.question_count) grouped[key].questionCount = a.question_count;
            if (!grouped[key].archiveFile && a.archive_file) grouped[key].archiveFile = a.archive_file;
        }
    });

    const exams = Object.values(grouped).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.title).localeCompare(String(a.title)));
    const rows = exams.map(exam => {
        const cnt = exam.sessions.length;
        const qCount = exam.questionCount || exam.sessions[0]?.question_count || exam.assignment?.question_count || 0;
        const avg = cnt ? Math.round(exam.sessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / cnt) : '-';
        const pct = activeCountForAssignment ? Math.round((cnt / activeCountForAssignment) * 100) : 0;
        const archiveArg = String(exam.archiveFile || '').replace(/'/g, "\\'");
        return `<div onclick="openExamDetail('${classId}', '${String(exam.title || '').replace(/'/g, "\\'")}', '${exam.date}')" style="padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
            <div>
                <div style="font-weight:700; color: var(--text); font-size: 15px; line-height: 1.4;">${exam.title}</div>
                <div style="font-size: 11px; color: var(--secondary); margin-top: 4px; font-weight: 600; line-height: 1.5;">${exam.date} · ${qCount}문항 · 제출 ${cnt}/${activeCountForAssignment}명 (${pct}%)</div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
                <div>
                    <div style="font-size: 20px; font-weight:700; color: var(--primary); line-height: 1;">${avg}</div>
                    <div style="font-size: 10px; color: var(--secondary); font-weight:700; margin-top:4px;">평균</div>
                </div>
                <button class="btn" onclick="event.stopPropagation(); closeModal(true); if(typeof openOMR==='function') openOMR('', '${String(exam.title || '').replace(/'/g, "\\'")}', ${qCount || 20}, '${classId}', '', '${archiveArg}', 'examList', '${exam.date}');" style="padding: 7px 10px; font-size: 11px; font-weight:700; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">입력</button>
            </div>
        </div>`;
    }).join('');

    showModal('시험성적', `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px; font-weight:700; border-radius: 10px;" onclick="closeModal(true); if(typeof openOMR==='function') openOMR('', '단원평가', 20, '${classId}', '', '', 'examList');">새 시험 입력</button>
        </div>
        ${rows || `<div style="text-align:center; padding:40px 20px; color:var(--secondary); font-size:13px; font-weight:700;">시험 기록 없음</div>`}
    `);
}

async function openExamDetail(classId, examTitle, examDate) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];
    let assignmentSource = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) sessionSource = res.sessions;
        if (res && Array.isArray(res.wrong_answers)) wrongSource = res.wrong_answers;
        if (res && Array.isArray(res.assignments)) assignmentSource = res.assignments;
    } catch (e) { console.warn('[openExamDetail] fail', e); }

    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const sessions = sessionSource.filter(es => String(es.exam_title || '') === String(examTitle || '') && String(es.exam_date || '') === String(examDate || '') && ids.includes(String(es.student_id)));
    const matchedAssignment = assignmentSource.find(a => String(a.exam_title || '') === String(examTitle || '') && String(a.exam_date || '') === String(examDate || ''));

    const sessionsWithArchive = sessions.filter(s => s.archive_file);
    if (sessionsWithArchive.length > 0 && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions(sessionsWithArchive); } catch (e) { console.warn(e); }
    } else if (matchedAssignment?.archive_file && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions([{ archive_file: matchedAssignment.archive_file, question_count: matchedAssignment.question_count, exam_title: matchedAssignment.exam_title, exam_date: matchedAssignment.exam_date }]); } catch (e) { console.warn(e); }
    }

    const submittedIds = new Set(sessions.map(s => String(s.student_id)));
    const qCount = sessions[0]?.question_count || matchedAssignment?.question_count || 0;

    const prevSessions = state.db.exam_sessions;
    const prevWrongs = state.db.wrong_answers;
    state.db.exam_sessions = sessionSource;
    state.db.wrong_answers = wrongSource;
    let classWeakUnits = [];
    if (typeof computeClassWeakUnits === 'function') classWeakUnits = computeClassWeakUnits(classId, examTitle, examDate);
    state.db.exam_sessions = prevSessions;
    state.db.wrong_answers = prevWrongs;

    const submitted = active.filter(s => submittedIds.has(String(s.id))).map(s => {
        const sess = sessions.find(es => String(es.student_id) === String(s.id));
        const wrongs = wrongSource.filter(w => String(w.session_id) === String(sess?.id)).map(w => w.question_id).sort((a, b) => Number(a) - Number(b));
        return { ...s, score: sess?.score ?? '-', sessionId: sess?.id, session: sess, wrongs };
    });
    const pending = active.filter(s => !submittedIds.has(String(s.id)));

    const examArchiveFileObj = sessions.find(s => s.archive_file);
    const examArchiveFile = String(examArchiveFileObj?.archive_file || matchedAssignment?.archive_file || '').replace(/'/g, "\\'");

    const submittedHTML = submitted.map(s => {
        const sArchive = s.session?.archive_file ? String(s.session.archive_file).replace(/'/g, "\\'") : examArchiveFile;
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--primary); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="text-align: center; font-weight:700; color: var(--text); padding: 14px 4px; font-size: 14px;">${s.score}점</td>
            <td style="padding: 14px 4px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background: rgba(255,71,87,0.08); color: var(--error); padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,71,87,0.15);">Q${qid}</span>`).join('') : '<span style="color: var(--secondary); font-size: 11px; font-weight: 600;">없음</span>'}
                </div>
            </td>
            <td style="text-align: right; padding: 14px 12px;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','${s.sessionId || ''}','${sArchive}','examDetail','${examDate}')">수정</button>
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="deleteExamSession('${s.sessionId || ''}','${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color: var(--bg); border-bottom: 1px solid var(--border);">
        <td style="padding: 14px 12px; color: var(--secondary); font-weight: 600; font-size: 14px;">${s.name}</td>
        <td colspan="2" style="text-align: center; font-size: 12px; color: var(--secondary); font-weight: 700; line-height: 1.5;">미제출</td>
        <td style="text-align: right; padding: 14px 12px;">
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; font-weight:700; border-radius: 8px; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','','${examArchiveFile}','examDetail','${examDate}')">입력</button>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle}`, `
        <div style="padding: 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; text-align: center;">
            <div style="font-size: 14px; font-weight:700; color: var(--text); line-height: 1.4;">제출 완료: <b style="color: var(--success);">${submitted.length}명</b> / 전체 ${submitted.length + pending.length}명</div>
            <div style="font-size: 11px; font-weight: 600; color: var(--secondary); margin-top: 4px; line-height: 1.5;">${examDate} · ${qCount}문항 기준</div>
        </div>
        <div style="margin-bottom: 24px; border: 1px solid rgba(26,92,255,0.15); border-radius: 18px; padding: 16px; background: rgba(26,92,255,0.02);">
            <div style="font-size: 14px; font-weight:700; margin-bottom: 12px; color: var(--primary); line-height: 1.3;">반 취약 단원 TOP</div>
            ${weakUnitHtml}
        </div>
        <div style="margin-bottom: 12px; text-align: right;">
            <button class="btn" style="padding: 6px 12px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); font-weight:700; border-radius: 10px;" onclick="deleteExamByClass('${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}')">시험 기록 전체 삭제</button>
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; table-layout: fixed;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
                    <th style="width: 25%; text-align: left; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 12px;">이름</th>
                    <th style="width: 20%; text-align: center; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 12px;">점수</th>
                    <th style="width: 35%; text-align: left; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 12px;">오답</th>
                    <th style="width: 20%; text-align: right; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 12px;">관리</th>
                </tr>
            </thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}

async function deleteExamSession(sessionId, classId, examTitle, examDate) {
    if (!sessionId) return;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return; }
    toast('기록이 삭제되었습니다.', 'info');
    closeModal(true); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate);
}

async function deleteExamByClass(classId, examTitle, examDate) {
    if (!confirm('이 시험의 제출 기록 전체를 삭제할까요?')) return;
    if (!confirm('오답 기록도 모두 삭제됩니다. 정말 삭제하시겠습니까?')) return;
    try {
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(examTitle)}&date=${encodeURIComponent(examDate)}`;
        const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        const data = await r.json();
        if (!r.ok || !data.success) { toast('시험 전체삭제 실패', 'warn'); return; }
        toast('시험 전체 기록이 삭제되었습니다.', 'info');
        closeModal(true); await refreshDataOnly(); openExamGradeView(classId);
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); }
}

// ── 고1A 장기 플래너 관제 ─────────────────────────────────────────────
function getPlannerBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/')) path = path.substring(0, path.lastIndexOf('/') + 1);
    return origin + path + 'planner/';
}

async function copyPlannerStudentLink(studentId) {
    const url = `${getPlannerBaseUrl()}?student_id=${encodeURIComponent(studentId)}`;
    try {
        await navigator.clipboard.writeText(url);
        toast('플래너 링크가 복사되었습니다.', 'info');
    } catch (e) {
        showModal('플래너 링크', `
            <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-bottom:8px;">아래 링크를 복사하세요. PIN은 포함되지 않습니다.</div>
            <div style="word-break:break-all; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:12px; font-size:13px; font-weight:700; color:var(--text);">${apEscapeHtml(url)}</div>
        `);
    }
}

async function loadPlannerOverview(classId, date) {
    if (api.getPlannerOverview) return api.getPlannerOverview(classId, date);
    return api.get(`planner/overview?class_id=${encodeURIComponent(classId)}&date=${encodeURIComponent(date)}`);
}

function renderPlannerRateBar(rate) {
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(rate || 0))));
    return `
        <div style="display:flex; align-items:center; gap:8px; min-width:96px;">
            <div style="flex:1; height:7px; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; overflow:hidden;">
                <div style="height:100%; width:${safeRate}%; background:var(--primary); border-radius:999px;"></div>
            </div>
            <span style="width:34px; text-align:right; font-size:12px; font-weight:700; color:var(--text);">${safeRate}%</span>
        </div>
    `;
}

function renderPlannerOverviewTable(classId, date, rows) {
    const root = document.getElementById('planner-control-body');
    if (!root) return;

    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
        root.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">조회 대상 학생이 없습니다.</div>`;
        return;
    }

    const desktopRows = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '미작성';
        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px 10px; font-size:14px; font-weight:700; color:var(--text);">${apEscapeHtml(row.name)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:700; color:var(--text);">${Number(row.total || 0)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:700; color:var(--primary);">${Number(row.done || 0)}</td>
                <td style="padding:12px 10px;">${renderPlannerRateBar(row.rate)}</td>
                <td style="padding:12px 10px; font-size:12px; font-weight:700; color:${fb ? 'var(--text)' : 'var(--secondary)'}; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${apEscapeHtml(fbText)}</td>
                <td style="padding:12px 10px; text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end;">
                        <button class="btn" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:700; border-radius:10px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                        <button class="btn" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:700; border-radius:10px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const mobileCards = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '피드백 미작성';
        return `
            <div style="border:1px solid var(--border); border-radius:16px; padding:14px; background:var(--surface); margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.3;">${apEscapeHtml(row.name)}</div>
                        <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">할 일 ${Number(row.total || 0)} · 완료 ${Number(row.done || 0)}</div>
                    </div>
                    <div style="font-size:15px; font-weight:700; color:var(--primary);">${Number(row.rate || 0)}%</div>
                </div>
                ${renderPlannerRateBar(row.rate)}
                <div style="font-size:12px; font-weight:700; color:${fb ? 'var(--text)' : 'var(--secondary)'}; margin-top:10px; line-height:1.5;">${apEscapeHtml(fbText)}</div>
                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button class="btn" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:700; border-radius:12px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                    <button class="btn" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크 복사</button>
                </div>
            </div>
        `;
    }).join('');

    root.innerHTML = `
        <style>
            @media (max-width:700px) {
                #planner-desktop-table { display:none !important; }
                #planner-mobile-list { display:block !important; }
            }
            @media (min-width:701px) {
                #planner-desktop-table { display:block !important; }
                #planner-mobile-list { display:none !important; }
            }
        </style>
        <div id="planner-desktop-table" style="overflow-x:auto; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
            <table style="width:100%; border-collapse:collapse; min-width:720px;">
                <thead>
                    <tr style="background:var(--surface-2); border-bottom:1px solid var(--border);">
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">학생</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:700; color:var(--secondary);">할 일</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:700; color:var(--secondary);">완료</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">이행률</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">피드백</th>
                        <th style="padding:10px; text-align:right; font-size:12px; font-weight:700; color:var(--secondary);">관리</th>
                    </tr>
                </thead>
                <tbody>${desktopRows}</tbody>
            </table>
        </div>
        <div id="planner-mobile-list">${mobileCards}</div>
    `;
}

async function renderPlannerControl(classId) {
    if (!state.ui) state.ui = {};
    state.ui.plannerControlClassId = String(classId || '');
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    if (!isPlannerTargetClassName(cls.name)) return toast('고1A 전용 기능입니다.', 'warn');

    const today = new Date().toLocaleDateString('sv-SE');
    showModal('플래너 관제', `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:14px; background:var(--surface-2); border-radius:16px;">
                <div style="min-width:0;">
                    <div style="font-size:16px; font-weight:700; color:var(--text); line-height:1.3;">${apEscapeHtml(cls.name)}</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">고1A 장기 플래너</div>
                </div>
                <button class="btn" style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:700; border-radius:10px; background:var(--surface); border:1px solid var(--border);" onclick="renderClass('${classId}'); closeModal(true);">반 화면</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="date" id="planner-control-date" class="btn" value="${today}" style="flex:1; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <button class="btn btn-primary" style="min-height:44px; padding:10px 14px; font-size:12px; font-weight:700;" onclick="refreshPlannerControl('${classId}')">조회</button>
            </div>
            <div id="planner-control-body">
                <div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">불러오는 중...</div>
            </div>
        </div>
    `);
    await refreshPlannerControl(classId);
}

async function refreshPlannerControl(classId) {
    const date = document.getElementById('planner-control-date')?.value || new Date().toLocaleDateString('sv-SE');
    const body = document.getElementById('planner-control-body');
    if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">불러오는 중...</div>`;

    try {
        const data = await loadPlannerOverview(classId, date);
        if (!data?.success) {
            if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:700;">플래너 관제를 불러오지 못했습니다.</div>`;
            toast(data?.message || data?.error || '플래너 관제 조회 실패', 'warn');
            return;
        }
        renderPlannerOverviewTable(classId, date, data.students || []);
    } catch (e) {
        console.error('[refreshPlannerControl] failed:', e);
        if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:700;">플래너 관제 조회 중 오류가 발생했습니다.</div>`;
        toast('플래너 관제 조회 중 오류가 발생했습니다.', 'error');
    }
}

function openPlannerFeedbackModal(studentId, date, currentRate) {
    const s = state.db.students.find(st => String(st.id) === String(studentId));
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))));
    showModal('플래너 피드백', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                <div style="font-size:15px; font-weight:700; color:var(--text);">${apEscapeHtml(s?.name || '학생')}</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${apEscapeHtml(date)} · 현재 이행률 ${safeRate}%</div>
            </div>
            <select id="planner-feedback-badge" class="btn" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <option value="">배지 없음</option>
                <option value="⭐">⭐ 잘함</option>
                <option value="🔥">🔥 집중</option>
                <option value="👍">👍 좋아요</option>
            </select>
            <textarea id="planner-feedback-comment" class="cls-input" rows="5" placeholder="학생에게 보일 피드백을 입력하세요." style="resize:none;"></textarea>
            <button class="btn btn-primary" style="min-height:48px; font-size:14px; font-weight:700;" onclick="savePlannerFeedback('${studentId}', '${date}', ${safeRate})">저장</button>
        </div>
    `);
}

async function savePlannerFeedback(studentId, date, currentRate) {
    const badge = document.getElementById('planner-feedback-badge')?.value || '';
    const teacherComment = document.getElementById('planner-feedback-comment')?.value.trim() || '';
    const payload = {
        student_id: studentId,
        feedback_date: date,
        teacher_comment: teacherComment,
        badge,
        completion_rate: Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))))
    };

    try {
        const r = api.savePlannerFeedback ? await api.savePlannerFeedback(payload) : await api.post('planner/feedback', payload);
        if (!r?.success) {
            toast(r?.message || r?.error || '피드백 저장 실패', 'warn');
            return;
        }
        toast('피드백이 저장되었습니다.', 'success');
        closeModal(true);
        const classId = state?.ui?.plannerControlClassId || state?.ui?.currentClassId || '';
        if (classId) await renderPlannerControl(classId);
    } catch (e) {
        console.error('[savePlannerFeedback] failed:', e);
        toast('피드백 저장 중 오류가 발생했습니다.', 'error');
    }
}
