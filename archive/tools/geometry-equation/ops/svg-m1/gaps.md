# 엔진 공백 기록 (중1 캠페인)
- E1 평면도형 이름 없는 점 → 작업 중(엔진 E1).
- 입체(solid-figure-v1): 원문에 꼭짓점 이름이 없을 때 이름을 강제(A–H) — 이름 숨김 필요. (24_매산중 q2)
- 입체: 꼭짓점·모서리에 번호 라벨 불가. (24_매산중 q2)
- 전개도(net): 특정 모서리(BC) 강조·특정 면(JEDK, NMLK) 색칠 불가; 접은 정육면체에 한 꼭짓점 두 이름(J/L) 불가. (24_매산중 q15)
- 평면: 선분 길이 괄호(MN=½AC 같은 치수 괄호) 기능 없음 → 치수선으로 대체됨. (24_매산중 q3)
## 구현 대기열 (엔진 확장으로 해결할 것)
- E1 평면 이름 없는 점·점 표식 생략 — 작업 중.
- E2 전개도 모서리 강조·면 칠 (24_매산중 q15) — 작업 중.
- E3 입체 꼭짓점·모서리 세기 번호 (24_매산중 q2) — 작업 중.
- E4 정육면체(직육면체)를 평면으로 잘라 낸 입체(모서리 중점을 지나는 절단, 꼭짓점 자르기)와 그 모서리 강조 (26_신흥중 q8) — E2/E3 다음(같은 파일).
- E5 합성 그림에 입체·전개도 패널 허용 + 평면 패널과 섞기: 25_풍덕중 q1(사각뿔+오각형), q7(모서리 관계 3그룹을 패널로 나눔), q8(전개도+접은 직육면체).
- E6 입체: 한 꼭짓점 여러 이름 라벨(M=A=I), 전개도 면 대각선(NL) 강조, solid/stat plan의 sourceQuote 허용(가이드 §7과 불일치) (25_풍덕중 q8, q1).
- E7 평면: 여러 선분으로 된 경로의 총길이 라벨(경로 합 표기, 예: 193+112=305) (25_풍덕중 q4).
- E8 평면: 선분·반직선 옆 한글 평문 라벨(expressionLabels에 labelKind TEXT, 예: "반직선 AB") (26_팔마중 q2).
- E9 반비례 y=k/x(유리함수 분자 상수) + 오버레이 다각형 라벨 (26_왕운중 q7·q8) — 작업 중.
- E10 평면: 특정 변 강조(굵게/색), 한 변과 양 끝각 묶음 강조 (26_왕운중 q5).
- E8 확장 범위: 작도 흔적·호·선분 라벨에 한글 평문(㉠~㉥, "반직선 AB")과 단위(cm) 접미 — labelKind TEXT, unit 필드 (26_신흥중 q4·q6·q7, 26_팔마중 q2·q3, 26_왕운중 q3). E10(변 강조)과 한 작업자로, E1 병합 후.
- E11 평면: 원 바깥 호 길이 라벨(10cm·16cm)이 여백 부족으로 LAYOUT_INVENTORY_INCOMPLETE — 호 라벨용 캔버스 여백 자동 확보 (26_신흥중 q15).
- E12 평면: 20°대 좁은 각의 값 라벨 자리(지시선으로 바깥 배치) (26_팔마중 q12).
- E13 그래프: 격자점 여러 개(16개 이상) 표시와 열별 개수 라벨 — overlays 점 8개 한도 (26_왕운중 q14).
- E12 확대: 큰 호 각 라벨·꼭짓점 외각 라벨 자리(26_팔마중 q19 oe-label, q20 a3Y-label LAYOUT_INVENTORY_INCOMPLETE).
- E15 합성: 물 채우기 그릇(입체/단면) 패널 + 물 높이 그래프 패널 대응 (25_연향중 q4, 23_금당중 q5) — E5(입체 패널) 이후 그래프 패널 혼합.
- E16 평면: 한 글자 각 이름 라벨(∠A, ∠B) — 지금 두 글자 이상만 (26_왕운중 q1).
- E17 평면: 비정수 좌표 점 사이 빗변 길이를 그대로 scalarLabels로 표시(지금은 정수 보조점 우회 필요) (26_왕운중 q3·q5).
- E12 우선순위 상향(빈도 6건): 좁은 각 라벨 바깥 지시선 배치·큰 호 라벨·합성 패널 안 좁은 각 (26_팔마중 q12·q19·q20, 25_풍덕중 q11·q13, 26_신흥중 q19). E8/E10/E11 병합 직후 착수.
- E17 확대: 닫힌 꼴이 아닌 교점에서 나온 SEGMENT_LENGTH 라벨 UNSUPPORTED_SCALAR_NOTATION (25_풍덕중 q13).
- E18 평면: 동위각·엇각 쌍을 색으로 구분하는 각 강조(angles[].emphasis 색 그룹) (25_왕운중 q3); 한 꼭짓점 각 4개 라벨 배치 → E12 (25_왕운중 q1).
- 재검수 대기: 26_신흥중 q13(runs/26_신흥중-plane2/q13, 보정 완료). E12 테스트 문항에 26_신흥중 q19 추가.
- E19 좌표 작도(SOURCE_COORDINATE_AXES): hiddenPointStyle NONE·SOURCE_POINT 이름 숨김을 좌표 그림에도(수선의 발 점 표식 없애기), 이름 없는 점의 좌표 라벨 (25_왕의중 q3·q4).
- E20 좌표 눈금 라벨 충돌(x=-1 라벨과 y=1 라벨) 자동 회피 (25_왕의중 q1 LAYOUT_INVENTORY_INCOMPLETE tick-y-1-label).
- E8 범위 추가: 좌표 그림 직선 번호 라벨 ①②③ (25_왕의중 q6).
- E10 범위 추가: 반직선과 선분 구분 표시(25_왕운중 q15), 선분 강조(25_왕운중 q14 AO). E19: 좌표 그림 라벨 B(4,-2) 자리 COORDINATE_PANEL_TOO_TALL (25_왕운중 q20, y=24/x는 이제 E9로 가능 → 재작업).
- E21 수직선(작업 중): 한글 자모 점 이름·이름 없는 점·값 숨김·점 8개·구간 등분 눈금·축 변수 끄기 (25_동산중 q12·q14). 문자 점 -a·a(q13)는 X9 범위라 보류.
- E18 확대: 한 각이 두 같음 모둠(동위각·맞꼭지각)에 속하는 표시, 쌍별 색 (25_왕의중 q15). E8: trace 라벨 ㉠~㉤ (25_왕의중 q17).
- E19/E8: 좌표 그림의 이름 없는 점 좌표·한글 라벨, 사분면 이름 라벨(제2사분면), requiredPoint에서 축까지 점선 (25_연향중 q1·q6·q8).
- E22 그래프: 표시 창 수동 지정/작은 도형 확대(정사각형 ABCD가 너무 작음) (25_왕운중 q22); 기울기 큰 직선 식 라벨 자리 (25_왕운중 q20).
- E23 평면: 텍스트 라벨이 하나도 없는 평면 패널(오각형) 게시 거절 PUBLICATION_TEXT_NOT_READY — 합성 패널 캡션으로 대체 허용 필요 (25_풍덕중 q1).
- E21b 수직선 양수 + 부호 표기 옵션(plusSign: +1, +3/2) (25_동산중 q12 원문 표기).
- E12b: 합성 패널 안 작은 삼각형의 각 라벨 자리(25_연향중 q19 COMPOSITE_PANEL_NOT_COMPOSED aB/aC-label), 두 작은 각에 걸친 70° 라벨(25_연향중 q16).
- E26 통계: 도수분포다각형 점 강조(highlightPoints)·값 라벨 충돌 회피, 계급 묶음별 서로 다른 강조와 묶음 합 라벨(13명·5명), 두 집단 다각형의 점 강조·값 라벨 (25_풍덕중 기말 q17·q18·q19).
- E27 입체: 구·반구·구의 일부(1/4, 1/8, 7/8 조각)와 그 단면(원판) 표시 — 25_팔마중 기말 q9·q22, 25_왕의중 기말 q11, 25_왕운중 기말 q12.
- E25 합성: 패널 5개 이상일 때 2열 격자 배치(높이 상한 640 대응) — 한 직선 위 반직선·선분 열거 (25_연향중 q22 COMPOSITE_TOO_TALL, 25_왕운중 q15).
- E28 입체: 이름 없는 입체의 면 칠(highlights.faces, 옆면 각각 구분 칠), 합성 패널 안 각뿔 모서리 번호 SOLID_COUNT_LABEL_FAR, 원뿔대 몸체 칠 (25_풍덕중 기말 q2·q3·q8).
- E29 입체: 정다면체(정사면체·정팔면체·정십이면체·정이십면체), 쌍뿔(오각쌍뿔), 입체 안의 입체(원기둥 안 구 2개), 원기둥 속 수면, 축을 지나지 않는 단면(원기둥 축 평행 단면 직사각형, 구의 중심 밖 단면 작은 원) (25_신흥중 기말 q7·q8·q12·q13·q20).
- E21c 수직선: 해집합 밖 정수(제외되는 5) 표시 필드 (25_풍덕중 기말 q13).
- E8b 평면: trace(작도 흔적) 라벨 위치 지정(호의 어느 끝/중간에 둘지 anchor) — 문제 그림의 ㉠~㉣ 위치를 따라야 함 (25_왕의중 중간 q17).
- E28 확대: 세기 번호 붙은(이름 없는) 꼭짓점을 segments에서 번호로 지정, 반원기둥 입체·전개도, 원뿔대 전개도(고리 부채꼴) (25_팔마중 기말 q1·q6·q21).
- E26 확대: 도수 미상 계급(frequencies null)과 두 계급 합 괄호, 복원한 막대 점선 표시, 두 다각형의 계급·점 강조와 합계 괄호 (25_팔마중 기말 q16·q17·q19·q24).
- E30 평면: 호 점선 스타일(arcs dashed), 호 위 같은 호 눈금 표식(arcs equalGroup), 한 꼭짓점 바깥 큰 호(ring 2)와 안쪽 라벨 공존 → E12 (25_왕의중 기말 q1·q4·q8).
- E28b 입체: 이름 없는 꼭짓점에 인덱스로 면 칠·선분·치수 지정 (25_왕의중 기말 q14). E14b 줄기와 잎: 누적 개수 열 (25_왕의중 기말 q17).
- E31 통계: 점도표(dot plot)·수직선 위 자료 점 표시 (25_신흥중 기말 q22). E26 확대: 줄기와 잎 marks 4개 상한·순번 라벨, 막대 하나 값 숨김, 강조 색 두 묶음, 계급 합 괄호 (25_신흥중 기말 q14~q18).
- 엔진 버그: 줄기와 잎 범례 조사 고정 "은"(0|5은, 1|4은) → E26에서 수정 중. 게시된 25_팔마중 기말 q14, 25_풍덕중 기말 q14 재렌더·교체 필요.
- E23 확대: 글자 없는 합성 패널 PUBLICATION_TEXT_NOT_READY, 바깥 변 라벨용 여백 자동 확보(보이지 않는 패드 점 없이), 한 점에 사분원 호 8개가 모인 영역 라벨 (25_연향중 기말 q8).
- 25_왕운중 기말 q23: 두 직육면체 그릇 옆 단면(밑면 12×18·9×12, 물높이 3·x) 합성 패널 높이·3cm 치수선 MARK_SEGMENT_TOO_SHORT → E15 container-fill에 직육면체 단면/비교 패널 또는 E25 격자 배치로.
- E30 확대: 호 라벨 TEXT(° 자동 접미 없이 "3:1"·"호 AB"), 좁은 조각 영역 라벨 지시선 (25_신흥중 기말 q2·q5; 26_팔마중 2학기 중간 q7 — 영역 이름+값 "△ABC=6cm²"를 바깥에 지시선으로). q3 반원 위 36°·108° 라벨 동시 배치 → E12.
- E28b 확대: 이름 없는 입체의 변 치수(dims.edge) — 지금은 꼭짓점 이름 필요 (25_연향중 기말 q15). 회전축 TEXT 라벨 자리 (q10).
- E22 확대(E13/E22 작업자에 전달): 삼각함수 ratePi+overlays curveX 계수 버그, 이름 없는 overlay 점, 두 곡선 교점 좌표 라벨, 한글 축 이름·단위, 사분면 영역 라벨 (25_동산중 기말 q16~q24).
- E26b 통계: 줄기와 잎 동그라미에 변수 라벨(a,b,c), marks 16개 넘는 순번 전체, 다각형의 복원 꼭짓점 점선 표시 (25_연향중 기말 q17·q18·q20).
- E26c 통계: 줄기와 잎 소수 설명문(7|2는 7.2초, key decimals), 누적 합·비율 식 라벨(2+6=8, 14/28=50%), 알려진 계급 묶음의 ? 라벨 (25_왕운중 기말 q15~q18).
- E26c 확대: 순번 라벨 "번째" 표기 (25_왕운중 기말 q15).
- E27b 입체: 구 자르기 방향(축/회전) 지정, 구 중심 직각 표시, 단면 넓이 라벨 (25_왕운중 기말 q12, 25_연향중 기말 q14).
- E7 확대: 길이 괄호/치수선(양 끝 눈금) — 24_매산중 q3, 24_연향중 중간 q4, 25_풍덕중 q4(경로 총길이). E8b 확대: 작도 흔적 호를 긴 연속 호로(24_연향중 중간 q10).
- E28b 확대(빈도 높음): 이름 없는 입체의 segments·dims·높이를 꼭짓점 인덱스(base i/top i/apex)로, 전개도 면 넓이 라벨(net.faceLabels)·직각 표시, 원기둥 전개도 원 제외 표시 (25_신흥중 기말 q6·q7·q9·q10·q11, 25_왕의중 기말 q14, 25_연향중 기말 q15).
- E12b 평면: 작성자가 각 라벨을 지시선 배치로 강제(labelPlacement LEADER)·호 반지름 링 지정 — 지금은 숨은 점으로 반직선을 줄이는 우회 (fixup e12wait 전반). 합성 패널 캡션 높이 COMPOSITE_CAPTION_TOO_LARGE (25_연향중 중간 q19).
- E21b 확대: 수직선 점 사이 구간 길이 라벨·같은 길이 표시·비 (numberLine.spans) (24_왕운중 중간 q4). 영역 라벨 단위 로만체 (q3).
- E14c/E28: 합성 패널 가장자리 다중이름 꼭짓점 라벨 잘림(E,G) (24_연향중 중간 q7). 줄기와 잎 동그라미 이름표 a,b,c (q15).
- E26d 통계: 다각형 양끝 덧붙인 0점 구분(점선·속 빈 점), 범례 폭, 첫 계급 0 도수일 때 끝점 처리 (24_율촌중 기말 q16·q17·q22).
- E26d 확대: 첫 계급 도수 0인 다각형의 x=-1 덧붙인 점 문제 (24_율촌중 기말 q22).
- E28c 입체: 면 세기 번호(count faces), 같은 입체 두 각도 절단 비교, 회전축 라벨, 반구 안 나머지 반 점선 (24_율촌중 기말 q1·q4·q8).
- E7b 평면 라벨: 합성 패널 TEXT 라벨 없는 패널 PUBLICATION_TEXT_NOT_READY, 대각선 많은 곳 TEXT 라벨·짧은 공선분(~70px)·얇은 영역(~48px) 라벨 LAYOUT_INVENTORY_INCOMPLETE (24_연향중 기말 q4·q13).
- E28c 입체: 이름 없는 각기둥 높이/밑변 치수(`{"height":true}`·`dims {solid,base:i}`), 원기둥 안 여러 구 배치(높이 위치), 구 4등분 시점 선택 (24_율촌중 기말 q19·q21·q9).
- E28c 입체 라벨: 입체·전개도 패널에 한글 TEXT 라벨("회전축") 불가(dims 라벨 ASCII만), 라벨 없는 전개도 패널 SOLID_FIGURE_NEEDS_A_LABEL 거절 (24_율촌중 기말 q1·q4) — E28b net.faceLabels로 q1 면 번호 1~7 다시.
- E5b 합성 패널 5개 이상(현재 4개 한도) — 회전체 5종 단면 비교 (24_율촌중 기말 q3, 반구 누락). 전개도 밑면 직각 표시·변 길이(24_율촌중 기말 q19).
- E8c 평면: 점·선만 있는 그림 PUBLICATION_TEXT_NOT_READY 거절(글자 없는 정칠각형 완전그래프), 대각선 묶음 라벨 자리 (24_향림중 중간 q18).
- E26b 통계: 막대 순위 라벨("1번째","2~6번째"), 여러 줄에 걸친 잎 묶음 괄호, 비율 식 라벨(10/25), 겹치는 누적 괄호·N번째 표식, 다각형의 복원 계급 점선 점 (24_왕운중 중간 q15·16·17·19·20).
- E26c 통계: highlightPoints에 실제 인원 라벨(상대도수×총합, 40명/36명), classSums 라벨 자유 텍스트 (24_연향중 기말 q18).
- E26d 통계: 도수 0인 양 끝점 값 라벨 켜기 (24_향림중 기말 q19).
- E11b 평면: 두 각 표식을 묶는 합 라벨/괄호(15°+75°), 호 라벨 위치 지정(labelSide), 같은 길이 눈금+길이 라벨 동시 배치 (24_향림중 기말 q8·q15·q21). 단위 없는 arcs 라벨 기본 DEGREE 함정.
- E7c 평면: 겹친 선분(BC⊂BD) 각각 길이 라벨, 합성 패널 캡션 한글 자모 굵기, 좁은 이웃 각 지시선 자동 ring (24_왕운중 중간 q13·q21·q23).
- E4b 입체 자르기: 꼭짓점 세 개로 정한 절단 평면(cuts vertices:["A","C","F"]) 또는 through에 꼭짓점 허용 — 직육면체 모서리 하나를 잘라낸 삼각뿔 제거 입체 (24_향림중 중간 q16). E28b 병합 뒤 착수.
- E26e 통계: classSums 범위에 아는 계급+미상(null) 계급이 섞이면 STAT_CLASS_SUM_UNKNOWN — 묻는 계급을 미상으로 두고 묶음 합(6명) 표시 필요 (24_연향중 중간 q18).
- E11c 평면: arcs[].emphasis ACCENT(빨간 호), 좁은 부채꼴 안 영역 라벨+각 라벨 동시, arcs 라벨 기본 ° 함정 (24_왕운중 기말 q6·q22).
- E28c 입체 라벨: net.faceLabels 비ASCII(①·가) 허용, 원뿔 좌·우 모선 같음 표시(marks.equalLengths), 부채꼴 면 라벨 SOLID_FACE_LABEL_OUTSIDE_FACE 오판 (24_향림중 기말 q2·q3·q11).
- E28d 입체: 반구 위 반구(쌓인 입체) 한 그림, 전개도 옆면 삼각형 높이 선·라벨(net.segments altitude) (24_향림중 기말 q17·q22).
- E22b 그래프: 축별 배율(분–km처럼 단위 다른 그래프), overlay 직선·곡선 한글 라벨(토끼/거북이) OVERLAY_LABEL_INVALID (23_금당중 중간 q6). E21b 수직선: 구간 안 점만 강조 (q11). 평면 직선 이름 라벨 tm 자리 실패 (q13).
- E11d 평면: 평각 180° 전용 표식(직선 위 각들의 합 괄호) (23_신흥중 중간 q4).
- E19b 좌표: 이름 숨긴 점(수선의 발)에 좌표 라벨 (-1,0) 불가; 각 라벨 labelAt (23_금당중 중간 q21·q22).
- E8c 평면: 줄 쌓기 패널의 화살표 선분 labelAt END(직선 이름 l) LAYOUT_INVENTORY_INCOMPLETE (23_왕운중 중간 q9).
- E21c 수직선: 점 줄마다 라벨(가능/불가능), 점 모양 ○/× 선택 (23_금당중 중간 q11).
- E7d 평면: 원 안 점선 반지름 위 길이 라벨 자리(3cm) LAYOUT_INVENTORY_INCOMPLETE (23_신흥중 중간 q16).
- E7e 평면: 빽빽한 현(chord) 이름 라벨 자리, 직각 표시에 식 라벨(3x=90°) (23_향림중 중간 q2·q8).
- E19c 좌표: 좌표 그림 자유 TEXT 라벨(P(a,b), a>0·b<0, 사분면 이름), 라벨 단위 kg (23_왕운중 중간 q15·q17).
- E12c 평면: 각 라벨 그리스 문자 γ 미지원(UNSUPPORTED_MATH_TOKEN) (23_연향중 중간 q10).
- E7f 평면: 공통 변 전용 표식 (23_향림중 중간 q24).
- E26f 통계: 미상 계급 기호 라벨(unknownLabels 2x·x), 경계값 별도 마커(50초) (23_연향중 기말 q15·q17).
- E11e 평면: 평각 180° 반원 호 표식+° 라벨 불가(MATH ° 거절, TEXT 자리 없음) (23_연향중 중간 q21).
- E19d 좌표: 사분면 이름 텍스트 라벨 (23_금당중 기말 q1). E8d 작도 자모 라벨(ㄱ~ㅂ) 작고 가늚 (23_왕운중 중간 q23).
- BUG 평면: 정확히 0인 좌표가 "0.e-149"로 출력돼 관측기 UNSUPPORTED_CINDY_SCALAR(꼭짓점 사슬 작도) — 소수 문자열 정규화/0 스냅 필요 (23_신흥중 중간 q26). E28e 전개도 segments 색 2종(ACCENT/REF)만 — 꼬인 모서리 다른 색 불가 (q24).
- E26g 통계: 떨어진 계급들(찢어진 계급 양옆) 합 괄호 — classSums는 이어진 계급만 (23_연향중 기말 q20).
- E7g 평면: 치수선 보조선이 각 호를 지나면 DIMENSION_CROSSES_STROKE(밧줄 6m), 얇은 삼각형 번호 라벨, 활꼴/부채꼴 영역 라벨 소속 (23_금당중 기말 q10·q11·q13). E22b 축별 배율 필요(정비례 x 75분·y 6000m, q21 UNSUPPORTED).
- E5c 합성 패널: 패널 간 같은 배율(scaleGroup) 옵션 — 숨은 더미 점 우회 중; 축 가로지르는 영역 라벨("빈 공간") 자리 (23_왕운중 기말 q10).
- E11f 평면: arcs 라벨 지시선 옵션(얇은 호 5π 라벨), 도형 안쪽 대각선 치수선 (23_연향중 기말 q8·q21).
- E26h 통계: 범례 폭이 좁아 "수영(50명)" 불가, 다각형 그림 제목/축 제목 길이 한도 (23_연향중 기말 q19·q20).
- E28f 입체: 전개도 면 높이 치수(변 중점 사이), 원뿔 두 단면 동시(물 채움), 쌓인 합성 입체(반구+원뿔대)·회전축 l·넓이 라벨, 높이의 발(꼭짓점 아님) 직각 표시 (23_금당중 기말 q17·q18·q20·q24).
- E28g 입체: 속이 빈 원기둥(원기둥 안 원기둥) 단일 입체, 고리 패널 안 짧은 반지름 라벨 (23_연향중 기말 q5).
- E28h 입체: 각뿔 높이 라벨을 꼭짓점–밑면 중심 점선에 직접(틀 없는 높이 표시) (23_금당중 기말 q24). E21d 수직선: 두 점 사이 거리 괄호·라벨, 점 이름 한글 낱말(뉴욕·두바이) (19_연향중 1학기 q9·q22, 19_팔마중 q22, 23_동산중 q9).
- E28i 입체: 속 빈 원기둥(HOLLOW_CYLINDER), 원뿔대 전개도(net CONE_FRUSTUM), dims 라벨 한글(모선·높이) (23_왕운중 기말 q11·q20·q24). E7h 한 꼭짓점 대각선 순번 라벨 배치 (q23).
- E21e 수직선: 두 점 사이 거리 괄호·이동 화살표, 점 이름 한글 낱말(수현·태호), 점 위 값 라벨 위치 선택 (1학기 여러 문항, 캡션으로 우회 중).
- E28j 입체: 전개도 highlights 3번째 색(마주 보는 면 세 쌍), faceLabels 양수 값 라벨이 넓이로 검산·cm² 붙음(값 라벨 플래그 필요), \dfrac 조판 실패, 정다면체 면 세기 번호 (24_율촌중 기말 q2, 23_동산중 1학기 q15, 19_연향중 1학기 q11).
- E28k 입체: 원기둥 안 구를 축에서 벗어난 자리에(2+2+1 배치) 놓기, 구 쐐기 두 절단면 직각 표시 (23_연향중 기말 q10·q9). E21f 수직선: SET 줄의 부등식 라벨(-9/2<x<9/2) 숨기기 옵션 (19_연향중 1학기 q8).
- E28l 입체: 반구 AXIAL 단면, 둥근 입체(원뿔대) 옆면·밑면 색 구분, 좁은 입체 위 반지름 라벨 자리 (24_왕운중 기말 q13·q20).
- E28m 입체: SEGMENT dims 라벨 쪽(side) 지정 — 높은 기둥에서 윗변 라벨 자리 (24_왕운중 기말 q14).
- E21g 수직선: parameter 끝점의 "a=… 일 때의 그림" 표기 숨김(정답 a 노출 방지) (26_왕의중 1학기 중간 q18).
- E7i 평면: 같은 길이 눈금 묶음 4개 이상(equalLengths 3묶음 한도) (26_왕의중 2학기 q5).
- E22c 그래프: lineLabels 기호식(y=ax+b), overlays 텍스트 라벨(사분면), 분수 좌표 라벨, 좌표 작도의 이름 없는 점 좌표 라벨; piecewise+overlays.lines OVERLAY_LINE_MISMATCH 반복 (26_동산중 1학기 기말 q10·q14·q24).
- E7j 평면: 도형 안쪽 대각선 치수선(마름모 BD·AC), 영역 라벨 단위 정체(cm² 이탤릭) (26_팔마중 2학기 q7).
- E22d 그래프: 수직선(x=1) 라벨 "x-1=0"만, 표시된 SOURCE_LINE 위 선분 길이 라벨 막힘, 직선이 지나는 사분면 안 사분면 이름 (26_신흥중·26_팔마중 1학기 기말 q18·q14).
- E7k 평면: 부분 길이 expressionLabels가 자기 변을 가로지르는 지시선(LEADER_CROSSING) — 이중 치수선으로 우회 (26_왕운중 2학기 q10).
- E7 확대: 한 변 위 치수선 3개 겹쳐 쌓기(AE·EC·AC 동시) 시 LAYOUT_INVENTORY_INCOMPLETE (26_왕운중 2학기 중간 q21) — 치수선 offset 단 쌓기.
- E31 좌표·그래프 직선 라벨: (a) 간격 좁은 평행선 쌍의 식 라벨 배치(26_왕운중 1학기 기말 q17·q24, 26_왕의중 1학기 기말 q11 OVERLAY_LINE_LEADER_NOT_ON_OWNER), (b) 좌표 lineLabels 기호식 text("y=ax+6") (26_왕의중 1학기 기말 q12), (c) 좁은 영역 안 기호 길이 라벨 지시선 밖 배치, (d) 이름 없는 점의 좌표 라벨 "(1,-1)" (26_왕의중 1학기 기말 q19), (e) 가파른 직선 lineLabels(y=4x-6) 미배치 (26_왕의중 1학기 기말 q22), (f) 사분면 라벨·색칠(직선이 지나는 사분면 표시) (26_왕운중 1학기 기말 q15).
- E30 확대(평면 눈금): 중간에 점이 있는 경로 전체(B-E-D)에 같은 길이 눈금 하나 — 경로 중점이 내부 점과 가까울 때도 경로 전체용 눈금 배치 (26_팔마중 2학기 중간 q11 BD=BC, q13 BC).
- E28 확대(둥근 입체 면): 원뿔·원기둥 밑면 색칠과 면 이름 라벨(S) — solids[].baseFill/baseLabel (25_왕운중 1학기 중간 q14).
- E21 확대(수직선 노트): "n=1/2일 때" 같은 분수 값 노트가 NUMBER_LINE_LABEL_TOO_LARGE — 노트 안 분수 한 줄(인라인) 표기 (25_왕운중 1학기 중간 q20).
## 중3 표본 조사(8개 시험지) 빠진 기능
- S1 입체 위 임의 보조점(구 단면 O–H–A, 정육면체 절단 사면체 수선의 발 J)과 선분·직각·거리 표기 (19_동산중 2학기 중간 중3 q19·q25).
- S2 산점도 기준선(y=x 등)·영역 강조·영역 안 점 개수 (24_연향중 2학기 기말 중3 q19).
- S3 수직선 연속 컴퍼스 작도(수선을 세운 직각삼각형 빗변을 반지름으로 한 두 번째 호) (21_금당중 1학기 중간 중3 q9) — E35 확장.
- E32 후속: pathLabels 위치·쪽 지정(anchor/side) — 좁은 꼭짓점(약 19°)에서 나온 중선 CD의 x=15cm 경로 라벨이 CG 구간에 닿아 오독, 바깥 치수선은 변을 가로질러 불가 (25_왕운중 2학기 기말 중2 q6).
- (E33 이후, 26_왕의중 1학기 중간 q23) 입체 위 꼭짓점이 아닌 점(밑면 중심 H, 변의 중점 M)에 이름 달기와 라벨 없는 direct 수선(점선+직각 표시만, h는 끌어낸 패널에)이 없다. 고정 YAW 28°라 정사각뿔 앞 옆모서리가 높이선과 겹친다. 높이 바깥 치수선은 좁은 패널에서 밑 꼭짓점을 가로지른다. 지금은 끌어낸 직각삼각형 O–H–M 패널로 우회했다.

## G1~G11 엔진 빈틈 조사 (2026-10-31, main E1~E37 기준)

읽기 전용 조사. 크기: S=반나절 이하, M=엔진 묶음 1~2시간(관측기 포함), L=새 capability(여러 묶음). 빈도는 `archive/exams/original/**` 문제 그림 있는 문항 수.

| ID | 이름 | 학년 | 크기 | 못 하는 것 | 대표 샘플(시험지 #ord) |
|---|---|---|---|---|---|
| G1 | 입체 위 보조점(밑면 중심 H·변의 중점 M·수선의 발)에 이름 달기 | 중3 | M | solid-figure-v1은 꼭짓점이 아닌 점(밑면 중심·무게중심 H, 변의 중점 M·N, 높이의 발 J)에 이름을 달거나 그 점을 끝으로 하는 선분·직각 표시… | 19_왕운중_2학기_기말_중3_기출 #21 |
| G2 | 포물선·쌍곡선(및 원·타원 혼합) 이차곡선: 초점·준선·점근선·접선 | 고2 | L | 축에 나란한 타원(ellipse-figure-v1)만 된다. 포물선의 초점·준선·꼭짓점·수선의 발, 쌍곡선의 초점·점근선·주축, 타원+원·타원+포물선 같은 혼합 … | 26_제일고_1학기_중간_고2_기하 #2 |
| G3 | 평면벡터 화살표(시점·종점, 합·차·실수배, 위치벡터) | 고2 | M | 구현됨(G3). 선분 화살촉(`displaySegments[].arrow`)은 이미 있었으나 벡터 이름(→a)·종점 dot 처리·위치벡터 성분·시점이 같은 두 벡터의 합·차·실수배 작도가 없었다. 이제 `vec()` 라벨, `planeMarks.vectors`, `planeMarks.vectorOps`가 있다(아래 G3 절) | 15_강남여고_2학기_중간_고2_기하와벡터_기출 #10 |
| G4 | 공간도형: 평면(α·β)·교선·직선의 위치·삼수선·이면각·정사영·좌표공간 | 고2 | L | 평면 자체(평행사변형으로 그린 α, β)와 평면 위의 점·직선·교선, 두 평면이 이루는 각(이면각), 평면에 내린 수선의 발과 정사영, x·y·z 좌표축 위의 점… | 22_매산고_1학기_기말_고2_기하_기출 #14 |
| G5 | 삼차 이상 함수의 색칠 영역과 삼차+이차(직선) 두 곡선 사이 | 고2 | M | graphPlan.regions는 piecewise-polynomial-spike-v1(차수≤2)만 되고, referenceCurves도 이차·구간별 이차만 받는… | 22_효천고_2학기_기말_고2_수학II #19 |
| G6 | 함수 그래프와 원을 한 그림에(원·이차함수 둘러싸인 넓이, 로그곡선+원) | 고2 | M | 원(x²+(y-2)²=4, x²+y²=2)은 좌표 작도(construction-spike-v1)에서만 되고, 함수 그래프 계열(polynomial·piecewis… | 19_순천여고_2학기_기말_고2_수학II #21 |
| G7 | 불연속 함수 둘(f와 g, f(x+1)·f(-x), 합성)과 접근 방향 표시 | 고2 | M | piecewise-discontinuous-spike-v1은 함수 하나만 그린다. 둘째 불연속 곡선(referenceCurves), 세로선·점선 안내, 색칠, 그… | 22_효천고_2학기_중간_고2_수학II #21 |
| G8 | 속 빈(구멍 뚫린) 원기둥과 원뿔대 전개도(고리 부채꼴) | 중1 | M | solids 표에 HOLLOW_CYLINDER가 없고(코드 grep 0), 전개도 net은 각기둥·각뿔·원기둥·원뿔만 된다. 구멍 뚫린 원기둥의 겉넓이(바깥·안 … | 24_연향중_2학기_기말_중1_기출 #13 |
| G9 | 도로망·격자 최단 경로 개수(교차점별 경로 수, 금지·경유 구간) | 고1 | M | 격자 도로망을 그려 교차점마다 'A에서 그 점까지 가는 방법의 수'(1,2,3,6…)를 적고, 지나지 않는 구간(PQ 금지)·반드시 지나는 구간(CD)·방향 제한… | 22_효천고_2학기_기말_고1_기출 #17 |
| G10 | 내접·혼합 입체: 원기둥 속 원뿔+구, 구 안의 정다면체 | 중1 | L | 원기둥 안에는 구·원뿔·원뿔대 하나, 또는 구 여러 개만 들어간다. 구와 원뿔의 혼합, 구 안의 정다면체·정육면체, 각뿔 안의 입체는 UNSUPPORTED(깊이 … | 24_왕운중_2학기_기말_중1_수학 #15 |
| G11 | 평면 라벨 잔여: 좌표 그림 callout, 각 callout 치수선, 좁은 꼭짓점 경로 라벨 | 중2 | S | E37 한계: 축 있는 좌표 그림의 callout은 CALLOUT_REQUIRES_PLANE_FIGURE로 거절, ANGLE callout은 호 크기가 px 고정… | 25_왕운중_2학기_기말_중2_기출 #6 |

## 샘플 상세

### G1 입체 위 보조점(밑면 중심 H·변의 중점 M·수선의 발)에 이름 달기 (중3, M)
- 근거: AUTHOR_GUIDE §3-입체 dims `direct`/`foot` 문단('밑면 꼭짓점이 아닌 점…에는 쓸 수 없다(SOLID_DIM_FOOT_INVALID)'), solid-figure-v1.mjs L1246~1268(foot는 PYRAMID/FRUSTUM+direct만), HANDOFF §4.3-2, .tmp/svg-m1/gaps.md S1·E33 이후 항목(26_왕의중 q23은 끌어낸 직각삼각형 패널로 우회)
- 샘플: `archive/exams/original/middle/m3/2final/19_왕운중_2학기_기말_중3_기출.js` #21 / 문제 그림 `assets/images/19_왕운중_2학기_기말_중3_기출/q21.png` (존재 True) — 정사각뿔 V-ABCD에서 AB·CD의 중점 M,N과 V에서 MN에 내린 수선의 발 H를 이름 붙여 직각삼각형 VMH와 ∠VMN=x를 보인다
- 샘플: `archive/exams/original/middle/m3/2final/19_왕운중_2학기_기말_중3_기출.js` #7 / 문제 그림 `assets/images/19_왕운중_2학기_기말_중3_기출/q07.png` (존재 True) — 정사면체 A-BCD에서 A의 수선의 발 H(밑면 무게중심)와 직각삼각형 ADH, ∠ADH=x를 보인다(고등: 26_금당고 2학기 중간 기하 q12의 O·H도 같은 유형)
- 설계: solids[]에 `points:[{id:'H',at:{base:'centroid'|'center'},..},{id:'M',at:{edge:['A','B'],t:'1/2'}},{id:'J',at:{foot:{from:'B',plane:['A','F','C']}}}]`처럼 엔진이 3차원에서 위치를 계산하는 이름 붙은 보조점을 추가한다. segments/dims/marks/highlights가 이 점 id를 꼭짓점처럼 받게 하고, 관측기는 plan에서 3차원 위치와 직각을 다시 확인한다. 정다면체에 height dims를 열고 foot에 이름 라벨을 단다.

### G2 포물선·쌍곡선(및 원·타원 혼합) 이차곡선: 초점·준선·점근선·접선 (고2, L)
- 근거: AUTHOR_GUIDE §3-45 말미('원, 쌍곡선·포물선, 곡선 눈금, 벡터 화살표는 이 capability의 지원 범위가 아니다'), §3-40(Y_OF_X/X_OF_Y 이차 곡선만), HANDOFF §4.3-1. 기하 이차곡선·이차곡선의 접선 문항은 그림 있는 것만 42개(12개 시험지)
- 샘플: `archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js` #2 / 문제 그림 `assets/images/26_제일고_1학기_중간_고2_기하/q2.png` (존재 True) — 포물선과 준선 l, 초점 F를 지나는 직선, A·B에서 준선에 내린 수선의 발 M·N, AF=AM·BF=BN 길이 표시
- 샘플: `archive/exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js` #13 / 문제 그림 `assets/images/26_매산고_1학기_중간_고2_기하/q13.png` (존재 True) — 쌍곡선 x²-y²=12, 점 (4,2)에서의 접선과 두 점근선 y=±x, 세 교점으로 이루어진 삼각형(넓이 12)
- 설계: ellipse-figure-v1을 conic-figure-v1(PARABOLA·HYPERBOLA·ELLIPSE·CIRCLE, 축 나란히)로 확장한다. 식 계수 p 또는 (a²,b²)에서 초점·준선·점근선·꼭짓점을 엔진이 SymPy로 계산하고 점(kind FOCUS/FOOT/ON_CURVE)·선분·접선 판별식 검증·다각형 색칠은 기존 타원 규칙을 재사용한다. 관측기는 곡선의 정의(거리 합·차·초점-준선)로 점들을 다시 확인한다.

- 구현됨(G2a, 2026-10-31): ellipse-figure-v1에 루트 `conic`(PARABOLA, 축 X·Y)을 추가했다. 곡선 `<path>`·초점·준선·꼭짓점, 일반 세로·가로선·두 점 직선(`hidden`), 직선 이름 라벨(자리 없으면 지시선), 점 kind `ON_CONIC`·`LINE_CONIC`(which 1·2)·`FOOT`(+직각 표시), 관측기 `conic_figure_observer.py`(정의 |PF|=준선 거리 포함). 정답지 item90g2a(제일고 q2)·item91g2a(매산고 q15). 남은 것: 쌍곡선·점근선(G2b), 접선·타원+원 같은 혼합(G2c), 그림 안 식 라벨·`p`의 값 표시.
- 구현됨(G2b, 2026-11-01): conic `HYPERBOLA`(center·aSquared·bSquared·transverse X·Y, 두 가지 `<path data-branch>`), 점 `FOCUS`·`VERTEX`(`side`)·`ON_CONIC`(`sign`·`branch`), 점근선 `role:"ASYMPTOTE"`(`sign` ±1, 점선·이름 라벨), 두 직선의 교점 `LINE_LINE`, `LINE_CONIC`·`FOOT`·`through`의 쌍곡선 지원(점근선과 평행한 직선은 교점 1개), 관측기(가지 두 개·점근선·LINE_LINE·정의 ||PF|-|PF'||=2a). 직선 이름 라벨이 대각선 직선 옆에 자리가 없을 때 지시선이 선에 얕게 닿던 문제를 상자 모서리 먼저 놓기로 고쳤다. 정답지 item92g2b(매산고 q13)·item93g2b(제일고 q12). 남은 것: 접선(`tangent` 판별식 검증)과 타원·원 혼합(G2c) — 제일고 q12의 원(FF'이 지름)은 G2c를 기다린다, 쌍곡선 준선, 점근선 이외의 창 밖 직선 처리.
- 구현됨(G2c, 2026-11-01): conic에 `CIRCLE`·`ELLIPSE` kind, `conics`(곡선 2개, 각 id, 곡선별 `curve`), 점 `CENTER`·`CONIC_CONIC`(곡선끼리 교점, which 1~4)·`TANGENT_FROM`(외부 점의 접점), 직선 `tangent:true`(`at` 접선 계산, 주어진 직선은 판별식 검증), 관측기(원 둥근지·두 곡선 교점·접점 일치·접선 재증명·타원 정의). 정답지 item94g2c(제일고 q12 원+쌍곡선)·item95g2c(금당고 q13 타원+포물선 접선)·item96g2c(매산고 q13 tangent:true). 남은 것: 쌍곡선 준선, 점근선 이외의 창 밖 직선 처리, 곡선 3개 이상, 접선 2개 이상의 곡선 공통 접선.

### G3 평면벡터 화살표(시점·종점, 합·차·실수배, 위치벡터) (고2, M)
- 근거(작성 당시): AUTHOR_GUIDE §3-1 ('두 점 사이 벡터… 지원하지 않는다': G3에서 3-8절 안내로 바뀜), §3-45 말미('벡터 화살표는 지원 범위가 아니다'), §3-8 dimensions style ARROW는 치수선 전용. 벡터 문항은 그림 있는 것만 16개(6개 시험지)
- 샘플: `archive/exams/original/high/h2/2mid/15_강남여고_2학기_중간_고2_기하와벡터_기출.js` #10 / 문제 그림 `assets/images/15_강남여고_2학기_중간_고2_기하와벡터_기출/q10.png` (존재 True) — 삼각형 ABC, 중선 AM, AM의 중점 K와 벡터 AB=a·AC=b, BK=(-3a+b)/4를 화살표로 보인다
- 샘플: `archive/exams/original/high/h2/1mid/22_매산고_1학기_중간_고2_기하와벡터_기출.js` #9 / 문제 그림 `assets/images/22_매산고_1학기_중간_고2_기하와벡터_기출/q09.png` (존재 True) — 정사각형 ABCD에서 시점 A의 세 벡터 a=AB, b=AD, c=AC=a+b와 a-b+2c를 화살표로 보인다
- 설계: planeMarks.vectors:[{id,from,to,label:'a',labelKind:'VECTOR'|'MATH',style:'SOLID'|'DASHED',emphasis}] — 끝에 채운 화살촉을 단 선분(점 id는 기존 displayPoints). 엔진은 from→to의 방향과 길이를 모델에서 확인하고, `sum:[v1,v2]`로 평행사변형 보조선·합벡터를 그린다. 모눈 위 성분 표시와 좌표 그림에서의 위치벡터(원점에서 점으로)는 같은 필드를 SOURCE_COORDINATE_AXES에도 허용한다.

- 구현됨(G3): ① `vec(a)`·`vec(AB)` 라벨 이름(`math_expression` 토큰, 관측기가 계획 문장에서 TeX를 다시 만들어 대조 `VECTOR_LABEL_TEX_MISMATCH`). ② `planeMarks.vectors`(from→to 화살표, 라벨 `labelAt`·`side`, 종점이면서 다른 벡터의 시점이 아닌 점은 dot 없이 이름만 `marker NO_DOT`, 좌표 그림 `components` 점선 수선·발 숫자) — `render-plan`이 모델 계산 전에 `plane-vectors.mjs`로 펼친다. ③ `planeMarks.vectorOps`(SUM `guides` PARALLELOGRAM·TRIANGLE, DIFF, SCALE `k` 유리수 문자열; 새 정확 연산 `VECTOR_SUM_POINT`·`VECTOR_SCALE_POINT`, Cindy 쪽도 다시 구성). 문항: 23_매산고 #12(직사각형 a·b·c·d), #5(정육각형 AB+AF 평행사변형), 15_강남여고 #10(중선·중점·BK) 모두 ARCHIVE_BOUND, 정답지 item87g3a·88g3b·89g3c. 남은 것: (a) 벡터에 붙는 `label`은 선분 라벨 경로라 좁은 평행사변형 안의 긴 식은 작은 캔버스(384×320)에서 자리를 못 찾는다 — `coordinateCanvas`를 키운다(정육각형은 560×480); (b) 벡터는 `displaySegments`와 같은 선분을 겹쳐 쓸 수 없다(같은 변을 일반 선과 화살표로 두 번 그리지 않는다); (c) `SUM`의 두 벡터는 시점이 같아야 하고(`TRIANGLE`은 두 번째 벡터를 첫 벡터 끝에서 다시 그린다) 세 벡터 이상의 합은 `SUM`을 겹쳐 쓸 수 없다; (d) 위치벡터 성분은 벡터의 종점만이고 시점의 성분은 그리지 않는다; (e) 3차원 벡터는 G4.

### G4 공간도형: 평면(α·β)·교선·직선의 위치·삼수선·이면각·정사영·좌표공간 (고2, L)
- 근거: AUTHOR_GUIDE에 '좌표공간'·'공간좌표'·'이면각'·'평면 α' 0건(grep, '정사영'은 투영 방식 설명 2회뿐), §3-입체 solids 표(PRISM…BIPYRAMID, 평면 없음), §3-입체 한계('한 투영(정사영)만'), HANDOFF §4.3-1. 공간도형·공간좌표 문항은 그림 있는 것 19개(6개 시험지)
- 샘플: `archive/exams/original/high/h2/1final/22_매산고_1학기_기말_고2_기하_기출.js` #14 / 문제 그림 `assets/images/22_매산고_1학기_기말_고2_기하_기출/q14.png` (존재 True) — 서로 수직인 평면 α, β와 교선 l, l 위의 P, 각 평면 위의 A, B, PA·PB와 l이 이루는 60°·45°, 평면 PBA와 β의 이면각 θ, A의 정사영 A'
- 샘플: `archive/exams/original/high/h2/1mid/26_매산고_1학기_중간_고2_기하.js` #19 / 문제 그림 `assets/images/26_매산고_1학기_중간_고2_기하/q19.png` (존재 True) — 평면 α, 평면 밖의 점 P, α 위의 점 O, 직선 l과 그 위의 H, 수선 PO·OH·PH를 그려 삼수선 정리의 반례를 보인다
- 설계: space-figure-v1을 새로 둔다: 평면(`planes:[{id:'alpha',through:[점 3개]|normal+point,extent}]`), 점(3차원 좌표 또는 평면 위 좌표), 선분·직선·교선(두 평면의 교선을 엔진이 계산), 수선의 발·정사영(`PROJECT onto`), 이면각 표식과 x·y·z 축. 고정 정사영(방위 28°)을 solid-figure와 공유하고 가려짐은 평면을 반투명 면으로 보고 깊이 검사한다.
- 구현됨(G4a, 2026-11-01): 새 capability 대신 기존 solid-figure-v1을 넓혔다. ① `solids[].points[].at`에 이 입체의 **이름 붙은 점 아무거나**를 받는 형식 `divide`(내분·`external` 외분)·`midpoint`·`centroid`·`footOnLine`(직선에 내린 수선의 발)·`projection`(세 점이 정하는 평면에 내린 수선의 발 = 정사영 점)을 더하고 보조점 한도를 6에서 10으로 올렸다(오류 `SOLID_AUX_POINT_LIMIT·UNKNOWN·CYCLE·RATIO_INVALID`, `SOLID_AUX_FOOT_DEGENERATE`, `SOLID_PROJECTION_PLANE_DEGENERATE`). 관측기는 plan만으로 점을 3D에서 다시 구해 SVG 점과 대조한다(`SOLID_AUX_POINT_OFF`, 발·정사영 성질 `SOLID_AUX_FOOT_NOT_PERPENDICULAR`·`SOLID_PROJECTION_MISMATCH`). 정사영 도형은 `highlights`의 polygon, 수선은 `segments`+`marks.rightAngles`로 그린다. 문항: 22_매산고 기말 #11(정육면체 DF의 내분점 P와 EF에 내린 수선의 발 Q), #13(정사면체 CD의 중점 M, AB의 중점 N, 이면각 φ, 정사영 삼각형 ABM) 모두 ARCHIVE_BOUND, 정답지 item97g4a·98g4a. 남은 것(G4b·G4c로): (a) 평면 α·β를 평행사변형으로 그리고 교선·직선과의 위치(#14, 26_매산고 #19)는 아직 없다; (b) 이면각은 두 선분 사이의 각(`marks.angles`) 표시뿐이고 두 평면의 이면각 자체(평면 그림과 반원 호)는 없다; (c) 보조점은 한 입체의 점에서만 계산한다(다른 입체의 점·좌표 입력 없음); (d) 좌표공간(x·y·z축)은 없다; (e) 입체 위 점의 위치는 부동소수점으로 계산하고(SymPy 정확값이 아님) 길이 라벨 `dims`가 근호 꼴로 읽는다; (f) #13에서 정사영 점은 이미 이름 붙은 M과 같은 자리라 점을 따로 만들지 않고 M에 직각 표시를 붙였다.
- 구현됨(G4b, 2026-11-01): solid-figure-v1에 `space` 블록을 더했다. ① 입체 없이(또는 입체와 함께) 3D 자유 점 `space.points`(좌표 수·정확한 문자열 `"sqrt(3)/2"`, G4a 형식 `midpoint`·`divide`·`centroid`·`footOnLine`·`projection`, `on` 검사, `hideName`·`hideDot`)와 선분 `space.segments`(AUTO는 입체 면과 평면 뒤를 점선으로) ② 평면 `space.planes`(세 점 또는 법선, `extent` 평행사변형 또는 기본 직사각형, 반투명 칠, 그리스 TeX 이름, 평면을 뚫는 선분의 실선·점선 경계) ③ 직선 `space.lines`(두 점 또는 두 평면의 교선, 소문자 한 글자 이름, 직선 위 점을 `marks`의 `refs`에 사용). 오류 `SPACE_POINT_*`·`SPACE_SEGMENT_INVALID`·`SPACE_PLANE_*`·`SPACE_LINE_*`·`SPACE_PLANES_PARALLEL`. 관측기는 점·평면 틀·교선 방향과 위치·가림 경계를 plan에서 독립으로 다시 계산해 대조한다. 문항: 26_매산고 중간 #19(삼수선 정리), 22_매산고 기말 #14(두 평면 α·β, 교선 l, 정사영 A′), 정답지 item99g4b·item100g4b. 남은 것(G4c로): 이면각 θ 표식(두 평면 사이 각의 호), 좌표축 x·y·z, 평면의 이름·지시선(평행사변형 안에 자리가 없을 때), 점이 입체와 함께 있을 때의 절대 좌표.

### G5 삼차 이상 함수의 색칠 영역과 삼차+이차(직선) 두 곡선 사이 (고2, M)
- 근거: AUTHOR_GUIDE §3-6-영역('GRAPH_REGION_REQUIRES_PIECEWISE_POLYNOMIAL'), §3-6 referenceCurves(삼차 이상은 참조 곡선 불가), §3-2 한계('곡선은 한 개… 색칠 영역·보조선은 같이 그릴 수 없다'), HANDOFF §4.3-1('삼차함수 영역')
- 샘플: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js` #19 / 문제 그림 `assets/images/22_효천고_2학기_기말_고2_수학II/q19.png` (존재 True) — x축에 접하는 삼차함수 f와 이차(직선꼴) g, 교점 O·α·β의 세로 점선과 S1(0~α)·S2(α~β) 색칠
- 설계: regions와 referenceCurves의 곡선 종류에 CUBIC/QUARTIC 다항(계수 문자열, 모든 실근 SymPy 정확 계산)을 허용한다. 곡선 표본화는 기존 cubic-quartic 계열 식을 그대로 쓰고, 경계 교점 x는 intersectionX와 같은 규칙으로 검증한다. 세로 점선은 overlays.lines {x}를 재사용한다.

### G6 함수 그래프와 원을 한 그림에(원·이차함수 둘러싸인 넓이, 로그곡선+원) (고2, M)
- 근거: AUTHOR_GUIDE §3-14 overlays(직선·세로선·점·선분·축 보조선·다각형, 원 없음), §3-40(비선형 곡선 3개 이상은 이차 곡선만), §3-1(원은 CIRCLE_CENTER_RADIUS 작도에서만)
- 샘플: `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js` #21 / 문제 그림 `assets/images/19_순천여고_2학기_기말_고2_수학II/q21.png` (존재 True) — 원 x²+(y-2)²=4와 y=x²의 교점 O·P, 현 OP, 중심 C, 부채꼴·활꼴로 S1·S2를 나눈다
- 샘플: `archive/exams/original/high/h2/2mid/26_팔마고_2학기_중간_고2_미적분I.js` #20 / 문제 그림 `assets/images/26_팔마고_2학기_중간_고2_미적분I/q20.png` (존재 True) — 원 x²+y²=2와 y=x²의 교점 A, 직선 y=tx와 원의 교점(그림에서 t의 위치)
- 설계: graphPlan.overlays에 `circles:[{id,center:[x,y],radiusSquared:'2'}]`를 더한다(원과 곡선·직선의 교점은 `intersect:['c1','curve']`로 엔진이 계산). 원 안쪽 색칠 영역은 regions boundary에 'circleUpper'/'circleLower' 호를 허용한다. 관측기는 원의 중심·반지름·교점을 plan에서 다시 계산한다.

### G7 불연속 함수 둘(f와 g, f(x+1)·f(-x), 합성)과 접근 방향 표시 (고2, M)
- 근거: AUTHOR_GUIDE §3-15 한계('referenceCurves(둘째 불연속 곡선)… 받지 않는다. 두 함수가 모두 필요하면 그림을 포기하거나 EXEMPT/UNSUPPORTED', '수직선, 세로선, 색칠 영역… 지원하지 않는다'), HANDOFF §4.3-1. 함수의 극한·연속 문항은 그림 있는 것 71개(36개 시험지)
- 샘플: `archive/exams/original/high/h2/2mid/22_효천고_2학기_중간_고2_수학II.js` #21 / 문제 그림 `assets/images/22_효천고_2학기_중간_고2_수학II/q21.png` (존재 True) — f와 g가 x=2에 대칭일 때 -2≤x≤6의 두 그래프(점프·빈 점)를 한 좌표에 그리고 a=-1~5에서 안쪽 함수의 접근 방향을 화살표로 보인다
- 샘플: `archive/exams/original/high/h2/2mid/22_팔마고_2학기_중간_고2_수학II.js` #8 / 문제 그림 `assets/images/22_팔마고_2학기_중간_고2_수학II/q8.png` (존재 True) — f(x)와 g(x)를 각각 그리고 x→1+에서 f(x+1)이 2+로 접근하는 모양(x+1 평행이동)과 x→1-에서 g의 좌극한을 보인다
- 설계: piecewise-discontinuous-spike-v1에 `referenceCurves`(최대 2, 같은 pieces 문법, id·이름)와 `shift:{dx,dy,reflectX}`(f(x+1), f(-x) 자동 변환)를 허용한다. `limitArrows:[{curve,at:'1',side:'RIGHT'|'LEFT',toY:'2'}]`로 접근 화살표와 점선 안내(x=a에서 y 값까지)를 그린다. 관측기는 각 조각의 열린·닫힌 끝과 접근 값을 다시 계산한다.

### G8 속 빈(구멍 뚫린) 원기둥과 원뿔대 전개도(고리 부채꼴) (중1, M)
- 근거: HANDOFF §4.3-3, .tmp/svg-m1/notes/DESIGN-hollow-cylinder-and-frustum-net.txt(설계만, 미구현), AUTHOR_GUIDE §3-입체('각기둥·각뿔·원기둥·원뿔의 전개도')
- 샘플: `archive/exams/original/middle/m1/2final/24_연향중_2학기_기말_중1_기출.js` #13 / 문제 그림 `assets/images/24_연향중_2학기_기말_중1_기출/q13.png` (존재 True) — 구멍 뚫린 원기둥(안 반지름 5, 바깥 9, 높이 9)의 바깥·안 옆면과 위아래 고리를 보여 겉넓이 364π를 구한다
- 샘플: `archive/exams/original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js` #20 / 문제 그림 `assets/images/24_왕운중_2학기_기말_중1_수학/q20-student.svg` (존재 True) — 원뿔대의 옆면 전개(부채꼴 고리: 큰 호 20π·작은 호 10π, 모선 13)와 두 밑면 원으로 겉넓이 320π를 보인다
- 설계: DESIGN 메모 그대로: kind HOLLOW_CYLINDER(radius, innerRadius, height; 윗면은 두 타원 사이 색, 안벽은 먼 쪽만 보이게 깊이 검사)와 net kind CONE_FRUSTUM(고리 부채꼴 rOuter=L, rInner=L-l, 각 360R/L와 두 원). 반지름·두께·높이 dims, net.excluded, faceLabels는 기존 코드를 공유한다.

### G9 도로망·격자 최단 경로 개수(교차점별 경로 수, 금지·경유 구간) (고1, M)
- 근거: AUTHOR_GUIDE grep: '도로망' 0, '최단' 0, '경우의 수' 0. 도로망·최단·격자 경로 문항은 그림 있는 것 48개(45개 시험지), 해설 그림 있는 것은 19개뿐
- 샘플: `archive/exams/original/high/h1/2final/22_효천고_2학기_기말_고1_기출.js` #17 / 문제 그림 `assets/images/22_효천고_2학기_기말_고1_기출/q17.png` (존재 True) — 5×2 정사각형 도로망에서 A→B 최단 경로, 선분 CD 위의 점을 적어도 한 번 지나는 경로의 수(교차점별 도달 방법 수와 CD 구간 강조)
- 샘플: `archive/exams/original/high/h2/1mid/18_금당고_1학기_중간_고2_확률과통계.js` #12 / 문제 그림 `assets/images/18_금당고_1학기_중간_고2_확률과통계/q12.png` (존재 True) — 같은 간격 도로망에서 선분 PQ를 지나지 않는 A→B 최단 경로(PQ 금지 구간 점선과 교차점별 수)
- 설계: lattice-path-figure-v1: `grid:{cols,rows,points:{A:[0,0],B:[5,2]}}`와 `forbidden:[segment…]`, `via:[segment…]`, `directions:'RIGHT_UP'`로 격자·점·구간을 정하면 엔진이 교차점별 경로 수를 DP로 계산해 숫자(`counts:true`)를 그린다. 그래프형 도로망(`edges`)은 점 좌표와 간선을 받아 같은 규칙으로 센다. 관측기는 경로 수를 자기 코드로 다시 센다.

### G10 내접·혼합 입체: 원기둥 속 원뿔+구, 구 안의 정다면체 (중1, L)
- 근거: AUTHOR_GUIDE §3-입체 한계('내접은 원기둥 안의 구·원뿔·원뿔대 하나, 또는 구 여러 개만… 구와 원뿔의 혼합은 UNSUPPORTED', '구 안의 정육면체·각뿔 안의 입체는 … 별도 설계다')
- 샘플: `archive/exams/original/middle/m1/2final/24_왕운중_2학기_기말_중1_수학.js` #15 / 문제 그림 `assets/images/24_왕운중_2학기_기말_중1_수학/q15-student.svg` (존재 True) — 원기둥(밑면 반지름 r, 높이 2r)에 꼭 맞는 원뿔과 구를 함께 그려 부피비 2:3:1을 보인다
- 샘플: `archive/exams/original/middle/m1/2final/23_연향중_2학기_기말_중1_기출.js` #8 / 문제 그림 `assets/images/23_연향중_2학기_기말_중1_기출/q8.png` (존재 True) — 지름 12cm 구 안에 정팔면체가 꼭 맞게 들어가고 가운데 정사각형 대각선 12가 지름인 모양
- 설계: inside 항목을 원기둥 밖으로 일반화한다: `inside:'s1'`에 구·원뿔 혼합과 정다면체(꼭짓점이 구 위)를 허용한다. 안쪽 입체의 모서리가 바깥 입체의 윤곽에 가려지는 깊이 검사를 solid-figure의 hidden-line 테스트(점-삼각형)로 확장한다. 외접 구 반지름은 엔진이 계산한다.

### G11 평면 라벨 잔여: 좌표 그림 callout, 각 callout 치수선, 좁은 꼭짓점 경로 라벨 (중2, S)
- 근거: HANDOFF §4.3-4, gaps.md E32 후속(25_왕운중 2학기 기말 중2 q6), AUTHOR_GUIDE §3-8 E37 문단·§3-10
- 샘플: `archive/exams/original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js` #6 / 문제 그림 `assets/images/25_왕운중_2학기_기말_중2_기출/q6.png` (존재 True) — 삼각형 ABC의 무게중심 G, 중선 CD 위에서 CG=10·GD=5·CD=15와 BD=5를 좁은 꼭짓점(약 19°)에서도 겹치지 않게 보인다
- 설계: callout을 SOURCE_COORDINATE_AXES에서도 허용하고(축·눈금을 피해 배치), ANGLE callout에 호 반지름 비례 옵션과 치수선(양 끝 보조선)을 더한다. pathLabels anchor 자리 탐색에 꼭짓점 근처 후보를 추가한다.

- 구현됨(G11): 좌표 그림 callout(축은 주 프레임에 고정), ANGLE callout `arcScale`·`angleDimension`, `pathLabels` 2차 자리 탐색과 `leader`. 남은 것: 복사본에 좌표 읽기 라벨은 붙이지 않는다(이름만); 2차 자리는 8방향 격자라 매우 좁은 꼭짓점의 일부 경로는 여전히 `PATH_LABEL_NO_ROOM`이고(`anchor`·`side`를 바꾸거나 끌어낸다), `CALLOUT_ANGLE_DIMENSION_NO_ROOM`은 단위 테스트로 강제하지 못했다.

### C1 평면·좌표 그림의 색 구분: 같은 것은 같은 색 (중2, S)
- 구현됨(C1): 5색 팔레트(`production/palette.mjs` = `visual_engine/palette.py`, 입체 `HIGHLIGHT_FILLS`와 같은 칠·투명도), `regions[].fill`·`graphPlan.regions[].fill`에 색 이름, `planeMarks.equalAreas`(넓이를 경계에서 정확히 계산해 대조), `angles[].color`·`equalAngles`, `segmentColors`, `equalLengths[].color`·`parallels[].color`(선분과 눈금·화살표). 가이드 3-9-색절.
- 남은 것: `overlays`의 원·사분면·`circleRegions` 칠과 `composite` 패널 사이의 색 일치 검사(패널마다 plan에 쓰고 같은 색 = 같은 대응은 작성자가 지킨다), `parallels.lines`(직선 위 화살표)의 색, 도형 callout 복사본 안의 표식 색, 흑백 인쇄용 무늬(화면이 우선이라 경고만).


### 26 삼산중 중3에서 나온 공백 (2026-11-01, 우회해서 게시함)
- callout이 숨긴 점을 쓸 수 없다(`CALLOUT_POINT_HIDDEN`): 짧은 0.5m 치수를 끌어내지 못했다.
- 5° 미만 각은 `ANGLE_ARC_TOO_SMALL`로 표시하지 못한다.
- 일부가 깨진 원(호 조각만 남은 원)을 그릴 수 없다(q24 수막새는 온전한 원으로 대신).
- 입체 높이 치수에 `side`를 줄 수 없다. 기존 입체 프라임 글자(V′)가 사선으로 렌더된다.
- 치수선 색(`planeMarks.dimensions[].color`)이 없다: 같은 길이를 색 치수선으로 묶지 못하고 선분 색으로만 묶었다(q17 AD=AF).
- 한 원에 걸친 현의 치수선은 `DIMENSION_CROSSES_STROKE`로 막힌다(q15 CD=4√7 생략, 같은 색으로 AB와 대응).
- 넓이가 같은 영역 여러 개에 각각 넓이 라벨(예: "12√3" 넷)을 붙이면 `LAYOUT_INVENTORY_INCOMPLETE`(q12, 글줄로 대신).
- 끌어내기(callout)가 있을 때 자유 텍스트 라벨이 점선 지시선을 피하지 못한다(q17은 지시선을 끄고 점 이름으로만 대응).


### 26 순천여고 고2 미적분I에서 나온 공백 (2026-11-01, 우회해서 게시함)
- 그래프 plan의 `overlays.lines[].color`·곡선 색이 없다(C1은 `regions[].fill`만): 접선과 곡선, 근 구간을 색으로 묶지 못해 흑색 선으로 그렸다.
- 직선 `label`이 `f'(-1)=7` 같은 식을 받지 않는다(`OVERLAY_LABEL_INVALID`) → `m=7`로 대신.
- `overlays.segments[].length`가 분수(3/2, 9/8)를 받지 않는다(`OVERLAY_SEGMENT_LENGTH_UNSUPPORTED`) → 캡션으로.
- 점 표시 이름에 `(2,k)` 같은 문자 좌표, 분수 좌표 라벨을 쓸 수 없다.
- `polynomial-spike-v1`의 긴 식 제목(`8x^3-12x^2-2x+3`)이 `LAYOUT_INVENTORY_INCOMPLETE` → piecewise로 우회. 패널 제목에 "f−g" 같은 설명을 넣을 수 없다.


### G12 이후 남은 그래프·집합 공백 (2026-11-01, 26 고교 시험지)
- 유리함수 세로 점근선 라벨(x=2/3) 위치 고정: phase2.mjs 일차/일차 분기 vertical-asymptote-label(xSingularity+7%, 맨 위) → asymptoteLabelAt을 세로 점근선에도. 축 이름 y가 allowSuppress로 오른쪽 위 먼 자리로 밀림(engine.py axis_labels). 효천고 q7 대기.
- 직선 라벨 지시선 끝 앵커 점(g-name-anchor, piecewiseDiscontinuousSpec)이 점으로 그려짐 → marker NONE.
- composite-panels-v1에 좌표축 패널·set-diagram 패널 불가(매산여고 q11·q18·q22, 효천고 등 두 경우 문항).
- set-diagram 영역별 다른 색 shade, 서로소(겹치지 않는) 두 집합 표현, 영역 개수 라벨이 원소 글자로만 가능(교집합 포함 개수 표기 불가: 매산여고 q13).
- 좌표 작도 plan에서 문자·근호 좌표 이름("(−3,−√2)")을 pointNames로 쓸 수 없음(그래프만 G12-3). 좌표 띠 근호 표기가 "(0,(−1√2))"로 어색.

- 이차곡선(`ellipse-figure-v1` conic): 선분·직선 color·equalLengths 없음(다각형 fill LIGHT/MEDIUM만) → C1 색 묶음 불가; 같은 값 라벨 두 번이면 ELLIPSE_LABEL_NO_ROOM; 치수선 없음; 포물선 창이 정직선현 끝을 강제 포함해 큰 값이면 ELLIPSE_FIGURE_TOO_LARGE(창 지정 필요); 곡선 이름 라벨 LEADER_CROSSING(26 금당고 기하).
- 입체(`solid-figure-v1`): dims/labels 라벨 앵커 지정 없음(√3이 엉뚱한 모서리 옆), labels가 TeX·√ 미지원, 평행 표식·색 묶음 없음(REF/ACCENT 둘만). guide-solid.md 발췌본에 `points`(edge+t, base:center) 항목 누락.
## 참고
- 원장 OPEN 시험지 14개 중 엔진 대기 사유(E19·E26c·E26d·E28d·E29·E30 등)는 현재 가이드에 해당 필드가 있어 대부분 해결로 본다(재 plan 대상). 진짜 남은 것은 G8(속 빈 원기둥·원뿔대 전개도)과 위 표의 항목이다.
- 원장 OPEN 중 내용 문제(OPEN_CONTENT 25_왕의중 기말 q19)·원본 그림 없음(26_왕의중 2학기 중간 8문항 등)·#777 골든 SHA 고정(25_매산여고·25_효천고 고1)은 엔진 부족이 아니라 제외했다.
- 이차함수 두 개(f·g)와 영역, 확률밀도함수 조각 일차 그래프+영역, 정규분포, 지수·로그 한 쌍은 이미 되므로 넣지 않았다.
