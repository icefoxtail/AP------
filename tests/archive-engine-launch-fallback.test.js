const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'archive', 'index.html'), 'utf8');
const engineHtml = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');

assert(
  indexHtml.includes("const ARCHIVE_ENGINE_LAUNCH_STORAGE_KEY = 'APMATH_ARCHIVE_ENGINE_LAUNCH';") &&
    indexHtml.includes('function rememberArchiveEngineLaunch(url)') &&
    indexHtml.includes('rememberArchiveEngineLaunch(url);'),
  'archive index should preserve the complete engine launch before opening a new tab'
);

assert(
  engineHtml.includes("const ARCHIVE_ENGINE_LAUNCH_STORAGE_KEY = 'APMATH_ARCHIVE_ENGINE_LAUNCH';") &&
    engineHtml.includes('function readRecentArchiveEngineLaunch()') &&
    engineHtml.includes('if (!dataUrl && recentLaunch?.data)') &&
    engineHtml.includes('dataUrl = recentLaunch.data;'),
  'archive engine should recover a recently launched exam when the data query parameter is lost'
);

assert(
  engineHtml.includes("showArchiveDataLoadError('시험지 데이터가 전달되지 않았습니다. 아카이브에서 시험지를 다시 선택해 주세요.');"),
  'archive engine should show an actionable error instead of a blank page when no exam data is available'
);

console.log('archive engine launch fallback checks passed');
