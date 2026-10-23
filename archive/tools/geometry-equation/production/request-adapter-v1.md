# Frozen visual request adapter v1

`request-adapter-v1.mjs` is an opt-in envelope around the existing external
`runFrozen(root, request)` entrypoint. Existing runtime callers and the worker
wire format remain unchanged.

```js
import {
  createFrozenVisualRequest,
  unwrapFrozenVisualRequest,
  runFrozenVisualRequest,
} from './request-adapter-v1.mjs';

const envelope = createFrozenVisualRequest(request);
const detachedRequest = unwrapFrozenVisualRequest(envelope);
const receipt = await runFrozenVisualRequest(root, envelope);
```

The envelope has exactly `schemaVersion`, `request`, and `requestSha256`.
The digest uses the existing pipeline-core `objectSha` contract. Therefore
canonical-equivalent NFC strings can have the same digest; the adapter keeps
the submitted string values in its detached snapshot and does not claim raw
text-byte tamper detection. Arrays retain their order. Optional `visualRole`,
`runId`, and `replayResultRef` fields remain omitted when omitted, and explicit
`null` values for `runId` and `replayResultRef` are preserved.

The adapter validates the request's declared shape, supported mode/capability,
identity, and file-reference structure. It does not read referenced files,
inspect `frozenPlanRef` payloads, establish resolver-registry authority, or
verify mathematical facts. `runFrozenVisualRequest` delegates once to the
existing production runner, which retains its file-byte, plan, and capability
checks. Its result remains non-authorizing (`productionAuthorized: false`);
this adapter does not grant source authority, review, qualification, or
publication status. Proxy objects at the envelope, request, or nested-value
boundary are rejected before reflection so they cannot change values between
validation, hashing, and snapshot creation.
