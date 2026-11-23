// Teacher home "exam list": the registered catalog's exam rows (school, year, term, grade, file, kind, ...) as one small file.
//
// The home screen draws its school chips and exam rows, and opens an original exam, from these rows alone. Without this
// file it had to download the whole catalog (about 45 MB, 30,000 questions) and resolve it before it could show anything.
// The rows are NOT re-derived here: they are the catalog's own `exams` array, byte for byte as parsed, so the screen sees
// exactly what the catalog would give it (tests/exam-list-projection.test.mjs compares them). Only the catalog's
// `identityDigest` is added, so the screen can tell when the full catalog it loads later belongs to another release.
//
// Nothing is stored in git: the file exists only in the staged Pages site and is rebuilt on every release, like
// archive/data/similar-links-v1.json (tools/lib/build-similar-links.mjs). A local checkout has no such file and the
// screen then loads the catalog as before. `node tools/lib/build-exam-list.mjs --write` writes a git-ignored local copy
// for trying the light home with a static server.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const EXAM_LIST_PATH = 'archive/data/exam-list-v1.json';
export const EXAM_LIST_INPUTS = ['archive/data/archive2-catalog.json'];
export const EXAM_LIST_SCHEMA = 'archive2-exam-list-v1';

export function buildExamList(root) {
  for (const input of EXAM_LIST_INPUTS) {
    if (!fs.statSync(path.join(root, input), { throwIfNoEntry: false })?.isFile())
      throw new Error(`exam-list input is missing: ${input}`);
  }
  const catalog = JSON.parse(fs.readFileSync(path.join(root, EXAM_LIST_INPUTS[0]), 'utf8'));
  if (!Array.isArray(catalog.exams) || !catalog.exams.length) throw new Error('catalog has no exams array');
  if (!/^[0-9a-f]{64}$/.test(String(catalog.identityDigest || ''))) throw new Error('catalog has no identityDigest');
  const content = Buffer.from(`${JSON.stringify({
    schemaVersion: EXAM_LIST_SCHEMA,
    catalogIdentityDigest: catalog.identityDigest,
    count: catalog.exams.length,
    exams: catalog.exams,
  })}\n`, 'utf8');
  return {
    path: EXAM_LIST_PATH,
    content,
    bytes: content.length,
    sourceBytes: 0,
    reasons: ["the registered catalog's exam rows (home exam list), derived from archive/data/archive2-catalog.json"],
    examListInputs: [...EXAM_LIST_INPUTS],
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url) && process.argv.includes('--write')) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
  const built = buildExamList(root);
  fs.writeFileSync(path.join(root, built.path), built.content);
  console.log(`exam list: ${built.bytes} bytes -> ${built.path} (git-ignored local copy)`);
}
