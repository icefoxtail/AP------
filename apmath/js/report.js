/**
 * AP Math OS 1.0 [js/report.js]
 * 보고 문구 생성 및 AI 연동 엔진
 * [IRONCLAD 5G]&#58; 고급 발송 문구 / 미리보기 후 최종 복사 / Top Action 모달 적용
 */

/**
 * 학생의 최근 성적 평균 계산
 */
function getRecentAverage(studentId, limit = 3) {
    const scores = state.db.exam_sessions
        .filter(s => s.student_id === studentId)
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')))
        .slice(0, limit)
        .map(s => Number(s.score))
        .filter(v => Number.isFinite(v));

    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * 보고 문구 생성용 기본 데이터 수집
 */
function buildReportContext(sid) {
    const student = state.db.students.find(x => x.id === sid);
    const today = new Date().toLocaleDateString('sv-SE');

    const attendance = state.db.attendance.find(a => a.student_id === sid && a.date === today)?.status || '미기록';
    const homework = state.db.homework.find(h => h.student_id === sid && h.date === today)?.status || '미기록';

    const exams = (state.db.exam_sessions || [])
        .filter(e => e.student_id === sid)
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));

    const todayExam = exams.find(e => e.exam_date === today) || null;
    const latestExam = todayExam || exams[0] || null;
    const avg = getRecentAverage(sid, 3);

    const wrongIds = latestExam
        ? (state.db.wrong_answers || [])
            .filter(w => w.session_id === latestExam.id)
            .map(w => w.question_id)
            .sort((a, b) => Number(a) - Number(b))
        : [];

    const classMap = (state.db.class_students || []).find(m => String(m.student_id) === String(sid));
    const classId = classMap?.class_id || '';
    const className = (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '';

    const latestRecord = (state.db.class_daily_records || [])
        .filter(r => String(r.class_id) === String(classId))
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null;

    const progressItems = latestRecord
        ? (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(latestRecord.id))
        : [];

    const progressText = progressItems.length
        ? progressItems
            .map(p => {
                const title = p.textbook_title_snapshot || '교재';
                const progress = p.progress_text || '';
                return progress ? `${title} ${progress}` : title;
            })
            .join(', ')
        : '';

    const latestConsultation = (state.db.consultations || [])
        .filter(c => c.student_id === sid)
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null;

    return {
        student,
        today,
        attendance,
        homework,
        exams,
        todayExam,
        latestExam,
        avg,
        wrongIds,
        classId,
        className,
        latestRecord,
        progressText,
        latestConsultation
    };
}

/**
 * 상태 문구 변환
 */
function describeAttendance(status) {
    if (status === '등원') return '정상적으로 등원';
    if (status === '결석') return '결석';
    if (status === '지각') return '지각';
    if (status === '미기록') return '출결 확인 전';
    return status || '출결 확인 전';
}

function describeHomework(status) {
    if (status === '완료') return '완료';
    if (status === '미완료') return '미완료';
    if (status === '미기록') return '확인 전';
    return status || '확인 전';
}

function buildExamSummary(ctx) {
    if (!ctx.latestExam) return '';

    const exam = ctx.latestExam;
    const avgText = ctx.avg !== null ? ` 최근 3회 평균은 ${ctx.avg}점입니다.` : '';
    const wrongText = ctx.wrongIds.length
        ? ` 오답은 ${ctx.wrongIds.length}개로, ${ctx.wrongIds.join(', ')}번을 다시 확인하면 좋겠습니다.`
        : ' 오답 없이 잘 마무리했습니다.';

    return `최근 평가인 「${exam.exam_title}」에서는 ${exam.score}점을 기록했습니다.${avgText}${wrongText}`;
}

function buildNextPoint(ctx) {
    if (ctx.wrongIds.length) {
        return `오답 문항 ${ctx.wrongIds.join(', ')}번의 풀이 과정을 다시 점검`;
    }

    if (ctx.homework === '미완료') {
        return '미완료된 숙제 보완';
    }

    if (ctx.progressText) {
        return `${ctx.progressText} 범위의 핵심 개념 확인`;
    }

    return '오늘 다룬 개념의 계산 과정과 풀이 습관 점검';
}

/**
 * 학부모용 기본 문구 생성
 */
function buildParentReportText(ctx) {
    const s = ctx.student;
    if (!s) return '';

    const attText = describeAttendance(ctx.attendance);
    const hwText = describeHomework(ctx.homework);
    const nextPoint = buildNextPoint(ctx);

    if (ctx.attendance === '결석') {
        return `안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 결석으로 확인되었습니다.
수업에서 다룬 내용은 다음 시간에 흐름이 끊기지 않도록 필요한 부분부터 다시 확인하겠습니다.

가정에서도 다음 등원 전까지 교재와 숙제 준비만 한 번 확인 부탁드립니다.

감사합니다.`;
    }

    const progressSentence = ctx.progressText
        ? `오늘은 ${ctx.progressText} 범위를 중심으로 수업을 진행했습니다.`
        : '오늘은 현재 진도에 맞춰 개념 확인과 문제 풀이를 진행했습니다.';

    const homeworkSentence = ctx.homework === '완료'
        ? '숙제는 잘 챙겨온 상태였습니다.'
        : ctx.homework === '미완료'
            ? '숙제는 일부 보완이 필요하여 다음 시간 전까지 마무리하면 좋겠습니다.'
            : '숙제 상태는 수업 중 추가로 확인하겠습니다.';

    const examSentence = buildExamSummary(ctx);
    const examBlock = examSentence ? `\n\n${examSentence}` : '';

    return `안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 ${attText}하여 수업에 참여했습니다.
${progressSentence}
${homeworkSentence}${examBlock}

다음 시간에는 ${nextPoint}을 중심으로 다시 점검하겠습니다.
가정에서도 해당 부분만 가볍게 확인해 주시면 학습 흐름 유지에 도움이 됩니다.

감사합니다.`;
}

/**
 * 학생용 기본 문구 생성
 */
function buildStudentReportText(ctx) {
    const s = ctx.student;
    if (!s) return '';

    const nextPoint = buildNextPoint(ctx);

    if (ctx.attendance === '결석') {
        return `${s.name}아, 오늘 수업은 결석으로 확인됐어.

다음 시간에 진도가 끊기지 않도록 필요한 부분부터 다시 확인할게.
오기 전에는 교재와 지난 숙제만 챙겨서 오면 돼.`;
    }

    const examSentence = ctx.latestExam
        ? `최근 평가에서는 ${ctx.latestExam.score}점이 나왔고, ${ctx.wrongIds.length ? `오답 ${ctx.wrongIds.length}개를 다시 확인하면 좋아.` : '오답 없이 잘 정리했어.'}`
        : '오늘 수업에서 다룬 개념을 한 번 더 정리하면 좋아.';

    const homeworkSentence = ctx.homework === '미완료'
        ? '숙제는 아직 부족한 부분이 있으니 다음 시간 전까지 마무리해 오자.'
        : '지금처럼 수업 흐름을 유지하면 돼.';

    return `${s.name}아, 오늘 수업 수고했어.

${examSentence}
${homeworkSentence}

다음 시간 전까지 ${nextPoint}만 정리해서 오자.`;
}

/**
 * 상담/내부 공유용 기본 문구 생성
 */
function buildCounselReportText(ctx) {
    const s = ctx.student;
    if (!s) return '';

    const examLine = ctx.latestExam
        ? `${ctx.latestExam.exam_date} / ${ctx.latestExam.exam_title} / ${ctx.latestExam.score}점${ctx.avg !== null ? ` / 최근 3회 평균 ${ctx.avg}점` : ''}`
        : '최근 시험 기록 없음';

    const wrongLine = ctx.wrongIds.length
        ? `${ctx.wrongIds.join(', ')}번 (${ctx.wrongIds.length}개)`
        : '특이 오답 없음';

    const progressLine = ctx.progressText || '최근 진도 기록 없음';
    const consultationLine = ctx.latestConsultation
        ? `${ctx.latestConsultation.date} / ${ctx.latestConsultation.type} / ${ctx.latestConsultation.content}`
        : '최근 상담 기록 없음';

    return `[학생 상담 메모]
날짜: ${ctx.today}
학생: ${s.name} (${s.school_name || ''} ${s.grade || ''})
학급: ${ctx.className || '미배정'}

[오늘 상태]
출결: ${ctx.attendance}
숙제: ${ctx.homework}
진도: ${progressLine}

[성적 및 오답]
최근 평가: ${examLine}
오답: ${wrongLine}

[최근 상담 기록]
${consultationLine}

[다음 조치]
${buildNextPoint(ctx)} 중심으로 확인 필요.`;
}

/**
 * 정적 보고 문구 생성 → 미리보기 후 최종 복사
 */
function copyReport(sid, type) {
    const ctx = buildReportContext(sid);
    const s = ctx.student;

    if (!s) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    let text = '';
    let title = '보고 문구';

    if (type === 'parent') {
        text = buildParentReportText(ctx);
        title = '학부모용 문구';
    } else if (type === 'student') {
        text = buildStudentReportText(ctx);
        title = '학생용 문구';
    } else {
        text = buildCounselReportText(ctx);
        title = '상담용 문구';
    }

    showModal(title, `
        <div style="background:var(--bg); padding:16px; border-radius:18px; margin-bottom:16px;">
            <p style="margin:0 0 10px 0; font-size:12px; color:var(--secondary); font-weight:700;">
                내용을 확인하고 필요하면 수정한 뒤 복사하세요.
            </p>
            <textarea id="report-copy-text" class="btn" style="width:100%; height:300px; text-align:left; background:var(--surface); border:none; padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>
        </div>
    `, '최종 복사', copyStaticReportText);
}

/**
 * 정적 보고 문구 최종 복사
 */
function copyStaticReportText() {
    const text = document.getElementById('report-copy-text')?.value || '';
    if (!text.trim()) {
        toast('복사할 문구가 없습니다.', 'warn');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        toast('문구가 복사되었습니다.', 'success');
        closeModal();
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

/**
 * AI 보고 문구 생성 요청
 */
async function requestAiReport(sid, type) {
    const ctx = buildReportContext(sid);
    const s = ctx.student;
    if (!s) return;

    const payload = {
        type,
        student: { name: s.name, school: s.school_name, grade: s.grade },
        today: {
            att: ctx.attendance,
            hw: ctx.homework,
            exam: ctx.todayExam ? {
                title: ctx.todayExam.exam_title,
                score: ctx.todayExam.score,
                wrongs: ctx.todayExam
                    ? state.db.wrong_answers
                        .filter(w => w.session_id === ctx.todayExam.id)
                        .map(w => w.question_id)
                        .sort((a, b) => Number(a) - Number(b))
                    : []
            } : null,
            avg: ctx.avg !== null ? ctx.avg : null
        }
    };

    showModal('보고 문구 생성', `
        <div style="text-align:center; padding:40px 0; color:var(--secondary);">
            <div style="font-size:14px; font-weight:800;">문구를 생성 중입니다...</div>
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
            toast('문구 생성에 실패했습니다. 기본 문구를 불러옵니다.', 'warn');
            closeModal();
            copyReport(sid, type);
            return;
        }

        const sourceLabel = data.source === 'ai' ? 'AI 생성' : '기본 생성';
        const typeLabel = type === 'parent' ? '학부모용' : type === 'student' ? '학생용' : '상담용';
        const safeMessage = escapeHtmlForTextarea(data.message || '');

        showModal('보고 문구', `
            <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="font-size:12px; color:var(--secondary); font-weight:700;">내용을 확인하고 필요하면 수정하세요.</div>
                <div style="font-size:11px; color:var(--primary); font-weight:800; background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px; white-space:nowrap;">${sourceLabel} · ${typeLabel}</div>
            </div>
            <textarea id="ai-report-text" class="btn" style="width:100%; height:300px; padding:16px; border:none; border-radius:12px; background:var(--bg); font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; text-align:left; white-space:pre-wrap;">${safeMessage}</textarea>
        `, '최종 복사', copyAiReportText);

    } catch (e) {
        toast('네트워크 오류가 발생했습니다. 기본 문구를 불러옵니다.', 'warn');
        closeModal();
        copyReport(sid, type);
    }
}

/**
 * 생성된 AI 보고 문구 텍스트 복사
 */
function copyAiReportText() {
    const text = document.getElementById('ai-report-text')?.value || '';
    if (!text.trim()) {
        toast('복사할 문구가 없습니다.', 'warn');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        toast('문구가 복사되었습니다.', 'success');
        closeModal();
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}