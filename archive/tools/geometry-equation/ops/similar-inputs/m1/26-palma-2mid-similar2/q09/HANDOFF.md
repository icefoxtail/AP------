# 팔마중 중1 유사2 Q9 엔진 입력 초안

상태: DRAFT_INPUT_ONLY. 문제용·해설용 입력을 분리했다. SVG 생성/게시/독립 검수는 NOT_RUN. 기존 JS, EXEMPT plan, 자산은 변경하지 않았다.

- source: archive/exams/similar/middle/m1/2mid/26_팔마중_2학기_중간_중1_유사2.js
- source Git blob: 8cecfa0179f2ad8e100a44a99111f66f42521888
- 작성 계약: AUTHOR_GUIDE.md blob 9a27fa27a5519fe9e7d0139c1b86730b22ad5e7d의 construction-spike-v1 / PLANE_FIGURE_v1 / POLAR_POINT / planeMarks
- 기존 q09-problem.plan.json: EXEMPT, blob ab5429ff5dbda9ce5aec07e05a91cc3ac2ca3189. 발문에 그림의 x,y를 명시하므로 문제 그림 REQUIRED, 해설 그림 BENEFICIAL로 재판정.
- 문제·해설·보기 직접 확인: 둔각 125°, x,y는 예각. 각 55°, 합 110°, 보기 ③와 일치. 발문에는 교점 이름과 세부 배치가 없으므로 두 평행선쌍의 한 일관된 배치를 구성했다. 기존 원본 그림 재현이라고 주장하지 않는다.
- 내부점 A,B,C,D 등의 이름은 전부 숨긴다. 학생 표시는 l,m,p,q,125°,x,y뿐. 문제 그림에서 풀이 중간값/정답을 숨기고 해설에는 이웃각 55°만 추가한다. 최종 합110°는 해설 publish caption 끝에만 있다.
- 정확한 55° 방향은 POLAR_POINT가 계산하며 픽셀/SVG를 손으로 쓰지 않는다. 길이4와 여백은 도식 배치만 정하며 학생 값으로 표시하지 않는다.
- Python으로 각 표식의 실제 벡터각 125°/55°와 정답 110°를 독립 대조했다. JSON 파싱 확인. 현행 엔진 실행, 렌더, 관측기, PNG 독립 검수는 NOT_RUN.
- publish.size=full은 PLANE_FIGURE 계약의 초안값이다. 실제 figure-result.sizeClass와 일치 확인 전 게시 금지.
- 기존 학년별 JS 작성자는 진행 중이다. 이 준비 경로만 소유하며 학년별 브랜치/체크리스트를 동시 수정하지 않는다. 운영 원장에서 대상 유사시험지 이름이 발견되지 않았으나 그것만으로 다른 실행 소유 부재를 확정하지 않는다.
- 구현 담당 확인은 미완료. 중복 소유 여부 확인 뒤에만 인계/렌더. 엔진 코드, PR, main 병합은 범위 밖.

## 구현 인계시 주의
공식 render-plan.mjs를 사용하고 문제용·해설용을 별도 run에 둔다. 현재 runner 기본 identity는 SOLUTION_VISUAL이므로 문제용 게시 역할은 공식 게시 계약을 추가 확인해야 한다. 두 그림을 같은 solution slot에 게시하지 않는다. 문제용 caption에 정답을 넣지 않는다. 라벨 충돌은 지시선/캔버스 조정으로 해결하고 필수 x,y,l,m,p,q를 지우지 않는다.
