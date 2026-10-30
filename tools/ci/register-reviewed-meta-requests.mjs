#!/usr/bin/env node
// Per-request isolation for the reviewed-meta registration pass.
//
//   node tools/ci/register-reviewed-meta-requests.mjs --applied-file <f> --rejected-file <f> \
//     [--root <repo>] [--registrar <script>] [--rejected-dir <dir>] [--guard-paths-file <f>] \
//     [--summary-file <md>] -- <request.json>...
//
// Every request is registered by its own registrar invocation. A request that the registrar
// refuses (stale `before`, drifted evidence, ...) is fail-closed for THAT request only: the
// registrar validates before it writes, so the working tree is untouched, and this script
// proves that with a before/after status fingerprint of the registration paths. The refused
// request is moved from the inbox to the rejected dir together with a deterministic
// `<name>.rejection.json` record, so it is tracked, visible, and no longer blocks (or re-runs
// with) the remaining requests. The other requests are applied normally, in sorted order.
//
//   node tools/ci/register-reviewed-meta-requests.mjs --reject <request.json> --error <text> [--stage <name>]
//     records an already-applied request as rejected (used when a later shared check, e.g. the consumer
//     projection verification, refuses it) and needs the caller to reset the tree with:
//   node tools/ci/register-reviewed-meta-requests.mjs --reset-derived
//     restores every registration path except the inbox/rejected dirs to HEAD (git checkout + clean).
//
// Exit codes: 0 = pass finished (rejections are reported, not fatal); 1 = usage error;
// 2 = a refused request left the working tree changed (isolation cannot be proven) - fatal.
// Nothing is committed or pushed here. Run it from the repository root (or pass --root).
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const REJECTION_SCHEMA = "archive-reviewed-meta-register-rejection-v1";
const DEFAULT_REGISTRAR = "archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs";
const DEFAULT_REJECTED_DIR = ".archive-meta-register/rejected";
const DEFAULT_GUARD_PATHS = "tools/ci/archive-meta-register-commit.paths";

function parseArgs(argv) {
  const opt = { root: process.cwd(), registrar: DEFAULT_REGISTRAR, rejectedDir: DEFAULT_REJECTED_DIR, guardPathsFile: DEFAULT_GUARD_PATHS,
    appliedFile: "", rejectedFile: "", summaryFile: "", reject: "", error: "", stage: "registrar", resetDerived: false, requests: [] };
  const names = { "--root": "root", "--registrar": "registrar", "--rejected-dir": "rejectedDir", "--guard-paths-file": "guardPathsFile",
    "--applied-file": "appliedFile", "--rejected-file": "rejectedFile", "--summary-file": "summaryFile",
    "--reject": "reject", "--error": "error", "--stage": "stage" };
  let i = 0;
  for (; i < argv.length && argv[i] !== "--"; i += 2) {
    if (argv[i] === "--reset-derived") { opt.resetDerived = true; i -= 1; continue; }
    const key = names[argv[i]];
    if (!key || argv[i + 1] === undefined) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = argv[i + 1];
  }
  opt.requests = argv.slice(i + 1);
  opt.root = path.resolve(opt.root);
  return opt;
}

const posix = p => p.split(path.sep).join("/");
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const jsonText = value => JSON.stringify(value, null, 2) + "\n";

// The registrar reports failures as `Error: <message>` after a stack excerpt; keep that one line.
export function summarizeFailure(stderr, stdout = "") {
  const lines = `${stderr}\n${stdout}`.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const hit = [...lines].reverse().find(l => /^(?:[A-Za-z]*Error|Uncaught [A-Za-z]*Error):\s/.test(l));
  return (hit || lines[lines.length - 1] || "registrar exited without a message").slice(0, 600);
}

// Registration paths minus the inbox/rejected dirs (those are moved by this script itself; every other
// registration path must stay untouched by a refused request and is what --reset-derived restores).
function derivedGuardPaths(opt) {
  const root = opt.root, rejectedDirAbs = path.resolve(root, opt.rejectedDir);
  const guardSpecs = fs.existsSync(path.resolve(root, opt.guardPathsFile))
    ? fs.readFileSync(path.resolve(root, opt.guardPathsFile), "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")) : [];
  const skip = [".archive-meta-register/inbox", posix(path.relative(root, rejectedDirAbs))];
  return guardSpecs.filter(s => !skip.some(k => s.replace(/\/+$/, "") === k));
}

export function resetDerived(opt) {
  const git = args => spawnSync("git", args, { cwd: opt.root, encoding: "utf8", maxBuffer: 1 << 28 });
  for (const spec of derivedGuardPaths(opt)) {
    const co = git(["checkout", "--", spec]);
    // A spec with nothing tracked (e.g. a directory that only exists after a registration) is not an error.
    if (co.status !== 0 && !/did not match any file/.test(co.stderr)) throw new Error(`reset failed for ${spec}: ${co.stderr.trim()}`);
    const clean = git(["clean", "-fdq", "--", spec]);
    if (clean.status !== 0) throw new Error(`clean failed for ${spec}: ${clean.stderr.trim()}`);
  }
}

// Moves a request out of the inbox into the rejected dir and writes its deterministic rejection record.
export function recordRejection(opt, requestAbs, { error, exitCode = null, stage = "registrar" }, { log = console.log } = {}) {
  const rejectedDirAbs = path.resolve(opt.root, opt.rejectedDir), name = path.basename(requestAbs);
  const rel = posix(path.relative(opt.root, requestAbs));
  const bytes = fs.readFileSync(requestAbs);
  fs.mkdirSync(rejectedDirAbs, { recursive: true });
  fs.writeFileSync(path.join(rejectedDirAbs, name), bytes);
  fs.rmSync(requestAbs, { force: true });
  fs.writeFileSync(path.join(rejectedDirAbs, name.replace(/\.json$/, ".rejection.json")), jsonText({
    schemaVersion: REJECTION_SCHEMA, request: name, requestSha256: sha256(bytes), stage, error, registrarExitCode: exitCode,
    next: "Registration was refused for this request only (fail-closed, nothing was applied). The meta owner must regenerate the request against the current metadata and submit it again as a new .archive-meta-register/inbox/*.json (git mv it back once the cause is fixed)."
  }));
  log(`[register] REJECTED (${stage}) ${rel}: ${error}`);
  // Workflow annotation: visible on the run page even though the run itself stays green (see archive-pages-release.yml).
  if (process.env.GITHUB_ACTIONS) console.log(`::error title=Reviewed meta request rejected (${stage})::${name}: ${error.replace(/[\r\n%]/g, " ")}`);
}

export function registerRequests(opt, { log = console.log } = {}) {
  const root = opt.root;
  const rejectedDirAbs = path.resolve(root, opt.rejectedDir);
  const registrar = path.resolve(root, opt.registrar);
  const guard = derivedGuardPaths(opt);
  const fingerprint = () => {
    if (!guard.length) return "NO_GUARD";
    const r = spawnSync("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all", "--", ...guard], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
    if (r.status !== 0) return "GIT_STATUS_FAILED";
    const h = crypto.createHash("sha1");
    for (const entry of r.stdout.split("\0").filter(Boolean)) {
      h.update(entry);
      const st = fs.statSync(path.join(root, entry.slice(3)), { throwIfNoEntry: false });
      h.update(st ? `|${st.size}|${st.mtimeMs}` : "|gone");
    }
    return h.digest("hex");
  };

  const applied = [], rejected = [];
  let dirtied = null;
  for (const requestArg of opt.requests) {
    const requestAbs = path.resolve(root, requestArg), rel = posix(path.relative(root, requestAbs)), name = path.basename(requestAbs);
    if (!fs.existsSync(requestAbs)) { rejected.push({ request: rel, name, error: "request file not found", exitCode: null }); continue; }
    const before = fingerprint();
    const run = spawnSync(process.execPath, [registrar, "--request", rel, "--write"], { cwd: root, encoding: "utf8", maxBuffer: 1 << 28 });
    if (run.status === 0) {
      applied.push({ request: rel, name });
      // A fixed re-submission supersedes any earlier rejection record of the same file name.
      for (const stale of [name, name.replace(/\.json$/, ".rejection.json")]) fs.rmSync(path.join(rejectedDirAbs, stale), { force: true });
      log(`[register] APPLIED ${rel}`);
      continue;
    }
    const error = summarizeFailure(run.stderr || "", run.stdout || "");
    if (fingerprint() !== before) { dirtied = { request: rel, error }; rejected.push({ request: rel, name, error, exitCode: run.status, treeChanged: true }); break; }
    recordRejection(opt, requestAbs, { error, exitCode: run.status }, { log });
    rejected.push({ request: rel, name, error, exitCode: run.status });
  }
  return { applied, rejected, dirtied };
}

export function renderSummary(result, { total }) {
  const lines = ["### Reviewed meta registration (per-request isolation)", "",
    `- requests: ${total}, applied: **${result.applied.length}**, rejected: **${result.rejected.length}**${result.dirtied ? " (ISOLATION BROKEN, run aborted)" : ""}`];
  for (const a of result.applied) lines.push(`- APPLIED \`${a.name}\``);
  if (result.rejected.length) {
    lines.push("", "Rejected requests are fail-closed (nothing from them was applied) and were moved to `.archive-meta-register/rejected/` with a `*.rejection.json` record; the meta owner must resubmit them.", "",
      "| request | error |", "| --- | --- |");
    for (const r of result.rejected) lines.push(`| \`${r.name}\` | ${r.error.replace(/\|/g, "\\|")} |`);
  }
  return lines.join("\n") + "\n";
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let opt;
  try { opt = parseArgs(process.argv.slice(2)); } catch (error) { console.error(`usage error: ${error.message}`); process.exit(1); }
  if (opt.resetDerived) { resetDerived(opt); console.log("[register] derived registration paths restored to HEAD"); process.exit(0); }
  if (opt.reject) {
    if (!opt.error) { console.error("usage error: --reject needs --error"); process.exit(1); }
    recordRejection(opt, path.resolve(opt.root, opt.reject), { error: opt.error.slice(0, 600), stage: opt.stage });
    if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, `\n- REJECTED (${opt.stage}) \`${path.basename(opt.reject)}\`: ${opt.error.replace(/\|/g, "\\|").slice(0, 600)}\n`);
    process.exit(0);
  }
  if (!opt.appliedFile || !opt.rejectedFile) { console.error("usage error: --applied-file and --rejected-file are required"); process.exit(1); }
  const result = registerRequests(opt);
  const list = items => items.map(i => i.request).join("\n") + (items.length ? "\n" : "");
  fs.writeFileSync(opt.appliedFile, list(result.applied));
  fs.writeFileSync(opt.rejectedFile, list(result.rejected));
  const summary = renderSummary(result, { total: opt.requests.length });
  console.log(summary);
  if (opt.summaryFile) fs.appendFileSync(opt.summaryFile, "\n" + summary);
  if (result.dirtied) {
    console.error(`FATAL: a refused request changed the working tree, so per-request isolation cannot be proven: ${result.dirtied.request}: ${result.dirtied.error}`);
    process.exit(2);
  }
}
