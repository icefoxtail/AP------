# TASK14 batch6 원본 OPEN 우선

원본6시험지 OPEN45문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 6,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 4,
      "decisions": {
        "FIGURE": 2,
        "CONTENT": 1,
        "UNSUPPORTED": 1
      },
      "planFiles": 2,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/1mid/26_강남여고_1학기_중간_고2_대수.js",
      "reviewedOpenQuestions": 4,
      "decisions": {
        "FIGURE": 4
      },
      "planFiles": 4,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/19_매산여고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 10,
      "decisions": {
        "FIGURE": 8,
        "EXEMPT": 2
      },
      "planFiles": 8,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 9,
      "decisions": {
        "EXEMPT": 3,
        "FIGURE": 4,
        "CONTENT": 2
      },
      "planFiles": 6,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/23_순천여고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 9,
      "decisions": {
        "FIGURE": 8,
        "EXEMPT": 1
      },
      "planFiles": 8,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/23_제일고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 9,
      "decisions": {
        "FIGURE": 6,
        "EXEMPT": 3
      },
      "planFiles": 7,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "FIGURE": 32,
    "CONTENT": 3,
    "UNSUPPORTED": 1,
    "EXEMPT": 9
  },
  "planFiles": 35
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 조건부 CONTENT 계획2개는 원문 표머리글 정정 승인 전 제작불가. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# TASK14 원본 우선 배치: 금당고 수학II

- source main: 9fbcf190fd8abaa03f330def331afc7c7c27ba60.
- TASK-14-ADDENDUM-20261117.md를 읽고 운영장부 전체 21행 확인. 대상1 OPEN_UNSUPPORTED q17,18,19,21만 4행 작성. PUBLISHED/EXEMPT 17행은 변경하지 않음.
- FIGURE 2 (q17,q19), CONTENT 1 (q18), UNSUPPORTED 1 (q21). 공식 graph_framing.fit_overview 2/2 PASS.
- 기존 q17/q18/q21 해설 SVG를 Inkscape로 PNG 변환 후 직접 시각 확인. q18 문제 PNG도 직접 확인. q19 기존 그림 없음. 기존 세 SVG에 엔진 표식 없음(정보 기록만, 별도 작업 확장 안 함).
- 새 plan 렌더/출판 검수 NOT_RUN. 부분 프레임 검사만 통과했으며 새 SVG 생성·출판 주장하지 않음. 기존 환경 render-plan import는 provider-bridge 모듈 누락 상태.

## 원문 의심: q18
스캔 x 화살표는 바깥 변의 잘라내는 끝부분을 가리킨다. 저장 해설과 구형 SVG에서는 이를 평행한 변 사이 수직거리/상자 높이로 재정의하고 있다. 학생이 두 x를 같은 값으로 읽을 위험이 있다. 독립 높이 h를 쓰면 s=8−2h/√3 및 부피 최대화는 맞으며 최종 부피도 맞다. 기호 대응을 관제에서 확정한 후 geometry plan 작성하도록 CONTENT 표시. 원본은 고치지 않았다. 흐린 숫자를 추정한 것은 없다.

## 엔진 확장 후보: q21
원함수는 f(x)=−x³/4+x², 0≤x≤2. 도함수 양수, f(x)−x=−x(x−2)²/4<0이므로 역함수와 y=x의 대칭, 정사각형 안 넓이 보완이 핵심이다. AUTHOR_GUIDE의 multi-curve inverseOf 지원과 graph_framing._mc_inverse_curve 코드를 확인했다. inverseOf는 일차/일차분자 유리/제곱근/이차 반쪽만 지원한다. piecewise-polynomial은 이 삼차와 y=x 및 영역을 지원하나 역삼차곡선 전체는 지원하지 않는다. overlays.lines/coordinateBand로 라벨은 풀 수 있어도 역함수 곡선 기하를 대체할 수 없다. 필요 확장: 단조 삼차의 정확한 구간 역함수와 대칭 넓이 경계. 원함수만 그려 구형 그림의 핵심 관계를 누락시키거나 다른 이차곡선으로 근사하지 않았다.

## 두 plan의 교육적 관계
- q17: K(t)=−2t³+6t²−12, 도함수 −6t(t−2). 극점 (0,−12),(2,−4), 예시 수평선 k=−8. 최종 부등식·극값 좌표 라벨은 숨기고 본문 판단으로 남긴다.
- q19: a=0 예시 도함수 3x²−4x, 꼭짓점 (2/3,−4/3), 구간 끝 −1,2. 일반 a에서는 끝 높이 a+7,a+4와 꼭짓점 높이 a−4/3을 함께 비교해야 함을 caption에 명시. 최종 a의 범위는 쓰지 않는다.

판정표/그림장부 각 4행, plan 2개. 중복 no 없음. index 수정, 원격 push, JS/기존 SVG/운영장부 변경 없음.


---
# 강남여고 고2 대수 원본 OPEN 4문항

TASK-14-ADDENDUM-20261117 및 AUTHOR_GUIDE의 지수·삼각·다중곡선·수직선 절을 읽고 원본 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60에서 판정. 운영 시험지별 그림 장부의 OPEN_UNSUPPORTED Q8·15·16·25만 대상으로 작성했다. FIGURE4, CONTENT0, UNSUPPORTED0. 대상 네 문항은 문제·해설 이미지 연결이 없어 직접 볼 기존 그림이 없다. 새로 만든 SVG도 없다.

PUBLISHED Q5·17·19는 참조 SVG에 모두 data-publication-profile 또는 data-engine 표시가 있는 것으로 확인. 구형 표식 누락 목록은 없음. 기존 PUBLISHED와 EXEMPT 상태는 수정하지 않았다.

- Q8: 두 지수곡선과 y=1,9, 예시 y=3에서 수평 선분을 표시. x=-1,1로 가로폭2를 확인하되 넓이16은 쓰지 않는다. 기존 해설의 적분 표현은 대수 범위 밖이지만 일정한 가로폭을 이용하는 관계 자체는 확인됨. 해설은 수정하지 않는다.
- Q15: TAN 계수[-2,1/2,0], 위상0, 원문 정의역 ALL_REALS_WITH_TAN_POLES를 보존. 양쪽 극 ±π 사이의 감소를 보여 주며 선택지 정답은 쓰지 않는다.
- Q16: 지수곡선 y=2^(x/2)와 x축 사이 0≤x≤4 영역. x=1,3 세로선에서 정수 눈금과 √2,2√2 높이를 비교한다. 정수점 합계15는 표시하지 않는다.
- Q25: π를 소수로 근사하지 않고 x/π 정규화 수직선을 쓴다. 첫 조건의 열린 두 조각 (1/3,1)∪(1,5/3), 둘째 (1/4,5/4)만 비교하고 RESULT행은 생략. x=π 제외점을 보존했다.

공식 graph_framing.fit_overview 3/3, number-line expand 1/1 부분검사 PASS. render-plan은 알려진 provider bridge 의존성 누락으로 전체 렌더 NOT_RUN 유지. 픽셀·전체 phase2·publication 검증 완료를 주장하지 않는다. 후보 plan·장부 외 원본 JS, 운영 장부, SVG, index 변경과 원격 push 없음.

독립 검토 반영: Q15 원문은 구간 제한 없는 탄젠트이므로 sourceDomain을 ALL_REALS_WITH_TAN_POLES로 변경. 한 가지 개형에 맞춰 caption의 반복 표현을 제거하고 공식 fit_overview 재통과.


---
# TASK14 원본 OPEN 배치: 19 매산여고 2학기 기말 고2 확률과통계

- 고정 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60. 원본과 시험지별 운영장부 22행 직접 읽음.
- OPEN_UNSUPPORTED 10문항(q5,6,7,8,11,13,14,17,20,21)만 판정. FIGURE8 / EXEMPT2 / CONTENT0 / UNSUPPORTED0.
- plan 8개: stat-chart5(정규분포3, 수형도2), number-line3.
- 공식 solveStatChart5/5, expandNumberLineFigure3/3 통과. Q17 분수 눈금 경계는 표시문자 비교 오류를 피하도록 공식 지원 눈금 인덱스로 수정 후 재검 통과.
- 대상 10문항의 images는 모두 빈 배열이고 image/solutionImage 연결도 없다. 확인할 기존 이미지 없음(NO_LINKED_ASSETS), 기존 그림을 봤다고 주장하지 않는다.
- 새 SVG·PNG 렌더는 NOT_RUN, 시각 검수·출판 검수 미수행. 부분 모델 검사만 통과.
- PUBLISHED6 / EXEMPT6 기존 운영 항목은 건드리지 않음. 출력 판정표/계획장부는 대상10행만. index·원격·원본JS·운영장부 변경 없음.

## 문항별 근거
- Q5 표준화한 좌측 누적확률과 대칭 우측 누적확률. a=5/σ, σ=5 예시 배치임을 명시하며 tick 글자는 ±a. 실제 미지 k 수치 숨김. 두 칠한 넓이는 p로 검산.
- Q6 주사위 배수/그외 확률 1/3,2/3 및 서로 다른 동전 시행 수를 확률 수형도로 구분. 깊이 다른 잎은 pathColumn으로 정렬하도록 계획. 변환 평균의 답 숨김.
- Q7 한 시행의 이동량 −1,3 및 원점을 수직선에 표시. 최종 분산값 숨김.
- Q8 표준정규 중앙 ±1.96 구간. 표준오차2/40을 곱해 양쪽 반길이를 합하는 관계. 최종 길이 숨김.
- Q11 EXEMPT: z/√n의 두 변화가 경쟁하므로 임의 수치 그림 없이 식으로 단조 관계 판정.
- Q13 n≥665.64 경계를 수직선에 표시해 자연수 올림 단계만 돕는다. 답 자연수 라벨 안 씀.
- Q14 (1,3),(3,1) 두 순서 경로의 합의 법칙. 확률은 문자 p,q이므로 가지에 임의 수치를 채우지 않고 순서 구조만 강조.
- Q17 임계값7/8 중앙 영역과 새 경계√n/8 대응. 구하는 표본크기 숨김.
- Q20 EXEMPT: 비복원 조합으로 분포표 자체를 구하는 문제. 완성 분포표를 SVG에 답처럼 쓰지 않고 각 조합식·표 및 분산 계산에 맡긴다. 조합 경우의 수4+14+20+14+4=56 및 분산5/42 독립 확인.
- Q21 95% 구간[30.2,49.8]과 99% 구간[27.1,52.9]를 같은 축에서 비교. 중심40, 반길이12.9 중간값 유지하고 최종 자연수 개수 숨김.

엔진 확장 후보 없음. 그림을 실제로 렌더하면 수형도 가지확률·라벨 충돌 및 정규분포 겹친 영역의 가독성을 반드시 별도 확인해야 한다.


---
# TASK14: 20 매산여고 고2 확률과통계 OPEN 9문항

## 출처·범위
- 소스 고정 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60.
- 최신 확인 ref origin/svg-lead-save-main=782966ffb38c969f1f54fc2f328f046741f5ff4a와 시험지 blob 동일(e12aa9f4d7db158d99342e1f3be53765162c842c), 운영장부 diff 없음.
- 운영장부 전체23행 확인. OPEN q2,8,14,15,16,18,19,21,23만 기록. PUBLISHED6 / EXEMPT8 불변.
- FIGURE4 / CONTENT2 / EXEMPT3. plan6개(조건부 CONTENT plan2 포함), 판정표9행, 그림장부9행.
- 정규분포3·직사각 경우표1·수직선2. 공식 solveStatChart4/4, expandNumberLineFigure2/2 PASS.
- 대상9문항 image/solutionImage 연결 없음, images 빈 배열. 실제 확인할 기존 그림 없음. 새 렌더 NOT_RUN; 부분 모델 검증을 시각·출판 통과로 표시하지 않음.
- 원본JS·기존SVG·운영장부·index·원격 수정 없음.

## 원문 의심 / 게시 보류
- q15 (기존 OPEN_CONTENT): 표의 P(0≤Z≤z) 머리글 아래 z값1.0,1.5,2.0,2.5가 있고 z 머리글 아래 확률0.3413,0.4332,0.4772,0.4938이 있다. 두 머리글 역전. 풀이에서 사용한 의미대로 표를 읽으면 S의 평균1360, 표준편차4, 표준화2는 정확하다. 해당 정규곡선 plan은 작성했으나 CONTENT_REVIEW_REQUIRED로 원문 확인 전 게시 금지.
- q18 (기존 OPEN_UNSUPPORTED): q15와 동일한 표 머리글 역전 발견. 표를 정상 해석하면 첫 표준화1.5, 둘째 경계−1.5, σ=12 및 둘째 표준오차4가 맞다. 표준정규 대칭 plan을 조건부 작성하고 CONTENT_REVIEW_REQUIRED로 기록.
- q14의 z=2, q23의 √30=5는 문제에 명시된 계산 약속이다. 정밀한 실제 수치로 대체하지 않았으며 원문오류라고 임의 수정하지 않았다.

## 교육적 근거
- q2 EXEMPT: 길이식 z/√n에서 방향성을 읽는 개념 빈칸. 숫자 예시가 없는 수식을 임의 그림으로 바꾸지 않음.
- q8 FIGURE: 중심50, 반길이3.92의 두 끝을 표시. 최종 길이는 숨김.
- q14 FIGURE: n∈[16,64] 닫힌 끝점을 강조해 자연수 계수에서 +1 누락 방지. 최종 개수 숨김.
- q15 CONTENT+plan: 총수명1368 이상과 표준화2의 오른쪽 꼬리. 확률값 숨김.
- q16 EXEMPT: l,2l를 공식에 대입하여 비례·제곱으로 계산하는 구조라 별도 그림 불필요.
- q18 CONTENT+plan: ±1.5 양쪽 꼬리의 대칭. 마지막 경계1은 중간값이며 최종 누적확률 숨김.
- q19 EXEMPT: 왼쪽 끝 식 두 개를 빼어 중심 이동2와 반길이 차0.155σ를 분리. σ값을 정해 그림으로 답을 암시하지 않음.
- q21 FIGURE: 3×3 표에서 합이8 초과인 세 순서쌍 강조. 칸이 등확률이 아님을 명시하고 확률 ab,ab,b²를 더하도록 안내. 최종 a식 숨김.
- q23 FIGURE: 표준정규 중앙95% 영역과 표본평균 중심5의 관계. 묻는 실제 신뢰구간 끝값은 그림에 넣지 않음.

엔진 확장 요구 없음. 수학·지원기능 부분검사만 완료. 실제 렌더 후 정규분포 눈금·칠한 영역·라벨 가독성은 독립 시각검수가 필요하다.


---
# 순천여고 고2 확률과통계 원본 OPEN 9

고정 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60와 최신 확인 ref origin/svg-lead-save-main 782966ffb38c969f1f54fc2f328f046741f5ff4a의 원본 JS·시험지별 운영 그림장부는 동일하다. stale origin/main은 비교 기준에서 제외했다.

OPEN Q4·5·10·15·17·18·19·20·23만 판정: FIGURE8, EXEMPT1(Q15), CONTENT0, UNSUPPORTED0. 대상9문항 모두 문제·해설에 연결된 기존 이미지가 없으므로 시각 검수할 기존 그림 없음. 장부의 PUBLISHED Q16·21은 엔진 표시 확인만 했으며 수정하지 않았다.

- Q4 조건부 사건을 주사위 6×6 표에 표시. 곱4의배수 조건15칸만 색칠, 최종확률은 생략.
- Q5 틈 인덱스1,4,7 예시와 그 사이 흰 카드 묶음을 수직선으로 표현. 각 구간의3,6 카드 포함을 설명하고 전체 경우의 수는 쓰지 않음.
- Q10 배열00011의 틈0,1,2만 안전함을 인덱스 수직선으로 보임. 나머지3,4,5 제외 표시. 전체 확률은 생략.
- Q15 미지 표본 크기의 기호 비교로 충분하여 EXEMPT 제안. 운영 장부 자체는 바꾸지 않음.
- Q17·19 신뢰계수의 중앙 정규분포 영역을 보이며 최종 신뢰구간/오차한계 값은 그림에 쓰지 않음.
- Q18 표준화 후 ±2의 대칭 영역. 최종 확률 숨김.
- Q20 기존 OPEN_CONTENT 이유는 공란. 현재 원문과 풀이를 독립 대조하면 합의 표준편차10σ, μ=1.44+0.3σ, 단일 무게 z=-0.3으로 일관됨. 과거 보류 원인을 추정하지 않고 현재 내용으로 그림 계획 가능하다고 기록했다. 원본 내용은 고치지 않음. 왼쪽 꼬리와 표의 0~0.3 영역만 색칠.
- Q23 두 신뢰구간을 같은 수직선 눈금에 놓고 확대 관계 비교. 끝점은 자연수 개수를 세기 위한 중간값이며 최종 개수21은 숨김.

공식 solveStatChart5개 + numberLine expand3개 부분검사 PASS. Q5 최초 작성의 name 속성·숫자 혼합 괄호 라벨이 거절되어 지원하는 id 기본명과 한글 라벨로 수정 후 통과. 전체 phase2 렌더·시각 검수는 NOT_RUN이며 출판검증은 UNVERIFIED. 기존 JS·운영 장부·SVG·index 변경, push, PR, 병합 없음.


---
# 제일고 고2 확률과 통계 OPEN9 재검토

- 대상: q1,9,10,11,15,18,19,22,23. FIGURE6문항 7plan / EXEMPT3문항.
- 기준 fixed main 9fbcf190fd8abaa03f330def331afc7c7c27ba60, 최신 확인 main 782966ffb38c969f1f54fc2f328f046741f5ff4a. 시험지 blob 7ed637a7cb8f81e06b1fddd59e348be822e5e924 동일. 참조 PNG 3개도 양 커밋 blob 동일.
- q1/q18/q23 PNG 직접 열람. 이 OPEN9에는 연결 solution SVG 없음; 다른 문항의 이미 출판된 SVG는 범위 밖.
- q1 중앙색 선택+둘레 기준색 고정의 SLOTS로 회전중복 제거를 설명. 최종 곱 숨김.
- q9 깊이4 초과를 두 번째 경기의 승패 두 경우로 나누어 깊이3 이하 수형도2개로 계획. 조기 종료를 유지하고 각 그림 진입확률 명시.
- q10/q23 두 단계 추출·분류 수형도, q18 정사각형 방향 이동과 합동조건, q22 동일 중심의 신뢰구간 반길이 비교.
- q18 그림 좌표에서 A→B는 반시계1/3, A→D는 시계2/3임을 확인해 화살표 확률 정확하게 대응.
- q11 독립 명제, q15 비례식, q19 상반된 단조효과는 구체적인 근거로 EXEMPT.
- checkStatChartPlan 5plan PASS. construction+expandPlaneVectors+planeMarkSpec 2plan PASS. 별도 유리수 계산/4회 경우 완전열거 검산 PASS.
- 전체 렌더·학생 화면 시각검사는 브라우저 OS 제한으로 NOT_RUN. 가독성/출판 완료가 아니다.
- 시험지 JS, 엔진, 운영 장부, 원격 브랜치 변경 없음.


## 최종 독립 검수
original-a/b/c/e/f 독립검수 완료. original-c q17의 유리수 tick은 정확한 값으로 저장되나 현재 엔진에서 소수 ±0.875로 표시될 수 있으며 caption에 ±7/8을 보존한다. 임의 tick text는 공식검사 거부로 적용하지 않았다. 위 개별 보고의 초기 import 오류는 현재 Chromium socket 권한 오류로 갱신한다.

original-d 독립검수도 완료: 계획6개 직접 부분검사PASS, 조건부CONTENT2건 장부·caption에 제작보류 확인. 전체6시험지 독립검수 완료.
