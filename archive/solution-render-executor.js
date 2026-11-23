(function attachSolutionRenderExecutor(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APSolutionRenderExecutor = api;
})(typeof window !== 'undefined' ? window : globalThis, function createSolutionRenderExecutor(root) {
    'use strict';

    // One shared semantic rule for all output adapters. This is the existing
    // original-engine reminder-image rule, not a change to source image bytes.
    // Install synchronously before any staging measurement; no extra request.
    if (root?.document?.head && !root.document.getElementById('ap-solution-reminder-image-fit')) {
        const style = root.document.createElement('style');
        style.id = 'ap-solution-reminder-image-fit';
        // Source exam figures may carry inline max-width:480px, which outranks an ordinary stylesheet rule.
        // Only solution reminder images must fit the narrow column; keep the source and solution SVGs unchanged.
        style.textContent = '.q-box.sol-box [data-semantic-content="1"] img { max-width: 100% !important; height: auto; }';
        root.document.head.appendChild(style);
    }


    // Avoid visually orphaning only a handful of final solution chunks in the
    // next column/page. Source line breaks and typography remain unchanged;
    // only the split boundary moves earlier when the trailing fragment is tiny.
    const MIN_TRAILING_CONTINUATION_CHUNKS = 8;
    const MIN_LEADING_CONTINUATION_CHUNKS = 2;
    const SOLUTION_TYPESET_BATCH_SIZE = 8;
    const SOLUTION_LAYOUT_YIELD_BUDGET_MS = 8;
    // Initial loading can transfer several MB across 50 solutions. Allow one
    // bounded load+decode budget, then keep the final print readiness gate.
    const SOLUTION_IMAGE_TIMEOUT_MS = 15000;

    // 2026-11-11 user decision: a solution figure that is an SVG is shown at its natural width x k, capped at the
    // column (CSS max-width:100%), height auto, whatever its stored size class says. The figure engine draws labels
    // so that they are about 12 CSS px at this scale (base font 20 x 0.6); the size-class caps (105/145/180px)
    // made published medium figures unreadable (6-7px). Raster images keep the size-class caps.
    const SOLUTION_SVG_DISPLAY_K = 0.6;
    // The x0.6 factor applies only to SVGs at least this wide. The figure engine draws its labels at 20 SVG units on canvases
    // that are (almost) never narrower than 384 (graph/construction minimum 384; solid, number line, stat and container figures
    // are wider), so x0.6 gives them ~12 px labels. Older hand-made SVGs narrower than this were drawn 1:1 (a 120x120 figure with
    // 13-14 px labels): they are shown at their natural width (factor 1), still capped at the column, never shrunk.
    // The step at the threshold is accepted: 383 -> min(383, column) while 384 -> 230; no engine canvas lies below 384 and
    // hand-made SVGs between 250 and 383 were drawn for 1:1 display.
    const SOLUTION_SVG_SCALED_MIN_WIDTH = 384;
    const solutionSvgDisplayFactor = natural => (natural >= SOLUTION_SVG_SCALED_MIN_WIDTH ? SOLUTION_SVG_DISPLAY_K : 1);
    const SVG_SOURCE_PATTERN = /(?:\.svg(?:[?#]|$)|^data:image\/svg\+xml)/i;
    // 2026-11-18: A4 쪽 배치에서는 해설 그림 크기를 figure-size.css(단 폭의 60%, 변수 --ap-fig-sol)가 정하므로 인라인 width를 넣지 않고
    // 그림에 data 속성만 붙인다. 이 규칙이 없는 화면(휴대폰 읽기 배치, figure-size.js를 안 부르는 오답 엔진)은 아래 옛 계산(자연 폭 x 0.6)을 그대로 쓴다.
    function applySolutionSvgDisplayWidth(scope) {
        if (!scope?.querySelectorAll) return 0;
        if (root.APFigureSize?.isActive?.()) {
            root.APFigureSize.classify(scope);
            return 0;
        }
        const images = Array.from(scope.querySelectorAll('.sol-image-wrap:not(.layout-fullwidth) img'));
        if (scope.matches?.('.sol-image-wrap:not(.layout-fullwidth)')) images.push(...Array.from(scope.querySelectorAll('img')));
        let applied = 0;
        new Set(images).forEach(img => {
            if (!SVG_SOURCE_PATTERN.test(img.getAttribute('src') || '')) return;
            const natural = Number(img.naturalWidth) || 0;
            if (natural <= 0) return;
            img.style.width = `${Math.round(natural * solutionSvgDisplayFactor(natural) * 100) / 100}px`;
            applied += 1;
        });
        return applied;
    }

    // A rescued continuation shell holds only the tail of a solution, so without a heading a student cannot tell which
    // question it belongs to. Put "<number>. (이어짐)" at its top. Only shells created by the rescue path are labelled;
    // ordinary continuation shells keep their original DOM.
    function labelContinuationShell(shell, sourceBox, qNo, doc) {
        if (!shell || !doc || typeof shell.querySelector !== 'function' || typeof shell.insertBefore !== 'function' || shell.querySelector('.sol-cont-label')) return shell;
        const numNode = typeof sourceBox?.querySelector === 'function' ? sourceBox.querySelector('.q-num') : null;
        const num = String(numNode?.textContent || '').trim().replace(/\.\s*$/, '') || (Number(qNo) > 0 ? String(qNo) : '');
        if (!num) return shell;
        const label = doc.createElement('div');
        label.className = 'sol-cont-label';
        label.style.cssText = 'font-size:8.5pt;font-weight:700;color:#555;margin:0 0 3px 0;line-height:1.4;';
        label.textContent = `${num}. (이어짐)`;
        shell.insertBefore(label, shell.firstChild);
        return shell;
    }

    // 2026-11-22: 해설 상자 하나가 칸(83mm)을 가로로 넘쳐도 해설지 전체가 실패하지 않게 한다. 이 렌더러(문제지 만들기·mixed_engine)는 예전에
    // 가로 넘침을 아예 다루지 않아, 넘친 상자가 칸 잘림(.grid-col overflow:hidden)으로 잡혀 "PDF readiness failed: content clipped"로 전체가 막혔다.
    // layout-materializer.js(engine.html)와 같은 순서: 늘임표 공백 가두기 -> 줄바꿈·글자 단계(sol-fit-narrow, data-sol-fit 1~4) -> 축소(data-sol-shrink 1~5).
    // 잘림 감지(archive2-pdf-readiness.js)는 그대로 둔다. 넘치지 않는 상자는 손대지 않는다.
    // readiness(archive2-pdf-readiness.js)가 잘림으로 보는 기준(3px 초과)과 같다. 그 밑으로 넘치는 상자는 지금까지처럼 손대지 않는다.
    const SOL_OVERFLOW_TOLERANCE = 3;
    const SOL_FIT_MAX_LEVEL = 4;
    const SOL_SHRINK_MAX_LEVEL = 5;
    function hasHorizontalSolutionOverflow(node, container) {
        const nodeWidth = Number(node?.clientWidth || 0);
        const containerWidth = Number(container?.clientWidth || 0);
        return (nodeWidth > 0 && Number(node.scrollWidth || 0) > nodeWidth + SOL_OVERFLOW_TOLERANCE)
            || (containerWidth > 0 && Number(container.scrollWidth || 0) > containerWidth + SOL_OVERFLOW_TOLERANCE);
    }
    function hasVerticalSolutionOverflow(container) {
        return Number(container?.clientHeight || 0) > 0 && Number(container.scrollHeight || 0) > Number(container.clientHeight) + SOL_OVERFLOW_TOLERANCE;
    }
    // MathJax 늘임표(\overline 등)의 안 보이는 공백(mjx-spacer)이 상자 오른쪽으로 몇 px 삐져나와 가로 넘침으로 잡히는 경우를 먼저 푼다.
    function clipStretchySpacers(box) {
        if (typeof box?.setAttribute !== 'function' || typeof box.querySelector !== 'function') return false;
        if (box.getAttribute?.('data-ap-mjx-clip') || !box.querySelector('mjx-stretchy-h')) return false;
        box.setAttribute('data-ap-mjx-clip', '1');
        return true;
    }
    // 넘치지 않으면 'none'(손대지 않음), 맞췄으면 'fit', 끝내 안 맞으면 'failed'(넘친 채로 둔다, 실패시키지 않음).
    function fitSolutionBoxHorizontally(box, column) {
        if (!hasHorizontalSolutionOverflow(box, column)) return 'none';
        if (clipStretchySpacers(box) && !hasHorizontalSolutionOverflow(box, column)) return 'fit';
        box.classList.add('sol-fit-narrow');
        let level = Number(box.dataset.solFit || 0);
        let shrink = Number(box.dataset.solShrink || 0);
        while (hasHorizontalSolutionOverflow(box, column)) {
            if (level < SOL_FIT_MAX_LEVEL) { level += 1; box.dataset.solFit = String(level); continue; }
            if (shrink >= SOL_SHRINK_MAX_LEVEL) return 'failed';
            shrink += 1;
            box.dataset.solShrink = String(shrink);
        }
        return 'fit';
    }
    // 학생에게 "줄여서 표시했습니다"를 알릴 상자: 글자 단계 1 이상 또는 축소가 걸린 해설.
    function solutionWasShrunk(box) {
        return Number(box?.dataset?.solFit || 0) >= 1 || Number(box?.dataset?.solShrink || 0) >= 1;
    }
    function notifySolutionShrunk(numbers) {
        const list = [...new Set(numbers.filter(Number.isFinite))].sort((a, b) => a - b);
        if (!list.length) return;
        try { root?.APArchiveRenderFeedback?.notice?.(`${list.join('번, ')}번 해설이 칸을 넘어 줄여서 표시했습니다.`); } catch (error) { /* 알림 실패가 출력을 막지 않는다 */ }
    }

    async function measureSolutionBatch(boxes, staging, deps, document) {
        const records = boxes.map(box => ({ box, raw: deps.measureSolutionOuterFootprint(box) }));
        boxes.forEach(box => box.classList.add('fit-tight'));
        await deps.raf();
        records.forEach(record => { record.tight = deps.measureSolutionOuterFootprint(record.box); });
        boxes.forEach(box => box.classList.remove('fit-tight'));
        if (deps.collectSolutionDecisionDetails === false && deps.layoutPlannerMode?.() !== 'authority') return records;
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
            'normalizeQuestionImageSources',
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
        const singleColumn = Number(appState?.qpp) === 1;
        let solutionUsableHeight = 0;
        let solutionPlacementOrder = 0;
        const solutionOccurrences = new Map();
        const solutionPlacementMap = new Map();
        const solutionMeasurementBySource = new Map();
        const solutionDecisionBlocks = [];
        const deferredAuthorityMeasurements = deps.rendererMode() === 'batch'
            && deps.measurementMode?.() === 'batch'
            && deps.layoutPlannerMode?.() === 'authority'
            && deps.renderAuthorityDualRun?.() !== true;
        const observedMeasurementsOnly = deps.measurementMode?.() === 'batch'
            && deps.layoutPlannerMode?.() !== 'authority'
            && deps.collectSolutionDecisionDetails === false;
        const layoutNow = () => root?.performance?.now?.() ?? Date.now();
        let lastLayoutYield = -Infinity;
        const yieldSolutionLayout = async () => {
            // Images and MathJax finish before placement. The following
            // scrollHeight/clientHeight reads synchronously flush CSS layout,
            // including compression, so already typeset boxes need no fixed
            // frame delay. Keep the first barrier and bounded later yields for
            // progress, cancellation and the host's rAF timeout fallback.
            if (layoutNow() - lastLayoutYield >= SOLUTION_LAYOUT_YIELD_BUDGET_MS) {
                await deps.raf();
                lastLayoutYield = layoutNow();
            }
        };

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
            grid.className = `grid-container${singleColumn ? ' sol-fullwidth-grid' : ''}`;
            const l = document.createElement('div');
            l.className = `grid-col sol-grid-col${singleColumn ? ' sol-fullwidth-column' : ''}`;
            const r = document.createElement('div');
            r.className = 'grid-col sol-grid-col';
            grid.appendChild(l);
            if (!singleColumn) grid.appendChild(r);
            p.body.appendChild(grid);
            solutionPageNo = pNum - 1;
            solutionUsableHeight = Math.max(solutionUsableHeight, Number(p.body.clientHeight || 1));
            return { p, cols: singleColumn ? [l] : [l, r] };
        };

        const advanceColumn = () => {
            if (colIdx === 0 && cols.length > 1) colIdx = 1;
            else {
                ({ cols } = makeGridPage());
                colIdx = 0;
            }
            return cols[colIdx];
        };

        const renderSplitSolutionBox = async (sourceBox, qNo) => {
            const originalExp = sourceBox.querySelector('.sol-exp');
            const chunks = deps.makeSolutionHtmlChunks(sourceBox.dataset.solutionHtml || (originalExp ? originalExp.innerHTML : ''));
            if (observedMeasurementsOnly) {
                const block = solutionDecisionBlocks.find(item => item.blockId === sourceBox.dataset.solutionDecisionBlockId);
                if (block) block.actualChunkCount = chunks.length;
            }
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
            let primaryShell = true;
            let rescued = false;

            for (let chunkIndex = 0; chunkIndex < preparedChunks.length; chunkIndex += 1) {
                const chunk = preparedChunks[chunkIndex];
                exp.appendChild(chunk);
                if (deps.rendererMode() === 'legacy') {
                    await deps.typesetMath('solution-split-chunk', [chunk]);
                    await deps.raf();
                } else if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) continue;

                if (exp.children.length > 1) {
                    exp.removeChild(chunk);
                    const trailingCount = preparedChunks.length - chunkIndex;
                    const borrowCount = Math.min(
                        Math.max(0, MIN_TRAILING_CONTINUATION_CHUNKS - trailingCount),
                        Math.max(0, exp.children.length - MIN_LEADING_CONTINUATION_CHUNKS)
                    );
                    const borrowed = borrowCount
                        ? Array.from(exp.children).slice(-borrowCount)
                        : [];
                    targetCol = advanceColumn();
                    shell = deps.makeLongSolutionShell(sourceBox, qNo, true);
                    // Only after a rescue (below) are the following shells labelled too, so layouts that were
                    // fine before keep their exact DOM.
                    if (rescued) labelContinuationShell(shell, sourceBox, qNo, document);
                    exp = shell.querySelector('.sol-exp');
                    targetCol.appendChild(shell);
                    markSolutionPlacement(shell, true);
                    if (borrowed.length) {
                        exp.append(...borrowed);
                        shell.dataset.solutionTrailingRebalance = String(borrowed.length);
                    }
                    exp.appendChild(chunk);
                    if (deps.rendererMode() === 'legacy') await deps.raf();
                    else if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                    primaryShell = false;
                }
                if (targetCol.scrollHeight > targetCol.clientHeight + 2) {
                    deps.autoCompress(shell);
                    if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                    else await deps.raf();
                    // Rescue: the first shell carries the question reminder, figures and answer, so its only chunk
                    // can still clip the column after compression (readiness: more than 3px). Hand that chunk to a
                    // labelled continuation shell, but only when the header alone fits. Anything that fit before
                    // (including after the compression above) is laid out exactly as it always was.
                    if (primaryShell && exp.children.length === 1 && targetCol.scrollHeight > targetCol.clientHeight + 3) {
                        exp.removeChild(chunk);
                        if (deps.rendererMode() === 'legacy') await deps.raf();
                        if (targetCol.scrollHeight <= targetCol.clientHeight + 2) {
                            rescued = true;
                            targetCol = advanceColumn();
                            shell = labelContinuationShell(deps.makeLongSolutionShell(sourceBox, qNo, true), sourceBox, qNo, document);
                            exp = shell.querySelector('.sol-exp');
                            targetCol.appendChild(shell);
                            markSolutionPlacement(shell, true);
                            exp.appendChild(chunk);
                            if (deps.rendererMode() === 'legacy') await deps.raf();
                            else if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                            primaryShell = false;
                            if (targetCol.scrollHeight > targetCol.clientHeight + 2) {
                                deps.autoCompress(shell);
                                if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                                else await deps.raf();
                            }
                        } else {
                            exp.appendChild(chunk);
                        }
                    }
                }
            }
        };

        const placeSolutionBox = async (box, qNo) => {
            while (true) {
                const targetCol = cols[colIdx];
                targetCol.appendChild(box);
                markSolutionPlacement(box, false);
                if (deps.rendererMode() === 'legacy') await deps.typesetMath('solution-box', [box]);
                if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                else await deps.raf();
                // 가로로 넘치는 상자만 칸에 맞춘다(넘치지 않으면 아무것도 바꾸지 않음). 아래 높이 검사가 줄어든 높이를 그대로 본다.
                fitSolutionBoxHorizontally(box, targetCol);
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

                deps.autoCompress(box);
                if (deps.rendererMode() === 'batch') await yieldSolutionLayout();
                else {
                    await deps.raf();
                    await deps.raf();
                }
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
            const reminderRawContent = deps.stripInlineImagesFromContent(q.content || q.question || '', !!q.image || q.solutionReminderImagePolicy === 'STRIP_INLINE');
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
            // 2026-11-18: 그림 크기 규칙을 쓰는 엔진(figure-size.js 로드)은 해설 그림을 쪽 전체 폭으로 놓지 않는다. 오답 엔진은 옛 동작.
            box.dataset.solutionFullWidth = q.solutionImageLayout === 'fullwidth' && !root.APFigureSize ? 'true' : 'false';
            box.dataset.solutionHtml = solutionHtml;
            const sectionHtml = typeof deps.getSectionHeadingHtml === 'function' ? deps.getSectionHeadingHtml(q, i, 'box') : '';
            box.innerHTML = `${sectionHtml}<div class="q-num">${i + 1}.</div><div data-semantic-content="1" style="margin-bottom:8px;color:#555;font-size:8.5pt;">${reminderContent}</div><div class="sol-meta"><div class="sol-ans">[정답] ${deps.wrapLatex(q.answer ?? '-')}</div>${solutionImageHtml}<div class="sol-exp">${solutionHtml}</div></div>`;
            deps.normalizeQuestionImageSources(box);
            root?.APRenderDiagnostics?.noteHtml?.(box, [q.content, q.solution]); // 태그 짝이 안 맞으면 알림 띠에만 알린다(그림은 그대로)
            staging.appendChild(box);
            return box;
        });
        const solutionImages = Array.from(staging.querySelectorAll('img'));
        let readyImages = 0;
        deps.onSolutionProgress?.({ phase: 'images', completed: 0, total: solutionImages.length });
        await Promise.all(solutionImages.map(async img => {
            await deps.waitForQuestionImage(img, SOLUTION_IMAGE_TIMEOUT_MS);
            deps.onSolutionProgress?.({ phase: 'images', completed: ++readyImages, total: solutionImages.length });
        }));
        // Images are loaded here (natural size known) before any measuring or pagination; no second fetch.
        applySolutionSvgDisplayWidth(staging);
        if (deps.rendererMode() === 'batch') {
            // MathJax owns a single document. Keep calls serial and give input,
            // cancellation and the progress display a turn between small batches.
            for (let start = 0; start < solutionBoxes.length; start += SOLUTION_TYPESET_BATCH_SIZE) {
                const batch = solutionBoxes.slice(start, start + SOLUTION_TYPESET_BATCH_SIZE);
                await deps.typesetMath('solution-staging', batch);
                deps.onSolutionProgress?.({ phase: 'math', completed: start + batch.length, total: solutionBoxes.length });
                await deps.raf();
            }
        }
        deps.onSolutionProgress?.({ phase: 'layout', completed: 0, total: solutionBoxes.length });
        if (deps.measurementMode?.() === 'batch' && deferredAuthorityMeasurements) {
            // The authority materializer measures each box in the selected
            // output column before it plans placement. Defer measurements and
            // chunk generation until that consumer proves a box needs splitting.
            solutionBoxes.forEach((box, index) => {
                const blockId = `solution-block:${index + 1}:primary`;
                box.dataset.solutionDecisionBlockId = blockId;
                solutionDecisionBlocks.push({
                    blockId,
                    questionKey: `solution-block:${index + 1}`,
                    measuredHeight: 1,
                    measurements: { raw: 1, tight: 1 },
                    fullWidth: box.dataset.solutionFullWidth === 'true',
                    deferredChunkCount: true,
                    chunks: []
                });
            });
        } else if (deps.measurementMode?.() === 'batch') {
            const records = await measureSolutionBatch(solutionBoxes, staging, deps, document);
            records.forEach((record, index) => {
                const sourceRef = String(record.box.getAttribute('data-source-ref') || '').trim();
                const measurements = { raw: Math.max(1, record.raw), tight: Math.max(1, record.tight) };
                solutionMeasurementBySource.set(sourceRef, measurements);
                const blockId = `solution-block:${index + 1}:primary`;
                record.box.dataset.solutionDecisionBlockId = blockId;
                const chunks = (record.chunks || []).map(({ chunkId, measuredHeight, tight }) => ({ chunkId, measuredHeight, tight }));
                solutionDecisionBlocks.push({ blockId, questionKey: `solution-block:${index + 1}`, measuredHeight: record.raw, measurements,
                    fullWidth: record.box.dataset.solutionFullWidth === 'true',
                    deferredChunkCount: observedMeasurementsOnly,
                    shellOverhead: observedMeasurementsOnly ? undefined : Math.max(1, record.raw - chunks.reduce((sum, chunk) => sum + chunk.measuredHeight, 0)),
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
                fullWidth: box.dataset.solutionFullWidth === 'true',
                shellOverhead: Math.max(1, raw - chunkTotal),
                continuationShellOverhead,
                chunks: measuredChunks
            });
        }

        if (deps.layoutPlannerMode?.() === 'authority') {
            const planned = await deps.renderSolutionPlan({
                area,
                boxes: solutionBoxes,
                blocks: solutionDecisionBlocks,
                measurementsBySource: solutionMeasurementBySource,
                deferChunkMeasurements: deferredAuthorityMeasurements
            });
            solutionUsableHeight = planned.usableHeight;
            planned.placements.forEach(item => solutionPlacementMap.set(item.blockId, item));
        } else {
            ({ cols } = makeGridPage());
            for (let i = 0; i < solutionBoxes.length; i++) {
                await placeSolutionBox(solutionBoxes[i], i + 1);
                deps.onSolutionProgress?.({ phase: 'layout', completed: i + 1, total: solutionBoxes.length });
            }
        }
        deps.onSolutionProgress?.({ phase: 'layout', completed: solutionBoxes.length, total: solutionBoxes.length });

        // 안전망: 쪽을 다 만든 뒤에도 칸을 가로로 넘치는 해설(이어짐 상자 포함)은 그 상자만 줄여서, 해설지 전체가 readiness의 "칸 잘림"으로
        // 실패하지 않게 한다. 넘치지 않는 상자는 그대로 두므로 정상 문제지의 출력은 바뀌지 않는다.
        const numberBySourceRef = new Map(solutionBoxes.map((box, index) => [box.dataset.sourceRef, index + 1]));
        const shrunkNumbers = [];
        (area.querySelectorAll?.('.sol-box') || []).forEach(node => {
            const column = typeof node.closest === 'function' ? node.closest('.grid-col') : null;
            if (!column) return;
            const verticalBefore = hasVerticalSolutionOverflow(column);
            const result = fitSolutionBoxHorizontally(node, column);
            if (result === 'none') return;
            if (result === 'failed') {
                try { console.warn('[archive-solution] horizontal fit failed; keeping this solution as is', { sourceRef: node.dataset.sourceRef }); } catch (error) { /* diagnostics only */ }
            }
            // 줄바꿈 맞춤이 세로로 길이를 늘려 칸 아래가 잘리면 한 단계씩 더 줄여 높이를 지킨다.
            let shrink = Number(node.dataset.solShrink || 0);
            while (!verticalBefore && hasVerticalSolutionOverflow(column) && shrink < SOL_SHRINK_MAX_LEVEL) {
                shrink += 1;
                node.dataset.solShrink = String(shrink);
            }
        });
        (area.querySelectorAll?.('.sol-box') || []).forEach(node => {
            if (solutionWasShrunk(node)) shrunkNumbers.push(numberBySourceRef.get(node.dataset?.sourceRef));
        });
        notifySolutionShrunk(shrunkNumbers);

        if (appState) {
            const chunkCounts = solutionDecisionBlocks.map(block => Number.isInteger(block.actualChunkCount)
                ? block.actualChunkCount
                : block.chunks.length);
            appState.solutionDecisionLedger = {
                mode: 'solution',
                schemaVersion: deferredAuthorityMeasurements || observedMeasurementsOnly ? 'SOLUTION_LAYOUT_ROSTER_V1' : 'SOLUTION_DECISION_DETAIL_V1',
                measurementSource: deferredAuthorityMeasurements
                    ? 'actual-output-column-flowHeight'
                    : (observedMeasurementsOnly ? 'solution-full-box-batch' : (deps.measurementMode?.() === 'batch' ? 'solution-decision-batch' : 'solution-per-question-legacy')),
                questionDenominator: solutionDecisionBlocks.length,
                fullBoxMeasurementCount: solutionDecisionBlocks.length,
                chunksGeneratedQuestionCount: solutionDecisionBlocks.filter(block => Number.isInteger(block.actualChunkCount) || block.chunks.length > 0).length,
                splitCandidateCount: chunkCounts.filter(count => count > 1).length,
                measuredChunkRangeCount: solutionDecisionBlocks.reduce((sum, block) => sum + Number(block.measuredRangeCount || 0), 0),
                measuredChunkCount: observedMeasurementsOnly ? 0 : chunkCounts.reduce((sum, count) => sum + count, 0),
                measurementPolicy: deferredAuthorityMeasurements ? Object.freeze({
                    fullBox: 'raw+tight actual selected-column flowHeight for every question',
                    chunks: 'materialize only after both full-box measurements exceed selected-column capacity',
                    chunkRangeMeasurements: 'planner-requested ranges measured on demand',
                    sourceQuestionCount: solutionDecisionBlocks.length
                }) : observedMeasurementsOnly ? Object.freeze({
                    fullBox: 'raw+tight staging footprint for every question',
                    chunks: 'created only when observed placement needs a split; no diagnostic clone pass',
                    chunkRangeMeasurements: 'not collected',
                    sourceQuestionCount: solutionDecisionBlocks.length
                }) : null,
                usableHeight: Math.max(1, solutionUsableHeight),
                columns: singleColumn ? 1 : 2,
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
        // 해설 한 문항이 쪽을 넘치게 해(인쇄 사전 점검 "content clipped") 해설지 전체가 못 나오는 일을 막는다: 넘치는 쪽의 범인 문항만 자리 표시로 바꾼다.
        // 쪽이 넘치지 않으면 아무것도 하지 않는다.
        try { root?.APRenderDiagnostics?.guardOverflow?.(area); } catch (error) { /* 진단 도우미 실패가 출력을 막지 않는다 */ }
        return area;
    }

async function renderComposed({ area, items, deps }) {
    const { document, makePage, makeBox, makeSolutionHtmlChunks, makeLongSolutionShell, applyAutoImageSizeClasses, autoCompress, raf } = deps;
    let pageNo = 1;
    let cols = null;
    let colIdx = 0;
    const preparedBoxes = new WeakSet();
    let lastChunkYield = performance.now();
    async function yieldChunkLayout() {
        // scrollHeight/clientHeight synchronously flush layout. An animation
        // frame per text or BR chunk is unnecessary; yield on a time budget
        // instead so long solutions remain cancellable and the UI responsive.
        if (performance.now() - lastChunkYield >= 8) {
            await raf();
            lastChunkYield = performance.now();
        }
    }

    const makeGridPage = () => {
        const page = makePage(area, pageNo++);
        const grid = document.createElement('div');
        grid.className = 'grid-container';
        grid.style.flex = '1 1 0';
        const left = document.createElement('div');
        left.className = 'grid-col';
        const right = document.createElement('div');
        right.className = 'grid-col';
        grid.appendChild(left);
        grid.appendChild(right);
        page.body.appendChild(grid);
        cols = [left, right];
        colIdx = 0;
        return cols;
    };

    const advanceColumn = () => {
        if (colIdx === 0) colIdx = 1;
        else { makeGridPage(); }
        return cols[colIdx];
    };


    // 한 컬럼에 해설 박스 하나만 있는데도 안 들어가면 해설을 조각내 다음 컬럼/페이지로 이어붙인다.
    async function renderSplitSolutionBox(sourceBox) {
        const originalExp = sourceBox.querySelector('.sol-exp');
        const chunks = makeSolutionHtmlChunks(sourceBox.dataset.solutionHtml || (originalExp ? originalExp.innerHTML : ''));
        let shell = makeLongSolutionShell(sourceBox, false);
        let exp = shell.querySelector('.sol-exp');
        let targetCol = cols[colIdx];
        targetCol.appendChild(shell);
        const preparedChunks = chunks.map(chunkHtml => {
            const chunk = document.createElement('span');
            chunk.className = 'sol-chunk';
            chunk.innerHTML = chunkHtml;
            return chunk;
        });
        let chunkStage = null;
        try {
            await applyAutoImageSizeClasses(shell);
            if (deps.stagingHost) {
                // Match the real shell's width and inherited solution typography.
                // Typeset all fragments once, then move the resulting DOM intact.
                chunkStage = makeLongSolutionShell(sourceBox, false);
                chunkStage.style.width = `${shell.getBoundingClientRect().width}px`;
                const stageExp = chunkStage.querySelector('.sol-exp');
                stageExp.append(...preparedChunks);
                deps.stagingHost.appendChild(chunkStage);
                await deps.typesetMath('composition-solution-chunks', [stageExp]);
                // Remaining staged chunks need no further layout. Detaching avoids
                // relaying out the shrinking staging document after every move.
                chunkStage.remove();
            }
            for (let chunkIndex = 0; chunkIndex < preparedChunks.length; chunkIndex += 1) {
                const chunk = preparedChunks[chunkIndex];
                exp.appendChild(chunk);
                if (!chunkStage) await deps.typesetMath('composition-solution-chunk', [chunk]);
                await yieldChunkLayout();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) continue;

                // 현재 쉘에 둘 이상 조각이 있으면 마지막 조각을 다음 컬럼/페이지의 새 쉘로 넘긴다.
                if (exp.children.length > 1) {
                    exp.removeChild(chunk);
                    const trailingCount = preparedChunks.length - chunkIndex;
                    const borrowCount = Math.min(
                        Math.max(0, MIN_TRAILING_CONTINUATION_CHUNKS - trailingCount),
                        Math.max(0, exp.children.length - MIN_LEADING_CONTINUATION_CHUNKS)
                    );
                    const borrowed = borrowCount
                        ? Array.from(exp.children).slice(-borrowCount)
                        : [];
                    targetCol = advanceColumn();
                    shell = makeLongSolutionShell(sourceBox, true);
                    exp = shell.querySelector('.sol-exp');
                    targetCol.appendChild(shell);
                    if (borrowed.length) {
                        exp.append(...borrowed);
                        shell.dataset.solutionTrailingRebalance = String(borrowed.length);
                    }
                    exp.appendChild(chunk);
                    // Moving already typeset chunks does not introduce new TeX.
                    await yieldChunkLayout();
                }
                if (targetCol.scrollHeight > targetCol.clientHeight + 2) {
                    autoCompress(shell);
                    await yieldChunkLayout();
                }
            }
        } finally {
            // Moved fragments belong to the live shells. Clear only abandoned
            // staging/source nodes, including the original oversized box.
            try { deps.clearMath?.([sourceBox, ...(chunkStage ? [chunkStage] : [])]); }
            finally { chunkStage?.remove(); }
        }
    }

    async function placeBox(box) {
        while (true) {
            const targetCol = cols[colIdx];
            targetCol.appendChild(box);
            if (!preparedBoxes.has(box)) {
                await applyAutoImageSizeClasses(box);
                // Natural size must be known before this box is measured; a failed image keeps the CSS fallback.
                await Promise.all(Array.from(box.querySelectorAll('.sol-image-wrap img')).map(img => (
                    (img.complete && img.naturalWidth > 0) || typeof deps.waitForQuestionImage !== 'function'
                        ? null
                        : deps.waitForQuestionImage(img, SOLUTION_IMAGE_TIMEOUT_MS).catch(() => null)
                )));
                applySolutionSvgDisplayWidth(box);
                await deps.typesetMath('composition-solution-box', [box]);
                preparedBoxes.add(box);
            }
            await raf();
            if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

            autoCompress(box);
            await raf();
            // Compression changes CSS only; the preceding barrier measures it.
            if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

            // 이 컬럼에 이 해설 박스 하나뿐이면 쪼개서 출력한다(잘림 금지).
            const isOnlyBoxInColumn = targetCol.querySelectorAll('.sol-box').length === 1;
            targetCol.removeChild(box);
            if (isOnlyBoxInColumn) {
                await renderSplitSolutionBox(box);
                return;
            }
            advanceColumn();
        }
    }

    makeGridPage();
    // Clinic can prepare a large cohort once at the real column width. Moving
    // already typeset boxes into equal-width columns preserves their geometry
    // and avoids repeatedly walking the growing MathJax document per question.
    if (deps.batchTypeset === true) {
        const boxes = items.map(makeBox);
        const firstColumn = cols[0];
        const checkpointStore = deps.solutionCheckpointStore;
        // Bounded batches keep a full-grade paper responsive and avoid a single
        // column containing hundreds of large solution images during typeset.
        for (let start = 0; start < boxes.length; start += 24) {
            let batch = boxes.slice(start, start + 24);
            // Fingerprint each completed batch independently: an edit to question 311
            // must not invalidate already checked solution batches 1–288.
            const checkpointKey = await checkpointStore?.createKey(batch);
            if (checkpointKey) deps.onSolutionCheckpointKey?.(checkpointKey);
            let restored = null;
            if (checkpointKey) restored = await checkpointStore.load(checkpointKey, start, batch.length);
            if (Array.isArray(restored) && restored.length === batch.length) {
                const cachedBoxes = restored.map((html, index) => {
                    const template = document.createElement('template');
                    template.innerHTML = String(html || '').trim();
                    const cached = template.content.firstElementChild;
                    const source = batch[index];
                return cached?.classList.contains('sol-box') &&
                        cached.dataset.sourceRef === source.dataset.sourceRef &&
                        cached.dataset.solutionHtml === source.dataset.solutionHtml &&
                        !cached.querySelector('mjx-merror') && !root.APRenderLoop.unrenderedMathCount(cached) ? cached : null;
                });
                if (cachedBoxes.every(Boolean)) {
                    batch = cachedBoxes;
                    boxes.splice(start, batch.length, ...batch);
                    for (const box of batch) preparedBoxes.add(box);
                    if (start > 0) deps.onSolutionCheckpointResume?.(start, items.length);
                }
            }
            const needsTypeset = !batch.every(box => preparedBoxes.has(box));
            if (needsTypeset) {
                firstColumn.append(...batch);
                await applyAutoImageSizeClasses(firstColumn);
                const mathReady = await deps.typesetMath('composition-solution-batch', batch);
                if (mathReady !== true || batch.some(box => box.querySelector('mjx-merror') || root.APRenderLoop.unrenderedMathCount(box))) {
                    throw Error('MATH_TYPESET_INCOMPLETE');
                }
                for (const box of batch) preparedBoxes.add(box);
                if (checkpointKey && batch.every(box => preparedBoxes.has(box))) {
                    await checkpointStore.save(checkpointKey, start, batch.map(box => box.outerHTML));
                }
            }
            for (const box of batch) { preparedBoxes.add(box); box.remove(); }
            for (const box of batch) await placeBox(box);
        }
        return;
    }
    for (let idx = 0; idx < items.length; idx++) {
        await placeBox(makeBox(items[idx], idx));
    }
}

    return Object.freeze({ render, renderComposed, applySolutionSvgDisplayWidth, fitSolutionBoxHorizontally, SOLUTION_SVG_DISPLAY_K, SOLUTION_SVG_SCALED_MIN_WIDTH });
});
