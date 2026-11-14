import fs from 'node:fs';
import path from 'node:path';
import { assetIdentity } from './contracts.mjs';
import { pythonWorker } from './worker.mjs';
import { composeConstructionCandidate } from './construction-candidate-svg-v1.mjs';
import { checkSetDiagramPlan, composeSetDiagramFigure, solveDiagram } from './set-diagram-v1.mjs';
import { captionText, compositePanels, composeCompositeCandidate, isSetPanel } from './composite-candidate-svg-v1.mjs';
import { loadBank } from '../build-visual-render-matrix.mjs';
import { repoRoot, launchBrowser } from '../visual-browser-runtime.mjs';

const [configPath, outputPath] = process.argv.slice(2);
if (!configPath || !outputPath) throw Error('Usage: node render-problem-figures.mjs <plan.json> <new output directory>');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
const sourcePath = config.sourcePath;
if (typeof sourcePath !== 'string' || !/^archive\/exams\/(original|similar|types)\/(?:high|middle)\/(?:[^./][^/]*\/)*[^/]+\.js$/.test(sourcePath)) throw Error('Invalid Archive exam path');
const bank = loadBank(fs.readFileSync(path.join(repoRoot, sourcePath), 'utf8'));
const question = bank.find(row => row.id === config.questionId);
if (!question) throw Error('Question ID is absent from source');
const seen = new Set();
for (const { slot, plan, typography } of config.figures) {
  const choice = slot.match(/^choice-([1-9])$/);
  if (slot !== 'body' && slot !== 'image' && (!choice || !question.choices?.[Number(choice[1]) - 1])) throw Error('Slot is absent from source: ' + slot);
  if (seen.has(slot)) throw Error('Duplicate slot: ' + slot);
  seen.add(slot);
  if (!plan?.capability) throw Error('Missing figure plan: ' + slot);
  if (!['set-diagram-figure-v1', 'composite-panels-v1'].includes(plan.capability)
    && !plan.graphPlan && !plan.mathPlan) throw Error('Unsupported problem figure plan: ' + plan.capability);
  if (plan.capability === 'set-diagram-figure-v1') checkSetDiagramPlan(plan);
  if (typeof typography?.baseFontPx !== 'number' || typeof typography?.displayScale !== 'number') throw Error('Typography is required: ' + slot);
}

async function checkedWorker(input, options) {
  const result = await pythonWorker(input, options);
  if (result.status !== 'OK') throw Error(JSON.stringify(result.result));
  return result.result;
}

async function constructionModel(plan) {
  if (!plan.graphPlan) {
    return { plan, model: await checkedWorker({ action: 'construction', graph: plan.mathPlan }, { timeoutMs: 90000 }) };
  }
  const { graphPlan } = await checkedWorker({ action: 'frame_graph', graphPlan: plan.graphPlan });
  const model = await checkedWorker({ action: 'graph', graphPlan });
  return { plan: { ...plan, graphPlan }, model };
}

async function composeProblem(plan, identity, typographyPolicy, browser) {
  const context = { identity, typographyPolicy, browser };
  if (plan.capability === 'set-diagram-figure-v1') {
    return composeSetDiagramFigure({ ...context, plan, model: checkSetDiagramPlan(plan) });
  }
  if (plan.capability === 'composite-panels-v1') {
    const panels = [];
    const framed = [];
    for (const panel of compositePanels(plan)) {
      if (!isSetPanel(panel.plan) && !panel.plan.graphPlan && !panel.plan.mathPlan) {
        throw Error('Unsupported problem panel: ' + panel.plan.capability);
      }
      const prepared = isSetPanel(panel.plan)
        ? { plan: panel.plan, model: solveDiagram(panel.plan.diagram) }
        : await constructionModel({ ...panel.plan, caption: panel.plan.caption ?? captionText(panel.caption) });
      panels.push(prepared);
      framed.push({ caption: panel.caption, plan: prepared.plan });
    }
    return composeCompositeCandidate({ ...context, plan: { ...plan, panels: framed }, panels });
  }
  return composeConstructionCandidate({ ...context, ...await constructionModel(plan) });
}

fs.mkdirSync(outputPath);
const browser = await launchBrowser();
try {
  for (const { slot, plan, typography } of config.figures) {
    const identity = assetIdentity(path.posix.basename(sourcePath, '.js') + '|' + config.questionId, 'PROBLEM_VISUAL', slot);
    const composed = await composeProblem(plan, identity, typography, browser);
    const { svg, ...result } = composed;
    fs.writeFileSync(path.join(outputPath, slot + '.json'), JSON.stringify({ identity, ...result }, null, 2) + '\n');
    if (composed.status !== 'COMPOSED') {
      process.exitCode = 1;
      console.error(slot, composed.status, composed.detail);
      continue;
    }
    fs.writeFileSync(path.join(outputPath, slot + '.svg'), svg);
  }
} finally {
  await browser.close();
}
