import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { objectSha } from '../archive/tools/pipeline-core/canonical.mjs';
import { loadActiveMetaRegistry } from '../archive/tools/meta-foundation/active-registry.mjs';
import {
  buildDecisionIsolatedInput,
  questionUidForSource,
  resolveMetaRoute,
  validateResolverEvidence,
} from '../archive/tools/meta-foundation/rpm-active-resolver.mjs';
import { registerReviewedCanonicalMaintenanceV1 } from '../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDir = 'tests/fixtures/meta-foundation-calculus1';
const requestPath = `${fixtureDir}/canonical-maintenance-request.json`;
const crosswalkPath = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math2-calculus1.json';
const tagMasterPath = 'archive/data/master_tables/js_archive_tag_master.json';
const rpmMasterPath = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const packDirs = {
  LIMIT_CONTINUITY: 'limit-continuity',
  FUNCTIONS_GRAPHS: 'functions-graphs',
  DERIVATIVE: 'derivative',
  INTEGRAL_CALCULUS: 'integral-calculus',
};

const unitPtCounts = {
  LIMIT_CONTINUITY: 5,
  FUNCTIONS_GRAPHS: 1,
  DERIVATIVE: 11,
  INTEGRAL_CALCULUS: 5,
};

const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const jsonText = value => `${JSON.stringify(value, null, 2)}\n`;
function copyCurrentTree(root, relative) {
  fs.cpSync(path.join(repo, relative), path.join(root, relative), { recursive: true });
}

function writeJson(root, relative, value) {
  const destination = path.join(root, relative);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, jsonText(value));
}

function normalizeToRequestBefore(root, request) {
  for (const change of request.registryChanges) {
    const currentPath = path.join(root, change.path);
    const current = JSON.parse(fs.readFileSync(currentPath, 'utf8'));
    const packChange = change.path.endsWith('/pack.json');
    if (packChange) {
      if (JSON.stringify(current) !== JSON.stringify(change.before)
          && JSON.stringify(current) !== JSON.stringify(change.after)) {
        throw new Error(`Fixture source drift: ${change.path} matches neither request before nor after`);
      }
      if (JSON.stringify(current) !== JSON.stringify(change.before)) writeJson(root, change.path, change.before);
      continue;
    }

    const collection = change.collection;
    const values = current[collection];
    assert.ok(Array.isArray(values), `${change.path}: missing ${collection}`);
    const matching = values.filter(value => Object.entries(change.match).every(([key, expected]) => value[key] === expected));
    if (change.before === null) {
      assert.ok(matching.length === 0 || (matching.length === 1 && JSON.stringify(matching[0]) === JSON.stringify(change.after)),
        `${change.path}: unexpected current row for ${JSON.stringify(change.match)}`);
      if (matching.length) current[collection] = values.filter(value => !Object.entries(change.match).every(([key, expected]) => value[key] === expected));
    } else {
      assert.equal(matching.length, 1, `${change.path}: expected one current before/after row`);
      assert.ok(JSON.stringify(matching[0]) === JSON.stringify(change.before) || JSON.stringify(matching[0]) === JSON.stringify(change.after),
        `${change.path}: matching row differs from request before and after`);
      current[collection] = values.filter(value => !Object.entries(change.match).every(([key, expected]) => value[key] === expected));
      current[collection].push(change.before);
    }
    writeJson(root, change.path, current);
  }

  const indexPath = 'archive/data/meta-foundation/canonical/registry_index.json';
  const index = readJson(root, indexPath);
  for (const change of request.registryChanges.filter(row => row.path.endsWith('/pack.json'))) {
    const activePack = index.activePacks.find(row => row.id === change.before.packId);
    assert.ok(activePack, `${change.before.packId}: active pack index row`);
    assert.ok(activePack.version === change.before.packVersion || activePack.version === change.after.packVersion,
      `${change.before.packId}: unexpected active pack version ${activePack.version}`);
    activePack.version = change.before.packVersion;

    const packSlug = /\/packs\/([^/]+)\/pack\.json$/.exec(change.path)?.[1];
    assert.ok(packSlug, `${change.path}: native pack path`);
    const runtimePath = `archive/data/meta-foundation/runtime/${packSlug}-v1.json`;
    const runtime = readJson(root, runtimePath);
    assert.equal(runtime.packId, change.before.packId, `${change.before.packId}: runtime identity`);
    assert.ok(runtime.packVersion === change.before.packVersion || runtime.packVersion === change.after.packVersion,
      `${change.before.packId}: unexpected runtime pack version ${runtime.packVersion}`);
    const currentRuntimeStamp = `${runtime.packId}@${runtime.packVersion}/`;
    assert.ok(runtime.runtimeVersion?.startsWith(currentRuntimeStamp),
      `${change.before.packId}: runtime stamp does not match its witnessed pack version`);
    if (runtime.packVersion !== change.before.packVersion) {
      const stampSuffix = runtime.runtimeVersion.slice(currentRuntimeStamp.length);
      runtime.packVersion = change.before.packVersion;
      runtime.runtimeVersion = `${runtime.packId}@${change.before.packVersion}/${stampSuffix}`;
      writeJson(root, runtimePath, runtime);
    }
  }
  writeJson(root, indexPath, index);
}

function readJson(root, relative) {
  return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
}

function resolverInput(row) {
  const sourceArchiveFile = `original/high/h2/2mid/SYNTHETIC_BINDING_PATH_${row.id}.js`;
  const input = {
    sourceIdentity: {
      sourceArchiveFile,
      questionUid: questionUidForSource(sourceArchiveFile, 1),
      sourceIdentityKey: `${objectSha('SYNTHETIC_TEST_ONLY')}|1`,
      sourceOrdinal: 1,
      contentHash: objectSha(`synthetic question ${row.id}`),
      choicesHash: objectSha([]),
      imageRefHash: objectSha(''),
    },
    solutionIdentity: {
      status: 'VERIFIED_FINAL',
      independentVerification: true,
      solutionHash: objectSha(`synthetic solution ${row.id}`),
    },
    curriculumContext: {
      grade: 'H2',
      curriculum: '2022',
      scope: '미적분I',
      standardCourse: '미적분I',
      standardUnitKey: row.standardUnitKey,
      subUnitKey: null,
    },
    semanticDecision: {
      primaryMethod: 'SYNTHETIC_TEST_ONLY: exact RPM path to active PT/TPL binding',
      decisiveStep: 'SYNTHETIC_TEST_ONLY: verifies projection wiring, not item classification or semantic approval.',
      rpmPath: { curriculum: row.curriculum, scope: row.scope, ...row.rpmPath },
    },
  };
  if (row.mappingStatus.startsWith('FAMILY')) {
    const isolated = buildDecisionIsolatedInput(input);
    input.familyTemplateSelection = {
      stage: 'POST_CROSSWALK',
      inputBundleSha: isolated.inputBundleSha,
      crosswalkRecordId: row.id,
      templateKey: row.templateCandidates[0].templateKey,
      decisiveStepReason: `SYNTHETIC_TEST_ONLY family candidate parent check for ${row.id}`,
    };
  }
  return input;
}

function maintenanceFixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-meta-calculus1-maintenance-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  // Use a small, committed synthetic request and exact before-crosswalk bytes.
  // Build the isolated baseline from the working source, then normalize only
  // request-owned fields to the witnessed before state. This works when the
  // checkout is already at the request's after state and needs no Git history.
  const request = JSON.parse(fs.readFileSync(path.join(repo, requestPath), 'utf8'));
  copyCurrentTree(root, 'archive/data/meta-foundation/canonical');
  copyCurrentTree(root, 'archive/data/meta-foundation/runtime');
  copyCurrentTree(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0');
  copyCurrentTree(root, 'archive/data/master_tables/js_archive_tag_master.json');
  for (const relative of [
    'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
    'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
  ]) {
    fs.mkdirSync(path.dirname(path.join(root, relative)), { recursive: true });
    fs.copyFileSync(path.join(repo, relative), path.join(root, relative));
  }
  for (const ref of request.approval.evidenceRefs) {
    fs.mkdirSync(path.dirname(path.join(root, ref.path)), { recursive: true });
    fs.copyFileSync(path.join(repo, ref.path), path.join(root, ref.path));
    assert.equal(digest(fs.readFileSync(path.join(root, ref.path))), ref.sha256, `${ref.path}: fixture evidence SHA`);
  }
  const beforeCrosswalkBytes = fs.readFileSync(path.join(repo, fixtureDir, 'crosswalk-before.json'));
  assert.equal(digest(beforeCrosswalkBytes), request.crosswalkRefreshPaths[0].expectedBeforeSha256, 'fixture crosswalk before SHA');
  fs.mkdirSync(path.join(root, 'archive/data'), { recursive: true });
  fs.mkdirSync(path.dirname(path.join(root, crosswalkPath)), { recursive: true });
  fs.writeFileSync(path.join(root, crosswalkPath), beforeCrosswalkBytes);
  normalizeToRequestBefore(root, request);
  fs.writeFileSync(path.join(root, 'archive/data/question_metadata.json'), jsonText({ records: [], counts: { records: 0 } }));

  const runtimeBefore = new Map();
  const runtimeBeforeVersions = new Map();
  for (const packId of Object.keys(packDirs)) {
    const runtimeName = `${packDirs[packId]}-v1.json`;
    const runtime = readJson(root, `archive/data/meta-foundation/runtime/${runtimeName}`);
    runtimeBefore.set(packId, structuredClone(runtime.records));
    runtimeBeforeVersions.set(packId, { packVersion: runtime.packVersion, runtimeVersion: runtime.runtimeVersion });
  }
  const crosswalkBefore = readJson(root, crosswalkPath);
  const tagMasterShaBefore = digest(fs.readFileSync(path.join(repo, tagMasterPath)));
  const legacyBefore = new Map();
  const taxonomyBefore = new Map();
  for (const dirname of Object.values(packDirs)) {
    const base = `archive/data/meta-foundation/canonical/packs/${dirname}`;
    legacyBefore.set(dirname, readJson(root, `${base}/bindings.json`).bindings.filter(row => row.curriculum === '2015'));
    taxonomyBefore.set(dirname, digest(fs.readFileSync(path.join(root, base, 'taxonomy.json'))));
  }
  const mainSha = request.actionMainSha;
  const result = registerReviewedCanonicalMaintenanceV1({
    root,
    request,
    write: true,
  });
  const receiptPath = `archive/data/meta-foundation/evidence/canonical-maintenance/v1/${request.requestId}.json`;
  const receipt = readJson(root, receiptPath);
  const crosswalk = readJson(root, crosswalkPath);
  const registry = loadActiveMetaRegistry(root);
  return { root, request, result, receipt, crosswalkBefore, crosswalk, registry, runtimeBefore, runtimeBeforeVersions, legacyBefore, taxonomyBefore, tagMasterShaBefore, mainSha };
}

test('synthetic canonical maintenance fixture materializes from current source without inbox or Git history', async t => {
  const fixture = maintenanceFixture(t);

  await t.test('source-first request has four pack updates, 22 bindings, two scoped applicability rules, and no item approvals', () => {
    assert.equal(fixture.request.items.length, 0);
    assert.equal(fixture.request.approval.approvedBy, 'SYNTHETIC_TEST_ONLY');
    assert.match(fixture.request.requestId, /^SYNTHETIC_TEST_ONLY_/);
    assert.equal(fixture.request.registryChanges.filter(change => change.path.endsWith('/pack.json')).length, 4);
    assert.equal(fixture.request.registryChanges.filter(change => change.collection === 'bindings').length, 22);
    assert.equal(fixture.request.registryChanges.filter(change => change.collection === 'applicabilityRules').length, 2);
    for (const [packId, dirname] of Object.entries(packDirs)) {
      assert.equal(fixture.request.registryChanges.filter(change => change.collection === 'bindings'
        && change.path.endsWith(`/packs/${dirname}/bindings.json`)).length, unitPtCounts[packId], `${packId}: direct tuple count`);
    }
    for (const change of fixture.request.registryChanges.filter(row => row.path.endsWith('/pack.json'))) {
      const beforeEnvelope = fixture.runtimeBeforeVersions.get(change.before.packId);
      assert.equal(beforeEnvelope.packVersion, change.before.packVersion, `${change.before.packId}: explicit runtime before version`);
      assert.ok(beforeEnvelope.runtimeVersion.startsWith(`${change.before.packId}@${change.before.packVersion}/`),
        `${change.before.packId}: runtime before stamp`);
    }
    assert.equal(fixture.result.status, 'PASS');
    assert.equal(fixture.result.maintenanceStatus, 'APPLIED');
    assert.deepEqual([...fixture.result.changedPackIds].sort(), Object.keys(packDirs).sort());
    assert.equal(fixture.result.crosswalkRowsRefreshed, 50);
    assert.equal(fixture.registry.status, 'ACTIVE', JSON.stringify(fixture.registry.errors));
    assert.equal(fixture.crosswalk.activeAuthority.registrySha, fixture.registry.registrySha);
    assert.equal(fixture.crosswalk.generatedAgainstMain, fixture.mainSha);
    assert.equal(fixture.receipt.metadataRegistrationStatus, 'NOT_APPLICABLE');
    assert.equal(fixture.receipt.examFinalQaStatus, 'NOT_EVALUATED');
    assert.equal(fixture.receipt.consumerSearchStatus, 'NOT_RUN');
    assert.equal(readJson(fixture.root, 'archive/data/question_metadata.json').records.length, 0);
  });

  await t.test('four native units resolve all 50 RPM paths through 22 exact bindings and 42 template candidates', () => {
    const rows = fixture.crosswalk.records.filter(row => row.curriculum === '2022' && row.scope === '미적분I');
    assert.equal(rows.length, 50);
    assert.equal(rows.filter(row => row.mappingStatus === 'DIRECT_ACTIVE').length, 47);
    assert.equal(rows.filter(row => row.mappingStatus === 'FAMILY_ACTIVE').length, 3);
    assert.equal(rows.filter(row => row.bindingStatus === 'ACTIVE').length, 50);

    const directTemplates = new Set(rows.filter(row => row.templateKey).map(row => row.templateKey));
    const familyTemplates = new Set(rows.filter(row => row.mappingStatus === 'FAMILY_ACTIVE')
      .flatMap(row => (row.templateCandidates || []).map(candidate => candidate.templateKey)));
    const additionalFamilyTemplates = new Set([...familyTemplates].filter(key => !directTemplates.has(key)));
    assert.equal(directTemplates.size, 35);
    assert.equal(familyTemplates.size, 10);
    assert.equal(additionalFamilyTemplates.size, 7);
    assert.equal(new Set([...directTemplates, ...familyTemplates]).size, 42);

    const tupleKeys = new Set();
    const rpmMaster = readJson(fixture.root, rpmMasterPath);
    const tagMaster = readJson(fixture.root, tagMasterPath);
    for (const row of rows) {
      tupleKeys.add([row.ownerPack, row.standardUnitKey, row.problemTypeKey].join('|'));
      const matches = fixture.registry.bindingRows.filter(binding => binding.status === 'ACTIVE'
        && binding.curriculum === '2022' && binding.standardCourse === '미적분I'
        && binding.standardUnitKey === row.standardUnitKey && (binding.subUnitKey ?? null) === null
        && binding.problemTypeKey === row.problemTypeKey && binding.ownerPack === row.ownerPack
        && binding.bindingMode === 'STANDARD_UNIT_DIRECT');
      assert.equal(matches.length, 1, `${row.id}: exact binding count`);
      assert.equal(matches[0].L1, row.rpmPath.majorUnit, `${row.id}: explicit parent L1`);
      assert.equal(matches[0].L2, row.rpmPath.midUnit, `${row.id}: explicit parent L2`);
      assert.equal(matches[0].subUnitLabelKo, row.rpmPath.midUnit, `${row.id}: direct-binding parent display`);
      assert.equal(row.subUnitKey, null, `${row.id}: no synthetic subunit`);
      const masterPaths = rpmMaster.records.filter(record => record.curriculum === row.curriculum && record.scope === row.scope
        && record.majorUnit === matches[0].L1 && record.midUnit === matches[0].L2);
      assert.ok(masterPaths.some(record => (record.concepts || []).some(concept => concept.concept === row.rpmPath.l3
        && (concept.problemTypes || []).some(problemType => problemType.problemType === row.rpmPath.l4))), `${row.id}: parent path in canonical RPM master`);
      const standardUnit = tagMaster.find(item => item.key === row.standardUnitKey && item.keyType === 'standardUnitKey');
      assert.ok(standardUnit && ['active', 'ACTIVE'].includes(standardUnit.status), `${row.id}: standard unit exists`);

      const input = resolverInput(row);
      const resolution = resolveMetaRoute(input, { repoRoot: fixture.root, registry: fixture.registry });
      assert.equal(resolution.disposition, 'RPM_SEMANTIC_FINAL', `${row.id}: ${JSON.stringify(resolution)}`);
      assert.equal(resolution.projectionStatus, 'PROJECTION_REUSE', `${row.id}: ${resolution.projectionStatus}`);
      assert.equal(resolution.problemTypeKey, row.problemTypeKey, `${row.id}: PT`);
      if (row.templateKey) assert.equal(resolution.templateKey, row.templateKey, `${row.id}: TPL`);
      else assert.ok(row.templateCandidates.some(candidate => candidate.templateKey === resolution.templateKey), `${row.id}: family TPL`);
      assert.equal(resolution.bindingIdentity, `2022|${row.standardUnitKey}|<DIRECT>|${row.problemTypeKey}|${row.ownerPack}`, `${row.id}: identity`);
      assert.equal(validateResolverEvidence(input, resolution, { repoRoot: fixture.root, registry: fixture.registry }).status, 'PASS', row.id);
      for (const templateKey of row.templateKey ? [row.templateKey] : row.templateCandidates.map(candidate => candidate.templateKey)) {
        assert.equal(fixture.registry.templates.get(templateKey)?.parentProblemTypeKey, row.problemTypeKey, `${row.id}: ${templateKey} parent`);
      }
    }
    assert.equal(tupleKeys.size, 22);
  });

  await t.test('2015 bindings, PT/TPL definitions, and every unselected crosswalk row remain unchanged', () => {
    for (const [packId, dirname] of Object.entries(packDirs)) {
      const base = `archive/data/meta-foundation/canonical/packs/${dirname}`;
      const afterBindings = readJson(fixture.root, `${base}/bindings.json`).bindings.filter(row => row.curriculum === '2015');
      assert.deepEqual(afterBindings, fixture.legacyBefore.get(dirname), `${packId}: 2015 before/after`);
      assert.equal(digest(fs.readFileSync(path.join(fixture.root, base, 'taxonomy.json'))), fixture.taxonomyBefore.get(dirname), `${packId}: PT/TPL definitions`);
      const runtime = readJson(fixture.root, `archive/data/meta-foundation/runtime/${dirname}-v1.json`);
      assert.deepEqual(runtime.records, fixture.runtimeBefore.get(packId), `${packId}: runtime UID records`);
    }
    assert.equal(digest(fs.readFileSync(path.join(fixture.root, tagMasterPath))), fixture.tagMasterShaBefore, 'standard-unit labels/master are unchanged');

    const beforeById = new Map(fixture.crosswalkBefore.records.map(row => [row.id, row]));
    const refreshed = new Set(fixture.crosswalk.records.filter(row => row.curriculum === '2022' && row.scope === '미적분I').map(row => row.id));
    for (const row of fixture.crosswalk.records) {
      if (!refreshed.has(row.id)) assert.deepEqual(row, beforeById.get(row.id), `${row.id}: outside-selector row`);
      else {
        const before = beforeById.get(row.id);
        for (const [key, value] of Object.entries(before)) {
          if (!['mappingStatus', 'bindingStatus', 'binding'].includes(key)) assert.deepEqual(row[key], value, `${row.id}: semantic ${key}`);
        }
      }
    }
  });

  await t.test('the two curriculum rules are exact and do not widen PT/TPL authority', () => {
    const fg = readJson(fixture.root, 'archive/data/meta-foundation/canonical/packs/functions-graphs/bindings.json');
    const fgRule = fg.applicabilityRules.find(rule => rule.curriculum === '2022' && rule.standardUnitKey === 'H22-M1-02'
      && rule.targetType === 'template' && rule.targetKey === 'TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT');
    assert.equal(fgRule?.curriculumApplicability, 'DEFAULT_SCOPE');
    assert.equal(fgRule?.defaultSelectable, true);
    assert.match(fgRule?.reason || '', /H2-M2-RPM-059/);

    const integral = readJson(fixture.root, 'archive/data/meta-foundation/canonical/packs/integral-calculus/bindings.json');
    const outside = integral.applicabilityRules.find(rule => rule.curriculum === '2022' && rule.standardUnitKey === 'H22-M1-07'
      && rule.targetType === 'template' && rule.targetKey === 'TPL_INVERSE_FUNCTION_INTEGRATION');
    assert.equal(outside?.curriculumApplicability, 'SUPPLEMENTARY_OUTSIDE_CORE');
    assert.equal(outside?.defaultSelectable, false);
    assert.match(outside?.reason || '', /다항함수|radical expression/i);

    const continuityExtremumRows = fixture.crosswalk.records.filter(row => row.curriculum === '2022' && row.scope === '미적분I'
      && row.standardUnitKey === 'H22-M1-02' && row.problemTypeKey === 'PT_FUNCTION_EXTREMUM');
    assert.deepEqual(continuityExtremumRows.map(row => row.templateKey), ['TPL_FUNCTION_EXTREMUM_INTERVAL_ENDPOINT']);
  });
});
