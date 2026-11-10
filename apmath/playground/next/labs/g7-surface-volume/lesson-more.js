/* ==========================================================================
   겉넓이 · 부피 · 해설(lesson) 더하기 (lesson-more.js) — lesson.js 에 이어 같은 window.APL_LESSONS['g7-surface-volume'] 에 해설을 더합니다.
   (lesson.js 는 sv1-1 의 해설·검사가 tools/video.test.mjs 에 있어 그대로 두고, 이후 해설은 이 파일에서 만들어 tools/lessons.g7-surface-volume.test.mjs 가 검사합니다.)
   형식: kit/apl-video-core.js 맨 위 주석, docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 「해설(lesson)」.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-surface-volume'] = window.APL_LESSONS['g7-surface-volume'] || {};

/* ==============================================================================================================
   아래 해설들 (2026-11-11 · 쇼츠 규칙: 장 8~15초, 자막 2~3줄·한 줄 40자, 첫 장은 1초 안에 움직임, 정답은 마지막 장에서만)
   공통 장치: dims.js 의 D.lessonHide(= 해설 재생 중 s.lessonOn 이고 s.svShowV 가 아직 꺼짐) — 그림이 미리 그리는 결과 줄(합 식의 둘째 줄 「= 15π + 9π = 24π」 등)을
   결론 자막에서 svShowV 가 켜질 때까지 아낍니다. svShowV 는 한 장면의 모든 해설이 첫 장 at:0 칸에서 false 로 시작합니다(다시 보기에서 앞선 재생의 true 가 새지 않게).
   ============================================================================================================== */
Object.assign(window.APL_LESSONS['g7-surface-volume'], {
  /* ---------- 기둥의 부피 (t1.js sv1-4) · 4장 37초 · tab:'review' ----------
     밑면 가로 4 · 세로 3 · 높이 5 (init: sA 4, sB 3, sH 5, svShape rect). 밑넓이 4×3 = 12, 판 5장 → 높이 5, 부피 12×5 = 60.
     sT4(판 쌓기 0~1): 0(빈 틀, 가로 4 · 세로 3 표시) → 1(판 5장, 밑넓이 12 · 높이 5 표시). 정리 탭 단계 1 은 윗면 강조, 2 는 쌓인 판 강조.
     결과는 정리 탭 3단계 위쪽 한 줄(t1.js sv14 draw 끝) — 해설 재생 중에는 svShowV 가 켜질 때까지 그리지 않습니다. */
  'sv1-4': {
    title: '기둥의 부피',
    tab: 'review',
    answer: '$60$',
    answerText: '$60$ cm³',
    summary: '부피 = 밑넓이 × 높이',
    task: '밑면 모양과 길이를 바꿔 부피가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 10,
        title: '판을 쌓아요',
        start: { sA: 4, sB: 3, sH: 5, sT4: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '밑면과 같은 판을 한 장씩 쌓아요.', set: { svShape: 'rect', svShowV: false }, to: { sT4: 1 }, dur: 6, ease: 'linear' },
          { at: 6.5, say: '판 5장을 쌓으면 높이는 5예요.' }
        ]
      },
      {
        length: 9,
        title: '밑넓이',
        cues: [
          { at: 0, say: '밑면은 가로 4, 세로 3인 직사각형이에요.', step: 1 },
          { at: 4, say: '밑넓이는 $4\\times3=12$예요.' }
        ]
      },
      {
        length: 9,
        title: '높이만큼 쌓기',
        cues: [
          { at: 0, say: '판이 5장이라 높이는 5예요.', step: 2 },
          { at: 4, say: '판 한 장은 $12\\times1$, 5장이면 $12\\times5$.' }
        ]
      },
      {
        length: 9,
        title: '부피는?',
        cues: [
          { at: 0, say: '(부피) = (밑넓이) × (높이)', step: 3 },
          { at: 4.5, say: '부피 $=12\\times5=60$ cm³', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 구의 겉넓이 (t3.js sv3-1) · 3장 28초 · tab:'review' ----------
     r=3 (s6R). 단면 원 하나 π×3² = 9π, 원 4개, 겉넓이 4×9π = 36π (= 4πr² ✓). 원 4개는 「넓이를 비교하는 그림」이지 구의 전개도가 아닙니다(장면 안내와 같은 말).
     s6T(넓이 비교 0~1): 0(구 + 단면 원, 반지름 3) → 1(구 + 9π 원 4개). 정리 탭 단계 1 은 원, 2 는 원 4개 강조.
     결과는 폭이 좁은 그림에서는 정리 탭 3단계 위쪽 한 줄(t3.js sv31 draw), 넓은 그림은 장면의 「넓이 비교: 9π × 4 = 36π」 줄 — 둘 다 해설 재생 중에는 svShowV 가 켜질 때까지 아낍니다. */
  'sv3-1': {
    title: '구의 겉넓이',
    tab: 'review',
    answer: '$36\\pi$',
    answerText: '$36\\pi$ cm²',
    summary: '구의 겉넓이 $=4\\pi r^2$',
    task: '반지름을 바꿔 원 하나의 넓이와 겉넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 10,
        title: '구를 반으로 자르면',
        start: { s6R: 3, s6T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '구를 반으로 자르면 단면은 반지름 3인 원이에요.', set: { svShowV: false }, step: 1 },
          { at: 0.5, to: { s6T: 1 }, dur: 5, ease: 'smooth' },
          { at: 6, say: '그 원의 넓이는 $\\pi\\times3^2=9\\pi$예요.' }
        ]
      },
      {
        length: 9,
        title: '원 4개와 비교',
        cues: [
          { at: 0, say: '구의 겉넓이는 이 원 4개의 넓이와 같아요.', step: 2 },
          { at: 4.5, say: '넓이를 비교한 그림이고 전개도는 아니에요.' }
        ]
      },
      {
        length: 9,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = (원 하나의 넓이) × 4', step: 3 },
          { at: 4.5, say: '겉넓이 $=9\\pi\\times4=36\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 원뿔의 겉넓이 (t2.js sv2-2) · 3장 33초 · tab:'review' ----------
     r=3, 모선 5 (높이 4 는 겉넓이에 쓰지 않음). 밑넓이 π×3² = 9π, 밑면의 둘레 = 호의 길이 2π×3 = 6π, 옆넓이 ½×5×6π = 15π, 겉넓이 9π+15π = 24π (= πr²+πrl ✓).
     s2U(펼침 0~1): 0(원뿔 · 모선 5 · 높이 4 · 반지름 3) → 1(부채꼴 + 원: 옆넓이 15π · 호의 길이 6π · 밑면의 둘레 6π · 밑넓이 9π). 정리 탭 2 단계 옆면, 3 단계 전체.
     「밑넓이 9π」는 장면이 탐구 탭에만 그리던 것을 정리 탭에도 그리게 했고(t2.js sv22), 결과 줄은 정리 탭 3단계 위쪽 한 줄이며 해설 재생 중에는 svShowV 가 켜질 때까지 아낍니다. */
  'sv2-2': {
    title: '원뿔의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$24\\pi$',
    answerText: '$24\\pi$ cm²',
    summary: '겉넓이 $=\\pi r^2+\\pi rl$',
    task: '반지름과 모선의 길이를 바꿔 부채꼴이 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '옆면을 펼치면',
        start: { s2r: 3, s2G: 5, s2U: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '원뿔의 옆면을 펼치면 어떤 모양일까요?', set: { svShowV: false }, to: { s2U: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '부채꼴이에요. 반지름은 모선 5예요.' }
        ]
      },
      {
        length: 10,
        title: '호의 길이',
        cues: [
          { at: 0, say: '부채꼴의 호는 밑면의 둘레와 같아요.', step: 2 },
          { at: 4.5, say: '밑면의 둘레는 $2\\pi\\times3=6\\pi$예요.' }
        ]
      },
      {
        length: 12,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '옆넓이는 $\\frac12\\times5\\times6\\pi=15\\pi$예요.', step: 3 },
          { at: 4, say: '밑넓이는 $\\pi\\times3^2=9\\pi$예요.' },
          { at: 8, say: '겉넓이 $=9\\pi+15\\pi=24\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 회전체: 직각삼각형을 변을 축으로 돌려 만든 원뿔 (t4.js sv4-1) · 문제를 고정: svTri A(3-4-5) · svAxis long(길이 4인 변이 축) · s41K 1 ----------
     축으로 하는 변 4 → 높이 4, 다른 직각변 3 → 반지름 3, 빗변 5 → 모선 5. (축을 바꾸면 반지름과 높이가 서로 바뀌는 것이 이 유형의 함정이라 첫 장에서 「어느 변이 축인가」부터 짚습니다.)
     s41T(돌리기·펼치기 0~1): 0~0.5 삼각형을 축 둘레로 돌려 원뿔(삼각형 위에 높이 4 · 반지름 3 · 모선(빗변) 5 · 축이 그려짐), 0.5~1 겉넓이는 전개도로 펼침.
     해설 재생 중에는 정리 탭도 같은 순서로 돌고 펼쳐지며(t4.js sv41 draw 의 lessonRun), 전개도가 다 펼쳐지면 옆넓이 15π · 호의 길이 6π · 모선 5 · 밑넓이 9π · 반지름 3 이 그려집니다.
     결과 줄(「겉넓이 = 옆넓이 + 밑넓이 / = 15π + 9π = 24π」 · 「부피 = ⅓ × 밑넓이 × 높이 / = ⅓ × 9π × 4 = 12π」)은 합 식의 둘째 줄이라 svShowV 가 켜질 때까지 숨겨집니다(solid3d.js sumRows).
     밑넓이 π×3² = 9π, 호 = 밑면의 둘레 2π×3 = 6π, 옆넓이 ½×5×6π = 15π, 겉넓이 24π, 부피 ⅓×9π×4 = 12π. ⅓ 은 장면 규칙 「(부피) = ⅓ × (밑넓이) × (높이)」를 그대로 말합니다(증명이 아님). */
  'sv4-1': [
    {
      title: '회전체의 겉넓이',
      label: '겉넓이',
      tab: 'review',
      answer: '$24\\pi$',
      answerText: '$24\\pi$ cm²',
      summary: '축이 높이, 다른 변이 반지름, 빗변이 모선',
      task: '축으로 하는 변을 바꿔 반지름과 높이가 어떻게 바뀌는지 해 보세요',
      chapters: [
        {
          length: 11,
          title: '어느 변이 축?',
          start: { s41K: 1, s41T: 0, svYaw: 28, svPitch: 20 },
          cues: [
            { at: 0, say: '직각삼각형을 길이 4인 변을 축으로 돌려요.', set: { svTri: 'A', svAxis: 'long', svMode: 'surf', svShowV: false }, to: { s41T: 0.06 }, dur: 2.5, ease: 'smooth' },
            { at: 3.5, say: '축이 높이 4, 다른 변이 반지름 3, 빗변이 모선 5.' },
            { at: 7, say: '한 바퀴 돌리면 원뿔이 돼요.', to: { s41T: 0.5 }, dur: 3.5, ease: 'smooth' }
          ]
        },
        {
          length: 11,
          title: '옆면 펼치기',
          cues: [
            { at: 0, say: '옆면을 펼치면 부채꼴이 돼요.', to: { s41T: 1 }, dur: 5, ease: 'smooth' },
            { at: 6, say: '반지름은 모선 5, 호는 밑면의 둘레 $6\\pi$.' }
          ]
        },
        {
          length: 12,
          title: '겉넓이는?',
          cues: [
            { at: 0, say: '옆넓이는 $\\frac12\\times5\\times6\\pi=15\\pi$예요.', step: 2 },
            { at: 4, say: '밑넓이는 $\\pi\\times3^2=9\\pi$예요.' },
            { at: 8, say: '겉넓이 $=15\\pi+9\\pi=24\\pi$ cm²', step: 3, set: { svShowV: true } }
          ]
        }
      ]
    },
    {
      title: '회전체의 부피',
      label: '부피',
      tab: 'review',
      answer: '$12\\pi$',
      answerText: '$12\\pi$ cm³',
      summary: '원뿔의 부피 $=\\frac13\\times$ 밑넓이 $\\times$ 높이',
      task: '축으로 하는 변을 바꿔 반지름과 높이가 어떻게 바뀌는지 해 보세요',
      chapters: [
        {
          length: 11,
          title: '어느 변이 축?',
          start: { s41K: 1, s41T: 0, svYaw: 28, svPitch: 20 },
          cues: [
            { at: 0, say: '직각삼각형을 길이 4인 변을 축으로 돌려요.', set: { svTri: 'A', svAxis: 'long', svMode: 'vol', svShowV: false }, to: { s41T: 0.06 }, dur: 2.5, ease: 'smooth' },
            { at: 3.5, say: '축이 높이 4, 다른 변이 반지름 3, 빗변이 모선 5.' },
            { at: 7, say: '한 바퀴 돌리면 원뿔이 돼요.', to: { s41T: 0.5 }, dur: 3.5, ease: 'smooth' }
          ]
        },
        {
          length: 9,
          title: '밑넓이',
          cues: [
            { at: 0, say: '원뿔의 밑면은 반지름 3인 원이에요.', step: 1 },
            { at: 4.5, say: '밑넓이는 $\\pi\\times3^2=9\\pi$예요.', step: 2 }
          ]
        },
        {
          length: 11,
          title: '부피는?',
          cues: [
            { at: 0, say: '(부피) $=\\frac13\\times$ (밑넓이) $\\times$ (높이)', step: 3 },
            { at: 4.5, say: '부피 $=\\frac13\\times9\\pi\\times4=12\\pi$ cm³', set: { svShowV: true } }
          ]
        }
      ]
    }
  ],

  /* ---------- 정사각뿔대의 겉넓이 (t2.js sv2-5, svKind5 frus · svMode surf) · 4장 41초 · tab:'review' ----------
     아랫면 한 변 9 · 윗면 한 변 3 · 옆면의 높이 5(사다리꼴 옆면의 높이). 밑면 3²+9² = 90, 옆면 하나 ½×(3+9)×5 = 30, 4개 120, 겉넓이 90+120 = 210.
     s5T(펼침 0~1): 0(입체: 윗면 9 · 옆면 30 · 옆면의 높이 5 · 한 변 3 · 9 가 이미 보임) → 1(전개도: 윗면 9 · 아랫면 81 · 옆면 30 4개). 정리 탭 1 단계 밑면, 2 단계 옆면.
     그림 위쪽 합 식의 둘째 줄(「= 120 + 9 + 81 = 210」)은 svShowV 가 켜질 때까지 숨겨지고(solid3d.js sumRows), 아래 줄 「옆면 1개 = (3 + 9) × 5 ÷ 2 = 30」은 풀이 도중의 값이라 그대로 둡니다. */
  'sv2-5': {
    title: '각뿔대의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$210$',
    answerText: '$210$ cm²',
    summary: '겉넓이 = 밑면 2개 + 옆면 4개',
    task: '아랫면과 윗면의 한 변을 바꿔 옆면의 넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 10,
        title: '입체를 펼치기',
        start: { s5A: 9, s5B: 3, s5T: 0, svYaw: 28, svPitch: 24 },
        cues: [
          { at: 0, say: '정사각뿔대의 겉면을 펼쳐 봐요.', set: { svKind5: 'frus', svMode: 'surf', svShowV: false }, to: { s5T: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '밑면 2개와 사다리꼴 옆면 4개가 나와요.', step: 1 }
        ]
      },
      {
        length: 9,
        title: '밑면의 넓이',
        cues: [
          { at: 0, say: '밑면은 한 변이 3, 9인 정사각형이에요.', step: 1 },
          { at: 4.5, say: '밑면의 넓이 합은 $3^2+9^2=9+81=90$예요.' }
        ]
      },
      {
        length: 10,
        title: '옆면의 넓이',
        cues: [
          { at: 0, say: '옆면은 윗변 3, 아랫변 9, 높이 5인 사다리꼴.', step: 2 },
          { at: 4.5, say: '넓이는 $\\frac12\\times(3+9)\\times5=30$예요.' }
        ]
      },
      {
        length: 12,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = 옆면 4개 + 윗면 + 아랫면', step: 3 },
          { at: 5, say: '겉넓이 $=30\\times4+9+81=210$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  }
});
