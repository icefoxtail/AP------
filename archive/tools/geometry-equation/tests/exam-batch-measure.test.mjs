// measureArchiveDisplayEnvelopeBatch: several figures of one exam measured from one open Archive page give each figure exactly the observation it gets alone.
// Needs Chrome (GEOMETRY_BROWSER_EXECUTABLE or channel chrome) and the playwright dependency, like the other record-* tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {repoRoot} from '../visual-browser-runtime.mjs';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {measureArchiveDisplayEnvelope,measureArchiveDisplayEnvelopeBatch} from '../record-visual-browser-evidence.mjs';

const EXAM='archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js';
const sourceRef=fileRef(repoRoot,EXAM);
const examUid=path.basename(EXAM,'.js');
const runId='em-'+crypto.randomUUID().slice(0,8);
const runDir=name=>{const dir=path.join(repoRoot,'.tmp/archive',runId,examUid,name);fs.mkdirSync(dir,{recursive:true});return dir;};
const figures=[
  {targetId:'va-batch-a',sourceOrdinal:1,intrinsicSvg:{width:384,height:300}},
  {targetId:'va-batch-b',sourceOrdinal:2,intrinsicSvg:{width:640,height:420}},
  {targetId:'va-batch-c',sourceOrdinal:3,intrinsicSvg:{width:828,height:500},solutionImageScale:85}
];
const ask=(figure,run)=>({run,sourceRef,sourceOrdinal:figure.sourceOrdinal,targetId:figure.targetId,questionUid:'q-'+figure.targetId,intrinsicSvg:figure.intrinsicSvg,sizeClasses:['full'],...(figure.solutionImageScale!==undefined?{solutionImageScale:figure.solutionImageScale}:{})});
const observation=value=>{const {sourceRef:_s,...rest}=value.observation;return rest;};

test('a batch of three figures gives each figure the observation it gets alone, and leaves its own run directory as the single call would',async()=>{
  const batchRequests=figures.map((figure,index)=>ask(figure,runDir('batch-'+index)));
  const answers=await measureArchiveDisplayEnvelopeBatch({requests:batchRequests,blockExternalRequests:true});
  assert.equal(answers.length,3);
  for(const [index,figure] of figures.entries()){
    assert.equal(answers[index].ok,true,'figure '+index+' is answered by the batch');
    const alone=await measureArchiveDisplayEnvelope({...ask(figure,runDir('alone-'+index)),blockExternalRequests:true});
    const batched=answers[index].value;
    assert.equal(batched.status,'PASS');
    assert.deepEqual(observation(batched),observation(alone),'the measured observation is the same alone and in a batch');
    // the files the capture step reads from the figure's own run directory
    const names=fs.readdirSync(batched.captureFolder);
    assert.ok(names.includes(figure.targetId+'-sol-desktop-envelope.json'));
    assert.ok(names.some(name=>name.endsWith('-'+figure.targetId+'-envelope-context.png')));
    const row=JSON.parse(fs.readFileSync(path.join(batched.captureFolder,figure.targetId+'-sol-desktop-envelope.json'),'utf8'));
    assert.equal(row.status,'PASS');
    assert.deepEqual(row.state.displayEnvelopes.map(v=>v.id),[figure.targetId]);
    assert.equal(row.network.policy,'LOCAL_ONLY');
    assert.ok(fs.existsSync(path.join(batchRequests[index].run,'archive-render-matrix.json')));
  }
});

test('a figure the batch cannot vouch for is left to the single call; a figure listed twice is not batched',async()=>{
  const requests=[
    ask(figures[0],runDir('mix-0')),
    ask(figures[1],runDir('mix-1')),
    ask({...figures[2],sourceOrdinal:9999},runDir('mix-2')),      // not in the bank
    ask(figures[0],runDir('mix-3'))                                // the same figure twice
  ];
  const answers=await measureArchiveDisplayEnvelopeBatch({requests,blockExternalRequests:true});
  assert.deepEqual(answers.map(a=>a.ok),[true,true,false,false]);
  // the runs the batch left unanswered are empty, so the single call can use them
  assert.deepEqual(fs.readdirSync(requests[2].run),[]);
  assert.deepEqual(fs.readdirSync(requests[3].run),[]);
});

test('fewer than two valid figures: no page is opened and every figure is left to the single call',async()=>{
  const answers=await measureArchiveDisplayEnvelopeBatch({requests:[ask(figures[0],runDir('one-0'))],blockExternalRequests:true});
  assert.deepEqual(answers,[{ok:false}]);
});

test.after(()=>{try{fs.rmSync(path.join(repoRoot,'.tmp/archive',runId),{recursive:true,force:true});}catch{/* pruned later */}});
