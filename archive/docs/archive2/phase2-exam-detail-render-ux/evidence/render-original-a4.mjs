import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(evidence, "..", "..", "..", "..", "..");
const phase = process.argv[2] || "baseline";
if (!["baseline", "final"].includes(phase)) throw new Error("phase must be baseline or final");

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const fixtureSet = {
  text: {
    title: "2026 금당고 고1 1학기 기말고사",
    subtitle: "공통수학1",
    data: "exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js",
    expectedQuestions: 20
  },
  math: {
    title: "2026 금당고 고2 1학기 기말고사",
    subtitle: "대수",
    data: "exams/original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js",
    expectedQuestions: 21
  },
  geometry: {
    title: "2026 매산고 고2 1학기 중간고사",
    subtitle: "기하",
    data: "exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js",
    expectedQuestions: 21
  }
};
const outDir = path.join(evidence, "a4", phase);
const screenDir = path.join(evidence, "screens");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(screenDir, { recursive: true });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function launchChrome() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "codex-archive2-cdp-"));
  const child = spawn(chrome, [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--remote-debugging-port=0",
    "--remote-allow-origins=*",
    "--user-data-dir=" + profile,
    "about:blank"
  ], { stdio: "ignore", windowsHide: true });
  const activePortFile = path.join(profile, "DevToolsActivePort");
  for (let attempt = 0; attempt < 200 && !fs.existsSync(activePortFile); attempt++) {
    if (child.exitCode !== null) throw new Error("Chrome exited before DevTools started: " + child.exitCode);
    await delay(100);
  }
  assert.ok(fs.existsSync(activePortFile), "Chrome DevToolsActivePort was not created");
  const port = fs.readFileSync(activePortFile, "utf8").trim().split(/\r?\n/)[0];
  const version = await fetch("http://127.0.0.1:" + port + "/json/version").then(r => r.json());
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  ws.addEventListener("message", event => {
    let message;
    try { message = JSON.parse(String(event.data)); } catch { return; }
    if (!message.id || !pending.has(message.id)) return;
    const entry = pending.get(message.id);
    clearTimeout(entry.timer);
    pending.delete(message.id);
    if (message.error) entry.reject(new Error(message.error.message));
    else entry.resolve(message.result);
  });
  function send(method, params = {}, sessionId = undefined) {
    const id = ++nextId;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error("CDP timeout: " + method));
      }, 30000);
      pending.set(id, { resolve, reject, timer });
      const message = { id, method, params };
      if (sessionId) message.sessionId = sessionId;
      ws.send(JSON.stringify(message));
    });
  }
  async function evaluate(expression, sessionId) {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result?.value;
  }
  async function close() {
    try { await send("Browser.close"); } catch {}
    try { ws.close(); } catch {}
    await Promise.race([
      new Promise(resolve => child.once("exit", resolve)),
      delay(5000)
    ]);
    if (child.exitCode === null) {
      try { child.kill(); } catch {}
      await Promise.race([new Promise(resolve => child.once("exit", resolve)), delay(2000)]);
    }
    const tempRoot = path.resolve(os.tmpdir());
    const resolved = path.resolve(profile);
    if (resolved.startsWith(tempRoot + path.sep)) {
      try { fs.rmSync(resolved, { recursive: true, force: true }); } catch {}
    }
  }
  return { send, evaluate, close };
}

function sourceFile(fixture) {
  return fixture.data.replace(/^exams\//, "");
}

function makeOriginalSnapshot(fixture, qpp, key) {
  const file = sourceFile(fixture);
  const sourcePath = path.join(repo, "archive", "exams", ...file.split("/"));
  const source = fs.readFileSync(sourcePath, "utf8");
  const scope = {};
  new Function("window", "document", source)(scope, { baseURI: "http://127.0.0.1:8768/archive/" });
  const bank = scope.questions || scope.questionBank;
  assert.ok(Array.isArray(bank) && bank.length >= fixture.expectedQuestions, fixture.title + ": source bank missing");

  const questions = bank.map((question, index) => {
    const ordinal = index + 1;
    const uid = "qid_v1_" + createHash("sha256").update(file + "#" + ordinal).digest("hex");
    const sourceFingerprint = createHash("sha256").update(JSON.stringify({
      content: question.content ?? null,
      choices: Array.isArray(question.choices) ? question.choices : null,
      answer: question.answer ?? null,
      solution: question.solution ?? null,
      image: question.image ?? null
    })).digest("hex");
    return {
      ...question,
      questionUid: uid,
      sourceArchiveFile: file,
      sourceOrdinal: ordinal,
      sourceQuestionNo: question.id ?? ordinal,
      _sourceFile: file,
      _sourceQuestionOrdinal: ordinal,
      _sourceQuestionNo: question.id ?? ordinal,
      sourceFingerprint,
      identityStatus: "VERIFIED"
    };
  });
  const meta = {
    sourceKind: "archive2-original",
    sourceArchiveFile: file,
    questionUids: questions.map(question => question.questionUid),
    identityTitle: file.split("/").pop().replace(/\.js$/i, ""),
    printHeaderOptions: {
      title: fixture.title,
      subtitle: fixture.subtitle,
      metaRight: "",
      showNameLine: true,
      showScoreLine: true,
      applyToSolution: true,
      applyToAnswer: true
    },
    qpp,
    includeQr: false
  };
  const payload = { questions, meta };
  const localStorageKey = "archive2Original_" + key;
  const script = '(function(){if(location.origin!=="http://127.0.0.1:8768")return;localStorage.setItem(' +
    JSON.stringify(localStorageKey) + "," + JSON.stringify(JSON.stringify(payload)) + ");})()";
  return { key, script };
}

let snapshotSerial = 0;
function originalUrl(fixture, mode, qpp, key, screen = false) {
  const url = new URL("http://127.0.0.1:8768/archive/engine.html");
  url.searchParams.set("qpp", String(qpp));
  url.searchParams.set("submitQr", "0");
  url.searchParams.set("solQr", "0");
  url.searchParams.set("portalQr", "1");
  url.searchParams.set("preRegistered", "1");
  url.searchParams.set("assignmentRegistered", "1");
  url.searchParams.set("originalSnapshot", key);
  url.searchParams.set("data", fixture.data);
  url.searchParams.set("mode", mode);
  if (screen) url.searchParams.set("fit", "screen");
  return url.href;
}

async function openPage(browser, url, viewport = { width: 1440, height: 900 }, initScript = null) {
  const target = await browser.send("Target.createTarget", { url: "about:blank" });
  const attached = await browser.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;
  await browser.send("Page.enable", {}, sessionId);
  await browser.send("Runtime.enable", {}, sessionId);
  await browser.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false
  }, sessionId);
  if (initScript) await browser.send("Page.addScriptToEvaluateOnNewDocument", { source: initScript }, sessionId);
  return { targetId: target.targetId, sessionId, url };
}

const stateExpression = '(function(){const d=document.documentElement;const p=document.querySelector("#print-area");return JSON.stringify({title:document.title,readyState:document.readyState,renderReady:d?.dataset?.apRenderReady||null,renderError:d?.dataset?.apRenderError||null,pages:p?p.querySelectorAll(".page").length:0,questions:p?p.querySelectorAll(".q-box[data-source-ref]").length:0,answers:p?p.querySelectorAll(".ans-cell:not(.ans-cell-empty)").length:0,math:p?p.querySelectorAll("mjx-container").length:0,mathErrors:p?p.querySelectorAll("mjx-merror").length:0,images:p?Array.from(p.querySelectorAll("img")).map(i=>({src:i.currentSrc||i.src,complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})):[],printReadiness:d?.dataset?.apPrintReadiness||null,headerTitle:p?.querySelector(".page-header-title")?.textContent||null,headerText:p?.querySelector(".page-header")?.textContent||null,headerSubtitle:p?.querySelector(".page-header-subtitle")?.textContent||null,bodyClass:document.body?.className||"",screenScale:p?getComputedStyle(p).transform:null})})()';

async function waitReady(browser, page) {
  if (page.initScript) await browser.send("Page.addScriptToEvaluateOnNewDocument", { source: page.initScript }, page.sessionId);
  await browser.send("Page.navigate", { url: page.url }, page.sessionId);
  let state;
  for (let attempt = 0; attempt < 240; attempt++) {
    state = JSON.parse(await browser.evaluate(stateExpression, page.sessionId));
    if (state.renderError) throw new Error("AP_RENDER_ERROR " + state.renderError + " " + JSON.stringify(state));
    const allImagesReady = state.images.every(image => image.complete && image.width > 0 && image.height > 0);
    if (state.renderReady === "true" && state.pages > 0 && state.mathErrors === 0 && allImagesReady) return state;
    await delay(250);
  }
  throw new Error("render readiness timeout: " + JSON.stringify(state));
}

async function printPdf(browser, fixtureName, fixture, mode, qpp) {
  const key = "stage2-" + fixtureName + "-" + mode + "-qpp" + qpp + "-" + (++snapshotSerial);
  const seeded = makeOriginalSnapshot(fixture, qpp, key);
  const page = await openPage(browser, originalUrl(fixture, mode, qpp, key), { width: 1440, height: 900 }, seeded.script);
  const state = await waitReady(browser, page);
  assert.ok((state.headerText || "").replace(/\s+/g, " ").includes(fixture.title), fixtureName + " display title contract: " + JSON.stringify(state.headerText));
  if (mode === "exam") assert.equal(state.headerSubtitle, fixture.subtitle, fixtureName + " display subtitle contract");
  if (mode === "ans") assert.ok(state.answers >= fixture.expectedQuestions, fixtureName + " answer count"); else assert.ok(state.questions >= fixture.expectedQuestions, fixtureName + " question count");
  assert.ok(state.math > 0, fixtureName + " MathJax count");
  assert.equal(state.mathErrors, 0, fixtureName + " MathJax errors");

  const result = await browser.send("Page.printToPDF", {
    printBackground: true,
    displayHeaderFooter: false,
    preferCSSPageSize: true,
    scale: 1
  }, page.sessionId);
  const name = fixtureName + "-" + mode + "-qpp" + qpp + ".pdf";
  const output = path.join(outDir, name);
  fs.writeFileSync(output, Buffer.from(result.data, "base64"));
  assert.ok(fs.statSync(output).size > 10000, name + " PDF too small");
  await browser.send("Target.closeTarget", { targetId: page.targetId });
  return { fixture: fixtureName, mode, qpp, pdf: name, bytes: fs.statSync(output).size, renderedPages: state.pages, pageSizeAuthority: "@page A4", questions: state.questions, math: state.math, images: state.images.length, title: state.headerTitle, subtitle: state.headerSubtitle, printReadiness: state.printReadiness };
}

async function captureOriginalScreenshot(browser, name, width, height, fixture, mode = "exam") {
  const key = "stage2-screen-" + width + "-" + height + "-" + (++snapshotSerial);
  const seeded = makeOriginalSnapshot(fixture, 4, key);
  const page = await openPage(browser, originalUrl(fixture, mode, 4, key, true), { width, height }, seeded.script);
  const state = await waitReady(browser, page);
  const capture = await browser.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }, page.sessionId);
  const output = path.join(screenDir, name);
  fs.writeFileSync(output, Buffer.from(capture.data, "base64"));
  assert.ok(fs.statSync(output).size > 10000, name + " screenshot too small");
  await browser.send("Target.closeTarget", { targetId: page.targetId });
  return { screenshot: name, bytes: fs.statSync(output).size, viewport: [width, height], pages: state.pages, scale: state.screenScale, headerTitle: state.headerTitle };
}

async function workspaceDetailScreenshot(browser, name, width, height) {
  const page = await openPage(browser, "http://127.0.0.1:8768/archive/workspace.html?view=find", { width, height });
  await browser.send("Page.navigate", { url: page.url }, page.sessionId);
  let found = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    found = await browser.evaluate('Array.from(document.querySelectorAll("button.exam-title")).some(b=>b.textContent.trim()==="2026 매산고 고2 1학기 중간고사")', page.sessionId);
    if (found) break;
    await delay(250);
  }
  assert.ok(found, "workspace Finder fixture title did not load at " + width + "px");
  await browser.evaluate('(()=>{const b=Array.from(document.querySelectorAll("button.exam-title")).find(x=>x.textContent.trim()==="2026 매산고 고2 1학기 중간고사");if(!b)throw new Error("fixture button missing");b.click();return true})()', page.sessionId);

  const expression = '(()=>{const f=document.querySelector("#original-preview-frame");const d=f?.contentDocument;const a=d?.querySelector("#print-area");const p=a?.querySelector(".page");const g=p?.querySelector(".grid-container");const r=x=>x?.getBoundingClientRect().toJSON()||null;const boxes=[...(g?.querySelectorAll(".q-box")||[])].slice(0,4).map(x=>{const s=x.querySelector(".ap-slot-content");return{text:x.innerText.slice(0,44),rect:r(x),height:getComputedStyle(x).height,scrollHeight:x.scrollHeight,position:getComputedStyle(x).position,flex:getComputedStyle(x).flex,slot:s?{rect:r(s),position:getComputedStyle(s).position,transform:getComputedStyle(s).transform,width:getComputedStyle(s).width}:null}});return JSON.stringify({dialog:document.querySelector("#modal")?.open||false,frameWidth:f?.getBoundingClientRect().width||0,ready:d?.documentElement.dataset.apRenderReady||null,error:d?.documentElement.dataset.apRenderError||null,pages:a?.querySelectorAll(".page").length||0,math:a?.querySelectorAll("mjx-container").length||0,images:a?.querySelectorAll("img").length||0,scale:a?getComputedStyle(a).transform:null,viewport:d?[d.defaultView.innerWidth,d.defaultView.innerHeight]:null,docWidth:d?.documentElement.scrollWidth||0,clientWidth:d?.documentElement.clientWidth||0,styleSheets:d?Array.from(d.styleSheets).map(s=>s.href).filter(x=>x&&x.includes("preview-mobile")):[],page:r(p),grid:g?{rect:r(g),columns:getComputedStyle(g).gridTemplateColumns,height:getComputedStyle(g).height,scrollHeight:g.scrollHeight}:null,boxes})})()';
  let metrics = null;
  for (let attempt = 0; attempt < 240; attempt++) {
    metrics = JSON.parse(await browser.evaluate(expression, page.sessionId));
    if (metrics.error) throw new Error("workspace preview error: " + metrics.error);
    if (metrics.dialog && metrics.ready === "true" && metrics.pages > 0) break;
    await delay(250);
  }
  assert.ok(metrics?.dialog && metrics?.pages > 0, "workspace detail preview did not become ready");
  const capture = await browser.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }, page.sessionId);
  const output = path.join(screenDir, name);
  fs.writeFileSync(output, Buffer.from(capture.data, "base64"));
  assert.ok(fs.statSync(output).size > 10000, name + " screenshot too small");
  await browser.send("Target.closeTarget", { targetId: page.targetId });
  return { screenshot: name, bytes: fs.statSync(output).size, viewport: [width, height], frameWidth: metrics.frameWidth, pages: metrics.pages, scale: metrics.scale };
}

const summary = { phase, original: [], screens: [] };
const browser = await launchChrome();
try {
  for (const [fixtureName, fixture] of Object.entries(fixtureSet)) {
    for (const qpp of [4, 6, 8]) {
      summary.original.push(await printPdf(browser, fixtureName, fixture, "exam", qpp));
    }
  }
  if (phase === "baseline") {
    summary.screens.push(await captureOriginalScreenshot(browser, "baseline-original-engine-desktop.png", 1440, 900, fixtureSet.geometry));
    summary.screens.push(await captureOriginalScreenshot(browser, "baseline-original-engine-mobile.png", 390, 844, fixtureSet.geometry));
    summary.screens.push(await workspaceDetailScreenshot(browser, "baseline-workspace-detail-desktop.png", 1440, 900));
    summary.screens.push(await workspaceDetailScreenshot(browser, "baseline-workspace-detail-mobile.png", 390, 844));
  } else {
    summary.original.push(await printPdf(browser, "geometry", fixtureSet.geometry, "sol", 4));
    summary.original.push(await printPdf(browser, "geometry", fixtureSet.geometry, "ans", 4));
    summary.screens.push(await captureOriginalScreenshot(browser, "final-original-engine-desktop.png", 1440, 900, fixtureSet.geometry));
    summary.screens.push(await captureOriginalScreenshot(browser, "final-original-engine-mobile.png", 390, 844, fixtureSet.geometry));
    summary.screens.push(await captureOriginalScreenshot(browser, "final-original-solution-mobile.png", 390, 844, fixtureSet.geometry, "sol"));
    summary.screens.push(await captureOriginalScreenshot(browser, "final-original-answer-mobile.png", 390, 844, fixtureSet.geometry, "ans"));
    summary.screens.push(await workspaceDetailScreenshot(browser, "final-workspace-detail-desktop.png", 1440, 900));
    summary.screens.push(await workspaceDetailScreenshot(browser, "final-workspace-detail-mobile.png", 390, 844));
  }
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
} finally {
  await browser.close();
}
