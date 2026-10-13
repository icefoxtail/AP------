import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import { dispatch,normalizeExamId,parseIdentity,pinsV4,LANES } from '../scan-dispatch.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=JSON.parse(fs.readFileSync(path.join(root,'fixtures/git-source-snapshot-20261013.json')));
const production=JSON.parse(fs.readFileSync(path.join(root,'fixtures/git-main-snapshot-20261013.json')));
const empty={complete:true,branches:[],prs:[],items:[],receipts:[],assignments:{}};
const snapshot=(extra={})=>({source,production,branches:{complete:true,branches:[]},prs:{complete:true,prs:[]},library:{complete:true,items:[]},receipts:{complete:true,receipts:[]},ownership:{complete:true,assignments:{}},...extra});

test('normalizes 수학/기출/수학c/기출c preserving school/year/grade/semester',()=>{
 const k='21_연향중_1학기_기말_중3_수학';
 for(const name of ['21_연향중_1학기_기말_중3_수학.js','21_연향중_1학기_기말_중3_기출c.js','21_연향중_1학기_기말_중3_기출.js','21_연향중_1학기_기말_중3_수학c.js']) assert.equal(normalizeExamId('archive/exams/original/middle/m3/1final/'+name),k);
 assert.equal(normalizeExamId('22_연향중_1학기_기말_중3_수학.js'),'22_연향중_1학기_기말_중3_수학');
 assert.equal(normalizeExamId('21_연향중_1학기_기말_중2_수학.js'),'21_연향중_1학기_기말_중2_수학');
 assert.equal(normalizeExamId('21_연향중_2학기_기말_중3_수학.js'),'21_연향중_2학기_기말_중3_수학');
 assert.equal(normalizeExamId('not_exam.js'),null);
});

test('real Git source 51 -> 50 before 2026, former 29 pins stay pinned, 21 automatically discovered',()=>{
 const out=dispatch(snapshot(),{generatedAt:'2026-10-13T00:00:00.000Z'});
 assert.equal(source.items.length,51);assert.equal(production.files.length,66);
 assert.equal(out.totals.sourceCount,50);
 assert.equal(Object.keys(pinsV4()).length,29);
 assert.equal(out.totals.pinnedExisting,29);assert.equal(out.totals.discoveredDynamic,21);
 assert.equal(out.totals.statuses.CREATE_NEW,21);assert.equal(out.totals.statuses.CREATE_RESUME,29);
 assert.equal(out.completeForDispatch,true);
 assert.equal(out.rows.filter(x=>x.gitWriteAllowed).length,0);
 assert.equal(Object.keys(out.lanes).length,12);
});

test('existing exact student production beats all other markers; no rework',()=>{
 const id='21_연향중_1학기_기말_중3_수학';
 const out=dispatch(snapshot({production:{...production,files:[...production.files,{path:'archive/exams/original/middle/m3/1final/21_연향중_1학기_기말_중3_기출c.js'}]}}));
 const row=out.rows.find(x=>x.id===id);assert.equal(row.status,'SKIP_PRODUCTION');assert.equal(row.mayStartCreate,false);
});

test('new Git candidate branch inherited, not duplicate CREATE',()=>{
 const id='22_동산중_2학기_중간_중3_수학';
 const out=dispatch(snapshot({branches:{complete:true,branches:[{name:'work/middle/m3/example',files:[{path:'archive/exams/original/middle/m3/2mid/22_동산중_2학기_중간_중3_기출.js'}]}]}}));
 assert.equal(out.rows.find(x=>x.id===id).status,'CREATE_RESUME');
});

test('candidate open PR automatically reserved',()=>{
 const id='22_동산중_2학기_중간_중3_수학';
 const out=dispatch(snapshot({prs:{complete:true,prs:[{number:999,url:'https://github.com/icefoxtail/AP------/pull/999',files:['archive/exams/original/middle/m3/2mid/22_동산중_2학기_중간_중3_수학.js']}]}}));
 assert.equal(out.rows.find(x=>x.id===id).status,'PR_PENDING');
});

test('Library candidate inherits existing work, never treats ZIP as formal stage PASS',()=>{
 const id='22_동산중_2학기_중간_중3_수학';
 const p=`/Archive2-GPT/generations/SCAN_M3_2021_2025/C/${id}/CREATE/foo.zip`;
 const out=dispatch(snapshot({library:{complete:true,items:[{path:p,kind:'file'}]}}));
 const row=out.rows.find(x=>x.id===id);
 assert.equal(row.status,'CREATE_RESUME');assert.equal(row.authoritativeReceiptSha,null);
});

test('incomplete Library or PR indexing FAIL-CLOSED, no dispatch even for pinned',()=>{
 const out=dispatch(snapshot({prs:{complete:false,prs:[]},library:{complete:false,items:[]}}));
 assert.equal(out.completeForDispatch,false);assert.equal(out.totals.statuses.INVENTORY_UNVERIFIED,50);
 assert.equal(out.rows.filter(x=>x.mayStartCreate).length,0);
});

test('receipt only trusted if verified SHA-bound CREATE PASS + remoteReadback',()=>{
 const id='21_연향중_1학기_기말_중3_수학',s='a'.repeat(40);
 const partial={stage:'CREATE',examId:id,verified:false,validation:'PASS',remoteReadback:true,artifactSha:s};
 assert.equal(dispatch(snapshot({receipts:{complete:true,receipts:[partial]}})).rows.find(x=>x.id===id).status,'CREATE_RESUME');
 const good={...partial,verified:true};
 let out=dispatch(snapshot({receipts:{complete:true,receipts:[good]}}));
 assert.equal(out.rows.find(x=>x.id===id).status,'READY_R1');
});

test('frozen source SHA mismatch triggers review and preserves assignment',()=>{
 const id='21_연향중_1학기_기말_중3_수학';
 const source2={...source,items:source.items.map(x=>x.examId===id?{...x,sourceBlobSha:'b'.repeat(40)}:x)};
 const ownership={complete:true,assignments:{[id]:{lane:'CREATE-B1',sourceBlobSha:'a'.repeat(40)}}};
 const out=dispatch(snapshot({source:source2,ownership}));
 let row=out.rows.find(x=>x.id===id);assert.equal(row.status,'SOURCE_REVISION_REVIEW');assert.equal(row.lane,'CREATE-B1');
});

test('adding a new source does not change lane of existing 50',()=>{
 const a=dispatch(snapshot()),id='20_금당중_1학기_기말_중3_수학';
 const source2={...source,items:[...source.items,{examId:id}]};
 const b=dispatch(snapshot({source:source2}));
 for(const old of a.rows){assert.equal(b.rows.find(x=>x.id===old.id).lane,old.lane);}
 assert.ok(b.rows.find(x=>x.id===id));
});

test('two same-identity source paths cannot be auto-created',()=>{
 const id='22_동산중_2학기_중간_중3_수학';
 const source2={...source,items:[...source.items,{examId:id,sourcePath:'other/duplicate.js'}]};
 const out=dispatch(snapshot({source:source2}));
 assert.equal(out.rows.find(x=>x.id===id).status,'DUPLICATE_REVIEW');
});
