# FOUNDATION_DEFECT_CANDIDATE — H15-POLYNOMIAL

상태: **RESOLVED / WITHDRAWN**  
발견 단계: blind first-pass 후 outlier recheck  
현재 L1 apply: 두 문항 모두 representation/context 원칙에 따라 적용

## Adjudication correction

초기 outlier 판정은 도형·입체라는 표현 형식을 primary taxonomy 근거처럼
사용한 false positive였다. 문제·해설을 다시 대조한 결과 두 문항 모두
다항식 개념과 풀이 전략이 결정적이므로 HOLD를 해제한다.

## Finding 1 — solid prism under polynomial source key

- questionUid: `qid_v1_56c848f12eed52e96a340dfbc978189cc4008ccbc62845cb0348674ba44fc0ef`
- source: `original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js#16`
- current `standardUnitKey`: `H15-SA-01`
- current `standardUnit`: `다항식의 연산`
- source prompt: 가로·세로·높이가 `x, x, y`인 정사각기둥 3개의 입체 부피
- source visual: prompt에 inline SVG가 포함됨
- finding correction: 입체도형은 representation/context이고, 세 기둥의
  부피를 다항식으로 합산·중복 제거하는 다항식의 덧셈·뺄셈이 결정적 전략
- final path: `다항식 → 다항식의 연산 → 다항식의 덧셈과 뺄셈 → 다항식의 덧셈·뺄셈`
- disposition: `ACCEPTED`
- action: metadata apply 완료

## Finding 2 — square pyramid under factorization source key

- questionUid: `qid_v1_bd278f69cb7d7e1c24bd08a46fa5ac8167108441fd6775b63e7e51280061645a`
- source: `original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js#21`
- current `standardUnitKey`: `H15-SA-03`
- current `standardUnit`: `인수분해`
- source prompt: 모든 모서리의 길이가 `a`인 정사각뿔의 두 부피와 선분 길이
- source visual: `archive/assets/images/22_제일고_2학기_기말_고1_기출/q21.png`
- finding correction: 정사각뿔은 representation/context이고,
  `a^3+b^3=(a+b)(a^2-ab+b^2)` 합과 차 공식이 결정적 전략
- final path: `다항식 → 인수분해 → 인수분해 공식 → 합과 차`
- disposition: `ACCEPTED`
- action: metadata apply 완료

## Safety

- source JS 수정: 0
- content/choices/answer/solution/image 수정: 0
- source fingerprint mutation: 0
- source SHA mutation: 0
- 두 문항 모두 현재 sidecar에 v2 canonical path를 기록했다.

최종 원칙: 도형·그래프·표·입체는 primary taxonomy를 결정하지 않는다.
문항 해결에 결정적으로 사용되는 교육과정 개념과 풀이 전략으로
L1→L4를 결정한다.
