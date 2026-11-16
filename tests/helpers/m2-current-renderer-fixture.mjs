import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import vm from 'node:vm';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {REASSESSED_STUDENT_FIELDS} from '../../archive/tools/meta-foundation/reviewed-source-reassessment.mjs';
import {REVIEWED_META_VALUE_FIELDS} from '../../archive/tools/meta-foundation/reviewed-meta-value-fields.mjs';
import {sourceFingerprint,contentFingerprint} from '../../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {loadActiveMetaRegistry,validateActiveMetaFields} from '../../archive/tools/meta-foundation/active-registry.mjs';
export const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
export const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
export const same=(a,b)=>stable(a)===stable(b);
const clone=x=>structuredClone(x),blob=b=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(b)}\0`).update(b).digest('hex');
const payload=q=>Object.fromEntries(REASSESSED_STUDENT_FIELDS.map(k=>[k,q[k]??null]));
const delta=(a,b)=>Object.fromEntries([...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>!same(a[k],b[k])).sort().map(k=>[k,{before:{present:Object.hasOwn(a,k),value:a[k]??null},after:{present:Object.hasOwn(b,k),value:b[k]??null}}]));

export function m2RendererFixture(t,{layout='grid',extraDelta={},currentSvg,productionStudentDelta={},unapprovedMetadataAppend={},sealV1=true}={}) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'m2-renderer-contract-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...a)=>execFileSync('git',a,{cwd:root,stdio:['ignore','pipe','pipe']}).toString().trim();
  git('init','-q');git('config','user.name','Synthetic fixture');git('config','user.email','fixture@example.invalid');
  const put=(p,v)=>{const file=path.join(root,p);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,Buffer.isBuffer(v)||typeof v==='string'?v:JSON.stringify(v,null,2)+'\n');return{path:p,sha256:sha(fs.readFileSync(file))};};
  const commit=()=>{git('add','.');git('commit','--allow-empty','-qm','Synthetic immutable fixture');return git('rev-parse','HEAD');};
  const sourceArchiveFile='original/middle/m2/2final/synthetic.js',sourcePath='archive/exams/'+sourceArchiveFile,
    nativePath='docs/native.json',rpmPath='archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/middle2.json',
    oldAsset='archive/assets/original.png',newAsset='archive/assets/current.svg',solutionAsset='archive/assets/solution.svg';
  const old={id:1,content:'synthetic reviewed question',choices:['a','b'],answer:'a',solution:'synthetic reviewed explanation',
    image:oldAsset.slice(8),solutionImage:solutionAsset.slice(8),layoutTag:layout,curriculum:'2015',
    standardCourse:'중2 수학',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO',
    problemTypeKey:'PT_EXISTING',templateKey:'TPL_EXISTING',crossConceptKeys:[],conditionKeys:[],integrationPattern:'NONE',difficultyBucket:2,level:'중',
    primaryMethod:'synthetic reviewed decisive step',decisiveStep:'synthetic reviewed decisive step'};
  const source=q=>'window.questionBank = '+JSON.stringify([q])+';\n';
  put(oldAsset,Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9L8AAAAASUVORK5CYII=','base64'));
  put(solutionAsset,'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');
  put(sourcePath,source(old));
  const rpmRef=put(rpmPath,{records:[{id:'M2-RPM-1',curriculum:'2015',scope:'M2-2',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO'}]});
  const base=commit(),binding={curriculum:'2015',standardCourse:'중2 수학',standardUnitKey:'M2-06',subUnitKey:'M2-06-RATIO',problemTypeKey:'PT_EXISTING',status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY'};
  const row={questionUid:'uid1',sourceOrdinal:1,rpmRecordId:'M2-RPM-1',rpmDecision:'KEEP',decisiveStep:'synthetic reviewed decisive step',after:{difficultyBucket:2},proposalRefs:[],registrationDebt:[],
    fieldReview:{classification:'기존 ACTIVE 주유형 검토',binding:'정확한 기존 ACTIVE binding 검토',difficulty:'기존 난도 유지',crossConcept:'독립 CC 없음',condition:'별도 Condition 없음',integration:'Primary taxonomy 내부 단계만으로 해결한다.'},
    activeDefinitionMatch:{problemTypeKey:'PT_EXISTING',templateKey:'TPL_EXISTING',problemTypeStatus:'ACTIVE',templateStatus:'ACTIVE',templateParent:'PT_EXISTING',exactBindings:[Object.fromEntries(Object.entries(binding).filter(([key])=>key!=='ownerPack'))]}};
  const nativeDoc={schemaVersion:'m2-s2-meta-review-v1',sourceArchiveFile,baseSha:base,sourceGitBlobSha:git('rev-parse',base+':'+sourcePath),reviewedQuestionCount:1,owner:'native-author',items:[row],proposals:[]};
  const nativeRef=put(nativePath,nativeDoc),nativeCommit=commit();
  const prefigure={...clone(old),curriculumKey:'2015',courseKey:'M2-2',...unapprovedMetadataAppend};put(sourcePath,source(prefigure));
  const retained=['problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern'];
  const metadata={...clone(prefigure),sourceFingerprint:sourceFingerprint(prefigure),contentFingerprint:contentFingerprint(prefigure)};
  for(const k of REASSESSED_STUDENT_FIELDS)delete metadata[k];for(const k of retained)metadata[k]=null;
  const after={...Object.fromEntries(retained.map(k=>[k,clone(prefigure[k])])),curriculum:'2015',curriculumKey:'2015',courseKey:'M2-2',sourceFingerprint:sourceFingerprint(prefigure),contentFingerprint:contentFingerprint(prefigure)};
  const patch={questionUid:'uid1',sourceOrdinal:1,before:Object.fromEntries(Object.keys(after).map(k=>[k,metadata[k]??null])),after,evidenceRefs:[nativeRef,rpmRef],
    identityBefore:{sourceFingerprint:sourceFingerprint(prefigure)},reason:'Synthetic transport fixture; original metadata authority is unchanged.',
    sourceReview:{schemaVersion:'archive-reviewed-source-reassessment-v1',reviewCommit:nativeCommit,reviewPath:nativePath,reviewRef:nativeRef,
      retainedFields:{schemaVersion:'archive-reviewed-native-retained-fields-v1',fields:retained}}};
  const request={schemaVersion:'archive-reviewed-exam-meta-register-request-v2',requestId:'synthetic-m2-renderer',examUid:'exam1',sourceArchiveFile,scope:'PARTIAL_UIDS',
    expectedQuestionCount:1,expectedSourceBlobSha1:blob(source(prefigure)),approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'transport-author',evidenceRefs:[nativeRef,rpmRef]},registryChanges:[],items:[patch]};
  const frozenPath='.archive-meta-register/inbox/synthetic-m2-renderer.json';put(frozenPath,request);const frozenCommit=commit(),frozenRaw=fs.readFileSync(path.join(root,frozenPath));
  const presentation={image:newAsset.slice(8),imageSize:'full',imageAlt:'Synthetic diagram with the same labels and givens.',layoutTag:'fullwidth'};
  const productionBefore={...clone(old),...productionStudentDelta};put(sourcePath,source(productionBefore));const productionBeforeCommit=commit();
  const productionCurrent={...clone(productionBefore),...presentation,...extraDelta};put(sourcePath,source(productionCurrent));
  put(newAsset,currentSvg||'<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/><text x="0" y="1">A</text></svg>');const productionCommit=commit();
  const current={...clone(prefigure),...presentation,...extraDelta};put(sourcePath,source(current));const currentCommit=commit();
  const snapshot=(c,q)=>{const b=Buffer.from(execFileSync('git',['show',c+':'+sourcePath],{cwd:root}));return{commit:c,path:sourcePath,gitBlobSha1:blob(b),sha256:sha(b),questionSha256:sha(stable(q))};};
  const asset=(c,p)=>{const b=Buffer.from(execFileSync('git',['show',c+':'+p],{cwd:root}));return{path:p,gitBlobSha1:blob(b),sha256:sha(b)};};
  const frozenCopy='.archive-meta-register/evidence/m2-renderer/frozen-request.json',frozenCopyRef=put(frozenCopy,frozenRaw);
  const fields=['image','imageAlt','imageSize','layoutTag'],change=delta(old,productionCurrent);
  const witnessRow={questionUid:'uid1',sourceOrdinal:1,sourceArchiveFile,expectedQuestionCount:1,
    nativeReviewRef:{commit:nativeCommit,path:nativePath,sha256:nativeRef.sha256},nativeItemSha256:sha(stable(row)),
    frozenRequestRef:{commit:frozenCommit,gitPath:frozenPath,...frozenCopyRef},productionBeforeSourceRef:snapshot(productionBeforeCommit,productionBefore),productionCurrentSourceRef:snapshot(productionCommit,productionCurrent),
    prefigureSourceRef:snapshot(frozenCommit,prefigure),currentSourceRef:snapshot(currentCommit,current),changedFields:fields,
    fieldDeltaHashes:Object.fromEntries(fields.map(k=>[k,{before:sha(stable(change[k].before)),after:sha(stable(change[k].after))}])),
    metadataPatchSha256:sha(stable(delta(productionBefore,prefigure))),beforeAssets:[asset(frozenCommit,oldAsset),asset(frozenCommit,solutionAsset)],currentAssets:[asset(currentCommit,newAsset),asset(currentCommit,solutionAsset)],
    visualChecks:{originalAndCurrentProblemObserved:true,labelsAndGivenValuesUnchanged:true,givenGeometryRelationsPreserved:true,choiceOrderUnchanged:true,noNewInferenceOrAnswerHint:true,unchangedSolutionBytesVerified:true},
    observed:{preservedGivenConditions:'SYNTHETIC TEST WITNESS ONLY; no production visual review.',presentationChanges:'Synthetic raster to scalar SVG presentation.',noNewInferenceOrAnswerHint:'Synthetic contract fixture only.'}};
  const witness={schemaVersion:'archive-independent-m2-current-renderer-review-v1',scope:'M2_EXISTING_METADATA_WITH_INDEPENDENT_CURRENT_RENDERER',decision:'PASS_NARROW_PRESENTATION_CONTINUITY',
    reviewer:'independent-fixture-reviewer',observedAt:'synthetic-fixture',selectedUidCount:1,rows:[witnessRow],newMathematicalQa:false,newMetadataApprovals:0,newDifficultyJudgments:0,newReviewPassCount:0};
  const witnessPath='.archive-meta-register/evidence/m2-current-renderer-fixture/independent-review.json';
  request.expectedSourceBlobSha1=blob(source(current));
  Object.assign(after,{sourceFingerprint:sourceFingerprint(current),contentFingerprint:contentFingerprint(current)});
  const pt={problemTypeKey:'PT_EXISTING',canonicalLabelKo:'기존 주유형',status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY',supportingQuestionUids:['uid1']},
    tpl={templateKey:'TPL_EXISTING',canonicalLabelKo:'기존 절차',status:'ACTIVE',ownerPack:'MIDDLE_GEOMETRY',parentProblemTypeKey:'PT_EXISTING',supportingQuestionUids:['uid1']};
  const tables={pt:new Map([[pt.problemTypeKey,pt]]),tpl:new Map([[tpl.templateKey,tpl]]),cc:new Map(),cond:new Map(),
    bindings:new Map([['exact',binding]]),master:new Map()};
  const native={spec:{reviewCommit:nativeCommit,reviewPath:nativePath,reviewRef:nativeRef},review:nativeDoc,reviewer:'native-author',committedBank:[clone(old)],reviewedBank:[clone(old)]};
  const bankFromBytes=b=>{const c={window:{}};vm.runInNewContext(b.toString(),c);return JSON.parse(JSON.stringify(c.window.questionBank));};
  const args={root,request,patch,row,native,question:current,metadata,final:{...metadata,...after},studentPayload:payload,bankFromBytes,canonicalBefore:tables,canonicalAfter:clone(tables),supportedFields:new Set(REVIEWED_META_VALUE_FIELDS),cache:new Map()};
  const reseal=()=>{const ref=put(witnessPath,witness),witnessCommit=commit();patch.sourceReview.m2RendererProof={schemaVersion:'archive-reviewed-m2-current-renderer-continuity-v1',reviewCommit:witnessCommit,reviewRef:ref};
    const assets=[...witnessRow.beforeAssets,...witnessRow.currentAssets].map(x=>({path:x.path,sha256:x.sha256}));
    request.approval.evidenceRefs=patch.evidenceRefs=[...new Map([nativeRef,rpmRef,frozenCopyRef,ref,...assets].map(x=>[x.path,x])).values()];args.cache=new Map();};
  if(sealV1)reseal();return{root,put,git,commit,sourcePath,source,old,prefigure,productionCurrent,current,row,nativeDoc,witness,witnessRow,request,patch,args,tables,reseal,oldAsset,newAsset,solutionAsset,witnessPath,frozenCopy,frozenCommit};
}

// A complete small canonical environment lets the production registrar issue
// the receipt. Tests never construct a successful production-like receipt by
// hand or replace the native authority validators.
export function m2RendererWriterFixture(t,options={}) {
  const f=m2RendererFixture(t,options),owner='MIDDLE_GEOMETRY',canon='archive/data/meta-foundation/canonical',base=canon+'/packs/middle-geometry';
  const read=p=>JSON.parse(fs.readFileSync(path.join(f.root,p),'utf8'));
  const pt={...f.tables.pt.get('PT_EXISTING'),definition:'Synthetic reviewed primary definition.',sourceUnit:'M2-06',supportingItemCount:1};
  const tpl={...f.tables.tpl.get('TPL_EXISTING'),definition:'Synthetic reviewed procedure definition.',sourceUnit:'M2-06',supportingItemCount:1};
  const binding={...[...f.tables.bindings.values()][0],L1:'Synthetic unit',L2:'Synthetic subunit'};
  const pack={schemaVersion:'meta-foundation-pack-v1',packId:owner,packVersion:'1.0.0',canonicalStatus:'ACTIVE',curricula:['2015'],standardCourses:['중2 수학','M2-2']};
  const canonicalSources=[f.put(base+'/pack.json',pack),f.put(base+'/taxonomy.json',{status:'ACTIVE',problemTypes:[pt],templates:[tpl]}),
    f.put(base+'/bindings.json',{status:'ACTIVE',bindings:[binding]}),f.put(base+'/aliases.json',{aliases:[]}),
    f.put(canon+'/condition_registry.json',{schemaVersion:'meta-foundation-condition-registry-v1',status:'ACTIVE',owner:'CONDITION_CORE',conditions:[],conditionCount:0}),
    f.put(canon+'/metadata_rules.json',{status:'ACTIVE',integrationPatterns:['NONE']})];
  f.put(canon+'/registry_index.json',{status:'ACTIVE',activePacks:[{id:owner,version:'1.0.0',status:'ACTIVE'}],activeConceptShards:[],
    conditionRegistry:{id:'CONDITION_CORE',version:'1',status:'ACTIVE'},canonicalSources,
    compiledArtifacts:['aliases','concept_registry','condition_registry','curriculum_bindings','taxonomy_registry','meta_foundation_compiled'].map(n=>({path:`archive/data/meta-foundation/compiled/${n}.json`}))});
  f.put('archive/data/master_tables/js_archive_tag_master.json',[
    {key:'M2-06',keyType:'standardUnitKey',status:'active',labelKo:'Synthetic unit'},
    {key:'M2-06-RATIO',keyType:'subUnitKey',status:'active',parentKey:'M2-06',labelKo:'Synthetic subunit'}]);
  const metadata={...f.args.metadata,questionUid:'uid1',sourceArchiveFile:f.request.sourceArchiveFile,sourceOrdinal:1,sourceQuestionNo:'1',reviewStatus:'review_required'},
    identity={questionUid:'uid1',sourceArchiveFile:f.request.sourceArchiveFile,sourceOrdinal:1,sourceQuestionNo:'1',status:'VERIFIED',sourceFingerprint:metadata.sourceFingerprint};
  f.put('archive/data/question_metadata.json',{records:[metadata],counts:{}});
  f.put('archive/data/question_identity_map.json',{records:[identity]});
  fs.mkdirSync(path.join(f.root,'archive/data/meta-foundation/runtime'),{recursive:true});
  const receiptPath=`archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/${f.request.requestId}.json`;
  const runtimeContext=()=>{
    const current=read('archive/data/question_metadata.json').records[0],identity=read('archive/data/question_identity_map.json').records[0],receipt=read(receiptPath),
      raw=fs.readFileSync(path.join(f.root,f.sourcePath)),registry=loadActiveMetaRegistry(f.root),
      runtimePath=fs.readdirSync(path.join(f.root,'archive/data/meta-foundation/runtime')).filter(p=>p.endsWith('.json')).map(p=>'archive/data/meta-foundation/runtime/'+p).find(p=>read(p).records?.some(r=>r.questionUid==='uid1')),
      runtime=read(runtimePath),nativeSource={root:f.root,bytes:raw,blobSha1:f.request.expectedSourceBlobSha1,bank:[clone(f.current)],runtimeRecord:runtime.records.find(r=>r.questionUid==='uid1'),runtimeStatus:runtime.status,
        identityByJoin:new Map([[f.request.sourceArchiveFile+'#1',identity]]),identityMap:read('archive/data/question_identity_map.json')};
    return{question:clone(f.current),previous:clone(f.prefigure),current,identity,registry,validate:validateActiveMetaFields,nativeSource,source:f.request.sourceArchiveFile,ordinal:1,runtimeOwner:owner,receipt,receiptPath,runtimePath};
  };
  return Object.assign(f,{read,runtimeContext,receiptPath});
}
