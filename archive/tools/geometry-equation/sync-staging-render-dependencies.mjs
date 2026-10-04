import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const ARCHIVE = path.join(ROOT, 'archive');
const STAGING = path.join(ROOT, 'reports', 'geometry_equation_20260902', 'staging', 'archive');
const dependencies = ['css', 'data/question_metadata.json'];
for (const relativePath of dependencies) {
  const source = path.join(ARCHIVE, relativePath);
  const target = path.join(STAGING, relativePath);
  if (!fs.existsSync(source)) throw new Error(`Missing production render dependency: ${relativePath}`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  if (fs.statSync(source).isDirectory()) fs.cpSync(source, target, { recursive: true, force: false, errorOnExist: false });
  else fs.copyFileSync(source, target);
}
console.log(JSON.stringify({ status: 'STAGING_RENDER_DEPENDENCIES_READY', copied: dependencies }, null, 2));
