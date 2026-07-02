/**
 * AP Math OS 1.0 [js/report-print.js]
 * 출력: 클린 PDF 빌더·프리미엄 스타일·학부모 카드 v1 (report-center.js 이후 로드)
 */
function reportCenterBuildPremiumQuestionRows(data, forPrint = false, detailed = false) {
    const stats = data.stats || {};
    const wrongRows = stats.wrongRows || [];
    const detailMap = detailed ? reportCenterGetQuestionDetailMap(data) : null;
    if (!wrongRows.length) {
        const excellentRows = reportCenterSelectExcellentRows(stats, detailed ? 5 : 3);
        if (!excellentRows.length) {
            return `<tr><td colspan="6" class="aprc-empty-cell">이번 시험은 전 문항을 정확히 풀었습니다.</td></tr>`;
        }
        return excellentRows.map(row => {
            const insight = '전체 정답률이 낮은 문항까지 정확히 해결한 유형입니다.';
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

    // 표준형: 먼저 볼 문제 5개. 상세형: 틀린 문제 전체(난도·정답률 순) + 문항별 해석 보강.
    const displayRows = detailed
        ? reportCenterSelectPriorityWrongRows(wrongRows, wrongRows.length)
        : reportCenterSelectPriorityWrongRows(wrongRows, 5);
    return displayRows.map(row => {
        // 표 '해석' 칸은 짧은 진단(명사구). 정화기를 거치지 않아 전문체 그대로 출력된다.
        const insight = detailed
            ? (row.meaning || reportCenterBuildParentQuestionInsight(row, detailMap?.get(String(row.questionNo)), { mode: 'short' }))
            : (row.meaning || '-');
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

function reportCenterBuildQuestionReviewCard(review, opts = {}) {
    const options = {
        showAnswer: false,
        showContent: true,
        showSolution: true,
        anonymized: false,
        badge: true,
        ...opts
    };
    const source = review && typeof review === 'object' ? review : {};
    const questionNo = source.questionNo ?? source.question_no ?? '';
    const unit = source.unit || source.standard_unit || source.unitKey || source.standard_unit_key || '단원 정보 없음';
    const correctRate = Number(source.correctRate ?? source.correct_rate);
    const classCorrectRate = Number(source.classCorrectRate ?? source.class_correct_rate);
    const level = source.level || source.difficulty || reportCenterGetQuestionDifficultyLabel(
        Number.isFinite(correctRate) ? correctRate : NaN
    );
    const title = questionNo ? `${questionNo}번 · ${unit}` : String(unit || '문항 분석');
    const rateItems = [
        Number.isFinite(correctRate) ? `<span>전체 정답률 <b>${Math.round(correctRate)}%</b></span>` : '',
        Number.isFinite(classCorrectRate) ? `<span>반 정답률 <b>${Math.round(classCorrectRate)}%</b></span>` : ''
    ].filter(Boolean).join('');
    const contentHtml = options.showContent ? reportCenterArchiveTextToHtml(source.contentText || source.content || '') : '';
    const choiceItems = options.showContent && Array.isArray(source.choices)
        ? source.choices
            .map(choice => reportCenterArchiveTextToHtml(choice))
            .filter(Boolean)
            .map(choice => `<li>${choice}</li>`)
            .join('')
        : '';
    const answerHtml = options.showAnswer ? reportCenterArchiveTextToHtml(source.answer || '') : '';
    const solutionHtml = options.showSolution ? reportCenterArchiveTextToHtml(source.solutionText || source.solution || '') : '';
    const savedReviewHtml = reportCenterArchiveTextToHtml(source.reviewText || source.review_text || '');
    const fallbackInsight = savedReviewHtml ? '' : reportCenterArchiveTextToHtml(
        reportCenterBuildParentQuestionInsight(source, source, { mode: 'full' })
    );
    const reviewHtml = savedReviewHtml || fallbackInsight;

    return `
        <article class="aprc-qreview-card${options.anonymized ? ' is-anonymized' : ''}">
            <header class="aprc-qreview-head">
                <div class="aprc-qreview-title">${reportCenterEscape(title)}</div>
                ${options.badge ? `<div class="aprc-qreview-badge">${reportCenterEscape(level || '자료 부족')}</div>` : ''}
            </header>
            ${rateItems ? `<div class="aprc-qreview-rates">${rateItems}</div>` : ''}
            ${contentHtml || choiceItems ? `
                <section class="aprc-qreview-block">
                    <b>문항</b>
                    ${contentHtml ? `<p>${contentHtml}</p>` : ''}
                    ${choiceItems ? `<ol class="aprc-qreview-choices">${choiceItems}</ol>` : ''}
                </section>
            ` : ''}
            ${answerHtml ? `
                <section class="aprc-qreview-block aprc-qreview-answer">
                    <b>정답</b>
                    <p>${answerHtml}</p>
                </section>
            ` : ''}
            ${reviewHtml ? `
                <section class="aprc-qreview-block aprc-qreview-review">
                    <b>${options.anonymized ? '문항 분석' : '저장된 분석'}</b>
                    <p>${reviewHtml}</p>
                </section>
            ` : ''}
            ${solutionHtml ? `
                <section class="aprc-qreview-block aprc-qreview-solution">
                    <b>해설 요약</b>
                    <p>${solutionHtml}</p>
                </section>
            ` : ''}
        </article>
    `;
}

function reportCenterBuildQuestionReviewCardsForReport(data, opts = {}) {
    const stats = data?.stats || {};
    const session = data?.session || {};
    const wrongRows = Array.isArray(stats.wrongRows) ? stats.wrongRows : [];
    if (!wrongRows.length) return '';
    const limit = Number.isFinite(Number(opts.limit)) ? Number(opts.limit) : 6;
    const detailMap = reportCenterGetQuestionDetailMap(data);
    const store = opts.store || reportCenterGetExamReviews(session.archive_file || '');
    const rows = reportCenterSelectPriorityWrongRows(wrongRows, limit);
    return rows.map(row => {
        const qNo = String(row?.questionNo ?? row?.question_no ?? '').trim();
        const detail = detailMap.get(qNo) || {};
        const saved = store.byQuestion?.get?.(qNo) || null;
        return reportCenterBuildQuestionReviewCard({
            ...detail,
            ...row,
            questionNo: row.questionNo ?? detail.questionNo,
            unit: row.unit || detail.unit,
            level: row.level || detail.level || row.difficulty,
            correctRate: row.correctRate ?? detail.correctRate,
            classCorrectRate: row.classCorrectRate ?? detail.classCorrectRate,
            answer: saved?.answer || detail.answer,
            reviewText: saved?.review_text || saved?.reviewText || ''
        }, {
            showAnswer: !!opts.showAnswer,
            showContent: opts.showContent !== false,
            showSolution: opts.showSolution !== false,
            anonymized: !!opts.anonymized
        });
    }).join('');
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
    // 표준형/상세형: 정규화 전 원본 studioState(또는 options.length)에서 길이 모드를 먼저 읽는다.
    const reportLength = (options.studioState?.textOptions?.length || options.length) === 'detailed' ? 'detailed' : 'standard';
    const isDetailed = reportLength === 'detailed';
    const blockLimit = isDetailed
        ? { summary: 480, weakness: 480, remediation: 280, wrongCare: 300, plan: 220, teacher: 520 }
        : { summary: 360, weakness: 320, remediation: 220, wrongCare: 240, plan: 180, teacher: 320 };
    const teacherLineMax = isDetailed ? 4 : 2;
    const planItemMax = isDetailed ? 6 : 3;
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
        { title: '이번 시험', text: reportCenterTrimText(singleExamSummaryText || summaryItems[0]?.text || '', blockLimit.summary) },
        { title: '다시 볼 부분', text: reportCenterTrimText(wrongCount ? (weaknessSummaryText || summaryItems[1]?.text || '') : '', blockLimit.weakness) },
        { title: '다음 시간', text: reportCenterTrimText(reportCenterApplyEasyFinalLanguage(aiAnalysis?.nextPlan || meaningItems[2] || summaryItems[2]?.text || ''), blockLimit.plan) }
    ];
    let parentSummaryText = reportCenterPickNonDuplicateText(
        singleExamSummaryText,
        summaryItems[0]?.text || '이번 시험 결과를 정리했습니다.',
        []
    );
    // 상세형: 요약에 점수 위치(평균 대비) 문장을 한 줄 더 붙인다.
    if (isDetailed) {
        const positionText = reportCenterApplyEasyFinalLanguage(reportCenterBuildScorePositionText(data));
        if (positionText && !/부족/.test(positionText) && !parentSummaryText.includes(positionText)) {
            parentSummaryText = reportCenterTrimText(`${parentSummaryText} ${positionText}`.trim(), blockLimit.summary);
        }
    }
    coreItems[1].text = reportCenterPickNonDuplicateText(
        coreItems[1].text,
        summaryItems[1]?.text || '틀린 문항을 다시 점검하겠습니다.',
        [parentSummaryText]
    );
    // 상세형의 '다시 볼 부분' 세부는 아래 '문제별 코멘트' 섹션에서 문항별로 풀어 보여준다.
    let diagnosisLines = reportCenterBuildInterpretiveDiagnosisLines(data, teacherMemo, aiAnalysis).slice(0, teacherLineMax);
    let nextPlanItems = (aiAnalysis ? reportCenterBuildNextPlanItems(data, aiAnalysis) : reportCenterBuildEasyPlanItems(data, trendData)).slice(0, planItemMax);
    let parentMessageText = aiAnalysis?.parentMessage
        ? reportCenterEnsureParentOpening(aiAnalysis.parentMessage)
        : reportCenterBuildEasyParentMessage(data);
    const autoTexts = {
        summary: parentSummaryText,
        trend: trendSummaryText,
        weakness: wrongCount ? coreItems[1].text : '',
        remediation: reportCenterBuildRemediationText(data, trendData, aiAnalysis),
        wrongCare: reportCenterBuildWrongCareText(data, trendData),
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
        remediation: reportCenterStudioBlockIsDirty(studioState, 'remediation'),
        wrongCare: reportCenterStudioBlockIsDirty(studioState, 'wrongCare'),
        plan: reportCenterStudioBlockIsDirty(studioState, 'plan'),
        teacherOpinion: reportCenterStudioBlockIsDirty(studioState, 'teacherOpinion'),
        parentMessage: reportCenterStudioBlockIsDirty(studioState, 'parentMessage')
    };
    parentSummaryText = dirtyBlocks.summary ? studioTexts.summary : reportCenterApplyEasyFinalLanguage(studioTexts.summary);
    trendSummaryText = dirtyBlocks.trend ? studioTexts.trend : reportCenterApplyEasyFinalLanguage(studioTexts.trend);
    coreItems[1].text = dirtyBlocks.weakness ? studioTexts.weakness : reportCenterApplyEasyFinalLanguage(studioTexts.weakness);
    const remediationText = reportCenterTrimText(
        dirtyBlocks.remediation ? studioTexts.remediation : reportCenterApplyEasyFinalLanguage(studioTexts.remediation),
        blockLimit.remediation
    );
    const wrongCareText = reportCenterTrimText(
        dirtyBlocks.wrongCare ? studioTexts.wrongCare : reportCenterApplyEasyFinalLanguage(studioTexts.wrongCare),
        blockLimit.wrongCare
    );
    nextPlanItems = String(studioTexts.plan || '')
        .split(/\n+/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => dirtyBlocks.plan ? item : reportCenterApplyEasyFinalLanguage(item))
        .slice(0, planItemMax);
    if (!nextPlanItems.length && !dirtyBlocks.plan) nextPlanItems = reportCenterBuildEasyPlanItems(data, trendData);
    diagnosisLines = String(studioTexts.teacherOpinion || '')
        .split(/\n{2,}|\n/)
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => dirtyBlocks.teacherOpinion ? item : reportCenterApplyEasyFinalLanguage(item))
        .slice(0, teacherLineMax);
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
                    <div class="aprc-card-note">${qCount || '-'}문항 중 ${wrongCount}문항 오답</div>
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

            ${studioOptions.includeRemediation ? `<section class="aprc-pdf-section aprc-pdf-remediation aprc-pdf-panel">
                <div class="aprc-section-title">이번 시험 보완 방향</div>
                <p>${reportCenterEscape(remediationText)}</p>
            </section>` : ''}

            ${studioOptions.includeWrongCare ? `<section class="aprc-pdf-section aprc-pdf-wrong-care aprc-pdf-panel">
                <div class="aprc-section-title">AP수학 오답관리</div>
                ${String(wrongCareText || '').split(/\n+/).map(line => line.trim()).filter(Boolean).map(line => `<p>${reportCenterEscape(line)}</p>`).join('')}
                ${wrongCount ? `<div class="aprc-wrongcare-flow">${reportCenterEscape(REPORT_WRONGCARE_FLOW.join(' → '))}</div>` : ''}
            </section>` : ''}

            <section class="aprc-pdf-section aprc-pdf-next-plan aprc-pdf-panel">
                <div class="aprc-section-title">다음 수업 복습 계획</div>
                <ol class="aprc-plan-list">
                    ${nextPlanItems.map(item => `<li>${reportCenterEscape(item)}</li>`).join('')}
                </ol>
                ${isDetailed ? `<p class="aprc-pdf-bridge-note">문제별 자세한 내용은 아래 분석 자료를 참고해 주시기 바랍니다.</p>` : ''}
            </section>

            ${isDetailed && studioOptions.includeQuestionAnalysis ? `<section class="aprc-pdf-section aprc-pdf-table-panel">
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
                    <tbody>${reportCenterBuildPremiumQuestionRows(data, true, isDetailed)}</tbody>
                </table>
                <div class="aprc-source-note">${reportCenterEscape(archiveMessage || '')}</div>
            </section>` : ''}

            ${isDetailed && wrongCount && studioOptions.includeQuestionAnalysis && studioOptions.includeQuestionReview ? `<section class="aprc-pdf-section aprc-pdf-review-panel aprc-pdf-panel">
                <div class="aprc-section-title">문제별 분석 카드</div>
                <div class="aprc-qreview-list">${reportCenterBuildQuestionReviewCardsForReport(data, {
                    limit: 6,
                    showAnswer: !!studioOptions.includeQuestionReviewAnswer,
                    showContent: true,
                    showSolution: true
                })}</div>
            </section>` : ''}
            ${isDetailed && wrongCount && studioOptions.includeQuestionAnalysis ? `<section class="aprc-pdf-section aprc-pdf-qcomment-panel aprc-pdf-panel">
                <div class="aprc-section-title">문제별 코멘트</div>
                <div class="aprc-qcomment-list">${reportCenterBuildQuestionCommentCards(data, 4)}</div>
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
        ? '다음 시험부터 점수 변화를 함께 보여드리겠습니다.'
        : reportCenterEasyScoreDeltaText(trend.scoreDelta);
    const wrongScoreNote = wrongCount
        ? `${wrongCount}문항 오답`
        : '전 문항 정답';
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
            .aprc-section-title { margin:0 0 6px; font-size:13px; font-weight:850; color:#0f172a; letter-spacing:-0.35px; }
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
            .aprc-pdf-remediation p, .aprc-pdf-wrong-care p { margin:0 0 6px; color:#334155; font-size:11.7px; font-weight:700; line-height:1.62; word-break:keep-all; }
            .aprc-wrongcare-flow { margin-top:7px; padding:7px 9px; border-radius:9px; background:#f8fafc; color:#475569; font-size:10.5px; font-weight:850; line-height:1.45; word-break:keep-all; }
            .aprc-plan-list { margin:0; padding-left:18px; color:#334155; font-size:11.8px; font-weight:700; line-height:1.65; }
            .aprc-plan-list li { margin:0 0 4px; }
            .aprc-qcomment-list { display:flex; flex-direction:column; gap:2.6mm; }
            .aprc-qcomment { display:flex; gap:3mm; padding:3mm 3.5mm; border:1px solid #e5e7eb; border-radius:10px; background:#f8fafc; break-inside:avoid; page-break-inside:avoid; }
            .aprc-qcomment-no { flex:0 0 auto; min-width:14mm; font-size:11.5px; font-weight:850; color:#1d4ed8; line-height:1.3; }
            .aprc-qcomment-no span { display:block; margin-top:1px; font-size:9.5px; font-weight:700; color:#94a3b8; }
            .aprc-qcomment p { margin:0; flex:1 1 auto; color:#334155; font-size:11px; font-weight:650; line-height:1.55; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-qreview-card { break-inside:avoid; page-break-inside:avoid; border:1px solid #dbeafe; border-radius:12px; background:#ffffff; padding:3.5mm; color:#111827; }
            .aprc-qreview-list { display:flex; flex-direction:column; gap:3mm; }
            .aprc-qreview-card + .aprc-qreview-card { margin-top:3mm; }
            .aprc-qreview-head { display:flex; align-items:flex-start; justify-content:space-between; gap:8px; margin-bottom:2mm; }
            .aprc-qreview-title { min-width:0; color:#0f172a; font-size:12.5px; font-weight:900; line-height:1.35; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-qreview-badge { flex:0 0 auto; padding:3px 7px; border-radius:999px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:10px; font-weight:900; line-height:1.2; white-space:nowrap; }
            .aprc-qreview-rates { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:2.5mm; color:#64748b; font-size:10.5px; font-weight:800; }
            .aprc-qreview-rates span { display:inline-flex; gap:3px; align-items:center; padding:3px 6px; border-radius:8px; background:#f8fafc; border:1px solid #e5e7eb; }
            .aprc-qreview-rates b { color:#0f172a; font-weight:900; }
            .aprc-qreview-block { margin-top:2.5mm; padding-top:2.2mm; border-top:1px solid #e5e7eb; }
            .aprc-qreview-block:first-of-type { margin-top:0; }
            .aprc-qreview-block > b { display:block; margin-bottom:4px; color:#1d4ed8; font-size:10.8px; font-weight:900; }
            .aprc-qreview-block p { margin:0; color:#334155; font-size:11px; font-weight:650; line-height:1.55; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-qreview-choices { margin:5px 0 0; padding-left:16px; color:#334155; font-size:10.8px; font-weight:650; line-height:1.5; }
            .aprc-qreview-choices li { margin:2px 0; }
            .aprc-qreview-review { background:#f8fbff; border:1px solid #dbeafe; border-radius:10px; padding:2.6mm; }
            .aprc-qreview-review > b { color:#1e40af; }
            .aprc-parent-message { margin:4mm 0 0; padding:4.5mm 5mm; border-radius:14px; background:#eff6ff; border:1px solid #bfdbfe; }
            .aprc-parent-message p { margin:0; color:#1e3a8a; font-size:11.5px; font-weight:700; line-height:1.58; word-break:keep-all; white-space:normal; }
            .aprc-parent-bottom-note { margin-top:3.5mm; padding:3.5mm 4.5mm; border:1px solid #e5e7eb; border-radius:12px; background:#f8fafc; color:#334155; font-size:10.8px; font-weight:750; line-height:1.45; }
            .aprc-footer { position:absolute; left:9mm; right:9mm; bottom:7mm; color:#94a3b8; font-size:10px; font-weight:850; letter-spacing:0.14em; text-align:center; }
            .aprc-muted { color:#64748b; font-size:12px; font-weight:700; }
            .aprc-empty-box { padding:36px; text-align:center; color:#64748b; font-weight:800; }

            .aprc-pdf-document { width:100%; max-width:186mm; margin:0 auto; padding:0; box-sizing:border-box; background:#fff; color:#111827; font-family:Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif; line-height:1.5; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-pdf-document * { box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
            .aprc-pdf-header { display:flex; justify-content:space-between; align-items:flex-start; gap:18px; padding:5mm 0 5mm; border-bottom:2px solid #0f172a; color:#111827; }
            .aprc-pdf-header > div:first-child { min-width:0; padding-right:8mm; }
            .aprc-pdf-header .aprc-brand { color:#2563eb; }
            .aprc-pdf-header .aprc-title { color:#0f172a; font-size:25px; }
            .aprc-pdf-header .aprc-subtitle { color:#475569; }
            .aprc-pdf-header .aprc-ai-badge { background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8; }
            .aprc-pdf-header .aprc-signature-boxes { --aprc-sign-border:#334155; --aprc-sign-text:#0f172a; width:38mm; min-width:38mm; grid-template-rows:6mm 19mm; background:#fff; justify-self:end; }
            .aprc-pdf-header .aprc-signature-cells > div { height:19mm; }
            .aprc-pdf-section, .aprc-pdf-panel, .aprc-pdf-table-panel, .aprc-pdf-parent-message { box-sizing:border-box; }
            .aprc-pdf-section { margin-top:3.1mm; }
            .aprc-pdf-student-band { display:flex; justify-content:space-between; align-items:center; gap:18px; padding:3.2mm 0; border-bottom:1px solid #e5e7eb; }
            .aprc-pdf-score-grid { display:grid; grid-template-columns:1.25fr repeat(4,minmax(0,1fr)); gap:3mm; }
            .aprc-pdf-score-card { min-width:0; padding:3.2mm; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
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
            .aprc-pdf-bridge-note { margin:2.5mm 0 0; padding:2.4mm 3.5mm; border-radius:10px; background:#f8fafc; color:#64748b; font-size:10.5px; font-weight:700; line-height:1.45; }
            .aprc-pdf-diagnosis + .aprc-pdf-parent-message { margin-top:3.8mm; }
            .aprc-pdf-panel, .aprc-pdf-table-panel, .aprc-pdf-parent-message { padding:3.4mm; border:1px solid #e5e7eb; border-radius:12px; background:#fff; }
            .aprc-pdf-panel p, .aprc-pdf-parent-message p { margin:0 0 5px; color:#334155; font-size:11.6px; font-weight:650; line-height:1.55; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-pdf-panel p:last-child, .aprc-pdf-parent-message p:last-child { margin-bottom:0; }
            .aprc-pdf-parent-message { background:#eff6ff; border-color:#bfdbfe; }
            .aprc-pdf-parent-message p { color:#1e3a8a; font-weight:700; }
            .aprc-pdf-table { width:100%; min-width:0; border-collapse:collapse; table-layout:fixed; font-size:9.7px; line-height:1.42; }
            .aprc-pdf-table th, .aprc-pdf-table td { padding:3px 5px; word-break:keep-all; overflow-wrap:break-word; }
            .aprc-pdf-table th { white-space:normal; }
            .aprc-pdf-table tr { break-inside:avoid; page-break-inside:avoid; }
            .aprc-pdf-document .aprc-source-note { max-height:none; overflow:visible; }
            .aprc-pdf-footer { margin:4mm 0 0; padding-top:3mm; border-top:1px solid #e5e7eb; color:#94a3b8; font-size:10px; font-weight:850; letter-spacing:0.14em; text-align:center; }

            @media screen and (max-width:760px) {
                .aprc-report-header { margin:-34px -34px 0; padding:34px 34px 26px; }
            }
            @media print {
                @page { size:A4; margin:12mm; }
                html, body { margin:0 !important; padding:0 !important; background:#fff !important; overflow:visible !important; }
                .report-print-toolbar, .report-print-actions, .no-print { display:none !important; }
                .report-print-stage { padding:0 !important; margin:0 !important; background:#fff !important; overflow:visible !important; }
                .aprc-pdf-document { width:100% !important; max-width:186mm !important; margin:0 auto !important; padding:0 !important; box-shadow:none !important; border:none !important; border-radius:0 !important; overflow:visible !important; }
                .aprc-pdf-parent-message, .aprc-pdf-score-grid, .aprc-pdf-point-grid, .aprc-pdf-parent-summary, .aprc-pdf-remediation, .aprc-pdf-wrong-care, .aprc-pdf-review-panel, .aprc-qreview-card { break-inside:avoid !important; page-break-inside:avoid !important; }
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

function buildReportCardNextPoint(wrongAnswers, weakUnits) {
    const wrongs = Array.isArray(wrongAnswers) ? wrongAnswers.filter(v => v !== null && v !== undefined && String(v).trim() !== '') : [];
    const units = Array.isArray(weakUnits) ? weakUnits.filter(Boolean) : [];

    if (!wrongs.length && !units.length) {
        return '이번 시험은 잘 봤습니다. 다음 단원으로 자신 있게 이어가겠습니다.';
    }

    if (!wrongs.length && units.length > 0) {
        return `이번 시험은 잘 봤습니다. 다음 시간에는 ${units[0]} 단원의 조금 더 어려운 내용까지 이어가겠습니다.`;
    }

    const wrongStr = wrongs.length === 1
        ? `${wrongs[0]}번 문제`
        : `${wrongs.join('번 · ')}번 문제`;

    if (units.length > 0) {
        return `${wrongStr}의 푸는 과정을 함께 확인하고, ${units[0]} 단원 관련 개념을 비슷한 문제로 한 번 더 정리하겠습니다.`;
    }

    return `${wrongStr}의 푸는 과정을 함께 확인하고, 다음 단원으로 자신 있게 이어가겠습니다.`;
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
                ${qCount ? `<span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">총 ${qCount}문제</span>` : ''}
                <span style="background:#f8fafc;border:1px solid #e2e8f0;color:#475569;font-size:11px;font-weight:700;padding:4px 10px;border-radius:8px;">틀린 ${wrongAnswers.length}문제</span>
            </div>
            <div style="font-size:13px;color:#475569;font-weight:600;">틀린 문제: ${wrongHtml}</div>
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

