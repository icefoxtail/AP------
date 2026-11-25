# 금당고 고2 대수 유사2 — R1 독립검수 수리 완료 기록

- 기준 `main`: `5dd08baffbe361ed7d56c409856f0ae8059acc34` (2026-11-25 작업 시작 조회).
- 제작 PR: [#2934](https://github.com/icefoxtail/AP------/pull/2934), 기존 운영본 Git blob `0639b822a47770d1564ef379c0e1e707d27e103f`.
- 최종 수정본 JS Git blob: `483284195ebf7124bf09be6e45d129773ead0c26`, SHA-256: `305b49b37f1a6ed589a834b3077c224a0befdad1b18b5619a4793d303d5f4d70` (병렬 SVG 작업과의 충돌을 정합하게 해결한 판본).
- 독립 R1 물리 증거: [r1-review-evidence.json](r1-review-evidence.json) — `questionRows=21`, `metaRows=21`, `visualRows=0` (운영 JS에 연결된 해설 SVG가 없음), `itemHoldCount=0`. Q21의 **연결 전** 실제 SVG 내용 확인은 `auditNotes.unlinkedExternalSvgPhysicalReview`에 별도 기록.
- 정답·보기 수정은 Q08, Q19에서 수행했으나 정답 **번호** ②/①을 유지. 나머지 수학정답 번호는 그대로. 객관식 19문항 분포 ①5·②3·③4·④3·⑤4, 서술형 2, 총점 100점.

## R1에서 확인한 결함과 수리

| 문항 | 변경 전 결함 | 변경 후 실제 개선 |
|---|---|---|
| Q02 | 결정 단계 문구만 있고 식 없음 | 로그 차·밑변환·64 역산의 결정식 기입 |
| Q03 | 지수함수 역함수 문제를 로그함수 H22-A-03/RPM-087로 오분류 | 지수함수 H22-A-02/RPM-081로 재결속, 결정식 및 4slot 조건 보완 |
| Q04·Q05 | 실제로 사용하지 않은 원점대칭·코사인 태그 | 4slot methods에서 불필요한 태그 제거 |
| **Q08** | `2^3/2^1` 직접 대입만 하면서 bucket3·RPM-080 평행이동 유지 | `y=2^x+3`의 P 세로좌표 7로 x를 역산, Q 가로좌표 4로 y를 대입하여 `q-p=17` 계산. `PT_FUNCTION_GRAPH_TRANSFORM/TPL_FUNCTION_GRAPH_TRANSLATION` ACTIVE 연결 및 보조 그래프 plan 갱신 |
| **Q09** | 점근선과 절편을 단순 숫자치환한 원본 중복, '진수 조건' TPL 오판 | 두 점 (9,0),(33,2)의 로그값 차로 `h=6,k=-1` 복원. `PT_FUNCTION_GRAPH_TRANSFORM/TPL_FUNCTION_GRAPH_TRANSLATION`와 4slot 차 목표로 재결속 |
| Q10·Q12·Q16·Q21 | `decisiveStep`이 결정적 계산식 이전에 끝남 | 각각 sc, 완전제곱, tanθ, 절댓값 이차식의 결정 계산 보완. Q21 불사용 인수분해 태그 제거 |
| Q15 | 목표가 `M/m` 비인데 최솟값 태그만 존재 | 4slot goal을 비/값으로 수정 |
| **Q17** | 원본보다 쉬운 ㄱㄴㄷ 지역 계산, bucket4 불균형 | 원소 수 5구간 전수 분류 및 홀수 개수(135), 원소2 조건(6..12), 3의 배수(44) 판단. ㄴ만 참이며 독립 단락 구조 유지 |
| Q18 | 로그방정식 치환 TPL, 모든 t의 항상성립 태그 잔존 | 그래프 평행이동·반사 ACTIVE 유형 및 두 높이·반대편 조건에 맞는 4slot으로 교정 |
| **Q19** | `f\mapsto-f`는 `g=a^{|f|}`를 바꾸지 않으므로 구조 변형이 아닌 수치치환 | `f=8-(x-k)^2`로 교체하고 `(x-k)^2=8\pm h`의 3교점 임계 판정. `k=-2,2,6`, 차8. 그래프 교점 ACTIVE 유형/4slot/수직선 SVG 계획 변경 |

## 문항별 정답 검산

| 문항 | 재계산 결론 | 작은칠판 |
|---|---|---|
| Q01 | ① | KEEP·독립검산 |
| Q02 | ③ | KEEP·독립검산 |
| Q03 | ④ | KEEP·독립검산 |
| Q04 | ① | KEEP·독립검산 |
| Q05 | ④ | KEEP·독립검산 |
| Q06 | ③ | KEEP·독립검산 |
| Q07 | ⑤ | KEEP·독립검산 |
| Q08 | ② | 재설계·독립검산 |
| Q09 | ⑤ | 재설계·독립검산 |
| Q10 | ④ | KEEP·독립검산 |
| Q11 | ③ | KEEP·독립검산 |
| Q12 | ① | KEEP·독립검산 |
| Q13 | ⑤ | KEEP·독립검산 |
| Q14 | ① | KEEP·독립검산 |
| Q15 | ③ | KEEP·독립검산 |
| Q16 | ⑤ | KEEP·독립검산 |
| Q17 | ② | 재설계·독립검산 |
| Q18 | ② | KEEP·독립검산 |
| Q19 | ① | 재설계·독립검산 |
| Q20 | 22 | KEEP·독립검산 |
| Q21 | $\dfrac{19}{16}$ | KEEP·독립검산 |

## 메타 및 해시 결속

- 21문항 모두 `questionUid/sourceQid`를 보존. 새 JS/소형 메타/4slot/Experience Ledger/Review Receipt에 새 Git blob SHA 결속.
- 실제 풀이에서 출발해 GLOBAL ACTIVE PT/TPL status, TPL parent, `2022 대수` curriculum binding을 각각 검증: **21/21 정합**.
- 등록 전 소형 메타 `approval.reviewStatus=review_required`는 사용자의 명시적인 등록 승인 없이 임의로 APPROVED로 바꾸지 않았음.
- 4slot의 주어진 조건·목표·방법·조건 ID를 정본 `term-dictionary-v1.6`으로 재판정하고 메타/별도 4slot 파일의 항목을 **21/21 일치**시킴.
- Golden 26 강남여고 대수·26 효천고 대수, Negative 복성고 false PASS fixture를 SHA/blobs와 함께 비교. 해설의 수학·학생 재현성을 전 문항 재검.

## 검증

- `node --check <exam.js>`: PASS.
- `node tools/harness/verify_similar_exam.mjs <exam.js>`: GATE_PASS 21문항 100점.
- `node archive/tools/similar-import/choice-order-check.mjs judge <exam.js>`: PASS 19객관식 결함0.
- `node archive/tools/review-evidence-gate.mjs --exam <exam.js> --evidence <r1-review-evidence.json> --stage R1`: **PASS**, itemHoldCount0.
- `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <3 SVG pending plan>`: PASS 3/3.
- 깊은 plan-lint: Q19 OK, Q08·Q21은 실행 환경 `NotoSansKR.ttf` 부재로 검사 불가(모델/수학 실패 아님).
- 브라우저 MathJax 실제 렌더: **NOT_RUN**. 병렬 SVG 라인에서 실제 제작한 Q08·Q19·Q21 그림을 최종 R1 문제 조건과 PNG로 재대조함. Q08의 옛 `y=2^x` 그림은 수리한 `y=2^x+3`과, Q19의 옛 `k=-8,2,12` 그림은 수리한 `k=-2,2,6`과 불일치하므로 **Q08/Q19 링크 제거·SVG_TO_CREATE/NOT_RUN 유지**. Q21 그림은 교점 (1/4,5/16),(3/4,5/16)과 식·라벨이 일치해 PNG 실물 내용 검수 PASS지만 정규 `q21-solution.plan.json`이 EXEMPT라 링크가 하네스 FAIL이다. 임의로 운영 계획을 승인하지 않아 **Q21도 JS에 미연결**. 세 파일은 기존 `main`에 보존.

## 병렬 운영병합 충돌 해결(2026-11-25)

- R1 브랜치 업로드 중 병렬 SVG 제작 커밋 `4eb4cfd`가 먼저 `main`에 병합되어 동일 시험지 JS/후속 계획에 변경이 발생함. 단순 자동병합하면 Q08·Q19에서 정답을 유도하는 그림과 해설이 서로 다른 조건을 가리키는 문제이므로, 두 옛 SVG는 보존만 하고 JS 연결을 취소함.
- Q21만 수학적 동치(`Q(u)=u^2-u+1/2=5/16`)를 좌표 계산과 Inkscape 실물 PNG로 검증했지만, 정규 해설 계획 `EXEMPT`에 의해 JS 연결을 보류. 물리 검수는 R1 evidence의 별도 `auditNotes`에 SHA-256과 함께 보존하고, 연결 시각행 `visualRows`는 정확히 0으로 기록함.
- 메타·4slot·ledger·receipt·R1 evidence의 Git blob SHA와 시험지 SHA-256을 최종 JS에 다시 결속함. Q08/Q19의 SVG 재제작은 후속 과제로 남겨두며 수행 전 PASS라고 표시하지 않음.

## 운영병합 경계

R1 물리증거 검증은 무결함 PASS이며 학생용 JS에 필요한 그림/정답 누락 없음. `main` PR 병합·원격 readback 및 CI/Pages는 GitHub 작업의 실제 결과대로 별도 보고. R1 검수 통과가 브라우저 SVG 렌더/Pages 배포 PASS를 의미하지는 않음.
