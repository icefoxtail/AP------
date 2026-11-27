# DRAWN_FEATURE_PARITY 검수: 원의 방정식 — 중단원 학습 점검

원문: `archive/exams/textbooks/비상교육_공통수학2/비상_공통수학2_원의방정식_중단원학습점검_고1.js` (12문항). 원본 문제 이미지 0건, 원본 해설 SVG 12건. 기존 SVG 12건 모두 배경 `<rect fill="#ffffff">`를 포함한다. 이 파일들은 수정하지 않았으며 각 원의 좌표·접선·반지름·수선 등 발문·해설의 핵심 관계를 실행형 플랜 19개로 재설계하였다.

모든 플랜은 `plan-lint.cjs --shallow`/full `OK`이고, `renderEllipseSvg`로 19개 모두 SVG 생성·도형 원시 요소 수를 확인했다. 그러나 엔진이 백색 rect를 강제 출력하므로 완전한 1:1 준수를 주장하지 않는다.

| 파일/qid | 축 | 판정 | capability | plan경로 | plan-lint | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `01` (q01) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `01` (q01) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1; composite-panels-v1 통합 미지원 | `./q01-solution-center.plan.json`, `./q01-solution-diameter.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 두 중심/지름 사례와 반지름 길이; **백색 배경 잔존, 원본 복합 패널 미통합** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `02` (q02) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `02` (q02) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q02-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 완전제곱 중심 C와 반지름 1; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `03` (q03) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `03` (q03) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1; composite-panels-v1 통합 미지원 | `./q03-solution-a.plan.json`, `./q03-solution-b.plan.json`, `./q03-solution-c.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: ㄱ 교점 2개, ㄴ 접점 1개, ㄷ 미교차; 각 수선·직각; **백색 배경 잔존, 원본 복합 패널 미통합** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `04` (q04) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `04` (q04) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1; composite-panels-v1 통합 미지원 | `./q04-solution-slopes.plan.json`, `./q04-solution-contact.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 기울기 -2의 두 접선과 P(4,-2√5) 접선; 직각 반지름; **백색 배경 잔존, 원본 복합 패널 미통합** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `05` (q05) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `05` (q05) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q05-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: PQ의 수직이등분선과 조건직선의 교점 C, 등거리 CP=CQ; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `06` (q06) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `06` (q06) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1; composite-panels-v1 통합 미지원 | `./q06-solution-knegative.plan.json`, `./q06-solution-kpositive.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: k=-1·1 실원 예시; 실원 없음(r²<0) 별도 설명; **백색 배경 잔존, 원본 복합 패널 미통합** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `07` (q07) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `07` (q07) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q07-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: AB=8, AH=4, OH=3, OA=5와 직각; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `08` (q08) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `08` (q08) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1; composite-panels-v1 통합 미지원 | `./q08-solution-left.plan.json`, `./q08-solution-middle.plan.json`, `./q08-solution-right.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: a=-11 접함, 0 두 교점, 9 접함의 세 사례; **백색 배경 잔존, 원본 복합 패널 미통합** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `09` (q09) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `09` (q09) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q09-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 점(-2,2)의 접선과 두 절편, OAB 직각삼각형; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `10` (q10) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `10` (q10) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q10-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 외부점에서 두 접선 T1·T2 및 반지름 직각; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `11` (q11) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `11` (q11) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q11-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 접점 P와 H의 수선 두 직각, H는 AB 중점; **백색 배경 잔존** |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `12` (q12) | 문항 | EXEMPT_TEXT_ONLY | 해당 없음 | — | 해당 없음 | 원본 문항 이미지 없음; 수식·조건을 텍스트로 제시 |
| `비상_공통수학2_원의방정식_중단원학습점검_고1.js` / `12` (q12) | 해설 | ENGINE_CAPABILITY_PENDING | ellipse-figure-v1 | `./q12-solution.plan.json` | shallow OK / full OK | 원본 해설 도형 관계 정적 대조: 원 위 최단점 P·수선 H·최소 높이 PH; **백색 배경 잔존** |

## 엔진 미지원 사양: ENGINE_CAPABILITY_PENDING

1. **필수** `ellipse-figure-v1`의 `transparentBackground: true` 또는 `background: none`: 현재 `production/ellipse-figure-v1.mjs` 렌더 함수는 사용자가 면 채움을 지정하지 않아도 모든 SVG 앞부분에 `<rect width="..." height="..." fill="#fff"/>`를 무조건 삽입한다. 이에 따라 19/19 플랜이 의미상 무채움이어도 실제 SVG에는 흰 배경이 남는다. 지정 범위 밖의 엔진을 임의 수정하지 않았다.
2. **필수** `composite-panels-v1`의 `ellipse-figure-v1` 패널 지원: q01(2), q03(3), q04(2), q06(2+비실원 설명), q08(3)의 기존 복합 해설 이미지를 하나의 납품 SVG로 조립해야 한다. 현재 합성 검사는 ellipse 패널을 허용하지 않는다. 독립 플랜들은 각각 실행 가능하지만 원본 단일 이미지의 다중 패널 1:1 합성은 아직 불가하다.
3. **필요 시** q06의 `r²<0`인 비실원 사례를 같은 복합 패널에 텍스트 도식으로 설명하는 사양. 실수가 아닌 반지름을 원 모양으로 그리지 않는다.
4. 원본 SVG 12건의 `background` rect는 이번 커밋에서 건드리지 않았다. 기존 자산 교체·아카이브 지면 연결과 Chrome 기반 최종 `DRAWN_FEATURE_PARITY 1:1` 판정은 이 엔진 기능의 구현·검증 이후 진행해야 한다. 정적 발문·해설 수학 조건의 대응만 현재 확보했다.
