const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const { catalog, core } = require('./helpers/archive2-scope-harness.cjs');
const problemBankMeta = require('../archive/problem-bank-meta.js');

function app() {
  const nodes = { content: { addEventListener() {} } };
  const listeners = {};
  const window = {
    Archive2Core: core,
    ProblemBankMeta: problemBankMeta,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    addEventListener() {},
  };
  const source = fs.readFileSync(require.resolve('../archive/archive2-workspace.js'), 'utf8');
  vm.runInNewContext(source.slice(0, source.lastIndexOf('  (async () => {')) +
    'window.testApp = { state, render }; })();', {
    window, crypto, console, setTimeout: () => 0, clearTimeout() {},
    document: {
      getElementById: id => nodes[id] ||= { addEventListener() {} },
      querySelector: () => null, querySelectorAll: () => [], body: { dataset: {} },
      addEventListener: (name, fn) => listeners[name] = fn,
    },
  });
  const { state, render } = window.testApp;
  Object.assign(state, { catalog: structuredClone(catalog), view: 'compose', filters: { grade: '고1' } });
  state.metaIndex = window.ProblemBankMeta.buildIndex(state.catalog.records, []);
  state.finderIndex = core.buildFinderIndex(state.catalog);
  return { state, render, nodes, listeners };
}

test('production-size compose curriculum and scope interactions stay responsive', async t => {
  const a = app();
  assert.ok(a.state.catalog.records.length >= 10000, 'performance requires the full production-size archive');
  for (const curriculumKey of ['', '2015', '2022']) {
    a.state.filters.curriculumKey = curriculumKey;
    const start = performance.now();
    a.render();
    const elapsed = performance.now() - start;
    t.diagnostic(`curriculum ${curriculumKey || 'all'}: ${elapsed.toFixed(1)}ms`);
    assert.match(a.nodes.content.innerHTML, /data-scope=/);
    assert.ok(elapsed < 500, `compose blocks input for ${elapsed.toFixed(1)}ms`);
  }
  const knownMeta = a.state.catalog.records.find(record => record.L1 && Number.isInteger(record.difficultyBucket));
  assert.ok(knownMeta, 'production catalog must contain a concrete L1 and difficulty projection');
  a.state.filters = { grade: knownMeta.sourceGrade, L1: knownMeta.L1 };
  a.state.buckets = [knownMeta.difficultyBucket];
  const metaStart = performance.now();
  a.render();
  const metaElapsed = performance.now() - metaStart;
  t.diagnostic(`shared Meta L1+difficulty render: ${metaElapsed.toFixed(1)}ms`);
  assert.ok(metaElapsed < 500, `shared Meta filter blocks input for ${metaElapsed.toFixed(1)}ms`);
  const directMetaResult = problemBankMeta.query(a.state.metaIndex, {
    rpmL1: knownMeta.L1, difficultyBuckets: [knownMeta.difficultyBucket],
  }, { profile: 'DIRECT' });
  assert.ok(directMetaResult.some(record => record.questionUid === knownMeta.questionUid));
  a.state.filters = { grade: '고1' };
  a.state.buckets = [];
  a.render();
  const scope = a.nodes.content.innerHTML.match(/data-scope="([^"]+)"/)[1];
  const start = performance.now();
  await a.listeners.change({ target: { dataset: { scope }, checked: true } });
  const elapsed = performance.now() - start;
  t.diagnostic(`scope checkbox: ${elapsed.toFixed(1)}ms`);
  assert.ok(a.state.scopes.includes(scope));
  assert.match(a.nodes.content.innerHTML, /data-scope="[^"]+" checked/);
  assert.ok(elapsed < 500, `scope selection blocks input for ${elapsed.toFixed(1)}ms`);

  // A new render must recheck quality, even if the filter did not change.
  for (const record of a.state.catalog.records) record.sourceStatus = 'HOLD';
  a.render();
  assert.doesNotMatch(a.nodes.content.innerHTML, /data-scope=/);
});

test('select all and count edits do not block the production-size composition form', async t => {
  const a = app();
  a.render();
  const selectionStart = performance.now();
  await a.listeners.click({ target: { closest: selector => selector === 'button' ? { dataset: { action: 'scope-all' } } : null } });
  const selectionElapsed = performance.now() - selectionStart;
  t.diagnostic(`select-all click: ${selectionElapsed.toFixed(1)}ms`);
  assert.ok(selectionElapsed < 450, `select-all blocks input for ${selectionElapsed.toFixed(1)}ms`);
  a.state.scopes = [...a.nodes.content.innerHTML.matchAll(/data-scope="([^"]+)"/g)].map(match => match[1]);
  for (const distribution of ['equal', 'all']) {
    a.state.distribution = distribution;
    a.state.count = 20;
    const start = performance.now();
    a.render();
    const elapsed = performance.now() - start;
    t.diagnostic(`${distribution} selection/count edit: ${elapsed.toFixed(1)}ms`);
    assert.ok(elapsed < 450, `form blocks input for ${elapsed.toFixed(1)}ms`);
    assert.match(a.nodes.content.innerHTML, /data-action="generate"/);
  }
});
