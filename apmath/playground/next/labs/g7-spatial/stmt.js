/* ==========================================================================
   중1 · 위치 관계 — 공간에서의 설명 9가지의 그림 (stmt.js)
   · p1~p6 (탭 ②)  l⊥m,l⊥n ⇒ m∥n? · l∥P,m∥P ⇒ l∥m? · l⊥P,m⊥P ⇒ l∥m · P⊥Q,P⊥R ⇒ Q∥R? · l⊥P,l⊥Q ⇒ P∥Q · l⊥P,l⊥m ⇒ m∥P?
   · door / planes / perp (탭 ⑤)  수직인 직선을 품은 평면 · 평행한 두 평면과 교선 · 한 직선과만 수직이면?
   설명마다 조절 막대 2개(a, b: 0~1)로 도형을 바꾸면, 그림과 「지금 두 대상의 위치 관계」·반례 여부가 숫자로 다시 계산됩니다.
   geo(a,b) → { panels, lines, rights, pars, dots, texts, fit, rel, given, holds, … } 를 돌려 주고 render() 가 그립니다.
   t2.js · t5.js 가 장면에 쓰고, 탭 ② 마지막 장면(s2-7)은 이 설명들 중 다섯 개를 한꺼번에 보여 줍니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SP;
  if (!G) return;
  const { DEG, v3, add3, sub3, mul3, lerp3, rotAxis, lineRel, mid3, P } = G;
  const PZ = -1; // 바닥 평면 P 의 높이
  const sq = (z, R) => [v3(-R, -R, z), v3(R, -R, z), v3(R, R, z), v3(-R, R, z)];
  const floorP = (R = 2.7) => ({ pts: sq(PZ, R), color: 'green', fa: 0.13, name: '평면 P', nameAt: v3(R - 0.1, -R + 0.1, PZ) });
  const dirH = (deg) => v3(Math.cos(deg * DEG), Math.sin(deg * DEG), 0);
  const REL = { same: '한 직선', parallel: '평행', meet: '한 점에서 만남', skew: '꼬인 위치' };
  const L = (p, q, color, o = {}) => Object.assign({ p, q, color, width: 4.6 }, o);
  const COL = { l: 'amber', m: 'violet', n: 'rose' }; // 직선 l = 노랑, m = 보라, n = 분홍 (평면 P = 초록, Q = 하늘, R = 노랑)

  /* ------------------------------------------------------------ 설명별 도형 */
  function geoP1(a, b) {
    const ang = a * 90, zm = -0.4, zn = zm + b * 1.8, dn = dirH(ang);
    const Pm = v3(0, 0, zm), dm = v3(1, 0, 0), Pn = v3(0, 0, zn);
    const rel = lineRel(Pm, dm, Pn, dn);
    const lines = [
      L(v3(0, 0, -1.9), v3(0, 0, 2.5), COL.l, { name: 'l', nameAt: v3(0, 0, 2.5) }),
      L(v3(-2.5, 0, zm), v3(2.5, 0, zm), COL.m, { name: 'm', nameAt: v3(2.5, 0, zm) }),
      L(v3(-2.5 * dn.x, -2.5 * dn.y, zn), v3(2.5 * dn.x, 2.5 * dn.y, zn), COL.n, { name: 'n', nameAt: v3(2.5 * dn.x, 2.5 * dn.y, zn) })
    ];
    return {
      lines, panels: [], rights: [{ O: Pm, a: dm, c: v3(0, 0, 1), color: COL.m }, { O: Pn, a: dn, c: v3(0, 0, 1), color: COL.n }],
      pars: rel === 'parallel' ? [[lines[1].p, lines[1].q], [lines[2].p, lines[2].q]] : [],
      fit: [v3(-2.5, -2.5, -1.9), v3(2.5, 2.5, 2.5)],
      conc: 'm∥n', relText: `m과 n: ${REL[rel]}`, rel, given: true, holds: rel === 'parallel' || rel === 'same'
    };
  }
  function geoP2(a, b) {
    const ang = a * 90, zl = 0, zm = zl + b * 1.6, dm = dirH(ang);
    const Pl = v3(0, -0.9, zl), dl = v3(1, 0, 0), Pm = v3(0, 0.7, zm);
    const rel = lineRel(Pl, dl, Pm, dm);
    const l1 = L(v3(-2.5, -0.9, zl), v3(2.5, -0.9, zl), COL.l, { name: 'l', nameAt: v3(2.5, -0.9, zl) });
    const m1 = L(v3(-2.5 * dm.x, 0.7 - 2.5 * dm.y, zm), v3(2.5 * dm.x, 0.7 + 2.5 * dm.y, zm), COL.m, { name: 'm', nameAt: v3(2.5 * dm.x, 0.7 + 2.5 * dm.y, zm) });
    const drops = [l1, m1].flatMap((ln) => [L(ln.p, v3(ln.p.x, ln.p.y, PZ), ln.color, { width: 1.8, dash: [4, 5], alpha: 0.45 }), L(ln.q, v3(ln.q.x, ln.q.y, PZ), ln.color, { width: 1.8, dash: [4, 5], alpha: 0.45 })]);
    return {
      lines: drops.concat([l1, m1]), panels: [floorP()], rights: [],
      pars: rel === 'parallel' ? [[l1.p, l1.q], [m1.p, m1.q]] : [],
      fit: [v3(-2.7, -2.7, PZ), v3(2.7, 2.7, 1.8)],
      conc: 'l∥m', relText: `l과 m: ${REL[rel]}`, rel, given: true, holds: rel === 'parallel' || rel === 'same'
    };
  }
  function geoP3(a, b) {
    const tau = b * 35, ym = (a - 0.5) * 2.6, dm = v3(0, Math.sin(tau * DEG), Math.cos(tau * DEG));
    const Pl = v3(-1.3, 0, PZ), dl = v3(0, 0, 1), Pm = v3(1.3, ym, PZ);
    const rel = lineRel(Pl, dl, Pm, dm);
    const l1 = L(Pl, v3(-1.3, 0, 2.2), COL.l, { name: 'l', nameAt: v3(-1.3, 0, 2.2) });
    const m1 = L(Pm, add3(Pm, mul3(dm, 3.2)), COL.m, { name: 'm', nameAt: add3(Pm, mul3(dm, 3.2)) });
    return {
      lines: [l1, m1], panels: [floorP()],
      rights: [{ O: Pl, a: v3(1, 0, 0), c: dl, color: COL.l }].concat(tau < 0.4 ? [{ O: Pm, a: v3(-1, 0, 0), c: dm, color: COL.m }] : []),
      pars: rel === 'parallel' ? [[l1.p, l1.q], [m1.p, m1.q]] : [],
      fit: [v3(-2.7, -2.7, PZ), v3(2.7, 2.7, 2.6)],
      conc: 'l∥m', relText: `l과 m: ${REL[rel]}`, rel, given: tau < 0.4, holds: rel === 'parallel' || rel === 'same',
      note: tau >= 0.4 ? 'm이 평면 P와 수직이 아니에요 (조건이 깨짐)' : ''
    };
  }
  function geoP4(a, b) {
    const ang = a * 90, Qy = 1.2, cy = -1.2 + b * 2.0, d = dirH(ang), top = 1.6, Hw = 2.0;
    const Rc = v3(0, cy, 0);
    const wall = (c, dd, hw, col, name, nameAt) => ({ pts: [v3(c.x - hw * dd.x, c.y - hw * dd.y, PZ), v3(c.x + hw * dd.x, c.y + hw * dd.y, PZ), v3(c.x + hw * dd.x, c.y + hw * dd.y, top), v3(c.x - hw * dd.x, c.y - hw * dd.y, top)], color: col, fa: 0.2, name, nameAt });
    const Q = wall(v3(0, Qy, 0), v3(1, 0, 0), 2.4, 'sky', '평면 Q', v3(-2.2, Qy, top - 0.1));
    const R = wall(Rc, d, Hw, 'amber', '평면 R', v3(Hw * d.x, cy + Hw * d.y, top - 0.1));
    const lines = [];
    let rel = 'parallel';
    if (ang > 0.5) {
      rel = 'meet';
      const t = (Qy - cy) / Math.sin(ang * DEG), X = v3(t * Math.cos(ang * DEG), Qy, 0);
      const inside = Math.abs(t) <= Hw + 0.05 && Math.abs(X.x) <= 2.4;
      if (inside) lines.push(L(v3(X.x, X.y, PZ), v3(X.x, X.y, top), 'red', { width: 6, name: '교선', nameAt: v3(X.x, X.y, top) }));
    }
    const n1 = v3(0, -1, 0), nR = v3(Math.sin(ang * DEG), -Math.cos(ang * DEG), 0);
    return {
      lines, panels: [floorP(), Q, R], rights: [{ O: v3(0, Qy, PZ), a: v3(0, 0, 1), c: n1, color: 'sky', size: 0.45 }, { O: v3(Rc.x, Rc.y, PZ), a: v3(0, 0, 1), c: nR, color: 'amber', size: 0.45 }],
      pars: [], fit: [v3(-2.7, -2.7, PZ), v3(2.7, 2.7, top + 0.4)],
      conc: 'Q∥R', relText: `평면 Q와 R: ${rel === 'parallel' ? '평행' : '교선에서 만남'}`, rel, given: true, holds: rel === 'parallel'
    };
  }
  function geoP5(a, b) {
    const z2 = PZ + 0.55 + a * 1.5, tau = b * 30, Rr = 2.3, c2 = v3(0, 0, z2), ax = v3(1, 0, 0);
    const Qp = sq(z2, Rr).map((p) => rotAxis(p, c2, ax, tau * DEG));
    const lines = [L(v3(0, 0, PZ - 0.8), v3(0, 0, Math.max(z2, PZ) + 1.3), 'amber', { name: 'l', nameAt: v3(0, 0, Math.max(z2, PZ) + 1.3) })];
    let rel = 'parallel';
    if (tau > 0.4) {
      rel = 'meet';
      const yi = (PZ - z2) / Math.tan(tau * DEG);
      if (Math.abs(yi) <= 2.6) lines.push(L(v3(-2.3, yi, PZ), v3(2.3, yi, PZ), 'red', { width: 5, name: '교선', nameAt: v3(2.3, yi, PZ) }));
    }
    const Pn = floorP(2.3);
    return {
      lines, panels: [Pn, { pts: Qp, color: 'sky', fa: 0.17, name: '평면 Q', nameAt: Qp[3] }],
      rights: [{ O: v3(0, 0, PZ), a: v3(1, 0, 0), c: v3(0, 0, 1), color: 'green' }].concat(tau < 0.4 ? [{ O: c2, a: v3(1, 0, 0), c: v3(0, 0, 1), color: 'sky' }] : []),
      pars: [], fit: [v3(-2.4, -2.4, PZ - 0.8), v3(2.4, 2.4, PZ + 3.4)],
      conc: 'P∥Q', relText: `평면 P와 Q: ${rel === 'parallel' ? '평행' : '교선에서 만남'}`, rel, given: tau < 0.4, holds: rel === 'parallel',
      note: tau >= 0.4 ? 'l이 평면 Q와 수직이 아니에요 (조건이 깨짐)' : ''
    };
  }
  function geoP6(a, b) {
    const zm = PZ + a * 2.0, dm = dirH(b * 90), O = v3(0, 0, PZ), Om = v3(0, 0, zm);
    const onP = a < 0.02;
    const l1 = L(v3(0, 0, PZ - 0.9), v3(0, 0, 2.4), 'amber', { name: 'l', nameAt: v3(0, 0, 2.4) });
    const m1 = L(v3(-2.5 * dm.x, -2.5 * dm.y, zm), v3(2.5 * dm.x, 2.5 * dm.y, zm), COL.m, { name: 'm', nameAt: v3(2.5 * dm.x, 2.5 * dm.y, zm) });
    const drops = [m1.p, m1.q].map((p) => L(p, v3(p.x, p.y, PZ), COL.m, { width: 1.8, dash: [4, 5], alpha: 0.45 }));
    return {
      lines: onP ? [l1, m1] : drops.concat([l1, m1]), panels: [floorP()],
      rights: [{ O, a: v3(1, 0, 0), c: v3(0, 0, 1), color: 'green', size: 0.38 }].concat(onP ? [] : [{ O: Om, a: dm, c: v3(0, 0, 1), color: COL.m, size: 0.38 }]),
      pars: [], fit: [v3(-2.7, -2.7, PZ - 0.9), v3(2.7, 2.7, 2.7)],
      conc: 'm∥P', relText: onP ? 'm은 평면 P에 포함돼요 (평행이 아님)' : 'm과 평면 P: 평행', rel: onP ? 'sub' : 'parallel', given: true, holds: !onP
    };
  }
  function geoDoor(a) {
    const th = (0.15 + a * 0.7) * 180, d = dirH(th), H = 2.4, W = 2.3;
    const O = v3(0, 0, PZ), perp = v3(-d.y, d.x, 0);
    const door = { pts: [O, v3(W * d.x, W * d.y, PZ), v3(W * d.x, W * d.y, PZ + H), v3(0, 0, PZ + H)], color: 'sky', fa: 0.22, name: '평면 Q (문)', nameAt: v3(W * d.x, W * d.y, PZ + H - 0.1) };
    const lines = [L(v3(0, 0, PZ - 0.4), v3(0, 0, PZ + H + 0.3), 'amber', { name: 'l', nameAt: v3(0, 0, PZ + H + 0.3) }), L(v3(-0.7 * d.x, -0.7 * d.y, PZ), v3(2.6 * d.x, 2.6 * d.y, PZ), 'red', { width: 4.4, name: '교선', nameAt: v3(2.6 * d.x, 2.6 * d.y, PZ) })];
    return {
      lines, panels: [floorP(), door],
      rights: [{ O: v3(1.3 * d.x, 1.3 * d.y, PZ), a: v3(0, 0, 1), c: perp, color: 'sky', size: 0.45 }, { O, a: v3(0, 0, 1), c: perp, color: 'amber', size: 0.4 }],
      pars: [], fit: [v3(-2.7, -2.7, PZ - 0.4), v3(2.7, 2.7, PZ + H + 0.5)],
      conc: 'P⊥Q', relText: `평면 P와 Q: 수직 (문을 ${Math.round(th)}°로 열어도)`, rel: 'perp', given: true, holds: true, th
    };
  }
  function geoPlanes(a, b) {
    const z1 = -1, z2 = 1, phi = b * 60, d = dirH(phi), xB = -0.6, xT = 0.6 + (a - 0.5) * 1.8, Rr = 2.7, Ld = 2.5;
    const mB = v3(xB, 0, z1), mT = v3(xT, 0, z2), ext = sub3(mT, mB);
    const mB2 = sub3(mB, mul3(ext, 0.28)), mT2 = add3(mT, mul3(ext, 0.28));
    const R = { pts: [sub3(mB2, mul3(d, Ld)), add3(mB2, mul3(d, Ld)), add3(mT2, mul3(d, Ld)), sub3(mT2, mul3(d, Ld))], color: 'amber', fa: 0.2, name: '평면 R', nameAt: add3(mT2, mul3(d, Ld)) };
    const lm = L(sub3(mB, mul3(d, Ld)), add3(mB, mul3(d, Ld)), 'red', { width: 5.5, name: 'm', nameAt: add3(mB, mul3(d, Ld)) });
    const ll = L(sub3(mT, mul3(d, Ld)), add3(mT, mul3(d, Ld)), 'red', { width: 5.5, name: 'l', nameAt: add3(mT, mul3(d, Ld)) });
    const rel = lineRel(mB, d, mT, d);
    return {
      lines: [lm, ll], panels: [{ pts: sq(z1, Rr), color: 'green', fa: 0.13, name: '평면 P', nameAt: v3(Rr - 0.1, -Rr + 0.1, z1) }, { pts: sq(z2, Rr), color: 'sky', fa: 0.13, name: '평면 Q', nameAt: v3(-Rr + 0.1, Rr - 0.1, z2) }, R],
      rights: [], pars: [[lm.p, lm.q], [ll.p, ll.q]], fit: [v3(-2.8, -2.8, z1), v3(2.8, 2.8, z2)],
      conc: 'l∥m', relText: `두 교선 l과 m: ${REL[rel]}`, rel, given: true, holds: rel === 'parallel'
    };
  }
  function geoPerp(a) {
    const tau = (1 - a) * 36, dir = v3(0, Math.sin(tau * DEG), Math.cos(tau * DEG)), O = v3(0, 0, PZ), R = 2.7;
    const lines = [
      L(v3(-R + 0.3, 0, PZ), v3(R - 0.3, 0, PZ), COL.m, { width: 3.6, name: 'm', nameAt: v3(R - 0.3, 0, PZ) }),
      L(v3(0, -R + 0.3, PZ), v3(0, R - 0.3, PZ), COL.n, { width: 3.6, name: 'n', nameAt: v3(0, R - 0.3, PZ) }),
      L(sub3(O, mul3(dir, 0.9)), add3(O, mul3(dir, 3.0)), 'amber', { width: 5.8, name: 'l', nameAt: add3(O, mul3(dir, 3.0)) })
    ];
    const angN = Math.round(90 - tau);
    return {
      lines, panels: [floorP(R)], rights: [{ O, a: v3(1, 0, 0), c: dir, color: COL.m, size: 0.4 }].concat(tau < 0.4 ? [{ O, a: v3(0, 1, 0), c: dir, color: COL.n, size: 0.4 }] : []),
      arcs: tau >= 0.4 ? [{ O, a: v3(0, 1, 0), c: dir, r: 0.75, color: COL.n }] : [],
      pars: [], fit: [v3(-R, -R, PZ - 0.9), v3(R, R, PZ + 3.3)],
      conc: 'l⊥P', relText: tau < 0.4 ? 'l은 m, n과 모두 90° → l ⊥ P' : `l과 m은 90°, l과 n은 ${angN}° → l ⊥ P 아님`, rel: 'perp', given: true, holds: tau < 0.4, angN, tau, arcText: tau >= 0.4 ? `${angN}°` : ''
    };
  }

  /* ------------------------------------------------------------ 설명 목록 */
  const pc = (v) => Math.round(v * 100) + '%', dgr = (v) => Math.round(v * 90) + '°';
  const STM = {
    p1: { geo: geoP1, truth: false, label: 'a:n의 방향, b:n의 높이', init: { a: 0, b: 0.6 }, cex: { a: 0.65, b: 0.6 }, ctl: ['spP1a', 'spP1b'], text: '서로 다른 세 직선 $l, m, n$에 대하여 $l\\perp m,\\ l\\perp n$이면 $m\\parallel n$이다.' },
    p2: { geo: geoP2, truth: false, init: { a: 0, b: 0.6 }, cex: { a: 0.65, b: 0.6 }, ctl: ['spP2a', 'spP2b'], text: '서로 다른 두 직선 $l, m$이 평면 $P$와 모두 평행하면 $l\\parallel m$이다.' },
    p3: { geo: geoP3, truth: true, init: { a: 0.2, b: 0 }, cex: { a: 0.85, b: 0 }, ctl: ['spP3a', 'spP3b'], text: '서로 다른 두 직선 $l, m$이 평면 $P$에 모두 수직이면 $l\\parallel m$이다.' },
    p4: { geo: geoP4, truth: false, init: { a: 0, b: 0.2 }, cex: { a: 0.6, b: 0.5 }, ctl: ['spP4a', 'spP4b'], text: '서로 다른 두 평면 $Q, R$이 평면 $P$에 모두 수직이면 $Q\\parallel R$이다.' },
    p5: { geo: geoP5, truth: true, init: { a: 0.3, b: 0 }, cex: { a: 0.8, b: 0 }, ctl: ['spP5a', 'spP5b'], text: '서로 다른 두 평면 $P, Q$가 직선 $l$에 모두 수직이면 $P\\parallel Q$이다.' },
    p6: { geo: geoP6, truth: false, init: { a: 0.6, b: 0.2 }, cex: { a: 0, b: 0.2 }, ctl: ['spP6a', 'spP6b'], text: '직선 $l$이 평면 $P$에 수직이고 직선 $m$이 $l$과 수직이면 $m\\parallel P$이다.' },
    door: { geo: geoDoor, truth: true, init: { a: 0.15, b: 0 }, cex: { a: 0.8, b: 0 }, ctl: ['spDoor'], text: '평면 $P$에 수직인 직선 $l$을 포함하는 평면 $Q$는 $P$와 수직이다.' },
    planes: { geo: geoPlanes, truth: true, init: { a: 0.3, b: 0 }, cex: { a: 0.8, b: 0.4 }, ctl: ['spPl1', 'spPl2'], text: '평행한 두 평면 $P, Q$를 평면 $R$로 자를 때 생기는 두 교선은 평행하다.' },
    perp: { geo: geoPerp, truth: false, init: { a: 1, b: 0 }, cex: { a: 0, b: 0 }, ctl: ['spPerp'], text: '직선 $l$이 평면 $P$ 위의 한 직선 $m$과 수직이면 $l\\perp P$이다.' }
  };
  const KEYS = { p1: ['spP1a', 'spP1b'], p2: ['spP2a', 'spP2b'], p3: ['spP3a', 'spP3b'], p4: ['spP4a', 'spP4b'], p5: ['spP5a', 'spP5b'], p6: ['spP6a', 'spP6b'], door: ['spDoor', null], planes: ['spPl1', 'spPl2'], perp: ['spPerp', null] };
  Object.keys(STM).forEach((k) => { STM[k].id = k; STM[k].keys = KEYS[k]; });

  const PARAMS = {
    spP1a: P('직선 n을 l 둘레로 돌리기', 0, 1, 0.01, 0, { color: 'amber', hint: 'n은 l과 계속 수직으로 만나요', format: dgr }),
    spP1b: P('직선 n의 높이', 0, 1, 0.01, 0.6, { color: 'amber', hint: 'm과 같은 높이로 맞춰 보세요', format: (v) => (v < 0.02 ? 'm과 같은 높이' : pc(v)) }),
    spP2a: P('직선 m을 돌리기', 0, 1, 0.01, 0, { color: 'amber', hint: '평면 P와 나란한 채로 돌아가요', format: dgr }),
    spP2b: P('직선 m의 높이', 0, 1, 0.01, 0.6, { color: 'amber', hint: 'l과 같은 높이로 맞춰 보세요', format: (v) => (v < 0.02 ? 'l과 같은 높이' : pc(v)) }),
    spP3a: P('직선 m의 자리', 0, 1, 0.01, 0.2, { color: 'amber', hint: '바닥에 수직으로 세운 m을 옮겨 보세요', format: pc }),
    spP3b: P('직선 m 기울이기', 0, 1, 0.01, 0, { color: 'rose', hint: '기울이면 P와 수직이 아니에요', format: (v) => Math.round(v * 35) + '°' }),
    spP4a: P('평면 R을 돌리기', 0, 1, 0.01, 0, { color: 'amber', hint: 'R은 바닥에 수직인 채로 돌아가요', format: dgr }),
    spP4b: P('평면 R의 자리', 0, 1, 0.01, 0.2, { color: 'amber', format: pc }),
    spP5a: P('평면 Q의 높이', 0, 1, 0.01, 0.3, { color: 'amber', hint: 'l을 따라 위아래로 옮겨요', format: pc }),
    spP5b: P('평면 Q 기울이기', 0, 1, 0.01, 0, { color: 'rose', hint: '기울이면 l과 수직이 아니에요', format: (v) => Math.round(v * 30) + '°' }),
    spP6a: P('직선 m의 높이', 0, 1, 0.01, 0.6, { color: 'amber', hint: '바닥까지 내려 보세요', format: (v) => (v < 0.02 ? '바닥(평면 P 위)' : pc(v)) }),
    spP6b: P('직선 m을 l 둘레로 돌리기', 0, 1, 0.01, 0.2, { color: 'amber', format: dgr }),
    spDoor: P('문(평면 Q) 열기', 0, 1, 0.01, 0.15, { color: 'amber', hint: '문을 열고 닫아도 바닥과 수직이에요', format: (v) => Math.round((0.15 + v * 0.7) * 180) + '°' }),
    spPl1: P('평면 R 기울이기', 0, 1, 0.01, 0.3, { color: 'amber', format: pc }),
    spPl2: P('평면 R 돌리기', 0, 1, 0.01, 0, { color: 'amber', format: (v) => Math.round(v * 60) + '°' }),
    spPerp: P('직선 l 세우기', 0, 1, 0.01, 1, { color: 'amber', hint: '왼쪽으로 가면 l이 쓰러져요', format: (v) => (v > 0.98 ? '똑바로 세움' : Math.round((1 - v) * 36) + '° 쓰러짐') })
  };

  /* ------------------------------------------------------------ 그리기 */
  // s[keys] 값(조절 막대) 또는 보간 t 로 얻은 (a, b)
  function ab(st, s) { return { a: s[st.keys[0]] == null ? st.init.a : s[st.keys[0]], b: st.keys[1] ? (s[st.keys[1]] == null ? st.init.b : s[st.keys[1]]) : 0 }; }
  function abAt(st, t) { return { a: st.init.a + (st.cex.a - st.init.a) * t, b: st.init.b + (st.cex.b - st.init.b) * t }; }
  function setAB(st, s, v) { s[st.keys[0]] = v.a; if (st.keys[1]) s[st.keys[1]] = v.b; }

  /* geo 를 그림으로. opts.caption(true) 면 맨 위에 판정 한 줄. */
  function render(D, st, v, C, opts = {}) {
    const { b } = D;
    const geo = st.geo(v.a, v.b);
    const fp = [];
    geo.panels.forEach((pn) => fp.push(...pn.pts));
    geo.lines.forEach((ln) => { fp.push(ln.p, ln.q); });
    D.fitPts(fp, { t: C.problem ? 46 : 62, b: 56, l: 44, r: 44 });
    geo.panels.slice().sort((p, q) => D.depth(mid3(p.pts[0], p.pts[2])) - D.depth(mid3(q.pts[0], q.pts[2])) > 0 ? -1 : 1).forEach((pn) => D.panel(pn.pts, pn.color, pn.fa, pn.color, 2.2));
    geo.lines.forEach((ln) => D.line(ln.p, ln.q, ln.color, ln.width, { dash: ln.dash, alpha: ln.alpha }));
    geo.rights.forEach((r) => D.right(r.O, r.a, r.c, r.size || 0.4, r.color));
    (geo.arcs || []).forEach((r) => D.arc(r.O, r.a, r.c, r.r, r.color, 1));
    geo.pars.forEach(([p, q]) => D.par(p, q, 1, 'sky', 0.35));
    if (C.txt) {
      const ctr = lerp3(geo.fit[0], geo.fit[1], 0.5);
      geo.panels.forEach((pn) => D.label(pn.nameAt, pn.name, { color: pn.color, size: 16, dir: D.out(pn.nameAt, ctr), gap: 10 }));
      geo.lines.forEach((ln) => { if (ln.name) D.label(ln.nameAt, ln.name, { color: ln.color === 'red' ? 'red' : ln.color, size: 18, dir: D.out(ln.nameAt, ctr), gap: 10 }); });
      if (geo.arcText) D.label(add3(geo.rights[0].O, v3(0, 0.55, 0.35)), geo.arcText, { color: 'rose', size: 16, dir: { x: 1, y: 0 }, gap: 8 });
      if (opts.caption !== false && !C.problem) {
        const cex = geo.given && !geo.holds, col = !geo.given ? 'rose' : cex ? 'red' : 'green';
        const txt = !geo.given ? (geo.note || '조건이 깨졌어요') : `${geo.relText}${cex ? ' → 반례!' : ''}`;
        b.stext(b.W / 2 - b.insets.right / 2, b.insets.top + 20, txt, { color: col, size: b.W < 560 ? 14.5 : 17, weight: 800, align: 'center', baseline: 'middle' });
      }
    }
    D.flush();
    return geo;
  }

  window.APL_SP.stmt = { STM, PARAMS, render, ab, abAt, setAB, KEYS, REL };
})();
