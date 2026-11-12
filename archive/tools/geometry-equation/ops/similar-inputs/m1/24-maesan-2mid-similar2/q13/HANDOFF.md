# 매산 유사2 Q13 엔진 샘플

상태: SAMPLE_ONLY, 운영 게시·main 병합 없음.

source: work/similar-m1-accumulate / archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js, blob 4f300aeae1bae07e956a266c76a78a0c3e59b6b0, ordinal 13.
Drive 정본 1JqIECP9R4YOfUeRZhFX2XjOV1_kas1VOA6ctXv-Yw1g Q13을 직접 읽어 BC=6, 선지⑤ AB=2, AC=3을 확인했다. 체크리스트는 P1/P2 미완, 해당 경로 기존 생성물 없음. 기존 학년 JS/메타/자산은 수정하지 않았다.

문제는 B,C와 주어진 6cm 밑변만 표시한다. 미정인 A의 위치를 강제하거나 정답을 드러내는 원/반지름을 넣지 않는다. 해설은 동일 B,C 기반, 반지름 2와 3인 두 원을 추가하여 점 A가 존재하지 않음을 보여 준다. 중심거리6 > 반지름합5, 최소간격1로 독립 검산했다. 나머지 선택지 SSS/SAS/ASA 성립 확인. 문제 SVG 글리프 B,C,6만 확인했으며 2,3,5,부등식과 정답 표시는 없다.

공식 construction-spike-v1 / composeConstructionCandidate 사용. 기존 SOURCE_POINT/endpoint 표시 계약에 따라 첫 거절 REQUIRED_SOURCE_GEOMETRY_NOT_DISPLAYED:displayPoints를 숨김 보조점 U,V의 displayPoints 등록으로 수정, 검증기 변경 없음. 첫 오류 기록 보존. 최종 두 SVG staticAudit 및 headless renderedLayout PASS. 사람이 실제 그림을 보는 시각 검수는 NOT_RUN(화면 보지 않기 지시). 실제 Archive typography/publisher는 미확인, caller supplied policy이며 actualArchive/qualification/publication NOT_RUN. 구현 샘플 준비와 원격 보존은 운영 인계 완료를 의미하지 않는다.
