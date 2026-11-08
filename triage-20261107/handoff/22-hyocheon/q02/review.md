# Q02 검수 기록

- 기대 관계: `f(x)=(5x+1)/(2x−3)`와 역함수 `g(x)=(3x+1)/(2x−5)`의 그래프가 `y=x`에 대칭이고 수직·수평 점근선이 서로 바뀐다.
- 확인: `f`의 점근선은 `x=3/2`, `y=5/2`; `g`는 `x=5/2`, `y=3/2`이다. attempt-05의 SVG와 after 결과는 receipt 해시와 일치하고, 두 곡선·대칭축·점근선이 구분된다.
- 정답 노출: SVG·title·desc·alt에 정답 `−1`이나 보기 번호가 없다. caption 끝에만 정답 ②가 있다.
- 수리: attempt-05 plan에서 역함수 라벨을 중립적인 `y=g(x)`로 바꾸고 접근성 설명을 보완했다. 이 인계 브랜치에서는 원본 JS와 기존 자산을 수정하지 않았다.
- OPEN/NOT_RUN: 독립 역함수 관측, 브라우저 글꼴 측정, DOM 통합, qualification, publication은 미실행이다.
- figure-solution.svg SHA-256: `6aeddb16704e195c26dff15017b03df00bed733282560f04c051613c85ebd1a2`.
