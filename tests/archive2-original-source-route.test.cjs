const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const output = require('../archive/archive2-output.js');

function workspace() {
  const popups = [];
  const nodes = {};
  const window = {
    Archive2Core: core, Archive2Output: output,
    Archive2Source: { load: async () => { throw new Error('Output storage quota exceeded'); } },
    addEventListener() {},
    open(url) {
      const popup = { url, location: {}, closed: false, close() { this.closed = true; } };
      popups.push(popup);
      return popup;
    },
  };
  const source = fs.readFileSync(require.resolve('../archive/archive2-workspace.js'), 'utf8');
  vm.runInNewContext(source.slice(0, source.lastIndexOf('  (async () => {')) +
    'window.testApp = { openFinderOutput, state }; })();', {
    window, crypto, console, URL, URLSearchParams,
    location: new URL('https://archive.test/archive/workspace.html?view=find'),
    localStorage: { getItem: () => null }, setTimeout: () => 0, clearTimeout() {},
    document: { getElementById: id => nodes[id] ||= { addEventListener() {} }, addEventListener() {} },
  });
  window.testApp.state.catalog = { records: [], sourceHashes: [] };
  return { ...window.testApp, popups };
}

test('original Finder exam, solution and answer open the Archive 1 source URL synchronously without storing a snapshot', async () => {
  const app = workspace();
  const exam = { file: 'original/high/h2/1final/26_test.js', grade: '고2', school: '금당고', year: 2026, semester: 1, examType: 'final', subject: '대수', qCount: 21 };
  for (const mode of ['exam', 'sol', 'ans']) {
    const pending = app.openFinderOutput(exam, mode);
    const popup = app.popups.at(-1);
    const url = new URL(popup.url);
    assert.equal(url.pathname, '/archive/engine.html');
    assert.equal(url.searchParams.get('data'), 'exams/' + exam.file);
    assert.equal(url.searchParams.get('mode'), mode);
    assert.equal(url.searchParams.has('outputRequestId'), false);
    assert.equal(url.searchParams.has('archive2Context'), false);
    assert.equal(url.searchParams.get('submitQr'), '0');
    await pending;
    assert.equal(popup.closed, false);
  }
});
