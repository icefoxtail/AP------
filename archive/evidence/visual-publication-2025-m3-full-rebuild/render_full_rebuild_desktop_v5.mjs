import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {recordArchiveEvidence} from '../../tools/geometry-equation/record-visual-browser-evidence.mjs';
import {sha256} from '../../tools/geometry-equation/verify-visual-engine-static.mjs';
const HERE=path.dirname(fileURLToPath(import.meta.url));
const ROOT=path.resolve(HERE,'../../..');
const INVENTORY=JSON.parse(fs.readFileSync(path.join(HERE,'source-inventory-current-display-full-v5.json'),'utf8'));
const MANIFEST=JSON.parse(fs.readFileSync(path.join(HERE,'final-candidates/final-candidate-manifest.json'),'utf8'));
if(INVENTORY.records.length!==130||INVENTORY.totals.fullwidthSolutionImages!==99||MANIFEST.status!=='PASS'||MANIFEST.records.length!==130)throw Error('FINAL_RENDER_INPUT_GATE_FAIL');
const RUN_SUFFIX=process.argv[2]||'v5';
if(!/^v[0-9]+$/.test(RUN_SUFFIX))throw Error('INVALID_RENDER_RUN_SUFFIX');
const RUN_ID=`m3-visual-publication-full-rebuild-${RUN_SUFFIX}`,EXAM_FOLDER=`full-130-desktop-${RUN_SUFFIX}`;
const RUN_REL=`.tmp/archive/${RUN_ID}/${EXAM_FOLDER}/run`,RUN=path.join(ROOT,RUN_REL);
const ATTEMPT='desktop-1440x1000',OUT=path.join(HERE,`archive-render-desktop-20261009-${RUN_SUFFIX}`);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const safe=value=>String(value).replace(/[\\/:*?"<>|]/g,'_');
function loadBank(bytes,file){const context={window:{}};vm.runInNewContext(bytes.toString('utf8'),context,{filename:file,timeout:5000});if(!Array.isArray(context.window.questionBank))throw Error(`QUESTION_BANK_MISSING:${file}`);return context.window.questionBank;}
const manifestByRef=new Map(MANIFEST.records.map(row=>[row.solutionImageRef,row]));
const recordsByExam=new Map();for(const row of INVENTORY.records){if(!recordsByExam.has(row.exam))recordsByExam.set(row.exam,[]);recordsByExam.get(row.exam).push(row);}
if(recordsByExam.size!==10)throw Error('LOCKED_EXAM_COUNT_MISMATCH');
fs.mkdirSync(path.join(RUN,'archive-candidates'),{recursive:true});
const sources=[],rows=[];let sourceIndex=0;
for(const [exam,items] of recordsByExam){
  const sourcePath=items[0].sourceJs.path,sourceBytes=fs.readFileSync(path.join(ROOT,sourcePath));
  const sourceSha=sha256(sourceBytes);if(sourceSha!==items[0].sourceJs.sha256)throw Error(`CURRENT_SOURCE_JS_CHANGED:${exam}`);
  const bank=loadBank(sourceBytes,sourcePath),candidateRel=`${RUN_REL}/archive-candidates/${path.basename(sourcePath)}`;
  const candidateAbs=path.join(ROOT,candidateRel);fs.writeFileSync(candidateAbs,sourceBytes);
  const candidateBytes=fs.readFileSync(candidateAbs);if(!candidateBytes.equals(sourceBytes))throw Error(`SOURCE_CLONE_PARITY_FAIL:${exam}`);
  const bankById=new Map(bank.map(q=>[String(q.id),q]));const assets=[];
  for(const item of items){
    const question=bankById.get(String(item.questionId));
    if(!question||question.solutionImage!==item.solutionImageRef.replace(/^archive\//,'')||(question.solutionImageLayout??null)!==item.solutionImageLayout)throw Error(`SOURCE_SVG_REFERENCE_MISMATCH:${exam}:q${item.questionId}`);
    const manifest=manifestByRef.get(item.solutionImageRef);if(!manifest||manifest.status!=='PASS'||manifest.currentSourceJsSha256!==sourceSha)throw Error(`FINAL_CANDIDATE_MANIFEST_MISMATCH:${exam}:q${item.questionId}`);
    const candidatePath=path.join(ROOT,manifest.candidateSvgPath),candidateBytesSvg=fs.readFileSync(candidatePath),candidateSha=hash(candidateBytesSvg);
    if(candidateSha!==manifest.candidateSvgSha256)throw Error(`FINAL_CANDIDATE_SVG_SHA_MISMATCH:${exam}:q${item.questionId}`);
    const assetRel=`${RUN_REL}/assets/${safe(exam)}/q${String(item.questionId).padStart(2,'0')}-solution.svg`;
    const assetAbs=path.join(ROOT,assetRel);fs.mkdirSync(path.dirname(assetAbs),{recursive:true});fs.writeFileSync(assetAbs,candidateBytesSvg);
    assets.push({id:`${safe(exam)}-q${String(item.questionId).padStart(2,'0')}`,path:assetRel,
      archivePath:item.solutionImageRef.replace(/^archive\//,''),sha256:candidateSha,questionId:item.questionId,
      displayOrdinal:bank.findIndex(q=>String(q.id)===String(item.questionId))+1,sizeClass:question.solutionImageSize||'full',
      solutionImageLayout:question.solutionImageLayout||null,builderStatus:manifest.builderStatus,staticAuditStatus:manifest.staticAuditStatus});
  }
  const sourceInfo={id:`exam-${sourceIndex}`,sourcePath,sourceSha256:sourceSha,candidatePath:candidateRel,candidateSha256:sha256(candidateBytes),
    questionCount:bank.length,protectedFieldParity:'PASS',assets};
  sources.push(sourceInfo);rows.push({...sourceInfo,mode:'sol',viewport:'desktop',width:1440,height:1000,requireLocalResources:true,requireQrRenderer:false,
    urlPath:'/archive/engine.html?mode=sol&qpp=4&data='+encodeURIComponent(sourcePath.replace(/^archive\//,''))});sourceIndex++;
}
const matrix={schemaVersion:'GEOMETRY_ARCHIVE_RENDER_MATRIX_v1',runtime:'actual archive/engine.html',synthetic:false,visualRebuild:true,
  denominator:{exams:10,solutionSvgs:130,fullwidthSolutionImages:99,inventorySha256:hash(fs.readFileSync(path.join(HERE,'source-inventory-current-display-full-v5.json'))),candidateManifestSha256:hash(fs.readFileSync(path.join(HERE,'final-candidates/final-candidate-manifest.json')))},
  viewport:{width:1440,height:1000,mode:'sol',screenFit:false,pageFit:false,mobileQualification:false},engineSha256:sha256(fs.readFileSync(path.join(ROOT,'archive/engine.html'))),sources,rows};
fs.mkdirSync(RUN,{recursive:true});fs.writeFileSync(path.join(RUN,'archive-render-matrix.json'),JSON.stringify(matrix,null,2)+'\n');
const result=await recordArchiveEvidence({run:RUN,attempt:ATTEMPT,blockExternalRequests:true});
fs.mkdirSync(OUT,{recursive:true});
fs.writeFileSync(path.join(OUT,'summary.json'),JSON.stringify({schemaVersion:'M3_FULL_REBUILD_DESKTOP_ARCHIVE_RENDER_v3',...result,
  denominator:{exams:10,solutionSvgs:130,fullwidthSolutionImages:99,byExam:INVENTORY.totals.byExam},matrixSha256:sha256(fs.readFileSync(path.join(RUN,'archive-render-matrix.json')))},null,2)+'\n');
fs.copyFileSync(path.join(RUN,'archive-render-matrix.json'),path.join(OUT,'archive-render-matrix.json'));
fs.cpSync(path.join(RUN,'archive-render',ATTEMPT),path.join(OUT,'captures'),{recursive:true});
console.log(JSON.stringify({status:result.status,rows:result.rows.map(row=>({id:row.id,status:row.status,assets:row.capture?.loadedSvgCount,errors:row.errors})),evidence:path.relative(ROOT,OUT)},null,2));
if(result.status!=='PASS')process.exitCode=1;
