import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { replayE015IssuedSourceContinuation, assertE015IssuedSourceContinuationLeaf,
  readE015IssuedSourceContinuation } from '../archive/tools/meta-foundation/native-e015-source-cc-continuity.mjs';

// Uses the already-issued immutable inputs. No new approval or registrar output
// is fabricated by these tests; the callback below tests only token transport.
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputRoot = process.env.E015_TEST_ROOT || project;
const source = 'original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
const sourcePath = `archive/exams/${source}`;
const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2-family3-e015-current65a-display-r2-20261116.json';
const bindingPath = receiptPath.replace(/\.json$/, '.source-review-binding.json');
const transportPath = 'docs/operations/source-metadata-candidates/m2s2-public4-source-cc-currentc57-r3-20261116/transport-receipt.json';
const git = (root, ...args) => execFileSync('git', args, { cwd:root, encoding:'utf8', stdio:['ignore','pipe','pipe'] }).trim();
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k,x[k]])) : x);
function bankFromJson(bytes) {
  const text=bytes.toString('utf8'), start=text.indexOf('[',text.indexOf('window.questionBank'));
  let end=text.lastIndexOf(']');
  // This exact bank is an immutable JSON literal, not executable test input.
  while(end>start) { try { const bank=JSON.parse(text.slice(start,end+1));if(Array.isArray(bank))return bank; } catch {} end=text.lastIndexOf(']',end-1); }
  throw Error('JSON fixture bank unavailable');
}
const root=fs.mkdtempSync(path.join(os.tmpdir(),'e015-issued-source-'));
const files=[sourcePath,receiptPath,bindingPath,transportPath];
const sourceBytes=fs.readFileSync(path.join(inputRoot,sourcePath)), bank=bankFromJson(sourceBytes);
const receipt=JSON.parse(fs.readFileSync(path.join(inputRoot,receiptPath),'utf8'));
const binding=JSON.parse(fs.readFileSync(path.join(inputRoot,bindingPath),'utf8'));
const originals=new Map(files.map(p=>[p,fs.readFileSync(path.join(inputRoot,p))]));
const head=git(inputRoot,'rev-parse','HEAD');
git(root,'init','--quiet');
const objects=git(inputRoot,'rev-parse','--path-format=absolute','--git-path','objects');
fs.mkdirSync(path.join(root,'.git/objects/info'),{recursive:true});
fs.writeFileSync(path.join(root,'.git/objects/info/alternates'),objects+'\n');
fs.writeFileSync(path.join(root,'.git/HEAD'),head+'\n');
for(const [rel,bytes] of originals){const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);}
let passed=0;
function test(name,fn){fn();passed++;console.log(`PASS ${name}`);}
function input(ordinal=7){
  const current=structuredClone(receipt.appliedRecords.find(r=>r.sourceOrdinal===ordinal));
  const identity=structuredClone(receipt.appliedIdentityRecords.find(r=>r.sourceOrdinal===ordinal));
  const runtimeRecord=structuredClone(receipt.runtimeRecords.find(r=>r.sourceOrdinal===ordinal));
  return {source,ordinal,question:structuredClone(bank[ordinal-1]),previous:structuredClone(bank[ordinal-1]),current,identity,
    nativeSource:{root,bytes:Buffer.from(sourceBytes),blobSha1:'f14aefb3ab99ed6df2badef820a0878e97c6f488',bank:structuredClone(bank),
      runtimeRecord,runtimeStatus:'ACTIVE',identityByJoin:new Map(receipt.appliedIdentityRecords.map(r=>[`${source}#${r.sourceOrdinal}`,structuredClone(r)]))}};
}
function checkedCallback(args,save){return leaf=>{
  const context=leaf.nativeSource.e015IssuedSourceContinuation;
  assert.equal(assertE015IssuedSourceContinuationLeaf({...args,...leaf,context,receipt}),true);
  const patch=binding.requestSnapshot.items.find(r=>r.questionUid===args.identity.questionUid);
  const bytes=readE015IssuedSourceContinuation({context,root,request:binding.requestSnapshot,patch,current:args.current,
    question:leaf.question,relativePath:sourcePath});
  assert.ok(Buffer.isBuffer(bytes)&&bytes.equals(leaf.nativeSource.bytes),'historical view must be the issued source');
  assert.ok(stable(leaf.question)===stable(args.question),'selected whole question must remain identical');
  save?.({context,leaf,patch});
  return receiptPath;
};}
function rejected(mutator){const args=input();mutator(args);assert.throws(()=>replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args)}),/E015_ISSUED_SOURCE_CONTINUITY/);}
function mutateFile(relative,change,run){const full=path.join(root,relative),before=fs.readFileSync(full);try{fs.writeFileSync(full,change(before));run();}finally{fs.writeFileSync(full,before);}}
try {
  for(const ordinal of [7,8])test(`exact issued Q${ordinal} token replay`,()=>{const args=input(ordinal);assert.equal(replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args)}),receiptPath);});
  test('outside UID cannot enter lane',()=>{const args=input();args.identity.questionUid='qid_v1_outside';let called=false;assert.equal(replayE015IssuedSourceContinuation({...args,revalidateLeaf:()=>{called=true;}}),null);assert.equal(called,false);});
  test('outside source cannot enter lane',()=>{const args=input();args.source+='x';assert.equal(replayE015IssuedSourceContinuation(args),null);});
  test('ordinary original source remains outside transport lane',()=>{const args=input();args.nativeSource.blobSha1='40fac8532d52c2b308708f6a0769005029bb7565';assert.equal(replayE015IssuedSourceContinuation(args),null);});
  test('metadata authority change rejected',()=>rejected(a=>{a.current.metadataApprovalType='MAIN_MERGE';}));
  test('metadata nonapproval field change rejected',()=>rejected(a=>{a.current.difficultyBucket='D5';}));
  test('identity change rejected',()=>rejected(a=>{a.identity.sourceFingerprint='0'.repeat(64);}));
  test('runtime change rejected',()=>rejected(a=>{a.nativeSource.runtimeRecord.templateKey='TPL_OTHER';}));
  test('inactive runtime rejected',()=>rejected(a=>{a.nativeSource.runtimeStatus='INACTIVE';}));
  test('pair identity omission rejected',()=>rejected(a=>{a.nativeSource.identityByJoin.delete(`${source}#8`);}));
  test('selected whole question change rejected',()=>rejected(a=>{a.question={...a.question,layoutTag:'other'};}));
  test('nonselected source change rejected',()=>rejected(a=>{a.nativeSource.bank[0]={...a.nativeSource.bank[0],crossConceptKeys:['OTHER']};}));
  test('Q10 additional CC rejected',()=>rejected(a=>{a.nativeSource.bank[9].crossConceptKeys.push('OTHER');}));
  test('mixed issued-history token rejected',()=>rejected(a=>{a.nativeSource.issuedRpmHistoryContext={};}));
  test('source bytes mutation rejected',()=>rejected(a=>{a.nativeSource.bytes=Buffer.concat([a.nativeSource.bytes,Buffer.from(' ')]);}));
  for(const relative of files)test(`live immutable input mutation ${files.indexOf(relative)+1}`,()=>mutateFile(relative,b=>Buffer.concat([b,Buffer.from(' ')]),()=>rejected(()=>{})));
  test('transport approval promotion rejected',()=>mutateFile(transportPath,b=>Buffer.from(b.toString().replace('"approvalEffect": "NONE"','"approvalEffect": "FINAL_QA"')),()=>rejected(()=>{})));
  test('symlinked current source rejected',()=>{const full=path.join(root,sourcePath),backup=full+'.kept';fs.renameSync(full,backup);fs.symlinkSync(backup,full);try{rejected(()=>{});}finally{fs.unlinkSync(full);fs.renameSync(backup,full);}});
  test('ordinary Native null never becomes approval',()=>{const args=input();assert.throws(()=>replayE015IssuedSourceContinuation({...args,revalidateLeaf:()=>null}),/ORDINARY_NATIVE_RECEIPT_REQUIRED/);});
  test('other receipt never becomes approval',()=>{const args=input();assert.throws(()=>replayE015IssuedSourceContinuation({...args,revalidateLeaf:()=>receiptPath+'.other'}),/ORDINARY_NATIVE_RECEIPT_REQUIRED/);});
  test('forged token rejected',()=>{const args=input();assert.throws(()=>assertE015IssuedSourceContinuationLeaf({...args,context:{}}),/PRIVATE_SELECTED_LEAF/);});
  test('forged family reader token rejected',()=>assert.throws(()=>readE015IssuedSourceContinuation({context:{},root,relativePath:sourcePath}),/PRIVATE_FAMILY3_READER/));
  test('ordinary family reader remains absent',()=>assert.equal(readE015IssuedSourceContinuation({root}),null));
  test('token expires when callback returns',()=>{const args=input();let kept;replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args,x=>{kept=x;})});assert.throws(()=>assertE015IssuedSourceContinuationLeaf({...args,...kept.leaf,context:kept.context}),/PRIVATE_SELECTED_LEAF/);});
  test('token cannot change selected ordinal',()=>{const args=input();replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args,({context,leaf})=>{assert.throws(()=>assertE015IssuedSourceContinuationLeaf({...args,...leaf,context,ordinal:8}),/PRIVATE_SELECTED_LEAF/);})});});
  test('token cannot authorize a changed request',()=>{const args=input();replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args,({context,leaf,patch})=>{assert.throws(()=>readE015IssuedSourceContinuation({context,root,request:{...binding.requestSnapshot,registryChanges:[{}]},patch,current:args.current,question:leaf.question,relativePath:sourcePath}),/PRIVATE_FAMILY3_READER/);})});});
  test('token cannot read a different source',()=>{const args=input();replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args,({context,leaf,patch})=>{assert.throws(()=>readE015IssuedSourceContinuation({context,root,request:binding.requestSnapshot,patch,current:args.current,question:leaf.question,relativePath:sourcePath+'.other'}),/PRIVATE_FAMILY3_READER/);})});});
  test('live mutation during callback fails closed',()=>{const args=input();mutateFile(receiptPath,b=>b,()=>{assert.throws(()=>replayE015IssuedSourceContinuation({...args,revalidateLeaf:()=>{fs.appendFileSync(path.join(root,receiptPath),' ');return receiptPath;}}),/RAW_GIT_PIN/);});});
  console.log(JSON.stringify({schemaVersion:'e015-issued-source-continuity-focused-v1',passed,failed:0,ordinaryNativeExecutions:0,newApprovals:0,sourceWrites:0}));
} finally { fs.rmSync(root,{recursive:true,force:true}); }
