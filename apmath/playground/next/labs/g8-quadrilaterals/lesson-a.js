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
})();
