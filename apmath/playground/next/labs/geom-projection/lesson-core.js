/* Native 3D projection scenes with isolated lesson camera/geometry states. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
  const rawKeys = ['yaw', 'pitch', 'th', 'board', 'sun', 'press', 'cn', 'mt', 'dir', 'lens', 'acd'];
  const keyOf = key => 'lpr' + key[0].toUpperCase() + key.slice(1);
  const tracked = values => Object.fromEntries(Object.entries(values || {}).map(([key, value]) => [rawKeys.includes(key) ? keyOf(key) : key, value]));
  const C = (title, first, second, options = {}) => {
    const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
    const cues = [
      { at: 0, ...caption(first), set: { ...(options.stage == null ? {} : { lprStage: options.stage }), ...tracked(options.set) }, reveal: options.show || [] },
      { at: options.third ? 5 : 6, ...caption(second), set: tracked(options.end), reveal: options.after || [] }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third), reveal: options.thirdShow || [] });
    if (options.move) cues.splice(1, 0, { at: .2, to: tracked(options.move), dur: 4 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: tracked(options.start) } : {}), cues };
  };
  function label(value, s) {
    if (value == null) return value;
    const text = String(value), has = key => s.lprLabels.includes(key);
    if (/^A′ · S′/.test(text)) return has('area') ? text : 'A′';
    if (/^장축 2a/.test(text)) return has('major') ? text : '장축';
    if (/^단축 2b/.test(text)) return has('minor') ? text : '단축';
    if (/^밑면 원 · 9π/.test(text)) return has('baseArea') ? text : '밑면 원';
    if (/^θ(?:[₁₂])?\s*[≈= ]/.test(text)) {
      if (has('angle') || ['mode1', 'mode2', 'mode4'].includes(s.cur)) return text;
      return text.match(/^θ[₁₂]?/)[0];
    }
    return text;
  }
  const savedBoards = new WeakMap();
  function restore(b) {
    if (!b || !savedBoards.has(b)) return;
    Object.assign(b, savedBoards.get(b)); savedBoards.delete(b);
  }
  function nativeFrame(b, s, render) {
    const original = b._text;
    b._text = function (x, y, text, options, screen) { return original.call(this, x, y, this._bbox ? text : label(text, s), options, screen); };
    try { render(); } finally { b._text = original; }
  }
  global.APL_PROJECTION_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, name, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing projection scene: ' + id);
        const first = chapters[0], initial = source.initial(id), nums = {}, sets = {};
        // Manual numeric controls and variant indices never become Player tracks.
        for (const key of rawKeys) (typeof initial[key] === 'number' ? nums : sets)[keyOf(key)] = initial[key];
        first.start = { ...nums, lprVariant: options.packet || 0, ...first.start, ...tracked(options.start) };
        const yaw = first.start.lprYaw; first.start.lprYaw = yaw - 4;
        chapters.forEach((chapter, i) => { chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = { ...sets, lprQuestion: options.concept ? options.question : source.question(id, options.packet || 0), lprConcept: !!options.concept, lprTarget: name,
          lprExplore: false, lprStage: 0, lprLabels: [], lprShowAnswer: false, ...tracked(options.set), ...first.cues[0].set };
        first.cues.splice(1, 0, { at: .1, to: { lprYaw: yaw }, dur: 4 });
        const final = chapters.at(-1).cues[0]; final.set = { ...final.set, lprShowAnswer: true };
        const revealed = new Set(first.cues[0].set.lprLabels);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          for (const key of cue.reveal || []) revealed.add(key);
          delete cue.reveal;
          if (cue.say) cue.set = { ...cue.set, lprLabels: [...revealed] };
        }
        (lessons[id] || (lessons[id] = [])).push({ label: name, title, tab: 'review', answer, answerText: answer,
          summary: '실제 공간의 수선과 넓이를 정사영한 그림에 연결해요.', task: '직접 해 보기에서 점이나 시점을 바꾸어 확인해 보세요.', chapters });
      };
      const concept = (id, name, title, answer, question, chapters, options = {}) => add(id, name, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_PROJECTION_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(ch => ch.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing sibling reset: ' + id + '/' + key);
          first.cues[0].set.lprInitial = copy({ ...first.start, ...first.cues[0].set, step: 0, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: sc.question, steps: sc.steps, view: sc.view, draw: sc.draw, enter: sc.enter, tick: sc.tick, reviewTop: sc.reviewTop };
        sc.question = (s, lab) => active(s) ? s.lprQuestion || source.question(sc.id) : call(original.question, s, lab);
        sc.steps = (s, lab) => active(s) ? ['조건과 입체를 확인해요.', '수선과 정사영을 찾아요.', '길이와 넓이를 계산해요.', '구하는 결과를 확인해요.'] : call(original.steps, s, lab);
        sc.view = (s, lab) => active(s) ? {} : call(original.view, s, lab);
        sc.reviewTop = (s, lab) => active(s) ? '' : call(original.reviewTop, s, lab);
        sc.tick = (s, dt, lab) => active(s) ? false : (original.tick?.(s, dt, lab) || false);
        sc.enter = (s, lab) => { restore(lab?.board); original.enter?.(s, lab); };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const snapshot = { ...s, ...(s.lessonEntry ? s.lprInitial : {}) }, drawing = { ...snapshot, cur: sc.id, step: snapshot.lprStage, part: null, playing: false };
          for (const key of rawKeys) drawing[key] = snapshot[keyOf(key)];
          drawing['v' + sc.id.slice(4)] = snapshot.lprVariant;
          if (s.lessonEntry) drawing.lprShowAnswer = false;
          if (!savedBoards.has(b)) { savedBoards.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY }); Object.assign(b, { zoom: 1, panX: 0, panY: 0 }); }
          const shownLab = Object.create(lab); Object.assign(shownLab, { tab: drawing.lprExplore ? 'explore' : 'review', s: drawing });
          nativeFrame(b, drawing, () => original.draw(b, drawing, {}, shownLab));
        };
      }
      return lessons;
    }
  };
})(window);
