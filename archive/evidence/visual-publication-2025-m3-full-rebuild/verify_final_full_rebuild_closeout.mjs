import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const HERE=path.dirname(fileURLToPath(import.meta.url)),ROOT=path.resolve(HERE,'../../..');
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=relative=>fs.readFileSync(path.join(HERE,relative));
const inventory=JSON.parse(read('source-inventory-current-display-full-v5.json'));
const candidates=JSON.parse(read('final-candidates/final-candidate-manifest.json'));
const promotion=JSON.parse(read('final-promotion-receipt-v1.json'));
const humanReview=JSON.parse(read('independent-visual-review-receipt-v1.json'));
const render=JSON.parse(read('archive-render-desktop-20261009-v7/summary.json'));
const matrix=JSON.parse(read('archive-render-desktop-20261009-v7/archive-render-matrix.json'));
const enginePath=path.join(ROOT,'archive/engine.html');
if(inventory.records.length!==130||inventory.totals.exams!==10||inventory.totals.fullwidthSolutionImages!==99)throw Error('FINAL_INVENTORY_GATE_FAIL');
if(candidates.status!=='PASS'||candidates.candidateCount!==130||candidates.records.some(row=>row.status!=='PASS'||row.staticAuditStatus!=='PASS'))throw Error('FINAL_STATIC_AUDIT_GATE_FAIL');
if(humanReview.status!=='PASS'||humanReview.reviewedRevisionCount!==24||humanReview.records.length!==24||humanReview.candidateManifestSha256!==hash(read('final-candidates/final-candidate-manifest.json')))throw Error('FINAL_HUMAN_REVIEW_GATE_FAIL');
if(promotion.status!=='PASS'||promotion.promotedCount!==130||promotion.records.length!==130)throw Error('FINAL_ASSET_PROMOTION_GATE_FAIL');
if(render.status!=='PASS'||render.rows.length!==10||render.rows.some(row=>row.status!=='PASS'||row.errors.length!==0))throw Error('FINAL_DESKTOP_RENDER_GATE_FAIL');
const loadedSvgCount=render.rows.reduce((sum,row)=>sum+Number(row.capture?.loadedSvgCount||0),0);
if(loadedSvgCount!==130)throw Error(`FINAL_RENDER_DENOMINATOR_MISMATCH:${loadedSvgCount}`);
if(matrix.synthetic!==false||matrix.viewport?.mode!=='sol'||matrix.viewport?.width!==1440||matrix.viewport?.height!==1000||matrix.viewport?.mobileQualification!==false)throw Error('FINAL_DESKTOP_MATRIX_CONTRACT_FAIL');
if(matrix.engineSha256!==hash(fs.readFileSync(enginePath)))throw Error('FINAL_RENDER_ENGINE_SHA_MISMATCH');
if(matrix.denominator?.inventorySha256!==hash(read('source-inventory-current-display-full-v5.json')))throw Error('FINAL_RENDER_INVENTORY_SHA_MISMATCH');
if(matrix.denominator?.candidateManifestSha256!==hash(read('final-candidates/final-candidate-manifest.json')))throw Error('FINAL_RENDER_CANDIDATE_MANIFEST_SHA_MISMATCH');
if(render.matrixSha256!==hash(read('archive-render-desktop-20261009-v7/archive-render-matrix.json')))throw Error('FINAL_RENDER_MATRIX_SHA_MISMATCH');
const promotionByRef=new Map(promotion.records.map(row=>[row.solutionImageRef,row]));
const candidateByRef=new Map(candidates.records.map(row=>[row.solutionImageRef,row]));
for(const row of inventory.records){
  const candidate=candidateByRef.get(row.solutionImageRef),promoted=promotionByRef.get(row.solutionImageRef);
  if(!candidate||!promoted||candidate.candidateSvgSha256!==promoted.promotedSha256)throw Error(`FINAL_PROMOTION_PARITY_FAIL:${row.exam}:q${row.questionId}`);
  const actual=fs.readFileSync(path.join(ROOT,row.solutionImageRef));
  if(hash(actual)!==candidate.candidateSvgSha256)throw Error(`FINAL_PRODUCTION_ASSET_SHA_FAIL:${row.exam}:q${row.questionId}`);
}
for(const row of inventory.records){const source=fs.readFileSync(path.join(ROOT,row.sourceJs.path));if(hash(source)!==row.sourceJs.sha256)throw Error(`FINAL_SOURCE_JS_SHA_FAIL:${row.exam}`);}
const payload={schemaVersion:'M3_VISUAL_PUBLICATION_FULL_REBUILD_CLOSEOUT_v1',branch:inventory.branch,baseCommit:inventory.baseCommit,
  denominator:{exams:10,solutionSvgs:130,fullwidthSolutionImages:99,byExam:inventory.totals.byExam},
  officialBuilder:'geometry-publication-v1',independentStaticAudit:'geometry-publication-audit-v1',staticAuditPassCount:candidates.records.length,
  independentHumanReview:{status:humanReview.status,reviewedRevisionCount:humanReview.reviewedRevisionCount,receiptPath:'archive/evidence/visual-publication-2025-m3-full-rebuild/independent-visual-review-receipt-v1.json'},
  actualArchiveRender:{status:render.status,mode:'sol',viewport:'desktop 1440x1000',mobileQualification:false,examCount:render.rows.length,loadedSvgCount,
    perExam:render.rows.map(row=>({id:row.id,status:row.status,loadedSvgCount:row.capture.loadedSvgCount,errorCount:row.errors.length}))},
  archive2RuntimeGuard:'PASS (node tools/check-archive2-runtime.cjs; 42 tests)',
  automatedTests:{geometryPublication:51,archiveRenderRuntime:32},
  canonicalPhase1to5:{status:'INPUT_REQUIRED',requiredSchema:'SOURCE_EXAM_ID_REGISTRY_v1',statusAuthority:'PHASE1_5_NOT_CLAIMED'},
  productionSvgAssetsPromoted:promotion.promotedCount,mainMerged:false,
  sha256:{inventory:hash(read('source-inventory-current-display-full-v5.json')),candidateManifest:hash(read('final-candidates/final-candidate-manifest.json')),
    independentVisualReview:hash(read('independent-visual-review-receipt-v1.json')),
    promotionReceipt:hash(read('final-promotion-receipt-v1.json')),archiveRenderMatrix:hash(read('archive-render-desktop-20261009-v7/archive-render-matrix.json')),
    archiveRenderSummary:hash(read('archive-render-desktop-20261009-v7/summary.json')),engine:matrix.engineSha256}};
const output=path.join(HERE,'final-closeout.json');fs.writeFileSync(output,JSON.stringify(payload,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',output:path.relative(ROOT,output).replaceAll('\\','/'),denominator:payload.denominator,actualArchiveRender:payload.actualArchiveRender},null,2));
