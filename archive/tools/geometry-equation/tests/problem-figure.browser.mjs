// Actual Chromium integration, run by the read-only qualification job. The mathematical triangle is an
// UNRELATED CONTROLLED_TECHNICAL_FIXTURE for this real source question, never an authored student figure.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {fileRef} from '../../pipeline-core/canonical.mjs';
import {assetIdentity} from '../production/contracts.mjs';
import {pythonWorker} from '../production/worker.mjs';
import {composeConstructionCandidate} from '../production/construction-candidate-svg-v1.mjs';
import {measureProblemTypographyPolicy,captureProblemCandidate} from '../production/construction-archive-capture-v1.mjs';
import {verifyProblemEvidence} from '../production/problem-figure-runner.mjs';
import {node,pointNode} from './construction-v1-fixture.mjs';

test('actual problem slot measures and captures desktop, phone and tablet without changing source or solution fields',async()=>{
  const root=fileURLToPath(new URL('../../../../',import.meta.url));
  const sourcePath='archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js',ordinal=2;
  const sourceBefore=fileRef(root,sourcePath),imageBefore=fileRef(root,'archive/assets/images/24_향림중_2학기_중간_중1_기출/q2.png');
  const identity=assetIdentity(path.basename(sourcePath,'.js')+'|'+ordinal,'PROBLEM_VISUAL');
  const mathPlan={schemaVersion:'construction-spike-v1',nodes:[pointNode('A',0,0),pointNode('B',6,0),pointNode('C',0,3),node('M','MIDPOINT',['A','B'],'POINT')]};
  const plan={capability:'construction-spike-v1',caption:'문제 슬롯 기술 검증용 삼각형: 실제 문항과 무관',mathPlan,displaySegments:[{id:'sAB',refs:['A','B']},{id:'sBC',refs:['B','C']},{id:'sCA',refs:['C','A']},{id:'sCM',refs:['C','M']}],coordinateLabels:['A','B','C','M']};
  const model=await pythonWorker({action:'construction',graph:mathPlan});assert.equal(model.status,'OK');
  const measured=await measureProblemTypographyPolicy({identity,sourcePath,ordinal,requestedSizeClass:'full',intrinsicSvg:{width:384,height:320},runId:'problem-smoke-measure-'+crypto.randomUUID()});
  assert.equal(measured.status,'MEASURED',JSON.stringify(measured.detail));
  assert.equal(measured.evidence.problemViewportMeasurements.length,3);
  const composed=await composeConstructionCandidate({plan,model:model.result,identity,typographyPolicy:measured.policy});
  assert.equal(composed.status,'COMPOSED',JSON.stringify(composed.detail));
  const capture=await captureProblemCandidate({identity,sourcePath,ordinal,requestedSizeClass:'full',composed,measuredPolicy:measured,alt:plan.caption,runId:'problem-smoke-capture-'+crypto.randomUUID(),fixtureClassification:'CONTROLLED_TECHNICAL_FIXTURE'});
  assert.equal(capture.status,'ARCHIVE_BOUND',JSON.stringify(capture.detail));
  assert.equal(capture.fixtureClassification,'CONTROLLED_TECHNICAL_FIXTURE');
  const state={meta:{sourcePath,ordinal},identity,plan,model:model.result,composed,capture};
  const evidence=verifyProblemEvidence(state);
  assert.equal(evidence.viewports.length,3);
  assert.deepEqual(fileRef(root,sourcePath),sourceBefore);assert.deepEqual(fileRef(root,imageBefore.path),imageBefore);
  const out=path.join(root,'.tmp/svg-problem/technical-problem-smoke');fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'state.json'),JSON.stringify(state,null,2)+'\n');
  fs.writeFileSync(path.join(out,'evidence.json'),JSON.stringify({...evidence,fixtureClassification:'CONTROLLED_TECHNICAL_FIXTURE',sourceBefore,imageBefore},null,2)+'\n');
});
