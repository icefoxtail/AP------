(function attachExamRenderExecutor(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APExamRenderExecutor = api;
})(typeof window !== 'undefined' ? window : globalThis, function createExamRenderExecutor(root) {
    'use strict';

    // Mechanical extraction of Archive's verified renderExam DOM transaction.
    // The executor receives all Archive-specific format/source helpers through
    // deps; the staging, slot, chunk, image, and page materialization order is
    // intentionally unchanged.
    async function render({ area, data, deps }) {
        if (!area || !Array.isArray(data)) throw new TypeError('APExamRenderExecutor.render requires area and data');
        const required = [
            'makePage', 'applyAutoImageSizeClasses', 'typesetMath', 'raf',
            'getArchiveQuestionSourceRef', 'stripInlineImagesFromContent',
            'sanitizeProtectedSegments', 'normalizeQuestionNotes', 'normalizeViewBlocks',
            'normalizeQuestionTables', 'formatQuestionContent', 'wrapLatex',
            'renderQuestionImageHTML', 'renderChoicesHTML', 'fitQuestionBox',
            'autoCompress', 'rendererMode'
        ];
        for (const name of required) {
            if (typeof deps?.[name] !== 'function') throw new TypeError(`APExamRenderExecutor missing dependency: ${name}`);
        }
        const document = deps.document || root?.document;
        if (!document) throw new TypeError('APExamRenderExecutor requires document');
        const appState = deps.appState || {};
        const SE_OVERHEAD_COL = Number(deps.SE_OVERHEAD_COL ?? 10);
        const SE_OVERHEAD_GRID = Number(deps.SE_OVERHEAD_GRID ?? 20);
        const SE_PAGE_TOLERANCE = Number(deps.SE_PAGE_TOLERANCE ?? 5);
        const SE_BLOCK_GAP = Number(deps.SE_BLOCK_GAP ?? 15);

        const staging = deps.stagingHost || document.getElementById('staging');
        if (!staging) throw new Error('EXAM_STAGING_MISSING');
        staging.style.width = '83mm';
        staging.innerHTML = '';
        let pNum = 1;
        const items = data.map((q, i) => {
            const box = document.createElement('div');
            box.className = 'q-box';
            box.dataset.sourceRef = deps.getArchiveQuestionSourceRef(q, i);
            const hasImageField = !!q.image;
            const rawContent = deps.stripInlineImagesFromContent(q.content || q.question || '', hasImageField);
            const formattedContent = deps.sanitizeProtectedSegments(
                deps.normalizeQuestionNotes(
                    deps.normalizeViewBlocks(
                        deps.normalizeQuestionTables(
                            deps.formatQuestionContent(deps.wrapLatex(rawContent), q)
                        )
                    )
                )
            );
            const imageHTML = deps.renderQuestionImageHTML(q);
            const choicesHTML = deps.renderChoicesHTML(q);
            box.innerHTML = `<div class="q-num">${i + 1}.</div>
                             <div class="q-content">${formattedContent}</div>
                             ${imageHTML}
                             ${choicesHTML}`;
            staging.appendChild(box);
            return { q, box, originalIndex: i };
        });
        await deps.applyAutoImageSizeClasses(staging);
        await deps.typesetMath('exam-staging', [staging]);
        await deps.raf();
        for (const item of items) {
            const profile = {};
            profile.proxyHeight_raw = item.box.scrollHeight;
            item.box.classList.add('fit-tight');
            await deps.raf();
            profile.proxyHeight_tight = item.box.scrollHeight;
            item.box.classList.remove('fit-tight');
            item.profile = profile;
        }
        const tempPage = deps.makePage(area, 'exam', 0);
        const usablePageHeight = tempPage.body.clientHeight;
        area.removeChild(tempPage);
        appState.layoutMeasurementLedger = {
            mode: 'exam',
            qpp: appState.qpp,
            usableHeight: Math.max(1, usablePageHeight),
            entries: items.map(item => ({
                sourceRef: deps.getArchiveQuestionSourceRef(item.q, item.originalIndex),
                raw: item.profile.proxyHeight_raw,
                tight: item.profile.proxyHeight_tight,
                layoutTag: item.q.layoutTag || '',
                wide: item.q.wide === true
            }))
        };

        const usesSlotLayout = items.some(item => ['subjective-2up', 'subjective-4up'].includes(item.q.layoutTag || ''));
        if (usesSlotLayout) {
            const rowCount = Math.max(1, Math.ceil(appState.qpp / 2));
            const spanFor = item => {
                const tag = item.q.layoutTag || '';
                if (tag === 'subjective-2up') return rowCount;
                if (tag === 'subjective-4up') return Math.max(1, Math.ceil(rowCount / 2));
                return 1;
            };
            const newSlotPage = () => ({ placements: [], occupied: Array.from({ length: rowCount }, () => [false, false]) });
            const findSlot = (pageData, span) => {
                for (let row = 0; row <= rowCount - span; row += 1) {
                    for (let col = 0; col < 2; col += 1) {
                        let fits = true;
                        for (let offset = 0; offset < span; offset += 1) {
                            if (pageData.occupied[row + offset][col]) { fits = false; break; }
                        }
                        if (fits) return { row, col, span };
                    }
                }
                return null;
            };
            const slotPages = [];
            let slotPage = newSlotPage();
            const flushSlotPage = () => {
                if (slotPage.placements.length) slotPages.push(slotPage);
                slotPage = newSlotPage();
            };
            for (const item of items) {
                const tag = item.q.layoutTag || '';
                if (tag === 'fullwidth') {
                    flushSlotPage();
                    slotPages.push({ wideItem: item });
                    continue;
                }
                const span = Math.min(rowCount, spanFor(item));
                let placement = findSlot(slotPage, span);
                if (!placement && span === rowCount) {
                    const usedSpan = slotPage.placements.reduce((sum, entry) => sum + entry.span, 0);
                    if (usedSpan <= rowCount) {
                        slotPage.occupied = Array.from({ length: rowCount }, () => [false, false]);
                        let packedRow = 0;
                        slotPage.placements.forEach(entry => {
                            entry.row = packedRow;
                            entry.col = 0;
                            for (let offset = 0; offset < entry.span; offset += 1) slotPage.occupied[packedRow + offset][0] = true;
                            packedRow += entry.span;
                        });
                        placement = findSlot(slotPage, span);
                    }
                }
                if (!placement) {
                    flushSlotPage();
                    placement = findSlot(slotPage, span);
                }
                for (let offset = 0; offset < span; offset += 1) slotPage.occupied[placement.row + offset][placement.col] = true;
                slotPage.placements.push({ item, ...placement });
            }
            flushSlotPage();

            let slotPageNumber = 1;
            for (const slotPageData of slotPages) {
                const page = deps.makePage(area, 'exam', slotPageNumber++);
                if (slotPageData.wideItem) {
                    const wideCol = document.createElement('div');
                    wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                    wideCol.appendChild(slotPageData.wideItem.box.cloneNode(true));
                    page.body.appendChild(wideCol);
                } else {
                    const grid = document.createElement('div');
                    grid.className = 'grid-container';
                    grid.style.flex = '1 1 0';
                    const columns = [0, 1].map(() => {
                        const col = document.createElement('div');
                        col.className = 'grid-col';
                        grid.appendChild(col);
                        return col;
                    });
                    page.body.appendChild(grid);
                    const hasSpecialPlacement = slotPageData.placements.some(entry => entry.span > 1);
                    if (!hasSpecialPlacement) {
                        const ordered = slotPageData.placements.map(entry => entry.item);
                        const split = Math.ceil(ordered.length / 2);
                        ordered.slice(0, split).forEach(item => columns[0].appendChild(item.box.cloneNode(true)));
                        ordered.slice(split).forEach(item => columns[1].appendChild(item.box.cloneNode(true)));
                    } else {
                        for (let col = 0; col < 2; col += 1) {
                            let row = 0;
                            while (row < rowCount) {
                                const placement = slotPageData.placements.find(entry => entry.col === col && entry.row === row);
                                if (placement) {
                                    const clone = placement.item.box.cloneNode(true);
                                    clone.style.flex = `${placement.span} 1 0`;
                                    columns[col].appendChild(clone);
                                    row += placement.span;
                                } else {
                                    const spacer = document.createElement('div');
                                    spacer.style.flex = '1 1 0';
                                    columns[col].appendChild(spacer);
                                    row += 1;
                                }
                            }
                        }
                    }
                }
                if (deps.rendererMode() === 'legacy') await deps.typesetMath('exam-slot-page', [page]);
                await deps.raf();
                const allPageBoxes = page.querySelectorAll('.q-box');
                allPageBoxes.forEach(box => deps.fitQuestionBox(box));
                if (page.body.scrollHeight > usablePageHeight + SE_PAGE_TOLERANCE) {
                    allPageBoxes.forEach(box => deps.autoCompress(box));
                    await deps.raf();
                    if (deps.rendererMode() === 'legacy') await deps.typesetMath('exam-slot-overflow', [page]);
                }
            }
            return area;
        }

        let firstPage = null;
        const pages = [];
        let currentPage = { blocks: [], usedHeight: 0 };
        let activeChunk = [];
        let currentType = null;
        const flushBlock = () => {
            if (activeChunk.length === 0) return;
            const type = currentType;
            const chunk = [...activeChunk];
            const hType = type === 'normal' ? 'proxyHeight_tight' : 'proxyHeight_raw';
            let blockH;
            if (type === 'wide') {
                blockH = chunk[0].profile.proxyHeight_raw + SE_OVERHEAD_COL + SE_OVERHEAD_GRID;
            } else {
                const split = Math.ceil(chunk.length / 2);
                const leftH = chunk.slice(0, split).reduce((sum, item) => sum + item.profile[hType], 0) + SE_OVERHEAD_COL;
                const rightH = chunk.slice(split).reduce((sum, item) => sum + item.profile[hType], 0) + SE_OVERHEAD_COL;
                blockH = Math.max(leftH, rightH) + SE_OVERHEAD_GRID;
            }
            const isNormalForceBreak = type === 'normal' && currentPage.blocks.length > 0;
            const gap = currentPage.blocks.length > 0 ? SE_BLOCK_GAP : 0;
            if ((isNormalForceBreak || currentPage.usedHeight + gap + blockH > usablePageHeight) && currentPage.blocks.length > 0) {
                pages.push(currentPage);
                currentPage = { blocks: [], usedHeight: 0 };
            }
            currentPage.usedHeight += (currentPage.blocks.length > 0 ? SE_BLOCK_GAP : 0) + blockH;
            currentPage.blocks.push({ type, items: chunk, blockH });
            activeChunk = [];
        };
        items.forEach(item => {
            const layoutTag = item.q.layoutTag || '';
            let qType = 'normal';
            let limit = appState.qpp;
            if (layoutTag === 'fullwidth') { qType = 'wide'; limit = 1; }
            else if (layoutTag === 'subjective-2up') { qType = 'subj2'; limit = 2; }
            else if (layoutTag === 'subjective-4up') { qType = 'subj4'; limit = 4; }
            const isSpecialType = ['subj2', 'subj4', 'wide'].includes(qType);
            const prevWasSpecial = ['subj2', 'subj4', 'wide'].includes(currentType);
            if ((currentType !== null && currentType !== qType) || activeChunk.length >= limit || ((isSpecialType || prevWasSpecial) && currentPage.blocks.length > 0)) {
                flushBlock();
                if (isSpecialType && currentPage.blocks.length > 0) {
                    pages.push(currentPage);
                    currentPage = { blocks: [], usedHeight: 0 };
                }
                currentType = qType;
            }
            if (currentType === null) currentType = qType;
            activeChunk.push(item);
        });
        flushBlock();
        if (currentPage.blocks.length > 0) pages.push(currentPage);
        for (let pIdx = 0; pIdx < pages.length; pIdx += 1) {
            const pageData = pages[pIdx];
            const page = !firstPage ? (firstPage = deps.makePage(area, 'exam', pNum)) : deps.makePage(area, 'exam', ++pNum);
            pageData.blocks.forEach((block, bIdx) => {
                if (block.type === 'wide') {
                    const wideCol = document.createElement('div');
                    wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                    wideCol.appendChild(block.items[0].box.cloneNode(true));
                    page.body.appendChild(wideCol);
                } else {
                    const bGrid = document.createElement('div');
                    bGrid.className = 'grid-container';
                    bGrid.style.flex = block.type === 'normal' ? '1 1 0' : 'none';
                    if (bIdx < pageData.blocks.length - 1) bGrid.style.marginBottom = `${SE_BLOCK_GAP}px`;
                    const bLeft = document.createElement('div');
                    bLeft.className = 'grid-col';
                    const bRight = document.createElement('div');
                    bRight.className = 'grid-col';
                    bGrid.appendChild(bLeft);
                    bGrid.appendChild(bRight);
                    page.body.appendChild(bGrid);
                    const split = Math.ceil(block.items.length / 2);
                    block.items.slice(0, split).forEach(item => bLeft.appendChild(item.box.cloneNode(true)));
                    block.items.slice(split).forEach(item => bRight.appendChild(item.box.cloneNode(true)));
                }
            });
            if (deps.rendererMode() === 'legacy') await deps.typesetMath('exam-page', [page]);
            await deps.raf();
            const allPageBoxes = page.querySelectorAll('.q-box');
            allPageBoxes.forEach(box => deps.fitQuestionBox(box));
            if (page.body.scrollHeight > usablePageHeight + SE_PAGE_TOLERANCE) {
                allPageBoxes.forEach(box => deps.autoCompress(box));
                await deps.raf();
                if (deps.rendererMode() === 'legacy') await deps.typesetMath('exam-page-overflow', [page]);
            }
        }
        return area;
    }

    return Object.freeze({ render });
});
