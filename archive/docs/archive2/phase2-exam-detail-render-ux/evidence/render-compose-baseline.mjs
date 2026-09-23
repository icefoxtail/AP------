import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const evidence = path.dirname(fileURLToPath(import.meta.url));
const screenDir = path.join(evidence, "screens");
fs.mkdirSync(screenDir, { recursive: true });
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const phase = process.argv[2] || "baseline";
const scopeKeys = ["scope-17-집합과명제-명제-all","scope-18-집합과명제-집합-all","scope-13-도형의방정식-평면좌표-all","scope-14-도형의방정식-직선의방정식-all","scope-15-도형의방정식-원의방정식-all","scope-16-도형의방정식-도형의이동-all"];

async function launchChrome() {
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "codex-archive2-compose-"));
  const child = spawn(chrome, [
    "--headless=new", "--disable-gpu", "--no-first-run", "--no-default-browser-check",
    "--remote-debugging-port=0", "--remote-allow-origins=*",
    "--user-data-dir=" + profile, "about:blank"
  ], { stdio: "ignore", windowsHide: true });
  const activePortFile = path.join(profile, "DevToolsActivePort");
  for (let attempt = 0; attempt < 200 && !fs.existsSync(activePortFile); attempt++) {
    if (child.exitCode !== null) throw new Error("Chrome exited early: " + child.exitCode);
    await delay(100);
  }
  if (!fs.existsSync(activePortFile)) throw new Error("Chrome DevToolsActivePort was not created");
  const port = fs.readFileSync(activePortFile, "utf8").trim().split(/\r?\n/)[0];
  const version = await fetch("http://127.0.0.1:" + port + "/json/version").then(r => r.json());
  const ws = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve, { once: true });
    ws.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const browserEvents = [];
  ws.addEventListener("message", event => {
    let message;
    try { message = JSON.parse(String(event.data)); } catch { return; }
    if (message.method === "Page.javascriptDialogOpening") {
      browserEvents.push({ type: "javascriptDialog", sessionId: message.sessionId, params: message.params });
      send("Page.handleJavaScriptDialog", { accept: false }, message.sessionId).catch(error => browserEvents.push({ type: "dismissError", message: error.message }));
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      browserEvents.push({ type: "runtimeException", details: message.params.exceptionDetails?.text || "" });
      return;
    }
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
      const timer = setTimeout(() => { pending.delete(id); reject(new Error("CDP timeout: " + method)); }, 120000);
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
    await Promise.race([new Promise(resolve => child.once("exit", resolve)), delay(5000)]);
    if (child.exitCode === null) { try { child.kill(); } catch {} }
  }
  return { send, evaluate, close, browserEvents };
}

async function openWorkspace(browser, width, height) {
  const target = await browser.send("Target.createTarget", { url: "about:blank" });
  const attached = await browser.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;
  await browser.send("Page.enable", {}, sessionId);
  await browser.send("Runtime.enable", {}, sessionId);
  await browser.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false }, sessionId);
  const clearWorkspaceLocal = '(function(){if(location.origin==="http://127.0.0.1:8768"&&location.pathname==="/archive/workspace.html")localStorage.clear()})()';
  await browser.send("Page.addScriptToEvaluateOnNewDocument", { source: clearWorkspaceLocal }, sessionId);
  await browser.send("Page.navigate", { url: "http://127.0.0.1:8768/archive/workspace.html?view=compose" }, sessionId);
  return { targetId: target.targetId, sessionId, width, height };
}

async function evalJson(browser, page, expression) {
  const value = await browser.evaluate(expression, page.sessionId);
  return typeof value === "string" ? JSON.parse(value) : value;
}

async function waitComposeReady(browser, page) {
  let state;
  for (let i = 0; i < 120; i++) {
    state = await evalJson(browser, page, '(()=>JSON.stringify({title:document.querySelector("main h1")?.innerText||"",scopeCount:document.querySelectorAll("input[data-scope]").length,ready:document.readyState,bodyWidth:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth}))()');
    if (state.scopeCount > 0) return state;
    await delay(250);
  }
  throw new Error("Compose scopes did not load: " + JSON.stringify(state));
}

async function chooseScopes(browser, page) {
  let result = null;
  for (const key of scopeKeys) {
    console.log("before scope click " + key);
    const expression = '(()=>{const input=Array.from(document.querySelectorAll("input[data-scope]")).find(x=>x.dataset.scope===' + JSON.stringify(key) + ');if(!input)throw new Error("missing scope");input.click();return JSON.stringify({checked:document.querySelectorAll("input[data-scope]:checked").length,summary:document.querySelector(".compose-create-bar strong")?.innerText||""})})()';
    result = await evalJson(browser, page, expression);
    console.log("after scope click " + JSON.stringify(result));
    await delay(100);
  }
  return result;
}

async function generatePaper(browser, page) {
  await browser.evaluate('document.querySelector("button[data-action=generate]")?.click()', page.sessionId);
  let state;
  for (let i = 0; i < 240; i++) {
    state = await evalJson(browser, page, '(()=>{const f=document.querySelector("#preview-host iframe");const d=f?.contentDocument;const a=d?.querySelector("#print-area");return JSON.stringify({panel:!!document.querySelector(".paper-panel"),count:document.querySelector(".paper-count")?.innerText||"",parts:document.querySelector("#preview-index")?.options?.length||0,partValue:document.querySelector("#preview-index")?.value||null,frameSrc:f?.src||null,ready:d?.documentElement?.dataset?.apRenderReady||null,error:d?.documentElement?.dataset?.apRenderError||null,pages:a?.querySelectorAll(".page").length||0,questions:a?.querySelectorAll(".q-box[data-source-ref]").length||0,math:a?.querySelectorAll("mjx-container").length||0,images:a?.querySelectorAll("img").length||0,mode:d?.body?.className||""})})()');
    if (state.error) throw new Error("Compose preview error: " + state.error);
    if (state.panel && state.ready === "true" && state.pages > 0) return state;
    await delay(250);
  }
  throw new Error("Compose paper preview did not become ready: " + JSON.stringify(state));
}

async function currentPreview(browser, page) {
  return await evalJson(browser, page, '(()=>{const f=document.querySelector("#preview-host iframe");const d=f?.contentDocument;const a=d?.querySelector("#print-area");const u=f?.src?new URL(f.src):null;return JSON.stringify({frameSrc:f?.src||null,frameMode:u?.searchParams.get("mode")||null,frameQpp:u?.searchParams.get("qpp")||null,partValue:document.querySelector("#preview-index")?.value||"0",ready:d?.documentElement?.dataset?.apRenderReady||null,error:d?.documentElement?.dataset?.apRenderError||null,pages:a?.querySelectorAll(".page").length||0,questions:a?.querySelectorAll(".q-box[data-source-ref]").length||0,math:a?.querySelectorAll("mjx-container").length||0,images:a?.querySelectorAll("img").length||0,scale:a?getComputedStyle(a).transform:null})})()');
}

async function waitPreview(browser, page, mode, qpp, part) {
  let state;
  for (let i = 0; i < 240; i++) {
    state = await currentPreview(browser, page);
    if (state.error) throw new Error("mixed preview error: " + state.error);
    if (state.frameMode === mode && state.frameQpp === String(qpp) && state.partValue === String(part) && state.ready === "true" && state.pages > 0) return state;
    await delay(250);
  }
  throw new Error("mixed preview timeout: " + JSON.stringify(state));
}

async function setQpp(browser, page, qpp) {
  await browser.evaluate('(()=>{const s=document.querySelector("[data-output-field=qpp]");if(!s)throw new Error("qpp output control missing");s.value=String(' + qpp + ');s.dispatchEvent(new Event("change",{bubbles:true}));return s.value})()', page.sessionId);
  return await waitPreview(browser, page, "exam", qpp, 0);
}

async function switchOutputMode(browser, page, mode, label) {
  await browser.evaluate('document.querySelector("[data-action=output-mode][data-mode=' + mode + ']")?.click()', page.sessionId);
  return await waitPreview(browser, page, mode, 4, 0);
}

async function setPart(browser, page, part) {
  await browser.evaluate('(()=>{const s=document.querySelector("#preview-index");if(!s)throw new Error("paper part selector missing");s.value=String(' + part + ');s.dispatchEvent(new Event("change",{bubbles:true}));return s.value})()', page.sessionId);
  return await waitPreview(browser, page, "exam", 4, part);
}
async function screenshot(browser, page, name) {
  const capture = await browser.send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false }, page.sessionId);
  const output = path.join(screenDir, name);
  fs.writeFileSync(output, Buffer.from(capture.data, "base64"));
  return { file: name, bytes: fs.statSync(output).size };
}

async function printMixedPdf(browser, frameSrc, qpp) {
  const url = new URL(frameSrc);
  url.searchParams.set("qpp", String(qpp));
  url.searchParams.set("mode", "exam");
  const target = await browser.send("Target.createTarget", { url: "about:blank" });
  const attached = await browser.send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;
  await browser.send("Page.enable", {}, sessionId);
  await browser.send("Runtime.enable", {}, sessionId);
  await browser.send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
  await browser.send("Page.navigate", { url: url.href }, sessionId);
  let state;
  for (let i = 0; i < 240; i++) {
    state = await evalJson(browser, { sessionId }, '(()=>{const d=document.documentElement,a=document.querySelector("#print-area");const images=[...(a?.querySelectorAll("img")||[])].map(x=>({complete:x.complete,width:x.naturalWidth,height:x.naturalHeight}));return JSON.stringify({title:document.title,ready:d?.dataset?.apRenderReady||null,error:d?.dataset?.apRenderError||null,pages:a?.querySelectorAll(".page").length||0,questions:a?.querySelectorAll(".q-box[data-source-ref]").length||0,math:a?.querySelectorAll("mjx-container").length||0,mathErrors:a?.querySelectorAll("mjx-merror").length||0,images,header:a?.querySelector(".page-header")?.innerText||"",qpp:new URL(location.href).searchParams.get("qpp")})})()');
    if (state.error) throw new Error("mixed A4 render error: " + state.error);
    if (state.ready === "true" && state.pages > 0 && state.mathErrors === 0 && state.images.every(image => image.complete && image.width > 0 && image.height > 0)) break;
    await delay(250);
  }
  if (!state || state.ready !== "true" || state.pages < 1 || state.mathErrors !== 0 || state.images.some(image => !image.complete || image.width < 1 || image.height < 1)) {
    throw new Error("mixed A4 render did not become ready: " + JSON.stringify(state));
  }
  const result = await browser.send("Page.printToPDF", { printBackground: true, displayHeaderFooter: false, preferCSSPageSize: true, scale: 1 }, sessionId);
  const outputDir = path.join(evidence, "a4", "final");
  fs.mkdirSync(outputDir, { recursive: true });
  const name = "mixed-compose-exam-qpp" + qpp + ".pdf";
  const output = path.join(outputDir, name);
  fs.writeFileSync(output, Buffer.from(result.data, "base64"));
  if (fs.statSync(output).size < 10000) throw new Error(name + " PDF too small");
  await browser.send("Target.closeTarget", { targetId: target.targetId });
  return { qpp, pdf: name, bytes: fs.statSync(output).size, renderedPages: state.pages, questions: state.questions, math: state.math, images: state.images.length, header: state.header };
}

const browser = await launchChrome();
const report = { selectedScopeKeys: scopeKeys, desktop: {}, mobile: {} };
try {
  const desktop = await openWorkspace(browser, 1440, 900);
  report.desktop.before = await waitComposeReady(browser, desktop);
  report.desktop.emptyScreenshot = await screenshot(browser, desktop, phase + "-compose-empty-desktop.png");
  console.log("workspace ready desktop"); report.desktop.selection = await chooseScopes(browser, desktop);
  report.desktop.generated = await generatePaper(browser, desktop);
  console.log("after generate ready", JSON.stringify(report.desktop.generated));
  report.desktop.selectedScreenshot = await screenshot(browser, desktop, phase + "-compose-selected-desktop.png");
  report.desktop.layout = await evalJson(browser, desktop, '(()=>{const rect=s=>{const e=document.querySelector(s);return e?.getBoundingClientRect().toJSON()||null};return JSON.stringify({viewport:[innerWidth,innerHeight],docWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,paperPanel:rect(".paper-panel"),paperToolbar:rect(".paper-toolbar"),previewIframe:rect(".preview"),inspector:rect(".inspector"),modeButtons:[...document.querySelectorAll(".mode-switch button")].map(b=>({text:b.innerText,height:b.getBoundingClientRect().height,selected:b.classList.contains("active")})),partSelector:rect("#preview-index")})})()');

  await browser.evaluate('document.querySelector("#question-list > summary")?.click()', desktop.sessionId);
  await delay(300);
  report.desktop.questionManager = await evalJson(browser, desktop, '(()=>JSON.stringify({open:document.querySelector("#question-list")?.open||false,rows:document.querySelectorAll(".paper-list .paper-row").length,buttons:[...document.querySelectorAll(".paper-list button")].slice(0,4).map(b=>({text:b.innerText,rect:b.getBoundingClientRect().toJSON(),disabled:b.disabled}))}))()');
  report.desktop.managerScreenshot = await screenshot(browser, desktop, phase + "-compose-question-manager-desktop.png");
  const beforeUid = await browser.evaluate('document.querySelector(".paper-row")?.dataset.questionUid||null', desktop.sessionId);
  await browser.evaluate('document.querySelector(".paper-list [data-action=pin]")?.click()', desktop.sessionId);
  await delay(120);
  const pinned = await evalJson(browser, desktop, '(()=>{const e=document.querySelector(".paper-row");return JSON.stringify({uid:e?.dataset.questionUid||null,pinned:e?.classList.contains("pinned")||false,pressed:document.querySelector(".paper-list [data-action=pin]")?.getAttribute("aria-pressed")||null})})()');
  await browser.evaluate('document.querySelector(".paper-list [data-action=replace]")?.click()', desktop.sessionId);
  await delay(120);
  const replacementModal = await evalJson(browser, desktop, '(()=>JSON.stringify({open:document.querySelector("#modal")?.open||false,candidates:document.querySelectorAll("#modal [data-action=candidate-use]").length,copy:document.querySelector("#modal-body")?.innerText.slice(0,280)||""}))()');
  let replacement = { attempted: false, modal: replacementModal };
  if (replacementModal.candidates > 0) {
    await browser.evaluate('document.querySelector("#modal [data-action=candidate-use]")?.click()', desktop.sessionId);
    await delay(500);
    const afterReplace = await evalJson(browser, desktop, '(()=>{const e=document.querySelector(".paper-row");return JSON.stringify({uid:e?.dataset.questionUid||null,pinned:e?.classList.contains("pinned")||false,undoDisabled:document.querySelector(".batch-tools [data-action=undo]")?.disabled||false})})()');
    await browser.evaluate('document.querySelector(".batch-tools [data-action=undo]")?.click()', desktop.sessionId);
    await delay(500);
    const afterUndo = await evalJson(browser, desktop, '(()=>{const e=document.querySelector(".paper-row");return JSON.stringify({uid:e?.dataset.questionUid||null,pinned:e?.classList.contains("pinned")||false,undoDisabled:document.querySelector(".batch-tools [data-action=undo]")?.disabled||false})})()');
    replacement = { attempted: true, modal: replacementModal, afterReplace, afterUndo, uidRestored: afterUndo.uid === beforeUid, pinRestored: afterUndo.pinned === true };
  }
  report.desktop.pinReplaceUndo = { beforeUid, pinned, replacement };

  await browser.evaluate('document.querySelector("[data-action=inspector][data-tab=header]")?.click()', desktop.sessionId);
  await delay(200);
  report.desktop.outputSettings = await evalJson(browser, desktop, '(()=>{const s=document.querySelector("[data-output-field=qpp]");return JSON.stringify({tab:document.querySelector("[data-action=inspector][data-tab=header]")?.getAttribute("aria-selected"),qpp:s?.value,options:s?[...s.options].map(o=>o.value):[]})})()');
  report.desktop.settingsScreenshot = await screenshot(browser, desktop, phase + "-compose-output-settings-desktop.png");

  report.desktop.qppPreview = [];
  for (const qpp of [4, 6, 8]) {
    const qppState = qpp === 4 ? await waitPreview(browser, desktop, "exam", 4, 0) : await setQpp(browser, desktop, qpp);
    report.desktop.qppPreview.push({ qpp, pages: qppState.pages, questions: qppState.questions, frameQpp: qppState.frameQpp, frameSrc: qppState.frameSrc });
  }
  if (phase === "final") {
    report.desktop.a4 = [];
    for (const item of report.desktop.qppPreview) report.desktop.a4.push(await printMixedPdf(browser, item.frameSrc, item.qpp));
  }
  if (report.desktop.qppPreview.some(item => item.qpp === 8)) await setQpp(browser, desktop, 4);

  report.desktop.solution = await switchOutputMode(browser, desktop, "sol", "solution");
  report.desktop.solutionScreenshot = await screenshot(browser, desktop, phase + "-compose-solution-desktop.png");
  report.desktop.answer = await switchOutputMode(browser, desktop, "ans", "answer");
  report.desktop.answerScreenshot = await screenshot(browser, desktop, phase + "-compose-answer-desktop.png");
  await switchOutputMode(browser, desktop, "exam", "exam");
  report.desktop.secondPart = await setPart(browser, desktop, 1);
  report.desktop.secondPartScreenshot = await screenshot(browser, desktop, phase + "-compose-second-part-desktop.png");
  report.desktop.firstPart = await setPart(browser, desktop, 0);

  const mobile = await openWorkspace(browser, 390, 844);
  report.mobile.before = await waitComposeReady(browser, mobile);
  console.log("workspace ready mobile"); report.mobile.selection = await chooseScopes(browser, mobile);
  report.mobile.generated = await generatePaper(browser, mobile);
  report.mobile.layout = await evalJson(browser, mobile, '(()=>{const a=document.querySelector(".mobile-actions"),n=document.querySelector(".archive-mobile-tabs"),i=document.querySelector(".inspector");return JSON.stringify({viewport:[innerWidth,innerHeight],docWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,mobileActions:a?.getBoundingClientRect().toJSON()||null,bottomTabs:n?.getBoundingClientRect().toJSON()||null,inspector:i?.getBoundingClientRect().toJSON()||null,actionButtons:[...(a?.querySelectorAll("button")||[])].map(b=>({text:b.innerText,disabled:b.disabled,rect:b.getBoundingClientRect().toJSON()}))})})()');
  report.mobile.selectedScreenshot = await screenshot(browser, mobile, phase + "-compose-selected-mobile.png");
  await browser.evaluate('document.querySelector(".mobile-actions [data-action=mobile-inspector]")?.click()', mobile.sessionId);
  await delay(250);
  report.mobile.inspectorOpen = await evalJson(browser, mobile, '(()=>JSON.stringify({open:document.querySelector(".inspector")?.classList.contains("mobile-open"),inspector:document.querySelector(".inspector")?.getBoundingClientRect().toJSON(),nav:document.querySelector(".archive-mobile-tabs")?.getBoundingClientRect().toJSON(),hit:(()=>{const r=document.querySelector(".archive-mobile-tabs")?.getBoundingClientRect();return r?document.elementFromPoint(r.x+20,r.y+20)?.closest(".inspector")!==null:false})()}))()');
  report.mobile.inspectorScreenshot = await screenshot(browser, mobile, phase + "-compose-inspector-mobile.png");

  fs.writeFileSync(path.join(evidence, "compose-" + phase + ".json"), JSON.stringify(report, null, 2), "utf8");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await browser.close();
}
