/**
 * AP Math OS 1.0 [js/report.js]
 * 보고 문구 생성 및 AI 연동 엔진
 * [IRONCLAD 5G]&#58; 고급 발송 문구 / 미리보기 후 최종 복사 / Top Action 모달 적용
 */

/**
 * 학생의 최근 성적 평균 계산
 */
function reportCenterGetSortedStudentExamSessions(studentId) {
    return (state.db.exam_sessions || [])
        .filter(s => String(s.student_id) === String(studentId))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));
}

function getRecentAverage(studentId, limit = 3) {
    const scores = reportCenterGetSortedStudentExamSessions(studentId)
        .slice(0, limit)
        .map(s => Number(s.score))
        .filter(v => Number.isFinite(v));

    if (!scores.length) return null;
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

const AP_REPORT_HUMANIZE_TOKEN_RE = /(?:\d+(?:\.\d+)?\s*(?:점|%|개|문항|회|번)?|[A-Za-z][A-Za-z0-9_-]*|「[^」]+」|\[[^\]]+\])/g;
const AP_REPORT_HUMANIZE_AI_PHRASES = [
    '를 통해',
    '에 대해',
    '에 있어서',
    '향후',
    '종합적으로',
    '다각도로',
    '학습 성취도',
    '제고',
    '유의미한',
    '시사하는 바',
    '중요한 의미를 가집니다',
    '학습 방향 설정',
    '체계적인 관리',
    '개선이 기대됩니다',
    '결론적으로',
    '주목할 만한',
    '중요한 시사점',
    '긍정적인 영향을 미칠 수 있습니다',
    '도움이 될 것으로 보입니다',
    '필요가 있습니다',
    '할 수 있을 것으로 판단됩니다',
    '확인할 수 있었습니다',
    '또한,',
    '따라서,',
    '즉,',
    '나아가,',
    '이에 따라,'
];

const AP_REPORT_EASY_FORBIDDEN_RE = /학습 흐름|성취 흐름|풀이 흐름|보완|약점|보완 포인트|보완 지점|보완 방향|확인 포인트|시사점|유의미한 자료|다각도로|향후|학습 방향 설정|중요한 의미를 가집니다|체계적인 관리|확인이 필요합니다|도움이 될 것으로 보입니다|개선이 기대됩니다|종합적으로 파악|조건 표시|유사문항|유사 문제|오답|풀이 과정|풀이 순서/g;

function reportCenterDefaultTextOptions() {
    return {
        tone: 'calm_parent',
        length: 'standard',
        humanize: true
    };
}

function reportHumanizeExtractTokens(text) {
    return String(text || '').match(AP_REPORT_HUMANIZE_TOKEN_RE) || [];
}

function reportHumanizePreservesFacts(before, after) {
    const beforeTokens = reportHumanizeExtractTokens(before);
    const afterTokens = reportHumanizeExtractTokens(after);
    return beforeTokens.length === afterTokens.length
        && beforeTokens.every((token, index) => token === afterTokens[index]);
}

function reportHumanizeDeduplicateSentences(text) {
    const seen = new Set();
    return String(text || '')
        .split(/(\n{2,})/)
        .map(part => {
            if (/^\n+$/.test(part)) return part;
            return part
                .split(/(?<=[.!?。！？])\s+/)
                .filter(sentence => {
                    const key = sentence.replace(/\s+/g, ' ').trim();
                    if (!key) return false;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return true;
                })
                .join(' ');
        })
        .join('');
}

function reportHumanizeApplyApMathTone(text, audience = 'parent') {
    let out = String(text || '');
    const isStudent = audience === 'student';
    out = out
        .replace(/[😀-🙏🌀-🗿🚀-🛿]+/gu, '')
        .replace(/([가-힣](?:고|며|지만|면서|어서|아서|해서|위해)),/g, '$1')
        .replace(/(결론적으로|요약하면|정리하면|종합적으로|따라서)\s*,?\s*/g, '')
        .replace(/또한,\s*/g, '')
        .replace(/즉,\s*/g, '')
        .replace(/나아가,\s*/g, '')
        .replace(/이에 따라,\s*/g, '')
        .replace(/향후/g, '다음 수업에서는')
        .replace(/에 있어서/g, '에서')
        .replace(/에 있어/g, '에서')
        .replace(/([가-힣A-Za-z0-9]+)를 통해/g, '$1로')
        .replace(/학습 성취도/g, '다시 볼 부분')
        .replace(/학습 방향 설정/g, '다음 학습 방향')
        .replace(/체계적인 관리/g, '차근차근 관리')
        .replace(/유의미한/g, '의미 있는')
        .replace(/다각도로/g, '함께')
        .replace(/제고/g, '끌어올리는 것')
        .replace(/주목할 만합니다/g, '확인됩니다')
        .replace(/주목할 만한/g, '확인되는')
        .replace(/중요한 시사점/g, '확인할 부분')
        .replace(/중요한 의미를 가집니다/g, '함께 확인해 볼 부분입니다')
        .replace(/시사하는 바/g, '확인할 부분')
        .replace(/시사하는 바가 큽니다/g, '함께 확인할 필요가 있습니다')
        .replace(/종합적으로 파악할 수 있는 자료입니다/g, '함께 확인해 볼 수 있는 자료입니다')
        .replace(/긍정적인 영향을 미칠 수 있습니다/g, '도움이 됩니다')
        .replace(/도움이 될 것으로 보입니다/g, '도움이 됩니다')
        .replace(/할 수 있을 것으로 판단됩니다/g, '할 수 있습니다')
        .replace(/확인할 수 있었습니다/g, '확인했습니다')
        .replace(/개선이 기대됩니다/g, '차근차근 나아질 수 있습니다')
        .replace(/본질적으로|핵심적으로/g, '중요하게')
        .replace(/혁신적인|획기적인|강력한/g, '뚜렷한')
        .replace(/매우 안정적/g, '안정적')
        .replace(/상당히/g, '꽤')
        .replace(/이번 리포트는 점수뿐 아니라/g, '이번 리포트에서는 점수와 함께')
        .replace(/점수만 보는 것이 아니라/g, '점수만 보지 않고')
        .replace(/보완할 지점이 확인되어/g, '다시 볼 부분이 있어')
        .replace(/보완 방향을 잡을 수 있습니다/g, '다음 시간에 볼 부분을 정하겠습니다')
        .replace(/보완이 필요합니다/g, '다시 봐야 합니다')
        .replace(/추가 확인이 필요한 문항/g, '함께 확인할 문항')
        .replace(/관리할 지점/g, '확인할 부분')
        .replace(/학습 폭을 넓혀가겠습니다/g, '학습 폭을 넓히겠습니다')
        .replace(/자연스럽게 확장하겠습니다/g, '차근차근 이어가겠습니다')
        .replace(/안정적으로 유지되고 있습니다/g, '잘 유지되고 있습니다')
        .replace(/흐름이 안정적으로 유지되고/g, '흐름이 잘 유지되고')
        .replace(/풀이 흐름/g, '푸는 과정')
        .replace(/유사 문제 풀이까지 함께 진행하겠습니다/g, '비슷한 문제까지 함께 보겠습니다');

    if (!isStudent) {
        out = out
            .replace(/큰 도움이 됩니다/g, '도움이 됩니다')
            .replace(/충분합니다/g, '좋겠습니다')
            .replace(/가볍게 격려해 주시면/g, '한 번만 격려해 주시면');
    }

    out = reportHumanizeDeduplicateSentences(out);
    return out
        .replace(/틀린 문제이/g, '틀린 문제가')
        .replace(/틀린 문제을/g, '틀린 문제를')
        .replace(/틀린 문제은/g, '틀린 문제는')
        .replace(/시험는/g, '시험은')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+\n/g, '\n')
        .trim();
}

function reportCenterApplyEasyFinalLanguage(text) {
    let out = String(text || '');
    if (!out.trim()) return '';
    return out
        .replace(/오답\s*(\d+)\s*개/g, '$1문제 틀렸습니다')
        .replace(/오답\s*(\d+)\s*문항/g, '$1문제 틀렸습니다')
        .replace(/오답/g, '틀린 문제')
        .replace(/유사문항|유사 문제/g, '비슷한 문제')
        .replace(/풀이 과정/g, '푸는 과정')
        .replace(/풀이 순서/g, '푸는 순서')
        .replace(/조건 표시,?\s*/g, '')
        .replace(/개념 연결|개념 확인/g, '관련 개념')
        .replace(/보완 포인트|보완 지점|보완 방향|보완 영역|보완 문항|보완/g, '다시 볼 부분')
        .replace(/반복 약점|약점/g, '계속 틀리는 부분')
        .replace(/마무리했습니다/g, '잘 봤습니다')
        .replace(/현재 학습 흐름|학습 흐름|성취 흐름|풀이 흐름/g, '현재 공부한 내용')
        .replace(/시사점|유의미한 자료|중요한 의미를 가집니다/g, '다시 볼 부분')
        .replace(/다각도로|종합적으로 파악/g, '함께')
        .replace(/향후/g, '다음 시간에')
        .replace(/학습 방향 설정/g, '다음 수업 준비')
        .replace(/체계적인 관리/g, '차근차근 다시 잡기')
        .replace(/확인이 필요합니다/g, '다시 봐야 합니다')
        .replace(/도움이 될 것으로 보입니다/g, '도움이 됩니다')
        .replace(/개선이 기대됩니다/g, '차근차근 좋아질 수 있습니다')
        .replace(/평가는/g, '시험은')
        .replace(/평가에서/g, '시험에서')
        .replace(/오답이/g, '틀린 문제가')
        .replace(/문항/g, '문제')
        .replace(/평가/g, '시험')
        .replace(/틀린 문제이/g, '틀린 문제가')
        .replace(/틀린 문제을/g, '틀린 문제를')
        .replace(/틀린 문제은/g, '틀린 문제는')
        .replace(/시험는/g, '시험은')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function reportHumanizeApMathText(value, options = {}) {
    const original = String(value || '');
    if (!original.trim()) return '';
    const rewritten = reportHumanizeApplyApMathTone(original, options.audience || 'parent');
    if (!reportHumanizePreservesFacts(original, rewritten)) return original.trim();
    const maxChange = Number(options.maxChangeRatio || 0.3);
    const baseLength = Math.max(1, original.trim().length);
    const changeRatio = Math.abs(rewritten.length - original.trim().length) / baseLength;
    if (changeRatio > maxChange) return original.trim();
    return rewritten;
}

function reportCenterDetectAiLikePhrases(text, options = {}) {
    const source = String(text || '');
    const findings = [];
    AP_REPORT_HUMANIZE_AI_PHRASES.forEach(phrase => {
        let index = source.indexOf(phrase);
        while (index !== -1) {
            findings.push({ phrase, index, severity: phrase.includes('결론적으로') || phrase.includes('시사') ? 'S1' : 'S2' });
            index = source.indexOf(phrase, index + phrase.length);
        }
    });
    const orderedMarkers = ['첫째', '둘째', '셋째'].filter(marker => source.includes(marker));
    if (orderedMarkers.length >= 2) findings.push({ phrase: orderedMarkers.join('/'), index: source.indexOf(orderedMarkers[0]), severity: 'S2' });
    return findings;
}

function reportCenterHumanizeKoreanText(text, options = {}) {
    const original = String(text || '');
    if (!original.trim()) return '';
    if (options.humanize === false) return original;
    const blockKey = options.blockKey || '';
    const tone = options.tone || 'calm_parent';
    const audience = tone === 'kakao_short' || blockKey === 'kakaoSummary'
        ? 'parent'
        : tone === 'analytic' || blockKey === 'teacherOpinion'
            ? 'counsel'
            : 'parent';
    let next = reportHumanizeApMathText(original, { audience, maxChangeRatio: 0.3 });
    if ((tone === 'kakao_short' || blockKey === 'kakaoSummary') && next) {
        const sentences = (next.match(/[^.!?。！？]+[.!?。！？]?/g) || [next]).map(v => v.trim()).filter(Boolean);
        if (sentences.length > 4) {
            const compact = sentences.slice(0, 4).join(' ');
            if (reportHumanizePreservesFacts(original, compact)) next = compact;
        }
    }
    const safe = reportHumanizePreservesFacts(original, next) ? next : original.trim();
    return reportCenterApplyEasyFinalLanguage(safe);
}

function reportCenterHumanizeReportBlocks(blocks, options = {}) {
    const source = blocks && typeof blocks === 'object' ? blocks : {};
    Object.entries(source).forEach(([blockKey, block]) => {
        if (!block || typeof block !== 'object') return;
        const blockOptions = { ...options, blockKey };
        if ('autoText' in block) block.autoText = reportCenterHumanizeKoreanText(block.autoText, { ...blockOptions, source: 'auto' });
        if ('aiText' in block) block.aiText = reportCenterHumanizeKoreanText(block.aiText, { ...blockOptions, source: 'ai' });
        if (options.includeDirty && block.isDirty) {
            block.userText = reportCenterHumanizeKoreanText(String(block.userText ?? ''), { ...blockOptions, source: 'user' });
        }
    });
    return source;
}

function reportCenterBuildHumanizeWarnings(text, options = {}) {
    const findings = reportCenterDetectAiLikePhrases(text, options);
    const phrases = Array.from(new Set(findings.map(item => item.phrase))).slice(0, 5);
    const warnings = phrases.length ? [`AI식 표현이 일부 남아 있습니다: ${phrases.map(v => `“${v}”`).join(', ')}`] : [];
    const blockKey = options.blockKey || '';
    const length = options.length || 'standard';
    const limits = {
        standard: { summary: 160, weakness: 180, teacherOpinion: 240, parentMessage: 220, kakaoSummary: 250 },
        detailed: { summary: 280, trend: 220, weakness: 300, teacherOpinion: 420, parentMessage: 360, kakaoSummary: 350 }
    };
    const limit = limits[length]?.[blockKey];
    if (limit && String(text || '').length > limit) {
        warnings.push(`${length === 'standard' ? '표준형' : '상세형'} 권장 길이를 초과했습니다. PDF가 2페이지로 넘어갈 수 있습니다.`);
    }
    return warnings;
}

function copyReportLegacy(sid, type, options = {}) {
    const ctx = buildReportContext(sid, options);
    const s = ctx.student;

    if (!s) {
        toast('?숈깮 ?뺣낫瑜?李얠쓣 ???놁뒿?덈떎.', 'warn');
        return;
    }

    let text = '';
    let title = '蹂닿퀬 臾멸뎄';
    if (type === 'parent') {
        text = buildParentReportText(ctx);
        title = '?숇?紐⑥슜 臾멸뎄';
    } else if (type === 'student') {
        text = buildStudentReportText(ctx);
        title = '?숈깮??臾멸뎄';
    } else {
        text = buildCounselReportText(ctx);
        title = '?곷떞??臾멸뎄';
    }

    const safeSid = escapeReportJsString(sid);
    const safeType = escapeReportJsString(type);
    const today = reportArchiveToday();
    const defaultTitle = reportArchiveDefaultTitle(s.name || '', today, today);
    reportArchiveState().currentArchiveId = '';
    reportArchiveState().loadedArchive = null;
    reportArchiveState().autoText = text;
    reportArchiveState().dirty = false;

    showModal(title, `
        <div style="display:grid; grid-template-columns:minmax(0, 1fr) 280px; gap:14px; align-items:start;">
            <div style="background:var(--bg); padding:16px; border-radius:18px;">
                <div style="display:grid; grid-template-columns:1.3fr 1fr 1fr; gap:8px; margin-bottom:10px;">
                    <input id="report-archive-title" class="btn" value="${escapeHtmlForTextarea(defaultTitle)}" style="min-height:42px; text-align:left; background:var(--surface); border:1px solid var(--border); font-size:12px; font-weight:700;" oninput="reportArchiveHandleTextInput()">
                    <input id="report-archive-range-start" type="date" class="btn" value="${today}" style="min-height:42px; background:var(--surface); border:1px solid var(--border); font-size:12px; font-weight:700;" onchange="reportArchiveHandleOptionChange('${safeSid}', '${safeType}', 'basic')">
                    <input id="report-archive-range-end" type="date" class="btn" value="${today}" style="min-height:42px; background:var(--surface); border:1px solid var(--border); font-size:12px; font-weight:700;" onchange="reportArchiveHandleOptionChange('${safeSid}', '${safeType}', 'basic')">
                </div>
                <div style="display:flex; justify-content:space-between; gap:8px; align-items:center; margin-bottom:8px;">
                    <p style="margin:0; font-size:12px; color:var(--secondary); font-weight:700;">\uC790\uB3D9 \uC0DD\uC131 \uD6C4 \uC218\uC815\uD55C \uBB38\uAD6C\uB294 \uC790\uB3D9\uC73C\uB85C \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</p>
                    <span id="report-archive-dirty-badge" style="font-size:11px; font-weight:800; color:var(--secondary); white-space:nowrap;">\uC800\uC7A5\uB428</span>
                </div>
                <textarea id="report-copy-text" class="btn" style="width:100%; height:300px; text-align:left; background:var(--surface); border:none; padding:16px; font-size:14px; line-height:1.7; resize:vertical; font-family:inherit; white-space:pre-wrap;" oninput="reportArchiveHandleTextInput()">${escapeHtmlForTextarea(text)}</textarea>
                <textarea id="report-archive-memo" class="btn" placeholder="\uC0C1\uB2F4 \uBA54\uBAA8" style="width:100%; min-height:70px; margin-top:8px; text-align:left; background:var(--surface); border:1px solid var(--border); padding:12px; font-size:12px; line-height:1.6; resize:vertical; font-family:inherit;" oninput="reportArchiveHandleTextInput()"></textarea>
                <div id="report-archive-option-warning" style="min-height:18px; margin-top:8px; font-size:11px; color:#b45309; font-weight:700; line-height:1.5;"></div>
                <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px; margin-top:10px;">
                    <button class="btn btn-primary" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px;" onclick="reportArchiveSave('${safeSid}', '${safeType}', 'basic', 'upsert')">\uB9AC\uD3EC\uD2B8 \uC800\uC7A5</button>
                    <button class="btn" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportArchiveSave('${safeSid}', '${safeType}', 'basic', 'update')">\uBCC0\uACBD\uC0AC\uD56D \uC800\uC7A5</button>
                    <button class="btn" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportArchiveSaveAs('${safeSid}', '${safeType}', 'basic')">\uB2E4\uB978 \uC774\uB984\uC73C\uB85C \uC800\uC7A5</button>
                    <button class="btn" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportArchiveRegenerateText('${safeSid}', '${safeType}', 'basic', true)">\uBB38\uAD6C \uB2E4\uC2DC \uC0DD\uC131</button>
                    <button class="btn" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px; background:var(--surface); border:1px solid var(--border);" onclick="reportArchivePrintCurrent('${safeSid}')">\uC800\uC7A5\uBCF8 \uC778\uC1C4</button>
                    <button class="btn" style="min-height:42px; font-size:12px; font-weight:800; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="reportArchiveSaveConsultationAndLink('${safeSid}', '${safeType}', 'basic', 'report-copy-text')">\uC0C1\uB2F4\uAE30\uB85D\uC5D0\uB3C4 \uC800\uC7A5</button>
                </div>
            </div>
            <div style="background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:12px; max-height:520px; overflow:auto;">
                <div style="font-size:13px; font-weight:900; color:var(--text); margin-bottom:8px;">\uC800\uC7A5 \uB9AC\uD3EC\uD2B8</div>
                <div id="report-archive-list"></div>
            </div>
        </div>
    `, '理쒖쥌 蹂듭궗', copyStaticReportText);
    reportArchiveLoadList(sid);
}

/**
 * 보고 문구 생성용 기본 데이터 수집
 */
const AP_REPORT_CONTEXT_OPTIONS_LIMIT = 30;

function limitReportContextOptions(keepKey = '') {
    window.AP_REPORT_CONTEXT_OPTIONS = window.AP_REPORT_CONTEXT_OPTIONS || {};
    const keys = Object.keys(window.AP_REPORT_CONTEXT_OPTIONS);
    if (keys.length <= AP_REPORT_CONTEXT_OPTIONS_LIMIT) return;

    keys
        .filter(key => key !== keepKey)
        .slice(0, Math.max(0, keys.length - AP_REPORT_CONTEXT_OPTIONS_LIMIT))
        .forEach(key => delete window.AP_REPORT_CONTEXT_OPTIONS[key]);
}

function registerReportPayload(payload = {}) {
    window.AP_REPORT_CONTEXT_OPTIONS = window.AP_REPORT_CONTEXT_OPTIONS || {};
    const key = `report_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.AP_REPORT_CONTEXT_OPTIONS[key] = payload || {};
    limitReportContextOptions(key);
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
    const safeSid = String(sid || '');
    const student = typeof apmsGetStudentById === 'function'
        ? apmsGetStudentById(safeSid)
        : state.db.students.find(x => String(x.id) === safeSid);
    const today = new Date().toLocaleDateString('sv-SE');
    const rangeStart = String(reportOptions.rangeStart || '').trim();
    const rangeEnd = String(reportOptions.rangeEnd || '').trim();
    const inReportRange = dateValue => {
        const d = String(dateValue || '').slice(0, 10);
        if (!d) return false;
        if (rangeStart && d < rangeStart) return false;
        if (rangeEnd && d > rangeEnd) return false;
        return true;
    };
    const attendanceRows = (state.db.attendance || []).filter(a => String(a.student_id) === safeSid && inReportRange(a.date || a.created_at));
    const homeworkRows = (state.db.homework || []).filter(h => String(h.student_id) === safeSid && inReportRange(h.date || h.created_at));

    const attendance = state.db.attendance.find(a => String(a.student_id) === safeSid && a.date === today)?.status || '미기록';
    const homework = state.db.homework.find(h => String(h.student_id) === safeSid && h.date === today)?.status || '미기록';

    const exams = typeof apmsGetExamSessionsForStudent === 'function'
        ? apmsGetExamSessionsForStudent(safeSid)
        : (state.db.exam_sessions || [])
            .filter(e => String(e.student_id) === safeSid)
            .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')) || String(b.id || '').localeCompare(String(a.id || '')));

    const todayExam = exams.find(e => e.exam_date === today) || null;
    const latestExam = todayExam || exams[0] || null;
    const avg = getRecentAverage(safeSid, 3);

    const wrongIds = latestExam
        ? (typeof apmsGetWrongAnswersForSession === 'function'
            ? apmsGetWrongAnswersForSession(latestExam.id)
            : (state.db.wrong_answers || []).filter(w => String(w.session_id) === String(latestExam.id)))
            .map(w => w.question_id)
            .sort((a, b) => Number(a) - Number(b))
        : [];

    const classMap = typeof apmsGetClassStudentMap === 'function'
        ? apmsGetClassStudentMap(safeSid)
        : (state.db.class_students || []).find(m => String(m.student_id) === safeSid);
    const classId = classMap?.class_id || '';
    const className = typeof apmsGetClassById === 'function'
        ? (apmsGetClassById(classId)?.name || '')
        : ((state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '');

    const latestRecord = classId
        ? (typeof apmsGetLatestClassDailyRecord === 'function'
            ? apmsGetLatestClassDailyRecord(classId)
            : (state.db.class_daily_records || [])
                .filter(r => String(r.class_id) === String(classId))
                .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] || null)
        : null;

    const progressItems = latestRecord
        ? (typeof apmsGetClassDailyProgressRows === 'function'
            ? apmsGetClassDailyProgressRows(latestRecord.id)
            : (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(latestRecord.id)))
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

    const latestConsultation = (typeof apmsGetConsultationsForStudent === 'function'
        ? apmsGetConsultationsForStudent(safeSid)
        : (state.db.consultations || [])
            .filter(c => String(c.student_id) === safeSid)
            .sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))))[0] || null;
    const targetProgress = typeof computeStudentTargetProgress === 'function'
        ? computeStudentTargetProgress(safeSid)
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
        missingExamInfo: reportOptions.missingExamInfo || null,
        rangeStart,
        rangeEnd,
        attendanceRows,
        homeworkRows
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
        return `최근 평가인 「${exam.exam_title}」에서 ${score}점을 기록했습니다.${avgText} 모든 문항을 정확하게 해결했습니다.`;
    }

    return `최근 평가인 「${exam.exam_title}」에서 ${score}점을 기록했습니다.${avgText} 오답 ${ctx.wrongIds.length}개가 확인되었습니다.`;
}

function buildNextPoint(ctx) {
    if (!ctx.wrongIds.length) {
        if (ctx.progressText) {
            return `${ctx.progressText} 이후 내용으로 학습을 이어가는 것`;
        }
        return '오늘 다룬 개념을 바탕으로 응용력을 한 단계 높이는 것';
    }

    const wrongStr = ctx.wrongIds.length === 1
        ? `${ctx.wrongIds[0]}번 문항을 다시 풀고 유사 문제로 연결하는 것`
        : `${ctx.wrongIds.join(', ')}번 문항을 다시 풀고 유사 문제로 연결하는 것`;

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
    return reportHumanizeApMathText(`\uAD00\uB9AC \uAD00\uC810\uC5D0\uC11C\uB294 \uCD5C\uADFC ${summary} \uD750\uB984\uC774 \uBCF4\uC5EC, \uB2E4\uC74C \uC218\uC5C5\uC5D0\uC11C \uD574\uB2F9 \uBD80\uBD84\uC744 \uC6B0\uC120 \uD655\uC778\uD558\uACA0\uC2B5\uB2C8\uB2E4.`, { audience: 'parent' });
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
    if (!summaries.length) return reportHumanizeApMathText(text, { audience: 'parent' });
    const summaryText = summaries.join("\n\n");
    const thanks = '\uAC10\uC0AC\uD569\uB2C8\uB2E4';
    if (text.includes(thanks)) {
        return reportHumanizeApMathText(text.replace(thanks, `${summaryText}\n\n${thanks}`), { audience: 'parent' });
    }
    return reportHumanizeApMathText(`${text}\n\n${summaryText}`, { audience: 'parent' });
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
        return reportHumanizeApMathText(`${s.name}아, 오늘 수업은 결석으로 확인됐어.

다음 시간에 진도가 끊기지 않도록 필요한 부분부터 다시 확인할게.
오기 전에는 교재와 지난 숙제만 챙겨서 오면 돼.${targetStudentLine}`, { audience: 'student' });
    }

    const examSentence = ctx.latestExam
        ? `최근 평가에서는 ${ctx.latestExam.score}점이 나왔고, ${ctx.wrongIds.length ? `오답 ${ctx.wrongIds.length}개를 다시 확인하면 좋아.` : '오답 없이 잘 정리했어.'}`
        : '오늘 수업에서 다룬 개념을 한 번 더 정리하면 좋아.';

    const homeworkSentence = ctx.homework === '미완료'
        ? '숙제는 아직 부족한 부분이 있으니 다음 시간 전까지 마무리해 오자.'
        : '지금처럼 수업 흐름을 유지하면 돼.';

    return reportHumanizeApMathText(`${s.name}아, 오늘 수업 수고했어.

${examSentence}
${homeworkSentence}
${targetStudentLine}

다음 시간 전까지 ${nextPoint}만 정리해서 오자.`, { audience: 'student' });
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

const AP_REPORT_ARCHIVE_REPORT_TYPE = 'parent_report';

function reportArchiveState() {
    window.AP_REPORT_ARCHIVE_MODAL_STATE = window.AP_REPORT_ARCHIVE_MODAL_STATE || {};
    return window.AP_REPORT_ARCHIVE_MODAL_STATE;
}

function reportArchiveText(value) {
    return String(value || '').trim();
}

function reportArchiveToday() {
    return new Date().toLocaleDateString('sv-SE');
}

function reportArchivePeriodLabel(start, end) {
    const s = reportArchiveText(start);
    const e = reportArchiveText(end);
    if (s && e && s !== e) return `${s} ~ ${e}`;
    return s || e || reportArchiveToday();
}

function reportArchiveDefaultTitle(studentName, start, end) {
    return `${studentName || 'AP MATH'} ${reportArchivePeriodLabel(start, end)} \uD559\uBD80\uBAA8 \uB9AC\uD3EC\uD2B8`;
}

function reportArchiveGetInputs() {
    return {
        title: document.getElementById('report-archive-title'),
        start: document.getElementById('report-archive-range-start'),
        end: document.getElementById('report-archive-range-end'),
        memo: document.getElementById('report-archive-memo'),
        textarea: document.getElementById('report-copy-text')
    };
}

function reportArchiveBuildSnapshot(studentId, targetType, sourceType, autoText, finalMessage, options = {}) {
    const ctx = buildReportContext(studentId, options);
    const s = ctx.student || {};
    const sessions = (ctx.exams || []).slice(0, 10).map(e => ({
        id: e.id || '',
        exam_date: e.exam_date || '',
        exam_title: e.exam_title || '',
        score: e.score ?? '',
        question_count: e.question_count ?? ''
    }));
    return {
        version: 1,
        system_type: 'apmath',
        report_type: AP_REPORT_ARCHIVE_REPORT_TYPE,
        target_type: targetType || 'parent',
        source_type: sourceType || 'basic',
        saved_at: new Date().toISOString(),
        student_snapshot: {
            id: s.id || studentId,
            name: s.name || '',
            school_name: s.school_name || '',
            grade: s.grade || '',
            status: s.status || ''
        },
        class_snapshot: {
            class_id: ctx.classId || '',
            class_name: ctx.className || ''
        },
        range: {
            start: options.rangeStart || '',
            end: options.rangeEnd || '',
            label: reportArchivePeriodLabel(options.rangeStart, options.rangeEnd)
        },
        attendance_summary: {
            current_status: ctx.attendance || '',
            rows: (ctx.attendanceRows || []).map(r => ({ date: r.date || '', status: r.status || '', memo: r.memo || '' }))
        },
        homework_summary: {
            current_status: ctx.homework || '',
            rows: (ctx.homeworkRows || []).map(r => ({ date: r.date || '', status: r.status || '', memo: r.memo || '' }))
        },
        exam_summary: {
            latest_exam: ctx.latestExam ? {
                id: ctx.latestExam.id || '',
                exam_date: ctx.latestExam.exam_date || '',
                exam_title: ctx.latestExam.exam_title || '',
                score: ctx.latestExam.score ?? '',
                question_count: ctx.latestExam.question_count ?? ''
            } : null,
            recent_average: ctx.avg,
            sessions,
            wrong_ids: ctx.wrongIds || []
        },
        weak_units_summary: {
            wrong_ids: ctx.wrongIds || []
        },
        progress_summary: {
            progress_text: ctx.progressText || '',
            target_progress: ctx.targetProgress || null
        },
        options: {
            rangeStart: options.rangeStart || '',
            rangeEnd: options.rangeEnd || ''
        },
        counsel_memo: reportArchiveGetInputs().memo?.value || '',
        auto_message: autoText || '',
        final_message: finalMessage || ''
    };
}

function reportArchivePayloadFromLoaded(row) {
    const payload = row?.payload_json || row?.payloadJson || {};
    return payload && typeof payload === 'object' ? payload : {};
}

function reportArchiveSetDirty(isDirty) {
    const st = reportArchiveState();
    st.dirty = !!isDirty;
    const badge = document.getElementById('report-archive-dirty-badge');
    if (badge) badge.textContent = st.dirty ? '\uC218\uC815\uB428' : '\uC800\uC7A5\uB428';
}

function reportArchiveHandleTextInput() {
    reportArchiveSetDirty(true);
}

function reportArchiveHandleOptionChange(studentId, targetType, sourceType) {
    const st = reportArchiveState();
    const info = document.getElementById('report-archive-option-warning');
    if (st.dirty && info) {
        info.textContent = '\uAE30\uAC04/\uC635\uC158\uC774 \uBCC0\uACBD\uB418\uC5C8\uC2B5\uB2C8\uB2E4. \uC218\uC815\uBB38\uAD6C\uB294 \uC790\uB3D9\uC73C\uB85C \uB36E\uC5B4\uC4F0\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uD544\uC694\uD558\uBA74 "\uBB38\uAD6C \uB2E4\uC2DC \uC0DD\uC131"\uC744 \uB204\uB974\uC138\uC694.';
        return;
    }
    reportArchiveRegenerateText(studentId, targetType, sourceType, false);
}

function reportArchiveRegenerateText(studentId, targetType, sourceType, force = true) {
    const inputs = reportArchiveGetInputs();
    if (!inputs.textarea) return;
    if (reportArchiveState().dirty && !force) return;
    const options = { rangeStart: inputs.start?.value || '', rangeEnd: inputs.end?.value || '' };
    const ctx = buildReportContext(studentId, options);
    let text = '';
    if (targetType === 'parent') text = buildParentReportText(ctx);
    else if (targetType === 'student') text = buildStudentReportText(ctx);
    else text = buildCounselReportText(ctx);
    inputs.textarea.value = text;
    reportArchiveState().autoText = text;
    reportArchiveState().currentArchiveId = force ? '' : reportArchiveState().currentArchiveId;
    reportArchiveSetDirty(false);
    const info = document.getElementById('report-archive-option-warning');
    if (info) info.textContent = '';
}

async function reportArchiveLoadList(studentId) {
    const listEl = document.getElementById('report-archive-list');
    if (!listEl || typeof api === 'undefined') return;
    listEl.innerHTML = '<div style="padding:12px; font-size:12px; color:var(--secondary); font-weight:700;">Loading...</div>';
    try {
        const r = await api.get(`student-report-archives?student_id=${encodeURIComponent(studentId)}`);
        const rows = Array.isArray(r.data) ? r.data : (Array.isArray(r.report_archives) ? r.report_archives : []);
        reportArchiveState().archives = rows;
        if (!rows.length) {
            listEl.innerHTML = `<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:700;">\uC800\uC7A5\uB41C \uB9AC\uD3EC\uD2B8\uAC00 \uC544\uC9C1 \uC5C6\uC2B5\uB2C8\uB2E4.</div>`;
            return;
        }
        listEl.innerHTML = rows.map(row => {
            const title = reportCenterEscape(row.title || '\uBB34\uC81C \uB9AC\uD3EC\uD2B8');
            const period = reportCenterEscape(row.period_label || reportArchivePeriodLabel(row.range_start, row.range_end));
            const updated = reportCenterEscape(String(row.updated_at || row.created_at || '').replace('T', ' ').slice(0, 16));
            const createdBy = reportCenterEscape(row.created_by || '-');
            const cns = row.consultation_saved ? '\uC0C1\uB2F4\uC800\uC7A5 \uC644\uB8CC' : '\uC0C1\uB2F4\uBBF8\uC5F0\uACB0';
            return `<button type="button" class="btn" style="width:100%; text-align:left; display:block; padding:11px 12px; border:1px solid var(--border); border-radius:12px; background:var(--surface); margin-bottom:8px;" onclick="reportArchiveOpenSaved('${escapeReportJsString(studentId)}', '${escapeReportJsString(row.id)}')">
                <div style="font-size:13px; font-weight:800; color:var(--text);">${title}</div>
                <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:4px;">${period} · ${updated} · ${createdBy} · ${cns}</div>
            </button>`;
        }).join('');
    } catch (e) {
        listEl.innerHTML = `<div style="padding:12px; color:#dc2626; font-size:12px; font-weight:700;">\uC800\uC7A5 \uBAA9\uB85D\uC744 \uBD88\uB7EC\uC624\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.</div>`;
    }
}

function reportArchiveOpenSaved(studentId, archiveId) {
    const st = reportArchiveState();
    const row = (st.archives || []).find(item => String(item.id) === String(archiveId));
    if (!row) return;
    const payload = reportArchivePayloadFromLoaded(row);
    const inputs = reportArchiveGetInputs();
    if (inputs.title) inputs.title.value = row.title || '';
    if (inputs.start) inputs.start.value = row.range_start || payload.range?.start || '';
    if (inputs.end) inputs.end.value = row.range_end || payload.range?.end || '';
    if (inputs.memo) inputs.memo.value = payload.counsel_memo || '';
    if (inputs.textarea) inputs.textarea.value = row.final_message || payload.final_message || '';
    st.currentArchiveId = row.id;
    st.loadedArchive = row;
    st.autoText = payload.auto_message || row.final_message || '';
    reportArchiveSetDirty(false);
    const info = document.getElementById('report-archive-option-warning');
    if (info) info.textContent = '\uC800\uC7A5\uBCF8\uC744 \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4. \uC774 \uC0C1\uD0DC\uC5D0\uC11C \uCD9C\uB825\uD558\uBA74 \uC800\uC7A5\uB41C \uBB38\uAD6C \uAE30\uC900\uC785\uB2C8\uB2E4.';
}

async function reportArchiveSave(studentId, targetType, sourceType, mode = 'upsert') {
    const inputs = reportArchiveGetInputs();
    const finalMessage = inputs.textarea?.value || '';
    if (!reportArchiveText(finalMessage)) {
        toast('\uC800\uC7A5\uD560 \uB9AC\uD3EC\uD2B8 \uBB38\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn');
        return null;
    }
    const student = typeof apmsGetStudentById === 'function' ? apmsGetStudentById(studentId) : (state.db.students || []).find(s => String(s.id) === String(studentId));
    const rangeStart = inputs.start?.value || '';
    const rangeEnd = inputs.end?.value || '';
    const title = reportArchiveText(inputs.title?.value) || reportArchiveDefaultTitle(student?.name, rangeStart, rangeEnd);
    const payload = reportArchiveBuildSnapshot(studentId, targetType, sourceType, reportArchiveState().autoText || finalMessage, finalMessage, { rangeStart, rangeEnd });
    const body = {
        studentId,
        report_type: AP_REPORT_ARCHIVE_REPORT_TYPE,
        title,
        range_start: rangeStart,
        range_end: rangeEnd,
        period_label: reportArchivePeriodLabel(rangeStart, rangeEnd),
        payload_json: payload,
        final_message: finalMessage
    };
    const st = reportArchiveState();
    const usePatch = (mode === 'update' && st.currentArchiveId) || (mode === 'upsert' && st.currentArchiveId);
    const r = usePatch
        ? await api.patch(`student-report-archives/${encodeURIComponent(st.currentArchiveId)}`, body)
        : await api.post('student-report-archives', body);
    if (r?.success) {
        st.currentArchiveId = r.id || r.data?.id || st.currentArchiveId;
        st.loadedArchive = r.data || st.loadedArchive;
        reportArchiveSetDirty(false);
        await reportArchiveLoadList(studentId);
        toast(mode === 'copy' ? '\uB2E4\uB978 \uC774\uB984\uC73C\uB85C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.' : '\uB9AC\uD3EC\uD2B8\uB97C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.', 'success');
        return st.currentArchiveId;
    }
    toast('\uB9AC\uD3EC\uD2B8 \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    return null;
}

function reportArchiveSaveAs(studentId, targetType, sourceType) {
    const inputs = reportArchiveGetInputs();
    if (inputs.title && !/\(\uBCF5\uC0AC\)$/.test(inputs.title.value)) inputs.title.value = `${inputs.title.value || '\uB9AC\uD3EC\uD2B8'} (\uBCF5\uC0AC)`;
    return reportArchiveSave(studentId, targetType, sourceType, 'copy');
}

function reportArchivePrintCurrent(studentId) {
    const inputs = reportArchiveGetInputs();
    const title = inputs.title?.value || 'AP MATH Report';
    const text = inputs.textarea?.value || reportArchiveState().loadedArchive?.final_message || '';
    if (!reportArchiveText(text)) {
        toast('\uCD9C\uB825\uD560 \uB9AC\uD3EC\uD2B8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn');
        return;
    }
    const printId = 'report-archive-print-text';
    let hidden = document.getElementById(printId);
    if (!hidden) {
        hidden = document.createElement('textarea');
        hidden.id = printId;
        hidden.style.display = 'none';
        document.body.appendChild(hidden);
    }
    hidden.value = text;
    reportCenterPrintText(printId, title);
}

async function reportArchiveSaveConsultationAndLink(studentId, targetType, sourceType, textareaId) {
    const inputs = reportArchiveGetInputs();
    const text = inputs.textarea?.value ?? document.getElementById(textareaId)?.value ?? '';
    if (!reportArchiveText(text)) {
        toast('\uC0C1\uB2F4\uAE30\uB85D\uC5D0 \uC800\uC7A5\uD560 \uBB38\uAD6C\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.', 'warn');
        return;
    }
    const archiveId = await reportArchiveSave(studentId, targetType, sourceType, 'upsert');
    if (!archiveId) return;
    const date = reportArchiveToday();
    const student = typeof apmsGetStudentById === 'function' ? apmsGetStudentById(studentId) : (state.db.students || []).find(s => String(s.id) === String(studentId));
    const title = reportArchiveText(inputs.title?.value) || reportArchiveDefaultTitle(student?.name, inputs.start?.value || '', inputs.end?.value || '');
    const period = reportArchivePeriodLabel(inputs.start?.value || '', inputs.end?.value || '');
    const content = [
        '[\uB9AC\uD3EC\uD2B8 \uC0C1\uB2F4\uAE30\uB85D]',
        `\uB9AC\uD3EC\uD2B8: ${title || '-'}`,
        `\uAE30\uAC04: ${period || '-'}`,
        `report_archive_id: ${archiveId || '-'}`,
        '',
        text
    ].join('\n');
    try {
        const r = await api.post('consultations', {
            studentId,
            date,
            type: '\uD559\uC2B5',
            content,
            nextAction: '\uB9AC\uD3EC\uD2B8 \uBC1C\uC1A1 \uD6C4 \uB2E4\uC74C \uC0C1\uB2F4 \uD750\uB984 \uD655\uC778'
        });
        if (r?.success) {
            if (archiveId) {
                await api.patch(`student-report-archives/${encodeURIComponent(archiveId)}`, {
                    consultation_id: r.id || '',
                    consultation_saved_at: new Date().toISOString()
                });
            }
            await reportArchiveLoadList(studentId);
            await loadData();
            toast('\uC0C1\uB2F4\uAE30\uB85D\uC5D0\uB3C4 \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.', 'success');
            return;
        }
        toast('\uC0C1\uB2F4\uAE30\uB85D \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    } catch (e) {
        toast('\uC0C1\uB2F4\uAE30\uB85D \uC800\uC7A5\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4.', 'warn');
    }
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

async function saveReportToConsultation(studentId, targetType, sourceType, textareaId, archiveId = '') {
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
            if (archiveId) {
                try {
                    await api.patch(`student-report-archives/${encodeURIComponent(archiveId)}`, {
                        consultation_id: r.id || '',
                        consultation_saved_at: new Date().toISOString()
                    });
                    if (typeof reportArchiveLoadList === 'function') await reportArchiveLoadList(studentId);
                } catch (linkErr) {
                    console.warn('[saveReportToConsultation] archive link failed:', linkErr);
                }
            }
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
        if (r.status === 401) {
            if (typeof handleUnauthorizedResponse === 'function') handleUnauthorizedResponse();
            return;
        }
        if (r.status === 403) {
            toast('권한이 없습니다. 계정 권한을 확인해 주세요.', 'warn');
            closeModal();
            return;
        }
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
        const polishedMessage = reportCenterHumanizeKoreanText(data.message || '', {
            tone: type === 'student' ? 'warm_encourage' : type === 'counsel' ? 'analytic' : 'calm_parent',
            blockKey: type === 'counsel' ? 'teacherOpinion' : 'kakaoSummary',
            source: 'ai'
        });
        const safeMessage = escapeHtmlForTextarea(polishedMessage);

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

function reportCenterNormalizeSentenceForCompare(value) {
    return String(value || '')
        .normalize('NFKC')
        .toLowerCase()
        .replace(/[“”"'‘’「」『』()[\]{}<>·ㆍ,，.。!?！？:：;；/\\|~`…—–_-]/g, '')
        .replace(/(은|는|이|가|을|를|와|과|도|만|에서|으로|로|의|에|에게|께|부터|까지|처럼|보다|마다|이나|나|이며|이고|하고|하며)(?=\s|$)/g, '')
        .replace(/\s+/g, '')
        .replace(/(은|는|이|가|을|를|와|과|도|만|에서|으로|로|의|에|에게|께|부터|까지|처럼|보다|마다|이나|나|이며|이고|하고|하며|합니다|했습니다|됩니다|입니다|겠습니다)+$/g, '');
}

function reportCenterIsDuplicateText(a, b) {
    const left = reportCenterNormalizeSentenceForCompare(a);
    const right = reportCenterNormalizeSentenceForCompare(b);
    if (!left || !right) return false;
    return left === right || (Math.min(left.length, right.length) >= 18 && (left.includes(right) || right.includes(left)));
}

function reportCenterPickNonDuplicateText(primary, fallback, previousTexts = []) {
    const candidates = [primary, fallback].map(value => String(value || '').trim()).filter(Boolean);
    const previous = (Array.isArray(previousTexts) ? previousTexts : [previousTexts]).filter(Boolean);
    return candidates.find(candidate => !previous.some(text => reportCenterIsDuplicateText(candidate, text))) || '';
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

function reportCenterGetBlueprintSource(session, questionNo) {
    const bp = reportCenterFindBlueprint(session, questionNo);
    const sourceArchiveFile = String(bp?.source_archive_file || '').trim();
    const sourceQuestionNo = Number(bp?.source_question_no || 0);
    if (!sourceArchiveFile || !sourceQuestionNo) return null;
    return { blueprint: bp, sourceArchiveFile, sourceQuestionNo };
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

function normalizeReportGrade(value) {
    const raw = String(value || '').trim();
    if (!raw) return '';
    const compact = raw.replace(/\s+/g, '');
    const middle = compact.match(/^(?:중|중등|중학교)?([123])(?:학년)?$/);
    if (middle) return `중${middle[1]}`;
    const high = compact.match(/^(?:고|고등|고등학교)([123])(?:학년)?$/);
    if (high) return `고${high[1]}`;
    return compact;
}

function reportCenterGetSessionGrade(session) {
    const student = (state.db.students || []).find(s => String(s.id) === String(session?.student_id));
    const studentGrade = normalizeReportGrade(student?.grade);
    if (studentGrade) return studentGrade;
    const classInfo = reportCenterGetStudentClass(session?.student_id);
    return normalizeReportGrade(classInfo.cls?.grade);
}

function reportCenterGetExamIdentity(session) {
    if (!session) return null;
    const archiveFile = String(session.archive_file || '').trim();
    const examTitle = String(session.exam_title || '').trim();
    const examDate = String(session.exam_date || '').trim();
    const questionCount = Number(session.question_count || 0);
    if (archiveFile) return { scope: 'grade_archive_exam', archiveFile };
    if (examTitle && examDate && questionCount) return { scope: 'grade_title_date_question_count', examTitle, examDate, questionCount };
    if (examTitle && examDate) return { scope: 'grade_title_date', examTitle, examDate };
    return null;
}

function isSameReportExam(baseSession, candidateSession) {
    const identity = reportCenterGetExamIdentity(baseSession);
    if (!identity || !candidateSession) return false;
    if (identity.scope === 'grade_archive_exam') {
        return String(candidateSession.archive_file || '').trim() === identity.archiveFile;
    }
    if (String(candidateSession.exam_title || '').trim() !== identity.examTitle) return false;
    if (String(candidateSession.exam_date || '').trim() !== identity.examDate) return false;
    if (identity.scope === 'grade_title_date_question_count') {
        return Number(candidateSession.question_count || 0) === identity.questionCount;
    }
    return true;
}

function isValidReportScore(session) {
    return Number.isFinite(Number(session?.score));
}

function buildGradeArchiveExamCohort(session) {
    if (!session) return [];
    const grade = reportCenterGetSessionGrade(session);
    const cohort = (state.db.exam_sessions || []).filter(e => {
        if (!isSameReportExam(session, e) || !isValidReportScore(e)) return false;
        return !grade || reportCenterGetSessionGrade(e) === grade;
    });
    return cohort.length ? cohort : (state.db.exam_sessions || []).filter(e => isSameReportExam(session, e) && isValidReportScore(e));
}

function reportCenterGetSameExamSessions(session) {
    return buildGradeArchiveExamCohort(session);
}

function reportCenterGetClassExamSessions(session, classId) {
    const same = reportCenterGetSameExamSessions(session);
    if (!classId) return same;
    const classStudentIds = new Set((state.db.class_students || [])
        .filter(m => String(m.class_id) === String(classId))
        .map(m => String(m.student_id)));
    if (!classStudentIds.size) return [];
    return same.filter(e => classStudentIds.has(String(e.student_id)));
}

function reportCenterGetWrongSetBySession(sessionId) {
    return new Set(reportCenterGetWrongIds(sessionId).map(v => String(v)));
}

function calculateReportAverage(list) {
    const nums = (list || []).map(e => Number(e.score)).filter(v => Number.isFinite(v));
    return nums.length ? Math.round(nums.reduce((a, b) => a + b, 0) / nums.length) : null;
}

function calculateReportRank(session, list) {
    const score = Number(session?.score);
    if (!Number.isFinite(score)) return null;
    const scores = (list || []).map(e => Number(e.score)).filter(v => Number.isFinite(v));
    return scores.length ? scores.filter(v => v > score).length + 1 : null;
}

function buildReportCohortSummary(session, fallbackSessions = []) {
    const serverSummary = (state.db.report_exam_cohort_stats || [])
        .find(row => String(row.session_id) === String(session?.id));
    if (serverSummary) {
        return {
            cohortScope: serverSummary.cohortScope || 'grade_archive_exam',
            gradeExamAverage: Number.isFinite(Number(serverSummary.gradeExamAverage)) ? Number(serverSummary.gradeExamAverage) : null,
            gradeExamRank: Number.isFinite(Number(serverSummary.gradeExamRank)) ? Number(serverSummary.gradeExamRank) : null,
            gradeExamCount: Number(serverSummary.gradeExamCount || serverSummary.totalSubmitted || 0),
            questionStats: Array.isArray(serverSummary.questionStats) ? serverSummary.questionStats : []
        };
    }
    return {
        cohortScope: reportCenterGetExamIdentity(session)?.scope || 'class_fallback',
        gradeExamAverage: calculateReportAverage(fallbackSessions),
        gradeExamRank: calculateReportRank(session, fallbackSessions),
        gradeExamCount: (fallbackSessions || []).length,
        questionStats: []
    };
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
    const cohortSummary = buildReportCohortSummary(session, allSessions);
    const serverQuestionStats = new Map((cohortSummary.questionStats || [])
        .map(row => [String(row.questionNo), row]));
    const studentWrongSet = reportCenterGetWrongSetBySession(session.id);
    const qCount = Number(session.question_count || 0);
    const maxQuestionNo = qCount || Math.max(
        0,
        ...reportCenterGetWrongIds(session.id).map(v => Number(v) || 0),
        ...(cohortSummary.questionStats || []).map(row => Number(row.questionNo) || 0),
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
        const serverQuestion = serverQuestionStats.get(q);
        const localWrongCount = allWrongRows.filter(w => String(w.question_id) === q).length;
        const wrongCount = serverQuestion ? Number(serverQuestion.wrongCount || 0) : localWrongCount;
        const classWrongCount = classWrongRows.filter(w => String(w.question_id) === q).length;
        const correctRate = serverQuestion && Number.isFinite(Number(serverQuestion.correctRate))
            ? Number(serverQuestion.correctRate)
            : (allSessions.length ? Math.round(((allSessions.length - wrongCount) / allSessions.length) * 100) : null);
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

    return {
        totalSessions: cohortSummary.gradeExamCount || allSessions.length,
        classSessions: classSessions.length,
        rows,
        wrongRows: rows.filter(r => r.isStudentWrong),
        bucket,
        overallAvg: cohortSummary.gradeExamAverage,
        classAvg: calculateReportAverage(classSessions),
        gradeExamAverage: cohortSummary.gradeExamAverage,
        gradeExamRank: cohortSummary.gradeExamRank,
        gradeExamCount: cohortSummary.gradeExamCount || allSessions.length,
        cohortScope: cohortSummary.cohortScope,
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

function reportCenterArchiveBankCache() {
    window.AP_REPORT_ARCHIVE_BANK_CACHE = window.AP_REPORT_ARCHIVE_BANK_CACHE || {};
    return window.AP_REPORT_ARCHIVE_BANK_CACHE;
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

function reportCenterClampText(value, limit = 220) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    const max = Number(limit);
    if (!Number.isFinite(max) || max <= 0) return text;
    return text.length > max ? `${text.slice(0, Math.max(1, max - 1)).trim()}…` : text;
}

function reportCenterEnsureParentOpening(value) {
    const text = String(value || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    if (/^어머님[,，]?\s*안녕하세요[.!?。！？]?/.test(text)) return text;
    if (/^안녕하세요[,.]?\s*/.test(text)) return text.replace(/^안녕하세요[,.]?\s*/, '어머님, 안녕하세요. ');
    return `어머님, 안녕하세요. ${text}`;
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

async function reportCenterFetchArchiveBankByFile(rawArchiveFile) {
    const archiveInfo = reportCenterNormalizeArchiveFile(rawArchiveFile || '');
    if (!archiveInfo.ok) {
        return {
            ok: false,
            archiveInfo,
            list: [],
            message: archiveInfo.message || '아카이브 파일을 확인할 수 없습니다.'
        };
    }

    const cacheKey = archiveInfo.url || archiveInfo.path || archiveInfo.original;
    const cached = reportCenterArchiveBankCache()[cacheKey];
    if (cached) return cached;

    try {
        const res = await fetch(archiveInfo.url, { cache: 'force-cache' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const jsText = await res.text();
        const bank = reportCenterExtractQuestionBankFromText(jsText);
        const list = reportCenterNormalizeQuestionBank(bank);
        if (!list.length) throw new Error('questionBank empty');

        const payload = {
            ok: true,
            archiveInfo,
            list,
            totalQuestions: list.length,
            message: '아카이브 문항 원문을 불러왔습니다.'
        };
        reportCenterArchiveBankCache()[cacheKey] = payload;
        return payload;
    } catch (e) {
        const message = String(e?.message || '');
        const isNotFound = message.includes('HTTP 404');
        if (isNotFound) {
            console.info('[reportCenterFetchArchiveBankByFile] archive file not found:', archiveInfo.original || archiveInfo.path || archiveInfo.url);
        } else {
            console.warn('[reportCenterFetchArchiveBankByFile] failed:', e);
        }
        const payload = {
            ok: false,
            archiveInfo,
            list: [],
            message: isNotFound ? '문항 원문 파일을 찾을 수 없습니다.' : '문항 원문 로드 중 오류가 발생했습니다.'
        };
        reportCenterArchiveBankCache()[cacheKey] = payload;
        return payload;
    }
}

async function reportCenterBuildMixedArchiveQuestionDetails(session, wrongRows, archiveInfo) {
    let mappedCount = 0;
    let loadedCount = 0;

    const details = await Promise.all((wrongRows || []).map(async row => {
        const source = reportCenterGetBlueprintSource(session, row.questionNo);
        if (!source) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        mappedCount += 1;
        const sourcePayload = await reportCenterFetchArchiveBankByFile(source.sourceArchiveFile);
        if (!sourcePayload.ok) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        const question = reportCenterFindQuestionInBank(sourcePayload.list, source.sourceQuestionNo);
        if (!question) {
            return reportCenterNormalizeQuestionDetail(null, row.questionNo, row);
        }

        loadedCount += 1;
        return reportCenterNormalizeQuestionDetail(question, row.questionNo, row);
    }));

    return {
        ok: loadedCount > 0,
        status: loadedCount > 0 ? 'mixed-loaded' : 'mixed',
        archiveInfo,
        message: loadedCount > 0
            ? '믹서 출제물 원본 문항을 매핑을 통해 불러왔습니다.'
            : archiveInfo.message,
        details,
        mappedCount,
        loadedCount
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

    if (archiveInfo.type === 'mixed') {
        const payload = await reportCenterBuildMixedArchiveQuestionDetails(session, wrongRows, archiveInfo);
        return reportCenterSetCachedArchiveDetails(session.id, payload);
    }

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
        const sourcePayload = await reportCenterFetchArchiveBankByFile(session.archive_file || '');
        if (!sourcePayload.ok) throw new Error(sourcePayload.message || 'archive load failed');
        const list = sourcePayload.list;
        const details = wrongRows.map(row => {
            const q = reportCenterFindQuestionInBank(list, row.questionNo);
            return reportCenterNormalizeQuestionDetail(q, row.questionNo, row);
        });

        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: true,
            status: 'loaded',
            archiveInfo: sourcePayload.archiveInfo || archiveInfo,
            message: sourcePayload.message || '아카이브 문항 원문을 불러왔습니다.',
            totalQuestions: list.length,
            details
        });
    } catch (e) {
        const message = String(e?.message || '');
        const isNotFound = message.includes('HTTP 404');
        if (isNotFound) {
            console.info('[reportCenterFetchArchiveQuestionDetails] archive file not found; fallback to stats-only analysis.');
        } else {
            console.warn('[reportCenterFetchArchiveQuestionDetails] failed:', e);
        }
        return reportCenterSetCachedArchiveDetails(session.id, {
            ok: false,
            status: isNotFound ? 'not-found' : 'fetch-failed',
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
    const baseDiagnosisLines = reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo);
    const meaningLines = reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, null);
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 3);
    const recentAvg = getRecentAverage(data.student.id, 3);

    const nextActions = [];
    if (wrongRows.length) {
        const wrongNums = priorityRows.map(r => `${r.questionNo}번`).join(', ');
        if (wrongNums) nextActions.push(`${wrongNums}을 다시 풀어보고, 비슷한 문제까지 잡겠습니다.`);
        nextActions.push('다음 시간에 틀린 문제를 다시 풀고, 비슷한 문제로 한 번 더 연습하겠습니다.');
    } else {
        nextActions.push('맞힌 유형은 그대로 가고, 조금 더 어려운 문제로 올려보겠습니다.');
    }
    nextActions.push('필요하면 비슷한 문제를 더 풀어보겠습니다.');

    const studentName = data.student.name || '학생';
    const parentMessage = reportCenterBuildEasyParentMessage(data);

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
            gradeExamAverage: stats.gradeExamAverage,
            gradeExamRank: stats.gradeExamRank,
            gradeExamCount: stats.gradeExamCount,
            cohortScope: stats.cohortScope,
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
    const trendData = reportCenterGetExamTrendData(studentId, { limit: 5 });
    return {
        reportType: 'exam_revision',
        revisionMode: true,
        instruction: '기존 기본 리포트를 처음부터 갈아엎지 말고, 중복을 줄이고 문장을 더 자연스럽고 신뢰감 있게 다듬어라. 최근 여러 시험의 점수 흐름을 먼저 해석하고, 최종 평가의 문항 분석은 마지막에 연결하라.',
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
            gradeExamAverage: stats.gradeExamAverage,
            gradeExamRank: stats.gradeExamRank,
            gradeExamCount: stats.gradeExamCount,
            cohortScope: stats.cohortScope,
            className: stats.className
        },
        questionAnalysis: stats.rows,
        wrongAnalysis: stats.wrongRows,
        selectedSessions: trendData.selectedSessions,
        examTrend: trendData.trend,
        weaknessTrend: trendData.weaknessTrend,
        finalSession: trendData.finalSession,
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
    return reportCenterBuildEasyKakaoSummary(studentId, sessionId);
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
    const sessions = reportCenterGetSortedStudentExamSessions(studentId);
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
    const printMemo = document.getElementById('report-print-teacher-memo');
    if (printMemo) return String(printMemo.value || '').trim();
    return String(document.getElementById('report-center-exam-teacher-memo')?.value || window.AP_REPORT_PENDING_TEACHER_MEMO || '').trim();
}


function reportCenterAiAnalysisCache() {
    window.AP_REPORT_AI_ANALYSIS_CACHE = window.AP_REPORT_AI_ANALYSIS_CACHE || {};
    return window.AP_REPORT_AI_ANALYSIS_CACHE;
}

function reportCenterAiAnalysisStorageKey(sessionId) {
    return `AP_REPORT_AI_ANALYSIS_CACHE_${String(sessionId || '')}`;
}

function reportCenterIsPremiumAiSource(source) {
    const safe = String(source || '').toLowerCase();
    return safe === 'ai' || safe === 'gemini';
}

function reportCenterGetCachedAiAnalysis(sessionId) {
    const key = String(sessionId || '');
    if (!key) return null;

    const memory = reportCenterAiAnalysisCache()[key] || null;
    if (memory && reportCenterIsPremiumAiSource(memory.source)) return memory;

    try {
        const raw = localStorage.getItem(reportCenterAiAnalysisStorageKey(key));
        if (!raw) return null;
        const saved = reportCenterNormalizeAiAnalysis(JSON.parse(raw));
        if (!reportCenterIsPremiumAiSource(saved.source)) return null;
        reportCenterAiAnalysisCache()[key] = saved;
        return saved;
    } catch (e) {
        try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (removeErr) {}
        return null;
    }
}

function reportCenterSetCachedAiAnalysis(sessionId, payload) {
    if (!sessionId || !payload) return payload;
    const key = String(sessionId);
    const normalized = reportCenterNormalizeAiAnalysis(payload);
    if (!reportCenterIsPremiumAiSource(normalized.source)) {
        delete reportCenterAiAnalysisCache()[key];
        try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (e) {}
        return normalized;
    }
    reportCenterAiAnalysisCache()[key] = normalized;
    try { localStorage.setItem(reportCenterAiAnalysisStorageKey(key), JSON.stringify(normalized)); } catch (e) {}
    return normalized;
}

function reportCenterClearCachedAiAnalysis(sessionId) {
    if (!sessionId) return;
    const key = String(sessionId);
    delete reportCenterAiAnalysisCache()[key];
    try { localStorage.removeItem(reportCenterAiAnalysisStorageKey(key)); } catch (e) {}
}

function reportCenterResetExamAiAnalysis(studentId, sessionId = '') {
    reportCenterClearCachedAiAnalysis(sessionId);
    reportCenterRefreshPremiumExamPreview(studentId, sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
}

function reportCenterNormalizeAiAnalysis(raw = {}) {
    const safeString = (value) => String(value || '').trim();
    const safeHumanString = (value, blockKey = '') => reportCenterHumanizeKoreanText(safeString(value), {
        ...reportCenterDefaultTextOptions(),
        blockKey,
        source: 'ai'
    });
    const safeArray = (value, blockKey = '') => Array.isArray(value)
        ? value.map(v => safeHumanString(v, blockKey)).filter(Boolean).slice(0, 8)
        : [];
    const risk = safeString(raw.riskLevel || 'stable');
    return {
        summary: safeHumanString(raw.summary, 'summary'),
        diagnosis: safeHumanString(raw.diagnosis, 'teacherOpinion'),
        wrongAnalysis: safeHumanString(raw.wrongAnalysis, 'weakness'),
        nextPlan: safeHumanString(raw.nextPlan, 'plan'),
        parentMessage: safeHumanString(raw.parentMessage, 'parentMessage'),
        kakaoSummary: safeHumanString(raw.kakaoSummary, 'kakaoSummary'),
        teacherMemo: safeString(raw.teacherMemo),
        riskLevel: ['stable', 'watch', 'focus'].includes(risk) ? risk : 'stable',
        mainWeaknesses: safeArray(raw.mainWeaknesses, 'weakness'),
        nextActions: safeArray(raw.nextActions, 'plan'),
        trendSummary: safeHumanString(raw.trendSummary, 'trend'),
        trendDiagnosis: safeHumanString(raw.trendDiagnosis, 'teacherOpinion'),
        finalExamComment: safeHumanString(raw.finalExamComment, 'summary'),
        recurringWeaknesses: safeArray(raw.recurringWeaknesses, 'weakness'),
        longitudinalPlan: safeArray(raw.longitudinalPlan, 'plan'),
        source: safeString(raw.source || raw._source || ''),
        generatedAt: safeString(raw.generatedAt || new Date().toISOString())
    };
}

function reportCenterGetAiAnalysisForReport(sessionId, options = {}) {
    const candidate = options.aiAnalysis ? reportCenterNormalizeAiAnalysis(options.aiAnalysis) : reportCenterGetCachedAiAnalysis(sessionId);
    if (!candidate) return null;
    return reportCenterIsPremiumAiSource(candidate.source) ? candidate : null;
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
            note: '이번 시험은 다 맞았습니다. 아래에는 전체 기준에서 어려웠던 문제를 중심으로 정리했습니다.'
        };
    }
    if (wrongRows.length > 5) {
        return {
            mode: 'priority',
            title: '먼저 볼 문제 분석표',
            note: `이번 리포트에서는 먼저 볼 문제 5개를 중심으로 정리했습니다. 그 외 ${wrongRows.length - 5}개 문제는 클리닉 시간에 차례로 확인하겠습니다.`
        };
    }
    return {
        mode: 'wrong',
        title: '틀린 문제 분석표',
        note: '문제별 정답률과 단원 정보를 함께 정리했습니다. 다음 시간에 틀린 문제를 다시 풀어보겠습니다.'
    };
}

function reportCenterBuildCoreSummaryHtml(data, correctRate, wrongCount, aiAnalysis = null) {
    const stats = data.stats;
    const wrongRows = stats?.wrongRows || [];
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const units = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const score = data.session?.score ?? '-';
    const studentName = data.student?.name || '학생';

    const fallbackAchievement = wrongRows.length
        ? `${studentName} 학생은 이번 시험에서 ${score}점을 받았습니다. 틀린 문제는 다음 시간에 다시 풀어보겠습니다.`
        : '이번 시험은 다 맞았습니다. 다음 시간에는 조금 더 어려운 문제로 올려보겠습니다.';

    const fallbackFocus = wrongRows.length
        ? (reportCenterEasyWrongNums(data, 3) ? `${reportCenterEasyWrongNums(data, 3)} 먼저 다시 풀고, 비슷한 문제로 한 번 더 보겠습니다.` : '틀린 문제는 다음 시간에 다시 풀어보겠습니다.')
        : (excellentRows.length ? `${excellentRows.map(r => `${r.questionNo}번`).join(', ')}처럼 어려웠던 문제도 잘 풀었습니다.` : '');

    const fallbackPlan = wrongRows.length
        ? '다음 시간에 틀린 문제를 다시 풀고, 비슷한 문제로 한 번 더 연습하겠습니다.'
        : '맞힌 유형은 그대로 가고, 조금 더 어려운 문제로 올려보겠습니다.';

    const achievement = reportCenterTrimText(aiAnalysis?.summary || fallbackAchievement, 260);
    const focus = reportCenterTrimText(aiAnalysis?.wrongAnalysis || fallbackFocus, 190);
    const plan = reportCenterTrimText(aiAnalysis?.nextPlan || fallbackPlan, 190);

    return `
        <section class="aprc-core-summary">
            <div class="aprc-core-item"><b>성취</b><span>${reportCenterEscape(achievement)}</span></div>
            <div class="aprc-core-item"><b>다시 볼 부분</b><span>${reportCenterEscape(reportCenterApplyEasyFinalLanguage(focus))}</span></div>
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
            return `<tr><td colspan="6" class="aprc-empty-cell">이번 시험은 다 맞았습니다.</td></tr>`;
        }
        return excellentRows.map(row => {
            const insight = `전체 정답률이 낮았던 문제도 잘 풀었습니다. 다음 시간에는 조금 더 어려운 문제로 올려보겠습니다.`;
            return `
                <tr>
                    <td class="aprc-qno">${reportCenterEscape(row.questionNo)}번</td>
                    <td>${reportCenterEscape(row.unit || row.unitKey || '-')}</td>
                    <td>${reportCenterEscape(row.difficulty || '-')}</td>
                    <td>${reportCenterSafePercent(row.correctRate)}</td>
                    <td>${reportCenterSafePercent(row.classCorrectRate)}</td>
                    <td>${reportCenterEscape(reportCenterApplyEasyFinalLanguage(insight))}</td>
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
                <td>${reportCenterEscape(reportCenterApplyEasyFinalLanguage(row.meaning || '-'))}</td>
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

function reportCenterEasyWrongNums(data, limit = 5) {
    return reportCenterShortQuestionList(reportCenterSelectPriorityWrongRows(data?.stats?.wrongRows || [], limit), limit);
}

function reportCenterEasyScoreDeltaText(delta) {
    const scoreDelta = Number(delta);
    if (!Number.isFinite(scoreDelta)) return '';
    if (scoreDelta > 0) return `첫 시험보다 ${Math.abs(scoreDelta)}점 올랐습니다.`;
    if (scoreDelta < 0) return `첫 시험보다 ${Math.abs(scoreDelta)}점 낮아졌습니다.`;
    return '첫 시험과 같은 점수입니다.';
}

function reportCenterBuildEasySummaryText(data, wrongCount, correctRate = null) {
    const studentName = data?.student?.name || '학생';
    const score = data?.session?.score;
    const stats = data?.stats || {};
    if (!Number(wrongCount || 0)) {
        return '이번 시험은 다 맞았습니다. 다음부터는 조금 더 어려운 문제로 올려보겠습니다.';
    }
    const hasClassAvg = stats.classAvg !== null && stats.classAvg !== undefined && stats.classAvg !== '';
    const classAvg = Number(stats.classAvg);
    const rawScore = Number(score);
    if (Number.isFinite(rawScore) && hasClassAvg && Number.isFinite(classAvg)) {
        const diff = Math.abs(rawScore - classAvg);
        const label = rawScore >= classAvg ? '높습니다' : '낮습니다';
        return `이번 시험은 반 평균보다 ${diff}점 ${label}. 틀린 ${wrongCount}문제는 다음 시간에 다시 잡겠습니다.`;
    }
    if (correctRate !== null && correctRate !== undefined) {
        return `이번 시험 정답률은 ${correctRate}%입니다. 틀린 문제는 다음 시간에 다시 보겠습니다.`;
    }
    return `이번 시험은 ${wrongCount}문제 틀렸습니다. 틀린 문제는 다음 시간에 다시 풀어보겠습니다.`;
}

function reportCenterBuildEasyTrendText(trendData) {
    const selected = trendData?.selectedSessions || [];
    const trend = trendData?.trend || {};
    if (!selected.length) return '';
    if (selected.length === 1) return '이번이 첫 시험입니다. 다음 시험부터 점수 변화를 같이 보여드리겠습니다.';
    const direction = trend.direction === 'up'
        ? '올라가는'
        : trend.direction === 'down'
            ? '내려가는'
            : '';
    const trendSentence = direction
        ? `최근 ${selected.length}번 시험은 ${direction} 중입니다. 가장 높은 점수 ${trend.bestScore}점, 낮은 점수 ${trend.worstScore}점입니다.`
        : `최근 ${selected.length}번 시험은 점수가 크게 달라지지 않았습니다. 가장 높은 점수 ${trend.bestScore}점, 낮은 점수 ${trend.worstScore}점입니다.`;
    const deltaSentence = reportCenterEasyScoreDeltaText(trend.scoreDelta);
    return `${trendSentence}${deltaSentence ? ` ${deltaSentence}` : ''}`;
}

function reportCenterBuildEasyWeaknessText(trendData, data) {
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) return '';
    const recurring = (trendData?.weaknessTrend || []).filter(item => item.appearedInSessions > 1 && !item.resolved);
    const priorityText = reportCenterEasyWrongNums(data, 3);
    if (recurring.length) return '여러 번 틀린 문제부터 다시 풀어보겠습니다.';
    if (priorityText) return `${priorityText} 먼저 다시 풀고, 비슷한 문제로 한 번 더 보겠습니다.`;
    return '다음 시간에 틀린 문제를 한 번 더 짚고 넘어가겠습니다.';
}

function reportCenterBuildEasyPlanItems(data, trendData = null) {
    const wrongRows = data?.stats?.wrongRows || [];
    const wrongNums = reportCenterEasyWrongNums(data, 5);
    if (!wrongRows.length) {
        return ['맞힌 유형은 그대로 가고, 조금 더 어려운 문제로 올려보겠습니다.'];
    }
    if (wrongNums) return [`${wrongNums}을 다시 풀어보고, 비슷한 문제까지 잡겠습니다.`];
    return ['다음 시간에 틀린 문제를 다시 풀고, 비슷한 문제로 한 번 더 연습하겠습니다.'];
}

function reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo = '') {
    const stats = data?.stats || {};
    const wrongRows = stats.wrongRows || [];
    const lines = [];
    if (!wrongRows.length) {
        const excellentNums = reportCenterShortQuestionList(reportCenterSelectExcellentRows(stats, 3), 3);
        lines.push(excellentNums
            ? `이번 시험은 다 맞았습니다. 특히 ${excellentNums}처럼 어려웠던 문제도 잘 풀었습니다.`
            : '이번 시험은 다 맞았습니다. 다음 시간에는 조금 더 어려운 문제로 올려보겠습니다.');
    } else {
        const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
        lines.push('이번에 틀린 문제를 기준으로, 다음 시간에 다시 풀어보겠습니다.');
        if (hardWrongs.length) lines.push('어려웠던 문제는 관련 개념을 다시 짚겠습니다.');
        lines.push('계속 틀리는 부분과 이번에 새로 틀린 부분을 나누어, 다음 시간에 보겠습니다.');
    }
    if (teacherMemo) lines.push(`선생님 메모는 다음 수업에 반영하겠습니다: ${teacherMemo}`);
    return lines;
}

function reportCenterBuildEasyParentMessage(data) {
    const studentName = data?.student?.name || '학생';
    const wrongRows = data?.stats?.wrongRows || [];
    if (!wrongRows.length) {
        return `${studentName} 학생은 이번 시험에서 다 맞았습니다.\n다음 시간에는 다음 단원과 조금 더 어려운 문제로 올려보겠습니다.\n가정에서는 지금처럼 봐주시면 됩니다.`;
    }
    return `안녕하세요, AP수학입니다.\n\n이번 리포트에는 점수와 함께 틀린 문제, 문제 난이도를 정리했습니다.\n다음 시간에 틀린 문제를 다시 풀고, 같은 실수가 나오지 않게 비슷한 문제로 한 번 더 연습하겠습니다.\n가정에서는 문제를 다 푼 뒤 한 번 더 검토하는 습관만 봐주시면 됩니다.`;
}

function reportCenterBuildEasyKakaoSummary(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const student = data.student;
    const session = data.session;
    if (!student || !session) return '';
    const wrongRows = data.stats?.wrongRows || [];
    const priorityText = reportCenterEasyWrongNums(data, 3);
    if (!wrongRows.length) {
        return `안녕하세요, AP수학입니다. ${student.name} 학생의 「${session.exam_title || '시험'}」 결과를 안내드립니다.\n이번 시험은 ${session.score}점으로, 다 맞았습니다.\n다음 시간에는 조금 더 어려운 문제로 올려보겠습니다. 자세한 내용은 PDF 리포트에 있습니다.`;
    }
    const target = priorityText
        ? `틀린 문제는 ${priorityText} 위주로 다음 시간에 다시 풀고, 비슷한 문제까지 잡겠습니다.`
        : '틀린 문제는 다음 시간에 다시 풀고, 비슷한 문제까지 잡겠습니다.';
    return `안녕하세요, AP수학입니다. ${student.name} 학생의 「${session.exam_title || '시험'}」 결과를 안내드립니다.\n이번 시험은 ${session.score}점입니다. 자세한 내용은 PDF 리포트에 정리했습니다.\n${target}`;
}

function reportCenterBuildShortReportSummaryItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const excellentRows = reportCenterSelectExcellentRows(stats, 3);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const rawAiSummary = reportCenterFirstSentence(aiAnalysis?.finalExamComment || aiAnalysis?.summary, 180);
    const rawAiWrong = reportCenterFirstSentence(aiAnalysis?.wrongAnalysis, 180);
    const rawAiPlan = reportCenterFirstSentence(aiAnalysis?.nextPlan, 180);
    const priorityText = reportCenterShortQuestionList(priorityRows, 5);

    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongRows.length) / qCount) * 100) : null;
    const position = reportCenterApplyEasyFinalLanguage(rawAiSummary || reportCenterBuildEasySummaryText(data, wrongRows.length, correctRate));
    const focus = reportCenterApplyEasyFinalLanguage(rawAiWrong || reportCenterBuildEasyWeaknessText(null, data));
    const plan = reportCenterApplyEasyFinalLanguage(rawAiPlan || reportCenterBuildEasyPlanItems(data).join(' '));

    return [
        { title: '현재 위치', text: reportCenterTrimText(position, 170) },
        { title: '우선 확인 문항', text: reportCenterTrimText(focus, 170) },
        { title: '다음 수업 방향', text: reportCenterTrimText(plan, 170) }
    ];
}

function reportCenterSoftenDiagnosisText(value) {
    let text = reportCenterStripHtml(value).replace(/\s+/g, ' ').trim();
    if (!text) return '';
    text = text
        .replace(/틀렸/g, '확인할 부분이 보였')
        .replace(/부족/g, '다시 봐야')
        .replace(/낮은/g, '관리할')
        .replace(/못한/g, '흔들린');
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(text), 950);
}

function reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo = '', aiAnalysis = null) {
    const aiDiagnosis = reportCenterSoftenDiagnosisText(aiAnalysis?.trendDiagnosis || aiAnalysis?.diagnosis);
    if (aiDiagnosis) {
        const paragraphs = String(aiDiagnosis)
            .split(/\n{2,}/)
            .map(v => v.trim())
            .filter(Boolean);
        if (paragraphs.length) return paragraphs.slice(0, 2).map(v => reportCenterTrimText(v, 520));

        const sentences = (aiDiagnosis.match(/[^.!?。！？]+[.!?。！？]?/g) || [aiDiagnosis])
            .map(s => s.trim())
            .filter(Boolean);
        if (sentences.length > 3) {
            const mid = Math.ceil(sentences.length / 2);
            return [
                reportCenterTrimText(sentences.slice(0, mid).join(' '), 520),
                reportCenterTrimText(sentences.slice(mid).join(' '), 520)
            ].filter(Boolean);
        }
        return [reportCenterTrimText(aiDiagnosis, 650)];
    }

    return reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo).map(line => reportCenterTrimText(line, 520));
}

function reportCenterBuildNextPlanItems(data, aiAnalysis = null) {
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const aiItems = Array.isArray(aiAnalysis?.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
        ? aiAnalysis.longitudinalPlan
        : (Array.isArray(aiAnalysis?.nextActions) ? aiAnalysis.nextActions : []);
    const splitAiPlan = aiAnalysis?.nextPlan
        ? (reportCenterStripHtml(aiAnalysis.nextPlan).match(/[^.!?。！？]+[.!?。！？]?/g) || []).map(s => s.trim()).filter(Boolean)
        : [];
    const items = [...aiItems, ...splitAiPlan]
        .map(item => reportCenterTrimText(item, 180))
        .filter(Boolean);

    if (items.length) return items.map(reportCenterApplyEasyFinalLanguage).slice(0, 4);
    return reportCenterBuildEasyPlanItems(data, null);
}


function reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, aiAnalysis = null) {
    const student = data?.student || {};
    const session = data?.session || {};
    const stats = data?.stats || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const score = session.score ?? '-';
    const studentName = student.name || '학생';
    const items = [];
    const scoreBits = [`${studentName} 학생은 이번 시험에서 ${score}점을 받았습니다.`];

    if (correctRate !== null && correctRate !== undefined) scoreBits.push(`정답률은 ${correctRate}%입니다.`);
    if (stats.overallAvg !== null && stats.overallAvg !== undefined) scoreBits.push(`전체 평균은 ${stats.overallAvg}점입니다.`);
    if (stats.classAvg !== null && stats.classAvg !== undefined) scoreBits.push(`${stats.className || '소속 반'} 평균은 ${stats.classAvg}점입니다.`);
    items.push(scoreBits.join(' '));

    if (!wrongRows.length) {
        const excellentRows = reportCenterSelectExcellentRows(stats, 3);
        if (excellentRows.length) {
            items.push(`${excellentRows.map(r => `${r.questionNo}번`).join(', ')}처럼 어려웠던 문제도 잘 풀었습니다.`);
        } else {
            items.push('이번 시험은 다 맞았습니다.');
        }
        items.push('다음 시간에는 조금 더 어려운 문제로 올려보겠습니다.');
        return items.map(reportCenterApplyEasyFinalLanguage);
    }

    const priorityRows = reportCenterSelectPriorityWrongRows(wrongRows, 5);
    const unitNames = Array.from(new Set(wrongRows.map(r => r.unit).filter(Boolean))).slice(0, 2);
    const personalWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate >= 85);
    const hardWrongs = wrongRows.filter(r => Number.isFinite(r.correctRate) && r.correctRate < 65);
    const priorityText = priorityRows.length ? priorityRows.map(r => `${r.questionNo}번`).join(', ') : '';

    if (wrongRows.length > 5) {
        items.push(`틀린 문제가 여러 개 있어 리포트에는 ${priorityText} 등 먼저 볼 문제 5개를 중심으로 정리했습니다.`);
    } else {
        items.push(priorityText ? `${priorityText} 먼저 다시 풀고, 비슷한 문제로 한 번 더 보겠습니다.` : '틀린 문제는 다음 시간에 다시 풀어보겠습니다.');
    }

    if (personalWrongs.length && hardWrongs.length) {
        items.push('맞출 수 있었던 문제와 어려웠던 문제를 나누어 다시 보겠습니다.');
    } else if (personalWrongs.length) {
        items.push('대부분 학생이 맞힌 문제는 푸는 과정을 다시 보겠습니다.');
    } else if (hardWrongs.length) {
        items.push('어려웠던 문제는 푸는 순서와 관련 개념을 다시 짚겠습니다.');
    } else if (unitNames.length) {
        items.push('관련 개념을 짧게 다시 보고 비슷한 문제로 연습하겠습니다.');
    } else {
        items.push('푸는 과정을 다시 보고 같은 유형에서 실수가 줄도록 보겠습니다.');
    }

    if (aiAnalysis?.summary) {
        items[0] = reportCenterTrimText(aiAnalysis.summary, 150);
    }

    return items.map(reportCenterApplyEasyFinalLanguage);
}

/**
 * Legacy premium preview renderer.
 * PDF 출력/인쇄 경로에서는 사용하지 않는다.
 * PDF 출력은 reportCenterBuildCleanPdfDocument()를 사용한다.
 */
function reportCenterBuildPremiumExamReportHtml(studentId, sessionId = '', options = {}) {
    return reportCenterBuildCleanPdfDocument(studentId, sessionId, options);
}

function reportCenterBuildCurrentPositionText(data, correctRate, wrongCount) {
    const student = data?.student || {};
    const session = data?.session || {};
    const stats = data?.stats || {};
    const studentName = student.name || '학생';
    const score = Number(session.score);
    const scoreText = Number.isFinite(score) ? `${score}점` : `${session.score ?? '-'}점`;
    const overallAvg = Number(stats.overallAvg);
    const classAvg = Number(stats.classAvg);
    const hasOverall = Number.isFinite(overallAvg);
    const hasClass = Number.isFinite(classAvg);
    const classLabel = stats.className || '소속 반';
    const correctRateText = correctRate !== null && correctRate !== undefined ? ` 정답률은 ${correctRate}%이며,` : '';
    const wrongText = Number(wrongCount || 0) > 0
        ? ` 틀린 ${wrongCount}문제는 다음 시간에 다시 풀어보겠습니다.`
        : ' 이번 시험은 다 맞았습니다.';

    if (Number.isFinite(score) && hasOverall && hasClass) {
        if (score >= overallAvg && score >= classAvg) {
            return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} 전체 평균과 ${classLabel} 평균보다 높습니다.${wrongText}`;
        }
        if (score >= overallAvg && score < classAvg) {
            return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} 전체 평균과는 비슷하거나 높지만, ${classLabel} 평균과 비교해 다시 볼 문제가 있습니다.${wrongText}`;
        }
        return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} 전체 평균과 ${classLabel} 평균을 기준으로 보면 다시 볼 문제가 있습니다.${wrongText}`;
    }

    if (Number.isFinite(score) && hasOverall) {
        if (score >= overallAvg) {
            return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} 전체 평균보다 높습니다.${wrongText}`;
        }
        return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} 전체 평균과 비교해 다시 볼 문제가 있습니다.${wrongText}`;
    }

    if (Number.isFinite(score) && hasClass) {
        if (score >= classAvg) {
            return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} ${classLabel} 평균보다 높습니다.${wrongText}`;
        }
        return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText} ${classLabel} 평균과 비교해 다시 볼 문제가 있습니다.${wrongText}`;
    }

    return `${studentName} 학생은 이번 시험에서 ${scoreText}을 받았습니다.${correctRateText}${wrongText}`;
}

function reportCenterBuildSingleExamSummaryText(data, wrongCount) {
    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - Number(wrongCount || 0)) / qCount) * 100) : null;
    return reportCenterBuildEasySummaryText(data, wrongCount, correctRate);
}

function reportCenterBuildTrendSummaryText(trendData, aiAnalysis = null) {
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiAnalysis?.trendSummary || reportCenterBuildEasyTrendText(trendData)), 320);
}

function reportCenterBuildWeaknessSummaryText(trendData, data, aiAnalysis = null) {
    const aiText = Array.isArray(aiAnalysis?.recurringWeaknesses) ? aiAnalysis.recurringWeaknesses.join(' ') : '';
    return reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiText || aiAnalysis?.wrongAnalysis || reportCenterBuildEasyWeaknessText(trendData, data)), 320);
}

const AP_REPORT_STUDIO_BLOCKS = [
    ['summary', '이번 시험 요약'],
    ['trend', '추이 해석'],
    ['weakness', '다시 볼 부분'],
    ['plan', '다음 수업 계획'],
    ['teacherOpinion', '선생님 종합 의견'],
    ['parentMessage', '학부모님께 드리는 말씀'],
    ['kakaoSummary', '카톡 요약문']
];

function reportCenterCloneStudioValue(value) {
    try {
        return JSON.parse(JSON.stringify(value || null));
    } catch (e) {
        return null;
    }
}

function reportCenterStudioDefaultOptions() {
    return {
        includeTrendGraph: false,
        includeDistributionGraph: false,
        includeWeaknessTrend: false,
        includeQuestionAnalysis: true,
        includeTeacherOpinion: true,
        includeParentMessage: true,
        includeSignature: true
    };
}

function reportCenterStudioResolveBlockText(block) {
    if (block?.isDirty) return String(block.userText ?? '');
    return String(block?.aiText || block?.autoText || '').trim();
}

function reportCenterStudioBlockIsDirty(studioState, blockKey) {
    return !!studioState?.blocks?.[blockKey]?.isDirty;
}

function reportCenterBuildStudioChartSources(data, trendData) {
    const trendRows = (trendData?.selectedSessions || []).map(row => ({
        id: row.id,
        label: row.title || row.date || '평가',
        date: row.date || '',
        score: row.score,
        classAvg: row.classAvg,
        overallAvg: row.overallAvg,
        visible: true
    }));
    const sameExamRows = reportCenterGetSameExamSessions(data?.session)
        .map((session, index) => ({
            id: session.id || `dist-${index}`,
            label: session.exam_title || `${index + 1}`,
            score: Number.isFinite(Number(session.score)) ? Number(session.score) : null,
            isStudent: String(session.id) === String(data?.session?.id),
            visible: true
        }))
        .filter(row => Number.isFinite(row.score));
    return { trendRows, distributionRows: sameExamRows };
}

function reportCenterBuildReportDraft(studentId, sessionId, context = {}) {
    const autoTexts = context.autoTexts || {};
    const aiAnalysis = context.aiAnalysis || null;
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(context.textOptions || {}) };
    const chartSources = reportCenterBuildStudioChartSources(context.data, context.trendData);
    const aiTexts = {
        summary: aiAnalysis?.finalExamComment || aiAnalysis?.summary || '',
        trend: aiAnalysis?.trendSummary || '',
        weakness: Array.isArray(aiAnalysis?.recurringWeaknesses) && aiAnalysis.recurringWeaknesses.length
            ? aiAnalysis.recurringWeaknesses.join('\n')
            : (aiAnalysis?.wrongAnalysis || ''),
        plan: Array.isArray(aiAnalysis?.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
            ? aiAnalysis.longitudinalPlan.join('\n')
            : (aiAnalysis?.nextPlan || ''),
        teacherOpinion: aiAnalysis?.trendDiagnosis || aiAnalysis?.diagnosis || '',
        parentMessage: aiAnalysis?.parentMessage || '',
        kakaoSummary: aiAnalysis?.kakaoSummary || ''
    };
    const blocks = {};
    AP_REPORT_STUDIO_BLOCKS.forEach(([key, label]) => {
        blocks[key] = {
            label,
            autoText: textOptions.humanize
                ? reportCenterHumanizeKoreanText(autoTexts[key], { ...textOptions, blockKey: key, source: 'auto' })
                : String(autoTexts[key] || ''),
            aiText: textOptions.humanize
                ? reportCenterHumanizeKoreanText(aiTexts[key], { ...textOptions, blockKey: key, source: 'ai' })
                : String(aiTexts[key] || ''),
            userText: '',
            isDirty: false
        };
    });
    return {
        studentId: String(studentId || ''),
        sessionId: String(sessionId || ''),
        mode: aiAnalysis ? 'premium' : 'basic',
        isEditMode: false,
        activeTab: 'text',
        snapshot: null,
        textOptions,
        humanizeWarnings: {},
        blocks,
        charts: {
            trendChart: {
                enabled: false,
                purpose: 'trend',
                type: 'line',
                title: '최근 평가 성적 추이',
                sourceData: reportCenterCloneStudioValue(chartSources.trendRows) || [],
                displayData: reportCenterCloneStudioValue(chartSources.trendRows) || [],
                options: {
                    showStudentScore: true,
                    showClassAverage: true,
                    showTotalAverage: false,
                    showDataLabels: true,
                    yMin: 0,
                    yMax: 100
                },
                isDirty: false
            },
            distributionChart: {
                enabled: false,
                purpose: 'distribution',
                type: 'histogram',
                title: '이번 시험 점수 분포',
                sourceData: reportCenterCloneStudioValue(chartSources.distributionRows) || [],
                displayData: reportCenterCloneStudioValue(chartSources.distributionRows) || [],
                options: {
                    binSize: 10,
                    showStudentMarker: true,
                    showDataLabels: true,
                    yMin: 0,
                    yMax: null
                },
                isDirty: false
            }
        },
        options: reportCenterStudioDefaultOptions()
    };
}

function reportCenterNormalizeStudioState(candidate, fallbackDraft) {
    const base = reportCenterCloneStudioValue(fallbackDraft) || {};
    const source = candidate && typeof candidate === 'object' ? candidate : {};
    const stateDraft = {
        ...base,
        ...source,
        blocks: { ...(base.blocks || {}) },
        charts: { ...(base.charts || {}) },
        textOptions: { ...reportCenterDefaultTextOptions(), ...(base.textOptions || {}), ...(source.textOptions || {}) },
        humanizeWarnings: { ...(base.humanizeWarnings || {}), ...(source.humanizeWarnings || {}) },
        options: { ...reportCenterStudioDefaultOptions(), ...(base.options || {}), ...(source.options || {}) }
    };
    Object.entries(source.blocks || {}).forEach(([key, block]) => {
        if (!stateDraft.blocks[key]) return;
        stateDraft.blocks[key] = { ...stateDraft.blocks[key], ...block };
    });
    Object.entries(source.charts || {}).forEach(([key, chart]) => {
        if (!stateDraft.charts[key]) return;
        stateDraft.charts[key] = {
            ...stateDraft.charts[key],
            ...chart,
            options: { ...(stateDraft.charts[key].options || {}), ...(chart.options || {}) },
            sourceData: Array.isArray(chart.sourceData) ? chart.sourceData : stateDraft.charts[key].sourceData,
            displayData: Array.isArray(chart.displayData) ? chart.displayData : stateDraft.charts[key].displayData
        };
    });
    if (!['text', 'chart', 'layout'].includes(stateDraft.activeTab)) stateDraft.activeTab = 'text';
    return stateDraft;
}

function reportCenterGetActiveStudioState(studentId, sessionId, fallbackDraft = null) {
    const current = window.AP_REPORT_STUDIO_STATE;
    const same = current
        && String(current.studentId || '') === String(studentId || '')
        && String(current.sessionId || '') === String(sessionId || '');
    const normalized = reportCenterNormalizeStudioState(same ? current : null, fallbackDraft || {});
    window.AP_REPORT_STUDIO_STATE = normalized;
    return normalized;
}

function reportCenterGetMatchingStudioState(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (
        studioState
        && String(studioState.studentId || '') === String(studentId || '')
        && String(studioState.sessionId || '') === String(sessionId || '')
    ) {
        return studioState;
    }
    return null;
}

function reportCenterMergeAiAnalysisIntoStudioState(studioState, aiAnalysis) {
    if (!studioState || !aiAnalysis) return studioState;
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    const aiTexts = {
        summary: aiAnalysis.finalExamComment || aiAnalysis.summary || '',
        trend: aiAnalysis.trendSummary || '',
        weakness: Array.isArray(aiAnalysis.recurringWeaknesses) && aiAnalysis.recurringWeaknesses.length
            ? aiAnalysis.recurringWeaknesses.join('\n')
            : (aiAnalysis.wrongAnalysis || ''),
        plan: Array.isArray(aiAnalysis.longitudinalPlan) && aiAnalysis.longitudinalPlan.length
            ? aiAnalysis.longitudinalPlan.join('\n')
            : (aiAnalysis.nextPlan || ''),
        teacherOpinion: aiAnalysis.trendDiagnosis || aiAnalysis.diagnosis || '',
        parentMessage: aiAnalysis.parentMessage || '',
        kakaoSummary: aiAnalysis.kakaoSummary || ''
    };
    Object.entries(aiTexts).forEach(([key, value]) => {
        const block = studioState.blocks?.[key];
        if (!block) return;
        block.aiText = textOptions.humanize
            ? reportCenterHumanizeKoreanText(value, { ...textOptions, blockKey: key, source: 'ai' })
            : String(value || '');
        if (!block.isDirty && !String(block.userText || '').trim()) block.userText = '';
    });
    studioState.mode = 'premium';
    return studioState;
}

function reportCenterApplyStudioBlocks(studioState, texts) {
    const blocks = studioState?.blocks || {};
    Object.keys(texts).forEach(key => {
        if (blocks[key]) texts[key] = reportCenterStudioResolveBlockText(blocks[key]);
    });
    return texts;
}

function reportCenterReportChartRows(chartState) {
    return (chartState?.displayData || []).filter(row => row && row.visible !== false);
}

function reportCenterBuildReportChartHtml(chartState) {
    if (!chartState?.enabled) return '';
    if (chartState.purpose === 'distribution') {
        return chartState.type === 'frequencyPolygon'
            ? reportCenterBuildFrequencyPolygonSvg(chartState)
            : reportCenterBuildHistogramSvg(chartState);
    }
    return chartState.type === 'bar'
        ? reportCenterBuildBarChartSvg(chartState)
        : reportCenterBuildLineChartSvg(chartState);
}

function reportCenterBuildLineChartSvg(chartState) {
    const rows = reportCenterReportChartRows(chartState).map(row => ({
        ...row,
        label: row.label || row.title || row.date || '',
        date: row.date || '',
        title: row.label,
        overallAvg: row.overallAvg,
        classAvg: row.classAvg
    }));
    const options = chartState.options || {};
    const pickSeriesKey = () => {
        const candidates = [
            options.showStudentScore !== false ? 'score' : '',
            options.showClassAverage !== false ? 'classAvg' : '',
            options.showTotalAverage ? 'overallAvg' : ''
        ].filter(Boolean);
        return candidates.find(key => rows.some(row => Number.isFinite(Number(row[key])))) || '';
    };
    const primaryKey = pickSeriesKey();
    if (!primaryKey) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const scores = rows.map(row => Number(row[primaryKey])).filter(Number.isFinite);
    const firstScore = scores.length ? scores[0] : null;
    const latestScore = scores.length ? scores[scores.length - 1] : null;
    const scoreDelta = firstScore !== null && latestScore !== null ? latestScore - firstScore : null;
    const changes = scores.slice(1).map((score, index) => score - scores[index]);
    let direction = 'flat';
    if (changes.length) {
        const hasUp = changes.some(value => value > 0);
        const hasDown = changes.some(value => value < 0);
        direction = hasUp && hasDown ? 'mixed' : hasUp ? 'up' : hasDown ? 'down' : 'flat';
    }
    const trend = { firstScore, latestScore, scoreDelta, direction };
    return reportCenterBuildTrendSvg(trend, rows, options);
}

function reportCenterBuildBarChartSvg(chartState) {
    const rows = reportCenterReportChartRows(chartState);
    const series = [
        chartState.options?.showStudentScore !== false ? { key: 'score', label: '학생', color: '#2563eb' } : null,
        chartState.options?.showClassAverage !== false ? { key: 'classAvg', label: '반 평균', color: '#f59e0b' } : null,
        chartState.options?.showTotalAverage ? { key: 'overallAvg', label: '전체 평균', color: '#94a3b8' } : null
    ].filter(Boolean);
    if (!series.length) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const bars = [];
    rows.forEach((row, rowIndex) => {
        series.forEach((item, seriesIndex) => {
            const value = Number(row[item.key]);
            if (!Number.isFinite(value)) return;
            bars.push({ row, rowIndex, seriesIndex, seriesCount: series.length, value, ...item });
        });
    });
    if (!bars.length) return '<div class="aprc-trend-empty">표시할 그래프 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxValue = Number.isFinite(Number(chartState.options?.yMax)) ? Number(chartState.options.yMax) : 100;
    const minValue = Number.isFinite(Number(chartState.options?.yMin)) ? Number(chartState.options.yMin) : 0;
    const range = Math.max(10, maxValue - minValue);
    const slot = (width - left - 24) / Math.max(1, rows.length);
    const barScaleY = value => top + ((maxValue - Number(value)) / range) * (height - top - bottom);
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '성적 그래프')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            ${bars.map(bar => {
                const groupWidth = slot * 0.68;
                const barWidth = Math.max(8, Math.min(20, groupWidth / Math.max(1, bar.seriesCount)));
                const groupLeft = left + bar.rowIndex * slot + (slot - groupWidth) / 2;
                const x = groupLeft + bar.seriesIndex * barWidth;
                const y = barScaleY(bar.value);
                const h = height - bottom - y;
                const valueLabel = chartState.options?.showDataLabels === false ? '' : `<text x="${(x + barWidth / 2).toFixed(1)}" y="${y - 8}" text-anchor="middle" fill="#1e3a8a" font-size="10" font-weight="800">${reportCenterEscape(bar.value)}</text>`;
                return `<g><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${Math.max(2, h).toFixed(1)}" rx="4" fill="${bar.color}"/>${valueLabel}</g>`;
            }).join('')}
            ${rows.map((row, index) => {
                const x = left + index * slot + slot / 2;
                return `<text x="${x.toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="10">${reportCenterEscape(String(row.label || row.date || index + 1).slice(0, 10))}</text>`;
            }).join('')}
            <g transform="translate(${left},14)">${series.map((item, index) => `<rect x="${index * 78}" y="-8" width="10" height="10" rx="2" fill="${item.color}"/><text x="${index * 78 + 14}" y="1" fill="#64748b" font-size="10" font-weight="700">${reportCenterEscape(item.label)}</text>`).join('')}</g>
        </svg>`;
}

function reportCenterBuildDistributionBuckets(chartState) {
    const rows = reportCenterReportChartRows(chartState).filter(row => Number.isFinite(Number(row.score)));
    const binSize = Math.max(1, Number(chartState.options?.binSize || 10));
    const buckets = [];
    for (let start = 0; start < 100; start += binSize) {
        buckets.push({ label: `${start}-${Math.min(100, start + binSize - 1)}`, mid: start + binSize / 2, count: 0 });
    }
    rows.forEach(row => {
        const score = Math.max(0, Math.min(100, Number(row.score)));
        const index = Math.min(buckets.length - 1, Math.floor(score / binSize));
        buckets[index].count += 1;
    });
    return buckets;
}

function reportCenterBuildHistogramSvg(chartState) {
    const buckets = reportCenterBuildDistributionBuckets(chartState);
    const active = buckets.filter(bucket => bucket.count > 0);
    if (!active.length) return '<div class="aprc-trend-empty">표시할 분포 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxCount = Math.max(1, ...buckets.map(bucket => bucket.count));
    const rawYMin = Number(chartState.options?.yMin);
    const rawYMax = Number(chartState.options?.yMax);
    const axisMin = Number.isFinite(rawYMin) ? rawYMin : 0;
    const axisMax = Number.isFinite(rawYMax) && rawYMax > axisMin ? rawYMax : maxCount;
    const axisRange = Math.max(1, axisMax - axisMin);
    const slot = (width - left - 24) / buckets.length;
    const histogramScaleY = count => top + ((axisMax - Math.max(axisMin, Math.min(axisMax, count))) / axisRange) * (height - top - bottom);
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '점수 분포')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            ${buckets.map((bucket, index) => {
                const x = left + index * slot + 2;
                const y = histogramScaleY(bucket.count);
                const h = height - bottom - y;
                const countLabel = chartState.options?.showDataLabels === false || !bucket.count ? '' : `<text x="${(x + slot / 2).toFixed(1)}" y="${y - 7}" text-anchor="middle" fill="#115e59" font-size="11" font-weight="800">${bucket.count}</text>`;
                return `<g><rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(8, slot - 4).toFixed(1)}" height="${Math.max(1, h).toFixed(1)}" fill="#0f766e"/><text x="${(x + slot / 2).toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="9">${reportCenterEscape(bucket.label)}</text>${countLabel}</g>`;
            }).join('')}
        </svg>`;
}

function reportCenterBuildFrequencyPolygonSvg(chartState) {
    const buckets = reportCenterBuildDistributionBuckets(chartState);
    const active = buckets.filter(bucket => bucket.count > 0);
    if (!active.length) return '<div class="aprc-trend-empty">표시할 분포 데이터가 없습니다.</div>';
    const width = 680;
    const height = 220;
    const left = 42;
    const bottom = 42;
    const top = 24;
    const maxCount = Math.max(1, ...buckets.map(bucket => bucket.count));
    const rawYMin = Number(chartState.options?.yMin);
    const rawYMax = Number(chartState.options?.yMax);
    const axisMin = Number.isFinite(rawYMin) ? rawYMin : 0;
    const axisMax = Number.isFinite(rawYMax) && rawYMax > axisMin ? rawYMax : maxCount;
    const axisRange = Math.max(1, axisMax - axisMin);
    const plotWidth = width - left - 24;
    const polygonScaleX = index => left + (plotWidth * index) / Math.max(1, buckets.length - 1);
    const polygonScaleY = count => top + ((axisMax - Math.max(axisMin, Math.min(axisMax, count))) / axisRange) * (height - top - bottom);
    const points = buckets.map((bucket, index) => `${polygonScaleX(index).toFixed(1)},${polygonScaleY(bucket.count).toFixed(1)}`).join(' ');
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${reportCenterEscape(chartState.title || '도수분포다각형')}">
            <line x1="${left}" y1="${height - bottom}" x2="${width - 20}" y2="${height - bottom}" stroke="#cbd5e1"/>
            <polyline points="${points}" fill="none" stroke="#7c3aed" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
            ${buckets.map((bucket, index) => {
                const x = polygonScaleX(index);
                const y = polygonScaleY(bucket.count);
                const countLabel = chartState.options?.showDataLabels === false ? '' : `<text x="${x.toFixed(1)}" y="${y - 9}" text-anchor="middle" fill="#6d28d9" font-size="10" font-weight="800">${bucket.count}</text>`;
                return `<g><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#fff" stroke="#7c3aed" stroke-width="2"/>${countLabel}<text x="${x.toFixed(1)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="9">${reportCenterEscape(bucket.label)}</text></g>`;
            }).join('')}
        </svg>`;
}

function reportCenterBuildTrendSvg(trend, selectedSessions = [], chartOptions = {}) {
    const rows = (selectedSessions || []).filter(row => Number.isFinite(Number(row.score)));
    if (rows.length < 2) return '<div class="aprc-trend-empty">첫 평가 기록입니다.</div>';
    const width = 680;
    const height = 210;
    const left = 46;
    const right = 22;
    const top = 24;
    const bottom = 42;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;
    const includeStudent = chartOptions.showStudentScore !== false;
    const includeClass = chartOptions.showClassAverage !== false;
    const includeOverall = chartOptions.showTotalAverage !== false;
    const hasStudent = includeStudent && rows.some(row => Number.isFinite(row.score));
    const hasOverall = includeOverall && rows.some(row => Number.isFinite(row.overallAvg));
    const hasClass = includeClass && rows.some(row => Number.isFinite(row.classAvg));
    if (!hasStudent && !hasOverall && !hasClass) return '<div class="aprc-trend-empty">표시할 그래프 항목이 없습니다.</div>';
    const values = rows
        .flatMap(row => [
            includeStudent ? row.score : null,
            includeOverall ? row.overallAvg : null,
            includeClass ? row.classAvg : null
        ])
        .filter(Number.isFinite);
    const minValue = Number.isFinite(Number(chartOptions.yMin))
        ? Number(chartOptions.yMin)
        : Math.max(0, Math.floor((Math.min(...values, 100) - 10) / 10) * 10);
    const maxValue = Number.isFinite(Number(chartOptions.yMax))
        ? Number(chartOptions.yMax)
        : Math.min(100, Math.ceil((Math.max(...values, 0) + 10) / 10) * 10);
    const range = Math.max(10, maxValue - minValue);
    const trendScaleX = index => left + (rows.length === 1 ? plotWidth / 2 : (plotWidth * index) / (rows.length - 1));
    const trendScaleY = value => top + ((maxValue - Number(value)) / range) * plotHeight;
    const buildPoints = key => rows
        .map((row, index) => row[key] !== null && row[key] !== undefined && Number.isFinite(Number(row[key])) ? `${trendScaleX(index).toFixed(1)},${trendScaleY(row[key]).toFixed(1)}` : null);
    const buildSegments = (key, color, dash = '') => {
        const source = buildPoints(key);
        const segments = [];
        let current = [];
        source.forEach(point => {
            if (point) current.push(point);
            else if (current.length) {
                segments.push(current);
                current = [];
            }
        });
        if (current.length) segments.push(current);
        return segments.filter(segment => segment.length > 1).map(segment =>
            `<polyline points="${segment.join(' ')}" fill="none" stroke="${color}" stroke-width="2.2" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round" stroke-linejoin="round"/>`
        ).join('');
    };
    const gridValues = [minValue, Math.round((minValue + maxValue) / 2), maxValue];
    const directionArrow = trend?.direction === 'up' ? '↗ 상승' : trend?.direction === 'down' ? '↘ 하강' : trend?.direction === 'mixed' ? '↕ 등락' : '→ 유지';
    const legendItems = [
        includeStudent ? '<line x1="0" y1="0" x2="20" y2="0" stroke="#2563eb" stroke-width="2.5"/><text x="25" y="3" fill="#64748b" font-size="9">학생</text>' : '',
        hasOverall ? '<line x1="74" y1="0" x2="94" y2="0" stroke="#94a3b8" stroke-width="2" stroke-dasharray="7 5"/><text x="99" y="3" fill="#64748b" font-size="9">전체 평균</text>' : '',
        hasClass ? '<line x1="160" y1="0" x2="180" y2="0" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3 4"/><text x="185" y="3" fill="#64748b" font-size="9">반 평균</text>' : ''
    ].join('');
    return `
        <svg class="aprc-trend-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="최근 평가 점수 추이">
            ${gridValues.map(value => `<g><line x1="${left}" y1="${trendScaleY(value)}" x2="${width - right}" y2="${trendScaleY(value)}" stroke="#e2e8f0" stroke-width="1"/><text x="${left - 8}" y="${trendScaleY(value) + 4}" text-anchor="end" fill="#64748b" font-size="12">${value}</text></g>`).join('')}
            ${hasOverall ? buildSegments('overallAvg', '#94a3b8', '7 5') : ''}
            ${hasClass ? buildSegments('classAvg', '#f59e0b', '3 4') : ''}
            ${includeStudent ? buildSegments('score', '#2563eb') : ''}
            ${includeStudent ? rows.map((row, index) => {
                const isLast = index === rows.length - 1;
                const label = chartOptions.showDataLabels === false ? '' : `<text x="${trendScaleX(index)}" y="${trendScaleY(row.score) - 10}" text-anchor="middle" fill="#1e3a8a" font-size="12" font-weight="800">${reportCenterEscape(row.score)}</text>`;
                return `<g><circle cx="${trendScaleX(index)}" cy="${trendScaleY(row.score)}" r="${isLast ? 6 : 4}" fill="${isLast ? '#1d4ed8' : '#ffffff'}" stroke="#2563eb" stroke-width="2.5"/>${label}</g>`;
            }).join('') : ''}
            ${rows.map((row, index) => `<text x="${trendScaleX(index)}" y="${height - 16}" text-anchor="middle" fill="#64748b" font-size="11">${reportCenterEscape(String(row.label || row.date || `${index + 1}회`).slice(0, 10).replace('-', '.'))}</text>`).join('')}
            <text x="${width - right}" y="14" text-anchor="end" fill="${trend?.direction === 'down' ? '#dc2626' : trend?.direction === 'up' ? '#16a34a' : '#475569'}" font-size="12" font-weight="800">${directionArrow}</text>
            <g transform="translate(${left},${height - 2})">${legendItems}</g>
        </svg>`;
}

function reportCenterBuildWeaknessTrendTable(weaknessTrend = []) {
    const rows = weaknessTrend.slice(0, 6);
    if (!rows.length) return '';
    return `
        <table class="aprc-weakness-table">
            <thead><tr><th>단원</th><th>틀린 문제</th><th>나온 회차</th><th>최근 확인</th><th>상태</th></tr></thead>
            <tbody>${rows.map(row => `<tr><td>${reportCenterEscape(row.unit || row.unitKey)}</td><td>${row.wrongCount}회</td><td>${row.appearedInSessions}회</td><td>${reportCenterEscape(row.lastSeenDate || '-')}</td><td><span class="aprc-weakness-status ${row.resolved ? 'is-resolved' : 'is-active'}">${row.resolved ? '정리됨' : '다시 볼 부분'}</span></td></tr>`).join('')}</tbody>
        </table>`;
}

function reportCenterBuildCleanPdfDocument(studentId, sessionId, options = {}) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const student = data.student;
    const session = data.session;
    const stats = data.stats;
    const teacherMemo = options.teacherMemo !== undefined ? String(options.teacherMemo || '').trim() : reportCenterGetExamReportTeacherMemo();
    const aiAnalysis = reportCenterGetAiAnalysisForReport(session?.id, options);

    if (!student || !session || !stats) {
        return `<main class="aprc-pdf-document"><section class="aprc-pdf-panel aprc-empty-box">평가 리포트를 만들 시험 기록이 없습니다.</section></main>`;
    }

    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    const wrongCount = wrongRows.length;
    const qCount = Number(session.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const trendData = reportCenterGetExamTrendData(student.id, { limit: options.trendLimit || 5 });
    const recentAvg = trendData.trend.averageScore;
    const target = data.targetProgress;
    const targetText = target && target.targetScore !== null
        ? `${target.targetScore}점 목표${target.currentAverage !== null ? ` · 최근 평균 ${target.currentAverage}점` : ''}${target.remainScore !== undefined && target.currentAverage !== null ? ` · 목표까지 ${target.remainScore}점` : ''}`
        : '목표점수 미설정';
    const safeTitle = reportCenterEscape(session.exam_title || '평가');
    const tableMeta = reportCenterGetPremiumTableMeta(data);
    const summaryItems = reportCenterBuildShortReportSummaryItems(data, aiAnalysis);
    const meaningItems = reportCenterBuildEvaluationMeaningItems(data, correctRate, wrongCount, aiAnalysis);
    const singleExamSummaryText = reportCenterBuildSingleExamSummaryText(data, wrongCount);
    let trendSummaryText = reportCenterBuildTrendSummaryText(trendData, aiAnalysis);
    const weaknessSummaryText = reportCenterBuildWeaknessSummaryText(trendData, data, aiAnalysis);
    const coreItems = [
        { title: '이번 시험', text: reportCenterTrimText(singleExamSummaryText || summaryItems[0]?.text || '', 360) },
        { title: '다시 볼 부분', text: reportCenterTrimText(wrongCount ? (weaknessSummaryText || summaryItems[1]?.text || '') : '', 320) },
        { title: '다음 시간', text: reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiAnalysis?.nextPlan || meaningItems[2] || summaryItems[2]?.text || ''), 320) }
    ];
    let parentSummaryText = reportCenterPickNonDuplicateText(
        singleExamSummaryText,
        summaryItems[0]?.text || '이번 시험 결과를 정리했습니다.',
        []
    );
    coreItems[1].text = reportCenterPickNonDuplicateText(
        coreItems[1].text,
        summaryItems[1]?.text || '틀린 문제를 다시 보겠습니다.',
        [parentSummaryText]
    );
    let diagnosisLines = reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo, aiAnalysis).slice(0, 2);
    let nextPlanItems = (aiAnalysis ? reportCenterBuildNextPlanItems(data, aiAnalysis) : reportCenterBuildEasyPlanItems(data, trendData)).slice(0, 4);
    let parentMessageText = aiAnalysis?.parentMessage
        ? reportCenterEnsureParentOpening(aiAnalysis.parentMessage)
        : reportCenterBuildEasyParentMessage(data);
    const autoTexts = {
        summary: parentSummaryText,
        trend: trendSummaryText,
        weakness: wrongCount ? coreItems[1].text : '',
        plan: nextPlanItems.join('\n'),
        teacherOpinion: diagnosisLines.join('\n\n'),
        parentMessage: parentMessageText,
        kakaoSummary: reportCenterBuildExamPreview(studentId, sessionId)
    };
    const fallbackStudioDraft = reportCenterBuildReportDraft(student.id, session.id, { data, trendData, aiAnalysis, autoTexts });
    const studioState = reportCenterNormalizeStudioState(options.studioState || null, fallbackStudioDraft);
    const studioTexts = reportCenterApplyStudioBlocks(studioState, { ...autoTexts });
    const dirtyBlocks = {
        summary: reportCenterStudioBlockIsDirty(studioState, 'summary'),
        trend: reportCenterStudioBlockIsDirty(studioState, 'trend'),
        weakness: reportCenterStudioBlockIsDirty(studioState, 'weakness'),
        plan: reportCenterStudioBlockIsDirty(studioState, 'plan'),
        teacherOpinion: reportCenterStudioBlockIsDirty(studioState, 'teacherOpinion'),
        parentMessage: reportCenterStudioBlockIsDirty(studioState, 'parentMessage')
    };
    parentSummaryText = dirtyBlocks.summary ? studioTexts.summary : reportCenterApplyEasyFinalLanguage(studioTexts.summary);
    trendSummaryText = dirtyBlocks.trend ? studioTexts.trend : reportCenterApplyEasyFinalLanguage(studioTexts.trend);
    coreItems[1].text = dirtyBlocks.weakness ? studioTexts.weakness : reportCenterApplyEasyFinalLanguage(studioTexts.weakness);
    nextPlanItems = String(studioTexts.plan || '')
        .split(/\n+/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => dirtyBlocks.plan ? item : reportCenterApplyEasyFinalLanguage(item))
        .slice(0, 6);
    if (!nextPlanItems.length && !dirtyBlocks.plan) nextPlanItems = reportCenterBuildEasyPlanItems(data, trendData);
    diagnosisLines = String(studioTexts.teacherOpinion || '')
        .split(/\n{2,}|\n/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => dirtyBlocks.teacherOpinion ? item : reportCenterApplyEasyFinalLanguage(item))
        .slice(0, 4);
    if (!diagnosisLines.length && !dirtyBlocks.teacherOpinion) diagnosisLines = reportCenterBuildEasyTeacherOpinionLines(data, teacherMemo);
    parentMessageText = dirtyBlocks.parentMessage
        ? studioTexts.parentMessage
        : reportCenterApplyEasyFinalLanguage(studioTexts.parentMessage || parentMessageText);
    const studioOptions = { ...reportCenterStudioDefaultOptions(), ...(studioState.options || {}) };
    const trendChart = {
        ...(studioState.charts?.trendChart || {}),
        enabled: !!studioOptions.includeTrendGraph
    };
    const distributionChart = {
        ...(studioState.charts?.distributionChart || {}),
        enabled: !!studioOptions.includeDistributionGraph
    };
    const archiveMessage = data.archiveDetails
        ? (data.archiveDetails.status === 'loaded' ? '문제 원문 일부를 확인했습니다.' : reportCenterApplyEasyFinalLanguage(data.archiveDetails.message))
        : (tableMeta.note || '문제 번호·단원·정답률 기준으로 정리합니다.');
    const aiBadgeHtml = aiAnalysis ? `<div class="aprc-ai-badge">프리미엄 분석</div>` : '';

    let html = `
        <main class="aprc-pdf-document">
            <header class="aprc-pdf-header">
                <div>
                    <div class="aprc-brand">AP MATH REPORT</div>
                    <div class="aprc-title">평가 분석 리포트</div>
                    <div class="aprc-subtitle">점수와 함께 다음 시간에 다시 볼 문제를 정리합니다.</div>
                    ${aiBadgeHtml}
                </div>
                ${studioOptions.includeSignature ? `<div class="aprc-signature-boxes" aria-label="선생님 학부모 사인란">
                    <div class="aprc-signature-labels">
                        <div>선생님</div>
                        <div>학부모</div>
                    </div>
                    <div class="aprc-signature-cells" aria-hidden="true">
                        <div></div>
                        <div></div>
                    </div>
                </div>` : ''}
            </header>

            <section class="aprc-pdf-section aprc-pdf-student-band">
                <div>
                    <div class="aprc-student-name">${reportCenterEscape(student.name || '')}</div>
                    <div class="aprc-student-meta">${reportCenterEscape(`${student.school_name || ''} ${student.grade || ''}`.trim() || '-')} · ${reportCenterEscape(data.classInfo.className || '-')}</div>
                </div>
                <div class="aprc-exam-meta">
                    <div>${safeTitle}</div>
                </div>
            </section>

            <section class="aprc-pdf-section aprc-pdf-score-grid">
                <div class="aprc-pdf-score-card aprc-main-score">
                    <div class="aprc-card-label">이번 시험 점수</div>
                    <div class="aprc-score-value">${reportCenterEscape(session.score ?? '-')}<span>점</span></div>
                    <div class="aprc-card-note">${reportCenterEscape(reportCenterBuildScorePositionText(data))}</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">정답률</div>
                    <div class="aprc-metric-value">${correctRate === null ? '-' : `${correctRate}%`}</div>
                    <div class="aprc-card-note">${qCount || '-'}문제 중 ${wrongCount}문제 틀렸습니다</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">비교 평균</div>
                    <div class="aprc-metric-value">${stats.overallAvg === null ? '-' : `${stats.overallAvg}점`}</div>
                    <div class="aprc-card-note">전체 ${stats.totalSessions || 0}명 · 반 ${stats.classSessions || 0}명</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">최근 점수</div>
                    <div class="aprc-metric-value">${recentAvg === null ? '-' : `${recentAvg}점`}</div>
                    <div class="aprc-card-note">${reportCenterEscape(targetText)}</div>
                </div>
            </section>

            <section class="aprc-pdf-section aprc-pdf-parent-summary aprc-pdf-panel">
                <div class="aprc-section-title">이번 시험, 이렇게 봤습니다</div>
                <p>${reportCenterEscape(parentSummaryText)}</p>
            </section>

            <section class="aprc-pdf-section aprc-pdf-point-grid">
                <article class="aprc-pdf-panel">
                    <div class="aprc-section-title">지금 어디쯤 있나요</div>
                    ${reportCenterBuildReportChartHtml(trendChart)}
                    <p class="aprc-trend-summary">${reportCenterEscape(trendSummaryText)}</p>
                </article>
                ${wrongCount ? `<article class="aprc-pdf-panel">
                    <div class="aprc-section-title">다음에 꼭 짚어볼 부분</div>
                    <p>${reportCenterEscape(coreItems[1].text)}</p>
                    ${studioOptions.includeWeaknessTrend ? reportCenterBuildWeaknessTrendTable(trendData.weaknessTrend) : ''}
                </article>` : ''}
            </section>

            ${studioOptions.includeDistributionGraph ? `<section class="aprc-pdf-section aprc-pdf-panel">
                <div class="aprc-section-title">이번 시험 점수 분포</div>
                ${reportCenterBuildReportChartHtml(distributionChart)}
            </section>` : ''}

            <section class="aprc-pdf-section aprc-pdf-next-plan aprc-pdf-panel">
                <div class="aprc-section-title">다음 수업에서 이렇게 합니다</div>
                <ol class="aprc-plan-list">
                    ${nextPlanItems.map(item => `<li>${reportCenterEscape(item)}</li>`).join('')}
                </ol>
                <p class="aprc-pdf-bridge-note">문제별 자세한 내용은 아래 분석 자료를 참고해 주시기 바랍니다.</p>
            </section>

            ${studioOptions.includeQuestionAnalysis ? `<section class="aprc-pdf-section aprc-pdf-table-panel">
                <div class="aprc-section-title">문제별 분석</div>
                <table class="aprc-pdf-table aprc-table">
                    <thead>
                        <tr>
                            <th>문제</th>
                            <th>단원</th>
                            <th>난도</th>
                            <th>전체 정답률</th>
                            <th>반 정답률</th>
                            <th>해석</th>
                        </tr>
                    </thead>
                    <tbody>${reportCenterBuildPremiumQuestionRows(data, true)}</tbody>
                </table>
                <div class="aprc-source-note">${reportCenterEscape(archiveMessage || '')}</div>
            </section>` : ''}

            ${studioOptions.includeTeacherOpinion ? `<section class="aprc-pdf-section aprc-pdf-diagnosis aprc-pdf-panel">
                <div class="aprc-section-title">선생님 종합 의견</div>
                ${diagnosisLines.map(line => `<p>${reportCenterEscape(line)}</p>`).join('')}
            </section>` : ''}

            ${studioOptions.includeParentMessage ? `<section class="aprc-pdf-section aprc-pdf-parent-message">
                <div class="aprc-section-title">학부모님께 드리는 말씀</div>
                <p>${reportCenterEscape(parentMessageText)}</p>
            </section>` : ''}

            <footer class="aprc-pdf-footer">AP MATH · Student Learning Report</footer>
        </main>
    `;

    html = reportCenterPolishCleanPdfDocumentHtml(html, { data, session, stats, qCount, wrongCount, correctRate, recentAvg, targetText, trendData });
    return html;
}

function reportCenterPolishCleanPdfDocumentHtml(html, context = {}) {
    const { data, session, stats, qCount, wrongCount, correctRate, recentAvg, targetText, trendData } = context;
    const score = session?.score ?? '-';
    const safeTargetText = reportCenterEscape(targetText || '');
    const scorePositionText = data ? reportCenterEscape(reportCenterBuildScorePositionText(data)) : '';
    const selectedCount = trendData?.selectedSessions?.length || 0;
    const trend = trendData?.trend || {};
    const directionLabel = selectedCount < 2
        ? '첫 평가'
        : trend.direction === 'up'
            ? '상승'
            : trend.direction === 'down'
                ? '하강'
                : trend.direction === 'mixed'
                    ? '등락'
                    : '유지';
    const directionNote = selectedCount < 2
        ? '다음 시험부터 점수 변화를 같이 보여드리겠습니다.'
        : reportCenterEasyScoreDeltaText(trend.scoreDelta);
    const wrongScoreNote = wrongCount
        ? `${wrongCount}문제 틀렸습니다`
        : '다 맞았습니다';
    const scoreGridHtml = `
            <section class="aprc-pdf-section aprc-pdf-score-grid">
                <div class="aprc-pdf-score-card aprc-main-score">
                    <div class="aprc-card-label">이번 점수</div>
                    <div class="aprc-score-value">${reportCenterEscape(score)}<span>점</span></div>
                    <div class="aprc-card-note">${correctRate === null ? '' : `정답률 ${correctRate}% · ${wrongScoreNote}<br>`}${scorePositionText}</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">최근 ${selectedCount || '-'}회 평균</div>
                    <div class="aprc-metric-value">${recentAvg === null ? '-' : `${recentAvg}점`}</div>
                    <div class="aprc-card-note">${safeTargetText}</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">첫 시험 → 최근</div>
                    <div class="aprc-metric-value">${trend.firstScore == null ? '-' : `${trend.firstScore} → ${trend.latestScore}`}</div>
                    <div class="aprc-card-note">${selectedCount < 2 ? '첫 시험입니다.' : `최근 ${selectedCount}회 시험`}</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">최고 · 최저</div>
                    <div class="aprc-metric-value">${trend.bestScore == null ? '-' : `${trend.bestScore} · ${trend.worstScore}`}</div>
                    <div class="aprc-card-note">선택된 최근 시험 기준</div>
                </div>
                <div class="aprc-pdf-score-card">
                    <div class="aprc-card-label">상승 · 하강 상태</div>
                    <div class="aprc-metric-value">${directionLabel}</div>
                    <div class="aprc-card-note">${directionNote}</div>
                </div>
            </section>`;

    return String(html || '')
        .replace(/<section class="aprc-pdf-section aprc-pdf-score-grid">[\s\S]*?<\/section>/, scoreGridHtml)
        ;
}

function reportCenterPremiumReportStyle() {
    return `
        <style>
            .aprc-document { width:100%; max-width:794px; margin:0 auto; background:#ffffff; color:#111827; border:1px solid #e5e7eb; border-radius:22px; overflow:hidden; box-shadow:0 18px 60px rgba(15,23,42,0.10); font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.55; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-document * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-report-header { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; margin:-9mm -9mm 0; padding:9mm 9mm 7mm; background:linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%); color:#fff; }
            .aprc-brand { font-size:11px; font-weight:800; letter-spacing:0.16em; color:rgba(255,255,255,0.72); }
            .aprc-title { margin-top:6px; font-size:24px; font-weight:800; letter-spacing:-0.8px; line-height:1.15; }
            .aprc-subtitle { margin-top:6px; font-size:12px; font-weight:650; color:rgba(255,255,255,0.74); }
            .aprc-ai-badge { display:inline-flex; margin-top:9px; padding:4px 8px; border-radius:999px; background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.18); color:rgba(255,255,255,0.86); font-size:10px; font-weight:850; letter-spacing:-0.1px; }
            .aprc-signature-boxes { --aprc-sign-border:rgba(255,255,255,0.72); --aprc-sign-text:rgba(255,255,255,0.86); flex-shrink:0; width:36mm; min-width:36mm; display:grid; grid-template-rows:6mm 18mm; border:1.3px solid var(--aprc-sign-border); background:rgba(255,255,255,0.07); box-sizing:border-box; }
            .aprc-signature-labels, .aprc-signature-cells { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); min-width:0; }
            .aprc-signature-labels { border-bottom:1.3px solid var(--aprc-sign-border); }
            .aprc-signature-labels > div { display:flex; align-items:center; justify-content:center; min-width:0; color:var(--aprc-sign-text); font-size:10px; font-weight:850; line-height:1; letter-spacing:-0.2px; }
            .aprc-signature-labels > div:first-child, .aprc-signature-cells > div:first-child { border-right:1.3px solid var(--aprc-sign-border); }
            .aprc-signature-cells > div { min-width:0; height:18mm; }
            .aprc-student-band { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:8mm 0 5mm; background:#fff; border-bottom:1px solid #e5e7eb; }
            .aprc-student-name { font-size:22px; font-weight:850; letter-spacing:-0.7px; color:#0f172a; }
            .aprc-student-meta { margin-top:3px; font-size:12.5px; font-weight:700; color:#64748b; }
            .aprc-exam-meta { text-align:right; font-size:12.5px; font-weight:750; color:#334155; max-width:96mm; }
            .aprc-exam-meta b { display:block; margin-top:4px; color:#2563eb; }
            .aprc-score-grid { display:grid; grid-template-columns:1.45fr 1fr 1fr 1fr; gap:4mm; padding:6mm 0 0; }
            .aprc-score-card { min-width:0; padding:4.2mm; border:1px solid #e5e7eb; border-radius:14px; background:#fff; min-height:30mm; }
            .aprc-main-score { background:#eff6ff; border-color:#bfdbfe; }
            .aprc-card-label { font-size:10.5px; font-weight:850; color:#64748b; letter-spacing:-0.1px; }
            .aprc-score-value { margin-top:7px; font-size:34px; font-weight:900; color:#1d4ed8; line-height:0.95; letter-spacing:-1px; }
            .aprc-score-value span { font-size:17px; font-weight:850; color:#475569; margin-left:2px; }
            .aprc-metric-value { margin-top:8px; font-size:20px; font-weight:900; color:#0f172a; letter-spacing:-0.4px; }
            .aprc-card-note { margin-top:7px; font-size:10.5px; font-weight:700; color:#64748b; line-height:1.35; word-break:keep-all; }
            .aprc-core-summary { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:4mm; padding:5mm 0 0; }
            .aprc-core-item { min-width:0; padding:4mm; border:1px solid #dbeafe; border-radius:14px; background:#f8fbff; min-height:37mm; overflow:hidden; }
            .aprc-core-item b { display:block; margin-bottom:5px; color:#1d4ed8; font-size:11.5px; font-weight:900; letter-spacing:-0.2px; }
            .aprc-core-item span { display:block; color:#334155; font-size:11.6px; font-weight:700; line-height:1.55; word-break:keep-all; }
            .aprc-two-col { display:grid; grid-template-columns:1fr 1.05fr; gap:4mm; padding:5mm 0 0; }
            .aprc-panel { border:1px solid #e5e7eb; border-radius:14px; background:#fff; padding:4.5mm; min-width:0; overflow:hidden; }
            .aprc-section-title { margin:0 0 9px; font-size:14px; font-weight:850; color:#0f172a; letter-spacing:-0.35px; }
            .aprc-page-kicker { margin-bottom:5mm; font-size:18px; font-weight:850; color:#0f172a; letter-spacing:-0.5px; }
            .aprc-bar-row { display:grid; grid-template-columns:60px 1fr 28px; gap:7px; align-items:center; margin:7px 0; }
            .aprc-bar-label { font-size:11px; font-weight:800; color:#64748b; }
            .aprc-bar-track { height:9px; background:#f1f5f9; border-radius:999px; overflow:hidden; border:1px solid #e2e8f0; }
            .aprc-bar-fill { height:100%; background:#2563eb; border-radius:999px; }
            .aprc-bar-count { font-size:11px; font-weight:850; color:#0f172a; text-align:right; }
            .aprc-insight-list { display:flex; flex-direction:column; gap:6px; }
            .aprc-insight-item { padding:8px 10px; border-radius:11px; background:#f8fafc; border:1px solid #e5e7eb; color:#334155; font-size:11.4px; font-weight:700; line-height:1.5; word-break:keep-all; }
            .aprc-table-panel { margin:0; padding:4.5mm; }
            .aprc-table-wrap { overflow:hidden; border:1px solid #e5e7eb; border-radius:12px; }
            .aprc-table { width:100%; border-collapse:collapse; table-layout:fixed; min-width:0; font-size:9.6px; }
            .aprc-table th { padding:6px 5px; background:#f8fafc; color:#64748b; text-align:left; font-weight:850; border-bottom:1px solid #e5e7eb; white-space:nowrap; }
            .aprc-table td { padding:6px 5px; border-bottom:1px solid #e5e7eb; vertical-align:top; color:#334155; font-weight:650; line-height:1.38; }
            .aprc-table tr:last-child td { border-bottom:none; }
            .aprc-table th:nth-child(1), .aprc-table td:nth-child(1) { width:10%; }
            .aprc-table th:nth-child(2), .aprc-table td:nth-child(2) { width:18%; }
            .aprc-table th:nth-child(3), .aprc-table td:nth-child(3) { width:13%; }
            .aprc-table th:nth-child(4), .aprc-table td:nth-child(4) { width:14%; }
            .aprc-table th:nth-child(5), .aprc-table td:nth-child(5) { width:13%; }
            .aprc-table th:nth-child(6), .aprc-table td:nth-child(6) { width:32%; }
            .aprc-qno { color:#1d4ed8 !important; font-weight:900 !important; white-space:nowrap; }
            .aprc-question-summary { line-height:1.35; word-break:keep-all; }
            .aprc-question-sub { margin-top:4px; color:#64748b; font-size:9px; font-weight:700; line-height:1.3; }
            .aprc-empty-cell { padding:16px !important; text-align:center; color:#64748b !important; font-weight:800 !important; }
            .aprc-source-note { margin-top:7px; padding:7px 9px; border-radius:10px; background:#f8fafc; color:#64748b; font-size:10.3px; font-weight:700; line-height:1.4; }
            .aprc-bottom-grid { align-items:stretch; padding-top:4mm; }
            .aprc-paragraph p { margin:0 0 8px; color:#334155; font-size:11.7px; font-weight:650; line-height:1.62; word-break:keep-all; }
            .aprc-plan-list { margin:0; padding-left:18px; color:#334155; font-size:11.8px; font-weight:700; line-height:1.65; }
            .aprc-plan-list li { margin:0 0 4px; }
            .aprc-parent-message { margin:4mm 0 0; padding:4.5mm 5mm; border-radius:14px; background:#eff6ff; border:1px solid #bfdbfe; }
            .aprc-parent-message p { margin:0; color:#1e3a8a; font-size:11.5px; font-weight:700; line-height:1.58; word-break:keep-all; white-space:normal; }
            .aprc-parent-bottom-note { margin-top:3.5mm; padding:3.5mm 4.5mm; border:1px solid #e5e7eb; border-radius:12px; background:#f8fafc; color:#334155; font-size:10.8px; font-weight:750; line-height:1.45; }
            .aprc-footer { position:absolute; left:9mm; right:9mm; bottom:7mm; color:#94a3b8; font-size:10px; font-weight:850; letter-spacing:0.14em; text-align:center; }
            .aprc-muted { color:#64748b; font-size:12px; font-weight:700; }
            .aprc-empty-box { padding:36px; text-align:center; color:#64748b; font-weight:800; }

            .aprc-pdf-document { width:100%; max-width:186mm; margin:0 auto; padding:0; box-sizing:border-box; background:#fff; color:#111827; font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.56; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-pdf-document * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-pdf-header { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; padding:11mm 0 8mm; border-bottom:2px solid #0f172a; color:#111827; }
            .aprc-pdf-header > div:first-child { min-width:0; padding-right:8mm; }
            .aprc-pdf-header .aprc-brand { color:#2563eb; }
            .aprc-pdf-header .aprc-title { color:#0f172a; font-size:25px; }
            .aprc-pdf-header .aprc-subtitle { color:#475569; }
            .aprc-pdf-header .aprc-ai-badge { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
            .aprc-pdf-header .aprc-signature-boxes { --aprc-sign-border:#334155; --aprc-sign-text:#0f172a; width:38mm; min-width:38mm; grid-template-rows:6mm 19mm; background:#fff; justify-self:end; }
            .aprc-pdf-header .aprc-signature-cells > div { height:19mm; }
            .aprc-pdf-section, .aprc-pdf-panel, .aprc-pdf-table-panel, .aprc-pdf-parent-message { box-sizing:border-box; }
            .aprc-pdf-section { margin-top:6mm; }
            .aprc-pdf-student-band { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:5mm 0; border-bottom:1px solid #e5e7eb; }
            .aprc-pdf-score-grid { display:grid; grid-template-columns:1.25fr repeat(4,minmax(0,1fr)); gap:3mm; }
            .aprc-pdf-score-card { min-width:0; padding:4.2mm; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
            .aprc-pdf-core-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:4mm; }
            .aprc-pdf-point-grid { display:grid; grid-template-columns:minmax(0,1fr); gap:4mm; }
            .aprc-trend-svg { display:block; width:100%; height:auto; margin:1mm 0 2mm; }
            .aprc-trend-summary { margin-top:2mm !important; }
            .aprc-trend-empty { padding:8mm 3mm; border:1px dashed #cbd5e1; border-radius:10px; background:#f8fafc; color:#64748b; text-align:center; font-size:11px; font-weight:800; }
            .aprc-weakness-table { width:100%; margin-top:3mm; border-collapse:collapse; table-layout:fixed; font-size:10px; }
            .aprc-weakness-table th, .aprc-weakness-table td { padding:5px 4px; border-bottom:1px solid #e5e7eb; color:#475569; text-align:left; overflow-wrap:break-word; }
            .aprc-weakness-table th { background:#f8fafc; color:#64748b; font-weight:850; }
            .aprc-weakness-table th:first-child, .aprc-weakness-table td:first-child { width:40%; }
            .aprc-weakness-status { display:inline-block; padding:2px 5px; border-radius:999px; white-space:nowrap; font-weight:850; }
            .aprc-weakness-status.is-active { background:#fff7ed; color:#c2410c; }
            .aprc-weakness-status.is-resolved { background:#f0fdf4; color:#15803d; }
            .aprc-pdf-parent-summary { border:1.5pt solid #bfdbfe; background:#f8faff; }
            .aprc-pdf-bridge-note { margin:3.5mm 0 0; padding:3mm 3.5mm; border-radius:10px; background:#f8fafc; color:#64748b; font-size:11px; font-weight:700; line-height:1.5; }
            .aprc-pdf-diagnosis + .aprc-pdf-parent-message { margin-top:6mm; }
            .aprc-pdf-panel, .aprc-pdf-table-panel, .aprc-pdf-parent-message { padding:4.5mm; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
            .aprc-pdf-panel p, .aprc-pdf-parent-message p { margin:0 0 8px; color:#334155; font-size:12px; font-weight:650; line-height:1.62; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-pdf-panel p:last-child, .aprc-pdf-parent-message p:last-child { margin-bottom:0; }
            .aprc-pdf-parent-message { background:#eff6ff; border-color:#bfdbfe; }
            .aprc-pdf-parent-message p { color:#1e3a8a; font-weight:700; }
            .aprc-pdf-table { width:100%; min-width:0; border-collapse:collapse; table-layout:fixed; font-size:10px; }
            .aprc-pdf-table th, .aprc-pdf-table td { word-break:keep-all; overflow-wrap:break-word; }
            .aprc-pdf-table th { white-space:normal; }
            .aprc-pdf-table tr { break-inside:avoid; page-break-inside:avoid; }
            .aprc-pdf-document .aprc-source-note { max-height:none; overflow:visible; }
            .aprc-pdf-footer { margin:8mm 0 0; padding-top:4mm; border-top:1px solid #e5e7eb; color:#94a3b8; font-size:10px; font-weight:850; letter-spacing:0.14em; text-align:center; }

            @media screen and (max-width:760px) {
                .aprc-report-header { margin:-34px -34px 0; padding:34px 34px 26px; }
            }
            @media print {
                @page { size:A4; margin:12mm; }
                html, body { margin:0 !important; padding:0 !important; background:#fff !important; overflow:visible !important; }
                .report-print-toolbar, .report-print-actions, .no-print { display:none !important; }
                .report-print-stage { padding:0 !important; margin:0 !important; background:#fff !important; overflow:visible !important; }
                .aprc-pdf-document { width:100% !important; max-width:186mm !important; margin:0 auto !important; padding:0 !important; box-shadow:none !important; border:none !important; border-radius:0 !important; overflow:visible !important; }
                .aprc-pdf-parent-message, .aprc-pdf-score-grid, .aprc-pdf-point-grid, .aprc-pdf-parent-summary { break-inside:avoid !important; page-break-inside:avoid !important; }
                .aprc-pdf-point-grid { display:grid !important; grid-template-columns:minmax(0,1fr) !important; gap:4mm !important; }
                .aprc-pdf-table-panel { break-inside:auto !important; page-break-inside:auto !important; }
                .aprc-section-title { break-after:avoid !important; page-break-after:avoid !important; margin-bottom:7px; }
                .aprc-section-title + p, .aprc-section-title + ol, .aprc-section-title + ul, .aprc-section-title + .aprc-table-wrap, .aprc-section-title + table { break-before:avoid !important; page-break-before:avoid !important; }
                .aprc-pdf-next-plan > .aprc-section-title + ol, .aprc-pdf-next-plan > .aprc-section-title + ul { break-before:avoid !important; page-break-before:avoid !important; }
                .aprc-pdf-document p, .aprc-pdf-document li { orphans:3 !important; widows:3 !important; }
                .aprc-pdf-table { width:100% !important; min-width:0 !important; table-layout:fixed !important; border-collapse:collapse !important; }
                .aprc-pdf-table thead { display:table-header-group !important; }
                .aprc-pdf-table tbody { display:table-row-group !important; }
                .aprc-pdf-table tr { break-inside:avoid !important; page-break-inside:avoid !important; }
            }
        </style>
    `;
}

function reportCenterEnsurePremiumReportStyle() {
    let style = document.getElementById('report-center-premium-report-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'report-center-premium-report-style';
        document.head.appendChild(style);
    }

    const styleShell = reportCenterPremiumReportStyle();
    const styleMatch = String(styleShell).match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    style.textContent = styleMatch ? styleMatch[1] : styleShell;
}

function reportCenterBuildCleanPdfShell(reportHtml) {
    return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AP Math 평가 리포트 PDF</title>
${reportCenterPremiumReportStyle()}
<style>
    @page { size:A4; margin:12mm; }
    html, body { margin:0; padding:0; background:#fff; color:#111827; }
    body { font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; padding:0; overflow:visible; -webkit-overflow-scrolling:touch; }
    @media print {
        html, body { background:#fff !important; margin:0 !important; padding:0 !important; overflow:visible !important; }
        .aprc-pdf-document { width:100% !important; max-width:186mm !important; margin:0 auto !important; padding:0 !important; overflow:visible !important; }
        .aprc-pdf-point-grid { display:grid !important; grid-template-columns:minmax(0,1fr) !important; gap:4mm !important; }
        .aprc-section-title { break-after:avoid !important; page-break-after:avoid !important; margin-bottom:7px; }
        .aprc-section-title + p, .aprc-section-title + ol, .aprc-section-title + ul, .aprc-section-title + .aprc-table-wrap, .aprc-section-title + table { break-before:avoid !important; page-break-before:avoid !important; }
        .aprc-pdf-next-plan > .aprc-section-title + ol, .aprc-pdf-next-plan > .aprc-section-title + ul { break-before:avoid !important; page-break-before:avoid !important; }
        .aprc-pdf-document p, .aprc-pdf-document li { orphans:3 !important; widows:3 !important; }
        .aprc-pdf-table-panel { break-inside:auto !important; page-break-inside:auto !important; }
        .aprc-pdf-table { width:100% !important; min-width:0 !important; table-layout:fixed !important; border-collapse:collapse !important; }
        .aprc-pdf-table thead { display:table-header-group !important; }
        .aprc-pdf-table tbody { display:table-row-group !important; }
        .aprc-pdf-table tr { break-inside:avoid !important; page-break-inside:avoid !important; }
    }
</style>
<script>
    window.__AP_REPORT_PRINT_TRIGGERED = false;
    window.__AP_REPORT_TRIGGER_PRINT = function() {
        if (window.__AP_REPORT_PRINT_TRIGGERED) return;
        window.__AP_REPORT_PRINT_TRIGGERED = true;
        setTimeout(function() {
            try { window.focus(); } catch (e) {}
            window.print();
        }, 200);
    };
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
            displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
        },
        svg: { fontCache: 'global' },
        startup: {
            pageReady: function() {
                return MathJax.startup.defaultPageReady().then(function() {
                    window.__AP_REPORT_TRIGGER_PRINT();
                }).catch(function() {
                    window.__AP_REPORT_TRIGGER_PRINT();
                });
            }
        }
    };
</script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js" onerror="setTimeout(window.__AP_REPORT_TRIGGER_PRINT, 800)"></script>
</head>
<body>
${reportHtml}
<script>
    window.addEventListener('load', function() {
        setTimeout(function() {
            if (!window.__AP_REPORT_PRINT_TRIGGERED) window.__AP_REPORT_TRIGGER_PRINT();
        }, 1200);
    });
</script>
</body>
</html>`;
}

function reportCenterBuildPrintDocument(studentId, sessionId = '', teacherMemo = '') {
    const reportHtml = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState: reportCenterGetMatchingStudioState(studentId, sessionId)
    });
    return reportCenterBuildCleanPdfShell(reportHtml);
}

function reportCenterPrintCleanPdf(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const html = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo: reportCenterGetExamReportTeacherMemo(),
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState: reportCenterGetMatchingStudioState(studentId, sessionId)
    });
    const win = window.open('', '_blank');
    if (!win) {
        toast('팝업 차단을 해제해 주세요.', 'warn');
        return;
    }

    try {
        win.document.open();
        win.document.write(reportCenterBuildCleanPdfShell(html));
        win.document.close();
        try { win.focus(); } catch (e) {}
        toast('PDF 전용 출력 창을 열었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterPrintCleanPdf] failed:', e);
        toast('PDF 출력 창을 여는 중 오류가 발생했습니다.', 'warn');
        try { win.close(); } catch (closeErr) {}
    }
}

function reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    const aiAnalysis = reportCenterGetCachedAiAnalysis(sessionId);
    const trendData = reportCenterGetExamTrendData(studentId, { limit: 5 });
    const wrongRows = Array.isArray(data?.stats?.wrongRows) ? data.stats.wrongRows : [];
    const wrongCount = wrongRows.length;
    const qCount = Number(data?.session?.question_count || 0);
    const correctRate = qCount ? Math.round(((qCount - wrongCount) / qCount) * 100) : null;
    const base = reportCenterBuildBaseReportDraft(studentId, sessionId, teacherMemo);
    const autoTexts = {
        summary: reportCenterBuildSingleExamSummaryText(data, wrongCount),
        trend: reportCenterBuildTrendSummaryText(trendData, aiAnalysis),
        weakness: reportCenterBuildWeaknessSummaryText(trendData, data, aiAnalysis),
        plan: (aiAnalysis ? reportCenterBuildNextPlanItems(data, aiAnalysis) : trendData.finalEvaluation?.nextPlan || []).join('\n'),
        teacherOpinion: reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo, aiAnalysis).slice(0, 2).join('\n\n'),
        parentMessage: base?.parentMessage || '',
        kakaoSummary: reportCenterBuildExamPreview(studentId, sessionId)
    };
    if (correctRate !== null && !autoTexts.summary) autoTexts.summary = `이번 평가는 정답률 ${correctRate}%로 마무리했습니다.`;
    const draft = reportCenterBuildReportDraft(studentId, sessionId, { data, trendData, aiAnalysis, autoTexts });
    return reportCenterGetActiveStudioState(studentId, sessionId, draft);
}

function reportCenterRenderStudioToolbar(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    if (studioState?.isEditMode) {
        return `
            <button class="btn btn-primary" onclick="reportCenterCompleteStudioEdit('${safeStudent}', '${safeSession}')">편집 완료</button>
            <button class="btn" onclick="reportCenterCancelStudioEdit('${safeStudent}', '${safeSession}')">취소</button>
            <button class="btn report-print-premium-btn" onclick="reportCenterApplyStudioAiText('${safeStudent}', '${safeSession}')">AI 문구 적용</button>
            <button class="btn" onclick="reportCenterApplyStudioBasicText('${safeStudent}', '${safeSession}')">기본 문구 적용</button>
            <button class="btn" onclick="reportCenterResetStudioChartData('${safeStudent}', '${safeSession}')">실제 데이터 복구</button>
            <button class="btn report-print-action-print" onclick="reportCenterPrintCleanPdf('${safeStudent}', '${safeSession}')">인쇄하기</button>
        `;
    }
    return `
        <button class="btn report-print-premium-btn" onclick="reportCenterRequestPrintViewAiAnalysis('${safeStudent}', '${safeSession}', this)">프리미엄 분석</button>
        <button class="btn btn-primary" onclick="reportCenterEnterStudioEdit('${safeStudent}', '${safeSession}')">편집</button>
        <button class="btn" onclick="reportCenterResetPrintViewAiAnalysis('${safeStudent}', '${safeSession}')">기본 리포트</button>
        <button class="btn" onclick="reportCenterClosePrintView()">돌아가기</button>
        <button class="btn report-print-action-print" onclick="reportCenterPrintCleanPdf('${safeStudent}', '${safeSession}')">인쇄하기</button>
    `;
}

function reportCenterRenderStudioPanel(studentId, sessionId, studioState) {
    if (!studioState?.isEditMode) return '';
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const activeTab = studioState.activeTab || 'text';
    const tabButton = (tab, label) => `<button type="button" class="${activeTab === tab ? 'is-active' : ''}" onclick="reportCenterSetStudioTab('${safeStudent}', '${safeSession}', '${tab}')">${label}</button>`;
    const body = activeTab === 'chart'
        ? reportCenterRenderStudioChartTab(studentId, sessionId, studioState)
        : activeTab === 'layout'
            ? reportCenterRenderStudioLayoutTab(studentId, sessionId, studioState)
            : reportCenterRenderStudioTextTab(studentId, sessionId, studioState);
    return `
        <aside class="report-studio-panel no-print">
            <div class="report-studio-tabs">
                ${tabButton('text', '문구')}
                ${tabButton('chart', '그래프')}
                ${tabButton('layout', '표/구성')}
            </div>
            <div class="report-studio-body">${body}</div>
        </aside>
    `;
}

function reportCenterRenderStudioTextTab(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    const toneOptions = [
        ['calm_parent', '차분한 학부모용'],
        ['warm_encourage', '따뜻한 격려형'],
        ['analytic', '정확한 분석형'],
        ['kakao_short', '짧은 카톡형']
    ];
    const lengthOptions = [
        ['standard', '표준형'],
        ['detailed', '상세형']
    ];
    const warnings = Object.values(studioState.humanizeWarnings || {}).flat().filter(Boolean);
    const controls = `
        <div class="report-studio-humanize-tools">
            <label class="report-studio-field compact">
                <span>문구 스타일</span>
                <select onchange="reportCenterHandleStudioTextOptionChange('${safeStudent}', '${safeSession}', 'tone', this.value)">
                    ${toneOptions.map(([value, label]) => `<option value="${value}" ${textOptions.tone === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <label class="report-studio-field compact">
                <span>문구 길이</span>
                <select onchange="reportCenterHandleStudioTextOptionChange('${safeStudent}', '${safeSession}', 'length', this.value)">
                    ${lengthOptions.map(([value, label]) => `<option value="${value}" ${textOptions.length === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <div class="report-studio-humanize-actions">
                <button type="button" onclick="reportCenterApplyStudioBasicText('${safeStudent}', '${safeSession}')">기본 문구 다시 적용</button>
                <button type="button" onclick="reportCenterHumanizeStudioBlocks('${safeStudent}', '${safeSession}')">문구 자연스럽게 다듬기</button>
            </div>
            <p>문구 다듬기는 점수·문항번호·단원명은 바꾸지 않고, 표현만 자연스럽게 정리합니다.</p>
            ${warnings.length ? `<div class="report-studio-humanize-warning">${reportCenterEscape(Array.from(new Set(warnings)).slice(0, 3).join(' '))}</div>` : ''}
        </div>
    `;
    const fields = AP_REPORT_STUDIO_BLOCKS.map(([key, label]) => {
        const block = studioState.blocks?.[key] || { label, userText: '', aiText: '', autoText: '' };
        const value = reportCenterStudioResolveBlockText(block);
        return `
            <label class="report-studio-field">
                <span>${reportCenterEscape(block.label || label)}</span>
                <textarea oninput="reportCenterHandleStudioBlockInput('${safeStudent}', '${safeSession}', '${key}', this.value)">${reportCenterEscape(value)}</textarea>
            </label>
        `;
    }).join('');
    return `${controls}${fields}`;
}

function reportCenterRenderStudioLayoutTab(studentId, sessionId, studioState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const options = { ...reportCenterStudioDefaultOptions(), ...(studioState.options || {}) };
    const rows = [
        ['includeTrendGraph', '성적 추이 그래프 포함'],
        ['includeDistributionGraph', '점수 분포 그래프 포함'],
        ['includeWeaknessTrend', '계속 틀린 문제 표 포함'],
        ['includeQuestionAnalysis', '문항별 분석표 포함'],
        ['includeTeacherOpinion', '선생님 종합 의견 포함'],
        ['includeParentMessage', '학부모님께 드리는 말씀 포함'],
        ['includeSignature', '서명란 포함']
    ];
    return rows.map(([key, label]) => `
        <label class="report-studio-check">
            <input type="checkbox" ${options[key] ? 'checked' : ''} onchange="reportCenterHandleStudioOptionChange('${safeStudent}', '${safeSession}', '${key}', this.checked)">
            <span>${label}</span>
        </label>
    `).join('');
}

function reportCenterRenderStudioChartTab(studentId, sessionId, studioState) {
    return [
        reportCenterRenderStudioChartEditor(studentId, sessionId, 'trendChart', studioState.charts?.trendChart || {}),
        reportCenterRenderStudioChartEditor(studentId, sessionId, 'distributionChart', studioState.charts?.distributionChart || {})
    ].join('');
}

function reportCenterRenderStudioChartEditor(studentId, sessionId, chartKey, chartState) {
    const safeStudent = escapeReportJsString(studentId);
    const safeSession = escapeReportJsString(sessionId);
    const isDistribution = chartState.purpose === 'distribution';
    const typeOptions = isDistribution
        ? [['histogram', '히스토그램'], ['frequencyPolygon', '도수분포다각형']]
        : [['line', '꺾은선 그래프'], ['bar', '막대그래프']];
    const rows = (chartState.displayData || []).map((row, index) => `
        <tr>
            <td><input type="checkbox" ${row.visible !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'visible', this.checked)"></td>
            <td><input value="${reportCenterAttr(row.label || row.title || row.date || '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'label', this.value)"></td>
            <td><input type="number" value="${reportCenterAttr(row.score ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'score', this.value)"></td>
            ${isDistribution ? '' : `<td><input type="number" value="${reportCenterAttr(row.classAvg ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'classAvg', this.value)"></td><td><input type="number" value="${reportCenterAttr(row.overallAvg ?? '')}" oninput="reportCenterHandleStudioChartRowChange('${safeStudent}', '${safeSession}', '${chartKey}', ${index}, 'overallAvg', this.value)"></td>`}
            <td><button type="button" onclick="reportCenterResetStudioChartRow('${safeStudent}', '${safeSession}', '${chartKey}', ${index})">복구</button></td>
        </tr>
    `).join('');
    return `
        <section class="report-studio-chart-box">
            <h3>${isDistribution ? '이번 시험 점수 분포' : '최근 성적 추이'}</h3>
            <label class="report-studio-field compact">
                <span>그래프 종류</span>
                <select onchange="reportCenterHandleStudioChartField('${safeStudent}', '${safeSession}', '${chartKey}', 'type', this.value)">
                    ${typeOptions.map(([value, label]) => `<option value="${value}" ${chartState.type === value ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
            </label>
            <div class="report-studio-chart-options">
                ${isDistribution ? `
                    <label>구간 <input type="number" min="1" max="50" value="${reportCenterAttr(chartState.options?.binSize ?? 10)}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'binSize', this.value)"></label>
                ` : `
                    <label><input type="checkbox" ${chartState.options?.showStudentScore !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showStudentScore', this.checked)"> 학생</label>
                    <label><input type="checkbox" ${chartState.options?.showClassAverage !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showClassAverage', this.checked)"> 반 평균</label>
                    <label><input type="checkbox" ${chartState.options?.showTotalAverage ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showTotalAverage', this.checked)"> 전체 평균</label>
                `}
                <label><input type="checkbox" ${chartState.options?.showDataLabels !== false ? 'checked' : ''} onchange="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'showDataLabels', this.checked)"> 점수 라벨 표시</label>
                <label>Y축 최소값 <input type="number" value="${reportCenterAttr(chartState.options?.yMin ?? '')}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'yMin', this.value)"></label>
                <label>Y축 최대값 <input type="number" value="${reportCenterAttr(chartState.options?.yMax ?? '')}" oninput="reportCenterHandleStudioChartOption('${safeStudent}', '${safeSession}', '${chartKey}', 'yMax', this.value)"></label>
            </div>
            <div class="report-studio-table-wrap">
                <table class="report-studio-data-table">
                    <thead><tr><th>표시</th><th>라벨</th><th>점수</th>${isDistribution ? '' : '<th>반 평균</th><th>전체 평균</th>'}<th>복구</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="6">표시할 데이터가 없습니다.</td></tr>'}</tbody>
                </table>
            </div>
        </section>
    `;
}

function reportCenterRerenderPrintShell(studentId, sessionId) {
    const root = document.getElementById('app-root') || document.body;
    const view = document.getElementById('report-print-view');
    const toolbar = view?.querySelector('.report-print-toolbar');
    const shell = view?.querySelector('.report-studio-shell');
    const panelSlot = view?.querySelector('.report-studio-panel-slot');
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (toolbar) toolbar.innerHTML = reportCenterRenderStudioToolbar(studentId, sessionId, studioState);
    if (shell) shell.classList.toggle('is-editing', !!studioState?.isEditMode);
    if (panelSlot) panelSlot.innerHTML = reportCenterRenderStudioPanel(studentId, sessionId, studioState);
    reportCenterRefreshPrintViewReport(studentId, sessionId);
    if (!view && root) reportCenterOpenPrintView(studentId, sessionId);
}

function reportCenterEnterStudioEdit(studentId, sessionId) {
    const teacherMemo = reportCenterSyncPrintMemoToCenter();
    const studioState = reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo);
    studioState.snapshot = reportCenterCloneStudioValue({ ...studioState, snapshot: null });
    studioState.isEditMode = true;
    studioState.activeTab = studioState.activeTab || 'text';
    window.AP_REPORT_STUDIO_STATE = studioState;
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterCompleteStudioEdit(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState) {
        studioState.isEditMode = false;
        studioState.snapshot = null;
    }
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterCancelStudioEdit(studentId, sessionId) {
    const current = window.AP_REPORT_STUDIO_STATE;
    window.AP_REPORT_STUDIO_STATE = current?.snapshot
        ? reportCenterCloneStudioValue(current.snapshot)
        : reportCenterCreateStudioStateForPrintView(studentId, sessionId, reportCenterGetExamReportTeacherMemo());
    if (window.AP_REPORT_STUDIO_STATE) {
        window.AP_REPORT_STUDIO_STATE.isEditMode = false;
        window.AP_REPORT_STUDIO_STATE.snapshot = null;
    }
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterSetStudioTab(studentId, sessionId, tab) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState && ['text', 'chart', 'layout'].includes(tab)) studioState.activeTab = tab;
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterHandleStudioBlockInput(studentId, sessionId, blockKey, value) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const block = studioState?.blocks?.[blockKey];
    if (!block) return;
    block.userText = String(value || '');
    block.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioOptionChange(studentId, sessionId, key, checked) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    studioState.options = { ...reportCenterStudioDefaultOptions(), ...(studioState.options || {}), [key]: !!checked };
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioTextOptionChange(studentId, sessionId, key, value) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    const current = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}) };
    if (key === 'tone' && !['calm_parent', 'warm_encourage', 'analytic', 'kakao_short'].includes(value)) return;
    if (key === 'length' && !['standard', 'detailed'].includes(value)) return;
    studioState.textOptions = { ...current, [key]: value };
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterApplyHumanizedTextToBlock(blockKey, text, options = {}) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const block = studioState?.blocks?.[blockKey];
    if (!block) return '';
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}), ...options, blockKey };
    const polished = reportCenterHumanizeKoreanText(text, textOptions);
    block.userText = polished;
    block.isDirty = true;
    studioState.humanizeWarnings = {
        ...(studioState.humanizeWarnings || {}),
        [blockKey]: reportCenterBuildHumanizeWarnings(polished, textOptions)
    };
    return polished;
}

function reportCenterApplyHumanizedTextToAllBlocks(options = {}) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState?.blocks) return { changed: 0, warnings: [] };
    studioState.snapshot = reportCenterCloneStudioValue({ ...studioState, snapshot: null });
    const textOptions = { ...reportCenterDefaultTextOptions(), ...(studioState.textOptions || {}), ...options };
    let changed = 0;
    const warnings = [];
    Object.entries(studioState.blocks).forEach(([blockKey, block]) => {
        const currentText = reportCenterStudioResolveBlockText(block);
        const polished = reportCenterHumanizeKoreanText(currentText, { ...textOptions, blockKey, includeDirty: true });
        block.userText = polished;
        block.isDirty = true;
        if (polished !== String(currentText || '').trim()) changed += 1;
        const blockWarnings = reportCenterBuildHumanizeWarnings(polished, { ...textOptions, blockKey });
        if (blockWarnings.length) warnings.push(...blockWarnings);
        studioState.humanizeWarnings = { ...(studioState.humanizeWarnings || {}), [blockKey]: blockWarnings };
    });
    return { changed, warnings };
}

function reportCenterHumanizeStudioBlocks(studentId, sessionId) {
    const result = reportCenterApplyHumanizedTextToAllBlocks({ includeDirty: true });
    reportCenterRerenderPrintShell(studentId, sessionId);
    if (typeof toast === 'function') {
        toast(
            result.changed ? '문구를 자연스럽게 다듬었습니다. 점수와 문항 정보는 변경하지 않았습니다.' : '크게 다듬을 표현이 없습니다.',
            result.changed ? 'success' : 'info'
        );
    }
}

function reportCenterApplyStudioAiText(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    Object.values(studioState.blocks || {}).forEach(block => {
        block.userText = String(block.aiText || '');
        block.isDirty = !!block.userText;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterApplyStudioBasicText(studentId, sessionId) {
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (!studioState) return;
    Object.values(studioState.blocks || {}).forEach(block => {
        block.userText = String(block.autoText || '');
        block.isDirty = !!block.userText;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterNumberOrNull(value) {
    if (value === '' || value === null || value === undefined) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

function reportCenterHandleStudioChartField(studentId, sessionId, chartKey, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart) return;
    chart[key] = value;
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioChartOption(studentId, sessionId, chartKey, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart) return;
    chart.options = { ...(chart.options || {}), [key]: typeof value === 'boolean' ? value : reportCenterNumberOrNull(value) };
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterHandleStudioChartRowChange(studentId, sessionId, chartKey, index, key, value) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    const row = chart?.displayData?.[index];
    if (!row) return;
    row[key] = key === 'visible' ? !!value : ['score', 'classAvg', 'overallAvg'].includes(key) ? reportCenterNumberOrNull(value) : String(value || '');
    chart.isDirty = true;
    reportCenterRefreshPrintViewReport(studentId, sessionId);
}

function reportCenterResetStudioChartRow(studentId, sessionId, chartKey, index) {
    const chart = window.AP_REPORT_STUDIO_STATE?.charts?.[chartKey];
    if (!chart?.sourceData?.[index]) return;
    chart.displayData[index] = reportCenterCloneStudioValue(chart.sourceData[index]);
    chart.isDirty = JSON.stringify(chart.displayData) !== JSON.stringify(chart.sourceData);
    reportCenterRerenderPrintShell(studentId, sessionId);
}

function reportCenterResetStudioChartData(studentId, sessionId) {
    const charts = window.AP_REPORT_STUDIO_STATE?.charts || {};
    Object.values(charts).forEach(chart => {
        chart.displayData = reportCenterCloneStudioValue(chart.sourceData) || [];
        chart.isDirty = false;
    });
    reportCenterRerenderPrintShell(studentId, sessionId);
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
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('출력할 평가 기록이 없습니다.', 'warn');
        return;
    }

    const teacherMemo = reportCenterGetExamReportTeacherMemo();
    reportCenterEnsurePremiumReportStyle();
    const studioState = reportCenterCreateStudioStateForPrintView(studentId, sessionId, teacherMemo);
    const reportHtml = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState
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
                ${reportCenterRenderStudioToolbar(studentId, sessionId, studioState)}
            </div>
            <div class="report-studio-shell ${studioState.isEditMode ? 'is-editing' : ''}">
                <div class="report-print-stage">
                    ${reportHtml}
                </div>
                <div class="report-studio-panel-slot">
                    ${reportCenterRenderStudioPanel(studentId, sessionId, studioState)}
                </div>
            </div>
        </div>
    `;
    const printStage = root.querySelector('.report-print-stage');
    if (printStage) {
        printStage.innerHTML = `<div id="report-print-document-root">${reportHtml}</div>`;
    }
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';

    reportCenterInjectPrintViewStyle();
    window.scrollTo(0, 0);
}

function reportCenterSyncPrintMemoToCenter() {
    const printMemo = document.getElementById('report-print-teacher-memo');
    const memo = printMemo
        ? String(printMemo.value || '').trim()
        : reportCenterGetExamReportTeacherMemo();
    window.AP_REPORT_PENDING_TEACHER_MEMO = memo;
    const centerMemo = document.getElementById('report-center-exam-teacher-memo');
    if (centerMemo) centerMemo.value = memo;
    return memo;
}

function reportCenterRefreshPrintViewReport(studentId, sessionId = '') {
    const root = document.getElementById('report-print-document-root') || document.querySelector('.report-print-stage');
    if (!root) return;
    reportCenterEnsurePremiumReportStyle();
    reportCenterInjectPrintViewStyle();
    const teacherMemo = reportCenterSyncPrintMemoToCenter();
    root.innerHTML = reportCenterBuildCleanPdfDocument(studentId, sessionId, {
        teacherMemo,
        aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId),
        studioState: reportCenterGetMatchingStudioState(studentId, sessionId)
    });
}

function reportCenterHandlePrintViewMemoInput(studentId, sessionId = '') {
    reportCenterSyncPrintMemoToCenter();
    clearTimeout(window.AP_REPORT_PRINT_MEMO_TIMER);
    window.AP_REPORT_PRINT_MEMO_TIMER = setTimeout(() => {
        reportCenterRefreshPrintViewReport(studentId, sessionId);
    }, 180);
}

async function reportCenterRequestPrintViewAiAnalysis(studentId, sessionId, buttonEl = null) {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('정리할 평가 기록이 없습니다.', 'warn');
        return;
    }

    reportCenterSyncPrintMemoToCenter();
    const payload = reportCenterBuildExamAiPayload(studentId, sessionId);
    payload.teacherMemo = reportCenterGetExamReportTeacherMemo();
    payload.generatedFrom = 'AP_MATH_OS_REPORT_CENTER_PRINT_VIEW';

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
            reportCenterRefreshPrintViewReport(studentId, sessionId);
            const warning = reportCenterTrimText(r.warning || r.message || r.error || '분석 결과가 기준에 맞지 않았습니다.', 140);
            console.warn('[reportCenterRequestPrintViewAiAnalysis] fallback ignored:', r);
            toast(`분석 결과가 기준에 맞지 않아 기본 리포트를 유지합니다. ${warning}`, 'warn');
            return;
        }
        const analysis = reportCenterNormalizeAiAnalysis(r.analysis || r.data || r);
        analysis.source = 'ai';
        reportCenterSetCachedAiAnalysis(sessionId, analysis);
        if (window.AP_REPORT_STUDIO_STATE) {
            reportCenterMergeAiAnalysisIntoStudioState(window.AP_REPORT_STUDIO_STATE, analysis);
        }
        reportCenterRefreshPrintViewReport(studentId, sessionId);
        toast('리포트 문장이 정리되어 반영되었습니다.', 'success');
    } catch (e) {
        console.error('[reportCenterRequestPrintViewAiAnalysis] failed:', e);
        toast('프리미엄 분석에 실패했습니다. 기본 리포트를 유지합니다.', 'warn');
    } finally {
        if (typeof setButtonBusy === 'function' && buttonEl) setButtonBusy(buttonEl, false);
    }
}

function reportCenterResetPrintViewAiAnalysis(studentId, sessionId = '') {
    reportCenterSyncPrintMemoToCenter();
    reportCenterClearCachedAiAnalysis(sessionId);
    const studioState = window.AP_REPORT_STUDIO_STATE;
    if (studioState?.blocks) {
        Object.values(studioState.blocks).forEach(block => {
            block.aiText = '';
            if (!block.isDirty) block.userText = '';
        });
        studioState.mode = 'basic';
    }
    reportCenterRefreshPrintViewReport(studentId, sessionId);
    toast('기본 리포트 문구로 복귀했습니다.', 'success');
}

function reportCenterClosePrintView() {
    const ret = window.AP_REPORT_PRINT_RETURN || {};
    const memo = reportCenterSyncPrintMemoToCenter();

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
        setTimeout(() => {
            const centerMemo = document.getElementById('report-center-exam-teacher-memo');
            if (centerMemo) {
                centerMemo.value = memo;
                reportCenterRefreshPremiumExamPreview(ret.studentId, ret.sessionId || '');
            }
            if (Number.isFinite(Number(ret.scrollY))) window.scrollTo(0, Number(ret.scrollY));
        }, 160);
    }, 100);
}

function reportCenterInjectPrintViewStyle() {
    let style = document.getElementById('report-print-view-style');
    if (!style) {
        style = document.createElement('style');
        style.id = 'report-print-view-style';
        document.head.appendChild(style);
    }

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
            flex-wrap:wrap;
            gap:8px;
            justify-content:space-between;
            align-items:center;
            max-width:190mm;
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
            flex:0 0 auto;
            min-width:104px;
        }

        .report-print-toolbar .report-print-action-print {
            margin-left:auto;
        }

        .report-print-toolbar .report-print-premium-btn {
            background:linear-gradient(135deg,#6d28d9,#2563eb);
            color:#fff;
            border-color:transparent;
            box-shadow:0 10px 22px rgba(37,99,235,.22);
        }

        .report-print-toolbar .report-print-premium-btn:hover {
            filter:brightness(1.03);
        }

        .report-print-control-panel {
            max-width:190mm;
            margin:0 auto 14px;
            padding:12px;
            background:#ffffff;
            border:1px solid var(--border);
            border-radius:14px;
            box-sizing:border-box;
        }

        .report-print-control-panel label {
            display:block;
            margin-bottom:7px;
            color:#334155;
            font-size:12px;
            font-weight:800;
        }

        .report-print-control-panel textarea {
            width:100%;
            min-height:76px;
            padding:12px;
            border:1px solid var(--border);
            border-radius:12px;
            background:var(--surface);
            color:var(--text);
            box-sizing:border-box;
            resize:vertical;
            font:inherit;
            font-size:13px;
            line-height:1.55;
        }

        .report-print-stage {
            width:100%;
            overflow-x:auto;
            -webkit-overflow-scrolling:touch;
            padding-bottom:24px;
        }

        .report-studio-shell {
            display:block;
            max-width:100%;
        }

        .report-studio-shell.is-editing {
            display:grid;
            grid-template-columns:minmax(0,1fr) minmax(320px,380px);
            gap:14px;
            align-items:start;
        }

        .report-studio-shell.is-editing .report-print-stage .aprc-pdf-document {
            margin:0 0 0 auto;
        }

        .report-studio-panel-slot {
            min-width:0;
        }

        .report-studio-panel {
            position:sticky;
            top:76px;
            max-height:calc(100vh - 92px);
            overflow:auto;
            padding:12px;
            border:1px solid #cbd5e1;
            border-radius:8px;
            background:#ffffff;
            box-shadow:0 16px 38px rgba(15,23,42,.14);
        }

        .report-studio-tabs {
            display:grid;
            grid-template-columns:repeat(3,minmax(0,1fr));
            gap:6px;
            margin-bottom:12px;
        }

        .report-studio-tabs button,
        .report-studio-data-table button {
            min-height:34px;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#f8fafc;
            color:#334155;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .report-studio-tabs button.is-active {
            background:#0f766e;
            border-color:#0f766e;
            color:#ffffff;
        }

        .report-studio-field {
            display:block;
            margin-bottom:12px;
        }

        .report-studio-humanize-tools {
            margin-bottom:14px;
            padding:10px;
            border:1px solid #e2e8f0;
            border-radius:8px;
            background:#f8fafc;
        }

        .report-studio-humanize-actions {
            display:grid;
            grid-template-columns:1fr 1fr;
            gap:6px;
            margin:8px 0;
        }

        .report-studio-humanize-actions button {
            min-height:34px;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#ffffff;
            color:#0f172a;
            font-size:12px;
            font-weight:800;
            cursor:pointer;
        }

        .report-studio-humanize-tools p,
        .report-studio-humanize-warning {
            margin:6px 0 0;
            color:#64748b;
            font-size:11px;
            font-weight:700;
            line-height:1.45;
        }

        .report-studio-humanize-warning {
            color:#b45309;
        }

        .report-studio-field.compact {
            margin-bottom:8px;
        }

        .report-studio-field > span {
            display:block;
            margin-bottom:6px;
            color:#0f172a;
            font-size:12px;
            font-weight:850;
        }

        .report-studio-field textarea,
        .report-studio-field select,
        .report-studio-data-table input,
        .report-studio-chart-options input {
            width:100%;
            border:1px solid #cbd5e1;
            border-radius:6px;
            background:#ffffff;
            color:#0f172a;
            box-sizing:border-box;
            font:inherit;
            font-size:12px;
        }

        .report-studio-field textarea {
            min-height:86px;
            padding:9px;
            resize:vertical;
            line-height:1.5;
        }

        .report-studio-field select {
            min-height:36px;
            padding:0 8px;
        }

        .report-studio-check {
            display:flex;
            align-items:center;
            gap:8px;
            min-height:38px;
            border-bottom:1px solid #e2e8f0;
            color:#334155;
            font-size:13px;
            font-weight:750;
        }

        .report-studio-check input {
            width:16px;
            height:16px;
        }

        .report-studio-chart-box {
            margin-bottom:14px;
            padding-bottom:14px;
            border-bottom:1px solid #e2e8f0;
        }

        .report-studio-chart-box h3 {
            margin:0 0 10px;
            color:#0f172a;
            font-size:14px;
            font-weight:900;
        }

        .report-studio-chart-options {
            display:grid;
            grid-template-columns:repeat(2,minmax(0,1fr));
            gap:7px;
            margin:8px 0 10px;
            color:#334155;
            font-size:12px;
            font-weight:750;
        }

        .report-studio-chart-options label {
            display:flex;
            align-items:center;
            gap:6px;
        }

        .report-studio-chart-options input[type="checkbox"] {
            width:15px;
            height:15px;
        }

        .report-studio-table-wrap {
            overflow:auto;
            border:1px solid #e2e8f0;
            border-radius:8px;
        }

        .report-studio-data-table {
            width:100%;
            min-width:520px;
            border-collapse:collapse;
            table-layout:fixed;
            font-size:11px;
        }

        .report-studio-data-table th,
        .report-studio-data-table td {
            padding:5px;
            border-bottom:1px solid #e2e8f0;
            text-align:left;
            vertical-align:middle;
        }

        .report-studio-data-table th {
            background:#f8fafc;
            color:#475569;
            font-weight:850;
        }

        .report-studio-data-table input {
            min-height:30px;
            padding:0 6px;
        }

        .report-print-stage .aprc-pdf-document {
            width:190mm;
            min-width:190mm;
            max-width:190mm;
            margin:0 auto;
            background:#fff;
            padding:8mm 9mm;
            box-sizing:border-box;
        }

        .report-print-stage .aprc-pdf-header {
            display:grid;
            grid-template-columns:minmax(0,1fr) 40mm;
            align-items:start;
            column-gap:10mm;
            padding:10mm 0 8mm;
        }

        .report-print-stage .aprc-pdf-header > div:first-child {
            min-width:0;
            padding-right:0;
        }

        .report-print-stage .aprc-pdf-header .aprc-title {
            line-height:1.25;
        }

        .report-print-stage .aprc-pdf-header .aprc-subtitle {
            line-height:1.45;
        }

        .report-print-stage .aprc-pdf-header .aprc-signature-boxes {
            padding-top:0;
            min-width:40mm;
            width:40mm;
            grid-template-rows:6mm 20mm;
            justify-self:end;
        }

        .report-print-stage .aprc-pdf-header .aprc-signature-cells > div {
            height:20mm;
        }

        .report-print-stage .aprc-pdf-student-band {
            display:grid;
            grid-template-columns:minmax(0,1fr) minmax(38mm,72mm);
            align-items:center;
            column-gap:8mm;
            margin-top:8mm;
            padding-top:5mm;
        }

        .report-print-stage .aprc-pdf-student-band > div:first-child {
            min-width:0;
        }

        .report-print-stage .aprc-exam-meta {
            text-align:right;
            max-width:none;
            word-break:keep-all;
            overflow-wrap:break-word;
        }

        @media (max-width:840px) {
            .report-print-view { padding:10px; }
            .report-print-toolbar { margin-bottom:10px; }
            .report-studio-shell.is-editing { display:block; }
            .report-studio-panel { position:relative; top:auto; max-height:none; margin-top:12px; }
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
                overflow:visible !important;
            }

            .report-print-view {
                padding:0 !important;
                background:#fff !important;
            }

            .report-print-stage {
                overflow:visible !important;
                background:#fff !important;
                padding:0 !important;
            }

            .report-print-stage .aprc-pdf-document {
                width:100% !important;
                max-width:186mm !important;
                margin:0 auto !important;
                padding:0 !important;
            }

            @page {
                size:A4;
                margin:12mm;
            }
        }
    `;
}

function reportCenterCopyExamKakaoSummary(studentId, sessionId = '') {
    const data = reportCenterGetExamReportData(studentId, sessionId);
    if (!data.student || !data.session) {
        toast('복사할 평가 기록이 없습니다.', 'warn');
        return;
    }
    const studioState = window.AP_REPORT_STUDIO_STATE;
    const matchingStudioState = studioState
        && String(studioState.studentId || '') === String(studentId || '')
        && String(studioState.sessionId || '') === String(sessionId || '')
        ? studioState
        : null;
    const kakaoBlock = matchingStudioState?.blocks?.kakaoSummary;
    let text;
    let usesStudioKakao = false;
    if (kakaoBlock?.isDirty) {
        text = String(kakaoBlock.userText ?? '');
        usesStudioKakao = true;
    } else {
        const studioKakao = reportCenterStudioResolveBlockText(kakaoBlock);
        if (studioKakao) {
            text = studioKakao;
            usesStudioKakao = true;
        }
    }
    const aiAnalysis = reportCenterGetAiAnalysisForReport(sessionId);
    if (text === undefined) text = aiAnalysis?.kakaoSummary || reportCenterBuildExamPreview(studentId, sessionId);
    if (!String(text || '').trim()) {
        toast('복사할 카톡 문구가 없습니다.', 'warn');
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        toast(usesStudioKakao || aiAnalysis?.kakaoSummary ? '정리된 카톡 요약문이 복사되었습니다.' : '카톡 요약문이 복사되었습니다.', 'success');
    }).catch(() => {
        toast('복사에 실패했습니다.', 'warn');
    });
}

function reportCenterRefreshPremiumExamPreview(studentId, sessionId = '') {
    const root = document.getElementById('report-center-premium-preview');
    if (!root) return;

    reportCenterEnsurePremiumReportStyle();

    root.innerHTML = reportCenterBuildPremiumExamReportHtml(studentId, sessionId, { teacherMemo: reportCenterGetExamReportTeacherMemo(), aiAnalysis: reportCenterGetCachedAiAnalysis(sessionId) });
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
                출력용 리포트는 A4 자연 흐름형 PDF로 저장/인쇄합니다. 브라우저가 페이지를 나누되, 표와 주요 안내 문구가 중간에서 잘리지 않도록 구성됩니다.
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
                <button type="button" class="btn btn-primary" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px;" onclick="reportCenterOpenPrintView('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}', event)">리포트보기/프리미엄분석</button>
                <button class="btn" style="min-height:46px; font-size:13px; font-weight:700; border-radius:12px; background:var(--surface); border:1px solid var(--border); color:var(--primary);" onclick="reportCenterCopyExamKakaoSummary('${escapeReportJsString(studentId)}', '${escapeReportJsString(selectedId)}')">카톡 요약 복사</button>
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

    const trendData = reportCenterGetExamTrendData(sid, { limit: 4 });
    const sessions = reportCenterGetSortedStudentExamSessions(sid).slice(0, 4);

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
        trendData, att: att?.status || null, hw: hw?.status || null,
        scoreDiff, correctRate, qCount
    };

    showParentReportModal(ctx);
}

function showParentReportModal(ctx) {
    const { student, className, latest, sessions, classAvg, recentAvg,
            wrongAnswers, weakUnits, trendData: suppliedTrendData, att, hw, scoreDiff, correctRate, qCount } = ctx;

    const dateStr = String(latest.exam_date || '').replace(/-/g, '.');
    const trendData = suppliedTrendData || reportCenterGetExamTrendData(student.id, { limit: Math.max(4, sessions?.length || 0) });
    const trendScores = trendData.selectedSessions.map(e => e.score).filter(Number.isFinite);

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
    if (typeof loadHtml2CanvasOnce === 'function' && typeof window.html2canvas === 'undefined') {
        try { await loadHtml2CanvasOnce(); } catch (e) { /* 아래 공통 안내로 처리 */ }
    }
    const html2canvasFn = window.html2canvas || (typeof html2canvas !== 'undefined' ? html2canvas : null);
    const saveBtn = document.getElementById('report-save-btn');

    if (!card || !html2canvasFn) {
        toast('이미지 저장 기능을 불러오지 못했습니다.', 'warn');
        return;
    }
    try {
        if (saveBtn) saveBtn.disabled = true;
        toast('이미지 생성 중...', 'info');
        const canvas = await html2canvasFn(card, {
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
        console.warn('[saveParentReportImage] html2canvas failed:', e);
        toast('이미지 저장에 실패했습니다.', 'warn');
    } finally {
        if (saveBtn) saveBtn.disabled = false;
    }
}

function reportCenterGetExamTrendData(studentId, options = {}) {
    const parsedLimit = Number(options?.limit);
    const limit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? Math.floor(parsedLimit) : 5;
    const recentSessions = reportCenterGetSortedStudentExamSessions(studentId).slice(0, limit);
    const selectedSessions = recentSessions.slice().reverse().map(session => {
        const stats = reportCenterBuildQuestionStats(session);
        const questionCount = Number(session.question_count || 0);
        const wrongCount = reportCenterGetWrongIds(session.id).length;
        return {
            id: session.id,
            date: session.exam_date || '',
            title: session.exam_title || '평가',
            score: Number.isFinite(Number(session.score)) ? Number(session.score) : null,
            questionCount,
            wrongCount,
            correctRate: questionCount ? Math.round(((questionCount - wrongCount) / questionCount) * 100) : null,
            overallAvg: stats.overallAvg !== null && stats.overallAvg !== undefined && Number.isFinite(Number(stats.overallAvg)) ? Number(stats.overallAvg) : null,
            classAvg: stats.classAvg !== null && stats.classAvg !== undefined && Number.isFinite(Number(stats.classAvg)) ? Number(stats.classAvg) : null
        };
    });
    const scores = selectedSessions.map(row => row.score).filter(Number.isFinite);
    const firstScore = scores.length ? scores[0] : null;
    const latestScore = scores.length ? scores[scores.length - 1] : null;
    const scoreDelta = firstScore !== null && latestScore !== null ? latestScore - firstScore : null;
    const changes = scores.slice(1).map((score, index) => score - scores[index]);
    let direction = 'flat';
    if (changes.length) {
        const hasUp = changes.some(value => value > 0);
        const hasDown = changes.some(value => value < 0);
        direction = hasUp && hasDown ? 'mixed' : hasUp ? 'up' : hasDown ? 'down' : 'flat';
    }

    const latestSessionId = selectedSessions[selectedSessions.length - 1]?.id;
    const latestWrongUnits = new Set();
    const weaknessMap = new Map();
    selectedSessions.forEach(row => {
        const seenInSession = new Set();
        const rawSession = recentSessions.find(session => String(session.id) === String(row.id)) || { id: row.id };
        reportCenterBuildWrongSummary(rawSession).forEach(item => {
            const unitKey = String(item.unitKey || item.unit || '').trim();
            if (!unitKey) return;
            const unit = String(item.unit || item.unitKey || '').trim();
            const mapItem = weaknessMap.get(unitKey) || {
                unitKey,
                unit,
                wrongCount: 0,
                appearedInSessions: 0,
                lastSeenDate: '',
                resolved: false
            };
            mapItem.wrongCount += 1;
            if (!seenInSession.has(unitKey)) {
                mapItem.appearedInSessions += 1;
                seenInSession.add(unitKey);
            }
            if (String(row.date || '') >= String(mapItem.lastSeenDate || '')) mapItem.lastSeenDate = row.date || '';
            weaknessMap.set(unitKey, mapItem);
            if (String(row.id) === String(latestSessionId)) latestWrongUnits.add(unitKey);
        });
    });
    const weaknessTrend = Array.from(weaknessMap.values())
        .map(item => ({ ...item, resolved: !latestWrongUnits.has(item.unitKey) }))
        .sort((a, b) => b.appearedInSessions - a.appearedInSessions || b.wrongCount - a.wrongCount || String(b.lastSeenDate).localeCompare(String(a.lastSeenDate)));

    const finalSession = selectedSessions[selectedSessions.length - 1] || null;
    const averageScore = scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null;
    const recentAverage = scores.length
        ? Math.round(scores.slice(-Math.min(3, scores.length)).reduce((sum, value) => sum + value, 0) / Math.min(3, scores.length))
        : null;
    const trendComment = selectedSessions.length < 2
        ? (selectedSessions.length === 1 ? '첫 평가 기록입니다.' : '평가 추이를 계산할 기록이 없습니다.')
        : direction === 'up'
            ? `첫 평가보다 최근 평가가 ${Math.abs(scoreDelta)}점 상승했습니다.`
            : direction === 'down'
                ? `첫 평가보다 최근 평가가 ${Math.abs(scoreDelta)}점 하락했습니다.`
                : direction === 'mixed'
                    ? `최근 ${selectedSessions.length}회 점수가 오르내리는 혼합 흐름입니다.`
                    : `최근 ${selectedSessions.length}회 점수가 같은 수준을 유지하고 있습니다.`;
    let scorePosition = '동일 평가 비교 자료가 부족합니다.';
    if (finalSession && Number.isFinite(finalSession.score)) {
        if (Number.isFinite(finalSession.overallAvg)) {
            const diff = finalSession.score - finalSession.overallAvg;
            scorePosition = `최종 평가는 전체 평균보다 ${Math.abs(diff)}점 ${diff >= 0 ? '높습니다' : '낮습니다'}.`;
        } else if (Number.isFinite(finalSession.classAvg)) {
            const diff = finalSession.score - finalSession.classAvg;
            scorePosition = `최종 평가는 반 평균보다 ${Math.abs(diff)}점 ${diff >= 0 ? '높습니다' : '낮습니다'}.`;
        }
    }
    const activeWeaknesses = weaknessTrend.filter(item => !item.resolved).slice(0, 2);
    const nextPlan = activeWeaknesses.length
        ? [
            `${activeWeaknesses.map(item => item.unit).join(', ')} 단원의 핵심 개념을 다시 확인합니다.`,
            '최종 평가의 우선 문항을 재풀이합니다.',
            '같은 유형의 유사 문항으로 풀이 순서를 안정화합니다.',
            '검산 결과를 오답노트에 짧게 남깁니다.'
        ]
        : ['최종 평가의 핵심 문항을 다시 확인합니다.', '심화 유사 문항으로 현재 흐름을 확장합니다.', '검산 과정을 짧게 기록합니다.'];

    return {
        selectedSessions,
        trend: {
            firstScore,
            latestScore,
            scoreDelta,
            direction,
            bestScore: scores.length ? Math.max(...scores) : null,
            worstScore: scores.length ? Math.min(...scores) : null,
            averageScore,
            recentAverage,
            hasMultipleSessions: selectedSessions.length >= 2
        },
        weaknessTrend,
        finalSession,
        finalEvaluation: { scorePosition, trendComment, nextPlan }
    };
}

window.copyReport = copyReportLegacy;
