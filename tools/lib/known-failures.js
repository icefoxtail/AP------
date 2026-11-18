'use strict';
// KNOWN-FAIL: 알려진 실패를 "파일"이 아니라 "실패의 서명"으로 적어 두고, 기준을
// "초록"이 아니라 "알려진 실패 목록과 정확히 일치"로 삼는다.
//  - 서명 = 테스트 파일 + (가능하면) 테스트 이름 + 오류 문구 패턴. 다른 이름/문구의 실패는 빨강.
//  - 알려진 실패가 재현되지 않으면(사라지면) 빨강: 목록에서 지워야 한다.
//  - 첫 실패에서 멈추는 테스트는 항목에 stopsAtFirstFailure:true 로 적어 "뒤는 미확인"을 드러낸다.
// 목록은 격리가 아니다: 해당 테스트는 매번 돌고, 결과를 목록과 정확히 대조한다.
// 판정 코드는 이 한 곳에 있고, 전체 실행(tools/run-tests.js)과 범위 실행(tools/ci/run-scoped-tests.mjs)이 같이 쓴다.
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REQUIRED_TEXT_FIELDS = ['file', 'pattern', 'repair', 'cause', 'resolvedWhen'];
const LIST_FILE = 'tests/known-failures.json';

function loadKnownFailures(root, file = LIST_FILE) {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

// 실행기가 실제로 돌리는 테스트 파일(슬래시 구분). 문법 검사(--check)만 하는 명령은 뺀다.
function runnableFiles({ tests, requiredCommands }) {
  const files = new Set(tests.map(name => `tests/${name}`));
  for (const command of requiredCommands) {
    if (command.args.includes('--check')) continue;
    for (const arg of command.args) if (/\.(?:js|mjs|cjs)$/.test(arg)) files.add(arg);
  }
  return files;
}

// 항목이 가리키는 테스트 이름들(testName 하나 또는 testNames 여러 개).
function entryNames(entry) {
  if (Array.isArray(entry.testNames)) return entry.testNames;
  return entry.testName ? [entry.testName] : [];
}

// 항목 하나를 한 줄로 (요약 출력과 오류 문구에 쓴다).
function describeEntry(entry) {
  const names = entryNames(entry);
  const label = names.length === 0 ? ' (파일 전체)' : names.length === 1 ? ` :: ${names[0]}` : ` :: ${names.length}개 테스트`;
  return `${entry.file}${label} [수리 ${entry.repair}]`;
}

const indentOf = line => /^(\s*)/.exec(line)[1].length;

// node:test 출력에서 실패한 테스트 이름(말단만)과, 이름별 실패 상세(오류 문구가 든 블록)를 읽는다.
//  - tap: `not ok N - 이름` 줄 아래의 더 깊게 들여쓴 줄들이 그 테스트의 상세(error: ...)다.
//  - spec: 끝의 `✖ failing tests:` 요약에서 `✖ 이름` 줄 아래 들여쓴 줄들이 상세다.
// 파일 경로 자체(node --test 가 붙이는 파일 단위 줄)는 이름으로 치지 않는다.
function parseFailures(output) {
  const full = String(output).replace(/\r\n/g, '\n');
  const marker = full.search(/^✖ failing tests:/m);
  const body = marker === -1 ? full : full.slice(0, marker);
  const summary = marker === -1 ? '' : full.slice(marker);
  const nameRe = /^(\s*)(?:not ok \d+ - |✖ )(.+?)(?:\s+\((?:\d+(?:\.\d+)?)ms\))?(?:\s+#.*)?\s*$/;
  const blocks = new Map();
  const addBlock = (name, text) => blocks.set(name, `${blocks.get(name) || ''}\n${text}`);
  const found = [];
  const collect = (text, fromSummary) => {
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      const m = nameRe.exec(line);
      if (!m) return;
      const name = m[2].trim();
      if (/\.(?:c|m)?js$/.test(name) || name === 'failing tests:') return;
      const k = m[1].length;
      const detail = [];
      for (let j = i + 1; j < lines.length; j += 1) {
        const next = lines[j];
        if (next.trim() && indentOf(next) <= k) break;
        detail.push(next);
      }
      addBlock(name, detail.join('\n'));
      if (!fromSummary) found.push({ indent: k, name });
    });
  };
  collect(body, false);
  collect(summary, true);
  const names = [];
  found.forEach((item, i) => {
    // node:test 는 자식 줄을 먼저 찍고 부모(묶음) 줄을 나중에 찍는다(spec·tap 공통).
    // 바로 앞의 실패 줄이 더 깊으면 이 줄은 묶음이라 말단이 아니다.
    const prev = found[i - 1];
    if (!(prev && prev.indent > item.indent)) names.push(item.name);
  });
  return { names, blocks };
}

function parseFailingNames(output) {
  return parseFailures(output).names;
}

function compilePattern(entry) {
  try { return new RegExp(entry.pattern, 'm'); } catch { return null; }
}

// 목록 자체 검사. 문제 문구의 배열을 돌려준다(빈 배열이면 정상).
//  runnable: 실행기가 실제로 돌리는 테스트 파일 경로(슬래시 구분)의 Set
function validateKnownFailures(doc, { root, runnable }) {
  const problems = [];
  if (!doc || doc.schema !== 'known-failures-v1') problems.push('schema는 "known-failures-v1" 이어야 합니다');
  const entries = doc?.entries;
  if (!Array.isArray(entries)) { problems.push('entries 배열이 없습니다'); return problems; }
  const seen = new Set();
  entries.forEach((entry, i) => {
    const where = `entries[${i}]${entry && entry.file ? ` (${entry.file})` : ''}`;
    if (!entry || typeof entry !== 'object') { problems.push(`${where}: 객체가 아닙니다`); return; }
    for (const field of REQUIRED_TEXT_FIELDS) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) problems.push(`${where}: ${field}가 비었습니다 (서명 없는 항목은 둘 수 없습니다)`);
    }
    if (entry.testName !== undefined && entry.testNames !== undefined) problems.push(`${where}: testName과 testNames는 함께 쓸 수 없습니다`);
    if (entry.testName !== undefined && (typeof entry.testName !== 'string' || !entry.testName.trim())) problems.push(`${where}: testName은 비어 있지 않은 문자열이어야 합니다`);
    if (entry.testNames !== undefined) {
      const ok = Array.isArray(entry.testNames) && entry.testNames.length > 0
        && entry.testNames.every(name => typeof name === 'string' && name.trim()) && new Set(entry.testNames).size === entry.testNames.length;
      if (!ok) problems.push(`${where}: testNames는 비어 있지 않고 중복 없는 문자열 배열이어야 합니다`);
    }
    if (entry.stopsAtFirstFailure !== undefined && typeof entry.stopsAtFirstFailure !== 'boolean') problems.push(`${where}: stopsAtFirstFailure는 true/false 여야 합니다`);
    if (typeof entry.pattern === 'string' && entry.pattern.trim() && !compilePattern(entry)) problems.push(`${where}: pattern이 올바른 정규식이 아닙니다`);
    if (typeof entry.file === 'string' && entry.file.trim()) {
      if (!fs.existsSync(path.join(root, entry.file))) problems.push(`${where}: 저장소에 없는 테스트 파일을 가리킵니다`);
      else if (!runnable.has(entry.file)) problems.push(`${where}: 전체 테스트가 돌리지 않는 파일입니다(격리 목록·다른 잡의 테스트는 대상이 아님)`);
      const names = entryNames(entry);
      // 이름이 있는 항목은 (파일, 이름) 하나에 항목 하나, 이름이 없는 항목은 (파일, 문구) 하나에 항목 하나.
      const keys = names.length ? names.map(name => `${entry.file}\0name\0${name}`) : [`${entry.file}\0pattern\0${entry.pattern}`];
      for (const key of keys) {
        if (seen.has(key)) problems.push(`${where}: 같은 파일·같은 ${names.length ? '테스트 이름' : '문구'}의 항목이 이미 있습니다(중복)`);
        seen.add(key);
      }
    }
  });
  return problems;
}

// 한 명령(테스트 파일)의 실행 결과를 목록과 대조한다.
//  entries: 이 명령을 가리키는 항목들
//  ok: 종료 코드 0   output: 표준 출력+오류
//  abnormal: 시간 초과·출력 버퍼 초과·신호 종료 같은 비정상 종료의 한 줄 사유(없으면 null)
// 비정상 종료는 항목 유무와 무관하게 무조건 FAIL이다. 서명 문구가 이미 찍힌 뒤에 멈췄더라도 그 뒤에 무엇이 가려졌는지
// 알 수 없으므로 알려진 상태가 될 수 없다(원래 실행기도 이 경우를 무조건 실패로 셌다).
// 돌려주는 verdict: 'pass' | 'fail' | 'known'
function classifyRun({ entries, ok, abnormal = null, output = '' }) {
  if (abnormal) return { verdict: 'fail', reproduced: [], problems: [`${abnormal} — 알려진 실패로 보지 않음`] };
  if (ok) {
    if (!entries.length) return { verdict: 'pass', problems: [], reproduced: [] };
    return {
      verdict: 'fail', reproduced: [],
      problems: entries.map(e => `예상된 실패가 재현되지 않음 — tests/known-failures.json에서 이 항목을 삭제하세요: ${describeEntry(e)}`),
    };
  }
  if (!entries.length) return { verdict: 'fail', problems: [], reproduced: [] };
  const text = String(output);
  const { names, blocks } = parseFailures(text);
  const problems = [];
  const reproduced = [];
  const notReproduced = entry => problems.push(`예상된 실패가 재현되지 않음(다른 문구이거나 사라짐) — 항목을 고치거나 삭제하세요: ${describeEntry(entry)}`);
  for (const entry of entries) {
    const re = compilePattern(entry);
    const declared = entryNames(entry);
    if (!re) { notReproduced(entry); continue; }
    if (names.length) {
      if (!declared.length) {
        problems.push(`${describeEntry(entry)}: 이 파일은 실패한 테스트 이름(${names.join(', ')})이 출력됩니다. 항목에 testName(s)을 적어 서명을 좁히세요`);
      } else if (declared.every(name => names.includes(name) && re.test(blocks.get(name) || ''))) reproduced.push(entry);
      else notReproduced(entry);
    } else if (!declared.length && re.test(text)) reproduced.push(entry);
    else notReproduced(entry);
  }
  const covered = new Set(reproduced.flatMap(entryNames));
  for (const name of names.filter(n => !covered.has(n))) problems.push(`목록에 없는 실패: "${name}" — 새로 생긴 실패이거나 문구가 달라졌습니다`);
  if (!reproduced.length && !problems.length) problems.push('실패했지만 목록의 서명과 맞지 않습니다');
  return { verdict: problems.length ? 'fail' : 'known', problems, reproduced };
}

// 비정상 종료의 사유. spawn 결과의 error(ETIMEDOUT·ENOBUFS 등)나 signal이 있으면 정상 실패가 아니다.
function abnormalReason(run) {
  if (run.error) {
    const code = run.error.code || run.error.message;
    if (code === 'ETIMEDOUT') return '시간 초과';
    if (code === 'ENOBUFS') return '출력 버퍼 초과';
    return `실행 오류(${code})`;
  }
  if (run.signal) return `신호 종료(${run.signal})`;
  return null;
}

// 자식 테스트에 부모의 node:test 문맥(NODE_TEST_CONTEXT)이 새지 않게 한다. 실행기가 node --test 안에서 불리는 일은 없지만,
// 불리면 자식 node가 부모의 보고 채널로 출력해 stdout을 붙잡을 수 없게 된다. 변수가 없으면 env 옵션을 아예 넘기지 않는다.
function childEnvOption() {
  if (process.env.NODE_TEST_CONTEXT === undefined) return {};
  const env = { ...process.env };
  delete env.NODE_TEST_CONTEXT;
  return { env };
}

// 명령 하나를 돌린다. 이 명령을 가리키는 항목이 없으면 예전과 똑같이 stdio를 그대로 넘겨 실행하고,
// 있으면 출력을 붙잡아 서명과 대조한 뒤 그대로 다시 내보낸다.
//  item: { args, timeout, files }  → { ok, run, verdict }  (verdict는 항목이 있을 때만)
function runCommand({ root, item, entries, spawn = spawnSync, stdout = process.stdout, stderr = process.stderr }) {
  const itemEntries = entries.filter(entry => item.files.includes(entry.file));
  const options = { cwd: root, timeout: item.timeout, ...childEnvOption() };
  if (!itemEntries.length) {
    const run = spawn(process.execPath, item.args, { ...options, stdio: 'inherit' });
    return { ok: run.status === 0, run, verdict: null };
  }
  const run = spawn(process.execPath, item.args, { ...options, encoding: 'utf8', stdio: ['inherit', 'pipe', 'pipe'], maxBuffer: 1 << 28 });
  stdout.write(run.stdout || '');
  stderr.write(run.stderr || '');
  const ok = run.status === 0;
  return { ok, run, verdict: classifyRun({ entries: itemEntries, ok, abnormal: abnormalReason(run), output: `${run.stdout || ''}${run.stderr || ''}` }) };
}

// 전체 실행 계획을 순서대로 돌린다.
//  plan: [{ failedName, shownName, args, timeout, files, quarantined }]
//  quarantined 항목은 기존 격리 동작(실패해도 막지 않고, 통과하면 FIXED 안내)을 그대로 따른다.
function runPlan({ root, plan, entries = [], spawn = spawnSync, stdout = process.stdout, stderr = process.stderr, error = console.error }) {
  const result = { passed: 0, failed: [], knownFailed: [], fixedKnown: [], knownMatched: [], problemLines: [] };
  for (const item of plan) {
    const { ok, verdict } = runCommand({ root, item, entries, spawn, stdout, stderr });
    if (verdict) {
      if (verdict.verdict === 'known') { result.knownMatched.push({ item, entries: verdict.reproduced }); continue; }
      result.failed.push(item.failedName);
      error(`Test failed: ${item.shownName}`);
      for (const problem of verdict.problems) { result.problemLines.push(problem); error(`  KNOWN-FAIL 대조 실패: ${problem}`); }
      continue;
    }
    if (ok) {
      result.passed += 1;
      if (item.quarantined) result.fixedKnown.push(item.failedName);
      continue;
    }
    if (item.quarantined) result.knownFailed.push(item.failedName);
    else {
      result.failed.push(item.failedName);
      error(`Test failed: ${item.shownName}`);
    }
  }
  return result;
}

// 매 실행 요약에 붙이는 목록 출력(건수·항목). 항목이 0이어도 한 줄은 나온다.
function formatKnownFailureSummary(entries, matched = []) {
  const lines = [`KNOWN-FAIL 목록 (${LIST_FILE}): ${entries.length}건`];
  for (const entry of entries) {
    const hit = matched.some(m => m.entries.includes(entry)) ? '재현됨' : '이번 실행에서 안 돎';
    lines.push(`  KNOWN ${describeEntry(entry)} - ${hit}; 원인: ${entry.cause}; 해결 조건: ${entry.resolvedWhen}` +
      (entry.stopsAtFirstFailure ? ' (첫 실패에서 중단 — 뒤는 미확인)' : ''));
  }
  return lines;
}

module.exports = {
  runnableFiles, runCommand, abnormalReason, runPlan, formatKnownFailureSummary, LIST_FILE, loadKnownFailures,
  validateKnownFailures, classifyRun, parseFailures, parseFailingNames, describeEntry, entryNames,
};
