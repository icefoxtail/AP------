import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { buildSourceMetadataFirstPass, loadSourceMetadataCatalog, makeSourceMetadataRecheckDraft, reconcileSourceMetadata } from './lib/source-metadata.mjs';
import { archiveWorkspace, examStorage } from '../pipeline-core/archive-workspace.mjs';
import { bytesSha, objectSha, safePath } from '../pipeline-core/canonical.mjs';
import { METADATA_FIELDS } from './lib/source-metadata.mjs';

const args = process.argv.slice(2);
const arg = name => { const i = args.indexOf(`--${name}`); return i < 0 ? null : args[i + 1]; };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const write = (file, data, fresh = false) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, { flag: fresh ? 'wx' : 'w' }); };
try {
  let output;
  if (args[0] === 'catalog') {
    const catalog = loadSourceMetadataCatalog();
    const course = arg('course'), unit = arg('unit'), curriculum = arg('curriculum');
    const units = [...catalog.units.values()].filter(row => (!course || row.course.replace(/\s/g, '') === course.replace(/\s/g, '')) && (!unit || row.key === unit) && (!curriculum || row.key.startsWith('M') || row.key.startsWith(curriculum === '2022' ? 'H22-' : 'H15-')));
    const keys = new Set(units.map(row => row.key));
    const bindings = catalog.registry.bindingRows.filter(row => keys.has(row.standardUnitKey) && (!curriculum || row.curriculum === curriculum));
    const problemKeys = new Set(bindings.map(row => row.problemTypeKey));
    output = { schema: 'PAST_EXAM_SOURCE_METADATA_CATALOG_v1', metadataFields: METADATA_FIELDS, catalogSha: catalog.catalogSha, units, subunits: [...catalog.subunits.values()].filter(row => keys.has(row.standardUnitKey)), problemTypes: [...catalog.registry.problemTypes.values()].filter(row => problemKeys.has(row.problemTypeKey)), templates: [...catalog.registry.templates.values()].filter(row => problemKeys.has(row.parentProblemTypeKey)), bindings, conditions: [...catalog.registry.conditions.values()].filter(row => row.status === 'ACTIVE'), crossConcepts: [...catalog.registry.concepts.values()].filter(row => row.status === 'ACTIVE'), integrationPatterns: [...catalog.registry.integrationPatterns] };
  } else if (args[0] === 'first-pass') {
    if (!arg('input') || !arg('manifest') || !arg('out')) throw new Error('--input --manifest --out are required');
    output = buildSourceMetadataFirstPass(read(arg('input')).questions, read(arg('manifest')));
  } else if (args[0] === 'reconcile') {
    if (!arg('working-exam') || !arg('manifest') || !arg('decision')) throw new Error('--working-exam --manifest --decision are required');
    const file = path.resolve(arg('working-exam'));
    const context = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { timeout: 1000 });
    const storage = examStorage(file), manifest = read(arg('manifest'));
    const layout = archiveWorkspace(manifest.projectRoot, { workRoot: manifest.workRoot, examFile: manifest.archiveRelativePath });
    if (manifest.storageLayout !== 'ARCHIVE_FOLDERS' || file !== safePath(manifest.projectRoot, layout.examPath) || file !== path.resolve(manifest.workingExamPath) || storage.evidenceRoot !== path.resolve(manifest.outputDir)) throw new Error('SOURCE_METADATA_WORKSPACE_MISMATCH');
    const result = reconcileSourceMetadata(JSON.parse(JSON.stringify(context.window.questionBank)), read(path.join(storage.evidenceRoot, 'reports/source_metadata_first_pass.json')), read(arg('decision')), manifest);
    const currentReport = path.join(storage.evidenceRoot, 'reports/solution_metadata_reconciliation.json');
    const previousRevision = fs.existsSync(currentReport) ? Number(read(currentReport).revision || 1) : 0;
    const revision = Number(arg('revision') || 1);
    if (!Number.isSafeInteger(revision) || revision !== previousRevision + 1) throw new Error('SOURCE_METADATA_NEW_RECONCILIATION_REVISION_REQUIRED');
    result.report.revision = revision;
    if (previousRevision) {
      const previous = read(currentReport);
      result.report.previousReconciliationSha = bytesSha(fs.readFileSync(currentReport));
      for (const item of result.report.items) {
        const before = previous.items.find(row => row.sourceIdentityKey === item.sourceIdentityKey)?.currentMetadata;
        if (!before) throw new Error('SOURCE_METADATA_PRIOR_REVISION_COVERAGE_FAIL');
        item.sourceFirstPassChanges = item.changes;
        item.previousMetadata = before;
        item.changes = METADATA_FIELDS.filter(field => objectSha(before[field]) !== objectSha(item.currentMetadata[field])).map(field => ({ field, before: before[field], after: item.currentMetadata[field] }));
        item.status = item.changes.length ? 'ADJUSTED' : 'CONFIRMED';
      }
    }
    write(path.join(storage.evidenceRoot, 'reports/metadata-reconciliation', `revision-${String(revision).padStart(3, '0')}.json`), result.report, true);
    write(currentReport, result.report);
    fs.writeFileSync(file, `window.examTitle = ${JSON.stringify(context.window.examTitle)};\nwindow.questionBank = ${JSON.stringify(result.questions, null, 2)};\n`);
    output = { status: 'SOLUTION_RECONCILED_REVIEW_REQUIRED', questionCount: result.report.items.length, adjustedCount: result.report.items.filter(row => row.status === 'ADJUSTED').length, productionAuthorized: false };
  } else if (args[0] === 'recheck-draft') {
    const context = { window: {} }; vm.runInNewContext(fs.readFileSync(arg('working-exam'), 'utf8'), context, { timeout: 1000 });
    output = makeSourceMetadataRecheckDraft(context.window.questionBank);
  } else throw new Error('Use catalog, first-pass, recheck-draft, or reconcile');
  if (arg('out')) write(arg('out'), output); else console.log(JSON.stringify(output, null, 2));
} catch (error) { console.error(error.stack || String(error)); process.exitCode = 1; }
