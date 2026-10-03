const fs=require('fs');
const path=require('path');
const vm=require('vm');
const assert=require('assert/strict');
(async()=>{
 const examRel="archive/exams/original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js";
 const evidenceRel="archive/data/r3-intake/m3/25_왕운중_1학기_중간_중3_기출.post-repair-recheck.physical-evidence.json";
 const code=fs.readFileSync(path.resolve(examRel),'utf8');
 const sandbox={window:{}}; vm.runInNewContext(code,sandbox,{filename:examRel});
 const bank=sandbox.window.questionBank; assert.equal(bank.length,24);
 const expected={"1":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"2":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"4":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"6":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"7":{"standardUnitKey":"M3-01","standardUnit":"실수와 그 계산","subUnitKey":"M3-01-REAL_NUMBER_OPERATIONS","subUnit":"근호를 포함한 식의 계산"},"8":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"9":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"11":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"12":{"subUnitKey":"M3-02-FACTORIZATION","subUnit":"인수분해"},"17":{"subUnitKey":"M3-02-FACTORIZATION","subUnit":"인수분해"},"18":{"subUnitKey":"M3-01-SQUARE_ROOT_REAL_NUMBER","subUnit":"제곱근과 실수"},"22":{"subUnitKey":"M3-02-FACTORIZATION","subUnit":"인수분해"}};
 for(const [id,fields] of Object.entries(expected)){const q=bank.find(x=>x.id===Number(id));for(const [k,v] of Object.entries(fields))assert.equal(q[k],v,'q'+id+'.'+k);}
 const {validatePhysicalEvidence}=await import('../archive/tools/review-evidence-gate.mjs');
 const report=validatePhysicalEvidence({examFile:path.resolve(examRel),evidenceFile:path.resolve(evidenceRel),stage:'R3'});
 console.log(JSON.stringify({target:'m3/o3-post-repair',canonicalR3Gate:report}));
 assert.equal(report.ok,true);assert.deepEqual(report.itemHoldQids,[]);assert.deepEqual(report.issues,[]);
})().catch(e=>{console.error(e);process.exit(1)});
