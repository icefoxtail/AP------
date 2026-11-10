/* ==========================================================================
   원과 부채꼴 · 해설(lesson) (lesson.js)
   window.APL_LESSONS['g7-circle-sector'] = { '<장면 id>': 해설, ... }
   해설 = 쇼츠 규칙을 지키는 장(8~15초) 2~6개를 이어 붙인 것. 형식: kit/apl-video-core.js 맨 위 주석, docs/guides/APMATH_LAB_VIDEO_SCRIPT_GUIDE_CURRENT.md 「해설(lesson)」.
   - 자막은 장면의 탐구 질문·정리 단계(steps)·규칙에서만 가져오고 새 수학 주장을 만들지 않습니다. 기호(r, l)는 쓰기 전에 뜻을 말합니다. 정답은 마지막 장에서만.
   ========================================================================== */
window.APL_LESSONS = window.APL_LESSONS || {};

window.APL_LESSONS['g7-circle-sector'] = {
  /* ---------- 부채꼴 넓이 (g7-circle-sector.html proofScene('sector') z3-sectorProof) · 3장 30초 ----------
     r=6, 중심각 120°: 조각 수 Kof = max(2, 2·⌈120/20⌉) = 12. 호의 길이 l = 2π·6·120/360 = 4π, 가로 = l÷2 = 2π, 세로 = r = 6, 넓이 S = ½·6·4π = 12π (= π·6²·120/360 = 36π/3 ✓).
     (90° 는 가로가 3π/2 라 분수가 되어 120° 를 씁니다.) csT(조각을 가로로 미는 정도 0~100): 0 → 20(나눔) → 54(맞물림, 55 부터 가로·세로·넓이 라벨이 그려짐) → 100.
     장면은 csT ≥ 55 에서 결론 라벨 「S = ½rl = 12π cm²」을 바로 그리므로, 재생 동안(s.lessonOn)은 해설이 csShowS 를 켤 때까지 그 라벨만 아낍니다(g7-circle-sector.html proofScene). */
  'z3-sectorProof': {
    title: '부채꼴 넓이는 왜 ½rl?',
    answer: '$12\\pi$',
    summary: '부채꼴 넓이 $S=\\frac12 rl$',
    task: '반지름과 중심각을 바꿔도 가로가 $l$의 절반, 세로가 $r$인지 확인해 보세요',
    chapters: [
      {
        length: 9,
        title: '조각으로 나누기',
        start: { csR: 6, csS: 120, csT: 0 },
        cues: [
          { at: 0, say: '반지름 6 cm, 중심각 120°인 부채꼴이에요.', to: { csT: 20 }, dur: 4, ease: 'smooth' },
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
  }
};
