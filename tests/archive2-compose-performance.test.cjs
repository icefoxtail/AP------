const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { performance } = require('node:perf_hooks');
const { catalog, core } = require('./helpers/archive2-scope-harness.cjs');

function app() {
  const nodes = { content: { addEventListener() {} } };
  const listeners = {};
  const window = {
    Archive2Core: core,
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
  state.finderIndex = core.buildFinderIndex(state.catalog);
  return { state, render, nodes, listeners };
}

test('production-size compose curriculum and scope interactions stay responsive', async t => {
  const a = app();
  for (const curriculumKey of ['', '2015', '2022']) {
    a.state.filters.curriculumKey = curriculumKey;
    const start = performance.now();
    a.render();
    const elapsed = performance.now() - start;
    t.diagnostic(`curriculum ${curriculumKey || 'all'}: ${elapsed.toFixed(1)}ms`);
    assert.match(a.nodes.content.innerHTML, /data-scope=/);
    assert.ok(elapsed < 1500, `compose blocks input for ${elapsed.toFixed(1)}ms`);
  }
  const scope = a.nodes.content.innerHTML.match(/data-scope="([^"]+)"/)[1];
  const start = performance.now();
  await a.listeners.change({ target: { dataset: { scope }, checked: true } });
  const elapsed = performance.now() - start;
  t.diagnostic(`scope checkbox: ${elapsed.toFixed(1)}ms`);
  assert.ok(a.state.scopes.includes(scope));
  assert.match(a.nodes.content.innerHTML, /data-scope="[^"]+" checked/);
  assert.ok(elapsed < 1500, `scope selection blocks input for ${elapsed.toFixed(1)}ms`);

  // A new render must recheck quality, even if the filter did not change.
  for (const record of a.state.catalog.records) record.sourceStatus = 'HOLD';
  a.render();
  assert.doesNotMatch(a.nodes.content.innerHTML, /data-scope=/);
});
