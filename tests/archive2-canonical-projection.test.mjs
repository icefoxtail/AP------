import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import test from "node:test";
import { fileURLToPath } from "node:url";
import core from "../archive/archive2-core.js";

const require = createRequire(import.meta.url);
const canonical = require("../archive/archive2-canonical.js");
const sourceFile = "original/middle/m3/1final/26_test_중3.js";
const uid = "qid_v1_" + "1".repeat(64);
const masterPath = canonical.CANONICAL_MASTER_PATH;
const masterSha = "e".repeat(64);
const assignmentFingerprint = "f".repeat(64);
const sourceFingerprint = "a".repeat(64);
const parent = {
  grade: "중3",
  curriculumKey: "2022",
  courseKey: "M3-1",
  L1: "제곱근과 실수",
  L2: "실수와 수직선",
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fixture({ validAssignment = true, catalogSeed = false } = {}) {
  const row = {
    questionUid: uid,
    sourceFile,
    sourceOrdinal: 1,
    sourceGrade: "중3",
    effectiveBrowseGrade: "고1",
    identityStatus: "VERIFIED",
    sourceStatus: "VERIFIED",
    sourceIntegrityStatus: "VERIFIED",
    sourceFingerprint,
    assignmentFingerprint,
    curriculumKey: "2022",
    courseKey: "M3-1",
    L1: "RAW-legacy-only",
    L2: "category fallback",
    standardUnit: "legacy unit",
    category: "legacy category",
    subUnit: "legacy subunit",
    taxonomyStatus: "UNKNOWN",
    reviewStatus: "reviewed_pass",
  };
  const assignment = {
    questionUid: uid,
    sourceFile,
    sourceOrdinal: 1,
    sourceFingerprint: assignmentFingerprint,
    assignmentFingerprint,
    ...parent,
    approvalStatus: "APPROVED",
    taxonomyVersion: masterSha,
    reviewEvidence: {
      status: "PASS",
      reference: "archive/data/evidence/review-q1.json",
      sha256: "b".repeat(64),
    },
  };
  const extraSeed = catalogSeed ? {
    questionUid: "qid_v1_" + "2".repeat(64),
    sourceFile: "original/middle/m3/1final/26_unregistered.js",
    sourceOrdinal: 1,
    catalogSeed: true,
    sourceGrade: "고1",
    courseKey: "공통수학1",
    L1: "RAW-seed",
    L2: "seed only",
  } : null;
  const catalog = {
      schemaVersion: "archive2-v1",
      indexVersion: "base-index",
      taxonomy: [parent],
      exams: [{ file: sourceFile, grade: "중3", qCount: 1 }],
      records: [row],
      sourceHashes: [[sourceFile, "c".repeat(64)]],
    };
  const links = {
    schemaVersion: "archive2-basic-scope-parent-links-v1",
    status: "DERIVED_READ_ONLY",
    authority: { sha256: masterSha },
    records: [],
    sourceParents: [],
    groups: [],
  };
  const projectionPolicy = {
    schemaVersion: "archive2-canonical-projection-policy-v1",
    version: "1.0.0",
    status: "ACTIVE",
    canonicalMasterSha256: masterSha,
    gradeCourseAllowlist: [{ grade: "중3", curriculumKey: "2022", courseKey: "M3-1" }],
    high1CompatibilityProjections: [],
    high23SharedSubjects: [],
  };
  const runtimePack = catalogSeed ? { status: "ACTIVE", packId: "H1_FOUNDATION", packVersion: "1.0.0", records: [{
      ...extraSeed,
      catalogSeed: extraSeed,
    }] } : { status: "ACTIVE", packId: "H1_FOUNDATION", packVersion: "1.0.0", records: [], taxonomyRows: [], ownedScopes: [] };
  const resources = Object.fromEntries(canonical.REQUIRED_INPUT_PATHS.map((path) => [path, {}]));
  for (const runtimePath of canonical.REQUIRED_INPUT_PATHS.filter((value) => value.startsWith("data/meta-foundation/runtime/")))
    resources[runtimePath] = { schemaVersion: "meta-foundation-runtime-overlay-v1", status: "ACTIVE", packId: runtimePath, packVersion: "test", records: [], taxonomyRows: [], ownedScopes: [], counts: {} };
  resources["data/archive2-catalog.json"] = catalog;
  resources[masterPath] = { records: [{
    curriculum: "2022",
    scope: "M3-1",
    majorUnit: parent.L1,
    midUnit: parent.L2,
    concepts: [],
  }] };
  resources["data/archive2-canonical-projection-policy.json"] = projectionPolicy;
  resources["data/archive2-item-review-overrides.json"] = {
    schemaVersion: "archive2-item-review-override-index-v1",
    status: "DERIVED_READ_ONLY",
    records: [],
  };
  resources["data/basic-scope-parent-links.json"] = links;
  resources["data/meta-foundation/compiled/taxonomy_registry.json"] = { status: "DERIVED_READ_ONLY", sourcePacks: [], problemTypes: [], templates: [] };
  resources["data/meta-foundation/compiled/curriculum_bindings.json"] = { status: "DERIVED_READ_ONLY", bindings: [] };
  resources["data/meta-foundation/runtime/h1-foundation-v1.json"] = runtimePack;
  return {
    assignmentEvidence: {
      taxonomyVersion: masterSha,
      assignmentsByUid: validAssignment ? { [uid]: [assignment] } : {},
      advancedAssignmentsByUid: {},
    },
    versionBundle: {
      projectionVersion: "archive2-canonical-v1:bundle-sha",
      files: { [masterPath]: { sha256: masterSha } },
      resources,
    },
  };
}

function packCatalog(catalog) {
  const columns = [...new Set(catalog.records.flatMap((record) => Object.keys(record)))];
  const strings = [];
  const ids = new Map();
  const encode = (value) => {
    if (typeof value !== "string") return value ?? null;
    if (!ids.has(value)) {
      ids.set(value, strings.length);
      strings.push(value);
    }
    return [ids.get(value)];
  };
  return {
    ...catalog,
    encoding: "column-dictionary-v1",
    columns,
    strings,
    records: catalog.records.map((record) => columns.map((column) => encode(record[column]))),
  };
}

test("catalog resolution does not promote raw labels into BASIC taxonomy or source-created cards", () => {
  assert.equal(typeof canonical.resolveCatalog, "function");
  const resolved = canonical.resolveCatalog(fixture({ validAssignment: false }));
  const row = resolved.records.find((candidate) => candidate.questionUid === uid);
  assert.equal(row.L1, "");
  assert.equal(row.L2, "");
  assert.equal(resolved.basicTaxonomy.some((candidate) => candidate.L1 === "RAW-legacy-only"), false);
  assert.equal(core.basicEligibility(row, { canonicalAuthority: resolved.canonicalAuthority }).ok, false);
});

test("only a fingerprint-bound assignment with current canonical membership attaches to its parent", () => {
  assert.equal(typeof canonical.resolveCatalog, "function");
  const resolved = canonical.resolveCatalog(fixture());
  const row = resolved.records.find((candidate) => candidate.questionUid === uid);
  assert.equal(row.sourceGrade, "중3");
  assert.equal(row.effectiveBrowseGrade, "중3");
  assert.equal(row.courseKey, parent.courseKey);
  assert.equal(row.L1, parent.L1);
  assert.equal(row.L2, parent.L2);
  assert.equal(core.basicEligibility(row, { canonicalAuthority: resolved.canonicalAuthority }).ok, true);
});

test("final resolver decodes the same packed catalog that browser and Worker deploy", () => {
  const input = fixture();
  input.versionBundle.resources["data/archive2-catalog.json"] =
    packCatalog(input.versionBundle.resources["data/archive2-catalog.json"]);
  const resolved = canonical.resolveCatalog(input);
  const row = resolved.records.find((candidate) => candidate.questionUid === uid);
  assert.equal(row.L1, parent.L1);
  assert.equal(row.L2, parent.L2);
});

test("catalogSeed cannot add an item without registered source grade and identity", () => {
  assert.equal(typeof canonical.resolveCatalog, "function");
  const resolved = canonical.resolveCatalog(fixture({ catalogSeed: true }));
  assert.equal(resolved.records.some((row) => row.sourceFile.endsWith("26_unregistered.js")), false);
});

test("workspace loads the shared canonical validator before core and runtime", () => {
  const html = fs.readFileSync(path.join(root, "archive/workspace.html"), "utf8");
  const canonicalScript = html.indexOf("archive2-canonical.js");
  const coreScript = html.indexOf("archive2-core.js");
  const runtimeScript = html.indexOf("meta-foundation-runtime.js");
  assert.ok(canonicalScript >= 0 && canonicalScript < coreScript && coreScript < runtimeScript);
});

test("Compose consumes only the resolved catalog from the verified version bundle", () => {
  const source = fs.readFileSync(path.join(root, "archive/archive2-workspace.js"), "utf8");
  assert.doesNotMatch(source, /fetch\(["']data\/archive2-catalog\.json/);
  assert.match(source, /applyArchiveMetaFoundationCatalog\(\)/);
});

test("browser runtime resolves the exact catalog and version bundle through the shared validator", async () => {
  const source = fs.readFileSync(path.join(root, "archive/meta-foundation-runtime.js"), "utf8");
  const baseUrl = "https://scope.test/AP------/archive/workspace.html";
  const window = { Archive2Core: core, Archive2Canonical: canonical };
  const fetcher = async (url) => {
    const pathname = decodeURIComponent(new URL(String(url)).pathname);
    let localPath;
    if (pathname.startsWith("/AP------/archive/"))
      localPath = path.join(root, "archive", pathname.slice("/AP------/archive/".length));
    else if (pathname.startsWith("/AP------/docs/"))
      localPath = path.join(root, "docs", pathname.slice("/AP------/docs/".length));
    else return new Response("not found", { status: 404 });
    if (!fs.existsSync(localPath)) return new Response("not found", { status: 404 });
    return new Response(fs.readFileSync(localPath));
  };
  vm.runInNewContext(source, {
    window,
    document: { baseURI: baseUrl },
    fetch: fetcher,
    URL,
    console,
  });
  await window.__META_FOUNDATION_RUNTIME_READY__;
  const finalCatalog = await window.applyArchiveMetaFoundationCatalog();
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-canonical-input-manifest.json"), "utf8"));
  assert.equal(finalCatalog.indexVersion, manifest.projectionVersion);
  assert.equal(window.ARCHIVE2_FINAL_CATALOG.indexVersion, manifest.projectionVersion);
  assert.equal(finalCatalog.records.length, core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json"), "utf8"))).records.length);
});

test("reviewed item override requires exact identity/fingerprint/evidence and preserves BASIC plus valid advanced capability", () => {
  const input = fixture({ validAssignment: false });
  const bundle = input.versionBundle;
  const catalog = bundle.resources["data/archive2-catalog.json"];
  const row = catalog.records[0];
  const reviewedFingerprint = "9".repeat(64);
  row.sourceFingerprint = "updated-answer-solution-only-full-hash";
  row.metadataAssignmentEvidence = {
    questionUid: uid,
    sourceFile,
    sourceOrdinal: 1,
    sourceFingerprint: reviewedFingerprint,
    assignmentFingerprint,
    metadataStatus: "approved_r2e_final",
    fieldStatus: { standardUnit: "approved_source", subUnit: "r2e_curriculum_binding" },
    evidenceRefs: ["archive/data/r2e-input/middle1/evidence/B29/REVIEW_LEDGER.json"],
    evidenceDigest: "6".repeat(64),
  };
  const runtimePath = "data/meta-foundation/runtime/middle1-v1.json";
  const runtime = bundle.resources[runtimePath];
  runtime.records = [{
    questionUid: uid,
    sourceArchiveFile: sourceFile,
    sourceOrdinal: 1,
    sourceFingerprint: reviewedFingerprint,
    curriculumKey: "2022",
    courseKey: "M3-1",
    standardUnitKey: "M3-01",
    subUnitKey: "M3-01-TEST",
    L1: parent.L1,
    L2: parent.L2,
    L3: "검증된 개념",
    L4: "검증된 유형",
    problemTypeKey: "PT_TEST",
    templateKey: "TPL_TEST",
    metaFoundationPackId: "MIDDLE1",
    metaFoundationPackVersion: "1.0.1",
    reviewStatus: "reviewed_pass",
    resolverEvidenceSha: "7".repeat(64),
  }];
  runtime.packId = "MIDDLE1";
  runtime.packVersion = "1.0.1";
  bundle.resources["data/meta-foundation/compiled/taxonomy_registry.json"] = {
    status: "DERIVED_READ_ONLY",
    sourcePacks: [{ packId: "MIDDLE1", version: "1.0.1" }],
    problemTypes: [{ problemTypeKey: "PT_TEST", status: "ACTIVE" }],
    templates: [{ templateKey: "TPL_TEST", parentProblemTypeKey: "PT_TEST", status: "ACTIVE" }],
  };
  bundle.resources["data/meta-foundation/compiled/curriculum_bindings.json"] = {
    bindings: [{ curriculum: "2022", standardUnitKey: "M3-01", subUnitKey: "M3-01-TEST", problemTypeKey: "PT_TEST" }],
  };
  const overridePath = `data/meta-foundation/evidence/review-overrides/v1/${uid}.json`;
  const override = {
    schemaVersion: "archive-review2-runtime-override/v1",
    questionUid: uid,
    sourceArchiveFile: sourceFile,
    sourceOrdinal: 1,
    sourceFingerprint: reviewedFingerprint,
    latestAcceptedReview2: {
      status: "REPAIR",
      runtimePackId: "MIDDLE1",
      decisionId: "R2E_test_q1",
      decisionReason: "독립 검수에서 현재 source solution을 대조하고 승인된 L1/L2/PT/TPL parent를 복구했다.",
      evidencePath: "work/r2e-state:test/R2E_META_RECEIPT.json",
      decisionAt: "2026-09-30",
    },
  };
  bundle.files["data/archive2-item-review-overrides.json"] = { sha256: "5".repeat(64) };
  bundle.resources["data/archive2-item-review-overrides.json"] = {
    schemaVersion: "archive2-item-review-override-index-v1",
    status: "DERIVED_READ_ONLY",
    records: [{
      ...override,
      evidenceReference: overridePath,
      evidenceSha256: "8".repeat(64),
    }],
  };
  const resolved = canonical.resolveCatalog(input);
  const final = resolved.records.find((candidate) => candidate.questionUid === uid);
  assert.equal(final.courseKey, parent.courseKey);
  assert.equal(final.L1, parent.L1);
  assert.equal(final.L2, parent.L2);
  assert.equal(final.L3, "검증된 개념");
  assert.equal(final.L4, "검증된 유형");
  assert.equal(core.basicEligibility(final, { canonicalAuthority: resolved.canonicalAuthority }).ok, true);
  assert.equal(core.advancedEligible(final, { canonicalAuthority: resolved.canonicalAuthority }), true);
});

test("built catalog has no production taxonomy fallback without a fingerprint-bound reviewed assignment", () => {
  const catalog = core.decodeCatalog(JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-catalog.json"), "utf8")));
  const unsupported = catalog.records.filter((row) => !row.assignmentEvidence &&
    [row.curriculumKey, row.courseKey, row.L1, row.L2].some(Boolean));
  assert.equal(unsupported.length, 0, "raw or legacy taxonomy must not remain on unverified production records");
  for (const row of catalog.records.filter((candidate) => candidate.assignmentEvidence)) {
    assert.equal(row.assignmentEvidence.questionUid, row.questionUid);
    assert.equal(row.assignmentEvidence.sourceFile, row.sourceFile);
    assert.equal(row.assignmentEvidence.sourceOrdinal, row.sourceOrdinal);
    assert.equal(row.assignmentEvidence.sourceFingerprint, row.assignmentFingerprint);
    assert.equal(row.assignmentEvidence.taxonomyVersion, catalog.canonicalMasterSha256);
    assert.equal(row.assignmentEvidence.approvalStatus, "APPROVED");
    assert.ok(row.assignmentEvidence.reviewEvidence?.reference);
    assert.match(row.assignmentEvidence.reviewEvidence?.sha256 || "", /^[a-f0-9]{64}$/i);
  }
  assert.ok(catalog.records.filter((row) => row.automatic).every((row) => row.assignmentEvidence));
});

test("reviewed item overrides are aggregated with source-file digests for one shared browser/Worker input", () => {
  const evidence = JSON.parse(fs.readFileSync(path.join(root, "archive/data/archive2-item-review-overrides.json"), "utf8"));
  assert.equal(evidence.schemaVersion, "archive2-item-review-override-index-v1");
  assert.ok(evidence.records.length > 0);
  for (const row of evidence.records) {
    assert.equal(row.questionUid, row.sourceFingerprint ? row.questionUid : "");
    assert.equal(row.evidenceReference, `data/meta-foundation/evidence/review-overrides/v1/${row.questionUid}.json`);
    assert.match(row.evidenceSha256, /^[a-f0-9]{64}$/i);
    assert.ok(row.latestAcceptedReview2?.decisionId);
  }
});

test("high1 curriculum projection uses exact version-bound allowlist entries and never RAW or M3 keys", () => {
  assert.equal(typeof canonical.resolveSubjectProjection, "function");
  const policy = {
    version: "1.0.0",
    canonicalMasterSha256: masterSha,
    gradeCourseAllowlist: [
      { grade: "고1", curriculumKey: "2015", courseKey: "수학(상)" },
      { grade: "고1", curriculumKey: "2022", courseKey: "공통수학1" },
    ],
    high1CompatibilityProjections: [{
      sourceGrade: "고1",
      sourceCurriculumKey: "2015",
      sourceCourseKey: "수학(상)",
      sourceUnitKey: "H15-SA-01",
      projectionKey: "COMMON_MATH_1",
      targetCurriculumKey: "2022",
      targetCourseKey: "공통수학1",
      approvalStatus: "APPROVED",
      evidenceReference: "docs/rules/approved-h1-equivalence-v1.json",
      evidenceSha256: "c".repeat(64),
      taxonomyVersion: masterSha,
    }],
    high23SharedSubjects: [],
  };
  assert.equal(canonical.resolveSubjectProjection({
    sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", standardUnitKey: "H15-SA-01",
  }, policy), "COMMON_MATH_1");
  assert.equal(canonical.resolveSubjectProjection({
    sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", standardUnitKey: "H15-SA-99",
  }, policy), "H1_2015_MATH_UP");
  assert.equal(canonical.resolveSubjectProjection({
    sourceGrade: "중3", effectiveBrowseGrade: "고1", legacyStandardUnitKey: "M3-04", sourceFile,
  }, policy), "");
  assert.equal(canonical.resolveSubjectProjection({
    sourceGrade: "고1", curriculumKey: "2015", legacyStandardUnitKey: "RAW-다항식",
  }, policy), "");
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "중3", effectiveBrowseGrade: "고1", legacyStandardUnitKey: "M3-04",
  }, "고1", policy), "");
  assert.equal(core.subjectProjectionForRecord({
    sourceGrade: "고1", curriculumKey: "2015", courseKey: "수학(상)", standardUnitKey: "H15-SA-99",
  }, "고1", policy), "H1_2015_MATH_UP");
});

test("input bundle rejects mixed bytes, an old browser version, and missing canonical authority", async (t) => {
  assert.equal(typeof canonical.loadInputBundle, "function");
  assert.equal(typeof canonical.computeProjectionVersion, "function");
  const payload = "{\"status\":\"DERIVED_READ_ONLY\"}";
  const baseUrl = "https://apmath.test/AP------/archive/workspace.html";
  const payloads = new Map(canonical.MANIFEST_REQUIRED_PATHS.map((path) => [path, path === masterPath ? payload : "{}"]));
  const unneededEvidencePath = "data/meta-foundation/evidence/unneeded-runtime-input.json";
  const referencedEvidencePath = "data/meta-foundation/evidence/runtime-source.json";
  payloads.set(canonical.RUNTIME_INPUT_PATHS[0], JSON.stringify({
    generatedFrom: { reviewedEvidence: "archive/" + referencedEvidencePath },
  }));
  payloads.set(referencedEvidencePath, JSON.stringify({ evidence: "required for full digest membership" }));
  payloads.set(unneededEvidencePath, JSON.stringify({ evidence: "digest-bound, not resolver-loaded" }));
  const files = [...payloads].map(([path, value]) => ({
    path,
    sha256: crypto.createHash("sha256").update(value).digest("hex"),
  }));
  const projectionVersion = await canonical.computeProjectionVersion(files);
  const changedEvidenceDigests = files.map(file => file.path === unneededEvidencePath
    ? { ...file, sha256: "f".repeat(64) }
    : file);
  assert.notEqual(await canonical.computeProjectionVersion(changedEvidenceDigests), projectionVersion,
    "non-runtime authority digests remain part of the projection version");
  const manifest = {
    schemaVersion: "archive2-canonical-input-manifest-v1",
    resolverVersion: canonical.RESOLVER_VERSION,
    projectionVersion,
    files,
  };
  const manifestUrl = new URL("data/archive2-canonical-input-manifest.json", baseUrl).href;
  const contents = new Map([[manifestUrl, JSON.stringify(manifest)]]);
  for (const [path, value] of payloads)
    contents.set(new URL(path, baseUrl).href, value);
  const masterUrl = new URL(masterPath, baseUrl).href;
  const requestedPaths = [];
  const fetcher = async (url) => {
    requestedPaths.push(new URL(String(url)).pathname);
    const value = contents.get(new URL(String(url)).href);
    return value === undefined ? new Response("missing", { status: 404 }) : new Response(value);
  };
  const bundle = await canonical.loadInputBundle(fetcher, baseUrl);
  assert.equal(bundle.projectionVersion, projectionVersion);
  assert.ok(bundle.files[unneededEvidencePath], "the evidence digest remains in the full input commitment");
  assert.equal(Object.hasOwn(bundle.resources, unneededEvidencePath), false);
  assert.equal(requestedPaths.includes(new URL(unneededEvidencePath, baseUrl).pathname), false,
    "runtime bootstrap must not fetch digest-only evidence files");
  await t.test("stale browser", async () => {
    await assert.rejects(
      canonical.loadInputBundle(fetcher, baseUrl, "archive2-canonical-v1:old"),
      (error) => error.code === "CANONICAL_PROJECTION_REFRESH_REQUIRED",
    );
  });
  await t.test("stale resolver code", async () => {
    contents.set(manifestUrl, JSON.stringify({ ...manifest, resolverVersion: "0.9.0" }));
    await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl), (error) => error.code === "CANONICAL_RESOLVER_VERSION_MISMATCH");
    contents.set(manifestUrl, JSON.stringify(manifest));
  });
  await t.test("incomplete manifest", async () => {
    const incompleteFiles = files.filter((file) => file.path !== "data/basic-scope-parent-links.json");
    const incomplete = {
      ...manifest,
      files: incompleteFiles,
      projectionVersion: await canonical.computeProjectionVersion(incompleteFiles),
    };
    contents.set(manifestUrl, JSON.stringify(incomplete));
    await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl), (error) => error.code === "CANONICAL_AUTHORITY_UNAVAILABLE");
    contents.set(manifestUrl, JSON.stringify(manifest));
  });
  await t.test("missing digest-only generatedFrom evidence", async () => {
    const withoutEvidence = files.filter((file) => file.path !== referencedEvidencePath);
    const incomplete = {
      ...manifest,
      files: withoutEvidence,
      projectionVersion: await canonical.computeProjectionVersion(withoutEvidence),
    };
    contents.set(manifestUrl, JSON.stringify(incomplete));
    await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl),
      (error) => error.code === "CANONICAL_AUTHORITY_UNAVAILABLE");
    contents.set(manifestUrl, JSON.stringify(manifest));
  });
  await t.test("mixed file bytes", async () => {
    contents.set(masterUrl, "{}\n");
    await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl), (error) => error.code === "CANONICAL_INPUT_DIGEST_MISMATCH");
  });
  await t.test("missing master", async () => {
    contents.set(masterUrl, payload);
    contents.delete(masterUrl);
    await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl), (error) => error.code === "CANONICAL_AUTHORITY_UNAVAILABLE");
  });
});

test("runtime canonical bootstrap keeps all 57 authority digests while fetching only resolver inputs", async () => {
  const archiveDir = path.join(root, "archive");
  const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, "data/archive2-canonical-input-manifest.json"), "utf8"));
  const baseUrl = "https://apmath.test/AP------/archive/workspace.html";
  const requested = [];
  const fetcher = async (url) => {
    const pathname = decodeURIComponent(new URL(String(url)).pathname);
    const relative = pathname.replace(/^\/AP------\//, "");
    const file = path.resolve(root, relative);
    const fromRoot = path.relative(root, file);
    requested.push(relative);
    if (fromRoot.startsWith("..") || path.isAbsolute(fromRoot) || !fs.existsSync(file))
      return new Response("missing", { status: 404 });
    return new Response(fs.readFileSync(file), { status: 200 });
  };

  const bundle = await canonical.loadInputBundle(fetcher, baseUrl);
  assert.equal(manifest.files.length, 57);
  assert.equal(bundle.projectionVersion, manifest.projectionVersion);
  assert.equal(Object.keys(bundle.files).length, manifest.files.length,
    "projection version remains bound to every manifest digest");
  assert.equal(Object.keys(bundle.resources).length, canonical.REQUIRED_INPUT_PATHS.length);
  assert.equal(requested.length, canonical.REQUIRED_INPUT_PATHS.length + 1,
    "only the manifest and resolver inputs are fetched");
  assert.ok(requested.length < manifest.files.length + 1);
  assert.equal(requested.includes("archive/data/question_metadata.json"), false);
  assert.equal(requested.includes("archive/data/question_identity_map.json"), false);
});
