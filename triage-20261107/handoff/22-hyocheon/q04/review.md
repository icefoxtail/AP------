# Q04 검수 기록

- 기대 관계: `y=(2−5x)/(x−1)=−5−3/(x−1)`의 중심 `(1,−5)`와 그 점을 지나는 기울기 `1`, `−1` 대칭축을 보여 준다.
- 확인: 점근선은 `x=1`, `y=−5`; 대칭축은 `y=x−6`, `y=−x−4`이다. 따라서 `a=−6`, `b=−4`, `a+b=−10`, 정답 ①이다. attempt-09의 실제 SVG·after 및 receipt 해시가 일치하고, 축·두 가지·교점이 프레임 안에 있다.
- 정답 노출: candidate SVG·title·desc·alt에 `a+b`, `−10`, 보기 번호가 없다. caption 끝에 정답 ①이 있다.
- 수리: attempt-09는 점근선 라벨과 중복된 눈금을 정리한 공식 렌더 출력이다. 기존 `q04-solution.svg`에는 `a+b=−10`이 남아 있어 이 candidate가 교체 제안이다. 원본 JS·자산은 이 인계 브랜치에서 수정하지 않았다.
- OPEN/NOT_RUN: source JS가 기존 자산을 계속 가리키며 DOM 통합, qualification, publication은 미실행이다.
- figure-solution.svg SHA-256: `181a602605a49b7b1740a38fee8fcc8ff4e30fcef5aa8b8429fc5278375f0430`.
