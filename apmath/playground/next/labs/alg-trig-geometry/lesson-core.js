/* Original geometry, first source packets and staged captions share the common Player. */
(function (global) {
  'use strict';
  const active = s => !!(s && (s.lessonOn || s.lessonEntry));
  const copy = value => JSON.parse(JSON.stringify(value));
  const caption = say => ({ say, ...(say.includes('$') ? { pin: true } : {}) });
  const C = (title, first, second, options = {}) => {
    const cues = [
      { at: 0, ...caption(first), set: { ...(options.stage == null ? {} : { ltgStage: options.stage }), ...options.set }, reveal: options.show || [] },
      { at: options.third ? 5 : 6, ...caption(second), set: { ...options.end }, reveal: options.after || [] }
    ];
    if (options.third) cues.push({ at: 10, ...caption(options.third), reveal: options.thirdShow || [] });
    if (options.move) cues.splice(1, 0, { at: .2, to: options.move, dur: 4 });
    return { title, length: options.third ? 15 : 12, ...(options.start ? { start: options.start } : {}), cues };
  };
  function label(text, s) {
    if (!active(s) || text == null) return text;
    text = String(text);
    const has = key => (s.ltgLabels || []).includes(key);
    const gate = (key, fallback) => has(key) ? text : fallback;
    switch (s.cur) {
      case 'bas-1':
        if (text === 'θ' && has('theta')) return 'θ = 2 rad';
        if (/^r\s*[≈=]/.test(text)) return gate('r', 'r');
        if (/^l\s*[≈=]/.test(text)) return has('l') ? (/2r/.test(text) ? 'l = 10' : text) : 'l = 20 − 2r';
        if (/^S\(/.test(text)) return gate('S', 'S(r)');
        if (/^최댓값/.test(text)) return has('r') && has('S') ? text : has('S') ? '최댓값 S = 25' : has('r') ? 'r = 5' : '꼭짓점';
        break;
      case 'bas-2':
        if (/^P\(/.test(text)) return gate('P', 'P(θ)');
        if (/^Q\(/.test(text)) return gate('Q', 'Q(π/2 + θ)');
        if (/^R\(/.test(text)) return gate('R', 'R(π/2 − θ)');
        break;
      case 'bas-3':
        if (/^대칭축 S[₁₂]/.test(text)) return gate('peaks', '봉우리 대칭축');
        if (/^가운데 대칭축/.test(text)) return gate('axis', '가운데 대칭축');
        if (/^안쪽 두 교점/.test(text)) return gate('pairs', '안쪽 두 교점');
        if (/^바깥쪽 두 교점/.test(text)) return gate('pairs', '바깥쪽 두 교점');
        if (/^x_\d/.test(text)) return text.match(/^x_\d/)[0];
        break;
      case 'bas-4':
        if (/^작은 봉우리/.test(text)) return gate('small', '작은 봉우리');
        if (/^큰 봉우리/.test(text)) return gate('large', '큰 봉우리');
        if (/^y\s*≈/.test(text)) return gate('level', 'y = t');
        break;
      case 'bas-5':
        if (/^x[₁₂]/.test(text)) return gate('roots', text.slice(0, 2));
        if (/^대칭축 π/.test(text)) return gate('pair', '대칭인 두 근');
        if (/^x₃/.test(text)) return gate('tangent', 'x₃');
        if (/^y = t/.test(text)) return s.ltgMode === 'compare' ? text : '비교용 y = t';
        break;
      case 'bas-6':
        if (/^지름 2R/.test(text)) return gate('diameter', '지름 2R');
        if (/^A'C =/.test(text)) return gate('leg', "A'C");
        if (/^현 BC/.test(text)) return gate('chord', '현 BC = a');
        break;
      case 'bas-7':
        if (/^공통 대각선/.test(text)) return gate('diagonal', '공통 대각선 AC');
        break;
      case 'bas-8':
        if (/^BD [≈=]/.test(text)) return gate('parts', 'BD');
        if (/^DC [≈=]/.test(text)) return gate('parts', 'DC');
        if (text === '60°') return gate('angles', '');
        if (/^AD\s*[≈=]/.test(text)) return gate('AD', 'AD = x');
        break;
      case 'adv-1':
        if (/^P\(θ =/.test(text)) return gate('angle', 'P(θ)');
        if (/\((성립|일직선 제외!)\)/.test(text) && !has('eligible')) return text.replace(/\s*\(.*\)/, '');
        break;
      case 'adv-2':
        if (/^∠POQ/.test(text)) return gate('center', 'φ');
        if (/^OM /.test(text)) return has('heightFormula') ? 'OM = \\frac{k}{√2}' : has('height') ? 'OM = √3/2' : 'OM';
        if (/^M\(/.test(text)) return gate('mid', 'M');
        break;
      case 'adv-3':
        if (/^대칭축 x = 3/.test(text)) return gate('axis', '봉우리 대칭축');
        if (/^[AB] ≈/.test(text)) {
          if (has('top')) return text;
          return has('topX') ? text.replace(/ ≈ \(([^,]+), [^)]+\)/, '($1, k)') : text[0];
        }
        if (/^[CD] ≈/.test(text)) return gate('bottom', text[0]);
        if (/^(윗변|아랫변)/.test(text)) return gate('width', text.startsWith('윗변') ? '윗변 AB' : '아랫변 CD');
        if (/^점대칭 중심/.test(text)) return gate('mid', '점대칭 중심 M');
        break;
      case 'adv-4':
        if (text.includes('|b|=2')) return has('params') ? text : text.replace('|b|=2', '|b|');
        if (/^작은 봉우리/.test(text)) return gate('params', '작은 봉우리');
        if (/^큰 봉우리/.test(text)) return gate('maximum', '큰 봉우리');
        if (/^y\s*≈/.test(text)) return gate('level', 'y = t');
        break;
      case 'adv-5':
        if (text.includes('고정근')) return gate('roots', '고정근');
        if (/^k = -?1 접점/.test(text)) return gate('extrema', '접점');
        if (/^y = k/.test(text)) return gate('level', 'y = k');
        break;
      case 'adv-6':
        if (/^고정 현 BC/.test(text)) return gate('base', '고정 현 BC');
        if (/^∠A =/.test(text)) return gate('angleA', '∠A');
        if (/높이 h =/.test(text)) return gate('height', '높이 h');
        if (/^A \(AB\+AC/.test(text)) return gate('L', 'A');
        break;
      case 'adv-7':
        if (/^DA [≈=]/.test(text)) return gate('DA', 'DA');
        if (/^대각선 AC/.test(text)) return gate('diagonal', '대각선 AC');
        if (/^O \(R/.test(text)) return gate('radius', 'O');
        if (/^D\(2π/.test(text)) return gate('angleD', 'D');
        if (text === '2π/3') return gate('angleD', '∠D');
        if (text.includes('조건 위치 (CD=2, DA=3)')) return gate('DA', '조건 위치 (CD=2)');
        break;
      case 'adv-8':
        if (/^(BD|CD) =/.test(text)) return gate('parts', text.slice(0, 2));
        if (/^BH =/.test(text)) return gate('foot', 'BH');
        if (/^AD/.test(text)) return gate('AD', 'AD = x');
        break;
    }
    return text;
  }
  const savedBoards = new WeakMap();
  function restore(board) {
    if (!board || !savedBoards.has(board)) return;
    Object.assign(board, savedBoards.get(board)); savedBoards.delete(board);
  }
  function nativeFrame(b, s, render) {
    const original = { path: b.path, arc: b.arc, circle: b.circle, _text: b._text };
    const paths = [], tracing = !s.lessonEntry && s.ltgTrace > 0 && s.ltgTrace < 1;
    const pt = p => ({ x: p.x ?? p[0], y: p.y ?? p[1] });
    if (tracing) {
      b.path = function (ps, options) { if (ps.length > 1) paths.push(ps.map(pt)); return original.path.call(this, ps, options); };
      b.arc = function (p, r, from, to, options = {}) {
        const center = pt(p); let span = to - from;
        if (options.ccw) { while (span > 0) span -= 2 * Math.PI; } else { while (span < 0) span += 2 * Math.PI; }
        paths.push(Array.from({ length: 81 }, (_, i) => ({ x: center.x + r * Math.cos(from + span * i / 80), y: center.y + r * Math.sin(from + span * i / 80) })));
        return original.arc.call(this, p, r, from, to, options);
      };
      b.circle = function (p, r, options) { const center = pt(p); paths.push(Array.from({ length: 81 }, (_, i) => ({ x: center.x + r * Math.cos(i * Math.PI / 40), y: center.y + r * Math.sin(i * Math.PI / 40) }))); return original.circle.call(this, p, r, options); };
    }
    b._text = function (x, y, text, options, screen) { return original._text.call(this, x, y, label(text, s), options, screen); };
    try { render(); } finally { Object.assign(b, original); }
    if (tracing && paths.length) {
      // Follow an actual source curve or outline; the original mathematical
      // conditions stay fixed while the first caption points out the figure.
      paths.sort((a, z) => z.length - a.length);
      const path = paths[0], end = (path.length - 1) * s.ltgTrace, i = Math.floor(end), q = end - i;
      const a = path[i], z = path[Math.min(i + 1, path.length - 1)], tip = { x: a.x + (z.x - a.x) * q, y: a.y + (z.y - a.y) * q };
      b.path([...path.slice(0, i + 1), tip], { color: 'violet', width: 4.2 });
      b.point(tip, { color: 'violet', r: 4.5, glow: false });
    }
  }
  global.APL_TRIG_GEOMETRY_LESSONS = {
    install(scenes, source) {
      const lessons = {};
      const add = (id, name, title, answer, chapters, options = {}) => {
        if (!scenes.some(sc => sc.id === id)) throw new Error('Missing trig geometry scene: ' + id);
        const first = chapters[0], nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        first.start = { ...nums, ltgTrace: 0, ...first.start, ...options.start };
        chapters.forEach((chapter, i) => { chapter.cues[0].step = i === chapters.length - 1 ? 4 : Math.min(i, 3); });
        first.cues[0].part = null;
        first.cues[0].set = { ...sets, ltgQuestion: options.concept ? options.question : source.question(id), ltgConcept: !!options.concept, ltgTarget: name, ltgMode: '', ltgStage: 0, ltgLabels: [], ltgShowAnswer: false, ...options.set, ...first.cues[0].set };
        first.cues.splice(1, 0, { at: .1, to: { ltgTrace: 1 }, dur: 4 });
        const final = chapters.at(-1).cues[0]; final.set = { ...final.set, ltgShowAnswer: true };
        const revealed = new Set(first.cues[0].set.ltgLabels);
        for (const chapter of chapters) for (const cue of chapter.cues) {
          for (const key of cue.reveal || []) revealed.add(key);
          delete cue.reveal;
          if (cue.say) cue.set = { ...cue.set, ltgLabels: [...revealed] };
        }
        (lessons[id] || (lessons[id] = [])).push({ label: name, title, tab: 'review', answer, answerText: answer,
          summary: options.summary || '조건에 맞는 보조선과 대칭을 식의 근거로 사용해요.',
          task: options.task || '직접 해 보기에서 조건 위치와 다른 위치를 비교해 보세요.', chapters });
      };
      const concept = (id, name, title, answer, question, chapters, options = {}) => add(id, name, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_TRIG_GEOMETRY_LESSON_BUILDERS || []) build({ add, concept, C, source });
      for (const [id, list] of Object.entries(lessons)) {
        const keys = new Set(list.flatMap(lesson => lesson.chapters.flatMap(chapter => chapter.cues.flatMap(cue => Object.keys(cue.set || {})))));
        for (const lesson of list) {
          const first = lesson.chapters[0];
          for (const key of keys) if (!Object.hasOwn(first.cues[0].set, key)) throw new Error('Missing trig geometry sibling reset: ' + id + '/' + key);
          first.cues[0].set.ltgInitial = copy({ ...first.start, ...first.cues[0].set, step: 0, part: null });
        }
      }
      for (const sc of scenes) {
        const original = { question: Object.getOwnPropertyDescriptor(sc, 'question'), steps: sc.steps, view: sc.view, draw: sc.draw, enter: sc.enter };
        Object.defineProperty(sc, 'question', { configurable: true, value: (s, lab) => active(s) ? s.ltgQuestion || source.question(sc.id) : original.question.get ? original.question.get.call(sc) : original.question.value });
        sc.steps = (s, lab) => active(s) ? ['조건을 확인해요.', '도형에서 전략을 찾아요.', '식을 세워 계산해요.', '구하는 값을 확인해요.'] : original.steps(s, lab);
        sc.view = (s, lab) => active(s) ? {} : original.view(s, lab);
        sc.enter = (s, lab) => { restore(lab && lab.board); original.enter(s, lab); };
        sc.draw = (b, s, view, lab) => {
          if (!active(s)) { restore(b); return original.draw(b, s, view, lab); }
          const drawing = { ...s, ...(s.lessonEntry ? s.ltgInitial : {}), playing: false };
          if (s.lessonEntry) { drawing.ltgTrace = 0; drawing.ltgShowAnswer = false; }
          if (!savedBoards.has(b)) { savedBoards.set(b, { focus: copy(b.focus), zoom: b.zoom, panX: b.panX, panY: b.panY }); Object.assign(b, { zoom: 1, panX: 0, panY: 0 }); }
          const shownLab = Object.create(lab); shownLab.tab = 'review';
          nativeFrame(b, drawing, () => original.draw(b, drawing, {}, shownLab));
        };
      }
      return lessons;
    }
  };
})(window);
