import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function fixture() {
  let grid;
  const h = (tag, attrs = {}, ...children) => ({
    tag, attrs, children, append(...nodes) { this.children.push(...nodes); }
  });
  const APLab = {
    h, clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    esc: String, renderMath: String, stripEmoji: String,
    splitFlag: text => ({ text }),
    dialog: ({ body }) => { grid = body; return { close() {} }; }
  };
  const document = {
    documentElement: { dataset: {} }, getElementById() {},
    createElement() { return {}; }, head: { append() {} }, addEventListener() {}
  };
  const context = vm.createContext({
    window: { APLab, matchMedia: () => ({ matches: false }) },
    document, requestAnimationFrame() {}
  });
  vm.runInContext(fs.readFileSync(new URL('../kit/apl-shell.js', import.meta.url), 'utf8'), context);
  const lab = Object.create(APLab.Lab.prototype);
  Object.assign(lab, { def: {}, s: {}, params: {}, list: [], groups: [], index: 0, _sf: String });
  return { lab, context, cards: () => grid.children.filter(x => x.attrs?.class === 'apl-scene-card') };
}

test('overview cards use their own initialized question without changing the active question', () => {
  const { lab, cards } = fixture();
  lab.params = { x: { value: 2 } };
  lab.s = { x: 7, question: { kind: 'active', values: [3, 4] }, step: 2 };
  lab.list = [
    { title: 'First', enter: s => { s.question = { kind: 'first', values: [1, 2] }; },
      steps: s => { assert.equal(s.question.kind, 'first'); return s.question.values; } },
    { title: 'Last', enter: s => { s.question = { kind: 'last', sides: [3, 4, 5] }; },
      steps: s => s.question.sides.slice() }
  ];
  const before = JSON.stringify(lab.s);
  lab.openOverview();
  assert.equal(cards().length, 2);
  assert.equal(cards()[1].children[2].attrs.text, '3단계 풀이');
  assert.equal(JSON.stringify(lab.s), before);
});

test('the real circle lab renders every overview card from every active question family', () => {
  const { lab, context, cards } = fixture();
  for (const name of ['core', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 'solutions']) {
    const file = new URL(`../labs/g9-circle/${name}.js`, import.meta.url);
    vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file.pathname });
  }
  lab.groups = context.window.APL_CI_GROUPS;
  lab.params = Object.assign({}, ...lab.groups.map(g => g.params));
  lab.list = lab.groups.flatMap((g, gi) => g.scenes.map(sc => ({ ...sc, gi, group: g })));
  for (const sc of lab.list) {
    lab.s = Object.fromEntries(Object.entries(lab.params).map(([k, p]) => [k, p.value]));
    sc.enter(lab.s);
    const before = JSON.stringify(lab.s);
    lab.openOverview();
    assert.equal(cards().length, lab.list.length, sc.id);
    assert.equal(JSON.stringify(lab.s), before, `${sc.id}: overview changed the active question`);
  }
});
