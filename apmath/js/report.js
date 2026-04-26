/**
 * AP Math OS v26.1.2 [js/report.js]
 * 보고 문구 생성 및 AI 연동 엔진
 */

/**
 * 학생의 최근 성적 평균 계산
 */
function getRecentAverage(studentId, limit = 3) {
    const scores = state.db.exam_sessions
        .filter(s => s.student_id === studentId)
        .sort((a, b) => String(b.exam_date).localeCompare(String(a.exam_date)) || String(b.id).localeCompare(String(a.id)))
        .slice(0, limit).map(s => s.score);
    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * 정적 보고 문구 (즉시 복사)
 */
function copyReport(sid, type) {
    const s = state.db.students.find(x => x.id === sid);
    const today = new Date().toLocaleDateString('sv-SE');
    const att = state.db.attendance.find(a => a.student_id === sid && a.date === today)?.status || '미기록';
    const hw = state.db.homework.find(h => h.student_id === sid && h.date === today)?.status || '미기록';
    const exs = state.db.exam_sessions.filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    const todayEx = exs.find(e => e.exam_date === today);
    const avg = getRecentAverage(sid, 3);
    
    let text = '';
    if (type === 'parent') {
        text = `[AP Math] ${s.name} 학생 오늘 수업 안내\n출결: ${att}\n숙제: ${hw}\n오늘 성적: ${todayEx ? todayEx.score+'점' : '없음'}\n최근 3회 평균: ${avg !== null ? avg+'점' : '데이터 없음'}`;
    } else if (type === 'student') {
        text = `${s.name}아, 오늘 수고 많았어! 😊\n숙제 잊지 말고, 다음 시간에 또 보자!`;
    } else {
        text = `[상담 메모 - ${today}] ${s.name} (${s.school_name} ${s.grade})\n출결: ${att} / 숙제: ${hw}\n금일 성적: ${todayEx ? todayEx.exam_title+' '+todayEx.score+'점' : '시험 없음'}\n최근 평균: ${avg !== null ? avg+'점' : '없음'}`;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        toast('복사 완료', 'info');
    }).catch(() => {
        toast('복사 실패', 'warn');
    });
}

/**
 * AI 보고 문구 생성 요청
 */
async function requestAiReport(sid, type) {
    const s = state.db.students.find(x => x.id === sid);
    if (!s) return;

    const today = new Date().toLocaleDateString('sv-SE');
    const att = state.db.attendance.find(a => a.student_id === sid && a.date === today)?.status || '미기록';
    const hw = state.db.homework.find(h => h.student_id === sid && h.date === today)?.status || '미기록';
    const exs = state.db.exam_sessions.filter(e => e.student_id === sid).sort((a,b) => b.exam_date.localeCompare(a.exam_date));
    const todayEx = exs.find(e => e.exam_date === today);
    const avg = getRecentAverage(sid, 3);
    const wrongs = todayEx
        ? state.db.wrong_answers.filter(w => w.session_id === todayEx.id).map(w => w.question_id).sort((a, b) => a - b)
        : [];

    const payload = {
        type,
        student: { name: s.name, school: s.school_name, grade: s.grade },
        today: {
            att, hw,
            exam: todayEx ? { title: todayEx.exam_title, score: todayEx.score, wrongs } : null,
            avg: avg !== null ? avg : null
        }
    };

    showModal('🤖 AI 보고 문구 생성', `
        <div style="text-align:center; padding:30px 0; color:var(--secondary);">
            <div style="font-size:24px; margin-bottom:12px;">⏳</div>
            <div style="font-size:13px;">문구를 생성 중입니다...</div>
        </div>
    `);

    try {
        const r = await fetch(`${CONFIG.API_BASE}/ai/student-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await r.json();

        if (!data.success) {
            toast('문구 생성 실패, 기본 템플릿으로 복사합니다.', 'warn');
            closeModal();
            copyReport(sid, type);
            return;
        }

        const sourceLabel = data.source === 'ai' ? '🤖 AI 생성' : '📝 기본 생성';
        const typeLabel = type === 'parent' ? '학부모용' : type === 'student' ? '학생용' : '상담용';
        const safeMessage = escapeHtmlForTextarea(data.message || '');

        showModal('🤖 AI 보고 문구', `
            <div style="font-size:11px; color:var(--secondary); margin-bottom:8px;">${sourceLabel} · ${typeLabel}</div>
            <textarea id="ai-report-text" style="width:100%; height:160px; padding:12px; border:1px solid var(--border); border-radius:8px; font-size:13px; line-height:1.7; resize:vertical; font-family:inherit;">${safeMessage}</textarea>
            <button class="btn btn-primary" style="width:100%; margin-top:12px;" onclick="copyAiReportText()">복사</button>
        `);

    } catch (e) {
        toast('네트워크 오류, 기본 템플릿으로 복사합니다.', 'warn');
        closeModal();
        copyReport(sid, type);
    }
}

/**
 * 생성된 AI 보고 문구 텍스트 복사
 */
function copyAiReportText() {
    const text = document.getElementById('ai-report-text')?.value || '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        toast('복사 완료', 'info');
    }).catch(() => {
        toast('복사 실패', 'warn');
    });
}