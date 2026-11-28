# 2022 매산고 1학기 기말 고2 수학Ⅰ 유사 — 공식 SVG production 2축 감사

## 범위·선정

- 제작 기준: `archive/exams/similar/high/h2/1final/22_매산고_1학기_기말_고2_수학I_유사.js`의 **21문항·42축**. 원본 기출 JS는 변경하지 않고, 기출 그림은 비교 증거로만 사용했다.
- 고2 유사시험지 **전체 과목·전체 시기**(`high/h2/1mid`, `1final`, `2mid`, `2final`)를 최신 GitHub `main`과 열린 PR에서 조회하여 사전순 미완료·비충돌 두 건을 선정했다. 같은 사이클의 다른 대상은 `22_순천고_1학기_기말_고2_수학I_유사`이다. Windows 로컬 큐는 읽지 않았다.
- 비교: 대응 기출 `archive/assets/images/22_매산고_1학기_기말_고2_수학I/`의 PNG와 해설 SVG(`q16-solution-v2.svg`, `q19-solution-v2.svg` 포함), 직접 연결 유사 SVG `archive/assets/images/22_매산고_1학기_기말_고2_수학I_유사/`의 q16·q19·q20, 레거시 `archive/exams/similar/high/h2/1final/22_매산고_1학기_기말_고2_수학I_유사_plans/`의 3개 JSON. 기존 공식 plan **0개**였다.
- `REQUIRED`: 그림 없이는 조건의 복합 공간 관계를 확실히 전달하기 어렵다. `BENEFICIAL`: 그림이 조건 파악 또는 풀이 이해를 실질적으로 돕는다. `EXEMPT`: 식·문장으로 충분하다. 문제축과 해설축을 서로 독립 판정한다.

## 문항별 독립 판정(문제축 / 해설축)

| 번호 | 문제축 | 해설축 |
|---|---|---|
| 01 | EXEMPT — AB=6, BC=7, ∠B=30°가 완결된다. | EXEMPT — 삼각형 넓이 공식의 단일 대입. |
| 02 | EXEMPT — 세 변 a=5,b=6,c=7만 주어진 코사인 값. | EXEMPT — 코사인법칙 한 번 대입. |
| 03 | EXEMPT — 등차수열의 첫 항 35, 공차 −4. | EXEMPT — 39−4n<0 부등식. |
| 04 | EXEMPT — 두 시그마 합과 제곱식. | EXEMPT — 다항식 전개·합의 선형성. |
| 05 | EXEMPT — 등차·등비 네 항의 순서가 명확하다. | EXEMPT — 공차 6과 양끝항의 곱 이용. |
| 06 | EXEMPT — 첫 항·점화식으로 등비수열 정의. | EXEMPT — 지수 6−n=2 해결. |
| 07 | EXEMPT — 삼각형 A, a, b 및 C의 둔각 조건이 문장으로 충분하다. | EXEMPT — 사인법칙과 내각의 합으로 계산. |
| 08 | EXEMPT — 이중 시그마 합의 대수식. | EXEMPT — 제곱합과 세제곱 합 계산. |
| 09 | EXEMPT — 양 끝 수 사이에 넣는 20항을 명확히 정의. | EXEMPT — 공차·등차수열 제곱합. |
| 10 | EXEMPT — 9,11,99,101,…의 쌍을 수열로 제시. | EXEMPT — 10의 거듭제곱 쌍별 합. |
| 11 | EXEMPT — 한 변 8 정삼각형, P∈AC라는 조건이 충분하다. | EXEMPT — AP=x와 코사인법칙으로 완전제곱식; 추가 도해 없이 최소 56 확인. |
| 12 | EXEMPT — 부분합 S_n=n²+2n과 교대 합. | EXEMPT — a_n=2n+1 대입. |
| 13 | EXEMPT — a_n 일반항과 요구 식이 모두 수식. | EXEMPT — 지수항 변환으로 연산. |
| 14 | EXEMPT — P₁=(1,1), 수선의 발, 3:1 내분점, y=x²와 수평 이동 순서를 말로 완전 규정. | EXEMPT — M_n의 y좌표 a_n²/4를 바로 구해 등비급수로 계산; 실제 위치는 최종 합에 영향 없음. |
| 15 | EXEMPT — 두 등차수열의 합 S_n,T_n 조건. | EXEMPT — 두 이차식의 계수 관계로 판단. |
| 16 | **REQUIRED** — 같은 반지름 3의 다섯 원·삼각형 세 변에 대한 접선·외접의 다중 관계를 재현: `q16-problem.plan.json`. | EXEMPT — 중심 좌표차 (15,3√3), (3,−3√3), 사인법칙으로 수식 유도. |
| 17 | EXEMPT — 등비수열 a_n=5·3^(n−1). | EXEMPT — 첫 항과 공비의 곱. |
| 18 | EXEMPT — 부분합 분모가 주어진 수열. | EXEMPT — 2/k(k+1)의 망원합. |
| 19 | **BENEFICIAL** — 원에 내접하는 볼록사각형, AB=AD, AC=12 및 두 대각선의 배치: `q19-problem.plan.json`. | EXEMPT — 넓이=36·BD/R과 비 5:3을 대수로 유도. |
| 20 | **BENEFICIAL** — 호수 원 위 세 지점·AB=14m, AC=10m, ∠BAC=60°: `q20-problem.plan.json`. | EXEMPT — 코사인·사인법칙과 원의 넓이 연속 계산. |
| 21 | EXEMPT — 정수 수열의 세 분기 점화조건. | EXEMPT — 3의 배수 귀환과 부분합 추론. |

**계:** 21문항·42축, `REQUIRED 1 / BENEFICIAL 2 / EXEMPT 39`. 실행형 공식 JSON **3개(문제축 3, 해설축 0)**; 모두 레거시 실행형을 원문과 재대조해 공식 폴더에 신규 승격. 기존 공식 JSON 보존 0·수정 0.

## 원본 자산 충돌·변형 비교

- `ORIGINAL_EXAM_PNG_CONFLICT`는 **기출 수치와 현행 유사 수치의 차이**로 분리: 기출 `q20.png`에는 AB=10m, AC=8m, ∠A=60°이나 유사에는 14m,10m,60°. `q16.png`는 다섯 원의 배치·접관계 원형이고 유사는 각 원 반지름 3을 제시한다. 해당 기출 수치를 공식 유사 plan에 복사하지 않았다.
- `q16-solution.svg`와 `q16-solution-v2.svg`, `q19-solution.svg`와 `q19-solution-v2.svg`는 같은 기출의 서로 다른 구성·표기 버전이다. **`ORIGINAL_EXAM_SVG_VARIANT_CONFLICT`로 별도 관리**한다. 이들은 현행 유사 JS의 수치·해법보다 우선하지 않으며, 해설 유도값을 문제축에 노출하지 않았다.
- `CONTENT_CONFLICT_SOURCE`: 현행 JS의 조사 문항에서 확정된 문제/답/해설의 수학적 자기모순 없음. 과목 단원 태그와 삼각형 내용이 맞지 않는 일부 메타데이터는 그림의 수학 사실이 아니며 허용 범위 밖이므로 고치지 않음.
- `ENGINE_CAPABILITY_PENDING`: **없음**. 해당 3개 문제의 기하 관계는 기존 `construction-spike-v1`로 정확히 표시된다.

## 독립 검산·정적 재현

- `q16-problem`: 연속한 C₂~C₅ 중심 간 간격 6, C₁과 C₄·C₅ 중심 거리 각각 6. 두 비평행 변에 대한 접관계로 ∠C=60°, tan∠B=√3/5, sin A=3√3/(2√7)을 얻는다. AB=2k√7이면 BC=6k, 면적=3√3 k²(정답 ⑤). **문제축에 이 결과값이나 풀이 중간값을 표시하지 않음.**
- `q19-problem`: 대표 좌표 O=(0,0), A=(6√2,0), C=(0,6√2), B=(√22,5√2), D=(√22,−5√2)에서 AC=12, AB=AD, 면적 60, BD/R=5/3, p+q=8. 이 좌표는 원문을 만족하는 예시이며 모든 사각형이 특정 좌표라고 주장하지 않는다. 문제축에 R·BD의 계산값 없음.
- `q20-problem`: A=(0,0), B=(14,0), C=(5,5√3). AB=14, AC=10, ∠A=60°. BC²=156, 외접 반지름 2√13, 원 넓이 52π로 현행 정답과 정합. 답의 원 넓이·반지름을 문제축에 표기하지 않음.
- 나머지 수식 중심 문항도 현행 JS의 선택지·정답·해설을 재검토: q01=21/2, q02=5/7, q03 첫 음수 제10항, q11 최소 56, q14 `3S=4−(1/4)^9` 등 일치.
- `STATIC_FIELD_PARITY`: **3/3 PASS** — `sourceConditions`, caption, 대체텍스트, 반지름/길이/각 표시, 접원·대각선 구조를 현행 JS·직접 연결 유사 SVG와 일대일 확인.
- `DRAWN_FEATURE_PARITY`: **3/3 STATIC_INVENTORY_PASS** — 필드 수준의 선분·원·각도·동일 길이 표시 목록 확인. **ACTUAL_SVG_VISUAL_REVIEW_NOT_RUN**; 정적 통과를 실제 그림의 시각 통과로 주장하지 않는다.
- JSON 구문·엔진 계약 및 공식 Shallow lint **3/3 PASS**, Full lint **3/3 PASS**. `/usr/bin/chromium --version` 재검사에서 래퍼는 있지만 `/usr/lib/chromium/chromium` 실행 파일이 없어 종료 실패. 실제 SVG 렌더·픽셀 검수 **3/3 `RENDER_NOT_RUN`**.
