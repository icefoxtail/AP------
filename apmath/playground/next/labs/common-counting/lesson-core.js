/* Count from the original question or its existing exploration, using the shared Player. */
(function (global) {
  'use strict';
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), ...(options.step == null ? {} : { step: options.step }), set: { ...(options.stage == null ? {} : { lccStage: options.stage }), ...options.set } },
      { at: options.third ? 5 : 6, ...caption(second), ...(options.end ? { set: options.end } : {}) }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third) });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4, snap: options.snap || 1 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  global.APL_COUNTING_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing counting scene: ' + id);
        const nums = {}, sets = {}, initial = source.initial(id);
        for (const [key, value] of Object.entries(initial)) (typeof value === 'number' ? nums : sets)[key] = value;
        const first = chapters[0];
        first.start = { ...nums, lccTrace: 0, ...options.start };
        chapters.forEach((chapter, index) => {
          const cue = chapter.cues[0];
          if (cue.step == null) cue.step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
          if (cue.set.lccStage == null) cue.set.lccStage = index;
        });
        first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lccQuestion: options.concept ? options.question : source.question(id),
          lccConcept: !!options.concept, lccExplore: !!options.concept,
          lccTarget: label, lccMode: '', lccStage: 0, lccRows: 0, lccSlots: 0, lccBoxWays: false,
          lccShowAnswer: false, ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: .1, to: { lccTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0];
        final.set = { ...final.set, lccShowAnswer: true };
        const known = new Set();
        const remember = text => {
          for (const match of String(text || '').replace(/<[^>]*>/g, '').matchAll(/-?\d+(?:\.\d+)?/g)) known.add(String(Number(match[0])));
        };
        remember(first.cues[0].set.lccQuestion);
        for (const chapter of chapters) for (const cue of chapter.cues) if (cue.say) {
          remember(cue.say); cue.set = { ...cue.set, lccKnownNumbers: [...known] };
        }
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: answer,
          summary: options.summary || '서로 겹치지 않게 나누고, 선택 순서에 따라 세어요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 방법으로 세어 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_COUNTING_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0], reset = { ...source.initial(id), ...first.start };
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) {
            if (!Object.hasOwn(reset, key)) throw new Error('Missing counting reset: ' + id + '/' + key);
            first.cues[0].set[key] = reset[key];
          }
          // Entry can be drawn while the previous final state is still held.
          // Keep a separate first-frame snapshot; drawing must not overwrite
          // the manual problem, arrays, or the state held by the Player.
          first.cues[0].set.lccInitial = JSON.parse(JSON.stringify({
            ...first.start, ...first.cues[0].set, step: first.cues[0].step, part: first.cues[0].part
          }));
        }
      }
      return lessons;
    }
  };
})(window);
