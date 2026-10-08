import test from 'node:test';
import assert from 'node:assert/strict';
import {bindNativeSolutionOverlayCandidate,compareSolutionTokenParity} from '../production/native-solution-overlay.mjs';

test('q10 line-break patch preserves text and MathJax token streams',()=>{
 const original='풀이 과정\n$AB = \\sqrt{(1 - (-3))^2 + (-4-2)^2} = \\sqrt{4^2 + (-6)^2} = \\sqrt{16+36} = \\sqrt{52}$\n$\\sqrt{52} = 2\\sqrt{13}$이다.\n따라서 정답은 ②이다.';
 const patched='풀이 과정\n$AB = \\sqrt{(1 - (-3))^2 + (-4-2)^2}$\n$= \\sqrt{4^2 + (-6)^2}$\n$= \\sqrt{16+36}$\n$= \\sqrt{52}$\n$\\sqrt{52} = 2\\sqrt{13}$이다.\n따라서 정답은 ②이다.';
 const result=compareSolutionTokenParity(original,patched);
 assert.equal(result.status,'PASS');assert.equal(result.textTokenParity,true);assert.equal(result.mathTokenParity,true);
});

test('solution overlay rejects changed math tokens or student-facing wording',()=>{
 const original='$AB=\\sqrt{4^2+(-6)^2}$이다. 따라서 정답은 ②이다.';
 assert.equal(compareSolutionTokenParity(original,'$AB=\\sqrt{4^2+(-5)^2}$이다. 따라서 정답은 ②이다.').status,'FAIL');
 assert.equal(compareSolutionTokenParity(original,'$AB=\\sqrt{4^2+(-6)^2}$이다. 그러므로 정답은 ②이다.').status,'FAIL');
});

test('native solution overlay binds its direct candidate file ref and rejects an omitted ref',()=>{
 const candidateRef={path:'.tmp/archive/run/exam/visual-engine/production/native-solution-overlay/exam.js',bytes:39266,sha256:'sha256:'+'a'.repeat(64)};
 const evidence={schemaVersion:'PHASE5_NATIVE_SOLUTION_PRESENTATION_OVERLAY_v1',status:'READY_FOR_R3_REVIEW'};
 assert.deepEqual(bindNativeSolutionOverlayCandidate(evidence,candidateRef),{...evidence,candidateRef});
 assert.throws(()=>bindNativeSolutionOverlayCandidate(evidence,null),/NATIVE_OVERLAY_CANDIDATE_REF_REQUIRED/);
 assert.throws(()=>bindNativeSolutionOverlayCandidate({...evidence,candidateRef},candidateRef),/NATIVE_OVERLAY_EVIDENCE_INVALID/);
});
