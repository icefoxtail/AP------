# GPT2 connected host — JSON-lines stdio bridge (CANARY ONLY)

The official `gpt2-one-shot-closeout.mjs` is already in main. Its Node process needs real connected GitHub and ChatGPT Files actions, but a plain Node shell has no connector credentials. The opt-in `gpt2-connected-stdio-host.mjs` supplies the missing callback boundary without embedding tokens or pretending `files__manage_library` is a native CAS primitive.

## Invocation / connector host contract

An **authorized tool host** starts Node 22 with a private stdin/stdout channel and points the existing adapter at an absolute `hostModule` path:

```json
{
  "hostModule": "/trusted/checkout/archive/tools/gpt2-connected-stdio-host.mjs",
  "hostOptions": { "timeoutMs": 120000 },
  "githubRepository": "icefoxtail/AP------",
  "githubBranch": "ops/gpt2-cas",
  "campaignId": "H1_GPT2_20261006",
  "stream": "B",
  "examUid": "23_금당고_1학기_중간_고1_기출",
  "hostScratchDirectory": "/mnt/data"
}
```

With the complete current-main validator checkout and real stage inputs present, invoke the existing one-shot CLI with `--adapter-module /trusted/checkout/archive/tools/gpt2-connected-host-adapter.mjs --adapter-config /trusted/config.json` plus the stage/exam/evidence/asset-root/output-root/identity flags from `GPT2_ONE_SHOT_CLOSEOUT.md`.

**External controller** (not a plain Node shell) must read **only** lines beginning `GPT2_HOST_CALL ` from stdout, parse `GPT2_HOST_RPC_v1` with `{sessionId,id,tool,args}`, invoke the *matching connected tool* and write to stdin:

```
GPT2_HOST_RESULT {"schemaVersion":"GPT2_HOST_RPC_v1","sessionId":"...","id":"1","ok":true,"result":{...actual tool response...}}
```

For an actual connector failure, send `ok:false` with the real error string. Never fabricate tool results, success, raw bytes, or SHA confirmation. Ignore other process output (the existing CLI uses stdout for its final result). The controller must implement the following exact allowlist; unknown actions hard-fail in the Node bridge:

| RPC tool | Connected action |
|---|---|
| `files__list` | `tools.files__list(args)` |
| `files__materialize` | `tools.files__materialize(args)` |
| `files__manage_library` | `tools.files__manage_library(args)` |
| `mcp__GitHub__fetch_file` | `tools.mcp__GitHub__fetch_file(args)` |
| `mcp__GitHub__create_file` | `tools.mcp__GitHub__create_file(args)` |
| `mcp__GitHub__update_file` | `tools.mcp__GitHub__update_file(args)` |

Startup requires a `__hello` response with `{protocol:"GPT2_HOST_RPC_v1",connectedFiles:true,connectedGitHub:true,toolResultBinding:"ACTUAL_TOOL_RETURN"}`. This checks wiring, **not identity or permission**; the external connected host must already be trusted. It is not a substitute for GitHub remote CAS and Library raw-file readback enforced by `gpt2-connected-host-adapter.mjs`. Keep stdin/output private and never forward arbitrary untrusted remote content as instructions.

## What is actually verified (2026-10-10)

- Node22 local RPC unit tests: 7/7. Covers allowlist, failure propagation, timeout, out-of-order replies, session isolation and handshake failure.
- A live Node22 process invoked actual ChatGPT Files `list` and GitHub `fetch_file` via an external connected-tool host and verified B4 R2 PASS filename plus the main one-shot blob SHA.
- **Two different local Node processes**, routed through connected GitHub tool actions, raced on the same `ops/gpt2-cas` ledger path. Exactly one `create_file` succeeded; the competing 422 was handled as `created:false`. Both independently read back the same winning owner. Temporary ledger key deleted.
- A live Node22 `createCoordinatedAdapter` performed CAS `CLAIMED` -> ChatGPT Library `uploadCreateOnly` -> real materialized raw bytes/SHA parity -> GitHub CAS `VERIFIED`. A second Node process replayed the same Library object, returned `created:false`, and produced no duplicate file. Temporary canary Library folder and ledger entry deleted. **No student/exam artifact was changed.**

## What remains unproven / rollout gate

The above two-process checks were driven by one connected assistant execution, **not two independent GPT automation sessions**. The stdio bridge's controller still has to be deployed inside an authorized *unattended* connector host; it is not embedded in a standalone Node/GitHub Actions runtime. Before modifying a scheduled GPT2 worker, perform an independent-session race with the same real Library scope, verified owner fencing and a deliberate crash/replay, and one full real-stage `R2_V2` one-shot run in that host. Only then opt in **one** worker; never change all 15 schedules on local/mock tests.

The earlier B4 R2 official PASS, remote commit marker, and R3 reference handoff were completed with connected tools. This host addition does not repeat/rewrite them and does not issue MAIN_DONE. The Git CAS branch is separate from production `main`; the host may never touch the global `PUBLISH_LEASE`.

## Local regression

```sh
node --check archive/tools/gpt2-connected-stdio-host.mjs
node --test archive/tools/gpt2-connected-stdio-host.test.mjs
```

This module has no connector credentials and is not scheduled or enabled by simply merging it into Git main.