# AP Math Playground · 원과 부채꼴

React + TypeScript + SVG + GSAP + KaTeX 실험실입니다. 원본 기초/STEP3 계산과 도형 로직을 유형별 모듈로 옮기며, 흰 배경 카드 UI를 유지합니다.

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
npm run build
```

## 현재 범위

- 기초 카드 5종: 원의 둘레, 원의 넓이, 부채꼴 호의 길이, 부채꼴 둘레, 부채꼴 넓이.
- 실전 원리 14종: 기존 STEP3의 13원리와 원본 Advanced의 공통 넓이 원리를 추가했습니다.
- 총 38개 세부 구조: 실전 원리의 33개 변형과 반원 결합 5형. STEP3 사례 외에 기존 Advanced 자료에서 운동장 트랙·사분원 속 직사각형·내접 정사각형·눈사람 원·히포크라테스 초승달·비례 부채꼴·평행 현·할선 각도 추론 구조 등을 추가했습니다.
- 각 원리의 실제 계산·SVG·슬라이더·KaTeX 수식이 연결되며, 세부 도형 카드를 선택할 수 있습니다.

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
src/styles.css                      카드 UI와 반응형 스타일
STATUS.md                           누적 작업·검증 현황
```

## 수학 표현

- 원본에서 흰 영역은 흰색으로 유지합니다. 색칠 여부와 넓이 계산의 `+`/`−`는 별도 레이어로 표현합니다.
- 이동·회전하는 계산 조각은 복제해서 움직이며 원본 도형은 유지합니다. SVG 스케일·모양 변형을 넓이 보존 증명으로 사용하지 않습니다.
- 둘레는 원래 색칠 영역의 실제 경계만 셉니다. 반원 결합의 호 길이는 `Dπ/2 + Dπ/2 = Dπ`로 대응시킵니다.

`STATUS.md`에 실제 검증 내역과 아직 남은 일을 기록합니다.
