#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath, pathToFileURL } from "node:url";

const GENERATION = "MIDDLE_RECERT_2026-09-30_META_V2";
const SUFFIX = ".meta-review2.meta-v2.payload.json";
const txt = v => String(v ?? "").trim();
const norm = v => txt(v).normalize("NFC").replace(/\\/g,"/").replace(/^\.?\/?(?:archive\/)?exams\//,"").replace(/^\/+/,"");
const json = v => JSON.stringify(v,null,2)+"\n";
const sha256 = v => crypto.createHash("sha256").update(v).digest("hex");
const blobSha = b => crypto.createHash("sha1").update(`blob ${b.length}\0`).update(b).digest("hex");
const uniq = v => [...new Set((Array.isArray(v)?v:[]).map(txt).filter(Boolean))];
const drop = (o,k) => { if (Object.hasOwn(o,k)) delete o[k]; };
const same = (a,b) => JSON.stringify(a??null)===JSON.stringify(b??null);

function courseKey(unit,fallback="") {
  const m=txt(unit).match(/^M([123])-(\d{2})$/); if(m) return `M${m[1]}-${Number(m[2])<=4?1:2}`;
  const s=txt(unit).match(/^M([123])-([12])-/); return s?`M${s[1]}-${s[2]}`:fallback;
}
function fullCount(v,n){const m=txt(v).match(/^(\d+)\/(\d+)$/);return !!m&&+m[1]===+m[2]&&+m[2]===n;}
function validate(p,rel){
  if(p.certificationGeneration!==GENERATION) return false;
  if(p.status!=="META_REVIEW2_METADATA_AUDITED"||!Array.isArray(p.rows)||!p.rows.length) throw new Error(`bad META_V2 payload ${rel}`);
  if(!["MAIN_PRESENT_META_ONLY","FULL_INTEGRATED_V2"].includes(p.certificationTrack)) throw new Error(`bad track ${rel}`);
  if(+p.itemHoldCount||p.contentDriftDiscovered===true) throw new Error(`blocked payload ${rel}`);
  if(!fullCount(p.metadataAuditCount,p.rows.length)||!fullCount(p.difficultyAuditCount,p.rows.length)) throw new Error(`incomplete audit ${rel}`);
  const ord=p.rows.map(r=>+r.sourceOrdinal).sort((a,b)=>a-b); if(ord.some((v,i)=>v!==i+1)) throw new Error(`ordinal gap ${rel}`);
  return true;
}
function applyRow(cur,r,p,rel){
  const n={...cur}, final=r.semanticStatus==="FINAL"&&r.rpmPath, hold=r.semanticStatus==="HOLD"||r.metadataDisposition==="META_CANONICAL_HOLD";
  if(r.curriculum){n.curriculum=r.curriculum;n.curriculumKey=r.curriculum;} if(r.course)n.standardCourse=r.course;
  if(r.standardUnitKey)n.standardUnitKey=r.standardUnitKey;if(r.subUnitKey)n.subUnitKey=r.subUnitKey;n.courseKey=courseKey(r.standardUnitKey,n.courseKey||"");
  if(final){n.L1=r.rpmPath.majorUnit;n.L2=r.rpmPath.midUnit;n.L3=r.rpmPath.l3;n.L4=r.rpmPath.l4;}else{drop(n,"L3");drop(n,"L4");}
  for(const k of ["problemTypeKey","templateKey"]){if(r[k])n[k]=r[k];else drop(n,k);} n.crossConceptKeys=uniq(r.crossConceptKeys);n.conditionKeys=uniq(r.conditionKeys);n.integrationPattern=txt(r.integrationPattern)||"NONE";
  const d=r.difficulty||r,b=Number(d.difficultyBucket);if(!Number.isInteger(b)||b<1||b>5)throw new Error(`bad difficulty ${rel}#${r.sourceOrdinal}`);
  n.difficultyBucket=b;n.difficultyConfidence=txt(d.difficultyConfidence)||"medium";n.difficultyBoundaryFlag=txt(d.difficultyBoundaryFlag)||"NONE";n.legacyLevelCompatibility=txt(d.legacyLevelCompatibility)||"NORMAL";
  n.rpmSemanticStatus=r.semanticStatus||(final?"FINAL":"HOLD"); if(r.rpmRecordId)n.rpmPrimaryRecordId=r.rpmRecordId;else drop(n,"rpmPrimaryRecordId"); if(r.rpmPath)n.rpmPrimaryPath={...r.rpmPath};else drop(n,"rpmPrimaryPath");
  n.projectionStatus=r.projectionStatus||"UNMATERIALIZED";n.rpmCrosswalkStatus=r.mappingStatus||"";n.metadataDisposition=r.metadataDisposition||(hold?"META_CANONICAL_HOLD":"RPM_SEMANTIC_FINAL");n.semanticDisposition=hold?"META_CANONICAL_HOLD":"RPM_SEMANTIC_FINAL";
  if(hold){n.metaFoundationHoldReason=r.holdReason||"META_CANONICAL_HOLD";n.foundationTaxonomyStatus="HOLD";}else if(r.problemTypeKey&&r.templateKey){n.metaFoundationHoldReason=null;n.foundationTaxonomyStatus=r.projectionStatus==="PROJECTION_REUSE"?"CONFIRMED":"PROJECTION_PENDING";}else{n.metaFoundationHoldReason=null;drop(n,"foundationTaxonomyStatus");}
  for(const k of ["metaFoundationStatus","metaFoundationPackId","metaFoundationPackVersion"])drop(n,k);
  n.reviewStatus="reviewed_pass";n.metadataStatus="approved_semantic_review";n.tagConfidence="independent_review2";n.tagStatus="reviewed_pass";n.metadataRevision=`meta-foundation:${GENERATION}:meta-review2-v1`;
  n.fieldStatus={...(cur.fieldStatus||{}),standardUnit:"approved_review2",subUnit:"approved_review2",concept:final?"approved_review2":"meta_semantic_hold",problemType:r.problemTypeKey?"approved_review2":(final?"projection_unmaterialized":"meta_semantic_hold"),template:r.templateKey?"approved_review2":(final?"projection_unmaterialized":"meta_semantic_hold"),crossConcept:"approved_review2",condition:"approved_review2",integrationPattern:"approved_review2",difficulty:"approved_review2"};
  n.approvalEvidence=[...new Set([...(cur.approvalEvidence||[]),rel])];n.metaV2Materialization={schemaVersion:"archive-meta-v2-materialization-v1",certificationGeneration:GENERATION,certificationTrack:p.certificationTrack,canonicalOrdinal:+p.canonicalOrdinal,payloadPath:rel,payloadReviewedAtKst:p.reviewedAtKst||null};return n;
}
function payloads(root){const start=path.join(root,"archive/data/r2e-intake"),out=[];if(!fs.existsSync(start))return out;const walk=d=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=path.join(d,e.name);if(e.isDirectory())walk(f);else if(e.isFile()&&e.name.endsWith(SUFFIX))out.push(f);}};walk(start);return out.sort();}
function qCount(bytes,file){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c);vm.runInContext(bytes.toString("utf8"),c,{filename:file,timeout:5000});const b=c.window.questions||c.window.questionBank||c.questions||c.questionBank;if(!Array.isArray(b))throw new Error(`bank missing ${file}`);return b.length;}
function envelope(m,applied,at){m.generatedAt=at;m.reviewedPassCount=m.records.filter(r=>r.reviewStatus==="reviewed_pass").length;const sk=m.records.map(r=>`${norm(r.sourceArchiveFile)}#${+r.sourceOrdinal}`);m.counts={...(m.counts||{}),records:m.records.length,uidUnique:new Set(m.records.map(r=>r.questionUid)).size===m.records.length,sourceJoinUnique:new Set(sk).size===sk.length,semanticallyReviewed:m.records.filter(r=>r.reviewStatus==="reviewed_pass"||["approved_semantic_review","approved_exam_meta_source"].includes(r.metadataStatus)).length,explicitProblemTypeHolds:m.records.filter(r=>r.fieldStatus?.problemType==="manual_review_pending").length,explicitTemplateHolds:m.records.filter(r=>r.fieldStatus?.template==="manual_review_pending").length,explicitDifficultyHolds:m.records.filter(r=>r.fieldStatus?.difficulty==="manual_review_pending").length};m.metaV2Materialization={schemaVersion:"archive-meta-v2-materialization-summary-v1",certificationGeneration:GENERATION,appliedPayloadCount:applied.length,appliedPayloads:[...applied].sort()};delete m.digest;m.digest=sha256(JSON.stringify(m));}
function materialize(root,write=false){
  const mp=path.join(root,"archive/data/question_metadata.json"),m=JSON.parse(fs.readFileSync(mp,"utf8")),by=new Map();for(const r of m.records||[]){const k=`${norm(r.sourceArchiveFile)}#${+r.sourceOrdinal}`;if(by.has(k))throw new Error(`duplicate metadata ${k}`);by.set(k,r);}let mut=0,latest=null;const applied=[],stale=[];
  for(const f of payloads(root)){const rel=path.relative(root,f).split(path.sep).join("/"),p=JSON.parse(fs.readFileSync(f,"utf8"));if(!validate(p,rel))continue;const src=norm(p.sourceArchiveFile),sp=path.join(root,"archive/exams",src),bytes=fs.readFileSync(sp),expected=p.inputExamBlobSha||p.sourceExamBlobSha||p.sourceExamBlobSha1||"";if(expected&&blobSha(bytes)!==expected){stale.push(rel);continue;}if(qCount(bytes,sp)!==p.rows.length)throw new Error(`denominator drift ${rel}`);for(const r of p.rows){const k=`${src}#${+r.sourceOrdinal}`,cur=by.get(k);if(!cur)throw new Error(`metadata row missing ${k}`);const n=applyRow(cur,r,p,rel);if(!same(cur,n)){m.records[m.records.indexOf(cur)]=n;by.set(k,n);mut++;}}applied.push(rel);if(p.reviewedAtKst&&(!latest||p.reviewedAtKst>latest))latest=p.reviewedAtKst;}
  if(mut)envelope(m,applied,latest||new Date().toISOString());const next=json(m),cur=fs.readFileSync(mp,"utf8").replace(/\r\n/g,"\n"),changed=next!==cur;if(write&&changed)fs.writeFileSync(mp,next,"utf8");return {status:changed?(write?"UPDATED":"STALE"):"PASS",mode:write?"WRITE":"CHECK",payloadCount:applied.length,metadataMutationCount:mut,stalePayloadCount:stale.length,stalePayloads:stale,questionMetadataChanged:changed};
}
function main(){const a=process.argv.slice(2),write=a.includes("--write"),check=a.includes("--check"),i=a.indexOf("--repo-root"),root=path.resolve(i>=0?a[i+1]:path.join(path.dirname(fileURLToPath(import.meta.url)),"../../.."));if(write===check)throw new Error("use exactly one of --write/--check");const r=materialize(root,write);console.log(JSON.stringify(r,null,2));if(check&&r.questionMetadataChanged)throw new Error("META_V2 production metadata is stale");}
if(process.argv[1]&&pathToFileURL(path.resolve(process.argv[1])).href===import.meta.url)main();
export { GENERATION, applyRow, courseKey, materialize, norm, validate };
