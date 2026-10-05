import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {sourceReviewClosed,verificationClosed,sourcePolicyFingerprint} from '../production/source-policy.mjs';
test('a PASS string cannot replace typed source/verification coverage',()=>{
  assert.equal(sourceReviewClosed({output:{status:'PASS'},payload:{sourceConditions:['given']}}),false);
  assert.equal(sourceReviewClosed({output:{status:'PASS'},payload:{sourceConditions:['given'],errors:[],uncoveredConditions:[]}}),true);
  assert.equal(verificationClosed({output:{status:'PASS'},payload:{independentlyExtractedSourceConditions:['given'],uncoveredConditions:[],recomputedAnswer:'34',solutionComparison:'matches'}}),true);
  assert.equal(verificationClosed({output:{status:'PASS'},payload:{independentlyExtractedSourceConditions:['given'],uncoveredConditions:'',recomputedAnswer:'34',solutionComparison:'matches'}}),false);
});
test('source policy fingerprint changes with verifier/runtime code, not unrelated docs',()=>{
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'source-policy-'));
  try{
    const paths=['archive/tools/geometry-equation/production/source-policy.mjs','archive/tools/geometry-equation/production/construction.py','archive/tools/geometry-equation/production/graph_observer.py','alive/runtime/provider-bridge/codex-appserver-adapter.mjs'];
    for(const p of paths){fs.mkdirSync(path.dirname(path.join(root,p)),{recursive:true});fs.writeFileSync(path.join(root,p),'one');}
    const before=sourcePolicyFingerprint(root);fs.writeFileSync(path.join(root,'docs.txt'),'changed');assert.equal(before,sourcePolicyFingerprint(root));
    fs.appendFileSync(path.join(root,paths[2]),'two');assert.notEqual(before,sourcePolicyFingerprint(root));
  }finally{fs.rmSync(root,{recursive:true,force:true});}
});
