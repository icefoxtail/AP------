(() => {
  const audit = {
    installedAt: performance.now(),
    clickStart: null,
    firstPagePreparedAt: null,
    previewAttachedAt: null,
    previewPaintApproxAt: null,
    finalVisibleReadyAt: null,
    finalPages: null,
    finalOutputReadiness: null,
    printRequestedAt: null,
    beforeprintAt: null,
    windowPrintAt: null,
    printRoot: null,
    previewHiddenForPrint: null,
    safePrintFinishedAt: null,
    safePrintError: null,
    activeModeAtFirstPage: null,
    activeRootPagesAtFirstPage: null,
    renderReadyAtFirstPage: null,
    outputReadinessAtFirstPage: null
  };
  window.__AP_PROGRESSIVE_FIRST_PAGE_AUDIT__ = audit;
  let preview = null;
  const previewStyle = document.createElement('style');
  previewStyle.textContent = '@media print { #progressive-first-page-preview { display:none !important; } }';
  document.head.appendChild(previewStyle);
  window.addEventListener('beforeprint', () => {
    audit.beforeprintAt = performance.now();
    if (preview) preview.style.display = 'none';
  });
  window.addEventListener('afterprint', () => {
    if (preview) preview.remove();
    previewStyle.remove();
  });
  window.__AP_SOLUTION_FIRST_PAGE_EXPERIMENT__ = async ({ page, pagePlan }) => {
    if (pagePlan.pageNo !== 1 || preview) return;
    audit.firstPagePreparedAt = performance.now();
    audit.pageNo = pagePlan.pageNo;
    audit.solutionBoxesOnFirstPage = page.querySelectorAll('.sol-box').length;
    audit.continuationsOnFirstPage = page.querySelectorAll('.sol-box-long').length;
    audit.unrenderedMathOnFirstPage = window.APRenderLoop.unrenderedMathCount(page);
    audit.imagesOnFirstPage = [...page.querySelectorAll('.sol-image-wrap img')].map(image => ({ src: image.getAttribute('src'), ready: image.complete && image.naturalWidth > 0 }));
    audit.activeModeAtFirstPage = AppState.mode;
    audit.activeRootPagesAtFirstPage = document.querySelectorAll('#print-area .page').length;
    audit.renderReadyAtFirstPage = document.documentElement.dataset.apRenderReady === 'true';
    audit.outputReadinessAtFirstPage = window.__AP_OUTPUT_RENDER_READY__ || null;
    preview = page.cloneNode(true);
    preview.id = 'progressive-first-page-preview';
    preview.style.cssText = 'position:fixed;top:20px;right:20px;width:210mm;height:297mm;transform:scale(.55);transform-origin:top right;z-index:2147483000;pointer-events:none;overflow:hidden;background:#fff;box-shadow:0 3px 18px rgba(15,23,42,.28);visibility:visible;';
    document.body.appendChild(preview);
    audit.previewAttachedAt = performance.now();
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    audit.previewPaintApproxAt = performance.now();
    if (audit.printOnFirstPage === true) {
      audit.printRequestedAt = performance.now();
      setTimeout(() => {
        Promise.resolve(window.safePrint('vector')).then(() => {
          audit.safePrintFinishedAt = performance.now();
        }).catch(error => {
          audit.safePrintError = String(error?.message || error);
          audit.safePrintFinishedAt = performance.now();
        });
      }, 0);
    }
  };
  window.addEventListener('beforeprint', () => { audit.beforeprintPreviewDisplay = preview ? getComputedStyle(preview).display : 'removed'; }, { capture: true });
  const observer = new MutationObserver(() => {
    try {
      const state = JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null');
      if (state?.event === 'VISIBLE_READY' && state.committed && audit.finalVisibleReadyAt === null) {
        audit.finalVisibleReadyAt = performance.now();
        audit.finalPages = document.querySelectorAll('#print-area .page').length;
        audit.finalOutputReadiness = window.__AP_OUTPUT_RENDER_READY__ || null;
      }
    } catch (_) {}
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ap-screen-runtime'] });
  window.__AP_PROGRESSIVE_FIRST_PAGE_EXPERIMENT_CLEANUP__ = () => {
    observer.disconnect();
    preview?.remove();
    previewStyle.remove();
    delete window.__AP_SOLUTION_FIRST_PAGE_EXPERIMENT__;
  };
  const originalPrint = window.print;
  window.__AP_PROGRESSIVE_FIRST_PAGE_ORIGINAL_PRINT__ = originalPrint;
  window.print = () => {
    audit.windowPrintAt = performance.now();
    audit.printRoot = {
      mode: AppState.mode,
      pages: document.querySelectorAll('#print-area .page').length,
      mathReady: window.APRenderLoop.unrenderedMathCount(document.querySelector('#print-area')) === 0,
      outputReadiness: window.__AP_OUTPUT_RENDER_READY__ || null,
      renderReady: document.documentElement.dataset.apRenderReady === 'true'
    };
    window.dispatchEvent(new Event('beforeprint'));
    audit.previewHiddenForPrint = preview ? getComputedStyle(preview).display === 'none' : true;
    window.dispatchEvent(new Event('afterprint'));
  };
})();
