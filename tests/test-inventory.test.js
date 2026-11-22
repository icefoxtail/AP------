'use strict';
// 모든 테스트 파일은 tests/test-inventory.json 의 어느 칸에 속해야 한다.
// 목록에도 없고 실행기에서도 돌지 않는 테스트는 아무것도 지켜 주지 않기 때문이다
// (고1 문제지 저장이 3주간 전면 실패했는데 잡는 검사가 꺼져 있던 것과 같은 종류의 구멍).
// 운영 데이터 개수는 고정하지 않고 결함 조건(목록에 없음·없는 파일·중복·이유 없음)만 본다.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const repo = path.join(__dirname, '..');
const INVENTORY = 'tests/test-inventory.json';
const inventory = JSON.parse(fs.readFileSync(path.join(repo, INVENTORY), 'utf8'));
const { collectTests } = require('../tools/run-tests.js');
const { stripPathFilters, referencesEntry } = require('./helpers/workflow-references.cjs');

const REASONS = ['pending', 'finished-campaign', 'fails-now', 'quarantined'];
const TEST_RE = /\.(?:test|e2e)\.(?:js|mjs|cjs)$/;

function globToRe(glob) {
  return new RegExp('^' + glob.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*') + '$');
}
function matcher(pattern) {
  return pattern.includes('*') ? globToRe(pattern) : { test: file => file === pattern };
}

const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: repo, maxBuffer: 1 << 28 })
  .toString().split('\0').filter(Boolean);
const universe = tracked.filter(file => (TEST_RE.test(file) && !file.includes('node_modules/')) || /^tests\/test_[^/]+\.py$/.test(file)).sort();

// 실행기가 실제로 도는 파일: 자동 수집(tests/*.test.js, quarantined 제외) + 손으로 적은 명령의 파일 인자.
function runnerFiles() {
  const collected = collectTests({ includeQuarantined: false });
  const files = new Set(collected.tests.map(name => `tests/${name}`));
  for (const command of collected.requiredCommands) {
    if (command.args.includes('--check')) continue; // 문법 검사일 뿐 테스트 실행이 아님
    for (const arg of command.args) if (/\.(?:js|mjs|cjs)$/.test(arg) && !arg.startsWith('--')) files.add(arg);
  }
  return files;
}
const running = runnerFiles();

const elsewhereEntries = (inventory.elsewhere || []).flatMap(group => (group.match || []).map(match => ({ job: group.job, match })));
const notRunEntries = inventory.notRun || [];

// 항목마다 정규식을 한 번만 만들고, 파일별로 어느 항목이 가리키는지 미리 계산한다.
const notRunMatchers = notRunEntries.map(entry => ({ entry, re: matcher(entry.match) }));
const elsewhereMatchers = elsewhereEntries.map(entry => ({ entry, re: matcher(entry.match) }));
const notRunHits = new Map(universe.map(file => [file, notRunMatchers.filter(m => m.re.test(file)).map(m => m.entry)]));
const elsewhereHits = new Map(universe.map(file => [file, elsewhereMatchers.filter(m => m.re.test(file)).map(m => m.entry)]));

const HOW_TO = [
  '조치: 파일마다 맞는 칸에 넣으세요 (tests/test-inventory.json).',
  '  - 전체 테스트(tools/run-tests.js)에서 돌릴 것: tests/ 바로 아래 `이름.test.js`로 두면 자동으로 돌아 목록은 손대지 않아도 됩니다.',
  '    다른 확장자(.mjs/.cjs)면 tools/run-tests.js의 requiredCommands에 명령을 추가하세요(권장).',
  '  - 다른 워크플로·스크립트가 돌리는 것: elsewhere에 { "job": "<워크플로 또는 스크립트 경로>", "match": ["<파일 경로 또는 *가 든 패턴>"] }',
  '  - 일부러 안 돌리는 것: notRun에 { "match": "<파일 경로>", "reason": "pending|finished-campaign|fails-now|quarantined", "detail": "<사실 한 줄>" }',
].join('\n');

test('목록과 실행기: 목록에도 없고 돌지도 않는 테스트 파일이 없다', () => {
  const claimed = file => elsewhereHits.get(file).length > 0 || notRunHits.get(file).length > 0;
  const orphan = universe.filter(file => !running.has(file) && !claimed(file));
  assert.deepEqual(orphan, [],
    `테스트 목록(${INVENTORY})에 없고 전체 테스트에서도 돌지 않는 테스트 파일 ${orphan.length}개:\n` +
    orphan.slice(0, 40).map(file => `  - ${file}`).join('\n') + (orphan.length > 40 ? `\n  … 외 ${orphan.length - 40}개` : '') + `\n${HOW_TO}`);
});

test('목록 항목은 모두 저장소에 있는 파일을 가리킨다 (없으면 목록에서 지우세요)', () => {
  const missing = [];
  for (const { entry, re } of notRunMatchers) if (!universe.some(file => re.test(file))) missing.push(`notRun: ${entry.match}`);
  for (const { entry, re } of elsewhereMatchers) if (!universe.some(file => re.test(file))) missing.push(`elsewhere(${entry.job}): ${entry.match}`);
  assert.deepEqual(missing, [],
    `${INVENTORY}가 저장소에 없는 테스트 파일을 가리킵니다. 파일을 지우거나 옮겼다면 해당 항목도 지우세요:\n${missing.map(m => `  - ${m}`).join('\n')}`);
});

test('칸이 겹치지 않는다: 돌고 있는 파일을 notRun에 적거나, 한 파일을 notRun에 두 번 적지 않는다', () => {
  const wrongRun = [...running].filter(file => notRunHits.get(file)?.length).map(file => `${file} (notRun: ${notRunHits.get(file).map(e => e.match).join(', ')})`);
  assert.deepEqual(wrongRun, [],
    `이미 전체 테스트에서 도는 파일이 notRun에 적혀 있습니다(켰다면 notRun에서 지우세요):\n${wrongRun.map(m => `  - ${m}`).join('\n')}`);
  const wrongElsewhere = universe.filter(file => elsewhereHits.get(file).length && notRunHits.get(file).length);
  assert.deepEqual(wrongElsewhere, [],
    `다른 잡에서 도는 파일(elsewhere)이 notRun에도 적혀 있습니다. 한 칸에만 두세요:\n${wrongElsewhere.map(m => `  - ${m}`).join('\n')}`);
  const seen = new Map();
  const duplicated = [];
  for (const entry of notRunEntries) {
    if (seen.has(entry.match)) duplicated.push(entry.match);
    seen.set(entry.match, true);
  }
  const overlapping = universe.filter(file => notRunHits.get(file).length > 1);
  assert.deepEqual([...duplicated, ...overlapping], [], 'notRun에 같은 파일을 가리키는 항목이 둘 이상입니다(중복)');
});

test('notRun 항목마다 사실만 적은 이유가 있다', () => {
  const bad = [];
  for (const entry of notRunEntries) {
    if (!REASONS.includes(entry.reason)) bad.push(`${entry.match}: reason은 ${REASONS.join(' | ')} 중 하나여야 합니다 (현재: ${entry.reason})`);
    if (typeof entry.detail !== 'string' || entry.detail.trim().length < 5) bad.push(`${entry.match}: detail(사실 한 줄)이 없습니다`);
    if (entry.reason === 'fails-now' && !entry.local?.signature) bad.push(`${entry.match}: fails-now는 local.signature(실패 문구)가 필요합니다`);
  }
  assert.deepEqual(bad, [], `notRun 항목에 이유가 빠졌거나 형식이 틀립니다:\n${bad.map(m => `  - ${m}`).join('\n')}`);
});

test('elsewhere 항목: 잡 파일이 있고, 그 실행 줄(paths: 트리거 제외)이 경로·패턴을 실제로 언급한다', () => {
  const bad = [];
  for (const entry of elsewhereEntries) {
    const jobPath = path.join(repo, entry.job);
    if (!fs.existsSync(jobPath)) { bad.push(`${entry.job}: 잡 파일이 없습니다`); continue; }
    const text = fs.readFileSync(jobPath, 'utf8');
    // paths:/paths-ignore: 는 "언제 돌릴지"일 뿐 실행이 아니다. 워크플로(.yml)는 그 줄을 뺀 본문에서만 찾는다.
    const body = entry.job.endsWith('.yml') ? stripPathFilters(text) : text;
    if (!referencesEntry(body, entry.match)) {
      bad.push(`${entry.job}의 실행 줄에 ${entry.match}가 없습니다 (paths: 트리거에만 있거나, 옮겼거나 지운 경우입니다). 실제로 도는 정확한 경로로 고치거나 notRun으로 옮기세요`);
    }
  }
  assert.deepEqual(bad, [], bad.join('\n'));
});

test('elsewhere 확인 규칙 자체: paths:에만 있는 패턴·부분 문자열은 거짓으로 보고, 체크아웃 접두 경로는 실행으로 본다', () => {
  const yml = [
    'on:',
    '  push:',
    "    paths: ['archive/**', 'tests/*meta*']",
    '  pull_request:',
    '    paths:',
    "      - 'tests/*meta*'",
    "      - 'tests/only-in-paths.test.mjs'",
    '    branches: [main]',
    'jobs:',
    '  t:',
    '    steps:',
    '      - run: node --test tests/real.test.mjs apmath/tools/scene-smoke-semantic-calibration.test.mjs',
    '      - run: node --test verification/tests/prefixed.test.mjs',
    '      - run: node --test apmath/tools/g7-*.test.mjs',
  ].join('\n');
  const body = stripPathFilters(yml);
  assert.equal(referencesEntry(body, 'tests/*meta*'), false, 'paths:에만 있는 패턴은 실행이 아니다');
  assert.equal(referencesEntry(body, 'tests/only-in-paths.test.mjs'), false);
  assert.equal(referencesEntry(body, 'tests/real.test.mjs'), true);
  assert.equal(referencesEntry(body, 'tests/prefixed.test.mjs'), true, 'verification/ 같은 체크아웃 접두는 실행으로 인정');
  assert.equal(referencesEntry(body, 'calibration.test.mjs'), false, '다른 파일 이름의 끝부분은 부분 문자열 오탐');
  assert.equal(referencesEntry(body, 'apmath/tools/g7-*.test.mjs'), true);
  assert.equal(referencesEntry(body, 'apmath/tools/g8-*.test.mjs'), false);
  assert.equal(referencesEntry(yml, 'tests/*meta*'), true, '본문 전체로 보면 paths:에도 있어 구분 규칙이 필요하다');
});

test('실행기의 quarantined 목록은 notRun/elsewhere 중 한 곳에 적혀 있고, 자동 수집 규칙은 *.test.js 하나다', () => {
  const collected = collectTests({ includeQuarantined: false });
  const claimedQuarantine = [...collected.quarantined.keys()].map(name => `tests/${name}`)
    .filter(file => !(notRunHits.get(file)?.length) && !(elsewhereHits.get(file)?.length));
  assert.deepEqual(claimedQuarantine, [], `quarantined인데 목록에 없는 파일: ${claimedQuarantine.join(', ')}`);
  assert.deepEqual(inventory.run.auto, ['tests/*.test.js'], 'run.auto 규칙이 실행기의 수집 규칙과 달라졌습니다');
  const topLevelTests = fs.readdirSync(path.join(repo, 'tests')).filter(name => name.endsWith('.test.js'));
  const quarantinedNames = new Set(collected.quarantined.keys());
  const dropped = topLevelTests.filter(name => !collected.tests.includes(name) && !quarantinedNames.has(name));
  assert.deepEqual(dropped, [], `tests/ 바로 아래 *.test.js가 실행기에 수집되지 않았습니다: ${dropped.join(', ')}`);
});
