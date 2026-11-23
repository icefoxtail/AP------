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
    const ALL_MARKS = MARK + ',' + IMAGE_MARK;
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
    function describe(node) {
        const box = boxOf(node);
        const isImage = node.hasAttribute('data-ap-image-error');
        const ref = box?.getAttribute('data-source-ref') || node.closest('[data-source-ref]')?.getAttribute('data-source-ref') || '';
        const file = (ref.split('#')[0] || String(root.AppState?.sourceArchiveFile || ''));
        const entry = {
            file,
            questionNo: questionNoOf(box),
            part: isImage ? imagePartOf(node) : (node === box ? '' : partOf(node)),
            code: node.getAttribute('data-ap-math-error') || node.getAttribute('data-ap-image-error') || 'MATH_TYPESET_ERROR',
            excerpt: node.getAttribute('data-ap-math-excerpt') || node.getAttribute('data-ap-image-excerpt') || ''
        };
        // 여러 학생·여러 원본 시험이 섞이는 화면(오답 인쇄)만 상자에 적어 둔 학생·원본 문항 번호가 더 붙는다. 없으면 기존 모양 그대로.
        const student = box?.getAttribute?.('data-ap-diag-student');
        if (student) entry.student = student;
        const sourceNo = box?.getAttribute?.('data-ap-diag-src-no');
        if (sourceNo) entry.sourceNo = /^\d+$/.test(sourceNo) ? Number(sourceNo) : sourceNo;
        return entry;
    }
    function collect(scope) {
        const area = scope || root.document?.getElementById('print-area');
        if (!area?.querySelectorAll) return [];
        return Array.from(area.querySelectorAll(ALL_MARKS)).map(describe);
    }

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

    function renderNotice(doc, area, entries) {
        let bar = doc.getElementById(NOTICE_ID);
        if (!entries.length || !noticeVisible(doc)) {
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
        // 문항 번호·위치별로 묶는다(같은 문항의 같은 위치에 둘 이상이면 "N개").
        const groups = [];
        const nodes = Array.from(area.querySelectorAll(ALL_MARKS));
        entries.forEach((entry, index) => {
            const key = [entry.student || '', entry.file || '', entry.sourceNo ?? '', entry.questionNo, entry.part].join('|');
            let group = groups.find(item => item.key === key);
            if (!group) { group = { key, entry, node: nodes[index], count: 0 }; groups.push(group); }
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
        if (groups.length === 1) {
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
    }

    // 렌더가 확정될 때(apRenderReady 직전) 부른다. 예외를 던지지 않는다.
    function publish(scope) {
        try {
            const doc = root.document;
            const area = scope || doc.getElementById('print-area');
            const entries = collect(area);
            root.apRenderDiagnostics = entries;
            doc.documentElement.dataset.apRenderDiagnostics = String(entries.length);
            renderNotice(doc, area, entries);
            return entries;
        } catch (error) {
            console.warn('[archive-render-diagnostics] publish failed', error);
            return [];
        }
    }

    return Object.freeze({ sanitize, replaceImage, collect, publish, textWithoutMarks, leftoverCount, MARK, IMAGE_MARK });
}));
