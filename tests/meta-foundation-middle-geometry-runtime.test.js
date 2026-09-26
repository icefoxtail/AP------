const assert = require("assert");
const fs = require("fs");
const path = require("path");
const Archive2Core = require("../archive/archive2-core.js");

const root = path.resolve(__dirname, "..");
const readJson = (relative) => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const sourceKey = (file, ordinal) => Archive2Core.normalizeFile(file) + "#" + Number(ordinal);
const runtimePath = "archive/data/meta-foundation/runtime/middle-geometry-v1.json";
const catalog = Archive2Core.decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const bridge = fs.readFileSync(path.join(root, "archive/meta-foundation-runtime.js"), "utf8");
assert(bridge.includes("data/meta-foundation/runtime/middle-geometry-v1.json"));
assert(bridge.includes('reviewStatus: overlay.reviewStatus || "reviewed_pass"'));
const runtime = readJson(runtimePath);
const taxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const concepts = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const conditions = readJson("archive/data/meta-foundation/compiled/condition_registry.json");
const bindings = readJson("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const runtimeReceipt = readJson("archive/data/meta-foundation/runtime/runtime-bridge-receipt.json");

assert.strictEqual(runtime.status, "ACTIVE");
assert.strictEqual(runtime.packId, "MIDDLE_GEOMETRY");
assert.strictEqual(runtime.packVersion, "1.0.0");
assert.strictEqual(runtime.records.length, 928);
assert.strictEqual(runtime.counts.records, 928);
assert.strictEqual(runtime.counts.finalL3, 921);
assert.strictEqual(runtime.counts.finalL4, 901);
assert.strictEqual(runtime.counts.explicitL4Hold, 20);
assert.strictEqual(runtime.counts.routeOut, 7);
assert.strictEqual(runtimeReceipt.checked.combinedRuntimeRecords, 5087);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueUid, 5087);
assert.strictEqual(runtimeReceipt.checked.combinedUniqueSourceIdentity, 5087);
assert.strictEqual(runtimeReceipt.checked.middleGeometryCatalogJoin, 928);
assert.strictEqual(runtimeReceipt.checked.metaFoundationRuntimePackCount, 10);
assert.strictEqual(new Set(runtime.records.map((row) => row.questionUid)).size, 928);
assert.strictEqual(new Set(runtime.records.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, 928);
assert.strictEqual(runtime.records.filter((row) => row.metaFoundationL3Status === "FINAL").length, 921);
assert.strictEqual(runtime.records.filter((row) => row.metaFoundationL4Status === "FINAL").length, 901);
assert.strictEqual(runtime.records.filter((row) => row.metaFoundationL4Status === "EXPLICIT_HOLD").length, 20);
assert.strictEqual(runtime.records.filter((row) => row.metaFoundationL3Status === "ROUTE_OUT").length, 7);

const byUid = new Map(catalog.records.map((row) => [row.questionUid, row]));
const bySource = new Map(catalog.records.map((row) => [sourceKey(row.sourceFile, row.sourceOrdinal), row]));
assert.strictEqual(runtime.records.filter((row) => {
  const direct = byUid.get(row.questionUid);
  const source = bySource.get(sourceKey(row.sourceArchiveFile, row.sourceOrdinal));
  return direct && source && direct.questionUid === source.questionUid &&
    sourceKey(direct.sourceFile, direct.sourceOrdinal) === sourceKey(row.sourceArchiveFile, row.sourceOrdinal);
}).length, 928);

const activePT = new Map(taxonomy.problemTypes.filter((row) => row.status === "ACTIVE").map((row) => [row.problemTypeKey, row]));
const bindingKeys = new Set(bindings.bindings.map((row) => [row.curriculum, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join("|")));
const activeTemplates = new Map(taxonomy.templates.filter((row) => row.status === "ACTIVE").map((row) => [row.templateKey, row]));
const activeConcepts = new Set(concepts.concepts.filter((row) => row.status === "ACTIVE").map((row) => row.conceptKey));
const activeConditions = new Set(conditions.conditions.filter((row) => row.status === "ACTIVE").map((row) => row.conditionKey));
for (const row of runtime.records) {
  if (row.metaFoundationL3Status === "FINAL") {
    assert(bindingKeys.has([row.curriculumKey, row.standardUnitKey, row.subUnitKey, row.problemTypeKey].join("|")), row.questionUid);
  }
  if (row.metaFoundationL3Status === "ROUTE_OUT") {
    assert.strictEqual(row.problemTypeKey, null);
    assert.strictEqual(row.templateKey, null);
    assert.strictEqual(row.defaultSelectable, false);
  } else {
    assert(activePT.has(row.problemTypeKey), row.problemTypeKey);
    if (row.metaFoundationL4Status === "FINAL") {
      assert(activeTemplates.has(row.templateKey), row.templateKey);
      assert.strictEqual(activeTemplates.get(row.templateKey).parentProblemTypeKey, row.problemTypeKey);
    } else {
      assert.strictEqual(row.metaFoundationL4Status, "EXPLICIT_HOLD");
      assert.strictEqual(row.templateKey, null);
      assert.strictEqual(row.defaultSelectable, true); // L4 absence is an advanced diagnostic.
    }
  }
  for (const key of row.crossConceptKeys || []) assert(activeConcepts.has(key), key);
  for (const key of row.conditionKeys || []) assert(activeConditions.has(key), key);
  if (row.reviewStatus === "manual_review") assert.strictEqual(row.defaultSelectable, false, row.questionUid);
}

const uid513 = "qid_v1_e4ba2b9da32f044d69365ba770f627de7a5c507022acc721246243608a99f94a";
const q513 = runtime.records.find((row) => row.questionUid === uid513);
assert(q513);
assert.strictEqual(q513.standardUnitKey, "M3-05");
assert.strictEqual(q513.subUnitKey, "M3-05-TRIG_RATIO_APPLICATION");
assert.strictEqual(q513.problemTypeKey, "PT_TRIG_RATIO_APPLICATION");
assert.strictEqual(q513.templateKey, "TPL_TRIG_APPLICATION_DIRECT_MEASURE");

const globalRuntime = [
  "geometry-equations-v1.json", "sets-propositions-v1.json", "functions-graphs-v1.json",
  "limit-continuity-v1.json", "integral-calculus-v1.json", "derivative-v1.json",
  "probability-statistics-v1.json", "middle-geometry-v1.json"
].flatMap((name) => readJson("archive/data/meta-foundation/runtime/" + name).records);
assert.strictEqual(new Set(globalRuntime.map((row) => row.questionUid)).size, globalRuntime.length);
assert.strictEqual(new Set(globalRuntime.map((row) => sourceKey(row.sourceArchiveFile, row.sourceOrdinal))).size, globalRuntime.length);

const maesan = catalog.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_공통수학2.js"));
assert.strictEqual(maesan.length, 23);

console.log("PASS Middle Geometry production runtime, canonical joins, HOLD/ROUTE_OUT policy, and Archive2 join");


(async () => {
  const vm = require("vm");
  const contextWindow = {
    __ARCHIVE_METADATA_READY__: Promise.resolve({ records: [] }),
    Archive2Core
  };
  const context = vm.createContext({
    window: contextWindow,
    document: { baseURI: "https://archive.test/" },
    URL,
    Promise,
    fetch: async (url) => {
      const relative = new URL(url).pathname.slice(1);
      const localPath = path.join(root, "archive", relative);
      return {
        ok: fs.existsSync(localPath),
        status: fs.existsSync(localPath) ? 200 : 404,
        json: async () => readJson(path.relative(root, localPath).split(String.fromCharCode(92)).join("/"))
      };
    },
    console
  });
  vm.runInContext(bridge, context, { filename: "archive/meta-foundation-runtime.js" });
  await contextWindow.__META_FOUNDATION_RUNTIME_READY__;
  const overlaid = await contextWindow.applyArchiveMetaFoundationCatalog(catalog);
  const joined = overlaid.records.filter((row) => row.metaFoundationPackId === "MIDDLE_GEOMETRY");
  assert.strictEqual(joined.length, 928);
  assert.strictEqual(new Set(joined.map((row) => row.questionUid)).size, 928);
  assert.strictEqual(new Set(joined.map((row) => sourceKey(row.sourceFile, row.sourceOrdinal))).size, 928);
  const explicitHold = joined.find((row) => row.metaFoundationL4Status === "EXPLICIT_HOLD");
  assert(explicitHold);
  assert.strictEqual(explicitHold.defaultSelectable, true);
  assert.strictEqual(explicitHold.reviewStatus, "reviewed_pass");
  assert.strictEqual(Archive2Core.eligibility(explicitHold).ok, runtime.records.find(r => r.questionUid === explicitHold.questionUid).runtimeSelectable);
  const routeOut = joined.find((row) => row.metaFoundationL3Status === "ROUTE_OUT");
  assert(routeOut);
  assert.strictEqual(routeOut.problemTypeKey, null);
  assert.strictEqual(routeOut.templateKey, null);
  assert.strictEqual(routeOut.defaultSelectable, false);
  assert.strictEqual(routeOut.reviewStatus, "manual_review");
  assert.strictEqual(overlaid.records.filter((row) => String(row.sourceFile).includes("25_매산여고_2학기_중간_고1_공통수학2.js")).length, 23);
  console.log("PASS live Meta Foundation bridge applies all 928 rows and preserves explicit holds");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
