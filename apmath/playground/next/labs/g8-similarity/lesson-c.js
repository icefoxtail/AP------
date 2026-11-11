/* 직각삼각형·활용·무게중심: 원본 문제와 도형에 연결한 원클릭 해설. */
(function () {
  'use strict';
  const G = window.APL_SM;
  const scenes = (window.APL_SM_GROUPS || []).flatMap(group => group.scenes);
  const source = id => scenes.find(scene => scene.id === id).sm;
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-similarity'] = all['g8-similarity'] || {};
  const ch = (title, cues) => ({ title, length: 12, cues });
  const cue = (at, say, step, set) => ({ at, say, ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  const defaults = { smRb: 4, smRc: 9, smRt: 1, smSh: 2, smSs: 3, smSk: 4, smRm: 2, smRn: 1, smRu: 2, smRw: 2,
    smGt: 2, smGs: 2, smGa: 90, smGr: 0, smGu: 3, smGk: 2, smGc: 1, smGax: 1, smGay: 5, smGgx: .3, smGgy: .75, smCTrace: 0 };
  const fixed = (id, kind = 0) => ({ ...source(id).gen(1), kind });
  function make(id, label, title, answer, chapters, options = {}) {
    chapters[0].start = { ...defaults, ...(options.start || {}) };
    const first = chapters[0].cues[0];
    first.set = { smLessonProblem: !!options.problem, smShowAnswer: false, smCalculationReady: false,
      smSeed: 0, smPk: options.pk || fixed(id), smCQuestion: options.question || '',
      ...(first.set || {}) };
    if (first.step == null && !first.to) Object.assign(first, { to: { smCTrace: 1 }, dur: 4 });
    return { label, title, tab: 'review', answer, answerText: answer,
      summary: '조건과 대응관계를 확인하고 비례식으로 설명해요',
      task: '직접 해 보기에서 길이와 모양을 바꾸며 같은 관계를 확인해 보세요', chapters };
  }
  const finish = (at, say, step = 5) => cue(at, say, step, { smShowAnswer: true, smCalculationReady: true });
  const calc = (at, say, step = 3) => cue(at, say, step, { smCalculationReady: true });
  function concept(id, label, title, answer, chapters, question, start) {
    return make(id, label, title, answer, chapters, { question, start });
  }
  function problem(id, kind, label, title, answer, chapters) {
    return make(id, label, title, answer, chapters, { problem: true, pk: fixed(id, kind) });
  }

  lessons['sm6-trio'] = [
    concept('sm6-trio', '세 닮음', '수선으로 생긴 세 삼각형', '△ABC∽△HBA∽△HAC', [
      ch('직각과 수선의 조건', [cue(0, 'A가 직각이고 AH는 빗변 BC에 수직이에요.'), cue(6, '큰 삼각형과 수선 양옆의 두 삼각형을 찾아요.', 1)]),
      ch('왼쪽 삼각형과 대응', [cue(0, 'ABC와 HBA는 직각이 같고 B의 각이 공통이에요.', 2), cue(6, 'A↔H, B↔B, C↔A 순서로 대응해요.', 2)]),
      ch('오른쪽 삼각형까지 연결', [cue(0, 'ABC와 HAC도 직각과 C의 각이 같아요.', 3), finish(6, '대응 순서는 △ABC∽△HBA∽△HAC예요.', 3)])
    ], '직각삼각형 ABC에서 AH⊥BC일 때 세 직각삼각형의 대응 순서를 설명해 보세요.'),
    problem('sm6-trio', 0, '같은 각', '직각삼각형의 대응각', '∠BAH=∠C', [
      ch('구하는 각의 위치', [cue(0, '직각 A에서 빗변 BC로 내린 수선 AH를 따라가요.'), cue(6, 'BAH는 작은 삼각형 HBA의 A에 있는 각이에요.', 1)]),
      ch('닮은 두 삼각형 비교', [cue(0, 'ABC와 HBA는 직각이 같고 B의 각이 공통이에요.', 2), cue(6, '닮음 순서 ABC와 HBA에서 마지막 점끼리 대응해요.', 3)]),
      ch('대응각을 보기에서 찾기', [cue(0, '큰 삼각형의 C는 작은 삼각형의 A와 대응해요.', 3), finish(6, '따라서 ∠BAH=∠C이고 C의 각을 고르면 돼요.')])
    ]),
    problem('sm6-trio', 1, '대응변', '비례식의 빈칸 찾기', 'x=CH', [
      ch('두 작은 삼각형의 순서', [cue(0, 'HBA와 HAC는 직각인 H끼리 대응해요.'), cue(6, '남은 대응은 B↔A, A↔C예요.', 1)]),
      ch('비례식의 두 자리', [cue(0, '첫 비 BH:AH에서 BH는 다른 삼각형의 AH와 짝이에요.', 2), cue(6, '두 번째 자리에 놓인 AH의 대응변을 찾아요.', 3)]),
      ch('대응하는 선분 고르기', [cue(0, 'H↔H, A↔C이므로 AH와 CH가 짝이에요.', 3), finish(6, 'BH:AH=AH:CH이므로 x=CH예요.')])
    ])
  ];
  for (const [id, nm, small, whole, similar, reason] of [
    ['sm6-ab2', 'AB', 'BH', 'BC', '△ABC∽△HBA', '직각과 공통인 B의 각이 같아요.'],
    ['sm6-ac2', 'AC', 'CH', 'BC', '△ABC∽△HAC', '직각과 공통인 C의 각이 같아요.'],
    ['sm6-ah2', 'AH', 'BH', 'CH', '△HBA∽△HAC', '직각과 같은 표시의 예각이 같아요.']
  ]) {
    const p = fixed(id), b = p.b, c = p.c, t = p.t, isB = nm === 'AB', isH = nm === 'AH';
    const ratio = isH ? 'BH:AH=AH:CH' : `${nm}:${small}=${whole}:${nm}`;
    const form = `${nm}²=${small}×${whole}`;
    const factor1 = isB || isH ? b : c, factor2 = isH ? c : b + c;
    const result = factor1 * factor2, target = isB ? 'BH' : 'CH', given = (isH ? 12 : isB ? 15 : 20) * t, divisor = (isH ? 9 : 25) * t;
    const inverse = (isB ? 9 : 16) * t;
    lessons[id] = [
      concept(id, '제곱의 이유', `${nm}의 제곱과 닮음`, form, [
        ch('수선 양옆의 삼각형', [cue(0, 'A는 직각이고 H는 빗변에 내린 수선의 발이에요.'), cue(6, reason, 1)]),
        ch('대응하는 변의 비', [cue(0, `${similar} 순서로 대응변을 찾아요.`, 2), calc(6, `${ratio}로 비례식을 세워요.`, 2)]),
        ch('같은 변의 곱 정리', [cue(0, '비례식의 내항의 곱과 외항의 곱이 같아요.', 2), finish(6, `같은 변을 두 번 곱하므로 ${form}예요.`, 3)])
      ], `AH⊥BC일 때 닮음의 대응변을 이용해 ${nm}의 제곱을 나타내 보세요.`),
      problem(id, 0, `${nm}² 계산`, `${nm}의 제곱 값 구하기`, `${nm}²=${result}`, [
        ch('길이와 제곱을 구별', [cue(0, `BH=${b}, CH=${c}예요. ${nm}의 제곱 값을 구해요.`), cue(6, isH ? '두 작은 직각삼각형의 대응을 찾아요.' : `빗변 전체 BC는 ${b}+${c}예요.`, 1)]),
        ch('닮음과 비례식', [cue(0, `${similar}에서 같은 순서로 변을 짝지어요.`, 2), calc(6, `${ratio}에서 ${form}예요.`, 3)]),
        ch('제곱의 값으로 답하기', [cue(0, `구하는 값은 길이가 아니라 ${factor1}×${factor2}예요.`, 3), finish(6, `${nm}²=${result}예요. 제곱근을 구할 필요는 없어요.`)])
      ]),
      problem(id, 1, `${target} 길이`, '제곱 관계를 거꾸로 쓰기', `x=${inverse}`, [
        ch('알려진 두 길이', [cue(0, `${nm}=${given}, ${isH ? 'BH' : 'BC'}=${divisor}예요.`), cue(6, `빗변 위의 ${target}가 x인 길이예요.`, 1)]),
        ch('닮음의 곱 관계', [cue(0, `${similar}에서 대응변을 찾아요.`, 2), calc(6, `${form}에서 모르는 ${target}를 구해요.`, 3)]),
        ch('나눗셈으로 길이 계산', [cue(0, `x=${given}²÷${divisor}로 계산해요.`, 3), finish(6, `${given * given}÷${divisor}이므로 x=${inverse}예요.`)])
      ])
    ];
  }
  {
    const id = 'sm6-area', p = fixed(id), ab = 15 * p.t, ac = 20 * p.t, bc = 25 * p.t, ah = 12 * p.t;
    lessons[id] = [
      concept(id, '넓이 두 식', '같은 넓이를 두 가지로', 'AB×AC=BC×AH', [
        ch('밑변과 높이를 한 쌍으로', [cue(0, 'AB와 AC는 직각으로 만나므로 밑변과 높이가 돼요.'), cue(6, '넓이를 AB×AC÷2로 나타낼 수 있어요.', 1)]),
        ch('다른 밑변으로 바라보기', [cue(0, '이번에는 빗변 BC를 밑변으로 잡아요.', 2), cue(6, 'AH가 BC에 수직이므로 넓이는 BC×AH÷2예요.', 2)]),
        ch('같은 넓이식 연결', [cue(0, '같은 삼각형의 두 넓이식은 값이 같아요.', 2), finish(6, '양쪽에 2를 곱하면 AB×AC=BC×AH예요.', 3)])
      ], '직각삼각형 ABC에서 두 밑변·높이 쌍을 골라 길이 사이의 관계를 설명해 보세요.'),
      ...[0, 1].map(kind => problem(id, kind, kind ? '빗변 BC' : '높이 AH', kind ? '넓이로 빗변 구하기' : '넓이로 높이 구하기', `x=${kind ? bc : ah}`, [
        ch('직각을 낀 두 변', [cue(0, `AB=${ab}, AC=${ac}이고 두 변은 수직이에요.`), cue(6, kind ? `높이 AH=${ah}이고 빗변 BC가 x예요.` : `빗변 BC=${bc}이고 수선 AH가 x예요.`, 1)]),
        ch('같은 넓이를 두 번 표현', [cue(0, `넓이는 ${ab}×${ac}÷2예요.`, 2), calc(6, `AB×AC=BC×AH에 주어진 값을 넣어요.`, 3)]),
        ch('구하는 길이 계산', [cue(0, `x=${ab}×${ac}÷${kind ? ah : bc}로 구해요.`, 3), finish(6, `따라서 x=${kind ? bc : ah}예요. 밑변과 높이의 짝을 확인해요.`)])
      ]))
    ];
  }
  {
    const id = 'sm7-shadow', p = fixed(id), H = p.h * p.k, S = p.s * p.k;
    lessons[id] = [
      concept(id, '그림자 비', '그림자로 높이를 재는 이유', '나무 높이=8', [
        ch('수직과 햇빛의 방향', [cue(0, '막대 높이는 2, 그림자는 3, 나무 그림자는 12예요.'), cue(6, '막대와 나무는 땅에 수직이고 햇빛은 나란해요.', 1)]),
        ch('닮음과 대응하는 길이', [cue(0, '직각과 햇빛이 이루는 각이 같아 AA 닮음이에요.', 2), calc(6, '높이끼리, 그림자끼리 짝지어 2:x=3:12예요.', 2)]),
        ch('같은 확대 비율 적용', [cue(0, '그림자가 12÷3배이므로 높이도 같은 배율이에요.', 2), finish(6, '2×4이므로 나무 높이=8이에요.', 3)])
      ], '같은 햇빛 아래 막대와 나무의 그림자 길이를 비교해 나무의 높이를 구해 보세요.'),
      ...[0, 1].map(kind => problem(id, kind, kind ? '막대 그림자' : '나무 높이', '그림자와 높이의 비례식', `x=${kind ? p.s : H}`, [
        ch('주어진 높이와 그림자', [cue(0, `작은 막대의 높이는 ${p.h}, 나무의 그림자는 ${S}예요.`), cue(6, kind ? `나무 높이는 ${H}이고 막대의 그림자가 x예요.` : `막대의 그림자는 ${p.s}이고 나무 높이가 x예요.`, 1)]),
        ch('직각삼각형의 닮음', [cue(0, '같은 햇빛과 수직 조건으로 두 삼각형은 AA 닮음이에요.', 2), calc(6, kind ? `${p.h}:${H}=x:${S}로 같은 종류끼리 짝지어요.` : `${p.h}:x=${p.s}:${S}로 같은 종류끼리 짝지어요.`, 3)]),
        ch('구하는 길이만 남기기', [cue(0, kind ? `x=${S}×${p.h}÷${H}로 계산해요.` : `x=${p.h}×${S}÷${p.s}로 계산해요.`, 3), finish(6, `따라서 x=${kind ? p.s : H}예요. 높이와 그림자를 구별해요.`)])
      ]))
    ];
  }
  {
    const id = 'sm7-river', p = fixed(id), PQ = p.m * p.w, QD = p.m * p.u, DA = p.n * p.u, AE = p.n * p.w;
    lessons[id] = [
      concept(id, '강폭의 비', '건너지 않고 강폭 구하기', 'PQ=4', [
        ch('땅 위의 길이부터 확인', [cue(0, 'QD=4, AD=2, AE=2예요. PQ는 구하려는 강폭이에요.'), cue(6, 'P·D·E와 Q·D·A는 각각 한 직선 위에 있어요.', 1)]),
        ch('두 삼각형의 대응', [cue(0, 'Q와 A는 직각이고 D의 맞꼭지각이 같아요.', 2), calc(6, '△PQD∽△EAD이므로 PQ:EA=QD:AD예요.', 2)]),
        ch('대응변의 비로 계산', [cue(0, 'PQ:2=4:2이므로 2×4÷2를 계산해요.', 2), finish(6, '따라서 강폭 PQ=4예요.', 3)])
      ], '직각과 D에서 같은 맞꼭지각을 이용해 강폭 PQ를 구해 보세요.'),
      ...[0, 1].map(kind => problem(id, kind, kind ? '땅 위 AD' : '강폭 PQ', '강폭 측량의 대응변', `x=${kind ? DA : PQ}`, [
        ch('물어본 선분을 표시', [cue(0, kind ? `PQ=${PQ}, QD=${QD}, AE=${AE}예요.` : `QD=${QD}, AD=${DA}, AE=${AE}예요.`), cue(6, kind ? 'AD가 x예요. 강폭 PQ와 다른 선분이에요.' : 'PQ가 x예요. 땅 위에서 잰 길이로 구해요.', 1)]),
        ch('직각과 맞꼭지각 연결', [cue(0, '△PQD와 △EAD는 AA 닮음이에요.', 2), calc(6, 'P↔E, Q↔A, D↔D이므로 PQ:EA=QD:AD예요.', 3)]),
        ch('같은 순서로 값 대입', [cue(0, kind ? `x=${QD}×${AE}÷${PQ}로 계산해요.` : `x=${AE}×${QD}÷${DA}로 계산해요.`, 3), finish(6, `따라서 x=${kind ? DA : PQ}예요. 대응 순서를 끝까지 유지해요.`)])
      ]))
    ];
  }

  // These hooks are read by the lesson-only route. Exploration and manual
  // current-question solving retain the original source drawing and controls.
  for (const id of Object.keys(lessons).filter(id => /^sm[678]-/.test(id))) {
    const D = source(id);
    D.lessonQuestion = (M, s, Q) => {
      if (!s.smLessonProblem) return s.smCQuestion || D.question;
      const labels = ['①', '②', '③', '④', '⑤'];
      return `<div class="sm-q">${Q.html != null ? Q.html : Q.stem}</div><div class="sm-lesson-choices">${Q.choices.map((choice, i) => `<span>${labels[i]} ${choice.h != null ? choice.h : '$' + choice.t + '$'}</span>`).join(' ')}</div>`;
    };
    D.lessonDraw = (b, s, M, C, sol) => {
      if (s.smLessonProblem) {
        const stage = C.answer ? sol.steps.length : Math.max(1, Math.min(sol.steps.length - 1, C.step || 1));
        G.drawSolution(b, D, s, M, { ...C, step: stage }, sol);
      } else D.draw(b, s, M, { ...C, problem: false, review: true, txt: false,
        step: C.answer ? 3 : Math.min(2, C.step || 0), t: s.smGr || 0 });
      const g = s.smLessonProblem ? G.solutionGeometry(id, M.pk) : id === 'sm8-six' ? G.geo.sixGeo(s, false, M.u)
        : id === 'sm8-gg' ? G.geo.ggGeo(s, false, M.k) : id === 'sm8-chain' ? G.geo.chGeo(s, false, M.c) : M;
      const pair = id === 'sm7-shadow' ? [g.A, g.Atop] : id === 'sm7-river' ? [g.Q, g.D]
        : id === 'sm8-proof' || id === 'sm8-chain' ? [g.A, g.D] : id === 'sm8-six' ? [g.B, g.D]
          : id === 'sm8-gg' ? [g.B, g.C] : id === 'sm6-area' ? [g.A, g.B] : [g.A, g.H];
      const trace = C.entry ? 0 : Math.max(0, Math.min(1, s.smCTrace || 0));
      if (trace > 0) G.line(b, pair[0], G.lerp(pair[0], pair[1], trace), 'amber', 4.8, { alpha: .75 });
    };
  }
})();
