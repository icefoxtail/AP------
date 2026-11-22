'use strict';
// Contract tests for the new reader's argument boundary. Its actual function
// body is evaluated with a test-only authenticated-context table. This does not
// claim buildBase/Native acceptance; the scoped gate calls the real token path.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),helperPath=path.join(root,'archive/tools/meta-foundation/m2-problem21-current-ui-continuity.mjs');
const text=fs.readFileSync(helperPath,'utf8');
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex'),blob=b=>crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex');
const fail=code=>{throw Error('M2_P21_CURRENT8:'+code);},same=(a,b)=>stable(a)===stable(b),clone=x=>structuredClone(x);
const marker='export const M2_P21_CURRENT_EIGHT_ITEMS=frozen(',start=text.indexOf(marker)+marker.length,end=text.indexOf('\n]);',start);
assert(start>=marker.length&&end>start);
const items=JSON.parse(text.slice(start,end+2));assert.equal(items.length,8);
const fnStart=text.indexOf('export function readM2Problem21CurrentRpmSource('),fnEnd=text.indexOf('\nfunction replay(',fnStart);
assert(fnStart>0&&fnEnd>fnStart);const code=text.slice(fnStart,fnEnd).replace(/^export /,'')+'\nreadM2Problem21CurrentRpmSource;';
const originals=new Map();
function bound(ref){
 if(originals.has(ref.gitBlobSha1))return Buffer.from(originals.get(ref.gitBlobSha1));
 const env={...process.env};delete env.GIT_NO_LAZY_FETCH;
 const git=args=>execFileSync('git',args,{cwd:root,env,maxBuffer:8*1024*1024,timeout:30000,stdio:['ignore','pipe','pipe']});
 assert.equal(git(['ls-tree','-z',ref.commit,'--',ref.path]).toString(),'100644 blob '+ref.gitBlobSha1+'\t'+ref.path+'\0');
 const raw=git(['cat-file','blob',ref.gitBlobSha1]);assert.equal(raw.length,ref.bytes);assert.equal(sha(raw),ref.sha256);assert.equal(blob(raw),ref.gitBlobSha1);
 originals.set(ref.gitBlobSha1,raw);return Buffer.from(raw);
}
function fixture(index=0){
 const item=items[index],oldBytes=bound(item.issuedSourceRef),currentBytes=bound(item.currentSourceRef);
 const receipt=JSON.parse(bound(item.receiptRef)),issuedBinding=JSON.parse(bound(item.sourceReviewBindingRef));
 const current=receipt.appliedRecords.find(x=>x.questionUid===item.questionUid);
 const original=issuedBinding.requestSnapshot.items.find(x=>x.questionUid===item.questionUid),patch=clone(original);
 delete patch.sourceReview.m2ProblemRenderer21Continuity;delete patch.sourceReview.e023SolutionDisplayContinuity;
 const proof=receipt.fingerprintRepairs.find(x=>x.questionUid===item.questionUid).sourceReview.nativeRpmCourseTransport;
 const token=Object.freeze(Object.create(null)),contexts=new WeakMap(),state={live:true,liveChecks:0,localReads:0};
 const ctx={root:fs.realpathSync(root),item,oldBytes,current,receipt,issuedBinding,sources:new Map([[item.sourceArchiveFile,{currentBytes}]])};contexts.set(token,ctx);
 const checked=(bytes,ref)=>{if(!Buffer.isBuffer(bytes)||bytes.length!==ref.bytes||sha(bytes)!==ref.sha256||blob(bytes)!==ref.gitBlobSha1)fail('REF_BYTES');};
 const read=vm.runInNewContext(code,{contexts,Buffer,structuredClone,fs:{realpathSync:fs.realpathSync,readFileSync(p){assert.equal(p,path.join(ctx.root,item.currentSourceRef.path));state.localReads++;return Buffer.from(currentBytes);}},same,fail,
  exactOne:(rows,p,code)=>{const found=rows?.filter(p);if(found?.length!==1)fail(code);return found[0];},
  assertLive(c){assert.equal(c,ctx);state.liveChecks++;if(!state.live)fail('LIVE_CHANGED');},
  localPath:(r,p)=>path.join(r,p),checked});
 const args={context:token,root:ctx.root,request:clone(issuedBinding.requestSnapshot),patch,metadata:{...current,...original.before},final:clone(current),
  issuedProof:clone(proof),relativePath:item.currentSourceRef.path,currentSourceBytes:Buffer.from(currentBytes)};
 return{read,args,ctx,state,token,contexts,oldBytes,currentBytes,item};
}
for(let i=0;i<8;i++)test('issued RPM reader argument contract: '+items[i].key,()=>{
 const f=fixture(i),result=f.read(f.args);assert(result.equals(f.oldBytes));assert.notEqual(result,f.oldBytes);assert.equal(f.state.liveChecks,1);
 result[0]^=1;assert(f.read(f.args).equals(f.oldBytes),'caller must not mutate stored issued bytes');
});
test('ordinary no-context path returns null without a comparison view',()=>{const f=fixture();assert.equal(f.read({context:undefined}),null);assert.equal(f.state.liveChecks,0);});
test('omitted caller buffer still reads the exact current source path',()=>{const f=fixture();delete f.args.currentSourceBytes;assert(f.read(f.args).equals(f.oldBytes));assert.equal(f.state.localReads,1);});
for(const [name,mutate]of[
 ['unknown token',f=>f.args.context=Object.freeze({})],
 ['expired token',f=>f.contexts.delete(f.token)],
 ['other UID',f=>f.args.patch.questionUid=items[1].questionUid],
 ['other ordinal',f=>f.args.patch.sourceOrdinal++],
 ['other source path',f=>f.args.relativePath=items[6].currentSourceRef.path],
 ['different issued request',f=>f.args.request.requestId+='-wrong'],
 ['current blob substituted for issued request blob',f=>f.args.request.expectedSourceBlobSha1=f.item.currentSourceRef.gitBlobSha1],
 ['unremoved problem marker',f=>f.args.patch.sourceReview.m2ProblemRenderer21Continuity=clone(f.ctx.issuedBinding.requestSnapshot.items.find(x=>x.questionUid===f.item.questionUid).sourceReview.m2ProblemRenderer21Continuity)],
 ['extra source marker',f=>f.args.patch.sourceReview.unbound=true],
 ['extra patch field',f=>f.args.patch.rebind={}],
 ['course after changed',f=>f.args.patch.after.courseKey='unbound'],
 ['before changed',f=>f.args.patch.before.sourceFingerprint='0'.repeat(64)],
 ['final row changed',f=>f.args.final.metadataRevision+='-wrong'],
 ['before overlay omitted',f=>f.args.metadata=clone(f.ctx.current)],
 ['issued proof missing',f=>delete f.args.issuedProof],
 ['issued proof extra authority',f=>f.args.issuedProof.crosswalkClassificationGranted=true],
 ['issued proof current-source drift',f=>f.args.issuedProof.currentSource.gitBlobSha1=f.item.currentSourceRef.gitBlobSha1],
 ['old bytes presented as actual current file',f=>f.args.currentSourceBytes=Buffer.from(f.oldBytes)],
 ['current bytes one-byte tamper',f=>f.args.currentSourceBytes[0]^=1],
 ['non-Buffer current file',f=>f.args.currentSourceBytes=new Uint8Array(f.currentBytes)],
 ['authenticated live input changed',f=>f.state.live=false],
 ['missing issued repair',f=>f.ctx.receipt.fingerprintRepairs=[]],
 ['duplicate selected repair',f=>f.ctx.receipt.fingerprintRepairs.push(clone(f.ctx.receipt.fingerprintRepairs.find(x=>x.questionUid===f.item.questionUid)))],
 ['private old byte drift',f=>f.ctx.oldBytes=Buffer.concat([f.oldBytes,Buffer.from(' ')])]
])test('issued RPM reader rejects '+name,()=>{const f=fixture();mutate(f);assert.throws(()=>f.read(f.args),/M2_P21_CURRENT8:/);});
test('E023 companion must be removed completely with no other patch change',()=>{const f=fixture(6);f.args.patch.sourceReview.e023SolutionDisplayContinuity={};assert.throws(()=>f.read(f.args),/PRIVATE_ISSUED_RPM_NORMALIZED_PATCH/);});
test('RPM bank, fingerprint and issued-proof equality remain present',()=>{
 const rpm=fs.readFileSync(path.join(root,'archive/tools/meta-foundation/reviewed-m2-native-rpm-course.mjs'),'utf8');
 assert(rpm.includes('const liveSource = localBytes(root, sourcePath);'));
 assert(rpm.includes('currentSourceBytes:liveSource'));
 assert(rpm.includes('blob(currentSource) !== request.expectedSourceBlobSha1'));
 assert(rpm.includes("fail('EXACT_SOURCE_BANK_OR_AFTER_BLOB_REQUIRED')"));
 assert(rpm.includes("fail('CURRENT_SOURCE_FINGERPRINT_AFTER_REQUIRED')"));
 assert(rpm.includes("if (issuedProof !== undefined && !same(proof, issuedProof)) fail('ISSUED_COURSE_PROOF_MISMATCH');"));
});
