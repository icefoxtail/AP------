import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createFilesToolTransport } from './gpt2-files-tool-transport.mjs';

test('connected Files transport only uploads create-only, then reads raw materialized bytes', async t=>{
 const tmp=await fs.mkdtemp(path.join(os.tmpdir(),'gpt2-files-'));t.after(()=>fs.rm(tmp,{recursive:true,force:true}));
 const root=new Map();const calls=[];
 const files={
  async files__list({library_path}) {
    return {items:[...root.entries()].filter(([p])=>path.posix.dirname(p)===library_path).map(([p,v])=>({kind:'file',path:p,file_id:v.fileId})),warnings:[],next_cursor:null};
  },
  async files__materialize({items}) {
    const fileId=items[0].file_ref.file_id;
    const entry=[...root.values()].find(x=>x.fileId===fileId);
    if(!entry)throw Error('NOT_FOUND');
    const target=path.join(tmp,fileId+'.json');await fs.writeFile(target,entry.bytes);
    return {artifacts:[{path:target}],warnings:[]};
  },
  async files__manage_library({operations}) {
    calls.push(operations);
    if(operations[0].operation==='delete')return {results:[{status:'succeeded'}]};
    assert.equal(operations[0].operation,'create_folder');
    assert.equal(operations[1].operation,'upload');
    assert.equal(operations[1].overwrite,undefined);
    const wanted=operations[1].destination_path;
    const bytes=await fs.readFile(operations[1].container_path);
    let actual=wanted;
    if(root.has(wanted))actual=wanted.replace('.json','(1).json');
    const fileId=String(root.size + 1);
    root.set(actual,{bytes,fileId});
    return {results:[{status:'succeeded'},{status:'succeeded',path:actual,file_id:fileId}],warnings:[]};
  },
 };
 const transport=createFilesToolTransport({files,scratchDirectory:tmp});
 const p='/Archive2-GPT/generations/H1_GPT2_20261006/B/23_금당고_1학기_중간_고1_기출/TECHNICAL/GPT2_V2/commits/R2-'+ 'a'.repeat(40)+'.json';
 assert.equal(await transport.getRaw(p),null);
 const bytes=Buffer.from('verified remote bytes');
 assert.equal((await transport.uploadCreateOnly(p,bytes)).path,p);
 assert.deepEqual(await transport.getRaw(p),bytes);
 assert.equal((await transport.uploadCreateOnly(p,bytes)).path,p.replace('.json','(1).json'));
 assert.equal(calls.length,2);
});

test('Files adapter refuses metadata in place of materialized remote bytes',async()=>{
 const files={files__list:async()=>({items:[{kind:'file',path:'/x/y.json',file_id:'1'}],warnings:[],next_cursor:null}),files__materialize:async()=>({artifacts:[],warnings:[]}),files__manage_library:async()=>{}};
 const t=createFilesToolTransport({files});
 await assert.rejects(()=>t.getRaw('/x/y.json'),/LIBRARY_MATERIALIZE_FAILED/);
});