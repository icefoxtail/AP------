# VISUAL_AUDIT — 23_제일고_1학기_기말_고2_수학I_유사

## 범위·판정 근거

- 현행 정본: `archive/exams/similar/high/h2/1final/23_제일고_1학기_기말_고2_수학I_유사.js` (23문항, 문제축 23 + 해설축 23 = **46축**).
- 작업 기준 원격 main: `8146e5524cab423a1093a0bbe6eeb0850126549f`. 새 브랜치의 공식 계획 두 폴더 외 JS·PNG·SVG·엔진은 불변.
- 독립 2축 합계: **REQUIRED 0 / BENEFICIAL 7 / EXEMPT 39**. 텍스트가 필수 조건을 모두 전하므로 REQUIRED는 없음. BENEFICIAL은 실제 공간·그래프 이해에 도움 되는 축에만 적용.
- 직접 대조: 현행 23개 문제·보기·정답·해설, 대응 기출 `archive/exams/original/high/h2/1final/23_제일고_1학기_기말_고2_수학I.js`와 PNG `q8,q10,q20`, 기출 해설 SVG `q2,q6,q8,q9,q10,q20`, 연결 유사 SVG `q10-problem.svg`, 레거시 `q10-problem.plan.json` 및 이번 공식 plan 7개. 양쪽 자산 폴더에서 `-v2/-v3/-v4` 번호 변형본은 발견되지 않았고, 기출 시각물은 현행 유사 JS 수치보다 우선하지 않는다.

## 전 문항 문제축·해설축 독립 감사

| 문항 | 문제축: 분류·독립 근거·공식 plan | 해설축: 분류·독립 근거·공식 plan | 독립 수학 검산·답안 |
| --- | --- | --- | --- |
| 01 | **EXEMPT** — 삼각방정식 cos x=1/2가 구간과 함께 완전 지정 | **EXEMPT** — 해 두 각을 빼는 연산만으로 완료 | x=π/3,5π/3; β−α=4π/3(②) |
| 02 | **EXEMPT** — 변 BC와 두 각이 문장으로 충분히 주어짐 | **BENEFICIAL** — 사인법칙의 대응변·대응각 위치를 삼각형에 표시하면 도움 → `q02-solution.plan.json` | AC=6 sin45°/sin60°=2√6(④) |
| 03 | **EXEMPT** — 제곱합의 전개식만 문제 조건 | **EXEMPT** — 계수별 합을 대입하면 바로 종료 | 9+6·4+9·10=123(①) |
| 04 | **EXEMPT** — 등차중항·등비중항이 수치 관계로 충분 | **EXEMPT** — 두 연립방정식의 인수분해만 수행 | a=−8,b=4,ab=−32(③) |
| 05 | **EXEMPT** — 사분면과 tan 값이 텍스트에 명시됨 | **EXEMPT** — 각 변환식을 적용하고 cosθ만 부호 판단 | cosθ=−12/13, 계산값−12(⑤) |
| 06 | **EXEMPT** — 사인비가 세 변의 비를 직접 제시 | **BENEFICIAL** — 한 각이 둔각인 실제 삼각형에서 코사인법칙 대변 관계를 보여 줌 → `q06-solution.plan.json` | BC:CA:AB=2√3:3:1,cosA=−1/3(②) |
| 07 | **EXEMPT** — 한 주기 내 cos의 두 해만 고르면 충분 | **EXEMPT** — 해의 합을 분수로 정리하면 충분 | x=2π/3,π; p=3,q=5,p+q=8(④) |
| 08 | **EXEMPT** — 원뿔·모선·한 바퀴 경로는 텍스트로 전부 규정 | **BENEFICIAL** — 90° 전개도에서 B와 C를 잇는 직선이 최단경로임을 도식화 → `q08-solution.plan.json` | 중심각=(2π·3)/12=π/2,AC=5,CB=7,2m+n=17(①) |
| 09 | **EXEMPT** — 주기와 점근선 최솟값이 대수적으로 주어짐 | **BENEFICIAL** — 탄젠트 그래프의 주기와 첫 양의 점근선·평가 지점 위치가 유익 → `q09-solution.plan.json` | a=2,b=π/4,tan(π/6)=√3/3(③) |
| 10 | **BENEFICIAL** — 원·현·호·BD:CD를 동시에 읽어야 하므로 내접 배치와 넓이 영역의 강조가 유익 → `q10-problem.plan.json` | **BENEFICIAL** — BD와 CD의 길이 및 ∠BDC를 연결하는 해설 도형이 유익 → `q10-solution.plan.json` | R=4,BC=2√7,BD=2√14,CD=√14,cosD=3/4,S=7√7/2,4S²=343(⑤) |
| 11 | **EXEMPT** — 수열 제4항과 합만 수식으로 제시 | **EXEMPT** — 공차와 합 공식의 연립 계산으로 완료 | a₁=9,d=3,a₆=24(②) |
| 12 | **EXEMPT** — 1+⋯+n의 역수꼴만 주어짐 | **EXEMPT** — 부분분수 망원합을 식으로 정확히 표현 가능 | ∑₁ⁿ6/[k(k+1)]=6n/(n+1)(④) |
| 13 | **EXEMPT** — 등비수열 지수 관계만 제시 | **EXEMPT** — 로그의 지수법칙으로 산출 | a₆=2^(32/5),5log₂a₆=32(①) |
| 14 | **EXEMPT** — 이중합의 선형성만 묻는 조건 | **EXEMPT** — 두 유한합을 5배 하는 수식으로 충분 | 5(62−45)=85(③) |
| 15 | **EXEMPT** — 2ᵏaₖ의 부분합 등식으로 완결 | **EXEMPT** — 인접 부분합 차이로 a₁=5, n≥2에서 5/2 | 5+14·5/2=40(⑤) |
| 16 | **EXEMPT** — 복리 적립 주기·금액·기간이 문장으로 명확 | **EXEMPT** — 등비급수의 첫항과 공비 산술로 충분 | 80·1.05·(1.63−1)/0.05=1058.4→1058(②) |
| 17 | **EXEMPT** — 귀납법 빈칸 문장과 부등식만 사용 | **EXEMPT** — (가)=2ᵏ−1,(나)=(k+1)² 대입으로 충분 | f(6)/g(6)=63/49=9/7(④) |
| 18 | **EXEMPT** — 2n/2n+1 점화식 자체가 정확 | **EXEMPT** — 이진 인덱스 블록 합을 대수로 누적 | a₁=3;∑₁³¹aₙ=3(1+3+9+27+81)=363(①) |
| 19 | **EXEMPT** — 두 등비수열 정의가 모두 식으로 주어짐 | **EXEMPT** — T₂²=T₁T₃ 연립으로 공비 결정 | r=1/2,p=−48,a₇=−3/8,pa₇=18(③) |
| 20 | **EXEMPT** — 절댓값 사인식의 주기·범위를 직접 구하는 발문 | **BENEFICIAL** — 절댓값 사인의 접힌 꼭짓점과 반주기를 곡선으로 보여 주면 도움 → `q20-solution.plan.json` | 주기π/3, 최대2, 최소−2(서술형) |
| 21 | **EXEMPT** — 등비수열 두 부분합이 수치로 주어짐 | **EXEMPT** — r⁴=3에서 합을 식으로 연산 | S₁₆=5(1+3+9+27)=200 |
| 22 | **EXEMPT** — 등차수열의 제k항은 ka로 직접 지정됨 | **EXEMPT** — 유리화 후 연쇄 소거만 필요 | (√25−√1)/√a=4/√a=2√5/5→a=20 |
| 23 | **EXEMPT** — 등차·등비수열 정수성 및 부호 조건이 대수적 | **EXEMPT** — m의 후보를 소거한 뒤 절댓값 합 계산 | m=−3,b₄=−2,k=6,a₇=−5,b₇=54,합49 |

**축 합계 재검산:** 문제축 23/23, 해설축 23/23, BENEFICIAL 7축→실행형 plan 정확히 7개, EXEMPT 39축→placeholder plan 0개.

## 원본/변형/기능 공백/원문 충돌 구분

- **ORIGINAL_EXAM_PNG_CONFLICT:** 기출 q08 원뿔 밑면 반지름 5·모선 15·경로 21 → 현행 3·12·13; 기출 q10 외접원 반지름 3·BC=2√5·BD=3CD → 현행 4·2√7·BD=2CD; 기출 q20 `3|sin 2x|−1`와 '그래프를 그리라'는 요구 → 현행 `4|sin 3x|−2`의 주기·최댓값·최솟값만 요구. q02 BC 5→6, q06 변의 사인비 `2√2:2:1`→`2√3:3:1`, q09 탄젠트 주기 π/3→π/2 및 평가점 변화도 원본과 혼동하지 않았다.
- **ORIGINAL_EXAM_SVG_VARIANT_CONFLICT:** 해당 기출/유사 자산 폴더의 `-vN` 변형본은 검색 결과 0개. 기출 해설 SVG(q02·06·08·09·10·20)는 과거 수치의 참고 배치로만 취급했다.
- **레거시 검산·교정:** `_유사_plans/q10-problem.plan.json`의 원 반지름 10 및 B·C·D의 근사 극좌표는 현행 R=4, BC=2√7, BD:CD=2:1을 만족하지 않음. 공식 q10-problem은 O=(0,0), B=(4,0), C=(1/2,3√7/2), D=(−3,√7), A=(2√2,2√2)의 **엄밀 좌표**로 새로 교정했다. O에서의 거리 네 개가 모두 4, BC²=28, BD²=56, CD²=14이고 A가 놓인 호와 D가 놓인 호가 달라 ∠CAB이 둔각이다. 문제축에는 넓이 정답이나 CD 실측치를 노출하지 않고 BD:CD를 `2t:t`로 표기. 해설축만 BD=2√14, CD=√14와 각 관계를 표시.
- **CONTENT_CONFLICT_SOURCE:** 현행 23문항의 발문·선택지·정답·해설에서 독립 계산으로 확인한 별도 수학적 자기모순 0건. 문항의 `category` 등 분류 메타데이터는 문제 수학을 바꾸지 않으며 범위 밖 JS 파일은 수정하지 않음.
- **ENGINE_CAPABILITY_PENDING:** 신규 확인된 미지원 기능 **0건**. q08은 공식 엔진의 원·사분원 호 및 직각·길이 표식으로 만든 전개도이지 비공식 SVG나 임의 근사 도식이 아니다.

## 실행형 공식 JSON plan별 독립 검증

| 공식 JSON | JSON 파싱·Schema/엔진 계약 | Shallow lint | Full lint | STATIC_FIELD_PARITY | DRAWN_FEATURE_PARITY (정적) | 실제 SVG·시각 |
| --- | --- | --- | --- | --- | --- | --- |
| `q02-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q06-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q08-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q09-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q10-problem.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q10-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |
| `q20-solution.plan.json` | PASS | PASS | PASS | PASS | PASS (정적) | **RENDER_NOT_RUN / VISUAL_NOT_RUN** |

- **JSON parse·Schema·계약 / Shallow / Full:** 7/7 PASS. 공식 `plan-lint.cjs`에서 두 검사 모드로 재실행했으며, 원문 `sourceConditions`는 JS 발문 그대로 연결했다.
- **STATIC_FIELD_PARITY 7/7 PASS:** 문제축 q10의 caption·accessibilityDescription·sourceConditions·newVisualInformation에 답·풀이 중간 수치 없음. 해설축 q02·06·08·09·10·20의 원문·정답 관계 개별 확인.
- **DRAWN_FEATURE_PARITY 7/7 정적 PASS:** q02 두 각과 BC, q06 세 변 비, q08 실제 사분원 호·반지름·직각·직선 경로 및 CE=7, q09 탄젠트 곡선·점근선, q10 원 위 네 점·현 길이·비례 표식·내부 영역, q20 절댓값 사인의 cusp와 주기 정보를 실제 엔진 필드에 지정했다. 캡션 기입만으로 인정하지 않았다. **실제 SVG 픽셀 검수 PASS와는 다름.**
- **독립 SymPy 수학 검산:** q02 BC6·AC2√6·cosA1/2; q06 변 길이 2√3,3,1과 cosA−1/3; q10 원 위 네 점·거리와 cos∠BDC=3/4·4S²=343을 검증. q08 12²+5²=13² 및 12·(π/2)=6π, q09 탄젠트 점근선, q20 절댓값 반주기 역시 원문에서 따로 확인.
- **Chromium 새 실행 확인:** `/usr/bin/chromium` 런처 존재, `/usr/lib/chromium/chromium` 실제 바이너리 없음; `chromium --version` exit **127**. 공식 실제 SVG 렌더 **0/7**, **RENDER_NOT_RUN 7/7**. PNG 실물·390px 모바일·A4 시각검수 **NOT_RUN**. 정적 PASS로 승격하지 않음.
