# 24_매산여고_2학기_기말_고2_확률과통계_유사 — production SVG plan 전축 감사

- **2026-11-28 독립 재검증 기준**: 작업 전 원격 `origin/main` **90e538f1d596cd9ad9194832168976c863d92c9a**의 현행 JS·직접 연결 SVG, 기출 PNG `archive/assets/images/24_매산여고_2학기_기말_고2_확률과통계/{q4.png,q10.png}`, 기존 `_plans/`, 공식 plan 및 엔진 스키마를 재확인. 위의 `cc74a04c`는 이전 감사 당시의 이력일 뿐 최신 main이 아니다.
- 문항 **23문항**, 문제 **23축**, 해설 **23축**, 총 **46/46축**. **REQUIRED 2축**, **BENEFICIAL 9축**, **EXEMPT 35축**. 이번 시작 시 이미 공식 production plan **11개** 존재. **유지 9개·메타데이터 수정 2개·신규 0개**(문제 2·해설 9). 과거 감사의 "신규 11개" 표현은 당시 최초 작성 이력이다.
- `STATIC_FIELD_PARITY` **11 PASS / 면제 35 N/A**: `sourceConditions`/`mappedTo`/`caption`/`newVisualInformation`/`accessibilityDescription` 및 곡선 중심·폭, 눈금, 양쪽 실제 음영 경계와 상대적 도형 정보 정적 검토. `DRAWN_FEATURE_PARITY` **실제 렌더 PASS 0·RENDER_NOT_RUN 11**이며 정적 대응은 실제 출력 검증이 아니다.
- 공식 검수: 이 폴더 JSON 파싱·필수 스키마 **11 PASS / FAIL 0 / SKIP 0**, 공식 Shallow lint **11 PASS / FAIL 0 / SKIP 0**, 공식 Full lint **11 PASS / FAIL 0 / SKIP 0**. Full lint는 잠금 글꼴 SHA256을 검사하고 `opentype.js`, `mathjax-full`을 준비한 후 최종 재검사했다. 처음 의존성 누락 때문에 나온 SKIP은 최종 검수에는 남지 않는다.
- 현행 JS 직접 연결 SVG **11개**, 모두 SVG에 `rect fill="#fff"` 흰 배경 캔버스 포함. 새 plan JSON은 배경 채움을 요청하지 않지만 **공식 `stat-chart-v1.mjs` 렌더러가 기본 흰색 전체 배경 rect를 삽입**함을 소스에서 확인했다. 임의 SVG 수정·우회는 금지하고 `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION`을 기록한다. 출력이 실제로 투명하다고 주장하지 않는다.
- **기출 원본 PNG와 현행 문제 SVG의 충돌**:
  - **04번** 원본 `q4.png`의 두 곡선은 평균을 나타내는 세로 점선 하나 `m`을 공유하는 모양이다. 반면 현행 문제 SVG `q04-problem.svg`는 B의 평균 `m2`가 A의 평균 `m1`보다 왼쪽이고 A가 더 높고 좁다. 현재 JS·해설은 `m1>m2, σ1<σ2`를 전제로 하므로 **현행 JS·연결 SVG**를 공식 plan으로 옮겼다. 수치 45·55 및 표준편차 3·6은 그래프 좌표계에서 상대 관계를 그리기 위한 **내부 스케일**이고 라벨로 보이지 않는다. 실제 성적 수치로 주장하지 않는다.
  - **10번** 원본 `q10.png`는 표준정규분포의 음영이 **[−1,2]**인 반면 현행 JS·문제 SVG는 **[−1.5,1]**이며 해설 SVG는 대칭구간 **[−1,1.5]**이다. 구현은 현행 JS·연결 SVG를 따랐고 문제 plan에는 **정답 a=46을 넣지 않았다**. 원본 PNG와 시각적 동일성은 `ORIGINAL_EXAM_PNG_CONFLICT`로 보류한다.
- 23번의 신뢰구간 두 개는 겹쳐 칠할 경우 겹침 경계를 숨길 수 있으므로 `[−2.58,−0.86]`, `[−0.86,0.86]`, `[0.86,2.58]`의 세 영역으로 **겹침 없이** 나눠 외부 99% 구간과 내부 s% 구간을 표시했다.
- **이번 결함 수정**: 문제 04의 `caption`·접근성 텍스트 등에 노출된 선택지의 정답 부등식 `m1>m2, σ1<σ2`를 제거하고 눈에 보이는 곡선·위치만 설명한다. 문제 10의 같은 메타데이터에 있던 해설 정답 `a=46` 및 제작 내부 사유를 제거한다. **수학·곡선·눈금·음영 필드는 한 글자도 수정하지 않았다.** 문제용 plan에 해설의 정답 문구를 넣지 않는다.
- **충돌 PR**: 열린 draft [#1985](https://github.com/icefoxtail/AP------/pull/1985)가 **현행 매산여고 유사 JS** 경로에 겹치지만, 이번 변경은 production plan과 감사 문서만이며 해당 draft와 변경 파일이 겹치지 않는다. 작업 시작의 `90e538f1` main JS를 제작 기준으로 삼았다. 대상 두 plan 폴더와 충돌하는 열린 PR은 없다.
- `ENGINE_CAPABILITY_PENDING:TRANSPARENT_CANVAS_OPTION` **관련 있음**. 앞서 제시된 `MULTI_CURVE_INVERSE_CUBIC`, `PIECEWISE_POLYNOMIAL_UPPERCASE_FUNCTION_NAME`은 두 확률과통계 시험지에 **해당 없음**. 문제 04·10의 **원본 PNG 충돌은 엔진 기능 문제가 아니라 원천 버전 차이**다.
- **새 렌더 가용성 검사**: `/usr/bin/chromium --version`은 `exitCode=127`; 실제 `/usr/lib/chromium/chromium`이 없다. Playwright가 가리키는 `/home/agent/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`도 존재하지 않는다. 공식 `render-plan.mjs`를 q10 문제 plan으로 실행한 결과 `ARCHIVE_PREFLIGHT_FAIL`. **RENDER_NOT_RUN 11**, 실제 SVG 출력·학생화면·A4·육안 대조 PASS **0**.

| 문항 | 문제 축 판정 | 해설 축 판정 | 원본 SVG | plan 파일 | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY | 비고 |
|---|---|---|---|---|---|---|---|
| 01 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 질량함수 (x+a)/40 및 x=1~5가 식에 명시됨. 해설: 합확률 1을 이용한 a=5 계산. |
| 02 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 이항분포 B(50,1/5)와 물음이 식으로 완결됨. 해설: E(X)=10, V(X)=8 공식 대입. |
| 03 | EXEMPT | BENEFICIAL | `q03-solution.svg` | `q03-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 표준정규분포표와 구간 69~81이 발문에 주어짐. 해설: N(72,6²), [69,72]와 [72,81] 별도 음영 0.1915·0.4332. |
| 04 | REQUIRED | EXEMPT | `q04-problem.svg` | `q04-problem.plan.json` | PASS | ORIGINAL_EXAM_PNG_CONFLICT / RENDER_NOT_RUN | 문제: 두 정규곡선 A/B의 평균 상대 위치·봉우리 높이·폭이 필수 조건이며 답 부등식 메타데이터 제거. 해설: 문제 곡선에서 관계를 판단하므로 중복 그림 면제. |
| 05 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 복원추출 공의 숫자·확률이 식과 문장에 있다. 해설: 합이 4인 순서쌍 1,3·2,2·3,1의 확률 계산. |
| 06 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 99% 신뢰구간 길이를 식으로 구한다. 해설: 오차한계 공식으로 2.064를 계산. |
| 07 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 열쇠의 무작위 순서 조건이 서술되어 있다. 해설: 이산균등분포 1~7의 분산 계산. |
| 08 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 공 5·3개 중 3개 비복원 조건만 필요하다. 해설: 초기하분포의 기대값과 선형변환 계산. |
| 09 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 기댓값·분산 조건으로 식이 완결된다. 해설: Y=aX+b의 a=−3, b=8 연립 계산. |
| 10 | REQUIRED | BENEFICIAL | `q10-problem.svg`, `q10-solution.svg` | `q10-problem.plan.json`, `q10-solution.plan.json` | PASS | ORIGINAL_EXAM_PNG_CONFLICT / RENDER_NOT_RUN | 문제: 표준정규곡선의 실제 음영 경계 −1.5와 1이 조건이며 정답 46을 문제용 메타데이터에서 제거. 해설: 대칭으로 옮긴 −1과 1.5를 별도 표시해 a=46 계산 설명. |
| 11 | EXEMPT | BENEFICIAL | `q11-solution.svg` | `q11-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: k와 조각별 밀도식이 발문에 명시되며 k의 값은 풀이로 도출한다. 해설: k=1/2에서 [0,1/2] 수평, [1/2,7/2] 하강 직선, [1/2,3/2] 확률 사다리꼴 5/12. |
| 12 | EXEMPT | BENEFICIAL | `q12-solution.svg` | `q12-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: m의 자연수 조건과 두 확률·표가 문제에 주어짐. 해설: m=22, N(22,2²)의 ≥25 및 N(22,3²)의 ≤19 꼬리를 분리. |
| 13 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: PMF와 표본 크기 n=8이 수식으로 완결된다. 해설: 평균·분산·표본평균 분산 수치 계산. |
| 14 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 95% 신뢰구간 74.02~75.98이 숫자로 주어짐. 해설: 신뢰구간의 길이와 표본 크기 n=100을 계산. |
| 15 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 표준편차 최댓값은 분산 완전제곱식으로 판단. 해설: V(X)=−(a−2)²+9의 대수적 최댓값. |
| 16 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 복원추출 공의 조합, 평균·분산 조건이 주어짐. 해설: 이항분포 B(n,p)로 a=3,n=80 산출. |
| 17 | EXEMPT | BENEFICIAL | `q17-solution.svg` | `q17-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 불량 경계 9.94·10.06과 표준정규표가 문제에 제시됨. 해설: N(10,0.04²)의 양쪽 꼬리 각각 0.0668, 분리 음영. |
| 18 | EXEMPT | BENEFICIAL | `q18-solution.svg` | `q18-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 응시자 1000명·채용 3명·평균과 분산을 수식으로 제시함. 해설: N(70,8²)의 오른쪽 꼬리 c=92 이상, 면적 0.003. |
| 19 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 동전·공 추출 규칙과 확률 사건이 서술됨. 해설: 합계 8이 되는 독립 순서쌍의 확률 합. |
| 20 | EXEMPT | EXEMPT | 없음 | 없음 | N/A | N/A | 문제: 신뢰구간 길이와 이항분포 2차 적률의 연립 조건. 해설: M=k²=16, k=4 대수 풀이. |
| 21 | EXEMPT | BENEFICIAL | `q21-solution.svg` | `q21-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: B(192,1/4)와 기준 확률표로 충분하며 해의 음영은 공개하지 않음. 해설: 정규근사 N(48,6²)의 ≥60 오른쪽 꼬리 0.0228. |
| 22 | EXEMPT | BENEFICIAL | `q22-solution.svg` | `q22-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 주사위 450회 점수 규칙이 문장으로 완결됨. 해설: 정규근사 N(150,10²)의 ≥160 오른쪽 꼬리 0.1587. |
| 23 | EXEMPT | BENEFICIAL | `q23-solution.svg` | `q23-solution.plan.json` | PASS | 정적 특징 대조 / RENDER_NOT_RUN | 문제: 99%와 s% 신뢰구간의 관계가 식으로 주어져 있음. 해설: 표준정규 [-2.58,2.58]와 그 내부 [-0.86,0.86]를 구간별로 분할해 표시. |

## 검수 경계

- 원문 수식·해설·기존 SVG의 곡선·기준값·분할 음영이 JSON의 `chart.curves/ticks/shades/areaLabels` 또는 `graphPlan.pieces/regions` 필드에 대응하는지 정적으로 점검했다. 04번의 도식 숫자 좌표는 표기하지 않는다.
- `DRAWN_FEATURE_PARITY`가 현재 PASS라는 뜻이 아니다. Chrome/Chromium의 실제 실행 파일 부재로 현재 공식 production 렌더 출력에 대한 픽셀·라벨 배치·시각적 대조는 `RENDER_NOT_RUN`. 구형 `_plans/evidence`에 남은 과거 SVG를 이번 실제 출력물로 대체하지 않는다.
