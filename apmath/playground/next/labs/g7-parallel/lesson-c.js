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
})();
