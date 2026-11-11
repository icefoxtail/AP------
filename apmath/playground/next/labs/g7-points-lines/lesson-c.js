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

  const midStart = seed => ({ mL: 12, mC: 4, plSeed: seed });
  bank['m-mid'] = [
    { title: '두 중점 사이의 거리 구하기', label: 'MN 길이', tab: 'review', answer: 'MN = 6 cm',
      summary: '두 쌍의 같은 조각에서 한 조각씩 고릅니다', task: 'C를 옮겨도 전체 길이와 두 중점 사이의 거리가 유지되는지 보세요',
      chapters: [
        { length: 12, title: '움직이는 점과 두 중점', start: midStart(0), cues: [
          { at: 0, say: 'AB는 12cm예요. M은 AC의 중점, N은 CB의 중점이에요.', set: reset('mn'), to: { mC: 8 }, dur: 5, ease: 'linear' },
          { at: 6, say: '같은 길이인 AM과 MC를 ○, CN과 NB를 △로 표시해요.', step: 1 }
        ] },
        { length: 12, title: '전체와 중점 사이 비교', cues: [
          { at: 0, say: 'AB에는 ○가 둘, △가 둘 있어요. MN에는 ○와 △가 하나씩 있어요.' },
          { at: 6, say: 'MN은 AB의 절반이에요. C를 옮겨도 이 관계는 같아요.', step: 2 }
        ] },
        { length: 10, title: '주어진 전체 길이의 절반', cues: [
          { at: 0, say: '주어진 전체 길이 12cm를 같은 두 묶음으로 나눠요.' },
          { at: 5, say: 'MN = 6 cm예요. 12÷2로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '두 중점 거리로 전체 구하기', label: 'AB 길이', tab: 'review', answer: 'AB = 12 cm',
      summary: '전체에는 중점 사이의 두 조각이 각각 두 번 들어갑니다', task: 'AB가 MN의 두 배인 이유를 ○와 △로 설명해 보세요',
      chapters: [
        { length: 12, title: '주어진 거리는 MN', start: midStart(1), cues: [
          { at: 0, say: 'MN은 6cm예요. M은 AC의 중점, N은 CB의 중점이에요.', set: reset('ab'), to: { mC: 8 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'AM과 MC는 같은 ○, CN과 NB는 같은 △로 표시해요.', step: 1 }
        ] },
        { length: 12, title: '같은 묶음 두 번 찾기', cues: [
          { at: 0, say: 'MN은 ○+△예요. AB는 ○+○+△+△라서 같은 묶음이 두 개예요.' },
          { at: 6, say: 'AB=2×MN이므로 주어진 MN의 길이에 2를 곱해요.', step: 2 }
        ] },
        { length: 10, title: '거꾸로 전체 길이 구하기', cues: [
          { at: 0, say: 'MN인 6cm를 두 번 더하면 AB의 길이가 돼요.' },
          { at: 5, say: 'AB = 12 cm예요. 2×6으로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const doubleStart = seed => ({ dL: 12, plTrace: 0, plSeed: seed });
  bank['m-dbl'] = [
    { title: '중점을 두 번 잡아 AN 구하기', label: 'AN 길이', tab: 'review', answer: 'AN = 9 cm',
      summary: '전체를 네 칸으로 나누고 세 칸의 길이를 구합니다', task: 'M과 N이 각각 어느 선분의 중점인지 확인해 보세요',
      chapters: [
        { length: 12, title: '두 중점의 뜻', start: doubleStart(0), cues: [
          { at: 0, say: 'AB는 12cm이고 M은 AB의 중점, N은 MB의 중점이에요.', set: reset('an'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'MN과 NB를 한 칸씩으로 놓으면 AM과 MB는 두 칸씩이에요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: '절반을 두 번 구하기', cues: [
          { at: 0, say: 'M이 중점이므로 AM=MB=12÷2=6cm예요.', set: { plFirstReady: true } },
          { at: 6, say: 'N도 중점이므로 MN=6÷2=3cm예요.', step: 2, set: { plUnitReady: true } }
        ] },
        { length: 10, title: 'AM에 MN 더하기', cues: [
          { at: 0, say: 'AN은 AM에 MN을 더한 길이예요. 6cm와 3cm를 더해요.' },
          { at: 5, say: 'AN = 9 cm예요. 전체 네 칸 중 세 칸의 길이예요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: 'MN에서 두 번 늘려 AB 구하기', label: 'MN→AB', tab: 'review', answer: 'AB = 12 cm',
      summary: '두 중점 조건을 거꾸로 써서 전체 길이를 구합니다', task: '주어진 작은 조각이 전체 네 칸 중 한 칸인지 확인해 보세요',
      chapters: [
        { length: 12, title: '주어진 작은 조각', start: doubleStart(1), cues: [
          { at: 0, say: 'MN은 3cm예요. M은 AB의 중점이고 N은 MB의 중점이에요.', set: reset('mn-to-ab'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'MN과 NB는 한 칸씩, AM과 MB는 두 칸씩이에요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: 'MB와 AM을 복원하기', cues: [
          { at: 0, say: 'MB=2×3=6cm이고, M이 중점이므로 AM도 6cm예요.', set: { plFirstReady: true, plUnitReady: true } },
          { at: 6, say: '전체 AB는 길이가 같은 AM과 MB를 합친 네 칸이에요.', step: 2 }
        ] },
        { length: 10, title: '전체 길이 합하기', cues: [
          { at: 0, say: 'AB를 구하려면 AM의 6cm와 MB의 6cm를 더해요.' },
          { at: 5, say: 'AB = 12 cm예요. 6+6으로 확인해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '세 칸 AN으로 네 칸 AB 구하기', label: 'AN→AB', tab: 'review', answer: 'AB = 12 cm',
      summary: '주어진 세 칸으로 한 칸을 구한 뒤 네 칸을 셉니다', task: 'AN을 전체로 착각하지 않고 세 칸으로 표시해 보세요',
      chapters: [
        { length: 12, title: 'AN은 몇 칸인지 찾기', start: doubleStart(2), cues: [
          { at: 0, say: 'AN은 9cm예요. M은 AB의 중점이고 N은 MB의 중점이에요.', set: reset('an-to-ab'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'MN과 NB를 한 칸씩 놓으면 AN은 세 칸, AB는 네 칸이에요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: '한 칸의 길이 구하기', cues: [
          { at: 0, say: 'AN의 세 칸이 9cm이므로 한 칸인 MN은 9÷3=3cm예요.', step: 2, set: { plUnitReady: true } },
          { at: 6, say: '구하는 전체 AB에는 이 한 칸이 네 번 들어가요.' }
        ] },
        { length: 10, title: '한 칸에서 전체로', cues: [
          { at: 0, say: '한 칸의 길이 3cm에 전체 칸 수 4를 곱해요.' },
          { at: 5, say: 'AB = 12 cm예요. 3×4로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const tripleStart = seed => ({ tL: 18, plTrace: 0, plSeed: seed });
  bank['m-tri'] = [
    { title: '삼등분점 P와 중점 M의 거리', label: 'PM 길이', tab: 'review', answer: 'PM = 3 cm',
      summary: '같은 시작점 A에서 잰 두 길이를 빼서 사이 거리를 구합니다', task: 'P와 M의 위치를 같은 칸 번호로 비교해 보세요',
      chapters: [
        { length: 12, title: '삼등분점과 중점의 뜻', start: tripleStart(0), cues: [
          { at: 0, say: 'AB는 18cm예요. P, Q는 순서대로 삼등분점이고 M은 중점이에요.', set: reset('pm'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '2등분과 3등분을 함께 보려면 전체를 같은 크기의 여섯 칸으로 놓아요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: 'A에서 잰 두 길이', cues: [
          { at: 0, say: 'P는 삼등분점이므로 AP=18÷3=6cm예요.', set: { plFirstReady: true } },
          { at: 6, say: 'M은 중점이므로 AM=18÷2=9cm예요.', step: 2, set: { plSecondReady: true } }
        ] },
        { length: 10, title: '겹친 부분을 빼기', cues: [
          { at: 0, say: 'PM은 AM에서 AP를 뺀 길이예요. 같은 시작점 A를 기준으로 빼요.' },
          { at: 5, say: 'PM = 3 cm예요. 9−6으로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '삼등분점과 중점 사이로 전체 구하기', label: 'PM→AB', tab: 'review', answer: 'AB = 18 cm',
      summary: 'PM이 전체 여섯 칸 중 한 칸임을 이용합니다', task: 'A, P, M, Q, B의 칸 번호를 차례대로 읽어 보세요',
      chapters: [
        { length: 12, title: '주어진 거리는 PM', start: tripleStart(1), cues: [
          { at: 0, say: 'PM은 3cm이고 P, Q는 삼등분점, M은 중점이에요.', set: reset('pm-to-ab'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '전체 여섯 칸에서 P는 2, M은 3, Q는 4칸째에 놓여요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: 'PM이 차지하는 칸 수', cues: [
          { at: 0, say: 'PM은 3칸째와 2칸째의 차이인 한 칸이에요. 주어진 길이는 3cm예요.' },
          { at: 6, say: '전체 AB에는 이 같은 칸이 여섯 개 있어요.', step: 2 }
        ] },
        { length: 10, title: '한 칸의 여섯 배', cues: [
          { at: 0, say: '구하는 전체 길이는 한 칸의 길이 3cm의 여섯 배예요.' },
          { at: 5, say: 'AB = 18 cm예요. 3×6으로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '중점 M과 삼등분점 Q의 거리', label: 'MQ 길이', tab: 'review', answer: 'MQ = 3 cm',
      summary: 'A에서 Q까지의 길이와 A에서 M까지의 길이를 비교합니다', task: 'AQ에서 AM을 빼야 하는 이유를 그림에서 찾아보세요',
      chapters: [
        { length: 12, title: '구하는 구간 MQ', start: tripleStart(2), cues: [
          { at: 0, say: 'AB는 18cm예요. P, Q는 삼등분점, M은 중점이고 MQ를 구해요.', set: reset('mq'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '전체를 여섯 칸으로 놓으면 M은 3칸째, Q는 4칸째예요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: 'AQ와 AM 계산하기', cues: [
          { at: 0, say: 'AQ는 전체의 3분의 2이므로 18÷3×2=12cm예요.', set: { plFirstReady: true } },
          { at: 6, say: 'AM은 전체의 절반이므로 18÷2=9cm예요.', step: 2, set: { plSecondReady: true } }
        ] },
        { length: 10, title: '두 길이의 차이', cues: [
          { at: 0, say: 'MQ는 AQ에서 AM을 뺀 길이예요. 12cm에서 9cm를 빼요.' },
          { at: 5, say: 'MQ = 3 cm예요. 12−9로 확인해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const ratioStart = seed => ({ rK: 4, rU: 3, plTrace: 0, plSeed: seed });
  bank['m-ratio'] = [
    { title: '길이의 비와 중점으로 MB 구하기', label: 'MB 길이', tab: 'review', answer: 'MB = 9 cm',
      summary: '짧은 CB를 한 칸으로 정하고 중점을 표시합니다', task: 'MB에는 MC뿐 아니라 CB도 포함되는지 확인해 보세요',
      chapters: [
        { length: 12, title: '비를 칸으로 나타내기', start: ratioStart(0), cues: [
          { at: 0, say: 'AB는 15cm, AC=4CB이고 M은 AC의 중점이에요.', set: reset('mb'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'CB를 한 칸으로 놓으면 AC는 네 칸, AB는 다섯 칸이에요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: '한 칸과 네 칸의 길이', cues: [
          { at: 0, say: 'AB의 다섯 칸이 15cm이므로 CB=15÷5=3cm예요.', set: { plUnitReady: true } },
          { at: 6, say: 'AC는 네 칸이므로 4×3=12cm예요.', set: { plFirstReady: true } }
        ] },
        { length: 11, title: '중점에서 남은 구간 찾기', cues: [
          { at: 0, say: 'M은 AC의 중점이므로 MC=12÷2=6cm예요.', step: 2, set: { plSecondReady: true } },
          { at: 6, say: 'MB는 MC에 CB를 더한 길이예요. C에서 끝내지 말고 B까지 봐요.' }
        ] },
        { length: 10, title: '두 구간 더하기', cues: [
          { at: 0, say: 'MC의 6cm에 CB의 3cm를 더해요.' },
          { at: 5, say: 'MB = 9 cm예요. 6+3으로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] },
    { title: '중점 거리와 비로 전체 구하기', label: 'MC→AB', tab: 'review', answer: 'AB = 15 cm',
      summary: '중점 조건으로 AC를 구하고 비로 CB를 구합니다', task: '주어진 MC에서 AC, CB, AB 순서로 길이를 복원해 보세요',
      chapters: [
        { length: 12, title: '주어진 중점 거리와 비', start: ratioStart(1), cues: [
          { at: 0, say: 'MC는 6cm이고 M은 AC의 중점이에요. AC=4CB예요.', set: reset('mc-to-ab'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'CB를 한 칸으로 놓으면 AC는 네 칸, AB는 다섯 칸이에요.', step: 1, set: { plGroupsReady: true } }
        ] },
        { length: 12, title: '중점 조건 다음에 비 쓰기', cues: [
          { at: 0, say: 'AC는 MC의 두 배이므로 2×6=12cm예요.', set: { plFirstReady: true } },
          { at: 6, say: 'AC=4CB이므로 CB=12÷4=3cm예요.', step: 2, set: { plUnitReady: true } }
        ] },
        { length: 10, title: '전체 길이 합하기', cues: [
          { at: 0, say: 'AB는 AC와 CB를 합친 길이예요. 12cm에 3cm를 더해요.' },
          { at: 5, say: 'AB = 15 cm예요. 12+3으로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];

  const equationStart = seed => ({ eA: 4, eB: 1, eC: 2, eD: 9, ex0: 4, eX: 1, plTrace: 0, plSeed: seed });
  bank['m-eq'] = [
    { title: '중점 조건으로 x 구하기', label: 'x 값', tab: 'review', answer: 'x = 4',
      summary: '중점이면 두 조각이 같다는 식을 먼저 세웁니다', task: '구한 x를 두 길이의 식에 넣어 같은 길이가 되는지 확인해 보세요',
      chapters: [
        { length: 12, title: 'x와 두 길이의 식', start: equationStart(0), cues: [
          { at: 0, say: 'AM은 4x+1cm, MB는 2x+9cm이고 모르는 수 x를 구해요.', set: reset('x'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'M이 AB의 중점이므로 AM과 MB의 길이가 같아요.' }
        ] },
        { length: 12, title: '같은 길이를 식으로 쓰기', cues: [
          { at: 0, say: 'AM=MB에 두 식을 넣으면 4x+1=2x+9예요.', step: 1, set: { plEquationReady: true } },
          { at: 6, say: '양쪽에서 2x와 1을 빼면 2x=8이에요.', step: 2, set: { plFirstReady: true } }
        ] },
        { length: 10, title: 'x 하나의 값 구하기', cues: [
          { at: 0, say: '2x=8의 양쪽을 2로 나누면 x만 남아요.' },
          { at: 5, say: 'x = 4예요. 8÷2로 구해요.', step: 3, set: { plXReady: true, plShowAnswer: true } }
        ] }
      ] },
    { title: '방정식 뒤에 전체 길이 구하기', label: 'AB 길이', tab: 'review', answer: 'AB = 34 cm',
      summary: 'x를 구한 다음 두 길이의 식에 대입해 합합니다', task: '문제가 x가 아니라 AB를 묻는지 마지막에 다시 확인해 보세요',
      chapters: [
        { length: 12, title: '중점 조건과 풀이 순서', start: equationStart(1), cues: [
          { at: 0, say: 'AM은 4x+1cm, MB는 2x+9cm이고 M은 AB의 중점이에요.', set: reset('length'), to: { plTrace: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '먼저 AM=MB로 x를 구하고, 두 길이의 식에 넣어 AB를 구해요.' }
        ] },
        { length: 15, title: '중점으로 방정식 풀기', cues: [
          { at: 0, say: 'AM=MB이므로 4x+1=2x+9예요.', step: 1, set: { plEquationReady: true } },
          { at: 5, say: '양쪽에서 2x와 1을 빼면 2x=8이에요.', step: 2, set: { plFirstReady: true } },
          { at: 10, say: '양쪽을 2로 나누면 x=4예요.', set: { plXReady: true } }
        ] },
        { length: 11, title: '두 길이의 식에 대입하기', cues: [
          { at: 0, say: 'AM=4×4+1=17cm예요.', set: { plLengthReady: true } },
          { at: 6, say: 'MB=2×4+9=17cm예요. 두 길이가 같아 중점 조건도 맞아요.', set: { plSecondReady: true } }
        ] },
        { length: 10, title: '구할 값은 전체 AB', cues: [
          { at: 0, say: 'AB는 두 조각 AM과 MB를 합친 길이예요. 17cm를 두 번 더해요.' },
          { at: 5, say: 'AB = 34 cm예요. 17+17로 구해요.', step: 3, set: { plShowAnswer: true } }
        ] }
      ] }
  ];
})();
