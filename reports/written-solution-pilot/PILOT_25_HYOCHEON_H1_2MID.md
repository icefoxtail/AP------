# AP JS아카이브 writtenSolution 파일럿 보고서

STATUS: PILOT / NON-CANONICAL
정식 `writtenSolution` 규칙은 ChatGPT 전수검수 및 사용자 승인 후 별도 확정한다.

## 1. 작업 기준

- BASE `origin/main` SHA: `c1694db99af0e1e65ceb2907bb8bcbafca2f6f4f`
- 작업 브랜치: `codex/written-solution-pilot-h1-hyocheon-2mid-20260910`
- 대상 시험지: `archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js`
- 커밋 SHA: 최종 파일럿 커밋은 채팅 최종 보고에 기록한다.

이번 작업은 기존 worktree의 병렬 변경을 건드리지 않고 `origin/main`에서 별도 worktree를 만들어 수행했다. `main`에는 merge하지 않았다.

## 2. 전체 문항 inventory

| 문항 | 유형 | answer | writtenSolution | 기존 solutionImage | 문제 image |
|---:|---|---|---|---|---|
| 1 | 객관식 | ③ | 작성 | - | - |
| 2 | 객관식 | ① | 작성 | 확인 | - |
| 3 | 객관식 | ① | 작성 | 확인 | - |
| 4 | 객관식 | ⑤ | 작성 | 확인 | - |
| 5 | 객관식 | ① | 작성 | - | - |
| 6 | 객관식 | ③ | 작성 | 확인 | - |
| 7 | 객관식 | ④ | 작성 | 확인 | - |
| 8 | 객관식 | ② | 작성 | 확인 | 확인 |
| 9 | 객관식 | ④ | 작성 | - | - |
| 10 | 객관식 | ③ | 작성 | 확인 | - |
| 11 | 객관식 | ② | 작성 | 확인 | - |
| 12 | 객관식 | ① | 작성 | 확인 | - |
| 13 | 객관식 | ⑤ | 작성 | 확인 | 확인 |
| 14 | 객관식 | ④ | 작성 | 확인 | 확인 |
| 15 | 객관식 | ② | 작성 | - | - |
| 16 | 객관식 | ④ | 작성 | - | - |
| 17 | 객관식 | ① | 작성 | 확인 | - |
| 18 | 객관식 | ⑤ | 작성 | 확인 | 확인 |
| 19 | 서술형 | `$2\sqrt{13}$` | 작성 | 확인 | - |
| 20 | 서술형 | `$26$` | 작성 | 확인 | - |
| 21 | 서술형 | `(-4,0), (-28,-36)` | 작성 | 확인 | - |
| 22 | 서술형 | `$4\sqrt6$` | 작성 | 확인 | - |
| 23 | 서술형 | 11개 순서쌍 | 작성 | 확인 | - |

- 전체 문항: 23
- 객관식: 18
- 서술형: 5
- `writtenSolution` 작성 완료: 23 / 23
- 빈 문자열: 0
- 기존 `solutionImage` 확인 대상: 18문항
- 문제 이미지 확인 대상: 4문항(8, 13, 14, 18)
- HOLD 문항: 없음

## 3. 작성·수학 QA

각 문항의 문제, `answer`, 기존 `solution`을 대조한 뒤 문항별 제출형 풀이를 직접 작성했다. 기존 `solution`의 `[키포인트]`, `조건 정리`, `풀이 방향`, `정석 풀이` 구조는 `writtenSolution`에 넣지 않았다.

 - `answer`와 `writtenSolution` 결론 일치: PASS
 - 필수 조건·부호·경우 분류·결론 연결: PASS
 - 객관식 문항을 서술형으로 재분류하지 않음: PASS
 - `questionType`, `tags`, `layoutTag`, `content`, `choices`, `answer`, 기존 `solution` 변조 없음: PASS
 - 문항별 `writtenSolution` 중복 문자열: 0
 - 교사용 금지 라벨 혼입: 0
 - 시각 문항의 문제 이미지 및 기존 SVG 대조: PASS

학생 답안 관점에서 특히 애매했던 문항은 5번(집합 원소 대응의 경우 분류), 8번(`\sqrt{k^2}=|k|`와 빈칸 순서), 18번(반사 경로와 실제 선분 교점의 유효성), 23번(다른 절댓값 branch가 원 내부를 가르지 않는 충분조건)이다. 모두 필요한 근거를 답안에 남겼으며 HOLD로 남길 충돌은 발견하지 않았다.

너무 짧게 쓰기 어려웠던 대표 문항은 8번, 18번, 22번, 23번이다. 8번은 다섯 빈칸을 모두 결정해야 하고, 18번은 네 대칭점에서 얻은 후보가 실제 네 변에 연결되는지 확인해야 하며, 22번은 중심의 네 부호를 판별해야 한다. 23번은 중심 통과 조건만으로는 부족하고 다른 branch의 원 내부 진입 여부까지 확인해야 한다.

역할 분리가 잘 된 대표 문항은 4번과 14번이다. `writtenSolution`은 접선 거리 계산과 각의 이등분선·내분점 계산만 남기고, 기존 `solution`은 키포인트·조건 정리·상세 설명·해설 SVG를 그대로 제공한다.

기존 데이터 결함: 이번 작성 중 `answer`·기존 `solution`·문제 이미지·해설 SVG 사이의 명백한 수학 충돌은 발견하지 않았다. 23번 기존 `solution`의 원문에는 literal `\n` 및 Unicode minus가 섞여 있으나 현재 renderer가 정상화하며, 기존 데이터 보존 원칙에 따라 수정하지 않았다.

## 4. CANONICAL_IMPACT_MAP

아래는 `origin/main`에서 실제 확인한 파일만 기록한 것이다. 파일럿에서는 정식 문서·스키마 확산을 하지 않았다.

| 현재 파일 경로 | 현재 역할 | 정식 도입 시 필요한 변경 | 필수/선택 | 파일럿 변경 |
|---|---|---|---|---|
| `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md` | 기본 문항 스키마와 메타데이터 보호 규칙 | `writtenSolution`의 canonical schema 위치, 역할, 보존·하위호환 규칙 추가 | 필수 | 아니오 |
| `docs/rules/00_RULES_INDEX.md` | 규칙 읽기 순서와 실렌더 게이트 진입점 | writtenSolution authoring/review/render 경로를 읽기 순서에 추가 | 필수 | 아니오 |
| `docs/rules/MANIFEST.md` | 운영 규칙 source-pack 파일·해시 manifest | canonical 문서 수정 후 manifest 재생성 | 필수 | 아니오 |
| `docs/rules/02_PIPELINES/해설프로토콜.md` | 기존 `solution` 작성·검산·학생용 표현 규칙 | `solution`과 `writtenSolution`의 역할 분리, 문항별 작성·검산 규칙 추가 | 필수 | 아니오 |
| `docs/rules/03_REVIEW/무결성검수.md` | 데이터·수학·렌더·전 문항 무결성 검수 | 필드 존재, 필수 근거, answer 일치, 모범답안→상세해설 순서 검수 추가 | 필수 | 아니오 |
| `archive/render-authority.js` | canonical normalization/authority adapter | unknown field 보존 및 canonical dual-run 비교에 `writtenSolution` 포함 | 필수 | 아니오 |
| `archive/print-contract.js` | canonical question object contract | `writtenSolution`을 `solution`과 함께 보존하는 canonical field로 추가 | 필수 | 예 |
| `archive/solution-render-executor.js` | 공유 해설지 DOM·pagination·continuation executor | 조건부 `[모범답안]` 계층과 `[상세해설]` 순서의 정식 처리 | 필수 | 예 |
| `archive/engine.html` | archive UI, CSS, legacy solution fallback, shared executor wiring | 정식 계층의 CSS·fallback·print contract 및 regression test 확정 | 필수 | 예 |
| `tests/archive-solution-image.test.js` | solution answer/image/body order와 continuation 계약 | optional written layer가 있을 때의 order/continuation 계약 추가 | 필수 | 아니오 |
| `tests/archive-render-authority-adapter.test.js` | shared/legacy authority 계약 | writtenSolution field가 normalization·canonical renderer에서 보존되는지 계약 추가 | 필수 | 예 |
| `archive/tools/pipeline-core/contracts/exam-release-v1.schema.json` | pipeline release/evidence contract | 정식 release artifact에서 writtenSolution coverage/evidence 필드 필요 여부 결정 | 선택/검토 | 아니오 |
| `archive/exams/original/**` | 실제 시험지 문항 객체 저장소 | 승인된 migration policy에 따라 대상 문항에 field 확산 | 필수 | 파일럿 대상만 예 |

정식 도입 전 `RULES_INDEX`, `MANIFEST`, 전체 schema/taxonomy, 전체 시험지, DB를 일괄 변경하지 않았다.

## 5. 렌더 검증

검증 서버는 파일럿 worktree를 명시한 로컬 서버로 실행했다.

### 대상 시험지 solution

- 실제 browser solution render: PASS
- 페이지 수: 12
- 문항 box: 23개 primary + continuation shell
- `[모범답안]`: 23
- `[상세해설]`: 23
- 기존 solutionImage decode/render: 18
- MathJax `mjx-container`: 749
- page overflow: 0
- 문항 순서: 1→23 PASS
- full-page screenshot: PASS
- desktop viewport: PASS
- mobile viewport: NOT_TESTED — 현재 In-app Browser에 viewport override capability가 노출되지 않음

화면 계층은 문제 리마인드 → `[정답]` → `[모범답안]`/writtenSolution → `[상세해설]` → 기존 `solutionImage`/`solution` 순서로 확인했다.

### 대상 시험지 exam regression

- 시험지 mode: PASS
- 페이지 수: 7
- 문항 수: 23
- MathJax `mjx-container`: 538
- 문제 이미지 decode/render: 4
- page overflow: 0
- `writtenSolution` 노출: 0

### writtenSolution 없는 기존 시험지 regression

대상: `archive/exams/original/high/h1/2mid/21_강남여고_2학기_중간_고1_기출.js`

- solution render: PASS
- 페이지 수: 11
- 문항 box: 26
- 기존 solutionImage decode/render: 13
- MathJax `mjx-container`: 611
- page overflow: 0
- `[모범답안]`: 0
- `[상세해설]`: 0

## 6. 정적·전수 검증

- `node --check archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js`: PASS
- `node --check archive/solution-render-executor.js`: PASS
- `node --check archive/render-authority.js`: PASS
- `node --check archive/print-contract.js`: PASS
- 대상 파일과 `origin/main`의 보존 필드 비교: preserved diffs 0
- 대상 파일의 23문항 parse: PASS
- `writtenSolution` 존재/빈 문자열 검사: 23 / 23, empty 0
- 전체 archive test files: 61 PASS / 0 FAIL
- `git diff --check`: PASS

`engine.html`은 HTML 문서이며 직접 `node --check` 대상이 아니다. inline script 문법은 전체 archive test suite의 `inline scripts in both engines remain syntactically valid` 테스트로 PASS 확인했다.

## 7. 핀포인트 수정 회귀

- q14 좌표별 내분점 공식, 점 산술 제거: PASS
- q21 두 경우의 점 순서·거리 관계·좌표 변화량 풀이, 매개변수/벡터식 제거: PASS
- q18 반사 등식의 근거(`PR_i=P_i'R_i`, 공선성) 보강: PASS
- q22 네 중심 후보 직접 판별: PASS
- q23 `branch` 표현 제거 및 한국어 직선 부분 표현: PASS
- q14 독립 검산: `D=(-1,-2/5)` PASS
- q21 독립 검산: `C=(-4,0), (-28,-36)` PASS
- normalization parity: source → canonical question → canonical renderer에서 `writtenSolution` 유지: PASS
- `solution` parity: 기존 상세해설 unchanged, 두 필드 동시 존재: PASS
- canonical renderer 계층: `[모범답안]` → `[상세해설]`: PASS

## 8. 최종 판정

FINAL: `PILOT_PASS`

판정 범위는 파일럿 대상 시험지와 desktop 실제 렌더다. mobile viewport는 현재 도구 capability 제한으로 NOT_TESTED이며, 정식 도입 전 별도 확인한다.

main에는 merge하지 않았음.
ChatGPT 전수검수 대기 상태.
