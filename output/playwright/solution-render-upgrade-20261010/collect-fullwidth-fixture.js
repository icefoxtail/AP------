(() => {
  const root = document.querySelector('#print-area');
  const pages = [...(root?.querySelectorAll('.page') || [])];
  const boxes = [...(root?.querySelectorAll('.sol-box') || [])];
  const q10 = boxes.find(box => box.dataset.sourceRef?.endsWith('#ordinal:10')) || null;
  const q9 = boxes.find(box => box.dataset.sourceRef?.endsWith('#ordinal:9')) || null;
  const q11 = boxes.find(box => box.dataset.sourceRef?.endsWith('#ordinal:11')) || null;
  const pageNumber = box => box ? pages.indexOf(box.closest('.page')) + 1 : null;
  const image = q10?.querySelector('.sol-image-wrap img') || null;
  const rect = node => {
    if (!node) return null;
    const box = node.getBoundingClientRect();
    return { x: box.x, y: box.y, width: box.width, height: box.height, top: box.top, bottom: box.bottom, left: box.left, right: box.right };
  };
  const placements = AppState.solutionObservedPlacementLedger || [];
  const placement = placements.find(item => item.questionKey?.endsWith('#ordinal:10') && !item.continuationOf) || null;
  const decision = AppState.solutionDecisionLedger?.blocks?.[9] || null;
  const imageReady = image ? image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 : false;
  const overflow = pages.map((page, index) => {
    const body = page.querySelector('.page-body');
    return { pageNo: index + 1, delta: Math.max(0, (body?.scrollHeight || 0) - (body?.clientHeight || 0)) };
  });
  const q10Page = q10?.closest('.page') || null;
  return {
    url: location.href,
    sourceArchiveFile: AppState.sourceArchiveFile,
    mode: AppState.mode,
    metrics: window.__AP_RENDER_METRICS__ || null,
    pageCount: pages.length,
    questionBoxCount: new Set(boxes.map(box => box.dataset.sourceRef)).size,
    answerCount: root?.querySelectorAll('.sol-ans').length || 0,
    continuationCount: boxes.filter(box => box.classList.contains('sol-box-long')).length,
    fullwidthBoxCount: boxes.filter(box => box.dataset.solutionFullWidth === 'true').length,
    fullwidthColumnCount: root?.querySelectorAll('.sol-fullwidth-column').length || 0,
    q9: q9 && { ref: q9.dataset.sourceRef, pageNo: pageNumber(q9) },
    q10: q10 && {
      ref: q10.dataset.sourceRef,
      pageNo: pageNumber(q10),
      questionNumberText: q10.querySelector('.q-num')?.textContent || '',
      fullWidthData: q10.dataset.solutionFullWidth,
      boxClasses: q10.className,
      pageBoxes: q10Page?.querySelectorAll('.sol-box').length || 0,
      pageColumnCount: q10Page?.querySelectorAll('.sol-grid-col').length || 0,
      pageFullwidthColumnCount: q10Page?.querySelectorAll('.sol-fullwidth-column').length || 0,
      boxRect: rect(q10),
      fullwidthColumnRect: rect(q10.closest('.sol-fullwidth-column')),
      pageBodyRect: rect(q10Page?.querySelector('.page-body')),
      image: image && { src: image.getAttribute('src'), complete: image.complete, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, rect: rect(image), classes: image.closest('.sol-image-wrap')?.className },
      imageContainedInBox: imageReady && rect(image).left >= rect(q10).left - 1 && rect(image).right <= rect(q10).right + 1 && rect(image).bottom <= rect(q10).bottom + 2
    },
    q11: q11 && { ref: q11.dataset.sourceRef, pageNo: pageNumber(q11) },
    rowIsolation: Boolean(q9 && q10 && q11 && pageNumber(q9) < pageNumber(q10) && pageNumber(q10) < pageNumber(q11) && q10Page?.querySelectorAll('.sol-box').length === 1),
    placement: placement && { blockId: placement.blockId, pageNo: placement.pageNo, columnNo: placement.columnNo, columnSpan: placement.columnSpan, layoutTag: placement.layoutTag, measuredHeight: placement.measuredHeight, measurements: placement.measurements },
    decision: decision && { blockId: decision.blockId, fullWidth: decision.fullWidth, measuredHeight: decision.measuredHeight, measurements: decision.measurements, actualChunkCount: decision.actualChunkCount ?? null },
    allSvgReady: [...(root?.querySelectorAll('.sol-image-wrap img') || [])].every(item => item.complete && item.naturalWidth > 0 && item.naturalHeight > 0),
    svgCount: root?.querySelectorAll('.sol-image-wrap img[src$=".svg"],.sol-image-wrap img[src*=".svg?"]').length || 0,
    unrenderedMath: window.APRenderLoop?.unrenderedMathCount(root) ?? null,
    mathErrors: root?.querySelectorAll('mjx-merror').length || 0,
    maxPageBodyOverflow: Math.max(0, ...overflow.map(item => item.delta)),
    overflowingPages: overflow.filter(item => item.delta > 2),
    currentSession: (() => { const session = archiveScreenRuntime.currentSession; return session ? { sessionId: session.sessionId, activeMode: session.activeMode, modes: Object.fromEntries(Object.entries(session.modeSnapshots).map(([mode, snapshot]) => [mode, snapshot && { status: snapshot.status, pageCount: snapshot.pageCount }])) } : null; })()
  };
})()
