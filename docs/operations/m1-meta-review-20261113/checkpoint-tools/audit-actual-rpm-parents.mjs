import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";

// Read-only metadata audit. This does not invoke registration, full Consumer
// verification, the solution resolver, or any mathematical review.
const [rootArg, requestArg, ledgerArg, outputArg] = process.argv.slice(2);
if (!rootArg || !requestArg || !ledgerArg || !outputArg)
  throw new Error("Usage: node checker.mjs ROOT REQUEST SEMANTIC_LEDGER OUTPUT_JSON");
const root = path.resolve(rootArg);
const requestPath = path.resolve(requestArg);
const ledgerPath = path.resolve(ledgerArg);
const outputPath = path.resolve(outputArg);
if (!outputPath.includes("/.tmp/m1-meta-review/"))
  throw new Error("Only a .tmp/m1-meta-review output is permitted");
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const equal = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const compact = value => String(value ?? "").normalize("NFC").replace(/\s/g, "");
const req = readJson(requestPath), ledger = readJson(ledgerPath);
const ledgerByOrdinal = new Map(ledger.items.map(row => [row.ordinal, row]));
const failures = [], observations = [], rows = [];
if (req.items.length !== req.expectedQuestionCount || ledgerByOrdinal.size !== req.expectedQuestionCount)
  throw new Error("Request/semantic ordinal count mismatch");
if (new Set(req.items.map(row => row.questionUid)).size !== req.expectedQuestionCount)
  throw new Error("Request UID is not unique");
const sourcePath = path.join(root, "archive/exams", req.sourceArchiveFile.replace(/^archive\/exams\//, ""));
const evidenceFiles = {
  request: requestPath,
  semanticLedger: ledgerPath,
  source: sourcePath,
  canonicalInputManifest: path.join(root, "archive/data/archive2-canonical-input-manifest.json"),
  rpmMiddleHelper: path.join(root, "archive/rpm-middle-toc.js"),
  rpmMiddleParents: path.join(root, "archive/data/meta-foundation/canonical/rpm-middle-2022-parents.json"),
  unifiedUnits: path.join(root, "archive/archive2-unified-units.js"),
  officialConsumerLoader: path.join(root, "archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs"),
};
const beforeHashes = Object.fromEntries(Object.entries(evidenceFiles).map(([key, file]) => [key, hash(file)]));
const { loadResolvedConsumerCatalog } = await import(pathToFileURL(evidenceFiles.officialConsumerLoader));
const require = createRequire(import.meta.url);
const toc = require(evidenceFiles.rpmMiddleHelper);
const units = require(evidenceFiles.unifiedUnits);
const catalog = loadResolvedConsumerCatalog(root);
const decode = value => Array.isArray(value) && value.length === 1 && Number.isInteger(value[0]) && catalog.strings?.[value[0]] !== undefined
  ? catalog.strings[value[0]] : value;
const targetUids = new Set(req.items.map(item => item.questionUid));
const byUid = new Map();
for (const input of catalog.records) {
  const record = catalog.encoding === "column-dictionary-v1" && Array.isArray(input)
    ? Object.fromEntries(catalog.columns.map((key, index) => [key, decode(input[index])])) : input;
  if (!targetUids.has(record.questionUid)) continue;
  if (byUid.has(record.questionUid)) throw new Error("Actual target UID is not unique");
  byUid.set(record.questionUid, record);
}
const parentSummary = result => result?.parent ? {
  key: result.parent.key, unitKey: result.parent.unitKey,
  courseKey: result.parent.courseKey, L1: result.parent.L1, L2: result.parent.L2,
} : null;
const matchesExpectedParent = (actual, expected) => actual && expected &&
  compact(actual.L1) === compact(expected.majorUnit) && compact(actual.L2) === compact(expected.midUnit) &&
  actual.courseKey === expected.scope;
for (const item of [...req.items].sort((a, b) => a.sourceOrdinal - b.sourceOrdinal)) {
  const ordinal = item.sourceOrdinal, semantic = ledgerByOrdinal.get(ordinal), actual = byUid.get(item.questionUid);
  const fail = (reason, detail = {}) => failures.push({ ordinal, reason, ...detail });
  if (!semantic || semantic.questionUid !== item.questionUid) { fail("SEMANTIC_ORDINAL_UID_MISMATCH"); continue; }
  if (!actual) { fail("ACTUAL_TARGET_RECORD_MISSING"); continue; }
  if (actual.sourceOrdinal !== ordinal || actual.sourceFile !== req.sourceArchiveFile)
    fail("ACTUAL_SOURCE_IDENTITY_MISMATCH", { actualOrdinal: actual.sourceOrdinal, actualSourceFile: actual.sourceFile });
  const nativeFields = ["standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey"];
  const nativeDifferences = nativeFields.filter(key => !equal(actual[key], semantic.after[key]));
  for (const key of nativeFields) {
    if (!equal(item.after[key], semantic.after[key])) fail("REQUEST_NATIVE_SEMANTIC_MISMATCH", { field: key });
  }
  if (nativeDifferences.length) fail("ACTUAL_NATIVE_VALUE_MISMATCH", { fields: nativeDifferences });
  if (actual.curriculumKey !== "2022" || actual.courseKey !== semantic.courseScope)
    fail("ACTUAL_CURRICULUM_COURSE_MISMATCH", { curriculumKey: actual.curriculumKey, courseKey: actual.courseKey });
  const exactExpected = Boolean(semantic.after.rpmPrimaryPath);
  if (!equal(item.after.rpmPrimaryPath ?? null, semantic.after.rpmPrimaryPath ?? null))
    fail("REQUEST_RPM_PATH_SEMANTIC_MISMATCH");
  const expected = toc.resolveRecord({ ...item.after, sourceGrade: "중1" }, "중1");
  const effective = toc.resolveRecord(actual, "중1");
  const classification = units.classify(actual), entry = classification.entry;
  const actualParent = parentSummary(effective);
  const actualRpmEvidence = [
    ["rpmPrimaryPath", actual.rpmPrimaryPath],
    ["rpmSemantic", actual.rpmSemantic],
    ["boundRpmMetadata", actual.metadataAssignmentEvidence?.rpmMetadata],
    ["rpmMetadata", actual.rpmMetadata],
    ["rpmFields", { L1: actual.rpmL1, L2: actual.rpmL2, L3: actual.rpmL3, L4: actual.rpmL4 }],
  ].filter(([, value]) => value && typeof value === "object")
    .map(([basis, value]) => ({ basis, path: toc.normalizePath(value) }))
    .filter(row => ["L1", "L2", "L3", "L4"].some(key => row.path[key]));
  if (exactExpected) {
    if (expected.status !== "EXACT" || expected.granularity !== "LEAF" ||
        effective.status !== "EXACT" || effective.granularity !== "LEAF" ||
        expected.baseLeafKey !== effective.baseLeafKey || expected.parentKey !== effective.parentKey ||
        !equal(expected.basePath, effective.basePath) || !equal(expected.effectivePath, effective.effectivePath))
      fail("ACTUAL_EXACT_LEAF_OR_PARENT_MISMATCH", { expectedStatus: expected.status, actualStatus: effective.status });
    if (!matchesExpectedParent(actualParent, semantic.effectiveParent))
      fail("ACTUAL_PARENT_DIFFERS_FROM_REVIEWED_EFFECTIVE_PARENT", { actualParent, reviewedParent: semantic.effectiveParent });
    if (entry?.rpmParentStatus !== "EXACT" || entry.rpmParent?.key !== effective.parentKey || entry.unitKey !== effective.unitKey)
      fail("UNIFIED_SELECTION_PARENT_MISMATCH", { actualStatus: entry?.rpmParentStatus, actualUnitKey: entry?.unitKey });
    if (!effective.crosswalkRecordIds?.includes(semantic.rpmBaseLeafRecordId))
      fail("BASE_LEAF_RECORD_ID_MISMATCH", { expectedBaseLeafRecordId: semantic.rpmBaseLeafRecordId });
  } else {
    if (actualRpmEvidence.length || effective.baseLeafKey || effective.granularity === "LEAF")
      fail("RPM_DEBT_REPLACED_WITH_EXPLICIT_RPM_OR_LEAF", { actualRpmEvidence, granularity: effective.granularity });
    if (effective.status === "EXACT" && !matchesExpectedParent(actualParent, semantic.effectiveParent))
      fail("RPM_DEBT_PARENT_DISPLAYS_WRONG_PARENT", { actualParent, reviewedParent: semantic.effectiveParent });
    if (entry?.rpmParent && !matchesExpectedParent(entry.rpmParent, semantic.effectiveParent))
      fail("RPM_DEBT_UNIFIED_PARENT_DISPLAYS_WRONG_PARENT");
    if (effective.status !== "EXACT") observations.push({ ordinal, kind: "RPM_DEBT_PARENT_UNRESOLVED",
      status: effective.status, reason: effective.reason, candidateParentKeys: effective.candidateParentKeys || [],
      expectedNativeParent: semantic.effectiveParent, uiUnitLabel: entry?.unitLabel || null });
  }
  rows.push({ ordinal, questionUid: item.questionUid,
    actualNative: Object.fromEntries(nativeFields.map(key => [key, actual[key] ?? null])),
    nativeMatchesSemantic: nativeDifferences.length === 0,
    actualCurriculumKey: actual.curriculumKey, actualCourseKey: actual.courseKey,
    canonicalParentLabels: { L1: actual.L1 ?? null, L2: actual.L2 ?? null },
    expectedEffectiveParent: semantic.effectiveParent,
    exactLeafExpected: exactExpected, expectedBaseLeafRecordId: semantic.rpmBaseLeafRecordId ?? null,
    actualRpmEvidence, rpmStatus: effective.status, rpmReason: effective.reason,
    rpmBasis: effective.basis || null, rpmGranularity: effective.granularity || null,
    actualBaseLeafKey: effective.baseLeafKey || null,
    actualBasePath: effective.basePath || null, actualEffectivePath: effective.effectivePath || null,
    actualEffectiveParent: actualParent,
    unified: { placed: classification.placed, rpmParentStatus: entry?.rpmParentStatus || null,
      unitKey: entry?.unitKey || null, unitLabel: entry?.unitLabel || null,
      parentKey: entry?.rpmParent?.key || null, parentL2: entry?.rpmParent?.L2 || null },
  });
}
const afterHashes = Object.fromEntries(Object.entries(evidenceFiles).map(([key, file]) => [key, hash(file)]));
if (!equal(beforeHashes, afterHashes)) failures.push({ reason: "INPUT_CHANGED_DURING_READ_ONLY_AUDIT" });
const debtOrdinals = rows.filter(row => !row.exactLeafExpected).map(row => row.ordinal);
if (rows.length !== 23 || rows.filter(row => row.exactLeafExpected).length !== 19 || !equal(debtOrdinals, [2, 3, 4, 16]))
  failures.push({ reason: "WANGUN_REVIEW_COUNTS_MISMATCH", observedRows: rows.length, debtOrdinals });
const parentCounts = {};
for (const row of rows) {
  const parent = row.actualEffectiveParent;
  const key = parent ? `${parent.courseKey} / ${parent.L1} / ${parent.L2} (${row.rpmGranularity})` : `unresolved: ${row.rpmStatus}`;
  parentCounts[key] = (parentCounts[key] || 0) + 1;
}
const report = {
  schemaVersion: "existing-exam-actual-rpm-parent-native-audit-v2", observedAt: new Date().toISOString(),
  status: failures.length ? "FAIL" : "PASS", scope: "ISOLATED_POST_REGISTRATION_READ_ONLY",
  worktree: root, baseCommit: execFileSync("git", ["-C", root, "rev-parse", "HEAD"], {
    encoding: "utf8", env: { ...process.env, GIT_OPTIONAL_LOCKS: "0", GIT_NO_LAZY_FETCH: "1" },
  }).trim(),
  requestId: req.requestId,
  evidence: Object.fromEntries(Object.entries(evidenceFiles).map(([key, file]) => [key, { path: file, sha256: beforeHashes[key] }])),
  allInputHashesUnchanged: equal(beforeHashes, afterHashes),
  questionCount: rows.length, nativeValueMatches: rows.filter(row => row.nativeMatchesSemantic).length,
  exactLeafCount: rows.filter(row => row.exactLeafExpected).length, rpmDebtOrdinals: debtOrdinals,
  parentCounts, rows, observations, failures,
  path: "digest-checked loadResolvedConsumerCatalog -> target UID metadata -> RPMMiddleToc.resolveRecord + Archive2UnifiedUnits.classify",
  officialConsumerVerificationRepeated: false, actualRpmSolutionResolver: "NOT_RUN_UNVERIFIED_SOLUTION",
  sourceOrCanonicalMutation: false, indexOrRefsMutation: false, fullR1R2R3Rerun: false,
  noRemoteMainOrPublicationClaim: true,
};
const bytes = JSON.stringify(report, null, 2) + "\n";
if (fs.existsSync(outputPath) && fs.readFileSync(outputPath, "utf8") !== bytes)
  throw new Error("Refusing to overwrite an existing different report");
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, bytes);
console.log(JSON.stringify({ status: report.status, outputPath, sha256: hash(outputPath),
  questionCount: report.questionCount, nativeValueMatches: report.nativeValueMatches,
  exactLeafCount: report.exactLeafCount, rpmDebtOrdinals: report.rpmDebtOrdinals,
  parentCounts, observations, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
