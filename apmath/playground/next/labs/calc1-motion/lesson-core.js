/* Original motion scenes, connected to the shared automatic lesson player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_MO_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing motion scene: ' + id);
        const nums = {}, sets = {}, initial = source.initial(id);
        for (const [key, value] of Object.entries(initial)) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lmoTrace: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 4 : Math.min(index, 2);
          for (const cue of chapter.cues) if (typeof cue.part === 'number') cue.part = String(cue.part);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lmoQuestion: isConcept ? options.question : source.question(id),
          lmoConcept: isConcept, lmoExplore: !!options.explore, lmoTarget: options.target || label,
          lmoShowAnswer: false, lmoMode: '', lmoStage: -1,
          ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lmoTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { lmoStage: -1, ...final.set, lmoShowAnswer: true };
        // Keep the labels in the figure in the same order as the explanation.
        // A different target in this scene must not reveal its result early.
        const known = [];
        const remember = text => {
          for (const match of String(text || '').matchAll(/\$([^$]+)\$|<annotation[^>]*>([^<]+)<\/annotation>/g)) {
            const value = match[1] || match[2];
            if (!known.includes(value)) known.push(value);
          }
        };
        remember(first.cues[0].set.lmoQuestion);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          if (!cue.say) continue;
          remember(cue.say);
          cue.set = { ...cue.set, lmoKnownMath: known.slice() };
        }
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '위치·속도·가속도·이동거리의 관계를 실제 운동으로 확인해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 원리를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_MO_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      // A discrete control used by one lesson must have a defined reset in all
      // sibling lessons, including original arrays such as the four choices.
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0], initial = { ...source.initial(id), ...first.start };
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) {
            if (!Object.hasOwn(initial, key)) throw new Error('Missing motion lesson reset: ' + id + '/' + key);
            first.cues[0].set[key] = initial[key];
          }
          first.cues[0].set.lmoInitial = JSON.parse(JSON.stringify({
            ...first.start, ...first.cues[0].set, step: first.cues[0].step, part: first.cues[0].part
          }));
        }
      }
      return lessons;
    }
  };
})(window);
