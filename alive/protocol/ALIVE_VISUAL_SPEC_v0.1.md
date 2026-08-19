# ALIVE Visual Specification v0.1

ESSENTIAL 시각문항을 텍스트 문제로 변형하지 않고 별도 자산 엔진으로 처리하기 위한 최소 계약이다.

## 1. visualDependency

- NONE
- OPTIONAL
- ESSENTIAL

ESSENTIAL인데 asset이 없으면 `BLOCKED: VISUAL_ASSET_REQUIRED`.

## 2. 금지

- 그래프 해석 문제를 단순 대수 조건 문제로 바꾸기
- 도형 관계 문제를 그림 없이 다른 유형으로 재출제
- 시각 정보가 핵심인데 임의로 생략
- 불완전한 SVG를 그대로 최종 사용

## 3. 권장 흐름

```text
Question Designer
↓
visualSpec
↓
Visual Asset Engine
↓
SVG 또는 PNG
↓
Visual Validator
↓
Archive asset
```

## 4. visualSpec 최소 예

```json
{
  "type": "coordinate_plane",
  "width": 300,
  "height": 300,
  "xRange": [-5, 5],
  "yRange": [-5, 5],
  "points": [
    {"label": "A", "x": 1, "y": 2}
  ],
  "segments": []
}
```

## 5. 초기 지원 권장 type

- coordinate_plane
- segment_geometry
- polygon
- circle
- simple_function_graph
- table

복잡한 도형은 schema를 억지 확장하지 말고 PNG asset 또는 별도 renderer로 넘긴다.

## 6. Visual Validator

최소 검증:
- 발문과 좌표/길이/각/교점/눈금/라벨 일치
- 필수 정보 누락 없음
- 잘림 없음
- 인쇄 시 판독 가능
- 문제의 핵심 사고를 그림이 우연히 답을 노출하지 않음

## 7. SVG 원칙

- 기본 도형 중심
- 흑백 인쇄 우선
- SVG 내부 LaTeX 직접 삽입 지양
- 좌표/기하 수치는 visualSpec에서 생성
- LLM raw SVG 자유생성보다 deterministic renderer 우선

## 8. Asset provenance

Sidecar에 가능하면:

```json
{
  "visualDependency": "ESSENTIAL",
  "visualSpecVersion": "0.1",
  "assetType": "svg",
  "assetRef": "",
  "renderer": "",
  "visualValidator": "PASS"
}
```

을 기록한다.

## 9. Resume

Visual asset 생성 완료 후 Runtime Spec의 checkpoint/resume 계약에 따라 V5_VISUAL부터 재개한다.
단, 시각자료 생성 과정에서 발문 조건 자체가 바뀌었다면 V1-A부터 재검증한다.
