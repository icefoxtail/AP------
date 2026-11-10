(function () {
  "use strict";
  // Archive 2.0 첫 화면 먼저 (2026-11-10).
  // 무거운 자료 준비(받기 -> 해시 확인 -> 해석 -> 문항 목록 정리)는 그대로 하되, 순서를 바꾼다.
  //  - 카탈로그가 필요 없는 화면(홈, 보관함, 출제 내역)은 준비를 기다리지 않고 먼저 그린다.
  //  - 준비 상황(진행 줄)과 단계별 소요 시간(performance.measure)을 알린다.
  //  - reviewed-exam-meta를 카탈로그와 동시에 받아 2차 폭포를 없앤다. 해시 검증은 canonical이 그대로 한다.
  //  - 첫 화면이 그려지기 전에는 큰 자료를 canonical에 넘기지 않아(내려받기는 계속) 해시·해석이 첫 그리기를 막지 않는다.
  // 이 파일은 자료를 해석하거나 검증하지 않는다. canonical.loadInputBundle이 받는 fetcher만 바꿔 끼운다.
  const NS = "archive2:boot:";
  const perf = typeof performance === "object" && performance ? performance : null;
  let verbose = false;
  try { verbose = new URLSearchParams(location.search).get("perf") === "1"; } catch { verbose = false; }

  const mark = (name) => {
    try { perf?.mark(NS + name); } catch { /* 계측 실패는 화면에 영향을 주지 않는다 */ }
  };
  const spans = new Map(); // 시작 시각이 열려 있는 구간
  const SPAN_ORDER = ["manifest", "catalog-fetch", "catalog-verify", "reviewed-meta", "resolve", "index", "first-paint", "ready"];
  function begin(name) {
    if (!perf || spans.has(name)) return;
    spans.set(name, perf.now());
  }
  function span(name, start, end) {
    if (!perf) return;
    try { perf.measure(NS + name, { start, end }); } catch { /* 오래된 브라우저 */ }
  }
  function end(name) {
    if (!perf || !spans.has(name)) return;
    const start = spans.get(name);
    spans.delete(name);
    span(name, start, perf.now());
  }

  // ---- 진행 상황 ------------------------------------------------------------------------------
  // 단계 구간은 실제로 끝난 일(받은 파일 수, 번들 해석 끝, 목록 정리 끝)에서만 움직인다. 타이머로 늘리지 않는다.
  const STAGES = {
    fetch: { from: 0, to: 0.6, label: "자료 받는 중" },
    verify: { from: 0.62, to: 0.62, label: "자료 확인 중" },
    resolve: { from: 0.8, to: 0.8, label: "문항 목록 정리 중" },
    index: { from: 0.92, to: 0.92, label: "문항 목록 정리 중" },
    ready: { from: 1, to: 1, label: "" },
    failed: { from: 0, to: 0, label: "" },
  };
  const progress = { stage: "fetch", done: 0, total: 0, fraction: 0, label: STAGES.fetch.label, finished: false, failed: false };
  const listeners = new Set();
  function publish() {
    for (const listener of listeners) {
      try { listener(progress); } catch { /* 표시 오류가 준비를 막지 않는다 */ }
    }
  }
  function setStage(stage, patch = {}) {
    if (progress.finished || !STAGES[stage]) return;
    const def = STAGES[stage];
    progress.stage = stage;
    Object.assign(progress, patch);
    let fraction = def.from;
    if (stage === "fetch" && progress.total) fraction = def.from + (def.to - def.from) * Math.min(1, progress.done / progress.total);
    progress.fraction = Math.max(progress.fraction, fraction);
    progress.label = def.label;
    publish();
  }
  function finish(failed) {
    if (progress.finished) return;
    progress.finished = true;
    progress.failed = Boolean(failed);
    progress.stage = failed ? "failed" : "ready";
    if (!failed) progress.fraction = 1;
    publish();
    flushSpans();
    if (failed) mark("failed"); else mark("ready");
    if (verbose) report();
  }
  function onProgress(listener) {
    listeners.add(listener);
    try { listener(progress); } catch { /* 같은 이유 */ }
    return () => listeners.delete(listener);
  }

  // ---- 첫 그리기 문 ---------------------------------------------------------------------------
  let paintReleased = false;
  let releasePaint = () => {};
  const paintGate = new Promise((resolve) => { releasePaint = resolve; });
  const gateTimer = setTimeout(() => open("timeout"), 4000); // 화면 코드가 실패해도 준비가 영원히 멈추지 않는 안전 장치
  function open(reason) {
    if (paintReleased) return;
    paintReleased = true;
    clearTimeout(gateTimer);
    mark(reason === "paint" ? "first-paint" : "first-paint-timeout");
    releasePaint();
  }
  // 첫 화면을 그린 직후에 부른다. 다음 프레임이 지난 뒤 문을 연다(숨은 탭은 프레임이 없으므로 바로).
  function firstPaint() {
    if (paintReleased) return paintGate;
    const done = () => setTimeout(() => open("paint"), 0);
    if (typeof document === "object" && document.hidden || typeof requestAnimationFrame !== "function") done();
    else requestAnimationFrame(done);
    return paintGate;
  }
  const whenPainted = () => paintGate;
  // Resolves after the next frame has been presented (immediately in a hidden tab, which has no frames).
  function nextPaint() {
    return new Promise((resolve) => {
      if (typeof document === "object" && document.hidden || typeof requestAnimationFrame !== "function") setTimeout(resolve, 0);
      else requestAnimationFrame(() => setTimeout(resolve, 0));
    });
  }

  function yieldToMain() {
    if (globalThis.scheduler && typeof globalThis.scheduler.yield === "function") return globalThis.scheduler.yield();
    if (typeof MessageChannel === "function") {
      return new Promise((resolve) => {
        const channel = new MessageChannel();
        channel.port1.onmessage = () => { channel.port1.close(); resolve(); };
        channel.port2.postMessage(0);
      });
    }
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
  function idle(callback, timeout = 3000) {
    if (typeof requestIdleCallback === "function") return requestIdleCallback(callback, { timeout });
    return setTimeout(() => callback({ didTimeout: true, timeRemaining: () => 0 }), 200);
  }

  // ---- canonical.loadInputBundle에 끼우는 fetcher ------------------------------------------------
  const MANIFEST_RE = /data\/archive2-canonical-input-manifest\.json$/;
  const CATALOG_RE = /data\/archive2-catalog\.json$/;
  const PACK_RE = /data\/meta-foundation\/runtime\/[a-z0-9-]+-v[0-9]+\.json$/;
  // canonical.reviewedRegistrationProofPaths와 같은 모양만 받는다(다른 모양은 미리 받지 않고 canonical이 거부하게 둔다).
  const REVIEWED_REF_RE = /"reviewedExam_[^"]*"\s*:\s*"archive\/(data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_-]+\.json)"/g;
  const EARLY_POOL = 6;

  function createFetcher(rawFetch) {
    const early = new Map(); // 절대 주소 -> 미리 받는 중인 결과
    const waiting = [];
    let active = 0;
    let earlyStart = null;
    let earlyEnd = null;
    let catalogFetchStart = null;
    let catalogFetchEnd = null;
    let manifestStart = null;
    let manifestEnd = null;
    let base = null;

    const gated = (value) => paintGate.then(() => value);
    const noteStart = () => { progress.total += 1; setStage("fetch"); };
    // 요청한 파일을 모두 받았으면 남은 일은 해시 확인과 해석이다.
    const noteDone = () => { progress.done += 1; setStage(progress.done >= progress.total ? "verify" : "fetch"); };

    function scanPack(url, text) {
      const found = [];
      REVIEWED_REF_RE.lastIndex = 0;
      let match;
      while ((match = REVIEWED_REF_RE.exec(text))) found.push(match[1]);
      for (const path of new Set(found)) {
        let absolute;
        try { absolute = new URL(path, base || url).toString(); } catch { continue; }
        startEarly(absolute);
      }
    }
    function startEarly(url) {
      if (early.has(url)) return;
      let resolve;
      let reject;
      const promise = new Promise((ok, fail) => { resolve = ok; reject = fail; });
      promise.catch(() => {}); // canonical이 아직 묻지 않았을 때 처리되지 않은 거부로 보이지 않게 한다
      early.set(url, promise);
      noteStart();
      waiting.push({ url, resolve, reject });
      pump();
    }
    function pump() {
      while (active < EARLY_POOL && waiting.length) {
        const job = waiting.shift();
        active += 1;
        if (earlyStart === null && perf) earlyStart = perf.now();
        Promise.resolve()
          .then(() => rawFetch(job.url))
          .then(async (response) => ({ ok: response.ok, status: response.status, text: response.ok ? await response.text() : "" }))
          .then(job.resolve, job.reject)
          .finally(() => {
            active -= 1;
            noteDone();
            if (perf) earlyEnd = perf.now();
            pump();
          });
      }
    }

    function direct(url) {
      const isManifest = MANIFEST_RE.test(url);
      const isCatalog = CATALOG_RE.test(url);
      const isPack = PACK_RE.test(url);
      if (isManifest) { base = url.replace(MANIFEST_RE, ""); if (perf && manifestStart === null) manifestStart = perf.now(); }
      if (isCatalog && perf && catalogFetchStart === null) catalogFetchStart = perf.now();
      if (!isManifest) noteStart();
      return Promise.resolve(rawFetch(url)).then((response) => {
        const ok = response.ok;
        const status = response.status;
        let cached = null;
        return {
          ok,
          status,
          text() {
            if (!cached) {
              cached = response.text().then((text) => {
                if (isManifest && perf) manifestEnd = perf.now();
                if (isCatalog && perf) catalogFetchEnd = perf.now();
                if (isPack && ok) scanPack(url, text); // 미리 받을 목록을 먼저 더한 뒤 끝난 것으로 센다
                if (!isManifest) noteDone();
                // The manifest (23KB) is never held: every other download starts from it.
                return isManifest ? text : gated(text);
              });
            }
            return cached;
          },
        };
      });
    }

    function fetcher(url) {
      const key = String(url);
      if (early.has(key)) {
        const pending = early.get(key);
        early.delete(key);
        return pending.then(
          (result) => ({ ok: result.ok, status: result.status, text: () => gated(result.text) }),
          () => direct(key), // 미리 받기가 실패하면 평소 방식으로 한 번 더 받는다
        );
      }
      return direct(key);
    }
    fetcher.flush = () => {
      if (manifestStart !== null && manifestEnd !== null) span("manifest", manifestStart, manifestEnd);
      if (catalogFetchStart !== null && catalogFetchEnd !== null) span("catalog-fetch", catalogFetchStart, catalogFetchEnd);
      if (earlyStart !== null && earlyEnd !== null) span("reviewed-meta", earlyStart, earlyEnd);
      if (catalogFetchEnd !== null && perf) span("catalog-verify", catalogFetchEnd, bundleDoneAt ?? perf.now());
    };
    return fetcher;
  }

  let bundleDoneAt = null;
  let activeFetcher = null;
  function makeFetcher(rawFetch) {
    activeFetcher = createFetcher(rawFetch);
    return activeFetcher;
  }
  // canonical.loadInputBundle이 끝난 시점(받기와 해시 확인이 모두 끝남).
  function bundleDone() {
    if (perf && bundleDoneAt === null) bundleDoneAt = perf.now();
    setStage("resolve");
  }
  function flushSpans() {
    try { activeFetcher?.flush(); } catch { /* 계측 실패 */ }
  }

  // 진행 줄. 맨 위 얇은 줄(workspace.html의 #boot-progress)과, 화면 안 자리 표시(홈의 기출 칸, 준비 중 화면)가
  // data-boot-bar / data-boot-label / data-boot-count 속성으로 같은 진행 상황을 보여 준다.
  // 화면 낭독기에는 단계 문구만 읽히고(맨 위 줄이 role=status), 자세한 숫자(aria-hidden)는 읽히지 않는다.
  function mountProgress(root) {
    if (!root || typeof document !== "object") return () => {};
    return onProgress((state) => {
      if (state.finished) { root.hidden = true; return; }
      root.hidden = false;
      const pct = Math.round(state.fraction * 100) + "%";
      const countText = state.stage === "fetch" && state.total ? `(${state.done}/${state.total})` : "";
      for (const bar of document.querySelectorAll("[data-boot-bar]")) if (bar.style.width !== pct) bar.style.width = pct;
      for (const label of document.querySelectorAll("[data-boot-label]")) if (label.textContent !== state.label) label.textContent = state.label;
      for (const count of document.querySelectorAll("[data-boot-count]")) if (count.textContent !== countText) count.textContent = countText;
    });
  }

  function report() {
    try {
      const rows = [];
      for (const name of SPAN_ORDER) {
        const measure = perf.getEntriesByName(NS + name, "measure").at(-1);
        const point = perf.getEntriesByName(NS + name, "mark").at(-1);
        if (measure) rows.push({ 단계: name, 시작ms: Math.round(measure.startTime), 걸린ms: Math.round(measure.duration) });
        else if (point) rows.push({ 단계: name, 시작ms: Math.round(point.startTime), 걸린ms: "" });
      }
      console.table(rows);
    } catch { /* 계측 표시는 선택 사항 */ }
  }

  mark("start");
  window.Archive2Boot = Object.freeze({
    mark, begin, end, span, finish, report,
    setStage, onProgress, progress, mountProgress,
    firstPaint, whenPainted, nextPaint, yield: yieldToMain, idle, refresh: () => publish(),
    fetcher: makeFetcher, bundleDone,
  });
})();
