// Separate pre-existing observations from regressions. Never certify mathematical quality.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function observations(report) {
  const entries = new Map();
  const add = (row, issue, detail = '') => {
    const key = JSON.stringify([row.lab, row.id || '', row.run || '', row.state || '', issue, detail]);
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
  for (const lab of report.labs || []) {
    for (const run of report.runs || []) for (const scene of lab.scenes) {
      const rows = lab.observations.filter(o => o.run === run.name && o.id === scene.id);
      const initial = rows.find(o => o.state === 'initial');
      if (!initial) { add({ lab: lab.id, id: scene.id, run: run.name }, 'missing-scene-observation'); continue; }
      const required = ['initial'];
      if (initial.tabs?.includes('review')) for (let n = 0; n <= initial.steps; n++) required.push(`step-${n}`);
      if (initial.tabs?.includes('problem')) required.push('problem-hidden');
      for (const state of required) if (!rows.some(o => o.state === state)) add({ lab: lab.id, id: scene.id, run: run.name, state }, 'missing-scene-state');
    }
    if (!lab.scenes.length) add({ lab: lab.id }, 'empty-scene-inventory');
  }
  return entries;
}

export function compareReports(before, after) {
  const old = observations(before), current = observations(after);
  for (const lab of before.labs || []) {
    const found = after.labs.find(q => q.id === lab.id);
    if (!found) current.set(`missing-lab:${lab.id}`, { lab: lab.id, issue: 'missing-candidate-lab' });
    else for (const scene of lab.scenes) if (!found.scenes.some(s => s.id === scene.id)) current.set(`missing-scene:${lab.id}:${scene.id}`, { lab: lab.id, id: scene.id, issue: 'missing-candidate-scene' });
  }
  const regressions = [...current].filter(([k]) => !old.has(k)).map(([,v]) => v);
  const resolved = [...old].filter(([k]) => !current.has(k)).map(([,v]) => v);
  return {
    schema: 1, beforeCommit: before.commit, afterCommit: after.commit,
    quality: 'NOT_ASSESSED_BY_AUTOMATION',
    candidateAllChecksPassed: current.size === 0,
    regressionCheckPassed: regressions.length === 0,
    baselineFindings: old.size, candidateFindings: current.size,
    regressions, resolved,
    remaining: [...current.values()],
    labs: after.labs.map(l => ({ id: l.id, course: l.course, scenes: l.scenes.length, observations: l.observations.length, interactions: l.interactions.length }))
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [beforeFile, afterFile, out] = process.argv.slice(2);
  if (!beforeFile || !afterFile || !out) throw Error('Usage: high-lab-compare.mjs BEFORE AFTER OUTPUT');
  const comparison = compareReports(JSON.parse(fs.readFileSync(beforeFile, 'utf8')), JSON.parse(fs.readFileSync(afterFile, 'utf8')));
  fs.writeFileSync(out, JSON.stringify(comparison, null, 2));
  console.log(JSON.stringify({ beforeCommit: comparison.beforeCommit, afterCommit: comparison.afterCommit, baselineFindings: comparison.baselineFindings, candidateFindings: comparison.candidateFindings, regressions: comparison.regressions.length, resolved: comparison.resolved.length, candidateAllChecksPassed: comparison.candidateAllChecksPassed, quality: comparison.quality }));
  process.exitCode = comparison.regressionCheckPassed ? 0 : 1;
}
