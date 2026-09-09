# 고2 수학I·대수 시각자료 업그레이드 — 학원 전수 시각 검수팩

이 문서는 machine audit 이후 학원에서 수행할 독립 시각 검수의 시작점이다. 검수자는 source/solution/V1/V2/V3의 판정을 바꾸지 않고 실제 렌더 화면의 표시 품질만 확인한다. FAIL이 발견되면 UID와 mode/viewport, 캡처 파일, 문제 유형을 기록하고 해당 문항만 재검수한다.

## 현재 고정 상태

- branch: `codex/h2-s1-algebra-visual-upgrade-20260909`
- target: 459 / candidate inventory 475 / excluded 16
- visual triage: `NO_VISUAL 364`, `KEEP_EXISTING 56`, `REBUILD_EXISTING 15`, `ADD_NEW_VISUAL 24`
- generated candidate scope: 39 rows, candidate + V1/V2/V3 PASS 39/39
- solution freeze: 459/459 PASS
- baseline browser render: 72/72 PASS
- origin-main/source-refresh render: 18/18 PASS
- production authority: `productionAuthorized:false`

## 검수 자료

### 전체 캡처

- baseline evidence: `browser_render_capture_matrix.json`
- baseline screenshots: `output/playwright/h2-s1-algebra/render-capture/desktop_*.png`, `mobile_*.png` — 72개
- source-refresh evidence: `browser_render_refresh_20260909.json`
- source-refresh screenshots: `output/playwright/h2-s1-algebra/render-capture/refresh_*.png` — 18개
- independent render-review evidence: `browser_render_review.json`

빠른 전체 조망용 contact sheet:

- `output/playwright/h2-s1-algebra/render-capture/review_contact_desktop.png`
- `output/playwright/h2-s1-algebra/render-capture/review_contact_mobile.png`
- `output/playwright/h2-s1-algebra/render-capture/review_contact_refresh.png`

Contact sheet는 조망용일 뿐이며, 이상 징후가 있으면 해당 원본 PNG를 열어 판정한다.

## 필수 확인 항목

각 baseline 72건과 refresh 18건에 대해 다음을 확인한다.

1. 페이지 끝·문항 끝·마지막 페이지에서 잘림이 없는가.
2. SVG, 표, 그래프, 수식, 선택지, 해설 문단이 서로 겹치지 않는가.
3. 축·눈금·점·화살표·범례·문항 라벨이 문제의 의미와 맞고 읽히는가.
4. 한글, 분수, 루트, π, 부등호, 합성함수 표기가 깨지거나 원문 문자열로 남지 않는가.
5. desktop/mobile에서 글자 크기와 시각자료가 과도하게 작아지지 않는가.
6. 빈 페이지, 이상 문구, `Missing ...`, raw TeX, broken image, 가로 overflow가 없는가.
7. 시각자료가 해설의 decisive step을 실제로 전달하며 장식용 정보가 아닌가.

## 우선 확인 문항

| 우선순위 | UID/문항 | 확인 이유 |
|---:|---|---|
| 1 | `24_팔마고_1학기_기말_고2_수학I::q9` | 흐린 원문 그래프 재구성 경로 |
| 2 | `25_제일고_1학기_기말_고2_수학I::q2` | ADD tangent 그래프 |
| 3 | `25_제일고_1학기_중간_고2_대수::q13` | origin/main에서 조건 보강 후 REBUILD |
| 4 | `25_효천고_1학기_기말_고2_대수::q23` | 원·거리 geometry 시각자료 |
| 5 | `25_효천고_1학기_중간_고2_대수::q24` | source 조건·LaTeX 수정 후 refresh |

## 판정 기록 양식

아래 형식으로 별도 검수 ledger를 만들고 FAIL만 후속 수정 대상으로 삼는다.

```text
questionUid:
mode: exam | solution | answer
viewport: desktop | mobile
screenshot:
decision: PASS | FAIL
finding: clipping | overlap | label | korean | formula | readability | odd-text | other
detail:
reviewer:
reviewedAt:
```

모든 검수가 끝나면 다음을 확인한다.

- baseline 72/72 및 refresh 18/18의 시각 판정이 모두 PASS
- residual FAIL 0
- FAIL 수정 문항은 source → artifact V2 → V3 → 영향 render 순서로 재검
- `node archive/tools/visual-upgrade/build-h2-s1-algebra-final-audit.mjs` 재실행 결과 `MACHINE_AUDIT_PASS_CANONICAL_SEAL_HOLD`
- provider-attested final audit가 실제로 완료되기 전에는 production seal과 main merge를 실행하지 않음
