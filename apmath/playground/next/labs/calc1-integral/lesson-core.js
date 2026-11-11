/* First source packets and native integral diagrams use the common Player. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
  const frameState = s => ({ ...s, ...(s.lessonEntry ? s.litInitial : {}), playing: false });
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), set: { ...(options.stage == null ? {} : { litStage: options.stage }), ...options.set }, reveal: options.show || [] },
      { at: options.third ? 5 : 6, ...caption(second), set: { ...options.end }, reveal: options.after || [] }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third), reveal: options.thirdShow || [] });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  function label(value, s) {
    if (value == null) return value;
    const text = String(value), has = key => s.litLabels.includes(key);
    const gate = (key, fallback = '') => has(key) ? text : fallback;
    if (s.cur === 'signed') {
      if (/^I = S/.test(text)) return has('integral') ? 'I = S₁ − S₂ = 0' : has('area') ? 'S = S₁ + S₂ = 8/3' : '';
      if (/^S[₁₂] =/.test(text)) return gate('parts', text.slice(0, 2));
    }
    if (s.cur === 'sixth') {
      if (/^S₀ =/.test(text)) return gate('total', 'S₀');
      if (/^\(3 − m\)³ =/.test(text)) return gate('cube');
      if (/^S₁ [≈=]/.test(text)) return gate('part', 'S₁');
    }
    if (s.cur === 'cubic') {
      if (/^β =/.test(text)) return gate('beta', 'β');
      if (/^S₁ = S₂ =/.test(text)) return gate('area', 'S₁ = S₂');
      if (/^S[₁₂] ≈/.test(text)) return gate('parts', text.slice(0, 2));
    }
    if (s.cur === 'diff' && /^S [≈=]/.test(text)) return gate('area', 'S');
    if (s.cur === 'inverse' && / = 21\/4$/.test(text)) return gate('sum');
    if (s.cur === 'areaab') {
      if (/^m =/.test(text) && !s.litExplore) return gate('slope', 'm');
      if (/^[AB] =/.test(text)) return gate('parts', text[0]);
      if (/^G=0,/.test(text)) return gate('zero', 'G=0');
    }
    if (s.cur === 'symint') {
      if (/^∫O = 0/.test(text)) return gate('odd');
      if (/^∫E =/.test(text)) return gate('sum', '∫E = 2∫₀ᵏE');
      if (/^정적분 2h|^\d+ ×/.test(text)) return gate('sum');
    }
    if (s.cur === 'riemann' && /^∫ =/.test(text)) return gate('integral');
    return text;
  }
  const savedBoards = new WeakMap(), drawingKeys = new WeakMap();
  function restore(b) {
    if (!b || !savedBoards.has(b)) return;
    const saved = savedBoards.get(b);
    Object.assign(b, saved); savedBoards.delete(b); drawingKeys.delete(b);
  }
  function nativeFrame(b, s, render) {
    const original = { plot: b.plot, point: b.point, _text: b._text };
    const tracing = !s.lessonEntry && s.litTrace > 0 && s.litTrace < 1;
    let traced = false;
    b._text = function (x, y, text, options, screen) { return original._text.call(this, x, y, label(text, s), options, screen); };
    b.plot = function (f, options = {}) {
      original.plot.call(this, f, options);
      if (!tracing || traced || this._bbox) return;
      const vb = this.viewBox(), lo = Math.max(vb.x0, options.from ?? -Infinity), hi = Math.min(vb.x1, options.to ?? Infinity);
      const visible = Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return { x, y: f(x) }; }).filter(p => Number.isFinite(p.y) && p.y >= vb.y0 && p.y <= vb.y1);
      if (visible.length < 2) return;
      const from = visible[0].x, to = from + (visible.at(-1).x - from) * s.litTrace;
      original.plot.call(this, f, { ...options, from, to, color: 'violet', width: 4.2, dash: false, ref: 'lessonTrace' });
      original.point.call(this, [to, f(to)], { color: 'violet', r: 4.5, glow: false, ref: 'lessonTrace' });
      traced = true;
    };
    try { render(); } finally { Object.assign(b, original); }
  }
  global.APL_INTEGRAL_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, name, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing integral scene: ' + id);
        const first = chapters[0], nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        first.start = { ...nums, litTrace: 0, litPacket: options.packet || 0, ...first.start, ...options.start };
        chapters.forEach((chapter, i) => { chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = { ...sets, litQuestion: options.concept ? options.question : source.question(id, options.packet || 0), litConcept: !!options.concept, litTarget: name,
          litExplore: false, litStage: 0, litLabels: [], litShowAnswer: false, ...options.set, ...first.cues[0].set };
        first.cues.splice(1, 0, { at: .1, to: { litTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0]; final.set = { ...final.set, litShowAnswer: true };
        const revealed = new Set(first.cues[0].set.litLabels);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          for (const key of cue.reveal || []) revealed.add(key);
          delete cue.reveal;
          if (cue.say) cue.set = { ...cue.set, litLabels: [...revealed] };
        }
        (lessons[id] || (lessons[id] = [])).push({ label: name, title, tab: 'review', answer, answerText: answer,
          summary: options.summary || '영역의 부호와 경계를 정적분의 식으로 연결해요.',
          task: options.task || '직접 해 보기에서 경계의 양쪽을 비교해 보세요.', chapters });
      };
      const concept = (id, name, title, answer, question, chapters, options = {}) => add(id, name, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_INTEGRAL_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(ch => ch.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing sibling reset: ' + id + '/' + key);
          first.cues[0].set.litInitial = copy({ ...first.start, ...first.cues[0].set, step: 0, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: sc.question, steps: sc.steps, view: sc.view, draw: sc.draw, enter: sc.enter, panes: sc.panes, reviewTop: sc.reviewTop };
        sc.question = (s, lab) => active(s) ? s.litQuestion || source.question(sc.id) : call(original.question, s, lab);
        sc.steps = (s, lab) => active(s) ? ['조건을 확인해요.', '부호와 적분 구간을 살펴요.', '식을 세워 계산해요.', '구하는 값을 확인해요.'] : call(original.steps, s, lab);
        sc.view = (s, lab) => active(s) ? {} : call(original.view, s, lab);
        sc.reviewTop = (s, lab) => active(s) ? '' : call(original.reviewTop, s, lab);
        sc.enter = (s, lab) => { restore(lab?.board); original.enter?.(s, lab); };
        sc.panes = s => {
          if (!active(s)) return call(original.panes, s);
          const drawing = frameState(s);
          return drawing.litExplore ? call(source.explore[sc.id].panes, drawing) : null;
        };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const drawing = frameState(s); drawing.cur = sc.id; drawing.step = drawing.litStage;
          if (s.lessonEntry) { drawing.litTrace = 0; drawing.litShowAnswer = false; }
          if (!savedBoards.has(b)) {
            savedBoards.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY, _ouKey: b._ouKey });
            Object.assign(b, { zoom: 1, panX: 0, panY: 0 });
          }
          const key = sc.id + '/' + drawing.litExplore + '/' + drawing.litPacket;
          if (drawingKeys.get(b) !== key) {
            drawingKeys.set(b, key); b._ouKey = null;
            if (drawing.litExplore) { const focus = call(source.explore[sc.id].focus, drawing); if (focus) b.setFocus(focus, true); }
          }
          const shownLab = Object.create(lab);
          shownLab.tab = drawing.litExplore ? 'explore' : 'review'; shownLab.s = drawing;
          // Native view functions calculate the ranges for the existing moving
          // area/rotation diagrams. Their answer cards are intentionally unused.
          drawing.dragging = false;
          const native = drawing.litExplore ? source.explore[sc.id] : original;
          call(native.view, drawing, shownLab);
          source.native.hook(b); b._ouBoxes = [];
          nativeFrame(b, drawing, () => native.draw(b, drawing, {}, shownLab));
        };
      }
      return lessons;
    }
  };
})(window);
