import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { replayE015IssuedSourceContinuation, assertE015IssuedSourceContinuationLeaf,
  readE015IssuedSourceContinuation, assertE015LayoutTagOnlyEdition } from '../archive/tools/meta-foundation/native-e015-source-cc-continuity.mjs';

// Uses the already-issued immutable inputs. No new approval or registrar output
// is fabricated by these tests; the callback below tests only token transport.
// The same suite runs in two worlds: the f14aefb3ab edition at the transport commit
// (stage "current", meaning unchanged) and the live restored edition (layoutTag only).
const project = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const inputRoot = process.env.E015_TEST_ROOT || project;
const source = 'original/middle/m2/2mid/24_매산중_2학기_중간_중2_수학.js';
const sourcePath = `archive/exams/${source}`;
const receiptPath = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/m2-family3-e015-current65a-display-r2-20261116.json';
const bindingPath = receiptPath.replace(/\.json$/, '.source-review-binding.json');
const transportPath = 'docs/operations/source-metadata-candidates/m2s2-public4-source-cc-currentc57-r3-20261116/transport-receipt.json';
const TRANSPORT_COMMIT = '054986dff9a1b772cd2b40a44e6dc70d4400d0a5';
const F14 = 'f14aefb3ab99ed6df2badef820a0878e97c6f488';
const RESTORED = { git: '68701f35d17f45248c6a61f5051b4706c1dea6a6', raw: 'd4393430d6564adabd65ee5c02906db25363e4715856a44fb94ac385c1b59459', bytes: 75117 };
const gitBuf = (root, ...args) => execFileSync('git', args, { cwd:root, maxBuffer:8*1024*1024, stdio:['ignore','pipe','pipe'] });
const git = (root, ...args) => gitBuf(root, ...args).toString('utf8').trim();
const stable = v => JSON.stringify(v, (_, x) => x && typeof x === 'object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k,x[k]])) : x);
const withoutLayoutTag = ({ layoutTag, ...rest }) => rest;
const blobOf = b => crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
function bankFromJson(bytes) {
  const text=bytes.toString('utf8'), start=text.indexOf('[',text.indexOf('window.questionBank'));
  let end=text.lastIndexOf(']');
  // This exact bank is an immutable JSON literal, not executable test input.
  while(end>start) { try { const bank=JSON.parse(text.slice(start,end+1));if(Array.isArray(bank))return bank; } catch {} end=text.lastIndexOf(']',end-1); }
  throw Error('JSON fixture bank unavailable');
}
const files=[sourcePath,receiptPath,bindingPath,transportPath];
const objects=git(inputRoot,'rev-parse','--path-format=absolute','--git-path','objects');
const roots=[];
let passed=0, skipped=0;
function makeWorld(label,head,read,blobSha1) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'e015-issued-source-'));
  roots.push(root);
  git(root,'init','--quiet');
  fs.mkdirSync(path.join(root,'.git/objects/info'),{recursive:true});
  fs.writeFileSync(path.join(root,'.git/objects/info/alternates'),objects+'\n');
  fs.writeFileSync(path.join(root,'.git/HEAD'),head+'\n');
  const originals=new Map(files.map(p=>[p,read(p)]));
  for(const [rel,bytes] of originals){const full=path.join(root,rel);fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,bytes);}
  const sourceBytes=originals.get(sourcePath);
  return {label,root,head,blobSha1,sourceBytes,bank:bankFromJson(sourceBytes),
    receipt:JSON.parse(originals.get(receiptPath).toString('utf8')),binding:JSON.parse(originals.get(bindingPath).toString('utf8'))};
}
function suite(w) {
  const {root,sourceBytes,bank,receipt,binding,blobSha1,label}=w;
  const test=(name,fn)=>{const r=fn();if(r==='skip'){skipped++;return;}passed++;console.log(`PASS [${label}] ${name}`);};
  function input(ordinal=7){
    const current=structuredClone(receipt.appliedRecords.find(r=>r.sourceOrdinal===ordinal));
    const identity=structuredClone(receipt.appliedIdentityRecords.find(r=>r.sourceOrdinal===ordinal));
    const runtimeRecord=structuredClone(receipt.runtimeRecords.find(r=>r.sourceOrdinal===ordinal));
    return {source,ordinal,question:structuredClone(bank[ordinal-1]),previous:structuredClone(bank[ordinal-1]),current,identity,
      nativeSource:{root,bytes:Buffer.from(sourceBytes),blobSha1,bank:structuredClone(bank),
        runtimeRecord,runtimeStatus:'ACTIVE',identityByJoin:new Map(receipt.appliedIdentityRecords.map(r=>[`${source}#${r.sourceOrdinal}`,structuredClone(r)]))}};
  }
  function checkedCallback(args,save){return leaf=>{
    const context=leaf.nativeSource.e015IssuedSourceContinuation;
    assert.equal(assertE015IssuedSourceContinuationLeaf({...args,...leaf,context,receipt}),true);
    const patch=binding.requestSnapshot.items.find(r=>r.questionUid===args.identity.questionUid);
    const bytes=readE015IssuedSourceContinuation({context,root,request:binding.requestSnapshot,patch,current:args.current,
      question:leaf.question,relativePath:sourcePath});
    assert.ok(Buffer.isBuffer(bytes)&&bytes.equals(leaf.nativeSource.bytes),'historical view must be the issued source');
    // Current edition: whole question identical. Restored edition: identical except layoutTag.
    const view=label==='restored'?withoutLayoutTag:x=>x;
    assert.ok(stable(view(leaf.question))===stable(view(args.question)),'selected whole question must remain identical');
    save?.({context,leaf,patch});
    return receiptPath;
  };}
  function rejected(mutator){const args=input();mutator(args);assert.throws(()=>replayE015IssuedSourceContinuation({...args,revalidateLeaf:checkedCallback(args)}),/E015_ISSUED_SOURCE_CONTINUITY/);}
  function mutateFile(relative,change,run){const full=path.join(root,relative),before=fs.readFileSync(full);try{fs.writeFileSync(full,change(before));run();}finally{fs.writeFileSync(full,before);}}
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
  test('symlinked current source rejected',()=>{const full=path.join(root,sourcePath),backup=full+'.kept';fs.renameSync(full,backup);
    try{fs.symlinkSync(backup,full);}catch(e){fs.renameSync(backup,full);
      // Windows without symlink privilege cannot create the fixture; every other test still runs and counts.
      if(e.code==='EPERM'){console.log(`SKIP_ENV_EPERM [${label}] symlinked current source rejected (symlink creation not permitted)`);return 'skip';}throw e;}
    try{rejected(()=>{});}finally{fs.unlinkSync(full);fs.renameSync(backup,full);}});
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
  // A claim for the other edition must not authenticate against this HEAD tree and live file.
  const otherBlob=blobSha1===F14?RESTORED.git:F14;
  test('other edition claim rejected at this HEAD',()=>rejected(a=>{a.nativeSource.blobSha1=otherBlob;}));
}
// Exact pinned bytes of the two editions.
const f14Bytes=gitBuf(inputRoot,'cat-file','blob',`${TRANSPORT_COMMIT}:${sourcePath}`);
assert.equal(blobOf(f14Bytes),F14);
const f14World=makeWorld('current',TRANSPORT_COMMIT,rel=>gitBuf(inputRoot,'cat-file','blob',`${TRANSPORT_COMMIT}:${rel}`),F14);
const headNow=git(inputRoot,'rev-parse','HEAD');
const restoredWorld=makeWorld('restored',headNow,rel=>fs.readFileSync(path.join(inputRoot,rel)),RESTORED.git);
try {
  suite(f14World);
  assert.equal(restoredWorld.sourceBytes.length,RESTORED.bytes);
  assert.equal(crypto.createHash('sha256').update(restoredWorld.sourceBytes).digest('hex'),RESTORED.raw);
  assert.equal(blobOf(restoredWorld.sourceBytes),RESTORED.git);
  suite(restoredWorld);

  // The layoutTag-only comparison itself: f14aefb3ab edition against a candidate edition.
  const restoredBytes=restoredWorld.sourceBytes;
  function edit(bytes,fn,textFn=t=>t){
    const text=bytes.toString('utf8'),start=text.indexOf('[',text.indexOf('window.questionBank'));
    let end=text.lastIndexOf(']'),bank;
    while(end>start){try{bank=JSON.parse(text.slice(start,end+1));if(Array.isArray(bank))break;}catch{}end=text.lastIndexOf(']',end-1);}
    fn(bank);
    return Buffer.from(textFn(text.slice(0,start))+JSON.stringify(bank)+textFn(text.slice(end+1)));
  }
  const accepts=(bytes)=>assert.equal(assertE015LayoutTagOnlyEdition(f14Bytes,bytes),true);
  const rejects=(bytes)=>assert.throws(()=>assertE015LayoutTagOnlyEdition(f14Bytes,bytes),/E015_ISSUED_SOURCE_CONTINUITY/);
  const pass=(name,fn)=>{fn();passed++;console.log(`PASS [layoutTag-only] ${name}`);};
  pass('restored file differs from f14aefb3ab only by layoutTag and is accepted',()=>{
    const a=bankFromJson(f14Bytes),b=bankFromJson(restoredBytes);
    assert.equal(a.length,b.length);
    assert.equal(a.filter((q,i)=>stable(q)!==stable(b[i])).length,23);
    accepts(restoredBytes);
  });
  pass('identical edition and re-serialized restored edition are accepted',()=>{accepts(f14Bytes);accepts(edit(restoredBytes,()=>{}));});
  pass('content changed by one character rejected',()=>rejects(edit(restoredBytes,b=>{b[6].content=b[6].content.slice(0,-1)+(b[6].content.endsWith('?')?'!':'?');})));
  pass('answer changed rejected',()=>rejects(edit(restoredBytes,b=>{b[6].answer=b[6].answer+'0';})));
  pass('image changed rejected',()=>rejects(edit(restoredBytes,b=>{b[7].image=b[7].image.replace('q8','q7');})));
  pass('image attached after the bank changed rejected',()=>rejects(edit(restoredBytes,()=>{},t=>t.replace('q07-solution.svg','q07-solution-x.svg'))));
  pass('text before the bank changed rejected',()=>rejects(edit(restoredBytes,()=>{},t=>t.replace('window.examTitle = "24_','window.examTitle = "25_'))));
  pass('question added rejected',()=>rejects(edit(restoredBytes,b=>{b.push(structuredClone(b[23]));})));
  pass('question removed rejected',()=>rejects(edit(restoredBytes,b=>{b.pop();})));
  pass('non-layoutTag key added rejected',()=>rejects(edit(restoredBytes,b=>{b[3].extraKey='x';})));
  pass('non-layoutTag key removed rejected',()=>rejects(edit(restoredBytes,b=>{delete b[3].tags;})));
  pass('question order swapped rejected',()=>rejects(edit(restoredBytes,b=>{[b[3],b[4]]=[b[4],b[3]];})));
  pass('non-string layoutTag rejected',()=>rejects(edit(restoredBytes,b=>{b[0].layoutTag=5;})));
  console.log(JSON.stringify({schemaVersion:'e015-issued-source-continuity-focused-v2',passed,skippedEnvEperm:skipped,failed:0,ordinaryNativeExecutions:0,newApprovals:0,sourceWrites:0}));
} finally { for(const r of roots)fs.rmSync(r,{recursive:true,force:true}); }
