const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const navigation = require('../archive/archive2-navigation.js');
const read = name => fs.readFileSync(path.join(__dirname, '../archive', name), 'utf8');

test('unit papers are a primary task in both surfaces and keep legacy escape available', () => {
  for (const mode of ['workspace', 'unit']) {
    const html = navigation.markup(mode);
    assert.match(html, /href="unit-past-exams.html\?ready=1"/);
    assert.match(html, /href="index.html\?legacy=1">아카이브 1.0/);
    assert.equal((html.match(/>단원별 기출<\/a>/g) || []).length, 1);
  }
  assert.match(navigation.markup('workspace'), /data-view="compose"/);
  assert.match(navigation.markup('unit'), /href="unit-past-exams.html\?ready=1" class="active" aria-current="page"/);
  assert.match(navigation.markup('unit'), /href="workspace.html\?view=compose"/);
});

test('shared navigation mounts only on the ready shelf, leaving the legacy builder intact', () => {
  for (const ready of [false, true]) {
    let removed = false, attached = false;
    const host = { dataset: { archiveNavigation: 'unit' }, hidden: true, remove: () => removed = true };
    vm.runInNewContext(read('archive2-navigation.js'), {
      document: {querySelector: () => host, body: {classList: {add: () => attached = true}}},
      URLSearchParams, location: {search: ready ? '?ready=1' : ''},
    });
    assert.equal(removed, !ready);
    assert.equal(attached, ready);
    if (ready) assert.equal(host.hidden, false);
  }
});

test('native unit assignment embeds without changing assignment APIs and cannot close during a save', () => {
  const messages = [], classes = [];
  let closeCount = 0;
  const assignment = {progress: {a: {status:'pending'}}};
  const window = {Archive2Output:{},closeModal:() => closeCount++};
  vm.runInNewContext(read('archive2-entry.js'), {
    window, URLSearchParams, Map, AssignTarget:assignment,
    location:{search:'?unitPastAssign=existing-snapshot&archive2Embedded=1',origin:'https://archive.test'},
    parent:{postMessage:(message, origin) => messages.push({message, origin})},
    document:{documentElement:{classList:{add:value => classes.push(value)}},createElement:()=>({}),head:{appendChild(){}}},
    renderAssignTargetProgressView(){},
  });
  assert.ok(classes.includes('archive2-original-host'));
  window.closeModal(); assert.equal(closeCount,0);
  assignment.progress.a.status = 'success';
  window.closeModal(); assert.equal(closeCount,1);
  assert.equal(messages[0].message.type,'archive2-original-close');
  assert.equal(messages[0].origin,'https://archive.test');
});
