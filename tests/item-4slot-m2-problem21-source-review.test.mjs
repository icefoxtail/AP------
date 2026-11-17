// Reconstructed after the transient fixture was lost. These are new test bytes.
// The historical 39-row baseline is immutable; current data comes from the
// actual checkout. Only the private source47 fixture is writable.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { M2_PROBLEM21_DERIVED_SVG8_ITEMS } from "../archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs";
import { verifyRegisteredRendererContinuity } from "../tools/4slot/registered-renderer-continuity.mjs";
import { loadActiveMetaRegistry } from "../archive/tools/meta-foundation/active-registry.mjs";
import { validateNativeReviewedSourceReuse } from "../archive/tools/meta-foundation/native-reviewed-source-reuse.mjs";

const require = createRequire(import.meta.url);
const builder = require("../tools/4slot/build-4slot-runtime.cjs");
const collector = require("../tools/4slot/registered-renderer-continuity.cjs");
const consumer = require("../archive/item-4slot.js");
const generator = require("../archive/tools/build-svg-accessibility-index.cjs");
const svgIndex = require("../tools/4slot/existing-vector-svg-index-continuity.cjs");
const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ITEMS = M2_PROBLEM21_DERIVED_SVG8_ITEMS;
const selected = new Set(ITEMS.map(row => row.questionUid));
const SOURCES = [...new Set(ITEMS.map(row => row.sourceArchiveFile))];
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const SVG = "archive/data/svg-accessibility-index.js";
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const OUTPUT = "archive/data/item-4slot-index.json";
const RUNTIME = "archive/data/meta-foundation/runtime";
const RECEIPTS = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/";
const EVIDENCE = "docs/operations/m2-problem21-continuity-20261116/";
const SIDECARS = ".archive-meta-register/4slot-renderer-continuity/";
const PRIOR_COMMIT = "22f79c4ffd5ad5f811c2840a532422e0ecabd3e1";
const PRIOR_INDEX_BLOB = "8af67c9067ea855b3898e0cc196fc4efc01641ab";
const PRIOR_INDEX_SHA = "a74519a13b233a1d774c8e8b8699465590aff7a9ea8c21d63fb5c0ba55fda422";
const GENERATOR_BLOB = "42ebd4cf0d285b4e5d7df2ccf7c1d3bfa4a54e86";
const schema = "archive-four-slot-registered-m2-problem21-continuity-v1";
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const sha = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const blob = bytes => crypto.createHash("sha1").update(Buffer.from("blob " + bytes.length + "\0")).update(bytes).digest("hex");
const clone = value => structuredClone(value);
const jsonBytes = value => Buffer.from(JSON.stringify(value) + "\n");
const whole = value => sha(stable(value));
const sidecarPath = row => SIDECARS + "m2s2-problem21-issued-eight-20261116-" + row.key.toLowerCase() + ".json";
function git(root, args, input) {
  return execFileSync("git", args, { cwd: root, input, timeout: 30000, maxBuffer: 160 * 1024 * 1024,
    stdio: ["pipe", "pipe", "pipe"], env: { ...process.env, GIT_NO_LAZY_FETCH: "1", GIT_OPTIONAL_LOCKS: "0",
      GIT_AUTHOR_NAME: "Archive bounded test", GIT_AUTHOR_EMAIL: "test@example.invalid",
      GIT_COMMITTER_NAME: "Archive bounded test", GIT_COMMITTER_EMAIL: "test@example.invalid" } });
}
function write(root, relative, bytes) {
  const full = path.join(root, relative);
  fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, bytes);
}
function relativePath(value) {
  return typeof value === "string" && /^(?:(?:archive|tools|docs)\/|\.archive-meta-register\/evidence\/)/.test(value) &&
    !/[\\\x00-\x1f\x7f]/.test(value) && !value.split("/").some(part => !part || part === "." || part === "..");
}
function regular(root, relative) {
  assert.ok(relativePath(relative) || relative.startsWith(SIDECARS), "closed input namespace");
  const base = fs.realpathSync(root), full = path.resolve(base, relative);
  assert.ok(full.startsWith(base + path.sep), "input stays inside fixture");
  for (let p = full; p !== base; p = path.dirname(p)) {
    assert.notEqual(p, path.dirname(p));
    assert.equal(fs.lstatSync(p).isSymbolicLink(), false, "regular path component: " + relative);
  }
  assert.equal(fs.lstatSync(full).isFile(), true, "regular file: " + relative); return full;
}
function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, "en")).flatMap(entry => {
    assert.equal(entry.isSymbolicLink(), false, "fixture walk refuses symlinks");
    const full = path.join(directory, entry.name); return entry.isDirectory() ? walk(full) : [full];
  });
}
function sortedRows(rows) { return [...rows].sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en")); }
const outsideRows = index => sortedRows(index.records.filter(row => !selected.has(row.questionUid)));
function assertOutside(index, expected) {
  assert.equal(outsideRows(index).length, 39);
  assert.equal(whole(outsideRows(index)), expected, "all outside39 whole rows equal the immutable actual baseline");
}
function proofJson(relative) {
  // Never recurse through global MD/ID, runtime outputDigests, canonical or compiled data.
  return /^(?:docs\/operations\/|archive\/data\/meta-review\/|archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/|\.archive-meta-register\/evidence\/)/.test(relative) &&
    relative.endsWith(".json");
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "m2-closed8-source47-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  git(root, ["init", "-q"]);
  const common = path.resolve(repo, git(repo, ["rev-parse", "--git-common-dir"]).toString().trim());
  write(root, ".git/objects/info/alternates", path.join(common, "objects") + "\n");
  const checkout = git(repo, ["rev-parse", "HEAD"]).toString().trim();
  git(root, ["update-ref", "HEAD", checkout]);
  const inputPins = new Map(), copied = new Set(), queue = [], queued = new Set(), missingOptionalPaths = new Set();
  function input(relative) {
    const bytes = fs.readFileSync(regular(repo, relative));
    inputPins.set(relative, { path: relative, bytes: bytes.length, sha256: sha(bytes), gitBlobSha1: blob(bytes) });
    return bytes;
  }
  function enqueue(value) {
    if (typeof value === "string") { if (relativePath(value) && !queued.has(value)) { queued.add(value); queue.push(value); } return; }
    if (!value || typeof value !== "object") return;
    if (typeof value.path === "string") enqueue(value.path);
    for (const child of Array.isArray(value) ? value : Object.values(value)) enqueue(child);
  }
  function copy(relative, required = false) {
    if (!relativePath(relative)) return;
    if ([META, IDENTITY, OUTPUT, SVG].includes(relative) || relative.startsWith(RUNTIME + "/")) return;
    // Only two current source banks are read. A meta-review path containing "/exams/"
    // is evidence, not a current source bank, and must not be filtered out.
    if (relative.startsWith("archive/exams/") && !SOURCES.some(source => relative === "archive/exams/" + source)) return;
    if (copied.has(relative)) return;
    if (!fs.existsSync(path.join(repo, relative))) {
      if (required) assert.fail("required current proof input missing: " + relative);
      missingOptionalPaths.add(relative); return;
    }
    const bytes = input(relative); write(root, relative, bytes); copied.add(relative);
    if (proofJson(relative)) enqueue(JSON.parse(bytes));
  }
  const docs = ITEMS.map(row => {
    const relative = sidecarPath(row), bytes = fs.readFileSync(regular(repo, relative)), document = JSON.parse(bytes);
    inputPins.set(relative, { path: relative, bytes: bytes.length, sha256: sha(bytes), gitBlobSha1: blob(bytes) });
    assert.equal(document.schemaVersion, schema); assert.equal(document.questionUid, row.questionUid);
    assert.equal(document.sourceArchiveFile, row.sourceArchiveFile); assert.equal(document.sourceOrdinal, row.sourceOrdinal);
    enqueue(document); return { relative, bytes, document };
  });
  const sourceRows = new Map(), compacts = new Map(), sourceRawPins = [];
  for (const source of SOURCES) {
    const item = ITEMS.find(row => row.sourceArchiveFile === source), relative = "archive/exams/" + source;
    const bytes = input(relative); assert.equal(blob(bytes), item.sourceGitBlobSha1); assert.equal(sha(bytes), item.sourceSha256);
    write(root, relative, bytes); copied.add(relative);
    const bank = builder.loadBank(bytes); assert.equal(bank.length, source.includes("/2mid/") ? 23 : 24);
    sourceRows.set(source, bank); sourceRawPins.push(inputPins.get(relative));
    const compactPath = "archive/data/item-4slot/" + source.replace(/\.js$/, ".4slot.json");
    copy(compactPath, true);
    const compact = JSON.parse(fs.readFileSync(path.join(root, compactPath))); compacts.set(source, compact);
    assert.equal(compact.items.length, bank.length); assert.equal(compact.sourceArchiveFile, source);
    const oldRaw = git(root, ["cat-file", "blob", compact.sourceGitBlobSha]);
    assert.equal(blob(oldRaw), compact.sourceGitBlobSha);
    // Current local assets of these 47 rows, including opaque inherited carriers.
    const text = JSON.stringify(bank).replaceAll("\\/", "/");
    for (const match of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
      copy(match[0].startsWith("archive/") ? match[0] : "archive/" + match[0]);
  }
  for (const prefix of ["archive/data/meta-foundation/canonical", "archive/data/meta-foundation/compiled",
    "archive/tools/meta-foundation", "tools/4slot"]) {
    for (const full of walk(path.join(repo, prefix))) {
      const relative = path.relative(repo, full).split(path.sep).join("/");
      if (prefix.startsWith("archive/data/") || /\.(?:mjs|cjs|js)$/.test(relative)) copy(relative, true);
    }
  }
  copy(MASTER, true);
  for (const name of ["static-v1.json", "student-ui-observed-v1.json", "student-ui-technical-v1.json", "q10-independent-ui-v1.json"])
    copy(EVIDENCE + name, true);
  for (const entry of docs) {
    copy(entry.document.receiptRef.path, true); copy(entry.document.sourceReviewBindingRef.path, true);
    copy(entry.document.independentReviewRef.path, true); copy(entry.document.dictionaryRef.path, true);
  }
  for (let i = 0; i < queue.length; i++) { assert.ok(i < 20000, "bounded proof dependency queue"); copy(queue[i]); }
  // Current global uniqueness is checked before deriving exact row views.
  function rows(relative) {
    const data = JSON.parse(input(relative));
    assert.ok(Array.isArray(data.records));
    const uids = new Set(), joins = new Set();
    for (const row of data.records) {
      assert.match(row.questionUid, /^qid_v1_[a-f0-9]{64}$/);
      assert.equal(uids.has(row.questionUid), false, relative + ": global UID unique"); uids.add(row.questionUid);
      const join = stable([row.sourceArchiveFile, row.sourceOrdinal]);
      assert.equal(joins.has(join), false, relative + ": global source join unique"); joins.add(join);
    }
    const selectedRows = data.records.filter(row => SOURCES.includes(row.sourceArchiveFile));
    assert.equal(selectedRows.length, 47);
    write(root, relative, jsonBytes({ ...data, records: selectedRows }));
    return selectedRows;
  }
  const metadata = rows(META), identities = rows(IDENTITY), uidSet = new Set(identities.map(row => row.questionUid));
  assert.equal(uidSet.size, 47); assert.equal(metadata.every(row => uidSet.has(row.questionUid)), true);
  const runtimes = [];
  for (const full of walk(path.join(repo, RUNTIME)).filter(file => file.endsWith(".json"))) {
    const relative = path.relative(repo, full).split(path.sep).join("/"), container = JSON.parse(input(relative));
    if (!Array.isArray(container.records)) continue;
    const records = container.records.filter(row => uidSet.has(row.questionUid));
    write(root, relative, jsonBytes({ ...container, records }));
    for (const row of records) runtimes.push({ relative, status: container.status, packId: container.packId, row });
  }
  const identityByUid = new Map(identities.map(row => [row.questionUid, row]));
  for (const source of SOURCES) {
    const bank = sourceRows.get(source);
    for (let i = 0; i < bank.length; i++) {
      const found = identities.filter(row => row.sourceArchiveFile === source && row.sourceOrdinal === i + 1);
      assert.equal(found.length, 1);
    }
  }
  const priorRaw = git(repo, ["show", PRIOR_COMMIT + ":" + OUTPUT]);
  assert.equal(blob(priorRaw), PRIOR_INDEX_BLOB, "immutable actual index binding");
  assert.equal(sha(priorRaw), PRIOR_INDEX_SHA, "immutable actual index raw binding");
  // Git identity is the exact raw input pin; the whole selected row hashes below
  // bind the original outside39 independently of any new builder baseline.
  const prior = JSON.parse(priorRaw), compactPaths = new Set(docs.map(entry => entry.document.compactRef.path));
  const priorRecords = prior.records.filter(row => compactPaths.has(row.compactPath));
  const priorPending = prior.pending.filter(row => compactPaths.has(row.path));
  const priorFiles = prior.files.filter(row => compactPaths.has(row.path));
  assert.equal(priorRecords.length, 39); assert.equal(priorPending.length, 8); assert.equal(priorFiles.length, 2);
  assert.equal(priorRecords.some(row => selected.has(row.questionUid)), false);
  assert.equal(priorRecords.every(row => uidSet.has(row.questionUid)), true);
  const pendingKeys = priorPending.map(row => row.path + "#" + row.ordinal).sort();
  assert.deepEqual(pendingKeys, docs.map(entry => entry.document.compactRef.path + "#" + entry.document.sourceDisplayNumber).sort());
  const priorOutsideSha256 = whole(sortedRows(priorRecords));
  const priorView = { ...prior, files: priorFiles, records: priorRecords, pending: priorPending,
    counts: { ...prior.counts, files: 2, items: 47, registered: 39, pending: 8 } };
  const originalSvgRaw = input(SVG), originalSvg = svgIndex.parseIndex(originalSvgRaw);
  write(root, SVG, originalSvgRaw);
  const generated = generateEight(root, sourceRows, originalSvg);
  const baselineInputs = new Map(walk(root).filter(full => !full.includes(path.sep + ".git" + path.sep))
    .map(full => [path.relative(root, full).split(path.sep).join("/"), sha(fs.readFileSync(full))]));
  const globalPins = [inputPins.get(META), inputPins.get(IDENTITY), inputPins.get(SVG)];
  const selectedStateSha256 = whole({ metadata: sortedRows(metadata), identities: sortedRows(identities),
    runtime: runtimes.map(row => row.row).sort((a, b) => a.questionUid.localeCompare(b.questionUid, "en")) });
  function assertInputsUnchanged() {
    for (const [relative, expected] of baselineInputs)
      assert.equal(sha(fs.readFileSync(regular(root, relative))), expected, "fixture original input preserved: " + relative);
    for (const pin of inputPins.values())
      assert.equal(sha(fs.readFileSync(regular(repo, pin.path))), pin.sha256, "checkout original input preserved: " + pin.path);
  }
  return { root, docs, metadata, identities, identityByUid, runtimes, compacts, sourceRows, priorView, priorOutsideSha256,
    inputPins, globalPins, selectedStateSha256, sourceRawPins, generated, missingOptionalPaths: [...missingOptionalPaths].sort(),
    assertInputsUnchanged, checkout };
}
function generateEight(root, banks, committed) {
  const generation = fs.mkdtempSync(path.join(os.tmpdir(), "m2-approved8-svg-generator-"));
  try {
    git(generation, ["init", "-q"]); git(generation, ["commit", "--allow-empty", "-qm", "empty scoped generator input"]);
    const baseRef = git(generation, ["rev-parse", "HEAD"]).toString().trim();
    for (const source of SOURCES) write(generation, "archive/exams/" + source, fs.readFileSync(path.join(root, "archive/exams/" + source)));
    for (const item of ITEMS) {
      const raw = fs.readFileSync(regular(root, item.assetPath));
      assert.equal(blob(raw), item.assetGitBlobSha1); assert.equal(sha(raw), item.assetSha256); write(generation, item.assetPath, raw);
    }
    const generatorRaw = fs.readFileSync(path.join(repo, "archive/tools/build-svg-accessibility-index.cjs"));
    assert.equal(blob(generatorRaw), GENERATOR_BLOB, "unchanged official SVG generator");
    const production = generator.productionRows({ records: [] }, generation, { baseRef, sourceRoots: [] });
    assert.equal(production.scope.sourceRosterFileCount, 2); assert.equal(production.rows.length, 8);
    const rows = production.rows, committedBefore = [];
    for (const item of ITEMS) {
      const refs = [{ path: item.assetPath }], old = svgIndex.selectEntries(committed, refs);
      committedBefore.push({ key: item.key, count: old.length, wholeSha256: whole(old) });
      const found = svgIndex.selectEntries({ ...committed, records: rows }, refs);
      assert.equal(found.length, 1); assert.equal(found[0].visualRole, "problem");
      assert.equal(whole(found[0]), item.derivedRecordSha256, item.key + ": canonical whole generated row");
      // An already generated exact row is reusable; a different existing role or
      // record must never be overwritten under this scoped test fixture.
      assert.ok(old.length === 0 || (old.length === 1 && whole(old[0]) === item.derivedRecordSha256),
        "current selected record is absent or the exact previously accepted canonical row");
    }
    const selectedRefs = new Set(ITEMS.map(item => item.assetPath.slice("archive/".length)));
    const merged = { ...committed, records: committed.records.filter(row => !selectedRefs.has(row.assetRef)).concat(rows) };
    svgIndex.parseIndex(encodeSvg(merged));
    write(root, SVG, encodeSvg(merged));
    return { officialProductionRows: true, generatorGitBlobSha1: blob(generatorRaw), sourceRosterFileCount: 2,
      sourceQuestions: [...banks.values()].reduce((n, bank) => n + bank.length, 0), generatedRows: rows.length,
      committedSelectedBefore: committedBefore, generatedRecords: ITEMS.map(item => ({ key: item.key,
        wholeSha256: whole(svgIndex.selectEntries(merged, [{ path: item.assetPath }])[0]) })),
      fixtureGeneratedIndexSha256: sha(encodeSvg(merged)), interpretation: "PRIVATE_OFFICIAL_GENERATED_INPUT_NOT_COMMITTED_SVG_OR_NEW_APPROVAL" };
  } finally { fs.rmSync(generation, { recursive: true, force: true }); }
}
function encodeSvg(document) {
  return Buffer.from("(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(" +
    JSON.stringify(document) + ");\n}(typeof window !== 'undefined' ? window : globalThis));\n");
}
function replaceJson(root, relative, mutate) {
  const full = path.join(root, relative), original = fs.readFileSync(full), value = JSON.parse(original);
  mutate(value); fs.writeFileSync(full, jsonBytes(value)); return () => fs.writeFileSync(full, original);
}
function mutateBytes(root, relative, action) {
  const full = path.join(root, relative), raw = fs.readFileSync(full);
  fs.writeFileSync(full, Buffer.concat([raw, Buffer.from(" ")]));
  try { action(); } finally { fs.writeFileSync(full, raw); }
}
function sameByteSymlink(root, relative, action) {
  const full = path.join(root, relative), raw = fs.readFileSync(full), outside = fs.mkdtempSync(path.join(root, "readonly-link-target-"));
  const target = path.join(outside, "input"); fs.writeFileSync(target, raw); fs.unlinkSync(full); fs.symlinkSync(target, full);
  try { action(); } finally { fs.unlinkSync(full); fs.writeFileSync(full, raw); fs.rmSync(outside, { recursive: true, force: true }); }
}
function safeInnerFailure(error, root) {
  const relative = typeof error.path === "string" ? path.relative(root, error.path).split(path.sep).join("/") : null;
  return { code: typeof error.code === "string" ? error.code : null,
    path: relative && relativePath(relative) ? relative : null, messageSha256: sha(String(error.message || error)) };
}

test("typed source-review cache tracks MASTER and refuses same-byte symlink inputs", () => {
  // This case exercises the production dependency collector only. Synthetic
  // protocol bytes here never call Native and are not authority evidence.
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "m2-source-review-cache-"));
  const entry = ITEMS[0], relative = sidecarPath(entry), document = JSON.parse(fs.readFileSync(path.join(repo, relative)));
  const engine = "archive/cache-test/engine.js", css = "archive/cache-test/student.css", font = "archive/cache-test/student.woff2";
  const nativeCode = "archive/tools/meta-foundation/cache-test.mjs";
  try {
    for (const file of [META, IDENTITY, MASTER, SVG, engine, css, font, nativeCode, document.compactRef.path,
      document.dictionaryRef.path, document.currentSourceRef.path, document.sourceReviewBindingRef.path, document.independentReviewRef.path])
      write(root, file, Buffer.from("dependency-only:" + file));
    write(root, document.receiptRef.path, jsonBytes({ approval: { evidenceRefs: [{ path: engine }, { path: css }, { path: font }] } }));
    write(root, EVIDENCE + "static-v1.json", jsonBytes({ records: [] }));
    write(root, EVIDENCE + "student-ui-technical-v1.json", jsonBytes({ servedFiles: [{ path: engine }, { path: css }, { path: font }] }));
    write(root, relative, jsonBytes(document));
    const collect = () => collector.collect(root, { safe: builder.safe, walk, sha }).get(document.sourceArchiveFile)[0];
    const digests = () => new Map(collect().digests), original = collect();
    for (const file of [META, IDENTITY, MASTER, SVG, engine, css, font, nativeCode])
      assert.equal(digests().get(file), sha(fs.readFileSync(path.join(root, file))));
    for (const file of [MASTER, engine, css, font, nativeCode]) {
      mutateBytes(root, file, () => {
        assert.notEqual(whole(collect().digests), whole(original.digests), file + ": cache key must change");
        assert.notEqual(digests().get(file), new Map(original.digests).get(file));
      });
    }
    for (const file of [MASTER, META, SVG]) {
      const full = path.join(root, file), bytes = fs.readFileSync(full); fs.unlinkSync(full);
      try { assert.equal(digests().get(file), null, file + ": missing input invalidates cache"); }
      finally { fs.writeFileSync(full, bytes); }
      sameByteSymlink(root, file, () => {
        assert.equal(digests().get(file), null, file + ": same bytes via symlink cannot reuse cache");
        assert.notEqual(whole(collect().digests), whole(original.digests));
      });
    }
    const parent = path.join(root, "archive/cache-test"), moved = path.join(root, "parent-link-target");
    fs.renameSync(parent, moved); fs.symlinkSync(moved, parent, "dir");
    try { for (const file of [engine, css, font]) assert.equal(digests().get(file), null, "every parent component is checked"); }
    finally { fs.unlinkSync(parent); fs.renameSync(moved, parent); }
    const masterFile = path.join(root, MASTER), masterBytes = fs.readFileSync(masterFile);
    fs.unlinkSync(masterFile); fs.mkdirSync(masterFile);
    try { assert.equal(digests().get(MASTER), null, "directory is not a regular dependency"); }
    finally { fs.rmdirSync(masterFile); fs.writeFileSync(masterFile, masterBytes); }
    assert.equal(whole(collect().digests), whole(original.digests));
    const legacy = { ...document, schemaVersion: "archive-four-slot-registered-renderer-continuity-v1" };
    write(root, relative, jsonBytes(legacy));
    assert.equal(digests().has(MASTER), false, "new MASTER dependency belongs only to the new source-review schema");
    const legacyMd = digests().get(META);
    sameByteSymlink(root, META, () => assert.equal(digests().get(META), legacyMd, "legacy digest implementation is unchanged"));
  } finally { fs.rmSync(root, { recursive: true, force: true }); }
});

test("issued M2 problem21 closed8 transports its unchanged vectors within the actual source47", { timeout: 240000 }, async t => {
  const f = fixture(t), { root } = f;
  const before = builder.build(root, { previous: f.priorView, reuseCache: false });
  assert.equal(before.index.counts.items, 47);
  assert.equal(before.index.counts.registered, 39);
  assert.equal(before.index.counts.pending, 8);
  assertOutside(before.index, f.priorOutsideSha256);
  write(root, OUTPUT, jsonBytes(before.index));
  for (const entry of f.docs) write(root, entry.relative, entry.bytes);
  const first = ITEMS[0], firstDoc = f.docs.find(entry => entry.document.questionUid === first.questionUid);
  const firstRuntime = f.runtimes.filter(entry => entry.row.questionUid === first.questionUid);
  assert.equal(firstRuntime.length, 1);
  const firstMetadata = f.metadata.find(row => row.questionUid === first.questionUid), firstIdentity = f.identityByUid.get(first.questionUid);
  const currentBytes = fs.readFileSync(path.join(root, "archive/exams/" + first.sourceArchiveFile));
  const currentBank = f.sourceRows.get(first.sourceArchiveFile), registry = loadActiveMetaRegistry(root);
  assert.equal(registry.status, "ACTIVE");
  const nativeSource = { root, bytes: currentBytes, blobSha1: blob(currentBytes), bank: currentBank,
    runtimeRecord: firstRuntime[0].row, runtimeStatus: firstRuntime[0].status,
    identityMap: f.identityByUid, identityByJoin: new Map(f.identities.map(row => [stable([row.sourceArchiveFile, row.sourceOrdinal]), row])) };
  const firstReceipt = JSON.parse(fs.readFileSync(path.join(root, firstDoc.document.receiptRef.path)));
  let inner;
  try { inner = validateNativeReviewedSourceReuse(firstReceipt, nativeSource, currentBank[first.sourceOrdinal - 1],
    firstIdentity, first.sourceOrdinal, firstMetadata, registry); }
  catch (error) {
    const failure = safeInnerFailure(error, root);
    console.log("M2_CLOSED8_INNER_NATIVE_FAILURE " + JSON.stringify({ key: first.key, ...failure }));
    assert.fail("Original inner Native refusal: " + JSON.stringify(failure));
  }
  assert.equal(inner, true, "original current Native proof is established before checking the old cursor");
  assert.equal(verifyRegisteredRendererContinuity(root, firstDoc.relative).status, "PASS", "the original full Native/cursor route is required");
  const applied = builder.run(root, { write: true }), after = JSON.parse(fs.readFileSync(path.join(root, OUTPUT)));
  console.log("M2_CLOSED8_WRITE_BOUNDARY " + JSON.stringify({ counts: applied.counts, status: applied.status,
    pending: applied.pendingItems.map(row => ({ path: row.path, ordinal: row.ordinal, reason: row.reason })),
    officialGenerated8: f.generated }));
  assert.equal(applied.status, "PASS"); assert.equal(applied.verified, 47);
  assert.equal(after.counts.items, 47); assert.equal(after.counts.registered, 47); assert.equal(after.counts.pending, 0);
  assertOutside(after, f.priorOutsideSha256);
  const api = consumer.createIndex(after);
  assert.equal(api.size, 47);
  let queries = 0;
  for (const row of after.records) {
    const compact = f.compacts.get(row.sourceArchiveFile), vector = compact.items.filter(item => item.ordinal === row.sourceDisplayNumber);
    assert.equal(vector.length, 1);
    for (const slot of builder.SLOTS) assert.equal(whole(row[slot]), whole(vector[0][slot]), "existing vector unchanged: " + row.questionUid + "/" + slot);
    assert.equal(row.format, vector[0].format); assert.equal(whole(row.candidates), whole(vector[0].candidates));
    assert.equal(whole(api.get(row.questionUid)), whole(row));
    for (const slot of builder.SLOTS) for (const term of row[slot]) {
      assert.equal(api.hasTerm(row.questionUid, slot, term, row.dictionaryVersion), true);
      assert.ok(api.find({ [slot]: [term] }, { dictionaryVersion: row.dictionaryVersion }).some(result => result.questionUid === row.questionUid));
      queries++;
    }
    if (selected.has(row.questionUid)) {
      const entry = f.docs.find(doc => doc.document.questionUid === row.questionUid);
      assert.equal(row.sourceBinding, "REGISTERED_RENDERER_CONTINUITY");
      assert.equal(row.independentReviewClaim, false);
      assert.equal(whole(row.rendererContinuityRef), whole({ path: entry.relative, sha256: sha(entry.bytes) }));
    }
  }
  assert.equal(builder.verify(after).verified, 47);
  const afterRaw = fs.readFileSync(path.join(root, OUTPUT));
  const rejects = [], direct = () => verifyRegisteredRendererContinuity(root, firstDoc.relative);
  for (const [name, change] of [
    ["scope cannot expand", doc => { doc.scope = "FULL_EXAM"; }],
    ["new four-slot approval forbidden", doc => { doc.newFourSlotApprovals = 1; }],
    ["new mathematical QA forbidden", doc => { doc.newMathematicalQa = true; }],
    ["another UID cannot borrow this proof", doc => { doc.questionUid = ITEMS[1].questionUid; }],
    ["ordinal cannot drift", doc => { doc.sourceOrdinal++; }],
    ["unknown option fails closed", doc => { doc.skipNative = true; }],
    ["legacy schema cannot consume source-review fields", doc => { doc.schemaVersion = "archive-four-slot-registered-renderer-continuity-v1"; }],
    ["bound receipt cannot be substituted", doc => { doc.receiptRef.sha256 = "0".repeat(64); }]
  ]) await t.test(name, () => {
    const restore = replaceJson(root, firstDoc.relative, change);
    try { assert.throws(direct); rejects.push(name); } finally { restore(); }
  });
  for (const [name, relative] of [
    ["compact whole vector file remains immutable", firstDoc.document.compactRef.path],
    ["dictionary remains immutable", firstDoc.document.dictionaryRef.path],
    ["current whole source remains immutable", firstDoc.document.currentSourceRef.path],
    ["issued receipt remains immutable", firstDoc.document.receiptRef.path],
    ["issued source-review binding remains immutable", firstDoc.document.sourceReviewBindingRef.path],
    ["old public static proof remains immutable", firstDoc.document.independentReviewRef.path],
    ["approved asset bytes remain immutable", first.assetPath]
  ]) await t.test(name, () => mutateBytes(root, relative, () => { assert.throws(direct); rejects.push(name); }));
  for (const [name, relative, mutate] of [
    ["metadata whole row drift refused", META, value => { value.records.find(row => row.questionUid === first.questionUid).metadataRevision += ":test-drift"; }],
    ["identity whole row drift refused", IDENTITY, value => { value.records.find(row => row.questionUid === first.questionUid).sourceFingerprint = "0".repeat(64); }],
    ["runtime whole row drift refused", firstRuntime[0].relative, value => { value.records.find(row => row.questionUid === first.questionUid).metadataRevision += ":test-drift"; }],
    ["duplicate identity use refused", IDENTITY, value => { value.records.push(clone(value.records.find(row => row.questionUid === first.questionUid))); }]
  ]) await t.test(name, () => {
    const restore = replaceJson(root, relative, mutate);
    try { assert.throws(direct); rejects.push(name); } finally { restore(); }
  });
  await t.test("a changed canonical generated record is not a derived8 witness", () => {
    const full = path.join(root, SVG), raw = fs.readFileSync(full), document = svgIndex.parseIndex(raw);
    const record = document.records.find(row => row.assetRef === first.assetPath.slice("archive/".length) && row.visualRole === "problem");
    assert.ok(record); record.descriptionKo = "synthetic negative fixture only";
    fs.writeFileSync(full, encodeSvg(document));
    try { assert.throws(direct); rejects.push("generated record changed"); } finally { fs.writeFileSync(full, raw); }
  });
  const warmRefusal = label => {
    const result = builder.build(root, { previous: after, reuseCache: true });
    assert.ok(result.stats.revalidatedFiles > 0, label + ": cache must revalidate");
    assert.equal(result.index.records.filter(row => selected.has(row.questionUid)).length, 0, label + ": no selected vector bypass");
    assert.equal(result.index.counts.registered, 39); assert.equal(result.index.counts.pending, 8);
    assertOutside(result.index, f.priorOutsideSha256);
    assert.equal(sha(fs.readFileSync(path.join(root, OUTPUT))), sha(afterRaw), "read-only negative build leaves issued index unchanged");
    rejects.push(label);
  };
  await t.test("MASTER removal invalidates the warm cache and replays original Native", () => {
    const full = path.join(root, MASTER), raw = fs.readFileSync(full); fs.unlinkSync(full);
    try { warmRefusal("MASTER missing"); } finally { fs.writeFileSync(full, raw); }
  });
  await t.test("same-byte metadata symlink cannot reuse a successful warm verdict", () => sameByteSymlink(root, META, () => warmRefusal("metadata symlink")));
  await t.test("same-byte SVG index symlink cannot reuse a successful warm verdict", () => sameByteSymlink(root, SVG, () => warmRefusal("SVG symlink")));
  await t.test("a same-byte proof parent symlink cannot reuse a successful warm verdict", () => {
    const directory = path.dirname(path.join(root, firstDoc.document.independentReviewRef.path));
    const moved = path.join(root, "proof-parent-target");
    fs.renameSync(directory, moved); fs.symlinkSync(moved, directory, "dir");
    try { warmRefusal("proof parent symlink"); }
    finally { fs.unlinkSync(directory); fs.renameSync(moved, directory); }
  });
  const cold = builder.run(root, { check: true });
  assert.equal(cold.changed, false); assert.equal(cold.verified, 47); assert.equal(cold.pending, 0);
  assert.equal(sha(fs.readFileSync(path.join(root, OUTPUT))), sha(afterRaw), "cold no-cache replay is byte exact");
  for (const entry of f.docs) fs.unlinkSync(path.join(root, entry.relative));
  const removed = builder.run(root, { write: true }), final = JSON.parse(fs.readFileSync(path.join(root, OUTPUT)));
  assert.equal(removed.verified, 39); assert.equal(final.counts.pending, 8);
  assertOutside(final, f.priorOutsideSha256);
  const removedApi = consumer.createIndex(final);
  for (const uid of selected) assert.equal(removedApi.get(uid), null, "removed sidecar cannot retain selected registration");
  f.assertInputsUnchanged();
  assert.equal(git(root, ["rev-parse", "HEAD"]).toString().trim(), f.checkout);
  console.log("M2_CLOSED8_SCOPED_GATE " + JSON.stringify({
    schemaVersion: "m2-closed8-source47-verification-v1", status: "PASS",
    sourceCount: 2, sourceQuestions: 47, selected: 8, outside: 39,
    before: { registered: 39, pending: 8 }, after: { registered: 47, pending: 0 }, removed: { registered: 39, pending: 8 },
    priorCommit: PRIOR_COMMIT, priorIndexGitBlobSha1: PRIOR_INDEX_BLOB,
    originalOutside39Sha256: f.priorOutsideSha256, actualCurrentGlobalInputs: f.globalPins,
    currentSourceInputs: f.sourceRawPins, selectedStateSha256: f.selectedStateSha256,
    officialGenerated8: f.generated, consumerQueries: queries, coldReplayChanged: cold.changed,
    sidecars: f.docs.map(entry => ({ path: entry.relative, sha256: sha(entry.bytes), bytes: entry.bytes.length })),
    currentInputCount: f.inputPins.size, currentInputsSha256: whole([...f.inputPins.values()].sort((a, b) => a.path.localeCompare(b.path, "en"))),
    missingOptionalProofPathsSha256: whole(f.missingOptionalPaths), negativeCases: rejects,
    preservedOriginalInputs: true, sourceMutation: 0, metadataMutation: 0, identityMutation: 0, semanticApprovalMutation: 0,
    newMathematicalQa: false, visualQaRerun: false, interpretation: "PRIVATE_SCOPED_PRODUCTION_GATE_NOT_GLOBAL_MAIN_REGISTRATION"
  }));
});
