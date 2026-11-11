/* 삼각비 B — 원문 문제·정확한 근호 값을 유지하는 길이와 높이 해설. */
(function () {
  'use strict';
  const G = window.APL_TG;
  if (!G) return;
  const scenes = (window.APL_TG_GROUPS || []).flatMap(g => g.scenes);
  const ids = ['findFromHyp', 'findFromBase', 'sasAcuteLen', 'sasObtuseLen', 'asaSplit75', 'r4-2', 'r4-3', 'trapDontSplit60',
    'r5-1', 'heightObtuse', 'std4560Height', 'std3060Mountain', 'treeEyeHeight', 'pendulumSwing', 'brokenTreeCone'];
  const defs = Object.fromEntries(ids.map(id => [id, scenes.find(sc => sc.id === id).tg]));
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g9-trig-ratio'] = window.APL_LESSONS['g9-trig-ratio'] || {};
  const S = String.raw, tex = x => G.vtex(x), exact = q => q.choices.find(c => c.ok).t;
  const ctex = x => String(x).replace(/√(\d+)/g, '\\sqrt{$1}');
  const fixed = (id, accept) => G.fixedQuestion(id, 1, accept);
  function add(id, label, q, lines, options = {}) {
    const state = {}; defs[id].init(state);
    const initial = { ...state, ...(options.initial || {}) };
    const start = { ...Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v === 'number')), tgBTrace: 0 };
    const sets = Object.fromEntries(Object.entries(initial).filter(([, v]) => typeof v !== 'number'));
    const ordinal = G.NUM[q.choices.findIndex(c => c.ok)];
    const answer = options.concept ? options.answer : ordinal;
    const final = options.concept ? lines[6] : lines[6] || `따라서 $x=${exact(q)}$, 정답은 ${ordinal}이에요.`;
    const chapters = [
      { title: '조건과 구할 부분', length: 12, start, cues: [
        { at: 0, say: lines[0], to: { tgBTrace: 1 }, dur: 4, set: { ...sets, q, tgSeed: 0,
          tgLessonProblem: !options.concept, tgShowAnswer: false, tgCalculationReady: false,
          tgBQuestion: options.question || '', tgBUnknown: options.unknown || '', tgBMode: options.mode || '' } },
        { at: 6, say: lines[1], step: 1 }
      ] },
      { title: '직각삼각형과 삼각비', length: 12, cues: [
        { at: 0, say: lines[2], step: 2 }, { at: 6, say: lines[3] }
      ] },
      { title: '대응하는 값 계산', length: 12, cues: [
        { at: 0, say: lines[4], step: 3, set: { tgCalculationReady: true } }, { at: 6, say: lines[5], step: 4 }
      ] },
      { title: '답과 단위 확인', length: 12, cues: [
        { at: 0, say: final, step: q.solution.steps.length, set: { tgShowAnswer: true } }, { at: 6, say: lines[7] }
      ] }
    ];
    const item = { title: options.title || '삼각비로 조건 연결하기', label, tab: 'review', answer,
      answerText: options.concept ? answer : `${ordinal} $${exact(q)}$`,
      summary: '직각삼각형의 대응변과 삼각비를 연결해요', task: '직접 해 보기에서 각과 길이를 바꾸고 구하는 변에 맞는 삼각비를 확인해 보세요', chapters };
    (lessons[id] = lessons[id] || []).push(item);
    return item;
  }
  const concept = (id, label, q, answer, question, lines, options = {}) => add(id, label, q, lines, { ...options, concept: true, answer, question });
  const answerLine = (q, name = 'x') => `따라서 $${name}=${exact(q)}$, 정답은 ${G.NUM[q.choices.findIndex(c => c.ok)]}이에요.`;

  {
    const id = 'findFromHyp';
    for (const ask of ['a', 'b']) {
      const q = fixed(id, q => q.solution.math.askedSide === ask && q.solution.math.theta === 30);
      const isOpp = ask === 'a';
      concept(id, isOpp ? '대변 원리' : '이웃변 원리', q, isOpp ? '$a=c\\sin\\theta$' : '$b=c\\cos\\theta$',
        isOpp ? '빗변 c와 표시된 예각 θ를 알 때, 맞은편 대변 a를 어떻게 구할까요?' : '빗변 c와 표시된 예각 θ를 알 때, 이웃변 b를 어떻게 구할까요?', [
          '직각의 맞은편 변을 빗변 c라 해요.', isOpp ? '표시된 각 θ의 맞은편 변을 a라 해요.' : '표시된 각 θ 옆의 빗변 아닌 변을 b라 해요.',
          isOpp ? '대변과 빗변을 연결하는 삼각비는 sin이에요.' : '이웃변과 빗변을 연결하는 삼각비는 cos예요.',
          isOpp ? '$\\sin\\theta=\\frac{a}{c}$로 놓아요.' : '$\\cos\\theta=\\frac{b}{c}$로 놓아요.',
          '양변에 빗변 c를 곱해 분모를 없애요.', '구하려는 길이만 한쪽에 남도록 정리해요.',
          isOpp ? '따라서 $a=c\\sin\\theta$예요.' : '따라서 $b=c\\cos\\theta$예요.', '그림이 뒤집혀도 기준각에 대한 변의 역할은 같아요.'
        ], { unknown: ask });
    }
    for (const theta of [30, 45, 60]) for (const ask of ['a', 'b']) {
      const q = fixed(id, q => q.solution.math.theta === theta && q.solution.math.askedSide === ask), f = q.fig;
      const fn = ask === 'a' ? 'sin' : 'cos', given = f.side.c.t;
      add(id, `${theta}°${ask === 'a' ? '대변' : '밑변'}`, q, [
        `빗변은 $${given.replace(/√(\d+)/g, '\\sqrt{$1}')} $이고 기준각은 ${theta}°예요.`,
        ask === 'a' ? '구하는 x는 기준각의 맞은편 대변이에요.' : '구하는 x는 기준각 옆의 이웃변이에요.',
        ask === 'a' ? '대변÷빗변인 sin을 사용해요.' : '이웃변÷빗변인 cos를 사용해요.',
        `$\\${fn}${theta}^{\\circ}=\\frac{x}{${given.replace(/√(\d+)/g, '\\sqrt{$1}')}}$예요.`,
        `양변에 빗변을 곱해 x를 구해요.`,
        `$\\${fn}${theta}^{\\circ}=${tex(ask === 'a' ? G.sinD(theta) : G.cosD(theta))}$를 대입해요.`,
        answerLine(q), '근호와 분수는 반올림하지 않고 정확히 정리해요.'
      ]);
    }
  }
  {
    const id = 'findFromBase';
    for (const ask of ['a', 'c']) {
      const q = fixed(id, q => q.solution.math.givenSide === 'b' && q.solution.math.askedSide === ask && q.solution.math.theta === 30);
      const hyp = ask === 'c';
      concept(id, hyp ? '빗변 원리' : '대변 원리', q, hyp ? '$c=\\frac{b}{\\cos\\theta}$' : '$a=b\\tan\\theta$',
        hyp ? '이웃변 b와 예각 θ를 알 때, 빗변 c를 어떻게 구할까요?' : '이웃변 b와 예각 θ를 알 때, 대변 a를 어떻게 구할까요?', [
          '표시된 각 θ 옆의 빗변 아닌 변을 b라 해요.', hyp ? '구하는 것은 직각의 맞은편 빗변 c예요.' : '구하는 것은 기준각의 맞은편 대변 a예요.',
          hyp ? '이웃변과 빗변을 연결하는 cos를 사용해요.' : '대변과 이웃변을 연결하는 tan을 사용해요.',
          hyp ? '$\\cos\\theta=\\frac{b}{c}$로 놓아요.' : '$\\tan\\theta=\\frac{a}{b}$로 놓아요.',
          hyp ? '양변에 c를 곱하고 cosθ로 나누어요.' : '양변에 b를 곱해 대변만 남겨요.',
          hyp ? '빗변은 주어진 이웃변보다 긴 값이어야 해요.' : '구하는 변이 분자에 있으면 이웃변을 곱해요.',
          hyp ? '따라서 $c=\\frac{b}{\\cos\\theta}$예요.' : '따라서 $a=b\\tan\\theta$예요.', '각의 위치를 먼저 정한 뒤 삼각비를 골라요.'
        ], { unknown: ask });
    }
    for (const [given, ask, theta, label] of [['b', 'a', 60, '밑변→대변'], ['b', 'c', 45, '밑변→빗변'], ['a', 'b', 30, '대변→밑변'], ['a', 'c', 60, '대변→빗변']]) {
      const q = fixed(id, q => { const m = q.solution.math; return m.givenSide === given && m.askedSide === ask && m.theta === theta; });
      const g = q.fig.side[given].t.replace(/√(\d+)/g, '\\sqrt{$1}'), fn = ask === 'c' ? given === 'a' ? 'sin' : 'cos' : 'tan';
      const equation = given === 'b' && ask === 'a' ? `x=${g}\\tan${theta}^{\\circ}` : given === 'a' && ask === 'b' ? `x=\\frac{${g}}{\\tan${theta}^{\\circ}}` : `x=\\frac{${g}}{\\${fn}${theta}^{\\circ}}`;
      add(id, label, q, [
        `기준각 ${theta}°와 ${given === 'a' ? '대변' : '이웃변'} $${g}$가 주어져요.`,
        `구하는 x는 ${ask === 'a' ? '대변' : ask === 'b' ? '이웃변' : '빗변'}이에요.`,
        `두 변을 연결하는 ${fn}을 사용해요.`, `$${equation}$로 식을 정리해요.`,
        `$\\${fn}${theta}^{\\circ}=${tex(fn === 'sin' ? G.sinD(theta) : fn === 'cos' ? G.cosD(theta) : G.tanD(theta))}$예요.`,
        '분모에 근호가 남으면 같은 근호를 위아래에 곱해요.',
        answerLine(q), '곱셈과 나눗셈은 삼각비의 정의에서 결정해요.'
      ]);
    }
  }

  for (const [id, obtuse, angles] of [['sasAcuteLen', false, [30, 45, 60]], ['sasObtuseLen', true, [120, 135, 150]]]) {
    const q0 = fixed(id, q => q.fig.beta === angles[0]);
    concept(id, '수선 원리', q0, '$AC=\\sqrt{AH^2+HC^2}$',
      obtuse ? '끼인각 B가 둔각일 때, 수선의 발 H는 어디에 생기고 AC는 어떻게 구할까요?' : '두 변 AB, BC와 예각 B가 주어졌어요. A에서 내린 수선 AH로 AC를 어떻게 구할까요?', [
        '두 변 사이의 각 B를 확인해요.', obtuse ? 'A에서 CB의 연장선에 수선 AH를 내려요.' : '이 그림에서는 수선의 발 H가 B와 C 사이예요.',
        obtuse ? '직각삼각형 ABH의 예각은 180°−B예요.' : '직각삼각형 ABH에서 높이와 밑변을 구해요.',
        'AB에 sin을 곱하면 AH, cos를 곱하면 BH예요.',
        obtuse ? '$HC=BC+BH$로 두 거리를 더해요.' : '$HC=BC-BH$로 남은 거리를 구해요.',
        '직각삼각형 AHC에 피타고라스 정리를 써요.',
        '따라서 $AC=\\sqrt{AH^2+HC^2}$예요.', '처음 삼각형 ABC에 바로 피타고라스를 쓰면 안 돼요.'
      ], { unknown: 'AC' });
    for (const beta of angles) {
      const q = fixed(id, q => q.fig.beta === beta), f = q.fig, w = f.work;
      add(id, `${beta}°길이`, q, [
        `$AB=${ctex(f.cl)}$, $BC=${f.a}$, 각 B는 ${beta}°예요.`,
        obtuse ? 'A에서 CB의 연장선에 수선 AH를 내려요.' : 'A에서 BC에 수선 AH를 내려요.',
        `직각삼각형 ABH의 각 B는 ${w.w}°예요.`,
        `$AH=${ctex(f.cl)}\\sin${w.w}^{\\circ}=${ctex(w.ah)}$예요.`,
        `$BH=${ctex(f.cl)}\\cos${w.w}^{\\circ}=${ctex(w.bh)}$예요.`,
        `$HC=${f.a}${obtuse ? '+' : '-'}${ctex(w.bh)}=${ctex(w.hc)}$예요.`,
        answerLine(q, 'AC'), '$AC^2=AH^2+HC^2$의 양의 제곱근을 골라요.'
      ]);
    }
  }
  {
    const id = 'asaSplit75';
    concept(id, '75°수선', fixed(id, q => q.fig.givenK === 'ac' && q.fig.askK === 'ab'), '$AB=\\sqrt{2}AH$',
      'B가 45°, C가 60°인 삼각형에서 AC를 알아요. AB를 구할 수선을 찾아보세요.', [
        '내각의 합으로 각 A는 75°임을 알아요.', 'A에서 BC에 수선 AH를 내려요.',
        '75°가 45°와 30°로 나뉘어요.', '두 직각삼각형에 45°와 60°가 그대로 남아요.',
        '$AH=AC\\sin60^{\\circ}$로 높이를 구해요.', '삼각형 ABH는 두 예각이 같은 직각삼각형이에요.',
        '따라서 $AB=\\sqrt{2}AH$예요.', '특수각을 나누지 않는 수선을 먼저 찾아요.'
      ], { unknown: 'AB' });
    for (const [given, ask] of [['ac', 'ab'], ['ac', 'bc'], ['bc', 'ab'], ['bc', 'ac']]) {
      const q = fixed(id, q => q.fig.givenK === given && q.fig.askK === ask), M = q.fig.exact;
      const equation = { ab: 'AB=\\sqrt{2}AH', ac: 'AC=\\frac{2AH}{\\sqrt{3}}', bc: 'BC=AH+\\frac{AH}{\\sqrt{3}}' }[ask];
      add(id, `${given.toUpperCase()}→${ask.toUpperCase()}`, q, [
        `$${given.toUpperCase()}=${tex(M[given])}$이고 B=45°, C=60°예요.`,
        '75°인 꼭짓점 A에서 BC에 수선을 내려요.',
        '$BH=AH$, $CH=\\frac{AH}{\\sqrt{3}}$예요.',
        given === 'ac' ? '$AH=AC\\sin60^{\\circ}$로 높이를 구해요.' : '$BC=AH+\\frac{AH}{\\sqrt{3}}$로 높이를 구해요.',
        `계산하면 $AH=${tex(M.h)}$예요.`, `$${equation}$에 높이를 넣어요.`,
        answerLine(q, ask.toUpperCase()), 'BC는 두 밑변의 합이고 AB와 AC는 각각 빗변이에요.'
      ]);
    }
  }
  {
    const id = 'r4-2';
    for (const ask of ['t15', 't75']) {
      const q = fixed(id, q => q.fig.kind === ask), small = ask === 't15';
      concept(id, small ? '15°원리' : '75°원리', q,
        small ? '$\\tan15^{\\circ}=2-\\sqrt{3}$' : '$\\tan75^{\\circ}=2+\\sqrt{3}$',
        small ? '30° 직각삼각형을 AB=BD가 되게 연장했어요. tan 15°를 구하는 원리를 알아보세요.' : 'AB=BD인 그림에서 ∠CAD=75°예요. tan 75°를 구하는 원리를 알아보세요.', [
          'AC를 k라 두면 AB=2k, BC=k√3예요.', 'AB=BD이므로 삼각형 ABD는 이등변삼각형이에요.',
          '외각 30°를 같은 두 각으로 나누면 각각 15°예요.', '$CD=k\\sqrt{3}+2k$예요.',
          small ? '$\\tan15^{\\circ}=\\frac{AC}{CD}$예요.' : '$\\tan75^{\\circ}=\\frac{CD}{AC}$예요.',
          small ? '$\\frac{1}{2+\\sqrt{3}}$의 분모를 유리화해요.' : '분자와 분모의 공통인수 k를 약분해요.',
          small ? '따라서 $\\tan15^{\\circ}=2-\\sqrt{3}$예요.' : '따라서 $\\tan75^{\\circ}=2+\\sqrt{3}$예요.',
          '기준각이 바뀌면 대변과 이웃변의 역할도 바뀌어요.'
        ]);
    }
    for (const ask of ['t15', 't75', 'cd']) {
      const q = fixed(id, q => q.fig.kind === ask), k = q.fig.k, w = q.fig.work;
      add(id, ask === 'cd' ? 'CD길이' : ask === 't15' ? 'tan15°' : 'tan75°', q, [
        `$AC=${k}$이고 ∠ABC=30°, AB=BD예요.`,
        `$AB=2AC=${2 * k}$이므로 $BD=${2 * k}$예요.`,
        `$BC=AC\\sqrt{3}=${ctex(w.CB)}$예요.`,
        '이등변삼각형 ABD의 각 D는 15°예요.',
        ask === 'cd' ? `$CD=${ctex(w.CB)}+${2 * k}$를 계산해요.` : `$CD=BC+BD=${ctex(w.CD)}$예요.`,
        ask === 't15' ? `$\\tan15^{\\circ}=\\frac{${k}}{${ctex(w.CD)}}$를 유리화해요.` : ask === 't75' ? `$\\tan75^{\\circ}=\\frac{${ctex(w.CD)}}{${k}}$를 약분해요.` : 'BC와 BD를 더한 것이 전체 CD예요.',
        answerLine(q, ask === 'cd' ? 'CD' : ask === 't15' ? '\\tan15^{\\circ}' : '\\tan75^{\\circ}'),
        ask === 'cd' ? '근호가 있는 항과 정수 항을 구별해 정리해요.' : '예각의 탄젠트는 양수인지도 확인해요.'
      ]);
    }
  }
  {
    const id = 'r4-3', q0 = fixed(id, q => q.fig.kind === 'side');
    for (const kind of ['side', 'perimeter', 'area']) {
      const answer = { side: '$s=\\frac{w}{\\sin\\theta}$', perimeter: '$P=4s$', area: '$S=sw$' }[kind];
      concept(id, { side: '한변 원리', perimeter: '둘레 원리', area: '넓이 원리' }[kind], q0, answer,
        { side: '폭이 같은 두 테이프의 겹친 마름모에서 한 변 s를 폭 w와 각 θ로 나타내세요.', perimeter: '폭이 같은 두 테이프가 겹친 마름모의 둘레 P는 한 변 s와 어떤 관계일까요?', area: '폭이 같은 두 테이프가 겹친 마름모의 넓이 S는 한 변 s, 폭 w와 어떤 관계일까요?' }[kind], [
          '같은 폭의 두 테이프가 겹치면 마름모가 돼요.', '한 변을 s, 테이프의 수직인 폭을 w라 해요.',
          'D에서 AB에 내린 수선의 길이는 w예요.', '$\\sin\\theta=\\frac{w}{s}$로 두 길이를 연결해요.',
          kind === 'side' ? '양변에 s를 곱하고 sinθ로 나누어요.' : '$s=\\frac{w}{\\sin\\theta}$로 한 변을 구해요.',
          kind === 'perimeter' ? '마름모의 네 변은 길이가 모두 같아요.' : kind === 'area' ? '넓이는 밑변과 그에 수직인 높이를 곱해요.' : '직각삼각형에서 s는 빗변, w는 대변이에요.',
          `따라서 ${answer}예요.`,
          kind === 'area' ? '기울어진 옆변 s를 높이로 사용하지 않아요.' : kind === 'perimeter' ? '둘레는 네 변을 합한 길이예요.' : '각이 작아지면 같은 폭에서 한 변이 길어져요.'
        ], { unknown: 's' });
    }
    for (const kind of ['side', 'area']) {
      const q = fixed(id, q => q.fig.kind === kind), f = q.fig;
      add(id, kind === 'side' ? '한변 계산' : '넓이 계산', q, [
        `테이프의 폭은 ${f.w}, 겹친 각은 ${f.th}°예요.`,
        '마름모에서 한 변을 s, 수직인 높이를 폭으로 잡아요.',
        `$\\sin${f.th}^{\\circ}=\\frac{${f.w}}{s}$예요.`,
        `$s=\\frac{${f.w}}{\\sin${f.th}^{\\circ}}$로 정리해요.`,
        kind === 'side' ? `$\\sin${f.th}^{\\circ}=${tex(G.sinD(f.th))}$를 대입해요.` : `계산한 한 변은 $s=${ctex(f.side)}$예요.`,
        kind === 'side' ? '분모에 근호가 있으면 유리화해요.' : `$S=s\\times${f.w}$로 밑변과 높이를 곱해요.`,
        answerLine(q, kind === 'side' ? 's' : 'S'),
        kind === 'side' ? '폭보다 한 변의 길이가 크거나 같아야 해요.' : '넓이의 단위는 길이 단위의 제곱이에요.'
      ]);
    }
  }
  {
    const id = 'trapDontSplit60', q0 = fixed(id, q => q.fig.pair.join(',') === '45,60');
    concept(id, '수선 선택', q0, 'A에서 BC에 수선',
      'B=45°, C=60°, A=75°인 삼각형에서 두 직각삼각형에 30°·45°·60°를 남기는 수선을 골라보세요.', [
        '밑각은 45°와 60°, 나머지 각 A는 75°예요.', '수선은 내리는 꼭짓점의 각을 둘로 나눠요.',
        '60°인 C에서 AB에 수선을 내려 볼까요?', 'C의 각이 45°와 15°로 나뉘어 계산이 길어져요.',
        '이제 75°인 A에서 BC에 수선을 내려요.', '두 직각삼각형에 45°와 60°가 그대로 남아요.',
        '선택은 A에서 BC에 수선이에요.', '75°가 45°와 30°로 나뉘는 것을 확인해요.'
      ], { mode: 'trapCompare' });
    for (const pair of [[45, 60], [60, 45], [45, 30], [30, 45]]) {
      const q = fixed(id, q => q.fig.pair.join(',') === pair.join(',')), f = q.fig;
      const theta = pair[f.askB ? 0 : 1], angle = f.askB ? 'BAH' : 'CAH';
      add(id, `${pair[0]}·${pair[1]}각`, q, [
        `밑각은 B=${pair[0]}°, C=${pair[1]}°이고 AH⊥BC예요.`,
        `구하는 x는 각 ${angle}예요.`,
        `직각삼각형 ${f.askB ? 'ABH' : 'ACH'}만 보아요.`,
        `H의 각은 90°, 다른 예각은 ${theta}°예요.`,
        `$x+${theta}^{\\circ}=90^{\\circ}$예요.`,
        `$x=90^{\\circ}-${theta}^{\\circ}$를 계산해요.`,
        answerLine(q), '다른 쪽 직각삼각형의 밑각과 바꾸지 않아요.'
      ]);
    }
  }

  // GROUP_B_MORE

  // Trace a real source outline. No question parameter or mathematical length is
  // altered by this motion. Concepts use the same source figures symbolically.
  for (const id of ids) {
    const D = defs[id];
    D.lessonQuestion = (M, s) => s.tgLessonProblem ? null : s.tgBQuestion;
    D.lessonDraw = (b, s, M, C) => {
      const q = s.q, stage = C.entry ? 0 : C.answer ? q.solution.steps.length : Math.min(C.step || 0, q.solution.steps.length - 1);
      const path = b.path, text = b.text;
      let edge = null;
      b.path = function (points, options = {}) {
        if (!edge && options.color === 'ink' && (options.width || 0) >= 2 && points?.length >= 2) {
          const a = points[0], z = points[1];
          if (Number.isFinite(a.x) && Number.isFinite(z.x) && G.dist(a, z) > 1e-6 &&
            !(id === 'pendulumSwing' && Math.abs(a.y - z.y) < 1e-8)) edge = [{ ...a }, { ...z }];
        }
        return path.call(this, points, options);
      };
      b.text = function (at, value, options) {
        let out = String(value ?? '');
        if (!s.tgLessonProblem) {
          if (/둘레\s*=|넓이\s*=|→|특수각/.test(out)) return;
          out = out.replace(/\bx\b/g, s.tgBUnknown || '');
        } else if (C.answer && q.ans?.length === 1) {
          out = out.replace(/\bx\b/g, q.ans[0]);
        }
        if (!out.trim()) return;
        return text.call(this, at, out, options);
      };
      try {
        const cue = { ...C, review: true, problem: true, full: false, step: stage, last: !!C.answer && s.tgLessonProblem };
        if (!s.tgLessonProblem && s.tgBMode === 'trapCompare') D.draw(b, s, M, cue);
        else D.pdraw(b, q, cue, s);
      } finally { b.path = path; b.text = text; }
      const amount = C.entry ? 0 : G.clamp(s.tgBTrace || 0, 0, 1);
      if (edge && amount) G.line(b, edge[0], G.lerp(edge[0], edge[1], amount), 'amber', 5.5, { alpha: .85 });
    };
  }
})();
