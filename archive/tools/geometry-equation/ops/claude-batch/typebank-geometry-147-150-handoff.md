# 고2 기하 유형은행 147–150 문제 그림 plan 인계 — 2026-11-25

## 범위와 원문

- 저장소: `icefoxtail/AP------`. 직전 운영 병합: PR #3039(`59fd2b37e07c9fd8d9946029bd014332d1d2ee20`); 새 배치 작업 시작 `main=c6184c85b24492969e94c9ae5a408e53795c9eff`, PR 직전 최신 `main=ff35acd02fe1c725ce70153767b79f16b48c55b6` 재확인 후 이 운영 HEAD 위에 추가. 기하·typebank 관련 열려 있는 PR 중복 검색 결과 없음.
- 원문 `archive/exams/types/high/h2/`: 147 q01–q05(5), 148 q01–q04(4), 149 q01–q06(6), 150 q01–q07(7), 총 **22개** `[그림:]` 문항. 146은 원문 그림 없음. 미적분Ⅱ는 기하를 모두 소진한 뒤 시작한다.
- 원본 JS Git blob: `147=477254c4fede7d26148b1cfad0597701d8475111`, `148=3c9369b4e2215cc6f13e5aef5e7ae592778d1dd5`, `149=06279a4d841850fb968ec8affe6a98fddae1ab83`, `150=e5c54773cca9054c5d1a6762efb917f3b9193c79`.
- 산출물: `archive/tools/geometry-equation/production/plans/<원본 JS의 정확한 stem>/qNN-problem.plan.json` 22개와 이 인계 문서 1개만. 기존 원본 JS·시험지·교과서·엔진 코드 변경 없음.

## QA 및 인계 상태

- **DRAWN_FEATURE_PARITY=PASS 22/22**: `[그림:]` 원문을 모든 `sourceQuote`의 연속 부분 문자열로 확인(긴 출처는 엔진의 200자 제한에 맞춰 60자 인용), 점·선분·입체 꼭짓점·평면·길이·직각·각도·동일 길이 조건은 `sourceConditions` **100개 행**의 `mappedTo` **186개 실제 JSON 경로**로 대조했다. 원문에 없는 정답값은 `dims`에 쓰지 않았다. 원문 조건과 충돌하거나 시각화 엔진에 미지원인 필드 없음: **`ENGINE_CAPABILITY_PENDING=0`**.
- **capability=`solid-figure-v1` 22/22**: 147·148·149는 정다면체/정각기둥/직각기둥/각뿔 모델과, 직각삼각기둥·임의 사면체·증명용 평면은 모델의 `space`를 이용했다. 150 7문항은 `space.planes`, `points`, `lines`, `segments`, `dims`, `marks`로 삼수선 관계를 실좌표로 나타냈다.
- 공식 엔진 `plan-lint.cjs --shallow` **22 OK / 0 FAIL / 0 SKIP**, 동일 공식 `plan-lint.cjs` 전체 검사 **22 OK / 0 FAIL / 0 SKIP**. 기존 엔진과 의존성만 읽기 전용 사용. 외부 SVG 생성, Chrome 조립, 390px/A4 시각 검사, 문항 JS 연결: **NOT_RUN / 안티그래비티 담당**. 따라서 `DRAWN_FEATURE_PARITY=PASS`는 **원문↔plan 필드 parity** 판정이며 최종 SVG 렌더 합격을 뜻하지 않는다.
- 별도 독립 기하 재계산: 147 임의 사면체의 3개 직교 모서리·체적(80), 정육면체의 두 꼬인 대각선 공통수선, 148의 정삼각형 ACH와 수직 증명/대칭점, 149의 6개 직선–평면 각, 150의 7개 거리·직각·각도·면적을 확인했다. 본 22개 원문 해설과의 `SOURCE_MATH_CONFLICT`는 관찰되지 않았다.

## 문항별 도형·표식 parity

모든 행에 공통으로 적용: 축 `PROBLEM_VISUAL`, 판정 `REVIEWED`, capability `solid-figure-v1`, 공식 plan-lint `full PASS`, `DRAWN_FEATURE_PARITY=PASS`, 렌더 `NOT_RUN`.

| 파일/qid | 원문 그림에 대응하는 실제 plan 필드 | 독립 기하 대조 |
|---|---|---|
| 147-q01 | 정사면체 ABCD; BC 중점 M, AD 중점 N, AM·DM·MN | 두 중점/수직 관계, 원문 보기 판단에서 정답 미노출 |
| 147-q02 | 모서리 2√5 정사면체; AB·CD 중점 M,N, 붉은 강조 실선 MN | MN=√10(미표시) |
| 147-q03 | 임의 사면체 ABCD; AD=6, BC=10, 공통수선 MN=8, M·N 직각 표식 2개 | AD⊥BC⊥MN의 쌍별 직교, 부피 80(미표시) |
| 147-q04 | 모서리 4 정육면체; BD·AG 대각선, BD 중점 P, AG 위 발 Q, PQ 및 두 직각 | PQ=2√6/3(미표시) |
| 147-q05 | 모서리 6 정육면체; BD·AG와 공통수선 PQ, 두 직각 | PQ=√6(미표시) |
| 148-q01 | 정사각뿔 P–ABCD; AC·BD의 교점 O, PO | PO⊥밑면, BD⊥AC·PO |
| 148-q02 | 정사면체 ABCD; BC 중점 M, AM·DM | BC⊥AM·DM |
| 148-q03 | 정육면체 ABCD–EFGH; DF와 삼각형 ACH의 세 변 | ACH 정삼각형, DF⊥AC·AH |
| 148-q04 | 평면 α 위 m,n,c, 가로지르는 A·B·C, α에 수직인 l 위 대칭점 P·P′, 6개 연결선 | A,B,C 공선, O가 P,P′의 중점, l⊥α |
| 149-q01 | 밑변 1·높이 √5의 정육각기둥 ABCDEF–GHIJKL, FI | 밑면과 FI 사이 cos=2/3(미표시) |
| 149-q02 | AB=AD=2·AE=1 직육면체, AG | 밑면과 AG 사이 cos=2√2/3(미표시) |
| 149-q03 | EF=4·FG=2·AE=2 직육면체, EF 중점 M과 CM | 밑면과 CM 사이 cos=√6/3(미표시) |
| 149-q04 | 밑변 4 정삼각기둥·높이 2, BC 중점 M과 DM | 밑면과 DM 사이 cos=√3/2(미표시) |
| 149-q05 | AB=1·AC=2·∠BAC=90° 직삼각기둥·높이 1, BF | 평면 ABED와 BF 사이 cos=√3/3(미표시) |
| 149-q06 | 모서리 2 정육면체, AB·AD 중점 M,N, 사각형 MFHN 4변, CG | CG와 MFHN 사이 tan=√2/4(미표시) |
| 150-q01 | 평면 α, AB·O·H·P와 PA·PH·OA, PO=3·OH=4·AH=2√6, 수선 직각 | PA=7(미표시) |
| 150-q02 | 평면 α, AB·O·H·P와 PA·PH, PO=4·PA=6√2·AH=6, 수선 직각 | OH=2√5(미표시) |
| 150-q03 | 평면 α, 직선 l, PA·PH·PO·OH, PA=17·OH=9·AH=8 | OP=12(미표시) |
| 150-q04 | 평면 α, AB/l와 PA·PH·PO·OH, AP=10·AH=8·OH=3 | OP=3√3(미표시) |
| 150-q05 | 평면 α 위 l, A·M과 H·P, PM·PA·PH, AM=4·AP=9·PH=7 | HM=4(미표시) |
| 150-q06 | 평면 α 위 AB·BH, PH·PA·PB, ∠PBA 직각, AB=BH 동길이 눈금, PH=1·PA=7 | △PAB 넓이 5√6(미표시) |
| 150-q07 | 평면 α, AB·O·H·P와 PA·PH·OA, OH=2, ∠PHO=45°·∠PAO=30° 서로 다른 각도 호 | △PAH 넓이 4(미표시) |

## 후속

1. 안티그래비티가 같은 엔진으로 **실제 SVG 렌더**, 보조 선분과 라벨의 가림·겹침, 모바일 390px/A4 인쇄와 문항 연결을 별도 검수. 이번 단계는 plan JSON 제작·lint·필드 parity까지만 승인.
2. 다음 그림 미작성 유형군 **기하 151의 첫 `[그림:]` 문항**부터 시작. 기하 완료 확인 전 미적분Ⅱ로 전환하지 않음.
