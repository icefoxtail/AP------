import pathlib,hashlib,json,subprocess,copy

own=pathlib.Path(__file__).resolve().parent;repo=own.parent/'objects.git'
sha=lambda b:hashlib.sha256(b).hexdigest()
git=lambda *a:subprocess.check_output(['git','--git-dir='+str(repo),*a],stderr=subprocess.PIPE)
read=lambda n:json.loads((own/n).read_text())
ref=lambda n:{'path':str(own/n),'sha256':sha((own/n).read_bytes())}
base='6a46ba70fc619d27262972594142557242810c9f';newbase='318be2389960aac0810039f6d9ab3dba2fedab6b'
fixture=read('exact-selector-fixture.json');result=read('official-selector-result.json')
actualdelta=git('diff','--name-only',base,newbase).decode().splitlines()
assert len(actualdelta)==14
protected=set(r['path'] for r in fixture['materializedInputs'])|{r['path'] for r in fixture['changes']}|{r['path'] for r in read('test-inputs.json')['files']}|{'archive/data/question_metadata.json','archive/data/question_identity_map.json','archive/data/meta-foundation/compiled/curriculum_bindings.json'}
assert not set(actualdelta)&protected
treechanges=git('diff','--no-renames','--name-only',base,fixture['localCommit']).decode().splitlines()
assert sorted(treechanges)==sorted(r['path'] for r in fixture['changes'])
for r in fixture['changes']:
 if r['afterGitBlob'] is None:assert not git('ls-tree',fixture['localCommit'],'--',r['path']).strip()
git('diff','--check',base,fixture['localCommit'])
continuity={'schemaVersion':'native-selector-input-continuity-v1','testedBase':base,'rootPublicationBase':newbase,'changedPaths':actualdelta,'protectedInputPaths':sorted(protected),'changedProtectedInputs':[],'metadataGitBlob':git('rev-parse',newbase+':archive/data/question_metadata.json').decode().strip(),'identityGitBlob':git('rev-parse',newbase+':archive/data/question_identity_map.json').decode().strip(),'inboxTreeBefore':git('rev-parse',base+':.archive-meta-register/inbox').decode().strip(),'inboxTreeAfter':git('rev-parse',newbase+':.archive-meta-register/inbox').decode().strip(),'status':'EXACT_INPUT_REUSE_VALID','productionNativeRegistrationClaim':'NONE; generated writer snapshot alone is not an individual receipt'}
assert continuity['inboxTreeBefore']==continuity['inboxTreeAfter']
(own/'root-base-continuity.json').write_text(json.dumps(continuity,ensure_ascii=False,indent=2)+'\n')
before=git('show',base+':tools/ci/archive-pr-native-preview.mjs').decode();after=(own/'archive-pr-native-preview.mjs').read_text()
blocks=[('descriptor','export function nativeRegistryDependencyDescriptor','export function nativeRegistryDependencies'),('dependencyGuard','export function nativeRegistryDependencies','export function orderNativeRequests'),('ordering','export function orderNativeRequests','const emptyObject'),('registrarApplyReplayConsumer','function difficultyResult',None)]
guardproof=[]
for name,start,end in blocks:
 a=before[before.index(start):before.index(end) if end else len(before)];b=after[after.index(start):after.index(end) if end else len(after)];assert a==b,name
 guardproof.append({'block':name,'sha256':sha(a.encode()),'byteIdentical':True})
start='function selectFixedNativeRequests';end='function difficultyResult'
a=before[before.index(start):before.index(end)];b=after[after.index(start):after.index(end)]
b=b.replace('inherited = new Map(), inheritedBindingProviders = new Map()','inherited = new Map()').replace('      ...(inheritedBindingProviders.has(file) ? { inheritedBindingProvider: inheritedBindingProviders.get(file) } : {}),\n','')
assert a==b
guardproof.append({'block':'fixedInputValidation','byteIdenticalAfterRemovingOnlyNewAnnotationAndParameter':True,'sha256':sha(a.encode())})
oldpath=own.parent/'native-provider-collision/inputs/m2s1-binding-20261115-E029-Q7.json'
old=json.loads(oldpath.read_bytes());new=read('E029.external-request.json');normalized=copy.deepcopy(new)
extra={'path':'.archive-meta-register/evidence/m2-binding-provider-reconciliation-20261115/E029-E020.json','sha256':'36d02b18cc95dc78fe075dc7661ac27b95a05d65235cf92989f6cc760a5380e2'}
assert normalized['registryChanges']==[] and len(old['registryChanges'])==1
normalized['registryChanges']=old['registryChanges']
assert normalized['approval']['evidenceRefs'][-1]==extra;normalized['approval']['evidenceRefs'].pop()
assert len(normalized['items'])==1 and normalized['items'][0]['evidenceRefs'][-1]==extra;normalized['items'][0]['evidenceRefs'].pop()
assert normalized==old
assert sha((own/'E029-E020.external-evidence.json').read_bytes())==extra['sha256']
tap=(own/'selector-focused.tap').read_text();assert 'pass 23' in tap and 'fail 0' in tap
review={'schemaVersion':'archive-exact-binding-selector-technical-acceptance-v1','verdict':'ACCEPT_SCOPED_TECHNICAL_ATOMIC_INTEGRATION','testedMain':base,'rootPublicationBase':newbase,'externalPr':2168,'externalHead':'918f912626afd878666d30c556de25468be3008e','m1CandidateSha256':'a5e17a7c3a57c71bf501d17e7655909c04ad82565e34234830f20678aa14ab38','localIntegratedTree':fixture['localTree'],'ownedPaths':15,'technicalFindings':{'exactFourExternalPathsCAS':True,'originalE029ItemValuesApprovalAndEvidencePreserved':True,'e029OnlyChanges':['Remove the one conflicting add-only registryChanges row','Append the exact reconciliation evidence ref to existing approval and item'],'registryGuardBlocks':guardproof,'changed2OldSelectionMissingBindingItems':5,'retained7BindingCoverageItems':57,'retained7Missing':0,'combinedWholeQueueAmbiguousKeys':0,'officialSelector':result['counts'],'sourceEvidenceRequestByteChangesDuringSelection':0,'existingFocusedTests':{'passed':23,'failed':0,'reusedInputModules':5,'scope':'Existing code regression fixtures; not production Consumer or new math review'}},'evidence':{n:ref(n) for n in ['four-path-cas.json','current-inbox-inputs.json','test-inputs.json','selector-focused.tap','combined-closure-graph.json','exact-selector-fixture.json','official-selector-result.json','prior-ci-failure-excerpts.json','root-base-continuity.json']},'conditions':['Integrate the exact withhold11 request-data candidate atomically with selector/data reconciliation. Do not expose the selector repair before the withheld inputs are excluded.','Root must preserve external author ancestry and serial main ownership, and recheck before blobs if publication base moves.','M1 full7/57 official dry/write/replay/Consumer evidence is a separate required gate. This report does not replace it.','Remote PR CI, actual individual native receipts, target Consumer, and Pages remain required before production PASS.','If adding unchanged Wangun20 to the PR selection, record its exact parsed-input continuity and official request validation separately. The current exact selector result is 9 requests/62 items.'],'nonClaims':{'newMathReview':False,'newSemanticAuthority':False,'productionNativeRegistration':'NOT_RUN_HERE','stageAFallback':'PREPARED_ONLY_UNUSED','stageBOfficialRegistration':'NOT_RUN_HERE','externalRuntimeE070ReceiptDrift':'Separate M3-owned investigation; no guard change here'},'writes':{'source':0,'canonical':0,'otherAgentFiles':0,'remote':0}}
(own/'technical-acceptance.json').write_text(json.dumps(review,ensure_ascii=False,indent=2)+'\n')
names=['technical-acceptance.json','root-base-continuity.json','four-path-cas.json','current-inbox-inputs.json','test-inputs.json','selector-focused.tap','combined-closure-graph.json','exact-selector-fixture.json','official-selector-result.json','prior-ci-failure-excerpts.json','graph-check.mjs','run-official-selector.mjs','prepare-review-inputs.py','prepare-exact-selector-fixture.py','freeze-technical-review.py']
manifest={'schemaVersion':'archive-selector-review-publishable-proof-v1','status':'FROZEN_LOCAL_NOT_PUBLISHED','owner':'root/ci_m2s2','verdict':review['verdict'],'testedMain':base,'publicationBaseContinuity':newbase,'externalHead':review['externalHead'],'localIntegratedTree':fixture['localTree'],'files':[{'name':n,**ref(n),'gitBlobSha1':git('hash-object',str(own/n)).decode().strip(),'bytes':(own/n).stat().st_size} for n in names],'sourceOrAnswerPayloadsIncluded':False,'remoteWrites':0}
out=own/'publishable-proof-manifest.json';raw=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n';out.write_text(raw)
for r in manifest['files']:assert sha(pathlib.Path(r['path']).read_bytes())==r['sha256']
assert out.read_text()==raw
print(json.dumps({'verdict':review['verdict'],'acceptance':ref('technical-acceptance.json'),'publishableManifest':ref('publishable-proof-manifest.json'),'files':len(names),'rootBaseContinuity':ref('root-base-continuity.json'),'localTree':fixture['localTree'],'tests':'23/23','officialSelector':result['counts']},ensure_ascii=False))
