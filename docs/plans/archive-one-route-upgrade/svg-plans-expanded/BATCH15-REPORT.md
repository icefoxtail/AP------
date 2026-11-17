# TASK14 batch15 유사·유형

3시험지58문항, FIGURE19 EXEMPT39,27계획. 세시험지독립검수완료,공식최종부분검사통과.

{
  "counts": {
    "FIGURE": 19,
    "EXEMPT": 39,
    "exams": 3,
    "questions": 58,
    "plans": 27
  },
  "capabilities": {
    "number-line-figure-v1": 3,
    "stat-chart-figure-v1": 8,
    "piecewise-polynomial-spike-v1": 6,
    "construction-spike-v1": 4,
    "trigonometric-spike-v1": 6
  },
  "cumulative": {
    "exams": 351,
    "questions": 9093,
    "byScope": {
      "similar": 122,
      "textbooks": 180,
      "types": 49
    },
    "directlyReviewed": 1062,
    "planned": 239,
    "rendered": 0,
    "publishedConfirmed": 0,
    "contentBlocked": 185,
    "exempt": 595,
    "keptExisting": 42,
    "planFiles": 258,
    "unsupported": 1
  }
}

## 확인한계
광양제철고Q13 원문HTML의5+5+4격자는구조·독립열거로확인했으나원본HTML시각렌더는환경실패로NOT_RUN. WeasyPrint등기존대체렌더도없음. 원본이미지를봤다고주장하지않음. 모든신규SVG전체렌더/출판은NOT_RUN/UNVERIFIED.
고2삼각Q10누락대칭선보완후실제spec점선확인. 중2유형파일은파일명과실제단항식제목차이를기록하고25문항모두그림불필요판정,원문이름변경안함.


---
# 광양제철고 2026 고1 1학기 기말 유사 19문항
- batch13 index UNASSESSED에서 소유. 고정 main782966ff, source blob dc15a48f7e0dfa57a9bfda00943d66e1c002fe47.
- 19문항 직접 풀이 판독. FIGURE11 / EXEMPT8, plan18: 수직선3, 통계SLOTS8, 그래프4, construction3.
- 이미지 파일 참조0. 기존 problem/solutionPlanRef38개 모두 정확 git 경로로 읽었고 전부 EXEMPT 메타였다. 이를 무조건 유지하지 않고 학생에게 도움이 되는 구간·분포·배치·도형은 다시 FIGURE로 판정했다. 기존 파일은 수정하지 않았다.
- Q13은 이미지 파일이 아니라 본문 HTML CSS grid 5열3행의 span14개. 소스에서 5+5+4 배열을 직접 확인했다. Chromium을 실행해 실제 HTML을 보려 했으나 환경 ptrace/프로세스 권한 오류로 종료되어 시각렌더 NOT_RUN. 본문 구조가 명확하여 정확 단위격자로 계획을 작성했고 원문 HTML은 유지한다. 직접 본 PNG가 있다고 기록하지 않았다.
- Q4 같은 간격 d 대표배치로 평균 조건을 설명. Q5 백의 자리 홀짝에 따른 선택 순서 백→일→십을 명시. Q7 마지막 텐트에 적어도 한 명인 엄격한 하한을 반영.
- Q8 판별식 D/4의 그래프 가로축을 계수a라고 명시. Q12 a=±1,b=2 예시임을 캡션에 표시하고 원점 양측 I·III사분면 관계를 보존. 프레이밍이 꼭짓점만 확대하지 않도록 원래 관찰 구간 끝을 숨긴 필수점으로 보존했다.
- Q13 전체직사각75/정사각23 독립 열거와 일치. 원문 격자 형상을 정확 좌표로 보존한다. 보조점은 단위격자 원점에서 평행이동하여 유도했다.
- Q14 변경 전7×11과 변경 후3×15를 별도 계획으로 작성. 대각선√170, 변 길이 중간값, 직각을 유지하고 최종넓이45는 숨김. 변경 후 A/B/C/D가 원문 프라임 점임을 캡션에서 명시. 두 그림은 별개 자동 프레이밍이므로 실제 조판 크기 검수는 후속 렌더 단계에서 필요하다.
- Q15 남3여2남2 / 남2여2남3 두 모양, Q16 a1=1,2,3,4 네 경우 각각의 독립 선택을 보존한다. 총합 답을 도식에서 숨겼다.
- Q18 절댓값 차함수의 세 조각5,1−6x,−2x−7 및 분기−2/3,2를 정확히 연결. 최종 해 경계1/6은 라벨·caption에 없음.
- 공식 최종spec18/18 PASS: 수직선 expand→solve→spec3, 통계 허용키→solve→spec8, 그래프 frame→graph→spec4, 작도 binding→construction→inventory→spec3. 검사 기록 validation.json. 수학/표시 검사 math-validation.json.
- 새 SVG 전체 렌더·가독성·출판 NOT_RUN/UNVERIFIED. 원문/자산/엔진/index/원격 변경 없음. 독립검수 대기.


---
# expanded-batch14-b: 비상 대수 삼각함수 중단원 유형확인
- 782966ff 기준, 유형문제지14문항 전수. FIGURE8 / EXEMPT6 / plan9(삼각함수6, 구간다항2, 작도1).
- 전체 필드·HTML 자산 참조 검사0. 원문과 해설 직접 읽음. 문제·해설 그림 누락을 가정하지 않았음.
- q2 둘레에서 넓이 이차함수, q4 사분면과 삼각비 직각삼각형, q6 두 함수의 주기/폭 비교, q9 최고·최저·주기 복원, q10 두 근 대칭, q11 치환 후 제한 구간 감소, q12 교점 삼각형, q13 탄젠트 세 조각 교점 조건.
- q4 반지름13, 세로성분−12의 비례 정규화. O(0,0)은 좌표가 원문에 주어졌다는 뜻이 아닌 배치 자유도 고정임을 sourceConditions에 명시. P는 원과 수평선 교점 branch, F는 수선발로 공식 연산 생성. 원시 파생 좌표 없음.
- q6 ALL_REALS+displayWindowPi를 사용하여 자동 주기와 극값 라벨 제거. 중간 눈금만 주며 구하는 주기·최대·최솟값 자체를 쓰지 않음. 단순히 그림을 없애지 않고 원함수의 곡선과 이동 관계를 보존.
- q10 끝값1은 원문 구간의 주어진 경계로 유지하며 근의 합1이라고 표시하지 않는다. 교점 좌표 숫자는 미표시. 주기 T=1 자동라벨도 없음.
- q12 A/B의 유리수 좌표와 AB=8/3은 계산에 필요한 중간값. 넓이2는 미표시.
- q13 원래 기울기 -4/pi는 OVERLAY_VALUE_INVALID:l 재현. 엔진 변경이나 근사값 없이 t=x/π로 정확 재매개화, tan(2πt)와 -4t+2의 내부 예시를 사용. 정규화와 k=2 예시를 학생 caption에 명시. 마지막 범위 0≤k≤4는 미표시. 끝점에서 교점이 생기는 경계는 해설로 비교, 예시 하나가 전체 조건을 증명한다고 하지 않음.
- q2 단순부채꼴 θ≤2π의 제약을 추가해도 r=4 최대점은 허용된다. 표시곡선은 둘레식 대수 모델임을 caption에 구분.
- 공식 binding→frame_graph/graph 또는construction→specFor 부분검사9 PASS. q6 자동 라벨, q12 좌표/선분, q13 점근선/선 식을 최종 spec에서 확인. 전체 브라우저 조판·최종 SVG 관측 NOT_RUN, publication UNVERIFIED.
- 원문·엔진·index·원격 변경 없음. build.py는 초기 초안으로 재실행 금지(최종 plan의 정규화·caption·눈금 보완을 덮어씀).
- 독립검수 보완: q10 x=1/2 수직 대칭 점선을 실제 overlays.lines에 추가하고, 최종 spec에서 선과 x=1/2 라벨 모두 확인. 최종 근의 합은 미표시. 재검9 PASS.


---
# expanded-batch14-c: 중2 단항식 계산 25문항
- 파일: archive/exams/types/middle/m2/수와식_중2_유리수와순환소수_유형1.js
- 원본 ref 782966ff. 내부 examTitle은 `단항식의계산_중2_유형1`. 실제 본문25문항도 단항식·지수법칙이며 파일명과 불일치. 이름·원문을 바꾸거나 다른 순환소수 시험지로 오판하지 않았다.
- 전수 직접 판독: FIGURE0 / EXEMPT25 / plan0. 분류 이유를 문항별로 별도 작성했으며 일괄 이유 복사 아님.
- 이미지·solutionImage·images·HTML src·기타 전필드 이미지 경로 참조0. q23의 HTML 단위표는 존재하며 KB=2^10 B, MB=2^20 B, GB=2^30 B를 직접 확인하여 보존.
- 지수법칙, 계수/문자 지수 비교, 십진 자리값, 반복횟수, 단위환산은 계산과 원래 표로 충분하다. q21 박테리아는 정수 시간마다의 두배 갱신으로, 임의 연속 곡선을 넣지 않았다. q22의 실제 접기 모양을 가정하지 않았다.
- 객관식 보기까지 직접 읽고 원해설 값 대조. q6·9·12의 각 보기 부호·분모·0제곱 검산. q18~20의 자리수9/9/6 및 q23 용량나눗셈2^8 확인.
- plan0이므로 파생점·최종표시spec 검사 NOT_APPLICABLE. 렌더 PASS를 주장하지 않음. 원문·엔진·index·운영 장부·원격 변경 없음.
