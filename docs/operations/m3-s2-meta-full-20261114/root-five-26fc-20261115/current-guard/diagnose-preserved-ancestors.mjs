import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const own=path.dirname(new URL(import.meta.url).pathname),root=own+'/fixture';
const {nativePreservedSourceRebind}=await import(root+'/archive/tools/meta-foundation/native-preserved-source-reuse.mjs');
const auto=await import(root+'/archive/tools/meta-foundation/auto-register-merged-source.mjs');
const active=await import(root+'/archive/tools/meta-foundation/active-registry.mjs');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const j=p=>JSON.parse(fs.readFileSync(root+'/'+p));
const git=(...args)=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:20e6});
const registry=active.loadActiveMetaRegistry(root),identityMap=j('archive/data/question_identity_map.json');
const identityByJoin=new Map(identityMap.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
const runtimeByUid=new Map(),runtimeStatus=new Map();
for(const file of fs.readdirSync(root+'/archive/data/meta-foundation/runtime').filter(n=>n.endsWith('.json')&&n!=='runtime-bridge-receipt.json')){
 const data=j('archive/data/meta-foundation/runtime/'+file);runtimeStatus.set(data.packId,data.status);
 for(const row of data.records||[])runtimeByUid.set(row.questionUid,row);
}
const rows=[];
for(const exam of ['e037','e054','e061']){
 const relative='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m3s2-'+exam+'-preserve-quadratic5-26fc-20261115.json';
 const receipt=j(relative),current=receipt.appliedRecords[0],source=current.sourceArchiveFile,ordinal=current.sourceOrdinal;
 if(!source.startsWith('original/middle/m3/2mid/'))throw Error('outside scope');
 const bytes=fs.readFileSync(root+'/archive/exams/'+source),bank=auto.loadBank(bytes.toString());
 const previousBytes=git('show','a9ca41250739f7f43fcbfecbf4c54276cd72178a:archive/exams/'+source),previous=auto.loadBank(previousBytes.toString())[ordinal-1];
 const identity=identityByJoin.get(source+'#'+ordinal),question=bank[ordinal-1],runtimeRecord=runtimeByUid.get(identity.questionUid);
 const pt=registry.problemTypes.get(current.problemTypeKey),tpl=registry.templates.get(current.templateKey),ownerPack=current.metaFoundationPackId;
 const nativeSource={root,bytes,bank,blobSha1:blob(bytes),identityMap,identityByJoin,runtimeRecord,runtimeStatus:runtimeStatus.get(ownerPack)};
 const args={nativeSource,question,previous,current,identity,source,ordinal,pt,tpl,registry,ownerPack};
 const row={exam,questionUid:identity.questionUid,ordinal,source,receipt:relative,receiptSha256:sha(fs.readFileSync(root+'/'+relative))};
 try{row.result=nativePreservedSourceRebind({...args,receipt,revalidateLeaf:ancestor=>auto.nativeReviewReceipt({...args,...ancestor})});}
 catch(error){row.error={message:error.message,code:error.code||null,path:error.path||null,stack:error.stack};}
 rows.push(row);
}
const output=process.argv[2]||'ancestor-diagnosis-before-restoration.json';
const bytes=JSON.stringify({schemaVersion:'m3s2-preserved-ancestor-diagnosis-v1',head:git('rev-parse','HEAD').toString().trim(),rows,sourceWrites:0,sharedWrites:0,remoteWrites:0},null,2)+'\n';
fs.writeFileSync(own+'/'+output,bytes);
console.log(JSON.stringify({path:own+'/'+output,sha256:sha(bytes),rows:rows.map(({exam,questionUid,error,result})=>({exam,questionUid,error:error?.message,result}))}));
