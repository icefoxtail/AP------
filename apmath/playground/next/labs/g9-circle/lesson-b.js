/* 원의 성질 B — 원문 내접원·접선·원주각의 모든 문제 유형을 고정하여 재생합니다. */
(function () {
  'use strict';
  const G = window.APL_CI;
  if (!G) return;
  const ids = ['c3-1', 'c3-2', 'c3-3', 'c3-4', 'c3-5', 'c3-6',
    'c4-1', 'c4-2', 'c4-3', 'c4-4', 'c4-5', 'c4-6', 'c4-7', 'c4-8'];
  const scenes = (window.APL_CI_GROUPS || []).flatMap(group => group.scenes);
  const defs = Object.fromEntries(ids.map(id => [id, scenes.find(scene => scene.id === id).ci]));
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g9-circle'] = window.APL_LESSONS['g9-circle'] || {};
  const n = G.nt, degree = v => `${n(v)}^{\\circ}`;
  function source(id, variant = 0, seed = 1) {
    const pk = G.fixedPk(id, variant, seed), s = { ciPk: pk, ciN: variant, ciSeed: 0 };
    defs[id].init(s);
    return { pk, variant, solution: G.currentSolution(defs[id], s) };
  }
  const correct = fixture => fixture.solution.question.choices.find(choice => choice.ok);
  const ordinal = fixture => G.NUM[fixture.solution.question.choices.findIndex(choice => choice.ok)];
  const answerLine = fixture => `따라서 $${fixture.solution.target}=${correct(fixture).t}$, 정답은 ${ordinal(fixture)}이에요.`;
  function add(id, label, fixture, lines, options = {}) {
    const initial = {}; defs[id].init(initial);
    Object.assign(initial, options.initial || {});
    const start = { ...Object.fromEntries(Object.entries(initial).filter(([, value]) => typeof value === 'number')), ciBTrace: 0 };
    const sets = Object.fromEntries(Object.entries(initial).filter(([, value]) => typeof value !== 'number'));
    const concept = !!options.concept;
    const final = concept ? lines[6] : lines[6] || answerLine(fixture);
    const item = { title: label, label, tab: 'review', answer: concept ? options.answer : ordinal(fixture),
      answerText: concept ? options.answer : `${ordinal(fixture)} $${correct(fixture).t}$`,
      summary: concept ? options.answer : `$${fixture.solution.target}=${correct(fixture).t}$`,
      task: '직접 해 보기에서 길이와 각을 바꾸고 같은 성질이 유지되는지 확인해 보세요',
      chapters: [
        { title: '조건과 구할 부분', length: 12, start, cues: [
          { at: 0, say: lines[0], step: 0, set: { ...sets, ciPk: fixture.pk, ciN: fixture.variant, ciSeed: 0,
            ciLessonProblem: !concept, ciLessonSource: options.source !== false,
            ciShowAnswer: false, ciCalculationReady: false,
            ciBQuestion: options.question || '', ciBUnknown: options.unknown || '?', ciBMode: options.mode || '' } },
          { at: .1, to: { ciBTrace: 1, ...(options.firstMotion || {}) }, dur: 4 },
          { at: 6, say: lines[1], step: 1 }
        ] },
        { title: '성질과 풀이 전략', length: 12, cues: [
          { at: 0, say: lines[2], step: 2 }, { at: 6, say: lines[3] }
        ] },
        { title: '식과 계산', length: 12, cues: [
          { at: 0, say: lines[4], step: 3, set: { ciCalculationReady: true } },
          { at: 6, say: lines[5], step: 4 }
        ] },
        { title: '결론과 답 확인', length: 12, cues: [
          { at: 0, say: final, step: fixture.solution.steps.length, set: { ciShowAnswer: true, ...(options.finalSet || {}) } },
          { at: 6, say: lines[7] }
        ] }
      ] };
    (lessons[id] = lessons[id] || []).push(item);
    return item;
  }
  const concept = (id, label, fixture, answer, question, lines, options = {}) => add(id, label, fixture, lines,
    { ...options, concept: true, answer, question });

  {
    const id = 'c3-1';
    concept(id, '접선 원리', source(id), '$AD=AF,\\ BD=BE,\\ CE=CF$',
      '원 O가 삼각형의 세 변에 접해요. 같은 꼭짓점에서 접점까지의 두 길이는 어떤 관계일까요?', [
        'D, E, F는 원과 세 변이 만나는 접점이에요.', 'A에서 원에 그은 두 접선은 AD와 AF예요.',
        '접점까지의 반지름은 접선과 수직이에요.', '두 직각삼각형은 빗변 AO와 반지름이 같아요.',
        '합동인 삼각형에서 나머지 변도 같아요.', 'B와 C에서도 같은 방법으로 접선을 짝지어요.',
        '따라서 $AD=AF$, $BD=BE$, $CE=CF$예요.', '같은 꼭짓점에서 출발한 접선끼리 비교해요.'
      ], { unknown: 'AD' });
    concept(id, '둘레 원리', source(id, 2), '$P=2(AD+BE+CF)$',
      '접점까지의 세 길이 AD, BE, CF를 알면 삼각형의 둘레 P는 어떻게 나타낼까요?', [
        '세 변이 접점에서 두 부분으로 나뉘어요.', '각 꼭짓점에서 그은 두 접선의 길이가 같아요.',
        '$AB=AD+BD$, $BC=BE+CE$예요.', '$CA=CF+AF$도 같은 방법으로 나누어요.',
        '세 변을 합하면 각 접선 길이가 두 번 나와요.', '같은 눈금이 붙은 길이끼리 모아 정리해요.',
        '따라서 $P=2(AD+BE+CF)$예요.', '둘레는 원의 둘레가 아닌 삼각형 세 변의 합이에요.'
      ], { unknown: 'P' });
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk, ab = q.x + q.y, bc = q.y + q.z, ca = q.x + q.z;
      const lines = k === 0 ? [
        `$AB=${ab}$, $BC=${bc}$, $CA=${ca}$예요.`, 'A에서 접점 D까지의 길이를 구해요.',
        '$AD=AF$, $BD=BE$, $CE=CF$예요.', 'AB와 CA를 더하고 BC를 빼 보아요.',
        '$AB+CA-BC=2AD$로 정리돼요.', `$AD=(${ab}+${ca}-${bc})\\div2$를 계산해요.`,
        answerLine(f), '같은 접선 길이가 서로 없어지는 것을 확인해요.'
      ] : k === 1 ? [
        `$BC=${bc}$, $CA=${ca}$, $BD=${q.y}$예요.`, 'BC를 먼저 접점 E에서 둘로 나누어요.',
        `$BE=BD=${q.y}$예요.`, `$CE=BC-BE=${bc}-${q.y}=${q.z}$예요.`,
        `$CF=CE=${q.z}$이고 $AD=AF$예요.`, `$AD=CA-CF=${ca}-${q.z}$를 계산해요.`,
        answerLine(f), '접선을 따라 주어진 길이를 차례로 옮겨요.'
      ] : [
        `$AD=${q.x}$, $BE=${q.y}$, $CF=${q.z}$예요.`, '구할 값은 삼각형 ABC의 둘레예요.',
        '각 꼭짓점에서 그은 접선은 두 개씩 같아요.', '세 변을 접점에서 나누어 더해요.',
        '$P=2(AD+BE+CF)$예요.', `$P=2(${q.x}+${q.y}+${q.z})$를 계산해요.`,
        answerLine(f), '둘레의 단위는 길이의 단위와 같아요.'
      ];
      add(id, ['세변→접선', '접선 차례', '둘레 계산'][k], f, lines);
    }
  }
  {
    const id = 'c3-2';
    concept(id, '반지름 원리', source(id), '$r=\\frac{AB+BC-AC}{2}$',
      'B가 직각인 삼각형의 내접원 반지름 r을 세 변의 길이로 어떻게 나타낼까요?', [
        '직각을 낀 두 변에 반지름을 내려요.', 'BDOE는 네 각이 직각이고 이웃변이 같아요.',
        '정사각형이므로 $BD=BE=r$예요.', '같은 접선끼리 묶어 $AF=AB-r$로 놓아요.',
        '또 $CF=BC-r$이고 $AC=AF+CF$예요.', '$AC=AB+BC-2r$에서 r만 남겨요.',
        '따라서 $r=\\frac{AB+BC-AC}{2}$예요.', '두 직각변의 합에서 빗변을 빼고 반으로 나눠요.'
      ], { unknown: 'r' });
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk, r = (q.p + q.q - q.h) / 2;
      add(id, ['두변→반지름', '빗변→반지름', '반지름→빗변'][k], f, [
        k === 0 ? `$AB=${q.p}$, $BC=${q.q}$이고 B가 직각이에요.` : k === 1 ? `$AB=${q.p}$, 빗변 $AC=${q.h}$예요.` : `$AB=${q.p}$, 반지름 $r=${n(r)}$예요.`,
        k === 2 ? 'BC를 모르는 길이로 두고 빗변 AC를 구해요.' : '구할 것은 내접원의 반지름 r이에요.',
        '접점까지의 두 길이 BD, BE는 r이에요.', '$AC=AB+BC-2r$로 접선 길이를 연결해요.',
        k === 0 ? `$AC=\\sqrt{${q.p}^{2}+${q.q}^{2}}=${q.h}$예요.` : k === 1 ? `$BC=\\sqrt{${q.h}^{2}-${q.p}^{2}}=${q.q}$예요.` : `$AC=BC+${n(q.p - 2 * r)}$를 피타고라스 식에 넣어요.`,
        k === 2 ? `$AC^2=${q.p}^{2}+BC^2$에서 $BC=${q.q}$예요.` : `$r=(${q.p}+${q.q}-${q.h})\\div2$를 계산해요.`,
        answerLine(f), k === 2 ? 'BC를 구한 뒤 처음의 접선 식에 다시 대입해요.' : '반지름은 양수이고 두 직각변보다 작아요.'
      ]);
    }
  }
  {
    const id = 'c3-3';
    for (const wantArea of [true, false]) {
      concept(id, wantArea ? '넓이 원리' : '반지름 원리', source(id, wantArea ? 1 : 0),
        wantArea ? '$S=\\frac12rP$' : '$r=\\frac{2S}{P}$',
        wantArea ? '내접원의 반지름 r과 삼각형의 둘레 P로 넓이 S를 어떻게 나타낼까요?' : '삼각형의 넓이 S와 둘레 P를 알면 내접원의 반지름 r은 얼마일까요?', [
          '중심 O를 삼각형의 세 꼭짓점과 이어요.', '삼각형이 작은 삼각형 세 개로 나뉘어요.',
          '각 변에 내린 높이는 모두 반지름 r이에요.', '각 넓이는 밑변에 r을 곱하고 반으로 나눠요.',
          '세 밑변을 합하면 삼각형의 둘레 P예요.', wantArea ? '공통인 높이 r을 묶어 넓이를 더해요.' : '$S=\\frac12rP$에서 양변에 2를 곱하고 P로 나눠요.',
          wantArea ? '따라서 $S=\\frac12rP$예요.' : '따라서 $r=\\frac{2S}{P}$예요.', '반지름은 세 변 모두에 수직인 높이예요.'
        ], { unknown: wantArea ? 'S' : 'r' });
    }
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk, p = q.a + q.b + q.c, area = p * q.r / 2, wantArea = k === 1;
      add(id, ['넓이→반지름', '반지름→넓이', '반지름 응용'][k], f, [
        `삼각형의 세 변은 ${q.a}, ${q.b}, ${q.c}예요.`, wantArea ? `내접원의 반지름은 ${q.r}이고 넓이를 구해요.` : `삼각형의 넓이는 ${area}이고 반지름을 구해요.`,
        '중심과 세 꼭짓점을 이어 넓이를 나누어요.', '각 작은 삼각형의 높이는 모두 r이에요.',
        `$P=${q.a}+${q.b}+${q.c}=${p}$예요.`,
        wantArea ? `$S=\\frac12\\times${q.r}\\times${p}$를 계산해요.` : `$r=\\frac{2\\times${area}}{${p}}$를 계산해요.`,
        answerLine(f), wantArea ? '세 삼각형의 넓이를 더한 값인지 확인해요.' : '둘레 P는 세 변을 모두 더한 길이예요.'
      ]);
    }
  }
  {
    const id = 'c3-4';
    concept(id, '맞은변 합', source(id), '$AB+CD=BC+DA$',
      '원의 네 접선으로 이루어진 사각형에서 마주 보는 두 변의 합은 어떤 관계일까요?', [
        '원은 사각형의 네 변에 모두 접해요.', '꼭짓점마다 두 접선에 같은 눈금을 붙여요.',
        'AB와 CD를 접점에서 나누어 더해요.', '네 꼭짓점의 접선 길이가 한 번씩 나와요.',
        'BC와 DA도 접점에서 나누어 더해요.', '앞에서 더한 네 길이가 다시 한 번씩 나와요.',
        '따라서 $AB+CD=BC+DA$예요.', '합이 같은 것은 서로 마주 보는 두 변이에요.'
      ], { unknown: 'DA' });
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk, e = { AB: q.a + q.b, BC: 2 * q.b, CD: q.a + q.b, DA: 2 * q.a }, target = ['DA', 'BC', 'CD'][k];
      const givens = Object.entries(e).filter(([key]) => key !== target);
      const calc = k === 0 ? `${e.AB}+${e.CD}-${e.BC}` : k === 1 ? `${e.AB}+${e.CD}-${e.DA}` : `${e.BC}+${e.DA}-${e.AB}`;
      add(id, `${target} 계산`, f, [
        `$${givens[0][0]}=${givens[0][1]}$, $${givens[1][0]}=${givens[1][1]}$예요.`, `$${givens[2][0]}=${givens[2][1]}$이고 ${target}를 구해요.`,
        '같은 꼭짓점에서 그은 접선끼리 같아요.', '접점에서 나누어 두 맞은변의 합을 비교해요.',
        '$AB+CD=BC+DA$를 사용해요.', `$${target}=${calc}$를 계산해요.`,
        answerLine(f), '네 변이 모두 원에 접한다는 조건이 필요해요.'
      ]);
    }
  }
  {
    const id = 'c3-5';
    concept(id, '높이 원리', source(id), '$AB=\\frac{2AD\\cdot BC}{AD+BC}$',
      '원에 외접하는 직각사다리꼴에서 AD와 BC를 알 때 높이 AB를 어떻게 구할까요?', [
        'AD와 BC는 평행하고 A, B는 직각이에요.', '높이 AB는 원의 지름과 같아요.',
        'AD를 a, BC를 b, AB를 h라 놓아요.', '외접사각형이므로 $CD=a+b-h$예요.',
        'D에서 직선 BC에 수선을 내려요.', '직각삼각형에서 $(a+b-h)^2=(b-a)^2+h^2$예요.',
        '정리하면 $AB=\\frac{2AD\\cdot BC}{AD+BC}$예요.', '반지름은 높이 AB의 절반이에요.'
      ], { unknown: 'h' });
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk, p = q.a + q.b, d = Math.abs(q.b - q.a), h = 2 * q.a * q.b / p;
      add(id, ['높이 계산', '빗변 계산', '반지름 계산'][k], f, [
        `$AD=${q.a}$, $BC=${q.b}$이고 두 변은 평행해요.`, `네 변이 원에 접하며 ${['높이 AB', '옆변 CD', '반지름 r'][k]}를 구해요.`,
        '높이 AB를 h라 두면 AB는 원의 지름이에요.', `$CD=${p}-h$이고 두 밑변의 차는 ${d}예요.`,
        `$(${p}-h)^2=${d}^{2}+h^2$로 놓아요.`,
        k === 0 ? `$h=\\frac{2\\times${q.a}\\times${q.b}}{${p}}$를 계산해요.` : k === 1 ? `$h=${n(h)}$이므로 $CD=${p}-${n(h)}$예요.` : `$h=${n(h)}$이므로 $r=h\\div2$예요.`,
        answerLine(f), '접선의 성질과 피타고라스 정리를 함께 사용해요.'
      ]);
    }
  }
  {
    const id = 'c3-6';
    concept(id, '접선 합', source(id, 1), '$CD=AD+BC$',
      'AB가 반원의 지름이고 AD, BC, CD가 접선일 때 CD는 두 접선 AD, BC와 어떤 관계일까요?', [
        '기울어진 변 CD도 반원의 접선이에요.', 'CD와 반원이 만나는 접점을 E라 해요.',
        'D에서 그은 두 접선은 DA와 DE예요.', 'C에서 그은 두 접선은 CB와 CE예요.',
        '접선 길이의 성질로 $DE=DA$, $CE=CB$예요.', '$CD=DE+EC$에 같은 길이를 넣어요.',
        '따라서 $CD=AD+BC$예요.', 'E는 CD 위에 있으므로 두 길이를 더해요.'
      ], { unknown: 'CD' });
    concept(id, '지름 원리', source(id), '$AB=2\\sqrt{AD\\cdot BC}$',
      '반원에 접하는 직각사다리꼴에서 두 접선 AD, BC로 지름 AB를 어떻게 구할까요?', [
        'AD와 BC는 지름 AB에 수직이에요.', 'D에서 직선 BC에 수선 DH를 내려요.',
        'DH는 AB와 같고 HC는 두 접선 길이의 차예요.', '접선 성질로 CD는 두 접선 길이의 합이에요.',
        '$AB^2=(AD+BC)^2-(BC-AD)^2$예요.', '제곱을 전개하면 제곱항 둘이 각각 없어져요.',
        '양의 제곱근으로 $AB=2\\sqrt{AD\\cdot BC}$예요.', 'AB는 반지름이 아닌 반원의 지름이에요.'
      ], { unknown: 'AB' });
    for (let k = 0; k < 3; k++) {
      const f = source(id, k), q = f.pk;
      add(id, ['지름 계산', '접선 계산', '접선 역산'][k], f, [
        k === 2 ? `지름 $AB=${q.ab}$, 접선 $BC=${q.b}$예요.` : `접선 $AD=${q.a}$, $BC=${q.b}$예요.`,
        `${['지름 AB', '접선 CD', '접선 AD'][k]}를 구하고 접점을 E라 해요.`,
        '$DE=DA$, $CE=CB$로 같은 접선을 묶어요.', '$CD=AD+BC$예요.',
        k === 1 ? 'CD는 접점 E에서 두 부분으로 나뉘어요.' : 'D에서 직선 BC에 내린 수선으로 직각을 만들어요.',
        k === 1 ? `$CD=${q.a}+${q.b}$를 계산해요.` : k === 0 ? `$AB^2=4\\times${q.a}\\times${q.b}$의 양의 제곱근을 구해요.` : `$AD=\\frac{${q.ab}^{2}}{4\\times${q.b}}$를 계산해요.`,
        answerLine(f), k === 1 ? '두 접선 길이를 더한 값인지 확인해요.' : '지름과 반지름을 바꾸어 쓰지 않아요.'
      ]);
    }
  }

  // Concept labels stay symbolic. Problem drawings use the core's source-solution
  // stages and final-answer substitution without touching manual exploration.
  for (const id of ids) {
    const D = defs[id];
    D.lessonQuestion = (M, s) => s.ciLessonProblem ? null : s.ciBQuestion;
    D.lessonDraw = (b, s, M, C, sol) => {
      if (s.ciLessonProblem) return false;
      if (!s.ciLessonSource) { D.draw(b, s, M, { ...C, tab: 'review', problem: false, review: true }); return true; }
      const text = b.text;
      b.text = function (p, value, options) {
        const label = typeof value === 'string' && /(?:^x$|=\s*x$)/.test(value) ? value.replace(/x$/, s.ciBUnknown) : value;
        return text.call(this, p, label, options);
      };
      try {
        D.draw(b, s, M, { ...C, ...G.PC, lesson: true, review: true, t: C.t });
        const stage = C.entry ? 0 : C.answer ? sol.steps.length : Math.max(0, Math.min(C.step, C.calculation ? sol.steps.length - 1 : 3));
        if (sol.draw) sol.draw(b, stage);
      } finally { b.text = text; }
      return true;
    };
    D.lessonAfterDraw = (b, s, M, C) => {
      if (C.entry) return;
      const g = M.g || M, a = g.P || g.A, z = g.P ? g.A : g.B, f = G.clamp(s.ciBTrace || 0, 0, 1);
      if (a && z && f > 0 && f < 1) {
        const pen = G.lerp(a, z, f);
        G.line(b, a, pen, 'amber', 5.2);
        G.dot(b, pen, 'amber', 4.8);
      }
    };
  }
}());
