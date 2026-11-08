# 22 효천고 고1 2학기 기말 — Claude 인계

- 원본 JS: `archive/exams/original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js`
- 원본 JS Git blob (latest main): `193acbc5bb7eea4a61e5369aa926201300b02ce3`
- 시작점: `origin/main` `c380fe2eb7d7e958ed504b263f29726a106c244e`
- 브랜치: `codex/svg-review-22-hyocheon-handoff-20261108`
- 입력·triage 기준: `codex/svg-triage-20261107` HEAD `51b75ac0ef372d32a633b1e886ff9a71a85beecd`, QUEUE blob `8cf9ba6a2de98d2577c445539d20f2cc9a890baa`
- 핸드오프 콘텐츠 커밋 SHA: `c55bb4d7046b7084ff37b97df1d2f08860cbf124`

상태표의 렌더 횟수는 이번 후보 attempt 기준이다. `UNKNOWN`은 기존 이력을 재구성하지 않았다는 뜻이다. 이 브랜치는 `triage-20261107/handoff/22-hyocheon/`만 포함하고, 원본 JS·`archive/assets/`·대기열 상태는 변경하지 않는다. PNG·로그·캡처는 넣지 않았다.

| Q | 판정 | 상태 | 렌더 횟수 | 한 줄 사유 또는 남은 문제 |
|---|---|---|---:|---|
| 1 | KEEP_EXISTING | NOT_RUN | UNKNOWN | Claude 완료 이력을 보존; Codex 재검수하지 않음. |
| 2 | FIGURE | OPEN | 5 | 역함수 대칭 candidate는 수학상 통과; inverse observer·qualification·publication 미실행. |
| 3 | EXEMPT | PASS | 0 | 다항식 전개 항 계산으로 결정적 시각 관계 없음. |
| 4 | REPLACE | OPEN | 9 | 기존 `q04-solution.svg`에 `a+b=−10` 표기; candidate는 answer-free이나 DOM·qualification·publication 미실행. |
| 5 | REPLACE | OPEN | 9 | 기존 그림을 역함수 점 대응 candidate로 교체 제안; DOM·qualification·publication 미실행. |
| 6 | EXEMPT | PASS | 0 | 동전 조합·금액 계산으로 그림 불필요. |
| 7 | EXEMPT | PASS | 0 | 조합 공식 대입으로 그림 불필요. |
| 8 | EXEMPT | PASS | 0 | 순열식 항등 여부 계산으로 그림 불필요. |
| 9 | EXEMPT | PASS | 0 | 순열식을 이차방정식으로 푸는 문항. |
| 10 | EXEMPT | PASS | 0 | 원문 격자 단순 재현이므로 새 해설 그림 불필요. |
| 11 | KEEP_EXISTING | NOT_RUN | UNKNOWN | Claude 완료 이력을 보존; Codex 재검수하지 않음. |
| 12 | EXEMPT | PASS | 0 | 사전식 순서·팩토리얼 계산으로 그림 불필요. |
| 13 | FIGURE | OPEN | 8 | attempt-08은 plan-r7 출력; A/B·접근성 설명 수정 plan-r8은 미렌더. |
| 14 | EXEMPT | PASS | 0 | 여사건 경우의 수 계산으로 그림 불필요. |
| 15 | REPLACE | OPEN | 6 | 정답 구간을 제거한 SVG·alt/caption candidate는 2차 내용 검수 통과; post-edit DOM·qualification·publication 미실행. |
| 16 | REPLACE | NOT_RUN | UNKNOWN | 최신 입력 3종만 있음; 현재 draft `NOT_RENDERED`, candidate/result 없음. |
| 17 | KEEP_EXISTING | NOT_RUN | UNKNOWN | 기존 도로망 시각자료를 유지; 중복 경로 그림은 추가하지 않음. |
| 18 | REPLACE | OPEN | 5 | attempt-05 result는 medium; `<desc>` generic이고 DOM·qualification·publication 미실행. |
| 19 | KEEP_EXISTING | NOT_RUN | UNKNOWN | Claude 완료 이력을 보존; Codex 재검수하지 않음. |
| 20 | EXEMPT | PASS | 0 | 부분분수·망원합 계산으로 그림 불필요. |
| 21 | EXEMPT | PASS | 0 | 조별 인원 선택 경우의 수 계산으로 그림 불필요. |
| 22 | REPLACE | OPEN | 6 | candidate 내용 통과; 작은 미대칭 crop `OPEN_MINOR`, provenance 차이 `OPEN_NOTE`, qualification·publication 미실행. |

`OPEN`·`NOT_RUN` 항목은 해당 qNN 폴더의 입력과 review.md를 보고 이어서 수정·검수한다. 이 브랜치에서는 `main` 병합·게시를 하지 않는다.
