# Q15 검수 기록

- 기대 관계: 두 유리함수의 사분면 통과 조건을 예시 `k=1/2`에서 비교한다. 가능한 범위는 `0≤k<2/3`, 정답 ①이다.
- 확인: `f=(2x−1)/(6x+24)`의 점근선은 `x=−4`, `y=1/3`; `g=(4x+1)/(2x+2)`의 점근선은 `x=−1`, `y=2`이다. attempt-06의 곡선 좌표 잔차는 독립 검수에서 0.0017 모델 단위 미만으로 확인했고, after에서 축·눈금·점근선·라벨 충돌이나 잘림이 없다.
- 정답 노출: candidate SVG·title·desc·alt에 `0≤k<2/3`이나 보기 번호가 없다. caption 끝에 정답 ①이 있다.
- 수리: 1차 검수는 기존 `q15-solution.svg`의 정답 범위 문구를 제거한 attempt-06 공식 SVG를 제안하고, publish alt/caption을 k=1/2 예시에 맞췄다. 이 handoff에는 그 SVG와 publish 정보만 넣었으며 원본 JS·archive 자산은 수정하지 않았다.
- OPEN/NOT_RUN: post-edit DOM/page capture, qualification, publication은 미실행이다.
- figure-solution.svg SHA-256: `47e2f76a14ccfac1f03a5debee971fbbe28164b8ed965f2dcd89f8136fb9b74a`.
