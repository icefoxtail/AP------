import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const input = JSON.parse(fs.readFileSync(path.join(OUT, 'target_inventory.json'), 'utf8'));
const bundles = path.join(OUT, 'v1-source-only'); fs.mkdirSync(bundles, { recursive: true });
for (const row of input.rows) {
  const bundle = { bundleVersion: 'V1_SOURCE_ONLY_LOGIC_VISUAL_v1', questionUid: row.questionUid, examId: row.examId, sourceJsPath: row.sourceJsPath, id: row.id, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey, content: row.content, choices: row.choices, problemImageRef: row.problemImageRef, curriculumBoundary: row.curriculumBoundary, expectedVisualRequirementSignal: row.expectedVisualRequirementSignal, visibility: { answer: false, solution: false, solutionImage: false, builderFact: false, previousVerdict: false } };
  fs.writeFileSync(path.join(bundles, `${row.questionUid.replaceAll(/[^\p{L}\p{N}_-]+/gu, '_')}.json`), JSON.stringify(bundle, null, 2) + '\n', 'utf8');
}
const manifest = input.rows.map((row) => ({ questionUid: row.questionUid, bundlePath: `v1-source-only/${row.questionUid.replaceAll(/[^\p{L}\p{N}_-]+/gu, '_')}.json`, inputSha: row.sourceOnlyInputSha, expectedVisualRequirementSignal: row.expectedVisualRequirementSignal }));
fs.writeFileSync(path.join(OUT, 'v1_source_only_manifest.json'), JSON.stringify({ generatedAtKst: '2026-09-05', coverageCount: manifest.length, targetCount: input.finalTargetCount, coverage: manifest.length / input.finalTargetCount, manifestSha: sha256(manifest), entries: manifest }, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ coverageCount: manifest.length, targetCount: input.finalTargetCount, coverage: manifest.length / input.finalTargetCount, manifestSha: sha256(manifest) }, null, 2));
