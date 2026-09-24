# B01–B16 main merge readiness — latest main audit

- Promotion branch before this follow-up: `codex/meta-foundation/middle1@37a5ca4629dce2a29f4093578440c53dc44cd12d`.
- Latest checked `origin/main`: `f9946444d0fd46b0972f73771bd16a24c542b992`.
- A three-way merge in a separate worktree has one content conflict: generated `archive/data/archive2-catalog.json`. There are no conflicts in B01–B16 source JS, `question_metadata.json`, canonical, compiled, runtime, or compiler code.
- Main has one newly changed M3 source exam since the B01–B16 promotion and a matching catalog update. Regenerating the catalog after combining main and the promotion resolves the generated-file conflict while preserving **0** non-target record differences from latest main.
- In the isolated merge result, B01–B16 Archive2 join is **381/381**; identity and source are **381/381 VERIFIED**, Foundation taxonomy **364/364 CONFIRMED**, direct RPM taxonomy **353/364**, explicit RPM-path HOLD **11**, target metadata conflicts **0**, duplicate UID/source identity **0**, automatically eligible **121**.
- Compiler check, scoped promotion validation, Archive2 catalog `--check`, and targeted Node tests **29/29** pass on the isolated merge result.
- A portability issue in the middle 1 runtime compiler was found during this dry run: raw JSON byte hashes depended on Windows CRLF checkout. The compiler now normalizes CRLF to LF, matching the global Foundation compiler, and runtime `--check` passes in both worktrees.
- No merge into `main` has been performed. B17 is a separate task and was not started or changed.
