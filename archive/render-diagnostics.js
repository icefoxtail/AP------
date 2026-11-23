/*
 * 문항 하나의 수식 오류가 시험지·해설지·정답표 전체를 막지 않게 한다 (2026-11-23, 사용자 원칙 "한 문항 때문에 인쇄가 실패되는 경우는 없어야").
 *
 * 사고: 해설 수식 한 곳의 TeX 오류(\boxed{k&=-4})로 해설지가 0쪽이 되고 "시험지 데이터를 불러올 수 없습니다"만 떴다.
 * 감지(mjx-merror, 남은 $ 검사)는 그대로 두고, 결과만 "전체 중단"에서 "그 자리 표식 + 알림 띠 + 진단 배열"로 바꾼다.
 *
 *  - sanitize(elements): MathJax 조판 직후(APRenderLoop.typeset 안) 오류 수식을 원문(TeX) 글자의 표식으로 바꾼다.
 *    표식은 DOM에 들어간 채 쪽 나누기·측정·준비 스냅숏을 지나므로 인쇄도 같은 모양이다(준비 뒤에 DOM을 다시 쓰지 않는다).
 *  - publish(root): 렌더가 확정(commit)될 때 window.apRenderDiagnostics = [{file, questionNo, part, code, excerpt}]를 만들고
 *    교사용 조작줄이 있는 화면에는 알림 띠(#ap-render-notice, 인쇄 제외)를 그린다.
 *  - replaceImage(image, result): 그림 하나가 안 받아질 때(404·디코드 오류·시간 초과) 그 <img>를 같은 자리의 "그림을 불러오지 못했습니다" 빈 상자로 바꾼다
 *    (2026-11-23). APQuestionImageReadiness.waitForImages의 onFailure와 engine/mixed_engine의 waitForQuestionImage가 부른다. 상자는 `.q-image-wrap` 안에 들어가
 *    칸·문항 번호를 그대로 두고, 인쇄물에도 찍히며, 진단 배열·알림 띠에 수식 오류와 같은 객체·같은 띠로 합쳐진다. <img>가 사라지므로 뒤따르는 이미지 검사는 그 자리를 보지 않는다.
 *  - guardOverflow(area): 글자·그림 줄이기와 한 단 전체 승격을 다 거치고도 쪽을 넘쳐 공통 게이트(S12)·인쇄 사전 점검을 실패시키는 문항 하나를 번호만 남긴
 *    "자리 표시"(replaceUnfit)로 바꾼다(2026-11-23). 나머지 문항은 그대로 뜬다. 쪽이 넘치지 않는 정상 시험지에서는 아무것도 하지 않는다.
 *  - report(): 진단 한 객체(window.apRenderReport) = {engine, mode, file, viewport, entries[{file, questionNo, part, code, stage, severity, message, excerpt}]}.
 *    window.apRenderDiagnostics는 그 중 severity=error(표식으로 대체된 것)만 담은 예전 모양 그대로다. 띠의 "복사" 단추는 report를 글로 만들어 클립보드에 넣는다.
 *  - MathJax가 없거나 조판이 예외로 끝난 경우(진짜 전체 실패)는 여기서 다루지 않는다. data-ap-render-error는 그때만 남는다.
 */
(function attachRenderDiagnostics(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APRenderDiagnostics = api;
}(typeof window !== 'undefined' ? window : globalThis, function createRenderDiagnostics(root) {
    'use strict';

    const MARK = '[data-ap-math-error]';
    const IMAGE_MARK = '[data-ap-image-error]';
    const UNFIT_MARK = '[data-ap-unfit]';
    const HTML_MARK = '[data-ap-html-warn]';
    const OVERFLOW_MARK = '[data-layout-overflow="1"]';
    const PAGE_MARK = '[data-ap-page-overflow]';
    const ALL_MARKS = MARK + ',' + IMAGE_MARK + ',' + UNFIT_MARK + ',' + HTML_MARK + ',' + OVERFLOW_MARK + ',' + PAGE_MARK;
    const UNFIT_MESSAGE = '이 문항은 너무 길어 이 자리에 담지 못했습니다';
    // 사유 코드 표 하나: 단계(stage)·심각도(error=표식으로 대체됨, warn=그대로 그렸고 알림만)·한 줄 설명.
    const CODES = {
        MATH_TYPESET_ERROR: { stage: '수식', severity: 'error', message: '수식 문법 오류로 그리지 못해 원문을 표시했습니다' },
        MATH_UNRENDERED: { stage: '수식', severity: 'error', message: '수식 기호($)가 변환되지 않고 글자로 남았습니다' },
        QUESTION_IMAGE_LOAD_FAILED: { stage: '그림', severity: 'error', message: '그림 파일을 받지 못해 빈 상자로 대체했습니다' },
        QUESTION_IMAGE_READINESS_INCOMPLETE: { stage: '그림', severity: 'error', message: '그림이 시간 안에 오지 않아 빈 상자로 대체했습니다' },
        LAYOUT_CANNOT_FIT: { stage: '배치', severity: 'error', message: '글자·그림을 줄이고 한 단 전체로 키워도 쪽에 들어가지 않아 자리 표시로 대체했습니다' },
        LAYOUT_OVERFLOW: { stage: '배치', severity: 'warn', message: '한 단 전체·최소 글자 크기로도 칸을 조금 넘칩니다(내용은 그대로 그렸습니다)' },
        HTML_UNBALANCED: { stage: '본문', severity: 'warn', message: 'HTML 태그 짝이 맞지 않습니다(브라우저가 자동으로 닫아 그렸습니다)' },
        PAGE_OVERFLOW_NOT_QUESTION: { stage: '배치', severity: 'warn', message: '쪽이 넘치지만 문항을 바꿔도 줄지 않아 문항 탓이 아닙니다(머리글·QR 등 문항 밖 요소 확인). 문항은 그대로 두었습니다' },
        RENDER_TIME_BUDGET: { stage: '시간', severity: 'warn', message: '정해진 시간 안에 끝나지 않아 기다리지 않고 계속했습니다' }
    };
    const codeInfo = code => CODES[code] || { stage: '기타', severity: 'error', message: String(code || '') };
    const IMAGE_MESSAGE = '그림을 불러오지 못했습니다';
    const NOTICE_ID = 'ap-render-notice';
    const STYLE_ID = 'ap-render-diagnostics-style';
    // MathJax가 건너뛰는 자리(코드·스크립트)와 이미 표식인 자리의 글자는 "남은 $" 검사에서 다시 보지 않는다.
    const LEFTOVER_SKIP = 'mjx-container,script,style,textarea,pre,code,noscript,.tex2jax_ignore,' + MARK;
    const LEFTOVER_RE = /\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g;
    const LABEL = { math: '수식 오류', leftover: '수식 변환 안 됨' };
    const CSS = `
.ap-math-error{display:inline;background:#fff1f0;border:1px dashed #c62828;border-radius:3px;padding:0 3px;color:#8a1c1c;font-size:.92em;line-height:1.55;font-weight:400;font-style:normal;text-indent:0;overflow-wrap:anywhere;word-break:break-all;-webkit-box-decoration-break:clone;box-decoration-break:clone;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ap-math-error__tag{display:inline-block;margin-right:4px;padding:1px 4px;border-radius:2px;background:#c62828;color:#fff;font:700 .78em/1.2 sans-serif;white-space:nowrap;word-break:normal}
.ap-math-error__tex{background:none;padding:0;color:inherit;font:400 .9em/1.5 Consolas,'Courier New',monospace}
.q-box[data-ap-math-error]{outline:2px dashed #c62828;outline-offset:-2px}
.ap-math-error--flash{outline:3px solid #f59e0b;outline-offset:2px}
.ap-image-missing{display:inline-block;box-sizing:border-box;min-width:28mm;max-width:100%;min-height:10mm;padding:3mm 2mm;border:1px dashed #c62828;border-radius:3px;background:#fff1f0;color:#8a1c1c;font:700 9pt/1.4 'Pretendard','Noto Sans KR',sans-serif;text-align:center;text-indent:0;vertical-align:middle;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ap-image-missing--figure{display:flex;align-items:center;justify-content:center;width:100%;min-height:28mm;margin:2mm auto}
.ap-unfit{display:block;box-sizing:border-box;margin:3mm 0;padding:4mm 3mm;border:1.5px dashed #c62828;border-radius:3px;background:#fff1f0;color:#8a1c1c;font:700 9pt/1.5 'Pretendard','Noto Sans KR',sans-serif;text-align:center;text-indent:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.q-box[data-ap-unfit]{outline:2px dashed #c62828;outline-offset:-2px}
.ap-render-notice__copy{margin:0 0 0 auto;padding:2px 12px;min-height:28px;border:1px solid #c9922c;border-radius:14px;background:#5c3b00;color:#fff;font:inherit;font-weight:700;cursor:pointer}
.ap-render-notice__copy:hover,.ap-render-notice__copy:focus-visible{background:#7a5000}
.ap-render-notice{position:sticky;top:54px;z-index:900;box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;padding:6px 16px;background:#fff4d6;color:#5c3b00;border-bottom:1px solid #e0b252;font:13px/1.5 'Pretendard','Noto Sans KR',sans-serif}
.ap-render-notice[hidden]{display:none}
.ap-render-notice__lead{font-weight:700}
.ap-render-notice__item{margin:0;padding:2px 10px;min-height:28px;border:1px solid #c9922c;border-radius:14px;background:#fff;color:#5c3b00;font:inherit;cursor:pointer}
.ap-render-notice__item:hover,.ap-render-notice__item:focus-visible{background:#ffe9b0}
@media (max-width:640px){.ap-render-notice{top:52px;padding:6px 8px}}
@media print{#ap-render-notice{display:none!important}}`;

    function ownerDocument(node) {
        return node?.ownerDocument || root.document;
    }
    function ensureStyle(doc) {
        if (!doc?.head || doc.getElementById(STYLE_ID)) return;
        const style = doc.createElement('style');
        style.id = STYLE_ID;
        style.textContent = CSS;
        doc.head.appendChild(style);
    }
    function clip(value, max) {
        const text = String(value ?? '').replace(/\s+/g, ' ').trim();
        return text.length > max ? text.slice(0, max - 1) + '…' : text;
    }
    function listOf(elements) {
        return Array.from(elements ? (typeof elements.length === 'number' ? elements : [elements]) : []);
    }

    function makeMarker(doc, kind, code, tex, message) {
        ensureStyle(doc);
        const span = doc.createElement('span');
        span.className = 'ap-math-error tex2jax_ignore';
        span.setAttribute('data-ap-math-error', code);
        span.setAttribute('data-ap-math-excerpt', clip(tex, 80));
        if (message) span.setAttribute('data-ap-math-message', clip(message, 120));
        const tag = doc.createElement('b');
        tag.className = 'ap-math-error__tag';
        tag.textContent = LABEL[kind];
        const body = doc.createElement('code');
        body.className = 'ap-math-error__tex';
        body.textContent = clip(tex, 160);
        span.append(tag, body);
        return span;
    }

    // 오류 수식(mjx-merror)을 그 자리의 원문 표식으로 바꾼다. 원문은 mjx-math의 data-latex에 남아 있다.
    function replaceMathErrors(scope) {
        let count = 0;
        const errors = scope.matches?.('mjx-merror') ? [scope] : Array.from(scope.querySelectorAll('mjx-merror'));
        for (const error of errors) {
            const container = error.closest('mjx-container') || error;
            if (!container.parentNode) continue;
            const math = container.querySelector?.('mjx-math') || error.closest('mjx-math');
            const tex = math?.getAttribute('data-latex') || error.getAttribute('data-tex') || error.textContent || '';
            const message = error.getAttribute('data-mjx-error') || '';
            container.replaceWith(makeMarker(ownerDocument(scope), 'math', 'MATH_TYPESET_ERROR', tex, message));
            count += 1;
        }
        return count;
    }

    // MathJax가 건드리지 않아 글자로 남은 $...$ (괄호 짝이 안 맞는 TeX 등)를 표식으로 감싼다(글자는 그대로 보인다).
    function markLeftoverText(scope) {
        const doc = ownerDocument(scope);
        const walker = doc.createTreeWalker(scope, 4 /* NodeFilter.SHOW_TEXT */);
        const hits = [];
        while (walker.nextNode()) {
            const node = walker.currentNode;
            const parent = node.parentElement;
            if (!parent || parent.closest(LEFTOVER_SKIP)) continue;
            LEFTOVER_RE.lastIndex = 0;
            if (LEFTOVER_RE.test(node.nodeValue || '')) hits.push(node);
        }
        let count = 0;
        for (const node of hits) {
            const text = node.nodeValue || '';
            const fragment = doc.createDocumentFragment();
            let last = 0;
            LEFTOVER_RE.lastIndex = 0;
            for (let match; (match = LEFTOVER_RE.exec(text));) {
                if (match.index > last) fragment.append(doc.createTextNode(text.slice(last, match.index)));
                fragment.append(makeMarker(doc, 'leftover', 'MATH_UNRENDERED', match[0], ''));
                last = match.index + match[0].length;
                count += 1;
            }
            if (last < text.length) fragment.append(doc.createTextNode(text.slice(last)));
            node.replaceWith(fragment);
        }
        return count;
    }

    // 그림 주소에서 알아볼 끝부분만 남긴다(도메인·캐시 번호 제거): ".../<폴더>/<파일>".
    function imageExcerpt(src) {
        const raw = String(src || '').trim();
        if (!raw) return '';
        let path = raw;
        try { path = decodeURIComponent(new URL(raw, 'http://x/').pathname); } catch (error) { path = raw.split(/[?#]/)[0]; }
        const parts = path.split('/').filter(Boolean);
        return clip(parts.slice(-3).join('/') || raw, 80);
    }

    // 안 받아진 그림 하나를 같은 자리의 빈 상자로 바꾼다. 바꿨으면 true. 예외를 던지지 않는다.
    function replaceImage(image, result) {
        try {
            if (!image?.parentNode) return false;
            const doc = ownerDocument(image);
            ensureStyle(doc);
            const code = result?.status === 'error' ? 'QUESTION_IMAGE_LOAD_FAILED' : 'QUESTION_IMAGE_READINESS_INCOMPLETE';
            const span = doc.createElement('span');
            span.className = 'ap-image-missing tex2jax_ignore' + (image.closest?.('.q-image-wrap,.sol-image-wrap') ? ' ap-image-missing--figure' : '');
            span.setAttribute('data-ap-image-error', code);
            span.setAttribute('data-ap-image-excerpt', imageExcerpt(image.getAttribute?.('src') || result?.src));
            span.setAttribute('role', 'img');
            span.setAttribute('aria-label', IMAGE_MESSAGE);
            span.textContent = IMAGE_MESSAGE;
            image.replaceWith(span);
            return true;
        } catch (error) {
            console.warn('[archive-render-diagnostics] replaceImage failed', error);
            return false;
        }
    }

    // 표식으로 바뀐 글자를 뺀 본문 글자. mathjax_render_loop.unrenderedMathCount가 쓴다(표식 안의 원문 $는 "남은 $"가 아니다).
    function textWithoutMarks(scope) {
        if (!scope) return '';
        if (!scope.querySelector || !(scope.querySelector(MARK) || scope.closest?.(MARK))) return String(scope.textContent || '');
        const doc = ownerDocument(scope);
        const walker = doc.createTreeWalker(scope, 4);
        let out = '';
        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (!node.parentElement?.closest(MARK)) out += node.nodeValue;
        }
        return out;
    }

    function leftoverCount(scope) {
        return (textWithoutMarks(scope).match(LEFTOVER_RE) || []).length;
    }

    // 표식으로도 풀리지 않는 남은 $(노드 경계를 넘는 경우)는 그 문항 상자 전체에 표시한다. 상자를 못 찾으면 그대로 두어 기존 전체 검사가 잡는다.
    function flagBoxes(scope) {
        const own = scope.closest?.('[data-source-ref]');
        const boxes = own ? [own] : Array.from(scope.querySelectorAll?.('[data-source-ref]') || []);
        for (const box of boxes) {
            if (box.hasAttribute('data-ap-math-error')) continue;
            if (leftoverCount(box)) {
                box.setAttribute('data-ap-math-error', 'MATH_UNRENDERED');
                box.setAttribute('data-ap-math-excerpt', clip((textWithoutMarks(box).match(LEFTOVER_RE) || [''])[0], 80));
                ensureStyle(ownerDocument(box));
            }
        }
    }

    // APRenderLoop.typeset가 MathJax 조판 직후에 부른다. 예외를 던지지 않는다.
    function sanitize(elements) {
        let changed = 0;
        for (const scope of listOf(elements)) {
            if (!scope?.querySelectorAll) continue;
            try {
                changed += replaceMathErrors(scope);
                changed += markLeftoverText(scope);
                if (leftoverCount(scope)) flagBoxes(scope);
            } catch (error) {
                console.warn('[archive-render-diagnostics] sanitize failed', error);
            }
        }
        return changed;
    }

    function partOf(node) {
        if (node.closest('.sol-exp,.sol-chunk,.sol-meta,.sol-ans')) return '해설';
        if (node.closest('.choices,.choice-item,.choice-text')) return '보기';
        return '본문';
    }
    function boxOf(node) {
        return node.matches?.('.q-box,.sol-box,[data-source-ref]') ? node : node.closest('.q-box,.sol-box,[data-source-ref]');
    }
    function questionNoOf(box) {
        if (!box) return null;
        // 오답 인쇄(apmath/wrong_print_engine.html)는 학생마다 번호를 1부터 다시 매기고, 이어짐 상자에는 번호 칸이 없어 상자에 번호를 직접 적어 둔다.
        const stamped = Number(box.getAttribute?.('data-ap-diag-no'));
        if (Number.isFinite(stamped) && stamped > 0) return stamped;
        const label = box.querySelector?.('.q-num')?.textContent || '';
        const shown = /(\d+)/.exec(label);
        if (shown) return Number(shown[1]);
        const ordinal = /#ordinal:(\d+)/.exec(box.getAttribute('data-source-ref') || '');
        return ordinal ? Number(ordinal[1]) : null;
    }
    function imagePartOf(node) {
        if (node.closest('.sol-exp,.sol-chunk,.sol-meta,.sol-ans')) return '해설 그림';
        if (node.closest('.choices,.choice-item,.choice-text')) return '보기 그림';
        return '문제 그림';
    }
    function isImageEntry(entry) {
        return /^QUESTION_IMAGE_/.test(String(entry?.code || ''));
    }
    // 한 표식 노드가 만드는 항목들의 사유 코드. 수식·그림 표식은 코드를 속성에 적고, 배치 표식은 속성 이름 자체가 코드다.
    function codesOf(node) {
        const codes = [];
        const math = node.getAttribute('data-ap-math-error');
        const image = node.getAttribute('data-ap-image-error');
        if (math) codes.push(math);
        if (image) codes.push(image);
        if (node.hasAttribute('data-ap-unfit')) codes.push('LAYOUT_CANNOT_FIT');
        else if (node.getAttribute('data-layout-overflow') === '1') codes.push('LAYOUT_OVERFLOW');
        if (node.hasAttribute('data-ap-html-warn')) codes.push('HTML_UNBALANCED');
        if (node.hasAttribute('data-ap-page-overflow')) codes.push('PAGE_OVERFLOW_NOT_QUESTION');
        return codes;
    }
    function describe(node, forcedCode) {
        const box = boxOf(node);
        const code = forcedCode || codesOf(node)[0] || 'MATH_TYPESET_ERROR';
        const isImage = /^QUESTION_IMAGE_/.test(code);
        const isLayout = /^LAYOUT_/.test(code);
        const isHtml = code === 'HTML_UNBALANCED';
        const isPage = code === 'PAGE_OVERFLOW_NOT_QUESTION';
        const ref = box?.getAttribute('data-source-ref') || node.closest('[data-source-ref]')?.getAttribute('data-source-ref') || '';
        const file = (ref.split('#')[0] || String(root.AppState?.sourceArchiveFile || ''));
        const info = codeInfo(code);
        const entry = {
            file,
            questionNo: questionNoOf(box),
            part: isPage ? (node.getAttribute('data-ap-page-overflow') + '쪽') : isLayout ? '문항' : isHtml ? '본문' : isImage ? imagePartOf(node) : (node === box ? '' : partOf(node)),
            code,
            stage: info.stage,
            severity: info.severity,
            message: info.message,
            excerpt: isPage ? '' : isHtml ? (node.getAttribute('data-ap-html-warn') || '')
                : code === 'LAYOUT_CANNOT_FIT' ? (node.getAttribute('data-ap-unfit-excerpt') || '')
                : isLayout ? '' : (node.getAttribute('data-ap-math-excerpt') || node.getAttribute('data-ap-image-excerpt') || '')
        };
        // 여러 학생·여러 원본 시험이 섞이는 화면(오답 인쇄)만 상자에 적어 둔 학생·원본 문항 번호가 더 붙는다. 없으면 기존 모양 그대로.
        const student = box?.getAttribute?.('data-ap-diag-student');
        if (student) entry.student = student;
        const sourceNo = box?.getAttribute?.('data-ap-diag-src-no');
        if (sourceNo) entry.sourceNo = /^\d+$/.test(sourceNo) ? Number(sourceNo) : sourceNo;
        return entry;
    }
    // [{entry, node}] — 한 노드가 여러 사유를 가지면(예: 칸 넘침 + HTML 짝) 항목을 사유마다 만든다.
    function collectPairs(scope) {
        const area = scope || root.document?.getElementById('print-area');
        if (!area?.querySelectorAll) return [];
        const pairs = [];
        const seen = new Set();
        for (const node of Array.from(area.querySelectorAll(ALL_MARKS))) {
            const codes = codesOf(node);
            (codes.length ? codes : [undefined]).forEach(code => {
                const entry = describe(node, code);
                // 문항 단위 알림(배치·HTML)은 이어짐 상자(복제된 속성)까지 합쳐 문항당 한 번만 센다. 수식·그림 표식은 자리마다 센다.
                if (/^(LAYOUT_|HTML_)/.test(entry.code)) {
                    const key = [entry.student || '', entry.file, entry.questionNo, entry.code].join('|');
                    if (seen.has(key)) return;
                    seen.add(key);
                }
                pairs.push({ entry, node });
            });
        }
        return pairs;
    }
    function collect(scope) {
        return collectPairs(scope).map(pair => pair.entry);
    }
    const isError = entry => (entry.severity || 'error') !== 'warn';

    function noticeVisible(doc) {
        const bar = doc.getElementById('mode-ctrl');
        if (!bar || doc.body?.classList.contains('screen-fit-mode')) return false;
        try { return root.getComputedStyle(bar).display !== 'none'; } catch (error) { return true; }
    }
    function shortFile(file) {
        const name = String(file || '').split('/').pop().replace(/\.js$/i, '');
        return name.length > 40 ? name.slice(0, 39) + '…' : name;
    }
    function targetLabel(entry) {
        if (isImageEntry(entry)) return (entry.questionNo == null ? '문항 번호를 알 수 없는 곳' : entry.questionNo + '번') + ' ' + entry.part;
        const where = entry.questionNo == null ? '문항 번호를 알 수 없는 곳' : entry.questionNo + '번';
        const base = entry.part ? where + ' ' + entry.part : (entry.questionNo == null ? where : where + ' 문항');
        // 오답 인쇄: "김가나 2번 해설 (원본 시험이름 4번)" — 어느 학생의 어느 원본 문항인지 함께 알린다.
        const source = entry.sourceNo == null ? '' : ' (원본 ' + (shortFile(entry.file) ? shortFile(entry.file) + ' ' : '') + entry.sourceNo + '번)';
        return (entry.student ? entry.student + ' ' : '') + base + source;
    }
    function flash(node) {
        node.scrollIntoView?.({ block: 'center', behavior: 'smooth' });
        node.classList.add('ap-math-error--flash');
        setTimeout(() => node.classList.remove('ap-math-error--flash'), 1800);
    }

    function entryLabel(entry) {
        // 수식·그림 항목은 예전 문구 그대로, 배치·HTML 항목은 사유를 한 마디 붙인다.
        if (entry.code === 'PAGE_OVERFLOW_NOT_QUESTION') return entry.part + ' 넘침 (문항 탓 아님)';
        const base = targetLabel(entry);
        if (entry.code === 'LAYOUT_CANNOT_FIT') return base + ' (너무 길어 자리 표시로 바꿈)';
        if (entry.code === 'LAYOUT_OVERFLOW') return base + ' (칸을 넘침)';
        if (entry.code === 'HTML_UNBALANCED') return base + ' (HTML 태그 짝)';
        if (entry.code === 'RENDER_TIME_BUDGET') return base + ' (시간 초과)';
        return base;
    }
    const isLegacyCode = entry => isImageEntry(entry) || /^MATH_/.test(String(entry.code || ''));

    function renderNotice(doc, area, pairs) {
        let bar = doc.getElementById(NOTICE_ID);
        if (!pairs.length || !noticeVisible(doc)) {
            if (bar) { bar.hidden = true; bar.textContent = ''; }
            return;
        }
        ensureStyle(doc);
        if (!bar) {
            bar = doc.createElement('div');
            bar.id = NOTICE_ID;
            bar.className = 'ap-render-notice';
            bar.setAttribute('role', 'status');
        }
        const anchor = doc.getElementById('print-area') || area;
        if (anchor?.parentNode && bar.nextSibling !== anchor) anchor.parentNode.insertBefore(bar, anchor);
        // 문항 번호·위치·사유별로 묶는다(같은 문항의 같은 위치에 둘 이상이면 "N개").
        const entries = pairs.map(pair => pair.entry);
        const legacyOnly = entries.every(isLegacyCode);
        const groups = [];
        pairs.forEach(({ entry, node }) => {
            const key = [entry.student || '', entry.file || '', entry.sourceNo ?? '', entry.questionNo, entry.part, legacyOnly ? '' : entry.code].join('|');
            let group = groups.find(item => item.key === key);
            if (!group) { group = { key, entry, node, count: 0 }; groups.push(group); }
            group.count += 1;
        });
        bar.hidden = false;
        bar.textContent = '';
        const total = entries.length;
        const add = (tag, className, text) => {
            const node = doc.createElement(tag);
            node.className = className;
            node.textContent = text;
            bar.append(node);
            return node;
        };
        const allImages = entries.every(isImageEntry);
        const kindWord = allImages ? '그림' : entries.every(entry => /^MATH_/.test(entry.code)) ? '수식' : '내용';
        const failWord = allImages ? '불러오지 못했습니다' : '표시하지 못했습니다';
        if (!legacyOnly) {
            add('span', 'ap-render-notice__lead', `확인이 필요한 문항 ${groups.length}곳:`);
            for (const group of groups) {
                const button = add('button', 'ap-render-notice__item', `${entryLabel(group.entry)}${group.count > 1 ? ' ' + group.count + '개' : ''}`);
                button.type = 'button';
                button.addEventListener('click', () => group.node && flash(group.node));
            }
        } else if (groups.length === 1) {
            const only = groups[0];
            const text = isImageEntry(only.entry)
                ? `${targetLabel(only.entry)} ${only.count}개를 불러오지 못했습니다 (눌러서 보기)`
                : `${targetLabel(only.entry)}의 ${kindWord} ${only.count}개를 표시하지 못했습니다 (눌러서 보기)`;
            const button = add('button', 'ap-render-notice__item', text);
            button.type = 'button';
            button.addEventListener('click', () => only.node && flash(only.node));
        } else {
            add('span', 'ap-render-notice__lead', `${kindWord} ${total}개를 ${failWord}:`);
            for (const group of groups) {
                const button = add('button', 'ap-render-notice__item', `${targetLabel(group.entry)} ${group.count}개`);
                button.type = 'button';
                button.addEventListener('click', () => group.node && flash(group.node));
            }
        }
        const copy = add('button', 'ap-render-notice__copy', '복사');
        copy.type = 'button';
        copy.title = '진단 내용(파일·문항 번호·사유 코드·엔진 판본)을 클립보드에 복사합니다';
        copy.addEventListener('click', () => copyReport(doc, copy));
    }

    // ---- 진단 한 객체 ----------------------------------------------------------------------------------------------------------------
    function engineVersion() {
        let diag = '';
        try {
            const tag = Array.from(root.document?.scripts || []).find(script => /render-diagnostics\.js/.test(script.src || ''));
            diag = (String(tag?.src || '').match(/[?&]v=([^&#]+)/) || [])[1] || '';
        } catch (error) { /* 판본을 못 읽어도 진단은 낸다 */ }
        return 'render-diagnostics ' + (diag || '?') + ' / equal-slot ' + (root.APEqualSlotEngine?.VERSION || '-');
    }
    function modeOf() {
        try { return String(root.AppState?.mode || new URLSearchParams(root.location?.search || '').get('mode') || ''); } catch (error) { return ''; }
    }
    function report(entries) {
        const list = entries || collect();
        let page = '';
        try { page = String(root.location?.pathname || '').split('/').pop(); } catch (error) { /* ignore */ }
        return {
            engine: engineVersion(),
            page,
            mode: modeOf(),
            file: String(root.AppState?.sourceArchiveFile || ''),
            viewport: { width: Number(root.innerWidth) || 0, height: Number(root.innerHeight) || 0 },
            errorCount: list.filter(isError).length,
            warnCount: list.filter(entry => !isError(entry)).length,
            entries: list
        };
    }
    function reportText(rep) {
        const data = rep || report();
        const lines = [
            '[아카이브 출력 진단]',
            `파일: ${data.file || (data.entries[0]?.file || '-')}`,
            `엔진: ${data.engine} (${data.page || '-'}, 모드 ${data.mode || '-'}, 화면 폭 ${data.viewport?.width || 0}px)`,
            `오류 ${data.errorCount}건 · 알림 ${data.warnCount}건`
        ];
        data.entries.forEach(entry => {
            const where = (entry.questionNo == null ? '번호 모름' : entry.questionNo + '번') + (entry.part ? ' ' + entry.part : '');
            const who = (entry.student ? entry.student + ' ' : '') + (entry.file && entry.file !== data.file ? entry.file + ' ' : '');
            lines.push(`- ${who}${where} | ${entry.code} (${entry.stage || '-'}, ${entry.severity === 'warn' ? '알림' : '오류'}) | ${entry.message || ''}${entry.excerpt ? ' | 원문: ' + entry.excerpt : ''}`);
        });
        return lines.join('\n');
    }
    function copyReport(doc, button) {
        const text = reportText();
        const done = label => { const before = button.textContent; button.textContent = label; setTimeout(() => { button.textContent = before; }, 1600); };
        const fallback = () => {
            try {
                const area = doc.createElement('textarea');
                area.value = text; area.setAttribute('readonly', ''); area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
                doc.body.appendChild(area); area.select();
                const ok = doc.execCommand?.('copy');
                area.remove();
                done(ok ? '복사됨' : '복사 실패');
            } catch (error) { done('복사 실패'); }
        };
        try {
            if (root.navigator?.clipboard?.writeText) root.navigator.clipboard.writeText(text).then(() => done('복사됨'), fallback);
            else fallback();
        } catch (error) { fallback(); }
    }

    // 렌더가 확정될 때(apRenderReady 직전) 부른다. 예외를 던지지 않는다.
    function publish(scope) {
        try {
            const doc = root.document;
            const area = scope || doc.getElementById('print-area');
            const pairs = collectPairs(area);
            // 시간 예산을 넘겨 기다리지 않고 계속한 대기(mathjax_render_loop.js bounded)도 같은 객체에 알림으로 올린다. 문항을 특정할 수 없으므로 번호는 비운다.
            for (const hit of Array.isArray(root.__AP_RENDER_BUDGET_HITS__) ? root.__AP_RENDER_BUDGET_HITS__ : []) {
                const info = codeInfo('RENDER_TIME_BUDGET');
                pairs.push({ node: area, entry: { file: String(root.AppState?.sourceArchiveFile || ''), questionNo: null, part: '', code: 'RENDER_TIME_BUDGET', stage: info.stage, severity: info.severity, message: info.message, excerpt: `${hit.label} ${hit.ms}ms` } });
            }
            const entries = pairs.map(pair => pair.entry);
            const errors = entries.filter(isError);
            // 예전 모양: window.apRenderDiagnostics는 표식으로 바꾼 것(오류)만, 알림(칸 넘침·HTML 짝)은 apRenderReport에만 있다.
            root.apRenderDiagnostics = errors;
            root.apRenderReport = report(entries);
            root.apRenderReportText = () => reportText();
            doc.documentElement.dataset.apRenderDiagnostics = String(errors.length);
            doc.documentElement.dataset.apRenderWarnings = String(entries.length - errors.length);
            renderNotice(doc, area, pairs);
            return errors;
        } catch (error) {
            console.warn('[archive-render-diagnostics] publish failed', error);
            return [];
        }
    }

    // ---- HTML 태그 짝 점검(알림만) --------------------------------------------------------------------------------------------------
    // 브라우저는 안 닫힌 태그를 상자 끝에서 자동으로 닫고 짝 없는 닫는 태그는 버리므로 한 문항의 태그 오류가 이웃 문항으로 번지지는 않는다(문항 상자는 DOM 경계).
    // 그래도 그 문항이 의도와 다르게 그려질 수 있어 "어느 문항인지"만 알린다. 수식($..$, \(..\), \[..\])·주석·svg 안의 글자는 보지 않고,
    // 속성이 정상 모양인 알려진 HTML 태그만 센다(수식 없는 `a<b` 같은 부등호 글자를 태그로 오인하지 않기 위해). 자동으로 닫히는 태그(p·li·td 등)는 세지 않는다.
    const VOID_TAGS = new Set(['br', 'hr', 'img', 'input', 'meta', 'link', 'col', 'wbr', 'source', 'area', 'base', 'embed', 'param', 'track']);
    const OPTIONAL_CLOSE = new Set(['p', 'li', 'td', 'th', 'tr', 'dd', 'dt', 'option', 'thead', 'tbody', 'tfoot', 'colgroup']);
    const KNOWN_TAGS = new Set('div span b i u s em strong sub sup table thead tbody tfoot tr td th p ul ol li center font small big mark code pre blockquote a h1 h2 h3 h4 h5 h6 label caption'.split(' '));
    const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)(?:\s+[a-zA-Z_:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*\s*(\/?)>/g;
    function htmlBalance(html) {
        const text = String(html == null ? '' : html)
            .replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/g, ' ')
            .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
        const stack = [], unclosed = [], stray = [];
        TAG_RE.lastIndex = 0;
        for (let match; (match = TAG_RE.exec(text));) {
            const name = match[2].toLowerCase();
            if (!KNOWN_TAGS.has(name) || VOID_TAGS.has(name) || match[3] === '/') continue;
            if (!match[1]) { stack.push(name); continue; }
            const at = stack.lastIndexOf(name);
            if (at < 0) { if (!OPTIONAL_CLOSE.has(name)) stray.push(name); continue; }
            for (const skipped of stack.splice(at)) if (skipped !== name && !OPTIONAL_CLOSE.has(skipped)) unclosed.push(skipped);
        }
        for (const left of stack) if (!OPTIONAL_CLOSE.has(left)) unclosed.push(left);
        return { ok: !unclosed.length && !stray.length, unclosed, stray };
    }
    // 문항 상자에 짝이 안 맞는 태그가 있으면 data-ap-html-warn(예: "div 안 닫힘, b 짝 없음")만 단다. 그림·글자는 바꾸지 않는다(출력 불변). 예외를 던지지 않는다.
    function noteHtml(box, parts) {
        try {
            if (!box?.setAttribute) return false;
            const notes = [];
            for (const value of Array.isArray(parts) ? parts : [parts]) {
                const found = htmlBalance(Array.isArray(value) ? value.join('\n') : value);
                found.unclosed.forEach(name => notes.push(name + ' 안 닫힘'));
                found.stray.forEach(name => notes.push(name + ' 닫는 태그만 있음'));
            }
            if (!notes.length) return false;
            box.setAttribute('data-ap-html-warn', Array.from(new Set(notes)).slice(0, 4).join(', '));
            return true;
        } catch (error) { return false; }
    }

    // ---- 자리 표시: 사다리 뒤에도 안 들어가는 문항 하나------------------------------------------------------------------------------
    // box: .q-box / .sol-box. 번호(.q-num)만 남기고 본문을 "너무 길어 담지 못했습니다" 상자로 바꾼다. 칸·번호·순서는 그대로다.
    const unfitUndo = new WeakMap();
    function restoreUnfit(box) {
        const undo = unfitUndo.get(box);
        if (!undo) return false;
        unfitUndo.delete(box);
        try { undo(); return true; } catch (error) { return false; }
    }
    function replaceUnfit(box, info = {}) {
        try {
            if (!box?.querySelector || (box.hasAttribute('data-ap-unfit') && !info.force)) return false;
            const doc = ownerDocument(box);
            ensureStyle(doc);
            const host = box.querySelector(':scope > .ap-slot-content') || box;
            const note = doc.createElement('div');
            note.className = 'ap-unfit tex2jax_ignore';
            note.setAttribute('role', 'note');
            note.textContent = UNFIT_MESSAGE + '. 원본 시험지에서 확인하세요.';
            // info.target: 상자 전체가 아니라 그 부분(예: 해설지의 문제 다시보기)만 자리 표시로 바꾼다.
            const part = info.target ? box.querySelector(info.target) : null;
            const excerpt = clip((part || host).textContent, 80);
            // 쪽 넘침이 이 문항 탓이 아니었을 때 되돌릴 수 있게 바꾸기 전 상태를 보관한다(restoreUnfit).
            const before = { children: part ? null : Array.from(host.childNodes), part, hostStyle: host !== box ? { zoom: host.style.zoom, transform: host.style.transform, fit: host.getAttribute('data-equal-slot-fit'), scale: host.getAttribute('data-equal-slot-scale') } : null,
                unfit: box.getAttribute('data-ap-unfit'), unfitExcerpt: box.getAttribute('data-ap-unfit-excerpt'), overflow: box.getAttribute('data-layout-overflow') };
            unfitUndo.set(box, () => {
                if (before.part) note.replaceWith(before.part); else host.replaceChildren(...before.children);
                for (const [name, value] of [['data-ap-unfit', before.unfit], ['data-ap-unfit-excerpt', before.unfitExcerpt], ['data-layout-overflow', before.overflow]]) {
                    if (value == null) box.removeAttribute(name); else box.setAttribute(name, value);
                }
                if (before.hostStyle) {
                    host.style.zoom = before.hostStyle.zoom; host.style.transform = before.hostStyle.transform;
                    for (const [name, value] of [['data-equal-slot-fit', before.hostStyle.fit], ['data-equal-slot-scale', before.hostStyle.scale]]) {
                        if (value == null) host.removeAttribute(name); else host.setAttribute(name, value);
                    }
                }
            });
            if (part) part.replaceWith(note);
            else {
                const number = host.querySelector(':scope > .q-num');
                host.replaceChildren(...(number ? [number.cloneNode(true)] : []), note);
            }
            box.setAttribute('data-ap-unfit', String(info.reason || 'height'));
            box.setAttribute('data-ap-unfit-excerpt', excerpt);
            box.removeAttribute('data-layout-overflow');
            if (host !== box) {
                host.style.zoom = '1';
                host.style.transform = 'none';
                try {
                    const fit = JSON.parse(host.getAttribute('data-equal-slot-fit') || 'null');
                    if (fit) host.setAttribute('data-equal-slot-fit', JSON.stringify({ ...fit, scale: 1, offsetX: 0, offsetY: 0 }));
                    host.setAttribute('data-equal-slot-scale', '1');
                } catch (error) { /* 맞춤 기록이 없으면 건드리지 않는다 */ }
            }
            return true;
        } catch (error) {
            console.warn('[archive-render-diagnostics] replaceUnfit failed', error);
            return false;
        }
    }

    // 쪽이 얼마나 넘치는가(0이면 안 넘침). 기준은 두 게이트의 합집합이다: 공통 게이트 S12(snapshot-contract: body 세로 +2, 가로 +1)와 인쇄 사전 점검
    // (archive2-pdf-readiness.assertLayoutReady: 쪽 +3, 잘림 요소 +3). S12가 더 엄격해서 둘 중 하나라도 걸리면 넘침으로 본다(둘 다 통과해야 출력이 막히지 않는다).
    // 반환값은 허용 오차를 뺀 가장 큰 넘침(px)이라 "바꾼 뒤 줄었는가"를 비교하는 데도 쓴다.
    function pageExcess(page) {
        const body = page.querySelector?.('.page-body');
        let excess = Math.max(page.scrollHeight - page.clientHeight - 3, page.scrollWidth - page.clientWidth - 3);
        if (body) excess = Math.max(excess, body.scrollHeight - body.clientHeight - 2, body.scrollWidth - body.clientWidth - 1);
        const view = ownerDocument(page).defaultView || root;
        const clips = value => value === 'hidden' || value === 'clip';
        // readiness는 쪽 안 모든 요소를 보지만, 잘림은 칸·상자에서 생기므로 그 요소들만 본다(비용).
        for (const element of Array.from(page.querySelectorAll('.grid-col,.grid-container,.page-body,.q-box,.sol-box,.ap-slot-content'))) {
            const tall = element.scrollHeight - element.clientHeight - 3, wide = element.scrollWidth - element.clientWidth - 3;
            if (tall <= 0 && wide <= 0) continue;
            const style = view.getComputedStyle(element);
            if (wide > 0 && clips(style.overflowX)) excess = Math.max(excess, wide);
            if (tall > 0 && clips(style.overflowY)) excess = Math.max(excess, tall);
        }
        return Math.max(0, excess);
    }
    const pageOverflows = page => pageExcess(page) > 0;
    // 넘치는 쪽의 범인(칸을 넘치게 만든 가장 큰 문항)을 골라 자리 표시로 바꾼다. 쪽당 상자 수만큼만 반복해 끝난다.
    // 바꾼 뒤에도 넘침이 줄지 않으면 그 문항 탓이 아니다(머리글·QR 등 문항 밖 요소): 되돌리고 거기서 멈춰, 문항을 더 지우지 않고 쪽 넘침만 진단으로 남긴다.
    function guardOverflow(scope) {
        const replaced = [];
        try {
            const area = scope || root.document?.getElementById('print-area');
            if (!area?.querySelectorAll) return replaced;
            const pages = Array.from(area.querySelectorAll('.page'));
            pages.forEach((page, pageIndex) => {
                const limit = page.querySelectorAll('.q-box,.sol-box').length;
                let before = pageExcess(page);
                for (let step = 0; step < limit && before > 0; step += 1) {
                    const candidates = Array.from(page.querySelectorAll('.q-box,.sol-box')).filter(box => !box.hasAttribute('data-ap-unfit') && !box.parentElement?.closest('.q-box,.sol-box'));
                    const flagged = candidates.filter(box => box.getAttribute('data-layout-overflow') === '1');
                    const pool = flagged.length ? flagged : candidates;
                    const culprit = pool.sort((a, b) => b.getBoundingClientRect().height - a.getBoundingClientRect().height)[0];
                    if (!culprit || !replaceUnfit(culprit, { reason: 'page-overflow' })) break;
                    const after = pageExcess(page);
                    if (after >= before) {
                        restoreUnfit(culprit);
                        page.setAttribute('data-ap-page-overflow', String(pageIndex + 1));
                        console.warn('[archive-layout] PAGE_OVERFLOW_NOT_QUESTION: 문항을 바꿔도 쪽 넘침이 줄지 않아 되돌렸습니다', { page: pageIndex + 1, excessPx: before });
                        break;
                    }
                    replaced.push(culprit);
                    before = after;
                }
            });
            if (replaced.length) console.warn('[archive-layout] LAYOUT_CANNOT_FIT: 쪽을 넘치게 하는 문항을 자리 표시로 바꿨습니다', replaced.map(box => (box.querySelector('.q-num')?.textContent || '').trim()));
        } catch (error) {
            console.warn('[archive-render-diagnostics] guardOverflow failed', error);
        }
        return replaced;
    }

    return Object.freeze({ sanitize, replaceImage, replaceUnfit, restoreUnfit, guardOverflow, htmlBalance, noteHtml, pageOverflows, pageExcess, collect, report, reportText, publish, textWithoutMarks, leftoverCount, codeInfo, CODES, MARK, IMAGE_MARK });
}));
