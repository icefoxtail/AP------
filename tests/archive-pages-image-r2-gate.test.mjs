// R2 exam image ordering gate (tools/ci/archive-pages-image-r2-gate.mjs, workflow step image_order).
// Decision logic with fake time / fake HTTP, the git range on a throwaway repository, the CLI end to end, and the
// workflow wiring (required, bounded, after the long verifications, before the gate and the Pages upload).
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { execFileSync, spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  gitAllImages, gitChangedImages, headCheck, planImageCheck, r2UrlFor, waitForImages
} from "../tools/ci/archive-pages-image-r2-gate.mjs";

const require = createRequire(import.meta.url);
const repo = fileURLToPath(new URL("..", import.meta.url));
const read = rel => fs.readFileSync(path.join(repo, rel), "utf8");
const gateScript = path.join(repo, "tools/ci/archive-pages-image-r2-gate.mjs");
const pages = read(".github/workflows/archive-pages-release.yml");

// ---- URL mapping: identical to the browsers' module and to the R2 copy destination ---------------------------------
test("r2UrlFor maps archive/assets/images/<key> to https://img.wangjiedu.com/exams/images/<encoded key> like the browser module", () => {
  const folder = "25_매산고_1학기_기말_고2_수학I";
  const file = `archive/assets/images/${folder}/q 1(a).png`;
  const url = r2UrlFor(file);
  assert.equal(url, `https://img.wangjiedu.com/exams/images/${encodeURIComponent(folder)}/${encodeURIComponent("q 1(a).png")}`);
  const base = require("../archive/archive-asset-base.js");
  assert.equal(url, base.resolveExamImageUrl(`assets/images/${folder}/q 1(a).png`, { config: { base: "https://img.wangjiedu.com" } }),
    "the gate checks exactly the URL the student pages request");
  assert.equal(r2UrlFor(file, { r2Base: "https://img.example.test/" }).startsWith("https://img.example.test/exams/images/"), true);
  assert.match(read(".github/workflows/r2-archive-assets-copy.yml"), /rclone copy archive\/assets\/images "r2-ap-assets:\$\{R2_BUCKET\}\/exams\/images"/,
    "the copy workflow still writes the same key layout");
  for (const bad of ["archive/assets/other/a/q.png", "archive/assets/images/q.png/../../x", "archive/assets/images/", "archive/assets/images//q.png"])
    assert.throws(() => r2UrlFor(bad), undefined, bad);
});

// ---- which images must be verified -----------------------------------------------------------------------------------
test("plan: no image change passes without checking anything; changed images are the ones verified", () => {
  const none = planImageCheck({ bases: ["a".repeat(40)], changedSince: () => ({ ok: true, files: [] }), all: () => { throw new Error("must not list every image"); } });
  assert.deepEqual(none.files, []);
  assert.equal(none.uncertain, false);
  const some = planImageCheck({ bases: ["a".repeat(40)], changedSince: base => ({ ok: true, files: [`archive/assets/images/n/q1.png`] }), all: () => { throw new Error("no"); } });
  assert.deepEqual(some.files, ["archive/assets/images/n/q1.png"]);
  assert.equal(some.base, "a".repeat(40));
});

test("plan: an unusable base falls back to the next one, then to every image (fail closed), and an unreadable list fails", () => {
  const deployed = "d".repeat(40), before = "b".repeat(40);
  const seen = [];
  const changedSince = base => { seen.push(base); return base === before ? { ok: true, files: ["archive/assets/images/n/q2.png"] } : { ok: false, files: [], error: "bad object" }; };
  const all = () => ({ ok: true, files: ["archive/assets/images/n/q1.png", "archive/assets/images/n/q2.png"] });
  const viaBefore = planImageCheck({ bases: [deployed, before], changedSince, all });
  assert.deepEqual(seen, [deployed, before]);
  assert.deepEqual(viaBefore.files, ["archive/assets/images/n/q2.png"]);
  const zero = planImageCheck({ bases: [null, "", "0".repeat(40)], changedSince: () => { throw new Error("zero/empty bases are never used"); }, all });
  assert.equal(zero.files.length, 2);
  assert.equal(zero.uncertain, true, "unknown release range verifies everything");
  const lost = planImageCheck({ bases: [deployed], changedSince: () => ({ ok: false, files: [] }), all });
  assert.equal(lost.uncertain, true);
  assert.equal(lost.files.length, 2);
  const broken = planImageCheck({ bases: [], changedSince, all: () => ({ ok: false, files: [], error: "no git" }) });
  assert.equal(broken.failed, true);
  const forced = planImageCheck({ bases: [deployed], forceAll: true, changedSince: () => { throw new Error("no"); }, all });
  assert.equal(forced.files.length, 2);
});

// ---- git range on a throwaway repository ---------------------------------------------------------------------------------
function tempRepo(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "image-r2-gate-"));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.test", "-c", "commit.gpgsign=false", ...args], { cwd: dir, encoding: "utf8" }).trim();
  const put = (rel, text) => { const file = path.join(dir, ...rel.split("/")); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); };
  git("init", "-q", "-b", "main");
  return { dir, git, put };
}

test("git range: added, modified and renamed images are listed; deleted ones and other files are not", t => {
  const { dir, git, put } = tempRepo(t);
  put("archive/assets/images/old_exam/q1.png", "one-aaaaaaaaaaaaaaaaaaaaaaaa");
  put("archive/assets/images/old_exam/q2.png", "two-bbbbbbbbbbbbbbbbbbbbbbbb");
  put("archive/assets/images/old_exam/q3.png", "three-cccccccccccccccccccccc");
  put("archive/exams/a.js", "x");
  git("add", "-A"); git("commit", "-q", "-m", "base");
  const base = git("rev-parse", "HEAD");
  put("archive/assets/images/old_exam/q1.png", "one-CHANGED-aaaaaaaaaaaaaaaaaaaaaaaa");
  fs.rmSync(path.join(dir, "archive/assets/images/old_exam/q2.png"));
  git("mv", "archive/assets/images/old_exam/q3.png", "archive/assets/images/old_exam/q3-renamed.png");
  put("archive/assets/images/25_새_시험/q1.svg", "<svg/>");
  put("archive/exams/a.js", "y");
  git("add", "-A"); git("commit", "-q", "-m", "change");
  const changed = gitChangedImages({ base, cwd: dir });
  assert.equal(changed.ok, true);
  assert.deepEqual(changed.files, [
    "archive/assets/images/25_새_시험/q1.svg", "archive/assets/images/old_exam/q1.png", "archive/assets/images/old_exam/q3-renamed.png"
  ].sort());
  assert.deepEqual(gitAllImages({ cwd: dir }).files, [
    "archive/assets/images/25_새_시험/q1.svg", "archive/assets/images/old_exam/q1.png", "archive/assets/images/old_exam/q3-renamed.png"
  ].sort());
  assert.equal(gitChangedImages({ base: "f".repeat(40), cwd: dir }).ok, false, "a base that is not in the checkout is reported, not guessed");
  assert.deepEqual(gitChangedImages({ base: git("rev-parse", "HEAD"), cwd: dir }).files, [], "no image change in the range");
});

// ---- one HEAD request ------------------------------------------------------------------------------------------------
test("headCheck: 200 is present; 404, other statuses and network errors are not yet present", async () => {
  const respond = status => async (url, init) => { assert.equal(init.method, "HEAD"); return { status }; };
  assert.deepEqual(await headCheck("https://x/a.png", { fetchImpl: respond(200) }), { present: true });
  assert.deepEqual(await headCheck("https://x/a.png", { fetchImpl: respond(404) }), { present: false, detail: "HTTP 404" });
  assert.equal((await headCheck("https://x/a.png", { fetchImpl: respond(503) })).present, false);
  assert.equal((await headCheck("https://x/a.png", { fetchImpl: respond(301) })).present, false, "a redirect is not the image");
  const boom = await headCheck("https://x/a.png", { fetchImpl: async () => { throw new TypeError("fetch failed"); } });
  assert.equal(boom.present, false);
  assert.match(boom.detail, /request failed/);
});

// ---- bounded wait with a fake clock --------------------------------------------------------------------------------------
function fakeClock() {
  let time = 0;
  const sleeps = [];
  return { now: () => time, sleep: async ms => { sleeps.push(ms); time += ms; }, sleeps };
}
const files = ["archive/assets/images/n/q1.png", "archive/assets/images/n/q2.png", "archive/assets/images/n/q3.png"];
const urlFor = file => r2UrlFor(file);

test("wait: everything already on R2 passes in one round without sleeping", async () => {
  const clock = fakeClock();
  const result = await waitForImages({ files, urlFor, check: async () => ({ present: true }), sleep: clock.sleep, now: clock.now, timeoutMs: 14 * 60000, intervalMs: 30000 });
  assert.equal(result.verdict, "pass");
  assert.equal(result.rounds, 1);
  assert.deepEqual(clock.sleeps, []);
});

test("wait: images that appear while the R2 copy runs are retried and the gate then passes", async () => {
  const clock = fakeClock();
  const calls = new Map();
  const check = async url => {
    calls.set(url, (calls.get(url) || 0) + 1);
    const n = calls.get(url);
    if (url.endsWith("q1.png")) return { present: true };
    if (url.endsWith("q2.png")) return n >= 3 ? { present: true } : { present: false, detail: "HTTP 404" };
    return n >= 2 ? { present: true } : { present: false, detail: "request failed: ETIMEDOUT" };
  };
  const logs = [];
  const result = await waitForImages({ files, urlFor, check, sleep: clock.sleep, now: clock.now, timeoutMs: 14 * 60000, intervalMs: 30000, log: m => logs.push(m) });
  assert.equal(result.verdict, "pass");
  assert.equal(result.rounds, 3);
  assert.equal(calls.get(urlFor(files[0])), 1, "a present image is not asked again");
  assert.deepEqual(clock.sleeps, [30000, 30000]);
  assert.ok(logs.some(l => /1\/3 present|2\/3 present/.test(l)));
});

test("wait: images still missing at the deadline fail with the missing list, and the wait is bounded", async () => {
  const clock = fakeClock();
  const check = async url => url.endsWith("q3.png") ? { present: false, detail: "HTTP 404" } : { present: true };
  const result = await waitForImages({ files, urlFor, check, sleep: clock.sleep, now: clock.now, timeoutMs: 14 * 60000, intervalMs: 30000 });
  assert.equal(result.verdict, "timeout");
  assert.deepEqual(result.missing.map(m => m.file), [files[2]]);
  assert.equal(result.missing[0].url, urlFor(files[2]));
  assert.ok(clock.now() <= 14 * 60000, "never sleeps past the deadline");
  assert.ok(clock.now() >= 14 * 60000 - 30000, "uses the whole allowance");
  assert.ok(result.rounds >= 28 && result.rounds <= 30);
});

test("wait: requests run in parallel up to the concurrency limit", async () => {
  const clock = fakeClock();
  let active = 0, peak = 0;
  const many = Array.from({ length: 40 }, (_, i) => `archive/assets/images/n/q${i}.png`);
  const check = async () => { active += 1; peak = Math.max(peak, active); await new Promise(r => setTimeout(r, 2)); active -= 1; return { present: true }; };
  const result = await waitForImages({ files: many, urlFor, check, sleep: clock.sleep, now: clock.now, timeoutMs: 60000, intervalMs: 1000, concurrency: 8 });
  assert.equal(result.verdict, "pass");
  assert.ok(peak > 1 && peak <= 8, `peak concurrency ${peak}`);
});

// ---- the CLI end to end ----------------------------------------------------------------------------------------------------
function runCli(dir, args, env = {}) {
  return spawnSync(process.execPath, [gateScript, ...args], {
    cwd: dir, encoding: "utf8", timeout: 60000,
    env: { PATH: process.env.PATH, HOME: process.env.HOME || dir, GIT_CEILING_DIRECTORIES: path.dirname(dir), ...env }
  });
}

test("CLI: no image change passes at once and makes no request; missing images fail the step; present ones pass", async t => {
  const { dir, git, put } = tempRepo(t);
  put("archive/assets/images/old/q1.png", "old");
  put("archive/runtime.js", "a");
  git("add", "-A"); git("commit", "-q", "-m", "base");
  const base = git("rev-parse", "HEAD");
  put("archive/runtime.js", "b");
  git("add", "-A"); git("commit", "-q", "-m", "code only");
  const evidence = path.join(dir, "context.txt");

  // R2 base points at a closed port: a request would fail, so passing proves that none was made.
  const quiet = runCli(dir, ["--fallback-base", base, "--r2-base", "http://127.0.0.1:9", "--evidence-file", evidence]);
  assert.equal(quiet.status, 0, quiet.stdout + quiet.stderr);
  assert.match(quiet.stdout, /IMAGE_ORDER_NOT_NEEDED/);

  put("archive/assets/images/25_new/q1.png", "new");
  git("add", "-A"); git("commit", "-q", "-m", "new exam images");
  const failing = runCli(dir, ["--fallback-base", base, "--r2-base", "http://127.0.0.1:9", "--timeout-minutes", "0.002", "--interval-seconds", "0.02", "--evidence-file", evidence]);
  assert.equal(failing.status, 1, failing.stdout + failing.stderr);
  assert.match(failing.stdout, /IMAGE_ORDER_FAIL/);
  assert.match(failing.stdout, /::error title=Pages release waits for the R2 exam images::/);
  assert.match(failing.stdout, /archive\/assets\/images\/25_new\/q1\.png/);

  // A real HTTP server plays R2: the new image appears after the first request, as if the copy finished meanwhile.
  const seen = [];
  const server = createServer((request, response) => {
    seen.push(`${request.method} ${request.url}`);
    response.statusCode = seen.length >= 2 ? 200 : 404;
    response.end();
  });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const arrives = await new Promise(resolve => {
    const proc = spawn(process.execPath, [gateScript, "--fallback-base", base, "--r2-base", `http://127.0.0.1:${server.address().port}`, "--timeout-minutes", "0.5", "--interval-seconds", "0.05", "--evidence-file", evidence],
      { cwd: dir, env: { PATH: process.env.PATH, HOME: process.env.HOME || dir, GIT_CEILING_DIRECTORIES: path.dirname(dir) } });
    let out = "";
    proc.stdout.on("data", d => { out += d; });
    proc.on("close", code => resolve({ code, out }));
  });
  assert.equal(arrives.code, 0, arrives.out);
  assert.match(arrives.out, /IMAGE_ORDER_PASS/);
  assert.ok(seen.every(line => line.startsWith("HEAD /exams/images/25_new/q1.png")), seen.join("\n"));
  assert.ok(seen.length >= 2, "retried after the first 404");
  const text = fs.readFileSync(evidence, "utf8");
  assert.match(text, /image_order=IMAGE_ORDER_NOT_NEEDED/);
  assert.match(text, /image_order=IMAGE_ORDER_FAIL/);
  assert.match(text, /image_order=IMAGE_ORDER_PASS/);
});

test("CLI: an unknown release range verifies every image instead of skipping, and bad arguments are refused", t => {
  const { dir, git, put } = tempRepo(t);
  put("archive/assets/images/old/q1.png", "old");
  git("add", "-A"); git("commit", "-q", "-m", "base");
  const unknown = runCli(dir, ["--fallback-base", "f".repeat(40), "--r2-base", "http://127.0.0.1:9", "--timeout-minutes", "0.002", "--interval-seconds", "0.02"]);
  assert.equal(unknown.status, 1, "closed port: the one existing image cannot be confirmed");
  assert.match(unknown.stdout, /uncertain=true/);
  assert.match(unknown.stdout, /archive\/assets\/images\/old\/q1\.png/);
  assert.notEqual(runCli(dir, ["--nope"]).status, 0);
  assert.notEqual(runCli(dir, ["--timeout-minutes", "0"]).status, 0);
});

// ---- workflow wiring -------------------------------------------------------------------------------------------------------
test("Pages release: image_order is a required, bounded, non-skippable step between the verifications and the gate", () => {
  const build = pages.slice(pages.indexOf("\n  build:\n"), pages.indexOf("\n  deploy:\n"));
  const steps = build.split(/\n(?=      - )/).slice(1);
  const step = steps.find(s => /id: image_order/.test(s));
  assert.ok(step, "image_order step exists");
  assert.match(step, /continue-on-error: true/);
  const timeout = Number(/timeout-minutes: (\d+)/.exec(step)[1]);
  assert.ok(timeout > 0 && timeout <= 15);
  const waitMin = Number(/--timeout-minutes (\d+)/.exec(step)[1]);
  assert.ok(waitMin > 0 && waitMin < timeout, "wait is bounded below the step cap");
  assert.match(step, /node tools\/ci\/archive-pages-image-r2-gate\.mjs/);
  assert.match(step, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/, "the token reads the latest successful deployment");
  assert.match(step, /--fallback-base "\$\{\{ github\.event\.before \}\}"/);
  const required = (/--required (\S+)/.exec(pages) || [])[1].split(",");
  assert.ok(required.includes("image_order"), "image_order is a REQUIRED gate entry");
  assert.ok(!(/--skip-ok (\S+)/.exec(pages) || [])[1].split(",").includes("image_order"), "it may not be skipped");
  const index = id => steps.findIndex(s => new RegExp(`id: ${id}\\b`).test(s));
  assert.ok(index("image_order") > index("staged_site_chrome") && index("image_order") < index("release_gate"));
  assert.ok(index("image_order") > index("pages_build"), "runs after the package is built");
  assert.ok(index("release_gate") < steps.findIndex(s => /upload-pages-artifact@/.test(s)), "Pages artifact is uploaded only after the gate");
  assert.match(pages, /\n {4}needs: build\n/);
  assert.match(pages, /\n {2}deployments: read\n/);
  assert.ok(!/image_order/.test(read(".github/workflows/ci.yml")), "Git main merges never wait for R2");
});

test("the package, the R2 copy and the registered test list agree", () => {
  assert.match(read("tools/run-tests.js"), /tests\/archive-pages-image-r2-gate\.test\.mjs/);
  const copy = read(".github/workflows/r2-archive-assets-copy.yml");
  assert.match(copy, /paths:\n\s+- "archive\/assets\/images\/\*\*"/, "the copy starts on the same push that changes images");
  const manifest = JSON.parse(read("tools/archive-pages-release-manifest.json"));
  assert.deepEqual(manifest.trees.find(tree => tree.path === "archive/assets").exclude, ["images"]);
});
