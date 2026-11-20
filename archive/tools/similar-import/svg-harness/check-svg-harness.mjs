// SVG harness checker for one similar exam: design -> plan -> engine render -> look -> publish draft.
// usage: node archive/tools/similar-import/svg-harness/check-svg-harness.mjs <exam harness.json> [--stage plan] [--repo <root>] [--no-lint]
// --stage plan: plan-only pass (status PLANNED = design + item.json + plan.json + plan-lint OK; no render yet, no SVG allowed).
//
// What it enforces (the worker cannot hand-make or loosely make a figure):
//  1. DESIGN before plan: kind, basedOn (an existing plan in the repo), solutionUses (exact quote of the item's
//     solution, 6+ chars) and mustShow (values/labels the figure must carry; each one must occur in the item text).
//  2. PLAN: plan.json passes plan-lint (engine's own validators), is not a byte copy of the plan it was based on,
//     and contains every mustShow value. A problem figure must not contain the stored answer (when it is not in the stem).
//  3. ENGINE RENDER of exactly this plan: out/attempts.jsonl has a final ARCHIVE_BOUND line whose planSha256 is the
//     sha256 of the current plan.json bytes, and out/<name>-result.json says ARCHIVE_BOUND. Any .svg anywhere in the
//     exam work folder that is not such an engine output fails the check (no hand-written or script-built SVG).
//  4. LOOK: a PNG made from that SVG, newer than it, and a written observation that names a mustShow value.
//  5. PUBLISH draft: publish.json alt/caption with the item's own numbers, size == render sizeClass, no input notation.
// Status values: TODO | DONE | NOT_NEEDED (CHECK only, with a quote) | UNSUPPORTED (named engine gap) | CONTENT (recomputed answer).
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";

const args = process.argv.slice(2);
const file = args[0];
const repo = path.resolve(args.includes("--repo") ? args[args.indexOf("--repo") + 1] : process.cwd());
const lint = !args.includes("--no-lint");
const planStage = args.includes("--stage") && args[args.indexOf("--stage") + 1] === "plan";
if (!file) { console.error("usage: node check-svg-harness.mjs <exam harness.json> [--repo <root>] [--no-lint]"); process.exit(2); }
const H = JSON.parse(fs.readFileSync(file, "utf8"));
const workDir = path.dirname(path.resolve(file));
const abs = p => (p && path.isAbsolute(p) ? p : path.join(repo, p || ""));
const isFile = p => !!p && fs.existsSync(abs(p)) && fs.statSync(abs(p)).isFile();
const rel = p => path.relative(repo, p).split(path.sep).join("/");
const errs = [];
const err = (qid, side, code, msg) => errs.push(`q${qid} ${side} ${code}: ${msg}`);
const sha = b => crypto.createHash("sha256").update(b).digest("hex");

let bank = [];
try {
  const ctx = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.runInNewContext(fs.readFileSync(abs(H.stagePath), "utf8"), ctx, { timeout: 10000 });
  bank = ctx.window.questionBank || ctx.window.questions || ctx.questions || [];
} catch (e) { errs.push(`STAGE_UNREADABLE ${H.stagePath}: ${e.message}`); }
const str = x => (x === undefined || x === null ? "" : String(x));
const stemOf = q => [q?.content, q?.question, q?.stem, ...(Array.isArray(q?.choices) ? q.choices : [])].map(str).join(" ");
const allOf = q => stemOf(q) + " " + str(q?.solution) + " " + str(q?.answer);
const norm = s => str(s).replace(/\s+/g, "");
const numbers = q => [...new Set(allOf(q).match(/\d+(?:\.\d+)?/g) || [])];

const engineSvgs = new Set();
const seenCaptions = new Map();
for (const it of H.items) {
  const q = bank[it.ordinal - 1];
  for (const side of ["problem", "solution"]) {
    const s = it[side];
    if (s.need === "NO") continue;
    const st = s.status, note = str(s.note);
    const finals_ = planStage ? ["PLANNED", "NOT_NEEDED", "CONTENT"] : ["DONE", "NOT_NEEDED", "UNSUPPORTED", "CONTENT"];
    if (!finals_.includes(st)) { err(it.qid, side, "STATUS", `need=${s.need} but status=${st} (allowed: ${finals_.join("/")})`); continue; }
    if (st === "NOT_NEEDED") {
      if (s.need === "YES") { err(it.qid, side, "NOT_NEEDED_ON_YES", "need=YES (original or stage has this figure): draw it, or UNSUPPORTED/CONTENT"); continue; }
      const quote = (note.match(/「([^」]{4,})」/) || [])[1];
      if (!quote || !norm(allOf(q)).includes(norm(quote))) err(it.qid, side, "NOT_NEEDED_EVIDENCE", "quote the item in 「...」 (4+ chars, exact) showing it is solvable without this figure");
      continue;
    }
    if (st === "UNSUPPORTED") { if (note.length < 20 || !s.planPath) err(it.qid, side, "UNSUPPORTED_NOTE", "keep the attempted planPath and name the missing engine feature (20+ chars)"); continue; }
    if (st === "CONTENT") { if (!/정답/.test(note) || note.length < 20) err(it.qid, side, "CONTENT_NOTE", "write the recomputed 정답 and why the item/answer/solution disagree"); continue; }

    // 1. DESIGN
    const d = s.design || {};
    if (!str(d.kind)) err(it.qid, side, "DESIGN_KIND", "design.kind empty (plane/graph/stat/solid/number-line/...)");
    if (!isFile(d.basedOn)) err(it.qid, side, "DESIGN_BASED_ON", `design.basedOn must be an existing plan in the repo (reusePlan, ops/golden/*/plan.json or a passed plan): ${str(d.basedOn)}`);
    if (side === "solution" && (str(d.solutionUses).length < 6 || !norm(q?.solution).includes(norm(d.solutionUses)))) err(it.qid, side, "DESIGN_SOLUTION_QUOTE", "design.solutionUses must be an exact quote (6+ chars) of this item's solution: the step the figure shows");
    const must = Array.isArray(d.mustShow) ? d.mustShow.map(str).filter(Boolean) : [];
    if (must.length < 2) err(it.qid, side, "DESIGN_MUST_SHOW", "design.mustShow needs 2+ values/labels the figure must carry");
    for (const m of must) if (!norm(allOf(q)).includes(norm(m))) err(it.qid, side, "MUST_SHOW_NOT_IN_ITEM", `"${m}" does not occur in this item's stem/choices/solution`);

    // 2. PLAN
    if (!isFile(s.planPath)) { err(it.qid, side, "PLAN_MISSING", str(s.planPath)); continue; }
    const planBytes = fs.readFileSync(abs(s.planPath)), plan = planBytes.toString("utf8");
    if (!abs(s.planPath).startsWith(workDir)) err(it.qid, side, "PLAN_OUTSIDE_WORKDIR", `keep the plan under ${rel(workDir)}`);
    if (isFile(d.basedOn) && fs.readFileSync(abs(d.basedOn), "utf8") === plan) err(it.qid, side, "PLAN_UNCHANGED_COPY", "plan is a byte copy of design.basedOn: set this item's values");
    for (const m of must) if (!norm(plan).includes(norm(m))) err(it.qid, side, "PLAN_MISSING_MUST_SHOW", `plan.json does not contain "${m}"`);
    const ans = str(q?.answer).trim();
    if (side === "problem" && ans.length >= 2 && !norm(stemOf(q)).includes(norm(ans)) && norm(plan).includes(norm(ans))) err(it.qid, side, "PROBLEM_SHOWS_ANSWER", `problem figure plan contains the answer "${ans}"`);
    if (lint) {
      const linter = path.join(repo, "archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs");
      if (!fs.existsSync(linter)) err(it.qid, side, "LINT_TOOL_MISSING", "merge origin/main first (plan-lint.cjs)");
      else { try { execFileSync("node", [linter, "--shallow", "--quiet", abs(s.planPath)], { cwd: repo, stdio: "pipe" }); } catch (e) { err(it.qid, side, "PLAN_LINT", str(e.stdout).trim().split("\n").slice(-2).join(" | ")); } }
    }

    const itemFile = path.join(path.dirname(abs(s.planPath)), "item.json");
    if (!fs.existsSync(itemFile)) err(it.qid, side, "ITEM_MISSING", "item.json next to plan.json: {\"sourcePath\": stagePath, \"ordinal\": n}");
    else { const im = JSON.parse(fs.readFileSync(itemFile, "utf8")); if (im.sourcePath !== H.stagePath || Number(im.ordinal) !== it.ordinal) err(it.qid, side, "ITEM_MISMATCH", `item.json must be {sourcePath: ${H.stagePath}, ordinal: ${it.ordinal}}`); }
    if (st === "PLANNED") continue;

    // 3. ENGINE RENDER of this exact plan
    const outDir = path.join(path.dirname(abs(s.planPath)), "out");
    const logFile = path.join(outDir, "attempts.jsonl");
    const finals = fs.existsSync(logFile) ? fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return {}; } }).filter(r => r.kind === "final") : [];
    const ok = finals.filter(r => r.status === "ARCHIVE_BOUND" && r.planSha256 === sha(planBytes));
    if (!ok.length) { err(it.qid, side, "NOT_RENDERED_FROM_THIS_PLAN", `no ARCHIVE_BOUND engine render of the current plan.json in ${rel(logFile)} (renders logged: ${finals.length}). Re-render after every plan edit.`); continue; }
    const name = ok[ok.length - 1].item;
    const resFile = path.join(outDir, `${name}-result.json`), svgFile = path.join(outDir, `${name}-solution.svg`);
    const res = fs.existsSync(resFile) ? JSON.parse(fs.readFileSync(resFile, "utf8")) : {};
    if (res.status !== "ARCHIVE_BOUND") { err(it.qid, side, "RESULT_NOT_BOUND", `${rel(resFile)} status=${res.status}`); continue; }
    if (!fs.existsSync(svgFile)) { err(it.qid, side, "SVG_MISSING", rel(svgFile)); continue; }
    engineSvgs.add(path.resolve(svgFile));
    const svg = fs.readFileSync(svgFile, "utf8"), root = (svg.match(/<svg\b[^>]*>/) || [""])[0];
    if (!/role="img"/.test(root)) err(it.qid, side, "SVG_ROLE", "root <svg> lacks role=\"img\"");
    const title = (svg.match(/<title[^>]*>([^<]*)<\/title>/) || [null, ""])[1];
    if (!title || /�|\?\?/.test(title)) err(it.qid, side, "SVG_TITLE", `missing or broken <title>: ${title}`);

    // 4. LOOK
    if (!isFile(s.pngPath)) err(it.qid, side, "PNG_MISSING", "node .tmp/svg-m1/svg2png.cjs <svg> <png> 600, then open and look at it");
    else if (fs.statSync(abs(s.pngPath)).mtimeMs < fs.statSync(svgFile).mtimeMs) err(it.qid, side, "PNG_STALE", "PNG is older than the SVG: make it again from the final render");
    const obs = str(s.pngObservation);
    if (obs.length < 30 || !must.some(m => norm(obs).includes(norm(m)))) err(it.qid, side, "PNG_OBSERVATION", "write what you saw in the PNG (30+ chars) naming at least one mustShow value and where it sits");

    // 5. PUBLISH draft
    const pubFile = path.join(path.dirname(abs(s.planPath)), "publish.json");
    if (!fs.existsSync(pubFile)) { err(it.qid, side, "PUBLISH_MISSING", rel(pubFile)); continue; }
    const pub = JSON.parse(fs.readFileSync(pubFile, "utf8"));
    if (str(pub.alt).length < 10) err(it.qid, side, "ALT", "alt must describe the figure (10+ chars)");
    if (side === "solution" && str(pub.caption).length < 10) err(it.qid, side, "CAPTION", "caption: solution summary ending with the answer (10+ chars)");
    if (pub.size !== res.sizeClass) err(it.qid, side, "SIZE", `publish.size ${pub.size} != render sizeClass ${res.sizeClass}`);
    const nums = numbers(q);
    if (nums.length && !nums.some(t => (str(pub.caption) + str(pub.alt)).includes(t))) err(it.qid, side, "CAPTION_NO_ITEM_NUMBER", `alt/caption must use this item's numbers (e.g. ${nums.slice(0, 5).join(", ")})`);
    const key = str(pub.caption) + "|" + str(pub.alt);
    if (seenCaptions.has(key)) err(it.qid, side, "CAPTION_DUPLICATE", `same alt/caption as ${seenCaptions.get(key)}`); else seenCaptions.set(key, `q${it.qid} ${side}`);
    if (/\^|sqrt\(|\*|f\^-1/.test(str(pub.caption) + str(pub.alt))) err(it.qid, side, "INPUT_NOTATION", "alt/caption uses input notation (^, sqrt(, *, f^-1)");
  }
}
// No SVG in the work folder may come from anywhere but an engine render checked above.
const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
for (const f of walk(workDir).filter(f => f.toLowerCase().endsWith(".svg"))) if (!engineSvgs.has(path.resolve(f))) errs.push(`STRAY_SVG ${rel(f)}: not the engine output of a checked plan (delete it; hand-made or script-built SVG is not allowed)`);

const done = H.items.reduce((n, it) => n + ["problem", "solution"].filter(s => it[s].status === "DONE").length, 0);
if (errs.length) { console.log(`FAIL ${H.exam}: ${errs.length} problem(s), DONE ${done}`); for (const e of errs) console.log("  " + e); process.exit(1); }
console.log(`PASS ${H.exam}: DONE ${done}`);
