/* ==========================================================================
   원과 부채꼴 · 영상 목차 대본 (video.js)
   window.APL_VIDEOS['g7-circle-sector'] = { '<장면 id>': 대본, ... }
   대본 형식은 kit/apl-video-core.js 맨 위 주석과 docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 를 따릅니다.
   - 상태값 이름은 장면이 lab.s 에 실제로 등록하는 이름만 씁니다(tools/video.test.mjs 가 장면 소스에서 확인).
       1209     (basic.js): 'b'+id+'_' + params → b1209_r, b1209_th
       f4-swirl (f04.js) : 'f4_'+id+'_' + vars(R)와 t/mode/seed/pick → f4_swirl_R, f4_swirl_t, ...
   - 자막은 장면의 기존 탐구 질문·정리 단계 글(steps)·규칙(rule)에서 출발하고, 새로운 수학 주장을 만들지 않습니다.
       1209     ← question · rule(부채꼴은 원의 θ/360 만큼 → 호 = 원주 × θ/360, 넓이 = 원의 넓이 × θ/360) · relation(둘 다 중심각에 정비례)
       f4-swirl ← question · steps 4단계(S자 모양 → 작은 반원 ①은 파인 곳과 같은 크기 → O를 기준으로 180° 돌려 끼움 → 큰 반원 ½×π×R²)
   ========================================================================== */
window.APL_VIDEOS = window.APL_VIDEOS || {};

window.APL_VIDEOS['g7-circle-sector'] = {
  /* ---------- 부채꼴의 호의 길이와 넓이 (basic.js 1209) ----------
     r=12, θ=120° → 호 l=2π·12·120/360=8π, 넓이 S=π·12²·120/360=48π.  θ=240° → 호 16π, 넓이 96π (둘 다 2배). 그림의 라벨이 이 값을 그대로 보여 줍니다. */
  '1209': {
    length: 24,
    start: { b1209_r: 12, b1209_th: 120 },
    summary: '$l=2\\pi r\\times\\frac{\\theta}{360}$, $S=\\pi r^2\\times\\frac{\\theta}{360}$',
    task: '중심각 θ를 바꿔 호의 길이와 넓이가 같은 비율로 변하는지 보세요',
    cues: [
      { at: 0, say: '반지름 **12 cm**, 중심각 **120°**인 부채꼴이에요. 호의 길이와 넓이를 구해 봐요.' },
      { at: 5, say: '중심각을 **2배**로 키우면 호의 길이도 **8π → 16π**, 넓이도 **48π → 96π**로 2배가 돼요.', to: { b1209_th: 240 }, dur: 6, ease: 'smooth' },
      { at: 12.5, say: '부채꼴은 원의 $\\frac{\\theta}{360}$만큼이에요. ($\\theta$는 중심각)' },
      { at: 18, say: '그래서 호 $l=2\\pi r\\times\\frac{\\theta}{360}$, 넓이 $S=\\pi r^2\\times\\frac{\\theta}{360}$' }
    ]
  },

  /* ---------- 원 안의 S자 곡선 → 반원 (f04.js f4-swirl) ----------
     t(f4_swirl_t) 구간: 0.12~0.30 옮길 조각 ① 표시, 0.38~0.74 180° 회전, 0.80~0.96 결과(큰 반원) 표시. R=6 이면 ½π·6²=18π. */
  'f4-swirl': {
    length: 22,
    start: { f4_swirl_R: 6, f4_swirl_t: 0 },
    summary: '색칠한 부분 = 큰 반원 $\\frac12\\pi R^2$',
    task: '큰 원의 반지름 R을 바꿔도 색칠한 부분이 큰 반원이 되는지 보세요',
    cues: [
      { at: 0, say: '원 안에 **S자 곡선**이 있어요. 색칠한 부분의 넓이는?' },
      { at: 3, say: '오른쪽 아래 작은 반원 ①은 왼쪽에 파인 작은 반원과 **같은 크기**예요.', to: { f4_swirl_t: 0.3 }, dur: 3, ease: 'smooth' },
      { at: 7, say: '큰 원의 중심 O를 기준으로 **180° 돌려** 파인 곳에 끼워요.', to: { f4_swirl_t: 0.74 }, dur: 6, ease: 'smooth' },
      { at: 14, say: '색칠한 부분이 **큰 반원**이 돼요. 넓이는 $\\frac12\\pi R^2$ ($R$은 큰 원의 반지름)', to: { f4_swirl_t: 1 }, dur: 4.5, ease: 'smooth' }
    ]
  }
};
