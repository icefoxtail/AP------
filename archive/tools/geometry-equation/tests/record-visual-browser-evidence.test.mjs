import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeArchiveImageUrlPath} from '../record-visual-browser-evidence.mjs';

test('Archive asset matching decodes Korean URL paths before comparing canonical paths',()=>{
  const path='/archive/assets/images/25_효천고_2학기_중간_고1_기출/q01-solution.svg';
  const encoded='http://127.0.0.1:52000'+encodeURI(path)+'?v=1';
  assert.equal(normalizeArchiveImageUrlPath(encoded),path);
  assert.equal(normalizeArchiveImageUrlPath('/bad%XX'),null);
});
