# Archive GPT Drive final sync (staged, not an extra quality gate)

This is a **transport** from the separately owned private Google Drive final folder to a dedicated Git branch. It does not replace CREATE/R1/R2/R3 quality controls, independently approve content, merge main, or publish students' Pages.

- Final Drive folder: https://drive.google.com/drive/folders/1DAPS2sKV4bD94UYtC8uUmB4TJmKgEB8S
- Source: only immediate exam subfolders with a complete `SYNC_READY.json`.
- Git output branch: `automation/drive-gpt-final`, **never direct main**.
- Frequency: each hour (29 minutes past), with manual `workflow_dispatch`.
- No deletes, no raw PDF/receipts, no logs or archive backups. Only explicit JS/PNG/SVG destinations under `archive/`, with matching SHA-256.
- Re-running on unchanged bytes is idempotent; wrong/missing/partial bytes stop before a commit.
- If multiple ready packets try to overwrite the same repo path, sync stops.

## Example folder packet

```text
JS_Archive_GPT_최종수정본_Git동기화/
  22_풍덕중_1학기_기말_중2_수학/
    22_풍덕중_1학기_기말_중2_수학.js
    assets/q03.png
    SYNC_READY.json
```

```json
{
  "version": 1,
  "status": "FINAL_READY",
  "files": [
    {
      "source": "22_풍덕중_1학기_기말_중2_수학.js",
      "target": "archive/exams/original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "sha256": "<64 lowercase hex characters of exact final file bytes>"
    },
    {
      "source": "assets/q03.png",
      "target": "archive/exams/original/middle/m2/1final/assets/22_풍덕중_1학기_기말_중2_수학/q03.png",
      "sha256": "<64 lowercase hex characters>"
    }
  ]
}
```

**Paths are examples, not confirmed consumer paths.** Before finalizing each packet, map assets to the actual URL/path expected by its JS and the production consumer. The manifest should be written **last**, only after the GPT closer has actually saved and confirmed the complete file set. Its status is a transfer marker, not a new independent quality certification. Existing exam-level stage records/receipts remain unchanged.

## One-time setup before activating

1. Provision a dedicated Google service account with **read-only** access to this final folder (and child folders), keeping the folder private. Never put Google service-account JSON in Git or Drive sync packets.
2. Put the credential JSON into GitHub Actions repository secret `ARCHIVE_DRIVE_SERVICE_ACCOUNT_JSON`. Set repository variable `ARCHIVE_DRIVE_SYNC_ENABLED=true`; until then scheduled/manual executions skip.
3. Merge the workflow's implementation PR to the default branch, and ensure GitHub Actions workflow permissions allow `contents: write` for the bot.
4. Place one fully reviewed test packet in the Drive folder. Run the workflow once and confirm the commit and exact files on `automation/drive-gpt-final`.
5. Merge to main using the repository's existing technical/registration/Pages release workflow. **A push made using the workflow's `GITHUB_TOKEN` does not trigger further push-based workflows**, so do not call a Drive-sync commit a deployed student release.

## Limitations

This connector session cannot create Google Cloud service-account credentials or set GitHub Actions secrets. No live automatic sync or Pages release is claimed until those have been configured and an actual run is verified.