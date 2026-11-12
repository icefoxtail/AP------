import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { createServer } from "node:http";
import { execFileSync, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildPagesSite } from "../tools/build-archive-pages-site.mjs";
import { computeReleaseIdentity, compareReleaseIdentity, sealReleaseReceipt, validateReleaseIdentity,
  isArchiveValidatorPath, RELEASE_RECEIPT } from "../tools/ci/archive-pages-release-identity.mjs";
import { decideDeployNeeded, latestSuccessfulDeploymentSha, probe, receiptUrl, readLiveReceipt } from "../tools/ci/archive-pages-deploy-needed.mjs";

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pages-identity-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync("git", ["-c", "user.name=t", "-c", "user.email=t@example.test", "-c", "commit.gpgsign=false", ...args], { cwd: root, encoding: "utf8" }).trim();
  const put = (file, content) => { const target = path.join(root, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content); };
  const commit = () => { git("add", "-A"); git("commit", "-qm", "fixture"); return git("rev-parse", "HEAD"); };
  git("init", "-q", "-b", "main");
  put(".gitignore", "_site/\nevidence/\n");
  put("index.html", "<title>Student site</title>");
  put("archive/runtime.js", "window.runtime = 1;\n");
  put("archive/data/meta.json", '{ "uids": ["uid-a"], "title": "original" }\n');
  put("archive/exams/a.js", 'window.exam = {uid:"uid-a",asset:"assets/solutions/a.svg"};\n');
  put("archive/assets/solutions/a.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>\n');
  put("archive/assets/images/a.png", "image-before");
  put("archive/generated/approved-source.js", 'window.approved = "uid-a";\n');
  put("shared/runtime.js", "window.shared = 1;\n");
  put("apmath/index.html", "<title>AP Math</title>");
  put("apmath/worker-backup/index.js", "export const worker = 1;\n");
  put("tools/ci/apms-worker-bundle-paths.txt", "apmath/worker-backup/**\n");
  put("archive/tools/check.cjs", "module.exports = 1;\n");
  put(".github/workflows/archive-pages-release.yml", "name: release\n");
  const manifest = { schemaVersion: "ARCHIVE_PAGES_SITE_MANIFEST_V1", maxBytes: 1_000_000,
    files: ["index.html", "archive/runtime.js", "archive/data/meta.json", "shared/runtime.js", "apmath/index.html"],
    trees: [{ path: "archive/exams" }, { path: "archive/assets/solutions" }], minifyJson: ["archive/data/meta.json"] };
  put("tools/archive-pages-release-manifest.json", JSON.stringify(manifest));
  const sha = commit();
  const identity = () => computeReleaseIdentity({ sourceRoot: root, registeredMainSHA: git("rev-parse", "HEAD") });
  const live = value => ({ ...value, releaseGate: "RELEASE_GATE_PASS" });
  return { root, git, put, commit, sha, identity, live, manifest };
}

test("content identity reuses a successful release after an unrelated main commit and on every event", async t => {
  const f = fixture(t), initial = await f.identity();
  f.put("docs/unrelated.md", "documentation only\n"); f.commit();
  const next = await f.identity();
  assert.notEqual(next.registeredMainSHA, initial.registeredMainSHA);
  assert.equal(next.packageDigest, initial.packageDigest);
  assert.deepEqual(compareReleaseIdentity(next, f.live(initial)), { needed: false, archiveNeeded: false,
    reason: `NO_OP: package, external dependencies and checker versions match live registered ${initial.registeredMainSHA}` });
  for (const event of ["push", "schedule", "workflow_run", "workflow_dispatch"]) {
    const result = await probe({ env: { GITHUB_EVENT_NAME: event, GITHUB_REPOSITORY: "owner/repo" },
      sourceRoot: f.root, computeIdentity: async () => next, readLive: async () => f.live(initial) });
    assert.equal(result.needed, false, event);
    assert.equal(result.archiveNeeded, false, event);
  }
});

test("package identity hashes transformed JSON bytes; meaningful metadata changes are published", async t => {
  const f = fixture(t), before = await f.identity();
  f.put("archive/data/meta.json", JSON.stringify({ uids: ["uid-a"], title: "original" }, null, 4)); f.commit();
  const whitespace = await f.identity();
  assert.equal(whitespace.packageDigest, before.packageDigest, "builder minification produces the same student bytes");
  assert.equal(compareReleaseIdentity(whitespace, f.live(before)).needed, false);
  f.put("archive/data/meta.json", JSON.stringify({ uids: ["uid-a"], title: "new searchable title" })); f.commit();
  const changed = await f.identity();
  assert.notEqual(changed.packageDigest, before.packageDigest);
  assert.equal(compareReleaseIdentity(changed, f.live(before)).archiveNeeded, true);
});

test("new exam and solution SVG bytes change the package, and missing required files fail closed", async t => {
  const f = fixture(t), before = await f.identity();
  f.put("archive/exams/b.js", 'window.examB = {uid:"uid-b"};\n');
  f.put("archive/assets/solutions/b.svg", '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0"/></svg>\n'); f.commit();
  assert.equal(compareReleaseIdentity(await f.identity(), f.live(before)).needed, true);
  const added = await f.identity();
  f.put("archive/assets/solutions/b.svg", '<svg xmlns="http://www.w3.org/2000/svg"><path d="M1 1"/></svg>\n'); f.commit();
  assert.notEqual((await f.identity()).archiveValidationDigest, added.archiveValidationDigest);
  fs.unlinkSync(path.join(f.root, "archive/runtime.js")); f.commit();
  await assert.rejects(f.identity(), /included file does not exist/);
});

test("student SVG projection is bound to registered source and image bytes", async t => {
  const f = fixture(t);
  f.manifest.studentSvgRefresh = true;
  f.put("tools/archive-pages-release-manifest.json", JSON.stringify(f.manifest));
  f.put("archive/exams/a.js", 'window.questionBank = [{id: 1, content: "Question", answer: "1", solutionImage: "assets/images/current.svg"}];');
  f.commit();
  f.put("archive/assets/images/current.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>');
  await assert.rejects(f.identity(), /student SVG projection has an input outside the registered snapshot/);
  f.commit();
  const initial = await f.identity();
  const report = await buildPagesSite({ sourceRoot: f.root, manifest: f.manifest });
  assert.ok(report.inventory.some(entry => entry.path === 'archive/data/student-svg-refresh-v1/other.json' &&
    entry.transform === 'student-svg-refresh'));
  assert.equal(report.minifiedFileCount, 1);
  f.put("archive/assets/images/current.svg", '<svg xmlns="http://www.w3.org/2000/svg"><title>Revised</title></svg>');
  f.commit();
  assert.notEqual((await f.identity()).packageDigest, initial.packageDigest);
});

test("same-path R2 image replacement and Worker changes invalidate external dependency proof", async t => {
  const f = fixture(t), before = await f.identity();
  f.put("archive/assets/images/a.png", "image-after!"); f.commit();
  const image = await f.identity();
  assert.equal(image.packageDigest, before.packageDigest, "R2 image is excluded from Pages");
  assert.notEqual(image.externalDependencyDigest, before.externalDependencyDigest);
  assert.equal(compareReleaseIdentity(image, f.live(before)).needed, true);
  f.put("apmath/worker-backup/index.js", "export const worker = 2;\n"); f.commit();
  const worker = await f.identity();
  assert.equal(worker.packageDigest, image.packageDigest);
  assert.notEqual(worker.externalDependencyDigest, image.externalDependencyDigest);
});

test("non-Archive frontend changes reuse Archive proof; checker, output and unshipped source changes cannot", async t => {
  const f = fixture(t), before = await f.identity();
  f.put("apmath/index.html", "<title>Changed AP Math frontend</title>"); f.commit();
  const frontend = await f.identity();
  assert.deepEqual({ ...compareReleaseIdentity(frontend, f.live(before)), reason: "" }, { needed: true, archiveNeeded: false, reason: "" });
  f.put("archive/tools/check.cjs", "module.exports = 2;\n"); f.commit();
  const checker = await f.identity();
  assert.equal(checker.packageDigest, frontend.packageDigest);
  assert.equal(compareReleaseIdentity(checker, f.live(frontend)).archiveNeeded, true);
  f.put("archive/generated/approved-source.js", 'window.approved = "uid-b";\n'); f.commit();
  const source = await f.identity();
  assert.equal(source.packageDigest, checker.packageDigest);
  assert.equal(compareReleaseIdentity(source, f.live(checker)).archiveNeeded, true, "unshipped source/parity input still matters");
  f.put("archive/runtime.js", "window.runtime = 2;\n"); f.commit();
  assert.equal(compareReleaseIdentity(await f.identity(), f.live(source)).archiveNeeded, true);
  for (const file of ["tools/check-qid9-main-source-browser.cjs", "tools/lib/future-helper.mjs", "tools/ci/future-checker.mjs", "tests/archive-new.test.mjs"])
    assert.equal(isArchiveValidatorPath(file), true, file);
  assert.equal(isArchiveValidatorPath("docs/unrelated.md"), false);
});

test("same student content avoids redeploying for changed validators or unshipped inputs without reusing their PASS", async t => {
  const f = fixture(t), published = f.live(await f.identity());
  const originalReceipt = JSON.stringify(published);
  f.put("archive/tools/check.cjs", "module.exports = 2;\n"); f.commit();
  const checker = await f.identity();
  const compare = compareReleaseIdentity(checker, published);
  assert.equal(compare.needed, false);
  assert.equal(compare.archiveNeeded, true, "the old validator verdict is explicitly not reusable");
  assert.match(compare.reason, /no validation result is reused.*no new Pages receipt/);
  const probeResult = await probe({ sourceRoot: f.root, env: { GITHUB_REPOSITORY: "o/r" }, readLive: async () => published });
  assert.equal(probeResult.status, "NO_OP"); assert.equal(probeResult.needed, false); assert.equal(probeResult.archiveNeeded, true);
  assert.equal(JSON.stringify(published), originalReceipt, "a content no-op does not replace or advance the published proof");
  f.put("archive/generated/approved-source.js", 'window.approved = "uid-b";\n'); f.commit();
  const unshipped = compareReleaseIdentity(await f.identity(), published);
  assert.equal(unshipped.needed, false); assert.equal(unshipped.archiveNeeded, true);
  f.put("apmath/index.html", "<title>actual new student bytes</title>"); f.commit();
  const newContent = compareReleaseIdentity(await f.identity(), published);
  assert.equal(newContent.needed, true); assert.equal(newContent.archiveNeeded, true, "the later real release must run the changed validator");
});

test("all directly invoked Pages/runtime test versions and their external source inputs invalidate Archive proof", async t => {
  const f = fixture(t), before = await f.identity();
  f.put("tests/svg-language-gate.test.cjs", "// changed technical validator\n"); f.commit();
  const checker = await f.identity();
  assert.equal(checker.packageDigest, before.packageDigest);
  assert.equal(compareReleaseIdentity(checker, f.live(before)).archiveNeeded, true);
  f.put("apmath/wrong_print_engine.html", "<script src=\"print-runtime.js\"></script>\n"); f.commit();
  const printInput = await f.identity();
  assert.equal(compareReleaseIdentity(printInput, f.live(checker)).archiveNeeded, true);
  f.put("alive/fixture/reviewed-source.svg", '<svg xmlns="http://www.w3.org/2000/svg"/>\n'); f.commit();
  const source = await f.identity();
  assert.equal(source.packageDigest, printInput.packageDigest);
  assert.equal(compareReleaseIdentity(source, f.live(printInput)).archiveNeeded, true);
  const repository = fileURLToPath(new URL("..", import.meta.url));
  for (const file of ["tools/check-archive2-runtime.cjs", ".github/workflows/archive-pages-release.yml"]) {
    const content = fs.readFileSync(path.join(repository, file), "utf8");
    const dependencies = [...content.matchAll(/(?:archive\/tools\/|tests\/)[A-Za-z0-9_./-]+\.test\.[cm]?js/g)].map(match => match[0]);
    assert.ok(dependencies.length, `declared direct tests found in ${file}`);
    for (const dependency of dependencies) assert.equal(isArchiveValidatorPath(dependency), true, `${file} directly invokes ${dependency}`);
  }
  for (const workflow of ["archive-registration-writer.yml", "archive-main-auto-meta.yml", "auto-register-approved-qid9.yml"])
    assert.equal(isArchiveValidatorPath(`.github/workflows/${workflow}`), true);
});

test("untracked package members cannot be labeled as part of a registered Git snapshot", async t => {
  const f = fixture(t);
  f.put("archive/exams/untracked.js", "window.unregistered = true;\n");
  await assert.rejects(f.identity(), /packaged file is not in the registered snapshot.*untracked\.js/);
  f.commit();
  assert.equal(validateReleaseIdentity(await f.identity()), true, "the same file is allowed once actually registered in Git");
});

test("only package-only mixed shard bytes bound by the tracked verification index may remain untracked", async t => {
  const f = fixture(t);
  const prefix = "archive/data/archive2-source-verification/mixed-v1/";
  f.put(".gitignore", `_site/\nevidence/\n${prefix}\n`);
  const context = { schemaVersion: "archive2-mixed-source-verification-context-v1", resolverVersion: "fixture", baseProjectionVersion: "fixture",
    authority: { taxonomyVersion: "fixture", gradeCourses: [], canonicalParents: [], canonicalAdvancedPaths: [], projectionPolicy: {},
      problemTypeKeys: [], templatesByKey: {}, bindingKeys: [] } };
  const reference = (file, value) => {
    const text = `${JSON.stringify(value)}\n`;
    f.put(`archive/${file}`, text);
    return { path: file, byteLength: Buffer.byteLength(text), sha256: crypto.createHash("sha256").update(text).digest("hex") };
  };
  const contextRef = reference("data/archive2-source-verification/mixed-v1/context.json", context);
  const buckets = [..."0123456789abcdef"].map(prefix => ({ prefix,
    ...reference(`data/archive2-source-verification/mixed-v1/uid-buckets/${prefix}.json`, {
      schemaVersion: "archive2-mixed-source-verification-uid-bucket-v1", prefix, records: [], ...(prefix === "f" ? { context } : {})
    }), recordCount: 0, ...(prefix === "f" ? { includesContext: true } : {}) }));
  const index = { schemaVersion: "archive2-source-verification-index-v1", resolverVersion: "fixture", baseProjectionVersion: "fixture", files: [],
    mixedLookup: { schemaVersion: "archive2-mixed-source-verification-index-v1", resolverVersion: "fixture", baseProjectionVersion: "fixture",
      context: contextRef, files: [], uidBuckets: buckets } };
  f.put("archive/data/source-index.json", JSON.stringify(index));
  f.manifest.runtimeClosure = { sourceVerification: { index: "archive/data/source-index.json", pathPrefix: "data/archive2-source-verification/v1/" } };
  f.put("tools/archive-pages-release-manifest.json", JSON.stringify(f.manifest)); f.commit();
  assert.equal(f.git("ls-files", `${prefix}context.json`), "", "temporary shard is not committed");
  const identity = await f.identity();
  assert.equal(validateReleaseIdentity(identity), true);
  f.put(`${prefix}uid-buckets/0.json`, "{}\n");
  await assert.rejects(f.identity(), /mixed UID bucket (?:byteLength|digest) mismatch/, "a modified temporary shard cannot borrow the old registered receipt");
});

test("missing, invalid, failed or unavailable live receipts never claim a reusable PASS", async t => {
  const f = fixture(t), candidate = await f.identity();
  for (const live of [null, {}, { ...f.live(candidate), schemaVersion: "unknown" }, candidate,
    { ...f.live(candidate), packageDigest: "bad" }, { ...f.live(candidate), releaseGate: "RELEASE_GATE_FAIL" },
    { ...f.live(candidate), fileCount: candidate.fileCount + 1 }, { ...f.live(candidate), totalBytes: candidate.totalBytes + 1 }]) {
    assert.equal(compareReleaseIdentity(candidate, live).needed, true);
    assert.equal(compareReleaseIdentity(candidate, live).archiveNeeded, true);
  }
  const failed = await decideDeployNeeded({ candidate, readLive: async () => { throw new Error("timeout"); } });
  assert.equal(failed.needed, true); assert.equal(failed.archiveNeeded, true);
  assert.equal(failed.blocked, true, "unknown fetched-main identity cannot authorize replacement of an unknown live version");
  for (const input of [{ ...candidate, registeredMainSHA: "HEAD" }, { ...candidate, fileCount: -1 }])
    assert.equal(validateReleaseIdentity(input), false);
});

test("registered SHA mismatch and staged source mutation are refused", async t => {
  const f = fixture(t);
  await assert.rejects(computeReleaseIdentity({ sourceRoot: f.root, registeredMainSHA: "f".repeat(40) }), /registered snapshot mismatch/);
  f.put("archive/runtime.js", "unexpected mutation\n");
  await assert.rejects(f.identity(), /registered tracked files changed/);
  f.git("add", "archive/runtime.js");
  await assert.rejects(f.identity(), /registered tracked files changed/, "staged mutations are also rejected");
});

test("sealing requires this snapshot's successful gate and the actual built package bytes", async t => {
  const f = fixture(t), identity = await f.identity();
  const identityFile = path.join(f.root, "evidence/identity.json"), packageReport = path.join(f.root, "evidence/package.json"), gateEvidence = path.join(f.root, "evidence/context.txt");
  f.put("evidence/identity.json", JSON.stringify({ ...identity, localScratchNote: "not public receipt metadata" }));
  await buildPagesSite({ sourceRoot: f.root, manifest: f.manifest, reportPath: packageReport });
  const opts = { sourceRoot: f.root, registeredMainSHA: f.sha, identityFile, packageReport, gateEvidence };
  f.put("evidence/context.txt", `source_sha=${f.sha}\nrelease_gate=RELEASE_GATE_FAIL\n`);
  await assert.rejects(sealReleaseReceipt(opts), /no successful release gate evidence/);
  assert.equal(fs.existsSync(path.join(f.root, "_site", RELEASE_RECEIPT)), false);
  f.put("evidence/context.txt", `source_sha=${"f".repeat(40)}\nrelease_gate=RELEASE_GATE_PASS\n`);
  await assert.rejects(sealReleaseReceipt(opts), /no successful release gate evidence/);
  f.put("evidence/context.txt", `source_sha=${f.sha}\nrelease_gate=RELEASE_GATE_PASS\n`);
  f.put("_site/archive/runtime.js", "tampered staged bytes");
  await assert.rejects(sealReleaseReceipt(opts), /staged package bytes changed/);
  await buildPagesSite({ sourceRoot: f.root, manifest: f.manifest, reportPath: packageReport });
  const sealed = await sealReleaseReceipt(opts);
  assert.equal(sealed.registeredMainSHA, f.sha);
  assert.equal(Object.hasOwn(sealed, "localScratchNote"), false, "only the explicit receipt metadata is published");
  assert.equal(validateReleaseIdentity(sealed, { requireGate: true }), true);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root, "_site", RELEASE_RECEIPT), "utf8")), sealed);
  await sealReleaseReceipt(opts);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.root, "_site", RELEASE_RECEIPT), "utf8")), sealed, "repeat seal writes identical bytes");
});

test("live receipt URL is configurable, bounded and failure-aware", async () => {
  assert.equal(receiptUrl({ repo: "Owner/repo" }), "https://owner.github.io/repo/_archive-release.json");
  assert.equal(receiptUrl({ repo: "Owner/Owner.github.io" }), "https://owner.github.io/_archive-release.json");
  assert.equal(receiptUrl({ configured: "https://school.example/_archive-release.json" }), "https://school.example/_archive-release.json");
  assert.throws(() => receiptUrl({ configured: "https://secret@example/_archive-release.json" }), /without credentials/);
  await assert.rejects(readLiveReceipt("https://site/receipt", { fetchImpl: async () => new Response("missing", { status: 404 }) }), error => error.status === 404);
  await assert.rejects(readLiveReceipt("https://site/receipt", { fetchImpl: async () => new Response("x".repeat(16385)) }), /unexpectedly large/);
  const received = await readLiveReceipt("https://site/receipt", { fetchImpl: async (url, init) => {
    assert.equal(init.cache, "no-store"); return new Response('{"ok":true}');
  } });
  assert.deepEqual(received, { ok: true });
});

test("ordering base prefers exact live registered SHA; only confirmed legacy 404 permits deployment-API fallback", async t => {
  const f = fixture(t), identity = await f.identity();
  let apiCalls = 0;
  const triggerSHA = "d".repeat(40);
  const get = async route => { apiCalls += 1; return route.includes("/statuses") ? [{ state: "success" }] : [{ id: 1, sha: triggerSHA }]; };
  assert.equal(await latestSuccessfulDeploymentSha(get, "o/r", { readLive: async () => f.live(identity) }), identity.registeredMainSHA);
  assert.equal(apiCalls, 0, "dispatch trigger SHA cannot replace a published registered SHA");
  for (const readLive of [async () => ({}), async () => { throw new Error("timeout"); }, async () => { throw new SyntaxError("invalid JSON"); }])
    assert.equal(await latestSuccessfulDeploymentSha(get, "o/r", { readLive }), null);
  assert.equal(apiCalls, 0, "unknown receipt does not call the legacy API");
  const legacy404 = async () => { const error = new Error("not found"); error.status = 404; throw error; };
  assert.equal(await latestSuccessfulDeploymentSha(get, "o/r", { readLive: legacy404, allowLegacy: false }), null);
  assert.equal(apiCalls, 0, "a legacy image-presence gate is not reusable exact-byte evidence for R2");
  assert.equal(await latestSuccessfulDeploymentSha(get, "o/r", { readLive: legacy404 }), triggerSHA);
  assert.equal(apiCalls, 2);
});

test("unknown or invalid live receipts permit only the exact fixed fetched main, including initial 404 migration", async t => {
  const f = fixture(t), older = await f.identity();
  f.put("apmath/index.html", "<title>newer published candidate</title>"); f.commit();
  const current = await f.identity();
  f.git("update-ref", "refs/remotes/origin/main", current.registeredMainSHA);
  const reads = [
    async () => { throw new Error("timeout"); },
    async () => { const error = new Error("HTTP 404"); error.status = 404; throw error; },
    async () => { const error = new Error("HTTP 503"); error.status = 503; throw error; },
    async () => { throw new SyntaxError("malformed JSON"); },
    async () => null,
    async () => ({ ...f.live(current), schemaVersion: "unknown" }),
    async () => ({ ...f.live(current), releaseGate: "RELEASE_GATE_FAIL" }),
  ];
  const options = { sourceRoot: f.root, env: { GITHUB_REPOSITORY: "o/r" } };
  for (const readLive of reads) {
    const allowed = await probe({ ...options, readLive });
    assert.equal(allowed.status, "VALIDATE"); assert.equal(allowed.blocked, false);
    assert.equal(allowed.needed, true); assert.equal(allowed.archiveNeeded, true);
    assert.match(allowed.reason, /equals fixed fetched main.*no validation result is reused/);
  }
  f.git("checkout", "-q", "--detach", older.registeredMainSHA);
  for (const readLive of reads) {
    const blocked = await probe({ ...options, readLive });
    assert.equal(blocked.status, "BLOCKED"); assert.equal(blocked.blocked, true);
    assert.equal(blocked.needed, true); assert.equal(blocked.archiveNeeded, true);
  }
  let fetchedReads = 0;
  const fixed = await probe({ ...options, fetchedMainSha: () => { fetchedReads++; return current.registeredMainSHA; },
    readLive: async () => { f.git("update-ref", "refs/remotes/origin/main", older.registeredMainSHA); throw Error("timeout after unrelated ref change"); } });
  assert.equal(fixed.blocked, true); assert.equal(fetchedReads, 1, "never reread or fetch moving main to change the release snapshot");
  f.git("update-ref", "-d", "refs/remotes/origin/main");
  assert.equal((await probe({ ...options, readLive: reads[0] })).blocked, true, "missing fetched main is not approval for an old candidate");

  const server = createServer((request, response) => { response.statusCode = 404; response.end("no receipt yet"); });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const script = fileURLToPath(new URL("../tools/ci/archive-pages-deploy-needed.mjs", import.meta.url));
  f.git("update-ref", "refs/remotes/origin/main", current.registeredMainSHA);
  for (const [candidate, expectedExit, expectedStatus] of [[older, 1, "BLOCKED"], [current, 0, "VALIDATE"]]) {
    f.git("checkout", "-q", "--detach", candidate.registeredMainSHA);
    const output = path.join(f.root, `evidence/unknown-${expectedStatus}.txt`);
    fs.mkdirSync(path.dirname(output), { recursive: true });
    const exit = await new Promise(resolve => {
      const proc = spawn(process.execPath, [script, "--registered-main-sha", candidate.registeredMainSHA,
        "--receipt-url", `http://127.0.0.1:${server.address().port}/_archive-release.json`],
      { cwd: f.root, env: { PATH: process.env.PATH, GITHUB_OUTPUT: output }, stdio: "ignore" });
      proc.on("close", resolve);
    });
    assert.equal(exit, expectedExit, "an older candidate fails the real identity step even for confirmed legacy 404");
    assert.match(fs.readFileSync(output, "utf8"), new RegExp(`status=${expectedStatus}\\n`));
  }
});

test("older duplicate dispatch is SUPERSEDED; missing or diverged published ancestry blocks publication", async t => {
  const f = fixture(t), initial = await f.identity();
  f.put("apmath/index.html", "<title>newer live site</title>"); f.commit();
  const newer = await f.identity();
  f.git("checkout", "-q", "--detach", initial.registeredMainSHA);
  const options = { sourceRoot: f.root, env: { GITHUB_REPOSITORY: "o/r" }, readLive: async () => f.live(newer) };
  const superseded = await probe(options);
  assert.equal(superseded.status, "SUPERSEDED"); assert.equal(superseded.needed, false);
  assert.equal(superseded.archiveNeeded, true, "superseded is not a reused verification PASS");
  f.git("checkout", "-qb", "diverged");
  f.put("docs/branch.md", "different history\n"); f.commit();
  const diverged = await probe(options);
  assert.equal(diverged.blocked, true); assert.equal(diverged.needed, true);
  assert.match(diverged.reason, /diverged/);
  const unknown = await probe({ ...options, readLive: async () => ({ ...f.live(newer), registeredMainSHA: "f".repeat(40) }) });
  assert.equal(unknown.blocked, true); assert.equal(unknown.archiveNeeded, true);

  const server = createServer((request, response) => { response.setHeader("Content-Type", "application/json"); response.end(JSON.stringify(f.live(newer))); });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => server.close());
  const script = fileURLToPath(new URL("../tools/ci/archive-pages-deploy-needed.mjs", import.meta.url));
  const output = path.join(f.root, "evidence/output.txt"); fs.mkdirSync(path.dirname(output), { recursive: true });
  const exit = await new Promise(resolve => {
    const proc = spawn(process.execPath, [script, "--registered-main-sha", f.git("rev-parse", "HEAD"), "--receipt-url", `http://127.0.0.1:${server.address().port}/_archive-release.json`],
      { cwd: f.root, env: { PATH: process.env.PATH, GITHUB_OUTPUT: output }, stdio: "ignore" });
    proc.on("close", resolve);
  });
  assert.equal(exit, 1, "an ancestry block is a real failed identity step for the final gate");
  assert.match(fs.readFileSync(output, "utf8"), /blocked=true\nstatus=BLOCKED\n/);
});
