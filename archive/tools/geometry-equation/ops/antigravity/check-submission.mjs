// 안티그래비티 제출 검사. 확인할 값은 작업자가 아니라 TASKS.json(메인)이 정한다. 작업자의 관찰문은 증거로 치지 않는다.
// 잡는 것: 정답 불일치, 빠진 값, 문제 그림의 정답 노출, 발문에 없는 이름, 원 밖의 "원 위" 점, 겹친 이름 점, 동일 도형, lint, 무단 렌더.
// 못 잡는 것: 그림 전체의 뜻. PASS는 제출 가능일 뿐이고 메인이 따로 본다.
// usage: node check-submission.mjs show|check <task> [key]
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, '../../../../..');
const LINT = path.join(REPO, 'archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs');
const LABEL_KEYS = new Set(['label', 'labels', 'text', 'name', 'names', 'math', 'pointNames', 'expressionLabels', 'scalarLabels', 'lineNames']);
const PROSE_KEYS = new Set(['caption', 'sourceConditions', 'newVisualInformation', 'sourceQuote', 'accessibilityDescription']);

const compact = value => String(value ?? '').replace(/\s+/g, '');
const plain = value => String(value ?? '').replace(/\\(?:mathrm|text|rm|overline|angle|triangle|left|right)\b/g, ' ').replace(/_\{?([0-9]+)\}?/g, '$1').replace(/[{}$]/g, ' ');
const escape = value => String(value).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
export function hasToken(text, token) {
  const edge = /^[0-9]/.test(token) ? ['(?<![0-9.])', '(?![0-9]|\\.[0-9])'] : /^[A-Za-z]/.test(token) ? ['(?<![A-Za-z])', '(?![A-Za-z0-9])'] : ['', ''];
  return new RegExp(edge[0] + escape(token) + edge[1]).test(text);
}

// 점 이름 한 글자는 AB, ABC 안에서도 이름이다. 원점 O는 발문에 없어도 쓴다.
export function namedInSource(source, name) {
  if (name === 'O') return true;
  if (/^[A-Z]$/.test(name)) return new RegExp(`(?<![a-z])${name}(?![a-z0-9])`).test(source);
  return hasToken(source, name);
}

// 학생에게 보이는 글만 모은다: 라벨 칸과, 숨기지 않은 점 이름.
export function shownPointNames(plan) {
  const out = [];
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node.displayPoints)) {
      const hidden = new Set([...(node.hiddenPointNames || []), ...(node.unmarkedPointNames || [])]);
      for (const id of node.displayPoints) {
        if (typeof id === 'string' && !hidden.has(id)) out.push(node.pointNames?.[id] ?? id);
      }
    }
    for (const value of Object.values(node)) walk(value);
  };
  walk(plan);
  return out;
}
export function shownText(plan) {
  const out = [...shownPointNames(plan)];
  const collect = value => {
    if (typeof value === 'string' || typeof value === 'number') out.push(String(value));
    else if (value && typeof value === 'object') Object.values(value).forEach(collect);
  };
  const walk = node => {
    if (!node || typeof node !== 'object') return;
    for (const [key, value] of Object.entries(node)) {
      if (PROSE_KEYS.has(key)) continue;
      if (LABEL_KEYS.has(key)) collect(value); else walk(value);
    }
  };
  walk(plan);
  return out.join(' \n ');
}

const num = arg => {
  if (arg?.kind !== 'integer' && arg?.kind !== 'rational') return null;
  const [n, d = '1'] = String(arg.value ?? '').split('/');
  return arg.value !== undefined && Number.isFinite(n / d) ? n / d : null;
};
// 정수·분수로 바로 계산되는 작도만 본다. 계산하지 못하는 점은 판정하지 않는다.
export function geometryErrors(plan) {
  const nodes = plan?.mathPlan?.nodes;
  if (!Array.isArray(nodes)) return [];
  const at = new Map(), circles = new Map();
  for (const {id, op, inputs = [], args = {}} of nodes) {
    const a = at.get(inputs[0]), b = at.get(inputs[1]);
    if (op === 'SOURCE_POINT') {
      const x = num(args.coordinates?.[0]), y = num(args.coordinates?.[1]);
      if (x !== null && y !== null) at.set(id, [x, y]);
    } else if (op === 'TRANSLATE_POINT' && a) {
      const x = num(args.dx), y = num(args.dy);
      if (x !== null && y !== null) at.set(id, [a[0] + x, a[1] + y]);
    } else if (op === 'MIDPOINT' && a && b) {
      at.set(id, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    } else if (op === 'POLAR_POINT' && a && b) {
      const r = num(args.length), deg = num(args.angleDeg);
      if (r === null || deg === null) continue;
      const turn = Math.atan2(b[1] - a[1], b[0] - a[0]) + (args.turn === 'CW' ? -1 : 1) * deg * Math.PI / 180;
      at.set(id, [a[0] + r * Math.cos(turn), a[1] + r * Math.sin(turn)]);
    } else if (op === 'CIRCLE_CENTER_RADIUS' && a) {
      const r = num(args.radius);
      if (r !== null) circles.set(id, [a, r]);
    }
  }
  const errors = [], gap = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  for (const fact of plan.planeMarks?.facts || []) {
    const ring = fact.kind === 'ON_CIRCLE' && circles.get(fact.circle);
    if (!ring) continue;
    for (const id of fact.points || []) {
      if (at.has(id) && Math.abs(gap(at.get(id), ring[0]) - ring[1]) > 1e-6) errors.push(`원 위라고 쓴 점 ${id}가 원 위에 없다`);
    }
  }
  const hidden = new Set(plan.hiddenPointNames || []);
  const named = (plan.displayPoints || []).filter(id => at.has(id) && !hidden.has(id));
  if (named.length > 1) {
    const span = Math.max(...named.map(id => gap(at.get(id), at.get(named[0]))), 1e-9);
    named.forEach((id, i) => named.slice(i + 1).forEach(other => {
      if (gap(at.get(id), at.get(other)) < span * 0.04) errors.push(`이름 다른 점 ${id}, ${other}가 겹친다`);
    }));
  }
  return errors;
}

export function drawingKey(plan) {
  const strip = value => Array.isArray(value) ? value.map(strip) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).filter(key => !PROSE_KEYS.has(key)).sort().map(key => [key, strip(value[key])]))
    : value;
  return crypto.createHash('sha256').update(JSON.stringify(strip(plan))).digest('hex');
}

export function planErrors({plan, question, item = {}}) {
  const errors = geometryErrors(plan), shown = shownText(plan);
  const source = plain([question.content, question.solution, ...(question.choices || [])].join(' '));
  for (const value of item.mustShow || []) if (!hasToken(shown, value)) errors.push(`그림 라벨에 "${value}"가 없다`);
  for (const value of item.mustNotShow || []) if (hasToken(shown, value)) errors.push(`그림에 나오면 안 되는 "${value}"가 있다`);
  for (const name of new Set(shownPointNames(plan))) {
    if (!namedInSource(source, String(name))) errors.push(`점 이름 "${name}"은 발문·해설에 없다(이름을 숨기거나 발문대로 쓴다)`);
  }
  if (plan.chart?.kind === 'NORMAL_CURVE') {
    for (const curve of plan.chart.curves || []) {
      if (/^z(?:\(0,1\))?$/i.test(compact(curve.label ?? curve.id)) && (Number(curve.mean) !== 0 || Number(curve.sd) !== 1)) errors.push('평균 0·표준편차 1이 아닌 곡선의 이름이 Z다');
    }
  }
  return errors;
}

function loadQuestion(item) {
  const context = {window: {}};
  vm.runInNewContext(fs.readFileSync(path.join(REPO, item.exam), 'utf8'), context, {timeout: 10000});
  const bank = context.window.questionBank || context.questionBank || [];
  const question = bank.find((row, i) => String(row.id ?? i + 1) === String(item.qid));
  if (!question) throw new Error(`문항 없음: ${item.exam} ${item.qid}`);
  return question;
}

function checkItem(task, item, out) {
  const dir = path.join(out, task.id, item.key), noteFile = path.join(dir, 'note.json'), planFile = path.join(dir, 'plan.json');
  if (!fs.existsSync(noteFile)) return {status: 'NOT_RUN', errors: []};
  const errors = [];
  for (const name of fs.readdirSync(dir)) if (name !== 'note.json' && name !== 'plan.json') errors.push(`허용하지 않은 파일 ${name}(렌더·생성 스크립트 금지)`);
  let note;
  try { note = JSON.parse(fs.readFileSync(noteFile, 'utf8')); } catch { return {status: 'FAIL', errors: ['note.json을 읽을 수 없다']}; }
  if (note.status === 'CONTENT' || note.status === 'ENGINE') {
    if (compact(note.reason).length < 20) errors.push('reason에 무엇이 왜 안 되는지 적는다');
    return {status: errors.length ? 'FAIL' : note.status, errors};
  }
  if (note.status !== 'PLAN') return {status: 'FAIL', errors: ['status는 PLAN, CONTENT, ENGINE 중 하나다']};
  const question = loadQuestion(item);
  const answer = value => compact(value).replace(/[$\\{}^]|circ|°/g, '');
  if (answer(note.myAnswer) !== answer(question.answer)) errors.push('myAnswer가 저장된 정답과 다르다(맞게 풀었다면 CONTENT)');
  if (compact(note.working).length < 15) errors.push('working에 푼 과정을 적는다');
  if (!fs.existsSync(planFile)) return {status: 'FAIL', errors: [...errors, 'plan.json이 없다']};
  let plan;
  try { plan = JSON.parse(fs.readFileSync(planFile, 'utf8')); } catch { return {status: 'FAIL', errors: [...errors, 'plan.json을 읽을 수 없다']}; }
  errors.push(...planErrors({plan, question, item}));
  const lint = spawnSync(process.execPath, [LINT, '--quiet', planFile], {cwd: REPO, encoding: 'utf8'});
  if (lint.status !== 0) errors.push('plan-lint: ' + (lint.stdout + lint.stderr).trim().slice(0, 500));
  return {status: errors.length ? 'FAIL' : 'PASS', errors, drawing: drawingKey(plan)};
}

// 시험 렌더: 검사를 통과한 plan 한 개만. 통과는 완료가 아니다.
function renderOne(task, item, out) {
  const checked = checkItem(task, item, out);
  if (checked.status !== 'PASS') {
    console.error([checked.status, item.key, ...checked.errors].join('\t') + '\n검사를 통과한 plan만 렌더한다.');
    return 1;
  }
  const tool = path.join(REPO, '.tmp/work/render.mjs');
  if (!fs.existsSync(tool)) { console.error('렌더 준비가 안 됐다(.tmp/work/render.mjs). 사용자에게 알린다.'); return 2; }
  const bankIndex = () => {
    const context = {window: {}};
    vm.runInNewContext(fs.readFileSync(path.join(REPO, item.exam), 'utf8'), context, {timeout: 10000});
    return (context.window.questionBank || context.questionBank).findIndex((row, i) => String(row.id ?? i + 1) === String(item.qid)) + 1;
  };
  const dir = path.join(out, '_render', task.id, item.key);
  fs.rmSync(path.join(dir, 'figure.png'), {force: true});
  fs.mkdirSync(dir, {recursive: true});
  const itemFile = path.join(dir, 'item.json'), outDir = path.join(dir, 'out');
  fs.writeFileSync(itemFile, JSON.stringify({dir: 'figure', sourcePath: item.exam, ordinal: bankIndex()}));
  const planFile = path.join(out, task.id, item.key, 'plan.json');
  const run = spawnSync(process.execPath, [tool, '--item', itemFile, '--plan', planFile, '--out', outDir], {cwd: REPO, encoding: 'utf8'});
  const last = String(run.stdout).trim().split('\n').pop();
  let result = {};
  try { result = JSON.parse(last); } catch { /* reported as FAILED below */ }
  if (result.status !== 'ARCHIVE_BOUND') {
    console.log(`FAILED\t${item.key}\t${last || String(run.stderr).trim().slice(0, 500)}`);
    return 1;
  }
  const png = path.join(dir, 'figure.png');
  const shot = spawnSync(process.execPath, [path.join(REPO, 'archive/tools/geometry-equation/ops/svg-m1/svg2png.cjs'), path.join(outDir, 'figure-solution.svg'), png], {cwd: REPO, encoding: 'utf8'});
  if (shot.status !== 0) { console.log(`FAILED\t${item.key}\tPNG 변환 실패: ${String(shot.stderr).trim().slice(0, 300)}`); return 1; }
  console.log(`렌더됨(완료·게시 가능 아님)\t${item.key}\t${png}`);
  return 0;
}

function main() {
  const [command, taskId, key] = process.argv.slice(2);
  const config = JSON.parse(fs.readFileSync(path.join(HERE, 'TASKS.json'), 'utf8'));
  const task = config.tasks.find(row => row.id === taskId);
  if (!['show', 'check', 'render'].includes(command) || !task || (command === 'render' && !key)) {
    console.error('usage: check-submission.mjs show|check <task> [key] | render <task> <key>');
    for (const row of config.tasks) console.error(`  ${row.id} ${row.state} ${row.title}`);
    return 2;
  }
  if (task.state !== 'READY') {
    console.error(`${task.id}는 ${task.state}다. 메인이 열기 전에는 하지 않는다.`);
    return 2;
  }
  const items = task.items.filter(item => !key || item.key === key);
  if (!items.length) { console.error('그런 키가 없다'); return 2; }

  if (command === 'show') {
    console.log(`${task.id} ${task.title}\n${task.why}\n`);
    for (const item of items) {
      if (!key) { console.log(`- ${item.key}: ${item.exam} ${item.qid}번`); continue; }
      const question = loadQuestion(item);
      console.log(JSON.stringify({task: item, question: {content: question.content, choices: question.choices, answer: question.answer, solution: question.solution, image: question.image, solutionImage: question.solutionImage}}, null, 2));
    }
    return 0;
  }

  const out = process.env.ANTI_OUT || config.out;
  if (command === 'render') return renderOne(task, items[0], out);
  const all = task.items.map(item => ({item, ...checkItem(task, item, out)}));
  const seen = new Map();
  for (const row of all) {
    if (!row.drawing) continue;
    const first = seen.get(row.drawing);
    if (first) {
      for (const side of [row, first]) {
        side.status = 'FAIL';
        side.errors.push(`${side === row ? first.item.key : row.item.key}와 같은 그림이다`);
      }
    } else seen.set(row.drawing, row);
  }
  const rows = all.filter(row => !key || row.item.key === key);
  for (const row of rows) console.log([row.status, row.item.key, ...row.errors].join('\t'));
  const good = rows.every(row => ['PASS', 'CONTENT', 'ENGINE'].includes(row.status));
  console.log(`${task.id}: ${good ? '제출 가능(게시 가능 아님)' : '제출 불가'} ${rows.length}건`);
  return good ? 0 : 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) process.exitCode = main();
