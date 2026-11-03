/* ==========================================================================
   중1 · 다면체와 정다면체 — 정육면체의 세 꼭짓점을 지나는 단면 계산 (cubesec.js)
   · 교과서 겨냥도의 꼭짓점 이름: 윗면 A(뒤 왼쪽)·D(뒤 오른쪽)·B(앞 왼쪽)·C(앞 오른쪽), 아랫면 E(뒤 왼쪽, 가려진 점)·F(앞 왼쪽)·G(앞 오른쪽)·H(뒤 오른쪽)
   · 단면의 모양·넷째 점·변의 종류는 모두 좌표로 계산합니다(세 점마다 정해 둔 표는 없습니다).
   · 화면 코드(t4.js)와 node 테스트(tools/cube-section.test.mjs)가 같은 계산을 씁니다. 전역은 APL_PH.cubeSec 하나입니다.
   ========================================================================== */
(function () {
  'use strict';
  const NAMES = 'ABCDEFGH';
  // x 오른쪽, y 안쪽(뒤), z 위쪽. 한 모서리의 길이 = 2.
  const POS = { A: [-1, 1, 1], B: [-1, -1, 1], C: [1, -1, 1], D: [1, 1, 1], E: [-1, 1, -1], F: [-1, -1, -1], G: [1, -1, -1], H: [1, 1, -1] };
  const pos = (L) => POS[L];
  const sub = (p, q) => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const d2 = (p, q) => { const v = sub(p, q); return dot(v, v); };
  const EPS = 1e-9;

  // 두 꼭짓점의 관계: 거리의 제곱 4 = 모서리, 8 = 면의 대각선, 12 = 공간(꼭짓점끼리)의 대각선
  function relOf(a, b) {
    const v = d2(pos(a), pos(b));
    return Math.abs(v - 4) < EPS ? 'edge' : Math.abs(v - 8) < EPS ? 'face' : Math.abs(v - 12) < EPS ? 'space' : null;
  }
  const REL_KO = { edge: '모서리', face: '면의 대각선', space: '공간의 대각선' };

  // 면: 좌표 하나가 같은 꼭짓점들. 면의 이름만 우리말로 붙입니다.
  const FACE_KO = { '2+': '윗면', '2-': '아랫면', '1-': '앞면', '1+': '뒷면', '0-': '왼쪽 면', '0+': '오른쪽 면' };
  function commonFace(list) { // 모두 한 면 위에 있으면 { axis, sign, name }
    const ps = list.map(pos);
    for (let ax = 0; ax < 3; ax++) if (ps.every((p) => p[ax] === ps[0][ax])) { const sg = ps[0][ax] > 0 ? '+' : '-'; return { axis: ax, sign: sg, name: FACE_KO[ax + sg] }; }
    return null;
  }
  const lettersOnFace = (f) => NAMES.split('').filter((L) => (pos(L)[f.axis] > 0 ? '+' : '-') === f.sign);

  // 같은 평면 위의 점들을 한 바퀴 돌아가는 순서로 놓고, 이름 순서가 가장 앞서는 읽기(ABGH 처럼)로 맞춥니다.
  function cyc(list, n) {
    const ps = list.map(pos), c = [0, 1, 2].map((i) => ps.reduce((s, p) => s + p[i], 0) / ps.length);
    const nn = n || cross(sub(ps[1], ps[0]), sub(ps[2], ps[0]));
    const u = sub(ps[0], c), w = cross(nn, u);
    const ang = (L) => { const v = sub(pos(L), c); return Math.atan2(dot(v, w), dot(v, u)); };
    let o = list.slice().sort((p, q) => ang(p) - ang(q));
    const i0 = o.indexOf(o.slice().sort()[0]);
    o = o.slice(i0).concat(o.slice(0, i0));
    if (o.length > 2 && o[o.length - 1] < o[1]) o = [o[0]].concat(o.slice(1).reverse());
    return o;
  }

  // 한 평면 위의 다각형 이름과 변·각 정보
  function shapeOf(list) {
    const k = list.length, ps = list.map(pos);
    const side = ps.map((p, i) => d2(p, ps[(i + 1) % k]));
    const right = ps.map((p, i) => Math.abs(dot(sub(ps[(i + k - 1) % k], p), sub(ps[(i + 1) % k], p))) < EPS);
    const allEq = side.every((v) => Math.abs(v - side[0]) < EPS);
    let name;
    if (k === 3) name = allEq ? '정삼각형' : right.some(Boolean) ? '직각삼각형' : '삼각형';
    else if (k === 4) name = right.every(Boolean) ? (allEq ? '정사각형' : '직사각형') : '사각형';
    else name = k + '각형';
    return { name, side, right, allEq };
  }

  // 평면과 모서리가 꼭짓점이 아닌 곳에서 만나는 모서리의 수(0이면 단면의 꼭짓점은 정육면체의 꼭짓점뿐)
  function crossCount(n, d) {
    let c = 0;
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const a = pos(NAMES[i]), b = pos(NAMES[j]);
      if (relOf(NAMES[i], NAMES[j]) !== 'edge') continue;
      if ((dot(n, a) - d) * (dot(n, b) - d) < -EPS) c++;
    }
    return c;
  }

  const KIND_OF = { 정사각형: 'square', 직사각형: 'rect', 정삼각형: 'tri' };
  const KIND_KO = { square: '한 면 위의 세 점', rect: '마주 보는 두 모서리를 지나는 대각선 방향', tri: '한 꼭짓점에 이웃한 세 점' };

  // 서로 다른 세 꼭짓점 a, b, c 를 지나는 평면으로 자른 단면
  function sectionOf3(a, b, c) {
    const tri = [a, b, c].sort(), ps = tri.map(pos);
    const n = cross(sub(ps[1], ps[0]), sub(ps[2], ps[0])), d = dot(n, ps[0]);
    const on = NAMES.split('').filter((L) => Math.abs(dot(n, pos(L)) - d) < EPS);
    const poly = cyc(on, n), shape = shapeOf(poly);
    const pairs = [[tri[0], tri[1]], [tri[0], tri[2]], [tri[1], tri[2]]].map(([p, q]) => ({ p, q, rel: relOf(p, q), face: relOf(p, q) === 'face' ? commonFace([p, q]) : null }));
    const fourth = on.find((L) => !tri.includes(L)) || null;
    const sec = { tri, n, d, poly, name: shape.name, label: `${shape.name} ${poly.join('')}`, kind: KIND_OF[shape.name] || 'other', shape, pairs, fourth, crossings: crossCount(n, d), sameFace: commonFace(tri) };
    if (sec.kind === 'rect') { // 모서리 XY 와 평행한, 나머지 한 점 Z 를 지나는 모서리 ZW (W 가 넷째 점)
      const e = pairs.find((q) => q.rel === 'edge'), z = tri.find((L) => L !== e.p && L !== e.q);
      sec.par = { edge: [e.p, e.q], z, w: fourth };
    }
    if (sec.kind === 'tri') sec.hub = NAMES.split('').find((L) => tri.every((T) => relOf(L, T) === 'edge')) || null; // 세 점 모두와 모서리로 이어진 꼭짓점
    if (sec.kind === 'square') sec.face = sec.sameFace;
    return sec;
  }

  // 서로 다른 세 꼭짓점의 조합 56가지
  const ALL = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) for (let k = j + 1; k < 8; k++) ALL.push(sectionOf3(NAMES[i], NAMES[j], NAMES[k]));

  const api = { NAMES, POS, pos, relOf, REL_KO, FACE_KO, commonFace, lettersOnFace, cyc, shapeOf, crossCount, sectionOf3, ALL, KIND_KO };
  (window.APL_PH = window.APL_PH || {}).cubeSec = api;
})();
