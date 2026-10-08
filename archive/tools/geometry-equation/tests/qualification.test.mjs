import test from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
import {fileRef,objectSha} from '../../pipeline-core/canonical.mjs';
import {registerSourceAuthority} from '../production/register-source-authority.mjs';
import {qualifyVisualEngine,sealQualifiedVisualEngine,isExactQ10NativeSolutionLineBreakFailure,validateNativeSolutionMobileR3Review,currentPlanSolutionBindingClosed,validateQ10HistoricalBaseActualReplacement,validateQ10HistoricalBaseSourceReviewReplacement,archiveTargetMatchesAssetPath,archiveAssetTargetMatches,baseProtectedArchiveCaptureRowPasses} from '../production/qualification.mjs';
import {loadBank} from '../build-visual-render-matrix.mjs';

test('q10 native presentation correction accepts only the exact one-line distance calculation failure',()=>{
 const identity={questionUid:'24_제일고_1학기_중간_고1_기출|10'};
 const error='INDEPENDENT_VISUAL_REVIEW_FAIL:'+JSON.stringify({errors:['native 해설에서 √(4²+(-6)²)=√(16+36)=√52의 여러 계산 단계를 한 줄에 압축했다. 별도 줄이 필요하다.']});
 assert.equal(isExactQ10NativeSolutionLineBreakFailure({status:'UNRESOLVED',identity,error}),true);
 assert.equal(isExactQ10NativeSolutionLineBreakFailure({status:'UNRESOLVED',identity,error:error.replace('√(16+36)=√52','√(25+36)=√61')}),false);
 assert.equal(isExactQ10NativeSolutionLineBreakFailure({status:'UNRESOLVED',identity,error:'INDEPENDENT_VISUAL_REVIEW_FAIL:'+JSON.stringify({errors:[JSON.parse(error.split(':').slice(1).join(':')).errors[0],'second failure']})}),false);
 assert.equal(isExactQ10NativeSolutionLineBreakFailure({status:'PHASE2_SLICE_COMPLETE',identity,error}),false);
});

test('Archive target asset comparison decodes Korean URL paths and requires exact path equality',()=>{
 const asset='assets/images/24_제일고_1학기_중간_고1_기출/q10-solution.svg',urlPath='/archive/'+asset.split('/').map(encodeURIComponent).join('/');
 assert.equal(archiveTargetMatchesAssetPath('https://archive.invalid'+urlPath+'?mode=sol',asset),true);
 assert.equal(archiveTargetMatchesAssetPath('https://archive.invalid'+urlPath+'/extra',asset),false);
 assert.equal(archiveTargetMatchesAssetPath('https://archive.invalid'+urlPath.replace('q10-solution.svg','q10-solution.svgx'),asset),false);
 assert.equal(archiveTargetMatchesAssetPath('https://archive.invalid/archive/assets/images/%ZZ/q10-solution.svg',asset),false);
 const target={id:'q10-asset',loaded:true,src:'https://archive.invalid'+urlPath};
 assert.equal(archiveAssetTargetMatches(target,'q10-asset',asset),true);
 assert.equal(archiveAssetTargetMatches(target,'different-target',asset),false);
 assert.equal(archiveAssetTargetMatches({...target,src:target.src+'/extra'},'q10-asset',asset),false);
});

test('q10 preserved base capture uses measured top-level actual metadata and rejects synthetic rows',()=>{
 const root=process.cwd(),run='.tmp/archive/phase5-qualified-2-20261008',exam=fs.readdirSync(path.resolve(root,run)).find(name=>name.includes('제일고'));
 const stageRoot=path.posix.join(run,exam,'visual-engine/production/stages'),resultPath=path.posix.join(stageRoot,'RESULT/9da4fb0c145adac460d96284b2f1cee9c7576a57c9dc96bed5dff63759fcd09c/result.json');
 const read=ref=>JSON.parse(fs.readFileSync(path.resolve(root,ref),'utf8')),result=read(resultPath),stages=result.stages.map(ref=>read(ref.path));
 const bankStage=stages.findLast(stage=>stage.stage==='ARCHIVE_BANK'),candidateRef=bankStage.outputs.find(ref=>ref.path.endsWith('.js'));
 const actualStage=stages.findLast(stage=>stage.stage==='DISPLAY_ENVELOPE_ACTUAL'),actualRef=actualStage.outputs.find(ref=>ref.path.endsWith('/actual-archive.json')),actual=read(actualRef.path);
 const captureStage=stages.findLast(stage=>stage.stage==='CAPTURE'),rowRef=captureStage.outputs.find(ref=>ref.path.endsWith('/'+result.identity.assetId+'-sol-desktop.json')),row=read(rowRef.path),engineRef=fileRef(root,'archive/engine.html');
 const expected={targetId:result.identity.assetId,sourceSha256:result.sourceRef.sha256.slice(7),candidateSha256:candidateRef.sha256.slice(7),engineSha256:engineRef.sha256.slice(7),archiveAssetPath:actual.archiveAssetPath};
 assert.equal(Object.hasOwn(row.capture,'synthetic'),false);
 assert.equal(baseProtectedArchiveCaptureRowPasses(row,expected),true);
 assert.equal(baseProtectedArchiveCaptureRowPasses({...row,synthetic:true},expected),false);
 assert.equal(baseProtectedArchiveCaptureRowPasses({...row,capture:{...row.capture,overflowCount:1}},expected),false);
});

test('q10 current plan permits only verificationInputSha256 metadata tied to the current verified solution',()=>{
 const semantic={questionUid:'24_제일고_1학기_중간_고1_기출|10',capability:'construction-spike-v1',mathPlan:{nodes:[{id:'A',type:'SOURCE_POINT'}]}};
 const binding='sha256:'+'a'.repeat(64),verified={inputBindingSha256:binding};
 assert.equal(currentPlanSolutionBindingClosed({...semantic,verificationInputSha256:binding},semantic,verified,binding),true);
 assert.equal(currentPlanSolutionBindingClosed({...semantic,verificationInputSha256:'sha256:'+'b'.repeat(64)},semantic,verified,binding),false);
 assert.equal(currentPlanSolutionBindingClosed({...semantic,verificationInputSha256:binding,unapprovedExtraField:true},semantic,verified,binding),false);
 assert.equal(currentPlanSolutionBindingClosed({...semantic,verificationInputSha256:binding},semantic,{inputBindingSha256:'sha256:'+'c'.repeat(64)},binding),false);
});

function makeHistoricalQ10ActualFixture(){
 const root=process.cwd(),scratchPath='.tmp/archive/phase5-q10-historical-actual-test-'+crypto.randomUUID()+'/24_제일고_1학기_중간_고1_기출/fixtures';
 const write=(name,value)=>{const relative=path.posix.join(scratchPath,name),target=path.join(root,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,Buffer.isBuffer(value)?value:typeof value==='string'?value:JSON.stringify(value));return fileRef(root,relative);};
 const sourcePath='archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js',sourceRef=fileRef(root,sourcePath);
 const solutionText='기본 풀이';const solutionRef=write('solution.txt',solutionText);
 const svgRef=fileRef(root,'.tmp/archive/phase5-qualified-2-20261008/24_제일고_1학기_중간_고1_기출/visual-engine/production/stages/BUILD/c4b1780cb2cc7a2d5307ac30f46a3c70b6d648e90000c8059865b06fe4ed405b/q10-solution.svg');
 const engineRef=fileRef(root,'archive/engine.html');
 const currentPolicy=(name,policyPath)=>({name,ref:fileRef(root,policyPath)});
 const policyRefs=[
  {name:'archive-capture',ref:{path:'archive/tools/geometry-equation/record-visual-browser-evidence.mjs',bytes:26499,sha256:'sha256:2fd96fb6c9324f47e47105b79751d73c9513e4d09676366632859b467f973715'}},
  currentPolicy('archive-engine','archive/engine.html'),
  currentPolicy('display-envelope-contract','archive/tools/geometry-equation/production/display-envelope.mjs'),
  currentPolicy('display-typography','archive/tools/geometry-equation/production/typography.mjs'),
  {name:'rendered-layout-observer',ref:{path:'archive/tools/geometry-equation/verify-rendered-layout.mjs',bytes:33383,sha256:'sha256:889d638e33f90975a989ba14576d0f860268007131b2b1433e28a803f6190e0a'}},
  currentPolicy('source-review-policy','archive/tools/geometry-equation/production/source-policy.mjs'),
  currentPolicy('verified-solution-policy','archive/tools/geometry-equation/production/blinded-review.mjs')
 ];
 const questionUid='24_제일고_1학기_중간_고1_기출|10',inputIdentity={questionUid,sourceRef,solutionRef,policyRefs};
 const candidateSvgRef=svgRef,sourceReviewIdentitySha=objectSha(inputIdentity),imageRect={x:400,y:2829,width:298.14,height:248.45},qBoxRect={x:391,y:2729,width:316.15,height:493.4},solutionMetaRect={x:391,y:2795,width:316.15,height:398.7},solutionMetaContentWidth=298.15;
 const screenshotRef=write('capture/base.png',Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.from('png bytes')]));
 const assetId='asset-q10',archiveAssetPath='assets/images/24_제일고_1학기_중간_고1_기출/q10-solution.svg',assetUrl='http://127.0.0.1:50777/archive/'+encodeURI(archiveAssetPath);
 const row={status:'PASS',synthetic:false,runtime:'playwright-chromium',browserVersion:'154.0.8037.98',mode:'sol',viewport:'desktop',sourceSha256:sourceRef.sha256.slice(7),engineSha256:engineRef.sha256.slice(7),responses:[{url:assetUrl,status:200,sha256:svgRef.sha256.slice(7)}],state:{targets:[{id:assetId,loaded:true,sizeClass:'full',naturalWidth:384,naturalHeight:320,src:assetUrl,rect:imageRect,qBoxRect,solutionMetaRect,solutionMetaContentWidth}]}};
 const archiveRowRef=write('capture/base-row.json',row);
 const actualArchive={schemaVersion:'DISPLAY_ARCHIVE_ACTUAL_v1',status:'PASS',synthetic:false,runtime:'playwright-chromium',questionUid,inputIdentitySha256:sourceReviewIdentitySha,sourceRef,solutionRef,candidateSvgRef,candidateSvgSha256:svgRef.sha256,policyRefs,browserVersion:'154.0.8037.98',sizeClass:'full',archiveAssetPath,targetId:assetId,archiveRowRef,screenshotRef,screenshotViewport:{width:299,height:249},imageRect,qBoxRect,solutionMetaRect,solutionMetaContentWidth,naturalWidth:384,naturalHeight:320};
 const baseActualRef=write('actual-archive.json',actualArchive);
 const displayPlan={schemaVersion:'DISPLAY_ENVELOPE_v1',status:'PLANNED',questionUid,inputIdentity,inputIdentitySha256:sourceReviewIdentitySha,sourceRef,solutionRef,policyRefs,archiveEngineSha256:engineRef.sha256,profiles:[]};
 const result={status:'UNRESOLVED',identity:{questionUid,assetId},sourceRef,error:'INDEPENDENT_VISUAL_REVIEW_FAIL:'+JSON.stringify({errors:['native 해설에서 √(4²+(-6)²)=√(16+36)=√52의 여러 계산 단계를 한 줄에 압축했다. 필수 기준에 따라 별도 줄이 필요하다.']})};
 const identity={questionUid,sourceRef};const overlay={questionUid,finalSvgRef:svgRef,finalSvgUnchanged:true,archiveAssetPath,archive:{target:{id:assetId}}};
 return{root,scratchPath,sourceRef,solution:{solution:solutionText},svgRef,baseActualRef,displayPlan,actualArchive,result,identity,overlay,policyRefs,engineRef,solutionRef};
}

test('only q10 exact base actual refs with the two known stale capture policies can use the current-overlay replacement path',()=>{
 const f=makeHistoricalQ10ActualFixture();
 const replacement=validateQ10HistoricalBaseActualReplacement(f.root,{result:f.result,identity:f.identity,solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:f.displayPlan,actualArchive:f.actualArchive,overlay:f.overlay});
 assert.equal(replacement.status,'CURRENT_OVERLAY_CAPTURE_REPLACEMENT');assert.equal(replacement.historicalBaseActualRefReplacedByCurrentOverlayCapture,true);assert.deepEqual(replacement.stalePolicyRefs.map(value=>value.path).sort(),['archive/tools/geometry-equation/record-visual-browser-evidence.mjs','archive/tools/geometry-equation/verify-rendered-layout.mjs'].sort());
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:{...f.result,identity:{...f.result.identity,questionUid:'24_제일고_1학기_중간_고1_기출|9'}},identity:f.identity,solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:f.displayPlan,actualArchive:f.actualArchive,overlay:f.overlay}),null);
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:f.result,identity:{...f.identity,sourceRef:{...f.sourceRef,path:'archive/exams/original/high/h1/1mid/other.js'}},solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:f.displayPlan,actualArchive:f.actualArchive,overlay:f.overlay}),null);
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:{...f.result,error:f.result.error+JSON.stringify({errors:['another failure']})},identity:f.identity,solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:f.displayPlan,actualArchive:f.actualArchive,overlay:f.overlay}),null);
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:f.result,identity:f.identity,solution:f.solution,svgRef:{...f.svgRef,sha256:'sha256:'+'0'.repeat(64)},baseActualRef:f.baseActualRef,displayPlan:f.displayPlan,actualArchive:f.actualArchive,overlay:f.overlay}),null);
 const changedHelper=structuredClone(f.displayPlan),changedPolicy=changedHelper.inputIdentity.policyRefs.find(value=>value.name==='archive-capture');changedPolicy.ref.sha256='sha256:'+'0'.repeat(64);changedHelper.policyRefs=changedHelper.inputIdentity.policyRefs;changedHelper.inputIdentitySha256=objectSha(changedHelper.inputIdentity);
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:f.result,identity:f.identity,solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:changedHelper,actualArchive:{...f.actualArchive,policyRefs:changedHelper.inputIdentity.policyRefs,inputIdentitySha256:changedHelper.inputIdentitySha256},overlay:f.overlay}),null);
 const thirdPath=path.posix.join(f.scratchPath,'capture-policies/third-policy.mjs');fs.mkdirSync(path.dirname(path.join(f.root,thirdPath)),{recursive:true});fs.writeFileSync(path.join(f.root,thirdPath),'third current policy');const thirdRef=fileRef(f.root,thirdPath);thirdRef.sha256='sha256:'+'0'.repeat(64);
 const thirdPlan=structuredClone(f.displayPlan);thirdPlan.inputIdentity.policyRefs.push({name:'unexpected-third-policy',ref:thirdRef});thirdPlan.policyRefs=thirdPlan.inputIdentity.policyRefs;thirdPlan.inputIdentitySha256=objectSha(thirdPlan.inputIdentity);
 const thirdActual={...f.actualArchive,policyRefs:thirdPlan.inputIdentity.policyRefs,inputIdentitySha256:thirdPlan.inputIdentitySha256};
 assert.equal(validateQ10HistoricalBaseActualReplacement(f.root,{result:f.result,identity:f.identity,solution:f.solution,svgRef:f.svgRef,baseActualRef:f.baseActualRef,displayPlan:thirdPlan,actualArchive:thirdActual,overlay:f.overlay}),null);
});

test('q10 preserved real base plan without a candidate SVG field uses the actual-archive SVG binding',()=>{
 const root=process.cwd(),stage='.tmp/archive/phase5-qualified-2-20261008/24_제일고_1학기_중간_고1_기출/visual-engine/production/stages';
 const read=ref=>JSON.parse(fs.readFileSync(path.resolve(root,ref),'utf8'));
 const resultPath=stage+'/RESULT/9da4fb0c145adac460d96284b2f1cee9c7576a57c9dc96bed5dff63759fcd09c/result.json';
 const displayPlanPath=stage+'/DISPLAY_ENVELOPE/90bf899e3146bb52973a1abf42d2ff7879dbd815f9df8a497ee5c5caf1a456ef/display_envelope.json';
 const actualPath=stage+'/DISPLAY_ENVELOPE_ACTUAL/b08d674d4c9dc1d8a6d4da3153e18d898b8e27f5d0d92aa963f99e6cb4ea48ca/actual-archive.json';
 const overlayPath='.tmp/archive/phase5-luna-20261008-luna-max-q10r7/24_제일고_1학기_중간_고1_기출/visual-engine/production/native-solution-overlay/overlay.json';
 const result=read(resultPath),displayPlan=read(displayPlanPath),actualArchive=read(actualPath),overlay=read(overlayPath);
 assert.equal(Object.hasOwn(displayPlan,'candidateSvgRef'),false);
 const svgRef=actualArchive.candidateSvgRef,baseActualRef=fileRef(root,actualPath),solution={solution:fs.readFileSync(path.resolve(root,displayPlan.solutionRef.path),'utf8')};
 const replacement=validateQ10HistoricalBaseActualReplacement(root,{result,identity:{questionUid:result.identity.questionUid,sourceRef:result.sourceRef},solution,svgRef,baseActualRef,displayPlan,actualArchive,overlay});
 assert.equal(replacement?.status,'CURRENT_OVERLAY_CAPTURE_REPLACEMENT');
 assert.equal(replacement?.historicalBaseActualRefReplacedByCurrentOverlayCapture,true);
 assert.deepEqual(replacement?.stalePolicyRefs.map(value=>({path:value.path,historicalSha256:value.historicalSha256,currentSha256:value.currentSha256})),[
  {path:'archive/tools/geometry-equation/record-visual-browser-evidence.mjs',historicalSha256:'sha256:2fd96fb6c9324f47e47105b79751d73c9513e4d09676366632859b467f973715',currentSha256:'sha256:7115128b95b1ae3b569cb96570acdde10ec5a7c768c31f4e0a8c3041e29bab69'},
  {path:'archive/tools/geometry-equation/verify-rendered-layout.mjs',historicalSha256:'sha256:889d638e33f90975a989ba14576d0f860268007131b2b1433e28a803f6190e0a',currentSha256:'sha256:06cc0af7d3c7c5e4be79ea79bccfd42f26c7e43ccfdba25fdcb07833c1b77f86'}
 ]);
});

test('q10 frozen source review is replaced only by a current-policy review with valid lineage',()=>{
 const root=process.cwd(),read=ref=>JSON.parse(fs.readFileSync(path.resolve(root,ref),'utf8'));
 const baseRun='.tmp/archive/phase5-qualified-2-20261008',baseExam=fs.readdirSync(path.resolve(root,baseRun)).find(name=>name.includes('제일고'));
 const baseStages=path.posix.join(baseRun,baseExam,'visual-engine/production/stages');
 const resultRef=fileRef(root,path.posix.join(baseStages,'RESULT/9da4fb0c145adac460d96284b2f1cee9c7576a57c9dc96bed5dff63759fcd09c/result.json'));
 const sourceDir='archive/exams/original/high/h1/1mid',sourceName=fs.readdirSync(path.resolve(root,sourceDir)).find(name=>name.includes('제일고'));
 const sourceRef=fileRef(root,path.posix.join(sourceDir,sourceName)),result=read(resultRef.path),sourceBank=loadBank(fs.readFileSync(path.resolve(root,sourceRef.path),'utf8'));
 const question=sourceBank.find(value=>value.id===10),identity={questionUid:result.identity.questionUid,sourceRef,question};
 const q10r7Run='.tmp/archive/phase5-luna-20261008-luna-max-q10r7',q10r7Exam=fs.readdirSync(path.resolve(root,q10r7Run)).find(name=>name.includes('제일고'));
 const overlayPath=path.posix.join(q10r7Run,q10r7Exam,'visual-engine/production/native-solution-overlay/overlay.json'),overlay=read(overlayPath);
 const basePlanRef=overlay.basePlanRef,frozenPlan=read(basePlanRef.path),baseSourceReviewRef=fileRef(root,path.posix.join(baseStages,'SOURCE_REVIEW/b5634ae96f19ba5b4b108bfbc57319dccfc946f2233b3d630b3ef9b1f2deabf8/source_review.json'));
 const{schemaVersion,questionUid,visualAssetKey,sourceRef:planSourceRef,solutionRef:planSolutionRef,verifiedSolutionRef,verifiedSolutionPolicySha256,verificationInputSha256,sourceReviewInputSha256,sourceReviewPolicySha256,sourceRegistryRef:priorRegistryRef,planSha256,...semanticPlan}=frozenPlan;
 const currentPlan=read(overlay.currentPlanRef.path),sourceOnly={content:question.content,choices:question.choices??null,sourceImageRequired:!!question.image},images=[];
 for(const imagePath of [question.image].filter(Boolean)){const bytes=fs.readFileSync(path.resolve(root,'archive',imagePath));images.push('data:image/'+(imagePath.endsWith('.svg')?'svg+xml':imagePath.endsWith('.jpg')?'jpeg':'png')+';base64,'+bytes.toString('base64'));}
 const args={result,identity,basePlanRef,frozenPlan,semanticPlan,baseSourceReviewRef,currentPlanRef:overlay.currentPlanRef,currentPlan,currentSourceReviewRef:overlay.currentSourceReviewRef,source:sourceOnly,images,overlay};
 const replacement=validateQ10HistoricalBaseSourceReviewReplacement(root,args);
 assert.equal(replacement?.status,'CURRENT_OVERLAY_SOURCE_REVIEW_REPLACEMENT');
 assert.equal(replacement?.historicalSourcePolicySha256,'sha256:2bfde681eea96b14fcf56cfb28c2d01c9bd29e4e0d46359130d015322193c3dd');
 assert.equal(replacement?.currentSourcePolicySha256,'sha256:ddb9cef7d9c345db0266576c7e71fb4bf643a5135495065a7ae5b21b21958203');
 assert.deepEqual(replacement?.historicalBaseSourceReviewRef,baseSourceReviewRef);
 assert.deepEqual(replacement?.currentSourceReviewRef,overlay.currentSourceReviewRef);
 assert.equal(replacement?.historicalInputSha256,frozenPlan.sourceReviewInputSha256);
 const forgedPath=path.posix.join('.tmp/archive/phase5-q10-source-review-forgery-test-'+crypto.randomUUID(),'24_제일고_1학기_중간_고1_기출/forged-current-review.json'),forgedReview=read(overlay.currentSourceReviewRef.path);
 forgedReview.policySha256='sha256:'+'f'.repeat(64);
 fs.mkdirSync(path.dirname(path.resolve(root,forgedPath)),{recursive:true});fs.writeFileSync(path.resolve(root,forgedPath),JSON.stringify(forgedReview));
 const forgedCurrentRef=fileRef(root,forgedPath),forgedArgs={...args,currentSourceReviewRef:forgedCurrentRef,overlay:{...overlay,currentSourceReviewRef:forgedCurrentRef}};
 assert.equal(validateQ10HistoricalBaseSourceReviewReplacement(root,forgedArgs),null);
});

function makeQ10MobileReviewFixture(){
 const root=path.resolve('.tmp/archive/phase5-q10-mobile-review-test-'+crypto.randomUUID()+'/24_제일고_1학기_중간_고1_기출/fixtures');
 const write=(name,value)=>{const target=path.join(root,name);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,typeof value==='string'?value:JSON.stringify(value));return fileRef(root,name);};
 const sourceRef=write('archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js','source');
 const candidateRef=write('.tmp/archive/mobile/exam/visual-engine/production/native-solution-overlay/24_제일고_1학기_중간_고1_기출.js','candidate');
 const finalSvgRef=write('archive/assets/images/exam/q10-solution.svg','<svg/>');
 const cssRef=write('archive/archive2-preview-mobile.css','@media screen and (max-width:640px){html:is(:not([data-archive2-context]), [data-archive2-context="archive2"]) .grid-container{grid-template-columns:minmax(0,1fr)!important}}');
 const engineRef=write('archive/engine.html','engine');
 const screenshotRef=write('captures/mobile.png','mobile screenshot'),nativeContextScreenshotRef=write('captures/q10-context.png','q10 context');
 const desktopScreenshotRef=write('captures/desktop.png','desktop screenshot'),desktopContextScreenshotRef=write('captures/desktop-context.png','desktop q10 context');
 const assetId='asset-q10',archiveAssetPath='assets/images/exam/q10-solution.svg',assetUrl='http://127.0.0.1:55000/archive/'+archiveAssetPath;
 const url='http://127.0.0.1:55000/archive/engine.html?mode=sol&qpp=4&data=exams%2Foriginal%2Fhigh%2Fh1%2F1mid%2F24.js';
 const matrix={schemaVersion:'GEOMETRY_ARCHIVE_RENDER_MATRIX_v1',runtime:'actual archive/engine.html',synthetic:false,engineSha256:engineRef.sha256.slice(7),sources:[{id:assetId,sourcePath:sourceRef.path,sourceSha256:sourceRef.sha256.slice(7),candidatePath:candidateRef.path,candidateSha256:candidateRef.sha256.slice(7),questionCount:1,protectedFieldParity:'PASS',assets:[{id:assetId,path:finalSvgRef.path,archivePath:archiveAssetPath,sha256:finalSvgRef.sha256.slice(7),questionId:10,sizeClass:'full'}]}],rows:[{id:assetId,sourcePath:sourceRef.path,sourceSha256:sourceRef.sha256.slice(7),candidatePath:candidateRef.path,candidateSha256:candidateRef.sha256.slice(7),questionCount:1,assets:[{id:assetId,path:finalSvgRef.path,archivePath:archiveAssetPath,sha256:finalSvgRef.sha256.slice(7),questionId:10,sizeClass:'full'}],mode:'sol',viewport:'mobile',width:390,height:844,urlPath:'/archive/engine.html?mode=sol&qpp=4&data=exams%2Foriginal%2Fhigh%2Fh1%2F1mid%2F24.js'}]};
 const mobileMatrixRef=write('capture/archive-render-matrix.json',matrix);
 const qBoxRect={x:20,y:300,width:350,height:543},imageRect={x:29,y:400,width:332,height:277},solutionMetaContentWidth=332;
 const mobileRow={id:assetId+'-sol-mobile',status:'PASS',mode:'sol',viewport:'mobile',runtime:'playwright-chromium',synthetic:false,url,sourceSha256:sourceRef.sha256.slice(7),candidateSha256:candidateRef.sha256.slice(7),engineSha256:engineRef.sha256.slice(7),errors:[],capture:{status:'MEASURED',missingGlyphCount:0,labelCollisionCount:0,criticalCollisionCount:0,observedLabelCollisionCount:1,observedCriticalCollisionCount:1,clippedTextCount:0,overflowCount:0,loadedSvgCount:1,failedSvgCount:0},responses:[{url:'http://127.0.0.1:55000/archive/archive2-preview-mobile.css?v=mobile',status:200,sha256:cssRef.sha256.slice(7)}],state:{targets:[{id:assetId,src:assetUrl,loaded:true,rect:imageRect,qBoxRect,solutionMetaContentWidth}]},layouts:[{id:assetId,status:'PASS',svgSha256:finalSvgRef.sha256.slice(7),errors:[],tickKnockoutEvidence:[{id:'tick-x--1-label-knockout-background',status:'PASS',svgSha256:finalSvgRef.sha256.slice(7)}]}]};
 const mobileRowRef=write('capture/mobile-row.json',mobileRow);
 const desktopRowRef=write('capture/desktop-row.json',{id:assetId+'-sol-desktop',status:'PASS'});
 const overlay={schemaVersion:'PHASE5_NATIVE_SOLUTION_PRESENTATION_OVERLAY_v1',status:'READY_FOR_R3_REVIEW',questionUid:'24_제일고_1학기_중간_고1_기출|10',sourceRef,candidateRef,finalSvgRef,archiveAssetPath,archive:{status:'PASS',runtime:'playwright-chromium',synthetic:false,engineRef,target:{id:assetId,src:assetUrl},rowRef:desktopRowRef,screenshotRef:desktopScreenshotRef,nativeContextScreenshotRef:desktopContextScreenshotRef}};
 const overlayRef=write('overlay.json',overlay);
 const refOnly=ref=>({path:ref.path,sha256:ref.sha256});
 const desktopReview={schemaVersion:'PHASE5_NATIVE_SOLUTION_OVERLAY_R3_REVIEW_v1',status:'PASS',reviewerRole:'archive_r3',reviewerIdentity:'agent:q10-desktop-test',reviewType:'INDEPENDENT_VISUAL_RECHECK',questionUid:overlay.questionUid,sourceSha256:sourceRef.sha256,sourceRef:refOnly(sourceRef),candidateRef:refOnly(candidateRef),finalSvgRef:refOnly(finalSvgRef),archiveRowRef:refOnly(desktopRowRef),screenshotRef:refOnly(desktopScreenshotRef),nativeContextScreenshotRef:refOnly(desktopContextScreenshotRef),errors:[],observations:['Desktop q10 line-break review passed.']};
 const desktopReviewRef=write('desktop-review.json',desktopReview);
 const captureRecord={schemaVersion:'PHASE5_Q10_LEGACY_MOBILE_CAPTURE_v1',status:'READY_FOR_R3_REVIEW',mobileContext:'LEGACY_ENGINE_QPP4',mobileViewport:{width:390,height:844},url,matrixRef:mobileMatrixRef,mobileRowRef,screenshotRef,nativeContextScreenshotRef,candidateRef,sourceRef,finalSvgRef,cssRef,cssResponseSha256:cssRef.sha256.slice(7),qBoxRect,solutionMetaContentWidth,imageRect};
 const captureRecordRef=write('capture/mobile-capture.json',captureRecord);
 const review={schemaVersion:'PHASE5_NATIVE_SOLUTION_OVERLAY_R3_MOBILE_REVIEW_v1',reviewerIdentity:'/root/phase5_q10_r3',reviewerRole:'archive_r3',reviewType:'INDEPENDENT_VISUAL_RECHECK',status:'PASS',questionUid:overlay.questionUid,mobileContext:'LEGACY_ENGINE_QPP4',mobileViewport:{width:390,height:844},captureRecordRef:refOnly(captureRecordRef),desktopOverlayRef:refOnly(overlayRef),desktopCandidateRef:refOnly(candidateRef),desktopReviewRef:refOnly(desktopReviewRef),desktopArchiveRowRef:refOnly(desktopRowRef),sourceRef:refOnly(sourceRef),candidateRef:refOnly(candidateRef),finalSvgRef:refOnly(finalSvgRef),mobileMatrixRef:refOnly(mobileMatrixRef),mobileRowRef:refOnly(mobileRowRef),mobileScreenshotRef:refOnly(screenshotRef),nativeContextScreenshotRef:refOnly(nativeContextScreenshotRef),cssRef:refOnly(cssRef),cssResponseSha256:cssRef.sha256.slice(7),measurements:{qBoxRect,solutionMetaContentWidth,imageRect,cssNetworkStatus:200,gridColumns:'minmax(0, 1fr) under the 640px responsive rule'},checks:{sourceParity:'PASS',answerParity:'PASS',mathTokenParity:'PASS',unchangedSvg:'PASS',actualLegacyMobileSol:'PASS',singleColumnFullWidth:'PASS',cssBound:'PASS',mobileSolutionLineBreaks:'PASS'},observations:['Legacy qpp4 mobile row and q10 context are readable at full question width.'],errors:[]};
 const mobileReviewRef=write('mobile-review.json',review);
 return{root,overlay,overlayRef,desktopReviewRef,identity:{sourceRef},finalSvgRef,mobileReviewRef,review,mobileRow,captureRecord};
}

test('q10 presentation closure requires a direct, hash-bound legacy qpp4 mobile R3 receipt',()=>{
 const fixture=makeQ10MobileReviewFixture();
 const good=validateNativeSolutionMobileR3Review(fixture.root,{reviewRef:fixture.mobileReviewRef,overlayRef:fixture.overlayRef,desktopReviewRef:fixture.desktopReviewRef,overlay:fixture.overlay,identity:fixture.identity,finalSvgRef:fixture.finalSvgRef});
 assert.equal(good.status,'PASS');assert.equal(good.qBoxWidthCssPx,350);assert.equal(good.solutionMetaContentWidthCssPx,332);
 const css=fs.readFileSync(path.resolve('archive/archive2-preview-mobile.css'),'utf8');
 assert.match(css,/@media screen and \(max-width: 640px\)/);assert.match(css,/html:is\(:not\(\[data-archive2-context\]\), \[data-archive2-context="archive2"\]\)/);assert.match(css,/grid-template-columns:\s*minmax\(0, 1fr\)\s*!important/);
 const badCss={...fixture.review,cssRef:{...fixture.review.cssRef,sha256:'sha256:'+'0'.repeat(64)}};
 const badCssPath=path.join(fixture.root,'mobile-review-bad-css.json');fs.writeFileSync(badCssPath,JSON.stringify(badCss));
 assert.throws(()=>validateNativeSolutionMobileR3Review(fixture.root,{reviewRef:fileRef(fixture.root,'mobile-review-bad-css.json'),overlayRef:fixture.overlayRef,desktopReviewRef:fixture.desktopReviewRef,overlay:fixture.overlay,identity:fixture.identity,finalSvgRef:fixture.finalSvgRef}),/PRESENTATION_MOBILE_R3_REVIEW_NOT_CLOSED/);
 const badRow={...fixture.mobileRow,state:{targets:[{...fixture.mobileRow.state.targets[0],qBoxRect:{...fixture.mobileRow.state.targets[0].qBoxRect,width:149},solutionMetaContentWidth:131}]}};
 fs.writeFileSync(path.join(fixture.root,'capture/mobile-row-bad.json'),JSON.stringify(badRow));
 const badRowRef=fileRef(fixture.root,'capture/mobile-row-bad.json');
 const badCapture={...fixture.captureRecord,mobileRowRef:badRowRef,qBoxRect:{...fixture.captureRecord.qBoxRect,width:149},solutionMetaContentWidth:131};
 fs.writeFileSync(path.join(fixture.root,'capture/mobile-capture-bad.json'),JSON.stringify(badCapture));
 const badReceipt={...fixture.review,mobileRowRef:{path:badRowRef.path,sha256:badRowRef.sha256},captureRecordRef:{path:fileRef(fixture.root,'capture/mobile-capture-bad.json').path,sha256:fileRef(fixture.root,'capture/mobile-capture-bad.json').sha256},measurements:{...fixture.review.measurements,qBoxRect:badCapture.qBoxRect,solutionMetaContentWidth:131}};
 const badReceiptPath=path.join(fixture.root,'mobile-review-bad-row.json');fs.writeFileSync(badReceiptPath,JSON.stringify(badReceipt));
 assert.throws(()=>validateNativeSolutionMobileR3Review(fixture.root,{reviewRef:fileRef(fixture.root,'mobile-review-bad-row.json'),overlayRef:fixture.overlayRef,desktopReviewRef:fixture.desktopReviewRef,overlay:fixture.overlay,identity:fixture.identity,finalSvgRef:fixture.finalSvgRef}),/PRESENTATION_MOBILE_R3_REVIEW_NOT_CLOSED/);
});

test('ten registered identities and forged aggregate PASS cannot replace current source/test evidence or create ACTIVE',()=>{
 const root=path.resolve('.tmp/archive/phase5-qualification-test-'+crypto.randomUUID()+'/24_제일고_1학기_중간_고1_기출/fixtures');
 const sourcePath='archive/exams/original/high/h1/1mid/QualificationFixture.js',archiveFile=sourcePath.slice('archive/exams/'.length);
 fs.mkdirSync(path.join(root,path.dirname(sourcePath)),{recursive:true});fs.mkdirSync(path.join(root,'archive/data'),{recursive:true});
 fs.writeFileSync(path.join(root,sourcePath),'window.questionBank='+JSON.stringify(Array.from({length:10},(_,i)=>({id:i+1,content:'controlled test fixture',answer:'1',solution:'test-only'})))+';');
 const map={schemaVersion:'question-identity-map-v1',identityAlgorithm:{version:'qid_v1'},records:Array.from({length:10},(_,i)=>({sourceArchiveFile:archiveFile,sourceOrdinal:i+1,questionUid:'qid_v1_'+crypto.createHash('sha256').update(archiveFile+'#'+(i+1)).digest('hex')}))};
 const write=(name,value)=>{fs.writeFileSync(path.join(root,name),JSON.stringify(value));return fileRef(root,name);};
 const mapRef=write('archive/data/question_identity_map.json',map);
 const registered=registerSourceAuthority(root,{targets:Array.from({length:10},(_,i)=>({sourcePath,sourceQuestionOrdinal:i+1,group:i<6?'GEOMETRY':'GRAPH'})),identityMapRef:mapRef,decision:{authority:'DIRECT_USER_INSTRUCTION',request:'Controlled fixture: current source identity registration only.',scope:'CURRENT_SOURCE_IDENTITY_REGISTRATION_ONLY'}});
 fs.writeFileSync(path.join(root,'test.log'),'controlled fixture log, not real qualification');
 const input={registryRef:write('registry.json',registered.registry),rosterRef:write('roster.json',registered.roster),migrationsRef:write('migrations.json',registered.migrations),resultRefs:[],testReportRef:write('tests.json',{status:'PASS',codeRefs:[],suites:[{name:'node',exitCode:0,logRef:fileRef(root,'test.log')}]})};
 const report=qualifyVisualEngine(root,input);assert.equal(report.status,'FAIL');assert.equal(report.qualifiedTotal,0);
 assert.ok(report.rows.every(row=>row.errors.includes('QUALIFICATION_RESULT_MISSING')));
 assert.ok(report.errors.includes('QUALIFICATION_CODE_INVENTORY_INCOMPLETE'));
 assert.ok(report.errors.includes('QUALIFICATION_REQUIRED_TEST_SUITES_MISSING'));
 assert.ok(report.errors.includes('QUALIFICATION_PRESENTATION_CORRECTION_COHORT_INVALID'));
 assert.equal(report.generalEngineReadiness,false);
 const forged={...report,status:'PASS',errors:[],qualifiedTotal:10,qualified:{GEOMETRY:6,GRAPH:4}};
 assert.throws(()=>sealQualifiedVisualEngine(root,write('forged.json',forged)),/QUALIFICATION_NOT_CURRENT/);
 const broken=JSON.parse(fs.readFileSync(path.join(root,'registry.json'),'utf8'));broken.entries[0].sourceSha256='sha256:'+'0'.repeat(64);
 assert.ok(qualifyVisualEngine(root,{...input,registryRef:write('broken-registry.json',broken)}).errors.includes('SOURCE_REGISTRATION_REGISTRY_SHA_MISMATCH'));
});
