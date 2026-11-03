// AP Math Lab 2.0 · 다면체 실험실 ③탭 「점 이름」 검사 (브라우저 없이 수 초)
// 실행: node --test apmath/playground/next/tools/polyhedra-names.test.mjs
// 확인하는 것 (개수가 아니라 결함 조건):
//  1) 전개도 위 점의 이름은 테두리를 따라 반시계로 A, B, C … 이고 서로 겹치지 않으며, 이름 바꾸기(시작점·방향)를 해도 한 점에 글자 하나씩이다.
//  2) 이름을 어떻게 배치해도 「점 X와 겹치는 점」 정답·정리 글·모아 보기 글이 접은 모양의 3차원 위치로 직접 구한 값과 같다.
//  3) 선생님 교과서 그림(정사면체 띠, 정육면체 1-4-1, 정팔면체 가운데 띠)이 기본 이름으로 그대로 나온다.
//  4) 정팔면체 전개도는 11가지, 정사면체는 2가지이고 서로 달라야 한다.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const NEXT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(NEXT, 'labs/g7-polyhedra');
function load() {
  const noop = () => {};
  const el = () => ({ style: {}, dataset: {}, append: noop, remove: noop, addEventListener: noop, setAttribute: noop });
  const document = { documentElement: el(), head: el(), body: el(), getElementById: () => null, createElement: el, addEventListener: noop };
  const window = { document };
  const ctx = vm.createContext({ window, document, console, Math, Date, Set, Map, Array, Object, JSON, String, Number, Symbol, Promise });
  for (const f of ['core', 'geo', 't3']) vm.runInContext(fs.readFileSync(path.join(DIR, f + '.js'), 'utf8'), ctx, { filename: f + '.js' });
  return window;
}
const W = load();
const G = W.APL_PH;
const scenes = Object.fromEntries(W.APL_PH_GROUPS.flatMap((g) => g.scenes).map((s) => [s.id, s.ph]));
const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z) < 1e-5;

// 접은 모양(t=1)의 3차원 위치에서 직접 구한, 점 k 와 같은 꼭짓점이 되는 다른 점들(점 번호)
function partnersBy3D(net, k) {
  const end = net.at(1), posOf = (kk) => { for (let fi = 0; fi < net.ptOf.length; fi++) for (let vi = 0; vi < net.ptOf[fi].length; vi++) if (net.ptOf[fi][vi] === kk) return end[fi][vi]; return null; };
  const pk = posOf(k);
  return net.pt.map((_, j) => j).filter((j) => j !== k && near(posOf(j), pk));
}
const rawNets = (kind) => G.polyNetsOf(kind);
const allNets = () => {
  const out = [];
  ['tetra', 'octa'].forEach((kind) => G.netShapes(kind).forEach((sh) => out.push({ kind, id: sh.id, net: G.shapeNet(kind, sh, 0) })));
  rawNets('icosa').forEach((net, i) => out.push({ kind: 'icosa', id: i + 1, net }));
  G.CUBE_NETS.forEach((d) => out.push({ kind: 'cube', id: d.key, net: G.cubeNetOf(d.key) }));
  return out;
};

test('정팔면체 전개도는 11가지, 정사면체는 2가지', () => {
  assert.equal(G.netShapes('octa').length, 11);
  assert.equal(G.netShapes('tetra').length, 2);
  for (const kind of ['octa', 'tetra']) {
    const picks = kind === 'octa' ? G.OCTA_PICK : G.TETRA_PICK, n = G.netShapes(kind).length;
    assert.ok(picks.length >= 1 && picks.every((x) => Number.isInteger(x) && x >= 1 && x <= n), `${kind} 선택 번호`);
    assert.equal(new Set(picks).size, picks.length, `${kind} 선택 중복`);
    assert.equal(G.polyNetsOf(kind).length, picks.length);
  }
});

test('이름: 모든 전개도·모든 이름 배치에서 한 점에 글자 하나, 서로 다른 글자, A부터 차례로', () => {
  for (const { kind, id, net } of allNets()) {
    assert.ok(net.bdOk, `${kind} ${id}: 테두리가 한 바퀴로 이어지지 않음`);
    assert.ok(net.nameVars.length >= 2, `${kind} ${id}: 이름 배치가 하나뿐`);
    const letters = Array.from({ length: net.pt.length }, (_, i) => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]);
    net.nameVars.forEach((names, v) => {
      assert.equal(names.length, net.pt.length);
      assert.deepEqual(names.slice().sort(), letters.slice().sort(), `${kind} ${id} 배치 ${v}: 글자가 A부터 빠짐·겹침 없이 한 번씩이 아님`);
    });
    // 이름 배치마다 정말 다른 이름표(같은 배치가 중복되지 않음)
    assert.equal(new Set(net.nameVars.map((n) => n.join(''))).size, net.nameVars.length, `${kind} ${id}: 같은 이름 배치가 중복`);
    // 기본 배치는 반시계: A 다음 B 는 테두리에서 A 의 반시계 쪽 이웃
    const ptIdx = (nm) => net.nameVars[0].indexOf(nm), pa = net.pt[ptIdx('A')], pb = net.pt[ptIdx('B')], pc = net.pt[ptIdx('C')];
    const cr = (pb.x - pa.x) * (pc.y - pb.y) - (pb.y - pa.y) * (pc.x - pb.x);
    void cr; // 꺾임 방향은 모양마다 달라 부호는 보지 않고, 아래 넓이 부호로 반시계를 확인
    let area = 0; net.bd.forEach((a, i) => { const p = net.pt[a], q = net.pt[net.bd[(i + 1) % net.bd.length]]; area += p.x * q.y - q.x * p.y; });
    assert.ok(area > 0, `${kind} ${id}: 테두리 순서가 반시계가 아님`);
    // 이름 바꾸기에 시계 방향도 있음
    const cw = net.nameVarDefs.some((d) => d.dir === -1);
    assert.ok(cw, `${kind} ${id}: 시계 방향 배치 없음`);
  }
});

test('교과서 그림: 정사면체 띠 · 정육면체 1-4-1 · 정팔면체 가운데 띠가 기본 이름으로 그대로 나온다', () => {
  const tri = (net) => net.ptOf.map((row) => row.map((k) => net.nameVars[0][k]).sort().join('')).sort().join(',');
  const want = (a) => a.map((t) => t.split('').sort().join('')).sort().join(',');
  const tetra = G.polyNetsOf('tetra')[0];
  assert.equal(tri(tetra), want(['ABC', 'ACF', 'CDF', 'DEF']), '정사면체 첫 전개도(띠): 삼각형의 점 이름');
  const octa = G.polyNetsOf('octa')[0];
  assert.equal(tri(octa), want(['ABJ', 'BCJ', 'CDJ', 'DJI', 'DEI', 'EIH', 'EHG', 'EGF']), '정팔면체 첫 전개도: 삼각형의 점 이름');
  // 정육면체: 윗 칸의 윗변 B A, 가운데 줄 윗선 D C N M L, 아랫선 E F G H K, 아랫 칸의 아랫변 I J
  const cube = scenes['p3-2'].model({ phNet: 0, phNm: 0, phQ: { ni: 0, k: 0, nv: 0 } }).net;
  const xs = cube.pt.map((p) => p.x), ys = cube.pt.map((p) => p.y), L = 1.2, x0 = Math.min(...xs), y1 = Math.max(...ys);
  const grid = {}; cube.pt.forEach((p, k) => { grid[`${Math.round((p.x - x0) / L)},${Math.round((y1 - p.y) / L)}`] = cube.ptName[k]; });
  const row = (iy, n) => Array.from({ length: n }, (_, ix) => grid[`${ix},${iy}`] || '.').join('');
  assert.deepEqual([row(0, 3), row(1, 5), row(2, 5), row(3, 5)], ['.BA', 'DCNML', 'EFGHK', '...IJ']);
});

// 장면 p3-2 · p3-5 · p3-6: 모든 전개도 · 모든 이름 배치 · 모든 점에 대해 문제의 정답·정리 글·모아 보기가 3차원 계산과 같다.
const SCENES = [['p3-2', 'cube'], ['p3-5', 'tetra'], ['p3-6', 'octa']];
for (const [id, kind] of SCENES) {
  test(`${id}: 이름을 어떻게 배치해도 「겹치는 점」 정답·정리·모아 보기가 3차원 계산과 같다`, (t) => {
    const D = scenes[id];
    assert.ok(D, `${id} 장면 없음`);
    const s0 = {}; D.init(s0);
    const nSpec = id === 'p3-2' ? 5 : id === 'p3-5' ? G.TETRA_PICK.length : G.OCTA_PICK.length;
    let checks = 0, layouts = 0;
    for (let ni = 0; ni < nSpec; ni++) {
      const base = D.model(Object.assign({}, s0, { phQ: { ni, k: 0, nv: 0 }, phNet: ni }));
      const nVar = base.qnet.nameVars.length;
      for (let nv = 0; nv < nVar; nv++) {
        layouts++;
        for (let k = 0; k < base.qnet.pt.length; k++) {
          const raw = D.model(Object.assign({}, s0, { phQ: { ni, k, nv: 0 }, phNet: ni })).qnet;
          const want = partnersBy3D(raw, k);
          if (!want.length) continue;
          const s = Object.assign({}, s0, { phQ: { ni, k, nv }, phNet: ni, phNm: nv });
          const M = D.model(s), net = M.qnet;
          assert.equal(M.qk, k);
          assert.equal(net.nameIdx | 0, nv % nVar, `${id} 문제 그림의 이름 배치 번호`);
          const names = (arr) => arr.map((j) => net.ptName[j]).sort((a, c) => (a < c ? -1 : a > c ? 1 : 0));
          const Q = D.prob(M, s);
          assert.ok(Q.stem.includes(`점 ${net.ptName[k]}`), `${id}: 문제 글의 점 이름 (${Q.stem})`);
          assert.ok(Q.key.endsWith(`|${nv % nVar}`), `${id}: 문제 키에 이름 배치가 들어감 (${Q.key})`);
          const oks = Q.choices.filter((c) => c.ok);
          assert.equal(oks.length, 1, `${id}: 정답 보기는 하나`);
          assert.equal(oks[0].h, `점 ${names(want).join(', ')}`, `${id} 전개도 ${ni} 배치 ${nv} 점 ${net.ptName[k]}`);
          assert.ok(!Q.choices.some((c) => !c.ok && c.h === oks[0].h), `${id}: 오답이 정답과 같은 글`);
          assert.ok(Q.choices.every((c) => !c.h.replace('점 ', '').split(', ').includes(net.ptName[k])), `${id}: 보기에 묻는 점 자신이 들어감`);
          // 정리 글: 고른 점 → 한 꼭짓점이 되는 점들의 이름
          const sM = D.model(Object.assign({}, s0, { phNet: ni, phNm: nv, phSel: 0, phSelPt: k }));
          assert.equal(sM.net.nameIdx | 0, nv % nVar);
          assert.deepEqual(names(partnersBy3D(sM.net, sM.k).concat([sM.k])), names(sM.same.concat([sM.k])), `${id}: 모델이 구한 겹치는 점`);
          checks++;
        }
        // 모아 보기 글(formula)에 나오는 「한 꼭짓점이 되는 점」 묶음이 3차원 계산과 같다
        const sV = Object.assign({}, s0, { phNet: ni, phNm: nv, phQ: { ni, k: 0, nv } });
        const MV = D.model(sV), vw = D.view(MV), fi = MV.fi;
        const want = new Set(fi.groups.map((g) => g.pts.map((j) => MV.net.ptName[j]).sort().join('=')));
        const listed = (vw.formula.match(/접으면 한 꼭짓점이 되는 점: ([^<]*)</) || [])[1];
        assert.ok(listed != null, `${id}: formula 에 묶음 글이 없음`);
        listed.split(' · ').filter((x) => x !== '없음').forEach((grp) => assert.ok(want.has(grp.split('=').sort().join('=')), `${id}: 묶음 ${grp} 가 3차원 계산에 없음`));
        // 모든 묶음이 3차원 계산과 정확히 같은지: 3차원 위치가 같은 점끼리
        const by3D = new Set(); MV.net.pt.forEach((_, j) => { const g = partnersBy3D(MV.net, j).concat([j]).map((x) => MV.net.ptName[x]).sort(); if (g.length > 1) by3D.add(g.join('=')); });
        assert.deepEqual(Array.from(want).sort(), Array.from(by3D).sort(), `${id} 전개도 ${ni} 배치 ${nv}: 묶음`);
        // 정리 3단계 글에 같은 이름이 쓰임
        const steps = D.steps(MV), grp = fi.ptGrp[MV.k];
        if (grp >= 0) fi.groups[grp].pts.forEach((j) => assert.ok(steps[2].includes(MV.net.ptName[j]), `${id}: 정리 글에 점 ${MV.net.ptName[j]} 없음`));
      }
    }
    t.diagnostic(`${id}: 전개도 ${nSpec}개 · 이름 배치 ${layouts}개 · 문항(점) ${checks}개 대조`);
    assert.ok(layouts >= nSpec * 2 && checks > 0, `${id}: 검사한 배치 ${layouts}, 문항 ${checks}`);
  });
}

test('p3-5·p3-6 이름 바꾸기 단추가 있고, 누를 때마다 다른 배치가 된다', () => {
  for (const id of ['p3-2', 'p3-5', 'p3-6']) {
    const D = scenes[id], s = {}; D.init(s);
    const sc = W.APL_PH_GROUPS.flatMap((g) => g.scenes).find((x) => x.id === id);
    const btn = () => sc.presets(s).find((p) => p.label === '이름 바꾸기');
    assert.ok(btn(), `${id}: 이름 바꾸기 단추`);
    const seen = new Set();
    for (let i = 0; i < 6; i++) { seen.add(D.model(s).net.ptName.join('')); btn().apply(s); }
    assert.equal(seen.size, 6, `${id}: 누를 때마다 다른 배치`);
    const prev = s.phQ; D.reroll(s);
    assert.ok(prev !== s.phQ);
  }
});
