# 19 금당고 고1 2학기 기말 Q20

BRANCH DRAFT / NOT_RENDERED. 기존 OPEN_UNSUPPORTED 유지. READY_FOR_RENDER가 아니다.

ROOT가 원문·정답·해설과 기존 그림을 보고 작성한 입력 3종의 바이트를 그대로 보존한다. JSON 구문 확인만 수행했다. 공식 plan/model validator·렌더·독립 시각/수학 검수·학생 화면·구현자 인계: NOT_RUN.

원문 O(0,0), A(4,0), B(0,3)을 (5,2) 평행이동한 O′(5,2), A′(9,2), B′(5,5)와 내심 C(6,3), 반지름 1을 표현하는 construction 초안이다. ROOT는 원문 PNG를 직접 확인했다. 표시 좌표와 내접원은 중간 관계이며 최종 질문 (a+b+c)/2=13을 그림에 새로 쓰지 않는다. 프라임 점 이름·좌표 라벨·지시선 및 construction 계약은 공식 미검증이다.

기준 main a39c397e11dbafa13fd27e58cd129bd3ee074c5e, source blob 8f0666029f5fb6161e3d425e3665de76a5c9ce3f. 작업 브랜치 기준 54edda58caad67c9ea390c091b608a633b08196d, source blob 81c9e1a7eb7f603a351639c97b5f4a4344f41990. 두 소스의 Q14·16·19·20 객체는 동일하고 네 sourceQuote는 현행 해설의 정확한 부분 문자열이다.

시험지 전체 22문항의 현재 원장(a849eed70c877f0710fa4360ec988634ebf74533)은 PUBLISHED 11(Q02·03·07·08·10·11·12·17·18·21·22), EXEMPT 5(Q01·05·06·13·15), OPEN_UNSUPPORTED 6(Q04·09·14·16·19·20)이다. 게시된 11문항은 참조 SVG 실물과 geometry-visual-v1 마커를 확인했다. Q09·14·16·19·20의 기존 SVG는 legacy로 보존하며 새 엔진 완료로 세지 않는다.

기존 19-geumdang/root-inputs의 11문항 44개 파일과 19-geumdang-h1/root-inputs/q04의 4개 파일은 그대로 둔다. 이번 네 문항 보존 뒤 OPEN 6개 중 Q04·14·16·19·20의 입력 3종만 준비되며 Q09는 별도 업로드 심사 거절로 미보존 상태를 유지한다. Q09 경로·파일·거절된 동작은 생성·수정·재시도하지 않는다. 시험지 전체 완료나 Q09 해소를 뜻하지 않는다.

현재 확인 가능한 작업 현황·원격 입력·open PR·과거 인계를 대조했다. 과거 11문항 인계에 이번 Q14·16·19·20은 없고, 이번 입력 작성과 겹치는 확인된 활성 작업이나 이 네 문항의 개별 업로드 거절은 찾지 못했다. PR #1225의 변경 파일에도 이 고1 시험지는 없다. 외부 로컬 소유·공유 잠금·누적 시도는 UNKNOWN이며 부재나 0으로 추정하지 않는다. 구현 담당은 최신 지시에 따라 중단 상태여서 인계·렌더를 하지 않는다. 원문·기존 SVG·원장·큐·기존 승인·실패·시도 및 모든 거절 이력을 변경하지 않는다.


## Genuine source-point binding correction

ROOT의 최신 계획을 그대로 보존했다. 원문에서 실제로 주어진 A(4,0)를 A0 SOURCE_POINT / GIVEN으로 추가하고, 기존 표시점 A(A′)를 A0에서 (5,2) 평행이동하여 얻도록 바꾸었다. (4+5,0+2)=(9,2)이므로 기존 A′ 위치는 동일하다. 임의의 더미 점을 추가하지 않았으며 새 A0는 displayPoints에 추가하지 않았다. 기존 P·B·C·K, 삼각형·원·라벨·sourceQuote 및 다른 필드는 그대로다.

근거: archive/exams/original/high/h1/2final/19_금당고_2학기_기말_고1_기출.js, blob 81c9e1a7eb7f603a351639c97b5f4a4344f41990, Q20 발문은 A(4,0), A′(9,2)를 주며 해설은 (5,2) 평행이동을 명시한다. SOURCE_COORDINATE_POINTS_REQUIRED 입력 구조를 실제 원문 점으로 보완한 초안이다. 공식 validator / render / independent visual review / handoff: NOT_RUN. 기존 승인·실패·소유 UNKNOWN·원장 이력을 유지하며 READY 또는 게시 완료를 주장하지 않는다. 별도 거절된 Q09 및 해당 작업은 수정하거나 재시도하지 않았다.

A0의 coordinates는 raw 문자열이 아니라 {"kind":"integer","value":"4"}, {"kind":"integer","value":"0"}의 정확 스칼라 객체 쌍이다. construction.py blob 1544db76302491f0325dfff4292f9b712ae71f50 L35–41, L190–206의 실제 파서와 원문 좌표를 정적으로 대조했다. 잘못된 raw 문자열 중간안은 원격에 보존하거나 실행하지 않았다.
