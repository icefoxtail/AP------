import {fileRef,objectSha} from '../../pipeline-core/canonical.mjs';
import {capabilityFingerprint,CAPABILITIES} from './contracts.mjs';
import {dependencyLock} from './dependencies.mjs';
const prefix='archive/tools/geometry-equation/';
const shared=['production/contracts.mjs','production/store.mjs','production/worker.mjs','production/worker.py','production/run.mjs','production/dependencies.mjs','production/fingerprint.mjs','production/typography.mjs','production/phase2.mjs','production/resolve-request.mjs','production/repair-budget.mjs','production/source-policy.mjs','production/blinded-review.mjs','production/audit-slice.mjs','production/primitive-observer-worker.py','visual_engine/engine.py','visual_engine/svg_composer.py','visual_engine/label_layout.py','visual_engine/semantic_model.py','visual_engine/viewport.py','visual_engine/math_expression.py','visual_engine/style_tokens.py','visual_engine/style_tokens.json','record-visual-browser-evidence.mjs','verify-rendered-layout.mjs','visual-browser-runtime.mjs','production/dependency-lock.json','production/runtime-package-lock.json','production/requirements.txt'];
const producer={
  'construction-spike-v1':['production/construction.py'],
  'polynomial-spike-v1':['production/graph_spike.py','production/graph_framing.py','visual_engine/function_sampling.py','visual_engine/math_expression.py','visual_engine/viewport.py','visual_engine/geometry_model.py'],
};
const observers={
  'construction-spike-v1':['production/cindy-observer.mjs','audit_publication.py'],
  'polynomial-spike-v1':['production/graph_observer.py','production/graph-observer-worker.py'],
};
const locate=p=>p.startsWith('../pipeline-core/')?'archive/tools/pipeline-core/'+p.slice('../pipeline-core/'.length):prefix+p;
export function scopeFingerprint(root,capability) {
  if(!CAPABILITIES[capability])throw Error('UNSUPPORTED_CAPABILITY');
  return capabilityFingerprint(root,{capability,implementationPaths:[...shared,...producer[capability],'../pipeline-core/canonical.mjs','../pipeline-core/question-uid.mjs'].map(locate).concat(['alive/runtime/provider-bridge/codex-appserver-adapter.mjs','archive/engine.html']),observerPaths:observers[capability].map(locate),dependencyLock,policy:CAPABILITIES[capability]});
}
export function mathFingerprint(root,capability) {
  if(!producer[capability])throw Error('UNSUPPORTED_CAPABILITY');
  const paths=['production/worker.py','production/worker.mjs','production/contracts.mjs','production/dependencies.mjs','../pipeline-core/canonical.mjs',...producer[capability]];
  return objectSha({files:[...new Set(paths)].sort().map(p=>fileRef(root,locate(p))),dependencies:dependencyLock.python,policy:'MATH_SPIKE_v1'});
}
