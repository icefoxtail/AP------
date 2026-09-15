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
