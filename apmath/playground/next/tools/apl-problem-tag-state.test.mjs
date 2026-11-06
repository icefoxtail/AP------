import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Execute the production shell methods with a minimal DOM. Layout and native
// browser coverage are provided by the G7/G8/G9 browser workflows.
const element = (tag = 'div', attrs = {}, ...children) => {
  let html = attrs.html || '';
  const e = { tag, attrs, children: [], style: { setProperty() {} }, classList: { toggle() {} }, addEventListener() {}, querySelector() { return null; }, append(...items) { this.children.push(...items.filter(Boolean)); } };
  Object.defineProperty(e, 'innerHTML', { get: () => html, set: value => { html = String(value); e.children = []; } });
  e.append(...children); return e;
};
const esc = s => String(s ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const APLab = { h: element, icon: name => `<svg data-icon="${name}"></svg>`, clamp: (v,a,b) => Math.max(a, Math.min(b,v)), stripEmoji: s => String(s ?? ''), esc, renderMath: s => s, setHTML: (e,h) => { if (e.innerHTML !== h) e.innerHTML = h; } };
const context = vm.createContext({ window: { APLab, matchMedia: () => ({ matches: false }) }, document: {} });
vm.runInContext(fs.readFileSync(process.env.APL_SHELL_SOURCE || new URL('../kit/apl-shell.js', import.meta.url), 'utf8'), context);
const tagged = e => e.attrs?.class === 'apl-tag' ? e : e.children?.map(tagged).find(Boolean);
function shell(problem, state = { target: 'PA' }) {
  const lab = Object.create(APLab.Lab.prototype);
  Object.assign(lab, { s: state, list: [{ problem }], index: 0, refs: { stepsSig: 'null' }, ui: { panes: { problem: element() } }, _ctls: {}, _rich: s => String(s ?? ''), _buildControls: () => false, _syncSolutionDisclosure() {}, _normNewProb() {}, _syncEndStep() {} });
  for (const key of ['guide','alert','readSec','partSec','summary','formulaSec','rule','notesSec']) lab.refs[key] = element();
  lab._buildProblem(); return lab;
}

test('a new generated target updates the existing badge and body together', () => {
  const lab = shell({ tag: s => '두 원 · ' + s.target, text: s => '구하는 선분 ' + s.target, noAnswer: true });
  const badge = tagged(lab.ui.panes.problem);
  lab._renderPanel({}); assert.match(badge.innerHTML, /두 원 · PA/);
  for (const target of ['PB', 'AB', 'PA']) {
    lab.s.target = target; lab._renderPanel({});
    assert.equal(tagged(lab.ui.panes.problem), badge, 'no problem-card rebuild is required');
    assert.match(badge.innerHTML, new RegExp('두 원 · ' + target));
    assert.equal(lab.refs.problemText.innerHTML, '구하는 선분 ' + target);
  }
});

test('static tags keep their icon and escaped text during later renders', () => {
  const lab = shell({ tag: '<조건> & 설명', text: '먼저 문제 풀기', noAnswer: true });
  lab._renderPanel({}); const before = tagged(lab.ui.panes.problem).innerHTML;
  lab.s.target = 'AB'; lab._renderPanel({});
  assert.equal(tagged(lab.ui.panes.problem).innerHTML, before);
  assert.match(before, /data-icon="flag"/); assert.match(before, /&lt;조건&gt; &amp; 설명/);
});

test('switching to a scene without a tag discards the old badge reference', () => {
  const lab = shell({ tag: s => s.target, text: '조건', noAnswer: true });
  const old = tagged(lab.ui.panes.problem); lab._renderPanel({}); const content = old.innerHTML;
  lab.list = [{ problem: { text: '다음 장면', noAnswer: true } }]; lab._buildProblem();
  lab.s.target = '새 목표'; lab._renderPanel({});
  assert.equal(tagged(lab.ui.panes.problem), undefined); assert.equal(old.innerHTML, content);
});
