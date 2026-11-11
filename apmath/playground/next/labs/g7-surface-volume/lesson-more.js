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
  'sv2-5': [{
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
  }, {
    /* 각뿔대의 부피 (같은 장면 svMode vol): 큰 각뿔 − 작은 각뿔. 밑면 한 변 9 · 윗면 한 변 3 → 큰 각뿔 높이 6, 작은 각뿔 높이 2 (닮음비 3:1). ⅓×9²×6 = 162, ⅓×3²×2 = 6, 162−6 = 156.
       s5T(0~1): 0 큰 각뿔(점선으로 꼭대기까지 이음 · 한 변 9 · 높이 6 · 큰 각뿔 162) → 1 작은 각뿔이 옆으로 빠져나감(작은 각뿔 한 변 3 · 높이 2 · 6). 「각뿔대 156」 이름표와 합 식 둘째 줄은 t2.js drawVol 에서 해설 재생 중 svShowV 까지 숨깁니다. */
    title: '각뿔대의 부피',
    label: '부피',
    tab: 'review',
    answer: '$156$',
    answerText: '$156$ cm³',
    summary: '각뿔대 = 큰 각뿔 − 작은 각뿔',
    task: '아랫면과 윗면의 한 변을 바꿔 큰 각뿔과 작은 각뿔의 부피를 비교해 보세요',
    chapters: [
      {
        length: 11,
        title: '큰 각뿔로 만들기',
        start: { s5A: 9, s5B: 3, s5T: 0, svYaw: 28, svPitch: 24 },
        cues: [
          { at: 0, say: '각뿔대의 윗부분을 이어 큰 각뿔을 만들어요.', set: { svKind5: 'frus', svMode: 'vol', svShowV: false }, step: 1 },
          { at: 4.5, say: '큰 각뿔은 $\\frac13\\times9^2\\times6=162$예요.' }
        ]
      },
      {
        length: 11,
        title: '작은 각뿔 빼기',
        cues: [
          { at: 0, say: '이은 부분이 작은 각뿔이에요. 빼 볼게요.', step: 2 },
          { at: 0.5, to: { s5T: 1 }, dur: 4 },
          { at: 5.5, say: '작은 각뿔(한 변 3, 높이 2)은 $\\frac13\\times3^2\\times2=6$.' }
        ]
      },
      {
        length: 10,
        title: '각뿔대의 부피는?',
        cues: [
          { at: 0, say: '(각뿔대) = (큰 각뿔) − (작은 각뿔)', step: 3 },
          { at: 4.5, say: '부피 $=162-6=156$ cm³', set: { svShowV: true } }
        ]
      }
    ]
  }],

  /* ---------- 원뿔 종합 (t2.js sv2-3) · 문제 고정: svTri A(반지름 3 · 높이 4 · 모선 5) · s3K 1 ----------
     이 유형의 핵심은 「주어진 길이 셋 중 겉넓이에는 모선, 부피에는 높이를 쓴다」 입니다. 첫 장에서 입체에 세 길이가 다 보일 때 그 말을 합니다.
     겉넓이: 밑넓이 π×3² = 9π, 호 = 밑면의 둘레 2π×3 = 6π, 옆넓이 ½×5×6π = 15π, 겉넓이 24π. 부피: ⅓×9π×4 = 12π (⅓ 은 장면 규칙 그대로, 증명 아님).
     s3U(펼침 0~1): 해설 재생 중에는 정리 탭도 s3U 를 따라 펼쳐집니다(t2.js sv23 draw 의 rv && !s.lessonOn). 재생 중 정리 탭은 이름표(밑넓이 9π · 옆넓이 15π)와 합 식도 그립니다(solid3d.js coneNet 의 lbl),
     부피는 밑넓이 이름표 + 「부피 = ⅓ × 밑넓이 × 높이 / = … = 12π」(둘째 줄은 svShowV 까지 숨김). */
  'sv2-3': [
    {
      title: '원뿔의 겉넓이',
      label: '겉넓이',
      tab: 'review',
      answer: '$24\\pi$',
      answerText: '$24\\pi$ cm²',
      summary: '겉넓이에는 모선을 써요',
      task: '반지름·높이·모선이 다른 원뿔로 바꿔 어떤 길이를 쓰는지 해 보세요',
      chapters: [
        {
          length: 11,
          title: '어떤 길이를 쓸까',
          start: { s3K: 1, s3U: 0, svYaw: 28, svPitch: 20 },
          cues: [
            { at: 0, say: '반지름 3, 높이 4, 모선 5인 원뿔이에요.', set: { svTri: 'A', svMode: 'surf', sv23Started: true, svShowV: false }, step: 1 },
            { at: 3.5, say: '겉넓이에는 모선 5를 쓰고 높이 4는 안 써요.', to: { s3U: 1 }, dur: 5.5, ease: 'smooth' }
          ]
        },
        {
          length: 10,
          title: '옆면은 부채꼴',
          cues: [
            { at: 0, say: '펼치면 반지름이 모선 5인 부채꼴이에요.', step: 2 },
            { at: 4.5, say: '호의 길이는 밑면의 둘레 $2\\pi\\times3=6\\pi$.' }
          ]
        },
        {
          length: 12,
          title: '겉넓이는?',
          cues: [
            { at: 0, say: '옆넓이는 $\\frac12\\times5\\times6\\pi=15\\pi$예요.', step: 3 },
            { at: 4, say: '밑넓이는 $\\pi\\times3^2=9\\pi$예요.' },
            { at: 8, say: '겉넓이 $=15\\pi+9\\pi=24\\pi$ cm²', set: { svShowV: true } }
          ]
        }
      ]
    },
    {
      title: '원뿔의 부피',
      label: '부피',
      tab: 'review',
      answer: '$12\\pi$',
      answerText: '$12\\pi$ cm³',
      summary: '부피에는 높이를 써요',
      task: '반지름·높이·모선이 다른 원뿔로 바꿔 어떤 길이를 쓰는지 해 보세요',
      chapters: [
        {
          length: 9,
          title: '어떤 길이를 쓸까',
          start: { s3K: 1, s3U: 0, svYaw: 28, svPitch: 20 },
          cues: [
            { at: 0, say: '반지름 3, 높이 4, 모선 5인 원뿔이에요.', set: { svTri: 'A', svMode: 'vol', sv23Started: true, svShowV: false }, step: 1 },
            { at: 3.5, say: '부피에는 높이 4를 쓰고 모선 5는 안 써요.' }
          ]
        },
        {
          length: 9,
          title: '밑넓이',
          cues: [
            { at: 0, say: '밑면은 반지름 3인 원이에요.', step: 1 },
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

  /* ---------- 원뿔대의 겉넓이 (t2.js sv2-4, svMode surf) · 문제 고정: svTri4 A · s4K 2 · s4J 1 (아랫면 반지름 6 · 윗면 반지름 3 · 큰 원뿔의 모선 10 · 작은 원뿔의 모선 5 · 높이 4) ----------
     풀이의 핵심 동작은 「큰 부채꼴 − 작은 부채꼴」입니다. 큰 부채꼴 π×6×10 = 60π, 작은 부채꼴 π×3×5 = 15π, 옆넓이 60π−15π = 45π, 윗면 π×3² = 9π, 아랫면 π×6² = 36π, 겉넓이 45π+9π+36π = 90π.
     s4T(펼침 0~1): 해설 재생 중에는 정리 탭도 s4T 를 따라 펼쳐지고(t2.js drawSurf 의 rv && !s.lessonOn), 아래 줄은 단계마다 한 줄만(1 큰 부채꼴 · 2 작은 부채꼴 · 3 옆넓이 = 60π − 15π = 45π · 4 비움) — solid3d.js coneNet 의 ringRow.
     면의 넓이 이름표(윗면 9π · 아랫면 36π · 45π)는 재생 중에만 정리 탭에 그리고(lbl), 합 식 둘째 줄 「= 45π + 9π + 36π = 90π」는 svShowV 까지 숨깁니다.
     원뿔대의 부피(sv2-4 부피)는 정리 탭 그림에 높이·부피 값이 없어 아직 해설을 만들지 않았습니다. */
  'sv2-4': [{
    title: '원뿔대의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$90\\pi$',
    answerText: '$90\\pi$ cm²',
    summary: '옆넓이 = 큰 부채꼴 − 작은 부채꼴',
    task: '원뿔대의 크기를 바꿔 큰 부채꼴과 작은 부채꼴이 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '원뿔대 펼치기',
        start: { s4K: 2, s4J: 1, s4T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '원뿔대의 겉면을 펼쳐 봐요.', set: { svTri4: 'A', svMode: 'surf', svShowV: false }, to: { s4T: 1 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '옆면은 부채꼴 고리, 밑면은 원 2개예요.' }
        ]
      },
      {
        length: 12,
        title: '큰 부채꼴, 작은 부채꼴',
        cues: [
          { at: 0, say: '큰 부채꼴은 반지름 10, 호는 $12\\pi$예요.', step: 1 },
          { at: 3, say: '넓이는 $\\pi\\times6\\times10=60\\pi$예요.' },
          { at: 6.5, say: '작은 부채꼴은 $\\pi\\times3\\times5=15\\pi$.', step: 2 }
        ]
      },
      {
        length: 12,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '옆넓이는 큰 부채꼴 − 작은 부채꼴이에요.', step: 3 },
          { at: 3.5, say: '$60\\pi-15\\pi=45\\pi$예요.' },
          { at: 7, say: '겉넓이 $=45\\pi+9\\pi+36\\pi=90\\pi$ cm²', step: 4, set: { svShowV: true } }
        ]
      }
    ]
  }, {
    /* 원뿔대의 부피 (svMode vol): 큰 원뿔 − 작은 원뿔. 아랫면 반지름 6 · 윗면 반지름 3 → 큰 원뿔 높이 8, 작은 원뿔 높이 4 (닮음비 2:1). ⅓π×6²×8 = 96π, ⅓π×3²×4 = 12π, 96π−12π = 84π. ⅓ 은 장면의 원뿔 부피 규칙 그대로.
       s4T(0~1): 0 큰 원뿔(점선으로 꼭대기까지 이음 · 반지름 6 · 높이 8) → 1 작은 원뿔이 옆으로 빠져나감(반지름 3 · 높이 4). 재생 중 정리 탭은 값 이름표(큰 원뿔 96π · 작은 원뿔 12π)와 합 식을 그리고(solid3d.js frustumVol 의 lessonShow), 「원뿔대 84π」 이름표와 합 식 둘째 줄은 svShowV 까지 숨깁니다. */
    title: '원뿔대의 부피',
    label: '부피',
    tab: 'review',
    answer: '$84\\pi$',
    answerText: '$84\\pi$ cm³',
    summary: '원뿔대 = 큰 원뿔 − 작은 원뿔',
    task: '원뿔대의 크기를 바꿔 큰 원뿔과 작은 원뿔의 부피를 비교해 보세요',
    chapters: [
      {
        length: 11,
        title: '큰 원뿔로 만들기',
        start: { s4K: 2, s4J: 1, s4T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '원뿔대의 윗부분을 이어 큰 원뿔을 만들어요.', set: { svTri4: 'A', svMode: 'vol', svShowV: false }, step: 1 },
          { at: 4.5, say: '큰 원뿔은 $\\frac13\\pi\\times6^2\\times8=96\\pi$예요.' }
        ]
      },
      {
        length: 11,
        title: '작은 원뿔 빼기',
        cues: [
          { at: 0, say: '이은 부분이 작은 원뿔이에요. 빼 볼게요.', step: 2 },
          { at: 0.5, to: { s4T: 1 }, dur: 4 },
          { at: 5.5, say: '작은 원뿔(반지름 3, 높이 4)은 $12\\pi$예요.' }
        ]
      },
      {
        length: 10,
        title: '원뿔대의 부피는?',
        cues: [
          { at: 0, say: '(원뿔대) = (큰 원뿔) − (작은 원뿔)', step: 3 },
          { at: 4.5, say: '부피 $=96\\pi-12\\pi=84\\pi$ cm³', set: { svShowV: true } }
        ]
      }
    ]
  }],

  /* ---------- 구멍 뚫린 입체 (t5.js sv5-1) · 문제 고정: s51A 6 · s51H 5 · s51Q 2 (6×6×5 상자에 반지름 2인 원기둥 구멍이 관통) ----------
     「없어지는 면」과 「새로 생기는 면」을 하나씩 짚는 유형. 뚫기 전 6×6×2 + 6×5×4 = 192, 입구 2개 −2×π×2² = −8π, 안쪽 옆면 2π×2×5 = 20π, 겉넓이 192−8π+20π = 192+12π.
     s51T(0~1): 0 구멍 자리(붉은 원기둥) → 0.3 입구의 원이 붉게 → 0.5 안쪽 벽이 노랗게 → 1 반으로 갈라 안쪽 벽을 보임. 단계별 식 한 줄은 t5.js sv51 draw 끝(G.stepRow)이 정리 탭에 그리고, 4단계 결과 줄은 svShowV 까지 숨깁니다. */
  'sv5-1': {
    title: '구멍 뚫린 입체의 겉넓이',
    tab: 'review',
    answer: '$192+12\\pi$',
    answerText: '$192+12\\pi$ cm²',
    summary: '겉넓이 = 처음 − 입구 + 안쪽 옆면',
    task: '구멍의 반지름과 상자의 크기를 바꿔 겉넓이가 늘고 줄 때를 찾아 보세요',
    chapters: [
      {
        length: 11,
        title: '구멍을 뚫어요',
        start: { s51A: 6, s51H: 5, s51Q: 2, s51T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '6×6×5 상자에 반지름 2인 구멍을 뚫어요.', set: { svShowV: false }, to: { s51T: 0.3 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '먼저 뚫기 전 겉넓이는 $6\\times6\\times2+6\\times5\\times4=192$.', step: 1 }
        ]
      },
      {
        length: 10,
        title: '없어지는 면',
        cues: [
          { at: 0, say: '입구의 원 2개는 겉면에서 없어져요.', step: 2 },
          { at: 4.5, say: '$-2\\times\\pi\\times2^2=-8\\pi$만큼 줄어요.' }
        ]
      },
      {
        length: 10,
        title: '새로 생기는 면',
        cues: [
          { at: 0, say: '구멍 안쪽에 새로운 옆면이 생겨요.', step: 3 },
          { at: 0.5, to: { s51T: 0.5 }, dur: 3 },
          { at: 4.5, say: '$2\\pi\\times2\\times5=20\\pi$만큼 늘어요.' }
        ]
      },
      {
        length: 11,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = 처음 − 입구 2개 + 안쪽 옆면', step: 4 },
          { at: 0.5, to: { s51T: 1 }, dur: 4 },
          { at: 5, say: '겉넓이 $=192-8\\pi+20\\pi=192+12\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 모퉁이를 잘라 낸 정육면체 (t5.js sv5-3) · 문제 고정: svCnt 1 · s53A 6 · s53P 2 ----------
     없어지는 바깥 3면 −3×2×2 = −12, 생기는 안쪽 3면 +3×2×2 = +12 → 겉넓이 변화 없음(216). 정답이 처음 겉넓이와 같아서, 그림의 단계 줄은 재생 중 1단계에 「= 216」을 쓰지 않습니다(결과 전까지 숨김). */
  'sv5-3': {
    title: '모퉁이를 잘라 낸 겉넓이',
    tab: 'review',
    answer: '$216$',
    answerText: '$216$ cm²',
    summary: '없어진 면과 생긴 면이 같아 겉넓이는 그대로',
    task: '자르는 모퉁이 수와 크기를 바꿔도 겉넓이가 그대로인지 확인해 보세요',
    chapters: [
      {
        length: 10,
        title: '모퉁이를 잘라요',
        start: { s53A: 6, s53P: 2, s53T: 0, svYaw: 28, svPitch: 24 },
        cues: [
          { at: 0, say: '한 모서리가 6인 정육면체의 모퉁이를 잘라요.', set: { svCnt: 1, svShowV: false }, to: { s53T: 0.45 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '잘라 내는 조각은 한 모서리가 2예요.', step: 1 }
        ]
      },
      {
        length: 9,
        title: '없어지는 면',
        cues: [
          { at: 0, say: '바깥 3면이 조각과 함께 없어져요.', step: 2 },
          { at: 4.5, say: '$3\\times2\\times2=12$만큼 줄어요.' }
        ]
      },
      {
        length: 10,
        title: '새로 생기는 면',
        cues: [
          { at: 0, say: '잘라 낸 자리에 안쪽 3면이 생겨요.', step: 3 },
          { at: 0.5, to: { s53T: 0.6 }, dur: 3 },
          { at: 4.5, say: '같은 크기라 $12$만큼 늘어요.' }
        ]
      },
      {
        length: 10,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '줄어든 만큼 다시 늘어나요.', step: 4 },
          { at: 0.5, to: { s53T: 1 }, dur: 4 },
          { at: 5, say: '겉넓이 $=6\\times6\\times6-12+12=216$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 붙인 입체의 겉넓이 (t5.js sv5-6, svMode surf) · 문제 고정: svTop cyl · s56A 8 · s56H 4 · s56R 3 · s56Z 3 ----------
     8×8×4 상자 위에 반지름 3 · 높이 3 원기둥. 상자 겉넓이 2×8×8+4×8×4 = 256, 붙은 자리 −π×3² = −9π, 원기둥 겉면(붙은 밑면 제외) 옆면 2π×3×3 + 윗면 π×3² = 27π, 겉넓이 256−9π+27π = 256+18π.
     s56T(위 입체 떼어 놓기 0~1): 0 붙어 있음 → 1 위 입체가 옆으로 옮겨져 상자 위의 붉은 원(붙은 자리)이 드러남. 단계별 식 한 줄은 t5.js sv56 draw 끝. */
  'sv5-6': {
    title: '붙인 입체의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$256+18\\pi$',
    answerText: '$256+18\\pi$ cm²',
    summary: '겉넓이 = 상자 − 붙은 자리 + 위 입체의 겉면',
    task: '위에 올리는 입체를 바꿔 붙은 자리가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 10,
        title: '붙은 자리는?',
        start: { s56A: 8, s56H: 4, s56R: 3, s56Z: 3, s56T: 0, svYaw: 28, svPitch: 24 },
        cues: [
          { at: 0, say: '상자 위에 원기둥을 붙인 입체예요.', set: { svTop: 'cyl', svMode: 'surf', svShowV: false }, to: { s56T: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '떼어 놓으면 붙었던 원이 드러나요.' }
        ]
      },
      {
        length: 11,
        title: '상자와 붙은 자리',
        cues: [
          { at: 0, say: '아래 상자의 겉넓이는 $2\\times8\\times8+4\\times8\\times4=256$.', step: 1 },
          { at: 5, say: '붙은 자리 $-\\pi\\times3^2=-9\\pi$가 없어져요.', step: 2 }
        ]
      },
      {
        length: 12,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '위 원기둥은 붙은 밑면만 빼고 더해요.', step: 3 },
          { at: 4, say: '옆면과 윗면을 합하면 $27\\pi$예요.' },
          { at: 8, say: '겉넓이 $=256-9\\pi+27\\pi=256+18\\pi$ cm²', step: 4, set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 반구의 겉넓이 (t3.js sv3-2 cutScene half) · 문제 고정: s7R 3 ----------
     함정: 자른 면(원)도 겉면에 더한다. 구 4π×3² = 36π, 곡면 ½ = 18π, 자른 면 π×3² = 9π, 겉넓이 18π+9π = 27π (= 3πr² ✓).
     s7T(0~1): 0 반구 → 1 평평한 면(붉은 원)이 아래로 떼어져 보임. 단계별 식 한 줄은 t3.js sv3-2 draw(G.stepRow). 구의 겉넓이 4πr² 은 앞 장면(sv3-1)에서 본 식을 그대로 씁니다. */
  'sv3-2': {
    title: '반구의 겉넓이',
    tab: 'review',
    answer: '$27\\pi$',
    answerText: '$27\\pi$ cm²',
    summary: '반구 = 곡면(구의 절반) + 자른 면',
    task: '반지름을 바꿔 곡면과 자른 면의 넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 10,
        title: '반구의 겉면',
        start: { s7R: 3, s7T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '반지름 3인 반구예요. 겉면은 무엇일까요?', set: { svShowV: false }, to: { s7T: 0.5 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '구의 겉넓이는 $4\\pi\\times3^2=36\\pi$예요.', step: 1 }
        ]
      },
      {
        length: 9,
        title: '곡면',
        cues: [
          { at: 0, say: '반구의 곡면은 구의 겉넓이의 절반이에요.', step: 2 },
          { at: 4.5, say: '$36\\pi\\times\\frac12=18\\pi$예요.' }
        ]
      },
      {
        length: 10,
        title: '자른 면',
        cues: [
          { at: 0, say: '잘린 평평한 면도 겉면이에요(빠뜨리기 쉬워요).', step: 3 },
          { at: 0.5, to: { s7T: 1 }, dur: 3 },
          { at: 4.5, say: '반지름 3인 원이라 $\\pi\\times3^2=9\\pi$.' }
        ]
      },
      {
        length: 10,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(반구의 겉넓이) = 곡면 + 자른 면', step: 4 },
          { at: 4.5, say: '겉넓이 $=18\\pi+9\\pi=27\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 수조: 남은 물 (t3.js sv3-4, svTankMode remain) · 문제 고정: svBody sph · s8R 3 · s8K 0 (수조 반지름 3 · 높이 6 = 구의 지름) ----------
     수조 π×3²×6 = 54π, 구 4/3×π×3³ = 36π(= 넘친 물), 남은 물 54π − 36π = 18π. 높이가 2r 이라 원뿔 : 구 : 원기둥 = 1 : 2 : 3 (장면 steps 의 식 ⅔πr³ : ⁴⁄₃πr³ : 2πr³ 에서 나옴).
     s8T(넣기·넘치기 0~1): 0 물체가 레일 위 → 0.3 수조 위로 이동 → 0.5 물속에 잠김 → 1 넘친 물이 비커로. 단계별 식은 t3.js tankScene draw 의 G.stepRow(수조 · 물체 두 줄 → 비 → 넘친 물 → 남은 물, 마지막은 svShowV 까지 숨김). */
  'sv3-4': {
    title: '수조에 남은 물',
    label: '남은 물',
    tab: 'review',
    answer: '$18\\pi$',
    answerText: '$18\\pi$ cm³',
    summary: '남은 물 = 수조의 부피 − 물체의 부피',
    task: '넣는 물체를 바꿔 넘친 물과 남은 물이 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '구를 넣어요',
        start: { s8R: 3, s8K: 0, s8T: 0, svYaw: 24, svPitch: 18 },
        cues: [
          { at: 0, say: '물이 가득 찬 수조에 반지름 3인 구를 넣어요.', set: { svTankMode: 'remain', svBody: 'sph', svShowV: false }, to: { s8T: 0.52 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '수조 $54\\pi$, 구는 $\\frac43\\pi\\times3^3=36\\pi$.', step: 1 }
        ]
      },
      {
        length: 9,
        title: '부피의 비',
        cues: [
          { at: 0, say: '수조의 높이는 구의 지름과 같아요.', step: 2 },
          { at: 4.5, say: '원뿔·구·원기둥의 부피비는 $1:2:3$이에요.' }
        ]
      },
      {
        length: 11,
        title: '넘친 물',
        cues: [
          { at: 0, say: '넘친 물의 부피는 넣은 구의 부피와 같아요.', step: 3 },
          { at: 0.5, to: { s8T: 1 }, dur: 4.5 },
          { at: 5.5, say: '넘친 물은 $36\\pi$예요.' }
        ]
      },
      {
        length: 10,
        title: '남은 물은?',
        cues: [
          { at: 0, say: '(남은 물) = (수조) − (물체)', step: 4 },
          { at: 4.5, say: '남은 물 $=54\\pi-36\\pi=18\\pi$ cm³', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 이중원뿔의 겉넓이 (t4.js sv4-3, svMode surf) · 문제 고정: svDbl D (반지름 3 · 높이 4 · 4 · 모선 5 · 5) ----------
     함정: 맞붙은 원(반지름 3)은 겉에 드러나지 않아 더하지 않는다. 옆넓이 π×3×5 = 15π 두 개, 겉넓이 15π+15π = 30π.
     s43T(0~1): 0~0.5 삼각형을 밑변(축) 둘레로 돌려 이중원뿔(높이 4·4 · 반지름 3 · 모선 5·5 가 그려짐), 0.5~1 옆면이 부채꼴 2개로 펼쳐짐. 해설 재생 중에는 정리 탭도 같은 순서(t4.js sv43 의 s.lessonOn)이고,
     펼쳐지면 부채꼴마다 모선 5 · 호의 길이 6π · 옆넓이 15π 와 「맞붙은 원은 겉에 드러나지 않아 밑면은 더하지 않아요」가 그려지며, 합 식 둘째 줄(= 15π + 15π = 30π)은 svShowV 까지 숨깁니다. */
  'sv4-3': {
    title: '이중원뿔의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$30\\pi$',
    answerText: '$30\\pi$ cm²',
    summary: '맞붙은 면은 겉넓이에 더하지 않아요',
    task: '삼각형의 크기를 바꿔 이중원뿔의 옆넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '돌려서 만든 입체',
        start: { s43T: 0, svYaw: 28, svPitch: 20 },
        cues: [
          { at: 0, say: '삼각형을 밑변을 축으로 한 바퀴 돌려요.', set: { svDbl: 'D', svMode: 'surf', svShowV: false }, to: { s43T: 0.25 }, dur: 3 },
          { at: 3.5, say: '반지름 3, 높이 4·4, 모선 5·5인 입체예요.', to: { s43T: 0.5 }, dur: 3 }
        ]
      },
      {
        length: 11,
        title: '맞붙은 면',
        cues: [
          { at: 0, say: '두 원뿔이 맞붙은 원은 겉에 드러나지 않아요.', to: { s43T: 1 }, dur: 5 },
          { at: 6, say: '그래서 밑면은 더하지 않고 옆면만 더해요.', step: 1 }
        ]
      },
      {
        length: 11,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '옆면 하나는 $\\pi\\times3\\times5=15\\pi$예요.', step: 2 },
          { at: 4, say: '위와 아래가 같아서 옆면이 2개예요.' },
          { at: 7.5, say: '겉넓이 $=15\\pi+15\\pi=30\\pi$ cm²', step: 3, set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 복합 입체의 겉넓이 (t4.js sv4-4, svMode surf) · 문제 고정: svTri4 A (반지름 3 · 원뿔 높이 4 · 모선 5) · s44H 4 ----------
     원뿔 + 원기둥 + 반구를 붙인 입체. 붙은 면(원뿔 밑면 · 원기둥의 위·아래 밑면 · 반구의 평평한 면)은 겉에 없어 빠진다. 원뿔 옆넓이 π×3×5 = 15π, 원기둥 옆넓이 2π×3×4 = 24π, 반구의 곡면 2π×3² = 18π, 겉넓이 57π.
     s44T(0~1): 0~0.5 세 입체가 가로로 갈라짐(반지름 3 · 높이 4 · 모선 5 · 각 면의 넓이 이름표), 0.5~1 전개도로 펼침. 해설 재생 중 정리 탭도 같은 순서이고(t4.js sv44 draw 의 s.lessonOn),
     펼쳐진 뒤에는 값이 든 전개도(compNet 의 simple 해제)이며 합 식 둘째 줄은 svShowV 까지 숨깁니다. */
  'sv4-4': {
    title: '복합 입체의 겉넓이',
    label: '겉넓이',
    tab: 'review',
    answer: '$57\\pi$',
    answerText: '$57\\pi$ cm²',
    summary: '겉에 드러난 면만 더해요',
    task: '원뿔·원기둥·반구의 크기를 바꿔 어느 면이 빠지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '세 입체로 나누기',
        start: { s44H: 4, s44T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '원뿔·원기둥·반구를 붙인 입체예요.', set: { svTri4: 'A', svMode: 'surf', svShowV: false }, to: { s44T: 0.5 }, dur: 5 },
          { at: 5.5, say: '붙은 면은 겉에 드러나지 않아 겉넓이에서 빼요.' }
        ]
      },
      {
        length: 11,
        title: '펼치기',
        cues: [
          { at: 0, say: '겉에 드러난 세 면을 펼쳐 봐요.', to: { s44T: 1 }, dur: 5 },
          { at: 6, say: '원뿔 옆면, 원기둥 옆면, 반구의 곡면이에요.', step: 1 }
        ]
      },
      {
        length: 12,
        title: '면마다 넓이',
        cues: [
          { at: 0, say: '원뿔 옆넓이는 $\\pi\\times3\\times5=15\\pi$예요.', step: 1 },
          { at: 4, say: '원기둥 옆넓이는 $2\\pi\\times3\\times4=24\\pi$예요.', step: 2 },
          { at: 8, say: '반구의 곡면은 $18\\pi$예요.', step: 3 }
        ]
      },
      {
        length: 9,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = 세 면의 넓이의 합', step: 4 },
          { at: 4.5, say: '겉넓이 $=15\\pi+24\\pi+18\\pi=57\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 뿔의 부피는 기둥의 1/3 (t2.js sv2-1, svMode2 cube) · 문제 고정: s2A 4 ----------
     장면이 보여 주는 것은 「정육면체를 한 꼭짓점에서 합동인 사각뿔 3개로 나눈 그림」 — 증명이 아니라 눈으로 확인하는 실험 그림이므로 자막은 「그림으로 확인」 어조를 씁니다.
     정육면체 4×4×4 = 64, 사각뿔 하나 ⅓×64 = 64/3 (= ⅓ × 밑넓이 4² × 높이 4 ✓). s2T(0~1): 0~0.5 세 조각이 가로로 갈라짐, 0.5~1 밑면이 아래로 가게 세움. 단계별 식 한 줄은 t2.js sv21 draw(G.stepRow), 3단계 결과는 svShowV 까지 숨김. */
  'sv2-1': {
    title: '뿔의 부피는 왜 ⅓?',
    tab: 'review',
    answer: '$\\frac{64}{3}$',
    answerText: '$\\frac{64}{3}$ cm³',
    summary: '뿔의 부피 $=\\frac13\\times$ 밑넓이 $\\times$ 높이',
    task: '정육면체의 한 모서리를 바꿔 뿔 3개가 늘 정육면체 1개가 되는지 확인해 보세요',
    chapters: [
      {
        length: 11,
        title: '정육면체를 나누면',
        start: { s2A: 4, s2T: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '한 모서리가 4인 정육면체를 나눠 봐요.', set: { svMode2: 'cube', svShowV: false }, to: { s2T: 0.5 }, dur: 5 },
          { at: 5.5, say: '정육면체의 부피는 $4\\times4\\times4=64$.', step: 1 }
        ]
      },
      {
        length: 11,
        title: '뿔 세 개',
        cues: [
          { at: 0, say: '한 꼭짓점에서 합동인 사각뿔 3개로 나뉘어요.', step: 2 },
          { at: 0.5, to: { s2T: 1 }, dur: 4 },
          { at: 5.5, say: '그림으로 확인하면 뿔 3개가 정육면체 1개예요.' }
        ]
      },
      {
        length: 10,
        title: '뿔 하나의 부피',
        cues: [
          { at: 0, say: '사각뿔 하나는 정육면체의 $\\frac13$이에요.', step: 3 },
          { at: 4.5, say: '부피 $=\\frac13\\times64=\\frac{64}{3}$ cm³', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 부채꼴기둥의 겉넓이 (t1.js sv1-2) · 문제 고정: sTh 90 · sR2 4 · sH2 7 (함정: 옆면의 가로에 호만 곱함) ----------
     밑넓이 π×4²×90/360 = 4π, 호 2π×4×90/360 = 2π, 밑면의 둘레 = 호 + 반지름 2개 = 8+2π, 옆넓이 (8+2π)×7 = 56+14π (그림: 28 | 14π | 28), 겉넓이 4π×2 + 56+14π = 56+22π.
     sT2(펼침 0~1). 해설 재생 중에는 정리 탭에도 이름표(4 · 호의 길이 2π · 밑면의 둘레 · 옆넓이 · 밑넓이 4π)를 그리고(t1.js sv12 draw 의 s.lessonOn), 맨 아래 「겉넓이 = … = 56+22π」 줄은 svShowV 까지 숨깁니다. */
  'sv1-2': {
    title: '부채꼴기둥의 겉넓이',
    tab: 'review',
    answer: '$56+22\\pi$',
    answerText: '$56+22\\pi$ cm²',
    summary: '옆면의 가로 = 호 + 반지름 2개',
    task: '중심각과 반지름을 바꿔 옆면의 가로가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '펼쳐 보기',
        start: { sTh: 90, sR2: 4, sH2: 7, sT2: 0, svYaw: 78, svPitch: 22 },
        cues: [
          { at: 0, say: '반지름 4, 중심각 90°인 부채꼴 기둥이에요.', set: { svShowV: false }, to: { sT2: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '펼치면 밑면 2개와 옆면 직사각형이 나와요.' }
        ]
      },
      {
        length: 10,
        title: '밑넓이',
        cues: [
          { at: 0, say: '밑면은 부채꼴이고 넓이는 $4\\pi$예요.', step: 1 },
          { at: 4.5, say: '밑면이 2개라서 이 넓이를 두 번 더해요.' }
        ]
      },
      {
        length: 12,
        title: '옆면의 가로',
        cues: [
          { at: 0, say: '옆면의 가로는 호만이 아니라 둘레 전체예요.', step: 2 },
          { at: 4.5, say: '호 $2\\pi$에 반지름 4, 4를 더해 $8+2\\pi$.' },
          { at: 8.5, say: '옆넓이는 $28+14\\pi+28=56+14\\pi$예요.' }
        ]
      },
      {
        length: 10,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = 밑넓이 × 2 + 옆넓이', step: 3 },
          { at: 4.5, say: '겉넓이 $=8\\pi+56+14\\pi=56+22\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  },

  /* ---------- 기둥 종합: 직사각형 + 반원 밑면의 겉넓이 (t1.js sv1-5, svMode surf) · 문제 고정: sW 4 · sRr 2 · sH5 5 ----------
     밑넓이 16+2π (직사각형 4×4 + 반원 ½π×2²), 밑면의 둘레(붙인 변 4 는 뺌) 4+4+2π+4 = 12+2π, 옆넓이 (12+2π)×5 = 60+10π (그림: 20 | 20 | 10π | 20), 겉넓이 (16+2π)×2 + 60+10π = 92+14π.
     sT5(펼침 0~1). 해설 재생 중 정리 탭에 이름표를 그리고(t1.js sv15 draw 의 s.lessonOn), 맨 아래 겉넓이 줄은 svShowV 까지 숨깁니다. 부피 해설은 아직 없음. */
  'sv1-5': {
    title: '직사각형과 반원 기둥',
    label: '겉넓이',
    tab: 'review',
    answer: '$92+14\\pi$',
    answerText: '$92+14\\pi$ cm²',
    summary: '밑면의 둘레에는 호가 들어가요',
    task: '직사각형 부분과 반원의 크기를 바꿔 겉넓이가 어떻게 달라지는지 해 보세요',
    chapters: [
      {
        length: 11,
        title: '펼쳐 보기',
        start: { sW: 4, sRr: 2, sH5: 5, sT5: 0, svYaw: 28, svPitch: 22 },
        cues: [
          { at: 0, say: '밑면이 직사각형에 반원을 붙인 기둥이에요.', set: { svMode: 'surf', sv15Started: true, svShowV: false }, to: { sT5: 1 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '펼치면 밑면 2개와 옆면이 나와요.' }
        ]
      },
      {
        length: 10,
        title: '밑넓이',
        cues: [
          { at: 0, say: '밑면의 넓이는 직사각형과 반원을 더해요.', step: 1 },
          { at: 4.5, say: '밑넓이는 $16+2\\pi$예요.' }
        ]
      },
      {
        length: 12,
        title: '옆면의 가로',
        cues: [
          { at: 0, say: '밑면의 둘레에는 반원의 호가 들어가요.', step: 2 },
          { at: 4.5, say: '붙인 변은 빼고 $4+4+2\\pi+4=12+2\\pi$.' },
          { at: 8.5, say: '옆넓이는 $20+20+10\\pi+20=60+10\\pi$.' }
        ]
      },
      {
        length: 10,
        title: '겉넓이는?',
        cues: [
          { at: 0, say: '(겉넓이) = 밑넓이 × 2 + 옆넓이', step: 3 },
          { at: 4.5, say: '겉넓이 $=32+4\\pi+60+10\\pi=92+14\\pi$ cm²', set: { svShowV: true } }
        ]
      }
    ]
  }
});
