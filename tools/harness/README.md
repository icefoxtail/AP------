# APMS / Archive Task Entry Harness v1

Optional local entry gate for shared-infrastructure experiments. It reuses exact existing Git authorities; it is **not** a new mandatory preflight for ordinary exams, reserved GPT workers, or FINAL QA. It does not change schedules, database records, runtime pipelines, or quality criteria.

Usage:

    node tools/harness/task-entry.mjs --task shared-harness --json
    node tools/harness/task-entry.mjs --task archive-final-qa --target archive/exams/original/.../exact.js --json
    node tools/harness/task-entry.mjs --task gpt-reservation-r1 --caps libraryRead=UNKNOWN --json
    node --test tools/harness/task-entry.test.mjs

Routes are exact enums in routes.v1.json (not a filename-search AI classifier). Local file targets require the exact repository-relative path. Library stage artifacts must be read through their own connector, not inferred from a local basename. Git HEAD/worktree and authority path are checked locally.

External capabilities (Git write, Notion, Drive, Library, browser) are caller-reported only. UNKNOWN produces PROBE_REQUIRED; UNAVAILABLE blocks. Even caller-provided AVAILABLE for any required external capability still produces PROBE_REQUIRED until actual provider use. No text claim grants permission or proves a tool is usable.

AP_HARNESS_ENTRY_v1 reports ENTRY_READY, PROBE_REQUIRED or BLOCKED plus nextRecommendedAction. ENTRY_READY is **only local entry readiness** and never math/SVG/Blind/Meta QA, Git main remote parity, CI, deployment or publication approval. The exact task CURRENT, existing validator, Git protection and the user's current instruction remain authoritative.

Skill static inventory and Git integrity are already handled by tools/skills/verify-skills.mjs. A9-style live Skill injection attestation is NOT implemented here; never claim SKILL_INJECTED merely from a file or this probe. This pilot does not add a daemon or auto-writer.

Negative contract tests explicitly inject unknown route, nonexistent authority/target, invalid path, forged capability and malformed registry. All 11 canonical authority paths are checked independently in the scoped CI job.

## GPT FINAL QA — 문항별 증거·플랜 의미 게이트

`verify-finalqa-evidence.cjs`는 위 선택적 entry gate와 **별개**다. [FINAL QA 단일 실행 카드](../../docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)의 `FIRST_FORMAL`에 적용하는 검수 증거 검사기이며 신규 CREATE/R1/R2/R3 또는 일반 CI 출고 규칙을 대체하지 않는다.

```bash
# 1. 정답·해설·메타 없는 문제 패킷을 별도 검수자에게 전달
node tools/harness/verify-finalqa-evidence.cjs --exam archive/exams/similar/high/h2/1mid/<시험지>.js --blind-pack

# 2. 실제 대상의 문항 수와 2N축을 읽어 NOT_RUN 양식 생성 (stdout)
node tools/harness/verify-finalqa-evidence.cjs --exam archive/exams/similar/high/h2/1mid/<시험지>.js --template

# 3. 별도 독립 검수자가 정답을 모르는 상태에서 풀이를 고정한 후
#    양식의 blindAnswer / blindReasoning, checks,
#    plan.problem/solution.reasoning, reviewer.blindArtifactRef 정보 작성:
node tools/harness/verify-finalqa-evidence.cjs --exam archive/exams/similar/high/h2/1mid/<시험지>.js --evidence <완성된-검수영수증.json>
```

- 완료 전 양식의 `NOT_RUN`을 임의 `PASS`로 바꾸지 말고 실제 계산/발문·보기·해설·메타·플랜 의미 검수에 근거해 작성한다. 검수 원문·원시 로그는 Git 외 인계 경로에 보관하고, 이 JSON에는 문항별 요지와 원본 근거 식별자만 기록한다.
- 문항별 발문/선지/정답/해설/메타의 **의미 지문**, 별도 검수자에게 전달한 블라인드 문제 패킷의 SHA-256, 플랜 JSON SHA-256을 재대조하므로 무관한 이미지 필드·HEAD 변경은 증거를 무효화하지 않고, 실제 문항/플랜 변경은 낡은 증거로 통과하지 않는다.
- 증명된 과거 FIRST_FORMAL 영수증을 재사용하는 VERIFIED_DELTA에서는 **변경된 QID만 다시 풀이하고 해당 행의 지문·증거를 갱신**한다. 전체 블라인드 팩의 지문도 최신 입력으로 갱신하되, 변경되지 않은 문항의 계산 근거를 새로 만든 것처럼 꾸미지 않는다.
- 문제/해설 `2N`축, 원문 인용 정확성(해당 capability가 허용할 때), 문제용 숨기지 않은 파생 `SOURCE_POINT` 노출, 엔진 미지원 인계, 공식 shallow/full lint 실패를 별도 코드로 잡는다. 수직선 엔진처럼 `sourceQuote`를 허용하지 않는 capability는 `sourceConditions`로 원문과 결속한다.
- 성공 출력 `QA_EVIDENCE_COMPLETE`는 **증거 분모·정적 결속·린트 완료**이며 독립 수학 풀이가 진실인지 소프트웨어가 보증하지 않는다. `axes.unsupported`는 `axes.executable`에 포함되지 않는다. 실제 SVG 렌더·PNG는 의도적으로 수행하지 않고 `NOT_RUN_BY_DESIGN`으로 보고한다.
- `--no-lint`는 로컬 진단 전용으로, 모든 항목이 있어도 `READY_FOR_OFFICIAL_LINT`일 뿐 성공 종료하지 않는다. 미완료는 `EVIDENCE_INCOMPLETE`로 실패 종료한다.
- 회귀 테스트는 `node --test tests/finalqa-evidence-harness.test.js`이며, 루트 `tests/*.test.js` 자동 수집 규칙에 포함된다. 일상적인 모든 시험지에서 이 도구를 자동 실행한다고 주장하지 않는다. 정식 검수 작업자가 해당 시험지에 명시적으로 실행한다.
