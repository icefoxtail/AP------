(() => {
  const runtime = archiveScreenRuntime.inspect();
  return {
    url: location.href,
    mode: AppState.mode,
    renderReady: document.documentElement.dataset.apRenderReady === 'true',
    screen: (() => { try { return JSON.parse(document.documentElement.dataset.apScreenRuntime || 'null'); } catch (_) { return null; } })(),
    sourceKind: runtime.currentSession?.sourceKind || runtime.currentSession?.sourceKind || null,
    prewarmAudit: window.__AP_PREWARM_AUDIT__ || [],
    attempts: runtime.attempts.map(a => ({ intentType: a.intentType, state: a.state, mode: a.metrics?.mode || null, foreground: a.metrics?.foreground ?? null })),
    modeSnapshots: runtime.currentSession ? Object.fromEntries(Object.entries(runtime.currentSession.modeSnapshots).map(([mode, snapshot]) => [mode, snapshot && { status: snapshot.status, pageCount: snapshot.pageCount }])) : null
  };
})()
