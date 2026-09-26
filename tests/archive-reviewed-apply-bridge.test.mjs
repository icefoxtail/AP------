import test from "node:test";
import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = "original/middle/m2/2mid/24_fixture_middle2.js";
const examRepoPath = `archive/exams/${sourcePath}`;
const q1Uid = uidFor(1);
const q2Uid = uidFor(2);
const cli = {
  patch: "archive/tools/meta-foundation/apply-reviewed-meta-patch.mjs",
  runtime: "archive/tools/meta-foundation/rebuild-reviewed-runtime.mjs",
  staging: "archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs"
};

function sha(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}
function uidFor(ordinal) {
  return `qid_v1_${sha(Buffer.from(`${sourcePath}#${ordinal}`, "utf8"))}`;
}
function stableJson(value) {
  if (Array.isArray(value)) return value.map(stableJson);
  if (value && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableJson(value[key])]));
  return value;
}
function sourceFingerprint(question) {
  return sha(Buffer.from(JSON.stringify({
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    answer: question.answer ?? null,
    solution: question.solution ?? null,
    image: question.image ?? null
  }), "utf8"));
}
function contentFingerprint(question) {
  return sha(Buffer.from(JSON.stringify({
    content: question.content ?? null,
    choices: Array.isArray(question.choices) ? question.choices : null,
    image: question.image ?? null
  }), "utf8"));
}
function writeJson(root, relative, value) {
  const target = path.join(root, ...relative.split("/"));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}
function readJson(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, ...relative.split("/")), "utf8"));
}
function writeBank(root, questions) {
  const code = `window.examTitle = "Reviewed Apply Fixture";\nwindow.questions = ${JSON.stringify(questions, null, 2)};\n`;
  const file = path.join(root, ...examRepoPath.split("/"));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, code, "utf8");
  return Buffer.from(code, "utf8");
}
function getBank(root) {
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root, ...examRepoPath.split("/")), "utf8"), context, { timeout: 3000 });
  return context.window.questions;
}
function git(root, args, options = {}) {
  return execFileSync("git", ["-C", root, ...args], { encoding: options.encoding ?? "utf8", maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] });
}
function runCli(root, script, args, expectSuccess = true) {
  const result = spawnSync(process.execPath, [path.join(projectRoot, script), ...args, "--repo-root", root], {
    cwd: projectRoot,
    encoding: "utf8",
    timeout: 30000
  });
  if (expectSuccess && result.status !== 0) throw new Error(`${script} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  if (!expectSuccess && result.status === 0) throw new Error(`${script} unexpectedly succeeded:\n${result.stdout}`);
  return { stdout: result.stdout || "", stderr: result.stderr || "", status: result.status };
}
function lastJson(text) {
  const start = text.indexOf("{");
  return JSON.parse(text.slice(start));
}

function question(id, content) {
  return {
    id: String(id), content, choices: ["A", "B"], answer: "A", solution: "기존 해설",
    solutionImage: "", image: "", imageSize: "", questionType: "객관식", layoutTag: "normal",
    wide: false, tags: ["fixture"], standardUnitKey: "M2-01", subUnitKey: "M2-01-EXPRESSION",
    standardUnit: "수와 식", subUnit: "문자와 식"
  };
}

function metadataRecord(uid, ordinal, questionValue) {
  return {
    questionUid: uid,
    sourceArchiveFile: sourcePath,
    sourceOrdinal: ordinal,
    sourceQuestionNo: String(ordinal),
    sourceFingerprint: sourceFingerprint(questionValue),
    contentFingerprint: contentFingerprint(questionValue),
    curriculum: "2015",
    curriculumKey: "2015",
    standardCourse: "중2 수학",
    courseKey: "중2 수학",
    standardUnitKey: "M2-01",
    standardUnit: "수와 식",
    subUnitKey: "M2-01-EXPRESSION",
    subUnit: "문자와 식",
    conceptClusterKey: "M2-01-EXPRESSION",
    L1: "수와 식",
    L2: "문자와 식",
    L3: "기본 유형",
    L4: "구형 풀이 템플릿",
    problemTypeKey: "PT_VALID",
    templateKey: "TPL_OLD",
    crossConceptKeys: ["CC_ACTIVE"],
    secondaryConceptKeys: [],
    conditionKeys: [],
    integrationPattern: "NONE",
    difficultyBucket: 2,
    difficultyConfidence: "medium",
    difficultyBoundaryFlag: "NONE",
    legacyLevelCompatibility: "NORMAL",
    foundationTaxonomyStatus: "CONFIRMED",
    rpmPathStatus: "DIRECT",
    curriculumApplicability: "DEFAULT_SCOPE",
    defaultSelectable: true,
    reviewStatus: "reviewed_pass",
    metadataStatus: "approved_semantic_review",
    metadataRevision: "meta-foundation:TEST_PACK@1.0.0",
    metaFoundationStatus: "ACTIVE",
    metaFoundationPackId: "TEST_PACK",
    metaFoundationPackVersion: "1.0.0",
    fieldStatus: { problemType: "approved_semantic", template: "approved_semantic" },
    approvalEvidence: ["fixture"]
  };
}

function baseFixtureData(root) {
  const questions = [question(1, "문항 1"), question(2, "문항 2")];
  const baseBytes = writeBank(root, questions);
  fs.copyFileSync(path.join(projectRoot, "archive/archive2-core.js"), path.join(root, "archive/archive2-core.js"));
  fs.copyFileSync(path.join(projectRoot, "archive/mixer-selector.js"), path.join(root, "archive/mixer-selector.js"));
  const identityRecords = questions.map((q, index) => ({
    questionUid: uidFor(index + 1),
    legacyQKey: `${sourcePath}_${q.id}`,
    sourceArchiveFile: sourcePath,
    sourceOrdinal: index + 1,
    sourceQuestionNo: q.id,
    sourceFingerprint: sourceFingerprint(q)
  }));
  const identityMap = { schemaVersion: "question-identity-map-v1", sourceCommit: "fixture", records: identityRecords, identityDigest: "fixture" };
  writeJson(root, "archive/data/question_identity_map.json", identityMap);
  const records = questions.map((q, index) => metadataRecord(uidFor(index + 1), index + 1, q));
  const metadata = {
    schemaVersion: "archive-question-metadata-v1", metadataRevision: "fixture", generatedAt: "2026-09-25T00:00:00.000Z",
    approvalStatus: "fixture", counts: { records: records.length, uidUnique: true, sourceJoinUnique: true, semanticallyReviewed: records.length,
      explicitProblemTypeHolds: 0, explicitTemplateHolds: 0, explicitDifficultyHolds: 0 },
    records
  };
  metadata.digest = sha(Buffer.from(JSON.stringify(metadata), "utf8"));
  writeJson(root, "archive/data/question_metadata.json", metadata);
  writeJson(root, "archive/data/meta-foundation/canonical/registry_index.json", {
    schemaVersion: "meta-foundation-registry-index-v1", activePacks: [{ id: "TEST_PACK", version: "1.0.0", status: "ACTIVE" }],
    activeConceptShards: [], canonicalSources: [], compiledArtifacts: []
  });
  writeJson(root, "archive/data/meta-foundation/compiled/taxonomy_registry.json", {
    schemaVersion: "fixture-taxonomy", problemTypes: [
      { problemTypeKey: "PT_VALID", canonicalLabelKo: "기본 유형", status: "ACTIVE" },
      { problemTypeKey: "PT_OTHER", canonicalLabelKo: "다른 유형", status: "ACTIVE" }
    ], templates: [
      { templateKey: "TPL_OLD", canonicalLabelKo: "구형 풀이 템플릿", parentProblemTypeKey: "PT_VALID", status: "ACTIVE" },
      { templateKey: "TPL_NEW", canonicalLabelKo: "수정 풀이 템플릿", parentProblemTypeKey: "PT_VALID", status: "ACTIVE" },
      { templateKey: "TPL_WRONG", canonicalLabelKo: "잘못된 부모 템플릿", parentProblemTypeKey: "PT_OTHER", status: "ACTIVE" }
    ]
  });
  writeJson(root, "archive/data/meta-foundation/compiled/concept_registry.json", {
    schemaVersion: "fixture-concepts", concepts: [{ conceptKey: "CC_ACTIVE", status: "ACTIVE", canonicalLabelKo: "교점" }]
  });
  writeJson(root, "archive/data/meta-foundation/compiled/condition_registry.json", {
    schemaVersion: "fixture-conditions", conditions: [{ conditionKey: "COND_ACTIVE", status: "ACTIVE" }]
  });
  writeJson(root, "archive/data/meta-foundation/compiled/curriculum_bindings.json", {
    schemaVersion: "fixture-bindings", bindings: [
      { curriculum: "2015", standardCourse: "중2 수학", standardUnitKey: "M2-01", subUnitKey: "M2-01-EXPRESSION", problemTypeKey: "PT_VALID", status: "ACTIVE" }
    ]
  });
  writeJson(root, "archive/data/meta-foundation/compiled/aliases.json", { collisions: [] });
  writeJson(root, "archive/data/master_tables/js_archive_tag_master.json", [
    { key: "M2-01", keyType: "standardUnitKey", labelKo: "수와 식", order: 1, status: "active" },
    { key: "M2-01-EXPRESSION", keyType: "subUnitKey", standardUnitKey: "M2-01", labelKo: "문자와 식", order: 1, status: "active" }
  ]);
  writeJson(root, "archive/data/meta-foundation/runtime/test-pack-v1.json", {
    schemaVersion: "meta-foundation-runtime-overlay-v1", status: "ACTIVE", runtimeVersion: "TEST_PACK@1.0.0/runtime-bridge-v1",
    packId: "TEST_PACK", packVersion: "1.0.0", generatedFrom: { canonicalPack: "fixture" },
    counts: { records: 1, defaultSelectable: 1, runtimeSelectable: 1 },
    records: [{
      questionUid: uidFor(1), sourceArchiveFile: sourcePath, sourceOrdinal: 1, sourceQuestionNo: "1",
      curriculum: "2015", curriculumKey: "2015", standardCourse: "중2 수학", courseKey: "중2 수학",
      standardUnitKey: "M2-01", standardUnit: "수와 식", subUnitKey: "M2-01-EXPRESSION", subUnit: "문자와 식",
      L1: "수와 식", L2: "문자와 식", L3: "기본 유형", L4: "구형 풀이 템플릿",
      problemTypeKey: "PT_VALID", templateKey: "TPL_OLD", crossConceptKeys: ["CC_ACTIVE"], conditionKeys: [], integrationPattern: "NONE",
      difficultyBucket: 2, difficultyConfidence: "medium", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL",
      foundationTaxonomyStatus: "CONFIRMED", curriculumApplicability: "DEFAULT_SCOPE", defaultSelectable: true, runtimeSelectable: true,
      reviewStatus: "reviewed_pass", metadataStatus: "approved_semantic_review", metadataRevision: "meta-foundation:TEST_PACK@1.0.0",
      metaFoundationStatus: "ACTIVE", metaFoundationPackId: "TEST_PACK", metaFoundationPackVersion: "1.0.0"
    }]
  });
  writeJson(root, "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json", { schemaVersion: "fixture-runtime-receipt-v1", checked: {} });
  const catalogRecords = identityRecords.map((id, index) => ({
    sourceFile: sourcePath, sourceOrdinal: index + 1, sourceQuestionNo: String(index + 1), questionUid: id.questionUid,
    identityStatus: "VERIFIED", sourceFingerprint: id.sourceFingerprint, approvedSourceFingerprint: id.sourceFingerprint,
    rawQuestionHash: `raw-${index + 1}`, standardUnitKey: "M2-01", subUnitKey: "M2-01-EXPRESSION",
    problemTypeKey: records[index].problemTypeKey, templateKey: records[index].templateKey,
    crossConceptKeys: records[index].crossConceptKeys, conditionKeys: [], curriculumKey: "2015", courseKey: "중2 수학",
    L1: "수와 식", L2: "문자와 식", L3: "기본 유형", L4: "구형 풀이 템플릿"
  }));
  writeJson(root, "archive/data/archive2-catalog.json", { schemaVersion: "fixture-catalog", records: catalogRecords, exams: [], health: { exams: 1, questions: 2 } });
  return { questions, baseBytes, metadata, identityMap };
}

function fixtureRoot(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-reviewed-apply-bridge-"));
  assert.ok(path.resolve(root).startsWith(path.resolve(os.tmpdir())));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(root, { recursive: true });
  git(root, ["init", "-b", "main"]);
  git(root, ["config", "user.name", "Archive Apply Tests"]);
  git(root, ["config", "user.email", "archive-apply-tests@example.invalid"]);
  git(root, ["config", "core.quotepath", "false"]);
  const data = baseFixtureData(root);
  git(root, ["add", "--", examRepoPath, "archive/archive2-core.js", "archive/mixer-selector.js", "archive/data"]);
  git(root, ["commit", "-m", "fixture base"]);
  const baseSha = String(git(root, ["rev-parse", "HEAD"])).trim();
  return { root, baseSha, ...data };
}

function patchFields(record) {
  return Object.fromEntries(["standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "crossConceptKeys"].map((key) => [key, record[key]]));
}

function makePacket(fixture, options = {}) {
  const questions = options.questions || getBank(fixture.root);
  const metadata = readJson(fixture.root, "archive/data/question_metadata.json");
  const records = new Map(metadata.records.map((row) => [row.questionUid, row]));
  const statusByOrdinal = options.statusByOrdinal || { 1: "REPAIR", 2: "KEEP" };
  const patches = fixture.identityMap.records.map((identity) => {
    const ordinal = identity.sourceOrdinal;
    const status = statusByOrdinal[ordinal] || "KEEP";
    const current = records.get(identity.questionUid);
    const before = patchFields(current);
    let after = { ...before };
    if (status === "REPAIR" && ordinal === 1) after.templateKey = options.templateKey || "TPL_NEW";
    if (status === "CANDIDATE") after = {};
    const patch = {
      questionUid: identity.questionUid,
      sourceArchiveFile: sourcePath,
      sourceOrdinal: ordinal,
      sourceFingerprint: identity.sourceFingerprint,
      status,
      runtimePackId: "TEST_PACK",
      before,
      after
    };
    if (status === "CANDIDATE") Object.assign(patch, {
      l3CandidateLabel: "후보 유형", l3CandidateDefinition: "후보 L3 정의",
      l4CandidateLabel: "후보 템플릿", l4CandidateSkeleton: "후보 풀이 뼈대",
      crossConceptCandidates: [{ label: "후보 개념", definition: "후보 정의" }],
      searchedCanonicalCandidates: [{ key: "PT_VALID", label: "기본 유형" }],
      whyExistingCanonicalDoesNotFit: "기존 ACTIVE 유형으로 설명되지 않음"
    });
    return patch;
  });
  const assetRel = "archive/assets/images/fixture/q01-solution.svg";
  const finalFiles = [{ path: examRepoPath, sha256: sha(fixture.finalBytes || fs.readFileSync(path.join(fixture.root, ...examRepoPath.split("/")))), sizeBytes: (fixture.finalBytes || fs.readFileSync(path.join(fixture.root, ...examRepoPath.split("/")))).length, kind: "exam_js" }];
  if (options.withSvg) {
    const bytes = fs.readFileSync(path.join(fixture.root, ...assetRel.split("/")));
    finalFiles.push({ path: assetRel, sha256: sha(bytes), sizeBytes: bytes.length, kind: "solution_svg" });
  }
  const statusUids = (status) => patches.filter((row) => row.status === status).map((row) => row.questionUid).sort();
  return {
    schemaVersion: 2,
    applyId: options.applyId || "fixture-apply-001",
    examFile: path.posix.basename(sourcePath),
    sourcePath,
    grade: options.grade || "중2",
    targetRef: options.targetRef || "main",
    targetBaseSha: fixture.baseSha,
    sourceBlobSha: options.sourceBlobSha || sha(fixture.baseBytes),
    totalQuestions: questions.length,
    reviewPassCount: 2,
    closureStatus: "CLOSED_FOR_APPLY",
    status: "READY_FOR_APPLY",
    closedAt: "2026-09-25T00:00:00.000Z",
    r2Artifact: "r2://archive-reviewed-apply-fixture/closed.json",
    reviewArtifactSha256: sha(Buffer.from("fixture-review-artifact")),
    finalFiles,
    metaPatches: patches,
    candidatePending: statusUids("CANDIDATE"),
    canonicalHolds: statusUids("HOLD"),
    routeOutPreserve: statusUids("ROUTE_OUT"),
    regenerateScopes: ["question_metadata", "meta_runtime", "question_index", "archive2_catalog", "crosswalk"]
  };
}

function writePacket(fixture, packet, applyId = packet.applyId) {
  const relative = `.archive-apply/inbox/${applyId}.json`;
  writeJson(fixture.root, relative, packet);
  return relative;
}

function createStaging(fixture, options = {}) {
  const applyId = options.applyId || "fixture-stage-main-001";
  const targetRef = options.targetRef || "main";
  const grade = options.grade || (targetRef === "main" ? "중2" : "중1");
  if (targetRef !== "main") git(fixture.root, ["branch", targetRef, fixture.baseSha]);
  git(fixture.root, ["checkout", "-b", `archive-apply/${applyId}`, fixture.baseSha]);
  const finalQuestions = fixture.questions.map((row) => ({ ...row }));
  if (options.protectedMutation === "content") finalQuestions[0].content = "임의 변조된 문항";
  else if (options.protectedMutation === "answer") finalQuestions[0].answer = "B";
  else if (options.finalMutation === "solution") finalQuestions[0].solution = "검토된 최종 해설";
  if (options.withSvg) {
    finalQuestions[0].solutionImage = "assets/images/fixture/q01-solution.svg";
    const asset = path.join(fixture.root, "archive/assets/images/fixture/q01-solution.svg");
    fs.mkdirSync(path.dirname(asset), { recursive: true });
    fs.writeFileSync(asset, '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4"/></svg>\n', "utf8");
  }
  fixture.finalBytes = writeBank(fixture.root, finalQuestions);
  const packet = makePacket(fixture, { ...options, applyId, targetRef, grade, questions: finalQuestions });
  if (options.wrongFileHash) packet.finalFiles[0].sha256 = "0".repeat(64);
  const packetPath = writePacket(fixture, packet, applyId);
  const add = [examRepoPath, packetPath];
  if (options.withSvg) add.push("archive/assets/images/fixture/q01-solution.svg");
  git(fixture.root, ["add", "--", ...add]);
  git(fixture.root, ["commit", "-m", "staging reviewed apply payload"]);
  return { packet, packetPath, finalQuestions };
}

function regenerateFixtureCatalog(fixture) {
  const metadata = readJson(fixture.root, "archive/data/question_metadata.json");
  const rows = metadata.records.map((row) => ({
    sourceFile: sourcePath,
    sourceOrdinal: row.sourceOrdinal,
    sourceQuestionNo: String(row.sourceOrdinal),
    questionUid: row.questionUid,
    identityStatus: "VERIFIED",
    sourceFingerprint: row.sourceFingerprint,
    approvedSourceFingerprint: row.sourceFingerprint,
    rawQuestionHash: `updated-${row.sourceOrdinal}`,
    curriculumKey: row.curriculumKey,
    courseKey: row.courseKey,
    standardUnitKey: row.standardUnitKey,
    subUnitKey: row.subUnitKey,
    L1: row.L1,
    L2: row.L2,
    L3: row.L3,
    L4: row.L4,
    problemTypeKey: row.problemTypeKey,
    templateKey: row.templateKey,
    crossConceptKeys: row.crossConceptKeys,
    conditionKeys: row.conditionKeys,
    integrationPattern: row.integrationPattern
  }));
  writeJson(fixture.root, "archive/data/archive2-catalog.json", {
    schemaVersion: "fixture-catalog", records: rows, exams: [], health: { exams: 1, questions: rows.length }
  });
}

function mutateFixtureJson(fixture, relative, mutate) {
  const value = readJson(fixture.root, relative);
  mutate(value);
  writeJson(fixture.root, relative, value);
}

test("T1 KEEP only makes zero question_metadata and runtime mutations", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f, { statusByOrdinal: { 1: "KEEP", 2: "KEEP" } });
  const packetPath = writePacket(f, packet);
  const metadataBefore = fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json"));
  const runtimeBefore = fs.readFileSync(path.join(f.root, "archive/data/meta-foundation/runtime/test-pack-v1.json"));
  const checked = lastJson(runCli(f.root, cli.patch, ["--packet", packetPath, "--check"]).stdout);
  assert.equal(checked.metadataMutationCount, 0);
  assert.equal(checked.semanticMetadataMutationCount, 0);
  runCli(f.root, cli.patch, ["--packet", packetPath, "--write"]);
  runCli(f.root, cli.runtime, ["--packet", packetPath, "--check"]);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json")), metadataBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/meta-foundation/runtime/test-pack-v1.json")), runtimeBefore);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence/review-overrides/v1", `${q1Uid}.json`)), true);
});

test("T2 REPAIR updates an existing UID in metadata, runtime, and catalog projection", (t) => {
  const f = fixtureRoot(t);
  const { packetPath } = createStaging(f, { finalMutation: "solution", applyId: "fixture-repair-002" });
  const checked = lastJson(runCli(f.root, cli.patch, ["--packet", packetPath, "--check"]).stdout);
  assert.equal(checked.semanticMetadataMutationCount, 1);
  runCli(f.root, cli.patch, ["--packet", packetPath, "--write"]);
  regenerateFixtureCatalog(f);
  const rebuilt = lastJson(runCli(f.root, cli.runtime, ["--packet", packetPath, "--write"]).stdout);
  assert.deepEqual(rebuilt.canonicalGateCounts, { brokenL4ParentCount: 0, unregisteredL3Count: 0, unregisteredL4Count: 0, unregisteredCrossConceptCount: 0, bindingMismatchCount: 0 });
  const metadata = readJson(f.root, "archive/data/question_metadata.json").records.find((row) => row.questionUid === q1Uid);
  const runtime = readJson(f.root, "archive/data/meta-foundation/runtime/test-pack-v1.json").records.find((row) => row.questionUid === q1Uid);
  const catalog = readJson(f.root, "archive/data/archive2-catalog.json").records.find((row) => row.questionUid === q1Uid);
  assert.equal(metadata.templateKey, "TPL_NEW");
  assert.equal(metadata.L4, "수정 풀이 템플릿");
  assert.equal(runtime.templateKey, metadata.templateKey);
  assert.equal(runtime.L4, metadata.L4);
  assert.equal(runtime.sourceFingerprint, metadata.sourceFingerprint);
  assert.equal(catalog.templateKey, metadata.templateKey);
  assert.equal(catalog.sourceFingerprint, metadata.sourceFingerprint);
  assert.equal(metadata.sourceFingerprint, sourceFingerprint(getBank(f.root)[0]));
});

test("T3 invalid L3 fails before any output mutation", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f);
  packet.metaPatches[0].after.problemTypeKey = "PT_NOT_REGISTERED";
  const packetPath = writePacket(f, packet);
  const before = fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json"));
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--write"], false);
  assert.match(result.stderr, /unregistered\/inactive|ACTIVE row/);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json")), before);
  assert.equal(fs.existsSync(path.join(f.root, "archive/data/meta-foundation/evidence/review-overrides/v1")), false);
});

test("T4 invalid L4 parent fails closed", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f, { templateKey: "TPL_WRONG" });
  const packetPath = writePacket(f, packet);
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--check"], false);
  assert.match(result.stderr, /invalid L4 parent/);
});

test("T5 invalid CrossConcept fails closed", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f);
  packet.metaPatches[0].after.crossConceptKeys = ["CC_NOT_REGISTERED"];
  const packetPath = writePacket(f, packet);
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--check"], false);
  assert.match(result.stderr, /unregistered\/inactive CrossConcept/);
});

test("T6 duplicate UID packet is rejected", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f);
  packet.metaPatches[1] = { ...packet.metaPatches[0] };
  const packetPath = writePacket(f, packet);
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--check"], false);
  assert.match(result.stderr, /duplicate UID|duplicate source identity/);
});

test("T7 source identity fingerprint mismatch is rejected", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f);
  packet.metaPatches[0].sourceFingerprint = "f".repeat(64);
  const packetPath = writePacket(f, packet);
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--check"], false);
  assert.match(result.stderr, /source identity mismatch/);
});

test("T8 sourceBlobSha mismatch is rejected against the base commit", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f, { sourceBlobSha: "a".repeat(64) });
  const packetPath = writePacket(f, packet);
  const result = runCli(f.root, cli.patch, ["--packet", packetPath, "--check"], false);
  assert.match(result.stderr, /sourceBlobSha mismatch/);
});

test("T9 stale targetBaseSha fails before target ref mutation", (t) => {
  const f = fixtureRoot(t);
  const { packet, packetPath } = createStaging(f, { applyId: "fixture-stale-009" });
  const targetBefore = String(git(f.root, ["rev-parse", "refs/heads/main"])).trim();
  const result = runCli(f.root, cli.staging, ["preflight", "--packet", packetPath, "--target-sha", "0".repeat(40)], false);
  assert.match(result.stderr, /APPLY_BASE_STALE/);
  assert.equal(String(git(f.root, ["rev-parse", "refs/heads/main"])).trim(), targetBefore);
  assert.equal(packet.targetBaseSha, targetBefore);
});

test("T10 finalFiles SHA mismatch is rejected by staging preflight", (t) => {
  const f = fixtureRoot(t);
  const { packet, packetPath } = createStaging(f, { applyId: "fixture-sha-010", wrongFileHash: true, finalMutation: "solution" });
  const result = runCli(f.root, cli.staging, ["preflight", "--packet", packetPath, "--target-sha", f.baseSha], false);
  assert.match(result.stderr, /finalFiles SHA\/size mismatch/);
  assert.equal(String(git(f.root, ["rev-parse", "refs/heads/main"])).trim(), f.baseSha);
  assert.equal(packet.finalFiles[0].sha256, "0".repeat(64));
});

test("T11 CANDIDATE evidence is stored without fake canonical keys or runtime promotion", (t) => {
  const f = fixtureRoot(t);
  const packet = makePacket(f, { statusByOrdinal: { 1: "CANDIDATE", 2: "KEEP" } });
  const packetPath = writePacket(f, packet);
  const metadataBefore = fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json"));
  const runtimeBefore = fs.readFileSync(path.join(f.root, "archive/data/meta-foundation/runtime/test-pack-v1.json"));
  runCli(f.root, cli.patch, ["--packet", packetPath, "--write"]);
  runCli(f.root, cli.runtime, ["--packet", packetPath, "--write"]);
  const evidence = readJson(f.root, `archive/data/meta-foundation/evidence/review-overrides/v1/${q1Uid}.json`).latestAcceptedReview2.candidateEvidence;
  assert.ok(evidence.l3CandidateDefinition);
  assert.equal(JSON.stringify(evidence).includes("PT_FAKE"), false);
  assert.equal(JSON.stringify(evidence).includes("TPL_FAKE"), false);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/question_metadata.json")), metadataBefore);
  assert.deepEqual(fs.readFileSync(path.join(f.root, "archive/data/meta-foundation/runtime/test-pack-v1.json")), runtimeBefore);
});

test("T12 protected content/answer mutation fails", (t) => {
  const f = fixtureRoot(t);
  const staged = createStaging(f, { applyId: "fixture-protected-012", protectedMutation: "content" });
  const result = runCli(f.root, cli.patch, ["--packet", staged.packetPath, "--check"], false);
  assert.match(result.stderr, /protected field mutation/);
});

test("T12 answer field mutation also fails", (t) => {
  const f = fixtureRoot(t);
  const staged = createStaging(f, { applyId: "fixture-answer-012", protectedMutation: "answer" });
  const result = runCli(f.root, cli.patch, ["--packet", staged.packetPath, "--check"], false);
  assert.match(result.stderr, /protected field mutation/);
});

test("T13 runtime duplicate UID is detected", (t) => {
  const f = fixtureRoot(t);
  mutateFixtureJson(f, "archive/data/meta-foundation/runtime/test-pack-v1.json", (runtime) => {
    runtime.records.push({ ...runtime.records[0] });
  });
  const result = runCli(f.root, cli.runtime, ["--check"], false);
  assert.match(result.stderr, /active runtime duplicate UID/);
});

test("T13 runtime duplicate source identity is detected", (t) => {
  const f = fixtureRoot(t);
  mutateFixtureJson(f, "archive/data/meta-foundation/runtime/test-pack-v1.json", (runtime) => {
    runtime.records.push({ ...runtime.records[0], questionUid: q2Uid, sourceOrdinal: 1 });
  });
  const result = runCli(f.root, cli.runtime, ["--check"], false);
  assert.match(result.stderr, /active runtime duplicate source identity/);
});

test("T14 repeated patch/runtime generation is idempotent", (t) => {
  const f = fixtureRoot(t);
  const { packetPath } = createStaging(f, { applyId: "fixture-idempotence-014", finalMutation: "solution" });
  runCli(f.root, cli.patch, ["--packet", packetPath, "--write"]);
  regenerateFixtureCatalog(f);
  runCli(f.root, cli.runtime, ["--packet", packetPath, "--write"]);
  const paths = ["archive/data/question_metadata.json", "archive/data/meta-foundation/runtime/test-pack-v1.json",
    "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json",
    `archive/data/meta-foundation/evidence/review-overrides/v1/${q1Uid}.json`];
  const before = paths.map((relative) => sha(fs.readFileSync(path.join(f.root, ...relative.split("/")))));
  const repeated = lastJson(runCli(f.root, cli.patch, ["--packet", packetPath, "--write"]).stdout);
  assert.equal(repeated.metadataMutationCount, 0);
  runCli(f.root, cli.runtime, ["--packet", packetPath, "--check"]);
  const after = paths.map((relative) => sha(fs.readFileSync(path.join(f.root, ...relative.split("/")))));
  assert.deepEqual(after, before);
});

async function simulateAtomicTargetApply(t, { targetRef, grade, applyId }) {
  const f = fixtureRoot(t);
  const staged = createStaging(f, { targetRef, grade, applyId, finalMutation: "solution", withSvg: true });
  runCli(f.root, cli.staging, ["preflight", "--packet", staged.packetPath, "--target-sha", f.baseSha]);
  const reportPath = path.join(f.root, "archive/question-index.js");
  fs.writeFileSync(reportPath, "// fixture generated registration output\n", "utf8");
  const backup = path.join(os.tmpdir(), `${applyId}.packet.json`);
  fs.copyFileSync(path.join(f.root, ...staged.packetPath.split("/")), backup);
  t.after(() => fs.rmSync(backup, { force: true }));
  runCli(f.root, cli.staging, ["remove-packet", "--packet", staged.packetPath]);
  const before = runCli(f.root, cli.staging, ["snapshot", "--base-sha", f.baseSha]);
  assert.ok(lastJson(before.stdout).trackedDiffSha256);
  runCli(f.root, cli.staging, ["finalize", "--packet", backup, "--staging-packet-path", staged.packetPath, "--target-base-sha", f.baseSha]);
  const commit = String(git(f.root, ["rev-parse", "HEAD"])).trim();
  assert.equal(String(git(f.root, ["rev-parse", "HEAD^"])).trim(), f.baseSha);
  assert.equal(String(git(f.root, ["rev-list", "--count", `${f.baseSha}..HEAD`] )).trim(), "1");
  const tree = String(git(f.root, ["ls-tree", "-r", "--name-only", "HEAD"]));
  assert.equal(tree.split(/\r?\n/).some((file) => file.startsWith(".archive-apply/inbox/")), false);
  assert.ok(tree.includes(examRepoPath));
  assert.ok(tree.includes("archive/assets/images/fixture/q01-solution.svg"));
  const targetBefore = String(git(f.root, ["rev-parse", `refs/heads/${targetRef}`])).trim();
  assert.equal(targetBefore, f.baseSha);
  git(f.root, ["update-ref", `refs/heads/${targetRef}`, commit, f.baseSha]);
  assert.equal(String(git(f.root, ["rev-parse", `refs/heads/${targetRef}`])).trim(), commit);
  assert.equal(String(git(f.root, ["rev-list", "--count", `${f.baseSha}..refs/heads/${targetRef}`])).trim(), "1");
}

test("T15 simulated main apply creates exactly one target commit and removes the packet", async (t) => {
  await simulateAtomicTargetApply(t, { targetRef: "main", grade: "중2", applyId: "fixture-main-015" });
});

test("T16 simulated middle1 apply creates exactly one target commit and removes the packet", async (t) => {
  await simulateAtomicTargetApply(t, { targetRef: "codex/meta-foundation/middle1", grade: "중1", applyId: "fixture-middle1-016" });
});

test("T17 transient packet is absent from final target tree", (t) => {
  const f = fixtureRoot(t);
  const staged = createStaging(f, { applyId: "fixture-packet-017", withSvg: true });
  const backup = path.join(os.tmpdir(), "archive-reviewed-apply-t17.packet.json");
  fs.copyFileSync(path.join(f.root, ...staged.packetPath.split("/")), backup);
  t.after(() => fs.rmSync(backup, { force: true }));
  runCli(f.root, cli.staging, ["remove-packet", "--packet", staged.packetPath]);
  const reportPath = path.join(f.root, "archive/question-index.js");
  fs.writeFileSync(reportPath, "// regenerated fixture index\n", "utf8");
  runCli(f.root, cli.staging, ["finalize", "--packet", backup, "--staging-packet-path", staged.packetPath, "--target-base-sha", f.baseSha]);
  const names = String(git(f.root, ["ls-tree", "-r", "--name-only", "HEAD"]));
  assert.equal(names.includes(".archive-apply/inbox/"), false);
});

test("T18 R2 production asset copy has a main-only automatic push trigger", () => {
  const workflow = fs.readFileSync(path.join(projectRoot, ".github/workflows/r2-archive-assets-copy.yml"), "utf8");
  assert.match(workflow, /workflow_dispatch:\s*\n\s*push:\s*\n\s*branches:\s*\[main\]/);
  assert.match(workflow, /archive\/assets\/images\/\*\*/);
});
