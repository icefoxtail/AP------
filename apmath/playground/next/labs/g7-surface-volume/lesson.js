/* ==========================================================================
   겉넓이 · 부피 · 해설(lesson) (lesson.js)
   window.APL_LESSONS['g7-surface-volume'] = { '<장면 id>': 해설, ... }
   형식: kit/apl-video-core.js 맨 위 주석, docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 「해설(lesson)」.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};

window.APL_LESSONS['g7-surface-volume'] = {
  /* ---------- 원기둥의 겉넓이 (t1.js sv1-1) · 3장 29초 · tab:'review' ----------
     r=3, h=5. 탐구 탭의 전개도에는 길이 표시가 없고, 정리 탭 그림에는 밑넓이 9π · 반지름 3 · 높이 5 · 밑면의 둘레 6π 가 있어 자막의 숫자가 그림에 보입니다 → tab:'review'.
     밑넓이 π·3² = 9π, 밑면 2개 9π×2 = 18π, 밑면의 둘레 2π·3 = 6π, 옆넓이 6π×5 = 30π, 겉넓이 18π+30π = 48π (= 2π·3·(3+5) ✓).
     sT(펼침 0~1): 0 → 1(펼침) → 0.6 → 1(옆면 띠가 밑면 둘레만큼 감겼다 펴짐). step: 1(밑면) → 2(옆면) → 3(전부).
     (이전 영상 대본은 sv11Started 를 켜지 않아 전개도가 펼쳐지지 않았으므로 이 해설로 대신했습니다.) */
  'sv1-1': {
    title: '원기둥의 겉넓이',
    label: '겉넓이', // 해설이 하나뿐이면 진입 화면에는 「해설 보기」로 보입니다. 같은 장면에 해설(예: 부피)이 더해지면 이 이름이 단추 글자가 됩니다
    tab: 'review',
    answer: '$48\\pi$',
    answerText: '$48\\pi$ cm²',
    summary: '겉넓이 = 밑넓이 × 2 + 옆넓이',
    task: '밑면 모양과 길이를 바꿔 겉넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 9,
        title: '원기둥을 펼치면?',
        start: { sR: 3, sH: 5, sT: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '원기둥의 옆면을 펼쳐요.', set: { svShape: 'circ', sv11Mode: 'surf', sv11Started: true }, to: { sT: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '밑면 2개와 옆면 1개로 펼쳐져요.' }
        ]
      },
      {
        length: 10,
        title: '옆면의 가로와 세로',
        cues: [
          { at: 0, say: '옆면의 가로는 밑면의 **둘레** 전체예요.', step: 2 },
          { at: 0.5, to: { sT: 0.6 }, dur: 2.5, ease: 'smooth' },
          { at: 3.5, say: '둘레 $2\\pi\\times3=6\\pi$, 세로는 높이 $5$.', to: { sT: 1 }, dur: 3, ease: 'smooth' }
        ]
      },
      {
        length: 10,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '겉넓이 = 밑넓이 2개 + 옆넓이', step: 3 },
          { at: 3.5, say: '밑면 $9\\pi\\times2=18\\pi$, 옆면 $6\\pi\\times5=30\\pi$.' },
          { at: 7, say: '겉넓이 $=18\\pi+30\\pi=48\\pi$ cm²' }
        ]
      }
    ]
  }
};
