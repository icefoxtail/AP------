import fs from 'node:fs';
import path from 'node:path';
import { buildSourceOnlyBundle, sourceBundleSha } from './lib/source.mjs';
import { readJson, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const inventory = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'));
const preflight = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/rule-preflight.json'));
const bundle = buildSourceOnlyBundle(inventory.items, { appliedRuleRefs: preflight.appliedRuleRefs, ruleRoutingBundleSha: preflight.ruleRoutingBundleSha });
const bundleText = JSON.stringify(bundle);
if (bundleText.match(/"(answer|solution|solutionImage|solutionImageAlt|solutionImageCaption|builderFact|previousVerdict)"/)) throw new Error('V1 contract leak detected');
const output = { ...bundle, sourceOnlyBundleSha: sourceBundleSha(bundle), hiddenFieldsAssertedAbsent: ['answer', 'solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'builderFact', 'previousVerdict'] };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v1-source-only-bundle.json'), output);
console.log(JSON.stringify({ itemCount: output.items.length, sourceOnlyBundleSha: output.sourceOnlyBundleSha }, null, 2));
