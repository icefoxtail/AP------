// 밤샘 렌더: 이미 lint를 통과한 저장소 plan만 순서대로 그린다. 판단·plan 수정·게시는 하지 않는다.
// 끊겨도 같은 명령을 다시 돌리면 이어서 한다. 환경이 깨지면 실패를 쌓지 않고 바로 멈춘다(2026-11-22 의존성 소실로 807건이 헛돌았다).
// usage: node night-render.mjs [--limit <시험지 수>]
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const OUT = process.env.NIGHT_OUT || 'D:/AP-svg-factory/anti-out/_night';
const REF = 'origin/data/svg-plans-20261117';
const at = process.argv.indexOf('--limit');
const limit = at > 0 ? Number(process.argv[at + 1]) : Infinity;

function environmentProblem() {
  for (const file of ['node_modules/playwright', 'python', 'NotoSansKR.ttf']) {
    if (!fs.existsSync(path.join(REPO, '.tmp/apmath-visual-engine/dependencies', file))) return `렌더 의존성 없음: ${file}`;
  }
  if (!fs.existsSync(path.join(REPO, '.tmp/work/render.mjs'))) return '렌더 도구 없음: .tmp/work/render.mjs';
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

if (!fs.existsSync(path.join(OUT, 'EXAMS.tsv'))) {
  const made = spawnSync(process.execPath, [path.join(HERE, 'make-manifests.cjs'), REF, OUT, path.join(HERE, 'night-queue.txt')], {cwd: REPO, encoding: 'utf8'});
  if (made.status !== 0) stop(`대기열을 못 만들었다: ${made.stderr.trim().slice(0, 400)}`);
  console.log(made.stdout.trim());
}

// 최신 연도부터.
const year = name => Number((name.split('__').pop().match(/^(\d\d)_/) || [0, 0])[1]);
const exams = fs.readdirSync(OUT).filter(name => fs.existsSync(path.join(OUT, name, 'pk.manifest.json')))
  .sort((a, b) => year(b) - year(a) || a.localeCompare(b, 'ko'));
const todo = exams.filter(name => !fs.existsSync(path.join(OUT, name, 'out/run-summary.json'))).slice(0, limit);
console.log(`남은 시험지 ${todo.length}/${exams.length}`);

let silent = 0;
for (const [index, exam] of todo.entries()) {
  const lost = environmentProblem();
  if (lost) { report(); stop(lost); }
  const dir = path.join(OUT, exam);
  const run = spawnSync(process.execPath, [path.join(REPO, '.tmp/work/render.mjs'), '--manifest', path.join(dir, 'pk'), '--out', path.join(dir, 'out')],
    {cwd: REPO, encoding: 'utf8', maxBuffer: 1 << 26, env: {...process.env, RENDER_SLOTS: '1'}});
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
