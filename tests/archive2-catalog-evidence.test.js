"use strict";
// The catalog is split in two (archive/tools/archive2-catalog-evidence.cjs): archive2-catalog.json is what the teacher
// screens and the Worker download, archive2-catalog-evidence.json holds the review/evidence values taken out of it.
// These checks are defect conditions, not counts or sizes of the production data.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { isDeepStrictEqual } = require("node:util");
const root = path.resolve(__dirname, "..");
const lib = require("../archive/tools/archive2-catalog-evidence.cjs");
const core = require("../archive/archive2-core.js");

const SHA = (c) => c.repeat(64);
const sample = () => [
  { questionUid: "qid_v1_a", sourceFingerprint: SHA("1"), metadataRevision: "rev-1", approvedSourceFingerprint: SHA("1"),
    metadataAssignmentEvidence: { questionUid: "qid_v1_a", sourceFingerprint: SHA("1"), metadataRevision: "rev-1", evidenceRefs: ["archive/x.json"],
      evidenceDigest: SHA("d"), assignmentFingerprint: SHA("2"), fieldStatus: { standardUnit: "approved_source", concept: "manual_review_pending" } },
    metaProjection: { projectionStatus: "DISPLAY_ONLY_SOURCE_BOUND", displayOnly: true, L1: "a", evidenceByField: { L1: { status: "approved" } },
      sourceBinding: { bindingMode: "EXACT", catalogSourceJsSha256: SHA("3"), evidenceRefs: ["archive/y.json"], sourceRawSha256: SHA("4") },
      parentBinding: { resolution: "EXACT_CANONICAL_SUBUNIT" } } },
  // metadata differs from the record's own values: those values must stay (the screens compare them)
  { questionUid: "qid_v1_b", sourceFingerprint: SHA("5"), metadataRevision: "rev-1", approvedSourceFingerprint: "",
    metadataAssignmentEvidence: { questionUid: "qid_v1_b", sourceFingerprint: SHA("6"), metadataRevision: "rev-2", evidenceRefs: ["archive/z.json"],
      fieldStatus: { standardUnit: "approved_source" }, rpmMetadata: { rpmL1: "x" } } },
  // a question the resolver reads in full (receipt / override) keeps the whole value
  { questionUid: "qid_v1_c", sourceFingerprint: SHA("7"), metadataAssignmentEvidence: { questionUid: "qid_v1_c", evidenceRefs: ["archive/w.json"], fieldStatus: { subUnit: "approved_final_qa" } }, metaProjection: null },
  { questionUid: "qid_v1_d", sourceFingerprint: SHA("8") },
];

function evidenceFor(records, fullEvidenceUids) {
  const slimmed = lib.slimRecords(records, { fullEvidenceUids });
  const text = lib.evidenceTextOf(slimmed.evidence, "index-1");
  const decoded = { indexVersion: "index-1", catalogEvidence: lib.markerOf(text), records: slimmed.records };
  return { slimmed, text, decoded };
}

test("the split is lossless: slim records plus evidence rebuild the complete records exactly", () => {
  const original = sample();
  const { slimmed, text, decoded } = evidenceFor(original, new Set(["qid_v1_c"]));
  const merged = lib.mergeEvidence(decoded, () => text);
  assert.deepEqual(merged.records, original);
  assert.equal(merged.catalogEvidence, undefined);
  assert.equal(slimmed.records[0].approvedSourceFingerprint, undefined, "the registrar bookkeeping column is not downloaded");
});

test("what a teacher screen reads survives the trimming; the proof paths and hashes do not", () => {
  const { slimmed } = evidenceFor(sample(), new Set(["qid_v1_c"]));
  const [a, b, c] = slimmed.records;
  assert.deepEqual(a.metadataAssignmentEvidence, { fieldStatus: { concept: "manual_review_pending" } });
  assert.equal(a.metaProjection.sourceBinding.bindingMode, "EXACT");
  assert.equal(a.metaProjection.sourceBinding.catalogSourceJsSha256, SHA("3"));
  assert.equal(a.metaProjection.sourceBinding.evidenceRefs, undefined);
  assert.equal(a.metaProjection.parentBinding, undefined);
  assert.deepEqual(a.metaProjection.evidenceByField, { L1: { status: "approved" } });
  assert.equal(b.metadataAssignmentEvidence.metadataRevision, "rev-2");
  assert.equal(b.metadataAssignmentEvidence.sourceFingerprint, SHA("6"));
  assert.deepEqual(b.metadataAssignmentEvidence.rpmMetadata, { rpmL1: "x" });
  assert.deepEqual(c.metadataAssignmentEvidence, sample()[2].metadataAssignmentEvidence, "a question the resolver reads keeps its whole value");
});

test("an evidence file that does not belong to the catalog is refused", () => {
  const { text, decoded } = evidenceFor(sample(), new Set());
  assert.throws(() => lib.mergeEvidence(decoded, () => text + " "), /CATALOG_EVIDENCE_SHA256_MISMATCH/);
  assert.throws(() => lib.mergeEvidence({ ...decoded, indexVersion: "other" }, () => text), /CATALOG_EVIDENCE_DOES_NOT_MATCH_CATALOG/);
  assert.throws(() => lib.mergeEvidence(decoded, () => { throw new Error("ENOENT"); }), /CATALOG_EVIDENCE_FILE_UNAVAILABLE/);
  const whole = { indexVersion: "index-1", records: sample() };
  assert.equal(lib.mergeEvidence(whole, () => { throw new Error("never read"); }), whole, "a catalog without the marker is already whole");
});

// --- the real files -----------------------------------------------------------------------------------------------
const catalogPath = path.join(root, "archive/data/archive2-catalog.json");
const packed = JSON.parse(fs.readFileSync(catalogPath, "utf8"));

test("the committed catalog and its evidence file belong together", () => {
  if (!packed.catalogEvidence) return; // not regenerated into the two-file form yet: the whole catalog is the old one
  const complete = lib.readCatalog({ root });
  const slim = core.decodeCatalog(packed);
  assert.equal(complete.records.length, slim.records.length);
  assert.equal(complete.catalogEvidence, undefined);
  // every trimmed column is a subset of its complete value (only removals, never an invented value)
  for (let i = 0; i < slim.records.length; i++) {
    const s = slim.records[i], c = complete.records[i];
    assert.equal(s.questionUid, c.questionUid);
    for (const column of lib.EVIDENCE_COLUMNS) {
      if (s[column] === undefined || isDeepStrictEqual(s[column], c[column])) continue;
      assert.deepEqual(column === "metaProjection" ? lib.trimMetaProjection(c[column]) : lib.trimMetadataEvidence(c[column], c), s[column], column + " of " + c.questionUid);
    }
    assert.equal(s.approvedSourceFingerprint, undefined);
  }
});

const PAGES = ["workspace", "index", "unit-past-exams", "problem-bank-search"];
function screenScripts() {
  const files = new Set();
  for (const page of PAGES) {
    const html = fs.readFileSync(path.join(root, "archive", page + ".html"), "utf8");
    files.add(page + ".html");
    for (const m of html.matchAll(/<script[^>]*src="([^"]*)"/g)) {
      const src = m[1].replace(/\?.*$/, "");
      if (!/^https?:/.test(src) && fs.existsSync(path.join(root, "archive", src))) files.add(src);
    }
  }
  return [...files];
}
function accessedNames(source) {
  const names = new Set();
  for (const m of source.matchAll(/\??\.([A-Za-z_$][A-Za-z0-9_$]*)/g)) names.add(m[1]);
  for (const m of source.matchAll(/["'`]([A-Za-z_$][A-Za-z0-9_$]*)["'`]/g)) names.add(m[1]);
  return names;
}

test("no teacher-screen script reads a value the catalog no longer carries", () => {
  // resolveCatalog (archive2-canonical.js) is the only reader of these, and only for receipt/override rows that keep them whole.
  const dropped = ["parentBinding", "evidenceRefs", "evidenceDigest", "registrationUpdateReviewProof", "approvedSourceFingerprint"];
  const readers = new Map();
  for (const file of screenScripts()) {
    if (file === "archive2-canonical.js") continue;
    const names = accessedNames(fs.readFileSync(path.join(root, "archive", file), "utf8"));
    for (const name of dropped) if (names.has(name)) readers.set(name, [...(readers.get(name) || []), file]);
  }
  assert.deepEqual(Object.fromEntries(readers), {}, "a screen reads a catalog value that moved to archive2-catalog-evidence.json; keep it in the downloaded catalog (archive2-catalog-evidence.cjs) or stop reading it");
});

test("the same seed gives the same selection whether the catalog is slim or complete", async () => {
  const canonical = core.Canonical;
  const norm = (t) => t.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const fetcher = async (url) => {
    const pathname = decodeURIComponent(new URL(url).pathname);
    const file = pathname.startsWith("/archive/") ? path.join(root, "archive", pathname.slice(9)) : path.join(root, pathname.replace(/^\//, ""));
    const body = norm(fs.readFileSync(file, "utf8"));
    return { ok: true, text: async () => body };
  };
  const bundle = await canonical.loadInputBundle(fetcher, "https://catalog-evidence.invalid/archive/");
  const slimResolved = canonical.resolveCatalog({ versionBundle: bundle });
  const complete = lib.mergeEvidence(core.decodeCatalog(bundle.resources["data/archive2-catalog.json"]),
    (relative) => fs.readFileSync(path.join(root, "archive", relative), "utf8"));
  const fullResolved = canonical.resolveCatalog({ versionBundle: { ...bundle, resources: { ...bundle.resources, "data/archive2-catalog.json": { ...complete, encoding: "plain" } } } });
  assert.equal(fullResolved.records.length, slimResolved.records.length);
  const trimmed = new Set([...lib.WHOLE_COLUMNS, ...lib.TRIMMED_COLUMNS]);
  const strip = (row) => Object.fromEntries(Object.entries(row).filter(([key]) => !trimmed.has(key)));
  const unequal = [];
  for (let i = 0; i < fullResolved.records.length; i++) {
    try { assert.deepEqual(strip(slimResolved.records[i]), strip(fullResolved.records[i])); }
    catch { unequal.push(fullResolved.records[i].questionUid); if (unequal.length > 3) break; }
  }
  assert.deepEqual(unequal, [], "a resolved record differs outside the trimmed columns");
  const groups = new Map();
  for (const record of slimResolved.records) {
    if (!record.automatic) continue;
    const key = [record.sourceGrade, record.curriculumKey, record.courseKey].join("|");
    groups.set(key, (groups.get(key) || 0) + 1);
  }
  const top = [...groups.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  assert.ok(top.length > 0, "the catalog has automatically selectable questions");
  for (const [key] of top) {
    const [grade, curriculumKey, courseKey] = key.split("|");
    for (const seed of ["seed-a", "seed-b"]) {
      const request = (resolved) => ({ filters: { grade, curriculumKey, courseKey }, rows: [{ id: "a", count: 6 }, { id: "b", count: 6 }], seed, canonicalAuthority: resolved.canonicalAuthority });
      const a = core.selectBlueprint(fullResolved.records, request(fullResolved));
      const b = core.selectBlueprint(slimResolved.records, request(slimResolved));
      assert.equal(b.ok, a.ok, key + " " + seed);
      assert.deepEqual((b.selected || []).map((r) => r.questionUid), (a.selected || []).map((r) => r.questionUid), key + " " + seed);
    }
  }
});
