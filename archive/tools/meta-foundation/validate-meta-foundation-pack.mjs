#!/usr/bin/env node
// Pack-generic candidate and active-pack validator. Explicit L3/L4 HOLD and
// NO_SEPARATE_L4 dispositions are valid only when represented in the ledger.
import fs from "node:fs";
import path from "node:path";

const av = process.argv.slice(2);
const arg = (name) => {
  const index = av.indexOf(`--${name}`);
  return index >= 0 ? av[index + 1] : null;
};
const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const packDir = arg("pack-dir");
const assignmentsPath = arg("assignments");
const runtimePath = arg("runtime");
const compiledRoot = arg("compiled-root");
if (!packDir || !assignmentsPath || !runtimePath || !compiledRoot) {
  throw new Error("required: --pack-dir --assignments --runtime --compiled-root");
}

const pack = read(path.join(packDir, "pack.json"));
const tax = read(path.join(packDir, "taxonomy.json"));
const binds = read(path.join(packDir, "bindings.json"));
const aliases = read(path.join(packDir, "aliases.json"));
const assignments = read(assignmentsPath);
const runtime = read(runtimePath);
const compiledTaxonomy = read(path.join(compiledRoot, "taxonomy_registry.json"));
const compiledConcepts = read(path.join(compiledRoot, "concept_registry.json"));
const compiledConditions = read(path.join(compiledRoot, "condition_registry.json"));
const compiledAliases = read(path.join(compiledRoot, "aliases.json"));
const compiledBindings = read(path.join(compiledRoot, "curriculum_bindings.json"));

const failures = [];
const currentPT = new Map(compiledTaxonomy.problemTypes.map((row) => [row.problemTypeKey, row]));
const currentTPL = new Map(compiledTaxonomy.templates.map((row) => [row.templateKey, row]));
const packPT = tax.problemTypes || [];
const packTPL = tax.templates || [];
const isActivePack = (compiledTaxonomy.sourcePacks || []).some((row) => row.packId === pack.packId);
const concepts = new Set(compiledConcepts.concepts.map((row) => row.conceptKey));
const conditions = new Set(compiledConditions.conditions.map((row) => row.conditionKey));
const bindKey = (row) => [row.curriculum, row.standardUnitKey, row.subUnitKey === null ? "<DIRECT>" : row.subUnitKey, row.problemTypeKey].join("\0");
const activeBindingKeys = new Set(compiledBindings.bindings.map(bindKey));
for (const row of binds.bindings || []) activeBindingKeys.add(bindKey(row));
const runtimeByUid = new Map((runtime.records || []).map((row) => [row.questionUid, row]));
const seenUid = new Set();
const seenSource = new Set();
const patterns = new Set(["NONE", "SEQUENTIAL", "INTERDEPENDENT", "REINTERPRETATION", "CASE_BRANCH", "DEEP_COMPOSITE"]);
const dispositions = new Set(["ASSIGNED", "NO_SEPARATE_L4", "HOLD"]);

function sameValue(left, right) {
  return JSON.stringify(left ?? null) === JSON.stringify(right ?? null);
}

for (const row of packPT) {
  const canonical = currentPT.get(row.problemTypeKey);
  if (isActivePack) {
    if (!canonical) failures.push(`missingCanonicalL3:${row.problemTypeKey}`);
    else if (canonical.ownerPack !== pack.ownerPack || canonical.definition !== row.definition || canonical.canonicalLabelKo !== row.canonicalLabelKo) {
      failures.push(`activeCanonicalL3Mismatch:${row.problemTypeKey}`);
    }
  } else if (canonical) {
    failures.push(`keyCollision:L3:${row.problemTypeKey}`);
  }
}
for (const row of packTPL) {
  const canonical = currentTPL.get(row.templateKey);
  if (isActivePack) {
    if (!canonical) failures.push(`missingCanonicalL4:${row.templateKey}`);
    else if (canonical.ownerPack !== pack.ownerPack || canonical.parentProblemTypeKey !== row.parentProblemTypeKey || canonical.definition !== row.definition || canonical.canonicalLabelKo !== row.canonicalLabelKo) {
      failures.push(`activeCanonicalL4Mismatch:${row.templateKey}`);
    }
  } else if (canonical) {
    failures.push(`keyCollision:L4:${row.templateKey}`);
  }
}

for (const row of assignments.items || []) {
  if (seenUid.has(row.questionUid)) failures.push(`duplicateUid:${row.questionUid}`);
  seenUid.add(row.questionUid);
  const sourceIdentity = `${row.sourceArchiveFile}#${Number(row.sourceOrdinal)}`;
  if (seenSource.has(sourceIdentity)) failures.push(`duplicateSource:${sourceIdentity}`);
  seenSource.add(sourceIdentity);

  if (!dispositions.has(row.l4Disposition)) failures.push(`missingOrInvalidL4Disposition:${row.questionUid}`);
  if (!["ASSIGNED", "HOLD"].includes(row.l3Disposition)) failures.push(`missingOrInvalidL3Disposition:${row.questionUid}`);
  if (row.l3Disposition === "HOLD") {
    if (row.problemTypeKey || row.l4Disposition !== "HOLD" || row.reviewStatus !== "HOLD" || row.foundationTaxonomyStatus !== "HOLD") {
      failures.push(`invalidL3Hold:${row.questionUid}`);
    }
  } else {
    const problemType = currentPT.get(row.problemTypeKey);
    if (!problemType) failures.push(`missingL3:${row.questionUid}`);
    if (!activeBindingKeys.has(bindKey(row))) failures.push(`missingBinding:${row.questionUid}`);
  }

  if (row.l4Disposition === "ASSIGNED") {
    const template = currentTPL.get(row.templateKey);
    if (!template) failures.push(`missingL4:${row.questionUid}`);
    else if (template.parentProblemTypeKey !== row.problemTypeKey) failures.push(`badL4Parent:${row.questionUid}`);
  } else if (row.l4Disposition === "NO_SEPARATE_L4") {
    if (!row.problemTypeKey || row.templateKey != null) failures.push(`invalidNoSeparateL4:${row.questionUid}`);
  } else if (row.l4Disposition === "HOLD") {
    if (row.templateKey != null || row.reviewStatus !== "HOLD") failures.push(`invalidL4Hold:${row.questionUid}`);
  }

  for (const key of row.crossConceptKeys || []) if (!concepts.has(key)) failures.push(`missingConcept:${key}`);
  for (const key of row.conditionKeys || []) if (!conditions.has(key)) failures.push(`missingCondition:${key}`);
  if (!patterns.has(row.integrationPattern)) failures.push(`badIntegration:${row.questionUid}`);
  if (row.difficultyBucket !== "UNKNOWN" && (!Number.isInteger(row.difficultyBucket) || row.difficultyBucket < 1 || row.difficultyBucket > 5)) failures.push(`badDifficulty:${row.questionUid}`);
  if (!row.sourceFingerprint || !row.sourceIdentity) failures.push(`missingSourceIdentity:${row.questionUid}`);

  const runtimeRow = runtimeByUid.get(row.questionUid);
  if (!runtimeRow) failures.push(`runtimeMissing:${row.questionUid}`);
  else {
    for (const field of ["sourceArchiveFile", "sourceOrdinal", "sourceFingerprint", "curriculum", "standardUnitKey", "subUnitKey", "problemTypeKey", "templateKey", "l3Disposition", "l4Disposition", "integrationPattern", "difficultyBucket", "reviewStatus", "foundationTaxonomyStatus", "runtimeSelectable"]) {
      if (!sameValue(runtimeRow[field], row[field])) failures.push(`runtimeMismatch:${field}:${row.questionUid}`);
    }
    if (runtimeRow.sourceArchiveFile !== row.sourceArchiveFile || Number(runtimeRow.sourceOrdinal) !== Number(row.sourceOrdinal)) failures.push(`runtimeSourceJoinMismatch:${row.questionUid}`);
  }
}

for (const row of binds.bindings || []) {
  if (!currentPT.has(row.problemTypeKey)) failures.push(`bindingTargetMissing:${row.problemTypeKey}`);
  if (row.subUnitKey === null && row.bindingMode !== "STANDARD_UNIT_DIRECT") failures.push(`nullBindingMode:${row.problemTypeKey}`);
}

const aliasTargets = new Map();
for (const row of [...(compiledAliases.aliases || []), ...(aliases.aliases || [])]) {
  if (!row.alias) continue;
  const targets = aliasTargets.get(row.alias) || new Set();
  targets.add(`${row.canonicalKind}:${row.canonicalKey}`);
  aliasTargets.set(row.alias, targets);
}
for (const [alias, targets] of aliasTargets) if (targets.size > 1) failures.push(`aliasCollision:${alias}`);

if ((assignments.items || []).length !== pack.activeItemEvidenceCount || (runtime.records || []).length !== (assignments.items || []).length || pack.bindingCount !== (binds.bindings || []).length) {
  failures.push("countMismatch");
}
if (runtime.packId !== pack.packId || runtime.packVersion !== pack.packVersion) failures.push("runtimePackMismatch");

const counts = {
  assignments: (assignments.items || []).length,
  runtime: (runtime.records || []).length,
  uniqueUid: seenUid.size,
  uniqueSourceIdentity: seenSource.size,
  explicitHold: (assignments.items || []).filter((row) => row.reviewStatus === "HOLD").length,
  l3Hold: (assignments.items || []).filter((row) => row.l3Disposition === "HOLD").length,
  l4Hold: (assignments.items || []).filter((row) => row.l4Disposition === "HOLD").length,
  noSeparateL4: (assignments.items || []).filter((row) => row.l4Disposition === "NO_SEPARATE_L4").length,
  runtimeSelectable: (runtime.records || []).filter((row) => row.runtimeSelectable === true).length,
  failures: failures.length
};
const output = {
  schemaVersion: "meta-foundation-pack-generic-validator-v2",
  status: failures.length ? "FAIL" : "PASS",
  packId: pack.packId,
  packVersion: pack.packVersion,
  mode: isActivePack ? "ACTIVE_CANONICAL_PACK" : "CANDIDATE_PACK",
  counts,
  failures
};
process.stdout.write(JSON.stringify(output, null, 2) + "\n");
if (failures.length) process.exitCode = 1;
