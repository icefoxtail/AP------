/* 평행선·중점·이등분선의 고정 원클릭 해설. 원본문항과 기하 생성기를 그대로 쓴다. */
(function () {
  'use strict';
  const G = window.APL_SM;
  if (!G) return;
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g8-similarity'] = window.APL_LESSONS['g8-similarity'] || {};
  const scenes = (window.APL_SM_GROUPS || []).flatMap(g => g.scenes);
  const ids = ['sm4-conv', 'sm4-x', 'sm4-ef', 'sm4-mid', 'sm4-four', 'sm4-vari', 'sm4-bis', 'sm4-bisx', 'sm5-lmn', 'sm5-trap', 'sm5-tmid'];
  const definitions = Object.fromEntries(ids.map(id => [id, scenes.find(s => s.id === id).sm]));
  const key = (id, kind = 0) => ({ ...definitions[id].gen(1), kind });
  function make(id, label, answer, lines, options = {}) {
    const chapters = [
      { title: '주어진 조건과 목표', length: 12, start: { smBTrace: 0 }, cues: [
        { at: 0, say: lines[0], to: { smBTrace: 1 }, dur: 4, set: {
          smLessonProblem: !options.concept, smShowAnswer: false, smCalculationReady: false,
          smSeed: 0, smPk: options.pk || key(id), smBMode: options.mode || '', smBQuestion: options.question || ''
        } },
        { at: 6, say: lines[1], step: 1 }
      ] },
      { title: '대응 관계와 보조선', length: 12, cues: [
        { at: 0, say: lines[2], step: 2 }, { at: 6, say: lines[3] }
      ] },
      { title: '관계식에 조건 적용', length: 12, cues: [
        { at: 0, say: lines[4], step: 3, set: { smCalculationReady: true } }, { at: 6, say: lines[5] }
      ] },
      { title: '구한 결과 확인', length: 12, cues: [
        { at: 0, say: lines[6], step: 5, set: { smShowAnswer: true } }, { at: 6, say: lines[7] }
      ] }
    ];
    return { title: definitions[id].short + ' 해설', label, tab: 'review', answer, answerText: answer,
      summary: '평행과 중점 조건을 대응 관계로 연결해요', task: '직접 해 보기에서 길이를 바꾸고 같은 관계가 유지되는지 확인해 보세요', chapters };
  }
  const concept = (id, label, answer, question, lines, mode = '') => make(id, label, answer, lines, { concept: true, question, mode });
  const problem = (id, kind, label, answer, lines) => make(id, label, answer, lines, { pk: key(id, kind) });

  {
    const id = 'sm4-conv', p = key(id), d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1);
    const ad = p.p * d, db = p.p * (p.N - d), ae = p.q * d, ec = p.q * (p.N - d), de = p.rr * d, bc = p.rr * p.N;
    lessons[id] = [
      concept(id, '평행의 비', 'AD:AB=AE:AC=DE:BC', 'DE∥BC일 때, 작은 삼각형과 큰 삼각형의 대응변의 비는 어떻게 될까요?', [
        'D는 AB 위, E는 AC 위에 있고 DE∥BC예요.', '작은 △ADE와 전체 △ABC를 비교해요.',
        '평행선에서 ∠ADE와 ∠ABC는 동위각이에요.', '∠DAE와 ∠BAC는 같은 꼭짓점의 공통각이에요.',
        '두 각이 같아서 △ADE와 △ABC는 AA 닮음이에요.', '작은 변과 전체 변을 같은 순서로 짝지어요.',
        '따라서 AD:AB=AE:AC=DE:BC예요.', '전체 AB와 남은 조각 DB를 혼동하지 않아요.'
      ]),
      concept(id, '평행 조건', 'DE∥BC', 'AD:DB=AE:EC이면 DE와 BC가 평행한 이유를 설명해 보세요.', [
        'D와 E가 두 변을 같은 비로 나눈다고 해요.', '조건은 AD:DB=AE:EC예요.',
        '같은 비의 앞뒤 조각을 더해 전체 변을 만들어요.', '그러면 AD:AB=AE:AC도 같아져요.',
        '끼인각 ∠A가 공통이므로 SAS 닮음이에요.', '대응하는 ∠ADE와 ∠ABC의 크기가 같아요.',
        '동위각이 같으므로 DE∥BC가 성립해요.', '한쪽 점만 중점인 것으로는 평행을 보장하지 못해요.'
      ], 'converse'),
      problem(id, 0, 'EC 길이', `EC=${ec}`, [
        `AD=${ad}, DB=${db}, AE=${ae}이고 EC=x예요.`, 'DE∥BC에서 두 변이 나뉜 비를 찾아요.',
        '동위각과 공통각으로 △ADE∽△ABC예요.', 'AD:DB는 AE:EC와 대응하는 조각의 비예요.',
        `${ad}:${db}=${ae}:x로 비례식을 세워요.`, `EC는 ${ae}×${db}÷${ad}로 계산해요.`,
        `따라서 EC=${ec} cm가 정답이에요.`, 'AE와 EC를 더한 전체 AC를 묻는 문제는 아니에요.'
      ]),
      problem(id, 1, 'DE 길이', `DE=${de}`, [
        `AD=${ad}, DB=${db}, BC=${bc}이고 DE=x예요.`, 'DE∥BC이고 작은 밑변의 길이를 구해요.',
        '△ADE와 △ABC는 두 각이 같아 닮음이에요.', `큰 변 AB=${ad}+${db}=${ad + db}를 먼저 구해요.`,
        `DE:BC=AD:AB이므로 x:${bc}=${ad}:${ad + db}예요.`, `작은 밑변은 ${bc}×${ad}÷${ad + db}로 계산해요.`,
        `따라서 DE=${de} cm가 정답이에요.`, '밑변의 비에는 AD:DB가 아닌 AD:AB를 써요.'
      ]),
      problem(id, 2, 'x+y', `x+y=${ae + de}`, [
        `AD=${ad}, DB=${db}, EC=${ec}, BC=${bc}예요.`, 'AE=x, DE=y이고 두 길이의 합을 구해요.',
        '평행선에서 △ADE∽△ABC인 것을 확인해요.', `전체 AB=${ad + db}와 조각 DB=${db}를 구별해요.`,
        `x는 조각의 비로 ${ec}×${ad}÷${db}예요.`, `y는 전체의 비로 ${bc}×${ad}÷${ad + db}예요.`,
        `x=${ae}, y=${de}이므로 x+y=${ae + de}예요.`, '서로 다른 두 비례식으로 구한 값을 마지막에 더해요.'
      ])
    ];
  }
  {
    const id = 'sm4-x', p = key(id), g = G.geo.xGeo(p.m, p.n, p.r);
    lessons[id] = [concept(id, '대응 순서', '△OAD∽△OCB', 'AD∥BC인 X자형에서 OAD와 닮은 삼각형의 대응 순서를 찾아보세요.', [
      'AD∥BC이고 두 직선은 O에서 만나요.', '위쪽의 A는 아래쪽 어느 점과 대응할까요?',
      '∠AOD와 ∠COB는 맞꼭지각이라 같아요.', '평행선의 엇각으로 A와 C의 각도 같아요.',
      'O↔O, A↔C, D↔B 순서로 대응해요.', '같은 쪽 점이 아니라 마주 보는 점을 짝지어요.',
      '따라서 △OAD∽△OCB인 AA 닮음이에요.', 'OA:OC=OD:OB=AD:CB를 같은 순서로 읽어요.'
    ]),
    problem(id, 0, 'BC 길이', `BC=${g.BC}`, [
      `OA=${g.OA}, OC=${g.OC}, AD=${g.AD}이고 BC=x예요.`, 'AD와 BC의 평행 표시를 확인해요.',
      '맞꼭지각과 엇각으로 △OAD∽△OCB예요.', 'OA와 OC, AD와 CB가 각각 대응해요.',
      `${g.OA}:${g.OC}=${g.AD}:x로 놓아요.`, `BC는 ${g.AD}×${g.OC}÷${g.OA}로 계산해요.`,
      `따라서 BC=${g.BC} cm가 정답이에요.`, '큰 삼각형이 위쪽인지 아래쪽인지 직접 확인해요.'
    ]),
    problem(id, 1, 'OA 길이', `OA=${g.OA}`, [
      `OC=${g.OC}, OD=${g.OD}, OB=${g.OB}이고 OA=x예요.`, '평행한 밑변과 O의 맞꼭지각을 확인해요.',
      '△OAD∽△OCB에서 A↔C, D↔B예요.', 'OA:OC와 OD:OB는 같은 닮음비예요.',
      `x:${g.OC}=${g.OD}:${g.OB}로 놓아요.`, `OA는 ${g.OC}×${g.OD}÷${g.OB}로 계산해요.`,
      `따라서 OA=${g.OA} cm가 정답이에요.`, 'OA와 OB를 대응변으로 잡으면 비례식이 달라져요.'
    ])];
  }
  {
    const id = 'sm4-ef', p = key(id), g = G.geo.efGeo(p.m, p.n);
    lessons[id] = [concept(id, '교점 원리', 'EO=OF', '두 대각선의 교점 O를 지나는 평행선 EF는 O에서 어떻게 나뉠까요?', [
      'AD∥EF∥BC이고 O는 두 대각선의 교점이에요.', 'EO와 OF를 각각 작은 삼각형에서 살펴봐요.',
      'X자형 △AOD와 △COB는 AA 닮음이에요.', 'AO:OC=DO:OB이므로 전체에 대한 비도 같아요.',
      '△AEO∽△ABC, △DFO∽△DCB를 이용해요.', 'EO와 OF는 같은 BC에 같은 비를 곱한 길이예요.',
      '따라서 EO=OF, O가 EF를 이등분해요.', 'EF는 두 밑변의 평균인 중간평행선과 달라요.'
    ]),
    ...[0, 1].map(kind => problem(id, kind, kind ? 'EO 길이' : 'EF 길이', `${kind ? 'EO' : 'EF'}=${kind ? g.EO : g.EF}`, [
      `AD=${g.AD}, BC=${g.BC}이고 EF는 O를 지나요.`, kind ? '구할 것은 E에서 O까지의 길이 x예요.' : '구할 것은 E에서 F까지 전체 길이 x예요.',
      `△AOD∽△COB에서 AO:OC=${p.m}:${p.n}예요.`, `전체 AC에 대한 AO의 비는 ${p.m}:${p.m + p.n}예요.`,
      '△AEO∽△ABC이므로 EO:BC=AO:AC예요.', kind ? `EO는 ${g.BC}×${p.m}÷${p.m + p.n}로 구해요.` : `EO는 ${g.BC}×${p.m}÷${p.m + p.n}이고 OF도 같아요.`,
      kind ? `따라서 EO=${g.EO} cm가 정답이에요.` : `EF=${g.EO}+${g.EO}=${g.EF} cm가 정답이에요.`,
      '교점을 지나는 조건을 중점 조건으로 바꾸면 안 돼요.'
    ]))];
  }
  {
    const id = 'sm4-mid', p = key(id), g = G.geo.midGeo(p.p, p.q, p.r);
    lessons[id] = [
      concept(id, '중점 원리', 'DE∥BC, DE=BC÷2', 'D, E가 AB, AC의 중점이면 DE와 BC는 어떤 관계일까요?', [
        'D와 E는 각각 AB와 AC의 중점이에요.', '같은 변 위의 두 조각에 같은 눈금이 있어요.',
        'AD:AB=AE:AC=1:2이고 끼인각 A는 공통이에요.', '△ADE와 △ABC는 SAS 닮음이에요.',
        '대응각이 같아져 DE와 BC의 방향이 같아져요.', '대응변의 길이에는 작은 쪽 대 큰 쪽의 비를 써요.',
        '따라서 DE∥BC, DE=BC÷2가 성립해요.', '두 변의 중점이라는 조건이 모두 필요해요.'
      ]),
      concept(id, '둘레 원리', '둘레의 비는 1:2', '두 중점을 이은 작은 삼각형과 전체 삼각형의 둘레를 비교해 보세요.', [
        'D와 E가 중점인 △ADE와 △ABC를 보아요.', '둘레는 각 삼각형의 세 변을 더한 길이예요.',
        '두 변의 비와 끼인각으로 두 삼각형은 닮음이에요.', 'AD, AE, DE는 각각 큰 대응변의 절반이에요.',
        '각각 절반인 세 길이를 모두 더해요.', '합도 전체 세 변의 합의 절반으로 묶여요.',
        '따라서 작은 쪽 대 큰 쪽 둘레의 비는 1:2예요.', '둘레의 비를 넓이의 비 1:4와 구별해요.'
      ]),
      ...[0, 1, 2].map(kind => problem(id, kind, ['DE 길이', 'BC 길이', '작은둘레'][kind], [ `DE=${g.DE}`, `BC=${g.BC}`, `둘레=${g.per1}` ][kind], [
        ['BC=' + g.BC + '이고 중점을 이은 DE=x예요.', 'DE=' + g.DE + '이고 전체 밑변 BC=x예요.', `AB=${g.AB}, AC=${g.AC}, BC=${g.BC}예요.`][kind],
        kind === 2 ? '△ADE의 세 변을 더한 둘레를 구해요.' : 'D와 E가 각각 두 변의 중점인지 확인해요.',
        'AD:AB=AE:AC=1:2이고 각 A가 공통이에요.', 'SAS 닮음에서 작은 변은 큰 변의 절반이에요.',
        ['DE=BC÷2로 계산해요.', 'BC=2×DE로 계산해요.', '세 변을 각각 반으로 나누고 더해요.'][kind],
        [ `${g.BC}을 2로 나누면 돼요.`, `${g.DE}에 2를 곱하면 돼요.`, `(${g.AB}+${g.AC}+${g.BC})÷2로 계산해요.` ][kind],
        [ `DE=${g.DE} cm가 정답이에요.`, `BC=${g.BC} cm가 정답이에요.`, `따라서 둘레=${g.per1} cm가 정답이에요.` ][kind],
        kind === 2 ? '두 변만 더하지 말고 중점을 이은 DE도 더해요.' : '전체 변과 그 절반인 선분을 구분해요.'
      ]))
    ];
  }
  {
    const id = 'sm4-four', p = key(id), g = G.geo.fourGeo(p.t);
    lessons[id] = [
      concept(id, '합동 원리', '네 삼각형은 SSS 합동', '삼각형의 세 중점을 이으면 생기는 네 삼각형의 모양과 크기를 비교해 보세요.', [
        'D, E, F는 AB, BC, CA의 중점이에요.', '세 중점을 이어 네 개의 작은 삼각형을 만들어요.',
        '중점연결정리로 DE는 AC의 절반이에요.', 'EF는 AB의 절반, FD는 BC의 절반이에요.',
        '각 작은 삼각형에 같은 세 길이가 하나씩 있어요.', '세 변의 길이를 대응시켜 비교해요.',
        '따라서 네 삼각형은 SSS 합동이에요.', '모양과 크기가 같으므로 넓이도 서로 같아요.'
      ]),
      concept(id, '넓이 원리', '각 넓이는 전체의 1/4', '세 중점을 이은 삼각형 DEF의 넓이는 전체 삼각형의 얼마일까요?', [
        '세 중점을 이으면 삼각형이 네 부분으로 나뉘어요.', '겹치거나 빠지는 부분 없이 전체를 채워요.',
        '중점연결정리로 작은 삼각형들의 세 변을 비교해요.', '각각 원래 세 변의 절반을 변으로 가져요.',
        'SSS 합동인 네 삼각형은 넓이가 같아요.', '전체 넓이를 같은 네 몫으로 나누어요.',
        '따라서 각 넓이는 전체의 1/4이에요.', '길이와 둘레는 절반이지만 넓이는 네 몫이에요.'
      ]),
      problem(id, 0, 'DEF 둘레', `둘레=${g.per2}`, [
        `AB=${g.AB}, AC=${g.AC}, BC=${g.BC}예요.`, '세 변의 중점을 이은 △DEF의 둘레를 구해요.',
        'DE와 AC, EF와 AB, FD와 BC가 대응해요.', '중점연결정리로 각각 큰 변의 절반이에요.',
        `DE=${4 * p.t}, EF=${3 * p.t}, FD=${5 * p.t}예요.`, `둘레는 ${4 * p.t}+${3 * p.t}+${5 * p.t}로 구해요.`,
        `따라서 둘레=${g.per2} cm가 정답이에요.`, '넓이처럼 4로 나누는 계산을 하지 않아요.'
      ]),
      problem(id, 1, 'DEF 넓이', `넓이=${g.s4}`, [
        `직각삼각형의 두 직각변은 ${g.AB}, ${g.AC}예요.`, 'D, E, F가 중점일 때 △DEF의 넓이를 구해요.',
        '중점연결정리로 네 작은 삼각형은 SSS 합동이에요.', '따라서 네 부분의 넓이는 서로 같아요.',
        `전체 넓이는 ${g.AB}×${g.AC}÷2=${g.S}예요.`, `전체 ${g.S}를 네 몫으로 나누어요.`,
        `따라서 넓이=${g.s4} cm²가 정답이에요.`, '둘레의 절반과 넓이의 4분의 1을 구분해요.'
      ])
    ];
  }
  {
    const id = 'sm4-vari', p = key(id);
    lessons[id] = [
      concept(id, '도형 원리', 'EFGH는 평행사변형', '사각형의 네 변의 중점을 차례로 이으면 어떤 사각형이 될까요?', [
        'E, F, G, H는 사각형 네 변의 중점이에요.', '원래 사각형의 모양은 특별히 제한하지 않아요.',
        '대각선 AC를 그어 중점연결정리를 두 번 써요.', 'EF와 HG는 각각 AC와 평행하고 길이도 같아요.',
        '다른 대각선 BD에서도 FG와 EH를 비교해요.', '두 쌍의 대변이 각각 평행한 것을 확인해요.',
        '따라서 EFGH는 평행사변형이에요.', '원래 사각형의 네 변이 같을 필요는 없어요.'
      ]),
      concept(id, '둘레 원리', '둘레=AC+BD', '네 변의 중점을 이은 사각형의 둘레는 원래 대각선과 어떤 관계일까요?', [
        '중점을 이은 EFGH의 네 변을 더해요.', '원래 사각형의 대각선 AC와 BD를 그어요.',
        'EF와 HG는 각각 AC의 절반이에요.', 'FG와 EH는 각각 BD의 절반이에요.',
        'AC의 절반 두 개를 더하면 AC가 돼요.', 'BD의 절반 두 개를 더하면 BD가 돼요.',
        '따라서 둘레=AC+BD예요.', '원래 네 변의 합이 아니라 두 대각선의 합이에요.'
      ]),
      ...[0, 1].map(kind => problem(id, kind, kind ? 'BD 길이' : '중점둘레', kind ? `BD=${p.bb}` : `둘레=${p.a + p.bb}`, [
        kind ? `AC=${p.a}, 중점을 이은 둘레는 ${p.a + p.bb}예요.` : `두 대각선은 AC=${p.a}, BD=${p.bb}예요.`,
        'E, F, G, H가 네 변의 중점임을 확인해요.',
        'EF=HG=AC÷2를 중점연결정리로 얻어요.', 'FG=EH=BD÷2도 같은 방법으로 얻어요.',
        '네 변을 더하면 중점사각형의 둘레=AC+BD예요.',
        kind ? `BD는 주어진 둘레에서 ${p.a}를 빼서 구해요.` : `${p.a}과 ${p.bb}를 더해 둘레를 구해요.`,
        kind ? `따라서 BD=${p.bb} cm가 정답이에요.` : `따라서 둘레=${p.a + p.bb} cm가 정답이에요.`,
        '대각선 하나의 절반만 답으로 쓰지 않아요.'
      ]))
    ];
  }
  {
    const id = 'sm4-bis', p = key(id), g = G.geo.bisGeo(p.m, p.n), r = `${p.m / G.gcd(p.m, p.n)}:${p.n / G.gcd(p.m, p.n)}`;
    lessons[id] = [concept(id, '내각 원리', 'BD:DC=AB:AC', '내각의 이등분선 AD는 대변 BC를 어떤 비로 나눌까요?', [
      'AD가 ∠BAC를 크기가 같은 두 각으로 나눠요.', 'D는 변 BC 위에 있고 두 조각의 비를 찾아요.',
      'C를 지나 AD와 평행하게 그어 BA 연장선과 E에서 만나요.', '평행선의 같은 각으로 ∠ACE=∠AEC예요.',
      '△ACE는 이등변삼각형이라 AE=AC예요.', '△BCE 안의 평행선 AD에서 두 변의 조각을 비교해요.',
      '따라서 BD:DC=AB:AC가 성립해요.', '각을 이등분해도 BC를 같은 길이로 나누지는 않아요.'
    ]),
    ...[0, 1, 2].map(kind => problem(id, kind, ['BD 길이', 'DC 길이', '분할 비'][kind], [ `BD=${g.BD}`, `DC=${g.DC}`, `BD:DC=${r}` ][kind], [
      `AB=${g.AB}, AC=${g.AC}이고 AD는 내각 이등분선이에요.`,
      kind === 0 ? `BC=${g.BC}에서 BD=x를 구해요.` : kind === 1 ? `BD=${g.BD}에서 DC=x를 구해요.` : 'BD:DC를 가장 간단한 자연수의 비로 나타내요.',
      'C에서 AD와 평행한 보조선 CE를 그어요.', '같은 각으로 AE=AC이고 대응하는 조각의 비가 같아요.',
      kind === 2 ? 'BD:DC는 AB:AC와 같은 순서의 비예요.' : `BD:DC=${p.m}:${p.n}을 이용해요.`,
      kind === 0 ? `${g.BC}×${p.m}÷${p.m + p.n}로 BD를 구해요.` : kind === 1 ? `${g.BD}×${p.n}÷${p.m}로 DC를 구해요.` : `${g.AB}:${g.AC}의 두 항을 공약수로 나누어요.`,
      kind === 0 ? `따라서 BD=${g.BD} cm가 정답이에요.` : kind === 1 ? `따라서 DC=${g.DC} cm가 정답이에요.` : `따라서 BD:DC=${r}가 정답이에요.`,
      'AB 쪽 조각은 BD, AC 쪽 조각은 DC예요.'
    ]))];
  }
  {
    const id = 'sm4-bisx', p = key(id), g = G.geo.bisxGeo(p.n, p.g0);
    lessons[id] = [concept(id, '외각 원리', 'BD:CD=AB:AC', '외각 이등분선 AD와 BC의 연장선이 만날 때 두 길이의 비를 비교해 보세요.', [
      'AD가 A의 외각을 이등분하고 D는 C 바깥에 있어요.', 'BD는 BC와 CD를 합한 전체 길이예요.',
      'A에서 만들어진 같은 두 외각을 확인해요.', '외각 이등분선의 대응은 BD↔AB, CD↔AC예요.',
      '두 길이의 비를 쓸 때 C에서 D까지를 CD라 해요.', '내각 때의 합과 달리 BD−CD가 BC예요.',
      '따라서 BD:CD=AB:AC가 성립해요.', '외분에서는 두 비의 차가 가운데 BC에 대응해요.'
    ]),
    ...[0, 1].map(kind => problem(id, kind, kind ? 'BD 길이' : 'CD 길이', `${kind ? 'BD' : 'CD'}=${kind ? g.BD : g.CD}`, [
      `AB=${g.AB}, AC=${g.AC}, BC=${g.BC}예요.`, `AD가 외각을 이등분하고 ${kind ? 'BD' : 'CD'}=x예요.`,
      `외각 이등분선에서 BD:CD=${g.AB}:${g.AC}예요.`, 'D가 C 바깥이므로 BD−CD=BC예요.',
      `비의 차 ${g.AB}−${g.AC}=${p.g0}이 BC에 해당해요.`, `한 몫은 ${g.BC}÷${p.g0}이고 ${kind ? g.AB : g.AC}몫을 구해요.`,
      `${kind ? 'BD' : 'CD'}=${kind ? g.BD : g.CD} cm가 정답이에요.`, '두 길이를 더해 BC로 놓는 내분 식을 쓰지 않아요.'
    ]))];
  }
  {
    const id = 'sm5-lmn', p = key(id), g = G.geo.lmnGeo(p.a, p.bb, p.u);
    lessons[id] = [
      concept(id, '조각의 비', 'AB:BC=DE:EF', '세 평행선이 두 직선을 나누면 이웃한 조각의 비는 어떻게 될까요?', [
        '세 직선 l, m, n이 서로 평행해요.', '같은 평행선 사이의 AB와 DE, BC와 EF를 짝지어요.',
        'A를 지나 DF와 평행한 보조선 AN을 그어요.', '평행사변형에서 AM=DE, MN=EF를 얻어요.',
        '△ABM과 △ACN은 동위각과 공통각으로 닮아요.', '작은 조각과 남은 조각의 비도 같아져요.',
        '따라서 AB:BC=DE:EF가 성립해요.', '다른 높이의 조각을 서로 짝짓지 않아요.'
      ]),
      concept(id, '전체의 비', 'AB:AC=DE:DF', '위쪽 조각과 전체 길이의 비를 두 직선에서 비교해 보세요.', [
        '세 평행선 사이에서 AC와 DF는 전체 길이예요.', 'AC=AB+BC, DF=DE+EF를 먼저 구분해요.',
        'A를 지나 DF와 평행한 보조선 AN을 그어요.', 'AM=DE, AN=DF는 평행사변형의 같은 대변이에요.',
        '△ABM∽△ACN에서 AB:AC=AM:AN이에요.', '오른쪽 선분을 DE와 DF로 바꾸어 읽어요.',
        '따라서 AB:AC=DE:DF예요.', '전체 DF를 아래쪽 조각 EF로 바꾸지 않아요.'
      ]),
      ...[0, 1, 2].map(kind => problem(id, kind, ['EF 길이', 'BC 길이', 'DE 길이'][kind], [`EF=${g.d}`, `BC=${g.bb}`, `DE=${g.c}`][kind], [
        [ `AB=${g.a}, BC=${g.bb}, DE=${g.c}예요.`, `AB=${g.a}, DE=${g.c}, EF=${g.d}예요.`, `AB=${g.a}, BC=${g.bb}, DF=${g.c + g.d}예요.` ][kind],
        `세 직선이 평행할 때 ${['EF', 'BC', 'DE'][kind]}=x를 구해요.`,
        'A에서 DF와 평행한 선 AN을 그어요.', '평행사변형과 AA 닮음으로 대응비를 정해요.',
        kind === 2 ? 'AB:AC=DE:DF로 전체 길이끼리 짝지어요.' : 'AB:BC=DE:EF로 같은 위치의 조각을 짝지어요.',
        [ `EF는 ${g.c}×${g.bb}÷${g.a}로 계산해요.`, `BC는 ${g.a}×${g.d}÷${g.c}로 계산해요.`, `DE는 ${g.c + g.d}×${g.a}÷${g.a + g.bb}로 계산해요.` ][kind],
        [ `EF=${g.d} cm가 정답이에요.`, `BC=${g.bb} cm가 정답이에요.`, `DE=${g.c} cm가 정답이에요.` ][kind],
        '평행선 사이의 조각과 전체 선분을 구분해요.'
      ]))
    ];
  }
  {
    const id = 'sm5-trap', p = key(id), g = G.geo.trGeo(p.a, p.m, p.n, p.t);
    lessons[id] = [concept(id, '평행선 원리', 'EF=AD+(BC−AD)×AE÷AB', '사다리꼴 안의 평행선 EF는 두 밑변과 나뉜 비로 어떻게 구할까요?', [
      'AD∥EF∥BC이고 E는 옆변 AB 위에 있어요.', 'A를 지나 DC와 평행한 보조선 AH를 생각해요.',
      'AH가 EF와 만나는 점을 G, BC와 만나는 점을 H라 해요.', '평행사변형에서 GF=HC=AD예요.',
      '△AEG∽△ABH이므로 EG:BH=AE:AB예요.', 'BH는 BC−AD이고 EF는 EG에 AD를 더한 길이예요.',
      'EF=AD+(BC−AD)×AE÷AB예요.', 'E가 중점인 경우에만 두 밑변의 평균이 돼요.'
    ]),
    ...[0, 1].map(kind => problem(id, kind, kind ? 'BC 길이' : 'EF 길이', `${kind ? 'BC' : 'EF'}=${kind ? g.BC : g.EF}`, [
      kind ? `AD=${g.AD}, EF=${g.EF}이고 BC=x예요.` : `AD=${g.AD}, BC=${g.BC}이고 EF=x예요.`,
      `평행선이 옆변을 AE:EB=${p.m}:${p.n}으로 나눠요.`,
      'AH∥DC를 그어 EF와 G, BC와 H에서 만나요.', 'GF=HC=AD이므로 밑변에서 AD만큼을 떼어내요.',
      `△AEG∽△ABH에서 EG:BH=${p.m}:${p.m + p.n}예요.`,
      kind ? `BH=(${g.EF}−${g.AD})×${p.m + p.n}÷${p.m}예요.` : `EG=(${g.BC}−${g.AD})×${p.m}÷${p.m + p.n}예요.`,
      kind ? `BC=${g.AD}+${g.BC - g.AD}=${g.BC} cm예요.` : `EF=${g.AD}+${g.EG}=${g.EF} cm예요.`,
      '구한 삼각형 조각에 AD를 다시 더해야 해요.'
    ]))];
  }
  {
    const id = 'sm5-tmid', p = key(id), g = G.geo.midTrGeo(p.a0, p.b0);
    lessons[id] = [
      concept(id, '중간선 원리', 'EF=(AD+BC)÷2', '두 옆변의 중점을 이은 EF의 길이를 두 밑변으로 나타내 보세요.', [
        'AD∥BC이고 E, F는 두 옆변의 중점이에요.', '대각선 BD, AC와 EF의 교점을 P, Q라 해요.',
        '중점연결정리로 EQ는 BC의 절반이에요.', 'QF는 AD의 절반이에요.',
        'EF는 EQ와 QF를 더한 전체 선분이에요.', '두 밑변을 각각 반으로 나눈 뒤 더해요.',
        '따라서 EF=(AD+BC)÷2가 성립해요.', '중점 조건이 없으면 두 밑변의 평균을 쓸 수 없어요.'
      ]),
      concept(id, '교점 사이', 'PQ=(BC−AD)÷2', '중간평행선 위의 두 대각선 교점 P와 Q 사이의 길이를 구해 보세요.', [
        'E, F가 중점이고 AD보다 BC가 긴 사다리꼴이에요.', 'EF 위에서 점의 순서는 E, P, Q, F예요.',
        '중점연결정리에서 EQ는 BC의 절반이에요.', 'EP는 AD의 절반이에요.',
        'PQ는 EQ에서 EP를 뺀 가운데 부분이에요.', '밑변 길이의 합이 아니라 차를 이용해요.',
        '따라서 PQ=(BC−AD)÷2가 성립해요.', 'EF 전체를 구하는 식과 가운데 PQ의 식을 구별해요.'
      ]),
      ...[0, 1, 2].map(kind => problem(id, kind, ['EF 길이', 'BC 길이', 'PQ 길이'][kind], [`EF=${g.EF}`, `BC=${g.BC}`, `PQ=${g.PQ}`][kind], [
        kind === 1 ? `AD=${g.AD}, EF=${g.EF}이고 BC=x예요.` : `AD=${g.AD}, BC=${g.BC}인 사다리꼴이에요.`,
        kind === 2 ? '두 대각선이 중간평행선과 만나는 P, Q 사이를 구해요.' : 'E와 F가 두 옆변의 중점이라는 조건을 확인해요.',
        '대각선으로 나눈 삼각형에 중점연결정리를 써요.', 'EQ=BC÷2, EP=QF=AD÷2를 얻어요.',
        kind === 2 ? 'PQ=EQ−EP이므로 두 밑변의 차를 반으로 나눠요.' : 'EF=EQ+QF이므로 두 밑변의 합을 반으로 나눠요.',
        [ `(${g.AD}+${g.BC})÷2로 EF를 계산해요.`, `2×${g.EF}−${g.AD}로 BC를 계산해요.`, `(${g.BC}−${g.AD})÷2로 PQ를 계산해요.` ][kind],
        [ `EF=${g.EF} cm가 정답이에요.`, `BC=${g.BC} cm가 정답이에요.`, `PQ=${g.PQ} cm가 정답이에요.` ][kind],
        kind === 2 ? '교점 사이에는 밑변의 합이 아니라 차를 써요.' : '물어본 길이가 중간선인지 밑변인지 확인해요.'
      ]))
    ];
  }

  // These hooks reuse the exact original geometry and proof overlays. Concept
  // diagrams omit numeric question labels; all numerical problems keep all five
  // original choices and the fixed source key throughout playback.
  function geometry(id, p) {
    if (id === 'sm4-conv') {
      const d = G.ri(G.seeded('f1d' + p.seed), 1, p.N - 1), tri = G.triTop(p.rr * p.N, p.q * p.N, p.p * p.N);
      return { ...tri, D: G.lerp(tri.A, tri.B, d / p.N), E: G.lerp(tri.A, tri.C, d / p.N),
        AD: p.p * d, DB: p.p * (p.N - d), AE: p.q * d, EC: p.q * (p.N - d), DE: p.rr * d, BC: p.rr * p.N, par: true };
    }
    switch (id) {
      case 'sm4-x': return G.geo.xGeo(p.m, p.n, p.r);
      case 'sm4-ef': return G.geo.efGeo(p.m, p.n);
      case 'sm4-mid': return G.geo.midGeo(p.p, p.q, p.r);
      case 'sm4-four': return G.geo.fourGeo(p.t);
      case 'sm4-vari': return G.geo.vGeo(p.a, p.bb, p.th);
      case 'sm4-bis': return G.geo.bisGeo(p.m, p.n);
      case 'sm4-bisx': return G.geo.bisxGeo(p.n, p.g0);
      case 'sm5-lmn': return G.geo.lmnGeo(p.a, p.bb, p.u);
      case 'sm5-trap': return G.geo.trGeo(p.a, p.m, p.n, p.t);
      case 'sm5-tmid': return G.geo.midTrGeo(p.a0, p.b0);
    }
  }
  const traceEnds = {
    'sm4-conv': ['A', 'D'], 'sm4-x': ['A', 'O'], 'sm4-ef': ['A', 'D'], 'sm4-mid': ['A', 'D'],
    'sm4-four': ['A', 'D'], 'sm4-vari': ['A', 'E'], 'sm4-bis': ['A', 'D'], 'sm4-bisx': ['A', 'D'],
    'sm5-lmn': ['A', 'B'], 'sm5-trap': ['A', 'E'], 'sm5-tmid': ['A', 'E']
  };
  ids.forEach(id => {
    const D = definitions[id];
    D.lessonQuestion = (M, s) => s.smLessonProblem ? null : s.smBQuestion;
    D.lessonDraw = (b, s, M, C, solution) => {
      if (s.smLessonProblem) return false;
      const stage = C.answer ? solution.steps.length : Math.min(3, Math.max(1, C.step || 1));
      const originalText = b.text, originalHandle = b.handle, g = geometry(id, M.pk);
      b.text = function (at, text, opts) {
        const value = String(text ?? '');
        if (/\d|^[xy]$|둘레|넓이/.test(value)) return;
        return originalText.call(this, at, text, opts);
      };
      b.handle = () => {};
      try {
        if (s.smBMode === 'converse' || id === 'sm4-mid') {
          D.draw(b, s, { ...g, pk: M.pk }, { ...C, problem: false, review: true, txt: false, step: C.answer ? 2 : 0 });
          if (stage >= 2) {
            G.poly(b, [g.A, g.D, g.E], 'sky', 4);
            G.ang(b, g.A, g.B, g.C, { color: 'rose', rings: 1 });
          }
          if (C.answer) {
            G.par(b, g.D, g.E); G.par(b, g.B, g.C);
          }
        } else {
          // No numeric target substitution for a conceptual question.
          G.drawSolution(b, D, s, M, { ...C, step: stage, txt: false }, { ...solution, targets: {} });
        }
      } finally { b.text = originalText; b.handle = originalHandle; }
    };
    D.lessonAfterDraw = (b, s, M) => {
      const amount = G.clamp(s.smBTrace || 0, 0, 1);
      if (!amount) return;
      const g = geometry(id, M.pk), [a, z] = traceEnds[id];
      G.line(b, g[a], G.lerp(g[a], g[z], amount), 'amber', 5.5, { alpha: .85 });
    };
  });
})();
