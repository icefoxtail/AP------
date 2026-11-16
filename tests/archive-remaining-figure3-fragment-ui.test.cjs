"use strict";
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const C=require('../tools/remaining-figure3-solution-fragments.cjs');
const manifest=JSON.parse(fs.readFileSync(__dirname+'/fixtures/archive-remaining-figure3-solution-ui.json'));
// Synthetic geometry/proof fixtures exercise rejection only; they are not an
// actual screenshot, review, issued registrar receipt, or approval artifact.
function policy(){const i=manifest.items[1],commit='a'.repeat(40);return{schemaVersion:C.POLICY_SCHEMA,questionUid:C.UID,sourceOrdinal:19,expectedFragmentCount:2,wholeQuestionSha256:i.questionSha256,sourceRef:{commit,path:i.sourcePath,gitBlobSha1:i.sourceGitBlobSha1,sha256:i.sourceSha256,bytes:43228},assetRef:{commit,...i.assets[0]},manifestRef:{commit,path:'tests/fixtures/archive-remaining-figure3-solution-ui.json',gitBlobSha1:'40f89bb3c8b203ac2f375e5281c7bde05769b578',sha256:'4829f10208b46b255e98dcb2f8a6070e8049d672362f472ecb2fc70ab26d39bf',bytes:3544},helperRef:{commit,path:C.HELPER_PATH,gitBlobSha1:'b'.repeat(40),sha256:'c'.repeat(64),bytes:100}};}
function frame(index){const first=index===1,y=first?100:1600;return{fragmentIndex:index,question:{x:100,y,width:300,height:first?1200:400},children:first?[{x:100,y:y+2,width:300,height:20},{x:100,y:y+25,width:300,height:100},{x:100,y:y+130,width:300,height:1050}]:[{x:100,y:y+2,width:300,height:380}],viewport:{width:1440,height:1000},scroll:{x:0,y:0},obstructions:[],feedbackIdle:true,readiness:'RENDER_READY',mode:'sol',sourceFragments:2,solutionNodes:102,questionNumber:first?'19.':null,roles:Object.fromEntries(Object.entries(first?{number:1,semantic:1,answer:1,explanation:1,caption:1,selectedImage:1}:{number:0,semantic:0,answer:0,explanation:1,caption:0,selectedImage:0}).map(([k,n])=>[k,{count:n,visible:n}])),boxVisible:true,completeChildrenVisible:true,chunksInsideExplanation:true,chunkCount:first?21:12,blockId:'solution:synthetic:'+index,sourceRefSha256:'1'.repeat(64),solutionHtmlSha256:'2'.repeat(64),domSha256:String(index+2).repeat(64)};}
function group(){const fragments=[frame(1),frame(2)];return{sourceMatchesSelected:true,sourceFragmentCount:2,sourceRefSha256:'1'.repeat(64),solutionHtmlSha256:'2'.repeat(64),layoutLedgerSha256:'5'.repeat(64),expectedChunkCount:33,placements:fragments.map((f,i)=>({blockId:f.blockId,questionKeySha256:'1'.repeat(64),continuationOf:i===0?'':fragments[0].blockId,placementOrder:i})),mode:'sol',readiness:'RENDER_READY',fragments};}
function proof(){const g=group(),all=[],fragments=g.fragments.map(f=>{const doc=C.documentFrame(f),tiles=C.planTiles(f).map(t=>{const top=doc.content.y+t.relativeInterval[0],height=t.relativeInterval[1]-t.relativeInterval[0],scroll={x:0,y:top-8};const tile={...t,tileIndex:all.length+1,fragmentIndex:f.fragmentIndex,filename:'M2S1-E035-Q19-desktop-tile-'+String(all.length+1).padStart(2,'0')+'.png',clip:{x:doc.content.x,y:8,width:doc.content.width,height},scroll,scrollOperations:1,feedbackIdle:true,obstructionsIntersectingClip:0,hitTestSamples:20,foreignContentHits:0,domSha256:f.domSha256};all.push(tile);return tile;});return{...doc,boxVisible:true,completeChildrenVisible:true,chunksInsideExplanation:true,visibleChildren:f.children.length,coverage:C.coverage(doc.content.height,tiles),tiles,scrollBefore:{x:0,y:0},scrollAfter:tiles.at(-1).scroll};});return{schemaVersion:C.SCHEMA,method:'UNCHANGED_VIEWPORT_ALL_ORIGINAL_SOLUTION_FRAGMENTS',policy:policy(),sourceRefSha256:g.sourceRefSha256,solutionHtmlSha256:g.solutionHtmlSha256,layoutLedgerSha256:g.layoutLedgerSha256,expectedChunkCount:33,placements:g.placements,fragmentCount:2,fragments,viewport:{width:1440,height:1000},tileLimit:8,overlapCssPixels:32,tileCount:all.length,tiles:all,allOriginalFragmentsCaptured:true,feedbackIdle:true,foreignContentHits:0,cssWrites:0,domWrites:0,viewportChanges:0,compositeImageCreated:false};}
test('exact primary and continuation geometry has complete separate physical coverage',()=>{C.assertGroup(group());const p=proof();assert.equal(p.tileCount,3);assert.equal(C.validateCapture(p,p.viewport),true);});
for(const [name,change]of [
 ['one fragment removed',p=>{p.fragments.pop();p.fragmentCount=1;}],
 ['continuation duplicated',p=>p.fragments[1]=structuredClone(p.fragments[0])],
 ['foreign selected source',p=>p.policy.questionUid='qid_other'],
 ['source bytes drift',p=>p.policy.sourceRef.sha256='9'.repeat(64)],
 ['other checkout asset',p=>p.policy.assetRef.commit='9'.repeat(40)],
 ['missing continuation explanation',p=>p.fragments[1].roles.explanation={count:0,visible:0}],
 ['hidden primary image',p=>p.fragments[0].roles.selectedImage.visible=0],
 ['continuation role contamination',p=>p.fragments[1].roles.answer={count:1,visible:1}],
 ['truncated solution chunks',p=>p.expectedChunkCount++],
 ['different continuation html',p=>p.fragments[1].solutionHtmlSha256='9'.repeat(64)],
 ['wrong continuation parent',p=>p.placements[1].continuationOf='wrong'],
 ['swapped placement order',p=>p.placements[1].placementOrder=-1],
 ['lost bottom tile',p=>p.fragments[0].tiles.pop()],
 ['empty bottom coverage',p=>p.fragments[1].coverage.complete=false],
 ['document geometry mismatch',p=>p.tiles[0].clip.x++],
 ['foreign content on screenshot',p=>p.tiles[0].foreignContentHits=1],
 ['obstructed screenshot',p=>p.tiles[0].obstructionsIntersectingClip=1],
 ['changed DOM during capture',p=>p.tiles[0].domSha256='9'.repeat(64)],
 ['stitched output',p=>p.compositeImageCreated=true],
 ['hidden nonempty child',p=>p.fragments[1].completeChildrenVisible=false],
 ['source styling write',p=>p.cssWrites=1],
 ['viewport alteration',p=>p.viewport.height=1200],
 ['unrecognized fragment field',p=>p.fragments[1].approval=true],
 ['non-numeric hit count',p=>p.tiles[0].hitTestSamples='20']
])test('rejects '+name,()=>{const p=proof();change(p);assert.throws(()=>C.validateCapture(p,{width:1440,height:1000}));});
test('all screenshot identities are required in physical tile order',()=>{const p=proof(),s=p.tiles.map(t=>({tileIndex:t.tileIndex,path:t.filename,sha256:'9'.repeat(64),bytes:99}));assert(C.validateCapture(p,p.viewport,s));assert.throws(()=>C.validateCapture(p,p.viewport,s.slice(1)));const swapped=structuredClone(s);[swapped[0],swapped[1]]=[swapped[1],swapped[0]];assert.throws(()=>C.validateCapture(p,p.viewport,swapped));});
test('capture refuses a fabricated policy object before any browser work',async()=>{await assert.rejects(C.capture({}, {}, 'x.png',policy()),/POLICY_NOT_ISSUED/);});
test('readiness and source count retain their original strict requirements',()=>{for(const change of [f=>f.sourceFragments=1,f=>f.readiness='RENDERING',f=>f.mode='exam',f=>f.feedbackIdle=false]){const f=frame(2);f.question.y=100;f.children[0].y=102;change(f);assert.throws(()=>C.assertTileFrame(f,{fragmentTileIndex:1,relativeInterval:[0,384]}));}});

test("a fractional pixel tile drift still fails the exact document binding",()=>{const p=proof();p.tiles[0].clip.x+=0.00001;assert.throws(()=>C.validateCapture(p,p.viewport));});
test("a single hit sample cannot stand for before and after capture",()=>{const p=proof();p.tiles[0].hitTestSamples=1;assert.throws(()=>C.validateCapture(p,p.viewport));});
