const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const core = require('../archive/archive2-core.js');
const catalog = core.decodeCatalog(require('../archive/data/archive2-catalog.json'));

function workspace(filters = { grade: '중1' }) {
  const source = fs.readFileSync(path.join(__dirname, '../archive/archive2-workspace.js'), 'utf8');
  const listeners = {}, controls = {};
  const window = { Archive2Core: core };
  vm.runInNewContext(source.slice(0, source.indexOf('  document.addEventListener("submit"')) +
    '\nrender = () => {}; scheduleSave = () => {}; window.scopeTest = { state, scopeOptions, renderScopes, selectedScopePaths };\n})();', {
    window, crypto,
    document: { addEventListener: (name, fn) => listeners[name] = fn, getElementById: id => controls[id] },
  });
  Object.assign(window.scopeTest.state, { catalog, filters });
  return { ...window.scopeTest, controls, click: dataset => listeners.click({ target: { closest: () => ({ dataset }) } }) };
}

test('actual middle1 default shows the eight canonical L1 groups and nineteen L2 scopes', () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  const basic = scopes.filter(s => s.basicScope);
  assert.equal(new Set(basic.map(s => s.L1)).size, 8);
  assert.equal(basic.length, 19);
  const html = app.renderScopes();
  const [main, detail] = html.split('<details class="compose-detail source-scope-detail"');
  assert.ok(detail);
  assert.doesNotMatch(detail.slice(0, detail.indexOf('>')), /\bopen\b/);
  for (const label of ['다면체의 옆면의 모양', '원뿔, 원뿔대의 전개도의 성질', '구의 부피', '히스토그램의 직사각형의 넓이']) {
    assert.ok(!main.includes(label), label);
    assert.ok(detail.includes(label), label);
  }
  assert.ok(!main.includes('도형의 방정식'));
  const sourcePaths = new Set(catalog.records.filter(r => core.matches(r, { grade: '중1' }) && r.L1 && r.L2).map(r => core.pathKey(r, 4)));
  const visiblePaths = new Set(scopes.flatMap(s => s.paths));
  for (const sourcePath of sourcePaths) assert.ok(visiblePaths.has(sourcePath), sourcePath);
});

test('all and continuous range choose only canonical scopes while detailed scopes stay selectable', async () => {
  const app = workspace();
  const scopes = app.scopeOptions();
  await app.click({ action: 'scope-all' });
  assert.equal(app.state.scopes.length, 19);
  assert.ok(app.state.scopes.every(key => scopes.find(s => s.key === key).basicScope));
  app.controls['scope-start'] = { value: '0' };
  app.controls['scope-end'] = { value: String(scopes.length - 1) };
  await app.click({ action: 'scope-range' });
  assert.equal(app.state.scopes.length, 19);
  const target = scopes.find(s => s.L1 === '구의 부피');
  const groups = [...new Set(scopes.map(s => s.L1))];
  await app.click({ action: 'scope-clear' });
  await app.click({ action: 'scope-group', groupIndex: String(groups.indexOf(target.L1)), scopeKind: 'detail' });
  assert.ok(app.state.scopes.includes(target.key));
  assert.ok(app.renderScopes().includes('class="compose-detail source-scope-detail" open'));
  const req = { filters: { grade: '중1', primaryPaths: app.selectedScopePaths() }, rows: [{ id: 'detail', paths: target.paths, count: 1 }], seed: 'scope-display' };
  const selected = core.selectBlueprint(catalog.records, req);
  assert.equal(selected.ok, true);
  assert.equal(selected.selected[0].L1, '구의 부피');
  assert.notEqual(core.review(selected.selected, req).status, 'HARD_BLOCK');
});

test('every grade keeps default parent names inside its published taxonomy', () => {
  for (const grade of ['중1', '중2', '중3', '고1', '고2', '고3']) {
    const filters = { grade, ...(['고2', '고3'].includes(grade) ? { semanticSubject: 'ALGEBRA' } : {}) };
    const app = workspace(filters);
    const canonical = new Set(catalog.taxonomy.map(r => r.L1.replace(/\s+/g, '') + '|' + r.L2.replace(/\s+/g, '')));
    for (const scope of app.scopeOptions().filter(s => s.basicScope))
      assert.ok(canonical.has(scope.L1.replace(/\s+/g, '') + '|' + scope.L2.replace(/\s+/g, '')), `${grade} ${scope.L1} ${scope.L2}`);
  }
});
