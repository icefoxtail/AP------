import { spawnSync } from "node:child_process";

const fixture = process.argv[2] || "geometry";
const dataByFixture = {
  text: "exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js",
  math: "exams/original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js",
  geometry: "exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js"
};
const url = new URL("http://127.0.0.1:8768/archive/engine.html");
url.searchParams.set("data", dataByFixture[fixture]);
url.searchParams.set("mode", "exam");
url.searchParams.set("qpp", "4");
const result = spawnSync("C:/Program Files/Google/Chrome/Application/chrome.exe", [
  "--headless=new",
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--enable-logging=stderr",
  "--run-all-compositor-stages-before-draw",
  "--user-data-dir=C:/Users/USER/AppData/Local/Temp/codex-archive2-headless-dump",
  "--virtual-time-budget=12000",
  "--dump-dom",
  url.href
], { encoding: "utf8", timeout: 60000, maxBuffer: 32 * 1024 * 1024 });
const html = result.stdout || "";
const error = html.match(/data-ap-render-error="([^"]*)"/i)?.[1] || null;
const readinessRaw = html.match(/data-ap-print-readiness="([^"]*)"/i)?.[1] || null;
const readinessText = readinessRaw?.replace(/&quot;/g, '"').replace(/&amp;/g, '&') || null;
let readiness = readinessText;
try { if (readinessText) readiness = JSON.parse(readinessText); } catch {}
const logLines = (result.stderr || "").split(/\r?\n/).filter(line => /IMAGE|READINESS|archive-engine|QUESTION_IMAGE/i.test(line)).slice(-40);
console.log(JSON.stringify({fixture,status:result.status,error:result.error?.message||null,renderError:error,readiness,logLines,htmlLength:html.length,pages:(html.match(/class="page(?:\s|")/g)||[]).length},null,2));
