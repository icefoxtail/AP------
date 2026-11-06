/* ==========================================================================
   중2 · 도형의 닮음 — 탭 ⑥ 「직각삼각형의 수선과 닮음」 (t6.js, order 60) — 장면 5개
   · s6-1 세 직각삼각형       · △ABC ∽ △HBA ∽ △HAC (같은 각 표시를 따라 대응 찾기)
   · s6-2 [심화] AB² 의 값     · △ABC ∽ △HBA 에서 AB : HB = BC : BA
   · s6-3 [심화] AC² 의 값     · △ABC ∽ △HAC 에서 AC : HC = BC : AC
   · s6-4 [심화] AH² 의 값     · △HBA ∽ △HAC 에서 BH : AH = AH : CH
   · s6-5 [심화] 두 가지 넓이  · AB × AC = BC × AH
   모두 닮음으로만 설명해요(이름 붙은 공식으로 외우지 않아요). 정수가 아닐 수 있는 길이 대신 제곱의 값(예: AB² = 52)을 써요.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  const { clamp, pt, add, sub, mul, mid, lerp, unit, centroid, seeded, ri, rpick, T, sideTag, dim, ang, tick, fillPoly, line, poly, fit, P, rd, notes, mkChoices, mkTextChoices, gcd, fmtN, bboxOf, phone, capSize, frT, vtx, dist } = G;

  const PARAMS = {
    smRb: P('BH의 길이', 2, 9, 1, 4, { color: 'sky', format: (v) => v + ' cm' }),
    smRc: P('CH의 길이', 2, 9, 1, 9, { color: 'green', format: (v) => v + ' cm' }),
    smRt: P('삼각형의 크기 t', 1, 2, 1, 1, { color: 'amber', format: (v) => `${v}배`, hint: 'AB=15t, AC=20t, BC=25t' })
  };
  // 직각삼각형: A 가 직각, 빗변 BC 가 아래. BH = b, CH = c, AH² = b·c
  function rtGeo(b, c) {
    const BC = b + c, ah = Math.sqrt(b * c), B = pt(0, 0), Cc = pt(BC, 0), H = pt(b, 0), A = pt(b, -ah);
    return { b, c, BC, AH2: b * c, AB2: b * BC, AC2: c * BC, A, B, C: Cc, H };
  }
  function drawRt(b, g, o = {}) {
    const cen = centroid([g.A, g.B, g.C]);
    const hi = o.hi || {};
    fillPoly(b, [g.A, g.B, g.H], hi.l ? 'sky' : 'sky', hi.l ? 0.3 : 0.14); fillPoly(b, [g.A, g.H, g.C], hi.r ? 'green' : 'green', hi.r ? 0.3 : 0.14);
    if (hi.big) fillPoly(b, [g.A, g.B, g.C], 'amber', 0.14);
    poly(b, [g.A, g.B, g.C], 'ink', 3.6); line(b, g.A, g.H, hi.ah || 'ink', hi.ah ? 4.4 : 3.2);
    ang(b, g.A, g.B, g.C, { color: 'rose', r: 18 }); ang(b, g.H, g.A, g.B, { color: 'rose', r: 16 });
    return cen;
  }
  const rtGeoNames = (b, g, cen) => { [[g.A, 'A'], [g.B, 'B'], [g.C, 'C']].forEach(([p, nm]) => vtx(b, p, cen, nm, { size: 17, gap: 12 })); b.point(g.H, { color: 'ink', r: 4.2 }); T(b, g.H, 'H', { dy: 18, size: 17 }); };
  const wrapDraw = (kindFn) => kindFn;

  // 공통: 장면별로 그림에서 강조할 것과 문제를 만드는 틀
  function mkRt(o) {
    return {
      id: o.id, title: o.title, short: o.short, question: o.question,
      ctl: o.fixed ? ['smRt'] : ['smRb', 'smRc'],
      init: (s) => { s.smRb = 4; s.smRc = 9; s.smRt = 1; },
      gen: o.gen, model: o.model, steps: o.steps, view: o.view, prob: o.prob,
      draw(b, s, M, C) {
        const prob = C.problem, pk = M.pk, st = C.step, g = prob ? o.pgeo(pk) : o.geo(M);
        fit(b, bboxOf([g.A, g.B, g.C]), { t: 44, b: 96, l: 54, r: 54 });
        const hi = prob ? {} : o.hi(M, C);
        const cen = drawRt(b, g, { hi });
        const sz = 16, lb = (p, q, c, t, col, gap) => t != null && sideTag(b, p, q, c, t, { color: col, size: sz, gap: gap || 12 });
        const L = prob ? o.plabels(pk, g) : o.labels(M, g, C);
        [['BH', g.B, g.H, 'sky'], ['HC', g.H, g.C, 'green']].forEach(([k, p, q, col]) => { if (L[k] != null) lb(p, q, pt(cen.x, cen.y - 4), L[k], L['c' + k] || col, 12); });
        if (L.BC != null) dim(b, g.B, g.C, pt(cen.x, cen.y - 4), L.BC, { color: L.cBC || 'ink', off: 38, size: sz }); // 빗변 전체 길이는 괄호선으로(BH, HC 와 헷갈리지 않게)
        [['AB', g.A, g.B], ['AC', g.A, g.C], ['AH', g.A, g.H]].forEach(([k, p, q]) => { if (L[k] != null) { const c = k === 'AH' ? pt(g.A.x - 5, g.A.y) : cen; sideTag(b, p, q, c, L[k], { color: L['c' + k] || 'ink', size: sz, gap: 11 }); } });
        rtGeoNames(b, g, cen);
        if (C.txt && !prob) T(b, pt((g.B.x + g.C.x) / 2, 0), o.cap(M, C, st), { dy: 100, size: phone(b) ? 13 : 16, color: 'amber' });
      }
    };
  }
  const bcF = (M) => `$\\overline{BC}=${M.b}+${M.c}=${M.BC}$`;

  /* ====================================================================== 1. 세 직각삼각형 */
  const trio = mkRt({
    id: 'sm6-trio', title: '수선이 만드는 세 직각삼각형', short: '세 직각삼각형',
    question: '직각삼각형 ABC의 꼭짓점 A에서 빗변 BC에 수선 AH를 그으면 직각삼각형이 세 개가 돼. 이 세 삼각형은 서로 어떤 관계일까?',
    gen: (seed) => { const r = seeded('h1' + seed), b = ri(r, 2, 9); let c = ri(r, 2, 9); if (c === b) c = c === 9 ? 8 : c + 1; return { seed, b, c, kind: ri(r, 0, 1) }; },
    model: (s) => ({ ...rtGeo(clamp(Math.round(s.smRb), 2, 9), clamp(Math.round(s.smRc), 2, 9)) }),
    geo: (M) => M, pgeo: (pk) => rtGeo(pk.b, pk.c),
    hi: (M, C) => ({ big: C.review && C.step === 1, l: C.review && C.step === 2, r: C.review && C.step === 3 }),
    labels: (M, g) => ({ BH: String(g.b), HC: String(g.c), cBH: 'sky', cHC: 'green' }),
    plabels: (pk, g) => ({}),
    cap: (M, C, st) => (st >= 3 ? '세 삼각형 모두 직각, 같은 표시의 각이 대응해요' : st >= 2 ? '△ABC ∽ △HBA : ∠B 공통, 직각' : st >= 1 ? '△ABC, △HBA, △HAC' : ''),
    steps: (M) => [
      '직각삼각형 ABC와 수선 AH가 만든 △ABC, △HBA, △HAC는 모두 직각삼각형이에요.',
      '△ABC와 △HBA는 ∠B가 공통이고 ∠BAC=∠BHA=90°이므로 AA 닮음이에요. 따라서 $\\angle BAH=\\angle C$예요(● 표시).',
      '△ABC와 △HAC는 ∠C가 공통이고 직각이 있으므로 닮음이에요. 그러므로 $\\triangle ABC\\sim\\triangle HBA\\sim\\triangle HAC$ (대응 순서대로 써요)'
    ],
    view: (M) => ({
      guide: '<b>BH, CH</b> 막대로 삼각형의 모양을 바꿔 보세요. 어떻게 바꿔도 같은 표시의 각을 가진 <b>세 직각삼각형은 닮은 도형</b>이에요.',
      readouts: [rd('BH, CH', `${M.b}, ${M.c}`, 'sky'), rd('BC', `${M.BC}`, 'ink', 'BH + CH'), rd('AH²', `${M.AH2}`, 'green', `${M.b} × ${M.c}`)],
      formula: `<p>$\\triangle ABC\\sim\\triangle HBA\\sim\\triangle HAC$ (AA 닮음)</p><p>$\\angle BAH=\\angle C,\\ \\angle CAH=\\angle B$</p>`,
      rule: '직각삼각형의 꼭짓점에서 빗변에 내린 수선은 처음 삼각형과 닮은 직각삼각형 두 개를 만든다',
      notes: notes('닮음 기호는 <b>대응하는 꼭짓점의 순서</b>로 써요: △ABC ∽ △HBA ∽ △HAC.', '같은 표시(●, ×)의 각을 찾으면 대응하는 점이 보여요.')
    }),
    prob: (M) => {
      const pk = M.pk;
      if (pk.kind === 0) {
        const items = [{ h: '$\\angle C$', ok: true, hint: '' }, { h: '$\\angle B$', hint: '∠B는 ∠CAH와 같은 각이에요. △HAC와의 대응을 보세요.' }, { h: '$\\angle BAC$', hint: '직각이에요. ∠BAH는 직각의 일부분이라 더 작아요.' }, { h: '$\\angle CAH$', hint: '∠CAH는 ∠B와 같은 각이에요.' }, { h: '$\\angle AHC$', hint: '직각이에요. ∠BAH보다 커요.' }];
        return { tag: '세 직각삼각형: 같은 각 찾기', key: `r0${pk.b}${pk.c}`, stem: '직각삼각형 ABC에서 점 A에서 빗변 BC에 내린 수선의 발을 H라 할 때, ∠BAH와 크기가 같은 각은?', choices: mkTextChoices(items, `r${pk.seed}`) };
      }
      const items = [{ h: '$\\overline{CH}$', ok: true }, { h: '$\\overline{AC}$', hint: 'AC는 △ABC의 변이에요. △HAC에서 AH와 짝이 되는 변을 찾으세요.' }, { h: '$\\overline{BC}$', hint: 'BC는 빗변이에요. 같은 삼각형 안에서 대응해요.' }, { h: '$\\overline{AB}$', hint: 'AB는 △ABC의 변이에요.' }, { h: '$\\overline{BH}$', hint: 'BH는 이미 식의 앞에 있어요. △HAC 쪽의 변이 와야 해요.' }];
      return { tag: '세 직각삼각형: 대응변 찾기', key: `r1${pk.b}${pk.c}`, stem: '△HBA ∽ △HAC에서 $\\overline{BH}:\\overline{AH}=\\overline{AH}:x$일 때, $x$에 알맞은 선분은?', choices: mkTextChoices(items, `r${pk.seed}`) };
    }
  });

  /* ====================================================================== 2~4. 제곱의 값 */
  const mkSq = (id, which, title, short, question) => {
    const lab = { AB2: ['AB', 'BH', 'BC', 'sky', '$\\triangle ABC\\sim\\triangle HBA$', '∠B 공통', 'B'], AC2: ['AC', 'CH', 'CB', 'green', '$\\triangle ABC\\sim\\triangle HAC$', '∠C 공통', 'C'], AH2: ['AH', 'BH', 'CH', 'amber', '$\\triangle HBA\\sim\\triangle HAC$', '∠BAH=∠C 와 직각', 'H'] }[which];
    const geoFn = (g) => ({ val: g[which], nm: lab[0], p: lab[1], q: lab[2] });
    return mkRt({
      id, title, short, question,
      fixed: false,
      gen: (seed) => { const r = seeded('h2' + id + seed), b = ri(r, 2, 9), c = ri(r, 2, 9), t = ri(r, 1, 2), kind = ri(r, 0, 1); return { seed, b, c, t, kind }; },
      model: (s) => ({ ...rtGeo(clamp(Math.round(s.smRb), 2, 9), clamp(Math.round(s.smRc), 2, 9)) }),
      geo: (M) => M,
      pgeo: (pk) => (pk.kind === 0 ? rtGeo(pk.b, pk.c) : rtGeo(9 * pk.t, 16 * pk.t)),
      hi: (M, C) => ({ l: which === 'AB2' || which === 'AH2' ? C.review && C.step >= 1 : false, r: which === 'AC2' || which === 'AH2' ? C.review && C.step >= 1 : false, big: C.review && C.step >= 1 && which !== 'AH2', ah: which === 'AH2' ? 'amber' : null }),
      labels: (M, g, C) => (which === 'AH2' ? { BH: String(g.b), HC: String(g.c), cBH: 'sky', cHC: 'green' } : which === 'AB2' ? { BH: String(g.b), BC: String(g.BC), cBH: 'sky', cBC: 'amber' } : { HC: String(g.c), BC: String(g.BC), cHC: 'green', cBC: 'amber' }),
      plabels: (pk, g) => {
        if (pk.kind === 0) return which === 'AH2' ? { BH: String(g.b), HC: String(g.c) } : which === 'AB2' ? { BH: String(g.b), HC: String(g.c) } : { BH: String(g.b), HC: String(g.c) };
        // 정수 변 문제(9, 16 가족): 값이 닮음으로 이어져요
        if (which === 'AB2') return { AB: String(15 * pk.t), BC: String(25 * pk.t), BH: 'x' };
        if (which === 'AC2') return { AC: String(20 * pk.t), BC: String(25 * pk.t), HC: 'x' };
        return { AH: String(12 * pk.t), BH: String(9 * pk.t), HC: 'x' };
      },
      cap: (M, C, st) => (st >= 3 ? `${lab[0]}² = ${lab[1]} × ${lab[2]} = ${which === 'AH2' ? M.b : which === 'AB2' ? M.b : M.c} × ${which === 'AH2' ? M.c : M.BC} = ${M[which]}` : st >= 2 ? `${lab[0]} : ${lab[1]} = ${lab[2]} : ${lab[0]}` : st >= 1 ? `닮음: ${lab[4].replace(/\$|\\triangle /g, '△').replace(/\\sim/g, ' ∽ ')}` : ''),
      steps: (M) => [
        `${lab[4]}예요 (${lab[5]}, 직각). 닮음으로 대응하는 변의 비를 세워요.`,
        which === 'AB2' ? '대응변: $\\overline{AB}\\leftrightarrow\\overline{HB}$, $\\overline{BC}\\leftrightarrow\\overline{BA}$ → $\\overline{AB}:\\overline{HB}=\\overline{BC}:\\overline{BA}$' : which === 'AC2' ? '대응변: $\\overline{AC}\\leftrightarrow\\overline{HC}$, $\\overline{BC}\\leftrightarrow\\overline{AC}$ → $\\overline{AC}:\\overline{HC}=\\overline{BC}:\\overline{AC}$' : '대응변: $\\overline{BH}\\leftrightarrow\\overline{AH}$, $\\overline{AH}\\leftrightarrow\\overline{CH}$ → $\\overline{BH}:\\overline{AH}=\\overline{AH}:\\overline{CH}$',
        which === 'AB2' ? `내항의 곱 = 외항의 곱이므로 $\\overline{AB}^{2}=\\overline{BH}\\times\\overline{BC}=${M.b}\\times${M.BC}=${M.AB2}$ (단, $\\overline{BC}=${M.b}+${M.c}=${M.BC}$)` : which === 'AC2' ? `$\\overline{AC}^{2}=\\overline{CH}\\times\\overline{BC}=${M.c}\\times${M.BC}=${M.AC2}$` : `$\\overline{AH}^{2}=\\overline{BH}\\times\\overline{CH}=${M.b}\\times${M.c}=${M.AH2}$`
      ],
      view: (M) => ({
        guide: '<b>[심화]</b> <b>BH, CH</b> 막대로 삼각형을 바꿔 보세요. 닮은 두 직각삼각형의 <b>대응변의 비</b>에서 제곱의 값이 나와요. 이름을 외우지 말고 닮음으로 세워 보세요.',
        readouts: [rd('BH, CH', `${M.b}, ${M.c}`, 'sky'), rd(`${lab[0]}²`, `${M[which]}`, 'amber', `${lab[1]} × ${lab[2]}`)],
        formula: `<p>${lab[4]} → ${which === 'AB2' ? '$\\overline{AB}:\\overline{HB}=\\overline{BC}:\\overline{BA}$' : which === 'AC2' ? '$\\overline{AC}:\\overline{HC}=\\overline{BC}:\\overline{AC}$' : '$\\overline{BH}:\\overline{AH}=\\overline{AH}:\\overline{CH}$'}</p><p>$\\overline{${lab[0]}}^{2}=${M[which]}$</p>`,
        rule: '[심화] 닮은 두 직각삼각형에서 대응변의 비로 비례식을 세우면 한 변의 제곱을 구할 수 있다',
        notes: notes('비례식의 <b>내항 두 개가 같은 변</b>(제곱)이 돼요.', '대응하는 순서를 헷갈리지 않게 같은 표시의 각을 찾아요.')
      }),
      prob: (M) => {
        const pk = M.pk;
        if (pk.kind === 0) { const g = rtGeo(pk.b, pk.c), v = g[which]; return { tag: `[심화] ${lab[0]}²의 값`, key: `${which}0${pk.b}${pk.c}`, stem: `직각삼각형 ABC에서 점 A에서 빗변 BC에 내린 수선의 발을 H라 할 때, $\\overline{${lab[0]}}^{2}$의 값을 구하시오.`, choices: mkChoices(v, which === 'AH2' ? [[g.b + g.c, '두 길이의 합이에요. 곱을 구해야 해요.'], [g.b * g.BC, 'AB²의 값이에요.'], [g.c * g.BC, 'AC²의 값이에요.'], [2 * g.b * g.c, ''], [v + 1, '']] : which === 'AB2' ? [[g.b * g.c, 'AH²의 값이에요.'], [g.c * g.BC, 'AC²의 값이에요.'], [g.b * g.b, 'BH를 제곱했어요. BH × BC예요.'], [g.b + g.BC, ''], [v + 1, '']] : [[g.b * g.c, 'AH²의 값이에요.'], [g.b * g.BC, 'AB²의 값이에요.'], [g.c * g.c, 'CH를 제곱했어요. CH × BC예요.'], [g.c + g.BC, ''], [v + 1, '']], { pad: 1 }), note: '닮음으로 비례식을 세워 보세요' }; }
        const t = pk.t, ans = which === 'AB2' ? 9 * t : which === 'AC2' ? 16 * t : 16 * t;
        const given = which === 'AB2' ? [15 * t, 25 * t] : which === 'AC2' ? [20 * t, 25 * t] : [12 * t, 9 * t];
        const wr = which === 'AB2' ? [[25 * t - 9 * t, 'BC − BH가 아니라 닮음으로 구해요.'], [15 * t * 15 * t / (25 * t) + 1, ''], [12 * t, 'AH의 길이예요.']] : which === 'AC2' ? [[25 * t - 16 * t, 'BC − CH가 아니라 닮음으로 구해요.'], [9 * t, 'BH의 길이예요.'], [20 * t * 20 * t / (25 * t) + 1, '']] : [[9 * t, 'BH의 길이예요.'], [12 * t * 12 * t / (9 * t) + 1, ''], [25 * t - 9 * t + 1, '']];
        return { tag: `[심화] ${lab[0]}²을 이용한 길이`, key: `${which}1${t}`, stem: `직각삼각형 ABC에서 점 A에서 빗변 BC에 내린 수선의 발을 H라 할 때, $x$의 값을 구하시오. (단위: cm)`, choices: mkChoices(ans, wr.concat([[ans + t, ''], [ans - t, '']]), { pad: t }), note: `${lab[4].replace(/\$/g, '').replace(/\\triangle /g, '△').replace(/\\sim/g, ' ∽ ')}로 비례식을 세워요` };
      }
    });
  };
  const ab2 = mkSq('sm6-ab2', 'AB2', '[심화] AB²의 값 (△ABC ∽ △HBA)', '[심화] AB²', '직각삼각형 ABC에서 수선 AH를 그으면 △ABC와 △HBA는 닮음이야. 이 닮음으로 AB의 제곱을 구할 수 있을까?');
  const ac2 = mkSq('sm6-ac2', 'AC2', '[심화] AC²의 값 (△ABC ∽ △HAC)', '[심화] AC²', '△ABC와 △HAC도 닮음이야. 이 닮음으로 AC의 제곱을 구할 수 있을까?');
  const ah2 = mkSq('sm6-ah2', 'AH2', '[심화] AH²의 값 (△HBA ∽ △HAC)', '[심화] AH²', '두 작은 직각삼각형 △HBA와 △HAC도 닮음이야. 이 닮음으로 수선 AH의 제곱을 구할 수 있을까?');

  /* ====================================================================== 5. 두 가지 넓이 */
  const area = mkRt({
    id: 'sm6-area', title: '[심화] 직각삼각형의 넓이를 두 가지로', short: '[심화] 두 가지 넓이',
    question: '직각삼각형 ABC의 넓이는 직각을 낀 두 변으로도, 빗변과 높이 AH로도 구할 수 있어. 두 식을 같다고 놓으면 AH를 구할 수 있을까?',
    fixed: true,
    gen: (seed) => { const r = seeded('h5' + seed), t = ri(r, 1, 2), kind = ri(r, 0, 1); return { seed, t, kind }; },
    model: (s) => { const t = clamp(Math.round(s.smRt), 1, 2); return { ...rtGeo(9 * t, 16 * t), t, AB: 15 * t, AC: 20 * t, BCl: 25 * t, AH: 12 * t, S: 150 * t * t }; },
    geo: (M) => rtGeo(9 * M.t, 16 * M.t), pgeo: (pk) => rtGeo(9 * pk.t, 16 * pk.t),
    hi: (M, C) => ({ big: C.review && C.step >= 1, ah: C.review && C.step >= 2 ? 'amber' : null }),
    labels: (M, g, C) => ({ AB: String(M.AB), AC: String(M.AC), BC: String(M.BCl), AH: String(M.AH), cAB: 'sky', cAC: 'green', cBC: 'ink', cAH: 'amber' }),
    plabels: (pk, g) => (pk.kind === 0 ? { AB: String(15 * pk.t), AC: String(20 * pk.t), BC: String(25 * pk.t), AH: 'x', cAH: 'amber', cAB: 'sky', cAC: 'sky', cBC: 'sky' } : { AB: String(15 * pk.t), AC: String(20 * pk.t), AH: String(12 * pk.t), BC: 'x', cBC: 'amber', cAB: 'sky', cAC: 'sky', cAH: 'sky' }),
    cap: (M, C, st) => (st >= 3 ? `AB × AC = BC × AH → ${M.AB} × ${M.AC} = ${M.BCl} × AH → AH = ${M.AH}` : st >= 2 ? `넓이 = ${M.BCl} × AH ÷ 2` : st >= 1 ? `넓이 = ${M.AB} × ${M.AC} ÷ 2 = ${M.S}` : ''),
    steps: (M) => [
      `직각을 낀 두 변을 밑변과 높이로 보면 $\\triangle ABC=\\dfrac{1}{2}\\times\\overline{AB}\\times\\overline{AC}=\\dfrac{1}{2}\\times${M.AB}\\times${M.AC}=${M.S}$예요.`,
      `빗변 BC를 밑변으로, 수선 AH를 높이로 보면 $\\triangle ABC=\\dfrac{1}{2}\\times\\overline{BC}\\times\\overline{AH}=\\dfrac{1}{2}\\times${M.BCl}\\times\\overline{AH}$예요.`,
      `같은 삼각형의 넓이이므로 $\\overline{AB}\\times\\overline{AC}=\\overline{BC}\\times\\overline{AH}$ → $${M.AB}\\times${M.AC}=${M.BCl}\\times\\overline{AH}$이므로 $\\overline{AH}=${M.AH}$ (△ABC ∽ △HBA에서 $\\overline{AB}:\\overline{HB}=\\overline{BC}:\\overline{BA}$로도 같은 값이 나와요)`
    ],
    view: (M) => ({
      guide: '<b>[심화]</b> <b>삼각형의 크기</b>를 바꿔 보세요. 같은 삼각형의 넓이를 두 가지로 구한 식이 같아서 <b>AB × AC = BC × AH</b>예요.',
      readouts: [rd('AB × AC', `${M.AB * M.AC}`, 'sky', `${M.AB} × ${M.AC}`), rd('BC × AH', `${M.BCl * M.AH}`, 'amber', `${M.BCl} × ${M.AH}`), rd('넓이', `${M.S}`, 'green', '두 식이 같아요')],
      formula: `<p>$\\overline{AB}\\times\\overline{AC}=\\overline{BC}\\times\\overline{AH}$ → $${M.AB}\\times${M.AC}=${M.BCl}\\times${M.AH}$</p>`,
      rule: '[심화] 직각삼각형의 넓이를 두 가지로 나타내면 (직각을 낀 두 변의 곱) = (빗변) × (높이 AH)',
      notes: notes('넓이식에서 <b>2로 나누는 것</b>은 양쪽에 똑같이 있으니 지워도 돼요.', '이 값은 닮음비로도 구할 수 있어요: △ABC ∽ △HBA')
    }),
    prob: (M) => {
      const pk = M.pk, t = pk.t, ab = 15 * t, ac = 20 * t, bc = 25 * t, ah = 12 * t;
      if (pk.kind === 0) return { tag: '[심화] 빗변에 내린 높이', key: `a0${t}`, stem: '직각삼각형 ABC에서 점 A에서 빗변 BC에 내린 수선의 발을 H라 할 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(ah, [[ab * ac / 2 / bc, ''], [ab + ac - bc, '세 변으로는 AH를 바로 구할 수 없어요. 넓이를 두 가지로 나타내요.'], [ab * ac / (ab + ac), ''], [(ab * ac) / 10, ''], [ah + t, '']], { pad: t }) };
      return { tag: '[심화] 빗변의 길이', key: `a1${t}`, stem: '직각삼각형 ABC에서 점 A에서 빗변 BC에 내린 수선의 발을 H라 할 때, $x$의 값을 구하시오. (단위: cm)', choices: mkChoices(bc, [[ab + ac, '두 변의 합이에요.'], [ab * ac / 2, '삼각형의 넓이예요.'], [ab * ac / ah / 2, '넓이식에서 2를 한 번 더 나눴어요.'], [bc + t, ''], [bc - t, '']], { pad: t }) };
    }
  });

  G.geo = Object.assign(G.geo || {}, { rtGeo });
  G.register(60, 't6', '⑥ 직각삼각형의 수선', '직각삼각형의 수선', PARAMS, [trio, ab2, ac2, ah2, area]);
})();
