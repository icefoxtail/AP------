(function (global) {
    'use strict';

    const CSS_DPI = 96;
    const DEFAULT_PRINT_DPI = 300;

    function finitePositive(value, fallback = 0) {
        const number = Number(value);
        return Number.isFinite(number) && number > 0 ? number : fallback;
    }

    function targetPixelSize(sourceWidth, sourceHeight, layoutWidth, layoutHeight, printDpi = DEFAULT_PRINT_DPI) {
        const naturalWidth = finitePositive(sourceWidth);
        const naturalHeight = finitePositive(sourceHeight);
        if (!naturalWidth || !naturalHeight) return { width: 0, height: 0, scale: 0 };

        const cssWidth = finitePositive(layoutWidth, naturalWidth);
        const cssHeight = finitePositive(layoutHeight, naturalHeight);
        const dpiScale = finitePositive(printDpi, DEFAULT_PRINT_DPI) / CSS_DPI;
        const requiredScale = Math.max(
            (cssWidth * dpiScale) / naturalWidth,
            (cssHeight * dpiScale) / naturalHeight
        );
        const scale = Math.min(1, requiredScale);

        return {
            width: Math.max(1, Math.round(naturalWidth * scale)),
            height: Math.max(1, Math.round(naturalHeight * scale)),
            scale
        };
    }

    function isFlattenableRasterImage(img) {
        const src = String(img?.currentSrc || img?.src || '').split(/[?#]/, 1)[0].toLowerCase();
        return src.endsWith('.png') || src.endsWith('.webp') || src.startsWith('data:image/png') || src.startsWith('data:image/webp');
    }

    function renderedSize(img) {
        const style = global.getComputedStyle ? global.getComputedStyle(img) : null;
        return {
            width: finitePositive(img.clientWidth, parseFloat(style?.width) || img.naturalWidth),
            height: finitePositive(img.clientHeight, parseFloat(style?.height) || img.naturalHeight)
        };
    }

    function canvasToBlob(canvas, type, quality) {
        return new Promise(resolve => canvas.toBlob(resolve, type, quality));
    }

    function waitForImage(img) {
        if (typeof img.decode === 'function') return img.decode().catch(() => {});
        return new Promise(resolve => {
            if (img.complete) return resolve();
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    }

    async function prepare(scope, options = {}) {
        const root = scope || global.document?.body;
        const printDpi = finitePositive(options.printDpi, DEFAULT_PRINT_DPI);
        const jpegQuality = Math.min(1, finitePositive(options.jpegQuality, 0.9));
        const replacements = [];
        const rasterCache = new Map();
        const objectUrls = new Set();
        const summary = {
            considered: 0,
            replaced: 0,
            downsampled: 0,
            uniqueRasters: 0,
            cacheHits: 0,
            sourcePixels: 0,
            outputPixels: 0,
            uniqueOutputPixels: 0,
            encodedBytes: 0,
            printDpi
        };

        if (!root?.querySelectorAll || !global.document?.createElement) {
            return { summary, restore() {} };
        }

        for (const img of Array.from(root.querySelectorAll('img'))) {
            if (!img.complete || !img.naturalWidth || !img.naturalHeight || !isFlattenableRasterImage(img)) continue;
            summary.considered += 1;

            try {
                const sourceWidth = img.naturalWidth;
                const sourceHeight = img.naturalHeight;
                const layout = renderedSize(img);
                const target = targetPixelSize(sourceWidth, sourceHeight, layout.width, layout.height, printDpi);
                if (!target.width || !target.height) continue;
                const source = String(img.currentSrc || img.src || '');
                const cacheKey = `${source}|${target.width}x${target.height}`;
                let raster = rasterCache.get(cacheKey);
                if (!raster) {
                    const canvas = global.document.createElement('canvas');
                    canvas.width = target.width;
                    canvas.height = target.height;
                    const context = canvas.getContext('2d', { alpha: false });
                    if (!context) continue;
                    context.fillStyle = '#fff';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const blob = await canvasToBlob(canvas, 'image/jpeg', jpegQuality);
                    if (!blob) continue;
                    const url = global.URL.createObjectURL(blob);
                    raster = { url, bytes: blob.size, pixels: target.width * target.height };
                    rasterCache.set(cacheKey, raster);
                    objectUrls.add(url);
                    summary.uniqueRasters += 1;
                    summary.uniqueOutputPixels += raster.pixels;
                    summary.encodedBytes += raster.bytes;
                } else {
                    summary.cacheHits += 1;
                }

                const original = {
                    src: img.getAttribute('src'),
                    srcset: img.getAttribute('srcset'),
                    sizes: img.getAttribute('sizes')
                };
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
                img.src = raster.url;
                img.dataset.apPrintRaster = 'opaque-jpeg';
                await waitForImage(img);

                summary.sourcePixels += sourceWidth * sourceHeight;
                summary.outputPixels += target.width * target.height;
                if (target.scale < 0.999) summary.downsampled += 1;
                replacements.push({ img, original });
                summary.replaced += 1;
            } catch (error) {
                console.warn('[print-image-optimizer] 이미지 최적화 실패 — 원본으로 인쇄합니다.', error);
            }
        }

        const restore = () => {
            for (const { img, original } of replacements) {
                if (original.src === null) img.removeAttribute('src');
                else img.setAttribute('src', original.src);
                if (original.srcset === null) img.removeAttribute('srcset');
                else img.setAttribute('srcset', original.srcset);
                if (original.sizes === null) img.removeAttribute('sizes');
                else img.setAttribute('sizes', original.sizes);
                delete img.dataset.apPrintRaster;
            }
            for (const url of objectUrls) global.URL.revokeObjectURL(url);
        };

        try {
            global.document.documentElement.dataset.apPrintImageStats = JSON.stringify(summary);
        } catch (error) {}
        console.info('[print-image-optimizer]', summary);
        return { summary, restore };
    }

    const api = { CSS_DPI, DEFAULT_PRINT_DPI, targetPixelSize, isFlattenableRasterImage, prepare };
    global.APPrintImageOptimizer = api;
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
