# Archive 2.0 Output Envelope

**Base:** `BASE_MAIN_SHA=95d01cef7f5aa30c1f49127cde271dc6867c66c4`. Relevant output, Worker, and PDF owners have no drift from that base through fetched `origin/main` `fc699d27122ea255a048874bb624fabbd95c4c34`.

## Contract

`archive2-output-envelope-v1` is the canonical producer/consumer contract. It carries a UUID `outputRequestId`, UUID `ownerId`, source kind and exact source/paper/assignment identity, mode, ordered question UIDs, question count, metadata, either materialized questions or an immutable server reference, creation/expiry times, and `payloadHash`. The hash is SHA-256 over UTF-8 RFC 8785 canonical JSON of the complete envelope with only `payloadHash` omitted. Producers compute it; every consumer checks the exact contract version, request identity, mode, count, UID order, expiry, and recomputed hash.

## Transport and authority

Browser output transport is one IndexedDB record per `(ownerId, outputRequestId)` with a 30-minute TTL. The URL carries only the exact request and owner IDs. Reopen/reload reads that same record; missing, expired, mismatched, or partial data fails closed with a reopen action. A/B windows have distinct request IDs. Cleanup is restricted to the matching owner/request record; TTL sweeping may remove only expired records in this contract's object store. IndexedDB is temporary transport and never an authority for saved papers or assignments.

Saved Paper and historical Assignment content continues to come from the existing server immutable snapshot. Worker/PDF producers construct the same envelope from that snapshot/assignment and pass the envelope through the Worker-to-renderer transport; the renderer validates it independently and never reads browser IndexedDB.

## Delivery order and acceptance

1. Remove stale/generic fallback and questions/meta split writes; atomically persist/consume one envelope. Cover hash/version, partial payloads, request isolation, TTL, quota/serialization failure, reload, and owner-scoped cleanup.
2. Measure each existing capacity boundary independently and reject oversize payloads explicitly. Seal PDF readiness only when the envelope identity matches, required images load and decode, math rendering completes, pages exist, and layout has no clipping/overflow.
3. Reuse Archive1's current-source exam/solution/answer direct actions. Reopen historical output from its exact frozen Assignment snapshot. Add one-click output actions to compatible recent/board assignment rows, grouping only by identical snapshot hash/source identity.
4. Verify real browser viewports and QPP 4/6/8, Worker runtime, and PDF generation/failure cases. Keep the canonical namespace lock and existing grade/source authority unchanged.
