const assert = require("assert");
const path = require("path");
const { pathToFileURL } = require("url");
const { spawnSync } = require("child_process");

(async () => {
  const root = path.resolve(__dirname, "..");
  const compiler = path.join(root, "archive", "tools", "meta-foundation", "compile-meta-foundation.mjs");

  const syntax = spawnSync(process.execPath, ["--check", compiler], { cwd: root, encoding: "utf8" });
  assert.strictEqual(syntax.status, 0, syntax.stderr || syntax.stdout);

  const mod = await import(pathToFileURL(compiler).href);
  const collisions = mod.findAliasCollisions([
    { alias: "중점", canonicalKey: "CC_MIDPOINT", canonicalKind: "crossConcept", status: "ACTIVE" },
    { alias: "중점", canonicalKey: "PT_COORD_MIDPOINT", canonicalKind: "problemType", status: "ACTIVE" }
  ]);
  assert.strictEqual(collisions.length, 1);
  assert.strictEqual(collisions[0].alias, "중점");
  assert.deepStrictEqual(collisions[0].targets, [
    { canonicalKey: "CC_MIDPOINT", canonicalKind: "crossConcept" },
    { canonicalKey: "PT_COORD_MIDPOINT", canonicalKind: "problemType" }
  ]);

  const sameTarget = mod.findAliasCollisions([
    { alias: "중점", canonicalKey: "CC_MIDPOINT", canonicalKind: "crossConcept", status: "ACTIVE" },
    { alias: "중점", canonicalKey: "CC_MIDPOINT", canonicalKind: "crossConcept", status: "ACTIVE" }
  ]);
  assert.strictEqual(sameTarget.length, 0);

  const check = spawnSync(process.execPath, [compiler, "--check"], { cwd: root, encoding: "utf8" });
  assert.strictEqual(check.status, 0, check.stderr || check.stdout);
  const report = JSON.parse(check.stdout.trim());
  assert.deepStrictEqual(report, {
    status: "PASS",
    aliasCollisionCount: 0,
    duplicateCanonicalKeyCount: 0,
    brokenL4ParentCount: 0,
    brokenL2L3BindingCount: 0,
    unregisteredL3Count: 0,
    unregisteredL4Count: 0,
    unregisteredCrossConceptCount: 0,
    unregisteredConditionCount: 0,
    foundationAssignmentCount: 400,
    runtimeRecordCount: 400,
    runtimeMappingMismatchCount: 0
  });

  console.log("PASS meta-foundation global compile gate");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
