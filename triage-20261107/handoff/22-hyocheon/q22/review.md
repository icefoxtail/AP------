# Q22 검수 기록

- 기대 관계: 자기역함수 `f(x)=(2x−1)/(x−2)=2+3/(x−2)`와 `y=x`의 대칭, 점근선 `x=2`, `y=2`, 고정점 두 개를 보인다.
- 확인: `f∘f=x`; 고정점은 `2±√3`, P/Q 사이 거리는 `2√6`, 계수 `a=2`, `b=−1`, `f(5)=3`이다. candidate SVG 좌표계의 x/y 단위는 각각 81.7778px이고, 두 고정점과 곡선·점근선 관계가 일치한다.
- 정답 노출: candidate SVG·title·desc·alt에 `3`이나 보기 번호가 없다. caption에는 답을 쓰지 않고 풀이 방향만 적었다.
- 수리: SVG는 attempt-06 공식 렌더 출력 그대로다. 1차 receipt의 legacy asset SHA 오기는 append-only correction-01로 정정했고, original receipt는 보존했다.
- OPEN/NOT_RUN: 실제 plot padding에 작은 미대칭 꼬리가 남아 `OPEN_MINOR`; attempt head의 provenance 표기도 OPEN_NOTE다. outer DOM/ARIA, font measurement, qualification, publication은 미실행이다. 시험지 잠금은 구현자 소유라 재렌더하지 않았다.
- figure-solution.svg SHA-256: `947703b21f38c86bf3ea4f80af99989e9cd04be25432a12ca2c5c78068c3e8a0`.
