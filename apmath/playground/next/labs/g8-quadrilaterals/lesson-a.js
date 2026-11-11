/* 평행사변형의 성질·조건: 실제 원본문제와 도형을 고정해 연속 재생한다. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-quadrilaterals'] = all['g8-quadrilaterals'] || {};
  const begin = (problem = true, mode = '', extra = {}) => ({ qdLessonProblem: problem, qdShowAnswer: false, qdCalculationReady: false, qdSeed: 0, qdOrd: [0, 1, 2, 3, 4], qdCompare: false, qdMark: 0, qdLine: '', qdLessonMode: mode, ...extra });
  const ch = (title, cues, start) => ({ title, length: 12, ...(start ? { start } : {}), cues });
  const cue = (at, say, step, set) => ({ at, say, ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  const fixed = values => ({ ...values, qdTrace: 0, qdMatch: 0 });
  const make = (label, title, answer, chapters) => ({ label, title, answer, answerText: answer, summary: '원래 조건과 대응 관계를 확인해 필요한 성질을 적용해요', task: '직접 조건을 바꾼 뒤 같은 풀이로 확인해 보세요', tab: 'review', chapters });
  const paraState = K => fixed({ qaW: 8, qaS: 4, qaB: 66, qaT: 0, qaK: K });

  function opposite(concept) {
    const sides = concept === 'sides';
    return make(sides ? '대변성질' : '대각성질', sides ? '마주 보는 변의 길이' : '마주 보는 각의 크기', sides ? 'AB=CD, AD=BC' : '∠A=∠C, ∠B=∠D', [
      ch('평행한 두 쌍과 대각선', [
        { at: 0, say: '같은 화살표끼리 평행해요. 대각선 AC로 둘로 나누어요.', set: begin(false, concept), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, 'AB∥CD, AD∥BC에서 두 쌍의 엇각이 각각 같아요.', 1, { qdMark: 1 })
      ], paraState(0)),
      ch('한 변과 양 끝 각 비교', [
        cue(0, 'ABC와 CDA를 같은 방향으로 놓아요. A는 C에 대응해요.', 2, { qdCompare: true, qdLine: 'A↔C, B↔D, C↔A' }),
        cue(5.5, 'AC는 공통이고 그 양 끝 각이 같아서 ASA 합동이에요.', undefined, { qdLine: 'AC 공통, 양 끝 각이 같다' })
      ]),
      ch('대응하는 부분을 겹쳐요', [
        { at: 0, say: '길이를 바꾸지 않고 옮겨서 두 삼각형을 겹쳐 보아요.', to: { qdMatch: 1 }, dur: 4 },
        cue(5.5, sides ? '대응변이 같으므로 AB=CD, AD=BC예요.' : '대응각이 같으므로 B=D예요. 나머지 A와 C도 같아요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: sides ? 'AB=CD, AD=BC' : '∠A=∠C, ∠B=∠D' })
      ])
    ]);
  }
  function paraValue(k) {
    const labels = ['마주각', '이웃각', '둘레'], answers = ['x=66°', 'x=114°', '둘레=24'];
    return make(labels[k], '평행사변형의 ' + labels[k], answers[k], [
      ch('주어진 부분과 물은 값', [
        { at: 0, say: k === 2 ? 'AB=4, BC=8이에요. 둘레는 네 변을 모두 더한 길이예요.' : 'B의 각은 66°예요. x가 있는 꼭짓점을 먼저 찾아요.', set: begin(), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, k === 0 ? 'D는 B와 마주 보는 꼭짓점이에요. 대각의 성질을 써요.' : k === 1 ? 'A와 B는 이웃해요. AD∥BC의 같은 쪽 내각을 보아요.' : '마주 보는 변끼리 같으므로 두 변의 길이로 네 변을 알아요.', 2)
      ], paraState(k)),
      ch('어떤 성질을 쓸까요', [
        cue(0, k === 0 ? '대각선 AC로 나눈 두 삼각형은 ASA 합동이에요.' : k === 1 ? '평행선의 같은 쪽 내각은 합이 180°예요.' : 'CD=AB=4이고 AD=BC=8이에요.', 2, { qdCalculationReady: true, qdLine: k === 0 ? '대각선으로 나눈 삼각형은 합동' : k === 1 ? '∠A+∠B=180°' : 'CD=4, AD=8' }),
        cue(5.5, k === 0 ? '따라서 B와 D의 각이 같아요. B의 값을 그대로 옮겨요.' : k === 1 ? '전체 180°에서 이미 아는 B의 66°를 빼요.' : '4와 8을 한 번씩 더한 뒤 두 배 해도 같아요.')
      ]),
      ch('물은 값으로 마무리', [
        cue(0, k === 0 ? '이웃한 A의 각을 구하는 문제가 아님을 확인해요.' : k === 1 ? '마주 보는 D와 달리 A에는 66°를 그대로 쓰지 않아요.' : '두 변만 더하면 둘레의 절반이니 네 변을 빠짐없이 세어요.', 3),
        cue(5.5, k === 0 ? 'x=∠D=∠B=66°예요.' : k === 1 ? 'x=180°−66°=114°예요.' : '둘레=4+8+4+8=24예요.', k === 2 ? 5 : 4, { qdShowAnswer: true, qdLine: answers[k] })
      ])
    ]);
  }
  lessons['q1-1'] = [opposite('sides'), opposite('angles'), paraValue(0), paraValue(1), paraValue(2)];

  function angleConcept(bisectors) {
    return make(bisectors ? '이등분선' : '내각의합', bisectors ? '두 이등분선이 만나는 각' : '이웃한 두 내각의 합', bisectors ? '∠APB=90°, AP⊥BP' : 'α+β=180°', [
      ch('각의 이름부터 확인', [
        { at: 0, say: 'A의 각을 α, B의 각을 β라고 해요. AD와 BC가 평행해요.', set: begin(false, bisectors ? 'bisectors' : 'adjacent'), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, bisectors ? 'AP와 BP는 각을 둘로 똑같이 나누는 이등분선이에요.' : 'AB를 가로지르는 선으로 보면 α와 β는 같은 쪽 내각이에요.', 1, { qdMark: bisectors ? 1 : 0 })
      ], paraState(0)),
      ch(bisectors ? '작은 삼각형의 두 각' : '평행선과 일직선의 각', [
        cue(0, bisectors ? 'α+β=180°이므로 두 절반의 합은 90°예요.' : 'A의 각을 B 쪽으로 옮겨 보면 엇각이 같아요.', 2, { qdCalculationReady: true, qdLine: bisectors ? 'α/2+β/2=90°' : '평행선의 엇각은 같다' }),
        cue(5.5, bisectors ? '삼각형 APB의 나머지 각 P는 180°에서 그 합을 빼요.' : '옮긴 각과 β가 일직선을 이루므로 두 각의 합을 알 수 있어요.')
      ]),
      ch('합과 만나는 각 구분', [
        cue(0, bisectors ? 'P가 만나는 각이에요. A와 B의 절반을 더한 값과 구별해요.' : 'α와 β가 서로 같다는 뜻이 아니라 합을 구하는 문제예요.', 2),
        cue(5.5, bisectors ? 'P의 각=180°−90°=90°예요. AP와 BP는 수직이에요.' : '이웃한 두 내각의 합은 α+β=180°예요.', 3, { qdShowAnswer: true, qdLine: bisectors ? '∠APB=90°, AP⊥BP' : 'α+β=180°' })
      ])
    ]);
  }
  function bisectorValue(k) {
    return make(k ? 'A이등분' : 'B이등분', '이등분선과 엇각의 크기', k ? 'x=57°' : 'x=33°', [
      ch('어느 각의 이등분선인가', [
        { at: 0, say: k ? 'B=66°이고 AE가 A의 이등분선이에요. x는 E의 각이에요.' : 'B=66°이고 BE가 B의 이등분선이에요. x는 E의 각이에요.', set: begin(), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, k ? '먼저 A의 전체 각을 구한 다음 반으로 나누어요.' : 'B를 반으로 나눈 각을 평행선의 엇각으로 옮겨요.', 1)
      ], paraState(k)),
      ch('평행선과 이등분선 연결', [
        cue(0, k ? '이웃한 내각의 합은 180°라서 A=114°예요.' : '이등분선 BE는 B의 각을 같은 두 부분으로 나누어요.', 2, { qdCalculationReady: true, qdMark: k ? 1 : 0, qdLine: k ? '∠A=180°−66°=114°' : '∠ABE=∠EBC' }),
        cue(5.5, k ? 'AD∥BC이므로 AEB와 DAE는 엇각으로 같아요.' : 'AD∥BC이므로 AEB와 EBC는 엇각으로 같아요.', 3)
      ]),
      ch('절반을 물은 각에 옮겨요', [
        cue(0, k ? 'DAE=114°÷2=57°예요. 이 값을 E의 각에 옮겨요.' : 'EBC=66°÷2=33°예요. 이 값을 E의 각에 옮겨요.', 4, { qdMark: 2, qdLine: k ? '∠DAE=57°' : '∠EBC=33°' }),
        cue(5.5, k ? '따라서 x=∠AEB=57°예요.' : '따라서 x=∠AEB=33°예요.', 5, { qdShowAnswer: true, qdLine: k ? 'x=57°' : 'x=33°' })
      ])
    ]);
  }
  lessons['q1-2'] = [angleConcept(false), angleConcept(true), bisectorValue(0), bisectorValue(1)];

  const diagState = k => fixed({ qaW: 8, qaS: 4, qaB: 66, qaE: 2, qaK: k });
  function diagonalConcept(through) {
    return make(through ? 'O지나는선' : '대각선성질', through ? '교점 O를 지나는 선분' : '두 대각선이 나뉘는 관계', through ? 'OE=OF' : 'OA=OC, OB=OD', [
      ch('교점과 비교할 부분', [
        { at: 0, say: through ? 'O는 두 대각선의 교점이에요. O를 지나는 EF를 따라가요.' : 'O는 대각선 AC와 BD가 만나는 점이에요. 두 선을 따라가요.', set: begin(false, through ? 'through' : 'diagonals'), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, through ? 'AOE와 CFO를 비교해요. 대각선의 성질로 AO=CO예요.' : 'AOB와 COD를 비교해요. 평행사변형의 대변 AB=CD예요.', 1, { qdMark: 1 })
      ], diagState(0)),
      ch('대응변과 각을 확인', [
        cue(0, through ? 'A는 C, E는 F, O는 O에 대응하도록 떼어 놓았어요.' : 'A는 C, O는 O, B는 D에 대응하도록 떼어 놓았어요.', 2, { qdCompare: true, qdLine: through ? 'A↔C, E↔F, O↔O' : 'A↔C, O↔O, B↔D' }),
        cue(5.5, through ? '엇각과 O의 맞꼭지각이 같아 AO 양 끝 각이 같아요.' : 'AB∥CD에서 두 쌍의 엇각이 같아요. ASA 합동이에요.', undefined, { qdLine: through ? 'AO=CO, 양 끝 각이 같다 → ASA' : 'AB=CD, 양 끝 각이 같다 → ASA' })
      ]),
      ch('겹친 뒤 대응변 확인', [
        { at: 0, say: '길이를 보존해 두 삼각형을 옮기면 꼭 포개져요.', to: { qdMatch: 1 }, dur: 4 },
        cue(5.5, through ? '대응변 OE=OF예요. O는 EF의 중점이에요.' : '대응변 OA=OC, OB=OD예요. 두 대각선은 서로 이등분해요.', 3, { qdCompare: false, qdShowAnswer: true, qdLine: through ? 'OE=OF' : 'OA=OC, OB=OD' })
      ])
    ]);
  }
  function throughValue(k) {
    const names = ['BF길이', 'FC길이', '나눈넓이'], ans = ['x=6', 'x=2', 'x=24'];
    return make(names[k], '교점 O를 지나는 선의 ' + (k === 2 ? '넓이' : '길이'), ans[k], [
      ch('문제의 전체와 부분', [
        { at: 0, say: k === 0 ? 'AD=8, AE=2예요. O를 지나는 선이 BC와 F에서 만나요.' : k === 1 ? 'AE=2예요. O를 지나는 EF에서 구하는 부분은 FC예요.' : '전체 넓이는 48이에요. O를 지나는 EF로 나눈 ABFE를 구해요.', set: begin(true, k === 2 ? 'area' : 'through'), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, 'OA=OC이고 엇각과 맞꼭지각이 같아서 AOE와 CFO는 합동이에요.', 2, { qdMark: 1 })
      ], diagState(k)),
      ch(k === 2 ? '두 사각형의 대응' : '합동인 삼각형의 대응', [
        cue(0, k === 2 ? 'O를 중심으로 180° 돌리면 A↔C, B↔D, E↔F예요.' : 'A는 C, E는 F, O는 O에 대응해요. 같은 방향으로 놓아요.', 3, { qdCompare: true, qdLine: k === 2 ? 'ABFE ↔ CDEF' : 'AEO ↔ CFO' }),
        cue(5.5, k === 2 ? '두 부분을 같은 방향으로 놓았어요. 크기를 바꾸지 않았어요.' : 'AO=CO이고 그 양 끝 각이 같으므로 ASA 합동이에요.', undefined, { qdLine: k === 2 ? '회전한 대응점으로 두 부분을 비교' : '한 변과 양 끝 각이 같다' })
      ]),
      ch('대응 관계로 값 구하기', [
        { at: 0, say: k === 2 ? '두 사각형을 겹쳐 보아요. 두 부분의 넓이가 같아요.' : '두 삼각형을 옮겨 겹치면 AE와 CF가 대응해요.', to: { qdMatch: 1 }, dur: 3 },
        cue(4, k === 0 ? 'CF=AE=2이고 BC=AD=8이에요. BF는 BC에서 CF를 빼요.' : k === 1 ? '같은 대응변의 길이를 옮겨요. 전체 길이를 빼는 문제가 아니에요.' : '두 부분이 전체 48을 똑같이 나누므로 2로 나누어요.', 4, { qdCompare: false, qdCalculationReady: true, qdLine: k === 0 ? 'BC=8, CF=2' : k === 1 ? 'FC=AE' : '두 부분의 넓이가 같다' }),
        cue(8, k === 0 ? 'x=BF=8−2=6이에요.' : k === 1 ? 'x=FC=AE=2예요.' : 'x=48÷2=24예요.', 5, { qdShowAnswer: true, qdLine: ans[k] })
      ])
    ]);
  }
  lessons['q1-3'] = [diagonalConcept(false), diagonalConcept(true), throughValue(0), throughValue(1), throughValue(2)];

  function diagonalPerimeter(concept, k) {
    const ans = concept ? 'P=a+d₁/2+d₂/2' : k ? 'x=5' : '둘레=15';
    return make(concept ? '둘레의식' : k ? '변역산' : '삼각형둘레', concept ? '대각선으로 삼각형 둘레 구하기' : k ? '둘레에서 변의 길이 구하기' : '대각선의 절반과 둘레', ans, [
      ch('삼각형의 세 변 찾기', [
        { at: 0, say: concept ? 'a는 AB, d₁은 AC, d₂는 BD의 길이예요. O는 교점이에요.' : k ? 'AC=8, BD=12이고 ABO의 둘레는 15예요. AB=x예요.' : 'AB=5, AC=8, BD=12예요. ABO의 세 변을 찾아요.', set: begin(!concept), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, '삼각형 ABO의 변은 AB, BO, OA예요. 대각선 전체가 아니에요.', 1)
      ], fixed({ qaDC: 5, qaDA: 8, qaDB: 12, qaK: k })),
      ch('대각선을 반으로 나누어요', [
        cue(0, concept ? '대각선은 서로 이등분하므로 OA=d₁/2, OB=d₂/2예요.' : '대각선은 서로 이등분해요. OA=8÷2=4, OB=12÷2=6이에요.', 2, { qdMark: 1, qdCalculationReady: true, qdLine: concept ? 'OA=d₁/2, OB=d₂/2' : 'OA=4, OB=6' }),
        cue(5.5, !concept && k ? '둘레 15에서 이미 아는 두 변 4와 6을 빼면 AB가 남아요.' : '삼각형의 둘레는 세 변을 한 번씩 더한 길이예요.', 3)
      ]),
      ch('전체와 절반을 구별해요', [
        cue(0, 'AC나 BD 전체를 그대로 넣지 않았는지 확인해요.', 4),
        cue(5.5, concept ? '따라서 둘레 P=a+d₁/2+d₂/2예요.' : k ? 'x=AB=15−4−6=5예요.' : '둘레=5+4+6=15예요.', 5, { qdShowAnswer: true, qdLine: ans })
      ])
    ]);
  }
  lessons['q1-4'] = [diagonalPerimeter(true, 0), diagonalPerimeter(false, 0), diagonalPerimeter(false, 1)];

  function isoBisector(concept, k) {
    const ans = concept ? 'AB=BE, △ABE는 이등변삼각형' : k ? 'x=4' : 'x=5';
    return make(concept ? '삼각형성질' : k ? '연장선EC' : '안쪽EC', concept ? '이등분선으로 생긴 삼각형' : k ? '연장선 위의 남은 길이' : '변 안쪽의 남은 길이', ans, [
      ch('이등분선과 점의 순서', [
        { at: 0, say: concept ? 'AE는 A의 이등분선이에요. AD와 BC의 평행도 확인해요.' : k ? 'AB=8, BC=4예요. E는 C 바깥이므로 B, C, E 순서예요.' : 'AB=5, BC=10예요. E는 B와 C 사이에 있어요.', set: begin(!concept), to: { qdTrace: 1 }, dur: 4 },
        cue(5.5, '이등분선이므로 BAE와 DAE는 같은 각이에요.', 2)
      ], fixed({ qaIW: 10, qaIS: 5, qaB: 66, qaK: k, qaPa: 4, qaPb: 8 })),
      ch('평행선의 엇각 연결', [
        cue(0, 'AD∥BC이므로 DAE와 AEB는 엇각으로 같아요.', 2, { qdMark: concept ? 1 : 0, qdLine: '∠BAE=∠DAE=∠AEB' }),
        cue(5.5, concept ? '삼각형 ABE에서 두 밑각이 같으니 그 대변을 비교해요.' : k ? '두 밑각이 같아 BE=AB=8이에요.' : '두 밑각이 같아 BE=AB=5예요.', 3, { qdMark: 1, qdCalculationReady: true, qdLine: concept ? '같은 밑각의 대변을 찾는다' : k ? 'BE=AB=8' : 'BE=AB=5' })
      ]),
      ch(concept ? '삼각형의 종류 판단' : '큰 길이에서 작은 길이 빼기', [
        cue(0, concept ? 'BAE의 대변은 BE, AEB의 대변은 AB예요.' : k ? 'BE 전체에서 BC를 빼야 C 바깥의 CE가 남아요.' : 'BC 전체에서 BE를 빼야 EC가 남아요.', 4),
        cue(5.5, concept ? 'AB=BE이므로 ABE는 이등변삼각형이에요.' : k ? 'x=CE=8−4=4예요.' : 'x=EC=10−5=5예요.', 5, { qdShowAnswer: true, qdLine: ans })
      ])
    ]);
  }
  lessons['q1-5'] = [isoBisector(true, 0), isoBisector(false, 0), isoBisector(false, 1)];
})();
