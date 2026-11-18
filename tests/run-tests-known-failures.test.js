'use strict';
// KNOWN-FAIL(알려진 실패 서명) 기능의 단위 테스트. 가짜 테스트 파일을 임시 폴더에 만들어 실제로 돌려 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {
  runnableFiles, runPlan, classifyRun, abnormalReason, validateKnownFailures, formatKnownFailureSummary, loadKnownFailures, parseFailures,
} = require('../tools/lib/known-failures.js');
const { collectTests } = require('../tools/run-tests.js');

const repo = path.join(__dirname, '..');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'known-fail-'));
test.after(() => fs.rmSync(tmp, { recursive: true, force: true }));

function write(name, text) {
  fs.writeFileSync(path.join(tmp, name), text);
  return name;
}
const ALPHA = write('alpha.test.js', `const test = require('node:test'); const assert = require('node:assert');
test('alpha', () => assert.fail('boom-alpha')); test('beta', () => {});`);
const ALPHA_GAMMA = write('alpha-gamma.test.js', `const test = require('node:test'); const assert = require('node:assert');
test('alpha', () => assert.fail('boom-alpha')); test('gamma', () => assert.fail('boom-gamma'));`);
const ALPHA_CHANGED = write('alpha-changed.test.js', `const test = require('node:test'); const assert = require('node:assert');
test('alpha', () => assert.fail('a different message'));`);
const GREEN = write('green.test.js', `const test = require('node:test'); test('ok', () => {});`);
const PLAIN = write('plain.test.js', `throw new Error('plain-boom');`);
const SLOW = write('slow.test.js', `console.log('Error: known-boom happened'); setTimeout(() => {}, 60000);`);

function entry(extra = {}) {
  return { file: ALPHA, testName: 'alpha', pattern: 'boom-alpha', repair: 'R-1', cause: '원인 한 줄', resolvedWhen: '무엇이 되면 풀리는가', ...extra };
}
function item(file, extra = {}) {
  return { failedName: file, shownName: file, args: [file], timeout: 20000, files: [file], quarantined: false, ...extra };
}
function run(plan, entries) {
  const out = []; const err = [];
  const result = runPlan({ root: tmp, plan, entries, stdout: { write: s => out.push(s) }, stderr: { write: s => err.push(s) }, error: s => err.push(`${s}\n`) });
  return { result, text: out.join('') + err.join('') };
}

test('서명이 일치하는 실패는 KNOWN-FAIL로 집계되고 FAIL이 아니다(종료 코드에 영향 없음)', () => {
  const { result } = run([item(ALPHA)], [entry()]);
  assert.equal(result.failed.length, 0);
  assert.equal(result.knownMatched.length, 1);
  assert.equal(result.passed, 0);
});

test('node --test 로 돌아도, tap/spec 어느 보고 형식이어도 같은 서명으로 인식한다', () => {
  for (const reporter of ['tap', 'spec']) {
    const { result } = run([item(ALPHA, { args: ['--test', `--test-reporter=${reporter}`, ALPHA] })], [entry()]);
    assert.equal(result.failed.length, 0, reporter);
    assert.equal(result.knownMatched.length, 1, reporter);
  }
});

test('같은 파일에서 다른 이름의 새 실패가 나면 FAIL', () => {
  const { result, text } = run([item(ALPHA_GAMMA)], [entry({ file: ALPHA_GAMMA })]);
  assert.deepEqual(result.failed, [ALPHA_GAMMA]);
  assert.match(text, /목록에 없는 실패: "gamma"/);
});

test('같은 이름이어도 오류 문구가 다르면 FAIL', () => {
  const { result } = run([item(ALPHA_CHANGED)], [entry({ file: ALPHA_CHANGED })]);
  assert.deepEqual(result.failed, [ALPHA_CHANGED]);
});

test('알려진 실패가 통과하면(재현되지 않으면) FAIL — 목록에서 삭제하라고 알린다', () => {
  const { result, text } = run([item(GREEN)], [entry({ file: GREEN })]);
  assert.deepEqual(result.failed, [GREEN]);
  assert.equal(result.passed, 0);
  assert.match(text, /예상된 실패가 재현되지 않음/);
  assert.match(text, /삭제하세요/);
});

test('테스트 이름이 없는 스크립트 실패는 문구 패턴으로 대조한다(이름 없이도 다른 문구면 FAIL)', () => {
  const sig = entry({ file: PLAIN, testName: undefined, pattern: 'plain-boom' });
  assert.equal(run([item(PLAIN)], [sig]).result.knownMatched.length, 1);
  const other = entry({ file: PLAIN, testName: undefined, pattern: 'something else' });
  assert.deepEqual(run([item(PLAIN)], [other]).result.failed, [PLAIN]);
});

test('시간 초과: 서명 문구를 이미 찍은 뒤 멈춰도 알려진 실패로 삼키지 않고 FAIL (실제 자식 프로세스)', () => {
  const sig = entry({ file: SLOW, testName: undefined, pattern: 'known-boom' });
  const { result, text } = run([item(SLOW, { timeout: 800 })], [sig]);
  assert.equal(result.knownMatched.length, 0);
  assert.deepEqual(result.failed, [SLOW]);
  assert.match(text, /시간 초과 — 알려진 실패로 보지 않음/);
});

// 비정상 종료 세 경우: 서명 문구가 출력에 이미 있어도 무조건 FAIL이다(항목이 있든 없든).
const SIGNATURE_TEXT = 'Error: known-boom happened\n';
const ABNORMAL_CASES = [
  ['ETIMEDOUT', { status: null, signal: 'SIGTERM', error: Object.assign(new Error('spawnSync ETIMEDOUT'), { code: 'ETIMEDOUT' }), stdout: SIGNATURE_TEXT, stderr: '' }, /시간 초과/],
  ['ENOBUFS', { status: null, signal: 'SIGTERM', error: Object.assign(new Error('spawnSync ENOBUFS'), { code: 'ENOBUFS' }), stdout: SIGNATURE_TEXT, stderr: '' }, /출력 버퍼 초과/],
  ['신호 종료(SIGKILL)', { status: null, signal: 'SIGKILL', stdout: SIGNATURE_TEXT, stderr: '' }, /신호 종료\(SIGKILL\)/],
];
for (const [label, spawned, reason] of ABNORMAL_CASES) {
  test(`비정상 종료 ${label}: 서명 문구가 찍혀 있어도 FAIL, 항목이 없어도 FAIL`, () => {
    const sig = entry({ file: PLAIN, testName: undefined, pattern: 'known-boom' });
    const errors = [];
    const withEntry = runPlan({ root: tmp, plan: [item(PLAIN)], entries: [sig], spawn: () => spawned, stdout: { write() {} }, stderr: { write() {} }, error: s => errors.push(s) });
    assert.equal(withEntry.knownMatched.length, 0);
    assert.deepEqual(withEntry.failed, [PLAIN]);
    assert.match(withEntry.problemLines.join('\n'), reason);
    assert.match(withEntry.problemLines.join('\n'), /알려진 실패로 보지 않음/);
    const noEntry = runPlan({ root: tmp, plan: [item(PLAIN)], entries: [], spawn: () => spawned, error: () => {} });
    assert.deepEqual(noEntry.failed, [PLAIN], '항목이 없어도 원래대로 실패');
    assert.equal(classifyRun({ entries: [sig], ok: false, abnormal: abnormalReason(spawned), output: SIGNATURE_TEXT }).verdict, 'fail');
  });
}

test('자식 테스트에 부모의 NODE_TEST_CONTEXT가 새지 않는다 (node --test 안에서 불려도 같은 판정)', () => {
  const seen = [];
  const spawn = (cmd, args, options) => { seen.push(options.env); return { status: 0, stdout: '', stderr: '' }; };
  const saved = process.env.NODE_TEST_CONTEXT;
  try {
    process.env.NODE_TEST_CONTEXT = 'child-v8';
    runPlan({ root: tmp, plan: [item('a.js'), item('b.js', { files: ['b.js'] })], entries: [entry({ file: 'b.js' })], spawn, stdout: { write() {} }, stderr: { write() {} }, error: () => {} });
  } finally {
    if (saved === undefined) delete process.env.NODE_TEST_CONTEXT; else process.env.NODE_TEST_CONTEXT = saved;
  }
  assert.equal(seen.length, 2);
  for (const env of seen) {
    assert.ok(env && !('NODE_TEST_CONTEXT' in env));
    assert.equal(env.PATH ?? env.Path, process.env.PATH ?? process.env.Path, '나머지 환경은 그대로');
  }
});

test('목록이 비어 있으면 예전과 똑같이 stdio를 그대로 넘기고, 통과/실패도 그대로 집계한다', () => {
  const calls = [];
  const spawn = (cmd, args, options) => { calls.push(options.stdio); return { status: args[0] === 'bad.js' ? 1 : 0 }; };
  const result = runPlan({ root: tmp, plan: [item('good.js'), item('bad.js')], entries: [], spawn, error: () => {} });
  assert.deepEqual(calls, ['inherit', 'inherit']);
  assert.equal(result.passed, 1);
  assert.deepEqual(result.failed, ['bad.js']);
  assert.equal(result.knownMatched.length, 0);
});

test('기존 격리(quarantined) 동작은 그대로: 실패는 knownFailed, 통과는 fixedKnown', () => {
  const spawn = (cmd, args) => ({ status: args[0] === 'bad.js' ? 1 : 0 });
  const result = runPlan({ root: tmp, plan: [item('bad.js', { quarantined: true }), item('good.js', { quarantined: true })], entries: [], spawn, error: () => {} });
  assert.deepEqual(result.knownFailed, ['bad.js']);
  assert.deepEqual(result.fixedKnown, ['good.js']);
  assert.equal(result.failed.length, 0);
});

test('요약은 항목이 0건이어도 한 줄을 내고, 항목은 수리 번호·원인·해결 조건·"뒤는 미확인"을 보여 준다', () => {
  assert.deepEqual(formatKnownFailureSummary([]), ['KNOWN-FAIL 목록 (tests/known-failures.json): 0건']);
  const e = entry({ stopsAtFirstFailure: true });
  const lines = formatKnownFailureSummary([e]);
  assert.match(lines[0], /1건/);
  assert.match(lines[1], /\[수리 R-1\]/);
  assert.match(lines[1], /원인: 원인 한 줄/);
  assert.match(lines[1], /해결 조건: 무엇이 되면 풀리는가/);
  assert.match(lines[1], /첫 실패에서 중단 — 뒤는 미확인/);
});

test('목록 자체 검사: 없는 파일·실행기가 안 도는 파일·중복·서명 없음·잘못된 정규식을 잡는다', () => {
  const runnable = new Set([ALPHA, GREEN]);
  const check = entries => validateKnownFailures({ schema: 'known-failures-v1', entries }, { root: tmp, runnable });
  assert.deepEqual(check([]), []);
  assert.deepEqual(check([entry()]), []);
  assert.match(check([entry({ file: 'nope.test.js' })]).join('\n'), /저장소에 없는 테스트 파일/);
  assert.match(check([entry({ file: PLAIN })]).join('\n'), /돌리지 않는 파일/);
  assert.match(check([entry(), entry({ pattern: 'other' })]).join('\n'), /중복/);
  assert.match(check([entry({ pattern: '' })]).join('\n'), /pattern가 비었습니다/);
  const noMeta = check([entry({ cause: '', repair: undefined })]).join('\n');
  assert.match(noMeta, /cause가 비었습니다/);
  assert.match(noMeta, /repair가 비었습니다/);
  assert.match(check([entry({ pattern: '(' })]).join('\n'), /정규식/);
  assert.match(validateKnownFailures({ schema: 'x', entries: [] }, { root: tmp, runnable }).join('\n'), /schema/);
});

test('저장소의 실제 목록은 형식이 맞고(검사 통과), 가리키는 파일이 모두 실행기가 도는 파일이다', () => {
  const doc = loadKnownFailures(repo);
  const collected = collectTests({ includeQuarantined: false });
  const runnable = runnableFiles(collected);
  assert.deepEqual(validateKnownFailures(doc, { root: repo, runnable }), []);
});

test('classifyRun: 통과하고 항목이 없으면 pass, 실패하고 항목이 없으면 fail', () => {
  assert.equal(classifyRun({ entries: [], ok: true }).verdict, 'pass');
  assert.equal(classifyRun({ entries: [], ok: false }).verdict, 'fail');
});

// ---- 실제 목록(tests/known-failures.json)과 main CI 실행 44201454861의 실제 출력으로 하는 대조 ----
// tests/fixtures/known-failures-ci-44201454861/*.txt 는 그 실행(job 134456397898)의 해당 테스트 출력을 그대로 발췌한 것이다
// (러너 시각 접두와 CR 제거, item-4slot-data의 STALE 줄 목록만 3줄로 줄임). 이 PC의 Windows 문구와 섞지 않는다.
const FIXTURE_DIR = path.join(repo, 'tests', 'fixtures', 'known-failures-ci-44201454861');
const fixture = name => fs.readFileSync(path.join(FIXTURE_DIR, name), 'utf8');
const realEntries = loadKnownFailures(repo).entries;
const forFile = file => realEntries.filter(e => e.file === file);
const CI_CASES = [
  ['tests/meta-foundation-limit-continuity-runtime.test.js', 'limit-continuity.txt'],
  ['tests/meta-foundation-middle-geometry-runtime.test.js', 'middle-geometry.txt'],
  ['tests/item-4slot-data.test.cjs', 'item-4slot-data.txt'],
];
const verdictFor = (file, output, ok = false) => classifyRun({ entries: forFile(file), ok, output });

test('실제 목록은 CI 출력의 세 파일 전부를 KNOWN-FAIL로 분류한다', () => {
  assert.deepEqual([...new Set(realEntries.map(e => e.file))].sort(), CI_CASES.map(([file]) => file).sort(), '목록의 파일이 곧 CI에서 실패한 세 파일');
  for (const [file, name] of CI_CASES) {
    const verdict = verdictFor(file, fixture(name));
    assert.deepEqual(verdict.problems, [], file);
    assert.equal(verdict.verdict, 'known', file);
    assert.equal(verdict.reproduced.length, forFile(file).length, `${file}: 모든 서명이 재현됨`);
  }
});

test('(a) 같은 파일에서 다른 하위 테스트가 실패하면 FAIL', () => {
  // 이름 없는 스크립트: 첫 실패 문구가 다른 단언이면 FAIL
  const limit = fixture('limit-continuity.txt').replace('canonical native assignment missing/ambiguous', 'a completely different assertion');
  assert.equal(verdictFor('tests/meta-foundation-limit-continuity-runtime.test.js', limit).verdict, 'fail');
  // item-4slot-data: 세 번째 결함이 생기면 FAIL(결함 수 줄이 달라지고 새 FAIL 줄이 생김)
  const third = fixture('item-4slot-data.txt').replace('2 defect(s)', '3 defect(s)')
    .replace('  ... and 525 more', '  FAIL archive/data/item-4slot/original/middle/m2/1mid/19_새시험.4slot.json: PARTIAL_4SLOT:CURRENT_SOURCE_BLOB_MISMATCH\n  ... and 525 more')
    .replace('2 !== 0', '3 !== 0');
  const verdict3 = verdictFor('tests/item-4slot-data.test.cjs', third);
  assert.equal(verdict3.verdict, 'fail');
  assert.match(verdict3.problems.join('\n'), /재현되지 않음.*item-4slot-data/, '결함 수 서명이 어긋나 목록을 다시 보게 한다');
});

test('(b) 서명의 실패가 사라지면 FAIL — 통과해도, 일부만 사라져도', () => {
  for (const [file] of CI_CASES) {
    const verdict = verdictFor(file, '', true);
    assert.equal(verdict.verdict, 'fail', file);
    assert.match(verdict.problems.join('\n'), /예상된 실패가 재현되지 않음/, file);
  }
  // item-4slot-data: 두 FAIL 중 하나만 사라져도 FAIL
  const oneGone = fixture('item-4slot-data.txt').split('\n').filter(line => !line.includes('19_신흥중_2학기_중간_중3_수학')).join('\n');
  assert.equal(verdictFor('tests/item-4slot-data.test.cjs', oneGone).verdict, 'fail');
});

test('(c) 오류 문구가 달라지면 FAIL — 이름이 같아도, 한 테스트의 문구만 달라져도', () => {
  const middle = fixture('middle-geometry.txt').replace('unknown source change', 'unknown live font change');
  assert.equal(verdictFor('tests/meta-foundation-middle-geometry-runtime.test.js', middle).verdict, 'fail');
  // 첫 실패의 문항(qid)이 바뀌면 FAIL: 다음 실패로 넘어간 것이므로 목록을 사람이 다시 봐야 한다
  const nextQid = fixture('limit-continuity.txt').replace('qid_v1_0a3b270b', 'qid_v1_ffffffff');
  assert.equal(verdictFor('tests/meta-foundation-limit-continuity-runtime.test.js', nextQid).verdict, 'fail');
});

test('목록은 원인·해결 조건·수리 번호를 갖고, 첫 실패에서 멈추는 항목은 표시한다', () => {
  for (const entry of realEntries) {
    assert.match(entry.repair, /^37-[①-⑤]$/);
    assert.ok(entry.cause.length > 10 && entry.resolvedWhen.length > 5);
  }
  const stops = realEntries.filter(e => e.stopsAtFirstFailure).map(e => e.file).sort();
  assert.deepEqual(stops, [
    'tests/meta-foundation-limit-continuity-runtime.test.js',
    'tests/meta-foundation-middle-geometry-runtime.test.js',
  ]);
  const lines = formatKnownFailureSummary(realEntries);
  assert.equal(lines.length, realEntries.length + 1);
  assert.match(lines[0], new RegExp(`${realEntries.length}건`));
});
