import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,readFileSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {verify,main} from './gpt-book-handoff.mjs';
const sha=s=>createHash('sha256').update(s).digest('hex');
const names={original:'source-original.json',assignment:'00_ASSIGNMENT.json',math:'10_MATH_META_REVIEWED.json',mathReceipt:'11_MATH_META_RECEIPT.json',visual:'20_VISUAL_REVIEWED.json',visualReceipt:'21_VISUAL_RECEIPT.json'};
const ids={original:'file_provider_source_11111111',assignment:'file_provider_assignment_11111111',math:'file_provider_math_11111111',mathReceipt:'file_provider_mathReceipt_11111111',visual:'file_provider_visual_11111111',visualReceipt:'file_provider_visualReceipt_11111111'};
function put(dir,name,o){writeFileSync(join(dir,name),typeof o==='string'?o:JSON.stringify(o));}
function withFiles(run){const d=mkdtempSync(join(tmpdir(),'gpt-handoff-'));try{
  const orig='{"items":[{"id":"SYNTHETIC_1"}]}';const math='{"items":[{"id":"SYNTHETIC_1","solution":"sample"}]}';const visual='{"items":[{"id":"SYNTHETIC_1","solution":"sample","svg":"<svg/>"}]}';
  put(d,names.original,orig);put(d,names.math,math);put(d,names.visual,visual);
  const assignment={schemaVersion:'GPT_BOOK_FINAL_DELIVERY_V2',batchId:'SYNTHETIC_BATCH',revision:1,sourceOriginalFilename:names.original,sourceSha256:sha(orig),sourceLibrarySha256:sha(orig),sourceLibraryFileId:ids.original,stageOutputSha256:sha(math)};
  const m={schemaVersion:'GPT_BOOK_MATH_META_RECEIPT_V2',status:'MATH_DONE',stage:'MATH_META',stageOwner:'MATH_META',batchId:assignment.batchId,revision:1,sourceSha256:sha(orig),stageInputSha256:sha(orig),stageInputLibraryFileId:ids.original,stageOutputSha256:sha(math),stageOutputLibraryFileId:ids.math,remoteReadbackSha256:sha(math)};
  put(d,names.assignment,assignment);put(d,names.mathReceipt,m);
  const mrBytes=readFileSync(join(d,names.mathReceipt));
  const v={schemaVersion:'GPT_BOOK_VISUAL_RECEIPT_V2',status:'VISUAL_DONE',stage:'VISUAL',stageOwner:'VISUAL',batchId:assignment.batchId,revision:1,sourceSha256:sha(orig),stageInputSha256:sha(math),stageInputLibraryFileId:ids.math,stageInputReceiptLibraryFileId:ids.mathReceipt,stageInputReceiptSha256:sha(mrBytes),stageOutputSha256:sha(visual),stageOutputLibraryFileId:ids.visual,stageOutputSizeBytes:Buffer.byteLength(visual),remoteReadbackSha256:sha(visual)};
  put(d,names.visualReceipt,v);
  return run(d);
} finally{rmSync(d,{recursive:true,force:true});}}
function edit(d,name,f){const p=join(d,name),o=JSON.parse(readFileSync(p,'utf8'));f(o);put(d,name,o);}
for(const stage of ['COURIER','MATH_META','VISUAL'])test(stage+' valid synthetic chain',()=>withFiles(d=>assert.equal(verify({directory:d,stage,ids}).status,'LOCAL_EVIDENCE_PASS')));
test('UNKNOWN without provider IDs',()=>withFiles(d=>{const r=verify({directory:d,stage:'VISUAL'});assert.equal(r.status,'UNKNOWN');assert.equal(r.firstMissingStep,'FILE_ID_PROBE_MISSING');}));
test('UNKNOWN missing source bytes',()=>withFiles(d=>{rmSync(join(d,names.original));assert.equal(verify({directory:d,stage:'COURIER',ids}).firstMissingStep,'RAW_BYTES_MISSING');}));
test('FAIL changed original bytes',()=>withFiles(d=>{const p=join(d,names.original);writeFileSync(p,readFileSync(p,'utf8')+' ');assert.equal(verify({directory:d,stage:'COURIER',ids}).firstMissingStep,'SOURCE_HASH_MISMATCH');}));
test('FAIL wrong stage',()=>withFiles(d=>{edit(d,names.mathReceipt,o=>o.stage='VISUAL');assert.equal(verify({directory:d,stage:'MATH_META',ids}).firstMissingStep,'MATH_STAGE_WRONG');}));
test('FAIL wrong batch lineage',()=>withFiles(d=>{edit(d,names.visualReceipt,o=>o.batchId='OTHER');assert.equal(verify({directory:d,stage:'VISUAL',ids}).firstMissingStep,'VISUAL_BATCH_LINEAGE_MISMATCH');}));
test('FAIL wrong predecessor receipt',()=>withFiles(d=>{edit(d,names.visualReceipt,o=>o.stageInputReceiptLibraryFileId='file_unrelated');assert.equal(verify({directory:d,stage:'VISUAL',ids}).firstMissingStep,'VISUAL_INPUT_RECEIPT_ID_MISMATCH');}));
test('FAIL wrong output SHA',()=>withFiles(d=>{edit(d,names.visualReceipt,o=>o.stageOutputSha256='0'.repeat(64));assert.equal(verify({directory:d,stage:'VISUAL',ids}).firstMissingStep,'VISUAL_OUTPUT_HASH_MISMATCH');}));
test('UNKNOWN RELEASE without receipt',()=>withFiles(d=>{const r=verify({directory:d,stage:'RELEASE',ids});assert.equal(r.status,'UNKNOWN');assert.equal(r.firstMissingStep,'RELEASE_RECEIPT_MISSING');}));
test('UNKNOWN ALL_MASTER without release',()=>withFiles(d=>assert.equal(verify({directory:d,stage:'ALL_MASTER',ids}).status,'UNKNOWN')));
test('reject traversal filename',()=>withFiles(d=>{edit(d,names.assignment,o=>o.sourceOriginalFilename='../evil.json');assert.equal(verify({directory:d,stage:'COURIER',ids}).firstMissingStep,'ORIGINAL_NAME_INVALID');}));
