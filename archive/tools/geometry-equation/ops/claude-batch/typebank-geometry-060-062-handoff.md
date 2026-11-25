# 기하 유형은행 060~062 포물선 접선 그림 플랜 / 운영 인계 (2026-11-25)

`docs/agents/typebank-figure-plan-execution.md`의 GPT 플랜 라인 실행 기록. 기반 `main`은 `2ef72cb41b22d73528e2ee2c10df00255aefb235`이며, 작업 시작 시 관련 열린 PR 중복은 확인되지 않았다. 원본 JS를 수정하거나 SVG·PNG를 생성하지 않았다. 문항 그림(kind:problem) 8개만 대상으로 하며 해설 그림의 완료를 의미하지 않는다.

| 최신 원본 JS (`archive/exams/types/high/h2/` 아래) | Git blob SHA | 문제 그림 qid |
| --- | --- | --- |
| `기하_060_포물선의접선의방정식의활용-접점의좌표가_고2_유형은행1.js` | `dd7891eae46de79c9d671ce0afd66b5a7633a2f3` | 02, 10, 11 |
| `기하_061_포물선의접선의방정식의활용-접점이미지수_고2_유형은행1.js` | `3ce3243106542e53ff9960cd35ba994b072c2d1b` | 02, 03, 04 |
| `기하_062_포물선의접선의방정식의활용-포물선의정의_고2_유형은행1.js` | `6ed4643f437264fe34dc130a6a89725eb6cba383` | 03, 04 |

대상 plan은 `archive/tools/geometry-equation/production/plans/<정확한 stem>/qNN-problem.plan.json`에 있다. 공식 `plan-lint.cjs`의 shallow 검사 **8/8 PASS**, 전체 엔진 검사 **8/8 PASS**. 아래의 `featureParity`는 린트와 독립 판정이다. 별도 SVG/PNG 렌더·학생 화면·A4 검수는 전부 **NOT_RUN**이고 출판은 후속 안티그래비티 담당이다.

| 유형/qid | sourceVsPlan | featureParity | shallow / full | SVG·PNG·학생·A4 | 실제 그려지는 조건과 후속 |
| --- | --- | --- | --- | --- | --- |
| 060 q02 | REVIEWED | PASS | PASS / PASS | 전부 NOT_RUN | P(3,6), F(3,0), A(-3,0), 접선과 PFA 세 변 구현. 미지 넓이 비표시 |
| 060 q10 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS / PASS | 전부 NOT_RUN | A(8,8), B(-2,3), C(-8,0), D(-2,0) 좌표와 접선 l, 준선·직각(`FOOT.rightAngle`)·세 변 구현. **준선 식 라벨 `x=-2`는 `ELLIPSE_LABEL_NO_ROOM:line-d` 거절로 보류**. B·D의 x좌표는 보임. 배치 보강 후 별도 라벨 회복 필요 |
| 060 q11 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS / PASS | 전부 NOT_RUN | P·T·N, 두 직선, TN 중점 M(4,0) 표시. 원문의 문자 좌표 P(2a,2a), T(-2a,0), N(3a,0) 및 PT⊥PN 직각호가 **실제 엔진 표현으로 없음**. 문자 좌표와 교선 직각 표시 지원 필요; 정답 `a` 노출 금지 |
| 061 q02 | REVIEWED | PASS | PASS / PASS | 전부 NOT_RUN | 준선 x=-3, A 제3사분면, B 양의 접점, H 발과 직각, C(-3,0) 및 ABH 세 변 구현. 미지 넓이 비표시 |
| 061 q03 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS / PASS | 전부 NOT_RUN | F(2,0), P(3,2√6), T(-3,0), O 좌표와 접선, FP·FO 두 각변 구현. **원문 ∠PFO의 각호는 conic 엔진에 없어 미표시**. 각 표식 보강 필요; 구하는 cos 값 미표시 |
| 061 q04 | REVIEWED | PASS | PASS / PASS | 전부 NOT_RUN | 타원·포물선 공통 P(16/5,24/5), F(9/5,0), F′(-16/5,0), PF=5, P 접선 통과 구현. 단축 정답 미표시 |
| 062 q03 | REVIEWED | **ENGINE_CAPABILITY_PENDING** | PASS / PASS | 전부 NOT_RUN | 포물선·접선·초점·FA 길이 10 및 색칠 삼각형 ABF 구현. 원문 **문자 좌표** A(a,4), F(p,0), B(-a,0)를 글자 그대로 표시하는 기능 미지원. 대표 해는 `p=5−√21`, `a=5+√21`; 원문 조건은 두 근 교환을 모두 허용하며 넓이는 일정. 구하는 넓이 비표시 |
| 062 q04 | REVIEWED | PASS | PASS / PASS | 전부 NOT_RUN | 꼭짓점(1,0), F(2,0), P 제1사분면, PF=9, P 접선 구현. 구하는 기울기 미표시 |

## 후속 실행·복구 큐

1. 안티그래비티가 8개 plan을 공식 엔진으로 SVG/PNG에 렌더하여 실제 판독성·좌표 라벨 충돌·점 순서·색칠·직각·문항 화면·A4를 별도 검수할 것. **린트 PASS는 학생 화면 PASS가 아니다.**
2. 060 q10은 준선 식 라벨이 원문 `[그림]`에 요구된다. 기존 `label:"x=-2"`에서 엔진이 `ELLIPSE_LABEL_NO_ROOM:line-d`를 냈다. 다른 원문 좌표 라벨을 숨기는 해결은 피하고 엔진의 준선 식 배치를 개선한 후 전체 검사·렌더 재검수할 것.
3. 060 q11은 두 직선의 직각호 및 문자 좌표, 061 q03은 F에서 각호, 062 q03은 A·F·B의 문자 좌표 표시가 각각 실제로 필요하다. `sourceConditions`나 접근성 문장만으로 표시된 것으로 간주하지 말 것. 공식 엔진 보강 후 `featureParity` 재판정할 것.
4. 059의 JS에는 `[그림: ...]` 문제 그림 자리가 없어서 이번 생성 수량에서 제외했다. 다음 인접 **기하 063**의 `[그림]`은 7문항(q01~q07)이며 다음 플랜 배치의 첫 대상이다. 기하 전체 유형군이 종료될 때까지 미적분Ⅱ나 비어 있는 시험지·유사문항·교과서·문제집 유형군에 앞서 이 순서를 지킬 것.

원본 문제 JS, 정답, 게시 메타, `image`/`solutionImage`는 수정하지 않았다. `sourceVsPlan=REVIEWED`는 수학·원문과 plan 필드 대조의 기록이며 미지원 시각 요소는 위 표처럼 별도 미완료로 유지한다.
