import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTENTS_API_INLINE_LIMIT,readStatus} from './archive-progress-observer.mjs';

const encode=value=>Buffer.from(typeof value==='string'?value:JSON.stringify(value),'utf8').toString('base64');

function durableFixture(){
 const entries=Object.fromEntries(Array.from({length:142},(_,i)=>['exam-'+i,{exam:'exam-'+i,main:{result:'완료',sha:String(i).padStart(40,'0')}}]));
 const observations=Object.fromEntries(Array.from({length:180},(_,i)=>['registration:'+i,{key:'registration:'+i,status:'verified',attempt:i}]));
 return {schema:1,updatedAt:'2026-10-14T09:02:55.617Z',entries,observations,padding:'x'.repeat(CONTENTS_API_INLINE_LIMIT)};
}

test('large Contents response uses its Git Blob SHA and preserves all stored records',async()=>{
 const original=durableFixture();
 const raw=JSON.stringify(original);
 const size=Buffer.byteLength(raw,'utf8');
 assert.ok(size>CONTENTS_API_INLINE_LIMIT);
 const calls=[];
 const value=await readStatus(async route=>{
  calls.push(route);
  if(route.startsWith('/contents/'))return {sha:'blob-large',size,encoding:'none',content:''};
  if(route==='/git/blobs/blob-large')return {sha:'blob-large',size,encoding:'base64',content:encode(raw)};
  throw Error('unexpected API route '+route);
 });
 assert.deepEqual(calls,['/contents/archive-progress.json?ref=archive-progress-state','/git/blobs/blob-large']);
 assert.equal(value.sha,'blob-large');
 assert.deepEqual(value.value,original);
 assert.equal(Object.keys(value.value.entries).length,142);
 assert.equal(Object.keys(value.value.observations).length,180);
});

test('small base64 Contents response is decoded inline without a blob request',async()=>{
 const original={schema:1,entries:{small:{exam:'small'}},observations:{}};
 const raw=JSON.stringify(original);
 let calls=0;
 const value=await readStatus(async route=>{
  calls++;
  assert.equal(route,'/contents/archive-progress.json?ref=archive-progress-state');
  return {sha:'blob-small',size:Buffer.byteLength(raw),encoding:'base64',content:encode(raw)};
 });
 assert.equal(calls,1);
 assert.deepEqual(value.value,original);
});

test('encoding none selects Git Blob even when the file is below the size limit',async()=>{
 const raw='{"entries":{},"observations":{}}';
 const calls=[];
 const value=await readStatus(async route=>{
  calls.push(route);
  if(route.startsWith('/contents/'))return {sha:'blob-none',size:Buffer.byteLength(raw),encoding:'none',content:''};
  return {sha:'blob-none',size:Buffer.byteLength(raw),encoding:'base64',content:encode(raw)};
 });
 assert.equal(value.value.entries && Object.keys(value.value.entries).length,0);
 assert.equal(calls[1],'/git/blobs/blob-none');
});

test('unexpected Git Blob encoding fails closed instead of parsing empty Contents content',async()=>{
 await assert.rejects(()=>readStatus(async route=>{
  if(route.startsWith('/contents/'))return {sha:'blob-bad',size:CONTENTS_API_INLINE_LIMIT+1,encoding:'none',content:''};
  return {sha:'blob-bad',size:0,encoding:'none',content:''};
 }),/Git Blob response is not base64 content/);
});
