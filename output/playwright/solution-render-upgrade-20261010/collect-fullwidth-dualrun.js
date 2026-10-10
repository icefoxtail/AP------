(() => {
  const root = document.querySelector('#print-area');
  const pages = [...(root?.querySelectorAll('.page') || [])];
  const q10 = [...(root?.querySelectorAll('.sol-box') || [])].find(box => box.dataset.sourceRef?.endsWith('#ordinal:10'));
  const metric = window.__AP_RENDER_METRICS__ || null;
  const read = name => { try { return JSON.parse(document.documentElement.dataset[name] || 'null'); } catch (_) { return null; } };
  const q10Source = q10?.dataset.sourceRef || '';
  const q10Placement = (AppState.solutionObservedPlacementLedger || []).find(item => item.questionKey === q10Source && !item.continuationOf) || null;
  const bodyOverflows = pages.map((page, index) => ({ pageNo: index + 1, delta: Math.max(0, (page.querySelector('.page-body')?.scrollHeight || 0) - (page.querySelector('.page-body')?.clientHeight || 0)) }));
  const image = q10?.querySelector('.sol-image-wrap img') || null;
  return {
    url: location.href,
    sourceArchiveFile: AppState.sourceArchiveFile,
    mode: AppState.mode,
    pageCount: pages.length,
    questionCount: new Set([...root.querySelectorAll('.sol-box')].map(box => box.dataset.sourceRef)).size,
    answerCount: root.querySelectorAll('.sol-ans').length,
    continuationCount: root.querySelectorAll('.sol-box-long').length,
    q10PageNo: q10 ? pages.indexOf(q10.closest('.page')) + 1 : null,
    q10FullWidth: q10?.dataset.solutionFullWidth === 'true',
    q10PageBoxes: q10?.closest('.page')?.querySelectorAll('.sol-box').length || 0,
    q10ImageReady: Boolean(image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0),
    q10ImageSize: image ? { width: image.naturalWidth, height: image.naturalHeight } : null,
    q10Placement: q10Placement && { pageNo: q10Placement.pageNo, columnNo: q10Placement.columnNo, columnSpan: q10Placement.columnSpan, layoutTag: q10Placement.layoutTag },
    ledger: AppState.solutionDecisionLedger ? { schemaVersion: AppState.solutionDecisionLedger.schemaVersion, questionDenominator: AppState.solutionDecisionLedger.questionDenominator, fullWidth: AppState.solutionDecisionLedger.blocks[9]?.fullWidth, chunkCount: AppState.solutionDecisionLedger.blocks[9]?.chunks?.length, raw: AppState.solutionDecisionLedger.blocks[9]?.measurements?.raw, tight: AppState.solutionDecisionLedger.blocks[9]?.measurements?.tight } : null,
    dualRun: read('apRenderAuthorityDualRun'),
    solutionPromotion: read('apSolutionLayoutPromotion'),
    unrenderedMath: window.APRenderLoop?.unrenderedMathCount(root) ?? null,
    mathErrors: root?.querySelectorAll('mjx-merror').length ?? null,
    maxPageBodyOverflow: Math.max(0, ...bodyOverflows.map(entry => entry.delta)),
    metrics: metric ? { visibleReadyMs: metric.visibleReadyMs, layout: metric.phases?.['solution-layout'], mathJaxCalls: metric.mathJaxCalls, mathJaxTotalMs: metric.mathJaxTotalMs, layoutBarrierCount: metric.layoutBarrierCount } : null
  };
})()
