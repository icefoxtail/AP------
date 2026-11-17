# Batch64: 1순위 정리 (이름 있는 플랜 통합·DRIFT 확인·장부 OPEN 정리)

- 한 문항 한 장 규칙을 적용했다. 정답 숨김은 쓰지 않았다.
- 이름 있는 플랜(`-retro`, `-max/-min`, `-period-k`, `-falling/horizontal/rising`)은 공장이 읽지 못하므로 `qN-solution.json` 한 개로 통합했다. 옛 파일은 `history/batch64-consolidated/`로 옮겼다.
  - 복성고 2mid 고1 q13(벤 3패널 composite), q14(좌표 교점 4개), 제일고 20 2mid q5(벤 2패널), 제일고 21 2mid q10(포함관계 벤), 팔마고 2final 고2 q16(표본 직선 m=5/4로 교점·세 영역, b³/6=18), 순천여고 2final 고2 q18(한 주기 4영역, 합 23a/6), 강남여고 2mid 고2 q12(접선 방향 3패널 composite).
  - 렌더 시험(공장 렌더 도구, 1개씩): q13·q5·q10·q14·q12·q16·q18 모두 `ARCHIVE_BOUND`. 표본 PNG로 q13, q5, q14, q12, q16, q18을 직접 확인했다.
- DRIFT 26문항: 공장의 비교 기준이 c57e1a1 고정이라 그렇게 보일 뿐, 25문항은 이미 최신 main 원문으로 다시 쓴 플랜과 `source-revision.json`이 있고 그 원문이 지금 main과 같다(내용·정답·해설·보기 일치 확인). 왕운중 1mid q4만 `source-revision.json`이 없어 새로 적었다. 공장은 비교 기준을 각 시험지의 `source-revision.json`의 mainCommit으로 바꿔야 한다.
- 장부 OPEN인데 손대지 않은 26문항 중 고2 2학기 중간 수학II 22문항(매산고·매산여고·제일고)은 3순위(고2 원본)에서 쓴다. 나머지 5문항(중3)은 원문 모순·근거 없음이라 CONTENT로 남겼다.
- 플랜이 없다고 보이던 FIGURE 12개 중 5개(중3 문제 그림 플랜)는 이미 `-problem-retro` 이름의 문제 그림 플랜이 있어 해설 플랜은 추가하지 않았다.
- 실제 모바일 화면 확인은 공장 이후 단계의 몫이다.
