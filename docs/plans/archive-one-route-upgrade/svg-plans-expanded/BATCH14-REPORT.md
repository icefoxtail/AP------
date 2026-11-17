# TASK14 batch14 원본 OPEN 우선

원본5시험지 OPEN64문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 14,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/high/h2/2final/21_순천여고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 16,
      "decisions": {
        "FIGURE": 10,
        "EXEMPT": 5,
        "CONTENT": 1
      },
      "planFiles": 10,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 16,
      "decisions": {
        "FIGURE": 10,
        "EXEMPT": 6
      },
      "planFiles": 12,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/2final/24_효천고_2학기_기말_고1_수학.js",
      "reviewedOpenQuestions": 9,
      "decisions": {
        "FIGURE": 8,
        "UNSUPPORTED": 1
      },
      "planFiles": 9,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/23_매산여고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 8,
      "decisions": {
        "EXEMPT": 2,
        "CONTENT": 2,
        "FIGURE": 4
      },
      "planFiles": 5,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/1final/20_금당고_1학기_기말_고1_기출.js",
      "reviewedOpenQuestions": 15,
      "decisions": {
        "FIGURE": 14,
        "EXEMPT": 1
      },
      "planFiles": 14,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "FIGURE": 46,
    "EXEMPT": 14,
    "CONTENT": 3,
    "UNSUPPORTED": 1
  },
  "planFiles": 50
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# 21 순천여고 고2 수학II OPEN16

- 원문 main782966ff 고정, 시험지 전체를 읽고 운영장부 OPEN16(1,4,5,6,9,10,11,13,14,15,17,18,19,20,22,23)만 작성. FIGURE10 / EXEMPT5 / CONTENT1(Q18), plan10.
- 정확 git 경로로 모든 연결 자산9개 확인: 문제PNG7(Q9,10,13,15,17,19,23)과 기존 게시해설SVG2(Q8,16)를 전부 직접 열람. 자산없음0. 게시Q8/16 및 기존면제 문항은 수정하지 않음. 기존 게시 caption에는 정답이 있지만 이번 OPEN 범위에 포함시키지 않음.
- Q9 운영장부 OPEN_CONTENT의 reason은 빈칸. 실제PNG의5m/2m, 원문속도1.5와 닮음 조건이 충분하여 FIGURE. t2 배치예시에서 전체 그림자끝 거리x와 사람부터 끝점x−1.5t를 구분. 최종5/2미표시.
- Q18 원문은 h(x)=∫₀ˣ(d/dx)f(t)dt이지만 해설은 f′(t)의 적분으로 처리한다. 문자 그대로라면 적분 내부 미분은0이어서 해설과 다른 문제가 된다. 원문 오기 확인 없이 d/dt로 바꾸지 않고 CONTENT에 남김.
- Q10은 실제 위치그래프가 영점2개/최소점1개를 충분히 보여 중복생성 면제. Q4/6/14/20은 결정적 단계가 구간적분·연립·주기치환·대수적 도함수 비교라 새 임의 도식을 만들지 않음.
- Q1 수평선−k=−9 사례, Q19 k4 사례를 명시. Q19 가운데 넓이가 정사각형 위변 교점에서 나뉘는 구조를4개 영역조각으로 표시(S2는 같은색). Q11 다항식연장은실수전체지만 속도비교는t>0임을명시. Q22 함수식자체가답이므로자동식라벨없고주어진극점가로좌표/극대높이4만유지. Q23 a좌표와극대높이·최종총변화숨김.
- 공식 typed-condition binding + construction/display/spec1개, graph frame_graph+graph/spec9개 총10/10 PASS. 독립SymPy 관계검사9/9 PASS.
- 전체 실제새렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원본JS/SVG/엔진/index/원격수정없음. 독립검수대기.

Q9 independent review amendment: the example shadow endpoint C is now derived as intersection of ground AD and light ray BE; only A is a source coordinate anchor. B,D,E are translated from the given heights and example t2 travel distance. Official10/10 recheck PASS.


---
# original-w: 2022 팔마고 고2 수학II 2학기 기말

- source: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js`
- sourceCommit: `782966ffb38c969f1f54fc2f328f046741f5ff4a`
- 기존 OPEN16만 처리. PUBLISHED Q5/7/19, EXEMPT Q4/10/11은 변경하지 않았다.
- 결과 FIGURE10(12계획), EXEMPT6(Q2,3,15,16,18,21). 기존 OPEN_UNSUPPORTED에 끌리지 않고 원문/해설/그림을 직접 대조했다.
- 자산 직접확인: 문제PNG Q3/13/18/21 네 개와 기존 solutionSVG Q14/16 두 개. SVG는 래스터화하여 시각 확인. 장부의 문제·해설 자산 분리.

## 주요 판단
- Q3 기존 도함수 그림의 A/C/E/G 영점과 부호가 분명하다. Q18 기존 위치곡선 교점/증감/오목성, Q21 기존 음영 적분그림도 충분하므로 중복 제작하지 않았다.
- Q14 기존 solutionSVG는 `y=x(x−3)^2`로 정답 매개변수를 노출한다. 이를 변경하지 않고 새 plan으로 보완 제안했다. a=2 및 a=1/2인 두 높이차 함수 예시로 양의/음의 교점 순서를 모두 다룬다. 예시가 등적 사례가 아니라는 점을 명시. 0<a<1의 배제 적분도 독립검증.
- Q16 기존 solutionSVG의 S1=S2=18은 필요한 중간값이며 최종값108은 노출하지 않는다. 기존도형이 충분해 EXEMPT로 유지할 제안이다. 새 중복 plan은 만들지 않았다.
- Q6 |x|는 실제 piecewise-polynomial로 표현하여 절댓값 함수를 두 독립 곡선으로 속이지 않았다.
- Q8/Q17의 수평 비교선은 공식 지원 overlay 선분으로 표현하고 중간 극값은 보존, 최종 개수/합은 숨겼다.
- Q9/Q20 매개변수 예시는 명시적으로 예시라 표기했다. 최종 매개변수 범위나 경계 최대값을 caption에 쓰지 않았다.
- Q22 ρ=√(k/(6π)), u=r/ρ로 정확히 정규화한 V/(πρ³)=3u−u³을 사용했다. 특정 k를 원문처럼 가정하지 않는다. 실제영역0<u<√3와 비교를 위한 다항식 연장을 구분하고 최종비1:2는 미표시.

## 검증
- 공식 frame_graph→graph→phase2.specFor 12/12 PASS. piecewise2/polynomial6/multi-curve4. validation.json.
- SymPy 독립 수학검증: 극값 후보, Q13 적분, Q14 두 경우의 적분, Q16 부분면적, Q17 정규화, Q22 미분 PASS. math-validation.json.
- 구조검사 오류0/경고0. 16행/12파일.
- full render 및 새 PNG 시각검수 NOT_RUN. 부분검사를 렌더통과로 표시하지 않았다.
- 원본/엔진/운영장부/기존SVG/원격 변경 없음. docs만 리드에게 통합 전달.

## Independent review amendment
Q22 y-axis changed to W with caption W=V/(πρ³), preserving exact normalized function and answer hiding. Official final-spec checks rerun12/12 PASS.


---
# original-y: 24 효천고 고1 2학기 기말
- Source: 782966ffb38c969f1f54fc2f328f046741f5ff4a, blob 9e5a27aab079faf4698efc366b63eba996c077d1.
- 기존 운영 장부 OPEN 9개(q2,3,4,6,10,12,16,18,21)만 판정. 나머지 PUBLISHED 14개 유지.
- FIGURE 8 / UNSUPPORTED 1(q10) / 신규 plan 9개: SLOTS 6, VENN 1, MAPPING 2.
- 원문 23개 자산 필드 인벤토리 보존. 담당 OPEN 9개 기존 solution SVG를 각각 PNG로 렌더하여 직접 확인했다. 기존 9개는 모두 존재하며 최종 답을 표시하고 있다. 신규 plan은 누락 채우기가 아니라 기존 핵심 관계를 유지하면서 답을 숨기는 개선 사양이다. 운영 SVG·원문·운영 장부 변경 없음.
- q2 지수 선택, q3 E 고정과 중간 순열, q4 남녀 독립 조합, q6 교대 배치 여사건, q12 무표지 두 조의 교환 중복 제거, q21 홀짝 두 경우를 보존했다.
- q16 기존 A만18/B만18/교집합6을 집합 전체24씩/교집합6으로 동치 표시. U=120에서 합집합 여집합을 색칠한다. 수6이 원소값 아닌 배치 수임을 caption에 명시; 면적 비율은 쓰지 않는다.
- q18 나머지 px+q+3 및 무리수근 때문에 p=0 불가능을 확인. identity/swap 두 대응을 별도 plan으로, p,q와 pq 최댓값은 미표시.
- q10 일반 n,r의 상징적 선택 순서를 특정 수치 예시로 왜곡하지 않는다. SLOTS count nCr/r은 STAT_SLOTS_COUNT_INVALID 재현. 빈칸의 답을 표시하지 않는 일반 조합식 선택 도식은 UNSUPPORTED로 기록하고 기존 SVG는 그대로 보존.
- checkStatChartPlan→statChartSpec 6/6 PASS, checkSetDiagramPlan→setDiagramSpec 3/3 PASS. validation.json에 실제 최종 표시 spec 라벨과 caption 기록. 최종18,120(q3),90,108,1575,78,4(q18),231 미표시 확인. q16의120은 다른 문항의 답과 무관한 필요한 중간값이다.
- 전체 브라우저 렌더/조판/관측은 NOT_RUN, publication UNVERIFIED. 위 PASS는 모델 및 최종 표시 spec 부분검사에 한정한다. index·원격 push 미수행.


---
# 23 매산여고 고2 확률과통계 OPEN8

- 고정 main782966ff, 본문 blob8aa5477a89cda16518b015d142f45bd390d7fa62. 실제 시험지별 운영장부의 OPEN Q2/4/7/9/15/16/17/19만 작성. FIGURE4 / EXEMPT2 / CONTENT2, 계획5개(통계3·수직선2).
- 8문항의 발문·표·보기·해설 직접 읽음. 대상8개에는 문제·해설 이미지 또는 plan 참조가 없다. 대상 밖 PUBLISHED Q5/6/13/14/18/22 등의 기존 그림은 범위 밖이며 변경·재판정하지 않는다. 보지 않은 이미지를 봤다고 기록하지 않았다.
- Q4: 정규모집단 표본평균의 연속분포와 다섯 값의 이산표가 양립하지 않는다. 이산표 자체의 평균3·분산4/3 계산은 맞지만 원문 가정 확인 필요.
- Q9: 문맥 재검으로 EXEMPT 교정. 순서 없는 두 수의 차는 차의 크기로 읽고, 원해설도 |i−j|를 명시한다. 부호차는 추출순서를 추가하는 해석이므로 과도한 CONTENT 사유로 삼지 않는다. 간격배율과 기댓값 설명으로 충분하다.
- Q17: 상자 간 독립과 상자 내부 봉지 간 독립은 다르다. 원문은 앞의 독립만 명시, 해설은 뒤의 독립도 사용한다. 내부 완전양의상관과 내부 독립 모두 주어진 주변분포에 맞지만 합분산이 각각8000,400으로 달라진다. 조건 확인 전 CONTENT. 임의 수정이나 가정 없는 확정 그림은 작성하지 않았다.
- Q7: 일반 정규표와 다른 발문 표의 z3 기준을 표 기준으로만 유지. 신뢰구간 반길이3/중점168.5를 표시하는 수직선으로 풀이 연결, 최종 n은 숨김.
- Q15: 표준화 반폭1.5의 좌우 색 구분. 표본크기 답은 숨기고 실제 계산에 쓰는 중간 경계 유지.
- Q16: 병 부피와 불량 개수 분포를 별도 그림으로 구별. 후자는 문제 표 기반 이항정규근사·연속성 보정 없음 명시. 평균200·표준편차14와 경계228은 유지, 최종확률과 같은 첫 단계 p의 숫자는 표시하지 않음.
- Q19: 열린구간 양 끝14/16만 표시, 자연수점15 및 자동눈금 노출 없음. 변수m 사용.
- checkStatChartPlan(허용키)→solveStatChart→statChartSpec 통계3/3 PASS. expandNumberLineFigure→solveNumberLineFigure→numberLineFigureSpec 수직선2/2 PASS. 수학 및 실제 최종spec 라벨 검사18건 PASS. accessibilityDescription 등 통계 불허 필드 없음.
- 새 SVG 전체 렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원본JS·자산·엔진·운영장부·index·원격 변경 없음. 독립 검수 대기.


---
# original-x: 2020 금당고 고1 기말

- Fixed source main `782966ffb38c969f1f54fc2f328f046741f5ff4a`, source blob은 장부 각 행에 기록.
- OPEN 15개(2,3,4,5,9,10,11,12,13,14,18,19,20,21,22): FIGURE14, EXEMPT1(Q11), 계획14개.
- 시험지 원문 연결 자산20개 전부 확보하고 직접 시각 확인: 대상 해설SVG14+문제PNG2, 비대상SVG4. 비대상 PUBLISHED 자산/결정은 수정하지 않았다. 첫 자산 집계 메시지의21은 착오로 실제20개이다.
- 구형 그림의 핵심 외분비/직각/원-직선 거리/현/평행선 닮음/네 접원/정사각형 중점/무게중심/내심/접선·지름 관계를 보존해 construction 사양으로 작성했다. 기존 그림·캡션의 정답은 새 계획의 표시문구에서 제거했다.
- Q5 k=4, Q10 k=0은 조건을 만족하는 예시라고 명시했다. Q14 실제 닮음비1:2를 보존했다. Q18 양축에 접하는 원을 네 사분면 모두 포함했다. Q21 첫 소문항 답 P 좌표도 숨겼다.
- Q4와 Q20 원문 의심: α,β가 서로소 양의 정수라는 조건이 없어 α+β의 유일성이 명시적으로 보장되지 않는다. 기약분수 관례를 추가하지 않고 확정된 도형관계의 계획만 작성했으며 결정표에 확인 필요를 남겼다. 원문 수정 없음.
- 공식 construction→specFor 14/14 PASS. 길이표시가 참조하는 실제 선분까지 확인. math-validation.json에서 외분/수직/수선발/현/접원/정사각형/무게중심/내심/접선 관계 정확 검산 PASS.
- 신규 SVG/PNG 렌더 NOT_RUN, publication UNVERIFIED. 원본·엔진·운영장부·인덱스·원격 미수정. 독립 검수 대기.

## 파생점 작도 계약 보완
- 독립 검수에서 지적한 파생점 원시좌표 문제를 수정했다. 실제 주어진 좌표만 SOURCE_POINT/GIVEN으로 남기고 외분/수선발/내분/반사/교점/무게중심/각이등분선/원-직선 교점 선택 연산으로 전부 변경했다.
- Q14는 정규화 C와 주어진 CD길이3, 도출한 CE4 및 닮음배율−2로 구성하고 실제 SEGMENT_LENGTH 스칼라 라벨로 표시한다. Q22 한 접점 분기만 보이며 다른 것은 y=x 대칭임을 명시했다.
- construction→specFor 14/14 PASS 재확인. 독립 재검 대기. 최초 검사 통과가 파생점 출처 계약까지 검증한 것은 아니었으며 이번 보완으로 분리해 확인한다.


## 최종독립검수 및 회귀보완
5시험지 모두 독립검수완료. v파생점C공식교점수정, w정규화축명확화, y상징count지원제약재현, z Q9문맥상차의크기로읽어과잉CONTENT를EXEMPT로교정. z조건문제는2건유지. x14계획의파생점원시좌표를공식operation으로보완,모든동명점정확기호차0 및최종spec14PASS.
기존저장중3 r4계획도같은파생점provenance보완을포함. 원문기준점만SOURCE_POINT,파생점은공식연산. 평면도형시작점1개는발문좌표주장이아닌이동자유도고정앵커로명시. 독립검수에서공식binding→math→spec4PASS,전후모든동명점정확기호차0,표시필드완전동일. 이4개는신규계획수에더하지않음. 실제전체렌더NOT_RUN/출판UNVERIFIED,엔진·원문·SVG·운영장부불변.
