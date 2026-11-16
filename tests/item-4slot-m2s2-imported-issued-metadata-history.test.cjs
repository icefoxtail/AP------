'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fixture,run,cold,mod,contract,sp,cp}=require('./helpers/m2s2-imported-metadata-fixture.cjs');
const denied=index=>{assert.equal(index.records.length,0);assert.ok(index.pending.length);};
test('unchanged metadata successor revalidates warm and cold',t=>{const f=fixture(t);mod.run(f.root,{write:true});const warm=mod.run(f.root,{check:true});assert.equal(warm.counts.registered,2);assert.equal(cold(f).records.length,2);});
for(const what of ['marker','carrier','request-copy','receipt','native-copy','historical-proof'])test('warm and cold deletion of '+what+' stays closed',t=>{
  const f=fixture(t);mod.run(f.root,{write:true});
  if(what==='marker'){delete f.data.evidence[contract.GROUP];f.write();}
  else {const p=what==='carrier'?f.carrierPath:what==='request-copy'?f.requestCopy:what==='receipt'?f.receiptPath:what==='native-copy'?f.copyPath:f.proof.historicalEvidenceRefs[0].path;fs.rmSync(path.join(f.root,p));}
  denied(run(f).index);denied(cold(f));
});
