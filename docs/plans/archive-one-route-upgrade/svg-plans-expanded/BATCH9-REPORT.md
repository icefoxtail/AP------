# TASK14 batch9 원본 OPEN 우선

원본3시험지 OPEN69문항만 검토. 게시/면제 기존행과 운영장부는 변경하지 않았다. 유사·교과서351시험지 진도와 분모를 합치지 않는다.

{
  "batch": 9,
  "sourceMain": "9fbcf190fd8abaa03f330def331afc7c7c27ba60",
  "sourceComparedMain": "782966ffb38c969f1f54fc2f328f046741f5ff4a",
  "scope": "original OPEN only; separate from 351 expanded exams",
  "exams": [
    {
      "exam": "archive/exams/original/middle/m3/1final/17_경북환호여중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 26,
      "decisions": {
        "EXEMPT": 14,
        "FIGURE": 11,
        "CONTENT": 1
      },
      "planFiles": 12,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/middle/m3/1final/17_경북창포중_1학기_기말_중3_수학.js",
      "reviewedOpenQuestions": 25,
      "decisions": {
        "EXEMPT": 5,
        "FIGURE": 19,
        "CONTENT": 1
      },
      "planFiles": 20,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    },
    {
      "exam": "archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js",
      "reviewedOpenQuestions": 18,
      "decisions": {
        "EXEMPT": 5,
        "FIGURE": 13
      },
      "planFiles": 15,
      "render": "NOT_RUN",
      "publication": "UNVERIFIED"
    }
  ],
  "counts": {
    "EXEMPT": 24,
    "FIGURE": 43,
    "CONTENT": 2
  },
  "planFiles": 47
}

## 검증 한계
공식 부분검사와 수학·독립 검수만 수행. 실제 전체 렌더는 Chromium socket 권한 오류로 실패하여 신규 SVG/PNG 출력0. plan render NOT_RUN, publication UNVERIFIED 유지. 기존이미지가 연결된 문항은 직접 시각 확인. 최종 답을 그림에 적지 않는다.


---
# TASK14: 17 경북환호여중 중3 수학 OPEN26 직접 판정

- 최신782966ffb38c969f1f54fc2f328f046741f5ff4a의 원본·운영장부 사용. 26문항 전부 발문·보기 직접 읽고 독립 풀이 완료. 미판정0.
- 저장 정답·해설이 비어 있다는 이유만으로 CONTENT 처리하지 않음. _decisions.jsonl의 independentReasoning에 각 문항 계산을 기록하고 원본에는 답·해설을 집필하지 않음.
- FIGURE11 / EXEMPT14 / CONTENT1(q8). plan12개(q20 두 미술관 각각1개). 판정표·그림장부26행씩.
- graph_framing7/7 PASS, solveStatChart4/4 PASS, numberline1/1 PASS. 실제 신규 렌더·출판검수 NOT_RUN.
- 기존 그림 q8 PNG, q13·q23 SVG를 PNG로 보기 변환하여 직접 확인. q13 보기5개 모두 확인, q23 꼭짓점(2,−3)·y절편1을 직접 읽음. 없는 그림은 보았다고 표시하지 않음.

## q8 실제 조건 부족 확인
원본 그림은 y=x², y=15, 직사각형 ABCD만 보여준다. 추가 수치, 정사각형, 둘레 또는 최대넓이 조건이 없다. A=(u,u²), B=(u,15), C=(−u,15), D=(−u,u²)로 두면 넓이는2u(15−u²). u=1과2 모두 내접 조건을 만족하고 넓이는28과44로 다르다. 기존 장부 이유를 복사한 것이 아니라 그림과 문장을 직접 확인하여 CONTENT 유지. 조건을 임의로 보충하거나 선택지에서 거꾸로 정하지 않음.

## 특기사항
- q13은 a>0,b<0로 기존 보기②를 판정 가능. 기존 문제 그림이 충분하여 추가SVG EXEMPT.
- q23은 기존 그림의 꼭짓점·y절편으로 y=x²−4x+1을 도출 가능. 추가SVG EXEMPT.
- q19 편차 제곱합30으로 분산6이며 최저학생E. 보기①의 단위 '6점'은 엄밀히 점²이므로 단위 표기 검토 권고. 정답 의도는⑤이나 원문 변경하지 않음.
- q26 계급값을 쓰는 통상 계산으로 A2,B3, 분산21/5. plan은 미상 막대 A,B를 점선 윤곽으로만 표시하고 답값은 숨김.
- q12 전체 비행 종료시간의 근호 정의역은 엔진이 받지 않아, 꼭짓점을 포함하는 출발후0~2초 구간으로 정확히 제한하고 caption에 명시했다. 음수 높이나 비물리적 연장 부분을 그리지 않는다.
- q4 양수계수 예시 1,2와 부호반전 −1로 폭·대칭·변화방향을 비교. 정답 보기조합은 숨김.
- q6 미지 높이, q12·14 최대높이, q22 꼭짓점 정답좌표를 숨김. q20 두 분포의 평균선과 편차만, 최종 표준편차는 숨김.

엔진확장 요구 없음. 원본JS·SVG·운영장부·index·remote 변경 없음. 실제 렌더 후 다중곡선·통계 평균선·미상막대 및 답좌표 숨김의 시각 검수 필요.


---
# 경북창포중 중3 1학기 기말 OPEN25

- 고정 main 9fbcf190fd8abaa03f330def331afc7c7c27ba60, 시험지·운영그림장부를 읽고 OPEN25만 소유.
- FIGURE19문항20plan / EXEMPT5(Q1,3,5,11,21) / CONTENT1(Q16). 모든 문항 해설이 공란이지만 독립 풀이가 가능한24문항은 공란을 보류 사유로 삼지 않았다. 계산 근거를 판정 note에 보존.
- 기존 문제그림11개 직접 시각 확인: q2/6/8/9/10/15/17/23/24/25 SVG를 Inkscape로 검토용 래스터 변환, q16 PNG는 원해상도 재확인. q9 SVG title/desc도 원점을 명시하므로 c=0 확인.
- Q16은 원문 그림에서 두 포물선·꼭짓점·수평선은 확인되나 색칠영역의 경계 및 음영은 확인되지 않음. 넓이조건을 유일하게 결정할 수 없어서 CONTENT 유지. 선택지에서 정답을 거꾸로 추측하거나 임의 영역을 그리지 않음.
- Q7은 평행이동/반사로 꼭짓점을 일치시킨 폭 비교임을 설명. Q9/18/19는 부호/방향 예시임을 명시. Q25 첫 그림은 a=3 예시.
- Q8 B(3/4,3/16),D(9/4,27/16)과 정사각형 변차 검산. Q10 안쪽±1, 바깥±3 검산. Q17 근·절편으로 얻은 사각형 넓이36 재검산. Q23 4u=2v+2,4u(u+v)=96에서 u3,v5 확인.
- 최종 함수식/좌표/극값/면적은 구하는 문항에서 중립곡선 이름 또는 좌표숨김으로 보호. 주어진 값과 중간값은 보존. Q20 처음2초는 표시구간이며 실제 비행 정의역을 새로 정하지 않는다.
- 공식 frame_graph+graph 정확모델+phase2.specFor20/20 PASS. 최초 단일 multi-curve 거절은 가로축 비교를 추가해 해소, Q23 필요한 극점도 보완. 구조검사 오류0.
- 전체 렌더·학생화면·가독성·출판 검증은 기존 브라우저 OS 제한으로 NOT_RUN/UNVERIFIED. 부분검사만 PASS.
- docs 트리의 plan·판정·그림장부만 커밋 후보. 원본/운영장부/엔진/SVG/index/원격 변경 없음.


---
# 효천고 22 고2 수학II OPEN18

- main 782966ffb38c969f1f54fc2f328f046741f5ff4a, 시험지 blob9a3ee917376a15f6a951d272d1f26a3034dd8130.
- OPEN q2,4,8,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24 검토. FIGURE13문항 15plan / EXEMPT5(q2,12,13,16,23).
- Q4/10/18/19/22/24 PNG 직접열람. 해당OPEN에 연결 solution SVG 없음.
- 공식 graph_framing.fit_overview 15/15 PASS. 다항 적분, 사분면 넓이, 경계삼차 중근, 두영역크기, 절댓값 적분 관계를 별도로 SymPy검산.
- Q10은 공식 multi-curve의 Y_OF_X/X_OF_Y로 네 회전 포물선을 실제 식대로 표현. Q14는8조각이므로 piecewise-discontinuous 사용, 끝점7.5를15/2로 정확히 기록.
- Q18은 Q의 경계삼차가 같은 제곱근체에서 완전히 분해되어 공식 polynomial의 정확근호삼차 경로 PASS. 경계a는 중간값, 구하는a²24는 표시안함.
- Q19는 원문g가 이차함수임을 유지. 스캔의 직선같은모양을 새직선으로단정하지 않고 f=x(x−2)²,g=x²인 유효예시를 caption에 명시. S1<S2검산.
- Q21은 u=x/n,세로F/n³ 정규화하여 n3/4/5의 세경우 비교. 예시/정규화는 각caption 명시. 최종합6은표시하지않음.
- phase2 자동식라벨 확인: piecewise는formula생략시없음. Q18 polynomial은보조Q식만 표시하여a²정답누출없음. Q11끝높이4,Q17첫만남2,Q22대칭축3을 requiredPoints·눈금라벨로직접노출하지않도록 숨김.
- 전체렌더/학생화면가독성 NOT_RUN,publication UNVERIFIED. 원본JS/엔진/운영장부/원격 변경없음.


## 최종 독립 검수
세시험지 전부 독립검수 통과. 기존그림 직접확인 및 공식부분검사 재실행 완료. k Q8 문구를 곡선 위 두 꼭짓점으로 교정(곡선1개). k Q16은 실제음영경계 불명확, j Q8은추가조건없음으로 CONTENT유지. 실제전체렌더NOT_RUN/출판UNVERIFIED.
