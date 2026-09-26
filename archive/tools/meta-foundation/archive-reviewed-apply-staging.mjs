#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import {
  assertBaseAndFinalQuestionFiles, normalizeSourceFile, parseArgs,
  readJson, readPacket, repoRootFrom, sha256
} from "./reviewed-apply-core.mjs";

const arg = parseArgs(process.argv.slice(2));
const command = arg.values.get("command");
const root = repoRootFrom(import.meta.url, arg.values.get("repo-root"));
const run = (args, options = {}) => execFileSync("git", ["-C", root, ...args], {
  encoding: options.encoding ?? "utf8",
  maxBuffer: options.maxBuffer ?? 64 * 1024 * 1024,
  stdio: ["ignore", "pipe", "pipe"]
});
const runText = (args) => String(run(args)).trim();
const gitShow = (commit, repoPath) => run(["show", `${commit}:${repoPath}`], { encoding: null });
const requirePacket = () => {
  const packetPath = arg.values.get("packet");
  if (!packetPath) throw new Error("--packet is required");
  const absolute = path.isAbsolute(packetPath) ? packetPath : path.join(root, packetPath);
  return { packetPath, packetRelative: arg.values.get("staging-packet-path") || asRelative(absolute), ...readPacket(absolute) };
};
const asRelative = (absolute) => path.relative(root, absolute).replace(/\\/g, "/");
const assertRegularFile = (file, label) => {
  const stat = fs.lstatSync(path.join(root, ...file.split("/")));
  if (!stat.isFile() || stat.isSymbolicLink()) throw new Error(`${label} must be a regular file: ${file}`);
};
const isGeneratedPath = (file) => [
  "archive/db.js",
  "archive/data/question_identity_map.json",
  "archive/data/question_metadata.json",
  "archive/question-identity.js",
  "archive/question-index.js",
  "archive/question-index-report.md",
  "archive/question-index-audit.md",
  "archive/data/archive2-catalog.json",
  "archive/data/archive2-crosswalk-inventory.json"
].includes(file) || /^archive\/data\/meta-foundation\/runtime\/[^/]+\.json$/.test(file) ||
  /^archive\/data\/meta-foundation\/evidence\/review-overrides\/v1\/qid_v1_[0-9a-f]{64}\.json$/.test(file);

function inspect() {
  const { packet } = requirePacket();
  console.log(JSON.stringify({ applyId: packet.applyId, targetRef: packet.targetRef, targetBaseSha: packet.targetBaseSha }, null, 2));
}

function changedNameStatuses(baseSha, head = null) {
  const output = run(["diff", "--name-status", "-z", "--no-renames", baseSha, ...(head ? [head] : []), "--"], { encoding: null });
  const values = output.toString("utf8").split("\0").filter(Boolean);
  const rows = [];
  for (let i = 0; i < values.length; i += 2) rows.push({ status: values[i], path: values[i + 1] });
  return rows;
}


function treeEntryAt(commit, repoPath) {
  const output = run(["ls-tree", "-z", commit, "--", repoPath], { encoding: null }).toString("utf8").split("\0").find(Boolean);
  return output || null;
}

function assertReviewBaseCompatible({ packet, info, targetSha }) {
  if (!/^[0-9a-f]{40}$/.test(targetSha || "")) throw new Error("APPLY_BASE_STALE: current target SHA must be a full SHA-1");
  try {
    run(["merge-base", "--is-ancestor", packet.targetBaseSha, targetSha]);
  } catch {
    throw new Error("APPLY_CONFLICT_HOLD: R2 review base is not an ancestor of the current target");
  }
  const repoPath = `archive/exams/${info.sourcePath}`;
  let targetSourceBytes;
  try {
    targetSourceBytes = gitShow(targetSha, repoPath);
  } catch {
    throw new Error(`APPLY_CONFLICT_HOLD: source exam is missing at current target: ${repoPath}`);
  }
  if (sha256(targetSourceBytes) !== packet.sourceBlobSha) {
    throw new Error(`APPLY_CONFLICT_HOLD: source exam drifted since R2 closure: ${repoPath}`);
  }
  for (const file of packet.finalFiles.filter((row) => row.kind === "solution_svg")) {
    const reviewEntry = treeEntryAt(packet.targetBaseSha, file.path);
    const currentEntry = treeEntryAt(targetSha, file.path);
    if (reviewEntry !== currentEntry) {
      throw new Error(`APPLY_CONFLICT_HOLD: reviewed SVG path drifted since R2 closure: ${file.path}`);
    }
  }
}

function preflight() {
  const { packet, info, absolute } = requirePacket();
  const targetSha = arg.values.get("target-sha");
  if (!targetSha || !/^[0-9a-f]{40}$/.test(targetSha)) throw new Error("APPLY_BASE_STALE: --target-sha must be the current target SHA");
  const branch = runText(["branch", "--show-current"]);
  if (branch !== `archive-apply/${packet.applyId}`) throw new Error(`staging branch must be archive-apply/${packet.applyId}`);
  const expectedPacket = `.archive-apply/inbox/${packet.applyId}.json`;
  if (asRelative(absolute) !== expectedPacket) throw new Error(`packet must be exactly ${expectedPacket}`);
  if (runText(["status", "--porcelain", "--untracked-files=all"])) throw new Error("staging checkout must be clean before APPLY");

  const count = Number(runText(["rev-list", "--count", `${targetSha}..HEAD`]));
  if (count !== 1) throw new Error(`APPLY_BASE_STALE: staging branch must have exactly one initial commit above current target; got ${count}`);
  const mergeBase = runText(["merge-base", targetSha, "HEAD"]);
  if (mergeBase !== targetSha) throw new Error("APPLY_BASE_STALE: staging branch is not based directly on the current target");
  assertReviewBaseCompatible({ packet, info, targetSha });

  const changes = changedNameStatuses(targetSha, "HEAD");
  const actual = new Set();
  const expected = new Set([...info.finalFilePaths, expectedPacket]);
  for (const row of changes) {
    if (!new Set(["A", "M"]).has(row.status)) throw new Error(`staging protocol forbids ${row.status} ${row.path}`);
    if (!expected.has(row.path)) throw new Error(`staging protocol contains non-allowlisted file: ${row.path}`);
    actual.add(row.path);
  }
  if (!actual.has(expectedPacket) || [...actual].some((file) => !expected.has(file))) {
    throw new Error(`staging diff must contain only finalFiles plus its one APPLY_PACKET; expected=${JSON.stringify([...expected].sort())}; actual=${JSON.stringify([...actual].sort())}; rows=${JSON.stringify(changes)}`);
  }
  for (const file of packet.finalFiles.filter((row) => row.kind === "solution_svg")) {
    if (!actual.has(file.path)) throw new Error(`solution_svg must be an actual staging change: ${file.path}`);
  }
  for (const file of [...info.finalFilePaths, expectedPacket]) {
    assertRegularFile(file, "staging payload");
    const entry = run(["ls-tree", "-z", "HEAD", "--", file], { encoding: null }).toString("utf8").split("\0").find(Boolean);
    const header = entry?.split("\t", 1)[0] || "";
    if (!header.startsWith("100644 blob ")) throw new Error(`staging payload must be a regular Git blob with mode 100644: ${file}`);
  }
  const identity = readJson(path.join(root, "archive/data/question_identity_map.json"));
  assertBaseAndFinalQuestionFiles({ root, packet, packetInfo: info, identity, gitShow });
  console.log(JSON.stringify({
    status: "PASS",
    applyId: packet.applyId,
    targetRef: packet.targetRef,
    reviewBaseSha: packet.targetBaseSha,
    dispatchBaseSha: targetSha,
    stagingCommit: runText(["rev-parse", "HEAD"]),
    stagedFinalFiles: info.finalFilePaths.size,
    packetPath: expectedPacket
  }, null, 2));
}

function snapshot() {
  const baseSha = arg.values.get("base-sha");
  if (!baseSha || !/^[0-9a-f]{40}$/.test(baseSha)) throw new Error("snapshot requires --base-sha <full SHA-1>");
  const trackedDiff = run(["diff", "--binary", baseSha, "--"], { encoding: null });
  const others = run(["ls-files", "--others", "--exclude-standard", "-z"], { encoding: null }).toString("utf8").split("\0").filter(Boolean).sort();
  const untracked = others.map((file) => ({ path: file, sha256: sha256(fs.readFileSync(path.join(root, ...file.split("/")))) }));
  console.log(JSON.stringify({ baseSha, trackedDiffSha256: sha256(trackedDiff), untracked }, null, 2));
}

function removePacket() {
  const { packet, absolute, packetRelative } = requirePacket();
  const expected = `.archive-apply/inbox/${packet.applyId}.json`;
  if (packetRelative !== expected || asRelative(absolute) !== expected) throw new Error(`packet must be exactly ${expected}`);
  if (runText(["branch", "--show-current"]) !== `archive-apply/${packet.applyId}`) throw new Error("remove-packet is restricted to its matching staging branch");
  fs.unlinkSync(absolute);
  console.log(JSON.stringify({ status: "PASS", removed: expected }, null, 2));
}

function finalize() {
  const { packet, info, packetRelative } = requirePacket();
  const baseSha = arg.values.get("target-base-sha");
  if (!baseSha || !/^[0-9a-f]{40}$/.test(baseSha)) throw new Error("finalize requires the current dispatch base SHA");
  if (packetRelative !== `.archive-apply/inbox/${packet.applyId}.json`) throw new Error("packet path does not match applyId");
  assertReviewBaseCompatible({ packet, info, targetSha: baseSha });

  const changes = changedNameStatuses(baseSha);
  const untracked = run(["ls-files", "--others", "--exclude-standard", "-z"], { encoding: null }).toString("utf8").split("\0").filter(Boolean).map((file) => ({ status: "A", path: file }));
  const rows = [...changes, ...untracked];
  const paths = new Set();
  for (const row of rows) {
    if (row.path === packetRelative && row.status === "D") continue;
    if (!new Set(["A", "M"]).has(row.status) || !isGeneratedPath(row.path) && !info.finalFilePaths.has(row.path)) {
      throw new Error(`final generated output is outside the reviewed-apply allowlist: ${row.status} ${row.path}`);
    }
    if (row.path === packetRelative) throw new Error("transient APPLY_PACKET remains in final tree");
    assertRegularFile(row.path, "final APPLY output");
    paths.add(row.path);
  }
  for (const finalFile of packet.finalFiles) {
    const file = finalFile.path;
    assertRegularFile(file, "final reviewed file");
    const finalBytes = fs.readFileSync(path.join(root, ...file.split("/")));
    if (sha256(finalBytes) !== finalFile.sha256 || finalBytes.length !== finalFile.sizeBytes) throw new Error(`finalFiles SHA/size changed during regeneration: ${file}`);
    if (paths.has(file)) continue;
    const baseBytes = gitShow(baseSha, file);
    if (sha256(finalBytes) !== sha256(baseBytes)) throw new Error(`final file is missing from generated diff: ${file}`);
  }
  const packetTree = run(["ls-tree", "-r", "--name-only", "HEAD", "--", ".archive-apply/inbox"], { encoding: null }).toString("utf8").split(/\r?\n/).filter(Boolean);
  if (packetTree.length !== 1 || packetTree[0] !== packetRelative) throw new Error("staging commit must contain exactly its one transient APPLY_PACKET");

  const stagePaths = [...paths].sort();
  run(["reset", "--mixed", baseSha]);
  run(["add", "--", ...stagePaths]);
  const staged = run(["diff", "--cached", "--name-only", "-z"], { encoding: null }).toString("utf8").split("\0").filter(Boolean).sort();
  const expectedStaged = [...paths].sort();
  if (staged.length !== expectedStaged.length || staged.some((file, index) => file !== expectedStaged[index])) throw new Error("explicit staged path set differs from validated output allowlist");
  run(["diff", "--cached", "--check"]);
  run(["config", "user.name", "github-actions[bot]"]);
  run(["config", "user.email", "41898282+github-actions[bot]@users.noreply.github.com"]);
  run(["commit", "-m", `archive: apply reviewed exam ${packet.applyId}`]);
  const head = runText(["rev-parse", "HEAD"]);
  if (runText(["rev-parse", "HEAD^"]) !== baseSha) throw new Error("final APPLY commit must have the dispatch base as its only parent");
  if (Number(runText(["rev-list", "--count", `${baseSha}..HEAD`])) !== 1) throw new Error("target delta must contain exactly one commit");
  const finalPacketTree = run(["ls-tree", "-r", "--name-only", "HEAD", "--", ".archive-apply/inbox"], { encoding: null }).toString("utf8").trim();
  if (finalPacketTree) throw new Error("final target tree contains transient APPLY_PACKET files");
  console.log(JSON.stringify({
    status: "PASS",
    applyId: packet.applyId,
    targetRef: packet.targetRef,
    reviewBaseSha: packet.targetBaseSha,
    dispatchBaseSha: baseSha,
    finalCommit: head,
    targetCommitCount: 1,
    changedFiles: staged
  }, null, 2));
}

if (command === "inspect") inspect();
else if (command === "preflight") preflight();
else if (command === "snapshot") snapshot();
else if (command === "remove-packet") removePacket();
else if (command === "finalize") finalize();
else throw new Error("Usage: archive-reviewed-apply-staging.mjs inspect|preflight|snapshot|remove-packet|finalize --packet <path> [options]");
