# TASK14 batch7 원본 OPEN 우선

원본3시험지 OPEN56문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 7,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 20,
      "decisions": {
        "EXEMPT": 8,
        "FIGURE": 12
      },
      "planFiles": 12,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/21_매산여고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 18,
      "decisions": {
        "FIGURE": 13,
        "EXEMPT": 5
      },
      "planFiles": 13,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 18,
      "decisions": {
        "FIGURE": 14,
        "EXEMPT": 3,
        "UNSUPPORTED": 1
      },
      "planFiles": 18,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "EXEMPT": 16,
    "FIGURE": 39,
    "UNSUPPORTED": 1
  },
  "planFiles": 43
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# TASK14 원본 OPEN: 19 복성고 2학기 기말 고2 수학II

- 최신 source: 782966ffb38c969f1f54fc2f328f046741f5ff4a (origin/svg-lead-save-main).
- 장부 전체23문항 중 OPEN20(q3,4,5,6,7,9~23)만 처리. q1·2·8 비대상은 미변경.
- FIGURE12 / EXEMPT8 / CONTENT0 / UNSUPPORTED0. 계획12개, 판정표·그림장부 각20행, no 중복 없음.
- graph_framing.fit_overview11/11 PASS(다중곡선1, 구간별다항10), numberline expand1/1 PASS.
- q14 원뿔/내접 원기둥 문제PNG 직접 확인: 원뿔 반지름6·높이18과 공통 밑면 원기둥 배치. 나머지 대상은 image/solutionImage 연결 없음.
- 실제 신규 SVG/PNG 렌더는 NOT_RUN. 좌표·모델 부분검사를 시각·출판 통과로 표시하지 않음. 기존 SVG·원본JS·운영장부·index·원격 변경 없음.

## 그림과 중간관계
- q4 도함수 이차식의 근 −1,3과 부호변화로 극대 위치 결정. a 수치는 쓰지 않음.
- q7 두 포물선의 위아래 관계, x=−2~4 사이 영역. 최종 넓이 숨김.
- q9 도함수 음수 부분에서 원함수 감소. 최종 구간 표기는 본문에 맡김.
- q11 삼차함수 극대(-2,15), y절편(0,3), 극소(4/3,−95/27). 예시 y=9에서 양·음근 개수를 읽음. 최종 정수 개수 숨김.
- q14 기존 문제 그림을 유지하고 닮음 h=18−3r에서 얻은 V/π=r²(18−3r)의 증가·감소를 보완한다. 원뿔 안 원기둥의 3D 직접 내접은 solid guide 지원범위 밖이나, 기존 문제 그림이 있으므로 이를 억지 재작성하지 않고 지원되는 정확한 부피함수 그래프로 푼다. 최대점 좌표 숨김.
- q15 φ(x)의 구간 최대와 a의 하한 관계. 꼭짓점 높이 숨김.
- q17 u=x/a, v=f(x)/a⁴ 정규화로 v=u³−u의 두 영역 대칭 보존. 실제 넓이는 a⁵배임을 명시, 임의 a 예시를 실제 넓이512 조건에 섞지 않음.
- q19 원운동 상대이동거리 d=t+t²/2와 세 바퀴180의 관계. 시간·거리 단위가 달라 y/x=1/10 스케일 명시, 해 시각 좌표 숨김.
- q20 높이 포물선 꼭짓점 및 지면 복귀, 최대점 좌표와 최종 속도 숨김.
- q21 도함수 포물선의 축−2와 증가조건의 x축 접촉 경계. f′(1) 최솟값 표시 안 함.
- q22 적분 구간을 −1→1→x로 나누는 수직선. 미지 x는 값 없는 문자점으로 사용.
- q23 a=1,b=0의 기준 모양과 중앙극대/양옆극소 대칭. 실제 b는 수직이동으로 정하도록 두며 구하는 합을 쓰지 않음. a=−3 후보 배제 이유를 caption에 함께 적음.

## 그림 불필요 8건
q3 인수분해 약분 극한, q5 적분상수, q6 대칭차분, q10 도함수 근의 중복도·판별식, q12 부분적분·미분 항등식, q13 부정적분 관계 미분, q16 가법식 미분, q18 미지 우함수·홀함수 정적분 항등식. q10은 정답 후보만 그림으로 선택해 답을 노출하지 않도록 대수적 판정에 맡긴다. q18은 미지 함수 모양을 추정하지 않는다.

실제 렌더 후 q14·15·20 답 좌표 숨김과 자동 눈금, q17 분수·근호 라벨, q23 중앙 접합 가독성은 독립 시각검수가 필요하다.


---
# 매산여고 2021 고2 수학II OPEN 18

원본 및 운영 장부 기준 main 782966ffb38c969f1f54fc2f328f046741f5ff4a. OPEN18만 판정: FIGURE13 / EXEMPT5(Q5·9·12·13·22). 원본·운영 장부·SVG 수정 없음, 원격 push 없음.

기존 그림 직접 확인: Q6 q06-quality-v4.svg를 Inkscape로 PNG 사본 변환하여 확인. 속도 꺾은선 (0,0),(1,4),(3,-4),(4,-4),(6,4),(8,4),(9,0)을 보존했다. Q20 q20.png를 직접 확인: 반지름8 높이12 원뿔 내부 정사각형 밑면 직육면체. 새 계획은 밑면 대각선을 지나는 중심단면이며 높이를 절반으로 놓은 예시임을 명시했다. 다른 대상에는 연결 그림이 없음.

계획별 핵심:
- Q4 도함수의 극대 위치 판정, Q7 곡선 세로차의 대칭. Q7 꼭짓점 좌표를 숨겨 최종 a가 바로 쓰이지 않게 했다.
- Q8 삼차곡선과 이차곡선, 공통 접선. 교점 -1,1 및 접선과 삼차의 교점 -1,2를 빠짐없이 기재.
- Q10 홀함수의 원점대칭, Q11 두 위치의 차의 영점. Q11 다항식의 음수 t 연장은 운동 구간이 아니라고 note에 명시.
- Q16 a=2 예시만 제시, 전체 자연수 a 범위로 오해하지 않게 명시.
- Q17 바깥 함수의 감소 관계만 보임. 최종 x의 최솟값 미표시.
- Q18 사차곡선 극값과 원점 높이. 임의 수평선 근의 중첩근호를 억지로 근사하지 않고 공식 다항곡선 단독 경로를 선택.
- Q19 곡선과 접선 사이 영역, 극점 좌표는 정확 근호.
- Q21 도함수의 부호·가로축 사이 넓이. 최종 극댓값·넓이 미표시.
- Q23 기본 한 주기 0≤x≤3만 그려 전체 g를 한 삼차곡선으로 오인하지 않게 함. 양 끝의 연속성을 보임.

공식 graph_framing.fit_overview12개 + construction.execute1개 PASS. 최초 다중곡선에 삼차·사차를 넣은 시도는 거절되어 지원하는 piecewise-polynomial referenceCurves/referenceLines 및 polynomial 경로로 변경. Q6은 6조각이므로 최대12조각을 받는 piecewise-discontinuous 경로 사용. 모든 분기와 열린·닫힌 경계를 한 값으로 보존.

전체 렌더·픽셀 검증은 NOT_RUN, publication UNVERIFIED. 계획13개와 결정/장부18행. 검증 기준이나 엔진 코드 변경 없음.

독립 검수 반영: Q11 caption에 음수t는 다항식 연장이고 실제운동 t≥0을 명시. Q21은 polynomial의 자동 식 라벨이 소문항1 답을 드러내므로 formula 없는 piecewise-polynomial로 교체, 정지점0·2 보존 후 검사 PASS. Q20은 PLANE_FIGURE_v1로 좌표축·좌표띠 제거, OB8·TO12 길이와 F·G 직각 표시로 실제 원뿔 단면 관계를 보완.


---
# 원본 복성고 고2 수학II OPEN18

- 기준 최신 main 782966ffb38c969f1f54fc2f328f046741f5ff4a. 시험지 blob4f0b35dc7a72b0014cc8791d42ce29dd8eb7d4f6; fixed9fbc와 동일. q13~15 PNG도 두 기준 blob 동일.
- OPEN 1,2,3,6,8,9,11,12,13,14,15,16,17,18,19,20,21,22만 검토.
- FIGURE14문항 18plan / EXEMPT3(q3,12,22) / UNSUPPORTED1(q14).
- q13,14,15 기존 PNG 직접 열람. 해당 OPEN에 연결 solution SVG는 없음.
- graph_framing.fit_overview 17plan PASS, solveSolidFigure 1plan PASS. 적분·도함수·극점 관계 별도 SymPy검산 PASS. 전체 렌더·작은 화면 시각검사는 NOT_RUN.
- q14 실제 사차 상단 곡선−x⁴+x의 기약삼차 극점에 대해 PIECEWISE_POLY_ROOT_NOT_CLOSED_FORM 재현. 곡선을 이차로 바꾸거나 정확하지 않은 좌표로 그리지 않고 엔진 기능 공백 기록.
- q13 k=1 정규화 및 이동구간 예시, q11 t=14 비교예시, q16 a=0/2/3 세 경우, q17 n=1/2/3에 대해 f′/6 부호 그래프, q18 k=2 수직이동 정규화, q19 k=1/2 비교 예시, q20 끝점−1/1인 할선 예시를 명시. 예시가 최종 결론이나 모든 경우를 대신한다고 주장하지 않음.
- q15는 같은넓이의 정확한 모델을 사용하되 답인 a/2a 숫자와 극점좌표를 숨김. q18 최신 본문은 직사각형 변의 좌표축평행을 명시하므로 그 관계로 계획(옛 메타 내용의 모호성 판단은 따르지 않음).
- q21 닫힌 원기둥 전개도에 r,h 문자만 표시하여 두 소문항 정답을 노출하지 않음.
- 원본 JS/엔진/운영 장부/원격 변경 없음. 렌더 실패나 작업량을 근거로 EXEMPT하지 않음.


## 최종 독립 검수
3시험지 전체 독립검수 완료. h Q21 자동 식라벨로 답노출 가능성을 piecewise-polynomial로 변경해 해결, Q11 정의역 및 Q20 구성/직각 표기 보완. i 예시·정규화4건 caption 명시. 공식부분검사 재통과. 실제렌더/출판은 미검증.
