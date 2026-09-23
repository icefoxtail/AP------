import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";

const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const profile = fs.mkdtempSync(path.join(os.tmpdir(), "codex-archive2-cdp-"));
const url = new URL("http://127.0.0.1:8768/archive/engine.html");
url.searchParams.set("data", process.argv[2] || "exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js");
url.searchParams.set("mode", "exam");
url.searchParams.set("qpp", "4");

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

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const activePortFile = path.join(profile, "DevToolsActivePort");
for (let attempt = 0; attempt < 200 && !fs.existsSync(activePortFile); attempt++) {
  if (child.exitCode !== null) throw new Error("Chrome exited early: " + child.exitCode);
  await delay(100);
}
if (!fs.existsSync(activePortFile)) throw new Error("Chrome remote debugging port did not start");
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
  pending.delete(message.id);
  if (message.error) entry.reject(new Error(message.error.message));
  else entry.resolve(message.result);
});
function send(method, params = {}, sessionId = undefined) {
  const id = ++nextId;
  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject });
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    ws.send(JSON.stringify(message));
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error("CDP timeout: " + method));
      }
    }, 30000);
  });
}
async function evaluate(expression, sessionId) {
  const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true }, sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
  return result.result?.value;
}

const target = await send("Target.createTarget", { url: "about:blank" });
const attached = await send("Target.attachToTarget", { targetId: target.targetId, flatten: true });
const sessionId = attached.sessionId;
await send("Page.enable", {}, sessionId);
await send("Runtime.enable", {}, sessionId);
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
await send("Page.navigate", { url: url.href }, sessionId);

const expression = '(function(){try{const d=document.documentElement;const r=typeof archiveScreenRuntime==="undefined"?null:archiveScreenRuntime.inspect();const attempts=r?.attempts?.slice(-5).map(a=>({state:a.state,error:a.error?{message:a.error.message||String(a.error),code:a.error.code,details:a.error.details}:null,metrics:a.metrics}))||[];return JSON.stringify({readyState:document.readyState,renderReady:d.dataset.apRenderReady||null,renderError:d.dataset.apRenderError||null,pages:document.querySelectorAll("#print-area .page").length,questions:document.querySelectorAll("#print-area .q-box").length,images:Array.from(document.querySelectorAll("#print-area img")).map(i=>({src:i.currentSrc||i.src,complete:i.complete,width:i.naturalWidth,height:i.naturalHeight})),math:document.querySelectorAll("#print-area mjx-container").length,attempts})}catch(e){return JSON.stringify({evaluationError:String(e)})}})()';
let state = null;
for (let attempt = 0; attempt < 240; attempt++) {
  state = JSON.parse(await evaluate(expression, sessionId));
  if (state.renderReady === "true" || state.renderError) break;
  await delay(250);
}
console.log(JSON.stringify({url:url.href,profile,state},null,2));
try { await send("Browser.close"); } catch {}
try { ws.close(); } catch {}
