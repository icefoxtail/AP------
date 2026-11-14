import fs from 'node:fs';
import path from 'node:path';
import { assetIdentity } from './contracts.mjs';
import { pythonWorker } from './worker.mjs';
import { composeConstructionCandidate } from './construction-candidate-svg-v1.mjs';
import { checkSetDiagramPlan, composeSetDiagramFigure } from './set-diagram-v1.mjs';
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
  if (slot !== 'body' && (!choice || !question.choices?.[Number(choice[1]) - 1])) throw Error('Slot is absent from source: ' + slot);
  if (seen.has(slot)) throw Error('Duplicate slot: ' + slot);
  seen.add(slot);
  if (!plan?.capability) throw Error('Missing figure plan: ' + slot);
  if (plan.capability === 'set-diagram-figure-v1') checkSetDiagramPlan(plan);
  if (typeof typography?.baseFontPx !== 'number' || typeof typography?.displayScale !== 'number') throw Error('Typography is required: ' + slot);
}

fs.mkdirSync(outputPath);
const browser = await launchBrowser();
try {
  for (const { slot, plan, typography } of config.figures) {
    const identity = assetIdentity(path.posix.basename(sourcePath, '.js') + '|' + config.questionId, 'PROBLEM_VISUAL', slot);
    let composed;
    if (plan.capability === 'set-diagram-figure-v1') {
      const model = checkSetDiagramPlan(plan);
      composed = await composeSetDiagramFigure({ plan, model, identity, typographyPolicy: typography, browser });
    } else {
      const checkedWorker = async (input, options) => {
        const result = await pythonWorker(input, options);
        if (result.status !== 'OK') throw Error(JSON.stringify(result.result));
        return result.result;
      };
      const framed = plan.graphPlan ? {
        ...plan, graphPlan: (await checkedWorker({ action: 'frame_graph', graphPlan: plan.graphPlan })).graphPlan
      } : plan;
      const model = framed.graphPlan
        ? await checkedWorker({ action: 'graph', graphPlan: framed.graphPlan })
        : await checkedWorker({ action: 'construction', graph: framed.mathPlan }, { timeoutMs: 90000 });
      composed = await composeConstructionCandidate({ plan: framed, model, identity, typographyPolicy: typography, browser });
    }
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
