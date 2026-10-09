# 문제은행 문제·해설 SVG 전수조사 — 파일 스코프 선행 inventory (2026-10-10)

> 상태 **FILE_TREE_BASELINE_ONLY / UID_BY_UID_AUDIT_NOT_STARTED**. 사용자의 “문서화부터” 요청에 따른 1차 파일트리 범위 확인. 실제 SVG가 *필요한* 문항 분모·누락 건수/실제 크롬 PASS 수를 판정한 것이 아니다.

- Source: GitHub 원격 main recursive Git tree `8c2d28b68a14e6b8cdd1e2ecda35f8a5809696ad` 조회 시점 (2026-10-10 KST), 응답 `truncated=false`, 전체 blob 31,515건.
- 조회 필터는 경로 파일 inventory용이며, repository-wide SOURCE/Consumer의 **정식 UID 전수 등록 분모가 아니다**. 일부 생성 candidate는 본 main HEAD 또는 별도 보호 브랜치에 추가되므로 actual audit 시작 시 양쪽을 조회.
- 모든 집계는 **파일 수**로 한정. `solutionImage` 참조와 실제 SVG 존재 여부, 해설 시각 필요성, SVG 수학 품질, Chrome 렌더 여부를 집계하지 않았다.

| 파일 경로 필터 | 관찰 파일 수 | 비고 |
|---|---:|---|
| `archive/exams/original/**/*.js` | **451** | 학교 기출 JS 파일(실제 question item 수는 별도 파싱 필수) |
| `archive/assets/images/**/*-solution.svg` | **2,142** | 현재 저장된 production asset 경로의 해설 SVG 파일 수, 문항/UID 링크 증거 아님 |
| `archive/assets/images/**/*.svg` 중 `-solution.svg` 제외 | **188** | 문제용/기타 SVG 혼재 가능. PNG와 인라인 visual 미포함 |
| `archive/generated/lite/**/*.js` | **178** | 생성 Source 소스 JS 파일 수, 현재 릴리스 UID 수와 다름 |
| `archive/generated/lite/**/*.json` | **252** | Meta/manifest 등 혼재 |
| `archive/assets/generated-lite/**/*.svg` | **14** | source/solution 표면 혼재, 실제 문제은행 생성문항의 충족률 아님 |
| `alive/06_EXECUTION/**/GPT_QID9_Q##_PACKAGE.json` | **17** | 원본별 9슬롯 후보 파일(해당 시점에 main 존재하는 범위); 정식 승인/학생용과 다름 |

## 실제 전수조사 전까지 단정하지 말 것

- `해설 SVG 파일 2,142개` ≠ `해설 SVG 필요 조건 2,142개 PASS`. 연결·품질·교수 효용은 UID별 재검토 필요.
- `Generated SVG 파일 14개` ≠ `Generated 가운데 14문항만 시각 필요`, 또는 나머지 모두 누락. 기존 PNG/inline, 보관 파일, Source/Consumer 미출시 등 별도 구분 필요.
- 전수조사 시 반드시 **등록된 고유 UID 전체를 물리 분모 확정**하여 문제용·해설용 각각 판정. `NOT_ASSESSED`를 누락률의 분모 밖으로 밀지 않는다.
- Q19 9개 해설 SVG 0개는 직접 이전 q19 package 확인에 따른 사전 관찰. q17~q19 27 UID는 시각 necessity **재평가 우선순위**이며, 전부 SVG 누락 확정이라는 뜻이 아님.
- 이미 승인된 기출과 Generated의 재승인·정답 전수 재풀이·기존 SVG 전체 재생성을 지시하지 않음. VISUAL만 전수평가하고 **결함 UID만 핀포인트 제작/수리**.

**실행 정본:** `docs/rules/04_VISUAL/Problem_Bank_Per_Item_Problem_Solution_SVG_Full_Audit_CURRENT_v1.md`
