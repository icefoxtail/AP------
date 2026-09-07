(function attachAnswerRenderExecutor(root, factory) {
    const api = factory(root);
    if (typeof module === 'object' && module.exports) module.exports = api;
    if (root) root.APAnswerRenderExecutor = api;
})(typeof window !== 'undefined' ? window : globalThis, function createAnswerRenderExecutor(root) {
    'use strict';

    // Mechanical extraction of the verified Archive renderAns transaction.
    // Pagination, 4-question grouping, empty-cell padding, and DOM order are
    // intentionally kept in the same order as the legacy implementation.
    function render({ area, data, perPage = 40, deps }) {
        if (!area || !Array.isArray(data)) throw new TypeError('APAnswerRenderExecutor.render requires area and data');
        if (typeof deps?.makePage !== 'function') throw new TypeError('APAnswerRenderExecutor missing dependency: makePage');
        if (typeof deps?.getArchiveQuestionSourceRef !== 'function') throw new TypeError('APAnswerRenderExecutor missing dependency: getArchiveQuestionSourceRef');
        if (typeof deps?.formatGridAnswer !== 'function') throw new TypeError('APAnswerRenderExecutor missing dependency: formatGridAnswer');
        const document = deps.document || root?.document;
        if (!document) throw new TypeError('APAnswerRenderExecutor requires document');

        const PER_PAGE = perPage;
        let pCount = 1;
        for (let start = 0; start < data.length; start += PER_PAGE) {
            const chunk = data.slice(start, start + PER_PAGE);
            const p = deps.makePage(area, 'ans', pCount++);
            const grid = document.createElement('div');
            grid.className = 'ans-grid';
            // Keep each 4-question set together across the two answer columns.
            const splitIndex = Math.ceil(Math.ceil(chunk.length / 2) / 4) * 4;
            for (let i = 0; i < splitIndex; i++) {
                [i, splitIndex + i].forEach(idx => {
                    const u = document.createElement('div');
                    u.className = 'ans-cell';
                    if (!chunk[idx]) {
                        u.classList.add('ans-cell-empty');
                        u.setAttribute('aria-hidden', 'true');
                        grid.appendChild(u);
                        return;
                    }
                    const num = start + idx + 1;
                    if (num % 4 === 0) u.classList.add('group-end');
                    u.dataset.sourceRef = deps.getArchiveQuestionSourceRef(chunk[idx], num - 1);
                    u.innerHTML = `<div class="ans-n">${num}.</div><div class="ans-v">${deps.formatGridAnswer(chunk[idx].answer)}</div>`;
                    grid.appendChild(u);
                });
            }
            p.body.appendChild(grid);
        }
        return area;
    }

    return Object.freeze({ render });
});
