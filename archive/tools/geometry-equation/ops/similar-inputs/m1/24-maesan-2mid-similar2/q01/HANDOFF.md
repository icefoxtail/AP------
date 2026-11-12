# 24 매산중 2중간 중1 유사2 Q1 — 문제/해설 SVG 입력

상태 DRAFT_INPUT_ONLY. SVG 제작/관측기/시각 검수/게시/인계는 미완료.

## 출처·소유
- sourceRef work/similar-m1-accumulate @ f2bc35a12904f8fe555b85d5a7f7c7a9f8dc01dc
- sourcePath archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js
- source blob 1a878fdcd41f6d14985166500dc3216c24fa17de, ordinal 1, answer ①
- 체크리스트 85507106be00c3a35dacb3df8ce642d0e603a76f: 문제 필요 P1, 해설 도움 P2.
- 직전 중1 작업자 기록은 MD 변환 및 SVG 미제작. production 장부 및 전용 입력 브랜치에 이 판본/Q1 완료 결과 없음. 실시간 전체 소유는 확정할 수 없으므로 구현 담당 배정 전 다시 확인.
- 원문의 범용 UNSUPPORTED 표기는 실제 엔진 심사 거절로 확인되지 않았다. 기존 심사 거절을 재시도한 작업이 아님.
- JS와 기존 이미지/계획은 보존. 새 전용 입력만 추가.

## 수학·공통 구조
A<B<C<D 순서를 유지한다. 시각화 편의를 위한 선 위의 위치는 0,2,5,9로 놓되 이는 원문의 구간 길이를 주장하지 않는다. 길이 숫자/같은 길이 표시는 없다.
CB와 CA는 시작점 C와 음의 방향이 같아 동일한 반직선이다. BC는 시작점이 다르고 CD는 방향이 반대, BC 선분/직선은 대상 종류가 다르다. 선택지①가 유일하다.
문제·해설 mathPlan은 동일하고 표시만 다르다. 문제는 직선과 네 점만, 해설은 C에서 왼쪽으로 뻗는 한 반직선만 강조한다. 문제 그림/alt/caption에는 정답①와 CA=CB를 쓰지 않는다.
SOURCE_POINT 및 TRANSLATE_POINT, PLANE_FIGURE_v1, displaySegments arrow/emphasis의 현행 계약 사용. 원문에 없는 길이 조건을 부여하지 않는다.

## 확인 및 차단
JSON 및 참조 의존성, 점 순서와 반직선 동등성/선택지 구분을 코드로 확인했다.
실제 renderer/observer NOT_RUN. 시각 검수 NOT_RUN(코드만 보기 지시). full 크기는 기본값으로 최종 측정하지 않았다.
기존 게시기는 original 탐색/solution 중심이므로 similar/problem 게시 계약 미확인, 지정 구현 담당 미확인, 인계 미전송.
입력 브랜치에 원문 JS를 복사하지 않았다. 위 sourceRef와 blob을 따로 가져와야 한다. 같은 경로의 구판으로 대체하지 말 것.
Q1 solution의 U+E907 plan/meta 잔재는 중1 담당 수정 예정. 수정 후 최신 blob의 발문·선지·정답 및 순수 해설이 그대로인지 확인해 다시 결속할 것.

## 2026-11-12 최신 원문 재결속 및 실제 실행 결과
중1 담당 수정 후 source blob은 b928c4c8fa415aaabd65a5a05ebd9cd4de20e852 (보고된 commit 4535b2c4e)이다. Q1/Q3의 발문·선지·정답·순수 수학 해설은 동일하며 U+E907 plan/meta 잔재가 제거됨을 직접 읽어 확인했다. 앞선 sourceRef/blob은 최초 작성 당시 이력으로 보존한다.
매산 Q3 문제 입력을 기존 저장소 엔진 snapshot 6e27b1da22fa96f585419b20be1718c7ce0d1c06의 격리 사본에서 실행했다. 잠금 의존성 설치 후 model 단계를 지나 measure에서 ARCHIVE_INPUT_INVALID / SOURCE_SCOPE로 실패했다. 현 main construction-archive-capture-v1.mjs blob 9690c4942a6b48a9229c753e3e192beee89e81d2에서도 requireOriginal:true 제한을 확인했다. similar 경로를 original로 위장하거나 검사를 끄지 않았다. SVG/PNG는 미생성, 시각 검수 NOT_RUN, 인계/게시 미완료. Q1은 렌더 시도하지 않았다.
