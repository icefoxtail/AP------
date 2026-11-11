/* Reuse the original circle-equation figures and the shared automatic player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  const U = 24, W = ([x, y]) => ({ x: U * x, y: -U * y });
  const box = (x0, x1, y0, y1) => ({ x: [U * x0, U * x1], y: [-U * y1, -U * y0] });
  function focus(id, mode) {
    if (id === 'tanPointOn' && mode === 'translated-point') return box(-5.5, 8, -7, 7);
    if (id === 'threePts' && mode === 'collinear') return box(-3.5, 3.5, -3, 3);
    if (id === 'twoPos5' && mode === 'two-position') return box(-5, 12, -5, 5);
    if (id === 'bisectCircum' && mode === 'bisect-diameter') return box(-4, 10, -6, 6);
    return null;
  }
  function drawConcept(b, s, id) {
    if (!focus(id, s.lceMode)) return false;
    const dot = (p, label, color = 'ink') => b.point(W(p), { color, r: 5, label, dx: 10, dy: -13 });
    const seg = (a, z, color, width = 2.8, dash) => b.seg(W(a), W(z), { color, width, dash });
    const circle = (p, r, color) => b.circle(W(p), U * r, { color, width: 3, fill: color, fillAlpha: 0.06 });
    if (id === 'tanPointOn') {
      const C = [1, -1], T = [4, 3], E = [8, 0];
      circle(C, 5, 'sky'); seg([-4 / 3, 7], E, 'amber', 3.4); seg(C, T, 'rose', 3.2);
      b.right(W(T), W(C), W(E), { color: 'rose', size: 12 });
      dot(C, 'C(1, −1)', 'sky'); dot(T, 'T(4, 3)', 'amber');
      return true;
    }
    if (id === 'threePts') {
      const A = [-2, 0], B = [0, 0], C = [2, 0];
      seg(A, B, 'sky', 3.4); seg(B, C, 'rose', 3.4);
      seg([-1, -3], [-1, 3], 'sky', 2.2, [5, 4]); seg([1, -3], [1, 3], 'rose', 2.2, [5, 4]);
      b.right(W([-1, 0]), W(A), W([-1, 1]), { color: 'sky', size: 10 });
      b.right(W([1, 0]), W(C), W([1, 1]), { color: 'rose', size: 10 });
      dot(A, 'A', 'sky'); dot(B, 'B', 'ink'); dot(C, 'C', 'rose');
      return true;
    }
    if (id === 'twoPos5') {
      const d = s.lceD, r1 = s.lceR1, r2 = s.lceR2, A = [0, 0], B = [d, 0];
      circle(A, r1, 'sky'); circle(B, r2, 'rose'); seg(A, B, 'amber', 2.4);
      dot(A, 'C₁', 'sky'); dot(B, 'C₂', 'rose');
      if (d > 0 && d <= r1 + r2 && d >= Math.abs(r1 - r2)) {
        const x = (d * d + r1 * r1 - r2 * r2) / (2 * d), y = Math.sqrt(Math.max(0, r1 * r1 - x * x));
        dot([x, y], y < 1e-8 ? 'T' : 'A', 'amber');
        if (y > 1e-8) { dot([x, -y], 'B', 'amber'); seg([x, y], [x, -y], 'amber', 2.4); }
      }
      return true;
    }
    const O = [0, 0], C = [4, 0], A = [0, 3], B = [0, -3];
    circle(O, 3, 'sky'); circle(C, 5, 'rose');
    seg(A, B, 'amber', 3.6); seg(O, C, 'muted', 2, [5, 4]); seg(C, A, 'rose', 3);
    b.right(W(O), W(A), W(C), { color: 'amber', size: 12 });
    b.ticks(W(A), W(O), { color: 'amber', count: 1 }); b.ticks(W(O), W(B), { color: 'amber', count: 1 });
    dot(O, 'O', 'sky'); dot(C, 'C', 'rose'); dot(A, 'A', 'amber'); dot(B, 'B', 'amber');
    return true;
  }
  global.APL_CE_LESSONS = {
    focus, drawConcept,
    nativeFocus: id => id === 'equilMaxMin' ? { x: [-288, 288], y: [-240, 240] } : null,
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing circle-equation scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lceTrace: 0, lceD: 7, lceR1: 4, lceR2: 2, lceAngle: 1.6, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
          for (const cue of chapter.cues) if (typeof cue.part === 'number') cue.part = String(cue.part);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lceQuestion: isConcept ? options.question : source.question(id),
          lceConcept: isConcept, lceExplore: isConcept, lceTarget: options.target || label,
          lceShowAnswer: false, lceMode: '', lceStage: -1, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lceTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lceShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '원의 중심·반지름과 도형의 조건을 식으로 연결해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 원리를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_CE_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
