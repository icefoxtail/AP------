import test from 'node:test';
import assert from 'node:assert/strict';
import {archiveAssetSha256,normalizeArchiveImageUrlPath} from '../record-visual-browser-evidence.mjs';

test('Archive asset matching decodes Korean URL paths before comparing canonical paths',()=>{
  const path='/archive/assets/images/25_효천고_2학기_중간_고1_기출/q01-solution.svg';
  const encoded='http://127.0.0.1:52000'+encodeURI(path)+'?v=1';
  assert.equal(normalizeArchiveImageUrlPath(encoded),path);
  assert.equal(normalizeArchiveImageUrlPath('/bad%XX'),null);
});

test('Archive matrix asset SHA stays as exact bare 64-hex through actual layout capture binding',()=>{
  const exact='8e2d318dcdd5e791c153cd638b57862b349061115c90a189ae3541637e6f9ca7';
  assert.equal(archiveAssetSha256(exact),exact);
  assert.throws(()=>archiveAssetSha256(exact.slice(7)),/ARCHIVE_ASSET_SHA256_INVALID/);
  assert.throws(()=>archiveAssetSha256('sha256:'+exact),/ARCHIVE_ASSET_SHA256_INVALID/);
});
