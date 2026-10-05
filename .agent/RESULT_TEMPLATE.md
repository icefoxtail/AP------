# AP Result Template

Use this structure unless the current task provides a stricter result format.

```markdown
# CODEX_RESULT

Date:
Root:
Task:

## 1. Created / Modified Files

## 2. Files Actually Read

## 3. Work Completed

## 4. Verification Results

## 5. Result Summary

## 6. Work Not Performed

- No git add/commit/push unless explicitly requested.
- No deploy unless explicitly requested.
- No production API smoke unless explicitly requested.
- No remote D1 unless explicitly requested.
- No code/schema/generated output changes outside scope.
```

If the task forbids root `CODEX_RESULT.md`, write a separate report under `reports/`.
