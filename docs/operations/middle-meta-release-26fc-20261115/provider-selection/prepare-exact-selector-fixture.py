import subprocess,pathlib,json,hashlib,os

own=pathlib.Path(__file__).resolve().parent
repo=own.parent/'objects.git';base='6a46ba70fc619d27262972594142557242810c9f'
external='918f912626afd878666d30c556de25468be3008e'
sha=lambda b:hashlib.sha256(b).hexdigest()
def git(*a,input=None,env=None):return subprocess.check_output(['git','--git-dir='+str(repo),*a],input=input,env=env,stderr=subprocess.PIPE)
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
mp=pathlib.Path('/workspace/scratch/26fc42390a50/m1-work/.tmp/pr2141-authority-correction/withhold-eleven-current-main-028d28c/candidate-manifest.json')
m1=json.loads(mp.read_text());assert sha(mp.read_bytes())=='a5e17a7c3a57c71bf501d17e7655909c04ad82565e34234830f20678aa14ab38'
api=json.loads((own/'exact-api-inputs.json').read_text())
extfiles={
 'tools/ci/archive-pr-native-preview.mjs':own/'archive-pr-native-preview.mjs',
 'tests/archive-pr-native-preview.test.mjs':own/'archive-pr-native-preview.test.mjs',
 '.archive-meta-register/inbox/m2s1-binding-20261115-E029-Q7.json':own/'E029.external-request.json',
 '.archive-meta-register/evidence/m2-binding-provider-reconciliation-20261115/E029-E020.json':own/'E029-E020.external-evidence.json',
}
for row in api['files']:assert blob(extfiles[row['filename']].read_bytes())==row['sha']
index=own/'integrated-tree.index';assert not index.exists()
env={**os.environ,'GIT_INDEX_FILE':str(index)}
git('read-tree',base,env=env);changes=[]
for p,local in extfiles.items():
 b=local.read_bytes();oid=git('hash-object','-w','--stdin',input=b).decode().strip();before=git('ls-tree',base,'--',p).decode().strip();
 git('update-index','--add','--cacheinfo','100644',oid,p,env=env)
 changes.append({'path':p,'source':'external2168','beforeGitBlob':before.split()[2] if before else None,'afterGitBlob':oid,'afterSha256':sha(b)})
for c in m1['changes']:
 p=c['path'];before=git('ls-tree',base,'--',p).decode().strip();beforeoid=before.split()[2] if before else None
 if c['action']!='add':assert beforeoid==c['beforeGitBlobSha1']
 else:assert beforeoid is None
 if c['action']=='delete':
  git('update-index','--index-info',input=('0 '+('0'*40)+'\t'+p+'\n').encode(),env=env);changes.append({'path':p,'source':'M1withhold11','beforeGitBlob':beforeoid,'afterGitBlob':None});continue
 b=(mp.parent/c['candidateFile']).read_bytes();assert sha(b)==c['afterSha256'];assert blob(b)==c['afterGitBlobSha1']
 oid=git('hash-object','-w','--stdin',input=b).decode().strip();git('update-index','--add','--cacheinfo','100644',oid,p,env=env)
 changes.append({'path':p,'source':'M1withhold11','beforeGitBlob':beforeoid,'afterGitBlob':oid,'afterSha256':sha(b)})
tree=git('write-tree',env=env).decode().strip()
commit=git('-c','user.name=Archive bounded verification','-c','user.email=archive-local-verification@example.invalid','commit-tree',tree,'-p',base,input=b'Local selector integration verification only; no remote publication.\n').decode().strip()
fixture=own/'selector-fixture';assert not fixture.exists()
git('worktree','add','--detach','--no-checkout',str(fixture),commit)
inp=json.loads((own/'current-inbox-inputs.json').read_text());candidates={};materialized=[]
for row in inp['files']:
 p=row['path']
 if any(c['path']==p and c['afterGitBlob'] is None for c in changes):continue
 raw=git('show',commit+':'+p);dest=fixture/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(raw);candidates[p]=json.loads(raw)
 materialized.append({'path':p,'gitBlob':blob(raw),'sha256':sha(raw),'kind':'request'})
def preservation(r):
 a=r.get('approval',{});rb=a.get('sourceRebind',{});items=r.get('items',[])
 return r.get('schemaVersion')=='archive-reviewed-exam-meta-register-request-v2' and r.get('scope')=='PARTIAL_UIDS' and r.get('registrationMode') is None and not r.get('registryChanges') and a.get('type')=='FINAL_QA' and a.get('metadataReviewed') is True and list(rb)==['priorReceiptRef'] and items and all(i.get('before')=={} and i.get('after')=={} and 'rebind' not in i and 'sourceReview' not in i for i in items)
graph=json.loads((own/'combined-closure-graph.json').read_text())
selected=graph['changed2PlusE029NewClosureAfterDataFix']['paths']
inherited=[p for p,r in candidates.items() if preservation(r)];selected=list(dict.fromkeys(selected+inherited))
inputs=set()
for p in selected:
 r=candidates[p];source='archive/exams/'+r['sourceArchiveFile'];assert '/middle/m3/1' not in source
 assert git('rev-parse',commit+':'+source).decode().strip()==r['expectedSourceBlobSha1']
 inputs.add(source)
 lists=[r['approval']['evidenceRefs']]+[i['evidenceRefs'] for i in r['items']]+[i['evidenceRefs'] for i in r.get('registryChanges',[])]
 for refs in lists:
  for ref in refs:
   raw=git('show',commit+':'+ref['path']);assert sha(raw)==ref['sha256'],ref['path'];inputs.add(ref['path'])
for p in sorted(inputs):
 raw=git('show',commit+':'+p);dest=fixture/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(raw)
 materialized.append({'path':p,'gitBlob':blob(raw),'sha256':sha(raw),'kind':'source' if p.startswith('archive/exams/') else 'evidence'})
result={'schemaVersion':'exact-combined-selector-fixture-v1','baseMain':base,'externalHead':external,'withholdCandidateSha256':sha(mp.read_bytes()),'localTree':tree,'localCommit':commit,'localCommitNote':'Own detached validation only; one base parent. Root owns final remote parent topology.','fixture':str(fixture),'changes':changes,'expectedBindingClosurePaths':graph['changed2PlusE029NewClosureAfterDataFix']['paths'],'inheritedPreservationPaths':inherited,'expectedSelectedPaths':sorted(selected),'materializedInputs':materialized,'sourceChanges':0,'canonicalChanges':0,'newApprovals':0,'remoteWrites':0}
raw=json.dumps(result,ensure_ascii=False,indent=2)+'\n';(own/'exact-selector-fixture.json').write_text(raw)
print(json.dumps({'manifest':str(own/'exact-selector-fixture.json'),'sha256':sha(raw.encode()),'localTree':tree,'localCommit':commit,'ownedPaths':len(changes),'selectedRequests':len(selected),'materialized':len(materialized),'sourceFiles':sum(m['kind']=='source' for m in materialized),'inheritedPreservationRequests':len(inherited)}))
