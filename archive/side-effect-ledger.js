(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APSideEffectLedger = api;
}(typeof globalThis === 'undefined' ? this : globalThis, function () {
    'use strict';
    // Phase 0 froze no reversible external precommit effects. Refuse them,
    // rather than claiming a compensation guarantee the receivers do not have.
    function create() {
        const entries = new Map();
        const compensationLedger = [];
        const counters = { DUPLICATE_LOGICAL_EFFECT_CREATION_COUNT: 0, RETRY_IDEMPOTENCY_KEY_MISMATCH_COUNT: 0, RETRY_LOGICAL_EFFECT_ID_MISMATCH_COUNT: 0, BACKGROUND_SIDE_EFFECT_COUNT: 0, MISSED_REQUIRED_EFFECT_COUNT: 0, UNRESOLVED_REQUIRED_EFFECT_COUNT: 0, UNRESOLVED_REQUIRED_COMPENSATION_COUNT: 0 };
        function execute({ effectId, key, triggerEventId, foreground, phase = 'POST_COMMIT', failurePolicy = 'BEST_EFFORT_LOG_ONLY', run }) {
            if (phase !== 'POST_COMMIT' || failurePolicy === 'BLOCK_BEFORE_COMMIT') throw new Error('PRECOMMIT_EXTERNAL_EFFECT_FORBIDDEN');
            if (!foreground) return Promise.resolve({ state: 'SKIPPED_BY_CONTRACT' });
            const logicalEffectId = `${effectId}:${key}`;
            let record = entries.get(logicalEffectId);
            if (record?.state === 'ACKNOWLEDGED' || record?.state === 'RUNNING') return record.promise || Promise.resolve(record);
            if (!record) {
                record = { logicalEffectId, effectId, triggerEventId, idempotencyKey: key, attempt: 0, state: 'PENDING', lastError: null, createdAt: Date.now(), required: false };
                entries.set(logicalEffectId, record);
            }
            record.attempt += 1;
            record.state = 'RUNNING';
            record.updatedAt = Date.now();
            record.promise = Promise.resolve().then(run).then(outcome => {
                if (outcome?.ok !== true) throw new Error(outcome?.code || 'EFFECT_NOT_ACKNOWLEDGED');
                record.state = 'ACKNOWLEDGED';
                record.lastError = null;
                return record;
            }).catch(error => {
                record.state = 'FAILED_RETRYABLE';
                record.retryPolicy = 'NEXT_ACTIVATION_ONLY';
                record.lastError = String(error?.message || error);
                return record;
            }).finally(() => { record.updatedAt = Date.now(); delete record.promise; });
            return record.promise;
        }
        function snapshot() {
            return { entries: [...entries.values()].map(({ promise, ...record }) => ({ ...record })), compensationLedger: [...compensationLedger], counters: { ...counters } };
        }
        return Object.freeze({ execute, snapshot });
    }
    return Object.freeze({ create });
}));
