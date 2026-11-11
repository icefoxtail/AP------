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

  {
    const id = 'sm8-proof', p = fixed(id);
    lessons[id] = [
      concept(id, '중선의 비', '무게중심의 비를 닮음으로', 'AG:GD=BG:GE=2:1', [
        ch('중선과 중점 연결', [cue(0, 'D와 E는 각 변의 중점이고 두 중선이 G에서 만나요.'), cue(6, '중점연결정리로 DE∥AB, DE:AB=1:2예요.', 1)]),
        ch('두 삼각형의 대응', [cue(0, '엇각과 맞꼭지각으로 △GED∽△GBA예요.', 2), cue(6, 'G↔G, E↔B, D↔A의 대응 순서를 따라가요.', 2)]),
        ch('돌려서 대응 방향 확인', [{ at: 0, say: '작은 삼각형을 반 바퀴 돌려 대응변 방향을 맞춰요.', to: { smGr: 1 }, dur: 4 }, finish(6, '대응변의 비를 뒤집으면 AG:GD=BG:GE=2:1예요.', 3)])
      ], '두 중선의 교점 G가 중선을 나누는 비를 중점연결정리와 닮음으로 설명해 보세요.'),
      ...[0, 1, 2].map(kind => {
        const given = kind === 0 ? 3 * p.t : kind === 1 ? 2 * p.s : 2 * p.t;
        const target = kind === 1 ? 'GE' : 'GD', givenName = kind === 0 ? 'AD' : kind === 1 ? 'BG' : 'AG';
        const a = kind === 1 ? p.s : p.t, divisor = kind === 0 ? 3 : 2;
        return problem(id, kind, ['중선 전체', 'BG→GE', 'AG→GD'][kind], '무게중심의 부분 길이', `x=${a}`, [
          ch('전체와 부분을 구별', [cue(0, `${givenName}=${given}이고 G는 무게중심이에요.`), cue(6, kind === 0 ? 'AD는 중선 전체이고 GD가 x예요.' : `${givenName}는 꼭짓점 쪽이고 ${target}가 x예요.`, 1)]),
          ch('닮음에서 얻은 중선의 비', [cue(0, '중점연결정리와 닮음으로 꼭짓점 쪽:중점 쪽은 2:1이에요.', 2), calc(6, kind === 0 ? '전체는 같은 길이 세 칸이고 GD는 한 칸이에요.' : `${givenName}는 두 칸, ${target}는 한 칸이에요.`, 3)]),
          ch('구하는 한 칸 계산', [cue(0, `${target}는 ${given}÷${divisor}로 계산해요.`, 3), finish(6, `따라서 x=${a}예요. 전체를 반으로 나누지 않아요.`)])
        ]);
      })
    ];
  }
  {
    const id = 'sm8-six', p = fixed(id), total = 6 * p.u;
    lessons[id] = [
      concept(id, '여섯 넓이', '세 중선이 나누는 넓이', '작은 삼각형의 넓이=전체 넓이÷6', [
        ch('같은 높이와 같은 밑변', [cue(0, 'D는 BC의 중점이므로 BD와 DC가 같아요.'), cue(6, 'GBD와 GCD는 G에서의 높이도 같아 넓이가 같아요.', 1)]),
        ch('중선의 비와 작은 넓이', [cue(0, 'GAB와 GBD는 B에서 AD로 내린 높이가 같아요.', 2), cue(6, 'AG:GD=2:1이므로 GAB의 넓이는 GBD의 두 배예요.', 2)]),
        ch('모든 조각으로 넓히기', [cue(0, 'F가 AB의 중점이라 GAF와 GFB는 GAB의 절반이에요.', 2), finish(6, '같은 방법으로 여섯 조각이 같아 각각 전체 넓이÷6이에요.', 3)])
      ], '세 중선이 만든 작은 삼각형들의 넓이가 같은 이유를 밑변과 높이로 설명해 보세요.'),
      ...[0, 1, 2].map(kind => {
        const a = kind === 0 ? p.u : kind === 1 ? total : 2 * p.u;
        return problem(id, kind, ['작은 넓이', '전체 넓이', '사각형 넓이'][kind], '무게중심과 넓이의 비', `x=${a}`, [
          ch('전체와 물어본 영역', [cue(0, kind === 1 ? `작은 삼각형 GBD의 넓이는 ${p.u}예요.` : `삼각형 ABC의 전체 넓이는 ${total}예요.`), cue(6, kind === 0 ? '구하는 것은 작은 삼각형 GBD의 넓이예요.' : kind === 1 ? '구하는 것은 여섯 조각을 합친 ABC의 넓이예요.' : '사각형 AFGE는 GAF와 GAE 두 조각이에요.', 1)]),
          ch('중점과 무게중심의 성질', [cue(0, '같은 밑변과 높이, 중선의 2:1 비를 연결해요.', 2), calc(6, '세 중선이 나눈 여섯 삼각형의 넓이는 모두 같아요.', 3)]),
          ch('필요한 조각 수만 계산', [cue(0, kind === 0 ? `${total}÷6으로 한 조각을 구해요.` : kind === 1 ? `${p.u}×6으로 전체를 구해요.` : `${total}÷6×2로 두 조각을 구해요.`, 3), finish(6, `따라서 x=${a}예요. 길이의 단위가 아닌 넓이예요.`)])
        ]);
      })
    ];
  }
  {
    const id = 'sm8-gg', p = fixed(id), BC = 6 * p.k, GG = 2 * p.k;
    lessons[id] = [
      concept(id, '거리의 비', '두 무게중심 사이의 거리', 'GG′=BC÷3', [
        ch('두 삼각형의 중선', [cue(0, 'D는 BC의 중점이고 P, Q는 BD, DC의 중점이에요.'), cue(6, 'G는 ABD, G′는 ADC의 무게중심이에요.', 1)]),
        ch('같은 길이와 같은 비', [cue(0, 'PQ=PD+DQ=BC÷2예요.', 2), cue(6, 'AG:AP=AG′:AQ=2:3이고 A의 각이 공통이에요.', 2)]),
        ch('닮음비와 밑변의 비 연결', [cue(0, '△AGG′∽△APQ이므로 GG′는 PQ의 3분의 2예요.', 2), finish(6, '절반의 3분의 2이므로 GG′=BC÷3이에요.', 3)])
      ], 'G, G′가 각각 △ABD, △ADC의 무게중심일 때 GG′와 BC의 길이를 비교해 보세요.'),
      ...[0, 1].map(kind => problem(id, kind, kind ? '밑변 BC' : '거리 GG′', '두 무게중심의 길이 계산', `x=${kind ? BC : GG}`, [
        ch('무게중심이 속한 삼각형', [cue(0, 'G는 ABD, G′는 ADC의 무게중심이에요.'), cue(6, kind ? `GG′=${GG}이고 밑변 BC가 x예요.` : `BC=${BC}이고 두 점 사이 GG′가 x예요.`, 1)]),
        ch('중점과 닮음 연결', [cue(0, 'P, Q를 각 밑변의 중점으로 잡으면 PQ=BC÷2예요.', 2), calc(6, '△AGG′∽△APQ의 비가 2:3이라 GG′=BC÷3예요.', 3)]),
        ch('방향을 확인하고 계산', [cue(0, kind ? `전체 BC는 GG′의 세 배라 ${GG}×3이에요.` : `GG′는 BC의 3분의 1이라 ${BC}÷3이에요.`, 3), finish(6, `따라서 x=${kind ? BC : GG}예요. 중점 간 거리 PQ와 구별해요.`)])
      ]))
    ];
  }
  {
    const id = 'sm8-chain', p = fixed(id), S = 18 * p.c;
    lessons[id] = [
      concept(id, '넓이의 비', '연속하는 무게중심의 넓이', '△G′BD=△ABC÷18', [
        ch('첫 번째 무게중심의 높이', [cue(0, 'G는 ABC의 무게중심이고 D는 BC의 중점이에요.'), cue(6, 'GD는 AD의 3분의 1이라 GBC 넓이도 전체의 3분의 1이에요.', 1)]),
        ch('기준 삼각형을 바꾸기', [cue(0, '이번 G′는 ABC가 아니라 GBC의 무게중심이에요.', 2), cue(6, 'G′BC의 넓이는 GBC의 3분의 1로 한 번 더 줄어요.', 2)]),
        ch('마지막에 중점으로 나누기', [cue(0, 'BD=DC이고 높이가 같아 G′BD는 G′BC의 절반이에요.', 2), finish(6, '3으로 두 번, 2로 한 번 나누어 △G′BD=△ABC÷18예요.', 3)])
      ], 'G는 △ABC, G′는 △GBC의 무게중심일 때 △G′BD와 △ABC의 넓이를 비교해 보세요.', { smGay: 7 }),
      ...[0, 1].map(kind => problem(id, kind, kind ? '전체 넓이' : '작은 넓이', '연속 무게중심 넓이 계산', `x=${kind ? S : p.c}`, [
        ch('두 무게중심과 주어진 넓이', [cue(0, kind ? `작은 삼각형 G′BD의 넓이는 ${p.c}예요.` : `전체 삼각형 ABC의 넓이는 ${S}예요.`), cue(6, 'G는 ABC, G′는 GBC의 무게중심이에요.', 1)]),
        ch('두 번 바뀌는 기준', [cue(0, 'GBC는 ABC의 3분의 1, G′BC는 GBC의 3분의 1이에요.', 2), calc(6, 'D가 BC의 중점이므로 G′BD는 G′BC의 절반이에요.', 3)]),
        ch('전체와 부분 방향 확인', [cue(0, kind ? `전체로 돌아가려면 ${p.c}×2×3×3을 계산해요.` : `${S}÷3÷3÷2로 작은 영역까지 내려가요.`, 4), finish(6, `따라서 x=${kind ? S : p.c}예요. 마지막 절반까지 반영했어요.`)])
      ]))
    ];
  }

  // These hooks are read by the lesson-only route. Exploration and manual
  // current-question solving retain the original source drawing and controls.
  for (const id of Object.keys(lessons).filter(id => /^sm[678]-/.test(id))) {
    const D = source(id);
    D.lessonQuestion = (M, s) => s.smLessonProblem ? null : s.smCQuestion || D.question;
    D.lessonDraw = (b, s, M, C, sol) => {
      if (s.smLessonProblem) {
        const stage = C.answer ? sol.steps.length : Math.max(1, Math.min(sol.steps.length - 1, C.step || 1));
        G.drawSolution(b, D, s, M, { ...C, step: stage }, sol);
      } else D.draw(b, s, M, { ...C, problem: false, review: true, txt: false,
        step: C.answer ? 3 : Math.min(2, C.step || 0), t: s.smGr || 0 });
      const g = s.smLessonProblem ? G.solutionGeometry(id, M.pk) : id === 'sm8-six' ? G.geo.sixGeo(s, false, M.u)
        : id === 'sm8-gg' ? G.geo.ggGeo(s, false, M.k) : id === 'sm8-chain' ? G.geo.chGeo(s, false, M.c) : M;
      if (!s.smLessonProblem && !C.entry) {
        if (/^sm6-(trio|ab2|ac2|ah2)$/.test(id) && C.step >= 2) {
          G.ang(b, g.A, g.B, g.H, { color: 'rose', rings: 1, r: 21 });
          G.ang(b, g.C, g.A, g.B, { color: 'rose', rings: 1, r: 21 });
          G.ang(b, g.A, g.H, g.C, { color: 'violet', rings: 2, r: 25 });
          G.ang(b, g.B, g.A, g.C, { color: 'violet', rings: 2, r: 25 });
        }
        if (id === 'sm8-six' && C.step > 0) {
          const pairs = C.step === 1 ? [[g.G, g.B, g.D], [g.G, g.D, g.C]] : [[g.G, g.A, g.B], [g.G, g.B, g.D]];
          if (!C.answer) for (const [i, triangle] of pairs.entries()) { G.fillPoly(b, triangle, i ? 'green' : 'sky', .18); G.poly(b, triangle, i ? 'green' : 'sky', 3.8); }
        }
      }
      const pair = id === 'sm7-shadow' ? [g.A, g.Atop] : id === 'sm7-river' ? [g.Q, g.D]
        : id === 'sm8-proof' || id === 'sm8-chain' ? [g.A, g.D] : id === 'sm8-six' ? [g.B, g.D]
          : id === 'sm8-gg' ? [g.B, g.C] : id === 'sm6-area' ? [g.A, g.B] : [g.A, g.H];
      const trace = C.entry ? 0 : Math.max(0, Math.min(1, s.smCTrace || 0));
      if (trace > 0) G.line(b, pair[0], G.lerp(pair[0], pair[1], trace), 'amber', 4.8, { alpha: .75 });
    };
  }
})();
