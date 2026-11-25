# 2026 팔마고 고1 1학기 중간 발전형 유사2 — SVG 후속 장부

- 운영 JS: `archive/exams/similar/high/h1/1mid/26_팔마고_1학기_중간_고1_유사2.js`
- 제작 당시 고정 Git blob SHA-1: `366f43f6e677ab4c6c521fde000cdbadc891cd7b` (문항 발문·보기 결속 기준)
- 독립 R1 수정 후 JS Git blob SHA-1: `be4f3e46242d8993a9b34382ca07f3ebcb5c052b` (문항 내용·보기 동일, 해설·메타 분류 수정)
- 문제용 필수 그림: **0/22**, 전 문항 **EXEMPT** (발문에 필요한 함수식·좌표·구간을 모두 명시)
- 해설용 그림: **2/22 SVG_TO_CREATE**, 나머지 **20 EXEMPT**
- 실제 SVG 렌더: **0/2 NOT_RUN**, PNG 실물 시각검수 **0/2 NOT_RUN**, 게시 **NOT_RUN**
- 공식 plan-lint `--shallow` **2/2 PASS**; 전체 lint는 NotoSansKR.ttf 의존 파일 부재로 `ENVIRONMENT_BLOCKED` (기능적인 PASS라고 주장하지 않음)
- 실제 없는 `solutionImage`를 JS에 넣지 않았다.

| 문항 | 종류 | 계획 JSON | 상태 | 후속 작업 |
| --- | --- | --- | --- | --- |
| Q09 | 해설 | `q09-solution.plan.json` | `SVG_TO_CREATE` | 전체 plan-lint → 공식 엔진 SVG/PNG 렌더 → 최댓값 좌표 육안검수 → 참조 게시 |
| Q22 | 해설 | `q22-solution.plan.json` | `SVG_TO_CREATE` | 전체 plan-lint → m=±1,0 구간별 경계 검증 → 공식 엔진 렌더·실물검수 → 참조 게시 |

후속 작업자는 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`의 절차와 정본 엔진만 사용한다. 계획 JSON은 제작 결과가 아니며 해설 SVG 시각 검수 완료로 간주하지 않는다.

## 독립 R1 확인 (2026-11-25)

- Q09·Q22 계획과 현재 해설의 의미를 대조했다. Q22 `sourceQuote`는 해설 변경 후 실제 문구에 맞춰 수정했다.
- 공식 `plan-lint.cjs --shallow` 재실행 결과 **2/2 PASS**. **full lint는 실행했으나 `NotoSansKR.ttf` 의존 파일 부재로 2/2 `ENVIRONMENT_BLOCKED`**. SVG 렌더·PNG 실물 시각검수는 **NOT_RUN**, 미제작 자산은 여전히 연결하지 않았다.
- `verify_similar_exam.mjs --phase=draft`는 예상된 필수 시각증거 4건(Q09·Q22의 자산 연결 2건, 엔진 evidence 2건)으로 **FAIL**. 계획 존재와 시각검수 통과는 다르다.
- 문항별 증거: `R1_PHYSICAL_EVIDENCE.json`의 Q09·Q22는 `visualNecessity: HOLD`. R1 전체 결론은 `PASS_WITH_ITEM_HOLDS`이며 출고·운영 병합 허가가 아니다.
