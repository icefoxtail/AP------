# 매산중 유사2 Q20 — 내각/외각 이등분선

SAMPLE_ONLY. sourcePath archive/exams/similar/middle/m1/2mid/24_매산중_2학기_중간_중1_유사2.js, sourceRef work/similar-m1-accumulate, source blob b928c4c8fa415aaabd65a5a05ebd9cd4de20e852, ordinal20. 기존 SVG 입력 소유 라인이 전용 q20 경로만 추가했다. 기존 JS/메타/자산 및 학년 체크리스트는 변경하지 않았다. 다른 외부 구현자의 실시간 소유는 인계 전에 재확인 필요.

주어진 A=50도, B 내각 및 C 외각 이등분선 교점 D를 POLAR_POINT/LINE_THROUGH/LINE_INTERSECTION으로 구성했다. 도식의 B=60,C=70은 하나의 정규화 예시이며 문제 조건으로 표기하지 않는다. 공통 mathPlan 재사용, 문제에는 A50도 및 무수치 이등분 호 표시만, 해설에만 두 반각을 b,c로 표시한다. 외각 방향을 명확히 하는 BC 연장/E는 해설에 정의된 점으로 답 계산 정보가 아니다.

독립 삼각함수 계산으로 A50, B반각30/30, C외각반각55/55, BDC25 확인. 일반 증명은 2c=50+2b, c=b+D 이므로 D25. 정답④와 일치. 문제 출력 글리프 A,B,C,D,E,50도만 확인: 답25/계산30/55/b/c/정답번호 없음. 원문 발문 수정 없음.

첫 해설 구성에서 비허용 색 RED를 써 ANGLE_COLOR_INVALID:c1 발생. 에러 원본을 보존하고 현행 palette의 WARM으로 입력만 수정했다. 엔진·검증기를 변경/완화하지 않았다. 수정 후 양쪽 COMPOSED, 모델·정적 primitive/plane-mark 관측·headless 배치 검사 PASS.

엔진 snapshot1206d96c524b4fc50afc83311d2a6131c7e5ab46, 공식 composeConstructionCandidate. Typography CALLER_SUPPLIED_UNVERIFIED. 직접 시각 검수/실제 Archive 측정/qualification/publication NOT_RUN, productionAuthorized=false. 지정 게시 담당과 original-only 운영 측정 계약 차단은 유지. main 병합·배포·운영 이미지 연결 없음. PNG 별도 생성.
