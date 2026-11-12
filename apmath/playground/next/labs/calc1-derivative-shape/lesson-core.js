/* First source packets and native derivative diagrams use the common Player. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const call = (value, ...args) => typeof value === 'function' ? value(...args) : value;
  const frameState = s => ({ ...s, ...(s.lessonEntry ? s.ldsInitial : {}), playing: false });
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), set: { ...(options.stage == null ? {} : { ldsStage: options.stage }), ...options.set }, reveal: options.show || [] },
      { at: options.third ? 5 : 6, ...caption(second), set: { ...options.end }, reveal: options.after || [] }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third), reveal: options.thirdShow || [] });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  function label(value, s) {
    if (value == null) return value;
    const text = String(value), has = key => s.ldsLabels.includes(key);
    const gate = (key, fallback = '') => has(key) ? text : fallback;
    if (/^증감표 —/.test(text)) return '도함수의 부호를 확인해요';
    if (/^Δy/.test(text)) return gate('height', '높이 차 Δy');
    if (/^f′ 부호:/.test(text)) return gate('signs');
    if (/극값 없음|극값 0개|극값 아님/.test(text)) {
      if (!has('noExtrema')) return has('signs') ? text.replace(/\s*\(?극값 (없음|0개|아님)[^)]*\)?/g, '') : '';
    }
    if (s.ldsExplore) {
      if (!['always', 'rootcount'].includes(s.cur) && /^(극대|극소)/.test(text)) return has('extrema') ? text.replace(/\([^)]*\)/g, '').replace(/ \S*값.*$/, '') : '';
      if (/가 극소인 점/.test(text)) return has('roots') ? '도함수의 축 x = 1' : '';
      if (/^중근 x=/.test(text)) return has('signs') ? 'x = 1 : 부호가 바뀌지 않음' : gate('roots', '');
      if (/^x축과 만나지/.test(text)) return gate('roots');
      if (/^[αβ]=/.test(text)) return gate('roots');
      if (/^γ=/.test(text)) return gate('gamma', 'γ');
      if (/^x[₁₂₃]=/.test(text)) return gate('rootValues', text.slice(0, 2));
      if (/^g\(/.test(text)) return has('pin') ? text : '';
    }
    if (s.cur === 'quartic') {
      if (/→ 극소/.test(text)) return gate('minimumMap');
    }
    if (s.cur === 'roots' && !s.ldsExplore) {
      if (/세 실근:/.test(text)) return gate('range');
      if (/띠의 경계/.test(text)) return gate('boundary');
      if (/^y = [-−\d]/.test(text)) return gate('criticalValues', '극값 높이');
    }
    if (s.cur === 'difference') {
      if (/^꼭짓점 \(/.test(text)) return gate('lineValue', '꼭짓점');
      if (/^(y = k =|k =)/.test(text)) return gate('lineValue', 'y = k');
      if (/^접하는 점/.test(text)) return gate('roots', '접점');
    }
    if (s.cur === 'integral' && !s.ldsExplore) {
      if (/^a =/.test(text)) return gate('aValues');
      if (/^극대 /.test(text)) return has('extrema') ? '극대' : '';
      if (/g 극소/.test(text)) return gate('minimumCondition', has('roots') ? 'x = 2' : '');
    }
    if (s.cur === 'always') {
      if (/^h의 최솟값/.test(text)) return gate('minimum', 'h의 최솟값');
      if (/^a =/.test(text)) return gate('aValues', 'a');
    }
    if (s.cur === 'rootcount') {
      if (/^(극대 |극소 |극댓값 |극솟값 |f\(0\) =)/.test(text)) return gate('criticalValues');
      if (/^k =/.test(text)) return gate('lineValue', 'y = k');
    }
    if (/^x\s*=/.test(text)) {
      if (!has('roots')) return '';
      if (!has('extrema')) return text.replace(/\s*\(극[대소]\)/, '');
    }
    if (/^(극대|극소)$/.test(text)) return gate('extrema');
    if (/^[+−] ↗|^[+−] ↘|^[fg h]′\([+−]\)/.test(text) && !has('signs')) return '';
    return text;
  }
  const savedBoards = new WeakMap(), drawingKeys = new WeakMap();
  function restore(b) {
    if (!b || !savedBoards.has(b)) return;
    const saved = savedBoards.get(b);
    Object.assign(b, saved); savedBoards.delete(b); drawingKeys.delete(b);
  }
  function nativeFrame(b, s, render) {
    const keys = ['plot', 'point', 'poly', 'seg', 'vline', '_text'];
    const original = Object.fromEntries(keys.map(key => [key, b[key]]));
    const suppressed = options => s.cur === 'cubic' && !s.ldsExplore && (s.ldsCase === 'double' ? ['F', 'A', 'B', 'dy'].includes(options?.ref) : s.ldsCase === 'cross' && options?.ref === 'F2');
    const tracing = !s.lessonEntry && s.ldsTrace > 0 && s.ldsTrace < 1;
    let traced = false;
    for (const key of ['point', 'poly', 'seg']) b[key] = function (...args) {
      const options = args.at(-1);
      if (suppressed(options)) return;
      if (key === 'poly' && s.cur === 'roots' && options?.ref === 'band' && !s.ldsLabels.includes('range')) return;
      return original[key].apply(this, args);
    };
    b.vline = function (x, options) {
      if (s.cur === 'cubic' && !s.ldsExplore && (s.ldsCase === 'double' ? x !== 1 : s.ldsCase === 'cross' && x === 1)) return;
      return original.vline.call(this, x, options);
    };
    b._text = function (x, y, text, options, screen) {
      if (suppressed(options)) return;
      return original._text.call(this, x, y, label(text, s), options, screen);
    };
    b.plot = function (f, options = {}) {
      if (suppressed(options)) return;
      original.plot.call(this, f, options);
      if (!tracing || traced || this._bbox) return;
      const vb = this.viewBox(), lo = Math.max(vb.x0, options.from ?? -Infinity), hi = Math.min(vb.x1, options.to ?? Infinity);
      const points = Array.from({ length: 161 }, (_, i) => { const x = lo + (hi - lo) * i / 160; return { x, y: f(x) }; });
      const visible = points.filter(p => Number.isFinite(p.y) && p.y >= vb.y0 && p.y <= vb.y1);
      if (visible.length < 2) return;
      const from = visible[0].x, to = from + (visible.at(-1).x - from) * s.ldsTrace;
      original.plot.call(this, f, { ...options, from, to, color: 'violet', width: 4.2, dash: false, ref: 'lessonTrace' });
      original.point.call(this, [to, f(to)], { color: 'violet', r: 4.5, glow: false, ref: 'lessonTrace' });
      traced = true;
    };
    try { render(); } finally { Object.assign(b, original); }
    if (s.cur === 'cubic' && s.ldsCase === 'double' && !s.ldsExplore && s.ldsLabels.includes('signs')) {
      b.stext(12, 52, 'f′ : + → 0 → +', { color: 'violet', size: 12.5, align: 'left' });
    }
  }
  function levelOverlay(b, s, source) {
    if (s.ldsExplore || !s.ldsLine) return;
    const v = source.first(s.cur), rootsScene = s.cur === 'roots';
    const co = rootsScene ? [...v.co, 0] : v.co, y = rootsScene ? s.ldsY : s.kk;
    b.hline(y, { color: 'sky', width: 2.6, ref: 'lessonLevel' });
    source.roots12(co, y).list.forEach(x => b.point([x, y], { color: rootsScene ? 'amber' : x > 1e-7 ? 'green' : x < -1e-7 ? 'rose' : 'amber', r: 6, ref: 'lessonRoots' }));
    const text = rootsScene ? 'y = −C' : s.ldsLabels.includes('lineValue') ? 'k = ' + String(y).replace('-', '−') : 'y = k';
    b.text([b.viewBox().x1 - .2, y], text, { color: 'sky', align: 'right', dy: -12 });
  }
  global.APL_DERIVATIVE_SHAPE_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, name, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing derivative scene: ' + id);
        const first = chapters[0], nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        first.start = { ...nums, ldsTrace: 0, ldsY: -2, ...first.start, ...options.start };
        chapters.forEach((chapter, i) => { chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = { ...sets, ldsQuestion: options.concept ? options.question : source.question(id), ldsConcept: !!options.concept, ldsTarget: name,
          ldsExplore: false, ldsCase: 'both', ldsStage: 0, ldsLabels: [], ldsShowAnswer: false, ldsRuler: false, ldsLine: false, ...options.set, ...first.cues[0].set };
        first.cues.splice(1, 0, { at: .1, to: { ldsTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0]; final.set = { ...final.set, ldsShowAnswer: true };
        const revealed = new Set(first.cues[0].set.ldsLabels);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          for (const key of cue.reveal || []) revealed.add(key);
          delete cue.reveal;
          if (cue.say) cue.set = { ...cue.set, ldsLabels: [...revealed] };
        }
        (lessons[id] || (lessons[id] = [])).push({ label: name, title, tab: 'review', answer, answerText: answer,
          summary: options.summary || '도함수의 부호와 그래프의 위치를 식의 근거로 연결해요.',
          task: options.task || '직접 해 보기에서 경계의 양쪽을 비교해 보세요.', chapters });
      };
      const concept = (id, name, title, answer, question, chapters, options = {}) => add(id, name, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_DERIVATIVE_SHAPE_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(ch => ch.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing sibling reset: ' + id + '/' + key);
          first.cues[0].set.ldsInitial = copy({ ...first.start, ...first.cues[0].set, step: 0, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: sc.question, steps: sc.steps, view: sc.view, draw: sc.draw, enter: sc.enter, panes: sc.panes, reviewTop: sc.reviewTop };
        sc.question = (s, lab) => active(s) ? s.ldsQuestion || source.question(sc.id) : call(original.question, s, lab);
        sc.steps = (s, lab) => active(s) ? ['조건을 확인해요.', '부호와 위치를 살펴요.', '식을 세워 계산해요.', '구하는 값을 확인해요.'] : call(original.steps, s, lab);
        sc.view = (s, lab) => active(s) ? {} : call(original.view, s, lab);
        sc.reviewTop = (s, lab) => active(s) ? '' : call(original.reviewTop, s, lab);
        sc.enter = (s, lab) => { restore(lab?.board); original.enter?.(s, lab); };
        sc.panes = s => {
          if (!active(s)) return call(original.panes, s);
          const drawing = frameState(s);
          return drawing.ldsExplore ? call(source.explore[sc.id].panes, drawing) : null;
        };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const drawing = frameState(s); drawing.cur = sc.id; drawing.step = drawing.ldsStage;
          if (s.lessonEntry) { drawing.ldsTrace = 0; drawing.ldsShowAnswer = false; }
          if (!savedBoards.has(b)) {
            savedBoards.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY, _cxKey: b._cxKey });
            Object.assign(b, { zoom: 1, panX: 0, panY: 0 });
          }
          const key = sc.id + '/' + drawing.ldsExplore + '/' + drawing.ldsCase;
          if (drawingKeys.get(b) !== key) {
            drawingKeys.set(b, key); b._cxKey = null;
            if (drawing.ldsExplore) { const focus = call(source.explore[sc.id].focus, drawing); if (focus) b.setFocus(focus, true); }
          }
          const shownLab = Object.create(lab); shownLab.tab = drawing.ldsExplore ? 'explore' : 'review';
          nativeFrame(b, drawing, () => (drawing.ldsExplore ? source.explore[sc.id].draw : original.draw)(b, drawing, {}, shownLab));
          levelOverlay(b, drawing, source);
        };
      }
      return lessons;
    }
  };
})(window);
