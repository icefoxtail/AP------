import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateBatchManifest } from '../pipeline-core/batch.mjs';
import { writeNewJson } from '../pipeline-core/canonical.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const args = process.argv.slice(2);
const output = args.includes('--out') ? args[args.indexOf('--out') + 1] : null;
let result;
try {
  if (!args[0] || !args[1] || !args[2] || args[2].startsWith('--')) throw new Error('Usage: <manifest> <inventory> <registry> [--out NEW_REPORT]');
  const manifest = JSON.parse(fs.readFileSync(args[0], 'utf8'));
  const inventoryBytes = fs.readFileSync(args[1]);
  const registry = JSON.parse(fs.readFileSync(args[2], 'utf8'));
  result = validateBatchManifest(root, manifest, JSON.parse(inventoryBytes), inventoryBytes, registry.records || registry.canonicalBatches || registry);
} catch (error) { result = { status: 'FAIL', errors: [error.message] }; }
result.status = `${result.status}_ADAPTIVE_BATCH_MANIFEST`;
if (output) writeNewJson(path.resolve(output), result);
console.log(JSON.stringify(result, null, 2));
if (result.status !== 'PASS_ADAPTIVE_BATCH_MANIFEST') process.exitCode = 1;
