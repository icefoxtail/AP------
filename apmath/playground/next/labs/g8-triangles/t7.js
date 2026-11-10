/* ==========================================================================
   중2 · 삼각형의 성질 — 탭 ⑦ 「외심·내심」 (t7.js, order 70) — 장면 5개
   · m1 이등변삼각형의 O와 I   · ∠A 조절: ∠BOC=2∠A, ∠BIC=90°+½∠A, ∠OBI
   · m2 직각삼각형의 O와 I     · 외심=빗변의 중점 R=c÷2, 내접원 r=(a+b−c)÷2, 색칠한 부분의 넓이
   · m3 보기 판별              · 칩 ①~⑤를 누르면 그 성질이 그림에 나타나고, 참·거짓(반례)을 보여 줌
   · m4 정삼각형의 O와 I        · O=I, R=2r, 높이 AD=3r
   · m5 중점과 수선의 발        · 외심의 D·E·F(변의 중점)와 내심의 D·E·F(수선의 발)의 차이
   무게중심은 「도형의 닮음」 심화 탭에서 다룹니다. 각은 정수(도), 길이는 정수(cm)만 보입니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  const { DEG, clamp, pt, add, sub, mul, unit, mid, dist, polar, angBetween, pick, rint, T, rowT, tagOut, ang, tick, line, poly, fillPoly, fit, P, numProb, mkStmtChoices, mkTextChoices, degOpts, cmOpts, rd, notes, fmtN, dg, bboxOf, fs, dim, foot, circumcenter, incenter, triBC, solveCap } = G;
  const sin = (d) => Math.sin(d * DEG), cos = (d) => Math.cos(d * DEG);
  const S = (n) => `$\\overline{${n}}$`;
  const fr = (n, d) => `\\frac{${n}}{${d}}`;

  const RT2 = [[6, 8, 10, 2], [12, 16, 20, 4], [10, 24, 26, 4], [18, 24, 30, 6], [16, 30, 34, 6]]; // 빗변이 짝수인 정수 직각삼각형
  const PARAMS = {
    trMa: P('꼭지각 ∠A', 40, 88, 4, 52, { color: 'amber', format: (v) => v + '°' }),
    trMi: P('삼각형 고르기 (직각변, 직각변, 빗변)', 0, 4, 1, 0, { color: 'sky', format: (v) => { const t = RT2[clamp(Math.round(v), 0, 4)]; return `${t[0]}, ${t[1]}, ${t[2]} cm`; } }),
    trMx: P('∠A', 40, 130, 2, 70, { color: 'amber', format: (v) => v + '°' }),
    trMy: P('∠B', 20, 70, 2, 56, { color: 'green', format: (v) => v + '°' }),
    trMr: P('내접원의 반지름 r', 2, 6, 1, 3, { color: 'amber', format: (v) => v + ' cm' }),
    trMs: P('∠A', 40, 80, 2, 60, { color: 'sky', format: (v) => v + '°' }),
    trMt: P('∠B', 40, 80, 2, 70, { color: 'green', format: (v) => v + '°' })
  };
  const near = (x, y) => Math.abs(x - y) < 1e-6;
  // 두 가지 경우를 보기 좋게: 보기 5개(글) 만들기
  const txt = (items, key) => ({ choices: mkTextChoices(items, key), wide: true });

  /* ====================================================================== 1. 이등변삼각형의 O와 I */
  function isoOI(a) {
    const h = 1 / Math.tan((a * DEG) / 2), B = pt(-1, 0), Cc = pt(1, 0), A = pt(0, -h);
    return { A, B, C: Cc, O: circumcenter(A, B, Cc), I: incenter(A, B, Cc) };
  }
  /* -------------------------------------------------------------------- 풀이 흐름 (탐구 · 문제 · 풀이) — 이 장면의 문제와 같은 상태·같은 숫자로 풀이합니다.
     묻는 것(kind): obi=∠OBI · obc=∠OBC · diff=∠BOC와 ∠BIC의 차 · ibc=∠IBC(정삼각형일 때). 그림 단계(f): given → idea → base → in/oc → eq → ans → trap */
  const t7kind = (M, s) => (M.obi === 0 ? 'ibc' : ['obi', 'obc', 'diff'][(s.trV || 0) % 3]);
  const m1Solve = {
    steps: (M, s) => {
      const { a, b: bb, obc, ibc, obi, boc, bic } = M, kind = t7kind(M, s), out = [];
      const ask = { obi: '$\\angle OBI$', obc: '$\\angle OBC$', diff: '$\\angle BOC$와 $\\angle BIC$의 크기의 차', ibc: '$\\angle IBC$' }[kind];
      const bigOBC = obc >= ibc;
      out.push({ k: 'given', f: 'given', t: `$\\overline{AB}=\\overline{AC}$인 이등변삼각형 ABC의 외심 O, 내심 I이고 $\\angle A=${a}^{\\circ}$예요. 구하는 것은 ${ask} $x$.`, cap: `AB=AC, ∠A=${a}°, O 외심, I 내심` });
      const idea = {
        obi: '외심 O에서는 $\\angle BOC=2\\angle A$, 내심 I에서는 BI가 $\\angle B$의 이등분선이에요. 두 각 $\\angle OBC$, $\\angle IBC$를 구해 차를 구해요.',
        obc: '외심 O는 세 꼭짓점에서 같은 거리에 있어 △OBC가 이등변삼각형이고, $\\angle BOC=2\\angle A$예요.',
        diff: '외심 O에서는 $\\angle BOC=2\\angle A$, 내심 I에서는 $\\angle BIC=90^{\\circ}+\\frac{1}{2}\\angle A$예요. 두 값을 구해 차를 구해요.',
        ibc: '내심 I는 세 각의 이등분선의 교점이므로 BI는 $\\angle B$를 이등분해요.'
      }[kind];
      const ideaCap = { obi: '외심: ∠BOC=2∠A · 내심: BI는 ∠B의 이등분선', obc: '외심 → OB=OC, ∠BOC=2∠A', diff: '외심: ∠BOC=2∠A · 내심: ∠BIC=90°+\\frac{1}{2}∠A', ibc: '내심 → BI는 ∠B를 이등분' }[kind];
      out.push({ k: 'idea', f: 'idea', t: idea, cap: ideaCap });
      const base = { k: 'fig', f: 'base', lb: '각 구하기', t: `$\\overline{AB}=\\overline{AC}$이므로 $\\angle B=\\angle C=\\frac{180^{\\circ}-${a}^{\\circ}}{2}=${bb}^{\\circ}$.`, cap: `AB=AC → ∠B=∠C=\\frac{180°−${a}°}{2}=${bb}°` };
      const oc = { k: 'fig', f: 'oc', lb: '외심', t: kind === 'diff' ? `외심 O에서 $\\angle BOC=2\\angle A=2\\times${a}^{\\circ}=${boc}^{\\circ}$.` : `외심 O에서 $\\angle BOC=2\\angle A=${boc}^{\\circ}$이고 $\\overline{OB}=\\overline{OC}$예요.`, cap: kind === 'diff' ? `∠BOC=2∠A=${boc}°` : `∠BOC=2∠A=${boc}°, OB=OC` };
      const inn = { k: 'fig', f: 'in', lb: '내심', t: kind === 'diff' ? `내심 I에서 $\\angle IBC=\\angle ICB=\\frac{1}{2}\\times${bb}^{\\circ}=${ibc}^{\\circ}$이므로 $\\angle BIC=180^{\\circ}-2\\times${ibc}^{\\circ}=${bic}^{\\circ}$ ($=90^{\\circ}+\\frac{1}{2}\\angle A$).` : kind === 'ibc' ? `BI는 $\\angle B$의 이등분선이므로 $\\angle ABI=\\angle IBC$예요.` : `내심 I에서 BI는 $\\angle B$의 이등분선이므로 $\\angle IBC=\\frac{1}{2}\\angle B=\\frac{1}{2}\\times${bb}^{\\circ}=${ibc}^{\\circ}$.`, cap: kind === 'diff' ? `∠IBC=∠ICB=${ibc}° → ∠BIC=180−2×${ibc}=${bic}°` : kind === 'ibc' ? 'BI는 ∠B의 이등분선 → ∠ABI=∠IBC' : `BI는 ∠B의 이등분선 → ∠IBC=\\frac{1}{2}×${bb}°=${ibc}°` };
      if (kind === 'obi') {
        out.push(base, { ...oc, t: `외심 O에서 $\\angle BOC=2\\angle A=${boc}^{\\circ}$이고 △OBC는 $\\overline{OB}=\\overline{OC}$인 이등변삼각형이므로 $\\angle OBC=\\frac{180^{\\circ}-${boc}^{\\circ}}{2}=${obc}^{\\circ}$.`, cap: `∠BOC=2∠A=${boc}°, OB=OC → ∠OBC=\\frac{180°−${boc}°}{2}=${obc}°` }, inn);
        out.push({ k: 'eq', f: 'eq', t: `BO, BI는 모두 $\\angle B$ 안에 있으므로 $x=\\angle OBI=${bigOBC ? `\\angle OBC-\\angle IBC=${obc}^{\\circ}-${ibc}^{\\circ}` : `\\angle IBC-\\angle OBC=${ibc}^{\\circ}-${obc}^{\\circ}`}=${obi}^{\\circ}$.`, cap: `x=${bigOBC ? `∠OBC−∠IBC=${obc}°−${ibc}°` : `∠IBC−∠OBC=${ibc}°−${obc}°`}=${obi}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${obi}^{\\circ}$`, cap: `x = ${obi}°` });
        out.push({ k: 'trap', f: 'trap', t: `$\\angle BOC=2\\angle A=${boc}^{\\circ}$는 외심의 성질이고, 내심은 $\\angle BIC=90^{\\circ}+\\frac{1}{2}\\angle A=${bic}^{\\circ}$예요. 내심 I에 $2\\angle A$를 쓰면 $\\angle IBC=\\frac{180^{\\circ}-${boc}^{\\circ}}{2}=${obc}^{\\circ}$가 되어 외심의 $\\angle OBC$와 같아져 버려요.`, cap: `O는 2∠A=${boc}°, I는 90°+\\frac{1}{2}∠A=${bic}° — 서로 바꿔 쓰면 틀려요` });
      } else if (kind === 'obc') {
        out.push(oc, { k: 'eq', f: 'eq', t: `△OBC에서 $\\angle OBC=\\frac{180^{\\circ}-\\angle BOC}{2}=\\frac{180^{\\circ}-${boc}^{\\circ}}{2}=${obc}^{\\circ}$ ($=90^{\\circ}-\\angle A$).`, cap: `x=∠OBC=\\frac{180°−${boc}°}{2}=${obc}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${obc}^{\\circ}$`, cap: `x = ${obc}°` });
        out.push({ k: 'trap', f: 'trap', t: `$\\angle B=${bb}^{\\circ}$를 $\\angle OBC$로 착각하면 안 돼요. $\\angle B$는 BA와 BC 사이의 각이고, $\\angle OBC$는 BO와 BC 사이의 각이에요.`, cap: `∠B=${bb}°는 ∠OBC가 아니에요 → ∠OBC=${obc}°` });
      } else if (kind === 'diff') {
        out.push(base, inn, oc);
        out.push({ k: 'eq', f: 'eq', t: `$x=${boc >= bic ? `\\angle BOC-\\angle BIC=${boc}^{\\circ}-${bic}^{\\circ}` : `\\angle BIC-\\angle BOC=${bic}^{\\circ}-${boc}^{\\circ}`}=${Math.abs(boc - bic)}^{\\circ}$.`, cap: `x=${boc >= bic ? `∠BOC−∠BIC=${boc}°−${bic}°` : `∠BIC−∠BOC=${bic}°−${boc}°`}=${Math.abs(boc - bic)}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${Math.abs(boc - bic)}^{\\circ}$`, cap: `x = ${Math.abs(boc - bic)}°` });
        out.push({ k: 'trap', f: 'trap', t: `$\\angle BOC=2\\angle A=${boc}^{\\circ}$는 외심에서만, $\\angle BIC=90^{\\circ}+\\frac{1}{2}\\angle A=${bic}^{\\circ}$는 내심에서만 성립해요. 둘을 바꿔 쓰면 두 각이 같아져 차가 0이 돼요.`, cap: `O는 2∠A=${boc}°, I는 90°+\\frac{1}{2}∠A=${bic}° — 서로 바꿔 쓰면 틀려요` });
      } else {
        out.push(base, inn, { k: 'eq', f: 'eq', t: `$x=\\angle IBC=\\frac{1}{2}\\angle B=\\frac{1}{2}\\times${bb}^{\\circ}=${ibc}^{\\circ}$.`, cap: `x=∠IBC=\\frac{1}{2}×${bb}°=${ibc}°` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${ibc}^{\\circ}$`, cap: `x = ${ibc}°` });
        out.push({ k: 'trap', f: 'trap', t: `$\\angle B=${bb}^{\\circ}$를 그대로 $\\angle IBC$로 쓰면 안 돼요. BI는 $\\angle B$를 이등분하므로 $\\angle IBC$는 $\\angle B$의 절반이에요.`, cap: `∠B=${bb}°는 ∠IBC가 아니에요 → ∠IBC=${ibc}°` });
      }
      return out;
    },
    draw(b, s, M, C, ST, idx) {
      const { a, b: bb, obc, ibc, obi, boc, bic, g } = M, { A, B, C: Cc, O, I } = g, kind = t7kind(M, s), same = M.same;
      const cur = idx >= 0 ? ST[idx] : null, f = cur ? cur.f : 'problem', K = cur ? cur.k : 'problem';
      const seen = new Set(idx >= 0 ? ST.slice(0, idx + 1).map((x) => x.f) : []), at = (x) => f === x, has = (x) => seen.has(x);
      const narrowW = b.W < 560, mobileQuestion = narrowW && !b.thumb;
      // 문제의 기본 삼각형부터 충분히 보여 줍니다. 작은 무대에서 고정된
      // 여백/각 글자 거리가 A와 B의 조건을 O·I 쪽으로 밀어내지 않게 합니다.
      fit(b, bboxOf([A, B, Cc, O, I]), { t: mobileQuestion ? 28 : 50, b: mobileQuestion ? (idx < 0 ? 52 : 92) : idx < 0 ? 72 : narrowW ? 112 : 122, l: narrowW ? 40 : 54, r: narrowW ? 40 : 54 });
      const k = b.k || 60, lf = fs(b, 14), px = (n) => n / k, isProb = idx < 0, gv = at('given');
      const oUp = O.y <= I.y, close = !same && Math.abs(I.y - O.y) * k < 84; // O·I 가 가까우면 위쪽 점의 각 글자는 점 위에, 아래쪽 점의 각 글자는 점 아래에 둡니다
      const rotO = close && oUp ? 180 : 0, rotI = close && !oUp ? 180 : 0;
      const FD = G.faded, dBO = dist(B, O) * k, dBI = dist(B, I) * k, ldOBC = Math.min(126, Math.max(64, dBO * 0.55)), ldIBC = Math.min(90, Math.max(52, dBI * 0.5)), hO = -O.y * k, ldO = Math.max(26, Math.min(46, hO - 14)), hI = -I.y * k, ldBIC = Math.max(34, Math.min(60, hI - 16));
      // 원칙: 그림 안에는 점 이름과 값만. 지금 단계가 다루는 각·선만 색으로, 지난 단계는 가는 회색. 한 꼭짓점에는 색 호를 하나만.
      if (at('idea')) { if (kind !== 'ibc') fillPoly(b, [O, B, Cc], 'rose', 0.14); if (kind !== 'obc') fillPoly(b, [I, B, Cc], 'green', 0.14); }
      fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6); tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      if (gv) { line(b, A, B, 'sky', 4.6); line(b, A, Cc, 'sky', 4.6); }
      line(b, A, mid(B, Cc), 'ink', 2, { dash: [6, 5], alpha: 0.4 });
      // 대칭인 C쪽 선(OC, IC)은 문제·주어진 것에서만 진하게 그리고, 풀이에서는 B쪽만 씁니다(∠BOC·∠BIC 단계에서만 그 변이 필요)
      const strongBO = isProb || at('given') || at('idea') || at('oc') || (kind === 'obc' && at('eq')) || K === 'trap', strongBI = isProb || at('given') || at('idea') || at('in') || (kind === 'ibc' && at('eq')) || K === 'trap';
      const strongCO = isProb || gv || (kind === 'diff' && (at('oc') || K === 'trap')) || (kind !== 'diff' && K === 'trap' && kind === 'obi') || at('idea'), strongCI = isProb || gv || (kind === 'diff' && (at('in') || K === 'trap')) || (kind === 'obi' && K === 'trap') || at('idea');
      const thin = (p, q, col, strong, dash) => (strong ? line(b, p, q, col, 3, { dash }) : line(b, p, q, col, 1.8, { dash, alpha: 0.4 }));
      thin(B, O, 'rose', strongBO); thin(B, I, 'green', strongBI, [7, 5]);
      if (strongCO) line(b, Cc, O, 'rose', 3); else line(b, Cc, O, 'ink', 1.4, { alpha: 0.22 });
      if (strongCI) line(b, Cc, I, 'green', 3, { dash: [7, 5] }); else line(b, Cc, I, 'ink', 1.4, { alpha: 0.22, dash: [7, 5] });
      if (gv || at('oc')) { tick(b, O, B, 2, 'rose'); tick(b, O, Cc, 2, 'rose'); }
      // ∠A (주어진 값): 주어진 것에서 색, 이후에는 값만 남긴 회색
      if (mobileQuestion) {
        const ar = Math.min(30, .3 * Math.min(dist(A, O), dist(A, I)) * k), col = isProb || gv ? 'sky' : 'ink';
        ang(b, A, B, Cc, { color: col, r: ar, fa: gv ? .5 : isProb ? .2 : 0, alpha: isProb || gv ? 1 : .38 });
        T(b, A, dg(a), { dx: -56, dy: 26, size: 16, color: col, alpha: isProb || gv ? 1 : .38, leaderAnchor: pt(A.x, A.y + px(ar)), leader: true });
      } else if (isProb || gv) ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56, fa: gv ? 0.5 : 0.2 });
      else FD(b, A, B, Cc, { r: 34, label: dg(a), size: 15, labelDist: 56 });
      // ∠B=∠C (이등변): B쪽 한 곳만, 값은 꼭짓점 바깥에
      if (has('base') && K !== 'trap') {
        if (at('base')) { ang(b, B, Cc, A, { color: 'sky', r: 30, fa: 0.42 }); T(b, B, dg(bb), { dx: -38, dy: -12, size: lf, color: 'sky' }); }
        else FD(b, B, Cc, A, { r: 30 });
      }
      // 외심: ∠BOC=2∠A (O), 필요하면 ∠OBC (B)
      if (has('oc') && K !== 'trap') {
        const now = at('oc'), showB = kind === 'obi';
        if (now) ang(b, O, B, Cc, { color: 'rose', r: close && oUp ? 22 : 24, label: dg(boc), size: lf, labelDist: rotO ? 40 : ldO, labelRot: rotO, fa: 0.4 }); else FD(b, O, B, Cc, { r: 24 });
        if (showB) { if (now) ang(b, B, Cc, O, { color: 'rose', r: 26, label: dg(obc), size: lf, labelDist: ldOBC, fa: 0.4 }); else FD(b, B, Cc, O, { r: 26 }); }
      }
      if (kind === 'obc' && has('eq') && K !== 'trap' && !isProb && !at('eq') && !at('ans')) FD(b, B, Cc, O, { r: 26 });
      // 내심: ∠IBC (B), diff 이면 ∠BIC (I)
      if (has('in') && K !== 'trap') {
        const now = at('in');
        if (now) ang(b, B, Cc, I, { color: 'green', r: 38, label: kind === 'ibc' ? '' : dg(ibc), size: lf, labelDist: ldIBC, fa: 0.4 }); else if (kind !== 'ibc') FD(b, B, Cc, I, { r: 38 });
        if (kind === 'diff') { if (now) ang(b, I, B, Cc, { color: 'green', r: close && !oUp ? 22 : 30, label: dg(bic), size: lf, labelDist: rotI ? 40 : Math.min(56, ldBIC), labelRot: rotI, fa: 0.4 }); else FD(b, I, B, Cc, { r: 30 }); }
      }
      // 구하는 각 x: 주어진 것·식·답에서만 호를 그리고, 다른 단계에서는 글자 x만(한 꼭짓점에 색 호는 하나)
      const xv = kind === 'obi' ? obi : kind === 'obc' ? obc : kind === 'diff' ? Math.abs(boc - bic) : ibc;
      const xArc = isProb || gv || at('eq') || at('ans'), narrowX = xv < 15, xl = at('ans') && !narrowX ? `x=${xv}°` : 'x', xs = 18;
      const dirX = (th, d, lbl) => T(b, B, lbl, { dx: Math.cos(th) * d, dy: Math.sin(th) * d, size: xs, color: 'amber' });
      if (mobileQuestion && (isProb || gv) && kind !== 'diff') {
        const ends = kind === 'obi' ? [O, I] : kind === 'obc' ? [O, Cc] : [I, Cc];
        const xr = Math.min(42, .36 * Math.min(dist(B, O), dist(B, I)) * k);
        const marker = ang(b, B, ends[0], ends[1], { color: 'amber', r: xr, fa: .3 });
        const anchor = pt(B.x + px(xr) * Math.cos(marker.mid), B.y + px(xr) * Math.sin(marker.mid));
        T(b, B, xl, { dx: -32, dy: -24, size: xs, color: 'amber', leaderAnchor: anchor, leader: true });
      } else if (kind === 'ibc') { if (xArc && !(at('eq') && false)) ang(b, B, I, Cc, { color: 'amber', r: 38, label: xl, size: xs, labelDist: 60, fa: 0.3 }); else dirX(-ibc / 2 * DEG, 60, xl); }
      else if (kind === 'obi') {
        // ∠OBI 는 작은 각이라 글자 x 를 선 밖으로 빼고 짧은 선으로 이어요(값은 그림 아래 한 줄에)
        const th = -(obc + ibc) / 2 * DEG, from = pt(B.x + px(66) * Math.cos(th), B.y + px(66) * Math.sin(th)), to = pt(from.x + px(2), B.y + px(7)); // x 는 B의 각이므로 O에서 먼 변 BC 아래에 둡니다
        if (xArc) ang(b, B, O, I, { color: 'amber', r: 52, fa: 0.4 });
        if (K !== 'trap') { line(b, from, to, 'amber', 1.8); T(b, to, xl, { dx: 2, dy: 13, size: xs, color: 'amber' }); }
      } else if (kind === 'obc') { if (xArc) ang(b, B, O, Cc, { color: 'amber', r: 34, label: xl, size: xs, labelDist: 52, fa: 0.3 }); else dirX(-obc / 2 * DEG, 52, xl); }
      // 흔한 실수 그림
      if (K === 'trap') {
        if (kind === 'obc' || kind === 'ibc') ang(b, B, Cc, A, { color: 'rose', r: 46, label: `∠B=${bb}°`, size: lf, labelDist: 74, fa: 0.3 });
        else {
          ang(b, O, B, Cc, { color: 'rose', r: close && oUp ? 22 : 24, label: `2∠A=${boc}°`, size: lf, labelDist: rotO ? 40 : ldO, labelRot: rotO, fa: 0.3 });
          ang(b, I, B, Cc, { color: 'green', r: close && !oUp ? 22 : 30, label: `90°+\\frac{1}{2}∠A=${bic}°`, size: lf, labelDist: rotI ? 40 : ldBIC, labelRot: rotI, fa: 0.3 });
        }
      }
      // 점과 이름(점 이름만 그림 안에)
      b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      if (same) T(b, O, 'O=I', { dx: 24, dy: 0, size: 16, color: 'rose' }); else if (mobileQuestion) {
        T(b, O, 'O', { dx: -26, dy: -8, size: 17, color: 'rose', leaderAnchor: O, leader: true });
        T(b, I, 'I', { dx: 26, dy: 8, size: 17, color: 'green', leaderAnchor: I, leader: true });
      } else {
        const tight = close && Math.abs(I.y - O.y) * k < 34;
        T(b, O, 'O', { dx: 16, dy: tight && !oUp ? -2 : -14, size: 17, color: 'rose' }); T(b, I, 'I', { dx: 16, dy: tight && oUp ? -2 : -14, size: 17, color: 'green' });
      }
      tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      // 그림 아래: 단계 설명 한 줄, 그 아래에 점 이름의 뜻
      const capSz = 15, plainCap = cur ? String(cur.cap).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2') : '', two = cur && G.textW(plainCap, fs(b, capSz)) * 1.1 > Math.max(180, b.W - 28);
      if (cur) solveCap(b, pt(0, 0), cur, { dy: 46, size: capSz });
      T(b, pt(0, 0), same ? 'O=I: 외심이자 내심' : 'O: 외심 · I: 내심', { dy: cur ? (two ? 78 : 74) : mobileQuestion ? 32 : 46, size: fs(b, 14), color: 'ink', alpha: 0.8 });
    }
  };
  const m1 = {
    id: 't7-1', title: '이등변삼각형의 외심 O와 내심 I', short: '이등변삼각형의 O와 I', solve: m1Solve,
    question: '이등변삼각형 ABC의 외심 O와 내심 I는 모두 대칭축 위에 있어요. ∠OBI는 얼마일까?',
    ctl: ['trMa'],
    init: (s) => { s.trMa = 52; s.trV = 0; },
    reroll: (s) => { s.trMa = pick([40, 44, 48, 52, 56, 64, 68, 72, 76, 80], s.trMa); s.trV = (s.trV + 1) % 3; },
    model: (s) => {
      const a = clamp(Math.round(s.trMa / 4) * 4, 40, 88), bb = (180 - a) / 2, obc = 90 - a, ibc = bb / 2, obi = Math.abs(obc - ibc), g = isoOI(a);
      return { a, b: bb, obc, ibc, obi, same: obi === 0, boc: 2 * a, bic: 90 + a / 2, g };
    },
    draw(b, s, M, C) {
      const { a, b: bb, obc, ibc, obi, same, boc, bic, g } = M, { A, B, C: Cc, O, I } = g, st = C.step, v = same ? 2 : (s.trV || 0) % 3;
      fit(b, bboxOf([A, B, Cc, O, I]), { t: 44, b: C.problem ? 50 : 92, l: 54, r: 54 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6); tick(b, A, B, 1, 'amber'); tick(b, A, Cc, 1, 'amber');
      line(b, B, O, 'rose', 3); line(b, Cc, O, 'rose', 3); line(b, A, mid(B, Cc), 'ink', 2, { dash: [6, 5], alpha: 0.5 });
      line(b, B, I, 'green', 3, { dash: [7, 5] }); line(b, Cc, I, 'green', 3, { dash: [7, 5] });
      if (C.problem) {
        ang(b, A, B, Cc, { color: 'sky', r: 34, label: dg(a), size: 16, labelDist: 56 });
        if (same) ang(b, B, I, Cc, { color: 'amber', r: 38, label: 'x', size: 17, labelDist: 56 });
        else if ((s.trV || 0) % 3 === 0) ang(b, B, O, I, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 52 });
        else if ((s.trV || 0) % 3 === 1) ang(b, B, O, Cc, { color: 'amber', r: 34, label: 'x', size: 17, labelDist: 52 });
        else { ang(b, O, B, Cc, { color: 'rose', r: 24, label: '∠BOC', size: 13, labelDist: 46 }); ang(b, I, B, Cc, { color: 'green', r: 40, label: '∠BIC', size: 13, labelDist: 62 }); T(b, pt(0, 0), 'x = ∠BOC와 ∠BIC의 차', { dy: 32, size: fs(b, 16), color: 'amber' }); }
      } else {
        const lf = fs(b, 14);
        if (show(2)) { ang(b, B, Cc, O, { color: 'rose', r: 26, label: dg(obc), size: lf, labelDist: 118 }); ang(b, Cc, B, O, { color: 'rose', r: 26, rings: 2 }); }
        if (show(2)) ang(b, B, Cc, I, { color: 'green', r: 38, label: dg(ibc), size: lf, labelDist: 86 });
        if (show(3) && !same) ang(b, B, I, O, { color: 'amber', r: 52, label: dg(obi), size: lf, labelDist: 70 });
        ang(b, A, B, Cc, { color: 'sky', r: 30, label: dg(a), size: lf, labelDist: 50 });
      }
      b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      if (same) T(b, O, 'O = I', { dx: 24, dy: 0, size: 16, color: 'rose' });
      else if (!C.thumb && Math.abs(I.y - O.y) * (b.k || 60) < 44) {
        // 가까운 두 중심은 이름을 서로 바깥쪽에 두고 실제 점에 연결합니다.
        // 고정 O 아래/I 위 배치는 O가 위쪽일 때 두 이름의 위치를 뒤바꿨습니다.
        const oUp = O.y < I.y;
        T(b, O, 'O', { dx: 16, dy: oUp ? -14 : 14, size: 17, color: 'rose', leaderAnchor: O, leader: true });
        T(b, I, 'I', { dx: 16, dy: oUp ? 14 : -14, size: 17, color: 'green', leaderAnchor: I, leader: true });
      } else { T(b, O, 'O', { dx: 14, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: 14, dy: -12, size: 17, color: 'green' }); }
      tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `AB=AC, ∠A=${a}° → ∠B=∠C=${bb}°`;
        else if (C.review && st === 2) { row = `∠OBC=90°−∠A=${obc}°, ∠IBC=\\frac{1}{2}∠B=${ibc}°`; col = 'green'; }
        else if (C.review && st === 3) { row = same ? '∠OBC=∠IBC → 정삼각형: O와 I가 같은 점' : `∠OBI=|${obc}°−${ibc}°|=${obi}°`; col = 'amber'; }
        else row = same ? '정삼각형: O와 I가 같은 점이에요' : `∠OBI=${obi}°  (∠BOC=${boc}°, ∠BIC=${bic}°)`;
        rowT(b, pt(0, 0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `AB=AC이므로 $\\angle B=\\angle C=${fr('180^{\\circ}-\\angle A', 2)}=${M.b}^{\\circ}$예요. 외심 O와 내심 I는 모두 꼭지각의 이등분선 위에 있어요.`,
      `외심: $\\angle BOC=2\\angle A=${M.boc}^{\\circ}$이고 △OBC가 이등변삼각형이므로 $\\angle OBC=${fr(`180^{\\circ}-${M.boc}^{\\circ}`, 2)}=90^{\\circ}-\\angle A=${M.obc}^{\\circ}$. 내심: $\\angle IBC=${fr('1', 2)}\\angle B=${M.ibc}^{\\circ}$.`,
      M.same ? `$\\angle OBC=\\angle IBC$이므로 O와 I가 같은 점이에요 (정삼각형).` : `$\\angle OBI=|\\angle OBC-\\angle IBC|=|${M.obc}^{\\circ}-${M.ibc}^{\\circ}|=${M.obi}^{\\circ}$예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>꼭지각 ∠A</b>를 바꿔 보세요. 외심 O는 <b>∠BOC=2∠A</b>를, 내심 I는 <b>∠BIC=90°+½∠A</b>를 만족해요. ∠A=60°(정삼각형)일 때 O와 I가 같은 점이 돼요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠B = ∠C', `${M.b}°`, 'sky'), rd('∠OBC · ∠IBC', `${M.obc}° · ${M.ibc}°`, 'rose'), rd('∠BOC · ∠BIC', `${M.boc}° · ${M.bic}°`, 'green'), rd('∠OBI', `${M.obi}°`, 'amber', '|∠OBC − ∠IBC|', null, true)],
      formula: `<p>$\\angle OBC=90^{\\circ}-\\angle A=${M.obc}^{\\circ}$, $\\angle IBC=${fr('1', 2)}\\angle B=${M.ibc}^{\\circ}$</p><p>$\\angle OBI=|${M.obc}^{\\circ}-${M.ibc}^{\\circ}|=${M.obi}^{\\circ}$</p>`,
      rule: '외심: ∠BOC=2∠A (△OBC는 이등변삼각형), 내심: ∠BIC=90°+½∠A, ∠IBC=½∠B. 두 각의 차로 ∠OBI를 구한다.',
      notes: notes('외심의 각은 <b>이등변삼각형 OBC</b>의 밑각(90°−∠A)이에요. 내심의 각은 ∠B를 <b>이등분</b>한 각이에요.', '∠OBI는 두 각 중 큰 값에서 작은 값을 빼요. 어느 것이 큰지 그림에서 확인해요.')
    }),
    prob: (M, s) => {
      const { a, obc, ibc, obi, boc, bic } = M, v = (s.trV || 0) % 3, key = `${v}:${a}`;
      const head = `그림에서 점 O, I는 ${S('AB')}=${S('AC')}인 이등변삼각형 ABC의 외심, 내심이다.`;
      if (obi === 0) return numProb({ tag: '외심과 내심 · ∠IBC', key: `0:${a}`, stem: `${head} ∠A=${a}°일 때, ∠IBC의 크기 $x$는?`, correct: ibc, wrongs: [[a, '∠A 그대로예요.'], [(180 - a) / 2, '∠B예요. ∠IBC는 ∠B의 반이에요.'], [90 - a, '∠OBC예요.'], [ibc + 10, '다시 계산해 보세요.'], [ibc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== ibc && q[0] > 0), ...degOpts(5) });
      if (v === 0) return numProb({ tag: '외심과 내심 · ∠OBI', key, stem: `${head} ∠A=${a}°일 때, ∠OBI의 크기 $x$는?`, correct: obi, wrongs: [[obc, '∠OBC예요. ∠OBI는 ∠OBC와 ∠IBC의 차예요.'], [ibc, '∠IBC예요.'], [obc + ibc, '차가 아니라 합을 구했어요.'], [obi + 5, '다시 계산해 보세요.'], [obi + 10, '다시 계산해 보세요.']].filter((q) => q[0] !== obi && q[0] > 0), ...degOpts(5) });
      if (v === 1) return numProb({ tag: '외심과 내심 · ∠OBC', key, stem: `${head} ∠A=${a}°일 때, ∠OBC의 크기 $x$는?`, correct: obc, wrongs: [[boc, '∠BOC예요. △OBC는 이등변삼각형이에요.'], [(180 - a) / 2, '∠B예요.'], [ibc, '∠IBC예요.'], [obc + 10, '다시 계산해 보세요.'], [obc - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== obc && q[0] > 0), ...degOpts(5) });
      return numProb({ tag: '[함정] 외심과 내심 · 같은 꼭지각', key, stem: `${head} ∠A=${a}°일 때, ∠BOC와 ∠BIC의 크기의 차 $x$는?`, correct: Math.abs(boc - bic), wrongs: [[boc, '∠BOC 그대로예요.'], [bic, '∠BIC 그대로예요.'], [boc + bic, '차가 아니라 합이에요.'], [Math.abs(boc - bic) + 10, '다시 계산해 보세요.'], [Math.abs(boc - bic) - 10, '다시 계산해 보세요.']].filter((q) => q[0] !== Math.abs(boc - bic) && q[0] > 0), ...degOpts(5), valid: (v2) => Number.isInteger(v2) && v2 > 0 && v2 < 360 });
    },
    verify: (s) => { const M = m1.model(s), g = M.g; return { ans: angBetween(g.B, g.C, g.O), model: M.obc, extra: [[angBetween(g.B, g.C, g.I), M.ibc], [angBetween(g.O, g.B, g.C), angBetween(g.O, g.C, g.B)]] }; }
  };

  /* -------------------------------------------------------------------- 풀이 흐름: 장면별 풀이 (t7-2 ~ t7-5, 문제와 같은 상태·같은 숫자)
     원칙: 그림 안에는 점 이름만 · 지금 단계만 색(앞 단계는 회색) · 좁은 각은 x 만 두고 값은 그림 아래 한 줄에 */
  const SVB = G.svB, { stmtDyn, xLbl } = SVB; void xLbl;

  /* ---------------------------------------------------------------- 2. 직각삼각형의 O와 I */
  const m2Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 2, { a, b: bb, c, r, R, tri, circ } = M, out = [];
      out.push({ k: 'given', f: 'given', t: v === 0 ? `∠C=90°이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, $\\overline{AB}=${c}$ cm인 직각삼각형 ABC의 외심이 O, 내심이 I예요. 외접원에서 △ABC를 제외한 색칠한 부분의 넓이 $x$를 구해요.` : `∠C=90°이고 $\\overline{BC}=${a}$ cm, $\\overline{CA}=${bb}$ cm, $\\overline{AB}=${c}$ cm인 직각삼각형 ABC의 외심이 O, 내심이 I예요. 외접원의 반지름 R과 내접원의 반지름 r의 합 $x=R+r$을 구해요.`, cap: v === 0 ? `∠C=90°, BC=${a}, CA=${bb}, AB=${c} (cm), 색칠한 부분=x` : `∠C=90°, BC=${a}, CA=${bb}, AB=${c} (cm), R+r=x` });
      out.push({ k: 'idea', f: 'idea', t: v === 0 ? '색칠한 부분은 (외접원의 넓이) − (삼각형의 넓이)예요. 직각삼각형의 외심은 빗변의 중점이라서, 외접원의 반지름 R은 빗변의 반이에요. 그러면 원의 넓이를 쉽게 구할 수 있어요.' : '직각삼각형은 R과 r을 따로 구하는 쉬운 길이 있어요. 외심은 빗변의 중점이라 R은 빗변의 반이고, 직각 꼭짓점 쪽의 정사각형을 이용하면 r은 (두 변의 합 − 빗변)의 반이에요.', cap: v === 0 ? '색칠한 부분 = 외접원의 넓이 − 삼각형의 넓이' : 'R=빗변의 반, r=(두 변의 합−빗변)÷2' });
      out.push({ k: 'fig', f: 'R', lb: '외접원의 반지름', t: `∠C=90°이므로 외심 O는 빗변 AB의 중점이에요. $R=\\overline{OA}=\\overline{OB}=\\overline{OC}=\\frac{\\overline{AB}}{2}=\\frac{${c}}{2}=${R}$ (cm).`, cap: `R=\\frac{AB}{2}=\\frac{${c}}{2}=${R} cm` });
      if (v === 0) {
        out.push({ k: 'fig', f: 'circ', lb: '외접원의 넓이', t: `외접원의 넓이는 $\\pi R^2=\\pi\\times${R}^2=${circ}\\pi$ (cm²).`, cap: `외접원의 넓이=π×${R}²=${circ}π cm²` });
        out.push({ k: 'fig', f: 'tri', lb: '삼각형의 넓이', t: `직각삼각형이라 두 직각변이 밑변과 높이예요: $\\frac{1}{2}\\times${a}\\times${bb}=${tri}$ (cm²).`, cap: `△ABC=\\frac{1}{2}×${a}×${bb}=${tri} cm²` });
        out.push({ k: 'eq', f: 'eq', t: `$x=${circ}\\pi-${tri}$ (cm²)`, cap: `x=${circ}π−${tri} (cm²)` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${circ}\\pi-${tri}\\text{ cm}^2$`, cap: `x = ${circ}π−${tri} cm²` });
      } else {
        out.push({ k: 'fig', f: 'r', lb: '내접원의 반지름', t: `직각 꼭짓점 C 쪽에서 $\\overline{CD}=\\overline{CE}=r$이고 $\\overline{BD}=\\overline{BF}=${a}-r$, $\\overline{AE}=\\overline{AF}=${bb}-r$이므로 $\\overline{AB}=(${a}-r)+(${bb}-r)=${c}$. 그래서 $r=\\frac{${a}+${bb}-${c}}{2}=${r}$ (cm).`, cap: `r=\\frac{${a}+${bb}−${c}}{2}=${r} cm` });
        out.push({ k: 'eq', f: 'eq', t: `$x=R+r=${R}+${r}=${R + r}$ (cm)`, cap: `x=R+r=${R}+${r}=${R + r} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${R + r}\\text{ cm}$`, cap: `x = ${R + r} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: (M) => ({ x0: M.g.O.x - M.R, x1: M.g.O.x + M.R, y0: M.g.O.y - M.R, y1: M.g.O.y + M.R }),
      base: (b, M, s, X) => { const { A, B, C: Cc, O, I } = M.g, sh = (s.trV || 0) % 2 === 0; b.circle(O, M.R, { color: 'amber', width: 2.2, alpha: 0.6, dash: [6, 5], fill: sh ? 'amber' : undefined, fillAlpha: X.xArc ? 0.24 : X.at('circ') ? 0.3 : 0.1 }); fillPoly(b, [A, B, Cc], 'sky', X.at('tri') ? 0.5 : 0.35); poly(b, [A, B, Cc], 'ink', 3.4); b.circle(I, M.r, { color: 'green', width: 2.2, alpha: 0.7 }); },
      legend: (M, s) => `O: 외심 · I: 내심 · x: ${(s.trV || 0) % 2 === 0 ? '색칠한 부분의 넓이' : 'R+r'}`,
      st: {
        given: (L, M, s, X) => {
          const { A, B, C: Cc, O, I } = M.g, q = fs(X.b, 15), v = (s.trV || 0) % 2;
          L.ang(Cc, A, B, { color: 'sky', r: 26 }); L.ln(O, Cc, 'rose', 3); L.tk(A, O, 1, 'amber'); L.tk(O, B, 1, 'amber');
          L.sd(Cc, B, pt(I.x, -50), `${M.a} cm`, { color: 'sky', size: q, gap: 8, keep: true }); L.sd(Cc, A, pt(80, I.y), `${M.b} cm`, { color: 'sky', size: q, gap: 8, keep: true }); L.sd(A, B, I, `${M.c} cm`, { color: 'sky', size: q, gap: 8, keep: true });
        },
        R: (L, M, s, X) => { const { A, B, C: Cc, O } = M.g; [[A, O], [O, B], [O, Cc]].forEach(([p, q]) => { L.ln(p, q, 'rose', 4.6); L.tk(p, q, 2, 'rose'); }); L.circ(O, M.R, 'rose', 3); L.sd(A, O, M.g.I, `R=${M.R}`, { color: 'rose', size: fs(X.b, 15), gap: 10 }); },
        circ: (L, M) => { L.circ(M.g.O, M.R, 'amber', 3.4); },
        tri: (L, M) => { const { A, B, C: Cc } = M.g; L.fl([A, B, Cc], 'sky', 0.4); },
        r: (L, M, s, X) => { const { A, B, C: Cc, I } = M.g, D = pt(I.x, 0), E = pt(0, I.y); L.fl([Cc, D, I, E], 'green', 0.25); L.ln(I, D, 'green', 3.4); L.ln(I, E, 'green', 3.4); L.circ(I, M.r, 'green', 3.2); L.sd(I, D, pt(I.x + 50, I.y), 'r', { color: 'green', size: fs(X.b, 15), gap: 6 }); }
      },
      x: (b, M, s, X) => {
        const { A, B, C: Cc, O, I } = M.g, v = (s.trV || 0) % 2, u = G.unit(G.sub(O, Cc));
        const pos = G.add(O, G.mul(u, M.R * 0.5));
        if (v === 0) {
          T(b, pos, X.xVal ? `${M.circ}π−${M.tri}` : 'x', { size: fs(b, X.xVal ? 14 : 18), color: 'amber' });
        } else T(b, pos, X.xVal ? `${M.R + M.r} cm` : 'x', { size: fs(b, X.xVal ? 16 : 18), color: 'amber' });
      },
      top: (b, M) => { const { A, B, C: Cc, O, I } = M.g; b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); T(b, O, 'O', { dx: 12, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -10, dy: -12, size: 17, color: 'green' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 }); }
    })
  };

  /* ---------------------------------------------------------------- 3. 보기 판별 (문장이 참인지 그림으로 확인) */
  const HA = '\\frac{1}{2}\\angle A';
  const T7POOL = [
    { h: '점 O에서 세 꼭짓점 A, B, C까지의 거리가 같다.', f: () => true, w: () => '외심 O는 세 변의 수직이등분선의 교점이고, 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있어요.', c: () => 'OA=OB=OC (외접원의 반지름)', d: (L, M) => { const { O, A, B, C: Cc } = M.pg; [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 3.6); L.tk(O, z, 2, 'rose'); }); } },
    { h: '점 I에서 세 변까지의 거리가 같다.', f: () => true, w: () => '내심 I는 각의 이등분선 위의 점이고, 각의 이등분선 위의 점은 그 각의 두 변에서 같은 거리에 있어요. 세 각 모두 그래서 세 변까지의 거리가 같아요.', c: () => 'ID=IE=IF (내접원의 반지름)', d: (L, M) => { const { I, D, E, F } = M.pg; [D, E, F].forEach((z) => { L.ln(I, z, 'green', 3.6); L.tk(I, z, 1, 'green'); }); L.circ(I, dist(I, D), 'green', 2.6); } },
    { h: '점 I는 삼각형 ABC의 내부에 있다.', f: () => true, w: () => '세 내각의 이등분선은 삼각형 안에서 만나기 때문에 내심은 늘 삼각형의 안쪽에 있어요.', c: () => '내심 I는 늘 삼각형의 안쪽', d: (L, M) => { const { A, B, C: Cc, I } = M.pg; L.fl([A, B, Cc], 'green', 0.2); [A, B, Cc].forEach((z) => L.ln(z, I, 'green', 3, { dash: [7, 5] })); } },
    { h: '점 O는 세 변의 수직이등분선의 교점이다.', f: () => true, w: () => '외심의 뜻이 바로 이거예요. 세 변의 수직이등분선은 한 점 O에서 만나요.', c: () => '세 변의 수직이등분선 → 한 점 O', d: (L, M) => { const { A, B, C: Cc, O } = M.pg; [[A, B], [B, Cc], [Cc, A]].forEach(([p, q]) => { const m = mid(p, q); L.ln(m, O, 'rose', 3, { dash: [7, 5] }); L.tk(p, m, 1, 'amber'); L.tk(m, q, 1, 'amber'); L.ang(m, O, q, { color: 'rose', r: 14 }); }); } },
    { h: '점 I는 세 내각의 이등분선의 교점이다.', f: () => true, w: () => '내심의 뜻이 바로 이거예요. 세 내각의 이등분선은 한 점 I에서 만나요.', c: () => '세 내각의 이등분선 → 한 점 I', d: (L, M) => { const { A, B, C: Cc, I } = M.pg; [A, B, Cc].forEach((z) => L.ln(z, I, 'green', 3.4, { dash: [7, 5] })); L.ang(A, B, I, { color: 'sky', r: 28, fa: 0.4 }); L.ang(A, I, Cc, { color: 'sky', r: 28, fa: 0.4 }); L.ang(B, A, I, { color: 'green', r: 28, rings: 2, fa: 0.4 }); L.ang(B, I, Cc, { color: 'green', r: 28, rings: 2, fa: 0.4 }); L.ang(Cc, B, I, { color: 'violet', r: 28, rings: 3, fa: 0.4 }); L.ang(Cc, I, A, { color: 'violet', r: 28, rings: 3, fa: 0.4 }); } },
    { h: `$\\angle BIC=90^{\\circ}+${HA}$`, f: () => true, w: (M) => `△IBC에서 ∠IBC+∠ICB=½(∠B+∠C)=90°−½∠A이므로 ∠BIC=180°−(90°−½∠A)=90°+½∠A예요. 이 삼각형은 ∠A=${M.pa}°이고 ∠BIC=${90 + M.pa / 2}°예요.`, c: (M) => `∠A=${M.pa}° → ∠BIC=90°+\\frac{1}{2}×${M.pa}°=${90 + M.pa / 2}°`, d: (L, M) => { const { A, B, C: Cc, I } = M.pg; L.ang(A, B, Cc, { color: 'sky', r: 26, label: dg(M.pa), size: 14, labelDist: 46, fa: 0.4 }); L.ang(I, B, Cc, { color: 'green', r: 26, label: dg(90 + M.pa / 2), size: 14, labelDist: 46, fa: 0.4 }); } },
    { h: '$\\overline{IA}=\\overline{IB}=\\overline{IC}$', f: (m) => near(dist(m.pg.I, m.pg.A), dist(m.pg.I, m.pg.B)) && near(dist(m.pg.I, m.pg.B), dist(m.pg.I, m.pg.C)), w: () => '내심에서 같은 거리인 것은 세 변까지의 거리예요. 꼭짓점까지의 거리 IA, IB, IC는 서로 달라요 (정삼각형일 때만 같아요).', c: () => 'IA, IB, IC의 길이가 서로 달라요 (반례)', d: (L, M) => { const { A, B, C: Cc, I } = M.pg; [A, B, Cc].forEach((z, i) => { L.ln(I, z, 'rose', 4); L.tk(I, z, i + 1, 'rose'); }); } },
    { h: '점 O는 삼각형 ABC의 내부에 있다.', f: (m) => m.pg.oIn, w: (M) => { const g = M.pg, big = Math.max(g.a, g.b, g.c), nm = g.a === big ? 'A' : g.b === big ? 'B' : 'C'; return `∠${nm}=${big}°가 둔각이라서 외심 O가 삼각형의 바깥에 있어요 (반례). 외심은 예각삼각형일 때만 안에 있고, 직각삼각형이면 빗변 위, 둔각삼각형이면 바깥이에요.`; }, c: (M) => { const g = M.pg, big = Math.max(g.a, g.b, g.c), nm = g.a === big ? 'A' : g.b === big ? 'B' : 'C'; return `∠${nm}=${big}° 둔각 → O는 삼각형 바깥 (반례)`; }, d: (L, M) => { const { A, B, C: Cc, O } = M.pg; L.circ(O, dist(O, A), 'rose', 2.4, { dash: [6, 5] }); [A, B, Cc].forEach((z) => L.ln(O, z, 'rose', 3)); L.fl([A, B, Cc], 'rose', 0.14); } },
    { h: '점 O에서 세 변까지의 거리가 같다.', f: (m) => { const g = m.pg, d1 = dist(g.O, foot(g.O, g.B, g.C)), d2 = dist(g.O, foot(g.O, g.C, g.A)), d3 = dist(g.O, foot(g.O, g.A, g.B)); return near(d1, d2) && near(d2, d3); }, w: () => '외심에서 같은 거리인 것은 세 꼭짓점까지의 거리예요. 세 변까지의 거리는 일반적으로 서로 달라요 (반례). 같은 거리가 되는 것은 내심이에요.', c: () => 'O에서 세 변까지의 거리가 서로 달라요 (반례)', d: (L, M) => { const { A, B, C: Cc, O } = M.pg; [[B, Cc], [Cc, A], [A, B]].forEach(([p, q], i) => { const f = foot(O, p, q); L.ln(O, f, 'rose', 3.6); L.tk(O, f, i + 1, 'rose'); }); } },
    { h: '점 I는 세 변의 수직이등분선의 교점이다.', f: (m) => near(dist(m.pg.I, m.pg.O), 0), w: () => '세 변의 수직이등분선이 만나는 점은 외심 O예요. 내심 I는 이등분선의 교점이라서 O와 다른 점이에요 (반례).', c: () => '수직이등분선의 교점은 O, I는 다른 점 (반례)', d: (L, M) => { const { A, B, C: Cc, O, I } = M.pg; [[A, B], [B, Cc], [Cc, A]].forEach(([p, q]) => { L.ln(mid(p, q), O, 'rose', 3, { dash: [7, 5] }); }); L.circ(I, 0.09, 'green', 3); } },
    { h: '$\\angle BOC=\\angle BIC$', f: (m) => near(angBetween(m.pg.O, m.pg.B, m.pg.C), angBetween(m.pg.I, m.pg.B, m.pg.C)), w: (M) => `∠BOC=${Math.round(angBetween(M.pg.O, M.pg.B, M.pg.C))}°이고 ∠BIC=${Math.round(angBetween(M.pg.I, M.pg.B, M.pg.C))}°로 서로 달라요 (반례).`, c: (M) => `∠BOC=${Math.round(angBetween(M.pg.O, M.pg.B, M.pg.C))}°, ∠BIC=${Math.round(angBetween(M.pg.I, M.pg.B, M.pg.C))}° — 달라요`, d: (L, M) => { const { B, C: Cc, O, I } = M.pg; L.ang(O, B, Cc, { color: 'rose', r: 24, label: dg(Math.round(angBetween(O, B, Cc))), size: 14, labelDist: 46, labelRot: SVB.rotTo(O, B, Cc, B, 38), fa: 0.4 }); L.ang(I, B, Cc, { color: 'green', r: 30, label: dg(Math.round(angBetween(I, B, Cc))), size: 14, labelDist: 50, labelRot: SVB.rotTo(I, B, Cc, Cc, 38), fa: 0.4 }); } }
  ].map((x) => ({ ...x, h: x.h.replace('${HA}', HA) }));
  const m3Solve = {
    steps: (M, s) => { const Q = m3.prob(M, s); return SVB.stmtSteps(Q, T7POOL, M, /옳은 것은/.test(Q.stem), s); },
    draw: SVB.runner({
      box: (M) => bboxOf([M.pg.A, M.pg.B, M.pg.C, M.pg.O, M.pg.I]), padL: 56,
      base: (b, M) => { const { A, B, C: Cc } = M.pg; fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); },
      legend: () => 'O: 외심 · I: 내심',
      dyn: (name, M, s) => stmtDyn(T7POOL, m3.prob)(name, M, s),
      st: { given: () => {} },
      top: (b, M) => { const { A, B, C: Cc, O, I } = M.pg, cen = pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3); b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5.5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 })); T(b, O, 'O', { dx: 14, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -14, dy: -12, size: 17, color: 'green' }); [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p, nm]) => tagOut(b, p, cen, nm, { size: 18 })); }
    })
  };

  /* ---------------------------------------------------------------- 4. 정삼각형의 O와 I */
  const m4g = () => { const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, 150), Cc = polar(O, 1, 30); return { O, A, B, C: Cc, D: mid(B, Cc) }; };
  const m4Solve = {
    quickTitle: '10초 컷 · 정삼각형은 R=2r, 높이=3r',
    quick: (M, s) => { const v = (s.trV || 0) % 3; return { steps: v === 0 ? `<p>$R=2r=2\\times${M.r}=${M.R}$ (cm)</p>` : v === 1 ? `<p>$r=\\frac{R}{2}=\\frac{${M.R}}{2}=${M.r}$ (cm)</p>` : `<p>높이 $=3r=3\\times${M.r}=${M.h}$ (cm)</p>`, note: '정삼각형의 외접원의 반지름은 내접원의 반지름의 2배예요.' }; },
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { r, R, h } = M, out = [];
      const ask = ['외접원의 반지름 $\\overline{OA}$의 길이 $x$', '내접원의 반지름 $\\overline{OD}$의 길이 $x$', '높이 $\\overline{AD}$의 길이 $x$'][v];
      const gv = [`내접원의 반지름 $\\overline{OD}=${r}$ cm`, `외접원의 반지름 $\\overline{OA}=${R}$ cm`, `내접원의 반지름 $\\overline{OD}=${r}$ cm`][v], gc = [`OD=${r} cm`, `OA=${R} cm`, `OD=${r} cm`][v], xc = ['OA=x', 'OD=x', 'AD=x'][v];
      out.push({ k: 'given', f: 'given', t: `점 O는 정삼각형 ABC의 외심이면서 내심이고, D는 변 BC의 중점이에요. ${gv}일 때 ${ask}를 구해요.`, cap: `${gc}, ${xc}` });
      out.push({ k: 'idea', f: 'idea', t: '정삼각형에서는 외심과 내심이 같은 점 O예요. O가 내심이면 BO가 ∠B=60°를 이등분해서 ∠OBD=30°가 되고, 그러면 △OBD가 30°-60°-90° 직각삼각형이라 OD는 빗변 OB의 반이에요.', cap: 'BO는 ∠B=60°를 이등분 → ∠OBD=30°' });
      out.push({ k: 'fig', f: 'half', lb: '이등분선', t: 'O는 내심이므로 BO는 ∠B=60°의 이등분선이에요. 그래서 $\\angle OBD=30^{\\circ}$.', cap: '∠OBD=\\frac{60°}{2}=30°' });
      out.push({ k: 'fig', f: 'rt', lb: '30°-60°-90°', t: '$\\overline{OD}\\perp\\overline{BC}$이므로 △OBD는 ∠D=90°, ∠OBD=30°인 직각삼각형이에요. 30°의 마주 변 OD는 빗변 OB의 반이에요: $\\overline{OD}=\\frac{1}{2}\\overline{OB}$.', cap: 'OD=\\frac{1}{2}OB (OB=OA=외접원의 반지름)' });
      if (v === 0) { out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{OA}=\\overline{OB}=2\\times\\overline{OD}=2\\times${r}=${R}$ (cm)`, cap: `x=OA=OB=2×OD=2×${r}=${R} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${R}\\text{ cm}$`, cap: `x = ${R} cm` }); }
      else if (v === 1) { out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{OD}=\\frac{1}{2}\\overline{OB}=\\frac{1}{2}\\times${R}=${r}$ (cm)`, cap: `x=OD=\\frac{1}{2}×${R}=${r} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${r}\\text{ cm}$`, cap: `x = ${r} cm` }); }
      else {
        out.push({ k: 'fig', f: 'ad', lb: '높이', t: `$\\overline{OA}=\\overline{OB}=2\\times\\overline{OD}=${2 * r}$ cm이고, 높이 AD는 A에서 O를 지나 D까지이므로 $\\overline{AD}=\\overline{AO}+\\overline{OD}$.`, cap: `AD=AO+OD=${2 * r}+${r}` });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{AO}+\\overline{OD}=${2 * r}+${r}=${h}$ (cm)`, cap: `x=${2 * r}+${r}=${h} cm` }); out.push({ k: 'ans', f: 'ans', t: `$x=${h}\\text{ cm}$`, cap: `x = ${h} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: () => ({ x0: -1.2, x1: 1.2, y0: -1.15, y1: 1.15 }), padT: 40,
      padding: (b, M, s, idx) => b.W < 560 ? { t: 26, b: idx < 0 ? 72 : 110, l: 40, r: 40 } : { t: 40, b: idx < 0 ? 80 : 132, l: 54, r: 54 },
      base: (b, M) => { const { O, A, B, C: Cc } = m4g(); b.circle(O, 1, { color: 'rose', width: 2.4, alpha: 0.6 }); b.circle(O, 0.5, { color: 'green', width: 2.4, alpha: 0.8 }); fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.4); },
      legend: () => 'O: 외심이자 내심 · D: BC의 중점',
      st: {
        given: (L, M, s, X) => {
          const { O, A, B, C: Cc, D } = m4g(), v = (s.trV || 0) % 3, rr = fs(X.b, 15);
          L.ln(A, D, 'ink', 2.4, { dash: [6, 5] }); [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 3); L.tk(O, z, 1, 'amber'); }); L.ang(D, O, B, { color: 'sky', r: 14 });
          if (X.nw) {
            const od = v === 0 || v === 2, p = mid(O, od ? D : A);
            L.tx(p, `${od ? M.r : M.R} cm`, { dx: od ? 96 : -54, color: od ? 'green' : 'rose', size: rr, keep: true, leaderAnchor: p, leader: true });
          } else if (v === 0 || v === 2) L.sd(O, D, pt(-50, 0), `${M.r} cm`, { color: 'green', size: rr, gap: 8, keep: true }); else L.sd(O, A, pt(50, 0), `${M.R} cm`, { color: 'rose', size: rr, gap: 8, keep: true });
        },
        half: (L, M) => { const { O, B, C: Cc } = m4g(); L.ln(O, B, 'rose', 4.4); L.ang(B, O, Cc, { color: 'green', r: 30, label: '30°', size: 15, labelDist: 52, fa: 0.4 }); },
        rt: (L, M) => { const { O, B, D } = m4g(); L.fl([O, B, D], 'amber', 0.3); L.ln(O, D, 'green', 4.4); L.ln(O, B, 'rose', 4.4); L.ang(D, O, B, { color: 'sky', r: 14 }); L.tk(O, D, 1, 'green'); L.tk(O, B, 2, 'rose'); },
        ad: (L, M) => { const { O, A, D } = m4g(); L.ln(A, O, 'rose', 5); L.ln(O, D, 'green', 5); L.tk(A, O, 2, 'rose'); }
      },
      x: (b, M, s, X) => {
        const { O, A, D } = m4g(), v = (s.trV || 0) % 3, rr = fs(b, 15);
        if (v === 0) G.sideTag(b, O, A, pt(50, 0), X.xVal ? `${M.R} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 8 });
        else if (v === 1 && X.nw) T(b, mid(O, D), X.xVal ? `${M.r} cm` : 'x', { dx: 96, color: 'amber', size: fs(b, X.xVal ? 15 : 18), leaderAnchor: mid(O, D), leader: true });
        else if (v === 1) G.sideTag(b, O, D, pt(-50, 0), X.xVal ? `${M.r} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 8 });
        else G.sideTag(b, A, D, pt(50, 0), X.xVal ? `${M.h} cm` : 'x', { color: 'amber', size: fs(b, X.xVal ? 15 : 18), gap: 38 });
        void rr;
      },
      top: (b, M) => { const { O, A, B, C: Cc, D } = m4g(); b.point(O, { color: 'rose', r: 6 }); [A, B, Cc, D].forEach((z) => b.point(z, { color: z === D ? 'green' : 'ink', r: 4.5 })); T(b, O, 'O', { dx: 18, dy: 6, size: 18, color: 'rose' }); T(b, A, 'A', { dy: -14, size: 18 }); T(b, B, 'B', { dx: -14, dy: 6, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: 6, size: 18 }); T(b, D, 'D', { dy: 16, size: 17 }); }
    })
  };

  /* ---------------------------------------------------------------- 5. 중점 D 와 수선의 발 D (외심 ↔ 내심) */
  // 문제와 같은 삼각형: v0 외심(왼쪽)만, v1 내심(오른쪽)만(세 변 길이에 맞춘 삼각형), v2 둘 다
  const m5geo = (M, s) => {
    const v = (s.trV || 0) % 3, x = M.x;
    let { A, B, C: Cc, O, I, DO, DI } = M;
    if (v === 1) { const a = x[1] + x[2], bb = x[2] + x[0], c = x[0] + x[1], xx = (c * c - bb * bb + a * a) / (2 * a), hh = Math.sqrt(Math.max(1e-9, c * c - xx * xx)), k = 2 / a; B = pt(0, 0); Cc = pt(a * k, 0); A = pt(xx * k, -hh * k); I = incenter(A, B, Cc); DI = foot(I, B, Cc); O = circumcenter(A, B, Cc); DO = mid(B, Cc); }
    const both = v === 2, wdt = Math.max(B.x, Cc.x) - Math.min(B.x, Cc.x) + 0.4, off = both ? wdt + 0.9 : 0, sh = (p) => pt(p.x + off, p.y);
    return { v, both, L: { A, B, C: Cc, O, DO }, R: { A: sh(A), B: sh(B), C: sh(Cc), I: sh(I), D: sh(DI) }, showL: v !== 1, showR: v !== 0, off, gc: pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3) };
  };
  const M5POOL = [
    { h: '외심에서 변에 내린 수선의 발은 그 변의 중점이다.', f: () => true, w: () => '외심 O에서 변 BC에 내린 수선의 발 D에서, OB=OC이므로 △OBC는 이등변삼각형이고 꼭지점에서 밑변에 내린 수선은 밑변을 이등분해요. 그래서 D는 BC의 중점이에요.', c: () => '외심의 D → BD=CD (중점)', d: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, O, DO } = g.L; L.ln(O, DO, 'rose', 4); L.ang(DO, O, B, { color: 'rose', r: 14 }); L.tk(B, DO, 1, 'amber'); L.tk(DO, Cc, 1, 'amber'); } },
    { h: '내심에서 세 변까지의 거리는 같다.', f: () => true, w: () => '내심은 각의 이등분선 위의 점이라서 각의 두 변에서 같은 거리에 있어요. 세 각 모두 그래서 세 변까지의 거리가 모두 같아요.', c: () => '내심: ID=IE=IF (내접원의 반지름)', d: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, I, D } = g.R, E = foot(I, Cc, A), F = foot(I, A, B); [D, E, F].forEach((z) => { L.ln(I, z, 'green', 3.6); L.tk(I, z, 1, 'green'); }); L.circ(I, dist(I, D), 'green', 2.6); } },
    { h: '외심에서 세 꼭짓점까지의 거리는 같다.', f: () => true, w: () => '외심은 세 변의 수직이등분선이 만나는 점이고, 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있어요.', c: () => '외심: OA=OB=OC (외접원의 반지름)', d: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, O } = g.L; [A, B, Cc].forEach((z) => { L.ln(O, z, 'rose', 3.6); L.tk(O, z, 2, 'rose'); }); } },
    { h: '내심에서 변에 내린 수선의 발에서 같은 점에서 그은 접선의 길이는 같다.', f: () => true, w: () => '내접원에서 한 꼭짓점에서 그은 두 접선의 길이는 같아요. 예: BD=BF, CD=CE, AE=AF.', c: () => '접선의 길이: BD=BF, CD=CE, AE=AF', d: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, I, D } = g.R, E = foot(I, Cc, A), F = foot(I, A, B); [[A, F, 'amber', 1], [A, E, 'amber', 1], [B, F, 'sky', 2], [B, D, 'sky', 2], [Cc, D, 'green', 3], [Cc, E, 'green', 3]].forEach(([p, q, col, n]) => { L.ln(p, q, col, 5); L.tk(p, q, n, col); }); } },
    { h: '내심에서 변에 내린 수선의 발은 항상 그 변의 중점이다.', f: () => false, w: (M, s) => { const g = m5geo(M, s); return Math.abs(dist(g.R.B, g.R.D) - dist(g.R.C, g.R.D)) < 1e-6 ? '내심의 수선의 발 D는 BD=BF, CD=CE로 정해지는 접점이라서 AB≠AC인 삼각형에서는 BC의 중점이 아니에요 (이 그림은 우연히 AB=AC라 BD=CD가 되지만 늘 그런 건 아니에요).' : '내심의 수선의 발 D는 BD=BF, CD=CE로 정해지는 접점이에요. BF와 CE가 다르면 D는 BC의 중점이 아니에요 (반례). 이 그림에서도 BD와 CD가 달라요.'; }, c: (M, s) => { const g = m5geo(M, s); return Math.abs(dist(g.R.B, g.R.D) - dist(g.R.C, g.R.D)) < 1e-6 ? '내심의 D는 늘 중점이 아니에요 (AB≠AC이면 BD≠CD)' : '내심의 D는 중점이 아니에요 (BD≠CD, 반례)'; }, d: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, D } = g.R; L.ln(B, D, 'sky', 5); L.ln(D, Cc, 'green', 5); L.tk(B, D, 1, 'sky'); L.tk(D, Cc, 2, 'green'); L.circ(mid(B, Cc), 0.05, 'rose', 2.6); } },
    { h: '외심에서 변에 내린 수선의 발은 변의 중점이 아닐 수 있다.', f: () => false, w: () => '외심에서 변에 내린 수선의 발은 이등변삼각형 OBC의 밑변에 내린 수선의 발이라 늘 BC의 중점이에요. 그래서 중점이 아닐 수 있다는 말은 거짓이에요.', c: () => '외심의 D는 늘 중점 → 이 문장은 거짓', d: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, O, DO } = g.L; L.ln(O, DO, 'rose', 4); L.ang(DO, O, B, { color: 'rose', r: 14 }); L.tk(B, DO, 1, 'amber'); L.tk(DO, Cc, 1, 'amber'); } },
    { h: '내심에서 세 꼭짓점까지의 거리는 항상 같다.', f: () => false, w: () => '내심에서 같은 거리인 것은 세 변까지의 거리예요. 꼭짓점까지의 거리 IA, IB, IC는 일반적으로 서로 달라요 (반례).', c: () => 'IA, IB, IC의 길이가 달라요 (반례)', d: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, I } = g.R; [A, B, Cc].forEach((z, i) => { L.ln(I, z, 'rose', 4); L.tk(I, z, i + 1, 'rose'); }); } },
    { h: '외심에서 세 변까지의 거리는 항상 같다.', f: () => false, w: () => '외심에서 같은 거리인 것은 세 꼭짓점까지의 거리예요. 세 변까지의 거리 OD, OE, OF는 일반적으로 서로 달라요 (반례).', c: () => 'OD, OE, OF의 길이가 달라요 (반례)', d: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, O } = g.L; [[B, Cc], [Cc, A], [A, B]].forEach(([p, q], i) => { const f = foot(O, p, q); L.ln(O, f, 'rose', 3.6); L.tk(O, f, i + 1, 'rose'); }); } }
  ];
  const m5Solve = {
    steps: (M, s) => {
      const v = (s.trV || 0) % 3, { m, x } = M, out = [];
      if (v === 2) return SVB.stmtSteps(m5.prob(M, s), M5POOL, M, true, s);
      if (v === 0) {
        out.push({ k: 'given', f: 'given', t: `점 O는 △ABC의 외심이고 D는 O에서 변 BC에 내린 수선의 발이에요. $\\overline{BC}=${2 * m}$ cm일 때 $\\overline{BD}$의 길이 $x$를 구해요.`, cap: `BC=${2 * m} cm, BD=x` });
        out.push({ k: 'idea', f: 'idea', t: '외심에서 B, C까지의 거리는 모두 반지름이라 OB=OC예요. 그러면 △OBC는 이등변삼각형이고, 이등변삼각형의 꼭지점 O에서 밑변 BC에 내린 수선은 밑변을 똑같이 둘로 나눠요.', cap: 'OB=OC → 꼭지점에서 밑변에 내린 수선은 밑변을 이등분' });
        out.push({ k: 'fig', f: 'iso', lb: '이등변삼각형', t: '$\\overline{OB}=\\overline{OC}$ (둘 다 외접원의 반지름)이므로 △OBC는 O를 꼭지점으로 하는 이등변삼각형이에요.', cap: 'OB=OC → △OBC는 이등변삼각형' });
        out.push({ k: 'fig', f: 'mid', lb: '밑변의 이등분', t: '$\\overline{OD}\\perp\\overline{BC}$이므로 D는 밑변 BC의 중점이에요. 그래서 $\\overline{BD}=\\overline{CD}$.', cap: 'OD⊥BC → BD=CD' });
        out.push({ k: 'eq', f: 'eq', t: `$x=\\overline{BD}=\\frac{1}{2}\\overline{BC}=\\frac{${2 * m}}{2}=${m}$ (cm)`, cap: `x=BD=\\frac{BC}{2}=\\frac{${2 * m}}{2}=${m} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${m}\\text{ cm}$`, cap: `x = ${m} cm` });
      } else {
        const [p, q, r] = x;
        out.push({ k: 'given', f: 'given', t: `점 I는 △ABC의 내심이고 D는 I에서 변 BC에 내린 수선의 발이에요. $\\overline{AB}=${p + q}$ cm, $\\overline{BC}=${q + r}$ cm, $\\overline{CA}=${r + p}$ cm일 때 $\\overline{BD}$의 길이 $x$를 구해요.`, cap: `AB=${p + q}, BC=${q + r}, CA=${r + p} (cm), BD=x` });
        out.push({ k: 'idea', f: 'idea', t: '내심의 수선의 발 D는 변의 중점이 아니라 내접원의 접점이에요(중점이 되는 건 외심일 때뿐). 그러니 BC의 반으로 구하면 안 되고, 한 점에서 그은 두 접선의 길이가 같다는 성질로 구해요.', cap: '내심의 D는 접점 → 접선의 길이로 구해요' });
        out.push({ k: 'fig', f: 'tan', lb: '접선의 길이', t: '$\\overline{AF}=\\overline{AE}=p$, $\\overline{BF}=\\overline{BD}=q$, $\\overline{CD}=\\overline{CE}=r$로 놓아요. 구하는 것은 $x=\\overline{BD}=q$.', cap: 'AF=AE=p, BF=BD=q, CD=CE=r' });
        out.push({ k: 'fig', f: 'sides', lb: '변을 합으로', t: `세 변은 $\\overline{AB}=p+q=${p + q}$, $\\overline{BC}=q+r=${q + r}$, $\\overline{CA}=r+p=${r + p}$예요.`, cap: `p+q=${p + q}, q+r=${q + r}, r+p=${r + p}` });
        out.push({ k: 'eq', f: 'eq', t: `$(p+q)+(q+r)-(r+p)=2q$이므로 $x=q=\\frac{\\overline{AB}+\\overline{BC}-\\overline{CA}}{2}=\\frac{${p + q}+${q + r}-${r + p}}{2}=${q}$ (cm)`, cap: `x=q=\\frac{${p + q}+${q + r}−${r + p}}{2}=${q} cm` });
        out.push({ k: 'ans', f: 'ans', t: `$x=${q}\\text{ cm}$`, cap: `x = ${q} cm` });
        out.push({ k: 'trap', f: 'trap', t: `D를 BC의 중점으로 보고 $\\overline{BD}=\\frac{1}{2}\\overline{BC}=\\frac{${q + r}}{2}$로 구하면 틀려요. BC의 중점은 외심에서 내린 수선의 발이에요. 내심의 D는 BD=${q}, CD=${r}로 서로 달라요.`, cap: `중점이면 \\frac{${q + r}}{2}=${(q + r) / 2} (오답) · 실제 BD=${q} cm` });
      }
      return out;
    },
    draw: SVB.runner({
      box: (M, s) => { const g = m5geo(M, s), pts = []; if (g.showL) pts.push(g.L.A, g.L.B, g.L.C, g.L.O, g.L.DO); if (g.showR) pts.push(g.R.A, g.R.B, g.R.C, g.R.I, g.R.D); return bboxOf(pts); }, padL: 44,
      padding: (b, M, s, idx) => {
        if (b.W >= 560 || (s.trV || 0) % 3 === 2) return { t: b.W < 560 ? 48 : 68, b: idx < 0 ? (b.W < 560 ? 72 : 80) : (b.W < 560 ? 126 : 132), l: 44, r: 44 };
        const cur = idx < 0 ? null : m5Solve.steps(M, s)[idx], two = cur && G.textW(String(cur.cap).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2'), fs(b, 15)) * 1.1 > Math.max(180, b.W - 28);
        return { t: 28, b: idx < 0 ? 104 : two ? 148 : 128, l: 44, r: 44 };
      },
      captionDy: (X) => X.compactRoleLegend ? 76 : 52,
      base: (b, M, s, X) => { const g = m5geo(M, s); X.compactRoleLegend = X.nw && !g.both; if (g.v === 1) b.circle(g.R.I, dist(g.R.I, g.R.D), { color: 'green', width: 2.2, alpha: 0.7 }); if (g.showL) { const { A, B, C: Cc } = g.L; fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); } if (g.showR) { const { A, B, C: Cc } = g.R; fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); } },
      legend: (M, s, X) => { const v = (s.trV || 0) % 3; if (X.nw && v !== 2) return ''; return v === 0 ? 'O: 외심 · D: O에서 BC에 내린 수선의 발' : v === 1 ? 'I: 내심 · D: I에서 BC에 내린 수선의 발' : '왼쪽 O: 외심 · 오른쪽 I: 내심 · D: 수선의 발'; },
      dyn: (name, M, s) => stmtDyn(M5POOL, m5.prob)(name, M, s),
      st: {
        given: (L, M, s, X) => {
          const g = m5geo(M, s), v = g.v, q = fs(X.b, 15);
          if (v === 0) { const { B, C: Cc, O, DO } = g.L; L.ln(O, DO, 'rose', 3); L.ang(DO, O, B, { color: 'rose', r: 14 }); L.tx(G.lerp(mid(B, Cc), Cc, 0.5), `BC = ${2 * M.m} cm`, { dy: 26, size: q, color: 'sky', keep: true }); }
          else if (v === 1) { const { A, B, C: Cc, I, D } = g.R, E = foot(I, Cc, A), F = foot(I, A, B), [p, qq, r] = M.x; L.ln(I, D, 'green', 3); L.ang(D, I, B, { color: 'green', r: 14 }); const kp = !X.at('sides') && !X.at('trap'); L.sd(B, A, I, `${p + qq} cm`, { color: 'sky', size: q, gap: 8, keep: kp }); L.sd(B, Cc, I, `${qq + r} cm`, { color: 'sky', size: q, gap: 22, keep: kp }); L.sd(Cc, A, I, `${r + p} cm`, { color: 'sky', size: q, gap: 8, keep: kp }); void E; void F; }
        },
        iso: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, O } = g.L; L.fl([O, B, Cc], 'amber', 0.14); L.ln(O, B, 'rose', 4.4); L.ln(O, Cc, 'rose', 4.4); L.tk(O, B, 2, 'rose'); L.tk(O, Cc, 2, 'rose'); },
        mid: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, O, DO } = g.L; L.ln(O, DO, 'rose', 4.4); L.ang(DO, O, B, { color: 'rose', r: 14 }); L.tk(B, DO, 1, 'amber'); L.tk(DO, Cc, 1, 'amber'); },
        tan: (L, M, s) => { const g = m5geo(M, s), { A, B, C: Cc, I, D } = g.R, E = foot(I, Cc, A), F = foot(I, A, B); L.circ(I, dist(I, D), 'green', 2.6); [[A, F, 'amber', 1], [A, E, 'amber', 1], [B, F, 'sky', 2], [B, D, 'sky', 2], [Cc, D, 'green', 3], [Cc, E, 'green', 3]].forEach(([p, q, col, n]) => { L.ln(p, q, col, 5.4); L.tk(p, q, n, col); }); },
        sides: (L, M, s, X) => { const g = m5geo(M, s), { A, B, C: Cc, I } = g.R, q = fs(X.b, 15), [p, qq, r] = M.x; L.pl([A, B, Cc], 'ink', 3.6); L.sd(B, A, I, `p+q=${p + qq}`, { color: 'ink', size: q, gap: 8 }); L.sd(B, Cc, I, `q+r=${qq + r}`, { color: 'ink', size: q, gap: 22 }); L.sd(Cc, A, I, `r+p=${r + p}`, { color: 'ink', size: q, gap: 8 }); },
        eq: (L, M, s) => { const g = m5geo(M, s); if (g.v === 1) { const { B, D, I } = g.R; L.ln(I, D, 'green', 3); L.ln(B, D, 'sky', 6); } },
        trap: (L, M, s) => { const g = m5geo(M, s), { B, C: Cc, D } = g.R, mm = mid(B, Cc); L.circ(mm, 0.05, 'rose', 3.4); L.ln(B, mm, 'rose', 4, { dash: [6, 5] }); L.tx(mm, 'BC의 중점', { dy: -24, size: 15, color: 'rose' }); void D; }
      },
      x: (b, M, s, X) => {
        const g = m5geo(M, s), v = g.v;
        if (v === 0) { const { B, DO } = g.L; if (!X.at('iso')) T(b, mid(B, DO), X.xVal ? `${M.m} cm` : 'x', { dy: 20, size: fs(b, X.xVal ? 15 : 18), color: 'amber' }); }
        else if (v === 1) { const { B, D } = g.R; if (!X.at('tan') && !X.at('sides') && !X.at('trap')) T(b, mid(B, D), X.xVal ? `${M.x[1]} cm` : 'x', { dy: 20, size: fs(b, X.xVal ? 15 : 18), color: 'amber' }); }
      },
      top: (b, M, s, X) => {
        const g = m5geo(M, s);
        if (g.showL) { const { A, B, C: Cc, O, DO } = g.L; b.point(O, { color: 'rose', r: 5.5 }); b.point(DO, { color: 'rose', r: 4 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4 })); T(b, O, 'O', { dx: 12, dy: -10, size: 17, color: 'rose' }); T(b, DO, 'D', { dy: 16, size: 17 }); [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p, nm]) => tagOut(b, p, g.gc, nm, { size: 17 })); }
        if (g.showR) { const { A, B, C: Cc, I, D } = g.R, gc = pt(g.gc.x + g.off, g.gc.y); b.point(I, { color: 'green', r: 5.5 }); b.point(D, { color: 'green', r: 4 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4 })); T(b, I, 'I', { dx: 12, dy: -10, size: 17, color: 'green' }); T(b, D, 'D', { dy: 16, size: 17 }); [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p, nm]) => tagOut(b, p, gc, nm, { size: 17 })); }
        if (X.nw && !g.both) {
          const box = b._trBox, p = pt((box.x0 + box.x1) / 2, box.y1), cur = X.cur, two = cur && G.textW(String(cur.cap).replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, '$1$2'), fs(b, 15)) * 1.1 > Math.max(180, b.W - 28);
          // 길이 조건과 풀이 설명 아래에 짧은 범례를 둡니다.
          T(b, p, `${g.v === 0 ? 'O: 외심' : 'I: 내심'} · D: 수선의 발`, { dy: X.prob ? 78 : two ? 124 : 104, size: fs(b, 14), alpha: 0.8 });
        }
      }
    })
  };

  /* ====================================================================== 2. 직각삼각형의 O와 I */
  function rtOI(a, b) {
    const C0 = pt(0, 0), B = pt(a, 0), A = pt(0, -b), c = Math.hypot(a, b), r = (a + b - c) / 2;
    return { A, B, C: C0, O: mid(A, B), R: c / 2, I: pt(r, -r), r };
  }
  const m2 = {
    id: 't7-2', title: '직각삼각형의 외심 O와 내심 I', short: '직각삼각형의 O와 I', solve: m2Solve,
    question: '직각삼각형의 외접원의 반지름 R과 내접원의 반지름 r은 세 변으로 어떻게 구할까?',
    ctl: ['trMi'],
    init: (s) => { s.trMi = 0; s.trV = 0; },
    reroll: (s) => { s.trMi = rint(0, 4); s.trV = (s.trV + 1) % 2; },
    model: (s) => { const t = RT2[clamp(Math.round(s.trMi), 0, 4)], [a, b, c, r] = t, R = c / 2; return { a, b, c, r, R, g: rtOI(a, b), tri: (a * b) / 2, circ: R * R }; },
    draw(b, s, M, C) {
      const { a, b: bb, c, r, R, g, tri } = M, { A, B, C: Cc, O, I } = g, st = C.step, v = (s.trV || 0) % 2;
      fit(b, { x0: O.x - R, x1: O.x + R, y0: O.y - R, y1: O.y + R }, { t: 40, b: C.problem ? 44 : 84, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, R, { fill: 'amber', fillAlpha: v === 0 && (C.problem || show(3)) ? 0.22 : 0.06, color: 'amber', width: 2.4 });
      fillPoly(b, [A, B, Cc], 'sky', 0.35); poly(b, [A, B, Cc], 'ink', 3.6);
      b.circle(I, r, { color: 'green', width: 2.6, alpha: 0.9 });
      ang(b, Cc, A, B, { color: 'sky', r: 26 });
      line(b, O, Cc, 'rose', 3); tick(b, A, O, 1, 'amber'); tick(b, O, B, 1, 'amber'); tick(b, O, Cc, 1, 'amber');
      G.sideTag(b, Cc, B, pt(I.x, -50), `${a} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, Cc, A, pt(80, I.y), `${bb} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, A, B, I, `${c} cm`, { color: 'sky', size: fs(b, 15), gap: 8 });
      if (!C.problem) {
        if (show(1)) G.sideTag(b, O, Cc, I, `R = ${R} cm`, { color: 'rose', size: fs(b, 15), gap: 6 });
        if (show(2)) T(b, I, `r = ${r}`, { dx: 0, dy: 26, size: fs(b, 14), color: 'green' });
      }
      b.point(O, { color: 'rose', r: 5.5 }); b.point(I, { color: 'green', r: 5 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 12, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -10, dy: -12, size: 17, color: 'green' }); tagOut(b, A, O, 'A', { size: 18 }); tagOut(b, B, O, 'B', { size: 18 }); tagOut(b, Cc, O, 'C', { size: 18 });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = `외심 O = 빗변의 중점 → R=${c}÷2=${R} cm`;
        else if (C.review && st === 2) { row = `r=(${a}+${bb}−${c})÷2=${r} cm`; col = 'green'; }
        else if (C.review && st === 3) { row = `색칠한 부분 = ${R * R}π − ${tri} (cm²)`; col = 'amber'; }
        else row = `R=${R} cm, r=${r} cm, 외접원−삼각형 = ${R * R}π−${tri} (cm²)`;
        rowT(b, pt(O.x, O.y + R), row, { dy: 34, size: fs(b, 14), color: col });
      }
    },
    steps: (M) => [
      `∠C=90°이므로 외심 O는 빗변 AB의 중점이에요. 외접원의 반지름은 $R=${fr('\\overline{AB}', 2)}=${fr(String(M.c), 2)}=${M.R}$ cm.`,
      `직각삼각형의 내접원의 반지름은 $r=${fr('a+b-c', 2)}=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ cm예요.`,
      `(외접원의 넓이) $=\\pi R^2=${M.circ}\\pi$, (삼각형의 넓이) $=${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.tri}$이므로 색칠한 부분(외접원 − 삼각형)의 넓이는 $${M.circ}\\pi-${M.tri}$ (cm²)예요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>삼각형</b>을 골라 보세요(빗변이 짝수인 정수 직각삼각형이에요). 외심은 <b>빗변의 중점</b>(R=빗변÷2), 내접원의 반지름은 <b>r=(a+b−c)÷2</b>예요. 색칠한 부분은 외접원에서 삼각형을 뺀 부분이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('빗변 c', `${M.c} cm`, 'sky'), rd('외접원의 반지름 R', `${M.R} cm`, 'rose', '빗변의 반'), rd('내접원의 반지름 r', `${M.r} cm`, 'green', '(a + b − c) ÷ 2'), rd('외접원 − 삼각형', `${M.circ}π − ${M.tri} cm²`, 'amber', null, null, true)],
      formula: `<p>$R=${fr(String(M.c), 2)}=${M.R}$, $r=${fr(`${M.a}+${M.b}-${M.c}`, 2)}=${M.r}$ (cm)</p><p>(색칠한 부분) $=\\pi\\times${M.R}^2-${fr('1', 2)}\\times${M.a}\\times${M.b}=${M.circ}\\pi-${M.tri}$ (cm²)</p>`,
      rule: '직각삼각형: 외심 = 빗변의 중점이므로 R = 빗변 ÷ 2, 내접원의 반지름 r = (직각을 낀 두 변의 합 − 빗변) ÷ 2.',
      notes: notes('R은 <b>빗변의 반</b>이고, r은 <b>(두 변의 합 − 빗변)의 반</b>이에요. 서로 달라요.', '넓이에서 π가 들어 있는 항과 없는 항은 더하거나 빼지 말고 그대로 써요.')
    }),
    prob: (M, s) => {
      const { a, b: bb, c, r, R, tri, circ } = M, v = (s.trV || 0) % 2, key = `${v}:${a}:${bb}`;
      const head = `그림과 같이 ∠C=90°이고 ${S('BC')}=${a} cm, ${S('CA')}=${bb} cm, ${S('AB')}=${c} cm인 직각삼각형 ABC의 외심을 O, 내심을 I라 하자.`;
      if (v === 0) {
        const f = (p, q) => `${p}\\pi-${q}\\text{ cm}^2`;
        const items = [{ h: `$${f(circ, tri)}$`, ok: true }, { h: `$${f(circ, 2 * tri)}$`, hint: '삼각형의 넓이는 ½×밑변×높이예요. 2를 곱하지 않아요.' }, { h: `$${f(circ * 2, tri)}$`, hint: '외접원의 넓이는 πR²이에요. R은 빗변의 반이에요.' }, { h: `$${f(circ, tri / 2)}$`, hint: '삼각형의 넓이를 한 번 더 2로 나눴어요.' }, { h: `$${f((c * c) / 1, tri)}$`, hint: '빗변을 반지름으로 썼어요. 반지름 R은 빗변의 반이에요.' }].map((x) => ({ ...x, p: x.h.replace(/\$/g, '') }));
        return { tag: '외접원과 삼각형 · 색칠한 부분의 넓이', key, stem: `${head} 외접원에서 삼각형 ABC를 제외한 색칠한 부분의 넓이 $x$는?`, ...txt(items, key) };
      }
      return numProb({ tag: '외접원과 내접원의 반지름', key, stem: `${head} 외접원의 반지름 R과 내접원의 반지름 r의 합 $x=R+r$의 값은?`, correct: R + r, wrongs: [[R, 'R만 구했어요. r도 더해야 해요.'], [r, 'r만 구했어요. R도 더해야 해요.'], [R * 2 + r, 'R은 지름이 아니라 반지름이에요.'], [R + r + 1, '다시 계산해 보세요.'], [R + r - 1, '다시 계산해 보세요.']].filter((q) => q[0] !== R + r && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = m2.model(s), g = M.g; return { ans: dist(g.O, g.C), model: dist(g.O, g.A), extra: [[dist(g.O, g.B), M.R], [dist(g.I, pt(g.I.x, 0)), M.r], [dist(g.I, pt(0, g.I.y)), M.r]] }; }
  };

  /* ====================================================================== 3. 보기 판별 */
  const CHIPS = [
    { id: 'oa', t: '① 외심에서 세 꼭짓점까지의 거리가 같다' },
    { id: 'id', t: '② 내심에서 세 변까지의 거리가 같다' },
    { id: 'oin', t: '③ 외심은 항상 삼각형의 내부에 있다' },
    { id: 'ia', t: '④ 내심에서 세 꼭짓점까지의 거리가 같다' },
    { id: 'iin', t: '⑤ 내심은 항상 삼각형의 내부에 있다' }
  ];
  function oiGeo(a, b) {
    const c = 180 - a - b, [A, B, Cc] = triBC(2, b, c), O = circumcenter(A, B, Cc), I = incenter(A, B, Cc);
    const inside = (p) => { const s1 = G.cross(sub(B, A), sub(p, A)), s2 = G.cross(sub(Cc, B), sub(p, B)), s3 = G.cross(sub(A, Cc), sub(p, Cc)); return (s1 > 1e-9 && s2 > 1e-9 && s3 > 1e-9) || (s1 < -1e-9 && s2 < -1e-9 && s3 < -1e-9); };
    return { A, B, C: Cc, O, I, a, b, c, oIn: inside(O), iIn: inside(I), D: foot(I, B, Cc), E: foot(I, Cc, A), F: foot(I, A, B) };
  }
  const chipTruth = (k, g) => {
    if (k === 0) return true; if (k === 1) return true; if (k === 2) return g.oIn; if (k === 3) return near(dist(g.I, g.A), dist(g.I, g.B)) && near(dist(g.I, g.B), dist(g.I, g.C)); return g.iIn;
  };
  const m3 = {
    id: 't7-3', title: '외심·내심의 성질 판별', short: '보기 판별', solve: m3Solve,
    question: '외심과 내심에 대한 설명 ①~⑤ 중 어떤 것이 늘 옳을까? 반례를 찾아 보세요.',
    ctl: ['trMx', 'trMy'],
    presets: () => CHIPS.map((c, i) => ({ group: i === 0 ? '확인할 보기' : '', label: c.t, apply: (s) => { s.trMk = i; }, on: (s) => (s.trMk || 0) === i })),
    init: (s) => { s.trMx = 70; s.trMy = 56; s.trMk = 0; s.trPa = 64; s.trPb = 52; s.trQi = 0; },
    reroll: (s) => { s.trPa = pick([44, 56, 64, 72, 100, 110, 120], s.trPa); s.trPb = pick([30, 36, 44, 52, 60], s.trPb); if (s.trPa + s.trPb > 170) s.trPb = 30; if (s.trPa === s.trPb) s.trPb += 2; s.trQi = (s.trQi || 0) + 1; },
    model: (s) => { const a = clamp(Math.round(s.trMx / 2) * 2, 40, 130); let b = clamp(Math.round(s.trMy / 2) * 2, 20, 70); if (180 - a - b < 10) b = 170 - a; const pa = s.trPa || 64, pb = s.trPb || 52; return { k: (s.trMk || 0) % 5, a, b, c: 180 - a - b, g: oiGeo(a, b), pg: oiGeo(pa, pb), pa, pb }; },
    draw(b, s, M, C) {
      const prob = C.problem, g = prob ? M.pg : M.g, k = M.k, { A, B, C: Cc, O, I, D, E, F } = g, st = C.step;
      fit(b, bboxOf([A, B, Cc, O, I]), { t: 50, b: prob ? 50 : 96, l: 56, r: 56 });
      const truth = chipTruth(k, g), col = truth ? 'green' : 'rose';
      fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.6);
      if (prob) {
        [A, B, Cc].forEach((z) => line(b, z, O, 'rose', 2, { alpha: 0.35 })); [D, E, F].forEach((z) => line(b, I, z, 'green', 2, { alpha: 0.5 }));
      } else {
        if (k === 0) { [A, B, Cc].forEach((z) => line(b, z, O, 'green', 3.4)); }
        if (k === 1) { [D, E, F].forEach((z) => line(b, I, z, 'green', 3.4)); b.circle(I, dist(I, D), { color: 'green', width: 2.4, alpha: 0.9 }); }
        if (k === 2) { [A, B, Cc].forEach((z) => line(b, z, O, col, 2, { alpha: 0.5 })); }
        if (k === 3) { [A, B, Cc].forEach((z) => line(b, z, I, col, 3.4)); }
        if (k === 4) { [D, E, F].forEach((z) => line(b, I, z, col, 2, { alpha: 0.5 })); }
      }
      b.point(O, { color: 'rose', r: prob || k === 0 || k === 2 ? 6 : 4.5 }); b.point(I, { color: 'green', r: prob || k === 1 || k === 3 || k === 4 ? 6 : 4.5 });
      [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4.5 }));
      T(b, O, 'O', { dx: 14, dy: 12, size: 17, color: 'rose' }); T(b, I, 'I', { dx: -14, dy: -12, size: 17, color: 'green' });
      tagOut(b, A, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'A', { size: 18 }); tagOut(b, B, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'B', { size: 18 }); tagOut(b, Cc, pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3), 'C', { size: 18 });
      if (!prob) {
        if (k === 0) { [[B, Cc], [Cc, A], [A, B]].forEach(() => {}); }
        const cenx = (A.x + B.x + Cc.x) / 3, yb = Math.max(B.y, Cc.y, O.y);
        const verdict = truth ? '참 ✓' : '거짓 ✗';
        let row = `${CHIPS[k].t.slice(2)} → ${verdict}`;
        if (k === 2 && !truth) row = `∠A=${g.a}°, ∠B=${g.b}°, ∠C=${g.c}° — 외심이 삼각형의 ${g.a >= 90 || g.b >= 90 || g.c >= 90 ? (g.a === 90 || g.b === 90 || g.c === 90 ? '변 위(직각)' : '바깥(둔각)') : '바깥'}에 있어요 → 거짓 ✗ (반례)`;
        if (k === 3 && !truth) row = `IA, IB, IC가 서로 달라요 → 거짓 ✗ (정삼각형일 때만 같아요)`;
        if (k === 3 && truth) row = `이 삼각형은 IA=IB=IC예요 (정삼각형). 다른 삼각형에서는 아니에요`;
        if (C.review) row = ['세 변의 수직이등분선의 교점이 외심이에요', '각의 이등분선 위의 점은 두 변에서 같은 거리예요', '∠A가 둔각이면 외심은 바깥이에요', '내심에서 꼭짓점까지는 서로 달라요', '내심은 늘 삼각형의 안쪽이에요'][k];
        rowT(b, pt(cenx, yb), row, { dy: 42, size: fs(b, 15), color: C.review ? 'sky' : col });
      }
    },
    steps: (M) => {
      const k = M.k;
      const base = [
        `외심 O는 세 변의 수직이등분선의 교점이고, 수직이등분선 위의 점은 선분의 두 끝점에서 같은 거리에 있으므로 $\\overline{OA}=\\overline{OB}=\\overline{OC}$. 그래서 ①은 늘 <b>참</b>이에요.`,
        `내심 I는 세 내각의 이등분선의 교점이고, 각의 이등분선 위의 점은 두 변에서 같은 거리에 있으므로 $\\overline{ID}=\\overline{IE}=\\overline{IF}$. 그래서 ②는 늘 <b>참</b>이에요.`,
        `∠A가 둔각이면 외심은 삼각형의 바깥에, 직각이면 변 위(빗변의 중점)에 있어요. 예각삼각형일 때만 내부에 있으므로 ③은 <b>거짓</b>이에요 (반례: 둔각삼각형).`,
        `내심에서 꼭짓점까지의 거리 IA, IB, IC는 일반적으로 서로 달라요. 정삼각형처럼 특별한 경우에만 같아요. 그래서 ④는 <b>거짓</b>이에요.`,
        `세 내각의 이등분선은 삼각형 안에서 만나므로 내심은 늘 삼각형의 내부에 있어요. 그래서 ⑤는 <b>참</b>이에요.`
      ];
      return [`보기 ${'①②③④⑤'[k]}을 그림에서 확인해요. ${CHIPS[k].t.slice(2)}`, base[k].replace(/<\/?b>/g, ''), `${[true, true, false, false, true][k] ? '늘 성립하므로 옳은 보기' : '성립하지 않는 경우(반례)가 있으므로 옳지 않은 보기'}예요.`];
    },
    view: (M) => {
      const k = M.k, g = M.g, truth = chipTruth(k, g);
      return {
        guide: '칩에서 <b>보기 ①~⑤</b>를 하나씩 눌러 보세요. 해당 성질이 그림에 나타나요(참이면 초록, 거짓이면 분홍). 막대로 <b>∠A, ∠B</b>를 바꿔 <b>반례</b>(예: ∠A가 둔각)를 직접 만들어 보세요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
        readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('외심 O', g.oIn ? '삼각형의 안쪽' : '삼각형의 바깥', g.oIn ? 'green' : 'rose'), rd('이 삼각형에서 보기 ' + '①②③④⑤'[k], truth ? '참' : '거짓', truth ? 'green' : 'rose', null, null, true)],
        status: truth ? { tone: 'ok', text: `보기 ${'①②③④⑤'[k]} — 이 삼각형에서는 참` } : { tone: 'warn', text: `보기 ${'①②③④⑤'[k]} — 거짓 (반례)` },
        formula: `<p>외심 O: $\\overline{OA}=\\overline{OB}=\\overline{OC}$ (수직이등분선)</p><p>내심 I: $\\overline{ID}=\\overline{IE}=\\overline{IF}$ (각의 이등분선)</p>`,
        rule: '외심은 꼭짓점까지의 거리가 같고(둔각삼각형에서는 바깥), 내심은 변까지의 거리가 같다(늘 삼각형 안).',
        notes: notes('외심 ↔ <b>꼭짓점</b>까지 같은 거리, 내심 ↔ <b>변</b>까지 같은 거리. 짝을 바꾸면 틀려요.', '외심은 둔각삼각형에서 <b>바깥</b>에 있어요. 내심은 어떤 삼각형이든 안에 있어요.')
      };
    },
    prob: (M, s) => {
      const key = `q${s.trQi || 0}`, g = M.pg, ask = (s.trQi || 0) % 2 === 0;
      const pool = T7POOL; // 풀이 흐름의 문장 풀과 같은 목록(문장마다 이유·그림이 붙어 있어요)
      const r = mkStmtChoices(pool, M, key + (ask ? 'T' : 'F'), ask);
      return { tag: ask ? '외심·내심의 성질 · 옳은 것' : '[함정] 외심·내심의 성질 · 옳지 않은 것', key: key + (ask ? 'T' : 'F'), stem: `그림에서 점 O는 삼각형 ABC의 외심이고 점 I는 내심이다. 다음 중 ${ask ? '옳은' : '옳지 않은'} 것은?`, choices: r.choices, wide: true, note: '그림의 삼각형은 숫자 바꾸기를 누를 때마다 바뀌어요' };
    },
    verify: (s) => { const M = m3.model(s), g = M.g; return { ans: M.k, model: M.k, extra: [[dist(g.O, g.A), dist(g.O, g.B)], [dist(g.I, g.D), dist(g.I, g.E)]] }; }
  };

  /* ====================================================================== 4. 정삼각형의 O와 I */
  const m4 = {
    id: 't7-4', title: '정삼각형에서는 O와 I가 같은 점', short: '정삼각형의 O와 I', solve: m4Solve,
    question: '정삼각형의 외심과 내심은 어떤 관계이고, 외접원과 내접원의 반지름의 비는?',
    ctl: ['trMr'],
    init: (s) => { s.trMr = 3; s.trV = 0; },
    reroll: (s) => { s.trMr = rint(2, 6); s.trV = (s.trV + 1) % 3; },
    model: (s) => { const r = clamp(Math.round(s.trMr), 2, 6); return { r, R: 2 * r, h: 3 * r }; },
    draw(b, s, M, C) {
      const { r, R, h } = M, st = C.step, v = (s.trV || 0) % 3;
      const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, 150), Cc = polar(O, 1, 30), D = mid(B, Cc);
      fit(b, { x0: -1.2, x1: 1.2, y0: -1.15, y1: 1.15 }, { t: 40, b: C.problem ? 44 : 60, l: 50, r: 50 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      b.circle(O, 1, { color: 'rose', width: 2.6, alpha: 0.85 }); b.circle(O, 0.5, { color: 'green', width: 2.6, alpha: 0.95 });
      fillPoly(b, [A, B, Cc], 'sky', 0.1); poly(b, [A, B, Cc], 'ink', 3.6);
      line(b, A, D, 'ink', 2.4, { dash: [6, 5], alpha: 0.7 }); line(b, O, B, 'rose', 3); line(b, O, Cc, 'rose', 3); line(b, O, A, 'rose', 3);
      ang(b, D, O, B, { color: 'sky', r: 14 }); tick(b, A, O, 1, 'amber'); tick(b, B, O, 1, 'amber'); tick(b, Cc, O, 1, 'amber');
      const rr = fs(b, 15);
      if (C.problem) {
        if (v === 0) { G.sideTag(b, O, D, pt(-50, 0), `${r} cm`, { color: 'green', size: rr, gap: 8 }); G.sideTag(b, O, A, pt(50, 0), 'x', { color: 'rose', size: fs(b, 18), gap: 8 }); }
        else if (v === 1) { G.sideTag(b, O, A, pt(50, 0), `${R} cm`, { color: 'rose', size: rr, gap: 8 }); G.sideTag(b, O, D, pt(-50, 0), 'x', { color: 'green', size: fs(b, 18), gap: 8 }); }
        else { G.sideTag(b, O, D, pt(-50, 0), `${r} cm`, { color: 'green', size: rr, gap: 8 }); G.sideTag(b, A, D, pt(50, 0), 'x', { color: 'amber', size: fs(b, 18), gap: 8 }); }
      } else {
        G.sideTag(b, O, A, pt(50, 0), `R = ${R} cm`, { color: 'rose', size: rr, gap: 8 }); G.sideTag(b, O, D, pt(-50, 0), `r = ${r} cm`, { color: 'green', size: rr, gap: 8 });
        if (show(3)) G.sideTag(b, A, D, pt(50, 0), `AD = ${h} cm`, { color: 'amber', size: rr, gap: 38 });
      }
      b.point(O, { color: 'rose', r: 6 }); [A, B, Cc, D].forEach((z) => b.point(z, { color: z === D ? 'green' : 'ink', r: 4.5 }));
      T(b, O, 'O = I', { dx: 24, dy: 4, size: 16, color: 'rose' }); T(b, A, 'A', { dy: -14, size: 18 }); T(b, B, 'B', { dx: -14, dy: 6, size: 18 }); T(b, Cc, 'C', { dx: 14, dy: 6, size: 18 }); T(b, D, 'D', { dy: 16, size: 17, color: 'green' });
      if (!C.thumb && !C.problem) {
        let row, col = 'sky';
        if (C.review && st === 1) row = '정삼각형은 이등변삼각형 셋 → 외심 = 내심';
        else if (C.review && st === 2) { row = `∠OBC=30°, ∠IBC=30° → OB=2·OD`; col = 'green'; }
        else if (C.review && st === 3) { row = `R=2r=${R}, AD=R+r=3r=${h} (cm)`; col = 'amber'; }
        else row = `r=${r} cm → R=2r=${R} cm, AD=3r=${h} cm`;
        rowT(b, pt(0, 1.0), row, { dy: 40, size: fs(b, 15), color: col });
      }
    },
    steps: (M) => [
      `정삼각형은 어느 꼭짓점에서 보아도 이등변삼각형이에요. 그래서 각의 이등분선, 중선, 수선, 변의 수직이등분선이 모두 같은 선이므로 외심과 내심이 같은 점 O예요.`,
      `$\\angle OBC=\\angle IBC=30^{\\circ}$이고 $\\angle ODB=90^{\\circ}$인 △OBD에서 $\\overline{OB}=2\\overline{OD}$ (30°-60°-90°). 즉 외접원의 반지름 R은 내접원의 반지름 r의 2배예요: $R=2r=${2 * M.r * 1}$ ($r=${M.r}$ cm).`,
      `높이 $\\overline{AD}=\\overline{AO}+\\overline{OD}=R+r=${M.R}+${M.r}=${M.h}$ cm, 즉 AD=3r이에요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>내접원의 반지름 r</b>을 바꿔 보세요. 정삼각형에서는 외심과 내심이 <b>같은 점 O</b>이고, 외접원의 반지름은 늘 내접원의 반지름의 <b>2배</b>(R=2r)예요. 높이 AD는 <b>3r</b>이에요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('내접원의 반지름 r', `${M.r} cm`, 'green'), rd('외접원의 반지름 R', `${M.R} cm`, 'rose', '2 × r'), rd('높이 AD', `${M.h} cm`, 'amber', 'R + r = 3r', null, true)],
      formula: `<p>$R=2r=2\\times${M.r}=${M.R}$ (cm)</p><p>$\\overline{AD}=R+r=3r=${M.h}$ (cm)</p>`,
      rule: '정삼각형의 외심과 내심은 일치하고, 외접원의 반지름 R = 2 × (내접원의 반지름 r), 높이 = 3r이다.',
      notes: notes('R과 r은 같은 점 O에서 <b>다른 거리</b>예요. 꼭짓점까지가 R, 변까지가 r이에요.', '높이는 R만이 아니라 <b>R+r</b>이에요.')
    }),
    prob: (M, s) => {
      const { r, R, h } = M, v = (s.trV || 0) % 3, key = `${v}:${r}`;
      const head = '그림에서 점 O는 정삼각형 ABC의 외심이면서 내심이다.';
      if (v === 0) return numProb({ tag: '정삼각형의 외심과 내심 · R', key, stem: `${head} 내접원의 반지름 ${S('OD')}=${r} cm일 때, 외접원의 반지름 ${S('OA')}의 길이 $x$는?`, correct: R, wrongs: [[r, 'OD의 길이예요. R은 r의 2배예요.'], [h, '높이 AD예요.'], [R + 1, '다시 계산해 보세요.'], [Math.max(1, R - 1), '다시 계산해 보세요.'], [r + 1, '다시 계산해 보세요.']].filter((q) => q[0] !== R && q[0] > 0), ...cmOpts });
      if (v === 1) return numProb({ tag: '정삼각형의 외심과 내심 · r', key, stem: `${head} 외접원의 반지름 ${S('OA')}=${R} cm일 때, 내접원의 반지름 ${S('OD')}의 길이 $x$는?`, correct: r, wrongs: [[R, 'OA의 길이예요. r은 R의 반이에요.'], [h, '높이예요.'], [R * 2, '다시 생각해 보세요.'], [r + 1, '다시 계산해 보세요.'], [Math.max(1, r - 1), '다시 계산해 보세요.']].filter((q) => q[0] !== r && q[0] > 0), ...cmOpts });
      return numProb({ tag: '정삼각형의 외심과 내심 · 높이', key, stem: `${head} 내접원의 반지름 ${S('OD')}=${r} cm일 때, 높이 ${S('AD')}의 길이 $x$는?`, correct: h, wrongs: [[R, 'OA의 길이예요. 높이 AD=OA+OD예요.'], [r, 'OD의 길이예요.'], [h + 1, '다시 계산해 보세요.'], [Math.max(1, h - 1), '다시 계산해 보세요.'], [4 * r, '다시 계산해 보세요.']].filter((q) => q[0] !== h && q[0] > 0), ...cmOpts });
    },
    verify: (s) => { const M = m4.model(s); return { ans: M.R, model: 2 * M.r, extra: [[M.h, M.R + M.r]] }; }
  };

  /* ====================================================================== 5. 중점 D, E, F 와 수선의 발 D, E, F */
  const m5 = {
    id: 't7-5', title: '외심의 D·E·F와 내심의 D·E·F는 달라요', short: '중점과 수선의 발', solve: m5Solve,
    question: '외심에서 변에 내린 점 D와 내심에서 변에 내린 점 D는 같은 위치일까? BD와 CD의 길이는?',
    ctl: ['trMs', 'trMt'],
    init: (s) => { s.trMs = 60; s.trMt = 70; s.trV = 0; s.trM = 6; s.trX = [4, 3, 5]; },
    reroll: (s) => { s.trV = (s.trV + 1) % 3; s.trM = rint(3, 9); do { s.trX = [rint(2, 7), rint(2, 7), rint(2, 7)]; } while (s.trX[0] === s.trX[1] && s.trX[1] === s.trX[2]); /* 세 접선 길이가 모두 같으면 정삼각형이라 I=O 가 되어 구분이 사라져요 */ },
    model: (s) => {
      const a = clamp(Math.round(s.trMs / 2) * 2, 40, 80); let b = clamp(Math.round(s.trMt / 2) * 2, 40, 80); if (a === b) b = b >= 80 ? b - 2 : b + 2; const c = 180 - a - b;
      const [A, B, Cc] = triBC(2, b, c), O = circumcenter(A, B, Cc), I = incenter(A, B, Cc), DO = mid(B, Cc), DI = foot(I, B, Cc);
      return { a, b, c, A, B, C: Cc, O, I, DO, DI, gap: dist(DO, DI), x: s.trX || [4, 3, 5], m: s.trM || 6 };
    },
    draw(b, s, M, C) {
      const { x } = M, st = C.step, v = (s.trV || 0) % 3, showL = !(C.problem && v === 1), showR = !(C.problem && v === 0);
      let { A, B, C: Cc, O, I, DO, DI } = M;
      if (C.problem && v === 1) { // 문제의 세 변 길이에 맞는 삼각형
        const a = x[1] + x[2], bb = x[2] + x[0], c = x[0] + x[1], xx = (c * c - bb * bb + a * a) / (2 * a), hh = Math.sqrt(Math.max(1e-9, c * c - xx * xx)), k = 2 / a;
        B = pt(0, 0); Cc = pt(a * k, 0); A = pt(xx * k, -hh * k); I = incenter(A, B, Cc); DI = foot(I, B, Cc); O = circumcenter(A, B, Cc); DO = mid(B, Cc);
      }
      const wdt = Math.max(B.x, Cc.x) - Math.min(B.x, Cc.x) + 0.4, off = showL && showR ? wdt + 0.9 : 0, sh = (p) => pt(p.x + off, p.y);
      const R2 = [A, B, Cc, I, DI].map(sh);
      const boxPts = (showL ? [A, B, Cc, O, DO] : []).concat(showR ? R2 : []);
      fit(b, bboxOf(boxPts), { t: 50, b: C.problem ? 56 : 96, l: 40, r: 40 });
      const show = (k) => (C.problem ? false : C.review ? st >= k : true);
      const [A2, B2, C2, I2, D2] = R2;
      if (showL) {
        fillPoly(b, [A, B, Cc], 'sky', 0.08); poly(b, [A, B, Cc], 'ink', 3.4); line(b, O, DO, 'rose', 3); ang(b, DO, O, B, { color: 'rose', r: 14 });
        if (!C.problem) { tick(b, B, DO, 1, 'amber'); tick(b, DO, Cc, 1, 'amber'); }
        b.point(O, { color: 'rose', r: 5.5 }); b.point(DO, { color: 'rose', r: 4 }); [A, B, Cc].forEach((z) => b.point(z, { color: 'ink', r: 4 }));
        T(b, O, 'O', { dx: 12, dy: -10, size: 17, color: 'rose' }); T(b, DO, 'D', { dy: 16, size: 17, color: 'rose' });
        T(b, pt((B.x + Cc.x) / 2, A.y), '외심', { dy: -22, size: fs(b, 16), color: 'rose' });
      }
      if (showR) {
        fillPoly(b, [A2, B2, C2], 'sky', 0.08); poly(b, [A2, B2, C2], 'ink', 3.4); line(b, I2, D2, 'green', 3); ang(b, D2, I2, B2, { color: 'green', r: 14 });
        b.circle(I2, dist(I2, D2), { color: 'green', width: 2.2, alpha: 0.8 });
        b.point(I2, { color: 'green', r: 5.5 }); b.point(D2, { color: 'green', r: 4 }); [A2, B2, C2].forEach((z) => b.point(z, { color: 'ink', r: 4 }));
        T(b, I2, 'I', { dx: 12, dy: -10, size: 17, color: 'green' }); T(b, D2, 'D', { dy: 16, size: 17, color: 'green' });
        T(b, pt((B2.x + C2.x) / 2, A2.y), '내심', { dy: -22, size: fs(b, 16), color: 'green' });
      }
      const gc = pt((A.x + B.x + Cc.x) / 3, (A.y + B.y + Cc.y) / 3);
      if (showL) [[A, 'A'], [B, 'B'], [Cc, 'C']].forEach(([p, nm]) => tagOut(b, p, gc, nm, { size: 17 }));
      if (showR) [[A2, 'A'], [B2, 'B'], [C2, 'C']].forEach(([p, nm]) => tagOut(b, p, pt(gc.x + off, gc.y), nm, { size: 17 }));
      if (!C.thumb) {
        const bd = dist(B, DO), bi = dist(B, DI), ci = dist(DI, Cc);
        if (!C.problem) {
          if (show(1)) { T(b, mid(B, DO), 'BD', { dy: 34, size: fs(b, 14), color: 'rose' }); T(b, mid(DO, Cc), 'CD', { dy: 34, size: fs(b, 14), color: 'rose' }); }
          if (show(2)) { T(b, mid(B2, D2), 'BD', { dy: 34, size: fs(b, 14), color: 'green' }); T(b, mid(D2, C2), 'CD', { dy: 34, size: fs(b, 14), color: 'green' }); }
          const cx = (B.x + C2.x) / 2;
          T(b, pt(cx, Math.max(B.y, Cc.y)), `외심의 D: BD=CD (중점) / 내심의 D: BD${Math.abs(bi - ci) < 1e-6 ? '=' : '≠'}CD`, { dy: 62, size: fs(b, 15), color: 'sky' });
          T(b, pt(cx, Math.max(B.y, Cc.y)), Math.abs(bi - bd) < 1e-6 ? '두 점 D의 위치는 같아요' : '두 점 D의 위치가 달라요', { dy: 84, size: fs(b, 14), color: Math.abs(bi - bd) < 1e-6 ? 'ink' : 'rose' });
        } else if (v === 0) {
          T(b, mid(B, Cc), `BC = ${2 * M.m} cm`, { dy: 38, size: fs(b, 15), color: 'sky' }); T(b, mid(B, DO), 'x', { dy: 18, size: fs(b, 18), color: 'amber' });
        } else if (v === 1) {
          T(b, mid(B2, D2), 'x', { dy: 18, size: fs(b, 18), color: 'amber' }); G.sideTag(b, B2, A2, I2, `${x[0] + x[1]} cm`, { color: 'sky', size: fs(b, 15), gap: 8 }); G.sideTag(b, B2, C2, I2, `${x[1] + x[2]} cm`, { color: 'sky', size: fs(b, 15), gap: 22 }); G.sideTag(b, C2, A2, I2, `${x[2] + x[0]} cm`, { color: 'sky', size: fs(b, 15), gap: 8 });
        }
      }
    },
    steps: (M) => [
      `외심 O는 세 변의 <b>수직이등분선</b>의 교점이에요. 변 BC와 만나는 점 D는 BC의 <b>중점</b>이므로 $\\overline{BD}=\\overline{CD}$예요.`.replace(/<\/?b>/g, ''),
      `내심 I에서 변 BC에 내린 <b>수선의 발</b> D는 BC의 중점이 아니에요. 이 삼각형에서는 BD와 CD의 길이가 달라요 (접선의 길이 BD=BF, CD=CE).`.replace(/<\/?b>/g, ''),
      `외심 ↔ 꼭짓점까지 같은 거리, D는 변의 중점. 내심 ↔ 변까지 같은 거리, D는 수선의 발. 같은 이름 D라도 위치와 뜻이 달라요.`
    ],
    view: (M) => ({
      guide: '막대로 <b>∠A, ∠B</b>를 바꿔 보세요. 왼쪽은 <b>외심</b>의 D(변의 중점), 오른쪽은 <b>내심</b>의 D(수선의 발)예요. 두 점 D는 대부분 다른 위치이고, <b>BD=CD</b>는 외심의 D에서만 늘 성립해요. 이 그림으로 문제를 풀어 보고, 풀이 탭에서 단계마다 확인해요.',
      readouts: [rd('∠A · ∠B · ∠C', `${M.a}° · ${M.b}° · ${M.c}°`, 'sky'), rd('외심의 D', 'BD = CD (중점)', 'rose'), rd('내심의 D', '수선의 발 (BD ≠ CD)', 'green', '접선의 길이 BD=BF', null, true)],
      formula: `<p>외심: $\\overline{BD}=\\overline{CD}$ (D는 변의 중점)</p><p>내심: $\\overline{BD}=\\overline{BF}$ (접선의 길이), 일반적으로 $\\overline{BD}\\ne\\overline{CD}$</p>`,
      rule: '외심의 D·E·F는 변의 중점(수직이등분선과 변의 교점), 내심의 D·E·F는 변에 내린 수선의 발(접점)이다.',
      notes: notes('외심의 D: 변을 <b>둘로 똑같이</b> 나눠요. 내심의 D: 변에 <b>수직</b>으로 내린 발이에요.', '문제에서 어느 점의 D인지 먼저 확인하세요(외심인지 내심인지).')
    }),
    prob: (M, s) => {
      const { m, x } = M, v = (s.trV || 0) % 3, key = `${v}:${m}:${x.join(',')}`;
      if (v === 0) return numProb({ tag: '외심의 중점 D', key, stem: `그림에서 점 O는 삼각형 ABC의 외심이고, 점 D는 O에서 변 BC에 내린 수선의 발이다. ${S('BC')}=${2 * m} cm일 때, ${S('BD')}의 길이 $x$는?`, correct: m, wrongs: [[2 * m, 'BC의 길이예요. D는 BC의 중점이에요.'], [m + 1, '다시 생각해 보세요.'], [Math.max(1, m - 1), '다시 생각해 보세요.'], [m + 2, '다시 생각해 보세요.'], [3 * m, '다시 생각해 보세요.']], ...cmOpts });
      if (v === 1) return numProb({ tag: '[함정] 내심의 수선의 발 D', key, stem: `그림에서 점 I는 삼각형 ABC의 내심이고, 점 D는 I에서 변 BC에 내린 수선의 발이다. ${S('AB')}=${x[0] + x[1]} cm, ${S('BC')}=${x[1] + x[2]} cm, ${S('CA')}=${x[2] + x[0]} cm일 때, ${S('BD')}의 길이 $x$는?`, correct: x[1], wrongs: [[(x[1] + x[2]) / 2, 'BC의 반이에요. 내심의 D는 BC의 중점이 아니에요.'], [x[0], 'AF의 길이예요.'], [x[2], 'CD의 길이예요.'], [x[1] + 1, '다시 계산해 보세요.'], [Math.max(1, x[1] - 1), '다시 계산해 보세요.']].filter((q) => Number.isInteger(q[0]) && q[0] !== x[1] && q[0] > 0), ...cmOpts });
      const pool = M5POOL; // 풀이 흐름의 문장 풀과 같은 목록
      const ask = true, r = mkStmtChoices(pool, M, key, ask);
      return { tag: '외심·내심의 D, E, F 구별 · 옳은 것', key, stem: '그림의 왼쪽은 삼각형 ABC의 외심 O를, 오른쪽은 내심 I를 나타낸 것이다. 다음 중 옳은 것은?', choices: r.choices, wide: true };
    },
    verify: (s) => { const M = m5.model(s); return { ans: dist(M.B, M.DO), model: dist(M.DO, M.C), extra: [[dist(M.O, M.A), dist(M.O, M.B)], [dist(M.I, M.DI), M.I === null ? 0 : dist(M.I, foot(M.I, M.C, M.A))]] }; }
  };


  // 풀이 흐름: 보기가 글인 문제는 5지선다 대신 문장 ①~⑤ 를 발문 아래에 보여 줍니다. 식 답(색칠한 부분의 넓이)은 답을 글로 보여 줍니다.
  const m2p = m2.prob;
  m2.prob = (M, s) => { const Q = m2p(M, s); return (s.trV || 0) % 2 === 0 ? { ...Q, ansHtml: `$x=${Q.choices.find((c) => c.ok).h.replace(/\$/g, '')}$` } : Q; };
  const m3p = m3.prob;
  m3.prob = (M, s) => SVB.listStmts(m3p(M, s));
  const m5p = m5.prob;
  m5.prob = (M, s) => (((s.trV || 0) % 3 === 2) ? SVB.listStmts(m5p(M, s)) : m5p(M, s));

  G.register(70, 't7', '⑦ 외심·내심', '외심·내심', PARAMS, [m1, m2, m3, m4, m5]);
})();
