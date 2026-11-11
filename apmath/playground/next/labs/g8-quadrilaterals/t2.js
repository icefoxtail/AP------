/* ==========================================================================
   중2 · 사각형의 성질 — 탭 ② 「평행사변형이 되는 조건」 (t2.js, order 20) — 장면 10개
   · q2-1 판정 조건 5가지        · 칩 ①~⑤를 켜면 꼭짓점 D를 끌어도 평행사변형 유지, 끄면 모양이 무너져요
   · q2-2 한 쌍 평행 + 길이 같음 · AD∥BC일 때 AD=BC여야 해요 (등변사다리꼴 함정)
   · q2-3 숨은 평행사변형        · 대각선에 내린 수선의 발 E, F → □EBFD
   · q2-4 증명 빈칸 채우기       · 두 쌍의 대각이 각각 같으면 평행사변형 (서술형)
   · q2-5~9 안 되는 경우(반례)   · 등변사다리꼴 · 연 모양 · 대각선 길이만 같음 · 한쪽만 이등분 · 이름 순서 함정
   이전 「성립하지 않는 조건과 반례」 탭의 5장면을 이 탭의 「안 되는 경우」로 옮겼습니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  const { dimLine, parAll, DEG, clamp, pt, add, sub, mul, unit, mid, lerp, dist, polar, inter, pick, rint, bboxOf, T, tagOut, ang, tick, par, fillPoly, line, poly, fit, P, mkChoices, mkTextChoices, rd, notes, fmtN, dg, para, sd, ll, an, tri, capLine, segTag, ci, foot, shuffle } = G;
  const lenF = (v) => fmtN(v);
  const degF = G.degF;
  const J = (c, d) => ({ A: c.A, B: c.B, C: c.C, D: c.D });
  void J;

  const PARAMS = {
    qbLen: P('AD의 길이', 3, 9, 1, 5, { color: 'amber', hint: '꼭짓점 D를 가로로 끌어도 돼요', format: lenF }),
    qbBc: P('BC의 길이', 3, 9, 1, 7, { color: 'sky', hint: '꼭짓점 C를 가로로 끌어도 돼요', format: lenF }),
    qbH: P('높이', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qbL: P('대각선 AC', 8, 14, 1, 12, { color: 'sky', format: lenF }),
    qbE: P('AE의 길이', 1, 3, 1, 2, { color: 'amber', hint: '그림의 점 E를 가로로 끌어도 돼요', format: lenF }),
    qbHb: P('BE의 길이(높이)', 2, 4, 1, 3, { color: 'green', format: lenF }),
    qbA: P('∠A의 크기', 50, 130, 2, 66, { color: 'amber', hint: '꼭짓점 A를 끌어도 돼요', format: degF }),
    qbW: P('밑변 BC', 6, 10, 1, 8, { color: 'sky', format: lenF }),
    qbS: P('옆변 AB', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qbTa: P('윗변 AD', 3, 6, 1, 4, { color: 'amber', hint: '꼭짓점 D를 가로로 끌어도 돼요', format: lenF }),
    qbTb: P('아랫변 BC', 8, 12, 1, 10, { color: 'sky', format: lenF }),
    qbTh: P('높이', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qbK1: P('OA의 길이', 2, 4, 1, 3, { color: 'amber', format: lenF }),
    qbK2: P('OC의 길이', 5, 7, 1, 6, { color: 'sky', format: lenF }),
    qbKq: P('OB = OD', 3, 5, 1, 4, { color: 'green', format: lenF }),
    qbTh2: P('∠AOB', 50, 130, 10, 70, { color: 'rose', format: degF }),
    qbM: P('OA = OD', 2, 4, 1, 3, { color: 'amber', format: lenF }),
    qbN: P('OB = OC', 5, 7, 1, 6, { color: 'sky', format: lenF }),
    qbNb: P('OB의 길이', 2, 4, 1, 3, { color: 'amber', format: lenF }),
    qbNd: P('OD의 길이', 5, 7, 1, 6, { color: 'sky', format: lenF }),
    qbNa: P('OA = OC', 3, 5, 1, 4, { color: 'green', format: lenF })
  };

  /* ---------- 대각선 교점 O 를 원점으로 한 사각형: OA=p1, OC=p2, OB=q1, OD=q2, ∠AOB=th ---------- */
  function dq(p1, p2, q1, q2, th) {
    const O = pt(0, 0), aA = -180 + th / 2;
    const A = polar(O, p1, aA), B = polar(O, q1, aA - th), C = polar(O, p2, aA + 180), D = polar(O, q2, aA - th + 180);
    return { A, B, C, D, O, pts: [A, B, C, D] };
  }
  const dotsQ = (b, p, o = {}) => { [['A', p.A], ['B', p.B], ['C', p.C], ['D', p.D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, o.cen || p.O, k, { size: 17, gap: 11 }); }); };
  const dotO = (b, p, color = 'ink') => { b.point(p.O, { color, r: 4.5 }); T(b, p.O, 'O', { dx: 11, dy: -13, size: 16, color }); };
  const crossO = (A, B, C, D) => inter(A, C, B, D);

  /* ====================================================================== 조건 문장 (문제 보기) */
  const TRUE_C = [
    { id: 't1', h: '$\\overline{AB}\\parallel\\overline{DC}$, $\\overline{AD}\\parallel\\overline{BC}$', hint: '두 쌍의 대변이 각각 평행하면 평행사변형이에요(정의).' },
    { id: 't2', h: '$\\overline{AB}=\\overline{DC}$, $\\overline{AD}=\\overline{BC}$', hint: '두 쌍의 대변의 길이가 각각 같으면 평행사변형이에요.' },
    { id: 't3', h: '$\\angle A=\\angle C$, $\\angle B=\\angle D$', hint: '두 쌍의 대각의 크기가 각각 같으면 평행사변형이에요.' },
    { id: 't4', h: '$\\overline{OA}=\\overline{OC}$, $\\overline{OB}=\\overline{OD}$', hint: '두 대각선이 서로 다른 것을 이등분하면 평행사변형이에요.' },
    { id: 't5', h: '$\\overline{AD}\\parallel\\overline{BC}$, $\\overline{AD}=\\overline{BC}$', hint: '한 쌍의 대변이 평행하고 그 길이가 같으면 평행사변형이에요.' }
  ];
  const FALSE_C = [
    { id: 'f1', h: '$\\overline{AD}\\parallel\\overline{BC}$, $\\overline{AB}=\\overline{DC}$', hint: '평행한 변(AD, BC)이 아닌 다른 쌍(AB, DC)의 길이가 같은 경우예요. 등변사다리꼴이 반례예요.' },
    { id: 'f2', h: '$\\overline{AB}=\\overline{BC}$, $\\overline{CD}=\\overline{DA}$', hint: '이웃한 변끼리 같은 연 모양 사각형이 반례예요. 같은 변의 짝은 마주 보는 변이어야 해요.' },
    { id: 'f3', h: '$\\overline{AC}=\\overline{BD}$', hint: '두 대각선의 길이가 같기만 한 등변사다리꼴이 반례예요.' },
    { id: 'f4', h: '$\\overline{AC}\\perp\\overline{BD}$', hint: '두 대각선이 수직이기만 한 연 모양 사각형이 반례예요.' },
    { id: 'f5', h: '$\\overline{OB}=\\overline{OD}$', hint: '한 대각선만 다른 대각선을 이등분하면 평행사변형이 아닐 수 있어요. 두 대각선이 서로 이등분해야 해요.' },
    { id: 'f6', h: '$\\angle A=\\angle C$', hint: '한 쌍의 대각만 같은 경우(연 모양 사각형)가 반례예요. 두 쌍이 모두 같아야 해요.' }
  ];
  // 5지선다 보기: 참 nT 개 + 거짓 5−nT 개. need = 문제가 묻는 쪽('true' 이면 평행사변형이 되는 조건 1개가 정답)
  function condItems(wantTrue, forceF, ord0) {
    const rnd = Math.random;
    const f = FALSE_C.slice(), t = TRUE_C.slice();
    let list;
    if (wantTrue) {
      const tr = ord0 && ord0.t != null ? TRUE_C[ord0.t] : t[Math.floor(rnd() * t.length)];
      let fs = ord0 && ord0.f ? ord0.f.map((i) => FALSE_C[i]) : shuffle(f, rnd).slice(0, 4);
      if (forceF && !fs.some((x) => x.id === forceF)) fs = [FALSE_C.find((x) => x.id === forceF)].concat(fs.slice(0, 3));
      list = [{ h: tr.h, ok: true, hint: tr.hint }].concat(fs.map((x) => ({ h: x.h, ok: false, hint: x.hint })));
    } else {
      const fx = ord0 && ord0.f ? FALSE_C[ord0.f[0]] : (forceF ? FALSE_C.find((x) => x.id === forceF) : f[Math.floor(rnd() * f.length)]);
      const ts = ord0 && ord0.ts ? ord0.ts.map((i) => TRUE_C[i]) : shuffle(t, rnd).slice(0, 4);
      list = [{ h: fx.h, ok: true, hint: '' }].concat(ts.map((x) => ({ h: x.h, ok: false, hint: x.hint + ' 이 조건은 평행사변형이 되는 조건이에요.' })));
    }
    return list;
  }
  // 문제 하나를 상태에 저장합니다(숫자 바꾸기마다 새로). pk = { wantTrue, t, f[], ts[] }
  function newCondPk(forceF) {
    const wantTrue = Math.random() < 0.5, pk = { wantTrue };
    if (wantTrue) { pk.t = Math.floor(Math.random() * TRUE_C.length); let idx = shuffle(FALSE_C.map((_, i) => i), Math.random); if (forceF) { const fi = FALSE_C.findIndex((x) => x.id === forceF); idx = [fi].concat(idx.filter((i) => i !== fi)); } pk.f = idx.slice(0, 4); }
    else { let idx = shuffle(FALSE_C.map((_, i) => i), Math.random); if (forceF) { const fi = FALSE_C.findIndex((x) => x.id === forceF); idx = [fi].concat(idx.filter((i) => i !== fi)); } pk.f = [idx[0]]; pk.ts = shuffle(TRUE_C.map((_, i) => i), Math.random).slice(0, 4); }
    return pk;
  }
  function condProb(s, tag, force) {
    const pk = s.qbPk || (s.qbPk = newCondPk(force));
    const items = condItems(pk.wantTrue, force, pk);
    const stem = pk.wantTrue ? '다음 중 사각형 ABCD가 평행사변형이 되는 조건인 것은? (단, 점 O는 두 대각선 AC, BD의 교점이다.)' : '다음 중 사각형 ABCD가 평행사변형이 되는 조건이 <u>아닌</u> 것은? (단, 점 O는 두 대각선 AC, BD의 교점이다.)';
    const key = (pk.wantTrue ? 'T' : 'F') + items.map((x) => x.h.length).join('');
    const selected = pk.wantTrue ? TRUE_C[pk.t] : FALSE_C[pk.f[0]];
    return { tag, key: key + (pk.t != null ? pk.t : '') + (pk.f || []).join('') + (pk.ts || []).join(''), html: stem, choices: mkTextChoices(items, s.qdOrd), wide: true, conditionId: selected.id, answerReason: selected.hint, wantTrue: pk.wantTrue };
  }
  // 문제 그림(일반 사각형 + 대각선 + O)
  function drawCondProb(b) {
    const A = pt(1.3, -4.2), B = pt(0, 0), C = pt(7.2, 0), D = pt(6.4, -3.3), O = crossO(A, B, C, D), pts = [A, B, C, D];
    fit(b, bboxOf(pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, pts, 'sky', 0.08); poly(b, pts, 'ink', 3.4); line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4);
    dotsQ(b, { A, B, C, D, O }, { cen: O }); dotO(b, { O });
  }

  /* ====================================================================== 1. 판정 조건 5가지 */
  const CHIPS = ['① 두 쌍의 대변이 각각 평행', '② 두 쌍의 대변의 길이가 각각 같음', '③ 두 쌍의 대각의 크기가 각각 같음', '④ 두 대각선이 서로 다른 것을 이등분', '⑤ 한 쌍의 대변이 평행하고 길이가 같음'];
  const Bq = pt(0, 0), Cq = pt(7, 0);
  const anyOn = (s) => (s.qbOn || []).some((x) => x);
  const five = {
    id: 'q2-1', title: '평행사변형이 되는 조건 5가지', short: '조건 5가지',
    question: '사각형이 평행사변형이 되려면 어떤 조건이 필요할까? 조건을 켜고 꼭짓점을 끌어 보자.',
    ctl: [],
    presets: () => CHIPS.map((label, i) => ({ group: i === 0 ? '조건을 켜 보세요' : '', label, color: 'amber', apply: (s) => { const on = (s.qbOn || [false, false, false, false, false]).slice(); on[i] = !on[i]; s.qbOn = on; if (on.some((x) => x)) s.qbPd = pt(s.qbPa.x + 7, s.qbPa.y); }, on: (s) => !!(s.qbOn && s.qbOn[i]) })),
    init: (s) => { s.qbOn = [true, false, false, false, false]; s.qbPa = pt(1.6, -4); s.qbPd = pt(8.6, -4); s.qbPk = null; },
    reroll: (s) => { s.qbPk = newCondPk(null); },
    model: (s) => {
      const on = s.qbOn || [false, false, false, false, false], A = s.qbPa, D = s.qbPd, enforced = on.some((x) => x), O = crossO(A, Bq, Cq, D);
      const isPara = Math.abs(D.x - A.x - 7) < 1e-6 && Math.abs(D.y - A.y) < 1e-6;
      return { on, A, B: Bq, C: Cq, D, O, enforced, isPara, pts: [A, Bq, Cq, D], first: on.findIndex((x) => x) };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawCondProb(b); return; }
      const { A, B, C, D, O, on, pts } = M, st = cx.step;
      fit(b, { x0: -3.4, x1: 10.4, y0: -5.6, y1: 0 }, { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, M.isPara ? 'green' : 'rose', 0.1); poly(b, pts, 'ink', 3.4);
      const f = M.first, show = (i) => (cx.review ? f === i : on[i]);
      if (show(0) || (cx.review && f === 4)) { const pf = show(1) || show(4) ? 0.24 : 0.5; par(b, A, D, 1, 'green', pf); par(b, B, C, 1, 'green', pf); if (show(0)) { par(b, A, B, 2, 'green', pf); par(b, D, C, 2, 'green', pf); } }
      if (show(1)) { tick(b, A, B, 1); tick(b, D, C, 1); tick(b, A, D, 2); tick(b, B, C, 2); }
      if (show(4)) { tick(b, A, D, 3); tick(b, B, C, 3); }
      if (show(2)) { ang(b, A, B, D, { color: 'sky', rings: 1, r: 24 }); ang(b, C, D, B, { color: 'sky', rings: 1, r: 24 }); ang(b, B, C, A, { color: 'rose', rings: 2, r: 24 }); ang(b, D, A, C, { color: 'rose', rings: 2, r: 24 }); }
      if (show(3)) { line(b, A, C, 'green', 2.8, { dash: [8, 5] }); line(b, B, D, 'green', 2.8, { dash: [8, 5] }); tick(b, A, O, 1); tick(b, O, C, 1); tick(b, B, O, 2); tick(b, O, D, 2); b.point(O, { color: 'green', r: 4.5 }); T(b, O, 'O', { dx: 11, dy: -13, size: 16, color: 'green' }); }
      if (cx.review && f === 3 && st >= 2) { fillPoly(b, [A, B, O], 'amber', 0.14); fillPoly(b, [C, D, O], 'amber', 0.14); }
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, mid(A, C), k, { size: 17, gap: 11 }); });
      if (!cx.review) {
        b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '꼭짓점 D 끌기', drag: (w2) => { const d = pt(clamp(Math.round(w2.x * 4) / 4, 4.5, 9.5), clamp(Math.round(w2.y * 4) / 4, -5.2, -1.6)); s.qbPd = d; if (anyOn(s)) s.qbPa = pt(d.x - 7, d.y); } });
        b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기', drag: (w2) => { const a = pt(clamp(Math.round(w2.x * 4) / 4, -2.5, 2.5), clamp(Math.round(w2.y * 4) / 4, -5.2, -1.6)); s.qbPa = a; if (anyOn(s)) s.qbPd = pt(a.x + 7, a.y); } });
      }
      const cap = cx.review ? (f < 0 ? '조건이 하나도 없으면 평행사변형이 되지 않아요' : `${CHIPS[f].slice(2)} → 평행사변형`) : !anyOn(s) ? '조건이 없어요 → 꼭짓점을 끌면 모양이 마음대로 바뀌어요' : M.isPara ? '켠 조건이 있어서 끌어도 평행사변형이에요' : '조건을 켰다 끄면 모양이 바뀌어요';
      capLine(b, pt(3.5, 0), cap, M.isPara ? 'green' : 'rose', { dy: 44 });
    },
    steps: (M) => {
      const f = M.first;
      const T0 = ['사각형 ABCD에서 AB∥DC이고 AD∥BC이면 평행사변형의 정의 그대로예요.', '대각선 AC를 그으면 AB=CD, BC=DA, AC 공통이므로 △ABC ≡ △CDA (SSS 합동)이에요.', '사각형의 내각의 합은 360°이므로 ∠A=∠C, ∠B=∠D에서 2(∠A+∠B)=360°, 즉 ∠A+∠B=180°이에요.', '두 대각선의 교점을 O라 하면 OA=OC, OB=OD, ∠AOB=∠COD(맞꼭지각)이므로 △AOB ≡ △COD (SAS 합동)이에요.', 'AD∥BC에서 ∠DAC=∠BCA(엇각), AD=BC, AC 공통이므로 △ADC ≡ △CBA (SAS 합동)이에요.'];
      const T1 = ['AB∥DC, AD∥BC이므로 두 쌍의 대변이 평행해요.', '합동이므로 ∠BAC=∠DCA(엇각)이 같아져 AB∥DC이고, ∠BCA=∠DAC(엇각)이 같아져 AD∥BC예요.', '∠B=∠EAD(동위각)이 같아져 AD∥BC이고, 같은 방법으로 AB∥DC예요.', '합동이므로 ∠OAB=∠OCD(엇각)이 같아져 AB∥DC, 같은 방법으로 AD∥BC예요.', '합동이므로 ∠DCA=∠BAC(엇각)이 같아져 AB∥DC예요.'];
      if (f < 0) return ['지금은 켠 조건이 없어요. 칩에서 ①~⑤ 중 하나를 켜 보세요.', '조건이 없으면 꼭짓점 D를 끌 때 모양이 마음대로 바뀌어요.', '평행사변형이 되려면 ①~⑤ 중 하나가 필요해요.'];
      return [T0[f], T1[f], '두 쌍의 대변이 각각 평행하므로 □ABCD는 평행사변형이에요. (평행사변형의 정의)'];
    },
    view: (M) => {
      const n = M.on.filter(Boolean).length;
      return {
        guide: '칩에서 <b>조건을 켜고</b> <b>노란 점 D</b>(또는 A)를 끌어 보세요. 조건이 켜져 있으면 <b>끌어도 평행사변형이 유지</b>되고, 모두 끄면 모양이 무너져요.',
        readouts: [rd('켠 조건', `${n}개`, n ? 'green' : 'rose'), rd('지금 사각형', M.isPara ? '평행사변형' : '평행사변형이 아니에요', M.isPara ? 'green' : 'rose', '', null, true)],
        formula: '<p>평행사변형이 되는 조건</p><p>① 두 쌍의 대변이 각각 평행 ② 두 쌍의 대변의 길이가 각각 같다</p><p>③ 두 쌍의 대각의 크기가 각각 같다 ④ 두 대각선이 서로 다른 것을 이등분한다</p><p>⑤ 한 쌍의 대변이 평행하고 그 길이가 같다</p>',
        rule: '평행사변형이 되는 조건은 5가지이다. (정의 ①, 성질을 거꾸로 한 ②③④, 그리고 ⑤)',
        notes: notes('⑤는 <b>평행한 바로 그 변</b>의 길이가 같아야 해요. 평행한 변과 다른 쌍의 길이가 같은 것은 조건이 아니에요.', '모두 <b>두 쌍</b>이어야 해요. 한 쌍만 같거나 한 대각선만 이등분하는 것은 조건이 아니에요.')
      };
    },
    prob: (M, s) => condProb(s, '평행사변형이 되는 조건')
  };

  /* ====================================================================== 2. 한 쌍 평행 + 길이 같음 */
  const para5 = {
    id: 'q2-2', title: '[함정] 한 쌍의 대변이 평행하고 그 길이가 같다', short: '평행+길이 같음',
    question: 'AD∥BC인 사각형 ABCD에서 평행한 변 AD와 BC의 길이가 같으면 어떻게 될까? 길이가 다르면?',
    ctl: ['qbLen', 'qbBc', 'qbH'],
    init: (s) => { s.qbLen = 5; s.qbBc = 5; s.qbH = 4; s.qbK = 0; s.qbBeta = 66; s.qbPk = null; },
    reroll: (s) => { const a = rint(4, 8); s.qbLen = a; s.qbBc = a; s.qbH = rint(3, 5); s.qbK = rint(0, 1); s.qbBeta = pick([50, 56, 62, 70, 76, 110, 116, 122], s.qbBeta); },
    model: (s) => {
      const ad = ci(s.qbLen, 3, 9), bc = ci(s.qbBc, 3, 9), h = ci(s.qbH, 3, 5), x0 = 1.2;
      const A = pt(x0, -h), B = pt(0, 0), C = pt(bc, 0), D = pt(x0 + ad, -h);
      const beta = ci(s.qbBeta, 50, 130), pg = para(bc, 4, beta);
      return { ad, bc, h, A, B, C, D, eq: ad === bc, pts: [A, B, C, D], O: mid(A, C), K: s.qbK || 0, beta, pg, per: 2 * (bc + 4) };
    },
    draw(b, s, M, cx) {
      if (cx.problem) { drawProb52(b, M); return; }
      const rv = cx.review, bc = M.bc;
      const ad = rv ? bc : M.ad, A = M.A, B = M.B, C = M.C, D = rv ? pt(A.x + bc, A.y) : M.D, pts = [A, B, C, D], O = mid(A, C), st = cx.step, eq = ad === bc;
      fit(b, { x0: -0.4, x1: 1.2 + 9.4, y0: -5.4, y1: 0 }, { t: 40, b: 70, l: 46, r: 46 });
      fillPoly(b, pts, eq ? 'green' : 'rose', 0.1); poly(b, pts, 'ink', 3.4);
      par(b, A, D, 1, 'green', 0.26); par(b, B, C, 1, 'green', 0.26);
      if (eq || rv) { tick(b, A, D, 3); tick(b, B, C, 3); }
      if (rv && st >= 1) line(b, A, C, 'green', 2.8, { dash: [8, 5] });
      if (rv && st >= 2) { ang(b, A, D, C, { color: 'sky', rings: 1, r: 26 }); ang(b, C, B, A, { color: 'sky', rings: 1, r: 26 }); fillPoly(b, [A, D, C], 'amber', 0.14); fillPoly(b, [C, B, A], 'amber', 0.14); }
      if (rv && st >= 3) { ang(b, C, D, A, { color: 'rose', rings: 2, r: 34 }); ang(b, A, B, C, { color: 'rose', rings: 2, r: 34 }); par(b, A, B, 2, 'green'); par(b, D, C, 2, 'green'); }
      if (!rv) { sd(b, A, D, O, `${ad}`, 'amber'); sd(b, B, C, O, `${bc}`, 'sky'); }
      if (!rv && eq) { par(b, A, B, 2, 'green'); par(b, D, C, 2, 'green'); }
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, k, { size: 17, gap: 11 }); });
      if (!rv) {
        b.handle('D', D, { color: 'amber', r: 8, ariaLabel: '꼭짓점 D 가로로 끌기', drag: (w2) => { s.qbLen = clamp(Math.round(w2.x - A.x), 3, 9); } });
        b.handle('C', C, { color: 'sky', r: 8, ariaLabel: '꼭짓점 C 가로로 끌기', drag: (w2) => { s.qbBc = clamp(Math.round(w2.x), 3, 9); } });
      }
      const cap = rv ? ['AD∥BC, AD=BC 이고 대각선 AC를 그어요', '∠DAC=∠BCA (엇각)', `△ADC ≡ △CBA (SAS) → ∠DCA=∠BAC → AB∥DC`][clamp(st, 1, 3) - 1] : eq ? `AD∥BC이고 AD=BC=${bc} → 평행사변형이에요` : `AD=${ad}, BC=${bc}: 길이가 다르면 평행사변형이 아니에요(사다리꼴)`;
      capLine(b, pt(5, 0), cap, rv || eq ? 'green' : 'rose', { dy: 44 });
    },
    stepT: () => 0,
    steps: (M) => [
      `AD∥BC이고 AD=BC=${M.bc}인 사각형 ABCD에 대각선 AC를 그어요.`,
      'AD∥BC이므로 ∠DAC=∠BCA(엇각)이에요.',
      `△ADC와 △CBA에서 AD=CB, ∠DAC=∠BCA, AC는 공통이므로 △ADC ≡ △CBA (SAS 합동)이에요. 그래서 ∠DCA=∠BAC(엇각)이 같아 AB∥DC이고, 두 쌍의 대변이 각각 평행하므로 평행사변형이에요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 D</b>와 <b>파란 점 C</b>를 가로로 끌어 AD, BC의 길이를 바꿔 보세요. <b>AD=BC</b>일 때만 AB∥DC가 되어 평행사변형이 돼요.',
      readouts: [rd('AD', `${M.ad}`, 'amber'), rd('BC', `${M.bc}`, 'sky'), rd('AD와 BC', M.eq ? '같아요' : '달라요', M.eq ? 'green' : 'rose'), rd('사각형 ABCD', M.eq ? '평행사변형' : '사다리꼴', M.eq ? 'green' : 'rose', '', null, true)],
      formula: `<p>$${ll('AD')}\\parallel${ll('BC')}$, $${ll('AD')}=${ll('BC')}=${M.bc}$</p><p>$${tri('ADC')}\\equiv${tri('CBA')}$ (SAS 합동) → $${ll('AB')}\\parallel${ll('DC')}$</p>`,
      rule: '한 쌍의 대변이 평행하고 그 길이가 같은 사각형은 평행사변형이다',
      notes: notes('<b>평행한 변</b>(AD, BC)의 길이가 같아야 해요. AB=DC처럼 평행하지 않은 변의 길이가 같은 것은 안 돼요(등변사다리꼴).', '엇각이 같고 공통변 AC가 있으므로 SAS 합동이 돼요.')
    }),
    prob: (M) => {
      const { beta, pg } = M;
      if (M.K === 0) return { tag: '한 쌍 평행 + 길이 같음', key: `p0_${beta}`, stem: `사각형 ABCD에서 AD∥BC이고 AD=BC이다. ∠B=${beta}°일 때, ∠D의 크기 x는?`, choices: mkChoices(beta, [[180 - beta, '∠B와 ∠D는 마주 보는 각이에요. 평행사변형이므로 같아요.'], [90, '직사각형이 아니에요.'], [360 - 2 * beta, '네 각의 합에서 뺀 값이에요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      void pg;
      return { tag: '한 쌍 평행 + 길이 같음', key: `p1_${M.bc}`, stem: `사각형 ABCD에서 AD∥BC이고 AD=BC=${M.bc}, AB=4이다. 사각형 ABCD의 둘레의 길이는?`, choices: mkChoices(M.per, [[M.bc + 4, '두 변만 더했어요.'], [2 * M.bc + 4, 'AB도 두 번 더해야 해요. 평행사변형이므로 CD=AB예요.'], [M.bc * 4, 'AB를 BC로 잘못 봤어요.'], [M.bc + 8, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 2 }) };
    }
  };
  function drawProb52(b, M) {
    const pg = M.pg, { A, B, C, D, O } = pg;
    fit(b, bboxOf(pg.pts), { t: 40, b: 44, l: 46, r: 46 });
    fillPoly(b, pg.pts, 'sky', 0.1); poly(b, pg.pts, 'ink', 3.4);
    par(b, A, D, 1, 'green', 0.26); par(b, B, C, 1, 'green', 0.26); tick(b, A, D, 3); tick(b, B, C, 3);
    if (M.K === 0) { ang(b, B, C, A, { color: 'sky', rings: 1, r: 26, label: dg(M.beta), size: 16, labelDist: 56 }); ang(b, D, A, C, { color: 'rose', rings: 1, r: 28, label: 'x', size: 18, labelDist: 52 }); }
    else { sd(b, B, C, O, `${M.bc}`, 'sky'); sd(b, A, B, O, '4', 'sky'); }
    [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, k, { size: 17, gap: 11 }); });
  }

  /* ====================================================================== 3. 숨은 평행사변형 */
  const hidden = {
    id: 'q2-3', title: '평행사변형 속의 평행사변형', short: '숨은 평행사변형',
    question: '평행사변형 ABCD의 꼭짓점 B, D에서 대각선 AC에 수선을 그으면(발 E, F) 사각형 EBFD는 어떤 사각형일까?',
    ctl: ['qbL', 'qbE', 'qbHb'],
    init: (s) => { s.qbL = 12; s.qbE = 2; s.qbHb = 3; s.qbK = 0; },
    reroll: (s) => { s.qbL = rint(8, 14); s.qbE = rint(1, 3); s.qbHb = rint(2, 4); s.qbK = rint(0, 1); },
    model: (s) => {
      const L = ci(s.qbL, 8, 14), e = ci(s.qbE, 1, 3), h = ci(s.qbHb, 2, 4);
      const A = pt(0, 0), C = pt(L, 0), B = pt(e, h), D = pt(L - e, -h), E = pt(e, 0), F = pt(L - e, 0);
      return { L, e, h, ef: L - 2 * e, A, B, C, D, E, F, O: mid(A, C), K: s.qbK || 0 };
    },
    draw(b, s, M, cx) {
      const { A, B, C, D, E, F, O } = M, pts = [A, B, C, D], st = cx.step;
      fit(b, { x0: -0.2, x1: M.L + 0.2, y0: -4.2, y1: 4.2 }, { t: 30, b: 74, l: 40, r: 40 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4);
      parAll(b, { A, B, C, D });
      line(b, A, C, 'ink', 2.6);
      line(b, B, E, 'amber', 3.4); line(b, D, F, 'amber', 3.4);
      b.right(E, A, B, { size: 11, color: 'amber' }); b.right(F, C, D, { size: 11, color: 'amber' });
      if (cx.problem) {
        if (M.K === 0) { dimLine(b, A, C, 46, `${M.L}`, 'sky'); segTag(b, E, F, 0.5, `${M.ef}`, -16, 'sky'); segTag(b, A, E, 0.5, 'x', -16, 'rose', { size: 18 }); }
        else { segTag(b, A, E, 0.5, `${M.e}`, -16, 'sky'); segTag(b, E, F, 0.5, 'x', -18, 'rose', { size: 18 }); dimLine(b, A, C, 46, `${M.L}`, 'sky'); }
      } else {
        const showSq = !cx.review || st >= 3;
        if (showSq) { fillPoly(b, [E, B, F, D], 'green', 0.2); poly(b, [E, B, F, D], 'green', 3.2); }
        if (cx.review ? st >= 2 : true) { tick(b, A, E, 1, 'rose'); tick(b, F, C, 1, 'rose'); tick(b, B, E, 2, 'rose'); tick(b, D, F, 2, 'rose'); }
        segTag(b, A, E, 0.5, `${M.e}`, 14, 'rose'); segTag(b, F, C, 0.5, `${M.e}`, 14, 'rose'); segTag(b, E, F, 0.5, `${M.ef}`, -14, 'sky');
        segTag(b, B, E, 0.5, `${M.h}`, -14, 'sky'); segTag(b, D, F, 0.5, `${M.h}`, 14, 'sky');
      }
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, k, { size: 17, gap: 11 }); });
      [['E', E, 'amber'], ['F', F, 'amber']].forEach(([k, q, c]) => { b.point(q, { color: c, r: 4.5 }); const sh = cx.problem ? 14 : 6; T(b, q, k, { dx: k === 'E' ? sh : 6, dy: k === 'E' ? -16 : 16, size: 17, color: c }); });
      if (cx.problem) return;
      if (!cx.review) b.handle('E', E, { color: 'amber', r: 8, ariaLabel: '점 E 가로로 끌기', drag: (w2) => { s.qbE = clamp(Math.round(w2.x), 1, 3); } });
      const cap = cx.review ? ['BE⊥AC, DF⊥AC → BE∥DF', `△ABE ≡ △CDF (RHA) → BE=DF=${M.h}, AE=CF=${M.e}`, '□EBFD: 한 쌍의 대변이 평행하고 길이가 같다 → 평행사변형'][clamp(st, 1, 3) - 1] : `AE=CF=${M.e}, EF=${M.ef} · BE∥DF, BE=DF=${M.h} → □EBFD 평행사변형`;
      capLine(b, pt(M.L / 2, 4.2), cap, 'amber', { dy: 34 });
    },
    steps: (M) => [
      'BE⊥AC, DF⊥AC이므로 BE∥DF예요(같은 직선에 수직인 두 직선은 평행).',
      `△ABE와 △CDF에서 ∠AEB=∠CFD=90°, AB=CD, ∠BAE=∠DCF(엇각)이므로 △ABE ≡ △CDF (RHA 합동)이에요. 그래서 BE=DF=${M.h}, AE=CF=${M.e}예요.`,
      `사각형 EBFD에서 BE∥DF이고 BE=DF=${M.h}이므로 한 쌍의 대변이 평행하고 그 길이가 같아 평행사변형이에요. (EF=AC−2AE=${M.L}−${2 * M.e}=${M.ef})`
    ],
    view: (M) => ({
      guide: '<b>노란 점 E</b>를 가로로 끌거나 막대로 AC, AE, BE를 바꿔 보세요. <b>AE=CF</b>, <b>BE=DF</b>이므로 사각형 EBFD는 항상 평행사변형이에요.',
      readouts: [rd('AE = CF', `${M.e} = ${M.e}`, 'rose'), rd('BE = DF', `${M.h} = ${M.h}`, 'rose'), rd('EF', `${M.ef}`, 'sky', `${M.L} − 2×${M.e}`), rd('□EBFD', '평행사변형', 'green', '', null, true)],
      formula: `<p>$${tri('ABE')}\\equiv${tri('CDF')}$ (RHA 합동)</p><p>$${ll('BE')}\\parallel${ll('DF')}$, $${ll('BE')}=${ll('DF')}=${M.h}$ → □EBFD는 평행사변형</p><p>$${ll('EF')}=${ll('AC')}-2\\times${ll('AE')}=${M.L}-2\\times${M.e}=${M.ef}$</p>`,
      rule: '평행사변형의 대각선에 두 꼭짓점에서 내린 수선의 발과 그 두 꼭짓점을 이으면 평행사변형이 된다 (판정 ⑤)',
      notes: notes('수선의 발 E, F는 대각선 AC <b>위</b>에 있고, 평행사변형 EBFD의 대각선은 EF와 BD예요.', 'AE=CF를 쓰면 EF=AC−2AE로 구할 수 있어요.')
    }),
    prob: (M) => {
      if (M.K === 0) return { tag: '합동으로 길이 구하기', key: `h0_${M.L}_${M.ef}`, stem: `평행사변형 ABCD의 꼭짓점 B, D에서 대각선 AC에 내린 수선의 발을 각각 E, F라 하자. AC=${M.L}, EF=${M.ef}일 때, AE의 길이 x는?`, choices: mkChoices(M.e, [[M.L - M.ef, 'AE+CF의 값이에요. AE=CF이므로 절반이에요.'], [M.ef, 'EF의 길이예요.'], [M.L, 'AC 전체예요.'], [M.e + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
      return { tag: '합동으로 길이 구하기', key: `h1_${M.L}_${M.e}`, stem: `평행사변형 ABCD의 꼭짓점 B, D에서 대각선 AC에 내린 수선의 발을 각각 E, F라 하자. AC=${M.L}, AE=${M.e}일 때, EF의 길이 x는?`, choices: mkChoices(M.ef, [[M.L - M.e, 'AE를 한 번만 뺐어요. CF=AE이므로 두 번 빼야 해요.'], [M.e, 'AE의 길이예요.'], [M.L, 'AC 전체예요.'], [M.L - M.e * 2 + 1, '값을 다시 확인해 보세요.']], { tex: (v) => `${v}`, plain: (v) => `${v}`, pad: 1 }) };
    }
  };

  /* ====================================================================== 4. 증명 빈칸 채우기 */
  const proof = {
    id: 'q2-4', title: '두 쌍의 대각이 같으면 평행사변형 (증명)', short: '증명 빈칸',
    question: '두 쌍의 대각이 각각 같은 사각형 ABCD가 평행사변형임을 설명해 보자. 빈칸에는 무엇이 들어갈까?',
    ctl: ['qbA', 'qbW', 'qbS'],
    init: (s) => { s.qbA = 66; s.qbW = 8; s.qbS = 4; s.qbK = 0; },
    reroll: (s) => { s.qbA = pick([50, 56, 62, 70, 76, 110, 116, 122, 128], s.qbA); s.qbW = rint(6, 10); s.qbS = rint(3, 5); s.qbK = rint(0, 1); },
    model: (s) => {
      const a = ci(s.qbA, 50, 130), w = ci(s.qbW, 6, 10), sd0 = ci(s.qbS, 3, 5), beta = 180 - a, pg = para(w, sd0, beta);
      const E = add(pg.A, mul(unit(sub(pg.A, pg.B)), 1.7));
      return { a, beta, w, s: sd0, pg, E, K: a === 90 ? 0 : (s.qbK || 0) };
    },
    draw(b, s, M, cx) {
      const pg = M.pg, { A, B, C, D, O } = pg, pts = pg.pts, st = cx.step, E = M.E;
      fit(b, bboxOf(pts.concat([E])), { t: 40, b: 64, l: 46, r: 46 });
      fillPoly(b, pts, 'sky', 0.1); poly(b, pts, 'ink', 3.4); line(b, A, E, 'ink', 3.4);
      const k = (cx.problem ? 3 : st);
      if (k >= 1) { ang(b, A, B, D, { color: 'sky', rings: 1, r: 28, label: cx.problem ? dg(M.a) : st >= 2 ? dg(M.a) : '', size: 15, labelDist: 54 }); ang(b, C, D, B, { color: 'sky', rings: 1, r: 28, label: '' }); ang(b, B, C, A, { color: 'rose', rings: 2, r: 28, label: cx.problem ? (M.K === 1 ? dg(M.beta) : '') : st >= 2 ? dg(M.beta) : '', size: 15, labelDist: 54 }); ang(b, D, A, C, { color: 'rose', rings: 2, r: 28 }); }
      if (k >= 3) { ang(b, A, E, D, { color: 'green', rings: 3, r: 32, label: cx.problem && M.K === 0 ? 'x' : st >= 4 ? dg(M.beta) : '', size: 17, labelColor: cx.problem ? 'rose' : 'green', labelDist: 50 }); }
      if (k >= 4 && !cx.problem) { ang(b, B, C, A, { color: 'green', rings: 3, r: 22 }); par(b, A, D, 1, 'green'); par(b, B, C, 1, 'green'); }
      [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([nm, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, nm, { size: 17, gap: 11 }); });
      b.point(E, { color: 'ink', r: 4.5 }); tagOut(b, E, A, 'E', { size: 17 });
      if (!cx.review && !cx.problem) b.handle('A', A, { color: 'amber', r: 8, ariaLabel: '꼭짓점 A 끌기(∠A 바꾸기)', drag: (w2) => { const aa = 180 - Math.atan2(-(w2.y - B.y), w2.x - B.x) / DEG; s.qbA = clamp(Math.round(aa / 2) * 2, 50, 130); } });
      if (cx.problem) return;
      const cap = cx.review ? ['조건: ∠A=∠C, ∠B=∠D', '2(∠A+∠B)=360° → ∠A+∠B=180° ㉠', '∠A+∠EAD=180° ㉡', '㉠, ㉡에서 ∠B=∠EAD (동위각) → AD∥BC'][clamp(st, 1, 4) - 1] : `∠A=∠C=${M.a}°, ∠B=∠D=${M.beta}° → ∠A+∠B=180°`;
      capLine(b, pt((Math.min(B.x, A.x, E.x) + Math.max(C.x, D.x)) / 2, 0), cap, 'amber', { dy: 44 });
    },
    steps: (M) => [
      `조건에서 ∠A=∠C=${M.a}°, ∠B=∠D=${M.beta}°예요.`,
      `∠A+∠B+∠C+∠D=360°이므로 2(∠A+∠B)=360°, 즉 ∠A+∠B=${M.a}°+${M.beta}°=180° … ㉠`,
      `AB의 연장선 위에 한 점 E를 잡으면 ∠A+∠EAD=180° … ㉡`,
      `㉠, ㉡에서 ∠B=∠EAD=${M.beta}°예요. 동위각의 크기가 같으므로 AD∥BC이고, 같은 방법으로 AB∥DC예요. 두 쌍의 대변이 각각 평행하므로 □ABCD는 평행사변형이에요.`
    ],
    view: (M) => ({
      guide: '<b>노란 점 A</b>를 끌거나 막대로 ∠A를 바꿔 보세요. 두 쌍의 대각이 각각 같으면 ∠A+∠B는 늘 <b>180°</b>이고, 연장선과 만드는 ∠EAD는 ∠B와 같아져요.',
      readouts: [rd('∠A = ∠C', `${M.a}°`, 'sky'), rd('∠B = ∠D', `${M.beta}°`, 'rose'), rd('∠A + ∠B', '180°', 'amber', `${M.a}°+${M.beta}°`), rd('∠EAD', `${M.beta}°`, 'green', '= ∠B (동위각)', null, true)],
      formula: `<p>$2(${an('A')}+${an('B')})=360^{\\circ}$ → $${an('A')}+${an('B')}=180^{\\circ}$ … ㉠</p><p>$${an('A')}+${an('EAD')}=180^{\\circ}$ … ㉡</p><p>㉠, ㉡에서 $${an('B')}=${an('EAD')}=${M.beta}^{\\circ}$ (동위각) → $${ll('AD')}\\parallel${ll('BC')}$</p>`,
      rule: '두 쌍의 대각의 크기가 각각 같은 사각형은 평행사변형이다 (사각형의 내각의 합 360° + 동위각)',
      notes: notes('㉠과 ㉡을 비교하면 <b>∠B=∠EAD</b>가 나와요. ∠B와 ∠EAD는 직선 AB가 AD, BC와 만드는 동위각이에요.', '증명 문제의 빈칸은 풀이 순서(조건 → 내각의 합 → 연장선 → 동위각)대로 채워요.')
    }),
    prob: (M, s) => {
      const a = M.a, K = M.K;
      if (K === 0) return { tag: '증명 빈칸 · 연장선의 각', key: `r0_${a}`, stem: `사각형 ABCD에서 ∠A=∠C, ∠B=∠D이고 ∠A=${a}°이다. 변 BA의 연장선 위의 점 E에 대하여 ∠EAD의 크기 x는?`, choices: mkChoices(180 - a, [[a, '∠A 자신이에요. ∠A+∠EAD=180°예요.'], [90, '직각이 아니에요.'], [360 - 2 * a, '∠A+∠B+∠C+∠D에서 ∠A, ∠C만 뺐어요. ∠EAD=180°−∠A예요.']], { valid: (v) => v > 0 && v < 180, pad: 6 }) };
      const ask = ['EAD', 'BAD', 'BCD', 'ADC', 'ABC'];
      void ask;
      const items = [{ h: '$\\angle EAD$', ok: true, hint: '' }, { h: '$\\angle BAD$', hint: '∠BAD=∠A는 ∠B와 같지 않아요. 연장선과 만드는 각을 찾아야 해요.' }, { h: '$\\angle BCD$', hint: '∠BCD=∠C=∠A는 ∠B와 같지 않아요.' }, { h: '$\\angle DAC$', hint: '대각선 AC는 이 그림에 그려져 있지 않아요.' }, { h: '$\\angle AED$', hint: '이 각은 ∠B와 같다고 할 수 없어요.' }];
      items.splice(3, 1, { h: '$\\angle EAB$', hint: '∠EAB는 평각(180°)이에요.' });
      return { tag: '증명 빈칸 · 동위각', key: `r1_${a}`, html: `사각형 ABCD에서 ∠A=∠C=${a}°, ∠B=∠D=${180 - a}°이다. 변 BA의 연장선 위의 점 E를 잡았을 때, ∠A+∠EAD=180°이므로 ∠B=∠(  )이고 동위각의 크기가 같으므로 AD∥BC이다. (  ) 안에 알맞은 것은?`, choices: mkTextChoices(items, s.qdOrd), wide: false };
    }
  };

  /* ====================================================================== 5~9. 안 되는 경우(반례) */
  // 공통 틀: cfg = { id, title, short, question, ctl[], init(s), reroll(s), build(s)→M(pts…), marks(b,M), bad(b,M,st), cap(M,st), steps(M), read(M), formula(M), rule, notes[], falseId, ... }
  function counter(cfg) {
    return {
      id: cfg.id, title: cfg.title, short: cfg.short, question: cfg.question, ctl: cfg.ctl, presets: cfg.presets,
      init: (s) => { cfg.init(s); s.qbPk = null; }, reroll: (s) => { cfg.reroll(s); s.qbPk = newCondPk(cfg.falseId); },
      model: (s) => { const M = cfg.build(s); M.pts = M.pts || [M.A, M.B, M.C, M.D]; M.O = M.O || crossO(M.A, M.B, M.C, M.D); return M; },
      draw(b, s, M, cx) {
        if (cx.problem) { drawCondProb(b); return; }
        const { A, B, C, D, O, pts } = M, st = cx.step;
        fit(b, bboxOf(pts), { t: 40, b: 74, l: 46, r: 46 });
        fillPoly(b, pts, 'rose', 0.1); poly(b, pts, 'ink', 3.4);
        cfg.marks(b, M);
        if (st >= 2) cfg.bad(b, M, st);
        [['A', A], ['B', B], ['C', C], ['D', D]].forEach(([k, q]) => { b.point(q, { color: 'ink', r: 4.5 }); tagOut(b, q, O, k, { size: 17, gap: 11 }); });
        if (cfg.handles && !cx.review) cfg.handles(b, s, M);
        capLine(b, pt(bboxOf(pts).x0 / 2 + bboxOf(pts).x1 / 2, bboxOf(pts).y1), cx.review ? cfg.capR(M, st) : cfg.cap(M), 'rose', { dy: 46 });
      },
      steps: (M) => cfg.steps(M),
      view: (M) => ({ guide: cfg.guide, readouts: cfg.read(M), formula: cfg.formula(M), rule: cfg.rule, notes: notes(...cfg.notes) }),
      prob: (M, s) => condProb(s, '평행사변형이 되는 조건', cfg.falseId)
    };
  }
  const mkP = (A, B, C, D) => ({ A, B, C, D });

  // 5. 등변사다리꼴: AD∥BC, AB=DC (AD≠BC)
  const cTrap = counter({
    id: 'q2-5', title: '[함정] AD∥BC이고 AB=DC → 평행사변형?', short: '반례 ① 등변사다리꼴', falseId: 'f1',
    question: '한 쌍의 대변이 평행하고(AD∥BC) 다른 한 쌍의 대변의 길이가 같으면(AB=DC) 평행사변형일까?',
    ctl: ['qbTa', 'qbTb', 'qbTh'],
    init: (s) => { s.qbTa = 4; s.qbTb = 10; s.qbTh = 4; },
    reroll: (s) => { s.qbTa = rint(3, 6); s.qbTb = rint(8, 12); s.qbTh = rint(3, 5); },
    build: (s) => { const a = ci(s.qbTa, 3, 6), bb = ci(s.qbTb, 8, 12), h = ci(s.qbTh, 3, 5), x = (bb - a) / 2; return { ...mkP(pt(x, -h), pt(0, 0), pt(bb, 0), pt(x + a, -h)), a, bb, h }; },
    marks(b, M) { par(b, M.A, M.D, 1, 'green'); par(b, M.B, M.C, 1, 'green'); tick(b, M.A, M.B, 1); tick(b, M.D, M.C, 1); sd(b, M.A, M.D, M.O, `${M.a}`, 'amber'); sd(b, M.B, M.C, M.O, `${M.bb}`, 'sky'); },
    bad(b, M) { fillPoly(b, M.pts, 'rose', 0.12); },
    handles(b, s, M) { b.handle('D', M.D, { color: 'amber', r: 8, ariaLabel: '꼭짓점 D 가로로 끌기', drag: (w2) => { s.qbTa = clamp(Math.round(2 * (w2.x - M.bb / 2)), 3, 6); } }); },
    guide: '막대나 <b>노란 점 D</b>(가로로)를 움직여 보세요. AD∥BC이고 AB=DC인데도 AD와 BC의 길이가 달라서 <b>AB와 DC가 평행하지 않아요</b>. 이 사각형은 등변사다리꼴이에요.',
    cap: (M) => `AD∥BC, AB=DC 이지만 AD=${M.a} ≠ BC=${M.bb} → 평행사변형이 아니에요`,
    capR: (M, st) => ['AD∥BC이고 AB=DC (조건은 만족)', `그런데 AD=${M.a}, BC=${M.bb}로 길이가 달라요`, '등변사다리꼴이 반례 → 평행사변형이 아니에요'][clamp(st, 1, 3) - 1],
    steps: (M) => ['AD∥BC이고 AB=DC인 사각형을 그려요. 조건은 만족해요.', `평행한 변 AD=${M.a}, BC=${M.bb}의 길이가 달라요. 평행한 바로 그 변의 길이가 같아야 해요.`, `이 사각형은 등변사다리꼴이에요. 반례가 있으므로 "AD∥BC, AB=DC이면 평행사변형이다"는 거짓이에요.`],
    read: (M) => [rd('AD', `${M.a}`, 'amber'), rd('BC', `${M.bb}`, 'sky'), rd('AD와 BC', '달라요', 'rose'), rd('사각형 ABCD', '등변사다리꼴', 'rose', '평행사변형이 아니에요', null, true)],
    formula: (M) => `<p>$${ll('AD')}\\parallel${ll('BC')}$, $${ll('AB')}=${ll('DC')}$ 이지만 $${ll('AD')}=${M.a}\\ne${ll('BC')}=${M.bb}$</p><p>→ 등변사다리꼴 (평행사변형이 아니다)</p>`,
    rule: '평행한 변이 아닌 다른 쌍의 변의 길이가 같은 것은 평행사변형이 되는 조건이 아니다 (반례: 등변사다리꼴)',
    notes: ['판정 ⑤는 <b>평행한 변(AD, BC)의 길이가 같아야</b> 해요. AB=DC는 평행하지 않은 변이에요.', '평행사변형이 되는 경우는 AD=BC일 때뿐이에요.']
  });

  // 6. 연 모양: AC⊥BD 이지만 OA≠OC
  const cKite = counter({
    id: 'q2-6', title: '[함정] 두 대각선이 수직이면 마름모? → 연 모양', short: '반례 ② 연 모양', falseId: 'f4',
    question: '사각형 ABCD에서 두 대각선이 수직(AC⊥BD)이면 평행사변형(마름모)일까?',
    ctl: ['qbK1', 'qbK2', 'qbKq'],
    init: (s) => { s.qbK1 = 3; s.qbK2 = 6; s.qbKq = 4; },
    reroll: (s) => { s.qbK1 = rint(2, 4); s.qbK2 = rint(5, 7); s.qbKq = rint(3, 5); },
    build: (s) => { const p1 = ci(s.qbK1, 2, 4), p2 = ci(s.qbK2, 5, 7), q = ci(s.qbKq, 3, 5); return { ...dq(p1, p2, q, q, 90), p1, p2, q }; },
    marks(b, M) { line(b, M.A, M.C, 'ink', 2.4); line(b, M.B, M.D, 'ink', 2.4); b.right(M.O, M.A, M.B, { size: 11, color: 'amber' }); tick(b, M.B, M.O, 2); tick(b, M.O, M.D, 2); segTag(b, M.A, M.O, 0.5, `${M.p1}`, 14, 'amber'); segTag(b, M.O, M.C, 0.5, `${M.p2}`, 14, 'sky'); segTag(b, M.B, M.O, 0.5, `${M.q}`, -14, 'green'); segTag(b, M.O, M.D, 0.5, `${M.q}`, -14, 'green'); dotO(b, M); },
    bad(b, M) { tick(b, M.A, M.B, 1, 'rose'); tick(b, M.A, M.D, 1, 'rose'); tick(b, M.C, M.B, 3, 'rose'); tick(b, M.C, M.D, 3, 'rose'); },
    guide: '막대로 OA, OC를 바꿔 보세요. AC⊥BD이고 OB=OD인데 <b>OA≠OC</b>라서 AC가 이등분되지 않아요. 이웃한 변끼리 같은 <b>연 모양 사각형</b>이에요.',
    cap: (M) => `AC⊥BD 이지만 OA=${M.p1} ≠ OC=${M.p2} → 평행사변형이 아니에요`,
    capR: (M, st) => ['AC⊥BD (조건은 만족)', `OB=OD=${M.q}이지만 OA=${M.p1}, OC=${M.p2}로 달라요`, '연 모양 사각형(AB=AD, CB=CD)이 반례예요'][clamp(st, 1, 3) - 1],
    steps: (M) => ['두 대각선이 수직(AC⊥BD)인 사각형을 그려요. 조건은 만족해요.', `대각선 BD는 AC를 이등분하지 않아요. OA=${M.p1}, OC=${M.p2}로 달라요. 평행사변형이 되려면 OA=OC, OB=OD여야 해요.`, '이웃한 두 쌍의 변만 같은 연 모양 사각형이 반례예요. "AC⊥BD이면 평행사변형(마름모)이다"는 거짓이에요.'],
    read: (M) => [rd('OA', `${M.p1}`, 'amber'), rd('OC', `${M.p2}`, 'sky'), rd('OB = OD', `${M.q}`, 'green'), rd('사각형 ABCD', '연 모양', 'rose', '평행사변형이 아니에요', null, true)],
    formula: (M) => `<p>$${ll('AC')}\\perp${ll('BD')}$, $${ll('OB')}=${ll('OD')}=${M.q}$ 이지만 $${ll('OA')}=${M.p1}\\ne${ll('OC')}=${M.p2}$</p><p>→ 연 모양 사각형 (평행사변형이 아니다)</p>`,
    rule: '두 대각선이 수직인 것만으로는 평행사변형이 되지 않는다 (반례: 연 모양 사각형). 서로 이등분하는 것이 조건이다',
    notes: ['"평행사변형에서 AC⊥BD이면 마름모"는 참이지만, "사각형에서 AC⊥BD"는 거짓이에요.', '평행사변형이 되려면 <b>OA=OC, OB=OD</b> 둘 다 필요해요.']
  });

  // 7. 대각선의 길이만 같음 → 등변사다리꼴
  const cDiag = counter({
    id: 'q2-7', title: '[함정] 두 대각선의 길이가 같으면 직사각형? → 등변사다리꼴', short: '반례 ③ 대각선 길이 같음', falseId: 'f3',
    question: '사각형 ABCD에서 두 대각선의 길이가 같으면(AC=BD) 직사각형(평행사변형)일까?',
    ctl: ['qbM', 'qbN', 'qbTh2'],
    init: (s) => { s.qbM = 3; s.qbN = 6; s.qbTh2 = 70; },
    reroll: (s) => { s.qbM = rint(2, 4); s.qbN = rint(5, 7); s.qbTh2 = pick([60, 70, 80, 100, 110, 120], s.qbTh2); },
    build: (s) => { const m = ci(s.qbM, 2, 4), n = ci(s.qbN, 5, 7), th = ci(s.qbTh2, 50, 130); return { ...dq(m, n, n, m, th), m, n, th }; },
    marks(b, M) { line(b, M.A, M.C, 'ink', 2.4); line(b, M.B, M.D, 'ink', 2.4); tick(b, M.A, M.O, 1); tick(b, M.D, M.O, 1); tick(b, M.B, M.O, 2); tick(b, M.C, M.O, 2); par(b, M.A, M.D, 1, 'green'); par(b, M.B, M.C, 1, 'green'); segTag(b, M.A, M.O, 0.5, `${M.m}`, 14, 'amber'); segTag(b, M.O, M.C, 0.5, `${M.n}`, 14, 'sky'); segTag(b, M.B, M.O, 0.5, `${M.n}`, -14, 'sky'); segTag(b, M.O, M.D, 0.5, `${M.m}`, -14, 'amber'); dotO(b, M); },
    bad(b, M) { fillPoly(b, M.pts, 'rose', 0.12); },
    guide: '막대로 OA(=OD)와 OC(=OB)를 바꿔 보세요. AC=BD인데 <b>OA≠OC</b>라서 대각선이 서로 이등분되지 않아요. AD∥BC이고 AB=DC인 <b>등변사다리꼴</b>이에요.',
    cap: (M) => `AC=BD=${M.m + M.n} 이지만 OA=${M.m} ≠ OC=${M.n} → 직사각형이 아니에요`,
    capR: (M, st) => [`AC=BD=${M.m + M.n} (조건은 만족)`, `OA=${M.m}, OC=${M.n}으로 달라서 서로 이등분하지 않아요`, '등변사다리꼴이 반례예요'][clamp(st, 1, 3) - 1],
    steps: (M) => [`두 대각선의 길이가 같은(AC=BD=${M.m + M.n}) 사각형을 그려요. 조건은 만족해요.`, `그런데 OA=${M.m}, OC=${M.n}이라 대각선이 서로 이등분하지 않아요. 평행사변형이 아니에요.`, '등변사다리꼴이 반례이므로 "사각형에서 AC=BD이면 직사각형이다"는 거짓이에요. (평행사변형에서 AC=BD이면 직사각형이 맞아요.)'],
    read: (M) => [rd('AC', `${M.m + M.n}`, 'sky'), rd('BD', `${M.m + M.n}`, 'sky'), rd('OA와 OC', `${M.m}, ${M.n}`, 'rose', '달라요'), rd('사각형 ABCD', '등변사다리꼴', 'rose', '평행사변형이 아니에요', null, true)],
    formula: (M) => `<p>$${ll('AC')}=${ll('BD')}=${M.m + M.n}$ 이지만 $${ll('OA')}=${M.m}\\ne${ll('OC')}=${M.n}$</p><p>→ 등변사다리꼴 (평행사변형도 직사각형도 아니다)</p>`,
    rule: '사각형에서 두 대각선의 길이가 같은 것만으로는 평행사변형이 되지 않는다 (반례: 등변사다리꼴)',
    notes: ['"평행사변형에서 AC=BD이면 직사각형"은 참이에요. "사각형에서"로 시작하면 반례를 먼저 의심하세요.', '대각선의 <b>길이</b>가 아니라 서로 <b>이등분</b>하는 것이 평행사변형의 조건이에요.']
  });

  // 8. 한쪽만 이등분
  const cHalf = counter({
    id: 'q2-8', title: '[함정] 한 대각선만 이등분하면 평행사변형? ', short: '반례 ④ 한쪽만 이등분', falseId: 'f5',
    question: '한 대각선이 다른 대각선을 이등분하기만 하면(OB=OD) 평행사변형일까?',
    ctl: ['qbK1', 'qbK2', 'qbKq', 'qbTh2'],
    init: (s) => { s.qbK1 = 3; s.qbK2 = 6; s.qbKq = 4; s.qbTh2 = 70; },
    reroll: (s) => { s.qbK1 = rint(2, 4); s.qbK2 = rint(5, 7); s.qbKq = rint(3, 5); s.qbTh2 = pick([60, 70, 80, 100, 110, 120], s.qbTh2); },
    build: (s) => { const p1 = ci(s.qbK1, 2, 4), p2 = ci(s.qbK2, 5, 7), q = ci(s.qbKq, 3, 5), th = ci(s.qbTh2, 50, 130); return { ...dq(p1, p2, q, q, th), p1, p2, q, th }; },
    marks(b, M) { line(b, M.A, M.C, 'ink', 2.4); line(b, M.B, M.D, 'ink', 2.4); tick(b, M.B, M.O, 2); tick(b, M.O, M.D, 2); segTag(b, M.A, M.O, 0.5, `${M.p1}`, 14, 'amber'); segTag(b, M.O, M.C, 0.5, `${M.p2}`, 14, 'sky'); segTag(b, M.B, M.O, 0.5, `${M.q}`, -14, 'green'); segTag(b, M.O, M.D, 0.5, `${M.q}`, -14, 'green'); dotO(b, M); },
    bad(b, M) { fillPoly(b, M.pts, 'rose', 0.12); },
    guide: '막대로 길이와 ∠AOB를 바꿔 보세요. BD가 AC를 이등분하는 것이 아니라 <b>OB=OD만</b> 성립하고 <b>OA≠OC</b>예요. 두 대각선이 <b>서로</b> 이등분해야 평행사변형이에요.',
    cap: (M) => `OB=OD=${M.q} 이지만 OA=${M.p1} ≠ OC=${M.p2} → 평행사변형이 아니에요`,
    capR: (M, st) => [`OB=OD=${M.q} (한쪽 대각선은 이등분돼요)`, `OA=${M.p1}, OC=${M.p2}로 달라서 AC는 이등분되지 않아요`, '두 대각선이 모두 이등분해야 해요 → 평행사변형이 아니에요'][clamp(st, 1, 3) - 1],
    steps: (M) => [`BD가 O에서 이등분돼요. OB=OD=${M.q}이에요.`, `하지만 AC는 O에서 이등분되지 않아요. OA=${M.p1}, OC=${M.p2}예요.`, '평행사변형이 되려면 OA=OC와 OB=OD가 <b>동시에</b> 성립해야 해요. 한쪽만 성립하는 그림이 반례예요.'],
    read: (M) => [rd('OB = OD', `${M.q}`, 'green'), rd('OA', `${M.p1}`, 'amber'), rd('OC', `${M.p2}`, 'sky'), rd('사각형 ABCD', '평행사변형이 아니에요', 'rose', '', null, true)],
    formula: (M) => `<p>$${ll('OB')}=${ll('OD')}=${M.q}$ 이지만 $${ll('OA')}=${M.p1}\\ne${ll('OC')}=${M.p2}$</p><p>평행사변형이 되려면 $${ll('OA')}=${ll('OC')}$ 이고 $${ll('OB')}=${ll('OD')}$</p>`,
    rule: '두 대각선이 서로 다른 것을 이등분해야 평행사변형이다 (한 대각선만 이등분하는 것은 조건이 아니다)',
    notes: ['"서로"가 핵심이에요. <b>두 쌍</b> OA=OC, OB=OD가 모두 필요해요.', '한 대각선이 이등분되는 사각형은 연 모양처럼 평행사변형이 아닌 것도 있어요.']
  });

  // 9. 이름 순서 함정
  const cName = counter({
    id: 'q2-9', title: '[함정] 변의 이름 순서: AB=BC, CD=DA와 AB=CD, BC=DA', short: '반례 ⑤ 이름 순서 함정', falseId: 'f2',
    question: '"두 쌍의 변의 길이가 같다"고 해도 어느 변끼리 같은지에 따라 달라. AB=BC, CD=DA이면? AB=CD, BC=DA이면?',
    ctl: ['qbNb', 'qbNd', 'qbNa'], presets: () => [['trap', '이웃한 변끼리 AB=BC, CD=DA'], ['ok', '마주 보는 변끼리 AB=CD, BC=DA']].map(([id, label], i) => ({ group: i === 0 ? '어느 변끼리 같을까요' : '', label, apply: (s) => { s.qbCn = id; }, on: (s) => (s.qbCn || 'trap') === id })),
    init: (s) => { s.qbNb = 3; s.qbNd = 6; s.qbNa = 4; s.qbCn = 'trap'; },
    reroll: (s) => { s.qbNb = rint(2, 4); s.qbNd = rint(5, 7); s.qbNa = rint(3, 5); },
    build: (s) => {
      const ok = s.qbCn === 'ok', q1 = ci(s.qbNb, 2, 4), q2 = ci(s.qbNd, 5, 7), p = ci(s.qbNa, 3, 5);
      // trap: AC 가 대칭축인 연이 아니라 BD 축: OA=OC=p, ⊥, OB=q1≠OD=q2 → AB=BC, CD=DA
      const M = ok ? { ...dq(p, p, q1 + 1, q1 + 1, 70), ok } : { ...dq(p, p, q1, q2, 90), ok };
      return { ...M, p, q1, q2, ok };
    },
    marks(b, M) { if (M.ok) { tick(b, M.A, M.B, 1); tick(b, M.D, M.C, 1); tick(b, M.B, M.C, 2); tick(b, M.A, M.D, 2); par(b, M.A, M.D, 1, 'green', 0.24); par(b, M.B, M.C, 1, 'green', 0.24); par(b, M.A, M.B, 2, 'green', 0.24); par(b, M.D, M.C, 2, 'green', 0.24); } else { tick(b, M.A, M.B, 1); tick(b, M.B, M.C, 1); tick(b, M.C, M.D, 2); tick(b, M.D, M.A, 2); } },
    bad(b, M) { if (!M.ok) { line(b, M.A, M.C, 'ink', 2.2, { dash: [6, 5], alpha: 0.7 }); line(b, M.B, M.D, 'ink', 2.2, { dash: [6, 5], alpha: 0.7 }); dotO(b, M); } else fillPoly(b, M.pts, 'green', 0.12); },
    guide: '칩을 눌러 보세요. <b>이웃한 변끼리</b>(AB=BC, CD=DA) 같으면 연 모양, <b>마주 보는 변끼리</b>(AB=CD, BC=DA) 같으면 평행사변형이에요. 글자 순서에 속지 마세요.',
    cap: (M) => (M.ok ? 'AB=CD, BC=DA (마주 보는 변이 같아요) → 평행사변형이에요' : 'AB=BC, CD=DA (이웃한 변이 같아요) → 평행사변형이 아니에요'),
    capR: (M, st) => ['어느 변끼리 같은지 그림에 같은 눈금으로 표시해요', M.ok ? '마주 보는 변끼리 같아요: AB=CD(눈금 1개), BC=DA(눈금 2개)' : '이웃한 변끼리 같아요: AB=BC(눈금 1개), CD=DA(눈금 2개)', M.ok ? '두 쌍의 대변의 길이가 각각 같으므로 평행사변형이에요' : '연 모양 사각형이므로 평행사변형이 아니에요'][clamp(st, 1, 3) - 1],
    steps: (M) => ['글자만 보지 말고 사각형 ABCD를 그리고 같은 변에 같은 눈금을 표시해요.', M.ok ? 'AB=CD, BC=DA는 마주 보는 변끼리 같아요.' : 'AB=BC, CD=DA는 이웃한 변끼리 같아요.', M.ok ? '두 쌍의 대변의 길이가 각각 같으므로 평행사변형이에요.' : '이웃한 변끼리 같은 연 모양 사각형이에요. 평행사변형이 되는 조건이 아니에요.'],
    read: (M) => [rd('같은 변', M.ok ? 'AB=CD, BC=DA' : 'AB=BC, CD=DA', M.ok ? 'green' : 'rose', M.ok ? '마주 보는 변' : '이웃한 변', null, true), rd('사각형 ABCD', M.ok ? '평행사변형' : '연 모양', M.ok ? 'green' : 'rose', '', null, true)],
    formula: (M) => (M.ok ? `<p>$${ll('AB')}=${ll('CD')}$, $${ll('BC')}=${ll('DA')}$ → 평행사변형 ⭕</p>` : `<p>$${ll('AB')}=${ll('BC')}$, $${ll('CD')}=${ll('DA')}$ → 연 모양 사각형 ❌</p>`.replace('⭕', '').replace('❌', '')),
    rule: '두 쌍의 변이 같아도 마주 보는 변끼리여야 평행사변형이다 (이웃한 변끼리 같으면 연 모양)',
    notes: ['글자 순서가 비슷해도 어느 변끼리 같은지가 달라요. <b>그림에 눈금</b>을 직접 그려 보세요.', '마름모가 되려면 네 변이 모두 같아야 해요.']
  });


  // Authored lessons use the same source models while keeping the manual tabs intact.
  // Every conclusion caption is owned by a timed cue, rather than the explore caption.
  const lessonTools = G.qdLessonA;
  const sourceQuestion = Q => lessonTools.question(Q);
  const representative = (id, s) => {
    if (id === 'f1') return cTrap.model(s);
    if (id === 'f2') return cName.model({ ...s, qbCn: 'trap' });
    if (id === 'f3') return cDiag.model(s);
    if (id === 'f4') return cKite.model(s);
    if (id === 'f5') return cHalf.model(s);
    return five.model(s);
  };
  function names(b, g, extra = []) {
    const center = g.O || G.centroid([g.A, g.B, g.C, g.D]);
    for (const [name, point] of [['A', g.A], ['B', g.B], ['C', g.C], ['D', g.D], ...extra]) {
      b.point(point, { color: 'ink', r: 4.2 }); tagOut(b, point, center, name, { size: 16, gap: 12 });
    }
  }
  function trace(b, g, progress) {
    const points = [g.A, g.B, g.C, g.D];
    points.forEach((p, i) => { const f = clamp((progress || 0) * 4 - i, 0, 1); if (f > 0) line(b, p, lerp(p, points[(i + 1) % 4], f), 'amber', 4.5); });
  }
  function conditionPair(g, id) {
    const { A, B, C, D, O } = g;
    if (id === 't4') return { polygons: [[A, O, B], [C, O, D]], names: [['A', 'O', 'B'], ['C', 'O', 'D']], edges: [[0, 1, 1], [1, 2, 2]], angles: [[1, 0, 2]] };
    if (id === 't5') return { polygons: [[A, D, C], [C, B, A]], names: [['A', 'D', 'C'], ['C', 'B', 'A']], edges: [[0, 1, 1], [0, 2, 2]], angles: [[0, 1, 2]] };
    return { polygons: [[A, B, C], [C, D, A]], names: [['A', 'B', 'C'], ['C', 'D', 'A']], edges: [[0, 1, 1], [1, 2, 2], [0, 2, 3]] };
  }
  function conditionFigure(b, s, Cx, id, given) {
    const g = given || (id ? representative(id, s) : (() => {
      const A = pt(1.3, -4.2), B = pt(0, 0), C = pt(7.2, 0), D = pt(6.4, -3.3);
      return { A, B, C, D, O: crossO(A, B, C, D), pts: [A, B, C, D] };
    })());
    if (!Cx.entry && s.qdCompare) { lessonTools.pair(b, s, conditionPair(g, id)); return g; }
    const { A, B, C, D, O } = g, pts = g.pts || [A, B, C, D], st = Cx.entry ? 0 : s.step || 0;
    fit(b, bboxOf(pts), { t: 48, b: 112, l: 48, r: 48 });
    fillPoly(b, pts, 'sky', .09); poly(b, pts, 'ink', 3.4);
    if (!id || ['t4', 'f3', 'f4', 'f5'].includes(id)) { line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4); dotO(b, g); }
    if (id === 't1') parAll(b, g);
    if (id === 't2') { tick(b, A, B, 1); tick(b, C, D, 1); tick(b, B, C, 2); tick(b, A, D, 2); }
    if (id === 't3') { ang(b, A, B, D, { rings: 1, color: 'sky' }); ang(b, C, B, D, { rings: 1, color: 'sky' }); ang(b, B, A, C, { rings: 2, color: 'rose' }); ang(b, D, A, C, { rings: 2, color: 'rose' }); }
    if (id === 't4') { tick(b, A, O, 1); tick(b, O, C, 1); tick(b, B, O, 2); tick(b, O, D, 2); }
    if (id === 't5' || id === 'f1') { par(b, A, D, 1, 'green', .24); par(b, B, C, 1, 'green', .24); if (id === 't5') { tick(b, A, D, 3); tick(b, B, C, 3); } else { tick(b, A, B, 1); tick(b, C, D, 1); sd(b, A, D, O, String(g.a), 'sky'); sd(b, B, C, O, String(g.bb), 'sky'); } }
    if (id === 'f2') { tick(b, A, B, 1); tick(b, B, C, 1); tick(b, C, D, 2); tick(b, D, A, 2); if (st >= 2) { line(b, A, C, 'ink', 2.4); line(b, B, D, 'ink', 2.4); dotO(b, g); segTag(b, B, O, .5, String(g.q1), 15, 'sky'); segTag(b, O, D, .5, String(g.q2), 15, 'sky'); segTag(b, A, O, .5, String(g.p), 15, 'amber'); segTag(b, O, C, .5, String(g.p), 15, 'amber'); } }
    if (id === 'f3') { tick(b, A, C, 1); tick(b, B, D, 1); segTag(b, A, O, .5, String(g.m), 15, 'amber'); segTag(b, O, C, .5, String(g.n), 15, 'sky'); segTag(b, B, O, .5, String(g.n), 15, 'sky'); segTag(b, O, D, .5, String(g.m), 15, 'amber'); }
    if (id === 'f4' || id === 'f5') { if (id === 'f4') b.right(O, A, B, { size: 12, color: 'green' }); tick(b, B, O, 2); tick(b, O, D, 2); segTag(b, A, O, .5, String(g.p1), 15, 'amber'); segTag(b, O, C, .5, String(g.p2), 15, 'sky'); segTag(b, B, O, .5, String(g.q), 15, 'green'); segTag(b, O, D, .5, String(g.q), 15, 'green'); }
    if (st >= 1 && ['t2', 't5'].includes(id)) line(b, A, C, 'green', 2.7, { dash: [7, 5] });
    if (Cx.answer && id.startsWith('t')) parAll(b, g, .24);
    names(b, g);
    if (!Cx.entry) trace(b, g, s.qdTrace);
    return g;
  }
  function hiddenFigure(b, s, M, Cx) {
    const { A, B, C, D, E, F, O } = M, st = Cx.entry ? 0 : s.step || 0;
    if (!Cx.entry && s.qdCompare) { lessonTools.pair(b, s, { polygons: [[A, E, B], [C, F, D]], names: [['A', 'E', 'B'], ['C', 'F', 'D']], edges: [[0, 2, 1]], angles: [[0, 1, 2], [1, 0, 2, 2]] }); return; }
    if (s.qdLessonProblem) {
      const stage = Cx.answer ? 5 : Math.min(st, 4);
      hidden.solveDraw(b, { ...s, step: stage }, M, Cx, G.currentSolution(hidden, s));
    } else {
      lessonTools.quad(b, { A, B, C, D, O }); line(b, A, C, 'ink', 2.5);
      line(b, B, E, 'amber', 3); line(b, D, F, 'amber', 3);
      b.right(E, A, B, { size: 12, color: 'amber' }); b.right(F, C, D, { size: 12, color: 'amber' });
      b.point(E, { color: 'amber', r: 4 }); T(b, E, 'E', { dy: -19, color: 'amber' });
      b.point(F, { color: 'amber', r: 4 }); T(b, F, 'F', { dy: 19, color: 'amber' });
      if (st >= 1) { par(b, B, E, 1, 'green', .4); par(b, D, F, 1, 'green', .4); }
      if (Cx.answer) { fillPoly(b, [E, B, F, D], 'green', .16); poly(b, [E, B, F, D], 'green', 3); }
    }
    if (st >= 2) { tick(b, A, E, 1); tick(b, C, F, 1); tick(b, B, E, 2); tick(b, D, F, 2); }
    if (!Cx.entry) trace(b, M, s.qdTrace);
  }
  function proofFigure(b, s, M, Cx) {
    const { A, B, C, D, O } = M.pg, E = M.E, st = Cx.entry ? 0 : s.step || 0;
    lessonTools.quad(b, M.pg, [E], false);
    ang(b, A, B, D, { rings: 1, color: 'sky' }); ang(b, C, B, D, { rings: 1, color: 'sky' });
    ang(b, B, A, C, { rings: 2, color: 'rose' }); ang(b, D, A, C, { rings: 2, color: 'rose' });
    if (st >= 3) { line(b, A, E, 'green', 2.8); b.point(E, { color: 'green', r: 4 }); tagOut(b, E, A, 'E', { color: 'green' }); ang(b, A, E, D, { rings: 3, color: 'green' }); }
    if (st >= 4) { ang(b, B, A, C, { rings: 3, color: 'green', r: 22 }); par(b, A, D, 1, 'green'); par(b, B, C, 1, 'green'); }
    if (Cx.answer) { par(b, A, B, 2, 'green'); par(b, C, D, 2, 'green'); }
    if (!Cx.entry) trace(b, M.pg, s.qdTrace);
    void O;
  }
  const gl = [five, para5, hidden, proof, cTrap, cKite, cDiag, cHalf, cName];
  gl.forEach(D => {
    D.lessonQuestion = (M, s, Q) => s.qdLessonProblem ? sourceQuestion(Q) : s.qdDQuestion || D.question;
    D.lessonDraw = (b, s, M, Cx, solution) => {
      let g = M.pg || M;
      if ((s.qdLessonProblem && solution.question.conditionId) || D === five || D === para5 && !s.qdLessonProblem || [cTrap, cKite, cDiag, cHalf, cName].includes(D)) {
        const id = s.qdDCondition || '';
        const own = !s.qdLessonProblem && (D === five || D === para5 || D === cName && s.qbCn === 'ok') ? M : undefined;
        g = conditionFigure(b, s, Cx, id, own);
        if (!Cx.entry && s.qdCompare) return;
      } else if (D === hidden) { hiddenFigure(b, s, M, Cx); if (!Cx.entry && s.qdCompare) return; }
      else if (D === proof && !s.qdLessonProblem) proofFigure(b, s, M, Cx);
      else {
        const stage = Cx.answer ? solution.steps.length : Math.min(s.step || 0, solution.steps.length - 1);
        D.solveDraw(b, { ...s, step: stage }, M, Cx, solution);
        if (!Cx.entry) trace(b, g, s.qdTrace);
      }
      if (!Cx.entry && s.qdLine) {
        const box = bboxOf(g.pts || [g.A, g.B, g.C, g.D]);
        capLine(b, pt((box.x0 + box.x1) / 2, box.y1), s.qdLine, Cx.answer ? 'amber' : 'green', { dy: 84 });
      }
    };
  });

  G.register(20, 'qd2', '② 평행사변형이 되는 조건', '평행사변형이 되는 조건', PARAMS, gl);
})();
