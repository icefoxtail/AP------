const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'archive', 'engine.html'), 'utf8');
const META_SRC = 'question-meta.js?v=archive-metadata-v1-phase1b-20260826b';

// 2026-11-20: opening an original exam (시험지·해설·정답) downloaded and parsed the whole approved-metadata sidecar
// (data/question_metadata.json, 87.6MB raw / 15.3MB gzip) before the first question was drawn. Drawing never reads it:
// the sidecar only fills registration fields (standardUnitKey ...) that the 반 출제 등록 (submitQr=1 / osqr=1) posts.
// So engine.html asks for question-meta.js only when the URL is a registration URL (same rule as output-metadata-loader.js).
function gateSource() {
  const match = /<script id="engine-metadata-gate">([\s\S]*?)<\/script>/.exec(html);
  assert.ok(match, 'engine.html keeps the inline metadata gate');
  return match[1];
}

function runGate(search) {
  const written = [];
  const context = vm.createContext({
    URLSearchParams,
    location: { search },
    document: { write: (text) => written.push(text) },
    console: { warn() {} },
  });
  vm.runInContext(gateSource(), context);
  return written;
}

test('engine.html no longer loads the 87.6MB metadata sidecar through a static script tag', () => {
  assert.doesNotMatch(html.replace(/<script id="engine-metadata-gate">[\s\S]*?<\/script>/, ''), /<script[^>]*\ssrc="question-meta\.js/);
  assert.ok(html.includes(META_SRC), 'the gate loads the same versioned question-meta.js that mixer.html and unit-past-exams.html use');
});

test('opening an original exam (no registration signal) does not request the metadata sidecar', () => {
  for (const search of ['?data=exams/original/high/h1/1final/x.js&mode=exam', '?data=exams/x.js&mode=sol', '?data=exams/x.js&mode=ans&submitQr=0', '']) {
    assert.deepEqual(runGate(search), [], `${search} must not load question-meta.js`);
  }
});

test('registration URLs (submitQr=1 or osqr=1) still load the sidecar before the exam script runs', () => {
  for (const search of ['?data=exams/x.js&mode=exam&submitQr=1&class=c1', '?data=exams/x.js&mode=sol&osqr=1']) {
    const written = runGate(search);
    assert.equal(written.length, 1, search);
    assert.ok(written[0].includes(META_SRC) && /<script\s+src=/.test(written[0]), 'a parser-blocking script tag is written, as the static tag was');
  }
  // the exam script waits for the sidecar only when it was requested
  assert.match(html, /if \(window\.__ARCHIVE_METADATA_READY__\) await window\.__ARCHIVE_METADATA_READY__;/);
  assert.ok(html.indexOf('id="engine-metadata-gate"') > 0 && html.indexOf('id="engine-metadata-gate"') < html.indexOf('print-contract.js'), 'the gate sits where the static tag was');
});
