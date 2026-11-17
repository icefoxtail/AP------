'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');
const { qualificationSourceRevision } = require('./archive2-output-comparison-references.json');
const { fixtureSpecs } = require('./archive2-output-release-qualification.cjs');
const { loadQualificationFixtures } = require('./archive2-output-qualification-fixtures.cjs');
const { loadBank, serve } = require('./archive2-solution-loading-browser.cjs');

const root = path.resolve(__dirname, '..');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readBlob = file => execFileSync('git', ['show', qualificationSourceRevision + ':' + file], { cwd: root });

test('all eight qualification fixture payloads and five source files match their existing pins', () => {
  const { fixtures } = loadQualificationFixtures(root);
  assert.deepEqual(fixtures.map(fixture => ({ ...fixture, questions: fixture.questions.length })), fixtureSpecs);
  assert.equal(new Set(fixtures.flatMap(fixture => fixture.sources.map(source => source.file))).size, 5);
  for (const fixture of fixtures) assert.equal(hash(JSON.stringify(fixture.questions)), fixture.inputSha256, fixture.id);
});

test('missing or changed git source bytes are rejected before serving', () => {
  assert.throws(() => loadQualificationFixtures(root, { readBlob() { throw Error('missing blob'); } }),
    { code: 'QUALIFICATION_SOURCE_BLOB_MISSING' });
  assert.throws(() => loadQualificationFixtures(root, { readBlob: file => Buffer.concat([readBlob(file), Buffer.from('\n')]) }),
    { code: 'QUALIFICATION_SOURCE_HASH_MISMATCH' });
});

test('both comparison servers send the verified JS and leave live assets and default source loading in place', async t => {
  const { fixtures, sourceOverlay } = loadQualificationFixtures(root);
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-qualified-inputs-'));
  const current = path.join(folder, 'current');
  const baseline = path.join(folder, 'baseline');
  const original = fixtures.find(fixture => fixture.id === 'ordinary');
  const source = original.sources[0].file;
  const currentSource = 'window.questionBank = [];\n';
  function write(directory, file, text) {
    const target = path.join(directory, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
  }
  write(current, source, currentSource);
  const unrelated = 'archive/exams/test-fixtures/unrelated.js';
  write(current, unrelated, currentSource);
  write(current, 'archive/assets/images/fixture.svg', '<svg/>');
  write(current, 'archive/engine.html', 'current engine');
  write(baseline, 'archive/engine.html', 'baseline engine');
  const servers = [];
  t.after(async () => {
    for (const server of servers) await server.close();
    fs.rmSync(folder, { recursive: true, force: true });
  });
  for (const directory of [baseline, current]) servers.push(await serve(directory, current, sourceOverlay));
  const defaultServer = await serve(current);
  servers.push(defaultServer);
  const sourceUrl = '/' + source.split('/').map(encodeURIComponent).join('/');
  for (const [index, server] of servers.slice(0, 2).entries()) {
    const response = await fetch(server.origin + sourceUrl + '?v=1');
    assert.equal(response.status, 200);
    assert.equal(hash(Buffer.from(await response.arrayBuffer())), original.sources[0].sha256);
    assert.equal(await (await fetch(server.origin + '/' + unrelated)).text(), currentSource);
    assert.equal(await (await fetch(server.origin + '/archive/assets/images/fixture.svg')).text(), '<svg/>');
    assert.equal(await (await fetch(server.origin + '/archive/engine.html')).text(), (index ? 'current' : 'baseline') + ' engine');
  }
  assert.equal(await (await fetch(defaultServer.origin + sourceUrl)).text(), currentSource);
  assert.equal(loadBank(current, source).length, 0);
});

test('the reference comparison host receives the readable original-exam title through examDisplayTitle and changes nothing else', async t => {
  const vm = require('node:vm');
  const { readableExamTitle } = require('../archive/exam-display-title.js');
  const { fixtures, sourceOverlay } = loadQualificationFixtures(root);
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-reference-title-'));
  const server = await serve(folder, root, sourceOverlay, { referenceDisplayTitle: true });
  t.after(async () => { await server.close(); fs.rmSync(folder, { recursive: true, force: true }); });
  const seen = new Set();
  let readable = 0;
  for (const source of fixtures.flatMap(fixture => fixture.sources)) {
    if (seen.has(source.file)) continue;
    seen.add(source.file);
    const bytes = Buffer.from(await (await fetch(server.origin + '/' + source.file.split('/').map(encodeURIComponent).join('/'))).arrayBuffer());
    const verified = sourceOverlay('/' + source.file);
    assert.ok(bytes.subarray(0, verified.length).equals(Buffer.from(verified)), 'the verified exam bytes stay an exact prefix: ' + source.file);
    const sandbox = {}; sandbox.window = sandbox;
    vm.runInNewContext(bytes.toString('utf8'), sandbox);
    const title = sandbox.examTitle;
    if (typeof title === 'string' && title) { assert.equal(sandbox.examDisplayTitle, readableExamTitle(title), source.file); if (sandbox.examDisplayTitle !== title) readable += 1; }
  }
  assert.ok(seen.size > 0 && readable > 0, 'at least one pinned exam title is resolved to the readable form');
  // An exam that sets its own display title keeps it; other files are never touched.
  const exams = path.join(folder, 'archive/exams');
  fs.mkdirSync(exams, { recursive: true });
  fs.writeFileSync(path.join(exams, 'own.js'), 'window.examTitle = "22_강남여고_1학기_중간_고1_기출"; window.examDisplayTitle = "직접 지정한 제목";');
  fs.writeFileSync(path.join(exams, 'note.txt'), 'plain');
  const own = {}; own.window = own;
  const isolated = await serve(folder, folder, undefined, { referenceDisplayTitle: true });
  t.after(() => isolated.close());
  vm.runInNewContext(await (await fetch(isolated.origin + '/archive/exams/own.js')).text(), own);
  assert.equal(own.examDisplayTitle, '직접 지정한 제목');
  assert.equal(await (await fetch(isolated.origin + '/archive/exams/note.txt')).text(), 'plain');
  const plain = await serve(folder, folder);
  t.after(() => plain.close());
  assert.equal(await (await fetch(plain.origin + '/archive/exams/own.js')).text(), fs.readFileSync(path.join(exams, 'own.js'), 'utf8'));
});
