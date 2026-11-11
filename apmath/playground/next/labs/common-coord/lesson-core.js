/* Reuse the original coordinate figures and the shared automatic player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_CC_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing coordinate scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lccTrace: 0, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lccQuestion: isConcept ? options.question : source.question(id),
          lccConcept: isConcept, lccExplore: isConcept, lccTarget: options.target || '',
          lccShowAnswer: false, lccMode: '', lccStage: -1, lccMovePoint: false, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lccTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lccShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '좌표와 도형의 관계를 식으로 연결해요.',
          task: options.task || '직접 해 보기에서 점과 비율을 바꾸어 같은 관계를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_CC_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
