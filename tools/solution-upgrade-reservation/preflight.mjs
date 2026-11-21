#!/usr/bin/env node
// Read-only documentation evidence gate for the four solution-upgrade reservations.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const manifestFile = path.join(root, 'docs/operations/solution-upgrade-reservations/docs-manifest.json');
const validCourses = new Set(['h1', 'algebra', 'calculus1', 'probstat']);
const args = process.argv.slice(2);
let course = null;
let receiptFile = null;
let svg = false;
let svgKind = null;

for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--course') course = args[++i];
  else if (args[i] === '--receipt') receiptFile = args[++i];
  else if (args[i] === '--svg') svg = true;
  else if (args[i] === '--svg-kind') { svgKind = args[++i]; svg = true; }
  else throw new Error(`Unknown option: ${args[i]}`);
}
if (!validCourses.has(course)) throw new Error('Use --course h1|algebra|calculus1|probstat');

const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
const headSha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
if (svgKind && !Object.hasOwn(manifest.svgGuidesByKind, svgKind)) {
  throw new Error('Use --svg-kind graph|plane|solid|stat');
}
const paths = [...manifest.core, ...(svg ? manifest.svg : []), ...(svgKind ? [manifest.svgGuidesByKind[svgKind]] : [])];
const required = [];
for (const rel of [...new Set(paths)]) {
  if (path.isAbsolute(rel) || rel.split('/').includes('..')) throw new Error(`Unsafe path: ${rel}`);
  // In sparse worktrees, read the exact tracked HEAD blob instead of treating
  // an intentionally absent working-tree file as an absent policy document.
  let content;
  try { content = readFileSync(path.join(root, rel), 'utf8'); }
  catch (error) {
    if (error.code !== 'ENOENT') throw error;
    content = execFileSync('git', ['show', `HEAD:${rel}`], { cwd: root, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  }
  required.push({
    path: rel,
    sha256: createHash('sha256').update(content).digest('hex'),
    github: `https://github.com/${manifest.repository}/blob/${headSha}/${rel}`,
    content
  });
}

if (receiptFile) {
  const receipt = JSON.parse(readFileSync(path.resolve(receiptFile), 'utf8'));
  if (receipt.course !== course || Boolean(receipt.svg) !== svg) throw new Error('Receipt course/svg mismatch');
  if (svgKind && receipt.svgKind !== svgKind) throw new Error('Receipt svgKind mismatch');
  if (!Array.isArray(receipt.readEvidence)) throw new Error('Missing readEvidence array');
  const evidenceByPath = new Map(receipt.readEvidence.map(row => [row.path, row]));
  for (const doc of required) {
    const e = evidenceByPath.get(doc.path);
    if (!e || e.sha256 !== doc.sha256 || typeof e.quote !== 'string' || e.quote.trim().length < 12 || !doc.content.includes(e.quote.trim())) {
      throw new Error(`Missing/stale/unsupported read receipt: ${doc.path}`);
    }
  }
}

process.stdout.write(`${JSON.stringify({
  course, svg, svgKind, headSha, verifiedReceipt: Boolean(receiptFile),
  requiredDocuments: required.map(({ content, ...row }) => row)
}, null, 2)}\n`);
