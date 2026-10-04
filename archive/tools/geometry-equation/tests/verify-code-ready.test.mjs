import test from 'node:test';
import assert from 'node:assert/strict';
import {assertExactCoverage,assertActualEvidence,assertPerformanceRow,ORIGINAL_INDEPENDENT_VERIFIERS} from '../seal-visual-engine-code-ready.mjs';
test('readiness rejects synthetic and unmeasured actual capture',()=>{
  const row={status:'PASS',runtime:'playwright-chromium',synthetic:false,errors:[],missingGlyphCount:0,labelCollisionCount:0,criticalCollisionCount:0,clippedTextCount:0,overflowCount:0};
  assertActualEvidence(row);
  assert.throws(()=>assertActualEvidence({...row,synthetic:true}),/ACTUAL_CAPTURE_REQUIRED/);
  assert.throws(()=>assertActualEvidence({...row,missingGlyphCount:null}),/UNMEASURED/);
  assert.throws(()=>assertActualEvidence({...row,criticalCollisionCount:1}),/NONZERO/);
});
test('readiness rejects missing or duplicated required coverage',()=>{
  assertExactCoverage(['a:desktop','a:mobile'],['a:desktop','a:mobile']);
  assert.throws(()=>assertExactCoverage(['a:desktop'],['a:desktop','a:mobile']),/MISSING/);
  assert.throws(()=>assertExactCoverage(['a:desktop','a:desktop'],['a:desktop','a:mobile']),/DUPLICATE/);
});
test('performance must be physically measured with finite metrics',()=>{
  const row={svgBytes:1000,domNodeCount:50,textNodeCount:8,pathCount:0,renderTimeMs:10,browserLayoutTimeMs:0};
  assertPerformanceRow(row);
  assert.throws(()=>assertPerformanceRow({...row,browserLayoutTimeMs:null}),/TIMING_UNMEASURED/);
  assert.throws(()=>assertPerformanceRow({...row,renderTimeMs:Infinity}),/TIMING_UNMEASURED/);
  assert.throws(()=>assertPerformanceRow({...row,textNodeCount:undefined}),/DOM_METRICS_UNMEASURED/);
});
test('original verifier parity excludes newly added visual-engine validators',()=>{
  assert.equal(ORIGINAL_INDEPENDENT_VERIFIERS.length,6);
  assert.ok(ORIGINAL_INDEPENDENT_VERIFIERS.every(file=>file.startsWith('archive/tools/geometry-equation/verify-')));
});
