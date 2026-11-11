/* 중2 시범: 개념 상태와 고정 pyQ 문제 상태를 구별하여 재생한다. */
(function () {
  'use strict';
  const all = window.APL_LESSONS = window.APL_LESSONS || {};
  const lessons = all['g8-pythagoras'] = all['g8-pythagoras'] || {};
  const begin = (problem, mode, q) => ({ pyLessonProblem: problem, pyLessonMode: mode, pyShowAnswer: false, pyCalculationReady: false, pySquareAReady: false, pySquareBReady: false, pySquareCReady: false, pySupportReady: false, pyOtherReady: false, pyQ: q, pySeed: 0, pyGrid: false, pyArrange: 0 });
  const ch = (title, length, cues, start) => ({ title, length, ...(start ? { start } : {}), cues });
  const make = (label, title, answer, summary, task, chapters) => ({ label, title, answer, answerText: answer, summary, task, tab: 'review', chapters });

  lessons['py1-sq'] = [make('넓이관계', '세 정사각형의 넓이 관계', 'a² + b² = c²', '직각변 위 두 넓이의 합이 빗변 위 넓이예요', '직각변의 길이를 바꾸고 세 정사각형의 넓이를 비교해 보세요', [
    ch('세 변의 이름을 정해요', 12, [
      { at: 0, say: '직각을 낀 두 변은 a=3, b=4예요. 변 a를 따라가요.', set: begin(false, 'squares', { pyA: 3, pyB: 4 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: '직각 C의 맞은편을 빗변 c라 해요. 넓이는 변의 제곱이에요.', step: 1 }
    ], { pyA: 3, pyB: 4, pyTrace: 0 }),
    ch('직각변 위의 두 넓이', 12, [
      { at: 0, say: 'a 위 정사각형의 넓이는 a²=3²=9예요.', step: 2, set: { pySquareAReady: true } },
      { at: 5.5, say: 'b 위 정사각형의 넓이는 b²=4²=16이에요.', set: { pySquareBReady: true } }
    ]),
    ch('빗변 위 넓이와 비교해요', 12, [
      { at: 0, say: '노란 정사각형의 넓이는 c²예요. 두 작은 넓이와 비교해요.', step: 3 },
      { at: 5.5, say: '9+16=25예요. 직각삼각형에서는 a²+b²=c²가 성립해요.', set: { pyCalculationReady: true, pyShowAnswer: true } }
    ])
  ])];

  lessons['py1-leg'] = [make('직각변', '빗변에서 직각변 구하기', 'x = 8', '직각변의 제곱은 빗변의 제곱에서 빼서 구해요', '빗변과 주어진 직각변을 바꾸고 나머지 길이를 구해 보세요', [
    ch('빗변과 미지수를 구별해요', 12, [
      { at: 0, say: '직각 맞은편 빗변 c는 10, 한 직각변 a는 6이에요.', set: begin(true, 'leg', { pyH: 10, pyL: 6, pyK: 0 }), to: { pyTrace: 1 }, dur: 4 },
      { at: 5.5, say: '구하는 직각변 b=x예요. x²=빗변²−다른 직각변²예요.', step: 1 }
    ], { pyH: 10, pyL: 6, pyTrace: 0 }),
    ch('주어진 길이를 제곱해요', 12, [
      { at: 0, say: '빗변 위 정사각형은 c²=10²=100이에요.', step: 2, set: { pySquareCReady: true } },
      { at: 5.5, say: '주어진 직각변 위 정사각형은 a²=6²=36이에요.', set: { pySquareAReady: true } }
    ]),
    ch('남은 정사각형의 넓이', 12, [
      { at: 0, say: '남은 초록색 넓이는 x²=100−36=64예요.', step: 3, set: { pyCalculationReady: true } },
      { at: 5.5, say: '64는 길이가 아니라 제곱한 값이에요. 길이를 한 번 더 구해요.' }
    ]),
    ch('양수인 길이를 찾아요', 12, [
      { at: 0, say: '어떤 양수를 제곱하면 64가 되는지 생각해 보아요.' },
      { at: 5.5, say: '8²=64이므로 나머지 직각변의 길이는 x=8이에요.', set: { pyShowAnswer: true } }
    ])
  ])];

  lessons['py2-euclid'] = [make('왼쪽넓이', '빗변 위 직사각형의 넓이', '256', '왼쪽 직사각형의 넓이는 AC의 제곱과 같아요', '다른 직각삼각형을 골라 두 직사각형과 정사각형을 짝지어 보세요', [
    ch('주어진 변과 구할 넓이', 12, [
      { at: 0, say: 'AB는 20, BC는 12예요. 구하는 x는 왼쪽 직사각형의 넓이예요.', set: begin(true, 'euclid-area', { pyP: 5 }), to: { pyG: 0.35 }, dur: 4 },
      { at: 5.5, say: '세 정사각형의 한 변은 각각 삼각형의 변이에요.', step: 1 }
    ], { pyP: 5, pyG: 0 }),
    ch('수선을 따라 나눈 두 부분', 12, [
      { at: 0, say: '수선 CH를 연장해 나눈 두 직사각형을 갈라 보아요.', to: { pyG: 1 }, dur: 4 },
      { at: 5.5, say: '왼쪽은 AC 위 초록 정사각형과 넓이가 같아요. 이유를 살펴요.', step: 2 }
    ]),
    ch('닮음으로 같은 넓이 확인', 12, [
      { at: 0, say: '직각과 공통각 A가 같아 삼각형 ABC와 ACH는 닮아요.', step: 3, set: { pySupportReady: true } },
      { at: 5.5, say: 'AB:AC=AC:AH이므로 AB×AH=AC²예요.' }
    ]),
    ch('직각변의 제곱으로 계산', 12, [
      { at: 0, say: '왼쪽 넓이는 AC²=AB²−BC²=400−144예요.', step: 4, set: { pyCalculationReady: true } },
      { at: 5.5, say: '따라서 왼쪽 직사각형의 넓이는 400−144=256이에요.', step: 5, set: { pyShowAnswer: true } }
    ])
  ])];
})();
