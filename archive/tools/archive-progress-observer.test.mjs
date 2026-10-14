import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTENTS_API_INLINE_LIMIT,readStatus,executeOnce} from './archive-progress-observer.mjs';

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


test('executeOnce retains all prior 180 observations when new run rows are added',async()=>{
 const observations={};
 for(let i=0;i<180;i++){
  const id=800000+i,sha=String(i+1).padStart(40,'0'),key='registration:'+id+':1:'+sha;
  observations[key]={key,status:'unverified',attempts:4,run:{id,attempt:1,sha,at:'2026-10-13T03:35:19Z',
   url:'https://github.com/icefoxtail/AP------/actions/runs/'+id,conclusion:'success',event:'push',branch:'main'},
   reason:'현재 실행 차수 증거 없음',retryExhausted:true};
 }
 const old={schema:1,updatedAt:'2026-10-13T03:35:19Z',entries:{},observations};
 const raw=JSON.stringify(old),newRuns=Array.from({length:10},(_,i)=>{
  const id=900000+i,sha=String(id).padStart(40,'0');
  return {id,run_attempt:1,event:'push',conclusion:'success',head_sha:sha,
   updated_at:new Date(Date.parse('2026-10-14T14:00:00Z')+i*1000).toISOString(),
   html_url:'https://github.com/icefoxtail/AP------/actions/runs/'+id,head_branch:'main',pull_requests:[]};
 });
 let written=null;
 const api=async route=>{
  if(route.startsWith('/contents/'))return {sha:'status-blob',size:Buffer.byteLength(raw),encoding:'base64',content:encode(raw)};
  if(route.startsWith('/pulls?'))return [];
  if(route.startsWith('/actions/workflows/archive-registration-sync.yml/runs?'))return {workflow_runs:newRuns};
  if(route.startsWith('/actions/workflows/archive-pages-release.yml/runs?'))return {workflow_runs:[]};
  throw Error('unexpected API route '+route);
 };
 await executeOnce({api,getEvidence:async()=>null,clock:()=> '2026-10-14T14:01:00.000Z',
  storeStatus:async value=>{written=value;}});
 assert.ok(written);
 for(const [key,value] of Object.entries(observations))assert.deepEqual(written.observations[key],value);
 assert.equal(Object.keys(written.observations).length,190);
});
