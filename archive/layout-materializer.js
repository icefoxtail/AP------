(function (global) {
    'use strict';
    function columns(page, document, flex, columnClass = 'grid-col', equalTracks = false) {
        const grid = document.createElement('div'); grid.className = 'grid-container';
        if (flex) grid.style.flex = flex;
        if (equalTracks) grid.style.gridTemplateColumns = 'minmax(0, 1fr) minmax(0, 1fr)';
        const cols = [0, 1].map(() => { const col = document.createElement('div'); col.className = columnClass; grid.appendChild(col); return col; });
        page.body.appendChild(grid); return cols;
    }
    function fullwidthColumn(page, document) {
        const grid = document.createElement('div'); grid.className = 'grid-container sol-fullwidth-grid';
        const col = document.createElement('div'); col.className = 'grid-col sol-grid-col sol-fullwidth-column';
        grid.appendChild(col); page.body.appendChild(grid); return col;
    }
    function hasHorizontalSolutionOverflow(node, container) {
        const nodeWidth = Number(node?.clientWidth || 0);
        const containerWidth = Number(container?.clientWidth || 0);
        return (nodeWidth > 0 && Number(node.scrollWidth || 0) > nodeWidth + 2)
            || (containerWidth > 0 && Number(container.scrollWidth || 0) > containerWidth + 2);
    }
    function assertQuestionImagesReady(root, deps) {
        const readiness = deps.validateQuestionImageReadiness?.(root);
        if (readiness && !readiness.ok) {
            const error = new Error(readiness.code || 'QUESTION_IMAGE_READINESS_INCOMPLETE');
            error.code = readiness.code || 'QUESTION_IMAGE_READINESS_INCOMPLETE';
            error.details = readiness;
            throw error;
        }
    }
    function measuredSolutionCapacity(document, probePage) {
        const probeCapacity = Number(probePage?.body?.clientHeight || 0);
        if (Number.isFinite(probeCapacity) && probeCapacity > 0) return probeCapacity;

        // In screen-fit mode a hidden probe can report zero even though the
        // same A4 page is already measured and visible. Reuse that page's
        // measured body height; keep failing closed if neither measurement is
        // available.
        const activeCapacity = Number(document.querySelector?.('#print-area .page-body')?.clientHeight || 0);
        if (Number.isFinite(activeCapacity) && activeCapacity > 0) return activeCapacity;
        throw new Error('INVALID_MEASURED_SOLUTION_HEIGHT');
    }
    async function exam({ area, items, usableHeight, deps }) {
        const document = area.ownerDocument;
        items.forEach(item => assertQuestionImagesReady(item.box, deps));
        const blocks = items.map((item, index) => ({ blockId: `exam-block:${index + 1}`, measuredHeight: item.profile.proxyHeight_raw,
            measurements: { raw: item.profile.proxyHeight_raw, tight: item.profile.proxyHeight_tight },
            layoutTag: ['fullwidth', 'subjective-2up', 'subjective-4up'].includes(item.q.layoutTag) ? item.q.layoutTag : '',
            columnSpan: item.q.layoutTag === 'fullwidth' ? 2 : 1 }));
        const plan = global.APLayoutAuthority.planLegacyProductionLayout({ pageGeometry: { usableHeight, columns: 2, qpp: deps.appState.qpp, blockGap: deps.SE_BLOCK_GAP }, blocks });
        const byId = new Map(blocks.map((block, index) => [block.blockId, items[index].box]));
        for (const pagePlan of plan.pages) {
            const page = deps.makePage(area, 'exam', pagePlan.pageNo);
            if (pagePlan.itemPlacements.some(item => item.columnSpan > 1)) {
                const wide = document.createElement('div'); wide.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                for (const item of pagePlan.itemPlacements) wide.appendChild(byId.get(item.blockId));
                page.body.appendChild(wide);
            } else {
                const cols = columns(page, document, '1 1 0');
                const slots = pagePlan.itemPlacements.some(item => item.slotRowStart !== null && item.slotSpanRows > 1);
                pagePlan.columns.forEach((column, index) => {
                    if (!slots) { column.items.forEach(item => cols[index].appendChild(byId.get(item.blockId))); return; }
                    for (let row = 0; row < plan.slotRows;) {
                        const item = column.items.find(item => item.slotRowStart === row);
                        if (item) { const node = byId.get(item.blockId); node.style.flex = `${item.slotSpanRows} 1 0`; cols[index].appendChild(node); row += item.slotSpanRows; }
                        else { const spacer = document.createElement('div'); spacer.style.flex = '1 1 0'; cols[index].appendChild(spacer); row += 1; }
                    }
                });
            }
            if (deps.rendererMode() === 'legacy') await deps.typesetMath('exam-authority-page', [page]);
            await deps.raf();
            const boxes = [...page.querySelectorAll('.q-box')]; boxes.forEach(deps.fitQuestionBox);
            if (page.body.scrollHeight > usableHeight + deps.SE_PAGE_TOLERANCE) { boxes.forEach(deps.autoCompress); await deps.raf(); }
        }
        deps.onLayoutPlan?.({ mode: 'exam', planner: plan.planner, pages: plan.pages.length, measuredBeforePlacement: true, canonicalCloneCount: 0, plan });
        return area;
    }
    function continuationBox(box, document) {
        const node = document.createElement('div');
        for (const attr of box.attributes) node.setAttribute(attr.name, attr.value);
        node.classList.add('sol-box-long');
        node.innerHTML = '<div class="sol-meta"><div class="sol-exp"></div></div>';
        return node;
    }
    async function solution({ area, boxes, blocks, measurementsBySource, deferChunkMeasurements = false, deps }) {
        const document = area.ownerDocument;
        boxes.forEach(box => assertQuestionImagesReady(box, deps));
        const probe = document.createElement('div');
        probe.style.cssText = 'position:absolute;left:-20000px;top:0;visibility:hidden;width:210mm;pointer-events:none;';
        document.body.appendChild(probe);
        const probePage = deps.makePage(probe, 'sol', 0);
        const cols = columns(probePage, document, undefined, 'grid-col sol-grid-col', true);
        const wideCol = fullwidthColumn(probePage, document);
        const marker = document.createElement('div'); marker.style.cssText = 'flex:none;height:0;min-height:0;padding:0;margin:0;';
        const capacity = measuredSolutionCapacity(document, probePage);
        const records = [];
        let succeeded = false;
        const flowHeight = (node, wide = false) => {
            const host = wide ? wideCol : cols[0];
            host.replaceChildren(node, marker);
            return Math.max(1, marker.getBoundingClientRect().top - host.getBoundingClientRect().top);
        };
        try {
            boxes.forEach((box, index) => {
                let fullWidth = box.dataset.solutionFullWidth === 'true' || blocks[index].fullWidth === true;
                const originalStyle = box.style.cssText;
                let rawHeight = flowHeight(box, fullWidth);
                if (!fullWidth && hasHorizontalSolutionOverflow(box, cols[0])) {
                    fullWidth = true;
                    blocks[index].fullWidth = true;
                    rawHeight = flowHeight(box, true);
                }
                if (fullWidth && hasHorizontalSolutionOverflow(box, wideCol)) {
                    throw new Error(`SOLUTION_HORIZONTAL_OVERFLOW_FULL_WIDTH:${blocks[index].blockId}`);
                }
                deps.autoCompress(box);
                let compressedHeight = flowHeight(box, fullWidth);
                let compressedStyle = box.style.cssText;
                if (!fullWidth && hasHorizontalSolutionOverflow(box, cols[0])) {
                    fullWidth = true;
                    blocks[index].fullWidth = true;
                    box.style.cssText = originalStyle;
                    rawHeight = flowHeight(box, true);
                    if (hasHorizontalSolutionOverflow(box, wideCol)) {
                        throw new Error(`SOLUTION_HORIZONTAL_OVERFLOW_FULL_WIDTH:${blocks[index].blockId}`);
                    }
                    deps.autoCompress(box);
                    compressedHeight = flowHeight(box, true);
                    compressedStyle = box.style.cssText;
                }
                if (fullWidth && hasHorizontalSolutionOverflow(box, wideCol)) {
                    throw new Error(`SOLUTION_HORIZONTAL_OVERFLOW_FULL_WIDTH:${blocks[index].blockId}`);
                }
                box.style.cssText = originalStyle; deps.stagingHost.appendChild(box);
                const sourceRef = box.dataset.sourceRef;
                const measurement = { raw: rawHeight, tight: compressedHeight };
                if (deferChunkMeasurements) {
                    measurementsBySource.set(sourceRef, measurement);
                    blocks[index].measuredHeight = rawHeight;
                    blocks[index].measurements = measurement;
                    blocks[index].measurementSource = 'actual-output-column-flowHeight';
                }
                records.push({ box, block: blocks[index], sourceRef, originalStyle, compressedStyle, chunks: null,
                    measuredRangeCount: 0,
                    input: { blockId: blocks[index].blockId, rawHeight, compressedHeight,
                        chunkCount: deferChunkMeasurements ? 1 : blocks[index].chunks.length,
                        deferChunkCount: deferChunkMeasurements === true,
                        fullWidth, continuationHeights: {} } });
            });
            const byId = new Map(records.map(record => [record.input.blockId, record]));
            let plan;
            let maximumQueries = records.reduce((sum, record) => sum + record.input.chunkCount + 1, 0);
            let queryCount = 0;
            const prepareDeferredChunks = async () => {
                const candidates = records.filter(record => record.input.deferChunkCount
                    && Math.round(record.input.rawHeight) > capacity + 2
                    && Math.round(record.input.compressedHeight) > capacity + 2);
                const hosts = [];
                candidates.forEach(record => {
                    const host = document.createElement('div');
                    host.style.width = record.input.fullWidth ? `${Math.max(1, wideCol.clientWidth - 24)}px` : '83mm';
                    deps.stagingHost.appendChild(host);
                    record.chunks = deps.makeSolutionHtmlChunks(record.box.dataset.solutionHtml || '').map(html => {
                        const node = document.createElement('span'); node.className = 'sol-chunk'; node.innerHTML = html; host.appendChild(node); return node;
                    });
                    const previousCount = record.input.chunkCount;
                    record.input.chunkCount = record.chunks.length;
                    record.input.deferChunkCount = false;
                    maximumQueries += record.input.chunkCount - previousCount;
                    record.block.actualChunkCount = record.input.chunkCount;
                    record.block.deferredChunkCount = false;
                    record.block.measuredRangeCount = 0;
                    hosts.push(host);
                });
                for (let offset = 0; offset < hosts.length; offset += 24) {
                    await deps.typesetMath('solution-planner-chunks', hosts.slice(offset, offset + 24));
                }
                hosts.forEach(host => host.remove());
            };
            while (queryCount <= maximumQueries) {
                plan = global.APLayoutAuthority.planMeasuredSolutionLayout({ pageGeometry: { usableHeight: capacity, columns: 2, tolerance: 2 }, blocks: records.map(record => record.input) });
                if (plan.status === 'READY') break;
                const query = plan.measurementRequest, record = byId.get(query.blockId);
                if (records.some(item => item.input.deferChunkCount)) await prepareDeferredChunks();
                if (!record.chunks) {
                    const host = document.createElement('div');
                    host.style.width = record.input.fullWidth ? `${Math.max(1, wideCol.clientWidth - 24)}px` : '83mm';
                    deps.stagingHost.appendChild(host);
                    record.chunks = deps.makeSolutionHtmlChunks(record.box.dataset.solutionHtml).map(html => { const node = document.createElement('span'); node.className = 'sol-chunk'; node.innerHTML = html; host.appendChild(node); return node; });
                    if (record.chunks.length !== record.input.chunkCount) throw new Error('SOLUTION_CHUNK_SCHEMA_PARITY_FAILED');
                    await deps.typesetMath('solution-planner-chunks', [host]);
                    host.remove();
                }
                const shell = query.primary ? deps.makeLongSolutionShell(record.box, 0, false) : continuationBox(record.box, document);
                shell.style.cssText = record.compressedStyle;
                const exp = shell.querySelector('.sol-exp');
                const heights = [];
                for (let index = query.start; index < record.chunks.length; index += 1) {
                    exp.appendChild(record.chunks[index]);
                    heights.push(flowHeight(shell, record.input.fullWidth));
                    if (Math.round(heights.at(-1)) > capacity + 2) break;
                }
                exp.replaceChildren(); shell.remove();
                if (query.primary) record.input.primaryHeights = heights;
                else record.input.continuationHeights[query.start] = heights;
                record.measuredRangeCount += heights.length;
                record.block.measuredRangeCount = record.measuredRangeCount;
                await deps.raf();
                queryCount += 1;
            }
            if (plan.status !== 'READY') throw new Error('SOLUTION_MEASUREMENT_DID_NOT_CONVERGE');
            const placements = [];
            const occurrences = new Map();
            for (const pagePlan of plan.pages) {
                const page = deps.makePage(area, 'sol', pagePlan.pageNo);
                const fullWidthPage = pagePlan.itemPlacements.some(item => item.columnSpan > 1);
                const target = fullWidthPage ? [fullwidthColumn(page, document)] : columns(page, document, undefined, 'grid-col sol-grid-col', true);
                for (const item of pagePlan.itemPlacements) {
                    const record = byId.get(item.blockId), sourceRef = record.box.dataset.sourceRef;
                    let node = record.box;
                    if (item.compressed) node.style.cssText = record.compressedStyle;
                    if (item.split) {
                        node = item.continuation ? continuationBox(record.box, document) : record.box;
                        node.classList.add('sol-box-long');
                        const exp = node.querySelector('.sol-exp');
                        if (!item.continuation) deps.clearMath?.([exp]);
                        exp.replaceChildren(...record.chunks.slice(item.chunkStart, item.chunkEnd + 1));
                    }
                    const occurrence = (occurrences.get(sourceRef) || 0) + 1;
                    occurrences.set(sourceRef, occurrence);
                    const blockId = `solution:${sourceRef}:${occurrence}`;
                    node.dataset.solutionLayoutBlockId = blockId;
                    target[item.columnNo - 1].appendChild(node);
                    const measurements = measurementsBySource.get(sourceRef) || { raw: record.input.rawHeight, tight: record.input.compressedHeight };
                    placements.push({ blockId, questionKey: sourceRef, pageNo: pagePlan.pageNo, columnNo: item.columnNo,
                        columnSpan: item.columnSpan, layoutTag: item.layoutTag || 'solution',
                        columnOrder: item.columnOrder, placementOrder: item.attemptOrder, continuationOf: item.continuation > 0 ? `solution:${sourceRef}:1` : '',
                        measurementMode: 'raw', measuredHeight: measurements.raw, measurements });
                }
            }
            deps.onLayoutPlan?.({ mode: 'sol', planner: plan.planner, pages: plan.pages.length, measuredBeforePlacement: true, canonicalCloneCount: 0, plan });
            succeeded = true;
            return { usableHeight: capacity, placements };
        } finally {
            if (!succeeded) records.forEach(record => { if (record.chunks) deps.clearMath?.(record.chunks); });
            probe.remove();
        }
    }
    global.APArchiveLayoutMaterializer = Object.freeze({ exam, solution });
}(typeof window === 'undefined' ? globalThis : window));
