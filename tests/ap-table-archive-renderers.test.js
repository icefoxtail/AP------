'use strict';
// PR-5: the remaining ARCHIVE renderers use the AP Table Engine (generated-bank, problem-bank-search, mixer cards).
// apmath pages are out of scope (user decision 2026-11-09). Behavior of the DOM-building pages is covered in
// archive2-generated-bank-subjective-table.test.cjs (generated-bank) and by the Playwright proof (problem-bank-search).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const archive = path.join(__dirname, '..', 'archive');
const read = (name) => fs.readFileSync(path.join(archive, name), 'utf8');
const engineHtml = read('engine.html');
const queryOf = (html, re) => (html.match(re) || [])[1];
const scriptQuery = queryOf(engineHtml, /<script src="js\/ap-table-engine\.js(\?[^"]*)"/);
const cssQuery = queryOf(engineHtml, /<link rel="stylesheet" href="css\/ap-table\.css(\?[^"]*)"/);

const pages = {
  'generated-bank.html': { call: /function questionStem\(parent,value\)\{[\s\S]*?apNormalizeTables\(raw\)[\s\S]*?\n\}/, guard: /globalThis\.ApTableEngine\?[^;]*renderApTables\(raw\)/ },
  'problem-bank-search.html': { call: /function safeStem\(host,content\)\{[\s\S]*?apNormalizeTables\(raw\)[\s\S]*?\n\}/, guard: /globalThis\.ApTableEngine\?[^;]*renderApTables\(raw\)/ },
  'mixer.html': { call: /function createQuestionItem\(record\)[\s\S]*?mixerExamHtml\(mixerApTables\(q\.content \|\| ''\)\)/, guard: /function mixerApTables\(html\)[\s\S]*?globalThis\.ApTableEngine\)[^;]*renderApTables\(html\)/ },
};

test('engine.html cache-bust queries are readable (reference for the pages below)', () => {
  assert.ok(scriptQuery && cssQuery);
});

for (const [name, spec] of Object.entries(pages)) {
  test(`${name} loads ap-table-engine.js and ap-table.css with the engine.html cache-bust query`, () => {
    const html = read(name);
    assert.ok(html.includes(`<script src="js/ap-table-engine.js${scriptQuery}"></script>`), 'engine script tag');
    assert.ok(html.includes(`<link rel="stylesheet" href="css/ap-table.css${cssQuery}">`), 'ap-table.css link');
    // a synchronous tag earlier in the file than the code that calls it
    const callAt = html.search(spec.call);
    assert.ok(callAt > 0 && html.indexOf('js/ap-table-engine.js') < callAt, 'engine tag precedes the call site');
    assert.ok(fs.existsSync(path.join(archive, 'js', 'ap-table-engine.js')) && fs.existsSync(path.join(archive, 'css', 'ap-table.css')));
  });

  test(`${name} runs renderApTables in the question content path, guarded by globalThis.ApTableEngine`, () => {
    const html = read(name);
    assert.match(html, spec.call, 'content path calls the engine before insertion');
    assert.match(html, spec.guard, 'missing module leaves the content unchanged');
  });
}

test('mixer cards normalize tables before MathJax typesets the list', () => {
  const html = read('mixer.html');
  const render = html.indexOf('displayRecords.forEach(record => container.appendChild(createQuestionItem(record)))');
  const typeset = html.indexOf('MathJax.typesetPromise([container])', render);
  assert.ok(render > 0 && typeset > render);
});

test('the DOM-building pages never assign table markup through innerHTML', () => {
  for (const name of ['generated-bank.html', 'problem-bank-search.html']) {
    const html = read(name);
    const helper = html.slice(html.indexOf('const AP_TABLE_WRAP'), html.indexOf('const AP_TABLE_WRAP') + 6000);
    assert.ok(helper.includes('function apTableNode'), name);
    const body = helper.slice(0, helper.indexOf('function apNormalizeTables'));
    assert.ok(!/innerHTML|insertAdjacentHTML|outerHTML/.test(body), name + ' builds tables from the allow-list only');
  }
});
