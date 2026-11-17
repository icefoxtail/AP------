'use strict';
// 시험지별 그림 장부(production/exam-figure-ledger/) 계약:
// 1) 저장소 폴더가 정해진 형식이고 CLOSED 시험지에 열린 문항이 없다.
// 2) 옛 한 파일 -> 쪼개기 -> 합치기가 내용을 바꾸지 않는다.
// 3) 쓰기는 문항 단위다. 일부 문항만 다시 게시해도 다른 문항(특히 PUBLISHED)과 다른 시험지는 그대로다.
// 4) 다른 시험지, 같은 시험지의 다른 문항을 고친 두 브랜치가 git에서 충돌 없이 합쳐진다.
// 5) 옛 형식 브랜치의 변경을 새 형식으로 옮길 때 PUBLISHED를 내리는 변경은 충돌로 멈춘다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const repo = path.resolve(__dirname, '..');
const svgm1 = path.join(repo, 'archive/tools/geometry-equation/ops/svg-m1');
const FL = require(path.join(svgm1, 'figure-ledger.cjs'));
const python = process.env.GEOMETRY_PYTHON || (process.platform === 'win32' ? 'python' : 'python3');

test('repository ledger folder is canonical, one file per exam, and CLOSED exams have no open items', () => {
  assert.equal(fs.existsSync(path.join(repo, FL.LEGACY_REL)), false, 'old single-file ledger must not coexist');
  const dir = FL.ledgerDir(repo);
  const metaRaw = fs.readFileSync(path.join(dir, FL.META_NAME));
  const meta = FL.parse(metaRaw);
  assert.ok(meta.schemaVersion && !('exams' in meta));
  assert.ok(metaRaw.equals(FL.dumps(meta)), '_meta.json canonical');
  const files = FL.examFiles(repo);
  assert.ok(files.length > 0);
  const problems = [];
  for (const file of files) {
    const rel = path.relative(dir, file).split(path.sep).join('/');
    const raw = fs.readFileSync(file);
    try {
      const entry = FL.parse(raw);
      FL.checkEntry(entry, rel);
      if (!raw.equals(FL.dumps(entry))) problems.push(rel + ': not canonical');
      if (raw.includes(Buffer.from('\r\n'))) problems.push(rel + ': CRLF');
    } catch (err) { problems.push(rel + ': ' + err.message); }
  }
  for (const file of (function walk(d, out = []) { for (const x of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, x.name); x.isDirectory() ? walk(p, out) : out.push(p); } return out; })(dir)) {
    if (!file.endsWith('.json')) problems.push(path.relative(dir, file) + ': unexpected file');
  }
  assert.deepEqual(problems, []);
});

function fixtureRoot(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'figure-ledger 한글 '));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const root = path.join(dir, 'repo');
  const tools = path.join(root, 'archive/tools/geometry-equation/ops/svg-m1');
  fs.mkdirSync(tools, { recursive: true });
  fs.mkdirSync(path.join(root, '.git'));
  for (const f of ['portable_root.py', 'figure_ledger.py', 'ledger-upsert.py', 'figure-ledger.cjs']) fs.copyFileSync(path.join(svgm1, f), path.join(tools, f));
  fs.writeFileSync(path.join(root, 'archive/tools/geometry-equation/visual-browser-runtime.mjs'), '');
  const env = { ...process.env, APMS_ROOT: root, PYTHONUTF8: '1' };
  const py = (args, opts = {}) => spawnSync(python, args, { cwd: dir, env, encoding: 'utf8', ...opts });
  const writeExam = (src, ords, images = {}) => {
    const file = path.join(root, src); fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, 'window.questionBank=' + JSON.stringify(ords.map(o => ({ id: o, ...(images[o] ? { solutionImage: images[o] } : {}) }))) + ';\n');
    for (const img of Object.values(images)) { const p = path.join(root, 'archive', img); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, '<svg/>'); }
  };
  return { dir, root, tools, env, py, writeExam };
}

const A = 'archive/exams/original/middle/m1/1mid/24_가중_1학기_중간_중1_기출.js';
const B = 'archive/exams/original/high/h1/2final/25_나고_2학기_기말_고1_기출.js';
const pub = (exam, o, extra = {}) => ({ ord: o, state: 'PUBLISHED', camp: 'old', key: `old-q${o}`, fam: 'CONSTRUCTION', figures: [`assets/images/${exam}/q${o}-solution.svg`], ...extra });
const name = src => path.posix.basename(src, '.js');
function legacyFixture() {
  return {
    schemaVersion: 'exam-figure-ledger-v1', updated: '2026-11-16', rule: '규칙 문구',
    exams: [
      { exam: name(B), src: B, status: 'OPEN', items: [{ ord: 'q01', state: 'OPEN_UNSUPPORTED', reason: '줄바꿈\n"따옴표" \\ 탭\t' }, pub(name(B), 2)], note: '' },
      { exam: name(A), src: A, items: [pub(name(A), 1), pub(name(A), 2), pub(name(A), 3), { ord: 4, state: 'EXEMPT', camp: 'old', key: 'old-q4', reason: '그림 불필요' }], status: 'CLOSED', closedBy: '#1', note: '3개 게시', publishedBy: 'x' },
    ],
  };
}

test('split then join keeps every exam entry byte-identical (Python and Node agree)', t => {
  const x = fixtureRoot(t);
  const legacy = legacyFixture();
  const legacyFile = path.join(x.dir, 'legacy.json');
  fs.writeFileSync(legacyFile, JSON.stringify(legacy, null, 2) + '\n');
  let r = x.py([path.join(x.tools, 'figure_ledger.py'), 'split-ledger', '--from', legacyFile]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /"roundTrip": "OK"/);
  assert.ok(fs.existsSync(path.join(x.root, FL.LEDGER_REL, 'middle/m1/1mid', name(A) + '.json')));
  const out = path.join(x.dir, 'joined.json');
  r = x.py([path.join(x.tools, 'figure_ledger.py'), 'join-ledger', '--out', out]);
  assert.equal(r.status, 0, r.stderr);
  const joined = JSON.parse(fs.readFileSync(out, 'utf8'));
  const bySrc = l => Object.fromEntries(l.exams.map(e => [e.src, JSON.stringify(e, null, 2)]));
  assert.deepEqual(bySrc(joined), bySrc(legacy));
  assert.deepEqual(Object.keys(joined), Object.keys(legacy));
  assert.equal(joined.rule, legacy.rule);
  const nodeAll = FL.loadAll(x.root);
  assert.equal(JSON.stringify(nodeAll, null, 2) + '\n', fs.readFileSync(out, 'utf8'));
  r = x.py([path.join(x.tools, 'figure_ledger.py'), 'split-ledger', '--from', legacyFile]);
  assert.match(r.stdout, /"written": 0\b/, 'second split rewrites nothing');
  r = x.py([path.join(x.tools, 'figure_ledger.py'), 'check-ledger']);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});

function splitFixture(x) {
  const legacyFile = path.join(x.dir, 'legacy.json');
  fs.writeFileSync(legacyFile, JSON.stringify(legacyFixture(), null, 2) + '\n');
  const r = x.py([path.join(x.tools, 'figure_ledger.py'), 'split-ledger', '--from', legacyFile]);
  assert.equal(r.status, 0, r.stderr);
  const img = o => `assets/images/${name(A)}/q${o}-solution.svg`;
  x.writeExam(A, [1, 2, 3, 4, 5], { 1: img(1), 2: img(2), 3: img(3), 5: img(5) });
  return img;
}
const fileOf = (x, src) => path.join(x.root, FL.LEDGER_REL, FL.relPath(src));
function upsert(x, spec, triage) {
  const tf = path.join(x.dir, 'triage.json'), sf = path.join(x.dir, 'spec.json');
  fs.writeFileSync(tf, JSON.stringify(triage)); fs.writeFileSync(sf, JSON.stringify({ triage: tf, ...spec }));
  return x.py([path.join(x.tools, 'ledger-upsert.py'), sf]);
}

test('partial re-publish keeps existing PUBLISHED items and touches only that exam file', t => {
  const x = fixtureRoot(t);
  const img = splitFixture(x);
  const otherBefore = fs.readFileSync(fileOf(x, B)), metaBefore = fs.readFileSync(path.join(x.root, FL.LEDGER_REL, FL.META_NAME));
  const before = FL.loadExam(A, x.root);
  // pubflow 가 일부 문항(q5)만 다시 게시할 때 만드는 spec 그대로: 나머지 FIGURE 문항은 open 으로 넘어온다.
  const triage = [1, 2, 3, 5].map(o => ({ ord: o, decision: 'FIGURE', family: 'CONSTRUCTION' })).concat([{ ord: 4, decision: 'EXEMPT', reason: '그림 불필요' }]);
  const r = upsert(x, { exam: name(A), src: A, camp: 'new', closedBy: '#2', note: '1개 게시', published: { 5: img(5) },
    open: { 1: ['OPEN_LAYOUT', 'plan 대기'], 2: ['OPEN_LAYOUT', 'plan 대기'], 3: ['OPEN_LAYOUT', 'plan 대기'] } }, triage);
  assert.equal(r.status, 0, r.stderr);
  const after = FL.loadExam(A, x.root);
  for (const o of [1, 2, 3]) assert.deepEqual(after.items.find(i => i.ord === o), before.items.find(i => i.ord === o), `q${o} unchanged`);
  assert.deepEqual(after.items.find(i => i.ord === 5), { ord: 5, state: 'PUBLISHED', camp: 'new', key: 'new-q5', fam: 'CONSTRUCTION', figures: [img(5)] });
  assert.equal(after.status, 'CLOSED');
  assert.equal(after.closedBy, '#2');
  assert.equal(after.publishedBy, 'x', 'unknown exam-level keys survive');
  assert.deepEqual(after.items.map(i => i.ord), [1, 2, 3, 4, 5], 'existing order kept, new ord appended');
  assert.ok(fs.readFileSync(fileOf(x, B)).equals(otherBefore), 'other exam file untouched');
  assert.ok(fs.readFileSync(path.join(x.root, FL.LEDGER_REL, FL.META_NAME)).equals(metaBefore), '_meta.json untouched');
});

test('only an explicit demote reopens a PUBLISHED item', t => {
  const x = fixtureRoot(t);
  splitFixture(x);
  const triage = [1, 2, 3].map(o => ({ ord: o, decision: 'KEEP_EXISTING' })).concat([{ ord: 4, decision: 'EXEMPT', reason: '그림 불필요' }, { ord: 5, decision: 'KEEP_EXISTING' }]);
  const r = upsert(x, { exam: name(A), src: A, camp: 'redo', closedBy: '#3', note: '', demote: { 2: ['OPEN_LAYOUT', '다시 그림'] } }, triage);
  assert.equal(r.status, 0, r.stderr);
  const after = FL.loadExam(A, x.root);
  assert.equal(after.items.find(i => i.ord === 2).state, 'OPEN_LAYOUT');
  assert.equal(after.items.find(i => i.ord === 1).camp, 'old', 'not-passed PUBLISHED keeps its record');
  assert.equal(after.status, 'OPEN');
  assert.equal(after.closedBy, null);
});

test('a new exam is written exactly as the single-file upsert wrote it', t => {
  const x = fixtureRoot(t);
  splitFixture(x);
  const C = 'archive/exams/original/middle/m2/1final/23_다중_1학기_기말_중2_기출.js';
  x.writeExam(C, [1, 2, 3]);
  const r = upsert(x, { exam: name(C), src: C, camp: 'm2', note: 'n', open: { 3: ['OPEN_LAYOUT', 'plan 대기'] } },
    [{ ord: 1, decision: 'CONTENT', reason: 'c', family: 'F' }, { ord: 2, decision: 'EXEMPT', reason: 'e' }, { ord: 3, decision: 'FIGURE', family: 'F' }]);
  assert.equal(r.status, 0, r.stderr);
  const raw = fs.readFileSync(fileOf(x, C), 'utf8');
  assert.equal(raw, JSON.stringify({ exam: name(C), src: C, items: [
    { ord: 1, state: 'OPEN_CONTENT', camp: 'm2', key: 'm2-q1', fam: 'F', reason: 'c' },
    { ord: 2, state: 'EXEMPT', camp: 'm2', key: 'm2-q2', reason: 'e' },
    { ord: 3, state: 'OPEN_LAYOUT', camp: 'm2', key: 'm2-q3', fam: 'F', reason: 'plan 대기' }], status: 'OPEN', closedBy: null, note: 'n' }, null, 2) + '\n');
});

test('save/upsert guards: no silent PUBLISHED demotion, no item removal, no false CLOSED (Node and Python)', t => {
  const x = fixtureRoot(t);
  splitFixture(x);
  const e = FL.loadExam(A, x.root);
  const demoted = structuredClone(e); demoted.items[0].state = 'OPEN_LAYOUT'; demoted.status = 'OPEN';
  assert.throws(() => FL.saveExam(demoted, x.root), /PUBLISHED would become/);
  const removed = structuredClone(e); removed.items.pop();
  assert.throws(() => FL.saveExam(removed, x.root), /would be removed/);
  const falseClose = structuredClone(e); falseClose.items[0].state = 'OPEN_LAYOUT';
  assert.throws(() => FL.saveExam(falseClose, x.root, { allowDemote: [1] }), /CLOSED with unresolved/);
  const before = fs.readFileSync(fileOf(x, A), 'utf8');
  FL.upsertItem(A, 4, { reason: '바뀐 사유' }, x.root);
  const lines = (s) => s.split('\n');
  const diff = lines(fs.readFileSync(fileOf(x, A), 'utf8')).filter((l, i) => l !== lines(before)[i]);
  assert.deepEqual(diff, ['      "reason": "바뀐 사유"'], 'one-item patch changes one line');
  assert.throws(() => FL.upsertItem(A, 1, { state: 'OPEN_LAYOUT' }, x.root), /PUBLISHED would become/);
  FL.upsertItem(A, 1, { state: 'OPEN_LAYOUT', reason: '다시' }, x.root, { allowDemote: true });
  const reopened = FL.loadExam(A, x.root);
  assert.equal(reopened.status, 'OPEN'); assert.equal(reopened.closedBy, null);
  const r = x.py(['-c', [
    'import sys; sys.path.insert(0, sys.argv[1]); import figure_ledger as FL',
    'e = FL.load_exam(sys.argv[2])',
    'try:\n    FL.upsert_item(sys.argv[2], 2, {"state": "OPEN_LAYOUT"}); print("NO-GUARD")\nexcept FL.LedgerError as err: print("GUARD", err)',
    'FL.upsert_item(sys.argv[2], 4, {"reason": "파이썬"}); print(FL.load_exam(sys.argv[2])["items"][3]["reason"])',
  ].join('\n'), x.tools, A]);
  assert.equal(r.status, 0, r.stderr);
  assert.match(r.stdout, /GUARD .*PUBLISHED would become/);
  assert.match(r.stdout, /파이썬/);
});

function gitRepo(t) {
  const x = fixtureRoot(t);
  fs.rmSync(path.join(x.root, '.git'), { recursive: true });
  const g = (...args) => execFileSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@example.invalid', '-c', 'core.autocrlf=false', ...args], { cwd: x.root, encoding: 'utf8', env: x.env });
  g('init', '-q', '-b', 'main');
  return { ...x, g };
}

test('branches that touch different exams, or different items of one exam, merge without conflict', t => {
  const x = gitRepo(t);
  splitFixture(x);
  x.g('add', '-A'); x.g('commit', '-qm', 'split');
  x.g('checkout', '-qb', 'one');
  FL.upsertItem(A, 2, { camp: 'one', key: 'one-q2' }, x.root);
  FL.upsertItem(B, 'q01', { reason: '브랜치 하나' }, x.root);
  x.g('commit', '-qam', 'one');
  x.g('checkout', '-q', 'main'); x.g('checkout', '-qb', 'two');
  FL.upsertItem(A, 3, { camp: 'two', key: 'two-q3' }, x.root);
  x.g('commit', '-qam', 'two');
  x.g('checkout', '-q', 'main');
  x.g('merge', '-q', '--no-edit', 'one');
  x.g('merge', '-q', '--no-edit', 'two');
  const e = FL.loadExam(A, x.root);
  assert.equal(e.items[1].camp, 'one'); assert.equal(e.items[2].camp, 'two');
  assert.equal(FL.loadExam(B, x.root).items[0].reason, '브랜치 하나');
});

test('port-ledger-change moves a single-file branch change and stops on a PUBLISHED demotion', t => {
  const x = gitRepo(t);
  const img = o => `assets/images/${name(A)}/q${o}-solution.svg`;
  x.writeExam(A, [1, 2, 3, 4, 5], { 1: img(1), 2: img(2), 3: img(3), 5: img(5) });
  const legacyPath = path.join(x.root, FL.LEGACY_REL);
  fs.mkdirSync(path.dirname(legacyPath), { recursive: true });
  const L = legacyFixture();
  const save = () => fs.writeFileSync(legacyPath, JSON.stringify(L, null, 2) + '\n');
  save(); x.g('add', '-A'); x.g('commit', '-qm', 'base'); const base = x.g('rev-parse', 'HEAD').trim();
  // 옛 형식 브랜치: A에 q5 게시 + B의 PUBLISHED q2를 OPEN으로 덮는 사고
  x.g('checkout', '-qb', 'old-figure-pr');
  L.exams[1].items.push(pub(name(A), 5, { camp: 'pr' })); L.exams[1].note = '4개 게시';
  L.exams[0].items[1] = { ord: 2, state: 'OPEN_LAYOUT', camp: 'pr', key: 'pr-q2', reason: 'plan 대기' };
  save(); x.g('commit', '-qam', 'old pr'); const head = x.g('rev-parse', 'HEAD').trim();
  // main: 쪼갠 뒤 다른 작업자가 A의 q4 사유를 고쳤다.
  x.g('checkout', '-q', 'main');
  let r = x.py([path.join(x.tools, 'figure_ledger.py'), 'split-ledger']);
  assert.equal(r.status, 0, r.stderr);
  FL.upsertItem(A, 4, { reason: 'main에서 고침' }, x.root);
  x.g('add', '-A'); x.g('commit', '-qm', 'split + main change');
  const bBefore = fs.readFileSync(fileOf(x, B));
  r = x.py([path.join(x.tools, 'figure_ledger.py'), 'port-ledger-change', '--base', base, '--head', head]);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  const rep = JSON.parse(r.stdout);
  assert.deepEqual(rep.written, [A]);
  assert.match(rep.conflicts[B].join(' '), /demotes PUBLISHED/);
  const e = FL.loadExam(A, x.root);
  assert.equal(e.items.find(i => i.ord === 4).reason, 'main에서 고침', 'target change kept');
  assert.equal(e.items.find(i => i.ord === 5).camp, 'pr', 'branch change ported');
  assert.equal(e.note, '4개 게시');
  assert.ok(fs.readFileSync(fileOf(x, B)).equals(bBefore), 'conflicting exam not written');
});
