/* ==========================================================================
   중3 · 원의 성질 — 탭 ⑦ 「원 속 넓이」 (t7.js, order 70) — 장면 3개
   · c7-1 활꼴의 넓이          · 활꼴 = 부채꼴 − 삼각형 OAB
   · c7-2 접어서 만든 도형의 넓이 · 호가 중심 O를 지나게 접기 (OM = R/2, ∠COD = 120°)
   · c7-3 반원 속 활꼴          · 원주각 ∠ABC → 중심각 ∠AOC = 2∠ABC → 활꼴 AC
   넓이는 π와 √ 로 정확하게 나타내고, 값은 모두 지금의 R·각으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, mp, T, tick, line, fit, P, rd, notes, fmtN, circle, arcD, arcPts, fillSector, fillSeg, fillPoly, dot, pname, segTag, tagOut, ang, cv, nt, sz, mkTextChoices, mkNum } = G;
  const degF = G.degF, dgx = (v) => fmtN(v) + '°';
  const S = (b, a = 16) => sz(b, a);
  const pickR = (rnd, arr) => arr[Math.floor(rnd() * arr.length)];
  const O0 = pt(0, 0);
  const $$ = (t) => '$' + t + '$';

  /* ---- 정확한 수: a π ± b√c ---- */
  const gcd = (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const RT = (n, d, rad) => { const g = gcd(n, d); return { n: Math.round(n) / g, d: Math.round(d) / g, rad }; };
  const PIc = (n, d) => { const g = gcd(n, d); return { n: Math.round(n) / g, d: Math.round(d) / g }; };
  const rtVal = (r) => (r.n / r.d) * Math.sqrt(r.rad);
  const piVal = (p) => (p.n / p.d) * Math.PI;
  const rtTex = (r) => {
    const rad = r.rad > 1;
    if (r.d === 1) return (r.n === 1 && rad ? '' : String(r.n)) + (rad ? `\\sqrt{${r.rad}}` : '');
    return rad ? `\\frac{${r.n === 1 ? '' : r.n}\\sqrt{${r.rad}}}{${r.d}}` : `\\frac{${r.n}}{${r.d}}`;
  };
  const piTex = (p) => (p.d === 1 ? (p.n === 1 ? '\\pi' : `${p.n}\\pi`) : `\\frac{${p.n === 1 ? '' : p.n}\\pi}{${p.d}}`);
  const arTex = (a) => {
    let t = '';
    if (a.pi) t += piTex(a.pi);
    if (a.rt) t += (a.pi ? (a.s < 0 ? '-' : '+') : '') + rtTex(a.rt);
    return t;
  };
  const arVal = (a) => (a.pi ? piVal(a.pi) : 0) + (a.rt ? (a.s < 0 ? -1 : 1) * rtVal(a.rt) : 0);
  const arPlain = (a) => arTex(a).replace(/\\sqrt\{(\d+)\}/g, '√$1').replace(/\\pi/g, 'π').replace(/\\frac\{([^{}]*)\}\{(\d+)\}/g, '$2분의$1').replace(/-/g, '−');
  const scaleA = (a, k) => ({ pi: a.pi ? PIc(a.pi.n * k[0], a.pi.d * k[1]) : null, rt: a.rt ? RT(a.rt.n * k[0], a.rt.d * k[1], a.rt.rad) : null, s: a.s });
  function mkArea(cor, wrongs, key) {
    const items = [{ h: $$(arTex(cor)), p: arPlain(cor), ok: true, hint: '', v: arVal(cor) }];
    const seen = new Set([arTex(cor)]);
    const put = (a, hint) => {
      if (items.length >= 5 || !a) return;
      const v = arVal(a), t = arTex(a);
      if (!(v > 0) || !Number.isFinite(v) || seen.has(t) || items.some((x) => Math.abs(x.v - v) < 1e-6)) return;
      seen.add(t); items.push({ h: $$(t), p: arPlain(a), ok: false, hint: hint || '풀이 순서대로 다시 계산해 보세요.', v });
    };
    wrongs.forEach((w) => put(w[0], w[1]));
    for (const k of [[2, 1], [1, 2], [3, 1], [1, 3], [4, 1], [1, 4], [3, 2]]) put(scaleA(cor, k));
    return mkTextChoices(items, key);
  }
  const SIN = { 30: RT(1, 2, 1), 150: RT(1, 2, 1), 60: RT(1, 2, 3), 120: RT(1, 2, 3), 90: RT(1, 1, 1) };
  const secPi = (R, phi) => PIc(R * R * phi, 360);
  const triRT = (R, phi, k) => { const s = SIN[phi]; return RT(s.n * R * R * k[0], s.d * k[1], s.rad); }; // k 배: ½R²sinφ → k=[1,2]
  const segA = (R, phi) => ({ pi: secPi(R, phi), rt: triRT(R, phi, [1, 2]), s: -1 });
  const segWr = (R, phi) => {
    const a = segA(R, phi), M1 = '활꼴은 부채꼴에서 삼각형을 빼요.';
    return [
      [{ pi: a.pi, rt: a.rt, s: 1 }, M1],
      [{ pi: a.pi }, '삼각형 OAB의 넓이를 빼야 해요.'],
      [{ rt: a.rt }, '이것은 삼각형의 넓이예요. 활꼴은 부채꼴 − 삼각형.'],
      [{ pi: PIc(R * R * phi, 180), rt: a.rt, s: -1 }, '부채꼴의 넓이는 πR²×(중심각÷360)이에요.'],
      [{ pi: a.pi, rt: triRT(R, phi, [1, 1]), s: -1 }, '삼각형의 넓이는 R×R×sin(중심각)÷2예요.'],
      [{ pi: a.pi, rt: triRT(R, phi, [1, 4]), s: -1 }, '삼각형의 넓이는 R×R×sin(중심각)÷2예요.']
    ];
  };
  const angAt = (V, X, Y) => { const u = sub(X, V), v = sub(Y, V); return Math.acos(clamp((u.x * v.x + u.y * v.y) / (Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)), -1, 1)) / DEG; };
  const shoe = (pts) => { let s = 0; for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; s += p.x * q.y - q.x * p.y; } return Math.abs(s) / 2; };
  const secM = (O, A, B, phi) => (phi / 360) * Math.PI * dist(O, A) ** 2; // 중심각 phi(측정값)로 부채꼴 넓이
  const lenF = (v) => fmtN(v);

  const PARAMS = {
    c7R: G.P('반지름 R', 2, 12, 1, 6, { color: 'sky', format: lenF }),
    c7th: G.P('중심각 θ', 30, 150, 30, 120, { color: 'rose', format: degF }),
    c7f: G.P('접는 정도', 0, 1, 0.05, 1, { color: 'amber', hint: '왼쪽으로 밀면 펼쳐져요', format: (v) => Math.round(v * 100) + '%' }),
    c7a: G.P('원주각 ∠ABC', 15, 75, 15, 30, { color: 'sky', format: degF })
  };

  /* ====================================================================== 1. 활꼴의 넓이 */
  const segG = (R, phi) => { const a0 = 270 - phi / 2, a1 = 270 + phi / 2; return { R, phi, a0, a1, A: mp(O0, R, a0), B: mp(O0, R, a1) }; };
  const seg1 = {
    id: 'c7-1', title: '활꼴의 넓이', short: '활꼴의 넓이',
    question: '현 AB와 호 AB로 둘러싸인 활꼴의 넓이는 부채꼴 OAB의 넓이에서 무엇을 빼면 될까? 반지름과 중심각을 바꿔 보자.',
    ctl: ['c7R', 'c7th'],
    init: (s) => { s.c7R = 6; s.c7th = 120; },
    gen(rnd, n) { const kind = n % 3, R = pickR(rnd, [3, 4, 6, 8, 10, 12]), phi = pickR(rnd, [30, 60, 90, 120, 150]); return { kind, R, phi, key: `a${kind}.${R}.${phi}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: segG(q.R, q.phi) }; } return { g: segG(clamp(Math.round(s.c7R), 2, 12), clamp(Math.round(s.c7th / 30) * 30, 30, 150)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { R, phi, A, B } = g;
      fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 62, b: 84, l: 44, r: 44 });
      let secF = false, triF = false, segF = false;
      if (pr) { secF = q.kind === 2; triF = q.kind === 1; segF = q.kind === 0; } else if (ex) { secF = true; triF = true; } else { secF = true; triF = st >= 1; segF = st >= 2; }
      if (secF) fillSector(b, O0, R, g.a0, g.a1, 'rose', 0.14);
      if (triF) fillPoly(b, [O0, A, B], 'sky', 0.14);
      if (segF) fillSeg(b, O0, R, g.a0, g.a1, 'amber', 0.22);
      circle(b, O0, R, 'ink', 3.6);
      line(b, O0, A, 'ink', 3.2); line(b, O0, B, 'ink', 3.2); line(b, A, B, 'ink', 3.2);
      tick(b, O0, A, 1, 'amber'); tick(b, O0, B, 1, 'amber');
      dot(b, O0, 'ink', 3.8); pname(b, A, O0, 'A'); pname(b, B, O0, 'B');
      if (!C.txt) return;
      T(b, O0, 'O', { dy: -16, size: 16 });
      segTag(b, O0, A, cv(R), { away: B, color: 'sky', size: S(b), gap: 10 }); segTag(b, O0, B, cv(R), { away: A, color: 'sky', size: S(b), gap: 10 });
      { const cd = R * Math.cos((phi / 2) * DEG) * (b.k || 60); ang(b, O0, A, B, { color: 'rose', rings: 1, label: dgx(phi), r: clamp(cd * 0.7, 14, 30), labelDist: phi >= 120 ? clamp(cd * 0.5, 14, 60) : undefined, size: S(b) }); }
      if (pr) {
        const txt = q.kind === 0 ? '활꼴 AB의 넓이 = x' : q.kind === 1 ? '삼각형 OAB의 넓이 = x' : '부채꼴 OAB의 넓이 = x';
        T(b, pt(0, R), txt, { dy: 56, size: S(b, 18), color: 'rose' });
      }
    },
    steps: (M) => {
      const { R, phi } = M.g, sec = secPi(R, phi), tri = triRT(R, phi, [1, 2]);
      return [
        `부채꼴 OAB의 넓이 $=\\pi\\times ${R}^2\\times\\frac{${phi}}{360}=${piTex(sec)}$.`,
        `삼각형 OAB의 넓이 $=\\frac{1}{2}\\times ${R}\\times ${R}\\times\\sin ${phi}^{\\circ}=${rtTex(tri)}$.`,
        `활꼴의 넓이 $=$ 부채꼴 $-$ 삼각형 $=${arTex(segA(R, phi))}$.`
      ];
    },
    view: (M) => {
      const { R, phi } = M.g, sec = secPi(R, phi), tri = triRT(R, phi, [1, 2]);
      return {
        guide: '막대로 <b>반지름 R</b>과 <b>중심각 θ</b>를 바꿔 보세요. <b>분홍색 부채꼴</b>에서 <b>파란색 삼각형 OAB</b>를 빼면 남는 부분이 <b>활꼴</b>이에요.',
        readouts: [rd('부채꼴 OAB', $$(piTex(sec)), 'rose', 'πR²×θ÷360'), rd('삼각형 OAB', $$(rtTex(tri)), 'sky', 'R²sinθ÷2'), rd('활꼴', $$(arTex(segA(R, phi))), 'amber', '부채꼴 − 삼각형')],
        rule: '활꼴의 넓이 $=$ 부채꼴 OAB의 넓이 $-$ 삼각형 OAB의 넓이',
        notes: notes('중심각이 90°이면 삼각형은 직각이등변삼각형이라 넓이가 $\\frac{1}{2}R^2$이에요.', '중심각이 180°보다 크면 삼각형을 <b>더해야</b> 해요. (이 장면은 180° 미만만 다뤄요)')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { R, phi } = q, g = M.g;
      const O = O0, A = g.A, B = g.B, pre = `반지름의 길이가 ${R}인 원 O에서 중심각 $\\angle AOB=${phi}^{\\circ}$이다.`;
      const sM = secM(O, A, B, angAt(O, A, B)), tM = shoe([O, A, B]);
      let tag, stem, ans, wr, meas;
      if (q.kind === 0) {
        tag = '활꼴의 넓이'; ans = segA(R, phi); wr = segWr(R, phi); meas = sM - tM;
        stem = `${pre} 활꼴 AB(색칠한 부분)의 넓이 $x$는?`;
      } else if (q.kind === 1) {
        tag = '삼각형 OAB의 넓이'; const t = triRT(R, phi, [1, 2]); ans = { rt: t, s: 1 }; meas = tM;
        wr = [[{ rt: triRT(R, phi, [1, 1]), s: 1 }, '삼각형의 넓이는 R×R×sin(중심각)÷2예요.'], [{ rt: triRT(R, phi, [1, 4]), s: 1 }, '삼각형의 넓이는 R×R×sin(중심각)÷2예요.']];
        for (const p of [30, 60, 90]) if (SIN[p].rad !== t.rad || SIN[p].n !== SIN[phi].n || SIN[p].d !== SIN[phi].d) wr.push([{ rt: triRT(R, p, [1, 2]), s: 1 }, '끼인각의 sin 값을 다시 확인해 보세요.']);
        stem = `${pre} 삼각형 OAB(색칠한 부분)의 넓이 $x$는?`;
      } else {
        tag = '부채꼴의 넓이'; const p = secPi(R, phi); ans = { pi: p }; meas = sM;
        wr = [[{ pi: PIc(R * R * phi, 180) }, '부채꼴의 넓이는 πR²×(중심각÷360)이에요.'], [{ pi: PIc(R * R * phi, 720) }, '부채꼴의 넓이는 πR²×(중심각÷360)이에요.'], [{ pi: PIc(R * R * (360 - phi), 360) }, '중심각 θ에 대한 부채꼴이에요.'], [{ pi: PIc(R * phi, 360) }, '반지름을 제곱해야 해요.']];
        stem = `${pre} 부채꼴 OAB(색칠한 부분)의 넓이 $x$는?`;
      }
      return { tag, key, stem, choices: mkArea(ans, wr, key), chk: [meas, arVal(ans)] };
    }
  };

  /* ====================================================================== 2. 접어서 만든 도형의 넓이 */
  const foldG = (R, f) => {
    const C = mp(O0, R, 210), D = mp(O0, R, 330), Mm = mid(C, D), n = unit(sub(Mm, O0)), arc = arcPts(O0, R, 210, 330, 48);
    const mov = (p) => { const h = (p.x - Mm.x) * n.x + (p.y - Mm.y) * n.y; return sub(p, mul(n, h * (1 - Math.cos(Math.PI * f)))); };
    return { R, f, C, D, M: Mm, n, arc, farc: arc.map(mov), apex: mov(mp(O0, R, 270)) };
  };
  const fold = {
    id: 'c7-2', title: '접어서 만든 도형의 넓이', short: '접어서 만든 넓이',
    question: '원의 호가 중심 O를 지나도록 접었다. 접은 선 CD의 길이와 접힌 활꼴의 넓이는 얼마일까? 접는 정도를 바꿔 보자.',
    ctl: ['c7R', 'c7f'],
    init: (s) => { s.c7R = 6; s.c7f = 1; },
    gen(rnd, n) { const kind = n % 3, R = pickR(rnd, [3, 4, 5, 6, 8, 9, 10, 12]); return { kind, R, key: `f${kind}.${R}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: foldG(q.R, 1) }; } return { g: foldG(clamp(Math.round(s.c7R), 2, 12), C.tab === 'explore' ? clamp(s.c7f, 0, 1) : 1) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { R, f, C: Cc, D, arc, farc } = g;
      if (pr) fit(b, { x0: -R, x1: R, y0: -R, y1: 0.55 * R }, { t: 62, b: 84, l: 44, r: 44 }); else fit(b, { x0: -R, x1: R, y0: -R, y1: R }, { t: 62, b: 44, l: 44, r: 44 });
      // 접은 뒤에 보이는 도형(큰 쪽)
      if (pr && q.kind === 2) b.path(arcPts(O0, R, 330, 570, 96), { close: true, fill: 'rose', fillAlpha: 0.18, color: null });
      else if (!pr && (ex || st >= 3)) b.path(arcPts(O0, R, 330, 570, 96), { close: true, fill: 'sky', fillAlpha: 0.08, color: null });
      arcD(b, O0, R, 330, 570, 'ink', 3.6);
      if (f < 0.999 && !pr) { b.path(arc, { color: 'ink', width: 2.4, dash: [6, 6], alpha: 0.45 }); }
      const showFold = pr ? q.kind === 1 : true;
      if (showFold) b.path(farc, { close: true, fill: 'amber', fillAlpha: 0.22, color: null });
      b.path(farc, { color: 'ink', width: 3.4 });
      line(b, Cc, D, 'ink', 3.4);
      line(b, O0, Cc, 'ink', 2.8); line(b, O0, D, 'ink', 2.8);
      tick(b, O0, Cc, 1, 'amber'); tick(b, O0, D, 1, 'amber');
      dot(b, O0, 'ink', 4.4); pname(b, Cc, O0, 'C'); pname(b, D, O0, 'D');
      if (!pr && (ex || st >= 1) && f > 0.99) { const Mm = g.M; line(b, O0, Mm, 'green', 2.4, { dash: [6, 5] }); dot(b, Mm, 'green', 4); }
      if (!C.txt) return;
      T(b, O0, 'O', { dy: -16, size: 16 });
      segTag(b, O0, Cc, cv(R), { away: D, color: 'sky', size: S(b), gap: 10 }); segTag(b, O0, D, cv(R), { away: Cc, color: 'sky', size: S(b), gap: 10 });
      if (!pr && (ex || st >= 1) && f > 0.99) { T(b, g.M, 'M', { dx: 14, dy: 16, size: 15, color: 'green' }); segTag(b, O0, g.M, cv(R / 2), { toward: pt(R, 0), f: 0.74, color: 'green', size: S(b) - 1, gap: 12 }); }
      if (pr) {
        if (q.kind === 0) segTag(b, Cc, D, 'x', { toward: pt(0, 3 * R), size: S(b, 18), gap: 14, color: 'rose' });
        const txt = q.kind === 1 ? '접힌 부분의 넓이 = x' : q.kind === 2 ? '접은 뒤 도형의 넓이 = x' : '';
        if (txt) T(b, pt(0, 0.55 * R), txt, { dy: 56, size: S(b, 18), color: 'rose' });
      } else if (ex || st >= 2) {
        if (f > 0.99) { ang(b, O0, Cc, D, { color: 'rose', rings: 1, label: '120°', r: 16, labelDist: 24, size: S(b) - 1 }); }
      }
    },
    steps: (M) => {
      const R = M.g.R, sec = secPi(R, 120), tri = triRT(R, 120, [1, 2]);
      return [
        `호의 가운데가 중심 O로 오도록 접었으므로 접은 선 CD는 반지름의 수직이등분선이에요. 그 교점을 M이라 하면 $\\overline{OM}=\\frac{R}{2}=${nt(R / 2)}$.`,
        `직각삼각형 OMC에서 $\\cos\\angle COM=\\frac{1}{2}$이므로 $\\angle COM=60^{\\circ}$, $\\angle COD=120^{\\circ}$. $\\overline{CD}=\\sqrt{3}R=${nt(R * Math.sqrt(3))}$.`,
        `접힌 활꼴의 넓이 $=$ 부채꼴 COD $-$ 삼각형 COD $=${piTex(sec)}-${rtTex(tri)}$.`,
        `접은 뒤 도형의 넓이 $=$ 원 $-$ 활꼴 $=${arTex({ pi: PIc(2 * R * R, 3), rt: tri, s: 1 })}$.`
      ];
    },
    view: (M) => {
      const R = M.g.R, tri = triRT(R, 120, [1, 2]), seg = { pi: secPi(R, 120), rt: tri, s: -1 };
      return {
        guide: '막대로 <b>반지름 R</b>과 <b>접는 정도</b>를 바꿔 보세요. 호가 중심 O를 지나게 접으면 <b>OM = R÷2</b>이고 <b>∠COD = 120°</b>예요. 접힌 부분은 활꼴 그대로 겹쳐져요.',
        readouts: [rd('OM', $$(nt(R / 2)), 'green', 'R÷2'), rd('CD', $$(nt(R * Math.sqrt(3))), 'sky', '√3 × R'), rd('접힌 활꼴', $$(arTex(seg)), 'amber', '부채꼴 − 삼각형'), rd('접은 뒤 도형', $$(arTex({ pi: PIc(2 * R * R, 3), rt: tri, s: 1 })), 'rose', '원 − 활꼴')],
        rule: '호가 중심을 지나게 접으면 $\\overline{OM}=\\frac{1}{2}R$, $\\angle COD=120^{\\circ}$이고 접힌 부분의 넓이는 활꼴의 넓이와 같다',
        notes: notes('접은 호의 반지름도 R이에요. 다만 그 중심은 O를 접는 선에 대칭이동한 <b>O′</b>이고, 접힌 호 위의 점은 O′에서 R만큼 떨어져 있어요.', '접은 뒤 도형의 넓이는 겹친 부분을 <b>한 번만</b> 세어요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), R = q.R, g = M.g;
      const A0 = g.C, B0 = g.D, phiM = angAt(O0, A0, B0), apexOk = dist(g.apex, O0) < 1e-6 ? 0 : 1e3;
      const segM = secM(O0, A0, B0, phiM) - shoe([O0, A0, B0]);
      const pre = `반지름의 길이가 ${R}인 원 O를 호가 중심 O를 지나도록 접었더니 접은 선이 $\\overline{CD}$였다.`;
      let tag, stem, choices, meas, ans;
      if (q.kind === 0) {
        tag = '접은 선의 길이'; ans = R * Math.sqrt(3); meas = dist(A0, B0) + apexOk;
        stem = `${pre} $\\overline{CD}$의 길이 $x$는?`;
        const wr = [[R, 'OM=R÷2이므로 CD는 R보다 길어요.'], [2 * R, 'CD는 지름보다 짧아요.'], [R * Math.sqrt(2), '∠COD는 90°가 아니라 120°예요.'], [(R * Math.sqrt(3)) / 2, '이것은 CM의 길이예요. CD=2×CM.'], [3 * R, 'CD는 지름보다 짧아요.']];
        choices = mkNum(ans, wr, { unit: '' });
        return { tag, key, stem, choices, chk: [meas, ans] };
      }
      if (q.kind === 1) {
        tag = '접힌 부분의 넓이'; const a = segA(R, 120); ans = arVal(a); meas = segM + apexOk;
        stem = `${pre} 접힌 부분(색칠한 부분)의 넓이 $x$는?`;
        choices = mkArea(a, segWr(R, 120), key);
      } else {
        tag = '접은 뒤 도형의 넓이'; const tri = triRT(R, 120, [1, 2]), a = { pi: PIc(2 * R * R, 3), rt: tri, s: 1 };
        ans = arVal(a); meas = Math.PI * R * R - segM + apexOk;
        stem = `${pre} 접은 뒤 도형(색칠한 부분)의 넓이 $x$는?`;
        choices = mkArea(a, [[segA(R, 120), '이것은 접힌 활꼴의 넓이예요. 접은 뒤 도형은 원 − 활꼴.'], [{ pi: PIc(R * R, 1) }, '이것은 원의 넓이예요. 접힌 부분이 겹쳐져 있어요.'], [{ pi: PIc(2 * R * R, 3), rt: tri, s: -1 }, '활꼴을 빼는 것이므로 삼각형은 더해져요.'], [{ pi: PIc(R * R, 1), rt: tri, s: 1 }, '원에서 활꼴(부채꼴 − 삼각형)을 빼요.'], [{ pi: PIc(R * R, 3), rt: triRT(R, 120, [1, 1]), s: 1 }, '부채꼴과 삼각형 넓이를 다시 확인해 보세요.']], key);
      }
      return { tag, key, stem, choices, chk: [meas, ans] };
    }
  };

  /* ====================================================================== 3. 반원 속 활꼴 */
  const semG = (R, th) => ({ R, th, phi: 2 * th, A: mp(O0, R, 180), B: mp(O0, R, 0), C: mp(O0, R, 180 - 2 * th) });
  const semi = {
    id: 'c7-3', title: '반원 속 활꼴의 넓이', short: '반원 속 활꼴',
    question: '반원에서 원주각 ∠ABC를 알면 중심각 ∠AOC는 얼마일까? 그러면 색칠한 활꼴 AC의 넓이도 구할 수 있을까?',
    ctl: ['c7R', 'c7a'],
    init: (s) => { s.c7R = 6; s.c7a = 30; },
    gen(rnd, n) { const kind = n % 3, R = pickR(rnd, [3, 4, 6, 8, 10, 12]), th = pickR(rnd, [15, 30, 45, 60, 75]); return { kind, R, th, key: `s${kind}.${R}.${th}` }; },
    model(s, C) { if (C.problem) { const q = s.ciPk; return { q, g: semG(q.R, q.th) }; } return { g: semG(clamp(Math.round(s.c7R), 2, 12), clamp(Math.round(s.c7a / 15) * 15, 15, 75)) }; },
    draw(b, s, M, C) {
      const { g, q } = M, st = C.step, pr = C.problem, ex = C.tab === 'explore', { R, th, phi, A, B, C: Cc } = g;
      fit(b, { x0: -R, x1: R, y0: -R, y1: 0 }, { t: 62, b: 84, l: 44, r: 44 });
      const d0 = 180 - phi;
      if (pr) {
        if (q.kind === 0) fillSeg(b, O0, R, d0, 180, 'amber', 0.22);
        else if (q.kind === 1) fillSector(b, O0, R, d0, 180, 'rose', 0.18);
        else { fillSeg(b, O0, R, d0, 180, 'amber', 0.22); fillSeg(b, O0, R, 0, d0, 'amber', 0.22); }
      } else if (ex) { fillSeg(b, O0, R, d0, 180, 'amber', 0.22); fillPoly(b, [O0, A, Cc], 'sky', 0.12); }
      else {
        if (st >= 1) fillSector(b, O0, R, d0, 180, 'rose', 0.14);
        if (st >= 2) fillPoly(b, [O0, A, Cc], 'sky', 0.14);
        if (st >= 3) fillSeg(b, O0, R, d0, 180, 'amber', 0.22);
      }
      arcD(b, O0, R, 0, 180, 'ink', 3.6);
      line(b, A, B, 'ink', 3.4); line(b, A, Cc, 'ink', 3.2); line(b, Cc, B, 'ink', 3.2);
      line(b, O0, Cc, 'green', 2.6, { dash: [6, 5] });
      b.right(Cc, A, B, { size: 13, color: 'amber' });
      tick(b, O0, A, 1, 'amber'); tick(b, O0, B, 1, 'amber'); tick(b, O0, Cc, 1, 'amber');
      dot(b, O0, 'ink', 3.8); pname(b, A, O0, 'A'); pname(b, B, O0, 'B'); pname(b, Cc, O0, 'C');
      if (!C.txt) return;
      T(b, O0, 'O', { dy: 16, size: 16 });
      segTag(b, O0, B, cv(R), { away: Cc, color: 'sky', size: S(b), gap: 10 });
      ang(b, B, A, Cc, { color: 'sky', rings: 1, label: dgx(th), r: 38, size: S(b) });
      if (!pr && (ex || st >= 0)) ang(b, O0, A, Cc, { color: 'rose', rings: 2, label: dgx(phi), r: 26, size: S(b) - 1 });
      if (pr) {
        const txt = q.kind === 0 ? '활꼴 AC의 넓이 = x' : q.kind === 1 ? '부채꼴 OAC의 넓이 = x' : '색칠한 부분의 넓이 = x';
        T(b, O0, txt, { dy: 56, size: S(b, 18), color: 'rose' });
      }
    },
    steps: (M) => {
      const { R, th, phi } = M.g, sec = secPi(R, phi), tri = triRT(R, phi, [1, 2]);
      return [
        `한 호에 대한 중심각은 원주각의 2배: $\\angle AOC=2\\times\\angle ABC=2\\times ${th}^{\\circ}=${phi}^{\\circ}$.`,
        `부채꼴 OAC의 넓이 $=\\pi\\times ${R}^2\\times\\frac{${phi}}{360}=${piTex(sec)}$.`,
        `삼각형 OAC의 넓이 $=\\frac{1}{2}\\times ${R}\\times ${R}\\times\\sin ${phi}^{\\circ}=${rtTex(tri)}$.`,
        `활꼴 AC의 넓이 $=$ 부채꼴 $-$ 삼각형 $=${arTex(segA(R, phi))}$.`
      ];
    },
    view: (M) => {
      const { R, th, phi } = M.g, sec = secPi(R, phi), tri = triRT(R, phi, [1, 2]);
      return {
        guide: '막대로 <b>반지름 R</b>과 <b>∠ABC</b>를 바꿔 보세요. 중심각 ∠AOC는 원주각 ∠ABC의 <b>2배</b>이고, 활꼴 AC는 부채꼴 OAC에서 삼각형 OAC를 뺀 부분이에요.',
        readouts: [rd('∠AOC', dgx(phi), 'rose', '= 2 × ∠ABC'), rd('부채꼴 OAC', $$(piTex(sec)), 'rose'), rd('삼각형 OAC', $$(rtTex(tri)), 'sky'), rd('활꼴 AC', $$(arTex(segA(R, phi))), 'amber', '부채꼴 − 삼각형')],
        rule: '원주각 $\\angle ABC=\\theta$이면 중심각 $\\angle AOC=2\\theta$이고, 활꼴 $=$ 부채꼴 $-$ 삼각형',
        notes: notes('지름 AB에 대한 원주각이므로 $\\angle ACB=90^{\\circ}$예요. (직각 표시)', '길이 R은 반지름이에요. 지름 AB는 $2R$이에요.')
      };
    },
    prob(M, s) {
      const q = s.ciPk, key = q.key + '#' + (s.ciSeed || 0), { R, th } = q, phi = 2 * th, g = M.g;
      const phiM = 2 * angAt(g.B, g.A, g.C), sM = secM(O0, g.A, g.C, phiM), tM = shoe([O0, g.A, g.C]);
      const pre = `선분 AB는 반지름의 길이가 ${R}인 반원 O의 지름이고, 점 C는 호 AB 위의 점이며 $\\angle ABC=${th}^{\\circ}$이다.`;
      let tag, stem, ans, wr, meas;
      if (q.kind === 0) {
        tag = '반원 속 활꼴'; ans = segA(R, phi); wr = segWr(R, phi); meas = sM - tM;
        stem = `${pre} 활꼴 AC(색칠한 부분)의 넓이 $x$는?`;
      } else if (q.kind === 1) {
        tag = '반원 속 부채꼴'; ans = { pi: secPi(R, phi) }; meas = sM;
        wr = [[{ pi: secPi(R, th) }, '중심각은 원주각의 2배예요. ∠AOC=2∠ABC.'], [{ pi: secPi(R, 180 - phi > 0 ? 180 - phi : 360 - phi) }, '부채꼴 OAC의 중심각은 ∠AOC예요.'], [{ pi: PIc(R * R * phi, 180) }, '부채꼴의 넓이는 πR²×(중심각÷360)이에요.'], [{ pi: PIc(R * R * phi, 720) }, '부채꼴의 넓이는 πR²×(중심각÷360)이에요.'], [{ pi: PIc(R * phi, 360) }, '반지름을 제곱해야 해요.']];
        stem = `${pre} 부채꼴 OAC(색칠한 부분)의 넓이 $x$는?`;
      } else {
        tag = '반원에서 삼각형 ABC를 뺀 넓이'; const semiP = PIc(R * R, 2), tABC = triRT(R, phi, [1, 1]);
        ans = { pi: semiP, rt: tABC, s: -1 }; meas = Math.PI * R * R / 2 - shoe([g.A, g.B, g.C]);
        wr = [[{ pi: semiP, rt: tABC, s: 1 }, '색칠한 부분은 반원에서 삼각형 ABC를 뺀 부분이에요.'], [{ pi: semiP }, '삼각형 ABC의 넓이를 빼야 해요.'], [{ pi: semiP, rt: triRT(R, phi, [1, 2]), s: -1 }, '삼각형 ABC의 밑변은 지름 2R, 높이는 R·sin(∠AOC)예요.'], [{ pi: semiP, rt: triRT(R, phi, [2, 1]), s: -1 }, '삼각형 ABC의 넓이를 다시 확인해 보세요.'], [{ rt: tABC, s: 1 }, '이것은 삼각형 ABC의 넓이예요.']];
        stem = `${pre} 반원에서 삼각형 ABC를 뺀 색칠한 부분의 넓이 $x$는?`;
      }
      return { tag, key, stem, choices: mkArea(ans, wr, key), chk: [meas, arVal(ans)] };
    }
  };

  G.register(70, 'c7', '원 속 넓이', '원 속 넓이', PARAMS, [seg1, fold, semi]);
})();
