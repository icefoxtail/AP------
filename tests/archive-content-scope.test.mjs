import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { verifyRegistration } from '../archive/tools/verify-archive-registration.mjs';
import { loadSource, localAssetPath, questionAssetReferences, verifyContentScope } from '../archive/tools/verify-archive-content-scope.mjs';

const source = 'archive/exams/original/high/example.js';
const file = 'original/high/example.js';
const asset = 'archive/assets/images/example/solution.svg';
const fingerprint = question => createHash('sha256').update(JSON.stringify({ content: question.content ?? null,
  choices: Array.isArray(question.choices) ? question.choices : null, answer: question.answer ?? null,
  solution: question.solution ?? null, image: question.image ?? null })).digest('hex');
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-content-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (name, value) => { fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true }); fs.writeFileSync(path.join(root, name), value); };
  const json = (name, data) => write(name, JSON.stringify(data));
  const question = { id: 1, content: 'Technical fixture only.', solution: '<img src="assets/images/example/solution.svg">' };
  write(source, 'window.questions=' + JSON.stringify([question]) + ';');
  write(asset, '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>');
  write('archive/db.js', `window.mainDB={exams:[{file:${JSON.stringify(file)},qCount:1}]};`);
  const identity = { records: [{ questionUid: 'qid-fixture', sourceArchiveFile: file, sourceOrdinal: 1 }] };
  const metadata = { records: [{ questionUid: 'qid-fixture', sourceArchiveFile: file, sourceOrdinal: 1 }] };
  const catalog = { exams: [{ file }], health: { exams: 1, questions: 1 }, records: [{ sourceFile: file,
    sourceOrdinal: 1, questionUid: 'qid-fixture', identityStatus: 'VERIFIED', sourceFingerprint: fingerprint(question) }] };
  const save = () => {
    json('archive/data/question_identity_map.json', identity); json('archive/data/question_metadata.json', metadata);
    json('archive/data/archive2-catalog.json', catalog);
  };
  save();
  const scope = { mode: 'archive-content', sources: [source], assets: [asset], headSha: 'a'.repeat(40), baseSha: 'b'.repeat(40) };
  return { root, write, json, question, identity, metadata, catalog, scope, save, check: () => verifyContentScope({ root, scope }) };
}

test('new original source verifies UID/source/Consumer projection, local assets and XML without writing', t => {
  const f = fixture(t);
  const before = fs.readFileSync(path.join(f.root, 'archive/data/question_metadata.json'));
  const result = f.check();
  assert.equal(result.status, 'TECHNICAL_PASS'); assert.equal(result.registration.exams, 1);
  assert.equal(result.sources[0].questions, 1); assert.deepEqual(result.sources[0].modes, ['exam', 'sol']);
  assert.equal(result.assets.length, 1); assert.match(result.assets[0].sha256, /^[a-f0-9]{64}$/);
  assert.equal(result.browserStatus, 'NOT_RUN'); assert.equal(result.mathematicalReview, 'NOT_RUN');
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'archive/data/question_metadata.json')), before);
  assert.equal(verifyRegistration({ root: f.root }).scope, 'full-registration', 'default CLI contract remains global');
});

test('actual source/projection version mismatch fails without re-solving or rebinding approval', t => {
  const f = fixture(t); f.catalog.records[0].sourceFingerprint = 'old'; f.save();
  assert.throws(f.check, /source\/projection VERSION_MISMATCH/);
});

test('old metadata approval HOLD remains the existing policy, not a new final-review gate', t => {
  const f = fixture(t); Object.assign(f.catalog.records[0], { sourceStatus: 'HOLD', approvedSourceFingerprint: 'old approval' }); f.save();
  assert.equal(f.check().status, 'TECHNICAL_PASS');
});

test('missing image, malformed SVG, malformed JS and an absent question bank remain blocking technical defects', t => {
  const f = fixture(t); fs.unlinkSync(path.join(f.root, asset)); assert.throws(f.check, /required image missing/);
  f.write(asset, '<svg><path></svg>'); assert.throws(f.check, /SVG XML parse failed/);
  f.write(source, 'window.questions=[;'); assert.throws(() => loadSource(f.root, source));
  f.write(source, 'window.unrelated=[];'); assert.throws(() => loadSource(f.root, source), /no usable question array/);
});

test('duplicate UID, unresolved identity, missing metadata and wrong source ordinal remain blocking', t => {
  const f = fixture(t);
  f.identity.records.push({ ...f.identity.records[0], sourceArchiveFile: 'generated/unrelated.js' }); f.save();
  assert.throws(f.check, /duplicate\/missing UID/); f.identity.records.pop();
  f.catalog.records[0].identityStatus = 'UNRESOLVED'; f.save(); assert.throws(f.check, /identity unresolved/);
  f.catalog.records[0].identityStatus = 'VERIFIED'; f.metadata.records[0].sourceOrdinal = 2; f.save();
  assert.throws(f.check, /metadata\/source UID binding/);
  f.metadata.records = []; f.save(); assert.throws(f.check, /duplicate\/missing UID|metadata missing/);
});

test('selected registration preserves unrelated Generated/QID9 and approval records byte-for-byte', t => {
  const f = fixture(t);
  const extra = { questionUid: 'qid-generated', sourceArchiveFile: 'generated/QID9.js', sourceOrdinal: 1, receipt: 'immutable' };
  f.identity.records.push(extra); f.metadata.records.push(extra); f.save();
  f.write('archive/data/receipts/existing.json', '{"sealed":"unchanged"}');
  const before = fs.readFileSync(path.join(f.root, 'archive/data/question_metadata.json'));
  f.check();
  assert.deepEqual(fs.readFileSync(path.join(f.root, 'archive/data/question_metadata.json')), before);
  assert.equal(fs.readFileSync(path.join(f.root, 'archive/data/receipts/existing.json'), 'utf8'), '{"sealed":"unchanged"}');
});

test('reference extraction includes solution markup, structured image refs and query strings', () => {
  const refs = questionAssetReferences({ image: { src: 'assets/images/a.png' }, choices: ['<img src="assets/images/b.svg?version=2">'],
    solutionImage: ['assets/images/c.svg'], solution: '<svg><image href="assets/images/d.png"/></svg>' });
  assert.equal(refs.length, 4);
  assert.equal(localAssetPath('assets/images/b.svg?version=2'), 'archive/assets/images/b.svg');
  assert.equal(localAssetPath('https://example.invalid/a.png'), null);
  assert.throws(() => localAssetPath('assets/../secret.png'), /escapes/);
  assert.throws(() => localAssetPath('assets/%2e%2e/secret.png'), /escapes/);
});

test('nested SVG image references, duplicate IDs and missing fragments remain structural failures', t => {
  const f = fixture(t);
  f.write(asset, '<svg xmlns="http://www.w3.org/2000/svg"><image href="missing.png"/></svg>');
  assert.throws(f.check, /required image missing.*missing.png/);
  f.write(asset, '<svg xmlns="http://www.w3.org/2000/svg"><g id="same"/><g id="same"/></svg>');
  assert.throws(f.check, /duplicate SVG id/);
  f.write(asset, '<svg xmlns="http://www.w3.org/2000/svg"><use href="#missing"/></svg>');
  assert.throws(f.check, /missing SVG fragment/);
});
