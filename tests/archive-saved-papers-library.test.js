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
