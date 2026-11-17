# TASK14 batch17 원본 OPEN 우선

원본8시험지 OPEN16문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 17,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/high/h1/1mid/19_순천여고_1학기_중간_고1_기출.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "FIGURE": 1,
        "UNSUPPORTED": 1
      },
      "planFiles": 1,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/2mid/20_복성고_2학기_중간_고1_기출.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "FIGURE": 2
      },
      "planFiles": 2,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/2mid/20_효천고_2학기_중간_고1_기출.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "FIGURE": 2
      },
      "planFiles": 2,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "FIGURE": 2
      },
      "planFiles": 3,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1mid/19_연향중_1학기_중간_중3_기출.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "CONTENT": 2
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/2mid/21_금당중_2학기_중간_중3_수학.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "CONTENT": 2
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m2/2mid/21_왕운중_2학기_중간_중2_수학.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "CONTENT": 2
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m2/2mid/21_향림중_2학기_중간_중2_수학.js",
      "reviewedOpenQuestions": 2,
      "decisions": {
        "CONTENT": 2
      },
      "planFiles": 0,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "FIGURE": 7,
    "UNSUPPORTED": 1,
    "CONTENT": 8
  },
  "planFiles": 8
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# original-ak — 19 순천여고 고1 중간
고정 원문782966ff, OPEN2: q10 FIGURE1/plan1, q22 UNSUPPORTED1. 두 기존 해설SVG를 직접 래스터 확인.

q10 세 표본 k=-3,0,3의 공통점(1,7)을 보존하며 최종합8은 숨김. 공식 frame_graph→graph→specFor PASS. 상수직선은 공식 LINE형식으로 작성.
q22 복소수값/누적합의 일반 표. SLOTS는 -i에서 STAT_SLOTS_FIXED_INVALID, TABLE은 STAT_KIND_UNSUPPORTED. DICE_TABLE은 정수면/유리식 계약이라 복소수표를 대체하지 않음. 확률트리나 기하노드로 표를 위장하지 않았음. 일반 수학표가 확장 후보이며 기존표가 소문항답을 직접 노출하므로 새 설계에서는 주기·한주기합0만 보여 주어야 함. gap-validation.json 기록.
새 SVG 렌더 NOT_RUN, publication UNVERIFIED. 원본/엔진/운영장부 변경 없음. 독립 검수 대기.


# Independent review
원문 Q10/Q22와 기존 SVG2 직접 래스터 확인, exact SVG text도 대조했다.

Q10: k−3/0/3에서 y7,3x+4,6x+1이고 모두 P(1,7). 일반 k식에서 x1이면 k계수0이므로 모든 실수 k에 대한 주장도 정확하다. caption은 표본만으로 증명되지 않음을 명시한다. 묻는 a+b=8은 숨기고 좌표는 필요한 중간값으로 유지했다. 독립 frame_graph→graph→specFor 1/1 PASS, 구조 오류·경고0. 기존 그림과 수학은 동일하므로 기존 SVG를 변경해야 한다는 뜻은 아니며 계획 저장만 허용된다.

Q22: (1−i)/(1+i)=−i, 주기4, 주기 합0, 나머지별 H는0,−i,−1−i,−1. 기존표 H행은 소문항2/3의 결과와 같은 −1−i를 직접 표시하므로 새 계획의 답숨김 검토가 필요하다. 원문 부족이나 풀이 불능은 아니다. 현재 일반 복소수 표용 계약 없음: 독립 재현 SLOTS fixed '-i' → STAT_SLOTS_FIXED_INVALID, TABLE → STAT_KIND_UNSUPPORTED. SLOTS는 count가 적어도 하나 필요한 경우의 수 전용이고 DICE_TABLE은 주사위 정수 면·유리식 표라 이 의미를 담지 못한다. 기하 점/확률트리로 수학표를 위장하지 않은 UNSUPPORTED 판단 타당. 기존 SVG는 보존, 새 계획 렌더는 NOT_RUN이다.


---
# original-al — 20 복성고 고1 2학기 중간
Source 782966ff 고정. OPEN q14/q18 두 문항, FIGURE2 / plan2.

- 기존 해설SVG2 + 문제SVG1 모두 직접 래스터 확인.
- q14: 전체 포물선은 보조 그래프이며 실제 정의역 x≤a를 caption으로 구별. a=-3 예시 끝점 A와 꼭짓점 V를 보며 단조성과 최솟값을 읽음. 최대곱 -8은 숨김. 기존 그림의 꼭짓점/끝점 관계를 보존하되 최종답 문구 제거.
- q18: O만 원문 원점 SOURCE_POINT, A는 t=3 도출을 sourceConditions에 명시한 이동점. B는 배율, H/L은 수선발, P/Q는 공식 교점, C는 OL 중점. 기존 두 직각과 수선·선교점·세 점 위 원 관계 모두 보존. 반지름3, 모든 파생점 계산 검증, 최종곱36 숨김.
- 공식 graph frame→graph→specFor 및 construction binding→construction→specFor 각각 PASS. validation.json 및 input/spec 보존. 초기 지원 불가 화살표 필드 제거했고 엔진 변경 없음.
- 새 SVG 렌더 NOT_RUN, newPlanVisualReviewed=false, publication UNVERIFIED. 원본·운영장부·원격 변경 없음. 독립 검수 대기.


# Independent review
원문 Q14/Q18과 기존 문제 SVG1·해설 SVG2를 직접 래스터 열람했다. 독립 공식 graph frame_graph→graph→specFor 및 construction bindings→construction→specFor 2/2 PASS, 구조 오류·경고0.

Q14: (x+2)²+4는 x≤a에서 일대일이려면 a≤−2. b=(a+2)²+4≥4, a<0에서 ab≤4a≤−8 검산. 새 계획은 전체 보조 포물선과 실제 제한 정의역을 caption에서 명시적으로 구분한다. a−3 예시의 끝점 높이5 정확, 꼭짓점(−2,4) 정확. 최댓값−8 또는 달성점의 곱은 caption/축/표시에 없다. 기존 SVG의 최종곱 노출은 새 plan에서 제거.

Q18: 유일 SOURCE_POINT는 원문 원점O. A는 반지름 조건으로 독립 도출한 t3에 따른 이동점, B는−2배, H/L은 수선발, P/Q는 공식 교점으로 생성. 실제 worker exact 모델 A(3,3),B(−6,−6),H(0,3),L(−6,0),P(−6/7,12/7),Q(−6/5,12/5),C(−3,0) 확인. CQ²=(9/5)²+(12/5)²=9, CO²=CL²=9이므로 세 점의 원 반지름3. 직각 AH⊥y축, BL⊥x축 보존. 거리비2와 최종곱36 검산되며 새 caption/도형은36을 표시하지 않는다. 보조중심 C는 기존 해설에 이미 있던 이름이다.

새 SVG 실제 렌더 NOT_RUN. 기존그림 직접검수·수학계산·표시계약 PASS를 신규렌더 PASS로 혼동하지 않는다. 원본/엔진 수정 없음.


---
# original-am
20 효천고 고1 2학기 중간 OPEN q5/q15, FIGURE2 plan2. source782966ff 고정.
- q5 원점과 주어진 직선 사이 최소거리 해석. 수선의 발은 공식 PERPENDICULAR_FOOT, 직각 보존. 보조점T는 이름·점표식 숨김. 최종9 숨김.
- q15 기존 SVG 직접 확인. 두 후보 포물선과 꼭짓점/경계 관계 보존. 전체 보조곡선과 실제 조건구간 x>2(음영,경계 제외)를 구별. f(5)=16 숨김.
- 원문 주의: q15 일대일대응의 공역이 명시되지 않음. 해설처럼 해당 치역으로의 대응으로 해석하여 일대일성 판정. 원본 수정 없음.
- graph frame→solve→spec 및 construction binding→solve→spec 2/2 PASS. 검증 기록과 최종 spec 보존. 새 렌더 NOT_RUN, 게시 UNVERIFIED.

검수 보완 완료: 리드 승인으로 Q5 coordinateLabels:[H] 추가. 공식 최종 spec의 H 좌표 (9/5,12/5) 실제 표시 확인, 독립2/2 PASS. 최종답9와 보조T 숨김 유지.


# 독립검수 original-am

원문 OPEN q5/q15의 발문·보기·해설을 직접 읽고 기존 Q15 SVG를 정확한 git 경로에서 대조한 뒤 흰 배경 래스터로 직접 확인했다(1/1). Q5 자산 참조 없음.

- Q5: 원점과 3x+4y=15 직선의 수선의 발은 H=(9/5,12/5). 3(9/5)+4(12/5)=15, OH의 제곱9, T−H=(4,−3)은 OH와 수직이다. PERPENDICULAR_FOOT 파생과 직각 표식 정확, 최종 최솟값은 숨김. 다만 H 좌표 표시를 주장하는 caption과 달리 coordinateLabels가 빠져 중간값이 보이지 않는다. H만 coordinateLabels에 추가하도록 리드에게 보완 요청했다.
- Q15: 기존 그림의 후보 (1,2)/(2,1), 축5/2와2, x>2 열린 경계가 새 계획에 보존된다. 두 이차식 계수와 꼭짓점 정확. 새 최종 spec에서 x>2 음영 및 주어진 경계2, 두 꼭짓점 좌표 확인. 공역 미명시는 해설처럼 해당 치역으로의 일대일성 해석을 따른다는 원문 주의를 유지하며 근거 없는 CONTENT 판정하지 않음. f(5)의 최종값16은 보이지 않음.
- 독립 공식 검사: graph frame/solve/spec + construction binding/math/inventory/spec 2/2 PASS.
- 새 SVG 렌더·가독성·출판은 NOT_RUN. 기존 SVG 열람과 구별한다.

검수 보완 완료: 리드 승인으로 Q5 coordinateLabels:[H] 추가. 공식 최종 spec의 H 좌표 (9/5,12/5) 실제 표시 확인, 독립2/2 PASS. 최종답9와 보조T 숨김 유지.


---
# original-an
21 강남여고 고1 기말 OPEN q11/q20, FIGURE2 plan3. source782966ff 고정.
- 기존 문제 PNG2 직접 확인. q11 원래 f,g 화살표 전부 대조. 합성 순서별 MAPPING 두 계획으로 역추적 경로만 강조하고 최종합6 숨김.
- q20 원문은 x0..4,y0..2의 15점과P(2,2). 모두 원문 주어진 좌표 SOURCE_POINT이고 임의 파생좌표 없음. P를 지나는 일직선 제외방향4개 강조. 원문에 없는 격자점 이름 숨김, 점표식은 보존. 모든91쌍 정수행렬식 검사로 일직선9쌍/삼각형82 독립확인. 최종82 표시 없음.
- set check→setDiagramSpec 2, construction binding→solve→specFor 1 모두 PASS. validation.json 및 math-validation.json, 최종spec 보존.
- 새 SVG 렌더 NOT_RUN, 시각검수 false, 게시 UNVERIFIED. 원본/엔진/운영장부 변경 없음. 독립 검수 대기.


# 독립검수 original-an

원문 OPEN Q11/Q20의 발문·보기·해설을 직접 읽고 원본 PNG2개를 직접 열었다(2/2). 정확 git 자산 경로의 bytes와 검토 파일이 일치함을 재확인했다.

- Q11: 실제 그림에서 f=(2,3,4,1), g=(2,1,4,3)을 직접 추적했다. 첫 계획 f 다음g에서4→1→2, 둘째 g 다음f에서2→1→2가 맞다. 원래 대응 화살표를 모두 유지하고 역추적 경로만 강조한다. 중간 역함수값을 그림에서 읽을 수 있으나 최종 합6은 별도로 표시하지 않으므로 적절하다.
- Q20: 원본은 x=0…4,y=0…2의 격자15점과P(2,2). 작성자가 SOURCE_POINT로 지정한 모든 점이 실제 주어진 좌표임을 확인했다. 원문 없는 G 이름은 숨기고 점은 유지, P/O는 원본 이름을 보존. P를 지나는 네 제외 방향은 수평·수직·좌하·우하이며 누락 없음.
- 독립 정수행렬식 검산: 14점 중 두 점 선택91개에서 공선9쌍을 제외한다. 수평6·수직1·양대각각1로 해설과 일치. 최종82는 표시하지 않는다.
- 독립 공식 검사: set check/solve/spec2 및 construction binding/math/inventory/spec1, 3/3 PASS.
- 계획 수정 불필요. 새 SVG 실제 렌더·가독성·게시 NOT_RUN 유지. 원본/엔진/운영장부/원격 변경 없음.


---
# original-ao: 연향중2019 중3 중간
- source782966ff, blob f5419f8d35a6f7d257b99bbff0a7f3782ecd3265. 정확운영장부 OPEN2(Q9/22)만판독. CONTENT2/plan0.
- Q9 발문·모든보기·해설직접읽음. √30은5.477225…인데5.447제공. 주어진잘못된값을형식적으로사용해도②는√3만이용하여답판별은가능하다는점을구분했다. '판정불가능'이아닌원문근삿값오류이며시각화할교육적필요도없다. 원문수치수정없이CONTENT로기록.
- Q22 실제연결SVG를직접래스터확인: 정사각형은−2/−1위, P≈−2.414,Q≈−0.586. 각대각선반지름의중심은P가−1,Q가−2라 p=−1−√2,q=−2+√2,3p+q=−5−2√2. 현재해설은중심을반대로놓아최종−7−2√2로충돌. 그림조건이충분하지만어느자산을정정할지새계획으로덮어쓰지않음.
- 신규plan없어spec/render NOT_APPLICABLE. 원문·SVG·운영장부·엔진·원격미변경. 기존운영사유는검색지표로만사용하고현소스에서검증했다.


# 독립 검수
- Q9 발문·5보기·해설 직접 확인. √30=5.477225…이며 5.447은 통상 근삿값이 아니다. 다만 보기②는 √3만 이용해 판단 가능하여 '풀이 불가능'으로 부풀리지 않은 현재 CONTENT 사유가 적절하다. 시각화 필요성이 없어 plan0 유지.
- Q22 연결 SVG를 직접 시각 확인하고 SVG의 실제 호 반지름/끝점도 대조했다. 단위164, −2 위치310, −1 위치474이며 P=242.0689758, Q=541.9310242. 따라서 p=−1−√2, q=−2+√2, 3p+q=−5−2√2이다. 현 해설의 −7−2√2는 연결 그림과 다르다. imageAlt에도 이를 바꾸는 추가 조건은 없다.
- Q22는 그림 자체로 독립 풀이가 가능하나 원문·해설 충돌을 해결해야 하므로 CONTENT 기록이 타당하다. 임의로 해설에 맞는 다른 수직선 그림을 만들어 덮어쓰지 않는다.
- CONTENT2/plan0 승인. 새로운 계획이 없으므로 공식 spec 검사 NOT_APPLICABLE. 자료·판정 원본 변경 없음.


---
# original-ap: 금당중2021 중3 중간
- source782966ff, blob29e8324717f9d94167fdba606124b62dd92e5971. 정확운영장부 OPEN2(Q7/12)만판독. CONTENT2/plan0.
- Q7 원문·보기·해설및PNG직접확인. 반지름1과C/E,y/z일부가보이지만A/B/D와각x의위치가하단/좌측crop으로없다. 답②와해설의'cos y=BC'는그림의누락된이름소유를독립확인해주지못함. 누락라벨을정답에서역으로채우지않았다.
- Q12 PNG의AB8cm,각B30°,A/B/C는읽히지만BC라벨은하단에서글자아래가잘렸다. 6√3으로추정되는상단획만으로완전한길이값을확정하지않음. 본문에는길이값반복없고해설에만BC6√3등장. BC없이는AC값미정(AB/각B만으로삼각형이유일하지않음). 조건부로BC6√3이면해설의AC2√7은맞으나그조건을정답에서역추정해신규그림에추가하지않았다.
- 필요한재료: Q7하단·좌측누락없는원본이미지, Q12 BC길이라벨전체또는신뢰가능한원문길이확인.
- 신규plan없어spec/render NOT_APPLICABLE. 원문·PNG·운영장부·엔진·원격미변경. 그림열람실패나도구제약때문의보류아닌실제crop판독결과.


# 독립 검수
- Q7/Q12 발문·보기·현 해설을 읽고 두 실제 PNG를 직접 확인했다.
- Q7의 좌하단은 실제로 잘렸으며 A/B/D와 x 위치가 보이지 않는다. 반지름1 및 C/E/y/z 일부만으로 다섯 보기의 선분 이름 대응을 확정할 수 없다.
- Q12는 A/B/C, AB8cm, B30도가 보이나 밑변 라벨은 하단에서 잘려 값 전체를 판독할 수 없다. 6√3이 의도된 것으로 추정할 수는 있어도 추정을 출제 조건 확정으로 저장하지 않는다. 알려진 AB와 B각만으로 AC는 유일하지 않다. 예를 들어 BC=4√3이면 AC4, BC=6√3이면 AC2√7이다.
- 추가 근거 점검: provenance의 원본 blob b00a38622d7e811a895e3f7905c53011070fa122도 확인했다. Q7/Q12는 같은 이미지 참조와 발문·보기만 있고 원래 답/해설은 빈 문자열이다. 따라서 현 해설은 잘린 조건의 독립적인 원문 증거로 간주할 수 없다.
- sourceAssetGitBlobs와 실제 PNG 해시 일치: q07 16012dec361612ecae46fd39b868361cc3d39e30, q12 d47289d6dc8d9910a67a79f268eb147f408c891f. 별도 온전한 이미지로 잘못 대체한 것이 아니다.
- CONTENT2/plan0 승인. 원본 전체 이미지 또는 조건 확인 후 계획 가능. 도구 제한에 따른 보류가 아니라 실제 crop 결함이다. 신규 계획 없어 spec NOT_APPLICABLE. 원문/장부 변경 없음.


---
# original-aq
왕운중21 중2 2중간 OPEN2(Q3/5) CONTENT2 유지, 신규plan0. 원문·선택지·해설 및 PNG2 직접 확인. 관련 벡터자산을 고정원본 파일목록에서 검색했으나 Q3/Q5 SVG 없음.
Q3는 도형 자체의 SAS 합동증명은 가능하나 원문에서 평가하라는 번호별 증명문장이 없음. 기존 해설이 구성한 문장을 원문으로 역수입하지 않는다. Q5는 두 직각삼각형 합동의 대응변이12/8을 강제해 tan(CED)=2/3이므로30도와 모순이다. 동일길이·직각·30도 표식을 실제PNG에서 모두 확인했다. 해설 결과 일부가 보기와 맞더라도 조건 충돌을 덮지 않는다.
원문·엔진 변경 없음. 구조 오류·경고0, 새plan없어spec/render대상없음.


# original-aq 독립검수 PASS: CONTENT2 유지
- Q3/Q5 발문·선택지·해설을직접읽고 PNG2개를각각래스터로열람했다.
- Q3 PNG는AB=AC와A각이등분·AD·밑변도형만보여주고 번호가붙은증명문장은없다. AC/AD/ASA/90°/AD⊥BC라는선택지만으로어느증명단계에사용됐는지확정할수없다. SAS증명이가능하다는것과원문의틀린문장소유를확정하는것은별개이므로누락CONTENT타당. 기존해설의가상단계문장을원문으로복구하지않음.
- Q5 30°표시는 E에서 CE와DE 사이의각이다. 원문도명시적으로∠CED30°라다른각을잘못읽은충돌이아님. PNG의 B/D직각,C의∠ACE직각,AC=CE 눈금모두직접확인.
- B=(0,0),A=(0,8),C=(u,0),D=(u+v,0),E=(u+v,12)로두면 u,v>0. AC⊥CE에서uv96, AC=CE에서u²−v²80이므로u12,v8. 따라서tan(CED)=v/12=2/3≠1/√3. 길이·직각·동일길이표식과30°가동시에성립하지않는다. 단순그림비례를재어판정한것이아니라정확조건으로검산했다.
- RHA합동을형식적으로쓰면∠ACB30°/넓이200이라는선지가나오지만, 그중간계산이모순된전체조건의실현가능성을보장하지않는다. 불가능한도형을정확plan인것처럼만들지않은CONTENT결정에동의.
- plan0, 공식spec/render NOT_APPLICABLE. 원문·이미지·계획수정없음.


---
# original-ar
향림중21 중2 2중간 OPEN2(Q14/20) CONTENT2 유지, 신규plan0. 현행 및 과거 필드 참조PNG3개 모두 직접 확인했고 장부에 모두 기록했다.
Q14: 밑각68도는 읽혀 y22, 하지만 밑변 치수는 이미지 아래경계 밖으로 잘려 숫자 없음. x는 축척 자유도 때문에 결정 불가. 해당문항 복구SVG/대체이미지 없음.
Q20: content는 복구PNG, question은 과거crop을 참조한다. 복구PNG의 세 수선이 각각 반대 꼭짓점으로 직선 연장되어 내심의 세 각이등분선과 일치한다. 이는 정삼각형을 강제하므로 다섯보기 모두 참이 된다. 옛 crop은 밑부분이 아예 없어서 복구본의 추가공선조건을 정당화하거나 배제할 원문 근거가 되지 못한다. 원문 조건을 바꾸어 일반삼각형 그림을 생성하지 않는다.
원문·엔진 수정 없음, 구조 오류·경고0, 신규plan없어spec/render비적용.


# original-ar 독립검수 PASS: CONTENT2 유지
- 원문·선택지를읽고 Q14 PNG, Q20복구PNG, Q20과거cropPNG를각각직접래스터열람했다.
- Q14 AB=AC, ∠B68°이므로∠A44°,이등분각y22°은확정된다. 밑변아래치수의호표시만하단에남고실제길이숫자는없다. 유사확대에따라BD=x가변해도모든보이는각/동일길이조건은유지되므로x+y는미정. y를알수있다는것과최종답을정할수있다는것을구분한CONTENT판정타당.
- Q20 복구본은A-I-E, B-I-F, C-I-D가각각끊김없는직선으로연결되고D/E/F의직각표식이있다. 이것을표시된공선조건으로읽으면 내심I는동시에수심이며각꼭짓점의각이등분선이높이이다. 한각의이등분선이높이면그양변이같으므로세변이같은정삼각형이강제된다.
- 정삼각형에서는D/E/F가중점이고①거리동일,②직각동일,③④각이등분,⑤△IDA≡△IDB가모두참이다. 따라서'옳지않은것'을고르는문제와맞지않는다.
- 일반삼각형의내심을의도한문제라면⑤는일반적으로보장되지않지만, 그해석을채택하려면복구그림의직선연결을원문에없는작도오류로정정해야한다. 이를임의로무시하고정확한원도형이확정됐다고하지않는다.
- 과거crop은밑변·B/C/E를잘라내어복구본의세직선연결을증명하거나반박할수없다. 복구된그림이상단원본과유사하다는것만으로누락조건이신뢰가능하게회복됐다고판정하지않는다. 복구전전체원본또는복구근거확인이필요하다.
- 원문·복구PNG·계획수정없음. plan0/spec/render NOT_APPLICABLE.


## 최신 사용자 기준 및 진행 분리
기존 그림 존재만으로 KEEP/EXEMPT하지 않는다. 이번 묶음은 KEEP/EXEMPT 0건이며 기존 SVG 답 노출·가독성 개선을 계획에 반영했다. 이전 KEEP/EXEMPT는 별도 소급 검수 중이고 아직 완료하지 않았다. 유사·교과서 소급 검토와 다음 신규 묶음은 진행 중이며 이 원본 묶음 숫자에 합치지 않는다. 공식 HTTP 미리보기도 시도했으나 동일 프로세스 HTTP200과 달리 다른 실행/CUA에서 연결 거부였다. Chromium socket 오류와 별도 기록하며 신규 전체 렌더 NOT_RUN을 유지한다.
