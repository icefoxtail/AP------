'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const W='/workspace/scratch/c8f1b0bfb4fa/m2-public41-continuity-current16f-r1';
const REPO='/workspace/scratch/c9f85667609e/ap-release-recovery/ap.git',BASE='16f4b35d2ce11eaa1d2a299cb2d9ed74a4571e6f';
const env={...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'};
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=x=>crypto.createHash('sha1').update('blob '+x.length+'\0').update(x).digest('hex');
const need=(x,c)=>{if(!x)throw Error(c);};
const git=args=>execFileSync('git',['--git-dir='+REPO,...args],{env,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const ownSnapshot=(q,fields)=>Object.fromEntries(fields.map(field=>[field,{present:Object.hasOwn(q,field),value:q[field]??null}]));
const PRESENTATION_FIELDS=['image','imageAlt','imageSize','layoutTag','choicesEmbeddedInImage','svg','figureSvg','images','score'];
const statusRaw=fs.readFileSync(path.join(W,'public49-status-and-provisional39-r1.json'));
need(sha(statusRaw)==='fe4420e3bc0552676e71f4cf850b2bfe6feb6e65f4982e3b933950d40420c2ed','STATUS_PIN');
const status=JSON.parse(statusRaw),selected=status.rows.filter(row=>row.captureInProvisionalUi39);need(selected.length===39,'EXACT39');
const sources=[...new Set(selected.map(row=>row.sourceRef.path))].sort(),banks=new Map(),sourceBindings=[];
for(const sourcePath of sources){
  const row=selected.find(x=>x.sourceRef.path===sourcePath),oid=git(['rev-parse',BASE+':'+sourcePath]).toString().trim();need(oid===row.sourceRef.gitBlobSha1,'CURRENT_SOURCE_DRIFT');
  const raw=git(['cat-file','blob',oid]);need(blob(raw)===oid,'CURRENT_SOURCE_BLOB');
  const context={window:{}};vm.runInNewContext(raw.toString('utf8'),context,{timeout:1500,filename:'public39-source.js',contextCodeGeneration:{strings:false,wasm:false}});
  const questions=context.window.questionBank??context.questionBank??context.window.examData?.questions??context.examData?.questions;
  need(Array.isArray(questions)&&questions.length===row.sourceQuestionCount,'WHOLE_BANK_COUNT');
  banks.set(sourcePath,questions);sourceBindings.push({sourcePath,expectedBankCount:questions.length,gitBlobSha1:oid,sha256:sha(raw),bytes:raw.length});
}
need(sourceBindings.length===12&&sourceBindings.reduce((n,row)=>n+row.expectedBankCount,0)===290,'WHOLE12_BANKS290');
function assetPath(pointer){
  need(typeof pointer==='string'&&!/[\\\x00-\x1f\x7f]/.test(pointer),'IMAGE_POINTER');
  const rel=pointer.startsWith('archive/assets/')?pointer:pointer.startsWith('assets/')?'archive/'+pointer:null;
  need(rel&&!rel.split('/').some(x=>!x||x==='.'||x==='..')&&/\.svg$/i.test(rel),'EXACT_CURRENT_SVG_PATH');return rel;
}
const items=[],diagnostics=[];
for(const row of selected){
  const q=banks.get(row.sourceRef.path)[row.sourceOrdinal-1],sourceQuestionNo=String(q.id??q.number);
  need(sourceQuestionNo===String(row.sourceOrdinal),'ORDINAL_NUMBER_BINDING');
  const content=String(q.content??q.question??''),inline=[...content.matchAll(/<img\b[^>]*\bsrc\s*=\s*(['"])(.*?)\1/gi)].map(match=>match[2]);
  let imageBinding,imagePointer;
  if(typeof q.image==='string'&&q.image){need(inline.length===0,'DOUBLE_PROBLEM_IMAGE');imageBinding='QUESTION_IMAGE';imagePointer=q.image;}
  else{need(inline.length===1&&!q.image,'EXACT_SINGLE_CONTENT_IMAGE');imageBinding='CONTENT_SINGLE_IMG';imagePointer=inline[0];}
  const rel=assetPath(imagePointer),assetGitBlobSha1=git(['rev-parse',BASE+':'+rel]).toString().trim();
  need(/^[a-f0-9]{40}$/.test(assetGitBlobSha1),'ASSET_GIT_BINDING');
  const item={key:row.examId+'-Q'+row.sourceOrdinal,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo,
    sourcePath:row.sourceRef.path,expectedBankCount:row.sourceQuestionCount,identityRecordSha256:row.identityRecordSha256,
    imageBinding,imagePointer,assetPath:rel,assetGitBlobSha1,
    problemPayloadSha256:sha(stable({content:q.content??q.question,choices:q.choices??[]})),
    problemFieldsSha256:sha(stable(ownSnapshot(q,['content','question','choices']))),
    presentationSha256:sha(stable(ownSnapshot(q,PRESENTATION_FIELDS))),
    wholeQuestionSha256:sha(stable(q)),expectedChoiceCount:Array.isArray(q.choices)?q.choices.length:0};
  items.push(item);
  diagnostics.push({key:item.key,questionUid:item.questionUid,imageBinding,expectedChoiceCount:item.expectedChoiceCount,
    embeddedChoicesOwn:Object.hasOwn(q,'choicesEmbeddedInImage'),embeddedChoicesValue:q.choicesEmbeddedInImage??null,
    retainedInlineSvgOwn:Object.hasOwn(q,'svg'),retainedInlineSvgBytes:typeof q.svg==='string'?Buffer.byteLength(q.svg):null,
    questionAliasOwn:Object.hasOwn(q,'question'),questionAliasEqualsContent:Object.hasOwn(q,'question')?q.question===q.content:null,
    standaloneLiteralNewlines:(content.match(/\\n(?![A-Za-z])/g)||[]).length});
}
need(new Set(items.map(row=>row.questionUid)).size===39&&new Set(items.map(row=>row.assetPath)).size===39,'EXACT39_UNIQUE');
const result={schemaVersion:'archive-public39-current-source-derived-inputs-v1',baseCommit:BASE,statusSha256:sha(statusRaw),sourceBindings,items,diagnostics,
  presentationFields:PRESENTATION_FIELDS,currentSourceDataOnly:true,originalOrImageReviewRepeated:false,answerOrSolutionValuesEmitted:false,newApproval:0,remoteMutation:0};
const out=path.join(W,'.design/current-ui39-inputs-unsealed-r1.json'),raw=Buffer.from(JSON.stringify(result,null,2)+'\n');fs.writeFileSync(out,raw,{flag:'wx'});
process.stdout.write(JSON.stringify({status:'CURRENT39_METADATA_EXTRACTED',path:out,sha256:sha(raw),bytes:raw.length,sourceBanks:12,wholeBankCount:290,
  imageBindings:items.reduce((out,row)=>(out[row.imageBinding]=(out[row.imageBinding]||0)+1,out),{}),diagnostics:diagnostics.filter(row=>row.embeddedChoicesOwn||row.retainedInlineSvgOwn||row.questionAliasOwn||row.standaloneLiteralNewlines)})+'\n');
