/* First source packets and existing ellipse geometry use the common Player. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
  const frameState = s => ({ ...s, ...(s.lessonEntry ? s.lelInitial : {}), playing: false });
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), set: { ...(options.stage == null ? {} : { lelStage: options.stage }), ...options.set }, reveal: options.show || [] },
      { at: options.third ? 5 : 6, ...caption(second), set: { ...options.end }, reveal: options.after || [] }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third), reveal: options.thirdShow || [] });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  // Source diagrams remain responsible for points, segments, angles and regions.
  // Their numeric readouts are revealed only when the associated caption speaks.
  const rules = {
    '1-A': [['given', /^PF['′] =/], ['pf', /^PF =/], ['base', /^FF['′] =/]],
    '1-B': [['area', /^S =/], ['angle', /^\d+(?:\.\d+)?°$|^∠/], ['inradius', /^I \(r=/]],
    '1-C': [['sums', /^[PQ]F \+ [PQ]F['′] =/], ['perimeter', /^둘레 =/], ['similar', /^AA 닮음/]],
    '2-A': [['theta', /^θ/], ['phi', /^φ|^OP의 방향각/], ['circles', /^큰 원|^작은 원/]],
    '2-B': [['maximum', /^정삼각형의 넓이/], ['projection', /^cosγ|^기울어진 각/], ['chord', /^기울기의 곱/]],
    '2-C': [['given', /^[PQ] \(x =/], ['similar', /^OH × OT/], ['intercept', /^x절편 T/]],
    '3-A': [['reflected', /^F['′]F['″]|^대칭점 F/], ['midpoint', /^OH₁ =/], ['minimum', /^QF['′]\+QF=/]],
    '3-B': [['product', /^d₁ × d₂/]],
    '4-A': [['given', /^PF['′] =/], ['pf', /^PF =/], ['ratio', /^F['′]N : NF|^법선 F/], ['external', /^접선 F/], ['angle', /^∠F|^\d+(?:\.\d+)?°$/], ['normal', /^N\(/]],
    '4-B': [['pythagoras', /^OM² = h/], ['radius2', /^h₁² \+ h₂²|^OK₁²\+OK₂²|^OV=/]],
    q5: [['axis', /^BC =/], ['base', /^F₃F₂ =/]],
    q6: [['given', /^PF =/], ['far', /^PF′ =/], ['major', /^장축의 길이/]]
  };
  function label(value, s) {
    if (value == null) return value;
    const text = String(value), has = key => s.lelLabels.includes(key);
    for (const [key, pattern] of rules[s.cur] || []) if (pattern.test(text)) {
      if (has(key)) return text;
      return /^(?:[PQ]F['′]?|[dhabc][₁₂]?|OH₁)\s*=/.test(text) ? text.split('=')[0].trim() : '';
    }
    // Keep point names, while removing coordinate values and unspoken readouts.
    if (/^(?:점 )?[A-Z][₁₂₃′″'0-9]*\s*[≈(]/.test(text)) return text.replace(/^점 /, '').split(/[≈(]/)[0].trim();
    if (/^(?:x절편 )?T\(/.test(text)) return 'T';
    if (/[=≈≠≥≤]|\d+\.\d+|°/.test(text)) return '';
    if (/^[-−]?\d+(?:\/\d+)?$/.test(text)) return '';
    return text;
  }
  const savedBoards = new WeakMap(), drawingKeys = new WeakMap();
  function restore(b) {
    if (!b || !savedBoards.has(b)) return;
    Object.assign(b, savedBoards.get(b)); savedBoards.delete(b); drawingKeys.delete(b);
  }
  function nativeFrame(b, s, render) {
    const original = { path: b.path, point: b.point, _text: b._text }, ctx = b.ctx;
    const originalText = { fillText: ctx.fillText, strokeText: ctx.strokeText };
    const tracing = !s.lessonEntry && s.lelTrace > 0 && s.lelTrace < 1;
    let traced = false;
    // Auto-fit measures the complete native layout before the visible frame.
    // Preserve those bounds so a final formula cannot be clipped on reveal.
    b._text = function (x, y, text, options, screen) { return original._text.call(this, x, y, this._bbox ? text : label(text, s), options, screen); };
    for (const key of ['fillText', 'strokeText']) ctx[key] = function (text, ...rest) { return originalText[key].call(this, b._bbox ? text : label(text, s), ...rest); };
    b.path = function (points, options = {}) {
      original.path.call(this, points, options);
      if (!tracing || traced || this._bbox || points.length < 100) return;
      const n = Math.max(2, Math.floor((points.length - 1) * s.lelTrace));
      original.path.call(this, points.slice(0, n), { ...options, close: false, color: 'violet', width: 4.2, ref: 'lessonTrace' });
      original.point.call(this, points[n - 1], { color: 'violet', r: 4.5, ref: 'lessonTrace' });
      traced = true;
    };
    try { render(); } finally { Object.assign(b, original); Object.assign(ctx, originalText); }
  }
  global.APL_ELLIPSE_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, name, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing ellipse scene: ' + id);
        const first = chapters[0], nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        first.start = { ...nums, lelTrace: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, i) => { chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = { ...sets, lelQuestion: options.concept ? options.question : source.question(id), lelConcept: !!options.concept, lelTarget: name,
          lelExplore: false, lelStage: 0, lelLabels: [], lelShowAnswer: false, ...options.set, ...first.cues[0].set };
        first.cues.splice(1, 0, { at: .1, to: { lelTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0]; final.set = { ...final.set, lelShowAnswer: true };
        const revealed = new Set(first.cues[0].set.lelLabels);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          for (const key of cue.reveal || []) revealed.add(key);
          delete cue.reveal;
          if (cue.say) cue.set = { ...cue.set, lelLabels: [...revealed] };
        }
        (lessons[id] || (lessons[id] = [])).push({ label: name, title, tab: 'review', answer, answerText: answer,
          summary: '초점·접선·보조선의 관계를 식과 함께 확인해요.',
          task: '직접 해 보기에서 점과 보조선을 움직여 비교해 보세요.', chapters });
      };
      const concept = (id, name, title, answer, question, chapters, options = {}) => add(id, name, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_ELLIPSE_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(ch => ch.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing sibling reset: ' + id + '/' + key);
          first.cues[0].set.lelInitial = copy({ ...first.start, ...first.cues[0].set, step: 0, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: sc.question, steps: sc.steps, view: sc.view, draw: sc.draw, enter: sc.enter, tick: sc.tick, reviewTop: sc.reviewTop };
        sc.question = (s, lab) => active(s) ? s.lelQuestion || source.question(sc.id) : call(original.question, s, lab);
        sc.steps = (s, lab) => active(s) ? ['조건과 도형을 확인해요.', '정의와 보조선을 연결해요.', '관계식을 계산해요.', '구하는 결과를 확인해요.'] : call(original.steps, s, lab);
        sc.view = (s, lab) => active(s) ? {} : call(original.view, s, lab);
        sc.reviewTop = (s, lab) => active(s) ? '' : call(original.reviewTop, s, lab);
        sc.tick = (s, dt, lab) => active(s) ? false : (original.tick?.(s, dt, lab) || false);
        sc.enter = (s, lab) => { restore(lab?.board); original.enter?.(s, lab); };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const drawing = frameState(s); drawing.cur = sc.id; drawing.step = drawing.lelStage;
          if (s.lessonEntry) { drawing.lelTrace = 0; drawing.lelShowAnswer = false; }
          if (!savedBoards.has(b)) {
            savedBoards.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY });
            Object.assign(b, { zoom: 1, panX: 0, panY: 0 });
          }
          const key = sc.id + '/' + drawing.lelExplore;
          let cached = drawingKeys.get(b);
          if (!cached || cached.key !== key) {
            cached = { key, __cqKey: '', __ovk: '' }; drawingKeys.set(b, cached);
            if (drawing.lelExplore) {
              const focus = sc.id === '2-C' ? { x: [-drawing.a - 1.2, 2.5 * drawing.a + 1.2], y: [-drawing.a - 1.2, drawing.a + 1.2] } : call(source.explore[sc.id]?.focus || sc.focus, drawing);
              if (focus) b.setFocus(focus, true);
            }
          }
          const shownLab = Object.create(lab);
          Object.assign(shownLab, { tab: drawing.lelExplore ? 'explore' : 'review', s: drawing, __cqKey: cached.__cqKey, __ovk: cached.__ovk });
          const native = drawing.lelExplore && source.explore[sc.id] ? source.explore[sc.id] : original;
          nativeFrame(b, drawing, () => native.draw(b, drawing, {}, shownLab));
          cached.__cqKey = shownLab.__cqKey; cached.__ovk = shownLab.__ovk;
        };
      }
      return lessons;
    }
  };
})(window);
