/**
 * AP Math OS 1.0 [js/report-text.js]
 * 레거시 텍스트 리포트 + 공유 상수/humanize 유틸 (분할: report-text → report-center → report-print)
 */
/**
 * AP Math OS 1.0 [js/report.js]
 * 보고 문구 생성 및 AI 연동 엔진
 * [IRONCLAD 5G]&#58; 고급 발송 문구 / 미리보기 후 최종 복사 / Top Action 모달 적용
 */

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

/**
 * 확정 문구 bank.
 * 코드가 임의로 prose를 만들지 않고, 여기 확정된 쉬운말 문장을 골라 {슬롯}만 채운다.
 * 슬롯: {qNo}=문항번호, {unit}=단원명. 정규식 정화기를 거치지 않아도 깨지지 않는 완성 문장만 둔다.
 */
const REPORT_WRONGCARE_FLOW = ['재풀이', '유사문항 복습', '반복 오답 관리', '시험 전 재확인'];

const REPORT_COPY_BANK = {
    // 문항별 코멘트(정답률 구간별) — 전문체. unit이 없으면 '해당 단원'으로 대체된다.
    // short = 표 '해석' 칸용 짧은 진단(명사구), cards = 코멘트 카드용 문장(꼬리가 겹치지 않게 변형).
    remediation: {
        withWrong: '이번 오답은 {labels}에서 주로 나왔습니다. 다음 수업과 보강에서 해당 부분을 다시 짚고, 개념을 정리한 뒤 같은 유형의 문제로 충분히 연습해 확실히 넘어가도록 하겠습니다.',
        noWrong: '이번 시험은 오답이 없어, 다음 단원과 한 단계 높은 난도의 문제로 학습 범위를 넓혀가겠습니다. 자주 실수가 나오는 유형은 미리 점검하며 안정적으로 이어가겠습니다.'
    },
    wrongCare: {
        line1: '오답 문항은 다음 수업과 보강에서 다시 풀이한 뒤, 같은 유형의 문제로 한 번 더 복습해 확실히 익히도록 하겠습니다.',
        line2: '반복해서 틀리는 단원은 따로 모아 관리하고, 다음 시험 전에 다시 점검해 같은 실수가 반복되지 않도록 책임지고 챙기겠습니다.',
        noWrong: '이번 시험은 오답이 없어 따로 재풀이할 문항은 없습니다. 다음 단원에서도 자주 틀리는 유형은 미리 점검하며 안정적으로 이어가겠습니다.'
    },
    questionInsight: {
        easy: {      // 정답률 ≥85 (다들 맞히는 문제를 놓침 → 실수 가능성)
            short: '계산·검산 점검',
            cards: [
                '{qNo}번 문항은 {unit}에서 많이들 맞히는 기본 유형입니다. 개념보다 계산이나 마무리에서 놓친 부분이 없는지 함께 점검하겠습니다.',
                '{qNo}번 문항은 {unit} 기본 유형이라, 풀이 방법보다 검산 습관을 한 번 더 챙겨 같은 실수가 없도록 잡아 주겠습니다.'
            ]
        },
        mid: {       // 65~85
            short: '풀이 순서 정리',
            cards: [
                '{qNo}번 문항은 {unit}을 풀이에 적용하는 문제로, 방향은 맞았는데 중간에서 한 번 막혔습니다. 다음 수업에서 풀이 순서를 함께 정리하겠습니다.',
                '{qNo}번 문항은 {unit} 응용 단계입니다. 접근은 좋았던 만큼, 중간 조건을 연결하는 과정을 같이 짚어 마무리까지 잡아 주겠습니다.'
            ]
        },
        hard: {      // 45~65
            short: '조건 해석·식 세우기',
            cards: [
                '{qNo}번 문항은 {unit}에서 조건을 식으로 바꾸는 부분이 까다로운 문제입니다. 다음 수업에서 조건 정리와 풀이 순서를 단계별로 함께 보겠습니다.',
                '{qNo}번 문항은 {unit} 응용 문제로, 문제의 조건을 식으로 옮기는 단계가 핵심입니다. 그 과정을 천천히 다시 짚어 주겠습니다.'
            ]
        },
        veryHard: {  // <45
            short: '개념부터 재정리',
            cards: [
                '{qNo}번 문항은 {unit}에서 특히 어려워했던 문제입니다. 조급하지 않게 기본 개념부터 다시 잡고, 비슷한 문제로 차근차근 적용해 보겠습니다.',
                '{qNo}번 문항은 {unit} 심화 유형으로 정답률이 낮았습니다. 개념을 다시 정리한 뒤 같은 유형으로 충분히 연습해 자신감을 붙여 주겠습니다.'
            ]
        },
        unknown: {   // 정답률 자료 없음
            short: '재점검 문항',
            cards: [
                '{qNo}번 문항은 {unit}에서 한 번 더 봐야 할 문제입니다. 다음 수업에서 풀이 과정을 함께 확인하겠습니다.',
                '{qNo}번 문항은 {unit} 관련 문제로, 다음 수업에서 풀이 과정을 같이 짚어 보겠습니다.'
            ]
        }
    }
};

function reportCopyFillSlots(template, slots = {}) {
    return String(template || '').replace(/\{(\w+)\}/g, (m, key) => {
        const v = slots[key];
        return (v === undefined || v === null || v === '') ? '' : String(v);
    }).replace(/\s{2,}/g, ' ').trim();
}

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
        .replace(/학습 성취도/g, '학습 상태')
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
        .replace(/보완할 지점이 확인되어/g, '다시 점검할 부분이 있어')
        .replace(/보완 방향을 잡을 수 있습니다/g, '다음 수업에서 점검할 부분을 정하겠습니다')
        .replace(/보완이 필요합니다/g, '다시 점검하겠습니다')
        .replace(/추가 확인이 필요한 문항/g, '함께 확인할 문항')
        .replace(/관리할 지점/g, '점검할 부분')
        .replace(/심화 응용 문제로 학습 폭을 넓혀가겠습니다|학습 폭을 넓혀가겠습니다|학습 폭을 넓히겠습니다|학습 폭/g, '학습 범위를 넓혀가겠습니다')
        .replace(/자연스럽게 확장하겠습니다|자연스럽게 확장/g, '점진적으로 넓혀가겠습니다')
        .replace(/안정적으로 유지되고 있습니다/g, '잘 유지되고 있습니다')
        .replace(/현재 학습 흐름|학습 흐름|성취 흐름/g, '학습 상태')
        .replace(/풀이 흐름|현재 흐름/g, '풀이 과정')
        .replace(/유사 문제 풀이까지 함께 진행하겠습니다/g, '유사 유형까지 함께 점검하겠습니다')
        .replace(/자연스럽게 연결해|자연스럽게 연결/g, '자연스럽게 연계해')
        .replace(/사고 흐름/g, '사고 과정')
        .replace(/매우 안정적인 성취를 보여주었습니다|매우 안정적인 성취|안정적인 성취/g, '안정적으로 해결했습니다')
        .replace(/성취를 유지|강점을 유지/g, '잘하던 부분을 이어가겠습니다')
        .replace(/안정적으로 소화했습니다|안정적으로 소화/g, '안정적으로 해결했습니다')
        .replace(/안정화하겠습니다|안정화합니다|안정화/g, '안정적으로 정리하겠습니다')
        .replace(/확인 포인트/g, '점검할 부분');

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
        // AI식 모호어만 전문체로 치환한다. 캐주얼 변환(문항→문제, 오답→틀린 문제 등)이나
        // 부분 어간 치환은 하지 않는다 — 전문체 문구가 그대로 보존되고 문장이 깨지지 않게.
        .replace(/현재 학습 흐름|학습 흐름|성취 흐름|풀이 흐름|현재 흐름/g, '학습 상태')
        .replace(/유의미한 자료/g, '의미 있는 자료')
        .replace(/중요한 시사점|시사점/g, '확인할 점')
        .replace(/중요한 의미를 가집니다/g, '함께 살펴볼 부분입니다')
        .replace(/다각도로/g, '여러 측면에서')
        .replace(/종합적으로 파악/g, '종합적으로 확인')
        .replace(/향후/g, '앞으로')
        .replace(/학습 방향 설정/g, '다음 학습 방향')
        .replace(/체계적인 관리/g, '꾸준한 관리')
        .replace(/확인이 필요합니다/g, '다시 점검하겠습니다')
        .replace(/도움이 될 것으로 보입니다/g, '도움이 됩니다')
        .replace(/개선이 기대됩니다/g, '점차 나아질 수 있습니다')
        .replace(/심화 응용 문제로 학습 폭을 넓혀가겠습니다|학습 폭을 넓혀가겠습니다|학습 폭을 넓히겠습니다|학습 폭/g, '학습 범위를 넓혀가겠습니다')
        .replace(/자연스럽게 확장하겠습니다|자연스럽게 확장/g, '점진적으로 넓혀가겠습니다')
        .replace(/보완 포인트|보완 지점|보완 방향|보완 영역/g, '점검할 부분')
        .replace(/확인 포인트|확인할 지점/g, '점검할 부분')
        .replace(/안정화하겠습니다|안정화합니다/g, '안정적으로 정리하겠습니다')
        .replace(/매우 안정적/g, '안정적')
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
        return `최근 「${exam.exam_title}」 시험에서 ${score}점을 받았습니다.${avgText} 모든 문제를 정확하게 풀었습니다.`;
    }

    return `최근 「${exam.exam_title}」 시험에서 ${score}점을 받았습니다.${avgText} ${ctx.wrongIds.length}문제 틀렸습니다.`;
}

function buildNextPoint(ctx) {
    if (!ctx.wrongIds.length) {
        if (ctx.progressText) {
            return `${ctx.progressText} 이후 내용으로 학습을 이어가는 것`;
        }
        return '오늘 다룬 개념을 바탕으로 응용력을 한 단계 높이는 것';
    }

    const wrongStr = ctx.wrongIds.length === 1
        ? `${ctx.wrongIds[0]}번 문제를 다시 풀고 비슷한 문제로 이어가는 것`
        : `${ctx.wrongIds.join(', ')}번 문제를 다시 풀고 비슷한 문제로 이어가는 것`;

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
마무리하지 못한 내용은 다음 시간 초반에 이어서 진행하겠습니다.

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
        ? `최근 시험에서는 ${ctx.latestExam.score}점이 나왔고, ${ctx.wrongIds.length ? `틀린 ${ctx.wrongIds.length}문제를 다시 확인하면 좋아.` : '틀린 문제 없이 잘 정리했어.'}`
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

window.copyReport = copyReportLegacy;
