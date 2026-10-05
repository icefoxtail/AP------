(function () {
    'use strict';

    const TOLERANCE = 2;
    const MAX_REPAIR_PASSES = 2;

    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

    function questionLabel(box, index) {
        return (box.querySelector('.q-num')?.textContent || `${index + 1}번`).trim();
    }

    function visibleElement(element) {
        const style = getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && element.getClientRects().length > 0;
    }

    async function waitForImages(scope, timeoutMs = 4000) {
        const pending = Array.from(scope.querySelectorAll('img')).filter(img => !img.complete);
        if (!pending.length) return [];
        await Promise.race([
            Promise.all(pending.map(img => new Promise(resolve => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
            }))),
            new Promise(resolve => setTimeout(resolve, timeoutMs))
        ]);
        return Array.from(scope.querySelectorAll('img')).filter(img => !img.complete || !img.naturalWidth);
    }

    async function waitForMathJax(scope, timeoutMs = 8000) {
        if (window.__AP_MATHJAX_READY__) {
            try {
                await Promise.race([
                    window.__AP_MATHJAX_READY__,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('MathJax bootstrap timeout')), timeoutMs))
                ]);
            } catch (error) {
                return { ready: false, reason: `MathJax 로딩 실패: ${error?.message || error}` };
            }
        }
        const started = Date.now();
        while (!window.MathJax?.startup?.promise && Date.now() - started < timeoutMs) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        if (!window.MathJax?.startup?.promise) return { ready: false, reason: 'MathJax를 불러오지 못했습니다.' };
        try {
            await Promise.race([
                window.MathJax.startup.promise,
                new Promise((_, reject) => setTimeout(() => reject(new Error('MathJax timeout')), timeoutMs))
            ]);
            if (window.MathJax.typesetPromise) await window.MathJax.typesetPromise([scope]);
            return { ready: true, reason: '' };
        } catch (error) {
            return { ready: false, reason: `수식 변환 실패: ${error?.message || error}` };
        }
    }

    function audit(scope) {
        const issues = [];
        const pages = Array.from(scope.querySelectorAll('.page')).filter(visibleElement);
        pages.forEach((page, pageIndex) => {
            const body = page.querySelector('.page-body') || page;
            if (body.scrollHeight > body.clientHeight + TOLERANCE || body.scrollWidth > body.clientWidth + TOLERANCE) {
                issues.push({ type: 'page-overflow', page: pageIndex + 1, label: `${pageIndex + 1}페이지`, element: body });
            }
        });

        Array.from(scope.querySelectorAll('.q-box')).filter(visibleElement).forEach((box, index) => {
            const boxRect = box.getBoundingClientRect();
            const probes = Array.from(box.querySelectorAll('.q-content, .q-image-wrap, .choices-grid, .choice-grid, table, mjx-container, img'))
                .filter(visibleElement);
            const clipped = probes.some(node => {
                const rect = node.getBoundingClientRect();
                return rect.right > boxRect.right + TOLERANCE || rect.bottom > boxRect.bottom + TOLERANCE;
            });
            if (clipped) {
                const page = pages.indexOf(box.closest('.page')) + 1;
                issues.push({ type: 'question-overflow', page, label: questionLabel(box, index), element: box });
            }
        });

        Array.from(scope.querySelectorAll('mjx-container')).filter(visibleElement).forEach((math, index) => {
            const parent = math.parentElement;
            if (!parent) return;
            const rect = math.getBoundingClientRect();
            const parentRect = parent.getBoundingClientRect();
            if (rect.width > parentRect.width + TOLERANCE || math.scrollWidth > math.clientWidth + TOLERANCE) {
                issues.push({ type: 'math-overflow', page: pages.indexOf(math.closest('.page')) + 1, label: `수식 ${index + 1}`, element: math });
            }
        });

        return { pages: pages.length, issues };
    }

    async function repair(scope, issues) {
        const boxes = new Set(issues.map(issue => issue.element?.closest?.('.q-box')).filter(Boolean));
        boxes.forEach(box => {
            if (typeof window.fitQuestionBox === 'function') window.fitQuestionBox(box);
            if (typeof window.autoCompress === 'function' && box.scrollHeight > box.clientHeight + TOLERANCE) window.autoCompress(box);
        });
        if (window.MathJax?.typesetPromise && boxes.size) await window.MathJax.typesetPromise(Array.from(boxes));
        await nextFrame();
    }

    function issueText(issue) {
        const prefix = issue.page > 0 ? `${issue.page}페이지 ` : '';
        if (issue.type === 'math-overflow') return `${prefix}${issue.label} 가로 잘림`;
        if (issue.type === 'page-overflow') return `${prefix}페이지 영역 넘침`;
        return `${prefix}${issue.label} 문항 잘림`;
    }

    function showResult(report) {
        document.getElementById('ap-print-audit')?.remove();
        const panel = document.createElement('div');
        panel.id = 'ap-print-audit';
        panel.setAttribute('role', 'status');
        panel.style.cssText = 'position:fixed;z-index:2147483647;right:18px;top:64px;width:min(390px,calc(100vw - 36px));padding:14px 16px;border-radius:10px;background:#fff;color:#18181b;box-shadow:0 14px 42px rgba(0,0,0,.28);font:13px/1.45 sans-serif;border:1px solid #d4d4d8;';
        const ok = report.issues.length === 0 && report.mathReady && report.failedImages === 0;
        const details = [];
        if (!report.mathReady) details.push(report.mathReason);
        if (report.failedImages) details.push(`이미지 ${report.failedImages}개 로딩 실패`);
        details.push(...report.issues.slice(0, 8).map(issueText));
        panel.innerHTML = `<div style="font-weight:800;font-size:14px;color:${ok ? '#166534' : '#b91c1c'}">${ok ? '인쇄 검수 통과' : '인쇄 검수 경고'}</div>
            <div style="margin-top:5px">${ok ? `${report.pages}페이지 · 잘림 없음 · 수식/이미지 준비 완료` : details.map(text => `<div>• ${text}</div>`).join('')}</div>`;
        document.body.appendChild(panel);
        setTimeout(() => panel.remove(), ok ? 2400 : 6500);
    }

    async function prepare(options = {}) {
        const scope = options.scope || document.getElementById('print-area') || document.body;
        if (document.fonts?.ready) await document.fonts.ready;
        const failedImages = await waitForImages(scope);
        const math = await waitForMathJax(scope);
        await nextFrame();
        let result = audit(scope);
        for (let pass = 0; pass < MAX_REPAIR_PASSES && result.issues.length; pass++) {
            await repair(scope, result.issues);
            result = audit(scope);
        }
        const report = { ...result, mathReady: math.ready, mathReason: math.reason, failedImages: failedImages.length };
        window.__AP_PRINT_AUDIT__ = report;
        showResult(report);
        if (!report.mathReady || report.failedImages || report.issues.length) {
            return window.confirm(`인쇄 검수에서 ${report.issues.length + report.failedImages + (report.mathReady ? 0 : 1)}건의 경고가 발견됐습니다. 그래도 인쇄할까요?`);
        }
        return true;
    }

    window.APPrintGuard = { audit, prepare, waitForMathJax };
})();
