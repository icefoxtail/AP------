/* 정다각형 결합: 원본 모델의 고정 조건, 보조선 진행, 마지막 장의 정답. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = window.APL_LESSONS['g7-parallel'] = window.APL_LESSONS['g7-parallel'] || {};
  const start = { tA: 24, tX: -1, tAux: 0, gN: 5, gT: 40, gAux: 0, hN: 6, hT: 40, hAux: 0, paBLine: 0 };
  const chapter = (title, cues) => ({ title, length: 10, cues });
  const lesson = (title, label, answer, summary, ask, chapters) => {
    chapters[0].start = { ...start };
    Object.assign(chapters[0].cues[0], { set: { paShowAnswer: false, paBStage: 0, paBAsk: ask }, to: { paBLine: 1 }, dur: 4 });
    return { title, label, tab: 'review', answer, answerText: answer, summary, task: '직접 해 보기에서 각이나 정다각형을 바꾸어 같은 방법으로 확인해 보세요', chapters };
  };
  Object.assign(lessons, {
    'p3-1': [
      lesson('정삼각형의 각과 평행선', '각의 관계', 'a+b=60°', '평행 보조선에 엇각을 옮겨 한 내각과 비교해요', 'relation', [
        chapter('주어진 각과 보조선', [
          { at: 0, say: 'l과 m은 평행하고 노란 a는 24°예요.' },
          { at: 5, say: 'A에 두 선과 평행한 보조선을 그어요.', step: 1 }
        ]),
        chapter('엇각을 꼭짓점으로', [
          { at: 0, say: '엇각이 같아 B의 a를 A로 옮겨요.', set: { paBStage: 1 }, step: 2 },
          { at: 5, say: 'C의 b도 옮기면 두 각이 ∠BAC를 채워요.', set: { paBStage: 2 } }
        ]),
        chapter('한 내각과 비교하기', [
          { at: 0, say: '정삼각형의 한 내각은 60°예요.', step: 3 },
          { at: 5, say: '따라서 a+b=60°예요.', set: { paShowAnswer: true } }
        ])
      ]),
      lesson('정삼각형에서 미지각 구하기', 'x 구하기', 'x=36°', '알려진 각을 한 내각에서 빼서 미지각을 구해요', 'numeric', [
        chapter('문제의 각과 보조선', [
          { at: 0, say: 'l∥m이고 정삼각형의 노란 각은 24°예요.' },
          { at: 5, say: '구하는 각은 x이고 A에 평행 보조선을 그어요.', step: 1 }
        ]),
        chapter('엇각을 옮기기', [
          { at: 0, say: 'B의 24°를 엇각인 A의 각에 표시해요.', set: { paBStage: 1 }, step: 2 },
          { at: 5, say: 'C의 x도 엇각이므로 A로 옮겨요.', set: { paBStage: 2 } }
        ]),
        chapter('미지각의 식 세우기', [
          { at: 0, say: '옮긴 두 각이 정삼각형의 한 내각을 채워요.', step: 2 },
          { at: 5, say: '한 내각은 60°이므로 24°+x=60°예요.', set: { paBStage: 3 } }
        ]),
        chapter('알려진 각 빼기', [
          { at: 0, say: '합 60°에서 주어진 24°를 빼요.', step: 3 },
          { at: 5, say: 'x=60°−24°이므로 x=36°예요.', set: { paShowAnswer: true } }
        ])
      ])
    ],
    'p3-2': [
      lesson('정오각형의 내각과 두 각', '각의 관계', 'a+b=108°', '정다각형의 한 내각을 엇각 두 개로 나누어요', 'relation', [
        chapter('꺾인 점에 보조선', [
          { at: 0, say: 'l∥m인 그림에서 정오각형을 살펴봐요.' },
          { at: 5, say: '노란 a=44°와 보라 b를 옮기려 B에 보조선을 그어요.', step: 1 }
        ]),
        chapter('한 내각의 크기', [
          { at: 0, say: '한 내각을 I라 하고 내각의 합을 5로 나눠요.', step: 1 },
          { at: 5, say: 'I=(5−2)×180°÷5=108°예요.', set: { paBStage: 1 } }
        ]),
        chapter('엇각을 내각 안으로', [
          { at: 0, say: '평행선의 엇각으로 a를 B에 옮겨요.', set: { paBStage: 2 }, step: 2 },
          { at: 5, say: 'b도 B로 옮기면 두 각이 한 내각을 채워요.', set: { paBStage: 3 } }
        ]),
        chapter('내각과 두 각의 관계', [
          { at: 0, say: 'a와 b는 겹치지 않고 ∠ABC를 나눠 가져요.', step: 3 },
          { at: 5, say: '따라서 a+b=108°예요.', set: { paShowAnswer: true } }
        ])
      ]),
      lesson('정오각형에서 미지각 구하기', 'x 구하기', 'x=64°', '내각을 구한 뒤 주어진 각을 빼요', 'numeric', [
        chapter('주어진 정오각형', [
          { at: 0, say: 'l∥m이고 정오각형의 노란 각은 44°예요.' },
          { at: 5, say: '구하는 각 x를 B로 옮기려고 평행 보조선을 그어요.', step: 1 }
        ]),
        chapter('한 내각 계산하기', [
          { at: 0, say: '한 내각 I는 정오각형의 내각의 합을 5로 나눈 값이에요.', step: 1 },
          { at: 5, say: 'I=(5−2)×180°÷5=108°예요.', set: { paBStage: 1 } }
        ]),
        chapter('미지각의 식', [
          { at: 0, say: '엇각이 같으므로 44°와 x를 꼭짓점 B로 옮겨요.', set: { paBStage: 3 }, step: 2 },
          { at: 5, say: '두 각이 한 내각을 채워 44°+x=108°예요.', set: { paBStage: 4 } }
        ]),
        chapter('내각에서 빼기', [
          { at: 0, say: '내각 108°에서 주어진 44°를 빼요.', step: 3 },
          { at: 5, say: 'x=108°−44°이므로 x=64°예요.', set: { paShowAnswer: true } }
        ])
      ])
    ],
    'p3-3': [
      lesson('두 내각과 평행 보조선', '각의 관계', 'a+b=60°', '두 내각의 합에서 보조각의 합을 빼요', 'relation', [
        chapter('두 꺾인 점에 보조선', [
          { at: 0, say: 'l∥m이고 정육각형의 노란 a는 25°예요.' },
          { at: 5, say: '꺾인 점 B, C에 평행 보조선을 각각 그어요.', step: 1 }
        ]),
        chapter('정육각형의 한 내각', [
          { at: 0, say: '정육각형의 한 내각을 I라 해요.', step: 1 },
          { at: 5, say: 'I=(6−2)×180°÷6=120°예요.', set: { paBStage: 1 } }
        ]),
        chapter('옮긴 각과 남은 각', [
          { at: 0, say: '엇각이 같으므로 a와 b를 B, C로 옮겨요.', set: { paBStage: 2 }, step: 2 },
          { at: 5, say: '두 내각의 남은 부분을 각각 c, d라 해요.', set: { paBStage: 3 } }
        ]),
        chapter('내각과 보조각의 식', [
          { at: 0, say: 'a+c=120°, d+b=120°예요.', set: { paBStage: 4 }, step: 3 },
          { at: 5, say: '보조선도 평행하므로 c+d=180°예요.', set: { paBStage: 5 } }
        ]),
        chapter('남은 두 각의 합', [
          { at: 0, say: '두 내각의 합에서 c+d를 빼면 a와 b만 남아요.', step: 3 },
          { at: 5, say: '따라서 a+b=120°+120°−180°=60°예요.', set: { paShowAnswer: true } }
        ])
      ]),
      lesson('두 꼭짓점을 지나는 미지각', 'x 구하기', 'x=35°', '두 내각으로 각의 합을 구한 뒤 주어진 각을 빼요', 'numeric', [
        chapter('주어진 각과 두 보조선', [
          { at: 0, say: 'l∥m이고 정육각형의 노란 각은 25°예요.' },
          { at: 5, say: 'x를 구하려 B, C에 평행 보조선을 각각 그어요.', step: 1 }
        ]),
        chapter('한 내각의 크기', [
          { at: 0, say: '정육각형의 한 내각을 I라 해요.', step: 1 },
          { at: 5, say: 'I=(6−2)×180°÷6=120°예요.', set: { paBStage: 1 } }
        ]),
        chapter('엇각과 보조각', [
          { at: 0, say: '엇각이 같으므로 25°와 x를 B, C로 옮겨요.', set: { paBStage: 2 }, step: 2 },
          { at: 5, say: '두 내각의 남은 부분을 각각 c, d라 해요.', set: { paBStage: 3 } }
        ]),
        chapter('두 내각의 식 세우기', [
          { at: 0, say: '25°+c=120°, d+x=120°예요.', set: { paBStage: 4 }, step: 3 },
          { at: 5, say: '보조선도 평행하므로 c+d=180°예요.', set: { paBStage: 5 } }
        ]),
        chapter('두 각의 합 구하기', [
          { at: 0, say: '두 내각의 합에서 c+d를 빼요.', step: 3 },
          { at: 5, say: '25°+x=120°+120°−180°=60°예요.', set: { paBStage: 6 } }
        ]),
        chapter('알려진 각 빼기', [
          { at: 0, say: '합 60°에서 알려진 25°를 빼요.', step: 3 },
          { at: 5, say: 'x=60°−25°이므로 x=35°예요.', set: { paShowAnswer: true } }
        ])
      ])
    ]
  });
})();
