#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const args = process.argv.slice(2);
const factsIndex = args.indexOf('--facts');
const runIndex = args.indexOf('--run-id');
const outputIndex = args.indexOf('--output-root');
if (factsIndex < 0 || !args[factsIndex + 1] || runIndex < 0 || !args[runIndex + 1]) {
  console.error('Usage: node build-visual-candidate.mjs --facts <frozen-expected-facts.json> --run-id <id> [--output-root .tmp/archive/<id>/<questionUid>/...]');
  process.exit(2);
}
const runId = args[runIndex + 1];
const factsPath = path.resolve(args[factsIndex + 1]);
// The Archive workspace is .tmp/archive/<runId>/<examUid>: the frozen bundle's questionUid names the exam folder.
let examUid;
try { examUid = JSON.parse(fs.readFileSync(factsPath, 'utf8')).questionUid; } catch (error) { console.error('FACTS_UNREADABLE'); process.exit(2); }
const outputRoot = outputIndex < 0 ? `.tmp/archive/${runId}/${examUid}/visual-engine/production` : args[outputIndex + 1];
const geometryDir = path.join(root, 'archive/tools/geometry-equation');
const config = JSON.stringify({ engineVersion: 'geometry-visual-v1', runId, examUid, outputRoot, productionBaselinePolicy: 'READ_ONLY', allowProductionWrite: false });
const py = String.raw`import json,sys; from pathlib import Path; from visual_engine.past_exam_adapter import build_candidate; print(json.dumps(build_candidate(json.loads(Path(sys.argv[1]).read_text(encoding='utf-8')), json.loads(sys.argv[2])), ensure_ascii=False))`;
const result = spawnSync(process.env.PYTHON || 'python', ['-c', py, factsPath, config], { cwd: geometryDir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.status !== 0) process.exit(result.status ?? 1);
