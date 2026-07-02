/**
 * print-core.js — 시험지 출력 엔진 공용 렌더링 코어 (엔진 통합 Phase 1)
 *
 * 소비처: archive/engine.html, archive/mixed_engine.html, apmath/wrong_print_engine.html
 *
 * 포함 범위(계획 문서 PRINT_ENGINE_UNIFICATION_NEXT_PLAN.md Phase 1):
 *   SE_OVERHEAD 상수 / staging 측정 / 시험지 페이지네이션 / 해설 컬럼 플로우 /
 *   정답표 그리드 / printHeaderOptions 정규화 / QR 배지 / 모드 탭·QR 잠금 /
 *   QR 출력 팝오버·헤더 편집 패널 동기화 / screen-fit
 *
 * 포함하지 않는 것(엔진별 잔류):
 *   콘텐츠 파이프라인(wrapLatex, normalize*, choices 등 — 믹서 "Rulebook v1.9" 성역 포함),
 *   makePage(헤더 구성이 엔진마다 다름 — 훅으로 주입), 데이터 로딩, OS 등록 API.
 *
 * 엔진별 차이는 훅/옵션으로 주입한다. 출력물 페이지네이션은 추출 전과
 * 동일해야 하며(회귀 금지), 알고리즘 수정은 이 파일에서만 한다.
 */
(function () {
    'use strict';

    // ── 페이지네이션 상수 (세 엔진 공통값 그대로) ──────────────────────────
    const OVERHEAD_COL = 10;      // 컬럼당 여유 높이(px)
    const OVERHEAD_GRID = 20;     // 그리드 블록당 여유 높이(px)
    const PAGE_TOLERANCE = 5;     // 페이지 넘침 허용 오차(px)
    const BLOCK_GAP = 15;         // 블록 사이 간격(px)
    const ANSWER_ROWS_PER_PAGE = 40; // 정답표: 열당 20개(4문제 5세트) × 2열

    function raf() {
        return new Promise(resolve => requestAnimationFrame(resolve));
    }

    // MathJax 미로드/실패 시에도 렌더는 계속 진행한다.
    async function typeset(targets) {
        if (!window.MathJax?.typesetPromise) return;
        try { await MathJax.typesetPromise(targets); } catch (e) { console.warn('[print-core] MathJax typeset failed:', e); }
    }

    // ── printHeaderOptions ────────────────────────────────────────────────
    function clampText(value, maxLength) {
        return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
    }

    // base: 엔진별 getDefaultPrintHeaderOptions() 결과.
    // showDate는 오답엔진에서 승격된 코어 옵션 — 다른 엔진은 렌더에서 읽지 않으면 무해.
    function normalizePrintHeaderOptions(raw, base) {
        const source = raw && typeof raw === 'object' ? raw : {};
        return {
            title: clampText(source.title ?? base.title, 80) || base.title,
            metaRight: clampText(source.metaRight ?? base.metaRight, 60),
            subtitle: clampText(source.subtitle ?? base.subtitle, 120),
            showNameLine: source.showNameLine !== false,
            showScoreLine: source.showScoreLine !== false,
            showDate: source.showDate === true,
            applyToSolution: source.applyToSolution !== false,
            applyToAnswer: source.applyToAnswer !== false
        };
    }

    function shouldApplyPrintHeader(type, opts) {
        return type === 'exam'
            || (type === 'sol' && opts.applyToSolution)
            || (type === 'ans' && opts.applyToAnswer);
    }

    // 헤더 편집 패널(#print-header-editor-*) 입력값을 옵션 상태와 동기화
    function syncPrintHeaderControls(opts) {
        const titleInput = document.getElementById('print-header-title-input');
        const metaInput = document.getElementById('print-header-meta-input');
        const subtitleInput = document.getElementById('print-header-subtitle-input');
        const nameCheck = document.getElementById('print-header-name-check');
        const scoreCheck = document.getElementById('print-header-score-check');
        const solCheck = document.getElementById('print-header-sol-check');
        const ansCheck = document.getElementById('print-header-ans-check');
        if (titleInput && titleInput.value !== opts.title) titleInput.value = opts.title;
        if (metaInput && metaInput.value !== opts.metaRight) metaInput.value = opts.metaRight;
        if (subtitleInput && subtitleInput.value !== opts.subtitle) subtitleInput.value = opts.subtitle;
        if (nameCheck) nameCheck.checked = !!opts.showNameLine;
        if (scoreCheck) scoreCheck.checked = !!opts.showScoreLine;
        if (solCheck) solCheck.checked = !!opts.applyToSolution;
        if (ansCheck) ansCheck.checked = !!opts.applyToAnswer;
    }

    function togglePrintHeaderEditorPanel(event) {
        if (event) event.stopPropagation();
        const wrap = document.getElementById('print-header-editor-wrap');
        if (wrap) wrap.classList.toggle('open');
    }

    // ── 페이지 헤더 DOM 헬퍼 (엔진/믹서 makePage에서 사용) ────────────────
    function appendTextElement(parent, tagName, className, text) {
        const el = document.createElement(tagName);
        if (className) el.className = className;
        el.textContent = text || '';
        parent.appendChild(el);
        return el;
    }

    function appendHeaderFill(metaWrap, label, scoreSuffix = '') {
        const span = document.createElement('span');
        span.appendChild(document.createTextNode(label));
        const line = document.createElement('span');
        line.className = 'header-fill-line' + (scoreSuffix ? ' header-fill-line--score' : '');
        span.appendChild(line);
        if (scoreSuffix) span.appendChild(document.createTextNode(scoreSuffix));
        metaWrap.appendChild(span);
    }

    // ── 문항 박스 압축 ────────────────────────────────────────────────────
    function autoCompress(container) {
        let fontSize = 9.5;
        let lineHeight = 1.58;
        while (container.scrollHeight > container.clientHeight + 1 && fontSize > 6.5) {
            fontSize = Math.max(fontSize - 0.3, 6.5);
            lineHeight = Math.max(lineHeight - 0.08, 1.0);
            container.style.fontSize = fontSize + 'pt';
            container.style.lineHeight = String(lineHeight);
        }
    }

    function fitQuestionBox(box) {
        if (!box) return;
        const textClasses = ['', 'fit-tight', 'fit-tighter', 'fit-micro'];
        const imgClasses = ['', 'img-fit-tight', 'img-fit-tighter', 'img-fit-micro'];
        const imgs = Array.from(box.querySelectorAll('.q-content img, .q-image-wrap img'));

        for (const tCls of textClasses) {
            box.classList.remove('fit-tight', 'fit-tighter', 'fit-micro');
            if (tCls) box.classList.add(tCls);
            if (box.scrollHeight <= box.clientHeight + 1) return;
        }

        for (const iCls of imgClasses) {
            imgs.forEach(img => img.classList.remove('img-fit-tight', 'img-fit-tighter', 'img-fit-micro'));
            if (iCls) imgs.forEach(img => img.classList.add(iCls));
            if (box.scrollHeight <= box.clientHeight + 1) return;
        }
    }

    // ── 이미지 자동 사이즈 ────────────────────────────────────────────────
    const AUTO_IMAGE_SIZE_CLASSES = ['image-small', 'image-half', 'image-medium', 'image-large', 'image-full', 'image-tall'];

    // 아카이브 엔진/믹서의 비율표. 오답엔진은 자체 비율표를 훅으로 주입한다(출력 보존).
    function defaultImageSizeClassFor(img) {
        const width = Number(img && img.naturalWidth) || 0;
        const height = Number(img && img.naturalHeight) || 0;
        if (!width || !height) return 'image-medium';
        const ratio = width / height;
        if (ratio >= 2.2) return 'image-full';
        if (ratio >= 1.4) return 'image-large';
        if (ratio >= 0.7) return 'image-medium';
        if (ratio >= 0.4) return 'image-half';
        return 'image-small';
    }

    function waitForQuestionImage(img) {
        if (!img || img.complete) return Promise.resolve();
        return new Promise(resolve => {
            let done = false;
            const finish = () => {
                if (done) return;
                done = true;
                resolve();
            };
            img.addEventListener('load', finish, { once: true });
            img.addEventListener('error', finish, { once: true });
            setTimeout(finish, 1200);
        });
    }

    // includeInlineContentImages: 오답엔진 전용 — .q-image-wrap 밖의 본문 인라인
    // 이미지도 로드 완료를 기다린 뒤 측정해야 페이지 높이가 어긋나지 않는다.
    function createImageSizer({ imageSizeClassFor = defaultImageSizeClassFor, includeInlineContentImages = false } = {}) {
        return async function applyAutoImageSizeClasses(root) {
            const wraps = Array.from(root.querySelectorAll('.q-image-wrap'));
            const wrapTasks = wraps.map(async wrap => {
                if (AUTO_IMAGE_SIZE_CLASSES.some(cls => wrap.classList.contains(cls))) return;
                const img = wrap.querySelector('img');
                if (!img) {
                    wrap.classList.add('image-medium');
                    return;
                }
                await waitForQuestionImage(img);
                wrap.classList.add(imageSizeClassFor(img));
            });
            const contentTasks = includeInlineContentImages
                ? Array.from(root.querySelectorAll('.q-content img'))
                    .filter(img => !img.closest('.q-image-wrap'))
                    .map(img => waitForQuestionImage(img))
                : [];
            await Promise.all([...wrapTasks, ...contentTasks]);
        };
    }

    const defaultImageSizer = createImageSizer();

    // ── 시험지: staging 측정 → 블록 페이지네이션 → 페이지 조립 ────────────
    /**
     * @param {Object} opts
     * @param {Element} opts.staging  측정용 오프스크린 컨테이너
     * @param {Array<{q: Object, box: Element}>} opts.items  문항(박스는 미부착 상태)
     * @param {number} opts.qpp  일반 문항 기준 문항/쪽
     * @param {(pageNumber: number) => {page: Element, body: Element}} opts.makePage
     *        페이지 생성 훅(헤더 구성은 엔진 책임). pageNumber 0 = 본문 높이 측정용(생성 후 코어가 제거).
     * @param {(root: Element) => Promise} [opts.applyAutoImageSizeClasses]
     * @param {(handle, pageIdx, isLast) => void} [opts.onBeforePageMeasure]  블록 조립 직후(typeset/fit 전) 호출
     * @param {(handle, pageIdx, isLast) => void} [opts.onPageRendered]  페이지 확정 후 호출
     */
    async function renderMeasuredExamPages(opts) {
        const {
            staging, items, qpp, makePage,
            applyAutoImageSizeClasses = defaultImageSizer,
            onBeforePageMeasure, onPageRendered
        } = opts;
        if (!items.length) return;

        staging.style.width = '83mm';
        staging.innerHTML = '';
        items.forEach(item => staging.appendChild(item.box));

        await applyAutoImageSizeClasses(staging);
        await typeset([staging]);
        await raf();

        for (const item of items) {
            const profile = {};
            profile.proxyHeight_raw = item.box.scrollHeight;
            item.box.classList.add('fit-tight');
            await raf();
            profile.proxyHeight_tight = item.box.scrollHeight;
            item.box.classList.remove('fit-tight');
            item.profile = profile;
        }

        const temp = makePage(0);
        const usablePageHeight = temp.body.clientHeight;
        temp.page.remove();

        const pages = [];
        let currentPage = { blocks: [], usedHeight: 0 };
        let activeChunk = [];
        let currentType = null;

        const flushBlock = () => {
            if (!activeChunk.length) return;
            const type = currentType;
            const chunk = [...activeChunk];
            const hType = (type === 'normal') ? 'proxyHeight_tight' : 'proxyHeight_raw';
            let blockH;

            if (type === 'wide') {
                blockH = chunk[0].profile.proxyHeight_raw + OVERHEAD_COL + OVERHEAD_GRID;
            } else {
                const split = Math.ceil(chunk.length / 2);
                const leftH = chunk.slice(0, split).reduce((sum, item) => sum + item.profile[hType], 0) + OVERHEAD_COL;
                const rightH = chunk.slice(split).reduce((sum, item) => sum + item.profile[hType], 0) + OVERHEAD_COL;
                blockH = Math.max(leftH, rightH) + OVERHEAD_GRID;
            }

            const isNormalForceBreak = (type === 'normal' && currentPage.blocks.length > 0);
            const gap = currentPage.blocks.length > 0 ? BLOCK_GAP : 0;
            if ((isNormalForceBreak || (currentPage.usedHeight + gap + blockH > usablePageHeight)) && currentPage.blocks.length > 0) {
                pages.push(currentPage);
                currentPage = { blocks: [], usedHeight: 0 };
            }
            currentPage.usedHeight += (currentPage.blocks.length > 0 ? BLOCK_GAP : 0) + blockH;
            currentPage.blocks.push({ type, items: chunk, blockH });
            activeChunk = [];
        };

        items.forEach(item => {
            const layoutTag = item.q.layoutTag || '';
            let qType = 'normal';
            let limit = qpp;
            if (item.q.wide === true || layoutTag === 'fullwidth') { qType = 'wide'; limit = 1; }
            else if (layoutTag === 'subjective-2up') { qType = 'subj2'; limit = 2; }
            else if (layoutTag === 'subjective-4up') { qType = 'subj4'; limit = 4; }

            const isSpecialType = (qType === 'subj2' || qType === 'subj4' || qType === 'wide');
            const prevWasSpecial = (currentType === 'subj2' || currentType === 'subj4' || currentType === 'wide');
            if ((currentType !== null && currentType !== qType) || (activeChunk.length >= limit) || ((isSpecialType || prevWasSpecial) && currentPage.blocks.length > 0)) {
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
            const isLast = pageIdx === pages.length - 1;
            const handle = makePage(pageIdx + 1);

            pageData.blocks.forEach((block, blockIdx) => {
                if (block.type === 'wide') {
                    const wideCol = document.createElement('div');
                    wideCol.style.cssText = 'flex:1; display:flex; flex-direction:column; padding:0 8px; min-height:0; overflow:hidden;';
                    wideCol.appendChild(block.items[0].box.cloneNode(true));
                    handle.body.appendChild(wideCol);
                    return;
                }
                const grid = document.createElement('div');
                grid.className = 'grid-container';
                grid.style.flex = (block.type === 'normal') ? '1 1 0' : 'none';
                if (blockIdx < pageData.blocks.length - 1) grid.style.marginBottom = BLOCK_GAP + 'px';

                const left = document.createElement('div');
                left.className = 'grid-col';
                const right = document.createElement('div');
                right.className = 'grid-col';
                grid.appendChild(left);
                grid.appendChild(right);
                handle.body.appendChild(grid);

                const split = Math.ceil(block.items.length / 2);
                block.items.slice(0, split).forEach(item => left.appendChild(item.box.cloneNode(true)));
                block.items.slice(split).forEach(item => right.appendChild(item.box.cloneNode(true)));
            });

            if (onBeforePageMeasure) onBeforePageMeasure(handle, pageIdx, isLast);

            await typeset([handle.page]);
            await raf();

            const boxes = handle.page.querySelectorAll('.q-box');
            boxes.forEach(box => fitQuestionBox(box));

            if (handle.body.scrollHeight > usablePageHeight + PAGE_TOLERANCE) {
                boxes.forEach(box => autoCompress(box));
                await raf();
                await typeset([handle.page]);
            }

            if (onPageRendered) onPageRendered(handle, pageIdx, isLast);
        }
    }

    // ── 해설지: 2컬럼 플로우 + 넘침 시 해설 분할 ──────────────────────────
    function makeSolutionHtmlChunks(html) {
        const host = document.createElement('div');
        host.innerHTML = html || '';
        const chunks = [];
        const pushTextChunks = (text) => {
            const parts = String(text || '').split(/(\s+)/);
            let buf = '';
            for (const part of parts) {
                if ((buf + part).length > 260 && buf.trim()) {
                    const span = document.createElement('span');
                    span.textContent = buf;
                    chunks.push(span.outerHTML);
                    buf = part;
                } else {
                    buf += part;
                }
            }
            if (buf) {
                const span = document.createElement('span');
                span.textContent = buf;
                chunks.push(span.outerHTML);
            }
        };
        host.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                pushTextChunks(node.textContent || '');
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'BR') chunks.push('<br>');
                else chunks.push(node.outerHTML);
            }
        });
        return chunks.length ? chunks : [''];
    }

    // 첫 조각 쉘은 문항/정답을 유지하고 해설만 비우며, 이어지는 조각은 해설만 담는다.
    function makeLongSolutionShell(sourceBox, continuation) {
        const shell = sourceBox.cloneNode(true);
        shell.classList.add('sol-box-long');
        if (!continuation) {
            const exp = shell.querySelector('.sol-exp');
            if (exp) exp.innerHTML = '';
            return shell;
        }
        shell.innerHTML = `<div class="sol-meta"><div class="sol-exp"></div></div>`;
        return shell;
    }

    /**
     * @param {Object} opts
     * @param {() => Element[]} opts.makeGridPage  새 페이지+그리드 생성 후 [좌컬럼, 우컬럼] 반환(엔진 책임)
     * @param {(col: Element) => Promise} [opts.prepareColumn]  박스/쉘 부착 직후 측정 전 훅(오답엔진: 이미지 사이즈)
     * 생성 시점에 첫 페이지를 즉시 만든다(기존 세 엔진 모두 동일 동작).
     */
    function createSolutionFlow({ makeGridPage, prepareColumn }) {
        let cols = makeGridPage();
        let colIdx = 0;

        const advanceColumn = () => {
            if (colIdx === 0) colIdx = 1;
            else {
                cols = makeGridPage();
                colIdx = 0;
            }
            return cols[colIdx];
        };

        // 한 컬럼에 이 해설 박스 하나뿐인데도 안 들어가면 조각내 다음 컬럼/페이지로 잇는다.
        async function renderSplitSolutionBox(sourceBox) {
            const originalExp = sourceBox.querySelector('.sol-exp');
            const chunks = makeSolutionHtmlChunks(sourceBox.dataset.solutionHtml || (originalExp ? originalExp.innerHTML : ''));
            let shell = makeLongSolutionShell(sourceBox, false);
            let exp = shell.querySelector('.sol-exp');
            let targetCol = cols[colIdx];
            targetCol.appendChild(shell);
            if (prepareColumn) await prepareColumn(targetCol);

            for (const chunkHtml of chunks) {
                const chunk = document.createElement('span');
                chunk.className = 'sol-chunk';
                chunk.innerHTML = chunkHtml;
                exp.appendChild(chunk);
                await typeset([targetCol]);
                await raf();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) continue;

                if (exp.children.length > 1) {
                    exp.removeChild(chunk);
                    targetCol = advanceColumn();
                    shell = makeLongSolutionShell(sourceBox, true);
                    exp = shell.querySelector('.sol-exp');
                    targetCol.appendChild(shell);
                    exp.appendChild(chunk);
                    await typeset([targetCol]);
                    await raf();
                }
                if (targetCol.scrollHeight > targetCol.clientHeight + 2) {
                    autoCompress(shell);
                    await raf();
                }
            }
        }

        async function placeBox(box) {
            while (true) {
                const targetCol = cols[colIdx];
                targetCol.appendChild(box);
                if (prepareColumn) await prepareColumn(targetCol);
                await typeset([targetCol]);
                await raf();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

                autoCompress(box);
                await raf();
                await typeset([targetCol]);
                await raf();
                if (targetCol.scrollHeight <= targetCol.clientHeight + 2) return;

                const isOnlyBoxInColumn = targetCol.querySelectorAll('.sol-box').length === 1;
                targetCol.removeChild(box);
                if (isOnlyBoxInColumn) {
                    await renderSplitSolutionBox(box);
                    return;
                }
                advanceColumn();
            }
        }

        return { placeBox };
    }

    // ── 정답표: 40행/쪽, 열 분할점 4의 배수(한 세트가 두 열에 안 걸치게) ──
    /**
     * @param {Object} opts
     * @param {Array<{no: number, answerHtml: string}>} opts.data
     * @param {(pageNumber: number) => {page: Element, body: Element}} opts.makePage
     */
    function renderAnswerPages({ data, makePage }) {
        let pageNo = 1;
        for (let start = 0; start < data.length; start += ANSWER_ROWS_PER_PAGE) {
            const chunk = data.slice(start, start + ANSWER_ROWS_PER_PAGE);
            const handle = makePage(pageNo++);
            const grid = document.createElement('div');
            grid.className = 'ans-grid';
            const splitIndex = Math.ceil(Math.ceil(chunk.length / 2) / 4) * 4;
            for (let i = 0; i < splitIndex; i++) {
                [i, splitIndex + i].forEach(idx => {
                    const cell = document.createElement('div');
                    cell.className = 'ans-cell';
                    if (!chunk[idx]) {
                        cell.classList.add('ans-cell-empty');
                        cell.setAttribute('aria-hidden', 'true');
                        grid.appendChild(cell);
                        return;
                    }
                    if (chunk[idx].no % 4 === 0) cell.classList.add('group-end'); // 4문제마다 채점 구분선
                    cell.innerHTML = `<div class="ans-n">${chunk[idx].no}.</div><div class="ans-v">${chunk[idx].answerHtml}</div>`;
                    grid.appendChild(cell);
                });
            }
            handle.body.appendChild(grid);
        }
    }

    // ── QR 배지 ───────────────────────────────────────────────────────────
    function getLastPage(area) {
        const pages = area.querySelectorAll('.page');
        return pages.length ? pages[pages.length - 1] : null;
    }

    /**
     * targetPage에 QR 배지(div.className + canvas)를 부착한다. 같은 클래스의
     * 기존 배지는 교체. html에는 <canvas></canvas>가 포함되어야 한다.
     */
    function renderQrBadge(targetPage, { className = 'page-qr', html, url, size = 220 }) {
        if (!targetPage) return;
        if (typeof QRious !== 'function') return;

        const old = targetPage.querySelector('.' + className);
        if (old) old.remove();

        const wrap = document.createElement('div');
        wrap.className = className;
        wrap.innerHTML = html;
        targetPage.appendChild(wrap);

        new QRious({
            element: wrap.querySelector('canvas'),
            value: url,
            size,
            level: 'M',
            background: 'white',
            foreground: 'black',
            padding: 0
        });
    }

    // ── 모드 탭 / QR 해설 잠금 ────────────────────────────────────────────
    function isQrSolutionMode() {
        try {
            const params = new URLSearchParams(window.location.search);
            return params.get('qr') === '1';
        } catch (e) {
            return false;
        }
    }

    // id(btn-<mode>) 또는 data-mode 어느 쪽으로도 매칭한다.
    function setActiveModeTab(mode) {
        document.querySelectorAll('.mode-tab').forEach(btn => {
            btn.classList.toggle('active', btn.id === 'btn-' + mode || btn.dataset.mode === mode);
        });
    }

    /**
     * qr=1(해설 QR로 진입) 잠금 UI.
     * hideTabsBar: 탭바 전체 숨김(오답엔진). solActive: 해설 탭 활성 표시 여부.
     */
    function applyQrSolutionLockUI({ title, hideTabsBar = false, solActive = true }) {
        if (!isQrSolutionMode()) return;
        if (hideTabsBar) {
            const tabs = document.querySelector('.mode-tabs');
            if (tabs) tabs.style.display = 'none';
        }
        const btnExam = document.getElementById('btn-exam');
        const btnAns = document.getElementById('btn-ans');
        const btnSol = document.getElementById('btn-sol');
        if (btnExam) btnExam.style.display = 'none';
        if (btnAns) btnAns.style.display = 'none';
        if (btnSol) {
            btnSol.classList.toggle('active', solActive);
            btnSol.style.pointerEvents = 'none';
        }
        const titleEl = document.getElementById('ctrl-title');
        if (titleEl) titleEl.textContent = title;
    }

    // ── QR 출력 팝오버 (엔진/믹서 공용 툴바) ──────────────────────────────
    function getQrOutputState() {
        const params = new URLSearchParams(window.location.search);
        const submitQr = params.get('submitQr');
        return {
            submit: submitQr === '1' || (submitQr !== '0' && params.get('osqr') === '1'),
            sol: params.get('solQr') === '1'
        };
    }

    function syncQrOutputControls() {
        const state = getQrOutputState();
        const submitBox = document.getElementById('chk-submit-qr');
        const solBox = document.getElementById('chk-sol-qr');
        const btn = document.getElementById('btn-qr-output');
        if (submitBox) submitBox.checked = state.submit;
        if (solBox) solBox.checked = state.sol;
        if (btn) {
            const count = Number(state.submit) + Number(state.sol);
            btn.textContent = count ? `QR 출력: ${count}개` : 'QR 출력: 없음';
        }
    }

    function toggleQrOutputPopover(event) {
        if (event) event.stopPropagation();
        const wrap = document.getElementById('qr-output-wrap');
        if (wrap) wrap.classList.toggle('open');
    }

    // URL 파라미터만 갱신한다. 컨트롤 동기화/재렌더는 호출한 엔진 책임.
    function setQrOutputParam(type, checked) {
        const url = new URL(window.location.href);
        if (type === 'submit') {
            url.searchParams.set('submitQr', checked ? '1' : '0');
            url.searchParams.delete('osqr');
        } else {
            url.searchParams.set('solQr', checked ? '1' : '0');
        }
        history.replaceState(null, '', url.toString());
    }

    // 팝오버 바깥 클릭 시 닫기
    function installPopoverAutoClose(wrapIds) {
        document.addEventListener('click', (event) => {
            wrapIds.forEach(id => {
                const wrap = document.getElementById(id);
                if (wrap && !wrap.contains(event.target)) wrap.classList.remove('open');
            });
        });
    }

    // ── 미리보기 채널 (Phase 2: preview=1 + postMessage + 인라인 헤더 편집) ──
    function isPreviewMode() {
        try {
            return new URLSearchParams(window.location.search).get('preview') === '1';
        } catch (e) {
            return false;
        }
    }

    // 공용 타입 + 레거시(AP_CLINIC_*) 별칭. 이미 배포된 부모/엔진과의 캐시 불일치에도
    // 어느 조합이든 동작해야 하므로 수신은 둘 다 받고, 발신은 둘 다 보낸다.
    // 중복 수신은 디바운스(재렌더 250ms / 부모 push 150ms)가 흡수한다.
    const PREVIEW_MESSAGE_TYPES = ['AP_PRINT_PREVIEW', 'AP_CLINIC_PREVIEW'];
    const HEADER_EDIT_MESSAGE_TYPES = ['AP_PRINT_HEADER_EDIT', 'AP_CLINIC_HEADER_EDIT'];

    /**
     * 임베드 미리보기 컨트롤러.
     * @param {Object} opts
     * @param {() => void} opts.render  재렌더 함수(디바운스 대상)
     * @param {(msg: Object) => void} opts.onPreviewMessage  수신 payload 적용(상태 갱신은 엔진 책임)
     * @param {string} [opts.editableClass='clinic-editable']  인라인 편집 요소 클래스(CSS는 엔진 책임)
     */
    function createPreviewController({ render, onPreviewMessage, editableClass = 'clinic-editable' }) {
        let renderTimer = null;
        let renderPending = false;

        function scheduleRender() {
            clearTimeout(renderTimer);
            renderTimer = setTimeout(() => {
                render();
            }, 250);
        }

        // 헤더를 편집(포커스가 editableClass)하는 동안에는 재렌더를 미룬다.
        // 빠르게 제목→보조문구로 옮겨 칠 때 contenteditable이 재생성돼 포커스/입력이 날아가는 것 방지.
        function requestRender() {
            const active = document.activeElement;
            if (active && active.classList && active.classList.contains(editableClass)) {
                renderPending = true;
                return;
            }
            renderPending = false;
            scheduleRender();
        }

        function install() {
            document.addEventListener('focusout', () => {
                if (!renderPending) return;
                // 다음 틱에 포커스가 편집영역을 완전히 벗어났는지 확인 후 flush
                setTimeout(() => {
                    const a = document.activeElement;
                    if (!(a && a.classList && a.classList.contains(editableClass))) {
                        renderPending = false;
                        scheduleRender();
                    }
                }, 0);
            });

            window.addEventListener('message', event => {
                if (event.origin !== window.location.origin) return;
                const msg = event.data || {};
                if (!PREVIEW_MESSAGE_TYPES.includes(msg.type)) return;
                onPreviewMessage(msg);
                requestRender();
            });
        }

        function postHeaderEdit(field, value) {
            HEADER_EDIT_MESSAGE_TYPES.forEach(type => {
                try {
                    window.parent?.postMessage({ type, field, value }, window.location.origin);
                } catch (e) { /* 부모 없거나 출처 불일치 시 무시 */ }
            });
        }

        // 미리보기에서 헤더 텍스트를 직접 클릭해 수정한다. blur(확정) 시 부모로 값 전송.
        function bindHeaderEditable(el, field, placeholder) {
            if (!el) return;
            el.classList.add(editableClass);
            el.setAttribute('contenteditable', 'true');
            el.setAttribute('data-clinic-field', field);
            el.setAttribute('data-placeholder', placeholder);
            el.setAttribute('title', '클릭해서 수정');
            el.spellcheck = false;
            const normalize = () => (el.textContent || '').replace(/\s+/g, ' ').trim();
            // 편집 시작값 기록 → 변경 없는 blur는 저장하지 않는다(자동 보조문구를 클릭만 한 경우 수동값으로 굳는 것 방지).
            el.addEventListener('focus', () => { el._editStartValue = normalize(); });
            el.addEventListener('keydown', e => {
                if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
                if (e.key === 'Escape') { e.preventDefault(); el.textContent = el._editStartValue ?? el.textContent; el.blur(); }
            });
            el.addEventListener('blur', () => {
                const value = normalize();
                if (value === (el._editStartValue ?? '')) return;
                postHeaderEdit(field, value);
            });
        }

        // 첫 페이지 헤더만 편집 대상으로 삼는다(blur→부모→재렌더로 전 페이지 동기화).
        // 제목/보조문구만 직접 편집(이름·점수·날짜는 자동). 보조문구가 비어 있으면 편집용 빈 줄 생성.
        function enableHeaderInlineEdit() {
            if (!document.body.classList.contains('preview-mode')) return;
            const header = document.querySelector('#print-area .page-header');
            if (!header) return;

            bindHeaderEditable(header.querySelector('.page-header-title'), 'title', '제목 입력');

            const col = header.querySelector('.page-header-titlecol') || header.querySelector('div');
            let subEl = header.querySelector('.page-header-subtitle');
            if (!subEl && col) {
                subEl = document.createElement('div');
                subEl.className = 'page-header-subtitle';
                col.appendChild(subEl);
            }
            bindHeaderEditable(subEl, 'subtitle', '보조 문구 입력');
        }

        return { install, scheduleRender, requestRender, enableHeaderInlineEdit, postHeaderEdit };
    }

    // ── screen-fit (A4 페이지를 화면 폭에 맞춰 축소) ──────────────────────
    function shouldUseScreenFit(params) {
        return params.get('fit') === 'screen' || window.matchMedia('(max-width: 900px)').matches;
    }

    function updateScreenFitScale(maxScale = 1) {
        if (!document.body.classList.contains('screen-fit-mode')) return;
        const area = document.getElementById('print-area');
        const page = area?.querySelector('.page');
        if (!area || !page) return;
        const pageWidth = page.offsetWidth || 794;
        const availableWidth = Math.max(280, window.innerWidth - 16);
        const scale = Math.max(0.32, Math.min(maxScale, availableWidth / pageWidth));
        document.documentElement.style.setProperty('--screen-page-scale', String(scale));
    }

    function installScreenFitAutoRescale(getMaxScale) {
        window.addEventListener('resize', () => requestAnimationFrame(() => {
            updateScreenFitScale(getMaxScale ? getMaxScale() : 1);
        }));
    }

    window.PrintCore = {
        OVERHEAD_COL,
        OVERHEAD_GRID,
        PAGE_TOLERANCE,
        BLOCK_GAP,
        ANSWER_ROWS_PER_PAGE,
        raf,
        typeset,
        clampText,
        normalizePrintHeaderOptions,
        shouldApplyPrintHeader,
        syncPrintHeaderControls,
        togglePrintHeaderEditorPanel,
        appendTextElement,
        appendHeaderFill,
        autoCompress,
        fitQuestionBox,
        AUTO_IMAGE_SIZE_CLASSES,
        defaultImageSizeClassFor,
        waitForQuestionImage,
        createImageSizer,
        renderMeasuredExamPages,
        makeSolutionHtmlChunks,
        makeLongSolutionShell,
        createSolutionFlow,
        renderAnswerPages,
        getLastPage,
        renderQrBadge,
        isQrSolutionMode,
        setActiveModeTab,
        applyQrSolutionLockUI,
        getQrOutputState,
        syncQrOutputControls,
        toggleQrOutputPopover,
        setQrOutputParam,
        installPopoverAutoClose,
        isPreviewMode,
        createPreviewController,
        shouldUseScreenFit,
        updateScreenFitScale,
        installScreenFitAutoRescale
    };
})();
