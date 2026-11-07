# 22 강남여고 고1 고사: ROOT 입력 수납

- 기준 원문: `archive/exams/original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js`
- 입력 계획은 사용자 제공 메시지를 작업 branch에 옮긴 것이다. 이 repo clone에는 원래 `svg-plan-staging/` 파일이 존재하지 않았다.
- 전달된 `item/plan/publish` JSON은 Q1–Q8, Q10, Q12–Q18, Q20, Q22–Q24 (20문항)다. Q9, Q19, Q21은 ROOT_PLAN 항목만 있고 엔진 JSON 입력은 받지 않아 생성하지 않았다. Q11은 기존 직접 검수 PASS 상태를 그대로 유지한다.
- 현행 원문 blob은 계획 기준 blob과 동일하며 exam ledger는 `NOT_IN_LEDGER`; main에 이미 연결된 해설 SVG는 Q5, Q11, Q15, Q18, Q22다.
- 실행 기록: calibration preflight PASS; 공식 setup script는 pinned npm/Python 의존성 설치 뒤 NotoSansKR font fetch에서 `raw.githubusercontent.com` DNS `EAI_AGAIN`으로 실패했다. 이어 공식 renderer에 Q1을 한 번 전달했으나 지정 Chromium 경로의 실행 파일이 없어 measure 단계에서 `FAILED`했다. 다른 23문항 render와 모든 PNG 학생 화면 확인은 `NOT_RUN`; SVG 출력은 만들지 않았다.
- 요청상 review candidate를 보존할 실제 엔진 SVG는 생성되지 않았다. 제출 상태/다음 조치는 `STATUS.md` 및 문항별 STATUS를 따른다.
- main 병합, PR, 게시, JS 변경은 하지 않았다. Claude의 독립 검수·수정과 main 반영 전 상태다.
