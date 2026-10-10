# GPT2 one-shot — distributed Library CAS host bridge (CANARY, not activated)

This bridges the previously merged `gpt2-one-shot-closeout.mjs` to ChatGPT Files tools **through an authorized host process**. The default scratch directory is `/mnt/data` so the Files connector can access staged upload bytes; override `hostScratchDirectory` only for a host-authorized shared mount. It does **not** change any active GPT2 worker or issue mathematical quality PASS. The complete one-shot flow still uses the official V2 validator and active artifact gate.

## Confirmed live observations (2026-10-10)

- ChatGPT Files `files__manage_library.upload` with the same `destination_path` twice creates `probe.txt` and `probe(1).txt` rather than an atomic *already-exists rejection*. In an eight-call concurrent probe, the service created one exact path plus seven duplicate-safe suffixed names. The isolated test folder was deleted afterwards.
- GitHub **on a separate `ops/gpt2-cas` branch**, create-file on one identical exact ledger path: first call succeeded, competing call received **HTTP 422 (missing sha)**. A stale `update_file` using the old Git blob SHA received **HTTP 409**. Readback preserved the first writer. The temporary test record was deleted from the branch.
- The above are connector observations, not proof that arbitrary future host sessions, permissions, or network behavior are identical. Maintain fail-closed handling and enable only after the authorized host can run an independent-session canary.

## Modules

1. `gpt2-files-tool-transport.mjs` wraps injected `files__list`, `files__materialize`, `files__manage_library` actions and **returns actual Buffer bytes**. Uploads are create-only (never `overwrite`), and a duplicate-safe renamed path is surfaced, not hidden.
2. `gpt2-github-cas-ledger.mjs` wraps injected `mcp__GitHub__fetch_file`, `create_file`, and `update_file` actions, pinned to an explicitly supplied dedicated **non-main** branch. GitHub exact-path file creation and expected blob SHA updates form a CAS coordinator.
3. `gpt2-library-coordinated-adapter.mjs` wraps the two, validates campaign/stream/exam/path, serializes each remote object with CAS claims (8-minute recoverable lease by default), checks byte readback and exact path, then marks the claim VERIFIED. A renamed upload fails closed; a complete or duplicate upload never becomes a second receipt.
4. `gpt2-connected-host-adapter.mjs` is the `createAdapter(config)` factory accepted by the existing one-shot CLI. It loads an **absolute-path authorized host module** exporting `createHostClients()` and fails closed if the host or its connector methods are absent.

## Host integration (the missing deployment connection)

The runtime that invokes the one-shot executable must supply an authorized `createAdapter(config)` module. This is a **host responsibility**: plain Node 22 cannot directly call ChatGPT Files/MCP actions without the bridge. Host must inject the connected file tools, the GitHub connector methods, and a filesystem that can read materialized files.

```js
import { createFilesToolTransport } from './gpt2-files-tool-transport.mjs';
import { createGitHubCasLedger } from './gpt2-github-cas-ledger.mjs';
import { createCoordinatedAdapter } from './gpt2-library-coordinated-adapter.mjs';

// `files` and `github` must be real authorized host tool clients, not mock clients.
const library = createFilesToolTransport({ files });
const ledger = createGitHubCasLedger({
  github, repository: 'icefoxtail/AP------', branch: 'ops/gpt2-cas',
});
const adapter = createCoordinatedAdapter({
  library, ledger, campaignId: 'H1_GPT2_20261006',
  stream: 'B', examUid: '23_금당고_1학기_중간_고1_기출',
});
// Pass `adapter` to oneShot({stage:'R2', ...}, {adapter}).
```

**Do not set `capabilities.atomicCreateIfAbsent=true` on the native Files uploader.** Only the coordinated adapter provides that capability, after validating the real distributed ledger and the raw file transport. A Files backend that returns a renamed upload rather than the exact path must not be reported as success.

Example one-shot flags when an authorized host module has actually been deployed:

```sh
node archive/tools/gpt2-one-shot-closeout.mjs \
  --stage R2 --exam /work/B4.js --evidence /work/B4-evidence.json \
  --asset-root /work/archive --output-root /work/gpt2-seals \
  --campaign-id H1_GPT2_20261006 --stream B \
  --exam-uid 23_금당고_1학기_중간_고1_기출 \
  --adapter-module archive/tools/gpt2-connected-host-adapter.mjs \
  --adapter-config /secure/gpt2-b4-host-config.json
```

The config must name `hostModule` (absolute, injected by the authorized connector host), `githubRepository`, `githubBranch`, `campaignId`, `stream`, and `examUid`. The command **does not run in an isolated shell lacking ChatGPT Files and GitHub connector clients**.

## Remaining canary gate before activation

- Host can call injected connector actions from the same Node runtime as one-shot and read materialized files as Buffers (not inferred hashes).
- Two **separate GPT sessions** run the same B4 R2 artifact against the same remote ledger branch, with deliberate interruption and replay. Exactly one official remote commit marker, no mismatched receipts, no orphaned duplicate names.
- The B4 stage has actual student JS, R2 evidence, q12 original PNG and validated asset root available in that runtime; official R2 V2 CLI returns `ok:true`, active artifact gate, 0 issues and SHA-bound seal before any remote PASS.
- Verify real Library 3-file upload + readback + commit marker last + R3 handoff, then opt-in a **single** worker. Never auto-enable all 15 scheduled workers on mock-only tests.

## Test

```sh
node --test archive/tools/gpt2-library-coordinated-adapter.test.mjs archive/tools/gpt2-github-cas-ledger.test.mjs archive/tools/gpt2-files-tool-transport.test.mjs archive/tools/gpt2-connected-host-adapter.test.mjs
```

No production JS, question verdict, PR publication, MAIN_DONE, or global PUBLISH_LEASE is changed by this bridge.