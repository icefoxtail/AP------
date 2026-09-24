#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const canonicalRoot = "archive/data/meta-foundation/canonical";
const compiledRoot = "archive/data/meta-foundation/compiled";
const geometryEvidenceRoot = "archive/data/meta-foundation/evidence/geometry-equations/v1";
const geometryRuntimePath = "archive/data/meta-foundation/runtime/geometry-equations-v1.json";

const rel = (...parts) => path.join(...parts).replaceAll("\\", "/");
const abs = (p) => path.join(root, p);
const readText = (p) => fs.readFileSync(abs(p), "utf8");
const readJson = (p) => JSON.parse(readText(p));
const jsonText = (value) => JSON.stringify(value, null, 2) + "\n";
const sha256 = (text) => crypto.createHash("sha256").update(text, "utf8").digest("hex");
const clone = (value) => JSON.parse(JSON.stringify(value));
const slug = (id) => id.toLowerCase().replaceAll("_", "-");
const targetSignature = (row) => `${row.canonicalKind}:${row.canonicalKey}`;

export function findAliasCollisions(rows) {
  const byAlias = new Map();
  for (const row of rows) {
    if (!row || row.status !== "ACTIVE" || typeof row.alias !== "string") continue;
    const targets = byAlias.get(row.alias) || new Map();
    const signature = targetSignature(row);
    if (!targets.has(signature)) {
      targets.set(signature, {
        canonicalKey: row.canonicalKey,
        canonicalKind: row.canonicalKind
      });
    }
    byAlias.set(row.alias, targets);
  }
  return [...byAlias.entries()]
    .filter(([, targets]) => targets.size > 1)
    .map(([alias, targets]) => ({
      alias,
      targets: [...targets.values()]
    }));
}

function addAlias(rows, seen, row) {
  const exact = `${row.alias}\u0000${row.canonicalKind}\u0000${row.canonicalKey}`;
  if (seen.has(exact)) return;
  seen.add(exact);
  rows.push(row);
}

function loadCanonical() {
  const indexPath = rel(canonicalRoot, "registry_index.json");
  const index = readJson(indexPath);
  const packs = index.activePacks.map((entry) => {
    const base = rel(canonicalRoot, "packs", slug(entry.id));
    const meta = readJson(rel(base, "pack.json"));
    const taxonomy = readJson(rel(base, "taxonomy.json"));
    const bindings = readJson(rel(base, "bindings.json"));
    const aliases = readJson(rel(base, "aliases.json"));
    if (meta.packId !== entry.id) throw new Error(`pack id mismatch: ${entry.id}`);
    return { entry, base, meta, taxonomy, bindings, aliases };
  });
  const shards = index.activeConceptShards.map((entry) => {
    const file = rel(canonicalRoot, "concepts", `${slug(entry.id)}.json`);
    const data = readJson(file);
    if (data.shardId !== entry.id) throw new Error(`concept shard id mismatch: ${entry.id}`);
    return { entry, file, data };
  });
  const conditionPath = rel(canonicalRoot, "condition_registry.json");
  const condition = readJson(conditionPath);
  return { indexPath, index, packs, shards, conditionPath, condition };
}

function buildAliases(canonical) {
  const aliases = [];
  const seen = new Set();

  for (const pack of canonical.packs) {
    for (const row of pack.aliases.aliases || []) addAlias(aliases, seen, clone(row));
  }
  for (const shard of canonical.shards) {
    for (const concept of shard.data.concepts || []) {
      for (const alias of concept.aliases || []) {
        addAlias(aliases, seen, {
          alias,
          canonicalKey: concept.conceptKey,
          canonicalKind: "crossConcept",
          source: "CONCEPT_SHARD_ALIAS",
          status: "ACTIVE"
        });
      }
    }
  }
  for (const condition of canonical.condition.conditions || []) {
    for (const alias of condition.aliases || []) {
      addAlias(aliases, seen, {
        alias,
        canonicalKey: condition.conditionKey,
        canonicalKind: "condition",
        source: "CONDITION_REGISTRY_ALIAS",
        status: "ACTIVE"
      });
    }
  }
  for (const pack of canonical.packs) {
    for (const problemType of pack.taxonomy.problemTypes || []) {
      for (const alias of problemType.aliases || []) {
        addAlias(aliases, seen, {
          alias,
          canonicalKey: problemType.problemTypeKey,
          canonicalKind: "problemType",
          source: "PACK_TAXONOMY_ALIAS",
          status: "ACTIVE"
        });
      }
    }
    for (const template of pack.taxonomy.templates || []) {
      for (const alias of template.aliases || []) {
        addAlias(aliases, seen, {
          alias,
          canonicalKey: template.templateKey,
          canonicalKind: "template",
          source: "PACK_TAXONOMY_ALIAS",
          status: "ACTIVE"
        });
      }
    }
  }

  const semanticFixes = canonical.packs.flatMap((pack) => pack.aliases.semanticFixes || []);
  const collisions = findAliasCollisions(aliases);
  return {
    schemaVersion: "meta-foundation-compiled-aliases-v1",
    status: "DERIVED_READ_ONLY",
    aliasCount: aliases.length,
    aliases,
    collisionCount: collisions.length,
    collisions,
    semanticFixes,
    sourcePacks: canonical.packs.map((pack) => pack.meta.packId)
  };
}

function buildCompiled(canonical) {
  const problemTypes = canonical.packs.flatMap((pack) => pack.taxonomy.problemTypes || []);
  const templates = canonical.packs.flatMap((pack) => pack.taxonomy.templates || []);
  const concepts = canonical.shards.flatMap((shard) => shard.data.concepts || []);
  const bindings = canonical.packs.flatMap((pack) => pack.bindings.bindings || []);
  const applicabilityRules = canonical.packs.flatMap((pack) => pack.bindings.applicabilityRules || []);
  const aliases = buildAliases(canonical);

  const taxonomy = {
    schemaVersion: "meta-foundation-compiled-taxonomy-v1",
    status: "DERIVED_READ_ONLY",
    sourcePacks: canonical.packs.map((pack) => ({
      packId: pack.meta.packId,
      version: pack.meta.packVersion
    })),
    problemTypeCount: problemTypes.length,
    templateCount: templates.length,
    problemTypes,
    templates
  };
  const conceptRegistry = {
    schemaVersion: "meta-foundation-compiled-concept-registry-v1",
    status: "DERIVED_READ_ONLY",
    sourceShards: canonical.shards.map((shard) => ({
      shardId: shard.data.shardId,
      version: shard.data.shardVersion,
      conceptCount: (shard.data.concepts || []).length
    })),
    conceptCount: concepts.length,
    concepts
  };
  const conditionRegistry = {
    ...clone(canonical.condition),
    status: "DERIVED_READ_ONLY",
    source: canonical.condition.owner
  };
  const curriculumBindings = {
    schemaVersion: "meta-foundation-compiled-bindings-v1",
    status: "DERIVED_READ_ONLY",
    bindingCount: bindings.length,
    bindings,
    policy: canonical.packs[0]?.bindings.policy || "",
    applicabilityRules,
    sourcePacks: canonical.packs.map((pack) => pack.meta.packId)
  };

  return {
    aliases,
    taxonomy,
    conceptRegistry,
    conditionRegistry,
    curriculumBindings
  };
}

function collectKeyDuplicates(compiled) {
  const rows = [
    ...compiled.taxonomy.problemTypes.map((x) => ({ key: x.problemTypeKey, kind: "problemType" })),
    ...compiled.taxonomy.templates.map((x) => ({ key: x.templateKey, kind: "template" })),
    ...compiled.conceptRegistry.concepts.map((x) => ({ key: x.conceptKey, kind: "crossConcept" })),
    ...compiled.conditionRegistry.conditions.map((x) => ({ key: x.conditionKey, kind: "condition" }))
  ];
  const map = new Map();
  for (const row of rows) {
    const list = map.get(row.key) || [];
    list.push(row.kind);
    map.set(row.key, list);
  }
  return [...map.entries()]
    .filter(([, kinds]) => kinds.length > 1)
    .map(([key, kinds]) => ({ key, kinds }));
}

function buildGeometryRegression(canonical, compiled) {
  const assignmentPath = rel(geometryEvidenceRoot, "item_metadata_assignments_400.json");
  const runtimePath = geometryRuntimePath;
  const assignments = readJson(assignmentPath);
  const runtime = readJson(runtimePath);
  const problemTypes = new Set(compiled.taxonomy.problemTypes.map((x) => x.problemTypeKey));
  const templates = new Map(compiled.taxonomy.templates.map((x) => [x.templateKey, x]));
  const concepts = new Set(compiled.conceptRegistry.concepts.map((x) => x.conceptKey));
  const conditions = new Set(compiled.conditionRegistry.conditions.map((x) => x.conditionKey));
  const bindings = new Set(compiled.curriculumBindings.bindings.map((x) =>
    [x.curriculum, x.standardUnitKey, x.subUnitKey, x.problemTypeKey].join("\u0000")
  ));

  const duplicateCanonicalKeys = collectKeyDuplicates(compiled);
  const brokenTemplateParents = compiled.taxonomy.templates.filter((x) => !problemTypes.has(x.parentProblemTypeKey));
  const brokenCanonicalBindings = compiled.curriculumBindings.bindings.filter((x) => !problemTypes.has(x.problemTypeKey));

  const counts = {
    assignmentCount: assignments.records.length,
    runtimeRecordCount: runtime.records.length,
    duplicateCanonicalKeyCount: duplicateCanonicalKeys.length,
    aliasCollisionCount: compiled.aliases.collisionCount,
    brokenL4ParentCount: brokenTemplateParents.length,
    brokenCanonicalBindingCount: brokenCanonicalBindings.length,
    brokenL2L3BindingCount: 0,
    unregisteredL3Count: 0,
    unregisteredL4Count: 0,
    unregisteredCrossConceptCount: 0,
    unregisteredConditionCount: 0,
    runtimeMappingMismatchCount: 0
  };

  for (const record of assignments.records) {
    if (!problemTypes.has(record.problemTypeKey)) counts.unregisteredL3Count += 1;
    const template = templates.get(record.templateKey);
    if (!template) counts.unregisteredL4Count += 1;
    else if (template.parentProblemTypeKey !== record.problemTypeKey) counts.brokenL4ParentCount += 1;
    const bindingKey = [record.curriculum, record.standardUnitKey, record.subUnitKey, record.problemTypeKey].join("\u0000");
    if (!bindings.has(bindingKey)) counts.brokenL2L3BindingCount += 1;
    for (const key of record.crossConceptKeys || []) if (!concepts.has(key)) counts.unregisteredCrossConceptCount += 1;
    for (const key of record.conditionKeys || []) if (!conditions.has(key)) counts.unregisteredConditionCount += 1;
  }

  const runtimeByUid = new Map(runtime.records.map((record) => [record.questionUid, record]));
  const sameArray = (a, b) => JSON.stringify(a || []) === JSON.stringify(b || []);
  for (const record of assignments.records) {
    const actual = runtimeByUid.get(record.questionUid);
    if (!actual ||
        actual.subUnitKey !== record.subUnitKey ||
        actual.problemTypeKey !== record.problemTypeKey ||
        actual.templateKey !== record.templateKey ||
        !sameArray(actual.crossConceptKeys, record.crossConceptKeys) ||
        !sameArray(actual.conditionKeys, record.conditionKeys)) {
      counts.runtimeMappingMismatchCount += 1;
    }
  }
  return { counts, assignments, runtime, duplicateCanonicalKeys };
}

function assertGate(regression) {
  const c = regression.counts;
  const failures = [];
  if (c.assignmentCount !== 400) failures.push(`assignmentCount=${c.assignmentCount}`);
  if (c.runtimeRecordCount !== 400) failures.push(`runtimeRecordCount=${c.runtimeRecordCount}`);
  for (const key of [
    "duplicateCanonicalKeyCount",
    "aliasCollisionCount",
    "brokenL4ParentCount",
    "brokenCanonicalBindingCount",
    "brokenL2L3BindingCount",
    "unregisteredL3Count",
    "unregisteredL4Count",
    "unregisteredCrossConceptCount",
    "unregisteredConditionCount",
    "runtimeMappingMismatchCount"
  ]) {
    if (c[key] !== 0) failures.push(`${key}=${c[key]}`);
  }
  if (failures.length) throw new Error("Meta Foundation compile gate failed: " + failures.join(", "));
}

function compiledOutputs(canonical, compiled) {
  const master = {
    schemaVersion: "meta-foundation-compiled-v1",
    status: "DERIVED_READ_ONLY",
    generatedFrom: {
      activePacks: canonical.packs.map((pack) => `${pack.meta.packId}@${pack.meta.packVersion}`),
      activeConceptShards: canonical.shards.map((shard) => `${shard.data.shardId}@${shard.data.shardVersion}`),
      conditionRegistry: `${canonical.condition.owner}@v${canonical.index.conditionRegistry.version}`
    },
    counts: {
      problemTypes: compiled.taxonomy.problemTypeCount,
      templates: compiled.taxonomy.templateCount,
      crossConcepts: compiled.conceptRegistry.conceptCount,
      conditions: compiled.conditionRegistry.conditionCount,
      bindings: compiled.curriculumBindings.bindingCount,
      aliases: compiled.aliases.aliasCount
    },
    integrityAuditStatus: "PASS_STAGE4_COMPILE",
    productionJsMutation: false
  };
  return new Map([
    [rel(compiledRoot, "aliases.json"), jsonText(compiled.aliases)],
    [rel(compiledRoot, "concept_registry.json"), jsonText(compiled.conceptRegistry)],
    [rel(compiledRoot, "condition_registry.json"), jsonText(compiled.conditionRegistry)],
    [rel(compiledRoot, "curriculum_bindings.json"), jsonText(compiled.curriculumBindings)],
    [rel(compiledRoot, "taxonomy_registry.json"), jsonText(compiled.taxonomy)],
    [rel(compiledRoot, "meta_foundation_compiled.json"), jsonText(master)]
  ]);
}

function buildRegistryIndex(canonical, outputs) {
  const next = clone(canonical.index);
  for (const entry of next.activePacks) {
    const pack = canonical.packs.find((x) => x.meta.packId === entry.id);
    entry.version = pack.meta.packVersion;
  }
  for (const entry of next.activeConceptShards) {
    const shard = canonical.shards.find((x) => x.data.shardId === entry.id);
    entry.version = shard.data.shardVersion;
    entry.conceptCount = shard.data.concepts.length;
  }
  for (const entry of next.canonicalSources) {
    // Hash canonical source content with a stable EOL policy across checkouts.
    const text = readText(entry.path).replaceAll("\r\n", "\n");
    entry.sizeBytes = Buffer.byteLength(text, "utf8");
    entry.sha256 = sha256(text);
  }
  for (const entry of next.compiledArtifacts) {
    const text = outputs.get(entry.path);
    if (typeof text !== "string") throw new Error(`missing compiled output: ${entry.path}`);
    entry.sizeBytes = Buffer.byteLength(text, "utf8");
    entry.sha256 = sha256(text);
  }
  return next;
}

function expectedEvidence(canonical, regression) {
  const geometryPack = canonical.packs.find((pack) => pack.meta.packId === "GEOMETRY_EQUATIONS");
  const packVersion = geometryPack.meta.packVersion;
  const aliasCount = geometryPack.aliases.aliases.length;
  const auditPath = rel(geometryEvidenceRoot, "global_integrity_audit.json");
  const receiptPath = rel(geometryEvidenceRoot, "promotion_receipt.json");
  const audit = readJson(auditPath);
  const receipt = readJson(receiptPath);
  audit.packVersion = packVersion;
  audit.status = "PASS";
  audit.counts.aliasCount = aliasCount;
  audit.counts.aliasCollisionCount = regression.counts.aliasCollisionCount;
  audit.counts.duplicateCanonicalKeyCount = regression.counts.duplicateCanonicalKeyCount;
  audit.counts.runtimeRecordCount = regression.counts.runtimeRecordCount;
  audit.counts.mappingMutationCount = regression.counts.runtimeMappingMismatchCount;

  receipt.packVersion = packVersion;
  receipt.gates.aliasCollisionZero = regression.counts.aliasCollisionCount === 0;
  receipt.gates.duplicateCanonicalKeyZero = regression.counts.duplicateCanonicalKeyCount === 0;
  receipt.gates.runtimeRecordCountMatches = regression.counts.runtimeRecordCount === 400;
  receipt.gates.foundationMappingUnchanged = regression.counts.runtimeMappingMismatchCount === 0;
  if (receipt.postPromotionRevalidation) {
    receipt.postPromotionRevalidation.canonicalPackVersion = packVersion;
    receipt.postPromotionRevalidation.counts = {
      aliasCollisionCount: regression.counts.aliasCollisionCount,
      duplicateCanonicalKeyCount: regression.counts.duplicateCanonicalKeyCount,
      brokenL4ParentCount: regression.counts.brokenL4ParentCount,
      brokenL2L3BindingCount: regression.counts.brokenL2L3BindingCount,
      unregisteredL3Count: regression.counts.unregisteredL3Count,
      unregisteredL4Count: regression.counts.unregisteredL4Count,
      unregisteredCrossConceptCount: regression.counts.unregisteredCrossConceptCount,
      unregisteredConditionCount: regression.counts.unregisteredConditionCount,
      foundationAssignmentCount: regression.counts.assignmentCount,
      runtimeRecordCount: regression.counts.runtimeRecordCount,
      mappingMutationCount: regression.counts.runtimeMappingMismatchCount
    };
  }
  return new Map([[auditPath, jsonText(audit)], [receiptPath, jsonText(receipt)]]);
}

function expectedRuntime(canonical) {
  const geometryPack = canonical.packs.find((pack) => pack.meta.packId === "GEOMETRY_EQUATIONS");
  const version = geometryPack.meta.packVersion;
  const runtime = readJson(geometryRuntimePath);
  runtime.packVersion = version;
  runtime.runtimeVersion = `GEOMETRY_EQUATIONS@${version}/runtime-bridge-v1`;
  for (const record of runtime.records) {
    record.metadataRevision = `meta-foundation:GEOMETRY_EQUATIONS@${version}`;
    record.metaFoundationPackVersion = version;
  }
  return jsonText(runtime);
}

function verifyExact(pathName, expectedText, mismatches) {
  const actual = readText(pathName);
  // Git may check out generated text with CRLF on Windows even when the
  // canonical serializer emits LF. Keep content parity strict across hosts.
  if (actual.replaceAll("\r\n", "\n") !== expectedText.replaceAll("\r\n", "\n")) mismatches.push(pathName);
}

function main() {
  const write = process.argv.includes("--write");
  const check = process.argv.includes("--check") || !write;
  const canonical = loadCanonical();
  const compiled = buildCompiled(canonical);
  const regression = buildGeometryRegression(canonical, compiled);
  assertGate(regression);

  const outputs = compiledOutputs(canonical, compiled);
  outputs.set(geometryRuntimePath, expectedRuntime(canonical));
  const evidence = expectedEvidence(canonical, regression);
  for (const [p, text] of evidence) outputs.set(p, text);

  if (write) {
    for (const [p, text] of outputs) fs.writeFileSync(abs(p), text, "utf8");
  }

  const refreshedCanonical = loadCanonical();
  const refreshedCompiled = buildCompiled(refreshedCanonical);
  const refreshedOutputs = compiledOutputs(refreshedCanonical, refreshedCompiled);
  const index = buildRegistryIndex(refreshedCanonical, refreshedOutputs);
  const indexText = jsonText(index);
  if (write) fs.writeFileSync(abs(refreshedCanonical.indexPath), indexText, "utf8");

  if (check) {
    const mismatches = [];
    for (const [p, text] of refreshedOutputs) verifyExact(p, text, mismatches);
    verifyExact(refreshedCanonical.indexPath, indexText, mismatches);
    verifyExact(geometryRuntimePath, expectedRuntime(refreshedCanonical), mismatches);
    const checkedEvidence = expectedEvidence(refreshedCanonical, regression);
    for (const [p, text] of checkedEvidence) verifyExact(p, text, mismatches);
    if (mismatches.length) {
      throw new Error("Derived Meta Foundation artifact mismatch: " + mismatches.join(", "));
    }
  }

  process.stdout.write(JSON.stringify({
    status: "PASS",
    aliasCollisionCount: regression.counts.aliasCollisionCount,
    duplicateCanonicalKeyCount: regression.counts.duplicateCanonicalKeyCount,
    brokenL4ParentCount: regression.counts.brokenL4ParentCount,
    brokenL2L3BindingCount: regression.counts.brokenL2L3BindingCount,
    unregisteredL3Count: regression.counts.unregisteredL3Count,
    unregisteredL4Count: regression.counts.unregisteredL4Count,
    unregisteredCrossConceptCount: regression.counts.unregisteredCrossConceptCount,
    unregisteredConditionCount: regression.counts.unregisteredConditionCount,
    foundationAssignmentCount: regression.counts.assignmentCount,
    runtimeRecordCount: regression.counts.runtimeRecordCount,
    runtimeMappingMismatchCount: regression.counts.runtimeMappingMismatchCount
  }) + "\n");
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  try {
    main();
  } catch (error) {
    console.error(error?.stack || error);
    process.exit(1);
  }
}
