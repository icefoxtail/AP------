/* ==========================================================================
   중1 · 다각형 — 탭 ④ 「정다각형」 (t4.js, order 40) — 장면 5개
   · p4-reg   정n각형의 한 외각 360°÷n, 한 내각 180°−한 외각       · n 조절(3~20), 외각을 모아 한 바퀴
   · p4-ratio 한 내각과 한 외각의 비로 n 구하기                      · 비 a:b 조절 (n 이 자연수일 때만 정다각형)
   · p4-diag  정다각형의 두 대각선이 이루는 각 ∠APB = 360°÷n       · 꼭짓점 끌어 고르기, n 조절
   · p4-join  변을 공유하는 두 정다각형                              · n, m, 변의 길이 조절, 가로로 밀어 붙이기
   · p4-fan   한 꼭짓점에서 그은 대각선이 내각을 같은 크기로 나눔  · n 조절, 꼭짓점 끌어 고르기
   값은 모두 지금의 n(과 m·비)로 다시 계산됩니다. 360°÷n 이 나누어떨어지지 않으면 소수 첫째 자리까지만 보여 줍니다(≈).
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_PG;
  if (!G) return;
  const { DEG, clamp, seg01, pt, add, sub, mul, unit, mid, lerp, len, polar, inter, angBetween, regUp, pick, rint, bboxOf, T, tagOut, ang, tick, fillPoly, line, poly, fit, P, mkChoices, LET, rd, notes, fmtN, dg, tx, eqs, textW } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const dv = (d) => pt(cos(d), sin(d));
  const PN = [5, 6, 8, 9, 10, 12, 15, 18, 20]; // 360 ÷ n 이 정수인 n
  const NICE = (n) => PN.includes(n);
  const E = (n) => 360 / n; // 한 외각
  const eq = (v) => (Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? '=' : '≈');

  const PARAMS = {
    pgRn: P('꼭짓점의 수 n', 3, 20, 1, 6, { color: 'amber', hint: '막대를 움직여 정다각형을 바꿔 보세요', format: (v) => `정${v}각형` }),
    pgRt: P('외각 모으기', 0, 1, 0.01, 1, { color: 'rose', hint: '▶를 누르거나 막대를 끌면 외각이 하나씩 모여요', format: (v) => Math.round(v * 100) + '%' }),
    pgQa: P('한 내각의 비', 1, 9, 1, 3, { color: 'sky', format: (v) => String(v) }),
    pgQb: P('한 외각의 비', 1, 4, 1, 2, { color: 'rose', format: (v) => String(v) }),
    pgDn: P('꼭짓점의 수 n', 5, 12, 1, 5, { color: 'amber', format: (v) => `정${v}각형` }),
    pgJn: P('왼쪽 정다각형', 3, 8, 1, 5, { color: 'sky', format: (v) => `정${v}각형` }),
    pgJm: P('오른쪽 정다각형', 3, 8, 1, 3, { color: 'green', format: (v) => `정${v}각형` }),
    pgJl: P('한 변의 길이', 2, 8, 1, 4, { color: 'amber', format: (v) => `${v} cm` }),
    pgJt: P('가로로 밀어 붙이기', 0, 1, 0.01, 1, { color: 'green', hint: '▶를 누르거나 막대를 끌면 오른쪽 도형이 가로로 밀려 붙어요', format: (v) => (v >= 0.999 ? '붙음' : Math.round(v * 100) + '%') }),
    pgFn: P('꼭짓점의 수 n', 5, 12, 1, 7, { color: 'amber', format: (v) => `정${v}각형` })
  };
  // 꼭짓점 고르기 손잡이: 가까운 꼭짓점으로 붙음
  function pickHandle(b, s, key, Pn, label) {
    b.handle('v', Pn[s[key] % Pn.length], { color: 'amber', r: 8, ariaLabel: label || '꼭짓점 고르기', drag: (w) => { let best = 0, bd = 1e9; Pn.forEach((p, i) => { const d = Math.hypot(p.x - w.x, p.y - w.y); if (d < bd) { bd = d; best = i; } }); s[key] = best; } });
  }
  const names = (n, v0) => Array.from({ length: n }, (_, k) => LET[k]); // 이름은 꼭짓점 v0 에서 시작해 시계 방향
  const rot = (arr, v0) => arr.map((_, k) => arr[(v0 + k) % arr.length]); // v0 번째 꼭짓점이 맨 앞이 되도록

  /* ====================================================================== 1. 한 내각·한 외각 */
  const reg = {
    id: 'p4-reg', title: '정다각형의 한 내각과 한 외각', short: '한 내각·한 외각',
    question: '정n각형의 한 외각과 한 내각은 n으로 어떻게 구할까?',
    ctl: ['pgRn', 'pgRt'], anim: { key: 'pgRt', dur: 6, label: '외각 하나씩 모으기', start: 1 },
    init: (s) => { s.pgRn = 6; s.pgRt = 1; },
    reroll: (s) => { s.pgRn = pick([5, 6, 8, 9, 10, 12, 15, 18, 20], s.pgRn); },
    model: (s) => { const n = clamp(Math.round(s.pgRn), 3, 20), e = E(n); return { n, e, I: 180 - e, sum: 180 * (n - 2) }; },
    draw(b, s, M, C) {
      const { n, e, I } = M, Pn = regUp(n, 1), O = pt(0, 0);
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 86, l: 52, r: 52 });
      const kf = C.problem ? 0 : C.review ? (C.step >= 2 ? n : 0) : C.t * n, k = Math.min(n, Math.floor(kf + 1e-6)), K = b.k || 60;
      const showAll = C.problem || C.review ? C.step >= 1 && !C.problem : C.full;
      fillPoly(b, Pn, 'sky', 0.09);
      poly(b, Pn, 'ink', 3.4);
      // 꼭짓점마다 외각
      const rp = n > 12 ? 17 : 22;
      for (let i = 0; i < n; i++) {
        const p = Pn[i], u = Pn[(i + n - 1) % n], w = Pn[(i + 1) % n];
        const show = (i < k && !C.problem) || (!C.problem && C.review && C.step >= 1 && i < Math.max(k, 1) + (C.step >= 1 ? n : 0));
        if (!(C.full ? (i < k || C.t >= 0.999) : show)) continue;
        const ex = add(p, mul(unit(sub(p, u)), 0.34));
        b.path([p, ex], { color: 'rose', width: 2, dash: [5, 4] });
        ang(b, p, ex, w, { color: 'rose', r: i === 0 ? 40 : rp, rings: 0, fa: i === 0 ? 0.3 : 0.4, label: i === 0 && C.txt ? `${fmtN(e)}°` : '', size: 17, labelDist: i === 0 ? 70 : 0 });
      }
      void showAll;
      Pn.forEach((p, i) => { b.point(p, { color: 'ink', r: n > 12 ? 3.5 : 4.5 }); if (C.txt && (n <= 9 || i === 0)) tagOut(b, p, O, LET[i], { size: 17, gap: 10 }); });
      // 한 내각 (꼭짓점 A)
      if (!C.problem && (C.full || C.step >= 2)) ang(b, Pn[0], Pn[n - 1], Pn[1], { color: 'sky', r: 34, label: `${fmtN(I)}°`, size: 17, fa: 0.22 });
      if (C.problem) ang(b, Pn[0], Pn[n - 1], Pn[1], { color: 'amber', r: 34, label: 'x', size: 18, fa: 0.26 });
      // 가운데: 외각을 모은 모양
      const cr = 0.3;
      if (!C.problem && k > 0) {
        for (let i = 0; i < k; i++) b.arc(O, cr, (i * e - 90) * DEG, ((i + 1) * e - 90) * DEG, { sector: true, fill: 'rose', fillAlpha: i % 2 ? 0.34 : 0.55, color: 'rose', width: 1.4 });
        if (C.txt && k >= n) T(b, O, '360°', { size: 20, color: 'amber' });
      }
      if (!C.txt) return;
      const yb = Math.max(...Pn.map((p) => p.y));
      let r1, r2 = '', c1 = 'rose';
      if (C.problem) r1 = `정${n}각형의 한 내각 x의 크기는?`;
      else if (C.review && C.step === 1) r1 = `한 외각 = 360° ÷ ${n} = ${fmtN(e)}${eq(e) === '≈' ? '' : ''}°`;
      else if (C.review && C.step === 2) { r1 = `한 외각 ${fmtN(e)}°`; r2 = `한 내각 = 180° − ${fmtN(e)}° ${eq(I)} ${fmtN(I)}°`; }
      else if (C.review) { r1 = `한 내각 ${fmtN(I)}° × ${n} ${eq(I * n)} ${fmtN(I * n)}°`; r2 = `= 180° × (${n}−2) = ${M.sum}°`; }
      else if (k < n) r1 = `외각 ${k}개 → ${k}×${fmtN(e)}° ${eq(k * e)} ${fmtN(k * e)}°`;
      else { r1 = `한 외각 = 360° ÷ ${n} ${eq(e)} ${fmtN(e)}°`; r2 = `한 내각 = 180° − ${fmtN(e)}° ${eq(I)} ${fmtN(I)}°`; c1 = 'rose'; }
      T(b, pt(0, yb), r1, { dy: 46, size: b.W < 560 ? 16 : 17, color: c1 });
      T(b, pt(0, yb), r2, { dy: 74, size: b.W < 560 ? 16 : 17, color: 'sky' });
    },
    steps: (M) => [
      `정${M.n}각형은 외각이 모두 같고 외각의 합은 360°예요. 한 외각 = 360° ÷ ${M.n} ${eq(M.e)} ${fmtN(M.e)}°`,
      `한 꼭짓점에서 (내각) + (외각) = 180° 이므로 한 내각 = 180° − ${fmtN(M.e)}° ${eq(M.I)} ${fmtN(M.I)}°`,
      `확인: 내각 ${M.n}개의 합 = ${fmtN(M.I)}° × ${M.n} ${eq(M.I * M.n)} ${fmtN(M.I * M.n)}° = 180° × (${M.n} − 2) = ${M.sum}°`
    ],
    view: (M) => ({
      guide: '막대로 <b>n</b>(3~20)을 바꿔 보세요. ▶를 누르면 <b>분홍 외각</b>이 하나씩 가운데로 모여 <b>한 바퀴(360°)</b>를 이뤄요. 정다각형은 모든 외각이 같아서 <b>360° ÷ n</b>이 한 외각이에요.',
      readouts: [rd('꼭짓점의 수 n', `${M.n}개`, 'ink'), rd('한 외각 360° ÷ n', `${fmtN(M.e)}°`, 'rose'), rd('한 내각 180° − 한 외각', `${fmtN(M.I)}°`, 'sky', null, null, true)],
      formula: `<p>(한 외각) $=\\dfrac{360^{\\circ}}{n}=\\dfrac{360^{\\circ}}{${M.n}}${eq(M.e) === '=' ? '=' : '\\approx'}${tx(M.e)}^{\\circ}$</p><p>(한 내각) $=180^{\\circ}-(\\text{한 외각})${eq(M.I) === '=' ? '=' : '\\approx'}${tx(M.I)}^{\\circ}$</p>`,
      rule: '정n각형의 한 외각 = 360° ÷ n, 한 내각 = 180° − (한 외각) = 180°×(n−2)÷n',
      notes: notes('360°를 n으로 나누면 한 외각이에요. 내각의 합 180°×(n−2)를 n으로 나눈 값(한 내각)과 헷갈리지 마세요.', 'n이 360의 약수가 아니면 소수가 나와요. 시험에서는 나누어떨어지는 n(5, 6, 8, 9, 10, 12 …)이 나와요.')
    }),
    prob: (M) => {
      const { n, e, I, sum } = M;
      return {
        tag: '정다각형의 한 내각', key: `n${n}`,
        stem: `정${n}각형의 한 내각의 크기는?${NICE(n) ? '' : ' (소수 첫째 자리까지)'}`,
        choices: mkChoices(I, [[e, '한 외각을 구했어요. 구하는 것은 한 내각이에요.'], [sum, '내각의 합이에요. n으로 나누어야 한 내각이에요.'], [180 / n, '180°를 n으로 나눴어요. 한 외각은 360°÷n이에요.'], [180 - e / 2, '다시 계산해 보세요.'], [I - 12, '다시 계산해 보세요.'], [I + 12, '다시 계산해 보세요.']], { pad: 12, valid: (v) => v > 0 && v < 360 })
      };
    },
    verify: (s) => { const M = reg.model(s); const Pn = regUp(M.n, 1); return { ans: angBetween(Pn[0], Pn[M.n - 1], Pn[1]), model: M.I }; }
  };

  /* ====================================================================== 2. 비로 n 구하기 */
  const ratioModel = (a, bb) => { const eps = (180 * bb) / (a + bb), nn = 360 / eps; return { a, bb, eps, I: 180 - eps, nn, valid: Math.abs(nn - Math.round(nn)) < 1e-9 && Math.round(nn) >= 3 }; };
  const RATIOS = [[1, 2], [1, 1], [3, 2], [2, 1], [5, 2], [3, 1], [4, 1], [5, 1], [7, 1], [9, 1]];
  const ratio = {
    id: 'p4-ratio', title: '비로 변의 수 구하기', short: '비로 n 구하기',
    question: '한 내각과 한 외각의 크기의 비가 주어지면 정다각형의 변의 수 n을 어떻게 구할까?',
    ctl: ['pgQa', 'pgQb'],
    presets: () => [[3, 2], [2, 1], [3, 1], [5, 1]].map((r, i) => ({ group: i === 0 ? '내각 : 외각' : '', label: `${r[0]} : ${r[1]}`, apply: (s) => { s.pgQa = r[0]; s.pgQb = r[1]; }, on: (s) => s.pgQa === r[0] && s.pgQb === r[1] })),
    init: (s) => { s.pgQa = 3; s.pgQb = 2; },
    reroll: (s) => { const pool = RATIOS.filter((r) => !(r[0] === s.pgQa && r[1] === s.pgQb)); const r = pool[Math.floor(Math.random() * pool.length)]; s.pgQa = r[0]; s.pgQb = r[1]; },
    model: (s) => {
      const a = clamp(Math.round(s.pgQa), 1, 9), bb = clamp(Math.round(s.pgQb), 1, 4), m = ratioModel(a, bb), pq = m.valid ? m : ratioModel(3, 2);
      return { ...m, n: m.valid ? Math.round(m.nn) : null, pa: pq.a, pb: pq.bb, pq, pn: Math.round(pq.nn) };
    },
    draw(b, s, M, C) {
      const m = C.problem ? M.pq : M, a = m.a, bb = m.bb, eps = m.eps, I = m.I, nn = m.nn, valid = C.problem ? true : M.valid;
      fit(b, { x0: -1.25, x1: 1.25, y0: -2.05, y1: 1.45 }, { t: 30, b: 82, l: 20, r: 20 });
      const st = C.step, K = b.k || 60;
      // 위: 180°를 내각 : 외각 으로 나눈 막대
      const W = 2.4, x0 = -W / 2, xm = x0 + (W * a) / (a + bb), y = -1.62, h = 0.2;
      fillPoly(b, [pt(x0, y), pt(xm, y), pt(xm, y + h), pt(x0, y + h)], 'sky', 0.55);
      fillPoly(b, [pt(xm, y), pt(x0 + W, y), pt(x0 + W, y + h), pt(xm, y + h)], 'rose', 0.55);
      poly(b, [pt(x0, y), pt(x0 + W, y), pt(x0 + W, y + h), pt(x0, y + h)], 'ink', 2.6);
      line(b, pt(xm, y - 0.04), pt(xm, y + h + 0.04), 'ink', 3);
      if (C.txt) {
        T(b, pt((x0 + xm) / 2, y), C.problem ? `내각 ${a}` : `내각 ${fmtN(I)}°`, { dy: -22, color: 'sky', size: 17 });
        T(b, pt((xm + x0 + W) / 2, y), C.problem ? `외각 ${bb}` : `외각 ${fmtN(eps)}°`, { dy: -22, color: 'rose', size: 17 });
        T(b, pt(0, y), `${a} : ${bb}`, { dy: h * K + 18, color: 'ink', size: 17 });
        if (!C.problem) T(b, pt(0, y), '(내각 + 외각 = 180°)', { dy: h * K + 40, color: 'muted', size: 14 });
      }
      // 아래: 외각을 한 점 둘레에 몇 번 채울 수 있는지
      const c = pt(0, 0.0), r = 0.95;
      const showRing = C.problem ? false : C.review ? st >= 2 : true;
      if (showRing) {
        const cntf = nn, cnt = Math.floor(cntf + 1e-9);
        for (let i = 0; i < cnt; i++) b.arc(c, r, (i * eps - 90) * DEG, ((i + 1) * eps - 90) * DEG, { sector: true, fill: 'rose', fillAlpha: i % 2 ? 0.3 : 0.5, color: 'rose', width: 1.6 });
        const rest = 360 - cnt * eps;
        if (rest > 1e-6) {
          b.arc(c, r, (cnt * eps - 90) * DEG, (270) * DEG, { sector: true, fill: 'amber', fillAlpha: 0.12, color: 'amber', width: 2.4 });
        }
        if (C.txt) {
          if (valid) T(b, c, `n = ${Math.round(nn)}`, { size: 24, color: 'amber' });
          else { T(b, c, `n = ${fmtN(nn)}`, { size: 22, color: 'amber', dy: -10 }); T(b, c, '자연수가 아니에요', { size: 15, color: 'amber', dy: 16 }); }
        }
      } else if (C.txt) T(b, c, C.problem ? '정n각형 → n = ?' : '', { size: 20, color: 'amber' });
      if (!C.txt) return;
      let r1, r2 = '', col = 'amber';
      if (C.problem) { r1 = `한 내각 : 한 외각 = ${a} : ${bb}`; r2 = '정다각형은 정몇 각형일까요?'; }
      else if (C.review && st === 1) { r1 = `한 외각 = 180° × ${bb}/${a + bb} = ${fmtN(eps)}°`; col = 'rose'; }
      else if (valid) { r1 = `n = 360° ÷ ${fmtN(eps)}° = ${Math.round(nn)}`; r2 = `→ 정${Math.round(nn)}각형`; }
      else { r1 = `n = 360° ÷ ${fmtN(eps)}° = ${fmtN(nn)}`; r2 = '자연수가 아니라서 정다각형이 없어요'; col = 'rose'; }
      T(b, pt(0, 1.45), r1, { dy: 38, size: b.W < 560 ? 16 : 17, color: col });
      T(b, pt(0, 1.45), r2, { dy: 64, size: b.W < 560 ? 15 : 16, color: 'amber' });
    },
    steps: (M) => [
      `한 내각 + 한 외각 = 180° 이고 내각 : 외각 = ${M.a} : ${M.bb} 이므로 한 외각 = 180° × ${M.bb}/${M.a + M.bb} = ${fmtN(M.eps)}°`,
      `정n각형의 한 외각은 360° ÷ n 이므로 n = 360° ÷ ${fmtN(M.eps)}° = ${fmtN(M.nn)}`,
      M.valid ? `n = ${M.n} 이므로 정${M.n}각형이에요.` : `n = ${fmtN(M.nn)} 은 자연수가 아니므로 이 비로는 정다각형이 만들어지지 않아요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>내각 : 외각</b>의 비를 바꿔 보세요. 한 외각이 정해지면 그 외각을 <b>360°</b> 둘레에 몇 번 채울 수 있는지가 <b>n</b>이에요. 딱 맞아 떨어질 때만(<b>자연수</b>) 정다각형이 돼요.',
      readouts: [rd('내각 : 외각', `${M.a} : ${M.bb}`, 'ink'), rd('한 외각', `${fmtN(M.eps)}°`, 'rose', `180° × ${M.bb}/${M.a + M.bb}`), rd('n = 360° ÷ (한 외각)', M.valid ? `${M.n}` : `${fmtN(M.nn)} (자연수 아님)`, M.valid ? 'amber' : 'rose', null, null, true)],
      status: M.valid ? { tone: 'ok', text: `정${M.n}각형이에요` } : { tone: 'warn', text: `n = ${fmtN(M.nn)}: 정다각형이 아니에요` },
      formula: `<p>(한 외각) $=180^{\\circ}\\times\\dfrac{${M.bb}}{${M.a + M.bb}}=${tx(M.eps)}^{\\circ}$</p><p>$n=\\dfrac{360^{\\circ}}{${tx(M.eps)}^{\\circ}}=${M.valid ? M.n : tx(M.nn)}$</p>`,
      rule: '내각 : 외각 = a : b 이면 한 외각 = 180° × $\\dfrac{b}{a+b}$, n = 360° ÷ (한 외각)',
      notes: notes('비는 <b>내각 : 외각</b>의 순서예요. 외각 : 내각으로 주어졌으면 비를 뒤집어요.', 'n은 자연수여야 해요. 나누어떨어지지 않으면 그런 정다각형은 없어요.')
    }),
    prob: (M) => {
      const n = M.pn, a = M.pa, bb = M.pb, eps = M.pq.eps;
      const tex = (v) => `\\text{정}${v}\\text{각형}`, plain = (v) => `정${v}각형`;
      return {
        tag: '비로 구하는 정다각형', key: `${a}:${bb}`,
        stem: `한 내각과 한 외각의 크기의 비가 ${a} : ${bb}인 정다각형은?`,
        choices: mkChoices(n, [[n + 2, '한 외각을 360°에 몇 번 채우는지 다시 구해 보세요.'], [n - 2, '한 외각을 360°에 몇 번 채우는지 다시 구해 보세요.'], [Math.round((a + bb) * 2 / 1), '내각의 비를 그대로 쓰지 말고 한 외각(360°를 나누는 값)을 구해요.'], [Math.round(360 / (180 * a / (a + bb))), '한 내각으로 360°를 나눴어요. 한 외각으로 나눠요.'], [n + 1, '다시 계산해 보세요.'], [n - 1, '다시 계산해 보세요.']], { tex, plain, pad: 1, valid: (v) => v >= 3 && v <= 24 })
      };
    },
    verify: (s) => { const M = ratio.model(s); let found = -1; for (let n = 3; n <= 60; n++) { const Pn = regUp(n, 1), I = angBetween(Pn[0], Pn[n - 1], Pn[1]); if (Math.abs(I / (180 - I) - M.pa / M.pb) < 1e-7) found = n; } return { ans: found, model: M.pn }; }
  };

  /* ====================================================================== 3. 두 대각선이 이루는 각 */
  const diag = {
    id: 'p4-diag', title: '정다각형의 두 대각선이 이루는 각', short: '두 대각선의 교각',
    question: '정다각형의 두 대각선 AC, BD가 만나서 이루는 각 ∠APB는 얼마일까?',
    ctl: ['pgDn'],
    init: (s) => { s.pgDn = 5; s.pgDv = 0; },
    reroll: (s) => { s.pgDn = pick([5, 6, 8, 9, 10, 12], s.pgDn); s.pgDv = rint(0, s.pgDn - 1); },
    model: (s) => {
      const n = clamp(Math.round(s.pgDn), 5, 12), v = ((s.pgDv | 0) % n + n) % n, Pn = regUp(n, 1), at = (k) => Pn[(v + k) % n];
      const A = at(0), B = at(1), Cc = at(2), D = at(3), Pp = inter(A, Cc, B, D), I = 180 - E(n), h = 180 / n;
      return { n, v, Pn, A, B, C: Cc, D, P: Pp, I, h, x: E(n), ab: I - h, y: 180 - E(n) };
    },
    draw(b, s, M, C) {
      const { n, Pn, A, B, C: Cc, D, P: Pp, I, h, x } = M, O = pt(0, 0), st = C.step;
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 88, l: 50, r: 50 });
      fillPoly(b, Pn, 'sky', 0.08);
      poly(b, Pn, 'ink', 3.4);
      const showD = true;
      if (showD) { line(b, A, Cc, 'green', 3.6); line(b, B, D, 'green', 3.6); }
      const nm = (p) => { const i = Pn.indexOf(p); return LET[(i - M.v + n) % n]; };
      if (!C.problem) {
        if (C.full || st >= 1) ang(b, B, A, Cc, { color: 'amber', r: 26, noMark: !(st === 1 && C.review), fa: 0.12, label: st === 1 && C.review ? `${fmtN(I)}°` : '', size: 15, labelDist: 50 });
        if (C.full || st >= 2) {
          ang(b, A, B, Cc, { color: 'sky', rings: 1, r: 28, label: n <= 9 ? `${fmtN(h)}°` : '', size: 15, labelDist: 56 });
          ang(b, Cc, A, B, { color: 'sky', rings: 1, r: 28 });
          ang(b, B, Cc, D, { color: 'sky', rings: 1, r: 28 });
          ang(b, D, B, Cc, { color: 'sky', rings: 1, r: 28 });
        }
        if (C.full || st >= 3) {
          ang(b, B, A, D, { color: 'green', rings: 2, r: 38, label: n <= 9 ? `${fmtN(M.ab)}°` : '', size: 14, labelDist: 36, labelRot: 22 });
          ang(b, Pp, A, B, { color: 'amber', r: 26, label: `${fmtN(x)}°`, size: 18, fa: 0.28, labelDist: 52 });
        }
      } else ang(b, Pp, A, B, { color: 'amber', r: 26, label: 'x', size: 18, fa: 0.28, labelDist: 46 });
      Pn.forEach((p) => b.point(p, { color: 'ink', r: 4.5 }));
      if (C.txt) {
        Pn.forEach((p) => tagOut(b, p, O, nm(p), { size: 17, gap: 10 }));
        b.point(Pp, { color: 'amber', r: 5 });
        T(b, Pp, 'P', { dx: 0, dy: 16, size: 17, color: 'amber' });
        if (!C.problem && !C.thumb && !C.review) pickHandle(b, s, 'pgDv', Pn, '꼭짓점 A 고르기');
        const yb = Math.max(...Pn.map((p) => p.y));
        let r1, r2 = '', c1 = 'sky';
        if (C.problem) r1 = `∠APB = x 의 크기는?`;
        else if (C.review && st === 1) r1 = `한 내각 = 180°×(${n}−2)÷${n} ${eq(I)} ${fmtN(I)}°`;
        else if (C.review && st === 2) r1 = `△ABC: 밑각 = (180° − ${fmtN(I)}°) ÷ 2 ${eq(h)} ${fmtN(h)}°`;
        else if (C.review && st === 3) { r1 = `∠ABD = ${fmtN(I)}° − ${fmtN(h)}° ${eq(M.ab)} ${fmtN(M.ab)}°`; r2 = `∠APB = 180° − ${fmtN(h)}° − ${fmtN(M.ab)}° ${eq(x)} ${fmtN(x)}°`; }
        else { r1 = `∠APB = 360° ÷ ${n} ${eq(x)} ${fmtN(x)}°`; r2 = `∠BPC = 180° − ${fmtN(x)}° ${eq(M.y)} ${fmtN(M.y)}°`; c1 = 'amber'; }
        T(b, pt(0, yb), r1, { dy: 48, size: b.W < 560 ? 16 : 17, color: c1 });
        T(b, pt(0, yb), r2, { dy: 76, size: b.W < 560 ? 15 : 16, color: 'sky' });
      }
    },
    steps: (M) => [
      `정${M.n}각형의 한 내각은 180°×(${M.n}−2)÷${M.n} ${eq(M.I)} ${fmtN(M.I)}° 예요. (∠ABC)`,
      `△ABC는 AB=BC인 이등변삼각형이므로 ∠BAC=∠BCA=(180°−${fmtN(M.I)}°)÷2 ${eq(M.h)} ${fmtN(M.h)}° 예요. 같은 방법으로 ∠CBD=∠CDB=${fmtN(M.h)}°`,
      `∠ABD=∠ABC−∠CBD=${fmtN(M.I)}°−${fmtN(M.h)}° ${eq(M.ab)} ${fmtN(M.ab)}° 이므로 △ABP에서 ∠APB=180°−${fmtN(M.h)}°−${fmtN(M.ab)}° ${eq(M.x)} ${fmtN(M.x)}°`
    ],
    view: (M) => ({
      guide: '<b>노란 점</b>을 끌어 시작 꼭짓점 A를 바꾸고, 막대로 <b>n</b>을 바꿔 보세요. 두 대각선 AC, BD가 만나서 이루는 ∠APB는 늘 <b>한 외각(360°÷n)</b>과 같아요.',
      readouts: [rd('한 내각 ∠ABC', `${fmtN(M.I)}°`, 'amber'), rd('이등변삼각형의 밑각', `${fmtN(M.h)}°`, 'sky', '(180° − 한 내각) ÷ 2'), rd('∠APB', `${fmtN(M.x)}°`, 'amber', '360° ÷ n = 한 외각', null, true)],
      formula: `<p>$\\angle APB=180^{\\circ}-${tx(M.h)}^{\\circ}-${tx(M.ab)}^{\\circ}=${tx(M.x)}^{\\circ}$</p><p>$\\angle APB=\\dfrac{360^{\\circ}}{${M.n}}${eq(M.x) === '=' ? '=' : '\\approx'}${tx(M.x)}^{\\circ}$</p>`,
      rule: '정n각형의 두 대각선 AC, BD가 이루는 ∠APB = 360° ÷ n',
      notes: notes('∠ABD는 한 내각 ∠ABC가 아니에요. ∠CBD(밑각)를 뺀 값이에요.', '∠APB와 ∠BPC를 헷갈리지 마세요. 합이 180°이고 ∠APB가 더 작아요.')
    }),
    prob: (M) => {
      const { n, x, I, h } = M;
      return {
        tag: '정다각형의 대각선이 이루는 각', key: `n${n}`,
        stem: `정${n}각형 ${LET.slice(0, n)}에서 두 대각선 AC와 BD의 교점을 P라 할 때, ∠APB의 크기 $x$는?${NICE(n) ? '' : ' (소수 첫째 자리까지)'}`,
        choices: mkChoices(x, [[180 - x, '∠BPC를 구했어요. ∠APB는 외각과 같아요.'], [I, '한 내각이에요. ∠APB는 아니에요.'], [h, '이등변삼각형의 밑각이에요.'], [2 * h + 0, '밑각의 두 배예요. ∠APB는 외각 360°÷n이에요.'], [x + 12, '다시 계산해 보세요.'], [x - 10, '다시 계산해 보세요.']], { pad: 10, valid: (v) => v > 0 && v < 180 })
      };
    },
    verify: (s) => { const M = diag.model(s); return { ans: angBetween(M.P, M.A, M.B), model: M.x, extra: [[angBetween(M.A, M.B, M.C), M.h], [angBetween(M.B, M.A, M.D), M.ab]] }; }
  };

  /* ====================================================================== 4. 변을 공유하는 두 정다각형 */
  function joinGeom(n, m) {
    const th = 180 / n, ph = 180 / m, Rn = 0.5 / sin(th), Rm = 0.5 / sin(ph), cn = pt(-Rn * cos(th), 0), cm = pt(Rm * cos(ph), 0);
    const A = pt(0, -0.5), Bp = pt(0, 0.5);
    const polyN = Array.from({ length: n }, (_, i) => polar(cn, Rn, -th + (360 * i) / n));
    const polyM = Array.from({ length: m }, (_, i) => polar(cm, Rm, 180 + ph - (360 * i) / m));
    // polyN[0]=A(위, 오른쪽), polyN[1]=B(아래) ; polyM[0]=A, polyM[1]=B
    return { A, B: Bp, polyN, polyM, P: polyN[n - 1], Q: polyM[m - 1], Rm, ph, cm };
  }
  const join = {
    id: 'p4-join', title: '변을 공유하는 두 정다각형', short: '정다각형 결합',
    question: '정다각형 두 개를 한 변 AB가 겹치도록 붙이면 꼭짓점 A에서 남는 각은 얼마일까?',
    ctl: ['pgJn', 'pgJm', 'pgJl', 'pgJt'], anim: { key: 'pgJt', dur: 5, label: '가로로 밀어 붙이기', start: 1 },
    init: (s) => { s.pgJn = 5; s.pgJm = 5; s.pgJl = 4; s.pgJt = 1; },
    reroll: (s) => { const pool = [[5, 5], [5, 6], [6, 6], [4, 5], [4, 6], [6, 8], [5, 8], [8, 8], [3, 8], [5, 7].slice()]; const r = pool[Math.floor(Math.random() * pool.length)]; s.pgJn = r[0]; s.pgJm = r[1]; s.pgJl = rint(3, 8); },
    model: (s) => {
      const n = clamp(Math.round(s.pgJn), 3, 8), m = clamp(Math.round(s.pgJm), 3, 8), L = clamp(Math.round(s.pgJl), 2, 8);
      const mk = (n0, m0) => { const In = 180 - E(n0), Im = 180 - E(m0), x = 360 - In - Im; return { n: n0, m: m0, In, Im, x, valid: x < 180 - 1e-9, base: (180 - x) / 2 }; };
      const cur = mk(n, m), pr = cur.valid ? cur : mk(5, 5);
      return { ...cur, L, pr, g: joinGeom(n, m), gp: joinGeom(pr.n, pr.m) };
    },
    draw(b, s, M, C) {
      const q = C.problem ? M.pr : M, g = C.problem ? M.gp : M.g, { n, m, In, Im, x, valid, base } = q, { A, B, polyN, polyM, P: Pp, Q } = g;
      const t = C.problem || C.review ? 1 : C.t, off = (1 - seg01(t, 0, 0.8)) * 1.3;
      const sh = (pts) => pts.map((p) => pt(p.x + off, p.y)), pM = sh(polyM), Qs = pt(Q.x + off, Q.y), As = pt(A.x + off, A.y), Bs = pt(B.x + off, B.y);
      const all = polyN.concat(pM), box = bboxOf(all);
      fit(b, box, { t: 52, b: 100, l: 40, r: 40 });
      const done = off < 0.001, st = C.step;
      fillPoly(b, polyN, 'sky', 0.14); fillPoly(b, pM, 'green', 0.14);
      poly(b, polyN, 'ink', 3.4); poly(b, pM, 'ink', 3.4);
      if (done) line(b, A, B, 'amber', 5);
      // 같은 길이 눈금: AP = AQ = AB
      if (done) { tick(b, A, Pp, 1, 'rose'); tick(b, A, Q, 1, 'rose'); }
      if (done && valid && (C.problem || C.full || st >= 3)) { line(b, Pp, Q, 'green', 3.2, { dash: [7, 6] }); }
      if (!C.thumb) { [A, B, Pp].concat(polyN.slice(2, n - 1)).forEach((p) => b.point(p, { color: 'ink', r: 4 })); }
      if (C.txt) {
        b.point(A, { color: 'ink', r: 4.5 }); b.point(B, { color: 'ink', r: 4.5 });
        b.point(Pp, { color: 'ink', r: 4.5 }); b.point(Qs, { color: 'ink', r: 4.5 });
        tagOut(b, Pp, pt(0, 0.0), 'P', { size: 17, gap: 11 }); tagOut(b, Qs, pt(0, 0), 'Q', { size: 17, gap: 11 });
        T(b, A, 'A', { dy: -18, size: 18 }); T(b, B, 'B', { dy: 20, size: 18 });
        if (!C.problem && done) T(b, mid(A, B), `${M.L} cm`, { dx: 8, dy: 40, size: 14, color: 'amber', align: 'left' });
      }
      if (done) {
        if (!C.problem && (C.full || st >= 1)) {
          ang(b, A, B, Pp, { color: 'sky', r: 26, label: `${fmtN(In)}°`, size: 14, labelDist: 54, rings: 1 });
          ang(b, A, Q, B, { color: 'green', r: 26, label: `${fmtN(Im)}°`, size: 14, labelDist: 54, rings: 1 });
        }
        if (!C.problem && (C.full || st >= 2)) ang(b, A, Pp, Q, { color: 'violet', big: x > 180, r: 36, label: `${fmtN(x)}°`, size: 16, fa: 0.22, labelDist: 62 });
        if (valid && (C.problem || C.full || st >= 3)) {
          ang(b, Pp, Q, A, { color: 'amber', r: 28, rings: 1, label: C.problem ? 'x' : `${fmtN(base)}°`, size: C.problem ? 17 : 15, fa: 0.26, labelDist: 46, labelRot: 40 });
          ang(b, Q, A, Pp, { color: 'amber', r: 28, rings: 1, fa: 0.26 });
        }
      }
      if (!C.txt) return;
      const yb = Math.max(...polyN.concat(pM).map((p) => p.y));
      let r1, r2 = '', c1 = 'amber';
      if (C.problem) { r1 = `정${n}각형과 정${m}각형이 변 AB를 공유해요`; r2 = `AP = AQ 일 때, ∠APQ = x 의 크기는?`; }
      else if (!done) { r1 = '오른쪽 도형을 가로로 밀어 붙여 보세요'; c1 = 'green'; }
      else if (C.review && st === 1) { r1 = `정${n}각형의 한 내각 ${fmtN(In)}°`; r2 = `정${m}각형의 한 내각 ${fmtN(Im)}°`; c1 = 'sky'; }
      else if (C.review && st === 2) { r1 = `∠PAQ = 360° − ${fmtN(In)}° − ${fmtN(Im)}° = ${fmtN(x)}°`; }
      else if (!valid) { r1 = `A에서 남는 각 ∠PAQ = 360° − ${fmtN(In)}° − ${fmtN(Im)}° = ${fmtN(x)}°`; r2 = x > 180 + 1e-9 ? '180°보다 커요' : '일직선이에요 (삼각형 APQ가 없어요)'; }
      else { r1 = `∠PAQ = 360° − ${fmtN(In)}° − ${fmtN(Im)}° = ${fmtN(x)}°`; r2 = `∠APQ = (180° − ${fmtN(x)}°) ÷ 2 = ${fmtN(base)}°`; }
      T(b, pt((box.x0 + box.x1) / 2, yb), r1, { dy: 44, size: b.W < 560 ? 15 : 17, color: c1 });
      T(b, pt((box.x0 + box.x1) / 2, yb), r2, { dy: 72, size: b.W < 560 ? 15 : 16, color: 'rose' });
    },
    steps: (M) => [
      `정${M.n}각형의 한 내각은 ${fmtN(M.In)}°, 정${M.m}각형의 한 내각은 ${fmtN(M.Im)}°예요. (한 내각 = 180° × (변의 수 − 2) ÷ 변의 수)`,
      `점 A 둘레의 각은 360°이므로 남는 각 ∠PAQ = 360° − ${fmtN(M.In)}° − ${fmtN(M.Im)}° = ${fmtN(M.x)}°`,
      M.valid ? `AP=AQ=AB 이므로 △APQ는 이등변삼각형이에요. ∠APQ = (180° − ${fmtN(M.x)}°) ÷ 2 = ${fmtN(M.base)}°` : `∠PAQ가 180°가 되거나 넘으면 P, A, Q가 삼각형을 이루지 않아요. 변의 수를 늘려 ∠PAQ가 180°보다 작게 만들어 보세요.`
    ],
    view: (M) => ({
      guide: '막대로 두 정다각형의 변의 수와 <b>변의 길이</b>를 바꾸고, ▶로 오른쪽 도형을 <b>가로로 밀어</b> 붙여 보세요. 두 도형의 한 내각을 빼고 남은 <b>∠PAQ</b>가 AP = AQ인 이등변삼각형의 꼭지각이에요.',
      readouts: [rd(`정${M.n}각형의 한 내각`, `${fmtN(M.In)}°`, 'sky'), rd(`정${M.m}각형의 한 내각`, `${fmtN(M.Im)}°`, 'green'), rd('A에서 남는 각 ∠PAQ', `${fmtN(M.x)}°`, 'amber', '360° − 두 내각'), rd('밑각 ∠APQ', M.valid ? `${fmtN(M.base)}°` : '—', 'rose', M.valid ? '(180° − ∠PAQ) ÷ 2' : '∠PAQ < 180°일 때', null, true)],
      formula: `<p>$\\angle PAQ=360^{\\circ}-${tx(M.In)}^{\\circ}-${tx(M.Im)}^{\\circ}=${tx(M.x)}^{\\circ}$</p>${M.valid ? `<p>$\\angle APQ=\\dfrac{180^{\\circ}-${tx(M.x)}^{\\circ}}{2}=${tx(M.base)}^{\\circ}$</p>` : ''}`,
      rule: '한 점 둘레의 각은 360°. 정다각형의 변의 길이는 모두 같으므로 AP = AQ (이등변삼각형)',
      notes: notes('한 변이 겹쳐 있으니 AB 둘레에서 두 도형의 내각을 <b>모두</b> 빼야 해요.', '변의 길이를 바꿔도 각의 크기는 변하지 않아요. 닮음인 도형이 되기 때문이에요.')
    }),
    prob: (M) => {
      const q = M.pr, { n, m, In, Im, x, base } = q;
      return {
        tag: '변을 공유하는 정다각형', key: `${n},${m}`,
        stem: `그림과 같이 한 변의 길이가 같은 정${n}각형과 정${m}각형이 변 AB를 공유하고 있다. 점 A에서 두 정다각형의 이웃한 꼭짓점 P, Q에 대하여 $\\overline{AP}=\\overline{AQ}$일 때, ∠APQ의 크기 $x$는?`,
        choices: mkChoices(base, [[x, '꼭지각 ∠PAQ를 구했어요. 구하는 것은 밑각 ∠APQ예요.'], [180 - x, '이등변삼각형의 밑각의 합이에요. 2로 나누어야 해요.'], [x / 2, '꼭지각의 반이에요. (180° − ∠PAQ) ÷ 2예요.'], [In, '정다각형의 한 내각이에요.'], [base + 8, '다시 계산해 보세요.'], [base - 6, '다시 계산해 보세요.']], { pad: 6, valid: (v) => v > 0 && v < 90 })
      };
    },
    verify: (s) => { const M = join.model(s), g = M.gp, q = M.pr; return { ans: angBetween(g.P, g.Q, g.A), model: q.base, extra: [[angBetween(g.A, g.P, g.Q), q.x]] }; }
  };

  /* ====================================================================== 5. 한 꼭짓점에서 그은 대각선이 나누는 각 */
  const fan = {
    id: 'p4-fan', title: '한 꼭짓점에서 그은 대각선이 나누는 각', short: '대각선이 나누는 각',
    question: '정n각형의 한 꼭짓점에서 대각선을 모두 그으면 그 꼭짓점의 내각은 어떻게 나뉠까?',
    ctl: ['pgFn'],
    init: (s) => { s.pgFn = 7; s.pgFv = 0; s.pgFk = 2; },
    reroll: (s) => { s.pgFn = pick([5, 6, 8, 9, 10, 12], s.pgFn); s.pgFv = rint(0, s.pgFn - 1); s.pgFk = rint(2, Math.min(4, s.pgFn - 2)); },
    model: (s) => {
      const n = clamp(Math.round(s.pgFn), 5, 12), v = ((s.pgFv | 0) % n + n) % n, k = clamp(Math.round(s.pgFk || 2), 2, Math.min(4, n - 2)), Pn = regUp(n, 1), at = (j) => Pn[(v + j) % n];
      return { n, v, k, Pn, at, I: 180 - E(n), h: 180 / n, kk: (k * 180) / n };
    },
    draw(b, s, M, C) {
      const { n, v, k, Pn, at, I, h, kk } = M, O = pt(0, 0), A = at(0), st = C.step;
      fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 40, b: 88, l: 50, r: 50 });
      fillPoly(b, Pn, 'sky', 0.08);
      if (!C.problem && !C.review && C.full) for (let j = 1; j <= k; j++) fillPoly(b, [A, at(j), at(j + 1)], 'amber', 0.13);
      if (C.problem || (C.review && st >= 3)) for (let j = 1; j <= k; j++) fillPoly(b, [A, at(j), at(j + 1)], 'amber', 0.16);
      poly(b, Pn, 'ink', 3.4);
      const showD = C.problem ? true : C.review ? st >= 1 : true;
      if (showD) for (let j = 2; j <= n - 2; j++) line(b, A, at(j), 'green', n > 9 ? 2.6 : 3.4);
      if (!C.problem && (C.full || st >= 1)) ang(b, A, at(1), at(n - 1), { color: 'amber', r: 30, noMark: !(C.review && st === 1), fa: 0.12, label: C.review && st === 1 ? `${fmtN(I)}°` : '', size: 15, labelDist: 56 });
      // 같은 크기의 각: 대각선이 나눈 n−2개의 각
      if (!C.problem && (C.full || st >= 2)) for (let j = 1; j <= n - 2; j++) ang(b, A, at(j), at(j + 1), { color: 'sky', rings: 1, r: 36, label: j === Math.ceil((n - 2) / 2) ? `${fmtN(h)}°` : '', size: 15 });
      if (C.problem) ang(b, A, at(1), at(k + 1), { color: 'amber', r: 46, label: 'x', size: 18, fa: 0.22, labelDist: 70 });
      Pn.forEach((p) => b.point(p, { color: 'ink', r: n > 9 ? 3.8 : 4.5 }));
      if (C.txt) {
        Pn.forEach((p, i) => tagOut(b, p, O, LET[(i - v + n) % n], { size: n > 9 ? 14 : 17, gap: 10 }));
        if (!C.problem && !C.thumb && !C.review) pickHandle(b, s, 'pgFv', Pn, '꼭짓점 A 고르기');
        else b.point(A, { color: 'amber', r: 6.5 });
        const yb = Math.max(...Pn.map((p) => p.y));
        let r1, r2 = '', c1 = 'sky';
        if (C.problem) r1 = `∠BA${LET[k + 1]} = x 의 크기는?`;
        else if (C.review && st === 1) r1 = `한 내각 = 180°×(${n}−2)÷${n} ${eq(I)} ${fmtN(I)}°`;
        else if (C.review && st === 2) r1 = `∠BAC = (180° − ${fmtN(I)}°) ÷ 2 ${eq(h)} ${fmtN(h)}°`;
        else if (C.review && st === 3) { r1 = `같은 각이 ${n - 2}개 → ${fmtN(h)}° × ${n - 2} ${eq(I)} ${fmtN(I)}°`; r2 = `∠BA${LET[k + 1]} = ${fmtN(h)}° × ${k} = ${fmtN(kk)}°`; c1 = 'amber'; }
        else { r1 = `대각선 ${n - 3}개 → 같은 각 ${n - 2}개, 각각 ${fmtN(h)}°`; r2 = `∠BA${LET[k + 1]} = ${fmtN(h)}° × ${k} = ${fmtN(kk)}°`; }
        T(b, pt(0, yb), r1, { dy: 48, size: b.W < 560 ? 15 : 17, color: c1 });
        T(b, pt(0, yb), r2, { dy: 76, size: b.W < 560 ? 16 : 17, color: 'amber' });
      }
    },
    steps: (M) => [
      `정${M.n}각형의 한 내각은 180°×(${M.n}−2)÷${M.n} ${eq(M.I)} ${fmtN(M.I)}° 예요. 한 꼭짓점 A에서 대각선 ${M.n - 3}개를 모두 그어요.`,
      `△ABC는 AB=BC인 이등변삼각형이므로 ∠BAC=(180°−${fmtN(M.I)}°)÷2 ${eq(M.h)} ${fmtN(M.h)}° 예요. 다른 이등변삼각형에서도 같은 값이 나와요.`,
      `내각이 크기가 같은 ${M.n - 2}개의 각으로 나뉘므로 ∠BA${LET[M.k + 1]} = ${fmtN(M.h)}° × ${M.k} = ${fmtN(M.kk)}°`
    ],
    view: (M) => ({
      guide: '<b>노란 점</b>을 끌어 꼭짓점 A를 고르고, 막대로 <b>n</b>을 바꿔 보세요. A에서 그은 대각선은 내각을 <b>크기가 같은 (n−2)개의 각</b>으로 나눠요. 같은 표시의 각은 크기가 같아요.',
      readouts: [rd('한 내각', `${fmtN(M.I)}°`, 'amber'), rd('나뉜 각의 개수', `${M.n - 2}개`, 'sky', 'n − 2'), rd('나뉜 한 각', `${fmtN(M.h)}°`, 'sky', '180° ÷ n', null, true)],
      formula: `<p>(나뉜 한 각) $=\\dfrac{180^{\\circ}}{n}=\\dfrac{180^{\\circ}}{${M.n}}${eq(M.h) === '=' ? '=' : '\\approx'}${tx(M.h)}^{\\circ}$</p><p>(한 내각) $=${tx(M.h)}^{\\circ}\\times${M.n - 2}${eq(M.I) === '=' ? '=' : '\\approx'}${tx(M.I)}^{\\circ}$</p>`,
      rule: '정n각형의 한 꼭짓점에서 그은 대각선은 내각을 (n−2)등분한다. 각각 180° ÷ n',
      notes: notes('이웃한 변과 대각선 사이의 각 ∠BAC가 먼저 구해져요. 이등변삼각형의 밑각이에요.', '구하려는 각이 나뉜 각 몇 개로 이루어졌는지 세어서 곱하세요.')
    }),
    prob: (M) => {
      const { n, k, h, I, kk } = M;
      return {
        tag: '대각선이 나누는 각', key: `n${n}k${k}`,
        stem: `정${n}각형 ${LET.slice(0, n)}에서 꼭짓점 A에서 모든 대각선을 그을 때, ∠BA${LET[k + 1]}의 크기 $x$는?${NICE(n) ? '' : ' (소수 첫째 자리까지)'}`,
        choices: mkChoices(kk, [[h, `나뉜 각 하나예요. ∠BA${LET[k + 1]}는 그 각이 ${k}개 모인 각이에요.`], [I, '꼭짓점 A의 한 내각이에요. 일부분만 구해요.'], [(k + 1) * h, `나뉜 각 ${k + 1}개를 더했어요. ${k}개예요.`], [(k - 1) * h, `나뉜 각 ${k - 1}개만 더했어요. ${k}개예요.`], [kk + 12, '다시 계산해 보세요.'], [180 - kk, '다시 계산해 보세요.']], { pad: 12, valid: (v) => v > 0 && v < 180 })
      };
    },
    verify: (s) => { const M = fan.model(s); return { ans: angBetween(M.at(0), M.at(1), M.at(M.k + 1)), model: M.kk, extra: [[angBetween(M.at(0), M.at(1), M.at(2)), M.h]] }; }
  };

  G.register(40, 't4', '④ 정다각형', '정다각형', PARAMS, [reg, ratio, diag, join, fan]);
})();
