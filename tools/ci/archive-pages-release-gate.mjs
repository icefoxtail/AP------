#!/usr/bin/env node
// Release gate for .github/workflows/archive-pages-release.yml.
//
// Verification steps in the build job keep `continue-on-error: true` so that every diagnostic still
// runs and lands in the evidence artifact. This gate runs after them, reads the real outcome of each
// required step (`steps.<id>.outcome`, which continue-on-error does not mask) and fails the build job
// when any required verification did not succeed. The deploy job `needs: build`, so a failed gate
// keeps the previously published (verified) student site live (AGENTS.md 2026-10-10; user decision
// 2026-10-29). Git main merges are independent of this gate (MAIN_FIRST / CI_DEFERRED).
//
//   STEPS_JSON='${{ toJSON(steps) }}' node tools/ci/archive-pages-release-gate.mjs \
//     --required id1,id2,... [--skip-ok id3,...] [--advisory id4,...] [--evidence-file <path>] [--summary-file <md>]
//
// --required : outcome must be `success`. A step missing from the context (never reached) fails.
// --skip-ok  : subset of required that may be `skipped` (steps with an `if:` that is legitimately false).
// --advisory : outcome is reported (warning annotation) but never fails the gate.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const splitList = value => String(value || "").split(",").map(s => s.trim()).filter(Boolean);

export function evaluateGate({ steps, required = [], skipOk = [], advisory = [] }) {
  const skipAllowed = new Set(skipOk);
  const failures = [], rows = [];
  for (const id of required) {
    const outcome = steps && steps[id] ? String(steps[id].outcome || "unknown") : "not_reached";
    const ok = outcome === "success" || (outcome === "skipped" && skipAllowed.has(id));
    rows.push({ id, kind: "required", outcome, ok });
    if (!ok) failures.push({ id, outcome });
  }
  for (const id of advisory) {
    const outcome = steps && steps[id] ? String(steps[id].outcome || "unknown") : "not_reached";
    rows.push({ id, kind: "advisory", outcome, ok: outcome === "success" || outcome === "skipped" });
  }
  return { pass: failures.length === 0, failures, rows };
}

function parseArgs(argv) {
  const opt = { required: [], skipOk: [], advisory: [], evidenceFile: "", summaryFile: "" };
  const names = { "--required": "required", "--skip-ok": "skipOk", "--advisory": "advisory", "--evidence-file": "evidenceFile", "--summary-file": "summaryFile" };
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = ["required", "skipOk", "advisory"].includes(key) ? splitList(argv[i + 1]) : argv[i + 1];
  }
  if (!opt.required.length) throw new Error("--required is mandatory (an empty gate would pass everything)");
  return opt;
}

function main() {
  const opt = parseArgs(process.argv.slice(2));
  let steps;
  try { steps = JSON.parse(process.env.STEPS_JSON || ""); }
  catch { console.error("::error title=Release gate::STEPS_JSON is missing or invalid; refusing to release unverified output"); process.exit(1); }
  const result = evaluateGate({ steps, required: opt.required, skipOk: opt.skipOk, advisory: opt.advisory });
  const lines = result.rows.map(r => `${r.ok ? "PASS" : "FAIL"} ${r.kind} ${r.id}: ${r.outcome}`);
  const verdict = result.pass ? "RELEASE_GATE_PASS" : "RELEASE_GATE_FAIL";
  lines.push(`${verdict}: ${result.failures.length} required verification(s) not successful`);
  console.log(lines.join("\n"));
  if (opt.evidenceFile) fs.appendFileSync(opt.evidenceFile, `release_gate=${verdict}\n${lines.map(l => `# ${l}`).join("\n")}\n`);
  for (const r of result.rows) {
    if (r.kind === "advisory" && !r.ok) console.log(`::warning title=Advisory verification ${r.id}::outcome=${r.outcome}`);
  }
  for (const f of result.failures) console.log(`::error title=Release gate blocked deploy::required step ${f.id} outcome=${f.outcome}; the previously published student site stays live`);
  if (opt.summaryFile) {
    const md = [`### Pages release gate: ${verdict}`, "", "| step id | kind | outcome |", "| --- | --- | --- |", ...result.rows.map(r => `| ${r.id} | ${r.kind} | ${r.outcome} |`), ""].join("\n");
    fs.appendFileSync(opt.summaryFile, md + "\n");
  }
  process.exit(result.pass ? 0 : 1);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
