# 24 매산중 2학기 중간 중1 유사2 Q3 — SVG 입력 인계

상태: DRAFT_INPUT_ONLY. 문제·해설 입력 각 3종 작성. SVG 제작/최종 검수/게시/인계 완료가 아님.

## 출처와 판본
- sourceRef: work/similar-m1-accumulate @ f2bc35a12904f8fe555b85d5a7f7c7a9f8dc01dc
- sourcePath: archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js
- source blob: 1a878fdcd41f6d14985166500dc3216c24fa17de, ordinal 3, answer ② (18cm).
- 체크리스트 blob: 85507106be00c3a35dacb3df8ce642d0e603a76f. 문제 필요 P1, 해설 도움 P2.
- 입력 브랜치에는 누적 브랜치의 JS를 복사하거나 병합하지 않았다. item.sourcePath를 읽을 때 반드시 위 sourceRef의 해당 blob을 별도로 가져와 결속해야 한다. 입력 브랜치의 같은 이름 파일이나 main 구판을 대신 읽지 말 것.

## 수학 및 표현 계획
발문: A,B,C,D 순서. B는 AC의 중점, C는 BD의 중점. AB=6cm, AD를 구한다.
AB=BC=6, BC=CD=6이므로 AD=6+6+6=18cm, 선택지 ②와 일치.
A를 기준점으로 B,C,D를 각각 이전 점에서 6만큼 평행이동한다. 이는 중점 조건에서 도출한 길이이며 임의 픽셀 배치가 아니다. 두 끝 연장선에 화살촉을 붙이고 실제 네 점만 이름/점 표시한다.
문제와 해설은 동일 mathPlan을 재사용하고 별개 plan으로 저장한다. 문제는 AB에 주어진 6만 표시하고 두 중점에서 직접 나오는 동등 표시를 붙인다. 해설은 BC,CD의 6을 추가한다. AD=18 및 정답 번호는 문제 그림/대체텍스트/캡션에 쓰지 않는다.
같은 이미지 파일을 두 역할에 공유하라는 지시가 아니다. 최종 SVG를 각각 만들어 역할별로 게시해야 한다.

## 계약과 검증
AUTHOR_GUIDE PLANE_FIGURE_v1 / TRANSLATE_POINT / displaySegments arrow / planeMarks equalLengths 및 expressionLabels 계약 사용.
좌표축과 수치 좌표 표시 없이 source-length 단위를 사용한다. 좌표와 중점·거리·선택지 결속은 코드로 독립 검산.
- JSON parsing / point dependency / equal lengths / midpoint / answer-choice check: 실행, 통과.
- 실제 엔진 렌더 및 독립 관측기: NOT_RUN.
- 시각/화면/래스터 검수: NOT_RUN (사용자 코드만 보기 지시).
- 공개 게시와 최종 size 측정: NOT_RUN. full은 입력 기본값.
- 기존 JS, 구판/원본 SVG, 메타 및 학년 체크리스트는 변경하지 않았다.

## 소유와 남은 조치
입력 작성 소유: 별도 similar-svg-inputs 라인. 중1 기존 작업자의 최근 완료 기록은 24 연향중 MD 변환과 미제작 SVG 목록이며 Q3 SVG 제작 소유는 확인되지 않았다. 기존 production 장부와 전용 입력 브랜치 목록에 이 판본/Q3 결과가 없음을 확인했다. 모든 외부 작업자의 실시간 소유 부재까지 증명한 것은 아니므로 구현 시작 직전에 다시 확인할 것.
기존 MD의 UNSUPPORTED 텍스트는 범용 선분 도식이라는 설명뿐이며 실제 엔진 심사 거절 기록은 확인되지 않았다. 심사 거절을 우회한 작업이 아니다.
지정 SVG 구현 담당은 아직 미확인이고 인계 메시지는 미전송. 기존 pubflow는 original 탐색, publisher는 solution 중심이므로 similar/problem 게시 계약을 확인해야 한다. 새 엔진/게시 기능은 이 작업에서 만들지 않는다.

## 별도 발견 (JS 수정하지 않음)
Q3 solution 끝에 사설문자 U+E907로 구분된 plan/meta JSON이 포함돼 있다. 부모에게 보고했으며 중1 MD 변환 담당이 분리할 대상이다. 순수 수학 해설과 입력 계획만 위 내용에 사용했다. 해당 JS 표시 잔재를 수정한 뒤에는 최신 blob 및 Q3 조건이 그대로인지 다시 확인한다.

## 2026-11-12 최신 원문 재결속 및 실제 실행 결과
중1 담당 수정 후 source blob은 b928c4c8fa415aaabd65a5a05ebd9cd4de20e852 (보고된 commit 4535b2c4e)이다. Q1/Q3의 발문·선지·정답·순수 수학 해설은 동일하며 U+E907 plan/meta 잔재가 제거됨을 직접 읽어 확인했다. 앞선 sourceRef/blob은 최초 작성 당시 이력으로 보존한다.
매산 Q3 문제 입력을 기존 저장소 엔진 snapshot 6e27b1da22fa96f585419b20be1718c7ce0d1c06의 격리 사본에서 실행했다. 잠금 의존성 설치 후 model 단계를 지나 measure에서 ARCHIVE_INPUT_INVALID / SOURCE_SCOPE로 실패했다. 현 main construction-archive-capture-v1.mjs blob 9690c4942a6b48a9229c753e3e192beee89e81d2에서도 requireOriginal:true 제한을 확인했다. similar 경로를 original로 위장하거나 검사를 끄지 않았다. SVG/PNG는 미생성, 시각 검수 NOT_RUN, 인계/게시 미완료. Q1은 렌더 시도하지 않았다.
