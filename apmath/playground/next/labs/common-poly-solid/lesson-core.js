/* Keep the existing square and solid renderers; reuse the common player kit. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_PS_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing polynomial solid scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lpsTrace: 0, ...(id === 'sq' ? { gap1: 0 } : {}), ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
        });
        first.cues[0].set = {
          ...sets, lpsQuestion: isConcept ? options.question : source.question(id),
          lpsConcept: isConcept, lpsExplore: isConcept, lpsTarget: options.target || '',
          lpsShowAnswer: false, lpsShowFaces: false, lpsCutMode: '', lpsDifference: false, ...options.set, ...first.cues[0].set
        };
        const motion = id === 'sq'
          ? { lpsTrace: 1, ...(!isConcept || first.cues[0].set.mode1 === 'plus' ? { gap1: 0.65 } : {}) }
          : { yaw: first.start.yaw + 12 };
        first.cues.splice(1, 0, { at: 0.1, to: motion, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lpsShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '넓이와 부피의 조각을 다항식의 항에 연결해요.',
          task: options.task || '직접 해 보기에서 조각과 시점을 바꾸어 같은 관계를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_PS_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
