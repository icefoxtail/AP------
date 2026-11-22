# 22_매산고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 원본 이미지 실물 렌더 검수 (2026-11-22)

> 문서 전용(engine handoff). JS·원본 SVG/PNG·학생 UI·엔진 코드 미수정. `KEEP_MATH`는 브라우저/출고 PASS가 아니다.

## 원본·검수 범위

- `archive/exams/original/high/h2/1final/22_매산고_1학기_기말_고2_수학I.js` (Git blob `96e02a74e83419a9e9bf56be484f8bff85c42e84`), **21문항**, 브랜치 `work/solution-upgrade-lane-30-20261121`.
- 발문·보기·해설·정답 계산/범위/분기 전수 대조: **KEEP_MATH 21 / HOLD_MATH 0**.
- 실사용 **11개(PNG 3, SVG 8)**; PNG 원본 디코드, SVG→PNG(Inkscape) 렌더 **11/11 성공**, 육안으로 접원·내접원·도형과 그래프 검토. 같은 폴더의 `q16-solution.svg`, `q19-solution.svg`는 미참조 이전 판본이므로 참조 집계 제외.
- HTML 표제 출력 확인 예약 **Q15, Q17~Q21(6문항)**. 브라우저/모바일/MathJax/preflight/CI/ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 대장 (21/21)

| Q | 발문 식별 | 원본 정답 | 결정식·경계 검증 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | AB4, BC5, B30° 면적 | ① | (1/2)·4·5·sin30°=5. | q1-solution.svg | KEEP_MATH |
| 02 | a4,b5,c6, cosA | ③ | (5²+6²−4²)/(2·5·6)=3/4. | q2-solution.svg | KEEP_MATH |
| 03 | a1=28,d=−3 첫 음수 | ③ | an=31−3n<0 최초 n=11; a10=1,a11=−2. | 없음 | KEEP_MATH |
| 04 | Σa=3, Σa²=6, Σ(2a−3)² | ③ | 4·6−12·3+9·10=78. | 없음 | KEEP_MATH |
| 05 | a,8,12,b 등차; a,x,y,b 등비 | ④ | 공차4→a=4,b=16; xy=ab=64. | 없음 | KEEP_MATH |
| 06 | a1=256, r=1/2, an=32 | ③ | 2⁸·(1/2)^(n−1)=2⁵→n=4. | 없음 | KEEP_MATH |
| 07 | A30°, a2√2,b4, C둔각 | ② | sinB=√2/2, B=45° 또는135°; C둔각에 맞는 B45°→C105°. | q7-solution.svg | KEEP_MATH |
| 08 | 이중합 Σk Σi 2i=440 | ① | Σk k(k+1)=n(n+1)(n+2)/3=440 →n=10. | 없음 | KEEP_MATH |
| 09 | −8/5와46/5 사이 26수 등차 | ⑤ | 28항·27간격→d=2/5; 짝수 삽입항 13개 합52. | 없음 | KEEP_MATH |
| 10 | 9,11,99,101,… 첫40항 합 | ④ | 20쌍 (10ʲ−1)+(10ʲ+1)=2·10ʲ; 합20(10²⁰−1)/9. | 없음 | KEEP_MATH |
| 11 | 정삼각형 한변4, P∈AC 최소 | ⑤ | AP=x∈[0,4], BP²+CP²=2(x−3)²+14, 최소14. | q11-solution.svg | KEEP_MATH |
| 12 | Sn=n²+n, a5−a6+⋯+a111−a112 | ② | an=2n, 연속 두 항 차=−2, 54쌍→−108. | 없음 | KEEP_MATH |
| 13 | 지수함수 항 일반항 귀납식 빈칸 | ④ | f(m)=2^[m(m+1)], g(m)=2^(2m+2); f(5)/g(10)=2³⁰/2²²=256. | 없음 | KEEP_MATH |
| 14 | Pn on y=x², M은 PnQn 2:1 내분 | ③ | 새 높이 y/3이므로 aₙ₊₁²=aₙ²/3; S10=(3/2)(1−3⁻¹⁰), 2S=3−3⁻⁹. | q14-solution.svg | KEEP_MATH |
| 15 | 다른 공차 두 AP, Sn²−Tn²=n²(n−7) | ① | 다항식 계수비교 v=1/4, u=−3/4, w=11/4; a16=7,b16=−5 →(a−b)(a+b)=24. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 16 | 반지름2 원 C1~C5 다섯 접원 | ② | C2~C5 중심 간 수평거리4, C1은 C4/C5 중심과 정삼각형; ∠C60°, tanB=√3/5, BC/AB=3/√7; 면적 (3√3/4)k². | q16.png, q16-solution-v2.svg | KEEP_MATH |
| 17 | an=3·2^(n−1), 첫항×공비 | 6 | a1=3,r=2 →6. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 18 | 1,1/(1+2),… 첫12항 합 | 24/13 | ak=2/[k(k+1)], 망원합 2(1−1/13)=24/13. | 없음 | KEEP_MATH / UI_TAG_CHECK |
| 19 | 내접사각형 AB=AD, AC10, 넓이40 | 13 | OA는 BD의 수직이등분선, A/C의 수평거리 R−xC=50/R; 40=BD·25/R→BD:R=8:5, 합13. | q19.png, q19-solution-v2.svg | KEEP_MATH / UI_TAG_CHECK |
| 20 | 호수 원의 세 측정점 AB10,AC8,A60° | (1)2√21m (2)2√7m (3)28π㎡ | 코사인 BC²=84; R=BC/(2sin60°)=2√7; 원넓이28π. | q20.png, q20-solution.svg | KEEP_MATH / UI_TAG_CHECK |
| 21 | 3의 배수면 −4, 아니면 +1; 최대 Sn=98 | 132 | 초기 13에서 11항 13,14,15,11,12,8,9,5,6,2,3 합98; 잔여는 비양수. 다른 초항의 residue class 경계 비교로 유일; a4a5=11·12=132. | 없음 | KEEP_MATH / UI_TAG_CHECK |

## 현재 참조 이미지 검수 (11/11)

모든 파일 경로는 `archive/assets/images/22_매산고_1학기_기말_고2_수학I/` 아래. Git blob SHA를 고정했다. PNG 원본 디코드, SVG Inkscape→PNG 렌더; Q14 세로 2단계 그림과 Q16 최신 v2를 원본 크기로 확대 확인했다.

| Q | 참조 | 파일 | Git blob SHA | 실물 판정 |
|---:|---|---|---|---|
| 01 | solutionImage | q1-solution.svg | a0719ad998881e1792765a6f0aafb3cc53fa65b6 | 삼각형 끼인각30° 정상 |
| 02 | solutionImage | q2-solution.svg | d367135aac712c584a7e89bb1d0f5180b0bd530a | 세 변 4/5/6 정상 |
| 07 | solutionImage | q7-solution.svg | 5c1dbbd805f8fbda5fb0123fa03f81a747bbea1b | 사인법칙 보조도형 정상 |
| 11 | solutionImage | q11-solution.svg | 69c76a74977e924aebe4295488010de616731bfb | 정삼각형·P 위치 정상 |
| 14 | solutionImage | q14-solution.svg | fba908e43305e005723e6485788b4e6429cd4175 | 두 단계 y=x²·M/Q/P 라벨 확대 판독 |
| 16 | 발문 HTML 이미지 | q16.png | 77236c9d88a8735fdf6be049a20c7a2a4a7b40af | 원 다섯 개 접선 스캔 판독 |
| 16 | solutionImage | q16-solution-v2.svg | a412abfba65bfa1ca915fc0ea4032f2f9194181b | 최신 v2 원 중심·접선 렌더 |
| 19 | 발문 HTML 이미지 | q19.png | c4ed9457482e1c2243a135cc7abc9750491bc218 | 내접사각형 스캔 판독 |
| 19 | solutionImage | q19-solution-v2.svg | bfcf0266cb4ddd787ed88fa354e5bb31dac75252 | 최신 v2 수직이등분선 확인 |
| 20 | 발문 HTML 이미지 | q20.png | 5d535e6e913454fa53dc60fc28c64dada773678a | 호수 원·AB/AC/각도 스캔 판독 |
| 20 | solutionImage | q20-solution.svg | 39a40f1fad4bd61270b0c71db5e7fcd4f36301d5 | 외접원·반지름 도식 렌더 |

## 엔진 인계

- **Q15 및 Q17~Q21 `UI_TAG_CHECK`:** 원문에 `<보기>`, `<단답형 1/2/3>`, `<서술형 1/2>`라는 비표준 HTML 태그가 존재한다. 브라우저에서 문자 표제가 소실되는지, 태그 범위가 뒤 문단을 감싸는지 확인. 이 회차에서 JS는 수정하지 않았다.
- **Q16/Q19:** 화면의 `solutionImage`는 `q16-solution-v2.svg`, `q19-solution-v2.svg`다. 폴더에 남아 있는 이전 시안을 현행 이미지 결함으로 중복 계수하지 말 것.
- Q16 복잡한 접원 도식은 반지름·접점·순서를 모두 유지해야 한다. 이 회차 정지 이미지에서 확정된 새 시각 결함 없음; UI·배포 테스트는 `NOT_RUN`.
