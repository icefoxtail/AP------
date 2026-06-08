const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'eie/js/eie-app.js'), 'utf8');

async function runWithSession({ role, loginId, initialHash }) {
  const store = new Map([
    ['WANGJI_EIE_SESSION_TOKEN', 'token'],
    ['WANGJI_EIE_ROLE', role],
    ['WANGJI_EIE_LOGIN_ID', loginId],
    ['WANGJI_EIE_NAME', '사용자']
  ]);
  const context = {
    console,
    Date,
    Promise,
    Map,
    fetch: async () => ({ text: async () => '{}', ok: true }),
    window: {
      location: { hash: initialHash || '' },
      localStorage: {
        getItem(key) { return store.get(key) || ''; },
        setItem(key, value) { store.set(key, value); },
        removeItem(key) { store.delete(key); }
      },
      addEventListener(type, handler) {
        if (type === 'DOMContentLoaded') context.domReady = handler;
      },
      EieRouter: {
        opened: [],
        boot() { context.bootedHash = context.window.location.hash; return Promise.resolve(); },
        open(route) { this.opened.push(route); context.openedRoute = route; }
      }
    },
    document: {
      getElementById() { return null; },
      querySelector() { return null; }
    }
  };
  context.window.window = context.window;
  context.window.document = context.document;
  context.window.console = console;
  context.window.fetch = context.fetch;

  vm.createContext(context);
  vm.runInContext(source, context, { filename: 'eie-app.js' });
  await context.domReady();
  return context;
}

(async () => {
  let context = await runWithSession({ role: 'admin', loginId: 'admin', initialHash: '#teacher' });
  assert.strictEqual(context.window.location.hash, '#dashboard', 'owner login should recover from stale teacher hash to dashboard');
  assert.strictEqual(context.bootedHash, '#dashboard', 'router should boot the owner dashboard after hash recovery');

  context = await runWithSession({ role: 'admin', loginId: 'admin', initialHash: '#students' });
  assert.strictEqual(context.window.location.hash, '#dashboard', 'owner login should always enter the owner dashboard regardless of stale hash');

  context = await runWithSession({ role: 'teacher', loginId: 'carmen', initialHash: '#dashboard' });
  assert.strictEqual(context.window.location.hash, '#teacher', 'teacher login should still enter the teacher dashboard');
  context.window.eieGoHome();
  assert.strictEqual(context.openedRoute, 'teacher', 'teacher EIE home button should stay on the teacher dashboard');

  context = await runWithSession({ role: 'admin', loginId: 'admin', initialHash: '#dashboard' });
  context.window.eieGoHome();
  assert.strictEqual(context.openedRoute, 'dashboard', 'owner EIE home button should open the owner dashboard');

  console.log('EIE login initial route test passed');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
