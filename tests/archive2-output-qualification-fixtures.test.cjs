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
