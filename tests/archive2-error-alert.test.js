// Teacher-facing errors: status(message, true) must also raise a fixed, dismissible role="alert" box
// (a failure under the fold or behind a dialog is otherwise invisible), and error text never shows codes/English.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../archive/archive2-core.js');
const archiveSource = require('../archive/archive2-source.js');
const { readWorkspace, loadWorkspace } = require("./helpers/archive2-workspace-source.cjs");

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, 'archive', file), 'utf8');

class FakeElement {
  constructor(tag) {
    this.tagName = tag;
    this.children = [];
    this.parentNode = null;
    this.attrs = {};
    this.listeners = {};
    this.textContent = '';
    this.className = '';
    this.dataset = {};
    this.innerHTML = '';
  }
  get firstChild() { return this.children[0] || null; }
  appendChild(child) {
    if (child.parentNode) child.parentNode.removeChild(child);
    child.parentNode = this;
    this.children.push(child);
    return child;
  }
  append(...items) { items.forEach(item => this.appendChild(item)); }
  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index >= 0) { this.children.splice(index, 1); child.parentNode = null; }
    return child;
  }
  setAttribute(name, value) { this.attrs[name] = value; }
  addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
  click() { (this.listeners.click || []).forEach(fn => fn({ target: this })); }
}

function load({ detail = false } = {}) {
  const nodes = new Map();
  const body = new FakeElement('body');
  const documentListeners = {};
  let openDialog = null;
  const node = id => {
    if (!nodes.has(id)) {
      const el = new FakeElement('div');
      const classes = new Set();
      el.classList = {
        toggle: (name, force) => { if (force) classes.add(name); else classes.delete(name); },
        add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name),
      };
      el.close = () => {};
      el.showModal = () => {};
      nodes.set(id, el);
    }
    return nodes.get(id);
  };
  const document = {
    baseURI: 'https://archive.test/archive/workspace.html',
    body,
    getElementById: node,
    createElement: tag => new FakeElement(tag),
    querySelector: selector => (selector === 'dialog[open]' ? openDialog : null),
    querySelectorAll: () => [],
    addEventListener: (name, fn, capture) => { (documentListeners[name] ||= []).push({ fn, capture }); },
  };
  const warnings = [];
  const ctx = vm.createContext({
    console: { ...console, warn: (...args) => warnings.push(args.join(' ')) },
    URL, URLSearchParams, structuredClone,
    crypto: require('node:crypto'),
    location: new URL('https://archive.test/archive/workspace.html'),
    history: { pushState() {}, replaceState() {} },
    scrollY: 0, scrollTo() {},
    setTimeout: () => 0, clearTimeout() {}, matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem() {} },
    document,
    addEventListener() {},
    fetch: async () => ({ ok: true, json: async () => ({}) }),
    Archive2Core: core,
    ProblemBankMeta: require('../archive/problem-bank-meta.js'),
    Archive2Canonical: core.Canonical,
    Archive2Output: require('../archive/archive2-output.js'),
    Archive2Papers: require('../archive/archive2-papers.js'),
    Archive2History: require('../archive/archive2-history.js'),
    Archive2Source: archiveSource,
    ...(detail ? { Archive2ErrorDetail: require('../archive/archive2-error-detail.js') } : {}),
  });
  ctx.window = ctx;
  loadWorkspace(ctx, `
    globalThis.alertTest = { status };
  `);
  return {
    status: ctx.alertTest.status,
    body,
    statusLine: node('status'),
    warnings,
    setOpenDialog(dialog) { openDialog = dialog; },
    fireDocument(name, event) {
      (documentListeners[name] || []).filter(item => item.capture).forEach(item => item.fn(event));
    },
  };
}

const toastOf = host => host.children.find(child => child.className === 'error-toast');

test('an error status raises a role="alert" box that can be closed', () => {
  const h = load();
  h.status('저장하지 못했습니다. 다시 시도해 주세요.', true);
  const toast = toastOf(h.body);
  assert.ok(toast, 'the alert box is attached to the page');
  assert.equal(toast.attrs.role, 'alert');
  assert.equal(toast.firstChild.textContent, '저장하지 못했습니다. 다시 시도해 주세요.');
  assert.equal(h.statusLine.textContent, '저장하지 못했습니다. 다시 시도해 주세요.', 'the status line still shows it');
  const close = toast.children.find(child => child.className === 'error-toast-close');
  assert.ok(close, 'there is a close button');
  assert.ok(close.attrs['aria-label'], 'the close button has an accessible name');
  close.click();
  assert.equal(toastOf(h.body), undefined, 'closing removes the alert');
});

test('the alert stays until the next non-error status, and a new error replaces it', () => {
  const h = load();
  h.status('첫 번째 오류입니다.', true);
  h.status('두 번째 오류입니다.', true);
  assert.equal(h.body.children.filter(child => child.className === 'error-toast').length, 1, 'one alert at a time');
  assert.equal(toastOf(h.body).firstChild.textContent, '두 번째 오류입니다.');
  h.status('문항을 불러오는 중입니다.');
  assert.equal(toastOf(h.body), undefined, 'an ordinary status clears the alert');
  assert.equal(h.statusLine.textContent, '문항을 불러오는 중입니다.');
});

test('plain (non-error) statuses never create an alert', () => {
  const h = load();
  h.status('시험지를 저장했습니다.');
  assert.equal(toastOf(h.body), undefined);
});

test('codes and English never reach the teacher; the original is kept for diagnosis', () => {
  const h = load();
  h.status('CANONICAL_AUTHORITY_UNAVAILABLE: 단원·분류 기준을 불러오지 못했습니다.', true);
  assert.equal(toastOf(h.body).firstChild.textContent, '단원·분류 기준을 불러오지 못했습니다.');
  h.status('Failed to fetch', true);
  const text = toastOf(h.body).firstChild.textContent;
  assert.match(text, /다시 시도하고, 계속되면 관리자에게 알려 주세요/);
  assert.doesNotMatch(text, /Failed|fetch/);
  assert.ok(h.warnings.some(line => line.includes('Failed to fetch')), 'the original text is logged');
});

test('with a dialog open the alert lives inside it, and survives the dialog closing', () => {
  const h = load();
  const dialog = new FakeElement('dialog');
  h.setOpenDialog(dialog);
  h.status('출제하지 못했습니다. 다시 시도해 주세요.', true);
  const toast = toastOf(dialog);
  assert.ok(toast, 'a modal dialog makes the page behind it inert, so the alert is inside the dialog');
  assert.equal(toastOf(h.body), undefined);
  h.setOpenDialog(null);
  h.fireDocument('close', { target: dialog });
  assert.equal(toastOf(h.body), toast, 'the alert moves to the page when the dialog closes');
  assert.equal(toastOf(dialog), undefined);
});

test('the alert is styled to be seen: >=14px text, >=44px close target, above bars and dialogs', () => {
  const css = read('archive2.css');
  const box = /\.error-toast\s*\{([^}]*)\}/.exec(css);
  const button = /\.error-toast-close\s*\{([^}]*)\}/.exec(css);
  assert.ok(box && button, 'alert styles exist');
  assert.match(box[1], /position:\s*fixed/);
  assert.match(box[1], /top:\s*\d+px/, 'placed at the top so bottom bars and the phone menu stay visible');
  assert.doesNotMatch(box[1], /bottom:/);
  assert.ok(Number(/z-index:\s*(\d+)/.exec(box[1])?.[1]) >= 1000, 'above sticky bars');
  assert.ok(Number(/font-size:\s*(\d+)px/.exec(box[1])?.[1]) >= 14, 'text at least 14px');
  assert.ok(Number(/min-height:\s*(\d+)px/.exec(button[1])?.[1]) >= 44, 'close target at least 44px tall');
  assert.ok(Number(/min-width:\s*(\d+)px/.exec(button[1])?.[1]) >= 44, 'close target at least 44px wide');
});

test('teacherErrorMessage drops a leading CODE: but keeps the Korean reason behind it', () => {
  const source = readWorkspace();
  const start = source.indexOf('  const HANGUL = ');
  const end = source.indexOf('  // Errors also get a fixed, dismissible alert');
  assert.ok(start > 0 && end > start, 'teacherErrorMessage block found');
  const teacherErrorMessage = new Function(`${source.slice(start, end)}; return teacherErrorMessage;`)();
  assert.equal(teacherErrorMessage(new Error('AUTH_REQUIRED: 로그인이 필요합니다.')), '로그인이 필요합니다.');
  assert.equal(teacherErrorMessage('3번 문항의 정답이 비어 있습니다.'), '3번 문항의 정답이 비어 있습니다.');
  assert.equal(teacherErrorMessage(new Error('Failed to fetch'), '다시 시도해 주세요.'), '다시 시도해 주세요.');
  assert.equal(teacherErrorMessage(new Error('SERVER_ERROR: internal'), '다시 시도해 주세요.'), '다시 시도해 주세요.');
  assert.match(teacherErrorMessage(null), /다시 시도/);
});

// ---- 어느 시험지 몇 번 문항인지 (archive2-error-detail.js) ------------------------------------------------------
test('with the detail module: English text moves into a folded detail, the headline stays one Korean sentence', () => {
  const h = load({ detail: true });
  h.status('Failed to fetch', true, new Error('Failed to fetch'));
  const toast = toastOf(h.body);
  assert.match(toast.firstChild.textContent, /다시 시도하고, 계속되면 관리자에게 알려 주세요/);
  assert.doesNotMatch(toast.firstChild.textContent, /Failed|fetch/);
  const slot = toast.children[1];
  assert.match(slot.innerHTML, /data-ap-error-toggle[^>]*aria-expanded="false"/);
  const detailApi = require('../archive/archive2-error-detail.js');
  const entry = detailApi.lookup(/aria-controls="([^"]+)"/.exec(slot.innerHTML)[1]);
  assert.match(entry.detailText, /원문: Failed to fetch/, 'the original text is in the detail, not lost');
  assert.doesNotMatch(slot.innerHTML, /Failed to fetch/, 'and it is not in the page HTML until the teacher opens it');
  assert.match(entry.copyText, /화면: /);
});

test('with the detail module: a located error says which exam and question in the alert', () => {
  const h = load({ detail: true });
  const detailApi = require('../archive/archive2-error-detail.js');
  const error = detailApi.annotate(new Error('문항의 source fingerprint가 일치하지 않습니다.'),
    { file: 'original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js', questionNo: 23, code: 'QUESTION_NOT_FOUND' });
  h.status(error.message, true, error);
  const toast = toastOf(h.body);
  assert.match(toast.firstChild.textContent, /금당중/);
  assert.match(toast.firstChild.textContent, /23번 문항/);
  const located = detailApi.lookup(/aria-controls="([^"]+)"/.exec(toast.children[1].innerHTML)[1]);
  assert.match(located.detailText, /문항 번호: 23/);
  assert.equal(h.statusLine.textContent, toast.firstChild.textContent, 'the status line says the same one line');
});

test('a plain Korean message keeps a one-line alert: no detail block', () => {
  const h = load({ detail: true });
  h.status('저장 결과를 먼저 확인해 주세요.', true);
  assert.equal(toastOf(h.body).children[1].innerHTML, '');
});

test('a Korean sentence the caller wrote stays the headline when the caught error adds the location', () => {
  const h = load({ detail: true });
  const detailApi = require('../archive/archive2-error-detail.js');
  const error = detailApi.annotate(new Error('Network down'), { file: 'a/24_금당중_2학기_중간_중3_수학.js', questionNo: 4, code: 'SOURCE_FETCH_FAILED' });
  h.status('시험지를 준비하지 못했습니다.', true, error);
  assert.match(toastOf(h.body).firstChild.textContent, /^시험지를 준비하지 못했습니다. — .*4번 문항/);
});
