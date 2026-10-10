(() => {
  const probe = { inputEvents: [], longTasks: [], maxFrameGapMs: 0, frames: 0, installedAt: performance.now() };
  window.__AP_INPUT_RESPONSIVENESS_PROBE__ = probe;
  const record = event => {
    if (event.isTrusted === false) return;
    const dispatchAt = performance.now();
    probe.inputEvents.push({ type: event.type, eventTimeStamp: event.timeStamp, dispatchAt, queueDelayMs: dispatchAt - event.timeStamp, target: event.target?.id || event.target?.className || event.target?.tagName || '' });
  };
  for (const type of ['pointerdown', 'wheel', 'keydown', 'input', 'click']) document.addEventListener(type, record, { capture: true, passive: type === 'wheel' || type === 'pointerdown' });
  if (window.PerformanceObserver) {
    try {
      const observer = new PerformanceObserver(list => probe.longTasks.push(...list.getEntries().map(entry => ({ startTime: entry.startTime, duration: entry.duration }))));
      observer.observe({ type: 'longtask', buffered: true });
    } catch (_) {}
  }
  let last = performance.now();
  const frame = now => {
    probe.maxFrameGapMs = Math.max(probe.maxFrameGapMs, now - last);
    probe.frames += 1;
    last = now;
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
