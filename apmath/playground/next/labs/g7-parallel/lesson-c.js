/* 원본 pat 접기와 실제 반사 도형을 사용하는 종이 접기 해설. */
(function () {
  'use strict';
  window.APL_LESSONS = window.APL_LESSONS || {};
  const bank = window.APL_LESSONS['g7-parallel'] = window.APL_LESSONS['g7-parallel'] || {};
  const reset = goal => ({ paShowAnswer: false, paLessonGoal: goal, paFoldReady: false, paOtherReady: false, paSidesReady: false, paEquationReady: false, paSumReady: false, paOtherSumReady: false });
  const tapeStart = () => ({ fA: 55, fX: -1.2, pat: 0 });

  bank['p4-1'] = [
    { title: '종이를 접으면 생기는 같은 각', label: '접은 각', tab: 'review', answer: '접은 각 = 원래 각',
      summary: '접는 선을 기준으로 포개지는 두 각을 찾습니다', task: '접었다 펼치며 원래 각과 접은 각을 짝지어 보세요',
      chapters: [
        { length: 11, title: '접는 선과 원래 각', start: tapeStart(), cues: [
          { at: 0, say: 'a는 아래쪽 변과 접는 선 BC 사이의 각이고 55°예요.', set: reset('fold'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '분홍선 BC를 축으로 오른쪽 종이가 뒤집혀 포개져요.' }
        ] },
        { length: 11, title: '접기 전후를 짝짓기', cues: [
          { at: 0, say: '접기 전의 아래쪽 변은 접은 뒤 BA 방향에 놓여요.' },
          { at: 6, say: '접는 선 양쪽에 있는 두 노란 각을 비교해 보세요.' }
        ] },
        { length: 10, title: '포개지는 각의 크기', cues: [
          { at: 0, say: '종이를 포갤 때 접는 선 양쪽의 두 각도 포개져요.' },
          { at: 5, say: '접은 각 = 원래 각이므로 ∠ABC도 55°예요.', step: 1, set: { paFoldReady: true, paShowAnswer: true } }
        ] }
      ] },
    { title: '겹친 삼각형의 종류', label: '삼각형', tab: 'review', answer: '이등변삼각형', answerText: 'AB = AC인 이등변삼각형',
      summary: '접은 각과 엇각으로 같은 두 밑각을 찾습니다', task: '접는 선 BC와 길이가 같은 두 변 AB, AC를 구별해 보세요',
      chapters: [
        { length: 11, title: '접은 각부터 표시하기', start: tapeStart(), cues: [
          { at: 0, say: '원래 각 a는 55°이고 종이를 접는 선 BC를 따라 접어요.', set: reset('triangle'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '접기 전후의 각은 같아서 ∠ABC도 55°예요.', step: 1, set: { paFoldReady: true } }
        ] },
        { length: 12, title: '평행선의 엇각 찾기', cues: [
          { at: 0, say: '윗변 l과 아랫변 m이 평행하므로 엇각 ∠ACB도 55°예요.', step: 2, set: { paOtherReady: true } },
          { at: 6, say: '삼각형 ABC의 B와 C에 있는 두 밑각이 같아요.' }
        ] },
        { length: 10, title: '같은 각의 맞은편 변', cues: [
          { at: 0, say: '삼각형에서 두 각이 같으면 그 맞은편 두 변도 같아요.' },
          { at: 5, say: 'AB = AC인 이등변삼각형이에요.', step: 3, set: { paSidesReady: true, paShowAnswer: true } }
        ] }
      ] },
    { title: '접힌 삼각형의 꼭지각', label: '각도', tab: 'review', answer: '70°',
      summary: '삼각형의 내각합 180°에서 같은 밑각 둘을 뺍니다', task: '접은 각 a를 바꾸고 꼭지각 x가 어떻게 달라지는지 보세요',
      chapters: [
        { length: 11, title: '원래 각과 접은 각', start: tapeStart(), cues: [
          { at: 0, say: '원래 각 a는 55°이고 BC를 접는 선으로 종이를 접어요.', set: reset('angle'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '접기 전후의 각은 같아서 ∠ABC도 55°예요.', step: 1, set: { paFoldReady: true } }
        ] },
        { length: 12, title: '다른 밑각과 내각합', cues: [
          { at: 0, say: 'l과 m이 평행하므로 엇각 ∠ACB도 55°예요.', step: 2, set: { paOtherReady: true } },
          { at: 6, say: 'x는 A의 각이에요. 삼각형 ABC의 세 각의 합은 180°예요.', step: 3, set: { paSidesReady: true } }
        ] },
        { length: 10, title: '같은 밑각 두 번 빼기', cues: [
          { at: 0, say: '두 밑각의 합은 $55°+55°=110°$예요.', set: { paSumReady: true } },
          { at: 5, say: '$x=180°-110°=70°$예요.', step: 3, set: { paShowAnswer: true } }
        ] }
      ] }
  ];
  const cornerStart = () => ({ kW: 3.6, kA: 22, pat: 0 });
  bank['p4-2'] = [
    { title: '접은 귀퉁이의 각 관계', label: '각의 관계', tab: 'review', answer: '90° = a + a + x',
      summary: '직각 안에는 원래 각과 접은 각이 각각 있습니다', task: '두 노란 각과 남은 각 x를 직각 안에서 차례대로 짚어 보세요',
      chapters: [
        { length: 11, title: '접는 선과 점의 이름', start: cornerStart(), cues: [
          { at: 0, say: 'a는 아래쪽 변 AB와 접는 선 AE 사이의 각이고 22°예요.', set: reset('partition'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'B′는 점 B가 접힌 뒤 놓이는 자리예요.' }
        ] },
        { length: 11, title: '직각 안의 각 나누기', cues: [
          { at: 0, say: '접는 선 양쪽의 각이 같으므로 접힌 각도 22°예요.', step: 1, set: { paFoldReady: true } },
          { at: 6, say: '직각 BAD 안에 원래 각, 접힌 각, 남은 각 x가 있어요.' }
        ] },
        { length: 10, title: '세 각을 더한 식', cues: [
          { at: 0, say: '두 노란 각을 각각 a, 남은 초록 각을 x로 놓아요.', step: 2 },
          { at: 5, say: '따라서 $90° = a + a + x$예요.', set: { paEquationReady: true, paShowAnswer: true } }
        ] }
      ] },
    { title: '한 번 접고 남은 각 구하기', label: '각도', tab: 'review', answer: '46°',
      summary: '직각 90°에서 같은 접은 각 두 개를 뺍니다', task: '각 a를 바꾸고 90°에서 a를 두 번 빼 보세요',
      chapters: [
        { length: 11, title: '같은 접은 각 두 개', start: cornerStart(), cues: [
          { at: 0, say: 'a는 AB와 접는 선 AE 사이의 각이고 22°예요.', set: reset('angle'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '접힌 각 ∠B′AE도 원래 각과 같은 22°예요.', step: 1, set: { paFoldReady: true } }
        ] },
        { length: 12, title: '직각에서 빼는 크기', cues: [
          { at: 0, say: 'x는 접힌 변 AB′와 왼쪽 변 AD 사이의 각이에요.', step: 2, set: { paEquationReady: true } },
          { at: 6, say: '직각 안의 두 노란 각의 합은 $22°+22°=44°$예요.', set: { paSumReady: true } }
        ] },
        { length: 10, title: '직각의 나머지 구하기', cues: [
          { at: 0, say: '90°에서 방금 구한 두 각의 합을 빼요.' },
          { at: 5, say: '$x=90°-44°=46°$예요.', step: 3, set: { paShowAnswer: true } }
        ] }
      ] }
  ];

  const twiceStart = () => ({ kW: 3.6, k2A: 14, k2B: 12, pat: 0 });
  bank['p4-3'] = [
    { title: '두 번 접은 각의 관계', label: '각의 관계', tab: 'review', answer: '90° = a + a + x + b + b',
      summary: '두 접는 선에서 a와 b가 각각 한 번 더 생깁니다', task: '호 한 개는 a, 호 두 개는 b로 구별해 직각을 나눠 보세요',
      chapters: [
        { length: 12, title: '두 접는 선과 두 각', start: twiceStart(), cues: [
          { at: 0, say: '아래쪽 a는 14°, 왼쪽 b는 12°이고 분홍선을 따라 접어요.', set: reset('partition'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: 'B′와 D′는 점 B와 D가 접힌 뒤 놓이는 자리예요.' }
        ] },
        { length: 12, title: '같은 표시의 각끼리 짝짓기', cues: [
          { at: 0, say: '접는 선 AE 양쪽의 노란 각 a는 각각 14°예요.', step: 1, set: { paFoldReady: true } },
          { at: 6, say: '접는 선 AF 양쪽의 보라색 각 b는 각각 12°예요.', set: { paOtherReady: true } }
        ] },
        { length: 10, title: '직각 안의 다섯 부분', cues: [
          { at: 0, say: '직각 안에는 a 두 개, 남은 x, b 두 개가 있어요.', step: 2 },
          { at: 5, say: '따라서 $90° = a + a + x + b + b$예요.', set: { paEquationReady: true, paShowAnswer: true } }
        ] }
      ] },
    { title: '두 번 접고 남은 각 구하기', label: '각도', tab: 'review', answer: '38°',
      summary: '직각에서 a 두 개와 b 두 개를 모두 뺍니다', task: '접은 두 쪽의 각을 각각 두 번씩 뺐는지 확인해 보세요',
      chapters: [
        { length: 11, title: '주어진 두 접은 각', start: twiceStart(), cues: [
          { at: 0, say: '아래쪽 a는 14°, 왼쪽 b는 12°예요. 두 선을 따라 접어요.', set: reset('angle'), to: { pat: 1 }, dur: 5, ease: 'linear' },
          { at: 6, say: '접기 전후의 각은 같아서 a와 b가 각각 두 번 들어가요.', step: 1, set: { paFoldReady: true, paOtherReady: true } }
        ] },
        { length: 12, title: '직각과 노란 각 두 개', cues: [
          { at: 0, say: 'x는 두 접힌 변 AB′와 AD′ 사이에 남은 각이에요.', step: 2, set: { paEquationReady: true } },
          { at: 6, say: '노란 각 두 개의 합은 $14°+14°=28°$예요.', set: { paSumReady: true } }
        ] },
        { length: 11, title: '보라색 각 두 개 더 세기', cues: [
          { at: 0, say: '보라색 각 두 개의 합은 $12°+12°=24°$예요.', set: { paOtherSumReady: true } },
          { at: 5.5, say: '직각 90°에서 노란 부분과 보라색 부분을 모두 빼요.' }
        ] },
        { length: 10, title: '남은 초록 각 계산하기', cues: [
          { at: 0, say: 'a와 b를 각각 두 번 뺐는지 확인해요.' },
          { at: 5, say: '$x=90°-28°-24°=38°$예요.', step: 3, set: { paShowAnswer: true } }
        ] }
      ] }
  ];
})();
