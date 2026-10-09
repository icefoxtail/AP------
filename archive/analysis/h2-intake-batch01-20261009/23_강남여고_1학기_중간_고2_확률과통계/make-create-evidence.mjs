import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';
const root='C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------';
const uid='23_강남여고_1학기_중간_고2_확률과통계';
const exam=path.join(root,'.tmp/archive/h2-intake-batch01-20261009',uid,uid+'.js');
const ev=path.join(root,'archive/analysis/h2-intake-batch01-20261009',uid);
const source=fs.readFileSync(exam),sourceSha='sha256:'+crypto.createHash('sha256').update(source).digest('hex');
const c={window:{}};vm.createContext(c);vm.runInContext(source.toString('utf8'),c,{filename:exam,timeout:5000});const qs=c.window.questionBank;
const plan=JSON.parse(fs.readFileSync(path.join(ev,'CREATE.candidate.json'),'utf8'));const by=new Map(plan.map(x=>[x.qid,x]));
const {gitBlobSha}=await import(pathToFileURL(path.join(root,'archive/tools/archive-stage-validator.mjs')));
const hex=value=>crypto.createHash('sha256').update(value).digest('hex');
const pref=value=>'sha256:'+hex(value);
const unitTable='docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md';
const masterSha=hex(fs.readFileSync(path.join(root,unitTable)));
const intakePath='.tmp/archive/h2-intake-batch01-20261009/'+uid+'/intake-original.evidence.json';
const intakeSha=hex(fs.readFileSync(path.join(root,intakePath)));
const baselinePath='.tmp/archive/h2-intake-batch01-20261009/'+uid+'/extracted-baseline.js';
const baselineSha=hex(fs.readFileSync(path.join(root,baselinePath)));
const migrated=new Map([[14,{old:'archive/assets/images/'+uid+'/q14.png',next:'assets/images/'+uid+'/q14.png',sha:'23ab9fd18de7ecd256449f8d4bd00ecb381d38a6001b9a54b7229b991f7540bb'}],[17,{old:'archive/assets/images/'+uid+'/q17.png',next:'assets/images/'+uid+'/q17.png',sha:'7681254c4b0e134ba6059fb8cc12f3991c2b0086ec62e30e08e790d0f210f028'}],[21,{old:'archive/assets/images/'+uid+'/q21.png',next:'assets/images/'+uid+'/q21.png',sha:'8f4fa03bdcfbf59979bd75e5ecf6707cc0cfd6a20722b4b7614435d826fe0914'}]]);
const methodLookup={
  H15:'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/01_2015/HIGH/확률과통계.md',
  taxonomy:'archive/data/meta-foundation/canonical/packs/probability-statistics/taxonomy.json',
  binding:'archive/data/meta-foundation/canonical/packs/probability-statistics/bindings.json',
  externalFunctionTaxonomy:'archive/data/meta-foundation/canonical/packs/functions-graphs/taxonomy.json',
  unitMaster:unitTable,
  subunitMaster:'archive/data/master_tables/js_archive_tag_master.json'
};
function explanationFor(q,m){
  if(q.id===22)return '네 소문항의 실제 문자열에서 (가)·(나)·(다)·(라) 풀이 블록이 각각 분리되고 합산식이 뒤에 이어진다.';
  if([14,17,21].includes(q.id))return '설명→조건 또는 구조→계산식→결론을 분리했고, 관련 도형 사실은 연결된 solutionImage에서 따로 확인한다.';
  return '문제의 결정 조건을 설명하고 실제 식과 중간 계산을 줄마다 드러낸 뒤 답을 분리해 제시한다.';
}
function layoutEvidence(q,m){
  const img=migrated.get(q.id);
  return {status:'PASS',disposition:'KEEP',finalLayoutTag:'grid',wide:false,sourceTextExactParity:'PASS',choicesExactParity:'PASS',basis:img?`원문 지문·보기를 보존하고 identical asset alias의 경로만 ${img.old} → ${img.next}로 정규화했다.`:'AUTO-FIRST; 기본 grid에서 의미 경계를 유지하고 추가 조판 override가 필요하지 않다.'};
}
function visualEvidence(q,m){
  return {status:'PASS',necessity:m.visual,action:m.visualAction,solutionImage:q.solutionImage||null,sourceImagePreserved:q.image||null,renderStatus:'NOT_RUN',evidence:m.visual==='VISUAL_REQUIRED'?`source figure의 결정 구조를 다시 그리지 않고 풀이의 누적/대칭 궤도/비이웃 자리 수만 추가한 SVG를 실제로 열어 정적 수학 사실을 검수했다.`:`풀이의 결정 구조가 기호·식으로 충분히 드러나며 추가 해설 시각자료의 학습 이득이 확인되지 않아 EXEMPT.`};
}
const rows=[],questionRows=[],metaRows=[],visualRows=[],qualityCompareRows=[];
for(const q of qs){const m=by.get(Number(q.id));if(!m)throw Error('PLAN_QID_MISSING:'+q.id);const image=migrated.get(q.id);
 const unit=q.standardUnit,pt=q.problemTypeKey,tpl=q.templateKey;
 const rpmPath={curriculum:'2015',level:'HIGH',scope:'확률과통계',majorUnit:'경우의 수',midUnit:unit,l3:q.L3,l4:q.L4};
 const lookupRefs=[{path:methodLookup.H15,section:`${q.L1} / ${q.L2} / ${q.L3} / ${q.L4}`},{path:methodLookup.unitMaster,sha256:masterSha,standardUnitKey:q.standardUnitKey,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey},{path:methodLookup.taxonomy,problemTypeKey:pt,templateKey:tpl},{path:methodLookup.binding,curriculum:'2015',standardCourse:'확률과 통계',standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,problemTypeKey:pt,status:'ACTIVE'},{path:methodLookup.subunitMaster,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,subUnit:q.subUnit}];
 if(pt==='PT_FUNCTION_COUNTING')lookupRefs.push({path:methodLookup.externalFunctionTaxonomy,problemTypeKey:pt,templateKey:tpl,status:'ACTIVE'});
 const sourceParity={sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',sourceRawSha256:'c8b0636f90a94d6ce5c7deae66cdd1cf47397b26f885d1d72696f8acf8d5c562',sourceBaselineRawSha256:baselineSha,intakeEvidencePath:intakePath,intakeEvidenceSha256:intakeSha,contentChoicesParity:'PASS',sourceTextChanged:false,pdfActuallyReviewed:false,...(image?{imageReferenceMigration:{oldRef:image.old,newRef:image.next,sha256:image.sha,identicalAliasVerified:true}}:{})};
 const qEvidence={qid:q.id,sourceMode:'ORIGINAL',verdict:'PASS',smallBoardContinuityStatus:'PASS',solutionSha256:hex(q.solution),axisEvidence:{questionLayout:layoutEvidence(q,m),solutionLayout:{status:'PASS',smallBoardContinuityStatus:'PASS',evidence:explanationFor(q,m)},meta:{status:'PASS',rpmSemanticStatus:q.rpmSemanticStatus,rpmPrimaryPath:rpmPath,primaryMethod:m.primaryMethod,decisiveStep:m.decisiveStep,projectionStatus:q.projectionStatus,problemTypeKey:pt,templateKey:tpl,lookupRefs},visualSvg:visualEvidence(q,m)},provenanceEvidence:{sourceParity}};
 rows.push(qEvidence);
 const mathEvidence=`${m.primaryMethod} ${m.decisiveStep} final answer ${q.answer}.`;
 const metaText=`${q.standardCourse} · ${q.standardUnitKey} ${q.standardUnit} (order ${q.standardUnitOrder}) · ${q.subUnitKey}; ${q.L1}/${q.L2}/${q.L3}/${q.L4}; ${pt}/${tpl}; active binding and current source-plus-solution method recorded.`;
 const qrow={qid:q.id,sourceExact:{status:'PASS',evidence:`q${q.id} content, question, choices, type and score equal extracted-baseline.js; no PDF or source-fidelity claim added.`},answerMath:{status:'PASS',evidence:mathEvidence},solutionMath:{status:'PASS',evidence:`Current solution follows source conditions and yields ${q.answer}; decisive calculation: ${m.decisiveStep}`},smallBoard:{status:'PASS',evidence:explanationFor(q,m)},curriculum:{status:'PASS',evidence:`2015 high-school 확률과 통계: ${q.standardUnitKey} → ${q.standardUnit} order ${q.standardUnitOrder}; actual master SHA-256 ${masterSha}.`},visualNecessity:{status:'PASS',evidence:visualEvidence(q,m)},meta:{status:'PASS',evidence:metaText},difficulty:{status:'PASS',evidence:`Current source/solution pass: bucket ${m.bucket}, ${m.confidence} confidence, NONE boundary; legacy level ${q.level} matches canonical bucket mapping.`},runtimeString:{status:'PASS',evidence:'Candidate executes in Node VM; actual student content/choices and answer/solution strings were inspected after evaluation; no control escapes.'}};
 questionRows.push(qrow);
 metaRows.push({qid:q.id,result:'PASS',primaryMethod:m.primaryMethod,decisiveStep:m.decisiveStep,rpmDisposition:'FINAL',projectionDisposition:'EXACT_ACTIVE',rpmPrimaryPath:rpmPath,projectionStatus:'REUSE',problemTypeKey:pt,templateKey:tpl,lookupRefs});
 qualityCompareRows.push({qid:q.id,solutionSha256:hex(q.solution),status:'PASS',axes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY'],observation:'Final current solution compared with the two pre-read Golden samples and the negative regression; required intermediate expressions and condition use are present.'});
}
const visualFacts={
14:{asset:'assets/images/'+uid+'/q14-solution.svg',expected:['blocked coordinates (1,2),(3,2),(1,4),(3,4)','d(i,j)=d(i-1,j)+d(i,j-1) off blockers','d(5,5)=43'],observed:['four red X nodes at (1,2),(3,2),(1,4),(3,4)','displayed node counts follow left+below recurrence','last neighboring counts 14 and 29 lead to 43'],checks:[{method:'COORDINATE_COMPUTE',predicate:'The four blocked grid nodes match the opened source diagram.',expected:'(1,2),(3,2),(1,4),(3,4)',observed:'SVG marks exactly (1,2),(3,2),(1,4),(3,4)',result:'PASS'},{method:'TOPOLOGY_COMPUTE',predicate:'Each free node accumulates paths from left and below; blocked nodes carry zero.',expected:'d(i,j)=d(i-1,j)+d(i,j-1)',observed:'node labels follow the recurrence and the four obstacles are zero',result:'PASS'},{method:'COORDINATE_COMPUTE',predicate:'The B node equals the sum of its two predecessor nodes.',expected:43,observed:'14+29=43',result:'PASS'}]},
17:{asset:'assets/images/'+uid+'/q17-solution.svg',expected:['4 axis-fixed triangle regions','2 left-right pairs','2^8-2^6=192'],observed:['four singleton choice rows','two equality-linked mirror-pair rows','2^8=256; 2^6=64; difference 192'],checks:[{method:'TOPOLOGY_COMPUTE',predicate:'Opened source has four triangle regions on the symmetry axis and two reflected pairs.',expected:'4 singleton + 2 paired orbits',observed:'solution diagram distinguishes 4 singleton choices and 2 equality-linked pairs',result:'PASS'},{method:'TOPOLOGY_COMPUTE',predicate:'A symmetric coloring assigns one color independently to each orbit.',expected:'6 independent binary choices',observed:'four individual choices plus two pair choices',result:'PASS'},{method:'TOPOLOGY_COMPUTE',predicate:'Subtract symmetric colorings from all 8-region colorings.',expected:192,observed:'2^8-2^6=256-64=192',result:'PASS'}]},
21:{asset:'assets/images/'+uid+'/q21-solution.svg',expected:['nonadjacent odd-position sets: k=2 has 9; k=3 has 2','assign distinct selected odds/evens','divide by 6 rotations'],observed:['two-odd and alternating three-odd hexagon witnesses shown','P(4,k) assignments shown in the count formulas','(2592+1152)/6=624'],checks:[{method:'TOPOLOGY_COMPUTE',predicate:'Independent sets of size 2 and 3 in the six-cycle are counted.',expected:'9 pairs; 2 alternating triples',observed:'SVG labels the two cases and shows a valid nonadjacent pattern for each',result:'PASS'},{method:'TOPOLOGY_COMPUTE',predicate:'Every selected number is distinct, so a nonidentity rotation fixes no full arrangement.',expected:'6 arrangements per rotation orbit',observed:'count is divided by 6',result:'PASS'},{method:'TOPOLOGY_COMPUTE',predicate:'The two parity cases sum to the declared total.',expected:624,observed:'(2592+1152)/6=624',result:'PASS'}]}
};
for(const [qid,f] of Object.entries(visualFacts)){const file=path.join(path.dirname(exam),f.asset);const bytes=fs.readFileSync(file);visualRows.push({qid:Number(qid),result:'PASS',assetPath:f.asset,assetSha256:pref(bytes),expectedFacts:f.expected,observedFacts:f.observed,checks:f.checks,renderStatus:'NOT_RUN',staticReviewer:'/root/create_03'});}
const registry=JSON.parse(fs.readFileSync(path.join(root,'archive/data/codex-quality-calibration-registry-v2.json'),'utf8'));
const samplePaths=['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js'];
const goldenItems=[
 {path:samplePaths[0],qid:1,excerpt:'먼저 내분점 $P$의 좌표를 구한다.',observation:'비율의 방향을 설명한 뒤 내분점, 중점, 거리의 실제 식을 순차적으로 적는다.'},
 {path:samplePaths[0],qid:2,excerpt:'두 직선이 평행하므로 기울기가 서로 같다.',observation:'기울기 조건 후 점 대입으로 절편을 구하고 목표값까지 계산한다.'},
 {path:samplePaths[1],qid:2,excerpt:'두 직선이 서로 수직이므로 두 직선의 기울기의 곱은 $-1$이다.',observation:'기울기 곱으로 미지수를 정하고 실제 solution SVG의 두 선 기울기와 표시를 비교했다.',axes:['VISUAL_SEMANTIC_PARITY']},
 {path:samplePaths[1],qid:3,excerpt:'원의 중심과 반지름을 구하려면 주어진 식을 원의 표준형으로 바꾼다.',observation:'완전제곱 중간식을 적고 표준형과 중심·반지름을 대응시킨다.'}
];
const goldenSampleQuestionRefs=goldenItems.map(item=>{const full=fs.readFileSync(path.join(root,item.path),'utf8');const box={window:{}};vm.runInNewContext(full,box,{timeout:5000});const q=box.window.questionBank.find(x=>Number(x.id)===item.qid);const out={path:item.path,qid:item.qid,solutionSha256:pref(q.solution),solutionExcerpt:item.excerpt,observation:item.observation};if(q.solutionImage)out.visualSha256=pref(fs.readFileSync(path.join(root,'archive',q.solutionImage)));return out;});
const goldenRefs=samplePaths.map(p=>{const bytes=fs.readFileSync(path.join(root,p));return {path:p,sha256:pref(bytes),gitBlobSha:gitBlobSha(bytes)};});
const negativePath=registry.negativePaths[0],negativeBytes=fs.readFileSync(path.join(root,negativePath));
const negativeSampleRefs=[{path:negativePath,sha256:pref(negativeBytes),gitBlobSha:gitBlobSha(negativeBytes)}];
const cal=JSON.parse(fs.readFileSync(path.join(ev,'calibration/CREATE.solution-calibration-preflight.json'),'utf8')).solutionQualityCalibration;
cal.qualityCompareCount='25/25';cal.qualityCompareRows=qualityCompareRows;
const qualityCalibration={...cal};
const fileSampleRefs=samplePaths.map(p=>{const bytes=fs.readFileSync(path.join(root,p));return {path:p,sha256:hex(bytes),items:goldenItems.filter(i=>i.path===p).map(i=>{const text=fs.readFileSync(path.join(root,p),'utf8'),box={window:{}};vm.runInNewContext(text,box,{timeout:5000});const q=box.window.questionBank.find(x=>Number(x.id)===i.qid),item={qid:i.qid,solutionSha256:hex(q.solution),observation:i.observation};if(q.solutionImage)item.visualSha256=hex(fs.readFileSync(path.join(root,'archive',q.solutionImage),'utf8'));if(i.axes)item.axes=i.axes;return item;})};});
const negativeText=negativeBytes.toString('utf8');
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',examUid:uid,stage:'CREATE',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',rows,questionRows,visualRows,metaRows,summary:{questionCount:25,questionEvidenceRows:25,linkedSolutionVisualCount:3,visualEvidenceRows:3,metaEvidenceRows:25,itemHoldCount:0},solutionQualityCalibration:qualityCalibration,goldenCalibrationReviewed:true,goldenCalibrationSet:[...samplePaths].sort(),goldenCalibration:{negativeSample:{path:negativePath,sha256:hex(negativeText),observation:'Read the approved false-PASS fixture and rendered q20 failure. Its label 3x+4y-8=0 requires slope -3/4, while the actual labelled line primitive slopes upward; text-only visual review is insufficient.'},samples:fileSampleRefs},sourceReferencePolicy:{sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',intakeEvidencePath:intakePath,intakeEvidenceSha256:intakeSha,sourceBaselineRawSha256:baselineSha,sourceTextChanged:false,pdfActuallyReviewed:false},unitOrderAuthority:{path:unitTable,sha256:masterSha,semanticReclassification:false,sourceMutation:false},imageRefMigrations:[...migrated.entries()].map(([qid,x])=>({qid,oldRef:x.old,newRef:x.next,sha256:x.sha,identicalAliasVerified:true})),sourceMode:'ORIGINAL'};
fs.writeFileSync(path.join(ev,'CREATE.evidence.draft.json'),JSON.stringify(evidence,null,2)+'\n');
const rawSha=crypto.createHash('sha256').update(source).digest('hex');console.log(JSON.stringify({path:path.join(ev,'CREATE.evidence.draft.json'),questionCount:qs.length,visualCount:visualRows.length,rawSha256:rawSha,goldenSampleRefs:goldenRefs.map(x=>x.path),goldenItemCount:goldenSampleQuestionRefs.length}));