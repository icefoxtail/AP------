'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{execFileSync}=require('node:child_process');
const W='/workspace/scratch/c8f1b0bfb4fa/m2-public41-continuity-current16f-r1';
const REPO='/workspace/scratch/c9f85667609e/ap-release-recovery/ap.git',BASE='16f4b35d2ce11eaa1d2a299cb2d9ed74a4571e6f';
const env={...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'};
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=x=>crypto.createHash('sha1').update('blob '+x.length+'\0').update(x).digest('hex');
const need=(x,c)=>{if(!x)throw Error(c);};
const git=args=>execFileSync('git',['--git-dir='+REPO,...args],{env,maxBuffer:40*1024*1024,stdio:['ignore','pipe','pipe']});
const inputRaw=fs.readFileSync(path.join(W,'.design/current-ui39-inputs-unsealed-r1.json'));
need(sha(inputRaw)==='cdee0cdf6fc4340b0da1d948c8a0588aae289cc84c29e36dd948260aa70939c0','DERIVED_INPUT_PIN');
const input=JSON.parse(inputRaw);need(input.items.length===39&&input.sourceBindings.length===12,'SCOPE');
const items=input.items.map(item=>{
  need(git(['rev-parse',BASE+':'+item.assetPath]).toString().trim()===item.assetGitBlobSha1,'ASSET_TREE');
  const raw=git(['cat-file','blob',item.assetGitBlobSha1]);need(blob(raw)===item.assetGitBlobSha1,'ASSET_BYTES');
  return {...item,assetSha256:sha(raw),assetBytes:raw.length};
});
const identityPath='archive/data/question_identity_map.json',idOid=git(['rev-parse',BASE+':'+identityPath]).toString().trim(),identityRaw=git(['cat-file','blob',idOid]);
need(idOid==='e455443e6348ec1f04a7b2bad726cb5bef66a110'&&sha(identityRaw)==='4b917f2f33cb01104710d475ba4f8a957d7f7c18028777bdea4921ebab671f85'&&blob(identityRaw)===idOid,'CURRENT_IDENTITY_PIN');
const identityBinding={path:identityPath,gitBlobSha1:idOid,sha256:sha(identityRaw),bytes:identityRaw.length,globalRecordCount:28890};
const shards=[];
for(let n=0;n<items.length;n+=5)shards.push({id:'s'+String(shards.length+1).padStart(2,'0'),questionUids:items.slice(n,n+5).map(row=>row.questionUid)});
need(shards.length===8&&shards.every(shard=>new Set(items.filter(row=>shard.questionUids.includes(row.questionUid)).map(row=>row.sourcePath)).size<=3),'SMALL_SHARD_BANK_BOUND');
const manifest={schemaVersion:'archive-m2-public39-current-problem-ui-manifest-v1',scope:'EXACT_PUBLIC39_CURRENT_PROBLEM_CAPTURE_NO_APPROVAL',
  bindingState:'SEALED_PUBLIC_CURRENT_PROBLEM39',expectedCases:78,
  viewports:[{name:'desktop',width:1365,height:1000},{name:'mobile',width:390,height:844}],
  identityBinding,sourceBindings:input.sourceBindings,shards,items};
const fixture='tests/fixtures/archive-m2-public39-current-problem-ui.json',out=path.join(W,'candidate',fixture);
fs.mkdirSync(path.dirname(out),{recursive:true});const raw=Buffer.from(JSON.stringify(manifest,null,2)+'\n');fs.writeFileSync(out,raw,{flag:'wx'});
const seals={schemaVersion:'archive-public39-ui-manifest-seals-v1',baseCommit:BASE,fixture,manifestSha256:sha(raw),manifestBytes:raw.length,
  itemsSha256:sha(stable(items)),sourceBindingsSha256:sha(stable(input.sourceBindings)),identityBindingSha256:sha(stable(identityBinding)),shardsSha256:sha(stable(shards)),
  sharedCaptureHelperSha256:'e4895b67b750fedddb60a310052ed99778c2576fe5723c936c1a69606bb04673',
  shards:shards.map(shard=>({id:shard.id,subjects:shard.questionUids.length,logicalCases:shard.questionUids.length*2,
    sourceBanks:new Set(items.filter(row=>shard.questionUids.includes(row.questionUid)).map(row=>row.sourcePath)).size})),
  holdsExcluded:['E034Q18','E040Q23','E044Q6'],existingSvg7Excluded:7,sourceWrites:0,rawStudentDataEmitted:false,newApprovals:0};
const p=path.join(W,'.design/current-ui39-manifest-seals-r1.json'),b=Buffer.from(JSON.stringify(seals,null,2)+'\n');fs.writeFileSync(p,b,{flag:'wx'});
process.stdout.write(JSON.stringify({status:'SEALED_EXACT_CURRENT39',manifestPath:out,manifestSha256:sha(raw),manifestBytes:raw.length,sealsSha256:sha(b),...seals})+'\n');
