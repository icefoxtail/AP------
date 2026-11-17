# TASK14 batch13 유사·교과서·유형

3시험지53문항 직접판정. 기존그림 KEEP6은새그림을만드는것보다유지하는것이낫다는판단이며기존SVG는변경하지않음.

{
  "counts": {
    "KEEP": 6,
    "FIGURE": 22,
    "exams": 3,
    "questions": 53,
    "plans": 25,
    "EXEMPT": 24,
    "CONTENT": 1
  },
  "capabilities": {
    "construction-spike-v1": 9,
    "number-line-figure-v1": 4,
    "piecewise-polynomial-spike-v1": 12
  },
  "cumulative": {
    "exams": 351,
    "questions": 9093,
    "byScope": {
      "similar": 122,
      "textbooks": 180,
      "types": 49
    },
    "directlyReviewed": 1004,
    "planned": 220,
    "rendered": 0,
    "publishedConfirmed": 0,
    "contentBlocked": 185,
    "exempt": 556,
    "keptExisting": 42,
    "planFiles": 231,
    "unsupported": 1
  }
}

실제전체렌더NOT_RUN/출판UNVERIFIED. 저장전원문자산오인정정: 교과서해설SVG12개모두실제존재함을정확경로git객체조회및직접열람으로확인, missingAssets[]로바로잡음. 기존그림유지6건,최종답노출개선6건계획9개만남기고중복5계획제거. Q1두소문항기존그림유지. 원문·SVG·운영장부·엔진·PR·main변경없음.


---
# 비상 공통수학2 원의 방정식 중단원 학습점검

- 12문항 전체 발문·선택지·해설 직접 판독. 최종 FIGURE 6(Q3,4,7,8,10,11) / KEEP 6(Q1,2,5,6,9,12), 교체 계획 9개. Q3은 별도 3개, Q4는 별도 2개.
- 고정 main782966ff, 본문 blob58dedbd2e71497ad3b409ac5e0a7ab3bb4c54baf. 읽기전용 최신main b8eadbb7과 본문 동일.
- 자산 조사 교정: 최초 git ls-tree 출력의 한글 escape를 문자 검색하면서 12개를 잘못 누락 판단했다. 정확 경로 git cat-file/git show로 고정·최신 main의 연결 해설SVG12개 모두 존재함을 확인했다. 전부 추출해 Inkscape PNG로 직접 열람했다. 12장부행의 missingAssets=[]/existingVisualReviewed=true로 교정했고 input/asset-check.json에 정확 blob 증거를 보존했다. 문제그림 참조는 없다.
- 기존 대비 개별 판단: Q1 두 소문항 모두 기존 그림 유지(새 (2)만으로 슬롯 전체를 교체하지 않음). Q2/5/6/9/12도 기존 도식이 핵심 관계를 충분히 보여 신규 중복 계획을 제외했다. 기존 슬롯/파일은 변경하지 않는다.
- 교체 필요 근거: Q3 교점 없음 등 선택판정 문구, Q4 최종 접선식, Q7 k를 드러내는 직선식, Q8 최종 범위 양 끝값, Q10 최종 기울기곱, Q11 최종 접선식이 기존 그림에 직접 표시된다. 새 계획은 이 답 표시를 숨기되 결정적 관계를 보존한다.
- Q7 OA5/AH4/OH3 길이 라벨과 AH/HB 같은틱, Q11 AH/HB 같은틱 및 수선·접점 직각 보완. Q10 접점은 지름AC인 보조원과 원의 교점으로 파생. Q4(1) 두 평행 접선 중 한쪽, Q8 a=0 사례임을 명시.
- 공식 typed-condition binding + construction + displayGeometryInventory + phase2.specFor 최종9/9 PASS. 중복 제외 전14개도 통과했으나 최종 통합은9개만. 제외 초안은 superseded-drafts에 별도 보존.
- 전체 새 SVG 렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원본 JS/SVG/엔진/index/원격 수정 없음. 독립 최종검수 대기.


---
# 17 금당중 중1 유사 전 문항 SVG 계획

- source `archive/exams/similar/middle/m1/1mid/17_금당중_1학기_중간_중1_유사.js`, main `782966ffb38c969f1f54fc2f328f046741f5ff4a`. source blob은 문항별 장부에 기록.
- 25문항 전체 발문·보기·해설 직접 읽음. FIGURE4(q5,6,13,14), EXEMPT21. 계획4개와 결정/장부 각각25행.
- 전체 필드 검사 결과 이미지/SVG 연결 및 plan 참조 없음. 누락된 그림을 가리키는 발문 없음. q6·13 수직선 관계는 문장 조건으로 완전히 주어짐.
- q5 분수 경계와 서로 다른 끝점 포함 여부, 범위 내 정수점을 표시하되 총개수 숨김.
- q6 원점에 대한 대칭과 전체 간격16을 나타내며 양쪽 반거리 r, 구하는 a의 좌표8은 숨김. B의−8도 숫자로 쓰지 않음.
- q13은 a=1,b=−2 예시라고 캡션에 명시. B/M/O/A 순서와 M=−a, 원점으로부터 같은거리a를 표시하고 보기의 부호조합은 쓰지 않음.
- q14 모든 보기값은 원문에 주어진 그대로 표시해 원점으로부터의 거리를 비교한다. 특정 후보에 색·굵기 강조를 하지 않으며 정답 번호나 최댓값 문장을 추가하지 않음.
- 공식 expand/solveNumberLineFigure 및 최종 numberLineFigureSpec 4/4 PASS. 최종 spec의 실제 label 목록에서 q6 a=8 노출 없음, q13 최종 선택 조합 없음 확인. 독립 분수계산·정수열거10항 PASS. 25개 ord 유일, 계획4개 연결 일치.
- 새 SVG 렌더 및 학생 화면 가독성 NOT_RUN, publication UNVERIFIED. 원본JS/자산/운영장부/원격 변경 없음.


---
# 이차함수 중3 활용문해력 유형 16문항

- source main 782966ffb38c969f1f54fc2f328f046741f5ff4a, blob3654d957ac60e99d690dc5f865b683ac828142de. batch11 index의 UNASSESSED 시험지를 소유 후 전수 직접 읽음.
- FIGURE12 / EXEMPT3(Q2·8·12) / CONTENT1(Q6), plan12. 모든 필드에서 그림·기존 plan 참조 없음. 기존 이미지를 보았다고 기록하지 않음.
- Q6 본문은 겹침이 사각형이라고 하나 해설은 t²/2 삼각형을 전제하며 초기 방향도 확정되지 않는다. 원문 배치 확정 전 임의 그림 생성 금지, CONTENT로 별도 기록. 원문·해설 수정 없음.
- Q4·15는 원해설의 폭 없는 수직높이 모델을 유지한다. 실제 물체 폭은 주어지지 않았고 엄격한 비접촉이면 경계를 제외한다는 해석주의를 기록했으며 한계거리 답을 그림에 직접 쓰지 않는다.
- Q1 수입을 만 원 단위, Q10 거리 제곱을100으로 나눈 단위, Q16 넓이를100제곱미터 단위로 정확하게 환산했다. 원문의 단위와 다른 표시를 caption에 명시했으며 근삿값 대체가 아니다.
- graph_framing.fit_overview12/12 PASS. 표시는 모두 piecewise, formula생략, 목표수평선 labelIntersections=false로 교점의 답좌표를 숨겼다. Q10 최종시각인 꼭짓점 좌표밴드도 숨김. 빈 x/y눈금으로 자동눈금에 답을 노출하지 않음.
- 공식 phase2.mjs의 교점표시 계약 확인: 1291~1292행에서 labelIntersections=true일 때만 좌표라벨 생성. formula생략 piecewise 경로는 자동 함수식 머리말을 붙이지 않는다. 새 그래프 전체 렌더·최종픽셀/가독성 검사는 NOT_RUN이며 부분계약 검사와 구별한다.
- Q14 조건허용 시작시점0 외에 양의시간해 없음, 해설 범위0≤t<8 유지. Q16 길이조건0<x<15 외의 근37은 표시하지 않음.
- publication UNVERIFIED. 원본JS·엔진·운영장부·index·원격 변경 없음.

- 독립검수 피드백: Q4/Q15 학생 caption에도 폭 무시 모델 및 비접촉 경계 제외 조건을 명시했다.
