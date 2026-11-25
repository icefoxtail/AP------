# 26_순천고_2학기_중간_고2_확률과통계_유사 — SVG 제작 후속 장부

- 원천 JS Blob SHA: `6c6120161d67ff6d9fb07b064847c37ba10d2c88`
- 학생용 문제·해설 48축 판정: 문제 BENEFICIAL 3 / EXEMPT 21 / REQUIRED 0; 해설 BENEFICIAL 2 / EXEMPT 22 / REQUIRED 0.
- 기존 원본 PNG 3개 q14·q16·q20 실제 확인; q16·q20만 수학 조건 일치로 재사용. q14 원본 PNG는 C 위치가 달라 재사용 금지.

| 항목 | plan 경로 | 현재 상태 | 다음 엔진 작업 |
| --- | --- | --- | --- |
| Q14 문제 | `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사_plans/q14-problem.plan.json` | SVG_TO_CREATE / 렌더·PNG NOT_RUN | 좌표 C=(0,3)·정답 비노출 확인 |
| Q14 해설 | `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사_plans/q14-solution.plan.json` | SVG_TO_CREATE / 렌더·PNG NOT_RUN | C 진입 금지의 동치성과 도착점 231 검증 |
| Q20 해설 | `archive/exams/similar/high/h2/2mid/26_순천고_2학기_중간_고2_확률과통계_유사_plans/q20-solution.plan.json` | SVG_TO_CREATE / 렌더·PNG NOT_RUN | AD 지름·ABD 직각 표시와 원주 순서 확인 |

- 공식 plan-lint `--shallow`: Q14 문제 PASS, Q14 해설 PASS, Q20 해설 PASS (3/3).
- 공식 plan-lint full: Q14 문제 PASS, Q14 해설 PASS; Q20 해설은 엔진 임시 의존성 `NotoSansKR.ttf` 파일 부재(ENOENT)로 BLOCKED. 이 플랜의 full PASS는 아님.
- 렌더 및 그림 PNG 육안 검수는 0/3, 모두 NOT_RUN. 새 SVG는 생성·연결하지 않았음.
- q16 문제 PNG와 q20 문제 PNG의 기존 연결 2건은 기존 원본 파일을 직접 열어 형상을 확인함.
- plan-lint와 렌더는 각각 별도 명령을 실행한 후 실제 결과로만 갱신할 것.
- REQUIRED 누락은 0. 계획 단계와 실제 시각 검수 완료는 구별한다.
