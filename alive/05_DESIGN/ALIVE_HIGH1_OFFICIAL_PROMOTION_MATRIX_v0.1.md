# ALIVE 고1 정식 승격 매트릭스 v0.1

## 1. 문서 상태

- 상태: `ACTIVE_PRODUCTION`
- 목적: 체험판 ALIVE 엔진을 고1 단원별 정식 운영으로 승격하기 위한 범위·품질·운영 기준을 고정한다.
- 권위: 단원명·대단원 순서·canonical unit key는 `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`의 공통수학1(`H22-C`)과 공통수학2(`H22-C2`) 표만 사용한다.
- 이 문서는 canonical 규칙을 대체하지 않는다. 세부 유형명은 구현 큐와 fixture를 위한 내부 라벨이며 새로운 canonical key가 아니다.

현재 첨부 이미지는 `docs/rules` 폴더 위치를 보여주는 참고 자료일 뿐, 별도의 운영 지시문으로 해석하지 않는다. 실제 범위는 사용자의 “고1 단원 완성” 요청과 최신 canonical master를 함께 기준으로 삼는다.

2026-08-30 최종 게이트에서 선언된 18개 단원의 bounded 지원 범위가 모두 `ACTIVE_UNIT`으로 승격되었고, 전체 집계 상태가 `ACTIVE_PRODUCTION`이 되었다. 이는 ALIVE 생성 엔진의 정식 운영 범위를 뜻하며, 이번 검증용 생성물의 production Archive 등록을 뜻하지 않는다.

기계 판독본은 같은 디렉터리의 `ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json`이다.

## 2. 정식 승격의 정의

정식 승격은 SVG 예시가 하나 렌더되는 상태가 아니다. 다음 네 가지를 모두 만족하는 `ACTIVE_UNIT`을 단원 정식으로 정의한다.

1. canonical 단원키와 source/rule snapshot이 정확히 고정된다.
2. 선언한 지원 범위의 문제를 수학적으로 독립 검산할 수 있다.
3. 문제·해설·정답 화면과 필요한 SVG가 실제 렌더에서 확인된다.
4. 전체 시험지 Run이 병렬 배치, 체크포인트 재개, bounded retry, 조립·패키징까지 끝난다.

지원하지 않는 유형은 억지로 생성하지 않고 `HOLD` 또는 명시적 `NO_DIAGRAM`으로 종료한다. “고1 전체 정식”은 모든 가능한 문제를 무제한 생성한다는 뜻이 아니라, 이 매트릭스에 선언한 지원 범위가 모두 `ACTIVE_UNIT`에 도달했다는 뜻이다.

## 3. 승격 상태

| 상태 | 의미 | 다음 상태 조건 |
|---|---|---|
| `NOT_AUDITED` | 아직 단원별 지원 범위를 감사하지 않음 | 구현 범위와 fixture 정의 |
| `PARTIAL` | 일부 기능만 운영 또는 구현됨 | 선언한 세부 범위의 검산·렌더 추가 |
| `EXPERIMENTAL` | 벤치마크에서만 반복 확인됨 | production adapter와 브라우저 증거 |
| `CANDIDATE` | 수학·SVG·재현성은 통과했으나 실제 렌더 증거 대기 | exam/solution/answer 브라우저 통과 |
| `ACTIVE_UNIT` | 단원 정식 운영 가능 | 전체 고1 집계 또는 유지보수 |
| `ACTIVE_PRODUCTION` | 전체 고1 정식 범위에 포함됨 | 회귀 검수로 유지 |
| `HOLD` | 필수 조건 미충족 또는 지원 밖 | 원인 수정 후 해당 단원만 재개 |

현재 18개 단원은 모두 `ACTIVE_UNIT`이며, 고1 집계 상태는 `ACTIVE_PRODUCTION`이다. 지원 범위를 벗어나는 유형은 계속 `HOLD`로 남기는 fail-closed 원칙을 유지한다.

## 4. 고1 canonical 범위

### 공통수학1 — `H22-C`

| 순서 | unit key | 단원 |
|---:|---|---|
| 1 | `H22-C-01` | 다항식의 연산 |
| 2 | `H22-C-02` | 항등식과 나머지 정리 |
| 3 | `H22-C-03` | 인수분해 |
| 4 | `H22-C-04` | 복소수와 이차방정식 |
| 5 | `H22-C-05` | 이차방정식과 이차함수 |
| 6 | `H22-C-06` | 여러 가지 방정식과 부등식 |
| 7 | `H22-C-07` | 합의 법칙과 곱의 법칙 |
| 8 | `H22-C-08` | 순열과 조합 |
| 9 | `H22-C-09` | 행렬과 그 연산 |

### 공통수학2 — `H22-C2`

| 순서 | unit key | 단원 |
|---:|---|---|
| 1 | `H22-C2-01` | 평면좌표 |
| 2 | `H22-C2-02` | 직선의 방정식 |
| 3 | `H22-C2-03` | 원의 방정식 |
| 4 | `H22-C2-04` | 도형의 이동 |
| 5 | `H22-C2-05` | 집합 |
| 6 | `H22-C2-06` | 명제 |
| 7 | `H22-C2-07` | 함수 |
| 8 | `H22-C2-08` | 유리함수 |
| 9 | `H22-C2-09` | 무리함수 |

총 18개 unit key를 고1 정식 승격 대상으로 고정한다.

## 5. 1차 수직 슬라이스: 도형의 방정식

첫 번째 릴리스는 이미 작업이 시작된 공통수학2의 네 단원으로 한다. 네 단원을 한꺼번에 `ACTIVE`로 표시하지 않고, 각 단원을 개별 승격한 뒤 집계한다.

| unit key | 정식 승격에 필요한 내부 커버리지 | 현재 판정 |
|---|---|---|
| `H22-C2-01` 평면좌표 | 좌표·거리, 중점·내분점·무게중심, 도형 관계의 좌표화, 자취 | `ACTIVE_UNIT` |
| `H22-C2-02` 직선의 방정식 | 두 점, 기울기·절편, 평행·수직, 교점·두 직선 관계, 점과 직선 사이 거리 | `ACTIVE_UNIT` |
| `H22-C2-03` 원의 방정식 | 표준형·일반형, 중심·반지름, 원-직선·원-원 관계, 접선·현·공통현 | `ACTIVE_UNIT` |
| `H22-C2-04` 도형의 이동 | 평행이동, 대칭이동, 점·도형 대응, 방정식 변환 | `ACTIVE_UNIT` |

이 표의 내부 커버리지는 구현 계획이다. canonical master에 있는 다른 parent의 상세 행을 임의로 이 네 단원의 정식 key로 재해석하지 않는다.

### 시각자료 원칙

- 평면좌표·직선은 문제에서 관계를 읽어야 할 때만 도형을 만든다.
- 원·접선·현 문제는 문제 도형과 별도로 학생용 해설 도형을 판정한다.
- 원 해설 도형에는 사용된 경우 중심, 기준점, 반지름, 직선·접선·현·수직 관계를 표시한다.
- 평행이동·대칭이동은 원도형과 이동 후 도형, 대응점 또는 이동 벡터가 풀이에 필요할 때 표시한다.
- 그림이 필수가 아닌 문제에 장식용 SVG를 넣지 않는다.

## 6. 단원별 공통 승격 게이트

각 내부 커버리지마다 최소 3개 fixture를 만들고, 권장 5개로 확장한다.

- 일반형 1개
- 경계·퇴화·정의역 주의형 1개
- 복합 또는 실제 시험지형 1개
- (권장) 수치 변형 1개와 표현 변형 1개

각 fixture는 다음 증거를 남긴다.

1. canonical mapping: `courseKey`, `unitKey`, label, order, rule snapshot
2. math: 모델·정답·응답형식·경계조건의 독립 검산
3. visual: `visualSpec`, topology, semantic ownership, labels, asset/spec hash
4. solution: 학생이 따라갈 수 있는 단계별 `solutionDetail`과 필수 해설 도형
5. determinism: 같은 입력의 spec·SVG·report hash 동일성
6. browser: exam·solution·answer 실제 화면, 수식, 잘림, 마지막 문항, 이미지
7. operation: 전체 시험지 batch 실행, resume, retry, assembly, package round-trip

수학·구조 검사가 통과해도 브라우저 증거가 없으면 `CANDIDATE` 이상으로 올리지 않는다. 시각 벤치마크의 `PASS_WITH_MANUAL_BROWSER_GATE`는 정식 PASS가 아니다.

## 7. 실행 순서

### Phase 0 — 기준 잠금

- 18개 canonical unit key를 JSON 매트릭스에 고정한다.
- 내부 커버리지와 시각 정책을 별도로 기록한다.
- 현재 production capability와 experimental benchmark를 분리한다.

### Phase 1 — 도형의 방정식 정식 승격

다음 순서로 한 단원씩 닫는다.

1. 평면좌표
2. 직선의 방정식
3. 원의 방정식
4. 도형의 이동

각 단원은 수학 모델 → SVG adapter → 독립 fixture → 해설 검수 → 실제 렌더 → `ACTIVE_UNIT` 순서로 진행한다.

### Phase 2 — 공통수학1 핵심 대수

다항식 → 항등식·나머지 → 인수분해 → 복소수·이차방정식 → 이차함수 → 방정식·부등식 순서로 진행한다. 경우의 수·행렬은 별도 비시각 수직 슬라이스로 닫는다.

### Phase 3 — 공통수학2 나머지

집합·명제 → 함수 → 유리함수 → 무리함수 순서로 진행한다. 그래프가 문제 해결에 필수인 경우에만 graph capability를 사용하고, 현재 실험 lane을 production으로 자동 승격하지 않는다.

### Phase 4 — 고1 집계 승격

- 18개 unit key 모두가 선언한 지원 범위에서 `ACTIVE_UNIT`
- 고1 대표 시험지 전체 생성 Run 통과
- 독립 1·2차 검수 및 mother final gate 통과
- exam·solution·answer 실제 렌더 증거 통과
- 최종 패키지 round-trip 통과

2026-08-30 최종 게이트에서 위 조건을 모두 확인했으므로 aggregate capability를 `ACTIVE_PRODUCTION`으로 표시했다. 단원 필드는 개별 승격 의미를 보존하기 위해 모두 `ACTIVE_UNIT`으로 유지한다.

## 8. 운영시간과 중단 방지 기준

정식판은 문항별 생성·검수를 순차적으로 기다리지 않는다.

```text
전체 초안 4배치 병렬
  → 전체 1차 독립검수
  → 지적 배치만 수정
  → 전체 2차 독립검수
  → 마더 최종검수
  → 조립·렌더·패키징
```

하위 에이전트 제한, 일시 오류, 중단이 발생해도 다음을 지킨다.

- 현재 stage의 queue와 manifest를 저장한다.
- 완료된 task만 닫고 reconcile한다.
- 실패한 문항·배치만 bounded retry한다.
- 다음 stage로 건너뛰지 않는다.
- 지원 밖 유형은 `HOLD`로 남기고 전체 Run을 버리지 않는다.

이 기준을 통과하지 못하면 품질이 좋아도 정식 운영판으로 승격하지 않는다.

## 9. 최종 게이트 결과

2026-08-30에 다음 증거를 기준으로 18개 단원과 고1 집계를 닫았다.

- 18개 canonical unit, 총 57개 fixture, 단원별 일반형·경계형·복합형 fixture
- 결정론적 수학 검산·학생용 `solutionDetail`·독립 검수·3회 반복 결정성: `PASS`
- 실제 Archive 엔진의 exam·solution·answer 렌더: 18×3 = 54 화면 `PASS`
- 필수 원의 방정식 해설 SVG: C2-03 문항 1~4 모두 렌더 확인 `PASS`
- 전체 시험지 Run: 18개, 108개 체크포인트, 완료 마커 전 0·후 1의 resume 검증 `PASS`
- 조립·semantic round-trip·package zip round-trip: 18개 모두 `PASS`
- production Archive 등록 및 question-index 변경: 수행하지 않음 (`NOT_PUBLISHED`)

상세 증거는 다음 기계 판독본을 따른다.

- `ALIVE_HIGH1_FINAL_PROMOTION_REPORT_v0.1.json`
- `ALIVE_HIGH1_BROWSER_RENDER_EVIDENCE_v0.1.json`
- `ALIVE_HIGH1_OFFICIAL_PROMOTION_MATRIX_v0.1.json`

정식 운영 범위 밖 유형은 계속 `HOLD`로 남기며, `ACTIVE_PRODUCTION`은 이 매트릭스의 선언 범위 전체에만 적용한다.
