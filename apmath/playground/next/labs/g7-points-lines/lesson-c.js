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
})();
