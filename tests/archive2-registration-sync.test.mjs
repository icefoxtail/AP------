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
  const readinessWrite = sync.indexOf('refresh-runtime-source-readiness.mjs", "--write"');
  const readinessCheck = sync.indexOf('refresh-runtime-source-readiness.mjs", "--check"');
  assert.ok(readinessWrite > catalogCheck,
    "runtime readiness must bind the final verified catalog, after registration changes its version");
  assert.ok(readinessCheck > readinessWrite,
    "the refreshed readiness receipt must pass its unchanged stale check");
});

test("PR Sync reuses exact CI data proof without another generator or remote write", () => {
  const workflow = read(".github/workflows/archive-registration-sync.yml");
  const sync = workflow.slice(workflow.indexOf("  sync:"));
  assert.match(workflow, /permissions:\n  contents: read\n  actions: read/);
  assert.match(sync, /persist-credentials: false/);
  assert.match(workflow, /^on:\n  pull_request:/m);
  assert.doesNotMatch(workflow, /^  (?:push|schedule|workflow_dispatch|repair):/m);
  assert.doesNotMatch(sync, /(?:contents|actions|pull-requests): write|git commit|git push|workflow.*dispatches|gh workflow run/);
  assert.doesNotMatch(workflow, /PR_HEAD_REF|Persist generated registration outputs on PR branch|git apply --index|create-pull-request/);
  assert.match(sync, /timeout-minutes: 35/);
  assert.match(sync, /archive-pr-registration-proof\.mjs consume .*--timeout-seconds 1500 --poll-seconds 30/);
  const consume = sync.slice(sync.indexOf('      - name: Reuse the exact CI registration data proof'),
    sync.indexOf('      - name: Set up Chrome for the direct original exam check'));
  assert.doesNotMatch(consume, /continue-on-error:/, 'missing or failed CI proof must block Sync');
  assert.match(consume, /GITHUB_TOKEN: \$\{\{ github\.token \}\}/);
  assert.doesNotMatch(sync, /setup-python|build_db\.py|materialize-meta-v2-payloads\.mjs|verify-archive-registration\.mjs|registration\.patch|git add|git diff --binary/);
  for (const file of ['archive-question-identity-contract.test.mjs', 'archive-question-identity-runtime.test.mjs',
    'jeil-legacy-similar-22-registration.test.cjs', 'palma-legacy-similar-23-registration.test.cjs']) {
    assert.ok(!sync.includes(file), `duplicate registration checker in Sync: ${file}`);
  }
  assert.match(sync, /source_sha: \$\{\{ steps\.registration_proof\.outputs\.source_sha \}\}/);
  assert.match(sync, /git rev-parse HEAD > \"?\$preview\/source\.sha/);
  assert.match(sync, /ci_run_id|CI_RUN_ID/);
  assert.match(sync, /CI_ARTIFACT_DIGEST: \$\{\{ steps\.registration_proof\.outputs\.artifact_digest \}\}/);
  assert.match(sync, /generatedDataIncluded: false/);
  assert.match(sync, /actions\/upload-artifact@v4/);
});

test('advisory metadata/search diagnostics move to the CI projection while direct original Chrome remains required', () => {
  const sync = read('.github/workflows/archive-registration-sync.yml');
  const ci = read('.github/workflows/ci.yml');
  assert.doesNotMatch(sync, /meta_v2_diagnostics|original_search_diagnostics|archive-original-search-exposure\.browser\.cjs\n/);
  for (const id of ['meta_v2_diagnostics', 'original_search_diagnostics']) {
    assert.match(ci, new RegExp(`id: ${id}\\n\\s+continue-on-error: true`));
    assert.ok(ci.includes(`steps.${id}.outcome`), `report actual ${id} outcome, not its continued conclusion`);
  }
  assert.match(ci, /tests\/archive-meta-v2-materializer\.test\.mjs/);
  assert.match(ci, /tests\/archive2-meta-v2-semantic-authority\.test\.cjs/);
  assert.match(ci, /materialize-meta-v2-payloads\.mjs --check/);
  assert.match(ci, /tests\/archive-original-search-exposure\.browser\.cjs/);
  const chrome = sync.slice(sync.indexOf('      - name: Verify original exam opens for students in actual Chrome'),
    sync.indexOf('      - name: Set up real Chrome for Jeil print QA'));
  assert.match(chrome, /id: original_chrome_check/);
  assert.match(chrome, /run: node tests\/archive-original-exam-access\.browser\.cjs/);
  assert.doesNotMatch(chrome, /continue-on-error:|if:/);
  assert.match(sync, /CHROME_OUTCOME: \$\{\{ steps\.original_chrome_check\.outcome \}\}/);
});

test('CI produces one data-only proof for affected PRs and uploads it only after its real test job succeeds', () => {
  const ci = read('.github/workflows/ci.yml');
  assert.match(ci, /prRegistrationProofNeeded\(scope\.changedFiles\)/);
  assert.match(ci, /if: github\.event_name == 'pull_request' && steps\.registration_scope\.outputs\.needed == 'true'\n\s+id: registration_proof/);
  assert.equal((ci.match(/archive-pr-registration-proof\.mjs produce/g) || []).length, 1);
  assert.doesNotMatch(ci, /node --test tests\/archive-pr-registration-(?:prepare|proof)\.test\.mjs/);
  assert.match(ci, /if: github\.event_name == 'push' && steps\.scope\.outputs\.prepare_projection == 'true'\n\s+run: node tools\/ci\/archive-pr-registration-prepare\.mjs/);
  assert.match(ci, /ARCHIVE_PR_REGISTRATION_PROOF: \$\{\{ steps\.registration_proof\.outputs\.proof_file \}\}/);
  const upload = ci.slice(ci.indexOf('      - name: Upload the registration data proof'));
  assert.ok(ci.indexOf('      - name: Run tests') < ci.indexOf('      - name: Upload the registration data proof'));
  assert.match(upload, /if: steps\.registration_proof\.outputs\.registration_data == 'PASS'/);
  assert.doesNotMatch(upload, /always\(\)|continue-on-error:/);
  assert.match(upload, /name: \$\{\{ steps\.registration_proof\.outputs\.artifact_name \}\}/);
  assert.match(upload, /path: \$\{\{ steps\.registration_proof\.outputs\.proof_file \}\}/);
  assert.match(upload, /if-no-files-found: error/);
  const producer = ci.slice(ci.indexOf('      - name: Prepare and verify PR registration data once'),
    ci.indexOf('      - name: Prepare temporary main source registration projection'));
  assert.doesNotMatch(producer, /GITHUB_TOKEN:|continue-on-error:/);
  for (const step of ['Set up Chrome for registration search diagnostics', 'Install the registration search browser driver']) {
    assert.ok(ci.includes(`      - name: ${step}\n        if: steps.registration_proof.outputs.registration_data == 'PASS'`));
  }
});

test("parent-link generation binds stable authority inputs instead of its own final catalog hash", () => {
  const generator = read("archive/tools/build-basic-scope-parent-links.mjs");
  assert.match(generator, /authorityInputsSha256/,
    "parent-link provenance must identify the manifest-listed authority inputs");
  assert.equal(
    (generator.match(/data\/archive2-source-verification-index\.json/g) || []).length,
    2,
    "the derived source lookup index is excluded from both parent-link input projections",
  );
  assert.doesNotMatch(generator, /generatedAgainst:\s*\{\s*catalogSha256:/,
    "the generated parent links cannot fingerprint the catalog that fingerprints those links");
});
