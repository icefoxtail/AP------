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

    function prepare(scope, options = {}) {
        const root = scope || global.document?.body;
        const printDpi = finitePositive(options.printDpi, DEFAULT_PRINT_DPI);
        const replacements = [];
        const summary = {
            considered: 0,
            replaced: 0,
            downsampled: 0,
            sourcePixels: 0,
            outputPixels: 0,
            printDpi
        };

        if (!root?.querySelectorAll || !global.document?.createElement) {
            return { summary, restore() {} };
        }

        for (const img of Array.from(root.querySelectorAll('img'))) {
            if (!img.complete || !img.naturalWidth || !img.naturalHeight || !isFlattenableRasterImage(img)) continue;
            summary.considered += 1;

            try {
                const layout = renderedSize(img);
                const target = targetPixelSize(img.naturalWidth, img.naturalHeight, layout.width, layout.height, printDpi);
                if (!target.width || !target.height) continue;

                const canvas = global.document.createElement('canvas');
                canvas.width = target.width;
                canvas.height = target.height;
                const context = canvas.getContext('2d', { alpha: false });
                if (!context) continue;
                context.fillStyle = '#fff';
                context.fillRect(0, 0, canvas.width, canvas.height);
                context.drawImage(img, 0, 0, canvas.width, canvas.height);

                const style = global.getComputedStyle ? global.getComputedStyle(img) : null;
                canvas.style.width = `${layout.width}px`;
                canvas.style.height = `${layout.height}px`;
                canvas.style.display = style?.display === 'inline' ? 'inline-block' : (style?.display || 'block');
                canvas.style.verticalAlign = style?.verticalAlign || '';
                canvas.className = img.className;
                canvas.setAttribute('aria-label', img.alt || '');
                canvas.dataset.apPrintRaster = 'opaque';

                summary.sourcePixels += img.naturalWidth * img.naturalHeight;
                summary.outputPixels += canvas.width * canvas.height;
                if (target.scale < 0.999) summary.downsampled += 1;

                img.replaceWith(canvas);
                replacements.push({ img, canvas });
                summary.replaced += 1;
            } catch (error) {
                console.warn('[print-image-optimizer] 이미지 최적화 실패 — 원본으로 인쇄합니다.', error);
            }
        }

        const restore = () => {
            for (const { img, canvas } of replacements) {
                if (canvas.isConnected) canvas.replaceWith(img);
            }
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
