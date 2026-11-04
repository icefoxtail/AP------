import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import portable from './portable-root.cjs';
const root=portable.repoRoot(), here=path.dirname(fileURLToPath(import.meta.url));
const source='archive/exams/original/middle/m2/2final/21_향림중_2학기_기말_중2_수학.js';
test('examData question alias and exact legacy image paths retain complete source data',()=>{
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'packet 한글 '));
  const local=path.join(root,'.tmp',`packet-test-${process.pid}-${Date.now()}.js`);
  try{
    const output=path.join(temp,'packet.json');
    const run=(src)=>spawnSync(process.execPath,[path.join(here,'make-packet.mjs'),src,output,'--with-existing'],{cwd:root,env:{...process.env,APMS_ROOT:root},encoding:'utf8'});
    const result=run(path.join(root,source));assert.equal(result.status,0,result.stderr);
    const packet=JSON.parse(fs.readFileSync(output,'utf8'));
    const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,source),'utf8'),context);
    const bank=context.window.examData.questions;assert.equal(packet.sourcePath,source);assert.equal(packet.items.length,bank.length);
    for(const [index,q] of bank.entries()){
      const item=packet.items[index];assert.equal(item.ord,q.id);assert.equal(item.content,q.content||q.question);
      for(const key of ['choices','answer','solution']) assert.equal(JSON.stringify(item[key]),JSON.stringify(q[key]));
    }
    const item=packet.items[0];assert.equal(item.questionImageSource,bank[0].image);
    assert.equal(item.questionImage,path.join(path.dirname(path.join(root,source)),bank[0].image));
    assert.equal(item.inlineImages[0].src,bank[0].image);assert.equal(item.inlineImages[0].path,item.questionImage);
    fs.writeFileSync(output,'sentinel');
    fs.writeFileSync(local,'window.questionBank=[{id:1,question:""}]');
    assert.notEqual(run(local).status,0);assert.equal(fs.readFileSync(output,'utf8'),'sentinel');
  }finally{fs.rmSync(local,{force:true});fs.rmSync(temp,{recursive:true,force:true});}
});
