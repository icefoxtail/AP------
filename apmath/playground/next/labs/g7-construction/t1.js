/* ==========================================================================
   중1 · 작도와 합동 — 탭 ① 「작도」 (t1.js, order 10) — 장면 5개
   · c1-1 자와 컴퍼스의 쓰임        · 눈금 없는 자는 직선만, 컴퍼스는 원(호)과 길이 옮기기
   · c1-2 크기가 같은 각의 작도     · 단계 플레이어(5단계) · 완성한 각을 가로로 밀어 겹쳐 보기
   · c1-3 평행선의 작도(동위각)     · 단계 플레이어(6단계) · 점 P 끌기 · 직선 l 기울기
   · c1-4 평행선의 작도(엇각)       · 같은 작도의 엇각판
   · c1-5 작도 순서                 · 순서 칩을 눌러 한 단계씩 그리기(앞 단계가 있어야 다음 단계 가능)
   작도는 학생이 호를 끌어 그리지 않고, 단계 플레이어(▶·막대)로 순서대로 봅니다. 길이·각은 지금의 값으로 다시 계산됩니다.
   ========================================================================== */
(function () {
  'use strict';
  const G = window.APL_CN;
  if (!G) return;
  const { DEG, clamp, ease, seg01, pt, add, sub, mul, unit, mid, dist, polar, dirDeg, angBetween, pick, rint, T, ang, tick, par, line, arcPart, fit, P, mkChoices, mkTextChoices, seeded, shuffle, rd, notes, fmtN, dg, ol, cmF, degF, textW } = G;
  const dv = (d) => pt(Math.cos(d * DEG), Math.sin(d * DEG));
  const pctF = (v) => Math.round(v * 100) + '%';
  const fsOf = (t, n) => Array.from({ length: n }, (_, i) => clamp(t * n - i, 0, 1));
  const KL = ['㉠', '㉡', '㉢', '㉣', '㉤', '㉥'];

  const PARAMS = {
    cnL: P('선분 AB의 길이', 2, 4, 0.5, 3, { color: 'sky', format: cmF, hint: '노란 점 B를 끌어도 돼요' }),
    cnPhi: P('반직선의 기울기', 5, 40, 1, 20, { color: 'amber', format: degF }),
    cnT1: P('길이 옮기기', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌어 보세요', format: pctF }),
    cnTh: P('∠XOY의 크기', 20, 110, 1, 55, { color: 'sky', format: degF, hint: '노란 점 Y를 끌어도 돼요' }),
    cnR: P('컴퍼스를 벌린 길이', 1.4, 2.6, 0.1, 2, { color: 'amber', format: (v) => fmtN(v) }),
    cnT2: P('작도 단계', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 한 단계씩 그려져요', format: (v) => (v <= 0 ? '시작 전' : '단계 ' + Math.min(5, Math.floor(v * 5 - 1e-9) + 1)) }),
    cnS: P('가로로 밀어 겹쳐 보기', 0, 1, 0.01, 0, { color: 'rose', hint: '작도가 끝난 뒤 막대를 끌면 새 각이 왼쪽으로 밀려가 겹쳐요', format: pctF }),
    cnPAl: P('직선 l의 기울기', -20, 20, 1, 0, { color: 'sky', format: degF }),
    cnPR: P('컴퍼스를 벌린 길이', 1.1, 1.6, 0.1, 1.4, { color: 'amber', format: (v) => fmtN(v) }),
    cnPT: P('작도 단계', 0, 1, 0.01, 0, { color: 'green', hint: '▶를 누르거나 막대를 끌면 한 단계씩 그려져요', format: (v) => (v <= 0 ? '시작 전' : '단계 ' + Math.min(6, Math.floor(v * 6 - 1e-9) + 1)) })
  };
  const sign = (v) => (v < 0 ? -1 : 1);
  const caption = (b, text, color = 'amber', y1 = 0, cx = 0, dyp = 36) => T(b, pt(cx, y1), text, { dy: dyp, size: b.W < 560 ? 14 : 17, color, ref: 'cap' });
  const eqSeg = (s1, s2) => `$${ol(s1)}=${ol(s2)}$`;

  /* ====================================================================== 컴퍼스 그림 (바늘 N, 연필 Pn) */
  function compass(b, N, Pn, color = 'ink') {
    const m = mid(N, Pn), d = unit(sub(Pn, N));
    let nrm = pt(d.y, -d.x);
    if (nrm.y > 0) nrm = mul(nrm, -1);
    const H = add(m, mul(nrm, Math.max(0.9, 0.55 * dist(N, Pn) + 0.4)));
    line(b, N, H, color, 3.2); line(b, Pn, H, color, 3.2);
    b.point(H, { color, r: 5 });
    b.point(N, { color: 'ink', r: 3.2 });
    b.point(Pn, { color: 'amber', r: 4.6 });
  }

  /* ====================================================================== 1. 자와 컴퍼스의 쓰임 */
  const TOOLS = [['ruler', '눈금 없는 자'], ['compass', '컴퍼스']];
  const tools = {
    id: 'c1-1', title: '자와 컴퍼스의 쓰임', short: '자와 컴퍼스',
    question: '눈금 없는 자와 컴퍼스로는 무엇을 그릴 수 있을까? 선분 AB와 같은 길이를 다른 곳에 옮길 수 있을까?',
    ctl: ['cnL', 'cnPhi', 'cnT1'], anim: { key: 'cnT1', dur: 5, label: '길이 옮기기', start: 0 },
    presets: () => TOOLS.map(([id, label], i) => ({ group: i === 0 ? '도구' : '', label, apply: (s) => { s.cnTool = id; s.cnT1 = 0; s.playing = false; }, on: (s) => (s.cnTool || 'compass') === id })),
    init: (s) => { s.cnL = 3; s.cnPhi = 20; s.cnT1 = 0; s.cnTool = 'compass'; s.cnKind = 0; s.cnPk = { c: 0, w: [0, 1, 2, 3] }; },
    reroll: (s) => { s.cnL = pick([2, 2.5, 3, 3.5, 4], s.cnL); s.cnPhi = rint(10, 35); s.cnKind = s.cnKind === 0 ? 1 : 0; s.cnPk = { c: rint(0, 2), w: shuffle([0, 1, 2, 3, 4], Math.random).slice(0, 4) }; },
    model: (s) => ({ L: clamp(s.cnL, 2, 4), phi: clamp(s.cnPhi, 5, 40), tool: s.cnTool || 'compass', kind: s.cnKind || 0, pk: s.cnPk || { c: 0, w: [0, 1, 2, 3] } }),
    draw(b, s, M, C) {
      const { L, phi } = M, tool = C.review ? (C.step <= 1 ? 'ruler' : 'compass') : C.problem ? 'compass' : M.tool;
      const A = pt(-5.6, 0), B = pt(-5.6 + L, 0), Pp = pt(0.6, 0), dx = Pp.x - A.x;
      fit(b, { x0: -6.4, x1: 6.4, y0: -3.8, y1: 0.2 }, { t: 30, b: 104 });
      const t = C.problem ? 1 : C.t;
      if (tool === 'ruler') {
        const f1 = ease(clamp(t / 0.35, 0, 1)), f2 = seg01(t, 0.3, 1);
        const x0 = -6.4 - 9 * (1 - f1);
        b.path([pt(x0, 0.18), pt(x0 + 9, 0.18), pt(x0 + 9, 0.95), pt(x0, 0.95)], { close: true, fill: 'muted', fillAlpha: 0.25, color: 'muted', width: 2 });
        if (C.txt) T(b, pt(x0 + 4.5, 0.57), '눈금 없는 자', { size: 14, color: 'ink' });
        line(b, pt(lerpX(A.x, -6.3, f2), 0), pt(lerpX(B.x, 6.3, f2), 0), 'green', 3.4);
        b.point(A, { color: 'sky', r: 5 }); b.point(B, { color: 'sky', r: 5 });
        T(b, A, 'A', { dy: -18, size: 17 }); T(b, B, 'B', { dy: -18, size: 17 });
        if (C.txt && f2 > 0.7) T(b, pt(6.3, 0), '직선 AB', { dx: -34, dy: -18, size: 15, color: 'green' });
        if (C.txt) T(b, pt(0, 0), t < 0.05 ? '▶를 누르면 자가 들어와 직선을 그어요' : '두 점을 지나는 직선을 그릴 수 있어요', { dy: 66, size: 15, color: 'amber' });
        if (C.txt) T(b, pt(0, 0), '눈금이 없어서 길이는 잴 수 없어요', { dy: 92, size: 15, color: 'rose' });
        if (!C.problem && !C.review && C.txt) b.handle('B', B, { color: 'amber', r: 8, ariaLabel: '점 B 끌기', drag: (w) => { s.cnL = clamp(Math.round((w.x - A.x) * 2) / 2, 2, 4); } });
        return;
      }
      const f1 = seg01(t, 0, 0.4), f2 = seg01(t, 0.4, 1);
      const R = polar(Pp, 5.4, -phi), Q = polar(Pp, L, -phi);
      line(b, A, B, 'sky', 4);
      b.point(A, { color: 'sky', r: 5 }); b.point(B, { color: 'sky', r: 5 });
      T(b, A, 'A', { dy: 22, size: 17 }); T(b, B, 'B', { dy: 22, size: 17 });
      line(b, Pp, R, 'ink', 3.2);
      b.point(Pp, { color: 'ink', r: 5 });
      T(b, Pp, 'P', { dx: -4, dy: 22, size: 17 });
      if (C.txt) {
        T(b, mid(A, B), `AB = ${fmtN(L)} cm`, { dy: 50, size: 16, color: 'sky' });
      }
      // 컴퍼스: 바늘 N, 연필 Pn
      const e = ease(f1), N = pt(A.x + dx * e, 0);
      let Pn = pt(B.x + dx * e, 0);
      if (f2 > 0) Pn = polar(Pp, L, -(phi + 25) * f2);
      if (f2 > 0) arcPart(b, Pp, L, 0, -(phi + 25), f2, 'green', { pen: false, width: 3 });
      compass(b, N, Pn, 'ink');
      if (f2 >= 0.999 || C.problem) {
        b.point(Q, { color: 'green', r: 5.5 });
        T(b, Q, 'Q', { dx: -16, dy: -14, size: 17 });
        if (!C.problem) { tick(b, A, B, 1, 'amber'); tick(b, Pp, Q, 1, 'amber'); }
        if (C.txt && !C.problem) T(b, mid(Pp, Q), `PQ = ${fmtN(L)} cm`, { dx: 4, dy: 30, size: 16, color: 'green' });
      }
      if (C.txt && !C.problem) caption(b, f1 <= 0 ? '컴퍼스를 AB의 길이만큼 벌려요' : f2 <= 0 ? '벌린 그대로 점 P로 옮겨요' : f2 < 1 ? '점 P에 바늘을 꽂고 호를 그려요' : '반직선과 만나는 점 Q → PQ = AB', 'amber', 0.2, 0, 84);
      if (!C.problem && !C.review && C.txt) {
        b.handle('B', B, { color: 'amber', r: 8, ariaLabel: '점 B 끌기', drag: (w) => { s.cnL = clamp(Math.round((w.x - A.x) * 2) / 2, 2, 4); } });
        b.handle('R', R, { color: 'amber', r: 8, ariaLabel: '반직선 기울이기', drag: (w) => { s.cnPhi = clamp(-dirDeg(Pp, w), 5, 40); } });
      }
    },
    stepT: () => 1,
    steps: (M) => [
      '눈금 없는 자로는 두 점을 지나는 선분·직선·반직선만 그을 수 있어요. 길이는 잴 수 없어요.',
      '컴퍼스로는 원이나 호를 그릴 수 있어요.',
      `컴퍼스를 선분 AB의 길이(${fmtN(M.L)} cm)만큼 벌려 점 P에 바늘을 꽂고 호를 그리면, 반직선과 만나는 점 Q에서 PQ = AB = ${fmtN(M.L)} cm예요. 이것이 길이 옮기기예요.`
    ],
    view: (M, C) => ({
      guide: '<b>도구</b> 칩으로 자와 컴퍼스를 골라 ▶를 눌러 보세요. 컴퍼스 모드에서는 <b>노란 점</b> B를 끌어 AB의 길이를, 반직선 끝을 끌어 기울기를 바꿀 수 있어요.',
      readouts: [rd('선분 AB', `${fmtN(M.L)} cm`, 'sky'), rd('옮긴 선분 PQ', `${fmtN(M.L)} cm`, 'green', 'PQ = AB')],
      formula: `<p>컴퍼스 벌림 = $${ol('AB')}=${fmtN(M.L)}$ cm, 점 P에서 반지름 ${fmtN(M.L)} cm인 호</p><p>$${ol('PQ')}=${ol('AB')}=${fmtN(M.L)}$ cm</p>`,
      rule: '눈금 없는 자: 직선 긋기 / 컴퍼스: 원 그리기, 선분의 길이 옮기기',
      notes: notes('눈금 없는 자로는 길이를 재거나 눈금을 읽지 않아요. 길이를 옮길 때는 컴퍼스를 써요.', '각도기·삼각자로 그리는 것은 작도가 아니에요.')
    }),
    prob: (M) => {
      if (M.kind === 1) {
        const l = M.L;
        return {
          tag: '컴퍼스로 길이 옮기기', key: `k1L${l}`,
          stem: `그림은 점 P에서 선분 AB(${fmtN(l)} cm)의 길이를 컴퍼스로 옮겨, 점 P를 중심으로 반지름이 $\\overline{AB}$인 호를 그려 반직선과 만나는 점을 Q라 한 것이다. $\\overline{PQ}$의 길이는?`,
          choices: mkChoices(l, [[l * 2, '컴퍼스를 벌린 길이는 AB 그대로예요. 2배가 되지 않아요.'], [l + 1, '길이는 그대로 옮겨져요. 더하지 않아요.'], [l - 1, '길이는 그대로 옮겨져요. 줄지 않아요.'], [l / 2, '컴퍼스를 벌린 길이는 AB 그대로예요.']], { tex: (v) => `${fmtN(v)}\\text{ cm}`, plain: (v) => fmtN(v) + ' cm', pad: 1, valid: (v) => v > 0.4 })
        };
      }
      const good = ['두 점을 지나는 직선을 긋는다.', '선분의 길이를 다른 곳으로 옮긴다.', '주어진 점을 중심으로 하는 원을 그린다.'];
      const bad = ['눈금을 읽어 5 cm인 선분을 긋는다.', '각도기로 70°인 각을 그린다.', '삼각자의 직각을 이용하여 수선을 긋는다.', '삼각자를 밀어 평행선을 긋는다.', '두 선분의 길이를 눈금으로 비교한다.'];
      const items = [{ h: good[M.pk.c], ok: true }].concat(M.pk.w.slice(0, 4).map((i) => ({ h: bad[i], hint: '눈금 없는 자·컴퍼스로는 할 수 없어요. 작도는 이 두 도구만 써요.' })));
      return { tag: '작도에 쓰이는 도구', key: `k0c${M.pk.c}w${M.pk.w.join('')}`, stem: '작도에서 눈금 없는 자와 컴퍼스만으로 할 수 있는 것은?', choices: mkTextChoices(items, `k0c${M.pk.c}w${M.pk.w.join('')}`), wide: true };
    }
  };
  function lerpX(a, b, f) { return a + (b - a) * f; }

  /* ====================================================================== 2. 크기가 같은 각의 작도 */
  const D2 = 6.0, LR = 3.6;
  const angGeo = (th, r, S) => {
    const O = pt(0, 0), Pp = pt(D2 - D2 * S, 0);
    return { O, Pp, X: pt(LR, 0), Y: polar(O, LR, -th), A: pt(r, 0), B: polar(O, r, -th), Q: pt(Pp.x + LR, 0), Cc: pt(Pp.x + r, 0), Dd: polar(Pp, r, -th), th, r, ab: 2 * r * Math.sin(th * DEG / 2) };
  };
  const ANG_CAP = ['① 점 O를 중심으로 호를 그려 A, B 찾기', '② 점 P를 중심으로 같은 반지름의 호 → C', '③ 컴퍼스로 AB의 길이 재기', '④ 점 C를 중심으로 반지름 AB인 호 → D', '⑤ 반직선 PD 긋기 → ∠QPD = ∠XOY'];
  function drawAng(b, M, C, fs, o) {
    const g = angGeo(M.th, M.r, M.S), { O, Pp, X, Y, A, B, Q, Cc, Dd, th, r } = g;
    const moved = M.S > 0.02;
    line(b, O, X, 'ink', 3.2); line(b, O, Y, 'ink', 3.2);
    line(b, Pp, Q, 'ink', 3.2);
    // 1: O 중심 호
    arcPart(b, O, r, 8, -th - 8, fs[0], 'ink');
    // 2: P 중심 호(C 근처)
    arcPart(b, Pp, r, 8, -8, fs[1], 'ink');
    // 3: AB 재기
    if (fs[2] > 0) line(b, A, B, 'amber', fs[3] > 0 ? 2.4 : 4.2, { alpha: fs[3] > 0 ? 0.65 : 1 });
    // 4: C 중심 호, P 중심 호 연장
    const dir = dirDeg(Cc, Dd);
    arcPart(b, Cc, g.ab, dir + 12, dir - 12, fs[3], 'ink');
    arcPart(b, Pp, r, -8, -th - 8, fs[3], 'ink');
    if (fs[3] >= 1) line(b, Cc, Dd, 'amber', 2.4, { alpha: 0.65 });
    // 5: 반직선 PD
    if (fs[4] > 0) line(b, Pp, mix(Pp, Dd, LR / r * fs[4]), 'green', 3.4);
    const f5 = fs[4] >= 0.999;
    if (o.ticks) {
      if (fs[0] >= 1) { tick(b, O, A, 1); tick(b, O, B, 1); }
      if (fs[1] >= 1) tick(b, Pp, Cc, 1);
      if (fs[3] >= 1) { tick(b, Pp, Dd, 1); tick(b, Cc, Dd, 2); }
      if (fs[2] > 0) tick(b, A, B, 2);
    }
    if (o.marks) {
      ang(b, O, X, Y, { color: 'sky', rings: 1, label: dg(th), r: 30, labelDist: 52 });
      if (f5 && !o.problem) ang(b, Pp, Q, Dd, { color: moved ? 'green' : 'sky', rings: 1, label: dg(th), r: 30, labelDist: 52 });
    }
    // 점과 이름
    b.point(O, { color: 'ink', r: 4.8 }); b.point(Pp, { color: 'ink', r: 4.8 });
    if (!o.noNames) {
      T(b, O, 'O', { dx: -14, dy: 16, size: 17 }); T(b, X, 'X', { dy: 18, size: 17 }); T(b, Y, 'Y', { dx: Y.x < 0 ? -12 : 4, dy: -14, size: 17 });
      if (!moved) { T(b, Pp, 'P', { dx: -14, dy: 16, size: 17 }); T(b, Q, 'Q', { dy: 18, size: 17 }); }
      const lab = (p, c, a1, name) => // 호가 점을 지나 조금 더 뻗은 쪽 끝 너머에 이름을 놓습니다
         { const e = unit(sub(polar(c, r, a1 + (a1 > -th / 2 ? 5 : -5)), p)); T(b, p, name, { dx: e.x * 30, dy: e.y * 30, size: 16 }); };
      if (fs[0] >= 1) { b.point(A, { color: 'sky', r: 4.2 }); b.point(B, { color: 'sky', r: 4.2 }); lab(A, O, 0, 'A'); lab(B, O, -th, 'B'); }
      if (fs[1] >= 1 && !moved) { b.point(Cc, { color: 'sky', r: 4.2 }); lab(Cc, Pp, 0, 'C'); }
      if (fs[3] >= 1 && !moved) { b.point(Dd, { color: 'sky', r: 4.2 }); lab(Dd, Pp, -th, 'D'); }
    }
    return g;
  }
  const mix = (a, b, f) => pt(a.x + (b.x - a.x) * f, a.y + (b.y - a.y) * f);
  const angStage = (T0) => (T0 <= 0 ? 0 : Math.min(5, Math.floor(T0 * 5 - 1e-9) + 1));

  const copyAng = {
    id: 'c1-2', title: '크기가 같은 각의 작도', short: '같은 각 작도',
    question: '∠XOY와 크기가 같은 각을 눈금 없는 자와 컴퍼스만으로 어떻게 그릴 수 있을까?',
    ctl: ['cnTh', 'cnR', 'cnT2', 'cnS'], anim: { key: 'cnT2', dur: 9, label: '작도 보기', start: 0 },
    init: (s) => { s.cnTh = 55; s.cnR = 2; s.cnT2 = 0; s.cnS = 0; s.cnPk = { th: 40, f: 0, t: [0, 1, 2, 3] }; },
    reroll: (s) => { s.cnTh = pick([35, 40, 50, 70, 80, 100], s.cnTh); s.cnR = pick([1.8, 2, 2.2, 2.4], s.cnR); s.cnPk = { th: s.cnTh, f: rint(0, 4), t: shuffle([0, 1, 2, 3, 4, 5, 6], Math.random).slice(0, 4) }; s.cnT2 = 1; s.cnS = 0; },
    model: (s) => ({ th: clamp(Math.round(s.cnTh), 20, 110), r: clamp(s.cnR, 1.4, 2.6), S: clamp(s.cnS, 0, 1), T: s.cnS > 0.001 ? 1 : clamp(s.cnT2, 0, 1), pk: s.cnPk || { th: 40, f: 0, t: [0, 1, 2, 3] } }),
    draw(b, s, M, C) {
      fit(b, { x0: -1.6, x1: D2 + LR + 0.3, y0: -3.9, y1: 0.6 }, { t: 24, b: 66 });
      const tt = C.problem ? 1 : C.review ? C.t : M.S > 0.001 ? 1 : C.t;
      const fs = fsOf(C.problem ? 1 : tt, 5);
      const mm = C.problem ? { ...M, th: M.pk.th, S: 0 } : M;
      const stage = C.review ? C.step : angStage(tt);
      const g = drawAng(b, mm, C, fs, { ticks: !C.problem, marks: true, problem: C.problem });
      if (C.txt && !C.problem) {
        if (M.S > 0.02 && fs[4] >= 1) caption(b, M.S > 0.98 ? '완전히 겹쳐요 → ∠QPD = ∠XOY' : '새 각을 왼쪽으로 밀어 겹쳐 봐요', 'green', 0.6, 4.2);
        else caption(b, stage <= 0 ? '▶를 누르거나 막대를 끌어 작도를 시작해요' : ANG_CAP[stage - 1], 'amber', 0.6, 4.2);
      }
      if (!C.problem && !C.review && C.txt) b.handle('Y', g.Y, { color: 'amber', r: 8, ariaLabel: '각 XOY 크기 조절', drag: (w) => { s.cnTh = clamp(Math.round(-dirDeg(g.O, w)), 20, 110); } });
    },
    stepT: (n) => n / 5,
    steps: (M) => [
      `점 O를 중심으로 하는 원을 그려 반직선 OX, OY와 만나는 점을 각각 A, B라 해요. (반지름 ${fmtN(M.r)})`,
      `점 P를 중심으로 반지름이 같은 원을 그려 반직선 PQ와 만나는 점을 C라 해요. $${ol('OA')}=${ol('OB')}=${ol('PC')}$`,
      `컴퍼스로 $${ol('AB')}$의 길이를 재요.`,
      `점 C를 중심으로 반지름이 $${ol('AB')}$인 원을 그려 앞의 원과 만나는 점을 D라 해요. $${ol('CD')}=${ol('AB')}$`,
      `반직선 PD를 그어요. 세 변이 같은 두 삼각형 OAB, PCD가 합동이라 $\\angle QPD=\\angle XOY=${fmtN(M.th)}^{\\circ}$예요.`
    ],
    view: (M, C) => ({
      guide: '▶를 누르거나 <b>작도 단계</b> 막대를 끌면 한 단계씩 그려져요. <b>노란 점</b> Y로 ∠XOY의 크기를, 막대로 컴퍼스 벌림을 바꾸고, 마지막에 <b>밀어 겹쳐 보기</b>를 움직여 두 각이 같은지 확인해 보세요.',
      readouts: [rd('∠XOY', dg(M.th), 'sky'), rd('새로 그린 ∠QPD', M.T >= 1 ? dg(M.th) : '작도 중', 'green', '크기가 같아요'), rd('같은 길이(눈금 1개)', `OA = OB = PC = PD = ${fmtN(M.r)}`, 'amber', '', null, true), rd('같은 길이(눈금 2개)', 'AB = CD', 'amber', '', null, true)],
      formula: `<p>$${ol('OA')}=${ol('OB')}=${ol('PC')}=${ol('PD')}=${fmtN(M.r)}$, $${ol('AB')}=${ol('CD')}$</p><p>$\\angle QPD=\\angle XOY=${fmtN(M.th)}^{\\circ}$</p>`,
      rule: '반지름이 같은 호와, 컴퍼스로 옮긴 AB의 길이로 크기가 같은 각을 그린다',
      notes: notes('먼저 그린 호와 나중에 그린 호의 반지름은 <b>같아야</b> 해요. 컴퍼스를 벌린 채로 옮겨요.', '마지막 호는 반지름을 $\\overline{AB}$로 해요. 반지름 $\\overline{OA}$가 아니에요.')
    }),
    prob: (M) => {
      const k = M.pk, th = k.th;
      const T4 = ['OA=OB', 'PC=PD', 'OA=PC', 'OB=PD', 'OB=PC', 'AB=CD', 'OA=PD'];
      const F = [['OA', 'AB'], ['OB', 'CD'], ['PC', 'CD'], ['PD', 'AB'], ['OA', 'CD']];
      const f = F[k.f];
      const wrong = { h: `$${ol(f[0])}=${ol(f[1])}$`, ok: true };
      const items = [wrong].concat(k.t.map((i) => { const [a, bb] = T4[i].split('='); return { h: `$${ol(a)}=${ol(bb)}$`, hint: `이 두 선분은 길이가 같아요. 옳지 않은 것을 찾아야 해요.` }; }));
      items[0].hint = '';
      return {
        tag: '크기가 같은 각의 작도 · 길이가 같은 선분', key: `th${th}f${k.f}t${k.t.join('')}`,
        stem: `그림은 ∠XOY와 크기가 같은 각을 반직선 PQ를 한 변으로 하여 작도한 것이다. 다음 중 옳지 않은 것은?`,
        choices: mkTextChoices(items, `th${th}f${k.f}t${k.t.join('')}`),
        note: `같은 반지름 4개, 컴퍼스로 옮긴 길이 2개를 찾아 보세요`
      };
    }
  };

  /* ====================================================================== 3·4. 평행선의 작도 (동위각·엇각) */
  const dvv = (d) => pt(Math.cos(d * DEG), Math.sin(d * DEG));
  function parGeo(px, ph, alpha, r, mode) {
    const Q = pt(0, 0), aL = -alpha, dl = dvv(aL), n = pt(dl.y, -dl.x);
    const Pp = add(mul(dl, px), mul(n, ph));
    const u = unit(sub(Pp, Q)), au = dirDeg(Q, Pp), off = mode === 'alt' ? 180 : 0;
    const A = add(Q, mul(dl, r)), B = add(Q, mul(u, r));
    const Cc = add(Pp, mul(dvv(au + off), r)), Dd = add(Pp, mul(dvv(aL + off), r));
    const th = angBetween(Q, A, Pp);
    let wv = pt(u.y, -u.x); if (wv.x * dl.x + wv.y * dl.y > 0) wv = mul(wv, -1); // 가로선 l 의 방향 dl 과 반대쪽(왼쪽) 법선
    return { Q, Pp, dl, n, u, au, aL, ac: au + off, ad: aL + off, A, B, Cc, Dd, th, r, ab: dist(A, B), wv, mode };
  }
  const PAR_CAP = ['① 직선 PQ를 그어요', '② 점 Q를 중심으로 호를 그려 l, PQ와 만나는 점 A, B', '③ 점 P를 중심으로 같은 반지름의 호 → C', '④ 컴퍼스로 AB의 길이 재기', '⑤ 점 C를 중심으로 반지름 AB인 호 → D', '⑥ 직선 PD 긋기'];
  function drawPar(b, M, C, fs, o) {
    const g = parGeo(M.px, M.ph, M.al, M.r, M.mode), { Q, Pp, dl, n, u, au, aL, ac, ad, A, B, Cc, Dd, th, r, wv } = g;
    const Lh = 5.6, lA = sub(Q, mul(dl, Lh)), lB = add(Q, mul(dl, Lh));
    line(b, lA, lB, 'ink', 3.2);
    const s0 = sub(Q, mul(u, 1.0)), e0 = add(Pp, mul(u, (M.mode === 'alt' ? 0.9 : r + 0.9)));
    line(b, s0, mix(s0, e0, fs[0]), 'ink', 3.2);
    arcPart(b, Q, r, aL + 8, au - 8, fs[1], 'ink');
    arcPart(b, Pp, r, ac - 8, ac + 8, fs[2], 'ink');
    if (fs[3] > 0) line(b, A, B, 'amber', fs[4] > 0 ? 2.4 : 4.2, { alpha: fs[4] > 0 ? 0.65 : 1 });
    const dir = dirDeg(Cc, Dd);
    arcPart(b, Cc, g.ab, dir - 12, dir + 12, fs[4], 'ink');
    arcPart(b, Pp, r, ac + 8, ad + 8, fs[4], 'ink');
    if (fs[4] >= 1) line(b, Cc, Dd, 'amber', 2.4, { alpha: 0.65 });
    const m0 = sub(Pp, mul(dl, Lh)), m1 = add(Pp, mul(dl, Lh));
    if (fs[5] > 0) line(b, mix(m0, m1, 0.5 - 0.5 * fs[5]), mix(m0, m1, 0.5 + 0.5 * fs[5]), 'green', 3.4);
    if (o.ticks) {
      if (fs[1] >= 1) { tick(b, Q, A, 1); tick(b, Q, B, 1); }
      if (fs[2] >= 1) tick(b, Pp, Cc, 1);
      if (fs[4] >= 1) { tick(b, Pp, Dd, 1); tick(b, Cc, Dd, 2); }
      if (fs[3] > 0) tick(b, A, B, 2);
    }
    if (o.marks && fs[1] >= 1) ang(b, Q, A, B, { color: 'sky', rings: 1, r: 28, label: dg(th), labelDist: 50 });
    if (o.marks && fs[5] >= 0.999) ang(b, Pp, M.mode === 'alt' ? Cc : Cc, Dd, { color: 'sky', rings: 1, r: 28, label: dg(th), labelDist: 50 });
    if (o.arrows) { par(b, lA, lB, 1, 'green', 0.86); par(b, m0, m1, 1, 'green', 0.86); }
    b.point(Q, { color: 'ink', r: 5 }); b.point(Pp, { color: 'ink', r: 5 });
    T(b, lA, '직선 l', { dx: 34, dy: -16, size: 15, color: 'ink' });
    if (fs[5] > 0.9) T(b, sub(Pp, mul(dl, 3.0)), '직선 m', { dy: -18, size: 15, color: 'green' });
    T(b, Q, 'Q', { dx: -n.x * 16 - dl.x * 14, dy: -n.y * 16 - dl.y * 14, size: 17 });
    T(b, Pp, 'P', { dx: wv.x * 18, dy: wv.y * 18, size: 17 });
    const lab = (p, c, a1, name) => { const e = unit(sub(polar(c, r, a1), p)); T(b, p, name, { dx: e.x * 30, dy: e.y * 30, size: 16 }); }; // 호가 점을 지나 뻗은 쪽 끝 너머
    const Qa = dirDeg(Q, A), Qb = dirDeg(Q, B);
    if (fs[1] >= 1) { b.point(A, { color: 'sky', r: 4.2 }); b.point(B, { color: 'sky', r: 4.2 }); lab(A, Q, Qa + 5, 'A'); lab(B, Q, Qb - 5, 'B'); }
    if (fs[2] >= 1) { b.point(Cc, { color: 'sky', r: 4.2 }); lab(Cc, Pp, ac - 5, 'C'); }
    if (fs[4] >= 1) { b.point(Dd, { color: 'sky', r: 4.2 }); lab(Dd, Pp, ad + 5, 'D'); }
    return g;
  }
  const parStage = (t0) => (t0 <= 0 ? 0 : Math.min(6, Math.floor(t0 * 6 - 1e-9) + 1));
  const PBOX = { x0: -6.2, x1: 6.2, y0: -5.9, y1: 2.0 };
  const PH_RANGE = [2.6, 4.2], PX_RANGE = [-3.2, 3.2];
  const pxy = (th, d) => ({ px: d * Math.cos(th * DEG), ph: d * Math.sin(th * DEG) });
  // 점 P 끌기: 각(정수)과 거리(소수 첫째 자리)로 맞춰 둡니다 → 동위각·엇각이 늘 딱 떨어지는 값
  function dragP(s, g) {
    return (w) => { const d = sub(w, g.Q), th = clamp(Math.round(Math.atan2(d.x * g.n.x + d.y * g.n.y, d.x * g.dl.x + d.y * g.dl.y) / DEG), 45, 135), r = clamp(Math.round(Math.hypot(d.x, d.y) * 10) / 10, 3.8, 4.2), q = pxy(th, r); s.cnPx = q.px; s.cnPh = q.ph; };
  }
  const nameOf = (mode) => (mode === 'alt' ? '엇각' : '동위각');

  function parScene(mode) {
    const alt = mode === 'alt';
    const D = {
      id: alt ? 'c1-4' : 'c1-3', title: alt ? '평행선의 작도 · 엇각' : '평행선의 작도 · 동위각', short: alt ? '평행선(엇각)' : '평행선(동위각)',
      question: alt ? '직선 l 밖의 점 P를 지나고 l에 평행한 직선을, 엇각을 이용해 어떻게 작도할까?' : '직선 l 밖의 점 P를 지나고 l에 평행한 직선을, 동위각을 이용해 어떻게 작도할까?',
      ctl: ['cnPAl', 'cnPR', 'cnPT'], anim: { key: 'cnPT', dur: 12, label: '작도 보기', start: 0 },
      init: (s) => { s.cnPAl = 0; s.cnPR = 1.4; s.cnPT = 0; { const q = pxy(alt ? 65 : 115, 4); s.cnPx = q.px; s.cnPh = q.ph; } s.cnPm = alt ? 'alt' : 'corr'; s.cnPk = { ...pxy(65, 4), al: 0, f: 0, t: [0, 1, 2, 3] }; },
      reroll: (s) => {
        const { px, ph } = pxy(pick([50, 65, 75, 105, 120, 130], 0), pick([3.8, 4, 4.2], 0)), al = pick([-12, -6, 0, 6, 12], 99);
        s.cnPm = alt ? pick(['corr', 'alt'], s.cnPm) : 'corr';
        s.cnPk = { px, ph, al, f: rint(0, 3), t: shuffle([0, 1, 2, 3, 4, 5, 6], Math.random).slice(0, 4) };
      },
      model: (s) => ({ px: clamp(s.cnPx, PX_RANGE[0], PX_RANGE[1]), ph: clamp(s.cnPh, PH_RANGE[0], PH_RANGE[1]), al: clamp(s.cnPAl, -20, 20), r: clamp(s.cnPR, 1.1, 1.6), T: clamp(s.cnPT, 0, 1), mode, pmode: s.cnPm || mode, pk: s.cnPk || { px: 1.6, ph: 3.6, al: 0, f: 0, t: [0, 1, 2, 3] } }),
      draw(b, s, M, C) {
        fit(b, PBOX, { t: 20, b: 58 });
        const MM = C.problem ? { ...M, mode: M.pmode, px: M.pk.px, ph: M.pk.ph, al: M.pk.al } : M;
        const fs = fsOf(C.problem ? 1 : C.t, 6);
        const stage = C.review ? C.step : parStage(C.t);
        const g = drawPar(b, MM, C, fs, { ticks: !C.problem, marks: C.problem || !C.review || C.step >= 2, arrows: !C.problem && (C.review ? C.step >= 3 : fs[5] >= 0.999) });
        if (C.txt && !C.problem) {
          if (C.review) caption(b, C.step === 1 ? `같은 크기의 ${nameOf(mode)}을 작도해요` : C.step === 2 ? `${nameOf(mode)}의 크기가 같아요: ${dg(g.th)}` : `${nameOf(mode)}의 크기가 같으니까 l ∥ m`, 'amber', 2.2);
          else caption(b, stage <= 0 ? '▶를 누르거나 막대를 끌어 작도를 시작해요' : fs[5] >= 0.999 ? `${nameOf(mode)}이 같아서 l ∥ m` : PAR_CAP[stage - 1], 'amber', 2.2);
        }
        if (!C.problem && !C.review && C.txt) b.handle('P', g.Pp, { color: 'amber', r: 8, ariaLabel: '점 P 끌기', drag: dragP(s, g) });
      },
      stepT: (n) => (n >= 3 ? 1 : n === 2 ? 1 : 5 / 6),
      steps: (M) => {
        const th = parGeo(M.px, M.ph, M.al, M.r, M.mode).th;
        return [
          `점 P를 지나는 직선 PQ를 긋고, 크기가 같은 각을 작도해요. $\\angle AQB$와 같은 크기의 $\\angle ${alt ? 'QPD' : 'CPD'}$를 점 P에 그려요. (${ol('QA')}=${ol('QB')}=${ol('PC')}=${ol('PD')}, ${ol('AB')}=${ol('CD')})`,
          `작도한 두 ${nameOf(mode)}의 크기가 같아요: $\\angle AQB=\\angle ${alt ? 'QPD' : 'CPD'}=${fmtN(th)}^{\\circ}$`,
          `${nameOf(mode)}의 크기가 같으면 두 직선은 평행해요. 그러므로 $l\\parallel m$ (직선 $PD$)이에요.`
        ];
      },
      view: (M, C) => {
        const g = parGeo(M.px, M.ph, M.al, M.r, M.mode);
        return {
          guide: `<b>노란 점</b> P를 끌어 위치를, 막대로 직선 l의 기울기를 바꿔 보세요. ▶를 누르거나 <b>작도 단계</b> 막대를 끌면 6단계가 차례로 그려져요. 같은 길이는 눈금, 같은 크기의 각은 같은 호로 표시해요.`,
          readouts: [rd(`${nameOf(mode)} ∠AQB`, dg(g.th), 'sky'), rd(`작도한 ${nameOf(mode)}`, M.T >= 1 ? dg(g.th) : '작도 중', 'green', '크기가 같아요'), rd('결론', M.T >= 1 ? 'l ∥ m' : '작도가 끝나면', 'green')],
          formula: `<p>$\\angle AQB=\\angle ${alt ? 'QPD' : 'CPD'}=${fmtN(g.th)}^{\\circ}$ → ${nameOf(mode)}이 같다</p><p>$l\\parallel m$</p>`,
          rule: `${nameOf(mode)}의 크기가 같도록 크기가 같은 각을 작도하면 평행선이 된다`,
          notes: notes(alt ? '엇각은 한 직선(PQ)의 <b>양쪽</b>에 어긋나게 놓인 각이에요. 점 C는 P에서 Q 쪽, 점 D는 l과 반대 방향에 있어요.' : '동위각은 <b>같은 위치</b>에 있는 각이에요. 점 C는 P에서 Q의 반대쪽(직선 PQ의 연장선) 위에 있어요.', '컴퍼스의 벌림은 두 번 모두 같고, 마지막 호만 반지름이 $\\overline{AB}$예요.')
        };
      },
      prob: (M) => {
        const k = M.pk, th = Math.atan2(k.ph, k.px) / DEG, pm = M.pmode;
        if (alt) {
          const used = pm === 'alt' ? '엇각' : '동위각';
          const ch = [
            { h: '동위각의 크기가 같으면 두 직선은 평행하다.', ok: pm === 'corr', hint: '이 그림에서는 엇각이 같도록 작도했어요.' },
            { h: '엇각의 크기가 같으면 두 직선은 평행하다.', ok: pm === 'alt', hint: '이 그림에서는 동위각이 같도록 작도했어요.' },
            { h: '맞꼭지각의 크기는 서로 같다.', hint: '맞꼭지각은 평행선을 만드는 데 쓰이지 않았어요.' },
            { h: '삼각형의 세 내각의 크기의 합은 $180^{\\circ}$이다.', hint: '삼각형의 내각은 이 작도에서 쓰이지 않았어요.' },
            { h: '직선과 수직인 두 직선은 평행하다.', hint: '수직은 이 작도에서 쓰이지 않았어요.' }
          ];
          return { tag: '평행선의 작도 · 동위각과 엇각 구별', key: `${pm}${k.px}${k.ph}${k.al}`, stem: `그림은 직선 l 밖의 한 점 P를 지나고 l에 평행한 직선 PD를 작도한 것이다. 이 작도에서 이용한 평행선의 성질로 옳은 것은? (${used === '엇각' ? '크기가 같은 두 각의 위치를 그림에서 확인하세요' : '크기가 같은 두 각의 위치를 그림에서 확인하세요'})`, choices: mkTextChoices(ch, `${pm}${k.px}${k.ph}${k.al}`), wide: true };
        }
        const T7 = [['QA', 'QB'], ['PC', 'PD'], ['QA', 'PC'], ['QB', 'PD'], ['AB', 'CD'], ['QB', 'PC'], ['QA', 'PD']];
        const F = [['QA', 'AB'], ['QB', 'CD'], ['PC', 'CD'], ['PD', 'AB']];
        const f = F[k.f];
        const items = [{ h: `$${ol(f[0])}=${ol(f[1])}$`, ok: true }].concat(k.t.map((i) => ({ h: `$${ol(T7[i][0])}=${ol(T7[i][1])}$`, hint: '이 두 선분은 길이가 같아요. 옳지 않은 것을 찾아야 해요.' })));
        return { tag: '평행선의 작도 · 길이가 같은 선분', key: `c${k.px}${k.ph}${k.al}${k.f}${k.t.join('')}`, stem: '그림은 직선 l 밖의 한 점 P를 지나고 l에 평행한 직선 PD를 작도한 것이다. 다음 중 옳지 않은 것은?', choices: mkTextChoices(items, `c${k.px}${k.ph}${k.al}${k.f}${k.t.join('')}`), note: '같은 반지름 4개, 컴퍼스로 옮긴 길이 2개를 찾아 보세요' };
      }
    };
    return D;
  }
  const par1 = parScene('corr'), par2 = parScene('alt');

  /* ====================================================================== 5. 작도 순서 */
  const SNT = ['직선 PQ를 긋는다', '점 Q 중심 원 → A, B', '점 P 중심 같은 원 → C', '컴퍼스로 AB를 잰다', '점 C 중심, 반지름 AB인 원 → D', '직선 PD를 긋는다'];
  const SNL = [
    '직선 PQ를 긋는다.',
    '점 Q를 중심으로 하는 원을 그려 직선 l, PQ와 만나는 점을 각각 A, B라 한다.',
    '점 P를 중심으로 반지름이 같은 원을 그려 직선 PQ와 만나는 점을 C라 한다.',
    '컴퍼스로 $\\overline{AB}$의 길이를 잰다.',
    '점 C를 중심으로 반지름이 $\\overline{AB}$인 원을 그려 앞의 원과 만나는 점을 D라 한다.',
    '직선 PD를 긋는다.'
  ];
  const PRE = [[], [0], [0], [1, 2], [2, 3], [4]]; // 앞서 해야 하는 단계 (㉣ 컴퍼스로 AB 재기는 같은 반지름의 두 원을 모두 그린 뒤에 — 그 전에는 컴퍼스 벌림을 그대로 둬요)
  const REASON = ['', '직선 PQ가 있어야 PQ와 만나는 점 B를 찾을 수 있어요.', '직선 PQ가 있어야 PQ와 만나는 점 C를 찾을 수 있어요.', '점 Q 중심의 원과 같은 반지름으로 점 P 중심의 원을 그려야 해요. 컴퍼스를 AB의 길이로 바꾸기 전에 두 원을 먼저 그려요. (점 A, B도 있어야 AB를 재요.)', '점 C와 컴퍼스로 잰 AB의 길이가 모두 있어야 해요.', '점 D를 찾은 뒤에야 직선 PD를 그을 수 있어요.'];
  const okOrder = (ord) => ord.every((st, i) => PRE[st].every((q) => ord.indexOf(q) >= 0 && ord.indexOf(q) < i));
  function allOrders() { const out = []; (function rec(cur) { if (cur.length === 6) { out.push(cur.slice()); return; } for (let i = 0; i < 6; i++) if (!cur.includes(i) && PRE[i].every((q) => cur.includes(q))) { cur.push(i); rec(cur); cur.pop(); } })([]); return out; }
  const ORDERS = allOrders();
  const orderScene = {
    id: 'c1-5', title: '작도 순서', short: '작도 순서',
    question: '평행선을 작도하는 6개의 일을 어떤 순서로 해야 할까? 앞의 일이 끝나야 다음 일을 할 수 있어요.',
    ctl: [],
    init: (s) => { s.cnOrd = []; s.cnMsg = null; s.cnPx = pxy(70, 4).px; s.cnPh = pxy(70, 4).ph; s.cnPerm = shuffle([0, 1, 2, 3, 4, 5], Math.random); s.cnPk = { perm: [0, 1, 2, 3, 4, 5], o: 0, bad: [0, 1, 2, 3], px: 1.6, ph: 3.6 }; },
    reroll: (s) => {
      const perm = shuffle([0, 1, 2, 3, 4, 5], Math.random);
      const good = ORDERS[rint(0, ORDERS.length - 1)];
      const bads = [];
      let guard = 0;
      while (bads.length < 4 && guard++ < 400) {
        const c = shuffle([0, 1, 2, 3, 4, 5], Math.random);
        const sw = good.slice(); const i = rint(0, 4); [sw[i], sw[i + 1]] = [sw[i + 1], sw[i]];
        const cand = Math.random() < 0.7 ? sw : c;
        if (!okOrder(cand) && !bads.some((x) => x.join() === cand.join())) bads.push(cand);
      }
      s.cnPk = { perm, good, bads, ...pxy(pick([55, 70, 110, 125], 0), 4) };
      s.cnOrd = []; s.cnMsg = null; s.cnPerm = perm;
    },
    model: (s) => ({ perm: s.cnPerm || [0, 1, 2, 3, 4, 5], ord: s.cnOrd || [], msg: s.cnMsg || null, pk: s.cnPk || {}, px: clamp(s.cnPx == null ? 1.4 : s.cnPx, PX_RANGE[0], PX_RANGE[1]), ph: clamp(s.cnPh == null ? 3.8 : s.cnPh, PH_RANGE[0], PH_RANGE[1]) }),
    draw(b, s, M, C) {
      fit(b, PBOX, { t: 20, b: 58 });
      const done = C.problem ? [0, 1, 2, 3, 4, 5] : C.review ? [0, 1, 2, 3, 4, 5].slice(0, C.step) : M.ord;
      const fs = [0, 1, 2, 3, 4, 5].map((i) => (done.includes(i) ? 1 : 0));
      const px = C.problem ? (M.pk.px || 1.4) : M.px, ph = C.problem ? (M.pk.ph || 3.8) : M.ph;
      const g = drawPar(b, { px, ph, al: 0, r: 1.4, mode: 'corr' }, C, fs, { ticks: !C.problem, marks: !C.problem && done.length >= 6, arrows: !C.problem && done.length >= 6 });
      if (C.txt && !C.problem) {
        if (C.review) caption(b, `${C.step}단계: ${SNT[C.step - 1]}`, 'amber', 2.2);
        else if (M.msg) caption(b, M.msg.text, 'rose', 2.2);
        else caption(b, done.length >= 6 ? '평행선을 모두 작도했어요! l ∥ m' : done.length ? `${done.length}단계 완료 · 다음 일을 골라 보세요` : '아래 칩에서 첫 번째 일을 골라 보세요', done.length >= 6 ? 'green' : 'amber', 2.2);
      }
      if (!C.problem && !C.review && C.txt) b.handle('P', g.Pp, { color: 'amber', r: 8, ariaLabel: '점 P 끌기', drag: dragP(s, g) });
    },
    steps: () => [
      '직선 PQ를 긋는다. (점 P와 직선 l 위의 점 Q를 잇는다.) 모든 작도의 바탕이 돼요.',
      '점 Q를 중심으로 호를 그려 직선 l, PQ와 만나는 점 A, B를 찾는다. 직선 PQ가 있어야 B를 찾을 수 있어요.',
      '점 P를 중심으로 같은 반지름의 호를 그려 직선 PQ와 만나는 점 C를 찾는다. 직선 PQ가 있어야 C를 찾을 수 있어요.',
      '컴퍼스로 $\\overline{AB}$의 길이를 잰다. 점 A, B가 있고, 같은 반지름의 두 원을 모두 그린 뒤에 해요. (그 전에는 컴퍼스 벌림을 그대로 둬요.)',
      '점 C를 중심으로 반지름이 $\\overline{AB}$인 호를 그려 점 D를 찾는다. 점 C와 $\\overline{AB}$의 길이가 모두 있어야 해요.',
      '직선 PD를 긋는다. 이 직선이 l과 평행해요.'
    ],
    view: (M) => ({
      guide: '아래 <b>칩</b>(㉠~㉥)을 눌러 작도를 한 단계씩 해 보세요. 앞의 일이 끝나야 다음 일을 할 수 있어요. 틀린 칩을 누르면 왜 안 되는지 알려 줘요.',
      alert: M.msg ? { tone: 'warn', text: M.msg.text } : null,
      readouts: [rd('한 단계', `${M.ord.length} / 6`, 'green'), rd('지금까지의 순서', M.ord.length ? M.ord.map((i) => KL[M.perm.indexOf(i)]).join(' → ') : '아직 없음', 'sky', '', null, true)],
      rule: '앞의 점·선이 있어야 다음 작도를 할 수 있다',
      notes: notes('점 Q 중심의 원과 점 P 중심의 원은 반지름이 같아요. 두 원은 어느 쪽을 먼저 그려도 되지만, 둘 다 직선 PQ를 먼저 그은 뒤에 해요.', '$\\overline{AB}$를 재면 컴퍼스 벌림이 바뀌어요. 그래서 같은 반지름의 두 원을 모두 그린 뒤에 재요.')
    }),
    prob: (M) => {
      const k = M.pk, perm = k.perm || [0, 1, 2, 3, 4, 5];
      if (!k.good) { const g0 = [0, 1, 2, 3, 4, 5]; return fallbackProb(perm, g0, [[0, 2, 1, 4, 3, 5], [1, 0, 2, 3, 4, 5], [0, 1, 3, 2, 4, 5], [0, 1, 2, 4, 3, 5]]); }
      return fallbackProb(perm, k.good, k.bads);
    }
  };
  function whyBad(o, lt) { // 틀린 순서가 왜 틀렸는지: 처음으로 앞 단계가 모자란 곳
    for (let i = 0; i < o.length; i++) { const miss = PRE[o[i]].filter((q) => !o.slice(0, i).includes(q)); if (miss.length) return `${lt(o[i])}의 앞에는 ${miss.map(lt).join(', ')}이(가) 먼저 와야 해요. ${REASON[o[i]]}`; }
    return '작도 순서가 맞지 않아요.';
  }
  function fallbackProb(perm, good, bads) {
    const lt = (i) => KL[perm.indexOf(i)];
    const seqH = (o) => o.map(lt).join(' → ');
    const list = perm.map((st, i) => `<li><b>${KL[i]}</b>${SNL[st]}</li>`).join('');
    const bad = bads.filter((o) => !okOrder(o)).slice(0, 4); // 보기에는 올바른 순서가 정확히 하나만 들어가도록
    const items = [{ h: seqH(good), ok: true }].concat(bad.map((o) => ({ h: seqH(o), hint: whyBad(o, lt) })));
    const key = perm.join('') + good.join('') + bad.map((x) => x.join('')).join('');
    return { tag: '작도 순서', key, html: `그림은 직선 l 밖의 한 점 P를 지나고 l에 평행한 직선을 작도한 것이다. 다음 ㉠~㉥을 작도 순서에 맞게 나열한 것은? (앞의 점·선이 있어야 다음 작도를 할 수 있고, 컴퍼스의 벌림은 바꾸기 전까지 그대로예요.)<ol>${list}</ol>`, choices: mkTextChoices(items, key), wide: true };
  }
  // 칩: 순서 칩(㉠~㉥)과 처음으로
  orderScene.presets = function (s) {
    const perm = (s && s.cnPerm) || [0, 1, 2, 3, 4, 5];
    const arr = perm.map((st, i) => ({
      group: i === 0 ? '다음에 할 일' : '', label: `${KL[i]} ${SNT[st]}`, color: 'amber',
      apply: (ss) => {
        const ord = ss.cnOrd || [];
        if (ord.includes(st)) { ss.cnMsg = { text: `${KL[i]}은 이미 했어요.` }; return; }
        const need = PRE[st].filter((q) => !ord.includes(q));
        if (need.length) {
          const lt = need.map((q) => KL[ss.cnPerm.indexOf(q)]).join('·');
          ss.cnMsg = { text: `아직 할 수 없어요. 먼저 ${lt} 이(가) 있어야 해요.` };
          return;
        }
        ss.cnOrd = ord.concat([st]); ss.cnMsg = null;
      },
      on: (ss) => (ss.cnOrd || []).includes(st)
    }));
    arr.push({ group: '', label: '처음으로', apply: (ss) => { ss.cnOrd = []; ss.cnMsg = null; }, on: () => false });
    return arr;
  };

  G.register(10, 't1', '① 작도', '작도', PARAMS, [tools, copyAng, par1, par2, orderScene]);
})();
