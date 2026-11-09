import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import {servedSourceEntries,compareServedBytes,queueServedResponse,drainServedSourceChecks,verifyServedSources} from './middle-initial-served-source.mjs';

const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const base = 'https://icefoxtail.github.io/AP------/apmath/playground/next/labs/';
const files = [
  {path:'apmath/playground/next/kit/apl-shell.js',sha256:hash('shell')},
  {path:'apmath/playground/next/labs/g7-circle-sector.html',sha256:hash('html')},
  {path:'apmath/playground/next/labs/g7-circle-sector/f01.js',sha256:hash('figure')}
];

test('public source URLs retain the repository prefix for shared assets and scene modules',()=>{
  assert.deepEqual(servedSourceEntries(files,base).map(f=>f.url),[
    'https://icefoxtail.github.io/AP------/apmath/playground/next/kit/apl-shell.js',
    base+'g7-circle-sector.html',base+'g7-circle-sector/f01.js'
  ]);
  assert.throws(()=>servedSourceEntries([{path:'../secrets',sha256:'x'}],base),/outside/);
});

test('successful HTTP with stale rendered source is a failed deployment verification',()=>{
  const file=servedSourceEntries(files,base)[2];
  assert.equal(compareServedBytes(file,Buffer.from('figure'),200).pass,true);
  assert.equal(compareServedBytes(file,Buffer.from('old-hidden-figure'),200).pass,false);
  assert.equal(compareServedBytes(file,Buffer.from('figure'),404).pass,false);
});

test('every expected file is checked and missing bytes cannot inherit another file PASS',async()=>{
  const calls=[];
  const request=async(url)=>{
    calls.push(url);const content=url.endsWith('f01.js')?'old':url.endsWith('.html')?'html':'shell';
    return new Response(content,{status:200});
  };
  const result=await verifyServedSources(files,base,request);
  assert.equal(calls.length,3);assert.equal(result.status,'FAIL');
  assert.deepEqual(result.files.map(f=>f.pass),[true,true,false]);
  assert.equal(result.files[2].expectedSha256,files[2].sha256);
});

test('network errors and non-200 files remain explicit failed source checks',async()=>{
  const result=await verifyServedSources(files,base,async(url)=>{
    if(url.endsWith('.html'))throw Error('connection unavailable');
    return new Response('unavailable',{status:503});
  });
  assert.equal(result.status,'FAIL');assert.equal(result.files.length,3);
  assert.ok(result.files.every(f=>!f.pass));assert.match(result.files[1].error,/connection unavailable/);
});

test('an empty expected manifest cannot become a vacuous source PASS',async()=>{
  assert.throws(()=>servedSourceEntries([],base),/Empty expected source manifest/);
  let called=false;
  await assert.rejects(verifyServedSources([],base,async()=>{called=true;return new Response('');}),/Empty expected source manifest/);
  assert.equal(called,false);
});

const response = (url,bytes,status=200) => ({url:()=>url,status:()=>status,body:async()=>Buffer.from(bytes)});

test('the actual audit response handler checks later documents and modules at an already-seen path',async()=>{
  const source=fs.readFileSync(new URL('./middle-initial-figure-audit.mjs',import.meta.url),'utf8');
  const begin=source.indexOf("if(baseURL)page.on('response',response=>{");
  const end=source.indexOf('        await page.addInitScript',begin);
  assert.ok(begin>=0&&end>begin,'the production response registration is present');
  const callbacks={},page={on:(event,fn)=>{callbacks[event]=fn;}},sourceChecks=[];
  const servedLookup=new Map(servedSourceEntries(files,base).map(file=>[file.url,file]));
  // Run the production registration with a response emitter. No browser or
  // deployment result is inferred from this deterministic source-binding test.
  new Function('baseURL','page','servedLookup','sourceChecks','queueServedResponse','loadedPaths','compareServedBytes',source.slice(begin,end))
    (base,page,servedLookup,sourceChecks,queueServedResponse,new Set(),compareServedBytes);
  const html=base+'g7-circle-sector.html',module=base+'g7-circle-sector/f01.js';
  callbacks.response(response(html+'?initial-inventory=1','html'));
  callbacks.response(response(module,'figure'));
  assert.deepEqual((await drainServedSourceChecks(sourceChecks)).map(x=>x.pass),[true,true]);
  callbacks.response(response(html+'?initial-document=2','stale or changed HTML'));
  callbacks.response(response(module,'stale or changed figure'));
  callbacks.response(response(module,'figure'));
  const later=await drainServedSourceChecks(sourceChecks);
  assert.equal(later.length,3,'every later response has its own byte verification');
  assert.deepEqual(later.map(x=>x.pass),[false,false,true]);
  assert.equal(later[0].url,html+'?initial-document=2','the actual response URL is retained');
});

test('a flush drains source checks appended while a previous response body is awaited',async()=>{
  const pending=[],lookup=new Map(servedSourceEntries(files,base).map(file=>[file.url,file]));
  queueServedResponse({url:()=>base+'g7-circle-sector.html',status:()=>200,body:async()=>{
    queueServedResponse(response(base+'g7-circle-sector/f01.js','changed'),lookup,pending);
    return Buffer.from('html');
  }},lookup,pending);
  const results=await drainServedSourceChecks(pending);
  assert.deepEqual(results.map(x=>x.pass),[true,false]);
  assert.equal(pending.length,0);
});

test('every failed actual response body remains a failed record after a matching response',async()=>{
  const pending=[],lookup=new Map(servedSourceEntries(files,base).map(file=>[file.url,file])),url=base+'g7-circle-sector/f01.js';
  queueServedResponse(response(url,'figure'),lookup,pending);
  queueServedResponse(response(url,'figure',503),lookup,pending);
  queueServedResponse({url:()=>url,status:()=>200,body:()=>{throw Error('body unavailable');}},lookup,pending);
  assert.equal(queueServedResponse(response('https://example.org/external.js','external'),lookup,pending),false);
  const results=await drainServedSourceChecks(pending);
  assert.deepEqual(results.map(x=>x.pass),[true,false,false]);
  assert.match(results[2].error,/body unavailable/);
});
