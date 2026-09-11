import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const base = 'archive/_generated/past-exam-v4-gold4-maesan-2020-20260911';
const runPath = path.join(root, base, 'core-run-r3b/run.machine.json');
const renderDir = path.join(root, base, 'render-r3b');
const outPath = path.join(root, base, 'core-run-r3b/run.render-bound.json');
const run = JSON.parse(fs.readFileSync(runPath, 'utf8'));
const files = fs.readdirSync(renderDir).filter(name => /^candidate-0-(exam|solution|answer)-(desktop|mobile)\.json$/.test(name)).sort();
if (files.length !== 6) throw new Error(`RENDER_CAPTURE_MATRIX_REQUIRED:${files.length}`);
const refs = files.map(name => {
  const relative = `${base}/render-r3b/${name}`;
  const bytes = fs.readFileSync(path.join(root, relative));
  return { path: relative, bytes: bytes.length, sha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}` };
});
run.evidence = [...run.evidence, ...refs];
fs.writeFileSync(outPath, `${JSON.stringify(run, null, 2)}\n`, 'utf8');
const runBytes = fs.readFileSync(outPath);
const runRef = { path: `${base}/core-run-r3b/run.render-bound.json`, bytes: runBytes.length, sha256: `sha256:${crypto.createHash('sha256').update(runBytes).digest('hex')}` };
fs.writeFileSync(path.join(root, base, 'core-run-r3b/run.render-bound.ref.json'), `${JSON.stringify([runRef], null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ outPath: `${base}/core-run-r3b/run.render-bound.json`, runRef, added: refs }, null, 2));
