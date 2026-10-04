const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const checkJs = fs.readFileSync(path.join(root, 'check/check.js'), 'utf8');
const mixedEngine = fs.readFileSync(path.join(root, 'archive/mixed_engine.html'), 'utf8');

assert(
  mixedEngine.includes("const archiveFile = AppState.key ? 'MIXED:' + AppState.key : ''") &&
    mixedEngine.includes("if (archiveFile) url.searchParams.set('archiveFile', archiveFile)"),
  'mixed assessment submit QR should carry the MIXED archive key into the target page'
);

assert(
  checkJs.includes('function buildArchiveReviewUrl') &&
    checkJs.includes("archiveFile.startsWith('MIXED:')") &&
    checkJs.includes("../archive/mixed_engine.html") &&
    checkJs.includes("../archive/engine.html"),
  'student check page should build archive answer/solution URLs for mixed and archive exams'
);

assert(
  checkJs.includes('function renderArchiveReviewActions') &&
    checkJs.includes('정답 보기') &&
    checkJs.includes('해설 보기') &&
    checkJs.includes("url.searchParams.set('solQr', '1')"),
  'student check page should render answer and solution buttons using solution QR mode'
);

console.log('assessment check solution link regression test passed');
