(() => {
  const runtime = archiveScreenRuntime.inspect();
  const current = archiveScreenRuntime.currentSession;
  return {
    url: location.href,
    mode: AppState.mode,
    pageViewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
    screenReady: (() => { try { return JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'); } catch (_) { return null; } })(),
    prewarmAudit: window.__AP_PREWARM_AUDIT__ || [],
    responsiveness: window.__AP_INPUT_RESPONSIVENESS_PROBE__ || null,
    attempts: runtime.attempts.map(attempt => ({
      intentType: attempt.intentType,
      state: attempt.state,
      cacheStatus: attempt.cacheStatus,
      error: attempt.error,
      visibleReadyMs: attempt.visibleReadyMs,
      requestedTargetSessionId: attempt.requestedTargetSessionId,
      metrics: attempt.metrics ? {
        mode: attempt.metrics.mode,
        foreground: attempt.metrics.foreground,
        renderReadyMs: attempt.metrics.renderReadyMs,
        visibleReadyMs: attempt.metrics.visibleReadyMs,
        mathJaxCalls: attempt.metrics.mathJaxCalls,
        mathJaxTotalMs: attempt.metrics.mathJaxTotalMs,
        calls: attempt.metrics.calls,
        phases: attempt.metrics.phases,
        pages: attempt.metrics.pages,
        layoutBarrierCount: attempt.metrics.layoutBarrierCount,
        rafCount: attempt.metrics.rafCount,
        unrenderedMath: attempt.metrics.unrenderedMath
      } : null
    })),
    currentSession: current ? {
      sessionId: current.sessionId,
      activeMode: current.activeMode,
      modeSnapshots: Object.fromEntries(Object.entries(current.modeSnapshots).map(([mode, snapshot]) => [mode, snapshot && {
        mode: snapshot.mode,
        status: snapshot.status,
        pageCount: snapshot.pageCount,
        sessionId: snapshot.sessionId,
        builtRequestGeneration: snapshot.builtRequestGeneration,
        key: snapshot.key
      }]))
    } : null,
    visibleReadiness: (() => { try { return JSON.parse(document.documentElement.dataset.apPrintReadiness || 'null'); } catch (_) { return null; } })(),
    outputRenderReadiness: window.__AP_OUTPUT_RENDER_READY__ || null
  };
})()
