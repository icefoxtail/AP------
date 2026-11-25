# 2026 순천고 고2 대수 1학기 기말 유사2 SVG 후속 장부

- 적용 모드: `ALIVE EXAM_FOLLOWUP / SOURCE_BALANCED`
- 검토한 축: 24문항 × 문제/해설 = 48축. `EXEMPT` 41, `BENEFICIAL` 7, `REQUIRED` 0, `UNSUPPORTED` 0.
- 작성된 공식 엔진 `plan.json`: 총 48개(실제 도식 계획 7개, `status: EXEMPT` 계획 41개).
- 공식 `plan-lint.cjs --shallow` **48/48 PASS**. `plan-lint.cjs` 깊은 검사: `EXEMPT` 41 OK, 실제 도식 계획 7건은 엔진용 `NotoSansKR.ttf`가 현재 실행 환경에 없어 `ENOENT`로 중단. 내부 도식 오류를 PASS로 바꾸지 않는다.
- `verify_similar_exam.mjs --phase=draft`: 초기 23 FAIL에서 원문 인용·교육과정 pack 검증 오류를 실제 수정해 **잔여 15 FAIL**. 모두 활성 SVG의 실제 자산 `assetPath/engineEvidence` 부재(14건) 및 Q18 문제용 그림의 본문 연결 부재(1건)이며, 미렌더 항목과 일치한다. 본문·보기만으로 수학적으로 완결하지만 공식 출고 검증은 아직 통과하지 않았다.
- 실제 렌더 SVG: **0개**. `plan.json`은 렌더 SVG가 아니며, 독립 모델·사람의 블라인드 재풀이도 미실행.

| 문항 | 축 | 필요도 | 공식 plan | 얕은 lint | 깊은 lint | 렌더 | 후속 조치 |
|---:|---|---|---|---|---|---|---|
| Q05 | 해설 | BENEFICIAL | `q05-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q12 | 해설 | BENEFICIAL | `q12-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q15 | 해설 | BENEFICIAL | `q15-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q17 | 해설 | BENEFICIAL | `q17-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q18 | 문제 | BENEFICIAL | `q18-problem.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q18 | 해설 | BENEFICIAL | `q18-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |
| Q22 | 해설 | BENEFICIAL | `q22-solution.plan.json` | PASS | **FONT ENOENT** | **SVG_PENDING** | 정본 글꼴 설치 → deep lint → 공식 렌더/관측기 → 실제 자산 연결 |

## 학생 화면·운영병합 경계

문제용 `REQUIRED`는 0이어서 텍스트 문제는 완결된다. 다만 문제용 `BENEFICIAL` Q18 포함 도식 7건은 아직 학생 화면에 존재하지 않는다. 출고 `SVG_VISUAL_QA_DONE`·`FINAL_QA_DONE` 또는 학생 배포 완료라고 주장하지 않는다. main 병합은 별도 필수 CI 및 브랜치 보호 규칙을 실제 확인한 뒤에만 시행한다.
