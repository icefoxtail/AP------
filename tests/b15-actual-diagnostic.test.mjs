// Optional physical B15 witness check. Runs only when the actual GitHub
// diagnostic artifact has been downloaded separately; it is NEVER bundled.
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync,readFileSync} from 'node:fs';
import {deployedSiteProof} from '../archive/tools/archive-progress-github-proof.mjs';
const diagnostic=process.env.B15_DIAGNOSTIC_ZIP||'/mnt/data/b15-release-diagnostics.zip';
const commit='8ded9dbdacab31b37f60778b7577640156a3fefa';
test('B15 actual diagnostic bytes + observed GitHub deploy jobs (not a live in-test API call)',{skip:!existsSync(diagnostic)},async()=>{
 const run={id:38109580827,attempt:1,sha:commit,at:'2026-10-11T03:58:15Z'};
 const called=[];
 const client={origin:'https://api.github.com/repos/icefoxtail/AP------',headers:{Authorization:'Bearer test'},
  api:async route=>{
   called.push(route);
   if(route.endsWith('/artifacts?per_page=100'))return {artifacts:[
    {id:11691357897,name:'archive-pages-release-evidence-38109580827-1',size_in_bytes:247524,expired:false,created_at:'2026-10-11T03:54:08Z'},
    {id:11690559050,name:'github-pages',size_in_bytes:2183453819,expired:false,created_at:'2026-10-11T03:56:03Z'}]};
   if(route.endsWith('/attempts/1/jobs?per_page=100'))return {jobs:[
    {id:114383308420,name:'Deploy the verified student release',conclusion:'success',steps:[{name:'Deploy Pages artifact',conclusion:'success'}]}]};
   if(route.endsWith('/attempts/1'))return {run_started_at:'2026-10-11T03:48:47Z',updated_at:'2026-10-11T03:58:15Z'};
   throw Error('unexpected API '+route);
  },fetchImpl:async url=>{
   called.push(url);
   if(url.endsWith('/artifacts/11691357897/zip'))return new Response(null,{status:302,headers:{Location:'https://archive.example/diag'}});
   if(url==='https://archive.example/diag')return new Response(readFileSync(diagnostic));
   throw Error('Pages ZIP downloaded unexpectedly: '+url);
  }};
 const result=await deployedSiteProof(run,client);
 assert.equal(result.status,'verified');assert.equal(result.proof.run_id,38109580827);
 assert.equal(result.proof.run_attempt,1);assert.equal(result.proof.sourceSha,commit);
 assert.equal(result.proof.deploymentJobVerified,true);assert.equal(result.proof.actualDeployed,false);
 assert.equal(result.proof.fileProofReason,'Pages ZIP 크기 초과');
 assert.equal(called.some(s=>s.includes('11690559050/zip')),false);
});
