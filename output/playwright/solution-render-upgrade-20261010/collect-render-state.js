(async () => {
  const root = document.querySelector('#print-area');
  const pages = [...(root?.querySelectorAll('.page') || [])];
  const boxes = [...(root?.querySelectorAll('.sol-box') || [])];
  const groups = new Map();
  for (const box of boxes) {
    const ref = box.dataset.sourceRef || '';
    const row = groups.get(ref) || { answer: '', solutionText: '', fragments: 0, fullWidth: false };
    row.answer ||= box.querySelector('.sol-ans')?.textContent || '';
    row.solutionText += box.querySelector('.sol-exp')?.textContent || '';
    row.fragments += 1;
    row.fullWidth ||= box.dataset.solutionFullWidth === 'true' || !!box.closest('.sol-fullwidth-column');
    groups.set(ref, row);
  }
  const digest = async value => {
    const bytes = new TextEncoder().encode(value);
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  };
  const groupedRows = [...groups.entries()].map(([ref, value]) => [ref, value.answer, value.solutionText]);
  const bodyText = groupedRows.map(row => row.join('\n')).join('\n');
  const bodyHtml = boxes.map(box => `${box.dataset.sourceRef || ''}\n${box.querySelector('.sol-exp')?.innerHTML || ''}`).join('\n');
  const imageNodes = [...(root?.querySelectorAll('.sol-image-wrap img') || [])];
  const clipped = [...(root?.querySelectorAll('.sol-box,.sol-exp,.page-body,.sol-grid-col,.sol-fullwidth-column') || [])].flatMap(node => {
    const style = getComputedStyle(node), delta = Math.max(0, node.scrollHeight - node.clientHeight);
    const clips = ['hidden', 'clip'].includes(style.overflowY) || ['hidden', 'clip'].includes(style.overflow);
    return clips && delta > 2 ? [{ tag: node.className, delta, scroll: node.scrollHeight, client: node.clientHeight, sourceRef: node.closest('.sol-box')?.dataset.sourceRef || '' }] : [];
  });
  let runtime = null;
  try { runtime = archiveScreenRuntime?.inspect?.(); } catch (_) {}
  return {
    url: location.href,
    mode: AppState.mode,
    clickToRuntimeStartMs: Number.isFinite(window.__benchmarkClickStart) && window.__AP_RENDER_METRICS__?.startedAt ? window.__AP_RENDER_METRICS__.startedAt - window.__benchmarkClickStart : null,
    visibleReadyMs: window.__AP_RENDER_METRICS__?.visibleReadyMs ?? null,
    metrics: window.__AP_RENDER_METRICS__ || null,
    screenRuntime: (() => { try { return JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'); } catch (_) { return null; } })(),
    ledger: AppState.solutionDecisionLedger ? {
      schemaVersion: AppState.solutionDecisionLedger.schemaVersion,
      measurementSource: AppState.solutionDecisionLedger.measurementSource,
      questionDenominator: AppState.solutionDecisionLedger.questionDenominator,
      fullBoxMeasurementCount: AppState.solutionDecisionLedger.fullBoxMeasurementCount,
      chunksGeneratedQuestionCount: AppState.solutionDecisionLedger.chunksGeneratedQuestionCount,
      splitCandidateCount: AppState.solutionDecisionLedger.splitCandidateCount,
      measuredChunkRangeCount: AppState.solutionDecisionLedger.measuredChunkRangeCount,
      measuredChunkCount: AppState.solutionDecisionLedger.measuredChunkCount,
      measurementPolicy: AppState.solutionDecisionLedger.measurementPolicy,
      blockMeasures: AppState.solutionDecisionLedger.blocks.map(block => ({ blockId: block.blockId, raw: block.measurements?.raw ?? block.raw ?? block.measuredHeight ?? null, tight: block.measurements?.tight ?? block.tight ?? null, fullWidth: block.fullWidth === true, deferredChunkCount: block.deferredChunkCount === true, actualChunkCount: block.actualChunkCount ?? block.chunks?.length ?? null, measuredRangeCount: block.measuredRangeCount ?? 0 }))
    } : null,
    pageCount: pages.length,
    pages: pages.map((page, index) => ({ pageNo: index + 1, solutions: page.querySelectorAll('.sol-box').length, continuations: page.querySelectorAll('.sol-box-long').length, fullwidth: page.querySelectorAll('.sol-fullwidth-column').length, svg: page.querySelectorAll('.sol-image-wrap img[src$=".svg"],.sol-image-wrap img[src*=".svg?"]').length })),
    solutionBoxCount: boxes.length,
    answerCount: [...groups.values()].filter(row => row.answer).length,
    uniqueQuestionCount: groups.size,
    continuationBoxCount: boxes.filter(box => box.classList.contains('sol-box-long')).length,
    fullwidthQuestionCount: [...groups.values()].filter(row => row.fullWidth).length,
    solutionBodySha256: await digest(bodyText),
    solutionHtmlSha256: await digest(bodyHtml),
    bodyTextLength: bodyText.length,
    imageCount: imageNodes.length,
    imagesReady: imageNodes.every(image => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0),
    imageDetails: imageNodes.map(image => ({ src: image.getAttribute('src'), width: image.naturalWidth, height: image.naturalHeight, complete: image.complete })),
    unrenderedMath: window.APRenderLoop?.unrenderedMathCount(root) ?? null,
    mathErrors: root?.querySelectorAll('mjx-merror').length ?? null,
    clipped,
    maxPageBodyOverflow: Math.max(0, ...pages.map(page => Math.max(0, page.querySelector('.page-body')?.scrollHeight - page.querySelector('.page-body')?.clientHeight || 0))),
    runtime: runtime ? { attempts: (runtime.attempts || []).map(item => ({ intentType: item.intentType, state: item.state, cacheStatus: item.cacheStatus, visibleReadyMs: item.visibleReadyMs, error: item.error })), currentSession: runtime.currentSession ? { sessionId: runtime.currentSession.sessionId, activeMode: runtime.currentSession.activeMode, modes: Object.fromEntries(Object.entries(runtime.currentSession.modeSnapshots || {}).map(([mode, snapshot]) => [mode, snapshot ? { status: snapshot.status, pageCount: snapshot.pageCount, builtRequestGeneration: snapshot.builtRequestGeneration } : null])) } : null } : null
  };
})()
