/* 원본 조건과 풀이 단계를 고정하여 연속 재생하는 삼각형 해설 A. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-triangles'] = all['g8-triangles'] || {};
  const begin = (problem = true) => ({ trLessonProblem: problem, trShowAnswer: false, trCalculationReady: false, trSeed: 0, trCompare: false, trLine: '', trGen: false });
  const ch = (title, cues, start) => ({ title, length: 12, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, chapters) => ({ label, title, answer, answerText: answer, summary: '원래 조건을 표시하고 필요한 성질을 적용해요', task: '직접 조건을 바꾸고 같은 풀이로 다시 확인해 보세요', tab: 'review', chapters });
  const cue = (at, say, step, set) => ({ at, say, ...(step == null ? {} : { step }), ...(set ? { set } : {}) });
  const fixed = values => ({ ...values, trTrace: 0, trMatch: 0 });

  function baseAngle(v) {
    const answer = [50, 80, 130][v], target = ['밑각', '꼭지각', '외각'][v];
    return make(target, '이등변삼각형의 ' + target, 'x = ' + answer + '°', [
      ch('같은 두 변과 구하는 각', [
        { at: 0, say: v === 1 ? 'AB=AC, 주어진 밑각 B는 50°예요. 같은 두 변을 찾아요.' : 'AB=AC이고 꼭지각 A는 80°예요. 같은 두 변을 찾아요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v === 2 ? 'x는 C 바깥의 각 ACD예요. 안쪽 밑각과 구별해요.' : v === 1 ? 'x는 같은 두 변이 만나는 꼭지점 A의 각이에요.' : 'x는 꼭지점 A가 아닌 B의 밑각이에요.', 2)
      ], fixed({ trIa: 80, trIl: 8, trIb: 50, trIc: 70, trIf: 0, trV: v })),
      ch('두 밑각이 같다는 성질', [
        cue(0, v === 1 ? '두 밑각은 같으므로 C도 50°예요.' : v === 2 ? '두 밑각은 같으므로 (180°−80°)÷2=50°예요.' : '두 밑각 B와 C는 같아요. 합은 180°−80°=100°예요.', 3, { trCalculationReady: true, trLine: v === 1 ? '∠C=∠B=50°' : v === 2 ? '∠B=∠ACB=50°' : '∠B+∠C=100°' }),
        cue(5.5, v === 2 ? '외각은 이웃하지 않는 두 내각 A와 B의 합이에요.' : v === 1 ? '내각의 합 180°에서 두 밑각을 모두 빼요.' : '같은 두 각의 합이므로 100°를 2로 나누어요.')
      ]),
      ch('물은 각으로 답해요', [
        cue(0, v === 2 ? 'C의 안쪽 50°에서 멈추지 말고 바깥 각을 구해요.' : v === 1 ? '두 밑각을 한 번씩 빼야 해요.' : '100°는 두 밑각의 합이고, 문제는 한 밑각을 물어요.', 4),
        cue(5.5, v === 2 ? 'x=80°+50°=130°예요. 안쪽 각과 합도 180°예요.' : v === 1 ? 'x=180°−50°−50°=80°예요.' : 'x=100°÷2=50°예요.', 5, { trShowAnswer: true, trLine: v === 2 ? 'x=80°+50°=130°' : v === 1 ? 'x=180°−50°−50°=80°' : 'x=100°÷2=50°' })
      ])
    ]);
  }
  lessons['t1-1'] = [make('밑각성질', '두 밑각이 같은 이유', '∠B = ∠C', [
    ch('같은 변에서 출발해요', [
      { at: 0, say: 'AB와 AC의 같은 눈금은 길이가 같다는 뜻이에요.', set: begin(false), to: { trTrace: 1 }, dur: 4 },
      cue(5.5, '같은 두 변이 만나는 A가 꼭지점이에요. 이등분선 AD를 그어요.', 2)
    ], fixed({ trIa: 80, trIl: 8, trIb: 50, trIc: 70, trIf: 0, trV: 0 })),
    ch('두 삼각형의 대응을 확인', [
      cue(0, 'ABD와 ACD를 같은 방향으로 떼어 놓았어요. B와 C가 대응해요.', 3, { trCompare: true, trLine: 'A↔A, B↔C, D↔D' }),
      cue(5.5, 'AB=AC, AD는 공통이고 끼인각 BAD와 CAD가 같아요.', undefined, { trLine: '두 변과 그 끼인각이 같다' })
    ]),
    ch('같은 방향으로 겹쳐 보아요', [
      { at: 0, say: '두 변과 끼인각이 같으므로 SAS 합동이에요. 옮겨 겹쳐요.', to: { trMatch: 1 }, dur: 4 },
      cue(5.5, '대응하는 B와 C의 각이 포개어져요. 두 밑각은 같아요.', 5, { trCompare: false, trShowAnswer: true, trLine: '∠B=∠C' })
    ])
  ]), baseAngle(0), baseAngle(1), baseAngle(2)];

  function equalAngles(concept, v) {
    return make(concept ? '대변성질' : v ? '필요조건' : '변의길이', concept ? '같은 각의 대변이 같은 이유' : '같은 각의 대변 길이', concept ? 'AB = AC' : 'x = 8 cm', [
      ch('같은 각의 마주 보는 변', [
        { at: 0, say: concept ? 'B와 C의 같은 호는 두 각이 같다는 뜻이에요. 대변 AC를 따라가요.' : 'B와 C가 같고 AB=8 cm예요. B의 대변 AC가 구하는 x예요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v ? 'A=70°도 주어졌지만, 대변의 길이에는 두 밑각의 같음을 써요.' : '같은 각의 대변이 같은지, A에서 내린 수선 AD로 나누어 보아요.', 2)
      ], fixed({ trJb: 55, trJc: 55, trM: 8, trV: v })),
      ch('양 끝 각과 공통인 변', [
        cue(0, '직각 D와 같은 밑각을 빼면 BAD와 CAD도 같아요.', 3, { trCompare: true, trLine: '∠ADB=∠ADC, ∠BAD=∠CAD' }),
        cue(5.5, 'AD는 공통이에요. 한 변과 그 양 끝 각이 같아 ASA 합동이에요.', undefined, { trLine: 'AD 공통, 양 끝 각이 같다' })
      ]),
      ch('대응변을 겹쳐 확인해요', [
        { at: 0, say: 'A는 A, B는 C, D는 D에 대응해요. 삼각형을 옮겨 겹쳐요.', to: { trMatch: 1 }, dur: 4 },
        cue(5.5, concept ? '따라서 같은 각 B와 C의 대변 AC와 AB는 길이가 같아요.' : '대응변 AC=AB이므로 x=8 cm예요.', 5, { trCompare: false, trShowAnswer: true, trLine: concept ? 'AB=AC' : 'x=AC=AB=8 cm' })
      ])
    ]);
  }
  lessons['t1-2'] = [equalAngles(true, 0), equalAngles(false, 0), equalAngles(false, 1)];

  function bisector(v) {
    const ans = ['65°', '90°', '12 cm'][v], label = ['밑각', '수직', '중점'][v];
    return make(label, '꼭지각의 이등분선과 ' + label, 'x = ' + ans, [
      ch('이등분선이 주어진 조건', [
        { at: 0, say: v === 0 ? 'AB=AC이고 AD는 꼭지각의 이등분선, BAD는 25°예요.' : v === 1 ? 'AB=AC, A=50°예요. 이등분선 AD가 밑변과 만나요.' : 'AB=AC이고 AD는 이등분선이에요. BD=6 cm가 주어졌어요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v === 2 ? 'BC 전체를 구하려면 CD의 길이도 알아야 해요.' : 'AD로 나뉜 두 삼각형을 비교해 밑변과 만나는 각을 살펴요.', 2)
      ], fixed({ trKa: 50, trKt: 0, trM: 6, trV: v })),
      ch('두 변과 끼인각 확인', [
        cue(0, 'ABD와 ACD에서 AB=AC, AD는 공통이에요.', 3, { trCompare: true, trLine: 'AB=AC, AD 공통' }),
        cue(5.5, 'BAD와 CAD도 같아요. 두 변과 끼인각이 같아 SAS 합동이에요.', undefined, { trLine: '∠BAD=∠CAD → SAS 합동' })
      ]),
      ch('대응하는 부분을 겹쳐요', [
        { at: 0, say: 'A·B·D에 A·C·D가 대응해요. 두 삼각형을 겹쳐 보아요.', to: { trMatch: 1 }, dur: 4 },
        cue(5.5, v === 2 ? '대응변 BD와 CD가 같으므로 CD도 6 cm예요.' : 'D의 두 각은 서로 같고, 일직선을 이루어 합이 180°예요.', v === 0 ? 4 : 3, { trCompare: false, trCalculationReady: true, trLine: v === 2 ? 'BD=CD=6 cm' : '∠ADB=∠ADC, 두 각의 합 180°' })
      ]),
      ch('물은 값으로 계산해요', [
        cue(0, v === 0 ? 'D의 각은 90°예요. ABD에서 남은 B의 각을 구해요.' : v === 1 ? '같은 두 각의 합 180°를 2로 나누어요.' : 'D는 중점이에요. BD와 CD를 더하면 BC 전체가 돼요.', v === 0 ? 5 : 4),
        cue(5.5, v === 0 ? 'x=180°−25°−90°=65°예요.' : v === 1 ? 'x=180°÷2=90°예요. AD는 밑변에 수직이에요.' : 'x=6+6=12 cm예요.', v === 0 ? 6 : 5, { trShowAnswer: true, trLine: 'x=' + ans })
      ])
    ]);
  }
  lessons['t1-3'] = [bisector(0), bisector(1), bisector(2)];

  function rightIso(v, concept = false) {
    const answer = concept ? 'AD = BC/2' : ['x = 10 cm', 'x = 5 cm', 'x = 45°'][v];
    return make(concept ? '길이관계' : ['빗변', '중선', '반쪽각'][v], '직각이등변삼각형과 빗변 중점', answer, [
      ch('직각과 중점을 확인해요', [
        { at: 0, say: concept ? 'A는 직각이고 AB=AC예요. 빗변의 중점 D로 이은 AD를 봐요.' : v === 0 ? 'A는 직각, AB=AC, D는 중점이에요. AD=5 cm예요.' : v === 1 ? 'A는 직각, AB=AC, D는 중점이에요. BC=10 cm예요.' : 'A는 직각, AB=AC이고 D는 빗변 BC의 중점이에요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v === 2 ? 'AD가 꼭지각도 반으로 나누는지 합동으로 확인해요.' : 'AD와 BD가 같은 길이인지 두 삼각형의 각을 확인해요.', 2)
      ], fixed({ trMm: 5, trV: v })),
      ch(v === 2 ? '세 대응변이 같아요' : '작은 삼각형의 두 각', [
        cue(0, v === 2 ? 'ABD와 ACD에서 AB=AC, BD=CD이고 AD는 공통이에요.' : '두 밑각은 (180°−90°)÷2=45°예요.', 3, v === 2 ? { trCompare: true, trLine: 'AB=AC, BD=CD, AD 공통' } : { trCalculationReady: true, trLine: '∠B=∠C=45°' }),
        cue(5.5, v === 2 ? '세 변이 같으므로 SSS 합동이에요. A의 두 반쪽 각이 대응해요.' : '중점 D로 이은 AD는 꼭지각을 이등분하므로 BAD도 45°예요.', v === 2 ? undefined : 4, { trLine: v === 2 ? 'SSS 합동, ∠BAD↔∠CAD' : '∠BAD=∠B=45° → AD=BD=CD' })
      ]),
      ch('구하는 관계를 마무리해요', [
        v === 2 ? { at: 0, say: '삼각형을 옮겨 겹치면 두 반쪽 각도 포개어져요.', to: { trMatch: 1 }, dur: 4 } : cue(0, '같은 각의 대변도 같아 AD=BD=CD예요. BC는 두 부분의 합이에요.', 5),
        cue(5.5, concept ? 'BC=BD+CD=2AD예요. 따라서 AD는 BC의 절반이에요.' : v === 0 ? 'BC=BD+CD=5+5이므로 x=10 cm예요.' : v === 1 ? 'AD=BD=BC÷2이므로 x=10÷2=5 cm예요.' : '두 반쪽 각이 같고 합은 90°이므로 x=45°예요.', v === 2 ? 5 : 6, { trCompare: false, trShowAnswer: true, trLine: answer })
      ])
    ]);
  }
  lessons['t1-4'] = [rightIso(0, true), rightIso(0), rightIso(1), rightIso(2)];

  function sideways(v, concept = false) {
    return make(concept ? '꼭지점' : v ? '꼭지각' : '밑각', '누운 이등변삼각형의 기준점', concept ? '꼭지점은 A' : v ? 'x = 80°' : 'x = 50°', [
      ch('같은 눈금의 변을 찾아요', [
        { at: 0, say: concept ? 'AB와 AC의 같은 눈금은 두 변의 길이가 같다는 뜻이에요.' : v ? 'AB=AC이고 B=50°예요. 누워 있는 삼각형을 살펴요.' : 'AB=AC이고 A=80°예요. 누워 있어도 성질은 같아요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, '같은 두 변이 만나는 점을 찾아요. 화면의 위쪽만 보지 않아요.', 2)
      ], fixed({ trLa: 80, trV: v })),
      ch(concept ? '같은 변이 만나는 점' : '두 밑각을 이용해요', [
        cue(0, concept ? 'AB와 AC는 모두 A에서 시작해요. B와 C는 나머지 두 점이에요.' : v ? '두 밑각은 같으므로 C도 50°예요.' : '두 밑각 B와 C의 합은 180°−80°=100°예요.', 3, concept ? { trLine: 'AB와 AC가 만나는 점 찾기' } : { trCalculationReady: true, trLine: v ? '∠B=∠C=50°' : '∠B+∠C=100°' }),
        cue(5.5, concept ? '따라서 꼭지점은 A이고, 꼭지각은 A의 각이에요.' : v ? 'x=180°−50°−50°=80°예요.' : 'x=100°÷2=50°예요.', 5, { trShowAnswer: true, trLine: concept ? '꼭지점 A, 꼭지각 ∠A' : v ? 'x=80°' : 'x=50°' })
      ])
    ]);
  }
  lessons['t1-5'] = [sideways(0, true), sideways(0), sideways(1)];

  function axisPoint(v, concept = false) {
    return make(concept ? '같은거리' : v ? '안쪽꼭지각' : '남은밑각', '대칭축 위의 점과 같은 거리', concept ? 'PB = PC' : v ? 'x = 140°' : 'x = 40°', [
      ch('P가 놓인 선을 확인해요', [
        { at: 0, say: concept ? 'AB=AC이고 P는 꼭지각의 이등분선 AD 위에 있어요.' : v ? 'P는 이등분선 AD 위에 있고 PBC=20°예요. BPC를 구해요.' : 'P는 이등분선 AD 위에 있어요. A=60°, PCB=20°예요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, 'AD는 밑변을 수직이등분하므로 BD=CD이고 D의 각은 직각이에요.', 2)
      ], fixed({ trPa: 60, trPt: 20, trV: v })),
      ch('두 작은 삼각형을 비교해요', [
        cue(0, 'DBP와 DCP를 떼어 놓으면 DB=DC, DP는 공통이에요.', 3, { trCompare: true, trLine: 'DB=DC, DP 공통, 끼인각 90°' }),
        cue(5.5, '끼인각 D도 직각이라 SAS 합동이에요. B와 C가 대응해요.')
      ]),
      ch('대응변과 대응각 확인', [
        { at: 0, say: '두 삼각형을 옮겨 겹쳐 보아요. PB와 PC가 대응해요.', to: { trMatch: 1 }, dur: 4 },
        cue(5.5, concept ? '대응변의 길이는 같으므로 PB=PC예요.' : 'PB=PC이므로 PBC와 PCB가 같아 두 각은 모두 20°예요.', 3, { trCompare: false, trShowAnswer: concept, trCalculationReady: !concept, trLine: concept ? 'PB=PC' : 'PB=PC → ∠PBC=∠PCB=20°' })
      ]),
      ...(!concept ? [ch('물은 각을 구해요', [
        cue(0, v ? 'PBC의 두 밑각 20°를 내각의 합에서 빼요.' : 'ABC의 밑각은 (180°−60°)÷2=60°예요.', v ? 4 : 4, { trLine: v ? '∠BPC=180°−20°−20°' : '∠ABC=60°' }),
        cue(5.5, v ? 'x=180°−20°−20°=140°예요.' : '남은 각 ABP는 x=60°−20°=40°예요.', v ? 5 : 6, { trShowAnswer: true, trLine: v ? 'x=140°' : 'x=40°' })
      ])] : [])
    ]);
  }
  lessons['t1-6'] = [axisPoint(0, true), axisPoint(0), axisPoint(1)];

  lessons['t1-7'] = [make('길이의식', '같은 대변으로 방정식 세우기', 'x = 3', [
    ch('같은 각의 대변을 찾아요', [
      { at: 0, say: 'B와 C가 같아요. 두 대변의 길이는 5x−6과 2x+3이에요.', set: { ...begin(), trQ: { p: 5, q: -6, r: 2, sv: 3 } }, to: { trTrace: 1 }, dur: 4 },
      cue(5.5, '같은 각의 대변 AB와 AC가 같으므로 두 길이의 식을 같게 놓아요.', 2)
    ], fixed({ trExprX: 3, trV: 0 })),
    ch('길이의 식을 같게 놓아요', [
      cue(0, '같은 길이 표시를 확인해요. 밑변 BC의 길이를 쓰지 않아요.', 3),
      cue(5.5, '5x−6=2x+3이에요. x항과 상수항을 각각 모아요.', 4, { trCalculationReady: true, trLine: '5x−6=2x+3' })
    ]),
    ch('값과 길이를 확인해요', [
      cue(0, '5x−2x=3+6이므로 3x=9예요.', 5, { trLine: '3x=9' }),
      cue(5.5, 'x=3이에요. 두 변은 모두 9 cm로 같고 양수예요.', 6, { trShowAnswer: true, trLine: 'x=3, AB=AC=9 cm' })
    ])
  ])];
})();
