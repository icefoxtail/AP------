#!/usr/bin/env node
// Answers "did the triggering push touch any of these paths?" from the push event itself
// ($GITHUB_EVENT_PATH commits[].added/modified/removed), never from HEAD^ of a moving
// `ref: main` checkout. Prints `true` or `false`.
//
//   node tools/ci/push-touches-paths.mjs --paths-file <file> [--literal-only] \
//        [--uncertain true|false] [--non-push true|false]
//
// --literal-only : ignore entries containing '*' (request globs); keep exact file paths.
// --uncertain    : result when the event cannot prove the answer (commit list possibly truncated at
//                  20+, empty, or unreadable and the `git diff before after` fallback is unavailable).
// --non-push     : result for events that are not pushes (workflow_run, workflow_dispatch). Default false.
// Safe defaults differ per caller: a writer asks with --uncertain true (extra no-op work), a
// release gate asks with --uncertain false (never wait for a workflow that may not have started).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const NFC = s => String(s).normalize("NFC");
// GitHub `paths:` semantics for the entries used here: '*' never crosses '/'.
export function globToRegExp(glob) {
  return new RegExp("^" + NFC(glob).split("*").map(part => part.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*") + "$");
}

export function loadPatterns(file, { literalOnly = false } = {}) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#"))
    .filter(l => !literalOnly || !l.includes("*")).map(globToRegExp);
}

export function pushTouchesPaths({ event, eventName, patterns, uncertain = false, nonPush = false, gitDiff = defaultGitDiff }) {
  if (eventName !== "push") return nonPush;
  const commits = Array.isArray(event?.commits) ? event.commits : [];
  const files = commits.flatMap(c => [...(c.added || []), ...(c.modified || []), ...(c.removed || [])]).map(NFC);
  if (files.some(f => patterns.some(re => re.test(f)))) return true;
  // The commit list is capped (20) and empty for e.g. new-branch pushes: absence of a match proves nothing then.
  if (commits.length > 0 && commits.length < 20 && !event.forced) return false;
  const diff = event?.before && event?.after ? gitDiff(event.before, event.after) : null;
  if (!diff) return uncertain;
  return diff.map(NFC).some(f => patterns.some(re => re.test(f)));
}

function defaultGitDiff(before, after) {
  try {
    return execFileSync("git", ["-c", "core.quotepath=off", "diff", "--name-only", before, after], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).split("\n").filter(Boolean);
  } catch { return null; }
}

function main() {
  const args = process.argv.slice(2), opt = { literalOnly: false, uncertain: false, nonPush: false, pathsFile: "" };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--literal-only") opt.literalOnly = true;
    else if (args[i] === "--paths-file") opt.pathsFile = args[++i];
    else if (args[i] === "--uncertain") opt.uncertain = args[++i] === "true";
    else if (args[i] === "--non-push") opt.nonPush = args[++i] === "true";
    else { console.error(`unknown argument: ${args[i]}`); process.exit(2); }
  }
  if (!opt.pathsFile) { console.error("--paths-file is required"); process.exit(2); }
  const eventName = process.env.GITHUB_EVENT_NAME || "";
  let event = null;
  try { event = JSON.parse(fs.readFileSync(process.env.GITHUB_EVENT_PATH, "utf8")); } catch { /* handled as uncertain for pushes */ }
  const result = eventName === "push" && !event ? opt.uncertain
    : pushTouchesPaths({ event, eventName, patterns: loadPatterns(opt.pathsFile, opt), uncertain: opt.uncertain, nonPush: opt.nonPush });
  console.log(result ? "true" : "false");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
