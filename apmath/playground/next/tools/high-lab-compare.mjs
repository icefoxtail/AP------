// Separate pre-existing observations from regressions. Never certify mathematical quality.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { REQUIRED_ORBIT_SCENES } from './high-orbit-probe.mjs';
import { SCREENSHOT_ENVIRONMENT_POLICY, screenshotEnvironmentMatches } from './browser-screenshot-guard.mjs';

const observedSteps = rows => Math.max(0,...rows.filter(o=>!String(o.state).startsWith('variant-')&&!String(o.state).startsWith('target-')&&(o.state==='initial'||o.tab==='review')).map(o=>Number(o.steps)||0));

function observations(report) {
  const entries = new Map();
  const add = (row, issue, detail = '') => {
    const stableDetail = String(detail).replace(/https?:\/\/(?:127\.0\.0\.1|localhost):\d+/g, 'http://lab-local');
    const key = JSON.stringify([row.lab, row.id || '', row.run || '', row.state || '', issue, stableDetail]);
    entries.set(key, { ...row, issue, detail });
  };
  for (const row of report.failures || []) {
    if (row.issues) for (const issue of row.issues) {
      if (issue === 'clipped-label' && row.clipped?.length) for (const q of row.clipped) add(row, issue, q.text);
      else if (issue === 'katex-error' && row.katexErrors?.length) for (const q of row.katexErrors) add(row, issue, q);
      else add(row, issue);
    }
    else if (row.errors?.length) for (const error of row.errors) add(row, row.reason, error);
    else add(row, row.reason, row.error || '');
  }
  if (Number(report.schema) >= 3 && report.capabilityPolicy?.screenshotEnvironment !== SCREENSHOT_ENVIRONMENT_POLICY) add({}, 'missing-schema-required-screenshot-environment-policy');
  for (const lab of report.labs || []) {
    if (Number(report.schema) >= 3 || report.capabilityPolicy?.screenshotEnvironment === SCREENSHOT_ENVIRONMENT_POLICY) {
      for (const run of report.runs || []) if (!lab.screenshotEnvironment?.some(e => e.run === run.name && e.phase === 'initial' && screenshotEnvironmentMatches(e, !run.name.startsWith('pc')))) add({ lab: lab.id, run: run.name }, 'missing-or-invalid-initial-screenshot-environment');
      for (const file of lab.captures || []) if (!lab.screenshotEnvironment?.some(e => e.file === file && e.phase === 'capture' && report.runs?.some(r => r.name === e.run) && screenshotEnvironmentMatches(e, !e.run.startsWith('pc')))) add({ lab: lab.id }, 'missing-or-invalid-captured-environment', file);
    }
    for (const id of REQUIRED_ORBIT_SCENES[lab.id] || []) if (!lab.scenes.some(s => s.id === id)) add({ lab: lab.id, id }, 'missing-required-3d-scene');
    for(const action of lab.interactions||[])if(action.pass===false||action.textChanged===false||action.bodyPresent===false)add({lab:lab.id,id:action.id,run:action.run||'mobile-paper',state:action.state||''},'failed-recorded-interaction',`${action.kind}:${action.variant??action.index??''}`);
    for (const run of report.runs || []) for (const scene of lab.scenes) {
      const rows = lab.observations.filter(o => o.run === run.name && o.id === scene.id);
      const initial = rows.find(o => o.state === 'initial');
      if (!initial) { add({ lab: lab.id, id: scene.id, run: run.name }, 'missing-scene-observation'); continue; }
      const required = ['initial'];
      if (initial.tabs?.includes('review')) for (let n = 0; n <= observedSteps(rows); n++) required.push(`step-${n}`);
      if (initial.tabs?.includes('problem')) required.push('problem-hidden');
      for (const state of required) if (!rows.some(o => o.state === state)) add({ lab: lab.id, id: scene.id, run: run.name, state }, 'missing-scene-state');
      const interactions=lab.interactions.filter(i=>i.id===scene.id&&i.run===run.name),cap=initial.capabilities||{};
      if (cap.orbit?.status === 'INVALID') add({ lab: lab.id, id: scene.id, run: run.name }, 'invalid-orbit-capability', cap.orbit.reason);
      for(let index=0;index<(cap.solutions||0);index++)if(initial.tabs?.includes('review')&&!interactions.some(i=>i.kind==='solution-disclosure'&&i.state==='baseline'&&i.index===index&&i.bodyPresent))add({lab:lab.id,id:scene.id,run:run.name},'missing-solution-disclosure',index);
      if(run.name==='mobile-paper'){
        if(cap.sliders&&!interactions.some(i=>i.kind==='slider'&&i.pass))add({lab:lab.id,id:scene.id,run:run.name},'missing-or-failed-slider');
        if(cap.drags&&!interactions.some(i=>i.kind==='drag'&&i.pass))add({lab:lab.id,id:scene.id,run:run.name},'missing-or-failed-drag');
        if (cap.drags && report.capabilityPolicy?.touchDrag === 'REQUIRED_FOR_VISIBLE_HANDLES' && !interactions.some(i => i.kind === 'touch-drag' && i.pass && i.input === 'touch' && i.acquired && i.held && i.changed && i.released)) add({ lab: lab.id, id: scene.id, run: run.name }, 'missing-or-failed-touch-drag');
        if ((REQUIRED_ORBIT_SCENES[lab.id]?.includes(scene.id) || cap.orbit?.status === 'REQUIRED') && !interactions.some(i => i.kind === 'orbit' && i.pass && i.acquired && i.cameraChanged && i.pixelsChanged)) add({ lab: lab.id, id: scene.id, run: run.name }, 'missing-or-failed-required-orbit');
        for(let variant=1;cap.generator&&variant<=2;variant++){
          if(!interactions.some(i=>i.kind==='new-problem'&&i.variant===variant&&i.textChanged))add({lab:lab.id,id:scene.id,run:run.name,state:`variant-${variant}`},'missing-or-unchanged-variant');
          if(!rows.some(o=>o.state===`variant-${variant}`))add({lab:lab.id,id:scene.id,run:run.name,state:`variant-${variant}`},'missing-variant-observation');
        }
      }
    }
    if (!lab.scenes.length) add({ lab: lab.id }, 'empty-scene-inventory');
  }
  return entries;
}

export function compareReports(before, after) {
  if (!before.runs?.length || !before.labs?.length) throw Error('Baseline report has no test scope');
  const old = observations(before), current = observations(after);
  const add = (key, row) => current.set(key, row);
  if (before.capabilityPolicy?.touchDrag && after.capabilityPolicy?.touchDrag !== before.capabilityPolicy.touchDrag) add('missing-touch-policy', { issue: 'missing-candidate-touch-policy' });
  if (before.capabilityPolicy?.screenshotEnvironment && after.capabilityPolicy?.screenshotEnvironment !== before.capabilityPolicy.screenshotEnvironment) add('missing-screenshot-environment-policy', { issue: 'missing-candidate-screenshot-environment-policy' });
  if (after.reviewCapture && !after.reviewCapture.complete) add('incomplete-review-capture', { issue: 'incomplete-review-capture', counts: after.reviewCapture.counts });
  for (const run of before.runs) {
    const found=after.runs?.find(r=>r.name===run.name);
    if (!found || ['width','height','theme'].some(k=>found[k]!==run[k])) add(`missing-run:${run.name}`, {run:run.name,issue:'missing-candidate-environment'});
  }
  for (const lab of before.labs || []) {
    const found = after.labs.find(q => q.id === lab.id);
    if (!found) current.set(`missing-lab:${lab.id}`, { lab: lab.id, issue: 'missing-candidate-lab' });
    else {
      for(const action of lab.interactions||[]){
        if(action.status==='NOT_APPLICABLE')continue;
        const run=action.run||'mobile-paper';
        if(!found.interactions.some(i=>i.id===action.id&&i.kind===action.kind&&(i.run||'mobile-paper')===run&&i.status!=='NOT_APPLICABLE'&&(action.variant==null||i.variant===action.variant)&&(action.kind!=='solution-disclosure'||i.index===action.index&&i.state===action.state)))add(`missing-interaction:${lab.id}:${action.id}:${run}:${action.kind}:${action.variant??action.index??''}:${action.state||''}`,{lab:lab.id,id:action.id,run,issue:'missing-candidate-interaction',kind:action.kind,index:action.index,state:action.state});
      }
      for (const scene of lab.scenes) {
      if (!found.scenes.some(s => s.id === scene.id)) { add(`missing-scene:${lab.id}:${scene.id}`, { lab: lab.id, id: scene.id, issue: 'missing-candidate-scene' }); continue; }
      for (const run of before.runs) {
        const row={lab:lab.id,id:scene.id,run:run.name}, key=`${lab.id}:${scene.id}:${run.name}`;
        const a=lab.observations.find(o=>o.id===scene.id&&o.run===run.name&&o.state==='initial');
        const b=found.observations.find(o=>o.id===scene.id&&o.run===run.name&&o.state==='initial');
        if (!b) { add(`missing-initial:${key}`,{...row,issue:'missing-candidate-initial'});continue; }
        for (const tab of a?.tabs||[]) if(!b.tabs?.includes(tab)) add(`missing-tab:${key}:${tab}`,{...row,issue:'missing-candidate-tab',tab});
        for(const capability of ['sliders','drags','generator','solutions'])if(a?.capabilities?.[capability]&&!b.capabilities?.[capability])add(`missing-capability:${key}:${capability}`,{...row,issue:'missing-candidate-capability',capability});
        if (a?.capabilities?.orbit?.status === 'REQUIRED' && b.capabilities?.orbit?.status !== 'REQUIRED') add(`missing-orbit-capability:${key}`, { ...row, issue: 'missing-candidate-orbit-capability' });
        if((a?.capabilities?.solutions||0)>(b.capabilities?.solutions||0))add(`missing-solutions:${key}`,{...row,issue:'missing-candidate-solution-alternative',before:a.capabilities.solutions,after:b.capabilities?.solutions||0});
        const aSteps=observedSteps(lab.observations.filter(o=>o.id===scene.id&&o.run===run.name));
        const bSteps=observedSteps(found.observations.filter(o=>o.id===scene.id&&o.run===run.name));
        if(aSteps>0&&!(bSteps>0))add(`missing-steps:${key}`,{...row,issue:'missing-candidate-solution-steps'});
        // A justified 4/5-step to 3-step rewrite is valid. Every positive
        // candidate step must still have a measured state.
        if(bSteps>0&&b.tabs?.includes('review'))for(let n=0;n<=bSteps;n++)if(!found.observations.some(o=>o.id===scene.id&&o.run===run.name&&o.state===`step-${n}`))add(`missing-step:${key}:${n}`,{...row,state:`step-${n}`,issue:'missing-candidate-step'});
      }
      }
    }
  }
  const regressions = [...current].filter(([k]) => !old.has(k)).map(([,v]) => v);
  const resolved = [...old].filter(([k]) => !current.has(k)).map(([,v]) => v);
  return {
    schema: 1, beforeCommit: before.commit, afterCommit: after.commit,
    provenance: after.provenance || null,
    quality: 'NOT_ASSESSED_BY_AUTOMATION',
    candidateAllChecksPassed: current.size === 0,
    regressionCheckPassed: regressions.length === 0,
    baselineFindings: old.size, candidateFindings: current.size,
    regressions, resolved,
    remaining: [...current.values()],
    labs: after.labs.map(l => ({ id: l.id, course: l.course, scenes: l.scenes.length, observations: l.observations.length, interactions: l.interactions.length }))
  };
}

export const comparisonPasses = (comparison, { strictCandidate = false } = {}) => comparison.regressionCheckPassed && (!strictCandidate || comparison.candidateAllChecksPassed);

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const strictCandidate = process.argv.includes('--strict-candidate');
  const [beforeFile, afterFile, out] = process.argv.slice(2).filter(a => a !== '--strict-candidate');
  if (!beforeFile || !afterFile || !out) throw Error('Usage: high-lab-compare.mjs BEFORE AFTER OUTPUT [--strict-candidate]');
  const comparison = compareReports(JSON.parse(fs.readFileSync(beforeFile, 'utf8')), JSON.parse(fs.readFileSync(afterFile, 'utf8')));
  fs.writeFileSync(out, JSON.stringify(comparison, null, 2));
  console.log(JSON.stringify({ beforeCommit: comparison.beforeCommit, afterCommit: comparison.afterCommit, baselineFindings: comparison.baselineFindings, candidateFindings: comparison.candidateFindings, regressions: comparison.regressions.length, resolved: comparison.resolved.length, candidateAllChecksPassed: comparison.candidateAllChecksPassed, quality: comparison.quality }));
  process.exitCode = comparisonPasses(comparison, { strictCandidate }) ? 0 : 1;
}
