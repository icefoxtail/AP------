import subprocess,pathlib,json,re,hashlib

own=pathlib.Path(__file__).resolve().parent
repo=own.parent/'objects.git'
main='6a46ba70fc619d27262972594142557242810c9f'
git=lambda *a:subprocess.check_output(['git','--git-dir='+str(repo),*a],stderr=subprocess.PIPE)
sha=lambda b:hashlib.sha256(b).hexdigest()
blob=lambda b:hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
rows=[]
old=json.loads((own.parent/'native-provider-collision/exact-inputs.json').read_text())
for line in git('ls-tree','-r','-z',main,'--','.archive-meta-register/inbox').split(b'\0'):
 if not line:continue
 left,p=line.decode().split('\t');oid=left.split()[-1]
 assert '/m3s1-' not in p and '/m3-s1-' not in p
 b=git('cat-file','blob',oid);dest=own/'inputs'/pathlib.Path(p).name
 dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b)
 assert blob(b)==oid
 prior=next((v for v in old['files'] if v['path']==p),None)
 if prior:assert prior['blob']==oid and prior['sha256']==sha(b)
 rows.append({'path':p,'blob':oid,'sha256':sha(b),'local':str(dest),'previous44ByteExact':prior is not None})
canonpath='archive/data/meta-foundation/compiled/curriculum_bindings.json'
cb=git('show',main+':'+canonpath);(own/'compiled-bindings.current.json').write_bytes(cb)
assert cb==(own.parent/'native-provider-collision/compiled-bindings.json').read_bytes()
inp={'schemaVersion':'native-provider-exact-current-inbox-v1','main':main,'files':rows,'count':len(rows),'original44Preserved':sum(r['previous44ByteExact'] for r in rows),'canonical':{'path':canonpath,'blob':blob(cb),'sha256':sha(cb),'local':str(own/'compiled-bindings.current.json')},'sourceContentReads':0}
(own/'current-inbox-inputs.json').write_text(json.dumps(inp,ensure_ascii=False,indent=2)+'\n')
mirror=own/'test-mirror';queue=['tests/archive-pr-native-preview.test.mjs'];done={}
overrides={'tests/archive-pr-native-preview.test.mjs':own/'archive-pr-native-preview.test.mjs','tools/ci/archive-pr-native-preview.mjs':own/'archive-pr-native-preview.mjs'}
while queue:
 p=queue.pop(0)
 if p in done:continue
 assert p.startswith(('tools/','tests/'))
 b=overrides[p].read_bytes() if p in overrides else git('show',main+':'+p)
 dest=mirror/p;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(b)
 done[p]={'path':p,'blob':blob(b),'sha256':sha(b),'reference':'918f912626afd878666d30c556de25468be3008e' if p in overrides else main}
 for rel in re.findall(r"(?:from\s*|import\s*\(|require\s*\()\s*['\"](\.[^'\"]+)['\"]",b.decode()):
  if rel.endswith(('.mjs','.js','.cjs')):
   import posixpath
   queue.append(posixpath.normpath(posixpath.join(posixpath.dirname(p),rel)))
(own/'test-inputs.json').write_text(json.dumps({'main':main,'externalHead':'918f912626afd878666d30c556de25468be3008e','files':list(done.values())},indent=2)+'\n')
api=json.loads((own/'exact-api-inputs.json').read_text());cas=[]
for row in api['files']:
 p=row['filename'];before=git('ls-tree',main,'--',p).decode().strip()
 cas.append({'path':p,'status':row['status'],'beforeGitBlob':before.split()[2] if before else None,'afterGitBlob':row['sha']})
(own/'four-path-cas.json').write_text(json.dumps({'main':main,'externalHead':api['pr']['head']['sha'],'paths':cas,'note':'Exact current main before blobs and external head after blobs; code/request/evidence only. No mutations.'},indent=2)+'\n')
print(json.dumps({'currentRequests':len(rows),'reusedExact44':sum(r['previous44ByteExact'] for r in rows),'testModuleCount':len(done),'inputManifestSha':sha((own/'current-inbox-inputs.json').read_bytes()),'testInputsSha':sha((own/'test-inputs.json').read_bytes()),'casSha':sha((own/'four-path-cas.json').read_bytes())}))
