import test from 'node:test';
import assert from 'node:assert/strict';
import {createImmutableGitMetadataLookup} from '../archive/tools/meta-foundation/immutable-git-metadata.mjs';

const commit='a'.repeat(40), object='b'.repeat(40), raw=Buffer.from(object+'\n');

test('immutable lookup shares only exact commit/path names in one bounded process cache',()=>{
  const lookup=createImmutableGitMetadataLookup(2);let reads=0;
  const read=()=>{reads++;return Buffer.from(raw);};
  const args=['rev-parse',commit+':archive/proof.json'];
  assert.deepEqual(lookup('/one',args,read),raw);
  assert.deepEqual(lookup('/one',args,read),raw);assert.equal(reads,1);
  lookup('/two',args,read);assert.equal(reads,2);
  lookup('/one',['rev-parse',commit+':archive/another.json'],read);
  lookup('/one',args,read);assert.equal(reads,4);
});

test('immutable lookup never caches raw blob reads or symbolic names',()=>{
  const lookup=createImmutableGitMetadataLookup();let reads=0;
  const read=()=>Buffer.from(String(++reads));
  for(const args of [['show',commit+':proof'],['cat-file','blob',object],['rev-parse','HEAD:proof'],
    ['rev-parse','--verify','HEAD^{commit}'],['rev-parse',commit+':../proof']]) {
    const first=lookup('/one',args,read),second=lookup('/one',args,read);
    assert.notDeepEqual(first,second);
  }
  assert.equal(reads,10);
});

test('immutable lookup retains neither failure nor malformed or nonexact commit output',()=>{
  const lookup=createImmutableGitMetadataLookup();let reads=0;
  const args=['rev-parse','--verify',commit+'^{commit}'];
  assert.throws(()=>lookup('/one',args,()=>{reads++;throw Error('missing');}),/missing/);
  for(const value of ['missing\n',object+'\n'])
    assert.equal(lookup('/one',args,()=>{reads++;return Buffer.from(value);}).toString(),value);
  assert.equal(lookup('/one',args,()=>{reads++;return Buffer.from(commit+'\n');}).toString(),commit+'\n');
  lookup('/one',args,()=>{throw Error('should reuse exact metadata');});
  assert.equal(reads,4);
});

test('immutable lookup privately copies successful object-name outputs',()=>{
  const lookup=createImmutableGitMetadataLookup(), args=['rev-parse',commit+':proof.json'];
  const supplied=Buffer.from(raw), first=lookup('/one',args,()=>supplied);
  supplied.fill(0);first.fill(0);
  const second=lookup('/one',args,()=>{throw Error('unexpected metadata re-read');});
  assert.deepEqual(second,raw);second.fill(0);
  assert.deepEqual(lookup('/one',args,()=>{throw Error('unexpected metadata re-read');}),raw);
});
