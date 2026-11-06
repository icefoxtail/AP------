/* ==========================================================================
   중3 · 삼각비 — 탭 ③ 「사분원·삼각비의 표」 (t3.js, order 30) — 장면 6개
   · unitCircle 반지름이 1인 사분원   · whyOuterTan 왜 tan 은 바깥 CD 로 읽을까   · r3-1 삼각비의 표 읽기(0°~90° 전체)
   · r3-2 표에서 각 찾기(값 → 각)   · trigTableCalc 표로 변의 길이 구하기   · lineSlope [참고] 직선의 기울기 = tan θ
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const { clamp, pt, mid, T, tagOut, ang, sideTag, line, poly, fillPoly, fit, rtGeo, drawRT, rtBox, P, rd, notes, dashed, rint, pick, sample, bboxOf, DEG, textW2,
    vi, vsq, vf, vadd, vsub, vmul, vdiv, vsqrt, vtex, vcan, sinD, cosD, tanD, tbl, d4, isSpec, mkChoices, degChoices, mkTextChoices, checkQ, fmtN, decS, nmRand, triName, FN, FNK } = G;

  const PARAMS = {
    t31: P('각 θ', 15, 75, 1, 35, { color: 'amber', format: G.degF, hint: '그림의 노란 점 A를 끌어도 돼요' }),
    t32: P('각 θ', 0, 90, 1, 37, { color: 'amber', format: G.degF }),
    t32h: P('숨은 각 (값을 정해요)', 1, 89, 1, 52, { color: 'rose', format: G.degF }),
    t32x: P('내가 고른 각 x', 1, 89, 1, 45, { color: 'amber', format: G.degF }),
    t33t: P('각 θ', 10, 80, 1, 35, { color: 'amber', format: G.degF }),
    t33c: P('빗변 c', 5, 20, 5, 10, { color: 'green' }),
    t34u: P('높이(y의 증가량)', 1, 8, 1, 3, { color: 'rose' }),
    t34r: P('밑변(x의 증가량)', 1, 8, 1, 4, { color: 'sky' }),
    t34n: P('y절편 n', 0, 6, 1, 3, { color: 'violet' })
  };
  const col = { s: 'rose', c: 'sky', t: 'green' };

  /* ---- 삼각비의 표(표시용) ---- */
  const tv = (fn, d) => (fn === 't' && d === 90 ? null : tbl(fn, d));
  const cell = (v) => (v == null ? '정의되지 않음' : d4(v));
  const tableHTML = (hl) => {
    let rows = '';
    for (let d = 0; d <= 90; d++) rows += `<tr${d === hl ? ' class="hl"' : ''}><td>${d}°</td><td>${cell(tv('s', d))}</td><td>${cell(tv('c', d))}</td><td>${cell(tv('t', d))}</td></tr>`;
    return `<div class="tg-tt"><table><thead><tr><th>각</th><th>$\\sin$</th><th>$\\cos$</th><th>$\\tan$</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  const tableTex = (angs) => `\\begin{array}{c|ccc} \\theta & \\sin\\theta & \\cos\\theta & \\tan\\theta \\\\ \\hline ${angs.map((d) => `${d}^{\\circ} & ${cell(tv('s', d))} & ${cell(tv('c', d))} & ${cell(tv('t', d))}`).join(' \\\\ ')} \\end{array}`;
  const trim = (v, dp = 4) => { let t = v.toFixed(dp); if (t.indexOf('.') >= 0) t = t.replace(/0+$/, '').replace(/\.$/, ''); return t; };

  /* ---- 사분원 그림 ---- */
  // opt: { segs, labels:{AB,OB,CD}, thLabel, names, tri, rows, bBottom, handle, s, clipNote }
  function quarter(b, th, o = {}) {
    const R = 1, O = pt(0, 0), t = Math.tan(th * DEG), tc = 1.3, vis = t <= tc;
    fit(b, { x0: -0.12, x1: 1.42, y0: -1.34, y1: 0.1 }, { t: 52, b: 44 + (o.rows ? o.rows.length * 26 : 0), l: 52, r: 58 });
    b.arc(O, R, -Math.PI / 2, 0, { color: 'ink', width: 3.2 });
    line(b, O, pt(1.25, 0), 'ink', 2.4); line(b, O, pt(0, -1.25), 'ink', 2.4);
    const A = pt(Math.cos(th * DEG), -Math.sin(th * DEG)), Bp = pt(A.x, 0), Cp = pt(1, 0), D = vis ? pt(1, -t) : pt(1, -tc);
    if (o.tri) { fillPoly(b, [O, Bp, A], 'rose', 0.14); fillPoly(b, [O, Cp, D], 'green', 0.1); }
    line(b, Cp, pt(1, -1.3), 'muted', 1.8, { dash: dashed });
    line(b, O, vis ? D : pt(tc / t, -tc), 'ink', 3);
    if (o.segs !== false) { line(b, Bp, A, col.s, 5); line(b, O, Bp, col.c, 5); line(b, Cp, D, col.t, 5); }
    ang(b, Bp, O, A, { color: 'ink', r: 14 }); ang(b, Cp, O, D, { color: 'ink', r: 14 });
    ang(b, O, Cp, A, { color: 'amber', r: 30, label: o.thLabel || 'θ', size: 17, labelDist: 52 });
    const L = o.labels || {};
    if (L.AB) T(b, mid(Bp, A), L.AB, { dx: -8, size: 16, color: col.s, align: 'right' });
    if (L.OB) T(b, mid(O, Bp), L.OB, { dy: 22, size: 16, color: col.c });
    if (L.CD) T(b, mid(Cp, D), L.CD, { dx: 10, size: 16, color: col.t, align: 'left' });
    if (L.OA) T(b, mid(O, A), L.OA, { dx: -4, dy: -14, size: 16, color: 'ink', align: 'right' });
    if (o.names !== false) [[O, 'O', pt(0.5, -0.5)], [A, 'A', O], [Bp, 'B', null], [Cp, 'C', null]].forEach(([p0, n, c]) => { b.point(p0, { color: n === 'A' ? 'amber' : 'ink', r: n === 'A' ? 6 : 4.5 }); if (n === 'A') T(b, p0, n, { dx: -13, dy: -17, size: 17, align: 'right' }); else if (n === 'B') T(b, p0, n, { dx: -12, dy: 19, size: 17 }); else if (n === 'C') T(b, p0, n, { dx: 12, dy: 19, size: 17 }); else tagOut(b, p0, c, n, { size: 17, gap: 11 }); });
    if (vis && o.names !== false) { b.point(D, { color: 'ink', r: 4.5 }); T(b, D, 'D', { dx: 13, dy: -13, size: 17, align: 'left' }); }
    else if (!vis) T(b, pt(1, -tc), 'D ↑ (그림 밖)', { dx: 8, dy: -2, size: 15, color: 'green', align: 'left' });
    if (o.handle) b.handle('th', A, { color: 'amber', r: 8, ariaLabel: '점 A 끌기', drag: o.handle });
    (o.rows || []).forEach((r, i) => T(b, pt(0.65, 0), r.t, { dy: 42 + i * 26, size: 16, color: r.c }));
    return { A, Bp, Cp, D, t };
  }
  const dragTheta = (s, key) => (w) => { s[key] = clamp(Math.round(Math.atan2(-w.y, w.x) / DEG), 15, 75); };

  /* ====================================================================== 1. 반지름이 1인 사분원 */
  const uc = {
    id: 'unitCircle', title: '반지름이 1인 사분원', short: '사분원',
    question: '반지름이 1인 사분원에서 점 A를 움직이면 sin θ, cos θ, tan θ는 어느 선분의 길이로 읽을까?',
    ctl: ['t31'],
    init: (s) => { s.t31 = 35; },
    model: (s) => { const th = Math.round(s.t31); return { th, sn: sinD(th), cs: cosD(th), tn: tanD(th), spec: isSpec(th) }; },
    draw(b, s, M, C) {
      const st = C.step, vv = (v) => (M.spec ? vcan(v) : decS(v.v, 3));
      const rows = st >= 4 || st === 99 ? [{ t: `AB = sin ${M.th}° = ${vv(M.sn)}`, c: col.s }, { t: `OB = cos ${M.th}° = ${vv(M.cs)}`, c: col.c }, { t: `CD = tan ${M.th}° = ${vv(M.tn)}`, c: col.t }] : [];
      quarter(b, M.th, { rows, tri: st >= 2 || st === 99, segs: st >= 2 || st === 99, thLabel: `${M.th}°`, labels: st >= 1 || st === 99 ? { OA: '1', AB: st >= 2 || st === 99 ? 'sin θ' : '', OB: st >= 2 || st === 99 ? 'cos θ' : '', CD: st >= 3 || st === 99 ? 'tan θ' : '' } : {}, handle: C.tab === 'explore' && !C.thumb ? dragTheta(s, 't31') : null });
    },
    steps: (M) => [
      '반지름이 1인 사분원에서 $\\overline{OA}=\\overline{OC}=1$ 이에요. 점 A에서 x축에 수선 AB를 내려요.',
      '직각삼각형 $OAB$ 에서 $\\sin\\theta=\\frac{\\overline{AB}}{\\overline{OA}}=\\overline{AB}$, $\\cos\\theta=\\frac{\\overline{OB}}{\\overline{OA}}=\\overline{OB}$ (빗변이 1이라 길이가 곧 삼각비예요.)',
      '직각삼각형 $OCD$ 에서 $\\tan\\theta=\\frac{\\overline{CD}}{\\overline{OC}}=\\overline{CD}$ (밑변이 1이라 높이가 곧 tan 값이에요.)',
      `$\\theta=${M.th}^{\\circ}$ 일 때 $\\sin\\theta=${M.spec ? vtex(M.sn) : decS(M.sn.v, 4)}$, $\\cos\\theta=${M.spec ? vtex(M.cs) : decS(M.cs.v, 4)}$, $\\tan\\theta=${M.spec ? vtex(M.tn) : decS(M.tn.v, 4)}$`
    ],
    view: (M) => ({
      guide: '<b>점 A</b>를 끌거나 <b>각 θ</b> 막대를 움직여 보세요. 분홍 선분 AB가 sin θ, 하늘색 선분 OB가 cos θ, 초록 선분 CD가 tan θ예요. θ가 커질수록 AB와 CD는 길어지고 OB는 짧아져요.',
      readouts: [rd('$\\sin\\theta=\\overline{AB}$', decS(M.sn.v, 4), 'rose'), rd('$\\cos\\theta=\\overline{OB}$', decS(M.cs.v, 4), 'sky'), rd('$\\tan\\theta=\\overline{CD}$', decS(M.tn.v, 4), 'green')],
      rule: '반지름이 1인 사분원에서 $\\sin\\theta=\\overline{AB}$, $\\cos\\theta=\\overline{OB}$, $\\tan\\theta=\\overline{CD}$',
      notes: notes('tan 은 안쪽 선분이 아니라 <b>x=1 에 세운 접선 위의 CD</b>로 읽어요. 그래야 밑변 OC가 1이에요.', 'θ가 90°에 가까워지면 CD는 한없이 길어져요.')
    }),
    gen: (prev) => {
      const th = pick([30, 45, 60]), kind = pick(['seg', 'seg', 'ang']);
      const fnk = pick(th === 45 ? ['s', 'c'] : ['s', 'c', 't']), seg = { s: 'AB', c: 'OB', t: 'CD' }[fnk], val = { s: sinD(th), c: cosD(th), t: tanD(th) }[fnk];
      let q;
      if (kind === 'seg') {
        const labels = { OA: '1' }; labels[seg] = 'x';
        const wr = ['s', 'c', 't'].filter((k) => k !== fnk).map((k) => [{ s: sinD(th), c: cosD(th), t: tanD(th) }[k], '다른 선분의 길이예요. 구하는 선분이 어느 삼각비인지 확인해요.']);
        wr.push([vdiv(vi(1), val), '분자와 분모를 거꾸로 썼어요.'], [vsub(vi(1), val), '1에서 뺀 값이에요.']);
        q = {
          tag: '사분원 위의 삼각비', key: ['uc', 'seg', th, fnk].join('|'),
          stem: `그림과 같이 반지름의 길이가 $1$ 인 사분원에서 $\\angle AOB=${th}^{\\circ}$ 일 때, $\\overline{${seg}}=x$ 의 값은?`,
          choices: mkChoices(val, wr), fig: { th, labels: Object.fromEntries(Object.entries(labels).map(([k2, v2]) => [k2, v2])), thLabel: `${th}°` }, given: [`${th}°`, '1'], ans: [vcan(val)]
        };
      } else {
        const labels = { OA: '1' }; labels[seg] = vcan(val);
        const wr = [[th === 45 ? 30 : 90 - th, '다른 삼각비로 읽었어요. 어느 선분이 어느 삼각비인지 확인해요.'], [45, ''], [30, ''], [60, ''], [15, ''], [75, '']];
        const ansDeg = th;
        q = {
          tag: '사분원 위의 삼각비로 각 구하기', key: ['uc', 'ang', th, fnk].join('|'),
          stem: `그림과 같이 반지름의 길이가 $1$ 인 사분원에서 $\\overline{${seg}}=${vtex(val)}$ 일 때, $\\angle AOB=x$ 의 크기는? (단, $0^{\\circ}<x<90^{\\circ}$)`,
          choices: degChoices(ansDeg, wr), fig: { th, labels, thLabel: 'x' }, given: [vcan(val), '1'], ans: [`${th}°`]
        };
      }
      q.fig.seg = seg; q.fig.value = vcan(val); q.fig.kind = kind;
      return checkQ(q, [
        `반지름은 $OA=OC=1$입니다. ${kind === 'seg' ? `현재 각은 $${th}^{\\circ}$이고 선분 $${seg}=x$를 구해요.` : `현재 선분 $${seg}=${vtex(val)}$이고 각 $x$를 구해요.`}`,
        '$\\triangle OAB$에서 $\\sin\\theta=AB$, $\\cos\\theta=OB$입니다. $\\triangle OCD$에서 $\\tan\\theta=CD$입니다.',
        `따라서 이번에는 $${FN[fnk]} ${kind === 'seg' ? th + '^{\\circ}' : 'x'}=${kind === 'seg' ? 'x' : vtex(val)}$를 이용합니다.`,
        kind === 'seg' ? `$${th}^{\\circ}$의 ${FNK[fnk]} 값을 특수각의 직각삼각형에서 읽어 선분 $${seg}$에 대응시켜요.` : `특수각 표에서 ${FNK[fnk]} 값이 $${vtex(val)}$인 예각을 찾아요.`
      ], { kind: 'unit-circle', theta: th, fn: fnk, ask: kind, answer: kind === 'seg' ? val.v : th });
    },
    pdraw: (b, q, C) => quarter(b, q.fig.th, { labels: C.last && q.fig.kind === 'seg' ? { ...q.fig.labels, [q.fig.seg]: q.fig.value } : q.fig.labels, thLabel: C.last ? `${q.fig.th}°` : q.fig.thLabel, tri: C.review && C.step >= 2 })
  };

  /* ====================================================================== 2. 왜 tan 은 바깥 CD 로 읽을까 */
  const why = {
    id: 'whyOuterTan', title: '왜 tan x는 바깥 CD로 읽을까?', short: 'tan은 왜 CD?',
    question: '안쪽 삼각형 OAB의 $\\frac{AB}{OB}$ 도 tan θ인데, 왜 사분원에서는 바깥 선분 CD를 tan θ라고 할까?',
    ctl: ['t31'],
    init: (s) => { s.t31 = 40; },
    model: (s) => { const th = Math.round(s.t31), t = Math.tan(th * DEG); return { th, sn: Math.sin(th * DEG), cs: Math.cos(th * DEG), t }; },
    draw(b, s, M, C) {
      const st = C.step, dec = (v) => decS(v, 3);
      const rows = [];
      const nr = b.W < 560;
      if (st >= 1) { if (nr) { rows.push({ t: 'tan θ = \\frac{AB}{OB}', c: col.s }, { t: `= \\frac{${dec(M.sn)}}{${dec(M.cs)}} = ${dec(M.t)}`, c: col.s }); } else rows.push({ t: `tan θ = \\frac{AB}{OB} = \\frac{${dec(M.sn)}}{${dec(M.cs)}} = ${dec(M.t)}`, c: col.s }); }
      if (st >= 2) { if (nr) { rows.push({ t: 'tan θ = \\frac{CD}{OC}', c: col.t }, { t: `= \\frac{${dec(M.t)}}{1} = ${dec(M.t)}`, c: col.t }); } else rows.push({ t: `tan θ = \\frac{CD}{OC} = \\frac{${dec(M.t)}}{1} = ${dec(M.t)}`, c: col.t }); }
      quarter(b, M.th, { rows, tri: true, thLabel: `${M.th}°`, labels: { CD: st >= 2 ? 'tan θ' : '' }, handle: C.tab === 'explore' && !C.thumb ? dragTheta(s, 't31') : null, segs: true });
    },
    steps: (M) => [
      '안쪽 직각삼각형 $OAB$ 에서도 $\\tan\\theta=\\frac{\\overline{AB}}{\\overline{OB}}$ 예요. 그런데 이 비는 두 선분의 <b>나눗셈</b>이라 선분 하나의 길이로 읽을 수 없어요.',
      '$\\triangle OAB\\sim\\triangle OCD$ 이고 $\\overline{OC}=1$ 이에요. 그래서 $\\tan\\theta=\\frac{\\overline{CD}}{\\overline{OC}}=\\overline{CD}$ 로 선분 하나가 돼요.',
      `두 삼각형은 닮음이므로 같은 값이에요. 지금 $\\tan ${M.th}^{\\circ}=${decS(M.t, 4)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>각 θ</b>를 바꿔 보세요. 안쪽 삼각형 OAB(분홍)와 바깥 삼각형 OCD(초록)는 닮음이에요. 두 삼각형에서 구한 tan θ의 값이 항상 같아요.',
      readouts: [rd('$\\frac{AB}{OB}$', decS(M.sn / M.cs, 4), 'rose'), rd('$\\frac{CD}{OC}=CD$', decS(M.t, 4), 'green')],
      rule: '$\\triangle OAB\\sim\\triangle OCD$, $\\overline{OC}=1$ → $\\tan\\theta=\\overline{CD}$',
      notes: notes('$\\tan\\theta=\\overline{AB}$ 가 아니에요. $\\overline{AB}$ 는 $\\sin\\theta$ 예요.')
    }),
    gen: () => {
      const th = pick([20, 25, 30, 35, 40, 50, 55, 60, 65, 70]);
      const ask = pick([['\\sin\\theta', 'AB'], ['\\cos\\theta', 'OB'], ['\\tan\\theta', 'CD'], ['\\sin(90^{\\circ}-\\theta)', 'OB'], ['\\cos(90^{\\circ}-\\theta)', 'AB']]);
      const segs = ['AB', 'OB', 'CD', 'OD', 'OC'];
      const hint = { AB: '$\\overline{AB}$ 는 $\\sin\\theta$ 예요.', OB: '$\\overline{OB}$ 는 $\\cos\\theta$ 예요.', CD: '$\\overline{CD}$ 는 $\\tan\\theta$ 예요.', OD: '$\\overline{OD}$ 는 삼각비의 값이 아니에요.', OC: '$\\overline{OC}$ 는 반지름 1이에요.' };
      const items = segs.map((sg) => ({ h: `$\\overline{${sg}}$`, ok: sg === ask[1], hint: hint[sg] }));
      const q = {
        tag: '사분원에서 삼각비를 나타내는 선분', key: ['why', th, ask[0]].join('|'),
        stem: `그림과 같이 반지름의 길이가 $1$ 인 사분원에서 $\\angle AOB=\\theta$ 일 때, $${ask[0]}$ 의 값과 길이가 같은 선분은?`,
        choices: mkTextChoices(items, 'why' + th + ask[0]), fig: { th, thLabel: 'θ' }, given: ['θ'], wide: false
      };
      return checkQ(q, [
        `반지름 $OA=OC=1$이고, 구하는 값은 $${ask[0]}$입니다.`,
        '$\\triangle OAB$에서 $\\sin\\theta=AB/OA=AB$, $\\cos\\theta=OB/OA=OB$입니다.',
        '$\\triangle OCD$에서 $\\tan\\theta=CD/OC=CD$입니다. 바깥 삼각형의 이웃변이 1이라는 점을 확인해요.',
        '$\\sin(90^{\\circ}-\\theta)=\\cos\\theta$, $\\cos(90^{\\circ}-\\theta)=\\sin\\theta$를 이용해 현재 구하는 함수와 선분을 연결해요.'
      ], { kind: 'unit-segment', expression: ask[0], segment: ask[1] });
    },
    pdraw: (b, q, C) => quarter(b, q.fig.th, { thLabel: 'θ', tri: C.review && C.step >= 2, segs: C.review && C.step >= 2, labels: C.review && C.step >= 2 ? { OA: '1' } : {} })
  };

  /* ====================================================================== 3. 삼각비의 표 읽기 */
  const r31 = {
    id: 'r3-1', title: '삼각비의 표 읽기 (0°~90°)', short: '표 읽기',
    question: '삼각비의 표에서 각 θ의 행을 찾으면 sin, cos, tan의 값을 바로 읽을 수 있다. 값은 사분원의 어느 선분일까?',
    ctl: ['t32'],
    init: (s) => { s.t32 = 37; },
    model: (s) => { const th = Math.round(s.t32); return { th, sn: tv('s', th), cs: tv('c', th), tn: tv('t', th) }; },
    draw(b, s, M, C) {
      const st = C.step, th = clamp(M.th, 1, 89);
      const rows = st >= 3 || st === 99 ? [{ t: `AB = sin ${M.th}° = ${cell(M.sn)}`, c: col.s }, { t: `OB = cos ${M.th}° = ${cell(M.cs)}`, c: col.c }, { t: `CD = tan ${M.th}° = ${cell(M.tn)}`, c: col.t }] : [];
      quarter(b, th, { rows, tri: true, thLabel: `${M.th}°`, labels: st >= 2 || st === 99 ? { AB: 'sin', OB: 'cos', CD: 'tan' } : {}, names: true });
    },
    steps: (M) => [
      `삼각비의 표에서 맨 왼쪽 열의 각 $${M.th}^{\\circ}$ 가 있는 행을 찾아요.`,
      '그 행에서 $\\sin$, $\\cos$, $\\tan$ 열의 값을 읽어요. 사분원에서는 각각 $\\overline{AB}$, $\\overline{OB}$, $\\overline{CD}$ 의 길이예요.',
      `$\\sin ${M.th}^{\\circ}=${cell(M.sn)}$, $\\cos ${M.th}^{\\circ}=${cell(M.cs)}$, $\\tan ${M.th}^{\\circ}=${cell(M.tn)}$ (소수 다섯째 자리에서 반올림한 값이에요.)`
    ],
    view: (M) => ({
      guide: '<b>각 θ</b>를 바꾸면 아래 표에서 그 행이 노랗게 표시되고, 사분원의 선분 길이가 표의 값과 같아져요. 표는 0°부터 90°까지 모두 들어 있어요.',
      readouts: [rd('$\\sin\\theta$', cell(M.sn), 'rose'), rd('$\\cos\\theta$', cell(M.cs), 'sky'), rd('$\\tan\\theta$', cell(M.tn), 'green')],
      formula: tableHTML(M.th),
      rule: '표의 가로줄(각)과 세로줄(sin·cos·tan)이 만나는 칸의 수가 삼각비의 값이다',
      notes: notes('표의 값은 반올림한 근삿값이에요. 계산할 때는 $\\approx$ 대신 $=$ 로 쓰기도 해요.', 'sin은 각이 커질수록 커지고, cos는 작아지는 것을 표에서도 확인할 수 있어요.')
    }),
    gen: () => {
      const base = rint(12, 76), angs = [base, base + 1, base + 2, base + 3];
      const fa = pick(['s', 'c']), fb = pick(['s', 'c', 't']), a1 = pick(angs), a2 = pick(angs.filter((x) => x !== a1));
      const op = pick(['+', '-']);
      const va = tv(fa, a1), vb = tv(fb, a2), ans = op === '+' ? va + vb : va - vb;
      const nameF = { s: '\\sin', c: '\\cos', t: '\\tan' };
      const sw = (f) => (f === 's' ? 'c' : f === 'c' ? 's' : 't');
      const mk = (x) => Math.round(x * 1e4) / 1e4;
      const alt = (x, y) => (op === '+' ? x + y : x - y);
      const cand = [[alt(tv(sw(fa), a1), vb), '$\\sin$ 과 $\\cos$ 의 열을 바꿔 읽었어요.'], [alt(va, tv(sw(fb), a2)), '$\\sin$ 과 $\\cos$ 의 열을 바꿔 읽었어요.'], [alt(tv(fa, a2), tv(fb, a1)), '두 각을 바꿔 읽었어요. 각이 몇 도인지 다시 봐요.'], [op === '+' ? va - vb : va + vb, '더하기·빼기를 바꿨어요.'], [alt(tv(fa, a1 + 1), vb), '한 행 위·아래를 읽었어요.'], [alt(va, tv(fb, a2 - 1)), '한 행 위·아래를 읽었어요.']];
      const choices = mkChoices(vf(mk(ans)), cand.map((c) => [vf(mk(c[0])), c[1]]), { fmt: (v) => d4(v.v), plain: (v) => d4(v.v), valid: (v) => true });
      const q = {
        tag: '삼각비의 표 읽기', key: ['r31', fa, fb, a1, a2, op].join('|'), table: true,
        stem: `다음 삼각비의 표를 이용하여 $${nameF[fa]} ${a1}^{\\circ}${op === '+' ? '+' : '-'}${nameF[fb]} ${a2}^{\\circ}$ 의 값을 구하면?`,
        html: `다음 삼각비의 표를 이용하여 $${nameF[fa]} ${a1}^{\\circ}${op === '+' ? '+' : '-'}${nameF[fb]} ${a2}^{\\circ}$ 의 값을 구하면?<div style="margin-top:8px">$${tableTex(angs)}$</div>`,
        choices, fig: { angs }, given: [cell(tv('s', angs[0])), cell(tv('c', angs[3])), cell(tv('t', angs[2]))]
      };
      q.fig.cells = [{ angle: a1, fn: fa }, { angle: a2, fn: fb }];
      return checkQ(q, [
        `구하는 식은 $${nameF[fa]} ${a1}^{\\circ}${op}${nameF[fb]} ${a2}^{\\circ}$입니다. 각도는 행, 삼각비의 종류는 열에서 찾아요.`,
        `$${a1}^{\\circ}$ 행의 ${FNN[fa]} 열을 읽으면 $${nameF[fa]} ${a1}^{\\circ}\\approx${d4(va)}$입니다.`,
        `$${a2}^{\\circ}$ 행의 ${FNN[fb]} 열을 읽으면 $${nameF[fb]} ${a2}^{\\circ}\\approx${d4(vb)}$입니다.`,
        `문제에서 준 표의 근삿값으로 $${d4(va)}${op}${d4(vb)}$를 계산해요. 함수나 각도를 바꾸어 읽지 않아요.`
      ], { kind: 'table-expression', functions: [fa, fb], angles: [a1, a2], op, values: [va, vb], answer: mk(ans) });
    },
    pdraw: (b, q, C) => drawTable(b, q.fig.angs, C.review ? q.fig.cells.slice(0, Math.max(0, C.step - 1)) : null)
  };
  // 문제 그림: 삼각비의 표 일부(칸마다 글자)
  function drawTable(b, angs, hl) {
    const narrow = b.W < 560, cw = narrow ? Math.min(82, (b.W - 40) / 4) : 108, n = angs.length;
    fit(b, { x0: -1, x1: 1, y0: -1, y1: 1 }, { t: 70, b: 70, l: 20, r: 20 });
    const hdr = ['각', 'sin', 'cos', 'tan'], y0 = -((n + 1) * 36) / 2;
    const ctr = pt(0, 0);
    for (let j = 0; j < 4; j++) T(b, ctr, hdr[j], { dx: (j - 1.5) * cw, dy: y0 + 18, size: 17, color: j === 0 ? 'ink' : col[['', 's', 'c', 't'][j]] });
    angs.forEach((d, i) => {
      const y = y0 + 54 + i * 36, vals = [`${d}°`, cell(tv('s', d)), cell(tv('c', d)), cell(tv('t', d))];
      vals.forEach((v, j) => T(b, ctr, v, { dx: (j - 1.5) * cw, dy: y, size: 16, color: (Array.isArray(hl) ? hl.some((c) => c.angle === d && (j === 0 || c.fn === ['', 's', 'c', 't'][j])) : hl === d) ? 'amber' : 'ink' }));
    });
    // 표 선
    const k = b.k, hw = 2 * cw, top = y0 + 36, bot = y0 + 36 + n * 36, pxw = hw / k;
    line(b, pt(-2 * pxw / 2 * 0 - 2 * cw / k, top / k), pt(2 * cw / k, top / k), 'muted', 1.6);
    line(b, pt(-cw / k, (y0 + 4) / k), pt(-cw / k, bot / k), 'muted', 1.6);
  }

  /* ====================================================================== 4. 표에서 각 찾기 (값 → 각) */
  const FNN = { s: 'sin', c: 'cos', t: 'tan' };
  const r32 = {
    id: 'r3-2', title: '표에서 각 찾기 (값 → 각)', short: '값으로 각 찾기',
    question: '삼각비의 값이 주어지면 표에서 같은 값을 찾아 각을 알 수 있다. 숨은 각의 값과 같아지도록 내가 고른 각 x를 맞춰 보자.',
    ctl: ['t32h', 't32x'],
    presets: () => ['s', 'c', 't'].map((k, i) => ({ group: i === 0 ? '삼각비' : '', label: FNN[k], apply: (s) => { s.t32f = k; }, on: (s) => (s.t32f || 's') === k })),
    init: (s) => { s.t32h = 52; s.t32x = 45; s.t32f = 's'; },
    model: (s) => { const f = s.t32f || 's', h = Math.round(s.t32h), x = Math.round(s.t32x), target = tv(f, h), got = tv(f, x); return { f, h, x, target, got, ok: x === h, near: Math.abs(got - target) < 1e-9 }; },
    draw(b, s, M, C) {
      const st = C.step, x = M.x, seg = { s: 'AB', c: 'OB', t: 'CD' }[M.f];
      const labels = {}; labels[seg] = d4(M.target);
      const rows = [{ t: `${FNN[M.f]} x = ${d4(M.target)}  (찾을 값)`, c: col[M.f] }];
      if (st >= 2 || st === 99) rows.push({ t: `${FNN[M.f]} ${x}° = ${d4(M.got)}  ${M.ok ? '→ 같아요! x = ' + x + '°' : M.got < M.target ? '→ 값이 작아요' : '→ 값이 커요'}`, c: M.ok ? 'amber' : 'ink' });
      quarter(b, x, { rows, tri: true, thLabel: 'x', labels });
    },
    steps: (M) => [
      `$${FNN[M.f]}\\,x=${d4(M.target)}$ 이므로 표의 ${FNN[M.f]} 열에서 $${d4(M.target)}$ 를 찾아요.`,
      `그 칸과 같은 행의 맨 왼쪽 각을 읽어요. 이 행은 $${M.h}^{\\circ}$ 예요.`,
      `따라서 $x=${M.h}^{\\circ}$ 예요. (표에 없는 값이면 가장 가까운 값을 골라요.)`
    ],
    view: (M) => ({
      guide: '<b>숨은 각</b>으로 찾을 값을 정하고(칩으로 sin·cos·tan 선택), <b>내가 고른 각 x</b>를 바꿔 표의 값과 맞춰 보세요. 값이 같아지면 노랗게 표시돼요.',
      readouts: [rd('찾을 값', d4(M.target), col[M.f]), rd(`${FNN[M.f]} x`, d4(M.got), M.ok ? 'amber' : 'ink', M.ok ? '같아요' : M.got < M.target ? '값이 작아요' : '값이 커요')],
      formula: tableHTML(M.x),
      status: M.ok ? { tone: 'ok', text: `x = ${M.h}° 를 찾았어요` } : undefined,
      rule: '값 → 같은 값이 있는 칸 → 같은 행의 각을 읽는다',
      notes: notes('sin, tan 은 각이 커지면 값도 커지고, cos 는 각이 커지면 값이 작아져요. 방향을 잘못 읽지 않도록 해요.')
    }),
    gen: () => {
      const f = pick(['s', 'c', 't']), idx = rint(0, 4), base = rint(22, 62), angs = [base, base + 1, base + 2, base + 3, base + 4], ans = base + idx; // 정답이 보기 ①~⑤ 어디에나 오도록 위치를 먼저 정한다
      const v = tv(f, ans), nameF = { s: '\\sin', c: '\\cos', t: '\\tan' };
      const choices = degChoices(ans, angs.filter((a) => a !== ans).map((a) => [a, '표의 같은 행에서 값이 일치하는지 다시 확인해요.']), { noSpread: true });
      const seg = { s: 'AB', c: 'OB', t: 'CD' }[f];
      const labels = {}; labels[seg] = d4(v);
      const q = {
        tag: '삼각비의 표에서 각 구하기', key: ['r32', f, ans, base].join('|'), table: true,
        html: `다음 삼각비의 표에서 $${nameF[f]} \\,x=${d4(v)}$ 일 때, $x$ 의 크기는?<div style="margin-top:8px">$${tableTex(angs)}$</div>`,
        stem: `$${nameF[f]} \\,x=${d4(v)}$ 일 때, $x$ 의 크기는?`,
        choices, fig: { th: clamp(ans, 5, 85), labels, f }, given: [d4(v)], ans: [`${ans}°`]
      };
      q.fig.angs = angs;
      return checkQ(q, [
        `주어진 식은 $${nameF[f]} x=${d4(v)}$입니다. 표에서 ${FNN[f]} 열을 먼저 찾아요.`,
        `${FNN[f]} 열에서 $${d4(v)}$와 일치하는 칸을 찾습니다. 다른 함수의 같은 숫자와 혼동하지 않아요.`,
        '찾은 칸에서 가로로 이동해 맨 왼쪽 각도 열을 읽어요.',
        `$${nameF[f]} ${ans}^{\\circ}\\approx${d4(v)}$인지 표에서 다시 확인해요. 이 문제는 표에 주어진 값으로 각을 찾습니다.`
      ], { kind: 'table-inverse', fn: f, value: v, answer: ans });
    },
    pdraw: (b, q, C) => quarter(b, q.fig.th, { labels: q.fig.labels, thLabel: C.last ? `${q.fig.th}°` : 'x', tri: C.review && C.step >= 2 })
  };

  /* ====================================================================== 5. 표로 변의 길이 구하기 */
  const calc = {
    id: 'trigTableCalc', title: '삼각비의 표로 변의 길이 구하기', short: '표로 변의 길이',
    question: '빗변과 각이 주어졌을 때, 표의 삼각비 값을 곱하면 변의 길이를 소수로 구할 수 있다. 표의 값을 그대로 써서 계산해 보자.',
    ctl: ['t33t', 't33c'],
    init: (s) => { s.t33t = 35; s.t33c = 10; },
    model: (s) => {
      const th = Math.round(s.t33t), c = Math.round(s.t33c), sn = tbl('s', th), cs = tbl('c', th);
      return { th, c, sn, cs, a: Math.round(c * sn * 1e4) / 1e4, b: Math.round(c * cs * 1e4) / 1e4 };
    },
    draw(b, s, M, C) {
      const st = C.step, g = rtGeo(Math.sin(M.th * DEG), Math.cos(M.th * DEG)), rows = [];
      if (st >= 3 || st === 99) rows.push({ t: `a = ${M.c} × ${d4(M.sn)} = ${trim(M.a)}`, c: 'rose' }, { t: `b = ${M.c} × ${d4(M.cs)} = ${trim(M.b)}`, c: 'sky' });
      fit(b, rtBox(g), { t: 46, b: 52 + rows.length * 26, l: 60, r: 60 });
      drawRT(b, g, { names: { A: 'A', B: 'B', C: 'C' }, fill: 'sky', fa: 0.08, col: { a: 'rose', b: 'sky', c: 'green' }, side: { a: { t: st >= 2 || st === 99 ? `a = ${trim(M.a)}` : 'a', c: 'rose' }, b: { t: st >= 2 || st === 99 ? `b = ${trim(M.b)}` : 'b', c: 'sky' }, c: { t: `${M.c}`, c: 'green' } }, angA: { t: `${M.th}°`, c: 'amber' } });
      rows.forEach((r, i) => T(b, pt((g.A.x + g.C.x) / 2, g.A.y), r.t, { dy: 54 + i * 26, size: 16, color: r.c }));
    },
    steps: (M) => [
      `빗변 $c=${M.c}$ 와 각 $A=${M.th}^{\\circ}$ 가 주어졌어요. 구할 변은 $a$(대변)과 $b$(이웃변)이에요.`,
      `$a=c\\sin A$, $b=c\\cos A$ 를 써요. 표에서 $\\sin ${M.th}^{\\circ}=${d4(M.sn)}$, $\\cos ${M.th}^{\\circ}=${d4(M.cs)}$ 를 읽어요.`,
      `$a=${M.c}\\times${d4(M.sn)}=${trim(M.a)}$, $b=${M.c}\\times${d4(M.cs)}=${trim(M.b)}$`
    ],
    view: (M) => ({
      guide: '<b>각 θ</b>와 <b>빗변 c</b>를 바꿔 보세요. 표에서 읽은 삼각비의 값에 빗변을 곱하면 변의 길이가 돼요.',
      readouts: [rd('$a=c\\sin A$', trim(M.a), 'rose'), rd('$b=c\\cos A$', trim(M.b), 'sky')],
      formula: tableHTML(M.th),
      rule: '빗변 × $\\sin A$ = 대변,  빗변 × $\\cos A$ = 이웃변,  이웃변 × $\\tan A$ = 대변',
      notes: notes('표의 값은 근삿값이므로 결과도 근삿값이에요.', '$\\sin$ 을 곱할지 $\\cos$ 를 곱할지는 구하는 변이 대변인지 이웃변인지로 정해요.')
    }),
    gen: () => {
      let th = rint(11, 79); if (th === 45) th = 46; const kind = pick(['hs', 'hc', 'bt']), c = pick([5, 10, 20, 30, 40, 50]), sn = tbl('s', th), cs = tbl('c', th), tn = tbl('t', th);
      const mk = (x) => Math.round(x * 1e4) / 1e4;
      let ans, given, wr, ask, side = {}, tabTex;
      if (kind === 'hs') { ans = mk(c * sn); wr = [c * cs, c * tn, c / sn, c * sn * 2, c]; given = `${c}`; side.c = { t: given, c: 'sky' }; side.a = { t: 'x', c: 'amber', size: 21 }; ask = 'a'; tabTex = `\\sin ${th}^{\\circ}=${d4(sn)},\\ \\cos ${th}^{\\circ}=${d4(cs)},\\ \\tan ${th}^{\\circ}=${d4(tn)}`; }
      else if (kind === 'hc') { ans = mk(c * cs); wr = [c * sn, c * tn, c / cs, c * cs * 2, c]; given = `${c}`; side.c = { t: given, c: 'sky' }; side.b = { t: 'x', c: 'amber', size: 21 }; ask = 'b'; tabTex = `\\sin ${th}^{\\circ}=${d4(sn)},\\ \\cos ${th}^{\\circ}=${d4(cs)},\\ \\tan ${th}^{\\circ}=${d4(tn)}`; }
      else { ans = mk(c * tn); wr = [c * sn, c * cs, c / tn, c * tn * 2, c]; given = `${c}`; side.b = { t: given, c: 'sky' }; side.a = { t: 'x', c: 'amber', size: 21 }; ask = 'a'; tabTex = `\\sin ${th}^{\\circ}=${d4(sn)},\\ \\cos ${th}^{\\circ}=${d4(cs)},\\ \\tan ${th}^{\\circ}=${d4(tn)}`; }
      const nm = nmRand(), mirror = Math.random() < 0.4;
      const g0 = rtGeo(Math.max(0.35, Math.tan(th * DEG)), 1);
      const sh = Math.tan(th * DEG);
      const gk = Object.keys(side).find((k) => side[k].t !== 'x');
      const choices = mkChoices(vf(ans), wr.map((w) => [vf(mk(w)), '곱할 삼각비를 잘못 골랐어요. 구하는 변이 대변인지 이웃변인지 확인해요.']), { fmt: (v) => trim(v.v), plain: (v) => trim(v.v), valid: (v) => v.v > 0 });
      const q = {
        tag: '삼각비의 표로 변의 길이', key: ['calc', th, kind, c, nm.A + nm.B + nm.C].join('|'), table: true,
        stem: `$\\angle ${nm.C}=90^{\\circ}$, $\\angle ${nm.A}=${th}^{\\circ}$ 인 직각삼각형 ${triName(nm)}에서 $${G.sideTag2(nm, gk)}=${c}$ 일 때, $${G.sideTag2(nm, ask)}$ 의 길이는? (단, $${tabTex}$ 로 계산한다.)`,
        choices, fig: { a: sh, b: 1, mirror, rot: 0, names: nm, side, angA: { t: `${th}°`, c: 'sky' } }, given: [given, `${th}°`], ans: [trim(ans)]
      };
      const fn = kind === 'hs' ? 's' : kind === 'hc' ? 'c' : 't', value = { s: sn, c: cs, t: tn }[fn];
      q.fig.reference = 'A'; q.fig.solutionSide = { [ask]: trim(ans) };
      return checkQ(q, [
        `기준각 $${nm.A}=${th}^{\\circ}$, 주어진 변 $${G.sideTag2(nm, gk)}=${c}$, 구하는 변 $${G.sideTag2(nm, ask)}=x$를 확인해요.`,
        `${kind === 'hc' ? '이웃변 ÷ 빗변이므로 cos' : kind === 'hs' ? '대변 ÷ 빗변이므로 sin' : '대변 ÷ 이웃변이므로 tan'}을 사용합니다. $${FN[fn]} ${th}^{\\circ}=\\frac{x}{${c}}$입니다.`,
        `문제에서 준 표의 값 $${FN[fn]} ${th}^{\\circ}\\approx${d4(value)}$를 읽어요.`,
        `$x\\approx${c}\\times${d4(value)}$를 계산합니다. 주어진 반올림 값을 그대로 사용해요.`
      ], { kind: 'table-side', theta: th, fn, length: c, value, answer: ans });
    },
    pdraw: (b, q, C) => G.pdrawRT(b, q.fig, C)
  };

  /* ====================================================================== 6. [참고] 직선의 기울기 = tan θ */
  function lineFig(b, u, r, n, o = {}) {
    const m = u / r, xa = n === 0 ? 0 : -n / m, Q = pt(xa + r, 0), Rr = pt(xa + r, -u), A = pt(xa, 0), Bp = pt(0, -n);
    const x0 = Math.min(xa, 0) - 1.1, x1 = Math.max(xa + r, 0) + 1.1, y1 = Math.max(u, n) + 1.1;
    fit(b, { x0, x1, y0: -y1, y1: 0.9 }, { t: 44, b: 70, l: 40, r: 40 });
    line(b, pt(x0 + 0.2, 0), pt(x1 - 0.1, 0), 'muted', 2); line(b, pt(0, 0.7), pt(0, -y1 + 0.1), 'muted', 2);
    T(b, pt(x1 - 0.1, 0), 'x', { dx: 8, dy: -14, size: 16 }); T(b, pt(0, -y1 + 0.1), 'y', { dx: 14, size: 16 });
    const ext = 0.9, p0 = pt(xa - ext, -m * (-ext)), p1 = pt(xa + r + ext, -(u + m * ext));
    // 직선: y = m (x − xa)
    const pa = pt(x0 + 0.3, -m * (x0 + 0.3 - xa)), pb = pt(x1 - 0.3, -m * (x1 - 0.3 - xa));
    const clip = (p) => (p.y < -y1 + 0.2 ? pt(xa + (y1 - 0.2) / m, -(y1 - 0.2)) : p);
    line(b, o.noLeft ? A : clip(pa), clip(pb), 'ink', 3.4);
    if (o.tri) { fillPoly(b, [A, Q, Rr], 'sky', 0.15); line(b, A, Q, 'sky', 3.6); line(b, Q, Rr, 'rose', 3.6); ang(b, Q, A, Rr, { color: 'ink', r: 16 }); }
    ang(b, A, pt(xa + 1, 0), Rr, { color: 'amber', r: 34 });
    T(b, A, o.th || 'θ', { dx: 12, dy: 22, size: 17, color: 'amber', align: 'left' });
    if (o.tri) { T(b, mid(A, Q), `${r}`, { dx: 0, dy: 44, size: 16, color: 'sky' }); T(b, mid(Q, Rr), `${u}`, { dx: 12, size: 16, color: 'rose', align: 'left' }); }
    b.point(A, { color: 'ink', r: 4.5 }); b.point(Bp, { color: 'ink', r: 4.5 });
    if (o.coords) { T(b, A, o.coords[0], { dx: -6, dy: 20, size: 16, color: 'sky', align: 'right' }); T(b, Bp, o.coords[1], { dx: 10, dy: 0, size: 16, color: 'violet', align: 'left' }); }
    return { A, Q, Rr, Bp, m };
  }
  const slope = {
    id: 'lineSlope', title: '[참고] 직선의 기울기 = tan θ', short: '[참고] 기울기와 tan',
    question: '일차함수 그래프가 x축과 이루는 예각을 θ라 하면, 직선의 기울기와 tan θ는 어떤 관계일까?',
    ctl: ['t34u', 't34r', 't34n'],
    init: (s) => { s.t34u = 3; s.t34r = 4; s.t34n = 3; },
    model: (s) => { const u = Math.round(s.t34u), r = Math.round(s.t34r), n = Math.round(s.t34n), c = vsqrt(vi(u * u + r * r)); return { u, r, n, c, m: vdiv(vi(u), vi(r)), th: Math.atan2(u, r) / DEG, sn: vdiv(vi(u), c), cs: vdiv(vi(r), c) }; },
    draw(b, s, M, C) {
      const st = C.step, rows = [];
      lineFig(b, M.u, M.r, M.n, { tri: st >= 1, th: `≈${fmtN(M.th)}°`, coords: null });
      if (b.W < 560) { T(b, pt(0, 0), `기울기 = \\frac{${M.u}}{${M.r}}`, { dy: 40, size: 16, color: 'amber' }); T(b, pt(0, 0), `→ tan θ = ${vcan(M.m)}`, { dy: 66, size: 16, color: 'amber' }); } else T(b, pt(0, 0), `기울기 = \\frac{${M.u}}{${M.r}}  →  tan θ = ${vcan(M.m)}`, { dy: 40, size: 16, color: 'amber' });
    },
    steps: (M) => [
      `직선 $y=${M.m.x && M.u % M.r === 0 ? vtex(M.m) : `\\frac{${M.u}}{${M.r}}`}x+${M.n}$ 의 기울기는 $\\frac{(y\\text{의 증가량})}{(x\\text{의 증가량})}=\\frac{${M.u}}{${M.r}}$ 이에요.`,
      `직선 위에 밑변 $${M.r}$, 높이 $${M.u}$ 인 직각삼각형을 그려요. 직선이 x축과 이루는 예각 $\\theta$ 는 이 삼각형의 한 각이에요.`,
      `$\\tan\\theta=\\frac{\\text{높이}}{\\text{밑변}}=\\frac{${M.u}}{${M.r}}=\\text{(기울기)}$ 예요. 빗변은 $\\sqrt{${M.u}^2+${M.r}^2}=${vtex(M.c)}$ 이므로 $\\sin\\theta=${vtex(M.sn)}$ 예요.`
    ],
    view: (M) => ({
      guide: '<b>높이</b>와 <b>밑변</b>으로 직선의 기울기를 정해 보세요. 직선이 x축과 이루는 예각 θ의 tan 값이 기울기와 같아요.',
      readouts: [rd('기울기', `$${vtex(M.m)}$`, 'amber'), rd('$\\tan\\theta$', `$${vtex(M.m)}$`, 'green'), rd('$\\sin\\theta$', `$${vtex(M.sn)}$`, 'rose')],
      rule: '직선이 x축의 양의 방향과 이루는 각이 θ 이면 (기울기) = $\\tan\\theta$',
      notes: notes('이 장면은 삼각비와 일차함수를 연결하는 참고 내용이에요.', '기울기가 음수인 직선은 x축과 이루는 예각을 따로 생각해야 해요.')
    }),
    gen: () => {
      const t = pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 6, 10], [6, 8, 10], [8, 15, 17], [15, 8, 17]]);
      const p = t[1], qy = t[0], hyp = t[2], fnk = pick(['s', 'c', 't']), ang0 = { s: [qy, hyp], c: [p, hyp], t: [qy, p] }[fnk];
      const gg = G.gcd(ang0[0], ang0[1]), ans = vdiv(vi(ang0[0] / gg), vi(ang0[1] / gg));
      const wr = ['s', 'c', 't'].filter((k) => k !== fnk).map((k) => { const z = { s: [qy, hyp], c: [p, hyp], t: [qy, p] }[k], g2 = G.gcd(z[0], z[1]); return [vdiv(vi(z[0] / g2), vi(z[1] / g2)), '다른 삼각비예요. 밑변·높이·빗변을 다시 짝지어 봐요.']; });
      wr.push([vdiv(vi(1), ans), '분자와 분모를 거꾸로 썼어요.']);
      const q = {
        tag: '[참고] 직선의 기울기와 삼각비', key: ['slope', p, qy, fnk].join('|'),
        stem: `그림과 같이 $x$ 절편이 $-${p}$, $y$ 절편이 $${qy}$ 인 직선이 $x$ 축과 이루는 예각의 크기를 $a$ 라 할 때, $${FN[fnk]} \\,a$ 의 값은?`,
        choices: mkChoices(ans, wr), fig: { u: qy, r: p, n: qy, p, qy }, given: [`(−${p}, 0)`, `(0, ${qy})`]
      };
      return checkQ(q, [
        `두 절편은 $(-${p},0)$, $(0,${qy})$입니다. 두 점과 원점으로 직각삼각형을 만들어요.`,
        `기준각 $a$의 이웃변은 $${p}$, 대변은 $${qy}$입니다. 좌표가 음수여도 선분의 길이는 양수예요.`,
        `빗변은 $\\sqrt{${p}^2+${qy}^2}=${hyp}$입니다. 기울기는 높이 ÷ 밑변 $=${qy}/${p}$입니다.`,
        `$${FN[fnk]} a=\\frac{${ang0[0]}}{${ang0[1]}}$를 약분합니다. 기울기와 같은 것은 $\\tan a$예요.`
      ], { kind: 'slope', opposite: qy, adjacent: p, fn: fnk, answer: ans.v });
    },
    pdraw: (b, q, C) => { const f = q.fig; lineFig(b, f.u, f.r, f.n, { th: 'a', tri: C.review && C.step >= 2, coords: [`(−${f.p}, 0)`, `(0, ${f.qy})`] }); }
  };

  G.register(30, 't3', '③ 사분원·삼각비표', '사분원·삼각비표', PARAMS, [uc, why, r31, r32, calc, slope]);
})();
