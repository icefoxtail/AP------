# TASK14 batch12 원본 OPEN 우선

원본3시험지 OPEN58문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 12,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/middle/m3/1final/16_경기은계중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 21,
      "decisions": {
        "EXEMPT": 14,
        "FIGURE": 7
      },
      "planFiles": 7,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1mid/17_대구교동중_1학기_중간_중3_수학.js",
      "reviewedOpenQuestions": 21,
      "decisions": {
        "EXEMPT": 18,
        "CONTENT": 2,
        "FIGURE": 1
      },
      "planFiles": 1,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/20_매산여고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 16,
      "decisions": {
        "EXEMPT": 5,
        "FIGURE": 11
      },
      "planFiles": 13,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "EXEMPT": 37,
    "FIGURE": 19,
    "CONTENT": 2
  },
  "planFiles": 21
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# original-s: 16 경기은계중 중3 1학기 기말

- Source: `archive/exams/original/middle/m3/1final/16_경기은계중_1학기_기말_중3_수학.js`
- Fixed source commit: `782966ffb38c969f1f54fc2f328f046741f5ff4a`. Blob SHA recorded in every ledger row.
- Production OPEN 21개 전부 원문·보기 독립 풀이: FIGURE 7 (7,11,14,15,16,17,21), EXEMPT 14, CONTENT 0. Plan 7개, 결정표 및 그림 장부 각각 21행.
- 기존 참조 이미지 18개 전수 대조 및 직접 열람: 문제 SVG 8개(q10,12,13,14,15,16,17,21), q13 선택지 SVG 5개와 구형 선택지 PNG 5개. SVG는 로컬 PNG 변환본으로 시각 검토했다. 문제·선택지·images 배열 중복은 장부에서 자산별 합집합으로 기록했다.
- 공란 해설을 보류 근거로 삼지 않았다. q13 새 SVG 및 구형 PNG의 양·음의 꼭짓점과 열린 방향이 일치함을 직접 확인했다.
- q14 물리적 시간범위와 보조 다항식의 연장/표시창을 분리했다. q15 실제 직사각형의 시간범위와 퇴화 끝점을 명시했다. q16 근·중점은 중간값으로 보존하고 최솟값은 숨겼다. q17 좌표를 숨기고 선분 AB·BC와 점명만 남겼다.
- 공식 `frame_graph → graph → specFor` 7/7 PASS (`validation.json`). 최종 사양의 표시 문자열도 확인했다. q14 최종 높이·q15 최종 시간·q16 최솟값·q17 목표 좌표·q21 최종 거리는 라벨에 노출하지 않았다.
- 신규 SVG 렌더 NOT_RUN, publication UNVERIFIED. 기존 자료 시각 검토와 신규 렌더를 혼동하지 않는다. 원본/엔진/운영장부/인덱스/원격 수정 없음. 독립 검수 대기.

## 독립검수 추가
- 문제SVG8개 및 선택지SVG5개/legacyPNG5개를 검수자도 직접 시각확인. 새/구형 선택지의 방향과 꼭짓점 부호 일치.
- Q3 근거가 f(0)만 적혀 있어 실제 질문식 전체 f(−1)+3f(0)=−4+6=2로 표현만 보완. 판정/원문/plan 불변. build.py와 _decisions.jsonl, _figure-ledger.jsonl의 해당 근거만 수정.
- 전체7계획 공식 frame_graph→graph→specFor 재검7PASS. 구조 오류0. 수학·최종답숨김 및 물리범위 분리 확인. full render NOT_RUN 유지.


---
# original-t: 2017 대구교동중 중3 1학기 중간

- 원본 `archive/exams/original/middle/m3/1mid/17_대구교동중_1학기_중간_중3_수학.js`
- 고정 source `782966ffb38c969f1f54fc2f328f046741f5ff4a`
- OPEN 21개: FIGURE 1(Q18), EXEMPT 18, CONTENT 2(Q4,Q15).
- 발문/모든 보기 전부 읽고 해설 공란을 독립 풀이로 검토했다. 참조 SVG는 Q11과 Q19 두 개이며 직접 래스터 시각확인. Q11 타일 모양/수량, Q19 밑변 정렬/공유변을 확인했다. 연결되지 않은 옛 PNG는 별도 원문으로 대체하지 않았다.

## 내용 문제
- Q4: sqrt(324-18n)이 정수인 자연수 n은 10,16,18, 합 44. n=18일 때 근호값0도 정수이다. 보기에는44가 없다. 0을 제외하면26이지만 원문에 양의정수 조건이 없으므로 보기④에 맞춰 임의로 제외하지 않았다. 원문/보기 정합성 확인 필요, CONTENT.
- Q15: 곱의 지수열2,4,8,...,20은 반복 차의제곱 인수분해의 배증열2,4,8,16,...과 일치하지 않는다. 생략항과 마지막항이 확정되지 않으므로 보기값에 맞춰 수정하지 않았다. CONTENT.

## 계획
- Q18: 1을 기준으로 양쪽 sqrt(2) 거리의 Q,P를 수직선 위에 표시한다. 이 좌표들은 원문에 주어진 값이며 전체길이2sqrt(2)는 그림/설명에 쓰지 않는다.
- 나머지는 정의, 근호의 대수계산, 인수분해, 약수쌍 열거로 충분하거나 기존 문제그림이 관계를 제공하므로 불필요한 그림을 추가하지 않았다.
- Q19 기존도형으로 C3,B6,A12, 공유변을 제거하면 전체둘레10sqrt(3)+2sqrt(6). 빈해설을 CONTENT 근거로 삼지 않았다.

## 검증
- Q18 expandNumberLineFigure → compositePanels → solveNumberLineFigure → numberLineFigureSpec PASS.
- 구조검사 오류0/경고0, 21행/1plan.
- full render 및 새 PNG 검수 NOT_RUN. 원본 JS/SVG/엔진/운영장부/원격 변경 없음.


---
# 매산여고 2020 고2 수학II OPEN16

- 기준 main 782966ffb38c969f1f54fc2f328f046741f5ff4a, source blob f7ec677f9e47fbc2c7a7634aa54d6ff667edf5b7.
- OPEN5,7,8,9,10,11,12,13,14,16,17,18,20,21,22,23 전수 검토. FIGURE11/EXEMPT5(Q5,11,16,17,21), plan13개(Q18 3개).
- 시험지 전체 그림 참조 대조: 대상 Q8/Q10 PNG 두 개 직접 확인. 비대상 PUBLISHED Q6/Q15/Q19 해설 SVG 세 개도 추출·래스터화·열람했으나 기존 결과/자산/장부를 변경하지 않았다. 그 외 연결 자산 없음.
- Q8 원본은 불연속인 도함수의 상수·직선 세 조각이고 보기까지 PNG에 포함된다. 임의 삼차도함수로 근사하지 않았다. 원본의 정확한 양수·음수 구간만 수직선으로 표시하여 최종 선택지 완성 개형은 숨겼다.
- Q10은 도함수 영점±1 및 절편3을 그대로 복원. k5 예시 수평선으로 세 교점 관계를 보이며 예시임을 caption에 명시.
- Q13 두 곡선의 세 교점과 위아래 바뀜을 정확히 분할. Q18 원문의 세 매개변수 값 각각을 정확히 그렸다. Q20 극댓값 113/5 좌표밴드 숨김, Q22 소문항 함수식은 formula 없이 처리하고 최종 넓이 숨김. Q23은 답인 상수 A를 더한 f가 아닌 원문 h=|x²−1|의 기본 면적만 표시해 소문항 답 A−2/k3 숨김.
- graph_framing.fit_overview12/12 PASS. Q8 expand/solve/numberLineFigureSpec1/1 PASS, 실제 표시 label을 읽어 주어진 경계−1,0,1 및 부호구간만 나옴 확인. 모든 graph plan은 piecewise이며 formula 생략: phase2 자동식 머리말을 만들지 않는 경로 유지.
- 정적분/최댓값/인수분해 검산은 math-validation.json. Q13넓이37/12, Q18최대1·1/4·15, Q20최대113/5, Q22넓이96/5 확인.
- 전체 phase2 및 새 SVG/PNG 렌더·학생 가독성 NOT_RUN, publication UNVERIFIED. 원문 JS·SVG·엔진·운영장부·index·원격 변경 없음.

## 독립 검수 및 보완
- 원문 대상 16문항과 q8/q10 PNG 직접 재확인. frame_graph→graph→specFor 12/12 PASS, Q8 수직선 최종 spec PASS.
- q14 보조 다항식의 전체 실수 정의역과 실제 t≥0 및 표시창[0,3] 분리. q18 중복 끝점 L 좌표 라벨 제거, E0의 동일 중간값 유지.
- 신규 렌더는 여전히 NOT_RUN. INDEPENDENT-REVIEW-similar-a.md와 INDEPENDENT-validation.json 참조.


## 최종독립검수
세시험지 전체검수완료. s Q3풀이근거전체식보완, t두CONTENT조건/보기직접검증, u물리정의역과표시창분리·중복좌표3개라벨제거. graph/numberline최종spec재통과. 실제렌더NOT_RUN/출판UNVERIFIED.
