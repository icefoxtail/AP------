import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const editor = fs.readFileSync('archive/internal-review-engine.js', 'utf8');
const transaction = fs.readFileSync('archive/review-save-transaction.js', 'utf8');
const liveHtml = fs.readFileSync('archive/internal-review-live.html', 'utf8');
const reviewHtml = fs.readFileSync('archive/internal-review-engine.html', 'utf8');

test('save checks loaded/current disk fingerprints and post-write revision verification', () => {
  assert.match(editor, /loadedFingerprint/);
  assert.match(editor, /postWriteVerifiedRevision/);
  assert.match(editor, /waitForRevision/);
  assert.match(transaction, /currentDiskFingerprint/);
  assert.match(transaction, /EXTERNAL_SOURCE_MODIFIED/);
  assert.match(transaction, /validateRoundTrip/);
});

test('legacy live entry redirects while preserving query string and hash', () => {
  assert.match(liveHtml, /location\.replace/);
  assert.match(liveHtml, /location\.search/);
  assert.match(liveHtml, /location\.hash/);
  assert.doesNotMatch(liveHtml, /internal-review-live\.js/);
});

test('canonical editor loads the writer, session store, and preview bridge dependencies', () => {
  assert.match(reviewHtml, /review-source-writer\.js/);
  assert.match(reviewHtml, /review-session-store\.js/);
  assert.match(reviewHtml, /review-save-transaction\.js/);
  assert.match(reviewHtml, /review-preview-bridge\.js/);
});
