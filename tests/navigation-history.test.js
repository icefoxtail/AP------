const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(root, 'apmath', 'index.html'), 'utf8');
const uiSource = fs.readFileSync(path.join(root, 'apmath', 'js', 'ui.js'), 'utf8');

assert.match(indexHtml, /id="mobile-app-back-button"/, 'mobile header should include a stable back button');
assert.match(indexHtml, /id="desktop-app-back-button"/, 'desktop topbar should include a stable back button');
assert.match(indexHtml, /onclick="appHistoryBack\(\)"/, 'back buttons should call the shared history handler');
assert.match(indexHtml, /aria-label="뒤로가기"/, 'back buttons should expose an accessible label');

assert.match(uiSource, /function appHistoryBack\(/, 'shared back handler should exist');
assert.match(uiSource, /function appHistoryCanGoBack\(/, 'shared can-go-back query should exist');
assert.match(uiSource, /function appHistoryRecordView\(/, 'view transitions should be recordable');
assert.match(uiSource, /function appHistoryPatchGlobalNavigation\(/, 'global navigation wrappers should be installed');
assert.match(uiSource, /function updateAppBackButtons\(/, 'back button disabled state should be synced');
assert.match(uiSource, /AP_APP_HISTORY_WRAP_NAMES/, 'major screen renderers should be wrapped centrally');
assert.match(uiSource, /modalStepStack\.length/, 'existing modal step stack should be honored before app history');

const backHandler = uiSource.match(/function appHistoryBack\(\) \{[\s\S]*?\n\}/);
assert.ok(backHandler, 'back handler body should be findable');
assert.doesNotMatch(backHandler[0], /renderDashboard\(\)/, 'back handler must not fall back to dashboard');

console.log('Navigation history contract passed');
