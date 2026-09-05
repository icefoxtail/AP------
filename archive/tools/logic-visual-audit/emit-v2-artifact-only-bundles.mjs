import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { buildArtifactOnlyBundle } from './lib/visual.mjs';

const repoRoot = path.resolve(process.cwd());
const inventory = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'));
const bundle = buildArtifactOnlyBundle(repoRoot, inventory.items);
const serialized = JSON.stringify(bundle);
const forbidden = ['"content"', '"choices"', '"answer"', '"solution"', '"expectedFact"', '"solutionImageAlt"', '"solutionImageCaption"'];
const leaks = forbidden.filter((token) => serialized.includes(token));
if (leaks.length) throw new Error(`V2 contract leak detected: ${leaks.join(', ')}`);
const output = { ...bundle, artifactOnlyBundleSha: sha256(bundle), hiddenFieldsAssertedAbsent: forbidden };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v2-artifact-only-bundle.json'), output);
console.log(JSON.stringify({ itemCount: output.items.length, observedArtifactCount: output.items.filter((item) => item.artifactExists).length, artifactOnlyBundleSha: output.artifactOnlyBundleSha }, null, 2));
