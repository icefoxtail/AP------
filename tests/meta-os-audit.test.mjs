import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  PATHS, runAudit, formatText, decodeCatalog, buildKeyIndex, catalogDifficultyUsable,
  auditStatusValues, auditMixedTypes, auditKeys, auditFields, auditUtilizationGap
} from "../archive/tools/meta-os/audit.mjs";

// Defect conditions only: the two dictionaries are valid and consistent, every canonical field is in the field
// dictionary, the audit runs on the real data, and the five measurements are computed correctly on a tiny fake set.
// No count of operating data is pinned here: it changes whenever metadata is registered.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const dictionary = read(PATHS.fieldDictionary);
const vocabulary = read(PATHS.statusVocabulary);

const GRADES = new Set(["independent_reviewed", "judged_once", "source_declared", "pending", "not_applicable", "unclassified", "defect"]);

test("field dictionary: valid JSON, unique names, known layers and kinds", () => {
  assert.equal(dictionary.schemaVersion, "meta-os-field-dictionary-v1");
  const names = dictionary.fields.map(f => f.name);
  assert.equal(new Set(names).size, names.length, "duplicate field name");
  const kinds = new Set(Object.keys(dictionary.kinds));
  const layers = new Set(dictionary.layers);
  for (const f of dictionary.fields) {
    assert.ok(layers.has(f.layer), `${f.name}: unknown layer ${f.layer}`);
    assert.ok(kinds.has(f.kind), `${f.name}: unknown kind ${f.kind}`);
    assert.equal(typeof f.note, "string", `${f.name}: note`);
    assert.ok(f.note.length > 0, `${f.name}: empty note`);
    assert.ok(Array.isArray(f.sameMeaningAs), `${f.name}: sameMeaningAs must be an array`);
  }
});

test("field dictionary: sameMeaningAs and overlapsWith point at real, mutual, non-self entries", () => {
  const byName = new Map(dictionary.fields.map(f => [f.name, f]));
  for (const f of dictionary.fields) {
    for (const key of ["sameMeaningAs", "overlapsWith"]) for (const other of f[key] || []) {
      assert.notEqual(other, f.name, `${f.name}: ${key} names itself`);
      assert.ok(byName.has(other), `${f.name}: ${key} -> ${other} is not in the dictionary`);
      assert.ok(byName.get(other)[key]?.includes(f.name), `${f.name}: ${key} -> ${other} is not mutual`);
    }
    if (f.kind === "별칭") assert.ok(f.sameMeaningAs.length > 0, `${f.name}: an alias must name what it duplicates`);
  }
});

test("status vocabulary: grades are known, canonical values exist in the same field, notes are present", () => {
  assert.equal(vocabulary.schemaVersion, "meta-os-status-vocabulary-v1");
  for (const grade of Object.keys(vocabulary.grades)) assert.ok(GRADES.has(grade), `grade ${grade} is not a known grade`);
  for (const [id, field] of Object.entries(vocabulary.fields)) {
    assert.ok(Array.isArray(field.paths) && field.paths.length > 0, `${id}: paths`);
    const values = field.values;
    assert.ok(Object.keys(values).length > 0, `${id}: no values`);
    for (const [value, entry] of Object.entries(values)) {
      const where = `${id}:${JSON.stringify(value)}`;
      assert.ok(GRADES.has(entry.grade), `${where}: unknown grade ${entry.grade}`);
      assert.ok(Object.hasOwn(values, entry.canonical), `${where}: canonical ${JSON.stringify(entry.canonical)} is not a value of ${id}`);
      assert.ok(entry.note, `${where}: note`);
      if (entry.grade === "unclassified") assert.ok(entry.reason, `${where}: unclassified needs a reason`);
      if (entry.grade === "defect") assert.ok(entry.defect, `${where}: defect needs a reason`);
      // a spelling variant takes the grade of its canonical value
      assert.equal(entry.grade, values[entry.canonical].grade, `${where}: grade differs from its canonical value`);
    }
  }
});

test("status vocabulary: synonym groups name real values with one grade", () => {
  for (const group of vocabulary.synonymGroups) {
    assert.ok(GRADES.has(group.grade), `${group.id}: grade`);
    assert.ok(group.members.length >= 2, `${group.id}: needs at least two members`);
    for (const member of group.members) {
      const cut = member.indexOf(":");
      const field = vocabulary.fields[member.slice(0, cut)];
      const entry = field?.values[member.slice(cut + 1)];
      assert.ok(entry, `${group.id}: member ${member} is not in the vocabulary`);
      assert.equal(entry.grade, group.grade, `${group.id}: ${member} has another grade`);
      assert.equal(entry.group, group.id, `${group.id}: ${member} does not point back at the group`);
    }
  }
  const ids = new Set(vocabulary.synonymGroups.map(g => g.id));
  for (const [id, field] of Object.entries(vocabulary.fields)) for (const [value, entry] of Object.entries(field.values))
    if (entry.group) assert.ok(ids.has(entry.group), `${id}:${value}: group ${entry.group} is not defined`);
});

test("every field of the canonical metadata is in the field dictionary, and the audit runs on the real data", () => {
  const report = runAudit({ repoRoot: root });
  assert.equal(report.schemaVersion, "meta-os-audit-v1");
  assert.deepEqual(report.fields.notInDictionary, [], "metadata has fields the dictionary does not know");
  for (const section of ["statusValues", "mixedTypes", "keysNotInRegistry", "fields", "utilizationGap"]) assert.ok(report[section], section);
  assert.ok(report.metadataRows > 0);
  assert.ok(report.utilizationGap.catalogRows > 0);
  for (const facet of Object.keys(report.utilizationGap.definitions)) for (const group of ["all", "original", "similar", "types", "textbooks"])
    assert.ok(report.utilizationGap.table[facet][group], `${facet}/${group}`);
  // the report is plain JSON and the text form renders it without throwing
  assert.doesNotThrow(() => JSON.parse(JSON.stringify(report)));
  assert.match(formatText(report), /Utilization gap/);
});

// ---- the five measurements on a tiny fake set -------------------------------------------------------------------------
const rec = (uid, file, extra = {}) => ({ questionUid: uid, sourceArchiveFile: file, ...extra });

test("(1) status values outside the vocabulary are counted per field, including fieldStatus.* sub-keys", () => {
  const vocab = { fields: {
    metadataStatus: { paths: ["metadataStatus"], values: { approved_full: {}, review_required: {} } },
    fieldStatus: { paths: ["fieldStatus.*"], values: { approved_source: {}, manual_review_pending: {} } }
  } };
  const result = auditStatusValues([
    { metadataStatus: "approved_full", fieldStatus: { difficulty: "approved_source", subUnit: "weird_new" } },
    { metadataStatus: "brand_new", fieldStatus: { subUnit: "weird_new" } },
    { metadataStatus: "brand_new" },
    { fieldStatus: { difficulty: 7 } }
  ], vocab);
  assert.deepEqual(result.values, [
    { field: "fieldStatus.subUnit", value: "weird_new", rows: 2 },
    { field: "metadataStatus", value: "brand_new", rows: 2 },
    { field: "fieldStatus.difficulty", value: "7", rows: 1 }
  ]);
  assert.equal(result.outsideVocabulary, 3);
  assert.equal(result.rowsAffected, 5);
});

test("(2) a field whose values mix types is reported, null alone is only noted", () => {
  const result = auditMixedTypes([
    { difficultyBucket: 3, subUnitKey: "a", flag: true },
    { difficultyBucket: "중", subUnitKey: null, flag: false },
    { difficultyBucket: 2, subUnitKey: "b" },
    { difficultyBucket: "", flag: true },
    { difficultyBucket: null }
  ]);
  assert.deepEqual(result.mixedTypeFields.map(f => f.field), ["difficultyBucket"]);
  const bucket = result.mixedTypeFields[0];
  assert.equal(bucket.dominantType, "number");
  assert.deepEqual(bucket.minorSamples.string.map(s => s.value).sort(), ["", "중"]);
  assert.deepEqual(result.nullablePlusOneTypeFields.map(f => f.field), ["subUnitKey"]);
  assert.deepEqual(result.difficultyBucket, { integer1to5: 2, otherInteger: 0, missing: 0, notInteger: { "중": 1, "": 1, "null": 1 } });
});

test("(3) keys outside the registries: registry hits, extension keys and unknown keys are told apart", () => {
  const index = buildKeyIndex({
    taxonomy: { problemTypes: [{ problemTypeKey: "PT_A" }], templates: [{ templateKey: "TPL_A" }] },
    concepts: { concepts: [{ conceptKey: "CC_A" }] },
    conditions: { conditions: [{ conditionKey: "COND_A" }] },
    extensionKeys: { definitions: [{ key: "EXT-CROSS-X" }] }
  });
  const result = auditKeys([
    { problemTypeKey: "PT_A", templateKey: "TPL_A", crossConceptKeys: ["CC_A", "EXT-CROSS-X"], conditionKeys: ["COND_A"] },
    { problemTypeKey: "H22-C2-04-X-TYPE", templateKey: "TMPL-BV-1", crossConceptKeys: ["CC_B", "EXT-CROSS-NEW"], conditionKeys: ["H22-C2-05"] },
    { problemTypeKey: "H22-C2-04-X-TYPE", templateKey: "TMPL-BV-2", crossConceptKeys: [], conditionKeys: null },
    { problemTypeKey: "", templateKey: null }
  ], index);
  assert.equal(result.problemTypeKey.notInRegistry.kinds, 1);
  assert.equal(result.problemTypeKey.notInRegistry.questions, 2);
  assert.equal(result.problemTypeKey.notInRegistry.topPrefixes[0].prefix, "H22-C2");
  assert.equal(result.templateKey.notInRegistry.kinds, 2);
  assert.equal(result.templateKey.notInRegistry.topPrefixes[0].prefix, "TMPL-BV");
  assert.equal(result.crossConceptKeys.notInRegistry.kinds, 1);
  assert.equal(result.crossConceptKeys.notInRegistry.questions, 1);
  assert.deepEqual(result.crossConceptKeys.extensionKeys, { kinds: 1, questions: 2, unregisteredExtKinds: 1 });
  assert.equal(result.conditionKeys.notInRegistry.kinds, 1);
});

test("(4) fields missing from the dictionary and dictionary entries without rows", () => {
  const result = auditFields([{ a: 1, b: 2 }, { a: 1, c: 3 }, { c: 1 }], { fields: [{ name: "a", kind: "핵심" }, { name: "z", kind: "증거" }] });
  assert.deepEqual(result.notInDictionary, [{ name: "c", rows: 2 }, { name: "b", rows: 1 }]);
  assert.deepEqual(result.dictionaryEntriesWithNoRows, ["z"]);
  assert.deepEqual(result.dictionaryByKind, { "핵심": 1, "증거": 1 });
});

test("(5) utilization gap: metadata value vs catalog usability, split by kind", () => {
  const good = { sourceStatus: "VERIFIED", difficultyBucket: 2, difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL" };
  const records = [
    rec("u1", "original/a.js", { standardUnitKey: "U1", subUnitKey: "U1-S", difficultyBucket: 2, problemTypeKey: "PT_A" }),
    rec("u2", "original/b.js", { standardUnitKey: "U2", subUnitKey: "U2-S", difficultyBucket: 3, problemTypeKey: "" }),
    rec("u3", "similar/c.js", { standardUnitKey: "U3", subUnitKey: "", difficultyBucket: "중" }),
    rec("u4", "textbooks/d.js", { standardUnitKey: "", subUnitKey: "T-S", difficultyBucket: 4, problemTypeKey: "PT_B" }),
    rec("u5", "types/e.js", { standardUnitKey: "U5", subUnitKey: "U5-S" })
  ];
  const catalog = [
    { questionUid: "u1", sourceFile: "original/a.js", standardUnitKey: "U1", subUnitKey: "U1-S", problemTypeKey: "PT_A", assignmentEvidence: { ok: true }, ...good },
    // u2: unit and subunit shown, difficulty not usable (borderline code), no PT, no strict assignment; plus metaHintPT would count
    { questionUid: "u2", sourceFile: "original/b.js", standardUnitKey: "U2", subUnitKey: "U2-S", metaHintPT: "PT_H", sourceStatus: "HOLD", difficultyBucket: 3, difficultyConfidence: "high", difficultyBoundaryFlag: "B23", legacyLevelCompatibility: "BORDERLINE_REVIEW" },
    // u3: catalog shows a subunit the metadata does not have (taken from the exam JS)
    { questionUid: "u3", sourceFile: "similar/c.js", standardUnitKey: "U3", subUnitKey: "U3-FROM-JS", difficultyBucket: "UNKNOWN" },
    // u4: catalog hides what metadata has; u5 is not in the catalog at all
    { questionUid: "u4", sourceFile: "textbooks/d.js", standardUnitKey: "", subUnitKey: "", difficultyBucket: 4, sourceStatus: "VERIFIED", difficultyConfidence: "high", difficultyBoundaryFlag: "NONE", legacyLevelCompatibility: "NORMAL", metaBinding: "exact" },
    { questionUid: "u9", sourceFile: "original/z.js", standardUnitKey: "Z", subUnitKey: "Z-S" }
  ];
  const gap = auditUtilizationGap(records, catalog);
  const all = f => gap.table[f].all;
  assert.deepEqual(all("unit"), { metadataHasValue: 4, catalogUsable: 4, bothHave: 3, metadataOnly: 0, metadataOnlyNotInCatalog: 1, catalogOnly: 1 });
  assert.deepEqual(all("subunit"), { metadataHasValue: 4, catalogUsable: 4, bothHave: 2, metadataOnly: 1, metadataOnlyNotInCatalog: 1, catalogOnly: 2 });
  assert.deepEqual(all("subunitStrict"), { metadataHasValue: 4, catalogUsable: 1, bothHave: 1, metadataOnly: 2, metadataOnlyNotInCatalog: 1, catalogOnly: 0 });
  assert.deepEqual(all("difficulty"), { metadataHasValue: 3, catalogUsable: 2, bothHave: 2, metadataOnly: 1, metadataOnlyNotInCatalog: 0, catalogOnly: 0 });
  assert.deepEqual(all("type"), { metadataHasValue: 2, catalogUsable: 2, bothHave: 1, metadataOnly: 1, metadataOnlyNotInCatalog: 0, catalogOnly: 1 });
  // by kind: the original exams hold u1 and u2 (+ the catalog-only u9)
  assert.equal(gap.table.difficulty.original.catalogUsable, 1);
  assert.equal(gap.table.difficulty.textbooks.metadataOnly, 0);
  assert.equal(gap.table.difficulty.textbooks.bothHave, 1);
  assert.equal(gap.table.subunit.original.catalogUsable, 3);
  assert.equal(gap.table.unit.types.metadataOnlyNotInCatalog, 1);
  assert.equal(gap.catalogRowsWithoutMetadataRow, 1);
  assert.ok(gap.definitions.difficulty.catalog.includes("difficultyEligible"));
});

test("catalog difficulty rule follows difficultyEligible in general mode", () => {
  const base = { sourceStatus: "VERIFIED", difficultyBucket: 3, difficultyConfidence: "medium", difficultyBoundaryFlag: "B23", legacyLevelCompatibility: "STRONG_CONFLICT" };
  assert.equal(catalogDifficultyUsable(base), true);
  assert.equal(catalogDifficultyUsable({ ...base, sourceStatus: "HOLD" }), false);
  assert.equal(catalogDifficultyUsable({ ...base, sourceStatus: "HOLD", metaBinding: "content" }), true);
  assert.equal(catalogDifficultyUsable({ ...base, difficultyConfidence: "HIGH" }), false);
  assert.equal(catalogDifficultyUsable({ ...base, legacyLevelCompatibility: "BORDERLINE_REVIEW" }), false);
  assert.equal(catalogDifficultyUsable({ ...base, difficultyBucket: "UNKNOWN" }), false);
  assert.equal(catalogDifficultyUsable({ ...base, metadataConflicts: ["difficultyBucket"] }), false);
  assert.equal(catalogDifficultyUsable({ ...base, metadataConflicts: ["applicability"] }), true);
});

test("the column-dictionary catalog encoding is decoded the way archive2-core.js decodes it", () => {
  const rows = decodeCatalog({
    encoding: "column-dictionary-v1", columns: ["questionUid", "subUnitKey", "assignmentEvidence", "metaBinding"],
    strings: ["u1", "S-1"],
    records: [[[0], [1], { ok: true }, null], [[0], null, null, null]]
  });
  assert.deepEqual(rows, [{ questionUid: "u1", subUnitKey: "S-1", assignmentEvidence: { ok: true } }, { questionUid: "u1" }]);
  assert.deepEqual(decodeCatalog({ records: [{ a: 1 }] }), [{ a: 1 }]);
});
