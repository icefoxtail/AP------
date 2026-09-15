(function (root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APEqualSlotEngine = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
    'use strict';
    const VERSION = '20260915.1';
    const PAGE = '.page.ap-equal-slot-page';
    const FIXED = '.page-qr, .page-submit-qr, .page-footer, .page-num, [data-equal-slot-footer]';
    const fits = new WeakMap();
    const PROFILES = [
        { name: 'normal', cost: 0 }, { name: 'compact', cost: 0.02 },
        { name: 'choices', cost: 0.035 }, { name: 'images', cost: 0.06 },
        { name: 'compact choices', cost: 0.055 }, { name: 'compact images', cost: 0.08 },
        { name: 'compact choices images', cost: 0.115 }
    ];
    const list = (node, selector) => Array.from(node.querySelectorAll(selector));
    function failure(code, evidence) { return Object.assign(new Error(code), { code, evidence }); }
    function enabled(qpp, url = root.location?.href || '', questions = []) {
        const params = new URL(String(url), 'https://ap.invalid/').searchParams;
        if (Number(qpp) !== 4 || params.get('slotEngine') === 'legacy') return false;
        return params.get('equalSlots') === '1' || !questions.some(q => q.wide === true || ['fullwidth', 'subjective-2up', 'subjective-4up'].includes(q.layoutTag));
    }
    function plan(items) {
        return Array.from({ length: Math.ceil(items.length / 4) }, (_, page) =>
            Array.from({ length: 4 }, (_, index) => ({ row: index % 2, column: Math.floor(index / 2), item: items[page * 4 + index] || null })));
    }
    function validSize(size) { return Number.isFinite(size.width) && Number.isFinite(size.height) && size.width > 0 && size.height > 0; }
    function selectFit(candidates, slot) {
        if (!validSize(slot) || !candidates.length || candidates.some(c => !validSize(c))) throw failure('EQUAL_SLOT_INVALID_GEOMETRY');
        return candidates.map(candidate => {
            const scale = Math.min(1, slot.width / candidate.width, slot.height / candidate.height);
            return { ...candidate, scale, score: scale - (candidate.cost || 0), status: scale < 0.75 ? 'review' : scale < 0.85 ? 'warning' : 'normal' };
        }).sort((a, b) => b.score - a.score || a.cost - b.cost)[0];
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
            !!node.parentElement?.closest('svg, mjx-container');
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
    function applyProfile(box, profile) {
        box.dataset.equalSlotProfile = profile;
        box.style.transform = 'none';
        box.style.transformOrigin = 'top left';
    }
    async function ready(area) {
        await area.ownerDocument.fonts?.ready;
        const images = list(area, 'img');
        if (root.APQuestionImageReadiness) {
            await root.APQuestionImageReadiness.waitForImages(images, { timeoutMs: 5000, throwOnFailure: true });
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
    function fitPages(pages) {
        const records = [];
        pages.forEach(page => {
            reserveDecorations(page);
            const geo = geometry(page);
            list(page, '.ap-equal-slot > .ap-slot-content').forEach(box => {
                const slot = geo.local(box.parentElement);
                const style = root.getComputedStyle(box.parentElement);
                const width = slot.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
                const height = slot.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
                const key = JSON.stringify([Math.round(width * 100) / 100, Math.round(height * 100) / 100, box.innerHTML]);
                if (fits.get(box) === key) return;
                applyProfile(box, 'normal');
                records.push({ box, geo, key, slot: {width, height}, candidates: [] });
            });
        });
        // Mutate the entire batch, then measure it. No per-question frame waits.
        for (const profile of PROFILES) {
            const batch = records.filter(r => !r.done && (!profile.name.includes('choices') || r.box.dataset.equalSlotChoiceLocked !== 'true'));
            batch.forEach(r => applyProfile(r.box, profile.name));
            batch.forEach(r => {
                const bounds = footprint(r.box, r.geo), base = r.geo.local(r.box);
                r.candidates.push({ profile: profile.name, cost: profile.cost, width: bounds.width, height: bounds.height,
                    offsetX: base.left - bounds.left, offsetY: base.top - bounds.top });
                if (profile.name === 'normal' && bounds.width <= r.slot.width && bounds.height <= r.slot.height) r.done = true;
            });
        }
        records.forEach(r => {
            const fit = selectFit(r.candidates, r.slot);
            applyProfile(r.box, fit.profile);
            r.box.style.transform = fit.scale === 1 && !fit.offsetX && !fit.offsetY ? 'none' : `translate(${fit.offsetX * fit.scale}px, ${fit.offsetY * fit.scale}px) scale(${fit.scale})`;
            const baseFont = parseFloat(root.getComputedStyle(r.box).fontSize);
            r.box.dataset.equalSlotScale = String(fit.scale);
            r.box.dataset.equalSlotStatus = fit.status;
            r.box.dataset.equalSlotFit = JSON.stringify({ ...fit, effectiveFontPx: baseFont * fit.scale });
            Object.assign(r.box.parentElement.dataset, { equalSlotScale: String(fit.scale), equalSlotStatus: fit.status, equalSlotProfile: fit.profile });
            fits.set(r.box, r.key);
        });
    }
    async function render({ area, items, deps }) {
        if (!area || !Array.isArray(items)) throw new TypeError('APEqualSlotEngine.render requires area and items');
        const pages = plan(items);
        pages.forEach((slots, index) => {
            const made = deps.makePage(area, index + 1);
            const page = made.page || made, body = made.body;
            if (!body) throw failure('EQUAL_SLOT_BODY_MISSING');
            page.classList.add('ap-equal-slot-page'); body.classList.add('ap-equal-slot-body');
            for (const child of page.children) if (root.getComputedStyle(child).position === 'absolute' && !child.matches(FIXED + ', .page-exam-frame')) child.dataset.equalSlotFooter = 'true';
            const grid = area.ownerDocument.createElement('div'); grid.className = 'grid-container ap-equal-slot-grid'; body.appendChild(grid);
            const columns = [0, 1].map(() => { const col = area.ownerDocument.createElement('div'); col.className = 'grid-col'; grid.appendChild(col); return col; });
            slots.forEach((entry, slotIndex) => {
                const slot = entry.item?.box || area.ownerDocument.createElement('div');
                slot.classList.add('q-box', 'ap-equal-slot');
                slot.dataset.slotIndex = String(slotIndex);
                columns[entry.column].appendChild(slot);
                if (!entry.item) { slot.dataset.empty = 'true'; slot.setAttribute('aria-hidden', 'true'); return; }
                const { q } = entry.item;
                const content = area.ownerDocument.createElement('div'); content.className = 'ap-slot-content';
                content.append(...Array.from(slot.childNodes)); slot.appendChild(content);
                content.dataset.equalSlotChoiceLocked = String(!!(q.choicesLayout || q.choiceLayout || q.choicesColumns || q.choiceColumns || q.choicesLocked || content.querySelector('.choices[style*="grid-template-columns"], [data-choice-layout-locked="true"]')));
            });
            deps.decorateBody?.({ page, body }, index === pages.length - 1);
            deps.afterPage?.({ page, body }, index === pages.length - 1);
        });
        await deps.applyAutoImageSizeClasses?.(area);
        await deps.typesetMath('exam-equal-slots', items.map(item => item.box));
        await ready(area);
        await deps.raf();
        await finalize(area);
        return area;
    }
    async function finalize(area) {
        const pages = list(area, PAGE);
        if (!pages.length) return { ok: true, issues: [], slots: [], pages: 0, version: VERSION };
        await ready(area);
        fitPages(pages);
        const evidence = audit(area);
        area.dataset.equalSlotAudit = JSON.stringify(evidence);
        if (!evidence.ok) throw failure('EQUAL_SLOT_AUDIT_FAILED', evidence);
        return evidence;
    }
    function audit(area) {
        const issues = [], slots = [], pages = list(area, PAGE);
        const add = (code, detail) => issues.push({ code, ...detail });
        const outside = (a, b, tolerance = 1.5) => a.left < b.left - tolerance || a.top < b.top - tolerance || a.right > b.right + tolerance || a.bottom > b.bottom + tolerance;
        const overlap = (a, b) => Math.min(a.right,b.right) - Math.max(a.left,b.left) > 1 && Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top) > 1;
        pages.forEach((page, pageIndex) => {
            let geo;
            try { geo = geometry(page); } catch (_) { add('INVALID_PAGE_GEOMETRY', { page: pageIndex }); return; }
            const pageRect = geo.local(page), pageSlots = list(page, '.ap-equal-slot');
            if (pageSlots.length !== 4) add('SLOT_COUNT', { page: pageIndex, count: pageSlots.length });
            const first = pageSlots[0] && geo.local(pageSlots[0]);
            const fixed = list(page, FIXED).map(node => ({ node, rect: geo.local(node) }));
            fixed.forEach(({rect}) => { if (outside(rect, pageRect)) add('FIXED_OUTSIDE_PAGE', {page:pageIndex}); });
            pageSlots.forEach((slot, slotIndex) => {
                const rect = geo.local(slot), box = slot.querySelector(':scope > .ap-slot-content');
                if (!validSize(rect) || outside(rect, pageRect)) add('INVALID_SLOT_GEOMETRY', {page:pageIndex, slot:slotIndex});
                if (first && (Math.abs(rect.width-first.width)>1 || Math.abs(rect.height-first.height)>1)) add('UNEQUAL_SLOTS', {page:pageIndex, slot:slotIndex});
                for (const f of fixed) if (overlap(rect, f.rect)) add('FIXED_SLOT_OVERLAP', {page:pageIndex, slot:slotIndex, rect, fixedRect:f.rect, fixedClass:f.node.className});
                if (!box) { slots.push({page:pageIndex, slot:slotIndex, empty:true, rect}); return; }
                const bounds = footprint(box, geo);
                if (outside(bounds, rect)) add('CONTENT_OUTSIDE_SLOT', {page:pageIndex, slot:slotIndex, bounds, rect});
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
        return { ok: issues.length === 0, version: VERSION, pages: pages.length, issues, slots };
    }
    function assertReady(area) {
        const evidence = audit(area);
        if (!evidence.ok) throw failure('EQUAL_SLOT_AUDIT_FAILED', evidence);
        return evidence;
    }
    return Object.freeze({ VERSION, enabled, plan, selectFit, normalizeRect, render, finalize, audit, assertReady });
});

