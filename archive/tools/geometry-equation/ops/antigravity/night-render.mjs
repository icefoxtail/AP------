// 밤샘 렌더: 이미 lint를 통과한 저장소 plan만 순서대로 그린다. 판단·plan 수정·게시는 하지 않는다.
// 끊겨도 같은 명령을 다시 돌리면 이어서 한다. 환경이 깨지면 실패를 쌓지 않고 바로 멈춘다(2026-11-22 의존성 소실로 807건이 헛돌았다).
// usage: node night-render.mjs [--limit <시험지 수>] [--queue <파일>] [--ref <브랜치>]
//   --queue <파일>: 한 줄에 plan 경로 하나(<시험지>_plans/qNN-problem.plan.json 꼴, --ref 안의 경로). 주면 그 plan만 그린다(문제 그림 큐, 2026-11-23).
//   --ref <브랜치>: plan을 읽을 브랜치. 기본은 아래 REF.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {RENDER_PLAN, renderEnv, withRenderLock} from './render-env.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const OUT = process.env.NIGHT_OUT || 'D:/AP-svg-factory/anti-out/_night';
const argValue = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : undefined; };
const REF = argValue('--ref') || 'origin/data/svg-plans-20261117';
const QUEUE = argValue('--queue');
const limit = argValue('--limit') ? Number(argValue('--limit')) : Infinity;

function environmentProblem() {
  for (const file of ['node_modules/playwright', 'python', 'NotoSansKR.ttf']) {
    if (!fs.existsSync(path.join(REPO, '.tmp/apmath-visual-engine/dependencies', file))) return `렌더 의존성 없음: ${file}`;
  }
  if (!fs.existsSync(RENDER_PLAN)) return '렌더 도구 없음: production/render-plan.mjs';
  return '';
}

function report() {
  const rows = [], drawings = new Map();
  for (const exam of fs.readdirSync(OUT, {withFileTypes: true})) {
    const summary = path.join(OUT, exam.name, 'out/run-summary.json');
    if (!exam.isDirectory() || !fs.existsSync(summary)) continue;
    for (const row of JSON.parse(fs.readFileSync(summary, 'utf8'))) {
      const bound = row.status === 'ARCHIVE_BOUND', svg = path.join(OUT, exam.name, 'out', `${row.item}-solution.svg`);
      const entry = {exam: exam.name, item: row.item, status: bound ? 'RENDERED' : 'FAILED', code: row.code || row.stage || '', svg: bound ? svg : ''};
      rows.push(entry);
      if (!bound || !fs.existsSync(svg)) continue;
      const shape = (fs.readFileSync(svg, 'utf8').match(/\s(d|points|cx|cy|x1|y1|x2|y2)="[^"]*"/g) || []).join('');
      const key = crypto.createHash('sha1').update(shape).digest('hex');
      const first = drawings.get(key);
      if (first) {
        for (const side of [first, entry]) { side.status = 'SAME_DRAWING'; side.code = '다른 문항과 도형이 같다: 게시 전 확인'; }
      } else drawings.set(key, entry);
    }
  }
  const line = row => [row.status, row.exam, row.item, row.code, row.svg].join('\t');
  fs.writeFileSync(path.join(OUT, 'RESULT.tsv'), rows.map(line).join('\n') + '\n');
  const count = {};
  for (const row of rows) count[row.status] = (count[row.status] || 0) + 1;
  return count;
}

function stop(reason) {
  fs.mkdirSync(OUT, {recursive: true});
  fs.writeFileSync(path.join(OUT, 'STOPPED.txt'), `${new Date().toISOString()} ${reason}\n`);
  console.log(`멈춤: ${reason}`);
  process.exit(2);
}

const broken = environmentProblem();
if (broken) stop(broken);
fs.mkdirSync(OUT, {recursive: true});
fs.rmSync(path.join(OUT, 'STOPPED.txt'), {force: true});

// 큐 모드: plan 경로 목록에서 시험지별 매니페스트를 만든다(이미 만든 시험지는 건너뛰므로 같은 NIGHT_OUT에 큐를 이어 돌려도 된다).
// 시험지 JS는 작업 트리의 archive/exams 아래에 있어야 한다. 문항 번호는 시험지 JS의 id로 찾는다(못 찾은 plan은 NOBANK.txt에 남기고 건너뛴다).
let queued = null;
function buildQueueManifests() {
  const lines = fs.readFileSync(QUEUE, 'utf8').split('\n').map(line => line.trim()).filter(Boolean);
  const byExam = new Map(), skipped = [];
  for (const line of lines) {
    const hit = line.match(/^(.*)_plans\/q(\d+)-problem\.plan\.json$/);
    if (!hit) { skipped.push(`${line}\t경로 형식 아님`); continue; }
    if (!byExam.has(hit[1])) byExam.set(hit[1], []);
    byExam.get(hit[1]).push({plan: line, qid: String(Number(hit[2])), dir: path.posix.basename(line).replace(/\.plan\.json$/, '')});
  }
  queued = new Set();
  for (const [stem, plans] of byExam) {
    const sourcePath = `${stem}.js`, key = sourcePath.replace(/^archive\/exams\//, '').replace(/\.js$/, '').replace(/\//g, '__');
    queued.add(key);
    const dir = path.join(OUT, key);
    if (fs.existsSync(path.join(dir, 'pk.manifest.json'))) continue;
    let bank;
    try {
      const context = {window: {}};
      vm.runInNewContext(fs.readFileSync(path.join(REPO, sourcePath), 'utf8'), context, {timeout: 10000});
      bank = context.window.questionBank || context.questionBank;
    } catch { bank = null; }
    if (!Array.isArray(bank)) { for (const p of plans) skipped.push(`${p.plan}\t시험지 JS를 읽을 수 없다: ${sourcePath}`); continue; }
    const items = [];
    for (const p of plans) {
      const index = bank.findIndex((row, i) => String(row.id ?? i + 1) === p.qid) + 1;
      if (!index) { skipped.push(`${p.plan}\t시험지에 q${p.qid}가 없다`); continue; }
      const shown = spawnSync('git', ['show', `${REF}:${p.plan}`], {cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26});
      if (shown.status !== 0) { skipped.push(`${p.plan}\t${REF}에서 plan을 못 읽었다`); continue; }
      fs.mkdirSync(path.join(dir, 'pk', p.dir), {recursive: true});
      fs.writeFileSync(path.join(dir, 'pk', p.dir, 'plan.json'), shown.stdout);
      items.push({dir: p.dir, sourcePath, ordinal: index});
    }
    if (items.length) fs.writeFileSync(path.join(dir, 'pk.manifest.json'), JSON.stringify({items}, null, 1));
  }
  if (skipped.length) fs.writeFileSync(path.join(OUT, 'NOBANK.txt'), skipped.join('\n') + '\n');
  console.log(`큐 시험지 ${byExam.size}개, plan ${lines.length}개, 건너뜀 ${skipped.length}`);
}

if (QUEUE) buildQueueManifests();
else if (!fs.existsSync(path.join(OUT, 'EXAMS.tsv'))) {
  const made = spawnSync(process.execPath, [path.join(HERE, 'make-manifests.cjs'), REF, OUT, path.join(HERE, 'night-queue.txt')], {cwd: REPO, encoding: 'utf8'});
  if (made.status !== 0) stop(`대기열을 못 만들었다: ${made.stderr.trim().slice(0, 400)}`);
  console.log(made.stdout.trim());
}

// 최신 연도부터.
const year = name => Number((name.split('__').pop().match(/^(\d\d)_/) || [0, 0])[1]);
const exams = fs.readdirSync(OUT).filter(name => (!queued || queued.has(name)) && fs.existsSync(path.join(OUT, name, 'pk.manifest.json')))
  .sort((a, b) => year(b) - year(a) || a.localeCompare(b, 'ko'));
const todo = exams.filter(name => !fs.existsSync(path.join(OUT, name, 'out/run-summary.json'))).slice(0, limit);
console.log(`남은 시험지 ${todo.length}/${exams.length}`);

let silent = 0;
for (const [index, exam] of todo.entries()) {
  const lost = environmentProblem();
  if (lost) { report(); stop(lost); }
  const dir = path.join(OUT, exam);
  const run = withRenderLock(() => spawnSync(process.execPath, [RENDER_PLAN, '--manifest', path.join(dir, 'pk'), '--out', path.join(dir, 'out')],
    {cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26, env: renderEnv()}));
  const log = `${run.stdout || ''}${run.stderr || ''}`;
  fs.writeFileSync(path.join(dir, 'render.log'), log);
  const summary = path.join(dir, 'out/run-summary.json');
  if (/Cannot find module|ENOENT[^\n]*dependencies/.test(log)) {
    fs.rmSync(summary, {force: true});
    report();
    stop(`환경 오류(${exam}). 실패로 세지 않았다.`);
  }
  silent = fs.existsSync(summary) ? 0 : silent + 1;
  console.log(`[${index + 1}/${todo.length}] ${exam} ${JSON.stringify(report())}`);
  if (silent >= 3) stop('시험지 3개가 연속으로 결과를 남기지 못했다.');
}
console.log(`끝: ${JSON.stringify(report())} -> ${path.join(OUT, 'RESULT.tsv')} (게시 가능 아님: 눈 검수 전)`);
