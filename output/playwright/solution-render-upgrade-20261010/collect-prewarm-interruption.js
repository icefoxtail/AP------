(() => {
  const runtime = archiveScreenRuntime.inspect();
  return {
    url: location.href,
    mode: AppState.mode,
    pageViewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    activeScreenReady: (() => { try { return JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'); } catch (_) { return null; } })(),
    initialMetrics: window.__AP_RENDER_METRICS__ || null,
    prewarmAudit: window.__AP_PREWARM_AUDIT__ || [],
    prewarmMetrics: window.__AP_PREWARM_METRICS__ || null,
    responsiveness: window.__AP_INPUT_RESPONSIVENESS_PROBE__ || null,
    attempts: runtime.attempts.map(attempt => ({ intentType: attempt.intentType, state: attempt.state, cacheStatus: attempt.cacheStatus, error: attempt.error, visibleReadyMs: attempt.visibleReadyMs, mode: attempt.metrics?.mode })),
    currentSession: runtime.currentSession && {
      sessionId: runtime.currentSession.sessionId,
      activeMode: runtime.currentSession.activeMode,
      modes: Object.fromEntries(Object.entries(runtime.currentSession.modeSnapshots).map(([mode, snapshot]) => [mode, snapshot && { status: snapshot.status, pageCount: snapshot.pageCount, builtRequestGeneration: snapshot.builtRequestGeneration }]))
    }
  };
})()
