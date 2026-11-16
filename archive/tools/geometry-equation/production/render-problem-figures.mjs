import fs from 'node:fs';
import path from 'node:path';
import { assetIdentity } from './contracts.mjs';
import { composeProblem } from './problem-figure-render.mjs';
import { composeProblemPresentation } from './problem-figure-presentation.mjs';
import { isSourceSchematicCapability } from './source-schematic-figure.mjs';
import { loadBank } from '../build-visual-render-matrix.mjs';
import { repoRoot, launchBrowser } from '../visual-browser-runtime.mjs';

const presentationCapabilities = new Set(['problem-stroke-profile-v1', 'problem-point-label-profile-v1']);
const [configPath, outputPath] = process.argv.slice(2);
if (!configPath || !outputPath) throw Error('Usage: node render-problem-figures.mjs <plan.json> <new output directory>');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
const sourcePath = config.sourcePath;
if (typeof sourcePath !== 'string' || !/^archive\/exams\/(original|similar|types)\/(?:high|middle)\/(?:[^./][^/]*\/)*[^/]+\.js$/.test(sourcePath)) throw Error('Invalid Archive exam path');
const bank = loadBank(fs.readFileSync(path.join(repoRoot, sourcePath), 'utf8'));
const question = bank.find((row, index) => String(row.id ?? row.qid ?? row.number ?? index + 1) === String(config.questionId));
if (!question) throw Error('Question ID is absent from source');
const seen = new Set();
for (const { slot, plan, typography } of config.figures) {
  const choice = slot.match(/^choice-([1-9])$/);
  if (slot !== 'body' && slot !== 'image' && (!choice || !question.choices?.[Number(choice[1]) - 1])) throw Error('Slot is absent from source: ' + slot);
  if (seen.has(slot)) throw Error('Duplicate slot: ' + slot);
  seen.add(slot);
  if (!plan?.capability) throw Error('Missing figure plan: ' + slot);
  if (presentationCapabilities.has(plan.capability)) continue;
  if (!['set-diagram-figure-v1', 'composite-panels-v1', 'ellipse-figure-v1', 'solid-figure-v1'].includes(plan.capability)
    && !isSourceSchematicCapability(plan.capability) && !plan.graphPlan && !plan.mathPlan) throw Error('Unsupported problem figure plan: ' + plan.capability);
  if (plan.capability === 'set-diagram-figure-v1') checkSetDiagramPlan(plan);
  if (isSourceSchematicCapability(plan.capability) && !['body', 'image'].includes(slot)) throw Error('Schematic requires a body image slot');
  if (typeof typography?.baseFontPx !== 'number' || typeof typography?.displayScale !== 'number') throw Error('Typography is required: ' + slot);
}

fs.mkdirSync(outputPath);
const needsBrowser = config.figures.some(({ plan }) => !presentationCapabilities.has(plan.capability));
const browser = needsBrowser ? await launchBrowser() : null;
try {
  for (const { slot, plan, typography } of config.figures) {
    const identity = assetIdentity(path.posix.basename(sourcePath, '.js') + '|' + config.questionId, 'PROBLEM_VISUAL', slot);
    const composed = presentationCapabilities.has(plan.capability)
      ? composeProblemPresentation(plan, { repoRoot, identity })
      : await composeProblem(plan, identity, typography, browser, { repoRoot, question });
    const { svg, ...result } = composed;
    fs.writeFileSync(path.join(outputPath, slot + '.json'), JSON.stringify({ identity, ...result }, null, 2) + '\n');
    if (!['COMPOSED', 'STYLE_RECOMPOSED'].includes(composed.status)) {
      process.exitCode = 1;
      console.error(slot, composed.status, composed.detail);
      continue;
    }
    fs.writeFileSync(path.join(outputPath, slot + '.svg'), svg);
  }
} finally {
  await browser?.close();
}
