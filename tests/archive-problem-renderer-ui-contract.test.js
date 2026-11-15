'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const checker = require('../tools/check-reviewed-problem-renderer-browser.cjs');
const sourceManifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/archive-reviewed-problem-renderer-ui3.json'), 'utf8'));
const copy = value => JSON.parse(JSON.stringify(value));
const head = 'a'.repeat(40);
const scope = changedFiles => ({ schemaVersion: 'archive-ci-scope-v2', eventName: 'pull_request', headSha: head, changedFiles });
const studentCss = [400, 700, 800].map(weight => `@font-face { font-family: 'Nanum Myeongjo'; font-style: normal; font-weight: ${weight}; src: url(https://fonts.gstatic.com/s/nanummyeongjo/v1/reviewed_${weight}.woff2) format('woff2'); }`).join('\n');

test('only the exact student stylesheet query is allowed', () => {
  assert.equal(checker.isStudentFontStylesheet('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap'), true);
  assert.equal(checker.isStudentFontStylesheet('https://fonts.googleapis.com/css2?display=swap&family=Nanum%20Myeongjo%3Awght%40400%3B700%3B800'), true);
});
for (const value of [
  'http://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com.evil.test/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Other:wght@400;700;800&display=swap',
  'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap&extra=1'
]) test(`font stylesheet refuses non-exact URL ${value.split('?')[0]}`, () => assert.equal(checker.isStudentFontStylesheet(value), false));

test('font files are restricted to the returned stylesheet declarations and all three weights', () => {
  assert.deepEqual([...checker.declaredStudentFonts(studentCss)], [400, 700, 800].map(weight => `https://fonts.gstatic.com/s/nanummyeongjo/v1/reviewed_${weight}.woff2`));
});
for (const [name, css] of [
  ['nested stylesheet', `@import 'https://example.test/font.css';\n${studentCss}`],
  ['another family directory', studentCss.replace('/s/nanummyeongjo/', '/s/other/')],
  ['another origin', studentCss.replace('fonts.gstatic.com', 'example.test')],
  ['missing required weight', studentCss.replace('font-weight: 800;', 'font-weight: 900;')],
  ['malformed escaped URL', studentCss.replace('https://fonts.gstatic.com', 'https://fonts.gstatic.com\\escape')]
]) test(`font CSS refuses ${name}`, () => assert.throws(() => checker.declaredStudentFonts(css)));

function fixture() {
  const manifest = copy(sourceManifest), files = new Map(), banks = new Map(), identities = [];
  for (const item of manifest.items) {
    if (!banks.has(item.sourcePath)) banks.set(item.sourcePath, []);
    const questions = banks.get(item.sourcePath);
    while (questions.length < item.sourceOrdinal) questions.push({ id: questions.length + 1, content: 'unselected' });
    const question = { id: item.sourceOrdinal, content: `Synthetic problem ${item.key}`, choices: ['Synthetic choice'],
      image: item.assetPath.slice('archive/'.length), imageAlt: 'Synthetic geometry', imageSize: 'full', layoutTag: 'fullwidth',
      answer: 'DO_NOT_EXPORT_ANSWER', solution: 'DO_NOT_EXPORT_SOLUTION' };
    questions[item.sourceOrdinal - 1] = question;
    item.problemPayloadSha256 = checker.sha256(checker.stable({ content: question.content, choices: question.choices }));
    item.presentationSha256 = checker.sha256(checker.stable({ imageAlt: question.imageAlt, imageSize: question.imageSize, layoutTag: question.layoutTag }));
    if (item.key === 'E006-Q3') {
      // Keep the pinned real v3 asset as a fixture; it contains only the problem
      // drawing. The other synthetic assets exercise byte binding independently.
      const svg = fs.readFileSync(path.join(__dirname, '..', item.assetPath));
      files.set(item.assetPath, svg);
    } else {
      const svg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg"><title>${item.key}</title></svg>`);
      files.set(item.assetPath, svg); item.assetSha256 = checker.sha256(svg);
    }
    identities.push({ sourceArchiveFile: item.sourcePath.slice('archive/exams/'.length), sourceOrdinal: item.sourceOrdinal, questionUid: item.questionUid });
  }
  const syncBanks = () => { for (const [file, questions] of banks) files.set(file, Buffer.from(`window.questionBank = ${JSON.stringify(questions)};`)); };
  const syncIdentity = () => files.set(checker.IDENTITY_PATH, Buffer.from(JSON.stringify({ records: identities })));
  syncBanks(); syncIdentity();
  const reader = { commit: head, read(file) { assert(files.has(file), 'UI_TRACKED_FILE_REQUIRED'); return files.get(file); },
    ref(file, bytes = this.read(file)) { return { commit: head, path: file, gitBlobSha1: checker.gitBlob(bytes), sha256: checker.sha256(bytes), bytes: bytes.length }; } };
  return { manifest, files, banks, identities, syncBanks, syncIdentity, reader };
}

test('UI3 manifest fixes three problems, both viewports and the reviewed v3 bytes', () => {
  assert.equal(checker.validateManifest(copy(sourceManifest)).expectedCases, 6);
});

for (const [name, mutate] of [
  ['missing one item', x => x.items.pop()],
  ['duplicate UID', x => { x.items[1].questionUid = x.items[0].questionUid; }],
  ['path traversal', x => { x.items[0].sourcePath = 'archive/exams/../secrets.js'; }],
  ['unknown raw body field', x => { x.items[0].content = 'not permitted'; }],
  ['missing mobile case', x => x.viewports.pop()],
  ['old v2 target', x => { x.items.find(row => row.key === 'E006-Q3').assetPath = 'archive/assets/images/q3-problem-visual-v2.svg'; }],
  ['different v3 bytes', x => { x.items.find(row => row.key === 'E006-Q3').assetSha256 = 'b'.repeat(64); }]
]) test(`UI3 manifest refuses ${name}`, () => { const x = copy(sourceManifest); mutate(x); assert.throws(() => checker.validateManifest(x)); });

test('every exact source, asset and checker trigger requires six cases', () => {
  const plan = checker.planRequired(sourceManifest, scope([]), head);
  assert.equal(plan.required, false);
  for (const file of plan.triggerPaths) assert.equal(checker.planRequired(sourceManifest, scope([file]), head).required, true, file);
  assert.equal(checker.planRequired(sourceManifest, scope(['archive/exams/unrelated.js']), head).required, false);
});

test('unknown diff and explicit dispatch require the browser and stale HEAD is rejected', () => {
  assert.equal(checker.planRequired(sourceManifest, scope(null), head).required, true);
  assert.equal(checker.planRequired(sourceManifest, { ...scope([]), eventName: 'workflow_dispatch' }, head).required, true);
  assert.throws(() => checker.planRequired(sourceManifest, scope([]), 'b'.repeat(40)), /UI_SCOPE_HEAD/);
  assert.throws(() => checker.planRequired(sourceManifest, scope(undefined), head), /UI_CHANGED_FILES/);
});

test('source preflight yields only exact Git/hash bindings and never answer or solution values', () => {
  const f = fixture(), result = checker.preflight(f.reader, f.manifest);
  assert.equal(result.items.length, 3);
  assert(!JSON.stringify(result).includes('DO_NOT_EXPORT'));
  assert(!JSON.stringify(result).includes('Synthetic problem'));
  assert(result.items.every(row => row.sourceRef.commit === head && row.assetRef.commit === head));
});

for (const [name, mutate, error] of [
  ['missing repaired SVG', f => f.files.delete(f.manifest.items.find(row => row.key === 'E006-Q3').assetPath), /UI_TRACKED_FILE_REQUIRED/],
  ['stale v2 pointer', f => { const x = f.manifest.items.find(row => row.key === 'E006-Q3'); f.banks.get(x.sourcePath)[2].image = x.assetPath.slice('archive/'.length).replace('-v3.svg', '-v2.svg'); f.syncBanks(); }, /UI_IMAGE_POINTER_MISMATCH/],
  ['changed problem text', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].content += ' changed'; f.syncBanks(); }, /UI_PROBLEM_PAYLOAD_DRIFT/],
  ['changed choice', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].choices.push('changed'); f.syncBanks(); }, /UI_PROBLEM_PAYLOAD_DRIFT/],
  ['changed presentation', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].imageSize = 'small'; f.syncBanks(); }, /UI_PRESENTATION_DRIFT/],
  ['same path asset mutation', f => { const p = f.manifest.items[0].assetPath; f.files.set(p, Buffer.concat([f.files.get(p), Buffer.from('changed')])); }, /UI_REVIEWED_ASSET_DRIFT/],
  ['wrong UID', f => { f.identities[0].questionUid = 'qid_v1_' + 'f'.repeat(64); f.syncIdentity(); }, /UI_IDENTITY_UID_MISMATCH/],
  ['duplicate identity', f => { f.identities.push(copy(f.identities[0])); f.syncIdentity(); }, /UI_UNIQUE_IDENTITY_RECORD/],
  ['wrong source ordinal', f => { const x = f.manifest.items[0]; f.banks.get(x.sourcePath)[x.sourceOrdinal - 1].id++; f.syncBanks(); }, /UI_QUESTION_ORDINAL_MISMATCH/]
]) test(`preflight rejects ${name}`, () => { const f = fixture(); mutate(f); assert.throws(() => checker.preflight(f.reader, f.manifest), error); });

test('Git reader rejects local drift, untracked bytes, symlinks and event mismatch', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'problem-ui-git-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 'UI Test', GIT_AUTHOR_EMAIL: 'ui@example.test', GIT_COMMITTER_NAME: 'UI Test', GIT_COMMITTER_EMAIL: 'ui@example.test' } }).trim();
  git('init', '-q'); fs.writeFileSync(path.join(root, 'a.txt'), 'same'); fs.symlinkSync('a.txt', path.join(root, 'link.txt'));
  git('add', '.'); git('commit', '-qm', 'fixture');
  const commit = git('rev-parse', 'HEAD'), reader = checker.createGitReader(root, commit);
  assert.equal(reader.read('a.txt').toString(), 'same');
  assert.throws(() => checker.createGitReader(root, 'b'.repeat(40)), /UI_EVENT_HEAD_MISMATCH/);
  assert.throws(() => reader.read('link.txt'), /UI_TRACKED_FILE_REQUIRED/);
  fs.writeFileSync(path.join(root, 'new.txt'), 'same'); assert.throws(() => reader.read('new.txt'), /UI_TRACKED_FILE_REQUIRED/);
  fs.writeFileSync(path.join(root, 'a.txt'), 'changed'); assert.throws(() => reader.read('a.txt'), /UI_CHECKOUT_BYTES_DRIFT/);
});

test('workflow requires the six-case job without modifying the existing solution browser gate', () => {
  const workflow = fs.readFileSync(path.join(__dirname, '..', checker.WORKFLOW_PATH), 'utf8');
  assert.match(workflow, /reviewed-problem-renderers:\s*\n\s*name: Archive2 reviewed problem UI \(6 cases\)/);
  const job = workflow.slice(workflow.indexOf('  reviewed-problem-renderers:'));
  assert.match(job, /timeout-minutes: 8/);
  assert.match(job, /ref: \$\{\{ github.sha \}\}/);
  assert.match(job, /node --test tests\/archive-problem-renderer-ui-contract.test.js/);
  assert.match(job, /playwright@1\.62\.1/);
  assert.match(job, /CHROME_BIN: \$\{\{ steps.chrome.outputs.chrome-path \}\}/);
  assert.match(job, /if: steps.plan.outputs.required == 'true'/);
  assert(!job.includes('continue-on-error'));
  assert.match(job, /technical-proof.json/);
  assert.match(job, /\*-desktop.png/);
  assert.match(job, /\*-mobile.png/);
  assert.match(workflow, /name: Archive2 50-question solution Chrome[\s\S]*?timeout-minutes: 12/);
});
