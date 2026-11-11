import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Read-only diagnostic for the metadata operating system. It reads the canonical metadata, the two Meta OS
// dictionaries, the key registries and the Archive 2.0 catalog and reports:
//   1. status values that are not in the status vocabulary
//   2. fields whose values mix types (for example a non-integer in difficultyBucket)
//   3. PT / TPL / CrossConcept / Condition keys that are not in the key registries (extension keys apart)
//   4. fields that are not in the field dictionary
//   5. the utilization gap: values the canonical metadata holds versus what the catalog lets screens use
// It writes nothing except the optional --out file and never fails a build: the exit code is 0 unless an input
// cannot be read (then 1).
//   node archive/tools/meta-os/audit.mjs [--repo-root <dir>] [--out <file>] [--format json|text]

export const PATHS = {
  meta: "archive/data/question_metadata.json",
  fieldDictionary: "archive/data/meta-os/field-dictionary.json",
  statusVocabulary: "archive/data/meta-os/status-vocabulary.json",
  taxonomy: "archive/data/meta-foundation/compiled/taxonomy_registry.json",
  concepts: "archive/data/meta-foundation/compiled/concept_registry.json",
  conditions: "archive/data/meta-foundation/compiled/condition_registry.json",
  extensionKeys: "archive/data/archive2-extension-keys.json",
  catalog: "archive/data/archive2-catalog.json"
};
export const KINDS = ["original", "similar", "types", "textbooks"];

const typeOf = value => value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
const isPlainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
const nonEmptyString = value => typeof value === "string" && value.trim() !== "";
const bump = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by);
const kindOfFile = file => {
  const head = String(file || "").split("/")[0];
  return KINDS.includes(head) ? head : "other";
};

// ---- 1. status values outside the vocabulary -------------------------------------------------------------------------
function vocabularyLookup(vocabulary) {
  // exact path -> Set of values, and "prefix.*" -> Set of values
  const exact = new Map(), wildcard = new Map();
  for (const [id, field] of Object.entries(vocabulary.fields || {})) {
    const values = new Set(Object.keys(field.values || {}));
    for (const p of field.paths || [id]) {
      if (p.endsWith(".*")) wildcard.set(p.slice(0, -2), { id, values });
      else exact.set(p, { id, values });
    }
  }
  return { exact, wildcard };
}
const statusKey = value => typeof value === "string" ? value : JSON.stringify(value);

export function auditStatusValues(records, vocabulary) {
  const { exact, wildcard } = vocabularyLookup(vocabulary);
  const unknown = new Map(); // "path\0value" -> rows
  const seenRows = new Map(); // path -> rows with a value
  const note = (p, value, known) => {
    bump(seenRows, p);
    if (!known.has(statusKey(value))) bump(unknown, p + "\0" + statusKey(value));
  };
  for (const record of records) {
    for (const [p, { values }] of exact) {
      const value = p.includes(".") ? p.split(".").reduce((o, k) => (o == null ? undefined : o[k]), record) : record[p];
      if (value !== undefined) note(p, value, values);
    }
    for (const [base, { values }] of wildcard) {
      const holder = record[base];
      if (!isPlainObject(holder)) continue;
      for (const [key, value] of Object.entries(holder)) if (value !== undefined) note(base + "." + key, value, values);
    }
  }
  const values = [...unknown.entries()].map(([key, rows]) => {
    const [field, value] = key.split("\0");
    return { field, value, rows };
  }).sort((a, b) => b.rows - a.rows || (a.field + a.value < b.field + b.value ? -1 : 1));
  return {
    fieldsChecked: Object.keys(vocabulary.fields || {}).length,
    outsideVocabulary: values.length,
    rowsAffected: values.reduce((n, v) => n + v.rows, 0),
    values
  };
}

// ---- 2. mixed-type fields --------------------------------------------------------------------------------------------
export function auditMixedTypes(records) {
  const fields = new Map();
  for (const record of records) {
    for (const [name, value] of Object.entries(record)) {
      const entry = fields.get(name) || { present: 0, types: new Map(), samples: new Map() };
      entry.present++;
      const type = typeOf(value);
      bump(entry.types, type);
      if (!entry.samples.has(type)) entry.samples.set(type, new Map());
      const samples = entry.samples.get(type);
      if (samples.size < 6 || samples.has(statusKey(value))) bump(samples, statusKey(value).slice(0, 60));
      fields.set(name, entry);
    }
  }
  const mixed = [], withNull = [];
  for (const [name, entry] of fields) {
    const nonNull = [...entry.types.keys()].filter(t => t !== "null");
    const types = Object.fromEntries([...entry.types].sort((a, b) => b[1] - a[1]));
    if (nonNull.length > 1) {
      const dominant = nonNull.sort((a, b) => entry.types.get(b) - entry.types.get(a))[0];
      const minorSamples = {};
      for (const t of Object.keys(types)) if (t !== dominant && t !== "null" && entry.samples.has(t))
        minorSamples[t] = [...entry.samples.get(t)].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([v, n]) => ({ value: v, rows: n }));
      mixed.push({ field: name, present: entry.present, types, dominantType: dominant, minorSamples });
    } else if (entry.types.has("null") && nonNull.length === 1) withNull.push({ field: name, present: entry.present, nonNullType: nonNull[0], nulls: entry.types.get("null") });
  }
  mixed.sort((a, b) => a.field < b.field ? -1 : 1);
  withNull.sort((a, b) => b.nulls - a.nulls);
  // difficultyBucket detail: the registrar and the screens both want an integer 1..5.
  const bucket = { integer1to5: 0, otherInteger: 0, nonInteger: new Map(), missing: 0 };
  for (const record of records) {
    const v = record.difficultyBucket;
    if (v === undefined) bucket.missing++;
    else if (Number.isInteger(v) && v >= 1 && v <= 5) bucket.integer1to5++;
    else if (Number.isInteger(v)) bucket.otherInteger++;
    else bump(bucket.nonInteger, statusKey(v));
  }
  return {
    mixedTypeFields: mixed,
    nullablePlusOneTypeFields: withNull,
    difficultyBucket: {
      integer1to5: bucket.integer1to5, otherInteger: bucket.otherInteger, missing: bucket.missing,
      notInteger: Object.fromEntries([...bucket.nonInteger].sort((a, b) => b[1] - a[1]))
    }
  };
}

// ---- 3. keys not in the key registries -------------------------------------------------------------------------------
export function buildKeyIndex({ taxonomy, concepts, conditions, extensionKeys }) {
  return {
    pt: new Set((taxonomy.problemTypes || []).map(r => r.problemTypeKey)),
    tpl: new Set((taxonomy.templates || []).map(r => r.templateKey)),
    cross: new Set((concepts.concepts || []).map(r => r.conceptKey)),
    cond: new Set((conditions.conditions || []).map(r => r.conditionKey)),
    ext: new Set((extensionKeys?.definitions || []).map(r => r.key))
  };
}
const prefixOf = key => String(key).split("-").slice(0, 2).join("-");

export function auditKeys(records, index) {
  const kinds = [
    ["problemTypeKey", "pt", r => [r.problemTypeKey]],
    ["templateKey", "tpl", r => [r.templateKey]],
    ["crossConceptKeys", "cross", r => Array.isArray(r.crossConceptKeys) ? r.crossConceptKeys : []],
    ["conditionKeys", "cond", r => Array.isArray(r.conditionKeys) ? r.conditionKeys : []]
  ];
  const out = {};
  for (const [field, set, pick] of kinds) {
    const unknown = new Map(), ext = new Map(), extUnregistered = new Map();
    const rowsUnknown = new Set(), rowsExt = new Set();
    let checked = 0;
    records.forEach((record, i) => {
      for (const key of pick(record)) {
        if (!nonEmptyString(key)) continue;
        checked++;
        if (index[set].has(key)) continue;
        if (index.ext.has(key)) { bump(ext, key); rowsExt.add(i); continue; }
        if (key.startsWith("EXT-")) { bump(extUnregistered, key); rowsExt.add(i); continue; }
        bump(unknown, key); rowsUnknown.add(i);
      }
    });
    const prefixes = new Map();
    for (const [key, n] of unknown) bump(prefixes, prefixOf(key), n);
    out[field] = {
      keysChecked: checked,
      notInRegistry: { kinds: unknown.size, questions: rowsUnknown.size,
        topPrefixes: [...prefixes].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([prefix, rows]) => ({ prefix, rows })),
        examples: [...unknown].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([key, rows]) => ({ key, rows })) },
      extensionKeys: { kinds: ext.size, questions: rowsExt.size, unregisteredExtKinds: extUnregistered.size }
    };
  }
  return out;
}

// ---- 4. fields missing from the dictionary ---------------------------------------------------------------------------
export function auditFields(records, dictionary) {
  const known = new Set((dictionary.fields || []).map(f => f.name));
  const present = new Map();
  for (const record of records) for (const name of Object.keys(record)) bump(present, name);
  const missing = [...present].filter(([name]) => !known.has(name)).sort((a, b) => b[1] - a[1]).map(([name, rows]) => ({ name, rows }));
  const unusedEntries = [...known].filter(name => !present.has(name)).sort();
  const byKind = {};
  for (const f of dictionary.fields || []) byKind[f.kind] = (byKind[f.kind] || 0) + 1;
  return { fieldsInMetadata: present.size, fieldsInDictionary: known.size, notInDictionary: missing, dictionaryEntriesWithNoRows: unusedEntries, dictionaryByKind: byKind };
}

// ---- 5. utilization gap ----------------------------------------------------------------------------------------------
// "Metadata has a value" is read straight from the canonical row. "The catalog lets screens use it" reads the catalog
// row the Archive 2.0 screens load (archive/data/archive2-catalog.json):
//   unit       catalog standardUnitKey is not empty
//   subunit    catalog subUnitKey is not empty
//   subunitStrict  same, and the row carries a verified assignment (assignmentEvidence, i.e. the strict "basic" lane of
//              build-archive2-catalog.mjs verifiedBasicAssignment: approved unit and subunit fields, evidence, reviewed parent)
//   difficulty difficultyEligible(record, {useMode: "general"}) of archive/archive2-core.js: source VERIFIED or
//              metaBinding "content", integer bucket 1..5, confidence high|medium|low, boundary NONE|B12|B23|B34|B45,
//              compatibility NORMAL|BORDERLINE_ACCEPTABLE|STRONG_CONFLICT, no conflict on those four fields
//   type (PT)  catalog problemTypeKey or metaHintPT is not empty (metaFacetsOf in archive2-core.js reads both)
export const UTILIZATION_DEFINITIONS = {
  unit: {
    label: "단원",
    metadata: "question_metadata standardUnitKey is a non-empty string",
    catalog: "catalog row standardUnitKey is a non-empty string"
  },
  subunit: {
    label: "소단원",
    metadata: "question_metadata subUnitKey is a non-empty string",
    catalog: "catalog row subUnitKey is a non-empty string"
  },
  subunitStrict: {
    label: "소단원(엄격 배정)",
    metadata: "question_metadata subUnitKey is a non-empty string",
    catalog: "catalog row has assignmentEvidence (strict basic-lane assignment verified) and a non-empty subUnitKey"
  },
  difficulty: {
    label: "난이도",
    metadata: "question_metadata difficultyBucket is an integer 1..5",
    catalog: "difficultyEligible(record, {useMode: general}) in archive/archive2-core.js"
  },
  type: {
    label: "유형(PT)",
    metadata: "question_metadata problemTypeKey is a non-empty string",
    catalog: "catalog row problemTypeKey or metaHintPT is a non-empty string"
  }
};

const GENERAL_CONFIDENCE = ["high", "medium", "low"];
const BOUNDARY = ["NONE", "B12", "B23", "B34", "B45"];
const COMPAT = ["NORMAL", "BORDERLINE_ACCEPTABLE", "STRONG_CONFLICT"];
const DIFFICULTY_CONFLICTS = ["difficultyBucket", "difficultyConfidence", "difficultyBoundaryFlag", "legacyLevelCompatibility"];

export function catalogDifficultyUsable(row) {
  return (row.sourceStatus === "VERIFIED" || row.metaBinding === "content") &&
    Number.isInteger(row.difficultyBucket) && row.difficultyBucket >= 1 && row.difficultyBucket <= 5 &&
    GENERAL_CONFIDENCE.includes(row.difficultyConfidence) &&
    BOUNDARY.includes(row.difficultyBoundaryFlag) &&
    COMPAT.includes(row.legacyLevelCompatibility) &&
    !(row.metadataConflicts || []).some(field => DIFFICULTY_CONFLICTS.includes(field));
}
export const metaFlags = record => ({
  unit: nonEmptyString(record.standardUnitKey),
  subunit: nonEmptyString(record.subUnitKey),
  subunitStrict: nonEmptyString(record.subUnitKey),
  difficulty: Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5,
  type: nonEmptyString(record.problemTypeKey)
});
export const catalogFlags = row => ({
  unit: nonEmptyString(row.standardUnitKey),
  subunit: nonEmptyString(row.subUnitKey),
  subunitStrict: nonEmptyString(row.subUnitKey) && isPlainObject(row.assignmentEvidence),
  difficulty: catalogDifficultyUsable(row),
  type: nonEmptyString(row.problemTypeKey) || nonEmptyString(row.metaHintPT)
});

export function decodeCatalog(data) {
  if (data.encoding !== "column-dictionary-v1") return data.records || [];
  const decode = value => Array.isArray(value) && value.length === 1 && Number.isInteger(value[0]) ? data.strings[value[0]] : value;
  return data.records.map(row => {
    const out = {};
    data.columns.forEach((column, i) => { const v = decode(row[i]); if (v !== null) out[column] = v; });
    return out;
  });
}

export function auditUtilizationGap(records, catalogRows) {
  const byUid = new Map();
  for (const row of catalogRows) if (row.questionUid) byUid.set(row.questionUid, row);
  const facets = Object.keys(UTILIZATION_DEFINITIONS);
  const groups = ["all", ...KINDS];
  const blank = () => ({ metadataHasValue: 0, catalogUsable: 0, bothHave: 0, metadataOnly: 0, metadataOnlyNotInCatalog: 0, catalogOnly: 0 });
  const table = Object.fromEntries(facets.map(f => [f, Object.fromEntries(groups.map(g => [g, blank()]))]));
  const metaUids = new Set();
  for (const record of records) {
    metaUids.add(record.questionUid);
    const kind = kindOfFile(record.sourceArchiveFile);
    const row = byUid.get(record.questionUid);
    const m = metaFlags(record), c = row ? catalogFlags(row) : null;
    for (const f of facets) for (const g of ["all", kind]) {
      if (!table[f][g]) continue;
      const cell = table[f][g];
      if (m[f]) cell.metadataHasValue++;
      if (c?.[f]) cell.catalogUsable++;
      if (m[f] && c?.[f]) cell.bothHave++;
      else if (m[f] && c) cell.metadataOnly++;
      else if (m[f] && !c) cell.metadataOnlyNotInCatalog++;
      else if (!m[f] && c?.[f]) cell.catalogOnly++;
    }
  }
  // catalog rows whose uid is absent from the metadata still count as usable for the screens.
  let catalogWithoutMetadataRow = 0;
  for (const row of catalogRows) {
    if (metaUids.has(row.questionUid)) continue;
    catalogWithoutMetadataRow++;
    const kind = kindOfFile(row.sourceFile);
    const c = catalogFlags(row);
    for (const f of facets) for (const g of ["all", kind]) if (table[f][g] && c[f]) { table[f][g].catalogUsable++; table[f][g].catalogOnly++; }
  }
  return {
    definitions: UTILIZATION_DEFINITIONS,
    columns: {
      metadataHasValue: "문항 수: 정본 메타에 값이 있음",
      catalogUsable: "문항 수: 카탈로그가 화면에서 쓰게 해 줌",
      bothHave: "둘 다 있음",
      metadataOnly: "격차: 메타에는 값이 있으나 카탈로그가 쓰게 해 주지 않음(카탈로그에는 행이 있음)",
      metadataOnlyNotInCatalog: "격차: 메타에는 값이 있으나 카탈로그에 행이 없음",
      catalogOnly: "메타에는 값이 없으나 카탈로그가 쓰게 해 줌(시험지 JS 값 등)"
    },
    catalogRows: catalogRows.length,
    catalogRowsWithoutMetadataRow: catalogWithoutMetadataRow,
    table
  };
}

// ---- whole run -------------------------------------------------------------------------------------------------------
const readJson = (root, rel) => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));

export function runAudit({ repoRoot }) {
  const meta = readJson(repoRoot, PATHS.meta);
  const dictionary = readJson(repoRoot, PATHS.fieldDictionary);
  const vocabulary = readJson(repoRoot, PATHS.statusVocabulary);
  const index = buildKeyIndex({
    taxonomy: readJson(repoRoot, PATHS.taxonomy), concepts: readJson(repoRoot, PATHS.concepts),
    conditions: readJson(repoRoot, PATHS.conditions), extensionKeys: readJson(repoRoot, PATHS.extensionKeys)
  });
  const catalogRows = decodeCatalog(readJson(repoRoot, PATHS.catalog));
  const records = meta.records || [];
  return {
    schemaVersion: "meta-os-audit-v1",
    note: "Diagnostic only. Nothing here blocks a build and nothing was written to the metadata.",
    inputs: { ...PATHS },
    metadataRows: records.length,
    statusValues: auditStatusValues(records, vocabulary),
    mixedTypes: auditMixedTypes(records),
    keysNotInRegistry: auditKeys(records, index),
    fields: auditFields(records, dictionary),
    utilizationGap: auditUtilizationGap(records, catalogRows)
  };
}

export function formatText(report) {
  const lines = [];
  const n = v => Number(v).toLocaleString("en-US");
  lines.push(`Meta OS audit (diagnostic only) - ${n(report.metadataRows)} metadata rows`, "");
  const s = report.statusValues;
  lines.push(`1. Status values outside the vocabulary: ${s.outsideVocabulary} values in ${n(s.rowsAffected)} cells (${s.fieldsChecked} vocabulary fields checked)`);
  for (const v of s.values.slice(0, 15)) lines.push(`   ${v.field} = ${JSON.stringify(v.value)}  ${n(v.rows)} rows`);
  lines.push("");
  const m = report.mixedTypes;
  lines.push(`2. Fields with mixed value types: ${m.mixedTypeFields.length}`);
  for (const f of m.mixedTypeFields) lines.push(`   ${f.field}: ${JSON.stringify(f.types)}`);
  const b = m.difficultyBucket;
  lines.push(`   difficultyBucket integer 1..5: ${n(b.integer1to5)}; not an integer: ${JSON.stringify(b.notInteger)}; missing: ${n(b.missing)}`);
  lines.push("");
  lines.push("3. Keys not in the key registries (extension keys counted apart)");
  for (const [field, k] of Object.entries(report.keysNotInRegistry))
    lines.push(`   ${field}: ${n(k.notInRegistry.kinds)} kinds / ${n(k.notInRegistry.questions)} questions not in registry; ${n(k.extensionKeys.kinds)} EXT kinds / ${n(k.extensionKeys.questions)} questions`);
  lines.push("");
  const f = report.fields;
  lines.push(`4. Fields not in the field dictionary: ${f.notInDictionary.length} (metadata ${f.fieldsInMetadata} fields, dictionary ${f.fieldsInDictionary})`);
  for (const x of f.notInDictionary.slice(0, 15)) lines.push(`   ${x.name}  ${n(x.rows)} rows`);
  lines.push("");
  const u = report.utilizationGap;
  lines.push("5. Utilization gap (metadata has a value vs the catalog lets screens use it)");
  for (const [facet, d] of Object.entries(u.definitions)) lines.push(`   ${d.label}: metadata = ${d.metadata}; catalog = ${d.catalog}`);
  lines.push(`   catalog rows ${n(u.catalogRows)} (${n(u.catalogRowsWithoutMetadataRow)} without a metadata row)`);
  for (const facet of Object.keys(u.definitions)) {
    lines.push(`   [${u.definitions[facet].label}]  group: metadata / catalog / gap(in catalog) / gap(not in catalog) / catalog-only`);
    for (const [g, c] of Object.entries(u.table[facet]))
      lines.push(`     ${g.padEnd(9)} ${n(c.metadataHasValue)} / ${n(c.catalogUsable)} / ${n(c.metadataOnly)} / ${n(c.metadataOnlyNotInCatalog)} / ${n(c.catalogOnly)}`);
  }
  return lines.join("\n") + "\n";
}

function main() {
  const argv = process.argv.slice(2);
  const opt = name => {
    const i = argv.indexOf("--" + name);
    if (i < 0) return undefined;
    return argv[i + 1] === undefined || argv[i + 1].startsWith("--") ? true : argv[i + 1];
  };
  const repoRoot = opt("repo-root") && opt("repo-root") !== true
    ? path.resolve(String(opt("repo-root")))
    : path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
  const format = opt("format") === "text" ? "text" : "json";
  let report;
  try { report = runAudit({ repoRoot }); }
  catch (error) { console.error("meta-os audit: cannot read an input: " + error.message); process.exitCode = 1; return; }
  const text = format === "text" ? formatText(report) : JSON.stringify(report, null, 2) + "\n";
  if (opt("out") && opt("out") !== true) fs.writeFileSync(path.resolve(String(opt("out"))), text, "utf8");
  else process.stdout.write(text);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
