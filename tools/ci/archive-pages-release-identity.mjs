#!/usr/bin/env node
// Content identity for the registered student package. The public receipt is written only after
// the existing release gate passes; it is neither a registration writer nor a new approval record.
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const RELEASE_SCHEMA = "ARCHIVE_PAGES_RELEASE_V1";
export const RELEASE_RECEIPT = "_archive-release.json";
const SHA = /^[a-f0-9]{40}$/;
const DIGEST = /^[a-f0-9]{64}$/;
const digestFields = ["packageDigest", "externalDependencyDigest", "validatorDigest", "archiveValidationDigest"];
const sortPaths = (a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0;
const sha256 = value => crypto.createHash("sha256").update(value).digest("hex");
const digestValue = value => sha256(JSON.stringify(value));

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 128 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}

export function assertRegisteredSnapshot({ sourceRoot = process.cwd(), registeredMainSHA }) {
  if (!SHA.test(String(registeredMainSHA || ""))) throw new Error("registeredMainSHA must be an exact 40-character commit SHA");
  const actual = git(["rev-parse", "HEAD"], sourceRoot).trim();
  if (actual !== registeredMainSHA) throw new Error(`registered snapshot mismatch: expected ${registeredMainSHA}, checked out ${actual}`);
  const changed = git(["diff", "--name-only", "-z", "HEAD", "--"], sourceRoot).split("\0").filter(Boolean);
  if (changed.length) throw new Error(`registered tracked files changed during packaging: ${changed.slice(0, 5).join(", ")}`);
}

export function gitTreeEntries({ sourceRoot = process.cwd(), head = "HEAD" } = {}) {
  return git(["ls-tree", "-r", "-z", head], sourceRoot).split("\0").filter(Boolean).map(row => {
    const match = /^(\d+) (\S+) ([a-f0-9]+)\t([\s\S]+)$/.exec(row);
    if (!match || match[2] !== "blob") throw new Error(`unsupported Git tree entry: ${row.slice(0, 100)}`);
    return { path: match[4], mode: match[1], blob: match[3] };
  }).sort(sortPaths);
}

// Keep unknown Archive/CI/checker changes conservative. Application pages outside these paths do
// not invalidate Archive validation. Package bytes themselves cover the browser runtime modules.
export function isArchiveValidatorPath(file) {
  return /^archive\/tools\//.test(file) ||
    /^tools\/(?:ci\/|lib\/|harness\/|4slot\/|archive(?:\/|-)|check-|build-archive)/.test(file) ||
    /^tests\/(?:archive|generated|problem-bank|meta-foundation|question|exam-|mixer|print-|render-|svg-|item-4slot|helpers\/|fixtures\/)/.test(file) ||
    /^(?:package(?:-lock)?\.json|\.github\/workflows\/(?:archive[^/]*|auto-register-approved-qid9|apms-worker-deploy|r2-archive-assets-copy)\.yml)$/.test(file);
}

function globRegex(glob) {
  if (!glob || glob.startsWith("/") || glob.split("/").some(part => part === "..") || /[\[\]{}!\\]/.test(glob))
    throw new Error(`unsupported Worker dependency path: ${glob}`);
  let pattern = "";
  for (let i = 0; i < glob.length; i += 1) {
    const char = glob[i];
    if (char === "*" && glob[i + 1] === "*") {
      i += 1;
      if (glob[i + 1] === "/") { pattern += "(?:.*/)?"; i += 1; }
      else pattern += ".*";
    } else if (char === "*") pattern += "[^/]*";
    else if (char === "?") pattern += "[^/]";
    else pattern += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
  return new RegExp(`^${pattern}$`);
}

function dependencyDigests({ sourceRoot, entries, packagedPaths, buildOnly }) {
  const workerFile = path.join(sourceRoot, "tools/ci/apms-worker-bundle-paths.txt");
  if (!entries.some(entry => entry.path === "tools/ci/apms-worker-bundle-paths.txt"))
    throw new Error("Worker dependency paths are not in the registered snapshot");
  const workerGlobs = fs.readFileSync(workerFile, "utf8").split(/\r?\n/).map(line => line.trim()).filter(line => line && !line.startsWith("#"));
  if (!workerGlobs.length) throw new Error("Worker dependency paths are empty");
  const workerMatchers = workerGlobs.map(globRegex);
  const worker = entries.filter(entry => workerMatchers.some(regex => regex.test(entry.path)));
  if (!worker.length) throw new Error("Worker dependency paths match no registered files");
  const images = entries.filter(entry => entry.path.startsWith("archive/assets/images/"));
  const validators = entries.filter(entry => isArchiveValidatorPath(entry.path));
  if (!validators.length) throw new Error("no registered release checker versions found");
  const buildOnlyPaths = new Set(buildOnly.map(entry => entry.path));
  // Source/parity checks also read unshipped Generated sources and canonical evidence. A matching
  // package alone cannot reuse their earlier result when one of these direct inputs has changed.
  const archiveInputs = entries.filter(entry => buildOnlyPaths.has(entry.path) ||
    (entry.path.startsWith("archive/") && !packagedPaths.has(entry.path) &&
      !entry.path.startsWith("archive/assets/images/") && !entry.path.startsWith("archive/tools/")) ||
    entry.path.startsWith("docs/rules/01_CANONICAL/taxonomy/") || entry.path.startsWith("alive/") ||
    entry.path === "apmath/wrong_print_engine.html");
  return {
    externalDependencyDigest: digestValue({ images, worker }),
    validatorDigest: digestValue(validators),
    archiveInputDigest: digestValue(archiveInputs),
  };
}

async function fileDigest(file) {
  const hash = crypto.createHash("sha256");
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  return hash.digest("hex");
}

function normalizedInventory(inventory) {
  if (!Array.isArray(inventory) || !inventory.length) throw new Error("student package inventory is empty or unreadable");
  const seen = new Set();
  return inventory.map(entry => {
    if (typeof entry.path !== "string" || entry.path.startsWith("/") || entry.path.includes("\\") ||
        entry.path.split("/").some(part => !part || part === "." || part === "..") || entry.path === RELEASE_RECEIPT ||
        seen.has(entry.path) || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 || !DIGEST.test(String(entry.sha256 || "")))
      throw new Error(`invalid or duplicate package inventory entry: ${entry?.path}`);
    seen.add(entry.path);
    return { path: entry.path, bytes: entry.bytes, sha256: entry.sha256 };
  }).sort(sortPaths);
}

export function packageInventoryDigest(inventory) {
  return digestValue(normalizedInventory(inventory));
}

// Only the existing package-only mixed shards may be untracked. planPagesSite validates their
// schema and full coverage; here every allowed byte is also bound to the tracked index receipt.
function temporaryShardReferences({ sourceRoot, manifest, registeredPaths }) {
  const indexPath = manifest.runtimeClosure?.sourceVerification?.index;
  const references = new Map();
  if (!indexPath || !registeredPaths.has(indexPath)) return references;
  const index = JSON.parse(fs.readFileSync(path.join(sourceRoot, indexPath), "utf8"));
  const lookup = index.mixedLookup;
  if (!lookup) return references;
  const add = (relative, reference) => {
    if (/^archive\/data\/archive2-source-verification\/mixed-v1\/(?:context\.json|sources\/[a-f0-9]{64}\.json|uid-buckets\/[a-f0-9]\.json)$/.test(relative))
      references.set(relative, { sha256: reference.sha256, bytes: Number(reference.byteLength), reason: `mixed source verification index (${indexPath})` });
  };
  add(`archive/${lookup.context.path}`, lookup.context);
  for (const row of lookup.files) {
    const source = index.files[row.sourceIndex]?.sourceFile;
    add(`archive/data/archive2-source-verification/mixed-v1/sources/${sha256(String(source))}.json`, row);
  }
  for (const row of lookup.uidBuckets) add(`archive/${row.path}`, row);
  return references;
}

export async function computeReleaseIdentity({ sourceRoot = process.cwd(), registeredMainSHA,
  manifestPath = path.join(sourceRoot, "tools/archive-pages-release-manifest.json"), manifest = null } = {}) {
  assertRegisteredSnapshot({ sourceRoot, registeredMainSHA });
  const { planPagesSite } = await import("../build-archive-pages-site.mjs");
  const tree = gitTreeEntries({ sourceRoot });
  const registeredPaths = new Set(tree.map(entry => entry.path));
  if (!manifest && !registeredPaths.has(path.relative(sourceRoot, path.resolve(manifestPath)).split(path.sep).join("/")))
    throw new Error("Pages package manifest is not in the registered snapshot");
  const packageManifest = manifest || JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const plan = planPagesSite({ sourceRoot, manifestPath, manifest: packageManifest });
  if (plan.totalBytes >= plan.maxBytes) throw new Error(`student package exceeds the existing ${plan.maxBytes}-byte limit`);
  const temporary = temporaryShardReferences({ sourceRoot, manifest: packageManifest, registeredPaths });
  for (const entry of plan.buildOnly) if (!registeredPaths.has(entry.path))
    throw new Error(`build-only input is not in the registered snapshot: ${entry.path}`);
  const inventory = [];
  for (const entry of plan.entries) {
    const item = { path: entry.path, bytes: entry.bytes, sha256: entry.content ? sha256(entry.content) : await fileDigest(entry.absolute) };
    if (!registeredPaths.has(entry.path)) {
      const reference = temporary.get(entry.path);
      if (!reference || reference.bytes !== item.bytes || reference.sha256 !== item.sha256 || !entry.reasons.includes(reference.reason))
        throw new Error(`packaged file is not in the registered snapshot or a verified temporary shard: ${entry.path}`);
    }
    inventory.push(item);
  }
  const normalized = normalizedInventory(inventory);
  const dependencies = dependencyDigests({ sourceRoot, entries: tree,
    packagedPaths: new Set(normalized.map(entry => entry.path)), buildOnly: plan.buildOnly });
  const archivePackage = normalized.filter(entry => /^(?:archive|shared)\//.test(entry.path));
  const identity = {
    schemaVersion: RELEASE_SCHEMA,
    registeredMainSHA,
    packageDigest: digestValue(normalized),
    externalDependencyDigest: dependencies.externalDependencyDigest,
    validatorDigest: dependencies.validatorDigest,
    archiveValidationDigest: digestValue({ package: archivePackage, ...dependencies }),
    fileCount: normalized.length,
    totalBytes: plan.totalBytes,
  };
  assertRegisteredSnapshot({ sourceRoot, registeredMainSHA });
  return identity;
}

export function validateReleaseIdentity(value, { requireGate = false } = {}) {
  return Boolean(value && value.schemaVersion === RELEASE_SCHEMA && SHA.test(String(value.registeredMainSHA || "")) &&
    digestFields.every(field => DIGEST.test(String(value[field] || ""))) &&
    Number.isSafeInteger(value.fileCount) && value.fileCount > 0 &&
    Number.isSafeInteger(value.totalBytes) && value.totalBytes >= 0 && value.totalBytes < 1_000_000_000 &&
    (!requireGate || value.releaseGate === "RELEASE_GATE_PASS"));
}

export function compareReleaseIdentity(candidate, live) {
  if (!validateReleaseIdentity(candidate)) throw new Error("candidate release identity is invalid");
  if (!validateReleaseIdentity(live, { requireGate: true }))
    return { needed: true, archiveNeeded: true, reason: "no valid successful live release receipt" };
  if (candidate.packageDigest === live.packageDigest && (candidate.fileCount !== live.fileCount || candidate.totalBytes !== live.totalBytes))
    return { needed: true, archiveNeeded: true, reason: "live release receipt has inconsistent package size or file count" };
  const archiveNeeded = ["archiveValidationDigest", "validatorDigest", "externalDependencyDigest"]
    .some(field => candidate[field] !== live[field]);
  const sameContent = candidate.packageDigest === live.packageDigest && candidate.externalDependencyDigest === live.externalDependencyDigest;
  // A validator-only revision does not change the student release. It is checked
  // by its PR CI; do not deploy unchanged bytes just to publish a new receipt.
  // Keeping archiveNeeded=true records that the old validator PASS is not reused.
  return { needed: !sameContent, archiveNeeded,
    reason: sameContent
      ? archiveNeeded
        ? `NO_OP: student package and external dependencies match live registered ${live.registeredMainSHA}; validation inputs changed, no validation result is reused and no new Pages receipt is issued`
        : `NO_OP: package, external dependencies and checker versions match live registered ${live.registeredMainSHA}`
      : `release inputs changed: ${digestFields.filter(field => candidate[field] !== live[field]).join(", ")}` };
}

async function stagedInventory(root) {
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error("staged site is a symbolic link");
  const inventory = [];
  async function walk(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join("/");
      if (entry.isSymbolicLink()) throw new Error(`staged site contains a symbolic link: ${relative}`);
      if (entry.isDirectory()) await walk(absolute);
      else if (entry.isFile()) {
        if (relative !== RELEASE_RECEIPT) inventory.push({ path: relative, bytes: fs.statSync(absolute).size, sha256: await fileDigest(absolute) });
      } else throw new Error(`staged site contains a non-file: ${relative}`);
    }
  }
  await walk(root);
  return normalizedInventory(inventory);
}

export async function sealReleaseReceipt({ sourceRoot = process.cwd(), registeredMainSHA, identityFile, packageReport, gateEvidence }) {
  assertRegisteredSnapshot({ sourceRoot, registeredMainSHA });
  const identity = JSON.parse(fs.readFileSync(identityFile, "utf8"));
  if (!validateReleaseIdentity(identity) || identity.registeredMainSHA !== registeredMainSHA)
    throw new Error("candidate identity does not belong to this exact registered SHA");
  const evidence = fs.readFileSync(gateEvidence, "utf8");
  const lastValue = key => [...evidence.matchAll(new RegExp(`^${key}=(.*)$`, "gm"))].at(-1)?.[1];
  if (lastValue("source_sha") !== registeredMainSHA || lastValue("release_gate") !== "RELEASE_GATE_PASS")
    throw new Error("current registered snapshot has no successful release gate evidence");
  const report = JSON.parse(fs.readFileSync(packageReport, "utf8"));
  const output = path.join(sourceRoot, "_site");
  if (report.schemaVersion !== "ARCHIVE_PAGES_SITE_PACKAGE_REPORT_V1" || path.resolve(report.outputDir) !== path.resolve(output) ||
      !Number.isSafeInteger(report.maxBytes) || report.maxBytes < 1 || report.maxBytes > 1_000_000_000)
    throw new Error("package report is not for this staged student site");
  const reportInventory = normalizedInventory(report.inventory);
  if (packageInventoryDigest(reportInventory) !== identity.packageDigest || report.fileCount !== identity.fileCount ||
      report.totalBytes !== identity.totalBytes || reportInventory.reduce((total, row) => total + row.bytes, 0) !== identity.totalBytes)
    throw new Error("built package does not match the probed registered identity");
  if (packageInventoryDigest(await stagedInventory(output)) !== identity.packageDigest)
    throw new Error("staged package bytes changed after the package report");
  const receipt = Object.fromEntries(["schemaVersion", "registeredMainSHA", ...digestFields, "fileCount", "totalBytes"]
    .map(key => [key, identity[key]]));
  receipt.releaseGate = "RELEASE_GATE_PASS";
  const bytes = Buffer.from(`${JSON.stringify(receipt)}\n`);
  if (identity.totalBytes + bytes.length >= report.maxBytes) throw new Error("release receipt would exceed the existing package size limit");
  assertRegisteredSnapshot({ sourceRoot, registeredMainSHA });
  fs.writeFileSync(path.join(output, RELEASE_RECEIPT), bytes);
  return receipt;
}

function parseArgs(argv) {
  const names = { "--registered-main-sha": "registeredMainSHA", "--identity-file": "identityFile",
    "--package-report": "packageReport", "--gate-evidence": "gateEvidence", "--root": "sourceRoot" };
  const opt = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = names[argv[i]];
    if (!key || !argv[i + 1]) throw new Error(`unknown or valueless argument: ${argv[i]}`);
    opt[key] = argv[i + 1];
  }
  for (const key of ["registeredMainSHA", "identityFile", "packageReport", "gateEvidence"])
    if (!opt[key]) throw new Error(`missing required option: ${key}`);
  return opt;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = await sealReleaseReceipt(parseArgs(process.argv.slice(2)));
    console.log(`release_receipt=${RELEASE_RECEIPT} registered_main_sha=${result.registeredMainSHA} package_digest=${result.packageDigest}`);
  } catch (error) { console.error(`::error title=Pages release identity::${error.message}`); process.exitCode = 1; }
}
