# Student-facing solution quality

`STAGED_EXAM`의 `solution`은 정답을 맞히는 짧은 풀이가 아니라 학생이
해설만 읽고 풀이를 재현할 수 있는 상세 해설이어야 한다. 이 문서는
실행 스킬의 계약과 검수 기준을 정의하며, 수학적 정답 자체는
`docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md`를 따른다.

## 1. Builder output contract

각 문항은 기존 `solution` 문자열과 함께 다음 객체를 반환한다.

```json
{
  "solutionDetail": {
    "version": "0.1",
    "audience": "student",
    "depth": "detailed",
    "given": "주어진 조건",
    "goal": "구할 것",
    "keyIdea": "풀이의 핵심 생각",
    "conceptNote": "필요한 정리와 그 의미",
    "steps": [
      {
        "title": "단계 이름",
        "work": "식 또는 판단",
        "why": "이 단계를 쓰는 이유"
      }
    ],
    "check": "답을 조건에 대입하거나 다른 방법으로 확인",
    "commonMistakes": ["학생이 자주 하는 실수"],
    "diagramRequirement": "MANDATORY",
    "diagramPurpose": "해설 그림이 보여주는 풀이 관계"
  },
  "solutionVisualSpec": {}
}
```

필수 항목은 `given`, `goal`, `keyIdea`, `steps`, `check`,
`commonMistakes`이다. 각 단계에는 `title`, `work`, `why`가 모두 있어야
한다. 일반 문항은 두 단계 이상, 해설 도형이 필수인 문항은 세 단계 이상을
작성한다. 글자 수만 늘려서 조건을 충족시키지 않는다.

최종 Archive의 `solution`은 런타임이 위 객체를 다음 순서로 조립한다.

```text
[조건] → [구할 것] → [풀이 아이디어] → [개념 확인]
→ [풀이 과정: 단계별 식 + 이유] → [검산]
→ [자주 하는 실수] → 정답
```

## 2. Student understanding gate

1차·2차 검수의 독립 수학 답안 산출은 학생 payload만 보고 수행한다.
그 뒤 같은 검수 task가 별도의 `*-solution.json`을 읽고 해설 품질을
판정한다. 이 solution view에는 `answerContract`와 private plan을 넣지
않는다.

`solutionReview`는 다음 항목을 반환한다.

```json
{
  "verdict": "PASS",
  "studentCanFollow": true,
    "checks": {
      "readability": "PASS",
      "stepReasons": "PASS",
      "theoremJustification": "PASS",
      "answerCheck": "PASS",
      "solutionArithmetic": "PASS",
      "diagramConsistency": "PASS"
    },
  "findings": [],
  "visualCheck": {}
}
```

`theoremJustification`와 `diagramConsistency`는 해당하지 않을 때만
`NOT_APPLICABLE`을 사용할 수 있다. 다음 중 하나라도 있으면 PASS하지
않는다.

- 공식이나 정리를 이유 없이 한 줄로 도약함
- 식 변형의 근거가 빠짐
- 기호·점·좌표가 앞뒤에서 바뀜
- 중간 결과가 다음 단계와 연결되지 않음
- 마지막 답을 조건에 대입하거나 범위를 확인하지 않음
- 풀이를 처음 읽는 학생이 필요한 전제를 찾을 수 없음
- 해설 그림의 점·선·수치가 본문과 다름

## 3. Circle geometry solution visuals

다음 단어 또는 관계가 문제·풀이에 나타나면 `diagramRequirement`를
`MANDATORY`로 올린다.

- 원의방정식, 원과 직선
- 원의 중심, 반지름
- 접선, 접점
- 현, 공통현
- 중심에서 직선까지의 거리
- 원과 직선의 교점
- 접점 현, 수선, 원의 넓이 또는 삼각형 넓이와 연결된 원

이 판정은 Builder가 새 문항의 표현을 짧게 쓰더라도 source preflight의
`solutionVisualRequirement`와 `solutionVisualElements` 힌트로 보존된다.

이때 문제용 `visualSpec`와 별도로 `solutionVisualSpec`을 만든다. 해설
그림에는 풀이를 위해 필요한 보조선을 추가할 수 있다.

기본 필수 요소:

- 원과 중심 표시
- 중심에서 원 위 점으로 가는 반지름 구성선
- 풀이에 쓰이는 라벨 점을 하나 이상

발문·풀이에 해당 요소가 등장하면 추가 필수 요소로 올린다.

- `직선`: 직선·선분·접선·현 중 해당하는 구성
- `접선` 또는 `접점`: 접선, 접점 라벨, 직각 표식
- `현` 또는 `공통현`: 현 구성선

추가 권장 요소:

- 중심과 반지름
- 좌표축과 필요한 눈금
- 문제에 등장하는 점의 이름
- 접선·현·공통현·수선
- 접점과 중점
- 직각 표식
- 풀이에 실제로 쓰는 길이·거리
- 필요할 때 중심 간 연결선과 교점

도형을 장식적으로 많이 넣는 것이 목적이 아니다. 본문에서 설명하는
관계를 학생이 한눈에 확인할 수 있도록 하나의 정확한 주해 그림을 만든다.
따라서 단순 원 방정식에 존재하지 않는 접선을 임의로 추가하지 않는다.
정답값을 그림에 직접 표시하거나, 문제용 그림을 그대로 복사해 해설
그림으로 사용하는 것은 금지한다.

staged CLI는 위 요소 검사를 결정론적으로 수행한다. 도형이 필수인 문항에서
`circle_geometry`가 아니거나 중심·반지름·라벨 점·관련 접선/현/직각 표시가
빠지면 Builder 결과를 수용하지 않는다. 통과한 요소 검사는
`solutionQuality.visualElementChecks`에도 기록된다.

`circle_geometry` 예시는 다음과 같다.

```json
{
  "version": "0.1",
  "type": "circle_geometry",
  "width": 380,
  "height": 380,
  "xRange": [-6, 8],
  "yRange": [-6, 8],
  "circles": [
    {"center": {"x": 1, "y": -1, "label": "C"}, "radius": 4}
  ],
  "points": [
    {"x": 1, "y": -1, "label": "C"},
    {"x": 1, "y": 3, "label": "T"},
    {"x": 4, "y": 3, "label": "P"}
  ],
  "segments": [
    {"from": {"x": 1, "y": -1}, "to": {"x": 1, "y": 3}, "kind": "radius", "label": "r"}
  ],
  "lines": [
    {"from": {"x": -5, "y": 3}, "to": {"x": 8, "y": 3}, "kind": "tangent", "label": "ℓ"}
  ],
  "rightAngles": [
    {"vertex": {"x": 1, "y": 3}, "alongA": {"x": 1, "y": -1}, "alongB": {"x": 2, "y": 3}}
  ],
  "annotations": [
    {"x": 3, "y": 6, "text": "CT ⟂ ℓ"}
  ]
}
```

좌표·수직·접선·교점·반지름은 모델의 눈대중 판단으로 확정하지 않는다.
`circle_geometry`는 결정론적 SVG 렌더러가 XML과 표시를 만들고,
`rightAngles`의 두 팔이 실제로 수직인지 수치 검증한다.

## 4. Review order

### 1차

1. 학생 payload만으로 독립 풀이와 정답을 산출한다.
2. solution view를 읽고 단계별 이유·정리 설명·검산을 확인한다.
3. solution visual이 있으면 본문 점·선·수치와 대조한다.
4. 누락 시 `solutionReview.verdict=REVISE`와 구체적인 수정 지점을 남긴다.

### 2차

수정본에서 같은 검사를 반복한다. 특히 1차 수정으로 수치·좌표·기호가
바뀌었을 때 solution text, solutionDetail, solutionVisualSpec, SVG 해시가
함께 바뀌었는지 확인한다. 최종 PASS는 `studentCanFollow=true`와
필수 check 전부 PASS를 요구한다.

시각 계약의 `visualSpecSha256`는 spec JSON 파일의 바이트 해시가 아니라
ALIVE가 사용하는 canonical JSON 해시(`json_sha256`)다. 검수자는
`visual_lane`과 같은 canonicalization으로 계산한 값과 후보의
`visualAsset.specSha256`, render report를 대조한다. 줄바꿈·들여쓰기 차이로
인한 raw file SHA-256을 근거로 REVISE를 내리지 않는다.

### Mother final

마더 최종 게이트는 전 문항의 solutionDetail 계약, 2차
`solutionReview`, 필수 해설 도형의 존재·해시·역할 분리를 모은다. 한
문항이라도 누락되면 전체를 `HOLD`한다. 마더는 결과 파일을 직접 수정하지
않으며, 수정은 해당 배치의 bounded revision으로 되돌린다.

## 5. Browser/render gate

`solution` 화면은 exam·answer와 별도로 실제 production engine에서
렌더한다. MathJax, 페이지 끝, overflow, 이미지 decode, clipping, 라벨
판독을 확인한다. evidence의 `solutionVisualCoverage`에는 필수 해설 도형의
문항 번호를 모두 기록해야 한다.

```json
{
  "requiredOrdinals": [18, 21],
  "renderedOrdinals": [18, 21],
  "missingOrdinals": [],
  "verdict": "PASS"
}
```

이 검수는 `solution`이 화면에 보이는지뿐 아니라, 필수 해설 도형이
solution 역할로 연결되었는지까지 확인한다. 실제 브라우저 evidence가
없으면 최종 자동 PASS가 아니다.
