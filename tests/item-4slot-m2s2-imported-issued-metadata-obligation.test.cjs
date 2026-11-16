'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {fixture,run,cold,mod,contract,sp,cp}=require('./helpers/m2s2-imported-metadata-fixture.cjs');
const denied=index=>{assert.equal(index.records.length,0);assert.ok(index.pending.length);};
test('committed removal of marker and all new proof files retains the history obligation',t=>{const f=fixture(t);f.commitCurrent();delete f.data.evidence[contract.GROUP];f.write();for(const p of [f.carrierPath,f.requestCopy,f.copyPath,f.receiptPath])fs.rmSync(path.join(f.root,p));f.commit('committed stripping');denied(run(f).index);denied(cold(f));});
test('committed empty-carrier replacement retains the history obligation',t=>{const f=fixture(t);f.commitCurrent();delete f.data.evidence[contract.GROUP];f.write();f.save(f.carrierPath,{});f.commit('empty carrier');denied(cold(f));});
test('literal slot rows cannot be rewritten alongside metadata binding',t=>{const f=fixture(t);f.data.items[0].given=[1];f.write();denied(run(f).index);});
test('existing registrationHold cannot be removed',t=>{const f=fixture(t);delete f.data.items[1].registrationHold;f.write();denied(run(f).index);});
test('candidate terms and old reviewer remain literal',t=>{const f=fixture(t);f.data.items[2].candidates=[];f.data.reviewedBy.agent='different';f.write();denied(run(f).index);});
test('changing the source header is not the successor',t=>{const f=fixture(t);f.data.sourceGitBlobSha=mod.blob(f.bytes(sp));f.write();denied(run(f).index);});
test('missing historical evidence coverage is rejected',t=>{const f=fixture(t,{changeProof:p=>p.historicalEvidenceRefs.pop()});denied(run(f).index);});
test('later untouched source/code commit preserves exact live revalidation',t=>{const f=fixture(t);f.commitCurrent();f.save('docs/unrelated.txt','unrelated descendant');f.commit('source unchanged descendant');assert.equal(run(f).index.records.length,2);});
test('unavailable actual HEAD cannot erase the new obligation',t=>{const f=fixture(t);const head=path.join(f.root,'.git/HEAD');fs.writeFileSync(head,'ref: refs/heads/absent\n');denied(run(f).index);});
test('restoring old source and compact while deleting the new proof still retains the issued obligation',t=>{
  const f=fixture(t);f.commitCurrent();f.save(sp,f.js(f.before));f.save(cp,f.literal);
  for(const p of [f.carrierPath,f.requestCopy,f.copyPath,f.receiptPath])fs.rmSync(path.join(f.root,p));
  f.commit('restore old bytes and remove metadata successor');const r=cold(f);denied(r);assert.ok(r.pending.some(x=>x.reason.includes('M2_IMPORTED_METADATA_OBLIGATION_REQUIRED')));
});
test('a second-parent-only carrier cannot be hidden by a merge that restores old bytes',t=>{
  const f=fixture(t),issued=f.commitCurrent();f.git('checkout','--detach',f.priorCommit);
  f.git('-c','user.name=Fixture','-c','user.email=fixture@example.invalid','merge','--no-ff','--no-commit',issued);
  f.save(sp,f.js(f.before));f.save(cp,f.literal);for(const p of [f.carrierPath,f.requestCopy,f.copyPath,f.receiptPath])fs.rmSync(path.join(f.root,p));
  f.commit('merge while stripping successor artifacts');const r=cold(f);denied(r);assert.ok(r.pending.some(x=>x.reason.includes('M2_IMPORTED_METADATA_OBLIGATION_REQUIRED')));
});
for(const kind of ['source','asset','receipt'])test('current HEAD '+kind+' drift cannot be hidden by stale live bytes',t=>{
  const f=fixture(t);f.commitCurrent();const p=kind==='source'?sp:kind==='asset'?f.oldAssets[2]:f.receiptPath,old=f.bytes(p);
  f.save(p,Buffer.concat([old,Buffer.from(' ')]));f.commit('committed current '+kind+' bytes differ');f.save(p,old);
  const r=run(f).index;denied(r);assert.ok(r.pending.some(x=>x.reason.includes('M2_IMPORTED_METADATA_CURRENT_HEAD_BYTES')));
});
