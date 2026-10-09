import fs from 'node:fs';
import path from 'node:path';

export const EXAM_WORKSPACE_ROOT = '.tmp/archive';

export function assertExamWorkspace(repoRoot, target) {
  const root = path.resolve(repoRoot, EXAM_WORKSPACE_ROOT);
  const absolute = path.resolve(repoRoot, target);
  const relative = path.relative(root, absolute);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`EXAM_WORKSPACE_REQUIRED:${target}`);
  }
  if (relative.split(path.sep).some(part => /generated/i.test(part))) {
    throw new Error(`GENERATED_EXAM_PATH_FORBIDDEN:${target}`);
  }
  // Existing junctions/symlinks must not redirect writes into production or elsewhere.
  let ancestor = absolute;
  while (!fs.existsSync(ancestor)) ancestor = path.dirname(ancestor);
  if (fs.existsSync(root)) {
    const realRoot = fs.realpathSync(root);
    const realAncestor = fs.realpathSync(ancestor);
    const realRelative = path.relative(realRoot, realAncestor);
    if (realRoot !== root || realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) {
      throw new Error(`EXAM_WORKSPACE_SYMLINK_ESCAPE:${target}`);
    }
  } else if (fs.realpathSync(ancestor) !== ancestor) {
    throw new Error(`EXAM_WORKSPACE_SYMLINK_ESCAPE:${target}`);
  }
  return absolute;
}

export function forbiddenExamChange(repoPath) {
  const normalized = String(repoPath).replaceAll('\\', '/');
  return normalized.startsWith('.tmp/archive/')
    || /^(?:archive\/_generated|archive\/exams\/_generated)(?:\/|$)/i.test(normalized)
    || (/^archive\/exams\//i.test(normalized) && /generated/i.test(normalized));
}
