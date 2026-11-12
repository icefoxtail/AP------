/* 중3 함수: Archive 유형 재구성 22장면 + 2027 개정 보충 1장면.
 * Original Archive records remain read-only; every displayed condition is
 * derived from the current model. No calculus/discriminant is used in lessons.
 */
(function () {
  'use strict';
  const M = window.APL_MF;
  const T = String.raw, F = M.f, N = M.n, P = M.p;
  const scenes = [];
  const R = (name, number, term = '1final') => `archive/exams/original/middle/m3/${term}/${name}.js#q${number}@${number}`;
  const source = (types, refs) => ({ kind: 'archive-adapted', types: types.map(t => `M3-${t}`), refs, label: 'Archive 기출 유형 재구성' });
  const variable = (label, value, min, max, step = 1) => ({ label, value, min, max, step });
  const sign = value => value > 1e-9 ? '양수' : value < -1e-9 ? '음수' : '0';
  const term = (value, suffix = '') => Math.abs(value) < 1e-10 ? '' : `${value < 0 ? '-' : '+'}${Math.abs(value) === 1 && suffix ? '' : F(Math.abs(value))}${suffix}`;
  function polynomial(a, b, c, name = 'x') {
    let text = term(a, `${name}^2`) + term(b, name) + term(c);
    return text ? text.replace(/^\+/, '') : '0';
  }
  const shifted = p => p === 0 ? 'x' : `(x${term(-p)})`;
  const vertexFormula = m => `${m.a === 1 ? '' : m.a === -1 ? '-' : F(m.a)}${shifted(m.p)}^2${term(m.q)}`;
  const generalFormula = m => polynomial(m.a, m.b, m.c);
  const y = (m, x) => m.a * (x - m.p) ** 2 + m.q;
  const scalarLabel = value => `${Math.abs(value - Math.round(value * 100) / 100) > 1e-9 ? '≈' : ''}${N(value)}`;
  const pairLabel = q => `${[q.x, q.y].some(v => Math.abs(v - Math.round(v * 100) / 100) > 1e-9) ? '≈' : ''}(${N(q.x)}, ${N(q.y)})`;
  const parabola = (a, p, q) => ({ a, p, q, b: -2 * a * p, c: a * p * p + q, V: P(p, q) });
  const shape = (v) => parabola(v.sign * v.mag, v.p || 0, v.q || 0);
  const plot = (b, m, opts = {}) => M.curve(b, x => y(m, x), opts);
  const focus = (m, extra = [], spread = 2) => M.box([m.V, P(m.p - spread, y(m, m.p - spread)), P(m.p + spread, y(m, m.p + spread)), ...extra], { pad: 1.6, minSpan: 8 });
  function vertex(b, m, ctx, draggable = false) {
    M.point(b, m.V, 'V', { color: 'amber', dy: m.a > 0 ? 20 : -18 });
    if (ctx.step >= 2) b.vline(m.p, { color: 'amber', width: 1.5, dash: [5, 4] });
    if (ctx.solved) M.label(b, m.V, pairLabel(m.V), { color: 'amber', dy: m.a > 0 ? 37 : -35 });
    if (draggable) M.drag(b, ctx, 'vertex', m.V, { x: 'p', y: 'q', label: 'V', color: 'amber' });
  }
  function onCurve(b, ctx, key, point, write) {
    b.handle(`${ctx.spec.id}:${key}`, point, { color: 'amber', label: key, size: 14, drag(q) { ctx.set(write(q)); } });
  }
  const verifyPara = m => [Math.abs(y(m, m.p + 1) - y(m, m.p - 1)) > 1e-8 && '대칭축 불일치', Math.abs(m.a * m.p ** 2 + m.b * m.p + m.c - m.q) > 1e-8 && '꼭짓점 대입 불일치'].filter(Boolean);
  function add(spec) {
    spec.finalStep = 4;
    const voice = spec.voice;
    delete spec.voice;
    const caption = text => {
      if (text.replace(/\$[^$]*\$/g, '□□□□').length <= 40) return text;
      const math = text.match(/\$[^$]*\$/g);
      return math ? math.slice(0, 3).join(' → ') : text.length <= 40 ? text : `${text.slice(0, 36)}…`;
    };
    spec.lesson = (v, m) => {
      const c = (spec.captions ? spec.captions(v, m) : spec.steps(v, m)).map(caption);
      let chapters;
      if (spec.tier === 'concept') chapters = [
        { title: '변화와 관계', length: 12, cues: [{ at: 0, step: 1, say: c[0] }, { at: 4, say: voice[1] }, { at: 8, step: 2, say: c[1] }] },
        { title: '원리와 결론', length: 12, cues: [{ at: 0, step: 3, say: c[2] }, { at: 4, say: voice[3] }, { at: 8, step: 4, say: c[3] }] }
      ];
      else if (spec.tier === 'basic') chapters = [
        { title: '주어진 조건', length: 8, cues: [{ at: 0, step: 1, say: voice[0] }, { at: 4, say: c[0] }] },
        { title: '대입과 계산', length: 12, cues: [{ at: 0, step: 2, say: c[1] }, { at: 4, step: 3, say: c[2] }, { at: 8, say: voice[2] }] },
        { title: '식과 그래프 확인', length: 8, cues: [{ at: 0, step: 4, say: c[3] }, { at: 4, say: voice[3] }] }
      ];
      else chapters = voice.map((say, i) => ({ title: ['조건 살펴보기', '그림과 식 연결', '계산과 이유', '결론 확인'][i], length: 8,
        cues: [{ at: 0, step: i + 1, say }, { at: 4, say: c[i] }] }));
      if (spec.lessonFinish) {
        const last = chapters[chapters.length - 1];
        const { confirm, ...motion } = spec.lessonFinish(v, m);
        const { step: previousStep, ...firstCue } = last.cues[0];
        last.cues[0] = { ...firstCue, ...motion };
        last.cues[1] = { ...last.cues[1], step: 4, ...(confirm ? { say: confirm } : {}) };
      }
      return { title: spec.title.slice(0, 20), tab: 'review', answer: spec.answer(v, m), answerText: spec.answer(v, m),
        summary: '조건을 그림에 표시하고 현재 식으로 확인해요.', task: '막대나 점을 움직여 같은 원리가 유지되는지 확인하세요.', chapters };
    };
    if (!spec.verify) spec.verify = (v, m) => m.V ? verifyPara(m) : [];
    scenes.push(spec);
  }

  add({ id: 'definition', tier: 'concept', title: '이차함수의 조건',
    source: source(['Q01'], [R('26_삼산중_1학기_기말_중3_기출', 3)]),
    vars: { k: variable('이차항의 계수 k', 1, -2, 2), x: variable('입력 x', 1, -2, 2) },
    model: v => ({ a: v.k, b: 2, c: 1, value: v.k * v.x * v.x + 2 * v.x + 1, quadratic: v.k !== 0 }),
    focus: (v, m) => { const pts = [-2, 0, 2, v.x].map(x => P(x, m.a * x * x + 2 * x + 1)); if (m.a) { const x = -1 / m.a; pts.push(P(x, m.a * x * x + 2 * x + 1)); } return M.box(pts, { pad: 2, minSpan: 9 }); },
    question: v => T`$y=${polynomial(v.k, 2, 1)}$은 이차함수일까요? $k=0$인 경우와 비교하세요.`,
    guide: 'k를 0으로 바꾸면 이차항이 사라집니다. 입력 x를 바꾸어 점의 높이도 확인하세요.',
    steps: (v, m) => [T`현재 식은 $y=${polynomial(m.a, m.b, m.c)}$입니다.`, T`정리한 식의 $x^2$의 계수는 $k=${F(v.k)}$입니다.`, T`입력 $x=${F(v.x)}$에서 출력은 $${F(m.value)}$입니다.`, v.k ? '이차항의 계수가 0이 아니므로 이차함수입니다.' : '이차항이 사라져 y=2x+1인 일차함수가 됩니다.'],
    answer: (v, m) => m.quadratic ? T`$k=${F(v.k)}\ne0$: 이차함수` : '$k=0$: 일차함수 $y=2x+1$',
    draw(b, v, m, ctx) { M.curve(b, x => m.a * x * x + 2 * x + 1); const q = P(v.x, m.value); M.point(b, q, 'P'); if (ctx.step >= 2) M.projection(b, q); onCurve(b, ctx, 'P', q, q => ({ x: q.x })); },
    chips: v => [{ tex: `k=${F(v.k)}`, color: 'sky' }],
    voice: ['이차항이 남는지 확인해요.', '계수가 0이면 이차항이 사라져요.', '입력과 출력은 그래프의 한 점이에요.', '정리한 식의 차수로 판단해요.'],
    verify: (v, m) => [m.quadratic !== (v.k !== 0) && '이차함수 판정 불일치', Math.abs(m.value - (v.k * v.x ** 2 + 2 * v.x + 1)) > 1e-9 && '함숫값 불일치'].filter(Boolean)
  });

  add({ id: 'coefficient', tier: 'concept', title: '계수와 포물선의 모양',
    source: source(['Q03'], [R('26_팔마중_1학기_기말_중3_기출', 11)]),
    vars: { mag: variable('계수의 절댓값', 2, 0.5, 3, 0.5), x: variable('비교할 x', 1, 0.5, 2, 0.5) }, state: { sign: 1 },
    presets: [{ label: '아래로 볼록', values: { sign: 1 } }, { label: '위로 볼록', values: { sign: -1 } }],
    model: v => ({ ...shape(v), A: P(v.x, v.sign * v.mag * v.x ** 2), B: P(v.x, v.x ** 2) }),
    focus: (v, m) => focus(m, [m.A, m.B], 1.8),
    question: (v, m) => T`$y=${F(m.a)}x^2$과 $y=x^2$를 비교하세요. 열린 방향과 폭은 어떻게 다른가요?`,
    guide: '회색은 y=x²입니다. 같은 x에서 두 점의 높이를 비교하세요. 열린 방향은 위의 버튼으로 바꿉니다.',
    steps: (v, m) => [T`꼭짓점은 두 그래프 모두 $(0,0)$입니다.`, T`$a=${F(m.a)}$의 부호가 ${sign(m.a)}이므로 ${m.a > 0 ? '위' : '아래'}로 열립니다.`, T`$x=${F(v.x)}$에서 높이의 절댓값은 각각 $${F(Math.abs(m.A.y))}$, $${F(m.B.y)}$입니다.`, T`$|a|=${F(v.mag)}$이므로 기준보다 폭이 ${v.mag > 1 ? '좁습니다' : v.mag < 1 ? '넓습니다' : '같습니다'}.`],
    answer: (v, m) => `${m.a > 0 ? '아래로 볼록' : '위로 볼록'}, 폭은 ${v.mag > 1 ? '기준보다 좁음' : v.mag < 1 ? '기준보다 넓음' : '기준과 같음'}`,
    draw(b, v, m, ctx) { M.curve(b, x => x * x, { color: 'muted', dash: [5, 4], width: 2 }); plot(b, m); M.point(b, m.A, 'A', { color: 'sky', dx: 12 }); M.point(b, m.B, 'B', { color: 'muted', dx: -15 }); if (ctx.step >= 2) M.projection(b, m.A); },
    voice: ['두 그래프는 원점에서 만나요.', '계수의 부호가 열린 방향을 정해요.', '같은 x에서 높이를 비교해요.', '절댓값이 클수록 폭이 좁아요.']
  });

  add({ id: 'vertex-axis', tier: 'concept', title: '꼭짓점·축·같은 높이',
    source: source(['Q05', 'Q09'], [R('26_삼산중_1학기_기말_중3_기출', 4)]),
    vars: { p: variable('꼭짓점의 가로 위치', 1, -3, 3), q: variable('꼭짓점의 세로 위치', 3, -3, 3), t: variable('축에서 떨어진 거리', 1, 0.5, 2, 0.5) }, state: { mag: 1, sign: 1 },
    model: v => { const m = shape(v); return { ...m, A: P(v.p - v.t, y(m, v.p - v.t)), B: P(v.p + v.t, y(m, v.p + v.t)) }; },
    focus: (v, m) => focus(m, [m.A, m.B]),
    question: (v, m) => T`$y=${vertexFormula(m)}$에서 꼭짓점과 축을 찾아보고, 같은 높이의 두 점을 비교하세요.`,
    guide: '주황색 꼭짓점을 끌 수 있습니다. 축에서 떨어진 거리를 바꾸면 두 점이 대칭으로 움직입니다.',
    steps: (v, m) => [T`제곱 부분이 0이 되는 입력은 $x=${F(m.p)}$입니다.`, T`그때 $y=${F(m.q)}$이므로 꼭짓점은 $(${F(m.p)},${F(m.q)})$입니다.`, T`$x=${F(v.p - v.t)}$, $x=${F(v.p + v.t)}$는 축에서 $${F(v.t)}$만큼 떨어져 있습니다.`, T`두 점의 높이가 $${F(m.A.y)}$로 같으므로 대칭축은 $x=${F(m.p)}$입니다.`],
    answer: (v, m) => T`꼭짓점 $(${F(m.p)},${F(m.q)})$, 축 $x=${F(m.p)}$`,
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx, true); M.point(b, m.A, 'A', { color: 'green', dx: -15 }); M.point(b, m.B, 'B', { color: 'green', dx: 15 }); if (ctx.step >= 3) b.seg(m.A, m.B, { color: 'green', dash: [4, 4] }); },
    voice: ['제곱이 0이 되는 입력을 찾아요.', '꼭짓점에서 방향이 바뀌어요.', '축의 양쪽에서 같은 거리를 잡아요.', '같은 높이의 두 점은 서로 대칭이에요.']
  });

  add({ id: 'translation', tier: 'concept', title: '포물선의 평행이동',
    source: source(['Q07'], [R('26_삼산중_1학기_기말_중3_기출', 12)]),
    vars: { p: variable('x방향 이동량', 2, -3, 3), q: variable('y방향 이동량', -1, -3, 3) }, state: { mag: 1, sign: 1 },
    model: v => ({ ...shape(v), O: P(0, 0), A: P(1, 1), B: P(v.p + 1, v.q + 1) }),
    focus: (v, m) => focus(m, [m.O, m.A, m.B]),
    question: v => T`$y=x^2$을 x방향으로 $${F(v.p)}$, y방향으로 $${F(v.q)}$만큼 옮긴 그래프의 식은 무엇인가요?`,
    guide: '주황색 꼭짓점을 끌어 원래 그래프와 비교하세요. 회색 그래프의 점마다 같은 양을 더합니다.',
    steps: (v, m) => [T`원래 꼭짓점은 $(0,0)$입니다.`, T`모든 점의 x좌표에 $${F(v.p)}$, y좌표에 $${F(v.q)}$를 더합니다.`, T`이동한 꼭짓점은 $(${F(v.p)},${F(v.q)})$입니다.`, T`새 식은 $y=${vertexFormula(m)}$입니다. 괄호 안의 부호와 이동 방향을 구별합니다.`],
    answer: (v, m) => T`$y=${vertexFormula(m)}$`,
    draw(b, v, m, ctx) { M.curve(b, x => x * x, { color: 'muted', width: 2, dash: [5, 4] }); plot(b, m); M.point(b, m.O, 'O', { color: 'muted', dx: -12 }); vertex(b, m, ctx, true); if (ctx.step >= 2) { b.seg(m.O, m.V, { color: 'amber', dash: [4, 4] }); M.point(b, m.A, 'A', { color: 'muted' }); M.point(b, m.B, "A′", { color: 'green' }); b.seg(m.A, m.B, { color: 'green', dash: [4, 4] }); } },
    voice: ['원래 그래프와 꼭짓점을 보세요.', '모든 점을 같은 방향으로 옮겨요.', '꼭짓점의 새 좌표를 확인해요.', '이동한 위치를 괄호 안에 반영해요.']
  });

  add({ id: 'reflection', tier: 'concept', title: '축에 대한 대칭이동',
    source: source(['Q08'], [R('26_삼산중_1학기_기말_중3_기출', 9)]),
    vars: { p: variable('원래 꼭짓점 x', 1, -2, 2), q: variable('원래 꼭짓점 y', -2, -3, 3) }, state: { axis: 'x' },
    presets: [{ label: 'x축에 대칭', values: { axis: 'x' } }, { label: 'y축에 대칭', values: { axis: 'y' } }],
    model: v => ({ ...parabola(1, v.p, v.q), reflected: v.axis === 'x' ? parabola(-1, v.p, -v.q) : parabola(1, -v.p, v.q) }),
    focus: (v, m) => focus(m, [m.reflected.V, P(m.reflected.p - 2, y(m.reflected, m.reflected.p - 2)), P(m.reflected.p + 2, y(m.reflected, m.reflected.p + 2))]),
    question: (v, m) => T`$y=${vertexFormula(m)}$을 ${v.axis}축에 대하여 대칭이동한 그래프의 식을 알아보세요.`,
    guide: '파랑은 원래 그래프, 초록은 대칭인 그래프입니다. 대칭축을 바꾸어 꼭짓점 좌표를 비교하세요.',
    steps: (v, m) => [T`원래 꼭짓점은 $(${F(m.p)},${F(m.q)})$입니다.`, v.axis === 'x' ? 'x축 대칭에서는 x좌표를 유지하고 y좌표의 부호를 바꿉니다.' : 'y축 대칭에서는 y좌표를 유지하고 x좌표의 부호를 바꿉니다.', T`새 꼭짓점은 $(${F(m.reflected.p)},${F(m.reflected.q)})$입니다.`, T`대칭인 그래프의 식은 $y=${vertexFormula(m.reflected)}$입니다.`],
    answer: (v, m) => T`$y=${vertexFormula(m.reflected)}$`,
    draw(b, v, m, ctx) { plot(b, m); plot(b, m.reflected, { color: 'green' }); M.point(b, m.V, 'V', { color: 'sky' }); M.point(b, m.reflected.V, "V′", { color: 'green', dx: -16 }); if (ctx.step >= 2) b.seg(m.V, m.reflected.V, { color: 'amber', dash: [4, 4] }); },
    voice: ['원래 꼭짓점의 위치를 확인해요.', '대칭축에서 같은 거리로 옮겨요.', '바뀌는 좌표의 부호를 살펴봐요.', '대칭인 그래프의 식을 확인해요.'],
    verify: (v, m) => [...verifyPara(m), ...[-2, -1, 0, 1, 2].map(x => Math.abs(v.axis === 'x' ? y(m, x) + y(m.reflected, x) : y(m, x) - y(m.reflected, -x)) > 1e-8 && '대칭 대응 불일치').filter(Boolean)]
  });

  add({ id: 'increase-decrease', tier: 'concept', title: '증가와 감소를 읽기',
    source: source(['Q10'], [R('21_왕의중_1학기_기말_중3_수학_기출', 11)]),
    vars: { p: variable('축의 위치', 1, -2, 2), q: variable('꼭짓점 높이', 0, -2, 2), t: variable('축에서 점의 가로 이동', -1, -2, 2, 0.25) }, state: { mag: 1, sign: 1 },
    presets: [{ label: '위로 열린 포물선', values: { sign: 1 } }, { label: '아래로 열린 포물선', values: { sign: -1 } }],
    model: v => { const m = shape(v); return { ...m, A: P(v.p + v.t, y(m, v.p + v.t)), left: v.sign > 0 ? '감소' : '증가', right: v.sign > 0 ? '증가' : '감소' }; },
    focus: (v, m) => focus(m, [m.A], 2.3),
    question: (v, m) => T`$y=${vertexFormula(m)}$에서 x가 커질 때 y가 증가하는 쪽과 감소하는 쪽을 찾아보세요.`,
    guide: '곡선 위 주황점을 좌우로 끌어 보세요. 꼭짓점의 어느 쪽인지 먼저 판단합니다.',
    steps: (v, m) => [T`축은 $x=${F(m.p)}$입니다.`, T`축의 왼쪽 $x<${F(m.p)}$에서는 x가 커질수록 y가 ${m.left}합니다.`, T`축의 오른쪽 $x>${F(m.p)}$에서는 x가 커질수록 y가 ${m.right}합니다.`, '꼭짓점을 지나면 높이가 변하는 방향이 바뀝니다.'],
    answer: (v, m) => T`$x<${F(m.p)}$: ${m.left}, $x>${F(m.p)}$: ${m.right}`,
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx); onCurve(b, ctx, 'P', m.A, q => ({ t: q.x - v.p })); if (ctx.step >= 2) M.projection(b, m.A); if (ctx.solved) { M.label(b, P(m.p - 1.5, m.q), m.left, { dy: m.a > 0 ? 25 : -25, color: 'green' }); M.label(b, P(m.p + 1.5, m.q), m.right, { dy: m.a > 0 ? 25 : -25, color: 'rose' }); } },
    voice: ['꼭짓점과 축을 먼저 찾아요.', '왼쪽에서 오른쪽으로 점을 옮겨요.', '축을 지난 뒤 높이 변화를 비교해요.', '열린 방향과 축의 위치를 함께 봐요.']
  });

  add({ id: 'function-value', tier: 'basic', title: '함숫값과 그래프 위의 점',
    source: source(['Q02'], [R('26_왕운중_1학기_기말_중3_기출', 11)]),
    vars: { x: variable('입력 x', -1, -2, 3), offset: variable('비교점의 높이 차', 0, -3, 3) },
    model: v => { const m = parabola(2, 0.75, 23 / 8); return { ...m, value: y(m, v.x), A: P(v.x, y(m, v.x)), B: P(v.x, y(m, v.x) + v.offset) }; },
    focus: (v, m) => focus(m, [m.A, m.B], 1.4),
    question: (v, m) => T`$f(x)=2x^2-3x+4$입니다. $f(${F(v.x)})$를 구하고 점 $B(${F(v.x)},${F(m.B.y)})$가 그래프 위에 있는지 판단하세요.`,
    guide: '주황점을 끌어 x를 바꾸세요. 비교점의 높이 차를 0으로 맞추면 두 점이 겹칩니다.',
    steps: (v, m) => [T`입력은 $x=${F(v.x)}$입니다.`, T`$f(${F(v.x)})=2\times(${F(v.x)})^2-3\times(${F(v.x)})+4$입니다.`, T`계산하면 $f(${F(v.x)})=${F(m.value)}$입니다.`, T`B의 y좌표가 함숫값과 ${v.offset === 0 ? '같으므로 그래프 위의 점입니다' : '다르므로 그래프 위에 있지 않습니다'}.`],
    answer: (v, m) => T`$f(${F(v.x)})=${F(m.value)}$, B는 그래프 ${v.offset === 0 ? '위에 있음' : '위에 없음'}`,
    draw(b, v, m, ctx) { plot(b, m); onCurve(b, ctx, 'A', m.A, q => ({ x: q.x })); M.point(b, m.B, 'B', { color: 'rose', dx: -15 }); if (ctx.step >= 2) M.projection(b, m.A); },
    voice: ['입력값과 비교할 점을 읽어요.', 'x가 있던 자리에 같은 값을 넣어요.', '계산 결과를 그래프의 높이와 비교해요.', '점의 y좌표와 함숫값이 같아야 해요.'],
    verify: (v, m) => [Math.abs(m.value - (2 * v.x ** 2 - 3 * v.x + 4)) > 1e-8 && '대입 계산 불일치'].filter(Boolean)
  });

  add({ id: 'point-coefficient', tier: 'basic', title: '한 점에서 계수 찾기',
    source: source(['Q04'], [R('21_연향중_1학기_기말_중3_기출c', 5)]),
    vars: { px: variable('점 P의 x좌표', 2, 1, 3), height: variable('점 P의 높이 절댓값', 8, 1, 12) }, state: { sign: 1 },
    presets: [{ label: '양의 높이', values: { sign: 1 } }, { label: '음의 높이', values: { sign: -1 } }],
    model: v => ({ ...parabola(v.sign * v.height / (v.px * v.px), 0, 0), A: P(v.px, v.sign * v.height) }),
    focus: (v, m) => focus(m, [m.A, P(-m.A.x, m.A.y)], Math.min(2, v.px)),
    question: (v, m) => T`$y=ax^2$의 그래프가 $P(${F(m.A.x)},${F(m.A.y)})$를 지납니다. a를 구하세요.`,
    guide: '점의 좌표를 바꾸면 포물선이 그 점을 지나도록 바뀝니다. 원점 이외의 점으로 계수를 정합니다.',
    steps: (v, m) => [T`점 P의 좌표는 $(${F(m.A.x)},${F(m.A.y)})$입니다.`, T`$${F(m.A.y)}=a\times${F(m.A.x)}^2$를 얻습니다.`, T`$${F(m.A.y)}=${F(m.A.x ** 2)}a$이므로 양변을 $${F(m.A.x ** 2)}$으로 나눕니다.`, T`$a=${F(m.a)}$, 따라서 $y=${vertexFormula(m)}$입니다.`],
    answer: (v, m) => T`$a=${F(m.a)}$, $y=${vertexFormula(m)}$`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.A, 'P', { color: 'amber' }); if (ctx.step >= 2) M.projection(b, m.A); M.point(b, P(0, 0), 'O', { color: 'muted', dx: -15 }); },
    voice: ['그래프 위의 점은 식을 만족해요.', 'x좌표와 y좌표를 식에 대입해요.', '제곱한 x좌표로 양변을 나눠요.', '구한 계수로 점을 다시 확인해요.'],
    verify: (v, m) => [...verifyPara(m), Math.abs(m.a * m.A.x ** 2 - m.A.y) > 1e-9 && '주어진 점 미통과'].filter(Boolean)
  });

  add({ id: 'complete-square', tier: 'basic', title: '일반형에서 꼭짓점 찾기',
    source: source(['Q06'], [R('26_삼산중_1학기_기말_중3_기출', 16)]),
    vars: { mag: variable('이차항 계수의 절댓값', 2, 1, 3), linear: variable('일차항의 계수', 4, -6, 6), constant: variable('상수항', 5, -3, 5) }, state: { sign: -1 },
    presets: [{ label: '위로 열린 식', values: { sign: 1 } }, { label: '아래로 열린 식', values: { sign: -1 } }],
    model: v => { const a = v.sign * v.mag, p = -v.linear / (2 * a); return parabola(a, p, v.constant - a * p * p); },
    focus: (v, m) => focus(m, [P(0, m.c), P(2 * m.p, m.c)], 1.5),
    question: (v, m) => T`$y=${generalFormula(m)}$을 꼭짓점형으로 고치고 축과 꼭짓점을 구하세요.`,
    guide: '각 항의 계수를 바꿔 보세요. 식은 달라지지만 일반형과 꼭짓점형이 같은 그래프를 나타내야 합니다.',
    steps: (v, m) => [T`$y=${F(m.a)}(x^2${term(m.b / m.a, 'x')})${term(m.c)}$입니다.`, T`괄호 안에서 $x^2${term(m.b / m.a, 'x')}=${shifted(m.p)}^2-${F(m.p ** 2)}$입니다.`, T`상수항을 정리하면 $y=${vertexFormula(m)}$입니다.`, T`꼭짓점은 $(${F(m.p)},${F(m.q)})$, 축은 $x=${F(m.p)}$입니다.`],
    answer: (v, m) => T`$y=${vertexFormula(m)}$, 꼭짓점 $(${F(m.p)},${F(m.q)})$, 축 $x=${F(m.p)}$`,
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx); M.point(b, P(0, m.c), 'C', { color: 'green', dx: -14 }); if (ctx.step >= 3) M.projection(b, m.V); },
    voice: ['이차항의 계수로 묶어요.', '완전제곱을 만들고 더한 만큼 빼요.', '상수항을 정리해 꼭짓점형을 만들어요.', '꼭짓점과 축을 그래프에 확인해요.'],
    verify: (v, m) => [...verifyPara(m), ...[-3, 0, 2].map(x => Math.abs(y(m, x) - (v.sign * v.mag * x * x + v.linear * x + v.constant)) > 1e-8 && '두 식 불일치').filter(Boolean)]
  });

  add({ id: 'vertex-point', tier: 'basic', title: '꼭짓점과 한 점',
    source: source(['Q13'], [R('26_팔마중_1학기_기말_중3_기출', 23)]),
    vars: { p: variable('꼭짓점 x', -1, -3, 3), q: variable('꼭짓점 y', 2, -3, 3), dx: variable('점 P의 가로 거리', 2, 1, 3), rise: variable('점 P의 세로 거리', 4, 1, 6) }, state: { sign: 1 },
    presets: [{ label: '위로 열린 조건', values: { sign: 1 } }, { label: '아래로 열린 조건', values: { sign: -1 } }],
    model: v => ({ ...parabola(v.sign * v.rise / v.dx ** 2, v.p, v.q), A: P(v.p + v.dx, v.q + v.sign * v.rise) }),
    focus: (v, m) => focus(m, [m.A, P(2 * m.p - m.A.x, m.A.y)], v.dx),
    question: (v, m) => T`꼭짓점이 $V(${F(v.p)},${F(v.q)})$이고 $P(${F(m.A.x)},${F(m.A.y)})$를 지나는 이차함수의 식을 구하세요.`,
    guide: '꼭짓점과 지나야 할 점의 조건을 바꿉니다. 두 점의 가로·세로 차가 계수를 정합니다.',
    steps: (v, m) => [T`꼭짓점형으로 $y=a${shifted(v.p)}^2${term(v.q)}$라 놓습니다.`, T`P를 대입하면 $${F(m.A.y)}=a\times${F(v.dx)}^2${term(v.q)}$입니다.`, T`$${F(v.sign * v.rise)}=${F(v.dx ** 2)}a$에서 $a=${F(m.a)}$입니다.`, T`따라서 $y=${vertexFormula(m)}$입니다. 두 조건을 모두 확인합니다.`],
    answer: (v, m) => T`$y=${vertexFormula(m)}$`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.V, 'V', { color: 'amber' }); M.point(b, m.A, 'P', { color: 'green' }); if (ctx.step >= 2) M.riseRun(b, m.V, m.A, { dxLabel: N(v.dx), dyLabel: N(v.sign * v.rise) }); if (ctx.step >= 3) b.vline(v.p, { color: 'amber', dash: [5, 4] }); },
    voice: ['꼭짓점으로 식의 틀을 정해요.', '지나야 할 점을 식에 대입해요.', '가로 거리의 제곱으로 계수를 구해요.', '두 조건을 모두 만족하는지 확인해요.'],
    verify: (v, m) => [...verifyPara(m), Math.abs(y(m, m.A.x) - m.A.y) > 1e-9 && '주어진 점 미통과'].filter(Boolean)
  });

  add({ id: 'intercepts', tier: 'basic', title: '축과 만나는 점으로 식 찾기',
    source: source(['Q14'], [R('26_삼산중_1학기_기말_중3_기출', 23)]),
    vars: { left: variable('왼쪽 절편의 거리', 3, 1, 4), right: variable('오른쪽 절편의 거리', 3, 1, 4), height: variable('y절편의 절댓값', 9, 1, 10) }, state: { sign: -1 },
    presets: [{ label: 'y절편이 양수', values: { sign: -1 } }, { label: 'y절편이 음수', values: { sign: 1 } }],
    model: v => { const a = v.sign * v.height / (v.left * v.right), p = (v.right - v.left) / 2, c = -v.sign * v.height; return { ...parabola(a, p, c - a * p * p), A: P(-v.left, 0), B: P(v.right, 0), C: P(0, c) }; },
    focus: (v, m) => M.box([m.A, m.B, m.C, m.V], { pad: 2, minSpan: 9 }),
    question: (v, m) => T`x축과 $A(-${F(v.left)},0)$, $B(${F(v.right)},0)$에서 만나고 $C(0,${F(m.c)})$를 지나는 이차함수의 식은?`,
    guide: '세 절편 조건을 바꿉니다. x축의 두 점으로 두 인수를 만들고 y절편으로 계수를 정합니다.',
    steps: (v, m) => [T`두 x절편에서 y=0이므로 $y=a(x+${F(v.left)})(x-${F(v.right)})$라 놓습니다.`, T`C를 대입하면 $${F(m.c)}=a\times${F(v.left)}\times(-${F(v.right)})$입니다.`, T`따라서 $a=${F(m.a)}$입니다.`, T`전개하면 $y=${generalFormula(m)}$이며 세 점을 모두 지납니다.`],
    answer: (v, m) => T`$y=${generalFormula(m)}$`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.A, 'A', { color: 'green', dy: 18 }); M.point(b, m.B, 'B', { color: 'green', dy: 18 }); M.point(b, m.C, 'C', { color: 'amber', dx: -14 }); if (ctx.step >= 3) vertex(b, m, ctx); },
    voice: ['x축과 만나는 두 점을 읽어요.', '두 점에서 0이 되는 인수를 만들어요.', 'y축의 점으로 계수를 정해요.', '전개한 식이 세 점을 지나는지 확인해요.'],
    verify: (v, m) => [...verifyPara(m), ...[m.A, m.B, m.C].map(q => Math.abs(y(m, q.x) - q.y) > 1e-8 && '절편 조건 불일치').filter(Boolean)]
  });

  add({ id: 'graph-formula', tier: 'basic', title: '그래프의 조건으로 식 복원',
    source: source(['Q15'], [R('23_왕운중_2학기_중간_중3_수학', 22, '2mid')]),
    vars: { base: variable('중앙 점의 높이', -3, -3, 3), tilt: variable('양 끝 높이 차 조절', 2, -3, 3), rise: variable('양 끝 높이의 평균 변화', 4, 1, 5) }, state: { sign: 1 },
    presets: [{ label: '위로 열린 조건', values: { sign: 1 } }, { label: '아래로 열린 조건', values: { sign: -1 } }],
    model: v => { const a = v.sign * v.rise / 4, b = -v.tilt / 2, p = -b / (2 * a); return { ...parabola(a, p, v.base - a * p * p), A: P(-2, v.base + v.tilt + v.sign * v.rise), B: P(0, v.base), C: P(2, v.base - v.tilt + v.sign * v.rise) }; },
    focus: (v, m) => M.box([m.A, m.B, m.C, m.V], { pad: 2, minSpan: 9 }),
    question: (v, m) => T`$A(-2,${F(m.A.y)})$, $B(0,${F(m.B.y)})$, $C(2,${F(m.C.y)})$를 지나는 이차함수 $y=ax^2+bx+c$를 구하세요.`,
    guide: '세 점의 조건을 바꾸어 보세요. B는 상수항을 정하고, A와 C는 남은 두 계수를 정합니다.',
    steps: (v, m) => [T`B를 대입하여 $c=${F(m.c)}$를 얻습니다.`, T`A와 C에서 $4a-2b${term(m.c)}=${F(m.A.y)}$, $4a+2b${term(m.c)}=${F(m.C.y)}$입니다.`, T`두 식을 더하고 빼면 $a=${F(m.a)}$, $b=${F(m.b)}$입니다.`, T`따라서 $y=${generalFormula(m)}$입니다. 세 점의 좌표를 다시 대입합니다.`],
    answer: (v, m) => T`$y=${generalFormula(m)}$`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.A, 'A', { color: 'green', dx: -14 }); M.point(b, m.B, 'B', { color: 'amber', dx: -14 }); M.point(b, m.C, 'C', { color: 'green', dx: 14 }); if (ctx.step >= 2) { M.projection(b, m.A); M.projection(b, m.C); } if (ctx.solved) vertex(b, m, ctx); },
    voice: ['서로 다른 세 점의 조건을 읽어요.', '각 좌표를 같은 식에 대입해요.', '두 식을 더하고 빼서 계수를 구해요.', '완성한 식에 세 점을 다시 확인해요.'],
    verify: (v, m) => [...verifyPara(m), ...[m.A, m.B, m.C].map(q => Math.abs(m.a * q.x ** 2 + m.b * q.x + m.c - q.y) > 1e-8 && '세 점 대입 불일치').filter(Boolean)]
  });

  add({ id: 'graph-properties', tier: 'basic', title: '그래프의 성질 점검',
    source: source(['Q11'], [R('26_삼산중_1학기_기말_중3_기출', 8)]),
    vars: { mag: variable('계수의 절댓값', 2, 0.5, 3, 0.5), p: variable('가로 이동', 0, -2, 2), q: variable('세로 이동', 0, -2, 2) }, state: { sign: 1 },
    presets: [{ label: '양의 계수', values: { sign: 1 } }, { label: '음의 계수', values: { sign: -1 } }],
    model: v => ({ ...shape(v), A: P(v.p + 1, v.q + v.sign * v.mag) }),
    focus: (v, m) => focus(m, [m.A], 1.8),
    question: (v, m) => T`$y=${vertexFormula(m)}$의 꼭짓점, 축, 열린 방향, $x=${F(v.p + 1)}$에서의 높이를 차례로 확인하세요.`,
    guide: '기출의 참·거짓 판별에 쓰는 네 근거를 순서대로 확인합니다. 모든 값은 현재 식에서 다시 계산됩니다.',
    steps: (v, m) => [T`꼭짓점은 $(${F(m.p)},${F(m.q)})$입니다.`, T`축은 $x=${F(m.p)}$이고 좌우가 대칭입니다.`, T`$a=${F(m.a)}$이므로 ${m.a > 0 ? '위' : '아래'}로 열립니다.`, T`$x=${F(m.A.x)}$를 대입하면 $y=${F(m.A.y)}$이므로 점 A가 그래프 위에 있습니다.`],
    answer: (v, m) => T`V$(${F(m.p)},${F(m.q)})$, 축 $x=${F(m.p)}$, ${m.a > 0 ? '아래로 볼록' : '위로 볼록'}, A$(${F(m.A.x)},${F(m.A.y)})$`,
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx); M.point(b, m.A, 'A', { color: 'green' }); if (ctx.step >= 3) M.projection(b, m.A); },
    voice: ['식에서 꼭짓점을 먼저 찾으세요.', '대칭축의 위치를 확인해요.', '계수의 부호로 열린 방향을 판단해요.', '한 점을 대입해 높이도 확인해요.']
  });

  add({ id: 'coefficient-signs', tier: 'advanced', title: '그래프로 계수의 부호 읽기',
    source: source(['Q12'], [R('26_삼산중_1학기_기말_중3_기출', 20)]),
    vars: { left: variable('음의 x절편의 절댓값', 1, 1, 3), right: variable('양의 x절편', 5, 1, 5), mag: variable('계수의 절댓값', 1, 0.5, 2, 0.5) }, state: { sign: -1 },
    presets: [{ label: '아래로 열린 그래프', values: { sign: -1 } }, { label: '위로 열린 그래프', values: { sign: 1 } }],
    model: v => { const a = v.sign * v.mag, p = (v.right - v.left) / 2, c = -a * v.left * v.right; const m = parabola(a, p, c - a * p * p); return { ...m, A: P(-v.left, 0), B: P(v.right, 0), C: P(0, c), value: a + 2 * m.b + 3 * c, factor: 1 - 2 * (v.right - v.left) - 3 * v.left * v.right }; },
    focus: (v, m) => M.box([m.V, m.A, m.B, m.C], { pad: 2, minSpan: 9 }),
    question: (v, m) => T`그림은 $y=ax^2+bx+c$입니다. x절편이 $-${F(v.left)}$, $${F(v.right)}$이고 $|a|=${F(v.mag)}$일 때, $a,b,c$와 $a+2b+3c$의 부호를 판단하세요.`,
    guide: '열린 방향, 축의 위치, y절편을 각각 다른 근거로 사용합니다. 두 x절편을 같은 거리로 맞추면 b=0인 경우를 볼 수 있습니다.',
    steps: (v, m) => [T`그래프가 ${m.a > 0 ? '위' : '아래'}로 열리므로 $a$는 ${sign(m.a)}입니다.`, T`y절편은 $c=${F(m.c)}$이고 축은 $x=${F(m.p)}$입니다. $b=-2ap=${F(m.b)}$입니다.`, T`두 절편을 대입하면 $b=${F(-(v.right - v.left))}a$, $c=${F(-v.left * v.right)}a$입니다.`, T`$a+2b+3c=${F(m.factor)}a=${F(m.value)}$이므로 ${sign(m.value)}입니다.`],
    answer: (v, m) => T`$a$: ${sign(m.a)}, $b$: ${sign(m.b)}, $c$: ${sign(m.c)}, $a+2b+3c$: ${sign(m.value)}`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.A, 'A', { color: 'green', dx: -12 }); M.point(b, m.B, 'B', { color: 'green', dx: 12 }); M.point(b, m.C, 'C', { color: 'rose', dx: -15 }); if (ctx.step >= 2) vertex(b, m, ctx); },
    voice: ['열린 방향에서 a의 부호를 읽어요.', '축과 y절편에서 b와 c를 판단해요.', '두 절편을 식에 넣어 계수를 연결해요.', '주어진 식을 a의 배수로 정리해요.'],
    verify: (v, m) => [...verifyPara(m), Math.abs(y(m, -v.left)) > 1e-8 && '왼쪽 절편 불일치', Math.abs(y(m, v.right)) > 1e-8 && '오른쪽 절편 불일치', Math.abs(m.value - m.a * m.factor) > 1e-8 && '부호식 불일치'].filter(Boolean)
  });

  add({ id: 'quadrants', tier: 'advanced', title: '지나지 않는 사분면의 조건',
    source: source(['Q19'], [R('26_삼산중_1학기_기말_중3_기출', 24)]),
    vars: { p: variable('꼭짓점 x좌표', 2, 1, 3), depth: variable('꼭짓점 깊이', 3, 1, 4), mag: variable('양의 계수 a', 1, 0.5, 4, 0.5) },
    model: v => { const m = parabola(v.mag, v.p, -v.depth); return { ...m, C: P(0, m.c), threshold: v.depth / (v.p * v.p), avoidsThird: m.c >= -1e-9 }; },
    focus: (v, m) => M.box([m.V, m.C, P(-0.6, y(m, -0.6)), P(2 * m.p + 0.6, y(m, 2 * m.p + 0.6))], { pad: 2, minSpan: 9 }),
    question: (v, m) => T`꼭짓점이 $(${F(v.p)},-${F(v.depth)})$인 $y=a(x-${F(v.p)})^2-${F(v.depth)}$에서 $a>0$입니다. 제3사분면을 지나지 않도록 하는 a의 범위를 구하세요.`,
    guide: 'a를 바꾸어 y절편이 x축을 지나는 순간을 찾아보세요. x<0인 왼쪽 가지의 높이가 판단의 근거입니다.',
    steps: (v, m) => [T`꼭짓점은 y축의 오른쪽에 있고 그래프는 위로 열립니다.`, T`$x<0$에서는 축으로부터의 거리가 $${F(v.p)}$보다 크므로 $y>y(0)$입니다.`, T`따라서 제3사분면을 지나지 않을 조건은 $y(0)=${F(v.p ** 2)}a-${F(v.depth)}\ge0$입니다.`, T`정리하면 $a\ge${F(m.threshold)}$입니다. 등호일 때도 제3사분면 내부는 지나지 않습니다.`],
    answer: (v, m) => T`$a\ge${F(m.threshold)}$ · 현재 그래프는 제3사분면을 ${m.avoidsThird ? '지나지 않음' : '지남'}`,
    draw(b, v, m, ctx) { plot(b, m); M.point(b, m.V, 'V', { color: 'amber' }); M.point(b, m.C, 'C', { color: 'rose', dx: -15 }); if (ctx.step >= 2) { b.vline(m.p, { color: 'amber', dash: [5, 4] }); M.curve(b, x => y(m, x), { color: 'green', to: 0, width: 4 }); } if (ctx.solved) M.label(b, m.C, `y절편 ${N(m.c)}`, { color: 'rose', dx: -12, dy: -30 }); },
    voice: ['꼭짓점과 열린 방향을 먼저 보세요.', 'y축 왼쪽 가지의 높이를 비교해요.', 'y절편이 0 이상이어야 해요.', '경계인 등호의 경우도 확인해요.'],
    verify: (v, m) => [...verifyPara(m), m.avoidsThird !== (v.mag >= m.threshold - 1e-9) && '사분면 경계 불일치', ...[-0.1, -1, -3].map(x => !(y(m, x) > m.c) && '왼쪽 가지 높이 불일치')].filter(Boolean)
  });

  add({ id: 'area-axes', tier: 'advanced', title: '절편과 꼭짓점으로 만든 삼각형',
    source: source(['Q17'], [R('26_삼산중_1학기_기말_중3_기출', 15)]),
    vars: { left: variable('왼쪽 절편의 절댓값', 1, 1, 3), right: variable('오른쪽 절편', 3, 1, 4), mag: variable('계수의 절댓값', 1, 0.5, 2, 0.5) }, state: { sign: 1 },
    presets: [{ label: '꼭짓점이 x축 아래', values: { sign: 1 } }, { label: '꼭짓점이 x축 위', values: { sign: -1 } }],
    model: v => { const a = v.sign * v.mag, p = (v.right - v.left) / 2, q = -a * (v.left + v.right) ** 2 / 4; return { ...parabola(a, p, q), A: P(-v.left, 0), C: P(v.right, 0), base: v.left + v.right, height: Math.abs(q), area: (v.left + v.right) * Math.abs(q) / 2 }; },
    focus: (v, m) => M.box([m.A, m.C, m.V], { pad: 2, minSpan: 9 }),
    question: (v, m) => T`$y=${generalFormula(m)}$의 두 x절편을 A, C, 꼭짓점을 V라고 합니다. 삼각형 AVC의 넓이를 구하세요.`,
    guide: '세 꼭짓점을 바로 표시했습니다. 높이는 V에서 x축까지의 수직 거리이며, 꼭짓점 y좌표의 부호와 구별합니다.',
    steps: (v, m) => [T`$y=0$을 대입하면 $x=-${F(v.left)},\ ${F(v.right)}$이므로 밑변 AC는 $${F(m.base)}$입니다.`, T`두 절편의 가운데가 축이므로 $x=${F(m.p)}$입니다.`, T`꼭짓점의 y좌표는 $${F(m.q)}$이므로 높이는 $${F(m.height)}$입니다.`, T`삼각형 넓이는 $\frac12\times${F(m.base)}\times${F(m.height)}=${F(m.area)}$입니다.`],
    answer: (v, m) => T`삼각형 AVC의 넓이 $${F(m.area)}$`,
    draw(b, v, m, ctx) { M.polygon(b, [m.A, m.V, m.C]); plot(b, m); M.point(b, m.A, 'A', { color: 'green', dx: -14 }); M.point(b, m.C, 'C', { color: 'green', dx: 14 }); vertex(b, m, ctx); if (ctx.step >= 2) b.seg(m.V, P(m.p, 0), { color: 'rose', dash: [5, 4], width: 2 }); if (ctx.solved) M.label(b, P(m.p, m.q / 2), `높이 ${N(m.height)}`, { color: 'rose', dx: 15, align: 'left' }); },
    voice: ['두 절편으로 밑변을 정해요.', '대칭축에서 꼭짓점을 찾아요.', 'x축까지의 수직 거리가 높이예요.', '밑변 곱하기 높이의 반을 구해요.'],
    verify: (v, m) => [...verifyPara(m), Math.abs(y(m, m.A.x)) > 1e-8 && 'A 절편 불일치', Math.abs(y(m, m.C.x)) > 1e-8 && 'C 절편 불일치', Math.abs(m.area - (m.C.x - m.A.x) * Math.abs(m.V.y) / 2) > 1e-8 && '삼각형 넓이 불일치'].filter(Boolean)
  });

  add({ id: 'two-parabola-area', tier: 'advanced', title: '두 포물선의 넓이와 길이비',
    source: source(['Q17'], [R('26_삼산중_1학기_기말_중3_기출', 19)]),
    vars: { t: variable('점 B의 양의 x좌표', 1, 1, 2), area: variable('삼각형 ABO의 넓이', 2, 1, 4), up: variable('BD의 비', 2, 1, 3), down: variable('CD의 비', 3, 1, 3) },
    model: v => { const a = v.area / v.t ** 3, beta = -a * v.down / v.up, m = parabola(a, 0, 0); return { ...m, lower: parabola(beta, 0, 0), A: P(-v.t, a * v.t * v.t), B: P(v.t, a * v.t * v.t), C: P(v.t, beta * v.t * v.t), D: P(v.t, 0), O: P(0, 0), beta, sum: a + beta }; },
    focus: (v, m) => M.box([m.A, m.B, m.C, m.D, m.O, P(-v.t, m.C.y)], { pad: 2, minSpan: 8 }),
    question: v => T`A, B는 $y=ax^2$ 위에 있고 x좌표가 각각 $-${F(v.t)},\ ${F(v.t)}$입니다. C는 $y=bx^2$ 위에서 B와 x좌표가 같고 x축 아래에 있습니다. D는 선분 BC와 x축의 교점입니다. $\triangle ABO$의 넓이가 $${F(v.area)}$, $BD:CD=${F(v.up)}:${F(v.down)}$일 때 $a+b$를 구하세요.`,
    guide: '삼각형 넓이로 위쪽 높이를 구한 뒤, 길이비로 아래쪽 높이를 연결하세요. 길이는 양수지만 C의 y좌표는 음수입니다.',
    steps: (v, m) => [T`AB의 길이는 $${F(2 * v.t)}$이고, O에서 AB까지 높이는 $a\times${F(v.t ** 2)}$입니다.`, T`넓이 $${F(v.area)}=\frac12\times${F(2 * v.t)}\times a\times${F(v.t ** 2)}$에서 $a=${F(m.a)}$입니다.`, T`$CD=BD\times\frac{${F(v.down)}}{${F(v.up)}}$이고 C는 x축 아래이므로 $b=${F(m.beta)}$입니다.`, T`따라서 $a+b=${F(m.sum)}$입니다.`],
    answer: (v, m) => T`$a=${F(m.a)},\ b=${F(m.beta)},\ a+b=${F(m.sum)}$`,
    draw(b, v, m, ctx) { M.polygon(b, [m.A, m.B, m.O]); plot(b, m); plot(b, m.lower, { color: 'rose' }); [m.A, m.B, m.C, m.D].forEach((q, i) => M.point(b, q, ['A', 'B', 'C', 'D'][i], { color: i === 2 ? 'rose' : 'green', dx: i === 0 ? -14 : 14 })); if (ctx.step >= 2) { b.seg(m.B, m.D, { color: 'green', width: 4 }); b.seg(m.D, m.C, { color: 'rose', width: 4 }); } if (ctx.solved) { M.label(b, P(v.t, m.B.y / 2), `BD ${N(m.B.y)}`, { dx: 20, align: 'left', color: 'green' }); M.label(b, P(v.t, m.C.y / 2), `CD ${scalarLabel(-m.C.y)}`, { dx: 20, align: 'left', color: 'rose' }); } },
    voice: ['삼각형의 밑변과 높이를 읽어요.', '넓이에서 위 포물선의 계수를 구해요.', '길이비를 아래쪽 높이에 적용해요.', 'C의 음의 좌표를 넣어 b를 구해요.'],
    verify: (v, m) => [...verifyPara(m), Math.abs((m.B.x - m.A.x) * m.B.y / 2 - v.area) > 1e-8 && '주어진 넓이 불일치', Math.abs(m.B.y / -m.C.y - v.up / v.down) > 1e-8 && '길이비 불일치', Math.abs(m.lower.a * m.C.x ** 2 - m.C.y) > 1e-8 && 'C 대입 불일치'].filter(Boolean)
  });

  const radical = value => Number.isInteger(Math.sqrt(value)) ? F(Math.sqrt(value)) : T`\sqrt{${F(value)}}`;
  add({ id: 'moving-area', tier: 'advanced', title: '움직이는 두 점과 삼각형 넓이',
    source: source(['Q18'], [R('22_연향중_1학기_기말_중3_기출c', 19)]),
    vars: { time: variable('움직인 시간 t(초)', 2, 0, 10, 0.25), target: variable('목표 넓이(cm²)', 35, 20, 35) }, state: { mode: 'geometry' },
    presets: [{ label: '도형에서 보기', values: { mode: 'geometry' } }, { label: '넓이 그래프로 보기', values: { mode: 'graph' } }],
    axes: v => v.mode === 'geometry' ? { xLabel: 'x(cm)', yLabel: 'y(cm)' } : { xLabel: 't(초)', yLabel: 'S(cm²)' },
    model: v => ({ A: P(0, 12), B: P(0, 0), C: P(20, 0), D: P(20, 12), P: P(0, 12 - v.time), Q: P(2 * v.time, 0), area: v.time * (12 - v.time), early: 6 - Math.sqrt(36 - v.target), late: 6 + Math.sqrt(36 - v.target), radicand: 36 - v.target }),
    focus: (v, m) => v.mode === 'geometry' ? M.box([m.A, m.B, m.C, m.D], { pad: 2, minSpan: 16 }) : { x: [-1.5, 12.5], y: [-4, 42] },
    question: v => T`가로 20cm, 세로 12cm인 직사각형에서 P는 A에서 B로 초속 1cm, Q는 B에서 C로 초속 2cm로 움직입니다. $0\le t\le10$에서 $\triangle BPQ$의 넓이가 $${F(v.target)}\mathrm{cm}^2$가 되는 첫 시각을 구하세요.`,
    guide: '시간을 바꾸어 두 점과 삼각형을 움직이세요. 보기 버튼으로 넓이와 시간의 그래프를 연결할 수 있습니다.',
    steps: (v, m) => [T`t초 후 $BP=12-t$, $BQ=2t$이며 두 점이 움직이는 범위는 $0\le t\le10$입니다.`, T`넓이는 $S=\frac12(12-t)\times2t=12t-t^2$입니다.`, T`$12t-t^2=${F(v.target)}$를 정리하면 $(t-6)^2=${F(m.radicand)}$입니다.`, T`$t=6\pm${radical(m.radicand)}$ 중 첫 시각은 $${Number.isInteger(m.early) ? F(m.early) : `6-${radical(m.radicand)}`}\text{초}$입니다. 두 값 모두 이동 범위 안입니다.`],
    answer: (v, m) => T`첫 시각 $${Number.isInteger(m.early) ? F(m.early) : `6-${radical(m.radicand)}`}\text{초}$`,
    draw(b, v, m, ctx) {
      if (v.mode === 'geometry') { b.poly([m.A, m.B, m.C, m.D], { color: 'muted', width: 2 }); M.polygon(b, [m.B, m.P, m.Q]); [m.A, m.B, m.C, m.D].forEach((q, i) => M.point(b, q, ['A', 'B', 'C', 'D'][i], { color: 'muted', dx: i < 2 ? -12 : 12 })); M.point(b, m.Q, 'Q', { color: 'green', dy: 20 }); onCurve(b, ctx, 'P', m.P, q => ({ time: 12 - q.y })); if (ctx.step >= 2) { M.label(b, P(0, m.P.y / 2), `12−t = ${N(m.P.y)}`, { dx: 14, align: 'left', color: 'amber' }); M.label(b, P(m.Q.x / 2, 0), `2t = ${N(m.Q.x)}`, { dy: -18, color: 'green' }); } }
      else { M.curve(b, t => t * (12 - t), { from: 0, to: 10 }); b.hline(v.target, { color: 'rose', dash: [5, 4] }); onCurve(b, ctx, 'T', P(v.time, m.area), q => ({ time: q.x })); if (ctx.step >= 3) { M.point(b, P(m.early, v.target), 'E', { color: 'green', dx: -15 }); M.point(b, P(m.late, v.target), 'L', { color: 'green', dx: 15 }); } if (ctx.solved) M.label(b, P(m.early, v.target), `${Number.isInteger(m.early) ? '' : '≈'}${N(m.early)}초`, { color: 'green', dy: 28 }); }
    },
    readouts: (v, m) => [{ label: '지금의 시간', value: T`$${F(v.time)}\text{초}$`, color: 'amber' }, { label: '지금의 삼각형 넓이', value: T`$${F(m.area)}\mathrm{cm}^2$`, color: 'green' }],
    lessonFinish: (v, m) => ({ to: { time: m.early }, dur: 2, say: '첫 시각의 도형으로 이동해요.',
      confirm: T`$t=${Number.isInteger(m.early) ? F(m.early) : `6-${radical(m.radicand)}`}\text{초}$, $S=${F(v.target)}\mathrm{cm}^2$입니다.` }),
    voice: ['움직이는 동안의 두 길이를 나타내요.', '직각삼각형의 넓이를 식으로 써요.', '목표 넓이를 대입해 제곱식으로 바꿔요.', '이동 범위 안에서 먼저 만나는 때예요.'],
    verify: (v, m) => [Math.abs(m.P.y * m.Q.x / 2 - m.area) > 1e-8 && '도형 넓이 불일치', ...[m.early, m.late].map(t => (Math.abs(t * (12 - t) - v.target) > 1e-8 || t < 0 || t > 10) && '넓이 조건 해 불일치')].filter(Boolean)
  });

  add({ id: 'vertex-conditions', tier: 'advanced', title: '꼭짓점의 조건으로 식 결정',
    source: source(['Q15'], [R('26_삼산중_1학기_기말_중3_기출', 13), R('26_삼산중_1학기_기말_중3_기출', 14)]),
    vars: { a: variable('축 조건: 이차항 계수', 2, 1, 3), b: variable('축 조건: 일차항 계수', 12, 4, 12, 2), otherX: variable('두 꼭짓점: 오른쪽 x좌표', 3, 2, 4) }, state: { mode: 'axis' },
    presets: [{ label: '꼭짓점이 x축 위', values: { mode: 'axis' } }, { label: '두 꼭짓점을 잇는 직선', values: { mode: 'join' } }],
    model: v => { if (v.mode === 'axis') { const p = -v.b / (2 * v.a), m = parabola(v.a, p, 0); return { ...m, k: m.c }; } const height = 2 - v.otherX; return { ...parabola(-0.5, 1, height), other: parabola(0.2, v.otherX, 1), height, sum: height + v.otherX, slope: 1 }; },
    focus: (v, m) => v.mode === 'axis' ? focus(m, [], 1.5) : M.box([m.V, m.other.V, P(-1, y(m, -1)), P(v.otherX + 2, y(m.other, v.otherX + 2))], { pad: 2, minSpan: 10 }),
    question: (v, m) => v.mode === 'axis' ? T`$y=${polynomial(v.a, v.b, 0)}+k$의 꼭짓점이 x축 위에 있습니다. 상수 k를 구하세요.` : T`$y=-\frac12(x-1)^2+A$와 $y=\frac15(x-B)^2+1$의 꼭짓점을 잇는 직선의 기울기가 1이고 $B>1$입니다. $A+B$를 구하세요.`,
    guide: '조건 보기를 바꾸어 꼭짓점이 축 위에 있는 경우와 두 꼭짓점이 한 직선 위에 있는 경우를 비교하세요. 각 경우에서 필요한 정보만 사용합니다.',
    steps: (v, m) => v.mode === 'axis' ? [T`완전제곱식으로 바꾸면 $y=${F(v.a)}${shifted(m.p)}^2+k-${F(m.k)}$입니다.`, T`꼭짓점의 x좌표는 $${F(m.p)}$입니다.`, T`꼭짓점이 x축 위에 있으므로 y좌표 $k-${F(m.k)}=0$입니다.`, T`따라서 $k=${F(m.k)}$입니다.`] : [T`두 꼭짓점의 좌표는 $(1,A)$, $(B,1)$입니다.`, T`가로 변화량은 $B-1$, 세로 변화량은 $1-A$입니다.`, T`기울기가 1이므로 $1-A=B-1$입니다.`, T`따라서 $A+B=2$입니다.`],
    answer: (v, m) => v.mode === 'axis' ? T`$k=${F(m.k)}$` : '$A+B=2$',
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx); if (v.mode === 'join') { plot(b, m.other, { color: 'green' }); M.point(b, m.other.V, 'W', { color: 'green', dx: 15 }); if (ctx.step >= 2) { b.seg(m.V, m.other.V, { color: 'rose', width: 2.5 }); M.riseRun(b, m.V, m.other.V, { color: 'amber' }); } } else if (ctx.step >= 2) b.vline(m.p, { color: 'amber', dash: [5, 4] }); },
    voice: ['조건을 꼭짓점의 좌표로 바꿔요.', '축이나 직선과의 관계를 표시해요.', '꼭짓점의 좌표에 조건을 대입해요.', '구한 값으로 원래 조건을 확인해요.'],
    verify: (v, m) => [...verifyPara(m), v.mode === 'axis' ? (Math.abs(v.a * m.p ** 2 + v.b * m.p + m.k) > 1e-8 && 'x축 꼭짓점 조건 불일치') : (Math.abs((m.other.q - m.q) / (m.other.p - m.p) - 1) > 1e-8 && '두 꼭짓점 기울기 불일치')].filter(Boolean)
  });

  function intersectionText(m, which) {
    const x = which === 'left' ? m.x1 : m.x2;
    if (Number.isInteger(Math.sqrt(m.square))) return F(x);
    return T`\frac{${F(m.slope)}${which === 'left' ? '-' : '+'}${radical(m.square)}}{2}`;
  }
  function intersectionHeightText(m, which) {
    if (m.slope === 0) return F(m.intercept);
    const radicalCoefficient = (which === 'left' ? -1 : 1) * m.slope;
    return T`\frac{${F(m.slope ** 2 + 2 * m.intercept)}${term(radicalCoefficient, radical(m.square))}}{2}`;
  }
  add({ id: 'intersections', tier: 'advanced', title: '직선과 포물선의 교점',
    source: source(['Q16'], [R('16_오성중_1학기_기말_중3_수학', 15)]),
    vars: { slope: variable('직선의 기울기', 1, -2, 2), intercept: variable('직선의 y절편', 2, 1, 4) },
    presets: [{ label: '정수 교점', values: { slope: 1, intercept: 2 } }, { label: '수평선', values: { slope: 0, intercept: 4 } }, { label: '반대 기울기', values: { slope: -1, intercept: 2 } }],
    model: v => { const square = v.slope ** 2 + 4 * v.intercept, x1 = (v.slope - Math.sqrt(square)) / 2, x2 = (v.slope + Math.sqrt(square)) / 2; return { ...parabola(1, 0, 0), slope: v.slope, intercept: v.intercept, square, x1, x2, A: P(x1, x1 * x1), B: P(x2, x2 * x2) }; },
    focus: (v, m) => M.box([m.V, m.A, m.B, P(0, v.intercept)], { pad: 2, minSpan: 8 }),
    question: v => T`$y=x^2$과 $y=${(term(v.slope, 'x') + term(v.intercept)).replace(/^\+/, '')}$의 교점 좌표를 구하세요.`,
    guide: '교점에서는 두 그래프의 y값이 같습니다. 현재의 구체적인 방정식을 완전제곱식으로 바꾸어 두 해를 찾습니다.',
    steps: (v, m) => [T`교점에서는 $x^2=${(term(v.slope, 'x') + term(v.intercept)).replace(/^\+/, '')}$입니다.`, T`양변을 정리해 완전제곱식으로 만들면 $(2x${term(-v.slope)})^2=${F(m.square)}$입니다.`, T`따라서 $x=${intersectionText(m, 'left')}$ 또는 $x=${intersectionText(m, 'right')}$입니다.`, T`각 x값을 $y=x^2$에 넣으면 두 교점의 y좌표가 정해집니다.`],
    answer: (v, m) => Number.isInteger(Math.sqrt(m.square)) ? T`$(${F(m.A.x)},${F(m.A.y)}),\ (${F(m.B.x)},${F(m.B.y)})$` : T`A $\left(${intersectionText(m, 'left')},${intersectionHeightText(m, 'left')}\right)$<br>B $\left(${intersectionText(m, 'right')},${intersectionHeightText(m, 'right')}\right)$`,
    draw(b, v, m, ctx) { plot(b, m); M.line(b, v.slope, v.intercept, { color: 'green' }); M.point(b, m.A, 'A', { color: 'amber', dx: -16 }); M.point(b, m.B, 'B', { color: 'amber', dx: 16 }); if (ctx.step >= 2) { M.projection(b, m.A); M.projection(b, m.B); } if (ctx.solved) { M.label(b, m.A, pairLabel(m.A), { dx: -10, dy: -28 }); M.label(b, m.B, pairLabel(m.B), { dx: 10, dy: -28 }); } },
    voice: ['교점에서는 두 높이가 같아요.', '같은 식으로 놓고 제곱식으로 바꿔요.', '양수와 음수의 두 경우를 풀어요.', '각 x를 대입해 좌표를 완성해요.'],
    verify: (v, m) => [...verifyPara(m), ...[m.A, m.B].map(q => Math.abs(q.y - v.slope * q.x - v.intercept) > 1e-8 && '직선 교점 불일치'), !(m.x1 < m.x2) && '서로 다른 교점 누락'].filter(Boolean)
  });

  add({ id: 'context-model', tier: 'advanced', title: '상황을 이차식과 그래프로 연결',
    source: source(['Q20'], [R('25_풍덕중_1학기_기말_중3_기출c', 24), R('26_왕운중_1학기_기말_중3_기출', 17), R('22_신흥중_1학기_기말_중3_기출c', 19)]),
    vars: { time: variable('공: 시간(초)', 3, 0, 4, 0.25), initial: variable('공: 처음 높이(m)', 0.8, 0.8, 3.2, 0.2), speed: variable('차: 속력(km/h)', 40, 10, 80, 10), width: variable('직사각형: 가로(cm)', 1, 0.5, 3.5, 0.5) }, state: { mode: 'height' }, aspect: 'free',
    presets: [{ label: '공의 높이', values: { mode: 'height' } }, { label: '제동 거리', values: { mode: 'braking' } }, { label: '직사각형 넓이', values: { mode: 'area' } }],
    axes: v => v.mode === 'height' ? { xLabel: 't(초)', yLabel: 'h(m)' } : v.mode === 'braking' ? { xLabel: 'v(km/h)', yLabel: 'd(m)' } : { xLabel: 'x(cm)', yLabel: 'S(cm²)' },
    model: v => v.mode === 'height' ? { value: -5 * v.time ** 2 + 20 * v.time + v.initial, A: P(v.time, -5 * v.time ** 2 + 20 * v.time + v.initial), start: P(0, v.initial) } : v.mode === 'braking' ? { coefficient: 4 / 20 ** 2, value: v.speed ** 2 / 100, A: P(v.speed, v.speed ** 2 / 100), given: P(20, 4) } : { height: 4 - v.width, value: v.width * (4 - v.width), A: P(v.width, v.width * (4 - v.width)) },
    focus: v => v.mode === 'height' ? { x: [-0.5, 4.5], y: [-2, 26] } : v.mode === 'braking' ? { x: [-8, 88], y: [-6, 72] } : { x: [-0.5, 4.5], y: [-0.5, 5] },
    question: v => v.mode === 'height' ? T`공의 높이가 $h=-5t^2+20t+${F(v.initial)}$(m)로 주어집니다. $t=${F(v.time)}$초일 때 높이를 구하세요.` : v.mode === 'braking' ? T`차의 제동 거리가 속력의 제곱에 정비례합니다. 속력 20km/h일 때 제동 거리가 4m라면, 속력 $${F(v.speed)}$km/h에서 제동 거리를 구하세요.` : T`둘레가 8cm인 직사각형의 가로가 xcm일 때 넓이 S를 x의 식으로 나타내고, $x=${F(v.width)}$일 때 넓이를 구하세요.`,
    guide: '상황 버튼으로 세 가지 모델을 비교하세요. 세로축의 양과 단위를 먼저 읽고, 해당 상황의 막대만 조절합니다.',
    steps: (v, m) => v.mode === 'height' ? [T`t는 초, h는 m이며 처음 높이는 $${F(v.initial)}$m입니다.`, T`$h=-5\times(${F(v.time)})^2+20\times${F(v.time)}+${F(v.initial)}$입니다.`, T`현재 그래프의 가로좌표 $${F(v.time)}$에서 높이를 확인합니다.`, T`공의 높이는 $${F(m.value)}$m입니다.`] : v.mode === 'braking' ? [T`속력의 제곱에 정비례하므로 $d=kv^2$로 놓습니다.`, T`$4=k\times20^2$에서 $k=\frac1{100}$입니다.`, T`따라서 $d=\frac1{100}v^2$이고 $v=${F(v.speed)}$를 넣습니다.`, T`제동 거리는 $${F(m.value)}$m입니다.`] : [T`가로와 세로의 합이 4이므로 세로는 $4-x$cm입니다.`, T`넓이는 $S=x(4-x)=-x^2+4x$입니다. 실제 길이의 범위는 $0<x<4$입니다.`, T`$x=${F(v.width)}$이면 세로는 $${F(m.height)}$cm입니다.`, T`넓이는 $${F(v.width)}\times${F(m.height)}=${F(m.value)}\mathrm{cm}^2$입니다.`],
    answer: (v, m) => v.mode === 'height' ? T`$${F(m.value)}\mathrm m$` : v.mode === 'braking' ? T`$${F(m.value)}\mathrm m$` : T`$S=-x^2+4x$, 넓이 $${F(m.value)}\mathrm{cm}^2$`,
    draw(b, v, m, ctx) { if (v.mode === 'height') { M.curve(b, x => -5 * x * x + 20 * x + v.initial, { from: 0, to: 4 }); M.point(b, m.start, '처음', { color: 'muted', dx: 15 }); onCurve(b, ctx, 'T', m.A, q => ({ time: q.x })); } else if (v.mode === 'braking') { M.curve(b, x => x * x / 100, { from: 0, to: 80 }); M.point(b, m.given, '조건', { color: 'green', dx: -18 }); onCurve(b, ctx, 'V', m.A, q => ({ speed: q.x })); } else { M.curve(b, x => x * (4 - x), { from: 0, to: 4 }); onCurve(b, ctx, 'W', m.A, q => ({ width: q.x })); } if (ctx.step >= 2) M.projection(b, m.A); if (ctx.solved) M.label(b, m.A, `${scalarLabel(m.value)}${v.mode === 'area' ? 'cm²' : 'm'}`, { color: 'amber', dy: -28 }); },
    voice: ['가로축과 세로축의 양을 읽어요.', '상황의 관계를 식으로 나타내요.', '현재 입력을 식과 그래프에 넣어요.', '계산한 값에 단위를 붙여 답해요.'],
    verify: (v, m) => [Math.abs(m.A.y - m.value) > 1e-8 && '상황 점 불일치', v.mode === 'height' && m.value < 0 && '관찰 범위 높이 불일치', v.mode === 'braking' && Math.abs(m.coefficient * 20 ** 2 - 4) > 1e-8 && '제동 거리 조건 불일치', v.mode === 'area' && Math.abs(2 * (v.width + m.height) - 8) > 1e-8 && '둘레 조건 불일치'].filter(Boolean)
  });

  add({ id: 'translation-area', tier: 'advanced', title: '평행이동한 곡선 사이의 넓이',
    source: source(['Q21'], [R('17_연향중_1학기_기말_중3_수학', 23), R('17_연향중_1학기_기말_중3_수학', 24)]),
    vars: { left: variable('왼쪽 경계 x좌표', -1, -2, 0), right: variable('오른쪽 경계 x좌표', 2, 1, 3), gap: variable('아래로 옮긴 길이', 3, 1, 4) },
    model: v => { const upper = parabola(1, 1, -1), lower = parabola(1, 1, -1 - v.gap); return { ...upper, lower, A: P(v.left, y(upper, v.left)), B: P(v.right, y(upper, v.right)), C: P(v.right, y(lower, v.right)), D: P(v.left, y(lower, v.left)), width: v.right - v.left, area: (v.right - v.left) * v.gap }; },
    focus: (v, m) => M.box([m.A, m.B, m.C, m.D, m.V, m.lower.V], { pad: 2, minSpan: 9 }),
    question: v => T`$y=x^2-2x$와 이를 아래로 $${F(v.gap)}$만큼 옮긴 그래프, 두 직선 $x=${F(v.left)}$, $x=${F(v.right)}$로 둘러싸인 부분의 넓이를 구하세요.`,
    guide: '두 곡선의 세로 간격은 일정합니다. 공통된 큰 영역에서 합동인 두 곡선 조각을 각각 빼면 목표 영역과 평행사변형의 넓이가 같습니다.',
    steps: (v, m) => [T`각 x에서 위·아래 두 점 사이의 세로 거리는 항상 $${F(v.gap)}$입니다.`, T`위쪽 끝점끼리, 아래쪽 끝점끼리 선분을 그으면 서로 평행한 두 선분이 됩니다.`, '위쪽 선분 AB와 아래쪽 곡선 사이를 큰 영역으로 봅니다. 여기서 위 곡선의 조각을 빼면 목표 영역, 아래 곡선의 합동인 조각을 빼면 평행사변형이 남으므로 넓이가 같습니다.', T`세로 변을 밑변으로 보면 길이가 $${F(v.gap)}$, 수평 높이가 $${F(m.width)}$이므로 넓이는 $${F(m.area)}$입니다.`],
    captions: (v, m) => [T`세로 간격은 $${F(v.gap)}$로 일정해요.`, '위·아래 끝점을 잇는 선분은 평행해요.', '같은 큰 영역에서 합동인 조각을 빼요.', T`넓이는 $${F(v.gap)}\times${F(m.width)}=${F(m.area)}$예요.`],
    answer: (v, m) => T`넓이 $${F(v.gap)}\times${F(m.width)}=${F(m.area)}$`,
    draw(b, v, m, ctx) { const top = [], bottom = []; for (let i = 0; i <= 80; i++) { const x = v.left + (v.right - v.left) * i / 80; top.push(P(x, y(m, x))); bottom.push(P(x, y(m.lower, x))); } M.polygon(b, [...top, ...bottom.slice().reverse()], { width: 0.5 }); plot(b, m); plot(b, m.lower, { color: 'rose' }); b.seg(m.A, m.D, { color: 'amber', width: 3 }); b.seg(m.B, m.C, { color: 'amber', width: 3 }); [m.A, m.B, m.C, m.D].forEach((q, i) => M.point(b, q, ['A', 'B', 'C', 'D'][i], { color: 'amber', dx: i === 0 || i === 3 ? -15 : 15 })); if (ctx.step >= 2) { b.seg(m.A, m.B, { color: 'green', dash: [5, 4] }); b.seg(m.D, m.C, { color: 'green', dash: [5, 4] }); } if (ctx.step >= 3) { M.polygon(b, [...top, m.A], { color: 'amber', fill: 'amber', fillAlpha: 0.17, width: 1 }); M.polygon(b, [...bottom, m.D], { color: 'amber', fill: 'amber', fillAlpha: 0.17, width: 1 }); } if (ctx.solved) M.polygon(b, [m.A, m.B, m.C, m.D], { color: 'green', fillAlpha: 0.2, dash: [5, 4] }); },
    voice: ['두 곡선의 세로 간격은 같아요.', '대응하는 끝점끼리 선분을 그어요.', '합동인 조각을 각각 빼서 넓이를 비교해요.', '평행사변형의 밑변과 높이를 곱해요.'],
    verify: (v, m) => [...verifyPara(m), ...[v.left, (v.left + v.right) / 2, v.right].map(x => Math.abs(y(m, x) - y(m.lower, x) - v.gap) > 1e-8 && '평행이동 간격 불일치'), Math.abs((m.A.y - m.D.y) * (m.B.x - m.A.x) - m.area) > 1e-8 && '평행사변형 넓이 불일치'].filter(Boolean)
  });

  add({ id: 'extremum-2027', tier: 'concept', title: '2027 보충 · 최댓값과 최솟값',
    source: { kind: 'supplement', types: ['M3-Q22'], refs: [], label: '2027 중3 적용 · 2022 개정 교육과정 보충', reason: '2022 개정 성취기준 9수02-22의 전실수 범위 최댓값·최솟값. 2026 중3의 2015 교육과정 필수 장면과 구분.' },
    vars: { mag: variable('계수의 절댓값', 1, 0.5, 3, 0.5), p: variable('꼭짓점 x좌표', 1, -3, 3), q: variable('꼭짓점 y좌표', -2, -3, 3) }, state: { sign: 1 },
    presets: [{ label: '위로 열린 포물선', values: { sign: 1 } }, { label: '아래로 열린 포물선', values: { sign: -1 } }],
    model: shape, focus: (v, m) => focus(m, [], 2),
    question: (v, m) => T`[2027 중3 보충] x가 모든 실수를 가질 때 $y=${vertexFormula(m)}$의 최댓값 또는 최솟값을 알아보세요.`,
    guide: '2022 개정 교육과정의 중3 적용은 2027년부터입니다. 이 장면은 x의 범위를 제한하지 않고 꼭짓점에서의 값을 탐구합니다.',
    steps: (v, m) => [T`모든 실수 x에 대해 $${shifted(m.p)}^2\ge0$입니다.`, T`계수 $a=${F(m.a)}$이므로 $a${shifted(m.p)}^2${m.a > 0 ? T`\ge` : T`\le`}0$입니다.`, T`따라서 $y${m.a > 0 ? T`\ge` : T`\le`}${F(m.q)}$이고, $x=${F(m.p)}$에서 등호가 성립합니다.`, T`${m.a > 0 ? '최솟값' : '최댓값'}은 $${F(m.q)}$입니다. x가 모든 실수이므로 ${m.a > 0 ? '최댓값' : '최솟값'}은 없습니다.`],
    answer: (v, m) => T`$x=${F(m.p)}$에서 ${m.a > 0 ? '최솟값' : '최댓값'} $${F(m.q)}$ · ${m.a > 0 ? '최댓값' : '최솟값'} 없음`,
    draw(b, v, m, ctx) { plot(b, m); vertex(b, m, ctx, true); if (ctx.step >= 2) b.hline(m.q, { color: 'amber', dash: [5, 4] }); },
    voice: ['x는 모든 실수라고 가정해요.', '제곱한 값은 항상 0 이상이에요.', '계수의 부호에 맞게 높이를 비교해요.', '꼭짓점에서 경계값을 갖는지 확인해요.']
  });

  M.register({ id: 'g9-quadratic-functions', title: '이차함수 탐구', course: 'g9', courseName: '중3', unit: '이차함수와 그래프', description: '포물선의 변화에서 좌표·넓이·조건 추론까지 이어지는 개념·기본·심화 탐구', scenes });
})();
