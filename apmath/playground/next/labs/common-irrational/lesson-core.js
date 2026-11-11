/* Radical-function lessons use the common player and the original scene state. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_IRR_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing irrational scene: ' + id);
        const initial = source.initial(id), nums = {}, sets = {};
        for (const [key, value] of Object.entries(initial)) (typeof value === 'number' ? nums : sets)[key] = value;
        const first = chapters[0], isConcept = !!options.concept;
        first.start = { ...nums, lirTrace: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 4 : Math.min(index, 3);
        });
        first.cues[0].set = {
          ...sets, lirQuestion: isConcept ? options.question : source.question(id),
          lirConcept: isConcept, lirExplore: isConcept, lirTarget: options.target || label,
          lirShowAnswer: false, lirIntersections: false,
          lirMirror: false, lirInverse: false, lirPair: false, lirCross: 0,
          ...options.set, ...first.cues[0].set
        };
        first.cues[0].part = null;
        first.cues.splice(1, 0, { at: 0.1, to: { lirTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lirShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '시작점과 그래프의 변화를 식의 조건과 연결해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸고 경계의 모습을 비교해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_IRR_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0], initial = { ...source.initial(id), ...first.start };
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) {
            if (!Object.hasOwn(initial, key)) throw new Error('Missing irrational lesson reset: ' + id + '/' + key);
            first.cues[0].set[key] = initial[key];
          }
          // The entry figure must also ignore a stale final state after replay.
          const drawing = { ...first.start, ...first.cues[0].set };
          delete drawing.lirQuestion;
          first.cues[0].set.lirInitial = drawing;
        }
      }
      return lessons;
    }
  };
})(window);
