const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');

function app() {
  let resolve;
  const deferred = new Promise(done => resolve = done);
  const doc = { body: {}, documentElement: { dataset: { apRenderError: 'blocked output' } }, querySelector: () => null, addEventListener() {} };
  const element = () => ({ attrs: {}, children: [], events: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    replaceChildren(...children) { this.children = children; },
    addEventListener(name, callback) { this.events[name] = callback; },
  });
  const host = element(), nodes = { 'preview-host': host };
  const window = { Archive2Core: {}, Archive2Output: {}, addEventListener() {}, deferred };
  const source = fs.readFileSync(require.resolve('../archive/archive2-workspace.js'), 'utf8');
  vm.runInNewContext(source.slice(0, source.lastIndexOf('  (async () => {')) +
    `prepare = () => window.deferred;
     outputUrl = async () => ({ href: 'engine.html', envelope: { ownerId: 'owner', outputRequestId: 'request' } });
     window.previewTest = { updatePreview }; })();`, {
    window, crypto, console, setTimeout: () => 0, clearTimeout() {},
    MutationObserver: class { observe() {} disconnect() {} },
    document: {
      getElementById: id => nodes[id] ||= element(), addEventListener() {},
      createElement(tag) { const node = element(); if (tag === 'iframe') { node.contentDocument = doc; node.contentWindow = {}; } return node; },
    },
  });
  return { update: window.previewTest.updatePreview, host, resolve };
}

test('preview acknowledges input before source preparation and clears loading on an engine error', async () => {
  const a = app();
  const pending = a.update();
  assert.equal(a.host.attrs['aria-busy'], 'true');
  assert.match(a.host.children[0].textContent, /준비/);
  a.resolve([{ meta: {}, questions: [] }]);
  await pending;
  const frame = a.host.children[0];
  frame.events.load();
  assert.equal(a.host.attrs['aria-busy'], 'false');
});
