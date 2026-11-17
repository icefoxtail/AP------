# TASK14 batch16 원본 OPEN 우선

원본8시험지 OPEN31문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 16,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/high/h2/2final/2019_매산고_2학기_기말_고2_확률과통계.js",
      "reviewedOpenQuestions": 6,
      "decisions": {
        "EXEMPT": 2,
        "FIGURE": 4
      },
      "planFiles": 7,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/1mid/26_금당고_1학기_중간_고2_대수.js",
      "reviewedOpenQuestions": 4,
      "decisions": {
        "FIGURE": 4
      },
      "planFiles": 6,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_대수.js",
      "reviewedOpenQuestions": 3,
      "decisions": {
        "FIGURE": 2,
        "EXEMPT": 1
      },
      "planFiles": 3,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1mid/19_서울안천중_1학기_중간_중3_수학.js",
      "reviewedOpenQuestions": 5,
      "decisions": {
        "EXEMPT": 3,
        "FIGURE": 2
      },
      "planFiles": 2,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1mid/19_서울시흥중_1학기_중간_중3_수학.js",
      "reviewedOpenQuestions": 4,
      "decisions": {
        "EXEMPT": 4
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1final/16_장흥중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 3,
      "decisions": {
        "FIGURE": 2,
        "CONTENT": 1
      },
      "planFiles": 2,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/2mid/19_금당고_2학기_중간_고1_기출.js",
      "reviewedOpenQuestions": 3,
      "decisions": {
        "FIGURE": 3
      },
      "planFiles": 3,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1final/17_경북대도중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 3,
      "decisions": {
        "CONTENT": 3
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "EXEMPT": 10,
    "FIGURE": 17,
    "CONTENT": 4
  },
  "planFiles": 23
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# original-aa: 2019 매산고 고2 확률과통계

- 고정 main 782966ffb38c969f1f54fc2f328f046741f5ff4a. Source blob은 각 장부 행 기록.
- OPEN6(Q8,9,11,12,15,18): FIGURE4 / EXEMPT2, plan7개(수형도2, 정규분포4, 수직선1).
- 대상 원문·해설 전부 직접 읽음. 연결 문제 PNG q15/q18 직접 확인. 동일 PNG가 solutionImage에도 걸려 있어 두 용도에 모두 기록하되 원본을 변경하지 않았다. 전체 시험지 자산11개는 참조 목록과 실제 존재를 대조했으며 비대상9개는 재판정/시각검수하지 않았다.
- Q8은 표본평균의 평균·분산 공식으로 충분하다. Q15는 기존 밀도그림의 두 삼각형과 분포표가 이미 핵심관계를 제공하므로 추가 제작하지 않는다.
- Q9 깊이4 수형도는 STAT_TREE_TOO_DEEP. 첫 경기 철수승/영희승의 두 조건부 수형도로 나누고 각 경우확률1/2를 곱해야 함을 캡션에 명시했다. 각 수형도는 최대깊이3이며 중단 승수조건을 정확히 반영한다. 최종 분배비는 표시하지 않는다.
- Q11 신뢰구간 중심32와 두 구간을 같은 눈금으로 비교. Q12 대칭 꼬리와 표준화−1 오른쪽 넓이. Q18 중앙표준구간과 오른쪽 꼬리만 그려 소문항 답인 σ=4/시간51/학교대응을 노출하지 않는다.
- 통계 checkStatChartPlan(허용키)→solveStatChart→statChartSpec 6/6 PASS. 수직선 expand→compositePanels→solve→numberLineFigureSpec 1/1 PASS. 최종 라벨과 음영 경계를 display-audit.json에 보존하여 직접 확인했다.
- 신규 렌더 NOT_RUN / publication UNVERIFIED. 원본·엔진·운영장부·원격 수정 없음. 독립 검수 대기.


---
# 26 금당고 고2 대수 OPEN4

- 고정 main782966ff 원문·해설 직접 판독, 운영장부 OPEN Q15/16/18/21만 처리. FIGURE4, 계획6. 대상4문항의 문제/해설 자산 참조 없음. 게시/면제 행 미변경.
- Q15 t=log₂x,A=log₂a 치환 후 A2와5인 두 예시로 최솟점이 축 위/아래인 차이를 보인다. 최종 a경계는 쓰지 않음.
- Q16 제1사분면의 OP와 수선PH로 tanθ=PH/OH를 표현. OH3는 중간값, P의 구하는 세로좌표는 숨김. 곡선 조건 y²=x는 caption/근거에 보존. 좌표축 recipe와 직각·θ표식 포함.
- Q18 같은 높이의 좌우 거리와 공통 점근선x4. 서로 다른 함수 조건 때문에 같은 쪽 동일함수는 제외하고 반대쪽 로그대칭을 표시. 최종abc미표시.
- Q21 u=3^t>0 치환 후 k1과2인 Q(u) 및 두 수평선±7/27을 비교. 다항식 연장의 음수교점은 실제 t에 해당하지 않음을 명시. 중간k/근은 허용하고 최종83/2는 쓰지 않음. 모든 k≥2에 대한 근곱 음수 설명은 근거에 보존.
- 공식 typed-condition binding + construction/display/spec1 및 frame_graph/graph/spec5, 총6/6 PASS. 초기 overlay 낮은선 프레임 문제는 정확한 referenceLines로 해결(해가없는 음의선도 빈 교점목록으로 검증).
- 새 SVG 전체 렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원본/엔진/운영장부/index/원격 변경 없음. 독립검수 대기.


---
# 26 제일고 고2 대수 OPEN3

- main782966ff 고정, 운영장부 OPEN Q18/19/23만 작성. FIGURE2 / EXEMPT1(Q23), 계획3개. 해당 발문·해설 모두 읽고 기존 해설SVG Q23을 정확 git 경로에서 추출·래스터화해 직접 확인했다. 다른 두 문항에는 연결 문제/해설 그림 없음.
- Q18 좌우 로그곡선과 높이0/3의 네 점으로 사다리꼴을 구성. 평행변 길이를 결정하는 중간 좌표는 유지하고 최종 넓이27/2는 미표시.
- Q19 원래 변수 그대로 ratePi=1/2의 sin(πx/2)를 표현. 자연수n7과8 비교사례에서 관련영역 n/2<x≤n을 정확 유리수/OPEN·CLOSED로 선언했다. n7의 오른쪽 끝점 교점은 endCrossing=true이고 바로 앞 내부교점도 포함되어 총3을 공식 엔진이 검증. n8은2. 두 사례만으로 전체자연수 분류를 대신하지 않는다고 명시하고 최종합46은 숨김.
- Q23 기존 그림은 직선의 열린 끝과 절댓값 지수가지의 닫힌 끝, 오른쪽 점근선, 수평높이별 교점 개수를 이미 제공한다. 교점수표는 최종 순서쌍50을 계산하는 중간정보이며50은 그림에 없어 중복계획 EXEMPT. 기존SVG/슬롯 변경없음.
- 공식 frame_graph→graph→phase2.specFor3/3 PASS. 초기3.5/4.0 문자열의 삼각구간거절은 정확7/2·4 유리수표현으로 수정했다. 포함 끝점과 내부근은 엔진이 서로다르게 재검증했다.
- 실제 새SVG 전체렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원본JS/기존SVG/엔진/운영장부/index/원격 수정없음. 독립검수 대기.


---
# original-ad: 2019 서울안천중 중3 중간

- 고정 main 782966ffb38c969f1f54fc2f328f046741f5ff4a. 대상 OPEN5: Q10,12,23,24,26.
- 기존 SOURCE사유는 정답·해설 공란이었다. 원문 발문·선택지 및 연결 SVG6개를 직접 열람하고 독립 풀이한 결과 실제 정보 부족은 없었다.
- FIGURE2(Q12,24), EXEMPT3(Q10,23,26), plan2. Q10 근호와 직사각형 둘레, Q26 타일의 인수분해는 원그림으로 충분하다. Q23은 수직선 점 표시 자체가 답이므로 완성 위치를 새 그림으로 노출하지 않고 모눈의 빗변 작도 근거만 장부에 남겼다.
- Q12는 색칠 영역의 바깥 마름모와 안쪽 흰 정사각형 경계 양쪽을 세어야 함을 보이는 그림이다. 중점 연산으로 두 정사각형을 만들고 대표 변의 실제 길이만 표시한다. 최종 합은 숨겼다.
- Q24 실제 조각 번호와 합동·변길이를 대조했다. 비합동 동일둘레 조각은⑥⑦, 길이4+2√2. 새 그림은 (3)의 외곽만 분리하여 각 변3√2,4,2,√2,6을 보여주고 최종 합12+4√2 및 앞 소문항 답을 숨긴다. 다른 배치의 임의 그림으로 대체하지 않았다.
- 모든 파생점은 정규화·평행이동·MIDPOINT로 구성했으며 파생 SOURCE_POINT 원시 좌표 없음. 길이는 SEGMENT_LENGTH 계산으로 표기.
- binding→construction→specFor 2/2 PASS. 신규 렌더 NOT_RUN, publication UNVERIFIED. 원본·엔진·운영장부·원격 변경 없음. 독립 검수 대기.


---
# original-ae
서울시흥중 2019 중3 중간 OPEN 4개(Q5/13/18/21)를 원문·선택지와 기존 SVG 4개를 직접 래스터 열람하여 독립 재판정했다. 모두 EXEMPT 4, 추가 plan 0. 기존 문제 그림이 필요한 구간, 면적 결합, 조각 대응, 반원 합차를 이미 명확히 제공한다. 빈 해설만으로 CONTENT 처리하지 않았다. 전체 다른 17개 장부 행은 변경하지 않는다.
정확 풀이: Q5 ⑤, Q13 3a+4, Q18 √2/4√2, Q21 πa(a+1). 이는 검수 근거이며 새 그림 또는 caption에 출력하지 않는다. 원문·엔진 수정 없음. 새 plan이 없어 공식 render/spec 적용 대상 없음. 구조 검사 결과 별도 확인.


---
# original-af
고정 원본 782966ffb38c969f1f54fc2f328f046741f5ff4a 장흥중 2016 중3 기말 지정 3문항: FIGURE 2(Q7/Q11), CONTENT 1(Q20). plan 2개.

- Q7: 기존 문제 SVG와 과거 PNG를 직접 보았다. 10×16 사진 밖의 균일 폭 x를 더해 전체변 10+2x,16+2x를 보이는 보조 그림이다. 좌표를 답 x=1로 만들지 않고 x=2 배치 예시임을 명시했다. 면적56은 예시 배치가 만족한다고 주장하지 않는다. A의 원점은 평행이동 게이지, 나머지 전부 TRANSLATE_POINT 생성. 폭과 넓이 관계식으로 최종 x=1 검산.
- Q11: 기존 SVG/PNG 직접 확인. 원점 꼭짓점과 (2,2)를 통해 f(x)=x²/2 확정. x=-4부터 곡선까지 수직 보조선 추가. 구하는 y값8은 점 좌표 라벨·축눈금·caption에 숨겼다.
- Q20: PNG 직접 확인, 그림에는 y=x²/2+2가 적혀 있다. 본문/해설 y=x²+2와 실제 충돌. 각각 최소 위치 P(1,5/2),P(1/2,9/4)로 다른 답이 되어 CONTENT 유지. 정답 보기로 그림 조건을 고치지 않는다.

공식 부분 검사: construction typed condition → construction → specFor 및 graph frame_graph → graph → specFor, 2/2 PASS. 구조 오류0, Q7 caption의 '정답 배치가 아니다' 때문에 문자열 휴리스틱 경고1이며 실제 답 노출 아님. 전체 렌더 NOT_RUN, 새 그림 시각 검수 false. 검사기·원문·엔진 변경 없음. 대상 외 21문항 불변.


---
# original-ag — 2019 금당고 고1 2학기 중간

- Source: `782966ffb38c969f1f54fc2f328f046741f5ff4a`. 장부 OPEN 3개(q18,21,22)만 검토, FIGURE 3 / plan 3. 기존 PUBLISHED/EXEMPT 변경 없음.
- q18: Q 비공집합이면 1을 포함하는 관계를 b=3,c=1의 예와 일반 논증을 구별하여 표현. 보기 판정 결과 숨김.
- q21: 기존 문제 PNG와 해설 SVG를 실제 래스터로 직접 확인. 5–12–13 직각삼각형, 세 수선, 내심 등호 조건 보존. PA/PB/PC를 더하여 넓이 분할을 보여 줌. P는 예시 무게중심, 등호점으로 오인하지 않도록 caption 명시. 최종 120 숨김. 원문과 기존 그림 변경 없음.
- q22: 두 가지를 공식 연속 구간별 다항식으로 연결, y=x 대칭선. f=f역함수 관계만 보여 주고 g(3)값 숨김.
- 공식 frame_graph→graph→specFor 2건, binding→construction→specFor 1건 PASS. `validation.json`, `input/spec-*.json` 보존. 초기 지원 형식 오류는 계획만 보완하여 해소했으며 엔진 변경 없음.
- 대상 자산 2개 모두 직접 확인. 시험지 전체 참조는 6개이며 대상 밖 q7/q11 PNG, q16/q20 SVG는 목록 확인만 했고 시각 검토했다고 주장하지 않음.
- 새 SVG 실제 렌더 NOT_RUN, newPlanVisualReviewed=false, publication=UNVERIFIED. 원격 저장/운영 장부 수정 안 함. 독립 검수 대기.


---
# original-ah
경북대도중 2017 중3 기말 지정 OPEN3문항 Q3/7/21을 원문·해설·선택지 및 실제 PNG 3개 직접 확인했다. CONTENT 3 유지, 신규 plan 0. 기존 장부 사유를 그대로 복사하지 않고 원본의 좌표/빈도를 독립 판독해 검산했다.
- Q3: 실제 그림 y=4x²/9, 답④. alt/해설/답③은 음의 계수로 반대.
- Q7: 실제 꼭짓점(−1,6), 절편3 → a−3,p−1,q6. 합2가 기존 답과 우연히 같으나 기존 풀이의 꼭짓점(2,−1),a1은 원본과 다름.
- Q21: 도수 A22222,B31213,C12421 (권수3~7), 각10명 평균5. 분산2,2.6,1.2. ㅁ은 거짓인데 기존 해설은 참이라고 쓴 뒤 결론에서는 제외. ㄷ·ㄹ이 맞는 이유는 새 검산으로 확인.

원본 그래프의 조건 자체는 충분하다. 그러나 해당 조건에 맞는 계획을 운영 해설과 연결하면 서로 다른 곡선/분산 순서가 공존하므로, 이 범위에서는 내용 정정 필요성을 장부에 보존하고 신규 그림을 만들지 않았다. 원문·답·해설·엔진 변경 없음. plan 없음으로 spec/render 대상 없음. 구조 오류·경고0.


## 최종독립검수
8시험지 모두 독립검수완료. 기존그림직접확인 및문항별독립풀이/검산. aa조건부수형도확률, ab양의변수/최종해개수, ac열린왼쪽닫힌오른쪽교점, ad실제재배치, ae기존그림충분성확인. af계수충돌CONTENT/단일원점정규화앵커타당/불필요이름숨김. ag원본직각4개표시보완후최종spec재통과. ah실제PNG와해설충돌3건보존. 신규지원계획23개공식끝단검사PASS,실제전체렌더NOT_RUN/출판UNVERIFIED.
