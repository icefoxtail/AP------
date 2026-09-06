import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const source = path.join(OUT, 'v1-source-only'); const blind = path.join(OUT, 'v1-blind-review-input'); fs.mkdirSync(blind, { recursive: true });
for (const file of fs.readdirSync(source)) { const bundle = JSON.parse(fs.readFileSync(path.join(source, file), 'utf8')); delete bundle.expectedVisualRequirementSignal; delete bundle.visibility; delete bundle.bundleVersion; fs.writeFileSync(path.join(blind, file), JSON.stringify({ blindInputVersion: 'V1_BLIND_SOURCE_ONLY_v1', ...bundle }, null, 2) + '\n', 'utf8'); }
const files = fs.readdirSync(blind).sort(); fs.writeFileSync(path.join(OUT, 'v1_blind_review_manifest.json'), JSON.stringify({ generatedAtKst: '2026-09-05', count: files.length, files, instructions: ['Do not read production answer/solution/solutionImage for this review.', 'Return only source-only expected visual requirement signals and semantic question notes.', 'Do not modify production files.'] }, null, 2) + '\n', 'utf8'); console.log(JSON.stringify({ blindInputCount: files.length, directory: blind }, null, 2));
