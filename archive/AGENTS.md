# Archive implementation instructions

상위 `AGENTS.md`와 `../docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 함께 적용한다. Archive 2.0 런타임 코드를 변경하기 전에 계약을 읽는다.

원본 기출을 열기 위한 브라우저 저장소 복사, 클릭마다 반복되는 전체 아카이브 검사, 저장소 장애·용량 초과로 출력 창이 닫히는 회귀를 허용하지 않는다. 새 기능을 위해 기존 안정 경로와 사용자 응답성을 희생하지 않는다.

화면·공통 엔진·출력·저장소 변경의 완료 조건은 `node tools/check-archive2-runtime.cjs` PASS와 해당 경로의 실제 브라우저 검증이다. 로그 없이 "문제없음"이라고 보고하지 않는다. 원본 내용·정답·해설, UID 순서, frozen snapshot 및 서버 권한 검증을 성능 개선의 대가로 바꾸지 않는다.

단순 원본 시험지 source/asset 검수는 기존 stage 품질 절차의 대상이며, 이 문서가 시험지별 전체 런타임 점검을 추가로 요구하는 것은 아니다.
