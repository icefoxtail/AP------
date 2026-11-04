/* sv1-1의 탐구 질문과 정리: 옆면의 가로는 밑면 둘레, 겉넓이는 밑면 두 개와 옆면의 합.
   반지름 3 cm, 높이 5 cm: 둘레 6π cm, 밑넓이 9π cm², 옆넓이 30π cm². */
window.APL_VIDEOS = window.APL_VIDEOS || {};
window.APL_VIDEOS['g7-surface-volume'] = {
  'sv1-1': {
    length: 12,
    title: '원기둥을 펼치면?',
    start: { sR: 3, sH: 5, sT: 0, svYaw: 28, svPitch: 22 },
    summary: '겉넓이 = 밑넓이 × 2 + 밑면 둘레 × 높이',
    task: '펼치기 막대를 움직여 원기둥과 전개도를 비교해 보세요.',
    cues: [
      { at: 0, say: '원기둥의 옆면을 펼쳐요.', set: { svShape: 'circ' }, to: { sT: 1 }, dur: 5, ease: 'smooth' },
      { at: 5, say: '가로는 밑면 둘레 $6\\pi$, 세로는 높이 $5$예요.' },
      { at: 8.5, say: '겉넓이 = 밑넓이 2개 + 옆넓이' }
    ]
  }
};
