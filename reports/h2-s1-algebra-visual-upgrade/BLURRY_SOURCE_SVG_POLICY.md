# Blurry Source → Deterministic SVG Policy

사용자 지시에 따라 원문 PNG가 흐린 문항은 기존 raster를 그대로 유지하는 선택지 외에 결정론적 SVG 재구성 경로를 둔다.

## Routing

1. `SOURCE_BLUR_RECONSTRUCTABLE`
   - 문제 발문·보기·축·눈금·라벨·특수점·함수식 등으로 시각 사실을 독립 확정할 수 있음
   - 원문 PNG와 기존 `solution`/기존 SVG는 V1 first pass의 근거로 사용하지 않음
   - Python fact model → SVG candidate → V2 artifact-only → V3 parity
2. `SOURCE_BLUR_BLOCKED`
   - 핵심 graph/geometry fact를 독립 확정할 수 없음
   - SVG를 추정 생성하지 않음
   - 고해상도 source/page/fullpage/다른 원본을 먼저 탐색하고, 없으면 review blocked로 유지

## Reconstruction constraints

- SVG 좌표·곡선·특수점은 `docs/rules/04_VISUAL/도형추출.md` v3.0에 따라 Python 계산 결과에서만 생성한다.
- 기존 solution이나 기존 SVG를 V1 expected fact의 입력으로 사용하지 않는다.
- SVG는 원문을 예쁘게 재디자인하는 수단이 아니라, source fact를 보존하는 결정론적 표현이다.
- reconstructed SVG에는 provenance와 fact hash를 기록한다.
- V1 PASS 없이 production asset 또는 `solutionImage`로 연결하지 않는다.

## Current example

`24_팔마고_1학기_기말_고2_수학I q9`는 현재 `SOURCE_GRAPH_UNREADABLE`이다. 고해상도 원본이 없고 source-only fact를 확정할 수 없으면 `SOURCE_BLUR_BLOCKED`로 유지한다. 반대로 축·진폭·주기·위상·필수 라벨을 독립 확정할 수 있게 되면 `SOURCE_BLUR_RECONSTRUCTABLE`로 승격하여 Python 기반 SVG candidate를 만든다.
