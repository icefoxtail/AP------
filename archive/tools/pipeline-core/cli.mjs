import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditManifestFile, profiles, RUN_VERSION, CORE_SHA } from './closure.mjs';
import { objectSha, writeNewJson } from './canonical.mjs';
import { validateVisualFact, semanticSha, compareVisualFacts, VISUAL_SPEC_SHA } from './visual.mjs';
import { rulePreflight } from './rulepack.mjs';
import { prepareDraft } from './prepare.mjs';

const args = process.argv.slice(2);
const value = name => { const i = args.indexOf(name); return i < 0 ? null : args[i + 1]; };
const root = path.resolve(value('--root') || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
let output;
try {
  switch (args[0]) {
    case 'rules': output = rulePreflight(root); break;
    case 'prepare': output = prepareDraft(root, { pipeline: value('--pipeline'), runId: value('--run-id'), sourcePath: value('--source'), candidatePath: value('--candidate'), workdir: value('--workdir') }); break;
    case 'render': output = await (await import('./render.mjs')).captureRender(root, read(value('--manifest')), value('--workdir'), { channel: value('--browser-channel') || 'chrome' }); break;
    case 'render-review': output = (await import('./render.mjs')).createRenderReview(root, read(value('--manifest')), read(value('--capture-ref')), read(value('--decision'))); break;
    case 'audit': {
      const manifest = value('--manifest');
      if (!manifest) throw new Error('--manifest is required');
      output = auditManifestFile(root, path.resolve(manifest), value('--pipeline'));
      break;
    }
    case 'fact': {
      const fact = args.includes('--stdin') ? JSON.parse(fs.readFileSync(0, 'utf8')) : read(value('--file'));
      output = validateVisualFact(fact);
      if (output.status === 'PASS') output = { ...output, semanticSha: semanticSha(fact), specSha: VISUAL_SPEC_SHA };
      break;
    }
    case 'parity':
      output = compareVisualFacts(read(value('--expected')), read(value('--observed')));
      break;
    case 'inventory':
      output = { status: 'INVENTORY_ONLY', runSchema: RUN_VERSION, coreSha: CORE_SHA, pipelines: profiles.pipelines, note: 'Registered closure adapters; generation coverage remains bounded by each adapter. This is not quality PASS.' };
      break;
    case 'template': {
      const pipeline = value('--pipeline');
      if (!profiles.pipelines[pipeline]) throw new Error('Unknown --pipeline');
      output = { schemaVersion: RUN_VERSION, pipeline, runId: 'REPLACE_WITH_NEW_RUN_ID', revision: 1, builderSessionId: 'REPLACE_WITH_BUILDER_SESSION', canonicalRecordId: 'REPLACE_WITH_REGISTRY_RECORD', questions: [], inputs: [], evidence: [], registry: [], denominator: { status: 'UNFROZEN', stale: true }, inputSha: null, status: 'DRAFT_NOT_EXECUTABLE' };
      break;
    }
    default: throw new Error('Usage: cli.mjs audit --manifest FILE [--root ROOT] [--out NEW_FILE] | fact --file FILE | parity --expected FILE --observed FILE | template --pipeline ID | inventory');
  }
} catch (error) { output = { status: 'BLOCKED', errors: [error.message], productionAuthorized: false }; }
output.reportSha = objectSha(output);
if (value('--out')) {
  const target = path.resolve(value('--out'));
  const protectedRoots = ['archive/exams', 'archive/assets'].map(p => path.resolve(root, p));
  if (protectedRoots.some(p => target === p || target.startsWith(`${p}${path.sep}`))) throw new Error('PRODUCTION_OUTPUT_FORBIDDEN');
  writeNewJson(target, output);
}
console.log(JSON.stringify(output, null, 2));
if (!['PASS', 'INVENTORY_ONLY', 'DRAFT_NOT_EXECUTABLE', 'CAPTURED_REVIEW_REQUIRED'].includes(output.status)) process.exitCode = 1;
