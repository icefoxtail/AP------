(function attachPrintRuntime(root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APPrintRuntime = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildPrintRuntime() {
    'use strict';
    const STATES = Object.freeze(['DATA_READY', 'MATH_READY', 'IMAGE_READY', 'LAYOUT_READY', 'RENDER_READY', 'PRINT_READY']);

    class PrintReadinessViolation extends Error {
        constructor(code, details) {
            super(code);
            this.name = 'PrintReadinessViolation';
            this.code = code;
            this.details = details || null;
        }
    }

    function createReadinessTracker(adapter) {
        const adapterName = String(adapter || '').trim();
        if (!adapterName) throw new PrintReadinessViolation('MISSING_ADAPTER');
        let transaction = 0;
        let cursor = -1;
        let events = [];
        function begin(evidence) {
            transaction += 1;
            cursor = -1;
            events = [];
            return Object.freeze({ transaction, adapter: adapterName, evidence: evidence || null });
        }
        function mark(state, evidence) {
            const expected = STATES[cursor + 1];
            if (state !== expected) throw new PrintReadinessViolation('INVALID_READINESS_TRANSITION', { adapter: adapterName, expected, received: state, transaction });
            if (evidence === undefined || evidence === null) throw new PrintReadinessViolation('MISSING_READINESS_EVIDENCE', { adapter: adapterName, state, transaction });
            cursor += 1;
            const event = Object.freeze({ state, evidence });
            events.push(event);
            return event;
        }
        function snapshot() {
            return Object.freeze({
                adapter: adapterName,
                transaction,
                state: cursor < 0 ? null : STATES[cursor],
                ready: cursor === STATES.length - 1,
                events: Object.freeze(events.slice())
            });
        }
        return Object.freeze({ begin, mark, snapshot });
    }

    return Object.freeze({ STATES, PrintReadinessViolation, createReadinessTracker });
}));
