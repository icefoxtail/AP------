(function attachExamRenderExecutor(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APExamRenderExecutor = api;
})(typeof window !== 'undefined' ? window : globalThis, function createExamRenderExecutor(root) {
    'use strict';

    // Size and paginate only after every question figure has loaded/decoded.
    // Share the existing solution asset budget; a 1.2s staging wait can reject
    // valid cold images before MathJax or any page measurement begins.
    const EXAM_IMAGE_TIMEOUT_MS = 15000;

    const CLIP_TOLERANCE_PX = 3;

    // Fallback ladder for a question that still clips at the smallest text/figure size. Steps are tried
    // one at a time, only for the clipped question: (1) the same column, taller (2 rows, ... up to the whole
    // column), (2) one full-width row, (3) a page of its own. A full page is the last resort.
    function fallbackLadder(qpp) {
        const rows = Math.max(1, Math.ceil(Number(qpp) / 2));
        const ladder = [];
        if (Number(qpp) >= 2) for (let span = 2; span <= rows; span += 1) ladder.push({ span });
        if (rows >= 2) ladder.push({ row: true });
        ladder.push({ page: true });
        return ladder;
    }
    // forced: Map(item -> step). A bare Set (older callers/tests) means "own page".
    function fallbackStep(forced, item) {
        if (!forced) return null;
        if (typeof forced.get === 'function') return forced.get(item) || null;
        return forced.has(item) ? { page: true } : null;
    }
    function injectGridRowStyle(document) {
        if (!document?.head || typeof document.getElementById !== 'function' || document.getElementById('ap-exam-grid-row-style')) return;
        const style = document.createElement('style');
        style.id = 'ap-exam-grid-row-style';
        style.textContent = '.grid-container.ap-grid-row-page::after{display:none}'
            + '.grid-container.ap-grid-row-page>.grid-col.ap-grid-row-left{border-right:1px solid #000}';
        document.head.appendChild(style);
    }

    // Question boxes whose content is still cut off after every fit step. Same test as
    // Archive2PdfReadiness.assertLayoutReady (clipping overflow + scroll size beyond client size + 3px),
    // restricted to elements inside a question box. The readiness check itself is not changed.
    function clippedQuestionBoxes(page) {
        const view = page.ownerDocument?.defaultView || root;
        const clipped = [];
        page.querySelectorAll('.q-box').forEach(box => {
            const hit = [box, ...box.querySelectorAll('*')].some(element => {
                const tooTall = element.scrollHeight > element.clientHeight + CLIP_TOLERANCE_PX;
                const tooWide = element.scrollWidth > element.clientWidth + CLIP_TOLERANCE_PX;
                if (!tooTall && !tooWide) return false;
                const style = view.getComputedStyle(element);
                const clips = value => value === 'hidden' || value === 'clip';
                return (tooWide && clips(style.overflowX)) || (tooTall && clips(style.overflowY));
            });
            if (hit) clipped.push(box);
        });
        return clipped;
    }

    // allowSpan: 시험지 렌더(render)는 입구(APRenderStateNormalizer.renderQuestionLayout)에서 배치 힌트를 이미 지웠고 layoutForce만
    // subjective-2up으로 남아 있다. 그래서 쪽당 4문항이면 항상 균등 칸 엔진이 놓고, 한 단 전체(span 2)는 그 엔진이 정한다.
    // 반 합성(renderComposed)은 입구 정리가 없어 예전처럼 태그가 있으면 옛 갈래를 쓴다.
    function usesEqualSlots(qpp, questions, deps, allowSpan = false) {
        const url = deps.engineUrl || root.location?.href || 'https://ap.invalid/';
        const params = new URL(url, 'https://ap.invalid/').searchParams;
        if (Number(qpp) !== 4 || params.get('slotEngine') === 'legacy') return false;
        if (!allowSpan && params.get('equalSlots') !== '1' && questions.some(q => q.wide === true || ['fullwidth', 'subjective-2up', 'subjective-4up'].includes(q.layoutTag))) return false;
        if (!root.APEqualSlotEngine) throw Object.assign(new Error('EQUAL_SLOT_ENGINE_UNAVAILABLE'), { code: 'EQUAL_SLOT_ENGINE_UNAVAILABLE' });
        return root.APEqualSlotEngine.enabled(qpp, url, questions, allowSpan);
    }

    function buildSlotPages(items, qpp, forcedWide) {
        const rowCount = Math.max(1, Math.ceil(Number(qpp) / 2));
        const slotColumnCount = Number(qpp) === 1 ? 1 : 2;
        const spanFor = item => {
            const tag = item.q.layoutTag || '';
            if (tag === 'subjective-2up') return rowCount;
            if (tag === 'subjective-4up') return Math.max(1, Math.ceil(rowCount / 2));
            return 1;
        };
        const newSlotPage = () => ({
            placements: [],
            occupied: Array.from({ length: rowCount }, () => Array(slotColumnCount).fill(false)),
            cursor: 0
        });
        // Reading-order slot assignment: a page is read column by column (left column top to bottom, then
        // the right one), so a slot may only be taken AFTER the last one placed. A question that spans a
        // whole column (subjective-2up) starts a fresh column and leaves the rest of the current column
        // empty; a later question never back-fills a gap above it. Numbers always read in ascending order.
        const findSlot = (pageData, span, colSpan = 1) => {
            for (let position = pageData.cursor; position < rowCount * slotColumnCount; position += 1) {
                const col = Math.floor(position / rowCount);
                const row = position % rowCount;
                if (row + span > rowCount) { position += rowCount - row - 1; continue; }
                // A full-width row cell (fallback ladder) can only start from the first column.
                if (colSpan > 1 && col !== 0) return null;
                if (col + colSpan > slotColumnCount) continue;
                let fits = true;
                for (let offset = 0; offset < span && fits; offset += 1) {
                    for (let c = 0; c < colSpan; c += 1) {
                        if (pageData.occupied[row + offset][col + c]) { fits = false; break; }
                    }
                }
                if (fits) return { row, col, span, colSpan };
            }
            return null;
        };
        const commitSlot = (pageData, placement) => {
            for (let offset = 0; offset < placement.span; offset += 1) {
                for (let c = 0; c < placement.colSpan; c += 1) pageData.occupied[placement.row + offset][placement.col + c] = true;
            }
            // The cells beside a full-width row that sit above it would be read after the cells below it
            // in the first column, so they stay empty.
            if (placement.colSpan > 1) {
                for (let row = 0; row < placement.row; row += 1) {
                    for (let c = placement.col + 1; c < slotColumnCount; c += 1) pageData.occupied[row][c] = true;
                }
            }
            pageData.cursor = placement.col * rowCount + placement.row + placement.span;
            pageData.placements.push(placement);
        };
        const slotPages = [];
        let slotPage = newSlotPage();
        const flushSlotPage = () => {
            if (slotPage.placements.length) slotPages.push(slotPage);
            slotPage = newSlotPage();
        };
        for (const item of items) {
            const tag = item.q.layoutTag || '';
            const step = fallbackStep(forcedWide, item);
            if (tag === 'fullwidth' || step?.page) {
                flushSlotPage();
                slotPages.push({ wideItem: item });
                continue;
            }
            const span = Math.min(rowCount, Math.max(spanFor(item), step?.span || 1));
            const colSpan = step?.row && slotColumnCount > 1 ? 2 : 1;
            let placement = findSlot(slotPage, span, colSpan);
            if (!placement) {
                flushSlotPage();
                placement = findSlot(slotPage, span, colSpan);
            }
            commitSlot(slotPage, { item, ...placement });
        }
        flushSlotPage();
        return slotPages;
    }

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
            'autoCompress', 'rendererMode', 'normalizeQuestionImageSources'
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
        const prepareImageSizes = target => deps.applyAutoImageSizeClasses(target, EXAM_IMAGE_TIMEOUT_MS, deps.abortSignal);
        staging.style.width = '83mm';
        staging.innerHTML = '';
        let pNum = 1;
        const items = data.map((q, i) => {
            const box = document.createElement('div');
            box.className = 'q-box';
            box.dataset.sourceRef = deps.getArchiveQuestionSourceRef(q, i);
            // 그림 크기 규칙(figure-size.js): 보기가 그림 안에 든 문항은 그림을 줄이지 않는다. 오답 엔진은 이 모듈을 불러오지 않아 영향이 없다.
            if (root.APFigureSize?.choicesAreFigure(q)) box.dataset.apFigBundle = '1';
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
            const sectionHtml = typeof deps.getSectionHeadingHtml === 'function' ? deps.getSectionHeadingHtml(q, i, 'box') : '';
            box.innerHTML = `${sectionHtml}<div class="q-num">${i + 1}.</div>
                             <div class="q-content">${formattedContent}</div>
                             ${imageHTML}
                             ${choicesHTML}`;
            deps.normalizeQuestionImageSources(box);
            staging.appendChild(box);
            return { q, box, originalIndex: i };
        });
        if (usesEqualSlots(appState.qpp, data, deps, true)) {
            appState.layoutMeasurementLedger = null;
            return root.APEqualSlotEngine.render({ area, items, deps: {
                ...deps, applyAutoImageSizeClasses: prepareImageSizes, deferFinalize: true, autoPromote: true,
                makePage: (target, number) => { const page = deps.makePage(target, 'exam', number); return { page, body: page.body }; }
            } });
        }
        await prepareImageSizes(staging);
        await deps.typesetMath('exam-staging', [staging]);
        await deps.raf();
        await measureProfiles(items, deps);
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
        if (deps.layoutPlannerMode?.() === 'authority') return deps.renderExamPlan({ area, items, usableHeight: usablePageHeight });

        // A question that still overflows its slot at the smallest text/figure size must not stop the whole
        // paper ("PDF readiness failed: content clipped"). Only that question moves down the fallback ladder
        // (taller in its own column -> one full-width row -> a page of its own) and the paper is paginated
        // again; questions that fit keep their placement.
        const forcedWide = new Map();
        const ladder = fallbackLadder(appState.qpp);
        injectGridRowStyle(document);
        const cloneItems = new WeakMap();
        let builtPages = [];
        const cloneFor = item => {
            const clone = item.box.cloneNode(true);
            const step = forcedWide.get(item);
            if (step) clone.dataset.apFallback = step.page ? 'page' : step.row ? 'row' : `tall-${step.span}`;
            cloneItems.set(clone, item);
            return clone;
        };
        const trackPage = page => { builtPages.push(page); return page; };
        const layoutPass = async () => {
        pNum = 1;
        const needsSlotPlacement = Array.from(forcedWide.values()).some(step => !step.page);
        const usesSlotLayout = needsSlotPlacement || items.some(item => ['subjective-2up', 'subjective-4up'].includes(item.q.layoutTag || ''));
        if (usesSlotLayout) {
            const rowCount = Math.max(1, Math.ceil(appState.qpp / 2));
            const slotColumnCount = Number(appState.qpp) === 1 ? 1 : 2;
            const slotPages = buildSlotPages(items, appState.qpp, forcedWide);

            let slotPageNumber = 1;
            for (const slotPageData of slotPages) {
                const page = trackPage(deps.makePage(area, 'exam', slotPageNumber++));
                if (slotPageData.wideItem) {
                    const wideCol = document.createElement('div');
                    wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                    wideCol.appendChild(cloneFor(slotPageData.wideItem));
                    page.body.appendChild(wideCol);
                } else if (slotPageData.placements.some(entry => (entry.colSpan || 1) > 1)) {
                    // A full-width row cannot live in a two-column flow: place every cell on an explicit grid.
                    const grid = document.createElement('div');
                    grid.className = 'grid-container ap-grid-row-page';
                    grid.style.cssText = `flex:1 1 0; grid-template-rows:repeat(${rowCount}, minmax(0, 1fr));`;
                    slotPageData.placements.forEach(entry => {
                        const cell = document.createElement('div');
                        cell.className = 'grid-col';
                        if (entry.col === 0 && (entry.colSpan || 1) === 1) cell.classList.add('ap-grid-row-left');
                        cell.style.gridRow = `${entry.row + 1} / span ${entry.span}`;
                        cell.style.gridColumn = `${entry.col + 1} / span ${entry.colSpan || 1}`;
                        cell.appendChild(cloneFor(entry.item));
                        grid.appendChild(cell);
                    });
                    page.body.appendChild(grid);
                } else {
                    const grid = document.createElement('div');
                    grid.className = 'grid-container';
                    grid.style.flex = '1 1 0';
                    const columns = Array.from({ length: slotColumnCount }, () => {
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
                        ordered.slice(0, split).forEach(item => columns[0].appendChild(cloneFor(item)));
                        ordered.slice(split).forEach(item => columns[1]?.appendChild(cloneFor(item)));
                    } else {
                        for (let col = 0; col < slotColumnCount; col += 1) {
                            let row = 0;
                            while (row < rowCount) {
                                const placement = slotPageData.placements.find(entry => entry.col === col && entry.row === row);
                                if (placement) {
                                    const clone = cloneFor(placement.item);
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
            if (layoutTag === 'fullwidth' || fallbackStep(forcedWide, item)?.page) { qType = 'wide'; limit = 1; }
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
            const page = !firstPage ? (firstPage = trackPage(deps.makePage(area, 'exam', pNum))) : trackPage(deps.makePage(area, 'exam', ++pNum));
            pageData.blocks.forEach((block, bIdx) => {
                if (block.type === 'wide') {
                    const wideCol = document.createElement('div');
                    wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                    wideCol.appendChild(cloneFor(block.items[0]));
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
                    block.items.slice(0, split).forEach(item => bLeft.appendChild(cloneFor(item)));
                    block.items.slice(split).forEach(item => bRight.appendChild(cloneFor(item)));
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
        };
        // A stretchy math bar (overline/arrow) draws a spacer a few px past its box; MathJax only clips it with
        // clip-path, so the spacer still counts as scrollable overflow. First retry such a question with the
        // paint-only clip (mixed_engine.html [data-ap-mjx-clip]) before moving it down the ladder. Questions that
        // do not clip never get the attribute, so their output is unchanged.
        const mjxClipTried = new Set();
        for (let pass = 0; ; pass += 1) {
            builtPages = [];
            await layoutPass();
            if (pass > ladder.length + 1) break;
            const escalate = new Map();
            let marked = false;
            builtPages.forEach(page => clippedQuestionBoxes(page).forEach(box => {
                const item = cloneItems.get(box);
                if (!item || item.q.layoutTag === 'fullwidth') return;
                if (!mjxClipTried.has(item) && typeof box.querySelector === 'function' && box.querySelector('mjx-stretchy-h > mjx-ext')
                    && typeof item.box.setAttribute === 'function') {
                    mjxClipTried.add(item);
                    item.box.setAttribute('data-ap-mjx-clip', '1');
                    marked = true;
                    return;
                }
                const current = forcedWide.get(item);
                const next = ladder[current ? ladder.indexOf(current) + 1 : 0];
                if (next) escalate.set(item, next);
            }));
            if (!escalate.size && !marked) break;
            escalate.forEach((step, item) => forcedWide.set(item, step));
            builtPages.forEach(page => page.remove());
        }
        return area;
    }

async function renderComposed({ area, items, deps }) {
    const { document, staging, buildBox, makePage, applyAutoImageSizeClasses, raf, fitQuestionBox, autoCompress, afterPage } = deps;
    const { qpp, SE_OVERHEAD_COL, SE_OVERHEAD_GRID, SE_PAGE_TOLERANCE, SE_BLOCK_GAP } = deps;
    if (!items.length) return;
    staging.style.width = '83mm';
    staging.innerHTML = '';

    const stagedItems = items.map((q, idx) => {
        const box = buildBox(q, idx);
        staging.appendChild(box);
        return { q, box };
    });

    if (usesEqualSlots(qpp, items, deps)) {
        return root.APEqualSlotEngine.render({ area, items: stagedItems, deps: { ...deps, deferFinalize: true } });
    }

    await applyAutoImageSizeClasses(staging);
    await deps.typesetMath('composition-exam', [staging]);
    await raf();

    await measureProfiles(stagedItems, { raf, measurementMode: () => 'batch' });

    const tempPage = makePage(area, 0);
    const usablePageHeight = tempPage.body.clientHeight;
    area.removeChild(tempPage.page);

    const pages = [];
    let currentPage = { blocks: [], usedHeight: 0 };
    let activeChunk = [];
    let currentType = null;

    const flushBlock = () => {
        if (!activeChunk.length) return;
        const type = currentType || 'normal';
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

        const gap = currentPage.blocks.length ? SE_BLOCK_GAP : 0;
        const normalForceBreak = type === 'normal' && currentPage.blocks.length > 0;
        if ((normalForceBreak || currentPage.usedHeight + gap + blockH > usablePageHeight) && currentPage.blocks.length > 0) {
            pages.push(currentPage);
            currentPage = { blocks: [], usedHeight: 0 };
        }

        currentPage.usedHeight += (currentPage.blocks.length ? SE_BLOCK_GAP : 0) + blockH;
        currentPage.blocks.push({ type, items: chunk, blockH });
        activeChunk = [];
    };

    stagedItems.forEach(item => {
        const layoutTag = item.q.layoutTag || '';
        let qType = 'normal';
        let limit = qpp;
        if (item.q.wide === true || layoutTag === 'fullwidth') {
            qType = 'wide';
            limit = 1;
        } else if (layoutTag === 'subjective-2up') {
            qType = 'subj2';
            limit = 2;
        } else if (layoutTag === 'subjective-4up') {
            qType = 'subj4';
            limit = 4;
        }

        const isSpecialType = qType === 'subj2' || qType === 'subj4' || qType === 'wide';
        const prevWasSpecial = currentType === 'subj2' || currentType === 'subj4' || currentType === 'wide';
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

    for (let pageIdx = 0; pageIdx < pages.length; pageIdx++) {
        const pageData = pages[pageIdx];
        // 첫 페이지만 전체 헤더, 2페이지부터는 작은 러닝 이름표
        const page = makePage(area, pageIdx + 1);

        pageData.blocks.forEach((block, blockIdx) => {
            if (block.type === 'wide') {
                const wideCol = document.createElement('div');
                wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                wideCol.appendChild(block.items[0].box.cloneNode(true));
                page.body.appendChild(wideCol);
                return;
            }

            const grid = document.createElement('div');
            grid.className = 'grid-container';
            grid.style.flex = block.type === 'normal' ? '1 1 0' : 'none';
            if (blockIdx < pageData.blocks.length - 1) grid.style.marginBottom = `${SE_BLOCK_GAP}px`;

            const left = document.createElement('div');
            left.className = 'grid-col';
            const right = document.createElement('div');
            right.className = 'grid-col';
            grid.appendChild(left);
            grid.appendChild(right);
            page.body.appendChild(grid);

            const split = Math.ceil(block.items.length / 2);
            block.items.slice(0, split).forEach(item => left.appendChild(item.box.cloneNode(true)));
            block.items.slice(split).forEach(item => right.appendChild(item.box.cloneNode(true)));
        });

        deps.decorateBody?.(page, pageIdx === pages.length - 1);

        await deps.typesetMath('composition-exam', [page.page]);
        await raf();

        const boxes = page.page.querySelectorAll('.q-box');
        boxes.forEach(box => fitQuestionBox(box));

        if (page.body.scrollHeight > usablePageHeight + SE_PAGE_TOLERANCE) {
            boxes.forEach(box => autoCompress(box));
            await raf();
            await deps.typesetMath('composition-exam', [page.page]);
        }

        afterPage?.(page, pageIdx === pages.length - 1);
    }
}


    // Shared by Archive/Mixer slot layout and recipient-composed chunk layout.
    // Each independent staging box is measured before any page materialization.
    async function measureProfiles(items, deps) {
        const measure = deps.measure || (node => node.scrollHeight);
        if (deps.measurementMode?.() === 'batch') {
            items.forEach(item => { item.profile = { proxyHeight_raw: measure(item.box) }; });
            items.forEach(item => item.box.classList.add('fit-tight'));
            try {
                await deps.raf();
                items.forEach(item => { item.profile.proxyHeight_tight = measure(item.box); });
            } finally { items.forEach(item => item.box.classList.remove('fit-tight')); }
        } else for (const item of items) {
            item.profile = { proxyHeight_raw: measure(item.box) };
            item.box.classList.add('fit-tight');
            try { await deps.raf(); item.profile.proxyHeight_tight = measure(item.box); }
            finally { item.box.classList.remove('fit-tight'); }
        }
        return items;
    }

    return Object.freeze({ render, renderComposed, measureProfiles, buildSlotPages, fallbackLadder });
});
