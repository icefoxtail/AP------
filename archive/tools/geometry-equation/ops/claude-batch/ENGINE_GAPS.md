# 엔진 공백 모음 (고1 2학기 기말 SVG, 2026-11-08~)
사용자 결정: 엔진 공백은 모아서 나중에 Sonnet으로 한 번에 설계한다. 라벨 배치 문제는 공백으로 넘기기 전에 지시선(callout·leader)부터 시도한다.

## 진짜 엔진 공백
- 22 복성고 Q12 | 기존 엔진 공백(판정표 OPEN, 세부 사유는 판정표·기존 이력) | OPEN 유지
- 22 금당고 Q20 | composite-panels-v1 출력에 루트 role=img·title·desc 없음 | upgrade-svg-accessibility로 사후 보완

## 지시선으로 재시도(엔진 공백 후보에서 제외)
- 22 금당고 Q18 | 곡선 4개 라벨이 떠서 숨김 → 곡선별 지시선 라벨 재시도
- 22 강남여고 Q20 | equalUnits에서 식 라벨 자리 없음 → callout 식 라벨 재시도
- 23 강남여고 Q18 | 점근선 라벨 TOP_RIGHT 실패 → BOTTOM_LEFT로 해결됨
- 22 금당고 Q21 | asymptoteLabelAt END 실패 → START로 해결됨

## 공백 아님(판단 정정)
- 22 금당고 Q15 | 4/t³ 그래프는 고1 교육과정 밖이고 해설도 그래프를 쓰지 않는다. 원래 의도대로 y=(x+2)/(x−2)를 두 포물선 사이에 그린 그림으로 재작업.

## 확인 필요(교육과정·엔진)
- 21 효천고 Q17 | 4×4 정수 격자 16점과 일직선 점 구조 | 판정표 OPEN, 점 overlay로 가능한지 미확인
- 21 효천고 Q21 | f(x)=x/(1+x²)와 y=1/2 접점(분모 이차) | 고1 교육과정 밖 그래프일 가능성, 해설 방법 확인 후 EXEMPT 또는 대체 그림 결정

## 지시선 텍스트 제약(공백 후보)
- 22 강남여고 Q20 | overlays.callouts 글자에 / 금지·길이 제한(OVERLAY_CALLOUT_TEXT_INVALID), 분수 식은 괄호 대조 실패(OVERLAY_CALLOUT_TEXT_MISMATCH) | 지시선은 y=f(x), 식은 caption
- 22 금당고 Q18 | 라벨·callout에 아래첨자(A_1) 불가 | A1·B1 평문
- 21 복성고 Q10 | coordinates 라벨이 축 눈금 곁 점에서 방향 지정(labelDirection)이 무시됨 | callout "x=1"로 대체
- (공통) callout 글자에 쉼표가 있으면 TEXT 글꼴로 강제, MATH 지정 시 "(3,5)" 거부 | 점의 coordinates:true로 대체
- 21 순천고 Q18 | 반비례 그래프에서 식 라벨 숨김 미지원(HIDE_LABELS_UNSUPPORTED_FOR_INVERSE_PROPORTION), formulaLabel 빼면 k 값 노출 | 곡선 곁 지시선 라벨을 추가해 같은 식이 두 번 보임
- 23 복성 수2 Q22(OPEN 채움): 세 곡선이 위쪽에 몰리고 아래가 비며 라벨이 모호해 게시 제외(x-q22-layout). Q10은 수직선 라벨 간격 엔진 한계(NUMBER_LINE_LABELS_TOO_CLOSE)로 OPEN.
- 정규분포 곡선(stat-chart normal): 가로축 라벨이 항상 x로 고정돼 표준정규 Z 곡선에서도 x로 나옴(축 라벨 옵션 없음). 평균 눈금 0을 -0.5와 함께 넣으면 '-0.50'으로 합쳐짐(19 매산여 확통 Q22).
- 2019 매산 확통 Q14: 표준정규 눈금 -1.65·-1.3 숫자 병기 시 STAT_LABELS_TOO_CLOSE(span 2.5에서도). a~d 글자+z줄 일부로 게시, caption에서 값 명시.
- 23 금당 고1 Q16: composite-panels-v1 MATH_TYPESET_INCOMPLETE(캡처 단계)로 ARCHIVE_BOUND 실패(루나 4회).
- 23 금당 고1 Q20: multi-curve WORKER_TIMEOUT, 축소 범위 재시도도 실패.
- 20 순천여 고1 Q18: 대응도 원소에 '−i'를 못 씀(MAPPING_ELEMENT_TEXT_UNSUPPORTED) → '음'으로 나와 게시 제외.
- 24 효천 고1 Q14: PIECEWISE_DISCONTINUITY_UNDECLARED(u=1/(x-2) 구간 불연속 선언 불가)로 구현 1회 UNSUPPORTED. 루나 검수에서 재시도.

## 해결됨
- (2026-11-09 엔진 확장 a) 축 눈금 라벨의 분수가 빗금 `2/5`로 나오던 것 → `axisTickValues` 분수 문자열이 세로분수로 그려진다. 확률밀도 그래프 납작함 → 기존 `axisScale`(piecewise-polynomial·multi-curve)로 세로 확대, 값은 눈금 라벨로 표시(골든 `item130ext1probdensity`). 가이드 "확률밀도·통계 그래프 세로 확대와 분수 눈금" 단락 참고.
- (2026-11-09 엔진 확장 b) 곡선 이름이 g(x) 고정 → `graphPlan.nameVariable:"y"`(구간별 다항). callout 글자 `/` 금지·길이·쉼표 MATH 거부·아래첨자 불가 → `labelKind:"MATH"`로 20자, `,`·`_`·`/`(세로분수) 허용(`(x+2)/(x-2)` 같은 통째 괄호 분수 포함). 남음: 24 효천 고1 Q14 구간 불연속 선언(유리 조각).
- (2026-11-09 엔진 확장 b) 글꼴 통일: 한글 없는 축 이름·곡선 이름·지시선 글자(좌표쌍 포함)가 수식 글꼴로. 남음: 지시선 속 그리스 문자·`√`, 평면도형 `planeMarks`·대응도·집합·통계 패널의 영어·숫자 라벨(조사표: briefs/engine-font-unify.md), 한글+영문이 섞인 축 이름(x(분))은 한글 글꼴.
- (2026-11-09 엔진 확장 c) 지시선 속 그리스 문자·`√`·`′` 수식화, 대응도·벤다이어그램 이름·원소 수식 글꼴. 남음: 통계 패널의 영어 라벨(관측기 data-text 단정), 24 효천 고1 Q14 구간 불연속(유리 조각).
- (2026-11-09 엔진 확장 d) 24 효천 고1 Q14 구간 불연속 선언: 새 패밀리 없이 multi-curve RATIONAL abs:true로 해결(골든 item134ext4q14abs). 혼합 축 이름 x(분), 통계 패널 영문 이름 수식 글꼴 처리. 남음: 통계 패널의 영문 표·열쇠·변수 칸 라벨은 한글 전용이라 없음; 평면도형 TEXT 명시 라벨은 의도된 한글 글꼴.
- (2026-11-09 엔진 확장 e) 24 효천 고1 Q14 교점 (7/5,2) 지시선 LAYOUT_INVENTORY_INCOMPLETE → 점 지시선이 점근선 파선을 가로질러도 되게 함(골든 item136ext5q14crossing). 20 매산고 확통 Q05 확률밀도(INVALID_AXIS_TICK_VALUE:x) → 엔진 공백 아님: axisScale+문자열 눈금(골든 item137ext5q05density).
- (2026-11-09 엔진 확장 f) 22 금당 수II q18 영역 색칠 ROOT_NOT_CLOSED_FORM → 구간 안 근 수를 정확히 세게 함(골든 item138ext6q18cubicarea). 22 금당 q02(axisVariable)·24 효천 q19(OVERLAY_ID_INVALID:name)·22 팔마 q21(rational 배치)·COORDINATE_LEADER_PANEL_CONFLICT → 엔진 공백 아님, plan 수정(AUTHOR_GUIDE 'EXT-20261109-f' 단락, 골든 item139ext6q21hidelabels). 남음: 효천 q19 역함수 라벨은 plan 시도가 화면 사전검사 시간 초과로 미확인, 효천 h1 조합 도형(Q02~Q23)·순천 Q11 세제곱근 좌표·순천 stat Q04 DENSITY_TRIANGLE 등 새 패밀리 설계가 필요한 것.
- (2026-11-09 엔진 확장 g) 글꼴 통일 2차(캡션 세로분수·`weight:"MATH"`, 수형도 `labelWeight`, 대응도 이름 8자)와 경우의 수 칸 그림 `SLOTS`(효천 고1 Q03·Q04·Q12)를 엔진에 넣었다. 남음: 효천 Q10(문자 n·r 개수 라벨·이중계산 비교), Q02(소인수 지수 선택 곱) 구조, 순천 수II Q11(세제곱근 기울기: 지원 문법 `p+q*sqrt(r)` 밖, 개형 예시 L=5/2는 plan으로 가능), 효천 Q02·Q06·Q16·Q18·Q21은 plan이 통과하지만 이 PC 부하에서 화면 사전검사(60초)가 반복 시간초과라 그림 미확보(부하가 내린 뒤 재렌더). 금당 수II Q08은 `referenceLines[].hideLabel`을 새로 넣고(점 이름 P는 `unnamed:true`로 기존 옵션), 순천 확통 Q04는 plan으로 해결(골든 item148). 선·면 구분 색 프리셋(대상별 색을 plan에서 쉽게 지정)은 요청만 받고 검토 후 다음 회차 후보로 둠.
