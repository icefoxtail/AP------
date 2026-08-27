# 도형의 방정식 해설 품질 + SVG 제작/독립검수 통합 운영규정 v1.0

## 0. 목적

고1 `도형의 방정식` 영역의 해설 품질을 학생이 실제로 따라갈 수 있는 수준으로 끌어올리고, 좌표·직선·원·도형의 이동 등 시각화가 중요한 문항에 해설 전용 SVG를 안정적으로 제공한다.

이 규정의 최우선 목표는 다음 두 가지다.

1. 해설의 중간 논리 생략을 제거한다.
2. 제작자 자기검수만으로 PASS를 선언하지 못하게 하고, 시험지 단위 독립검수 게이트를 강제한다.

---

## 1. 적용 범위

우선 적용 단원:
- 점과 좌표
- 직선의 방정식
- 원의 방정식
- 직선과 원의 위치관계
- 도형의 이동
- 대칭이동
- 자취·위치관계 종합

1차 우선 적용은 `원의 방정식`부터 시작한다.

---

## 2. 핵심 원칙

### 2-1. 해설이 먼저, SVG는 나중
SVG를 기존 solution 문장만 보고 바로 생성하지 않는다.

작업 순서:
1. 문제 원문 성립 검토
2. 정답 독립 검산
3. solution 재작성
4. solution 품질 검수
5. 구조화된 도형 정보 확정
6. SVG 생성
7. 문제-해설-SVG 교차검수
8. 엔진 렌더 검수

solution이 수학적으로 검증되기 전에는 SVG를 최종 확정하지 않는다.

### 2-2. SVG는 해설 문장이 아니라 검증된 수학 사실을 시각화
SVG 생성 근거는 다음의 교집합이어야 한다.
- 문제 원문
- 독립 검산 결과
- 재작성된 solution
- 구조화된 도형 정보

### 2-3. 제작 에이전트는 자기 시험지의 최종 PASS 권한이 없다
BUILDER의 SELF_CHECK는 독립검수 전달 준비 상태일 뿐, 최종 PASS가 아니다.

```text
SELF_CHECK PASS != EXAM PASS
```

---

## 3. 해설 품질 규칙

### 3-1. 핵심 중간단계 생략 금지
다음 표현으로 실제 추론을 건너뛰지 않는다.
- 계산하면
- 정리하면
- 공식에 대입하면
- 따라서

해당 표현 앞뒤 사이에 학생이 재현해야 할 식 전개·좌표 계산·경우 나누기·판단 근거가 있으면 반드시 적는다.

### 3-2. 새 점·선·보조도형은 먼저 정의
예:
- 중점 M
- 수선의 발 H
- 원의 중심 C
- 교점 P, Q

정의 없이 기호를 갑자기 사용하지 않는다.

### 3-3. 표준형과의 비교 근거를 적는다
예를 들어
```text
(x-a)^2 + (y-b)^2 = r^2
```
와 비교하여 중심과 반지름을 읽는 과정을 생략하지 않는다.

### 3-4. 계산값의 도형적 의미를 연결
예:
- 기울기가 같으므로 평행
- 기울기의 곱이 -1이므로 수직
- 중심에서 직선까지의 거리와 반지름 비교
- 평행이동 벡터만큼 중심도 이동

### 3-5. 마지막 결론은 문제에서 구한 값을 명확히 선언
객관식:
`따라서 정답은 ④이다.`

단답/서술:
`따라서 구하는 값은 ... 이다.`

---

## 4. 해설 전용 SVG 필드 규격

문제용 `image`와 해설용 시각자료를 분리한다.

권장 구조:

```js
solutionImage: "assets/images/<exam-title>/qNN-solution.svg",
solutionImageAlt: "해설 도형의 핵심 내용을 설명하는 문장",
solutionImageCaption: "학생이 그림에서 확인해야 할 핵심 관계",
solutionImageSize: "medium"
```

허용 크기:
- small
- medium
- large
- full

1차 운영에서는 해설 본문 아래(bottom)에 고정한다.
`solutionImagePlacement` 같은 추가 위치 필드는 당장 도입하지 않는다.

---

## 5. SVG 제작 표준

### 5-1. 파일명
```text
assets/images/<exam-title>/q01-solution.svg
assets/images/<exam-title>/q02-solution.svg
...
```

### 5-2. 기본 시각 규칙
- 좌표축: 단순하고 명확하게
- 점 라벨: 겹치지 않게
- 기본 도형: 선명한 실선
- 보조선: 점선 또는 얇은 선
- 핵심 관계만 표시
- 불필요한 장식 금지
- 흑백 인쇄에서도 판독 가능
- 안전여백 확보
- viewBox 명확히 지정

### 5-3. 금지 요소
- 외부 폰트 의존
- 외부 이미지 참조
- script
- foreignObject
- 렌더 환경에 따라 깨질 수 있는 복잡한 필터/효과

---

## 6. 원의 방정식 SVG 템플릿

### C1. 중심과 반지름
표시:
- 좌표축
- 원
- 중심 C
- 반지름 선분
- 원 위 점

### C2. 점과 원의 위치관계
표시:
- 중심 C
- 원
- 점 P
- 거리 CP
- 내부/원 위/외부 관계

### C3. 원과 직선
표시:
- 원
- 직선
- 교점
- 중심에서 직선까지 내린 수선
- 필요 시 거리 d와 반지름 r 비교

### C4. 접선
표시:
- 원
- 접점 T
- 반지름 CT
- 접선
- CT와 접선의 수직 관계

### C5. 현과 수직이등분선
표시:
- 현 AB
- 중점 M
- 중심 C
- CM
- 수직이등분선

---

## 7. 구조화 도형정보 블루프린트

SVG를 solution 문장에서 직접 생성하지 말고 필요 시 먼저 구조 정보를 확정한다.

예:

```js
diagramBlueprint: {
  coordinatePlane: true,
  objects: [
    { type: "point", name: "A", x: -1, y: -9 },
    { type: "point", name: "B", x: 5, y: 3 },
    { type: "point", name: "M", x: 2, y: -3 },
    { type: "line", role: "perpendicularBisector" },
    { type: "circle", center: "C1", radius: "3*sqrt(10)" }
  ]
}
```

`diagramBlueprint`는 내부 제작·검수용 데이터일 수 있으며, 실제 문항 스키마에 영구 저장할지는 별도 결정한다.

---

## 8. 독립검수 강제 구조

### 8-1. 역할 분리

#### BUILDER
담당:
- 문항 검산
- solution 재작성
- SVG 제작
- JS/에셋 완성
- SELF_CHECK
- 수정

금지:
- 자기 작업물 최종 PASS 선언

#### INDEPENDENT VERIFIER
담당:
- 원본부터 독립 검산
- 해설 품질 판정
- SVG 수학 정합성 판정
- 엔진/파일/렌더 판정
- PASS / FAIL 선언

원칙:
- 수정하지 않는다.
- FAIL 사유와 핀포인트 수정지시만 반환한다.

---

## 9. 시험지 단위 폐쇄 루프

```text
시험지 N 로드
  ↓
BUILDER 제작
  ↓
SELF_CHECK
  ↓
산출물 FREEZE
  ↓
SHA 기록
  ↓
새 컨텍스트 / 하위 에이전트 VERIFIER
  ↓
독립검수
  ├─ FAIL → BUILDER 수정 → 새 SHA → 새 독립검수
  └─ PASS → FINAL SEAL
                ↓
          다음 시험지 N+1 허용
```

시험지 N이 최종 PASS가 아니면 시험지 N+1로 넘어가지 않는다.

---

## 10. 독립검수 3영역

### V1. 수학·해설 검수
원본 문제에서 직접 다시 푼다.

검사:
- 문항 성립
- 정답 독립 검산
- solution 논리
- 중간과정 누락
- 교육과정 준수
- answer와 결론 일치
- 학생이 해설만 보고 풀이를 재현 가능한지

### V2. SVG 수학 검수
SVG를 기존 solution과만 비교하지 않는다.

반드시 다음 세 방향을 모두 확인한다.

```text
문제 ↔ 해설
문제 ↔ SVG
해설 ↔ SVG
```

독립 계산 대상 예:
- 중심
- 반지름
- 점 좌표
- 기울기
- 직선 방정식
- 교점
- 접점
- 이동벡터
- 대칭 관계

문제와 해설이 동시에 잘못된 경우에도 `문제 ↔ SVG` 직접 검수에서 잡히도록 한다.

### V3. 엔진·파일·렌더 검수
검사:
- node --check
- solutionImage 파일 존재
- SVG XML parse
- 외부 href/image 참조 없음
- viewBox
- 라벨 겹침
- clipping
- 안전여백
- 실제 해설 모드 렌더
- mixed engine 렌더
- 오답 출력/해설 사용 엔진 렌더
- 이미지 decode
- console error
- overflow
- 실제 인쇄 크기 가독성

---

## 11. PASS / FAIL 규칙

```text
V1 PASS
AND
V2 PASS
AND
V3 PASS
= EXAM PASS
```

하나라도 FAIL이면:

```text
EXAM FAIL
NEXT_EXAM_LOCKED
```

수학·해설·SVG 정합성 관련 WARN은 원칙적으로 다음 시험지 진입 전에 해소한다.

---

## 12. FAIL 분류

### FAIL_SOLUTION_LOGIC
- 핵심 추론 생략
- 정의 없는 객체 등장
- 잘못된 식 전개
- 학생 재현 불가

### FAIL_ANSWER
- 독립 검산 결과와 answer 불일치

### FAIL_SVG_MATH
- 중심·반지름·교점·직선·이동관계 등 수학적 불일치

### FAIL_SVG_LABEL
- 라벨 누락·오표기·겹침

### FAIL_RENDER
- SVG 미표시
- clipping
- overflow
- decode 실패
- console error
- 인쇄 가독성 실패

### FAIL_ENGINE_PARITY
- archive / mixed / 오답 출력 엔진 중 해설 시각자료 렌더 불일치

---

## 13. 수정 루프 규칙

VERIFIER는 수정하지 않는다.

FAIL 보고 예:

```text
q07
FAIL_SOLUTION_LOGIC
2번째 식에서 3번째 식으로 넘어가는 근거가 누락됨.

q12
FAIL_SVG_MATH
SVG 중심 C=(3,-1)
독립 계산 결과 C=(3,1)

q18
FAIL_RENDER
solutionImage 하단 라벨 clipping
```

BUILDER가 핀포인트 수정 후 새 SHA를 생성한다.

재검은 가능하면 새 검수 컨텍스트/새 하위 에이전트가 수행하고, 수정 문항만이 아니라 시험지 전체를 다시 확인한다.

---

## 14. 상태 잠금

시험지 상태 예:

```text
BUILDING
BUILT
VERIFYING
VERIFY_FAIL
REPAIRING
REVERIFYING
VERIFY_PASS
SEALED
```

다음 시험지 진입 조건:

```text
status === "SEALED"
AND
verified_sha256 === current_artifact_sha256
```

검수 PASS 후 파일이 변경되면 기존 PASS는 자동 무효다.

---

## 15. 최종 봉인 기록

시험지별 최소 기록:

```text
exam:
builder:
artifact_sha256:

math_solution_verifier:
math_solution_result:

svg_verifier:
svg_result:

engine_render_verifier:
engine_render_result:

verified_sha256:
final_result: PASS / FAIL
next_exam_unlocked: true / false
```

`artifact_sha256 != verified_sha256` 이면 최종 PASS 금지.

---

## 16. 기존 5문항 SELF_CHECK와의 관계

기존 5문항 배치 SELF_CHECK는 유지한다.

단, 의미를 다음처럼 변경한다.

```text
5문항 SELF_CHECK
= 제작 중 품질관리

시험지 종료 후 독립검수
= 최종 합격 게이트
```

따라서 SELF_CHECK를 모두 통과했더라도 독립검수 이전에는 시험지를 완료 처리하지 않는다.

---

## 17. 절대 규칙

> 제작 에이전트는 자신이 제작·수정한 시험지의 최종 PASS를 선언할 권한이 없다. 모든 시험지는 제작 완료 후 별도 컨텍스트의 독립 검수 에이전트가 원본을 기준으로 전수 검수해야 하며, 독립검수 PASS와 검증 SHA가 일치할 때만 봉인하고 다음 시험지 작업을 시작할 수 있다. FAIL 후 수정본은 다시 독립검수를 처음부터 통과해야 한다.

---

## 18. 1차 실행 범위

첫 적용:
- 고1 도형의 방정식
- 그중 원의 방정식 시험지부터 시작

각 시험지마다:
1. solution 전수 재검/보강
2. 필요한 solutionImage SVG 제작
3. 문제-해설-SVG 3중 교차검수
4. archive / mixed / 오답 출력 엔진 렌더 검수
5. 독립검수 PASS
6. SHA 봉인
7. 다음 시험지 진행
