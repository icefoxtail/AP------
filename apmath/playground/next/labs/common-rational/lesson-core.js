/* Lab-specific authoring helpers; playback and formula pins use the common kit. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_RAT_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing rational scene: ' + id);
        const initial = source.initial(id), nums = {}, sets = {};
        for (const [key, value] of Object.entries(initial)) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lrTrace: 0, lrCols: 0, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 4 : Math.min(index, 3);
        });
        first.cues[0].set = {
          ...sets, lrQuestion: isConcept ? options.question : source.question(id),
          lrConcept: isConcept, lrExplore: isConcept, lrTarget: options.target || '',
          lrShowAnswer: false, lrLattice: false, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lrTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lrShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '식과 그래프의 같은 조건을 연결해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸고 그래프를 비교해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_RAT_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
