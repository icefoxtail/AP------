/* Screen-only feedback. Render outcomes, snapshots and print readiness belong to the engines. */
(function (root) {
    'use strict';

    const modeNames = { exam: '시험지', sol: '해설', ans: '정답표' };
    const phaseNames = {
        source: '자료 불러오는 중',
        math: '수식 정리 중',
        images: '그림 준비 중',
        layout: '쪽 배치 중'
    };
    let current = null;
    let view = null;

    function ensureView() {
        const doc = root.document;
        if (!doc?.body?.appendChild || typeof doc.createElement !== 'function') return null;
        if (view?.panel.isConnected) return view;
        if (!doc.getElementById('ap-archive-render-feedback-style')) {
            const style = doc.createElement('style');
            style.id = 'ap-archive-render-feedback-style';
            style.textContent = `
                #ap-archive-render-feedback { position:fixed; z-index:1100; left:50%; bottom:max(12px,env(safe-area-inset-bottom)); transform:translateX(-50%); display:flex; align-items:center; gap:12px; box-sizing:border-box; width:max-content; max-width:calc(100vw - 24px); padding:10px 14px; border:1px solid #d4d4d8; border-radius:10px; background:#fff; color:#27272a; box-shadow:0 4px 18px rgba(24,24,27,.12); font:14px/1.45 system-ui,sans-serif; }
                #ap-archive-render-feedback[hidden] { display:none !important; }
                #ap-archive-render-feedback .ap-render-feedback-message { min-width:0; }
                #ap-archive-render-feedback button { flex:none; min-height:44px; padding:0 12px; border:1px solid #a1a1aa; border-radius:7px; background:#fafafa; color:#27272a; font:inherit; cursor:pointer; }
                #ap-archive-render-feedback button[hidden] { display:none !important; }
                #ap-archive-render-feedback button:focus-visible { outline:2px solid #52525b; outline-offset:2px; }
                @media print { #ap-archive-render-feedback { display:none !important; } }
            `;
            (doc.head || doc.body).appendChild(style);
        }
        const panel = doc.createElement('div');
        panel.id = 'ap-archive-render-feedback';
        panel.hidden = true;
        panel.setAttribute('aria-atomic', 'true');
        const message = doc.createElement('span');
        message.className = 'ap-render-feedback-message';
        const retryButton = doc.createElement('button');
        retryButton.type = 'button';
        retryButton.textContent = '다시 시도';
        retryButton.hidden = true;
        retryButton.addEventListener('click', () => {
            const failed = current;
            if (!failed || !failed.failed || failed.pending || typeof failed.options.retry !== 'function') return;
            // The retry may itself start a tracked engine request. That newer request owns the UI.
            track(Promise.resolve().then(() => failed.options.retry()), failed.options);
        });
        panel.appendChild(message);
        panel.appendChild(retryButton);
        doc.body.appendChild(panel);
        view = { panel, message, retryButton };
        return view;
    }

    function paint(entry, update) {
        if (current !== entry) return;
        try {
            const target = ensureView();
            if (target) update(target);
        } catch (_) {
            // A missing/unavailable UI must not change the renderer's promise or readiness.
        }
    }

    function pendingText(entry, progress = {}) {
        const name = modeNames[entry.options.mode] || '자료';
        const phase = phaseNames[progress.phase];
        const total = Number(progress.total ?? entry.options.questionCount);
        const completed = Number(progress.completed);
        const hasTotal = Number.isInteger(total) && total > 0;
        const hasCompleted = Number.isInteger(completed) && completed >= 0 && completed <= total;
        const unit = progress.phase === 'images' ? '개' : '문항';
        if (phase) return phase + (hasTotal && hasCompleted ? ` · ${completed}/${total}${unit}` : '…');
        return name + (hasTotal ? ` ${total}문항` : '') + ' 준비 중…';
    }

    function showPending(entry, progress) {
        paint(entry, ({ panel, message, retryButton }) => {
            panel.hidden = false;
            panel.dataset.state = 'pending';
            delete panel.dataset.errorCode;
            panel.setAttribute('role', 'status');
            panel.setAttribute('aria-live', 'polite');
            message.textContent = pendingText(entry, progress);
            retryButton.hidden = true;
            retryButton.disabled = true;
        });
    }

    function failureText(code, mode) {
        if (/PRINT_TRANSACTION_BUSY/.test(code)) return '인쇄가 끝난 뒤 다시 시도해 주세요.';
        if (/IMAGE|ASSET/.test(code)) return '그림을 불러오지 못했습니다.';
        if (/MATH|TYPESET/.test(code)) return '수식을 표시하지 못했습니다.';
        if (/FONT/.test(code)) return '글꼴을 불러오지 못했습니다.';
        if (/TIMEOUT|TIMED_OUT|AbortError/.test(code)) return '준비가 지연되었습니다. 다시 시도해 주세요.';
        if (/SOURCE_LOAD|NETWORK|FETCH/.test(code)) return '자료를 불러오지 못했습니다.';
        return (modeNames[mode] || '자료') + ' 준비를 마치지 못했습니다.';
    }

    function hide(entry) {
        paint(entry, ({ panel, retryButton }) => {
            panel.hidden = true;
            panel.dataset.state = 'idle';
            delete panel.dataset.errorCode;
            retryButton.hidden = true;
        });
    }

    function settle(entry, outcome, rejected) {
        if (current !== entry) return;
        entry.pending = false;
        entry.failed = false;
        if (!rejected && outcome?.ok !== false) {
            hide(entry);
            return;
        }
        const error = rejected || outcome;
        const code = String(error?.code || error?.message || (typeof error === 'string' ? error : 'RENDER_FAILED'));
        if (code === 'DISCARDED_STALE') {
            hide(entry);
            return;
        }
        entry.failed = true;
        paint(entry, ({ panel, message, retryButton }) => {
            panel.hidden = false;
            panel.dataset.state = 'failed';
            panel.dataset.errorCode = code.slice(0, 200);
            panel.setAttribute('role', 'alert');
            panel.setAttribute('aria-live', 'assertive');
            message.textContent = failureText(code, entry.options.mode);
            retryButton.hidden = typeof entry.options.retry !== 'function';
            retryButton.disabled = false;
        });
    }

    // Returns a request-scoped progress handle; callers keep awaiting their original promise.
    function track(promise, options = {}) {
        const entry = { options, pending: true, failed: false };
        current = entry;
        showPending(entry);
        Promise.resolve(promise).then(
            outcome => settle(entry, outcome, null),
            error => settle(entry, null, error || new Error('RENDER_FAILED'))
        );
        return Object.freeze({
            progress(value) {
                if (current === entry && entry.pending) showPending(entry, value || {});
            }
        });
    }

    root.APArchiveRenderFeedback = Object.freeze({ track });
})(typeof window === 'undefined' ? globalThis : window);
