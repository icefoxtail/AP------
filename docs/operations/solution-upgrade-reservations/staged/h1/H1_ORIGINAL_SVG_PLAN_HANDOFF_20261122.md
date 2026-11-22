# 고1 기출 SVG 플랜 작성 인계 — 2026-11-22

> **2026-11-22 후속:** 최신 `main`의 고1 1학기 기말 **문제 그림 112개**를 별도 시각검증했고, 2019 강남여고 q21 · 2021 팔마고 q4 · 2022 강남여고 q16에 **문제용 JSON 플랜 3건**을 신규 작성했다. 정적 `plan-lint` 3/3 OK, 실제 엔진 렌더·게시 `NOT_RUN`. 상세 결함·분모 차이는 [후속 112개 시각검증 보고서](H1_1FINAL_ORIGINAL_PROBLEM_IMAGE_QA_112_20261122.md) 참조. 아래 기존 11개 `OPEN_LAYOUT` 플랜과 별도로 계산한다.

## 범위·기준

- 대상: `icefoxtail/AP------`, `archive/exams/original/high/h1/{1mid,1final,2mid,2final}/` 기출. **유사 제외**.
- 플랜 기준: `data/svg-plans-20261117`의 `docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/high/h1/`.
- 미처리 선별: `main`의 `archive/tools/geometry-equation/production/exam-figure-ledger/high/h1/` 211개 시험지별 장부와 기존 플랜 파일 비교.
- 현 작업: `work/h1-original-svg-plans-20261122`에 **플랜 3개 신규 작성**, 기존 8개 유지, 11개 일괄 사전검사.
- 이번 단계는 **PLAN_ONLY**: `archive/exams/original` JS·PNG·SVG, 공식 엔진, 장부를 변경하지 않았다. SVG 렌더·게시, 학생 화면·A4 검증은 `NOT_RUN`.

## OPEN_LAYOUT 11문항 플랜 경로와 상태

아래 경로는 모두 `docs/plans/archive-one-route-upgrade/svg-plans-expanded/original/high/h1/` 아래 상대경로이다.

| 학기 | 시험지 | 문항 | 플랜 파일 | 이번 작업 | `plan-lint` |
| --- | --- | ---: | --- | --- | --- |
| 1mid | `19_강남여고_1학기_중간_고1_기출` | 3 | `1mid/19_강남여고_1학기_중간_고1_기출/q3-solution.json` | 기존 유지 | OK |
| 1mid | `22_효천고_1학기_중간_고1_기출` | 13 | `1mid/22_효천고_1학기_중간_고1_기출/q13-solution.json` | **신규** | OK |
| 1mid | `22_효천고_1학기_중간_고1_기출` | 14 | `1mid/22_효천고_1학기_중간_고1_기출/q14-solution.json` | 기존 유지 | OK |
| 1mid | `22_효천고_1학기_중간_고1_기출` | 22 | `1mid/22_효천고_1학기_중간_고1_기출/q22-solution.json` | **신규** | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 3 | `1final/19_매산여고_1학기_기말_고1_기출/q3-solution.json` | 기존 유지 | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 5 | `1final/19_매산여고_1학기_기말_고1_기출/q5-solution.json` | 기존 유지 | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 7 | `1final/19_매산여고_1학기_기말_고1_기출/q7-solution.json` | **신규** | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 11 | `1final/19_매산여고_1학기_기말_고1_기출/q11-solution.json` | 기존 유지 | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 19 | `1final/19_매산여고_1학기_기말_고1_기출/q19-solution.json` | 기존 유지 | OK |
| 1final | `19_매산여고_1학기_기말_고1_기출` | 20 | `1final/19_매산여고_1학기_기말_고1_기출/q20-solution.json` | 기존 유지 | OK |
| 2final | `22_복성고_2학기_기말_고1_기출` | 19 | `2final/22_복성고_2학기_기말_고1_기출/q19-solution.json` | 기존 유지 | OK |

**추가 신규 플랜의 수학·원본 대조**

- 2022 효천고 1학기 중간 13번: `u²=i`, `v²=−i`; 짝수 지수 2·4·6·8에 따른 `f(n)=0,−2,0,2`, 주기 8, 15묶음의 합 0. 실수축 위 연속 그래프로 위장하지 않고 엔진 대응도 `set-diagram-figure-v1/MAPPING` 사용.
- 2022 효천고 1학기 중간 22번: 두 근이 `−1`, `1/2`; 원점 양쪽에 놓이므로 `|α|+|β|=|α−β|=3/2`; `p=1/2`, `q=−1/2`, 최종 `p²+q²=1/2`. 엔진 수직선 `number-line-figure-v1/POINTS` 사용.
- 2019 매산여고 1학기 기말 7번: 문제 PNG 직접 확인. 중심 `C(−3,2)`와 반지름 `2`, x축 접점 `H(−3,0)`을 공식 좌표 작도 `construction-spike-v1`로 표현. 원본의 문제 PNG는 변경하지 않음.
- 세 문항의 `content`·`answer`·`solution`·`image` 필드는 기존 데이터 브랜치와 당일 `main`이 일치함을 별도 비교함.

## 검증·후속 실행

- JSON 파싱: 신규 3/3 성공.
- 엔진 사전검사: `archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs`로 위 11/11 `OK` (`FAIL=0`, `SKIP=0`). 이 검사는 **렌더 전 정적 검사**이며 시각검증·실제 엔진 SVG 생성 PASS가 아님.
- 실제 렌더·PNG 확인·publish 작성·게시·장부 상태 갱신: **NOT_RUN**. 다음 SVG 엔진 작업자는 `AUTHOR_GUIDE.md`와 `docs/agents/visual-svg.md`를 읽고 11개 플랜을 원본 문항과 대조하여 엔진으로 렌더하고, PNG 육안·ARCHIVE_BOUND·학생 화면/A4 검증 후 게시한다. 장부는 공식 `ledger-upsert`/`publish-exam` 흐름으로만 갱신하고 `main`에 무검증 병합하지 않는다.

## 시각검증과 플랜 작성의 별도 미결 범위

- 기존 고1 1학기 기말 시각검증 체크포인트: **11종·112이미지 잔여**(이전 작업 보고치; 본 커밋에서 새로 육안 전수검사하지 않음). 이 11종을 실제 이미지로 검증한 후에만 신규 SVG 엔진 계획이 더 필요한지 확정할 수 있다. **11개 OPEN_LAYOUT 플랜 완료를 고1 전체 시각검증 완료로 혼동하지 말 것.**
- 고1 2학기 중간 48종 시각검증의 별도 문서(`work/h1-2mid-original-visual-qa-20261122`: `H1_2MID_ORIGINAL_VISUAL_QA_48_20261122.md`)에는 P1 원본 PNG HOLD **2019 복성고 q6, 2026 매산고 q18** 및 P2 PNG TIDY **2021 복성고 q9, 2026 매산고 q12**가 있다. 모두 **원본 PNG 정리·원본 대조**를 우선하므로 이 4건을 무조건 SVG 엔진 재제작 플랜으로 전환하지 않았다. 후속 작업자의 원본/해설 교차검증 및 화면/A4 회귀검증 필요.
- 장부의 `OPEN_UNSUPPORTED`·`OPEN_CONTENT`는 별도 엔진 지원/내용 이슈다. 플랜 파일 존재만으로 자동 해제하지 않는다.
