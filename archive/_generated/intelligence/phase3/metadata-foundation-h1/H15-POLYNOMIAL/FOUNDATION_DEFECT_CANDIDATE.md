# FOUNDATION_DEFECT_CANDIDATE — H15-POLYNOMIAL

상태: **OPEN / HOLD**  
발견 단계: blind first-pass 후 outlier recheck  
현재 L1 apply: 해당 2문항은 제외

## Finding 1 — solid prism under polynomial source key

- questionUid: `qid_v1_56c848f12eed52e96a340dfbc978189cc4008ccbc62845cb0348674ba44fc0ef`
- source: `original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js#16`
- current `standardUnitKey`: `H15-SA-01`
- current `standardUnit`: `다항식의 연산`
- source prompt: 가로·세로·높이가 `x, x, y`인 정사각기둥 3개의 입체 부피
- source visual: prompt에 inline SVG가 포함됨
- finding: 문제 내용과 visual이 입체도형/부피 문항이며 다항식 연산의
  canonical evidence가 없음
- disposition: `FOUNDATION_DEFECT_CANDIDATE`
- action: metadata apply 금지; locked taxonomy의 다른 L1로 임의 이동 금지

## Finding 2 — square pyramid under factorization source key

- questionUid: `qid_v1_bd278f69cb7d7e1c24bd08a46fa5ac8167108441fd6775b63e7e51280061645a`
- source: `original/high/h1/2final/22_제일고_2학기_기말_고1_기출.js#21`
- current `standardUnitKey`: `H15-SA-03`
- current `standardUnit`: `인수분해`
- source prompt: 모든 모서리의 길이가 `a`인 정사각뿔의 두 부피와 선분 길이
- source visual: `archive/assets/images/22_제일고_2학기_기말_고1_기출/q21.png`
- finding: 문제 내용과 visual이 정사각뿔 부피 문항이며 인수분해의
  canonical evidence가 없음
- disposition: `FOUNDATION_DEFECT_CANDIDATE`
- action: metadata apply 금지; locked taxonomy의 다른 L1로 임의 이동 금지

## Safety

- source JS 수정: 0
- content/choices/answer/solution/image 수정: 0
- source fingerprint mutation: 0
- source SHA mutation: 0
- 이 두 문항은 현재 sidecar에 v2 canonical path를 쓰지 않았다.

다음 조치는 source unit 귀속의 독립 확인이다. 확인 전에는 이 L1을 PASS로
승격하거나 다음 L1로 진행하지 않는다.
