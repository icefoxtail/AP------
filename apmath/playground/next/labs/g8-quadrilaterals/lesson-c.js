/* 넓이·접기·결합: 원본 model/prob와 현재 문제 solveDraw를 쓰는 해설. */
(function () {
  'use strict';
  const G = window.APL_QD;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g8-quadrilaterals'] = window.APL_LESSONS['g8-quadrilaterals'] || {};
  const sources = Object.fromEntries((window.APL_QD_GROUPS || []).flatMap(g => g.scenes).filter(sc => /^q[56]-/.test(sc.id)).map(sc => [sc.id, sc.qd]));
  const { pt, mid, lerp, centroid, foot, sub, mul, add, rotP, bboxOf, fit, line, poly, fillPoly, T, tagOut, ang, tick, par } = G;
  const moving = new Set(['qeDx', 'qeAx', 'qeE', 'qfT', 'qfRot', 'qdCInk']);
  const reset = extra => ({ qdLessonProblem: true, qdShowAnswer: false, qdCalculationReady: false, qdSeed: 0, qdOrd: [0, 1, 2, 3, 4], qdCMode: '', qdCCap: '', qdCQuestion: '', ...extra });
  const cue = (step, cap = '', flags = {}) => ({ step, set: { qdCCap: cap, ...flags } });
  const calc = (step, cap) => cue(step, cap, { qdCalculationReady: true });
  const done = (cap) => cue(5, cap, { qdShowAnswer: true, qdCalculationReady: true });
  const ch = (title, a, b, one = {}, two = {}) => ({ title, length: 12, cues: [{ at: 0, say: a, ...one }, { at: 6, say: b, ...two }] });
  const begin = (cap, to = {}) => ({ to: { qdCInk: 1, ...to }, dur: 5, set: { qdCCap: cap } });
  const concept = (mode, question) => ({ qdLessonProblem: false, qdCMode: mode, qdCQuestion: question });
  function lesson(title, label, answer, values, settings, chapters) {
    chapters[0].start = { qdCInk: 0, ...Object.fromEntries(Object.entries(values).filter(([, v]) => typeof v === 'number')) };
    chapters[0].cues[0].set = reset({ ...Object.fromEntries(Object.entries(values).filter(([k]) => !moving.has(k))), ...settings, ...chapters[0].cues[0].set });
    return { title, label, tab: 'review', answer, summary: '주어진 조건과 기호를 확인하고 도형의 성질로 풉니다', task: '직접 해 보기에서 조건을 바꾸고 같은 성질을 확인해 보세요', chapters };
  }
  function numeric(title, label, answer, values, text, caps, motion = {}) {
    return lesson(title, label, answer, values, {}, [
      ch('조건과 풀이 전략', text[0], text[1], begin(caps[0], motion), cue(2, caps[1])),
      ch('성질로 식 세우기', text[2], text[3], calc(3, caps[2]), calc(4, caps[3])),
      ch('계산과 정답', text[4], text[5], done(caps[4]), cue(5, caps[4]))
    ]);
  }
  function names(b, named, centre) {
    for (const [name, p] of Object.entries(named)) { if (!p) continue; b.point(p, { color: 'ink', r: 4 }); tagOut(b, p, centre, name, { size: 17, gap: 10 }); }
  }
  function markArea(b, points, label, color) { T(b, centroid(points), label, { color, size: 16 }); }
  function caption(b, str, answer) {
    if (!str) return;
    const size = b.W < 560 ? 14 : 17, width = b.W - 36, words = str.split(' '), rows = []; let row = '';
    for (const word of words) { const next = row ? row + ' ' + word : word; if (row && G.textW(next, size) > width) { rows.push(row); row = word; } else row = next; }
    if (row) rows.push(row);
    rows.forEach((value, i) => b.stext(b.W / 2, b.H - b.insets.bottom - 25 - (rows.length - 1 - i) * (size + 5), value, { size, color: answer ? 'green' : 'amber', weight: 800, align: 'center', baseline: 'middle' }));
  }
  function traced(b, a, z, f) { if (f > 0) { const end = lerp(a, z, f); line(b, a, end, 'green', 4); if (f < .999) b.point(end, { color: 'amber', r: 5 }); } }
  function folded(p, a, z, t) { const f = foot(p, a, z); return add(f, mul(sub(p, f), Math.cos(Math.PI * t))); }
  function conceptDraw(b, s, m, C, id) {
    const p = C.entry ? 0 : Math.min(C.step, C.answer ? 5 : 4), f = C.entry ? 0 : s.qdCInk || 0, mode = s.qdCMode;
    const { A, B, D, E, F, O } = m, V = m.C, centre = centroid([A, B, V, D]);
    let box = bboxOf([A, B, V, D, ...(id === 'q5-1' ? [E] : [])], .25);
    if (id === 'q5-2') box = { x0: -2, x1: m.w + 2, y0: -m.h - .25, y1: .25 };
    if (id === 'q6-1') box = bboxOf([A, B, V, D, m.Dp], .25);
    if (id === 'q6-2') box = bboxOf([A, B, V, D, m.G], .25);
    if (id === 'q6-6') box = { x0: -m.S * 1.45, x1: m.S * 1.45, y0: -m.S * 1.45, y1: m.S * 1.45 };
    fit(b, box, { t: 35, b: 82, l: 42, r: 42 });
    if (id === 'q6-1' || id === 'q6-2') {
      const t = C.entry ? 0 : s.qfT || 0, axis = id === 'q6-1' ? [A, V] : [E, F];
      const fixed = id === 'q6-1' ? [A, B, V] : [A, B, E, F], original = id === 'q6-1' ? [A, V, D] : [E, V, D, F];
      const movingPoints = id === 'q6-1' ? [A, V, folded(D, ...axis, t)] : [E, folded(V, ...axis, t), folded(D, ...axis, t), F];
      fillPoly(b, fixed, 'sky', .08); poly(b, fixed, 'ink', 3.4); poly(b, original, 'muted', 2, { dash: [7, 6] });
      fillPoly(b, movingPoints, 'amber', .18); poly(b, movingPoints, 'amber', 3.2); line(b, ...axis, 'green', 3.4);
      names(b, { A, B, C: V, D, ...(id === 'q6-2' || t >= .999 ? { E } : {}), ...(id === 'q6-2' ? { F } : {}) }, centre);
      if (id === 'q6-1' && t >= .999) {
        names(b, { 'D′': m.Dp }, centre);
        if (p >= 1) { ang(b, A, D, V, { color: 'sky', rings: 1, r: 32 }); ang(b, A, V, E, { color: 'sky', rings: 1, r: 25 }); }
        if (p >= 2) { par(b, A, D); par(b, B, V); ang(b, V, E, A, { color: 'sky', rings: 1, r: 25 }); fillPoly(b, [E, A, V], 'green', .12); }
        if (C.answer) { tick(b, E, A, 1, 'green'); tick(b, E, V, 1, 'green'); }
      }
      if (id === 'q6-2' && t >= .999) {
        if (p >= 1) { line(b, A, V, 'sky', 2.5, { dash: [6, 5] }); tick(b, E, A, 1); tick(b, E, V, 1); tick(b, F, A, 2); tick(b, F, V, 2); }
        if (mode === 'fold-bisector') { if (C.answer) { b.right(O, A, E, { size: 12, color: 'green' }); tick(b, A, O, 3, 'sky'); tick(b, V, O, 3, 'sky'); } }
        else if (p >= 2) { par(b, E, V); par(b, F, A); ang(b, E, A, F, { color: 'sky', rings: 1, r: 28 }); ang(b, E, F, V, { color: 'sky', rings: 1, r: 28 }); ang(b, F, A, E, { color: 'sky', rings: 1, r: 28 }); if (C.answer) { poly(b, [A, E, V, F], 'green', 4); [[A, E], [E, V], [V, F], [F, A]].forEach(pair => tick(b, ...pair, 1, 'green')); } }
      }
      return;
    }
    const outline = id === 'q5-2' ? [A, B, V] : [A, B, V, D];
    fillPoly(b, outline, 'sky', .06); poly(b, outline, 'ink', 3.4);
    if (id === 'q5-1') {
      traced(b, A, V, f);
      if (p >= 1) { line(b, D, E, 'amber', 3); line(b, V, E, 'ink', 3); par(b, A, V); par(b, D, E); names(b, { E }, V); }
      if (p >= 2) { fillPoly(b, [A, V, D], 'sky', .18); fillPoly(b, [A, V, E], 'green', .18); const H = foot(D, A, V), J = foot(E, A, V); line(b, D, H, 'sky', 2, { dash: [5, 4] }); line(b, E, J, 'green', 2, { dash: [5, 4] }); }
      if (C.answer) poly(b, [A, B, E], 'amber', 4);
    } else if (id === 'q5-2') {
      line(b, pt(-2, -m.h), pt(m.w + 2, -m.h), 'green', 2.4, { dash: [7, 5] }); par(b, B, V); par(b, pt(-2, -m.h), pt(m.w + 2, -m.h));
      const H = foot(A, B, V); line(b, A, H, 'amber', 2.4, { dash: [6, 5] }); b.right(H, A, V, { size: 10, color: 'amber' }); T(b, mid(A, H), 'h', { dx: 15, color: 'amber' });
      if (mode === 'area-ratio') { traced(b, A, D, f); if (p >= 1) { fillPoly(b, [A, B, D], 'sky', .15); fillPoly(b, [A, D, V], 'green', .15); G.sd(b, B, D, A, 'm', 'sky'); G.sd(b, D, V, A, 'n', 'green'); } }
    } else if (id === 'q5-3') {
      par(b, A, D); par(b, B, V); traced(b, A, V, f); line(b, B, D, 'ink', 2.7);
      if (p >= 1) { fillPoly(b, [A, B, D], 'sky', .12); fillPoly(b, [A, V, D], 'green', .12); }
      if (p >= 2) fillPoly(b, [A, O, D], 'rose', .22);
      if (mode === 'area-product' && p >= 2) { markArea(b, [A, O, D], 'u', 'green'); markArea(b, [B, O, V], 'd', 'rose'); markArea(b, [A, B, O], 'l', 'sky'); markArea(b, [D, V, O], 'r', 'amber'); }
      if (C.answer) { fillPoly(b, [A, B, O], 'amber', .2); fillPoly(b, [D, V, O], 'amber', .2); }
      names(b, { O }, A);
    } else if (id === 'q5-4') {
      const P = m.P; [A, B, V, D].forEach(v => traced(b, P, v, f));
      if (p >= 1) { fillPoly(b, [P, B, V], 'sky', .18); fillPoly(b, [P, A, D], 'sky', .18); const H = foot(P, B, V), J = foot(P, A, D); line(b, P, H, 'amber', 2.4); line(b, P, J, 'amber', 2.4); }
      if (p >= 2) { fillPoly(b, [P, A, B], 'green', .14); fillPoly(b, [P, V, D], 'green', .14); }
      names(b, { P }, A); par(b, A, D); par(b, B, V);
    } else if (id === 'q5-5') {
      traced(b, E, B, f); traced(b, E, V, f); par(b, A, D); par(b, B, V);
      if (p >= 1) { const H = foot(E, B, V); line(b, E, H, 'amber', 2.4, { dash: [5, 4] }); b.right(H, E, V, { size: 10, color: 'amber' }); T(b, mid(E, H), 'h', { dx: 16, color: 'amber' }); fillPoly(b, [E, B, V], 'green', .16); }
      if (p >= 2) { fillPoly(b, [A, B, E], 'amber', .16); fillPoly(b, [D, V, E], 'amber', .16); }
      names(b, { E }, B);
    } else if (id === 'q6-3') {
      traced(b, A, V, f); line(b, B, E, 'ink', 2.7); line(b, D, E, 'ink', 2.7);
      if (p >= 1) { tick(b, A, B, 1); tick(b, A, D, 1); tick(b, A, E, 2, 'green'); ang(b, A, B, E, { color: 'sky', rings: 1, r: 29 }); ang(b, A, E, D, { color: 'sky', rings: 1, r: 29 }); }
      if (p >= 2) { fillPoly(b, [A, B, E], 'sky', .16); fillPoly(b, [A, D, E], 'green', .16); }
      if (C.answer) { tick(b, B, E, 3, 'amber'); tick(b, D, E, 3, 'amber'); }
      names(b, { E }, B);
    } else if (id === 'q6-4') {
      poly(b, [B, E, V], 'green', 3); traced(b, A, E, f); line(b, D, E, 'ink', 2.5);
      if (p >= 1) { tick(b, A, B, 1); tick(b, B, V, 1); tick(b, B, E, 1); ang(b, B, A, V, { color: 'sky', label: '90°', r: 35 }); ang(b, B, E, V, { color: 'green', label: '60°', r: 22 }); }
      if (p >= 2) fillPoly(b, [A, B, E], 'amber', .2);
      if (C.answer) { ang(b, A, B, E, { color: 'amber', rings: 1, r: 30 }); ang(b, E, A, B, { color: 'amber', rings: 1, r: 30 }); }
      names(b, { E }, V);
    } else if (id === 'q6-5') {
      traced(b, A, E, f); line(b, B, F, 'ink', 2.7); tick(b, B, E, 2); tick(b, V, F, 2);
      if (p >= 1) { tick(b, A, B, 1, 'sky'); tick(b, B, V, 1, 'sky'); b.right(B, A, E, { size: 12, color: 'green' }); b.right(V, B, F, { size: 12, color: 'green' }); }
      if (p >= 2) { fillPoly(b, [A, B, E], 'sky', .16); fillPoly(b, [B, V, F], 'green', .16); }
      if (mode === 'square-perpendicular' && p >= 3) { ang(b, A, B, E, { color: 'amber', rings: 1, r: 27 }); ang(b, B, V, F, { color: 'amber', rings: 1, r: 27 }); names(b, { P: m.Pp }, D); }
      if (C.answer) { if (mode === 'square-perpendicular') b.right(m.Pp, A, B, { size: 12, color: 'rose' }); else { tick(b, A, E, 3, 'green'); tick(b, B, F, 3, 'green'); } }
      names(b, { E, F }, A);
    } else if (id === 'q6-6') {
      fillPoly(b, m.sq2, 'amber', .08); poly(b, m.sq2, 'amber', 3); fillPoly(b, m.over, 'green', .25); poly(b, m.over, 'green', 2.8);
      b.right(O, m.sq2[1], m.sq2[3], { size: 11, color: 'amber' });
      if (p >= 1) { const v = sub(m.sq2[1], O), end = add(O, mul(v, m.h / Math.max(Math.abs(v.x), Math.abs(v.y)))); for (let i = 0; i < 4; i++) line(b, O, rotP(end, O, i * 90), 'green', 2.4, { dash: [6, 5] }); }
      if (p >= 2) for (let i = 1; i < 4; i++) fillPoly(b, m.over.map(v => rotP(v, O, i * 90)), ['sky', 'amber', 'rose'][i - 1], .12);
      names(b, { O }, A); names(b, { E: m.sq2[1], F: m.sq2[2], G: m.sq2[3] }, O);
    }
    names(b, { A, B, C: V, D }, centre);
  }
  for (const [id, D] of Object.entries(sources)) {
    D.lessonQuestion = (M, s, Q) => {
      if (!s.qdLessonProblem) return s.qdCQuestion || D.question;
      let body = Q.html || Q.stem || '';
      const choices = (Q.choices || []).map(c => c.h ?? (c.t != null ? '$' + c.t + '$' : c.p));
      if (choices.length && !choices.every(text => body.includes(String(text)))) body += '<br>' + choices.map((text, i) => G.NUM[i] + ' ' + text).join('<br>');
      return body;
    };
    D.lessonDraw = (b, s, M, C, solution) => {
      if (!s.qdLessonProblem) { conceptDraw(b, s, M, C, id); return; }
      const stage = C.entry ? 0 : Math.min(C.step, C.answer ? solution.steps.length : solution.steps.length - 1);
      if (stage > 0) D.solveDraw(b, { ...s, step: stage }, M, { ...C, step: stage }, solution);
      else D.draw(b, s, M, { ...C, problem: true, review: false, full: false, step: 99 });
      if (!C.entry && C.step < 2 && !['q6-1', 'q6-2', 'q6-6'].includes(id)) {
        const geometry = id === 'q6-5' && M.K === 0 ? M.g2 : M;
        const a = id === 'q5-4' ? geometry.P : geometry.A, z = id === 'q5-2' ? geometry.D : id === 'q5-5' || id === 'q6-4' || id === 'q6-5' ? geometry.E : geometry.C;
        traced(b, a, z, s.qdCInk || 0);
      }
    };
    D.lessonAfterDraw = (b, s, M, C) => { if (!C.entry) caption(b, s.qdCCap, C.answer); };
  }

  const equal = { qeL: 6, qeH1: 4, qeH2: 3, qeDx: 2, qeK: 0 };
  bank['q5-1'] = [
    lesson('사각형을 삼각형으로 바꾸기', '도형변환', '□ABCD와 △ABE의 넓이가 같다', equal, concept('equal-triangle', 'AC∥DE가 되도록 E를 잡으면 사각형 ABCD와 어떤 삼각형의 넓이가 같을까요?'), [
      ch('대각선과 보조선', 'AC는 사각형을 두 삼각형으로 나누는 대각선이에요.', 'D를 지나 AC와 평행한 선을 BC의 연장선과 만나요.', begin('AC: 공통 밑변'), cue(1, 'DE∥AC, E는 BC의 연장선 위')),
      ch('밑변과 높이 비교', '△ACD와 △ACE의 밑변은 모두 AC예요.', 'D와 E가 평행선 위에 있으므로 높이도 같아요.', cue(2, '밑변 AC 공통 · 두 높이가 같음'), calc(3, '△ACD의 넓이를 △ACE로 바꿔요')),
      ch('공통 부분 더하기', '공통인 △ABC를 더하면 □ABCD와 △ABE예요.', '따라서 두 도형의 넓이가 같아요.', done('□ABCD와 △ABE의 넓이가 같다'), cue(5, '□ABCD와 △ABE의 넓이가 같다'))
    ]),
    numeric('넓이가 같은 도형의 합', '전체넓이', '△ABE = 21', equal,
      ['AC는 두 삼각형을 나누는 공통 밑변이에요.', '△ABC=12, △ACD=9가 주어졌어요.', 'AC∥DE이므로 △ACD와 △ACE의 높이가 같아요.', '△ABE는 △ABC와 △ACE의 넓이를 더해요.', '△ABE의 넓이는 12+9=21이에요.', '바꾼 삼각형의 넓이를 더했는지 확인해요.'],
      ['AC: 공통 밑변', '주어진 넓이 12와 9', '△ACD=△ACE', '△ABE=△ABC+△ACE', '△ABE = 21']),
    numeric('평행선 사이의 같은 넓이', '같은넓이', '△ACE = 9', { ...equal, qeK: 1 },
      ['△ACE의 넓이 x를 △ACD와 비교해요.', '밑변 AC와 평행선 DE를 먼저 확인해요.', 'D와 E에서 AC까지 내린 높이가 같아요.', '밑변과 높이가 같으므로 넓이도 같아요.', '△ACE의 넓이는 △ACD와 같은 9예요.', '같은 밑변과 같은 높이가 핵심이에요.'],
      ['x: △ACE의 넓이', 'AC∥DE · △ACD=9', '공통 밑변과 같은 높이', '△ACE=△ACD', '△ACE = 9']),
    numeric('전체에서 공통 부분 빼기', '남은넓이', '△ACD = 9', { ...equal, qeK: 2 },
      ['△ABE=21, △ABC=12에서 x를 찾아요.', '대각선 AC를 기준으로 부분 넓이를 나눠요.', '△ACD와 △ACE는 밑변과 높이가 같아요.', '△ACE는 전체 △ABE에서 △ABC를 빼요.', '△ACD=△ACE=21−12=9예요.', '두 삼각형을 같은 넓이로 바꾸어 계산했어요.'],
      ['x: △ACD의 넓이', '전체 21 · 공통 부분 12', '△ACD=△ACE', '△ACE=△ABE−△ABC', '△ACD = 9'])
  ];

  const sliding = { qeM: 2, qeN: 3, qeH: 4, qeAx: 1.5, qeK: 0 };
  bank['q5-2'] = [
    lesson('꼭짓점 이동과 삼각형 넓이', '꼭짓점이동', '평행선 위에서 움직여도 넓이는 같다', sliding, concept('area-slide', '꼭짓점 A를 BC와 평행한 직선 위로 옮기면 △ABC의 넓이는 어떻게 될까요?'), [
      ch('꼭짓점 움직이기', 'A를 움직이며 밑변 BC와 높이 h를 살펴봐요.', 'h는 A에서 BC까지 수직으로 잰 거리예요.', begin('BC: 밑변 · h: 높이', { qeAx: 4.5 }), cue(1, '평행선 사이의 수직 거리 h')),
      ch('넓이를 정하는 두 길이', 'A가 이동해도 밑변 BC는 그대로예요.', '평행한 두 직선 사이의 거리 h도 같아요.', cue(2, '밑변 BC가 일정'), calc(3, '높이 h도 일정')),
      ch('넓이 결론', '넓이 BC×h÷2의 두 길이가 모두 같아요.', '그래서 A를 평행선 위로 옮겨도 넓이는 같아요.', done('평행선 위에서 움직여도 넓이는 같다'), cue(5, '평행선 위에서 움직여도 넓이는 같다'))
    ]),
    lesson('같은 높이와 넓이의 비', '넓이의비', '△ABD : △ADC = m : n', sliding, concept('area-ratio', 'BD=m, DC=n일 때 △ABD와 △ADC의 넓이의 비는 무엇일까요?'), [
      ch('밑변을 나누기', 'D는 밑변 BC를 m과 n으로 나누는 점이에요.', '두 삼각형의 꼭짓점 A와 높이 h는 같아요.', begin('BD=m, DC=n'), cue(1, '공통 높이 h')),
      ch('넓이의 식 비교', '두 넓이는 각각 m×h÷2, n×h÷2예요.', '비를 구할 때 공통인 h÷2가 약분돼요.', calc(2, '(m×h÷2) : (n×h÷2)'), calc(3, '공통인 h÷2를 약분')),
      ch('밑변의 비와 연결', '따라서 △ABD : △ADC = m : n이에요.', '높이가 같으므로 밑변의 비를 그대로 써요.', done('△ABD : △ADC = m : n'), cue(5, '△ABD : △ADC = m : n'))
    ]),
    numeric('전체 넓이를 비로 나누기', '비례배분', '△ABD = 4', sliding,
      ['AD로 나뉜 두 삼각형의 넓이를 비교해요.', '전체 넓이 10, 밑변의 비 BD:DC=2:3이에요.', '높이가 같으므로 넓이의 비도 2:3이에요.', '△ABD는 전체 다섯 몫 중 두 몫이에요.', '△ABD=10×2÷5=4예요.', '두 부분을 더하면 전체 넓이 10이 돼요.'],
      ['AD: 두 삼각형을 나누는 선분', '전체 10 · BD:DC=2:3', '넓이의 비도 2:3', 'x=10×2÷(2+3)', '△ABD = 4']),
    numeric('한 부분에서 다른 부분 구하기', '부분넓이', '△ADC = 6', { ...sliding, qeK: 1 },
      ['공통 높이를 가진 두 삼각형을 살펴봐요.', '△ABD=4, 밑변의 비 BD:DC=2:3이에요.', '같은 높이이므로 넓이의 비도 2:3이에요.', '두 몫이 4이므로 한 몫을 구해 세 배 해요.', '△ADC=4÷2×3=6이에요.', '높이가 같은지 확인한 뒤 비를 사용해요.'],
      ['A에서 BC까지 높이가 같음', '△ABD=4 · BD:DC=2:3', '△ABD:△ADC=2:3', 'x=4÷2×3', '△ADC = 6'])
  ];
  const butterfly = { qeA: 1, qeB: 4, qeK: 1, qeKk: 0 };
  bank['q5-3'] = [
    lesson('사다리꼴의 양옆 넓이', '양옆넓이', '△ABO = △DCO', butterfly, concept('butterfly', 'AD∥BC인 사다리꼴의 대각선 교점이 O일 때, △ABO와 △DCO의 넓이를 비교해 보세요.'), [
      ch('대각선으로 나누기', 'O는 두 대각선 AC와 BD의 교점이에요.', '밑변 AD가 공통인 △ABD와 △ACD를 봐요.', begin('O: 두 대각선의 교점'), cue(1, '△ABD와 △ACD를 비교')),
      ch('공통 넓이 빼기', 'AD∥BC이므로 두 삼각형의 높이가 같아요.', '같은 두 넓이에서 공통인 △AOD를 빼요.', calc(2, '△ABD=△ACD'), calc(3, '공통 부분 △AOD를 뺌')),
      ch('남은 양옆 넓이', '남는 부분은 △ABO와 △DCO예요.', '따라서 두 삼각형의 넓이는 같아요.', done('△ABO = △DCO'), cue(5, '△ABO = △DCO'))
    ]),
    lesson('네 부분 넓이의 곱', '넓이의곱', 'u×d = l×r', butterfly, concept('area-product', '위·아래·왼쪽·오른쪽 넓이를 u, d, l, r로 놓으면 두 곱 사이에 어떤 관계가 있을까요?'), [
      ch('네 넓이에 이름 붙이기', '대각선의 교점을 O라 하고 네 부분을 살펴봐요.', '위 u, 아래 d, 왼쪽 l, 오른쪽 r로 놓아요.', begin('u, d, l, r: 네 삼각형의 넓이'), cue(2, '기호는 길이가 아니라 넓이')),
      ch('같은 높이인 두 쌍', '△AOD와 △AOB는 A에서 BD까지 높이가 같아요.', '△COD와 △COB도 C에서 BD까지 높이가 같아요.', calc(3, 'u:l = DO:BO'), calc(4, 'r:d = DO:BO')),
      ch('비에서 곱으로', 'u:l=r:d이므로 양변을 정리하면 u×d=l×r예요.', '사다리꼴에서는 l=r이므로 양옆 넓이의 제곱이에요.', done('u×d = l×r'), cue(5, 'u×d = l×r'))
    ]),
    numeric('사다리꼴의 남은 넓이', '부분빼기', '△ABO = 4', butterfly,
      ['두 대각선이 만나는 O를 먼저 확인해요.', '△DBC=20, △OBC=16이 주어졌어요.', 'AD∥BC이므로 △ABD와 △ACD의 넓이가 같아요.', '공통 △AOD를 빼면 양옆 넓이가 같아요.', '△DCO=20−16=4이므로 △ABO도 4예요.', '전체 △DBC에서 아래 부분을 뺀 넓이예요.'],
      ['O: 대각선의 교점', '△DBC=20 · △OBC=16', '밑변 AD와 높이가 같음', '△ABO=△DCO', '△ABO = 4']),
    numeric('사다리꼴의 같은 넓이', '같은부분', '△DCO = 4', { ...butterfly, qeKk: 1 },
      ['왼쪽 △ABO와 오른쪽 △DCO를 비교해요.', '왼쪽 넓이 4를 오른쪽으로 옮길 근거를 찾아요.', '△ABD와 △ACD는 밑변 AD와 높이가 같아요.', '같은 두 넓이에서 공통 △AOD를 빼요.', '남는 넓이도 같으므로 △DCO=4예요.', '위와 아래가 아니라 양옆 넓이가 같아요.'],
      ['x: △DCO의 넓이', '주어진 △ABO=4', '△ABD=△ACD', '공통 △AOD를 뺌', '△DCO = 4'])
  ];

  const inside = { qeW: 6, qeHp: 4, qeI: 2, qeJ: 1, qeK: 0 };
  bank['q5-4'] = [
    lesson('내부의 점과 마주 보는 넓이', '마주본넓이', '위+아래 = 왼쪽+오른쪽 = 전체÷2', inside, concept('inside-point', '평행사변형 내부의 점 P와 네 꼭짓점을 이으면 마주 보는 두 넓이의 합은 어떤 관계일까요?'), [
      ch('네 삼각형 나누기', 'P는 평행사변형 안에 있는 점이에요.', '위와 아래 삼각형의 밑변 AD와 BC는 같아요.', begin('P와 네 꼭짓점을 이어요'), cue(1, '위 △PDA · 아래 △PBC')),
      ch('두 높이를 더하기', '위와 아래 높이를 더하면 전체 높이가 돼요.', '왼쪽과 오른쪽도 같은 방법으로 높이를 더해요.', calc(2, '위+아래=밑변×전체 높이÷2'), calc(3, '왼쪽과 오른쪽에도 같은 원리')),
      ch('마주 보는 넓이의 합', '두 쌍의 합은 각각 전체 넓이의 절반이에요.', '위+아래와 왼쪽+오른쪽이 같아요.', done('위+아래 = 왼쪽+오른쪽 = 전체÷2'), cue(5, '위+아래 = 왼쪽+오른쪽 = 전체÷2'))
    ]),
    numeric('전체 넓이에서 마주 보는 부분', '마주본부분', '△PCD = 8', inside,
      ['P에서 네 꼭짓점으로 이은 선분을 살펴봐요.', '전체 넓이 24와 왼쪽 △PAB=4가 주어졌어요.', '마주 보는 왼쪽과 오른쪽의 합은 전체의 절반이에요.', '절반에서 왼쪽 넓이를 빼면 오른쪽이 남아요.', '△PCD=24÷2−4=8이에요.', '전체에서 바로 4를 빼면 안 돼요.'],
      ['x: 오른쪽 △PCD의 넓이', '전체 24 · 왼쪽 4', '왼쪽+오른쪽=전체÷2', 'x=24÷2−4', '△PCD = 8']),
    numeric('세 넓이로 나머지 넓이 구하기', '남은부분', '△PDA = 9', { ...inside, qeK: 1 },
      ['왼쪽·오른쪽·아래 세 부분이 주어졌어요.', '△PAB=4, △PCD=8, △PBC=3이에요.', '위+아래는 왼쪽+오른쪽과 같아요.', '왼쪽과 오른쪽을 더한 뒤 아래 넓이를 빼요.', '△PDA=4+8−3=9예요.', '9+3과 4+8의 합이 같은지 확인해요.'],
      ['x: 위 △PDA의 넓이', '왼쪽 4 · 오른쪽 8 · 아래 3', '위+아래=왼쪽+오른쪽', 'x=4+8−3', '△PDA = 9'])
  ];

  const edge = { qeW: 6, qeHp: 4, qeE: 2, qeK: 0 };
  bank['q5-5'] = [
    lesson('변 위의 점과 삼각형 넓이', '변위의점', '△EBC는 전체 넓이의 절반', edge, concept('edge-point', 'E를 평행사변형의 변 AD 위에서 움직이면 △EBC의 넓이는 전체 넓이와 어떤 관계일까요?'), [
      ch('변 위에서 점 움직이기', 'E를 변 AD 위에서 옮기며 △EBC를 살펴봐요.', '밑변은 BC, 높이는 E에서 BC까지의 거리예요.', begin('E는 AD 위의 점', { qeE: 5 }), cue(1, '△EBC의 밑변 BC · 높이 h')),
      ch('밑변과 높이 비교', 'AD∥BC이므로 E를 옮겨도 높이 h는 같아요.', '삼각형과 평행사변형의 밑변과 높이가 같아요.', calc(2, '△EBC의 넓이=BC×h÷2'), calc(3, '전체 넓이=BC×h')),
      ch('전체와의 관계', '따라서 △EBC는 전체 넓이의 절반이에요.', '남은 양옆 넓이의 합도 전체의 절반이에요.', done('△EBC는 전체 넓이의 절반'), cue(5, '△EBC는 전체 넓이의 절반'))
    ]),
    numeric('변 위의 점과 중앙 넓이', '중앙넓이', '△EBC = 12', edge,
      ['E에서 B와 C를 이어 중앙 삼각형을 봐요.', '전체 넓이는 24, E는 마주 보는 변 AD 위예요.', '삼각형과 평행사변형의 밑변 BC가 같아요.', '높이도 같고 삼각형은 밑변×높이÷2예요.', '△EBC=24÷2=12예요.', 'E가 AD 위 어디에 있어도 같은 넓이예요.'],
      ['E: AD 위의 점', '□ABCD=24', '공통 밑변 BC', '높이도 같으므로 전체÷2', '△EBC = 12']),
    numeric('양옆 넓이로 전체 구하기', '전체복원', '□ABCD = 24', { ...edge, qeK: 1 },
      ['양옆 △ABE와 △ECD를 먼저 확인해요.', '왼쪽 넓이 4와 오른쪽 넓이 8이 주어졌어요.', '중앙 △EBC는 전체 넓이의 절반이에요.', '남은 양옆의 합도 절반이므로 두 배 해요.', '전체 넓이는 2×(4+8)=24예요.', '양옆을 더한 값은 전체의 절반이에요.'],
      ['x: 평행사변형 전체 넓이', '△ABE=4 · △ECD=8', '△EBC는 전체의 절반', '전체=2×(왼쪽+오른쪽)', '□ABCD = 24']),
    numeric('남은 옆부분 넓이 구하기', '옆부분', '△ECD = 8', { ...edge, qeK: 2 },
      ['E에서 양 끝점으로 이은 세 삼각형을 봐요.', '전체 넓이 24와 왼쪽 넓이 4가 주어졌어요.', '중앙 삼각형은 전체의 절반을 차지해요.', '남은 절반에서 왼쪽 4를 빼면 오른쪽이에요.', '△ECD=24÷2−4=8이에요.', '왼쪽과 오른쪽을 더하면 12가 돼요.'],
      ['x: 오른쪽 △ECD의 넓이', '전체 24 · 왼쪽 4', '중앙 넓이=전체÷2', '오른쪽=전체÷2−왼쪽', '△ECD = 8'])
  ];
  const tape = { qfT: 0, qfTh: 30, qfW: 8, qfK: 0 };
  bank['q6-1'] = [
    lesson('대각선으로 접은 삼각형', '접힌삼각형', 'EA=EC인 이등변삼각형', tape, concept('fold-isosceles', 'AC를 따라 접은 뒤 AD′과 BC의 교점을 E라 할 때, △EAC는 어떤 삼각형일까요?'), [
      ch('접는 선과 옮겨진 점', 'AC를 고정하고 D가 D′으로 옮겨지게 접어요.', 'E는 접힌 변 AD′과 BC의 교점이에요.', begin('접는 선 AC · D의 대응점 D′', { qfT: 1 }), cue(1, '접힌 두 각 ∠DAC와 ∠EAC')),
      ch('접은 각과 엇각', '접어서 포개지는 ∠DAC와 ∠EAC가 같아요.', 'AD∥BC이므로 ∠DAC와 ∠ECA도 같아요.', calc(2, '접은 각 ∠DAC=∠EAC'), calc(3, '엇각 ∠DAC=∠ECA')),
      ch('같은 두 밑각', '△EAC의 ∠EAC와 ∠ECA가 같아요.', '마주 보는 변도 같아 EA=EC인 이등변삼각형이에요.', done('EA=EC인 이등변삼각형'), cue(5, 'EA=EC인 이등변삼각형'))
    ]),
    numeric('접힌 삼각형의 외각', '접힌외각', '∠AEB = 60°', tape,
      ['AC를 따라 접으면 D가 D′으로 옮겨져요.', 'E는 AD′과 BC의 교점, 주어진 ∠DAC는 30°예요.', '접은 각과 엇각으로 ∠EAC=∠ECA예요.', '∠AEB는 외각이므로 두 밑각을 더해요.', '∠AEB=30°+30°=60°예요.', '꼭지각 ∠AEC와 외각 ∠AEB를 구별해요.'],
      ['접는 선 AC', 'E: AD′과 BC의 교점', '∠EAC=∠ECA=∠DAC', '∠AEB=∠EAC+∠ECA', '∠AEB = 60°'], { qfT: 1 }),
    numeric('외각에서 접은 각 구하기', '접은각', '∠DAC = 30°', { ...tape, qfK: 1 },
      ['AC를 따라 접힌 도형에서 같은 각을 찾아요.', '주어진 외각 ∠AEB는 60°예요.', '접은 각과 엇각으로 두 밑각이 같아요.', '외각은 두 밑각의 합이므로 반으로 나눠요.', '∠DAC=60°÷2=30°예요.', '접기와 평행선이 같은 각을 만드는 근거예요.'],
      ['x: 접기 전 ∠DAC', '주어진 외각 ∠AEB=60°', '∠EAC=∠ECA=∠DAC', '60°=2×∠DAC', '∠DAC = 30°'], { qfT: 1 })
  ];

  const folding = { qfT: 0, qfPh: 30, qfW: 8, qfK: 0 };
  bank['q6-2'] = [
    lesson('두 점을 포개는 접는 선', '접는선', 'EF는 AC의 수직이등분선', folding, concept('fold-bisector', '직사각형의 C를 A에 포개면 접는 선 EF와 선분 AC는 어떤 관계일까요?'), [
      ch('두 점 포개기', 'C가 A와 포개어지도록 EF를 따라 접어요.', '접는 선 위의 E와 F는 움직이지 않아요.', begin('C의 대응점 A · 접는 선 EF', { qfT: 1 }), cue(1, '접는 선 위의 E, F는 고정')),
      ch('접어서 같은 거리', 'E에서 A와 C까지의 거리가 같아져요.', 'F에서도 A와 C까지의 거리가 같아져요.', calc(2, 'EA=EC'), calc(3, 'FA=FC')),
      ch('접는 선의 성질', '두 점 A, C에서 같은 거리에 있는 선이 EF예요.', 'EF는 AC를 수직으로 이등분해요.', done('EF는 AC의 수직이등분선'), cue(5, 'EF는 AC의 수직이등분선'))
    ]),
    lesson('접기로 생긴 사각형', '접힌사각형', 'AECF는 마름모', folding, concept('fold-rhombus', 'C를 A에 포개어 접었을 때, 원래 점들로 이은 사각형 AECF는 어떤 사각형일까요?'), [
      ch('포개지는 두 변', 'C가 A로 옮겨질 때 EC와 EA가 포개져요.', 'FC와 FA도 포개져 두 쌍의 길이가 같아요.', begin('C를 A에 포개어요', { qfT: 1 }), cue(1, 'EA=EC · FA=FC')),
      ch('평행선과 같은 각', '접는 선 EF는 ∠AEC를 이등분해요.', 'EC∥AF의 엇각으로 ∠AEF=∠AFE예요.', calc(2, '∠AEF=∠CEF'), calc(3, '∠CEF=∠AFE')),
      ch('네 변의 길이', '△AEF의 밑각이 같으므로 AE=AF예요.', '네 변 AE, EC, CF, FA가 같아 AECF는 마름모예요.', done('AECF는 마름모'), cue(5, 'AECF는 마름모'))
    ]),
    numeric('접는 선으로 나뉜 각', '이등분각', '∠AEF = 60°', folding,
      ['C가 A에 포개어질 때 고정된 접는 선은 EF예요.', 'E는 BC 위에 있고 ∠AEB=60°가 주어졌어요.', 'B, E, C가 한 직선이므로 ∠AEC=180°−60°예요.', 'EF가 ∠AEC를 이등분하므로 절반을 구해요.', '∠AEF=(180°−60°)÷2=60°예요.', '주어진 각이 아니라 그 이웃한 각을 나눠요.'],
      ['접는 선 EF', '주어진 ∠AEB=60°', '∠AEC=180°−60°', '∠AEF=∠AEC÷2', '∠AEF = 60°'], { qfT: 1 }),
    numeric('접기와 평행선의 내각', '평행선각', '∠EFD = 120°', { ...folding, qfK: 1 },
      ['C가 A와 포개어지도록 EF를 따라 접어요.', '∠AEB=60°에서 E 쪽 각을 먼저 구해요.', '∠CEF는 ∠AEC의 절반으로 60°예요.', 'EC∥FD이므로 ∠CEF+∠EFD=180°예요.', '∠EFD=180°−60°=120°예요.', '평행한 두 변 사이의 같은 쪽 내각을 이용했어요.'],
      ['x: F에서의 ∠EFD', '접기와 평행선을 함께 사용', '∠CEF=(180°−60°)÷2=60°', '∠EFD=180°−∠CEF', '∠EFD = 120°'], { qfT: 1 })
  ];

  const diagonal = { qfB: 65, qfK: 0 };
  bank['q6-3'] = [
    lesson('정사각형 대각선 위의 점', '대각선합동', '△ABE ≡ △ADE', diagonal, concept('square-diagonal', '정사각형의 대각선 AC 위에 E를 잡으면 △ABE와 △ADE는 어떤 관계일까요?'), [
      ch('대각선과 공통 변', 'E는 대각선 AC 위의 점이고 AE는 공통 변이에요.', '정사각형의 두 변 AB와 AD의 길이가 같아요.', begin('E는 AC 위 · AE 공통'), cue(1, 'AB=AD')),
      ch('끼인각을 비교하기', '정사각형의 대각선 AC는 ∠A를 이등분해요.', '두 변 사이의 ∠BAE와 ∠DAE가 같아요.', calc(2, '∠BAE=∠DAE'), calc(3, 'AB↔AD, AE↔AE')),
      ch('합동과 대응 관계', '두 변과 끼인각이 같으므로 SAS 합동이에요.', 'B와 D가 대응하므로 BE=DE예요.', done('△ABE ≡ △ADE'), cue(5, '△ABE ≡ △ADE'))
    ]),
    numeric('합동으로 다른 꼭짓점의 각 구하기', '대응각', '∠ADE = 20°', diagonal,
      ['대각선 AC 위의 E와 두 삼각형을 살펴봐요.', 'AB=AD, AE 공통, ∠BAE=∠DAE=45°예요.', 'SAS 합동이므로 ∠ADE=∠ABE예요.', '∠AEB=180°−65°=115°를 먼저 구해요.', '∠ADE=180°−45°−115°=20°예요.', '합동의 대응점은 B와 D예요.'],
      ['E는 대각선 AC 위의 점', 'AB=AD · AE 공통 · 끼인각 같음', '△ABE≡△ADE', '∠AEB=115°', '∠ADE = 20°']),
    numeric('대각선 위 이웃한 각', '이웃한각', '∠AED = 115°', { ...diagonal, qfK: 1 },
      ['대각선 AC와 BE, DE가 만드는 각을 살펴봐요.', '두 변과 끼인각이 같아 △ABE≡△ADE예요.', '합동의 대응각 ∠AED와 ∠AEB가 같아요.', 'A, E, C는 한 직선이므로 이웃한 각을 빼요.', '∠AED=∠AEB=180°−65°=115°예요.', '주어진 ∠BEC와 같은 각으로 착각하지 않아요.'],
      ['x: ∠AED', '△ABE≡△ADE (SAS)', '∠AED=∠AEB', '∠AEB+∠BEC=180°', '∠AED = 115°'])
  ];

  const equilateral = { qfS: 4, qfK: 0 };
  bank['q6-4'] = [
    lesson('두 도형 속 이등변삼각형', '숨은삼각형', '△ABE는 이등변삼각형', equilateral, concept('square-equilateral', '정사각형 ABCD 안에 정삼각형 EBC를 그렸습니다. △ABE에는 어떤 성질이 숨어 있을까요?'), [
      ch('서로 다른 두 도형', '정사각형의 변 AB와 정삼각형의 변 BE를 봐요.', '공통 변 BC를 통해 두 길이를 비교해요.', begin('공통 변 BC를 연결 고리로 사용'), cue(1, '정사각형 AB=BC · 정삼각형 BC=BE')),
      ch('같은 길이 찾기', 'AB=BC이고 BC=BE이므로 AB=BE예요.', '∠ABE는 직각에서 정삼각형의 60°를 뺀 각이에요.', calc(2, 'AB=BE'), calc(3, '∠ABE=90°−60°')),
      ch('숨은 삼각형의 종류', '두 변 AB와 BE가 같으므로 이등변삼각형이에요.', '밑각 ∠BAE와 ∠AEB가 같다는 성질을 써요.', done('△ABE는 이등변삼각형'), cue(5, '△ABE는 이등변삼각형'))
    ]),
    numeric('정사각형과 정삼각형의 밑각', 'A쪽밑각', '∠BAE = 75°', equilateral,
      ['AE를 그어 두 도형 사이의 △ABE를 봐요.', 'AB=BC=BE이므로 △ABE는 이등변삼각형이에요.', '∠ABE=90°−60°=30°예요.', '남은 두 밑각이 같으므로 나머지 각을 반으로 나눠요.', '∠BAE=(180°−30°)÷2=75°예요.', '정사각형과 정삼각형의 같은 변을 연결했어요.'],
      ['AE로 △ABE를 살펴봐요', 'AB=BE', '꼭지각 ∠ABE=30°', '∠BAE=(180°−30°)÷2', '∠BAE = 75°']),
    numeric('위쪽 삼각형의 꼭지각', '윗꼭지각', '∠AED = 150°', { ...equilateral, qfK: 1 },
      ['AE와 DE로 만들어진 위쪽 △AED를 봐요.', 'AB=BE인 이등변삼각형에서 밑각을 구해요.', '∠BAE=75°이므로 ∠EAD=90°−75°=15°예요.', '오른쪽도 같은 원리로 ∠EDA=15°예요.', '∠AED=180°−15°−15°=150°예요.', '위쪽 삼각형의 세 내각의 합을 이용했어요.'],
      ['x: 위쪽 삼각형의 ∠AED', '먼저 △ABE의 밑각 구하기', '∠EAD=15°', '∠EDA=15°', '∠AED = 150°']),
    numeric('직각에서 밑각 빼기', '남은각', '∠EAD = 15°', { ...equilateral, qfK: 2 },
      ['A의 직각이 AE에 의해 두 각으로 나뉘어요.', 'AB=BE이므로 △ABE의 두 밑각은 같아요.', '∠ABE=90°−60°=30°를 먼저 구해요.', '∠BAE=(180°−30°)÷2=75°예요.', '∠EAD=90°−75°=15°예요.', '정사각형의 직각에서 구한 밑각을 뺀 값이에요.'],
      ['x: A에서 남은 ∠EAD', '△ABE는 이등변삼각형', '∠ABE=30°', '∠BAE=75°', '∠EAD = 15°']),
    numeric('정삼각형 꼭짓점 쪽의 밑각', 'E쪽밑각', '∠AEB = 75°', { ...equilateral, qfK: 3 },
      ['E의 ∠AEB와 정삼각형의 60°를 구별해요.', 'AB=BC=BE이므로 △ABE가 이등변삼각형이에요.', '∠ABE=90°−60°=30°예요.', '남은 두 밑각의 합을 똑같이 나눠요.', '∠AEB=(180°−30°)÷2=75°예요.', '구하는 각은 ∠BEC가 아니라 ∠AEB예요.'],
      ['x: △ABE의 E 쪽 밑각', 'AB=BE', '꼭지각 ∠ABE=30°', '∠AEB=(180°−30°)÷2', '∠AEB = 75°'])
  ];

  const perpendicular = { qfSp: 6, qfE: 2, qfThA: 30, qfK: 0 };
  bank['q6-5'] = [
    lesson('정사각형 속 두 선분의 길이', '두길이', 'AE=BF', perpendicular, concept('square-equal-length', '정사각형에서 BE=CF일 때 선분 AE와 BF의 길이를 비교해 보세요.'), [
      ch('비교할 두 삼각형', 'AE와 BF를 포함하는 △ABE와 △BCF를 봐요.', '조건 BE=CF와 정사각형의 AB=BC를 연결해요.', begin('△ABE와 △BCF를 비교'), cue(1, 'AB=BC · BE=CF')),
      ch('두 변 사이의 각', '두 변 사이의 ∠ABE와 ∠BCF는 모두 직각이에요.', '두 변과 끼인각이 같으므로 SAS 합동이에요.', calc(2, '∠ABE=∠BCF=90°'), calc(3, '△ABE≡△BCF')),
      ch('대응하는 변', 'A↔B, B↔C, E↔F가 대응해요.', '대응변인 AE와 BF의 길이는 같아요.', done('AE=BF'), cue(5, 'AE=BF'))
    ]),
    lesson('정사각형 속 두 선분의 각', '두선분각', 'AE⊥BF', perpendicular, concept('square-perpendicular', '정사각형에서 BE=CF이고 AE와 BF가 P에서 만나면, 두 선분은 어떤 각으로 만날까요?'), [
      ch('교점과 합동 삼각형', 'AE와 BF의 교점을 P라고 해요.', 'AB=BC, BE=CF, 끼인각은 모두 직각이에요.', begin('P: AE와 BF의 교점'), cue(1, '△ABE와 △BCF의 SAS 조건')),
      ch('대응각을 옮기기', 'SAS 합동이므로 ∠BAE=∠CBF예요.', '∠CBF와 ∠ABP를 더하면 ∠ABC예요.', calc(2, '△ABE≡△BCF'), calc(3, '∠BAE+∠ABP=90°')),
      ch('교점의 각', '△ABP의 남은 각 ∠APB=180°−90°예요.', '따라서 ∠APB=90°, AE⊥BF예요.', done('AE⊥BF'), cue(5, 'AE⊥BF'))
    ]),
    numeric('대응각으로 다른 예각 구하기', '합동예각', '∠BFC = 60°', perpendicular,
      ['AE와 BF가 포함된 두 직각삼각형을 살펴봐요.', 'AB=BC, BE=CF, 끼인각 90°로 SAS 합동이에요.', '대응각이므로 ∠CBF=∠BAE=30°예요.', '△BCF의 두 예각의 합은 90°예요.', '∠BFC=90°−30°=60°예요.', 'B에서의 각과 F에서의 각을 구별해요.'],
      ['x: F에서의 ∠BFC', '△ABE≡△BCF', '대응각 ∠CBF=30°', '∠BFC=90°−∠CBF', '∠BFC = 60°']),
    numeric('정사각형 변의 남은 길이', '남은변', 'FD = 4', { ...perpendicular, qfK: 1 },
      ['F가 변 CD 안에 있으므로 전체와 부분을 봐요.', '정사각형의 한 변은 6이고 BE=CF=2예요.', '정사각형이므로 CD도 6이에요.', '남은 FD는 전체 CD에서 CF를 빼요.', 'FD=6−2=4예요.', 'CF와 FD를 더하면 원래 변 CD가 돼요.'],
      ['F는 선분 CD 안의 점', 'CD=6 · CF=2', '정사각형의 네 변은 같음', 'FD=CD−CF', 'FD = 4'])
  ];

  const rotation = { qfSp: 6, qfRot: .12, qfK: 0 };
  bank['q6-6'] = [
    lesson('중심 회전과 겹친 넓이', '회전넓이', '겹친 넓이는 전체의 4분의 1', rotation, concept('rotated-overlap', '합동인 정사각형 OEFG를 O 주위로 돌리면 겹친 부분의 넓이는 어떻게 변할까요?'), [
      ch('꼭짓점을 중심에 놓기', 'O는 ABCD의 중심이자 OEFG의 한 꼭짓점이에요.', 'O에서 만나는 두 경계선은 늘 직각을 이뤄요.', begin('O: 중심이자 회전하는 꼭짓점', { qfRot: .62 }), cue(1, 'O에서 만나는 두 반직선은 직각')),
      ch('네 영역으로 나누기', '두 경계선을 O 주위로 90°씩 돌려 그어요.', 'ABCD는 90° 회전하면 포개져 네 영역이 합동이에요.', calc(2, '같은 각도에서 네 영역을 비교'), calc(3, '90°씩 돌리면 서로 포개짐')),
      ch('넓이와 모양 구별', '네 영역이 전체를 채우므로 겹친 넓이는 4분의 1이에요.', '회전각을 바꾸면 모양은 달라도 넓이는 같아요.', done('겹친 넓이는 전체의 4분의 1'), cue(5, '겹친 넓이는 전체의 4분의 1'))
    ]),
    numeric('중심에서 회전하는 겹친 넓이', '겹친부분', '겹친 넓이 = 9', rotation,
      ['한 변이 6인 두 합동 정사각형을 O에서 돌려요.', 'O는 ABCD의 중심이자 OEFG의 한 꼭짓점이에요.', 'O의 두 경계선을 90°씩 돌려 네 영역을 만들어요.', '네 영역은 합동이므로 겹친 넓이는 전체의 4분의 1이에요.', '겹친 넓이=6×6÷4=9예요.', '회전하는 각도와 상관없이 같은 넓이예요.'],
      ['O: 회전 중심', '정사각형 한 변 6', '90°씩 돌려 네 영역으로 나눔', '전체 넓이의 4분의 1', '겹친 넓이 = 9'], { qfRot: .62 }),
    numeric('겹친 부분에서 전체 복원', '회전전체', '□ABCD = 36', { ...rotation, qfK: 1 },
      ['O를 중심으로 도형이 돌아가도 직각은 유지돼요.', '초록색 겹친 부분의 넓이 9가 주어졌어요.', '경계선을 90°씩 돌리면 합동인 네 영역이 돼요.', '한 영역이 9이므로 전체는 네 배 해요.', '□ABCD의 넓이=9×4=36이에요.', '겹친 넓이와 정사각형 전체 넓이를 구별해요.'],
      ['x: 정사각형 ABCD의 넓이', '겹친 부분의 넓이 9', '합동인 네 영역', '전체 넓이=겹친 넓이×4', '□ABCD = 36'], { qfRot: .62 })
  ];
})();
