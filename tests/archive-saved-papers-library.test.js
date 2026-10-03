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
  const requests = [];
  let copyPosts = 0;
  global.localStorage = local;
  global.location = new URL("https://archive.test/archive/workspace.html?view=saved");
  global.history = { pushState(_state, _title, url) { global.location = new URL(url, global.location); } };
  global.document = {
    createElement() {
      return { className: "", textContent: "", setAttribute() {}, remove() {} };
    },
  };
  global.window = {
    localStorage: local,
    crypto: { randomUUID: () => "00000000-0000-4000-8000-000000000043" },
    Archive2Output: outputWithCapture(),
    Archive2Api: {
      async request(route, body, method) {
        requests.push({ route, body, method });
        if (route === "/archive-saved-papers/" + sourceId) return { paper: saved };
        if (route === "/archive-saved-papers/" + copiedId) return { paper: copied };
        if (route === "/archive-saved-papers/" + sourceId + "/copy" && method === "POST") {
          copyPosts++;
          if (copyPosts === 1) throw new Error("reply lost after commit");
          return { success: true, saved: true, papers: [{ id: copiedId }] };
        }
        throw new Error("unexpected library API request: " + route);
      },
    },
  };
  try {
    const host = { innerHTML: "", prepend() {} };
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
