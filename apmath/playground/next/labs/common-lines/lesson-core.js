/* Reuse the existing coordinate diagrams and the shared automatic player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  const U = 36, p = ([x, y]) => ({ x: U * x, y: -U * y });
  const box = (x0, x1, y0, y1) => ({ x: [U * x0, U * x1], y: [-U * y1, -U * y0] });
  function focus(id, mode = '') {
    if (id === 'centroidParaCoord' && mode === 'unordered') return box(-11, 11, -6.5, 6.5);
    if (id === 'distMinSumSq' && ['sum', 'axis'].includes(mode)) return box(-5.2, 7, -4, 5.2);
    if (id === 'threeLinesNoTri' && mode === 'regions') return box(-5, 5, -4, 4);
    if (id === 'symmetry4Basic' && mode.startsWith('sym-')) return box(-6.5, 6.5, -6, 6);
    if (id === 'symPointAndLine' && mode === 'point-symmetry') return box(-3, 5, -1.5, 4);
    if (id === 'reflectTriPerim' && mode === 'angle') return box(-1.5, 5, -2.5, 4.5);
    if (id === 'diffMaxLine' && mode === 'sum') return box(-1.5, 5.5, -4.5, 4.5);
    if (id === 'trapLineSegmentMeet' && mode === 'open') return box(-1.5, 6, -2.5, 5);
    if (id === 'trapInterceptZero' && mode.startsWith('intercept-')) return box(-3.5, 8, -2, 8);
    return null;
  }
  function drawConcept(b, s, id) {
    const mode = s.lclMode || '';
    if (!focus(id, mode)) return false;
    const seg = (a, z, color = 'sky', width = 3, dash) => b.seg(p(a), p(z), { color, width, dash });
    const line = (m, c, color = 'sky', width = 3.2) => seg([-12, -12 * m + c], [12, 12 * m + c], color, width);
    const dot = (a, label, color = 'ink', options = {}) => b.point(p(a), { color, r: 5, label, dx: 10, dy: -12, ...options });
    const poly = (ps, color = 'sky') => b.poly(ps.map(p), { color, width: 3, fill: color, fillAlpha: 0.1 });
    const label = (name, a) => `${name}(${a[0]}, ${a[1]})`;
    if (id === 'centroidParaCoord') {
      const A = [0, 4], B = [-3, -1], C = [6, 0], which = Math.max(0, Math.min(2, Math.round(s.lclCase)));
      const D = [[9, 5], [-9, 3], [3, -5]][which], shape = [[A, B, C, D], [A, C, B, D], [A, B, D, C]][which];
      poly(shape, 'rose'); seg(shape[0], shape[2], 'muted', 1.8, [5, 4]); seg(shape[1], shape[3], 'muted', 1.8, [5, 4]);
      [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D']].forEach(([a, name]) => dot(a, label(name, a), name === 'D' ? 'rose' : 'sky'));
    } else if (id === 'distMinSumSq') {
      const A = [-2, 3], B = [-3, -2], C = [5, 2], G = [0, 1];
      if (mode === 'sum') {
        const t = Math.max(0, Math.min(1, s.lclT)), P = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
        seg(A, P, 'sky', 4); seg(P, B, 'rose', 4); dot(P, 'P', 'amber');
      } else {
        const P = [s.lclX, 0]; poly([A, B, C], 'green');
        [A, B, C].forEach(a => seg(P, a, 'amber')); seg(P, G, 'rose', 1.8, [5, 4]);
        dot(C, label('C', C)); dot(G, label('G', G), 'rose'); dot(P, 'P', 'amber');
      }
      dot(A, label('A', A)); dot(B, label('B', B));
    } else if (id === 'threeLinesNoTri') {
      const which = Math.max(0, Math.min(3, Math.round(s.lclCase)));
      if (which === 0) { line(0, -1, 'sky'); line(0, 0, 'green'); line(0, 1, 'amber'); }
      else if (which === 1) { line(0, -1, 'sky'); line(0, 1, 'green'); seg([0, -12], [0, 12], 'amber', 3.2); }
      else if (which === 2) { line(0, 0, 'sky'); line(1, 0, 'green'); line(-1, 0, 'amber'); dot([0, 0], 'O'); }
      else { line(0, 0, 'sky'); line(1, 1, 'green'); line(-1, 1, 'amber'); }
      if (s.lclShowAnswer) b.text(p([-4, 3]), `영역 ${[4, 6, 6, 7][which]}개`, { color: 'ink', size: 16 });
    } else if (id === 'symmetry4Basic') {
      const base = [[2, 1], [5, 1], [2, 3]];
      const image = ([x, y]) => mode === 'sym-x' ? [x, -y] : mode === 'sym-y' ? [-x, y] : mode === 'sym-origin' ? [-x, -y] : mode === 'sym-diagonal' ? [y, x] : [-y, -x];
      const reflected = base.map(image); poly(base, 'sky'); poly(reflected, 'rose');
      if (mode === 'sym-diagonal' || mode === 'sym-antidiagonal') line(mode === 'sym-diagonal' ? 1 : -1, 0, 'green', 2.5);
      base.forEach((a, i) => { dot(a, ['A', 'B', 'C'][i], 'sky'); dot(reflected[i], ['A′', 'B′', 'C′'][i], 'rose'); seg(a, reflected[i], 'muted', 1.5, [4, 4]); });
    } else if (id === 'symPointAndLine') {
      const P = [3, 1], M = [1, 1], Q = [-1, 1]; seg(P, Q, 'rose', 3.2);
      b.ticks(p(P), p(M), { color: 'rose', count: 1 }); b.ticks(p(M), p(Q), { color: 'rose', count: 1 });
      dot(P, label('P', P), 'sky'); dot(M, label('M', M), 'green'); dot(Q, label('P′', Q), 'rose');
    } else if (id === 'reflectTriPerim') {
      const O = [0, 0], A = [3, 1], A1 = [3, -1], A2 = [1, 3];
      poly([O, A1, A2], 'amber'); seg(O, A1, 'sky'); seg(O, A2, 'green'); seg(A1, A2, 'rose', 3.6);
      b.right(p(O), p(A1), p(A2), { color: 'amber', size: 12 });
      [[O, 'O'], [A, 'A'], [A1, 'A₁'], [A2, 'A₂']].forEach(([a, name]) => dot(a, label(name, a)));
    } else if (id === 'diffMaxLine') {
      const A = [1, 1], B = [3, 3], Q = [3, -3], P = [1.5, 0];
      seg(A, Q, 'green', 3.2); seg(B, Q, 'muted', 1.8, [5, 4]); seg(A, P, 'sky', 3.6); seg(P, B, 'rose', 3.6);
      [[A, 'A'], [B, 'B'], [Q, 'B′'], [P, 'P']].forEach(([a, name]) => dot(a, label(name, a)));
    } else if (id === 'trapLineSegmentMeet') {
      const A = [1, 3], B = [4, 1], P = [0, -1]; seg(A, B, 'green', 4.2); line(0.5 + 3.5 * s.fold, -1, 'sky', 3.6);
      dot(P, label('P', P), 'amber'); dot(A, label('A', A), 'green', { hollow: true }); dot(B, label('B', B), 'green', { hollow: true });
    } else if (id === 'trapInterceptZero') {
      if (mode !== 'intercept-zero') { line(-1, 6, 'sky'); dot([6, 0], 'A', 'sky'); dot([0, 6], 'B', 'sky'); }
      if (mode !== 'intercept-nonzero') { line(2, 0, 'rose'); dot([0, 0], 'O', 'rose'); }
      if (mode === 'intercept-absolute') { line(1, 2, 'green'); dot([-2, 0], 'C', 'green'); dot([0, 2], 'D', 'green'); }
      dot([2, 4], 'P(2, 4)', 'amber');
    }
    return true;
  }
  global.APL_CL_LESSONS = {
    focus, drawConcept,
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing coordinate scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lclTrace: 0, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
          for (const cue of chapter.cues) if (typeof cue.part === 'number') cue.part = String(cue.part);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lclQuestion: isConcept ? options.question : source.question(id),
          lclConcept: isConcept, lclExplore: isConcept, lclTarget: options.target || '',
          lclShowAnswer: false, lclMode: '', ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lclTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lclShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '좌표와 도형의 위치를 문제의 조건에 연결해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 원리를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_CL_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
