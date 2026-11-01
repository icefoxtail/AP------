/* ==========================================================================
   중1 · 기본 도형 — 탭 "③ 중점과 거리" (mid.js, order 30)
   - m-mid   두 중점 사이의 거리: AC의 중점 M, CB의 중점 N 이면 MN = ½AB (점 C가 어디에 있어도)
   - m-dbl   중점의 중점: 전체를 똑같은 4칸으로 → AN = ¾AB
   - m-tri   삼등분점과 중점: 전체를 6칸으로 → PM = ⅙AB
   - m-ratio 길이의 비를 칸으로: AC = k·CB 이면 CB = 1칸, AC = k칸
   - m-eq    서술형: AM = MB 로 방정식을 세워 x와 AB를 구하기
   그림의 선분은 늘 같은 길이(12칸)로 그려 큰 그림을 유지하고, 실제 길이(cm)는 눈금마다 글자로 씁니다.
   ========================================================================== */
(function () {
  'use strict';
  const PL = window.APL_PL;
  if (!PL) return;
  const { clamp, T } = PL;
  const W = 12;
  const half = (v) => (Number.isInteger(v) ? String(v) : String(Math.round(v * 10) / 10));
  const BOX = [-1.0, -3.4, 13.0, 5.4];

  const PARAMS = {
    mL: { value: 12, min: 6, max: 20, step: 2, color: 'amber', label: '선분 AB의 길이', format: (v) => `${v} cm`, onInput: (s) => { s.mC = Math.min(s.mC, s.mL - 2); } },
    mC: { value: 4, min: 2, max: 18, step: 2, color: 'sky', label: '점 C의 위치 (AC의 길이)', hint: '그림의 노란 점을 가로로 끌어도 됩니다', format: (v) => `${v} cm`, onInput: (s) => { s.mC = Math.min(s.mC, s.mL - 2); } },
    dL: { value: 12, min: 4, max: 24, step: 4, color: 'amber', label: '선분 AB의 길이', hint: '4의 배수로 바뀝니다', format: (v) => `${v} cm` },
    tL: { value: 18, min: 6, max: 36, step: 6, color: 'amber', label: '선분 AB의 길이', hint: '6의 배수로 바뀝니다', format: (v) => `${v} cm` },
    rK: { value: 2, min: 2, max: 6, step: 2, color: 'sky', label: 'AC는 CB의 몇 배', format: (v) => `${v}배` },
    rU: { value: 3, min: 1, max: 6, step: 1, color: 'amber', label: '1칸(CB)의 길이', format: (v) => `${v} cm` },
    eX: { value: 1, min: 0, max: 14, step: 1, color: 'amber', label: 'x의 값', hint: '길이가 같아지는 x를 찾아보세요', format: (v) => `x = ${v}` }
  };

  // 길이 글자: 조각이 좁으면 위아래로 번갈아 놓아 겹치지 않게
  const lenLabels = (b, X, y, list) => list.forEach((q, i) => {
    const w = X(q.c) - X(q.a), lv = w < 1.9 ? i % 2 : 0;
    T(b, { x: (X(q.a) + X(q.c)) / 2, y }, q.text, { dy: -(24 + lv * 20), color: q.color || 'ink', size: q.size || 15 });
  });
  const bar = (b, X, y, a, c, color, o = {}) => {
    b.seg({ x: X(a), y }, { x: X(c), y }, { color, width: o.width || 8, alpha: o.alpha == null ? 1 : o.alpha, glow: !!o.glow, cap: 'butt' });
  };
  const pt = (b, x, y, name, o = {}) => { b.point({ x, y }, { color: o.color || 'ink', r: o.r || 5.5 }); if (name) T(b, { x, y }, name, { dy: o.dy == null ? 24 : o.dy, size: 18, color: o.color || 'ink' }); };
  // 칸(셀) 그리기: from~to 칸 번호, 높이 0.9
  const cell = (b, X, y, i, color, alpha = 1, label = '1칸') => {
    const x0 = X(i) + 0.04, x1 = X(i + 1) - 0.04, h = 0.46;
    b.poly([{ x: x0, y: y - h }, { x: x1, y: y - h }, { x: x1, y: y + h }, { x: x0, y: y + h }], { fill: color, fillAlpha: 0.3 * alpha, color, width: 2.4, alpha });
    if (label) T(b, { x: (x0 + x1) / 2, y }, label, { color, size: 14 });
  };
  const hl = (st, on) => (st >= 99 || on ? 1 : 0.3);
  const note = (items) => `<ul style="margin:0;padding-left:18px;display:grid;gap:4px">${items.map((x) => `<li>${x}</li>`).join('')}</ul>`;

  /* ================================================================== 두 중점 사이의 거리 */
  const sMid = PL.scene({
    id: 'm-mid', title: '두 중점 사이의 거리', short: '두 중점 사이',
    box: BOX,
    question: '점 C가 어디에 있어도 두 중점 M, N 사이의 거리는 왜 변하지 않을까요?',
    init: { mL: 12, mC: 4 },
    controls: ['mL', 'mC'],
    model: (s) => { const L = s.mL, a = Math.min(s.mC, L - 2), b = L - a; return { L, a, b, M: a / 2, N: a + b / 2, p: a / 2, q: b / 2, mn: L / 2 }; },
    guide: (M) => `선분 AB 위의 <b>노란 점 C</b>를 끌어 보세요. <b>M은 AC의 중점, N은 CB의 중점</b>입니다. C가 어디에 있어도 MN은 항상 <b>AB의 절반(${half(M.mn)} cm)</b>이에요.`,
    readouts: (M) => [
      { label: 'AM = MC (○)', value: `${half(M.p)} cm`, color: 'sky' },
      { label: 'CN = NB (△)', value: `${half(M.q)} cm`, color: 'rose' },
      { label: 'MN = ○ + △', value: `${half(M.mn)} cm`, color: 'green', note: `AB ${M.L} cm의 절반` }
    ],
    steps: (M) => [
      `M은 AC의 중점이므로 AM = MC = ○ = ${half(M.p)} cm, N은 CB의 중점이므로 CN = NB = △ = ${half(M.q)} cm`,
      `AB = ○ + ○ + △ + △ = ${M.L} cm 이므로 ○ + △ = ${M.L} ÷ 2 = ${half(M.mn)} cm`,
      `MN = MC + CN = ○ + △ = ${half(M.mn)} cm (점 C가 어디에 있어도 같습니다)`
    ],
    formula: (M) => `<p>$\\overline{AB}=2\\bigcirc+2\\triangle=${M.L}$ 이므로 $\\bigcirc+\\triangle=${half(M.mn)}$</p><p>$\\overline{MN}=\\overline{MC}+\\overline{CN}=\\bigcirc+\\triangle=\\dfrac12\\overline{AB}=${half(M.mn)}\\text{ cm}$</p>`,
    rule: () => 'MN = ○ + △ = ½AB',
    notes: () => note(['MN의 길이는 점 C의 위치와 관계없이 <b>AB의 절반</b>입니다.', 'MN이 주어지고 AB를 물으면 <b>2배</b>를 하면 됩니다.']),
    draw: (b, s, M, C) => {
      const st = C.step, X = (c) => (c * W) / M.L;
      bar(b, X, 0, 0, M.M, 'sky', { alpha: hl(st, st === 1) }); bar(b, X, 0, M.M, M.a, 'sky', { alpha: hl(st, st === 1) });
      bar(b, X, 0, M.a, M.N, 'rose', { alpha: hl(st, st === 1) }); bar(b, X, 0, M.N, M.L, 'rose', { alpha: hl(st, st === 1) });
      b.ticks({ x: X(0), y: 0 }, { x: X(M.M), y: 0 }, { color: 'ink' }); b.ticks({ x: X(M.M), y: 0 }, { x: X(M.a), y: 0 }, { color: 'ink' });
      b.ticks({ x: X(M.a), y: 0 }, { x: X(M.N), y: 0 }, { color: 'ink', count: 2 }); b.ticks({ x: X(M.N), y: 0 }, { x: X(M.L), y: 0 }, { color: 'ink', count: 2 });
      [[0, 'A'], [M.M, 'M'], [M.a, 'C'], [M.N, 'N'], [M.L, 'B']].forEach(([c, n]) => pt(b, X(c), 0, n, { color: n === 'C' ? 'amber' : n === 'M' || n === 'N' ? 'green' : 'ink' }));
      if (!C.hide) lenLabels(b, X, 0, [{ a: 0, c: M.M, text: `○ ${half(M.p)}`, color: 'sky' }, { a: M.M, c: M.a, text: `○ ${half(M.p)}`, color: 'sky' }, { a: M.a, c: M.N, text: `△ ${half(M.q)}`, color: 'rose' }, { a: M.N, c: M.L, text: `△ ${half(M.q)}`, color: 'rose' }]);
      else lenLabels(b, X, 0, [{ a: 0, c: M.M, text: '○', color: 'sky' }, { a: M.M, c: M.a, text: '○', color: 'sky' }, { a: M.a, c: M.N, text: '△', color: 'rose' }, { a: M.N, c: M.L, text: '△', color: 'rose' }]);
      PL.dim(b, { x: X(0), y: -2.0 }, { x: X(M.L), y: -2.0 }, C.hide ? 'AB' : `AB = ${M.L} cm`, { color: 'ink', dy: -16, alpha: hl(st, st === 2) });
      if (!C.hide) {
        PL.dim(b, { x: X(0), y: 2.4 }, { x: X(M.a), y: 2.4 }, `AC = ${M.a} cm`, { color: 'sky', dy: 18, width: 2.6 });
        PL.dim(b, { x: X(M.a), y: 2.4 }, { x: X(M.L), y: 2.4 }, `CB = ${M.b} cm`, { color: 'rose', dy: 18, width: 2.6 });
        PL.dim(b, { x: X(M.M), y: 3.9 }, { x: X(M.N), y: 3.9 }, `MN = ${half(M.mn)} cm`, { color: 'green', dy: 18, width: st >= 3 || st >= 99 ? 6 : 3.4 });
      }
      b.handle('C', { x: X(M.a), y: 0 }, { color: 'amber', ariaLabel: '점 C', drag: (w) => { s.mC = clamp(Math.round(((w.x * M.L) / W) / 2) * 2, 2, M.L - 2); } });
    },
    quiz: (M, s, rng) => {
      const kind = (s.plSeed || 0) % 2;
      if (kind === 0) {
        const wrongs = [{ v: M.L, hint: 'AB 전체의 길이예요. MN은 그 절반이에요.' }, { v: M.L / 4, hint: 'AB의 4분의 1이 아니라 2분의 1이에요.' }, { v: M.a, hint: 'AC의 길이예요. MN은 점 C의 위치와 관계없이 AB의 절반이에요.' }, { v: M.L / 2 + 1, hint: '○ + △ = AB의 절반이에요.' }];
        return { tag: '두 중점 사이의 거리', stem: `선분 AB 위의 점 C에 대하여 선분 AC의 중점을 M, 선분 CB의 중점을 N이라 하자. $\\overline{AB}=${M.L}$ cm일 때, $\\overline{MN}$의 길이는?`, choices: PL.numChoices(M.mn, wrongs, { fmt: (v) => `${half(v)} cm` }) };
      }
      const mn = M.mn, ab = M.L;
      const wrongs = [{ v: mn, hint: 'MN은 AB의 절반이에요. AB는 MN의 2배예요.' }, { v: mn * 4, hint: 'AB는 MN의 2배예요.' }, { v: mn * 3, hint: 'AB는 MN의 2배예요.' }, { v: mn + 2, hint: 'AB = 2 × MN 이에요.' }];
      return { tag: '두 중점 사이의 거리 (거꾸로)', stem: `선분 AB 위의 점 C에 대하여 선분 AC의 중점을 M, 선분 CB의 중점을 N이라 하자. $\\overline{MN}=${mn}$ cm일 때, $\\overline{AB}$의 길이는?`, choices: PL.numChoices(ab, wrongs, { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { s.mL = 2 * PL.randInt(rng, 3, 10); s.mC = 2 * PL.randInt(rng, 1, s.mL / 2 - 1); }
  });

  /* ================================================================== 중점의 중점 */
  const sDbl = PL.scene({
    id: 'm-dbl', title: '중점의 중점', short: '중점의 중점',
    box: BOX,
    question: '중점을 두 번 잡으면 선분은 똑같은 몇 칸으로 나뉠까요?',
    init: { dL: 12 },
    controls: ['dL'],
    model: (s) => { const L = s.dL, q = L / 4; return { L, q, AM: 2 * q, AN: 3 * q }; },
    guide: (M) => `M은 AB의 중점, N은 MB의 중점입니다. 가장 작은 조각(MN, NB)을 <b>1칸</b>이라 하면 전체 AB는 <b>4칸</b>이고 1칸은 ${M.q} cm예요. 위 막대로 AB의 길이를 바꿔 보세요.`,
    readouts: (M) => [{ label: '1칸', value: `${M.q} cm`, color: 'rose', note: `AB ${M.L} cm의 ¼` }, { label: 'AM', value: `2칸 = ${M.AM} cm`, color: 'sky' }, { label: 'AN', value: `3칸 = ${M.AN} cm`, color: 'green', note: 'AB의 ¾' }],
    steps: (M) => [
      `M은 AB의 중점이므로 AM = MB = 전체의 절반입니다. AM = ${M.AM} cm`,
      `N은 MB의 중점이므로 MN = NB = MB의 절반입니다. 가장 작은 조각을 1칸이라 하면 AB는 4칸, 1칸은 ${M.L} ÷ 4 = ${M.q} cm`,
      `AN = AM + MN = 2칸 + 1칸 = 3칸 = ${M.q} × 3 = ${M.AN} cm`
    ],
    formula: (M) => `<p>$\\overline{MN}=\\dfrac14\\overline{AB}=${M.q}$ cm, $\\overline{AN}=\\dfrac34\\overline{AB}=${M.AN}$ cm</p>`,
    rule: () => '중점을 두 번 잡으면 전체가 똑같은 4칸',
    notes: () => note(['분수 계산(½ + ¼) 대신 <b>가장 작은 조각을 1칸</b>으로 놓고 칸 수를 세면 쉽습니다.']),
    draw: (b, s, M, C) => {
      const st = C.step, X = (c) => (c * W) / 4; // 칸 번호 → x
      const col = [['sky', 1], ['sky', 1], ['rose', 3], ['rose', 3]];
      for (let i = 0; i < 4; i++) cell(b, X, 0, i, i < 2 ? 'sky' : 'rose', i < 2 ? hl(st, st === 1) : hl(st, st >= 2));
      [[0, 'A'], [2, 'M'], [3, 'N'], [4, 'B']].forEach(([c, n]) => pt(b, X(c), 0.46, n, { color: n === 'M' || n === 'N' ? 'green' : 'ink', dy: 22 }));
      if (!C.hide) {
        PL.dim(b, { x: X(0), y: -1.9 }, { x: X(2), y: -1.9 }, `AM = ${M.AM} cm`, { color: 'sky', dy: -16, width: 3 });
        PL.dim(b, { x: X(2), y: -1.9 }, { x: X(4), y: -1.9 }, `MB = ${M.AM} cm`, { color: 'sky', dy: -16, width: 3 });
        PL.dim(b, { x: X(2), y: 2.0 }, { x: X(3), y: 2.0 }, `MN = 1칸 = ${M.q} cm`, { color: 'rose', dy: 18, width: 3 });
        PL.dim(b, { x: X(0), y: 3.4 }, { x: X(3), y: 3.4 }, `AN = 3칸 = ${M.AN} cm`, { color: 'green', dy: 18, width: st >= 3 || st >= 99 ? 6 : 3.4 });
      } else {
        PL.dim(b, { x: X(0), y: -1.9 }, { x: X(4), y: -1.9 }, `AB = ${M.L} cm`, { color: 'ink', dy: -16 });
      }
    },
    quiz: (M, s, rng) => {
      const kind = (s.plSeed || 0) % 3, q = M.q;
      if (kind === 0) return { tag: '중점의 중점', stem: `선분 AB의 중점을 M, 선분 MB의 중점을 N이라 하자. $\\overline{AB}=${M.L}$ cm일 때, $\\overline{AN}$의 길이는?`, choices: PL.numChoices(3 * q, [{ v: 2 * q, hint: 'AM의 길이예요. AN은 AM에 MN을 더한 3칸이에요.' }, { v: q, hint: 'MN의 길이예요. AN은 3칸이에요.' }, { v: 4 * q, hint: 'AB 전체의 길이예요.' }, { v: 3 * q + q, hint: '3칸이에요. 4칸은 AB 전체예요.' }], { fmt: (v) => `${v} cm` }) };
      if (kind === 1) return { tag: '중점의 중점', stem: `선분 AB의 중점을 M, 선분 MB의 중점을 N이라 하자. $\\overline{MN}=${q}$ cm일 때, $\\overline{AB}$의 길이는?`, choices: PL.numChoices(4 * q, [{ v: 2 * q, hint: '2칸은 AM의 길이예요. AB는 4칸이에요.' }, { v: 3 * q, hint: '3칸은 AN의 길이예요. AB는 4칸이에요.' }, { v: 8 * q, hint: '1칸이 MN이니 AB는 4칸이에요.' }, { v: q, hint: 'MN은 1칸이에요. AB는 4칸이에요.' }], { fmt: (v) => `${v} cm` }) };
      const an = 3 * q;
      return { tag: '중점의 중점', stem: `선분 AB의 중점을 M, 선분 MB의 중점을 N이라 하자. $\\overline{AN}=${an}$ cm일 때, $\\overline{AB}$의 길이는?`, choices: PL.numChoices(4 * q, [{ v: 3 * q + 3, hint: 'AN이 3칸이니 1칸은 AN ÷ 3 이에요.' }, { v: 6 * q, hint: 'AN은 AB의 ¾이에요.' }, { v: an, hint: 'AN은 AB의 일부예요.' }, { v: 5 * q, hint: 'AN이 3칸, AB는 4칸이에요.' }], { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { s.dL = 4 * PL.randInt(rng, 1, 6); }
  });

  /* ================================================================== 삼등분점과 중점 */
  const sTri = PL.scene({
    id: 'm-tri', title: '삼등분점과 중점', short: '삼등분점과 중점',
    box: BOX,
    question: '삼등분점과 중점이 함께 나오면 선분을 몇 칸으로 나누어 생각하면 좋을까요?',
    init: { tL: 18 },
    controls: ['tL'],
    model: (s) => { const L = s.tL, q = L / 6; return { L, q, AP: 2 * q, PM: q }; },
    guide: (M) => `P, Q는 AB의 <b>삼등분점</b>, M은 <b>중점</b>입니다. 3등분과 2등분이 섞이면 <b>전체를 6칸</b>으로 놓으세요(2와 3의 최소공배수). 1칸은 ${M.q} cm예요.`,
    readouts: (M) => [{ label: '1칸', value: `${M.q} cm`, color: 'green', note: `AB ${M.L} cm의 ⅙` }, { label: 'P, Q 위치', value: '2칸, 4칸', color: 'sky' }, { label: 'M 위치', value: '3칸', color: 'amber' }, { label: 'PM', value: `${M.q} cm`, color: 'green', note: '3칸 − 2칸 = 1칸' }],
    steps: (M) => [
      `삼등분점 P, Q: AB를 3등분하면 AP = PQ = QB = ${M.L} ÷ 3 = ${M.AP} cm (각각 2칸)`,
      `중점 M: AB를 2등분하면 AM = MB = ${M.L} ÷ 2 = ${3 * M.q} cm (각각 3칸)`,
      `PM = AM − AP = 3칸 − 2칸 = 1칸 = ${M.q} cm`
    ],
    formula: (M) => `<p>$\\overline{PM}=\\overline{AM}-\\overline{AP}=\\dfrac12\\overline{AB}-\\dfrac13\\overline{AB}=\\dfrac16\\overline{AB}=${M.q}$ cm</p>`,
    rule: () => '2등분과 3등분이 함께 나오면 6칸',
    notes: () => note(['통분 대신 <b>눈금 번호(A 0칸, P 2칸, M 3칸, Q 4칸, B 6칸)</b>를 빼면 어떤 구간이든 바로 구할 수 있습니다.']),
    draw: (b, s, M, C) => {
      const st = C.step, X = (c) => (c * W) / 6;
      for (let i = 0; i < 6; i++) { const g = i === 2 || i === 3; cell(b, X, 0, i, g ? 'green' : 'sky', hl(st, st === 3 ? g : true), g ? '1칸' : '1칸'); }
      [[0, 'A', 'ink'], [2, 'P', 'sky'], [3, 'M', 'amber'], [4, 'Q', 'sky'], [6, 'B', 'ink']].forEach(([c, n, col]) => pt(b, X(c), 0.46, n, { color: col, dy: 22 }));
      if (!C.hide) {
        PL.dim(b, { x: X(0), y: -1.9 }, { x: X(2), y: -1.9 }, `AP = ${M.AP} cm`, { color: 'sky', dy: -16, width: 3, size: 14 });
        PL.dim(b, { x: X(2), y: -1.9 }, { x: X(4), y: -1.9 }, `PQ = ${M.AP} cm`, { color: 'sky', dy: -16, width: 3, size: 14 });
        PL.dim(b, { x: X(4), y: -1.9 }, { x: X(6), y: -1.9 }, `QB = ${M.AP} cm`, { color: 'sky', dy: -16, width: 3, size: 14 });
        PL.dim(b, { x: X(0), y: 2.0 }, { x: X(3), y: 2.0 }, `AM = 3칸 = ${3 * M.q} cm`, { color: 'amber', dy: 18, width: 3 });
        PL.dim(b, { x: X(2), y: 3.4 }, { x: X(3), y: 3.4 }, `PM = 1칸 = ${M.q} cm`, { color: 'green', dy: 18, width: st >= 3 || st >= 99 ? 6 : 3.4 });
      } else PL.dim(b, { x: X(0), y: -1.9 }, { x: X(6), y: -1.9 }, `AB = ${M.L} cm`, { color: 'ink', dy: -16 });
    },
    quiz: (M, s, rng) => {
      const kind = (s.plSeed || 0) % 3, q = M.q;
      if (kind === 0) return { tag: '삼등분점과 중점', stem: `선분 AB의 삼등분점을 점 A에 가까운 것부터 P, Q라 하고, 선분 AB의 중점을 M이라 하자. $\\overline{AB}=${M.L}$ cm일 때, $\\overline{PM}$의 길이는?`, choices: PL.numChoices(q, [{ v: 2 * q, hint: 'PQ 또는 AP의 길이예요. PM은 3칸 − 2칸 = 1칸이에요.' }, { v: 3 * q, hint: 'AM의 길이예요.' }, { v: q + 1, hint: '1칸 = AB ÷ 6 이에요.' }, { v: 6 * q, hint: 'AB 전체의 길이예요.' }], { fmt: (v) => `${v} cm` }) };
      if (kind === 1) return { tag: '삼등분점과 중점', stem: `선분 AB의 삼등분점을 점 A에 가까운 것부터 P, Q라 하고, 선분 AB의 중점을 M이라 하자. $\\overline{PM}=${q}$ cm일 때, $\\overline{AB}$의 길이는?`, choices: PL.numChoices(6 * q, [{ v: 3 * q, hint: '3칸은 AM이에요. AB는 6칸이에요.' }, { v: 2 * q, hint: '2칸은 AP예요. AB는 6칸이에요.' }, { v: 12 * q, hint: 'PM이 1칸, AB는 6칸이에요.' }, { v: 4 * q, hint: '4칸은 AQ예요. AB는 6칸이에요.' }], { fmt: (v) => `${v} cm` }) };
      return { tag: '삼등분점과 중점', stem: `선분 AB의 삼등분점을 점 A에 가까운 것부터 P, Q라 하고, 선분 AB의 중점을 M이라 하자. $\\overline{AB}=${M.L}$ cm일 때, $\\overline{MQ}$의 길이는?`, choices: PL.numChoices(q, [{ v: 2 * q, hint: 'QB나 PQ의 길이예요. MQ는 4칸 − 3칸 = 1칸이에요.' }, { v: 3 * q, hint: 'AM이나 MB의 길이예요.' }, { v: q + 2, hint: '1칸 = AB ÷ 6 이에요.' }, { v: 4 * q, hint: 'AQ의 길이예요.' }], { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { s.tL = 6 * PL.randInt(rng, 1, 6); }
  });

  /* ================================================================== 길이의 비를 칸으로 */
  const sRatio = PL.scene({
    id: 'm-ratio', title: '길이의 비를 칸으로', short: '길이의 비 → 칸',
    box: [-1.0, -3.4, 13.0, 5.4],
    question: '"AC = 2CB"처럼 길이의 관계가 식으로 주어지면 어떻게 그림으로 바꿀까요?',
    init: { rK: 2, rU: 3 },
    controls: ['rK', 'rU'],
    model: (s) => { const k = s.rK, u = s.rU, n = k + 1; return { k, u, n, AB: n * u, AC: k * u, mc: (k / 2) * u, MB: (k / 2 + 1) * u }; },
    guide: (M) => `<b>AC = ${M.k}CB</b>에서 숫자가 곱해지지 않은 짧은 쪽 <b>CB를 1칸</b>으로 놓으면 AC는 <b>${M.k}칸</b>입니다. M이 AC의 중점이면 AM = MC = <b>${M.k / 2}칸</b>이에요. 막대로 비와 1칸의 길이를 바꿔 보세요.`,
    readouts: (M) => [{ label: 'CB', value: `1칸 = ${M.u} cm`, color: 'rose' }, { label: 'AC', value: `${M.k}칸 = ${M.AC} cm`, color: 'sky' }, { label: 'AB', value: `${M.n}칸 = ${M.AB} cm`, color: 'ink' }, { label: 'MB', value: `${M.k / 2 + 1}칸 = ${M.MB} cm`, color: 'green' }],
    steps: (M) => [
      `AC = ${M.k}CB 이므로 CB를 1칸이라 하면 AC는 ${M.k}칸입니다. AB = ${M.n}칸 = ${M.AB} cm 이므로 1칸 = ${M.u} cm`,
      `M은 AC의 중점이므로 AM = MC = ${M.k}칸 ÷ 2 = ${M.k / 2}칸 = ${M.mc} cm`,
      `MB = MC + CB = ${M.k / 2}칸 + 1칸 = ${M.k / 2 + 1}칸 = ${M.u} × ${M.k / 2 + 1} = ${M.MB} cm`
    ],
    formula: (M) => `<p>$\\overline{AC}=${M.k}\\overline{CB}$ ⟹ $\\overline{CB}=1$칸, $\\overline{AC}=${M.k}$칸, $\\overline{AB}=${M.n}$칸</p>`,
    rule: () => 'AC = k·CB 이면 CB = 1칸, AC = k칸',
    notes: () => note(['식에서 <b>곱해지지 않은 쪽(짧은 쪽)</b>을 1칸으로 놓으면 나머지가 자연수 칸이 됩니다.', '"AB = 3BC"라면 전체 AB가 3칸, BC가 1칸이므로 AC는 2칸입니다.']),
    draw: (b, s, M, C) => {
      const st = C.step, X = (c) => (c * W) / M.n;
      for (let i = 0; i < M.n; i++) { const isCB = i === M.n - 1; cell(b, X, 0, i, isCB ? 'rose' : 'sky', hl(st, st === 1 ? true : st === 2 ? !isCB : true), '1칸'); }
      [[0, 'A', 'ink'], [M.k / 2, 'M', 'green'], [M.k, 'C', 'amber'], [M.n, 'B', 'ink']].forEach(([c, n, col]) => pt(b, X(c), 0.46, n, { color: col, dy: 22 }));
      if (!C.hide) {
        PL.dim(b, { x: X(0), y: -1.9 }, { x: X(M.k), y: -1.9 }, `AC = ${M.k}칸 = ${M.AC} cm`, { color: 'sky', dy: -16, width: 3 });
        PL.dim(b, { x: X(M.k), y: -1.9 }, { x: X(M.n), y: -1.9 }, `CB = 1칸`, { color: 'rose', dy: -16, width: 3 });
        PL.dim(b, { x: X(M.k / 2), y: 2.0 }, { x: X(M.n), y: 2.0 }, `MB = ${M.k / 2 + 1}칸 = ${M.MB} cm`, { color: 'green', dy: 18, width: st >= 3 || st >= 99 ? 6 : 3.4 });
        PL.dim(b, { x: X(0), y: 3.4 }, { x: X(M.n), y: 3.4 }, `AB = ${M.n}칸 = ${M.AB} cm`, { color: 'ink', dy: 18, width: 2.6 });
      } else {
        PL.dim(b, { x: X(0), y: -1.9 }, { x: X(M.n), y: -1.9 }, 'AB', { color: 'ink', dy: -16 });
      }
    },
    quiz: (M, s, rng) => {
      const u = M.u, k = M.k, kind = (s.plSeed || 0) % 2;
      if (kind === 0) {
        const ans = (k / 2 + 1) * u;
        return { tag: '길이의 비와 중점', stem: `선분 AB 위의 점 C에 대하여 $\\overline{AC}=${k}\\overline{CB}$이고, 점 M은 선분 AC의 중점이다. $\\overline{AB}=${M.AB}$ cm일 때, $\\overline{MB}$의 길이는?`, choices: PL.numChoices(ans, [{ v: (k / 2) * u, hint: 'MC(또는 AM)의 길이예요. MB는 MC에 CB를 더해야 해요.' }, { v: k * u, hint: 'AC의 길이예요.' }, { v: u, hint: 'CB의 길이예요.' }, { v: M.AB + u, hint: '칸 수를 다시 세어 보세요.' }], { fmt: (v) => `${v} cm` }) };
      }
      return { tag: '길이의 비와 중점', stem: `선분 AB 위의 점 C에 대하여 $\\overline{AC}=${k}\\overline{CB}$이고, 점 M은 선분 AC의 중점이다. $\\overline{MC}=${(k / 2) * u}$ cm일 때, $\\overline{AB}$의 길이는?`, choices: PL.numChoices(M.AB, [{ v: M.AC, hint: 'AC의 길이예요. AB는 CB(1칸)까지 더해야 해요.' }, { v: M.MB, hint: 'MB의 길이예요. AB는 전체예요.' }, { v: M.AB + u, hint: '칸 수를 다시 세어 보세요.' }, { v: (k / 2) * u, hint: 'MC의 길이예요.' }], { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { s.rK = 2 * PL.randInt(rng, 1, 3); s.rU = PL.randInt(rng, 1, 6); }
  });

  /* ================================================================== 서술형: 방정식 */
  const lin = (a, c) => (a === 1 ? 'x' : `${a}x`) + (c ? ` + ${c}` : '');
  const linT = (a, c) => (a === 1 ? 'x' : `${a}x`) + (c ? `+${c}` : '');
  const eqInit = (rng) => {
    const r = rng || Math.random;
    const q = 1 + Math.floor(r() * 3), p = q + 1 + Math.floor(r() * 3), x0 = 2 + Math.floor(r() * 8), c1 = Math.floor(r() * 5), c2 = c1 + (p - q) * x0;
    return r() < 0.5 ? { eA: p, eB: c1, eC: q, eD: c2, ex0: x0 } : { eA: q, eB: c2, eC: p, eD: c1, ex0: x0 };
  };
  const sEq = PL.scene({
    id: 'm-eq', title: '중점으로 방정식 세우기', short: '중점과 방정식',
    box: [-1.0, -3.0, 13.0, 5.0],
    question: 'M이 선분 AB의 중점이면 AM = MB입니다. 이 식으로 x를 어떻게 구할까요?',
    init: () => Object.assign({ eX: 1 }, eqInit(() => 0.37)), // 처음 장면: 2x+... 형태의 고정 예
    controls: ['eX'],
    model: (s) => {
      const { eA: a, eB: bb, eC: c, eD: d } = s, x0 = (d - bb) / (a - c), x = s.eX;
      return { a, bb, c, d, x0, x, am: a * x + bb, mb: c * x + d, AB0: 2 * (a * x0 + bb), AM0: a * x0 + bb, eq: x === x0 };
    },
    guide: (M) => `<b>AM = (${lin(M.a, M.bb)}) cm</b>, <b>MB = (${lin(M.c, M.d)}) cm</b>입니다. 막대로 <b>x의 값</b>을 바꾸며 M이 AB의 가운데(AM = MB)가 되는 x를 찾아보세요. 같아지면 초록색 =이 켜집니다.`,
    readouts: (M) => [{ label: `AM = ${linT(M.a, M.bb)}`, value: `${M.am} cm`, color: 'sky' }, { label: `MB = ${linT(M.c, M.d)}`, value: `${M.mb} cm`, color: 'rose' }, { label: 'AM과 MB', value: M.am === M.mb ? '같다 (M이 중점)' : `${Math.abs(M.am - M.mb)} cm 차이`, color: M.am === M.mb ? 'green' : 'muted' }],
    steps: (M) => [
      `M이 선분 AB의 중점이므로 AM = MB 입니다.`,
      `식을 세웁니다. ${lin(M.a, M.bb)} = ${lin(M.c, M.d)}. x끼리 모으면 ${Math.max(M.a, M.c) - Math.min(M.a, M.c)}x = ${Math.abs(M.d - M.bb)}`,
      `x = ${M.x0}. 이때 AM = ${M.AM0} cm 이므로 AB = 2 × AM = ${M.AB0} cm`
    ],
    formula: (M) => `<p>$\\overline{AM}=\\overline{MB}$ ⟹ $${linT(M.a, M.bb)}=${linT(M.c, M.d)}$ ⟹ $x=${M.x0}$</p><p>$\\overline{AB}=2\\overline{AM}=2\\times${M.AM0}=${M.AB0}$ (cm)</p>`,
    rule: () => '중점이면 두 조각의 길이가 같다: AM = MB',
    notes: () => note(['풀이가 끝나면 <b>x를 식에 넣어 AM, MB가 정말 같은지</b> 확인하세요.', 'AB의 길이를 물으면 x만 구하고 끝내지 말고 <b>AM + MB</b>(= 2AM)까지 계산합니다.']),
    draw: (b, s, M, C) => {
      const st = C.step, showTruth = (C.tab === 'review' && st >= 3), hide = C.hide;
      const x = showTruth ? M.x0 : M.x, am = M.a * x + M.bb, mb = M.c * x + M.d, tot = am + mb, X = (c) => (c * W) / tot;
      const same = hide ? true : am === mb;
      const mpos = hide ? W / 2 : X(am);
      b.seg({ x: 0, y: 0 }, { x: mpos, y: 0 }, { color: 'sky', width: 8, cap: 'butt', alpha: hl(st, st === 1 || st >= 2) });
      b.seg({ x: mpos, y: 0 }, { x: W, y: 0 }, { color: 'rose', width: 8, cap: 'butt', alpha: hl(st, st === 1 || st >= 2) });
      if (same) { b.ticks({ x: 0, y: 0 }, { x: mpos, y: 0 }, { color: 'ink' }); b.ticks({ x: mpos, y: 0 }, { x: W, y: 0 }, { color: 'ink' }); }
      pt(b, 0, 0, 'A'); pt(b, W, 0, 'B'); pt(b, mpos, 0, 'M', { color: same ? 'green' : 'amber' });
      const labA = hide ? `AM = (${lin(M.a, M.bb)}) cm` : `AM = ${linT(M.a, M.bb)} = ${am} cm`, labB = hide ? `MB = (${lin(M.c, M.d)}) cm` : `MB = ${linT(M.c, M.d)} = ${mb} cm`;
      T(b, { x: mpos / 2, y: 0 }, labA, { dy: -24, color: 'sky', size: 15 });
      T(b, { x: (mpos + W) / 2, y: 0 }, labB, { dy: -24 - (mpos / 2 + 3.3 > (mpos + W) / 2 - 3.3 ? 24 : 0), color: 'rose', size: 15 });
      if (!hide) {
        T(b, { x: W / 2, y: 2.0 }, same ? `AM = MB  (x = ${x})` : `AM ≠ MB  (x = ${x})`, { color: same ? 'green' : 'muted', size: 18 });
        T(b, { x: W / 2, y: 3.2 }, `AB = ${am} + ${mb} = ${tot} cm`, { color: 'ink', size: 16 });
      } else T(b, { x: W / 2, y: 2.7 }, `AM = MB  (M은 AB의 중점)`, { color: 'green', size: 17 });
      if (!hide) b.handle('x', { x: mpos, y: 0 }, { color: 'amber', ariaLabel: 'x의 값 바꾸기', drag: (w) => { const r = clamp(w.x / W, 0.05, 0.95); let best = s.eX, bd = 1e9; for (let t = 0; t <= 14; t++) { const A2 = M.a * t + M.bb, B2 = M.c * t + M.d, d = Math.abs(A2 / (A2 + B2) - r); if (d < bd) { bd = d; best = t; } } s.eX = best; } });
    },
    quiz: (M, s, rng) => {
      const kind = (s.plSeed || 0) % 2;
      const stem = `선분 AB의 중점을 M이라 하자. $\\overline{AM}=(${linT(M.a, M.bb)})$ cm, $\\overline{MB}=(${linT(M.c, M.d)})$ cm일 때, `;
      if (kind === 0) return { tag: '중점과 일차방정식', stem: stem + '$x$의 값은?', choices: PL.numChoices(M.x0, [{ v: M.x0 + 1, hint: '식을 다시 풀어 보세요. AM = MB 에서 x항을 한쪽으로 모아요.' }, { v: M.x0 - 1, hint: '식을 다시 풀어 보세요.' }, { v: Math.round((M.d + M.bb) / (M.a + M.c)), hint: 'AM = MB 이므로 두 식을 더하는 것이 아니라 같다고 놓아요.' }, { v: M.AM0, hint: 'AM의 길이예요. 구하는 것은 x의 값이에요.' }], { fmt: (v) => String(v) }) };
      return { tag: '중점과 일차방정식', stem: stem + '$\\overline{AB}$의 길이는?', choices: PL.numChoices(M.AB0, [{ v: M.AM0, hint: 'AM의 길이예요. AB = AM + MB = 2 × AM 이에요.' }, { v: M.x0, hint: 'x의 값이에요. 길이를 구하려면 x를 식에 넣어요.' }, { v: M.AB0 + 2, hint: 'x를 식에 대입해 계산을 다시 확인하세요.' }, { v: M.AB0 - 2, hint: 'x를 식에 대입해 계산을 다시 확인하세요.' }], { fmt: (v) => `${v} cm` }) };
    },
    reroll: (s, rng) => { Object.assign(s, eqInit(rng), { eX: 1 }); }
  });

  PL.group({
    order: 30, id: 'mid', title: '중점과 거리', short: '중점과 거리', params: PARAMS,
    scenes: [sMid, sDbl, sTri, sRatio, sEq]
  });
})();
