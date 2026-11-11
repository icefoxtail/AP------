/* Source questions, staged native figures and the existing 1.5× lesson Player. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), ...(options.step == null ? {} : { step: options.step }), set: { ...options.set } },
      { at: options.third ? 5 : 6, ...caption(second), ...(options.end ? { set: options.end } : {}) }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third) });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4, ...(options.snap ? { snap: options.snap } : {}) });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  const boardState = new WeakMap();
  function restore(b) {
    const saved = b && boardState.get(b);
    if (!saved) return;
    Object.assign(b, saved);
    boardState.delete(b);
  }
  function packet(source, id, s) {
    const first = source.first(id);
    if (!s.lglConcept) return first;
    let kind, e;
    if (id === 'log1') { kind = 'vert'; e = { ...first.e, k: s.log1_multK, x1: s.log1_xCut1, x2: s.log1_xCut2 }; }
    else if (id === 'log2') { kind = 'absM'; e = { ...first.e, p: s.log2_shiftP, t: s.log2_lineT }; }
    else if (id === 'log3') { kind = 'xlat'; e = { ...first.e, m: s.log3_expM, n: s.log3_expN, q: s.log3_logQ, k: s.log3_lineK }; }
    else { kind = 'latt'; e = { ...first.e, K: s.log4_maxX }; }
    return { ...global.ALV.KINDS[kind](e), kind };
  }
  function wing(b, s) {
    const limit = b.viewBox();
    b.plot(x => 2 * Math.log2(x), { from: .03, to: limit.x1, color: 'green', width: 2.8 });
    if (s.lglStage >= 1) b.plot(x => 2 * Math.log2(-x), { from: limit.x0, to: -.03, color: 'rose', width: 2.8 });
    b.text([2.4, 2.8], 'y = log₂(x²)', { color: 'green', size: 12.5, dy: -16 });
    if (s.lglStage >= 2) {
      if (s.lglLeft) b.point([-2, 2], { label: '(−2, 2)', color: 'rose', r: 6, dx: -8, dy: -14, align: 'right' });
      if (s.lglRight) {
        b.point([2, 2], { label: '(2, 2)', color: 'green', r: 6, dx: 8, dy: 16 });
        b.seg([-2, 2], [2, 2], { color: 'violet', dash: true, width: 1.6 });
      }
    }
  }
  function lattice(b, v, s) {
    global.ALV.draw(b, v, 0, {});
    if (s.lglColumns) for (let x = 2; x <= v.K; x++) b.seg([x, 0], [x, Math.floor(Math.log2(x))], { color: 'sky', width: 1.6, dash: true });
    const rows = v.rows.slice(0, s.lglRows).filter(row => !s.lglRowOnly || row.y === s.lglRowOnly);
    for (const row of rows) {
      if (!s.lglColumns) b.seg([row.x0, row.y], [v.K, row.y], { color: 'rose', width: 3.2 });
      for (let x = row.x0; x <= v.K; x++) b.point([x, row.y], { color: 'amber', r: 4.6 });
      if (row.y <= s.lglCountRows) b.text([v.K, row.y], `${row.cnt}개`, { color: 'rose', size: 12.5, weight: 800, align: 'left', dx: 12 });
    }
    if (s.lglShowAnswer && s.lglTarget === '격자점') b.text([v.K / 2, -.75], `${v.rows.map(row => row.cnt).join(' + ')} = ${v.total}개`, { color: 'amber', size: 13, weight: 800 });
  }
  function trace(b, s, id, v) {
    const t = Math.max(0, Math.min(1, Number(s.lglTrace) || 0));
    if (s.lessonEntry || !t) return;
    let lo, hi, fn;
    if (id === 'log1') { lo = v.e.x1; hi = v.e.x2; fn = v.f; }
    else if (id === 'log2' && s.lglMode === 'wing') { lo = 1; hi = 3; fn = x => 2 * Math.log2(x); }
    else if (id === 'log2') { lo = v.p + 1; hi = v.p + 3; fn = x => Math.log2(x - v.p); }
    else if (id === 'log3') { lo = v.e.m - .5; hi = v.e.m + 1; fn = x => 2 ** (x - v.e.m) + v.e.n; }
    else { lo = 1; hi = v.K; fn = Math.log2; }
    const x = lo + (hi - lo) * t;
    b.plot(fn, { from: lo, to: x, color: 'violet', width: 4.2, alpha: .8 });
    b.point([x, fn(x)], { color: 'violet', r: 4.5, glow: false });
  }
  function drawLesson(b, s, id, source) {
    const v = packet(source, id, s), originalPoint = b.point;
    global.ALV.gridAxes(b, s, v);
    if (id === 'log2' && s.lglMode === 'wing') wing(b, s);
    else if (id === 'log4') lattice(b, v, s);
    else {
      // The native figure can show both roots at once. Their numerical labels
      // follow the individual captions instead of exposing the other root.
      b.point = function (point, options = {}) {
        let label = options.label;
        if (typeof label === 'string') {
          if (/^x₁ =/.test(label) && !s.lglLeft) label = 'x₁';
          if (/^x₂ =/.test(label) && !s.lglRight) label = 'x₂';
          if (/^M\(/.test(label) && !s.lglMidpoint) label = 'M';
          if (id === 'log3' && !s.lglM0 && Array.isArray(point) && point[0] === v.M0[0] && point[1] === v.M0[1]) label = 'M₀';
        }
        return originalPoint.call(this, point, { ...options, label });
      };
      try { global.ALV.draw(b, v, s.lglStage, {}); }
      finally { b.point = originalPoint; }
      if (id === 'log2' && s.lglMidpoint) b.text([(v.x1 + v.x2) / 2, v.t], `M(${global.ALV.fstr((v.x1 + v.x2) * 2 ** v.t, 2 ** (v.t + 1))}, ${v.t})`, { color: 'sky', size: 12, dx: 12, dy: 18, align: 'left' });
      if (id === 'log2' && s.lglMode === 'amgm' && s.lglStage >= 3) b.seg([v.p + 1, 0], [v.p + 1, v.t], { color: 'violet', width: 1.6, dash: true });
      if (id === 'log3' && s.lglM0 && s.lglStage < 2) b.point(v.M0, { label: `M₀(${v.M0.join(', ')})`, color: 'rose', r: 5, dx: 10, dy: 14 });
      if (id === 'log3' && s.lglMirror) {
        const u = s.lglU, P = [v.e.m + u, 2 ** u + v.e.n], Q = [2 ** u + v.p, u + v.e.q];
        b.seg(P, Q, { color: 'rose', width: 2, dash: true });
        b.point(P, { label: 'P', color: 'green', r: 6, dx: -10, dy: -12, align: 'right' });
        b.point(Q, { label: "P′", color: 'sky', r: 6, dx: 10, dy: 14 });
      }
    }
    trace(b, s, id, v);
  }
  global.APL_LOG_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing log scene: ' + id);
        const first = chapters[0];
        first.start = { ...source.initial(id), lglTrace: 0, lglU: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, i) => { if (chapter.cues[0].step == null) chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = {
          lglQuestion: options.concept ? options.question : source.question(id),
          lglConcept: !!options.concept, lglTarget: label, lglMode: '', lglStage: 0,
          lglRows: 0, lglColumns: false, lglCountRows: 0, lglRowOnly: 0,
          lglLeft: false, lglRight: false, lglMidpoint: false, lglM0: false, lglMirror: false,
          lglShowAnswer: false, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: .1, to: { lglTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0];
        final.set = { ...final.set, lglShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: answer,
          summary: options.summary || '로그의 조건과 식을 그래프의 위치·길이에 연결해요.',
          task: options.task || '직접 해 보기에서 조절값을 바꾸고 같은 관계를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) => add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_LOG_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing log sibling reset: ' + id + '/' + key);
          first.cues[0].set.lglInitial = copy({ ...first.start, ...first.cues[0].set, step: first.cues[0].step, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: sc.question, steps: sc.steps, reviewTop: sc.reviewTop, view: sc.view, draw: sc.draw, enter: sc.enter };
        sc.question = (s, lab) => active(s) ? s.lglQuestion || source.question(sc.id) : typeof original.question === 'function' ? original.question(s, lab) : original.question;
        sc.steps = (s, lab) => active(s) ? ['조건을 확인해요.', '그래프에서 전략을 찾아요.', '식을 세워 계산해요.', '구하는 값을 확인해요.'] : original.steps(s, lab);
        sc.reviewTop = (s, lab) => active(s) ? '' : original.reviewTop(s, lab);
        sc.view = (s, lab) => active(s) ? {} : original.view(s, lab);
        sc.enter = (s, lab) => { restore(lab && lab.board); original.enter(s, lab); };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const state = { ...s, ...(s.lessonEntry ? s.lglInitial : {}), playing: false };
          if (s.lessonEntry) { state.lglTrace = 0; state.lglShowAnswer = false; }
          if (!boardState.has(b)) {
            boardState.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY, _alvKey: b._alvKey });
          }
          // A sibling can use a different domain while sharing the same scene.
          const key = sc.id + ':' + state.lglTarget;
          if (b._alvKey !== key) {
            b._alvKey = key;
            b.setFocus(state.lglMode === 'wing' ? { x: [-5, 5], y: [-3, 5] } : source.first(sc.id).win, true);
          }
          drawLesson(b, state, sc.id, source);
        };
      }
      return lessons;
    }
  };
})(window);
