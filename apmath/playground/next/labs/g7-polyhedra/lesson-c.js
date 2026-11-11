/* 전개도·겹치는 점·꼬인 위치: t3의 실제 고정 전개도와 접힘 관계를 읽습니다. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-polyhedra'] = window.APL_LESSONS['g7-polyhedra'] || {};
  const start = () => ({ phFold: 0, phYaw: 0, phPitch: 84 });
  const reset = (extra) => ({ phShowAnswer: false, phNet: 0, phNm: 0, phSel: 0, phSelPt: null, phSelFace: null, phSelEdge: null, phSpin: false, ...extra });

  bank['p3-1'] = [
    { title: '전개도를 모양별로 세기', label: '종류 수', tab: 'review', answer: '11가지', answerText: '정육면체의 전개도는 11가지',
      summary: '접어서 면이 겹치지 않는 모양만 셉니다', task: '직접 해 보기에서 모든 전개도를 접고 모양별로 분류해 보세요',
      chapters: [
        { length: 10, title: '여섯 면을 접기', start: start(), cues: [
          { at: 0, say: '정사각형 여섯 개를 접어 정육면체를 만들어요.', set: reset({ phLessonGoal: 'count', phGroupReady: false }), to: { phFold: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '회전하거나 뒤집어 같은 모양이면 한 번만 세요.' }
        ] },
        { length: 12, title: '가운데가 네 칸인 모양', cues: [
          { at: 0, say: '가운데 네 칸, 위아래 한 칸씩인 모양이에요.', to: { phFold: 0 }, dur: 3, ease: 'smooth' },
          { at: 3.5, set: { phNet: 1 } },
          { at: 4, say: '붙이는 자리를 달리한 1-4-1형은 6가지예요.', set: { phGroupReady: true }, to: { phFold: 1 }, dur: 5, ease: 'smooth' }
        ] },
        { length: 12, title: '가운데가 세 칸인 모양', cues: [
          { at: 0, say: '이번에는 두 칸, 세 칸, 한 칸으로 나누어요.', to: { phFold: 0 }, dur: 3, ease: 'smooth' },
          { at: 3.5, set: { phNet: 6 } },
          { at: 4, say: '2-3-1형은 겹치지 않고 접히는 모양이 3가지.', to: { phFold: 1 }, dur: 5, ease: 'smooth' }
        ] },
        { length: 12, title: '남은 두 모양', cues: [
          { at: 0, say: '2-2-2형은 1가지예요.', set: { phNet: 9 }, to: { phFold: 0 }, dur: 3, ease: 'smooth' },
          { at: 3.5, to: { phFold: 1 }, dur: 2, ease: 'smooth' },
          { at: 6, say: '3-3형도 1가지예요.', set: { phNet: 10 }, to: { phFold: 0 }, dur: 2, ease: 'smooth' },
          { at: 8.5, to: { phFold: 1 }, dur: 2.5, ease: 'smooth' }
        ] },
        { length: 10, title: '종류를 모두 더하면', cues: [
          { at: 0, say: '모양별로 센 개수를 중복 없이 더해요.' },
          { at: 4.5, say: '$6+3+1+1=11$가지예요.', set: { phShowAnswer: true } }
        ] }
      ] },
    { title: '접을 수 없는 모양 찾기', label: '겹침 판단', tab: 'review', answer: '정육면체가 되지 않아요',
      summary: '정사각형이 여섯 개여도 면이 겹치면 안 됩니다', task: '다른 안 되는 모양도 접어 겹치는 면을 찾아보세요',
      chapters: [
        { length: 10, title: '같은 쪽에 붙은 두 면', start: start(), cues: [
          { at: 0, say: '한 줄 네 칸의 양끝에 두 면이 같은 쪽으로 붙었어요.', set: reset({ phNet: 11, phLessonGoal: 'valid', phGroupReady: false }), to: { phFold: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '여섯 면이 서로 다른 자리를 차지하는지 보세요.' }
        ] },
        { length: 10, title: '마지막 두 면의 자리', cues: [
          { at: 0, say: '한 줄의 네 면은 입체의 옆쪽을 둘러싸요.', to: { phFold: 0.8 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '나머지 두 면이 위와 아래를 각각 막아야 해요.' }
        ] },
        { length: 10, title: '겹침을 확인하면', cues: [
          { at: 0, say: '끝까지 접어 두 면이 놓이는 자리를 확인해요.', to: { phFold: 1 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '두 면이 겹쳐서 정육면체가 되지 않아요.', step: 3, set: { phShowAnswer: true } }
        ] }
      ] }
  ];

  const pointLesson = (o) => ({
    title: o.title, label: o.label, tab: 'review', answer: o.answer, answerText: o.answerText || o.answer,
    summary: '접어서 같은 위치에 도착하는 점끼리 한 꼭짓점', task: '점 이름이나 전개도를 바꾸고 다른 점의 겹침도 확인해 보세요',
    chapters: [
      { length: 10, title: '기준점과 전개도', start: start(), cues: [
        { at: 0, say: o.given, set: reset({ phNet: o.net || 0, phSelPt: o.point }), to: { phFold: 0.45 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: o.question }
      ] },
      { length: 10, title: '붙는 모서리를 따라', cues: [
        { at: 0, say: '접으면 붙는 두 모서리의 양 끝점도 서로 만나요.', to: { phFold: 0.8 }, dur: 4, ease: 'smooth' },
        { at: 5, say: '가까워 보이는지만 보지 말고 접힌 위치를 비교해요.' }
      ] },
      { length: 10, title: '한 꼭짓점으로 모이면', cues: [
        { at: 0, say: '끝까지 접어서 같은 위치에 모인 점을 읽어요.', to: { phFold: 1 }, dur: 4, ease: 'smooth' },
        { at: 5, say: o.final, step: 3, set: { phShowAnswer: true } }
      ] }
    ]
  });
  bank['p3-2'] = pointLesson({ title: '정육면체에서 겹치는 점', label: '겹치는 점', point: 0, answer: '점 D, L',
    given: '정사각형 여섯 개의 전개도에서 노란 점 B를 보세요.', question: '점 B와 겹치는 점을 빠짐없이 찾아요.', final: '점 B와 겹치는 점은 점 D, L이에요.' });
  bank['p3-5'] = pointLesson({ title: '정사면체에서 겹치는 점', label: '겹치는 점', point: 0, answer: '점 E',
    given: '정삼각형 네 개로 만든 전개도의 점 A를 보세요.', question: '접어 정사면체를 만들 때 점 A와 만나는 점은?', final: '점 A와 겹치는 점은 점 E예요.' });
  bank['p3-6'] = [
    pointLesson({ title: '정팔면체에서 겹치는 점', label: '정팔면체', point: 0, answer: '점 I',
      given: '정삼각형 여덟 개의 전개도에서 점 A를 보세요.', question: '접어 정팔면체를 만들 때 점 A와 만나는 점은?', final: '점 A와 겹치는 점은 점 I예요.' }),
    pointLesson({ title: '정십이면체의 점 모으기', label: '정십이면체', net: 3, point: 0, answer: '세 점이 한 꼭짓점',
      given: '정오각형 열두 개로 만든 전개도예요.', question: '노란 기준점과 같은 위치에 모일 점을 찾아요.', final: '고른 모둠은 세 점이 한 꼭짓점으로 모여요.' }),
    pointLesson({ title: '정이십면체에서 겹치는 점', label: '정이십면체', net: 4, point: 0, answer: '점 G',
      given: '정삼각형 스무 개의 전개도에서 점 A를 보세요.', question: '접어 정이십면체를 만들 때 점 A와 만나는 점은?', final: '점 A와 겹치는 점은 점 G예요.' })
  ];

  const faceLesson = (parallel) => ({
    title: parallel ? '접어서 평행한 면 찾기' : '접어서 수직인 면 찾기', label: parallel ? '평행한 면' : '수직인 면', tab: 'review',
    answer: parallel ? '면 D' : '면 A, C, E, F', summary: '마주 보는 면은 평행, 이웃한 네 면은 수직', task: '기준 면을 바꾸어 평행한 면과 수직인 면을 다시 찾아보세요',
    chapters: [
      { length: 10, title: '기준 면을 접기', start: start(), cues: [
        { at: 0, say: '노란 면 B를 기준으로 전개도를 접어요.', set: reset({ phSelFace: 0 }), to: { phFold: 0.65 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: parallel ? '면 B와 마주 보는 면을 찾아야 해요.' : '면 B와 직각으로 만나는 면을 찾아야 해요.' }
      ] },
      { length: 10, title: '입체에서 관계 읽기', cues: [
        { at: 0, say: '전개도에서의 방향 대신 접은 입체를 보세요.', to: { phFold: 1 }, dur: 4, ease: 'smooth' },
        { at: 5, say: parallel ? '마주 보는 면은 만나지 않고 나란해요.' : '모서리를 공유하는 이웃한 면은 수직이에요.' }
      ] },
      { length: 10, title: '어느 면일까', cues: [
        { at: 0, say: parallel ? '마주 보는 한 면을 골라 이름을 읽어요.' : '기준 면과 마주 보는 면을 빼고 나머지를 읽어요.' },
        { at: 5, say: parallel ? '면 B와 평행한 면은 면 D예요.' : '수직인 면은 면 A, C, E, F예요.', step: parallel ? 2 : 3, set: { phShowAnswer: true } }
      ] }
    ]
  });
  bank['p3-3'] = [faceLesson(true), faceLesson(false)];

  const skewLesson = (solid, name, total, meet, parallel, answer) => ({
    title: name + '의 꼬인 모서리', label: name, tab: 'review', answer: `꼬인 위치 ${answer}개`,
    summary: '전체에서 기준·만나는 것·평행한 것을 뺍니다', task: '기준 모서리나 전개도를 바꾸어 같은 분류로 확인해 보세요',
    chapters: [
      { length: 11, title: '기준 모서리 정하기', start: { phFold: 0, phYaw: -4, phPitch: 66 }, cues: [
        { at: 0, say: `${name}의 노란 모서리 AB를 기준으로 해요.`, set: reset({ phSolid: solid }), to: { phFold: 1 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: '만나지 않고 평행하지도 않은 모서리를 찾아요.' }
      ] },
      { length: 12, title: '해당하지 않는 것 빼기', cues: [
        { at: 0, say: `양 끝에서 만나는 모서리 ${meet}개를 먼저 빼요.`, step: 1 },
        { at: 6, say: parallel ? `평행한 모서리 ${parallel}개도 꼬인 위치가 아니에요.` : '평행한 모서리는 없으므로 더 뺄 것은 없어요.', step: 2 }
      ] },
      { length: 10, title: '남은 모서리 세기', cues: [
        { at: 0, say: `전체 ${total}개에서 기준 모서리 자신도 빼야 해요.` },
        { at: 5, say: `$${total}-1-${meet}-${parallel}=${answer}$, 꼬인 위치 ${answer}개예요.`, step: 3, set: { phShowAnswer: true } }
      ] }
    ]
  });
  bank['p3-4'] = [skewLesson(0, '정육면체', 12, 4, 3, 4), skewLesson(1, '정사면체', 6, 4, 0, 1), skewLesson(2, '정팔면체', 12, 6, 1, 4)];

  const pathLesson = (distance) => ({
    title: distance ? '최단 경로의 거리 구하기' : '최단 경로가 지나는 점', label: distance ? 'EP 길이' : '지나는 점', tab: 'review',
    answer: distance ? '$4$' : 'EF의 중점', answerText: distance ? '$4$ (한 모서리가 8일 때)' : 'P는 EF의 중점',
    summary: '두 면을 펼치면 가장 짧은 경로는 직선', task: '한 모서리의 길이와 점 P를 바꾸어 가장 짧을 때를 찾아보세요',
    chapters: [
      { length: 11, title: '경로가 지나는 두 면', start: { phEdge: 8, phAnt: 0.3, phFold: 1, phYaw: -28, phPitch: 24 }, cues: [
        { at: 0, say: '한 모서리의 길이는 8, A에서 G까지 가는 길이에요.', set: reset({ phLessonGoal: distance ? 'distance' : 'location' }), to: { phFold: 0 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: 'P는 경로가 두 면의 경계 EF를 지나는 점이에요.' }
      ] },
      { length: 10, title: '평면에서 가장 짧은 길', cues: [
        { at: 0, say: '두 면을 펼치면 같은 정사각형 두 개가 이어져요.', step: 1 },
        { at: 5, say: '평면에서 두 점을 잇는 직선이 가장 짧아요.', step: 2 }
      ] },
      { length: 11, title: '직선과 경계의 만남', cues: [
        { at: 0, say: distance ? 'EF는 직사각형의 한가운데라 P가 길이를 이등분해요.' : '직선이 경계 EF와 만나는 곳으로 P를 옮겨요.', to: { phAnt: 0.5 }, dur: 4, ease: 'smooth' },
        { at: 5, say: distance ? '$\\overline{EP}=8\\div2=4$예요.' : '최단 경로가 지나는 P는 EF의 중점이에요.', step: 3, set: { phShowAnswer: true } }
      ] }
    ]
  });
  bank['p3-7'] = [pathLesson(false), pathLesson(true)];
  bank['p3-8'] = {
    title: '주사위의 맞은편 눈', label: '맞은편 눈', tab: 'review', answer: '$5$', answerText: '맞은편 눈은 $5$',
    summary: '마주 보는 면을 찾고 두 눈의 합 7을 씁니다', task: '다른 눈을 기준으로 고르고 마주 보는 두 눈의 합을 확인해 보세요',
    chapters: [
      { length: 10, title: '눈이 주어진 면 접기', start: start(), cues: [
        { at: 0, say: '눈이 2인 면과 마주 보는 면의 눈을 찾아요.', set: reset({ phSelFace: 1 }), to: { phFold: 0.65 }, dur: 5, ease: 'smooth' },
        { at: 5.5, say: '물음표 면은 접은 뒤에 서로 마주 보는 면이에요.' }
      ] },
      { length: 10, title: '마주 보는 두 면의 규칙', cues: [
        { at: 0, say: '옆에 붙은 면과 마주 보는 면을 구별해요.', to: { phFold: 1 }, dur: 4, ease: 'smooth' },
        { at: 5, say: '마주 보는 두 면의 눈의 합은 7이에요.', step: 2 }
      ] },
      { length: 10, title: '물음표에 들어갈 눈', cues: [
        { at: 0, say: '합 7에서 주어진 눈 2를 빼요.' },
        { at: 5, say: '맞은편 눈은 $7-2=5$예요.', set: { phShowAnswer: true } }
      ] }
    ]
  };
})();
