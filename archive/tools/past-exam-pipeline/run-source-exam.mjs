import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runFolderExtraction, assertFolderExtraction } from './lib/folder-extraction.mjs';

const args = process.argv.slice(2);
const value = name => { const i = args.indexOf(name); return i < 0 ? undefined : args[i + 1]; };
try {
  const root = path.resolve(value('--root') || path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
  if (!value('--manifest')) throw new Error('--manifest is required');
  const manifest = JSON.parse(fs.readFileSync(path.resolve(root, value('--manifest')), 'utf8'));
  const output = args.includes('--check-workspace') ? assertFolderExtraction(root, manifest, { replace: args.includes('--replace-source') || args.includes('--prepare') }).layout : await runFolderExtraction(manifest, { root, workRoot: value('--work-root'), prepareOnly: args.includes('--prepare'), replace: args.includes('--replace-source'), dpi: Number(value('--dpi') || 220) });
  console.log(JSON.stringify(output, null, 2));
  if (output.status === 'NEEDS_WORK') process.exitCode = 2;
} catch (error) { console.error(error.stack || String(error)); process.exitCode = 1; }
