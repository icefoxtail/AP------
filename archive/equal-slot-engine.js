(function (root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APEqualSlotEngine = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
    'use strict';
    const VERSION = '20261118.1';
    // 2026-11-18: 글자는 이 크기(8.1pt = 엔진의 fit-micro) 아래로 몰래 줄이지 않는다. 모자라면 그 문항만 한 단 전체(span 2)로 올린다.
    const MIN_EFFECTIVE_FONT_PX = 10.8;
    const MAX_PROMOTION_PASSES = 6;
    const PAGE = '.page.ap-equal-slot-page';
    const FIXED = '.page-qr, .page-submit-qr, .page-footer, .page-num, [data-equal-slot-footer]';
    const fits = new WeakMap();
    const PROFILES = [
        { name: 'normal', cost: 0 }, { name: 'compact', cost: 0.02 },
        { name: 'choices', cost: 0.035 }, { name: 'images', cost: 0.06 },
        { name: 'compact choices', cost: 0.055 }, { name: 'compact images', cost: 0.08 },
        { name: 'compact choices images', cost: 0.115 },
        // 한 단 전체(span 2)로도 모자랄 때만 쓰는 그림 단계 축소. 하한은 단 폭의 35%(0.55 x 0.636).
        { name: 'tight images', cost: 0.13, tall: true }, { name: 'compact tight images', cost: 0.15, tall: true },
        { name: 'floor images', cost: 0.17, tall: true }, { name: 'compact floor images', cost: 0.19, tall: true }
    ];
    const list = (node, selector) => Array.from(node.querySelectorAll(selector));
    function failure(code, evidence) { return Object.assign(new Error(code), { code, evidence }); }
    // allowSpan: 렌더 입구가 배치 힌트를 이미 지웠으므로(layoutForce만 subjective-2up으로 남음) 한 단 전체 문항이 있어도 균등 칸으로 간다.
    function enabled(qpp, url = root.location?.href || '', questions = [], allowSpan = false) {
        const params = new URL(String(url), 'https://ap.invalid/').searchParams;
        if (Number(qpp) !== 4 || params.get('slotEngine') === 'legacy') return false;
        const blocking = allowSpan ? ['fullwidth', 'subjective-4up'] : ['fullwidth', 'subjective-2up', 'subjective-4up'];
        return params.get('equalSlots') === '1' || !questions.some(q => (!allowSpan && q.wide === true) || blocking.includes(q.layoutTag));
    }
    // 한 쪽은 4칸(왼쪽 단 위·아래, 오른쪽 단 위·아래)이고 읽는 순서는 항상 번호 오름차순이다.
    // 한 단 전체(span 2)는 통째로 빈 단의 맨 위에만 놓는다: 현재 단에 한 문항이 있으면 그 아래 칸을 비우고 다음 단으로 간다.
    // spanOf를 안 주면 예전과 같이 쪽마다 4문항을 차례로 놓는다.
    function plan(items, spanOf = () => 1) {
        const pages = [];
        let page = null, position = 4;
        const fresh = () => Array.from({ length: 4 }, (_, index) => ({ row: index % 2, column: Math.floor(index / 2), item: null, span: 1, covered: false }));
        for (const item of items) {
            const span = spanOf(item) === 2 ? 2 : 1;
            if (span === 2 && position % 2 === 1) position += 1;
            if (!page || position >= 4) { page = fresh(); pages.push(page); position = 0; }
            page[position].item = item; page[position].span = span;
            if (span === 2) page[position + 1].covered = true;
            position += span;
        }
        return pages;
    }
    function validSize(size) { return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width > 0 && size.height > 0; }
    // minScale: 글자가 MIN_EFFECTIVE_FONT_PX 밑으로 내려가는 배율은 후보에서 뺀다. 남는 후보가 없으면 가장 큰 배율을 belowMin으로 돌려준다
    // (부르는 쪽이 한 단 전체로 올리거나, 올릴 수 없으면 LAYOUT_OVERFLOW로 남긴다).
    function selectFit(candidates, slot, minScale = 0) {
        if (!validSize(slot) || !candidates.length || candidates.some(c => !validSize(c))) throw failure('EQUAL_SLOT_INVALID_GEOMETRY');
        const scored = candidates.map(candidate => {
            const scale = Math.min(1, slot.width / candidate.width, slot.height / candidate.height);
            return { ...candidate, scale, score: scale - (candidate.cost || 0), status: scale < 0.75 ? 'review' : scale < 0.85 ? 'warning' : 'normal' };
        });
        const eligible = scored.filter(c => c.scale >= minScale - 1e-9);
        if (eligible.length) return eligible.sort((a, b) => b.score - a.score || a.cost - b.cost)[0];
        return { ...scored.sort((a, b) => b.scale - a.scale || a.cost - b.cost)[0], belowMin: true };
    }
    function normalizeRect(rect, origin, scale) {
        return { left: (rect.left - origin.left) / scale, top: (rect.top - origin.top) / scale,
            right: (rect.right - origin.left) / scale, bottom: (rect.bottom - origin.top) / scale,
            width: rect.width / scale, height: rect.height / scale };
    }
    function geometry(page) {
        const rect = page.getBoundingClientRect();
        const width = parseFloat(root.getComputedStyle(page).width);
        const scale = rect.width / width;
        if (!(scale > 0) || !Number.isFinite(scale)) throw failure('EQUAL_SLOT_INVALID_GEOMETRY');
        return { rect, scale, local: node => normalizeRect(node.getBoundingClientRect(), rect, scale) };
    }
    function ignored(node) {
        return !!node.closest('mjx-assistive-mml, [aria-hidden="true"].MJX_Assistive_MathML, svg defs, svg symbol') ||
            !!node.parentElement?.closest('svg');
    }
    // Include visible descendants and text runs: scrollHeight alone misses left/top
    // escapes, inline runs, transforms and overflowing tables.
    function footprint(box, geo) {
        const base = geo.local(box);
        const bounds = { ...base };
        const include = rect => {
            if (!rect.width || !rect.height) return;
            bounds.left = Math.min(bounds.left, rect.left); bounds.top = Math.min(bounds.top, rect.top);
            bounds.right = Math.max(bounds.right, rect.right); bounds.bottom = Math.max(bounds.bottom, rect.bottom);
        };
        for (const node of list(box, '*')) {
            if (ignored(node)) continue;
            const style = root.getComputedStyle(node);
            if (style.display === 'none') continue;
            // MathJax stretchy extenders (overline/underline/arrow rules) clip their
            // oversized mjx-spacer with overflow:hidden; it is never painted outside.
            if (node.parentElement?.tagName === 'MJX-EXT') continue;
            include(geo.local(node));
        }
        const walker = box.ownerDocument.createTreeWalker(box, 4);
        while (walker.nextNode()) {
            const text = walker.currentNode;
            if (!text.textContent.trim() || ignored(text.parentElement) || text.parentElement.closest('svg, mjx-container, mjx-assistive-mml')) continue;
            const range = box.ownerDocument.createRange(); range.selectNodeContents(text);
            for (const rect of range.getClientRects()) include(normalizeRect(rect, geo.rect, geo.scale));
        }
        bounds.width = bounds.right - bounds.left; bounds.height = bounds.bottom - bounds.top;
        return bounds;
    }
    function visibleSemanticContent(slot) {
        for (const node of list(slot, '*')) {
            if (node.matches('defs, symbol, clipPath, mask, marker, script, style')) continue;
            const style = root.getComputedStyle(node);
            if (style.display === 'none' || style.visibility === 'hidden') continue;
            if (node.textContent?.trim() || node.getClientRects().length) return true;
        }
        return Array.from(slot.childNodes || []).some(node => node.nodeType === 3 && node.textContent.trim());
    }
    function auditSvgViewBoxes(box, add, pageIndex, slotIndex) {
        for (const svg of list(box, 'svg')) {
            const style = root.getComputedStyle(svg);
            if (style.display === 'none' || style.visibility === 'hidden' || !svg.getClientRects().length) continue;
            const raw = String(svg.getAttribute('viewBox') || '').trim().split(/[ ,]+/).map(Number);
            if (raw.length !== 4 || !raw.every(Number.isFinite) || raw[2] <= 0 || raw[3] <= 0) continue;
            const [vx, vy, vw, vh] = raw; let inverse;
            try { inverse = svg.getScreenCTM?.()?.inverse?.(); } catch (_) { inverse = null; }
            if (!inverse) continue;
            let union = null;
            for (const drawable of list(svg, 'path,circle,ellipse,line,polyline,polygon,rect,text,use,image')) {
                if (drawable.closest('defs, symbol, clipPath, mask, marker')) continue;
                const ds = root.getComputedStyle(drawable); if (ds.display === 'none' || ds.visibility === 'hidden' || !drawable.getClientRects().length) continue;
                let bbox; try { bbox = drawable.getBBox?.(); } catch (_) { bbox = null; }
                if (!bbox || ![bbox.x,bbox.y,bbox.width,bbox.height].every(Number.isFinite) || (!bbox.width && !bbox.height)) continue;
                let matrix; try { matrix = inverse.multiply(drawable.getScreenCTM?.()); } catch (_) { matrix = null; }
                if (!matrix) continue;
                for (const [x,y] of [[bbox.x,bbox.y],[bbox.x+bbox.width,bbox.y],[bbox.x,bbox.y+bbox.height],[bbox.x+bbox.width,bbox.y+bbox.height]]) {
                    const point = svg.createSVGPoint?.(); if (!point) continue; point.x=x; point.y=y; const p=point.matrixTransform(matrix); if (!Number.isFinite(p.x)||!Number.isFinite(p.y)) continue;
                    union = union ? {left:Math.min(union.left,p.x),top:Math.min(union.top,p.y),right:Math.max(union.right,p.x),bottom:Math.max(union.bottom,p.y)} : {left:p.x,top:p.y,right:p.x,bottom:p.y};
                }
            }
            if (union && (union.left < vx - 0.75 || union.top < vy - 0.75 || union.right > vx + vw + 0.75 || union.bottom > vy + vh + 0.75)) add('SVG_VIEWBOX_CLIP', { page: pageIndex, slot: slotIndex, viewBox: raw, drawableBounds: union });
        }
    }
    function applyProfile(box, profile) {
        box.dataset.equalSlotProfile = profile;
        box.style.zoom = '1';
        box.style.width = '100%';
        box.style.transform = 'none';
        box.style.transformOrigin = 'top left';
    }
    async function ready(area) {
        await area.ownerDocument.fonts?.ready;
        const images = list(area, 'img');
        if (root.APQuestionImageReadiness) {
            // 안 받아진 그림 한 장은 render-diagnostics의 빈 상자로 바꾸고 계속한다(진단 파일이 없는 화면은 예전처럼 던진다).
            await root.APQuestionImageReadiness.waitForImages(images, { timeoutMs: 5000, throwOnFailure: true, onFailure: root.APRenderDiagnostics?.replaceImage });
        } else await Promise.all(images.map(image => new Promise((resolve, reject) => {
            let timer;
            const finish = () => {
                clearTimeout(timer); image.removeEventListener('load', finish); image.removeEventListener('error', finish);
                if (image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) resolve();
                else reject(failure('EQUAL_SLOT_IMAGE_NOT_READY', { src: image.src }));
            };
            if (image.complete) return finish();
            image.addEventListener('load', finish); image.addEventListener('error', finish);
            timer = setTimeout(finish, 5000);
        })));
        if (area.querySelector('mjx-merror')) throw failure('EQUAL_SLOT_MATH_ERROR');
    }
    function reserveDecorations(page) {
        const grid = page.querySelector('.ap-equal-slot-grid');
        grid.style.marginBottom = '0px';
        const geo = geometry(page), gridRect = geo.local(grid);
        let reserve = 0;
        for (const fixed of list(page, FIXED)) {
            const rect = geo.local(fixed);
            if (rect.width && rect.height && rect.bottom > gridRect.top) reserve = Math.max(reserve, gridRect.bottom - rect.top + 6);
        }
        grid.style.marginBottom = `${Math.max(0, reserve)}px`;
        page.dataset.equalSlotFooterReserve = String(Math.max(0, reserve));
    }
    // area -> { items, deps, spans: Map(item -> 2), itemByBox } 렌더가 남긴 배치 상태. finalize가 측정 뒤 문항 하나를 한 단 전체로 올릴 때 다시 쓴다.
    const states = new WeakMap();
    const spanOfItem = (state, item) => state.spans.get(item) || 1;

    // canPromote: 칸에 안 들어가는 한 칸 문항(글자가 MIN_EFFECTIVE_FONT_PX 밑)을 돌려줘 한 단 전체로 올리게 한다.
    // 올릴 수 없는 문항(이미 한 단 전체이거나 마지막 시도)은 글자를 10.8px로 유지하고 칸을 넘치게 둔 채 LAYOUT_OVERFLOW 표시를 단다.
    function fitPages(pages, state, canPromote = false) {
        const records = [];
        pages.forEach(page => {
            reserveDecorations(page);
            const geo = geometry(page);
            list(page, '.ap-equal-slot > .ap-slot-content').forEach(box => {
                const slotNode = box.parentElement;
                const slot = geo.local(slotNode);
                const style = root.getComputedStyle(slotNode);
                const width = slot.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                const height = slot.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
                const span = slotNode.dataset.span === '2' ? 2 : 1;
                const key = JSON.stringify([Math.round(width * 100) / 100, Math.round(height * 100) / 100, span, box.innerHTML]);
                if (fits.get(box) === key) return;
                applyProfile(box, 'normal');
                const baseFont = parseFloat(root.getComputedStyle(box).fontSize);
                const minScale = state?.autoPromote && baseFont > 0 ? Math.min(1, MIN_EFFECTIVE_FONT_PX / baseFont) : 0;
                records.push({ box, geo, key, span, baseFont, minScale, slot: {width, height}, candidates: [] });
            });
        });
        // Mutate the entire batch, then measure it. No per-question frame waits.
        for (const profile of PROFILES) {
            const batch = records.filter(r => !r.done && (!profile.tall || r.span === 2) && (!profile.name.includes('choices') || r.box.dataset.equalSlotChoiceLocked !== 'true'));
            batch.forEach(r => applyProfile(r.box, profile.name));
            batch.forEach(r => {
                const bounds = footprint(r.box, r.geo), base = r.geo.local(r.box);
                r.candidates.push({ profile: profile.name, cost: profile.cost, width: bounds.width, height: bounds.height,
                    offsetX: base.left - bounds.left, offsetY: base.top - bounds.top });
                if (profile.name === 'normal' && bounds.width <= r.slot.width && bounds.height <= r.slot.height) r.done = true;
            });
        }
        const promote = [];
        records.forEach(r => {
            let fit = selectFit(r.candidates, r.slot, r.minScale);
            const slotNode = r.box.parentElement;
            const item = state?.itemByBox.get(r.box);
            // 한 단 전체는 칸 높이만 두 배로 하고 폭은 그대로라서, 폭이 모자란 문항(칸보다 넓은 표·그림)은 올려도 도움이 안 된다. 높이가 원인일 때만 올린다.
            const widthScale = Math.min(1, r.slot.width / fit.width);
            const byWidth = widthScale < r.minScale - 1e-9;
            if (fit.belowMin && !byWidth && canPromote && r.span === 1 && item) promote.push(item);
            else if (fit.belowMin) {
                // 글자를 10.8px 밑으로 줄이지 않는다: 가장 작게 만든 후보를 최소 배율로 놓으면 칸을 넘친다(세로로 넘치는 쪽은 안전하다).
                // 단 가로로 넘치는 문항(칸보다 넓은 표·그림)은 칸을 키울 수 없고, 가로 넘침은 렌더 전체를 막는 공통 게이트(S12)에 걸려
                // 시험지가 아예 안 열린다. 그래서 가로가 들어가는 배율까지만 줄이고(글자는 10.8px 밑이 될 수 있음) 같은 LAYOUT_OVERFLOW로 보고한다.
                fit = { ...fit, scale: byWidth ? widthScale : r.minScale, status: 'overflow', overflow: true, overflowReason: byWidth ? 'width' : 'height' };
                slotNode.dataset.layoutOverflow = '1';
            } else delete slotNode.dataset.layoutOverflow;
            applyProfile(r.box, fit.profile);
            // CSS zoom contributes its scaled height to Chromium's print layout.
            // transform:scale only changes paint and can paginate trailing choices.
            r.box.style.width = `${r.slot.width}px`;
            r.box.style.zoom = String(fit.scale);
            r.box.style.transform = fit.offsetX || fit.offsetY ? `translate(${fit.offsetX}px, ${fit.offsetY}px)` : 'none';
            r.box.dataset.equalSlotScale = String(fit.scale);
            r.box.dataset.equalSlotStatus = fit.status;
            r.box.dataset.equalSlotFit = JSON.stringify({ ...fit, effectiveFontPx: r.baseFont * fit.scale, span: r.span });
            Object.assign(slotNode.dataset, { equalSlotScale: String(fit.scale), equalSlotStatus: fit.status, equalSlotProfile: fit.profile });
            fits.set(r.box, r.key);
        });
        return { promote };
    }
    // 모든 문항을 먼저 칸에 놓는다. 한 단 전체(span 2)는 state.spans에 든 문항뿐이다(작성자 layoutForce 또는 finalize의 자동 승격).
    function buildPages(area, state, rebuild) {
        const { items, deps } = state;
        if (rebuild) list(area, PAGE).forEach(page => page.remove());
        const pages = plan(items, item => spanOfItem(state, item));
        pages.forEach((slots, index) => {
            const made = deps.makePage(area, index + 1);
            const page = made.page || made, body = made.body;
            if (!body) throw failure('EQUAL_SLOT_BODY_MISSING');
            page.classList.add('ap-equal-slot-page'); body.classList.add('ap-equal-slot-body');
            for (const child of page.children) if (root.getComputedStyle(child).position === 'absolute' && !child.matches(FIXED + ', .page-exam-frame')) child.dataset.equalSlotFooter = 'true';
            const grid = area.ownerDocument.createElement('div'); grid.className = 'grid-container ap-equal-slot-grid'; body.appendChild(grid);
            const columns = [0, 1].map(() => { const col = area.ownerDocument.createElement('div'); col.className = 'grid-col'; grid.appendChild(col); return col; });
            slots.forEach((entry, slotIndex) => {
                if (entry.covered) return;
                const slot = entry.item?.box || area.ownerDocument.createElement('div');
                slot.classList.add('q-box', 'ap-equal-slot');
                slot.dataset.slotIndex = String(slotIndex);
                if (entry.span === 2) slot.dataset.span = '2'; else delete slot.dataset.span;
                columns[entry.column].appendChild(slot);
                if (!entry.item) { slot.dataset.empty = 'true'; slot.setAttribute('aria-hidden', 'true'); return; }
                const { q } = entry.item;
                let content = slot.querySelector(':scope > .ap-slot-content');
                if (!content) {
                    content = area.ownerDocument.createElement('div'); content.className = 'ap-slot-content';
                    content.append(...Array.from(slot.childNodes)); slot.appendChild(content);
                    content.dataset.equalSlotChoiceLocked = String(!!(q.choicesLayout || q.choiceLayout || q.choicesColumns || q.choiceColumns || q.choicesLocked || content.querySelector('.choices[style*="grid-template-columns"], [data-choice-layout-locked="true"]')));
                }
                state.itemByBox.set(content, entry.item);
            });
            deps.decorateBody?.({ page, body }, index === pages.length - 1);
            deps.afterPage?.({ page, body }, index === pages.length - 1);
        });
    }
    async function render({ area, items, deps }) {
        if (!area || !Array.isArray(items)) throw new TypeError('APEqualSlotEngine.render requires area and items');
        // autoPromote: 시험지 렌더(APExamRenderExecutor.render)만 켠다. 반 합성·오답 엔진(renderComposed)은 예전 배율 선택 그대로다.
        const state = { items, deps, autoPromote: deps.autoPromote === true, spans: new Map(), itemByBox: new WeakMap(), forced: new Set(), promoted: [] };
        items.forEach(item => { if (item.q?.layoutTag === 'subjective-2up') { state.spans.set(item, 2); state.forced.add(item); } });
        states.set(area, state);
        buildPages(area, state, false);
        await deps.applyAutoImageSizeClasses?.(area);
        await deps.typesetMath('exam-equal-slots', items.map(item => item.box));
        await ready(area);
        await deps.raf();
        if (!deps.deferFinalize) await finalize(area);
        return area;
    }
    // hooks.afterRelayout(area): 문항을 한 단 전체로 올려 쪽을 다시 만든 뒤(마지막 쪽 QR처럼 쪽에 붙는 장식을 다시 달 때) 불린다.
    async function finalize(area, hooks = {}) {
        let pages = list(area, PAGE);
        if (!pages.length) return { ok: true, issues: [], slots: [], pages: 0, version: VERSION };
        await ready(area);
        const state = states.get(area);
        for (let pass = 0; ; pass += 1) {
            const canPromote = !!state?.autoPromote && pass < MAX_PROMOTION_PASSES;
            const { promote } = fitPages(pages, state, canPromote);
            const fresh = canPromote ? promote.filter(item => !state.spans.has(item)) : [];
            if (!fresh.length) break;
            fresh.forEach(item => { state.spans.set(item, 2); state.promoted.push(item); });
            buildPages(area, state, true);
            await hooks.afterRelayout?.(area);
            await state.deps.raf?.();
            await ready(area);
            pages = list(area, PAGE);
        }
        // 한 단 전체·글자 10.8px로도 안 들어가 쪽을 넘치는 문항 하나가 시험지 전체(공통 게이트 S12·인쇄 사전 점검)를 막지 않게, 그 문항만 자리 표시로 바꾼다.
        // 쪽이 넘치지 않으면 아무것도 하지 않는다. 진단 파일이 없는 화면(오답 엔진 옛 방식 등)은 예전 그대로 동작한다.
        const guarded = root.APRenderDiagnostics?.guardOverflow?.(area) || [];
        const evidence = audit(area);
        if (guarded.length) evidence.guarded = guarded.length;
        if (state) evidence.promoted = state.promoted.map(item => item.box.dataset.sourceRef || item.originalIndex);
        evidence.layoutOverflow = evidence.warnings.filter(w => w.code === 'LAYOUT_OVERFLOW');
        evidence.layoutOverflow.forEach(w => console.warn('[archive-layout] LAYOUT_OVERFLOW: 한 단 전체에도 글자 ' + MIN_EFFECTIVE_FONT_PX + 'px로는 들어가지 않는 문항(overflowReason은 fit 참고)', w));
        area.dataset.equalSlotAudit = JSON.stringify(evidence);
        if (!evidence.ok) throw failure('EQUAL_SLOT_AUDIT_FAILED', evidence);
        return evidence;
    }
    function audit(area) {
        const issues = [], warnings = [], slots = [], pages = list(area, PAGE);
        const add = (code, detail) => issues.push({ code, ...detail });
        const warn = (code, detail) => warnings.push({ code, ...detail });
        const outside = (a, b, tolerance = 1.5) => a.left < b.left - tolerance || a.top < b.top - tolerance || a.right > b.right + tolerance || a.bottom > b.bottom + tolerance;
        const overlap = (a, b) => Math.min(a.right,b.right) - Math.max(a.left,b.left) > 1 && Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top) > 1;
        pages.forEach((page, pageIndex) => {
            let geo;
            try { geo = geometry(page); } catch (_) { add('INVALID_PAGE_GEOMETRY', { page: pageIndex }); return; }
            const pageRect = geo.local(page), pageSlots = list(page, '.ap-equal-slot');
            const spanOf = node => node.dataset.span === '2' ? 2 : 1;
            const cellCount = pageSlots.reduce((sum, node) => sum + spanOf(node), 0);
            if (cellCount !== 4) add('SLOT_COUNT', { page: pageIndex, count: cellCount });
            const unit = pageSlots.find(node => spanOf(node) === 1), first = (unit || pageSlots[0]) && geo.local(unit || pageSlots[0]);
            const fixed = list(page, FIXED).map(node => ({ node, rect: geo.local(node) }));
            fixed.forEach(({rect}) => { if (outside(rect, pageRect)) add('FIXED_OUTSIDE_PAGE', {page:pageIndex}); });
            pageSlots.forEach((slot, slotIndex) => {
                const rect = geo.local(slot), box = slot.querySelector(':scope > .ap-slot-content');
                if (!validSize(rect) || outside(rect, pageRect)) add('INVALID_SLOT_GEOMETRY', {page:pageIndex, slot:slotIndex});
                if (first && (Math.abs(rect.width-first.width)>1 || (spanOf(slot) === 1 ? Math.abs(rect.height-first.height)>1 : unit && rect.height < first.height * 1.8))) add('UNEQUAL_SLOTS', {page:pageIndex, slot:slotIndex});
                for (const f of fixed) if (overlap(rect, f.rect)) add('FIXED_SLOT_OVERLAP', {page:pageIndex, slot:slotIndex, rect, fixedRect:f.rect, fixedClass:f.node.className});
                const markedEmpty = slot.dataset.empty === 'true';
                if (!box) {
                    if (markedEmpty && visibleSemanticContent(slot)) add('EMPTY_SLOT_HAS_CONTENT', { page: pageIndex, slot: slotIndex });
                    else if (!markedEmpty) add('MISSING_SLOT_CONTENT', { page: pageIndex, slot: slotIndex });
                    slots.push({page:pageIndex, slot:slotIndex, empty:true, rect}); return;
                }
                if (markedEmpty && visibleSemanticContent(box)) add('EMPTY_SLOT_HAS_CONTENT', { page: pageIndex, slot: slotIndex });
                const bounds = footprint(box, geo);
                // 의도: 넘친 문항은 CONTENT_OUTSIDE_SLOT으로 시험지를 막지 않고(막으면 시험지가 안 열린다) 진단(LAYOUT_OVERFLOW, outsideSlot)과 교사 화면 표시로 남긴다.
                if (slot.dataset.layoutOverflow === '1') warn('LAYOUT_OVERFLOW', {page:pageIndex, slot:slotIndex, outsideSlot:outside(bounds, rect), sourceRef:slot.dataset.sourceRef || '', number:(slot.querySelector('.q-num')?.textContent || '').trim(), bounds, rect, fit:JSON.parse(box.dataset.equalSlotFit || 'null')});
                else if (outside(bounds, rect)) add('CONTENT_OUTSIDE_SLOT', {page:pageIndex, slot:slotIndex, bounds, rect});
                auditSvgViewBoxes(box, add, pageIndex, slotIndex);
                for (const node of [box, ...list(box, '*')]) {
                    if (ignored(node) || node.closest('svg')) continue;
                    const style = root.getComputedStyle(node);
                    if (!node.getClientRects().length || style.display === 'none') continue;
                    if ((/(hidden|clip|auto|scroll)/.test(style.overflowX) && node.scrollWidth > node.clientWidth + 2) ||
                        (/(hidden|clip|auto|scroll)/.test(style.overflowY) && node.scrollHeight > node.clientHeight + 2)) {
                        add('INTERNAL_CLIPPING', {page:pageIndex, slot:slotIndex, element:node.tagName, className:node.className});
                    }
                }
                slots.push({page:pageIndex, slot:slotIndex, sourceRef:slot.dataset.sourceRef || '', rect, bounds, fit:JSON.parse(box.dataset.equalSlotFit || 'null')});
            });
            for (const image of list(page, 'img')) if (!image.complete || !image.naturalWidth || !image.naturalHeight) add('IMAGE_NOT_READY', {page:pageIndex, src:image.src});
            if (page.querySelector('mjx-merror')) add('MATH_ERROR', {page:pageIndex});
        });
        if (pages.length && area.ownerDocument.fonts?.status === 'loading') add('FONTS_NOT_READY', {});
        return { ok: issues.length === 0, version: VERSION, pages: pages.length, issues, warnings, slots };
    }
    function assertReady(area) {
        const evidence = audit(area);
        if (!evidence.ok) throw failure('EQUAL_SLOT_AUDIT_FAILED', evidence);
        return evidence;
    }
    // html2canvas 1.x ignores CSS object-fit and stretches an <img> over its whole CSS box,
    // so a square figure inside a wide max-height box printed squashed. In the private clone
    // only, give every contain/scale-down image the box it really shows (padding centres the
    // picture, html2canvas draws into the content box). The live page is never touched.
    async function fixContainImages(cloneDocument, scope) {
        const view = cloneDocument.defaultView;
        const images = list(scope && scope.querySelectorAll ? scope : cloneDocument, 'img');
        await Promise.all(images.map(image => image.complete && image.naturalWidth ? null
            : (typeof image.decode === 'function' ? image.decode().catch(() => {}) : null)));
        for (const image of images) {
            const style = view.getComputedStyle(image);
            if (style.objectFit !== 'contain' && style.objectFit !== 'scale-down') continue;
            const boxW = image.offsetWidth, boxH = image.offsetHeight;
            const natW = image.naturalWidth, natH = image.naturalHeight;
            if (!(boxW > 0 && boxH > 0 && natW > 0 && natH > 0)) continue;
            let ratio = Math.min(boxW / natW, boxH / natH);
            if (style.objectFit === 'scale-down') ratio = Math.min(ratio, 1);
            const shownW = natW * ratio, shownH = natH * ratio;
            if (Math.abs(shownW - boxW) < 0.5 && Math.abs(shownH - boxH) < 0.5) continue;
            const inner = image.style;
            inner.boxSizing = 'border-box';
            inner.width = `${boxW}px`;
            inner.height = `${boxH}px`;
            inner.minWidth = inner.minHeight = '0';
            inner.maxWidth = inner.maxHeight = 'none';
            inner.padding = `${(boxH - shownH) / 2}px ${(boxW - shownW) / 2}px`;
            inner.objectFit = 'fill';
        }
    }
    function rasterizePage(page, options = {}) {
        const equalSlot = page.matches(PAGE);
        // html2canvas 1.x ignores CSS zoom when drawing fonts. Its private clone
        // uses the equivalent paint transform; no paged-media fragmentation occurs
        // on canvas, and the live snapshot stays byte-for-byte untouched.
        return root.html2canvas(page, { ...options, async onclone(document, element) {
            await options.onclone?.(document, element);
            if (equalSlot) list(document, '[data-layout-overflow]').forEach(node => node.removeAttribute('data-layout-overflow')); // 교사 화면용 경고 표시는 인쇄 이미지에 넣지 않는다
            if (equalSlot) for (const content of list(element, '.ap-equal-slot > .ap-slot-content')) {
                const fit = JSON.parse(content.dataset.equalSlotFit);
                content.style.zoom = '1';
                content.style.transform = `translate(${fit.offsetX * fit.scale}px, ${fit.offsetY * fit.scale}px) scale(${fit.scale})`;
            }
            await fixContainImages(document, element);
        } });
    }
    return Object.freeze({ VERSION, MIN_EFFECTIVE_FONT_PX, enabled, plan, selectFit, normalizeRect, render, finalize, audit, assertReady, rasterizePage });
});

