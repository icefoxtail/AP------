/* Reuse the original transformation figures and the shared automatic player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  function focus(id, mode) {
    if (id === 'shortest' && mode === 'opposite') return { x: [-2, 9], y: [-4, 4] };
    if (id === 'compose' && mode === 'shift-first') return { x: [-8.5, 8.5], y: [-9, 8] };
    if (id === 'reflect' && mode === 'parabola') return { x: [-2.5, 5.5], y: [-2.5, 5.5] };
    return null;
  }
  function drawConcept(b, s, id) {
    if (!focus(id, s.lctMode)) return false;
    if (id === 'compose') {
      b.plot(x => x * x, { color: 'ink', width: 2.4, dash: true });
      b.plot(x => (x - s.ca) ** 2 + s.cb, { color: 'amber', width: 3.2, ref: 'translated' });
      const O = { x: 0, y: 0 }, K = { x: s.ca, y: 0 }, V = { x: s.ca, y: s.cb };
      if (s.ca) b.seg(O, K, { color: 'sky', width: 2.2 });
      if (s.cb) b.seg(K, V, { color: 'rose', width: 2.2 });
      b.point(V, { color: 'amber', r: 5.5, label: 'V', dx: 0, dy: -16 });
      return true;
    }
    if (id === 'reflect') {
      b.line({ x: 0, y: 0 }, 1, { color: 'green', width: 2.2, dash: true });
      b.plot(x => x * x, { from: -2.3, to: 2.3, color: 'ink', width: 3.4, ref: 'original' });
      b.path(Array.from({ length: 193 }, (_, i) => { const y = -2.3 + 4.6 * i / 192; return { x: y * y, y }; }), { color: 'amber', width: 3.2, ref: 'image' });
      const u = s.lctU, P = { x: u, y: u * u }, Q = { x: u * u, y: u };
      b.seg(P, Q, { color: 'green', width: 1.6, dash: true });
      b.point(P, { color: 'ink', r: 5.5, label: 'P', dx: -12, dy: -15 });
      b.point(Q, { color: 'amber', r: 5.5, label: 'P′', dx: 14, dy: 15 });
      return true;
    }
    const A = { x: 2, y: 1 }, B = { x: 6, y: -2 }, P = { x: s.pp, y: 0 };
    b.hline(0, { color: 'muted', width: 1.6 });
    b.seg(A, B, { color: 'green', width: 3, ref: 'direct' });
    b.seg(A, P, { color: 'sky', width: 3.2, ref: 'ap' });
    b.seg(P, B, { color: 'rose', width: 3.2, ref: 'pb' });
    b.point(A, { color: 'ink', r: 5.5, label: 'A(2, 1)', dx: -12, dy: -16 });
    b.point(B, { color: 'ink', r: 5.5, label: 'B(6, −2)', dx: 12, dy: 18 });
    b.point(P, { color: 'amber', r: 6, label: 'P', dx: 0, dy: 18 });
    return true;
  }
  global.APL_CT_LESSONS = {
    focus, drawConcept,
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing transformation scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lctTrace: 0, lctU: 0.75, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lctQuestion: isConcept ? options.question : source.question(id),
          lctConcept: isConcept, lctExplore: isConcept, lctTarget: options.target || '',
          lctShowAnswer: false, lctMode: '', lctStage: -1, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lctTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lctShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '도형의 이동과 좌표·방정식을 연결해요.',
          task: options.task || '직접 해 보기에서 점과 비율을 바꾸어 같은 관계를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_CT_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
