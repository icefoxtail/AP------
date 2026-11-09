# 20 매산고 고1 1학기 기말 입력 초안 보존

DRAFT_ONLY / NOT_READY. 공식 렌더·시각검수·독립 전체 수학검토·학생 게시·구현자 인계 완료를 뜻하지 않는다.

- 시험지 원문: archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js
- 기준 브랜치: codex/svg-triage-20261107
- 부모 커밋: 9e1c373355f7f90a23e36535ef2963fbb891cce8
- 로컬 package-manifest.json SHA-256: 9501d13bc1e50f9847e9d18ec5572636f9b6ec7cd82e5e5dbf49c592fb20f7a2
- OPEN18: Q03~Q20. 각 문항의 item.json·plan.json·publish.json·STATUS.md 72파일, 총 198,838바이트를 기존 바이트 그대로 보존한다.
- [판정·입력 검사 요약](ROOT_DRAFT_SUMMARY.md)과 [Q01·Q02 EXEMPT 판정 사유·원문·해설](EXEMPT_ASSESSMENT.json)을 함께 보존한다. 두 문항의 신규 그림 입력은 만들지 않는다.
- 72파일과 연결 근거 8파일의 크기·SHA-256을 기존 manifest와 대조해 모두 일치했다. 기존 자산 24개(구형 SVG 18개·원문 PNG 6개)는 기준과 원격 브랜치의 SHA가 모두 일치함을 확인했다.
- 준비 작업은 현재 54개 JSON에 결속된 해당 입력 함수 검사 18문항 PASS를 기록했다. 초기 실패·최소 정정·재검 결과는 기존 기록에 유지한다. 이번 보존은 검사를 반복하거나 품질 상태를 올리지 않는다.
- Q12의 a=2는 가능한 예시이며 a=-2도 가능하다. Q14는 포물선 없는 부분 구성, Q18은 u=k² 표현, Q20은 매개변수 표시라는 범위 제한을 유지한다.
- 기존 SVG·PNG·원문 JS·다른 입력·판정표·엔진·ledger·대기열은 변경하지 않는다. 원시 검사 로그는 이 커밋에 넣지 않는다.
- 요약·STATUS의 LOCAL_ONLY·원격 쓰기 없음 등은 준비 당시 기록이다. 이번 작업은 해당 바이트의 브랜치 보존만 추가한다.
- main 병합·기존 파일 교체·engine.prepare/build/render·시각검수·독립 전체 수학검토·CI 실행·학생 게시·구현자 인계는 수행하지 않았다.
