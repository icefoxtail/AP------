/* 내심·외심: 원본 모델과 풀이 무대를 사용하는 원클릭 해설. */
(function () {
  'use strict';
  const G = window.APL_TR;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g8-triangles'] = window.APL_LESSONS['g8-triangles'] || {};
  const source = Object.fromEntries((window.APL_TR_GROUPS || []).flatMap(g => g.scenes).filter(s => /^t[67]-/.test(s.id)).map(s => [s.id, s.tr]));
  const reset = extra => ({ trLessonProblem: true, trShowAnswer: false, trCalculationReady: false, trSeed: 0, trCMode: '', trCCap: '', trCQuestion: '', ...extra });
  const cue = (step, cap = '', set = {}) => ({ step, set: { trCCap: cap, ...set } });
  const calc = (step, cap = '') => cue(step, cap, { trCalculationReady: true });
  const done = (step, cap) => cue(step, cap, { trShowAnswer: true, trCalculationReady: true });
  const ch = (title, a, b, one = {}, two = {}, length = 12) => ({ title, length, cues: [{ at: 0, say: a, ...one }, { at: 6, say: b, ...two }] });
  function lesson(title, label, answer, conditions, settings, chapters) {
    chapters[0].start = Object.fromEntries(Object.entries(conditions).filter(([, value]) => typeof value === 'number'));
    chapters[0].cues[0].set = reset({ ...conditions, ...settings, ...chapters[0].cues[0].set });
    return { title, label, tab: 'review', answer, summary: '조건과 기호를 확인하고 도형의 성질로 결론을 구합니다', task: '직접 해 보기에서 조건을 바꾸고 같은 성질을 확인해 보세요', chapters };
  }
  const concept = (mode, question) => ({ trLessonProblem: false, trCMode: mode, trCQuestion: question });
  const na = { trNa: 32, trNb: 24, trNr: 3, trV: 0 };
  const nt = { trNx: 4, trNy: 3, trNz: 5, trV: 0 };

  // 개념도 같은 기하 모델과 기존 SVB.runner를 쓴다. 수치 문항의 x와
  // 정답 캡션을 개념 설명에 섞지 않고, 설명하는 선분만 단계별로 강조한다.
  const { pt, mid, dist, foot, polar, line, poly, fillPoly, T, tagOut, ang, tick } = G;
  function geometry(id, M) {
    if (id === 't7-4') {
      const O = pt(0, 0), A = polar(O, 1, -90), B = polar(O, 1, 150), C = polar(O, 1, 30);
      return { A, B, C, O, I: O, D: mid(B, C), E: foot(O, C, A), F: foot(O, A, B) };
    }
    const q = M.g || M;
    const { A, B, C, I } = q;
    return { ...q, D: q.D || foot(I, B, C), E: q.E || foot(I, C, A), F: q.F || foot(I, A, B) };
  }
  function bisectors(L, g, n = 3) {
    const vs = [g.A, g.B, g.C];
    vs.slice(0, n).forEach((v, i) => { L.ln(v, g.I, ['sky', 'green', 'violet'][i], 3.6, { dash: [7, 5] }); L.ang(v, vs[(i + 1) % 3], g.I, { color: ['sky', 'green', 'violet'][i], r: 25, rings: i + 1 }); L.ang(v, g.I, vs[(i + 2) % 3], { color: ['sky', 'green', 'violet'][i], r: 25, rings: i + 1 }); });
  }
  function perpendiculars(L, g, equal = false) {
    [[g.D, g.B], [g.E, g.C], [g.F, g.A]].forEach(([p, v]) => { L.ln(g.I, p, 'green', 3.6); L.ang(p, g.I, v, { color: 'green', r: 13 }); if (equal) L.tk(g.I, p, 1, 'green'); });
  }
  function tangents(L, g, labels = false) {
    [[g.A, g.F, 'amber', 1, 'p'], [g.A, g.E, 'amber', 1, 'p'], [g.B, g.F, 'sky', 2, 'q'], [g.B, g.D, 'sky', 2, 'q'], [g.C, g.D, 'violet', 3, 'r'], [g.C, g.E, 'violet', 3, 'r']].forEach(([a, b, color, n, label]) => { L.ln(a, b, color, 5); L.tk(a, b, n, color); if (labels) L.sd(a, b, g.I, label, { color, size: 15, gap: 10 }); });
  }
  function conceptStage(L, id, M, s, X, phase) {
    const g = geometry(id, M), { A, B, C, I, O, D, E, F } = g, mode = s.trCMode;
    if (mode === 'incenter-meet') {
      bisectors(L, g, phase === 0 ? 1 : phase === 1 ? 2 : 3);
      if (phase >= 2) perpendiculars(L, g, true);
    } else if (mode === 'incenter-distance') {
      if (phase === 0) { L.ln(B, I, 'sky', 3); perpendiculars(L, g); }
      else { L.fl([I, B, D], 'sky', .18); L.fl([I, B, F], 'violet', .18); L.tk(I, B, 2, 'amber'); L.ang(B, I, D, { color: 'sky', r: 28 }); L.ang(B, F, I, { color: 'sky', r: 28 }); perpendiculars(L, g, phase >= 2); if (phase >= 2) L.circ(I, dist(I, D), 'green', 3); }
    } else if (mode === 'area') {
      [[B, C, 'sky'], [C, A, 'green'], [A, B, 'violet']].forEach(([p, q, color], i) => { L.ln(I, p, color, 3); if (phase >= 1) L.fl([I, p, q], color, .2); L.sd(p, q, I, ['a', 'b', 'c'][i], { color, size: 16, gap: 9, keep: true }); });
      if (phase >= 1) { perpendiculars(L, g, phase >= 2); [D, E, F].forEach(p => L.sd(I, p, G.centroid([A, B, C]), 'r', { color: 'rose', size: 15, gap: 8 })); }
    } else if (mode === 'tangents' || mode === 'tangent-formula') {
      if (phase === 0) { L.circ(I, dist(I, D), 'green', 2.4); perpendiculars(L, g); }
      else if (phase === 1) { L.fl([I, A, E], 'amber', .18); L.fl([I, A, F], 'sky', .18); L.ln(A, I, 'green', 3); L.tk(I, E, 1, 'green'); L.tk(I, F, 1, 'green'); L.ang(E, I, A, { color: 'green', r: 14 }); L.ang(F, I, A, { color: 'green', r: 14 }); }
      else tangents(L, g, mode === 'tangent-formula');
    } else if (mode === 'rt-incircle' || mode === 'right-r') {
      L.ang(C, A, B, { color: 'sky', r: 24 });
      if (phase === 0) { L.circ(I, dist(I, D), 'green', 2.4); perpendiculars(L, g); }
      else { L.fl([C, D, I, E], 'green', .2); [D, E].forEach(p => { L.ln(C, p, 'green', 4); L.sd(C, p, I, 'r', { color: 'green', gap: 12 }); }); if (phase >= 2) tangents(L, g); }
    } else if (mode === 'halfsum' || mode === 'bic' || mode === 'ratio' || mode === 'ratio-c') {
      bisectors(L, g);
      if (mode === 'halfsum') {
        [[A, B, I, 'α'], [B, C, I, 'β'], [C, A, I, 'γ']].forEach(([v, p, q, label]) => L.ang(v, p, q, { color: 'amber', r: 36, label, size: 15, labelDist: 54 }));
      } else if (mode === 'bic') {
        if (phase >= 1) { L.fl([I, B, C], 'amber', .18); L.ang(B, I, C, { color: 'green', r: 32, label: 'β', size: 15, labelDist: 48 }); L.ang(C, B, I, { color: 'violet', r: 32, label: 'γ', size: 15, labelDist: 48 }); }
        if (phase >= 2) L.ang(I, B, C, { color: 'amber', r: 25, label: 'x', size: 16, labelDist: 43 });
      } else {
        [[A, B, M.a, 'sky'], [B, C, M.b, 'green'], [C, A, M.c, 'violet']].forEach(([p, q, n, color]) => L.ang(I, p, q, { color, r: 26, label: String(n), size: 15, labelDist: 46 }));
        if (mode === 'ratio-c' && phase >= 1) L.fl([I, A, B], 'amber', .18);
        if (mode === 'ratio-c' && phase >= 2) L.ang(C, A, B, { color: 'amber', r: 34, label: s.trCAnswer ? G.dg(M.C) : 'x', size: 16, labelDist: 54 });
      }
    } else if (mode === 'parallel') {
      const Q = M.D, R = M.E;
      L.ln(Q, R, 'green', 3.8); L.ln(B, I, 'sky', 3); L.ln(C, I, 'violet', 3);
      if (phase >= 1) { L.fl([B, Q, I], 'sky', .2); L.ang(B, I, Q, { color: 'sky', r: 26 }); L.ang(I, Q, B, { color: 'sky', r: 26 }); L.tk(B, Q, 1, 'sky'); L.tk(I, Q, 1, 'sky'); }
      if (phase >= 2) { L.fl([C, R, I], 'violet', .2); L.tk(C, R, 2, 'violet'); L.tk(I, R, 2, 'violet'); L.pl([A, Q, R], 'amber', 4); }
    } else if (mode === 'iso-centres') {
      L.tk(A, B, 1, 'amber'); L.tk(A, C, 1, 'amber'); L.ln(A, mid(B, C), 'sky', 3, { dash: [7, 5] });
      if (phase >= 1) { L.ln(O, B, 'rose', 3); L.ln(O, C, 'rose', 3); L.tk(O, B, 2, 'rose'); L.tk(O, C, 2, 'rose'); }
      if (phase >= 2) bisectors(L, g);
    } else if (mode === 'right-R') {
      L.ang(C, A, B, { color: 'sky', r: 24 }); L.tk(A, O, 1, 'rose'); L.tk(O, B, 1, 'rose');
      if (phase >= 1) [A, B, C].forEach(p => { L.ln(O, p, 'rose', 3.6); L.tk(O, p, 1, 'rose'); });
      if (phase >= 2) L.circ(O, dist(O, A), 'rose', 2.6);
    } else if (mode.startsWith('stmt-')) {
      if (mode === 'stmt-oa') { if (phase >= 1) [[A, B], [B, C], [C, A]].forEach(([p, q]) => { const m = mid(p, q); L.ln(m, O, 'rose', 2.8); L.tk(p, m, 1, 'amber'); L.tk(m, q, 1, 'amber'); }); if (phase >= 2) [A, B, C].forEach(p => { L.ln(O, p, 'rose', 3.6); L.tk(O, p, 2, 'rose'); }); }
      else if (mode === 'stmt-id') { if (phase >= 1) bisectors(L, g); if (phase >= 2) perpendiculars(L, g, true); }
      else if (mode === 'stmt-oin') { [A, B, C].forEach(p => L.ln(O, p, 'rose', 2.4)); if (phase >= 1) L.ang(A, B, C, { color: 'amber', r: 32, label: G.dg(M.a), size: 16, labelDist: 54 }); }
      else if (mode === 'stmt-ia') { if (phase >= 1) [A, B, C].forEach((p, i) => { L.ln(I, p, ['sky', 'amber', 'violet'][i], 3.6); if (phase >= 2) L.tk(I, p, i + 1, ['sky', 'amber', 'violet'][i]); }); }
      else { if (phase >= 1) bisectors(L, g); if (phase >= 2) L.fl([A, B, C], 'green', .14); }
    } else if (mode === 'equi-centres' || mode === 'equi-ratio') {
      [A, B, C].forEach((v, i, vs) => L.tk(v, vs[(i + 1) % 3], 1, 'amber'));
      if (phase >= 1) { L.ln(A, D, 'sky', 3); L.ang(D, A, B, { color: 'sky', r: 14 }); L.tk(B, D, 1, 'sky'); L.tk(D, C, 1, 'sky'); }
      if (mode === 'equi-centres' && phase >= 2) bisectors(L, g);
      if (mode === 'equi-ratio' && phase >= 2) { L.fl([O, B, D], 'amber', .2); L.ln(O, B, 'rose', 4); L.ln(O, D, 'green', 4); L.ang(B, O, D, { color: 'amber', r: 30, label: '30°', size: 15, labelDist: 50 }); L.sd(O, B, A, 'R', { color: 'rose', size: 16 }); L.sd(O, D, B, 'r', { color: 'green', size: 16 }); }
    } else if (mode === 'midpoint' || mode === 'foot') {
      const p = mode === 'midpoint' ? M.DO : M.DI, centre = mode === 'midpoint' ? O : I;
      L.ln(centre, p, 'green', 3); L.ang(p, centre, B, { color: 'green', r: 14 });
      if (mode === 'midpoint' && phase >= 1) { L.ln(O, B, 'rose', 3.6); L.ln(O, C, 'rose', 3.6); L.tk(O, B, 2, 'rose'); L.tk(O, C, 2, 'rose'); if (phase >= 2) { L.tk(B, p, 1, 'amber'); L.tk(p, C, 1, 'amber'); } }
      if (mode === 'foot' && phase >= 1) { L.circ(I, dist(I, p), 'green', 2.4); tangents(L, { ...g, D: p }, phase >= 2); }
    }
  }
  function conceptRenderer(id) {
    return G.svB.runner({
      box: M => { const g = geometry(id, M); return id === 't7-2' ? { x0: g.O.x - M.R, x1: g.O.x + M.R, y0: g.O.y - M.R, y1: g.O.y + M.R } : G.bboxOf([g.A, g.B, g.C, g.I, ...(g.O ? [g.O] : [])]); },
      base: (b, M) => { const g = geometry(id, M); fillPoly(b, [g.A, g.B, g.C], 'sky', .07); poly(b, [g.A, g.B, g.C], 'ink', 3.4); },
      legend: (M, s) => id === 't7-4' ? 'O: 두 원의 중심 후보 · D: BC의 중점' : id === 't6-6' ? 'I: 내심 · D, E: 평행선과 두 변의 교점' : id.startsWith('t6') ? 'I: 내심 · D, E, F: 수선의 발' : 'O: 외심 · I: 내심',
      st: Object.fromEntries(['given', 'explain', 'derive', 'ans'].map((f, n) => [f, (L, M, s, X) => conceptStage(L, id, M, s, X, n)])),
      top: (b, M, s) => {
        const g = geometry(id, M), centre = G.centroid([g.A, g.B, g.C]);
        [['A', g.A], ['B', g.B], ['C', g.C]].forEach(([name, p]) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, centre, name, { size: 18 }); });
        if (g.O) { b.point(g.O, { color: 'rose', r: 5 }); T(b, g.O, 'O', { dx: -16, dy: -10, color: 'rose', size: 17 }); }
        if (id !== 't7-4') { b.point(g.I, { color: 'green', r: 5 }); T(b, g.I, 'I', { dx: 15, dy: 12, color: 'green', size: 17 }); }
        if (id === 't6-6') [['D', M.D], ['E', M.E]].forEach(([name, p]) => { b.point(p, { color: 'green', r: 4 }); tagOut(b, p, centre, name, { size: 16 }); });
        else if (!['incenter-meet', 'halfsum', 'bic', 'ratio', 'ratio-c', 'iso-centres', 'right-R'].includes(s.trCMode) && !s.trCMode.startsWith('stmt-')) [['D', id === 't7-5' && s.trCMode === 'midpoint' ? M.DO : g.D], ['E', g.E], ['F', g.F]].forEach(([name, p]) => { if ((id === 't7-4' || s.trCMode === 'midpoint') && name !== 'D') return; b.point(p, { color: 'green', r: 3.8 }); tagOut(b, p, g.I, name, { size: 15, gap: 8 }); });
      }
    });
  }
  for (const [id, D] of Object.entries(source)) {
    const drawConcept = conceptRenderer(id);
    D.lessonQuestion = (M, s, Q) => {
      if (!s.trLessonProblem) return s.trCQuestion || D.question;
      let body = Q.html || Q.stem || '';
      const choices = (Q.choices || []).map(c => c.h != null ? c.h : c.t != null ? '$' + c.t + '$' : c.p);
      if (choices.length && !choices.every(x => body.includes(String(x)))) body += '<br>' + choices.map((x, i) => G.NUM[i] + ' ' + x).join('<br>');
      return body;
    };
    D.lessonDraw = (b, s, M, C, SV, ST, idx) => {
      if (!s.trLessonProblem) {
        const stages = ['given', 'explain', 'derive', 'ans'].map((f, n) => ({ k: n === 3 ? 'ans' : 'fig', f, cap: s.trCCap || '', t: '' }));
        const i = C.entry ? -1 : G.clamp(C.step - 1, 0, C.answer ? 3 : 2);
        drawConcept(b, { ...s, trCAnswer: C.answer }, M, C, stages, i);
      } else {
        // 原 풀이의 eq에 완성된 답이 있어도, 현재 자막의 캡션만 보인다.
        const stages = ST.map(st => ({ ...st, cap: s.trCCap || '' }));
        if (C.answer && stages[idx]?.k === 'ans' && ST.some(st => /^s\d$/.test(st.f))) {
          const correct = D.prob(M, s).choices.findIndex(choice => choice.ok);
          stages[idx].f = 's' + correct;
        }
        SV.draw(b, s, M, C, stages, idx);
      }
    };
  }

  bank['t6-1'] = [
    lesson('세 이등분선이 만나는 점', '이등분선', '세 이등분선은 한 점에서 만나요', na, concept('incenter-meet', '삼각형의 세 내각의 이등분선은 한 점에서 만날까요?'), [
      ch('이등분선의 뜻', '각을 같은 크기로 나누는 선이 이등분선이에요.', 'A와 B의 이등분선이 만나는 점을 I라 해요.', cue(1, '같은 호의 두 각을 확인해요'), cue(2, 'A와 B의 이등분선의 교점 I')),
      ch('세 번째 선도 지나는 까닭', 'I에서 AB, AC까지의 수직거리는 같아요.', 'AB, BC까지도 같으므로 AC, BC까지도 같아요.', cue(3, '각의 이등분선 위의 점과 수직거리')),
      ch('공통 교점 확인', 'I는 C의 이등분선 위에도 있어요.', '세 이등분선은 한 점에서 만나요. 그 점이 내심이에요.', {}, done(4, '세 내각의 이등분선의 교점: 내심 I'))
    ]),
    lesson('내심에서 세 변까지의 거리', '같은거리', 'ID=IE=IF', na, concept('incenter-distance', 'I에서 세 변에 내린 수선의 발을 D, E, F라 할 때, 세 수직거리는 어떤 관계일까요?'), [
      ch('거리와 수선의 발', 'D, E, F는 I에서 각 변에 내린 수선의 발이에요.', '변까지의 거리는 꼭짓점까지가 아닌 수직거리예요.', cue(1, 'ID, IE, IF: 세 수직거리')),
      ch('합동인 직각삼각형', '△IBD와 △IBF는 빗변 IB가 공통이에요.', 'BI가 각을 이등분하므로 RHA 합동이에요.', cue(2, '공통 빗변과 같은 예각: RHA')),
      ch('세 거리와 내접원', '따라서 ID와 IF가 같고, 같은 방법을 반복해요.', 'ID=IE=IF이므로 이 거리로 원을 그려요.', cue(3, '한 꼭짓점씩 같은 수직거리를 확인'), done(4, 'ID=IE=IF: 내접원의 반지름'))
    ]),
    lesson('내심의 이등분각 구하기', '이등분각', '∠IAB = 32°', na, {}, [
      ch('구하는 각 확인', '∠A=64°이고 I는 내심이에요. ∠IAB가 x예요.', 'AI가 이등분선이라는 성질을 사용해요.', cue(1, '∠A=64°, ∠IAB=x'), cue(2, 'AI: ∠A의 이등분선')),
      ch('두 반쪽 각 확인', '같은 호로 표시한 두 각이 서로 같아요.', '두 각을 합치면 64°이므로 하나는 64÷2예요.', cue(3, '∠IAB=∠IAC')),
      ch('반쪽 각 계산', '전체 각을 두 개의 같은 각으로 나눠요.', '따라서 ∠IAB = 32°예요.', calc(4, 'x=64°÷2'), done(5, 'x=32°'))
    ]),
    lesson('내심에서 변까지 거리 구하기', '거리계산', 'IE = 3 cm', { ...na, trV: 1 }, {}, [
      ch('주어진 수직거리', 'ID=3 cm이고 구하는 수직거리는 IE예요.', 'D와 E는 꼭짓점이 아니라 수선의 발이에요.', cue(1, 'ID=3 cm, IE=x'), cue(2, '각의 이등분선과 수직거리')),
      ch('같은 거리의 근거', 'CI가 각의 이등분선이므로 ID와 IE가 같아요.', '직각삼각형 ICD와 ICE의 합동으로 확인해요.', cue(3, '공통 빗변 CI와 이등분된 예각')),
      ch('주어진 거리 옮기기', 'IE는 ID와 같으므로 주어진 값을 그대로 써요.', '따라서 IE = 3 cm예요.', calc(5, 'IE=ID'), done(6, 'x=3 cm'))
    ]),
    lesson('내심의 성질 판별하기', '보기판별', '정답은 ④', { ...na, trV: 2 }, {}, [
      ch('보기의 점과 선분', 'I는 내심이고 D, E, F는 수선의 발이에요.', '옳지 않은 보기를 찾도록 하나씩 이유를 확인해요.', cue(1, '수선의 발과 접점 확인'), cue(2, '성립하는 이유 또는 반례를 찾아요')),
      ch('같은 점에서 그은 접선', '① BD와 BF는 같은 B에서 그은 접선이에요.', '② D가 수선의 발이므로 ID는 BC에 수직이에요.', cue(3, '△IBD≡△IBF → BD=BF'), cue(4, 'D는 수선의 발 → ID⊥BC')),
      ch('변까지의 거리와 이등분선', '③ 내심에서 세 변까지의 수직거리는 같아요.', '⑤ AI는 이등분선이므로 두 반쪽 각이 같아요.', cue(5, 'ID=IE=IF'), cue(7, 'AI는 ∠A의 이등분선')),
      ch('다른 꼭짓점의 접선 비교', '④ AF와 BF는 서로 다른 점에서 그은 접선이에요.', '이 둘은 같다고 할 수 없으므로 정답은 ④예요.', cue(6, 'AF와 BF는 서로 다른 꼭짓점의 접선'), done(8, '옳지 않은 것: ④'))
    ])
  ];
  bank['t6-2'] = [
    lesson('내접원으로 넓이 식 만들기', '넓이원리', 'S=½r(a+b+c)', { trNi: 3, trV: 0 }, concept('area', '내접원의 반지름 r과 세 변 a, b, c로 삼각형의 넓이 S를 어떻게 나타낼까요?'), [
      ch('밑변과 공통 높이', 'a, b, c는 세 변이고 r은 내접원의 반지름이에요.', 'I와 세 꼭짓점을 이어 세 삼각형으로 나눠요.', cue(1, 'a=BC, b=CA, c=AB'), cue(2, '△IBC, △ICA, △IAB로 분할')),
      ch('세 넓이의 합', '각 삼각형의 높이는 해당 변에 수직인 r이에요.', '넓이는 ar÷2, br÷2, cr÷2를 더해요.', cue(3, '세 높이는 모두 r')),
      ch('공통 높이로 묶기', '공통인 r÷2를 묶고 세 밑변을 더해요.', '따라서 S=½r(a+b+c)예요.', {}, done(4, 'S=½r(a+b+c)'))
    ]),
    lesson('내접원의 반지름으로 넓이', '넓이계산', '넓이 = 84 cm²', { trNi: 3, trV: 0 }, {}, [
      ch('길이와 구할 넓이', '세 변은 13, 14, 15 cm이고 반지름은 4 cm예요.', '내심으로 나누면 세 삼각형의 높이가 모두 4예요.', cue(1, '세 변: 13, 14, 15 · r=4'), cue(3, '내심으로 나눈 세 삼각형')),
      ch('높이가 같은 넓이 더하기', '세 밑변을 더하면 13+14+15=42예요.', '세 넓이를 합하면 반지름×둘레÷2예요.', calc(4, '공통 높이 4, 밑변의 합 42'), cue(5, 'S=4×42÷2')),
      ch('넓이 계산과 단위', '4×42÷2를 계산해요.', '따라서 넓이 = 84 cm²예요.', calc(6, 'S=4×42÷2'), done(7, 'x=84 cm²'))
    ]),
    lesson('넓이에서 반지름 구하기', '반지름', 'r = 4 cm', { trNi: 3, trV: 1 }, {}, [
      ch('주어진 넓이 사용', '세 변은 13, 14, 15 cm이고 넓이는 84 cm²예요.', '구할 반지름 r은 세 삼각형의 공통 높이예요.', cue(1, '넓이 84 cm², 반지름 r=x'), cue(3, '세 삼각형의 높이는 모두 r')),
      ch('넓이 식 세우기', '세 변을 더한 둘레는 42 cm예요.', '84=r×42÷2이므로 r=84×2÷42예요.', calc(4, '둘레 13+14+15=42'), cue(5, '84=r×42÷2')),
      ch('반지름 계산', '넓이를 두 배 한 뒤 둘레로 나눠요.', '따라서 r = 4 cm예요.', calc(6, 'r=84×2÷42'), done(7, 'x=4 cm'))
    ])
  ];
  bank['t6-3'] = [
    lesson('같은 점에서 그은 두 접선', '접선원리', 'AF=AE, BF=BD, CD=CE', nt, concept('tangents', '내접원의 접점이 D, E, F일 때, 같은 꼭짓점에서 접점까지의 두 거리는 어떤 관계일까요?'), [
      ch('접점에서 직각 찾기', '반지름과 접선은 접점에서 수직이에요.', 'I와 A를 이어 직각삼각형 IAE와 IAF를 봐요.', cue(1, 'E와 F는 접점'), cue(2, '△IAE와 △IAF')),
      ch('공통 빗변과 같은 반지름', '빗변 IA가 공통이고 IE와 IF는 같은 반지름이에요.', 'RHS 합동이므로 A에서 접점까지의 거리가 같아요.', cue(2, '공통 빗변 IA, 반지름 IE=IF')),
      ch('각 꼭짓점에서 반복', 'B와 C에서도 같은 방법으로 확인해요.', 'AF=AE, BF=BD, CD=CE예요.', cue(3, '같은 꼭짓점에서 그은 두 접선'), done(4, 'AF=AE, BF=BD, CD=CE'))
    ]),
    lesson('세 변으로 접선 AF 구하기', 'AF길이', 'AF = 4 cm', nt, {}, [
      ch('같은 길이에 같은 문자', 'AB=7, BC=8, CA=9 cm이고 구할 것은 AF예요.', '같은 접선의 길이를 p, q, r로 놓아요.', cue(1, 'AB=7, BC=8, CA=9'), cue(3, 'AF=AE=p, BF=BD=q, CD=CE=r')),
      ch('더하고 빼서 지우기', 'AB+CA−BC를 하면 p만 두 번 남아요.', '(p+q)+(r+p)−(q+r)=2p예요.', cue(4, 'AB=p+q, CA=r+p, BC=q+r')),
      ch('접선 한 개 구하기', '2p=7+9−8이므로 p=(7+9−8)÷2예요.', '따라서 AF = 4 cm예요.', calc(5, 'p=(7+9−8)÷2'), done(6, 'x=4 cm'))
    ]),
    lesson('세 변으로 접선 BD 구하기', 'BD길이', 'BD = 3 cm', { ...nt, trV: 1 }, {}, [
      ch('B에서 그은 접선', 'AB=7, BC=8, CA=9 cm이고 구할 것은 BD예요.', 'BF=BD=q로 놓고 나머지 접선은 p, r로 놓아요.', cue(1, 'AB=7, BC=8, CA=9'), cue(3, 'AF=AE=p, BF=BD=q, CD=CE=r')),
      ch('B를 낀 두 변 더하기', 'AB+BC−CA를 하면 q만 두 번 남아요.', '(p+q)+(q+r)−(r+p)=2q예요.', cue(4, 'B를 낀 AB와 BC를 더해요')),
      ch('접선 한 개 구하기', '2q=7+8−9이므로 q=(7+8−9)÷2예요.', '따라서 BD = 3 cm예요.', calc(5, 'q=(7+8−9)÷2'), done(6, 'x=3 cm'))
    ]),
    lesson('접선과 한 변으로 둘레', '둘레', '둘레 = 24 cm', { ...nt, trV: 2 }, {}, [
      ch('주어진 접선과 변', 'AF=4 cm, BC=8 cm예요. 세 변의 합을 구해요.', 'AF=AE=p, BF=BD=q, CD=CE=r로 놓아요.', cue(1, 'AF=4, BC=8'), cue(3, 'p=4, q+r=8')),
      ch('세 변을 접선으로 나누기', '세 변은 p+q, q+r, r+p예요.', '둘레에는 p, q, r가 각각 두 번 들어가요.', cue(4, '둘레=(p+q)+(q+r)+(r+p)')),
      ch('알고 있는 길이로 묶기', '둘레는 2×(p+q+r)=2×(4+8)이에요.', '따라서 둘레 = 24 cm예요.', calc(5, '둘레=2×(4+8)'), done(6, 'x=24 cm'))
    ])
  ];
  bank['t6-4'] = [
    lesson('직각삼각형 안의 정사각형', '반지름원리', 'r=(a+b−c)÷2', { trNj: 1, trV: 0 }, concept('rt-incircle', '직각을 낀 두 변을 a, b, 빗변을 c라 할 때, 내접원의 반지름 r을 어떻게 구할까요?'), [
      ch('반지름과 직각', 'r은 내접원의 반지름, c는 빗변의 길이예요.', '직각 꼭짓점 C 옆의 사각형 CDIE를 보세요.', cue(1, 'a=BC, b=CA, c=AB'), cue(2, 'CDIE의 네 각은 모두 직각')),
      ch('정사각형과 같은 접선', 'ID와 IE가 같으므로 CDIE는 정사각형이에요.', 'CD=CE=r이고 AF=b−r, BF=a−r예요.', cue(2, 'CD=CE=ID=IE=r'), cue(3, '같은 점에서 그은 접선의 길이는 같아요')),
      ch('빗변을 두 조각으로', 'c=AF+BF=(b−r)+(a−r)이에요.', '정리하면 r=(a+b−c)÷2예요.', {}, done(4, '2r=a+b−c → r=(a+b−c)÷2'))
    ]),
    lesson('세 변으로 내접원 반지름', '반지름', 'r = 2 cm', { trNj: 1, trV: 0 }, {}, [
      ch('두 직각변과 빗변', 'BC=6, CA=8, AB=10 cm이고 ∠C는 직각이에요.', '구하는 반지름을 r로 놓고 CDIE를 봐요.', cue(1, 'BC=6, CA=8, AB=10'), cue(2, '직각 꼭짓점 옆 정사각형')),
      ch('빗변을 접선으로 나누기', 'CD=CE=r이므로 BF=6−r, AF=8−r예요.', '빗변 AB는 이 두 접선의 길이를 더한 값이에요.', cue(3, 'CD=CE=r'), cue(4, 'BF=6−r, AF=8−r')),
      ch('반지름 식 풀기', '10=(8−r)+(6−r)이므로 r=(6+8−10)÷2예요.', '따라서 r = 2 cm예요.', calc(5, 'r=(6+8−10)÷2'), done(6, 'x=2 cm'))
    ]),
    lesson('내접원으로 빗변 구하기', '빗변', 'AB = 10 cm', { trNj: 1, trV: 1 }, {}, [
      ch('반지름과 직각변 확인', '직각변은 6, 8 cm이고 내접원의 반지름은 2 cm예요.', '구하는 빗변 AB를 두 접선 AF와 BF로 나눠요.', cue(1, 'BC=6, CA=8, r=2'), cue(2, 'AB=AF+BF')),
      ch('빗변의 두 조각', '정사각형에서 CD=CE=2 cm예요.', 'BF=6−2, AF=8−2로 구해요.', cue(3, 'CDIE는 정사각형'), cue(4, 'BF=BC−CD, AF=CA−CE')),
      ch('두 접선의 길이 더하기', 'AB=(6−2)+(8−2)이에요.', '따라서 AB = 10 cm예요.', calc(5, 'AB=(6−2)+(8−2)'), done(6, 'x=10 cm'))
    ])
  ];
  bank['t6-5'] = [
    lesson('세 반쪽 각의 합', '반쪽각합', 'α+β+γ=90°', na, concept('halfsum', '세 내각을 이등분한 각을 각각 α, β, γ라 할 때, 이 세 각의 합은 얼마일까요?'), [
      ch('반쪽 각의 기호', 'α, β, γ는 A, B, C의 각을 반씩 나눈 각이에요.', '원래 세 내각은 각각 2α, 2β, 2γ예요.', cue(1, 'α=½∠A, β=½∠B, γ=½∠C'), cue(2, '원래 각은 각 반쪽의 두 배')),
      ch('삼각형의 내각 합 사용', '2α+2β+2γ=180°에서 양쪽을 2로 나눠요.', '따라서 α+β+γ=90°예요.', cue(3, '2(α+β+γ)=180°'), done(4, 'α+β+γ=90°'))
    ]),
    lesson('내심에서 만든 각의 관계', '내심각원리', '∠BIC=90°+½∠A', na, concept('bic', '내심 I에서 만든 각 ∠BIC는 꼭짓점 A의 각과 어떤 관계일까요?'), [
      ch('작은 삼각형의 두 각', 'β와 γ는 각각 B와 C의 반쪽 각이에요.', '△IBC의 I에서 만든 각을 x로 놓아요.', cue(1, 'β=½∠B, γ=½∠C'), cue(2, '△IBC의 세 각: β, γ, x')),
      ch('두 반쪽 각을 묶기', 'β+γ=(180°−∠A)÷2예요.', 'x는 180°에서 이 두 각의 합을 뺀 값이에요.', cue(3, 'x=180°−(β+γ)')),
      ch('관계식 정리하기', 'x=180°−(90°−½∠A)를 정리해요.', '따라서 ∠BIC=90°+½∠A예요.', {}, done(4, '∠BIC=90°+½∠A'))
    ]),
    lesson('꼭짓각으로 내심의 각 구하기', 'BIC각', '∠BIC = 122°', na, {}, [
      ch('두 이등분선 확인', 'I는 내심이고 ∠A=64°예요. ∠BIC가 x예요.', 'BI와 CI가 나누는 반쪽 각을 먼저 봐요.', cue(1, '∠A=64°, ∠BIC=x'), cue(3, 'BI와 CI는 각의 이등분선')),
      ch('작은 두 각의 합', '∠B+∠C=180°−64°=116°예요.', '△IBC의 두 작은 각의 합은 그 절반인 58°예요.', calc(4, '∠IBC+∠ICB=116°÷2=58°')),
      ch('삼각형의 나머지 각', 'x는 180°에서 58°를 빼서 구해요.', '따라서 ∠BIC = 122°예요.', calc(5, 'x=180°−58°'), done(6, 'x=122°'))
    ]),
    lesson('내심의 각에서 꼭짓각 찾기', 'A각역산', '∠A = 64°', { ...na, trV: 1 }, {}, [
      ch('주어진 내심의 각', '∠BIC=122°이고 구하는 것은 ∠A예요.', 'BI와 CI가 각각 B와 C의 각을 이등분해요.', cue(1, '∠BIC=122°, ∠A=x'), cue(3, '두 이등분선 확인')),
      ch('두 작은 각에서 원래 각으로', '△IBC의 나머지 두 각의 합은 180°−122°예요.', '그 합은 58°이고 원래 ∠B+∠C는 두 배예요.', calc(4, '∠IBC+∠ICB=58°')),
      ch('큰 삼각형의 나머지 각', '∠B+∠C=116°이므로 x=180°−116°예요.', '따라서 ∠A = 64°예요.', calc(5, 'x=180°−2×58°'), done(6, 'x=64°'))
    ]),
    lesson('두 반쪽 각에서 꼭짓각', '두반쪽각', '∠A = 64°', { ...na, trV: 2 }, {}, [
      ch('주어진 각은 반쪽', '∠IBC=24°, ∠ICB=34°예요.', '이 값은 ∠B와 ∠C 전체가 아니라 반쪽이에요.', cue(1, '∠IBC=24°, ∠ICB=34°'), cue(2, 'BI와 CI는 각의 이등분선')),
      ch('원래 내각 복원', '∠B=2×24°=48°, ∠C=2×34°=68°예요.', '이 두 각과 ∠A를 더하면 180°예요.', calc(3, '∠B=48°, ∠C=68°')),
      ch('나머지 꼭짓각 구하기', 'x=180°−48°−68°로 계산해요.', '따라서 ∠A = 64°예요.', calc(4, 'x=180°−48°−68°'), done(5, 'x=64°'))
    ])
  ];
  bank['t6-6'] = [
    lesson('내심을 지나는 평행선의 둘레', '둘레원리', '둘레=AB+AC', nt, concept('parallel', '내심 I를 지나는 DE가 BC와 평행할 때, △ADE의 둘레를 원래 두 변으로 나타내 보세요.'), [
      ch('평행선과 이등분선', 'D와 E는 평행선이 AB, AC와 만나는 점이에요.', 'DE∥BC와 BI의 이등분 성질을 함께 써요.', cue(1, 'D, I, E는 한 직선 위 · DE∥BC')),
      ch('두 이등변삼각형 찾기', '엇각과 이등분각으로 ∠DBI=∠DIB예요.', '따라서 DB=DI이고, 같은 방법으로 EC=EI예요.', cue(2, '△DBI에서 같은 두 각'), cue(3, 'DB=DI, EC=EI')),
      ch('둘레의 선분 바꿔 더하기', 'AD+DI+IE+EA에서 DI, IE를 바꿔 써요.', 'AD+DB=AB, AE+EC=AC이므로 둘레=AB+AC예요.', {}, done(4, '△ADE의 둘레=AB+AC'))
    ]),
    lesson('두 변으로 작은 삼각형 둘레', '두변둘레', '둘레 = 16 cm', nt, {}, [
      ch('둘레에 필요한 선분', 'AB=7, AC=9, BC=8 cm예요. DE는 BC와 평행해요.', '△ADE의 둘레를 AD+DI+IE+EA로 나눠요.', cue(1, 'AB=7, AC=9, BC=8'), cue(2, 'DE=DI+IE')),
      ch('같은 길이로 바꾸기', '엇각과 이등분선으로 DB=DI가 돼요.', 'C에서도 같은 이유로 EC=EI가 돼요.', cue(3, 'DE∥BC → 엇각'), cue(5, 'DB=DI, EC=EI')),
      ch('원래 두 변에 모으기', 'AD+DB=AB, AE+EC=AC로 묶어요.', '7+9를 더하면 둘레 = 16 cm예요.', calc(6, '△ADE의 둘레=AB+AC'), done(8, 'x=7+9=16 cm'))
    ]),
    lesson('전체 둘레에서 작은 둘레', '전체둘레', '둘레 = 16 cm', { ...nt, trV: 1 }, {}, [
      ch('전체 둘레와 밑변', '△ABC의 둘레는 24 cm이고 BC=8 cm예요.', 'DE는 내심 I를 지나고 BC와 평행해요.', cue(1, '△ABC의 둘레 24, BC=8'), cue(2, 'AD+DI+IE+EA를 구해요')),
      ch('내심과 평행선의 역할', '두 이등변삼각형에서 DB=DI, EC=EI예요.', '작은 둘레는 AB+AC로 바꾸어 쓸 수 있어요.', cue(4, '△DBI는 이등변삼각형'), cue(6, '△ADE의 둘레=AB+AC')),
      ch('밑변을 한 번 빼기', 'AB+AC는 전체 둘레에서 BC를 뺀 값이에요.', '24−8이므로 둘레 = 16 cm예요.', calc(7, 'x=24−8'), done(8, 'x=16 cm'))
    ])
  ];
  const ratios = { trNm: 7, trNn: 8, trNo: 9, trV: 0 };
  bank['t6-7'] = [
    lesson('내심 둘레의 각을 비로 나누기', '비의원리', '세 각의 합은 360°', ratios, concept('ratio', '내심 I를 둘러싼 ∠AIB, ∠BIC, ∠CIA의 합은 얼마이고, 비 7:8:9는 무엇을 뜻할까요?'), [
      ch('비와 실제 각 구별', '7, 8, 9는 각의 크기가 아니라 같은 단위의 개수예요.', 'I를 중심으로 세 각을 차례로 따라가 보세요.', cue(1, '∠AIB:∠BIC:∠CIA=7:8:9'), cue(2, '비의 수를 도 단위로 읽지 않아요')),
      ch('한 바퀴를 같은 단위로', '비의 합은 7+8+9=24이고 한 바퀴를 나눠요.', '세 각의 합은 360°이므로 한 단위는 15°예요.', cue(3, '같은 크기의 24단위'), done(4, '360°÷24=15°'))
    ]),
    lesson('내심의 각의 비에서 A각', 'A각', '∠A = 60°', ratios, {}, [
      ch('A와 마주 보는 내심의 각', '∠AIB:∠BIC:∠CIA=7:8:9예요.', '∠A를 구하려면 B와 C를 잇는 ∠BIC를 써요.', cue(1, '구할 각은 A, 사용할 각은 BIC'), cue(2, '∠A=2(∠BIC−90°)')),
      ch('한 바퀴를 비로 나누기', '세 각의 합은 360°이고 비의 합은 24예요.', '∠BIC는 8단위이므로 360×8÷24=120°예요.', calc(3, '비의 합 7+8+9=24'), calc(4, '∠BIC=120°')),
      ch('반쪽 각을 두 배 하기', '∠A는 120°에서 90°를 뺀 값의 두 배예요.', '따라서 ∠A = 60°예요.', calc(5, 'x=2(120°−90°)'), done(6, 'x=60°'))
    ]),
    lesson('내심의 각의 비에서 B각', 'B각', '∠B = 90°', { ...ratios, trV: 1 }, {}, [
      ch('B와 마주 보는 내심의 각', '∠AIB:∠BIC:∠CIA=7:8:9예요.', '∠B를 구하려면 C와 A를 잇는 ∠CIA를 써요.', cue(1, '구할 각은 B, 사용할 각은 CIA'), cue(2, '∠B=2(∠CIA−90°)')),
      ch('필요한 내심의 각', '한 바퀴는 360°이고 비의 합은 24예요.', '∠CIA는 9단위이므로 360×9÷24=135°예요.', calc(3, '비의 합 24'), calc(4, '∠CIA=135°')),
      ch('꼭짓점의 각 구하기', '∠B는 135°에서 90°를 뺀 값의 두 배예요.', '따라서 ∠B = 90°예요.', calc(5, 'x=2(135°−90°)'), done(6, 'x=90°'))
    ]),
    lesson('내심의 각의 비에서 C각', 'C각', '∠C = 30°', ratios, concept('ratio-c', '∠AIB:∠BIC:∠CIA=7:8:9인 삼각형에서, 내심의 각을 이용해 ∠C를 구하세요.'), [
      ch('C와 마주 보는 내심의 각', 'C의 각에는 A와 B를 잇는 ∠AIB를 대응해요.', '비의 7단위가 ∠AIB에 해당해요.', cue(1, '구할 각은 C, 사용할 각은 AIB'), cue(2, '∠AIB에 해당하는 비는 7')),
      ch('필요한 내심의 각', '한 바퀴를 24단위로 나누면 한 단위는 15°예요.', '∠AIB=7×15°=105°예요.', calc(2, '∠AIB=360°×7÷24=105°')),
      ch('꼭짓점의 각으로 바꾸기', '∠C=2(∠AIB−90°)를 사용해요.', '2×(105°−90°)이므로 ∠C = 30°예요.', cue(3, '∠C=2(∠AIB−90°)'), done(4, '∠C=30°'))
    ])
  ];
  const threeSides = { trNp: 9, trNq: 7, trNs: 8, trV: 0 };
  bank['t6-8'] = [
    lesson('변의 식에서 접선만 남기기', '식의원리', 'AF=(AB+CA−BC)÷2', threeSides, concept('tangent-formula', '접선 길이를 p, q, r로 놓고 세 변의 합과 차로 AF를 구하는 식을 만들어 보세요.'), [
      ch('접선 길이에 문자 붙이기', 'p는 AF와 AE, q는 BF와 BD, r은 CD와 CE예요.', '같은 꼭짓점에서 그은 두 접선은 길이가 같아요.', cue(1, 'p, q, r: 각 꼭짓점의 접선 길이'), cue(2, '접점에 내린 반지름과 합동')),
      ch('구할 접선이 두 번 나오게', 'AB=p+q, CA=r+p, BC=q+r예요.', '앞의 두 변을 더하고 BC를 빼면 2p가 남아요.', cue(3, '(p+q)+(r+p)−(q+r)=2p')),
      ch('접선 한 개의 길이', 'A를 낀 두 변에서 반대쪽 변을 빼고 2로 나눠요.', '따라서 AF=(AB+CA−BC)÷2예요.', {}, done(4, 'AF=(AB+CA−BC)÷2'))
    ]),
    lesson('변의 길이로 AF 찾기', 'AF길이', 'AF = 4 cm', threeSides, {}, [
      ch('A에서 그은 두 접선', 'AB=9, BC=8, CA=7 cm예요. 구할 접선은 AF예요.', 'AF=AE=p, BF=BD=q, CD=CE=r로 놓아요.', cue(1, 'AB=9, BC=8, CA=7'), cue(3, 'AF=AE=p')),
      ch('p만 남기는 식', 'A를 낀 AB와 CA를 더하고 BC를 빼요.', '(p+q)+(r+p)−(q+r)=2p예요.', cue(4, 'AB+CA−BC=2p')),
      ch('두 번 센 길이를 반으로', 'p=(9+7−8)÷2로 계산해요.', '따라서 AF = 4 cm예요.', calc(5, 'p=(9+7−8)÷2'), done(6, 'x=4 cm'))
    ]),
    lesson('변의 길이로 BD 찾기', 'BD길이', 'BD = 5 cm', { ...threeSides, trV: 1 }, {}, [
      ch('B에서 그은 두 접선', 'AB=9, BC=8, CA=7 cm예요. 구할 접선은 BD예요.', 'BF=BD=q이고 세 변은 두 접선씩 더한 값이에요.', cue(1, 'AB=9, BC=8, CA=7'), cue(3, 'BF=BD=q')),
      ch('q만 남기는 식', 'B를 낀 AB와 BC를 더하고 CA를 빼요.', '(p+q)+(q+r)−(r+p)=2q예요.', cue(4, 'AB+BC−CA=2q')),
      ch('접선 하나의 길이', 'q=(9+8−7)÷2로 계산해요.', '따라서 BD = 5 cm예요.', calc(5, 'q=(9+8−7)÷2'), done(6, 'x=5 cm'))
    ]),
    lesson('변의 길이로 CE 찾기', 'CE길이', 'CE = 3 cm', { ...threeSides, trV: 2 }, {}, [
      ch('C에서 그은 두 접선', 'AB=9, BC=8, CA=7 cm예요. 구할 접선은 CE예요.', 'CD=CE=r로 놓고 C를 낀 두 변을 봐요.', cue(1, 'AB=9, BC=8, CA=7'), cue(3, 'CD=CE=r')),
      ch('r만 남기는 식', 'BC와 CA를 더하고 반대쪽 AB를 빼요.', '(q+r)+(r+p)−(p+q)=2r예요.', cue(4, 'BC+CA−AB=2r')),
      ch('두 번 센 길이를 반으로', 'r=(8+7−9)÷2로 계산해요.', '따라서 CE = 3 cm예요.', calc(5, 'r=(8+7−9)÷2'), done(6, 'x=3 cm'))
    ])
  ];
  const iso = { trMa: 52, trV: 0 };
  bank['t7-1'] = [
    lesson('이등변삼각형의 두 중심 위치', '중심위치', '두 중심은 대칭축 위에 있어요', iso, concept('iso-centres', 'AB=AC인 이등변삼각형에서 외심 O와 내심 I는 왜 꼭지각의 이등분선 위에 있을까요?'), [
      ch('대칭축과 밑변', 'AB와 AC가 같으므로 꼭지각의 이등분선이 대칭축이에요.', '이 선은 BC의 중점을 지나며 BC에 수직이에요.', cue(1, 'AB=AC · 꼭지각의 이등분선')),
      ch('외심의 위치 확인', '외심 O는 BC의 수직이등분선 위에 있어요.', '그 수직이등분선이 바로 삼각형의 대칭축이에요.', cue(2, 'OB=OC → BC의 수직이등분선')),
      ch('내심의 위치 확인', '내심 I는 꼭지각의 이등분선 위에 있어요.', '따라서 두 중심은 대칭축 위에 있어요.', cue(3, 'I는 ∠A의 이등분선 위'), done(4, 'O와 I는 모두 대칭축 위'))
    ]),
    lesson('외심과 내심 사이의 작은 각', 'OBI각', '∠OBI = 6°', iso, {}, [
      ch('두 중심의 역할 구별', 'AB=AC, ∠A=52°예요. BO와 BI 사이가 x예요.', 'O는 꼭짓점까지, I는 변까지 같은 거리인 점이에요.', cue(1, 'O: 외심 · I: 내심 · ∠OBI=x'), cue(2, '∠OBC와 ∠IBC를 각각 구해요')),
      ch('외심 쪽 각 구하기', '밑각 ∠B=∠C=(180°−52°)÷2=64°예요.', '∠BOC=104°이고 OB=OC이므로 ∠OBC=38°예요.', calc(3, '∠B=∠C=64°'), calc(4, '∠OBC=(180°−104°)÷2=38°')),
      ch('내심 쪽 각 구하기', 'BI는 ∠B의 이등분선이므로 ∠IBC=32°예요.', '두 선은 ∠B 안에 있으므로 두 각의 차를 구해요.', calc(5, '∠IBC=64°÷2=32°')),
      ch('큰 각에서 작은 각 빼기', 'BO가 이루는 38°에서 BI가 이루는 32°를 빼요.', '따라서 ∠OBI = 6°예요.', calc(6, 'x=38°−32°'), done(7, 'x=6°'))
    ]),
    lesson('외심과 밑변 사이의 각', 'OBC각', '∠OBC = 38°', { ...iso, trV: 1 }, {}, [
      ch('외심의 반지름 확인', '∠A=52°이고 O는 외심이에요. ∠OBC가 x예요.', 'OB와 OC가 같은 반지름인 △OBC를 봐요.', cue(1, '∠A=52°, ∠OBC=x'), cue(2, 'OB=OC')),
      ch('외심에서 만든 각', '외심에서 ∠BOC는 같은 호를 보는 ∠A의 두 배예요.', '∠BOC=2×52°=104°예요.', calc(3, '∠BOC=104°')),
      ch('같은 두 밑각 나누기', '△OBC의 남은 두 각은 같으므로 (180°−104°)÷2예요.', '따라서 ∠OBC = 38°예요.', calc(4, 'x=(180°−104°)÷2'), done(5, 'x=38°'))
    ]),
    lesson('외심각과 내심각의 차', '중심각차', '두 각의 차 = 12°', { ...iso, trV: 2 }, {}, [
      ch('같은 꼭짓각과 두 중심', '∠A=52°일 때 ∠BOC와 ∠BIC의 차를 구해요.', '외심의 각과 내심의 각은 서로 다른 성질을 써요.', cue(1, 'O는 외심, I는 내심'), cue(2, '두 각을 따로 구한 뒤 비교')),
      ch('내심에서 만든 각', '이등변삼각형의 밑각은 64°예요.', '∠IBC=32°이므로 ∠BIC=180°−64°=116°예요.', calc(3, '∠B=∠C=64°'), calc(4, '∠BIC=116°')),
      ch('외심에서 만든 각', '외심에서는 ∠BOC=2∠A=104°예요.', '내심의 각 116°가 외심의 각 104°보다 커요.', calc(5, '∠BOC=104°')),
      ch('두 각의 차 구하기', '큰 값 116°에서 작은 값 104°를 빼요.', '따라서 두 각의 차 = 12°예요.', calc(6, 'x=116°−104°'), done(7, 'x=12°'))
    ]),
    lesson('정삼각형에서 내심의 반쪽 각', '정삼각형각', '∠IBC = 30°', { trMa: 60, trV: 0 }, {}, [
      ch('꼭지각이 달라진 조건', 'AB=AC이고 ∠A=60°예요. 이번에는 ∠IBC가 x예요.', '먼저 이등변삼각형의 두 밑각을 구해요.', cue(1, '∠A=60°, ∠IBC=x'), cue(2, 'BI는 ∠B의 이등분선')),
      ch('두 밑각을 똑같이', '∠B=∠C=(180°−60°)÷2=60°예요.', '내심 I를 지나는 BI가 그 각을 다시 반으로 나눠요.', calc(3, '∠B=∠C=60°'), cue(4, '∠ABI=∠IBC')),
      ch('반쪽 각 구하기', '∠IBC=60°÷2로 계산해요.', '따라서 ∠IBC = 30°예요.', calc(5, 'x=60°÷2'), done(6, 'x=30°'))
    ])
  ];
  const right = { trMi: 0, trV: 0 };
  bank['t7-2'] = [
    lesson('직각삼각형 외접원의 반지름', '외접원원리', 'R=AB÷2', right, concept('right-R', '직각삼각형 ABC에서 빗변 AB의 길이로 외접원의 반지름 R을 어떻게 나타낼까요?'), [
      ch('빗변과 외심', '∠C는 직각이고 AB는 빗변이에요. R은 외접원 반지름이에요.', '직각삼각형의 외심은 빗변 AB의 중점이에요.', cue(1, '∠C=90°, 빗변 AB'), cue(2, 'OA=OB=OC')),
      ch('반지름과 빗변 연결', 'OA와 OB가 같은 반지름이고 AB를 반씩 나눠요.', '따라서 R=AB÷2예요.', cue(3, 'AB=OA+OB'), done(4, 'R=AB÷2'))
    ]),
    lesson('직각삼각형 내접원의 반지름', '내접원원리', 'r=(a+b−c)÷2', { ...right, trV: 1 }, concept('right-r', '직각변을 a, b, 빗변을 c라 하면 내접원의 반지름 r은 어떻게 구할까요?'), [
      ch('다른 반지름 구별', 'r은 I에서 변까지의 거리이고 c는 빗변이에요.', '직각 꼭짓점 C 옆의 정사각형을 찾아요.', cue(1, 'a=BC, b=CA, c=AB'), cue(2, '직각 꼭짓점 옆 정사각형')),
      ch('접선 두 개로 빗변', 'C에서 두 접점까지의 길이는 각각 r이에요.', '나머지 접선 두 개를 더하면 c=(a−r)+(b−r)예요.', cue(3, '같은 꼭짓점에서 그은 접선')),
      ch('반지름 정리', 'c=a+b−2r에서 2r=a+b−c예요.', '따라서 r=(a+b−c)÷2예요.', {}, done(4, 'r=(a+b−c)÷2'))
    ]),
    lesson('외접원에서 삼각형을 뺀 넓이', '색칠넓이', '$25\\pi-24\\text{ cm}^2$', right, {}, [
      ch('어느 부분의 넓이인지', '직각변은 6, 8 cm이고 빗변은 10 cm예요.', '구할 부분은 외접원에서 △ABC를 뺀 부분이에요.', cue(1, 'BC=6, CA=8, AB=10'), cue(2, '색칠한 부분=외접원−삼각형')),
      ch('외접원의 넓이', '외심은 빗변의 중점이므로 R=10÷2=5 cm예요.', '원의 넓이는 πR²이므로 25π cm²예요.', calc(3, 'R=5 cm'), calc(4, '외접원의 넓이=25π cm²')),
      ch('직각삼각형의 넓이', '직각을 낀 두 변이 밑변과 높이예요.', '삼각형의 넓이는 6×8÷2=24 cm²예요.', calc(5, '△ABC=6×8÷2=24 cm²')),
      ch('단위와 항을 유지하기', '원에서 삼각형을 빼고 π가 있는 항은 그대로 두어요.', '색칠한 부분은 25π−24 cm²예요.', calc(6, '원 넓이에서 삼각형 넓이를 빼요'), done(7, 'x=25π−24 cm²'))
    ]),
    lesson('외접원과 내접원 반지름의 합', '반지름합', 'R+r = 7 cm', { ...right, trV: 1 }, {}, [
      ch('두 반지름의 뜻', 'R은 O에서 꼭짓점까지, r은 I에서 변까지의 거리예요.', '직각변 6, 8 cm와 빗변 10 cm를 이용해요.', cue(1, '구할 값은 R+r'), cue(2, 'R과 r을 따로 계산해요')),
      ch('외접원의 반지름', '외심은 빗변의 중점이므로 R=10÷2예요.', '따라서 외접원의 반지름 R은 5 cm예요.', calc(3, 'R=10÷2=5 cm')),
      ch('내접원의 반지름', '직각 꼭짓점 옆 정사각형과 같은 접선을 사용해요.', 'r=(6+8−10)÷2=2 cm예요.', calc(4, 'r=(6+8−10)÷2=2 cm')),
      ch('구한 반지름 더하기', '구하는 것은 반지름 하나가 아니라 두 반지름의 합이에요.', '5+2이므로 R+r = 7 cm예요.', calc(5, 'x=R+r=5+2'), done(6, 'x=7 cm'))
    ])
  ];
  const oi = { trMx: 70, trMy: 56, trMk: 0, trPa: 110, trPb: 30, trQi: 0, trV: 0 };
  bank['t7-3'] = [
    lesson('외심에서 꼭짓점까지의 거리', '보기일', '①은 항상 참이에요', oi, concept('stmt-oa', '① 외심 O에서 세 꼭짓점 A, B, C까지의 거리가 같다는 설명은 항상 참일까요?'), [
      ch('외심의 정의에서 출발', '외심 O는 세 변의 수직이등분선이 만나는 점이에요.', '수직이등분선 위의 점은 양 끝점에서 같은 거리에 있어요.', cue(1, 'O: 세 변의 수직이등분선의 교점'), cue(2, '각 변의 두 끝점까지 거리 비교')),
      ch('세 거리 연결', 'AB와 BC에서 각각 OA=OB, OB=OC가 돼요.', '따라서 OA=OB=OC이고 ①은 항상 참이에요.', cue(3, '같은 거리의 관계를 연결해요'), done(4, 'OA=OB=OC: 외접원의 반지름'))
    ]),
    lesson('내심에서 변까지의 거리', '보기이', '②는 항상 참이에요', { ...oi, trMk: 1 }, concept('stmt-id', '② 내심 I에서 세 변까지의 거리가 같다는 설명은 항상 참일까요?'), [
      ch('내심과 수직거리', 'I는 세 내각의 이등분선이 만나는 점이에요.', '변까지의 거리는 수선을 내려서 재요.', cue(1, 'I: 세 내각의 이등분선의 교점'), cue(2, '각의 이등분선과 두 수직거리')),
      ch('세 수직거리 연결', '각의 이등분선 위의 점은 두 변에서 같은 거리에 있어요.', '세 변까지의 거리가 같으므로 ②는 항상 참이에요.', cue(3, 'ID, IE, IF는 같은 수직거리'), done(4, 'ID=IE=IF: 내접원의 반지름'))
    ]),
    lesson('외심은 항상 안쪽에 있을까', '보기삼', '③은 항상 참이 아니에요', { ...oi, trMy: 30, trMk: 2 }, concept('stmt-oin', '③ 외심 O는 항상 삼각형 내부에 있다는 설명을 직각·둔각삼각형으로 확인해 보세요.'), [
      ch('각을 바꾸어 반례 찾기', '한 모양만 보고 항상 성립한다고 판단하지 않아요.', '∠A를 직각으로 바꾸면 O는 빗변 위에 있어요.', { to: { trMx: 90 }, dur: 5, set: { trCCap: '예각에서 직각으로 바꿔 봐요' } }, cue(2, '∠A=90°: O는 빗변 위')),
      ch('둔각삼각형 확인', '∠A를 110°로 바꾸어 외심의 위치를 따라가요.', '이때 O는 삼각형 바깥에 있어요.', { to: { trMx: 110 }, dur: 5, set: { trCCap: '∠A를 둔각으로 바꿔요' } }, cue(3, '둔각삼각형에서는 O가 바깥')),
      ch('항상이라는 말 판별', '직각이나 둔각삼각형이 반례가 돼요.', '따라서 ③은 항상 참이 아니에요.', {}, done(4, '③: 직각·둔각삼각형이 반례'))
    ]),
    lesson('내심에서 꼭짓점까지의 거리', '보기사', '④는 항상 참이 아니에요', { ...oi, trMk: 3 }, concept('stmt-ia', '④ 내심 I에서 세 꼭짓점까지의 거리가 같다는 설명은 항상 참일까요?'), [
      ch('거리의 상대 확인', 'IA, IB, IC는 변이 아니라 꼭짓점까지의 거리예요.', '세 길이를 서로 다른 색으로 표시해 비교해요.', cue(1, 'IA, IB, IC: 꼭짓점까지 거리'), cue(2, '내심에서 세 꼭짓점을 이어요')),
      ch('정의와 특별한 경우 구별', '이 삼각형에서는 세 선분의 실제 길이가 달라요.', '정삼각형에서 같은 특별한 경우와 구별해야 해요.', cue(3, '서로 다른 길이를 가진 삼각형이 반례')),
      ch('언제나 같은 거리인지', '내심에서 언제나 같은 거리는 세 변까지의 거리예요.', '따라서 ④는 항상 참이 아니에요.', {}, done(4, '④: 꼭짓점까지의 거리는 일반적으로 달라요'))
    ]),
    lesson('내심의 위치는 항상 안쪽일까', '보기오', '⑤는 항상 참이에요', { ...oi, trMy: 30, trMk: 4 }, concept('stmt-iin', '⑤ 내심 I는 항상 삼각형 내부에 있다는 설명은 왜 참일까요?'), [
      ch('내각의 이등분선', '내심은 세 내각의 이등분선의 교점이에요.', '두 내각의 이등분선은 삼각형 안에서 만나요.', cue(1, '세 내각의 이등분선'), cue(2, '내각 안으로 향하는 선들의 교점')),
      ch('삼각형을 바꾸어 확인', '∠A를 둔각으로 바꾸어도 I를 따라가 보세요.', '모양은 바뀌어도 세 내각의 이등분선은 안에서 만나요.', { to: { trMx: 110 }, dur: 5, set: { trCCap: '모양을 바꾸며 내심 I의 위치 확인' } }, cue(3, '내심은 삼각형 내부의 교점')),
      ch('외심과 위치 구별', '외심의 위치와 내심의 위치를 바꾸어 외우지 않아요.', '내심은 늘 내부에 있으므로 ⑤는 항상 참이에요.', {}, done(4, '⑤: 내심 I는 항상 삼각형 내부'))
    ]),
    lesson('외심과 내심의 옳은 설명', '옳은보기', '정답은 ③', oi, {}, [
      ch('정의와 반례로 판단', 'O는 외심, I는 내심이고 ∠A=110°인 그림이에요.', '보기마다 언제나 성립할 이유나 반례를 찾아요.', cue(1, '외심 O와 내심 I 구별'), cue(2, '옳은 보기 한 개를 찾아요')),
      ch('교점과 거리 구별', '① 수직이등분선의 교점은 I가 아니라 O예요.', '② 내심에서 꼭짓점까지의 거리는 같지 않아요.', cue(3, '①: 수직이등분선의 교점은 O'), cue(4, '②: IA, IB, IC는 달라요')),
      ch('위치와 각 비교', '④ 둔각삼각형의 외심은 바깥에 있어요.', '⑤ 그림의 ∠BOC=140°, ∠BIC=145°로 달라요.', cue(6, '④: 둔각삼각형이 반례'), calc(7, '⑤: 140°와 145°는 달라요')),
      ch('남은 보기의 이유', '③ 내각의 이등분선은 삼각형 내부에서 만나요.', '내심은 늘 내부에 있으므로 정답은 ③예요.', cue(5, '③: 세 내각의 이등분선'), done(8, '옳은 것: ③'))
    ]),
    lesson('외심과 내심의 틀린 설명', '틀린보기', '정답은 ①', { ...oi, trQi: 1 }, {}, [
      ch('이번에는 틀린 보기 찾기', '같은 삼각형에서도 묻는 문장을 끝까지 확인해요.', '이번에는 옳지 않은 보기 한 개를 찾아요.', cue(1, '∠A=110°, O는 외심, I는 내심'), cue(2, '정의 또는 반례로 확인')),
      ch('각의 성질과 외심의 정의', '② 내심의 각은 90°에 ∠A의 반을 더한 값이에요.', '③ 외심은 세 변의 수직이등분선의 교점이에요.', calc(4, '②: ∠BIC=145°'), cue(5, '③: 세 수직이등분선의 교점 O')),
      ch('내심의 정의와 반지름', '④ 내심은 세 내각의 이등분선의 교점이에요.', '⑤ 외심에서 세 꼭짓점까지는 같은 반지름이에요.', cue(6, '④: 세 내각의 이등분선의 교점 I'), cue(7, '⑤: OA=OB=OC')),
      ch('두 중심에서 만든 각 비교', '① 이 그림의 두 각은 140°와 145°로 달라요.', '같다는 설명이 틀리므로 정답은 ①예요.', calc(3, '∠BOC=140°, ∠BIC=145°'), done(8, '옳지 않은 것: ①'))
    ])
  ];
  // trMx는 반례 탐구에서 움직이는 값이다. start로 초기화하며, set에
  // 남겨 매 프레임 보간값을 덮지 않는다. 모든 형제 해설이 같은 규칙을 쓴다.
  bank['t7-3'].forEach(item => { delete item.chapters[0].cues[0].set.trMx; });
  const equi = { trMr: 3, trV: 0 };
  bank['t7-4'] = [
    lesson('정삼각형의 두 중심 관계', '중심관계', '외심과 내심은 일치해요', equi, concept('equi-centres', '정삼각형의 외심과 내심은 어떤 관계일까요? 각의 이등분선과 수직이등분선을 비교해 보세요.'), [
      ch('같은 세 변의 삼각형', '정삼각형은 어느 꼭짓점에서 보아도 이등변삼각형이에요.', '꼭지각의 이등분선은 맞은편 변을 수직이등분해요.', cue(1, '세 변의 길이가 같아요'), cue(2, '각의 이등분선=맞은편 변의 수직이등분선')),
      ch('교점의 뜻 연결', '세 각의 이등분선과 세 수직이등분선이 같은 선들이에요.', '같은 선들의 교점이므로 외심과 내심은 일치해요.', cue(3, '두 종류의 선이 겹쳐요'), done(4, '정삼각형의 외심=내심'))
    ]),
    lesson('정삼각형의 두 반지름 비교', '반지름비', 'R:r=2:1', equi, concept('equi-ratio', '정삼각형의 외접원 반지름 R과 내접원 반지름 r의 비는 얼마일까요?'), [
      ch('같은 중심에서 다른 거리', 'R은 중심에서 꼭짓점까지, r은 변까지의 거리예요.', 'D는 BC의 중점이고 OD는 BC에 수직이에요.', cue(1, 'R=OB, r=OD'), cue(2, '△OBD의 직각은 D')),
      ch('삼십 도 직각삼각형', 'BO가 60°인 각을 이등분하여 ∠OBD=30°예요.', '30°의 마주 변 OD는 빗변 OB의 절반이에요.', cue(3, '∠OBD=30°, ∠ODB=90°')),
      ch('같은 단위로 비 나타내기', 'r에 해당하는 OD가 두 번 모이면 R에 해당하는 OB예요.', '따라서 R:r=2:1이에요.', {}, done(4, 'R:r=2:1'))
    ]),
    lesson('내접원에서 외접원 반지름', 'R구하기', 'R = 6 cm', equi, {}, [
      ch('주어진 반지름 확인', '정삼각형의 내접원 반지름 OD=3 cm예요.', '구할 것은 외접원 반지름 OA예요.', cue(1, 'OD=3 cm, OA=x'), cue(2, '△OBD의 30°와 직각')),
      ch('두 반지름의 관계', 'BO는 60°를 이등분하므로 ∠OBD=30°예요.', 'OD는 OB의 절반이고 OA와 OB는 같은 반지름이에요.', cue(3, '∠OBD=30°'), cue(4, 'OD=½OB, OA=OB')),
      ch('외접원 반지름 구하기', 'OA=2×OD=2×3으로 계산해요.', '따라서 R = 6 cm예요.', calc(5, 'OA=2×3'), done(6, 'x=6 cm'))
    ]),
    lesson('외접원에서 내접원 반지름', 'r구하기', 'r = 3 cm', { ...equi, trV: 1 }, {}, [
      ch('구하는 거리 바뀌기', '외접원의 반지름 OA=6 cm이고 OD가 x예요.', 'OA와 OB가 같으므로 △OBD의 빗변 길이를 알아요.', cue(1, 'OA=6 cm, OD=x'), cue(2, 'OA=OB')),
      ch('직각삼각형의 변 관계', '∠OBD=30°이고 D는 직각이에요.', '30°와 마주 보는 OD는 빗변 OB의 절반이에요.', cue(3, '∠OBD=30°'), cue(4, 'OD=½OB')),
      ch('내접원 반지름 구하기', 'OD=OA÷2=6÷2로 계산해요.', '따라서 r = 3 cm예요.', calc(5, 'OD=6÷2'), done(6, 'x=3 cm'))
    ]),
    lesson('내접원 반지름으로 높이', '높이', 'AD = 9 cm', { ...equi, trV: 2 }, {}, [
      ch('높이의 두 조각', 'OD=3 cm이고 높이 AD를 구해요.', '높이는 A에서 O를 지나 D까지의 거리예요.', cue(1, 'OD=3 cm, AD=x'), cue(2, 'AD=AO+OD')),
      ch('외접원 반지름 찾기', '△OBD에서 OB는 OD의 두 배예요.', 'OA=OB=6 cm이므로 높이의 두 조각을 알 수 있어요.', cue(4, 'OD=½OB'), calc(5, 'AO=6 cm, OD=3 cm')),
      ch('높이를 끝까지 더하기', '외접원 반지름 AO만 쓰지 않고 OD도 더해요.', '6+3이므로 AD = 9 cm예요.', calc(6, 'AD=AO+OD=6+3'), done(7, 'x=9 cm'))
    ])
  ];
  const feet = { trMs: 60, trMt: 70, trM: 6, trX: [4, 3, 5], trV: 0 };
  bank['t7-5'] = [
    lesson('외심에서 내린 수선의 발', '외심의발', 'BD=CD', feet, concept('midpoint', '외심 O에서 BC에 내린 수선의 발 D는 왜 BC의 중점일까요?'), [
      ch('외심에서 같은 거리', 'O에서 B, C까지는 같은 외접원의 반지름이에요.', '그래서 △OBC는 이등변삼각형이에요.', cue(1, 'D: O에서 BC에 내린 수선의 발'), cue(2, 'OB=OC')),
      ch('밑변에 내린 수선', '이등변삼각형의 꼭짓점에서 밑변에 내린 수선을 봐요.', '두 직각삼각형은 공통 변과 같은 빗변으로 RHS 합동이에요.', cue(2, '△OBD와 △OCD의 합동')),
      ch('중점 확인', '대응하는 밑변의 두 조각 길이가 같아요.', '따라서 BD=CD이고 D는 BC의 중점이에요.', cue(3, '대응변의 길이 비교'), done(4, 'BD=CD: D는 BC의 중점'))
    ]),
    lesson('내심의 발도 항상 중점일까', '내심의발', 'BD와 CD는 항상 같지는 않아요', { ...feet, trV: 1 }, concept('foot', '내심 I에서 BC에 내린 수선의 발 D에서도 BD와 CD는 항상 같을까요?'), [
      ch('수선의 발과 접점', '내심의 D는 내접원이 BC에 접하는 점이에요.', '내심에서 변까지의 수직거리가 반지름이에요.', cue(1, 'D: I에서 BC에 내린 수선의 발'), cue(2, '내접원과 BC의 접점 D')),
      ch('같은 접선의 올바른 짝', 'B에서 그은 BD와 BF, C에서 그은 CD와 CE가 같아요.', 'BD와 CD는 서로 다른 꼭짓점에서 시작한 접선이에요.', cue(3, 'BD=BF, CD=CE')),
      ch('중점과 구별', '이 그림은 AB와 AC가 달라 D가 중점이 아니에요.', '따라서 BD와 CD는 항상 같지는 않아요.', {}, done(4, '내심의 수선의 발은 항상 중점이 아니에요'))
    ]),
    lesson('외심의 수선으로 길이 구하기', '외심BD', 'BD = 6 cm', feet, {}, [
      ch('어느 중심에서 내린 수선인지', 'O는 외심이고 OD는 BC에 수직이에요. BC=12 cm예요.', '외심에서 B와 C까지는 같은 반지름이에요.', cue(1, 'O는 외심 · BC=12 cm'), cue(2, 'OB=OC')),
      ch('수선과 중점', '△OBC는 이등변삼각형이에요.', '꼭짓점에서 밑변에 내린 수선은 밑변을 이등분해요.', cue(3, '△OBC의 같은 두 변'), cue(4, 'D는 BC의 중점')),
      ch('길이를 반으로', 'BD=BC÷2=12÷2로 계산해요.', '따라서 BD = 6 cm예요.', calc(5, 'BD=12÷2'), done(6, 'x=6 cm'))
    ]),
    lesson('내심의 수선으로 길이 구하기', '내심BD', 'BD = 3 cm', { ...feet, trV: 1 }, {}, [
      ch('내심의 D는 접점', 'AB=7, BC=8, CA=9 cm예요. I는 내심이에요.', 'D를 중점으로 단정하지 말고 같은 접선을 찾아요.', cue(1, 'AB=7, BC=8, CA=9'), cue(2, '내심의 D는 내접원의 접점')),
      ch('구할 길이만 남기기', 'AF=AE=p, BF=BD=q, CD=CE=r로 놓아요.', 'AB+BC−CA=(p+q)+(q+r)−(r+p)=2q예요.', cue(3, '구할 BD=q'), cue(4, 'AB+BC−CA=2q')),
      ch('접선의 길이 계산', 'q=(7+8−9)÷2로 계산해요.', '따라서 BD = 3 cm이고 BC의 반과는 달라요.', calc(5, 'q=(7+8−9)÷2'), done(6, 'x=3 cm'))
    ]),
    lesson('외심과 내심의 수선 구별', '보기판별', '정답은 ⑤', { ...feet, trV: 2 }, {}, [
      ch('두 그림의 중심 확인', '왼쪽 O는 외심, 오른쪽 I는 내심이에요.', '같은 이름 D라도 어느 중심에서 내린 발인지 봐요.', cue(1, '왼쪽: 외심 · 오른쪽: 내심'), cue(2, '정의와 반례로 옳은 보기 찾기')),
      ch('변까지의 거리와 중점', '① 외심에서 세 변까지의 거리는 일반적으로 달라요.', '② 내심의 D는 항상 중점인 것은 아니에요.', cue(3, '①: OD, OE, OF가 다른 반례'), cue(4, '②: 내심의 D는 접점')),
      ch('꼭짓점까지의 거리와 중점', '③ 내심에서 세 꼭짓점까지도 일반적으로 달라요.', '④ 외심의 수선의 발은 늘 해당 변의 중점이에요.', cue(5, '③: IA, IB, IC가 다른 반례'), cue(6, '④: 외심의 D는 늘 중점')),
      ch('외심의 같은 반지름', '⑤ 외심에서 세 꼭짓점까지는 같은 반지름이에요.', 'OA=OB=OC이므로 정답은 ⑤예요.', cue(7, '⑤: 외접원의 세 반지름'), done(8, '옳은 것: ⑤'))
    ])
  ];
})();
