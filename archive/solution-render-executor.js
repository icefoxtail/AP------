(function attachSolutionRenderExecutor(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APSolutionRenderExecutor = api;
})(typeof window !== 'undefined' ? window : globalThis, function createSolutionRenderExecutor(root) {
    'use strict';

    async function measureSolutionBatch(boxes, staging, deps, document) {
        const records = boxes.map(box => ({ box, raw: deps.measureSolutionOuterFootprint(box) }));
        boxes.forEach(box => box.classList.add('fit-tight'));
        await deps.raf();
        records.forEach(record => { record.tight = deps.measureSolutionOuterFootprint(record.box); });
        boxes.forEach(box => box.classList.remove('fit-tight'));
        const hosts = [];
        try {
            records.forEach((record, index) => {
                const host = document.createElement('div'); host.style.width = '83mm';
                record.chunks = deps.makeSolutionHtmlChunks(record.box.dataset.solutionHtml || '').map((html, chunkIndex) => {
                    const node = document.createElement('span'); node.className = 'sol-chunk'; node.dataset.chunkId = `c${chunkIndex}`; node.innerHTML = html; host.appendChild(node);
                    return { node, chunkId: node.dataset.chunkId };
                });
                record.shell = deps.makeLongSolutionShell(record.box, index + 1, true);
                staging.append(host, record.shell); hosts.push(host, record.shell);
            });
            await deps.typesetMath('solution-decision-batch', hosts);
            records.forEach(record => record.chunks.forEach(chunk => { chunk.measuredHeight = deps.measureSolutionOuterFootprint(chunk.node); }));
            // Only one inline chunk per independent host is tightened at a time.
            // Tightening siblings together would change wrapping and the legacy
            // per-chunk geometry contract.
            const count = Math.max(0, ...records.map(record => record.chunks.length));
            for (let index = 0; index < count; index += 1) {
                const chunks = records.map(record => record.chunks[index]).filter(Boolean);
                chunks.forEach(chunk => chunk.node.classList.add('fit-tight'));
                await deps.raf();
                chunks.forEach(chunk => { chunk.tight = deps.measureSolutionOuterFootprint(chunk.node); });
                chunks.forEach(chunk => chunk.node.classList.remove('fit-tight'));
            }
            records.forEach(record => { record.continuationShellOverhead = Math.max(1, Number(record.shell.scrollHeight || 1)); });
            return records;
        } finally {
            deps.clearMath?.(hosts);
            hosts.forEach(host => host.remove());
        }
    }

    /**
     * The Archive solution pagination algorithm extracted from the historical
     * renderSol implementation.  This module deliberately owns no source or
     * business authority: every engine-specific operation is supplied through
     * deps, while the DOM transaction and fit/continuation order remain the
     * production algorithm's order.
     */
    async function render({ area, data, deps }) {
        if (!area || !Array.isArray(data)) throw new TypeError('APSolutionRenderExecutor.render requires area and data');
        const required = [
            'makePage', 'typesetMath', 'raf', 'autoCompress', 'makeSolutionHtmlChunks',
            'makeLongSolutionShell', 'renderSolutionImageHTML', 'formatSolutionHtml',
            'formatQuestionContent', 'getArchiveQuestionSourceRef', 'waitForQuestionImage',
            'rendererMode', 'wrapLatex', 'stripInlineImagesFromContent',
            'sanitizeProtectedSegments', 'normalizeQuestionNotes', 'normalizeViewBlocks',
            'normalizeQuestionTables', 'measureSolutionOuterFootprint'
        ];
        for (const name of required) {
            if (typeof deps?.[name] !== 'function') throw new TypeError(`APSolutionRenderExecutor missing dependency: ${name}`);
        }
        const document = deps.document || root?.document;
        const NodeCtor = deps.Node || root?.Node;
        if (!document) throw new TypeError('APSolutionRenderExecutor requires document');
        const appState = deps.appState || null;

        if (appState) {
            appState.solutionDecisionLedger = null;
            appState.solutionObservedPlacementLedger = null;
        }

        const staging = deps.stagingHost || document.getElementById('staging');
        if (!staging) throw new Error('SOLUTION_STAGING_MISSING');
        staging.style.width = '83mm';
        staging.innerHTML = '';
        let pNum = 1;
        let cols;
        let colIdx = 0;
        let solutionPageNo = 0;
        let solutionUsableHeight = 0;
        let solutionPlacementOrder = 0;
        const solutionOccurrences = new Map();
        const solutionPlacementMap = new Map();
        const solutionMeasurementBySource = new Map();
        const solutionDecisionBlocks = [];

        const markSolutionPlacement = (node, continuation = false) => {
            const sourceRef = String(node?.getAttribute?.('data-source-ref') || '').trim();
            if (!sourceRef || !solutionPageNo) return;
            // Continuation shells are cloned from the primary source box. Do
            // not inherit its block id; each shell must receive its own
            // continuation block identity.
            const existingBlockId = continuation ? '' : String(node.dataset.solutionLayoutBlockId || '').trim();
            const occurrence = existingBlockId
                ? Number(existingBlockId.split(':').at(-1))
                : (solutionOccurrences.get(sourceRef) || 0) + 1;
            solutionOccurrences.set(sourceRef, occurrence);
            const blockId = existingBlockId || `solution:${sourceRef}:${occurrence}`;
            node.dataset.solutionLayoutBlockId = blockId;
            const previous = solutionPlacementMap.get(blockId);
            if (previous) solutionPlacementMap.delete(blockId);
            const columnNo = colIdx + 1;
            const columnOrder = Array.from(solutionPlacementMap.values())
                .filter(item => item.pageNo === solutionPageNo && item.columnNo === columnNo).length;
            const continuationOf = continuation ? `solution:${sourceRef}:1` : '';
            solutionPlacementMap.set(blockId, {
                blockId,
                questionKey: sourceRef,
                pageNo: solutionPageNo,
                columnNo,
                columnOrder,
                placementOrder: solutionPlacementOrder++,
                continuationOf,
                measurementMode: 'raw',
                measuredHeight: solutionMeasurementBySource.get(sourceRef)?.raw || 1,
                measurements: solutionMeasurementBySource.get(sourceRef) || { raw: 1, tight: 1 }
            });
        };

        const makeGridPage = () => {
            const p = deps.makePage(area, 'sol', pNum++);
            const grid = document.createElement('div');
            grid.className = 'grid-container';
            const l = document.createElement('div');
            l.className = 'grid-col sol-grid-col';
            const r = document.createElement('div');
            r.className = 'grid-col sol-grid-col';
            grid.appendChild(l);
            grid.appendChild(r);
            p.body.appendChild(grid);
            solutionPageNo = pNum - 1;
            solutionUsableHeight = Math.max(solutionUsableHeight, Number(p.body.clientHeight || 1));
            return { p, cols: [l, r] };
        };

        const advanceColumn = () => {
            if (colIdx === 0) colIdx = 1;
            else {
                ({ cols } = makeGridPage());
                colIdx = 0;
            }
            return cols[colIdx];
        };

        const renderSplitSolutionBox = async (sourceBox, qNo) => {
            const originalExp = sourceBox.querySelector('.sol-exp');
            const chunks = deps.makeSolutionHtmlChunks(sourceBox.dataset.solutionHtml || (originalExp ? originalExp.innerHTML : ''));
            const preparedChunks = chunks.map(chunkHtml => {
                const chunk = document.createElement('span');
                chunk.className = 'sol-chunk';
                chunk.innerHTML = chunkHtml;
                return chunk;
            });
            if (deps.rendererMode() === 'batch') {
                const chunkStaging = document.createElement('div');
                chunkStaging.style.width = '83mm';
                preparedChunks.forEach(chunk => chunkStaging.appendChild(chunk));
                staging.appendChild(chunkStaging);
                await deps.typesetMath('solution-split-staging', [chunkStaging]);
            }
            let shell = deps.makeLongSolutionShell(sourceBox, qNo, false);
            let exp = shell.querySelector('.sol-exp');
            let targetCol = cols[colIdx];
            targetCol.appendChild(shell);
            markSolutionPlacement(shell, false);

            for (const chunk of preparedChunks) {
                exp.appendChild(chunk);
                if (deps.rendererMode() === 'legacy') {
                    await deps.typesetMath('solution-split-chunk', [chunk]);
                    await deps.raf();
                }
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) continue;

                if (exp.children.length > 1) {
                    exp.removeChild(chunk);
                    targetCol = advanceColumn();
                    shell = deps.makeLongSolutionShell(sourceBox, qNo, true);
                    exp = shell.querySelector('.sol-exp');
                    targetCol.appendChild(shell);
                    markSolutionPlacement(shell, true);
                    exp.appendChild(chunk);
                    if (deps.rendererMode() === 'legacy') await deps.raf();
                }
                if (targetCol.scrollHeight > targetCol.clientHeight + 2) {
                    deps.autoCompress(shell);
                    await deps.raf();
                }
            }
        };

        const placeSolutionBox = async (box, qNo) => {
            while (true) {
                const targetCol = cols[colIdx];
                targetCol.appendChild(box);
                markSolutionPlacement(box, false);
                if (deps.rendererMode() === 'legacy') await deps.typesetMath('solution-box', [box]);
                await deps.raf();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

                deps.autoCompress(box);
                await deps.raf();
                await deps.raf();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

                const isOnlyBoxInColumn = targetCol.querySelectorAll('.sol-box').length === 1;
                targetCol.removeChild(box);
                if (isOnlyBoxInColumn) {
                    await renderSplitSolutionBox(box, qNo);
                    return;
                }
                advanceColumn();
            }
        };

        const solutionBoxes = data.map((q, i) => {
            const solutionText = q.solution || q.explanation || q.sol || '';
            const reminderRawContent = deps.stripInlineImagesFromContent(q.content || q.question || '', !!q.image);
            const reminderContent = deps.sanitizeProtectedSegments(
                deps.normalizeQuestionNotes(
                    deps.normalizeViewBlocks(
                        deps.normalizeQuestionTables(
                            deps.formatQuestionContent(deps.wrapLatex(reminderRawContent), q)
                        )
                    )
                )
            );
            // Keep the header/visual area out of the chunkable solution body. A
            // continuation shell then contains only .sol-exp, so a solution image
            // is shown once in the first column rather than once per continuation.
            const solutionHtml = deps.formatSolutionHtml(solutionText);
            const solutionImageHtml = deps.renderSolutionImageHTML(q);
            const box = document.createElement('div');
            box.className = 'q-box sol-box';
            box.dataset.sourceRef = deps.getArchiveQuestionSourceRef(q, i);
            box.dataset.solutionHtml = solutionHtml;
            box.innerHTML = `<div class="q-num">${i + 1}.</div><div data-semantic-content="1" style="margin-bottom:8px;color:#555;font-size:8.5pt;">${reminderContent}</div><div class="sol-meta"><div class="sol-ans">[정답] ${deps.wrapLatex(q.answer ?? '-')}</div>${solutionImageHtml}<div class="sol-exp">${solutionHtml}</div></div>`;
            staging.appendChild(box);
            return box;
        });
        await Promise.all(Array.from(staging.querySelectorAll('img')).map(deps.waitForQuestionImage));
        if (deps.rendererMode() === 'batch') await deps.typesetMath('solution-staging', [staging]);
        if (deps.measurementMode?.() === 'batch') {
            const records = await measureSolutionBatch(solutionBoxes, staging, deps, document);
            records.forEach((record, index) => {
                const sourceRef = String(record.box.getAttribute('data-source-ref') || '').trim();
                const measurements = { raw: Math.max(1, record.raw), tight: Math.max(1, record.tight) };
                solutionMeasurementBySource.set(sourceRef, measurements);
                const blockId = `solution-block:${index + 1}:primary`;
                record.box.dataset.solutionDecisionBlockId = blockId;
                const chunks = record.chunks.map(({ chunkId, measuredHeight, tight }) => ({ chunkId, measuredHeight, tight }));
                solutionDecisionBlocks.push({ blockId, questionKey: `solution-block:${index + 1}`, measuredHeight: record.raw, measurements,
                    shellOverhead: Math.max(1, record.raw - chunks.reduce((sum, chunk) => sum + chunk.measuredHeight, 0)),
                    continuationShellOverhead: record.continuationShellOverhead, chunks });
            });
        } else for (let solutionIndex = 0; solutionIndex < solutionBoxes.length; solutionIndex += 1) {
            const box = solutionBoxes[solutionIndex];
            const sourceRef = String(box.getAttribute('data-source-ref') || '').trim();
            const raw = deps.measureSolutionOuterFootprint(box);
            box.classList.add('fit-tight');
            await deps.raf();
            const tight = deps.measureSolutionOuterFootprint(box);
            box.classList.remove('fit-tight');
            solutionMeasurementBySource.set(sourceRef, { raw: Math.max(1, raw), tight: Math.max(1, tight) });
            const chunkHost = document.createElement('div');
            chunkHost.style.width = '83mm';
            const chunkHtmls = deps.makeSolutionHtmlChunks(box.dataset.solutionHtml || '');
            const chunks = chunkHtmls.map((chunkHtml, chunkIndex) => {
                const chunk = document.createElement('span');
                chunk.className = 'sol-chunk';
                chunk.dataset.chunkId = `c${chunkIndex}`;
                chunk.innerHTML = chunkHtml;
                chunkHost.appendChild(chunk);
                return chunk;
            });
            staging.appendChild(chunkHost);
            await deps.typesetMath('solution-decision-chunks', [chunkHost]);
            const measuredChunks = [];
            for (const chunk of chunks) {
                const chunkRaw = deps.measureSolutionOuterFootprint(chunk);
                chunk.classList.add('fit-tight');
                await deps.raf();
                const chunkTight = deps.measureSolutionOuterFootprint(chunk);
                chunk.classList.remove('fit-tight');
                measuredChunks.push({ chunkId: chunk.dataset.chunkId, measuredHeight: chunkRaw, tight: chunkTight });
            }
            chunkHost.remove();
            const chunkTotal = measuredChunks.reduce((sum, chunk) => sum + chunk.measuredHeight, 0);
            const primaryBlockId = `solution-block:${solutionIndex + 1}:primary`;
            box.dataset.solutionDecisionBlockId = primaryBlockId;
            const continuationShell = deps.makeLongSolutionShell(box, solutionIndex + 1, true);
            staging.appendChild(continuationShell);
            await deps.typesetMath('solution-decision-shell', [continuationShell]);
            const continuationShellOverhead = Math.max(1, Number(continuationShell.scrollHeight || 1));
            continuationShell.remove();
            solutionDecisionBlocks.push({
                blockId: primaryBlockId,
                questionKey: `solution-block:${solutionIndex + 1}`,
                measuredHeight: raw,
                measurements: { raw: Math.max(1, raw), tight: Math.max(1, tight) },
                shellOverhead: Math.max(1, raw - chunkTotal),
                continuationShellOverhead,
                chunks: measuredChunks
            });
        }

        if (deps.layoutPlannerMode?.() === 'authority') {
            const planned = await deps.renderSolutionPlan({ area, boxes: solutionBoxes, blocks: solutionDecisionBlocks, measurementsBySource: solutionMeasurementBySource });
            solutionUsableHeight = planned.usableHeight;
            planned.placements.forEach(item => solutionPlacementMap.set(item.blockId, item));
        } else {
            ({ cols } = makeGridPage());
            for (let i = 0; i < solutionBoxes.length; i++) await placeSolutionBox(solutionBoxes[i], i + 1);
        }

        if (appState) {
            appState.solutionDecisionLedger = {
                mode: 'solution',
                usableHeight: Math.max(1, solutionUsableHeight),
                columns: 2,
                blockGap: 0,
                blocks: Object.freeze(solutionDecisionBlocks.map(block => Object.freeze({
                    ...block,
                    measurements: Object.freeze({ ...block.measurements }),
                    chunks: Object.freeze(block.chunks.map(chunk => Object.freeze({ ...chunk })))
                })))
            };
            appState.solutionObservedPlacementLedger = Object.freeze(
                Array.from(solutionPlacementMap.values())
                    .sort((left, right) => left.placementOrder - right.placementOrder)
                    .map(item => Object.freeze({ ...item }))
            );
        }
        return area;
    }

    return Object.freeze({ render });
});
