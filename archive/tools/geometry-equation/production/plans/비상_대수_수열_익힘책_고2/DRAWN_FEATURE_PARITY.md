# 비상 대수 · 수열 · 익힘책 · 고2 — DRAWN_FEATURE_PARITY

- 원문: `archive/exams/textbooks/비상교육_대수/비상_대수_수열_익힘책_고2/비상_대수_수열_익힘책_고2.js`
- 범위: **27문항 × 문제/해설 = 54축 전수 검수**. 이 표의 파일/qid `E/qXX`는 위 JS의 `id`를 뜻한다.
- 플랜 경로 열의 파일명은 이 Markdown 파일과 동일한 `production/plans/비상_대수_수열_익힘책_고2/` 디렉터리 상대경로다.
- 판정: `PASS` = 원문 조건에 대응하는 그림 요소를 실제 플랜 필드에 실음; `SOURCE_ASSET_KEEP` = 정상 에셋 유지; `NO_FIGURE_PASS` = 문제·해설이 도형 없는 텍스트·수식이며 그려야 할 원본 시각 요소 없음. `NO_FIGURE_PASS`는 실행하지 않은 플랜의 통과를 뜻하지 않는다.
- `plan-lint`의 `OK/OK`는 **shallow/full 두 모드 모두 OK**다. 실생성 화면·학생 뷰·인쇄 A4 육안 검증은 이 정적 원본/플랜 parity 감사에 포함하지 않는다.

| 파일/qid | 축 | 기존결함/판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| E/q01 | 문제 | 7의 거듭제곱 나머지; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q01 | 해설 | 거듭제곱 주기 계산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q02 | 문제 | 등차수열 두 항 조건; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q02 | 해설 | 공차·일반항 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q03 | 문제 | 등비수열 수치 조건; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q03 | 해설 | 지수 연산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q04 | 문제 | 3의 배수 합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q04 | 해설 | 등차합 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q05 | 문제 | 등차수열 부호·절댓값; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q05 | 해설 | 항의 대칭·공차 계산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q06 | 문제 | **q06.png 주변 글자 유입·표식/간격 식별 저하 → 전면 재설계** | construction-spike-v1 | `q06-problem.plan.json` | OK/OK | **PASS**: l,m·등간격 12수선·첫/끝 길이 12,6·a₁,a₂,a₃,a₁₂·직각 4개; 무채움 |
| E/q06 | 해설 | 대칭항 a₃,a₁₀ 관계를 텍스트만으로 설명 → 대표 수선 그림 | construction-spike-v1 | `q06-solution.plan.json` | OK/OK | **PASS**: 4개 대표 수선·대칭 두 항 강조·직각 4개·생략기호·a₃+a₁₀=18 및 8항 합 72 설명 |
| E/q07 | 문제 | 부분합에서 일반항 추론; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q07 | 해설 | 부등식/자연수 개수; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q08 | 문제 | 직육면체가 수치 대상이나 원본 이미지·그림 지시 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q08 | 해설 | 세 모서리의 등비수열 및 부피 식으로 완결 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q09 | 문제 | 등비수열의 변형; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q09 | 해설 | 첫항·공비 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q10 | 문제 | 공비 -2·부분합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q10 | 해설 | 등비합 풀이; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q11 | 문제 | **q11.png 정상**: 3×3 분할·가운데 한 칸 색칠은 원문 필수 정보 | SOURCE_ASSET_KEEP | 원본 `q11.png` 유지 | N/A | **SOURCE_ASSET_KEEP**: 3×3 경계 9개 중 중앙 1칸 채움 **의미상 필수**, 제거 금지 |
| E/q11 | 해설 | 단계별 8배 재귀·등비합 공식으로 완결; 원본 해설 별도 그림 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q12 | 문제 | 네 항 등비수열 경우의 수; 그림 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q12 | 해설 | 공비별 계수 계산; 그림 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q13 | 문제 | 등차수열 부분합 항등식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q13 | 해설 | 합 차 및 일반항 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q14 | 문제 | 정수 약수의 합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q14 | 해설 | 지수·등비합 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q15 | 문제 | 시그마 일차식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q15 | 해설 | 방정식 계산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q16 | 문제 | 다항식 시그마; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q16 | 해설 | 유한합 계산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q17 | 문제 | 2의 거듭제곱 시그마; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q17 | 해설 | 등비합 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q18 | 문제 | 귀납적 수열 정의; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q18 | 해설 | 대입 전개; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q19 | 문제 | 망원합 식; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q19 | 해설 | 인접항 소거; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q20 | 문제 | 등차수열 절댓값 합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q20 | 해설 | 부호 변경 항 8·9 경계는 수식으로 판정; 그림 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q21 | 문제 | 제곱근 분모 합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q21 | 해설 | 유리화·망원합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q22 | 문제 | 분수열의 합; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q22 | 해설 | 부분분수·소거; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q23 | 문제 | 근호 수열 귀납적 정의; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q23 | 해설 | 계수 곱 소거; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q24 | 문제 | 이차방정식 근 관계로 정의된 수열; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q24 | 해설 | 비에타·점화 계산; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q25 | 문제 | 문자 A/B 치환 규칙은 텍스트로 완결; **q25.png는 JS 미참조 고립 에셋** | N/A | — | N/A | NO_FIGURE_PASS / 미참조 에셋은 덮어쓰지 않음 |
| E/q25 | 해설 | A/B 개수 점화 전개; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q26 | 문제 | **q26.png가 타일 도형 대신 잘린 문제 글 위주 → 타일 식별 불가** | construction-spike-v1 | `q26-problem.plan.json` | OK/OK | **PASS**: 1×2 직사각형·2×2 정사각형 독립 외곽선, 두 타일 이름, 가로/세로 치수 1,2,2,2; 무채움 |
| E/q26 | 해설 | 타일 세 가지 말단 배치가 문장뿐 → 각 경우 직접 도식화 | composite-panels-v1 | `q26-solution.plan.json` | OK/OK | **PASS**: 세운 1장(폭1)·정사각형 1장(폭2)·누운 2장(각 2×1), 접두부·경계·경우의 수 aₙ₊₁,aₙ,aₙ; 무채움 |
| E/q27 | 문제 | 수학적 귀납법 부등식 증명; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |
| E/q27 | 해설 | 대수적 귀납 단계; 도형 없음 | N/A | — | N/A | NO_FIGURE_PASS |

## 1:1 원문·에셋 대조

1. `q06`: 12개의 수선, 동일 간격, 두 직선의 비평행, 첫·끝 길이와 중간 항의 등차 관계를 원문에서 확인했다. 문제 플랜은 12개를 **실제 수선으로** 그렸고 직각·길이 라벨을 결속한다. 해설 플랜은 일부만 대표로 보인다는 점을 말줄임표와 캡션에 명시한다.
2. `q11`: 원본 에셋 중앙 칸의 색은 규칙을 정의하는 **필수 면 채움**이므로 지우지 않았다. 나머지 면에 불필요한 흰색 채움을 추가하지 않는다.
3. `q25`: 같은 폴더의 `q25.png`는 시험지 JS의 실제 이미지 참조가 없으므로 이 요청에서 신규 시각 에셋으로 강제 연결하지 않는다.
4. `q26`: 타일 두 종류의 **형상과 치수**를 복원했다. 해설의 점화식은 오른쪽 끝의 세 경우를 서로 중복 없이 나누고, 각 경우에 남는 폭을 명시한다.

**계수**: 54축 = 재설계 플랜 **4축** + 원본 정상 에셋 유지 **1축** + 도형 없는 축 **49축**. 엔진 미지원으로 인한 `ENGINE_CAPABILITY_PENDING` **0축**. 전체 작업은 플랜 JSON/검수표에 한정하며 원본 JS와 이미지 파일은 수정하지 않았다.
