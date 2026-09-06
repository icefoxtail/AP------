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
    function normalizeBlock(raw, index, columns, measurementMode, slotRows) {
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
        const placementKind = layoutTag === 'subjective-2up'
            ? 'subjective-2up'
            : layoutTag === 'subjective-4up'
            ? 'subjective-4up'
            : impliedFullWidth
            ? 'fullwidth'
            : 'normal';
        const slotSpanRows = placementKind === 'subjective-2up'
            ? slotRows
            : placementKind === 'subjective-4up'
            ? Math.max(1, Math.ceil(slotRows / 2))
            : 1;
        const slotOccupancy = positiveInteger(block.slotOccupancy, 'SLOT_OCCUPANCY', block.continuationOf ? 0 : slotSpanRows);
        return Object.freeze({
            blockId: safeText(block.blockId, 'BLOCK_ID'),
            questionKey: String(block.questionKey || block.blockId).trim(),
            measuredHeight: positive(selectedHeight, 'BLOCK_HEIGHT'),
            measurements: Object.freeze({ raw: measurements.raw ?? block.measuredHeight ?? null, tight: measurements.tight ?? null }),
            measurementMode,
            slotOccupancy,
            slotSpanRows,
            placementKind,
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
            const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: 1, columnSpan: block.columnSpan, layoutTag: block.layoutTag, placementKind: block.placementKind, slotSpanRows: block.slotSpanRows, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore, columnOrder: page.columns[0].items.length, placementOrder: page.itemPlacements.length };
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
            const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: continuationColumn.columnNo, columnSpan: 1, layoutTag: block.layoutTag, placementKind: block.placementKind, slotSpanRows: block.slotSpanRows, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore: continuationGap, columnOrder: continuationColumn.items.length, placementOrder: page.itemPlacements.length };
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
        const item = { blockId: block.blockId, questionKey: block.questionKey, columnNo: column.columnNo, columnSpan: 1, layoutTag: block.layoutTag, placementKind: block.placementKind, slotSpanRows: block.slotSpanRows, continuationOf: block.continuationOf, slotOccupancy: block.slotOccupancy, measurementMode: block.measurementMode, gapBefore, columnOrder: column.items.length, placementOrder: page.itemPlacements.length };
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
        const slotRows = Math.max(1, Math.ceil((qpp || columns * 2) / columns));
        const rawBlocks = Array.isArray(config.blocks) ? config.blocks : fail('BLOCKS_MUST_BE_ARRAY');
        const blocks = rawBlocks.map((block, index) => normalizeBlock(block, index, columns, measurementMode, slotRows));
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
            slotRows,
            usableHeight: capacity
        });
    }

    // Pure extraction of the production two-column planner. It intentionally
    // does not replace paginateRenderableBlocks(): the generic shortest-column
    // planner stays available, while promotion compares this deterministic
    // SLOT_POLICY / CHUNK_POLICY output against legacy DOM observation.
    function planLegacyProductionLayout(input) {
        const config = input || {};
        const geometry = config.pageGeometry || {};
        const usableHeight = positive(geometry.usableHeight, 'LEGACY_PLANNER_PAGE_GEOMETRY');
        const columns = positiveInteger(geometry.columns, 'LEGACY_PLANNER_COLUMNS', 2);
        const qpp = positiveInteger(geometry.qpp, 'LEGACY_PLANNER_QPP', columns * 2);
        const blockGap = geometry.blockGap === undefined ? 0 : Math.max(0, Number(geometry.blockGap) || 0);
        const measurementMode = geometry.measurementMode === 'tight' ? 'tight' : 'raw';
        const slotRows = Math.max(1, Math.ceil(qpp / columns));
        const blocks = (config.blocks || []).map((block, index) => normalizeBlock(block, index, columns, measurementMode, slotRows));
        const overflowEvidence = blocks.filter(block => block.measuredHeight > usableHeight).map(block => Object.freeze({
            blockId: block.blockId, measuredHeight: block.measuredHeight, usableHeight, measurementMode, code: 'BLOCK_EXCEEDS_PAGE'
        }));
        const rawPages = [];
        const createPlannerPage = () => ({ columns: Array.from({ length: columns }, (_, index) => ({ columnNo: index + 1, items: [] })), itemPlacements: [] });
        const makeItem = (page, block, columnNo, columnSpan, extra = {}) => ({
            blockId: block.blockId,
            questionKey: block.questionKey,
            columnNo,
            columnSpan,
            layoutTag: block.layoutTag,
            placementKind: extra.placementKind || block.placementKind,
            slotSpanRows: extra.slotSpanRows || block.slotSpanRows,
            continuationOf: block.continuationOf,
            slotOccupancy: block.slotOccupancy,
            measurementMode: block.measurementMode,
            gapBefore: extra.gapBefore || 0,
            columnOrder: page.columns[columnNo - 1].items.length,
            placementOrder: page.itemPlacements.length
        });
        const addItem = (page, block, columnNo, columnSpan, extra) => {
            const item = makeItem(page, block, columnNo, columnSpan, extra);
            page.columns[columnNo - 1].items.push(item);
            page.itemPlacements.push(item);
            return item;
        };
        const flush = page => { if (page.itemPlacements.length) rawPages.push(page); };

        const slotPolicy = blocks.some(block => block.placementKind === 'subjective-2up' || block.placementKind === 'subjective-4up');
        if (slotPolicy) {
            let slotPage = { page: createPlannerPage(), occupied: Array.from({ length: slotRows }, () => Array(columns).fill(false)), placements: [] };
            const materializeSlotPage = () => {
                if (!slotPage.placements.length) return;
                const hasSpecialPlacement = slotPage.placements.some(placement => placement.span > 1);
                if (!hasSpecialPlacement) {
                    const ordered = slotPage.placements.slice().sort((left, right) => left.block.order - right.block.order);
                    const split = Math.ceil(ordered.length / columns);
                    ordered.slice(0, split).forEach(placement => addItem(slotPage.page, placement.block, 1, 1, { placementKind: placement.block.placementKind, slotSpanRows: placement.span }));
                    ordered.slice(split).forEach(placement => addItem(slotPage.page, placement.block, 2, 1, { placementKind: placement.block.placementKind, slotSpanRows: placement.span }));
                } else {
                    slotPage.placements.slice().sort((left, right) => left.column - right.column || left.row - right.row || left.block.order - right.block.order)
                        .forEach(placement => addItem(slotPage.page, placement.block, placement.column + 1, 1, {
                            placementKind: placement.block.placementKind,
                            slotSpanRows: placement.span
                        }));
                }
                flush(slotPage.page);
            };
            const flushSlot = () => { materializeSlotPage(); slotPage = { page: createPlannerPage(), occupied: Array.from({ length: slotRows }, () => Array(columns).fill(false)), placements: [] }; };
            const findSlot = span => {
                for (let row = 0; row <= slotRows - span; row += 1) {
                    for (let column = 0; column < columns; column += 1) {
                        if (Array.from({ length: span }, (_, offset) => !slotPage.occupied[row + offset][column]).every(Boolean)) return { row, column, span };
                    }
                }
                return null;
            };
            const repackForFullHeight = () => {
                const usedSpan = slotPage.placements.reduce((sum, placement) => sum + placement.span, 0);
                if (usedSpan > slotRows) return false;
                slotPage.occupied = Array.from({ length: slotRows }, () => Array(columns).fill(false));
                let row = 0;
                slotPage.placements.forEach(placement => {
                    placement.row = row; placement.column = 0;
                    for (let offset = 0; offset < placement.span; offset += 1) slotPage.occupied[row + offset][0] = true;
                    row += placement.span;
                });
                return true;
            };
            for (const block of blocks) {
                if (block.columnSpan > 1) {
                    flushSlot();
                    const wide = createPlannerPage();
                    addItem(wide, block, 1, columns, { placementKind: 'fullwidth', slotSpanRows: 1 });
                    flush(wide);
                    continue;
                }
                const span = Math.min(slotRows, block.slotSpanRows);
                let placement = findSlot(span);
                if (!placement && span === slotRows && repackForFullHeight()) placement = findSlot(span);
                if (!placement) { flushSlot(); placement = findSlot(span); }
                for (let offset = 0; offset < span; offset += 1) slotPage.occupied[placement.row + offset][placement.column] = true;
                slotPage.placements.push({ block, ...placement });
            }
            materializeSlotPage();
        } else {
            let chunk = [];
            const flushChunk = () => {
                if (!chunk.length) return;
                const page = createPlannerPage();
                const split = Math.ceil(chunk.length / columns);
                chunk.slice(0, split).forEach(block => addItem(page, block, 1, 1, { gapBefore: page.itemPlacements.length ? blockGap : 0 }));
                chunk.slice(split).forEach(block => addItem(page, block, 2, 1, { gapBefore: page.columns[1].items.length ? blockGap : 0 }));
                flush(page);
                chunk = [];
            };
            for (const block of blocks) {
                if (block.columnSpan > 1) {
                    flushChunk();
                    const page = createPlannerPage();
                    addItem(page, block, 1, columns, { placementKind: 'fullwidth', slotSpanRows: 1 });
                    flush(page);
                    continue;
                }
                chunk.push(block);
                if (chunk.length >= qpp) flushChunk();
            }
            flushChunk();
        }
        const pages = rawPages.map((page, index) => Object.freeze({
            pageNo: index + 1,
            isBlank: false,
            columns: Object.freeze(page.columns.map(column => Object.freeze({ columnNo: column.columnNo, usedHeight: 0, items: Object.freeze(column.items.map(item => Object.freeze({ ...item }))) }))),
            blockIds: Object.freeze(page.itemPlacements.map(item => item.blockId)),
            questionKeys: Object.freeze(Array.from(new Set(page.itemPlacements.map(item => item.questionKey)))),
            slotOccupancy: page.itemPlacements.reduce((sum, item) => sum + (item.continuationOf ? 0 : item.slotOccupancy), 0),
            itemPlacements: Object.freeze(page.itemPlacements.map(item => Object.freeze({ ...item })))
        }));
        const columnMap = pages.flatMap(page => page.columns.flatMap(column => column.items
            .filter(item => item.columnSpan === 1 || column.columnNo === 1)
            .map(item => Object.freeze({ pageNo: page.pageNo, ...item }))));
        const continuationMap = columnMap.filter(item => item.continuationOf).map(item => Object.freeze({ continuationBlockId: item.blockId, sourceBlockId: item.continuationOf, pageNo: item.pageNo }));
        return Object.freeze({ pages: Object.freeze(pages), columnMap: Object.freeze(columnMap), continuationMap: Object.freeze(continuationMap), overflowEvidence: Object.freeze(overflowEvidence), qpp, columns, blockGap, measurementMode, slotRows, usableHeight, planner: 'LEGACY_SLOT_CHUNK_POLICY' });
    }

    function coordinateColumnMap(pages) {
        return Object.freeze(pages.flatMap(page => {
            const seenWide = new Set();
            return page.columns.flatMap(column => column.items.filter(item => {
                if (item.columnSpan <= 1) return true;
                if (seenWide.has(item.blockId)) return false;
                seenWide.add(item.blockId);
                return true;
            }).map(item => Object.freeze({ pageNo: page.pageNo, ...item })));
        }));
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
        return Object.freeze({ pageMap, columnMap: coordinateColumnMap(layout.pages), continuationMap: layout.continuationMap, overflowEvidence: layout.overflowEvidence });
    }

    function materializePageMap(layout, blockMap, options) {
        return materializeLayoutMaps(layout, blockMap, options).pageMap;
    }

    // Promotion bridge: adapters provide already-observed legacy placement facts.
    // The core never reads source/recipient data from DOM; it reattaches those
    // facts only through the adapter-owned blockMap, exactly as PageMap does.
    function materializeLegacyLayoutMaps(input, blockMap, options) {
        if (!C) fail('APPrintContract must load before APLayoutAuthority');
        const legacy = input || {};
        const lookup = blockMap || {};
        const config = options || {};
        const pages = (legacy.pages || []).map((rawPage, pageIndex) => {
            const pageNo = positiveInteger(rawPage.pageNo, 'LEGACY_PAGE_NO', pageIndex + 1);
            const isBlank = rawPage.isBlank === true;
            const columns = (rawPage.columns || []).map((rawColumn, columnIndex) => ({
                columnNo: positiveInteger(rawColumn.columnNo, 'LEGACY_COLUMN_NO', columnIndex + 1),
                items: (rawColumn.items || []).map((rawItem, itemIndex) => {
                    const blockId = safeText(rawItem.blockId, 'LEGACY_BLOCK_ID');
                    const record = lookup[blockId] || fail('UNKNOWN_LEGACY_BLOCK:' + blockId);
                    return Object.freeze({
                        blockId,
                        questionKey: String(rawItem.questionKey || blockId),
                        columnNo: positiveInteger(rawItem.columnNo, 'LEGACY_ITEM_COLUMN_NO', columnIndex + 1),
                        columnSpan: positiveInteger(rawItem.columnSpan, 'LEGACY_ITEM_COLUMN_SPAN', 1),
                        layoutTag: String(rawItem.layoutTag || record.layoutTag || ''),
                        placementKind: String(rawItem.placementKind || 'normal'),
                        slotSpanRows: positiveInteger(rawItem.slotSpanRows, 'LEGACY_SLOT_SPAN_ROWS', 1),
                        continuationOf: rawItem.continuationOf ? String(rawItem.continuationOf) : '',
                        slotOccupancy: rawItem.slotOccupancy === undefined ? 1 : Number(rawItem.slotOccupancy),
                        measurementMode: rawItem.measurementMode === 'tight' ? 'tight' : 'raw',
                        columnOrder: rawItem.columnOrder === undefined ? itemIndex : Number(rawItem.columnOrder),
                        placementOrder: rawItem.placementOrder === undefined ? itemIndex : Number(rawItem.placementOrder),
                        sourceRef: record.sourceRef,
                        displayNo: record.displayNo,
                        sectionId: record.sectionId || config.sectionId || '',
                        recipientId: record.recipientId || config.recipientId || null
                    });
                })
            }));
            const flatItems = columns.flatMap(column => column.items);
            const first = flatItems[0];
            const sectionId = String(first?.sectionId || config.sectionId || '').trim();
            if (!isBlank && !sectionId) fail('MISSING_SECTION_ID_FOR_LEGACY_PAGEMAP');
            const primary = flatItems.filter(item => !item.continuationOf);
            return Object.freeze({
                pageNo,
                isBlank,
                columns: Object.freeze(columns.map(column => Object.freeze({
                    columnNo: column.columnNo,
                    items: Object.freeze(column.items.map(item => Object.freeze({ ...item })))
                }))),
                pageMap: Object.freeze({
                    pageNo,
                    sectionId: isBlank ? (config.blankSectionId || '__blank__') : sectionId,
                    recipientId: first?.recipientId || config.recipientId || null,
                    questionSourceRefs: primary.map(item => item.sourceRef),
                    displayNos: primary.map(item => item.displayNo),
                    continuations: flatItems.filter(item => item.continuationOf).map(item => item.continuationOf),
                    hasBlankPage: isBlank
                })
            });
        });
        const columnMap = pages.flatMap(page => page.columns.flatMap(column => column.items.map(item => Object.freeze({
            pageNo: page.pageNo,
            blockId: item.blockId,
            questionKey: item.questionKey,
            columnNo: item.columnNo,
            columnSpan: item.columnSpan,
            layoutTag: item.layoutTag,
            placementKind: item.placementKind,
            slotSpanRows: item.slotSpanRows,
            continuationOf: item.continuationOf,
            slotOccupancy: item.slotOccupancy,
            measurementMode: item.measurementMode,
            columnOrder: item.columnOrder,
            placementOrder: item.placementOrder
        }))));
        const continuationMap = columnMap.filter(item => item.continuationOf).map(item => Object.freeze({
            continuationBlockId: item.blockId,
            sourceBlockId: item.continuationOf,
            pageNo: item.pageNo
        }));
        return Object.freeze({
            pageMap: C.createPageMap({ pages: pages.map(page => page.pageMap) }),
            columnMap: Object.freeze(columnMap),
            continuationMap: Object.freeze(continuationMap),
            overflowEvidence: Object.freeze((legacy.overflowEvidence || []).map(item => Object.freeze({ ...item }))),
            qpp: legacy.qpp === undefined || legacy.qpp === null ? null : positiveInteger(legacy.qpp, 'LEGACY_QPP', null)
        });
    }

    function buildExpectedLayoutMaps(input, blockMap, options) {
        const layout = (input?.planner === 'LEGACY_SLOT_CHUNK_POLICY' || input?.pageGeometry?.planner === 'LEGACY_SLOT_CHUNK_POLICY')
            ? planLegacyProductionLayout(input)
            : paginateRenderableBlocks(input);
        return Object.freeze({ layout, ...materializeLayoutMaps(layout, blockMap, options) });
    }

    function sourceRefKey(ref) {
        return C.sourceRefKey(ref);
    }

    function pageSignature(page) {
        const entries = page.questionSourceRefs.map((ref, index) => ({ ref: sourceRefKey(ref), displayNo: page.displayNos[index] }))
            .sort((left, right) => left.displayNo - right.displayNo || left.ref.localeCompare(right.ref));
        return JSON.stringify({
            pageNo: page.pageNo,
            sectionId: page.sectionId,
            recipientId: page.recipientId || null,
            refs: entries.map(entry => entry.ref),
            displayNos: entries.map(entry => entry.displayNo),
            continuations: page.continuations,
            hasBlankPage: page.hasBlankPage === true
        });
    }

    function columnSignature(item) {
        return JSON.stringify({
            pageNo: item.pageNo,
            blockId: item.blockId,
            columnNo: item.columnNo,
            columnSpan: item.columnSpan,
            layoutTag: item.layoutTag || '',
            placementKind: item.placementKind || 'normal',
            slotSpanRows: item.slotSpanRows || 1,
            continuationOf: item.continuationOf || '',
            columnOrder: item.columnOrder || 0,
            placementOrder: item.placementOrder || 0
        });
    }

    function countPrimaryRefs(pageMap) {
        const counts = new Map();
        for (const page of pageMap.pages) {
            page.questionSourceRefs.forEach(ref => {
                const key = `${page.sectionId}\u0000${sourceRefKey(ref)}`;
                counts.set(key, (counts.get(key) || 0) + 1);
            });
        }
        return counts;
    }

    function comparePromotionLayouts(observed, expected) {
        const legacy = observed || fail('MISSING_OBSERVED_LAYOUT');
        const shared = expected || fail('MISSING_EXPECTED_LAYOUT');
        const differences = [];
        const compareList = (field, left, right) => {
            const a = left || [];
            const b = right || [];
            if (JSON.stringify(a) !== JSON.stringify(b)) differences.push(Object.freeze({ field, observed: a, expected: b }));
        };
        compareList('page', legacy.pageMap.pages.map(pageSignature), shared.pageMap.pages.map(pageSignature));
        compareList('column', legacy.columnMap.map(columnSignature).sort(), shared.columnMap.map(columnSignature).sort());
        compareList('continuation', legacy.continuationMap.map(item => `${item.pageNo}:${item.continuationBlockId}:${item.sourceBlockId}`), shared.continuationMap.map(item => `${item.pageNo}:${item.continuationBlockId}:${item.sourceBlockId}`));
        compareList('blankPage', legacy.pageMap.pages.filter(page => page.hasBlankPage).map(page => page.pageNo), shared.pageMap.pages.filter(page => page.hasBlankPage).map(page => page.pageNo));
        const observedOverflow = legacy.renderedOverflow || [];
        const expectedOverflow = shared.renderedOverflow || [];
        compareList('overflow', observedOverflow.map(item => `${item.pageNo}:${item.code}:${item.sourceRef || ''}`), expectedOverflow.map(item => `${item.pageNo}:${item.code}:${item.sourceRef || ''}`));
        if (legacy.qpp !== shared.layout.qpp) differences.push(Object.freeze({ field: 'qpp', observed: legacy.qpp, expected: shared.layout.qpp }));

        const observedCounts = countPrimaryRefs(legacy.pageMap);
        const expectedCounts = countPrimaryRefs(shared.pageMap);
        const omissions = Array.from(expectedCounts.keys()).filter(key => !observedCounts.has(key));
        const duplications = Array.from(observedCounts.entries()).filter(([key, count]) => count > (expectedCounts.get(key) || 0)).map(([key]) => key);
        if (omissions.length) differences.push(Object.freeze({ field: 'omission', observed: omissions, expected: [] }));
        if (duplications.length) differences.push(Object.freeze({ field: 'duplication', observed: duplications, expected: [] }));

        return Object.freeze({
            equal: differences.length === 0,
            differences: Object.freeze(differences),
            parity: Object.freeze({
                pages: differences.every(item => item.field !== 'page' && item.field !== 'blankPage'),
                columns: differences.every(item => item.field !== 'column'),
                continuations: differences.every(item => item.field !== 'continuation'),
                overflow: differences.every(item => item.field !== 'overflow'),
                qpp: differences.every(item => item.field !== 'qpp'),
                omissionCount: omissions.length,
                duplicationCount: duplications.length
            })
        });
    }

    // This is deliberately a bridge, not a renderer: it observes the legacy
    // DOM after it has rendered, asks the adapter to resolve source records,
    // and gives only source-free block facts to paginateRenderableBlocks().
    function observeLegacyDomLayout(area, options) {
        const root = area;
        if (!root || typeof root.querySelectorAll !== 'function') fail('INVALID_LEGACY_LAYOUT_ROOT');
        const config = options || {};
        if (typeof config.resolveRecord !== 'function') fail('MISSING_LEGACY_LAYOUT_RECORD_RESOLVER');
        const columns = positiveInteger(config.columns, 'LEGACY_LAYOUT_COLUMNS', 2);
        const qpp = positiveInteger(config.qpp, 'LEGACY_LAYOUT_QPP', columns * 2);
        const pageNodes = Array.from(root.querySelectorAll('.page'));
        const blockMap = {};
        const elementsByBlockId = {};
        const expectedBlocks = [];
        const overflowEvidence = [];
        const primaryBySource = new Map();
        const occurrenceBySource = new Map();
        let order = 0;
        const pages = pageNodes.map((pageNode, pageIndex) => {
            const pageNo = pageIndex + 1;
            if (pageNode.classList.contains('page-blank')) return { pageNo, isBlank: true, columns: [] };
            const columnItems = Array.from({ length: columns }, (_, index) => ({ columnNo: index + 1, items: [] }));
            const itemNodes = Array.from(pageNode.querySelectorAll('.q-box[data-source-ref], .ans-cell[data-source-ref]:not(.ans-cell-empty)'));
            let pagePlacementOrder = 0;
            itemNodes.forEach(node => {
                const sourceKey = String(node.getAttribute('data-source-ref') || '').trim();
                const record = config.resolveRecord(sourceKey, node);
                if (!record || !record.sourceRef || !Number.isInteger(Number(record.displayNo)) || Number(record.displayNo) < 1) {
                    fail('UNKNOWN_LEGACY_SOURCE_RECORD:' + sourceKey);
                }
                const occurrence = (occurrenceBySource.get(sourceKey) || 0) + 1;
                occurrenceBySource.set(sourceKey, occurrence);
                const hasQuestionNumber = Boolean(node.querySelector('.q-num'));
                const continuationOf = !hasQuestionNumber && primaryBySource.has(sourceKey) ? primaryBySource.get(sourceKey) : '';
                const blockId = `legacy:${sourceKey}:${occurrence}`;
                if (!continuationOf) primaryBySource.set(sourceKey, blockId);
                const gridColumn = node.closest('.grid-col');
                const grid = gridColumn?.parentElement;
                const columnNo = gridColumn && grid ? Math.min(columns, Math.max(1, Array.from(grid.children).indexOf(gridColumn) + 1)) : 1;
                const layoutTag = String(record.layoutTag || '');
                const impliedFullWidth = layoutTag === 'fullwidth' || record.wide === true || !gridColumn;
                const columnSpan = impliedFullWidth ? columns : 1;
                const slotRows = Math.max(1, Math.ceil(qpp / columns));
                const slotSpanRows = layoutTag === 'subjective-2up' ? slotRows : layoutTag === 'subjective-4up' ? Math.max(1, Math.ceil(slotRows / 2)) : 1;
                const placementKind = layoutTag === 'subjective-2up' ? 'subjective-2up' : layoutTag === 'subjective-4up' ? 'subjective-4up' : impliedFullWidth ? 'fullwidth' : 'normal';
                const measurements = record.measurements || {};
                const measuredHeight = Number(measurements.raw);
                const tightHeight = Number(measurements.tight);
                if (!Number.isFinite(measuredHeight) || measuredHeight <= 0 || !Number.isFinite(tightHeight) || tightHeight <= 0) {
                    fail('MISSING_STAGING_MEASUREMENT_LEDGER:' + sourceKey);
                }
                const container = gridColumn || pageNode;
                if (container.clientHeight > 0 && node.scrollHeight > container.clientHeight + 2) {
                    overflowEvidence.push({ blockId, code: 'LEGACY_BLOCK_OVERFLOW', measuredHeight, usableHeight: container.clientHeight, measurementMode: 'raw' });
                }
                blockMap[blockId] = {
                    sectionId: String(record.sectionId || config.sectionId || '').trim(),
                    recipientId: record.recipientId || config.recipientId || null,
                    sourceRef: record.sourceRef,
                    displayNo: Number(record.displayNo),
                    layoutTag,
                    wide: record.wide === true
                };
                elementsByBlockId[blockId] = node;
                const item = {
                    blockId,
                    questionKey: sourceKey,
                    columnNo,
                    columnSpan,
                    layoutTag,
                    placementKind,
                    slotSpanRows,
                    slotOccupancy: continuationOf ? 0 : slotSpanRows,
                    continuationOf,
                    measurementMode: 'raw',
                    columnOrder: columnItems[columnNo - 1].items.length,
                    placementOrder: pagePlacementOrder++
                };
                columnItems[columnNo - 1].items.push(item);
                expectedBlocks.push({
                    blockId,
                    questionKey: sourceKey,
                    measuredHeight,
                    measurements: { raw: measuredHeight, tight: tightHeight },
                    layoutTag,
                    columnSpan,
                    slotOccupancy: continuationOf ? 0 : slotSpanRows,
                    continuationOf
                });
                order += 1;
            });
            return { pageNo, isBlank: false, columns: columnItems };
        });
        const usableHeight = positive(config.usableHeight, 'STAGING_USABLE_HEIGHT');
        return Object.freeze({
            legacyInput: Object.freeze({ pages, overflowEvidence, qpp }),
            expectedInput: Object.freeze({
                pageGeometry: { usableHeight, columns, qpp, blockGap: Number(config.blockGap || 0), measurementMode: 'raw', planner: 'LEGACY_SLOT_CHUNK_POLICY' },
                blocks: expectedBlocks.slice().sort((left, right) => {
                    const leftRecord = blockMap[left.blockId];
                    const rightRecord = blockMap[right.blockId];
                    return leftRecord.displayNo - rightRecord.displayNo || left.blockId.localeCompare(right.blockId);
                })
            }),
            blockMap: Object.freeze(blockMap),
            elementsByBlockId: Object.freeze(elementsByBlockId)
        });
    }

    function inspectRenderedOverflow(root, options) {
        const config = options || {};
        const tolerance = Math.max(0, Number(config.tolerance ?? 2) || 0);
        const pages = Array.from(root?.querySelectorAll?.('.page') || []);
        const evidence = [];
        pages.forEach((page, pageIndex) => {
            if (page.classList.contains('page-blank')) return;
            const pageNo = pageIndex + 1;
            const body = page.querySelector('.page-body') || page;
            if (body.clientHeight > 0 && body.scrollHeight > body.clientHeight + tolerance) {
                evidence.push(Object.freeze({ pageNo, code: 'PAGE_BODY_CLIPPING', sourceRef: '' }));
            }
            Array.from(page.querySelectorAll('.q-box[data-source-ref], .ans-cell[data-source-ref]:not(.ans-cell-empty)')).forEach(node => {
                const container = node.closest('.grid-col') || body;
                if (container.clientHeight > 0 && node.scrollHeight > container.clientHeight + tolerance) {
                    evidence.push(Object.freeze({ pageNo, code: 'BLOCK_CLIPPING', sourceRef: String(node.getAttribute('data-source-ref') || '') }));
                }
            });
        });
        return Object.freeze(evidence);
    }

    function renderSharedLayoutWitness(area, layout, options) {
        const root = area?.ownerDocument;
        if (!root || !layout || typeof options?.resolveElement !== 'function') fail('INVALID_LAYOUT_WITNESS_INPUT');
        const host = root.createElement('div');
        host.dataset.layoutAuthorityWitness = '1';
        host.style.cssText = 'position:absolute;left:-100000px;top:-100000px;visibility:hidden;width:210mm;pointer-events:none;';
        layout.pages.forEach(pageLayout => {
            const page = root.createElement('section');
            page.className = pageLayout.isBlank ? 'page page-blank' : 'page';
            const body = root.createElement('div');
            body.className = 'page-body';
            body.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;';
            page.appendChild(body);
            if (!pageLayout.isBlank) {
                const perColumn = Array.from({ length: layout.columns }, () => []);
                pageLayout.itemPlacements.forEach(item => {
                    if (item.columnSpan > 1) perColumn[0].push(item);
                    else perColumn[item.columnNo - 1].push(item);
                });
                const hasWide = pageLayout.itemPlacements.some(item => item.columnSpan > 1);
                if (hasWide) {
                    perColumn[0].forEach(item => {
                        const node = options.resolveElement(item.blockId);
                        if (node) body.appendChild(node.cloneNode(true));
                    });
                } else {
                    const grid = root.createElement('div');
                    grid.className = 'grid-container';
                    grid.style.cssText = 'flex:1 1 0;min-height:0;';
                    perColumn.forEach((items, index) => {
                        const column = root.createElement('div');
                        column.className = 'grid-col';
                        items.slice().sort((left, right) => left.columnOrder - right.columnOrder).forEach(item => {
                            const node = options.resolveElement(item.blockId);
                            if (node) column.appendChild(node.cloneNode(true));
                        });
                        grid.appendChild(column);
                    });
                    body.appendChild(grid);
                }
            }
            host.appendChild(page);
        });
        root.body.appendChild(host);
        return host;
    }

    function planClinicComposition(input) {
        const config = input || {};
        const recipients = Array.isArray(config.recipients) ? config.recipients : fail('CLINIC_RECIPIENTS_MUST_BE_ARRAY');
        const review = config.review === true;
        const sections = [];
        recipients.forEach((recipient, recipientIndex) => {
            const recipientId = safeText(recipient.recipientId, 'CLINIC_RECIPIENT_ID');
            const refs = (recipient.sourceRefs || []).map(ref => typeof ref === 'string' ? ref : sourceRefKey(ref));
            const modes = review ? ['answer', 'solution'] : [safeText(recipient.renderMode || 'exam', 'CLINIC_RENDER_MODE')];
            modes.forEach(mode => sections.push(Object.freeze({
                recipientId,
                sectionId: `${recipientId}:${mode}`,
                mode,
                sourceRefs: Object.freeze(refs.slice()),
                requireQr: recipient.requireQr === true,
                qrTargetKey: String(recipient.qrTargetKey || '')
            })));
        });
        return Object.freeze({ review, duplex: config.duplex === true, sections: Object.freeze(sections) });
    }

    function compareClinicComposition(observedInput, expected) {
        const observed = observedInput || {};
        const pages = Array.isArray(observed.pages) ? observed.pages : [];
        const differences = [];
        const sectionsById = new Map(expected.sections.map(section => [section.sectionId, section]));
        const observedBySection = new Map();
        pages.forEach((page, index) => {
            if (page.isBlank) return;
            const section = sectionsById.get(page.sectionId);
            if (!section) {
                differences.push(Object.freeze({ field: 'section', observed: page.sectionId || '', expected: 'known section', pageNo: index + 1 }));
                return;
            }
            if (page.recipientId !== section.recipientId) differences.push(Object.freeze({ field: 'recipientId', observed: page.recipientId || '', expected: section.recipientId, pageNo: index + 1 }));
            const bucket = observedBySection.get(section.sectionId) || [];
            bucket.push(page);
            observedBySection.set(section.sectionId, bucket);
        });
        const expectedSequence = expected.sections.map(section => section.sectionId);
        const observedSequence = [];
        pages.filter(page => !page.isBlank).forEach(page => {
            if (observedSequence.at(-1) !== page.sectionId) observedSequence.push(page.sectionId);
        });
        if (JSON.stringify(observedSequence) !== JSON.stringify(expectedSequence)) {
            differences.push(Object.freeze({ field: 'sectionSequence', observed: observedSequence, expected: expectedSequence }));
        }
        let omissionCount = 0;
        let duplicationCount = 0;
        expected.sections.forEach((section, sectionIndex) => {
            const sectionPages = observedBySection.get(section.sectionId) || [];
            if (!sectionPages.length) differences.push(Object.freeze({ field: 'missingSection', observed: '', expected: section.sectionId }));
            const observedCounts = new Map();
            const expectedCounts = new Map();
            sectionPages.flatMap(page => page.sourceRefs || []).forEach(ref => observedCounts.set(ref, (observedCounts.get(ref) || 0) + 1));
            section.sourceRefs.forEach(ref => expectedCounts.set(ref, (expectedCounts.get(ref) || 0) + 1));
            const unexpected = Array.from(observedCounts.keys()).filter(ref => !expectedCounts.has(ref));
            const missing = Array.from(expectedCounts.entries()).flatMap(([ref, expectedCount]) => Array.from({ length: Math.max(0, expectedCount - (observedCounts.get(ref) || 0)) }, () => ref));
            const duplicates = Array.from(observedCounts.entries()).flatMap(([ref, observedCount]) => Array.from({ length: Math.max(0, observedCount - (expectedCounts.get(ref) || 0)) }, () => ref));
            omissionCount += missing.length;
            duplicationCount += duplicates.length;
            if (unexpected.length) differences.push(Object.freeze({ field: 'sourceIdentity', observed: unexpected, expected: section.sourceRefs, sectionId: section.sectionId }));
            if (missing.length) differences.push(Object.freeze({ field: 'omission', observed: [], expected: missing, sectionId: section.sectionId }));
            if (duplicates.length) differences.push(Object.freeze({ field: 'duplication', observed: duplicates, expected: [], sectionId: section.sectionId }));
            const sectionPageIndexes = sectionPages.map(page => pages.indexOf(page));
            if (sectionPageIndexes.some((pageIndex, index) => index > 0 && pageIndex !== sectionPageIndexes[index - 1] + 1)) differences.push(Object.freeze({ field: 'sectionContiguity', observed: sectionPageIndexes, expected: 'contiguous', sectionId: section.sectionId }));
            if (section.requireQr) {
                const finalPage = sectionPages.at(-1);
                const earlyQr = sectionPages.slice(0, -1).some(page => page.hasQr === true);
                if (!finalPage?.hasQr || earlyQr) differences.push(Object.freeze({ field: 'recipientQrPlacement', observed: { final: Boolean(finalPage?.hasQr), early: earlyQr }, expected: 'final-page-only', sectionId: section.sectionId }));
                if (section.qrTargetKey && finalPage?.qrTargetKey !== section.qrTargetKey) differences.push(Object.freeze({ field: 'recipientQrTarget', observed: finalPage?.qrTargetKey || '', expected: section.qrTargetKey, sectionId: section.sectionId }));
            }
        });
        if (expected.duplex) {
            const recipientOrder = Array.from(new Set(expected.sections.map(section => section.recipientId)));
            recipientOrder.slice(0, -1).forEach(recipientId => {
                const lastIndex = pages.map((page, index) => ({ page, index })).filter(entry => entry.page.recipientId === recipientId && !entry.page.isBlank).at(-1)?.index;
                if (lastIndex === undefined) return;
                const recipientPages = pages.filter(page => page.recipientId === recipientId && !page.isBlank).length;
                const next = pages[lastIndex + 1];
                const needsBlank = recipientPages % 2 === 1;
                if (needsBlank !== Boolean(next?.isBlank)) differences.push(Object.freeze({ field: 'duplexBlank', observed: Boolean(next?.isBlank), expected: needsBlank, recipientId }));
            });
        }
        return Object.freeze({ equal: differences.length === 0, differences: Object.freeze(differences), omissionCount, duplicationCount });
    }

    return Object.freeze({ paginateRenderableBlocks, planLegacyProductionLayout, materializeLayoutMaps, materializePageMap, materializeLegacyLayoutMaps, buildExpectedLayoutMaps, comparePromotionLayouts, observeLegacyDomLayout, inspectRenderedOverflow, renderSharedLayoutWitness, planClinicComposition, compareClinicComposition });
}));
