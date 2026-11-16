import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {decodeImmutableGitBatch,readImmutableGitFiles,forEachImmutableGitFile} from '../archive/tools/meta-foundation/immutable-git-batch.mjs';

const oid = raw => crypto.createHash('sha1').update(`blob ${raw.length}\0`).update(raw).digest('hex');
const raw = Buffer.from([0,10,65,255,10]), entry = {objectId:oid(raw),size:raw.length};
const frame = (body=raw,header=`${entry.objectId} blob ${entry.size}`) => Buffer.concat([Buffer.from(header+'\n'),body,Buffer.from('\n')]);

test('immutable batch preserves binary bytes, duplicate reads, and caller order',t=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'immutable-git-files-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  git('init','-q');fs.writeFileSync(path.join(root,'binary.bin'),raw);fs.writeFileSync(path.join(root,'문자 file.txt'),'text\n');
  fs.mkdirSync(path.join(root,'folder'));fs.writeFileSync(path.join(root,'folder/file.txt'),'nested');
  fs.symlinkSync('binary.bin',path.join(root,'link.bin'));
  git('add','.');git('-c','user.name=Batch fixture','-c','user.email=fixture@example.invalid','commit','-qm','Immutable file fixture');
  const commit=git('rev-parse','HEAD');
  const originalExec=childProcess.execFileSync, reads={commit:0,inventory:0,raw:0};
  childProcess.execFileSync=function(command,args,options){
    if(command==='git'&&options?.cwd===root){
      if(args[0]==='rev-parse')reads.commit++;
      if(args[0]==='--literal-pathspecs')reads.inventory++;
      if(args[0]==='cat-file')reads.raw++;
    }
    return originalExec.call(this,command,args,options);
  };
  syncBuiltinESMExports();
  t.after(()=>{childProcess.execFileSync=originalExec;syncBuiltinESMExports();});
  const inputs=['문자 file.txt','binary.bin','binary.bin'].map(p=>({commit,path:p}));
  assert.deepEqual(readImmutableGitFiles(root,inputs),[Buffer.from('text\n'),raw,raw]);
  const streamed=[];
  forEachImmutableGitFile(root,inputs,(bytes,index)=>{assert.equal(index,streamed.length);streamed.push(bytes);});
  assert.deepEqual(streamed,[Buffer.from('text\n'),raw,raw]);
  // Every invocation reads the regular-file inventory and raw objects again;
  // only the exact immutable commit name is shared. A live working file never
  // replaces a missing historical object.
  fs.writeFileSync(path.join(root,'binary.bin'),'live bytes changed');
  assert.deepEqual(readImmutableGitFiles(root,inputs),[Buffer.from('text\n'),raw,raw]);
  assert.deepEqual(reads,{commit:1,inventory:3,raw:3});
  for(const p of ['missing.bin','link.bin','folder']) {
    assert.throws(()=>readImmutableGitFiles(root,[{commit,path:p}]),/immutable/);
    let callbacks=0;
    assert.throws(()=>forEachImmutableGitFile(root,[{commit,path:p}],()=>callbacks++),/immutable/);
    assert.equal(callbacks,0);
  }
  for(const p of ['../binary.bin','binary.bin\nother','/binary.bin'])assert.throws(()=>readImmutableGitFiles(root,[{commit,path:p}]),/safe file path/);
  assert.throws(()=>readImmutableGitFiles(root,[{commit:'HEAD',path:'binary.bin'}]),/exact commit/);
});

test('binary batch decoder retains exact duplicate object frames',()=>{
  assert.deepEqual(decodeImmutableGitBatch(Buffer.concat([frame(),frame()]),[entry,entry]),[raw,raw]);
});

test('allocating decoder keeps independent body bytes after full validation',()=>{
  const output=Buffer.concat([frame(),frame()]),before=Buffer.from(output);
  const result=decodeImmutableGitBatch(output,[entry,entry]);
  result[0][0]=42;
  assert.deepEqual(output,before);
  assert.deepEqual(result[1],raw);
});

function viewFixture(t) {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'immutable-git-views-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const git=(...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const bodies=[Buffer.alloc(256*1024,65),Buffer.alloc(128*1024,0)];bodies[1][1]=255;
  git('init','-q');
  for(const[i,body]of bodies.entries())fs.writeFileSync(path.join(root,`${i}.bin`),body);
  git('add','.');git('-c','user.name=Batch fixture','-c','user.email=fixture@example.invalid','commit','-qm','Verified view fixture');
  const commit=git('rev-parse','HEAD');
  return {root,bodies,inputs:bodies.map((_,i)=>({commit,path:`${i}.bin`}))};
}

test('hydration reads the same fresh Git bytes without a second body copy',t=>{
  const {root,bodies,inputs}=viewFixture(t),ordered=[inputs[0],inputs[1],inputs[0]];
  const originalExec=childProcess.execFileSync,outputs=[],reads={inventory:0,raw:0};
  childProcess.execFileSync=function(command,args,options){
    const result=originalExec.call(this,command,args,options);
    if(command==='git'&&options?.cwd===root){
      if(args[0]==='--literal-pathspecs')reads.inventory++;
      if(args[0]==='cat-file'){reads.raw++;outputs.push(result);}
    }
    return result;
  };
  syncBuiltinESMExports();
  t.after(()=>{childProcess.execFileSync=originalExec;syncBuiltinESMExports();});
  const allocated=readImmutableGitFiles(root,ordered),views=[];
  forEachImmutableGitFile(root,ordered,(body,index)=>{assert.equal(index,views.length);views.push(body);});
  const expected=[bodies[0],bodies[1],bodies[0]];
  assert.deepEqual(allocated,expected);assert.deepEqual(views,expected);
  assert.deepEqual(reads,{inventory:2,raw:2});
  assert.deepEqual(outputs[0],outputs[1]);
  const borrows=(body,batch)=>body.buffer===batch.buffer&&body.byteOffset>=batch.byteOffset&&
    body.byteOffset+body.length<=batch.byteOffset+batch.length;
  assert.ok(allocated.every(body=>!borrows(body,outputs[0])));
  assert.ok(views.every(body=>borrows(body,outputs[1])));
  const inputBodyBytes=expected.reduce((n,body)=>n+body.length,0);
  const copiedBodyBytes=(values,batch)=>values.reduce((n,body)=>n+(borrows(body,batch)?0:body.length),0);
  assert.equal(copiedBodyBytes(allocated,outputs[0]),inputBodyBytes);
  assert.equal(copiedBodyBytes(views,outputs[1]),0);
  t.diagnostic(JSON.stringify({measurement:'fresh-fixture-body-ownership',inputBodyBytes,
    allocatingCopiedBodyBytes:copiedBodyBytes(allocated,outputs[0]),hydrationCopiedBodyBytes:copiedBodyBytes(views,outputs[1]),
    freshInventoryReads:reads.inventory,freshRawReads:reads.raw,elapsedTimeOrRssClaim:false}));
});

test('hydration invokes no consumer when the final object or trailing boundary is corrupt',t=>{
  const {root,bodies,inputs}=viewFixture(t),originalExec=childProcess.execFileSync;
  let transform=output=>output;
  childProcess.execFileSync=function(command,args,options){
    const result=originalExec.call(this,command,args,options);
    return command==='git'&&options?.cwd===root&&args[0]==='cat-file'?transform(result):result;
  };
  syncBuiltinESMExports();
  t.after(()=>{childProcess.execFileSync=originalExec;syncBuiltinESMExports();});
  const lastHeader=Buffer.byteLength(`${oid(bodies[0])} blob ${bodies[0].length}\n`)+bodies[0].length+1;
  for(const[name,change]of [
    ['last body',output=>{const changed=Buffer.from(output);changed[changed.length-2]^=1;return changed;}],
    ['last type',output=>{const changed=Buffer.from(output);changed.write('tree',lastHeader+41,'ascii');return changed;}],
    ['last delimiter',output=>output.subarray(0,-1)],
    ['trailing bytes',output=>Buffer.concat([output,Buffer.from('unexpected')])]
  ]){
    transform=change;let callbacks=0;
    assert.throws(()=>forEachImmutableGitFile(root,inputs,()=>callbacks++),/immutable Git batch/,name);
    assert.equal(callbacks,0,name);
  }
  transform=output=>output;const recovered=[];
  forEachImmutableGitFile(root,inputs,body=>recovered.push(body));
  assert.deepEqual(recovered,bodies);
});

for(const[name,output]of [
  ['wrong order or object ID',frame(raw,`${'a'.repeat(40)} blob ${raw.length}`)],
  ['non-blob type',frame(raw,`${entry.objectId} tree ${raw.length}`)],
  ['wrong declared size',frame(raw,`${entry.objectId} blob ${raw.length+1}`)],
  ['missing object',Buffer.from(`${entry.objectId} missing\n`)],
  ['truncated object',frame().subarray(0,-2)],
  ['wrong bytes under original object ID',frame(Buffer.from([0,10,66,255,10]))],
  ['extra trailing object',Buffer.concat([frame(),frame()])],
  ['missing header',Buffer.alloc(0)]
])test('immutable batch decoder refuses '+name,()=>{
  assert.throws(()=>decodeImmutableGitBatch(output,[entry]),/immutable Git batch/);
});
