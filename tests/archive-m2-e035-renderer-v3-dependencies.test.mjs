import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {e035Fixture} from './helpers/m2-e035-renderer-fixture.mjs';
import {validateM2E035RendererContinuity} from '../archive/tools/meta-foundation/reviewed-m2-e035-renderer-continuity.mjs';

test('synthetic E035 v3 authenticates the pinned helper bytes and keeps returned references private',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'}),r=validateM2E035RendererContinuity(f.args);
  assert.equal(r.proof.studentUi.technicalSchemaVersion,'archive-e035-current-renderer-student-ui-technical-v3');
  assert.equal(r.proof.studentUi.fullPage,false);
  assert.equal(r.proof.studentUi.originalTileCount,4);
  assert.deepEqual(r.proof.studentUi.helperRef,f.technical.helperRef);
  r.proof.studentUi.helperRef.sha256='0'.repeat(64);
  assert.equal(validateM2E035RendererContinuity(f.args).proof.studentUi.helperRef.sha256,f.technical.helperRef.sha256);
});

test('v3 historical algorithm is distinct from the current served helper checkout',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'}),pin=structuredClone(f.technical.helperRef);
  assert.ok(validateM2E035RendererContinuity(f.args));
  f.put(f.uiHelperPath,'// Synthetic newer current helper; not the authenticated capture dependency.\n');f.commit();
  assert.deepEqual(validateM2E035RendererContinuity(f.args).proof.studentUi.helperRef,pin);
});

for(const [name,mutate,pattern] of [
  ['missing helper reference',v=>{delete v.helperRef;},/four actual current student UI cases/],
  ['wrong helper path',v=>{v.helperRef.path='tools/different-helper.cjs';},/exact v3 producer and historical tile helper/],
  ['wrong helper blob',v=>{v.helperRef.gitBlobSha1='1'.repeat(40);},/exact v3 producer and historical tile helper/],
  ['wrong helper raw digest',v=>{v.helperRef.sha256='1'.repeat(64);},/exact v3 producer and historical tile helper/],
  ['helper extra key',v=>{v.helperRef.verified=true;},/exact v3 producer and historical tile helper/],
  ['symbolic helper revision',v=>{v.helperRef.commit='HEAD';},/exact immutable commit required/],
  ['unavailable forty-hex helper commit',v=>{v.helperRef.commit='f'.repeat(40);},/immutable Git object or HEAD unavailable/],
  ['different algorithm version',v=>{v.helperVersion='archive-problem-scroll-coverage-v2';},/exact v3 producer and historical tile helper/],
  ['different driver',v=>{v.playwrightVersion='1.62.2';},/exact v3 producer and historical tile helper/],
  ['unsupported capture owner',v=>{v.executionOwner='ROOT_CLOUD_CHROME';},/exact v3 producer and historical tile helper/],
  ['unavailable producer commit',v=>{v.producerRef.commit='f'.repeat(40);},/immutable Git object or HEAD unavailable/],
])test('truthfully resealed v3 rejects '+name,t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});f.reseal('technical',mutate);
  assert.throws(()=>validateM2E035RendererContinuity(f.args),pattern);
});

test('v3 rejects exact helper bytes on an unrelated immutable branch',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});
  const unrelated=f.git('commit-tree',f.git('rev-parse','HEAD^{tree}'),'-m','Synthetic unrelated immutable helper');
  f.reseal('technical',v=>{v.helperRef.commit=unrelated;});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/immutable Git object or HEAD unavailable/);
});

test('v3 rejects an executable Git entry even when its immutable helper bytes are exact',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});fs.chmodSync(path.join(f.root,f.uiHelperPath),0o755);const executable=f.commit();
  f.reseal('technical',v=>{v.helperRef.commit=executable;});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/regular immutable blob required/);
});

test('v3 rejects a truthfully hashed replacement helper rather than approving an arbitrary new algorithm',t=>{
  const f=e035Fixture(t,{uiVersion:'v3'});f.put(f.uiHelperPath,'// Synthetic substituted capture algorithm.\n');const changed=f.commit();
  f.reseal('technical',v=>{v.helperRef=f.ref(changed,f.uiHelperPath);});
  assert.throws(()=>validateM2E035RendererContinuity(f.args),/exact v3 producer and historical tile helper/);
});
