# 26_순천고_1학기_중간_고2_대수_유사2 SVG 후속

- Q05 해설 선택 보조 그림: SVG_TO_CREATE / NOT_RUN — q05-solution.followup.plan.json, 공식 plan-lint --shallow PASS, 전체 검증은 정본 NotoSansKR.ttf 글꼴 해시 잠금 부재로 FONT_HASH_LOCK_REQUIRED (NOT_RUN); 엔진 렌더·PNG 검수·연결 검토 필요
- Q15 해설 선택 보조 그림: SVG_TO_CREATE / NOT_RUN — q15-solution.followup.plan.json, 금지된 라벨 문자 수정 후 공식 plan-lint --shallow PASS, 전체 검증은 정본 NotoSansKR.ttf 글꼴 해시 잠금 부재로 FONT_HASH_LOCK_REQUIRED (NOT_RUN); 엔진 렌더·PNG 검수·연결 검토 필요
- Q20 해설: DONE / ARCHIVE_BOUND — `multi-curve-figure-v1` `ABSOLUTE_VALUE` 지원 추가(#2953) 후 공식 엔진 렌더·PNG 검수·JS 연결 완료
- 문제용 24건: EXEMPT (필수 조건이 발문 텍스트에 있음), 누락된 필수 그림 0건
- 해설용 Q05/Q15: 현재 판서형 텍스트로 완결되어 정식 qNN-solution.plan.json은 EXEMPT, 별도 후속 보조 plan 보유
- 해설용 나머지 21건: EXEMPT, 수식 판서만으로 완결
- 실제 SVG 렌더·PNG 육안 검사·학생용 그림 게시: 전부 NOT_RUN
- 존재하지 않는 SVG 경로는 JS에서 참조하지 않음

## 공식 SVG 엔진 제작·검수·JS 연결 완료 (2026-11-25)

- 전체 `plan-lint.cjs`(NotoSansKR.ttf 포함): **2/2 OK**
- 공식 `render-plan.mjs`: **2/2 ARCHIVE_BOUND**
- `assertSvgStudentLanguage`: **2/2 PASS**
- PNG 실물 육안 검수: **2/2 PASS**

| 문항 | 축 | 엔진 결과 | 크기 | PNG 검수 | 연결된 JS 경로 |
| --- | --- | --- | --- | --- | --- |
| Q05 | solution | `ARCHIVE_BOUND` | medium | PASS | `assets/images/26_순천고_1학기_중간_고2_대수_유사2/q05-solution.svg` |
| Q15 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_순천고_1학기_중간_고2_대수_유사2/q15-solution.svg` |
| Q20 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_순천고_1학기_중간_고2_대수_유사2/q20-solution.svg` |

## 2026-11-26 FIRST_FORMAL 정본 결속 확인

- Q05·Q15: 기존 후속 실행 가능 plan을 현재 운영 JS의 정본 `q05-solution.plan.json`/`q15-solution.plan.json`에 동일 수학 모델로 반영하고 `sourceQuote`를 현행 작은칠판 해설과 실제 일치하도록 교정. 두 plan은 공식 shallow/full lint를 각각 통과함.
- Q20: `multi-curve-figure-v1` `ABSOLUTE_VALUE` 지원(#2953) 반영 후 정본 `q20-solution.plan.json` 작성·공식 엔진 렌더(`ARCHIVE_BOUND`)·PNG 육안 검수·`engine_evidence` 확보·JS 연결 완료.
- 24개 문제 축과 24개 해설 축의 현행 판정은 대상 `.svg-followup-ledger.json` 참조(45 EXEMPT / 2 VALID_OFFICIAL_PLAN / 1 ENGINE_CAPABILITY_PENDING).
- 이번 GPT 검수의 새 SVG 렌더·PNG 육안 확인은 **NOT_RUN**. 위 2026-11-25 엔진 담당의 과거 기록을 이번 새 검수 완료로 재표기하지 않음.
