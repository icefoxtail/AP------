# 팔마중 유사2 Q9 실제 엔진 샘플

SAMPLE_ONLY. 문제와 해설은 같은 수학 구조를 재사용하되 서로 다른 PROBLEM_VISUAL / SOLUTION_VISUAL identity로 생성했다. 원문 JS나 운영 자산은 수정하지 않았다.

- 원문 blob: 8cecfa0179f2ad8e100a44a99111f66f42521888
- 엔진 snapshot: 1206d96c524b4fc50afc83311d2a6131c7e5ab46
- 호출: 기존 공식 composeConstructionCandidate API. 엔진 변경 없음.
- Typography는 caller-supplied UNVERIFIED이며 실제 Archive 측정값이 아니다.
- 모델, static primitive/plane-mark audit 및 headless rendered-layout audit: 실행 PASS.
- 문제의 원문 조건은 두 쌍의 평행선, 주어진 125도, 예각 x/y이다. 문제 표시 글리프를 XML에서 재독해 125°,x°,y°,l,m,p,q만 있음을 확인했다. 55°·110°·정답번호·보조선은 추가하지 않았다.
- 해설에만 이웃각 55°를 표시하고 x/y를 같은 색으로 강조했다. 180-125=55, x+y=110을 검산했다.
- 기존 입력 이후 공개된 수정/추가 원문 조건 없음. 시각 배치는 원문 텍스트 조건을 만족하는 도식이며 유실된 원그림 복원이라고 주장하지 않는다.
- visualQA / actualArchive / publication / qualification: NOT_RUN. productionAuthorized=false. 시각적 품질을 사람이 확인한 완료본으로 보고하지 않는다.
- 게시 계약은 여전히 original-only 측정 제약이 남아 있다. 이 샘플 생성은 공식 L1 API의 독립 사용이지 Archive gate 통과/운영 게시가 아니다. 지정 운영 구현/게시 담당 인계는 미완료.

problem.svg / solution.svg는 이 샘플만의 결과다. 별도 학년 JS, main, 운영 이미지 참조에는 연결하지 않았다. PNG 미리보기는 사용자 전달용으로 생성했으며 Git에는 텍스트 SVG와 검증 결과만 보존한다.
