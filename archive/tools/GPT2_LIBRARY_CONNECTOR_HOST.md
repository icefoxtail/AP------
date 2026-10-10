# GPT2 Library connector host — PR #361 pilot

Status: **CANARY ONLY; not a standalone Node-to-ChatGPT API adapter.** A Node process has no credentials/transport for ChatGPT Library. The authenticated GPT host supplies the `files__manage_library`, `files__list`, and `files__materialize` calls. Do not hide this dependency.

## Single-stage closeout

1. Run the existing `gpt2-validate-and-seal.mjs` with the exact frozen campaign/stream/exam/stage identity. Its output root holds immutable `seals/<stage>/<sha>.validator.json`, `seals/<stage>/<sha>.json`, and `handoffs/<next>.json`.
2. `gpt2-library-commit.mjs plan <outputRoot> <campaignId> <stream> <examUid> <stage>` rejects invalid V2 provenance and returns three exact `localPath → remotePath` items with SHA256/length. No artifact copy is required when a content-addressed source is already accessible.
3. GPT host, **not the Node process**, calls Library upload for only these three exact paths. For a path that already exists, read its real bytes first; never blindly overwrite or use a duplicate-safe `(1)` path as the authority. In case of a mismatch, FAIL/CAS conflict.
4. GPT host calls Library materialize on the exact `file_id` returned by the upload/readback, taking actual bytes into a local directory. Construct a manifest of `[{"remotePath":"...","localReadbackPath":"/..."}]`, one entry for each plan item.
5. Run `gpt2-library-readback-gate.mjs <outputRoot> <campaignId> <stream> <examUid> <stage> <manifest.json>`. **It computes SHA256 from materialized Library bytes**, not from asserted hash strings. Only when all three match does it emit `REMOTE_VERIFIED`.
6. Write the emitted attestation as an immutable Library artifact and materialize/read back that artifact too. An existing different attestation is a conflict; never overwrite. The local `gpt2-remote-closeout.mjs` supports a fully automated adapter only if the host supplies actual byte-level remote get/put methods.

## Existing A14 canary evidence (2026-10-10)

`H1_GPT2_20261006/A/20_순천여고_1학기_중간_고1_기출`: existing CREATE blob `cab116f3a59cf78f066ea4de021163f53a1211bc`. Three files were persisted under `TECHNICAL/GPT2_V2/`, materialized through Library, and validated as `REMOTE_VERIFIED/MATERIALIZED_REMOTE_BYTES`. Negative test with a corrupted readback exited 2 `REMOTE_READBACK_MISMATCH`. Attestation saved and read back under `TECHNICAL/GPT2_V2/attestations/`; original A14 quality artifact and previous MAIN_DONE unchanged.

## Activation gate

This is **not** a fully unattended GPT2 runtime or a distributed multi-writer transaction. Do not enable on all 15 lanes merely because the A14 canary passed. Before scheduling use: perform fresh CREATE→remote readback→R1 uptake canary, validate retries and concurrent workers across independent containers with safe identity/lease fencing, and define an authenticated host executor for Library connector operations. Existing scheduled prompts and stage gates remain authoritative until explicitly switched.
