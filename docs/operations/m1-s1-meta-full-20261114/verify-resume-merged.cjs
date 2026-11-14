// Read-only integration/binding gate. This is not a solution or release validator.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert');
const root=path.resolve(__dirname,'../../..'), op='docs/operations/m1-s1-meta-full-20261114';
const bytes=p=>fs.readFileSync(path.join(root,p)), read=p=>JSON.parse(bytes(p));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const eq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
(async()=>{
 const progress=read(op+'/progress.json'),r=read(op+'/residual/merged-registry-proposals.json'),d=read(op+'/residual/merged-item-decisions.json');
 const loc=read(op+'/residual/artifact-path-map.json'),inputMap=new Map(),loaded=new Map();
 for(const x of loc.artifacts){assert(!inputMap.has(x.artifactId));inputMap.set(x.artifactId,x);assert.equal(sha(bytes(x.repositoryPath)),x.sha256,x.repositoryPath);loaded.set(x.artifactId,read(x.repositoryPath));}
 for(const file of [r,d])for(const x of file.inputArtifactManifest){assert.equal(inputMap.get(x.artifactId)?.sha256,x.sha256);}
 assert.equal(inputMap.size,69);
 const uids=progress.exams.flatMap(e=>e.questionUids),uidSet=new Set(uids);
 assert.equal(uids.length,286);assert.equal(uidSet.size,286);assert(eq(d.items.map(x=>x.questionUid),uids));
 assert(eq(d.orderedUidInventory.questionUids,uids));assert.equal(d.examInputs.length,12);
 let off=0;
 for(const e of progress.exams){
  assert.equal(sha(bytes(e.sourcePath)),e.sourceCurrentSha256);
  const receipt=read(op+'/exams/'+path.basename(e.sourcePath,'.js')+'/residual-checks.json');
  assert.equal(receipt.currentSourceSha256,e.sourceCurrentSha256);
  for(const [name,hash]of Object.entries(receipt.artifactHashes))assert.equal(sha(bytes(op+'/exams/'+path.basename(e.sourcePath,'.js')+'/'+name)),hash);
  for(let i=0;i<e.questionCount;i++){const it=d.items[off+i];assert.equal(it.ordinal,i+1);assert.equal(it.sourceOnly,e.sourceOnly);assert.equal(it.sourceVersionBindingRef.currentSourceByteSha256,e.sourceCurrentSha256);}
  off+=e.questionCount;
 }
 const {loadActiveMetaRegistry}=await import(require('url').pathToFileURL(path.join(root,'archive/tools/meta-foundation/active-registry.mjs')).href);
 const active=loadActiveMetaRegistry(root);assert.equal(active.status,'ACTIVE');assert.deepStrictEqual(active.errors,[]);
 const activeMap=new Map([...active.problemTypes,...active.templates,...active.conditions,...active.concepts]);
 const proposed=new Map();
 for(const group of ['proposedProblemTypes','proposedTemplates','proposedConditions'])for(const x of r[group]){
  assert(!proposed.has(x.key));assert(!activeMap.has(x.key),'Proposal must not overwrite ACTIVE '+x.key);proposed.set(x.key,x);
  assert.equal(x.registrationStatus,'UNREGISTERED_ROOT_INTEGRATED_PROPOSAL');assert(x.definitionDraft?.trim());assert(x.differenceFromExisting?.trim());
  assert(x.supportingQuestionUids.length);if(group!=='proposedConditions')assert(x.finalCandidateSupportUids.length);for(const uid of [...x.supportingQuestionUids,...x.finalCandidateSupportUids])assert(uidSet.has(uid));
 }
 const definition=k=>proposed.get(k)||activeMap.get(k);
 for(const x of r.proposedTemplates){assert(definition(x.parentProblemTypeKey));assert(x.parentProblemTypeKey.startsWith('PT_'));}
 for(const x of r.activeDefinitionsReused){const a=activeMap.get(x.key);assert(a,x.key);assert.equal(a.status,'ACTIVE');assert.equal(a.definition,x.definition);assert.equal(a.ownerPack,x.ownerPack);assert.equal(a.parentProblemTypeKey??null,x.parentProblemTypeKey??null);}
 const aliases=new Map(r.proposalAliases.map(x=>[x.aliasKey,x.representativeKey]));assert.equal(aliases.size,r.proposalAliases.length);
 for(const [k,v]of aliases){assert(!activeMap.has(k),'No silent ACTIVE alias rewrite '+k);assert(definition(v));let at=k,seen=new Set();while(aliases.has(at)){assert(!seen.has(at),'Alias cycle');seen.add(at);at=aliases.get(at);}}
 const bindingFields=['curriculum','standardCourse','standardUnitKey','subUnitKey','ownerPack','problemTypeKey'];
 let bindingCount=0,candidateCount=0,withheld=0,sourceOnly=0;const bindingStatuses={};
 const checkCandidate=c=>{
  candidateCount++;assert(definition(c.problemTypeKey));assert(definition(c.templateKey));assert(!aliases.has(c.problemTypeKey));assert(!aliases.has(c.templateKey));
  assert.equal(definition(c.templateKey).parentProblemTypeKey,c.problemTypeKey);
  assert.equal(c.releaseReady,false);assert.equal(c.projectionStatus,'NOT_APPLIED');
  for(const [key,status]of [[c.problemTypeKey,c.problemTypeStatus],[c.templateKey,c.templateStatus]])assert.equal(status,proposed.has(key)?'UNREGISTERED_ROOT_INTEGRATED_PROPOSAL':'ACTIVE');
 };
 for(const it of d.items){
  assert.equal(it.sourceProjectionApplied,false);assert.equal(it.canonicalRegistrationPerformed,false);assert.equal(it.officialResolverPassClaimed,false);
  if(it.finalCandidate)checkCandidate(it.finalCandidate);else{withheld++;assert.equal(it.decisionMode,'SELECTABLE_PART_CANDIDATES_NO_SINGLE_PRIMARY');assert.equal(it.partCandidates.length,3);}
  for(const c of it.partCandidates)checkCandidate(c);
  if(it.sourceOnly){sourceOnly++;assert.equal(it.methodEvidenceStatus,'SOURCE_ONLY_METHOD_EMPTY');}
  for(const q of it.exactBindingRequests){bindingCount++;bindingStatuses[q.status]=(bindingStatuses[q.status]||0)+1;
   const exact=active.bindingRows.filter(x=>x.status==='ACTIVE'&&bindingFields.every(f=>x[f]===q.target[f]));
   assert.equal(exact.length,q.existingExactCount,'Exact binding count '+it.exam+' #'+it.ordinal);
   if(q.status==='ACTIVE_EXACT_BINDING_REUSE_CANDIDATE')assert(exact.length>0);
   else assert.equal(exact.length,0);
   if(q.status==='REGISTER_PARENT_THEN_BIND')assert(proposed.has(q.target.problemTypeKey));
  }
 }
 assert.equal(sourceOnly,193);assert.equal(withheld,2);assert.equal(candidateCount,290);
 let refs=0;
 function walk(x){if(!x||typeof x!=='object')return;if(x.artifactId){assert(inputMap.has(x.artifactId),'Unknown artifact '+x.artifactId);refs++;if(x.jsonPointer){assert(x.jsonPointer.startsWith('/'));let target=loaded.get(x.artifactId);for(const p of x.jsonPointer.slice(1).split('/').map(p=>p.replaceAll('~1','/').replaceAll('~0','~'))){assert(target!=null&&Object.prototype.hasOwnProperty.call(target,p),'Missing pointer '+x.artifactId+x.jsonPointer);target=target[p];}}}for(const v of Object.values(x))if(v&&typeof v==='object')walk(v);}
 walk(r);walk(d);
 const topics=read(op+'/topics-resume.json');assert.equal(topics.totals.questionCount,286);assert.equal(topics.totals.reviewCandidateBucketCounts.UNKNOWN,3);
 for(const x of topics.evidenceRefs){assert.equal(sha(bytes(x.reviewPath)),x.reviewSha256);assert.equal(sha(bytes(x.independentReviewPath)),x.independentReviewSha256);const m=loc.artifacts.find(z=>z.observedWorkerPath===x.residualWorkerPath);assert(m);assert.equal(m.sha256,x.residualSha256);}
 const report={schemaVersion:'m1-s1-root-resume-integration-validation-v1',taskId:progress.taskId,status:'STRUCTURAL_AND_EXACT_BINDING_CHECKS_PASSED',qualityStatus:'NOT_A_FULL_SEMANTIC_OR_RELEASE_PASS',
  counts:{exams:12,uids:286,sourceOnly,existingSolution:93,singleCandidates:284,withheldSingleProjection:withheld,partCandidates:6,proposedProblemTypes:r.proposedProblemTypes.length,proposedTemplates:r.proposedTemplates.length,proposedConditions:r.proposedConditions.length,activeDefinitions:r.activeDefinitionsReused.length,aliasKeys:aliases.size,aliasRepresentatives:new Set(aliases.values()).size,mergeDecisions:r.mergeDecisions.length,semanticOverrides:r.semanticOverrides.length,leafProposalGroups:r.leafProposalGroups.length,bindingContexts:bindingCount,bindingStatuses,inputHashes:inputMap.size,artifactReferencesChecked:refs},
  artifactPathMap:op+'/residual/artifact-path-map.json',mutableProgressInputPreservedAs:'residual/merge-input-progress.json',
  sourceEditsThisResume:0,originalWorkerProposalFilesEdited:false,registryWrites:false,officialResolver:'NOT_RUN_PREREQUISITE_APPROVAL_PENDING',
  inputHashes:{mergedRegistry:sha(bytes(op+'/residual/merged-registry-proposals.json')),mergedItems:sha(bytes(op+'/residual/merged-item-decisions.json')),artifactPathMap:sha(bytes(op+'/residual/artifact-path-map.json'))},failures:[]};
 if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,...report.counts,failures:0}));
})().catch(e=>{console.error(e.stack);process.exit(1);});
