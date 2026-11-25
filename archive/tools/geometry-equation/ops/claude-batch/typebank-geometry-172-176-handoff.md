# 기하 유형은행 172–176 문제 그림 정밀 플랜 인계

- 범위: `archive/exams/types/high/h2/` 기하 172~176, JS 5종 총 25문항. 원문·정답·해설은 수정하지 않음.
- 각 plan의 `sourceQuote`는 해당 JS의 실제 `[그림:]` 문자열에서 발췌했고 각 sourceConditions가 실제 그려진 필드/누락된 엔진 capability를 구분한다.
- `ENGINE_CAPABILITY_PENDING`인 원문 핵심 그림은 **아직 그려지지 않았음**. 생성된 기본 입체·단면 모델은 SVG 출고 가능 그림으로 세지 않고, 엔진 기능 확장 후 원문 대조가 필요하다.
- 손 SVG, PNG, JS 이미지 경로, 해설 그림 추가 없음. 면 채움은 소스가 요구하는 경우라도 엔진이 해당 경사 영역을 지원하기 전 임의로 칠하지 않음.

| 파일/qid | 축 | source JS SHA | plan 경로 | capability | 판정 | sourceVsPlan | lint shallow/full | DRAWN_FEATURE_PARITY | 기능 결손 |
|---|---|---|---|---|---|---|---|---|---|
| 172/q01 | 문제 | `08a99dcca5dd` | `archive/tools/geometry-equation/production/plans/기하_172_단면인원의정사영의넓이_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 반구 밑원 A,B, B 경유 45도 경사 절단 원·면 채움 |
| 172/q02 | 문제 | `08a99dcca5dd` | `archive/tools/geometry-equation/production/plans/기하_172_단면인원의정사영의넓이_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 60도 절단원·밑면 경계 통과점·단면 색칠 |
| 172/q03 | 문제 | `08a99dcca5dd` | `archive/tools/geometry-equation/production/plans/기하_172_단면인원의정사영의넓이_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 접평면과 비스듬한 절단평면·원·수선·투영 타원 |
| 172/q04 | 문제 | `08a99dcca5dd` | `archive/tools/geometry-equation/production/plans/기하_172_단면인원의정사영의넓이_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 60도 절단 큰 활꼴 영역, O′와 OO′=2√3 표식 |
| 173/q01 | 문제 | `037e513f6c41` | `archive/tools/geometry-equation/production/plans/기하_173_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 45도 태양광선, 지면 타원 그림자와 지름 16 |
| 173/q02 | 문제 | `037e513f6c41` | `archive/tools/geometry-equation/production/plans/기하_173_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 떠 있는 구, 30도 광선, 그림자 타원과 면적 표시 |
| 173/q03 | 문제 | `037e513f6c41` | `archive/tools/geometry-equation/production/plans/기하_173_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 60도 햇빛과 타원 그림자 |
| 173/q04 | 문제 | `037e513f6c41` | `archive/tools/geometry-equation/production/plans/기하_173_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 173/q05 | 문제 | `037e513f6c41` | `archive/tools/geometry-equation/production/plans/기하_173_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 174/q01 | 문제 | `996257e94027` | `archive/tools/geometry-equation/production/plans/기하_174_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 떠 있는 구의 그림자 타원과 장축:단축 13:5 |
| 174/q02 | 문제 | `996257e94027` | `archive/tools/geometry-equation/production/plans/기하_174_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 떠 있는 구와 투영 타원 장·단축 √3:1 |
| 174/q03 | 문제 | `996257e94027` | `archive/tools/geometry-equation/production/plans/기하_174_태양광선이비스듬히비출때정사영과그림자의_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 원형 관통 구멍·판 기울기·45도 햇빛·그림자 |
| 175/q01 | 문제 | `5e3c2d4fb0c8` | `archive/tools/geometry-equation/production/plans/기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 평면에 놓인 모선 및 수직광 투영 영역 |
| 175/q02 | 문제 | `5e3c2d4fb0c8` | `archive/tools/geometry-equation/production/plans/기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 밑면 투영 타원과 한 모선 α 접촉 |
| 175/q03 | 문제 | `5e3c2d4fb0c8` | `archive/tools/geometry-equation/production/plans/기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 45도 기울인 원기둥의 전체 투영 윤곽 |
| 175/q04 | 문제 | `5e3c2d4fb0c8` | `archive/tools/geometry-equation/production/plans/기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 반구 45도 기울기와 투영 윤곽 |
| 175/q05 | 문제 | `5e3c2d4fb0c8` | `archive/tools/geometry-equation/production/plans/기하_175_기울어진그릇의지면과이루는각크기를이용한_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 평행 원판 2개·30도 축·투영 타원 겹침 |
| 176/q01 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q01-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 176/q02 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q02-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 176/q03 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q03-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 176/q04 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q04-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | ABC 옆면 위의 내접원 |
| 176/q05 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q05-problem.plan.json` | solid-figure-v1 | 작성·대응 | EXACT | PASS/PASS | PASS | — |
| 176/q06 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q06-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | CD 모서리 공유한 두 입체 및 면 ACD 내접원 |
| 176/q07 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q07-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 3개 옆면의 내접원 및 점 P₁P₂P₃ |
| 176/q08 | 문제 | `034601a20823` | `archive/tools/geometry-equation/production/plans/기하_176_정사면체의활용_고2_유형은행1/q08-problem.plan.json` | solid-figure-v1 | 부분 작성·보류 | PARTIAL | PASS/PASS | ENGINE_CAPABILITY_PENDING | 정사면체와 구의 동일 중심 배치 및 반지름 |

## 원문 그림 특징 ↔ 실제 plan 필드 1:1 매핑

오른쪽이 `ENGINE_CAPABILITY_PENDING:*`이면 해당 특징을 그렸다는 뜻이 **아니며**, 추가 엔진 개발이 필요한 원문 요소이다. 필드 경로는 각 JSON의 실제 배열·속성을 가리킨다.

### 172/q01 — ENGINE_CAPABILITY_PENDING
- `c1` 반구 반지름 6, 밑면의 중심 O → `solids[0];dims[0]`
- `c2` 지름 양 끝 A,B, B를 지나는 경사 45도 절단평면 → `ENGINE_CAPABILITY_PENDING:HEMISPHERE_OBLIQUE_CUT_RIM_POINTS`
- `c3` 경사 평면 위 원형 단면 색칠 → `ENGINE_CAPABILITY_PENDING:HEMISPHERE_OBLIQUE_SECTION_FILL`

### 172/q02 — ENGINE_CAPABILITY_PENDING
- `c1` 반구 반지름 a: 기호 a를 붙인 동형 대표 반구(반지름 3) → `solids[0].radius;dims[0]`
- `c2` 밑원 경계 한 점을 지나는 60도 경사 절단 → `ENGINE_CAPABILITY_PENDING:HEMISPHERE_OBLIQUE_CUT`

### 172/q03 — ENGINE_CAPABILITY_PENDING
- `c1` 반지름 5인 구 S, 중심 O → `solids[0];dims[0]`
- `c2` 구와 평면 α 접함 → `ENGINE_CAPABILITY_PENDING:TANGENT_PLANE_TO_SPHERE`
- `c3` β 평면의 절단원 C, 수선발 O′, OO′=√10 → `ENGINE_CAPABILITY_PENDING:OBLIQUE_SPHERE_SECTION_FOOT`
- `c4` 절단원 C의 α 평면 정사영 타원 넓이 9π → `ENGINE_CAPABILITY_PENDING:SECTION_PROJECTION_ELLIPSE`

### 172/q04 — ENGINE_CAPABILITY_PENDING
- `c1` 반구 반지름 2√5 → `solids[0].radius`
- `c2` β가 α와 60도, O에서 β로 내린 수선의 발 O′, OO′=2√3 → `ENGINE_CAPABILITY_PENDING:OBLIQUE_SECTION_FOOT`
- `c3` 반구와 β가 만드는 중심 O′ 포함 큰 활꼴 단면 색칠 → `ENGINE_CAPABILITY_PENDING:SPHERICAL_SEGMENT_SECTION`

### 173/q01 — ENGINE_CAPABILITY_PENDING
- `c1` 지름 16인 공은 반지름 8 구 → `solids[0].radius`
- `c2` 태양광선과 지면의 각 45도 → `ENGINE_CAPABILITY_PENDING:SUN_RAYS`
- `c3` 지면 위의 공의 타원 그림자 → `ENGINE_CAPABILITY_PENDING:SPHERE_CAST_ELLIPSE`

### 173/q02 — ENGINE_CAPABILITY_PENDING
- `c1` 공중에 떠 있는 구: 반지름·고도 미제공, 3은 미지 답과 독립인 대표 모형 → `solids[0].radius`
- `c2` 태양광선 30도, 지면에서 구가 떠 있음 → `ENGINE_CAPABILITY_PENDING:FLOATING_SPHERE_AND_RAYS`
- `c3` 그림자의 넓이 24π인 타원 → `ENGINE_CAPABILITY_PENDING:SPHERE_CAST_ELLIPSE`

### 173/q03 — ENGINE_CAPABILITY_PENDING
- `c1` 농구공 반지름 9 → `solids[0].radius;dims[0]`
- `c2` 지면과 햇빛 각 60도 → `ENGINE_CAPABILITY_PENDING:SUN_RAYS_ANGLE`
- `c3` 지면 위 타원 그림자 → `ENGINE_CAPABILITY_PENDING:SPHERE_CAST_ELLIPSE`

### 173/q04 — PASS
- `c1` 막대 길이 4√3 → `space.points[O,P];dims[0]`
- `c2` 막대가 그림자 방향 왼쪽 위로 지면과 30도 → `space.segments[0];marks.angles[0]`
- `c3` 오른쪽 위에서 왼쪽 아래 평행 태양광선과 지면 각 30도 → `space.segments[1,3];marks.angles[1]`
- `c4` 막대와 광선·그림자는 동일 수직 평면 → `space.points;space.segments[2]`

### 173/q05 — PASS
- `c1` 차광막은 지면 O에서 태양 방향인 오른쪽 위로 30도 → `space.segments[0];marks.angles[0]`
- `c2` 햇빛은 오른쪽 위에서 왼쪽 아래, 지면과 60도 → `space.segments[1,3];marks.angles[1]`
- `c3` 차광막 아래의 그림자 → `space.segments[2]`
- `c4` 차광막의 실제 면적 12는 발문 수치로 측면 선분 길이는 임의 비례 모형 → `caption`

### 174/q01 — ENGINE_CAPABILITY_PENDING
- `c1` 수직 가로등 높이 10m → `space.segments[0];dims[0]`
- `c2` 평행 태양광선으로 생기는 가로등 그림자 → `space.segments[1..2]`
- `c3` 떠 있는 구의 타원 그림자, 장·단축 비 13:5 → `ENGINE_CAPABILITY_PENDING:FLOATING_SPHERE_SHADOW_ELLIPSE`

### 174/q02 — ENGINE_CAPABILITY_PENDING
- `c1` 깃대 그림자 길이 8m → `space.segments[2];dims[0]`
- `c2` 지면 수직 깃대 및 비스듬한 태양광선 → `space.segments[0..1]`
- `c3` 떠 있는 구의 그림자 타원 장축:단축=√3:1 → `ENGINE_CAPABILITY_PENDING:SPHERE_SHADOW_AXIS_RATIO`

### 174/q03 — ENGINE_CAPABILITY_PENDING
- `c1` 판 가로 6 세로 5의 초기 수직 직사각형 → `space.points;space.segments;dims`
- `c2` 판 중앙에 반지름 2의 원형 구멍 → `ENGINE_CAPABILITY_PENDING:PERFORATED_PLANE_CIRCLE`
- `c3` 판은 햇빛 45도 아래 그림자 방향으로 기울일 수 있음 → `ENGINE_CAPABILITY_PENDING:TILTED_BOARD_AND_SHADOW`

### 175/q01 — ENGINE_CAPABILITY_PENDING
- `c1` 원뿔 반지름 √3, 높이 √6 → `solids[0]`
- `c2` 원뿔의 모선 하나가 평면 α 위에 놓인 기울기 → `ENGINE_CAPABILITY_PENDING:TILTED_CONE_GENERATRIX_ON_PLANE`
- `c3` α에 수직인 태양광선과 원뿔의 정사영 → `ENGINE_CAPABILITY_PENDING:CONE_ORTHOGRAPHIC_SHADOW`

### 175/q02 — ENGINE_CAPABILITY_PENDING
- `c1` 원뿔 반지름 3 높이 4 → `solids[0];dims`
- `c2` 한 모선이 α에 포함되도록 기울어진 배치 → `ENGINE_CAPABILITY_PENDING:TILTED_CONE`
- `c3` α에 수직인 빛이 밑면을 투영 → `ENGINE_CAPABILITY_PENDING:BASE_CIRCLE_SHADOW`

### 175/q03 — ENGINE_CAPABILITY_PENDING
- `c1` 원기둥 반지름 2 높이 3√2 → `solids[0];dims`
- `c2` 원기둥 축과 α가 45도 → `ENGINE_CAPABILITY_PENDING:TILTED_CYLINDER_45`
- `c3` α에 수직인 햇빛, 원기둥 전체 그림자 → `ENGINE_CAPABILITY_PENDING:CYLINDER_SHADOW`

### 175/q04 — ENGINE_CAPABILITY_PENDING
- `c1` 반지름 3인 반구 → `solids[0];dims`
- `c2` 밑면이 속한 평면과 α의 이면각 45도 → `ENGINE_CAPABILITY_PENDING:TILTED_HEMISPHERE_BASE`
- `c3` α 위로의 정사영 도형 → `ENGINE_CAPABILITY_PENDING:HEMISPHERE_OBLIQUE_PROJECTION`

### 175/q05 — ENGINE_CAPABILITY_PENDING
- `c1` 반지름 2인 두 평행 원판, 중심 간 거리 2 → `ENGINE_CAPABILITY_PENDING:TWO_TILTED_CIRCULAR_DISCS`
- `c2` 두 중심을 지나는 l이 α와 30도이고 각 원판에 수직 → `ENGINE_CAPABILITY_PENDING:DISC_AXIS_PLANE_ANGLE`
- `c3` 수직 햇빛이 만든 두 타원 그림자의 합집합 → `ENGINE_CAPABILITY_PENDING:TWO_ELLIPSE_SHADOW_UNION`

### 176/q01 — PASS
- `c1` 정사면체 ABCD 모든 모서리 길이 6 → `solids[0];dims[0]`
- `c2` M은 AD의 중점 → `solids[0].points[0]`
- `c3` 삼각형 BCM → `segments`

### 176/q02 — PASS
- `c1` 모든 모서리 길이가 6인 정사면체 ABCD → `solids[0];dims[0]`
- `c2` 삼각형 ABC 및 바닥 BCD → `solids[0].names;solids[0].faces`

### 176/q03 — PASS
- `c1` 정사면체 ABCD 모서리 길이 6 → `solids[0];dims[0]`
- `c2` H는 A의 면 BCD 위 정사영, BCD 무게중심 → `solids[0].points[0];segments[0]`
- `c3` 밑면 삼각형 CDH → `segments[1..2];solids[0].faces`

### 176/q04 — ENGINE_CAPABILITY_PENDING
- `c1` 정사면체 ABCD 한 모서리 6 → `solids[0];dims[0]`
- `c2` 삼각형 ABC의 내접원 → `ENGINE_CAPABILITY_PENDING:TETRAHEDRON_FACE_INCIRCLE`

### 176/q05 — PASS
- `c1` 정사면체 ABCD 모서리 길이 6 → `solids[0];dims[0]`
- `c2` P는 CD 중점 → `solids[0].points[0]`
- `c3` Q는 AC의 A쪽 2:1 내분점 → `solids[0].points[1]`
- `c4` R은 AD의 A쪽 1:2 내분점 → `solids[0].points[2]`
- `c5` 삼각형 PQR → `segments`

### 176/q06 — ENGINE_CAPABILITY_PENDING
- `c1` 정사면체 ABCD의 모서리 CD 길이 √6 → `solids[0].side;dims[0]`
- `c2` 정육면체 CDEF-GHIJ와 CD를 공유, α 위에 놓임 → `ENGINE_CAPABILITY_PENDING:TETRAHEDRON_CUBE_EDGE_JOIN`
- `c3` 면 ACD에 내접하는 원, 그 원의 평면 HGCD 정사영 → `ENGINE_CAPABILITY_PENDING:FACE_INCIRCLE_PROJECTION`

### 176/q07 — ENGINE_CAPABILITY_PENDING
- `c1` 정사면체 ABCD 한 모서리 18 → `solids[0];dims[0]`
- `c2` ABC,ACD,ABD 각 면에 내접한 원 C1~C3 → `ENGINE_CAPABILITY_PENDING:THREE_FACE_INCIRCLES`
- `c3` 각 원에서 A에 가장 가까운 P1,P2,P3, 그 삼각형 → `ENGINE_CAPABILITY_PENDING:THREE_POINTS_NEAREST_TO_APEX`

### 176/q08 — ENGINE_CAPABILITY_PENDING
- `c1` 정사면체 ABCD가 반지름 3인 구에 내접: 정사면체 외접구 반지름 R=sqrt(6)/4*side=3, 따라서 변 2√6 → `solids[0].side`
- `c2` F는 BCD의 무게중심, G는 ACD의 무게중심 → `solids[0].points[0..1]`
- `c3` O는 외접구 중심으로 AF 위 3:1 내분 → `solids[0].points[2]`
- `c4` 구 S와 정사면체 내접 배치 → `ENGINE_CAPABILITY_PENDING:SPHERE_TETRAHEDRON_SAME_ORIGIN`


## 후속 검수

- 공식 `plan-lint.cjs` shallow/full은 전체 25/25 `OK`, FAIL 0, SKIP 0 (2026-11-26 검수). PR 설명에도 실제 실행 명령을 기록한다.
- 렌더·PNG 실물·학생 화면·A4·게시: `NOT_RUN` (안티그래비티 후속).
- 다음 미처리 유형군은 177번부터이며 기하 완료 이후에만 미적분Ⅱ로 넘어간다.
