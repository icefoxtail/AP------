function groupUsage(records, field) {
  const map = new Map();
  for (const row of records) {
    const value = row[field];
    const keys = Array.isArray(value) ? value : [value];
    for (const key of keys.filter(x => typeof x === "string" && x)) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row.questionUid);
    }
  }
  return [...map.entries()].sort(([a],[b]) => a.localeCompare(b,"en")).map(([key,uids])=>({ key, count: uids.length, questionUids: uids.sort() }));
}
function makeTaxonomyRows(records) {
  const groups = new Map();
  for (const row of records) {
    if (!row.problemTypeKey || row.metaFoundationL3Status === "ROUTE_OUT") continue;
    const sig = [row.curriculumKey || row.curriculum,row.courseKey,row.L1,row.L2,row.L3,row.L4,row.problemTypeKey,row.templateKey,row.curriculumApplicability].join("\u0000");
    if (!groups.has(sig)) groups.set(sig, []);
    groups.get(sig).push(row);
  }
  return [...groups.values()].map(rows => {
    const f = rows[0];
    return {
      curriculumKey: f.curriculumKey || f.curriculum, courseKey: f.courseKey, L1: f.L1, L2: f.L2,
      L3: f.L3, L4: f.L4, problemTypeKey: f.problemTypeKey, templateKey: f.templateKey,
      curriculumApplicability: f.curriculumApplicability, defaultSelectable: rows.some(r=>r.defaultSelectable===true),
      supportingItemCount: rows.length
    };
  }).sort((a,b)=>`${a.curriculumKey}|${a.courseKey}|${a.L1}|${a.L2}|${a.problemTypeKey}|${a.templateKey}`.localeCompare(`${b.curriculumKey}|${b.courseKey}|${b.L1}|${b.L2}|${b.problemTypeKey}|${b.templateKey}`,"en"));
}
export function refreshRuntime(rt) {
  const records = rt.records;
  const selectable = records.filter(r=>r.runtimeSelectable===true).length;
  const dynamic = {
    records: records.length,
    taxonomyRows: makeTaxonomyRows(records).length,
    defaultSelectable: records.filter(r=>r.defaultSelectable===true).length,
    automaticEligibleExpected: selectable,
    sourceHold: records.filter(r=>r.metadataStatus==="SOURCE_HOLD").length,
    supplementary: records.filter(r=>r.supplementary===true).length
  };
  rt.counts = { ...(rt.counts || {}) };
  for (const [k,v] of Object.entries(dynamic)) if (k === "records" || Object.hasOwn(rt.counts,k)) rt.counts[k] = v;
  if (Object.hasOwn(rt,"taxonomyRows")) rt.taxonomyRows = makeTaxonomyRows(records);
  if (Object.hasOwn(rt,"ownedScopes")) {
    const scopes = new Map();
    for (const row of records.filter(x=>x.problemTypeKey)) {
      const scope = { curriculumKey: row.curriculumKey || row.curriculum, courseKey: row.courseKey, L1: row.L1, L2: row.L2 };
      scopes.set(Object.values(scope).join("\u0000"), scope);
    }
    rt.ownedScopes = [...scopes.values()].sort((a,b)=>Object.values(a).join("|").localeCompare(Object.values(b).join("|"),"en"));
  }
  rt.usage = {
    schemaVersion: "archive-reviewed-runtime-usage-v1", records: records.length,
    problemTypes: groupUsage(records,"problemTypeKey"), templates: groupUsage(records,"templateKey"),
    crossConcepts: groupUsage(records,"crossConceptKeys"), conditions: groupUsage(records,"conditionKeys")
  };
}
