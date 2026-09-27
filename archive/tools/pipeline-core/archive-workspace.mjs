import fs from 'node:fs';
import path from 'node:path';
import { safePath } from './canonical.mjs';

// The archive-relative names are stable. Only the containing folder changes.
export function archiveWorkspace(root, { workRoot = 'archive-work', examFile } = {}) {
  if (typeof examFile !== 'string' || !examFile.endsWith('.js')) throw new Error('ARCHIVE_EXAM_FILE_REQUIRED');
  const relative = examFile.replace(/^archive\/exams\//, '').replace(/^exams\//, '');
  if (!/^(original|similar|textbook)\//.test(relative)) throw new Error('ARCHIVE_RELATIVE_EXAM_PATH_REQUIRED');
  const destination = safePath(root, workRoot, { mustExist: false });
  const production = path.resolve(root, 'archive');
  if (destination === production || destination.startsWith(`${production}${path.sep}`) || production.startsWith(`${destination}${path.sep}`)) throw new Error('PRODUCTION_WORK_ROOT_FORBIDDEN');
  if (workRoot.split('/').some(part => ['_generated', 'candidate'].includes(part))) throw new Error('WORK_FOLDER_REQUIRED');
  const examId = path.posix.basename(relative, '.js');
  if (!examId || /[\\\x00-\x1f]/.test(examId) || /\.candidate$/.test(examId)) throw new Error('ACTUAL_ARCHIVE_FILENAME_REQUIRED');
  const examPath = `${workRoot}/exams/${relative}`;
  const evidenceDir = `${workRoot}/evidence/${examId}`;
  const assetDir = `${workRoot}/assets/images/${examId}`;
  for (const entry of [examPath, evidenceDir, assetDir]) safePath(root, entry, { mustExist: false });
  return { schemaVersion: 'APMATH_ARCHIVE_WORKSPACE_v1', workRoot, archiveRelativePath: relative, examId, examPath, assetRoot: workRoot, assetDir, evidenceDir };
}

export function initArchiveWorkspace(root, options) {
  const layout = archiveWorkspace(root, options);
  for (const relative of [path.posix.dirname(layout.examPath), layout.assetDir, layout.evidenceDir]) fs.mkdirSync(safePath(root, relative, { mustExist: false }), { recursive: true });
  return { status: 'WORKSPACE_READY', ...layout };
}

export function workingExamOptions(root, options) {
  if (!options.workRoot && !options.examFile) {
    const inferred = options.candidatePath?.match(/^(.+)\/exams\/((?:original|similar|textbook)\/.+\.js)$/);
    if (!inferred || inferred[1] === 'archive') return options;
    options = { ...options, workRoot: inferred[1], examFile: inferred[2] };
  }
  const layout = archiveWorkspace(root, options);
  if (options.candidatePath && options.candidatePath !== layout.examPath) throw new Error('WORKING_EXAM_PATH_CONFLICT');
  if (options.assetRoot && options.assetRoot !== layout.assetRoot) throw new Error('WORKING_ASSET_ROOT_CONFLICT');
  const sourceRoot = options.sourceRoot || 'archive';
  const sourcePath = options.sourcePath || `${sourceRoot}/exams/${layout.archiveRelativePath}`;
  return { ...options, sourcePath, candidatePath: layout.examPath, assetRoot: layout.assetRoot, sourceAssetRoot: options.sourceAssetRoot || sourceRoot, workdir: options.workdir || `${layout.evidenceDir}/reviews/${options.runId}`, workspace: layout };
}

// Evidence stays beside the workspace, rather than beside a candidate file.
// Legacy paths remain readable for already-frozen runs.
export function examStorage(file) {
  let ancestor = path.dirname(path.resolve(file));
  while (path.dirname(ancestor) !== ancestor) {
    if (path.basename(ancestor) === 'exams') {
      const assetRoot = path.dirname(ancestor);
      return { assetRoot, evidenceRoot: path.join(assetRoot, 'evidence', path.basename(file, '.js')) };
    }
    ancestor = path.dirname(ancestor);
  }
  const evidenceRoot = path.basename(path.dirname(file)) === 'candidate' ? path.dirname(path.dirname(file)) : path.dirname(file);
  return { evidenceRoot, assetRoot: evidenceRoot };
}
