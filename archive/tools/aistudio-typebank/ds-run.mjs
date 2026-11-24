// DeepSeek(opencode-go/deepseek-v4.1-flash) 한 번 호출. 동시에 하나만(호출자가 순서대로 부른다).
// 방식은 archive/tools/geometry-equation/ops/claude-batch/ds-triage-exam.sh 와 같다: 저장소 밖 빈 작업 폴더, 지시는 표준입력,
// 시작(init)에서 150초 안에 출력이 없으면 그 실행만 종료하고 최대 3번 재시도. 한도에 걸리면 LIMIT 으로 알린다(호출자가 기다렸다 재개한다; 다른 모델이 대신 쓰지 않는다).
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const DS_MODEL = process.env.DS_MODEL || 'opencode-go/deepseek-v4.1-flash';
const CWD_BASE = process.env.DS_CWD_BASE || 'C:/Users/USER/ds-typebank-cwd';
const LIMIT_RE = /rate.?limit|usage limit|quota|too many requests|status.?429|limit (reached|exceeded)/i;
const stripAnsi = s => s.replace(/\x1b\[[0-9;]*m/g, '');
const sleep = ms => new Promise(r => setTimeout(r, ms));

// DeepSeek 공용 슬롯(워크스페이스 동시 한도): 다른 라인과 나눠 쓴다. 모듈이 없으면(다른 PC) 슬롯 없이 부른다.
const SLOTS_MODULE = process.env.DS_SLOTS_MODULE || 'D:/AP-svg-factory/labor/ds/dsslots.mjs';
let slotsPromise = null;
const slots = () => (slotsPromise ||= (fs.existsSync(SLOTS_MODULE) ? import(pathToFileURL(SLOTS_MODULE).href).catch(() => null) : Promise.resolve(null)));

function killTree(child) {
  try { execFileSync('taskkill', ['/F', '/T', '/PID', String(child.pid)], { stdio: 'ignore' }); } catch { try { child.kill(); } catch { /* 이미 끝남 */ } }
}

// DS_MODEL=agy:gemini-3.8-flash 이면 Antigravity CLI(Gemini)로 부른다(DeepSeek 월 한도 소진 대비).
// 지시는 파일로 두고 절대경로를 적어 agy가 직접 열게 한다(명령줄 길이 한도). 결과 파일도 지시대로 agy가 쓴다.
const AGY = process.env.AGY_BIN || 'C:/Users/USER/AppData/Local/agy/bin/agy';
const AGY_CWD = process.env.AGY_CWD || 'C:/AI_WS/tmp/luna-cwd';
const AGY_LIMIT_RE = /RESOURCE_EXHAUSTED|status.?429|Individual quota|rate.?limit/i;
async function runAgy(promptText, logFile, { timeoutMs = 30 * 60 * 1000, tries = 3 } = {}) {
  fs.mkdirSync(CWD_BASE, { recursive: true }); fs.mkdirSync(AGY_CWD, { recursive: true });
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  const pf = path.join(CWD_BASE, `agy-prompt-${process.pid}-${Date.now()}.md`).replace(/\\/g, '/');
  fs.writeFileSync(pf, promptText, 'utf8');
  const model = DS_MODEL.slice(4);
  const p = `다음 지시 파일을 직접 열어 읽고 그 지시를 그대로 따른다: ${pf}\n지시 파일이 정한 절대경로에 결과 파일을 쓰고, 지시에 있는 검사 명령이 있으면 그대로 실행해 통과시킨다. 다른 파일은 고치지 않는다.`;
  try {
    for (let t = 1; t <= tries; t++) {
      let out = '';
      const child = spawn(AGY, ['-p', p, '--model', model, '--effort', process.env.AGY_EFFORT || 'high'], { cwd: AGY_CWD, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
      child.stdout.on('data', d => { out += d; }); child.stderr.on('data', d => { out += d; });
      const result = await new Promise(resolve => {
        const timer = setTimeout(() => { killTree(child); resolve({ timeout: true }); }, timeoutMs);
        child.on('error', e => { clearTimeout(timer); resolve({ code: -2, err: String(e) }); });
        child.on('close', code => { clearTimeout(timer); resolve({ code }); });
      });
      const text = stripAnsi(out);
      fs.appendFileSync(logFile, `\n=== agy try ${t} ${new Date().toISOString()} ===\n${text.slice(-20000)}\nexit ${JSON.stringify(result)}\n`);
      if (/empty conversation id/i.test(text)) { await sleep(5 * 60 * 1000); t--; continue; }
      if (AGY_LIMIT_RE.test(text.slice(-3000))) return { status: 'LIMIT', log: text };
      if (result.code === 0) return { status: 'OK', log: text };
      await sleep(5000);
    }
    return { status: 'FAIL', log: 'agy failed 3 times' };
  } finally { try { fs.rmSync(pf, { force: true }); } catch { /* 무시 */ } }
}

/** @returns {Promise<{status:'OK'|'LIMIT'|'FAIL', log:string}>} */
export async function runDeepSeek(promptText, logFile, { timeoutMs = 25 * 60 * 1000, tries = 3 } = {}) {
  if (DS_MODEL.startsWith('agy:')) return runAgy(promptText, logFile, { tries });
  if (DS_MODEL === 'manual') {
    // 사람/다른 에이전트가 처리: 지시를 파일로 내놓고 <req>.done 이 생길 때까지 기다린다(지시대로 결과 파일을 쓴 뒤 .done 을 만든다).
    const dir = process.env.DS_MANUAL_DIR || 'C:/AI_WS/tmp/typebank/intake/manual';
    fs.mkdirSync(dir, { recursive: true });
    const req = path.join(dir, `req-${process.pid}-${Date.now()}.md`);
    fs.writeFileSync(req, promptText, 'utf8');
    while (!fs.existsSync(req + '.done')) await sleep(20000);
    fs.appendFileSync(logFile, `\n=== manual ${req} done ${new Date().toISOString()} ===\n`);
    return { status: 'OK', log: 'manual' };
  }
  fs.mkdirSync(CWD_BASE, { recursive: true });
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  for (let t = 1; t <= tries; t++) {
    const cwd = fs.mkdtempSync(path.join(CWD_BASE, 'run-'));
    let out = '';
    const child = spawn('opencode', ['run', '--standalone', '--auto', '-m', DS_MODEL], { cwd, shell: true, stdio: ['pipe', 'pipe', 'pipe'] });
    child.stdout.on('data', d => { out += d; });
    child.stderr.on('data', d => { out += d; });
    child.stdin.end(promptText);
    const started = Date.now();
    const result = await new Promise(resolve => {
      let done = false;
      const finish = v => { if (!done) { done = true; clearInterval(tick); resolve(v); } };
      child.on('exit', code => finish({ code }));
      const tick = setInterval(() => {
        const age = Date.now() - started;
        if (!out.length && age > 150 * 1000) { killTree(child); finish({ stuck: true }); }
        else if (age > timeoutMs) { killTree(child); finish({ timeout: true }); }
      }, 2000);
    });
    fs.appendFileSync(logFile, `\n=== try ${t} ${new Date().toISOString()} ===\n${stripAnsi(out)}\nexit ${JSON.stringify(result)}\n`);
    try { fs.rmSync(cwd, { recursive: true, force: true }); } catch { /* 무시 */ }
    if (result.stuck) { await sleep(2000); continue; }
    const text = stripAnsi(out);
    if (LIMIT_RE.test(text.slice(-3000))) return { status: 'LIMIT', log: text };
    return { status: result.code === 0 ? 'OK' : 'FAIL', log: text };
  }
  return { status: 'FAIL', log: 'stuck at init 3 times' };
}

/** 한도에 걸리면 intervalMs 마다 같은 호출을 다시 해 본다(maxWaitMs 까지). */
export async function runDeepSeekWaiting(promptText, logFile, { intervalMs = 15 * 60 * 1000, maxWaitMs = 8 * 3600 * 1000, onWait = () => {} } = {}) {
  const t0 = Date.now();
  const sl = DS_MODEL.startsWith('agy:') || DS_MODEL === 'manual' ? null : await slots(); // agy는 DeepSeek 공용 슬롯을 쓰지 않는다
  for (;;) {
    // 슬롯은 호출 한 번 동안만 쥔다(한도 대기 중에는 놓는다).
    const slot = sl ? await sl.acquire() : null;
    let r;
    try { r = await runDeepSeek(promptText, logFile); } finally { if (slot) sl.release(slot); }
    if (r.status !== 'LIMIT') return r;
    if (Date.now() - t0 > maxWaitMs) return r;
    onWait(Math.round((Date.now() - t0) / 60000));
    await sleep(intervalMs);
  }
}
