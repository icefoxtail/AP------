(function (global) {
    'use strict';

    const DEFAULT_ENDPOINT = 'http://127.0.0.1:43191';
    const DEFAULT_PRINTER = 'SINDOH N500 Series PCL';
    const DEFAULT_DPI = 300;
    const DEFAULT_THRESHOLD = 220;
    const encoder = new TextEncoder();

    function finitePositive(value, fallback) {
        const number = Number(value);
        return Number.isFinite(number) && number > 0 ? number : fallback;
    }

    function asciiHeader(value, fallback) {
        const sanitized = String(value || '')
            .replace(/[^\x20-\x7E]/g, '_')
            .slice(0, 120)
            .trim();
        return sanitized || fallback;
    }

    function createWriter() {
        const chunks = [];
        let total = 0;
        return {
            ascii(value) {
                const bytes = encoder.encode(value);
                chunks.push(bytes);
                total += bytes.length;
            },
            bytes(value) {
                chunks.push(value);
                total += value.length;
            },
            finish() {
                const result = new Uint8Array(total);
                let offset = 0;
                for (const chunk of chunks) {
                    result.set(chunk, offset);
                    offset += chunk.length;
                }
                return result;
            }
        };
    }

    function pixelLuma(data, offset) {
        const alpha = data[offset + 3] / 255;
        if (alpha >= 0.999) {
            return data[offset] * 0.299 + data[offset + 1] * 0.587 + data[offset + 2] * 0.114;
        }
        return (
            (data[offset] * alpha + 255 * (1 - alpha)) * 0.299
            + (data[offset + 1] * alpha + 255 * (1 - alpha)) * 0.587
            + (data[offset + 2] * alpha + 255 * (1 - alpha)) * 0.114
        );
    }

    function writeRasterPage(writer, canvas, threshold, dpi) {
        const width = canvas.width;
        const height = canvas.height;
        const bytesPerRow = Math.ceil(width / 8);
        const pixels = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, width, height).data;

        // PCL 5 raster graphics: A4 portrait, 300dpi, 1-bit unencoded rows.
        // See HP PCL 5 raster commands: ESC*r#S/T, ESC*r0A, ESC*b0M, ESC*b#W.
        writer.ascii('\x1b&l26A');
        writer.ascii('\x1b&l0O');
        writer.ascii('\x1b&l0E');
        writer.ascii('\x1b*t' + dpi + 'R');
        writer.ascii('\x1b*p0X');
        writer.ascii('\x1b*p0Y');
        writer.ascii('\x1b*r0F');
        writer.ascii('\x1b*r' + width + 'S');
        writer.ascii('\x1b*r' + height + 'T');
        writer.ascii('\x1b*r0A');
        writer.ascii('\x1b*b0M');

        const row = new Uint8Array(bytesPerRow);
        for (let y = 0; y < height; y += 1) {
            row.fill(0);
            const rowOffset = y * width * 4;
            for (let x = 0; x < width; x += 1) {
                if (pixelLuma(pixels, rowOffset + x * 4) < threshold) {
                    row[x >> 3] |= 0x80 >> (x & 7);
                }
            }
            writer.ascii('\x1b*b' + bytesPerRow + 'W');
            writer.bytes(new Uint8Array(row));
        }
        writer.ascii('\x1b*rB\f');
    }

    async function waitForImages(root, timeoutMs = 10000) {
        const images = Array.from(root?.querySelectorAll?.('img') || []);
        await Promise.all(images.map(image => {
            if (image.complete && image.naturalWidth) return Promise.resolve();
            return new Promise(resolve => {
                let settled = false;
                const finish = () => {
                    if (settled) return;
                    settled = true;
                    resolve();
                };
                image.addEventListener('load', finish, { once: true });
                image.addEventListener('error', finish, { once: true });
                setTimeout(finish, timeoutMs);
            });
        }));
    }

    async function fetchWithTimeout(url, options = {}, timeoutMs = 3000) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        try {
            return await fetch(url, { ...options, signal: controller.signal, cache: 'no-store' });
        } finally {
            clearTimeout(timer);
        }
    }

    async function health(endpoint = DEFAULT_ENDPOINT) {
        const response = await fetchWithTimeout(endpoint.replace(/\/$/, '') + '/health');
        if (!response.ok) throw new Error('네이티브 인쇄 보조 프로그램이 응답하지 않습니다.');
        return await response.json();
    }

    async function print(root, options = {}) {
        const endpoint = String(options.endpoint || DEFAULT_ENDPOINT).replace(/\/$/, '');
        const printer = String(options.printer || DEFAULT_PRINTER);
        const dpi = finitePositive(options.dpi, DEFAULT_DPI);
        const threshold = Math.max(1, Math.min(254, Number(options.threshold) || DEFAULT_THRESHOLD));
        const duplex = options.duplex !== false;
        const pageRoot = root || global.document?.getElementById('print-area');
        if (!pageRoot) throw new Error('네이티브 인쇄 영역을 찾을 수 없습니다.');
        if (typeof global.html2canvas !== 'function') throw new Error('html2canvas 로컬 번들이 로드되지 않았습니다.');

        const agent = await health(endpoint);
        if (agent.printer && agent.printer.toLowerCase() !== printer.toLowerCase()) {
            throw new Error('네이티브 보조 프로그램의 프린터가 일치하지 않습니다.');
        }

        const pages = Array.from(pageRoot.querySelectorAll('.page'));
        if (!pages.length) throw new Error('네이티브 인쇄할 페이지가 없습니다.');
        await waitForImages(pageRoot);
        if (global.document.fonts?.ready) await global.document.fonts.ready;

        const viewportWidth = Math.max(global.document.documentElement.clientWidth || 0, ...pages.map(page => Math.ceil(page.getBoundingClientRect().width)));
        const writer = createWriter();
        writer.ascii('\x1bE');
        // PCL duplex: 1 = vertical/long-edge binding, 2 = horizontal/short-edge binding.
        writer.ascii(duplex ? '\x1b&l1S' : '\x1b&l0S');
        const startedAt = performance.now();
        const pageTimes = [];

        for (let index = 0; index < pages.length; index += 1) {
            const pageStartedAt = performance.now();
            const page = pages[index];
            const canvas = await global.html2canvas(page, {
                backgroundColor: '#ffffff',
                scale: dpi / 96,
                width: Math.ceil(page.offsetWidth),
                height: Math.ceil(page.offsetHeight),
                windowWidth: viewportWidth,
                windowHeight: Math.max(global.innerHeight || 0, Math.ceil(page.offsetHeight)),
                useCORS: true,
                allowTaint: false,
                imageTimeout: 10000,
                logging: false
            });
            writeRasterPage(writer, canvas, threshold, dpi);
            pageTimes.push(Number((performance.now() - pageStartedAt).toFixed(1)));
            canvas.width = 1;
            canvas.height = 1;
            options.onProgress?.({ index: index + 1, total: pages.length, elapsedMs: performance.now() - startedAt });
        }

        const payload = writer.finish();
        // Fetch 표준 헤더는 ISO-8859-1 범위만 허용하므로 한국어 제목을 그대로 넣지 않는다.
        const documentName = asciiHeader(options.documentName || global.document.title, 'AP-Math-Native-PCL-Print');
        const response = await fetchWithTimeout(endpoint + '/print', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'X-AP-Printer': printer,
                'X-AP-Document-Name': documentName
            },
            body: payload
        }, 30000);
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error || `네이티브 인쇄 전송 실패 (${response.status})`);

        return {
            mode: 'native-pcl-raw-1bpp',
            printer,
            dpi,
            threshold,
            duplex,
            pageCount: pages.length,
            bytes: payload.length,
            elapsedMs: Number((performance.now() - startedAt).toFixed(1)),
            pageTimes,
            sendElapsedMs: result.sendElapsedMs
        };
    }

    global.APNativePrint = { DEFAULT_ENDPOINT, DEFAULT_PRINTER, health, print, createWriter, writeRasterPage };
})(typeof window !== 'undefined' ? window : globalThis);
