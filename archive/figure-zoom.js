(function attachFigureZoom(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APFigureZoom = api;
    if (root && root.document && api.isStudentContext(root.location)) api.start(root.document);
})(typeof window !== 'undefined' ? window : globalThis, function createFigureZoom(root) {
    'use strict';

    // 그림 눌러서 크게 보기 (2026-11-24 원장님 결정: "애들이 패드나 핸드폰에서 그림을 확대할 수 있으니까").
    // 문제·해설 그림은 2단 시험지 배치에 맞춰 단 폭의 일부로 줄여 그려서 휴대폰에서 그림 속 글자가 작다. 학생 화면에서 그림을 누르면
    // 화면을 덮는 층에 같은 그림을 크게 띄운다(SVG는 같은 src를 큰 폭으로 그려 벡터 그대로 커진다).
    // 학생 화면에서만 켜진다: 주소에 studentReview=1(포털이 여는 engine.html·mixed_engine.html) 이거나 학생 포털(/apmath/student/) 안.
    // 선생님의 출력·미리보기·인쇄·PDF 화면에서는 이 파일이 아무것도 하지 않는다(안 불러도, 불러도 같다).
    // "크게" 표시는 그림 옆 DOM이 아니라 body 끝의 층 하나에 모아 둔다: 쪽 배치 계산(문항 칸 높이 측정)과 래스터 인쇄(쪽별 캡처)에 닿지 않는다.
    const SIZE = 32;
    const MARGIN = 4;
    const MIN_WIDTH = 40;
    const MIN_HEIGHT = 24;
    const SVG_INLINE = 'svg:not(mjx-container svg, .katex svg, svg svg)';
    // 그림이 들어갈 수 있는 자리(archive/figure-size.js의 SCOPES와 같은 범위). 숨은 측정 칸(#staging)은 #print-area 밖이라 제외된다.
    const SCOPES = ['.q-content', '.q-image-wrap', '[data-semantic-content="1"]', '.choices', '.sol-image-wrap', '.sol-exp', '.sol-chunk'];
    const ENGINE_SELECTOR = SCOPES.map(scope => `#print-area ${scope} img, #print-area ${scope} ${SVG_INLINE}`).join(', ');
    const PORTAL_SELECTOR = `.ss-card img, .ss-card ${SVG_INLINE}`;
    const FIGURE_SELECTOR = `${ENGINE_SELECTOR}, ${PORTAL_SELECTOR}`;
    const SOLUTION_SCOPE = '.sol-image-wrap, .sol-exp, .sol-chunk, .ss-solution';
    const LABEL_OPEN = '그림 크게 보기';
    const LABEL_CLOSE = '닫기';

    // 학생 화면인지. archive-asset-base.js의 isStudentPage와 같은 두 신호다.
    function isStudentContext(location) {
        if (!location) return false;
        if (/\/apmath\/student\//i.test(String(location.pathname || ''))) return true;
        try { return new URLSearchParams(location.search || '').get('studentReview') === '1'; } catch (error) { return false; }
    }

    // 그림 역할: 선택지 안 / 해설 / 문제.
    function roleOf(element) {
        if (!element || typeof element.closest !== 'function') return 'problem';
        if (element.closest('.choices')) return 'choice';
        if (element.closest(SOLUTION_SCOPE)) return 'solution';
        return 'problem';
    }

    // 클릭한 곳에서 그림 요소(img 또는 가장 바깥 인라인 svg)를 찾는다. 수식 svg(MathJax·KaTeX)는 그림이 아니다.
    function figureFrom(target) {
        let node = target && target.nodeType === 1 ? target : target && target.parentElement;
        let found = null;
        while (node && node.nodeType === 1) {
            const tag = String(node.tagName || '').toLowerCase();
            if (tag === 'mjx-container' || (node.classList && node.classList.contains('katex'))) return null;
            if (tag === 'img') { found = node; break; }
            if (tag === 'svg') found = node;
            node = node.parentElement;
        }
        if (!found) return null;
        return typeof found.matches === 'function' && found.matches(FIGURE_SELECTOR) ? found : null;
    }

    // 큰 그림의 칸 안에서 크기. 비율 ratio(폭/높이)를 지키며 칸에 꽉 차게. 래스터는 원본의 2배까지만(더 키워도 흐려질 뿐).
    function fitSize(box, ratio, rasterNaturalWidth) {
        const width = Number(box && box.width) || 0;
        const height = Number(box && box.height) || 0;
        const r = Number(ratio) > 0 ? Number(ratio) : 1;
        if (width <= 0 || height <= 0) return { width: 0, height: 0 };
        let w = Math.min(width, height * r);
        if (Number(rasterNaturalWidth) > 0) w = Math.min(w, Number(rasterNaturalWidth) * 2);
        return { width: Math.floor(w), height: Math.floor(w / r) };
    }

    // ---------- "그림이 이상해요" 신고 (2026-11-24 원장님 결정) ----------
    // 학생이 크게 보는 화면에서 사유 선택지로 알린다. 자유 글은 받지 않고, 학생 이름·id·기기 정보는 보내지 않는다(학생 로그인 확인용 id·토큰만
    // 보내고 서버는 저장하지 않는다: apmath/worker-backup/worker/helpers/figure-reports.js). 같은 그림은 이 기기에서 한 번만 보낸다.
    const REPORT_API = 'https://ap-math-os-v2612.js-pdf.workers.dev/api';
    const SESSION_KEY = 'APMATH_STUDENT_PORTAL_SESSION';
    const SENT_KEY = 'ap.figureReports.sent.v1';
    const SENT_MAX = 500;
    const REASONS = [
        ['not_visible', '그림이 안 보여요'],
        ['text_unreadable', '글자·숫자가 안 읽혀요'],
        ['mismatch', '그림이 문제와 달라요'],
        ['missing_parts', '선이나 점이 빠진 것 같아요'],
        ['other', '기타'],
    ];
    const TEXT_REPORT = '그림이 이상해요';
    const TEXT_THANKS = '알려 줘서 고마워요';
    const TEXT_SENT = '이미 알려 주셨어요';
    const TEXT_FAIL = '지금은 보낼 수 없어요';
    const TEXT_LIMIT = '오늘은 더 보낼 수 없어요';

    // 그림 src를 사이트 기준 상대 경로(assets/images/<폴더>/<파일>)로. R2 주소(.../exams/images/<폴더>/<파일>)도 같은 경로로 돌린다. 인라인 svg·알 수 없으면 ''.
    function figurePathOf(src) {
        let pathname = '';
        try { pathname = decodeURIComponent(new URL(String(src || ''), 'http://x.invalid/').pathname); } catch (error) { return ''; }
        if (!pathname || /^data:/i.test(String(src || ''))) return '';
        const r2 = /\/exams\/images\/(.+)$/.exec(pathname);
        if (r2) return `assets/images/${r2[1]}`;
        const own = /\/(assets\/.+)$/.exec(pathname);
        return own ? own[1] : '';
    }

    // data-source-ref("<시험지 파일>#<문항 uid>") -> 서버에 보낼 문항 식별. uid가 "legacy:<파일>#ordinal:<n>"이면 uid 없이 파일+번호.
    function questionOf(sourceRef, numberText) {
        const ref = String(sourceRef || '');
        const cut = ref.indexOf('#');
        if (cut < 0) return { uid: '', file: '', no: 0 };
        const file = ref.slice(0, cut).trim();
        const uid = ref.slice(cut + 1).trim();
        const ordinal = /^legacy:.*#ordinal:(\d+)$/.exec(uid);
        if (ordinal) return { uid: '', file, no: Number(ordinal[1]) };
        const shown = parseInt(String(numberText || ''), 10);
        return { uid, file, no: Number.isInteger(shown) && shown > 0 && shown <= 1000 ? shown : 0 };
    }

    // 화면 종류: 포털 자습 / 유사문항 / 포털이 낸 시험지 / 원본 열기.
    function screenKind(location) {
        if (/\/apmath\/student\//i.test(String(location && location.pathname || ''))) return 'self_study';
        let params = null;
        try { params = new URLSearchParams(location.search || ''); } catch (error) { return 'original'; }
        if (/(^|\/)similar\//.test(params.get('data') || '')) return 'similar';
        if (params.get('assignmentId') || params.get('originalSnapshot') || params.get('studio') === '1' || params.get('key')) return 'exam';
        return 'original';
    }

    function widthBucket(width) {
        const w = Number(width) || 0;
        return w < 480 ? 'xs' : w < 768 ? 'sm' : w < 1100 ? 'md' : 'lg';
    }

    // 신고 한 건의 본문(사유 제외 필드). 문항을 알 수 없으면 null: 보낼 수 없는 그림이다.
    function describe(figure, location, viewportWidth) {
        if (!figure || typeof figure.closest !== 'function') return null;
        let question = { uid: '', file: '', no: 0 };
        const card = figure.closest('.ss-card');
        if (card) question = { uid: String(card.getAttribute('data-uid') || '').trim(), file: '', no: 0 };
        else {
            const box = figure.closest('[data-source-ref]');
            const num = box && box.querySelector ? box.querySelector('.q-num') : null;
            question = questionOf(box && box.getAttribute('data-source-ref'), num && num.textContent);
        }
        if (!question.uid && !(question.file && question.no > 0)) return null;
        const isImg = String(figure.tagName).toLowerCase() === 'img';
        return {
            question_uid: question.uid,
            archive_file: question.file,
            question_no: question.no,
            figure_path: isImg ? figurePathOf(figure.getAttribute('src')) : '',
            role: roleOf(figure),
            screen: screenKind(location),
            width_bucket: widthBucket(viewportWidth),
        };
    }

    function sentKeyOf(info) {
        return [info.question_uid || `${info.archive_file}#${info.question_no}`, info.figure_path, info.role].join('|');
    }

    function readSentList(storage) {
        try {
            const list = JSON.parse(storage.getItem(SENT_KEY));
            return Array.isArray(list) ? list.filter(item => typeof item === 'string') : [];
        } catch (error) { return []; }
    }

    function markSent(storage, key) {
        try {
            const list = readSentList(storage).filter(item => item !== key);
            list.push(key);
            storage.setItem(SENT_KEY, JSON.stringify(list.slice(-SENT_MAX)));
        } catch (error) { /* 저장 공간이 막혀도 신고 자체는 이미 갔다 */ }
    }

    function isSent(storage, key) {
        return readSentList(storage).includes(key);
    }

    // 로그인한 학생의 세션(포털이 저장해 둔 값). 선생님 미리보기이거나 없으면 null: 신고 단추를 보이지 않는다.
    function studentCredentials(location, storage) {
        try {
            const params = new URLSearchParams(location.search || '');
            if (params.get('teacher_preview') === '1' || /teacher_preview=1/.test(params.get('studentReturnTo') || '')) return null;
            const saved = JSON.parse(storage.getItem(SESSION_KEY));
            const id = String(saved && saved.student_id || '').trim();
            const token = String(saved && saved.student_token || '').trim();
            return id && token ? { student_id: id, student_token: token } : null;
        } catch (error) { return null; }
    }

    // 개발 확인용: 이 화면이 localhost에서 열렸을 때만 ?figureReportApi=http://127.0.0.1:<port>/api 로 로컬 Worker를 가리킬 수 있다. 운영에서는 항상 기본 주소.
    function reportApiBase(location) {
        try {
            if (/^(localhost|127\.0\.0\.1)$/.test(String(location.hostname || ''))) {
                const custom = new URLSearchParams(location.search || '').get('figureReportApi') || '';
                if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/api$/.test(custom)) return custom;
            }
        } catch (error) { /* 기본 주소 */ }
        return REPORT_API;
    }

    function start(doc) {
        const win = doc.defaultView || root;
        if (!doc || !doc.body && doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', () => start(doc), { once: true });
            return null;
        }
        if (doc.documentElement.hasAttribute('data-ap-fz')) return null;
        doc.documentElement.setAttribute('data-ap-fz', '1');
        doc.documentElement.classList.add('ap-fz-on');

        const badges = new Map(); // 그림 -> 단추
        let layer = null;
        let dialog = null;
        let scanTimer = 0;
        let frame = 0;
        let session = null;

        function ensureLayer() {
            if (layer && layer.isConnected) return layer;
            layer = doc.createElement('div');
            layer.className = 'ap-fz-layer';
            layer.setAttribute('data-ap-fz-layer', '');
            (doc.body || doc.documentElement).appendChild(layer);
            return layer;
        }

        function magnifier() {
            return '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false"><circle cx="10" cy="10" r="6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15 15l5 5M10 7v6M7 10h6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
        }

        function makeBadge(figure) {
            const button = doc.createElement('button');
            button.type = 'button';
            button.className = 'ap-fz-badge';
            button.setAttribute('aria-label', LABEL_OPEN);
            button.title = LABEL_OPEN;
            button.innerHTML = magnifier();
            button.addEventListener('click', event => {
                event.preventDefault();
                event.stopPropagation();
                open(figure, button);
            });
            return button;
        }

        function visibleRect(figure) {
            if (!figure.isConnected) return null;
            const rect = figure.getBoundingClientRect();
            return rect.width >= MIN_WIDTH && rect.height >= MIN_HEIGHT ? rect : null;
        }

        function place() {
            frame = 0;
            const host = ensureLayer();
            const origin = host.getBoundingClientRect();
            for (const [figure, button] of badges) {
                const rect = visibleRect(figure);
                if (!rect) { button.style.display = 'none'; continue; }
                button.style.display = '';
                button.style.left = `${Math.round(rect.right - origin.left - SIZE - MARGIN)}px`;
                button.style.top = `${Math.round(rect.top - origin.top + MARGIN)}px`;
            }
        }

        function schedulePlace() {
            if (frame) return;
            frame = (win.requestAnimationFrame || (fn => win.setTimeout(fn, 16)))(place);
        }

        function scan() {
            scanTimer = 0;
            const host = ensureLayer();
            const present = new Set(doc.querySelectorAll(FIGURE_SELECTOR));
            for (const [figure, button] of badges) {
                if (!present.has(figure) || !figure.isConnected) { button.remove(); badges.delete(figure); }
            }
            for (const figure of present) {
                if (badges.has(figure)) continue;
                const button = makeBadge(figure);
                host.appendChild(button);
                badges.set(figure, button);
            }
            place();
        }

        function scheduleScan() {
            // 수식 조판처럼 변경이 쏟아지는 동안에는 미루고, 잠잠해진 뒤 한 번만 훑는다.
            if (scanTimer) win.clearTimeout(scanTimer);
            scanTimer = win.setTimeout(scan, 300);
        }

        // ---------- 크게 보기 층 ----------
        function focusables() {
            return dialog ? Array.from(dialog.querySelectorAll('button:not([disabled]), [tabindex="0"]')).filter(item => !item.closest('[hidden]')) : [];
        }

        function stageBox(stage) {
            const style = win.getComputedStyle(stage);
            return {
                width: stage.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0),
                height: stage.clientHeight - (parseFloat(style.paddingTop) || 0) - (parseFloat(style.paddingBottom) || 0),
            };
        }

        // 큰 그림의 비율: 래스터·SVG 파일은 불러온 뒤의 자연 크기, 아직 없거나 0이면 쪽 안 그림에서 읽어 둔 비율(ratioHint), 인라인 svg는 viewBox.
        function sizeLarge(stage, built) {
            const large = built.node;
            const isImage = String(large.tagName).toLowerCase() === 'img';
            const natural = isImage ? { width: large.naturalWidth || 0, height: large.naturalHeight || 0 } : svgNatural(large);
            const ratio = natural.width > 0 && natural.height > 0 ? natural.width / natural.height : (built.ratioHint > 0 ? built.ratioHint : 1);
            const box = stageBox(stage);
            // 그림 둘레 흰 판(.ap-fz-figure의 안쪽 여백 2px x 2)만큼 뺀다.
            const size = fitSize({ width: box.width - 4, height: box.height - 4 }, ratio, built.raster ? natural.width : 0);
            if (size.width > 0) {
                large.style.width = `${size.width}px`;
                large.style.height = `${size.height}px`;
            }
        }

        function svgNatural(svg) {
            const viewBox = String(svg.getAttribute && svg.getAttribute('viewBox') || '').trim().split(/[\s,]+/).map(Number);
            if (viewBox.length === 4 && viewBox[2] > 0 && viewBox[3] > 0) return { width: viewBox[2], height: viewBox[3] };
            return { width: parseFloat(svg.getAttribute && svg.getAttribute('width')) || 0, height: parseFloat(svg.getAttribute && svg.getAttribute('height')) || 0 };
        }

        function buildLarge(figure) {
            if (String(figure.tagName).toLowerCase() === 'img') {
                const image = doc.createElement('img');
                const cors = figure.getAttribute('crossorigin');
                if (cors !== null) image.setAttribute('crossorigin', cors);
                image.alt = figure.getAttribute('alt') || '문제 그림';
                image.src = figure.currentSrc || figure.getAttribute('src') || '';
                // 확대할 그림이 파일이면 SVG(벡터)와 래스터를 가른다: 같은 src를 큰 폭으로 다시 그리는 것이라 SVG는 선명하게 커진다.
                const src = String(image.src).split(/[?#]/)[0].toLowerCase();
                const rect = figure.getBoundingClientRect();
                const hint = figure.naturalWidth > 0 && figure.naturalHeight > 0 ? figure.naturalWidth / figure.naturalHeight : (rect.height > 0 ? rect.width / rect.height : 0);
                return { node: image, raster: !(src.endsWith('.svg') || /^data:image\/svg\+xml/i.test(String(image.src))), ratioHint: hint };
            }
            const clone = figure.cloneNode(true);
            for (const name of ['data-ap-fig', 'class', 'style', 'width', 'height', 'id']) clone.removeAttribute(name);
            if (!clone.getAttribute('viewBox')) {
                const natural = svgNatural(figure);
                if (natural.width > 0 && natural.height > 0) clone.setAttribute('viewBox', `0 0 ${natural.width} ${natural.height}`);
            }
            clone.setAttribute('role', 'img');
            if (!clone.getAttribute('aria-label')) clone.setAttribute('aria-label', figure.getAttribute('aria-label') || '문제 그림');
            return { node: clone, raster: false };
        }

        function open(figure, opener) {
            if (dialog || !figure) return;
            const built = buildLarge(figure);
            const lastFocus = opener || badges.get(figure) || doc.activeElement;
            dialog = doc.createElement('div');
            dialog.className = 'ap-fz-dialog';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            dialog.setAttribute('aria-label', LABEL_OPEN);
            dialog.innerHTML = `<div class="ap-fz-bar"><span class="ap-fz-title">${LABEL_OPEN}</span><span class="ap-fz-extra"></span><button type="button" class="ap-fz-close" aria-label="${LABEL_CLOSE}">${LABEL_CLOSE}</button></div><div class="ap-fz-stage" tabindex="0"><div class="ap-fz-figure"></div></div>`;
            const stage = dialog.querySelector('.ap-fz-stage');
            const holder = dialog.querySelector('.ap-fz-figure');
            holder.appendChild(built.node);
            built.node.classList.add('ap-fz-large');
            (doc.body || doc.documentElement).appendChild(dialog);

            const html = doc.documentElement;
            const scrollX = win.pageXOffset || 0;
            const scrollY = win.pageYOffset || 0;
            html.classList.add('ap-fz-lock');

            const fit = () => sizeLarge(stage, built);
            if (!(built.node.naturalWidth > 0) && String(built.node.tagName).toLowerCase() === 'img') built.node.addEventListener('load', fit, { once: true });
            fit();

            let pushed = false;
            try { win.history.pushState({ apFigureZoom: true }, ''); pushed = true; } catch (error) { pushed = false; }
            session = { figure, lastFocus, scrollX, scrollY, pushed, fit, closing: false };

            dialog.addEventListener('click', event => {
                if (event.target.closest('.ap-fz-close')) { requestClose(); return; }
                // 그림 바깥(검은 바탕)을 누르면 닫힌다. 그림을 누르는 것은 닫지 않는다(두 손가락 확대·끌기와 겹치지 않게).
                if (!event.target.closest('.ap-fz-large, .ap-fz-bar, .ap-fz-sheet')) requestClose();
            });
            dialog.setAttribute('data-ap-fz-open', '1');
            setupReport(figure);
            const closeButton = dialog.querySelector('.ap-fz-close');
            if (closeButton) closeButton.focus({ preventScroll: true });
            try { doc.dispatchEvent(new win.CustomEvent('ap-figure-zoom-open', { detail: { figure, dialog } })); } catch (error) { /* 알림 실패는 확대와 무관 */ }
        }

        function storageOf() {
            try { return win.localStorage || null; } catch (error) { return null; }
        }

        // 크게 보기 층 안의 "그림이 이상해요": 단추 -> 사유 선택지(자유 글 없음) -> 고르면 바로 전송. 로그인한 학생이고 문항을 알 수 있을 때만 보인다.
        function setupReport(figure) {
            const info = describe(figure, win.location, win.innerWidth);
            const storage = storageOf();
            const creds = info && storage ? studentCredentials(win.location, storage) : null;
            if (!info || !creds) return;
            const key = sentKeyOf(info);
            const extra = dialog.querySelector('.ap-fz-extra');
            const button = doc.createElement('button');
            button.type = 'button';
            button.className = 'ap-fz-report';
            const sheet = doc.createElement('div');
            sheet.className = 'ap-fz-sheet';
            sheet.hidden = true;
            sheet.setAttribute('role', 'group');
            sheet.setAttribute('aria-label', '어떤 점이 이상한가요?');
            sheet.innerHTML = `<p class="ap-fz-sheet-title">어떤 점이 이상한가요?</p><div class="ap-fz-reasons">${REASONS.map(([code, label]) => `<button type="button" class="ap-fz-reason" data-reason="${code}">${label}</button>`).join('')}</div><p class="ap-fz-note" role="status" aria-live="polite"></p>`;
            const note = sheet.querySelector('.ap-fz-note');
            const reasons = Array.from(sheet.querySelectorAll('.ap-fz-reason'));
            const markSentState = () => {
                button.textContent = TEXT_SENT;
                button.disabled = true;
                button.setAttribute('data-sent', '1');
            };
            if (isSent(storage, key)) markSentState();
            else button.textContent = TEXT_REPORT;
            // 선택지가 그림을 가리지 않게, 열려 있는 동안 그림 칸 아래에 선택지 높이만큼 여백을 둔다(그림은 위로 끌어 올려 볼 수 있다).
            const stageEl = dialog.querySelector('.ap-fz-stage');
            const reserve = () => { stageEl.style.paddingBottom = sheet.hidden ? '' : `${sheet.offsetHeight + 12}px`; };
            button.addEventListener('click', () => {
                sheet.hidden = !sheet.hidden;
                button.setAttribute('aria-expanded', String(!sheet.hidden));
                reserve();
                if (!sheet.hidden && reasons[0]) reasons[0].focus({ preventScroll: true });
            });
            button.setAttribute('aria-expanded', 'false');
            extra.appendChild(button);
            dialog.appendChild(sheet);

            async function send(code) {
                reasons.forEach(item => { item.disabled = true; });
                note.textContent = '보내는 중…';
                let message = TEXT_FAIL;
                let done = false;
                try {
                    const controller = typeof win.AbortController === 'function' ? new win.AbortController() : null;
                    const timer = controller ? win.setTimeout(() => controller.abort(), 10000) : 0;
                    const response = await win.fetch(`${reportApiBase(win.location)}/student-portal/figure-report`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...creds, ...info, reason_code: code }),
                        ...(controller ? { signal: controller.signal } : {}),
                    });
                    if (timer) win.clearTimeout(timer);
                    let body = null;
                    try { body = await response.json(); } catch (error) { body = null; }
                    if (response.ok && body && body.ok === true) { done = true; message = TEXT_THANKS; }
                    else if (response.status === 429 || (body && body.code === 'DAILY_LIMIT')) message = TEXT_LIMIT;
                } catch (error) { /* 네트워크 실패·옛 Worker(404)는 같은 문구 */ }
                note.textContent = message;
                if (done) {
                    markSent(storage, key);
                    markSentState();
                    sheet.querySelector('.ap-fz-reasons').hidden = true;
                    sheet.querySelector('.ap-fz-sheet-title').hidden = true;
                    reserve();
                    const closeButton = dialog && dialog.querySelector('.ap-fz-close');
                    if (closeButton) closeButton.focus({ preventScroll: true });
                } else reasons.forEach(item => { item.disabled = false; });
            }
            reasons.forEach(item => item.addEventListener('click', () => send(item.getAttribute('data-reason'))));
        }

        function cleanup() {
            if (!dialog) return;
            const state = session;
            dialog.remove();
            dialog = null;
            session = null;
            doc.documentElement.classList.remove('ap-fz-lock');
            if (state) {
                try { win.scrollTo(state.scrollX, state.scrollY); } catch (error) { /* 스크롤 복원 실패는 닫기를 막지 않는다 */ }
                const target = state.lastFocus;
                if (target && typeof target.focus === 'function' && target.isConnected !== false) {
                    try { target.focus({ preventScroll: true }); } catch (error) { /* 초점 복귀 실패는 닫기를 막지 않는다 */ }
                }
            }
            schedulePlace();
        }

        function requestClose() {
            if (!dialog || !session || session.closing) return;
            session.closing = true;
            if (session.pushed) {
                // 우리가 쌓은 기록 한 칸을 되돌리면 popstate가 와서 정리한다. 그 신호가 안 오는 경우를 대비해 안전망도 둔다.
                try { win.history.back(); } catch (error) { cleanup(); return; }
                win.setTimeout(() => { if (dialog) cleanup(); }, 400);
            } else cleanup();
        }

        win.addEventListener('popstate', event => {
            const mine = Boolean(event.state && event.state.apFigureZoom);
            if (dialog) {
                // 열려 있는 동안 뒤로 가기 = 닫기. 학생 포털의 화면 복원 처리는 이 신호를 받지 않는다.
                if (session) session.pushed = false;
                event.stopImmediatePropagation();
                cleanup();
            } else if (mine) event.stopImmediatePropagation();
        }, true);

        doc.addEventListener('keydown', event => {
            if (!dialog) return;
            if (event.key === 'Escape') {
                event.preventDefault();
                event.stopPropagation();
                // 사유 선택지가 열려 있으면 그것부터 닫는다.
                const sheet = dialog.querySelector('.ap-fz-sheet:not([hidden])');
                if (sheet) {
                    sheet.hidden = true;
                    dialog.querySelector('.ap-fz-stage').style.paddingBottom = '';
                    const opener = dialog.querySelector('.ap-fz-report');
                    if (opener) { opener.setAttribute('aria-expanded', 'false'); opener.focus({ preventScroll: true }); }
                    return;
                }
                requestClose();
                return;
            }
            if (event.key === 'Tab') {
                const items = focusables();
                if (!items.length) { event.preventDefault(); return; }
                const first = items[0];
                const last = items[items.length - 1];
                const active = doc.activeElement;
                if (!dialog.contains(active)) { event.preventDefault(); first.focus(); }
                else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
                else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
            }
        }, true);

        // 그림을 직접 누르면 열린다(탭·클릭). 링크·단추 안의 그림이면 그쪽 동작을 우선한다.
        doc.addEventListener('click', event => {
            if (dialog || event.defaultPrevented) return;
            if (event.target && event.target.closest && event.target.closest('.ap-fz-layer, .ap-fz-dialog')) return;
            const figure = figureFrom(event.target);
            if (!figure) return;
            if (figure.closest('a[href], button, [role="button"]')) return;
            open(figure, null);
        });

        win.addEventListener('resize', () => { schedulePlace(); if (session) session.fit(); });
        doc.addEventListener('load', schedulePlace, true);
        doc.addEventListener('beforeprint', () => { if (layer) layer.hidden = true; });
        win.addEventListener('afterprint', () => { if (layer) layer.hidden = false; schedulePlace(); });
        if (typeof win.MutationObserver === 'function') {
            new win.MutationObserver(mutations => {
                if (mutations.every(item => item.target.closest && item.target.closest('.ap-fz-layer, .ap-fz-dialog'))) return;
                scheduleScan();
            }).observe(doc.body || doc.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
        }
        if (typeof win.ResizeObserver === 'function') new win.ResizeObserver(schedulePlace).observe(doc.body || doc.documentElement);
        scheduleScan();
        win.addEventListener('load', scheduleScan);

        return { scan, open, close: requestClose, isOpen: () => Boolean(dialog), badgeCount: () => badges.size };
    }

    return Object.freeze({
        FIGURE_SELECTOR, ENGINE_SELECTOR, PORTAL_SELECTOR, REASONS, isStudentContext, roleOf, figureFrom, fitSize,
        figurePathOf, questionOf, screenKind, widthBucket, describe, sentKeyOf, studentCredentials, reportApiBase, start,
    });
});
