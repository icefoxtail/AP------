# 24_매산여고_2학기_기말_고2_수학II_유사 — production SVG plan 전축 감사

- 재감사 기준: 원격 `origin/main` **e14c8ed3e07da646f4cdcc20faf9a40e9761623b** (2026-11-28 KST, 병합 전 조회)의 현행 JS 및 직접 연결 SVG. 기출 원본 `archive/assets/images/24_매산여고_2학기_기말_고2_수학II/q11.png` 및 기존 `_plans/`와 대조했다.
- 문제 **23축**, 해설 **23축**, 합계 **46/46축** 독립 재판정. **REQUIRED 1축**, **BENEFICIAL 12축**, **EXEMPT 33축**. 공식 production plan **13개**(문제 1·해설 12), **기존 13개 전부 유지·수정 0·신규 0**.
- JSON 파싱·필수 필드·`sourceConditions[].mappedTo` 경로 검사 **13/13 PASS**, shallow/full 공식 plan-lint **13/13 PASS** (FAIL/SKIP 0). `STATIC_FIELD_PARITY` **12 PASS, 1 PARTIAL(22번 F/f 표기)**, 면제 33 N/A. 실제 production 렌더 SVG/PNG·학생 화면·A4 관측 **0/13, RENDER_NOT_RUN**이다. `/usr/bin/chromium` 래퍼 실행 실패: `/usr/lib/chromium/chromium: not found`.
- SVG 에셋 **13개 직접 참조**(11번 문제·해설 각각 하나). 기존 SVG에는 모두 흰색 전체 캔버스 `rect fill="#fff"`가 있으며 공식 plan에는 배경 채움을 별도로 지시하지 않았다. 수학적으로 필요한 넓이 음영은 유지했다.
- **ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION** — 불필요한 기본 흰색 캔버스를 없애는 옵션은 현재 엔진에서 지원하지 않는다. SVG 태그 수동 수정 없이 엔진 공통 기능이 필요하다.
- **ORIGINAL_EXAM_PNG_CONFLICT**: 원 기출 `q11.png`는 (0,0)에서 (2,a), (4,−a), (6,a)로 이어지며 t=3·5에서 축과 교차한다. 현행 유사 JS는 (0,0)→(1,4)→(2,4)→(4,−4)→(6,0)과 t=3 하나의 교차를 풀이로 사용한다. 공식 plan은 **학생이 실제로 푸는 현행 JS·직접 연결 `q11-audit-rework.svg`**를 따랐다. 원 기출 이미지와 동일하다는 뜻이 아니다. 구형 `q11.svg`와 직접 연결 경로를 혼동하지 않는다.
- **ENGINE_CAPABILITY_PENDING:PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME** — 22번은 원문 해설의 차함수 `F=f−g`를 그래프로 제시하지만 엔진의 구간별 다항함수 `functionName:"F"`는 `PIECEWISE_POLY_FUNCTION_NAME_INVALID`로 거절됐다. 실행 가능한 소문자 `f` 라벨의 정적 그래프·명확한 캡션을 제공하고 기호 완전 일치는 보류한다. 이는 렌더 PASS가 아니다.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 도함수 대입 계산으로 좌표·도형 정보가 없다. 해설: 도함수값 13을 대입해 계산하며 도형이 필요 없다. |
| 02 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 위치의 1·2차 미분식을 계산하는 식 문제다. 해설: 속도·가속도 계산으로 충분하다. |
| 03 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 부정적분 성질의 보기 판단이다. 해설: 적분상수 판정은 식·문장으로 완결된다. |
| 04 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 적분 관계식과 초기값만 제시된다. 해설: 연속·미분 관계를 대수식으로 정리한다. |
| 05 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 정적분 값의 계산이다. 해설: 짝·홀함수 적분 계산으로 끝난다. |
| 06 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 조각함수의 계수·미분가능 조건이 식으로 완비됐다. 해설: 접합점의 좌우 값·기울기 연립만으로 충분하다. |
| 07 | EXEMPT | BENEFICIAL | `q7-solution.svg` | `q07-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 극대·극소 위치와 두 교점이라는 풀이 정보는 발문에서 숨긴다. 해설: G=x³+3x²−9x; 극대 (−3,27)·극소 (1,−5) 및 수평선 y=27,−5 두 개의 접점·다른 교점. |
| 08 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 극한을 이용한 도함수 식이다. 해설: 미분계수의 극한과 다항식 대입만 사용한다. |
| 09 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 극한과 정적분의 대수식이다. 해설: 적분구간 합치기와 다항식 적분만 수행한다. |
| 10 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 조각 도함수의 식과 초기값이 모두 적혔다. 해설: 접합점 연속·적분상수 계산으로 완결된다. |
| 11 | REQUIRED | BENEFICIAL | `q11-audit-rework.svg`, `q11-solution.svg` | `q11-problem.plan.json`, `q11-solution.plan.json` | PASS (유사 JS) | RENDER_NOT_RUN | **ORIGINAL_EXAM_PNG_CONFLICT**. 문제: 속도 곡선 자체가 발문 조건. 현행 유사판 (0,0)→(1,4)→(2,4)→(4,−4)→(6,0), t=3 영점을 따른다. 해설은 부호별 영역 [0,3] 넓이8·[3,6] 넓이6으로 분리. |
| 12 | EXEMPT | BENEFICIAL | `q12-solution.svg` | `q12-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 함수 y=x|x−4|, x=8로 경계가 식에서 완결된다. 해설: x=4를 기준으로 포물선 두 조각과 경계 [0,4], [4,8]를 서로 다른 음영으로 분리한다. |
| 13 | EXEMPT | BENEFICIAL | `q13-solution.svg` | `q13-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 적분 상수 결정 전 함수의 정확한 형태가 미정이다. 해설: f=x³−6x²+9x−11/3, 극대 (1,1/3)·극소 (3,−11/3)을 복원한다. |
| 14 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 적분 정의·함수 연립식이다. 해설: 대수 연산으로 적분 상수를 결정한다. |
| 15 | EXEMPT | BENEFICIAL | `q15-solution.svg` | `q15-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 극대점·접선의 기울기는 조건식으로 주어져 있다. 해설: f=x³−6x²+9x+1, 극대 (1,5)·극소 (3,1)·점 (4,5)의 접선 y=9x−31. |
| 16 | EXEMPT | BENEFICIAL | `q16-solution.svg` | `q16-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 미정계수와 닫힌구간의 최솟값 조건이 주어진다. 해설: f=2x³−3x²+3의 [−1,2] 양 끝점·극점 네 개를 비교한다. |
| 17 | EXEMPT | BENEFICIAL | `q17-solution.svg` | `q17-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 접점 a와 두 곡선의 교점은 풀이로 구해야 한다. 해설: f·g의 접점 (−2,20), 다른 교점 (1,−7) 사이 g 위·f 아래 영역 S=27/2. |
| 18 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 정적분으로 주어진 관계식이다. 해설: 다항식·적분 관계만으로 완결한다. |
| 19 | EXEMPT | BENEFICIAL | `q19-solution.svg` | `q19-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 미분가능 조각함수의 미정계수 문제다. 해설: x=2 접합, 0과 4 영점, [0,2]·[2,4]의 넓이 각각 2·10/3. |
| 20 | EXEMPT | BENEFICIAL | `q20-solution.svg` | `q20-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 속도·위치 조건식만 제시되고 해의 그래프는 풀이 단계다. 해설: x(t)=3t(t−3)²/4, t≥0에서 (1,3) 극대·(3,0) 극소·(4,3)을 표시한다. |
| 21 | EXEMPT | BENEFICIAL | `q21-solution.svg` | `q21-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 함수방정식·극값 없음이라는 조건이다. 해설: H′(x)=6(x+1)²가 x=−1에서 축에 접하고 부호가 바뀌지 않음을 도해한다. |
| 22 | EXEMPT | BENEFICIAL | `q22-solution.svg` | `q22-solution.plan.json` | PARTIAL: F/f 라벨 | F/f 기호 보류 / RENDER_NOT_RUN | 문제: 항상 위쪽인 조건이 발문에 명시돼 있다. 해설: a=21 경계 사례의 F=f−g를 도해한다. 엔진 functionName은 소문자만 허용하여 원문 기호 F 대신 f가 보일 수 있다. |
| 23 | EXEMPT | BENEFICIAL | `q23-solution.svg` | `q23-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 함수식·접점 조건을 그림 없이 제시한다. 해설: c=3/2의 네 조각 h와 포물선 g, 접점 x=1,2,3, 꺾임 x=0,3/2,5/2를 보존한다. |

## 검수 경계

- `STATIC_FIELD_PARITY`: 각 plan의 다항 계수·조각·접점·경계·적분영역·표현 대상·축 라벨을 JS/해설의 수식에 대조. 22번 F/f는 예외로 위에 명시.
- `DRAWN_FEATURE_PARITY`: SVG의 점·선·곡선·유효 넓이와 계획 필드를 비교한 **정적 확인만 수행**했다. Chromium 실 바이너리가 없어 현재 production 엔진 렌더 결과의 시각적 1:1 판정은 `RENDER_NOT_RUN`이다.
- 계획 폴더 내 JSON은 공식 엔진에서 실행하며 기존 `_plans/`에 남은 EXEMPT/원형 자료나 예전 evidence SVG를 신규 SVG 결과로 간주하지 않는다.
