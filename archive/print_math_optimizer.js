(function (global) {
    'use strict';

    const CSS_DPI = 96;
    const DEFAULT_PRINT_DPI = 192;
    const DEFAULT_JPEG_QUALITY = 0.94;
    const DEFAULT_ATLAS_WIDTH = 1500;
    const DEFAULT_ATLAS_HEIGHT = 1800;
    const ATLAS_PADDING = 4;
    const MAX_CACHE_ENTRIES = 3;
    const atlasCache = new Map();
    const pendingAtlases = new Map();

    function finitePositive(value, fallback) {
        const number = Number(value);
        return Number.isFinite(number) && number > 0 ? number : fallback;
    }

    function captureScaleForDpi(printDpi = DEFAULT_PRINT_DPI) {
        return finitePositive(printDpi, DEFAULT_PRINT_DPI) / CSS_DPI;
    }

    function hashText(value) {
        let hash = 0x811c9dc5;
        const text = String(value || '');
        for (let index = 0; index < text.length; index += 1) {
            hash ^= text.charCodeAt(index);
            hash = Math.imul(hash, 0x01000193);
        }
        return (hash >>> 0).toString(16).padStart(8, '0');
    }

    function canvasToBlob(canvas, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
    }

    function waitForImage(img) {
        if (typeof img.decode === 'function') return img.decode();
        return new Promise((resolve, reject) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', reject, { once: true });
        });
    }

    function collectMath(root) {
        const occurrences = [];
        const unique = new Map();
        for (const node of Array.from(root?.querySelectorAll?.('mjx-container') || [])) {
            const rect = node.getBoundingClientRect?.();
            const width = Math.max(1, Math.ceil(rect?.width || node.offsetWidth || 0));
            const height = Math.max(1, Math.ceil(rect?.height || node.offsetHeight || 0));
            if (!width || !height) continue;
            const style = global.getComputedStyle ? global.getComputedStyle(node) : {};
            const styleSignature = [
                style.fontSize || '',
                style.fontFamily || '',
                style.fontWeight || '',
                style.color || '',
                style.display || '',
                style.verticalAlign || ''
            ].join('|');
            const key = hashText(`${node.outerHTML}\n${width}x${height}\n${styleSignature}`);
            if (!unique.has(key)) {
                unique.set(key, {
                    key,
                    source: node,
                    width,
                    height,
                    captureStyle: {
                        fontSize: style.fontSize || '',
                        fontFamily: style.fontFamily || '',
                        fontWeight: style.fontWeight || '',
                        color: style.color || ''
                    }
                });
            }
            occurrences.push({
                key,
                node,
                width,
                height,
                layoutStyle: {
                    display: style.display === 'block' ? 'block' : 'inline-block',
                    verticalAlign: style.verticalAlign || 'baseline',
                    marginTop: style.marginTop || '0px',
                    marginRight: style.marginRight || '0px',
                    marginBottom: style.marginBottom || '0px',
                    marginLeft: style.marginLeft || '0px'
                }
            });
        }
        return { occurrences, unique: Array.from(unique.values()) };
    }

    function packEntries(entries, options = {}) {
        const padding = ATLAS_PADDING;
        const widest = entries.reduce((max, entry) => Math.max(max, entry.width), 0);
        const atlasWidth = Math.max(finitePositive(options.atlasWidth, DEFAULT_ATLAS_WIDTH), widest + (padding * 2));
        const maxHeight = finitePositive(options.atlasHeight, DEFAULT_ATLAS_HEIGHT);
        const batches = [];
        let batch = null;

        const startBatch = () => ({ width: atlasWidth, height: padding, placements: [], x: padding, y: padding, rowHeight: 0 });
        const finishBatch = () => {
            if (!batch?.placements.length) return;
            batch.height = Math.max(1, batch.y + batch.rowHeight + padding);
            delete batch.x;
            delete batch.y;
            delete batch.rowHeight;
            batches.push(batch);
        };

        batch = startBatch();
        for (const entry of entries) {
            if (batch.x + entry.width + padding > atlasWidth) {
                batch.x = padding;
                batch.y += batch.rowHeight + padding;
                batch.rowHeight = 0;
            }
            if (batch.placements.length && batch.y + entry.height + padding > maxHeight) {
                finishBatch();
                batch = startBatch();
            }
            batch.placements.push({ entry, x: batch.x, y: batch.y });
            batch.x += entry.width + padding;
            batch.rowHeight = Math.max(batch.rowHeight, entry.height);
        }
        finishBatch();
        return batches;
    }

    async function captureBatch(batch, batchIndex, options) {
        const html2canvas = global.html2canvas;
        if (typeof html2canvas !== 'function') throw new Error('수식 인쇄 모듈(html2canvas)을 불러오지 못했습니다.');

        const token = `ap-math-atlas-${Date.now()}-${batchIndex}`;
        // html2canvas는 대상 노드뿐 아니라 ownerDocument 전체를 복제한다. 시험지 본문 안에
        // atlas를 두면 수천 개 DOM을 다시 복제하므로, MathJax 스타일만 가진 빈 iframe에서
        // 캡처해 준비 시간을 수식 복잡도에만 비례하도록 제한한다.
        const frame = global.document.createElement('iframe');
        frame.setAttribute('aria-hidden', 'true');
        frame.style.cssText = [
            'position:fixed',
            'left:-100000px',
            'top:0',
            `width:${batch.width}px`,
            `height:${batch.height}px`,
            'border:0',
            'visibility:hidden',
            'pointer-events:none'
        ].join(';');
        global.document.body.appendChild(frame);
        const captureDocument = frame.contentDocument;
        captureDocument.open();
        captureDocument.write('<!doctype html><html><head></head><body></body></html>');
        captureDocument.close();
        const base = captureDocument.createElement('base');
        base.href = global.document.baseURI;
        captureDocument.head.appendChild(base);
        for (const style of Array.from(global.document.querySelectorAll('style[id^="MJX-"]'))) {
            captureDocument.head.appendChild(style.cloneNode(true));
        }
        const resetStyle = captureDocument.createElement('style');
        resetStyle.textContent = 'html,body{margin:0;padding:0;background:#fff;overflow:hidden;}';
        captureDocument.head.appendChild(resetStyle);

        const host = captureDocument.createElement('div');
        host.dataset.apMathAtlas = token;
        host.style.cssText = [
            'position:absolute',
            'left:0',
            'top:0',
            `width:${batch.width}px`,
            `height:${batch.height}px`,
            'margin:0',
            'padding:0',
            'overflow:hidden',
            'background:#fff',
            'pointer-events:none'
        ].join(';');

        for (const placement of batch.placements) {
            const clone = placement.entry.source.cloneNode(true);
            const captureStyle = placement.entry.captureStyle;
            clone.style.cssText += [
                'position:absolute',
                `left:${placement.x}px`,
                `top:${placement.y}px`,
                `width:${placement.entry.width}px`,
                `height:${placement.entry.height}px`,
                'margin:0',
                'transform:none',
                'overflow:hidden',
                `font-size:${captureStyle.fontSize}`,
                `font-family:${captureStyle.fontFamily}`,
                `font-weight:${captureStyle.fontWeight}`,
                `color:${captureStyle.color}`
            ].join(';');
            host.appendChild(clone);
        }
        captureDocument.body.appendChild(host);

        let canvas;
        try {
            canvas = await html2canvas(host, {
                backgroundColor: '#ffffff',
                scale: captureScaleForDpi(options.printDpi),
                useCORS: true,
                allowTaint: false,
                imageTimeout: 10000,
                logging: false,
                removeContainer: true,
                scrollX: 0,
                scrollY: 0,
                width: batch.width,
                height: batch.height,
                windowWidth: batch.width,
                windowHeight: batch.height,
                onclone(clonedDocument) {
                    const clonedHost = clonedDocument.querySelector(`[data-ap-math-atlas="${token}"]`);
                    if (clonedHost) {
                        clonedHost.style.position = 'absolute';
                        clonedHost.style.left = '0';
                        clonedHost.style.top = '0';
                    }
                }
            });
        } finally {
            frame.remove();
        }

        const blob = await canvasToBlob(canvas, options.jpegQuality);
        if (!blob) throw new Error(`${batchIndex + 1}번 수식 묶음을 이미지로 만들지 못했습니다.`);
        const result = {
            blob,
            bytes: blob.size,
            pixelWidth: canvas.width,
            pixelHeight: canvas.height,
            cssWidth: batch.width,
            cssHeight: batch.height
        };
        canvas.width = 1;
        canvas.height = 1;
        return result;
    }

    function trimCache() {
        while (atlasCache.size > MAX_CACHE_ENTRIES) atlasCache.delete(atlasCache.keys().next().value);
    }

    async function renderAtlasSet(collected, options, key) {
        const startedAt = global.performance?.now?.() || Date.now();
        const packed = packEntries(collected.unique, options);
        const atlases = [];
        const lookup = new Map();

        for (let index = 0; index < packed.length; index += 1) {
            options.onProgress?.({ current: index + 1, total: packed.length, phase: 'math-atlas' });
            const atlas = await captureBatch(packed[index], index, options);
            atlases.push(atlas);
            for (const placement of packed[index].placements) {
                lookup.set(placement.entry.key, {
                    atlasIndex: index,
                    x: placement.x,
                    y: placement.y,
                    width: placement.entry.width,
                    height: placement.entry.height
                });
            }
            await new Promise(resolve => global.setTimeout(resolve, 0));
        }

        const finishedAt = global.performance?.now?.() || Date.now();
        const result = {
            key,
            atlases,
            lookup,
            summary: {
                mode: 'math-atlas',
                cacheHit: false,
                formulas: collected.occurrences.length,
                uniqueFormulas: collected.unique.length,
                atlases: atlases.length,
                printDpi: options.printDpi,
                encodedBytes: atlases.reduce((sum, atlas) => sum + atlas.bytes, 0),
                outputPixels: atlases.reduce((sum, atlas) => sum + (atlas.pixelWidth * atlas.pixelHeight), 0),
                rasterizeMs: Number((finishedAt - startedAt).toFixed(1))
            }
        };
        atlasCache.delete(key);
        atlasCache.set(key, result);
        trimCache();
        return result;
    }

    async function getAtlasSet(root, rawOptions = {}) {
        const collected = collectMath(root);
        const options = {
            printDpi: finitePositive(rawOptions.printDpi, DEFAULT_PRINT_DPI),
            jpegQuality: Math.min(1, finitePositive(rawOptions.jpegQuality, DEFAULT_JPEG_QUALITY)),
            atlasWidth: finitePositive(rawOptions.atlasWidth, DEFAULT_ATLAS_WIDTH),
            atlasHeight: finitePositive(rawOptions.atlasHeight, DEFAULT_ATLAS_HEIGHT),
            onProgress: rawOptions.onProgress
        };
        if (!collected.occurrences.length) {
            return {
                collected,
                atlases: [],
                lookup: new Map(),
                summary: { mode: 'math-atlas', cacheHit: true, formulas: 0, uniqueFormulas: 0, atlases: 0, rasterizeMs: 0 }
            };
        }
        const signature = collected.unique.map(entry => `${entry.key}:${entry.width}x${entry.height}`).join('|');
        const key = hashText(`${signature}|${collected.occurrences.map(item => item.key).join(',')}|${options.printDpi}|${options.jpegQuality}`);
        const cached = atlasCache.get(key);
        if (cached) {
            atlasCache.delete(key);
            atlasCache.set(key, cached);
            return { ...cached, collected, summary: { ...cached.summary, cacheHit: true, rasterizeMs: 0 } };
        }
        if (!pendingAtlases.has(key)) {
            pendingAtlases.set(key, renderAtlasSet(collected, options, key).finally(() => pendingAtlases.delete(key)));
        }
        const result = await pendingAtlases.get(key);
        return { ...result, collected };
    }

    async function prepare(scope, options = {}) {
        const root = scope || global.document?.getElementById?.('print-area');
        if (!root || !global.document?.createElement) throw new Error('수식 인쇄 영역을 찾지 못했습니다.');
        const atlasSet = await getAtlasSet(root, options);
        if (!atlasSet.atlases.length) return { summary: atlasSet.summary, restore() {} };

        const urls = atlasSet.atlases.map(atlas => global.URL.createObjectURL(atlas.blob));
        await Promise.all(urls.map(url => {
            const img = new global.Image();
            img.src = url;
            return waitForImage(img);
        }));

        const replacements = [];
        for (const occurrence of atlasSet.collected.occurrences) {
            const crop = atlasSet.lookup.get(occurrence.key);
            const atlas = crop ? atlasSet.atlases[crop.atlasIndex] : null;
            if (!crop || !atlas) continue;
            const replacement = global.document.createElement('span');
            replacement.className = 'ap-print-math-raster';
            replacement.setAttribute('aria-hidden', 'true');
            replacement.style.cssText = [
                `display:${occurrence.layoutStyle.display}`,
                'position:relative',
                'overflow:hidden',
                'box-sizing:border-box',
                `width:${occurrence.width}px`,
                `height:${occurrence.height}px`,
                `vertical-align:${occurrence.layoutStyle.verticalAlign}`,
                `margin:${occurrence.layoutStyle.marginTop} ${occurrence.layoutStyle.marginRight} ${occurrence.layoutStyle.marginBottom} ${occurrence.layoutStyle.marginLeft}`,
                'background:#fff'
            ].join(';');
            const img = global.document.createElement('img');
            img.alt = '';
            img.src = urls[crop.atlasIndex];
            img.style.cssText = [
                'position:absolute',
                `left:${-crop.x}px`,
                `top:${-crop.y}px`,
                `width:${atlas.cssWidth}px`,
                `height:${atlas.cssHeight}px`,
                'max-width:none',
                'max-height:none',
                'margin:0',
                'padding:0'
            ].join(';');
            replacement.appendChild(img);
            occurrence.node.replaceWith(replacement);
            replacements.push({ original: occurrence.node, replacement });
        }

        let restored = false;
        const restore = () => {
            if (restored) return;
            restored = true;
            for (const { original, replacement } of replacements) replacement.replaceWith(original);
            for (const url of urls) global.URL.revokeObjectURL(url);
        };
        return { summary: { ...atlasSet.summary, replaced: replacements.length }, restore };
    }

    async function prewarm(scope, options = {}) {
        const root = scope || global.document?.getElementById?.('print-area');
        if (!root) return null;
        const atlasSet = await getAtlasSet(root, options);
        try {
            global.document.documentElement.dataset.apFastPrintPrewarm = JSON.stringify(atlasSet.summary);
        } catch (error) {}
        return atlasSet.summary;
    }

    function clearCache() {
        atlasCache.clear();
    }

    const api = {
        CSS_DPI,
        DEFAULT_PRINT_DPI,
        DEFAULT_JPEG_QUALITY,
        captureScaleForDpi,
        hashText,
        packEntries,
        prepare,
        prewarm,
        clearCache
    };
    global.APPrintMathOptimizer = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
