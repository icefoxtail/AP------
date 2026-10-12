# GPT2 one-shot technical closeout — canary

This is an **opt-in technical closeout**, not a new math review or an automated publication/MAIN_DONE gate. Do not change the active 15 scheduled prompts as part of installing it.

## One command

Run from the **current Git checkout on Node 22**, with the stage's already reviewed JS/evidence and an authoritative local asset root:

```sh
node archive/tools/gpt2-one-shot-closeout.mjs \
  --stage R2 \
  --exam "/work/23_금당고_1학기_중간_고1_기출.js" \
  --evidence "/work/R2_evidence.json" \
  --asset-root "/work/archive" \
  --output-root "/work/gpt2-seals" \
  --campaign-id H1_GPT2_20261006 \
  --stream B \
  --exam-uid 23_금당고_1학기_중간_고1_기출 \
  --adapter-module /secure/real-library-adapter.mjs
```

The adapter module is supplied by the authorized connected Library **host**. It must export `createAdapter(config)` returning:

```js
{
  capabilities: { atomicCreateIfAbsent: true, rawByteReadback: true },
  async get(remotePath) { /* return the actual remote Buffer or null */ },
  async putIfAbsent(remotePath, buffer) { /* remotely atomic: true if created, false if already present */ }
}
```

**Both guarantees are required**, including against distinct GPT sessions/processes. A get-then-overwrite put, metadata-only hash, local filesystem simulation, or an unconnected Files tool does **not** qualify as the real Library adapter. No production adapter is embedded in this repository: the host must provide it. The runner rejects missing capabilities **before** any local seal.

## Closeout contract

- Reuses `gpt2-validate-and-seal.mjs`, the canonical V2 validator and active artifact gate. Refuses to publish on FAIL; does not repeat unchanged mathematical review.
- Validated local raw validator/seal/next-stage SHA reference are immutable; remote `gpt2-remote-closeout.mjs` uploads exactly three files with byte readback and publishes the commit marker **last**.
- If a transport operation fails, rerun the *same* command. Existing identical files are reused, different remote bytes fail closed, and local failure detail is written to `one-shot-continuation.<stage>.json`. That local record is **not** a claim of remote Library persistence.
- Only `REMOTE_VERIFIED` is success. The handoff is a SHA reference, **not** a copy of next-stage JS/assets. R3 hands off to PUBLICATION; this command never merges Git, touches global PUBLISH_LEASE, changes active reservations, or issues MAIN_DONE.
- Run tests: `node --test archive/tools/gpt2-one-shot-closeout.test.mjs`. These test the orchestration using a deterministic atomic in-memory adapter; real distributed Library CAS and host integration must be tested separately before scheduling it.

**Activation gate:** independently verify the host adapter's remote immutable CAS, connector upload/readback, and exact same-artifact replay from two sessions. Until then: CANARY ONLY / NOT CONNECTED TO LIVE LIBRARY.
