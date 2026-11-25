# 고2 기하 유형은행 151–154 — 문제 그림 plan 인계 (2026-11-26 KST)

## 범위·근거

- 기준 `main` 원본: `c371cb077515b6ac5f58585b1bda0846d079b9bf`. 앞 배치 기하 147–150은 PR #3044 병합 완료. 본 배치의 원본 JS는 **수정하지 않음**.
- 다음 네 유형군의 실제 `content` `[그림:]` 슬롯 26문항을 문항 id 기준으로 확인: 151 q01–q05 (5), 152 q02–q06 (5; q01은 슬롯 없음), 153 q01–q06 (6), 154 q01–q10 (10).
- 원본 JS Git blob: `151=9b19555d557f19148b87d983dac788fac850f145`, `152=0772d53a625abcf9f67127e6392e65fc02d04d1a`, `153=34f5240b809b6abe88009ee70c2d08f75afe0532`, `154=3648cff1f45adfdfef4428fc0ad4f2b34792a3f9`.
- 다음 유형군(미작성): **기하 155**. 기하 전체 완료 전 미적분Ⅱ로 이동하지 않음.
- 기존 `production/plans/<원본 JS stem>/qNN-problem.plan.json` 규칙 그대로, 총 23개 신규 실행 plan. 판정만 있는 JSON·가짜 이미지 참조 없음. 시험지·교과서·원본 JS·기존 계획·엔진 수정 없음.

## 검증 결과

- 공식 `node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs --shallow <23 files>`: **23 OK / 0 FAIL / 0 SKIP**.
- 공식 `plan-lint.cjs <23 files>` full: **23 OK / 0 FAIL / 0 SKIP**. 입체 모델·표식의 계약 검사는 실행됐으나, 이 검사만으로 PNG 배치·겹침을 검증할 수 없음.
- 별도 정확도 검사: 26개 원문 그림 슬롯 식별, 실행 JSON 23개, 각 `sourceConditions[].mappedTo` **210개 실제 필드 경로 유효**; 독립 거리 라벨 **53개**, 3차원 직각 표식 **37개**, 수선 발 **11개** 재계산. 일부 문항의 면적·무게중심·직교 평면·등거리 조건도 별도 확인.
- 원문-실제 그려지는 필드의 `DRAWN_FEATURE_PARITY`: **20 PASS / 6 ENGINE_CAPABILITY_PENDING**. **lint 23건 PASS와 실물 그림 완성 20건은 다른 지표**임.
- 공식 SVG 생성 / PNG 눈검수 / 학생 390px / A4 / JS `image` 연결 / 배포: 전부 **NOT_RUN · SVG_TO_CREATE**. 해당 실물 검수는 Antigravity 후속 담당.

아래 경로 칸의 `151/` 같은 단축어는 다음 정확한 디렉터리의 별칭이다.

| 별칭 | 원본 stem (저장 위치: `archive/tools/geometry-equation/production/plans/`) |
| --- | --- |
| 151 | `기하_151_삼수선의정리2_고2_유형은행1` |
| 152 | `기하_152_삼수선의정리의활용-삼각형의넓이_고2_유형은행1` |
| 153 | `기하_153_삼수선의정리의활용-여러가지도형_고2_유형은행1` |
| 154 | `기하_154_삼수선의정리의활용-서로직교하는세선분_고2_유형은행1` |

## 문항별 원문 ↔ 실제 JSON 필드 대조

| 파일/qid | 축 | 원문 핵심과 실제 렌더 필드 | capability | plan 경로(위 별칭) | shallow/full | DRAWN_FEATURE_PARITY |
| --- | --- | --- | --- | --- | --- | --- |
| 151/q01 | 문제 | AB10·PA=PB13·PH8=`dims[0..3]`; 평면 α·직선 l=`space.planes/lines`; PH 수직 호=`marks.rightAngles[0]` | `solid-figure-v1` | `151/q01-problem.plan.json` | PASS/PASS | PASS |
| 151/q02 | 문제 | AB10·PH6=`dims`; ABC 실제 넓이45와 무게중심 H=`space.points`; PH·PQ 수선=`segments/marks` | 동일 | `151/q02-problem.plan.json` | PASS/PASS | PASS |
| 151/q03 | 문제 | AB15·AC20·PA5=`dims`; A 직각·AH⊥BC·PH⊥BC=`marks` 및 `segments` | 동일 | `151/q03-problem.plan.json` | PASS/PASS | PASS |
| 151/q04 | 문제 | 정삼각형 ABC·PA6·Q∈BC·PQ=`space.points/segments`; 변6은 실제 길이만, 문자 정답 미노출 | 동일 | `151/q04-problem.plan.json` | PASS/PASS | PASS |
| 151/q05 | 문제 | AD6·DB4·DC4√3=`dims`; D에서 세 직각=`marks.rightAngles[0..2]`; BC 위 대표 P·AP/DP=`space` | 동일 | `151/q05-problem.plan.json` | PASS/PASS | PASS |
| 152/q02 | 문제 | 직교 α·β와 교선 l=`space.planes/lines`; AB=3√7·거리6·8=`dims`; 삼각형 PAB=`segments` | 동일 | `152/q02-problem.plan.json` | PASS/PASS | PASS |
| 152/q03 | 문제 | BC4·CD5=`dims`; AB⊥BC·AD⊥BD/CD=`rightAngles`; ∠ACB=45°=`angles[0]` | 동일 | `152/q03-problem.plan.json` | PASS/PASS | PASS |
| 152/q04 | 문제 | AB8·PH6=`dims`, ABH 실제 넓이28; PH⊥α·PQ⊥AB=`rightAngles`, HQ=`segments` | 동일 | `152/q04-problem.plan.json` | PASS/PASS | PASS |
| 152/q05 | 문제 | ∠ACB=90°·AB12·CD3=`marks/dims`; △ABD 실제 넓이30인 정확 좌표 모델, 값은 미노출 | 동일 | `152/q05-problem.plan.json` | PASS/PASS | PASS |
| 152/q06 | 문제 | α⊥β·l∥m∥n=`space.planes/lines`; AP3·PQ8·QB6=`dims`; AB=AC 눈금=`marks.equalLengths[0]` | 동일 | `152/q06-problem.plan.json` | PASS/PASS | PASS |
| 153/q01 | 문제 | 정삼각기둥 변8·AD4=`solids/dims`; AC 중점 M=`solids.points[0]`; MH⊥EF=`points[1]/segments/mark` | 동일 | `153/q01-problem.plan.json` | PASS/PASS | PASS |
| 153/q02 | 문제 | AB2·AC4·AD3=`dims`; ∠EDF=120°=`marks.angles[0]`; A에서 EF의 발 H=`points[0]/segments/mark` | 동일 | `153/q02-problem.plan.json` | PASS/PASS | PASS |
| 153/q03 | 문제 | 접은 두 삼각형의 진짜 수직 좌표·네 변4=`space.planes/segments/dims`; **90° 이면각 호 자체는 없음** | 동일 | `153/q03-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING** |
| 153/q04 | 문제 | AP7·PQ5·∠APQ90 및 평면 위 원환 영역 회전 궤적을 한 3D 플랜에서 동시에 표시 불가 | 미지원: 3D locus/annulus | **없음** | — / — | **ENGINE_CAPABILITY_PENDING** |
| 153/q05 | 문제 | 구 지름 AB7, 구면 위 C, 외부 직선 l·D와 수선·거리8·5를 같은 3D 좌표에 고정할 지원 없음 | 미지원: sphere/space overlay | **없음** | — / — | **ENGINE_CAPABILITY_PENDING** |
| 153/q06 | 문제 | 원기둥 지름4·높이5와 상하 밑면 위 서로 60° 회전한 지름 AB·CD 및 △CAB 동시 표현 불가 | 미지원: cylinder rim endpoints | **없음** | — / — | **ENGINE_CAPABILITY_PENDING** |
| 154/q01 | 문제 | EF2·EH4·AE2=`dims`; 밑면 HF와 C에서 HF로 내린 발 K=`points[0]/segments/rightAngle` | `solid-figure-v1` | `154/q01-problem.plan.json` | PASS/PASS | PASS |
| 154/q02 | 문제 | AB3·AD2·AE2=`dims`; 삼각형 CHF=`segments[0..2]`; CM⊥FH=`points[0]/mark` | 동일 | `154/q02-problem.plan.json` | PASS/PASS | PASS |
| 154/q03 | 문제 | CD√5·AD2·AE2=`dims`; 삼각형 DEG=`segments[0..2]`; DP⊥EG=`points[0]/mark` | 동일 | `154/q03-problem.plan.json` | PASS/PASS | PASS |
| 154/q04 | 문제 | OA=OB=OC=2√2=`dims`; 3개 직각 + CH⊥AB=`rightAngles[0..3]`; CAB=`segments` | 동일 | `154/q04-problem.plan.json` | PASS/PASS | PASS |
| 154/q05 | 문제 | 변6·BF 중점 M·FG 1:2 내분 N·△DMN=`dims/points/segments`; **비 1:2의 눈에 보이는 짧은 라벨 없음** | 동일 | `154/q05-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING** |
| 154/q06 | 문제 | 밑변2·높이1=`dims`; EP⊥FH=`rightAngle`; 삼각형 DEP 음영=`highlights[0]` | 동일 | `154/q06-problem.plan.json` | PASS/PASS | PASS |
| 154/q07 | 문제 | AB1·AD2·AE1=`dims`; DI⊥EG·정사영 HI=`points/segments/mark`; ∠DIH `θ`=`angles[0]` | 동일 | `154/q07-problem.plan.json` | PASS/PASS | PASS |
| 154/q08 | 문제 | 변4·EH/HG 중점 P/Q·Q⊥DP=`points/segments/mark`; **원문 이름 없는 발을 R로 라벨링함** | 동일 | `154/q08-problem.plan.json` | PASS/PASS | **ENGINE_CAPABILITY_PENDING** |
| 154/q09 | 문제 | 변4·FG 중점 M·HM·AI 및 EI=`points/segments`; I에서 두 수직표식=`marks` | 동일 | `154/q09-problem.plan.json` | PASS/PASS | PASS |
| 154/q10 | 문제 | 변10·AB 중점 L·HG 중점 M·MN⊥LD=`points[0..2]/segments/mark` | 동일 | `154/q10-problem.plan.json` | PASS/PASS | PASS |

## Antigravity 엔진 후속 요구

1. **153/q03**: 두 면 `ABD`·`CBD`의 90° 이면각을 직접 표시하는 공간 이면각 표식. 지금 두 평면은 정확히 수직이지만 각호는 없다.
2. **153/q04**: 공간에서 길이와 직각이 주어진 회전 선분 `PQ`의 원환 궤적을 평면 α에 그리는 `space`+annulus 결합 capability. 현재는 미작성으로 분모에 포함.
3. **153/q05**: 구면 위 C와 구의 지름 AB 및 공간 선분·직선 D/l를 한 좌표로 결속하는 sphere/space overlay.
4. **153/q06**: 원기둥 양 끝의 지름 AB·CD를 원주점에 고정하고 회전각 60°와 △CAB를 표시하는 rim-point/angle 확장.
5. **154/q05**: `divide 1:2`가 실제 점 위치를 결정하지만 source `[그림]`이 명시하는 `FN:NG=1:2`을 짧은 edge-ratio 라벨로 표시할 수 있어야 함.
6. **154/q08**: 미표기 수선 발의 이름을 감춘 상태로 직각·선분이 유지되는 solid auxiliary-point hideName; 현재 `R`이라는 추가 이름이 나타나므로 source name parity 미완료.

각 기능이 들어간 뒤 **원문 대조 → 공식 재-lint → 실제 SVG/PNG → 390px·A4 검수 → 게시 연결** 순서로 마감한다. 계획이 병합되었다는 이유만으로 학생 화면 품질을 PASS로 간주하지 않는다.
