'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fixture,run,cold,mod,contract,cp}=require('./helpers/m2s2-repaired-metadata-fixture.cjs');
for(const warm of [false,true])for(const fault of ['marker','carrier','old-negative','issued-receipt','native-copy','vector'])test((warm?'warm':'cold')+' repaired metadata rejects missing or changed '+fault,t=>{
 const f=fixture(t);if(warm)mod.run(f.root,{write:true});
 if(fault==='marker'){delete f.data.evidence[contract.GROUP];f.write();}
 if(fault==='carrier')fs.unlinkSync(path.join(f.root,f.carrierPath));
 if(fault==='old-negative')fs.unlinkSync(path.join(f.root,f.rootPath));
 if(fault==='issued-receipt')fs.unlinkSync(path.join(f.root,f.receiptPath));
 if(fault==='native-copy')fs.unlinkSync(path.join(f.root,f.copyPath));
 if(fault==='vector'){f.data.items[1].method=[2];f.write();}
 const x=warm?run(f).index:cold(f);assert.equal(x.records.length,0,JSON.stringify(x.pending));assert.ok(x.pending.some(r=>/M2_(?:REPAIRED_METADATA|CURRENT_REPAIR|CURRENT_CONTINUITY)_/.test(r.reason)),JSON.stringify(x.pending));
});
test('committed removal of all successor proofs cannot erase the inherited negative obligation',t=>{
 const f=fixture(t);f.commitCurrent();
 for(const key of ['currentM2RepairMetadataContinuity','currentM2RepairClosure','currentM2Continuity'])delete f.data.evidence[key];f.write();
 for(const p of [f.carrierPath,f.requestCopy,f.repairCarrierPath,f.rootPath,f.rawRootPath])fs.unlinkSync(path.join(f.root,p));
 f.commit('synthetic committed proof stripping');
 const x=cold(f);assert.equal(x.records.length,0);assert.ok(x.pending.some(r=>/OBLIGATION_REQUIRED/.test(r.reason)),JSON.stringify(x.pending));
});
for(const warm of [false,true])for(const role of ['carrier','issued-request-copy','native-review-copy'])test((warm?'warm':'cold')+' committed HEAD loss cannot be masked by restored live '+role,t=>{
 const f=fixture(t);f.commitCurrent();if(warm)mod.run(f.root,{write:true});
 const target={carrier:f.carrierPath,'issued-request-copy':f.requestCopy,'native-review-copy':f.copyPath}[role],raw=f.bytes(target);
 // Remove only the current tree entry; the exact regular live file remains.
 f.git('rm','--cached','--',target);f.git('commit','--allow-empty','-qm','synthetic committed evidence loss with live bytes restored');
 assert.deepEqual(f.bytes(target),raw);assert.equal(fs.lstatSync(path.join(f.root,target)).isFile(),true);
 const x=warm?run(f).index:cold(f);assert.equal(x.records.length,0,JSON.stringify(x.pending));
 assert.ok(x.pending.some(r=>r.reason==='M2_REPAIRED_METADATA_CURRENT_HEAD_REGULAR_FILE'),JSON.stringify(x.pending));
});
