import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { runFolderExtraction, folderExtractionManifest } from '../lib/folder-extraction.mjs';
import { loadConfig } from '../lib/config.mjs';
import { buildManifestFromInventoryItem } from '../lib/exam-id.mjs';
import { fileURLToPath } from 'node:url';
import { makeSourceMetadataRecheckDraft, metadataProjection, validateSourceMetadataReconciliation } from '../lib/source-metadata.mjs';

function fixture(t, format = 'pdf') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-folder-extract-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const examId = '25_테스트고_1학기_중간_고1_공통수학1';
  const source = path.join(root, format === 'pdf' ? 'source.pdf' : 'page.png');
  execFileSync(process.env.APMATH_PYTHON || 'python', ['-c', format === 'pdf' ? 'import fitz,sys; d=fitz.open(); p=d.new_page(width=600,height=800); p.insert_text((50,50),"Synthetic test question"); p.draw_rect(fitz.Rect(100,100,200,200)); d.save(sys.argv[1])' : 'from PIL import Image,ImageDraw; import sys; i=Image.new("RGB",(600,800),"white"); ImageDraw.Draw(i).rectangle((100,100,200,200),outline="black"); i.save(sys.argv[1])', source]);
  const vision = path.join(root, 'page-extract.json');
  const q = { displayNo: '1', questionType: '객관식', content: String.raw`$x+1=2$일 때 $x$의 값은?`, choices: ['0', '1', '2', '3', '4'], hasVisualAsset: true, visualAssetType: 'figure', visualAssetBBox: { x1: 100, y1: 100, x2: 200, y2: 200 }, contentConfidence: 1, choicesConfidence: 1, visualAssetConfidence: 1, reviewNeeded: false, reviewReason: [] };
  fs.writeFileSync(vision, JSON.stringify({ pages: [{ pageNo: 1, questions: [q] }] }));
  const manifest = { examId, archiveRelativePath: `original/high/h1/1mid/${examId}.js`, ...(format === 'pdf' ? { pdfPath: source } : { sourcePageImagePaths: [source] }), visionPageExtractJsonPath: vision, sourceInventory: { status: 'INDEPENDENT_INVENTORY_VERIFIED', pageCount: 1, questions: [{ sourceQuestionNo: '1', sourcePageNo: 1, sourcePageEvidencePaths: ['pages/page_p001.png'], disposition: 'INCLUDED' }] } };
  return { root, manifest, vision, q };
}

for (const format of ['pdf', 'images']) test(`${format}: source extraction writes only actual JS and assets, with source identity and no generated lifecycle`, async t => {
  const f = fixture(t, format);
  const result = await runFolderExtraction(f.manifest, { root: f.root, dpi: 72 });
  assert.equal(result.status, 'SOURCE_EXTRACTED_REVIEW_REQUIRED');
  assert.equal(result.questionCount, 1);
  assert.equal(result.visualAssetCropCount, 1);
  assert.equal(result.productionAuthorized, false);
  const file = path.join(f.root, result.layout.examPath);
  const context = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  const q = context.window.questionBank[0];
  assert.equal(q.content, f.q.content); assert.equal(q.answer, ''); assert.equal(q.solution, '');
  assert.equal(q.image, `assets/images/${f.manifest.examId}/q001_visual.png`);
  assert.ok(fs.existsSync(path.join(f.root, 'archive-work', q.image)));
  assert.ok(q.sourceIdentityKey.startsWith('sha256:'));
  assert.equal(fs.existsSync(path.join(f.root, 'archive-work/evidence', f.manifest.examId, '.lifecycle.json')), false);
  assert.equal(fs.existsSync(path.join(f.root, 'archive-work/evidence', f.manifest.examId, 'candidate')), false);
  await assert.rejects(runFolderExtraction(f.manifest, { root: f.root }), /WORKING_EXAM_EXISTS/);
  fs.appendFileSync(file, '\nwindow.questionBank[0].solution="작성한 해설";');
  const before = fs.readFileSync(file);
  await assert.rejects(runFolderExtraction(f.manifest, { root: f.root, replace: true }), /OVERWRITE_FORBIDDEN/);
  assert.deepEqual(fs.readFileSync(file), before);
});

test('prepare renders pages and request without writing an empty JS; inventory verification stays required', async t => {
  const f = fixture(t);
  delete f.manifest.sourceInventory; delete f.manifest.visionPageExtractJsonPath;
  const prepared = await runFolderExtraction(f.manifest, { root: f.root, prepareOnly: true, dpi: 72 });
  assert.equal(prepared.status, 'SOURCE_PAGES_READY');
  assert.equal(prepared.jsWritten, false);
  assert.equal(fs.existsSync(path.join(f.root, prepared.layout.examPath)), false);
  assert.equal(JSON.parse(fs.readFileSync(prepared.inventoryDraft)).status, 'UNVERIFIED');
  await assert.rejects(runFolderExtraction(f.manifest, { root: f.root }), /JSON_REQUIRED/);
  f.manifest.visionPageExtractJsonPath = f.vision;
  await assert.rejects(runFolderExtraction(f.manifest, { root: f.root }), /SOURCE_INVENTORY_REQUIRED/);
  assert.throws(() => folderExtractionManifest(f.root, f.manifest, 'archive'), /PRODUCTION_WORK_ROOT/);
});

test('missing/renumbered source questions and changed source bytes cannot overwrite the working exam', async t => {
  const f = fixture(t);
  const result = await runFolderExtraction(f.manifest, { root: f.root, dpi: 72 });
  const file = path.join(f.root, result.layout.examPath), before = fs.readFileSync(file);
  const assetFile = path.join(f.root, result.layout.assetDir, 'q001_visual.png'), assetBefore = fs.readFileSync(assetFile);
  for (const questions of [[], [{ ...f.q, displayNo: '2' }]]) {
    fs.writeFileSync(f.vision, JSON.stringify({ pages: [{ pageNo: 1, questions }] }));
    await assert.rejects(runFolderExtraction(f.manifest, { root: f.root, replace: true, dpi: 72 }), /SOURCE_EXTRACTION_INCOMPLETE/);
    assert.deepEqual(fs.readFileSync(file), before); assert.deepEqual(fs.readFileSync(assetFile), assetBefore);
  }
  fs.appendFileSync(f.manifest.pdfPath, '\nchanged');
  await assert.rejects(runFolderExtraction(f.manifest, { root: f.root, replace: true }), /SOURCE_FILES_CHANGED/);
});

test('new default configuration and filename mapping do not choose generated/candidate locations or rename duplicate exams', async t => {
  const f = fixture(t);
  const configFile = path.join(f.root, 'config.json');
  fs.writeFileSync(configFile, JSON.stringify({ projectRoot: f.root, sourceRoot: f.root }));
  const cfg = await loadConfig({ config: configFile });
  assert.equal(cfg.workRoot, 'archive-work');
  assert.equal(cfg.generatedRoot, undefined);
  assert.equal(cfg.candidateFileSuffix, '');
  assert.equal(cfg.batchDir, path.join(f.root, 'archive-work/evidence/batch'));
  const item = { examId: f.manifest.examId, grade: '고1', semester: '1', examType: 'mid', parseStatus: 'parsed' };
  const mapped = buildManifestFromInventoryItem(item, cfg);
  assert.equal(mapped.outputFileName, `${item.examId}.js`);
  assert.equal(mapped.storageLayout, 'ARCHIVE_FOLDERS');
  assert.throws(() => buildManifestFromInventoryItem(item, cfg, 1), /DUPLICATE_EXAM_ID/);
});

test('batch source preparation uses the same folder layout and rejects duplicate exam IDs before processing', t => {
  const f = fixture(t);
  const script = fileURLToPath(new URL('../run-batch.mjs', import.meta.url));
  const selected = path.join(f.root, 'selected.json');
  fs.writeFileSync(selected, JSON.stringify({ jobs: [f.manifest] }));
  const args = [script, '--run-selected', '--selected-manifest', selected, '--source-only', '--prepare'];
  const result = JSON.parse(execFileSync(process.execPath, args, { cwd: f.root, encoding: 'utf8' }));
  assert.equal(result.results[0].status, 'SOURCE_PAGES_READY');
  assert.equal(result.results[0].jsWritten, false);
  assert.equal(result.results[0].layout.workRoot, 'archive-work');
  fs.writeFileSync(selected, JSON.stringify({ jobs: [f.manifest, f.manifest] }));
  assert.throws(() => execFileSync(process.execPath, args, { cwd: f.root, encoding: 'utf8', stdio: 'pipe' }), /DUPLICATE_EXAM_ID/);
});

test('actual extractor keeps first-pass tags in JS and solution CLI adjusts them with source-preserving evidence', async t => {
  const f = fixture(t);
  f.q.content = '다항식 $P(x)=x^2+2x+1$에서 $x$의 계수는?';
  f.q.initialMetadata = { confidence: 'high', reason: '다항식의 계수를 직접 묻는 발문이므로 다항식 연산의 기본 세부단원으로 1차 분류한다.', sourceExcerpts: ['다항식', '계수'], values: { standardUnitKey: 'H22-C-01', subUnitKey: 'H22-C-01-POLYNOMIAL_BASIC', difficultyBucket: 3, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL', level: '중', tags: ['기출', '계수'] } };
  fs.writeFileSync(f.vision, JSON.stringify({ pages: [{ pageNo: 1, questions: [f.q] }] }));
  const result = await runFolderExtraction(f.manifest, { root: f.root, dpi: 72 });
  const file = path.join(f.root, result.layout.examPath), evidence = path.join(f.root, result.layout.evidenceDir);
  const context = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), context);
  const q = JSON.parse(JSON.stringify(context.window.questionBank[0]));
  assert.equal(q.standardCourse, '공통수학1'); assert.equal(q.standardUnitKey, 'H22-C-01'); assert.equal(q.subUnitKey, 'H22-C-01-POLYNOMIAL_BASIC'); assert.equal(q.metadataStatus, 'SOURCE_FIRST_PASS');
  assert.equal(q.difficultyBucket, 3); assert.equal(q.sourceArchiveFile, f.manifest.archiveRelativePath);
  const protectedBefore = { content: q.content, choices: q.choices, image: q.image, sourceIdentityKey: q.sourceIdentityKey };
  q.answer = '2'; q.solution = '다항식 $P(x)$에서 $x$의 계수는 2이다.';
  fs.writeFileSync(file, `window.examTitle=${JSON.stringify(f.manifest.examId)};window.questionBank=${JSON.stringify([q])};`);
  assert.deepEqual(validateSourceMetadataReconciliation(file, [q]), ['SOURCE_METADATA_SOLUTION_RECHECK_REQUIRED']);
  const decision = makeSourceMetadataRecheckDraft([q]);
  Object.assign(decision.items[0], { values: { ...metadataProjection(q), difficultyBucket: 1, difficultyConfidence: 'high', level: '하' }, reason: '풀이에서 계수를 바로 읽으므로 처음 예상한 계산 부담보다 낮게 조정한다.', solutionExcerpts: ['계수는 2이다.'] });
  const decisionFile = path.join(f.root, 'solution-metadata.json'); fs.writeFileSync(decisionFile, JSON.stringify(decision));
  const script = fileURLToPath(new URL('../source-metadata.mjs', import.meta.url));
  const output = JSON.parse(execFileSync(process.execPath, [script, 'reconcile', '--working-exam', file, '--manifest', path.join(evidence, 'manifest.json'), '--decision', decisionFile], { encoding: 'utf8' }));
  assert.equal(output.adjustedCount, 1); assert.equal(output.productionAuthorized, false);
  const final = { window: {} }; vm.runInNewContext(fs.readFileSync(file, 'utf8'), final);
  const updated = JSON.parse(JSON.stringify(final.window.questionBank[0]));
  assert.equal(updated.difficultyBucket, 1); assert.equal(updated.metadataStatus, 'SOLUTION_RECONCILED');
  assert.deepEqual({ content: updated.content, choices: updated.choices, image: updated.image, sourceIdentityKey: updated.sourceIdentityKey }, protectedBefore);
  assert.deepEqual(validateSourceMetadataReconciliation(file, [updated]), []);
  const second = makeSourceMetadataRecheckDraft([updated]);
  Object.assign(second.items[0], { values: { ...metadataProjection(updated), difficultyBucket: 2 }, reason: '재검에서 이 문항의 계산 범위를 다시 판단해 2로 조정했다.', solutionExcerpts: ['계수는 2이다.'] });
  fs.writeFileSync(decisionFile, JSON.stringify(second));
  const baseArgs = [script, 'reconcile', '--working-exam', file, '--manifest', path.join(evidence, 'manifest.json'), '--decision', decisionFile];
  assert.throws(() => execFileSync(process.execPath, baseArgs, { encoding: 'utf8', stdio: 'pipe' }), /NEW_RECONCILIATION_REVISION_REQUIRED/);
  execFileSync(process.execPath, [...baseArgs, '--revision', '2'], { encoding: 'utf8' });
  const revision = JSON.parse(fs.readFileSync(path.join(evidence, 'reports/solution_metadata_reconciliation.json')));
  assert.equal(revision.revision, 2);
  assert.ok(revision.items[0].changes.some(row => row.field === 'difficultyBucket' && row.before === 1 && row.after === 2));
  assert.ok(fs.existsSync(path.join(evidence, 'reports/metadata-reconciliation/revision-001.json')));
  assert.ok(fs.existsSync(path.join(evidence, 'reports/metadata-reconciliation/revision-002.json')));
});
