(function () {
    const DATA = window.APMATH_MANUAL_DATA || { categories: ['전체'], sections: [], quickStart: [], hotKeywords: [] };
    const state = { query: '', category: '전체', openId: decodeURIComponent((window.location.hash || '').replace(/^#/, '')) };

    const $ = (id) => document.getElementById(id);
    const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    const normalize = (value) => String(value || '').toLowerCase().replace(/\s+/g, '');

    function sectionSearchText(section) {
        return [
            section.category,
            section.title,
            section.summary,
            section.whenToUse,
            section.entry,
            ...(section.keywords || []),
            ...(section.steps || []),
            ...(section.cautions || []),
            ...((section.faq || []).flatMap(item => [item.q, item.a])),
            ...(section.related || [])
        ].join(' ');
    }

    function getSearchScore(section, q) {
        if (!q) return 0;
        let score = 0;
        if (normalize(section.title).includes(q)) score += 100;
        if (normalize(section.summary).includes(q)) score += 45;
        if (normalize(section.category).includes(q)) score += 30;
        if ((section.keywords || []).some(k => normalize(k).includes(q))) score += 60;
        if (normalize(section.entry || '').includes(q)) score += 20;
        if ((section.steps || []).some(step => normalize(step).includes(q))) score += 10;
        if ((section.cautions || []).some(item => normalize(item).includes(q))) score += 8;
        if ((section.faq || []).some(item => normalize(`${item.q || ''} ${item.a || ''}`).includes(q))) score += 8;
        return score;
    }

    function getFilteredSections() {
        const q = normalize(state.query);
        const filtered = (DATA.sections || []).filter(section => {
            const categoryOk = state.category === '전체' || section.category === state.category;
            const queryOk = !q || normalize(sectionSearchText(section)).includes(q);
            return categoryOk && queryOk;
        });
        if (!q) return filtered;
        return filtered
            .map(section => ({ section, score: getSearchScore(section, q) }))
            .sort((a, b) => b.score - a.score || String(a.section.title || '').localeCompare(String(b.section.title || ''), 'ko'))
            .map(item => item.section);
    }

    function renderUpdated() {
        const el = $('manual-updated');
        if (!el) return;
        el.textContent = `최종 업데이트 ${DATA.updatedAt || '-'}`;
    }

    function renderQuickStart() {
        const root = $('quick-start');
        if (!root) return;
        root.innerHTML = (DATA.quickStart || []).map((item, idx) => `
            <article class="quick-item">
                <div class="quick-num">${idx + 1}</div>
                <b>${escapeHtml(item.title)}</b>
                <p>${escapeHtml(item.text)}</p>
            </article>
        `).join('');
    }

    function renderHints() {
        const root = $('search-hints');
        if (!root) return;
        root.innerHTML = (DATA.hotKeywords || []).map(keyword => `
            <button class="hint-chip" type="button" data-keyword="${escapeHtml(keyword)}">${escapeHtml(keyword)}</button>
        `).join('');
        root.querySelectorAll('.hint-chip').forEach(btn => {
            btn.addEventListener('click', () => {
                state.query = btn.dataset.keyword || '';
                const input = $('manual-search');
                if (input) input.value = state.query;
                renderAll();
                scrollToResults();
            });
        });
    }

    function renderCategories() {
        const root = $('category-tabs');
        if (!root) return;
        root.innerHTML = (DATA.categories || ['전체']).map(cat => `
            <button class="cat-tab ${state.category === cat ? 'active' : ''}" type="button" data-category="${escapeHtml(cat)}">${escapeHtml(cat)}</button>
        `).join('');
        root.querySelectorAll('.cat-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                state.category = btn.dataset.category || '전체';
                renderAll();
            });
        });
    }

    function renderToc(sections) {
        const root = $('toc-list');
        if (!root) return;
        root.innerHTML = sections.map(section => `
            <button class="toc-link ${state.openId === section.id ? 'active' : ''}" type="button" data-id="${escapeHtml(section.id)}">${escapeHtml(section.title)}</button>
        `).join('');
        root.querySelectorAll('.toc-link').forEach(btn => {
            btn.addEventListener('click', () => {
                openSection(btn.dataset.id || '');
            });
        });
    }

    function renderList(items, className) {
        if (!items || !items.length) return '';
        return `<ol class="${className}">${items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
    }

    function renderFaq(items) {
        if (!items || !items.length) return '';
        return items.map(item => `
            <div class="faq-item">
                <div class="faq-q">Q. ${escapeHtml(item.q)}</div>
                <div class="faq-a">${escapeHtml(item.a)}</div>
            </div>
        `).join('');
    }

    async function copySectionLink(id) {
        const url = `${window.location.origin}${window.location.pathname}#${encodeURIComponent(id)}`;
        try {
            await navigator.clipboard.writeText(url);
            showCopyToast('링크가 복사되었습니다.');
        } catch (e) {
            window.prompt('아래 링크를 복사하세요.', url);
        }
    }

    function showCopyToast(message) {
        let toast = document.getElementById('manual-copy-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'manual-copy-toast';
            toast.className = 'manual-copy-toast';
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(showCopyToast.timer);
        showCopyToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
    }

    function renderCard(section) {
        const isOpen = state.openId === section.id;
        const keywords = (section.keywords || []).slice(0, 7).map(k => `<span class="keyword">${escapeHtml(k)}</span>`).join('');
        const related = (section.related || []).map(k => `<span class="related-chip">${escapeHtml(k)}</span>`).join('');
        return `
            <article class="manual-card ${isOpen ? 'open' : ''}" id="card-${escapeHtml(section.id)}">
                <button class="manual-card-head" type="button" data-id="${escapeHtml(section.id)}" aria-expanded="${isOpen ? 'true' : 'false'}">
                    <div class="card-main">
                        <span class="card-category">${escapeHtml(section.category)}</span>
                        <h3>${escapeHtml(section.title)}</h3>
                        <p class="summary">${escapeHtml(section.summary)}</p>
                        <div class="keyword-row">${keywords}</div>
                    </div>
                    <span class="open-indicator">⌄</span>
                </button>
                <div class="manual-detail">
                    <div class="detail-grid">
                        <div class="info-box"><strong>언제 쓰나요?</strong><p>${escapeHtml(section.whenToUse || '')}</p></div>
                        <div class="info-box"><strong>어디서 들어가나요?</strong><p>${escapeHtml(section.entry || '')}</p></div>
                    </div>
                    <div class="detail-actions">
                        <button class="copy-link-btn" type="button" data-copy-id="${escapeHtml(section.id)}">이 설명 링크 복사</button>
                    </div>
                    <div class="detail-block"><h4>사용 순서</h4>${renderList(section.steps, 'step-list')}</div>
                    ${(section.cautions || []).length ? `<div class="detail-block"><h4>주의할 점</h4>${renderList(section.cautions, 'plain-list')}</div>` : ''}
                    ${(section.faq || []).length ? `<div class="detail-block"><h4>자주 묻는 질문</h4>${renderFaq(section.faq)}</div>` : ''}
                    ${(section.related || []).length ? `<div class="detail-block"><h4>관련 메뉴</h4><div class="related-row">${related}</div></div>` : ''}
                </div>
            </article>
        `;
    }

    function renderResults() {
        const sections = getFilteredSections();
        const title = $('result-title');
        const count = $('result-count');
        const root = $('manual-results');
        if (title) title.textContent = state.category === '전체' ? '전체 설명' : state.category;
        if (count) count.textContent = `${sections.length}개`;
        renderToc(sections);
        if (!root) return;
        if (!sections.length) {
            root.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div><b>'${escapeHtml(state.query || state.category)}'</b>에 대한 검색 결과가 없습니다.</div><p>다른 키워드로 검색하거나 카테고리를 전체로 바꿔 보세요.</p></div>`;
            return;
        }
        if (!sections.some(s => s.id === state.openId)) state.openId = sections[0]?.id || '';
        root.innerHTML = sections.map(renderCard).join('');
        root.querySelectorAll('.manual-card-head').forEach(btn => {
            btn.addEventListener('click', () => openSection(btn.dataset.id || ''));
        });
        root.querySelectorAll('[data-copy-id]').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                copySectionLink(btn.dataset.copyId || '');
            });
        });
    }

    function openSection(id) {
        state.openId = state.openId === id ? '' : id;
        if (state.openId) history.replaceState(null, '', `#${encodeURIComponent(state.openId)}`);
        renderResults();
        if (state.openId) {
            requestAnimationFrame(() => {
                const card = $(`card-${state.openId}`);
                if (card && window.innerWidth <= 900) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    function scrollToResults() {
        const panel = document.querySelector('.result-panel');
        if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function bindEvents() {
        const input = $('manual-search');
        if (input) {
            input.addEventListener('input', () => {
                state.query = input.value || '';
                renderResults();
            });
        }
        const clearBtn = $('clear-search');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                state.query = '';
                if (input) input.value = '';
                renderResults();
                input?.focus();
            });
        }
        const topBtn = $('top-button');
        if (topBtn) {
            topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            window.addEventListener('scroll', () => {
                topBtn.classList.toggle('show', window.scrollY > 500);
            }, { passive: true });
        }
        const printBtn = $('btn-print-guide');
        if (printBtn) printBtn.addEventListener('click', () => window.print());
    }

    function applyManualTheme() {
        const theme = localStorage.getItem('APMATH_THEME') || '';
        document.body.classList.toggle('dark', theme === 'dark');
    }

    function renderAll() {
        applyManualTheme();
        renderUpdated();
        renderQuickStart();
        renderHints();
        renderCategories();
        renderResults();
    }

    document.addEventListener('DOMContentLoaded', () => {
        bindEvents();
        renderAll();
        window.addEventListener('hashchange', () => {
            state.openId = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));
            renderResults();
        });
    });
})();
