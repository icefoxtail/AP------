/* ==========================================================================
   원과 부채꼴 · 해설(lesson) (lesson.js)
   window.APL_LESSONS['g7-circle-sector'] = { '<장면 id>': 해설, ... }
   해설 = 쇼츠 규칙을 지키는 장(8~15초) 2~6개를 이어 붙인 것. 형식: kit/apl-video-core.js 맨 위 주석, docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 「해설(lesson)」.
   - 자막은 장면의 탐구 질문·정리 단계(steps)·규칙에서만 가져오고 새 수학 주장을 만들지 않습니다. 기호(r, l)는 쓰기 전에 뜻을 말합니다. 정답은 마지막 장에서만.
   - 이 파일의 해설은 tools/lessons.g7-circle-sector.test.mjs 가 검사합니다(상태값 표 SCENE_STATE · 자막 숫자 재계산 FACTS · 정답 조기 노출 · 장면 소스). 해설을 더하면 그 표에도 적습니다.
   - 장면 코드에는 재생 중(s.lessonOn)·진입 화면(s.lessonEntry)에서만 바뀌는 것만 더했습니다: 정답을 아끼는 hold(f01 f1_*_show · f03 f3Show · f04 f4_*_show · rolling rlShow · swept gtShow · html csShowS), 정리 탭 0단계 진입 그림·칩 숨김(basic.js), sectorSpec 의 div·ref(원을 같은 조각으로 나눈 점선 · 원주/원의 넓이 라벨), z2 점 P 라벨 정확한 값만.
   - 해설로 대체한 쇼츠: 1209, f4-swirl, f1-ss2, f3-leaf-len, f5-sq4, rl-rect, gt-kennel (video.js 에는 1210 만 남음).
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};

window.APL_LESSONS['g7-circle-sector'] = {
  /* ---------- 부채꼴 넓이 (g7-circle-sector.html proofScene('sector') z3-sectorProof) · 3장 30초 ----------
     r=6, 중심각 120°: 조각 수 Kof = max(2, 2·⌈120/20⌉) = 12. 호의 길이 l = 2π·6·120/360 = 4π, 가로 = l÷2 = 2π, 세로 = r = 6, 넓이 S = ½·6·4π = 12π (= π·6²·120/360 = 36π/3 ✓).
     (90° 는 가로가 3π/2 라 분수가 되어 120° 를 씁니다.) csT(조각을 가로로 미는 정도 0~100): 0 → 20(나눔) → 54(맞물림, 55 부터 가로·세로·넓이 라벨이 그려짐) → 100.
     장면은 csT ≥ 55 에서 결론 라벨 「S = ½rl = 12π cm²」을 바로 그리므로, 재생 동안(s.lessonOn)은 해설이 csShowS 를 켤 때까지 그 라벨만 아낍니다(g7-circle-sector.html proofScene).
     csShowS 는 첫 장 at:0 칸에서 false 로 시작합니다(validateLesson 규칙: set 키는 첫 장 at:0 에 시작값 필수) — 다시 보기에서 앞선 재생이 남긴 true 가 새지 않게. */
  'z3-sectorProof': {
    title: '부채꼴 넓이는 왜 ½rl?',
    answer: '$12\\pi$',
    answerText: '$12\\pi$ cm²',
    summary: '부채꼴 넓이 $S=\\frac12 rl$',
    task: '반지름과 중심각을 바꿔도 가로가 $l$의 절반, 세로가 $r$인지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '조각으로 나누기',
        start: { csR: 6, csS: 120, csT: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm, 중심각 120°인 부채꼴이에요.', set: { csShowS: false }, to: { csT: 20 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '호 길이는 $l=4\\pi$ cm. 12조각을 위아래로 번갈아 놓아요.' }
        ]
      },
      {
        length: 9,
        title: '가로로 밀어 맞물리기',
        cues: [
          { at: 0, say: '조각을 **가로로 밀어** 서로 맞물리게 해요.', to: { csT: 54 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '직사각형에 가까운 모양이 돼요.' }
        ]
      },
      {
        length: 12,
        title: '그래서 넓이는?',
        cues: [
          { at: 0, say: '가로는 호 $l$의 절반, 세로는 반지름 $r$.', to: { csT: 100 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '호 $l=4\\pi$ cm이므로 가로는 $2\\pi$, 세로는 6 cm.' },
          { at: 9, say: '넓이 $=\\frac12\\times6\\times4\\pi=12\\pi$ cm²', set: { csShowS: true } }
        ]
      }
    ]
  },

  /* ---------- 원의 넓이 (g7-circle-sector.html proofScene('circle') z3-circleProof) · 3장 30초 ----------
     r=6, 조각 16개(csN 기본값). 원주 2π·6 = 12π, 가로 = 원주÷2 = 6π(= πr), 세로 = r = 6, 넓이 = 6π × 6 = 36π (= πr²).
     csT(조각을 가로로 미는 정도 0~100): 0 → 20(나눔) → 54(맞물림, 55 부터 가로·세로·넓이 라벨이 그려짐) → 100. 결론 라벨 「S = πr² = 36π」은 해설이 csShowS 를 켤 때까지 아낌(proofScene). */
  'z3-circleProof': {
    title: '원의 넓이는 왜 πr²?',
    answer: '$36\\pi$',
    answerText: '$36\\pi$ cm²',
    summary: '원의 넓이 $S=\\pi r^2$',
    task: '반지름이나 조각 수를 바꿔도 가로가 원주의 절반, 세로가 반지름인지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '조각으로 나누기',
        start: { csR: 6, csT: 0 },
        cues: [
          { at: 0, say: '반지름 $r$이 6 cm인 원을 **16조각**으로 나눠요.', set: { csShowS: false, csN: 16 }, to: { csT: 20 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '원주는 $12\\pi$ cm. 조각을 위아래로 번갈아 놓아요.' }
        ]
      },
      {
        length: 9,
        title: '가로로 밀어 맞물리기',
        cues: [
          { at: 0, say: '조각을 **가로로 밀어** 서로 맞물리게 해요.', to: { csT: 54 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '직사각형에 가까운 모양이 돼요.' }
        ]
      },
      {
        length: 12,
        title: '그래서 넓이는?',
        cues: [
          { at: 0, say: '가로는 원주의 절반, 세로는 반지름 $r$.', to: { csT: 100 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '가로는 $6\\pi$ cm, 세로는 6 cm.' },
          { at: 9, say: '넓이 $=6\\pi\\times6=36\\pi$ cm²', set: { csShowS: true } }
        ]
      }
    ]
  },

  /* ---------- 부채꼴의 호의 길이와 넓이 (basic.js 1209, sectorSpec) · 해설 둘(호의 길이 / 넓이) · tab:'review' ----------
     r=12, θ=120°(교재 수치 = 장면 기본값). 원주 2π·12 = 24π, 원의 넓이 π·12² = 144π, 360÷120 = 3 → 부채꼴은 원의 1/3.
     호 l = 24π×1/3 = 8π (cm), 넓이 S = 144π×1/3 = 48π (cm²) (장면 steps ① 2π×12×120/360=8π ② π×12²×120/360=48π ✓).
     정리 탭을 쓰는 이유: 탐구 탭은 호·넓이 값이 처음부터 다 보이고(정답 노출) 손잡이가 그려지지만, 정리 탭은 구하는 값을 「?」로 두고 step 1(호)·2(넓이)에서만 보입니다. 같은 값(r, θ)의 같은 문제입니다.
     장면(basic.js sectorSpec)에 재생 중에만(s.lessonOn) 그리는 것을 더했습니다: div(0~1) 원을 θ 와 같은 중심각의 조각으로 나눈 점선(120° → 3조각), ref 기준 라벨(1 원주 24π cm · 2 원의 넓이 144π cm²).
     b1209_ref 는 첫 장 at:0 에서 0 으로 시작합니다(두 해설이 서로의 값을 이어받지 않게). 첫 장의 움직임은 div(0→1)입니다. */
  '1209': [
    {
      title: '부채꼴의 호의 길이',
      label: '호의 길이',
      tab: 'review',
      answer: '$8\\pi$',
      answerText: '$8\\pi$ cm',
      summary: '호의 길이 = 원주 × $\\frac{\\theta}{360}$',
      task: '반지름과 중심각을 바꿔 호의 길이가 원주의 몇 분의 몇인지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '원의 몇 분의 몇?',
          start: { b1209_r: 12, b1209_th: 120, b1209_div: 0 },
          cues: [
            { at: 0, say: '반지름 12 cm, 중심각 $\\theta$는 120°인 부채꼴이에요.', set: { b1209_ref: 0 }, step: 0 },
            { at: 0.2, to: { b1209_div: 1 }, dur: 3.5, ease: 'smooth' },
            { at: 4.5, say: '한 바퀴 360°에는 120°가 3개. 부채꼴은 원의 $\\frac13$.' }
          ]
        },
        {
          length: 9,
          title: '원주 구하기',
          cues: [
            { at: 0, say: '원 한 바퀴의 길이를 **원주**라 해요.' },
            { at: 4.5, say: '원주 $=2\\pi\\times12=24\\pi$ cm', set: { b1209_ref: 1 } }
          ]
        },
        {
          length: 10,
          title: '호의 길이는?',
          cues: [
            { at: 0, say: '호의 길이 $l$은 원주의 $\\frac13$이에요.' },
            { at: 4, say: '$l=24\\pi\\times\\frac13$' },
            { at: 7, say: '호의 길이 $l=8\\pi$ cm', step: 1 }
          ]
        }
      ]
    },
    {
      title: '부채꼴의 넓이',
      label: '넓이',
      tab: 'review',
      answer: '$48\\pi$',
      answerText: '$48\\pi$ cm²',
      summary: '넓이 = 원의 넓이 × $\\frac{\\theta}{360}$',
      task: '반지름과 중심각을 바꿔 넓이가 원의 넓이의 몇 분의 몇인지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '원의 몇 분의 몇?',
          start: { b1209_r: 12, b1209_th: 120, b1209_div: 0 },
          cues: [
            { at: 0, say: '반지름 12 cm, 중심각 $\\theta$는 120°인 부채꼴이에요.', set: { b1209_ref: 0 }, step: 0 },
            { at: 0.2, to: { b1209_div: 1 }, dur: 3.5, ease: 'smooth' },
            { at: 4.5, say: '한 바퀴 360°에는 120°가 3개. 부채꼴은 원의 $\\frac13$.' }
          ]
        },
        {
          length: 9,
          title: '원의 넓이 구하기',
          cues: [
            { at: 0, say: '먼저 원 전체의 넓이를 구해요.' },
            { at: 4.5, say: '원의 넓이 $=\\pi\\times12^2=144\\pi$ cm²', set: { b1209_ref: 2 } }
          ]
        },
        {
          length: 10,
          title: '넓이는?',
          cues: [
            { at: 0, say: '부채꼴의 넓이 $S$는 원의 넓이의 $\\frac13$이에요.' },
            { at: 4, say: '$S=144\\pi\\times\\frac13$' },
            { at: 7, say: '넓이 $S=48\\pi$ cm²', step: 2 }
          ]
        }
      ]
    }
  ],

  /* ---------- 원 안의 S자 곡선 → 반원 (f04.js f4-swirl, 탐구 탭) · 3장 31초 ----------
     R=6(큰 원의 반지름, 장면 기본값), 작은 반원의 반지름 r=R/2=3, 넓이 = ½×π×6² = 18π (장면 steps ④).
     t(f4_swirl_t) 구간: 0~0.12 처음 모양(R=6·r=3 라벨) · 0.12~0.30 옮길 반원 ① 표시 · 0.38~0.74 중심 기준 180° 회전 · 0.80~0.96 결과 라벨(「원의 반 : 18π」·아래 캡션·칩).
     결과(정답) 라벨·캡션·칩은 재생 중(s.lessonOn)에 해설이 f4_swirl_show 를 켤 때까지 아낍니다(f04.js lessonHold). 결과가 나올 때 「r=3」 라벨이 「원의 반 : 18π」와 겹치므로(VIDEO_FINDINGS #2) 재생 중에는 결과가 나오기 시작하면 「r=3」을 지웁니다(hideRes).
     처음 모양 → 조각 찾기 → 돌려 끼우기 → 결론의 4단계(steps)를 3장으로: ① 처음 모양+조각 ② 돌려 끼우기 ③ 반원의 넓이. */
  'f4-swirl': {
    title: 'S자 곡선은 어떤 도형?',
    answer: '$18\\pi$',
    answerText: '$18\\pi$ cm²',
    summary: '색칠한 부분 = 큰 반원 $\\frac12\\pi R^2$',
    task: '큰 원의 반지름 R을 바꿔도 색칠한 부분이 큰 반원이 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '옮길 조각 찾기',
        start: { f4_swirl_R: 6, f4_swirl_t: 0 },
        cues: [
          { at: 0, say: '큰 원의 반지름 $R$은 6, 작은 반원의 반지름 $r$은 3.', set: { f4_swirl_show: false }, to: { f4_swirl_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4, say: '오른쪽 아래 반원 ①은 파인 곳과 **크기가 같아요**.' }
        ]
      },
      {
        length: 10,
        title: '180° 돌려 끼우기',
        cues: [
          { at: 0, say: '큰 원의 **중심**을 기준으로 **180°** 돌려요.', to: { f4_swirl_t: 0.78 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '반원 ①이 파인 곳에 꼭 맞게 끼워져요.' }
        ]
      },
      {
        length: 12,
        title: '색칠한 부분의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분은 큰 **반원**이 돼요.', to: { f4_swirl_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '반원의 넓이는 반지름 $R$인 원의 넓이의 반.' },
          { at: 8.5, say: '넓이 $=\\frac12\\times\\pi\\times6^2=18\\pi$ cm²', set: { f4_swirl_show: true } }
        ]
      }
    ]
  },

  /* ---------- 부채꼴에서 반원 파내기 · 넓이 (f01.js f1-ss2, 탐구 탭, mode 0) · 3장 31초 ----------
     a=6(정사각형의 한 변 = 부채꼴의 반지름, 장면 기본값). 부채꼴 π·6²·90/360 = 9π, 파낸 반원(지름 6 → 반지름 3) π·3²·1/2 = 9π/2, 색칠한 부분 = 9π − 9π/2 = 9π/2 (장면 steps).
     t(f1_ss2_t) 구간: 0~0.12 처음 모양(「전체 (부채꼴) 9π」 캡션) · 0.12~0.30 파낼 반원(주황) 표시 · 0.38~0.74 반원을 옆으로 꺼냄(0.6 부터 「파낸 부분 (반원) 9π/2」 캡션) · 0.80~0.96 결과(캡션·칩).
     색칠한 부분의 넓이(정답)는 파낸 반원의 넓이와 같아서(9π/2) 정답을 식 전체로 둡니다(answer: 9π − 9π/2 = 9π/2). 결과 캡션·칩은 해설이 f1_ss2_show 를 켤 때까지 아낍니다(f01.js lessonHold).
     장면은 넓이(mode 0)와 둘레(mode 1)를 함께 묻지만, 둘레는 아래 배열의 두 번째 해설(label 「둘레」, 정리 탭 step 으로 시작하는 첫 장 — kit 의 첫 장 step/part 규칙이 필요)로 따로 있습니다. */
  'f1-ss2': [
    {
      title: '부채꼴 − 반원의 넓이',
      label: '넓이',
      answer: '$9\\pi-\\frac{9\\pi}{2}=\\frac{9\\pi}{2}$',
      answerText: '$9\\pi-\\frac{9\\pi}{2}=\\frac{9\\pi}{2}$ cm²',
      summary: '색칠한 부분 = 부채꼴 − 반원',
      task: '한 변 a를 바꿔도 색칠한 부분이 (부채꼴 − 반원)으로 구해지는지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '파낼 반원 찾기',
          start: { f1_ss2_a: 6, f1_ss2_t: 0 },
          cues: [
            { at: 0, say: '부채꼴에서 **반원**(주황)을 파냈어요.', set: { f1_ss2_mode: 0, f1_ss2_show: false }, to: { f1_ss2_t: 0.3 }, dur: 3.5, ease: 'smooth' },
            { at: 4.5, say: '반원의 지름은 부채꼴의 한 변, 6 cm예요.' }
          ]
        },
        {
          length: 10,
          title: '두 넓이 구하기',
          cues: [
            { at: 0, say: '부채꼴의 넓이 $=\\pi\\times6^2\\times\\frac{90}{360}=9\\pi$', to: { f1_ss2_t: 0.74 }, dur: 4.5, ease: 'smooth' },
            { at: 5, say: '반원(반지름 3)의 넓이 $=\\pi\\times3^2\\times\\frac12=\\frac{9\\pi}{2}$' }
          ]
        },
        {
          length: 12,
          title: '빼서 구하기',
          cues: [
            { at: 0, say: '색칠한 부분 = 부채꼴 − 반원', to: { f1_ss2_t: 0.96 }, dur: 4, ease: 'smooth' },
            { at: 4.5, say: '부채꼴 $9\\pi$에서 반원 $\\frac{9\\pi}{2}$를 빼요.' },
            { at: 8.5, say: '$9\\pi-\\frac{9\\pi}{2}=\\frac{9\\pi}{2}$ cm²', set: { f1_ss2_show: true } }
          ]
        }
      ]
    },
    /* ---------- 부채꼴에서 반원 파내기 · 둘레 (f01.js f1-ss2, 정리 탭, mode 1) · 3장 30초 · kit 규칙 필요(첫 장이 step 으로 시작) ----------
       a=6. 둘레 = 반원의 호 2π·3·½ = 3π + 부채꼴의 호 2π·6·90/360 = 3π + 한 변 6 = 6π+6 (cm) (장면 stepsP). 정리 탭 step n 에서 n 번째 경계가 그려지고 라벨이 나옵니다(step 4 에서 합계).
       움직이는 값(to)이 없는 장면이라 첫 장은 step 칸(at:0)으로 시작합니다. */
    {
      title: '부채꼴−반원의 둘레',
      label: '둘레',
      tab: 'review',
      answer: '$6\\pi+6$',
      answerText: '$6\\pi+6$ cm',
      summary: '둘레 = 반원의 호 + 부채꼴의 호 + 한 변',
      task: '한 변 a를 바꿔도 같은 세 부분의 합으로 둘레가 구해지는지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '반원의 호',
          start: { f1_ss2_a: 6 },
          cues: [
            { at: 0, say: '둘레를 이루는 선을 하나씩 따라가 봐요.', set: { f1_ss2_mode: 1, f1_ss2_show: false }, step: 1 },
            { at: 4.5, say: '반원의 지름은 6 cm, 반지름은 3. 호는 $2\\pi\\times3\\times\\frac12=3\\pi$.' }
          ]
        },
        {
          length: 10,
          title: '부채꼴의 호',
          cues: [
            { at: 0, say: '다음은 부채꼴의 호. 반지름은 한 변 6 cm.', step: 2 },
            { at: 5, say: '직각이니 원의 $\\frac14$, $2\\pi\\times6\\times\\frac14=3\\pi$.' }
          ]
        },
        {
          length: 11,
          title: '한 변을 더하면',
          cues: [
            { at: 0, say: '정사각형의 한 변도 둘레예요.', step: 3 },
            { at: 4, say: '둘레 = 호 + 호 + 한 변' },
            { at: 7.5, say: '$3\\pi+3\\pi+6=6\\pi+6$ cm', step: 4 }
          ]
        }
      ]
    }
  ],

  /* ---------- 정사각형 안의 잎 모양 · 둘레 (f03.js f3-leaf-len, 탐구 탭) · 3장 31초 ----------
     a=6(한 변 = 두 호의 반지름, 장면 기본값). 호 하나 2π·6·90/360 = 3π, 둘 3π+3π = 6π (= 반지름 6 원 둘레의 절반 = 반원의 호). 장면 steps 4단계.
     f3t 구간: 0~0.11 정사각형·잎 · 0.12~0.24 부채꼴 복사본 나타남(90° 라벨) · 0.30~0.48 노랑 부채꼴 제자리 회전 · 0.52~0.78 가로로 밀어 붙임 · 0.84~0.97 「90° + 90° = 180°」 · 「3π + 3π = 6π cm」(정답 줄).
     정답 줄과 아래 칩(「둘레 = 6π cm (반원의 호)」)은 재생 중 해설이 f3Show 를 켤 때까지 아낍니다(f03.js baseCtx hold). 「90° + 90° = 180°」 줄은 과정이라 그대로 둡니다. */
  'f3-leaf-len': {
    title: '잎 모양 둘레는 호 두 개',
    answer: '$6\\pi$',
    answerText: '$6\\pi$ cm',
    summary: '잎 모양 둘레 = 반원의 호 = $3\\pi+3\\pi$',
    task: '한 변 a를 바꿔도 잎 모양 둘레가 반지름 a인 반원의 호가 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '둘레는 호 두 개',
        start: { f3a: 6, f3t: 0 },
        cues: [
          { at: 0, say: '색칠한 잎 모양의 둘레는 **호 2개**예요.', set: { f3Show: false }, to: { f3t: 0.24 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '두 호는 모두 중심각이 **90°**인 부채꼴의 호예요.' }
        ]
      },
      {
        length: 10,
        title: '두 호를 이어 붙이기',
        cues: [
          { at: 0, say: '노랑 부채꼴을 돌리고 **가로로 밀어** 이어 붙여요.', to: { f3t: 0.78 }, dur: 6, ease: 'smooth' },
          { at: 6.5, say: '두 호가 한 줄로 이어져요.' }
        ]
      },
      {
        length: 12,
        title: '둘레는?',
        cues: [
          { at: 0, say: '중심각 $90°+90°=180°$, 반원의 호예요.', to: { f3t: 1 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '호 하나의 길이는 $2\\pi\\times6\\times\\frac{90}{360}$.' },
          { at: 8.5, say: '둘레 $=3\\pi+3\\pi=6\\pi$ cm', set: { f3Show: true } }
        ]
      }
    ]
  },

  /* ---------- 원기둥 4개를 묶은 끈 (f05.js f5-sq4, 탐구 탭) · 3장 31초 ----------
     f5A=3(반지름, 장면 기본값). 직선 부분 = 중심 사이 3+3=6 × 4개 = 24, 곡선 부분 = 반지름 3·중심각 90° 호 4개 → 중심각의 합 90°×4=360° → 원 하나의 둘레 2π×3 = 6π. 끈 = 24 + 6π (cm).
     f5T 구간: 0~0.02 처음(「r=3」「90°」) · 0.02~0.34 직선 부분(t≈0.19 부터 「6」 4개, t=0.34 「직선 부분 / 6×4=24」) · 0.34~0.42 멈춤 · 0.42~0.97 곡선 모으기(t=0.97 「원 하나의 둘레 2π×3=6π cm」「중심각의 합 90°×4=360°」).
     깨끗한 값 f5T 0~0.74, 0.76~1(0.75 하나만 「90°」끼리 맞닿음 → 움직이며 지나감). 장면은 끈 전체 길이(24+6π)를 그림에 그리지 않으므로(정리 탭·패널에만) 숨길 것이 없습니다. */
  'f5-sq4': {
    title: '끈의 길이는?',
    answer: '$24+6\\pi$',
    answerText: '$24+6\\pi$ cm',
    summary: '끈 = 직선 부분 + 원 하나의 둘레',
    task: '반지름 r을 바꿔 직선 부분과 곡선 부분이 어떻게 변하는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '직선 부분',
        start: { f5A: 3, f5T: 0 },
        cues: [
          { at: 0, say: '끈은 **직선 부분**과 **곡선 부분**으로 나뉘어요.', to: { f5T: 0.34 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '직선 부분은 6 cm가 4개, $6\\times4=24$ cm.' }
        ]
      },
      {
        length: 10,
        title: '곡선 부분 모으기',
        cues: [
          { at: 0, say: '곡선 부분은 반지름 3, 중심각 90°인 호 4개.', to: { f5T: 0.9 }, dur: 6.5, ease: 'smooth' },
          { at: 6.5, say: '호 4개를 한곳으로 모아 볼게요.' }
        ]
      },
      {
        length: 12,
        title: '끈의 길이',
        cues: [
          { at: 0, say: '중심각의 합 $90°\\times4=360°$, 원 하나가 돼요.', to: { f5T: 1 }, dur: 2.5, ease: 'smooth' },
          { at: 4, say: '곡선 부분은 원 하나의 둘레 $2\\pi\\times3=6\\pi$ cm.' },
          { at: 8, say: '끈의 길이 $=24+6\\pi$ cm' }
        ]
      }
    ]
  },

  /* ---------- 중심각과 호의 길이 · x+y (basic.js 1102, 교재 11-02) · 3장 31초 · tab:'review' ----------
     u=1(5°에 해당하는 호 1 cm → 1°당 0.2 cm), 왼쪽 30° ↔ 6 cm, 오른쪽 45° ↔ x, 아래쪽 y° ↔ 15 cm. 장면 steps ① 6 : x = 30 : 45 → x = 9 ② 6 : 15 = 30 : y → y = 75 ③ x + y = 9 + 75 = 84.
     정리 탭을 쓰는 이유: 정리 탭은 구하는 값을 「x cm」·「y°」로 두고 step 1(x)·2(y)에서만 보여 주고 그림도 탐구 탭보다 크게 그립니다(탐구 탭은 x·y 가 처음부터 보임). 같은 값의 같은 문제입니다.
     첫 장의 움직임: 오른쪽 중심각 b1102_t2 를 45° → 60°(5° 계단) → 45° 로 오갑니다. 호가 중심각을 따라 같은 비율로 늘어나고 줄어드는 것을 보여 주는 것이 정비례의 핵심이고, 끝 값이 교재 수치(45°)와 같아서 이어지는 풀이의 그림이 바뀌지 않습니다.
     값(t2)이 바뀌면 steps 글이 달라져 셸이 step 을 1 로 되돌리므로(VIDEO_FINDINGS #20) 움직이는 동안 「x = 10 cm」「x = 11 cm」처럼 호의 길이가 중심각을 따라 변하는 값이 보이고(그대로 정비례의 모습), 움직임이 끝난 5.5초 칸에서 step 0 으로 되돌립니다.
     b1102_u·t1·y 는 start 에 적어 교재 수치를 못 박습니다. step 0 에는 합 칩(x+y=84)을 그리지 않습니다(basic.js build 의 step 0 칩 숨김). */
  '1102': {
    title: '호는 중심각에 정비례',
    answer: '$84$',
    answerText: '$x+y=84$',
    summary: '(호) : (호) = (중심각) : (중심각)',
    task: '중심각이나 호의 길이를 바꿔 x+y가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '중심각이 커지면 호도',
        start: { b1102_u: 1, b1102_t1: 30, b1102_t2: 45, b1102_y: 75 },
        cues: [
          { at: 0, say: '오른쪽 중심각을 키우면 호도 길어져요.', set: { b1102_show: false }, to: { b1102_t2: 60 }, dur: 2.5, ease: 'linear', snap: 5 },
          { at: 3, to: { b1102_t2: 45 }, dur: 2.5, ease: 'linear', snap: 5 },
          { at: 5.5, say: '한 원에서 호의 길이는 중심각에 **정비례**해요.', step: 0 }
        ]
      },
      {
        length: 10,
        title: 'x 구하기',
        cues: [
          { at: 0, say: '왼쪽은 30°, 호 6 cm. 오른쪽 호의 길이를 $x$라 해요.' },
          { at: 3.5, say: '호 : 호 = 중심각 : 중심각, $6:x=30:45$', step: 1, set: { b1102_show: true } },
          { at: 7, say: '그래서 $x=9$ cm예요.' }
        ]
      },
      {
        length: 12,
        title: 'y 구하고 더하기',
        cues: [
          { at: 0, say: '아래쪽 부채꼴은 호가 15 cm, 중심각이 $y$°.' },
          { at: 4, say: '$6:15=30:y$이므로 $y=75$', step: 2 },
          { at: 8, say: '$x+y=9+75=84$', step: 3 }
        ]
      }
    ]
  },

  /* ---------- 넓이로 중심각 구하기 (basic.js 1609, sectorSpec 교재 16-09) · 3장 31초 · tab:'review' ----------
     r=9, 부채꼴 넓이 S=27π(주어짐), 원의 넓이 π·9²=81π, 27π÷81π = 1/3, 중심각 = 360°×1/3 = 120°(장면 steps ① 27π÷81π=1/3 ② 360°×1/3=120°).
     정리 탭: 구하는 중심각을 「?°」로 두고 step 2 에서 보입니다. 장면(basic.js sectorSpec)의 재생 전용 그림: div 원을 이 부채꼴과 같은 조각으로 나눈 점선(3조각), ref 2 = 원의 넓이 라벨. */
  '1609': {
    title: '넓이로 중심각 구하기',
    answer: '$120°$',
    answerText: '$120°$',
    summary: '중심각 = 360° × (부채꼴 ÷ 원의 넓이)',
    task: '넓이나 반지름을 바꿔 부채꼴이 원의 몇 분의 몇인지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '원을 같은 조각으로',
        start: { b1609_r: 9, b1609_th: 120, b1609_div: 0 },
        cues: [
          { at: 0, say: '반지름 9 cm, 부채꼴의 넓이는 $27\\pi$ cm².', set: { b1609_ref: 0 }, step: 0 },
          { at: 0.2, to: { b1609_div: 1 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '이 부채꼴과 같은 조각으로 원을 나눠 보면?' }
        ]
      },
      {
        length: 9,
        title: '원의 넓이와 비교',
        cues: [
          { at: 0, say: '먼저 원 전체의 넓이를 구해요.' },
          { at: 4.5, say: '원의 넓이 $=\\pi\\times9^2=81\\pi$ cm²', set: { b1609_ref: 2 } }
        ]
      },
      {
        length: 10,
        title: '중심각은?',
        cues: [
          { at: 0, say: '$27\\pi\\div81\\pi=\\frac13$, 부채꼴은 원의 $\\frac13$.', step: 1 },
          { at: 4, say: '중심각은 한 바퀴 360°의 $\\frac13$이에요.' },
          { at: 7, say: '중심각 $=360°\\times\\frac13=120°$', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 직사각형을 굴릴 때 점 A가 움직인 거리 (rolling.js rl-rect, 탐구 탭) · 3장 31초 ----------
     장면 기본값 AB=3, AD=4, 대각선 BD=5, 90°씩 3번 회전(각 1/3). 호 ㉠ 반지름 3 → 2π·3·90/360 = 3π/2, ㉡ 반지름 5 → 5π/2, ㉢ 반지름 4 → 2π, 합 = 3π/2 + 5π/2 + 2π = 6π (cm).
     rlT 구간: 0 처음 · 0~1/3 ㉠(점 B 중심, r=3) · 1/3~2/3 ㉡(점 C 중심, r=5) · 2/3~1 ㉢(점 D 중심, r=4) · 1 에서 세 호 모두. rlT 가 정확히 k/3 에서 회전이 90° 로 끝납니다(0.33 은 89°).
     움직인 거리의 합(정답)은 아래 띠의 제목(「점 A가 움직인 거리 = … = 6π cm」)과 요약에 나오므로, 재생 중에는 해설이 rlShow 를 켤 때까지 그 합만 아낍니다(rolling.js view hold). 호마다 값(3π/2 · 5π/2 · 2π)은 회전이 끝날 때 띠 조각에 나오며 그대로 둡니다. */
  'rl-rect': {
    title: '점 A가 움직인 거리는?',
    answer: '$6\\pi$',
    answerText: '$6\\pi$ cm',
    summary: '점 A가 움직인 거리 = 호 3개의 합',
    task: 'AB, AD의 길이를 바꿔 점 A가 움직인 거리를 다시 구해 보세요',
    chapters: [
      {
        length: 9,
        title: '굴리면 호가 생겨요',
        start: { rlT: 0 },
        cues: [
          { at: 0, say: '직사각형을 **굴리면** 점 A가 **호**를 그려요.', set: { rlShow: false }, to: { rlT: 0.3334 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '첫 번째는 점 B가 중심, 반지름 3 cm, 중심각 90°.' }
        ]
      },
      {
        length: 10,
        title: '다음 회전',
        cues: [
          { at: 0, say: '다음은 점 C가 중심, 반지름은 대각선 5 cm.', to: { rlT: 0.6667 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '이번에도 중심각은 90°예요.' }
        ]
      },
      {
        length: 12,
        title: '세 호를 더하면',
        cues: [
          { at: 0, say: '세 번째는 반지름 4 cm, 중심각 90°.', to: { rlT: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '호는 $\\frac{3\\pi}{2}$, $\\frac{5\\pi}{2}$, $2\\pi$.' },
          { at: 8.5, say: '거리 $=\\frac{3\\pi}{2}+\\frac{5\\pi}{2}+2\\pi=6\\pi$ cm', set: { rlShow: true } }
        ]
      }
    ]
  },

  /* ---------- 정사각형 개집에 묶인 강아지 (swept.js gt-kennel, 탐구 탭) · 3장 31초 ----------
     gtQ=2(개집 한 변)·gtL=4(끈) 장면 기본값. 부채꼴 셋: 모서리 D 를 도는 작은 초록(r=2, 90°), 큰 주황(r=4, 270°), 모서리 B 를 도는 작은 파랑(r=2, 90°). 큰 부채꼴 π·4²·270/360 = 12π, 작은 것 π·2²·90/360 = π 둘 → 12π+π+π = 14π (m²).
     gtT 구간: 0.01~0.17 D 를 도는 작은 부채꼴 · 0.17~0.65 큰 부채꼴(하단 칩 「큰 부채꼴 · r = 4 m, 270°」) · 0.65~0.80 B 를 도는 작은 부채꼴 · 0.80~1 완성(부채꼴 안 「r」「각」 글자). 시작 gtT=0 은 「C」와 「강아지」 라벨이 겹쳐 0.03 에서 시작합니다(VIDEO_FINDINGS #13).
     영역의 넓이(정답) 칩과 아래 칩의 「넓이 14π」는 해설이 gtShow 를 켤 때까지 아낍니다(swept.js hold). */
  'gt-kennel': {
    title: '강아지가 갈 수 있는 영역은?',
    answer: '$14\\pi$',
    answerText: '$14\\pi$ m²',
    summary: '영역 = 큰 부채꼴 + 작은 부채꼴 둘',
    task: '개집의 한 변이나 끈의 길이를 바꿔 부채꼴이 어떻게 달라지는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '모서리를 돌면 끈이 꺾여요',
        start: { gtQ: 2, gtL: 4, gtT: 0.03 },
        cues: [
          { at: 0, say: '개집 한 변은 2 m, 끈은 4 m예요. 강아지가 돌아요.', set: { gtShow: false }, to: { gtT: 0.15 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '모서리 D에서 끈이 꺾이고, 남은 끈으로 작은 부채꼴이 생겨요.' }
        ]
      },
      {
        length: 10,
        title: '큰 부채꼴',
        cues: [
          { at: 0, say: '이번에는 A를 중심으로 크게 돌아요.', to: { gtT: 0.6 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '큰 부채꼴은 반지름 4 m, 중심각 270°.' }
        ]
      },
      {
        length: 12,
        title: '부채꼴을 모두 더하기',
        cues: [
          { at: 0, say: '끝으로 B를 도는 작은 부채꼴, 반지름 2 m, 90°.', to: { gtT: 1 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '큰 부채꼴은 $12\\pi$, 작은 부채꼴은 각각 $\\pi$.' },
          { at: 8.5, say: '영역 $=12\\pi+\\pi+\\pi=14\\pi$ m²', set: { gtShow: true } }
        ]
      }
    ]
  },

  /* ---------- 부채꼴 둘레 (g7-circle-sector.html periScene('sector') z2-sector, 정리 탭) · 3장 30초 · tab:'review' ----------
     r=6, 중심각 90°(장면 기본값). 경계 = ① 호 AB 2π·6·90/360 = 3π, ② 반지름 6, ③ 반지름 6 → 둘레 3π+6+6 = 3π+12 (cm) (장면 steps).
     정리 탭을 쓰는 이유: 정리 탭은 step 이 오를 때마다 경계의 길이가 하나씩 보이고 「둘레 = ?」 를 마지막 단계(step 4)까지 아낍니다(탐구 탭은 「합계 3π + 12 cm」가 처음부터 보임). 같은 값(r, 중심각)의 같은 문제입니다.
     점 P(csP 0~100)는 펼친 띠 위의 위치이고, 경계 비율은 호 3π ≈ 9.42, 반지름 6, 6 → 합 21.42 라 호가 끝나는 곳은 csP = 100×3π/(3π+12) ≈ 43.99, 첫 반지름이 끝나는 곳은 ≈ 71.995 입니다(tools 테스트가 다시 계산).
     step 은 값(csP)을 움직이는 칸과 다른 칸에 둡니다(같은 칸의 to+step 경고). step 2 에서 호 길이, step 3 에서 두 번째 선, step 4(마지막 자막)에서 합계가 나옵니다. */
  'z2-sector': {
    title: '부채꼴의 둘레는?',
    answer: '$3\\pi+12$',
    answerText: '$3\\pi+12$ cm',
    summary: '둘레 = 호의 길이 + 반지름 2개',
    task: '반지름과 중심각을 바꿔 호와 반지름 두 개의 합으로 둘레가 구해지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '먼저 호',
        start: { csR: 6, csA: 90, csP: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm, 중심각 90°인 부채꼴의 둘레를 구해요.', step: 2 },
          { at: 0.5, to: { csP: 43.99008464884426 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '둘레는 경계선의 길이를 더해요. 먼저 호는 $3\\pi$ cm.' }
        ]
      },
      {
        length: 9,
        title: '반지름 두 개',
        cues: [
          { at: 0, say: '부채꼴의 경계에는 반지름 두 개도 있어요.', step: 3 },
          { at: 0.5, to: { csP: 71.99504232442213 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '첫 번째 반지름은 6 cm예요.' }
        ]
      },
      {
        length: 12,
        title: '둘레는?',
        cues: [
          { at: 0, say: '나머지 반지름도 6 cm예요.', to: { csP: 100 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '둘레 = 호 + 반지름 + 반지름' },
          { at: 8.5, say: '$3\\pi+6+6=3\\pi+12$ cm', step: 4 }
        ]
      }
    ]
  },

  /* ---------- 정사각형에서 사분원 4개 파내기 · 넓이 (f01.js f1-star, 탐구 탭, mode 0) · 3장 31초 ----------
     a=10(정사각형의 한 변), 사분원 반지름 r=a/2=5. 정사각형 10×10 = 100, 파낸 사분원 4개 = 원 1개 π·5² = 25π, 색칠한 부분 = 100 − 25π (장면 steps ① 정사각형 ② 사분원 4개 = 원 1개 ③ 파낸 부분 25π ④ 정사각형 − 원).
     t(f1_star_t) 구간: 0~0.12 처음(「전체 (정사각형) 100 cm²」·「r=5」) · 0.12~0.30 파낼 사분원 표시 · 0.38~0.74 옆으로 꺼냄(「사분원 4개 = 원 1개」, 0.6 부터 「파낸 부분 (원 1개) 25π cm²」) · 0.80~0.96 결과(캡션·칩은 f1_star_show 를 켤 때까지 아낌, f01.js lessonHold).
     장면은 넓이(mode 0)와 둘레(mode 1)를 묻고, 둘레는 배열의 두 번째 해설(label 「둘레」, step 으로 시작 — kit 규칙 필요)입니다. */
  'f1-star': [
    {
      title: '정사각형 − 사분원 4개',
      label: '넓이',
      answer: '$100-25\\pi$',
      answerText: '$100-25\\pi$ cm²',
      summary: '색칠한 부분 = 정사각형 − 원 1개',
      task: '한 변 a를 바꿔도 색칠한 부분이 (정사각형 − 원 1개)로 구해지는지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '사분원 4개를 파냈어요',
          start: { f1_star_a: 10, f1_star_t: 0 },
          cues: [
            { at: 0, say: '정사각형의 네 모서리에서 **사분원**을 파냈어요.', set: { f1_star_mode: 0, f1_star_show: false }, to: { f1_star_t: 0.3 }, dur: 3.5, ease: 'smooth' },
            { at: 4.5, say: '한 변은 10 cm, 사분원의 반지름은 5 cm예요.' }
          ]
        },
        {
          length: 10,
          title: '모으면 원 하나',
          cues: [
            { at: 0, say: '파낸 사분원 4개를 모아 보면?', to: { f1_star_t: 0.74 }, dur: 5, ease: 'smooth' },
            { at: 5.5, say: '반지름 5 cm인 원 1개, 넓이 $\\pi\\times5^2=25\\pi$.' }
          ]
        },
        {
          length: 12,
          title: '빼서 구하기',
          cues: [
            { at: 0, say: '색칠한 부분 = 정사각형 − 원 1개', to: { f1_star_t: 0.96 }, dur: 4, ease: 'smooth' },
            { at: 4.5, say: '정사각형 $10\\times10=100$, 원 $25\\pi$.' },
            { at: 8.5, say: '$100-25\\pi$ cm²', set: { f1_star_show: true } }
          ]
        }
      ]
    },
    /* ---------- 정사각형에서 사분원 4개 파내기 · 둘레 (f01.js f1-star, 정리 탭, mode 1) · 3장 29초 · kit 규칙 필요(첫 장이 step 으로 시작) ----------
       a=10, r=5. 둘레 = 사분원의 호 4개, 호 하나 2π·5·90/360 = 5π/2, 합 4×5π/2 = 10π (= 원 하나의 둘레 2π·5) (장면 stepsP). step 1 에서 호 4개, step 2 에서 호 길이 라벨, step 3 에서 합계. */
    {
      title: '별 모양의 둘레',
      label: '둘레',
      tab: 'review',
      answer: '$10\\pi$',
      answerText: '$10\\pi$ cm',
      summary: '둘레 = 사분원의 호 4개 = 원 1개의 둘레',
      task: '한 변 a를 바꿔도 둘레가 원 하나의 둘레와 같은지 확인해 보세요',
      chapters: [
        {
          length: 9,
          title: '둘레는 호 4개',
          start: { f1_star_a: 10 },
          cues: [
            { at: 0, say: '색칠한 별 모양의 둘레는 사분원의 호 4개예요.', set: { f1_star_mode: 1, f1_star_show: false }, step: 1 },
            { at: 4.5, say: '호 하나는 원의 둘레의 $\\frac14$이에요.' }
          ]
        },
        {
          length: 10,
          title: '호 하나의 길이',
          cues: [
            { at: 0, say: '한 변이 10 cm이니 호의 반지름은 5.', step: 2 },
            { at: 5, say: '호 하나 $=2\\pi\\times5\\times\\frac14=\\frac{5\\pi}{2}$' }
          ]
        },
        {
          length: 10,
          title: '네 호를 더하면',
          cues: [
            { at: 0, say: '네 호의 길이는 모두 같아요.' },
            { at: 3.5, say: '둘레 = 호 하나 × 4' },
            { at: 7, say: '$4\\times\\frac{5\\pi}{2}=10\\pi$ cm', step: 3 }
          ]
        }
      ]
    }
  ],

  /* ---------- 파인 반원 · 붙은 반원 → 직사각형 (f04.js f4-slide, 탐구 탭) · 3장 31초 ----------
     W=10(가로), 반원의 반지름 r=3 → 세로 2r=6 (장면 기본값). 파인 반원과 붙은 반원은 같아서 붙은 반원을 왼쪽으로 W 만큼 밀면 직사각형 10×6 = 60 (cm²) (장면 steps).
     t 구간: 0~0.12 처음(「10 cm」「3」) · 0.12~0.30 붙은 반원 ① 표시 · 0.38~0.74 가로로 밀기 · 0.80~0.96 결과(「10 × 6」·캡션·칩은 f4_slide_show 를 켤 때까지 아낌, f04.js lessonHold). */
  'f4-slide': {
    title: '반원을 밀면 직사각형',
    answer: '$60$',
    answerText: '$60$ cm²',
    summary: '색칠한 부분 = 가로 × 세로',
    task: '가로 W나 반지름 r을 바꿔도 색칠한 부분이 직사각형이 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '파인 곳과 붙은 곳',
        start: { f4_slide_W: 10, f4_slide_r: 3, f4_slide_t: 0 },
        cues: [
          { at: 0, say: '왼쪽은 반원만큼 파이고, 오른쪽에 반원이 붙었어요.', set: { f4_slide_show: false }, to: { f4_slide_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '가로는 10 cm, 반원의 반지름은 3 cm예요.' }
        ]
      },
      {
        length: 10,
        title: '가로로 밀기',
        cues: [
          { at: 0, say: '붙은 반원 ①을 왼쪽으로 **가로로 밀어요**.', to: { f4_slide_t: 0.78 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '파인 반원과 크기가 같아서 꼭 맞아요.' }
        ]
      },
      {
        length: 12,
        title: '직사각형의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분이 **직사각형**이 돼요.', to: { f4_slide_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '가로 10 cm, 세로는 지름 $2\\times3$ cm.' },
          { at: 8.5, say: '넓이 $=10\\times6=60$ cm²', set: { f4_slide_show: true } }
        ]
      }
    ]
  },

  /* ---------- 반원 둘레 (g7-circle-sector.html periScene('semi') z2-semi, 정리 탭) · 2장 20초 · z2-sector 와 같은 방법 ----------
     r=6(장면 기본값). 경계 = ① 반원호 πr = 6π, ② 지름 2r = 12 → 둘레 6π+12 (장면 steps). csP 목표: 호 끝 = 100×6π/(6π+12) = 61.10154703516573, 끝 = 100.
     step 2(호 길이) → step 3(합계, 마지막 자막). 정리 탭이 「둘레 = ?」 를 마지막 단계까지 아낍니다(z2-sector 주석 참고). */
  'z2-semi': {
    title: '반원의 둘레는?',
    answer: '$6\\pi+12$',
    answerText: '$6\\pi+12$ cm',
    summary: '반원 둘레 = 반원의 호 + 지름',
    task: '반지름을 바꿔 반원의 호와 지름의 합으로 둘레가 구해지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 10,
        title: '먼저 호',
        start: { csR: 6, csP: 0 },
        cues: [
          { at: 0, say: '지름이 12 cm인 반원의 둘레를 구해요.', step: 2 },
          { at: 0.5, to: { csP: 61.10154703516573 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '둘레는 경계선의 길이를 더해요. 먼저 호는 $6\\pi$ cm.' }
        ]
      },
      {
        length: 10,
        title: '지름까지 더하기',
        cues: [
          { at: 0, say: '아래쪽 경계는 지름, 12 cm예요.', to: { csP: 100 }, dur: 3.5, ease: 'smooth' },
          { at: 3.5, say: '둘레 = 반원의 호 + 지름' },
          { at: 7, say: '$6\\pi+12$ cm', step: 3 }
        ]
      }
    ]
  },

  /* ---------- 사분원 둘레 (periScene('quarter') z2-quarter, 정리 탭) · 3장 30초 ----------
     r=6. 경계 = ① 사분원호 2π·6·90/360 = 3π, ② 반지름 6, ③ 반지름 6 → 3π+12. csP 목표는 z2-sector 와 같음(43.99…, 71.995…, 100). step 2 → 3 → 4(마지막 자막). */
  'z2-quarter': {
    title: '사분원의 둘레는?',
    answer: '$3\\pi+12$',
    answerText: '$3\\pi+12$ cm',
    summary: '사분원 둘레 = 호 + 반지름 2개',
    task: '반지름을 바꿔 호와 반지름 두 개의 합으로 둘레가 구해지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '먼저 호',
        start: { csR: 6, csP: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm인 사분원의 둘레를 구해요.', step: 2 },
          { at: 0.5, to: { csP: 43.99008464884426 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '둘레는 경계선의 길이를 더해요. 먼저 호는 $3\\pi$ cm.' }
        ]
      },
      {
        length: 9,
        title: '반지름 두 개',
        cues: [
          { at: 0, say: '사분원의 경계에는 반지름 두 개도 있어요.', step: 3 },
          { at: 0.5, to: { csP: 71.99504232442213 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '첫 번째 반지름은 6 cm예요.' }
        ]
      },
      {
        length: 12,
        title: '둘레는?',
        cues: [
          { at: 0, say: '나머지 반지름도 6 cm예요.', to: { csP: 100 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '둘레 = 호 + 반지름 + 반지름' },
          { at: 8.5, say: '$3\\pi+6+6=3\\pi+12$ cm', step: 4 }
        ]
      }
    ]
  },

  /* ---------- 활꼴 둘레 (periScene('segment') z2-segment, 정리 탭) · 2장 20초 ----------
     r=6, 중심각 60°(csS 기본값). 경계 = ① 호 AB 2π·6·60/360 = 2π, ② 현 AB = 반지름 6(60° 일 때만 정수로 말함) → 2π+6. csP 목표: 호 끝 = 100×2π/(2π+6) = 51.15273563044784.
     현의 길이는 마지막 단계(step 3)에서 라벨로 나오므로 「6 cm」 는 그 자막과 함께 말합니다. 반지름 두 개는 활꼴의 경계가 아님(점선, 둘레에 포함되지 않음). */
  'z2-segment': {
    title: '활꼴의 둘레는?',
    answer: '$2\\pi+6$',
    answerText: '$2\\pi+6$ cm',
    summary: '활꼴 둘레 = 호 + 현',
    task: '중심각을 60°나 180°로 바꿔 호와 현의 합으로 둘레가 구해지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 10,
        title: '먼저 호',
        start: { csR: 6, csS: 60, csP: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm, 중심각 60°인 활꼴의 둘레를 구해요.', step: 2 },
          { at: 0.5, to: { csP: 51.15273563044784 }, dur: 4, ease: 'smooth' },
          { at: 5, say: '먼저 호 AB는 $2\\pi$ cm.' }
        ]
      },
      {
        length: 10,
        title: '현까지 더하기',
        cues: [
          { at: 0, say: '호의 두 끝을 곧게 이은 선분이 **현**이에요.', to: { csP: 100 }, dur: 3.5, ease: 'smooth' },
          { at: 3.5, say: '활꼴의 둘레 = 호 + 현' },
          { at: 7, say: '현은 6 cm, 둘레 $=2\\pi+6$ cm', step: 3 }
        ]
      }
    ]
  },

  /* ---------- 호의 길이로 넓이 구하기 (basic.js 1610, sectorSpec 교재 16-10) · 3장 28초 · tab:'review' ----------
     호 l=4π(주어짐), 중심각 80°(주어짐) → 반지름 r: 2π·r·80/360 = 4π → r = 9 → 넓이 π·9²·80/360 = 18π (장면 steps ① r=9 ② 18π). 80/360 = 2/9, 40° 조각 9개 중 2개.
     재생 전용 그림(basic.js sectorSpec): div 로 원을 40° 조각 9개로 나눈 점선(thMax<350 인 장면은 원 전체와 틀을 재생·진입 화면에서만 확장). 정리 탭 step 1 에서 r, step 2 에서 넓이가 나옵니다. */
  '1610': {
    title: '호의 길이로 넓이 구하기',
    answer: '$18\\pi$',
    answerText: '$18\\pi$ cm²',
    summary: '반지름을 먼저 구한 뒤 넓이 = $\\pi r^2\\times\\frac{\\theta}{360}$',
    task: '호의 길이나 중심각을 바꿔 반지름을 거쳐 넓이를 구해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '원의 몇 분의 몇?',
        start: { b1610_r: 9, b1610_th: 80, b1610_div: 0 },
        cues: [
          { at: 0, say: '호의 길이는 $4\\pi$ cm, 중심각은 80°예요.', set: { b1610_ref: 0 }, step: 0 },
          { at: 0.2, to: { b1610_div: 1 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '한 바퀴 360° 중 80°는 $\\frac29$예요.' }
        ]
      },
      {
        length: 9,
        title: '반지름 구하기',
        cues: [
          { at: 0, say: '호 = 원주 × $\\frac29$, 원주는 $2\\pi r$.' },
          { at: 4.5, say: '$2\\pi r\\times\\frac{80}{360}=4\\pi$, $r=9$', step: 1 }
        ]
      },
      {
        length: 10,
        title: '넓이는?',
        cues: [
          { at: 0, say: '원의 넓이는 $\\pi\\times9^2=81\\pi$.', set: { b1610_ref: 2 } },
          { at: 3.5, say: '부채꼴은 원의 $\\frac29$, $81\\pi\\times\\frac29$.' },
          { at: 7, say: '넓이 $=18\\pi$ cm²', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 호의 길이로 반지름 구하기 (basic.js 1808, sectorSpec 교재 18-08) · 3장 28초 · tab:'review' ----------
     중심각 45°, 호 l=3π(주어짐) → 2π·r·45/360 = 3π → r = 12 (장면 steps). 45/360 = 1/8, 45° 조각 8개 중 1개 → 원주 = 3π×8 = 24π = 2π·r.
     반지름·원주가 정답을 가르쳐 주므로 ref 라벨(원주)은 쓰지 않고, 정리 탭 step 2(마지막 자막)에서 r 이 나옵니다. */
  '1808': {
    title: '호의 길이로 반지름 구하기',
    answer: '$12$',
    answerText: '$r=12$ cm',
    summary: '호 = $2\\pi r\\times\\frac{\\theta}{360}$ 에서 $r$을 구해요',
    task: '중심각이나 호의 길이를 바꿔 반지름이 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '원의 몇 분의 몇?',
        start: { b1808_r: 12, b1808_th: 45, b1808_div: 0 },
        cues: [
          { at: 0, say: '호의 길이는 $3\\pi$ cm, 중심각은 45°예요.', set: { b1808_ref: 0 }, step: 0 },
          { at: 0.2, to: { b1808_div: 1 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '한 바퀴 360° 중 45°는 $\\frac18$이에요.' }
        ]
      },
      {
        length: 9,
        title: '원주는 호의 8배',
        cues: [
          { at: 0, say: '호는 원주의 $\\frac18$이므로 원주는 호의 8배.' },
          { at: 4.5, say: '원주 $=3\\pi\\times8=24\\pi$ cm', step: 1 }
        ]
      },
      {
        length: 10,
        title: '반지름은?',
        cues: [
          { at: 0, say: '원주는 $2\\pi r$이므로 $2\\pi r=24\\pi$.' },
          { at: 4, say: '양쪽을 $2\\pi$로 나누면?' },
          { at: 7, say: '반지름 $r=12$ cm', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 정사각형 속 두 반원 → 삼각형 (f04.js f4-sq12, 탐구 탭) · 3장 31초 ----------
     a=12(장면 기본값). 잎 모양 조각 ①②를 각각 제자리에서 돌려 끼우면 직각삼각형(두 변 a): ½·12·12 = 72 (장면 steps). t 구간·hold 는 f4-swirl 과 같음(0.12~0.30 조각 ①② 표시 · 0.38~0.74 회전 · 0.80~0.96 결과, 결과 라벨 「삼각형」「72」·캡션·칩은 f4_sq12_show 로). */
  'f4-sq12': {
    title: '두 조각을 돌리면 삼각형',
    answer: '$72$',
    answerText: '$72$ cm²',
    summary: '색칠한 부분 = 직각삼각형 $\\frac12\\times a\\times a$',
    task: '한 변 a를 바꿔도 색칠한 부분이 직각삼각형이 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '옮길 조각 찾기',
        start: { f4_sq12_a: 12, f4_sq12_t: 0 },
        cues: [
          { at: 0, say: '한 변이 12 cm인 정사각형 안에 반원 둘이 있어요.', set: { f4_sq12_show: false }, to: { f4_sq12_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '잎 모양의 두 조각 ①, ②를 옮겨 볼 거예요.' }
        ]
      },
      {
        length: 10,
        title: '돌려서 끼우기',
        cues: [
          { at: 0, say: '두 조각을 각각 **제자리에서 돌려요**.', to: { f4_sq12_t: 0.78 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '빈 곳에 꼭 맞게 끼워져요.' }
        ]
      },
      {
        length: 12,
        title: '삼각형의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분은 **직각삼각형**이 돼요.', to: { f4_sq12_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '직각을 낀 두 변은 모두 12 cm.' },
          { at: 8.5, say: '넓이 $=\\frac12\\times12\\times12=72$ cm²', set: { f4_sq12_show: true } }
        ]
      }
    ]
  },

  /* ---------- 파인 사분원 · 붙은 사분원 → 직사각형 (f04.js f4-slideq, 탐구 탭) · 3장 31초 ----------
     W=10, H=6, r=4(장면 기본값). 붙은 사분원을 왼쪽으로 W 만큼 밀면 직사각형 10×6 = 60 (장면 steps). 라벨 「10 cm」「6 cm」「4」. */
  'f4-slideq': {
    title: '사분원을 밀면 직사각형',
    answer: '$60$',
    answerText: '$60$ cm²',
    summary: '색칠한 부분 = 가로 × 세로',
    task: '가로·세로·반지름을 바꿔도 색칠한 부분이 직사각형이 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '파인 곳과 붙은 곳',
        start: { f4_slideq_W: 10, f4_slideq_H: 6, f4_slideq_r: 4, f4_slideq_t: 0 },
        cues: [
          { at: 0, say: '왼쪽 위가 파이고, 오른쪽에 같은 사분원이 붙었어요.', set: { f4_slideq_show: false }, to: { f4_slideq_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '가로 10 cm, 세로 6 cm, 사분원의 반지름은 4.' }
        ]
      },
      {
        length: 10,
        title: '가로로 밀기',
        cues: [
          { at: 0, say: '붙은 사분원 ①을 왼쪽으로 **가로로 밀어요**.', to: { f4_slideq_t: 0.78 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '파인 곳과 크기·방향이 같아 꼭 맞아요.' }
        ]
      },
      {
        length: 12,
        title: '직사각형의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분이 **직사각형**이 돼요.', to: { f4_slideq_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '넓이는 가로 × 세로.' },
          { at: 8.5, say: '넓이 $=10\\times6=60$ cm²', set: { f4_slideq_show: true } }
        ]
      }
    ]
  },

  /* ---------- 정사각형 속 원 → 직사각형 (f04.js f4-inscr, 탐구 탭) · 3장 31초 ----------
     r=4(장면 기본값), 한 변 2r=8. 원의 오른쪽 반원 ①을 중심 기준 180° 돌려 왼쪽 빈 반원에 끼우면 색칠한 부분은 정사각형의 왼쪽 절반 = 가로 r × 세로 2r = 4×8 = 32 (장면 steps). 라벨 「8 cm」「r=4」. */
  'f4-inscr': {
    title: '정사각형 속 원의 절반',
    answer: '$32$',
    answerText: '$32$ cm²',
    summary: '색칠한 부분 = 정사각형의 절반',
    task: '반지름 r을 바꿔도 색칠한 부분이 정사각형의 절반인지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '옮길 조각 찾기',
        start: { f4_inscr_r: 4, f4_inscr_t: 0 },
        cues: [
          { at: 0, say: '한 변 8 cm인 정사각형에 원이 꼭 맞게 들어 있어요.', set: { f4_inscr_show: false }, to: { f4_inscr_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '원의 오른쪽 반원 ①을 옮겨 볼 거예요.' }
        ]
      },
      {
        length: 10,
        title: '돌려서 끼우기',
        cues: [
          { at: 0, say: '원의 중심을 기준으로 **180°** 돌려요.', to: { f4_inscr_t: 0.78 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '왼쪽의 빈 반원에 꼭 맞게 끼워져요.' }
        ]
      },
      {
        length: 12,
        title: '색칠한 부분의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분은 정사각형의 **왼쪽 절반**이에요.', to: { f4_inscr_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '가로는 반지름 4, 세로는 한 변 8.' },
          { at: 8.5, say: '넓이 $=4\\times8=32$ cm²', set: { f4_inscr_show: true } }
        ]
      }
    ]
  },

  /* ---------- 부채꼴 고리의 조각 옮기기 (f04.js f4-ringmv, 탐구 탭) · 3장 31초 ----------
     R=6, r=3, 중심각 60°(장면 기본값). 작은 부채꼴 ①을 돌려 고리의 빈 곳에 끼우면 색칠한 부분은 큰 부채꼴: π·6²·60/360 = 6π (장면 steps). 라벨 「60°」「R=6」「r=3」(r=3 은 조각이 옮겨 가면 사라짐). */
  'f4-ringmv': {
    title: '고리 조각을 옮기면 부채꼴',
    answer: '$6\\pi$',
    answerText: '$6\\pi$ cm²',
    summary: '색칠한 부분 = 큰 부채꼴 $\\pi R^2\\times\\frac{\\theta}{360}$',
    task: 'R, r, 중심각을 바꿔도 색칠한 부분이 큰 부채꼴이 되는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '옮길 조각 찾기',
        start: { f4_ringmv_R: 6, f4_ringmv_r: 3, f4_ringmv_th: 60, f4_ringmv_t: 0 },
        cues: [
          { at: 0, say: '고리 조각의 바깥 반지름 $R$은 6, 작은 부채꼴은 $r$=3.', set: { f4_ringmv_show: false }, to: { f4_ringmv_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '두 중심각은 같은 60°. 작은 부채꼴 ①을 옮길 거예요.' }
        ]
      },
      {
        length: 10,
        title: '돌려서 끼우기',
        cues: [
          { at: 0, say: '작은 부채꼴 ①을 **돌려서** 옮겨요.', to: { f4_ringmv_t: 0.78 }, dur: 5.5, ease: 'smooth' },
          { at: 6, say: '중심각이 같아서 꼭 맞게 끼워져요.' }
        ]
      },
      {
        length: 12,
        title: '큰 부채꼴의 넓이',
        cues: [
          { at: 0, say: '색칠한 부분은 반지름 6, 중심각 60°인 **큰 부채꼴**.', to: { f4_ringmv_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '넓이 $=\\pi\\times6^2\\times\\frac{60}{360}$' },
          { at: 8.5, say: '넓이 $=6\\pi$ cm²', set: { f4_ringmv_show: true } }
        ]
      }
    ]
  },

  /* ---------- 고리 모양: 큰 부채꼴 − 작은 부채꼴 · 넓이 (f01.js f1-ring, 탐구 탭, mode 0) · 3장 31초 ----------
     R=6, r=3, 중심각 90°(장면 기본값). 큰 부채꼴 π·6²·90/360 = 9π, 작은 부채꼴 π·3²·90/360 = 9π/4, 색칠한 부분 = 9π − 9π/4 = 27π/4. 라벨 「90°」「R=6」「r=3」, 캡션 「전체 (큰 부채꼴) 9π」「파낸 부분 (작은 부채꼴) 9π/4」.
     결과(27π/4)는 f1_ring_show 로 아끼고, 정답은 식 전체로 둡니다(파낸 부분 9π/4 를 먼저 말하므로). 넓이만 합니다(둘레 모드는 step 만 있어 첫 장 규칙이 필요: f1-ss2·f1-star 의 둘레 해설과 같은 이유로 아직 만들지 않음). */
  'f1-ring': {
    title: '큰 부채꼴 − 작은 부채꼴',
    answer: '$9\\pi-\\frac{9\\pi}{4}=\\frac{27\\pi}{4}$',
    answerText: '$9\\pi-\\frac{9\\pi}{4}=\\frac{27\\pi}{4}$ cm²',
    summary: '고리 모양 = 큰 부채꼴 − 작은 부채꼴',
    task: 'R, r, 중심각을 바꿔도 (큰 부채꼴 − 작은 부채꼴)로 구해지는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '파낸 작은 부채꼴',
        start: { f1_ring_R: 6, f1_ring_r: 3, f1_ring_th: 90, f1_ring_t: 0 },
        cues: [
          { at: 0, say: '큰 부채꼴에서 작은 부채꼴을 파냈어요.', set: { f1_ring_mode: 0, f1_ring_show: false }, to: { f1_ring_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '큰 쪽 반지름 $R$은 6, 작은 쪽 반지름 $r$은 3.' }
        ]
      },
      {
        length: 10,
        title: '두 넓이 구하기',
        cues: [
          { at: 0, say: '큰 부채꼴의 넓이 $=\\pi\\times6^2\\times\\frac{90}{360}=9\\pi$', to: { f1_ring_t: 0.74 }, dur: 4.5, ease: 'smooth' },
          { at: 5, say: '작은 부채꼴은 $\\pi\\times3^2\\times\\frac{90}{360}=\\frac{9\\pi}{4}$' }
        ]
      },
      {
        length: 12,
        title: '빼서 구하기',
        cues: [
          { at: 0, say: '색칠한 부분 = 큰 부채꼴 − 작은 부채꼴', to: { f1_ring_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '큰 부채꼴 $9\\pi$에서 $\\frac{9\\pi}{4}$를 빼요.' },
          { at: 8.5, say: '$9\\pi-\\frac{9\\pi}{4}=\\frac{27\\pi}{4}$ cm²', set: { f1_ring_show: true } }
        ]
      }
    ]
  },

  /* ---------- 정사각형에서 잎 모양 파내기 · 넓이 (f01.js f1-lens, 탐구 탭, mode 0) · 3장 31초 ----------
     a=8. 정사각형 64, 잎 모양 = 사분원 둘 − 정사각형 = 2·(π·8²/4) − 64 = 32π − 64, 색칠한 부분 = 64 − (32π − 64) = 128 − 32π. 라벨 「8 cm」, 캡션 「전체 (정사각형) 64」「파낸 부분 (잎 모양) 32π−64」. */
  'f1-lens': {
    title: '정사각형 − 잎 모양',
    answer: '$128-32\\pi$',
    answerText: '$128-32\\pi$ cm²',
    summary: '색칠한 부분 = 정사각형 − 잎 모양',
    task: '한 변 a를 바꿔도 색칠한 부분이 (정사각형 − 잎 모양)으로 구해지는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '파낼 잎 모양',
        start: { f1_lens_a: 8, f1_lens_t: 0 },
        cues: [
          { at: 0, say: '마주 보는 두 꼭짓점의 사분원이 겹친 **잎 모양**을 파냈어요.', set: { f1_lens_mode: 0, f1_lens_show: false }, to: { f1_lens_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '정사각형의 한 변은 8 cm예요.' }
        ]
      },
      {
        length: 10,
        title: '잎 모양의 넓이',
        cues: [
          { at: 0, say: '잎 모양 = 사분원 둘 − 정사각형', to: { f1_lens_t: 0.74 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '잎 모양의 넓이 $=32\\pi-64$' }
        ]
      },
      {
        length: 12,
        title: '빼서 구하기',
        cues: [
          { at: 0, say: '색칠한 부분 = 정사각형 − 잎 모양', to: { f1_lens_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '정사각형 $8\\times8=64$에서 $32\\pi-64$를 빼요.' },
          { at: 8.5, say: '$64-(32\\pi-64)=128-32\\pi$ cm²', set: { f1_lens_show: true } }
        ]
      }
    ]
  },

  /* ---------- 정사각형에서 사분원과 반원 사이 파내기 · 넓이 (f01.js f1-ex22, 탐구 탭, mode 0) · 3장 31초 ----------
     a=4. 정사각형 16, 파낸 부분 = 사분원 π·4²/4 = 4π 에서 반원 π·2²/2 = 2π 를 뺀 2π, 색칠한 부분 = 16 − 2π. 라벨 「4 cm」「4」「2」, 캡션 「전체 (정사각형) 16」「파낸 부분 (사분원−반원) 2π」. */
  'f1-ex22': {
    title: '정사각형 − (사분원 − 반원)',
    answer: '$16-2\\pi$',
    answerText: '$16-2\\pi$ cm²',
    summary: '색칠한 부분 = 정사각형 − 파낸 부분',
    task: '한 변 a를 바꿔도 같은 방법으로 구해지는지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '파낸 부분 찾기',
        start: { f1_ex22_a: 4, f1_ex22_t: 0 },
        cues: [
          { at: 0, say: '사분원과 반원 사이의 흰 부분을 파냈어요.', set: { f1_ex22_mode: 0, f1_ex22_show: false }, to: { f1_ex22_t: 0.3 }, dur: 3.5, ease: 'smooth' },
          { at: 4.5, say: '정사각형의 한 변은 4 cm, 반원의 반지름은 2.' }
        ]
      },
      {
        length: 10,
        title: '파낸 부분의 넓이',
        cues: [
          { at: 0, say: '파낸 부분 = 사분원 − 반원', to: { f1_ex22_t: 0.74 }, dur: 5, ease: 'smooth' },
          { at: 5.5, say: '파낸 부분의 넓이 $=4\\pi-2\\pi=2\\pi$' }
        ]
      },
      {
        length: 12,
        title: '빼서 구하기',
        cues: [
          { at: 0, say: '색칠한 부분 = 정사각형 − 파낸 부분', to: { f1_ex22_t: 0.96 }, dur: 4, ease: 'smooth' },
          { at: 4.5, say: '정사각형 $4\\times4=16$에서 $2\\pi$를 빼요.' },
          { at: 8.5, say: '$16-2\\pi$ cm²', set: { f1_ex22_show: true } }
        ]
      }
    ]
  },

  /* ===== 아래 7개(1103·1106·1807·1104·1105·1719·1809)는 첫 장이 step 으로 시작합니다: kit 의 「해설 첫 장은 to 또는 step/part 칸이 첫 1초 안」 규칙(sv 브랜치)이 병합돼야 재생됩니다(별도 커밋). 모두 정리 탭(tab:'review')이고 값은 움직이지 않습니다(교재 수치 그대로, 장면 기본값). 정답 칩은 step 0 에서 basic.js(build view)가 재생·진입 화면에 한해 숨깁니다. ===== */

  /* ---------- 호의 길이의 비로 중심각 구하기 (basic.js 1103) · 2장 19초 ----------
     호의 비 3:5:7 → 한 칸 360°÷15 = 24° → ∠AOB = 24°×3 = 72° (장면 steps). step 1 에서 「한 칸 24°」 눈금, step 2 에서 ∠AOB. */
  '1103': {
    title: '호의 비로 중심각 구하기',
    answer: '$72°$',
    answerText: '$72°$',
    summary: '중심각 = 360° × (비 ÷ 비의 합)',
    task: '호의 비를 바꿔 한 칸의 각도와 중심각이 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '원을 15칸으로',
        cues: [
          { at: 0, say: '호 AB : BC : CA = 3 : 5 : 7이에요.', step: 0 },
          { at: 4.5, say: '$3+5+7=15$칸, 한 칸은 $360°\\div15=24°$.', step: 1 }
        ]
      },
      {
        length: 10,
        title: '∠AOB는?',
        cues: [
          { at: 0, say: '호 AB는 3칸이에요.' },
          { at: 3.5, say: '∠AOB $=24°\\times3$' },
          { at: 7, say: '∠AOB $=72°$', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 중심각과 부채꼴의 넓이 (basic.js 1106) · 2장 20초 ----------
     ∠AOB=120° 의 넓이 24π, ∠COD=40° 의 넓이 x: 24π : x = 120 : 40 → x = 24π×40/120 = 8π (장면 steps). */
  '1106': {
    title: '중심각과 넓이의 비',
    answer: '$8\\pi$',
    answerText: '$8\\pi$ cm²',
    summary: '(넓이) : (넓이) = (중심각) : (중심각)',
    task: '중심각이나 원의 넓이를 바꿔 넓이의 비가 중심각의 비와 같은지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 10,
        title: '넓이는 중심각에 정비례',
        cues: [
          { at: 0, say: '120°인 부채꼴의 넓이는 $24\\pi$. 40°인 쪽을 $x$라 해요.', step: 0 },
          { at: 5, say: '$24\\pi:x=120:40$', step: 1 }
        ]
      },
      {
        length: 10,
        title: 'x 구하기',
        cues: [
          { at: 0, say: '40°는 120°의 $\\frac13$배예요.' },
          { at: 3.5, say: '$x=24\\pi\\times\\frac{40}{120}$' },
          { at: 7, say: '$x=8\\pi$ cm²', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 같은 길이의 현과 중심각 (basic.js 1807) · 2장 19초 ----------
     현 AB=CD=DE=EF 이면 ∠AOB=∠COD=∠DOE=∠EOF, ∠COF = 3×∠AOB = 105° → ∠AOB = 35° (장면 steps). */
  '1807': {
    title: '같은 현이면 같은 중심각',
    answer: '$35°$',
    answerText: '$35°$',
    summary: '현의 길이가 같으면 중심각도 같다',
    task: '∠COF를 바꿔 ∠AOB가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '같은 현, 같은 중심각',
        cues: [
          { at: 0, say: '그림에서 표시한 현들은 길이가 모두 같아요.', step: 0 },
          { at: 4.5, say: '현의 길이가 같으면 중심각도 같아요.', step: 1 }
        ]
      },
      {
        length: 10,
        title: '∠AOB는?',
        cues: [
          { at: 0, say: '∠COF는 같은 각 3개의 합, 105°예요.' },
          { at: 4, say: '∠AOB $=105°\\div3$' },
          { at: 7, say: '∠AOB $=35°$', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 평행한 현과 호의 길이 (basic.js 1104) · 2장 20초 ----------
     AB∥CD: ∠OCD = ∠AOC = 40°(엇각), OC=OD → ∠ODC = 40° → ∠COD = 180°−2×40° = 100°; 호는 중심각에 정비례 4π : 호CD = 40 : 100 → 10π (장면 steps). */
  '1104': {
    title: '평행한 현과 호의 길이',
    answer: '$10\\pi$',
    answerText: '$10\\pi$ cm',
    summary: '평행선의 각 → 중심각 → 호의 길이의 비례',
    task: '각이나 반지름을 바꿔 호 CD의 길이가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 10,
        title: '엇각과 이등변삼각형',
        cues: [
          { at: 0, say: '중심각 40°인 호가 $4\\pi$ cm. 호 CD를 구해요.', step: 0 },
          { at: 5, say: 'AB∥CD라 엇각 ∠OCD=40°, OC=OD라 ∠ODC=40°.' }
        ]
      },
      {
        length: 10,
        title: '호 CD는?',
        cues: [
          { at: 0, say: '∠COD $=180°-2\\times40°=100°$', step: 1 },
          { at: 3.5, say: '호는 중심각에 정비례: $4\\pi:CD=40:100$' },
          { at: 7, say: '호 CD $=10\\pi$ cm', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 반원에서 평행선과 호의 길이 (basic.js 1105) · 2장 20초 ----------
     AC∥OD: ∠OAC = ∠BOD = 42°(동위각), OA=OC → ∠OCA = 42° → ∠AOC = 180°−2×42° = 96°; 7π : 호AC = 42 : 96 → 16π (장면 steps). */
  '1105': {
    title: '반원의 평행선과 호',
    answer: '$16\\pi$',
    answerText: '$16\\pi$ cm',
    summary: '동위각 → 중심각 → 호의 길이의 비례',
    task: '각이나 반지름을 바꿔 호 AC의 길이가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 10,
        title: '동위각과 이등변삼각형',
        cues: [
          { at: 0, say: '중심각 42°인 호가 $7\\pi$ cm. 호 AC를 구해요.', step: 0 },
          { at: 5, say: '동위각이라 ∠OAC=42°, OA=OC라 ∠OCA=42°.' }
        ]
      },
      {
        length: 10,
        title: '호 AC는?',
        cues: [
          { at: 0, say: '∠AOC $=180°-2\\times42°=96°$', step: 1 },
          { at: 3.5, say: '호는 중심각에 정비례: $7\\pi:AC=42:96$' },
          { at: 7, say: '호 AC $=16\\pi$ cm', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 지름과 호의 비로 ∠x 구하기 (basic.js 1719) · 2장 19초 ----------
     호 AC : 호 BC = 4 : 1, 합 = 반원 180° → ∠BOC = 36°, ∠AOC = 144°; △OAC 이등변 → ∠x = (180°−144°)÷2 = 18° (장면 steps). */
  '1719': {
    title: '호의 비로 ∠x 구하기',
    answer: '$18°$',
    answerText: '$18°$',
    summary: '호의 비 → 중심각 → 이등변삼각형의 밑각',
    task: '호의 비를 바꿔 ∠x가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '호의 비로 중심각',
        cues: [
          { at: 0, say: '지름 AB 위의 호 AC : 호 BC = 4 : 1이에요.', step: 0 },
          { at: 4.5, say: '두 호의 합은 반원 180°라 ∠BOC=36°, ∠AOC=144°.', step: 1 }
        ]
      },
      {
        length: 10,
        title: '∠x는?',
        cues: [
          { at: 0, say: '∠x는 ∠CAB. △OAC는 OA=OC인 이등변삼각형.' },
          { at: 4, say: '∠x $=(180°-144°)\\div2$' },
          { at: 7, say: '∠x $=18°$', step: 2 }
        ]
      }
    ]
  },

  /* ---------- 정다각형 안의 부채꼴의 넓이 (basic.js 1809) · 2장 19초 ----------
     정오각형(장면 기본값 b1809_i=3), 반지름 10 cm: 한 내각 180°×(5−2)÷5 = 108° → 넓이 π·10²·108/360 = 30π (장면 steps). */
  '1809': {
    title: '정오각형 속 부채꼴의 넓이',
    answer: '$30\\pi$',
    answerText: '$30\\pi$ cm²',
    summary: '정다각형의 내각 → 부채꼴의 넓이',
    task: '다각형의 변의 수나 한 변의 길이를 바꿔 넓이가 어떻게 달라지는지 확인해 보세요',
    tab: 'review',
    chapters: [
      {
        length: 9,
        title: '정오각형의 한 내각',
        cues: [
          { at: 0, say: '정오각형의 한 꼭짓점이 중심, 한 변 10 cm가 반지름.', step: 0 },
          { at: 4.5, say: '한 내각 $=180°\\times(5-2)\\div5=108°$', step: 1 }
        ]
      },
      {
        length: 10,
        title: '부채꼴의 넓이',
        cues: [
          { at: 0, say: '부채꼴은 반지름 10 cm, 중심각 108°예요.' },
          { at: 4, say: '넓이 $=\\pi\\times10^2\\times\\frac{108}{360}$' },
          { at: 7.5, say: '넓이 $=30\\pi$ cm²', step: 2 }
        ]
      }
    ]
  }
};
