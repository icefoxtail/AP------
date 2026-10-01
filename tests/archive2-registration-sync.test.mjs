import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const core = require("../archive/archive2-core.js");
const { catalog } = require("./helpers/archive2-scope-harness.cjs");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("parent-link refresh preserves valid L1/L2 evidence when release approval is unresolved", () => {
  const links = JSON.parse(read("archive/data/basic-scope-parent-links.json"));
  const link = links.sourceParents.find((row) => catalog.records.some((record) =>
    record.questionUid === row.questionUid && record.sourceStatus === "VERIFIED"));
  assert.ok(link, "test needs an existing reviewed source-parent assignment");
  const record = catalog.records.find((row) => row.questionUid === link.questionUid);
  const releaseHeld = {
    ...record,
    sourceStatus: "HOLD",
    sourceFingerprint: "updated-answer-solution-release-fingerprint",
  };

  assert.equal(core.Canonical.validateBasicAssignment(releaseHeld, catalog.canonicalAuthority).ok, true,
    "L1/L2 classification evidence is separate from the full source/solution release gate");
  assert.equal(core.basicEligibility(releaseHeld, { canonicalAuthority: catalog.canonicalAuthority }).ok, false,
    "an unverified release must still block current BASIC selection");
  assert.ok(core.basicEligibility(releaseHeld, { canonicalAuthority: catalog.canonicalAuthority }).reasons.includes("source_release"));

  const generator = read("archive/tools/build-basic-scope-parent-links.mjs");
  const start = generator.indexOf("for (const link of existingParentLinks.sourceParents || [])");
  const end = generator.indexOf("sourceParents.splice", start);
  assert.ok(start >= 0 && end > start, "test locates the existing-link refresh path");
  const preservation = generator.slice(start, end);
  assert.match(preservation, /validateBasicAssignment\(item,/,
    "link generation must verify the reviewed assignment without using the release gate");
  assert.doesNotMatch(preservation, /basicEligibility\(item,/,
    "a release HOLD must not erase valid taxonomy assignment evidence");
  assert.doesNotMatch(preservation, /link\.sourceFingerprint\s*===\s*item\.sourceFingerprint/,
    "full answer/solution release changes must not invalidate the separate assignment fingerprint");
});

test("catalog assignment evidence follows the problem fingerprint, not the full release fingerprint", () => {
  const builder = read("archive/tools/build-archive2-catalog.mjs");
  assert.match(builder, /link\.assignmentFingerprint/,
    "per-item L1/L2 source links must carry the classification fingerprint");
  assert.doesNotMatch(builder, /link\.sourceFingerprint\s*===\s*meta\.sourceFingerprint/,
    "answer/solution-only source changes must not revoke an otherwise current L1/L2 assignment");
});

test("reviewed path-and-ordinal scope links materialize verified UID assignments", () => {
  const sourceLinks = JSON.parse(read("archive/data/basic-scope-source-links.json"));
  const middle1Stats = sourceLinks.records.filter((link) =>
    link.grade === "중1" && link.curriculumKey === "2022" && link.courseKey === "M1-2");
  assert.equal(middle1Stats.length, 16, "fixture covers the manually reviewed statistics links");

  for (const link of middle1Stats) {
    const record = catalog.records.find((row) =>
      row.sourceFile === link.sourceFile && row.sourceOrdinal === link.sourceOrdinal);
    assert.ok(record, `${link.sourceFile}#${link.sourceOrdinal} resolves to a current catalog record`);
    assert.equal(record.identityStatus, "VERIFIED");
    assert.equal(record.sourceGrade, link.grade);
    assert.equal(record.assignmentFingerprint, link.sourceBodyFingerprint,
      "the reviewed L1/L2 link and current source agree on the classification fingerprint");
    assert.equal(record.metadataAssignmentEvidence?.assignmentFingerprint, link.sourceBodyFingerprint,
      "the approved metadata classification joins through the same source identity");

    const assignment = core.Canonical.validateBasicAssignment(record, catalog.canonicalAuthority);
    assert.equal(assignment.ok, true,
      `${link.sourceFile}#${link.sourceOrdinal}: ${assignment.reasons.join(",")}`);
    assert.equal(assignment.parent?.grade, link.grade);
    assert.equal(assignment.parent?.curriculumKey, link.curriculumKey);
    assert.equal(assignment.parent?.courseKey, link.courseKey);
    assert.equal(assignment.parent?.L1, link.L1);
    assert.equal(assignment.parent?.L2, link.L2);

    if (record.sourceStatus === "HOLD") {
      const eligibility = core.basicEligibility(record, { canonicalAuthority: catalog.canonicalAuthority });
      assert.equal(eligibility.ok, false, "a valid classification link cannot bypass the release gate");
      assert.ok(eligibility.reasons.includes("source_release"));
    }
  }
});

test("normal registration sync refreshes parent links and then rebuilds the bound catalog", () => {
  const source = read("archive/build_db.py");
  const start = source.indexOf("def run_archive_registration_sync():");
  assert.ok(start >= 0, "registration sync entrypoint exists");
  const sync = source.slice(start);
  const runtimeRename = sync.indexOf("sync-runtime-source-path-renames.mjs");
  const parentLinks = sync.indexOf("build-basic-scope-parent-links.mjs");
  const catalogWrites = [...sync.matchAll(/build-archive2-catalog\.mjs/g)]
    .map((match) => match.index)
    .filter((index) => !sync.slice(index, index + 80).includes("--check"));
  const catalogCheck = sync.indexOf('build-archive2-catalog.mjs", "--check"');

  assert.ok(runtimeRename >= 0 && runtimeRename < parentLinks,
    "runtime input renames must finish before parent links are regenerated");
  assert.ok(catalogWrites.length > 0 && runtimeRename < catalogWrites[0],
    "an intermediate catalog/manifest must include any runtime rename before parent-link generation");
  assert.ok(catalogWrites.some((index) => index < parentLinks),
    "a current intermediate catalog/manifest must be materialized before the parent-link generator consumes it");
  assert.ok(catalogWrites.some((index) => index > parentLinks),
    "the final catalog/manifest must be rebuilt after parent links change");
  assert.ok(catalogCheck > catalogWrites.find((index) => index > parentLinks),
    "the generated final catalog must then pass the stale check");
});

test("parent-link generation binds stable authority inputs instead of its own final catalog hash", () => {
  const generator = read("archive/tools/build-basic-scope-parent-links.mjs");
  assert.match(generator, /authorityInputsSha256/,
    "parent-link provenance must identify the manifest-listed authority inputs");
  assert.doesNotMatch(generator, /generatedAgainst:\s*\{\s*catalogSha256:/,
    "the generated parent links cannot fingerprint the catalog that fingerprints those links");
});
