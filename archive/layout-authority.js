(function attachLayoutAuthority(root, factory) {
    const contract = typeof module === 'object' && module.exports ? require('./print-contract.js') : root && root.APPrintContract;
    const api = factory(contract);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APLayoutAuthority = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function buildLayoutAuthority(C) {
    'use strict';

    function fail(message) { throw new Error(message); }
    function positive(value, field) { const number = Number(value); if (!Number.isFinite(number) || number <= 0) fail('INVALID_' + field); return number; }
    function positiveInteger(value, field, fallback) { if (value === undefined || value === null) return fallback; const number = Number(value); if (!Number.isInteger(number) || number < 1) fail('INVALID_' + field); return number; }
    function safeText(value, field) { const string = String(value || '').trim(); if (!string) fail('MISSING_' + field); return string; }

    /*
     * The core accepts geometry and renderable-block measurement facts only.
     * Source and recipient identifiers are attached after placement succeeds.
     */
    function normalizeBlock(raw, index, columns, measurementMode) {
        const block = raw || {};
        for (const forbidden of ['sourceArchiveFile', 'sourceQuestionUid', 'studentId', 'recipientId', 'packetKey', 'archiveFile']) {
            if (Object.prototype.hasOwnProperty.call(block, forbidden)) fail('SOURCE_DATA_FORBIDDEN_IN_LAYOUT:' + forbidden);
        }
        const layoutTag = block.layoutTag ? String(block.layoutTag) : '';
        const impliedFullWidth = /(?:^|[-_])full(?:width)?(?:$|[-_])|wide/i.test(layoutTag);
        const columnSpan = positiveInteger(block.columnSpan, 'COLUMN_SPAN', impliedFullWidth ? columns : 1);
        if (columnSpan > columns) fail('COLUMN_SPAN_EXCEEDS_PAGE_COLUMNS');
        const measurements = block.measurements && typeof block.measurements === 'object' ? block.measurements : {};
        const selectedHeight = measurements[measurementMode] ?? block.measuredHeight;
        const slotOccupancy = positiveInteger(block.slotOccupancy, 'SLOT_OCCUPANCY', block.continuationOf ? 0 : 1);
        return Object.freeze({
            blockId: safeText(block.blockId, 'BLOCK_ID'),
            questionKey: String(block.questionKey || block.blockId).trim(),
            measuredHeight: positive(selectedHeight, 'BLOCK_HEIGHT'),
            measurements: Object.freeze({ raw: measurements.raw ?? block.measuredHeight ?? null, tight: measurements.tight ?? null }),
            measurementMode,
            slotOccupancy,
            columnSpan,
            layoutTag,
            breakBefore: block.breakBefore === true,
            blankPageAfter: block.blankPageAfter === true,
            continuationOf: block.continuationOf ? String(block.continuationOf) : '',
            order: index
        });
    }

    function createPage(pageNo, columns, usableHeight) {
        return {
            pageNo,
            usableHeight,
            columns: Array.from({ length: columns }, (_, index) => ({ columnNo: index + 1, usedHeight: 0, items: [] })),
            questionKeys: new Set(),
            slotOccupancy: 0,
            itemPlacements: [],
            isBlank: false
        };
    }

    function publicPage(page) {
        return Object.freeze({
            pageNo: page.pageNo,
            isBlank: page.isBlank,
            columns: Object.freeze(page.columns.map(column => Object.freeze({
                columnNo: column.columnNo,
                usedHeight: column.usedHeight,
                items: Object.freeze(column.items.map(item => Object.freeze({ ...item })))
            }))),
            blockIds: Object.freeze(page.itemPlacements.map(item => item.blockId)),
            questionKeys: Object.freeze(Array.from(page.questionKeys)),
            slotOccupancy: page.slotOccupancy,
            itemPlacements: Object.freeze(page.itemPlacements.map(item => Object.freeze({ ...item })))
        });
    }

    function canAddQuestion(page, block, qpp) {
        return !qpp || block.continuationOf || page.questionKeys.has(block.questionKey) || page.slotOccupancy + block.slotOccupancy <= qpp;
    }

    function placeBlock(page, block, capacity, blockGap) {
        if (block.columnSpan > 1) {
            const wasKnownQuestion = page.questionKeys.has(block.questionKey);
            const baseline = Math.max(...page.columns.map(column => column.usedHeight));
            const gapBefore = page.itemPlacements.length ? blockGap : 0;
            if (page.itemPlacements.length && baseline + gapBefore + block.measuredHeight > capacity) return false;
            const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: 1, columnSpan: block.columnSpan, layoutTag: block.layoutTag, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore };
            page.itemPlacements.push(item);
            for (let index = 0; index < block.columnSpan; index++) {
                page.columns[index].usedHeight = baseline + gapBefore + block.measuredHeight;
                page.columns[index].items.push(item);
            }
            page.questionKeys.add(block.questionKey);
            if (!block.continuationOf && !wasKnownQuestion) page.slotOccupancy += block.slotOccupancy;
            return true;
        }
        const wasKnownQuestion = page.questionKeys.has(block.questionKey);
        const continuationPlacement = block.continuationOf && page.itemPlacements.find(item => item.blockId === block.continuationOf);
        const continuationColumn = continuationPlacement && page.columns.find(column => column.columnNo === continuationPlacement.columnNo);
        const continuationGap = continuationColumn && continuationColumn.items.length ? blockGap : 0;
        if (continuationColumn && continuationColumn.usedHeight + continuationGap + block.measuredHeight <= capacity) {
            const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: continuationColumn.columnNo, columnSpan: 1, layoutTag: block.layoutTag, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore: continuationGap };
            page.itemPlacements.push(item);
            continuationColumn.items.push(item);
            continuationColumn.usedHeight += continuationGap + block.measuredHeight;
            page.questionKeys.add(block.questionKey);
            return true;
        }
        const candidates = page.columns.filter(column => column.usedHeight + (column.items.length ? blockGap : 0) + block.measuredHeight <= capacity)
            .sort((left, right) => left.usedHeight - right.usedHeight || left.columnNo - right.columnNo);
        if (!candidates.length && page.itemPlacements.length) return false;
        const column = candidates[0] || page.columns.slice().sort((left, right) => left.usedHeight - right.usedHeight)[0];
        const gapBefore = column.items.length ? blockGap : 0;
        const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: column.columnNo, columnSpan: 1, layoutTag: block.layoutTag, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore };
        page.itemPlacements.push(item);
        column.items.push(item);
        column.usedHeight += gapBefore + block.measuredHeight;
        page.questionKeys.add(block.questionKey);
        if (!block.continuationOf && !wasKnownQuestion) page.slotOccupancy += block.slotOccupancy;
        return true;
    }

    function paginateRenderableBlocks(input) {
        const config = input || {};
        const geometry = config.pageGeometry || {};
        const capacity = positive(geometry.usableHeight, 'PAGE_GEOMETRY');
        const columns = positiveInteger(geometry.columns, 'PAGE_COLUMNS', 2);
        const qpp = geometry.qpp === undefined || geometry.qpp === null ? null : positiveInteger(geometry.qpp, 'QPP');
        const blockGap = geometry.blockGap === undefined ? 0 : Math.max(0, Number(geometry.blockGap) || 0);
        const measurementMode = geometry.measurementMode === 'tight' ? 'tight' : 'raw';
        const rawBlocks = Array.isArray(config.blocks) ? config.blocks : fail('BLOCKS_MUST_BE_ARRAY');
        const blocks = rawBlocks.map((block, index) => normalizeBlock(block, index, columns, measurementMode));
        const pages = [];
        const overflowEvidence = [];
        const continuationMap = [];
        let page = createPage(1, columns, capacity);
        const flush = () => {
            if (page.itemPlacements.length || page.isBlank) pages.push(publicPage(page));
            page = createPage(pages.length + 1, columns, capacity);
        };

        for (const block of blocks) {
            if (block.breakBefore && page.itemPlacements.length) flush();
            if (!canAddQuestion(page, block, qpp) && page.itemPlacements.length) flush();
            if (block.measuredHeight > capacity) overflowEvidence.push(Object.freeze({ blockId: block.blockId, measuredHeight: block.measuredHeight, usableHeight: capacity, measurementMode, code: 'BLOCK_EXCEEDS_PAGE' }));
            if (!placeBlock(page, block, capacity, blockGap)) {
                flush();
                placeBlock(page, block, capacity, blockGap);
            }
            if (block.continuationOf) continuationMap.push(Object.freeze({ continuationBlockId: block.blockId, sourceBlockId: block.continuationOf, pageNo: page.pageNo }));
            if (block.blankPageAfter) {
                flush();
                page.isBlank = true;
                flush();
            }
        }
        if (page.itemPlacements.length || page.isBlank) pages.push(publicPage(page));
        const columnMap = pages.flatMap(page => page.itemPlacements.map(item => Object.freeze({ pageNo: page.pageNo, ...item })));
        return Object.freeze({
            pages: Object.freeze(pages),
            columnMap: Object.freeze(columnMap),
            continuationMap: Object.freeze(continuationMap),
            overflowEvidence: Object.freeze(overflowEvidence),
            qpp,
            columns,
            blockGap,
            measurementMode,
            usableHeight: capacity
        });
    }

    function materializeLayoutMaps(layout, blockMap, options) {
        if (!C) fail('APPrintContract must load before APLayoutAuthority');
        const lookup = blockMap || {};
        const config = options || {};
        const pages = layout.pages.map(page => {
            if (page.isBlank) return {
                pageNo: page.pageNo,
                sectionId: config.blankSectionId || '__blank__',
                recipientId: config.recipientId || null,
                questionSourceRefs: [], displayNos: [], continuations: [], hasBlankPage: true
            };
            const records = page.itemPlacements.map(item => ({ item, record: lookup[item.blockId] || fail('UNKNOWN_BLOCK:' + item.blockId) }));
            const first = records[0] && records[0].record;
            const sectionId = String((first && first.sectionId) || config.sectionId || '').trim();
            if (!sectionId) fail('MISSING_SECTION_ID_FOR_PAGEMAP');
            const primary = records.filter(entry => !entry.item.continuationOf);
            return {
                pageNo: page.pageNo,
                sectionId,
                recipientId: (first && first.recipientId) || config.recipientId || null,
                questionSourceRefs: primary.map(entry => entry.record.sourceRef),
                displayNos: primary.map(entry => entry.record.displayNo),
                continuations: records.filter(entry => entry.item.continuationOf).map(entry => entry.item.continuationOf),
                hasBlankPage: false
            };
        });
        const pageMap = C.createPageMap({ pages });
        return Object.freeze({ pageMap, columnMap: layout.columnMap, continuationMap: layout.continuationMap, overflowEvidence: layout.overflowEvidence });
    }

    function materializePageMap(layout, blockMap, options) {
        return materializeLayoutMaps(layout, blockMap, options).pageMap;
    }

    return Object.freeze({ paginateRenderableBlocks, materializeLayoutMaps, materializePageMap });
}));
