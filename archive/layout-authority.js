(function attachLayoutAuthority(root, factory) {
    const contract = typeof module === 'object' && module.exports ? require('./print-contract.js') : root && root.APPrintContract;
    const api = factory(contract);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APLayoutAuthority = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildLayoutAuthority(C) {
    'use strict';
    function fail(message) { throw new Error(message); }
    function positive(value, field) { const n = Number(value); if (!Number.isFinite(n) || n <= 0) fail(`INVALID_${field}`); return n; }

    // The core intentionally knows block IDs only. SourceRef and recipient data
    // are applied by materializePageMap after measurement/pagination succeeds.
    function paginateRenderableBlocks(input) {
        const config = input || {};
        const capacity = positive(config.pageGeometry && config.pageGeometry.usableHeight, 'PAGE_GEOMETRY');
        const blocks = Array.isArray(config.blocks) ? config.blocks : fail('BLOCKS_MUST_BE_ARRAY');
        const pages = [];
        const overflowEvidence = [];
        let page = [];
        let used = 0;
        const flush = () => { if (page.length) { pages.push(page); page = []; used = 0; } };
        for (const block of blocks) {
            const id = String(block && block.blockId || '').trim();
            const height = positive(block && block.measuredHeight, 'BLOCK_HEIGHT');
            if (!id) fail('MISSING_BLOCK_ID');
            if (height > capacity) overflowEvidence.push({ blockId: id, measuredHeight: height, usableHeight: capacity, code: 'BLOCK_EXCEEDS_PAGE' });
            if (page.length && used + height > capacity) flush();
            page.push({ blockId: id, measuredHeight: height });
            used += height;
        }
        flush();
        return Object.freeze({ pages: Object.freeze(pages.map(items => Object.freeze(items))), overflowEvidence: Object.freeze(overflowEvidence) });
    }

    function materializePageMap(layout, blockMap) {
        if (!C) fail('APPrintContract must load before APLayoutAuthority');
        const lookup = blockMap || {};
        return C.createPageMap({ pages: layout.pages.map((items, index) => {
            const records = items.map(item => lookup[item.blockId] || fail(`UNKNOWN_BLOCK:${item.blockId}`));
            return {
                pageNo: index + 1,
                sectionId: String(records[0] && records[0].sectionId || ''),
                recipientId: records[0] && records[0].recipientId || null,
                questionSourceRefs: records.map(record => record.sourceRef),
                displayNos: records.map(record => record.displayNo),
                continuations: [],
                hasBlankPage: false
            };
        }) });
    }

    return Object.freeze({ paginateRenderableBlocks, materializePageMap });
}));
