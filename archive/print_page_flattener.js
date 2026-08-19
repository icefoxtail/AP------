(function (global) {
    'use strict';

    const CSS_DPI = 96;
    const DEFAULT_PRINT_DPI = 200;
    const DEFAULT_JPEG_QUALITY = 0.9;
    const DEFAULT_BATCH_PAGES = 4;
    const MAX_CACHE_ENTRIES = 2;
    const rasterCache = new Map();
    const pendingRasters = new Map();

    function finitePositive(value, fallback) {
        const number = Number(value);
        return Number.isFinite(number) && number > 0 ? number : fallback;
    }

    function captureScaleForDpi(printDpi = DEFAULT_PRINT_DPI) {
        return finitePositive(printDpi, DEFAULT_PRINT_DPI) / CSS_DPI;
    }

    function pixelSizeForA4(printDpi = DEFAULT_PRINT_DPI) {
        const dpi = finitePositive(printDpi, DEFAULT_PRINT_DPI);
        return {
            width: Math.round((210 / 25.4) * dpi),
            height: Math.round((296.5 / 25.4) * dpi)
        };
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

    function makeCacheKey(root, options = {}) {
        const dpi = finitePositive(options.printDpi, DEFAULT_PRINT_DPI);
        const quality = Math.min(1, finitePositive(options.jpegQuality, DEFAULT_JPEG_QUALITY));
        const pages = Array.from(root?.querySelectorAll?.('.page') || []);
        const imageSignature = Array.from(root?.querySelectorAll?.('img') || [])
            .map(img => `${img.currentSrc || img.src || ''}|${img.naturalWidth || 0}x${img.naturalHeight || 0}`)
            .join('\n');
        const documentSignature = [
            global.location?.pathname || '',
            global.location?.search || '',
            root?.innerHTML || '',
            imageSignature,
            pages.length,
            dpi,
            quality
        ].join('\n');
        return hashText(documentSignature);
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

    function trimCache() {
        while (rasterCache.size > MAX_CACHE_ENTRIES) {
            const oldestKey = rasterCache.keys().next().value;
            rasterCache.delete(oldestKey);
        }
    }

    function clonePageForCapture(page) {
        const clone = page.cloneNode(true);
        clone.style.transform = 'none';
        clone.style.margin = '0';
        clone.style.boxShadow = 'none';
        clone.style.overflow = 'hidden';
        const sourceCanvases = Array.from(page.querySelectorAll('canvas'));
        const clonedCanvases = Array.from(clone.querySelectorAll('canvas'));
        for (let index = 0; index < sourceCanvases.length; index += 1) {
            const source = sourceCanvases[index];
            const target = clonedCanvases[index];
            if (!target) continue;
            target.width = source.width;
            target.height = source.height;
            target.getContext('2d')?.drawImage(source, 0, 0);
        }
        return clone;
    }

    async function captureBatch(pages, batchIndex, options) {
        const html2canvas = global.html2canvas;
        if (typeof html2canvas !== 'function') {
            throw new Error('빠른 출력 모듈(html2canvas)을 불러오지 못했습니다.');
        }
        const width = Math.max(1, pages[0]?.offsetWidth || 794);
        const pageHeights = pages.map(page => Math.max(1, page.offsetHeight || 1121));
        const host = global.document.createElement('div');
        host.dataset.apPrintCaptureBatch = String(batchIndex);
        host.style.cssText = [
            'position:fixed',
            'left:-100000px',
            'top:0',
            `width:${width}px`,
            'margin:0',
            'padding:0',
            'display:block',
            'background:#fff',
            'pointer-events:none'
        ].join(';');
        for (const page of pages) host.appendChild(clonePageForCapture(page));
        global.document.body.appendChild(host);
        let canvas;
        try {
            canvas = await html2canvas(host, {
                backgroundColor: '#ffffff',
                scale: captureScaleForDpi(options.printDpi),
                useCORS: true,
                allowTaint: false,
                imageTimeout: 15000,
                logging: false,
                removeContainer: true,
                scrollX: 0,
                scrollY: 0,
                width,
                height: pageHeights.reduce((sum, height) => sum + height, 0),
                windowWidth: Math.max(global.document?.documentElement?.clientWidth || 0, width),
                windowHeight: Math.max(global.document?.documentElement?.clientHeight || 0, pageHeights[0]),
                onclone(clonedDocument) {
                    clonedDocument.documentElement.classList.remove('ap-print-raster-active');
                    const clonedHost = clonedDocument.querySelector(`[data-ap-print-capture-batch="${batchIndex}"]`);
                    if (clonedHost) {
                        clonedHost.style.position = 'absolute';
                        clonedHost.style.left = '0';
                        clonedHost.style.top = '0';
                    }
                }
            });
        } finally {
            host.remove();
        }

        const scale = captureScaleForDpi(options.printDpi);
        const results = [];
        let cssOffset = 0;
        for (let pageIndex = 0; pageIndex < pageHeights.length; pageIndex += 1) {
            const sourceY = Math.round(cssOffset * scale);
            cssOffset += pageHeights[pageIndex];
            const sourceEndY = Math.round(cssOffset * scale);
            const sliceHeight = Math.max(1, sourceEndY - sourceY);
            const pageCanvas = global.document.createElement('canvas');
            pageCanvas.width = canvas.width;
            pageCanvas.height = sliceHeight;
            const context = pageCanvas.getContext('2d', { alpha: false });
            context.fillStyle = '#fff';
            context.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
            context.drawImage(canvas, 0, sourceY, canvas.width, sliceHeight, 0, 0, pageCanvas.width, pageCanvas.height);
            const blob = await canvasToBlob(pageCanvas, options.jpegQuality);
            const result = { blob, width: pageCanvas.width, height: pageCanvas.height, bytes: blob?.size || 0 };
            pageCanvas.width = 1;
            pageCanvas.height = 1;
            if (!blob) throw new Error(`${pageIndex + 1}쪽을 JPEG로 만들지 못했습니다.`);
            results.push(result);
        }
        canvas.width = 1;
        canvas.height = 1;
        return results;
    }

    async function renderRasterSet(root, options, key) {
        const pages = Array.from(root.querySelectorAll('.page'));
        if (!pages.length) throw new Error('빠른 출력으로 변환할 페이지가 없습니다.');

        const startedAt = global.performance?.now?.() || Date.now();
        const rasters = [];
        for (let start = 0, batchIndex = 0; start < pages.length; start += DEFAULT_BATCH_PAGES, batchIndex += 1) {
            const batch = pages.slice(start, start + DEFAULT_BATCH_PAGES);
            options.onProgress?.({ current: start + 1, total: pages.length, phase: 'capture' });
            rasters.push(...await captureBatch(batch, batchIndex, options));
            await new Promise(resolve => global.setTimeout(resolve, 0));
        }
        const finishedAt = global.performance?.now?.() || Date.now();
        const result = {
            key,
            rasters,
            summary: {
                mode: 'page-raster',
                cacheHit: false,
                pages: rasters.length,
                printDpi: options.printDpi,
                jpegQuality: options.jpegQuality,
                batchPages: DEFAULT_BATCH_PAGES,
                encodedBytes: rasters.reduce((sum, raster) => sum + raster.bytes, 0),
                outputPixels: rasters.reduce((sum, raster) => sum + (raster.width * raster.height), 0),
                rasterizeMs: Number((finishedAt - startedAt).toFixed(1))
            }
        };
        rasterCache.delete(key);
        rasterCache.set(key, result);
        trimCache();
        return result;
    }

    async function getRasterSet(root, rawOptions = {}) {
        const options = {
            printDpi: finitePositive(rawOptions.printDpi, DEFAULT_PRINT_DPI),
            jpegQuality: Math.min(1, finitePositive(rawOptions.jpegQuality, DEFAULT_JPEG_QUALITY)),
            onProgress: rawOptions.onProgress
        };
        const key = makeCacheKey(root, options);
        const cached = rasterCache.get(key);
        if (cached) {
            rasterCache.delete(key);
            rasterCache.set(key, cached);
            return {
                ...cached,
                summary: { ...cached.summary, cacheHit: true, rasterizeMs: 0 }
            };
        }
        if (!pendingRasters.has(key)) {
            pendingRasters.set(key, renderRasterSet(root, options, key).finally(() => pendingRasters.delete(key)));
        }
        return await pendingRasters.get(key);
    }

    async function prepare(scope, options = {}) {
        const root = scope || global.document?.getElementById?.('print-area');
        if (!root || !global.document?.createElement) {
            throw new Error('빠른 출력 영역을 찾지 못했습니다.');
        }
        const rasterSet = await getRasterSet(root, options);
        const container = global.document.createElement('div');
        container.id = 'print-raster-area';
        container.setAttribute('aria-hidden', 'true');
        const objectUrls = [];
        const decodeJobs = [];

        for (let index = 0; index < rasterSet.rasters.length; index += 1) {
            const raster = rasterSet.rasters[index];
            const img = global.document.createElement('img');
            const url = global.URL.createObjectURL(raster.blob);
            objectUrls.push(url);
            img.className = 'ap-print-raster-page';
            img.alt = '';
            img.width = raster.width;
            img.height = raster.height;
            img.src = url;
            container.appendChild(img);
            decodeJobs.push(waitForImage(img));
        }

        root.insertAdjacentElement('afterend', container);
        await Promise.all(decodeJobs);
        global.document.documentElement.classList.add('ap-print-raster-active');

        let restored = false;
        const restore = () => {
            if (restored) return;
            restored = true;
            global.document.documentElement.classList.remove('ap-print-raster-active');
            container.remove();
            for (const url of objectUrls) global.URL.revokeObjectURL(url);
        };
        return { summary: rasterSet.summary, restore };
    }

    async function prewarm(scope, options = {}) {
        const root = scope || global.document?.getElementById?.('print-area');
        if (!root) return null;
        const rasterSet = await getRasterSet(root, options);
        try {
            global.document.documentElement.dataset.apFastPrintPrewarm = JSON.stringify(rasterSet.summary);
        } catch (error) {}
        return rasterSet.summary;
    }

    function clearCache() {
        rasterCache.clear();
    }

    const api = {
        CSS_DPI,
        DEFAULT_PRINT_DPI,
        DEFAULT_JPEG_QUALITY,
        captureScaleForDpi,
        pixelSizeForA4,
        makeCacheKey,
        prepare,
        prewarm,
        clearCache
    };
    global.APPrintPageFlattener = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
