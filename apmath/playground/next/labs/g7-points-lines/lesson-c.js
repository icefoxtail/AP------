/* 원본 입체·중점 모델과 문제 seed를 고정한 점·선·면 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-points-lines'] = window.APL_LESSONS['g7-points-lines'] || {};
  const reset = goal => ({ plShowAnswer: false, plLessonGoal: goal, plFirstReady: false, plSecondReady: false, plGroupsReady: false, plEquationReady: false, plUnitReady: false, plXReady: false, plLengthReady: false });
  const countStart = (k, e) => ({ p1n: 5, p1k: k, p1e: e, plYaw: -35, plPit: 30, plSeed: 0 });

  bank['b1-1'] = [
    { title: '오각기둥의 교점과 교선', label: 'b−a', tab: 'review', answer: 'b − a = 5',
      summary: '꼭짓점과 모서리를 따로 센 뒤 식에 넣습니다', task: '뒤쪽 점선의 모서리까지 세었는지 확인해 보세요',
      chapters: [
        { length: 12, title: '기호와 구할 값', start: countStart(0, 0), cues: [
          { at: 0, say: '오각기둥을 돌려 봐요. a는 교점의 개수, b는 교선의 개수예요.', set: reset('difference'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '구할 것은 b−a예요. 꼭짓점과 모서리를 따로 세어 식에 넣어요.' }
        ] },
        { length: 11, title: '교점부터 세기', cues: [
          { at: 0, say: '교점은 모서리들이 만나는 꼭짓점이에요. 윗면과 아랫면에 각각 5개예요.', step: 1, set: { plGroupsReady: true } },
          { at: 6, say: '교점은 5+5=10개이므로 a=10이에요.', set: { plFirstReady: true } }
        ] },
        { length: 11, title: '교선 세 무리 세기', cues: [
          { at: 0, say: '교선은 두 면이 만나는 모서리예요. 윗면, 아랫면, 옆에 각각 5개예요.', step: 2 },
          { at: 6, say: '교선은 5+5+5=15개이므로 b=15예요.', set: { plSecondReady: true } }
        ] },
        { length: 10, title: '구한 값을 식에 넣기', cues: [
          { at: 0, say: 'b−a에서 b 자리에 15, a 자리에 10을 넣어요.' },
          { at: 5, say: '따라서 b − a = 5예요. 15−10으로 확인해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '오각뿔의 교점과 교선', label: 'a+b', tab: 'review', answer: 'a + b = 16',
      summary: '각뿔의 꼭대기 하나와 옆 모서리를 빠짐없이 셉니다', task: '각기둥과 달리 꼭대기가 한 점인 것을 확인해 보세요',
      chapters: [
        { length: 12, title: '각뿔과 두 기호', start: countStart(1, 1), cues: [
          { at: 0, say: '오각뿔을 돌려 봐요. 교점의 개수를 a, 교선의 개수를 b라 해요.', set: reset('sum'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'a+b를 구하려면 꼭짓점의 개수와 모서리의 개수를 각각 세어요.' }
        ] },
        { length: 11, title: '꼭대기 하나 더하기', cues: [
          { at: 0, say: '교점은 꼭짓점이에요. 밑면에 5개, 위 꼭대기에 1개가 있어요.', step: 1, set: { plGroupsReady: true } },
          { at: 6, say: '교점은 5+1=6개이므로 a=6이에요.', set: { plFirstReady: true } }
        ] },
        { length: 11, title: '밑면과 옆 모서리 세기', cues: [
          { at: 0, say: '교선은 모서리예요. 밑면에 5개, 꼭대기로 올라가는 옆에 5개예요.', step: 2 },
          { at: 6, say: '교선은 5+5=10개이므로 b=10이에요.', set: { plSecondReady: true } }
        ] },
        { length: 10, title: '교점 수와 교선 수의 합', cues: [
          { at: 0, say: 'a+b에 교점 수 6과 교선 수 10을 넣고 더해요.' },
          { at: 5, say: '따라서 a + b = 16이에요. 6+10으로 확인해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '오각뿔대의 교점과 교선', label: '2b−a', tab: 'review', answer: '2b − a = 20',
      summary: '윗면이 작아져도 꼭짓점과 모서리의 수를 모두 셉니다', task: '모서리 수를 두 배 한 다음 꼭짓점 수를 빼 보세요',
      chapters: [
        { length: 12, title: '각뿔대와 구할 식', start: countStart(2, 2), cues: [
          { at: 0, say: '오각뿔대를 돌려 봐요. 교점의 개수는 a, 교선의 개수는 b예요.', set: reset('double-difference'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '구할 식은 2b−a예요. 윗면과 아랫면을 모두 세어야 해요.' }
        ] },
        { length: 11, title: '작은 윗면도 세기', cues: [
          { at: 0, say: '윗면이 작아도 꼭짓점은 5개예요. 아랫면의 꼭짓점도 5개예요.', step: 1, set: { plGroupsReady: true } },
          { at: 6, say: '교점은 5+5=10개이므로 a=10이에요.', set: { plFirstReady: true } }
        ] },
        { length: 11, title: '모서리를 세 무리로 세기', cues: [
          { at: 0, say: '교선인 모서리는 윗면, 아랫면, 옆에 각각 5개씩 있어요.', step: 2 },
          { at: 6, say: '교선은 5+5+5=15개이므로 b=15예요.', set: { plSecondReady: true } }
        ] },
        { length: 10, title: '곱셈을 먼저 계산하기', cues: [
          { at: 0, say: '먼저 2b=2×15=30을 구한 뒤 a인 10을 빼요.', set: { plEquationReady: true } },
          { at: 5, say: '따라서 2b − a = 20이에요. 30−10으로 확인해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const planeStart = (mode, par, seed) => ({ p2t: 60, p2x: 0, p2par: par, p2m: mode, plYaw: -30, plPit: 24, plSeed: seed });
  bank['b1-2'] = [
    { title: '서로 다른 두 평면의 만남', label: '면과 면', tab: 'review', answer: '교선',
      summary: '두 평면에 동시에 놓인 부분이 점인지 선인지 구별합니다', task: '평면을 기울이거나 평행하게 놓아 만나는 부분을 찾아보세요',
      chapters: [
        { length: 12, title: '평면 P와 평면 Q', start: planeStart(0, 0, 7), cues: [
          { at: 0, say: 'P와 Q는 평면의 이름이에요. 만나는 곳을 돌려 보며 찾아요.', set: reset('plane-plane'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '그림은 평면의 일부예요. 실제 평면은 그림의 끝을 넘어 계속 이어져요.' }
        ] },
        { length: 12, title: '공통으로 놓인 부분', cues: [
          { at: 0, say: '초록 부분은 두 평면에 동시에 포함된 한 직선이에요.', step: 2 },
          { at: 6, say: '서로 다른 두 평면이 만나서 생긴 선을 교선이라고 해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '직선과 평면의 한 점', label: '선과 면', tab: 'review', answer: '교점',
      summary: '직선이 평면을 뚫는 한 곳에 주목합니다', task: '평면에 포함된 직선과 한 점에서만 만나는 직선을 구별해 보세요',
      chapters: [
        { length: 12, title: '직선 m과 평면 P', start: planeStart(1, 0, 1), cues: [
          { at: 0, say: 'm은 직선, P는 평면의 이름이에요. 직선이 평면을 뚫고 지나가요.', set: reset('line-plane'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '초록 점을 보세요. 이 직선과 평면은 그 한 곳에서만 만나요.' }
        ] },
        { length: 12, title: '만나는 점의 이름', cues: [
          { at: 0, say: '지금은 직선 전체가 평면에 포함된 경우가 아니에요.', step: 2 },
          { at: 6, say: '직선과 평면이 한 점에서 만날 때 그 점을 교점이라고 해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '평행한 두 평면', label: '평행', tab: 'review', answer: '교선 없음',
      summary: '서로 떨어진 평행한 두 평면은 만나지 않습니다', task: '평행하게 놓기와 기울이기를 바꾸며 만나는지 확인해 보세요',
      chapters: [
        { length: 12, title: '떨어져 있는 두 평면', start: planeStart(0, 1, 0), cues: [
          { at: 0, say: '평면 P와 Q를 평행하게 놓았어요. 돌려 보면 두 면이 떨어져 있어요.', set: reset('parallel'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '서로 다른 두 평면이지만, 지금은 공통으로 놓인 부분이 없어요.' }
        ] },
        { length: 12, title: '끝없이 넓혀도 만나지 않기', cues: [
          { at: 0, say: '평행한 두 평면은 끝없이 펼쳐도 만나지 않아요.', step: 2 },
          { at: 6, say: '만나서 생기는 선이 없으므로 정답은 교선 없음이에요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const compareStart = (goal) => goal === 'sum'
    ? { p3a: 3, p3b: 3, p3ka: 1, p3kb: 0, plYaw: -35, plPit: 30, plSeed: 0 }
    : { p3a: 4, p3b: goal === 'vertices' ? 7 : 6, p3ka: 0, p3kb: 1, plYaw: -35, plPit: 30, plSeed: goal === 'vertices' ? 4 : 3 };
  bank['b1-3'] = [
    { title: '교점 수가 같은 입체 찾기', label: '교점 비교', tab: 'review', answer: '칠각뿔',
      summary: '각기둥의 두 밑면과 각뿔의 꼭대기를 나누어 셉니다', task: '두 입체의 모양이 달라도 꼭짓점 수가 같은지 확인해 보세요',
      chapters: [
        { length: 12, title: '교점은 꼭짓점', start: compareStart('vertices'), cues: [
          { at: 0, say: '왼쪽은 사각기둥이에요. 교점은 모서리들이 만나는 꼭짓점이에요.', set: reset('vertices'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '오른쪽 입체와 교점 수를 비교해요. 뒤쪽 꼭짓점도 모두 세어요.' }
        ] },
        { length: 12, title: '두 입체의 꼭짓점 세기', cues: [
          { at: 0, say: '사각기둥은 위아래에 4개씩이므로 교점은 4+4=8개예요.', step: 1, set: { plFirstReady: true } },
          { at: 6, say: '오른쪽 입체는 밑면 7개와 꼭대기 1개를 더해 교점이 8개예요.', step: 2, set: { plSecondReady: true } }
        ] },
        { length: 10, title: '같은 수인 입체의 이름', cues: [
          { at: 0, say: '두 입체의 교점 수가 모두 8개예요. 모양이 달라도 개수는 같아요.' },
          { at: 5, say: '사각기둥과 교점 수가 같은 오른쪽 입체는 칠각뿔이에요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '교선 수가 같은 입체 찾기', label: '교선 비교', tab: 'review', answer: '육각뿔',
      summary: '각기둥과 각뿔의 모서리를 같은 기준으로 셉니다', task: '보이는 실선과 뒤쪽 점선 모서리를 함께 세어 보세요',
      chapters: [
        { length: 12, title: '교선은 모서리', start: compareStart('edges'), cues: [
          { at: 0, say: '왼쪽은 사각기둥이에요. 교선은 면과 면이 만나는 모서리예요.', set: reset('edges'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '오른쪽 입체와 교선 수를 비교해요. 점으로 표시한 꼭짓점 수와 구별해요.' }
        ] },
        { length: 12, title: '두 입체의 모서리 세기', cues: [
          { at: 0, say: '사각기둥은 위, 아래, 옆에 4개씩이라 교선은 4+4+4=12개예요.', step: 1, set: { plFirstReady: true } },
          { at: 6, say: '오른쪽 입체는 밑면과 옆에 6개씩이라 교선은 6+6=12개예요.', step: 2, set: { plSecondReady: true } }
        ] },
        { length: 10, title: '모서리 수가 같은 입체', cues: [
          { at: 0, say: '두 입체의 교선 수가 모두 12개예요. 밑면의 변 수는 달라도 돼요.' },
          { at: 5, say: '사각기둥과 교선 수가 같은 오른쪽 입체는 육각뿔이에요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '삼각뿔의 교점과 교선 합', label: '개수의 합', tab: 'review', answer: '10개',
      summary: '삼각뿔의 꼭짓점과 모서리 개수를 각각 구해 더합니다', task: '꼭대기 한 점과 그곳으로 이어진 세 모서리를 구별해 보세요',
      chapters: [
        { length: 12, title: '삼각뿔에서 구할 값', start: compareStart('sum'), cues: [
          { at: 0, say: '삼각뿔의 교점 수와 교선 수의 합을 구해요. 입체를 돌려 보세요.', set: reset('sum'), to: { plYaw: -5 }, dur: 5, ease: 'linear' },
          { at: 6, say: '교점은 꼭짓점, 교선은 모서리예요. 두 종류를 따로 세고 더해요.' }
        ] },
        { length: 12, title: '점과 선을 따로 세기', cues: [
          { at: 0, say: '밑면의 꼭짓점 3개에 꼭대기 1개를 더하면 교점은 4개예요.', step: 1, set: { plFirstReady: true } },
          { at: 6, say: '밑면의 모서리 3개와 옆 모서리 3개를 더하면 교선은 6개예요.', step: 2, set: { plSecondReady: true } }
        ] },
        { length: 10, title: '두 개수 더하기', cues: [
          { at: 0, say: '구하는 것은 합이므로 교점 수 4와 교선 수 6을 더해요.' },
          { at: 5, say: '교점과 교선의 개수의 합은 4+6=10개예요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];
})();
