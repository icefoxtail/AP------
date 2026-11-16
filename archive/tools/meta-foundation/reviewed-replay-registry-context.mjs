import fs from "node:fs";
import path from "node:path";

const PREFIX = "archive/data/meta-foundation/canonical/";
const INDEX = `${PREFIX}registry_index.json`;
const MASTER = "archive/data/master_tables/js_archive_tag_master.json";
const PROPOSAL_SCHEMAS = new Set([
  "archive-native-proposal-finalization-v1",
  "archive-native-proposal-finalization-v2",
  "archive-native-proposal-finalization-v3",
]);
const DEFINITIONS = {
  problemTypes: { table: "pt", key: "problemTypeKey", field: "problemTypeKey" },
  templates: { table: "tpl", key: "templateKey", field: "templateKey" },
  concepts: { table: "cc", key: "conceptKey", field: "crossConceptKeys" },
  conditions: { table: "cond", key: "conditionKey", field: "conditionKeys" },
};
const BINDING_KEYS = ["curriculum", "standardCourse", "standardUnitKey", "subUnitKey", "problemTypeKey"];
const stable = value => JSON.stringify(value, (_, item) => item && typeof item === "object" && !Array.isArray(item)
  ? Object.fromEntries(Object.keys(item).sort().map(key => [key, item[key]])) : item);
const equal = (a, b) => stable(a) === stable(b);
const text = value => typeof value === "string" && value.trim().length > 0;
const owner = value => typeof value === "string" && /^[A-Z][A-Z0-9_]*$/.test(value);
const slug = value => value.toLowerCase().replaceAll("_", "-");
const fail = message => { throw new Error(`native replay registry context: ${message}`); };

function proposal(item) {
  return PROPOSAL_SCHEMAS.has(item?.sourceReview?.proposalFinalization?.schemaVersion);
}
function scope(item) {
  return item?.sourceReview?.scopeFieldBinding?.schemaVersion === "archive-native-reviewed-scope-fields-v1";
}
function currentApplication(item) {
  return item?.sourceReview?.currentDefinitionApplication?.schemaVersion === "archive-m2s1-current-definition-application-v1";
}
function prerequisiteApplication(item) {
  return item?.sourceReview?.prerequisiteExistingApplication?.schemaVersion === "archive-m2s1-prerequisite-existing-application-v1";
}
function currentTargetApplication(item) {
  return item?.sourceReview?.currentTargetApplication?.schemaVersion === "archive-m3s2-current-target-application-v1";
}
function selectedDefinition(item, spec, key) {
  const value = item.after?.[spec.field];
  return Array.isArray(value) ? value.includes(key) : value === key;
}
function bindingTuple(value) {
  return [value.curriculum, value.standardCourse, value.standardUnitKey, value.subUnitKey ?? null, value.problemTypeKey];
}
function selectedBinding(item, record) {
  const after = item.after;
  return after && equal(bindingTuple({ ...after, curriculum: after.curriculumKey || after.curriculum }), bindingTuple(record));
}
function activePack(currentTables, record, file, suffix) {
  if (!owner(record.ownerPack) || file !== `${PREFIX}packs/${slug(record.ownerPack)}/${suffix}.json`)
    fail("registry path and explicit owner disagree");
  const pack = currentTables.packs?.get(record.ownerPack);
  if (pack?.meta?.packId !== record.ownerPack || pack.meta.canonicalStatus !== "ACTIVE")
    fail("current ACTIVE owner pack missing");
}

// The caller first authenticates the original request against its registration
// receipt and checks all evidence refs. This function restores only that request's
// add-only lookup entries for a read-only replay of its original source proof.
// It does not reconstruct historical pack versions or unrelated registry state,
// accept new definitions, change a request, or write canonical files.
export function restoreReviewedReplayCanonicalBefore({ request, currentTables, root }) {
  const changes = request.registryChanges;
  if (changes === undefined || Array.isArray(changes) && changes.length === 0) return currentTables;
  if (!Array.isArray(changes) || request.schemaVersion !== "archive-reviewed-exam-meta-register-request-v2" ||
      request.scope !== "PARTIAL_UIDS" || request.approval?.type !== "FINAL_QA" ||
      request.approval.metadataReviewed !== true || request.approval.sourceRebind !== undefined ||
      request.registrationMode !== undefined || !Array.isArray(request.items) || !request.items.length)
    fail("requires an ordinary partial FINAL_QA request with an explicit source-proof opt-in");
  const opted = request.items.filter(item => proposal(item) || scope(item) || currentApplication(item) || prerequisiteApplication(item) || currentTargetApplication(item));
  if (!opted.length) fail("proposal, native-scope or current-application proof opt-in required");
  if (!currentTables || typeof currentTables !== "object") fail("current lookup tables missing");
  const restored = Object.create(Object.getPrototypeOf(currentTables), Object.getOwnPropertyDescriptors(currentTables));
  const cloned = new Set(), touched = new Set();
  const remove = (table, key, expected) => {
    const pair = stable([table, key]);
    if (touched.has(pair)) fail("duplicate add-only replay entry");
    touched.add(pair);
    if (!(currentTables[table] instanceof Map) || !currentTables[table].has(key) ||
        !equal(currentTables[table].get(key), expected))
      fail("current canonical record differs from the originally registered after value");
    if (!cloned.has(table)) {
      Object.defineProperty(restored, table, { ...Object.getOwnPropertyDescriptor(currentTables, table), value: new Map(currentTables[table]) });
      cloned.add(table);
    }
    restored[table].delete(key);
  };
  const whole = new Map(), indexes = new Map(), handled = new Set();
  for (const change of changes) {
    if (!change || typeof change !== "object" || Array.isArray(change) ||
        change.before !== null || !Object.hasOwn(change, "before") ||
        !change.after || typeof change.after !== "object" || Array.isArray(change.after))
      fail("only explicit add-only records or complete new owner documents can be restored");
    if (change.collection === undefined) {
      if (Object.hasOwn(change, "match") || whole.has(change.path)) fail("invalid or duplicate whole owner document");
      whole.set(change.path, change);
    } else if (change.path === INDEX) {
      const { collection, match, after } = change;
      if (!["activePacks", "activeConceptShards"].includes(collection) || !owner(after.id) ||
          after.status !== "ACTIVE" || !equal(match, { id: after.id })) fail("invalid new owner index record");
      const key = stable([collection, after.id]);
      if (indexes.has(key)) fail("duplicate new owner index record");
      indexes.set(key, change);
    }
  }
  const read = file => {
    if (!text(root)) fail("repository root required for complete new owner replay");
    // Only paths constructed below from validated owner identifiers reach this read.
    try { return JSON.parse(fs.readFileSync(path.join(root, file), "utf8")); }
    catch { fail("current complete owner document missing or invalid"); }
  };
  const document = file => {
    const change = whole.get(file);
    if (!change) fail("complete new owner document bundle required");
    handled.add(change);
    return change.after;
  };
  const exact = (actual, expected) => {
    if (!equal(actual, expected)) fail("current complete owner document differs from its original add-only output");
  };
  const records = (rows, key, expectedOwner, ownerField) => {
    if (!Array.isArray(rows)) fail("complete owner records missing");
    const seen = new Set();
    for (const row of rows) {
      if (!row || typeof row !== "object" || !text(row[key]) || row.status !== "ACTIVE" || seen.has(row[key]) ||
          row[ownerField] !== undefined && row[ownerField] !== expectedOwner)
        fail("invalid complete owner record or explicit owner mismatch");
      seen.add(row[key]);
    }
  };
  if ((whole.size || indexes.size) && !opted.some(proposal)) fail("complete new owners require a native proposal proof");
  let index;
  for (const change of indexes.values()) {
    index ??= read(INDEX);
    const { collection, after } = change;
    if (!Array.isArray(index[collection])) fail("current owner index missing");
    const entries = index[collection].filter(row => row.id === after.id);
    if (entries.length !== 1) fail("current owner index must contain exactly one matching entry");
    handled.add(change);
    if (collection === "activePacks") {
      const base = `${PREFIX}packs/${slug(after.id)}`;
      const meta = document(`${base}/pack.json`), taxonomy = document(`${base}/taxonomy.json`),
        bindings = document(`${base}/bindings.json`), aliases = document(`${base}/aliases.json`);
      if (meta.packId !== after.id || meta.canonicalStatus !== "ACTIVE" || meta.packVersion !== after.version ||
          taxonomy.status !== "ACTIVE" || bindings.status !== "ACTIVE" || !Array.isArray(aliases.aliases))
        fail("complete new pack identity, status or version mismatch");
      records(taxonomy.problemTypes, "problemTypeKey", after.id, "ownerPack");
      records(taxonomy.templates, "templateKey", after.id, "ownerPack");
      if (!taxonomy.problemTypes.some(row => opted.some(item => proposal(item) && selectedDefinition(item, DEFINITIONS.problemTypes, row.problemTypeKey))) &&
          !taxonomy.templates.some(row => opted.some(item => proposal(item) && selectedDefinition(item, DEFINITIONS.templates, row.templateKey))))
        fail("complete new pack must contain a selected native proposal primary");
      if (!Array.isArray(bindings.bindings) || bindings.bindings.some(row => row.status !== "ACTIVE" ||
          row.ownerPack !== undefined && row.ownerPack !== after.id ||
          !BINDING_KEYS.filter(k => k !== "subUnitKey").every(k => text(row[k])) ||
          !(row.subUnitKey === undefined || row.subUnitKey === null || text(row.subUnitKey))))
        fail("invalid complete new pack binding");
      const counts = { problemTypeCount: taxonomy.problemTypes.length, templateCount: taxonomy.templates.length,
        bindingCount: bindings.bindings.length, aliasCount: aliases.aliases.length };
      const expectedMeta = { ...meta, ...counts }, expectedTaxonomy = { ...taxonomy, problemTypeCount: counts.problemTypeCount, templateCount: counts.templateCount },
        expectedBindings = { ...bindings, bindingCount: counts.bindingCount };
      const pack = currentTables.packs?.get(after.id);
      if (!pack) fail("current complete new pack missing");
      exact(pack.entry, after); exact(entries[0], after);
      exact(pack.meta, expectedMeta); exact(pack.taxonomy, expectedTaxonomy); exact(pack.bindings, expectedBindings); exact(pack.aliases, aliases);
      for (const [name, expected] of [["pack", expectedMeta], ["taxonomy", expectedTaxonomy], ["bindings", expectedBindings], ["aliases", aliases]])
        exact(read(`${base}/${name}.json`), expected);
      for (const row of taxonomy.problemTypes) remove("pt", row.problemTypeKey, row);
      for (const row of taxonomy.templates) remove("tpl", row.templateKey, row);
      for (const row of bindings.bindings) remove("bindings", stable(bindingTuple(row)), row);
      remove("packs", after.id, pack);
    } else {
      const file = `${PREFIX}concepts/${slug(after.id)}.json`, shard = document(file);
      if (shard.shardId !== after.id || shard.shardVersion !== after.version) fail("complete new shard identity or version mismatch");
      records(shard.concepts, "conceptKey", after.id, "ownerConceptShard");
      if (!shard.concepts.some(row => opted.some(item => proposal(item) && selectedDefinition(item, DEFINITIONS.concepts, row.conceptKey))))
        fail("complete new shard must contain a selected native proposal concept");
      exact(read(file), { ...shard, conceptCount: shard.concepts.length });
      exact(entries[0], { ...after, conceptCount: shard.concepts.length });
      for (const row of shard.concepts) remove("cc", row.conceptKey, row);
    }
  }
  if ([...whole.values()].some(change => !handled.has(change))) fail("unpaired or unsupported whole owner document");
  for (const change of changes) {
    if (handled.has(change)) continue;
    if (!change.match || typeof change.match !== "object" || Array.isArray(change.match))
      fail("only explicit add-only ACTIVE records can be restored");
    const { collection, after, match, path: file } = change;
    let table, key;
    if (file === MASTER && collection === "$") {
      if (after.status !== "active" || !text(after.key) || !equal(match, { key: after.key }) ||
          !["standardUnitKey", "subUnitKey"].includes(after.keyType) ||
          !opted.some(item => proposal(item) && item.after?.[after.keyType] === after.key &&
            (after.keyType !== "subUnitKey" || item.after.standardUnitKey === after.parentKey && item.after.standardUnitKey === after.standardUnitKey)))
        fail("master addition must be an exact selected native parent");
      remove("master", after.key, after);
      continue;
    }
    if (after.status !== "ACTIVE") fail("only ACTIVE canonical additions can be restored");
    if (collection === "bindings") {
      if (!equal(Object.keys(match).sort(), [...BINDING_KEYS].sort()) ||
          !BINDING_KEYS.filter(k => k !== "subUnitKey").every(k => text(after[k])) ||
          !(after.subUnitKey === null || text(after.subUnitKey)) ||
          !BINDING_KEYS.every(k => equal(match[k], after[k])) ||
          !opted.some(item => selectedBinding(item, after)))
        fail("binding must exactly match a selected native primary tuple");
      activePack(currentTables, after, file, "bindings");
      table = "bindings"; key = stable(bindingTuple(after));
    } else {
      const spec = DEFINITIONS[collection];
      if (!spec || !text(after[spec.key]) || !equal(match, { [spec.key]: after[spec.key] }) ||
          !opted.some(item => (proposal(item) || collection === "templates" && currentApplication(item)) &&
            selectedDefinition(item, spec, after[spec.key])))
        fail("definition must be the exact selected proposal key");
      if (collection === "problemTypes" || collection === "templates") activePack(currentTables, after, file, "taxonomy");
      else if (collection === "concepts") {
        if (!owner(after.ownerConceptShard) || file !== `${PREFIX}concepts/${slug(after.ownerConceptShard)}.json`)
          fail("concept path and explicit shard disagree");
      } else if (file !== `${PREFIX}condition_registry.json`) fail("condition registry path mismatch");
      table = spec.table; key = after[spec.key];
    }
    remove(table, key, after);
  }
  return restored;
}
