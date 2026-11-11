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
    chapters[0].start = { ...conditions };
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
      box: M => { const g = geometry(id, M); return G.bboxOf([g.A, g.B, g.C, g.I, ...(g.O ? [g.O] : [])]); },
      base: (b, M) => { const g = geometry(id, M); fillPoly(b, [g.A, g.B, g.C], 'sky', .07); poly(b, [g.A, g.B, g.C], 'ink', 3.4); },
      legend: (M, s) => id === 't7-4' ? 'O: 두 원의 중심 후보 · D: BC의 중점' : id === 't6-6' ? 'I: 내심 · D, E: 평행선과 두 변의 교점' : id.startsWith('t6') ? 'I: 내심 · D, E, F: 수선의 발' : 'O: 외심 · I: 내심',
      st: Object.fromEntries(['given', 'explain', 'derive', 'ans'].map((f, n) => [f, (L, M, s, X) => conceptStage(L, id, M, s, X, n)])),
      top: (b, M, s) => {
        const g = geometry(id, M), centre = G.centroid([g.A, g.B, g.C]);
        [['A', g.A], ['B', g.B], ['C', g.C]].forEach(([name, p]) => { b.point(p, { color: 'ink', r: 4.5 }); tagOut(b, p, centre, name, { size: 18 }); });
        if (g.O) { b.point(g.O, { color: 'rose', r: 5 }); T(b, g.O, 'O', { dx: -16, dy: -10, color: 'rose', size: 17 }); }
        if (id !== 't7-4') { b.point(g.I, { color: 'green', r: 5 }); T(b, g.I, 'I', { dx: 15, dy: 12, color: 'green', size: 17 }); }
        if (id === 't6-6') [['D', M.D], ['E', M.E]].forEach(([name, p]) => { b.point(p, { color: 'green', r: 4 }); tagOut(b, p, centre, name, { size: 16 }); });
        else if (!['incenter-meet', 'halfsum', 'bic', 'ratio', 'ratio-c', 'iso-centres', 'right-R'].includes(s.trCMode) && !s.trCMode.startsWith('stmt-')) [['D', id === 't7-5' && s.trCMode === 'midpoint' ? M.DO : g.D], ['E', g.E], ['F', g.F]].forEach(([name, p]) => { if (id === 't7-4' && name !== 'D') return; b.point(p, { color: 'green', r: 3.8 }); tagOut(b, p, g.I, name, { size: 15, gap: 8 }); });
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
})();
