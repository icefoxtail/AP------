const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const library = require("../archive/archive2-library.js");
const output = require("../archive/archive2-output.js");
const contract = require("../archive/archive2-output-contract.js");

function storage(initial = {}, maxBytes = Infinity) {
  const values = new Map(Object.entries(initial));
  return {
    get length() { return values.size; },
    key(index) { return [...values.keys()][index] ?? null; },
    getItem(key) { return values.get(String(key)) ?? null; },
    setItem(key, value) {
      const next = new Map(values);
      next.set(String(key), String(value));
      const bytes = [...next].reduce((sum, [k, v]) => sum + Buffer.byteLength(k) + Buffer.byteLength(v), 0);
      if (bytes > maxBytes) throw new DOMException("Quota exceeded", "QuotaExceededError");
      values.set(String(key), String(value));
    },
    removeItem(key) { values.delete(String(key)); },
    snapshot() { return Object.fromEntries(values); },
  };
}

function paper(id, title) {
  return {
    id,
    title,
    grade: "고1",
    subject: "공통수학1",
    question_count: 1,
    created_at: "2026-09-29T00:00:00.000Z",
    snapshot: {
      questions: [{ questionUid: "qid_v1_test", image: "data:image/png;base64,AQID" }],
      meta: { title, qpp: 4, questionUids: ["qid_v1_test"], printHeaderOptions: { title }, includeQr: false },
    },
  };
}

function outputWithCapture() {
  const envelopes = [];
  return {
    ...output,
    envelopes,
    async publishOutputEnvelope(input) {
      const envelope = await contract.createOutputEnvelope({
        ...input,
        ownerId: "55555555-5555-4555-8555-555555555555",
      }, crypto.webcrypto);
      envelopes.push(envelope);
      return envelope;
    },
  };
}

function freshLibrary() {
  const modulePath = require.resolve("../archive/archive2-library.js");
  delete require.cache[modulePath];
  return require(modulePath);
}

function installLibraryTestGlobals(request, href = "https://archive.test/archive/workspace.html?view=saved") {
  global.location = new URL(href);
  global.history = {
    state: null,
    replaceState(state, _title, url) {
      this.state = state;
      global.location = new URL(String(url), global.location.href);
    },
    pushState(state, _title, url) {
      this.state = state;
      global.location = new URL(String(url), global.location.href);
    },
    back() {},
  };
  global.document = {
    addEventListener() {},
    querySelectorAll() { return []; },
    createElement() { return { className: "", textContent: "", setAttribute() {}, remove() {} }; },
  };
  global.window = {
    sessionStorage: storage(),
    scrollY: 0,
    scrollTo() {},
    Archive2Output: outputWithCapture(),
    Archive2Api: { request },
  };
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

test("saved-paper detail renders when localStorage writes throw QuotaExceededError", async () => {
  const previous = { window: global.window, location: global.location, localStorage: global.localStorage };
  const sessionStorage = storage({ APMATH_SESSION: "teacher session must remain" });
  const outputApi = outputWithCapture();
  let localStorageWrites = 0;
  global.window = {
    sessionStorage,
    localStorage: { setItem() { localStorageWrites++; throw new DOMException("Quota exceeded", "QuotaExceededError"); } },
    Archive2Output: outputApi,
    Archive2Api: { request: async () => ({ paper: paper("00000000-0000-4000-8000-000000000001", "Quota test paper") }) },
  };
  global.localStorage = global.window.localStorage;
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  try {
    const host = { innerHTML: "" };
    await library.render(host, "00000000-0000-4000-8000-000000000001");
    assert.match(host.innerHTML, /Quota test paper/);
    assert.match(host.innerHTML, /saved-paper-preview/);
    assert.equal(outputApi.envelopes.length, 1);
    assert.equal(outputApi.envelopes[0].sourceKind, "saved-paper");
    assert.equal(outputApi.envelopes[0].paperId, "00000000-0000-4000-8000-000000000001");
    assert.match(host.innerHTML, /outputRequestId=/);
    assert.match(host.innerHTML, /outputOwnerId=/);
    assert.equal(sessionStorage.getItem("APMATH_SESSION"), "teacher session must remain");
    assert.equal(localStorageWrites, 0);
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
  }
});

test("saved-paper preview is one owner-scoped envelope without changing browser session storage", async () => {
  const previousWindow = global.window;
  const sessionStorage = storage({
    APMATH_SESSION: "do not delete",
    "mixedQuestions_archive2-saved-old-paper-old-batch": "old saved snapshot",
    "mixedMeta_archive2-saved-old-paper-old-batch": "old saved meta",
    "mixedQuestions_unit-past-user-work": "existing user work",
  });
  const outputApi = outputWithCapture();
  global.window = { sessionStorage, Archive2Output: outputApi };
  try {
    const before = sessionStorage.snapshot();
    const envelope = await library.preparePreview(paper("00000000-0000-4000-8000-000000000002", "New test paper"));
    const values = sessionStorage.snapshot();
    assert.equal(outputApi.envelopes.length, 1);
    assert.equal(envelope, outputApi.envelopes[0]);
    assert.equal(envelope.questionCount, 1);
    assert.deepEqual(envelope.questionUids, ["qid_v1_test"]);
    assert.equal(envelope.ownerId, "55555555-5555-4555-8555-555555555555");
    assert.deepEqual(values, before);
    assert.equal(values["APMATH_SESSION"], "do not delete");
    assert.equal(values["mixedQuestions_unit-past-user-work"], "existing user work");
    assert.equal(values["mixedQuestions_archive2-saved-old-paper-old-batch"], "old saved snapshot");
    assert.equal(values["mixedMeta_archive2-saved-old-paper-old-batch"], "old saved meta");
  } finally {
    if (previousWindow === undefined) delete global.window; else global.window = previousWindow;
  }
});

test("direct Saved Paper mode output uses the exact immutable snapshot in a standalone envelope", async () => {
  const previous = { window: global.window, location: global.location };
  const savedId = "00000000-0000-4000-8000-000000000004";
  const saved = paper(savedId, "immutable mode output");
  const outputApi = outputWithCapture();
  const requests = [];
  const popup = { location: { href: "" }, close() { this.closed = true; } };
  global.window = {
    Archive2Output: outputApi,
    Archive2Api: { request: async route => { requests.push(route); return { paper: saved }; } },
    open: url => { assert.equal(url, "about:blank"); return popup; },
  };
  global.location = new URL("https://archive.test/archive/workspace.html?view=compose");
  try {
    const opened = await library.openOutput(savedId, "sol");
    assert.deepEqual(requests, ["/archive-saved-papers/" + savedId]);
    assert.equal(opened.paperId, savedId);
    assert.equal(outputApi.envelopes.length, 1);
    assert.equal(outputApi.envelopes[0].sourceKind, "saved-paper");
    assert.equal(outputApi.envelopes[0].sourceId, savedId);
    assert.equal(outputApi.envelopes[0].paperId, savedId);
    assert.equal(outputApi.envelopes[0].mode, "sol");
    assert.deepEqual(outputApi.envelopes[0].questions, saved.snapshot.questions);
    const url = new URL(popup.location.href);
    assert.equal(url.searchParams.get("mode"), "sol");
    assert.equal(url.searchParams.get("preview"), null);
    assert.equal(url.searchParams.get("archive2Review"), null);
    assert.equal(url.searchParams.get("archive2SavedStorageVersion"), "3");
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
  }
});

test("saved-paper AssignTarget handoff publishes one envelope without localStorage writes", async () => {
  const savedId = "00000000-0000-4000-8000-000000000003";
  const sessionStorage = storage({ APMATH_SESSION: "teacher session must remain" });
  let localStorageWrites = 0;
  let envelopeInput = null;
  let opened = null;
  const paper = paperFixture(savedId);
  const envelope = {
    contractVersion: "archive2-output-envelope-v1",
    outputRequestId: "66666666-6666-4666-8666-666666666666",
    ownerId: "77777777-7777-4777-8777-777777777777",
  };
  const window = {
    Archive2Output: {
      settings: value => value,
      publishOutputEnvelope: async input => { envelopeInput = input; return envelope; },
    },
    sessionStorage,
    close() {},
  };
  const context = {
    window,
    URLSearchParams,
    Map,
    crypto,
    location: { search: `?savedPaper=${savedId}`, origin: "https://archive.test", href: `https://archive.test/archive/index.html?savedPaper=${savedId}` },
    parent: window,
    document: {
      documentElement: { classList: { add() {} } },
      createElement: () => ({ style: {} }),
      head: { appendChild() {} },
      body: { prepend() {} },
    },
    localStorage: {
      getItem: () => JSON.stringify({ id: "fixture-admin" }),
      setItem() { localStorageWrites++; throw new DOMException("Quota exceeded", "QuotaExceededError"); },
    },
    sessionStorage,
    getIndexAssignmentAuthHeader: () => ({ Authorization: "Bearer fixture" }),
    ARCHIVE_AP_API_BASE: "https://archive.test/api",
    fetch: async () => new Response(JSON.stringify({ success: true, paper }), { status: 200 }),
    openAssignTargetPanel: async (item, qpp) => { opened = { item, qpp }; },
  };
  const source = fs.readFileSync(path.join(__dirname, "../archive/archive2-entry.js"), "utf8");
  vm.runInNewContext(source, context);
  assert.equal(await window.openArchive2SavedPaperIssue(), true);
  assert.equal(opened.item.savedPaperId, savedId);
  assert.equal(Number(opened.qpp), 4);
  assert.equal(opened.item.outputRequestId, envelope.outputRequestId);
  assert.equal(opened.item.outputOwnerId, envelope.ownerId);
  assert.deepEqual(JSON.parse(JSON.stringify(opened.item.outputSnapshot)), JSON.parse(JSON.stringify(paper.snapshot)));
  assert.equal(envelopeInput.paperId, savedId);
  assert.equal(envelopeInput.sourceKind, "saved-paper");
  assert.equal(envelopeInput.mode, "exam");
  assert.equal(sessionStorage.getItem("APMATH_SESSION"), "teacher session must remain");
  assert.equal(localStorageWrites, 0, "saved-paper distribution does not grow localStorage");
});

test("embedded Saved Paper assignment keeps its ID through login and retains the compatibility entry", async () => {
  const savedId = "00000000-0000-4000-8000-000000000074";
  const rootWindow = { closeModal() {}, addEventListener() {} };
  const parent = { messages: [], postMessage(message) { this.messages.push(message); } };
  const classes = [];
  let opened = null;
  const context = {
    window: rootWindow,
    parent,
    URLSearchParams,
    Map,
    crypto,
    location: {
      search: `?savedPaper=${savedId}&archive2Embedded=1`,
      origin: "https://archive.test",
      href: `https://archive.test/archive/index.html?savedPaper=${savedId}&archive2Embedded=1`,
    },
    document: {
      documentElement: { classList: { add(value) { classes.push(value); } } },
      createElement: () => ({ style: {} }),
      head: { appendChild() {} },
      body: { prepend() {} },
    },
    localStorage: { getItem: () => "{}", setItem() {} },
    sessionStorage: storage(),
    getIndexAssignmentAuthHeader: () => null,
    openAssignTargetPanel: async (item, qpp) => { opened = { item, qpp }; },
  };
  rootWindow.Archive2Output = {};
  const source = fs.readFileSync(path.join(__dirname, "../archive/archive2-entry.js"), "utf8");
  vm.runInNewContext(source, context);

  assert.ok(classes.includes("archive2-original-host"));
  assert.equal(await rootWindow.openArchive2SavedPaperIssue(), true);
  assert.equal(opened.item.savedPaperId, savedId);
  assert.equal(opened.qpp, 4);
  assert.equal(rootWindow.closeModal !== undefined, true);

  const index = fs.readFileSync(path.join(__dirname, "../archive/index.html"), "utf8");
  assert.match(index, /AssignTarget\?\.item\?\.savedPaperId[\s\S]*?window\.openArchive2SavedPaperIssue/,
    "the savedPaper URL is retried after authentication instead of losing its intent");
  assert.match(source, /const requestedSavedPaper = params\.get\("savedPaper"\)/,
    "the existing savedPaper compatibility URL remains supported");
});

function paperFixture(id) {
  return {
    id,
    title: "AssignTarget fixture",
    subject: "공통수학1",
    grade: "고1",
    question_count: 1,
    snapshot: {
      questions: [{ questionUid: "qid_v1_fixture", image: "data:image/png;base64,AQID" }],
      meta: { title: "AssignTarget fixture", questionUids: ["qid_v1_fixture"], qpp: 4, printHeaderOptions: { title: "AssignTarget fixture" } },
    },
  };
}

test("library display metadata never replaces the immutable output title", async () => {
  const previousWindow = global.window;
  const previousLocation = global.location;
  const savedId = "00000000-0000-4000-8000-000000000010";
  const saved = paper(savedId, "immutable output title");
  saved.library_display_name = "왕운중 심화반용";
  saved.library_status = "ACTIVE";
  const outputApi = outputWithCapture();
  const requests = [];
  global.window = {
    prompt: () => "왕운중 심화반 복습용",
    Archive2Output: outputApi,
    Archive2Api: {
      request: async (route, body, method) => {
        requests.push({ route, body, method });
        if (method === "PATCH") {
          saved.library_display_name = body.display_name || saved.library_display_name;
          saved.library_status = body.status || saved.library_status;
          return { success: true, paper: saved };
        }
        if (route.includes(savedId)) return { paper: saved };
        return { papers: [saved], next_cursor: null };
      },
    },
  };
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  try {
    const host = { innerHTML: "" };
    await library.render(host);
    assert.match(host.innerHTML, /왕운중 심화반용/);
    assert.doesNotMatch(host.innerHTML, /immutable output title/);
    await library.render(host, savedId);
    assert.match(host.innerHTML, /<h1>왕운중 심화반용<\/h1>/);
    assert.equal(outputApi.envelopes.at(-1).meta.title, "immutable output title");

    const renameButton = { dataset: { libraryAction: "rename", paperId: savedId } };
    await host.onclick({
      target: { closest: () => renameButton },
      preventDefault() {},
      stopPropagation() {},
    });
    const metadataPatch = requests.findLast(request => request.method === "PATCH");
    assert.equal(metadataPatch.route, "/archive-saved-papers/" + savedId + "/library");
    assert.equal(metadataPatch.body.display_name, "왕운중 심화반 복습용");
    assert.match(host.innerHTML, /<h1>왕운중 심화반 복습용<\/h1>/);
    assert.equal(outputApi.envelopes.at(-1).meta.title, "immutable output title");
    assert.equal(saved.snapshot.meta.printHeaderOptions.title, "immutable output title");
  } finally {
    if (previousWindow === undefined) delete global.window; else global.window = previousWindow;
    if (previousLocation === undefined) delete global.location; else global.location = previousLocation;
  }
});

test("Saved Paper library starts immutable revision Drafts and retries exact copies with one idempotency ID", async () => {
  const previous = {
    window: global.window,
    location: global.location,
    localStorage: global.localStorage,
    history: global.history,
    document: global.document,
  };
  const sourceId = "00000000-0000-4000-8000-000000000041";
  const copiedId = "00000000-0000-4000-8000-000000000042";
  const saved = paper(sourceId, "frozen output title");
  saved.snapshot_hash = "a".repeat(64);
  const copied = { ...saved, id: copiedId, library_display_name: "frozen output title (복사본)" };
  const local = storage();
  const session = storage();
  const requests = [];
  let copyPosts = 0;
  let copyExists = false;
  global.localStorage = local;
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  global.history = {
    state: null,
    pushState(state, _title, url) { this.state = state; global.location = new URL(url, global.location); },
    replaceState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
  };
  global.document = {
    createElement() {
      return { className: "", textContent: "", setAttribute() {}, remove() {} };
    },
  };
  global.window = {
    localStorage: local,
    sessionStorage: session,
    scrollTo() {},
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000043" },
    Archive2Output: outputWithCapture(),
    Archive2Api: {
      async request(route, body, method) {
        requests.push({ route, body, method });
        if (route === "/archive-saved-papers?limit=20&status=ACTIVE") {
          const rows = [saved, ...(copyExists ? [copied] : [])].map(row => ({
            id: row.id, title: row.title, library_display_name: row.library_display_name || row.title,
            grade: row.grade, subject: row.subject, question_count: row.question_count,
            created_at: row.created_at, library_status: "ACTIVE",
          }));
          return { papers: rows, next_cursor: null };
        }
        if (route === "/archive-saved-papers/" + sourceId) return { paper: saved };
        if (route === "/archive-saved-papers/" + copiedId) return { paper: copied };
        if (route === "/archive-saved-papers/" + sourceId + "/copy" && method === "POST") {
          copyPosts++;
          copyExists = true;
          if (copyPosts === 1) throw new Error("reply lost after commit");
          return { success: true, saved: true, papers: [{
            id: copiedId, title: copied.title, library_display_name: copied.library_display_name,
            library_status: "ACTIVE", question_count: copied.question_count,
            grade: copied.grade, subject: copied.subject, created_at: copied.created_at,
          }] };
        }
        throw new Error("unexpected library API request: " + route);
      },
    },
  };
  try {
    const host = { innerHTML: "", prepend() {} };
    await library.render(host, "", "ACTIVE");
    const staleListState = structuredClone(global.history.state);
    global.history.state = { archive2SavedLibraryDetail: true, archive2ScrollY: 0 };
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved&paper_id=" + sourceId);
    await library.render(host, sourceId);
    assert.match(host.innerHTML, /수정본 만들기/);
    assert.match(host.innerHTML, /edit_saved_paper=/);
    assert.match(host.innerHTML, /정확히 복사/);
    assert.match(host.innerHTML, /frozen output title/);
    assert.equal(saved.snapshot.meta.title, "frozen output title");

    const copyButton = { dataset: { libraryAction: "copy" } };
    const click = () => host.onclick({
      target: { closest: () => copyButton },
      preventDefault() {},
      stopPropagation() {},
    });
    await click();
    assert.equal(copyPosts, 1);
    const firstCopyBody = requests.findLast(request => request.method === "POST").body;
    await click();
    const copyBodies = requests.filter(request => request.method === "POST").map(request => request.body);
    assert.equal(copyPosts, 2);
    assert.equal(copyBodies[1].save_batch_id, firstCopyBody.save_batch_id);
    assert.equal(copyBodies[1].expected_snapshot_hash, saved.snapshot_hash);
    assert.deepEqual(copyBodies[1], firstCopyBody);
    assert.match(host.innerHTML, /frozen output title \(복사본\)/);
    assert.equal(local.getItem("archive2.saved-paper-copy-pending.v1"), null);
    assert.equal(JSON.parse(session.getItem("archive2.saved-paper-list-invalidated.v1")).kind, "reload",
      "an ambiguous copy failure followed by an idempotent retry requires an authoritative list read");

    const readsBeforeBack = requests.filter(request => request.route === "/archive-saved-papers?limit=20&status=ACTIVE").length;
    global.history.state = staleListState;
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
    await library.render(host, "", "ACTIVE");
    const readsAfterBack = requests.filter(request => request.route === "/archive-saved-papers?limit=20&status=ACTIVE").length;
    assert.equal(readsAfterBack, readsBeforeBack + 1, "ambiguous copy retry refreshes list membership from the server on Back");
    assert.match(host.innerHTML, /frozen output title \(복사본\)/);
    assert.equal(session.getItem("archive2.saved-paper-list-invalidated.v1"), null);
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Paper cards open each output and assignment directly and restore list cursor context", async () => {
  const previous = {
    window: global.window,
    location: global.location,
    history: global.history,
    requestAnimationFrame: global.requestAnimationFrame,
  };
  const savedId = "00000000-0000-4000-8000-000000000071";
  const saved = paper(savedId, "immutable list snapshot");
  const summary = (id, title) => ({
    id, title, grade: "고1", subject: "공통수학1", question_count: 1,
    created_at: "2026-09-29T00:00:00.000Z", library_status: "ACTIVE",
  });
  const outputApi = outputWithCapture();
  const requests = [];
  const opened = [];
  const scrolls = [];
  const popup = { location: { href: "" }, close() { this.closed = true; } };
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  global.history = {
    state: null,
    replaceState(state, _title, url) {
      this.state = state;
      global.location = new URL(String(url), global.location.href);
    },
    pushState(state, _title, url) {
      this.state = state;
      global.location = new URL(String(url), global.location.href);
    },
    back() {},
  };
  global.requestAnimationFrame = callback => callback();
  global.window = {
    scrollY: 321,
    scrollTo: (x, y) => scrolls.push([x, y]),
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000072" },
    Archive2Output: outputApi,
    Archive2Api: {
      async request(route) {
        requests.push(route);
        if (route === "/archive-saved-papers?limit=20&status=ACTIVE")
          return { papers: [summary(savedId, "Saved direct paper")], next_cursor: "cursor-next" };
        if (route.includes("&cursor=cursor-next"))
          return { papers: [summary("00000000-0000-4000-8000-000000000073", "Second page paper")], next_cursor: null };
        if (route === "/archive-saved-papers/" + savedId) return { paper: saved };
        throw new Error("unexpected library request: " + route);
      },
    },
    open: url => { assert.equal(url, "about:blank"); return popup; },
    Archive2WorkspaceSavedPaperIssue: async id => opened.push(id),
  };
  try {
    const host = { innerHTML: "", prepend() {} };
    await library.render(host, "", "ACTIVE");
    assert.match(host.innerHTML, /data-library-action="output"[^>]*data-mode="exam"/);
    assert.match(host.innerHTML, /data-library-action="output"[^>]*data-mode="sol"/);
    assert.match(host.innerHTML, /data-library-action="output"[^>]*data-mode="ans"/);
    assert.match(host.innerHTML, /data-library-action="distribute"/);
    assert.match(host.innerHTML, /<summary>더보기<\/summary>/);
    assert.doesNotMatch(host.innerHTML, /index\.html\?savedPaper=/);

    const outputButton = { dataset: { libraryAction: "output", paperId: savedId, mode: "sol" } };
    await host.onclick({ target: { closest: () => outputButton }, preventDefault() {}, stopPropagation() {} });
    assert.equal(requests.at(-1), "/archive-saved-papers/" + savedId);
    assert.equal(outputApi.envelopes.at(-1).sourceId, savedId);
    assert.equal(outputApi.envelopes.at(-1).mode, "sol");
    assert.equal(new URL(popup.location.href).searchParams.get("preview"), null);

    const distributeButton = { dataset: { libraryAction: "distribute", paperId: savedId } };
    await host.onclick({ target: { closest: () => distributeButton }, preventDefault() {}, stopPropagation() {} });
    assert.deepEqual(opened, [savedId]);

    const moreButton = { dataset: { libraryAction: "more" } };
    await host.onclick({ target: { closest: () => moreButton }, preventDefault() {}, stopPropagation() {} });
    const listContext = global.history.state.archive2SavedLibrary;
    assert.equal(listContext.cursor, null);
    assert.deepEqual(listContext.papers.map(row => row.id), [savedId, "00000000-0000-4000-8000-000000000073"]);
    assert.equal(listContext.scrollY, 321);

    global.history.state = { archive2SavedLibraryDetail: true, archive2ScrollY: 0 };
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved&paper_id=" + savedId);
    await library.render(host, savedId, "ACTIVE");
    assert.match(host.innerHTML, /immutable list snapshot/);

    global.history.state = { archive2SavedLibrary: listContext, archive2ScrollY: 321 };
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
    const listReadsBeforeRestore = requests.filter(route => route.startsWith("/archive-saved-papers?limit=20")).length;
    await library.render(host, "", "ACTIVE");
    const listReadsAfterRestore = requests.filter(route => route.startsWith("/archive-saved-papers?limit=20")).length;
    assert.equal(listReadsAfterRestore, listReadsBeforeRestore);
    assert.match(host.innerHTML, /Second page paper/);
    assert.deepEqual(scrolls.at(-1), [0, 321]);
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.requestAnimationFrame === undefined) delete global.requestAnimationFrame; else global.requestAnimationFrame = previous.requestAnimationFrame;
  }
});

test("TRASHED cards expose restore only, while legacy tombstones remain non-restorable", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, confirm: global.confirm };
  const trashedId = "00000000-0000-4000-8000-000000000081";
  const legacyId = "00000000-0000-4000-8000-000000000082";
  const trashed = { ...paper(trashedId, "휴지통 시험지"), library_status: "ACTIVE" };
  const legacy = { ...paper(legacyId, "기존 삭제 항목"), library_status: "TRASHED", legacy_tombstone: true };
  const requests = [];
  const outputApi = outputWithCapture();
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=TRASHED");
  global.history = { state: null, replaceState(state) { this.state = state; } };
  global.confirm = () => true;
  global.window = {
    sessionStorage: storage(),
    Archive2Output: outputApi,
    Archive2Api: {
      async request(route, body, method) {
        requests.push({ route, body, method });
        if (method === "PATCH") {
          trashed.library_status = body.status;
          return { success: true, paper: trashed };
        }
        if (method === "DELETE" && route.endsWith("/" + trashedId)) {
          trashed.library_status = "TRASHED";
          return { success: true };
        }
        if (route.startsWith("/archive-saved-papers?")) {
          const status = new URLSearchParams(route.split("?")[1]).get("status");
          return { papers: [trashed, legacy].filter(row => row.library_status === status), next_cursor: null };
        }
        if (route.endsWith("/" + trashedId)) return { paper: trashed };
        if (route.endsWith("/" + legacyId)) return { paper: legacy };
        throw new Error("unexpected library request: " + route);
      },
    },
  };
  try {
    const host = { innerHTML: "", prepend() {} };
    await library.render(host, "", "ACTIVE");
    assert.match(host.innerHTML, /data-library-action="delete"/);
    const deleteButton = { dataset: { libraryAction: "delete", paperId: trashedId } };
    await host.onclick({ target: { closest: () => deleteButton }, preventDefault() {}, stopPropagation() {} });
    assert.equal(trashed.library_status, "TRASHED");

    await library.render(host, "", "TRASHED");
    assert.match(host.innerHTML, new RegExp(`data-library-action="library-status" data-paper-id="${trashedId}" data-status="ACTIVE">복원`));
    assert.match(host.innerHTML, /기존 삭제 항목은 복원할 수 없습니다/);
    assert.doesNotMatch(host.innerHTML, /data-library-action="(?:output|distribute|detail|delete|rename)"/);
    assert.equal(outputApi.envelopes.length, 0);
    const listOnClick = host.onclick;

    const restore = { dataset: { libraryAction: "library-status", paperId: trashedId, status: "ACTIVE" } };
    await listOnClick({ target: { closest: () => restore }, preventDefault() {}, stopPropagation() {} });
    assert.equal(trashed.library_status, "ACTIVE");
    assert.equal(requests.filter(row => row.method === "PATCH").length, 1);
    assert.match(host.innerHTML, /기존 삭제 항목/);
    assert.doesNotMatch(host.innerHTML, new RegExp(trashedId));
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.confirm === undefined) delete global.confirm; else global.confirm = previous.confirm;
  }
});

test("Saved Library latest list response wins and stale list errors are suppressed", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  try {
    for (const lateResult of ["success", "error"]) {
      const requests = [];
      const listRequest = () => {
        const item = deferred();
        requests.push(item);
        return item.promise;
      };
      const currentLibrary = freshLibrary();
      installLibraryTestGlobals(route => listRequest());
      const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
      const active = currentLibrary.render(host, "", "ACTIVE");
      const archived = currentLibrary.render(host, "", "ARCHIVED");
      assert.equal(requests.length, 2);
      requests[1].resolve({ papers: [{ ...paper("archived-id", "Archived current"), library_status: "ARCHIVED" }], next_cursor: null });
      await archived;
      const archivedHtml = host.innerHTML;
      assert.match(archivedHtml, /Archived current/);
      if (lateResult === "success")
        requests[0].resolve({ papers: [{ ...paper("active-id", "Stale active"), library_status: "ACTIVE" }], next_cursor: null });
      else requests[0].reject(new Error("stale ACTIVE list failed"));
      await active;
      assert.equal(host.innerHTML, archivedHtml);
      assert.equal(global.history.state.archive2SavedLibrary.statusFilter, "ARCHIVED");
      assert.doesNotMatch(global.history.state.archive2SavedLibrary.papers.map(row => row.title).join(" "), /Stale active/);
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library outstanding render is invalidated when workspace leaves the saved view", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  const pending = deferred();
  try {
    const currentLibrary = freshLibrary();
    installLibraryTestGlobals(() => pending.promise);
    const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
    const render = currentLibrary.render(host, "", "ACTIVE");
    assert.match(host.innerHTML, /저장한 시험지를 불러오고 있습니다/);
    currentLibrary.invalidatePendingRequests();
    host.innerHTML = "Finder screen";
    pending.resolve({ papers: [{ ...paper("late-saved", "Late Saved response"), library_status: "ACTIVE" }], next_cursor: null });
    assert.equal(await render, false, "stale success resolves as a non-render result");
    assert.equal(host.innerHTML, "Finder screen");
    assert.equal(global.history.state?.archive2SavedLibrary, undefined);
    const workspaceSource = fs.readFileSync(path.join(__dirname, "..", "archive", "archive2-workspace.js"), "utf8");
    assert.match(workspaceSource, /state\.view !== "saved"\) window\.Archive2Library\?\.invalidatePendingRequests\?\.\(\);/);
    assert.match(workspaceSource, /\.then\(\(result\) => \{ if \(result !== false\) status\("저장한 시험지를 불러왔습니다\."\); \}\)/);
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library latest detail response wins and stale detail errors are suppressed", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  try {
    for (const lateResult of ["success", "error"]) {
      const requests = [];
      const currentLibrary = freshLibrary();
      installLibraryTestGlobals(route => {
        const item = deferred();
        requests.push({ route, ...item });
        return item.promise;
      }, "https://archive.test/archive/workspace.html?view=saved&status=TRASHED");
      const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
      const detailA = currentLibrary.render(host, "paper-a", "TRASHED");
      const detailB = currentLibrary.render(host, "paper-b", "TRASHED");
      assert.equal(requests.length, 2);
      requests[1].resolve({ paper: { ...paper("paper-b", "Detail B"), library_status: "TRASHED" } });
      await detailB;
      const detailBHtml = host.innerHTML;
      assert.match(detailBHtml, /Detail B/);
      if (lateResult === "success")
        requests[0].resolve({ paper: { ...paper("paper-a", "Stale detail A"), library_status: "TRASHED" } });
      else requests[0].reject(new Error("stale detail A failed"));
      await detailA;
      assert.equal(host.innerHTML, detailBHtml);
      assert.doesNotMatch(host.innerHTML, /Stale detail A/);
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library loadMore cannot append or surface an error after a tab switch", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  try {
    for (const lateResult of ["success", "error"]) {
      const moreRequest = deferred();
      const currentLibrary = freshLibrary();
      installLibraryTestGlobals(route => {
        if (route === "/archive-saved-papers?limit=20&status=ACTIVE")
          return Promise.resolve({ papers: [{ ...paper("active-first", "Active first"), library_status: "ACTIVE" }], next_cursor: "cursor-active" });
        if (route.includes("status=ACTIVE") && route.includes("cursor=cursor-active"))
          return moreRequest.promise;
        if (route === "/archive-saved-papers?limit=20&status=ARCHIVED")
          return Promise.resolve({ papers: [{ ...paper("archived-first", "Archived current"), library_status: "ARCHIVED" }], next_cursor: null });
        throw new Error(`unexpected list request ${route}`);
      });
      const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
      await currentLibrary.render(host, "", "ACTIVE");
      const moreButton = { dataset: { libraryAction: "more" }, disabled: false };
      const more = host.onclick({ target: { closest: () => moreButton }, preventDefault() {}, stopPropagation() {} });
      global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ARCHIVED");
      const archived = currentLibrary.render(host, "", "ARCHIVED");
      await archived;
      const archivedHtml = host.innerHTML;
      assert.match(archivedHtml, /Archived current/);
      if (lateResult === "success")
        moreRequest.resolve({ papers: [{ ...paper("stale-more", "Stale ACTIVE page"), library_status: "ACTIVE" }], next_cursor: null });
      else moreRequest.reject(new Error("stale loadMore failed"));
      await more;
      assert.equal(host.innerHTML, archivedHtml);
      assert.equal(global.history.state.archive2SavedLibrary.statusFilter, "ARCHIVED");
      assert.doesNotMatch(global.history.state.archive2SavedLibrary.papers.map(row => row.title).join(" "), /Stale ACTIVE page/);
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library list response cannot replace a newer detail selection", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  try {
    for (const lateResult of ["success", "error"]) {
      const listRequest = deferred();
      const id = "00000000-0000-4000-8000-000000000151";
      const currentLibrary = freshLibrary();
      installLibraryTestGlobals(route => {
        if (route.startsWith("/archive-saved-papers?")) return listRequest.promise;
        if (route === "/archive-saved-papers/" + id)
          return Promise.resolve({ paper: { ...paper(id, "Selected detail B"), library_status: "ACTIVE" } });
        throw new Error(`unexpected Saved Library read ${route}`);
      });
      const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
      const list = currentLibrary.render(host, "", "ACTIVE");
      const detail = currentLibrary.render(host, id, "ACTIVE");
      await detail;
      const detailHtml = host.innerHTML;
      assert.match(detailHtml, /Selected detail B/);
      if (lateResult === "success")
        listRequest.resolve({ papers: [{ ...paper("old-list", "Stale list A"), library_status: "ACTIVE" }], next_cursor: null });
      else listRequest.reject(new Error("stale list A failed"));
      await list;
      assert.equal(host.innerHTML, detailHtml);
      assert.doesNotMatch(host.innerHTML, /Stale list A/);
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved mutations that finish after Finder leave invalidate cache without rendering, navigating, or showing errors", async () => {
  const previous = {
    window: global.window, location: global.location, history: global.history,
    localStorage: global.localStorage, document: global.document, confirm: global.confirm,
  };
  const scenarios = [
    { action: "rename", result: {}, kind: "rename", detail: true },
    { action: "copy", result: { papers: [{ id: "00000000-0000-4000-8000-000000000162", title: "Copied", library_status: "ACTIVE" }] }, kind: "insert", detail: true },
    { action: "library-status", result: { paper: { id: "00000000-0000-4000-8000-000000000163", library_status: "ARCHIVED" } }, kind: "status", detail: false },
    { action: "delete", result: { success: true }, kind: "remove", detail: false },
    { action: "rename", error: new Error("stale rename failed"), kind: "reload", detail: true },
    { action: "copy", error: new Error("stale copy failed"), kind: "reload", detail: true },
  ];
  try {
    for (let index = 0; index < scenarios.length; index++) {
      const scenario = scenarios[index];
      const id = `00000000-0000-4000-8000-${String(161 + index).padStart(12, "0")}`;
      const saved = {
        ...paper(id, "Saved authority A"),
        snapshot_hash: "a".repeat(64),
        library_display_name: "Saved authority A",
        library_status: "ACTIVE",
      };
      const mutation = deferred();
      let mutationCalls = 0;
      let prependCalls = 0;
      let savedNavigationCalls = 0;
      const local = storage();
      const session = storage();
      const currentLibrary = freshLibrary();
      global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ACTIVE");
      global.localStorage = local;
      global.confirm = () => true;
      global.history = {
        state: null,
        replaceState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
        pushState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
        back() {},
      };
      global.document = { createElement() { return { className: "", textContent: "", setAttribute() {}, remove() {} }; } };
      global.window = {
        sessionStorage: session,
        localStorage: local,
        scrollY: 0,
        scrollTo() {},
        prompt: () => "Renamed A",
        crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000199" },
        Archive2Output: outputWithCapture(),
        Archive2WorkspaceShowSavedPaper() { savedNavigationCalls++; },
        Archive2Api: {
          request(route, body, method) {
            if (scenario.detail && route === `/archive-saved-papers/${id}`)
              return Promise.resolve({ paper: saved });
            if (!scenario.detail && route.startsWith("/archive-saved-papers?"))
              return Promise.resolve({ papers: [{ ...saved, snapshot: undefined }], next_cursor: null });
            const expectedRoute = scenario.action === "copy"
              ? `/archive-saved-papers/${id}/copy`
              : scenario.action === "delete"
                ? `/archive-saved-papers/${id}`
                : `/archive-saved-papers/${id}/library`;
            if (route === expectedRoute) {
              mutationCalls++;
              return mutation.promise;
            }
            throw new Error(`unexpected request ${method || "GET"} ${route}`);
          },
        },
      };
      const host = {
        innerHTML: "",
        prepend() { prependCalls++; },
        querySelectorAll() { return []; },
      };
      await currentLibrary.render(host, scenario.detail ? id : "", "ACTIVE");
      const button = {
        dataset: {
          libraryAction: scenario.action,
          paperId: id,
          ...(scenario.action === "library-status" ? { status: "ARCHIVED" } : {}),
        },
      };
      const operation = host.onclick({ target: { closest: () => button }, preventDefault() {}, stopPropagation() {} });
      assert.equal(mutationCalls, 1);
      currentLibrary.invalidatePendingRequests();
      global.location = new URL("https://archive.test/archive/workspace.html?view=find");
      host.innerHTML = "Finder current DOM";
      if (scenario.error) mutation.reject(scenario.error);
      else mutation.resolve(scenario.result);
      await operation;
      assert.equal(host.innerHTML, "Finder current DOM", `${scenario.action} response must not overwrite Finder`);
      assert.equal(savedNavigationCalls, 0, `${scenario.action} response must not navigate to an old Saved selection`);
      assert.equal(prependCalls, 0, `${scenario.action} stale errors are swallowed`);
      assert.equal(JSON.parse(session.getItem("archive2.saved-paper-list-invalidated.v1")).kind, scenario.kind);
      if (scenario.action === "copy") {
        if (scenario.error) assert.ok(local.getItem("archive2.saved-paper-copy-pending.v1"),
          "an ambiguous stale copy failure retains its idempotency key for recovery");
        else assert.equal(local.getItem("archive2.saved-paper-copy-pending.v1"), null);
      }
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
    if (previous.confirm === undefined) delete global.confirm; else global.confirm = previous.confirm;
  }
});

test("Saved mutation completion after an in-view reload cannot overwrite the reloaded page", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  const id = "00000000-0000-4000-8000-000000000171";
  const saved = { ...paper(id, "Before reload"), library_display_name: "Before reload", library_status: "ACTIVE" };
  const rename = deferred();
  let renameCalls = 0;
  try {
    const currentLibrary = freshLibrary();
    installLibraryTestGlobals(route => {
      if (route === `/archive-saved-papers/${id}`) return Promise.resolve({ paper: saved });
      if (route.startsWith("/archive-saved-papers?"))
        return Promise.resolve({ papers: [{ ...saved, snapshot: undefined }], next_cursor: null });
      if (route === `/archive-saved-papers/${id}/library`) {
        renameCalls++;
        return rename.promise;
      }
      throw new Error(`unexpected request ${route}`);
    }, `https://archive.test/archive/workspace.html?view=saved&paper_id=${id}`);
    global.window.prompt = () => "After reload";
    const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
    await currentLibrary.render(host, id, "ACTIVE");
    const renameButton = { dataset: { libraryAction: "rename", paperId: id } };
    const mutation = host.onclick({ target: { closest: () => renameButton }, preventDefault() {}, stopPropagation() {} });
    assert.equal(renameCalls, 1);
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ACTIVE");
    await currentLibrary.render(host, "", "ACTIVE", { forceRefresh: true });
    const reloadedHtml = host.innerHTML;
    assert.match(reloadedHtml, /Before reload/);
    rename.resolve({ success: true });
    await mutation;
    assert.equal(host.innerHTML, reloadedHtml);
    assert.doesNotMatch(host.innerHTML, /After reload/);
    assert.equal(JSON.parse(global.window.sessionStorage.getItem("archive2.saved-paper-list-invalidated.v1")).kind, "rename");
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved mutation success with a failed refresh keeps cache invalidation and shows the current error", async () => {
  const previous = { window: global.window, location: global.location, history: global.history, document: global.document };
  const id = "00000000-0000-4000-8000-000000000173";
  const saved = { ...paper(id, "Before refresh"), library_display_name: "Before refresh", library_status: "ACTIVE" };
  let detailReads = 0;
  try {
    const currentLibrary = freshLibrary();
    const session = storage();
    installLibraryTestGlobals(route => {
      if (route === `/archive-saved-papers/${id}`) {
        detailReads++;
        if (detailReads > 1) throw new Error("Saved detail refresh failed");
        return Promise.resolve({ paper: saved });
      }
      if (route === `/archive-saved-papers/${id}/library`)
        return Promise.resolve({ success: true });
      throw new Error(`unexpected request ${route}`);
    }, `https://archive.test/archive/workspace.html?view=saved&paper_id=${id}`);
    global.window.sessionStorage = session;
    global.window.prompt = () => "After refresh";
    const host = {
      innerHTML: "",
      prepend(message) { this.innerHTML = `${message.textContent}${this.innerHTML}`; },
      querySelectorAll() { return []; },
    };
    await currentLibrary.render(host, id, "ACTIVE");
    const renameButton = { dataset: { libraryAction: "rename", paperId: id } };
    await host.onclick({ target: { closest: () => renameButton }, preventDefault() {}, stopPropagation() {} });
    assert.equal(detailReads, 2);
    assert.match(host.innerHTML, /Saved detail refresh failed/);
    assert.equal(JSON.parse(session.getItem("archive2.saved-paper-list-invalidated.v1")).kind, "reload");
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library rename-copy, copy-rename, and copy-status sequences use one fresh authority read on Back", async () => {
  const previous = {
    window: global.window, location: global.location, history: global.history,
    localStorage: global.localStorage, document: global.document,
  };
  const libraryModulePath = require.resolve("../archive/archive2-library.js");
  try {
    for (const sequence of ["rename-copy", "copy-rename", "copy-status"]) {
      const sourceId = sequence === "rename-copy"
        ? "00000000-0000-4000-8000-000000000141"
        : "00000000-0000-4000-8000-000000000143";
      const copyId = sequence === "rename-copy"
        ? "00000000-0000-4000-8000-000000000142"
        : "00000000-0000-4000-8000-000000000144";
      const saved = {
        ...paper(sourceId, "Original title"), snapshot_hash: "a".repeat(64),
        library_display_name: "Original A", library_status: "ACTIVE",
      };
      const copied = {
        ...paper(copyId, "Original title"), snapshot_hash: "b".repeat(64),
        library_display_name: "Original A (복사본)", library_status: "ACTIVE",
      };
      const local = storage();
      const session = storage();
      let copyCreated = false;
      let promptValue = "";
      let listReads = 0;
      global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ACTIVE");
      global.localStorage = local;
      global.history = {
        state: null,
        replaceState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
        pushState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
      };
      global.document = { createElement() { return { className: "", textContent: "", setAttribute() {}, remove() {} }; } };
      global.window = {
        sessionStorage: session,
        localStorage: local,
        scrollY: 155,
        scrollTo() {},
        prompt: () => promptValue,
        crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000149" },
        Archive2Output: outputWithCapture(),
        Archive2Api: {
          async request(route, body, method) {
            if (route.startsWith("/archive-saved-papers?")) {
              listReads++;
              const requestedStatus = new URLSearchParams(route.split("?")[1]).get("status");
              const rows = [saved, ...(copyCreated ? [copied] : [])].map(row => ({
                id: row.id, title: row.title, library_display_name: row.library_display_name,
                grade: row.grade, subject: row.subject, question_count: row.question_count,
                created_at: row.created_at, library_status: row.library_status,
              })).filter(row => row.library_status === requestedStatus);
              return { papers: rows, next_cursor: "cursor-before-mutations" };
            }
            if (route === `/archive-saved-papers/${sourceId}/copy` && method === "POST") {
              copyCreated = true;
              copied.library_display_name = `${saved.library_display_name} (복사본)`;
              return { success: true, papers: [{
                id: copyId, title: copied.title, library_display_name: copied.library_display_name,
                library_status: "ACTIVE", question_count: copied.question_count,
                grade: copied.grade, subject: copied.subject, created_at: copied.created_at,
              }] };
            }
            if (route === `/archive-saved-papers/${sourceId}/library` && method === "PATCH") {
              if (body.display_name) saved.library_display_name = body.display_name;
              return { success: true, paper: { ...saved, snapshot: undefined } };
            }
            if (route === `/archive-saved-papers/${copyId}/library` && method === "PATCH") {
              if (body.display_name) copied.library_display_name = body.display_name;
              if (body.status) copied.library_status = body.status;
              return { success: true, paper: { ...copied, snapshot: undefined } };
            }
            if (route === `/archive-saved-papers/${sourceId}`) return { paper: saved };
            if (route === `/archive-saved-papers/${copyId}`) return { paper: copied };
            throw new Error(`unexpected request ${method || "GET"} ${route}`);
          },
        },
      };
      const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
      let currentLibrary = freshLibrary();
      await currentLibrary.render(host, "", "ACTIVE");
      const cachedListState = structuredClone(global.history.state);
      global.history.state = { archive2SavedLibraryDetail: true, archive2ScrollY: 0 };
      global.location = new URL(`https://archive.test/archive/workspace.html?view=saved&paper_id=${sourceId}&status=ACTIVE`);
      await currentLibrary.render(host, sourceId, "ACTIVE");

      const click = async dataset => host.onclick({
        target: { closest: () => ({ dataset }) },
        preventDefault() {}, stopPropagation() {},
      });
      if (sequence === "rename-copy") {
        promptValue = "Original B";
        await click({ libraryAction: "rename", paperId: sourceId });
      }
      await click({ libraryAction: "copy" });
      if (sequence === "copy-rename") {
        promptValue = "Copy C";
        await click({ libraryAction: "rename", paperId: copyId });
      } else if (sequence === "copy-status") {
        await click({ libraryAction: "library-status", paperId: copyId, status: "ARCHIVED" });
      }
      assert.equal(JSON.parse(session.getItem("archive2.saved-paper-list-invalidated.v1")).kind, "reload");

      global.history.state = cachedListState;
      global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ACTIVE");
      const listReadsBeforeBack = listReads;
      currentLibrary = freshLibrary();
      await currentLibrary.render(host, "", "ACTIVE");
      assert.equal(listReads, listReadsBeforeBack + 1, "multi-mutation Back performs one fresh list read");
      assert.equal(session.getItem("archive2.saved-paper-list-invalidated.v1"), null);
      const cachedPapers = global.history.state.archive2SavedLibrary.papers;
      const originalCached = cachedPapers.find(row => row.id === sourceId);
      const copyCached = cachedPapers.find(row => row.id === copyId);
      assert.equal(originalCached.library_display_name, sequence === "rename-copy" ? "Original B" : "Original A");
      if (sequence === "copy-status") assert.equal(copyCached, undefined,
        "a copied paper moved to ARCHIVED is absent from the ACTIVE Back list");
      else assert.equal(copyCached.library_display_name, sequence === "rename-copy" ? "Original B (복사본)" : "Copy C");
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
  }
});

test("Saved Library supports rename then delete through fresh list authority", async () => {
  const previous = {
    window: global.window, location: global.location, history: global.history,
    localStorage: global.localStorage, document: global.document, confirm: global.confirm,
  };
  const id = "00000000-0000-4000-8000-000000000172";
  const saved = { ...paper(id, "Sequence A"), library_display_name: "Sequence A", library_status: "ACTIVE" };
  const mutations = [];
  try {
    const local = storage();
    const currentLibrary = freshLibrary();
    global.location = new URL("https://archive.test/archive/workspace.html?view=saved&status=ACTIVE");
    global.localStorage = local;
    global.confirm = () => true;
    global.history = {
      state: null,
      replaceState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
    };
    global.document = { createElement() { return { className: "", textContent: "", setAttribute() {}, remove() {} }; } };
    global.window = {
      sessionStorage: storage(), localStorage: local, scrollY: 0, scrollTo() {},
      prompt: () => "Sequence B", Archive2Output: outputWithCapture(),
      Archive2Api: {
        async request(route, body, method) {
          if (route.startsWith("/archive-saved-papers?")) {
            const requestedStatus = new URLSearchParams(route.split("?")[1]).get("status");
            return { papers: saved.library_status === requestedStatus ? [{ ...saved, snapshot: undefined }] : [], next_cursor: null };
          }
          if (route === `/archive-saved-papers/${id}/library` && method === "PATCH") {
            mutations.push("rename");
            saved.library_display_name = body.display_name;
            return { success: true, paper: { ...saved } };
          }
          if (route === `/archive-saved-papers/${id}` && method === "DELETE") {
            mutations.push("delete");
            saved.library_status = "TRASHED";
            return { success: true };
          }
          throw new Error(`unexpected request ${method || "GET"} ${route}`);
        },
      },
    };
    const host = { innerHTML: "", prepend() {}, querySelectorAll() { return []; } };
    await currentLibrary.render(host, "", "ACTIVE");
    const click = dataset => host.onclick({ target: { closest: () => ({ dataset }) }, preventDefault() {}, stopPropagation() {} });
    await click({ libraryAction: "rename", paperId: id });
    assert.match(host.innerHTML, /Sequence B/);
    await click({ libraryAction: "delete", paperId: id });
    assert.deepEqual(mutations, ["rename", "delete"]);
    assert.match(host.innerHTML, /저장한 시험지가 없습니다/);
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
    if (previous.confirm === undefined) delete global.confirm; else global.confirm = previous.confirm;
  }
});

test("detail mutations invalidate the previous Saved Library list cache before Back", async () => {
  const previous = {
    window: global.window, location: global.location, history: global.history,
    localStorage: global.localStorage, document: global.document, confirm: global.confirm,
  };
  const scenarios = [
    { status: "ACTIVE", actions: [{ kind: "rename", name: "이름 B" }], expectedName: "이름 B", expectedStatus: "ACTIVE" },
    { status: "ACTIVE", actions: [{ kind: "status", status: "ARCHIVED" }], expectedStatus: null },
    { status: "ACTIVE", actions: [{ kind: "delete" }], expectedStatus: null },
    { status: "ACTIVE", actions: [
      { kind: "status", status: "ARCHIVED" }, { kind: "status", status: "ACTIVE" },
    ], expectedStatus: "ACTIVE" },
    { status: "ARCHIVED", actions: [
      { kind: "status", status: "ACTIVE" }, { kind: "status", status: "ARCHIVED" },
    ], expectedStatus: "ARCHIVED" },
    { status: "TRASHED", actions: [
      { kind: "status", status: "ACTIVE" }, { kind: "status", status: "TRASHED" },
    ], expectedStatus: "TRASHED" },
    { status: "ACTIVE", actions: [
      { kind: "rename", name: "최신 이름" },
      { kind: "status", status: "ARCHIVED" }, { kind: "status", status: "ACTIVE" },
    ], expectedName: "최신 이름", expectedStatus: "ACTIVE" },
  ];
  const libraryModulePath = require.resolve("../archive/archive2-library.js");
  let activeLibrary = library;
  try {
    for (let index = 0; index < scenarios.length; index++) {
      const scenario = scenarios[index];
      const id = `00000000-0000-4000-8000-${String(90 + index).padStart(12, "0")}`;
      const saved = { ...paper(id, "이름 A"), library_display_name: "이름 A", library_status: scenario.status };
      const session = storage();
      const requests = [];
      const location = new URL(`https://archive.test/archive/workspace.html?view=saved&status=${scenario.status}`);
      global.location = location;
      global.localStorage = storage();
      global.confirm = () => true;
      global.history = {
        state: null,
        replaceState(state, _title, url) { this.state = state; global.location = new URL(String(url), global.location.href); },
      };
      global.document = { createElement() { return { className: "", textContent: "", setAttribute() {}, remove() {} }; } };
      global.window = {
        sessionStorage: session,
        scrollY: 240,
        scrollTo() {},
        prompt: () => scenario.actions.find(action => action.kind === "rename")?.name || null,
        crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000099" },
        Archive2Output: outputWithCapture(),
        Archive2Api: {
          async request(route, body, method) {
            requests.push({ route, body, method });
            if (route.startsWith("/archive-saved-papers?")) {
              const requestedStatus = new URLSearchParams(route.split("?")[1]).get("status");
              const rows = saved.library_status === requestedStatus ? [{ ...saved, snapshot: undefined }] : [];
              return { papers: rows, next_cursor: "cursor-before-mutation" };
            }
            if (route === `/archive-saved-papers/${id}` && method === "DELETE") {
              saved.library_status = "TRASHED";
              return { success: true };
            }
            if (route === `/archive-saved-papers/${id}`) return { paper: saved };
            if (route === `/archive-saved-papers/${id}/library` && method === "PATCH") {
              if (body.display_name) saved.library_display_name = body.display_name;
              if (body.status) saved.library_status = body.status;
              return { success: true, paper: saved };
            }
            throw new Error(`unexpected request ${method || "GET"} ${route}`);
          },
        },
      };
      const host = { innerHTML: "", prepend() {} };
      const listRoute = `https://archive.test/archive/workspace.html?view=saved&status=${scenario.status}`;
      await activeLibrary.render(host, "", scenario.status);
      assert.match(host.innerHTML, /이름 A/);
      const cachedListState = structuredClone(global.history.state);
      const firstListReads = requests.filter(row => row.route.startsWith("/archive-saved-papers?")).length;

      global.history.state = { archive2SavedLibraryDetail: true, archive2ScrollY: 0 };
      global.location = new URL(`https://archive.test/archive/workspace.html?view=saved&paper_id=${id}&status=${scenario.status}`);
      await activeLibrary.render(host, id, scenario.status);
      for (const action of scenario.actions) {
        const button = action.kind === "rename"
          ? { dataset: { libraryAction: "rename", paperId: id } }
          : action.kind === "delete"
            ? { dataset: { libraryAction: "delete", paperId: id } }
            : { dataset: { libraryAction: "library-status", paperId: id, status: action.status } };
        await host.onclick({ target: { closest: () => button }, preventDefault() {}, stopPropagation() {} });
        assert.ok(session.getItem("archive2.saved-paper-list-invalidated.v1"));
      }

      const listReadsBeforeBack = requests.filter(row => row.route.startsWith("/archive-saved-papers?")).length;
      global.history.state = cachedListState;
      global.location = new URL(listRoute);
      delete require.cache[libraryModulePath];
      activeLibrary = require(libraryModulePath);
      await activeLibrary.render(host, "", scenario.status);
      const listReadsAfterBack = requests.filter(row => row.route.startsWith("/archive-saved-papers?")).length;
      assert.equal(listReadsAfterBack,
        listReadsBeforeBack + (scenario.actions.length > 1 ? 1 : 0),
        scenario.actions.length > 1
          ? "multiple mutations fall back to one fresh list read"
          : "a single mutation retains its patched context fast path");
      assert.equal(session.getItem("archive2.saved-paper-list-invalidated.v1"), null);
      assert.equal(global.history.state.archive2SavedLibrary.cursor, "cursor-before-mutation");
      assert.equal(global.history.state.archive2SavedLibrary.scrollY, 240);
      if (scenario.expectedStatus) {
        assert.match(host.innerHTML, new RegExp(id));
        assert.equal(global.history.state.archive2SavedLibrary.papers[0].library_status, scenario.expectedStatus);
      } else assert.doesNotMatch(host.innerHTML, new RegExp(id));
      if (scenario.expectedName) assert.match(host.innerHTML, new RegExp(scenario.expectedName));
    }
  } finally {
    if (previous.window === undefined) delete global.window; else global.window = previous.window;
    if (previous.location === undefined) delete global.location; else global.location = previous.location;
    if (previous.history === undefined) delete global.history; else global.history = previous.history;
    if (previous.localStorage === undefined) delete global.localStorage; else global.localStorage = previous.localStorage;
    if (previous.document === undefined) delete global.document; else global.document = previous.document;
    if (previous.confirm === undefined) delete global.confirm; else global.confirm = previous.confirm;
  }
});
