/* Original space scenes, connected to the shared automatic lesson player. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };
  global.APL_GS_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing space scene: ' + id);
        const nums = {}, sets = {}, initial = source.initial(id);
        for (const [key, value] of Object.entries(initial)) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lgsOrbit: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
          for (const cue of chapter.cues) if (typeof cue.part === 'number') cue.part = String(cue.part);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lgsQuestion: isConcept ? options.question : source.question(id),
          lgsConcept: isConcept, lgsExplore: !!options.explore, lgsTarget: options.target || label,
          lgsShowAnswer: false, lgsMode: '', lgsStage: -1,
          ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lgsOrbit: 8 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { lgsStage: -1, ...final.set, lgsShowAnswer: true };
        // Keep the labels in the figure in the same order as the explanation.
        // A different target in this scene must not reveal its result early.
        const known = [];
        const remember = text => {
          for (const match of String(text || '').matchAll(/\$([^$]+)\$|<annotation[^>]*>([^<]+)<\/annotation>/g)) {
            const value = match[1] || match[2];
            if (!known.includes(value)) known.push(value);
          }
        };
        remember(first.cues[0].set.lgsQuestion);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          if (!cue.say) continue;
          remember(cue.say);
          cue.set = { ...cue.set, lgsKnownMath: known.slice() };
        }
        // The shared Player restores tab/step, so native controls use separate
        // playback tracks and are applied only to a drawing snapshot.
        const trackKey=key=>Object.hasOwn(initial,key)?(typeof initial[key]==='number'?'lgsN_':'lgsS_')+key:key;
        const mapped=obj=>Object.fromEntries(Object.entries(obj||{}).map(([key,value])=>[trackKey(key),value]));
        for(const chapter of chapters){
          if(chapter.start)chapter.start=mapped(chapter.start);
          for(const cue of chapter.cues){if(cue.to)cue.to=mapped(cue.to);if(cue.set)cue.set=mapped(cue.set);}
        }
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '공간의 수직·각·길이 관계를 원본 입체로 확인해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 원리를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_GS_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      // A discrete control used by one lesson must have a defined reset in all
      // sibling lessons, including original arrays such as the four choices.
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0], initial = { ...source.initial(id), ...first.start };
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) {
            if (!Object.hasOwn(initial, key)) throw new Error('Missing space lesson reset: ' + id + '/' + key);
            first.cues[0].set[key] = initial[key];
          }
          first.cues[0].set.lgsInitial = JSON.parse(JSON.stringify({
            ...first.start, ...first.cues[0].set, step: first.cues[0].step, part: first.cues[0].part
          }));
        }
      }
      return lessons;
    }
  };
})(window);
