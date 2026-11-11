/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ② 「연쇄·외각」 (t2.js, order 20) — 장면 3개
   · c1 계단형 연쇄      · AB=BC=CD=DE…를 한 칸씩 이어 붙이며 밑각이 x → 2x → 3x → … 가 되는 것을 단계로 확인 (연쇄 개수 n, ∠A)
   · c2 꼭짓점 공유형    · AB=AC=CD=CE (꼭짓점 C 공유) · ∠B=x로 각을 차례로 구해 ∠EDF 찾기
   · c3 연장선 이등변    · 이등변삼각형 ABC의 변 BC를 늘여 CA=CD가 되는 점 D를 가로로 찾기
   외각의 성질(외각 = 이웃하지 않는 두 내각의 합)과 이등변삼각형의 두 밑각을 번갈아 쓰는 가장 어려운 유형입니다.
   모든 각은 정수(도)로 만들어집니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, dist, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, degOpts, rd, notes, fmtN, dg, bboxOf, fs, LET, solveCap } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const even = (v) => Math.round(v / 2) * 2;

  const PARAMS = {
    trCn: P('같은 길이의 선분 수', 2, 5, 1, 4, { color: 'sky', format: (v) => v + '개' }),
    trCx: P('∠A = x', 10, 20, 1, 20, { color: 'amber', format: (v) => v + '°' }),
    trEx: P('∠B = x', 20, 40, 2, 32, { color: 'amber', format: (v) => v + '°' }),
    trDa: P('꼭지각 ∠A', 40, 100, 4, 64, { color: 'sky', format: (v) => v + '°' }),
    trDd: P('CD의 길이', 2, 10, 1, 4, { color: 'amber', hint: '점 D를 가로로 끌어도 돼요', format: (v) => v + ' cm' })
  };
  const nameOf = (i) => LET[i]; // 0→A, 1→B …

  /* ====================================================================== 1. 계단형 연쇄 */
  // 두 반직선(A에서 가로 / A에서 x° 위)에 번갈아 길이 1인 선분을 이어 붙입니다. P0=A, P1(가로), P2(위), P3(가로)…
  function chainPts(x, n) {
    const A = pt(0, 0), u = [pt(1, 0), pt(cos(x), -sin(x))], pts = [A, add(A, u[0])];
    for (let k = 2; k <= n; k++) {
      const ray = u[(k - 1) % 2], X = pts[k - 1];
      const bq = X.x * ray.x + X.y * ray.y, cq = X.x * X.x + X.y * X.y - 1, t = bq + Math.sqrt(Math.max(0, bq * bq - cq));
      pts.push(add(A, mul(ray, t)));
    }
    return { pts, u };
  }

  /* -------------------------------------------------------------------- 풀이 흐름 (탐구 · 문제 · 풀이) — 이 장면의 문제와 같은 상태·같은 숫자로 풀이합니다.
     v0: ∠BAC=a 가 주어지고 외각 ∠(마지막 꼭짓점)=x 를 구함 · v1: 외각이 주어지고 ∠BAC=x 를 구함. 풀이 숫자는 모두 이 문제의 숫자입니다. */
  const c1v = (s) => (s.trV || 0) % 2;
  const xs = (k) => (k === 1 ? 'x' : k + 'x');
  const ovl = (i, j) => `\\overline{${nameOf(i)}${nameOf(j)}}`;
  const c1Solve = {
    quickTitle: '10초 컷 · 같은 길이 선분이 n개이면 외각 = n × ∠A',
    quick: (M, s) => {
      const { n, x: a, ans } = M, v = c1v(s);
      return {
        steps: v === 0
          ? `<p>같은 길이의 선분이 ${n}개 이어져 있으므로 외각은 $\\angle A$의 ${n}배예요.</p><p>$x=${n}\\times${a}^{\\circ}=${ans}^{\\circ}$</p>`
          : `<p>같은 길이의 선분이 ${n}개 이어져 있으므로 외각은 $\\angle A$의 ${n}배, 곧 $${n}x=${ans}^{\\circ}$예요.</p><p>$x=\\frac{${ans}^{\\circ}}{${n}}=${a}^{\\circ}$</p>`,
        note: '밑각이 x, 2x, 3x, … 로 한 칸씩 커지므로, 선분의 개수만 세면 바로 알 수 있어요.'
      };
    },
    steps: (M, s) => {
      const { n, x: a, ans } = M, v = c1v(s), L = nameOf, out = [];
      const A1 = `\\angle ${L(1)}${L(0)}${L(2)}`, EXT = `\\angle ${L(n)}${L(n - 1)}${L(n + 1)}`, INT = `\\angle ${L(0)}${L(n - 1)}${L(n)}`, LASTB = `\\angle ${L(0)}${L(n)}${L(n - 1)}`;
      const eqT = Array.from({ length: n }, (_, i) => `\\overline{${L(i)}${L(i + 1)}}`).join('=');
      const eqP = Array.from({ length: n }, (_, i) => `${L(i)}${L(i + 1)}`).join('=');
      const val = (k) => (v === 0 ? `${k * a}^{\\circ}` : xs(k)), valP = (k) => (v === 0 ? `${k * a}°` : xs(k));
      const exP = `∠${L(n)}${L(n - 1)}${L(n + 1)}`, a1P = `∠${L(1)}${L(0)}${L(2)}`;
      out.push({ k: 'given', t: v === 0 ? `$${eqT}$이고 $${A1}=${a}^{\\circ}$예요. 구하는 것은 $${EXT}=x$.` : `$${eqT}$이고 $${EXT}=${ans}^{\\circ}$예요. 구하는 것은 $${A1}=x$.`, cap: v === 0 ? `${eqP}, ${a1P}=${a}°` : `${eqP}, ${exP}=${ans}°` });
      out.push({ k: 'idea', t: '이등변삼각형이면 두 밑각이 같고, 외각은 이웃하지 않는 두 내각의 합이에요. 이 둘을 번갈아 써요.', cap: '이등변 → 밑각이 같다, 외각 = 이웃하지 않는 두 내각의 합' });
      for (let j = 1; j <= n - 1; j++) {
        if (j === 1) out.push({ k: 'fig', j, lb: '각 구하기', t: `$${ovl(0, 1)}=${ovl(1, 2)}$이므로 △${L(0)}${L(1)}${L(2)}는 이등변삼각형이에요. 두 밑각이 같으므로 $\\angle ${L(1)}${L(2)}${L(0)}=\\angle ${L(1)}${L(0)}${L(2)}=${val(1)}$.`, cap: `${L(0)}${L(1)}=${L(1)}${L(2)} → ∠${L(1)}${L(2)}${L(0)}=∠${L(0)}=${valP(1)}` });
        else out.push({ k: 'fig', j, lb: '각 구하기', t: `$\\angle ${L(j)}${L(j - 1)}${L(j + 1)}$는 △${L(0)}${L(j - 1)}${L(j)}의 외각이므로 $${A1}+\\angle ${L(0)}${L(j)}${L(j - 1)}=${v === 0 ? `${a}^{\\circ}+${(j - 1) * a}^{\\circ}` : `x+${xs(j - 1)}`}=${val(j)}$. $${ovl(j - 1, j)}=${ovl(j, j + 1)}$이므로 $\\angle ${L(j)}${L(j + 1)}${L(j - 1)}=${val(j)}$.`, cap: `외각 ∠${L(j)}${L(j - 1)}${L(j + 1)}=${v === 0 ? `${a}°+${(j - 1) * a}°` : `x+${xs(j - 1)}`}=${valP(j)} → ∠${L(j)}${L(j + 1)}${L(j - 1)}=${valP(j)}` });
      }
      if (v === 0) {
        out.push({ k: 'eq', t: `$${EXT}$는 △${L(0)}${L(n - 1)}${L(n)}의 외각이므로 $x=${A1}+${LASTB}=${a}^{\\circ}+${(n - 1) * a}^{\\circ}=${ans}^{\\circ}$.`, cap: `x=∠${L(0)}+∠${L(0)}${L(n)}${L(n - 1)}=${a}°+${(n - 1) * a}°=${ans}°` });
        out.push({ k: 'ans', t: `$x=${ans}^{\\circ}$`, cap: `x = ${ans}°` });
        out.push({ k: 'trap', t: `$${INT}=180^{\\circ}-${a}^{\\circ}-${(n - 1) * a}^{\\circ}=${180 - ans}^{\\circ}$처럼 안쪽 각을 구하면 안 돼요. $x$는 바깥쪽 각 $${EXT}$이고, 외각은 이웃하지 않는 두 내각의 합이에요. (안쪽 각과 바깥쪽 각의 합은 $180^{\\circ}$)`, cap: `∠${L(0)}${L(n - 1)}${L(n)}=${180 - ans}°는 안쪽 각이라 틀려요 → 바깥쪽 각 x=${ans}°` });
      } else {
        out.push({ k: 'eq', t: `$${EXT}=${A1}+${LASTB}=x+${xs(n - 1)}=${xs(n)}$이고 $${EXT}=${ans}^{\\circ}$이므로 $${xs(n)}=${ans}^{\\circ}$, $x=\\frac{${ans}^{\\circ}}{${n}}=${a}^{\\circ}$.`, cap: `x+${xs(n - 1)}=${xs(n)}=${ans}° → x=\\frac{${ans}}{${n}}=${a}°` });
        out.push({ k: 'ans', t: `$x=${a}^{\\circ}$`, cap: `x = ${a}°` });
        out.push({ k: 'trap', t: `외각 $${EXT}$를 안쪽 밑각 $${LASTB}=${xs(n - 1)}$와 같다고 놓으면 $${xs(n - 1)}=${ans}^{\\circ}$, $x=\\frac{${ans}^{\\circ}}{${n - 1}}$${G.josa(n - 1, '이', '가')} 되어 틀려요. 외각은 $x$와 $${xs(n - 1)}$의 합이에요.`, cap: `${xs(n - 1)}=${ans}° 로 놓으면 틀려요 (외각 = x+${xs(n - 1)})` });
      }
      return out;
    },
    draw(b, s, M, C, ST, idx) {
      const { n, x: a, pts, ext, ans } = M, v = c1v(s), L = nameOf, cur = idx >= 0 ? ST[idx] : null, K = cur ? cur.k : 'problem', FD = G.faded;
      const concept = C.lesson && s.trLessonProblem === false;
      const all = pts.concat([ext, add(pts[n], mul(unit(sub(pts[n], pts[0])), 0.5))]);
      fit(b, bboxOf(all), { t: 52, b: b.W < 560 ? 100 : 96, l: 42, r: 50 });
      const cen = pt((pts[0].x + pts[n].x) / 2, (pts[0].y + pts[n].y) / 2 + 0.2);
      const reach = [0, 0];
      for (let k = 1; k <= n; k++) { const r = (k - 1) % 2; reach[r] = Math.max(reach[r], dist(pts[0], pts[k])); }
      reach[(n - 2) % 2] = Math.max(reach[(n - 2) % 2], dist(pts[0], ext));
      [0, 1].forEach((r) => line(b, pts[0], add(pts[0], mul(M.u[r], reach[r] + 0.3)), 'ink', 3, { alpha: 0.75 }));
      const hiSeg = K === 'given';
      for (let k = 1; k <= n; k++) { line(b, pts[k - 1], pts[k], hiSeg ? 'sky' : 'ink', hiSeg ? 4.4 : 3.6); tick(b, pts[k - 1], pts[k], 1, 'amber'); }
      // 원칙: 그림 안에는 점 이름과 값만 · 지금 단계가 다루는 각만 색 · 지난 단계는 가는 회색 · 한 꼭짓점에 색 호는 하나
      const cols = ['sky', 'green', 'violet'], col = (j) => cols[(j - 1) % 3];
      const lbl = (k) => (v === 0 ? dg(k * a) : xs(k));
      const done = idx >= 2 ? Math.min(n - 1, idx - 1) : 0, now = cur && cur.k === 'fig' ? cur.j : 0, eqNow = K === 'eq', ansNow = K === 'ans', trapNow = K === 'trap';
      if (K === 'idea') fillPoly(b, [pts[0], pts[1], pts[2]], 'violet', 0.16);
      if (now) fillPoly(b, [pts[now - 1], pts[now], pts[now + 1]], col(now), 0.2);
      const last = pts[n - 1], A0 = pts[0], first = pts[1], second = pts[2];
      // 연쇄로 구한 밑각: 이번 단계(색, 값은 한 곳에만) / 지난 단계(회색, 값 없음)
      for (let j = 1; j <= done; j++) {
        const isNow = j === now, recol = eqNow && j === n - 1; // 식 단계에서는 ∠AED 만 다시 색을 입힙니다
        const r1 = 28 + (j % 2) * 4;
        if (j === 1) { if (isNow) ang(b, pts[2], pts[1], pts[0], { color: col(1), rings: 1, r: 28, label: lbl(1), size: 15, labelDist: 54, fa: 0.42 }); else FD(b, pts[2], pts[1], pts[0], { rings: 1, r: 28 }); continue; }
        if (isNow) {
          ang(b, pts[j - 1], pts[j], pts[j + 1], { color: col(j), rings: j, r: r1, fa: 0.42 }); // 같은 호 개수로 같은 각 표시
          ang(b, pts[j + 1], pts[j], pts[j - 1], { color: col(j), rings: j, r: 28, label: lbl(j), size: 15, labelDist: 54, fa: 0.42 });
        } else {
          FD(b, pts[j - 1], pts[j], pts[j + 1], { rings: j, r: r1 });
          if (recol) ang(b, pts[j + 1], pts[j], pts[j - 1], { color: col(j), rings: j, r: 28, label: lbl(j), size: 15, labelDist: 54, fa: 0.42 }); else FD(b, pts[j + 1], pts[j], pts[j - 1], { rings: j, r: 28 });
        }
      }
      // ∠BAC=A (꼭짓점 A) 와 바깥각 (마지막 꼭짓점) — 주어진 값 또는 구하는 x
      const Aang = (o) => ang(b, A0, first, second, { r: 36, labelDist: 74, labelRot: -(a / 2 + 12), ...o });
      const Eang = (o) => ang(b, last, pts[n], ext, { r: 38, labelDist: o.label && o.label.length > 3 ? 74 : 62, ...o });
      const subj = K === 'problem' || K === 'given' || eqNow || ansNow; // 이 단계에서 주어진 각/구하는 각이 주인공인가
      const xl = (val) => ({ label: val, size: val.length > 1 ? 17 : 18 });
      if (v === 0) {
        // 주어진 ∠A=a: 주어진 것·식에서 색, 그 밖에는 값만 남긴 회색
        if (K === 'problem' || K === 'given' || eqNow) Aang({ color: 'sky', ...xl(dg(a)), fa: K === 'given' || eqNow ? 0.42 : 0.2 }); else Aang({ color: 'ink', alpha: 0.38, w: 1.4, fa: 0, labelColor: 'ink', ...xl(dg(a)) });
        // 구하는 x(바깥각): 호는 주인공일 때만, 아니면 글자 x 만
        if (K === 'problem' || K === 'given' || eqNow) Eang({ color: 'amber', ...xl('x'), fa: eqNow ? 0.42 : 0.22 });
        else if (ansNow) Eang({ color: 'amber', ...xl(`x=${ans}°`), fa: 0.42 });
        else Eang({ color: 'amber', noMark: true, ...xl(trapNow ? `x=${ans}°` : 'x') });
        if (trapNow) { // 흔한 실수: 안쪽 각 ∠ADE 를 구해 버림 (라벨은 바로 앞 선분과 마지막 선분 사이)
          const dr = (p) => Math.atan2(p.y - last.y, p.x - last.x), wr = (d) => ((d + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
          const a0 = dr(pts[0]), a1 = dr(pts[n]), ap = dr(pts[Math.max(0, n - 2)]), am = a0 + wr(a1 - a0) / 2, cw = ap + wr(a1 - ap) / 2;
          ang(b, last, pts[0], pts[n], { color: 'rose', r: 24, label: dg(180 - ans), size: 15, labelDist: 56, labelRot: wr(cw - am) / DEG, fa: 0.3 });
        }
      } else {
        if (K === 'problem' || K === 'given' || eqNow) Aang({ color: 'amber', ...xl('x'), fa: eqNow ? 0.42 : 0.22 });
        else if (ansNow) Aang({ color: 'amber', ...xl(concept ? 'x' : `x=${a}°`), fa: 0.42 });
        else { Aang({ color: 'ink', alpha: 0.38, w: 1.4, fa: 0, labelColor: 'ink' }); Aang({ color: 'amber', noMark: true, ...xl('x') }); }
        const exterior = concept ? C.answer ? `${n}x` : '?' : dg(ans);
        if (K === 'problem' || K === 'given' || eqNow) Eang({ color: 'sky', ...xl(exterior), fa: K === 'given' || eqNow ? 0.42 : 0.2 }); else Eang({ color: 'ink', alpha: 0.38, w: 1.4, fa: 0, labelColor: 'ink', ...xl(exterior) });
        if (trapNow) ang(b, pts[n], pts[n - 1], pts[0], { color: 'rose', r: 28, rings: Math.max(1, n - 1), label: xs(n - 1), size: 15, labelDist: 54, fa: 0.4 });
      }
      // 식 단계: 식에 쓰이는 안쪽 밑각 ∠AED 와 (v1) 바깥각 값을 색으로 다시
      void subj;
      pts.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cen, L(i), { size: 18, gap: 11 }); });
      b.point(ext, { color: 'ink', r: 3.5 }); T(b, ext, L(n + 1), { dx: 10, dy: -12, size: 18 });
      if (cur) solveCap(b, pt((pts[0].x + pts[n].x) / 2, 0), cur, { dy: b.W < 560 ? 40 : 52 });
    }
  };

  const c1 = {
    id: 't2-1', title: '계단형 연쇄: x → 2x → 3x → …', short: '계단형 연쇄', solve: c1Solve,
    question: 'AB=BC=CD=DE처럼 같은 길이의 선분을 두 직선 사이에 번갈아 이어 붙이면, 밑각은 어떻게 커질까?',
    ctl: ['trCn', 'trCx'],
    init: (s) => { s.trCn = 4; s.trCx = 20; s.trV = 0; },
    reroll: (s) => { s.trCn = pick(window.innerWidth < 560 ? [3, 4, 4] : [3, 4, 4, 5], s.trCn); // 휴대폰에서는 선분 5개 연쇄가 너무 좁아 4개까지만
      s.trCx = pick([12, 14, 15, 16, 18, 20], s.trCx); s.trV = (s.trV + 1 + rint(0, 1)) % 2; },
    model: (s) => {
      const n = clamp(Math.round(s.trCn), 2, 5), x = clamp(Math.round(s.trCx), 10, 20), { pts, u } = chainPts(x, n);
      const dir = u[(n - 2) % 2], last = pts[n - 1], ext = add(last, mul(dir, 0.6)); // P_{n-1} 에서 반직선 방향으로 연장한 점
      return { n, x, pts, u, ext, last, ans: n * x };
    },
    draw(b, s, M, C) {
      const { n, x, pts, ext, last } = M, st = C.step, v = (s.trV || 0) % 2;
      const upto = C.problem ? n : C.review ? Math.min(n, st) : n; // 단계 j까지 보임
      const all = pts.concat([ext, add(pts[n], mul(unit(sub(pts[n], pts[0])), 0.5))]);
      fit(b, bboxOf(all), { t: 48, b: C.problem ? 50 : 96, l: 42, r: 50 });
      const cen = pt((pts[0].x + pts[n].x) / 2, (pts[0].y + pts[n].y) / 2 + 0.2);
      // 두 반직선
      const reach = [0, 0];
      for (let k = 1; k <= n; k++) { const r = (k - 1) % 2; reach[r] = Math.max(reach[r], dist(pts[0], pts[k])); }
      reach[(n - 2) % 2] = Math.max(reach[(n - 2) % 2], dist(pts[0], ext));
      [0, 1].forEach((r) => line(b, pts[0], add(pts[0], mul(M.u[r], reach[r] + 0.3)), 'ink', 3, { alpha: 0.75 }));
      for (let k = 1; k <= n; k++) { line(b, pts[k - 1], pts[k], 'ink', 3.6); tick(b, pts[k - 1], pts[k], 1, 'amber'); }
      // 삼각형 j (꼭지 P_j): 밑각 두 개 = j·x
      const cols = ['sky', 'green', 'violet', 'amber', 'rose'];
      for (let j = 1; j <= n - 1; j++) {
        const show = C.problem ? false : j <= upto && (C.review ? j <= st : true);
        if (!show) continue;
        const col = cols[(j - 1) % 5], lbl = dg(j * x), P0 = pts[j - 1], Pj = pts[j], P2 = pts[j + 1];
        if (j === 1) ang(b, P0, Pj, P2, { color: col, rings: 1, r: 32, label: lbl, size: 15, labelDist: 70, labelRot: -(x / 2 + 12) });
        else ang(b, P0, Pj, P2, { color: col, rings: j, r: 28 + (j % 2) * 4, label: lbl, size: 15, labelDist: 54 });
        ang(b, P2, Pj, P0, { color: col, rings: j, r: 28, label: lbl, size: 15, labelDist: 54 });
      }
      // 구하는 외각 (P_{n-1}에서)
      const lastFirst = pts[n], lastPrev = pts[n - 1];
      if (C.problem) {
        if (v === 0) { ang(b, lastPrev, lastFirst, ext, { color: 'amber', r: 38, label: 'x', size: 18, rings: 1, labelDist: 62 }); ang(b, pts[0], pts[1], pts[2], { color: 'sky', r: 36, label: dg(x), size: 16, labelDist: 74, labelRot: -(x / 2 + 12) }); }
        else { ang(b, lastPrev, lastFirst, ext, { color: 'sky', r: 38, label: dg(n * x), size: 16, rings: 1, labelDist: 62 }); ang(b, pts[0], pts[1], pts[2], { color: 'amber', r: 36, label: 'x', size: 18, labelDist: 74, labelRot: -(x / 2 + 12) }); }
      } else if (!C.review || st >= n) ang(b, lastPrev, lastFirst, ext, { color: 'amber', r: 38, label: dg(n * x), size: 16, rings: 1, labelDist: 62 });
      // 점 이름
      pts.forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, cen, nameOf(i), { size: 18, gap: 11 }); });
      b.point(ext, { color: 'ink', r: 3.5 }); T(b, ext, nameOf(n + 1), { dx: 10, dy: -12, size: 18 });
      void last;
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        const seq = Array.from({ length: n }, (_, j) => (j === 0 ? 'x' : (j + 1) + 'x')).join(' → ');
        if (C.review && st < n) row = seq.split(' → ').slice(0, st).join(' → ');
        else row = `x=${x}° → ${Array.from({ length: n }, (_, j) => (j + 1) * x + '°').join(' → ')}`;
        if (!C.review || st >= n) col = 'amber';
        rowT(b, pt((pts[0].x + pts[n].x) / 2, 0), row, { dy: b.W < 560 ? 40 : 52, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => {
      const { n, x } = M, L = (i) => nameOf(i), out = [];
      for (let j = 1; j <= n - 1; j++) {
        if (j === 1) out.push(`$\\overline{${L(0)}${L(1)}}=\\overline{${L(1)}${L(2)}}$이므로 △${L(0)}${L(1)}${L(2)}는 이등변삼각형이에요. 두 밑각 $\\angle ${L(1)}${L(2)}${L(0)}=\\angle ${L(0)}=x=${x}^{\\circ}$예요.`);
        else out.push(`$\\angle ${L(j)}${L(j - 1)}${L(j + 1)}$는 △${L(0)}${L(j - 1)}${L(j)}의 외각이므로 $\\angle ${L(0)}+\\angle ${L(0)}${L(j)}${L(j - 1)}=x+${j - 1}x=${j}x=${j * x}^{\\circ}$예요. $\\overline{${L(j)}${L(j - 1)}}=\\overline{${L(j)}${L(j + 1)}}$이므로 두 밑각이 같아요.`);
      }
      out.push(`구하는 $\\angle ${L(n)}${L(n - 1)}${L(n + 1)}$는 △${L(0)}${L(n - 1)}${L(n)}의 외각이므로 $\\angle ${L(0)}+\\angle ${L(0)}${L(n)}${L(n - 1)}=x+${n - 1}x=${n}x=${n * x}^{\\circ}$예요.`);
      return out;
    },
    view: (M) => ({
      guide: '막대로 <b>선분의 수</b>와 <b>∠A=x</b>를 바꿔 보세요. 같은 길이의 선분을 이어 붙이면 밑각이 <b>x → 2x → 3x → …</b>로 한 칸씩 커져요. 같은 호의 개수 = 같은 각이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A = x', `${M.x}°`, 'sky'), rd('같은 길이의 선분', `${M.n}개`, 'sky'), rd('구하는 외각', dg(M.ans), 'amber', `${M.n}x`, null, true)],
      formula: `<p>밑각: $x\\to 2x\\to 3x\\to\\cdots$</p><p>(구하는 외각) $=${M.n}x=${M.n}\\times${M.x}^{\\circ}=${M.ans}^{\\circ}$</p>`,
      rule: '이등변삼각형의 밑각과 외각의 성질을 번갈아 쓰면 밑각이 x, 2x, 3x, …로 한 칸씩 커진다.',
      notes: notes('<b>외각 = 이웃하지 않는 두 내각의 합</b>이에요. 매번 ∠A=x와 바로 앞 밑각을 더해요.', '이등변삼각형이 끝나는 곳에서 멈춰요. 같은 길이 선분이 ' + M.n + '개이면 구하는 외각은 ' + M.n + 'x예요.')
    }),
    prob: (M, s) => {
      const { n, x, ans } = M, v = (s.trV || 0) % 2, L = (i) => nameOf(i);
      const eq = Array.from({ length: n }, (_, i) => `${L(i)}${L(i + 1)}`).map((q) => S(q)).join('=');
      const ext = `∠${L(n)}${L(n - 1)}${L(n + 1)}`;
      if (v === 0) return numProb({ tag: '[함정] 이등변삼각형의 연쇄와 외각', key: `0:${n}:${x}`, stem: `그림에서 ${eq}이고 ∠${L(1)}${L(0)}${L(2)}=${x}°일 때, ${ext}의 크기 $x$는?`, correct: ans, wrongs: [[(n - 1) * x, '외각이 아니라 바로 앞 밑각이에요. 한 번 더 이어 구해요.'], [(n + 1) * x, '한 칸 더 갔어요. 선분이 ' + n + '개면 ' + n + '배예요.'], [180 - ans, '외각이 아니라 이웃한 내각이에요.'], [2 * x * (n - 1), '밑각을 두 번 더했어요.'], [ans + 10, '다시 계산해 보세요.']], ...degOpts(5) });
      return numProb({ tag: '이등변삼각형의 연쇄 (거꾸로 구하기)', key: `1:${n}:${x}`, stem: `그림에서 ${eq}이고 ${ext}=${ans}°일 때, ∠${L(1)}${L(0)}${L(2)}의 크기 $x$는?`, correct: x, wrongs: [[ans / (n + 1), '선분이 ' + n + '개이면 외각은 ' + n + 'x예요. ' + n + '으로 나누어야 해요.'], [ans / (n - 1), '선분이 ' + n + '개이면 외각은 ' + n + 'x예요.'], [ans - x, '다시 생각해 보세요.'], [180 - ans, '이웃한 내각을 구했어요.'], [x + 2, '다시 계산해 보세요.'], [x - 2, '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0])), ...degOpts(2) });
    },
    verify: (s) => { const M = c1.model(s), p = M.pts, n = M.n; return { ans: angBetween(p[n - 1], p[n], M.ext), model: M.ans, extra: [[angBetween(p[0], p[1], p[2]), M.x]] }; }
  };

  /* ====================================================================== 2. 꼭짓점 공유형 */
  // B 가 두 반직선의 시작점. 아래 반직선(가로): B, C, E. 위 반직선(x° 위): B, A, D, F. AB=AC=CD=CE
  function shareGeom(x) {
    const B = pt(0, 0), u1 = pt(cos(x), -sin(x)), A = u1, C = pt(2 * cos(x), 0), t = 4 * cos(x) * cos(x) - 1, D = mul(u1, t), E = pt(C.x + 1, 0), F = mul(u1, t + 0.55);
    return { B, A, C, D, E, F };
  }
  const c2 = {
    id: 't2-2', title: '꼭짓점을 공유하는 이등변삼각형', short: '꼭짓점 공유형',
    question: 'AB=AC=CD=CE처럼 한 꼭짓점 C를 공유하는 이등변삼각형이 이어질 때, 각을 어떤 순서로 구할까?',
    ctl: ['trEx'],
    init: (s) => { s.trEx = 32; s.trV = 0; },
    reroll: (s) => { s.trEx = pick([24, 28, 30, 32, 34, 36, 40], s.trEx); s.trV = (s.trV + 1 + rint(0, 1)) % 3; },
    model: (s) => {
      const x = clamp(even(s.trEx), 20, 40), g = shareGeom(x), cde = (180 - 3 * x) / 2, edf = 90 - x / 2;
      return { x, g, cde, edf, a2: 2 * x, c3: 3 * x };
    },
    draw(b, s, M, C) {
      const { x, g, cde, edf } = M, { B, A, C: Cc, D, E, F } = g, st = C.step, v = (s.trV || 0) % 3;
      const sh = (n) => (C.problem ? false : C.review ? st >= n : true);
      fit(b, bboxOf([B, A, Cc, D, E, F]), { t: 46, b: C.problem ? 46 : 96, l: 40, r: 44 });
      const cen = pt((B.x + E.x) / 2, (B.y + F.y) / 2 + 0.1);
      line(b, B, E, 'ink', 3.4); line(b, B, F, 'ink', 3.4);
      line(b, A, Cc, 'ink', 3.4); line(b, Cc, D, 'ink', 3.4); line(b, D, E, 'ink', 3.4);
      [[B, A], [A, Cc], [Cc, D], [Cc, E]].forEach(([p, q]) => tick(b, p, q, 1, 'amber'));
      // 각 표시 (x → 2x → 3x → (180−3x)/2 → 구하는 각)
      if (C.problem) {
        if (v === 0) { ang(b, B, Cc, A, { color: 'sky', r: 40, label: dg(x), size: 16, labelDist: 64 }); ang(b, D, E, F, { color: 'amber', r: 34, label: 'x', size: 18, labelDist: 56 }); }
        else if (v === 1) { ang(b, B, Cc, A, { color: 'sky', r: 40, label: dg(x), size: 16, labelDist: 64 }); ang(b, D, Cc, E, { color: 'amber', r: 34, label: 'x', size: 18, labelDist: 56 }); }
        else { ang(b, D, E, F, { color: 'sky', r: 34, label: dg(edf), size: 16, labelDist: 56 }); ang(b, B, Cc, A, { color: 'amber', r: 40, label: 'x', size: 18, labelDist: 64 }); }
      } else {
        ang(b, B, Cc, A, { color: 'sky', r: 40, rings: 1, label: dg(x), size: 15, labelDist: 66 });
        if (sh(1)) ang(b, Cc, A, B, { color: 'sky', r: 26, rings: 1, label: dg(x), size: 15, labelDist: 44 });
        if (sh(2)) { ang(b, A, Cc, D, { color: 'green', r: 30, rings: 2, label: dg(2 * x), size: 15, labelDist: 52 }); ang(b, D, A, Cc, { color: 'green', r: 30, rings: 2, label: dg(2 * x), size: 15, labelDist: 52 }); }
        if (sh(3)) { ang(b, Cc, D, E, { color: 'violet', r: 36, rings: 1, label: dg(3 * x), size: 15, labelDist: 62 }); ang(b, D, E, Cc, { color: 'rose', r: 26, rings: 3, label: dg(cde), size: 14, labelDist: 46 }); ang(b, E, Cc, D, { color: 'rose', r: 26, rings: 3, label: dg(cde), size: 14, labelDist: 46 }); }
        if (sh(4)) ang(b, D, E, F, { color: 'amber', r: 40, rings: 1, label: dg(edf), size: 16, labelDist: 62 });
      }
      [B, A, Cc, D, E, F].forEach((p) => b.point(p, { color: 'ink', r: 4.5 }));
      ['B', 'A', 'C', 'D', 'E', 'F'].forEach((nmm, i) => { const p = [B, A, Cc, D, E, F][i]; tagOut(b, p, cen, nmm, { size: 18, gap: 11 }); });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AB=AC → ∠ACB=∠B=${x}°`;
        else if (C.review && st === 2) { row = `∠CAD=${x}°+${x}°=${2 * x}°, CA=CD → ∠CDA=${2 * x}°`; col = 'green'; }
        else if (C.review && st === 3) { row = `∠DCE=${x}°+${2 * x}°=${3 * x}°, CD=CE → ∠CDE=${cde}°`; col = 'violet'; }
        else row = `∠B=${x}° → ∠CAD=2x → ∠DCE=3x → ∠EDF=${edf}°`;
        if (!C.review || st >= 4) col = 'amber';
        rowT(b, pt((B.x + E.x) / 2, 0), row, { dy: b.W < 560 ? 44 : 54, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `$\\overline{AB}=\\overline{AC}$이므로 $\\angle ACB=\\angle B=x=${M.x}^{\\circ}$예요.`,
      `$\\angle CAD$는 △ABC의 외각이므로 $\\angle B+\\angle ACB=2x=${M.a2}^{\\circ}$. $\\overline{CA}=\\overline{CD}$이므로 $\\angle CDA=\\angle CAD=${M.a2}^{\\circ}$예요.`,
      `$\\angle DCE$는 △BCD의 외각이므로 $\\angle B+\\angle CDB=x+2x=3x=${M.c3}^{\\circ}$. $\\overline{CD}=\\overline{CE}$이므로 $\\angle CDE=\\angle CED=${fr(`180^{\\circ}-${M.c3}^{\\circ}`, 2)}=${M.cde}^{\\circ}$예요.`,
      `점 D에서 일직선이므로 $\\angle EDF=180^{\\circ}-\\angle CDA-\\angle CDE=180^{\\circ}-${M.a2}^{\\circ}-${M.cde}^{\\circ}=${M.edf}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠B=x</b>를 바꿔 보세요. 정리 탭에서 단계를 넘기면 ∠ACB → ∠CAD → ∠DCE → ∠CDE → ∠EDF 순서로 각이 하나씩 나타나요. 길이가 같은 변(눈금)은 AB, AC, CD, CE예요.',
      readouts: [rd('∠B = ∠ACB', `${M.x}°`, 'sky'), rd('∠CAD = ∠CDA', `${M.a2}°`, 'green'), rd('∠DCE', `${M.c3}°`, 'violet'), rd('∠EDF', `${M.edf}°`, 'amber', `90° − x÷2`, null, true)],
      formula: `<p>$\\angle EDF=180^{\\circ}-2x-${fr(`180^{\\circ}-3x`, 2)}=90^{\\circ}-${fr('x', 2)}$</p><p>$=90^{\\circ}-${fr(String(M.x), 2)}=${M.edf}^{\\circ}$</p>`,
      rule: '외각 = 이웃하지 않는 두 내각의 합, 이등변삼각형의 두 밑각은 같다 → 각을 차례로 이어 구한다.',
      notes: notes('같은 눈금의 선분이 만나는 점(꼭지점)을 먼저 찾아요. A는 AB=AC, C는 CA=CD=CE의 꼭지점이에요.', '∠CDE는 ∠CDA와 다른 각이에요. ∠CDA는 CA=CD로, ∠CDE는 CD=CE로 구해요.')
    }),
    prob: (M, s) => {
      const { x, edf, c3, a2 } = M, v = (s.trV || 0) % 3, key = `${v}:${x}`;
      const given = 'AB=AC=CD=CE';
      const stem0 = `그림에서 ${S('AB')}=${S('AC')}=${S('CD')}=${S('CE')}이고`;
      if (v === 0) return numProb({ tag: '[함정] 이등변삼각형 연쇄 · 꼭짓점 공유', key, stem: `${stem0} ∠B=${x}°일 때, ∠EDF의 크기 $x$는?`, correct: edf, wrongs: [[a2, '∠CDA예요. ∠EDF는 일직선에서 ∠CDA와 ∠CDE를 뺀 각이에요.'], [c3, '∠DCE예요.'], [(180 - c3) / 2, '∠CDE예요. ∠EDF는 일직선(180°)에서 두 각을 빼요.'], [180 - a2, '일직선에서 ∠CDA만 뺐어요. ∠CDE도 빼야 해요.'], [edf + 10, '다시 계산해 보세요.']], ...degOpts(5) });
      if (v === 1) return numProb({ tag: '이등변삼각형 연쇄 · 꼭짓점 공유 (외각)', key, stem: `${stem0} ∠B=${x}°일 때, ∠CDE의 크기 $x$는?`, correct: (180 - c3) / 2, wrongs: [[a2, '∠CDA예요.'], [c3, '∠DCE예요. CD=CE이므로 이 각이 꼭지각이에요.'], [180 - c3, '꼭지각을 180°에서 뺀 값이에요. 반으로 나누어야 해요.'], [edf, '∠EDF예요.'], [x, '∠B예요.']], ...degOpts(5) });
      return numProb({ tag: '이등변삼각형 연쇄 · 거꾸로 구하기', key, stem: `${stem0} ∠EDF=${edf}°일 때, ∠B의 크기 $x$는?`, correct: x, wrongs: [[edf, '∠EDF 그대로예요. ∠B를 구해야 해요.'], [180 - edf, '다시 생각해 보세요.'], [90 - edf, '다시 계산해 보세요.'], [2 * x, '다시 생각해 보세요.'], [x + 4, '다시 계산해 보세요.'], [x - 4, '다시 계산해 보세요.']], ...degOpts(4) });
    },
    verify: (s) => { const M = c2.model(s), g = M.g; return { ans: angBetween(g.D, g.E, g.F), model: M.edf, extra: [[angBetween(g.D, g.C, g.E), M.cde], [angBetween(g.D, g.C, g.A), M.a2], [angBetween(g.A, g.C, g.D), M.a2], [angBetween(g.C, g.B, g.A), M.x], [angBetween(g.E, g.C, g.D), M.cde], [angBetween(g.C, g.D, g.E), M.c3]] }; }
  };

  /* ====================================================================== 3. 연장선 위의 점 D */
  const L3 = 6;
  const c3 = {
    id: 't2-3', title: '변을 늘인 연장선 위의 이등변삼각형', short: '연장선 이등변',
    question: '이등변삼각형 ABC에서 변 BC를 늘인 선 위에 CA=CD가 되는 점 D를 잡으면 각은 어떻게 될까?',
    ctl: ['trDa', 'trDd'],
    init: (s) => { s.trDa = 64; s.trDd = 4; s.trV = 0; },
    reroll: (s) => { s.trDa = pick([44, 52, 56, 60, 64, 68, 76, 84, 100], s.trDa); s.trV = (s.trV + 1 + rint(0, 1)) % 3; },
    model: (s) => {
      const a = clamp(Math.round(s.trDa / 4) * 4, 40, 100), b = (180 - a) / 2, d = clamp(Math.round(s.trDd), 2, 10), h = (a * DEG) / 2;
      const Bp = pt(-sin(a / 2), 0), Cp = pt(sin(a / 2), 0), A = pt(0, -cos(a / 2)), D = pt(Cp.x + d / L3, 0);
      return { a, b, d, eq: d === L3, A, B: Bp, C: Cp, D, ext: 180 - b, cad: b / 2, bad: a + b / 2, h };
    },
    draw(b, s, M, C) {
      const { a, b: bb, d, eq, A, B, C: Cc, D } = M, st = C.step, v = (s.trV || 0) % 3;
      const Dp = C.problem || C.review ? pt(Cc.x + 1, 0) : D; // 문제·정리에서는 CD=CA인 점
      const Dd = C.problem || C.review ? Dp : D;
      const E = pt(Dd.x + 0.35, 0);
      fit(b, bboxOf([A, B, Cc, pt(Cc.x + 1.35, 0)]), { t: 46, b: C.problem ? 46 : 96, l: 44, r: 44 });
      const cen = pt(0, A.y * 0.4);
      const eqNow = C.problem || C.review ? true : eq;
      fillPoly(b, [A, B, Cc], 'sky', 0.1);
      poly(b, [A, B, Cc], 'ink', 3.6);
      line(b, Cc, E, 'ink', 3.4); line(b, A, Dd, 'ink', 3.4);
      tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      if (eqNow) tick(b, Cc, Dd, 1, 'amber');
      if (C.problem) {
        if (v === 0) { ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56 }); ang(b, Dd, Cc, A, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
        else if (v === 1) { ang(b, B, Cc, A, { color: 'sky', r: 30, label: dg(bb), size: 16, labelDist: 52 }); ang(b, Dd, Cc, A, { color: 'amber', r: 30, label: 'x', size: 17, labelDist: 50 }); }
        else { ang(b, A, B, Cc, { color: 'sky', r: 26, label: dg(a), size: 16, labelDist: 66, labelRot: 6 }); ang(b, A, B, Dd, { color: 'amber', r: 54 }); { const uc = unit(sub(Cc, A)), ud = unit(sub(Dd, A)), um = unit(add(uc, ud)); T(b, A, 'x', { dx: um.x * 84, dy: um.y * 84, size: 17, color: 'amber' }); } }
      } else {
        ang(b, A, B, Cc, { color: 'sky', r: 32, rings: 1, label: dg(a), size: 15, labelDist: 54 });
        ang(b, B, Cc, A, { color: 'green', r: 30, rings: 2, label: dg(bb), size: 15, labelDist: 54 });
        ang(b, Cc, A, B, { color: 'green', r: 30, rings: 2, label: dg(bb), size: 15, labelDist: 54 });
        if (!C.review || st >= 1) ang(b, Cc, A, Dd, { color: 'amber', r: 26, rings: 1, label: dg(180 - bb), size: 15, labelDist: 70, big: false });
        if (eqNow && (!C.review || st >= 2)) { ang(b, A, Cc, Dd, { color: 'violet', r: 30, rings: 3, label: dg(bb / 2), size: 14, labelDist: 50 }); ang(b, Dd, Cc, A, { color: 'violet', r: 30, rings: 3, label: dg(bb / 2), size: 14, labelDist: 52 }); }
        if (eqNow && (!C.review || st >= 3)) ang(b, A, B, Dd, { color: 'rose', r: 44, rings: 1, label: dg(a + bb / 2), size: 15, labelDist: 78 });
      }
      [A, B, Cc].forEach((p) => b.point(p, { color: 'ink', r: 4.5 }));
      if (!C.thumb && !C.problem && !C.review) b.handle('D', Dd, { color: 'amber', r: 8, ariaLabel: '점 D를 가로로 끌기', drag: (w) => { s.trDd = clamp(Math.round((w.x - Cc.x) * L3), 2, 10); } });
      else b.point(Dd, { color: 'ink', r: 4.5 });
      tagOut(b, A, cen, 'A', { size: 18 }); tagOut(b, B, cen, 'B', { size: 18 }); tagOut(b, Cc, cen, 'C', { size: 18, gap: 6 }); T(b, Dd, 'D', { dy: 18, size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `∠ACD=∠A+∠B=${a}°+${bb}°=${180 - bb}°`;
        else if (C.review && st === 2) { row = `CA=CD → ∠CAD=∠CDA=${bb / 2}°`; col = 'violet'; }
        else if (C.review && st === 3) { row = `∠BAD=${a}°+${bb / 2}°=${a + bb / 2}°`; col = 'rose'; }
        else if (eq) { row = `CD=CA=${L3} cm → ∠CAD=∠CDA=${bb / 2}°, ∠BAD=${a + bb / 2}°`; col = 'violet'; }
        else { row = `CD=${d} cm, CA=${L3} cm → 같지 않아요`; col = 'rose'; }
        rowT(b, pt(0, 0), row, { dy: b.W < 560 ? 44 : 56, size: fs(b, 16), color: col });
      }
    },
    steps: (M) => [
      `$\\angle ACD$는 △ABC의 외각이므로 $\\angle A+\\angle B=${M.a}^{\\circ}+${M.b}^{\\circ}=${M.ext}^{\\circ}$예요. (AB=AC이므로 $\\angle B=\\angle ACB=${M.b}^{\\circ}$)`,
      `$\\overline{CA}=\\overline{CD}$이므로 △CAD는 이등변삼각형이고 $\\angle CAD=\\angle CDA=${fr(`180^{\\circ}-${M.ext}^{\\circ}`, 2)}=${M.cad}^{\\circ}$예요.`,
      `$\\angle BAD=\\angle BAC+\\angle CAD=${M.a}^{\\circ}+${M.cad}^{\\circ}=${M.bad}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각 ∠A</b>와 <b>CD의 길이</b>를 바꾸거나 점 D를 가로로 끌어 보세요. AB=AC=CA의 길이(6 cm)와 <b>CD가 같아질 때</b> △CAD가 이등변삼각형이 돼요.',
      readouts: [rd('∠B = ∠ACB', `${M.b}°`, 'green'), rd('외각 ∠ACD', `${M.ext}°`, 'amber', '∠A + ∠B'), M.eq ? rd('∠CAD = ∠CDA', `${M.cad}°`, 'violet') : rd('CD', `${M.d} cm`, 'rose', 'CA=6 cm와 달라요'), M.eq ? rd('∠BAD', `${M.bad}°`, 'rose', '∠A + ∠CAD', null, true) : rd('CA', `${L3} cm`, 'sky')],
      status: M.eq ? { tone: 'ok', text: 'CD=CA — △CAD는 이등변삼각형' } : { tone: 'info', text: 'CD가 6 cm가 되는 곳을 찾아보세요' },
      formula: `<p>$\\angle ACD=\\angle A+\\angle B=${M.ext}^{\\circ}$</p><p>$\\angle CAD=\\angle CDA=${M.cad}^{\\circ},\\ \\angle BAD=${M.a}^{\\circ}+${M.cad}^{\\circ}=${M.bad}^{\\circ}$</p>`,
      rule: '변을 늘인 연장선의 외각은 이웃하지 않는 두 내각의 합이고, CA=CD이면 두 밑각이 같다.',
      notes: notes('∠ACD는 ∠ACB의 <b>외각</b>이에요(180°−∠ACB). ∠ACB를 그대로 쓰면 안 돼요.', '∠BAD는 ∠BAC에 ∠CAD를 <b>더한</b> 각이에요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, cad, bad } = M, v = (s.trV || 0) % 3, key = `${v}:${a}`;
      const st0 = `그림에서 ${S('AB')}=${S('AC')}=${S('CD')}이고`;
      if (v === 0) return numProb({ tag: '연장선 위의 이등변삼각형 · 밑각', key, stem: `${st0} ∠A=${a}°일 때, ∠CDA의 크기 $x$는?`, correct: cad, wrongs: [[bb, '∠B예요. ∠CDA는 외각 ∠ACD를 이용해 구해요.'], [180 - bb, '외각 ∠ACD예요.'], [a / 2, '다시 생각해 보세요.'], [bad, '∠BAD예요.'], [cad + 2, '다시 계산해 보세요.'], [cad - 2, '다시 계산해 보세요.']], ...degOpts(2) });
      if (v === 1) return numProb({ tag: '연장선 위의 이등변삼각형 · 밑각의 반', key, stem: `${st0} ∠B=${bb}°일 때, ∠CDA의 크기 $x$는?`, correct: cad, wrongs: [[bb, '∠B와 같지 않아요.'], [180 - bb, '외각 ∠ACD예요. 이등변삼각형의 밑각은 (180°−외각)÷2예요.'], [(180 - bb) / 2, '다시 생각해 보세요.'], [a, '꼭지각 ∠A예요.'], [cad + 2, '다시 계산해 보세요.'], [cad - 2, '다시 계산해 보세요.']].filter((q) => q[0] !== cad), ...degOpts(2) });
      return numProb({ tag: '[함정] 연장선 위의 이등변삼각형 · ∠BAD', key, stem: `${st0} ∠A=${a}°일 때, ∠BAD의 크기 $x$는?`, correct: bad, wrongs: [[a + bb, '외각 ∠ACD예요. ∠BAD는 ∠A에 ∠CAD를 더해요.'], [cad, '∠CAD만 구했어요. ∠A를 더해야 해요.'], [180 - bb, '∠ACD예요.'], [a + bb / 2 + 8, '다시 계산해 보세요.'], [a + bb / 2 - 8, '다시 계산해 보세요.']].filter((q) => q[0] !== bad), ...degOpts(4) });
    },
    verify: (s) => { const M = c3.model(s), A = M.A, B = M.B, Cc = M.C, D = pt(Cc.x + 1, 0); return { ans: angBetween(A, B, D), model: M.bad, extra: [[angBetween(D, A, Cc), M.cad], [dist(Cc, D), dist(A, Cc)]] }; }
  };

  /* ====================================================================== 풀이 흐름 (t2-2, t2-3) */
  const SK = G.SVK, mkSolve = G.mkSolve;
  const ov = (n) => `\\overline{${n}}`;
  const dd = (v) => `${v}^{\\circ}`;

  /* ---- t2-2 꼭짓점 공유형 · v0 [함정]: ∠B → ∠EDF · v1: ∠B → ∠CDE · v2: ∠EDF → ∠B ---- */
  const c2Plan = (M, s) => {
    const { x, g, cde, edf, a2, c3 } = M, { B, A, C: Cc, D, E, F } = g, v = (s.trV || 0) % 3, cen = pt((B.x + E.x) / 2, (B.y + F.y) / 2 + 0.1);
    const sym = v === 2; // v2: 구하는 ∠B 를 x 로 놓고 식으로 풉니다
    const V = (k, tex) => (sym ? (k === 1 ? 'x' : k + 'x') : tex); // 그림·캡션용 글자
    const t = (k) => (sym ? (k === 1 ? 'x' : `${k}x`) : `${k * x}^{\\circ}`);
    const cdeT = sym ? '\\frac{180^{\\circ}-3x}{2}' : dd(cde), cdeP = sym ? '\\frac{180°−3x}{2}' : `${cde}°`;
    const steps = [], items = [];
    items.push(SK.tick(B, A, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }), SK.tick(Cc, D, 1, { col: 'amber' }), SK.tick(Cc, E, 1, { col: 'amber' }));
    const gv = `$${ov('AB')}=${ov('AC')}=${ov('CD')}=${ov('CE')}$이고`;
    if (v === 0) steps.push({ id: 'given', k: 'given', t: `${gv} $\\angle B=${dd(x)}$예요. 구하는 것은 $\\angle EDF=x$.`, cap: `AB=AC=CD=CE, ∠B=${x}°` });
    else if (v === 1) steps.push({ id: 'given', k: 'given', t: `${gv} $\\angle B=${dd(x)}$예요. 구하는 것은 $\\angle CDE=x$.`, cap: `AB=AC=CD=CE, ∠B=${x}°` });
    else steps.push({ id: 'given', k: 'given', t: `${gv} $\\angle EDF=${dd(edf)}$예요. 구하는 것은 $\\angle B=x$.`, cap: `AB=AC=CD=CE, ∠EDF=${edf}°` });
    steps.push({ id: 'idea', k: 'idea', t: sym ? '각을 하나만 알아도 이등변삼각형(밑각이 같다)와 외각(이웃하지 않는 두 내각의 합)을 번갈아 쓰면 다음 각을 계속 구할 수 있어요. ∠B를 $x$로 놓고 ∠EDF까지 따라가 식으로 나타낸 뒤, 주어진 값과 같다고 놓아요.' : '같은 길이의 변이 이어져 있어서, 이등변삼각형의 두 밑각이 같다는 것과 외각 = 이웃하지 않는 두 내각의 합을 번갈아 쓰면 각을 하나씩 구해 갈 수 있어요. 아는 각 ∠B에서 출발해요.', cap: '밑각이 같다 + 외각 = 이웃하지 않는 두 내각의 합' });
    steps.push({ id: 'a1', k: 'fig', lb: '각 구하기 ①', t: `$${ov('AB')}=${ov('AC')}$이므로 $\\angle ACB=\\angle B=${t(1)}$예요.`, cap: `AB=AC → ∠ACB=∠B=${V(1, `${x}°`)}` });
    steps.push({ id: 'a2', k: 'fig', lb: '각 구하기 ②', t: `$\\angle CAD$는 △ABC의 외각이므로 $\\angle B+\\angle ACB=${t(2)}$예요. $${ov('CA')}=${ov('CD')}$이므로 $\\angle CDA=\\angle CAD=${t(2)}$.`, cap: `외각 ∠CAD=∠B+∠ACB=${V(2, `${a2}°`)} → ∠CDA=${V(2, `${a2}°`)}` });
    steps.push({ id: 'a3', k: 'fig', lb: '각 구하기 ③', t: `$\\angle DCE$는 △BCD의 외각이므로 $\\angle B+\\angle CDB=x_0+${t(2)}=${t(3)}$예요.`.replace('x_0', t(1)), cap: `외각 ∠DCE=∠B+∠CDB=${V(3, `${c3}°`)}` });
    steps.push({ id: 'a4', k: 'fig', lb: '각 구하기 ④', t: `$${ov('CD')}=${ov('CE')}$이므로 $\\angle CDE=\\angle CED=\\frac{180^{\\circ}-${t(3)}}{2}=${cdeT}$예요.`, cap: `CD=CE → ∠CDE=∠CED=${sym ? '\\frac{180°−3x}{2}' : `\\frac{180°−${c3}°}{2}=${cde}°`}` });
    const arcs = {
      B: (o) => SK.ang(B, Cc, A, { r: 34, ld: 48, lr: x / 2 + 12, ...o }),
      ACB: (o) => SK.ang(Cc, A, B, { r: 24, ld: 38, ...o }),
      CAD: (o) => SK.ang(A, Cc, D, { r: 28, ld: 42, rings: 2, ...o }), CDA: (o) => SK.ang(D, A, Cc, { r: 28, ld: 42, rings: 2, ...o }),
      DCE: (o) => SK.ang(Cc, D, E, { r: 32, ld: 46, ...o }),
      CDE: (o) => SK.ang(D, E, Cc, { r: 26, ld: 40, rings: 3, ...o }), CED: (o) => SK.ang(E, Cc, D, { r: 26, ld: 40, rings: 3, ...o }),
      EDF: (o) => SK.ang(D, E, F, { r: 34, ld: 48, ...o })
    };
    const Gr = { col: 'green', size: 14, gl: true };
    if (v !== 2) items.push(arcs.B({ on: ['given'], col: 'sky', label: dg(x), size: 15, gl: true, glTo: 'a4' }));
    items.push(arcs.ACB({ at: 'a1', col: 'green', label: V(1, dg(x)), size: 14, gl: true, glTo: 'a2' }),
      arcs.CAD({ at: 'a2', ...Gr, label: V(2, dg(a2)), glTo: 'a3' }), arcs.CDA({ at: 'a2', ...Gr, label: V(2, dg(a2)), glTo: 'a3' }),
      arcs.DCE({ at: 'a3', ...Gr, label: V(3, dg(c3)), glTo: 'a4' }),
      arcs.CDE({ ...(v === 0 ? { on: ['a4', 'trap'], cols: { trap: 'rose' } } : { at: 'a4' }), ...Gr, label: sym ? '' : dg(cde), glTo: v === 1 ? 'a4' : 'eq' }), arcs.CED({ at: 'a4', col: 'green', size: 14, label: sym ? '' : dg(cde), gl: true, glTo: 'eq' }));
    if (sym) items.push(arcs.B({ on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, labels: { ans: `x=${x}°` }, gl: true }));
    if (v === 0) {
      steps.push({ id: 'eq', k: 'eq', t: `$\\angle EDF=180^{\\circ}-\\angle CDA-\\angle CDE=180^{\\circ}-${dd(a2)}-${dd(cde)}=${dd(edf)}$ (점 D에서 일직선)`, cap: `x=180°−${a2}°−${cde}°=${edf}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(edf)}$`, cap: `x = ${edf}°` });
      steps.push({ id: 'trap', k: 'trap', t: `$\\angle CDE=${dd(cde)}$에서 멈추면 안 돼요. $\\angle EDF$는 일직선 $180^{\\circ}$에서 $\\angle CDA$와 $\\angle CDE$를 모두 뺀 각이에요.`, cap: `∠CDE=${cde}°에서 멈추면 안 돼요 → x=180°−${a2}°−${cde}°=${edf}°` });
      items.push(arcs.EDF({ on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, gl: true }));
    } else if (v === 1) {
      steps.push({ id: 'eq', k: 'eq', t: `$x=\\angle CDE=\\frac{180^{\\circ}-${dd(c3)}}{2}=\\frac{${dd(180 - c3)}}{2}=${dd(cde)}$`, cap: `x=\\frac{180°−${c3}°}{2}=${cde}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(cde)}$`, cap: `x = ${cde}°` });
      items.push(arcs.CDE({ on: ['given', 'eq', 'ans'], col: 'amber', label: 'x', size: 17, gl: false, rings: 3 }));
    } else {
      steps.push({ id: 'eq', k: 'eq', lb: '식 세우기', t: `$\\angle EDF=180^{\\circ}-\\angle CDA-\\angle CDE=180^{\\circ}-2x-\\frac{180^{\\circ}-3x}{2}=90^{\\circ}-\\frac{x}{2}$이고, 이것이 $${dd(edf)}$이므로 $90^{\\circ}-\\frac{x}{2}=${dd(edf)}$`, cap: `90°−\\frac{x}{2}=${edf}°` });
      steps.push({ id: 'eq2', k: 'eq', lb: '식 풀기', t: `$\\frac{x}{2}=90^{\\circ}-${dd(edf)}=${dd(90 - edf)}$이므로 $x=${dd(x)}$`, cap: `\\frac{x}{2}=${90 - edf}° → x=${x}°` });
      steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(x)}$`, cap: `x = ${x}°` });
      items.push(arcs.EDF({ on: ['given', 'eq', 'eq2'], col: 'sky', label: dg(edf), size: 15, gl: true }));
    }
    return {
      fit: [B, A, Cc, D, E, F], steps, items, l: 44, r: 48,
      base: (b) => { G.line(b, B, E, 'ink', 3.4); G.line(b, B, F, 'ink', 3.4); G.line(b, A, Cc, 'ink', 3.4); G.line(b, Cc, D, 'ink', 3.4); G.line(b, D, E, 'ink', 3.4); },
      names: (b) => { [B, A, Cc, D, E, F].forEach((p, i) => { b.point(p, { color: 'ink', r: 4.5 }); G.tagOut(b, p, cen, 'BACDEF'[i], { size: 18, gap: 11 }); }); }
    };
  };
  c2.solve = mkSolve(c2Plan);

  /* ---- t2-3 연장선 위의 이등변삼각형 · v0: ∠A → ∠CDA · v1: ∠B → ∠CDA · v2 [함정]: ∠A → ∠BAD ---- */
  const c3Plan = (M, s) => {
    const { a, b: bb, cad, bad } = M, { A, B, C: Cc } = M, D = pt(Cc.x + 1, 0), E = pt(D.x + 0.35, 0), v = (s.trV || 0) % 3, cen = pt(0, A.y * 0.4);
    const ext = 180 - bb, x = v === 2 ? bad : cad;
    const steps = [], items = [];
    items.push(SK.tick(A, B, 1, { col: 'amber' }), SK.tick(A, Cc, 1, { col: 'amber' }), SK.tick(Cc, D, 1, { col: 'amber' }));
    const g0 = `$${ov('AB')}=${ov('AC')}=${ov('CD')}$이고 점 B, C, D는 한 직선 위에 있어요.`;
    steps.push({ id: 'given', k: 'given', t: v === 1 ? `${g0} $\\angle B=${dd(bb)}$이고, 구하는 것은 $\\angle CDA=x$.` : `${g0} $\\angle A=${dd(a)}$이고, 구하는 것은 $\\angle ${v === 2 ? 'BAD' : 'CDA'}=x$.`, cap: v === 1 ? `AB=AC=CD, ∠B=${bb}°` : `AB=AC=CD, ∠A=${a}°` });
    steps.push({ id: 'idea', k: 'idea', t: v === 2 ? '∠BAD는 ∠BAC와 ∠CAD를 이어 붙인 각이에요. ∠BAC는 아는 값이고 ∠CAD는 이등변삼각형 CAD의 밑각이니, 외각 ∠ACD를 먼저 구하면 풀려요.' : '△CAD가 CA=CD인 이등변삼각형이라 ∠CDA=∠CAD예요. 꼭지각 ∠ACD는 △ABC의 외각이니까 이웃하지 않는 두 내각 ∠A, ∠B의 합으로 구해요.', cap: '외각 ∠ACD = ∠A + ∠B → △CAD는 이등변삼각형' });
    if (v !== 1) steps.push({ id: 'base', k: 'fig', lb: '각 구하기', t: `$\\overline{AB}=\\overline{AC}$이므로 $\\angle B=\\angle ACB=\\frac{180^{\\circ}-${dd(a)}}{2}=${dd(bb)}$예요.`, cap: `∠B=∠ACB=\\frac{180°−${a}°}{2}=${bb}°` });
    else steps.push({ id: 'base', k: 'fig', lb: '각 구하기', t: `$\\overline{AB}=\\overline{AC}$이므로 $\\angle ACB=\\angle B=${dd(bb)}$예요. (꼭지각 $\\angle A=180^{\\circ}-2\\times${dd(bb)}=${dd(a)}$)`, cap: `∠ACB=∠B=${bb}°` });
    steps.push({ id: 'outer', k: 'fig', lb: '외각 구하기', t: `$\\angle ACD$는 △ABC의 외각이므로 $\\angle A+\\angle B=${dd(a)}+${dd(bb)}=${dd(a + bb)}$예요. (안쪽 각 $\\angle ACB$와 합이 $180^{\\circ}$이므로 $180^{\\circ}-${dd(bb)}$로 구해도 같아요)`, cap: `∠ACD=∠A+∠B=${a}°+${bb}°=${a + bb}°` });
    steps.push({ id: 'iso', k: 'fig', lb: '각 구하기', t: `$\\overline{CA}=\\overline{CD}$이므로 △CAD는 이등변삼각형이에요. $\\angle CAD=\\angle CDA=\\frac{180^{\\circ}-${dd(a + bb)}}{2}=${dd(cad)}$.`, cap: `CA=CD → ∠CAD=∠CDA=\\frac{180°−${a + bb}°}{2}=${cad}°` });
    if (v === 2) steps.push({ id: 'eq', k: 'eq', t: `$\\angle BAD=\\angle BAC+\\angle CAD=${dd(a)}+${dd(cad)}=${dd(bad)}$`, cap: `x=∠BAC+∠CAD=${a}°+${cad}°=${bad}°` });
    steps.push({ id: 'ans', k: 'ans', t: `$x=${dd(x)}$`, cap: `x = ${x}°` });
    if (v === 2) steps.push({ id: 'trap', k: 'trap', t: `$\\angle CAD=${dd(cad)}$에서 멈추면 안 돼요. $\\angle BAD$는 $\\angle BAC=${dd(a)}$에 $\\angle CAD$를 더한 각이에요.`, cap: `∠CAD=${cad}°에서 멈추면 안 돼요 → ∠BAD=${a}°+${cad}°=${bad}°` });
    const apex = (o) => SK.ang(A, B, Cc, { r: 20, ld: 33, ...o });
    const angB = (o) => SK.ang(B, Cc, A, { r: 26, ld: 40, rings: 2, ...o }), angC = (o) => SK.ang(Cc, A, B, { r: 26, ld: 40, rings: 2, ...o });
    const outer = (o) => SK.ang(Cc, A, D, { r: 24, ld: 40, ...o });
    const CAD = (o) => SK.ang(A, Cc, D, { r: 36, rings: 3, ...o }), CDA = (o) => SK.ang(D, A, Cc, { r: 30, rings: 3, ...o });
    // 좁은 각(약 35° 이하)의 값은 부채꼴 밖에 두되, G.ang 이 호에서 시작하는 지시선으로 그 각을 가리켜요
    const sr = G.sideRot;
    if (v !== 1) items.push(apex({ on: ['given', 'outer'], col: 'sky', label: dg(a), gl: true }));
    items.push(angB({ at: 'base', to: 'outer', col: 'green', cols: { outer: 'sky' }, label: v === 1 ? '' : dg(bb), labels: { outer: '' }, gl: true, glTo: 'base' }), angC({ at: 'base', col: 'green' }),
      outer({ at: 'outer', col: 'green', label: dg(a + bb), size: 15, gl: true, glTo: 'iso' }),
      CAD({ ...(v === 2 ? { on: ['iso', 'trap'], cols: { trap: 'rose' } } : { at: 'iso' }), col: 'green', label: dg(cad), size: 14, ld: 74, lr: sr(A, Cc, D, 'B', 24), gl: true }));
    if (v === 1) items.push(angB({ on: ['given'], col: 'sky', label: dg(bb), gl: true, glTo: 'outer' }));
    if (v === 2) items.push(CDA({ at: 'iso', col: 'green' }), SK.ang(A, B, D, { r: 46, ld: 60, on: ['given', 'eq', 'ans'], col: 'amber', fa: 0.12, label: 'x', size: 17, gl: true }));
    else items.push(CDA({ on: ['given', 'iso', 'ans'], col: 'amber', fa: 0.5, label: 'x', size: 17, labels: { ans: `x=${cad}°` }, ld: 62, lr: sr(D, A, Cc, 'A', 34), gl: true }));
    return {
      fit: [A, B, Cc, E, pt(B.x, 0.35)], steps, items, l: 44, r: 44,
      base: (b) => { G.fillPoly(b, [A, B, Cc], 'sky', 0.08); G.poly(b, [A, B, Cc], 'ink', 3.6); G.line(b, Cc, E, 'ink', 3.4); G.line(b, A, D, 'ink', 3.4); },
      names: (b) => { [A, B, Cc].forEach((p) => b.point(p, { color: 'ink', r: 4.5 })); b.point(D, { color: 'ink', r: 4.5 }); G.tagOut(b, A, cen, 'A', { size: 18 }); G.tagOut(b, B, cen, 'B', { size: 18 }); G.tagOut(b, Cc, cen, 'C', { size: 18, gap: 6 }); T(b, D, 'D', { dy: 18, size: 18 }); }
    };
  };
  c3.solve = mkSolve(c3Plan);

  c1.lessonDraw = (b, s, M, C, SV, ST, idx) => {
    SV.draw(b, s, M, C, ST.map(st => ({ ...st, cap: '' })), idx);
    if (!C.entry && s.trTrace > 0) line(b, M.pts[0], G.lerp(M.pts[0], M.pts[1], clamp(s.trTrace, 0, 1)), 'rose', 4.4);
    if (!C.entry && s.trLine) rowT(b, pt((M.pts[0].x + M.pts[M.n].x) / 2, 0), s.trLine, { dy: 52, size: fs(b, 16), color: C.answer ? 'amber' : 'green' });
  };
  G.trLessonA.attach(c2, c2Plan, M => [M.g.B, M.g.A]);
  G.trLessonA.attach(c3, c3Plan, M => [M.C, pt(M.C.x + 1, 0)]);

  /* @@SOLVE-END */

  G.register(20, 't2', '② 연쇄·외각', '연쇄·외각', PARAMS, [c1, c2, c3]);
})();
