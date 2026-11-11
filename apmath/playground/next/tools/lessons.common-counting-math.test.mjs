// Independent enumeration of the actual source conditions, not formula mirroring.
import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from './helpers/counting-lesson-runtime.mjs';

const lab = await load();
const plain = value => JSON.parse(JSON.stringify(value));
const first = id => plain(lab.api.first(id));
const answer = (id, label) => lab.def.lessons[id].find(lesson => lesson.label === label).answer;
const choose = (a, k) => k ? a.flatMap((x, i) => choose(a.slice(i + 1), k - 1).map(rest => [x, ...rest])) : [[]];
const permutations = a => a.length ? a.flatMap((x, i) => permutations(a.filter((_, j) => j !== i)).map(rest => [x, ...rest])) : [[]];
const integers = n => Array.from({ length: n }, (_, i) => i);

test('road, sum and product count distinct outcomes under the actual conditions', () => {
  const v = first('rule'), paths = [];
  for (let i = 0; i < v.a; i++) for (let j = 0; j < v.c; j++) paths.push(`viaB:${i}:${j}`);
  for (let i = 0; i < v.d; i++) paths.push(`direct:${i}`);
  assert.equal(new Set(paths).size, v.ans.val);
  assert.equal(v.ans.val, 14); assert.equal(answer('rule', '도로'), '$14$가지');
  const initial = lab.api.initial('rule');
  const clothes = integers(initial.aP).flatMap(a => integers(initial.bP).map(b => `${a}:${b}`));
  const transport = [...integers(initial.aS).map(i => `bus:${i}`), ...integers(initial.bS).map(i => `train:${i}`)];
  assert.equal(new Set(clothes).size, 6); assert.equal(new Set(transport).size, 5);
  assert.equal(answer('rule', '곱의법칙'), '옷차림은 $6$가지');
  assert.equal(answer('rule', '합의법칙'), '교통편은 $5$가지');
});

test('card integers and people in ordered seats agree with the authored permutation values', () => {
  const v = first('perm');
  const values = new Set(permutations(v.cards).map(p => p.slice(0, v.r).join('')));
  const even = [...values].filter(value => Number(value) % 2 === 0 && value[0] !== '0');
  assert.equal(even.length, v.ans.val); assert.equal(v.ans.val, 60);
  assert.equal(answer('perm', '짝수조건'), '$60$개');
  const s = lab.api.initial('perm'), seats = new Set(permutations(integers(s.n2)).map(p => p.slice(0, s.r2).join(',')));
  assert.equal(seats.size, 60); assert.equal(answer('perm', '순열원리'), '$_5P_3=60$');
});

test('actual person-by-person permutations independently verify all five adjacency goals', () => {
  const v = first('adj'), people = [...integers(v.x).map(i => `M${i}`), ...integers(v.y).map(i => `W${i}`)];
  let a = 0, b = 0;
  for (const line of permutations(people)) {
    const women = line.flatMap((p, i) => p.startsWith('W') ? [i] : []);
    if (Math.max(...women) - Math.min(...women) === v.y - 1) a++;
    if (line.every((p, i) => !p.startsWith('M') || !line[i + 1]?.startsWith('M'))) b++;
  }
  assert.equal(a, v.A); assert.equal(b, v.B); assert.equal(b - a, v.ans.val);
  assert.deepEqual([a, b, b - a], [144, 480, 336]);
  assert.equal(answer('adj', '여학생묶음'), '$a=144$'); assert.equal(answer('adj', '남학생틈'), '$b=480$'); assert.equal(answer('adj', '두경우차'), '$b-a=336$');
  const n = lab.api.initial('adj').n3, all = permutations(integers(n));
  const adjacent = all.filter(p => Math.abs(p.indexOf(0) - p.indexOf(1)) === 1).length;
  assert.equal(adjacent, 48); assert.equal(all.length - adjacent, 72);
  assert.equal(answer('adj', '이웃원리'), '이웃 배열은 $48$가지'); assert.equal(answer('adj', '비이웃원리'), '비이웃 배열은 $72$가지');
});

test('unordered selections and permutation equivalence classes verify both combination goals', () => {
  const v = first('comb');
  const teams = choose(integers(v.a + v.c), v.x + v.y).filter(team => team.filter(x => x < v.a).length === v.x);
  assert.equal(teams.length, v.ans.val); assert.equal(teams.length, 120); assert.equal(answer('comb', '집단선발'), '$120$가지');
  const s = lab.api.initial('comb'), ordered = new Set(permutations(integers(s.n4)).map(p => p.slice(0, s.r4).join(','))), groups = new Map();
  for (const order of ordered) { const key = order.split(',').sort().join(','); groups.set(key, (groups.get(key) || 0) + 1); }
  assert.equal(groups.size, 10); assert.ok([...groups.values()].every(n => n === 6)); assert.equal(answer('comb', '조합원리'), '$_5C_3=10$');
});

test('actual shared edges and independent point/line choices verify all five geometry counts', () => {
  const v = first('shape'), vertices = integers(v.n), polygonEdges = new Set(vertices.map(i => [i, (i + 1) % v.n].sort((a, b) => a - b).join(',')));
  const counts = [0, 0, 0, 0];
  for (const triple of choose(vertices, 3)) counts[choose(triple, 2).filter(edge => polygonEdges.has(edge.join(','))).length]++;
  assert.deepEqual(counts, [7, 21, 7, 0]); assert.equal(counts[0], v.ans.val);
  assert.equal(answer('shape', '변공유제외'), '조건에 맞는 삼각형은 $7$개');
  const s = lab.api.initial('shape'), pairs = choose(integers(s.n5), 2), triples = choose(integers(s.n5), 3);
  assert.equal(pairs.length, 10); assert.equal(triples.length, 10);
  assert.equal(pairs.filter(([a, b]) => b - a !== 1 && b - a !== s.n5 - 1).length, 5);
  const parallelograms = new Set();
  for (const h of choose(integers(s.mP), 2)) for (const v of choose(integers(s.nP), 2)) parallelograms.add(h.flatMap(y => v.map(x => `${x},${y}`)).sort().join('|'));
  assert.equal(parallelograms.size, 18);
  for (const [label, value] of [['두점선분', '선분은 $10$개'], ['세점삼각형', '삼각형은 $10$개'], ['대각선', '대각선은 $5$개'], ['평행사변형', '평행사변형은 $18$개']]) assert.equal(answer('shape', label), value);
});

function independentTable(c, rows) {
  if (rows.length !== c.D || rows.some(pair => pair.length !== 2 || pair[0] === pair[1])) return false;
  const days = [0, 0, 0, 0]; for (const pair of rows) for (const x of pair) days[x]++;
  const same = (a, b) => [...a].sort().join(',') === [...b].sort().join(',');
  return days.every(n => n >= c.m) && !rows.some(pair => same(pair, c.nv)) && rows.filter(pair => same(pair, c.tg)).length === c.t;
}
test('all daily schedules independently confirm the table answer and every remaining multiplicity', () => {
  const v = first('grid'), pairs = choose(integers(4), 2), allowed = [];
  function visit(rows) { if (rows.length === v.c.D) { if (independentTable(v.c, rows)) allowed.push(rows); return; } for (const pair of pairs) visit([...rows, pair]); }
  visit([]);
  assert.equal(allowed.length, v.ans.val); assert.equal(allowed.length, 220); assert.equal(answer('grid', '신청서'), '$220$가지');
  const fixedDays = allowed.filter(rows => rows[0].join(',') === '1,2' && rows[1].join(',') === '1,2');
  const groups = new Map();
  for (const rows of fixedDays) { const cnt = v.info.rest4.map(p => rows.slice(2).filter(q => p.join(',') === q.join(',')).length); const key = cnt.join(','); groups.set(key, (groups.get(key) || 0) + 1); }
  assert.deepEqual([...groups].sort(), v.info.comps.map(q => [q.cnt.join(','), q.ways]).sort());
  assert.equal(fixedDays.length, 22);
});

test('the original table example and labelled-ball assignments verify the two grid concepts', () => {
  const table = lab.def.lessons.grid.find(l => l.label === '표조건');
  const cs = lab.video.compileLesson(table), state = lab.video.stateAt(cs, cs.length, { nums: {}, sets: {} });
  assert.ok(independentTable(plain(lab.api.tableExample), plain(state.sets.tab6)));
  assert.equal(answer('grid', '표조건'), '세 조건을 모두 만족');
  const c = plain(lab.api.boxExample), bins = new Map();
  function assign(positions) {
    if (positions.length < c.k) { for (let b = 0; b < c.n; b++) assign([...positions, b]); return; }
    const counts = integers(c.n).map(b => positions.filter(x => x === b).length);
    if (counts.some(n => n > 2)) return;
    for (let start = 0; start + c.w <= c.n; start++) if (!counts.slice(start, start + c.w).includes(2)) return;
    const doubles = counts.flatMap((n, i) => n === 2 ? [i] : []);
    for (const [a, b] of choose(doubles, 2)) if (counts.slice(a + 1, b).some(n => n !== 0)) return;
    const key = counts.join(','); bins.set(key, (bins.get(key) || 0) + 1);
  }
  assign([]);
  assert.equal(bins.size, 6); assert.ok([...bins.values()].every(n => n === 6));
  assert.equal([...bins.values()].reduce((a, b) => a + b, 0), 36); assert.equal(answer('grid', '상자배분'), '$36$가지');
});

test('cyclic equivalence, fixed-person counting and distinct reflections verify all circular goals', () => {
  const v = first('circ'), rotations = line => integers(line.length).map(i => [...line.slice(i), ...line.slice(0, i)].join(''));
  const canonical = line => rotations(line).sort()[0], all = permutations(integers(v.n)), groups = new Map();
  for (const line of all) { const key = canonical(line); groups.set(key, (groups.get(key) || 0) + 1); }
  assert.equal(groups.size, v.ans.val); assert.equal(groups.size, 24); assert.ok([...groups.values()].every(n => n === 5));
  assert.equal(all.filter(p => p[0] === 0).length, 24);
  assert.notEqual(canonical([0, 1, 2, 3, 4]), canonical([0, 4, 3, 2, 1]), 'reflections remain different');
  assert.equal(answer('circ', '원탁배열'), '$24$가지'); assert.equal(answer('circ', '회전중복'), '한 원순열마다 $5$개씩 겹침'); assert.equal(answer('circ', '한명고정'), '고정 뒤에는 $4!=24$가지');
});
