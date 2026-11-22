// Student portal "유사문제 풀어보기": a small map from each past exam to its similar-problem files.
//
// The pairing is NOT re-invented here. The student portal cannot download the 75 MB catalog, and the
// "이 시험의 유사문제" cell of the school exam screen computes the pair from the catalog's exam list with
// Archive2Similar.pairSimilarSets, so this build step runs that same function once over the registered
// catalog and ships only the result (about 12 KB, about 1.5 KB gzipped). Nothing is stored in git, in D1 or in
// the Worker: the file exists only in the staged Pages site and is rebuilt on every release.
//
// Shape: { version: 1, map: { "<original file>": [["<similar file>", <question count>], ...] } }
// Files are relative to archive/exams/, exactly like Archive2 exam `file` values. The portal's assignment
// archive_file is "exams/<file>", so the lookup there strips the "exams/" prefix.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

export const SIMILAR_LINKS_PATH = 'archive/data/similar-links-v1.json';
export const SIMILAR_LINKS_INPUTS = ['archive/data/archive2-catalog.json', 'archive/archive2-similar.js'];

export function buildSimilarLinks(root) {
  for (const input of SIMILAR_LINKS_INPUTS) {
    if (!fs.statSync(path.join(root, input), { throwIfNoEntry: false })?.isFile())
      throw new Error(`similar-link input is missing: ${input}`);
  }
  const similar = createRequire(import.meta.url)(path.join(root, 'archive/archive2-similar.js'));
  const catalog = JSON.parse(fs.readFileSync(path.join(root, SIMILAR_LINKS_INPUTS[0]), 'utf8'));
  if (!Array.isArray(catalog.exams)) throw new Error('catalog has no exams array');
  const pairs = similar.pairSimilarSets(catalog.exams);
  const shipped = (file) => fs.statSync(path.join(root, 'archive/exams', file), { throwIfNoEntry: false })?.isFile() === true;
  const map = Object.create(null);
  // An exam file that does not ship would be a dead link in a student's hand, so it is left out.
  for (const original of [...pairs.similarByOriginal.keys()].sort()) {
    if (!shipped(original)) continue;
    const sets = pairs.setsFor(original).filter((set) => shipped(set.file));
    if (sets.length) map[original] = sets.map((set) => [set.file, Number(set.qCount) || 0]);
  }
  const content = Buffer.from(`${JSON.stringify({ version: 1, map })}\n`, 'utf8');
  return {
    path: SIMILAR_LINKS_PATH,
    content,
    bytes: content.length,
    sourceBytes: 0,
    reasons: ['past exam to similar-problem files, computed with Archive2Similar.pairSimilarSets over the registered catalog'],
    similarLinkInputs: [...SIMILAR_LINKS_INPUTS],
  };
}
