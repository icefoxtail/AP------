#!/usr/bin/env node
'use strict';
// Read-only actual-input gate. Only an isolated source47 fixture is mutable.
const fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const crypto=require('node:crypto'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {pathToFileURL}=require('node:url');
const CONFIG={
  "schemaVersion": "archive-m2-problem21-current-eight-scoped-gate-v1",
  "repository": "icefoxtail/AP------",
  "branch": "refs/heads/ops/m2-closed8-current-native-26fc-20261117",
  "job": "closed8-existing-authority",
  "visualAncestor": "aeabffcc23c70286f7862d69e815080c13490ad0",
  "primaryAncestor": "55768e7fe4c3cba8e30a814fed65c384abe24838",
  "bindingRef": {
    "commit": "aeabffcc23c70286f7862d69e815080c13490ad0",
    "path": "docs/operations/m2-closed8-current-ui-26fc-20261117/run-44023454159/current-eight-ui-binding-v1.json",
    "gitBlobSha1": "b92038ba35288cad66b5eac34c4fe1de05b10ec4",
    "sha256": "7eb531af870bce1b595a4946b671be04bcf455bc64109783e1af2104e905cee9",
    "bytes": 57478
  },
  "files": [
    {
      "path": "archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs",
      "gitBlobSha1": "7a2cc6c166deef9d2664f8d4ff29835c3854ea3d",
      "sha256": "c1fcd1eacfcb5a1737396bbf3433028a60af6346ef4fe24e0b3d2c04e4615079",
      "bytes": 68629
    },
    {
      "path": "archive/tools/meta-foundation/auto-register-merged-source.mjs",
      "gitBlobSha1": "ecdb4e5f371fa6209ded457875b3825266fe3d6d",
      "sha256": "bf65bb230cee48815e7900b6340544d2e98fa62f67379b912163b43403a2ffaa",
      "bytes": 62457
    },
    {
      "path": "archive/tools/meta-foundation/native-reviewed-source-reuse.mjs",
      "gitBlobSha1": "616f7882d8891b7a28369fe29292448d1c853b1b",
      "sha256": "21e767f267c691722535dd70b345cb10e1fb4ce236b309027e18a9643e2b4b2b",
      "bytes": 58987
    },
    {
      "path": "archive/tools/meta-foundation/reviewed-source-reassessment.mjs",
      "gitBlobSha1": "67a469c022bf3e04049723098d659b025eaa9c88",
      "sha256": "9efe04730bf2e2d54081a9c255c0d1d6e6de6926826cddf7db28e36b8658da46",
      "bytes": 37364
    },
    {
      "path": "archive/tools/meta-foundation/reviewed-m2-native-rpm-course.mjs",
      "gitBlobSha1": "8a5fce2336624f24866ba32133a92aabdc25b52e",
      "sha256": "f4a4581b14aa3c370fc288184b7876e7493a2340fa1ce570365572f6cac8d09d",
      "bytes": 42180
    },
    {
      "path": "archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs",
      "gitBlobSha1": "6ccd3d6206066b3bf92ff8efd5325caac6eb8a4a",
      "sha256": "2789a6cef60317f31dd54cad54ce3fa3a59a1ae153965ddcaaf737c81bf130b1",
      "bytes": 42180
    },
    {
      "path": "tools/4slot/registered-renderer-continuity.mjs",
      "gitBlobSha1": "7e158a33f81f251f1121f1ba5f049a1a32cb3995",
      "sha256": "58a739ddabe0de54df95a00dce82f38c7d5f5fd14894d19b76ed036da648188b",
      "bytes": 21832
    },
    {
      "path": "tools/4slot/registered-renderer-continuity.cjs",
      "gitBlobSha1": "22ab86e4198ed84612296b25983d9831424abb39",
      "sha256": "6e8f86e104507b785857b0d2586ee41cd03ee88f05489ed9c207c396fdaa51aa",
      "bytes": 5345
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q04.json",
      "gitBlobSha1": "b0c1aa4f63623f9dfa823a8757e3b70739b3a451",
      "sha256": "dc8e6c1ade7d686e5c45a2337930da40a299bbef1f84dff148dc8a563339eea8",
      "bytes": 2274
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q05.json",
      "gitBlobSha1": "206d489d2ea9d733dc7eca1c311f342f3937bd79",
      "sha256": "dfb4a2e55221b4cffeecc711981a7b65566feb58e2e9873b65329d4c8e663145",
      "bytes": 2274
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q09.json",
      "gitBlobSha1": "db6ed5eb4c67c82f963dc63119650580a3a5ff9a",
      "sha256": "6067620c3571b81e0e5a8f8d7e5f36d77596ce80fdecf1aad26eb13cc3d205fc",
      "bytes": 2274
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q18.json",
      "gitBlobSha1": "03647587169a9341581b7896e8b4382ec0677211",
      "sha256": "1d6bda54762aafbab2fe3e5dfeb1e513b2ee2d654d0a825b5a19d0cd474b532b",
      "bytes": 2277
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q20.json",
      "gitBlobSha1": "26df64265146e0dd7eb2e9a7eed0f340a6782980",
      "sha256": "c7b5f83ac0b05400f7ed49d4b7adc3462575b0f1b4f4885684605d6cd99fe864",
      "bytes": 2277
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e017-q23.json",
      "gitBlobSha1": "9efd42692ade9230e6cf5aa66a5bbfbf2f6a9e8f",
      "sha256": "b9ecfefe70567e2c4c9bd891c81c45bcf5882092fe1abcc46d0b8acd0c24972d",
      "bytes": 2277
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e023-q06.json",
      "gitBlobSha1": "07d087288ef915ada881a02651ec12b1ee65707d",
      "sha256": "30cc3bcb06e635aee4cd689a6eb6a43c5e769cecfaa41b5c9947bd969a1b50ca",
      "bytes": 2294
    },
    {
      "path": ".archive-meta-register/4slot-renderer-continuity/m2s2-problem21-issued-eight-20261116-e023-q10.json",
      "gitBlobSha1": "594010ff306345d8ab5205df5be6be6bc0483d01",
      "sha256": "1e69d9a3decc92209acd464758b1368f02c3a0d5298f663ff9a94eacf66343bd",
      "bytes": 2297
    },
    {
      "path": "docs/operations/m2-problem-image8-repair-20261116/independent-static-v2.json",
      "gitBlobSha1": "e639a869d01437e872c9355b57df69065ed30d65",
      "sha256": "3dd0395907a7e047382619832af91e898ca740c7ed712764762ee8099eec7d89",
      "bytes": 11292
    }
  ],
  "generatorGitBlobSha1": "42ebd4cf0d285b4e5d7df2ccf7c1d3bfa4a54e86"
};

const MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const SVG='archive/data/svg-accessibility-index.js',INDEX='archive/data/item-4slot-index.json';
const RUNTIME='archive/data/meta-foundation/runtime',DIR='.archive-meta-register/4slot-renderer-continuity';
const OID=/^[a-f0-9]{40}$/,HASH=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=v=>crypto.createHash('sha256').update(v).digest('hex'),whole=v=>sha(stable(v));
const blob=v=>crypto.createHash('sha1').update('blob '+v.length+'\0').update(v).digest('hex');
const json=v=>Buffer.from(JSON.stringify(v)+'\n');
function need(ok,code){if(!ok)throw Error('M2_CURRENT8_SCOPE_'+code);}
function safeRelative(p){
  need(typeof p==='string'&&p.length>0&&!path.isAbsolute(p)&&!/[\\\x00-\x1f\x7f]/.test(p)&&
    !p.split('/').some(x=>!x||x==='.'||x==='..'),'PATH');return p;
}
// Untrusted diagnostic/output paths are not repository dependencies. Immutable
// refs have already passed refShape; explicitly required paths retain validation.
function dependencyPath(p,required=false){
  if(typeof p!=='string')return false;
  // These exact two current renderer dependencies are declared by authenticated
  // served-file refs. They are not optional diagnostic/output paths.
  const closedNavigation=required&&['apmath/css/student-navigation.css','apmath/js/student-navigation.js'].includes(p);
  const supported=closedNavigation||/^(?:(?:archive|tools|tests|docs)\/|\.archive-meta-register\/(?:evidence|4slot-[^/]+)\/)/.test(p);
  if(!supported&&!required)return false;
  safeRelative(p);return supported;
}
// These five documents are historical-only inputs in the original validators.
// Their live aliases/wrappers retain the existing current-file checks.
const HISTORICAL_ONLY_PROOFS=Object.freeze([
  {
    "commit": "e0c968d539ea5d76ce134c38956a32bc280989fe",
    "path": "docs/operations/m2-problem-image8-repair-20261116/independent-static-v1.json",
    "gitBlobSha1": "c37c57e7b5993d2431b6e1399529c86b3bdd06b6",
    "sha256": "f608d253890e072e79ed6bc4dcabfb98e9058fcfc4dc60641bf57736f8eff7fb",
    "bytes": 4127
  },
  {
    "commit": "c28641f67d91bfb27352b11faaef4552f46c45be",
    "path": "archive/data/meta-review/m2-s2-20261114/exams/E023/review.json",
    "gitBlobSha1": "eb54e18c3146e611f20018859e48bdb3e74cf970",
    "sha256": "7da03aa90ef0e8e7f363dab0e8dc482291683471a6087cde27c650fa4abc6e07",
    "bytes": 118816
  },
  {
    "commit": "1244785eb4889e9c6a6ebdbca3b57c5e9ef53a67",
    "path": "docs/operations/m2-s2-e023-solution-display6-continuity-20261116/independent-static-v1.json",
    "gitBlobSha1": "245578b48da7b0cc0a5c3a4e0048e7e2590080a5",
    "sha256": "458cbdde5842e97dc8f542fe03d74da36ab4c1bde95d2b1e8e274c7e6a109be7",
    "bytes": 17215
  },
  {
    "commit": "6d011ffd05eb2581c41a4119121cdc0009dcfc99",
    "path": "docs/operations/m2-s2-e023-solution-ui-20261116/student-ui-technical-r4.json",
    "gitBlobSha1": "b0829009e77805a070e6771939b5efa98ce1cec2",
    "sha256": "2059ecf6f667676bbd07a1b04e3928ed219ba578dd3a6c7ceb33bc1d04b408ed",
    "bytes": 22874
  },
  {
    "commit": "4c7227ba795225da1d389f6852793bbe0f1bf54c",
    "path": "docs/operations/m2-s2-e023-solution-ui-20261116/student-ui-independent-r4.json",
    "gitBlobSha1": "968135fc29dfa64d3c9b3300c9e8b6eeb0ab599f",
    "sha256": "82934951f72d9b35c4ba785c3fd1eda35daddc2cba4e0de6450b2450bea1ba20",
    "bytes": 4824
  }
].map(Object.freeze));
function historicalProofRef(ref){
  const expected=HISTORICAL_ONLY_PROOFS.find(r=>r.path===ref?.path);
  if(!expected)return false;
  need(stable(refShape(ref))===stable(expected),'HISTORICAL_PROOF_PIN');return true;
}
function file(root,p){
  let at=root;for(const part of safeRelative(p).split('/')){
    at=path.join(at,part);need(!fs.lstatSync(at).isSymbolicLink(),'SYMLINK');
  }need(fs.statSync(at).isFile(),'REGULAR_FILE');return at;
}
function git(root,args,options={}){
  const env={...process.env,GIT_OPTIONAL_LOCKS:'0'};delete env.GIT_NO_LAZY_FETCH;
  return execFileSync('git',args,{cwd:root,env,maxBuffer:160*1024*1024,timeout:180000,
    stdio:['ignore','pipe','pipe'],...options});
}
function pin(raw,ref){
  need(raw.length===ref.bytes&&blob(raw)===ref.gitBlobSha1&&sha(raw)===ref.sha256,'RAW_GIT_PIN');
}
function refShape(ref){
  need(ref&&OID.test(ref.commit||'')&&OID.test(ref.gitBlobSha1||'')&&HASH.test(ref.sha256||'')&&
    Number.isSafeInteger(ref.bytes)&&ref.bytes>0&&ref.bytes<=128*1024*1024,'IMMUTABLE_REF');
  safeRelative(ref.path);return Object.fromEntries(['commit','path','gitBlobSha1','sha256','bytes'].map(k=>[k,ref[k]]));
}
function safeFailure(e){
  const message=String(e?.message||e),match=/^([A-Z][A-Z0-9_:|+-]{0,160})/.exec(message);
  return{code:match?match[1]:'UNCLASSIFIED_FAILURE',messageSha256:sha(message)};
}
function proofDocument(p){
  return p.endsWith('.json')&&/^(?:docs\/operations\/|archive\/data\/meta-review\/|archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/|\.archive-meta-register\/evidence\/)/.test(p);
}
function walk(root,p){
  const full=path.join(root,p);if(!fs.existsSync(full))return[];
  need(!fs.lstatSync(full).isSymbolicLink(),'WALK_SYMLINK');
  if(fs.statSync(full).isFile())return[p];
  return fs.readdirSync(full).sort().flatMap(x=>walk(root,p+'/'+x));
}
function provenance(root){
  const e=process.env,head=git(root,['rev-parse','HEAD']).toString().trim();
  need(e.GITHUB_ACTIONS==='true'&&e.GITHUB_EVENT_NAME==='push'&&e.GITHUB_REPOSITORY===CONFIG.repository&&
    e.GITHUB_REF===CONFIG.branch&&e.GITHUB_SHA===head&&e.ARCHIVE_M2_CLOSED8_GATE_EXPECTED_SHA===head&&
    OID.test(head)&&e.GITHUB_JOB===CONFIG.job,'CLOSED_PUSH_PROVENANCE');
  const event=JSON.parse(fs.readFileSync(e.GITHUB_EVENT_PATH,'utf8'));
  need(event.ref===CONFIG.branch&&event.after===head&&event.deleted===false&&
    event.repository?.full_name===CONFIG.repository&&event.repository.fork===false,'CLOSED_PUSH_EVENT');
  need(/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ID||'')&&/^[1-9][0-9]*$/.test(e.GITHUB_RUN_ATTEMPT||''),'RUN');
  need(git(root,['rev-parse','--is-shallow-repository']).toString().trim()==='false','FULL_HISTORY');
  for(const ancestor of [CONFIG.visualAncestor,CONFIG.primaryAncestor])git(root,['merge-base','--is-ancestor',ancestor,head]);
  return{provider:'GITHUB_ACTIONS',eventName:'push',repository:CONFIG.repository,ref:CONFIG.branch,
    checkoutCommit:head,runId:e.GITHUB_RUN_ID,runAttempt:Number(e.GITHUB_RUN_ATTEMPT),job:e.GITHUB_JOB};
}
function writeReport(report,out){
  const raw=Buffer.from(JSON.stringify(report,null,2)+'\n');need(raw.length<=4*1024*1024,'REPORT_SIZE');
  fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,raw);
  const payload=raw.toString('base64'),width=6000,chunks=Math.ceil(payload.length/width);
  const receipt={schemaVersion:'archive-scoped-metadata-log-v1',profile:'M2_CURRENT8_EXISTING_AUTHORITY',
    bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw),chunks};
  console.log('ARCHIVE_SCOPED_REPORT_BEGIN '+JSON.stringify(receipt));
  for(let i=0;i<chunks;i++)console.log('ARCHIVE_SCOPED_REPORT_CHUNK '+JSON.stringify({index:i,data:payload.slice(i*width,(i+1)*width)}));
  console.log('ARCHIVE_SCOPED_REPORT_END '+JSON.stringify(receipt));
}


async function makeFixture(root,head,modules,report){
  const {builder,helper,derived,svgIndex,generator}=modules,items=helper.M2_P21_CURRENT_EIGHT_ITEMS;
  const sources=[...new Set(items.map(i=>i.sourceArchiveFile))],selected=new Set(items.map(i=>i.questionUid));
  const work=fs.mkdtempSync(path.join(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir()),'m2-current8-scope-'));
  const fixture=path.join(work,'fixture');
  git(root,['clone','--quiet','--shared','--no-checkout','--no-hardlinks',root,fixture]);
  const currentInputs=new Map(),immutableInputs=new Map(),privateInputs=new Map(),copied=new Set();
  const queue=[],queued=new Set(),commits=new Set(),optionalMissing=new Set(),historicalRead=new Set();
  function current(p){
    safeRelative(p);const entry=git(root,['ls-tree','-z',head,'--',p]).toString();
    const match=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    need(match&&match[3]===p,'CURRENT_HEAD_PATH');
    const raw=fs.existsSync(path.join(root,p))?fs.readFileSync(file(root,p)):git(root,['cat-file','blob',match[2]]);
    need(blob(raw)===match[2],'CURRENT_HEAD_BYTES');
    const ref={path:p,gitBlobSha1:match[2],sha256:sha(raw),bytes:raw.length},prior=currentInputs.get(p);
    if(prior)need(stable(prior)===stable(ref),'CURRENT_INPUT_CHANGED');
    currentInputs.set(p,ref);return raw;
  }
  function put(p,raw){
    const target=path.join(fixture,safeRelative(p));fs.mkdirSync(path.dirname(target),{recursive:true});
    if(fs.existsSync(target)){need(sha(fs.readFileSync(file(fixture,p)))===sha(raw),'PRIVATE_FILE_CONFLICT');return;}
    fs.writeFileSync(target,raw,{flag:'wx'});copied.add(p);
    privateInputs.set(p,{path:p,bytes:raw.length,sha256:sha(raw),gitBlobSha1:blob(raw)});
  }
  function ensureCommit(commit){
    need(OID.test(commit),'DECLARED_COMMIT');
    if(commits.has(commit))return;
    try{git(fixture,['cat-file','-e',commit+'^{commit}']);}
    catch{git(fixture,['fetch','--quiet','--no-tags','--no-write-fetch-head','https://github.com/'+CONFIG.repository+'.git',commit]);}
    git(fixture,['cat-file','-e',commit+'^{commit}']);commits.add(commit);need(commits.size<=160,'COMMIT_BOUND');
  }
  function immutable(input){
    const ref=refShape(input),key=ref.commit+':'+ref.path;ensureCommit(ref.commit);
    need(git(fixture,['ls-tree','-z',ref.commit,'--',ref.path]).toString()==='100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0','IMMUTABLE_PATH');
    const raw=git(fixture,['cat-file','blob',ref.gitBlobSha1]);pin(raw,ref);
    if(immutableInputs.has(key))need(stable(immutableInputs.get(key))===stable(ref),'IMMUTABLE_CONFLICT');
    immutableInputs.set(key,ref);need(immutableInputs.size<=2400,'IMMUTABLE_BOUND');return raw;
  }
  function enqueue(p,required=false){
    if(!dependencyPath(p,required))return;
    if(!queued.has(p)){queued.add(p);queue.push({path:p,required});}
  }
  function refsIn(value){
    if(Array.isArray(value)){for(const v of value)refsIn(v);return;}
    if(!value||typeof value!=='object')return;
    if(OID.test(value.commit||'')&&OID.test(value.gitBlobSha1||'')&&HASH.test(value.sha256||'')&&Number.isSafeInteger(value.bytes)){
      const raw=immutable(value);
      if(historicalProofRef(value)){
        const key=value.commit+':'+value.path;
        if(!historicalRead.has(key)){
          historicalRead.add(key);
          (report.historicalOnlyInputs||(report.historicalOnlyInputs=[])).push(refShape(value));
          refsIn(JSON.parse(raw));
        }
      }else enqueue(value.path,true);
    }else if(typeof value.path==='string')enqueue(value.path);
    for(const [k,v]of Object.entries(value)){
      if(k==='outputDigests'||k==='path')continue;
      if((k==='reviewCommit'||k==='inputCommit')&&OID.test(v||''))ensureCommit(v);
      else refsIn(v);
    }
  }
  function copy(p,required=false){
    if([MD,ID,SVG,INDEX].includes(p)||p.startsWith(RUNTIME+'/'))return;
    if(p.startsWith('archive/exams/')&&!sources.some(s=>'archive/exams/'+s===p))return;
    if(copied.has(p))return;
    const entry=git(root,['ls-tree','-z',head,'--',safeRelative(p)]).toString();
    if(!entry){if(required)throw Error('M2_CURRENT8_SCOPE_REQUIRED_CURRENT_PROOF_MISSING:'+p);optionalMissing.add(p);return;}
    const raw=current(p);put(p,raw);
    if(proofDocument(p))refsIn(JSON.parse(raw));
  }
  const candidateBytes=new Map(),docs=[];
  for(const item of items){
    const p=item.sidecarRef.path,raw=current(p);pin(raw,item.sidecarRef);const document=JSON.parse(raw);
    need(document.schemaVersion===helper.M2_P21_CURRENT_EIGHT_SCHEMA&&document.questionUid===item.questionUid,'NEW_SIDECAR_SCOPE');
    candidateBytes.set(p,raw);docs.push({item,path:p,raw,document});refsIn(document);
  }
  const actualRaw=current(INDEX),actual=JSON.parse(actualRaw);
  need(actual.schemaVersion===builder.SCHEMA,'ACTUAL_INDEX_SCHEMA');
  const banks=new Map(),compacts=new Map(),priorBanks=new Map();
  for(const source of sources){
    const item=items.find(i=>i.sourceArchiveFile===source),sourceRaw=current(item.currentSourceRef.path);
    pin(sourceRaw,item.currentSourceRef);put(item.currentSourceRef.path,sourceRaw);
    const bank=builder.loadBank(sourceRaw);need(bank.length===item.expectedQuestionCount,'SOURCE_DENOMINATOR');banks.set(source,bank);
    helper.verifyM2Problem21CurrentSourcePair({sourceArchiveFile:source,oldBytes:immutable(item.issuedSourceRef),currentBytes:sourceRaw});
    const doc=docs.find(d=>d.item.sourceArchiveFile===source).document;
    const compactRaw=current(doc.compactRef.path);need(sha(compactRaw)===doc.compactRef.sha256,'COMPACT_PIN');put(doc.compactRef.path,compactRaw);
    const compact=JSON.parse(compactRaw);need(compact.sourceArchiveFile===source&&compact.items?.length===bank.length,'COMPACT_SCOPE');compacts.set(source,compact);
    const priorRaw=git(fixture,['cat-file','blob',compact.sourceGitBlobSha]);need(blob(priorRaw)===compact.sourceGitBlobSha,'COMPACT_SOURCE_PIN');
    const prior=builder.loadBank(priorRaw);need(prior.length===bank.length,'PRIOR_SOURCE_DENOMINATOR');priorBanks.set(source,prior);
    // Read only asset paths; no student text is printed or emitted.
    const text=JSON.stringify(bank).replaceAll('\\/','/');
    for(const match of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))
      copy(match[0].startsWith('archive/')?match[0]:'archive/'+match[0],true);
    for(const entry of compact.items)if(entry.registrationHold)refsIn(entry.registrationHold);
  }
  // Actual whole-file pins and global uniqueness precede the exact source47 view.
  function rows(p){
    const raw=current(p),doc=JSON.parse(raw),uids=new Set(),joins=new Set();
    need(Array.isArray(doc.records),'GLOBAL_DATA_RECORDS');
    for(const row of doc.records){
      const join=stable([row.sourceArchiveFile,row.sourceOrdinal]);
      need(UID.test(row.questionUid||'')&&!uids.has(row.questionUid)&&!joins.has(join),'GLOBAL_DATA_UNIQUENESS');
      uids.add(row.questionUid);joins.add(join);
    }
    const view=doc.records.filter(r=>sources.includes(r.sourceArchiveFile));
    need(view.length===47,'SCOPED_DATA47');put(p,json({...doc,records:view}));return view;
  }
  const metadata=rows(MD),identities=rows(ID),allUids=new Set(identities.map(r=>r.questionUid));
  need(allUids.size===47&&metadata.every(r=>allUids.has(r.questionUid)),'SCOPED_UID_JOIN');
  const runtimes=[];
  for(const p of git(root,['ls-tree','-r','-z','--name-only',head,'--',RUNTIME]).toString().split('\0').filter(p=>p.endsWith('.json'))){
    const doc=JSON.parse(current(p));if(!Array.isArray(doc.records))continue;
    const view=doc.records.filter(r=>allUids.has(r.questionUid));put(p,json({...doc,records:view}));
    for(const row of view)runtimes.push({path:p,status:doc.status,packId:doc.packId,row});
  }
  const states=[];
  for(const source of sources)for(let i=0;i<banks.get(source).length;i++){
    const q=banks.get(source)[i],id=identities.filter(r=>r.sourceArchiveFile===source&&r.sourceOrdinal===i+1);
    need(id.length===1,'SCOPED_SOURCE_IDENTITY');const display=modules.sourceNumber(q),number=modules.sourceIdentityNumber(q);
    need(Number.isSafeInteger(display)&&String(id[0].sourceQuestionNo)===number&&compacts.get(source).items.filter(it=>it.ordinal===display).length===1,'NUMBER_JOIN');
    states.push({questionUid:id[0].questionUid,sourceArchiveFile:source,sourceOrdinal:i+1,sourceQuestionNo:number,
      displayNumber:display,compactPath:'archive/data/item-4slot/'+source.replace(/\.js$/,'.4slot.json')});
  }
  const compactPaths=new Set(states.map(s=>s.compactPath));
  const stateOf=(index,s)=>{
    const records=index.records.filter(r=>r.questionUid===s.questionUid);
    const pending=index.pending.filter(r=>r.path===s.compactPath&&(r.ordinal==null||r.ordinal===s.displayNumber));
    need(records.length<=1&&(records.length===1?pending.length===0:pending.length>0),'STATE_PARTITION');
    if(records.length)need(records[0].sourceArchiveFile===s.sourceArchiveFile&&records[0].sourceOrdinal===s.sourceOrdinal&&
      records[0].sourceQuestionNo===s.sourceQuestionNo,'STATE_IDENTITY');
    return{questionUid:s.questionUid,record:records[0]||null,pending:pending.slice().sort((a,b)=>stable(a).localeCompare(stable(b),'en'))};
  };
  const outside=states.filter(s=>!selected.has(s.questionUid)),outsideActual=outside.map(s=>stateOf(actual,s));
  need(outside.length===39,'OUTSIDE39');
  const actualSelected=states.filter(s=>selected.has(s.questionUid)).map(s=>stateOf(actual,s));
  need(actualSelected.length===8&&actualSelected.every(r=>r.record===null),'ACTUAL_SELECTED_MUST_BE_PENDING');
  const files=actual.files.filter(f=>compactPaths.has(f.path)),records=actual.records.filter(r=>allUids.has(r.questionUid)),
    pending=actual.pending.filter(r=>compactPaths.has(r.path));
  need(files.length===2,'ACTUAL_TWO_COMPACTS');
  const prior={...actual,files,records,pending,counts:{...actual.counts,files:2,items:47,registered:records.length,pending:pending.length}};
  put(INDEX,json(prior));
  report.actualBaseline={index:currentInputs.get(INDEX),globalInputs:[currentInputs.get(MD),currentInputs.get(ID)],
    selectedPending:8,outsideRegistered:outsideActual.filter(s=>s.record).length,outsidePending:outsideActual.filter(s=>!s.record).length,
    outsideWholeSha256:whole(outsideActual),selectedWholeSha256:whole(actualSelected)};

  // Preserve every actual existing sidecar claim in these two source banks.
  // Selected candidate sidecars stay absent for the ordinary baseline build.
  const claimedPaths=new Set();
  const claims=value=>{
    if(Array.isArray(value))return value.forEach(claims);
    if(!value||typeof value!=='object')return;
    if(typeof value.path==='string'&&/^\.archive-meta-register\/4slot-[^/]+\//.test(value.path))claimedPaths.add(value.path);
    for(const [key,v]of Object.entries(value))if(key!=='outputDigests')claims(v);
  };
  claims(files);claims(records);
  const candidates=git(root,['ls-tree','-r','-z','--name-only',head,'--','.archive-meta-register']).toString().split('\0')
    .filter(p=>/^\.archive-meta-register\/4slot-[^/]+\/[^/]+\.json$/.test(p));
  for(const p of candidates)if(allUids.has(path.posix.basename(p,'.json')))claimedPaths.add(p);
  for(const p of [...claimedPaths].sort()){
    if(candidateBytes.has(p))continue;
    const raw=current(p),doc=JSON.parse(raw);
    need(sources.includes(doc.sourceArchiveFile)&&allUids.has(doc.questionUid),'OUTSIDE_CLAIM_SCOPE');
    put(p,raw);refsIn(doc);
  }
  // Read code/registry inputs once, exactly from HEAD; no compile or registrar.
  for(const prefix of ['archive/tools','tools/4slot','archive/data/meta-foundation/canonical','archive/data/meta-foundation/compiled']){
    for(const p of git(root,['ls-tree','-r','-z','--name-only',head,'--',prefix]).toString().split('\0').filter(Boolean)){
      if(prefix.startsWith('archive/data/')||/\.(?:js|mjs|cjs)$/.test(p))copy(p,true);
    }
  }
  copy('archive/data/master_tables/js_archive_tag_master.json',true);
  const binding=JSON.parse(immutable(CONFIG.bindingRef));enqueue(CONFIG.bindingRef.path,true);refsIn(binding);
  const technical=JSON.parse(immutable(binding.currentTechnicalRef));refsIn(technical);
  for(let i=0;i<queue.length;i++){need(i<20000,'PROOF_QUEUE_BOUND');copy(queue[i].path,queue[i].required);}
  // Capture global MD/ID is authenticated by the helper itself. All declared
  // historical refs were fetched above, including original48/51 and Q10 evidence.
  const originalSvg=current(SVG),indexDoc=svgIndex.parseIndex(originalSvg);
  put(SVG,originalSvg);
  const generation=fs.mkdtempSync(path.join(work,'generator-'));
  try{
    git(generation,['init','-q']);
    git(generation,['-c','user.name=Archive scoped gate','-c','user.email=gate@example.invalid','commit','--allow-empty','-qm','scoped immutable generator']);
    const write=(p,b)=>{const target=path.join(generation,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,b);};
    for(const source of sources)write('archive/exams/'+source,fs.readFileSync(file(fixture,'archive/exams/'+source)));
    for(const item of items){const raw=fs.readFileSync(file(fixture,item.currentAssetRef.path));pin(raw,item.currentAssetRef);write(item.currentAssetRef.path,raw);}
    const genRaw=current('archive/tools/build-svg-accessibility-index.cjs');need(blob(genRaw)===CONFIG.generatorGitBlobSha1,'OFFICIAL_GENERATOR');
    const production=generator.productionRows({records:[]},generation,{baseRef:git(generation,['rev-parse','HEAD']).toString().trim(),sourceRoots:[]});
    need(production.scope.sourceRosterFileCount===2&&production.rows.length===8,'GENERATOR_SCOPE8');
    for(const item of items){
      const row=svgIndex.selectEntries({...indexDoc,records:production.rows},[item.currentAssetRef]);
      const priorEntries=svgIndex.selectEntries(indexDoc,[item.currentAssetRef]);
      need(row.length===1&&whole(row[0])===item.derivedRecordSha256,'GENERATOR_WHOLE_RECORD');
      need(priorEntries.length===0||priorEntries.length===1&&whole(priorEntries[0])===item.derivedRecordSha256,'CURRENT_SVG_NOT_OVERWRITTEN');
    }
    const keys=new Set(items.map(i=>i.currentAssetRef.path.slice('archive/'.length)));
    const merged={...indexDoc,records:indexDoc.records.filter(r=>!keys.has(r.assetRef)).concat(production.rows)};
    const encoded=Buffer.from("(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze("+JSON.stringify(merged)+");\n}(typeof window !== 'undefined' ? window : globalThis));\n");
    svgIndex.parseIndex(encoded);fs.writeFileSync(file(fixture,SVG),encoded);
    privateInputs.set(SVG,{path:SVG,bytes:encoded.length,sha256:sha(encoded),gitBlobSha1:blob(encoded)});
    helper.verifyM2Problem21CurrentSvgProjection({capturedBytes:immutable(technical.servedFiles.find(r=>r.path===SVG)),currentBytes:encoded});
    report.generatedSvg={scope:'PRIVATE_OFFICIAL_GENERATED_INPUT_ONLY',generatorGitBlobSha1:CONFIG.generatorGitBlobSha1,
      currentInput:currentInputs.get(SVG),generated8WholeSha256:whole(production.rows),privateIndexSha256:sha(encoded),newApprovals:0};
  }finally{fs.rmSync(generation,{recursive:true,force:true});}
  const checkpoint=[...privateInputs.values()].filter(p=>p.path!==INDEX);
  const assertInputs=()=>{
    for(const expected of checkpoint)pin(fs.readFileSync(file(fixture,expected.path)),expected);
    for(const expected of currentInputs.values())pin(current(expected.path),expected);
    need(git(fixture,['rev-parse','HEAD']).toString().trim()===head,'PRIVATE_HEAD_CHANGED');
  };
  return{work,fixture,items,sources,selected,metadata,identities,runtimes,banks,priorBanks,compacts,states,outside,outsideActual,stateOf,
    prior,candidateBytes,docs,currentInputs,immutableInputs,privateInputs,checkpoint,assertInputs,optionalMissing,technical,binding};
}


async function run(root,out){
  root=fs.realpathSync(root);out=path.resolve(out);
  need(out.startsWith(fs.realpathSync(process.env.RUNNER_TEMP||os.tmpdir())+path.sep),'OUTPUT_LOCATION');
  const report={schemaVersion:CONFIG.schemaVersion,status:'RUNNING',phase:'PROVENANCE',sourceQuestionCount:47,
    selected:8,outside:39,newMathematicalQa:0,newSemanticApprovals:0,newFourSlotVectors:0,
    sourceWrites:0,metadataOrIdentityWrites:0,globalBuilderRun:false,mainWrites:0,screenshotRuns:0};
  let f,rootStatus,head;
  const phase=name=>{report.phase=name;console.log(JSON.stringify({schemaVersion:CONFIG.schemaVersion,phase:name,status:'RUNNING'}));};
  try{
    report.execution=provenance(root);head=report.execution.checkoutCommit;
    rootStatus=git(root,['status','--porcelain=v1','--untracked-files=all']).toString();need(rootStatus==='','ROOT_DIRTY');
    for(const expected of CONFIG.files){
      const raw=fs.readFileSync(file(root,expected.path));pin(raw,expected);
      need(git(root,['rev-parse',head+':'+expected.path]).toString().trim()===expected.gitBlobSha1,'CANDIDATE_HEAD');
    }
    const importAt=p=>import(pathToFileURL(file(root,p)).href);
    const helper=await importAt('archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs');
    const native=await importAt('archive/tools/meta-foundation/native-reviewed-source-reuse.mjs');
    const active=await importAt('archive/tools/meta-foundation/active-registry.mjs');
    const worker=await importAt('tools/4slot/registered-renderer-continuity.mjs');
    const p21=await importAt('archive/tools/meta-foundation/reviewed-m2-problem21-continuity.mjs');
    const builder=require(file(root,'tools/4slot/build-4slot-runtime.cjs')),consumer=require(file(root,'archive/item-4slot.js'));
    const sourceNumbers=require(file(root,'tools/4slot/exam-items.cjs'));
    const svgIndex=require(file(root,'tools/4slot/existing-vector-svg-index-continuity.cjs'));
    const generator=require(file(root,'archive/tools/build-svg-accessibility-index.cjs'));
    phase('AUTHENTICATED_ACTUAL_INPUTS');
    f=await makeFixture(root,head,{builder,helper,derived:p21.M2_PROBLEM21_DERIVED_SVG8_ITEMS,svgIndex,generator,...sourceNumbers},report);
    const outsideSame=(index,label)=>{
      need(index.counts.files===2&&index.counts.items===47&&index.records.length+index.pending.length===47,'OUTPUT_SCOPE47');
      const observed=f.outside.map(s=>f.stateOf(index,s));
      const changed=observed.flatMap((value,i)=>stable(value)===stable(f.outsideActual[i])?[]:[{
        questionUid:value.questionUid,beforeRegistered:!!f.outsideActual[i].record,afterRegistered:!!value.record,
        beforeWholeSha256:whole(f.outsideActual[i]),afterWholeSha256:whole(value),
        beforePending:f.outsideActual[i].pending.map(p=>safeFailure(p.reason)),afterPending:value.pending.map(p=>safeFailure(p.reason))}]);
      report.lastOutsideCheck={phase:label,expectedWholeSha256:whole(f.outsideActual),observedWholeSha256:whole(observed),changed};
      need(changed.length===0,'OUTSIDE39_WHOLE_STATE_CHANGED');
    };
    const observedStable=built=>{for(const [p,sum]of built.observed)need(sha(fs.readFileSync(file(f.fixture,p)))===sum,'BUILD_INPUT_CHANGED');};
    const selectedSummary=index=>f.states.filter(s=>f.selected.has(s.questionUid)).map(s=>{
      const row=f.stateOf(index,s);return{questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,registered:!!row.record,
        wholeRecordSha256:row.record?whole(row.record):null,pending:row.pending.map(p=>safeFailure(p.reason))};
    });
    phase('CURRENT_ORDINARY_BASELINE');
    const before=builder.build(f.fixture,{previous:f.prior,reuseCache:false});observedStable(before);outsideSame(before.index,'BEFORE');
    need(before.index.records.every(r=>!f.selected.has(r.questionUid)),'BASELINE_SELECTED_NOT_REFUSED');
    report.before={counts:before.index.counts,selected:selectedSummary(before.index),outsideWholeSha256:whole(f.outsideActual)};
    for(const [p,raw]of f.candidateBytes){
      const target=path.join(f.fixture,p);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,raw,{flag:'wx'});
    }
    phase('ORIGINAL_NATIVE_EIGHT_AND_PRIVATE_TOKEN_BOUNDARY');
    const registry=active.loadActiveMetaRegistry(f.fixture);need(registry.status==='ACTIVE','CURRENT_REGISTRY_ACTIVE');
    const identityDocument=JSON.parse(fs.readFileSync(file(f.fixture,ID)));
    const byUid=new Map(f.identities.map(row=>[row.questionUid,row])),
      byJoin=new Map(f.identities.map(row=>[row.sourceArchiveFile+'#'+row.sourceOrdinal,row]));
    const nativeResults=[],negative=[],inputs=[];let firstRpmArgs;
    for(const item of f.items){
      const doc=f.docs.find(d=>d.item.questionUid===item.questionUid),receipt=JSON.parse(fs.readFileSync(file(f.fixture,doc.document.receiptRef.path)));
      const current=f.metadata.find(r=>r.questionUid===item.questionUid),identity=byUid.get(item.questionUid);
      const matches=f.runtimes.filter(r=>r.row.questionUid===item.questionUid);
      need(matches.length===1&&matches[0].status==='ACTIVE','CURRENT_RUNTIME_OWNER');
      need(active.validateActiveMetaFields(current,registry,{requireFields:true}).status==='VALIDATED','CURRENT_ACTIVE_FIELDS');
      const bytes=fs.readFileSync(file(f.fixture,item.currentSourceRef.path)),bank=f.banks.get(item.sourceArchiveFile);
      const nativeSource={root:f.fixture,bytes,blobSha1:blob(bytes),bank,runtimeRecord:matches[0].row,runtimeStatus:matches[0].status,
        identityMap:identityDocument,identityByJoin:byJoin};
      const args={nativeSource,question:bank[item.sourceOrdinal-1],previous:f.priorBanks.get(item.sourceArchiveFile)[item.sourceOrdinal-1],
        current,identity,source:item.sourceArchiveFile,ordinal:item.sourceOrdinal,receipt};
      inputs.push(args);let invoked=0,captured,capturedRpm;
      const result=helper.replayM2Problem21CurrentUiContinuation({...args,revalidateLeaf:leaf=>{
        invoked++;
        need(native.validateNativeReviewedSourceReuse(receipt,leaf.nativeSource,leaf.question,identity,item.sourceOrdinal,current,registry)===true,
          'ORDINARY_NATIVE_REQUIRED');
        const issuedBinding=JSON.parse(fs.readFileSync(file(f.fixture,item.sourceReviewBindingRef.path)));
        const originalPatch=issuedBinding.requestSnapshot.items.find(row=>row.questionUid===item.questionUid&&row.sourceOrdinal===item.sourceOrdinal);
        const normalizedPatch=structuredClone(originalPatch);
        delete normalizedPatch.sourceReview.m2ProblemRenderer21Continuity;
        delete normalizedPatch.sourceReview.e023SolutionDisplayContinuity;
        const issuedCourseProof=receipt.fingerprintRepairs.find(row=>row.questionUid===item.questionUid&&row.sourceOrdinal===item.sourceOrdinal).sourceReview.nativeRpmCourseTransport;
        capturedRpm={context:leaf.nativeSource.m2Problem21CurrentUiContinuation,root:f.fixture,
          request:issuedBinding.requestSnapshot,patch:normalizedPatch,metadata:{...current,...originalPatch.before},final:current,
          issuedProof:issuedCourseProof,relativePath:item.currentSourceRef.path,currentSourceBytes:bytes};
        const rpmView=helper.readM2Problem21CurrentRpmSource(capturedRpm);
        need(Buffer.isBuffer(rpmView)&&rpmView.equals(leaf.nativeSource.bytes),'ORIGINAL_RPM_ISSUED_VIEW_REQUIRED');
        if(item===f.items[0]){
          firstRpmArgs=capturedRpm;
          const nextRpm=()=>({...capturedRpm,request:structuredClone(capturedRpm.request),patch:structuredClone(capturedRpm.patch),
            metadata:structuredClone(capturedRpm.metadata),final:structuredClone(capturedRpm.final),
            issuedProof:structuredClone(capturedRpm.issuedProof),currentSourceBytes:Buffer.from(bytes)});
          for(const change of [
            x=>x.context=Object.freeze({}),x=>x.patch.questionUid=f.items[1].questionUid,
            x=>x.patch.sourceOrdinal++,x=>x.request.requestId+='-wrong',x=>x.patch.after.courseKey='unbound',
            x=>x.patch.sourceReview.m2ProblemRenderer21Continuity=structuredClone(originalPatch.sourceReview.m2ProblemRenderer21Continuity),
            x=>delete x.issuedProof,x=>x.issuedProof.crosswalkClassificationGranted=true,
            x=>x.final.metadataRevision+='-wrong',x=>x.currentSourceBytes[0]^=1,
            x=>x.currentSourceBytes=Buffer.from(leaf.nativeSource.bytes)
          ]){const value=nextRpm();change(value);assert.throws(()=>helper.readM2Problem21CurrentRpmSource(value));}
          for(const other of f.outside){const value=nextRpm();value.patch.questionUid=other.questionUid;value.patch.sourceOrdinal=other.sourceOrdinal;
            assert.throws(()=>helper.readM2Problem21CurrentRpmSource(value),/PRIVATE_ISSUED_RPM_SOURCE_CONTEXT/);}
          negative.push({name:'issued-rpm-reader-token-request-proof-current-bytes-and-outside39',rejected:50});

          captured={context:leaf.nativeSource.m2Problem21CurrentUiContinuation,nativeSource:leaf.nativeSource,
            current,identity,source:item.sourceArchiveFile,ordinal:item.sourceOrdinal,question:leaf.question,receipt};
          need(helper.assertM2Problem21CurrentUiLeaf(captured)===true,'PRIVATE_VALID_LEAF');
          need(helper.assertM2Problem21CurrentUiLeaf({...captured,nativeSource:{...leaf.nativeSource,identityMap:byUid}})===true,
            'WORKER_MAP_IDENTITY_LEAF');
          const mutatedDocument=mutate=>{const doc=structuredClone(identityDocument);mutate(doc);return doc;};
          const selectedIdentityIndex=identityDocument.records.findIndex(r=>r.questionUid===item.questionUid);
          need(selectedIdentityIndex>=0,'SELECTED_IDENTITY_DOCUMENT');
          const documentNegatives=[
            mutatedDocument(d=>d.records.push(structuredClone(d.records[selectedIdentityIndex]))),
            mutatedDocument(d=>d.records.push({...d.records[selectedIdentityIndex],questionUid:'duplicate-join-test'})),
            mutatedDocument(d=>d.records[selectedIdentityIndex].questionUid='different-selected-uid-test'),
            mutatedDocument(d=>d.records[selectedIdentityIndex].sourceOrdinal++),
            mutatedDocument(d=>d.unexpectedHeaderForGuardTest=true)
          ];
          for(const identityMap of documentNegatives)
            assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,nativeSource:{...leaf.nativeSource,identityMap}}),/CALLER_IDENTITY_/);
          const mapNegatives=[
            new Map([...byUid].map(([uid,row])=>[uid===item.questionUid?'wrong-map-key-test':uid,row])),
            new Map([...byUid].map(([uid,row])=>[uid,uid===item.questionUid?{...row,sourceOrdinal:row.sourceOrdinal+1}:row])),
            new Map([...byUid].filter(([uid])=>uid!==item.questionUid))
          ];
          for(const identityMap of mapNegatives)
            assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,nativeSource:{...leaf.nativeSource,identityMap}}),/CALLER_IDENTITY_/);
          negative.push({name:'auto-document-uid-ordinal-join-header-and-worker-map-mismatch',rejected:8});
          for(const other of f.outside){
            assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,identity:byUid.get(other.questionUid),
              source:other.sourceArchiveFile,ordinal:other.sourceOrdinal}),/PRIVATE_SELECTED_LEAF/);
          }
          negative.push({name:'same-source-and-other-source-outside39-token-borrow',rejected:39});
          const next=f.items[1];
          assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,identity:byUid.get(next.questionUid),
            ordinal:next.sourceOrdinal}),/PRIVATE_SELECTED_LEAF/);
          assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,receipt:{...receipt,requestId:receipt.requestId+'-wrong'}}),/PRIVATE_SELECTED_LEAF/);
          assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf({...captured,context:Object.freeze({...captured.context})}),/PRIVATE_SELECTED_LEAF/);
          negative.push({name:'other-selected-uid-wrong-receipt-token-clone',rejected:3});
        }
        return item.receiptRef.path;
      }});
      need(invoked===1&&result===item.receiptRef.path,'NATIVE_CALLBACK_ONCE');
      assert.throws(()=>helper.readM2Problem21CurrentRpmSource(capturedRpm),/PRIVATE_ISSUED_RPM_SOURCE_CONTEXT/);
      negative.push({name:'issued-rpm-reader-expires-after-'+item.key,rejected:1});
      if(captured){
        assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf(captured),/PRIVATE_SELECTED_LEAF/);
        assert.throws(()=>helper.readM2Problem21CurrentUiContinuation({context:captured.context}),/PRIVATE_ORIGINAL_P21_READER/);
        negative.push({name:'callback-exit-expired-token-and-reader',rejected:2});
      }
      need(worker.verifyRegisteredRendererContinuity(f.fixture,doc.path).status==='PASS','EXISTING_VECTOR_WORKER_REQUIRED');
      nativeResults.push({questionUid:item.questionUid,sourceOrdinal:item.sourceOrdinal,receiptPath:item.receiptRef.path,
        ordinaryNative:'PASS',issuedRpmSourceView:'PASS_WITH_EXACT_CURRENT_BYTES_AND_ISSUED_PROOF',callerIdentityShape:'AUTO_JSON_DOCUMENT_EXACT',currentActiveFields:'VALIDATED',
        worker:'PASS',workerIdentityShape:'MAP_EXACT',metadataSha256:whole(current),
        identitySha256:whole(identity),runtimeSha256:whole(matches[0].row),sourceSha256:sha(bytes)});
    }
    // A warm base cannot hide a new runtime owner file; the callback is never entered.
    const duplicateRuntimePath=path.join(f.fixture,RUNTIME,'closed8-duplicate-runtime-negative.json');
    need(!fs.existsSync(duplicateRuntimePath),'RUNTIME_NEGATIVE_PATH_ALREADY_EXISTS');
    const duplicateRuntime={status:'ACTIVE',packId:inputs[0].current.metaFoundationPackId,
      records:[structuredClone(inputs[0].nativeSource.runtimeRecord)]};
    fs.writeFileSync(duplicateRuntimePath,json(duplicateRuntime),{flag:'wx'});
    let duplicateEntered=false;
    try{
      assert.throws(()=>helper.replayM2Problem21CurrentUiContinuation({...inputs[0],revalidateLeaf(){
        duplicateEntered=true;return f.items[0].receiptRef.path;
      }}),/CURRENT_RUNTIME_UNIQUE_OWNER_AND_WHOLE_ROW/);
      need(duplicateEntered===false,'DUPLICATE_RUNTIME_CALLBACK_ENTERED');
      negative.push({name:'warm-cache-new-runtime-json-duplicate-uid-before-callback',rejected:1});
    }finally{fs.unlinkSync(duplicateRuntimePath);}
    let inventoryContext;
    try{
      assert.throws(()=>helper.replayM2Problem21CurrentUiContinuation({...inputs[0],revalidateLeaf:leaf=>{
        inventoryContext={context:leaf.nativeSource.m2Problem21CurrentUiContinuation,nativeSource:leaf.nativeSource,
          current:inputs[0].current,identity:inputs[0].identity,source:inputs[0].source,ordinal:inputs[0].ordinal,
          question:leaf.question,receipt:inputs[0].receipt};
        fs.writeFileSync(duplicateRuntimePath,json(duplicateRuntime),{flag:'wx'});
        return f.items[0].receiptRef.path;
      }}),/RUNTIME_JSON_INVENTORY_CHANGED/);
      need(!!inventoryContext,'INVENTORY_CALLBACK_NOT_EXERCISED');
      negative.push({name:'runtime-json-added-inside-callback',rejected:1});
    }finally{if(fs.existsSync(duplicateRuntimePath))fs.unlinkSync(duplicateRuntimePath);}
    assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf(inventoryContext),/PRIVATE_SELECTED_LEAF/);
    negative.push({name:'runtime-inventory-failure-also-expires-private-token',rejected:1});
    // A Promise never extends the synchronous capability lifetime.
    let escaped;
    assert.throws(()=>helper.replayM2Problem21CurrentUiContinuation({...inputs[0],revalidateLeaf:leaf=>{
      const payload={context:leaf.nativeSource.m2Problem21CurrentUiContinuation,nativeSource:leaf.nativeSource,
        current:inputs[0].current,identity:inputs[0].identity,source:inputs[0].source,ordinal:inputs[0].ordinal,question:leaf.question};
      escaped=Promise.resolve().then(()=>{
        assert.throws(()=>helper.assertM2Problem21CurrentUiLeaf(payload),/PRIVATE_SELECTED_LEAF/);
        assert.throws(()=>helper.readM2Problem21CurrentRpmSource({...firstRpmArgs,context:payload.context}),/PRIVATE_ISSUED_RPM_SOURCE_CONTEXT/);
      });
      return escaped;
    }}),/ORDINARY_NATIVE_VALIDATION_REQUIRED/);
    await escaped;negative.push({name:'asynchronous-callback-escape',rejected:1});
    negative.push({name:'asynchronous-issued-rpm-reader-escape',rejected:1});
    // A same-bank nonselected source mutation is still a whole-file pin failure.
    const sourcePath=inputs[0].nativeSource.root&&f.items[0].currentSourceRef.path,sourceFile=file(f.fixture,sourcePath),sourceRaw=fs.readFileSync(sourceFile);
    fs.writeFileSync(sourceFile,Buffer.concat([sourceRaw,Buffer.from(' ')]));
    let sourceTamperEntered=false;
    try{assert.throws(()=>helper.replayM2Problem21CurrentUiContinuation({...inputs[0],revalidateLeaf(){
        sourceTamperEntered=true;return f.items[0].receiptRef.path;
      }}));
      need(sourceTamperEntered===false,'SOURCE_TAMPER_CALLBACK_ENTERED');
      negative.push({name:'whole-bank-source-tamper-before-callback',rejected:1});}
    finally{fs.writeFileSync(sourceFile,sourceRaw);}
    report.native={status:'PASS',selected:8,registryStatus:registry.status,rows:nativeResults,
      scope:'complete original validateNativeReviewedSourceReuse and unchanged registered renderer worker; new approval 0'};
    report.tokenNegatives=negative;

    phase('OFFICIAL_SOURCE47_BUILDER_AND_CONSUMER8');
    const after=builder.build(f.fixture,{previous:before.index,reuseCache:false});observedStable(after);outsideSame(after.index,'AFTER');
    const rows=after.index.records.filter(r=>f.selected.has(r.questionUid));
    need(rows.length===8&&after.index.counts.registered===before.index.counts.registered+8&&
      after.index.counts.pending===before.index.counts.pending-8,'EXACT_EIGHT_RECOVERY');
    const api=consumer.createIndex(after.index),verified=builder.verify(after.index);let queries=0;
    for(const row of rows){
      const doc=f.docs.find(d=>d.item.questionUid===row.questionUid),compact=f.compacts.get(row.sourceArchiveFile);
      const items=compact.items.filter(it=>it.ordinal===row.sourceDisplayNumber);need(items.length===1,'EXISTING_VECTOR');
      const fields=['format',...builder.SLOTS,'candidates'],vector=x=>Object.fromEntries(fields.map(k=>[k,x[k]]));
      need(stable(vector(row))===stable(vector(items[0])),'VECTOR_WHOLE_CHANGED');
      need(row.sourceBinding==='REGISTERED_RENDERER_CONTINUITY'&&row.registrationStatus==='REGISTERED'&&
        row.independentReviewClaim===false&&stable(row.rendererContinuityRef)===stable({path:doc.path,sha256:sha(doc.raw)}),'ROW_AUTHORITY_OR_BINDING');
      need(stable(api.get(row.questionUid))===stable(row),'CONSUMER_WHOLE_GET');queries++;
      for(const slot of builder.SLOTS)for(const term of row[slot]){
        need(api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion),'CONSUMER_HAS_TERM');
        need(api.find({[slot]:[term]},{dictionaryVersion:row.dictionaryVersion}).some(r=>r.questionUid===row.questionUid),'CONSUMER_FIND');
        queries+=2;
      }
    }
    report.after={counts:after.index.counts,selected:selectedSummary(after.index),outsideWholeSha256:whole(f.outsideActual)};
    report.consumer={selected:8,queries,officialVerifyStatus:verified.status,officialVerified:verified.verified,
      existingWholeVectorsUnchanged:8,newApprovals:0};
    const privateIndex=file(f.fixture,INDEX);fs.writeFileSync(privateIndex,json(after.index));
    phase('COLD_REPLAY');
    const cold=builder.run(f.fixture,{check:true});
    need(cold.changed===false&&cold.revalidatedFiles===2&&cold.reusedFiles===0,'COLD_REPLAY');
    report.cold={changed:cold.changed,counts:cold.counts,revalidatedFiles:cold.revalidatedFiles,reusedFiles:cold.reusedFiles,indexSha256:cold.indexSha256};

    phase('INDIVIDUAL_AND_ALL_SIDECAR_REMOVAL');
    const first=f.docs[0];fs.unlinkSync(file(f.fixture,first.path));
    try{
      assert.throws(()=>worker.verifyRegisteredRendererContinuity(f.fixture,first.path));
      need(worker.verifyRegisteredRendererContinuity(f.fixture,f.docs[1].path).status==='PASS','REMOVAL_LEAKED_TO_OTHER_SELECTED');
      report.individualRemoval={selectedRejected:1,otherSelectedStillValid:1};
    }finally{fs.writeFileSync(path.join(f.fixture,first.path),first.raw);}
    for(const p of f.candidateBytes.keys())fs.unlinkSync(file(f.fixture,p));
    const removed=builder.build(f.fixture,{previous:after.index,reuseCache:false});observedStable(removed);outsideSame(removed.index,'REMOVED');
    need(removed.index.records.every(r=>!f.selected.has(r.questionUid)),'REMOVED_SIDECAR_REGISTERED');
    const removedApi=consumer.createIndex(removed.index);
    for(const uid of f.selected)need(removedApi.get(uid)===null,'REMOVED_SIDECAR_CONSUMER');
    report.removed={selectedRegistered:0,selectedRejected:8,counts:removed.index.counts,selected:selectedSummary(removed.index),
      outsideWholeSha256:whole(f.outsideActual)};
    for(const [p,raw]of f.candidateBytes)fs.writeFileSync(path.join(f.fixture,p),raw,{flag:'wx'});
    f.assertInputs();
    need(git(root,['rev-parse','HEAD']).toString().trim()===head&&
      git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus,'ROOT_MUTATION');
    report.inputs={current:[...f.currentInputs.values()].sort((a,b)=>a.path.localeCompare(b.path,'en')),
      immutable:[...f.immutableInputs.values()].sort((a,b)=>(a.commit+':'+a.path).localeCompare(b.commit+':'+b.path,'en')),
      privateNonDerivedPreserved:f.checkpoint.length,source47ViewDerivedFromActualGloballyUniqueInputs:true,
      optionalMissingPaths:[...f.optionalMissing].sort(),sharedWritableHardlinks:0};
    report.phase='COMPLETE';report.status='PASS_PRIVATE_SOURCE47_CURRENT_NATIVE_AND_CONSUMER8';report.actualMainRegistration='NOT_PERFORMED';
    writeReport(report,out);
    console.log(JSON.stringify({schemaVersion:report.schemaVersion,status:report.status,source47:47,outsidePreserved:39,
      native:8,consumer:8,coldChanged:false,deletionRejected:8,mainWrites:0,reportSha256:sha(fs.readFileSync(out))}));
    return report;
  }catch(error){
    report.status='FAIL';report.error=safeFailure(error);report.actualMainRegistration='NOT_PERFORMED';
    if(f)report.partialInputCounts={current:f.currentInputs.size,immutable:f.immutableInputs.size};
    if(head)try{report.rootHeadUnchanged=git(root,['rev-parse','HEAD']).toString().trim()===head;
      report.rootStatusUnchanged=git(root,['status','--porcelain=v1','--untracked-files=all']).toString()===rootStatus;}catch{}
    writeReport(report,out);console.error(JSON.stringify({schemaVersion:report.schemaVersion,status:'FAIL',
      phase:report.phase,error:report.error,reportSha256:sha(fs.readFileSync(out))}));process.exitCode=1;return report;
  }finally{if(f)fs.rmSync(f.work,{recursive:true,force:true});}
}
if(require.main===module){
  const args=process.argv.slice(2);let root=path.resolve(__dirname,'../..'),out;
  for(let i=0;i<args.length;i++){
    if(args[i]==='--root')root=path.resolve(args[++i]);
    else if(args[i]==='--output')out=args[++i];
    else throw Error('M2_CURRENT8_SCOPE_UNKNOWN_ARGUMENT');
  }
  need(out,'OUTPUT_REQUIRED');
  run(root,out).catch(e=>{console.error(JSON.stringify({status:'FAIL',error:safeFailure(e)}));process.exitCode=1;});
}
module.exports={run,pathContractForTests:Object.freeze({dependencyPath,refShape,historicalProofRef,HISTORICAL_ONLY_PROOFS})};
