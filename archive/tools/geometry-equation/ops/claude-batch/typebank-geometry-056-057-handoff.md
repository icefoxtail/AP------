# 기하 유형은행 056~057 그림 플랜 / 엔진 후속 인계 (2026-11-25)

대상 원문(최신 `main` 확인 시):

- `archive/exams/types/high/h2/기하_056_타원과쌍곡선의활용-초점이일치2_고2_유형은행1.js`, blob `2ff6d865930ed1d948eaebe7c10c748b9e0e2f64`
- `archive/exams/types/high/h2/기하_057_쌍곡선의실생활활용_고2_유형은행1.js`, blob `7e7cb92984071885d11171c6e22c6ada410d0233`

이 표는 렌더 후 수리 담당자가 **수학 조건을 그림의 실제 필드와 대조**하기 위한 운영 큐다. `plan-lint` 성공은 실제 SVG·PNG 시각 완료가 아니다. `PENDING`은 합격이 아니며 기하 057-1~3의 큰 좌표 계획은 `ELLIPSE_FIGURE_TOO_LARGE`가 재현되어 정상 `plans/`에 병합하지 않았다. 원문의 모든 `[그림: …]` 슬롯을 문항별로 확인했다. 056-3번은 슬롯이 없으며 058번 1~5번 역시 원문에 문제 그림 슬롯이 없다(해설의 별도 필요성 판단은 미실시).

| 유형/qid | sourceVsPlan | featureParity | shallow / full | 렌더·PNG·학생화면·A4 | 후속 |
| --- | --- | --- | --- | --- | --- |
| 056 q01 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS / PASS | 모두 NOT_RUN | `PF=PQ` 같음 표식(동일 길이 표시)이 실제 필드에 없음. 두 선분은 있음 |
| 056 q02 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS / PASS | 모두 NOT_RUN | `PQ=QF` 같음 표식 없음; 라벨 충돌 방지로 원문의 초점·꼭짓점 좌표 문자가 실제 화면에서 누락됨. foci/vertices 위치는 정확 |
| 056 q04 | REVIEWED | PASS | PASS / PASS | 모두 NOT_RUN | OP 선분 실제 `label:7`, 교점·공통 초점 확인. 렌더 이후 문항 화면 검수 필요 |
| 056 q05 | REVIEWED | ENGINE_CAPABILITY_PENDING | PASS / PASS | 모두 NOT_RUN | 세 번째 곡선 포물선 `y²=22(x+2)`을 공식 `conics` 최대 2개 제한으로 미표시. 세 변 같음 표식도 없음. **두 곡선 부분 플랜만 생성** |
| 057 q01 | REVIEWED | ENGINE_CAPABILITY_PENDING | NOT_RUN / FAIL | 모두 NOT_RUN | 크기 `ELLIPSE_FIGURE_TOO_LARGE`; 실제 100 km 간격·30 km 높이 모델을 1:1 그림 창에 놓을 수 없음. 가짜 축 단위 축소 금지 |
| 057 q02 | REVIEWED | ENGINE_CAPABILITY_PENDING | NOT_RUN / FAIL | 모두 NOT_RUN | `ELLIPSE_FIGURE_TOO_LARGE`; 두 기지 60 km, P(30,80), PA⊥축(직각호 필요). 1:1 축 배율 정상 구현 확장 필요 |
| 057 q03 | REVIEWED | ENGINE_CAPABILITY_PENDING | NOT_RUN / FAIL | 모두 NOT_RUN | `ELLIPSE_FIGURE_TOO_LARGE`; AB 120 km, 거리차60 km인 쌍곡선 큰 장면 지원 필요 |
| 057 q04 | REVIEWED | PASS | PASS / PASS | 모두 NOT_RUN | AB 실선 `label:30`, P 높이 수선 `label:9`와 `FOOT.rightAngle:true`; 속력은 발문에만 있음 |

## 수학적 재검산과 후속 작업 요구

1. **056 q01** — 타원 `a²=36,b²=8`, 쌍곡선 `a²=4,b²=24`, 공통 초점 `c²=28`. 제2사분면 `P=(-6√7/7,4√21/7)`, 제1사분면 `Q=(10√7/7,12√21/7)`. `F′,P,Q` 순서대로 공선이고 `F′P=4`, `PF=PQ=8`. 길이 **8을 문제 그림 라벨로 노출하지 말 것**(원문은 등호만 주어짐). 같음 표식을 엔진에 추가한 뒤 재렌더.
2. **056 q02** — 초점 `F=(5,0),F′=(-5,0)`, 타원 `a²=49,b²=24`, 쌍곡선 `a²=9,b²=16`. `P=(33/5,16√6/5)`, `Q=(49/25,48√6/25)`. `F′–Q–P` 순서이며 `PQ=QF=28/5`; 구하는 PF 값은 노출 금지. 초점·꼭짓점 좌표를 화면에 표기하는 라벨 레이아웃 지원 필요(현 q02는 `ELLIPSE_LABEL_NO_ROOM` 회피를 위해 좌표 숨김).
3. **056 q04** — 쌍곡선 `x²/25−y²/11=1`, 공통 초점 `±6`, 교점 P는 `x²=125/3,y²=22/3`, `OP=7`. 타원 `a²=60,b²=24`. 문제 라벨은 OP=7만.
4. **056 q05** — 쌍곡선 초점 `(±4,0)`, 주축 반길이2, 타원은 세로 장축 `B²=48`·가로 단축 `a²=4`. 타원 초점 `(0,±2√11)`, 포물선 `y²=22(x+2)`가 그 초점을 지난다. 세 곡선 동시 엔진 표현(또는 정본 패널 기능 개선)과 정삼각형 동등변 표식을 개발한 뒤 2곡선 부분 plan을 완성형으로 보강할 것.
5. **057 q01~03** — 위 표의 원문 값을 바꾸지 말고, 큰 실제 수치의 conic viewport/축 단위·선분 단위표시를 함께 다루는 공식 엔진 확장 후 완성 plan을 작성. 단위를 임의로 축소해 `label`의 실제 길이와 서로 다르게 만드는 방법은 금지.
6. **057 q04** — 쌍곡선 `a²=144,b²=81,c=15`, 두 점 `P=(-12√2,9)`, `Q=(12√2,9)`이고 PT=9, AB=30. `PQ=24√2`와 통과시간은 정답 정보를 포함하므로 문제 그림에 표시하지 않는다.

실제 새 SVG/PNG, JS의 `image`·`solutionImage` 경로, 학생 배포는 이번 PR의 범위가 아니다. 056 q03은 문제 그림 자리표시가 없고 058은 5문항 모두 문제 그림 자리표시가 없어 **렌더용 plan 개수로 포함하지 않는다**. 해설 그림의 필요성은 별도로 전수 판단해야 한다.
