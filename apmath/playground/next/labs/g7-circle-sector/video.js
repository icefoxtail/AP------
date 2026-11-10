/* ==========================================================================
   원과 부채꼴 · 영상 목차 대본 (video.js)
   window.APL_VIDEOS['g7-circle-sector'] = { '<장면 id>': 대본, ... }
   대본 형식은 kit/apl-video-core.js 맨 위 주석과 docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 를 따릅니다.
   - 상태값 이름은 장면이 lab.s 에 실제로 등록하는 이름만 씁니다(tools/video.test.mjs 가 장면 소스에서 확인).
       1210     (basic.js): 'b'+id+'_' + params → b1210_r, b1210_th
   - 쇼츠 규칙: 8~15초·자막 2~3줄·한 줄 40자 이하·소개 줄 없이 첫 프레임부터 그림이 움직임·공식/결론은 마지막 한 줄. 자세한 규칙과 견본은 docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md.
   - 자막은 장면의 기존 탐구 질문·정리 단계 글(steps)·규칙(rule)에서 출발하고, 새로운 수학 주장을 만들지 않습니다.
       1210     ← question · rule(S = ½ r l) · relation(넓이 ÷ 호의 길이 = r ÷ 2)
   - 1209·f4-swirl·f1-ss2·f3-leaf-len·f5-sq4·rl-rect·gt-kennel 쇼츠 7개는 해설(lesson.js)로 대체했습니다(해설이 영상의 상위 형태라 이 파일에서 지웠습니다).
   ========================================================================== */
window.APL_VIDEOS = window.APL_VIDEOS || {};

window.APL_VIDEOS['g7-circle-sector'] = {
  /* ---------- 넓이와 호의 길이 사이의 관계 (basic.js 1210) · 12초 ----------
     r=9 고정. θ=120° → 호 l=2π·9·120/360=6π, 넓이 S=π·9²·120/360=27π.  θ=160° → 호 8π, 넓이 36π.
     S÷l = 27π÷6π = 36π÷8π = 9/2 = r÷2(9÷2). 규칙 S=½rl, relation 「넓이 ÷ 호의 길이 = r ÷ 2 (늘 같음)」.
     snap 40: r=9 는 호 θ/20·π, 넓이 0.225θ·π 라 θ=120·160 만 둘 다 정수(140° 는 넓이 31.5π 로 소수) → 두 값 사이를 한 번에 넘깁니다.
     라벨은 θ=120·160 에서 깨끗(40·80·200·240·280·320 은 겹침/맞닿음 → VIDEO_FINDINGS.md #4~#6) */
  '1210': {
    length: 12,
    title: '넓이 ÷ 호의 길이는?',
    start: { b1210_r: 9, b1210_th: 120 },
    summary: '$S=\\frac12 rl$',
    task: '중심각 θ를 바꿔 넓이 ÷ 호의 길이가 늘 r ÷ 2 로 같은지 보세요',
    cues: [
      { at: 0, say: '중심각 $\\theta$를 **120° → 160°**로 키워요.', to: { b1210_th: 160 }, dur: 3, ease: 'smooth', snap: 40 },
      { at: 4.5, say: '호는 **6π → 8π**, 넓이는 **27π → 36π**.' },
      { at: 8.5, say: '넓이÷호 = 27π÷6π = 36π÷8π = **9/2** = 반지름÷2' }
    ]
  }
};
