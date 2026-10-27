import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// Same sparse-checkout repair as graph-multi-curves.test.mjs: phase2.mjs reaches past-exam-pipeline through
// pipeline-core, and this wave worktree keeps those shared tracked files skip-worktree. Restore their exact HEAD
// bytes only when absent (no source edit).
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../../../');
const sparseDependencies=[
  'archive/tools/past-exam-pipeline/lib/calibration.mjs',
  'archive/tools/past-exam-pipeline/completion-contract.json',
  'archive/data/master_tables/js_archive_tag_master.json'
];
for(const relative of sparseDependencies){
  const target=path.join(repo,relative);
  if(fs.existsSync(target))continue;
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,execFileSync('git',['show','HEAD:'+relative],{cwd:repo,maxBuffer:32*1024*1024}));
}

const {composeConstructionCandidate}=await import('../production/construction-candidate-svg-v1.mjs');
const {assetIdentity}=await import('../production/contracts.mjs');

// 22 효천고 2학기 기말 고2 수학II q10: four distinct parabolas, so the composer must take the graph route.
const PLAN={
  capability:'multi-curve-figure-v1',
  graphPlan:{
    family:'multi-curve',
    curves:[
      {id:'top',kind:'Y_OF_X',coefficients:['2','0','-1'],domain:['-1','1']},
      {id:'bottom',kind:'Y_OF_X',coefficients:['-2','0','1'],domain:['-1','1']},
      {id:'right',kind:'X_OF_Y',coefficients:['2','0','-1'],domain:['-1','1'],branch:'BOTH'},
      {id:'left',kind:'X_OF_Y',coefficients:['-2','0','1'],domain:['-1','1'],branch:'BOTH'}
    ],
    axisTickValues:{x:[],y:[]}
  },
  caption:'four parabolas'
};
const POLICY={schemaVersion:'REQUESTED_PROFILE_TYPOGRAPHY_v1',baseFontPx:16,displayScale:1.5,fontFloorCssPx:12};
const identity=assetIdentity('22_효천고_2학기_기말_고2_수학II|10','SOLUTION_VISUAL','decisive-relation');

// The composer's first graph-only gate after the registration check needs a model SVG. Reaching that gate proves the
// plan was accepted as a graph plan; before the additive registration the same call stopped at UNSUPPORTED_CAPABILITY.
test('the composer routes multi-curve-figure-v1 through the graph path',async()=>{
  const outcome=await composeConstructionCandidate({plan:PLAN,model:{},identity,typographyPolicy:POLICY});
  assert.equal(outcome.status,'MODEL_PLAN_MISMATCH',JSON.stringify(outcome.detail));
  assert.deepEqual(outcome.detail,{reason:'GRAPH_MODEL_SVG_MISSING'});
});

test('the registration does not widen the graph route to other capabilities or to a plan without graphPlan',async()=>{
  const unknown=await composeConstructionCandidate({plan:{...PLAN,capability:'multi-curve-figure-v9'},model:{},identity,typographyPolicy:POLICY});
  assert.equal(unknown.status,'UNSUPPORTED_CAPABILITY');
  const noGraph=await composeConstructionCandidate({plan:{...PLAN,graphPlan:undefined},model:{},identity,typographyPolicy:POLICY});
  assert.equal(noGraph.status,'UNSUPPORTED_CAPABILITY');
});
