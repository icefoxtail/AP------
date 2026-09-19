# Archive2 D-stage isolated inventory

- Source repo: icefoxtail/AP------
- Frozen main SHA: `ca60a38b1cb773bb946b671979061e9e09197daf`
- Files: 68
- Purpose: 고2·고3 공통 과목 semantic subject 설계/검증
- This branch is an isolated immutable snapshot. **Do not merge it into main.**
- Every source file is copied under `snapshot/<original path>` using the exact source blob SHA.
- `INVENTORY_MANIFEST.json` is the denominator for D-stage analysis.

D-stage analysis must not silently use a newer main file without first rebuilding this inventory.
