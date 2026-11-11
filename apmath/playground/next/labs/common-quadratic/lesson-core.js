/* One-click explanations reuse the original exploration and first-source models. */
(function (global) {
  'use strict';
  const P = say => ({ say, pin: true });
  const caption = value => typeof value === 'string' ? { say: value } : value;
  const C = (title, first, second, move) => {
    const cues = [{ at: 0, ...caption(first) }, { at: 6, ...caption(second) }];
    if (move) cues.splice(1, 0, { at: 0.2, to: move, dur: 4 });
    return { title, length: 12, cues };
  };

  // These comparison cases are already described in the native rules/notes.
  // They are selected only during a concept lesson; manual exploration is unchanged.
  function drawConcept(b, s, id) {
    const mode = s.lqcMode || '';
    const supported =
      (id === 'sepBothGreater' && mode === 'left') ||
      (id === 'sepInsideInterval' && mode === 'closed') ||
      (id === 'sepOneRootInInterval' && ['endpoint', 'double'].includes(mode)) ||
      (id === 'rootSignZero' && ['positive', 'negative', 'opposite'].includes(mode)) ||
      (id === 'alwaysPositiveAll' && ['positive', 'nonnegative', 'negative', 'nonpositive'].includes(mode)) ||
      (id === 'restrictedIneqMinMax' && ['minimum', 'maximum'].includes(mode)) ||
      (id === 'specialSol4Cases' && ['gt', 'ge', 'lt', 'le'].includes(mode)) ||
      id === 'integerCountBoundary' ||
      (id === 'compIneqTransform' && ['inside', 'outside'].includes(mode)) ||
      (id === 'trapMaxLtMin' && ['same', 'independent'].includes(mode)) ||
      (id === 'trapIrrationalCoeffs' && mode === 'conjugate') ||
      (id === 'symmetryRootSum' && mode === 'four-roots') ||
      (id === 'absXSymmetry' && mode === 'scan');
    if (!supported) return false;
    if (s.grid) b.grid({ step: 1 });
    b.axes({ tickStep: b.k < 32 ? 2 : 1 });
    const curve = (fn, color = 'amber', options = {}) => b.plot(fn, { color, width: 3.8, from: -6, to: 8, ...options });
    const point = (x, y, label = '', color = 'amber', hollow = false) =>
      b.point([x, y], { label, color, hollow, r: 5.5, dx: 10, dy: -13, align: 'left', glow: false });
    const wall = x => b.vline(x, { color: 'green', width: 2, dash: [5, 5] });
    const interval = (a, z, closed, y = -3.8) => {
      b.seg([a, y], [z, y], { color: 'green', width: 4 });
      point(a, y, String(a), 'green', !closed); point(z, y, String(z), 'green', !closed);
    };
    if (id === 'sepBothGreater') {
      const f = x => 0.7 * x * (x + 2); // reflection of roots 2,4 about p=1
      curve(f); wall(1);
      point(-2, 0, 'α'); point(0, 0, 'β'); point(-1, f(-1), '대칭축');
      point(1, f(1), '경계 p', 'green');
    } else if (id === 'sepInsideInterval') {
      const f = x => 0.85 * (x + 1) * (x - 2);
      curve(f); wall(-1); wall(3); interval(-1, 3, true);
      point(-1, 0, 'α', 'green'); point(2, 0, 'β');
      point(0.5, f(0.5), '대칭축'); point(3, f(3), '경계 q', 'green');
    } else if (id === 'sepOneRootInInterval') {
      const f = mode === 'double' ? x => (x - 1) ** 2 : x => x * (x - 1);
      curve(f); wall(0); wall(2); interval(0, 2, false);
      point(1, 0, mode === 'double' ? '중근' : '안쪽 근', 'green');
      if (mode === 'endpoint') point(0, 0, '끝점의 근', 'rose', true);
      point(0, f(0), 'f(p)', 'sky'); point(2, f(2), 'f(q)', 'rose');
    } else if (id === 'rootSignZero') {
      const roots = mode === 'positive' ? [1.2, 3.4] : mode === 'negative' ? [-3.4, -1.2] : [-2.2, 1.8];
      const a = mode === 'opposite' ? 0.5 : 0.7;
      const f = x => a * (x - roots[0]) * (x - roots[1]);
      curve(f, mode === 'opposite' ? 'rose' : 'amber'); wall(0);
      roots.forEach((x, i) => point(x, 0, i ? 'β' : 'α'));
      point(0, f(0), 'f(0)', 'green');
    } else if (id === 'alwaysPositiveAll') {
      const sign = ['negative', 'nonpositive'].includes(mode) ? -1 : 1;
      const height = ['nonnegative', 'nonpositive'].includes(mode) ? 0 : 1.4;
      const f = x => sign * (0.6 * (x - 1) ** 2 + height);
      curve(f, sign > 0 ? 'green' : 'rose');
      point(1, f(1), height ? '꼭짓점' : '접점', sign > 0 ? 'green' : 'rose');
    } else if (id === 'restrictedIneqMinMax') {
      const f = mode === 'minimum' ? x => 0.6 * (x - 1.5) ** 2 + 0.8 : x => 0.45 * (x + 0.8) * (x - 4.2);
      curve(f, mode === 'minimum' ? 'amber' : 'rose'); wall(0); wall(3); interval(0, 3, true);
      if (mode === 'minimum') point(1.5, f(1.5), '최솟값');
      else { point(0, f(0), '왼쪽 끝', 'rose'); point(3, f(3), '오른쪽 끝', 'rose'); }
    } else if (id === 'specialSol4Cases') {
      curve(x => (x - 2) ** 2); point(2, 0, '접점');
      if (s.lqcShowAnswer) {
        const y = -2.8;
        b.seg([-5.4, y], [7.4, y], { color: 'muted', width: 1.2 });
        if (mode === 'gt' || mode === 'ge') {
          b.seg([-5.4, y], [7.4, y], { color: 'green', width: 4 });
          point(2, y, '2', 'green', mode === 'gt');
        } else if (mode === 'le') point(2, y, '2', 'green');
        else b.text([2, y], '해 없음', { color: 'rose', size: 14, weight: 800 });
      }
    } else if (id === 'integerCountBoundary') {
      const k = Number(s.lqcK), strict = !!s.lqcStrict;
      curve(x => (x - 1) * (x - k), 'sky');
      interval(1, k, !strict, 0);
      for (let n = 1; n <= 5; n++) {
        const included = strict ? n > 1 && n < k - 1e-8 : n >= 1 && n <= k + 1e-8;
        point(n, 0, String(n), included ? 'green' : 'muted', !included);
      }
      point(k, 0, 'k', 'rose', strict);
    } else if (id === 'compIneqTransform') {
      curve(x => 0.35 * (x + 2) * (x - 4), 'sky', { width: 2.2, dash: [5, 4], alpha: 0.45 });
      const f = x => 0.35 * (2 * x + 1) * (2 * x - 5);
      curve(f);
      if (mode === 'inside') b.seg([-0.5, 0], [2.5, 0], { color: 'green', width: 5, alpha: 0.7 });
      else {
        b.seg([-5.4, 0], [-0.5, 0], { color: 'green', width: 5, alpha: 0.7 });
        b.seg([2.5, 0], [7.4, 0], { color: 'green', width: 5, alpha: 0.7 });
      }
      point(-0.5, 0, 'γ', 'green', true); point(2.5, 0, 'δ', 'green', true);
    } else if (id === 'trapMaxLtMin') {
      const f = x => 0.6 * (x + 2) ** 2 + 1.5, g = x => -0.6 * (x - 2.5) ** 2 + 1;
      curve(f, 'sky'); curve(g, 'rose');
      const x1 = mode === 'same' ? -0.5 + Math.min(1, Math.max(0, Number(s.lqcTrace) || 0)) : -2;
      const x2 = mode === 'same' ? x1 : 2.5;
      point(x1, f(x1), mode === 'same' ? 'f(x)' : 'min f', 'sky');
      point(x2, g(x2), mode === 'same' ? 'g(x)' : 'max g', 'rose');
      b.seg([x1, f(x1)], [x2, g(x2)], { color: 'violet', width: 2.2, dash: [4, 4] });
    } else if (id === 'trapIrrationalCoeffs') {
      curve(x => x * x - 2 * x - 1, 'sky');
      point(1 + Math.sqrt(2), 0, '1 + √2', 'amber');
      point(1 - Math.sqrt(2), 0, s.lqcShowAnswer ? '1 − √2' : '다른 근', 'green');
    } else if (id === 'symmetryRootSum') {
      const k = Number(s.lqcK), f = x => Math.abs(0.6 * (x - 2) ** 2 - 2.5);
      curve(f); wall(2); b.hline(k, { color: 'rose', width: 2.2 });
      const roots = [];
      for (const sign of [-1, 1]) {
        const square = (2.5 + sign * k) / 0.6;
        if (square >= 0) { const d = Math.sqrt(square); roots.push(2 - d, 2 + d); }
      }
      roots.sort((a, z) => a - z).filter((x, i, xs) => !i || Math.abs(x - xs[i - 1]) > 1e-8)
        .forEach((x, i) => point(x, k, ['α', 'β', 'γ', 'δ'][i], 'green'));
    } else if (id === 'absXSymmetry') {
      const k = Number(s.lqcK), f = x => x * x - 2 * Math.abs(x) - 3;
      curve(f); b.hline(k, { color: 'rose', width: 2.2 });
      const roots = [];
      if (k >= -4) for (const r of [1 - Math.sqrt(k + 4), 1 + Math.sqrt(k + 4)]) {
        if (r >= -1e-8) roots.push(-Math.max(0, r), Math.max(0, r));
      }
      roots.sort((a, z) => a - z).filter((x, i, xs) => !i || Math.abs(x - xs[i - 1]) > 1e-8)
        .forEach(x => point(x, k, '', 'green'));
    }
    return true;
  }

  global.APL_CQ_LESSONS = {
    drawConcept,
    install(scenes, source) {
      const lessons = {};
      const add = (id, label, title, answer, chapters, options = {}) => {
        if (!scenes.some(scene => scene.id === id)) throw new Error('Missing quadratic scene: ' + id);
        const nums = {}, sets = {};
        for (const [key, value] of Object.entries(source.initial(id))) (typeof value === 'number' ? nums : sets)[key] = value;
        const isConcept = !!options.concept, first = chapters[0];
        first.start = { ...nums, lqcTrace: 0, lqcK: 3, ...options.start };
        chapters.forEach((chapter, index) => {
          if (chapter.cues[0].step == null) chapter.cues[0].step = index === chapters.length - 1 ? 3 : Math.min(index, 2);
          for (const cue of chapter.cues) if (typeof cue.part === 'number') cue.part = String(cue.part);
        });
        if (first.cues[0].part === undefined) first.cues[0].part = null;
        first.cues[0].set = {
          ...sets, lqcQuestion: isConcept ? options.question : source.question(id),
          lqcConcept: isConcept, lqcExplore: isConcept, lqcTarget: options.target || '',
          lqcShowAnswer: false, lqcMode: '', lqcStrict: false, lqcSig: '',
          ...options.set, ...first.cues[0].set
        };
        first.cues.splice(1, 0, { at: 0.1, to: { lqcTrace: 1 }, dur: 4 });
        const final = chapters[chapters.length - 1].cues[0];
        final.set = { ...final.set, lqcShowAnswer: true };
        (lessons[id] || (lessons[id] = [])).push({
          label, title, tab: 'review', answer, answerText: options.answerText || answer,
          summary: options.summary || '그래프의 위치와 문제의 조건을 식으로 연결해요.',
          task: options.task || '직접 해 보기에서 조건을 바꾸어 같은 원리를 확인해 보세요.',
          chapters
        });
      };
      const concept = (id, label, title, answer, question, chapters, options = {}) =>
        add(id, label, title, answer, chapters, { ...options, concept: true, question });
      for (const build of global.APL_CQ_LESSON_BUILDERS || []) build({ add, concept, C, P, source });
      return lessons;
    }
  };
})(window);
