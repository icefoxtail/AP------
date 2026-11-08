# Q05 검수 기록

- 기대 관계: `y=√(a+x)` 위의 `(3,5)`와 역함수 위의 `(5,3)`이 `y=x`에 대칭으로 대응한다.
- 확인: `(3,5)`를 원함수에 대입하면 `5=√(a+3)`, 따라서 `a=22`, 정답 ⑤이다. attempt-09는 P/Q 대응점을 내부에 두고 두 그래프 가지를 프레임 가장자리까지 연장했다. 등축척과 라벨 귀속은 독립 검수에서 확인됐다.
- 정답 노출: candidate SVG·title·desc·alt에 `a=22`나 보기 번호가 없다. caption 끝에 정답 ⑤가 있다.
- 수리: reviewer가 발견한 내부 끝점 오해를 없애기 위해 plan-r8에서 곡선 구간을 연장한 뒤 공식 렌더했다. 이 인계 브랜치에서 원본 JS·자산은 수정하지 않았다.
- OPEN/NOT_RUN: 최종 DOM/ARIA 연결, qualification, publication은 미실행이다.
- figure-solution.svg SHA-256: `3eaa52bd76eb12e9ac01988f29a1dfdb7c6c04b97cd944bd89b303d7aaf92f41`.
