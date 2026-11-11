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
        const a = id === 'q5-4' ? M.P : M.A, z = id === 'q5-2' ? M.D : id === 'q5-5' ? M.E : id === 'q6-4' || id === 'q6-5' ? M.E : M.C;
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
})();
