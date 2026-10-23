# AP Math Playground — React + TypeScript + GSAP 시범판

기존 카드형 프로토타입의 UI 흐름을 React로 옮기고, **반원 결합형 4종**에 GSAP 과정을 구현한 첫 번째 파일럿입니다.

## 실행

Node.js 20.19 이상 또는 Node.js 22.12 이상에서:

```bash
npm install
npm run dev
```

터미널에 표시되는 로컬 주소를 브라우저에서 열면 됩니다.

```bash
npm run build
npm run preview
```

`dist/` 폴더가 배포 파일입니다. 파일 시스템에서 `index.html`을 직접 여는 것보다 웹 서버에서 실행해야 합니다.

## 구현 범위

- 전체 13개 유형 카드 / 상세 화면의 상시 유형 탐색 카드
- 반원 결합형의 네 가지 세부 도형: 두 반원 파내기, 태극 S자, 원 속 두 구멍, 반원 3개 연결
- 반지름·지름 조절 시 SVG와 정확한 π 배수 수식 동기화
- **둘레 모드**: 실제 경계 호 따라 그리기 → 길이 비율 보존한 원둘레 비교 → 길이 막대 합산
- **넓이 모드**: 원본 색칠 영역은 건드리지 않고, 계산용 도형 조각을 별도 패널로 이동·정렬하는 GSAP 애니메이션
- GSAP 타임라인 재생 버튼, 화면 크기에 따른 카드/실험실 반응형 레이아웃
- 기초 5개는 기존 `public/circle-sectors-basic.html` 로 이동 가능
- 나머지 12개 실전 유형은 **카드만 있는 미연결 상태**임을 명시

## 구조

```text
src/App.tsx                      대시보드와 유형 이동
src/components/TypeCards.tsx     공용 카드 컴포넌트
src/data/types.ts                유형 등록 목록 (13개, 추가 가능)
src/labs/semis/geometry.ts       독립 수학 계산, 수식, 도형 정의
src/labs/semis/SemicircleLab.tsx 유형 컨트롤러
src/labs/semis/SemisCanvas.tsx   수학 SVG
src/labs/semis/ProofPanel.tsx    선·면 증명 영역
src/labs/semis/useProofAnimation.ts GSAP 효과
src/styles.css                  공용 SaaS 스타일
public/circle-sectors-basic.html 기존 기초 실험실 사본
```

새 유형을 추가할 때는 `src/labs/<id>/` 모듈을 만들고, `src/data/types.ts`에 목록을 등록하고, `src/App.tsx`의 유형 라우팅을 연결합니다.

## 정확성·표현 원칙

- 원본의 흰 부분은 **절대 계산 기호 때문에 색칠하지 않음**.
- **색칠 여부**와 **계산에서 +/−**는 분리됨.
- **둘레**는 색칠 영역의 실제 안쪽·바깥쪽 경계 모두 포함. 지름선이 보조선이면 둘레에 넣지 않음.
- 태극형 반원 둘레가 원 한 바퀴와 같은 것은 **호 길이의 합**으로 증명: 큰 반원 호 `Dπ/2` + 작은 반원 호 합 `Dπ/2` = `Dπ`. 곡률이 다른 호를 실제 강체이동으로 똑같이 겹치게 하지는 않음. 길이 대응 그림은 **비율 재배열**임.
- 넓이 식은 반원 지름 `d`에 대하여 `πd²/8`, 원 지름 `d`는 `πd²/4`를 적용함.
- 모든 GSAP 애니메이션은 React 이펙트 cleanup에서 `gsap.context().revert()`로 정리됨.

## 실행 확인 범위

이 결과물 제작 환경은 npm 레지스트리 DNS 접근이 불가능해 `npm install` 및 Vite 브라우저 빌드를 실행하지 못했습니다. 소스 파일은 작성되었고 **수학 계산 자체는 별도 단위 검증**했습니다. React 개발 실행은 네트워크가 가능한 환경에서 위 명령으로 확인해 주세요. 이는 운영 사이트 또는 Git main 반영이 아닙니다.
