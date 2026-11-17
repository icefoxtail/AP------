# TASK14 batch10 원본 OPEN 우선

원본3시험지 OPEN56문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 10,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/middle/m3/1final/17_대구동도중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 24,
      "decisions": {
        "EXEMPT": 15,
        "CONTENT": 1,
        "FIGURE": 8
      },
      "planFiles": 8,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 16,
      "decisions": {
        "FIGURE": 11,
        "EXEMPT": 5
      },
      "planFiles": 11,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 16,
      "decisions": {
        "FIGURE": 11,
        "EXEMPT": 5
      },
      "planFiles": 11,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "EXEMPT": 25,
    "CONTENT": 1,
    "FIGURE": 30
  },
  "planFiles": 30
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# original-m: 17 대구동도중 중3 수학
- 원문: archive/exams/original/middle/m3/1final/17_대구동도중_1학기_기말_중3_수학.js
- source commit: 782966ffb38c969f1f54fc2f328f046741f5ff4a
- OPEN_SOURCE 24문항 전부 직접 읽고 독립 풀이: FIGURE 8 / EXEMPT 15 / CONTENT 1(q12). 미판정 0.
- 판정표 24행, 그림장부 24행, 공식 계획 8개. 문항 번호 중복 없음.
- 기존 q16,17,20,22,24 문제 SVG 5개를 Inkscape로 래스터화하고 직접 확인. q16은 기존 표시로 충분. q17에는 높이 보조선, q20에는 좌표 관계, q22에는 대각선 분할, q24에는 움직임의 넓이 함수를 추가하는 계획.
- 공식 graph_framing.fit_overview 검사 8/8 PASS. 실제 신규 SVG 렌더 NOT_RUN. 검사는 모델의 구조/좌표 점검이지 시각검수 완료가 아님.
- q12는 양수 조건이 없어 최대15와−3이 모두 가능하므로 CONTENT로 수정. 양의 홀수 조건 추가가 필요함. 기존 문제 수정 없음.
- q23은 보조 다항식을 ALL_REALS로 연장하여 표시구간만0~10초. 실제 비행구간0≤x≤5+√31을 caption에 명시., q24는 두 점 모두 움직이는 0~5초의 명시된 시각화 구간이다. 최종 시간/최대 넓이 좌표 숨김.
- 원본 JS, 운영 장부, SVG, index, remote 모두 미변경. 독립검수 대기.


---
# 금당고 19 고2 수학II OPEN16

- 기준 main782966ffb38c969f1f54fc2f328f046741f5ff4a, 시험지blob01c4ac03f4ac6ae7f2c16309b9b603768e3e3d56.
- OPEN3,4,5,6,7,11,12,13,14,15,16,17,18,19,20,21 검토. FIGURE11 / EXEMPT5(q12,14,15,16,18).
- 대상16문항은 image/images/solutionImage 참조가 없음. 열람했다고 기록하지 않음. 시험지의 비대상q9,10에 존재하는 이미 출판된 SVG는 수정·재판정하지 않았음.
- graph_framing.fit_overview11/11 PASS. 적분·극점높이·quartic접선변환·초기조건·최적화 검산 PASS.
- 모두piecewise 경로이며 formula생략해 자동식라벨의 정답노출 방지. q3접선기울기3,q4접점1/2,q20극값높이1/2,q21최대최소0/−27/16는 최종답용 라벨로 쓰지 않음.
- q17의 수평선높이3/4는 원문이 준 접선절편으로 유지. 최종 f(a)f(b)의곱4를 결론라벨로쓰지않음.
- q13 a−1/2는가능한예시, q20 a3/2는3교점비교예시임을caption명시. q6와q11는원문닫힌구간만그림.
- 렌더·학생화면 가독성 NOT_RUN,publication UNVERIFIED. 원본JS/엔진/운영장부/원격 변경없음.


---
# 19 순천여고 고2 수학II OPEN16 SVG 계획

- source main `782966ffb38c969f1f54fc2f328f046741f5ff4a`, blob `d6433a34e67fd5eac571e2e7641be66d3962413d`.
- OPEN q1,5,6,7,8,9,11,12,13,14,16,17,18,19,20,22만 처리. FIGURE 11 / EXEMPT 5, 계획 파일 11개. 기존 PUBLISHED/EXEMPT 행 변경 없음.
- q6 실제 PNG 직접 확인. 연결된 다른 문제 그림·해설 SVG는 해당 OPEN 범위에서 없음. 그림장부 16행과 결정표 16행 작성.
- q6은 x=1~5의 도함수 부호만 보존한 예시. 높이가 주어지지 않았으므로 ±1은 예시임을 명시하고 축 높이 라벨을 숨김.
- q8은 열린 구간 상한 포함 여부 설명. 세로 H/10으로 정규화하고 k/10과 비교하며 최종 k값 숨김. q5 폭 1/4 예시를 명시하고 최종 높이 17 숨김.
- q9는 원래 배치와 두 삼각형을 같은 방향으로 분리한 3패널. x=2 m 순간 예시. 높은 끝점은 POLAR_POINT, 사람 위치/머리는 MIDPOINT로 파생. 주어진 높이와 밑변의 x+y/y 관계를 보여 주며 최종 변화율은 숨김.
- q11은 k=-2 예시, q14는 a=0 예시. 세 실근 조건의 두 극값 높이를 보되 구하는 정수 최댓값/곱을 숨김.
- q17은 f의 이중근 접함과 단순근 가로지름 관계, q18은 교점식을 정리한 두 이차조각과 수평선 높이 0/1, q19는 양끝과 내부 임계점 비교. q19 최종 높이 좌표와 세로 눈금, 자동 함수식 라벨 모두 숨김.
- 공식 부분검사: graph_framing 10/10 PASS; construction 3패널/3 PASS; compositePanels 3패널 계약 PASS; planeMarkSpec 3/3 PASS. 독립 SymPy 검사 14항 PASS. 동일 ord 중복 없음, 결정/장부/계획 연결 일치.
- 실제 SVG 렌더 및 학생 가독성 NOT_RUN, publication UNVERIFIED. 원본 JS, SVG, 운영장부 및 원격 변경 없음.

## 독립 검수 보완
Q8·11·14·18 빈 coordinateBand 제거. Q9 작은 패널은 표시하는 D·C와 높이1.7 POLAR_POINT E만으로 독립 구성하여 숨겨진 GIVEN A 문제를 해소. 공식 frame_graph+graph+phase2.specFor 10/10 PASS, construction+displayGeometryInventory+phase2.specFor 3/3 PASS. 원본 q6 PNG와 16문항 수학 독립 재확인. 전체 렌더 NOT_RUN 유지.


## 독립검수 수정반영
세시험지 독립검수완료. m Q12 양수조건누락CONTENT, Q23실제물리정의역과표시구간분리. p빈coordinateBand4개제거,복합그림작은패널 표시안된SOURCE_POINT를제거하고 독립삼각형재구성. p graph→specFor10/10,construction→displayGeometryInventory→specFor3/3 재통과. 실제렌더NOT_RUN유지.
