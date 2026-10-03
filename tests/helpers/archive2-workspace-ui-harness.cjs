const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '../..');
const read = name => fs.readFileSync(path.join(root, 'archive', name), 'utf8');

function workspaceHarness(fetcher = async () => { throw new Error('unexpected network'); }) {
  const events = new Map(), nodes = new Map(), timers = new Map(), storage = new Map();
  let nextTimer = 1;
  let queryInput = {
    dataset: { recentFilter: 'query' }, value: '', selectionStart: 0, selectionEnd: 0,
    isConnected: true,
  };
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      id, innerHTML: '', textContent: '', dataset: {}, open: false,
      setAttribute(key, value) { this[key] = value; },
      addEventListener() {},
      classList: { toggle() {}, add() {}, remove() {} },
      showModal() { this.open = true; }, close() { this.open = false; },
      querySelectorAll() { return []; },
    });
    return nodes.get(id);
  };
  const context = {
    console, URL, URLSearchParams, Date, crypto, structuredClone,
    setTimeout(callback, delay) { const id = nextTimer++; timers.set(id, { callback, delay }); return id; },
    clearTimeout(id) { timers.delete(id); }, matchMedia: () => ({ matches: false }),
    atob: value => Buffer.from(value, 'base64').toString('binary'),
    btoa: value => Buffer.from(value, 'binary').toString('base64'),
    location: new URL('https://test.invalid/archive/workspace.html?view=recent'),
    history: { state: null, pushState(state) { this.state = state; }, replaceState(state) { this.state = state; } },
    scrollY: 0,
    scrollTo() {},
    localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
    document: {
      activeElement: null,
      getElementById: node,
      querySelectorAll: () => [],
      querySelector(selector) {
        if (selector === '[data-recent-filter="query"]') return queryInput;
        if (selector === '[data-recent-filter="subject"]') return node('recent-subject');
        return null;
      },
      createElement: () => ({ content: { firstElementChild: { querySelector: () => ({}) } } }),
      body: { dataset: {} },
      addEventListener(name, callback) {
        if (!events.has(name)) events.set(name, []);
        events.get(name).push(callback);
      },
    },
    fetch: fetcher,
  };
  context.window = context;
  context.addEventListener = () => {};
  context.Archive2Output = { matchesMaterial: (exam, material) => !material || exam.material === material };
  context.Archive2Source = {};
  context.Archive2Papers = {
    receipt: () => null, partIndex: index => Math.floor(index / 50), lockedUids: () => new Set(),
    status: (_count, receipts) => ({ complete: receipts.length > 0 }),
  };
  context.__onWholeRender = () => {
    queryInput.isConnected = false;
    context.document.activeElement = null;
  };
  const ctx = vm.createContext(context);
  vm.runInContext(read('archive2-canonical.js'), ctx);
  vm.runInContext(read('archive2-core.js'), ctx);
  vm.runInContext(read('archive2-history.js'), ctx);
  const source = read('archive2-workspace.js');
  const startup = source.lastIndexOf('  (async () => {');
  if (startup <= 0) throw new Error('workspace network bootstrap was not found');
  vm.runInContext(source.slice(0, startup) + `
    render = () => { globalThis.workspaceRenderCount++; globalThis.__onWholeRender(); };
    globalThis.workspaceRenderCount = 0;
    globalThis.workspaceTest = {
      state, recentClassOptions, recentSubjectOptions, updateRecentResults, loadRecent,
      assignmentStatus, getRenderCount: () => globalThis.workspaceRenderCount,
      setClasses: rows => { classRows = rows; },
    };
  })();`, ctx);
  const workspace = ctx.workspaceTest;
  workspace.state.catalog = { taxonomy: [], records: [], exams: [], indexVersion: 'ui-test' };
  workspace.state.finderIndex = ctx.Archive2Core.buildFinderIndex(workspace.state.catalog);
  storage.set('APMATH_SESSION', JSON.stringify({ login_id: 'ui-test', session_token: 'ui-test' }));
  return {
    ctx, workspace, node,
    queryInput: () => queryInput,
    async event(type, target, extra = {}) {
      for (const callback of events.get(type) || []) await callback({ target, ...extra });
    },
    fireTimers() {
      const pending = [...timers.values()]; timers.clear();
      return pending.map(timer => timer.callback());
    },
    timerDelays: () => [...timers.values()].map(timer => timer.delay),
  };
}

const okJson = value => ({ ok: true, json: async () => value });

module.exports = { workspaceHarness, okJson };
