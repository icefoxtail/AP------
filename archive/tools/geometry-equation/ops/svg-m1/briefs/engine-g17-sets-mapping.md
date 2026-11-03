# G17: 대응도(MAPPING) 부호 있는 수·열 원소 수 차이·화살표 이름/색 · 벤다이어그램 서로소·3단 포함 (엔진 확장)

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-g13-common.md`(공통 규칙; 묶음 id만 `g17`로 바꿔 읽는다)를 끝까지 읽고 따른다. 산출물 폴더 `/home/user/AP------/.tmp/svg-m1/runs/g17/`. 기능마다 따로 커밋. 하나가 막혀도 나머지는 끝낸다. 우선순위는 번호 순(1~2가 핵심).
워크트리 기준은 origin/main(PR #1230, G16 포함)이다. `git log --oneline -1`로 확인.

## 왜 (학생에게 무엇이 좋은가)
고1 2학기 함수·집합 해설은 "X의 원소 −2가 Y의 어디로 가는지", "f∘g 경로를 따라간다", "두 집합이 서로소이니 겹치는 부분이 없다"로 푼다. 지금 엔진은 대응도 원소에 음수를 못 쓰고, 두 열 원소 수가 다르면 거절하고, 화살표에 f·g 이름이나 색을 못 달고, 벤다이어그램을 서로소로 못 그려 25·24 고1 기말 그림 여러 개가 빠지거나 캡션 설명으로 대신했다. 사용자 지시(2026-11-02): 엔진 공백은 바로 확장한다.

## 지금 코드
`production/set-diagram-v1.mjs`(Venn·MAPPING; MAPPING 원소 글자 검사 :212-213 `/^[A-Za-z0-9]+$/`, 4자), 관측기 `production/set_diagram_observer.py`(+ worker), 합성 `composite-candidate-svg-v1.mjs`(G13b set 패널). 가이드 `production/author-guide-body.md` 집합·대응도 절.

## 기능 1: 대응도 원소에 부호 있는 수·분수 꼴
- 원소 글자에 `-2`, `−1`, `1/2`, `√2`(짧은 것, 6자 이내) 허용. 입력 `-`는 표시 `−`(U+2212)로. 관측기는 SVG 글자와 plan 원소가 같은지 그대로 대조.
- 샘플: 25 금당고 고1 q6, 24 금당고 고1 q13, 24 효천고 고1 q13(지금 plan: `/home/user/AP------/.tmp/svg-m1/runs/h1f-other2/<시험지>/q<N>/`, `.../h1f-other1/24_효천고_2학기_기말_고1_수학/q13/`; 24 효천 q13은 실선=(가)·점선=(나) 화살표 구성 그대로 재사용).

## 기능 2: 두 열 원소 수가 다를 때 세로 가운데 정렬
- X 5개·Y 8개처럼 열마다 원소 수가 다르면, 각 열 타원 높이는 긴 열 기준, 짧은 열 원소는 타원 안 세로 가운데에 균등 배치(지금 MAPPING_ELEMENT_OUT_OF_OVAL). 3열(X→Y→Z)도 같은 규칙.
- 샘플: 24 매산여고 고1 q21(`.../h1f-other2/24_매산여고_2학기_기말_고1_기출/q21/`).

## 기능 3: 화살표 묶음 이름·색
- `arrowGroups:[{"name":"f","from":"X","to":"Y","color":"BLUE"}]` — 열 사이 위쪽에 함수 이름 f, g 라벨(열 사이 가운데), 화살표 색(C1 팔레트). `highlightPaths:[{"path":["3","1","4"],"color":"ORANGE"}]`로 X→X→X 합성 경로 강조(경로마다 다른 색, 2개까지).
- 샘플: 25 순천여고 고1 q9(f∘g, (f∘g)⁻¹(3) 두 경로), 25 팔마고 고1 q2(f 2→4, g 2→2). 지금 그림 `.../h1f-other1/<시험지>/q<N>/`.

## 기능 4: 벤다이어그램 서로소 배치·3단 포함 (남는 시간)
- `disjoint:[["A","B"]]` — 두 원을 떨어뜨려 그린다(겹침 영역 없음, ∅ 글자 불필요). 3집합에서 한 쌍만 서로소도.
- `subset` 체인 `A⊂B⊂C` 3단(지금 2단까지).
- 샘플: 25 금당고 고1 q21(서로소), q11(2의 약수 ⊂ An ⊂ 24의 약수), 26 매산여고 고1 q13(gaps.md G13 절).

## 정답지 회귀 (표본, 시작 전·후 바이트 동일)
`ops/golden.manifest.json`에서 set-diagram을 쓰는 항목(Venn 2·3집합, MAPPING, subset, 개수 라벨) 10개 안팎 + composite set 패널(item107g13b). 새 항목 `item112g17`(부호 있는 수 대응도) + manifest.

## 실제 문항 결과
`runs/g17/<시험 약칭>-q<N>/`에 item.json·plan.json·out/·figure.png·publish.json(alt, caption 끝에 정답). 기존 폴더의 publish.json을 출발점으로.
