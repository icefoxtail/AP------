# TASK14 batch8 유사·교과서

3시험지47문항 직접판정. 기존이미지와 문제조건을 직접확인, 학생풀이에 필요한 그림만 계획. 독립검수3시험지 완료.

{
  "counts": {
    "FIGURE": 24,
    "EXEMPT": 23,
    "exams": 3,
    "questions": 47,
    "plans": 29
  },
  "capabilities": {
    "multi-curve-figure-v1": 9,
    "piecewise-polynomial-spike-v1": 6,
    "number-line-figure-v1": 5,
    "construction-spike-v1": 9
  },
  "cumulative": {
    "exams": 351,
    "questions": 9093,
    "byScope": {
      "similar": 122,
      "textbooks": 180,
      "types": 49
    },
    "directlyReviewed": 894,
    "planned": 182,
    "rendered": 0,
    "publishedConfirmed": 0,
    "contentBlocked": 184,
    "exempt": 492,
    "keptExisting": 36,
    "planFiles": 189
  }
}

## 검증 상태
공식부분검사 및 독립수학검수만 PASS. 실제전체렌더는 Chromium socket 환경차단으로 NOT_RUN, 출판UNVERIFIED. 좌표축 계약·보조구성역할·직각표식 수정후 재검. 정본JS·SVG·운영장부·엔진 변경없음.


---
# 동아 공통수학1 이차방정식과 이차함수 중단원연습

- 단독 소유 12문항 전부 직접 읽음. index-base UNASSESSED인 교과서 시험지.
- 기준 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60. source blob은 각 장부에 기록.
- 저장 해설 12개는 공란이므로 발문을 독립 풀이하여 계수·접점·끝점·극점 검산을 판정 note/sourceConditions에 남김. 원본 해설을 작성하거나 수정하지 않음.
- FIGURE10 / EXEMPT2(Q3,Q5) / CONTENT0 / UNSUPPORTED0. plan15개: multi-curve9, piecewise-polynomial6.
- q06 빈 좌표판, q11 나란한 합동 직사각형과 공유변, q12 포물선 위 같은 높이의 두 꼭짓점 PNG 직접 확인. q11/q12 그림 하단은 원본 자체가 잘려 있지만 발문의 직사각형 및 x축 조건으로 결정적 관계를 확인 가능. 이미지 없는 9문항도 직접 읽음.
- q4 두 접점(2,2),(-2,18) 중간좌표 유지, 최종 접선 방정식·기울기 라벨 없음. q6 교점 합 조건의 그래프만 제시하고 최종 k·f(1)·f(2) 숨김.
- q7/q9/q11/q12 구하는 극값은 requiredPoint 좌표띠 및 y눈금에서 숨김. q8은 상수항을 뺀 예시임을 caption 명시, q10은 t=1 예시. 문제의 구간은 sourceDomain으로 보존.
- 공식 graph_framing.fit_overview 15/15 PASS. 최초 worker action 이름을 잘못 호출한 UNSUPPORTED_WORKER_ACTION은 작성 계획의 기능 미지원이 아니므로 Python 공식함수 직접 호출로 정정하고 통과 결과 저장.
- 전체 렌더/화면/글꼴/출판은 브라우저 OS 제한 때문에 NOT_RUN/UNVERIFIED. 부분검사 통과를 시각 PASS로 쓰지 않음.
- 커밋 대상은 docs 트리의 plan·판정·장부뿐. 작업용 input/build/check/validation/report는 인수인계 자료. 원격 push·index·원본·운영장부·SVG·엔진 변경 없음.

추가 검증: 공식 frame_graph + graph 정확모델 + phase2.specFor 15/15 PASS. 다중곡선에는 중립 이름 라벨을 추가하여 답 수식 없이 식별 가능하게 했다. 여전히 full render/visual PASS가 아니다.


---
# TASK14 유사 확대 batch7-b

- 소유: archive/exams/similar/middle/m1/1mid/17_매산중_1학기_중간_중1_유사.js
- sourceCommit: 782966ffb38c969f1f54fc2f328f046741f5ff4a.
- batch5 index 미검토 상태 확인, 기존 로컬 결정파일의 시험지 이름 중복 없음 확인 후 부모에게 소유 보고.
- 원문24문항의 발문·보기·정답·해설 직접 읽음. FIGURE5(q7,8,9,11,13)/EXEMPT19, CONTENT0, UNSUPPORTED0.
- 수직선 공식 expandNumberLineFigure5/5 PASS. 새 SVG 렌더·시각검수·출판검수 NOT_RUN.
- 기존 문제·해설 이미지 연결 없음. q8·11·13은 수직선을 말로 완결해 설명하므로 누락 그림으로 판정하지 않음. q14는 표가 발문에 인라인으로 있음.
- q7 유리수 위치·부호·절댓값 관계, 분류 개수·선택번호는 숨김.
- q8 같은 간격5점, B=−3 E=6 및 BE길이9. 구하는 A,D와 불필요한 C좌표는 숨김. 간격의 동일성을 실제 좌표로 보존.
- q9 닫힌 −4/열린3 끝점 차이를 강조. 정수 최종 개수 숨김.
- q11 두 방향 이동을 각각 O→A, A→B 화살표로 연결. 도착5는 발문에 주어진 값이며 선택할 덧셈식은 쓰지 않음.
- q13 A=−2에서 왼쪽5 이동. 도착점 B의 값 숨김.
- q14 원문 표의 가로합을 이용해 미지수를 정한 뒤 열·대각선 합도 모두−3으로 검산. 중복SVG는 불필요.
- 순수 계산·식 구성·연산법칙19문항은 각각 별도 근거로 EXEMPT 기록. 유형에 따른 일괄면제 없음.

판정·그림장부24행씩, plans5개. index·원격·원본JS·SVG·운영장부 미변경. 실제 렌더 시 q7 근접 분수점 라벨과 q8 다중 간격 괄호 충돌을 별도 확인해야 한다.


---
# 미래엔 공통수학2 평면좌표와 직선의 방정식 중단원

최신 결과 index의 UNASSESSED 시험지 선택. 원문 main 782966ffb38c969f1f54fc2f328f046741f5ff4a 고정. 11문항: FIGURE9, EXEMPT2(Q3·8). 정답·해설 공란이나 원문으로 직접 풀이 가능한 문항이므로 CONTENT 처리하지 않았다. 원문 정답/해설 보충이나 변경 없음. 전11문항에 연결 그림 없음.

- Q1 거리의 직각삼각형, Q2 내분점, Q4 점과 직선의 수선, Q5 지름 원 위의 직각 두 후보, Q6 내분점과 주어진 기울기, Q7 무게중심 중선, Q9 교점과 평행선, Q10 k=0 예시의 제1사분면 교점, Q11 내각·외각 이등분선.
- Q5 두 C후보를 그림에서는 C,D로 구분하고 caption에 D의 의미 명시. 두 후보의 y좌표(답)는 표시하지 않는다.
- Q10 예시가 전체 k조건을 대신하지 않도록 명시.
- 문항(1)(2)가 함께 있는 Q1·2에서는 공간 관계가 더 뚜렷한 (2)만 그림화. 수직선 (1)은 직접 계산으로 충분.

공식 construction.execute9/9 PASS. Q5 교점 연산은 LINE,CIRCLE 순서를 요구하여 초안의 CIRCLE,LINE 순서를 바꿔 재검 통과. 모든 원본 GIVEN 점/직선은 표시 목록에 포함하고 선택점의 보조 방향점만 숨겼다. 전체 phase2·시각 렌더 NOT_RUN, publication UNVERIFIED. 원본·엔진·운영SVG·index 변경 및 원격 push 없음.

독립 검수 보완: 9plan 모두 명시적 SOURCE_COORDINATE_AXES_v1/source-coordinate/false 지정. Q1 축평행 보조선, Q6 방향 보조선, Q10 k=0 예시선은 DERIVED_INTERMEDIATE 역할로 구별. Q11 두 방향 보조점은 교점P의 TRANSLATE_POINT로 파생하도록 변경. Q1·4·5에 직각표식 추가, Q4에는 직선 위 파생 보조점R과HR을 표시해 수선의 직각을 표현. 수정 후 construction9/9 재통과.
