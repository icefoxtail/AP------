import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../..');
const INVENTORY=JSON.parse(fs.readFileSync(path.join(HERE,'source-inventory-current-display-full-v5.json'),'utf8'));
const MANIFEST=JSON.parse(fs.readFileSync(path.join(HERE,'final-candidates/final-candidate-manifest.json'),'utf8'));
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const staticAuditPassCount=MANIFEST.records.filter(row=>row.staticAuditStatus==='PASS').length;
if(INVENTORY.records.length!==130||INVENTORY.totals.fullwidthSolutionImages!==99||MANIFEST.status!=='PASS'||MANIFEST.records.length!==130||staticAuditPassCount!==130)throw Error('FINAL_PROMOTION_GATE_FAIL');
const jsByPath=new Map();
for(const row of INVENTORY.records){const prior=jsByPath.get(row.sourceJs.path);if(prior&&prior.sha256!==row.sourceJs.sha256)throw Error(`EXAM_SOURCE_SHA_CONFLICT:${row.sourceJs.path}`);jsByPath.set(row.sourceJs.path,row.sourceJs);}
for(const [sourcePath,record] of jsByPath){const current=fs.readFileSync(path.join(ROOT,sourcePath));if(hash(current)!==record.sha256)throw Error(`CURRENT_SOURCE_JS_SHA_MISMATCH:${sourcePath}`);}
const manifestByRef=new Map(MANIFEST.records.map(row=>[row.solutionImageRef,row]));
const receiptRows=[];
for(const row of INVENTORY.records){
  const candidate=manifestByRef.get(row.solutionImageRef);
  if(!candidate||candidate.status!=='PASS'||candidate.staticAuditStatus!=='PASS'||candidate.builderStatus!=='CANDIDATE_REQUIRES_QA')throw Error(`FINAL_CANDIDATE_NOT_QUALIFIED:${row.exam}:q${row.questionId}`);
  const bytes=fs.readFileSync(path.join(ROOT,candidate.candidateSvgPath));
  const candidateSha=hash(bytes);if(candidateSha!==candidate.candidateSvgSha256)throw Error(`CANDIDATE_HASH_MISMATCH:${row.exam}:q${row.questionId}`);
  const targetRel=row.solutionImageRef;const targetAbs=path.resolve(ROOT,targetRel);
  if(!targetAbs.startsWith(path.resolve(ROOT,'archive/assets/images')+path.sep))throw Error(`ASSET_TARGET_OUTSIDE_ROOT:${targetRel}`);
  fs.mkdirSync(path.dirname(targetAbs),{recursive:true});fs.writeFileSync(targetAbs,bytes);
  const promotedSha=hash(fs.readFileSync(targetAbs));if(promotedSha!==candidateSha)throw Error(`PROMOTED_HASH_MISMATCH:${row.exam}:q${row.questionId}`);
  receiptRows.push({exam:row.exam,questionId:row.questionId,solutionImageRef:targetRel,candidateSvgPath:candidate.candidateSvgPath,
    candidateSvgSha256:candidateSha,promotedSha256:promotedSha,builderStatus:candidate.builderStatus,staticAuditStatus:candidate.staticAuditStatus,
    sourceSolutionSvgBytesReadAsConstructionInput:false,previousProductionSvgBytesReadAsConstructionInput:false});
}
const receipt={schemaVersion:'M3_FULL_REBUILD_FINAL_PROMOTION_RECEIPT_v1',branch:INVENTORY.branch,inventoryPath:'archive/evidence/visual-publication-2025-m3-full-rebuild/source-inventory-current-display-full-v5.json',
  inventorySha256:hash(fs.readFileSync(path.join(HERE,'source-inventory-current-display-full-v5.json'))),candidateManifestPath:'archive/evidence/visual-publication-2025-m3-full-rebuild/final-candidates/final-candidate-manifest.json',
  candidateManifestSha256:hash(fs.readFileSync(path.join(HERE,'final-candidates/final-candidate-manifest.json'))),denominator:{exams:10,solutionSvgs:130,fullwidthSolutionImages:99,byExam:INVENTORY.totals.byExam},
  officialBuilder:'geometry-publication-v1',independentStaticAudit:'geometry-publication-audit-v1',status:'PASS',promotedCount:receiptRows.length,staticAuditPassCount,
  sourceSolutionSvgBytesReadAsConstructionInputs:false,previousProductionSvgBytesReadAsConstructionInputs:false,records:receiptRows};
fs.writeFileSync(path.join(HERE,'final-promotion-receipt-v1.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({status:receipt.status,promotedCount:receipt.promotedCount,byExam:receipt.denominator.byExam,receipt:'archive/evidence/visual-publication-2025-m3-full-rebuild/final-promotion-receipt-v1.json'},null,2));
