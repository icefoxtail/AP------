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
  // 가벼운 홈·학교별 기출 (2026-11-23): 페이지가 `data-lazy-catalog`로 알리고 주소가 평범한 홈 또는 학교별 기출이면, 전체 카탈로그 받기를
  // 로드 때 시작하지 않고(meta-foundation-runtime.js가 이 값을 본다) 시험지 목록만으로 먼저 그린다. 카탈로그는 workspace 코드가
  // 목록을 그린 뒤(학교별 기출) 또는 필요한 화면·버튼이 처음 누를 때(홈) 시작한다.
  // 학교별 기출 주소에 교육과정·과목·계열(레코드에서 판정하는 값)이나 다른 값(uid, source 등)이 있으면 항상 지금처럼 바로 받는다.
  const LIGHT_FIND_KEYS = new Set(["perf", "warm", "view", "page", "grade", "school", "yearFrom", "yearTo", "axis", "query", "material", "file", "similarOnly"]);
  const lazyCatalogPage = (() => {
    try {
      if (!document.currentScript || !document.currentScript.hasAttribute("data-lazy-catalog")) return false;
      const params = new URLSearchParams(location.search);
      const view = params.get("view");
      if (view === "find") {
        for (const key of params.keys()) if (!LIGHT_FIND_KEYS.has(key)) return false;
        return true;
      }
      for (const [key, value] of params) if (!(key === "perf" || key === "warm" || (key === "view" && value === "home"))) return false;
      return true;
    } catch { return false; }
  })();
  const perf = typeof performance === "object" && performance ? performance : null;
  // ?warm=off turns the background warm-up of the catalog off (read when the page loads: the screen rewrites the address later).
  let warmParamOff = false;
  try { warmParamOff = new URLSearchParams(location.search).get("warm") === "off"; } catch { warmParamOff = false; }
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
  let silent = false;
  let aborted = false; // a background attempt failed and was forgotten: nothing moves the progress until somebody starts again
  const progress = { stage: "fetch", done: 0, total: 0, fraction: 0, label: STAGES.fetch.label, finished: false, failed: false, waiting: false };
  const listeners = new Set();
  function publish() {
    for (const listener of listeners) {
      try { listener(progress); } catch { /* 표시 오류가 준비를 막지 않는다 */ }
    }
  }
  function setStage(stage, patch = {}) {
    if (progress.finished || aborted || !STAGES[stage]) return; // after a forgotten background attempt its late events change nothing
    const def = STAGES[stage];
    progress.waiting = silent; // a warm-up in the background keeps the top line hidden until somebody actually waits for it
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
    if (warmActive) { mark(failed ? "warm-failed" : "warm-done"); settleWarm(); }
    if (verbose) report();
  }
  // 가벼운 홈이 시험지 목록만으로 그려졌고 카탈로그는 아직 시작하지 않았다: 진행 줄을 숨긴다(받기가 시작되면 다시 나타난다).
  function standby() {
    if (progress.finished || progress.waiting) return;
    progress.waiting = true;
    publish();
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
  // ---- 홈에서 한가할 때 카탈로그 미리 준비 (2026-11-23) ----
  // 홈이 그려진 뒤 한가할 때 카탈로그 준비(받기 -> 검증 -> 해석 -> 보관본 저장)를 미리 끝내 두면, 처음 누른 문제지 만들기·학교별 기출 검색이
  // 보관본 적중(또는 준비 끝난 상태)으로 바로 열린다. 새 경로가 아니라 평소 준비를 시작하는 시점만 앞당긴 것이다.
  // 준비 도중의 긴 메인 스레드 구간(검증·해석·색인·보관본 쓰기)이 홈의 스크롤·입력과 겹치지 않게, 미리 준비하는 동안에는 그 구간 앞에서
  // 사용자의 입력이 잠잠해질 때까지 기다린다(quiet). 누군가 실제로 기다리게 되면(demand: 화면 이동, 버튼, 누르기 직전 의도) 기다림을 모두 풀고
  // 진행 줄도 보인다.
  // 2026-11-23 실측(입력이 450ms 간격으로 계속될 때): 300ms는 입력 사이 틈에서 긴 계산이 시작해 다음 입력이 그 안에 걸렸다. 1초로 늘렸다.
  const QUIET_MS = 1000;
  // A moving pointer counts too: somebody heading for a button is about to click, and a click that lands inside a long step waits for it.
  const INPUT_EVENTS = ["keydown", "input", "wheel", "touchstart", "touchmove", "pointerdown", "pointermove", "scroll"];
  const SETTLE_MS = 10000; // 준비가 끝난 뒤 보관본 쓰기·색인 예열이 입력에 양보하는 최대 시간
  let warmActive = false; // 미리 준비 중이고 아직 아무도 기다리지 않는다
  let warmStartedFlag = false; // 미리 준비로 시작한 시도가 진행 중이다(누군가 기다리기 시작했어도 끝날 때까지 true)
  let settleUntil = 0;
  let settleTimer = null;
  const gateOn = () => warmActive || nowMs() < settleUntil;
  let lastInputAt = -Infinity;
  const quietWaiters = new Set();
  let quietTimer = null;
  const nowMs = () => (perf ? perf.now() : Date.now());
  const onInput = () => { lastInputAt = nowMs(); };
  function listenInput(on) {
    if (typeof document !== "object" || !document) return;
    for (const name of INPUT_EVENTS) {
      if (on && typeof document.addEventListener === "function") document.addEventListener(name, onInput, { passive: true, capture: true });
      else if (!on && typeof document.removeEventListener === "function") document.removeEventListener(name, onInput, { capture: true });
    }
  }
  function releaseQuiet() {
    clearTimeout(quietTimer);
    quietTimer = null;
    const waiters = [...quietWaiters];
    quietWaiters.clear();
    for (const resolve of waiters) resolve();
  }
  function pollQuiet() {
    if (quietTimer !== null || !quietWaiters.size) return;
    const wait = QUIET_MS - (nowMs() - lastInputAt);
    quietTimer = setTimeout(() => {
      quietTimer = null;
      if (!gateOn() || nowMs() - lastInputAt >= QUIET_MS) releaseQuiet(); else pollQuiet();
    }, Math.max(20, wait));
  }
  // 미리 준비하는 동안만 기다린다. 그 밖에는(누군가 기다리는 중 포함) 곧바로 풀린다.
  function quiet() {
    if (!gateOn() || nowMs() - lastInputAt >= QUIET_MS) return Promise.resolve();
    return new Promise((resolve) => { quietWaiters.add(resolve); pollQuiet(); });
  }
  // 미리 준비하지 않는 이유(없으면 ""). hidden만 나중에 다시 볼 수 있다.
  function warmBlocked() {
    try {
      if (warmParamOff) return "off";
      const connection = typeof navigator === "object" && navigator ? (navigator.connection || navigator.mozConnection || navigator.webkitConnection) : null;
      if (connection && connection.saveData === true) return "save-data";
      if (connection && /^(slow-)?2g$/.test(String(connection.effectiveType || ""))) return "slow-network";
      // A ready catalog is about 14 MB of download and 330 MB of script memory: not worth it on a phone or a small-memory device.
      const device = typeof navigator === "object" && navigator ? navigator : null;
      if (device && (device.userAgentData?.mobile === true || /Android|iPhone|iPad|iPod|Mobi/i.test(String(device.userAgent || "")))) return "mobile";
      if (device && typeof device.deviceMemory === "number" && device.deviceMemory < 4) return "low-memory";
      if (typeof document === "object" && document && document.visibilityState === "hidden") return "hidden";
    } catch { return "unknown"; /* 판단할 수 없으면 미리 준비하지 않는 쪽이 안전하다 */ }
    return "";
  }
  function warmBegin() {
    if (warmActive || progress.finished) return;
    warmActive = true;
    aborted = false;
    warmStartedFlag = true;
    silent = true;
    listenInput(true);
    mark("warm-start");
  }
  // 준비가 끝났다: 입력 감시와 진행 줄 숨김을 끝낸다. 보관본 쓰기·색인 예열만 최대 SETTLE_MS 동안 입력에 양보하고(그 뒤에는 입력 중이어도 한다),
  // 그때 입력 감시도 뗀다.
  function settleWarm() {
    warmActive = false;
    silent = false;
    warmStartedFlag = false;
    settleUntil = nowMs() + SETTLE_MS;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(closeSettle, SETTLE_MS);
  }
  function closeSettle() {
    settleUntil = 0;
    clearTimeout(settleTimer);
    settleTimer = null;
    listenInput(false);
    releaseQuiet();
  }
  // 미리 준비로 시작한 시도가 실패했고 아직 아무도 기다리지 않았다: 실패를 버리고 처음 상태로 되돌린다(화면에 아무것도 보이지 않는다).
  // 누군가 이미 기다리는 중이면 아무것도 하지 않고 false를 돌려준다(그 실패는 보여야 한다).
  function warmAbort() {
    if (!warmActive) return false;
    warmActive = false;
    warmStartedFlag = false;
    silent = false;
    listenInput(false);
    releaseQuiet();
    progress.stage = "fetch"; progress.done = 0; progress.total = 0; progress.fraction = 0; progress.label = STAGES.fetch.label;
    progress.finished = false; progress.failed = false; progress.waiting = true;
    aborted = true;
    spans.clear();
    bundleDoneAt = null;
    mark("warm-failed");
    publish();
    return true;
  }
  // 누군가 카탈로그를 기다리기 시작했다: 기다림을 풀고 진행 줄을 보인다. 미리 준비 중이 아니면 아무 일도 하지 않는다.
  function demand() {
    if (aborted) { aborted = false; progress.done = 0; progress.total = 0; progress.fraction = 0; } // a new start by a request: events count again from here
    if (!warmActive) { if (settleUntil) closeSettle(); return; }
    warmActive = false;
    silent = false;
    listenInput(false);
    releaseQuiet();
    mark("warm-demanded");
    if (!progress.finished) { progress.waiting = false; publish(); }
  }
  function idle(callback, timeout = 3000) {
    // 미리 준비하는 동안의 한가한 때 작업(색인 예열, 보관본 쓰기)도 입력이 잠잠할 때만 한다.
    const run = (deadline) => quiet().then(() => callback(deadline));
    if (typeof requestIdleCallback === "function") return requestIdleCallback(run, { timeout });
    return setTimeout(() => run({ didTimeout: true, timeRemaining: () => 0 }), 200);
  }
  // 숨을 한 번 돌려 입력을 처리하게 하고, 미리 준비 중이면 입력이 잠잠할 때까지 기다린다: 긴 계산 앞에서 쓴다.
  const pause = () => yieldToMain().then(quiet);

  // ---- canonical.loadInputBundle에 끼우는 fetcher ------------------------------------------------
  const MANIFEST_RE = /data\/archive2-canonical-input-manifest\.json$/;
  const CATALOG_RE = /data\/archive2-catalog\.json$/;
  const PACK_RE = /data\/meta-foundation\/runtime\/[a-z0-9-]+-v[0-9]+\.json$/;
  // canonical.reviewedRegistrationProofPaths와 같은 모양만 받는다(다른 모양은 미리 받지 않고 canonical이 거부하게 둔다).
  const REVIEWED_REF_RE = /"reviewedExam_[^"]*"\s*:\s*"archive\/(data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_-]+\.json)"/g;
  // 미리 받는 reviewed-exam-meta는 한 파일이 몇 KB뿐인 요청 수백 개다. HTTP/2에서는 한 연결로 여러 요청이 동시에 오가므로
  // 동시 요청 수를 6에 묶어 두면 요청 왕복(RTT)이 줄줄이 쌓여 진입이 느려진다(2026-11-23 실측: RTT 40ms, 100Mbps에서 13.3초 -> 7.0초).
  // HTTP/1.1이면 브라우저가 알아서 호스트당 6개로 줄 세우므로 더 큰 값이 해롭지 않다.
  const EARLY_POOL = 64;

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

    const gated = (value) => paintGate.then(quiet).then(() => value);
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
      if (state.finished || state.waiting) { root.hidden = true; return; }
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
    setStage, standby, onProgress, progress, mountProgress, catalogDeferred: lazyCatalogPage,
    firstPaint, whenPainted, nextPaint, yield: yieldToMain, idle, refresh: () => publish(),
    pause, quiet, warmBlocked, warmBegin, warmAbort, demand, warmStarted: () => warmStartedFlag,
    fetcher: makeFetcher, bundleDone,
  });
})();
