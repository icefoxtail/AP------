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
