/* ==========================================================================
   겉넓이 · 부피 · 해설(lesson) (lesson.js)
   window.APL_LESSONS['g7-surface-volume'] = { '<장면 id>': 해설 또는 [해설, 해설] , ... }
   형식: kit/apl-video-core.js 맨 위 주석, docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 「해설(lesson)」·「한 장면에 해설이 여럿」.
   sv1-1 은 겉넓이와 부피를 함께 묻는 장면이라 해설이 둘이고(진입 화면에 「▶ 겉넓이」「▶ 부피」), 두 해설은 서로 독립입니다:
   각자 at:0 칸에서 자기 모드(sv11Mode)와 시작값을 정하고, 한 해설만 쓰는 set 키(svShowV)도 상대 해설의 at:0 에서 false 로 정해 둡니다.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};

window.APL_LESSONS['g7-surface-volume'] = {
  'sv1-1': [
    /* ---------- 원기둥의 겉넓이 (t1.js sv1-1) · 3장 29초 · tab:'review' ----------
       r=3, h=5. 탐구 탭의 전개도에는 길이 표시가 없고, 정리 탭 그림에는 밑넓이 9π · 반지름 3 · 높이 5 · 밑면의 둘레 6π 가 있어 자막의 숫자가 그림에 보입니다 → tab:'review'.
       밑넓이 π·3² = 9π, 밑면 2개 9π×2 = 18π, 밑면의 둘레 2π·3 = 6π, 옆넓이 6π×5 = 30π, 겉넓이 18π+30π = 48π (= 2π·3·(3+5) ✓).
       sT(펼침 0~1): 0 → 1(펼침) → 0.6 → 1(옆면 띠가 밑면 둘레만큼 감겼다 펴짐). step: 1(밑면) → 2(옆면) → 3(전부).
       (이전 영상 대본은 sv11Started 를 켜지 않아 전개도가 펼쳐지지 않았으므로 이 해설로 대신했습니다.) */
    {
      title: '원기둥의 겉넓이',
      label: '겉넓이',
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
            { at: 0, say: '원기둥의 옆면을 펼쳐요.', set: { svShape: 'circ', sv11Mode: 'surf', sv11Started: true, svShowV: false }, to: { sT: 1 }, dur: 5, ease: 'smooth' },
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
    },
    /* ---------- 원기둥의 부피 (t1.js sv1-1, sv11Mode:'vol') · 3장 27초 · tab:'review' ----------
       r=3, h=5. 장면의 부피 풀이(steps): ① 밑넓이 π×3² = 9π ② 같은 밑면이 높이 5 만큼 쌓인 입체 ③ (부피) = 9π×5 = 45π cm³ (= π·3²·5 ✓). 장면 tip: 「부피는 같은 밑면이 높이만큼 쌓인 양이에요.」
       그림(t1.js volLabels, 정리 탭에서만): 단계 1 밑면 강조 + 밑넓이 9π + 반지름 3 → 단계 2 높이 5(조각이 다시 모여 한 덩어리일 때) → 단계 3 결과는 s.svShowV 가 켜질 때까지 아낌(s.lessonOn 일 때).
       sT(조각이 벌어진 정도 0~1): 0 → 0.6(밑면이 같은 조각들) → 0(차곡차곡 쌓임). 단계: 1 → 2 → 3. */
    {
      title: '원기둥의 부피',
      label: '부피',
      tab: 'review',
      answer: '$45\\pi$',
      answerText: '$45\\pi$ cm³',
      summary: '부피 = 밑넓이 × 높이',
      task: '밑면 모양과 길이를 바꿔 부피가 어떻게 달라지는지 해 보세요',
      chapters: [
        {
          length: 9,
          title: '밑면의 넓이',
          start: { sR: 3, sH: 5, sT: 0, svYaw: 28, svPitch: 22 },
          cues: [
            { at: 0, say: '밑면은 반지름 3인 원이에요.', set: { svShape: 'circ', sv11Mode: 'vol', sv11Started: true, svShowV: false }, step: 1 },
            { at: 0.1, to: { sT: 0.6 }, dur: 4, ease: 'smooth' },
            { at: 4.5, say: '밑넓이는 $\\pi\\times3^2=9\\pi$예요.' }
          ]
        },
        {
          length: 9,
          title: '높이만큼 쌓기',
          cues: [
            { at: 0, say: '같은 밑면이 차곡차곡 쌓여 입체가 돼요.', step: 2 },
            { at: 0.5, to: { sT: 0 }, dur: 4, ease: 'smooth' },
            { at: 5.5, say: '높이는 $5$, 밑넓이 $9\\pi$가 높이만큼 쌓여요.' }
          ]
        },
        {
          length: 9,
          title: '부피는?',
          cues: [
            { at: 0, say: '(부피) = (밑넓이) × (높이)', step: 3 },
            { at: 4.5, say: '부피 $=9\\pi\\times5=45\\pi$ cm³', set: { svShowV: true } }
          ]
        }
      ]
    }
  ]
};
