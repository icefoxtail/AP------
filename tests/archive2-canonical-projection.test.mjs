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
const { readWorkspace } = require("./helpers/archive2-workspace-source.cjs");
const canonical = require("../archive/archive2-canonical.js");
const archiveSource = require("../archive/archive2-source.js");
const ProblemBankMeta = require("../archive/problem-bank-meta.js");
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

// Exercise the real synchronous test loader with in-memory manifest inputs.
// Non-JSON dependencies retain exactly the builder's digest and version rules.
function scopeHarnessFixture() {
  const archiveDir = path.join(root, "archive");
  const raw = new Map([
    ["data/synthetic-resolver.json", Buffer.from('\uFEFF{\r\n"synthetic":true\r\n}\r\n')],
    ["../docs/operations/synthetic/given.png", Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 255, 128])],
    ["assets/images/synthetic.svg", Buffer.from('<svg><path d="M0 0"/></svg>\r\n')],
    ["exams/synthetic.js", Buffer.from('window.questionBank = [];\r\n')],
  ]);
  const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
  const normalized = bytes => bytes.toString("utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const files = [...raw].map(([path, bytes]) => ({ path, sha256: digest(normalized(bytes)) }));
  const manifest = { resolverVersion: canonical.RESOLVER_VERSION, files };
  manifest.projectionVersion = "archive2-canonical-v1:" + digest(JSON.stringify({
    resolverVersion: manifest.resolverVersion,
    files: files.slice().sort((a, b) => a.path.localeCompare(b.path)),
  }));
  const harnessSource = fs.readFileSync(path.join(root, "tests/helpers/archive2-scope-harness.cjs"), "utf8");
  const run = () => {
    const fakeFs = { readFileSync(file, encoding) {
      let bytes;
      if (file === path.join(archiveDir, "data/archive2-canonical-input-manifest.json"))
        bytes = Buffer.from(JSON.stringify(manifest));
      else {
        const entry = [...raw].find(([relative]) => path.resolve(archiveDir, relative) === file);
        if (!entry) throw new Error("SYNTHETIC_DEPENDENCY_MISSING");
        bytes = entry[1];
      }
      return encoding ? bytes.toString(encoding) : bytes;
    } };
    const module = { exports: {} };
    vm.runInNewContext(harnessSource, {
      __dirname: path.join(root, "tests/helpers"), module, Buffer,
      require(name) {
        if (name === "node:fs") return fakeFs;
        if (name === "../../archive/archive2-core.js")
          return { Canonical: { resolveCatalog: ({ versionBundle }) => versionBundle } };
        return require(name);
      },
    }, { filename: "archive2-scope-harness.cjs", timeout: 1000 });
    return module.exports.catalog;
  };
  return { raw, manifest, digest, normalized, run };
}

test("scope harness verifies PNG/SVG/JS dependencies without treating them as JSON resources", () => {
  const fixture = scopeHarnessFixture(), result = fixture.run();
  assert.equal(result.projectionVersion, fixture.manifest.projectionVersion);
  assert.deepEqual(Object.keys(result.resources), ["data/synthetic-resolver.json"]);
  assert.equal(result.resources["data/synthetic-resolver.json"].synthetic, true);
  assert.deepEqual(Object.keys(result.files).sort(), [...fixture.raw.keys()].sort());
  for (const entry of fixture.manifest.files) assert.equal(result.files[entry.path].sha256, entry.sha256);
});

for (const file of ["../docs/operations/synthetic/given.png", "assets/images/synthetic.svg", "exams/synthetic.js"]) {
  test(`scope harness rejects changed digest-only dependency ${path.extname(file)}`, () => {
    const fixture = scopeHarnessFixture();
    fixture.raw.set(file, Buffer.concat([fixture.raw.get(file), Buffer.from("SYNTHETIC_CHANGE")]));
    assert.throws(fixture.run, /Archive2 test input digest mismatch/);
  });
  test(`scope harness rejects missing digest-only dependency ${path.extname(file)}`, () => {
    const fixture = scopeHarnessFixture(); fixture.raw.delete(file);
    assert.throws(fixture.run, /SYNTHETIC_DEPENDENCY_MISSING/);
  });
}

test("scope harness keeps malformed JSON rejection even when its digest is correct", () => {
  const fixture = scopeHarnessFixture(), file = "data/synthetic-resolver.json";
  fixture.raw.set(file, Buffer.from("{ malformed JSON"));
  fixture.manifest.files.find(row => row.path === file).sha256 = fixture.digest(fixture.raw.get(file));
  assert.throws(fixture.run, /JSON/);
});

test("scope harness refuses a binary body renamed as a JSON resolver resource", () => {
  const fixture = scopeHarnessFixture(), file = "data/synthetic-resolver.json";
  const bytes = fixture.raw.get("../docs/operations/synthetic/given.png");
  fixture.raw.set(file, bytes);
  fixture.manifest.files.find(row => row.path === file).sha256 = fixture.digest(fixture.normalized(bytes));
  assert.throws(fixture.run, /JSON/);
});

test("scope harness binds a non-JSON dependency digest into the complete projection version", () => {
  const fixture = scopeHarnessFixture(), file = "../docs/operations/synthetic/given.png";
  const bytes = Buffer.concat([fixture.raw.get(file), Buffer.from("RESEALED_SYNTHETIC_CHANGE")]);
  fixture.raw.set(file, bytes);
  fixture.manifest.files.find(row => row.path === file).sha256 = fixture.digest(fixture.normalized(bytes));
  assert.throws(fixture.run, /Archive2 test manifest version mismatch/);
});

test("scope harness refuses removal of a dependency from the committed manifest", () => {
  const fixture = scopeHarnessFixture(); fixture.manifest.files.pop();
  assert.throws(fixture.run, /Archive2 test manifest version mismatch/);
});

function canonicalLoaderBoundary(kind) {
  const fixture = scopeHarnessFixture(), archiveDir = path.join(root, "archive");
  const fakeFs = { readFileSync(file, encoding) {
    let bytes;
    if (file === path.join(archiveDir, "data/archive2-canonical-input-manifest.json"))
      bytes = Buffer.from(JSON.stringify(fixture.manifest));
    else {
      const entry = [...fixture.raw].find(([relative]) => path.resolve(archiveDir, relative) === file);
      if (!entry) throw new Error("SYNTHETIC_DEPENDENCY_MISSING");
      bytes = entry[1];
    }
    return encoding ? bytes.toString(encoding) : bytes;
  } };
  const run = async () => {
    if (kind === "readiness") {
      const relative = "archive/tools/meta-foundation/refresh-runtime-source-readiness.mjs";
      const source = fs.readFileSync(path.join(root, relative), "utf8");
      const start = source.indexOf("const archiveRoot ="), end = source.indexOf("const catalog =");
      assert.ok(start > 0 && end > start, "exercise the actual readiness loader before catalog resolution");
      const code = source.slice(start, end).replaceAll("import.meta.url", JSON.stringify(new URL("../" + relative, import.meta.url).href));
      return vm.runInNewContext(code + "\n({files,resources,projectionVersion});", {
        fs: fakeFs, path, crypto, Buffer, fileURLToPath, core: { normalizeFile: value => value },
      }, { filename: relative, timeout: 1000 });
    }
    const relative = "archive/tools/report-archive2-canonical-impact.mjs";
    const source = fs.readFileSync(path.join(root, relative), "utf8");
    const start = source.indexOf("async function loadFinalCatalog("), end = source.indexOf("export async function buildImpactReport(");
    assert.ok(start > 0 && end > start, "exercise the complete actual impact-report loader");
    return vm.runInNewContext(source.slice(start, end) + "\nloadFinalCatalog(root);", {
      fs: fakeFs, path, Buffer, root, sha256: fixture.digest,
      core: { Canonical: { computeProjectionVersion: canonical.computeProjectionVersion,
        resolveCatalog: ({ versionBundle }) => versionBundle } },
    }, { filename: relative, timeout: 1000 });
  };
  return { ...fixture, run };
}

for (const kind of ["readiness", "impact-report"]) {
  test(`canonical manifest ${kind} loader verifies binary/source dependencies and parses only JSON`, async () => {
    const fixture = canonicalLoaderBoundary(kind), result = await fixture.run();
    assert.equal(result.projectionVersion, fixture.manifest.projectionVersion);
    assert.deepEqual(Object.keys(result.resources), ["data/synthetic-resolver.json"]);
    assert.deepEqual(Object.keys(result.files).sort(), [...fixture.raw.keys()].sort());
  });
  for (const file of ["../docs/operations/synthetic/given.png", "assets/images/synthetic.svg", "exams/synthetic.js"]) {
    test(`canonical manifest ${kind} loader rejects changed ${path.extname(file)} bytes`, async () => {
      const fixture = canonicalLoaderBoundary(kind);
      fixture.raw.set(file, Buffer.concat([fixture.raw.get(file), Buffer.from("SYNTHETIC_CHANGE")]));
      await assert.rejects(fixture.run, /canonical input digest mismatch/);
    });
    test(`canonical manifest ${kind} loader rejects missing ${path.extname(file)} bytes`, async () => {
      const fixture = canonicalLoaderBoundary(kind); fixture.raw.delete(file);
      await assert.rejects(fixture.run, /SYNTHETIC_DEPENDENCY_MISSING/);
    });
  }
  test(`canonical manifest ${kind} loader binds resealed binary digests into its projection version`, async () => {
    const fixture = canonicalLoaderBoundary(kind), file = "../docs/operations/synthetic/given.png";
    const bytes = Buffer.concat([fixture.raw.get(file), Buffer.from("RESEALED_CHANGE")]);
    fixture.raw.set(file, bytes); fixture.manifest.files.find(row => row.path === file).sha256 = fixture.digest(fixture.normalized(bytes));
    await assert.rejects(fixture.run, /projection version mismatch/);
  });
  test(`canonical manifest ${kind} loader still rejects malformed JSON with a matching digest`, async () => {
    const fixture = canonicalLoaderBoundary(kind), file = "data/synthetic-resolver.json";
    const bytes = Buffer.from("{ malformed JSON"); fixture.raw.set(file, bytes);
    fixture.manifest.files.find(row => row.path === file).sha256 = fixture.digest(bytes);
    await assert.rejects(fixture.run, /JSON/);
  });
}

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
  assert.equal(row.currentSourceJsSha256, 'c'.repeat(64));
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
  const source = readWorkspace();
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
    const body = fs.readFileSync(localPath, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    return new Response(body);
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

test("META_PIPELINE_AUDIT registration receipt binds its approved metadata into the canonical consumer", () => {
  const input = fixture({ validAssignment: false });
  const { versionBundle } = input;
  const resources = versionBundle.resources;
  const source = resources["data/archive2-catalog.json"].records[0];
  const requestId = "meta-pipeline-consumer-fixture";
  const proofPath = `data/meta-foundation/evidence/reviewed-exam-meta/v1/${requestId}.json`;
  const receiptSha = "b".repeat(64);
  const metadataRevision = `meta-foundation:TEST@1.0.0:exam-meta_pipeline_audit-v2:${requestId}`;
  const assignment = {
    questionUid: uid,
    sourceArchiveFile: sourceFile,
    sourceOrdinal: 1,
    sourceFingerprint,
    contentFingerprint: assignmentFingerprint,
    metadataStatus: "approved_semantic_review",
    metadataRevision,
    reviewStatus: "reviewed_pass",
    level: "중",
    fieldStatus: { standardUnit: "approved_meta_pipeline_audit", subUnit: "approved_meta_pipeline_audit" },
    evidenceRefs: [`archive/${proofPath}`],
    evidenceDigest: "d".repeat(64),
    curriculumKey: parent.curriculumKey,
    courseKey: parent.courseKey,
    L1: parent.L1,
    L2: parent.L2,
    standardCourse: parent.courseKey,
    standardUnitKey: "M3-01",
    subUnitKey: "M3-01-TEST",
    standardUnit: "검증 단원",
    subUnit: "검증 세부단원",
    problemTypeKey: "PT_META_TEST",
    templateKey: "TPL_META_TEST",
    L3: "검증된 개념",
    L4: "검증된 유형",
    crossConceptKeys: [],
    conditionKeys: [],
    integrationPattern: null,
    difficultyBucket: null,
  };

  Object.assign(source, {
    curriculumKey: "",
    courseKey: "",
    L1: "",
    L2: "",
    metadataRevision,
    metadataAssignmentEvidence: {
      questionUid: uid,
      sourceFile: sourceFile,
      sourceOrdinal: 1,
      sourceFingerprint,
      assignmentFingerprint,
      metadataStatus: assignment.metadataStatus,
      metadataRevision,
      fieldStatus: assignment.fieldStatus,
      evidenceRefs: assignment.evidenceRefs,
      evidenceDigest: assignment.evidenceDigest,
    },
  });
  const runtime = resources["data/meta-foundation/runtime/h1-foundation-v1.json"];
  runtime.packId = "META_PIPELINE_TEST";
  runtime.packVersion = "1.0.0";
  runtime.generatedFrom = { [`reviewedExam_${requestId}`]: `archive/${proofPath}` };
  runtime.records = [{ ...assignment, metaFoundationPackId: runtime.packId, metaFoundationPackVersion: runtime.packVersion }];
  resources["data/meta-foundation/compiled/taxonomy_registry.json"] = {
    status: "DERIVED_READ_ONLY",
    sourcePacks: [{ packId: runtime.packId, version: runtime.packVersion }],
    problemTypes: [{ problemTypeKey: "PT_META_TEST", status: "ACTIVE" }],
    templates: [{ templateKey: "TPL_META_TEST", parentProblemTypeKey: "PT_META_TEST", status: "ACTIVE" }],
  };
  resources["data/meta-foundation/compiled/curriculum_bindings.json"] = {
    bindings: [{ curriculum: parent.curriculumKey, standardUnitKey: "M3-01", subUnitKey: "M3-01-TEST", problemTypeKey: "PT_META_TEST" }],
  };
  resources[proofPath] = {
    schemaVersion: "archive-reviewed-exam-meta-registration-v2",
    metadataRegistrationStatus: "REGISTERED",
    sourceArchiveFile: sourceFile,
    sourceRawSha256: "c".repeat(64),
    totalQuestions: 1,
    approval: { type: "META_PIPELINE_AUDIT", metadataReviewed: true, approvedBy: "META_PIPELINE_UNIFIED_AUTHOR" },
    appliedRecords: [assignment],
  };
  versionBundle.files[proofPath] = { sha256: receiptSha };

  const resolved = canonical.resolveCatalog(input);
  const final = resolved.records.find((candidate) => candidate.questionUid === uid);
  assert.equal(final.curriculumKey, parent.curriculumKey);
  assert.equal(final.courseKey, parent.courseKey);
  assert.equal(final.L1, parent.L1);
  assert.equal(final.L2, parent.L2);
  assert.equal(final.level, "중");
  assert.equal(final.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
  assert.equal(final.sourceReviewStatus, undefined);
  assert.equal(core.basicEligibility(final, { canonicalAuthority: resolved.canonicalAuthority }).ok, true);
  const page = ProblemBankMeta.buildIndex([{ ...final, currentSourceJsSha256: "c".repeat(64) }], [])[0];
  assert.equal(page.L1, parent.L1);
  assert.equal(page.L2, parent.L2);
  assert.equal(page.L3, "검증된 개념");
  assert.equal(page.L4, "검증된 유형");
  assert.equal(page.level, "중");

  // A completed metadata audit may bind its classification while the separate
  // original-exam review remains required. Do not manufacture a QA pass.
  const auditFields = Object.fromEntries(
    ["standardUnit", "subUnit", "concept", "problemType", "template", "crossConcept"]
      .map(field => [field, "approved_meta_pipeline_audit"]),
  );
  assignment.reviewStatus = "review_required";
  assignment.metadataApprovalType = "META_PIPELINE_AUDIT";
  assignment.fieldStatus = auditFields;
  source.reviewStatus = "review_required";
  source.metadataAssignmentEvidence.fieldStatus = { ...auditFields };
  runtime.records[0] = { ...assignment, metaFoundationPackId: runtime.packId, metaFoundationPackVersion: runtime.packVersion };
  resources[proofPath].examFinalQaStatus = "NOT_EVALUATED_BY_REGISTRAR";
  const audited = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.equal(audited.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
  assert.equal(audited.reviewStatus, "review_required");
  assert.equal(audited.standardUnitKey, assignment.standardUnitKey);
  const sourceCrossRef = { path: "archive/data/meta-foundation/evidence/source-cross.json", sha256: "e".repeat(64) };
  resources[proofPath].approval.metaPipelineAudit = { sourceCrossConceptCorrectionRef: sourceCrossRef };
  assignment.fieldStatus.crossConcept = "approved_source_and_meta_pipeline_audit";
  assignment.approvalEvidence = [sourceCrossRef.path];
  source.metadataAssignmentEvidence.fieldStatus.crossConcept = assignment.fieldStatus.crossConcept;
  source.metadataAssignmentEvidence.evidenceRefs.push(sourceCrossRef.path);
  runtime.records[0] = { ...assignment, metaFoundationPackId: runtime.packId, metaFoundationPackVersion: runtime.packVersion };
  const withSourceCross = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.equal(withSourceCross.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
  source.metadataAssignmentEvidence.evidenceRefs.pop();
  const missingSourceCrossProof = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(missingSourceCrossProof.canonicalAssignmentReasons.includes("assignment_missing"));
  assignment.fieldStatus.crossConcept = "approved_meta_pipeline_audit";
  source.metadataAssignmentEvidence.fieldStatus.crossConcept = "approved_meta_pipeline_audit";
  runtime.records[0] = { ...assignment, metaFoundationPackId: runtime.packId, metaFoundationPackVersion: runtime.packVersion };
  delete resources[proofPath].approval.metaPipelineAudit;
  source.metadataAssignmentEvidence.fieldStatus.template = "manual_review_pending";
  const held = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(held.canonicalAssignmentReasons.includes("assignment_missing"));
  source.metadataAssignmentEvidence.fieldStatus.template = "approved_meta_pipeline_audit";
  resources[proofPath].examFinalQaStatus = "PASS";
  const falseQa = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(falseQa.canonicalAssignmentReasons.includes("assignment_missing"));
  resources[proofPath].examFinalQaStatus = "NOT_EVALUATED_BY_REGISTRAR";
  runtime.records[0].metadataApprovalType = "REVIEW2";
  const wrongApproval = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(wrongApproval.canonicalAssignmentReasons.includes("assignment_missing"));
  runtime.records[0].metadataApprovalType = "META_PIPELINE_AUDIT";
  // The receipt is bound per row (stem + choices), not to the whole exam file: a receipt naming other whole-file bytes keeps the row while the
  // row's binding holds, and the row is dropped only when that binding is not confirmed.
  resources[proofPath].sourceRawSha256 = "e".repeat(64);
  const otherFileBytes = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.equal(otherFileBytes.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
  const registeredContentFingerprint = source.assignmentFingerprint, registeredSourceStatus = source.sourceStatus;
  source.assignmentFingerprint = "d".repeat(64); // the current stem/choices/figure differ from the registered ones
  source.sourceStatus = "HOLD";
  const unconfirmed = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(unconfirmed.canonicalAssignmentReasons.includes("assignment_missing"), "a changed row without a confirmed binding is dropped");
  source.sourceStatus = "VERIFIED"; // the catalog builder confirmed the same stem+choices (text-v1 row binding, e.g. a reviewed rebind)
  const rebound = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.equal(rebound.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT", "a confirmed binding keeps the registration");
  assert.equal(rebound.assignmentFingerprint, "d".repeat(64), "the assignment binds the current fingerprint");
  const registeredMetaFingerprint = source.metadataAssignmentEvidence.assignmentFingerprint;
  source.metadataAssignmentEvidence.assignmentFingerprint = "c".repeat(64); // the metadata row is not the one this receipt registered
  const otherRow = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
  assert.ok(otherRow.canonicalAssignmentReasons.includes("assignment_missing"));
  source.metadataAssignmentEvidence.assignmentFingerprint = registeredMetaFingerprint;
  source.assignmentFingerprint = registeredContentFingerprint;
  source.sourceStatus = registeredSourceStatus;

  // Native evidence names exact file bytes, while browser loading deliberately
  // normalizes BOM/CRLF. Equal JavaScript text is not equal approval bytes.
  const sourceCatalog = resources["data/archive2-catalog.json"];
  const normalized = "window.questionBank = [];\n";
  const sha = value => crypto.createHash("sha256").update(value).digest("hex");
  sourceCatalog.sourceHashes = [[sourceFile, sha(normalized)]];
  for (const raw of [normalized.replace(/\n/g, "\r\n"), "\uFEFF" + normalized]) {
    const rawSha = sha(Buffer.from(raw, "utf8"));
    assert.notEqual(rawSha, sha(normalized));
    resources[proofPath].sourceRawSha256 = rawSha;
    sourceCatalog.sourceRawHashes = [[sourceFile, rawSha]];
    const approved = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
    assert.equal(approved.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
    assert.equal(approved.reviewedExamRegistration.sourceJsSha256, sha(normalized), "browser-facing hash is unchanged");
    const pageRow = ProblemBankMeta.buildIndex([{ ...approved, currentSourceJsSha256: sha(normalized) }], [])[0];
    assert.equal(pageRow.L3, "검증된 개념");

    // Raw bytes are no longer a gate for a row: a different or missing raw hash entry keeps a row whose binding holds.
    sourceCatalog.sourceRawHashes = [];
    const missingRaw = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
    assert.equal(missingRaw.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
    sourceCatalog.sourceRawHashes = [[sourceFile, sha(raw + " ")]];
    const alteredRaw = canonical.resolveCatalog(input).records.find(row => row.questionUid === uid);
    assert.equal(alteredRaw.assignmentEvidence.reviewEvidence.approvalType, "META_PIPELINE_AUDIT");
  }
  for (const invalid of [null, [[sourceFile, "bad-sha"]], [["other-file.js", "a".repeat(64)]],
    [[sourceFile, "a".repeat(64)], [sourceFile, "b".repeat(64)]]]) {
    sourceCatalog.sourceRawHashes = invalid;
    assert.throws(() => canonical.resolveCatalog(input), /catalog raw source hash/);
  }
});

test("browser source loading retains normalized hashes for CRLF and BOM files", async () => {
  const normalized = 'window.questionBank = [{id: 1, content: "fixture", choices: [], answer: "a", solution: "s"}];\n';
  const sha = value => crypto.createHash("sha256").update(value).digest("hex");
  for (const [index, raw] of [normalized.replace(/\n/g, "\r\n"), "\uFEFF" + normalized].entries()) {
    const file = `original/middle/m3/1final/raw-hash-fixture-${index}.js`;
    const options = { baseUrl: "https://archive.test/archive/", fetcher: async () => new Response(raw) };
    const bank = await archiveSource.load(file, sha(normalized), options);
    assert.equal(bank.length, 1);
    assert.equal(bank[0].content, "fixture");
    await assert.rejects(() => archiveSource.load(file, sha(Buffer.from(raw, "utf8")), options), /원본 파일이 변경/);
  }
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
  const payload = "{\"status\":\"DERIVED_READ_ONLY\"}\n";
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
  await t.test("CRLF transport normalizes to the same canonical input bytes", async () => {
    contents.set(masterUrl, payload.replace(/\n/g, "\r\n"));
    assert.equal((await canonical.loadInputBundle(fetcher, baseUrl)).projectionVersion, projectionVersion);
    contents.set(masterUrl, payload);
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

test("runtime canonical bootstrap keeps all authority digests including source verification while fetching only resolver inputs", async () => {
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
    const body = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    return new Response(body, { status: 200 });
  };

  const bundle = await canonical.loadInputBundle(fetcher, baseUrl);
  const resolverInputPaths = new Set([
    ...canonical.REQUIRED_INPUT_PATHS,
    ...canonical.runtimeInputPathsFromManifest(manifest.files),
  ]);
  const registrationProofPaths = canonical.reviewedRegistrationProofPaths(
    canonical.runtimeInputPathsFromManifest(manifest.files).map((inputPath) => bundle.resources[inputPath]),
  );
  const fetchedInputPaths = new Set([...resolverInputPaths, ...registrationProofPaths]);
  assert.ok(manifest.files.length > canonical.REQUIRED_INPUT_PATHS.length,
    "the manifest retains authority digests beyond the resolver inputs fetched at runtime");
  assert.equal(bundle.projectionVersion, manifest.projectionVersion);
  assert.equal(Object.keys(bundle.files).length, manifest.files.length,
    "projection version remains bound to every manifest digest");
  assert.ok(bundle.files[canonical.SOURCE_VERIFICATION_INDEX_PATH],
    "the source verification index digest is part of the current projection");
  assert.equal(Object.keys(bundle.resources).length, fetchedInputPaths.size);
  assert.equal(requested.length, fetchedInputPaths.size + 1,
    "only the manifest, resolver inputs, and their reviewed registration proofs are fetched");
  assert.equal(requested.includes(`archive/${canonical.SOURCE_VERIFICATION_INDEX_PATH}`), false,
    "the full resolver does not download the source index unless its lookup path is used");
  assert.ok(requested.length < manifest.files.length + 1);
  assert.equal(requested.includes("archive/data/question_metadata.json"), false);
  assert.equal(requested.includes("archive/data/question_identity_map.json"), false);
});

test("canonical manifest digests use stable LF authority bytes in CRLF worktrees", () => {
  const archiveDir = path.join(root, "archive");
  const manifest = JSON.parse(fs.readFileSync(path.join(archiveDir, "data/archive2-canonical-input-manifest.json"), "utf8"));
  for (const entry of manifest.files) {
    const file = path.resolve(archiveDir, entry.path);
    const canonicalText = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
    const digest = crypto.createHash("sha256").update(canonicalText).digest("hex");
    assert.equal(digest, entry.sha256, entry.path);
  }
});

// The UID/parent tuple is the existing E023 Q21 approval. All hashes and receipt
// bytes below are synthetic contract inputs, never a claim about an unissued
// source-preservation request on main.
function issuedM2ParentFixture() {
  const input = fixture({ validAssignment: false });
  const resources = input.versionBundle.resources;
  const targetUid = "qid_v1_1042e4bc1d8ffa66ef5d65438e878ade2ec52b168772bfaa3f514f6b94078ea3";
  const file = "original/middle/m2/2final/23_연향중_2학기_기말_중2_기출.js";
  const target = { grade: "중2", curriculumKey: "2015", courseKey: "M2-2",
    standardUnitKey: "M2-05", subUnitKey: "M2-05-TRIANGLE_PROPERTIES",
    L1: "삼각형의 성질", L2: "삼각형의 외심과 내심" };
  const proofPath = "data/meta-foundation/evidence/reviewed-exam-meta/v1/issued-m2-parent-fixture.json";
  const revision = "meta-foundation:MIDDLE_GEOMETRY@1.0.0:exam-final_qa-v2:issued-m2-parent-fixture";
  const accepted = {
    questionUid: targetUid, sourceArchiveFile: file, sourceOrdinal: 21, ...target,
    sourceFingerprint, contentFingerprint: assignmentFingerprint,
    metadataStatus: "approved_semantic_review", metadataApprovalType: "FINAL_QA", metadataRevision: revision,
    reviewStatus: "reviewed_pass", level: "중", difficultyBucket: 2,
    difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL",
    standardCourse: "중2 수학", standardUnit: "삼각형의 성질", subUnit: "삼각형의 성질",
    L3: "검증된 개념", L4: "검증된 유형", problemTypeKey: "PT_ISSUED_PARENT", templateKey: "TPL_ISSUED_PARENT",
    crossConceptKeys: [], secondaryConceptKeys: [], conditionKeys: [], integrationPattern: "NONE",
    curriculumApplicability: "BOTH", defaultSelectable: false,
    fieldStatus: Object.fromEntries(["standardUnit", "subUnit", "problemType", "template", "difficulty", "crossConcept", "condition"]
      .map(field => [field, "approved_final_qa"])),
    approvalEvidence: ["archive/" + proofPath],
  };
  const source = {
    questionUid: targetUid, sourceFile: file, sourceOrdinal: 21, sourceGrade: "중2",
    identityStatus: "VERIFIED", sourceIntegrityStatus: "VERIFIED", sourceStatus: "VERIFIED",
    sourceFingerprint, assignmentFingerprint, approvedSourceFingerprint: sourceFingerprint,
    metadataRevision: revision, automatic: false, defaultSelectable: false, reviewStatus: "reviewed_pass",
    metaProjectionStatus: "DISPLAY_PROJECTION_UNAVAILABLE", metaProjectionFailureReason: "DISPLAY_PROJECTION_PARENT_AMBIGUOUS",
    metaProjection: null,
    metadataAssignmentEvidence: { questionUid: targetUid, sourceFile: file, sourceOrdinal: 21,
      sourceFingerprint, assignmentFingerprint, metadataRevision: revision, metadataStatus: accepted.metadataStatus,
      fieldStatus: structuredClone(accepted.fieldStatus), evidenceRefs: [...accepted.approvalEvidence] },
  };
  const scopeParents = ["이등변삼각형", target.L2, "삼각형의 성질"].map(L2 => ({ ...target, L2 }));
  resources[masterPath] = { records: scopeParents.map(row => ({ curriculum: row.curriculumKey,
    scope: row.courseKey, majorUnit: row.L1, midUnit: row.L2, concepts: [] })) };
  resources["data/archive2-canonical-projection-policy.json"].gradeCourseAllowlist = [
    { grade: "중2", curriculumKey: "2015", courseKey: "M2-2" },
  ];
  resources["data/basic-scope-parent-links.json"].records = scopeParents;
  resources["data/archive2-catalog.json"] = { schemaVersion: "archive2-v1", indexVersion: "fixture",
    records: [source], exams: [{ file, grade: "중2", qCount: 24 }], sourceHashes: [[file, "c".repeat(64)]] };
  const runtime = resources["data/meta-foundation/runtime/middle-geometry-v1.json"] = {
    status: "ACTIVE", packId: "MIDDLE_GEOMETRY", packVersion: "1.0.0", records: [structuredClone(accepted)],
    generatedFrom: { reviewedExam_fixture: "archive/" + proofPath }, taxonomyRows: [], ownedScopes: [],
  };
  resources["data/meta-foundation/compiled/taxonomy_registry.json"] = { status: "DERIVED_READ_ONLY",
    sourcePacks: [{ packId: runtime.packId, version: runtime.packVersion }],
    problemTypes: [{ problemTypeKey: accepted.problemTypeKey, status: "ACTIVE" }],
    templates: [{ templateKey: accepted.templateKey, parentProblemTypeKey: accepted.problemTypeKey, status: "ACTIVE" }],
  };
  resources["data/meta-foundation/compiled/curriculum_bindings.json"] = { bindings: [{ curriculum: "2015",
    standardUnitKey: target.standardUnitKey, subUnitKey: target.subUnitKey, problemTypeKey: accepted.problemTypeKey }] };
  const receipt = resources[proofPath] = { schemaVersion: "archive-reviewed-exam-meta-registration-v2",
    metadataRegistrationStatus: "REGISTERED", sourceArchiveFile: file, sourceRawSha256: "c".repeat(64), totalQuestions: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "EXISTING_APPROVAL_FIXTURE" }, appliedRecords: [accepted] };
  input.versionBundle.files[proofPath] = { sha256: "b".repeat(64) };
  return { input, resources, source, runtime, accepted, receipt, targetUid, target, proofPath, file, scopeParents };
}

test("issued M2 parent display transports only the current approved Q21 parent; default ambiguity and eligibility remain unchanged", () => {
  const f = issuedM2ParentFixture();
  const unselectedUid = "qid_v1_ffd1817a98a2cdc42cbfba5f3eda1946e70474632aadaa62c9522a8e2b2ffae3";
  const unselected = structuredClone(f.source);
  unselected.questionUid = unselectedUid; unselected.sourceOrdinal = 3;
  unselected.metadataAssignmentEvidence.questionUid = unselectedUid; unselected.metadataAssignmentEvidence.sourceOrdinal = 3;
  f.resources["data/archive2-catalog.json"].records.push(unselected);
  const otherApproved = { ...structuredClone(f.accepted), questionUid: unselectedUid, sourceOrdinal: 3 };
  f.receipt.appliedRecords.push(otherApproved); f.receipt.totalQuestions = 2;
  f.runtime.records.push(structuredClone(otherApproved));
  const before = structuredClone(f.input);
  const defaults = ProblemBankMeta.createSourceBoundDisplayProjection({
    meta: { ...f.accepted, contentFingerprint: assignmentFingerprint },
    identity: { questionUid: f.targetUid, sourceArchiveFile: f.file, sourceOrdinal: 21 },
    sourceFile: f.file, sourceOrdinal: 21, sourceGrade: "중2", sourceFingerprint, assignmentFingerprint,
    gradeCourseAllowlist: f.resources["data/archive2-canonical-projection-policy.json"].gradeCourseAllowlist,
    scopeParents: f.scopeParents, canonicalParents: f.scopeParents,
  });
  assert.equal(defaults.reason, "DISPLAY_PROJECTION_PARENT_AMBIGUOUS", "the generic three-parent rule is unchanged");
  const resolved = canonical.resolveCatalog(f.input);
  const selected = resolved.records.find(row => row.questionUid === f.targetUid);
  assert.deepEqual(selected.canonicalAssignmentReasons, []);
  assert.equal(selected.metaProjectionStatus, "DISPLAY_ONLY_SOURCE_BOUND");
  assert.equal(selected.metaProjectionFailureReason, "");
  assert.equal(selected.metaProjection.parentBinding.resolution, "ISSUED_FINAL_QA_EXACT_PARENT");
  assert.equal(selected.metaProjection.L2, f.target.L2);
  assert.equal(selected.metaProjection.parentBinding.reference, f.proofPath);
  assert.equal(selected.metaProjection.parentBinding.sha256, "b".repeat(64));
  assert.deepEqual(f.input, before, "no authority, source, runtime or parent-table mutation");
  assert.equal(resolved.records.find(row => row.questionUid === unselectedUid).metaProjectionFailureReason,
    "DISPLAY_PROJECTION_PARENT_AMBIGUOUS", "an equally approved unselected UID is unchanged");

  const noRepairInput = structuredClone(f.input);
  noRepairInput.versionBundle.resources["data/archive2-catalog.json"].records[0].metaProjectionFailureReason = "DISPLAY_PROJECTION_PARENT_MISSING";
  const withoutRepair = canonical.resolveCatalog(noRepairInput).records.find(row => row.questionUid === f.targetUid);
  const withoutDisplay = row => Object.fromEntries(Object.entries(row).filter(([key]) =>
    !["metaProjection", "metaProjectionStatus", "metaProjectionFailureReason"].includes(key)));
  assert.deepEqual(withoutDisplay(selected), withoutDisplay(withoutRepair));
  const afterPage = ProblemBankMeta.projectOriginal(selected), beforePage = ProblemBankMeta.projectOriginal(withoutRepair);
  for (const field of ["verifiedEligible", "automatic", "defaultSelectable", "directSelectable", "reviewStatus", "sourceStatus",
    "problemTypeKey", "templateKey", "difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility",
    "rpmPrimaryRecordId", "rpmL1", "rpmL2", "rpmL3", "rpmL4", "assignmentEvidence", "reviewedExamRegistration"])
    assert.deepEqual(afterPage[field], beforePage[field], field);
  assert.equal(afterPage.verifiedEligible, false);
  assert.equal(afterPage.metaBindingMode, "EXACT");
  assert.deepEqual(core.basicEligibility(selected, { canonicalAuthority: resolved.canonicalAuthority }),
    core.basicEligibility(withoutRepair, { canonicalAuthority: resolved.canonicalAuthority }));
});

test("issued M2 parent display refuses stale, unbound, ambiguous and nonselected authority", async t => {
  const cases = [
    ["new whole-source bytes without a newly issued preservation receipt", f => { f.resources["data/archive2-catalog.json"].sourceHashes[0][1] = "d".repeat(64); }],
    ["current full fingerprint changed while classification fingerprint stayed equal", f => { f.source.sourceFingerprint = "d".repeat(64); }],
    ["current classification fingerprint changed", f => { f.source.assignmentFingerprint = "d".repeat(64); }],
    ["current identity is unresolved", f => { f.source.identityStatus = "UNRESOLVED"; }],
    ["wrong source ordinal", f => { f.source.sourceOrdinal = 20; }],
    ["metadata revision drift", f => { f.source.metadataAssignmentEvidence.metadataRevision += ":changed"; }],
    ["source row revision drift", f => { f.source.metadataRevision += ":changed"; }],
    ["current approval evidence is missing", f => { f.source.metadataAssignmentEvidence.evidenceRefs = []; }],
    ["runtime revision alone changed", f => { f.runtime.records[0].metadataRevision += ":changed"; }],
    ["runtime approval evidence alone changed", f => { f.runtime.records[0].approvalEvidence = ["archive/data/evidence/other.json"]; }],
    ["runtime approval status changed", f => { f.runtime.records[0].metadataStatus = "registration_pending_semantic_review"; }],
    ["runtime field approval changed", f => { f.runtime.records[0].fieldStatus.template = "manual_review_pending"; }],
    ["receipt approval not reviewed", f => { f.receipt.approval.metadataReviewed = false; }],
    ["a different valid approval lane", f => { f.receipt.approval.type = "REVIEW2"; f.receipt.approval.reviewPassCount = 2; }],
    ["same labels without a receipt digest", f => { delete f.input.versionBundle.files[f.proofPath]; }],
    ["metadata explicit pending", f => { f.source.metadataAssignmentEvidence.fieldStatus.template = "manual_review_pending"; }],
    ["explicit source hold", f => { f.source.sourceIssueHold = true; }],
    ["explicit semantic hold", f => { f.source.semanticDisposition = "HOLD"; }],
    ["duplicate matching scope parents", f => { f.scopeParents.push({ ...f.target }); }],
    ["approved parent exists only outside the exact-subunit candidate set", f => { f.scopeParents.find(p => p.L2 === f.target.L2).subUnitKey = ""; }],
    ["another issued parent is outside the approved repair scope", f => { f.accepted.L2 = "이등변삼각형"; f.runtime.records[0].L2 = f.accepted.L2; }],
    ["approved parent is missing from current master", f => { f.resources[masterPath].records = f.resources[masterPath].records.filter(p => p.midUnit !== f.target.L2); }],
    ["an existing valid projection must not be overwritten", f => { f.source.metaProjection = { displayOnly: true, projectionStatus: "DISPLAY_ONLY_SOURCE_BOUND", evidence: "retain" }; }],
  ];
  for (const [name, mutate] of cases) await t.test(name, () => {
    const f = issuedM2ParentFixture(); mutate(f);
    const beforeProjection = structuredClone(f.source.metaProjection);
    const result = canonical.resolveCatalog(f.input).records.find(row => row.questionUid === f.targetUid);
    assert.equal(result.metaProjectionFailureReason, "DISPLAY_PROJECTION_PARENT_AMBIGUOUS");
    assert.deepEqual(result.metaProjection, beforeProjection);
  });
  for (const status of ["HOLD", "STALE", "INVALID", "EVIDENCE_DEBT", "PENDING", "UNKNOWN"]) await t.test("explicit field " + status, () => {
    const f = issuedM2ParentFixture(); f.source.metaFieldEvidence = { problemTypeKey: { status } };
    const result = canonical.resolveCatalog(f.input).records[0];
    assert.equal(result.metaProjectionFailureReason, "DISPLAY_PROJECTION_PARENT_AMBIGUOUS");
    const page = ProblemBankMeta.projectOriginal(result);
    if (["HOLD", "STALE", "INVALID", "EVIDENCE_DEBT"].includes(status)) assert.equal(page.metaStatus.problemTypeKey, status);
    assert.equal(page.verifiedEligible, false);
  });
});

test("issued M2 parent display keeps existing field evidence and refuses multiple current receipt claims", () => {
  const f = issuedM2ParentFixture();
  f.source.metaFieldEvidence = { problemTypeKey: { status: "CONFIRMED", reference: "existing-field-proof" } };
  const single = canonical.resolveCatalog(f.input).records[0];
  assert.deepEqual(single.metaProjection.evidenceByField.problemTypeKey, f.source.metaFieldEvidence.problemTypeKey);
  assert.equal(ProblemBankMeta.projectOriginal(single).metaStatus.problemTypeKey, "CONFIRMED");
  const otherPath = f.proofPath.replace("fixture.json", "duplicate.json");
  f.accepted.approvalEvidence.push("archive/" + otherPath);
  f.runtime.records[0].approvalEvidence = [...f.accepted.approvalEvidence];
  f.source.metadataAssignmentEvidence.evidenceRefs = [...f.accepted.approvalEvidence];
  f.resources[otherPath] = structuredClone(f.receipt);
  f.input.versionBundle.files[otherPath] = { sha256: "e".repeat(64) };
  f.runtime.generatedFrom.reviewedExam_duplicate = "archive/" + otherPath;
  const duplicate = canonical.resolveCatalog(f.input).records[0];
  assert.equal(duplicate.metaProjection, null);
  assert.equal(duplicate.metaProjectionFailureReason, "DISPLAY_PROJECTION_PARENT_AMBIGUOUS");
});

test("issued M2 parent display requires the existing loader to verify the exact receipt bytes", async () => {
  const f = issuedM2ParentFixture();
  const hash = value => crypto.createHash("sha256").update(value).digest("hex");
  const actualMasterSha = hash(JSON.stringify(f.resources[masterPath]));
  f.resources["data/archive2-canonical-projection-policy.json"].canonicalMasterSha256 = actualMasterSha;
  f.resources["data/basic-scope-parent-links.json"].authority.sha256 = actualMasterSha;
  const payloads = new Map(canonical.MANIFEST_REQUIRED_PATHS.map(path => [path, JSON.stringify(f.resources[path] || {})]));
  for (const [path, value] of Object.entries(f.resources)) payloads.set(path, JSON.stringify(value));
  const files = [...payloads].map(([path, bytes]) => ({ path, sha256: hash(bytes) }));
  const manifest = { schemaVersion: "archive2-canonical-input-manifest-v1", resolverVersion: canonical.RESOLVER_VERSION,
    projectionVersion: await canonical.computeProjectionVersion(files), files };
  const baseUrl = "https://archive.test/archive/workspace.html";
  const contents = new Map([...payloads].map(([path, bytes]) => [new URL(path, baseUrl).href, bytes]));
  contents.set(new URL("data/archive2-canonical-input-manifest.json", baseUrl).href, JSON.stringify(manifest));
  const fetcher = async url => contents.has(String(url)) ? new Response(contents.get(String(url))) : new Response("missing", { status: 404 });
  const bundle = await canonical.loadInputBundle(fetcher, baseUrl);
  const row = canonical.resolveCatalog({ versionBundle: bundle }).records[0];
  assert.equal(row.metaProjectionStatus, "DISPLAY_ONLY_SOURCE_BOUND");
  assert.equal(row.metaProjection.parentBinding.sha256, hash(payloads.get(f.proofPath)));
  const altered = structuredClone(f.receipt); altered.approval.metadataReviewed = false;
  contents.set(new URL(f.proofPath, baseUrl).href, JSON.stringify(altered));
  await assert.rejects(canonical.loadInputBundle(fetcher, baseUrl),
    error => error.code === "CANONICAL_INPUT_DIGEST_MISMATCH");
});
