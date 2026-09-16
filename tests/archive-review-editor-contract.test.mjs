import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync('archive/internal-review-engine.js', 'utf8');

test('normal edits use a persistent review bridge instead of serializing a Blob URL', () => {
  assert.match(source, /createReviewPreviewBridge/);
  assert.match(source, /reviewBridge/);
  assert.match(source, /prewarm.*0/);
  assert.doesNotMatch(source, /state\.liveDataUrl/);
  assert.doesNotMatch(source, /URL\.createObjectURL\(liveBlob\)/);
});

test('IME composition keeps draft state current but queues preview at compositionend', () => {
  assert.match(source, /compositionstart/);
  assert.match(source, /compositionupdate/);
  assert.match(source, /compositionend/);
  assert.match(source, /isComposing/);
  assert.match(source, /requestedPreviewRevision/);
});

test('asset invalidation is independent from text revision', () => {
  assert.match(source, /assetRevision/);
  assert.match(source, /lastModified/);
  assert.doesNotMatch(source, /q\.image\s*=.*\?revision/);
});

test('editor selection is sourceRef based rather than display-number indexing', () => {
  assert.match(source, /data-source-ref/);
  assert.match(source, /sourceRef/);
  assert.doesNotMatch(source, /state\.currentBank\[displayNo - 1\]/);
});

test('editor actions use sourceRef as the selection authority even when id is null', () => {
  assert.match(source, /function commitEditorDraft\(\) \{\s+const q = getCurrentEditorQuestion\(\);/);
  assert.doesNotMatch(source, /function commitEditorDraft\(\) \{\s+if \(state\.selectedId === null\)/);
  assert.match(source, /function modifiedQuestionKey\(q\)/);
  assert.match(source, /state\.modifiedIds\.add\(sourceRef\)/);
  assert.match(source, /state\.questionSourceRefs\.set\(restoredItem, restoredRef\)/);
});

test('file selection does not replace the current handle until the new file is readable', () => {
  assert.match(source, /async function loadFileHandle\(handle, filePath = ''\)/);
  assert.match(source, /await loadFileHandle\(entry\.handle, entry\.path\)/);
  assert.doesNotMatch(source, /state\.currentFileHandle = entry\.handle;\s+state\.currentFilePath\s+= entry\.path;\s+await loadFileHandle/);
});

test('editor metadata interpolation is escaped before entering review markup', () => {
  assert.match(source, /function escapeReviewHtml\(value\)/);
  assert.match(source, /escapeReviewHtml\(q\.questionType\)/);
  assert.match(source, /escapeReviewHtml\(stripHtml\(q\.content/);
});
