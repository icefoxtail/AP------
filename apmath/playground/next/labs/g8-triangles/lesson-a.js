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

  function chain(v, concept = false) {
    const sym = concept || v === 1;
    return make(concept ? '연쇄원리' : v ? '거꾸로' : '마지막외각', '같은 선분을 이은 연쇄와 외각', concept ? '마지막 외각 = 4x' : v ? 'x = 20°' : 'x = 80°', [
      ch('같은 선분 네 개를 세어요', [
        { at: 0, say: 'AB=BC=CD=DE예요. 같은 눈금의 선분 네 개를 확인해요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? 'A의 각을 x라 해요. 이등변의 밑각과 외각의 성질을 번갈아 써요.' : v ? 'EDF=80°예요. A의 각을 x라 놓고 마지막까지 이어 가요.' : 'BAC=20°예요. 마지막 바깥 각 EDF를 구해요.', 2)
      ], fixed({ trCn: 4, trCx: 20, trV: sym ? 1 : 0 })),
      ch('첫째와 둘째 삼각형', [
        cue(0, sym ? 'AB=BC이므로 ACB는 A와 같은 x예요.' : 'AB=BC이므로 ACB는 A와 같은 20°예요.', 3, { trLine: sym ? '∠ACB=x' : '∠ACB=20°' }),
        cue(5.5, sym ? '외각 CBD=x+x=2x예요. BC=CD라서 CDB도 2x예요.' : '외각 CBD=20°+20°=40°예요. CDB도 40°예요.', 4, { trLine: sym ? '∠CBD=∠CDB=2x' : '∠CBD=∠CDB=40°' })
      ]),
      ch('셋째 삼각형으로 이어 가요', [
        cue(0, sym ? '외각 DCE=x+2x=3x예요. CD=DE라서 CED도 3x예요.' : '외각 DCE=20°+40°=60°예요. CED도 60°예요.', 5, { trCalculationReady: true, trLine: sym ? '∠DCE=∠CED=3x' : '∠DCE=∠CED=60°' }),
        cue(5.5, '구하는 EDF는 이 밑각과 다른 바깥 각이에요. 한 번 더 더해요.')
      ]),
      ch('마지막 외각으로 마무리', [
        cue(0, sym ? 'EDF는 A와 AED의 합이므로 x+3x예요.' : 'EDF는 A와 AED의 합이므로 20°+60°예요.', 6, { trLine: sym ? '∠EDF=x+3x' : '∠EDF=20°+60°' }),
        cue(5.5, concept ? '따라서 마지막 외각은 4x예요. 같은 선분 네 개와 연결돼요.' : v ? '4x=80°이므로 x=20°예요.' : 'x=20°+60°=80°예요. 안쪽 각으로 답하지 않아요.', 7, { trShowAnswer: true, trLine: concept ? '마지막 외각=4x' : v ? '4x=80° → x=20°' : 'x=80°' })
      ])
    ]);
  }
  lessons['t2-1'] = [chain(1, true), chain(0), chain(1)];

  function sharedVertex(v) {
    const sym = v === 2, val = k => sym ? k === 1 ? 'x' : k + 'x' : k * 32 + '°';
    return make(['마지막외각', '안쪽밑각', '거꾸로'][v], '공유 꼭짓점의 각을 차례로', ['x = 74°', 'x = 42°', 'x = 32°'][v], [
      ch('같은 네 변과 물은 각', [
        { at: 0, say: 'AB=AC=CD=CE예요. 같은 변이 만나는 꼭짓점을 찾아요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, sym ? 'EDF=74°예요. B의 각을 x라 놓고 앞에서부터 나타내요.' : v ? 'B=32°예요. 구하는 각은 안쪽 CDE예요.' : 'B=32°예요. 구하는 각은 바깥쪽 EDF예요.', 2)
      ], fixed({ trEx: 32, trV: v })),
      ch('첫 두 이등변삼각형', [
        cue(0, `AB=AC이므로 ACB는 B와 같은 ${val(1)}예요.`, 3, { trLine: '∠ACB=' + val(1) }),
        cue(5.5, `CAD는 외각이라 ${val(2)}예요. CA=CD이므로 CDA도 같아요.`, 4, { trLine: '∠CAD=∠CDA=' + val(2) })
      ]),
      ch('공유 꼭짓점 C의 다음 각', [
        cue(0, `DCE는 B와 CDB의 합이라 ${val(3)}예요.`, 5, { trCalculationReady: true, trLine: '∠DCE=' + val(3) }),
        cue(5.5, sym ? 'CD=CE이므로 CDE와 CED는 (180°−3x)÷2예요.' : v ? 'CD=CE이므로 두 밑각은 남은 180°−96°를 반씩 나눠요.' : 'CD=CE이므로 CDE와 CED는 (180°−96°)÷2=42°예요.', v === 1 ? undefined : 6, { trLine: sym ? '∠CDE=(180°−3x)÷2' : v ? '∠CDE=∠CED' : '∠CDE=∠CED=42°' })
      ]),
      ch('물은 각을 확인하고 계산', [
        cue(0, sym ? 'EDF=180°−2x−(180°−3x)÷2=90°−x÷2예요.' : v ? 'CDE는 두 밑각 중 하나이므로 (180°−96°)를 2로 나누어요.' : 'D에서 일직선이므로 EDF=180°−64°−42°예요.', v === 1 ? 6 : 7, { trLine: sym ? '90°−x÷2=74°' : v ? '(180°−96°)÷2' : '180°−64°−42°' }),
        cue(5.5, sym ? 'x÷2=90°−74°=16°이므로 x=32°예요.' : v ? 'x=84°÷2=42°예요.' : 'x=74°예요. 안쪽 밑각 42°에서 멈추지 않아요.', sym ? 9 : 8, { trShowAnswer: true, trLine: 'x=' + [74, 42, 32][v] + '°' })
      ])
    ]);
  }
  lessons['t2-2'] = [sharedVertex(0), sharedVertex(1), sharedVertex(2)];

  function extended(v) {
    const last = v === 2;
    const chapters = [
      ch('연장선 위의 조건', [
        { at: 0, say: 'AB=AC=CD예요. B·C·D는 한 직선 위에 있고 CD를 따라가요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v === 1 ? 'B=58°예요. 구하는 각 CDA는 삼각형 CAD의 밑각이에요.' : last ? 'A=64°예요. 구하는 BAD는 BAC와 CAD를 합친 각이에요.' : 'A=64°예요. 구하는 CDA를 알려면 CAD의 꼭지각부터 봐요.', 2)
      ], fixed({ trDa: 64, trDd: 6, trV: v })),
      ch('첫 밑각과 바깥 각', [
        cue(0, v === 1 ? 'AB=AC이므로 ACB도 58°예요.' : 'AB=AC이므로 두 밑각은 (180°−64°)÷2=58°예요.', 3, { trCalculationReady: true, trLine: '∠B=∠ACB=58°' }),
        cue(5.5, '외각 ACD는 안쪽 ACB와 합이 180°라서 122°예요.', 4, { trLine: '∠ACD=180°−58°=122°' })
      ]),
      ch('두 번째 이등변삼각형', [
        cue(0, 'CA=CD이므로 CAD와 CDA는 같아요. 180°에서 꼭지각을 빼요.', 4),
        cue(5.5, last ? 'CAD와 CDA는 (180°−122°)÷2=29°예요.' : 'x=(180°−122°)÷2=29°예요.', last ? 5 : 6, { trShowAnswer: !last, trLine: last ? '∠CAD=∠CDA=29°' : 'x=29°' })
      ])
    ];
    if (last) chapters.push(ch('A에서 두 각을 더해요', [
      cue(0, '구하는 BAD는 처음의 BAC와 방금 구한 CAD를 더한 각이에요.', 6, { trLine: '∠BAD=∠BAC+∠CAD' }),
      cue(5.5, 'x=64°+29°=93°예요. 작은 각 CAD만 답하지 않아요.', 7, { trShowAnswer: true, trLine: 'x=93°' })
    ]));
    return make(['꼭지각부터', '밑각부터', '합친각'][v], '연장선과 두 이등변삼각형', last ? 'x = 93°' : 'x = 29°', chapters);
  }
  lessons['t2-3'] = [extended(0), extended(1), extended(2)];

  function rha(v, concept = false) {
    const answer = concept ? '△ABC ≡ △DEF (RHA)' : v ? 'x = 50°' : 'x = 7 cm';
    return make(concept ? 'RHA성질' : v ? '대응각' : '대응변', '직각·빗변·한 예각 비교', answer, [
      ch('빗변과 구하는 것을 확인', [
        { at: 0, say: 'C와 F가 직각이에요. 직각의 맞은편 AB와 DE가 빗변이에요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? '빗변과 한 예각이 각각 같을 때 모양과 크기를 비교해요.' : v ? 'A와 D는 40°예요. E의 각 x는 어느 각과 대응할까요?' : 'BC=7 cm예요. 구하는 EF의 길이 x는 어느 변과 대응할까요?', 2)
      ], fixed({ trRc: 8, trRa: 40, trRt: 0, trM: 7, trV: v })),
      ch('직각과 빗변을 표시해요', [
        cue(0, 'C와 F의 직각 표시가 R이에요. 두 각은 90°로 같아요.', 3, { trLine: 'R: ∠C=∠F=90°' }),
        cue(5.5, 'AB와 DE의 같은 눈금이 H예요. 빗변의 길이가 같아요.', 4, { trLine: 'H: AB=DE' })
      ]),
      ch('한 예각과 대응점을 맞춰요', [
        cue(0, 'A와 D의 같은 예각이 A예요. 두 삼각형을 같은 방향으로 놓아요.', 5, { trCompare: true, trLine: 'A↔D, B↔E, C↔F' }),
        { at: 5.5, say: '대응점을 따라 옮겨 겹쳐 보아요. 길이와 각은 바꾸지 않아요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch('합동과 대응을 이용해요', [
        cue(0, concept ? '직각·빗변·한 예각이 각각 같아 완전히 포개어져요.' : v ? 'RHA 합동이에요. B는 90°−40°=50°이고 E와 대응해요.' : 'RHA 합동이에요. EF에 대응하는 변은 BC예요.', concept ? 6 : 7, { trCompare: false, trCalculationReady: !concept, trLine: concept ? '직각·빗변·한 예각이 각각 같다' : v ? '∠B=90°−40°=50°' : 'EF=BC' }),
        cue(5.5, concept ? '따라서 △ABC≡△DEF예요. 이 조건을 RHA 합동이라 해요.' : v ? '대응각은 같으므로 x=50°예요.' : '대응변은 같으므로 x=7 cm예요.', 8, { trShowAnswer: true, trLine: answer })
      ])
    ]);
  }
  lessons['t3-1'] = [rha(0, true), rha(0), rha(1)];

  function rhs(v, concept = false) {
    const answer = concept ? '△ABC는 이등변삼각형' : ['x = 8 cm', 'x = 40°', 'x = 50°'][v];
    return make(concept ? 'RHS성질' : ['밑변길이', '밑각', '반쪽각'][v], '공통인 변을 가진 직각삼각형', answer, [
      ch('공통인 AD를 따라가요', [
        { at: 0, say: 'AB=AC이고 AD는 BC에 수직이에요. AD는 두 삼각형에 공통이에요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? 'ABD와 ACD를 비교해 두 삼각형이 만든 전체 모양을 알아보아요.' : v === 0 ? 'BD=4 cm예요. BC를 구하려면 나머지 CD가 필요해요.' : v === 1 ? 'A의 전체 각은 100°예요. B의 각 x를 구해요.' : 'B의 각은 40°예요. 반쪽 각 CAD의 x를 구해요.', 2)
      ], fixed({ trKm: 8, trKa: 40, trM: 4, trV: v })),
      ch('R과 H를 확인해요', [
        cue(0, 'D에서 두 삼각형의 각은 모두 직각이에요. 이것이 R이에요.', 3, { trLine: 'R: ∠ADB=∠ADC=90°' }),
        cue(5.5, '직각의 맞은편 AB와 AC가 같은 빗변이에요. 이것이 H예요.', 4, { trLine: 'H: AB=AC' })
      ]),
      ch('공통인 한 변 S로 비교', [
        cue(0, '다른 한 변 AD는 공통이에요. 같은 길이 표시를 보며 떼어 놓아요.', 5, { trCompare: true, trLine: 'S: AD 공통, B↔C' }),
        { at: 5.5, say: 'A와 D를 기준으로 옮겨 겹쳐 보아요. B와 C가 대응해요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch('RHS 합동의 결과를 써요', [
        cue(0, concept ? '직각·빗변·다른 한 변이 같아 RHS 합동이에요.' : v === 0 ? 'RHS 합동이라 CD=BD=4 cm예요. BC는 두 부분의 합이에요.' : v === 1 ? 'RHS 합동이라 BAD와 CAD는 100°의 반인 50°예요.' : 'RHS 합동이라 CAD는 BAD와 같아요. BAD=90°−40°예요.', concept ? 6 : 7, { trCompare: false, trCalculationReady: !concept, trLine: concept ? '△ABD≡△ACD (RHS)' : v === 0 ? 'CD=BD=4 cm' : v === 1 ? '∠BAD=∠CAD=50°' : '∠CAD=∠BAD=90°−40°' }),
        cue(5.5, concept ? '붙인 전체 ABC는 AB=AC인 이등변삼각형이에요. 두 밑각도 같아요.' : v === 0 ? 'x=BD+CD=4+4=8 cm예요.' : v === 1 ? '직각삼각형 ABD에서 x=90°−50°=40°예요.' : 'x=50°예요. 전체 꼭지각과 반쪽 각을 구별해요.', 8, { trShowAnswer: true, trLine: answer })
      ])
    ]);
  }
  lessons['t3-2'] = [rhs(0, true), rhs(0), rhs(1), rhs(2)];

  const conditions = [
    { label: 'RHA', qi: 0, same: 'AB=DE, ∠A=∠D', read: '빗변 AB와 DE, 한 예각 A와 D가 같아요.', move: '같은 빗변과 예각을 기준으로 두 삼각형을 겹쳐 보아요.', end: '직각·빗변·한 예각이 각각 같으므로 RHA 합동이에요.', answer: 'RHA 합동' },
    { label: 'RHS', qi: 4, same: 'AB=DE, AC=DF', read: '빗변 AB와 DE, 다른 한 변 AC와 DF가 같아요.', move: '빗변과 다른 한 변을 기준으로 두 삼각형을 겹쳐 보아요.', end: '직각·빗변·다른 한 변이 각각 같으므로 RHS 합동이에요.', answer: 'RHS 합동' },
    { label: 'SAS', qi: 6, same: 'AC=DF, BC=EF', read: 'AC와 DF, BC와 EF가 같아요. 둘 다 직각을 낀 변이에요.', move: '같은 두 변이 만나는 직각을 맞추어 두 삼각형을 겹쳐 보아요.', end: '두 변과 그 끼인각이 각각 같으므로 SAS 합동이에요.', answer: 'SAS 합동' },
    { label: 'ASA', qi: 20, same: 'BC=EF, ∠B=∠E', read: 'BC와 EF, B와 E가 같아요. C와 F도 직각으로 같아요.', move: '같은 변과 그 양 끝 각을 맞추어 두 삼각형을 겹쳐 보아요.', end: '한 변과 그 양 끝 각이 각각 같으므로 ASA 합동이에요.', answer: 'ASA 합동' },
    { label: '두예각', qi: 23, same: '∠A=∠D, ∠B=∠E', read: '두 예각은 각각 같지만, 같다고 주어진 변은 없어요.', move: '예각을 그대로 두고 크기가 다른 예를 옮겨 비교해요.', end: '같은 각이어도 크기가 달라질 수 있어 합동을 보장할 수 없어요.', answer: '합동을 보장할 수 없음', counter: '각은 같은데 대응변 길이가 달라요.' },
    { label: '빗변만', qi: 5, same: 'AB=DE', read: '빗변만 같아요. 한 예각이나 다른 변이 같은지는 몰라요.', move: '빗변 길이는 그대로 두고 모양이 다른 예를 옮겨 비교해요.', end: '같은 빗변이어도 직각변이 달라질 수 있어 합동을 보장할 수 없어요.', answer: '합동을 보장할 수 없음', counter: '빗변은 겹쳐도 직각 꼭짓점이 달라요.' },
    { label: '한예각', qi: 21, same: '∠A=∠D', read: '한 예각만 같아요. 직각과 그 예각은 크기를 정하지 못해요.', move: '같은 예각을 가진 더 큰 삼각형을 옮겨 비교해요.', end: '한 예각을 유지하며 크기를 바꿀 수 있어 합동을 보장할 수 없어요.', answer: '합동을 보장할 수 없음', counter: '예각은 같은데 대응변 길이가 달라요.' },
    { label: '한직각변', qi: 15, same: 'AC=DF', read: '직각변 AC와 DF만 같아요. 다른 직각변의 길이는 몰라요.', move: 'AC와 DF의 길이는 유지하고 다른 직각변을 바꾼 예를 겹쳐요.', end: '다른 직각변이 달라질 수 있으므로 합동을 보장할 수 없어요.', answer: '합동을 보장할 수 없음', counter: 'AC와 DF는 겹쳐도 B와 E는 겹치지 않아요.' }
  ];
  lessons['t3-3'] = conditions.map(c => make(c.label, '주어진 합동 조건을 판별하기', c.answer, [
    ch('실제로 주어진 조건', [
      { at: 0, say: '두 삼각형의 C와 F는 직각이에요. 같은 표시의 뜻부터 확인해요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
      cue(5.5, c.read, 2)
    ], fixed({ trCase: 0, trSb: 40, trSc: 6, trSa: 56, trQi: c.qi, trV: 0 })),
    ch('직각 이외의 조건을 세어요', [
      cue(0, 'C와 F는 둘 다 90°예요. 그림이 비슷해 보이는지만 보지 않아요.', 3, { trLine: '∠C=∠F=90°' }),
      cue(5.5, c.read, 4, { trLine: c.same })
    ]),
    ch('조건을 유지하며 비교해요', [
      cue(0, c.counter ? '주어진 조건을 그대로 만족하는 다른 삼각형도 살펴보아요.' : '표시된 변과 각이 대응하도록 같은 방향으로 떼어 놓았어요.', 4, { trCompare: true, trLine: c.same }),
      { at: 5.5, say: c.move, to: { trMatch: 1 }, dur: 4 }
    ]),
    ch('반드시 합동인지 결론', [
      cue(0, c.counter || '표시된 조건을 맞추니 세 꼭짓점이 모두 겹쳐요.', undefined, { trLine: c.counter || '대응하는 세 꼭짓점이 겹친다' }),
      cue(5.5, c.end, 6, { trShowAnswer: true, trLine: c.answer })
    ])
  ]));

  function insideTrap(v, concept = false) {
    if (v === 2) return make('대응각', '직선과 두 예각의 합 이용', 'x = 40°', [
      ch('주어진 직각과 예각', [
        { at: 0, say: 'A와 C는 직각이고 BE⊥BD예요. 주어진 ABE는 40°예요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, 'x는 CDB예요. B에서 일직선인 세 각과 BCD의 두 예각을 봐요.', 2)
      ], fixed({ trQa: 5, trQb: 3, trAl: 40, trV: 2 })),
      ch('먼저 B의 남은 각', [
        cue(0, 'B에서 일직선이므로 CBD=180°−90°−40°=50°예요.', 3, { trCalculationReady: true, trLine: '∠CBD=50°' }),
        cue(5.5, 'BCD에서 C가 직각이므로 CBD와 CDB의 합은 90°예요.', 4, { trLine: '∠CBD+∠CDB=90°' })
      ]),
      ch('물은 각 CDB를 구해요', [
        cue(0, '구하는 x는 방금 구한 CBD가 아니에요. 90°에서 50°를 빼요.', 5, { trLine: 'x=90°−50°' }),
        cue(5.5, 'x=40°예요. 처음 주어진 ABE와 같은 크기예요.', 6, { trShowAnswer: true, trLine: 'x=40°' })
      ])
    ]);
    const area = v === 1, answer = concept ? '△EAB ≡ △BCD (RHA)' : area ? 'x = 32 cm²' : 'x = 8 cm';
    const chapters = [
      ch('두 직각삼각형을 찾아요', [
        { at: 0, say: 'A와 C는 직각이고 BE⊥BD, BE=BD예요. 두 빗변을 확인해요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? 'EAB와 BCD가 어떤 관계인지 같은 예각을 찾아 비교해요.' : area ? 'AE=5, AB=3 cm예요. 사다리꼴 AEDC의 넓이를 구해요.' : 'AE=5, AB=3 cm예요. AC=AB+BC에서 BC가 필요해요.', 2)
      ], fixed({ trQa: 5, trQb: 3, trAl: 40, trV: v })),
      ch('같은 예각을 찾아요', [
        cue(0, 'B에서 일직선이므로 EBA와 CBD의 합은 180°−90°=90°예요.', 3, { trLine: '∠EBA+∠CBD=90°' }),
        cue(5.5, 'BCD의 두 예각도 합이 90°예요. 따라서 EBA와 BDC가 같아요.', 4, { trLine: '∠EBA=∠BDC' })
      ]),
      ch('대응점을 따라 겹쳐요', [
        cue(0, 'BEA와 DBC를 같은 방향으로 놓아요. B↔D, E↔B, A↔C예요.', 5, { trCompare: true, trLine: '직각·빗변·한 예각을 맞추기' }),
        { at: 5.5, say: '직각과 같은 빗변, 방금 찾은 예각을 맞추어 옮겨 겹쳐요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch(concept ? '두 삼각형의 관계' : '대응하는 길이를 구해요', [
        cue(0, concept ? '직각·빗변·한 예각이 각각 같아 두 삼각형이 포개어져요.' : 'RHA 합동이므로 BC=AE=5 cm, CD=AB=3 cm예요.', concept ? 5 : 6, { trCompare: false, trCalculationReady: !concept, trLine: concept ? 'E↔B, A↔C, B↔D' : 'BC=5 cm, CD=3 cm' }),
        cue(5.5, concept ? '따라서 △EAB≡△BCD이고, 합동 조건은 RHA예요.' : area ? 'AE와 CD가 평행해요. 그 사이 높이 AC는 3+5=8 cm예요.' : 'AC=AB+BC이므로 x=3+5=8 cm예요.', concept || area ? 6 : 8, { trShowAnswer: concept || !area, trLine: concept ? answer : area ? 'AE=5, CD=3, 높이 AC=8 cm' : answer })
      ])
    ];
    if (area) chapters.push(ch('사다리꼴 넓이 계산', [
      cue(0, '두 평행한 변의 합에 높이를 곱하고 2로 나누어요.', 7, { trLine: 'x=(5+3)×8÷2' }),
      cue(5.5, 'x=32 cm²예요. 높이는 AB가 아니라 AC 전체예요.', 8, { trShowAnswer: true, trLine: answer })
    ]));
    return make(concept ? '합동찾기' : area ? '사다리꼴' : '전체길이', '사다리꼴 속 같은 직각삼각형', answer, chapters);
  }
  lessons['t3-4'] = [insideTrap(0, true), insideTrap(0), insideTrap(1), insideTrap(2)];

  function throughVertex(v, concept = false) {
    const area = v === 2, answer = concept ? '△ABD ≡ △CAE (RHA)' : ['x = 8 cm', 'x = 5 cm', 'x = 32 cm²'][v];
    const chapters = [
      ch('직선에 내린 수선', [
        { at: 0, say: 'A는 직각이고 AB=AC예요. B와 C의 수선의 발이 D, E예요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? 'ABD와 CAE를 비교해요. 두 삼각형이 어떤 관계인지 확인해요.' : v === 1 ? 'BD=3, AD=5 cm예요. CE의 길이 x를 구해요.' : area ? 'BD=3, CE=5 cm예요. 사다리꼴 BDEC의 넓이를 구해요.' : 'BD=3, CE=5 cm예요. DE=AD+AE를 구해요.', 2)
      ], fixed({ trLm: 3, trLn: 5, trV: v })),
      ch('같은 예각의 근거', [
        cue(0, 'A에서 일직선이라 BAD와 CAE의 합은 90°예요.', 3, { trLine: '∠BAD+∠CAE=90°' }),
        cue(5.5, 'ABD의 두 예각 합도 90°라서 ABD와 CAE가 같은 각이에요.', undefined, { trLine: '∠ABD=∠CAE' })
      ]),
      ch('직각·빗변·예각 비교', [
        cue(0, 'BAD와 ACE를 떼어 놓아요. 직각 D↔E, 빗변 BA↔AC예요.', 4, { trCompare: true, trLine: 'B↔A, A↔C, D↔E' }),
        { at: 5.5, say: '같은 예각 B와 A까지 맞추어 두 삼각형을 옮겨 겹쳐요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch(concept ? '합동 관계를 읽어요' : '대응변의 길이를 이용', [
        cue(0, concept ? '직각·빗변·한 예각이 같고, 대응하는 세 점이 모두 포개어져요.' : v === 1 ? 'RHA 합동이므로 CE는 AD와 대응해요. BD와 혼동하지 않아요.' : 'RHA 합동이므로 AE=BD=3 cm, AD=CE=5 cm예요.', concept ? 4 : 5, { trCompare: false, trCalculationReady: !concept, trLine: concept ? 'A↔C, B↔A, D↔E' : v === 1 ? 'CE=AD' : area ? 'AD=5, AE=3, 높이 DE=8 cm' : 'AE=3 cm, AD=5 cm' }),
        cue(5.5, concept ? '따라서 △ABD≡△CAE이고, 합동 조건은 RHA예요.' : v === 1 ? 'CE=AD이므로 x=5 cm예요.' : area ? '평행한 두 변 BD와 CE 사이의 높이는 DE=5+3=8 cm예요.' : 'DE=AD+AE이므로 x=5+3=8 cm예요.', concept || area ? 5 : 7, { trShowAnswer: concept || !area, trLine: concept ? answer : area ? 'BD=3, CE=5, 높이 DE=8 cm' : answer })
      ])
    ];
    if (area) chapters.push(ch('높이를 확인하고 넓이 계산', [
      cue(0, '평행한 두 변의 합에 높이 DE를 곱하고 2로 나누어요.', 6, { trLine: 'x=(3+5)×8÷2' }),
      cue(5.5, 'x=32 cm²예요. 3 cm인 BD를 높이로 쓰지 않아요.', 7, { trShowAnswer: true, trLine: answer })
    ]));
    return make(concept ? '합동찾기' : ['수선발사이', '한수선길이', '사다리꼴'][v], '꼭짓점과 직선에서 합동 찾기', answer, chapters);
  }
  lessons['t3-5'] = [throughVertex(0, true), throughVertex(0), throughVertex(1), throughVertex(2)];

  function kite(v, concept = false) {
    const answer = concept ? 'CB = CD인 연 모양' : ['x = 100°', 'x = 5 cm', 'x = 50°'][v];
    const finalCues = [
      cue(0, concept ? 'RHS 합동이라 B↔D예요. A와 C는 각각 자기 자신과 대응해요.' : v === 0 ? 'RHS 합동이에요. A는 40°씩, C는 90°−40°=50°씩이에요.' : v === 1 ? 'RHS 합동이므로 CD에 대응하는 변은 CB예요.' : 'RHS 합동으로 ACD=ACB예요. ACB=90°−40°=50°예요.', concept ? 6 : 7, { trCompare: false, trCalculationReady: !concept, trLine: concept ? '△ABC≡△ADC (RHS)' : v === 0 ? '∠BAC=40°, ∠BCA=50°' : v === 1 ? 'CD=CB' : '∠ACB=50°' }),
      cue(5.5, concept ? 'CB=CD도 성립하므로 두 쌍의 이웃한 변이 같은 연 모양이에요.' : v === 0 ? '전체 각 BCD는 반쪽의 두 배라 x=2×50°=100°예요.' : v === 1 ? 'CD=CB이므로 x=5 cm예요.' : '대응각은 같으므로 x=50°예요.', 8, { trShowAnswer: true, trLine: answer })
    ];
    if (concept) finalCues.push(cue(9, '대응각도 같아 AC는 A와 C의 각을 각각 이등분해요.', undefined, { trLine: 'AC는 ∠A와 ∠C의 이등분선' }));
    return make(concept ? '연의성질' : ['마주보는각', '대응변', '반쪽각'][v], '빗변을 공유하는 연 모양', answer, [
      ch('공통인 빗변을 그어요', [
        { at: 0, say: 'B와 D는 직각이고 AB=AD예요. 두 삼각형의 공통인 AC를 그어요.', set: begin(!concept), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, concept ? '빗변을 함께 쓰는 두 직각삼각형이 어떤 모양을 만드는지 살펴요.' : v === 0 ? 'BAD=80°예요. 반대편 전체 각 BCD의 x를 구해요.' : v === 1 ? 'BC=5 cm예요. 다른 쪽 CD의 길이 x를 구해요.' : 'BAC=40°예요. C의 반쪽 각 ACD의 x를 구해요.', 2)
      ], fixed({ trKm: 6, trKa: 40, trKt: 0, trM: 5, trV: v })),
      ch('직각과 공통인 빗변', [
        cue(0, 'B와 D가 모두 직각이라는 조건이 R이에요.', 3, { trLine: 'R: ∠B=∠D=90°' }),
        cue(5.5, '직각의 맞은편 AC가 두 삼각형에 공통인 빗변 H예요.', 4, { trLine: 'H: AC 공통' })
      ]),
      ch('다른 한 변까지 비교', [
        cue(0, 'AB=AD가 S예요. ACB와 ACD를 같은 방향으로 떼어 놓아요.', 5, { trCompare: true, trLine: 'S: AB=AD, B↔D' }),
        { at: 5.5, say: '빗변 AC와 대응점을 맞추어 두 삼각형을 옮겨 겹쳐요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch('합동의 결과로 마무리', finalCues)
    ]);
  }
  lessons['t3-6'] = [kite(0, true), kite(0), kite(1), kite(2)];

  function congruentArea(v) {
    const answer = v ? 'x = 50 cm²' : 'x = 26 cm²';
    const chapters = [
      ch('원래 조건과 물은 넓이', [
        { at: 0, say: 'A는 직각이고 AB=AC예요. 수선 BD=4, CE=6 cm를 확인해요.', set: begin(), to: { trTrace: 1 }, dur: 4 },
        cue(5.5, v ? '구하는 것은 사다리꼴 BDEC의 넓이예요. 높이 DE부터 구해요.' : '구하는 것은 ABC의 넓이예요. 큰 사다리꼴에서 두 삼각형을 빼요.', 2)
      ], fixed({ trUm: 4, trUe: 2, trV: v })),
      ch('합동에 쓸 예각을 찾아요', [
        cue(0, 'A에서 일직선이므로 BAD와 CAE의 합은 90°예요.', 2, { trLine: '∠BAD+∠CAE=90°' }),
        cue(5.5, 'ABD의 두 예각 합도 90°라서 ABD와 CAE가 같아요.', 3, { trLine: '∠ABD=∠CAE' })
      ]),
      ch('두 직각삼각형을 비교', [
        cue(0, '직각 D와 E, 빗변 AB와 CA, 한 예각이 같아 RHA 합동이에요.', 3, { trCompare: true, trLine: 'B↔A, A↔C, D↔E' }),
        { at: 5.5, say: '같은 방향의 두 삼각형을 옮겨 겹쳐서 대응변을 확인해요.', to: { trMatch: 1 }, dur: 4 }
      ]),
      ch('높이와 사다리꼴 넓이', [
        cue(0, 'AE=4, AD=6 cm이므로 높이 DE=10 cm예요.', 4, { trCompare: false, trCalculationReady: true, trLine: '높이 DE=AD+AE=10 cm' }),
        cue(5.5, v ? 'x=(4+6)×10÷2=50 cm²예요. 높이는 DE예요.' : '사다리꼴 BDEC의 넓이는 (4+6)×10÷2=50 cm²예요.', v ? 6 : 5, { trShowAnswer: !!v, trLine: v ? answer : '사다리꼴 BDEC=50 cm²' })
      ])
    ];
    if (!v) chapters.push(ch('두 직각삼각형을 빼요', [
      cue(0, '작은 두 삼각형의 넓이 합은 2×(4×6÷2)=24 cm²예요.', 6, { trLine: '△ABD+△CAE=24 cm²' }),
      cue(5.5, 'x=50−24=26 cm²예요. 큰 사다리꼴 넓이에서 멈추지 않아요.', 7, { trShowAnswer: true, trLine: answer })
    ]));
    return make(v ? '사다리꼴' : '가운데넓이', '합동으로 높이를 구한 뒤 넓이', answer, chapters);
  }
  lessons['t3-7'] = [congruentArea(0), congruentArea(1)];
})();
