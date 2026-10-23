# AP Math Playground · 중1 기하

React + TypeScript + SVG + GSAP + KaTeX + Lucide 기반 기하 실험실입니다. 원과 부채꼴의 기존 카드 UI를 유지하면서 중1 기본 도형·작도·합동·평행선 장면을 추가했습니다.

## 실행

Node.js 20.19 이상 또는 22.12 이상에서:

```bash
npm install
npm run dev
```

검증 명령:

```bash
npm run check
npm run test:math
npm run test:geometry
npm run build
```

## 현재 범위

- 기초 카드 5종: 원의 둘레, 원의 넓이, 부채꼴 호의 길이, 부채꼴 둘레, 부채꼴 넓이.
- 실전 원리 14종: 기존 STEP3의 13원리와 원본 Advanced의 공통 넓이 원리를 추가했습니다.
- 총 38개 세부 구조: 실전 원리의 33개 변형과 반원 결합 5형. STEP3 사례 외에 기존 Advanced 자료에서 운동장 트랙·사분원 속 직사각형·내접 정사각형·눈사람 원·히포크라테스 초승달·비례 부채꼴·평행 현·할선 각도 추론 구조 등을 추가했습니다.
- 각 원리의 실제 계산·SVG·슬라이더·KaTeX 수식이 연결되며, 세부 도형 카드를 선택할 수 있습니다.
- 기본 도형 실험실: 점·직선·반직선·선분, 공통부분, 최단거리·중점·삼등분·비, 맞꼭지각·직선 조합수·시계각, 수직이등분선·각의 이등분·수선·종이접기, 평행선과 횡단선, 삼각형 SSS/SAS/ASA/RHS, 3D 위치관계.
- 다섯 입체(직육면체·삼각기둥·사다리꼴기둥·육각기둥·사각뿔)의 기준 모서리 관계를 좌표에서 분류하고, 선분점 드래그·기존점 스냅·실행취소·칠판 이동/확대·축소를 지원합니다.
- 기존 전체 상호작용은 `/labs/g7/points-lines.html`에 보존되어 있습니다. React 실험실 우측의 “원본 전체 실험” 링크에서 교사 패널, 세부 시나리오, 단계형 안내와 기존 2D/3D 조작을 그대로 열 수 있습니다.

## 구조

```text
src/App.tsx                         카드 탐색·라우팅
src/data/types.ts                   5개 기초 + 14개 실전 원리 등록
src/labs/basic/                     기초 5개 계산과 시각화
src/labs/semis/                     반원 결합 5개 구조·경계/면 증명
src/labs/<type>/model.ts            유형별 계산 모듈
src/labs/practice/                  공용 슬라이더·SVG·GSAP 실험실
src/labs/practice/model.ts          STEP3 계산 모델
src/labs/practice/PracticeCanvas.tsx 유형별 인터랙티브 SVG
src/geometry-core/                  2D/3D 좌표·각·교점·평행/수직·삼각형 판정
src/geometry-renderer/              조건을 검증한 SVG 점·각·직각·합동 표식 및 KaTeX
src/geometry-interaction/           포인터/키보드 드래그·스냅·실행취소
src/geometry-animation/             GSAP 작도 경로 재생/스크러빙
src/geometry-lessons/               기본 도형·작도·각·평행선·합동·공간 위치 단원
src/labs/geometry/                  카드 기반 통합 기하 실험실 화면
public/labs/g7/points-lines.html    원본 6대 모드 전체 상호작용 호환본
public/assets/geometry-relations.*  원본 2D/3D 관계 판정 오버레이
src/styles.css                      카드 UI와 반응형 스타일
STATUS.md                           누적 작업·검증 현황
```

## 수학 표현

- 원본에서 흰 영역은 흰색으로 유지합니다. 색칠 여부와 넓이 계산의 `+`/`−`는 별도 레이어로 표현합니다.
- 이동·회전하는 계산 조각은 복제해서 움직이며 원본 도형은 유지합니다. SVG 스케일·모양 변형을 넓이 보존 증명으로 사용하지 않습니다.
- 둘레는 원래 색칠 영역의 실제 경계만 셉니다. 반원 결합의 호 길이는 `Dπ/2 + Dπ/2 = Dπ`로 대응시킵니다.

`STATUS.md`에 실제 검증 내역과 아직 남은 일을 기록합니다.
