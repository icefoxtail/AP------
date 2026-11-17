# TASK14 batch11 원본·유사·교과서

서로다른분모의 원본3시험지70OPEN문항과 확장3시험지57문항. 판정표·그림장부·계획만 작성.

{
  "original": {
    "exams": [
      {
        "exam": "archive/exams/original/middle/m3/1final/17_대구오성중_1학기_기말_중3_수학.js",
        "questions": 24,
        "counts": {
          "EXEMPT": 10,
          "FIGURE": 14
        },
        "planFiles": 15
      },
      {
        "exam": "archive/exams/original/middle/m3/1mid/17_이수중_1학기_중간_중3_수학.js",
        "questions": 23,
        "counts": {
          "EXEMPT": 21,
          "CONTENT": 1,
          "FIGURE": 1
        },
        "planFiles": 1
      },
      {
        "exam": "archive/exams/original/middle/m3/1mid/18_연향중_1학기_중간_중3_수학.js",
        "questions": 23,
        "counts": {
          "EXEMPT": 18,
          "FIGURE": 5
        },
        "planFiles": 5
      }
    ],
    "counts": {
      "EXEMPT": 49,
      "FIGURE": 20,
      "CONTENT": 1
    },
    "questions": 70,
    "plans": 21
  },
  "expanded": {
    "counts": {
      "EXEMPT": 40,
      "FIGURE": 16,
      "exams": 3,
      "questions": 57,
      "plans": 17,
      "UNSUPPORTED": 1
    },
    "capabilities": {
      "construction-spike-v1": 7,
      "number-line-figure-v1": 9,
      "solid-figure-v1": 1
    },
    "cumulative": {
      "exams": 351,
      "questions": 9093,
      "byScope": {
        "similar": 122,
        "textbooks": 180,
        "types": 49
      },
      "directlyReviewed": 951,
      "planned": 198,
      "rendered": 0,
      "publishedConfirmed": 0,
      "contentBlocked": 184,
      "exempt": 532,
      "keptExisting": 36,
      "planFiles": 206,
      "unsupported": 1
    }
  }
}

독립검수6시험지 완료. 실제전체렌더NOT_RUN/출판UNVERIFIED. 원본r 필수점표시누락3건최소교정후최종표시검사통과. 교과서a 기존해설SVG4개직접확인·참조장부보완, 원문그림최종답노출대신 새계획답숨김개선. 유사b면숫자그대로보존제약 UNSUPPORTED1건기록. 정본JS·SVG·운영장부·엔진·PR·main불변.


---
# original-o: 2017 대구오성중 중3 1학기 기말

- source: `archive/exams/original/middle/m3/1final/17_대구오성중_1학기_기말_중3_수학.js`
- 고정 원본 커밋: `9fbcf190fd8abaa03f330def331afc7c7c27ba60`
- 기존 OPEN 24개를 직접 읽고 해설 공란을 독립 풀이로 보완: FIGURE 14개(15 plan), EXEMPT 10개. CONTENT/UNSUPPORTED 없음.
- EXEMPT: Q1–8, Q10, Q24. 직접 인수분해·근 계산·차수 판별·10개 자료 정렬로 충분하며 의미 없는 그림은 추가하지 않았다.
- source SVG 11개를 Inkscape로 래스터화하여 직접 확인했다: Q9, Q17 원그림 및 선택지 5개, Q18, Q19, Q22, Q23. 장부는 선택지 이미지도 포함한다.
- Q17 원본은 a>0,b<0,c<0. 새 함수의 정답 모양을 바로 그리지 않고 원본 부호 읽기 예시만 사용. 예시 계수는 원본의 수치가 아니라는 점 명시.
- Q19 원점 통과를 실제 그림에서 확인하여 a=-1/4,p=3,q=9/4를 독립 도출. 최종 합 미표시.
- Q22 수평 거리 `(t-2)^2/2+1`은 항상 양수. 최솟값에서 P(2,-2), Q(3,-2)를 사용하며 최종 곱 미표시.
- Q23 원본 P/Q/R/S의 좌상/좌하/우하/우상 배치를 보존. 보조좌표에서 닮음으로 너비 16-4t, 넓이 16t-4t²를 얻었다. 기하 관계도와 넓이 그래프 두 계획. 최종 둘레 미표시.
- 모든 caption, 접근성 설명, 좌표 및 중립 함수 라벨에서 최종 정답을 숨기고 필요한 중간값은 보존했다. Q11/Q13은 최종 좌표도 숨김.

## 검증
- `validation.json`: 공식 `frame_graph → graph → specFor` 15/15 PASS. 지원 capability는 모두 multi-curve-figure-v1.
- `structure-check.json`: 24행/15파일, 오류 0, 경고 0. 구조검사이지 수학/렌더 검사를 대체하지 않는다.
- 수학 관계는 원문과 독립 풀이 및 좌표 대조로 검증했다. 각 판정 note/sourceConditions에 식과 근거 보존.
- 전체 렌더와 결과 PNG 검수는 NOT_RUN. 앞선 대표 렌더 시 환경 Chromium socket 권한 오류로 막힌 상태와 동일하며, 부분검사 PASS를 렌더 PASS로 쓰지 않았다.
- 원문 JS, SVG, 엔진, 정본 장부 변경 및 push/PR/main 병합 없음. docs 출력만 부모에게 통합 전달.


---
# original-q: 17 이수중 중3 수학
- source 782966ffb38c969f1f54fc2f328f046741f5ff4a. OPEN_SOURCE 23문항 발문·선택지 전부 읽고 직접 풀이.
- FIGURE 1(q15), EXEMPT 21, CONTENT 1(q10). 판정표23행·그림장부23행, 계획1개. 중복/미판정0.
- 빈 정답·해설은 보류 사유로 삼지 않았다. 대부분 제곱근 정의·근호계산·인수분해이고, q9는 부호만으로 순서가 정해져 근사 수직선 불필요. q22는 기존 그림과 둘레의 대수식으로 충분하므로 중복 그림을 추가하지 않음.
- 모든 image/images/solutionImage/content img 참조 확인: q22 문제 SVG 한 개만 연결됨. 해당 SVG를 래스터화하여 실제 확인했다. 저장소에 있는 연결되지 않은 q22.png는 원문 참조로 간주하지 않음.
- q10은 n의 자연수/정수 조건이 누락되어 n=11뿐 아니라 n=11.01도 자연수 x 23개를 갖는다. 정수 조건을 보완해야 답이 유일해지므로 CONTENT. 원본 수정하지 않음.
- q15는 √8과 √128의 정수부분 및 소수부분 거리를 두 수직선에 표시. 최종식4a−3은 표시 라벨·caption에서 숨김. 공식 expandNumberLineFigure 검사 PASS.
- 신규 픽셀 렌더 NOT_RUN, publication UNVERIFIED. 원본JS·운영장부·SVG·index·remote 변경 없음.


---
# 연향중 2018 중3 1학기 중간 OPEN23

- 기준 main 782966ffb38c969f1f54fc2f328f046741f5ff4a, source blob 9f96af5b076a8aa636edaf041af6ca5310e24138.
- 전체 23문항 발문·보기 직접 검토. FIGURE5(Q7·8·11·17·22), EXEMPT18. 정답·해설은 전부 공란이나 이를 이유로 보류하지 않고 발문에서 직접 풀이를 도출했다.
- 전체 image/images/solutionImage 참조를 대조. Q8·11·22의 기존 문제 SVG 3개(중복 image/images 참조 합침)를 최신 main에서 추출·래스터화하여 직접 확인. 해설 SVG 연결은 없다. 문제 SVG 보존.
- Q8 두 단위 정사각형의 대각선 길이를 수직선으로 이동하는 관계, Q11 위쪽 정렬 네 정사각형의 변을 합하는 관계, Q22 오른쪽 띠의 폭과 높이 차를 유지했다. Q8의 p,q좌표는 중간값, 최종 역수차는 숨김. Q11 최종 길이 합과 Q22 최종 넓이 숨김.
- Q7 수직선에서 정수·소수 부분의 의미를 보완한다. Q17 중앙 연못의 넓이를 더하여 바깥 직사각형을 복원하는 관계를 보여 준다. Q17의 수치 배치는 x=2,y=1 예시임을 caption에 명시하고 최종 가로 길이는 표시하지 않는다.
- Q16 200과300 사이 약수 전수 검산에서255,257뿐임 확인. Q22 자연수 x=5,10 중 두 정사각형 변 모두 자연수인 경우 x10뿐이며 중간변6,2 확인. 원본 정답·해설은 채우거나 수정하지 않았다.
- 부분검사: construction.execute+planeMarkSpec+직각 내적 4/4 PASS; numberLine solve+figureLayout 1/1 PASS. 전체 phase2·새 plan 픽셀 렌더 NOT_RUN, publication UNVERIFIED. 기존 그림 직접 열람은 새 plan 렌더 완료와 다르다.
- 원문 JS·기존 SVG·엔진·운영장부·index·원격 변경 없음.

## 독립검수 후 표시계약 보완
q11/q17/q22는 최초 부분검사 이후 specFor에서 표시점 inventory 누락이 발견되었다. 전체 POINT를 inventory에 유지하고 원문에 없는 보조 이름만 hiddenPointNames+hiddenPointStyle NONE으로 숨기는 최소 수정 후 construction→specFor4/4 PASS. 기존 점 좌표·선분·직각·길이 관계는 바꾸지 않았다. q11 원문 P,Q 이름은 유지한다. 세부 내용과 독립검산은 INDEPENDENT-REVIEW-similar-a.md, 최종 결과는 INDEPENDENT-display-validation.json. 신규 렌더는 NOT_RUN 유지.


---
# 비상 공통수학2 도형의 이동 중단원

main 782966ffb38c969f1f54fc2f328f046741f5ff4a 원문·해설을 읽고 작성. 소유 경로 사전 확인 및 리드 승인. 11문항: FIGURE7(Q2·3·6·7·8·9·11), EXEMPT4(Q1·4·5·10). 각 FIGURE는 좌표축 realization 명시. 원문을 통해 정한 점·직선과 파생 연산을 구별했다.

Q8 연결 PNG 직접 확인: 원의 중심O, A(2,0), B(1,√3), A직각, C반대쪽 위치. 원점대칭으로 C를 파생하고 직각 표시, C의 답좌표는 숨김. 연결 자산 재점검에서 Q6·8·9·11의 기존 해설 SVG 4개를 추가 확인했다. 모두 최신 source commit에서 추출·래스터화하여 직접 보았으며 장부 solutionAssets에 반영했다. 나머지 문항은 연결 이미지가 없다. 기존 해설 SVG 4개는 관계가 대체로 타당하지만 Q6 최종 직선식, Q8 최종 C좌표, Q9 최종 k 두 값 및 접선식, Q11 최종 넓이를 직접 노출한다. 해당 4개 plan은 미제작 신규가 아니라 최종 답을 숨기는 해설 그림 개선안이다. 원본 SVG는 수정하지 않았다.

Q2는 중심 이동과 반지름 보존, Q3은 네 대칭 위치 비교, Q6은 두 중심을 지나는 이등분선, Q7은 대칭점에서 가로로 이동한 뒤 공선 조건, Q9는 대칭중심과 한쪽 접선의 반지름 수선 관계, Q11은 반사로 꺾인 경로를 펴고 밑변 수선으로 넓이를 구하는 관계를 담았다. Q9는 가능한 두 접선 중 한쪽임을 caption에 명시. Q11 내부 id E는 원해설 이름 A′로 표시한다. 최종 식·답좌표·넓이는 라벨에 쓰지 않는다.

construction.execute7/7 PASS. Q8·9·11 직각표식 포함. 전체 phase2·픽셀 렌더 NOT_RUN, publication UNVERIFIED. 원문 JS·운영 장부·SVG·index 변경과 원격 push 없음.


---
# 중1 연향중 19 유사 전 문항 SVG 계획

- 시험지 `archive/exams/similar/middle/m1/1mid/19_연향중_1학기_중간_중1_유사.js`, source main `782966ffb38c969f1f54fc2f328f046741f5ff4a`.
- 23문항 전부 발문·보기·해설 직접 읽음. FIGURE 5(q8,9,17,21,22), EXEMPT 17, UNSUPPORTED 1(q11). 장부/결정 각23행, plan5파일.
- 기존 SVG q9 시차수직선, q11 정육면체전개도는 sharp로 PNG화하여 직접 확인. q9의 −8,0,+2,+9 및 q11 가로 −1,2,a,b/위c/아래7 배치가 발문·해설과 일치. 문제그림 KEEP. 기존 plan 참조46개는 모두 읽었으며 44개 EXEMPT, 두 문제그림 construction metadata임을 확인. 렌더된 해설 SVG 연결 없음.
- q8·17 열린 구간의 정수점을 표시하되 개수/합을 쓰지 않음. q9는 카이로를 생략하고 필요한 두 도시·기준도시 및 중간시차17을 표시하며 최종요일·시각은 숨김. 로스앤젤레스는 엘에이로 줄였음을 caption에 명시.
- q21 벽돌의 세 방향18/12/15만 보여 주어 완성 정육면체 한 변이 공통배수인 관계를 설명. 구하는180/1800은 표시하지 않음. q22 두 사람의 중간위치4/16을 표시하고 구하는차12는 숨김.
- q11은 반대면 −1/a,2/b,c/7이 맞음을 직접 확인. 추가 해설에서는 원문 면의 값들을 보존한 대응 강조가 필요. 공식 net faceLabels가 숫자2,7을 면넓이로 해석해 `SOLID_FACE_LABEL_VALUE_MISMATCH:f1`로 거절됨을 재현했다. 동일한 정사각형 면의 서로 다른 수값을 넓이로 왜곡하거나 원문값을 임의 면번호로 바꾸지 않고 UNSUPPORTED로 기록. 원본 문제SVG는 정상 유지.
- 공식 부분검사: number-line 4/4 PASS, solid 1/1 PASS. 독립 정수열거/분수계산 9항 PASS. 23개 ord 중복 없음, 계획5개 연결 확인.
- 새 SVG 렌더 및 학생 화면 검수 NOT_RUN, publication UNVERIFIED. 기존 source JS/SVG/계획/운영장부/원격 변경 없음.


---
# 19 팔마중 중1 유사 전 문항 SVG 계획

- source `archive/exams/similar/middle/m1/1mid/19_팔마중_1학기_중간_중1_유사.js`, main `782966ffb38c969f1f54fc2f328f046741f5ff4a`. source blob은 각 장부행에 기록.
- 23문항 전수 직접 읽음. FIGURE4(q9,15,22,23), EXEMPT19. q23 두 그림으로 plan5개, 결정/장부 각23행.
- 모든 필드의 이미지/SVG 참조 검사: 연결 자산 및 기존 plan 참조 없음. q14는 HTML 표의 세 행과 대각선 위치를 직접 읽어 +3/0/㉠ 관계 확인, 기존 표를 반복하는 그림은 만들지 않음.
- q9 양끝포함 및 비정수 우측끝, q15 두 엄격부등식의 교집합을 수직선으로 표현. 정수점은 보여 주고 총개수는 표시하지 않음.
- q22는 소문항 답인 A13,B−2와 차15를 모두 숨긴 채 두 위치·원점·거리 관계만 표시. q23 첫 그림은−5에서 오른쪽2 이동, 둘째는 원점에서 같은거리1.5인 두 후보. 소문항 답 A−3/B−3/2/최종−9/2는 좌표나 캡션에 표시하지 않음.
- 공식 expandNumberLineFigure + solveNumberLineFigure + numberLineFigureSpec 전체5/5 PASS. 최종 spec의 실제 label 목록을 읽어 q22·23 답값이 노출되지 않음을 확인. 소수1.5 표시는 주어진3/2와 정확히 같고 근사가 아님.
- 독립 정수열거/분수계산9항 PASS, ord23개 유일, plan5개 연결 일치.
- 실제 SVG/PNG 렌더·학생 가독성 NOT_RUN, publication UNVERIFIED. 원본 JS/자산/운영장부/원격 변경 없음.
