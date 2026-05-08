/**
 * AP Math OS 1.0 [js/report.js]
 * 보고 문구 생성 및 AI 연동 엔진
 * [IRONCLAD 5G]&#58; 고급 발송 문구 / 미리보기 후 최종 복사 / Top Action 모달 적용
 */

/**
 * 학생의 최근 성적 평균 계산
 */
function getRecentAverage(studentId, limit = 3) {
    const scores = (state.db.exam_sessions || [])
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
function registerReportPayload(payload = {}) {
    window.AP_REPORT_CONTEXT_OPTIONS = window.AP_REPORT_CONTEXT_OPTIONS || {};
    const key = `report_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.AP_REPORT_CONTEXT_OPTIONS[key] = payload || {};
    return key;
}

function getReportPayload(payloadKey) {
    if (!payloadKey) return {};
    return window.AP_REPORT_CONTEXT_OPTIONS?.[payloadKey] || {};
}

function resolveReportOptions(options = {}) {
    if (options && options.payloadKey) return getReportPayload(options.payloadKey);
    return options || {};
}
function buildReportContext(sid, options = {}) {
    const reportOptions = resolveReportOptions(options);
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

    const latestRecord = classId
        ? (state.db.class_daily_records || [])
            .filter(r => String(r.class_id) === String(classId))
            .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null
        : null;

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
    const targetProgress = typeof computeStudentTargetProgress === 'function'
        ? computeStudentTargetProgress(sid)
        : null;

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
        latestConsultation,
        targetProgress,
        riskInfo: reportOptions.riskInfo || null,
        missingExamInfo: reportOptions.missingExamInfo || null
    };
}

/**
 * 상태 문구 변환
 */
function describeAttendance(status) {
    if (status === '등원') return '정상적으로 등원';
    if (status === '결석') return '결석';
    if (status === '지각') return '지각';
    if (status === '조퇴') return '조기 하원';
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
    const score = exam.score;
    const avgText = ctx.avg !== null ? ` 최근 3회 평균은 ${ctx.avg}점입니다.` : '';

    if (!ctx.wrongIds.length) {
        return `최근 평가인 「${exam.exam_title}」에서 ${score}점을 기록했습니다.${avgText} 모든 문항을 빠짐없이 맞혀 이번 단원 내용을 탄탄하게 소화하고 있습니다.`;
    }

    const wrongStr = ctx.wrongIds.length === 1
        ? `${ctx.wrongIds[0]}번 문항`
        : `${ctx.wrongIds.join(', ')}번 문항`;

    return `최근 평가인 「${exam.exam_title}」에서 ${score}점을 기록했습니다.${avgText} ${wrongStr}은 다음 수업에서 풀이 흐름을 함께 확인하고 유사 문제 풀이로 안정적으로 보완하겠습니다.`;
}

function buildNextPoint(ctx) {
    if (!ctx.wrongIds.length) {
        if (ctx.progressText) {
            return `${ctx.progressText} 이후 내용으로 학습을 이어가는 것`;
        }
        return '오늘 다룬 개념을 바탕으로 응용력을 한 단계 높이는 것';
    }

    const wrongStr = ctx.wrongIds.length === 1
        ? `${ctx.wrongIds[0]}번 문항 풀이 흐름 확인`
        : `${ctx.wrongIds.join(', ')}번 문항 풀이 흐름 확인`;

    if (ctx.progressText) {
        return `${wrongStr} 및 ${ctx.progressText} 흐름을 이어가는 것`;
    }
    return wrongStr;
}

/**
 * 학부모용 기본 문구 생성
 */
function buildRiskSummaryText(riskInfo) {
    if (!riskInfo) return "";
    const reasons = Array.isArray(riskInfo.reasons)
        ? riskInfo.reasons.filter(Boolean).map(v => String(v).trim()).filter(Boolean)
        : [];
    const types = Array.isArray(riskInfo.riskTypes)
        ? riskInfo.riskTypes.filter(Boolean).map(v => String(v).trim()).filter(Boolean)
        : [];
    const summary = reasons.length ? reasons.join(", ") : types.join(", ");
    if (!summary) return "";
    return `\uAD00\uB9AC \uAD00\uC810\uC5D0\uC11C\uB294 \uCD5C\uADFC ${summary} \uD750\uB984\uC774 \uBCF4\uC5EC, \uB2E4\uC74C \uC218\uC5C5\uC5D0\uC11C \uD574\uB2F9 \uBD80\uBD84\uC744 \uC6B0\uC120 \uD655\uC778\uD558\uACA0\uC2B5\uB2C8\uB2E4.`;
}

function buildMissingExamSummaryText(missingExamInfo) {
    if (!missingExamInfo) return "";
    const title = String(missingExamInfo.examTitle || "").trim() || "\uC624\uB298 \uD3C9\uAC00";
    return `\uC624\uB298 \uC9C4\uD589\uD55C \u300C${title}\u300D\uC740 \uC544\uC9C1 \uC751\uC2DC \uAE30\uB85D\uC774 \uC5C6\uC5B4, \uB2E4\uC74C \uC2DC\uAC04\uC5D0 \uBA3C\uC800 \uD655\uC778\uD560 \uC608\uC815\uC785\uB2C8\uB2E4.`;
}

function buildTargetProgressText(targetProgress) {
    if (!targetProgress || targetProgress.targetScore === null) return "";
    if (targetProgress.currentAverage === null) {
        return `\uBAA9\uD45C\uC810\uC218\uB294 ${targetProgress.targetScore}\uC810\uC73C\uB85C \uC124\uC815\uB418\uC5B4 \uC788\uC73C\uBA70, \uC131\uC801 \uAE30\uB85D\uC774 \uC313\uC774\uBA74 \uB2EC\uC131\uB960\uC744 \uD568\uAED8 \uD655\uC778\uD558\uACA0\uC2B5\uB2C8\uB2E4.`;
    }
    const rateText = targetProgress.achievementRate === null ? "" : ` \uBAA9\uD45C \uB2EC\uC131\uB960\uC740 ${targetProgress.achievementRate}%\uC785\uB2C8\uB2E4.`;
    return `\uBAA9\uD45C\uC810\uC218\uB294 ${targetProgress.targetScore}\uC810\uC774\uBA70, \uCD5C\uADFC \uD3C9\uADE0\uC740 ${targetProgress.currentAverage}\uC810\uC73C\uB85C \uBAA9\uD45C\uAE4C\uC9C0 ${targetProgress.remainScore}\uC810 \uB0A8\uC558\uC2B5\uB2C8\uB2E4.${rateText}`;
}

function appendRiskSummaryToReportText(text, ctx) {
    const summaries = [
        buildTargetProgressText(ctx?.targetProgress),
        buildRiskSummaryText(ctx?.riskInfo),
        buildMissingExamSummaryText(ctx?.missingExamInfo)
    ].filter(Boolean);
    if (!summaries.length) return text;
    const summaryText = summaries.join("\n\n");
    const thanks = '\uAC10\uC0AC\uD569\uB2C8\uB2E4';
    if (text.includes(thanks)) {
        return text.replace(thanks, `${summaryText}\n\n${thanks}`);
    }
    return `${text}\n\n${summaryText}`;
}
function buildParentReportText(ctx) {
    const s = ctx.student;
    if (!s) return '';

    const nextPoint = buildNextPoint(ctx);

    if (ctx.attendance === '결석') {
        return appendRiskSummaryToReportText(`안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 결석으로 수업에 참여하지 못했습니다.
빠진 수업 내용은 다음 시간에 진도 흐름에 맞춰 필요한 부분부터 차근차근 보충하겠습니다.

다음 수업 전까지 이전 숙제와 교재 준비만 가볍게 확인해 주시면 됩니다.

감사합니다.`, ctx);
    }

    if (ctx.attendance === '지각') {
        const progressSentence = ctx.progressText
            ? `오늘은 ${ctx.progressText} 범위를 중심으로 수업을 진행했습니다.`
            : '오늘은 현재 진도에 맞춰 개념 확인과 문제 풀이를 진행했습니다.';

        return appendRiskSummaryToReportText(`안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 늦게 도착했지만 수업에 참여했습니다.
${progressSentence}
늦게 합류하며 놓쳤을 수 있는 부분은 다음 시간 초반에 짧게 확인하고 이어가겠습니다.

감사합니다.`, ctx);
    }

    if (ctx.attendance === '조퇴') {
        const progressSentence = ctx.progressText
            ? `오늘은 ${ctx.progressText} 범위를 중심으로 수업을 진행했습니다.`
            : '오늘은 현재 진도에 맞춰 개념 확인과 문제 풀이를 진행했습니다.';

        return appendRiskSummaryToReportText(`안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 수업 중간에 일찍 귀가하였습니다.
${progressSentence}
마무리하지 못한 내용은 다음 시간 초반에 자연스럽게 연결해 진행하겠습니다.

감사합니다.`, ctx);
    }

    const progressSentence = ctx.progressText
        ? `오늘은 ${ctx.progressText} 범위를 중심으로 수업을 진행했습니다.`
        : '오늘은 현재 진도에 맞춰 개념 확인과 문제 풀이를 진행했습니다.';

    const homeworkSentence = ctx.homework === '완료'
        ? '숙제도 잘 챙겨온 모습이었습니다.'
        : ctx.homework === '미완료'
            ? '숙제는 일부 남은 부분이 있어 다음 수업 전까지 마무리하도록 안내했습니다.'
            : '';

    const examSentence = buildExamSummary(ctx);
    const examBlock = examSentence ? `\n\n${examSentence}` : '';
    const homeworkBlock = homeworkSentence ? `\n${homeworkSentence}` : '';

    return appendRiskSummaryToReportText(`안녕하세요, AP수학입니다.

오늘 ${s.name} 학생은 수업에 참여했습니다.
${progressSentence}${homeworkBlock}${examBlock}

다음 시간에는 ${nextPoint}에 집중하겠습니다.

감사합니다.`, ctx);
}

/**
 * 학생용 기본 문구 생성
 */
function buildStudentReportText(ctx) {
    const s = ctx.student;
    if (!s) return '';

    const nextPoint = buildNextPoint(ctx);
    const targetStudentLine = ctx.targetProgress && ctx.targetProgress.targetScore !== null && ctx.targetProgress.currentAverage !== null
        ? `\n\uBAA9\uD45C\uAE4C\uC9C0 ${ctx.targetProgress.remainScore}\uC810 \uB0A8\uC558\uC73C\uB2C8, \uB2E4\uC74C \uD3C9\uAC00\uB294 \uC624\uB2F5 \uC904\uC774\uB294 \uB370 \uC9D1\uC911\uD558\uC790.`
        : '';

    if (ctx.attendance === '결석') {
        return `${s.name}아, 오늘 수업은 결석으로 확인됐어.

다음 시간에 진도가 끊기지 않도록 필요한 부분부터 다시 확인할게.
오기 전에는 교재와 지난 숙제만 챙겨서 오면 돼.${targetStudentLine}`;
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
${targetStudentLine}

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
    const missingExamSection = ctx.missingExamInfo
        ? `\n[\uBBF8\uC751\uC2DC \uD3C9\uAC00]\n${ctx.missingExamInfo.examDate || ctx.today} / ${ctx.missingExamInfo.examTitle || '\uC624\uB298 \uD3C9\uAC00'} / \uB2E4\uC74C \uC218\uC5C5 \uD655\uC778 \uD544\uC694\n`
        : '';
    const targetSection = ctx.targetProgress && ctx.targetProgress.targetScore !== null
        ? `\n[\uBAA9\uD45C \uC810\uC218]\n\uBAA9\uD45C\uC810\uC218: ${ctx.targetProgress.targetScore}\uC810 / \uCD5C\uADFC\uD3C9\uADE0: ${ctx.targetProgress.currentAverage === null ? '-' : `${ctx.targetProgress.currentAverage}\uC810`} / \uB2EC\uC131\uB960: ${ctx.targetProgress.achievementRate === null ? '-' : `${ctx.targetProgress.achievementRate}%`}\n`
        : '';

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
${targetSection}

[최근 상담 기록]
${consultationLine}
${missingExamSection}
[다음 조치]
${buildNextPoint(ctx)} 중심으로 확인 필요.`;
}

/**
 * 정적 보고 문구 생성 → 미리보기 후 최종 복사
 */
/**
 * Student detail report entry point
 */
function openStudentReportModal(studentId, options = {}) {
    const payloadKey = registerReportPayload(options);
    const ctx = buildReportContext(studentId, { payloadKey });
    const student = ctx.student;

    if (!student) {
        toast('\uBCF4\uACE0 \uBB38\uAD6C\uB97C \uB9CC\uB4E4 \uD559\uC0DD \uC815\uBCF4\uB97C \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn');
        return;
    }

    const title = options.title || '\uC54C\uB9BC\uD1A1 \uBB38\uAD6C \uC0DD\uC131';
    const name = escapeHtmlForTextarea(student.name || '');

    showModal(title, [
        '<div style="display:flex; flex-direction:column; gap:10px;">',
        '<div style="padding:14px 16px; border-radius:14px; background:var(--surface-2); border:1px solid var(--border);">',
        `<div style="font-size:13px; font-weight:700; color:var(--text);">${name}</div>`,
        '<div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">\uBB38\uAD6C\uB97C \uC0DD\uC131\uD55C \uB4A4 \uB0B4\uC6A9\uC744 \uD655\uC778\uD558\uACE0 \uBCF5\uC0AC\uD569\uB2C8\uB2E4.</div>',
        '</div>',
        '<div style="display:grid; grid-template-columns:1fr; gap:8px;">',
        `<button class="btn btn-primary" style="min-height:48px; font-size:13px; font-weight:700; border-radius:12px;" onclick="copyReport('${studentId}', 'parent', { payloadKey: '${payloadKey}' })">\uD559\uBD80\uBAA8\uC6A9 \uBB38\uAD6C</button>`,
        `<button class="btn" style="min-height:48px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="copyReport('${studentId}', 'student', { payloadKey: '${payloadKey}' })">\uD559\uC0DD\uC6A9 \uBB38\uAD6C</button>`,
        `<button class="btn" style="min-height:48px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="copyReport('${studentId}', 'counsel', { payloadKey: '${payloadKey}' })">\uC0C1\uB2F4\uC6A9 \uBB38\uAD6C</button>`,
        '</div>',
        '<div style="height:1px; background:var(--border); margin:4px 0;"></div>',
        '<div style="display:grid; grid-template-columns:1fr; gap:8px;">',
        `<button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="requestAiReport('${studentId}', 'parent', { payloadKey: '${payloadKey}' })">AI \uD559\uBD80\uBAA8\uC6A9 \uBB38\uAD6C</button>`,
        `<button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="requestAiReport('${studentId}', 'student', { payloadKey: '${payloadKey}' })">AI \uD559\uC0DD\uC6A9 \uBB38\uAD6C</button>`,
        `<button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="requestAiReport('${studentId}', 'counsel', { payloadKey: '${payloadKey}' })">AI \uC0C1\uB2F4\uC6A9 \uBB38\uAD6C</button>`,
        '</div>',
        '</div>'
    ].join(''));
}
function escapeReportJsString(value) {
    return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

function makeClassReportTextId(studentId) {
    return `class-report-${String(studentId || '').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
}

function getClassReportStudents(classId) {
    const ids = (state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id));
    const activeStatus = '\uC7AC\uC6D0';

    return (state.db.students || [])
        .filter(s => ids.includes(String(s.id)) && s.status === activeStatus)
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function buildClassReportBatchHtml(classId, selectedDate = '') {
    const today = new Date().toLocaleDateString('sv-SE');
    const targetDate = selectedDate || today;
    const students = getClassReportStudents(classId);
    const safeClassId = escapeReportJsString(classId);

    const cards = students.length ? students.map(s => {
        const ctx = buildReportContext(s.id);
        const text = buildParentReportText(ctx);
        const textareaId = makeClassReportTextId(s.id);
        const safeStudentId = escapeReportJsString(s.id);
        const safeDate = escapeReportJsString(targetDate);
        const schoolText = escapeHtmlForTextarea(`${s.school_name || ''} ${s.grade || ''}`.trim());

        return [
            '<div style="padding:14px; border:1px solid var(--border); border-radius:16px; background:var(--surface); display:flex; flex-direction:column; gap:10px;">',
            '<div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">',
            `<div><div style="font-size:15px; font-weight:700; color:var(--text);">${escapeHtmlForTextarea(s.name || '')}</div><div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:3px;">${schoolText}</div></div>`,
            `<button class="btn btn-primary" style="min-height:44px; padding:10px 14px; font-size:12px; font-weight:700; border-radius:12px; flex-shrink:0;" onclick="copyClassStudentReport('${safeStudentId}', '${safeDate}')">\uBCF5\uC0AC</button>`,
            '</div>',
            `<textarea id="${textareaId}" class="btn" style="width:100%; min-height:220px; text-align:left; background:var(--bg); border:none; padding:14px; font-size:13px; line-height:1.65; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>`,
            '</div>'
        ].join('');
    }).join('') : '<div style="padding:32px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px;">\uBB38\uAD6C\uB97C \uC0DD\uC131\uD560 \uC7AC\uC6D0\uC0DD\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>';

    return [
        '<div style="display:flex; flex-direction:column; gap:14px;">',
        '<div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">',
        `<input type="date" class="btn" value="${targetDate}" style="min-height:44px; flex:1; min-width:150px; background:var(--surface-2); border:1px solid var(--border); font-weight:700;" onchange="openClassReportBatchModal('${safeClassId}', this.value)">`,
        `<button class="btn btn-primary" style="min-height:44px; padding:10px 14px; font-size:13px; font-weight:700; border-radius:12px;" onclick="copyAllClassReports('${safeClassId}', '${escapeReportJsString(targetDate)}')">\uC804\uCCB4 \uBCF5\uC0AC</button>`,
        '</div>',
        '<div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">\uD559\uBD80\uBAA8\uC6A9 \uBB38\uAD6C\uB97C \uC0DD\uC131\uD55C \uB4A4 \uB0B4\uC6A9\uC744 \uD655\uC778\uD558\uACE0 \uBCF5\uC0AC\uD569\uB2C8\uB2E4.</div>',
        `<div style="max-height:58vh; overflow-y:auto; display:flex; flex-direction:column; gap:12px; padding-right:4px;">${cards}</div>`,
        '</div>'
    ].join('');
}

function openClassReportBatchModal(classId, selectedDate = '') {
    showModal('\uBC18 \uC804\uCCB4 \uBCF4\uACE0\uBB38\uAD6C', buildClassReportBatchHtml(classId, selectedDate));
}

function copyClassStudentReport(studentId, date) {
    const textarea = document.getElementById(makeClassReportTextId(studentId));
    const text = textarea ? textarea.value : buildParentReportText(buildReportContext(studentId));
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    if (!text.trim()) { toast('\uBCF5\uC0AC\uD560 \uBB38\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn'); return; }

    navigator.clipboard.writeText(text).then(() => {
        toast(`${student?.name || '\uD559\uC0DD'} \uBB38\uAD6C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.`, 'success');
    }).catch(() => {
        toast('\uBCF5\uC0AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    });
}

function copyAllClassReports(classId, date) {
    const parts = getClassReportStudents(classId).map(s => {
        const textarea = document.getElementById(makeClassReportTextId(s.id));
        const text = textarea ? textarea.value : buildParentReportText(buildReportContext(s.id));
        return `[${s.name}]\n${text}`;
    }).filter(Boolean);

    if (!parts.length) { toast('\uBCF5\uC0AC\uD560 \uBB38\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn'); return; }

    navigator.clipboard.writeText(parts.join('\n\n--------------------\n\n')).then(() => {
        toast('\uBC18 \uC804\uCCB4 \uBB38\uAD6C\uAC00 \uBCF5\uC0AC\uB418\uC5C8\uC2B5\uB2C8\uB2E4.', 'success');
    }).catch(() => {
        toast('\uBCF5\uC0AC\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    });
}
function getReportTargetLabel(targetType) {
    if (targetType === 'parent') return '학부모용';
    if (targetType === 'student') return '학생용';
    return '상담용';
}

async function saveReportToConsultation(studentId, targetType, sourceType, textareaId) {
    const textarea = document.getElementById(textareaId);
    const text = textarea ? textarea.value.trim() : '';

    if (!text) {
        toast('저장할 문구가 없습니다.', 'warn');
        return;
    }

    const date = new Date().toLocaleDateString('sv-SE');
    const targetLabel = getReportTargetLabel(targetType);
    const sourceLabel = sourceType === 'ai' ? 'AI문구' : '기본문구';
    const content = `[보고문구 기록]\n대상: ${targetLabel}\n생성: ${sourceLabel}\n\n${text}`;

    try {
        const r = await api.post('consultations', {
            studentId,
            date,
            type: '학습',
            content,
            nextAction: '보고문구 복사/발송 후 후속 확인'
        });

        if (r?.success) {
            await loadData();
            toast('상담기록에 저장되었습니다.', 'success');
        } else {
            toast('상담기록 저장에 실패했습니다.', 'warn');
        }
    } catch (e) {
        toast('상담기록 저장에 실패했습니다.', 'warn');
    }
}

function copyReport(sid, type, options = {}) {
    const ctx = buildReportContext(sid, options);
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
            <button class="btn" style="width:100%; margin-top:10px; min-height:44px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="saveReportToConsultation('${escapeReportJsString(sid)}', '${escapeReportJsString(type)}', 'basic', 'report-copy-text')">상담기록 저장</button>
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
async function requestAiReport(sid, type, options = {}) {
    const ctx = buildReportContext(sid, options);
    const s = ctx.student;
    if (!s) return;

    const payload = {
        type,
        student: { name: s.name, school: s.school_name, grade: s.grade },
        riskInfo: ctx.riskInfo || null,
        riskSummary: buildRiskSummaryText(ctx.riskInfo),
        missingExamInfo: ctx.missingExamInfo || null,
        missingExamSummary: buildMissingExamSummaryText(ctx.missingExamInfo),
        targetProgress: ctx.targetProgress || null,
        targetSummary: buildTargetProgressText(ctx.targetProgress),
        today: {
            att: ctx.attendance,
            hw: ctx.homework,
            exam: ctx.todayExam ? {
                title: ctx.todayExam.exam_title,
                score: ctx.todayExam.score,
                wrongs: (state.db.wrong_answers || [])
                    .filter(w => w.session_id === ctx.todayExam.id)
                    .map(w => w.question_id)
                    .sort((a, b) => Number(a) - Number(b))
            } : null,
            avg: ctx.avg !== null ? ctx.avg : null
        }
    };

    showModal('보고 문구 생성', `
        <div style="text-align:center; padding:40px 0; color:var(--secondary);">
            <div style="font-size:14px; font-weight:700;">문구를 생성 중입니다...</div>
        </div>
    `);

    try {
        const r = await fetch(`${CONFIG.API_BASE}/ai/student-report`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
            body: JSON.stringify(payload)
        });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = await r.json();

        if (!data.success) {
            toast('문구 생성에 실패했습니다. 기본 문구를 불러옵니다.', 'warn');
            closeModal();
            copyReport(sid, type, options);
            return;
        }

        const sourceLabel = data.source === 'ai' ? 'AI 생성' : '기본 생성';
        const typeLabel = type === 'parent' ? '학부모용' : type === 'student' ? '학생용' : '상담용';
        const safeMessage = escapeHtmlForTextarea(data.message || '');

        showModal('보고 문구', `
            <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; gap:10px;">
                <div style="font-size:12px; color:var(--secondary); font-weight:700;">내용을 확인하고 필요하면 수정하세요.</div>
                <div style="font-size:11px; color:var(--primary); font-weight:700; background:rgba(26,92,255,0.1); padding:4px 8px; border-radius:6px; white-space:nowrap;">${sourceLabel} · ${typeLabel}</div>
            </div>
            <textarea id="ai-report-text" class="btn" style="width:100%; height:300px; padding:16px; border:none; border-radius:12px; background:var(--bg); font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; text-align:left; white-space:pre-wrap;">${safeMessage}</textarea>
            <button class="btn" style="width:100%; margin-top:10px; min-height:44px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="saveReportToConsultation('${escapeReportJsString(sid)}', '${escapeReportJsString(type)}', 'ai', 'ai-report-text')">상담기록 저장</button>
        `, '최종 복사', copyAiReportText);

    } catch (e) {
        toast('네트워크 오류가 발생했습니다. 기본 문구를 불러옵니다.', 'warn');
        closeModal();
        copyReport(sid, type, options);
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


// ─────────────────────────────────────────
// [Report Center v1] 데일리 / 평가 / 상담 리포트 구조분리
// ─────────────────────────────────────────

function reportCenterEscape(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function reportCenterAttr(value) {
    return reportCenterEscape(String(value ?? ''));
}

function reportCenterGetStudentClass(studentId) {
    const map = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    const cls = (state.db.classes || []).find(c => String(c.id) === String(map?.class_id));
    return { classMap: map || null, classId: map?.class_id || '', className: cls?.name || '반 미배정', cls: cls || null };
}

function reportCenterGetWrongIds(sessionId) {
    return (state.db.wrong_answers || [])
        .filter(w => String(w.session_id) === String(sessionId))
        .map(w => w.question_id)
        .sort((a, b) => Number(a) - Number(b));
}

function reportCenterFindBlueprint(session, questionNo) {
    const file = String(session?.archive_file || '').trim();
    const qNo = Number(questionNo);
    return (state.db.exam_blueprints || []).find(bp =>
        String(bp.archive_file || '') === file &&
        Number(bp.question_no) === qNo
    ) || null;
}

function reportCenterBuildWrongSummary(session) {
    if (!session) return [];
    const wrongIds = reportCenterGetWrongIds(session.id);
    return wrongIds.map(qNo => {
        const bp = reportCenterFindBlueprint(session, qNo);
        return {
            questionNo: qNo,
            unitKey: bp?.standard_unit_key || '',
            unit: bp?.standard_unit || '',
            course: bp?.standard_course || '',
            cluster: bp?.concept_cluster_key || ''
        };
    });
}


function reportCenterSameExamKey(session) {
    if (!session) return '';
    return [
        String(session.exam_title || '').trim(),
        String(session.exam_date || '').trim(),
        String(session.archive_file || '').trim(),
        String(session.question_count || '').trim()
    ].join('||');
}

function reportCenterGetSameExamSessions(session) {
    if (!session) return [];
    const title = String(session.exam_title || '').trim();
    const date = String(session.exam_date || '').trim();
    const archiveFile = String(session.archive_file || '').trim();
    const qCount = Number(session.question_count || 0);

    return (state.db.exam_sessions || []).filter(e => {
        if (String(e.exam_title || '').trim() !== title) return false;
        if (String(e.exam_date || '').trim() !== date) return false;
        if (archiveFile && String(e.archive_file || '').trim() !== archiveFile) return false;
        if (qCount && Number(e.question_count || 0) && Number(e.question_count || 0) !== qCount) return false;
        return true;
    });
}

function reportCenterGetClassExamSessions(session, classId) {
    const same = reportCenterGetSameExamSessions(session);
    if (!classId) return same;
    const classStudentIds = new Set((state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id)));
    return same.filter(e => classStudentIds.has(String(e.student_id)));
}

function reportCenterGetWrongSetBySession(sessionId) {
    return new Set(reportCenterGetWrongIds(sessionId).map(v => String(v)));
}

function reportCenterGetQuestionDifficultyLabel(correctRate) {
    if (!Number.isFinite(correctRate)) return '자료 부족';
    if (correctRate >= 85) return '쉬움';
    if (correctRate >= 65) return '보통';
    if (correctRate >= 45) return '어려움';
    return '매우 어려움';
}

function reportCenterGetWrongMeaning(correctRate, isStudentWrong) {
    if (!isStudentWrong) return '정답 처리';
    if (!Number.isFinite(correctRate)) return '비교 자료 부족';
    if (correctRate >= 85) return '개인 실수 가능성 큼';
    if (correctRate >= 65) return '주의 필요한 실수';
    if (correctRate >= 45) return '난도 있는 문항 오답';
    return '대부분 어려워한 문항';
}

function reportCenterBuildQuestionStats(session) {
    if (!session) {
        return { totalSessions: 0, classSessions: 0, rows: [], wrongRows: [], bucket: {}, overallAvg: null, classAvg: null };
    }

    const classInfo = reportCenterGetStudentClass(session.student_id);
    const allSessions = reportCenterGetSameExamSessions(session);
    const classSessions = reportCenterGetClassExamSessions(session, classInfo.classId);
    const studentWrongSet = reportCenterGetWrongSetBySession(session.id);
    const qCount = Number(session.question_count || 0);
    const maxQuestionNo = qCount || Math.max(
        0,
        ...reportCenterGetWrongIds(session.id).map(v => Number(v) || 0),
        ...(state.db.wrong_answers || [])
            .filter(w => allSessions.some(e => String(e.id) === String(w.session_id)))
            .map(w => Number(w.question_id) || 0)
    );

    const allSessionIds = new Set(allSessions.map(e => String(e.id)));
    const classSessionIds = new Set(classSessions.map(e => String(e.id)));
    const allWrongRows = (state.db.wrong_answers || []).filter(w => allSessionIds.has(String(w.session_id)));
    const classWrongRows = (state.db.wrong_answers || []).filter(w => classSessionIds.has(String(w.session_id)));

    const rows = [];
    for (let i = 1; i <= maxQuestionNo; i++) {
        const q = String(i);
        const wrongCount = allWrongRows.filter(w => String(w.question_id) === q).length;
        const classWrongCount = classWrongRows.filter(w => String(w.question_id) === q).length;
        const correctRate = allSessions.length ? Math.round(((allSessions.length - wrongCount) / allSessions.length) * 100) : null;
        const classCorrectRate = classSessions.length ? Math.round(((classSessions.length - classWrongCount) / classSessions.length) * 100) : null;
        const bp = reportCenterFindBlueprint(session, i);
        const isStudentWrong = studentWrongSet.has(q);
        rows.push({
            questionNo: i,
            isStudentWrong,
            wrongCount,
            correctRate,
            classWrongCount,
            classCorrectRate,
            difficulty: reportCenterGetQuestionDifficultyLabel(correctRate),
            meaning: reportCenterGetWrongMeaning(correctRate, isStudentWrong),
            unitKey: bp?.standard_unit_key || '',
            unit: bp?.standard_unit || '',
            course: bp?.standard_course || '',
            cluster: bp?.concept_cluster_key || ''
        });
    }

    const bucket = rows.reduce((acc, row) => {
        acc[row.difficulty] = (acc[row.difficulty] || 0) + 1;
        return acc;
    }, {});

    const avg = list => {
        const nums = list.map(e => Number(e.score)).filter(v => Number.isFinite(v));
        return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
    };

    return {
        totalSessions: allSessions.length,
        classSessions: classSessions.length,
        rows,
        wrongRows: rows.filter(r => r.isStudentWrong),
        bucket,
        overallAvg: avg(allSessions),
        classAvg: avg(classSessions),
        className: classInfo.className
    };
}

function reportCenterGetQuestionStatsSummary(stats) {
    if (!stats || !stats.wrongRows || !stats.wrongRows.length) return '오답 없이 마무리했습니다.';
    const personalMistakes = stats.wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const hardWrongs = stats.wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const parts = [];
    if (hardWrongs.length) parts.push(`다수가 어려워한 문항 오답 ${hardWrongs.length}개`);
    if (personalMistakes.length) parts.push(`개인 실수 가능 문항 ${personalMistakes.length}개`);
    if (!parts.length) parts.push('보통 난도 문항 중심 오답');
    return parts.join(', ');
}

function reportCenterBuildDifficultyChartHtml(stats) {
    if (!stats || !stats.rows || !stats.rows.length) return '';
    const order = ['쉬움', '보통', '어려움', '매우 어려움', '자료 부족'];
    const max = Math.max(1, ...order.map(k => stats.bucket[k] || 0));
    return `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px; display:flex; flex-direction:column; gap:9px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <div style="font-size:13px; font-weight:700; color:var(--text);">문항 난이도 분포</div>
                <div style="font-size:11px; font-weight:700; color:var(--secondary);">전체 제출 ${reportCenterEscape(stats.totalSessions)}명 기준</div>
            </div>
            ${order.map(label => {
                const count = stats.bucket[label] || 0;
                const width = Math.max(3, Math.round((count / max) * 100));
                return `
                    <div style="display:grid; grid-template-columns:64px 1fr 34px; gap:8px; align-items:center;">
                        <div style="font-size:11px; font-weight:700; color:var(--secondary);">${label}</div>
                        <div style="height:9px; border-radius:999px; background:var(--surface-2); overflow:hidden; border:1px solid var(--border);">
                            <div style="height:100%; width:${width}%; border-radius:999px; background:var(--primary);"></div>
                        </div>
                        <div style="font-size:11px; font-weight:700; color:var(--text); text-align:right;">${count}</div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}


// ─────────────────────────────────────────
// [Report Center v3] 아카이브 문항 원문 연결
// ─────────────────────────────────────────

const REPORT_CENTER_ARCHIVE_BASE_URL = 'https://icefoxtail.github.io/AP------/archive/';
const REPORT_CENTER_ARCHIVE_INDEX_URL = 'https://icefoxtail.github.io/AP------/archive/index';
const REPORT_CENTER_ARCHIVE_MIXER_URL = 'https://icefoxtail.github.io/AP------/archive/mixer.html';

function reportCenterArchiveCache() {
    window.AP_REPORT_ARCHIVE_CACHE = window.AP_REPORT_ARCHIVE_CACHE || {};
    return window.AP_REPORT_ARCHIVE_CACHE;
}

function reportCenterGetCachedArchiveDetails(sessionId) {
    return reportCenterArchiveCache()[String(sessionId || '')] || null;
}

function reportCenterSetCachedArchiveDetails(sessionId, payload) {
    if (!sessionId) return payload;
    reportCenterArchiveCache()[String(sessionId)] = payload;
    return payload;
}

function reportCenterEncodeArchivePath(path) {
    return String(path || '')
        .split('/')
        .filter(Boolean)
        .map(part => encodeURIComponent(part))
        .join('/');
}

function reportCenterNormalizeArchiveFile(raw) {
    const original = String(raw || '').trim();
    if (!original) {
        return { ok: false, type: 'none', original, path: '', url: '', message: '연결된 아카이브 파일이 없습니다.' };
    }

    if (/^MIXED:/i.test(original)) {
        return {
            ok: false,
            type: 'mixed',
            original,
            path: '',
            url: REPORT_CENTER_ARCHIVE_MIXER_URL,
            message: '믹서 출제물은 원본 문항 매핑 정보가 있어야 문항 원문을 직접 확인할 수 있습니다.'
        };
    }

    if (/^https?:\/\//i.test(original)) {
        return { ok: true, type: 'url', original, path: original, url: original, message: '' };
    }

    let path = original
        .replace(/^\.\//, '')
        .replace(/^\//, '')
        .replace(/^archive\//, '');

    if (!path.endsWith('.js')) path += '.js';
    if (!path.startsWith('exams/') && !path.startsWith('assets/') && !path.startsWith('data/')) {
        path = `exams/${path}`;
    }

    return {
        ok: true,
        type: 'archive',
        original,
        path,
        url: REPORT_CENTER_ARCHIVE_BASE_URL + reportCenterEncodeArchivePath(path),
        message: ''
    };
}

function reportCenterStripHtml(value) {
    const html = String(value || '');
    if (!html) return '';
    try {
        const div = document.createElement('div');
        div.innerHTML = html;
        return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
    } catch (e) {
        return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

function reportCenterLimitText(value, limit = 220) {
    const text = reportCenterStripHtml(value);
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function reportCenterTrimText(value, limit = 120) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function reportCenterExtractQuestionBankFromText(jsText) {
    const sandboxWindow = { questionBank: null, __questionBank: null };
    const sandboxDocument = {
        createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, innerHTML: '' }),
        head: { appendChild() {} },
        body: { appendChild() {} },
        addEventListener() {},
        querySelector: () => null,
        querySelectorAll: () => []
    };

    try {
        const fn = new Function('window', 'document', `${jsText}\n;return window.questionBank || window.__questionBank || (typeof questionBank !== 'undefined' ? questionBank : null);`);
        return fn(sandboxWindow, sandboxDocument);
    } catch (e) {
        console.warn('[reportCenterExtractQuestionBankFromText] failed:', e);
        return null;
    }
}

function reportCenterNormalizeQuestionBank(bank) {
    if (Array.isArray(bank)) return bank;
    if (!bank || typeof bank !== 'object') return [];
    if (Array.isArray(bank.questions)) return bank.questions;
    if (Array.isArray(bank.items)) return bank.items;
    if (Array.isArray(bank.data)) return bank.data;
    return Object.values(bank).filter(v => v && typeof v === 'object');
}

function reportCenterGetQuestionNoValue(question, fallbackIndex) {
    const candidates = [
        question?.questionNo,
        question?.question_no,
        question?.no,
        question?.number,
        question?.qno,
        question?.qid,
        question?.id
    ];
    for (const value of candidates) {
        const match = String(value ?? '').match(/\d+/);
        if (match) return Number(match[0]);
    }
    return fallbackIndex + 1;
}

function reportCenterFindQuestionInBank(bank, questionNo) {
    const list = reportCenterNormalizeQuestionBank(bank);
    const qNo = Number(questionNo);
    if (!qNo || !list.length) return null;

    const direct = list.find((q, idx) => reportCenterGetQuestionNoValue(q, idx) === qNo);
    if (direct) return direct;

    return list[qNo - 1] || null;
}

function reportCenterNormalizeQuestionDetail(question, questionNo, statRow = null) {
    if (!question) {
        return {
            questionNo,
            found: false,
            content: '',
            contentText: '',
            choices: [],
            answer: '',
            solution: '',
            solutionText: '',
            level: statRow?.difficulty || '',
            unit: statRow?.unit || '',
            unitKey: statRow?.unitKey || '',
            cluster: statRow?.cluster || '',
            correctRate: statRow?.correctRate ?? null,
            classCorrectRate: statRow?.classCorrectRate ?? null,
            meaning: statRow?.meaning || '문항 원문 확인 불가'
        };
    }

    const choices = Array.isArray(question.choices)
        ? question.choices
        : Array.isArray(question.options)
            ? question.options
            : [];

    return {
        questionNo,
        found: true,
        content: question.content || question.question || question.text || question.prompt || '',
        contentText: reportCenterLimitText(question.content || question.question || question.text || question.prompt || '', 260),
        choices: choices.map(v => reportCenterLimitText(v, 120)),
        answer: question.answer ?? question.correctAnswer ?? question.correct ?? question.ans ?? '',
        solution: question.solution || question.explanation || question.commentary || '',
        solutionText: reportCenterLimitText(question.solution || question.explanation || question.commentary || '', 260),
        level: question.level || question.difficulty || statRow?.difficulty || '',
        unit: question.standardUnit || question.standard_unit || question.unit || statRow?.unit || '',
        unitKey: question.standardUnitKey || question.standard_unit_key || statRow?.unitKey || '',
        cluster: question.conceptClusterKey || question.concept_cluster_key || statRow?.cluster || '',
        correctRate: statRow?.correctRate ?? null,
        classCorrectRate: statRow?.classCorrectRate ?? null,
        meaning: statRow?.meaning || ''
    };
}

async function reportCenterFetchArchiveQuestionDetails(session) {
    if (!session) {
        return { ok: false, status: 'no-session', message: '평가 기록을 찾을 수 없습니다.', details: [] };
    }

    const cached = reportCenterGetCachedArchiveDetails(session.id);
    if (cached) return cached;

    const archiveInfo = reportCenterNormalizeArchiveFile(session.archive_file || '');
    const stats = reportCenterBuildQuestionStats(session);
    const wrongRows = stats.wrongRows || [];

    if (!archiveInfo.ok) {
        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: false,
            status: archiveInfo.type,
            archiveInfo,
            message: archiveInfo.message,
            details: wrongRows.map(row => reportCenterNormalizeQuestionDetail(null, row.questionNo, row))
        });
    }

    try {
        const res = await fetch(archiveInfo.url, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const jsText = await res.text();
        const bank = reportCenterExtractQuestionBankFromText(jsText);
        const list = reportCenterNormalizeQuestionBank(bank);
        if (!list.length) throw new Error('questionBank empty');

        const details = wrongRows.map(row => {
            const q = reportCenterFindQuestionInBank(list, row.questionNo);
            return reportCenterNormalizeQuestionDetail(q, row.questionNo, row);
        });

        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: true,
            status: 'loaded',
            archiveInfo,
            message: '아카이브 문항 원문을 불러왔습니다.',
            totalQuestions: list.length,
            details
        });
    } catch (e) {
        console.warn('[reportCenterFetchArchiveQuestionDetails] failed:', e);
        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: false,
            status: 'fetch-failed',
            archiveInfo,
            message: '문항 원문 확인 불가 — 오답 번호/단원/정답률 기준 분석으로 표시합니다.',
            details: wrongRows.map(row => reportCenterNormalizeQuestionDetail(null, row.questionNo, row))
        });
    }
}

function reportCenterBuildArchiveSummaryText(detailsPayload) {
    if (!detailsPayload || !Array.isArray(detailsPayload.details) || !detailsPayload.details.length) return '';
    const lines = detailsPayload.details.map(d => {
        const rate = Number.isFinite(d.correctRate) ? `전체 정답률 ${d.correctRate}%` : '전체 정답률 자료 부족';
        const unit = d.unit ? ` / ${d.unit}` : '';
        const level = d.level ? ` / 난이도 ${d.level}` : '';
        const content = d.contentText ? ` / 문항: ${d.contentText}` : ' / 문항 원문 확인 불가';
        const answer = d.answer !== '' && d.answer !== null && d.answer !== undefined ? ` / 정답: ${d.answer}` : '';
        return `- ${d.questionNo}번${unit}${level}: ${rate} · ${d.meaning || '-'}${answer}${content}`;
    });
    return `[아카이브 문항 원문 확인]\n${lines.join('\n')}`;
}

function reportCenterPreserveArchiveText(value) {
    if (typeof value === 'function') return '';
    if (value && typeof value === 'object') return '';

    let text = String(value || '');

    text = text
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/div>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n')
        .replace(/<[^>]*>/g, ' ');

    text = text
        .replace(/([.?!\]）\)])\s*(ㄱ\.)/g, '$1\n$2')
        .replace(/\s*(ㄱ\.|ㄴ\.|ㄷ\.|ㄹ\.|ㅁ\.|ㅂ\.|ㅅ\.|ㅇ\.)\s*/g, '\n$1 ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();

    return text;
}

function reportCenterArchiveTextToHtml(value) {
    const text = reportCenterPreserveArchiveText(value);
    if (!text || reportCenterLooksLikeCodeText(text)) return '';
    return reportCenterEscape(text).replace(/\n/g, '<br>');
}

function reportCenterEnsureMathJax() {
    return new Promise(resolve => {
        if (window.MathJax?.typesetPromise) {
            resolve(window.MathJax);
            return;
        }

        if (document.getElementById('report-center-mathjax-script')) {
            const wait = () => {
                if (window.MathJax?.typesetPromise) resolve(window.MathJax);
                else setTimeout(wait, 80);
            };
            wait();
            return;
        }

        window.MathJax = window.MathJax || {
            tex: {
                inlineMath: [['$', '$'], ['\\(', '\\)']],
                displayMath: [['$$', '$$'], ['\\[', '\\]']]
            },
            svg: { fontCache: 'global' }
        };

        const script = document.createElement('script');
        script.id = 'report-center-mathjax-script';
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
        script.async = true;
        script.onload = () => resolve(window.MathJax);
        script.onerror = () => resolve(null);
        document.head.appendChild(script);
    });
}

async function reportCenterRenderMathInArchiveDetails() {
    const root = document.getElementById('report-center-archive-details');
    if (!root) return;
    const mj = await reportCenterEnsureMathJax();
    if (mj?.typesetPromise) {
        try {
            await mj.typesetPromise([root]);
        } catch (e) {
            console.warn('[reportCenterRenderMathInArchiveDetails] MathJax failed:', e);
        }
    }
}

function reportCenterRenderArchiveDetails(detailsPayload) {
    const root = document.getElementById('report-center-archive-details');
    if (!root) return;

    if (!detailsPayload) {
        root.innerHTML = '';
        return;
    }

    const archiveInfo = detailsPayload.archiveInfo || {};
    const detailRows = Array.isArray(detailsPayload.details) && detailsPayload.details.length
        ? detailsPayload.details.map(d => {
            const contentHtml = reportCenterArchiveTextToHtml(d.content);
            const answerHtml = reportCenterArchiveTextToHtml(d.answer);
            const answerRowHtml = answerHtml
                ? `<div style="font-size:12px; color:var(--primary); font-weight:700; margin-top:7px;">정답: <span class="report-archive-answer">${answerHtml}</span></div>`
                : '';
            return `
            <div style="padding:12px 0; border-bottom:1px solid var(--border);">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; flex-wrap:wrap;">
                    <div style="font-size:13px; font-weight:700; color:var(--text);">${reportCenterEscape(d.questionNo)}번 ${d.unit ? `· ${reportCenterEscape(d.unit)}` : ''}</div>
                    <div style="font-size:11px; font-weight:700; color:${d.found ? 'var(--primary)' : 'var(--secondary)'}; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; padding:3px 8px;">${d.found ? '원문 확인' : '원문 없음'}</div>
                </div>
                <div style="font-size:12px; color:var(--secondary); font-weight:700; margin-top:6px; line-height:1.55;">
                    ${Number.isFinite(d.correctRate) ? `전체 정답률 ${d.correctRate}%` : '전체 정답률 -'}${Number.isFinite(d.classCorrectRate) ? ` · 반 정답률 ${d.classCorrectRate}%` : ''} · ${reportCenterEscape(d.meaning || '-')}
                </div>
                ${contentHtml ? `<div class="report-archive-question-text" style="font-size:12px; color:var(--text); line-height:1.65; margin-top:8px; background:var(--surface-2); border-radius:10px; padding:9px 10px; white-space:normal;">${contentHtml}</div>` : ''}
                ${answerRowHtml}
                ${d.solutionText ? `<div style="font-size:12px; color:var(--secondary); line-height:1.6; margin-top:7px;">해설 요약: ${reportCenterEscape(d.solutionText)}</div>` : ''}
            </div>
        `;
        }).join('')
        : `<div style="padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">표시할 오답 문항이 없습니다.</div>`;

    root.innerHTML = `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                <div>
                    <div style="font-size:13px; font-weight:700; color:var(--text);">아카이브 문항 원문</div>
                    <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:3px; line-height:1.5;">${reportCenterEscape(detailsPayload.message || '')}</div>
                </div>
                <a href="${reportCenterAttr(archiveInfo.url || REPORT_CENTER_ARCHIVE_INDEX_URL)}" target="_blank" rel="noopener" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; white-space:nowrap;">아카이브 열기</a>
            </div>
            <div style="font-size:11px; color:var(--secondary); font-weight:700; word-break:break-all; margin-bottom:8px;">${reportCenterEscape(archiveInfo.original || archiveInfo.path || '')}</div>
            ${detailRows}
            <button class="btn" style="width:100%; min-height:42px; margin-top:10px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14); color:var(--primary);" onclick="reportCenterAppendArchiveSummaryToExamText('${reportCenterAttr(detailsPayload.sessionId || '')}')">원문 분석 요약을 본문에 추가</button>
        </div>
    `;
    reportCenterRenderMathInArchiveDetails();
}

async function reportCenterLoadArchiveQuestionDetails(studentId, sessionId, options = {}) {
    const root = document.getElementById('report-center-archive-details');
    const session = (state.db.exam_sessions || []).find(e => String(e.id) === String(sessionId));
    if (!session) {
        if (!options.silent) toast('평가 기록을 찾을 수 없습니다.', 'warn');
        return;
    }

    if (root) {
        root.innerHTML = `
            <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:16px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">
                아카이브 문항 원문을 확인하는 중입니다...
            </div>
        `;
    }

    const payload = await reportCenterFetchArchiveQuestionDetails(session);
    payload.sessionId = session.id;
    reportCenterSetCachedArchiveDetails(session.id, payload);
    reportCenterRenderArchiveDetails(payload);

    if (!options.silent) {
        toast(payload.ok ? '문항 원문을 불러왔습니다.' : '문항 원문 확인이 제한됩니다.', payload.ok ? 'success' : 'warn');
    }
}

function reportCenterAppendArchiveSummaryToExamText(sessionId) {
    const cached = reportCenterGetCachedArchiveDetails(sessionId);
    const summary = reportCenterBuildArchiveSummaryText(cached);
    const textarea = document.getElementById('report-center-exam-text');
    if (!textarea || !summary) {
        toast('추가할 문항 원문 요약이 없습니다.', 'warn');
        return;
    }
    const current = textarea.value.trim();
    if (current.includes('[아카이브 문항 원문 확인]')) {
        toast('이미 본문에 추가되어 있습니다.', 'info');
        return;
    }
    textarea.value = `${current}\n\n${summary}`.trim();
    toast('문항 원문 요약을 본문에 추가했습니다.', 'success');
}

function reportCenterBuildArchiveStatusHtml(session) {
    const archiveInfo = reportCenterNormalizeArchiveFile(session?.archive_file || '');
    const safeStudentId = escapeReportJsString(session?.student_id || '');
    const safeSessionId = escapeReportJsString(session?.id || '');
    const linkUrl = archiveInfo.url || REPORT_CENTER_ARCHIVE_INDEX_URL;
    const desc = archiveInfo.type === 'mixed'
        ? '믹서 출제물입니다. 원본 문항 매핑이 있으면 후속 단계에서 개별 원문까지 연결합니다.'
        : archiveInfo.ok
            ? '연결된 JS아카이브 파일에서 오답 문항 원문을 확인합니다.'
            : archiveInfo.message;

    return `
        <div style="border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:13px 14px; display:flex; flex-direction:column; gap:9px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div>
                    <div style="font-size:13px; font-weight:700; color:var(--text);">아카이브 원문 연결</div>
                    <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:3px; line-height:1.5;">${reportCenterEscape(desc)}</div>
                </div>
                <a href="${reportCenterAttr(linkUrl)}" target="_blank" rel="noopener" style="font-size:11px; font-weight:700; color:var(--primary); text-decoration:none; white-space:nowrap;">열기</a>
            </div>
            <div style="font-size:11px; font-weight:700; color:var(--secondary); word-break:break-all; background:var(--surface-2); border-radius:10px; padding:8px 10px;">${reportCenterEscape(session?.archive_file || 'archive_file 없음')}</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn" style="min-height:42px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14); color:var(--primary);" onclick="reportCenterLoadArchiveQuestionDetails('${safeStudentId}', '${safeSessionId}')">문항 원문 확인</button>
                <button class="btn" style="min-height:42px; font-size:12px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--text);" onclick="window.open('${REPORT_CENTER_ARCHIVE_MIXER_URL}', '_blank', 'noopener')">믹서 열기</button>
            </div>
        </div>
        <div id="report-center-archive-details"></div>
    `;
}


function reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session || !data.stats) return null;

    const stats = data.stats;
    const wrongRows = stats.wrongRows || [];
    const wrongCount = wrongRows.length;
    const qCount = Number(data.session.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const baseDiagnosisLines = reportCenterBuildExamDiagnosisLines(data, teacherMemo);
    const meaningLines = reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, null);
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 3);
    const recentAvg = getRecentAverage(data.student.id, 3);

    const nextActions = [];
    if (wrongRows.length) {
        const wrongNums = priorityRows.map(r => `${r.questionNo}번`).join(', ');
        if (unitNames.length) nextActions.push(`${unitNames.join(', ')} 단원을 우선 확인합니다.`);
        if (wrongNums) nextActions.push(`${wrongNums} 문항의 풀이 과정을 함께 다시 확인합니다.`);
        nextActions.push('조건 표시, 식 세우기, 계산 정리, 검산 습관을 순서대로 점검합니다.');
        nextActions.push('유사 문제로 같은 유형의 풀이 흐름을 한 번 더 확인합니다.');
    } else {
        nextActions.push('현재 정확도를 유지하며 다음 단원 학습으로 이어갑니다.');
        nextActions.push('전체 정답률이 낮았던 핵심 문항의 풀이 흐름을 다시 확인해 강점을 유지합니다.');
        nextActions.push('심화 응용 문항으로 사고 폭을 넓힙니다.');
    }
    nextActions.push('필요 시 확인문제와 유사 유형 문제를 추가로 제공하겠습니다.');

    const studentName = data.student.name || '학생';
    const parentMessage = wrongRows.length
        ? `이번 리포트는 점수뿐 아니라 ${studentName} 학생이 어떤 문항에서 확인할 부분이 있었는지, 그리고 그 문항이 어느 정도 난도의 문항이었는지를 함께 정리한 자료입니다. 학원에서는 다음 수업에서 우선 보완 문항의 풀이 흐름을 확인하고, 같은 실수가 반복되지 않도록 유사 문제 풀이까지 함께 진행하겠습니다. 가정에서는 문제를 풀 때 조건에 표시하는 습관과 풀이 후 한 번 더 확인하는 것만 가볍게 격려해 주시면 큰 도움이 됩니다.`
        : `${studentName} 학생이 이번 평가에서 모든 문항을 정확하게 맞혔습니다. 꾸준한 노력이 결과로 나타나고 있으며, 학원에서는 이 흐름을 이어갈 수 있도록 다음 단원과 심화 응용 학습을 차근차근 준비하겠습니다. 가정에서는 지금처럼 학습 환경을 유지해 주시면 충분합니다.`;

    return {
        purpose: 'AI must improve this existing base report, not replace it from scratch.',
        achievementSummary: meaningLines[0] || '',
        evaluationMeaning: meaningLines,
        diagnosis: baseDiagnosisLines,
        nextPlanItems: nextActions,
        parentMessage,
        kakaoSummary: reportCenterBuildExamPreview(studentId, sessionId),
        teacherMemo: teacherMemo || '',
        constraints: [
            '기본 리포트보다 더 짧거나 딱딱하게 만들지 않는다.',
            '같은 문장을 반복하지 않는다.',
            '성취 확인으로 시작하고 보완은 관리 계획으로 표현한다.',
            'nextPlan과 nextActions는 중복되지 않게 역할을 분리한다.',
            '학부모용 문장에 확인 불가, 자료 없음, 아카이브, 시스템, 함수, 코드라는 표현을 쓰지 않는다.'
        ],
        metrics: {
            score: data.session.score,
            correctRate,
            recentAverage: recentAvg,
            overallAverage: stats.overallAvg,
            classAverage: stats.classAvg,
            totalSubmitted: stats.totalSessions,
            classSubmitted: stats.classSessions,
            wrongCount
        }
    };
}

function reportCenterBuildExamAiPayload(studentId, sessionId) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const session = (state.db.exam_sessions || []).find(e => String(e.id) === String(sessionId));
    const stats = reportCenterBuildQuestionStats(session);
    const archiveQuestionDetails = session ? reportCenterGetCachedArchiveDetails(session.id) : null;
    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    const baseReportDraft = reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo);
    return {
        reportType: 'exam_revision',
        revisionMode: true,
        instruction: '기존 기본 리포트를 처음부터 갈아엎지 말고, 중복을 줄이고 문장을 더 자연스럽고 신뢰감 있게 다듬어라.',
        student: student ? {
            id: student.id,
            name: student.name,
            school: student.school_name,
            grade: student.grade,
            targetScore: student.target_score || null
        } : null,
        exam: session ? {
            id: session.id,
            title: session.exam_title,
            date: session.exam_date,
            score: session.score,
            questionCount: session.question_count,
            archiveFile: session.archive_file || ''
        } : null,
        cohort: {
            totalSubmitted: stats.totalSessions,
            classSubmitted: stats.classSessions,
            overallAverage: stats.overallAvg,
            classAverage: stats.classAvg,
            className: stats.className
        },
        questionAnalysis: stats.rows,
        wrongAnalysis: stats.wrongRows,
        baseReportDraft,
        archiveQuestionDetails: archiveQuestionDetails ? {
            status: archiveQuestionDetails.status,
            message: archiveQuestionDetails.message,
            archiveFile: archiveQuestionDetails.archiveInfo?.original || '',
            archiveUrl: archiveQuestionDetails.archiveInfo?.url || '',
            details: archiveQuestionDetails.details || []
        } : null,
        teacherMemo
    };
}

function reportCenterGetRecentConsultations(studentId, limit = 5) {
    return (state.db.consultations || [])
        .filter(c => String(c.student_id) === String(studentId))
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        .slice(0, limit);
}

function reportCenterBuildDailyPreview(ctx) {
    const s = ctx.student;
    if (!s) return '';
    return buildParentReportText(ctx);
}

function reportCenterBuildExamPreview(studentId, sessionId = '') {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const sessions = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));
    const selected = sessionId
        ? sessions.find(e => String(e.id) === String(sessionId))
        : sessions[0];

    if (!student || !selected) return '';

    const stats = reportCenterBuildQuestionStats(selected);
    const wrongRows = stats.wrongRows || [];
    const wrongSummary = reportCenterBuildWrongSummary(selected);
    const avg = getRecentAverage(studentId, 3);
    const qCount = Number(selected.question_count || 0);
    const wrongCount = wrongRows.length;
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const targetProgress = typeof computeStudentTargetProgress === 'function'
        ? computeStudentTargetProgress(studentId)
        : null;

    const compareParts = [];
    if (stats.overallAvg !== null) compareParts.push(`전체 평균 ${stats.overallAvg}점`);
    if (stats.classAvg !== null) compareParts.push(`${stats.className || '반'} 평균 ${stats.classAvg}점`);
    const compareText = compareParts.length ? ` (${compareParts.join(', ')})` : '';

    const targetLine = targetProgress && targetProgress.targetScore !== null && targetProgress.currentAverage !== null
        ? `목표 ${targetProgress.targetScore}점까지 ${targetProgress.remainScore}점 남았습니다. 현재 흐름을 유지할 수 있도록 학원에서 계속 관리하겠습니다.`
        : '';

    if (!wrongCount) {
        return `안녕하세요, AP수학입니다.

${student.name} 학생의 「${selected.exam_title || '평가'}」 결과를 안내드립니다.

이번 평가에서 ${selected.score}점을 기록했습니다.${compareText ? ` ${compareText}` : ''}${avg !== null ? ` 최근 3회 평균은 ${avg}점입니다.` : ''}${correctRate !== null ? ` 정답률 ${correctRate}%입니다.` : ''}
모든 문항을 빠짐없이 맞혀 이번 범위를 매우 안정적으로 소화하고 있습니다.

${targetLine ? `${targetLine}\n\n` : ''}다음 수업에서는 이번 성취를 바탕으로 다음 단원과 심화 응용 학습을 이어가겠습니다.

자세한 내용은 함께 전달드리는 PDF 리포트에서 확인하실 수 있습니다.

감사합니다.`;
    }

    const displayRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const mainUnits = Array.from(new Set(wrongSummary.map(w => w.unit).filter(Boolean))).slice(0, 3);
    const wrongDetailLines = displayRows.map(r => {
        const unit = r.unit ? ` (${r.unit})` : '';
        if (!Number.isFinite(r.correctRate)) return `${r.questionNo}번${unit} — 풀이 과정을 함께 확인하겠습니다.`;
        if (r.correctRate >= 85) return `${r.questionNo}번${unit} — 대부분 맞힌 문항으로, 조건 확인과 검산 습관을 점검하겠습니다.`;
        if (r.correctRate >= 65) return `${r.questionNo}번${unit} — 보통 난도 문항으로, 개념 적용 과정을 다시 확인하겠습니다.`;
        return `${r.questionNo}번${unit} — 난도가 있었던 문항으로, 개념 연결과 접근 순서를 함께 정리하겠습니다.`;
    });
    const hiddenText = wrongRows.length > displayRows.length
        ? `\n그 외 ${wrongRows.length - displayRows.length}개 문항은 클리닉 시간과 개별 오답 노트로 순차적으로 확인하겠습니다.`
        : '';
    const unitComment = mainUnits.length
        ? `이번에 우선적으로 보완할 단원은 ${mainUnits.join(', ')}입니다.`
        : '특정 단원에만 치우치기보다 풀이 과정 전반을 함께 점검하겠습니다.';

    return `안녕하세요, AP수학입니다.

${student.name} 학생의 「${selected.exam_title || '평가'}」 결과를 안내드립니다.

이번 평가에서 ${selected.score}점을 기록했습니다.${compareText ? ` ${compareText}` : ''}${avg !== null ? ` 최근 3회 평균은 ${avg}점입니다.` : ''}${correctRate !== null ? ` 정답률 ${correctRate}%입니다.` : ''}

${targetLine ? `${targetLine}\n\n` : ''}이번 평가에서 우선 확인할 문항은 다음과 같습니다.
${wrongDetailLines.map(l => `• ${l}`).join('\n')}${hiddenText}

${unitComment}
다음 수업에서 풀이 흐름을 함께 확인하고, 유사 문제 풀이로 같은 실수가 반복되지 않도록 보완하겠습니다.

자세한 분석 내용은 함께 전달드리는 PDF 리포트에서 확인하실 수 있습니다.

감사합니다.`;
}

function reportCenterBuildCounselPreview(studentId) {
    const ctx = buildReportContext(studentId);
    const student = ctx.student;
    if (!student) return '';

    const consultations = reportCenterGetRecentConsultations(studentId, 3);
    const exams = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))
        .slice(0, 5);
    const examLine = exams.length
        ? exams.map(e => `${e.exam_date || '-'} ${e.exam_title || '평가'} ${e.score}점`).join('\n')
        : '최근 시험 기록 없음';
    const consultLine = consultations.length
        ? consultations.map(c => `${c.date || '-'} ${c.type || '상담'}: ${c.content || ''}`).join('\n')
        : '최근 상담 기록 없음';

    return `[상담 리포트 초안]

학생: ${student.name}
학급: ${ctx.className || '미배정'}
기준일: ${ctx.today}

[최근 성적 흐름]
${examLine}

[최근 상담 기록]
${consultLine}

[현재 확인 포인트]
출결: ${ctx.attendance}
숙제: ${ctx.homework}
최근 진도: ${ctx.progressText || '최근 진도 기록 없음'}

[상담 방향]
최근 성적, 숙제, 출결, 상담 기록을 함께 보고 학습 습관과 반복 약점을 정리합니다.
학부모님께는 단순 점수보다 현재 흔들리는 원인과 다음 관리 방향을 중심으로 안내하는 것이 좋습니다.`;
}

function reportCenterCopyText(textareaId) {
    const text = document.getElementById(textareaId)?.value || '';
    if (!text.trim()) {
        toast('복사할 문구가 없습니다.', 'warn');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        toast('문구가 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function reportCenterPrintText(textareaId, title = 'AP Math Report') {
    const text = document.getElementById(textareaId)?.value || '';
    if (!text.trim()) {
        toast('출력할 내용이 없습니다.', 'warn');
        return;
    }

    const win = window.open('', '_blank');
    if (!win) {
        toast('팝업 차단을 해제한 뒤 다시 시도하세요.', 'warn');
        return;
    }

    win.document.write(`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<title>${reportCenterEscape(title)}</title>
<style>
    body { font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; margin: 0; padding: 32px; color: #111827; line-height: 1.75; }
    .page { max-width: 760px; margin: 0 auto; }
    h1 { margin: 0 0 18px; font-size: 22px; letter-spacing: -0.5px; }
    pre { white-space: pre-wrap; word-break: keep-all; font-family: inherit; font-size: 14px; margin: 0; }
    @media print { body { padding: 24px; } }
</style>
</head>
<body>
<div class="page">
<h1>${reportCenterEscape(title)}</h1>
<pre>${reportCenterEscape(text)}</pre>
</div>
<script>window.onload=function(){window.print();};<\/script>
</body>
</html>`);
    win.document.close();
}


function reportCenterEnsureWideOverlay() {
    let overlay = document.getElementById('report-center-wide-overlay');
    if (overlay) return overlay;

    const style = document.createElement('style');
    style.id = 'report-center-wide-style';
    style.textContent = `
        #report-center-wide-overlay { position:fixed; inset:0; z-index:1400; background:rgba(15,23,42,0.48); display:none; align-items:center; justify-content:center; padding:18px; box-sizing:border-box; backdrop-filter:blur(5px); -webkit-backdrop-filter:blur(5px); }
        #report-center-wide-overlay.show { display:flex; }
        .report-center-wide-content { width:min(1120px, 100%); height:min(92vh, 980px); background:var(--surface); border:1px solid var(--border); border-radius:24px; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 24px 80px rgba(15,23,42,0.22); }
        .report-center-wide-header { display:grid; grid-template-columns:84px 1fr 84px; align-items:center; gap:8px; min-height:58px; padding:12px 18px; border-bottom:1px solid var(--border); background:var(--surface); flex-shrink:0; }
        .report-center-wide-title { margin:0; text-align:center; font-size:20px; font-weight:700; color:var(--text); letter-spacing:-0.4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .report-center-wide-close { border:0; background:transparent; color:var(--secondary); font-size:15px; font-weight:700; font-family:inherit; text-align:left; cursor:pointer; padding:8px 0; }
        .report-center-wide-spacer { width:84px; }
        .report-center-wide-body { flex:1; min-height:0; overflow:auto; overflow-x:auto; padding:20px 22px 24px; box-sizing:border-box; -webkit-overflow-scrolling:touch; }
        .report-center-wide-body #report-center-premium-preview { max-width:100%; }
        .report-center-wide-body .aprc-document { min-width:760px; }
        @media (max-width:760px) {
            #report-center-wide-overlay { align-items:stretch; justify-content:stretch; padding:0; }
            .report-center-wide-content { width:100%; height:100%; max-height:none; border-radius:0; border:0; }
            .report-center-wide-header { grid-template-columns:56px 1fr 56px; min-height:56px; padding:10px 14px; }
            .report-center-wide-title { font-size:18px; }
            .report-center-wide-spacer { width:56px; }
            .report-center-wide-body { padding:16px 12px 22px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
            .report-center-wide-body #report-center-premium-preview { min-width:760px; width:760px; }
            .report-center-wide-body .aprc-document { min-width:760px; max-width:760px; }
        }
    `;
    if (!document.getElementById('report-center-wide-style')) document.head.appendChild(style);

    overlay = document.createElement('div');
    overlay.id = 'report-center-wide-overlay';
    overlay.innerHTML = `
        <div class="report-center-wide-content" onclick="event.stopPropagation()">
            <div class="report-center-wide-header">
                <button class="report-center-wide-close" onclick="reportCenterCloseWideOverlay()">취소</button>
                <h2 class="report-center-wide-title" id="report-center-wide-title">리포트 센터</h2>
                <div class="report-center-wide-spacer"></div>
            </div>
            <div class="report-center-wide-body" id="report-center-wide-body"></div>
        </div>
    `;
    overlay.onclick = function(event) {
        if (event.target === overlay) reportCenterCloseWideOverlay();
    };
    document.body.appendChild(overlay);
    return overlay;
}

function reportCenterShowWideModal(title, html) {
    const overlay = reportCenterEnsureWideOverlay();
    const titleEl = document.getElementById('report-center-wide-title');
    const bodyEl = document.getElementById('report-center-wide-body');
    overlay.classList.remove('show');
    overlay.style.pointerEvents = 'auto';
    if (titleEl) titleEl.innerText = title || '리포트 센터';
    if (bodyEl) {
        bodyEl.innerHTML = '';
        bodyEl.scrollTop = 0;
        bodyEl.innerHTML = html || '';
    }
    requestAnimationFrame(() => overlay.classList.add('show'));
}

function reportCenterCloseWideOverlay() {
    const overlay = document.getElementById('report-center-wide-overlay');
    const bodyEl = document.getElementById('report-center-wide-body');
    if (overlay) {
        overlay.classList.remove('show');
        overlay.style.pointerEvents = 'auto';
    }
    if (bodyEl) bodyEl.innerHTML = '';
    window.AP_REPORT_CENTER_RENDER_TOKEN = (window.AP_REPORT_CENTER_RENDER_TOKEN || 0) + 1;
}

function reportCenterBaseShell(studentId, activeTab, bodyHtml) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const name = student?.name || '학생';
    const tabs = [
        { key: 'daily', label: '오늘 리포트' },
        { key: 'exam', label: '평가 리포트' },
        { key: 'counsel', label: '상담 리포트' }
    ];

    return `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="padding:14px 16px; border-radius:16px; background:var(--surface-2); border:1px solid var(--border);">
                <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.4;">${reportCenterEscape(name)} 리포트 센터</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px; line-height:1.5;">카톡 문구와 출력용 리포트를 목적별로 나눠 생성합니다.</div>
            </div>
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:6px; background:var(--bg); padding:4px; border-radius:14px;">
                ${tabs.map(t => `
                    <button class="btn ${activeTab === t.key ? 'btn-primary' : ''}"
                            style="min-height:42px; padding:8px 6px; font-size:12px; font-weight:700; border-radius:10px; box-shadow:none; ${activeTab === t.key ? '' : 'background:var(--surface); border:1px solid var(--border);'}"
                            onclick="openReportCenterModal('${escapeReportJsString(studentId)}', '${t.key}')">${t.label}</button>
                `).join('')}
            </div>
            ${bodyHtml}
        </div>
    `;
}

function openReportCenterModal(studentId, activeTab = 'daily') {
    if (activeTab === 'exam') return openReportCenterExam(studentId);
    if (activeTab === 'counsel') return openReportCenterCounsel(studentId);
    return openReportCenterDaily(studentId);
}

function openReportCenterDaily(studentId) {
    const ctx = buildReportContext(studentId);
    if (!ctx.student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const text = reportCenterBuildDailyPreview(ctx);
    const body = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">출결</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.attendance)}</div>
                </div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">숙제</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.homework)}</div>
                </div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);">
                    <div style="font-size:11px; font-weight:700; color:var(--secondary);">최근평균</div>
                    <div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${ctx.avg === null ? '-' : `${ctx.avg}점`}</div>
                </div>
            </div>
            <textarea id="report-center-daily-text" class="btn" style="width:100%; min-height:300px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterCopyText('report-center-daily-text')">카톡 문구 복사</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportCenterPrintText('report-center-daily-text', 'AP Math 데일리 리포트')">출력</button>
            </div>
            <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="requestAiReport('${escapeReportJsString(studentId)}', 'parent')">AI 데일리 문구 생성</button>
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'daily', body));
}


// ─────────────────────────────────────────
// [Report Center v4] 프리미엄 PDF 평가 리포트 디자인 정식화
// ─────────────────────────────────────────

function reportCenterSafePercent(value) {
    return Number.isFinite(value) ? `${value}%` : '-';
}

function reportCenterGetTargetProgressForReport(studentId) {
    if (typeof computeStudentTargetProgress === 'function') {
        return computeStudentTargetProgress(studentId);
    }
    return null;
}

function reportCenterGetExamReportData(studentId, sessionId = '') {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const sessions = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));
    const session = sessionId
        ? sessions.find(e => String(e.id) === String(sessionId))
        : sessions[0];

    if (!student || !session) {
        return { student: student || null, session: session || null, sessions, stats: null, wrongSummary: [], classInfo: reportCenterGetStudentClass(studentId), targetProgress: null, archiveDetails: null };
    }

    const stats = reportCenterBuildQuestionStats(session);
    const wrongSummary = reportCenterBuildWrongSummary(session);
    const classInfo = reportCenterGetStudentClass(studentId);
    const targetProgress = reportCenterGetTargetProgressForReport(studentId);
    const archiveDetails = reportCenterGetCachedArchiveDetails(session.id);

    return { student, session, sessions, stats, wrongSummary, classInfo, targetProgress, archiveDetails };
}

function reportCenterGetExamReportTeacherMemo() {
    return String(document.getElementById('report-center-exam-teacher-memo')?.value || '').trim();
}


function reportCenterAiAnalysisCache() {
    window.AP_REPORT_AI_ANALYSIS_CACHE = window.AP_REPORT_AI_ANALYSIS_CACHE || {};
    return window.AP_REPORT_AI_ANALYSIS_CACHE;
}

function reportCenterGetCachedAiAnalysis(sessionId) {
    return reportCenterAiAnalysisCache()[String(sessionId || '')] || null;
}

function reportCenterSetCachedAiAnalysis(sessionId, payload) {
    if (!sessionId || !payload) return payload;
    const normalized = reportCenterNormalizeAiAnalysis(payload);
    if (String(normalized.source || '').toLowerCase() !== 'ai') {
        delete reportCenterAiAnalysisCache()[String(sessionId)];
        return normalized;
    }
    reportCenterAiAnalysisCache()[String(sessionId)] = normalized;
    return normalized;
}

function reportCenterClearCachedAiAnalysis(sessionId) {
    if (!sessionId) return;
    delete reportCenterAiAnalysisCache()[String(sessionId)];
}

function reportCenterResetExamAiAnalysis(studentId, sessionId = '') {
    reportCenterClearCachedAiAnalysis(sessionId);
    reportCenterRefreshPremiumExamPreview(studentId, sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
}

function reportCenterNormalizeAiAnalysis(raw = {}) {
    const safeString = (value) => String(value || '').trim();
    const safeArray = (value) => Array.isArray(value) ? value.map(v => safeString(v)).filter(Boolean).slice(0, 8) : [];
    const risk = safeString(raw.riskLevel || 'stable');
    return {
        summary: safeString(raw.summary),
        diagnosis: safeString(raw.diagnosis),
        wrongAnalysis: safeString(raw.wrongAnalysis),
        nextPlan: safeString(raw.nextPlan),
        parentMessage: safeString(raw.parentMessage),
        kakaoSummary: safeString(raw.kakaoSummary),
        teacherMemo: safeString(raw.teacherMemo),
        riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
        mainWeaknesses: safeArray(raw.mainWeaknesses),
        nextActions: safeArray(raw.nextActions),
        source: safeString(raw.source || raw._source || ''),
        generatedAt: safeString(raw.generatedAt || new Date().toISOString())
    };
}

function reportCenterGetAiAnalysisForReport(sessionId, options = {}) {
    const candidate = options.aiAnalysis ? reportCenterNormalizeAiAnalysis(options.aiAnalysis) : reportCenterGetCachedAiAnalysis(sessionId);
    if (!candidate) return null;
    return String(candidate.source || '').toLowerCase() === 'ai' ? candidate : null;
}

function reportCenterBuildExamDiagnosisLines(data, teacherMemo = '') {
    const stats = data.stats;
    const wrongRows = stats?.wrongRows || [];
    const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const personalWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 3);
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const lines = [];

    if (!wrongRows.length) {
        const excellentNums = excellentRows.length ? excellentRows.map(r => `${r.questionNo}번`).join(', ') : '';
        lines.push(excellentNums
            ? `이번 평가는 전 문항을 정확하게 풀어내며 매우 안정적인 성취를 보여주었습니다. 특히 전체 정답률이 낮았던 ${excellentNums} 문항까지 흔들림 없이 해결한 점에서 개념 이해와 풀이 집중도가 잘 유지되고 있음을 확인할 수 있습니다.`
            : '이번 평가는 전 문항을 정확하게 풀어내며 매우 안정적인 성취를 보여주었습니다. 꼼꼼한 풀이 습관이 결과로 나타나고 있으며, 다음 단원에서도 이 흐름을 이어가겠습니다.');
        lines.push('다음 수업에서는 현재의 정확도를 유지하면서 심화 응용 문제로 학습 폭을 넓혀가겠습니다.');
    } else {
        if (wrongRows.length > 5) {
            lines.push('이번 리포트에서는 맞출 수 있었던 문항과 핵심 보완 문항을 우선으로 정리했습니다. 전체 오답 개수보다 우선 교정할 풀이 습관과 단원 흐름을 차근차근 잡는 것이 중요합니다.');
        }
        if (hardWrongs.length) {
            lines.push(`전체적으로 난도가 있었던 문항이 ${hardWrongs.length}개 포함되어 있습니다. 단순 실수로만 보기보다 해당 개념의 연결 과정과 문제 접근 순서를 함께 점검하겠습니다.`);
        }
        if (personalWrongs.length) {
            lines.push(`대부분 학생이 맞힌 문항에서 ${personalWrongs.length}개 확인 포인트가 있었습니다. 개념보다 조건 확인, 계산 정리, 검산 습관을 먼저 점검하겠습니다.`);
        }
        if (unitNames.length) {
            lines.push(`이번에 집중적으로 보완할 단원은 ${unitNames.join(', ')}입니다. 다음 수업에서 핵심 유형을 짧게 재확인한 뒤 유사 문제로 연결하겠습니다.`);
        }
        if (!hardWrongs.length && !personalWrongs.length && !unitNames.length) {
            lines.push('오답 수가 많지는 않지만 풀이 과정의 세밀한 부분에서 확인할 지점이 있었습니다. 조건 표시와 검산 습관을 함께 점검하겠습니다.');
        }
    }

    if (teacherMemo) {
        lines.push(`담당 선생님 확인 사항: ${teacherMemo}`);
    }

    return lines;
}

function reportCenterGetQuestionDetailMap(data) {
    const map = new Map();
    const details = data.archiveDetails?.details || [];
    details.forEach(d => map.set(String(d.questionNo), d));
    return map;
}


function reportCenterLooksLikeCodeText(value) {
    const text = String(value || '').trim();
    if (!text) return false;
    if (/function\s*\(|=>|\breturn\b|document\.|window\.|createElement|appendChild|querySelector|<script|onclick=|<svg|<canvas/i.test(text)) return true;
    if (/[{};]\s*(const|let|var|function)\b/i.test(text)) return true;
    return false;
}

function reportCenterSafeQuestionText(value, limit = 110) {
    if (typeof value === 'function') return '';
    if (value && typeof value === 'object') return '';
    const stripped = reportCenterStripHtml(value);
    if (!stripped || reportCenterLooksLikeCodeText(stripped)) return '';
    return reportCenterTrimText(stripped, limit);
}

function reportCenterBuildParentQuestionInsight(row, detail = null) {
    const qNo = row?.questionNo || detail?.questionNo || '';
    const unit = row?.unit || detail?.unit || '해당 단원';
    const rate = Number.isFinite(row?.correctRate) ? row.correctRate : null;

    if (rate !== null && rate >= 85) {
        return `${qNo}번 문항은 ${unit}의 기본 개념과 풀이 정확도를 확인하는 유형입니다. 전체 정답률이 높은 편이어서 조건 확인, 계산 정리, 검산 습관을 우선 점검하겠습니다.`;
    }
    if (rate !== null && rate >= 65) {
        return `${qNo}번 문항은 ${unit} 개념을 실제 풀이 과정에 적용하는 유형입니다. 풀이 방향을 잡은 뒤 중간 조건을 정확히 연결하는 과정을 함께 확인하겠습니다.`;
    }
    if (rate !== null && rate >= 45) {
        return `${qNo}번 문항은 ${unit}에서 조건 해석과 개념 적용을 함께 요구하는 유형입니다. 다음 수업에서 문제 조건을 정리하고 풀이 순서를 세우는 과정을 다시 확인하겠습니다.`;
    }
    if (rate !== null) {
        return `${qNo}번 문항은 ${unit}에서 난도가 있었던 문항입니다. 개념 연결과 심화 적용 과정을 함께 정리하며 안정적으로 보완하겠습니다.`;
    }
    return `${qNo}번 문항은 ${unit} 관련 확인 문항입니다. 다음 수업에서 풀이 과정을 다시 점검하고 같은 유형의 확인문제로 개념 적용 과정을 보완하겠습니다.`;
}

function reportCenterSelectPriorityWrongRows(wrongRows = [], limit = 5) {
    return [...(wrongRows || [])].sort((a, b) => {
        const ar = Number.isFinite(a.correctRate) ? a.correctRate : -1;
        const br = Number.isFinite(b.correctRate) ? b.correctRate : -1;
        if (br !== ar) return br - ar;
        const acr = Number.isFinite(a.classCorrectRate) ? a.classCorrectRate : -1;
        const bcr = Number.isFinite(b.classCorrectRate) ? b.classCorrectRate : -1;
        if (bcr !== acr) return bcr - acr;
        const au = a.unit || a.unitKey ? 1 : 0;
        const bu = b.unit || b.unitKey ? 1 : 0;
        if (bu !== au) return bu - au;
        return Number(a.questionNo || 0) - Number(b.questionNo || 0);
    }).slice(0, limit);
}

function reportCenterSelectExcellentRows(stats, limit = 3) {
    const rows = Array.isArray(stats?.rows) ? stats.rows : [];
    return [...rows]
        .filter(r => Number.isFinite(r.correctRate))
        .sort((a, b) => {
            if (a.correctRate !== b.correctRate) return a.correctRate - b.correctRate;
            return Number(a.questionNo || 0) - Number(b.questionNo || 0);
        })
        .slice(0, limit);
}

function reportCenterGetPremiumTableMeta(data) {
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) {
        return {
            mode: 'excellent',
            title: '우수 해결 문항 분석',
            note: '이번 평가는 전 문항을 정확하게 해결했습니다. 아래에는 전체 기준에서 난도가 있었던 핵심 문항을 중심으로 성취 포인트를 정리했습니다.'
        };
    }
    if (wrongRows.length > 5) {
        return {
            mode: 'priority',
            title: '핵심 보완 문항 분석표',
            note: `이번 리포트에서는 우선적으로 점검할 핵심 문항 5개를 중심으로 정리했습니다. 그 외 ${wrongRows.length - 5}개 문항은 클리닉 시간과 개별 오답 노트를 통해 순차적으로 확인하겠습니다.`
        };
    }
    return {
        mode: 'wrong',
        title: '오답 문항 분석표',
        note: '문항별 정답률과 단원 정보를 함께 확인하여 다음 수업에서 보완할 흐름을 정리했습니다.'
    };
}

function reportCenterBuildCoreSummaryHtml(data, correctRate, wrongCount, aiAnalysis = null) {
    const stats = data.stats;
    const wrongRows = stats?.wrongRows || [];
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const units = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const score = data.session?.score ?? '-';
    const studentName = data.student?.name || '학생';
    let achievement = wrongRows.length
        ? `${studentName} 학생은 이번 평가에서 ${score}점을 기록했습니다. 점수와 함께 문항별 정답률을 확인해 다음 보완 방향을 정리했습니다.`
        : `${studentName} 학생은 이번 평가에서 전 문항을 정확하게 해결했습니다. 현재 학습 흐름이 매우 안정적으로 유지되고 있습니다.`;
    let focus = wrongRows.length
        ? (units.length ? `${units.join(', ')} 단원과 우선 보완 문항을 중심으로 풀이 흐름을 확인합니다.` : '우선 보완 문항을 중심으로 풀이 흐름을 확인합니다.')
        : (excellentRows.length ? `${excellentRows.map(r => `${r.questionNo}번`).join(', ')} 등 난도 있는 문항까지 안정적으로 해결한 점을 바탕으로 심화 응용으로 이어갑니다.` : '현재 정확도를 유지하며 다음 단원과 심화 응용으로 이어갑니다.');
    const plan = wrongRows.length
        ? '다음 수업에서는 풀이 과정 확인, 조건 표시, 유사 문제 풀이를 순서대로 진행하겠습니다.'
        : '다음 수업에서는 현재 성취를 바탕으로 사고력을 넓히는 문제까지 연결하겠습니다.';

    return `
        <section class="aprc-core-summary">
            <div class="aprc-core-item"><b>성취</b><span>${reportCenterEscape(achievement)}</span></div>
            <div class="aprc-core-item"><b>보완</b><span>${reportCenterEscape(focus)}</span></div>
            <div class="aprc-core-item"><b>계획</b><span>${reportCenterEscape(plan)}</span></div>
        </section>
    `;
}

function reportCenterBuildPremiumQuestionRows(data, forPrint = false) {
    const stats = data.stats || {};
    const wrongRows = stats.wrongRows || [];
    if (!wrongRows.length) {
        const excellentRows = reportCenterSelectExcellentRows(stats, 3);
        if (!excellentRows.length) {
            return `<tr><td colspan="6" class="aprc-empty-cell">이번 평가는 전 문항을 정확하게 해결했습니다.</td></tr>`;
        }
        return excellentRows.map(row => {
            const insight = `전체 정답률이 낮았던 문항까지 정확하게 해결했습니다. 조건 해석과 풀이 마무리가 안정적으로 이루어진 문항입니다.`;
            return `
                <tr>
                    <td class="aprc-qno">${reportCenterEscape(row.questionNo)}번</td>
                    <td>${reportCenterEscape(row.unit || row.unitKey || '-')}</td>
                    <td>${reportCenterEscape(row.difficulty || '-')}</td>
                    <td>${reportCenterSafePercent(row.correctRate)}</td>
                    <td>${reportCenterSafePercent(row.classCorrectRate)}</td>
                    <td>${reportCenterEscape(insight)}</td>
                </tr>
            `;
        }).join('');
    }

    const displayRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    return displayRows.map(row => {
        return `
            <tr>
                <td class="aprc-qno">${reportCenterEscape(row.questionNo)}번</td>
                <td>${reportCenterEscape(row.unit || row.unitKey || '-')}</td>
                <td>${reportCenterEscape(row.difficulty || '-')}</td>
                <td>${reportCenterSafePercent(row.correctRate)}</td>
                <td>${reportCenterSafePercent(row.classCorrectRate)}</td>
                <td>${reportCenterEscape(row.meaning || '-')}</td>
            </tr>
        `;
    }).join('');
}

function reportCenterBuildDifficultyBarsForPremium(stats) {
    if (!stats || !stats.rows || !stats.rows.length) return '<div class="aprc-muted">난이도 비교 자료가 없습니다.</div>';
    const order = ['쉬움', '보통', '어려움', '매우 어려움', '자료 부족'];
    const max = Math.max(1, ...order.map(k => stats.bucket[k] || 0));
    return order.map(label => {
        const count = stats.bucket[label] || 0;
        const pct = Math.max(4, Math.round((count / max) * 100));
        return `
            <div class="aprc-bar-row">
                <div class="aprc-bar-label">${label}</div>
                <div class="aprc-bar-track"><div class="aprc-bar-fill" style="width:${pct}%;"></div></div>
                <div class="aprc-bar-count">${count}</div>
            </div>
        `;
    }).join('');
}

function reportCenterBuildScorePositionText(data) {
    const session = data.session;
    const stats = data.stats;
    if (!session || !stats) return '비교 자료가 부족합니다.';
    const score = Number(session.score);
    const parts = [];
    if (Number.isFinite(score) && stats.overallAvg !== null) {
        const diff = score - stats.overallAvg;
        parts.push(`전체 평균 대비 ${diff >= 0 ? '+' : ''}${diff}점`);
    }
    if (Number.isFinite(score) && stats.classAvg !== null) {
        const diff = score - stats.classAvg;
        parts.push(`${stats.className || '소속 반'} 평균 대비 ${diff >= 0 ? '+' : ''}${diff}점`);
    }
    return parts.length ? parts.join(' · ') : '동일 평가 비교 자료가 부족합니다.';
}

function reportCenterFirstSentence(value, limit = 72) {
    const text = reportCenterStripHtml(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const match = text.match(/^(.+?[.!?。！？]|.+?(?:습니다|합니다|됩니다|입니다|겠습니다)\.)/);
    return reportCenterTrimText(match ? match[1] : text, limit);
}

function reportCenterShortQuestionList(rows = [], limit = 5) {
    const nums = rows
        .map(r => r?.questionNo)
        .filter(v => v !== null && v !== undefined && String(v).trim() !== '')
        .slice(0, limit)
        .map(v => `${v}번`);
    return nums.length ? nums.join(', ') : '';
}

function reportCenterBuildShortReportSummaryItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const metricTextPattern = /(점수|평균|정답률|반 평균|전체 평균|\d+\s*점|\d+\s*%)/;
    const rawAiSummary = reportCenterFirstSentence(aiAnalysis?.summary, 82);
    const rawAiWrong = reportCenterFirstSentence(aiAnalysis?.wrongAnalysis, 92);
    const rawAiPlan = reportCenterFirstSentence(aiAnalysis?.nextPlan, 92);
    const aiSummary = metricTextPattern.test(rawAiSummary) ? '' : rawAiSummary;
    const aiWrong = metricTextPattern.test(rawAiWrong) ? '' : rawAiWrong;
    const aiPlan = metricTextPattern.test(rawAiPlan) ? '' : rawAiPlan;
    const priorityText = reportCenterShortQuestionList(priorityRows, 5);

    const position = aiSummary || (wrongRows.length
        ? '이번 평가에서 확인된 성취 흐름을 기준으로 다음 보완 방향을 정리했습니다.'
        : '이번 평가의 안정적인 풀이 흐름을 바탕으로 다음 확장 방향을 정리했습니다.');
    const focus = aiWrong || (wrongRows.length
        ? `${priorityText || '우선 확인 문항'}을 중심으로 풀이 흐름을 확인합니다.`
        : `${reportCenterShortQuestionList(excellentRows, 3) || '난도 있는 문항'}까지 해결한 흐름을 확인합니다.`);
    const plan = aiPlan || (wrongRows.length
        ? `${unitNames.length ? `${unitNames.join(', ')} 단원의 ` : ''}조건 확인과 풀이 순서를 다시 잡고 유사 문제로 연결하겠습니다.`
        : '현재 정확도를 유지하면서 심화 응용과 다음 단원으로 연결하겠습니다.');

    return [
        { title: '현재 위치', text: reportCenterTrimText(position, 96) },
        { title: '우선 확인 문항', text: reportCenterTrimText(focus, 96) },
        { title: '다음 수업 방향', text: reportCenterTrimText(plan, 96) }
    ];
}

function reportCenterSoftenDiagnosisText(value) {
    let text = reportCenterStripHtml(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const sentences = (text.match(/[^.!?。！？]+[.!?。！？]?/g) || [text])
        .map(s => s.trim())
        .filter(Boolean)
        .filter(s => !/(점수|평균|정답률|반 평균|전체 평균|\d+\s*점|\d+\s*%)/.test(s));
    if (!sentences.length) return '';
    text = sentences.join(' ')
        .replace(/틀렸/g, '확인할 부분이 보였')
        .replace(/부족/g, '보완이 필요')
        .replace(/낮은/g, '관리할')
        .replace(/못한/g, '흔들린');
    return reportCenterTrimText(text, 260);
}

function reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo = '', aiAnalysis = null) {
    const aiDiagnosis = reportCenterSoftenDiagnosisText(aiAnalysis?.diagnosis);
    if (aiDiagnosis) return [aiDiagnosis];

    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 3);
    const personalWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const parts = [];

    if (!wrongRows.length) {
        parts.push('풀이 흐름이 전반적으로 안정적이며 조건 확인과 마무리 과정도 잘 유지되고 있습니다. 다음 수업에서는 현재의 정확도를 유지하면서 낯선 조건이 섞인 심화 응용으로 확장하겠습니다.');
    } else {
        const typeText = personalWrongs.length && hardWrongs.length
            ? '조건 확인 습관과 개념 연결 과정이 함께 확인되었습니다'
            : personalWrongs.length
                ? '조건 표시, 계산 정리, 검산처럼 실수로 이어질 수 있는 풀이 습관이 확인되었습니다'
                : hardWrongs.length
                    ? '개념을 문제 조건에 연결하고 접근 순서를 잡는 과정에서 확인할 부분이 보였습니다'
                    : '풀이 과정의 세부 순서를 정리하면 안정화할 수 있는 부분이 보였습니다';
        const unitText = unitNames.length ? `${unitNames.join(', ')} 단원에서 ` : '';
        parts.push(`${unitText}${typeText}. 다음 수업에서는 바로 결과를 맞히는 연습보다 조건을 표시하고 필요한 개념을 고른 뒤 풀이 순서를 세우는 습관을 먼저 잡겠습니다.`);
        parts.push('이 순서로 관리하면 같은 유형의 유사 문제에서 흔들림을 줄이고, 이후 난도가 올라간 문항에서도 풀이 흐름을 스스로 점검할 수 있습니다.');
    }

    if (teacherMemo) parts.push(`담당 선생님 확인 사항은 다음 수업 관리에 반영하겠습니다: ${teacherMemo}`);
    return parts.map(line => reportCenterTrimText(line, 260));
}

function reportCenterBuildNextPlanItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const aiItems = Array.isArray(aiAnalysis?.nextActions) ? aiAnalysis.nextActions : [];
    const splitAiPlan = aiAnalysis?.nextPlan
        ? (reportCenterStripHtml(aiAnalysis.nextPlan).match(/[^.!?。！？]+[.!?。！？]?/g) || []).map(s => s.trim()).filter(Boolean)
        : [];
    const items = [...aiItems, ...splitAiPlan].map(item => reportCenterTrimText(item, 110)).filter(Boolean);

    if (items.length) return items.slice(0, 4);
    if (!wrongRows.length) {
        return [
            '현재 풀이 정확도를 유지하며 다음 단원 핵심 개념으로 연결합니다.',
            '난도 있는 문항은 풀이 조건과 마무리 과정을 다시 확인합니다.',
            '심화 응용 문제를 통해 사고 흐름을 넓힙니다.'
        ];
    }

    const wrongNums = reportCenterShortQuestionList(priorityRows, 5) || '우선 확인 문항';
    const plan = [
        `${wrongNums}의 조건 표시와 풀이 과정을 함께 다시 확인합니다.`,
        '풀이 순서를 말로 정리한 뒤 같은 유형의 유사 문제로 연결합니다.',
        '계산 정리와 검산 습관을 오답노트에 짧게 남기도록 지도합니다.'
    ];
    if (unitNames.length) plan.splice(1, 0, `${unitNames.join(', ')} 단원의 핵심 개념을 짧게 재확인합니다.`);
    return plan.slice(0, 4);
}


function reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, aiAnalysis = null) {
    const student = data?.student || {};
    const session = data?.session || {};
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const score = session.score ?? '-';
    const studentName = student.name || '학생';
    const items = [];
    const scoreBits = [`${studentName} 학생은 이번 평가에서 ${score}점을 기록했습니다.`];

    if (correctRate !== null && correctRate !== undefined) scoreBits.push(`정답률은 ${correctRate}%입니다.`);
    if (stats.overallAvg !== null && stats.overallAvg !== undefined) scoreBits.push(`전체 평균은 ${stats.overallAvg}점입니다.`);
    if (stats.classAvg !== null && stats.classAvg !== undefined) scoreBits.push(`${stats.className || '소속 반'} 평균은 ${stats.classAvg}점입니다.`);
    items.push(scoreBits.join(' '));

    if (!wrongRows.length) {
        const excellentRows = reportCenterSelectExcellentRows(stats, 3);
        if (excellentRows.length) {
            items.push(`${excellentRows.map(r => `${r.questionNo}번`).join(', ')}처럼 전체 정답률이 낮았던 문항까지 안정적으로 해결했습니다.`);
        } else {
            items.push('전 문항을 정확하게 해결해 이번 범위의 기본 흐름과 풀이 정확도가 안정적으로 유지되고 있습니다.');
        }
        items.push('다음 수업에서는 현재 성취를 유지하면서 심화 응용과 다음 단원 학습으로 자연스럽게 확장하겠습니다.');
        return items;
    }

    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const personalWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const priorityText = priorityRows.length ? priorityRows.map(r => `${r.questionNo}번`).join(', ') : '';

    if (wrongRows.length > 5) {
        items.push(`확인할 문항이 여러 개 있어 리포트에는 ${priorityText} 등 우선 점검 문항 5개를 중심으로 정리했습니다.`);
    } else {
        items.push(`${priorityText} 문항을 중심으로 풀이 흐름을 확인하면 이번 평가의 보완 방향을 잡을 수 있습니다.`);
    }

    if (personalWrongs.length && hardWrongs.length) {
        items.push('맞출 수 있었던 문항의 확인 습관과 난도가 있었던 문항의 개념 연결 과정을 나누어 점검하겠습니다.');
    } else if (personalWrongs.length) {
        items.push('대부분 학생이 맞힌 문항은 조건 표시와 계산 검산 습관을 먼저 점검하겠습니다.');
    } else if (hardWrongs.length) {
        items.push('난도가 있었던 문항은 개념 연결과 접근 순서를 다시 정리해 유사 문제로 이어가겠습니다.');
    } else if (unitNames.length) {
        items.push(`${unitNames.join(', ')} 단원의 핵심 유형을 짧게 재확인하고 유사 문제로 안정화하겠습니다.`);
    } else {
        items.push('풀이 과정의 세밀한 부분을 확인하고 같은 유형에서 안정적으로 마무리할 수 있도록 지도하겠습니다.');
    }

    if (aiAnalysis?.summary) {
        items[0] = reportCenterTrimText(aiAnalysis.summary, 150);
    }

    return items;
}

function reportCenterBuildPremiumExamReportHtml(studentId, sessionId = '', options = {}) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const student = data.student;
    const session = data.session;
    const stats = data.stats;
    const teacherMemo = options.teacherMemo !== undefined ? String(options.teacherMemo || '').trim() : reportCenterGetExamReportTeacherMemo();
    const isPrint = !!options.print;
    const aiAnalysis = reportCenterGetAiAnalysisForReport(session?.id, options);

    if (!student || !session || !stats) {
        return `<div class="aprc-document"><div class="aprc-empty-box">평가 리포트를 만들 시험 기록이 없습니다.</div></div>`;
    }

    const wrongCount = stats.wrongRows.length;
    const qCount = Number(session.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const recentAvg = getRecentAverage(student.id, 3);
    const target = data.targetProgress;
    const targetText = target && target.targetScore !== null
        ? `${target.targetScore}점 목표${target.currentAverage !== null ? ` · 최근 평균 ${target.currentAverage}점` : ''}${target.remainScore !== undefined && target.currentAverage !== null ? ` · 목표까지 ${target.remainScore}점` : ''}`
        : '목표점수 미설정';
    const diagnosisLines = reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo, aiAnalysis);
    const summaryItems = reportCenterBuildShortReportSummaryItems(data, aiAnalysis);
    const nextPlanItems = reportCenterBuildNextPlanItems(data, aiAnalysis);
    const parentMessageText = aiAnalysis?.parentMessage || (() => {
        const wrongRows = stats?.wrongRows || [];
        const studentName = student.name || '학생';
        if (!wrongRows.length) {
            return `${studentName} 학생이 이번 평가에서 모든 문항을 정확하게 맞혔습니다. 꾸준한 노력이 결과로 나타나고 있으며, 학원에서는 이 흐름을 이어갈 수 있도록 다음 단원과 심화 응용 학습을 차근차근 준비하겠습니다. 가정에서는 지금처럼 학습 환경을 유지해 주시면 충분합니다.`;
        }
        const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
        const unitText = unitNames.length ? `${unitNames.join(', ')} 단원` : '이번 평가의 핵심 확인 문항';
        return `이번 리포트는 점수뿐 아니라 ${studentName} 학생이 어떤 문항에서 확인할 부분이 있었는지, 그리고 그 문항이 어느 정도 난도의 문항이었는지를 함께 정리한 자료입니다. 학원에서는 다음 수업에서 ${unitText}의 풀이 흐름을 확인하고, 같은 실수가 반복되지 않도록 유사 문제 풀이까지 함께 진행하겠습니다. 가정에서는 문제를 풀 때 조건에 표시하는 습관과 풀이 후 한 번 더 확인하는 것만 가볍게 격려해 주시면 큰 도움이 됩니다.`;
    })();
    const tableMeta = reportCenterGetPremiumTableMeta(data);
    const archiveMessage = tableMeta.note;
    const issued = new Date().toLocaleDateString('sv-SE').replace(/-/g, '.');
    const examDate = String(session.exam_date || '').replace(/-/g, '.');
    const safeTitle = reportCenterEscape(session.exam_title || '평가');
    const aiBadgeHtml = aiAnalysis
        ? '<span class="aprc-premium-badge">프리미엄 분석</span>'
        : '';

    return `
        <div class="aprc-document ${isPrint ? 'aprc-print-document' : ''}">
            <section class="aprc-page aprc-page-1">
                <div class="aprc-report-header">
                    <div>
                        <div class="aprc-brand">AP MATH REPORT</div>
                        <div class="aprc-title">평가 분석 리포트</div>
                        <div class="aprc-subtitle">성취를 확인하고, 보완할 부분을 함께 준비합니다.</div>
                    </div>
                    <div class="aprc-issued">
                        <b>${reportCenterEscape(issued)}</b>
                        ${aiBadgeHtml}
                    </div>
                </div>

                <section class="aprc-student-band">
                    <div>
                        <div class="aprc-student-name">${reportCenterEscape(student.name || '')}</div>
                        <div class="aprc-student-meta">${reportCenterEscape(`${student.school_name || ''} ${student.grade || ''}`.trim() || '-')} · ${reportCenterEscape(data.classInfo.className || '-')}</div>
                    </div>
                    <div class="aprc-exam-meta">
                        <div>${safeTitle}</div>
                        <b>${reportCenterEscape(examDate || '-')}</b>
                    </div>
                </section>

                <section class="aprc-score-grid">
                    <div class="aprc-score-card aprc-main-score">
                        <div class="aprc-card-label">이번 평가 점수</div>
                        <div class="aprc-score-value">${reportCenterEscape(session.score ?? '-')}<span>점</span></div>
                        <div class="aprc-card-note">${reportCenterEscape(reportCenterBuildScorePositionText(data))}</div>
                    </div>
                    <div class="aprc-score-card">
                        <div class="aprc-card-label">정답률</div>
                        <div class="aprc-metric-value">${correctRate === null ? '-' : `${correctRate}%`}</div>
                        <div class="aprc-card-note">${qCount || '-'}문항 중 확인 ${wrongCount}문항</div>
                    </div>
                    <div class="aprc-score-card">
                        <div class="aprc-card-label">비교 평균</div>
                        <div class="aprc-metric-value">${stats.overallAvg === null ? '-' : `${stats.overallAvg}점`}</div>
                        <div class="aprc-card-note">전체 ${stats.totalSessions || 0}명 · 반 ${stats.classSessions || 0}명</div>
                    </div>
                    <div class="aprc-score-card">
                        <div class="aprc-card-label">최근 흐름</div>
                        <div class="aprc-metric-value">${recentAvg === null ? '-' : `${recentAvg}점`}</div>
                        <div class="aprc-card-note">${reportCenterEscape(targetText)}</div>
                    </div>
                </section>

                ${reportCenterBuildCoreSummaryHtml(data, correctRate, wrongCount, aiAnalysis)}

                <section class="aprc-two-col">
                    <div class="aprc-panel">
                        <div class="aprc-section-title">문항 난이도 분포</div>
                        ${reportCenterBuildDifficultyBarsForPremium(stats)}
                    </div>
                    <div class="aprc-panel">
                        <div class="aprc-section-title">리포트 핵심 요약</div>
                        <div class="aprc-summary-list">
                            ${summaryItems.map(item => `
                                <div class="aprc-summary-item">
                                    <b>${reportCenterEscape(item.title)}</b>
                                    <span>${reportCenterEscape(item.text)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </section>
            </section>

            <section class="aprc-page aprc-page-2">
                <section class="aprc-panel aprc-table-panel">
                    <div class="aprc-section-title">${reportCenterEscape(tableMeta.title)}</div>
                    <div class="aprc-table-wrap">
                        <table class="aprc-table">
                            <thead>
                                <tr>
                                    <th>문항</th>
                                    <th>단원</th>
                                    <th>난도</th>
                                    <th>전체 정답률</th>
                                    <th>반 정답률</th>
                                    <th>해석</th>
                                </tr>
                            </thead>
                            <tbody>${reportCenterBuildPremiumQuestionRows(data, isPrint)}</tbody>
                        </table>
                    </div>
                    <div class="aprc-source-note">${reportCenterEscape(archiveMessage)}</div>
                </section>

                <section class="aprc-two-col aprc-bottom-grid">
                    <div class="aprc-panel">
                        <div class="aprc-section-title">종합 진단</div>
                        <div class="aprc-paragraph">
                            ${diagnosisLines.map(line => `<p>${reportCenterEscape(line)}</p>`).join('')}
                        </div>
                    </div>
                    <div class="aprc-panel">
                        <div class="aprc-section-title">다음 수업 보완 계획</div>
                        ${nextPlanItems.length ? `<ol class="aprc-plan-list">${nextPlanItems.map(item => `<li>${reportCenterEscape(item)}</li>`).join('')}</ol>` : ''}
                    </div>
                </section>
            </section>

            <section class="aprc-page aprc-page-3">
                <section class="aprc-parent-message">
                    <div class="aprc-section-title">학부모님께 드리는 말씀</div>
                    <p>${reportCenterEscape(parentMessageText)}</p>
                </section>

                <div class="aprc-footer">AP MATH · Student Learning Report</div>
            </section>
        </div>
    `;
}

function reportCenterPremiumReportStyle() {
    return `
        <style>
            .aprc-document { width:100%; max-width:794px; margin:0 auto; background:#ffffff; color:#111827; border:1px solid #e5e7eb; border-radius:22px; overflow:hidden; box-shadow:0 18px 60px rgba(15,23,42,0.10); font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.55; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-document * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-report-header { display:flex; justify-content:space-between; align-items:flex-start; gap:24px; padding:30px 34px 24px; background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%); color:#fff; }
            .aprc-brand { font-size:12px; font-weight:800; letter-spacing:0.16em; color:rgba(255,255,255,0.72); }
            .aprc-title { margin-top:8px; font-size:28px; font-weight:800; letter-spacing:-0.8px; line-height:1.15; }
            .aprc-subtitle { margin-top:8px; font-size:13px; font-weight:650; color:rgba(255,255,255,0.74); }
            .aprc-ai-badge { display:inline-flex; margin-top:12px; padding:5px 9px; border-radius:999px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.86); font-size:10.5px; font-weight:850; letter-spacing:-0.1px; }
            .aprc-issued { text-align:right; font-size:11px; font-weight:700; color:rgba(255,255,255,0.64); white-space:nowrap; }
            .aprc-issued b { display:block; margin-top:5px; font-size:14px; color:#fff; }
            .aprc-premium-badge { display:inline-flex; align-items:center; justify-content:center; margin-top:7px; padding:3px 8px; border-radius:999px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.82); font-size:10px; font-weight:800; letter-spacing:-0.1px; white-space:nowrap; }
            .aprc-student-band { display:flex; justify-content:space-between; align-items:center; gap:20px; padding:22px 34px; background:#f8fafc; border-bottom:1px solid #e5e7eb; }
            .aprc-student-name { font-size:24px; font-weight:850; letter-spacing:-0.7px; color:#0f172a; }
            .aprc-student-meta { margin-top:4px; font-size:13px; font-weight:700; color:#64748b; }
            .aprc-exam-meta { text-align:right; font-size:13px; font-weight:750; color:#334155; }
            .aprc-exam-meta b { display:block; margin-top:4px; color:#2563eb; }
            .aprc-score-grid { display:grid; grid-template-columns:1.45fr 1fr 1fr 1fr; gap:12px; padding:24px 34px 10px; }
            .aprc-score-card { min-width:0; padding:18px 16px; border:1px solid #e5e7eb; border-radius:18px; background:#fff; }
            .aprc-main-score { background:#eff6ff; border-color:#bfdbfe; }
            .aprc-card-label { font-size:11px; font-weight:850; color:#64748b; letter-spacing:-0.1px; }
            .aprc-score-value { margin-top:9px; font-size:48px; font-weight:900; color:#1d4ed8; line-height:0.95; letter-spacing:-2px; }
            .aprc-score-value span { font-size:20px; font-weight:850; color:#475569; margin-left:2px; }
            .aprc-metric-value { margin-top:10px; font-size:25px; font-weight:900; color:#0f172a; letter-spacing:-0.8px; }
            .aprc-card-note { margin-top:9px; font-size:11px; font-weight:700; color:#64748b; line-height:1.45; word-break:keep-all; }
            .aprc-core-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; padding:12px 34px 0; }
            .aprc-core-item { min-width:0; padding:15px 16px; border:1px solid #dbeafe; border-radius:18px; background:#f8fbff; }
            .aprc-core-item b { display:block; margin-bottom:7px; color:#1d4ed8; font-size:12px; font-weight:900; letter-spacing:-0.2px; }
            .aprc-core-item span { display:block; color:#334155; font-size:12.5px; font-weight:700; line-height:1.6; word-break:keep-all; }
            .aprc-two-col { display:grid; grid-template-columns:1fr 1.05fr; gap:12px; padding:12px 34px; }
            .aprc-panel { border:1px solid #e5e7eb; border-radius:18px; background:#fff; padding:18px; min-width:0; }
            .aprc-section-title { margin:0 0 13px; font-size:15px; font-weight:850; color:#0f172a; letter-spacing:-0.35px; }
            .aprc-bar-row { display:grid; grid-template-columns:70px 1fr 34px; gap:9px; align-items:center; margin:9px 0; }
            .aprc-bar-label { font-size:12px; font-weight:800; color:#64748b; }
            .aprc-bar-track { height:10px; background:#f1f5f9; border-radius:999px; overflow:hidden; border:1px solid #e2e8f0; }
            .aprc-bar-fill { height:100%; background:#2563eb; border-radius:999px; }
            .aprc-bar-count { font-size:12px; font-weight:850; color:#0f172a; text-align:right; }
            .aprc-insight-list { display:flex; flex-direction:column; gap:8px; }
            .aprc-insight-item { padding:10px 12px; border-radius:12px; background:#f8fafc; border:1px solid #e5e7eb; color:#334155; font-size:12.5px; font-weight:700; line-height:1.55; word-break:keep-all; }
            .aprc-summary-list { display:grid; grid-template-columns:1fr; gap:8px; }
            .aprc-summary-item { padding:10px 12px; border-radius:12px; background:#f8fafc; border:1px solid #e5e7eb; }
            .aprc-summary-item b { display:block; margin-bottom:4px; color:#1d4ed8; font-size:11.5px; font-weight:900; letter-spacing:-0.1px; }
            .aprc-summary-item span { display:block; color:#334155; font-size:12.5px; font-weight:700; line-height:1.55; word-break:keep-all; }
            .aprc-table-panel { margin:12px 34px; padding:18px; }
            .aprc-table-wrap { overflow-x:auto; border:1px solid #e5e7eb; border-radius:14px; }
            .aprc-table { width:100%; border-collapse:collapse; min-width:760px; font-size:11.5px; }
            .aprc-table th { padding:10px 9px; background:#f8fafc; color:#64748b; text-align:left; font-weight:850; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
            .aprc-table td { padding:11px 9px; border-bottom:1px solid #e5e7eb; vertical-align:top; color:#334155; font-weight:650; }
            .aprc-table tr:last-child td { border-bottom:none; }
            .aprc-qno { color:#1d4ed8 !important; font-weight:900 !important; white-space:nowrap; }
            .aprc-question-summary { max-width:230px; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis; word-break:keep-all; white-space:normal; }
            .aprc-question-sub { margin-top:5px; color:#64748b; font-size:10.5px; font-weight:700; line-height:1.4; }
            .aprc-empty-cell { padding:20px !important; text-align:center; color:#64748b !important; font-weight:800 !important; }
            .aprc-source-note { margin-top:10px; padding:9px 11px; border-radius:11px; background:#f8fafc; color:#64748b; font-size:11px; font-weight:700; line-height:1.45; }
            .aprc-bottom-grid { align-items:stretch; padding-top:0; }
            .aprc-paragraph p { margin:0 0 10px; color:#334155; font-size:13px; font-weight:650; line-height:1.7; word-break:keep-all; }
            .aprc-plan-list { margin:0; padding-left:19px; color:#334155; font-size:13px; font-weight:700; line-height:1.75; }
            .aprc-plan-list li { margin:0 0 5px; }
            .aprc-parent-message { margin:0 34px 24px; padding:18px 20px; border-radius:18px; background:#eff6ff; border:1px solid #bfdbfe; }
            .aprc-parent-message p { margin:0; color:#1e3a8a; font-size:13px; font-weight:700; line-height:1.75; word-break:keep-all; }
            .aprc-footer { padding:14px 34px 24px; color:#94a3b8; font-size:10px; font-weight:850; letter-spacing:0.14em; text-align:center; }
            .aprc-muted { color:#64748b; font-size:12px; font-weight:700; }
            .aprc-empty-box { padding:36px; text-align:center; color:#64748b; font-weight:800; }
            @media screen and (max-width:760px) {
                .aprc-document { width:760px; max-width:760px; border-radius:18px; }
                .aprc-report-header, .aprc-student-band { padding-left:22px; padding-right:22px; }
                .aprc-report-header { flex-direction:column; gap:16px; }
                .aprc-issued { text-align:left; }
                .aprc-student-band { flex-direction:column; align-items:flex-start; }
                .aprc-exam-meta { text-align:left; }
                .aprc-score-grid { grid-template-columns:1fr 1fr; padding-left:22px; padding-right:22px; }
                .aprc-two-col { grid-template-columns:1fr; padding-left:22px; padding-right:22px; }
                .aprc-table-panel, .aprc-parent-message { margin-left:22px; margin-right:22px; }
                .aprc-title { font-size:24px; }
                .aprc-score-value { font-size:42px; }
            }
        </style>
    `;
}

function reportCenterBuildPrintDocument(studentId, sessionId = '', teacherMemo = '') {
    const reportHtml = reportCenterBuildPremiumExamReportHtml(studentId, sessionId, { print: true, teacherMemo, aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId) });
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AP Math 평가 리포트</title>
${reportCenterPremiumReportStyle()}
<style>
    html, body { margin:0; padding:0; background:#f1f5f9; color:#111827; }
    body { font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; padding:24px; overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .aprc-document { box-shadow:none; border-radius:0; max-width:794px; min-height:1122px; }
    .aprc-document, .aprc-document * { -webkit-print-color-adjust:exact !important; print-color-adjust:exact !important; }
    @media screen and (max-width:760px) {
        body { padding:10px; }
        .aprc-document { width:760px; max-width:760px; min-width:760px; }
    }
    @page { size: A4; margin: 9mm; }
    @media print {
        html, body { background:#fff; padding:0; overflow:visible; }
        .aprc-document { width:100%; max-width:none; min-width:0; min-height:auto; border:none; box-shadow:none; overflow:visible; }
        .aprc-page {
            break-after: page !important;
            page-break-after: always !important;
            box-sizing: border-box !important;
            min-height: calc(297mm - 18mm) !important;
            padding: 0 !important;
        }
        .aprc-page:last-child {
            break-after: auto !important;
            page-break-after: auto !important;
        }
        .aprc-report-header { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
        .aprc-table-wrap { overflow: visible !important; max-width: 100% !important; }
        .aprc-table { width: 100% !important; min-width: 0 !important; font-size: 10px !important; }
        .aprc-table th, .aprc-table td { padding: 7px 6px !important; word-break: keep-all !important; }
        .aprc-score-grid { grid-template-columns:1.35fr 1fr 1fr 1fr; }
        .aprc-score-value { font-size:42px; }
        .aprc-metric-value { font-size:22px; }
        .aprc-panel,
        .aprc-score-grid,
        .aprc-score-card,
        .aprc-core-summary,
        .aprc-core-item,
        .aprc-table-panel,
        .aprc-bottom-grid,
        .aprc-parent-message {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
        }
    }
</style>
</head>
<body>
${reportHtml}
<script>window.onload=function(){setTimeout(function(){window.print();},250);};<\/script>
</body>
</html>`;
}

function reportCenterPrintPremiumExamReport(studentId, sessionId = '') {
    const win = window.open('', '_blank', 'noopener,noreferrer');
    if (!win) {
        toast('팝업 차단을 해제한 뒤 다시 시도하세요.', 'warn');
        return;
    }

    try {
        win.document.open();
        win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>AP Math 평가 리포트</title><style>body{margin:0;padding:32px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#f8fafc;color:#334155;text-align:center;} .box{max-width:420px;margin:12vh auto;padding:24px;border:1px solid #e5e7eb;border-radius:18px;background:#fff;} b{display:block;color:#0f172a;font-size:17px;margin-bottom:8px;}</style></head><body><div class="box"><b>리포트를 생성 중입니다.</b><div>잠시만 기다려 주세요.</div></div></body></html>`);
        win.document.close();
    } catch (e) {
        console.error('[reportCenterPrintPremiumExamReport] pre-open write failed:', e);
    }

    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        try {
            win.document.open();
            win.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>AP Math 평가 리포트</title></head><body style="font-family:sans-serif;padding:32px;">출력할 평가 기록이 없습니다.</body></html>`);
            win.document.close();
        } catch (e) {}
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    const html = reportCenterBuildPrintDocument(studentId, sessionId, teacherMemo);

    try {
        win.document.open();
        win.document.write(html);
        win.document.close();
        try { win.focus(); } catch (e) {}
        toast('PDF 출력 창을 열었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterPrintPremiumExamReport] failed:', e);
        toast('PDF 출력 창을 여는 중 오류가 발생했습니다.', 'warn');
        try { win.close(); } catch (closeErr) {}
    }
}

function reportCenterOpenPrintView(studentId, sessionId = '', event = null) {
    if (event && typeof event.preventDefault === 'function') event.preventDefault();
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    console.log('[reportCenterOpenPrintView] open', { studentId, sessionId });
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    const reportHtml = reportCenterPremiumReportStyle() + reportCenterBuildPremiumExamReportHtml(studentId, sessionId, {
        print: true,
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId)
    });

    const root = document.getElementById('app-root') || document.body;
    [
        '#report-center-wide-overlay',
        '.report-center-wide-overlay',
        '.wide-overlay'
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });

    [
        '#modal-overlay',
        '.modal-overlay',
        '#student-profile-modal',
        '.student-profile-modal',
        '.profile-modal',
        '.modal'
    ].forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('hidden');
            el.classList.remove('show');
            el.style.display = 'none';
            el.setAttribute('aria-hidden', 'true');
        });
    });

    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';

    window.AP_REPORT_PRINT_RETURN = {
        studentId,
        sessionId,
        scrollY: window.scrollY || 0
    };

    root.innerHTML = `
        <div id="report-print-view" class="report-print-view">
            <div class="report-print-toolbar no-print">
                <button class="btn" onclick="reportCenterClosePrintView()">리포트 센터로 돌아가기</button>
                <button class="btn btn-primary" onclick="window.print()">인쇄하기</button>
            </div>
            <div class="report-print-stage">
                ${reportHtml}
            </div>
        </div>
    `;
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    reportCenterInjectPrintViewStyle();
    window.scrollTo(0, 0);
    console.log('[reportCenterOpenPrintView] rendered');
}

function reportCenterClosePrintView() {
    const ret = window.AP_REPORT_PRINT_RETURN || {};

    if (typeof renderDashboard === 'function') {
        renderDashboard();
    } else if (typeof renderApp === 'function') {
        renderApp();
    } else {
        location.reload();
        return;
    }

    setTimeout(() => {
        if (ret.studentId) openReportCenterExam(ret.studentId, ret.sessionId || '');
        if (Number.isFinite(Number(ret.scrollY))) window.scrollTo(0, Number(ret.scrollY));
    }, 100);
}

function reportCenterInjectPrintViewStyle() {
    if (document.getElementById('report-print-view-style')) return;

    const style = document.createElement('style');
    style.id = 'report-print-view-style';
    style.textContent = `
        .report-print-view {
            position:relative;
            z-index:3000;
            min-height:100vh;
            background:#f1f5f9;
            padding:18px;
            box-sizing:border-box;
        }

        .report-print-toolbar {
            position:sticky;
            top:0;
            z-index:20;
            display:flex;
            gap:8px;
            justify-content:space-between;
            align-items:center;
            max-width:900px;
            margin:0 auto 14px;
            padding:10px;
            background:rgba(255,255,255,0.94);
            border:1px solid var(--border);
            border-radius:14px;
            backdrop-filter:blur(8px);
            -webkit-backdrop-filter:blur(8px);
        }

        .report-print-toolbar .btn {
            min-height:42px;
            font-size:13px;
            font-weight:700;
            border-radius:12px;
            flex:1;
        }

        .report-print-stage {
            width:100%;
            overflow-x:auto;
            -webkit-overflow-scrolling:touch;
            padding-bottom:24px;
        }

        .report-print-stage .aprc-document {
            margin:0 auto;
            width:794px;
            max-width:794px;
        }

        @media (max-width:840px) {
            .report-print-view {
                padding:10px;
            }

            .report-print-toolbar {
                margin-bottom:10px;
            }

            .report-print-stage .aprc-document {
                width:794px;
                max-width:794px;
                min-width:794px;
            }
        }

        @media print {
            .no-print,
            .report-print-toolbar {
                display:none !important;
            }

            html,
            body {
                background:#fff !important;
                margin:0 !important;
                padding:0 !important;
            }

            .report-print-view {
                padding:0 !important;
                background:#fff !important;
            }

            .report-print-stage {
                overflow:visible !important;
                padding:0 !important;
            }

            .report-print-stage .aprc-document {
                width:100% !important;
                max-width:none !important;
                min-width:0 !important;
                margin:0 !important;
                border:none !important;
                box-shadow:none !important;
                border-radius:0 !important;
                overflow:visible !important;
            }

            .aprc-page {
                break-after: page !important;
                page-break-after: always !important;
                box-sizing: border-box !important;
                min-height: calc(297mm - 18mm) !important;
                padding: 0 !important;
            }

            .aprc-page:last-child {
                break-after: auto !important;
                page-break-after: auto !important;
            }

            .aprc-panel,
            .aprc-score-grid,
            .aprc-score-card,
            .aprc-core-summary,
            .aprc-core-item,
            .aprc-table-panel,
            .aprc-bottom-grid,
            .aprc-parent-message {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
            }

            .aprc-table-wrap {
                overflow: visible !important;
                max-width: 100% !important;
            }

            .aprc-table {
                width: 100% !important;
                min-width: 0 !important;
                font-size: 10px !important;
            }

            .aprc-table th,
            .aprc-table td {
                padding: 7px 6px !important;
                word-break: keep-all !important;
            }

            .aprc-report-header {
                background:#ffffff !important;
                color:#111827 !important;
                border-bottom:2px solid #111827 !important;
            }

            .aprc-brand,
            .aprc-subtitle,
            .aprc-issued {
                color:#374151 !important;
            }

            .aprc-title,
            .aprc-issued b {
                color:#111827 !important;
            }

            .aprc-premium-badge {
                background:#ffffff !important;
                border:1px solid #6b7280 !important;
                color:#111827 !important;
            }

            @page {
                size: A4;
                margin: 9mm;
            }
        }
    `;
    document.head.appendChild(style);
}

function reportCenterCopyExamKakaoSummary(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('복사할 평가 기록이 없습니다.', 'warn');
        return;
    }
    const aiAnalysis = reportCenterGetAiAnalysisForReport(sessionId);
    const text = aiAnalysis?.kakaoSummary || reportCenterBuildExamPreview(studentId, sessionId);
    if (!String(text || '').trim()) {
        toast('복사할 카톡 문구가 없습니다.', 'warn');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        toast(aiAnalysis?.kakaoSummary ? '정리된 카톡 요약문이 복사되었습니다.' : '카톡 요약문이 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function reportCenterRefreshPremiumExamPreview(studentId, sessionId = '') {
    const root = document.getElementById('report-center-premium-preview');
    if (!root) return;
    root.innerHTML = reportCenterPremiumReportStyle() + reportCenterBuildPremiumExamReportHtml(studentId, sessionId, { teacherMemo: reportCenterGetExamReportTeacherMemo(), aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId) });
}

function openReportCenterExam(studentId, selectedSessionId = '') {
    window.AP_REPORT_CENTER_RENDER_TOKEN = (window.AP_REPORT_CENTER_RENDER_TOKEN || 0) + 1;
    const renderToken = window.AP_REPORT_CENTER_RENDER_TOKEN;
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    if (!student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const sessions = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));

    const selected = selectedSessionId
        ? sessions.find(e => String(e.id) === String(selectedSessionId))
        : sessions[0];

    const data = selected ? reportCenterGetExamReportData(studentId, selected.id) : null;
    const stats = data?.stats || null;
    const wrongSummary = selected ? reportCenterBuildWrongSummary(selected) : [];
    const archiveStatusHtml = selected ? reportCenterBuildArchiveStatusHtml(selected) : '';
    const wrongRows = stats && stats.wrongRows.length
        ? stats.wrongRows.map(w => `
            <tr>
                <td style="padding:8px; border-bottom:1px solid var(--border); font-weight:700; white-space:nowrap;">${reportCenterEscape(w.questionNo)}번</td>
                <td style="padding:8px; border-bottom:1px solid var(--border);">${reportCenterEscape(w.unit || '-')}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border); white-space:nowrap;">${Number.isFinite(w.correctRate) ? `${w.correctRate}%` : '-'}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border); white-space:nowrap;">${Number.isFinite(w.classCorrectRate) ? `${w.classCorrectRate}%` : '-'}</td>
                <td style="padding:8px; border-bottom:1px solid var(--border);">${reportCenterEscape(w.meaning || '-')}</td>
            </tr>
        `).join('')
        : `<tr><td colspan="5" style="padding:14px; text-align:center; color:var(--secondary); font-weight:700;">오답 문항이 없거나 비교 자료가 없습니다.</td></tr>`;

    const selectedId = selected?.id || '';

    const body = sessions.length ? `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <select class="btn" style="width:100%; min-height:46px; text-align:left; background:var(--surface); border:1px solid var(--border); font-weight:700;" onchange="event.stopPropagation(); openReportCenterExam('${escapeReportJsString(studentId)}', this.value)">
                ${sessions.map(e => `<option value="${reportCenterAttr(e.id)}" ${String(e.id) === String(selected?.id) ? 'selected' : ''}>${reportCenterEscape(e.exam_date || '-')} · ${reportCenterEscape(e.exam_title || '평가')} · ${reportCenterEscape(e.score)}점</option>`).join('')}
            </select>

            <div style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">점수</div><div style="font-size:15px; font-weight:700; color:var(--primary); margin-top:2px;">${reportCenterEscape(selected?.score ?? '-')}점</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">전체 평균</div><div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${stats?.overallAvg === null ? '-' : `${stats?.overallAvg}점`}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">제출</div><div style="font-size:15px; font-weight:700; color:var(--text); margin-top:2px;">${stats?.totalSessions || 0}명</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">오답</div><div style="font-size:15px; font-weight:700; color:var(--error); margin-top:2px;">${wrongSummary.length}개</div></div>
            </div>

            <div style="padding:13px 14px; border:1px solid rgba(26,92,255,0.16); border-radius:14px; background:rgba(26,92,255,0.06); color:var(--primary); font-size:12px; font-weight:700; line-height:1.55;">
                출력용 리포트는 전체화면 검수 화면에서 확인한 뒤 PDF 저장/인쇄합니다. 학부모 전달용 문서 기준으로 점수, 평균, 정답률, 확인 문항 의미, 다음 보완 계획을 한 장 안에 정리합니다.
            </div>

            ${archiveStatusHtml}

            <div style="border:1px solid var(--border); border-radius:14px; overflow:auto; background:var(--surface);">
                <table style="width:100%; min-width:620px; border-collapse:collapse; font-size:12px;">
                    <thead style="background:var(--surface-2); color:var(--secondary);">
                        <tr><th style="padding:8px; text-align:left;">오답</th><th style="padding:8px; text-align:left;">단원</th><th style="padding:8px; text-align:left;">전체 정답률</th><th style="padding:8px; text-align:left;">반 정답률</th><th style="padding:8px; text-align:left;">해석</th></tr>
                    </thead>
                    <tbody>${wrongRows}</tbody>
                </table>
            </div>

            <textarea id="report-center-exam-teacher-memo" class="btn" placeholder="선생님 추가 메모: 수업 태도, 시험 당시 특이사항, 가정 전달 포인트" style="width:100%; min-height:74px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:13px; font-size:13px; line-height:1.6; resize:vertical; font-family:inherit;" oninput="reportCenterRefreshPremiumExamPreview('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}')"></textarea>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button type="button" class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterOpenPrintView('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}', event)">리포트 크게 보기/출력</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="reportCenterCopyExamKakaoSummary('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}')">카톡 요약 복사</button>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="openParentReport('${escapeReportJsString(studentId)}')">기존 카드 리포트</button>
                <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:#7c3aed; background:rgba(124,58,237,0.08); border:1px solid rgba(124,58,237,0.16);" onclick="reportCenterRequestExamAiAnalysis('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}', this)">프리미엄 분석</button>
            </div>

            <div style="padding:14px; border:1px solid var(--border); border-radius:14px; background:var(--surface-2); color:var(--secondary); font-size:12px; font-weight:700; line-height:1.6;">
                프리미엄 리포트 문구와 출력 상태는 전체화면에서 정확히 확인합니다.
            </div>
        </div>
    ` : `
        <div style="padding:34px 16px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; background:var(--surface-2); border-radius:16px;">
            평가 기록이 없습니다.
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'exam', body));
    if (selected) {
        setTimeout(() => {
            if (window.AP_REPORT_CENTER_RENDER_TOKEN !== renderToken) return;
            reportCenterLoadArchiveQuestionDetails(studentId, selected.id, { silent: true }).then(() => {
                if (window.AP_REPORT_CENTER_RENDER_TOKEN !== renderToken) return;
                reportCenterRefreshPremiumExamPreview(studentId, selected.id);
            }).catch(() => {});
        }, 80);
    }
}


async function reportCenterRequestExamAiAnalysis(studentId, sessionId, buttonEl = null) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('정리할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    payload.teacherMemo = reportCenterGetExamReportTeacherMemo();
    payload.generatedFrom = 'AP_MATH_OS_REPORT_CENTER_4D5';

    if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, true, '분석 중');
    else toast('리포트 문장을 정리하는 중입니다.', 'info');

    try {
        const r = await api.post('ai/report-analysis', payload);
        if (!r || r.success === false) {
            throw new Error(r?.message || r?.error || '프리미엄 분석 실패');
        }
        const source = String(r.source || '').toLowerCase();
        const isPremiumSource = source === 'ai' || source === 'gemini';
        if (!isPremiumSource) {
            reportCenterClearCachedAiAnalysis(sessionId);
            reportCenterRefreshPremiumExamPreview(studentId, sessionId);
            const warning = reportCenterTrimText(r.warning || r.message || r.error || '분석 결과가 기준에 맞지 않았습니다.', 140);
            console.warn('[reportCenterRequestExamAiAnalysis] fallback ignored:', r);
            toast(`분석 결과가 기준에 맞지 않아 기본 리포트를 유지합니다. ${warning}`, 'warn');
            return;
        }
        const analysis = reportCenterNormalizeAiAnalysis(r.analysis || r.data || r);
        analysis.source = 'ai';
        reportCenterSetCachedAiAnalysis(sessionId, analysis);
        reportCenterRefreshPremiumExamPreview(studentId, sessionId);
        toast('리포트 문장이 정리되어 반영되었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterRequestExamAiAnalysis] failed:', e);
        toast('프리미엄 분석에 실패했습니다. 기본 리포트를 유지합니다.', 'warn');
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterCopyExamAiPayload(studentId, sessionId) {
    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    const memo = document.getElementById('report-center-exam-teacher-memo')?.value || '';
    payload.teacherMemo = memo;
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2)).then(() => {
        toast('분석 자료가 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function openReportCenterCounsel(studentId) {
    const ctx = buildReportContext(studentId);
    if (!ctx.student) {
        toast('학생 정보를 찾을 수 없습니다.', 'warn');
        return;
    }

    const text = reportCenterBuildCounselPreview(studentId);
    const consultations = reportCenterGetRecentConsultations(studentId, 5);
    const consultHtml = consultations.length
        ? consultations.map(c => `
            <div style="padding:10px 0; border-bottom:1px solid var(--border);">
                <div style="font-size:12px; font-weight:700; color:var(--secondary);">${reportCenterEscape(c.date || '-')} · ${reportCenterEscape(c.type || '상담')}</div>
                <div style="font-size:13px; font-weight:700; color:var(--text); line-height:1.5; margin-top:4px;">${reportCenterEscape(c.content || '')}</div>
            </div>
        `).join('')
        : `<div style="padding:18px; text-align:center; color:var(--secondary); font-size:12px; font-weight:700;">최근 상담 기록이 없습니다.</div>`;

    const body = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">출결</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.attendance)}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">숙제</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${reportCenterEscape(ctx.homework)}</div></div>
                <div style="padding:11px; border-radius:12px; background:var(--surface); border:1px solid var(--border);"><div style="font-size:11px; font-weight:700; color:var(--secondary);">최근평균</div><div style="font-size:14px; font-weight:700; color:var(--text); margin-top:2px;">${ctx.avg === null ? '-' : `${ctx.avg}점`}</div></div>
            </div>
            <div style="padding:12px 14px; border-radius:14px; background:var(--surface); border:1px solid var(--border); max-height:170px; overflow-y:auto;">
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-bottom:4px;">최근 상담 기록</div>
                ${consultHtml}
            </div>
            <textarea id="report-center-counsel-text" class="btn" style="width:100%; min-height:320px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;">${escapeHtmlForTextarea(text)}</textarea>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterCopyText('report-center-counsel-text')">상담 요약 복사</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportCenterPrintText('report-center-counsel-text', 'AP Math 상담 리포트')">출력</button>
            </div>
            <button class="btn" style="min-height:44px; font-size:12px; font-weight:700; border-radius:12px; color:var(--primary); background:rgba(26,92,255,0.08); border:1px solid rgba(26,92,255,0.14);" onclick="copyReport('${escapeReportJsString(studentId)}', 'counsel')">기존 상담용 문구 열기</button>
        </div>
    `;

    reportCenterShowWideModal('리포트 센터', reportCenterBaseShell(studentId, 'counsel', body));
}


// ─────────────────────────────────────────
// [학부모 리포트 카드 v1]
// ─────────────────────────────────────────

function buildReportCardNextPoint(wrongAnswers, weakUnits) {
    const wrongs = Array.isArray(wrongAnswers) ? wrongAnswers.filter(v => v !== null && v !== undefined && String(v).trim() !== '') : [];
    const units = Array.isArray(weakUnits) ? weakUnits.filter(Boolean) : [];

    if (!wrongs.length && !units.length) {
        return '이번 시험 내용을 안정적으로 소화했습니다. 현재 흐름을 유지하면서 다음 단원 학습으로 자신감 있게 이어가겠습니다.';
    }

    if (!wrongs.length && units.length > 0) {
        return `이번 평가를 잘 마무리했습니다. 다음 수업에서는 ${units[0]} 단원의 심화 내용까지 자연스럽게 확장하겠습니다.`;
    }

    const wrongStr = wrongs.length === 1
        ? `${wrongs[0]}번 문항`
        : `${wrongs.join('번 · ')}번 문항`;

    if (units.length > 0) {
        return `${wrongStr}의 풀이 흐름을 함께 확인하고, ${units[0]} 단원 핵심 개념을 유사 문제로 한 번 더 안정적으로 정리하겠습니다.`;
    }

    return `${wrongStr}의 풀이 과정을 함께 확인하고, 다음 단원으로 자신감 있게 이어가겠습니다.`;
}

function openParentReport(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) return toast('학생 정보를 찾을 수 없습니다.', 'warn');

    const classId = state.db.class_students.find(m => m.student_id === sid)?.class_id;
    const className = state.db.classes.find(c => c.id === classId)?.name || '';

    const sessions = state.db.exam_sessions
        .filter(e => e.student_id === sid)
        .sort((a, b) => String(b.exam_date).localeCompare(String(a.exam_date)))
        .slice(0, 4);

    if (!sessions.length) {
        toast('시험 기록이 없어 리포트를 생성할 수 없습니다.', 'warn');
        return;
    }

    const latest = sessions[0];

    const classStudentIds = state.db.class_students
        .filter(m => m.class_id === classId)
        .map(m => m.student_id);
    const classSessions = state.db.exam_sessions.filter(e =>
        e.exam_title === latest.exam_title &&
        e.exam_date === latest.exam_date &&
        classStudentIds.includes(e.student_id)
    );
    const classAvg = classSessions.length > 1
        ? Math.round(classSessions.reduce((sum, e) => sum + e.score, 0) / classSessions.length)
        : null;

    const recentAvg = sessions.length > 1
        ? Math.round(sessions.slice(0, 3).reduce((sum, e) => sum + e.score, 0) / Math.min(sessions.length, 3))
        : null;

    const wrongAnswers = state.db.wrong_answers
        .filter(w => w.session_id === latest.id)
        .map(w => w.question_id)
        .sort((a, b) => Number(a) - Number(b));

    const questions = state.db.questions || [];
    const weakUnits = [...new Set(
        wrongAnswers
            .map(qId => questions.find(q => String(q.id) === String(qId))?.standard_unit)
            .filter(Boolean)
    )].slice(0, 3);

    const today = new Date().toLocaleDateString('sv-SE');
    const att = state.db.attendance.find(a => a.student_id === sid && a.date === today);
    const hw = state.db.homework.find(h => h.student_id === sid && h.date === today);

    const prevScore = sessions.length > 1 ? sessions[1].score : null;
    const scoreDiff = prevScore !== null ? latest.score - prevScore : null;

    const qCount = latest.question_count || null;
    const correctRate = qCount
        ? Math.round(((qCount - wrongAnswers.length) / qCount) * 100)
        : null;

    const ctx = {
        student: s, className, latest, sessions,
        classAvg, recentAvg, wrongAnswers, weakUnits,
        att: att?.status || null, hw: hw?.status || null,
        scoreDiff, correctRate, qCount
    };

    showParentReportModal(ctx);
}

function showParentReportModal(ctx) {
    const { student, className, latest, sessions, classAvg, recentAvg,
            wrongAnswers, weakUnits, att, hw, scoreDiff, correctRate, qCount } = ctx;

    const dateStr = String(latest.exam_date || '').replace(/-/g, '.');
    const trendScores = [...sessions].reverse().map(e => e.score);

    const trendHtml = (() => {
        if (trendScores.length < 2) {
            return `<div style="font-size:13px;color:#64748b;text-align:center;padding:12px 0;">첫 시험 기록입니다.</div>`;
        }
        const max = Math.max(...trendScores, 100);
        return `<div style="display:flex;align-items:flex-end;gap:8px;justify-content:center;padding:8px 0;">` +
            trendScores.map((score, i) => {
                const h = Math.round((score / max) * 48);
                const isLast = i === trendScores.length - 1;
                return `<div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
                    <div style="font-size:11px;font-weight:700;color:${isLast ? '#1A5CFF' : '#64748b'};">${score}</div>
                    <div style="width:28px;height:${h}px;background:${isLast ? '#1A5CFF' : '#e2e8f0'};border-radius:4px 4px 0 0;"></div>
                </div>`;
            }).join('') + `</div>`;
    })();

    const compareText = (() => {
        if (classAvg !== null) return `반 평균 대비 ${latest.score >= classAvg ? '+' : ''}${latest.score - classAvg}점`;
        if (recentAvg !== null) return `최근 평균 대비 ${latest.score >= recentAvg ? '+' : ''}${latest.score - recentAvg}점`;
        return '';
    })();

    const diffBadge = scoreDiff !== null
        ? `<span style="font-size:12px;font-weight:700;color:${scoreDiff >= 0 ? '#16a34a' : '#dc2626'};background:${scoreDiff >= 0 ? '#f0fdf4' : '#fef2f2'};padding:3px 10px;border-radius:999px;margin-left:8px;">지난 시험 대비 ${scoreDiff >= 0 ? '+' : ''}${scoreDiff}점</span>`
        : '';

    const weakUnitHtml = weakUnits.length > 0
        ? weakUnits.map(u => `<span style="background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:700;padding:5px 12px;border-radius:999px;display:inline-block;margin:3px 4px 3px 0;">📌 ${u}</span>`).join('')
        : `<div style="font-size:13px;color:#64748b;">이번 시험에서는 뚜렷한 취약 단원이 확인되지 않았습니다.</div>`;

    const wrongHtml = wrongAnswers.length > 0
        ? wrongAnswers.join('번 · ') + '번'
        : '오답 없이 잘 마무리했습니다.';

    const statusRows = [
        att ? `<div style="font-size:13px;color:#475569;padding:3px 0;">출결 <b style="color:#0f172a;">${att === '등원' ? '등원 ✓' : att}</b></div>` : '',
        hw ? `<div style="font-size:13px;color:#475569;padding:3px 0;">숙제 <b style="color:#0f172a;">${hw === '완료' ? '완료 ✓' : hw}</b></div>` : ''
    ].filter(Boolean).join('');

    const defaultComment = latest.score >= 90
        ? '꾸준한 노력이 결실을 맺고 있습니다. 이 흐름을 유지해 주세요.'
        : latest.score >= 75
        ? '전반적으로 안정적인 실력을 보여주고 있습니다. 오답 단원 복습을 통해 더 좋은 결과를 기대합니다.'
        : '기초 개념 정리에 집중하면 빠른 향상이 가능합니다. 함께 꾸준히 해봅시다.';

    const nextPoint = buildReportCardNextPoint(wrongAnswers, weakUnits);

    const cardHtml = `
    <div id="parent-report-card" style="background:#ffffff;width:360px;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.12);font-family:inherit;margin:0 auto;">
        <div style="background:#0f172a;padding:18px 22px 14px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="color:#fff;font-size:16px;font-weight:800;letter-spacing:-0.5px;">AP MATH</span>
                <span style="color:rgba(255,255,255,0.6);font-size:12px;font-weight:600;">${dateStr}</span>
            </div>
            <div style="color:rgba(255,255,255,0.85);font-size:13px;font-weight:600;">${student.name} · ${className} · ${latest.exam_title}</div>
        </div>

        <div style="padding:24px 22px 18px;border-bottom:1px solid #e2e8f0;text-align:center;">
            <div style="font-size:56px;font-weight:900;color:#1A5CFF;line-height:1;letter-spacing:-2px;">${latest.score}<span style="font-size:24px;font-weight:700;color:#64748b;">점</span></div>
            ${diffBadge}
            ${compareText ? `<div style="font-size:13px;color:#64748b;font-weight:600;margin-top:8px;">${compareText}</div>` : ''}
            <div style="display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap;">
                ${recentAvg !== null ? `<span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;">최근 평균 ${recentAvg}점</span>` : ''}
                ${correctRate !== null ? `<span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 12px;border-radius:999px;">정답률 ${correctRate}%</span>` : ''}
            </div>
        </div>

        <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:10px;letter-spacing:0.05em;">최근 성적 추이</div>
            ${trendHtml}
        </div>

        <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:10px;letter-spacing:0.05em;">이번 시험 분석</div>
            <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                ${qCount ? `<span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">총 ${qCount}문항</span>` : ''}
                <span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">오답 ${wrongAnswers.length}문항</span>
            </div>
            <div style="font-size:13px;color:#475569;font-weight:600;">오답: ${wrongHtml}</div>
        </div>

        <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:10px;letter-spacing:0.05em;">취약 단원</div>
            ${weakUnitHtml}
        </div>

        ${statusRows ? `<div style="padding:14px 22px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:8px;letter-spacing:0.05em;">학습 상태</div>
            ${statusRows}
        </div>` : ''}

        <div style="padding:18px 22px;border-bottom:1px solid #e2e8f0;">
            <div style="font-size:12px;font-weight:700;color:#94a3b8;margin-bottom:8px;letter-spacing:0.05em;">선생님 코멘트</div>
            <div id="report-comment-display" style="font-size:13px;color:#0f172a;line-height:1.7;font-weight:500;">${defaultComment}</div>
        </div>

        <div style="padding:14px 22px;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
            <div style="font-size:12px;color:#64748b;line-height:1.6;font-weight:600;">
                <b style="color:#1A5CFF;">다음 학습 포인트</b><br>${nextPoint}
            </div>
        </div>

        <div style="padding:16px 22px;text-align:center;">
            <div style="font-size:13px;font-weight:800;color:#0f172a;letter-spacing:0.05em;">AP MATH REPORT</div>
            <div style="font-size:10px;color:#94a3b8;font-weight:600;margin-top:3px;">학생 맞춤 학습 리포트</div>
        </div>
    </div>`;

    document.getElementById('modal-title').innerText = '학부모 리포트';
    document.getElementById('modal-body').innerHTML = `
        <div style="margin-bottom:16px;">
            <label style="font-size:12px;font-weight:700;color:#64748b;display:block;margin-bottom:6px;">선생님 코멘트 (수정 가능)</label>
            <textarea id="report-comment-input" style="width:100%;height:72px;padding:10px 12px;border:1px solid #e2e8f0;border-radius:10px;font-size:13px;line-height:1.6;resize:vertical;font-family:inherit;color:#0f172a;box-sizing:border-box;"
                oninput="document.getElementById('report-comment-display').innerText=this.value"
                placeholder="이번 시험에서 잘한 점, 보완할 점을 입력하세요.">${defaultComment}</textarea>
        </div>
        <div style="overflow-x:auto;padding-bottom:8px;">${cardHtml}</div>`;

    document.getElementById('modal-action-btn').classList.add('hidden');
    document.getElementById('modal-overlay').classList.remove('hidden');

    const existingBtn = document.getElementById('report-save-btn');
    if (existingBtn) existingBtn.remove();
    const footer = document.getElementById('modal-footer');
    const saveBtn = document.createElement('button');
    saveBtn.id = 'report-save-btn';
    saveBtn.className = 'btn btn-primary';
    saveBtn.style.cssText = 'padding:12px 24px;font-size:14px;font-weight:700;border-radius:12px;';
    saveBtn.innerText = '이미지 저장';
    saveBtn.onclick = () => saveParentReportImage(student.name, latest.exam_title);
    footer.insertBefore(saveBtn, footer.firstChild);
}

async function saveParentReportImage(name, examTitle) {
    const card = document.getElementById('parent-report-card');
    if (!card || typeof html2canvas === 'undefined') {
        toast('이미지 저장 기능을 불러오지 못했습니다.', 'warn');
        return;
    }
    try {
        toast('이미지 생성 중...', 'info');
        const canvas = await html2canvas(card, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false
        });
        const link = document.createElement('a');
        link.download = `AP_리포트_${name}_${examTitle}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast('이미지가 저장되었습니다. 카카오톡에서 전송하세요!', 'info');
    } catch (e) {
        toast('이미지 저장에 실패했습니다.', 'warn');
    }
}
