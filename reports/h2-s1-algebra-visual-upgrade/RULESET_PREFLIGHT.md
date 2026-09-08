# Effective Ruleset Preflight

## Routing result

- `RULE_ROUTING_BLOCKED`: NO
- Repository root: `C:/Users/USER/Desktop/AP------`
- Rules index: `docs/rules/00_RULES_INDEX.md`
- Applicable visual overlay: none for `수학I` / `대수`
- `집합·명제` qualification overlay: not applicable
- Manifest/hash agreement: PASS for all mandatory files listed below

## Mandatory preflight records

| 순서 | repository path | declared version/status | bytes | SHA-256 |
|---:|---|---|---:|---|
| 1 | `docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md` | v2.6 | 93734 | `15bac5c693b4bac5a5d1794ec07f641b188bb125d4321c08e0524ebbce5b0514` |
| 2 | `docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md` | v1.2.10, canonical candidate ready for final review | 195826 | `8e5f688c925bce396008722cf271f0136185ac7dc3599a4e408fe1417dff5ca5` |
| 3 | `docs/rules/04_VISUAL/도형추출.md` | v3.0, `AP_GRAPH_PRINT_V1_1_DRAFT` pilot basis | 51732 | `46104e98928b54b78b04c4e0c9848067e796aa070e15517653608c97cd75e6e2` |
| 4 | `docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md` | v1, ACTIVE | 13480 | `79dea04f6d9a14a0e8757867d0e4fa198bdd5962fc2df0655dfc5d420f0a224d` |
| 5 | `docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md` | v1.3.1 integrated clean edition | 125245 | `e72bb3032b59b26eff1fddd621c5cef5d522cd089b5d64567c7c2713a22256c9` |
| 6 | `docs/rules/02_PIPELINES/해설프로토콜.md` | v1.5 FINAL | 41275 | `ca3f19a1562422dea9ebce6321b0f369e2bd535b0492901278ff23255652cd5c` |
| 7 | `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md` | active quality-upgrade instruction | 21340 | `2bb2b2ca2e860948f33866b6dccd6700e0848ef053fa7a13f3866435` |
| 8 | `docs/rules/03_REVIEW/무결성검수.md` | v1.7 FINAL | 48114 | `b9fe074f85eec129641a21cc73e9fea0326689db8b053fa1fa8aaed20b6b9cf9` |

## Task-specific supporting rules read

- `docs/rules/00_RULES_INDEX.md`
- `docs/rules/MANIFEST.md`
- `docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
- `docs/rules/01_CANONICAL/프로젝트_컨텍스트.md` (release/context routing)
- `docs/rules/02_PIPELINES/수정프로토콜.md`
- `docs/rules/02_PIPELINES/작업방식_5문항배치루프_필수.md`
- `docs/rules/03_REVIEW/JS아카이브_1차검수_프로토콜.md`
- `docs/rules/03_REVIEW/JS아카이브_2차검수_프로토콜.md`
- `docs/rules/03_REVIEW/JS아카이브_3차검수_프로토콜.md`

## Fail-closed notes

`solutionImage` capability and browser render are separate gates. Existing inline SVGs are not accepted as mathematically correct merely because they load; V1/V2/V3 and final exam/solution/answer renders are required before any PASS or seal wording.
