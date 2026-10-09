(() => ({
  url: location.href,
  mode: AppState.mode,
  pageViewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
  progressivePlanProbe: window.__AP_PROGRESSIVE_FIRST_PAGE_PROBE__ || null,
  progressiveScreenHarness: window.__AP_PROGRESSIVE_FIRST_PAGE_AUDIT__ || null,
  metrics: window.__AP_RENDER_METRICS__ || null,
  screenReady: (() => { try { return JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'); } catch (_) { return null; } })(),
  outputReadiness: window.__AP_OUTPUT_RENDER_READY__ || null,
  outputRenderReadiness: window.__AP_OUTPUT_RENDER_READY__ || null,
  printReadiness: (() => { try { return JSON.parse(document.documentElement.dataset.apPrintReadiness || 'null'); } catch (_) { return null; } })(),
  visiblePages: document.querySelectorAll('#print-area .page').length,
  solutionBoxes: document.querySelectorAll('#print-area .sol-box').length,
  solutionAnswers: document.querySelectorAll('#print-area .sol-ans').length,
  solutionImages: [...document.querySelectorAll('#print-area .sol-image-wrap img')].map(image => ({ src: image.getAttribute('src'), ready: image.complete && image.naturalWidth > 0 })),
  unrenderedMath: window.APRenderLoop?.unrenderedMathCount(document.querySelector('#print-area')) ?? null,
  mathErrors: document.querySelectorAll('#print-area mjx-merror').length,
  currentSession: (() => { const session = archiveScreenRuntime.currentSession; return session ? { sessionId: session.sessionId, activeMode: session.activeMode, modes: Object.fromEntries(Object.entries(session.modeSnapshots).map(([mode, snapshot]) => [mode, snapshot && { status: snapshot.status, pageCount: snapshot.pageCount }])) } : null; })()
}))()
