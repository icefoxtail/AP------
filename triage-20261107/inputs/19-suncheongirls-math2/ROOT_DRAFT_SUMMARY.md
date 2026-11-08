# 19 순천여고 고2 수학II 2학기 기말: 로컬 입력 준비

OPEN 16문항의 3종(item/plan/publish)과 STATUS, 총 64파일을 저장했다. 현재 16문항의 해당 입력 검사 PASS, 현재 48 JSON과 성공 검사본 바이트 일치. LOCAL_ONLY / DRAFT_ONLY / NOT_READY이며 원격 쓰기·렌더·구현 인계는 하지 않았다.

## 시험지 전체 판정

| 문항 | 판정 및 정확한 표현 범위 |
|---|---|
| Q01 | OPEN 입력 준비: 사차함수 유일 극소 (0,-4) |
| Q02·03·04 | 기존 EXEMPT 보존 |
| Q05 | OPEN 입력 준비: 실제 함수와 (2,17), 양측 평균값 극한; 임의 고정 폭 없음 |
| Q06 | OPEN 입력 준비: 도함수 영점 -1,2,4와 부호·증감 캡션; 미지 곡선 생성 안 함 |
| Q07 | OPEN 입력 준비: [-3,0] 절댓값 조각과 부호 적분 -8; 기하학적 넓이 8과 구분 |
| Q08 | OPEN 입력 준비: k=5 경계 사례, 열린 (1,3); 세로 1단위 표시길이는 가로 1단위의 1/16이라고 명시 |
| Q09 | OPEN 입력 준비: 출발 후 t>0의 a-b-c 지면 순서 및 정확한 닮음 관계; 삼각형 실형 미표현 |
| Q10 | 기존 FIGURE SVG·입력 보호 |
| Q11 | OPEN 입력 준비: 삼차함수 극값과 -4<k<0 관계 |
| Q12 | OPEN 입력 준비: 실제 속도 v=(t-2)^2의 (0,4] 부분도; 원래 위치 x(2)=2/3과 구분, 원위치 곡선 미표현 |
| Q13 | OPEN 입력 준비: 이차함수와 f(1)=6 |
| Q14 | OPEN 입력 준비: 정확한 sqrt(2) 극점과 열린 매개변수 범위 |
| Q15 | 기존 FIGURE SVG·입력 보호 |
| Q16 | OPEN 입력 준비: a=1 확정 함수와 (1,5), 적분 극한 20 |
| Q17 | OPEN 입력 준비: h=f+g의 닫힌 [-1,1] 부분도와 적분 -4/3; 개별 f/g 곡선 미표현 |
| Q18 | OPEN 입력 준비: 원래 f가 아닌 보조 H=x|x-2|, k=0,1 교점 수와 경계 포함 구분 |
| Q19 | OPEN 입력 준비: 승인된 u=f-1 이동 곡선의 닫힌 [0,4] 부분도; 원래 f 값 5,1,5,1 및 최대5·최소1 결속 |
| Q20 | OPEN 입력 준비: 포물선 영점 1,3과 (3,0)의 기울기2 접선 |
| Q21 | KEEP_HISTORY: 기존 G6c 완성·게시·독립 검수 및 SVG 보호 |
| Q22 | OPEN 입력 준비: 중근2 접촉과 단순근-1 교차 |

함수 그림이 이해에 도움이 되면 계획하라는 사용자 지시와 지시선·라벨 배치 이유를 기록했다. 원문에 없는 곡선·좌표·수평 거리를 만들지 않았다. 초안 준비가 OPEN을 게시 완료로 바꾸지는 않는다. 배타 소유는 UNKNOWN이다.

## 실제 검사와 실패 이력

- 첫 검사 2026-11-08T23-36-32-215Z: 12문항 PASS. Q08 PIECEWISE_POLY_CURVE_TOO_NARROW, Q09 NUMBER_LINE_POINTS_INVALID, Q12 PIECEWISE_POLY_FIELD_UNKNOWN:axisVariable, Q17 GRAPH_REGION_BOUNDARY_UNKNOWN:positive-lobe:h 발생. 원본 결과·수정 전 네 파일씩 보존.
- Q08 지원되는 명시적 표시 배율, Q09 기호점 ID 소문자, Q12 미지원 선택 필드 제거, Q17 내부 음영 경계 ID만 최소 정정했다. 원문·수학·item은 유지했고 엔진·검증 기준은 바꾸지 않았다.
- 네 문항 한 차례 재검사 2026-11-08T23-41-25-742Z 모두 PASS. 나머지 12문항 JSON은 그대로다.
- 실제 실행: 수직선 2개 expandNumberLineFigure; 함수도 14개 fit_overview/specFor, sourceDomain 보존, semantic_model.validate, critical 구성, viewport, 축 제목·눈금 guard 대조. COORDINATE_LABEL이 없어 객체별 exact_coordinate 검사는 NOT_APPLICABLE이다. 환경·harness 오류와 미사용 fail-closed 대체 함수 호출은 0.
- 전체 독립 수학 검토·원본 이미지 독립 재검수·engine.prepare/build/render·실물 SVG/PNG 시각 및 가독성 검수·CI·게시·인계는 NOT_RUN. 입력 PASS는 READY 또는 최종 그림 PASS가 아니다.

세부 단계·바이트 결속은 final-input-results.json 및 checker 아래 두 실행 보고서에 있다. Q12/Q19 원래 곡선의 정적 기약근 제약은 실제 실패 실행과 구분했다. Q06 잘못된 루트 이미지 경로의 404도 정식 archive/assets 원본 존재 및 ROOT 직접 픽셀 검토와 구분했다.

## 기준과 보존

main ed06a82af57c37509e09b36e60b0aa59660fd313, source blob edd2afa83a38ded2779f462fda6dcccf46cf0db4 (45,222B). triage codex/svg-triage-20261107 HEAD c3b91a4be396df0ca8831a9ca1023e977c4d644a. 마지막 읽기까지 두 HEAD 변동 없음. 기존 원격 입력은 Q10/Q15 두 개뿐이며 이번 OPEN16은 로컬 초안이다.

Q10/Q15/Q21 완성 SVG, q6.png·q21.png, PR #1078·#534·#1405 및 Q07 과거 작은 자동 프레임 가독성 이력을 보존했다. 이전 로컬 패키지 739개 보호 기록은 바이트 재확인했으며 변경 없음. 효천 ref 갱신 심사거절을 재시도·우회하지 않았다. 이 결과가 원격 변경이나 인계를 승인하지 않는다.
