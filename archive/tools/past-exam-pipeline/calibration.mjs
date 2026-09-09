import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bytesSha, writeNewJson } from '../pipeline-core/canonical.mjs';
import { prepareCalibration, validateCalibration, assertBuilderStart } from './lib/calibration.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const arg = name => { const i = process.argv.indexOf(name); if (i < 0 || !process.argv[i + 1]) throw new Error(`${name} required`); return process.argv[i + 1]; };
try {
  const manifest = JSON.parse(fs.readFileSync(arg('--manifest'), 'utf8'));
  if (process.argv.includes('--check')) console.log(JSON.stringify(assertBuilderStart(root, manifest)));
  else {
    let result;
    if (process.argv.includes('--prepare')) result = prepareCalibration(root, manifest, JSON.parse(fs.readFileSync(arg('--samples'), 'utf8')));
    else if (process.argv.includes('--freeze')) {
      result = JSON.parse(fs.readFileSync(arg('--decision'), 'utf8'));
      const checked = validateCalibration(root, result, { manifest, requireLatestMain: true, requirePass: false });
      if (checked.status !== 'PASS') throw new Error(checked.errors.join(';'));
      result.status = 'PASS';
    } else throw new Error('--prepare, --freeze or --check required');
    const out = path.resolve(arg('--out'));
    for (const protectedPath of ['archive/exams', 'archive/assets', 'archive/db.js', 'archive/question-index.js']) {
      const full = path.resolve(root, protectedPath);
      if (out === full || out.startsWith(full + path.sep)) throw new Error('CALIBRATION_PRODUCTION_OUTPUT_FORBIDDEN');
    }
    writeNewJson(out, result);
    const bytes = fs.readFileSync(out);
    console.log(JSON.stringify({ status: result.status, referenceSampleLock: { path: out, bytes: bytes.length, sha256: bytesSha(bytes) } }, null, 2));
  }
} catch (error) { console.error(`BUILDER_START_BLOCKED:${error.message}`); process.exitCode = 1; }
