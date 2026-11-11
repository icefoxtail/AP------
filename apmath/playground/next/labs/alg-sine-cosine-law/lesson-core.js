/* Shared authoring helpers for this lab. Playback stays in the common player kit. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_SCL_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing sine/cosine law scene: ' + id);
        const concept = !!options.concept, first = chapters[0];
        first.start = { t: source.defaultT(id), lsTrace: 0, ...options.start };
        chapters.forEach((ch, i) => { ch.cues[0].step = i === 0 ? 0 : i === chapters.length - 1 ? 3 : Math.min(i, 2); });
        first.cues[0].set = {
          lsQuestion: concept ? options.question : source.question(id),
          lsConcept: concept, lsExplore: concept, lsTarget: options.target || '', lsShowAnswer: false
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lsTrace: 1 }, dur: 4 });
        chapters[chapters.length - 1].cues[0].set = { lsShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '같은 각과 대응하는 길이에서 식을 세워요.',
          task: options.task || '직접 해 보기에서 도형을 바꾸고 같은 관계를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_SCL_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
