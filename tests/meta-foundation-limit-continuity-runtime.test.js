// Historical overlay source-readiness counts are distinct from current canonical release gates.
const { catalog: canonicalCatalog } = require("./helpers/archive2-scope-harness.cjs");
const { assertCanonicalRuntimeGate, runtimeRecordCount } = require("./helpers/meta-runtime-gate.cjs");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const os = require("os");
const crypto = require("crypto");
const { createNativeRuntimeVerifier } = require("./helpers/byte-bound-native-runtime.cjs");
const C = require("../archive/archive2-core.js");
const { readWorkspace } = require("./helpers/archive2-workspace-source.cjs");

async function main() {
const root = path.resolve(__dirname, "..");
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
const readText = (p) => fs.readFileSync(path.join(root, p), "utf8");
const sourceKey = (file, ordinal) => C.normalizeFile(file) + "#" + Number(ordinal);

const runtime = readJson("archive/data/meta-foundation/runtime/limit-continuity-v1.json");
const receipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");
// complete rows: approvedSourceFingerprint and the evidence columns are in the evidence file, not the downloaded catalog
const catalog = require("../archive/tools/archive2-catalog-evidence.cjs").readCatalog({ root });

assert.strictEqual(runtime.packId, "LIMIT_CONTINUITY");
assert.strictEqual(runtime.status, "ACTIVE");
// Freeze the actual historical UID cohort, not the size/version of a growing
// runtime. Its exact old statistics remain regression evidence; a changed row
// or an addition must prove a current reviewed registration below.
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const stable = value => JSON.stringify(value, (_, v) => v && typeof v === "object" && !Array.isArray(v)
  ? Object.fromEntries(Object.keys(v).sort().map(key => [key, v[key]])) : v);
const historicalBytes = fs.readFileSync(path.join(root, "tests/fixtures/limit-continuity-runtime-cohort-20261115.json"));
assert.strictEqual(sha256(historicalBytes), "cb0080d39546b9bad7d5b3add7991a3910fe8289d65f98a066866ec55c237972");
const historical = JSON.parse(historicalBytes);
assert.strictEqual(historical.schemaVersion, "limit-continuity-runtime-historical-cohort-v1");
assert.strictEqual(historical.sourceCommit, "3406b3eac58ebb20b04e3b1bab14b5f8a36b0f3a");
assert.strictEqual(historical.sourceBlobSha1, "e305a34db250cea79fa4ba8dab6002ee733f0c59");
assert.strictEqual(historical.sourceRawSha256, "d748bafa3923a1c1344253cb6701acbd97b7139a39d29d0aaf2090c899b42760");
assert.deepStrictEqual(historical.columns, ["questionUid", "sourceIndex", "sourceOrdinal", "runtimeRecordSha256",
  "standardUnitKey", "problemTypeKey", "templateKey", "difficultyBucket", "difficultyConfidence",
  "difficultyBoundaryFlag", "legacyLevelCompatibility", "metaFoundationDifficultyStatus", "catalogIdentityRepairVerified"]);
const historicalRows = historical.records.map(values => Object.fromEntries(historical.columns.map((key, index) => [key, values[index]])));
const historicalByUid = new Map(historicalRows.map(row => [row.questionUid, row]));
assert.strictEqual(historicalRows.length, 184);
assert.strictEqual(historicalByUid.size, 184);
assert.strictEqual(historicalRows.filter(row => row.catalogIdentityRepairVerified === true).length, 3);
assert.strictEqual(historical.counts.catalogUidDirectJoin, 181);
assert.strictEqual(historical.counts.catalogSourceIdentityRepairJoin, 3);
assert.strictEqual(historical.counts.automaticEligibleExpected, 133);
assert.strictEqual(historical.historicalTaxonomyRows.length, 33);
const total = runtime.records.length;
assert.strictEqual(runtime.counts.records, total);
assert.strictEqual(
  runtime.records.filter((r) => r.standardUnitKey === "H15-M2-01").length +
  runtime.records.filter((r) => r.standardUnitKey === "H15-M2-02").length, total);
assert.strictEqual(new Set(runtime.records.map((r) => r.questionUid)).size, total);
assert.strictEqual(new Set(runtime.records.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, total);
assert.strictEqual(runtime.counts.catalogUidDirectJoin, historical.counts.catalogUidDirectJoin);
assert.strictEqual(runtime.counts.catalogSourceIdentityRepairJoin, historical.counts.catalogSourceIdentityRepairJoin);
// The reviewed summary counts explicit runtimeSelectable markers. It is not
// the historical 133 source-readiness result and grants no canonical release.
assert.strictEqual(runtime.usage.schemaVersion, "archive-reviewed-runtime-usage-v1");
assert.strictEqual(runtime.counts.automaticEligibleExpected, runtime.records.filter(row => row.runtimeSelectable === true).length);
assert.strictEqual(runtime.counts.defaultSelectable, runtime.records.filter(row => row.defaultSelectable === true).length);
assert.strictEqual(runtime.counts.difficultyDeferred, 0);
assert.strictEqual(new Set(historicalRows.map((r) => r.problemTypeKey)).size, 10);
assert.strictEqual(new Set(historicalRows.map((r) => r.templateKey)).size, 31);
const limitRows = historicalRows.filter((r) => r.standardUnitKey === "H15-M2-01");
const limitDistribution = Object.fromEntries([1,2,3,4,5].map((bucket) => [bucket, limitRows.filter((r) => r.difficultyBucket === bucket).length]));
assert.deepStrictEqual(limitDistribution, { 1: 24, 2: 24, 3: 32, 4: 21, 5: 3 });
assert.strictEqual(limitRows.filter((r) => r.metaFoundationDifficultyStatus === "FRESH_BLIND_RECHECK_PASS").length, 104);
assert.strictEqual(limitRows.filter((r) => ["high","medium","low"].includes(r.difficultyConfidence)).length, 104);
assert.strictEqual(limitRows.filter((r) => ["NONE","B12","B23","B34","B45"].includes(r.difficultyBoundaryFlag)).length, 104);
assert.strictEqual(limitRows.filter((r) => ["NORMAL","BORDERLINE_ACCEPTABLE","STRONG_CONFLICT"].includes(r.legacyLevelCompatibility)).length, 104);
assert.strictEqual(historical.runtimeVersion, "LIMIT_CONTINUITY@1.1.0/runtime-bridge-v4");
const activePack = readJson("archive/data/meta-foundation/canonical/packs/limit-continuity/pack.json");
assert.strictEqual(runtime.packVersion, activePack.packVersion);
assert.strictEqual(runtime.runtimeVersion, `LIMIT_CONTINUITY@${activePack.packVersion}/reviewed-exam-v2`);

const verifier = await createNativeRuntimeVerifier(root, canonicalCatalog);
const globalEntries = C.Canonical.RUNTIME_INPUT_PATHS.flatMap(file => {
  const pack = readJson("archive/" + file);
  return pack.records.map(row => ({ row, packId: pack.packId, status: pack.status }));
});
const indexEntries = entries => {
  const index = new Map();
  for (const entry of entries) index.set(entry.row.questionUid, [...(index.get(entry.row.questionUid) || []), entry]);
  return index;
};
const byRuntimeUid = indexEntries(globalEntries);
const nativeInputs = new Map();
function verifyHistorical(index, remember = false) {
  let unchanged = 0, reviewedTransitions = 0, staleSource = 0;
  for (const [uid, old] of historicalByUid) {
    const entries = index.get(uid) || [];
    assert.strictEqual(entries.length, 1, "historical UID missing/duplicated: " + uid);
    const entry = entries[0], row = entry.row;
    assert.strictEqual(sourceKey(row.sourceArchiveFile, row.sourceOrdinal), sourceKey(historical.sources[old.sourceIndex], old.sourceOrdinal), uid);
    if (entry.packId === "LIMIT_CONTINUITY" && entry.status === "ACTIVE" && sha256(stable(row)) === old.runtimeRecordSha256) {
      unchanged += 1;
      continue;
    }
    const input = verifier.inputFor(row, entry);
    // 영수증 이후 원본이 정상 수정된 문항은 재등록 대기다(실패 아님). 나머지는 기존처럼 증명한다.
    const verdict = verifier.classifyInput(input, "historical reviewed transition: " + uid);
    if (verdict.stale) { staleSource += 1; continue; }
    if (remember) nativeInputs.set(uid, input);
    reviewedTransitions += 1;
  }
  assert.strictEqual(unchanged + reviewedTransitions + staleSource, 184);
  return { unchanged, reviewedTransitions, staleSource };
}
const preserved = verifyHistorical(byRuntimeUid, true);
const additions = runtime.records.filter(row => !historicalByUid.has(row.questionUid));
for (const row of additions) {
  const input = verifier.inputFor(row, runtime);
  if (verifier.classifyInput(input, "reviewed addition: " + row.questionUid).stale) { preserved.staleSource += 1; continue; }
  nativeInputs.set(row.questionUid, input);
}
assert.strictEqual(runtime.records.filter(row => historicalByUid.has(row.questionUid)).length + additions.length, total);

// A historical label-only taxonomy row may have no supporting item. Current
// materialized rows must cover every actual tuple exactly once, with exact
// support counts; a lower bound cannot prove that no tuple was dropped.
const taxonomyFields = ["curriculumKey", "courseKey", "L1", "L2", "L3", "L4", "problemTypeKey", "templateKey", "curriculumApplicability"];
const taxonomyKey = row => stable(taxonomyFields.map(key => key === "curriculumKey" ? row.curriculumKey || row.curriculum || null : row[key] ?? null));
function verifyTaxonomy(taxonomyRows, records) {
  const expected = new Map();
  for (const row of records.filter(row => row.problemTypeKey && row.metaFoundationL3Status !== "ROUTE_OUT")) {
    const key = taxonomyKey(row), group = expected.get(key) || { count: 0, selectable: false };
    group.count += 1;
    group.selectable ||= row.defaultSelectable === true;
    expected.set(key, group);
  }
  assert.strictEqual(taxonomyRows.length, expected.size, "current taxonomy tuple count");
  assert.strictEqual(new Set(taxonomyRows.map(taxonomyKey)).size, taxonomyRows.length, "duplicate taxonomy tuple");
  for (const row of taxonomyRows) {
    const group = expected.get(taxonomyKey(row));
    assert(group, "unsupported taxonomy tuple");
    assert.strictEqual(row.supportingItemCount, group.count, "taxonomy support count");
    assert.strictEqual(row.defaultSelectable, group.selectable, "taxonomy selectable summary");
  }
}
verifyTaxonomy(runtime.taxonomyRows, runtime.records);
assert.strictEqual(runtime.counts.taxonomyRows, runtime.taxonomyRows.length);
assert.strictEqual(runtime.usage.records, total);

// 음성 사례는 영수증이 현재 원본과 맞는(재등록 대기가 아닌) 문항으로 건다. 재등록 대기 문항은 분류가 거절되지 않는다.
const historicalUid = [...nativeInputs.keys()].find(uid => historicalByUid.has(uid)) || historicalRows[0].questionUid;
const entry = byRuntimeUid.get(historicalUid)[0];
for (const [label, entries] of [
  ["deleted historical UID", []],
  ["duplicated historical UID", [entry, entry]],
  ["changed source ordinal", [{ ...entry, row: { ...entry.row, sourceOrdinal: entry.row.sourceOrdinal + 1 } }]],
  ["unapproved classification", [{ ...entry, row: { ...entry.row, templateKey: "TPL_UNAPPROVED_TEST" } }]],
  ["unapproved difficulty", [{ ...entry, row: { ...entry.row, difficultyBucket: 99 } }]]
]) {
  const changed = new Map(byRuntimeUid);
  changed.set(historicalUid, entries);
  assert.throws(() => verifyHistorical(changed), /AssertionError|missing|drift/, label);
}
for (const [label, rows] of [
  ["missing taxonomy tuple", runtime.taxonomyRows.slice(1)],
  ["duplicate taxonomy tuple", [...runtime.taxonomyRows, runtime.taxonomyRows[0]]],
  ["wrong taxonomy support", runtime.taxonomyRows.map((row, index) => index ? row : { ...row, supportingItemCount: row.supportingItemCount + 1 })],
  ["invented taxonomy tuple", runtime.taxonomyRows.map((row, index) => index ? row : { ...row, templateKey: "TPL_UNAPPROVED_TEST" })]
]) assert.throws(() => verifyTaxonomy(rows, runtime.records), /AssertionError/, label);

if (nativeInputs.size) {
  const input = nativeInputs.values().next().value;
  const cases = [
    ["approval flag without evidence", { current: { ...input.current, approvalEvidence: [] } }],
    ["unapproved metadata", { current: { ...input.current, metadataApprovalType: "UNREVIEWED" } }],
    ["changed UID", { identity: { ...input.identity, questionUid: "unregistered-uid" } }],
    ["changed source ordinal", { ordinal: input.ordinal + 1 }],
    ["changed source fingerprint", { identity: { ...input.identity, sourceFingerprint: "0".repeat(64) } }],
    ["wrong template parent", { registry: { ...input.registry, templates: new Map(input.registry.templates).set(input.current.templateKey,
      { ...input.registry.templates.get(input.current.templateKey), parentProblemTypeKey: "PT_UNAPPROVED_TEST" }) } }],
    ["changed student payload", { question: { ...input.question, content: "unreviewed payload" } }],
    ["changed source bytes", { nativeSource: { ...input.nativeSource, bytes: Buffer.concat([input.nativeSource.bytes, Buffer.from("\n")]) } }],
    ["changed Git blob", { nativeSource: { ...input.nativeSource, blobSha1: "0".repeat(40) } }],
    ["changed registered runtime", { nativeSource: { ...input.nativeSource, runtimeRecord: { ...input.nativeSource.runtimeRecord, difficultyBucket: 99 } } }],
    ["inactive runtime", { nativeSource: { ...input.nativeSource, runtimeStatus: "INACTIVE" } }],
    ["missing canonical approval", { canonicalCatalog: { canonicalAuthority: { advancedAssignmentsByUid: {} } } }]
  ];
  for (const [label, change] of cases) assert.throws(() => verifier.assertInputStrict({ ...input, ...change }, label), /AssertionError/, label);
  const copyRoot = fs.mkdtempSync(path.join(os.tmpdir(), "limit-native-proof-"));
  try {
    const relative = verifier.assertInputStrict(input);
    const proof = readJson(relative);
    for (const file of [relative, ...proof.approval.evidenceRefs.map(ref => ref.path)]) {
      const target = path.join(copyRoot, file);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(root, file), target);
    }
    const copied = { ...input, nativeSource: { ...input.nativeSource, root: copyRoot } };
    verifier.assertInputStrict(copied, "unchanged native evidence copy");
    fs.appendFileSync(path.join(copyRoot, proof.approval.evidenceRefs[0].path), "\n");
    assert.throws(() => verifier.assertInputStrict(copied, "evidence SHA drift"), /evidence bytes drifted/);
  } finally {
    fs.rmSync(copyRoot, { recursive: true, force: true });
  }
  console.log(`PASS ${nativeInputs.size} byte-bound registered native approvals and ${cases.length + 1} negative provenance cases`);
}
console.log(`PASS historical limit/continuity cohort: ${preserved.unchanged} unchanged + ${preserved.reviewedTransitions} reviewed transitions, ${preserved.staleSource} awaiting re-registration after a source edit; ${additions.length} reviewed additions; 9 cohort/taxonomy rejections`);

const compiledTaxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const compiledConcepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const ptLabels = new Map(compiledTaxonomy.problemTypes.map((r) => [r.problemTypeKey, r.canonicalLabelKo]));
const tplLabels = new Map(compiledTaxonomy.templates.map((r) => [r.templateKey, r.canonicalLabelKo]));
assert.strictEqual(ptLabels.has("PT_LIMIT_ORDER_SQUEEZE"), false);
assert.strictEqual(ptLabels.get("PT_LIMIT_VALUE_CALC"), "함수의 극한값 계산");
assert.strictEqual(tplLabels.get("TPL_LIMIT_SQUEEZE"), "함수의 대소 관계를 이용한 극한값 계산");
assert.strictEqual(tplLabels.get("TPL_PIECEWISE_RANGE_STITCH_BIJECTION"), "조각함수의 일대일대응 조건");
for (const key of ["TPL_CONT_DIFF_DEFINITION_PROOF", "TPL_PIECEWISE_RANGE_STITCH_BIJECTION"])
  assert(compiledTaxonomy.templates.some(row => row.templateKey === key && row.status === "ACTIVE"), key);
for (const key of ["CC_ABSOLUTE_VALUE_FUNCTION","CC_GREATEST_INTEGER_FUNCTION","CC_INVERSE_FUNCTION","CC_DERIVATIVE_VALUE","CC_DIFFERENTIABILITY","CC_SINE_LAW","CC_ZERO_MULTIPLICITY","CC_RADICAL_EXPRESSION","CC_ROOT_INTERSECTION_COUNT_FUNCTION","CC_FUNCTION_SYMMETRY"]) {
  assert(compiledConcepts.concepts.some((r) => r.conceptKey === key && r.status === "ACTIVE"), key);
}
const activeConceptKeys = new Set(compiledConcepts.concepts.filter((r) => r.status === "ACTIVE").map((r) => r.conceptKey));
assert.strictEqual(runtime.records.filter((r) => (r.crossConceptKeys || []).some((key) => !activeConceptKeys.has(key))).length, 0);

const bySource = new Map(catalog.records.map((r) => [sourceKey(r.sourceFile, r.sourceOrdinal), r]));
let direct = 0;
let repaired = 0;
let sourceReadyLimit = 0;
let sourceReadyContinuity = 0;
let sourceHoldLimit = 0;
let sourceHoldContinuity = 0;
let currentCanonicalEligible = 0;

for (const overlay of runtime.records) {
  const base = bySource.get(sourceKey(overlay.sourceArchiveFile, overlay.sourceOrdinal));
  assert(base, "catalog source row missing: " + overlay.sourceArchiveFile + "#" + overlay.sourceOrdinal);
  const identityRepair = base.questionUid !== overlay.questionUid;
  if (identityRepair) {
    assert.strictEqual(base.questionUid, "");
    assert.strictEqual(overlay.catalogIdentityRepairVerified, true);
    repaired += 1;
  } else {
    direct += 1;
  }
  const merged = {
    ...base,
    ...overlay,
    sourceFile: base.sourceFile,
    sourceOrdinal: base.sourceOrdinal,
    sourceQuestionNo: base.sourceQuestionNo,
    effectiveBrowseGrade: base.effectiveBrowseGrade,
    identityStatus: identityRepair ? "VERIFIED" : base.identityStatus,
    sourceStatus: identityRepair ? "VERIFIED" : base.sourceStatus,
    sourceFingerprint: base.sourceFingerprint,
    rawQuestionHash: base.rawQuestionHash,
    approvedSourceFingerprint: base.approvedSourceFingerprint,
    gradeConflict: base.gradeConflict,
    taxonomyStatus: "CONFIRMED",
    metadataConflicts: [],
    reviewStatus: "reviewed_pass"
  };
  const gate = assertCanonicalRuntimeGate(overlay, canonicalCatalog);
  if (gate.ok) currentCanonicalEligible += 1;
  const held = !identityRepair && base.sourceStatus !== "VERIFIED";
  if (held) assert(gate.reasons.includes("source_release"), overlay.questionUid);

  if (overlay.standardUnitKey === "H15-M2-01") {
    if (held) sourceHoldLimit += 1; else sourceReadyLimit += 1;
  } else {
    if (held) sourceHoldContinuity += 1; else sourceReadyContinuity += 1;
  }
}

assert.strictEqual(direct + repaired, total);
assert.strictEqual(sourceReadyLimit + sourceReadyContinuity + sourceHoldLimit + sourceHoldContinuity, total);
console.log(`PASS ${total} current canonical release gates checked: eligible=${currentCanonicalEligible}, sourceHold=${sourceHoldLimit + sourceHoldContinuity}`);

assert.strictEqual(C.finderCourseGrade("수학II", "2015"), "고2");
assert.strictEqual(C.finderCourseGrade("수학II", "2022"), "고3");
assert(C.finderCourseKeys(runtime.taxonomyRows, { grade: "고2", curriculumKey: "2015" }).has("수학II"));

const workspace = readWorkspace();
assert(/C\.subjectProjectionOptions\(filters\.grade\)/.test(workspace));
assert(/C\.finderMatches\(/.test(workspace));

const bridge = readText("archive/meta-foundation-runtime.js");
assert(bridge.includes("data/meta-foundation/runtime/limit-continuity-v1.json"));
assert(bridge.includes("Canonical.resolveCatalog"));
assert(bridge.includes("META_FOUNDATION_MULTI/runtime-bridge-v5:"));

const combined = [
  ...readJson("archive/data/meta-foundation/runtime/geometry-equations-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/sets-propositions-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/functions-graphs-v1.json").records,
  ...runtime.records,
  ...readJson("archive/data/meta-foundation/runtime/integral-calculus-v1.json").records,
  ...readJson("archive/data/meta-foundation/runtime/derivative-v1.json").records
];
// 하한(기준일 2026-11-02): 여섯 팩 합계. 등록이 늘면 자연히 증가한다.
assert(combined.length >= 2122, `combined runtime records shrank: ${combined.length}`);
const byPack = receipt.checked.existingRuntimeRecordsByPack;
assert.strictEqual(combined.length, ["GEOMETRY_EQUATIONS", "SETS_PROPOSITIONS", "FUNCTIONS_GRAPHS", "LIMIT_CONTINUITY", "INTEGRAL_CALCULUS", "DERIVATIVE"]
  .reduce((sum, id) => sum + byPack[id], 0));
assert.strictEqual(new Set(combined.map((r) => r.questionUid)).size, combined.length);
assert.strictEqual(new Set(combined.map((r) => sourceKey(r.sourceArchiveFile, r.sourceOrdinal))).size, combined.length);

assert.strictEqual(receipt.status, "ACTIVE");
assert.strictEqual(receipt.checked.combinedRuntimeRecords, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueUid, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedUniqueSourceIdentity, runtimeRecordCount);
assert.strictEqual(receipt.checked.limitContinuityCatalogJoin, total);
assert.strictEqual(receipt.checked.limitContinuityExistingCatalogUidJoin, direct);
assert.strictEqual(receipt.checked.limitContinuitySourceIdentityRepairJoin, repaired);
assert.strictEqual(receipt.checked.limitContinuityCatalogJoinMismatch, 0);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoin, runtimeRecordCount);
assert.strictEqual(receipt.checked.combinedRuntimeCatalogJoinMismatch, 0);
assert.strictEqual(receipt.checked.limitContinuityAutomaticEligibleExpected, historical.counts.automaticEligibleExpected);
assert(receipt.invariants.includes("Archive2 Finder and Compose grade routing treat 2015 수학II as 고2."));

console.log("PASS MathII limit/continuity Archive2 runtime bridge");
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
