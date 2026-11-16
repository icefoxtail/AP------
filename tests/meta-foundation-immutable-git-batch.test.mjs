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
  for(const p of ['missing.bin','link.bin','folder'])assert.throws(()=>readImmutableGitFiles(root,[{commit,path:p}]),/immutable/);
  for(const p of ['../binary.bin','binary.bin\nother','/binary.bin'])assert.throws(()=>readImmutableGitFiles(root,[{commit,path:p}]),/safe file path/);
  assert.throws(()=>readImmutableGitFiles(root,[{commit:'HEAD',path:'binary.bin'}]),/exact commit/);
});

test('binary batch decoder retains exact duplicate object frames',()=>{
  assert.deepEqual(decodeImmutableGitBatch(Buffer.concat([frame(),frame()]),[entry,entry]),[raw,raw]);
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
