const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const vm = require("node:vm");
const { chromium } = require(process.env.AP_PLAYWRIGHT_MODULE || "playwright");
const Archive2Output = require("../archive/archive2-output.js");

const root = path.resolve(__dirname, "..");
const archive2Workspace = fs.readFileSync(path.join(root, "archive/archive2-workspace.js"), "utf8");
const unitPastFixtureFile = "original/high/h1/1final/unit-past-preview-regression.js";
const unitPastFixtureData = Array.from({ length: 12 }, (_, index) => ({
  id: index + 1,
  sourceOrdinal: index + 1,
  grade: "고1",
  subject: "공통수학1",
  course: "공통수학1",
  standardUnitKey: "H22-C-01",
  standardUnit: "다항식의 연산",
  subUnitKey: "H22-C-01-CORE",
  subUnitParentKey: "H22-C-01",
  subUnit: "핵심",
  level: index < 4 ? "하" : index < 9 ? "중" : "상",
  question_uid: `unit-past-mobile-${index + 1}`,
}));
const unitPastFixtureHtml = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="./"><title>Unit Past preview regression</title></head>
<body class="unit-page"><div id="unit-kicker"></div><h1 id="unit-title"></h1><div id="unit-summary"></div><div id="unit-status" role="status" aria-live="polite"></div><nav id="unit-stepper"></nav><select id="unit-qpp"><option value="4" selected>4문항</option></select><main id="unit-content"></main>
<script src="archive2-core.js"></script><script src="unit-past-exams-core.js"></script><script src="unit-past-exams.js"></script>
<script>window.ARCHIVE_META_FOUNDATION_RUNTIME={status:'ACTIVE',ownedScopes:[],taxonomyRows:[]};window.questionIndex=${JSON.stringify(unitPastFixtureData.map((question) => ({ ...question, sourceFile: unitPastFixtureFile, sourceQuestionNo: question.id })))};window.UnitPastExams.init();</script></body></html>`;
const archive2ExamData = "exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js";
const archive2ExamSource = path.join(root, "archive", archive2ExamData);
const archive2ExamWindow = { questionBank: null, examTitle: "" };
vm.runInNewContext(fs.readFileSync(archive2ExamSource, "utf8"), { window: archive2ExamWindow }, { timeout: 10000 });
const archive2Questions = JSON.parse(JSON.stringify(archive2ExamWindow.questionBank));
const archive2QuestionCount = archive2Questions.length;
const mixedKey = "archive2-mobile-regression";
const answer = (index) => index + 1;

let server;
let browser;
let baseUrl;

test.before(async () => {
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    if (pathname === "/archive/__unit-past-preview-regression.html") {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      response.end(unitPastFixtureHtml);
      return;
    }
    if (pathname === `/archive/exams/${unitPastFixtureFile}`) {
      response.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8" });
      response.end(`window.examTitle='Unit Past regression fixture';window.questionBank=${JSON.stringify(unitPastFixtureData.map((question) => ({
        ...question,
        content: `Fixture question ${question.id}`,
        answer: question.id,
        solution: `Fixture solution ${question.id}`,
      })))};`);
      return;
    }
    const relative = pathname.replace(/^\/+/, "").split("/").join(path.sep);
    const file = path.resolve(root, relative);
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403).end("forbidden");
      return;
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      response.writeHead(404).end("not found");
      return;
    }
    const types = {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".json": "application/json; charset=utf-8",
      ".svg": "image/svg+xml",
      ".woff2": "font/woff2",
    };
    response.writeHead(200, { "Content-Type": types[path.extname(file).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(file).pipe(response);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ channel: "chrome", headless: true });
});

test.after(async () => {
  await browser?.close();
  if (server?.listening) await new Promise((resolve) => server.close(resolve));
});

function engineUrl({ engine, mode, qpp = 4, archive2 = true, executor, fitScreen = true, data = archive2ExamData }) {
  const url = new URL(`/archive/${engine}`, baseUrl);
  if (engine === "mixed_engine.html") url.searchParams.set("key", mixedKey);
  else url.searchParams.set("data", data);
  url.searchParams.set("mode", mode);
  url.searchParams.set("qpp", String(qpp));
  url.searchParams.set("prewarm", "0");
  if (fitScreen) url.searchParams.set("fit", "screen");
  if (archive2) url.searchParams.set("archive2Context", "archive2");
  if (executor) url.searchParams.set("executor", executor);
  return url;
}

async function openEngine(options) {
  const viewport = options.viewport || { width: 390, height: 844 };
  const page = await browser.newPage({ viewport });
  if (options.engine === "mixed_engine.html") {
    await page.addInitScript(({ key, questions }) => {
      localStorage.setItem(`mixedQuestions_${key}`, JSON.stringify(questions));
      localStorage.setItem(`mixedMeta_${key}`, JSON.stringify({
        title: "Archive2 mobile regression fixture",
        qpp: 4,
        sourceType: "mixed",
        printHeaderOptions: { title: "Archive2 mobile regression fixture" },
      }));
    }, { key: mixedKey, questions: archive2Questions });
  }
  await page.goto(engineUrl(options).href, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    document.documentElement.dataset.apRenderReady === "true" ||
    Boolean(document.documentElement.dataset.apRenderError),
  null, { timeout: 120000 });
  const error = await page.evaluate(() => document.documentElement.dataset.apRenderError || null);
  assert.equal(error, null, `engine render failed: ${error}`);
  await page.evaluate(async () => window.archiveScreenRuntime?.whenIdle());
  return page;
}

async function openArchiveIndex(search = "") {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.addInitScript(() => {
    window.__archiveOpenedUrls = [];
    window.open = (url) => { window.__archiveOpenedUrls.push(String(url)); return null; };
    window.addEventListener("load", (event) => event.stopImmediatePropagation(), true);
  });
  await page.route("https://**/*", (route) => route.abort());
  await page.goto(`${baseUrl}/archive/index.html${search}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() =>
    typeof window.buildAssignTargetPreviewUrl === "function" &&
    typeof window.Archive2Output?.engineUrl === "function",
  null, { timeout: 120000 });
  return page;
}

async function buildAssignPreviewUrl(page, item) {
  return page.evaluate((assignmentItem) => {
    window.eval(`AssignTarget = ${JSON.stringify({ item: assignmentItem, qpp: 4 })}`);
    return window.buildAssignTargetPreviewUrl();
  }, item);
}

async function visibleAnswerLayout(page) {
  return page.evaluate(() => {
    const grid = document.querySelector("#print-area .ans-grid");
    const cells = [...document.querySelectorAll("#print-area .ans-cell:not(.ans-cell-empty)")];
    const placed = cells.map((cell) => ({
      number: Number.parseInt(cell.querySelector(".ans-n")?.textContent || "", 10),
      top: cell.getBoundingClientRect().top,
      left: cell.getBoundingClientRect().left,
      display: getComputedStyle(cell).display,
    }));
    return {
      marker: document.documentElement.dataset.archive2Context || null,
      columns: grid ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0,
      visualOrder: placed
        .sort((a, b) => a.top - b.top || a.left - b.left)
        .map((cell) => cell.number),
      emptyCellsHidden: [...document.querySelectorAll("#print-area .ans-cell-empty")]
        .every((cell) => getComputedStyle(cell).display === "none"),
    };
  });
}

test("Archive2 output URLs carry an explicit context marker through every engine entry point", () => {
  for (const file of ["engine.html", "mixed_engine.html"]) {
    const url = Archive2Output.engineUrl(file, "https://example.test/archive/workspace.html");
    assert.equal(url.pathname, `/archive/${file}`);
    assert.equal(url.searchParams.get("archive2Context"), "archive2");
  }
  assert.equal((archive2Workspace.match(/\bO\.engineUrl\(/g) || []).length, 4);
  assert.doesNotMatch(archive2Workspace, /new URL\(\s*["'](?:mixed_)?engine\.html["']/);
});

test("390px Unit Past embedded preview carries Archive2 context and uses one-column reflow", { timeout: 300000 }, async () => {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const session = encodeURIComponent(Buffer.from(JSON.stringify({ role: "teacher", login_id: "browser-qa", name: "브라우저 검수" }), "utf8").toString("base64"));
  try {
    await page.goto(`${baseUrl}/archive/__unit-past-preview-regression.html?grade=h1#apmsess=${session}`, { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() =>
      document.querySelector("#unit-content .unit-card:not(:disabled), #unit-content .unit-error") ||
      document.querySelector("#unit-status.is-error"),
    null, { timeout: 30000 });
    const catalog = await page.evaluate(() => ({
      url: location.href,
      title: document.title,
      hasCore: Boolean(window.UnitPastExamsCore),
      hasApi: Boolean(window.UnitPastExams),
      questionCount: window.questionIndex?.length || 0,
      status: document.getElementById("unit-status")?.textContent || "",
      content: document.getElementById("unit-content")?.innerText.slice(0, 500) || "",
      cards: document.querySelectorAll("#unit-content .unit-card:not(:disabled)").length,
    }));
    assert.ok(catalog.cards > 0, JSON.stringify(catalog));
    await page.locator("#unit-content .unit-card:not(:disabled)").first().click();
    await page.waitForSelector("#unit-subunits", { timeout: 30000 });
    await page.locator("#unit-quick-count").fill("8");
    await page.locator("#unit-quick-count").dispatchEvent("change");
    await page.getByRole("button", { name: /미리보기로 이동/ }).click();
    await page.waitForSelector("#unit-preview-iframe", { timeout: 30000 });
    await page.waitForFunction(() => {
      const frame = document.getElementById("unit-preview-iframe");
      const doc = frame?.contentDocument;
      return doc?.documentElement?.dataset.apRenderError ||
        (doc?.documentElement?.dataset.apRenderReady === "true" &&
          doc.body?.classList.contains("screen-fit-mode") &&
          Boolean(doc.querySelector("#print-area .grid-container")));
    }, null, { timeout: 60000 });
    const preview = await page.evaluate(() => {
      const frame = document.getElementById("unit-preview-iframe");
      const doc = frame?.contentDocument;
      const grid = doc?.querySelector("#print-area .grid-container");
      return {
        url: frame?.src || null,
        urlMarker: frame ? new URL(frame.src).searchParams.get("archive2Context") : null,
        documentMarker: doc?.documentElement?.dataset.archive2Context || null,
        renderReady: doc?.documentElement?.dataset.apRenderReady || null,
        renderError: doc?.documentElement?.dataset.apRenderError || null,
        preview: frame ? new URL(frame.src).searchParams.get("preview") : null,
        parentViewport: innerWidth,
        frameViewport: frame?.contentWindow?.innerWidth || null,
        screenFit: doc?.body?.classList.contains("screen-fit-mode") || false,
        gridPresent: Boolean(grid),
        columns: grid ? getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length : 0,
      };
    });
    assert.equal(preview.urlMarker, "archive2", JSON.stringify(preview));
    assert.equal(preview.documentMarker, "archive2", JSON.stringify(preview));
    assert.equal(preview.preview, "1", JSON.stringify(preview));
    assert.equal(preview.parentViewport, 390, JSON.stringify(preview));
    assert.equal(preview.screenFit, true, JSON.stringify(preview));
    assert.equal(preview.columns, 1, JSON.stringify(preview));
    assert.ok(preview.frameViewport <= 640, JSON.stringify(preview));
  } finally {
    await page.close();
  }
});

test("Archive2 embedded original assignment preview uses the marked engine URL", async () => {
  const page = await openArchiveIndex("?archive2Issue=preview-regression");
  try {
    const href = await buildAssignPreviewUrl(page, {
      file: "original/high/h1/1mid/23_preview-regression.js",
      school: "Archive2 fixture",
      subject: "공통수학1",
    });
    const url = new URL(href);
    assert.equal(url.pathname, "/archive/engine.html");
    assert.equal(url.searchParams.get("archive2Context"), "archive2");
    assert.equal(url.searchParams.get("preview"), "1");
  } finally {
    await page.close();
  }
});

test("Archive2 embedded Unit Past assignment preview uses the marked mixed-engine URL", async () => {
  const page = await openArchiveIndex("?unitPastAssign=unit-past-preview-regression&archive2Embedded=1");
  try {
    const href = await buildAssignPreviewUrl(page, {
      unitPastSnapshotKey: "unit-past-preview-regression",
      identityTitle: "Archive2 Unit Past fixture",
      qCount: 12,
      count: 12,
    });
    const url = new URL(href);
    assert.equal(url.pathname, "/archive/mixed_engine.html");
    assert.equal(url.searchParams.get("archive2Context"), "archive2");
    assert.equal(url.searchParams.get("key"), "unit-past-preview-regression");
  } finally {
    await page.close();
  }
});

test("Archive1 goEngine and goUnitPastMixedEngine launches remain marker-free", async () => {
  const page = await openArchiveIndex("?legacy=1");
  try {
    const hrefs = await page.evaluate(() => {
      localStorage.setItem("mixedQuestions_archive1-legacy-regression", JSON.stringify([{ answer: "1" }]));
      window.goEngine({
        file: "original/high/h1/1mid/23_legacy-regression.js",
        school: "Archive1 fixture",
        subject: "공통수학1",
        questionCount: 1,
      }, "exam", 4);
      window.goUnitPastMixedEngine({
        unitPastSnapshotKey: "archive1-legacy-regression",
        qCount: 1,
        count: 1,
      }, "exam", 4);
      return window.__archiveOpenedUrls;
    });
    assert.equal(hrefs.length, 2);
    assert.equal(new URL(hrefs[0]).pathname, "/archive/engine.html");
    assert.equal(new URL(hrefs[0]).searchParams.get("archive2Context"), null);
    assert.equal(new URL(hrefs[1]).pathname, "/archive/mixed_engine.html");
    assert.equal(new URL(hrefs[1]).searchParams.get("archive2Context"), null);
  } finally {
    await page.close();
  }
});

test("390px Archive2 answers display 1..N naturally through shared and fallback renderers", { timeout: 300000 }, async () => {
  assert.ok(archive2QuestionCount >= 20, `fixture must contain at least 20 questions; got ${archive2QuestionCount}`);
  const want = Array.from({ length: archive2QuestionCount }, (_, index) => answer(index));
  for (const engine of ["engine.html", "mixed_engine.html"]) {
    for (const executor of [undefined, "legacy"]) {
      const page = await openEngine({ engine, mode: "ans", archive2: true, executor });
      try {
        const layout = await visibleAnswerLayout(page);
        assert.equal(layout.columns, 1, `${engine} (${executor || "shared executor"}) should use one mobile column`);
        assert.deepEqual(layout.visualOrder, want, `${engine} (${executor || "shared executor"}) visual DOM order`);
        assert.equal(layout.marker, "archive2");
        assert.equal(layout.emptyCellsHidden, true);
      } finally {
        await page.close();
      }
    }
  }
});

test("Archive1 engine URLs retain the two-column answer layout without Archive2 context", { timeout: 300000 }, async () => {
  assert.ok(archive2QuestionCount >= 20);
  const legacyOrder = [1, 13, 2, 14, 3, 15, 4, 16];
  for (const engine of ["engine.html", "mixed_engine.html"]) {
    const page = await openEngine({ engine, mode: "ans", archive2: false });
    try {
      const layout = await visibleAnswerLayout(page);
      assert.equal(layout.marker, null);
      assert.equal(layout.columns, 2, `${engine} should retain its legacy two-column layout`);
      assert.deepEqual(layout.visualOrder.slice(0, legacyOrder.length), legacyOrder);
    } finally {
      await page.close();
    }
  }
});

test("Archive2 390px exam and q3 SVG use the available mobile width while Archive1 keeps legacy caps", { timeout: 300000 }, async () => {
  assert.ok(archive2QuestionCount >= 20);
  const svgPath = path.join(root, "archive/assets/images/26_매산고_1학기_중간_고2_기하/q3-solution.svg");
  const svg = fs.readFileSync(svgPath, "utf8");
  assert.match(svg, /viewBox="0 0 620 420"/);

  const examPage = await openEngine({ engine: "engine.html", mode: "exam", archive2: true });
  try {
    const exam = await examPage.evaluate(() => ({
      viewport: innerWidth,
      questions: document.querySelectorAll("#print-area .q-box").length,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.equal(exam.viewport, 390);
    assert.ok(exam.questions >= archive2QuestionCount, JSON.stringify(exam));
    assert.ok(exam.scrollWidth <= exam.viewport, JSON.stringify(exam));
  } finally {
    await examPage.close();
  }

  const solutionPage = await openEngine({ engine: "engine.html", mode: "sol", archive2: true });
  try {
    await solutionPage.waitForFunction(() => {
      const image = [...document.querySelectorAll(".sol-image-wrap img")]
        .find((item) => item.getAttribute("src")?.includes("q3-solution.svg"));
      return Boolean(image?.complete && image.naturalWidth > 0);
    }, null, { timeout: 30000 });
    const visual = await solutionPage.evaluate(() => {
      const image = [...document.querySelectorAll(".sol-image-wrap img")]
        .find((item) => item.getAttribute("src")?.includes("q3-solution.svg"));
      const rect = image.getBoundingClientRect();
      const wrapper = image.closest(".sol-image-wrap").getBoundingClientRect();
      return {
        marker: document.documentElement.dataset.archive2Context || null,
        imageWidth: rect.width,
        wrapperWidth: wrapper.width,
        maxWidth: getComputedStyle(image).maxWidth,
        maxHeight: getComputedStyle(image).maxHeight,
      };
    });
    assert.ok(visual.imageWidth >= visual.wrapperWidth - 1, JSON.stringify(visual));
    assert.ok(visual.imageWidth <= visual.wrapperWidth + 1, JSON.stringify(visual));
    assert.equal(visual.maxHeight, "none");
    assert.equal(visual.marker, "archive2");
  } finally {
    await solutionPage.close();
  }

  const legacySolution = await openEngine({ engine: "engine.html", mode: "sol", archive2: false });
  try {
    const visual = await legacySolution.evaluate(() => {
      const image = [...document.querySelectorAll(".sol-image-wrap img")]
        .find((item) => item.getAttribute("src")?.includes("q3-solution.svg"));
      return {
        marker: document.documentElement.dataset.archive2Context || null,
        maxWidth: getComputedStyle(image).maxWidth,
        maxHeight: getComputedStyle(image).maxHeight,
      };
    });
    assert.equal(visual.marker, null);
    assert.equal(visual.maxWidth, "72%");
    assert.equal(visual.maxHeight, "145px");
  } finally {
    await legacySolution.close();
  }
});

test("Archive2 desktop and A4 qpp 4/6/8 retain their two-column and existing page counts", { timeout: 300000 }, async () => {
  const desktop = await openEngine({
    engine: "engine.html",
    mode: "ans",
    archive2: true,
    viewport: { width: 1440, height: 1000 },
  });
  try {
    const layout = await visibleAnswerLayout(desktop);
    assert.equal(layout.columns, 2);
    assert.deepEqual(layout.visualOrder.slice(0, 4), [1, 13, 2, 14]);
  } finally {
    await desktop.close();
  }

  const a4Data = "exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js";
  for (const [qpp, expectedPages] of [[4, 5], [6, 4], [8, 3]]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    try {
      await page.goto(engineUrl({ engine: "engine.html", mode: "exam", qpp, archive2: true, fitScreen: false, data: a4Data }).href, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() =>
        document.documentElement.dataset.apRenderReady === "true" ||
        Boolean(document.documentElement.dataset.apRenderError),
      null, { timeout: 120000 });
      const error = await page.evaluate(() => document.documentElement.dataset.apRenderError || null);
      assert.equal(error, null, `A4 qpp ${qpp} render failed: ${error}`);
      const result = await page.evaluate(() => ({
        printMedia: matchMedia("print").matches,
        marker: document.documentElement.dataset.archive2Context || null,
        pages: document.querySelectorAll("#print-area .page").length,
        qpp: AppState.qpp,
      }));
      assert.deepEqual(result, { printMedia: false, marker: "archive2", pages: expectedPages, qpp });
      await page.emulateMedia({ media: "print" });
      const printed = await page.evaluate(() => ({
        printMedia: matchMedia("print").matches,
        marker: document.documentElement.dataset.archive2Context || null,
        pages: document.querySelectorAll("#print-area .page").length,
        qpp: AppState.qpp,
      }));
      assert.deepEqual(printed, { printMedia: true, marker: "archive2", pages: expectedPages, qpp });
    } finally {
      await page.close();
    }
  }
});
