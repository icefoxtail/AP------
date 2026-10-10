(() => {
  const audit = { installedAt: performance.now(), missingMeasurements: 0, plannedPages: null, firstPagePlanItems: null, planReadyAt: null, firstPageDomReadyAt: null, visibleReadyAt: null, firstSolutionVisibleAt: null, printReadyAt: null, firstPagePageNo: null, firstPageDomBoxCount: 0 };
  const baseAuthority = window.APLayoutAuthority;
  const baseMaterializer = window.APArchiveLayoutMaterializer;
  const originalAppendChild = Element.prototype.appendChild;
  const originalPlan = baseAuthority.planMeasuredSolutionLayout;
  const originalSolution = baseMaterializer.solution;
  window.__AP_PROGRESSIVE_FIRST_PAGE_PROBE__ = audit;
  window.APLayoutAuthority = Object.freeze({
    ...baseAuthority,
    planMeasuredSolutionLayout(input) {
      const plan = originalPlan.call(baseAuthority, input);
      if (plan.status === 'NEEDS_MEASUREMENT') audit.missingMeasurements += 1;
      if (plan.status === 'READY') {
        audit.planReadyAt ??= performance.now();
        audit.plannedPages = plan.pages.length;
        audit.firstPagePlanItems = plan.pages[0]?.itemPlacements.length || 0;
      }
      return plan;
    }
  });
  window.APArchiveLayoutMaterializer = Object.freeze({
    ...baseMaterializer,
    solution: async args => {
      const deps = { ...args.deps, makePage: (area, type, pageNo) => {
        const page = args.deps.makePage(area, type, pageNo);
        page.dataset.progressiveExperimentPageNo = String(pageNo);
        return page;
      } };
      return originalSolution({ ...args, deps });
    }
  });
  Element.prototype.appendChild = function(node) {
    const result = originalAppendChild.call(this, node);
    if (node?.classList?.contains('sol-box')) {
      const page = this.closest?.('.page');
      if (page?.dataset.progressiveExperimentPageNo === '1') {
        audit.firstPageDomBoxCount += 1;
        audit.firstPagePageNo = 1;
        if (audit.firstPagePlanItems && audit.firstPageDomBoxCount >= audit.firstPagePlanItems && audit.firstPageDomReadyAt === null) audit.firstPageDomReadyAt = performance.now();
      }
    }
    return result;
  };
  const observer = new MutationObserver(() => {
    try {
      const state = JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null');
      if (state?.event === 'VISIBLE_READY' && state.committed && audit.visibleReadyAt === null) audit.visibleReadyAt = performance.now();
      if (document.querySelector('#print-area .page') && audit.firstSolutionVisibleAt === null) audit.firstSolutionVisibleAt = performance.now();
      const readiness = JSON.parse(document.documentElement.dataset.apPrintReadiness || 'null');
      if (readiness?.states?.includes?.('PRINT_READY') && audit.printReadyAt === null) audit.printReadyAt = performance.now();
    } catch (_) {}
  });
  observer.observe(document.documentElement, { attributes: true, subtree: true, attributeFilter: ['data-ap-screen-runtime', 'data-ap-print-readiness', 'id'] });
  window.__AP_PROGRESSIVE_FIRST_PAGE_PROBE_CLEANUP__ = () => {
    observer.disconnect();
    Element.prototype.appendChild = originalAppendChild;
    window.APLayoutAuthority = baseAuthority;
    window.APArchiveLayoutMaterializer = baseMaterializer;
    document.querySelectorAll('[data-progressive-experiment-page-no]').forEach(node => node.removeAttribute('data-progressive-experiment-page-no'));
  };
})();
