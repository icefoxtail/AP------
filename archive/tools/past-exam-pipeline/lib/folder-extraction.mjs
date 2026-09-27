import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { archiveWorkspace, initArchiveWorkspace } from '../../pipeline-core/archive-workspace.mjs';
import { fileRef, objectSha, bytesSha } from '../../pipeline-core/canonical.mjs';
import { freezeSourceInventory } from './hardening.mjs';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const write = (file, value) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); };

export function folderExtractionManifest(root, manifest, workRoot) {
  const layout = archiveWorkspace(root, { workRoot: workRoot || manifest.workRoot || 'archive-work', examFile: manifest.archiveRelativePath });
  if (manifest.examId !== layout.examId) throw new Error('ARCHIVE_FILENAME_EXAM_ID_MISMATCH');
  const absolute = value => value ? path.resolve(root, value) : '';
  const normalized = { ...manifest, storageLayout: 'ARCHIVE_FOLDERS', workRoot: layout.workRoot, projectRoot: root, outputDir: path.resolve(root, layout.evidenceDir), workingExamPath: path.resolve(root, layout.examPath), assetRoot: path.resolve(root, layout.assetRoot), outputFileName: `${layout.examId}.js`, pdfPath: absolute(manifest.pdfPath), sourcePageImagePaths: (manifest.sourcePageImagePaths || []).map(absolute), sourceInventoryPath: absolute(manifest.sourceInventoryPath), visionPageExtractJsonPath: absolute(manifest.visionPageExtractJsonPath || manifest.visionExtractJsonPath) };
  if (Boolean(normalized.pdfPath) === Boolean(normalized.sourcePageImagePaths.length)) throw new Error('ONE_SOURCE_FORMAT_REQUIRED');
  if (normalized.pdfPath && path.extname(normalized.pdfPath).toLowerCase() !== '.pdf') throw new Error('PDF_OR_PAGE_IMAGES_REQUIRED');
  for (const file of normalized.pdfPath ? [normalized.pdfPath] : normalized.sourcePageImagePaths) if (!fs.statSync(file).isFile()) throw new Error('SOURCE_FILE_REQUIRED');
  return { layout, manifest: normalized };
}

export function assertFolderExtraction(root, manifest, { replace = false } = {}) {
  const resolved = folderExtractionManifest(root, manifest, manifest.workRoot);
  for (const key of ['workingExamPath', 'assetRoot', 'outputDir']) if (path.resolve(manifest[key] || '') !== resolved.manifest[key]) throw new Error(`WORKSPACE_PATH_MISMATCH:${key}`);
  const sources = resolved.manifest.pdfPath ? [resolved.manifest.pdfPath] : resolved.manifest.sourcePageImagePaths;
  const files = sources.map(file => ({ path: file, sha256: bytesSha(fs.readFileSync(file)) }));
  const recorded = JSON.parse(fs.readFileSync(path.join(resolved.manifest.outputDir, 'source-files.json'), 'utf8'));
  if (JSON.stringify(recorded.files) !== JSON.stringify(files)) throw new Error('SOURCE_FILES_CHANGED');
  if (manifest.sourceInventorySha) {
    const inventoryBytes = fs.readFileSync(resolved.manifest.sourceInventoryPath);
    if (bytesSha(inventoryBytes) !== manifest.sourceInventorySha) throw new Error('SOURCE_INVENTORY_STALE');
    const documentSha = resolved.manifest.pdfPath ? files[0].sha256 : objectSha(files.map(file => file.sha256));
    if (JSON.parse(inventoryBytes).sourceDocumentSha256 !== documentSha) throw new Error('SOURCE_DOCUMENT_SHA_MISMATCH');
  }
  if (fs.existsSync(resolved.manifest.workingExamPath)) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(resolved.manifest.workingExamPath, 'utf8'), context, { timeout: 1000 });
    if (!Array.isArray(context.window.questionBank)) throw new Error('JS_BANK_REQUIRED');
    if (context.window.questionBank.some(q => q.answer || q.solution || q.solutionImage)) throw new Error('COMPLETED_WORKING_EXAM_OVERWRITE_FORBIDDEN');
    if (!replace) throw new Error('WORKING_EXAM_EXISTS');
  }
  return resolved;
}

export async function runFolderExtraction(manifest, { root = repoRoot, workRoot, prepareOnly = false, replace = false, sourceOnly = true, dpi = 220, python = process.env.APMATH_PYTHON || 'python' } = {}) {
  root = path.resolve(root);
  const resolved = folderExtractionManifest(root, manifest, workRoot);
  const normalized = { ...resolved.manifest, extractionScope: sourceOnly ? 'SOURCE_ONLY' : 'PAST_EXAM_V3_COMPLETE' };
  const layout = resolved.layout;
  if (fs.existsSync(normalized.workingExamPath) && !prepareOnly) {
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(normalized.workingExamPath, 'utf8'), context, { timeout: 1000 });
    if ((context.window.questionBank || []).some(q => q.answer || q.solution || q.solutionImage)) throw new Error('COMPLETED_WORKING_EXAM_OVERWRITE_FORBIDDEN');
    if (!replace) throw new Error('WORKING_EXAM_EXISTS: use --replace-source to explicitly re-extract');
  }
  if (!Number.isSafeInteger(dpi) || dpi < 72 || dpi > 600) throw new Error('DPI_OUT_OF_RANGE');
  if (!prepareOnly && !normalized.visionPageExtractJsonPath) throw new Error('PAGE_EXTRACTION_JSON_REQUIRED: use --prepare first; no empty JS is written');
  initArchiveWorkspace(root, { workRoot: layout.workRoot, examFile: layout.archiveRelativePath });
  const sources = normalized.pdfPath ? [normalized.pdfPath] : normalized.sourcePageImagePaths;
  const sourceFiles = sources.map(file => ({ path: file, sha256: bytesSha(fs.readFileSync(file)) }));
  // Ordered page identities are retained for image-only sources as well.
  const identityFile = path.join(normalized.outputDir, 'source-files.json');
  if (fs.existsSync(identityFile) && JSON.stringify(JSON.parse(fs.readFileSync(identityFile)).files) !== JSON.stringify(sourceFiles)) throw new Error('SOURCE_FILES_CHANGED');
  write(identityFile, { files: sourceFiles });
  if (!prepareOnly) {
    if (normalized.sourcePageImagePaths.length) {
      const inventory = normalized.sourceInventory || JSON.parse(fs.readFileSync(normalized.sourceInventoryPath, 'utf8'));
      const documentSha = objectSha(sourceFiles.map(file => file.sha256));
      if (inventory.sourceDocumentSha256 && inventory.sourceDocumentSha256 !== documentSha) throw new Error('SOURCE_DOCUMENT_SHA_MISMATCH');
      normalized.sourceInventory = { ...inventory, sourceDocumentSha256: documentSha };
    }
    const sourceFreeze = freezeSourceInventory({ manifest: normalized, outputDir: normalized.outputDir, pageCount: normalized.sourcePageImagePaths.length || null });
    Object.assign(normalized, { sourceInventoryPath: sourceFreeze.inventoryPath, sourceIdentityMapPath: sourceFreeze.sourceIdentityMapPath, sourceInventorySha: sourceFreeze.sourceInventorySha, sourceIdentityMapSha: sourceFreeze.sourceIdentityMapSha });
  }
  const manifestFile = path.join(normalized.outputDir, 'manifest.json');
  write(manifestFile, normalized);
  const args = [path.join(repoRoot, 'archive/tools/past-exam-pipeline/helpers/scanned_exam_pipeline.py'), '--manifest', manifestFile, '--out', normalized.outputDir, '--dpi', String(dpi), '--working-exam', normalized.workingExamPath];
  if (prepareOnly) args.push('--prepare-only');
  if (replace) args.push('--replace-source');
  const { stdout } = await execFileAsync(python, args, { cwd: root, timeout: 600000, maxBuffer: 50 * 1024 * 1024, env: { ...process.env, PYTHONIOENCODING: 'utf-8' } });
  const result = JSON.parse(stdout);
  const receipt = { ...result, scope: normalized.extractionScope, layout, productionAuthorized: false, ...(fs.existsSync(normalized.workingExamPath) ? { workingExamRef: fileRef(root, layout.examPath) } : {}) };
  if (!prepareOnly) receipt.pageExtractionSha = bytesSha(fs.readFileSync(normalized.visionPageExtractJsonPath));
  write(path.join(normalized.outputDir, 'extraction.json'), receipt);
  return receipt;
}
