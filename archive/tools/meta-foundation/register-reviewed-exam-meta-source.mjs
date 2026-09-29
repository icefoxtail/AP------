import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const args = Object.fromEntries(process.argv.slice(2).flatMap((v,i,a)=>v.startsWith("--")?[[v.slice(2),a[i+1]??true]]:[]));
const requestPath = path.resolve(root, String(args.request || ""));
const write = Boolean(args.write);
if (!requestPath.startsWith(root + path.sep) || !fs.existsSync(requestPath)) throw new Error("valid --request is required");

const readJson = rel => JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
const jsonText = v => JSON.stringify(v, null, 2) + "\n";
const normalizeFile = v => String(v || "").normalize("NFC").replace(/\\/g,"/").replace(/^\.?\/?archive\/exams\//,"").replace(/^\.?\/?exams\//,"").replace(/^\/+/, "").trim();
const gitBlobSha = bytes => crypto.createHash("sha1").update("blob " + bytes.length + "\0").update(bytes).digest("hex");
const equal = (a,b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

function loadBank(rel) {
  const full = path.join(root, "archive/exams", rel);
  const bytes = fs.readFileSync(full);
  const ctx = { window: {}, console: { log(){}, warn(){}, error(){} } };
  vm.createContext(ctx);
  vm.runInContext(bytes.toString("utf8"), ctx, { filename: full, timeout: 5000 });
  const bank = ctx.window.questionBank || ctx.window.questions;
  if (!Array.isArray(bank)) throw new Error("question bank missing: " + rel);
  return { bank, bytes, title: ctx.window.examTitle || "" };
}
function decodeCatalog(doc) {
  if (doc.encoding !== "column-dictionary-v1") return doc;
  const decode = v => Array.isArray(v) && v.length === 1 && Number.isInteger(v[0]) && doc.strings?.[v[0]] !== undefined ? doc.strings[v[0]] : v;
  return { ...doc, records: (doc.records || []).map(row => Object.fromEntries(doc.columns.map((c,i)=>[c,decode(row[i])]))) };
}
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
function refreshRuntime(rt) {
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
function allRuntimeFiles() {
  const dir = path.join(root,"archive/data/meta-foundation/runtime");
  return fs.readdirSync(dir).filter(n=>n.endsWith(".json") && n!=="runtime-bridge-receipt.json").sort()
    .map(name=>({ name, rel:"archive/data/meta-foundation/runtime/"+name, data:readJson("archive/data/meta-foundation/runtime/"+name) }));
}

const req = JSON.parse(fs.readFileSync(requestPath,"utf8"));
if (req.schemaVersion !== "archive-reviewed-exam-meta-register-request-v1") throw new Error("request schema mismatch");
if (req.reviewPassCount !== 2 || req.metadataReviewed !== true) throw new Error("request must attest REVIEW2 metadata review");
const source = normalizeFile(req.sourceArchiveFile);
if (!source || source !== req.sourceArchiveFile) throw new Error("sourceArchiveFile must be normalized archive/exams-relative path");
if (!Number.isInteger(req.expectedQuestionCount) || req.expectedQuestionCount < 1) throw new Error("expectedQuestionCount required");
if (!/^[0-9a-f]{40}$/.test(req.expectedSourceBlobSha1 || "")) throw new Error("expectedSourceBlobSha1 required");
if (!/^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/.+\.json$/.test(req.evidencePath || "")) throw new Error("evidencePath outside allowlist");

const { bank, bytes } = loadBank(source);
if (bank.length !== req.expectedQuestionCount) throw new Error("source denominator mismatch");
if (gitBlobSha(bytes) !== req.expectedSourceBlobSha1) throw new Error("source blob drift");

const metadataPath = "archive/data/question_metadata.json";
const metadata = readJson(metadataPath);
const targetMeta = metadata.records.filter(r=>normalizeFile(r.sourceArchiveFile)===source).sort((a,b)=>Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
if (targetMeta.length !== bank.length) throw new Error("metadata denominator mismatch");

// A newly registered exam first receives placeholder metadata rows with
// review_required / registration_pending_semantic_review. REVIEW2 may later
// promote canonical semantic fields in the production source JS. Only for
// those still-pending rows, hydrate the sidecar from that reviewed source
// before the strict source/metadata parity gate below. Already-approved rows
// remain immutable here: any later source drift must still fail parity.
const pendingSemanticStatuses = new Set(["registration_pending_semantic_review"]);
const sourceSemanticFields = [
  "standardCourse", "standardUnitKey", "standardUnit", "subUnitKey", "subUnit",
  "problemTypeKey", "templateKey", "crossConceptKeys", "conditionKeys",
  "integrationPattern", "difficultyBucket", "difficultyConfidence",
  "difficultyBoundaryFlag", "legacyLevelCompatibility"
];
for (let i=0;i<bank.length;i++) {
  const q = bank[i], meta = targetMeta[i];
  if (Number(meta.sourceOrdinal)!==i+1) throw new Error("metadata ordinal mismatch #"+(i+1));
  const pending = meta.reviewStatus==="review_required" || pendingSemanticStatuses.has(meta.metadataStatus);
  if (!pending) continue;
  for (const field of sourceSemanticFields) {
    if (q[field] !== undefined) meta[field] = Array.isArray(q[field]) ? [...q[field]] : q[field];
  }
}

const registry = readJson("archive/data/meta-foundation/canonical/registry_index.json");
const packVersion = new Map((registry.activePacks||[]).filter(x=>x.status==="ACTIVE").map(x=>[x.id,x.version]));
const taxonomy = readJson("archive/data/meta-foundation/compiled/taxonomy_registry.json");
const bindingsDoc = readJson("archive/data/meta-foundation/compiled/curriculum_bindings.json");
const conceptsDoc = readJson("archive/data/meta-foundation/compiled/concept_registry.json");
const conditionsDoc = readJson("archive/data/meta-foundation/compiled/condition_registry.json");
const crosswalk = readJson(req.crosswalkPath);
const catalog = decodeCatalog(readJson("archive/data/archive2-catalog.json"));
const catalogRows = (catalog.records||[]).filter(r=>normalizeFile(r.sourceFile)===source).sort((a,b)=>Number(a.sourceOrdinal)-Number(b.sourceOrdinal));
if (catalogRows.length !== bank.length) throw new Error("catalog denominator mismatch");

const ptMap = new Map((taxonomy.problemTypes||[]).map(x=>[x.problemTypeKey,x]));
const tplMap = new Map((taxonomy.templates||[]).map(x=>[x.templateKey,x]));
const bindingRows = bindingsDoc.bindings || bindingsDoc.records || [];
const conceptSet = new Set((conceptsDoc.concepts||conceptsDoc.records||[]).filter(x=>x.status==="ACTIVE").map(x=>x.conceptKey));
const conditionSet = new Set((conditionsDoc.conditions||conditionsDoc.records||[]).filter(x=>x.status==="ACTIVE").map(x=>x.conditionKey));
const runtimeFiles = allRuntimeFiles();
const runtimeByPack = new Map(runtimeFiles.map(x=>[x.data.packId,x]));
const runtimeOwnerByUid = new Map();
for (const item of runtimeFiles) for (const row of item.data.records||[]) {
  if (runtimeOwnerByUid.has(row.questionUid)) throw new Error("preexisting duplicate runtime UID: "+row.questionUid);
  runtimeOwnerByUid.set(row.questionUid,item.data.packId);
}
const groupLabels = {
  "H22-C2-01": { L1:"도형의 방정식", L2:"평면좌표" },
  "H22-C2-02": { L1:"도형의 방정식", L2:"직선의 방정식" },
  "H22-C2-03": { L1:"도형의 방정식", L2:"원의 방정식" },
  "H22-C2-04": { L1:"도형의 방정식", L2:"도형의 이동" },
  "H22-C2-05": { L1:"집합과 명제", L2:"집합" }
};
const approvals = [];
const changedPacks = new Set();

for (let i=0;i<bank.length;i++) {
  const q = bank[i], meta = targetMeta[i], cat = catalogRows[i];
  if (Number(meta.sourceOrdinal)!==i+1 || Number(cat.sourceOrdinal)!==i+1) throw new Error("ordinal mismatch #"+(i+1));
  const parity = {
    standardCourse:q.standardCourse, standardUnitKey:q.standardUnitKey, subUnitKey:q.subUnitKey,
    problemTypeKey:q.problemTypeKey, templateKey:q.templateKey, crossConceptKeys:q.crossConceptKeys||[],
    conditionKeys:q.conditionKeys||[], integrationPattern:q.integrationPattern||"NONE", difficultyBucket:q.difficultyBucket
  };
  for (const [k,v] of Object.entries(parity)) if (!equal(meta[k],v)) throw new Error(`source/metadata parity #${i+1}.${k}`);
  const pt = ptMap.get(q.problemTypeKey), tpl = tplMap.get(q.templateKey);
  if (!pt || pt.status!=="ACTIVE") throw new Error("inactive problemType #"+(i+1));
  if (!tpl || tpl.status!=="ACTIVE" || tpl.parentProblemTypeKey!==q.problemTypeKey) throw new Error("invalid template #"+(i+1));
  if ((q.crossConceptKeys||[]).some(k=>!conceptSet.has(k))) throw new Error("inactive CrossConcept #"+(i+1));
  if ((q.conditionKeys||[]).some(k=>!conditionSet.has(k))) throw new Error("inactive Condition #"+(i+1));
  const pack = pt.ownerPack, version = packVersion.get(pack);
  if (!version || !runtimeByPack.has(pack)) throw new Error("inactive/unavailable owner pack #"+(i+1)+": "+pack);
  const exactBindings = bindingRows.filter(b=>b.status==="ACTIVE" && b.curriculum==="2022" && b.standardUnitKey===q.standardUnitKey
    && (b.subUnitKey??null)===(q.subUnitKey??null) && b.problemTypeKey===q.problemTypeKey);
  if (exactBindings.length>1) throw new Error("ambiguous binding #"+(i+1));
  const cw = (crosswalk.records||[]).find(r=>r.curriculum==="2022" && r.scope==="공통수학2" && r.standardUnitKey===q.standardUnitKey
    && (r.subUnitKey??null)===(q.subUnitKey??null) && r.problemTypeKey===q.problemTypeKey && r.templateKey===q.templateKey);
  const projectionStatus = exactBindings.length===1 ? "REUSE"
    : cw && ["DIRECT_BINDING_GAP","FAMILY_BINDING_GAP"].includes(cw.mappingStatus) ? "BINDING_PENDING" : "UNMATERIALIZED";
  const labels = groupLabels[q.standardUnitKey];
  if (!labels) throw new Error("L1/L2 label mapping missing #"+(i+1));
  const revision = `meta-foundation:${pack}@${version}:exam-r2-source-v1`;
  Object.assign(meta,{
    curriculum:"2022", curriculumKey:"2022", courseKey:"공통수학2",
    L1:labels.L1, L2:labels.L2, L3:pt.canonicalLabelKo, L4:tpl.canonicalLabelKo,
    conceptClusterKey:meta.conceptClusterKey || q.subUnitKey,
    secondaryConceptKeys:Array.isArray(meta.secondaryConceptKeys)?meta.secondaryConceptKeys:[],
    foundationTaxonomyStatus:exactBindings.length===1?"CONFIRMED":"PROJECTION_PENDING",
    rpmSemanticStatus:"FINAL", projectionStatus,
    rpmCrosswalkStatus:cw?.mappingStatus || (projectionStatus==="UNMATERIALIZED"?"UNMATERIALIZED":""),
    curriculumApplicability:"DEFAULT_SCOPE", defaultSelectable:true,
    reviewStatus:"reviewed_pass", metadataStatus:"approved_semantic_review",
    tagConfidence:"independent_review2", tagStatus:"reviewed_pass", metadataRevision:revision,
    metaFoundationStatus:"ACTIVE", metaFoundationPackId:pack, metaFoundationPackVersion:version,
    metaFoundationHoldReason:null, l3Disposition:"ASSIGNED", l4Disposition:"ASSIGNED",
    fieldStatus:{ ...(meta.fieldStatus||{}), standardUnit:"approved_review2", subUnit:"approved_review2", concept:"approved_review2",
      problemType:"approved_review2", template:"approved_review2", crossConcept:"approved_review2",
      condition:"approved_review2", integrationPattern:"approved_review2", difficulty:"approved_review2" },
    approvalEvidence:[...new Set([...(meta.approvalEvidence||[]),req.evidencePath])]
  });
  let runtimeMaterialized = false;
  if (exactBindings.length===1) {
    const item = runtimeByPack.get(pack);
    const sample = (item.data.records||[]).find(r=>(r.curriculumKey||r.curriculum)==="2022" && r.standardUnitKey===q.standardUnitKey && r.subUnitKey===q.subUnitKey && r.problemTypeKey===q.problemTypeKey);
    if (!sample) throw new Error("runtime binding sample missing #"+(i+1));
    const rr = {
      questionUid:meta.questionUid, sourceArchiveFile:source, sourceOrdinal:i+1, sourceQuestionNo:String(q.sourceQuestionNo??q.id??""),
      sourceIdentity:`${source}#${i+1}`, sourceFingerprint:meta.sourceFingerprint, approvedSourceFingerprint:meta.sourceFingerprint,
      resolverSourceFingerprint:"", curriculum:"2022", curriculumKey:"2022", courseKey:"공통수학2", standardCourse:"공통수학2",
      standardUnitKey:q.standardUnitKey, standardUnit:q.standardUnit||meta.standardUnit||sample.standardUnit,
      subUnitKey:q.subUnitKey, subUnit:q.subUnit||meta.subUnit||sample.subUnit, L1:sample.L1, L2:sample.L2,
      L3:pt.canonicalLabelKo, L4:tpl.canonicalLabelKo, problemTypeKey:q.problemTypeKey, templateKey:q.templateKey,
      l3Disposition:"ASSIGNED", l4Disposition:"ASSIGNED", crossConceptKeys:[...(q.crossConceptKeys||[])],
      secondaryConceptKeys:[...(meta.secondaryConceptKeys||[])], conditionKeys:[...(q.conditionKeys||[])],
      integrationPattern:q.integrationPattern||"NONE", difficultyBucket:q.difficultyBucket,
      difficultyConfidence:q.difficultyConfidence||"high", difficultyBoundaryFlag:q.difficultyBoundaryFlag||"NONE",
      legacyLevel:q.level||"", legacyLevelCompatibility:q.legacyLevelCompatibility||"NORMAL",
      resolverEvidenceSha:"", difficultyEvidenceSha:"", foundationTaxonomyStatus:"CONFIRMED",
      curriculumApplicability:"DEFAULT_SCOPE", defaultSelectable:true, runtimeSelectable:true,
      reviewStatus:"reviewed_pass", metadataStatus:"approved_semantic_review", metadataRevision:revision,
      metaFoundationStatus:"ACTIVE", metaFoundationPackId:pack, metaFoundationPackVersion:version,
      catalogIdentityRepairVerified:cat.identityStatus==="VERIFIED", rawQuestionHash:cat.rawQuestionHash||""
    };
    const owner = runtimeOwnerByUid.get(meta.questionUid);
    if (owner && owner!==pack) throw new Error("runtime owner conflict #"+(i+1));
    const idx = item.data.records.findIndex(r=>r.questionUid===meta.questionUid);
    if (idx>=0) item.data.records[idx]=rr; else item.data.records.push(rr);
    runtimeOwnerByUid.set(meta.questionUid,pack);
    item.data.records.sort((a,b)=>a.questionUid.localeCompare(b.questionUid,"en"));
    changedPacks.add(pack);
    runtimeMaterialized = true;
  } else if (runtimeOwnerByUid.has(meta.questionUid)) throw new Error("projection-pending UID already in runtime #"+(i+1));
  approvals.push({ ordinal:i+1, questionUid:meta.questionUid, ownerPack:pack, problemTypeKey:q.problemTypeKey, templateKey:q.templateKey,
    projectionStatus, crosswalkStatus:cw?.mappingStatus||null, runtimeMaterialized });
}

metadata.reviewedPassCount = metadata.records.filter(r=>r.reviewStatus==="reviewed_pass").length;
metadata.counts = { ...(metadata.counts||{}) };
metadata.counts.records = metadata.records.length;
metadata.counts.uidUnique = new Set(metadata.records.map(r=>r.questionUid)).size===metadata.records.length;
metadata.counts.sourceJoinUnique = new Set(metadata.records.map(r=>normalizeFile(r.sourceArchiveFile)+"#"+Number(r.sourceOrdinal))).size===metadata.records.length;
metadata.counts.semanticallyReviewed = metadata.records.filter(r=>r.reviewStatus==="reviewed_pass" || ["approved_semantic_review","approved_exam_meta_source"].includes(r.metadataStatus)).length;
metadata.counts.explicitProblemTypeHolds = metadata.records.filter(r=>r.fieldStatus?.problemType==="manual_review_pending").length;
metadata.counts.explicitTemplateHolds = metadata.records.filter(r=>r.fieldStatus?.template==="manual_review_pending").length;
metadata.counts.explicitDifficultyHolds = metadata.records.filter(r=>r.fieldStatus?.difficulty==="manual_review_pending").length;

for (const pack of changedPacks) refreshRuntime(runtimeByPack.get(pack).data);

const allRows = runtimeFiles.flatMap(x=>x.data.records||[]);
if (new Set(allRows.map(r=>r.questionUid)).size!==allRows.length) throw new Error("runtime UID uniqueness fail");
if (new Set(allRows.map(r=>normalizeFile(r.sourceArchiveFile)+"#"+Number(r.sourceOrdinal))).size!==allRows.length) throw new Error("runtime source identity uniqueness fail");
const catalogByUid = new Map((catalog.records||[]).map(r=>[r.questionUid,r]));
let joinMismatch = 0;
for (const row of allRows) {
  const c = catalogByUid.get(row.questionUid);
  if (!c || normalizeFile(c.sourceFile)!==normalizeFile(row.sourceArchiveFile) || Number(c.sourceOrdinal)!==Number(row.sourceOrdinal)) joinMismatch++;
}
if (joinMismatch) throw new Error("runtime/catalog join mismatch: "+joinMismatch);

const receiptRel = "archive/data/meta-foundation/runtime/runtime-bridge-receipt.json";
const receipt = readJson(receiptRel);
receipt.checked = { ...(receipt.checked||{}) };
if (Object.hasOwn(receipt.checked,"geometryRecords")) receipt.checked.geometryRecords = runtimeByPack.get("GEOMETRY_EQUATIONS").data.records.length;
if (Object.hasOwn(receipt.checked,"setsPropositionsRuntimeRecords")) receipt.checked.setsPropositionsRuntimeRecords = runtimeByPack.get("SETS_PROPOSITIONS").data.records.length;
for (const k of ["combinedRuntimeRecords","combinedUniqueUid","combinedUniqueSourceIdentity","combinedRuntimeCatalogJoin"]) if (Object.hasOwn(receipt.checked,k)) receipt.checked[k]=allRows.length;
if (Object.hasOwn(receipt.checked,"combinedRuntimeCatalogJoinMismatch")) receipt.checked.combinedRuntimeCatalogJoinMismatch=0;
receipt.reviewedExamMetaSourceV1 = {
  schemaVersion:"archive-reviewed-exam-meta-source-receipt-v1", sourceArchiveFile:source,
  reviewCommit:req.reviewCommit, reviewPassCount:req.reviewPassCount, totalQuestions:bank.length,
  semanticFinal:approvals.length, projectionReuse:approvals.filter(x=>x.projectionStatus==="REUSE").length,
  bindingPending:approvals.filter(x=>x.projectionStatus==="BINDING_PENDING").length,
  projectionUnmaterialized:approvals.filter(x=>x.projectionStatus==="UNMATERIALIZED").length,
  runtimeMaterialized:approvals.filter(x=>x.runtimeMaterialized).length, evidencePath:req.evidencePath
};

const evidence = {
  schemaVersion:"archive-exam-r2-meta-registration-v1", status:"PASS_TEXT_META_REGISTERED",
  sourceArchiveFile:source, examFile:path.posix.basename(source), reviewBranch:req.reviewBranch, reviewCommit:req.reviewCommit,
  sourceBlobSha:req.expectedSourceBlobSha1, expectedQuestionCount:req.expectedQuestionCount, reviewPassCount:req.reviewPassCount,
  semanticFinal:approvals.length, projectionReuse:approvals.filter(x=>x.projectionStatus==="REUSE").length,
  bindingPending:approvals.filter(x=>x.projectionStatus==="BINDING_PENDING").length,
  projectionUnmaterialized:approvals.filter(x=>x.projectionStatus==="UNMATERIALIZED").length,
  runtimeMaterialized:approvals.filter(x=>x.runtimeMaterialized).length,
  holdCount:0, renderStatus:req.renderStatus||"NOT_RUN_CODEX_HANDOFF", rows:approvals
};

const outputs = new Map();
outputs.set(metadataPath,jsonText(metadata));
for (const pack of changedPacks) outputs.set(runtimeByPack.get(pack).rel,jsonText(runtimeByPack.get(pack).data));
outputs.set(receiptRel,jsonText(receipt));
outputs.set(req.evidencePath,jsonText(evidence));

const planned = [...outputs].filter(([rel,text])=>!fs.existsSync(path.join(root,rel)) || fs.readFileSync(path.join(root,rel),"utf8").replace(/\r\n/g,"\n")!==text).map(([rel])=>rel);
if (write) for (const [rel,text] of outputs) { fs.mkdirSync(path.dirname(path.join(root,rel)),{recursive:true}); fs.writeFileSync(path.join(root,rel),text,"utf8"); }

console.log(JSON.stringify({
  status:"PASS", write, sourceArchiveFile:source, totalQuestions:bank.length,
  semanticFinal:approvals.length, projectionReuse:approvals.filter(x=>x.projectionStatus==="REUSE").length,
  bindingPending:approvals.filter(x=>x.projectionStatus==="BINDING_PENDING").length,
  projectionUnmaterialized:approvals.filter(x=>x.projectionStatus==="UNMATERIALIZED").length,
  runtimeMaterialized:approvals.filter(x=>x.runtimeMaterialized).length,
  changedPacks:[...changedPacks].sort(), plannedPaths:planned, evidencePath:req.evidencePath
},null,2));
