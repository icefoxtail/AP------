/*
 * apmath/student/clinic-learning-view.js
 *
 * Reusable student-facing "학습 기록" (learning history) view for the B1/B2
 * observation summary.  Plain browser script (no build step, no framework),
 * loaded with <script src="./clinic-learning-view.js?v=...">  before the
 * student portal script.
 *
 * Contract:
 *   const view = window.ClinicLearningView.create({
 *     fetchPage: async ({ studentKey, period, filter, cursor, pageSize, signal }) => data,
 *     onOpenSource: (ref, event) => { ... }   // optional, safe navigation only
 *   });
 *   view.mount(document.getElementById('clinic-learning-history'));
 *   view.setStudent(currentStudentId);           // -> loads the first page
 *   view.dispose();
 *
 * Security rules enforced here:
 *   - this module never reads, stores or forwards a student token/secret; the
 *     authenticated request is the host's `fetchPage` callback.
 *   - no HTML is injected from server data (textContent only, no innerHTML).
 *   - no URL is built here; a row exposes only { kind, assignmentId, sessionId }
 *     and the host decides navigation in `onOpenSource`.
 */
(function (global) {
    'use strict';

    var VERSION = 'clinic-learning-view-v1';
    var STYLE_ID = 'clinic-learning-view-style';

    var LABELS = {
        title: '내 학습 기록 요약',
        period: {
            '30d': '최근 30일',
            '90d': '최근 90일',
            '180d': '최근 6개월',
            '365d': '최근 1년'
        },
        filter: {
            all: '전체 기록',
            wrong: '오답이 있는 기록',
            unchecked: '미확인 문항이 있는 기록'
        },
        state: {
            complete: '문항별 확인 완료',
            partial: '일부 문항 미확인·부분 점수',
            unknown: '문항 정보 없음',
            legacy: '오답 수만 기록'
        },
        counts: {
            attempts: '이번 페이지 응시',
            observed: '관측 문항',
            correct: '정답',
            wrong: '오답',
            partial: '부분 점수',
            unchecked: '미확인',
            uniqueConfirmed: '확인된 고유 문항',
            uniqueUnverified: '확인 불가 문항',
            unclassified: '유형 미분류'
        },
        summaryTitle: '이번 페이지 요약',
        summaryScope: '요약·유형 수치는 마지막으로 불러온 페이지 기준입니다. 아래 목록은 지금까지 불러온 기록 전체입니다.',
        typesTitle: '이번 페이지 유형별 관측',
        typesTruncated: '유형 그룹이 많아 일부 유형만 표시했습니다.',
        evidence: '근거 시험',
        rowsTitle: '응시 기록',
        rowsCount: '지금까지 불러온 응시',
        partialRow: '일부 문항만 확인됨',
        missingRow: '기록된 문항 수보다 확인된 문항이 적습니다.',
        truncatedRow: '한 번에 확인하는 문항 수를 넘어 일부 문항이 집계에서 제외되었습니다.',
        legacyRow: '문항 정보 없이 오답 수만 있습니다.',
        reset: '처음부터 다시',
        depth: {
            L4: '세부유형 L4',
            L3: '유형 L3',
            unit: '단원',
            unclassified: '미분류'
        },
        loading: '학습 기록을 불러오는 중입니다…',
        moreLoading: '다음 기록을 불러오는 중입니다…',
        empty: '선택한 기간에 표시할 학습 기록이 없습니다.',
        error: '학습 기록을 불러오지 못했습니다.',
        more: '더 보기',
        haveMore: '다음 기록이 더 있습니다.',
        allLoaded: '더 불러올 기록이 없습니다.',
        stalled: '같은 위치의 기록이 반복되어 더 불러오기를 멈췄습니다.',
        openSource: '기록 보기',
        noSource: '연결된 시험지 정보 없음',
        retry: '다시 시도',
        staleIgnored: '이전 조회 결과는 무시했습니다.'
    };

    var PERIOD_ORDER = ['30d', '90d', '180d', '365d'];
    var FILTER_ORDER = ['all', 'wrong', 'unchecked'];
    var DEFAULT_PERIOD = '90d';
    var DEFAULT_FILTER = 'all';
    var PAGE_HINT = 20;

    function asText(value) {
        return value === null || value === undefined ? '' : String(value);
    }

    function toCount(value) {
        var n = Number(value);
        return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
    }

    function el(tag, className, content) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (content !== undefined && content !== null) node.textContent = asText(content);
        return node;
    }

    function ensureStyles(doc) {
        if (!doc || !doc.head || doc.getElementById(STYLE_ID)) return;
        var style = doc.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            '.clv-root{display:flex;flex-direction:column;gap:14px;}',
            '.clv-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;}',
            '.clv-title{font-size:16px;font-weight:700;margin:0;}',
            '.clv-controls{display:flex;flex-wrap:wrap;gap:8px;}',
            '.clv-tabs{display:flex;gap:6px;flex-wrap:wrap;}',
            '.clv-tab{border:1px solid #d6dae2;background:#fff;border-radius:999px;padding:5px 11px;font-size:12px;cursor:pointer;color:#3c4351;}',
            '.clv-tab[aria-pressed="true"]{border-color:#2f6bff;background:#eef3ff;color:#1b4ed8;font-weight:700;}',
            '.clv-scope{font-size:12px;color:#5a6273;margin:0;line-height:1.5;}',
            '.clv-summary-section{display:flex;flex-direction:column;gap:8px;}',
            '.clv-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;}',
            '.clv-stat{border:1px solid #e4e7ee;border-radius:10px;padding:8px 10px;background:#fbfcfe;}',
            '.clv-stat-label{font-size:11px;color:#6a7285;margin:0 0 2px;}',
            '.clv-stat-value{font-size:16px;font-weight:700;margin:0;color:#22293a;}',
            '.clv-notices{margin:0;padding-left:16px;font-size:12px;color:#5a6273;line-height:1.6;}',
            '.clv-section-title{font-size:13px;font-weight:700;margin:0;color:#2f3646;}',
            '.clv-types{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px;}',
            '.clv-type{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline;border-bottom:1px dashed #e8ebf1;padding-bottom:6px;font-size:12px;color:#4b5364;}',
            '.clv-type-label{font-weight:600;color:#22293a;}',
            '.clv-rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;}',
            '.clv-row{border:1px solid #e4e7ee;border-radius:10px;padding:10px;background:#fff;display:flex;flex-direction:column;gap:5px;}',
            '.clv-row-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:baseline;}',
            '.clv-row-title{font-size:13px;font-weight:600;color:#1f2733;}',
            '.clv-row-state{font-size:11px;border-radius:999px;background:#f1f3f8;color:#4a5266;padding:2px 8px;}',
            '.clv-row-state.is-partial,.clv-row-state.is-unknown{background:#fff6e6;color:#8a5a00;}',
            '.clv-row-state.is-legacy{background:#f3f0ff;color:#4b3ba8;}',
            '.clv-row-meta,.clv-row-counts{font-size:12px;color:#5a6273;margin:0;}',
            '.clv-row-actions{display:flex;gap:8px;}',
            '.clv-btn{border:1px solid #cfd6e2;background:#fff;border-radius:8px;padding:5px 10px;font-size:12px;cursor:pointer;color:#2f3646;}',
            '.clv-btn:disabled{opacity:.55;cursor:default;}',
            '.clv-btn.clv-primary{border-color:#2f6bff;color:#1b4ed8;font-weight:600;}',
            '.clv-status{font-size:12px;color:#5a6273;min-height:16px;}',
            '.clv-status.is-error{color:#b3261e;}',
            '.clv-empty{font-size:13px;color:#5a6273;border:1px dashed #d6dae2;border-radius:10px;padding:16px;text-align:center;}'
        ].join('');
        doc.head.appendChild(style);
    }

    function readConsistentPage(data, previous) {
        var rows = Array.isArray(data && data.rows) ? data.rows : [];
        var page = (data && data.page) || {};
        var nextCursor = asText(page.nextCursor);
        var signature = rows
            .map(function (row) { return asText(row && row.sessionId); })
            .filter(Boolean)
            .join('|');
        var previousSignature = previous ? previous.signature : '';
        return {
            rows: rows,
            hasMore: page.hasMore === true,
            nextCursor: nextCursor || null,
            signature: signature,
            repeatedPage: Boolean(previousSignature) && signature === previousSignature
        };
    }

    function create(options) {
        var opts = options || {};
        if (typeof opts.fetchPage !== 'function') {
            throw new Error('ClinicLearningView.create requires a fetchPage callback');
        }
        var fetchPage = opts.fetchPage;
        var onOpenSource = typeof opts.onOpenSource === 'function' ? opts.onOpenSource : null;
        var labels = opts.labels || LABELS;
        var initialState = opts.initialState || {};

        var state = {
            mounted: false,
            studentKey: asText(initialState.studentKey),
            period: PERIOD_ORDER.indexOf(initialState.period) >= 0 ? initialState.period : DEFAULT_PERIOD,
            filter: FILTER_ORDER.indexOf(initialState.filter) >= 0 ? initialState.filter : DEFAULT_FILTER,
            generation: 0,
            status: 'idle',            // idle | loading | loadingMore | ready | error | empty
            error: null,
            rows: [],
            seenSessionIds: {},
            types: [],
            summary: null,
            notices: [],
            scopeLine: '',
            hasMore: false,
            nextCursor: null,
            lastSignature: '',
            stalled: false,
            loadedPages: 0,
            pageReturned: 0,
            disposed: false
        };

        var root = null;
        var abortController = null;

        function snapshot() {
            return {
                version: VERSION,
                studentKey: state.studentKey,
                period: state.period,
                filter: state.filter,
                status: state.status,
                generation: state.generation,
                rowCount: state.rows.length,
                hasMore: state.hasMore,
                nextCursor: state.nextCursor,
                stalled: state.stalled,
                loadedPages: state.loadedPages,
                pageReturned: state.pageReturned,
                error: state.error
            };
        }

        function abortInFlight() {
            if (abortController) {
                try { abortController.abort(); } catch (err) { /* ignore */ }
                abortController = null;
            }
        }

        function resetData() {
            state.rows = [];
            state.seenSessionIds = {};
            state.types = [];
            state.summary = null;
            state.notices = [];
            state.scopeLine = '';
            state.hasMore = false;
            state.nextCursor = null;
            state.lastSignature = '';
            state.stalled = false;
            state.loadedPages = 0;
            state.pageReturned = 0;
            state.error = null;
        }

        function buildScopeLine(data, accumulatedCount) {
            var observed = (data && data.observed) || {};
            var from = asText(observed.from);
            var to = asText(observed.to);
            var coverage = (data && data.coverage) || {};
            var parts = [];
            if (from && to) parts.push('조회 기간 ' + from + ' ~ ' + to);
            if (observed.filter && labels.filter[observed.filter]) {
                parts.push(labels.filter[observed.filter]);
            }
            if (observed.classScoped === true) {
                parts.push('담임 확인 범위');
            }
            parts.push(asText(coverage.label) || '현재 불러온 기록 기준');
            parts.push('불러온 응시 ' + toCount(accumulatedCount) + '건');
            var page = (data && data.page) || {};
            if (state.loadedPages >= 1 && toCount(page.returned) > 0) {
                parts.push('최근 페이지 ' + toCount(page.returned) + '건');
            }
            return parts.join(' · ');
        }

        function requestPage(mode) {
            if (state.disposed || !state.studentKey) return Promise.resolve(false);
            var generation = state.generation;
            var isMore = mode === 'more';
            state.status = isMore ? 'loadingMore' : 'loading';
            state.error = null;
            abortInFlight();
            var controller = typeof AbortController === 'function' ? new AbortController() : null;
            abortController = controller;
            render();

            var cursor = isMore ? state.nextCursor : null;
            var payload = {
                studentKey: state.studentKey,
                period: state.period,
                filter: state.filter,
                cursor: cursor,
                pageSize: PAGE_HINT,
                signal: controller ? controller.signal : null
            };

            return Promise.resolve()
                .then(function () { return fetchPage(payload); })
                .then(function (data) {
                    if (state.disposed || generation !== state.generation) return false; // stale
                    var page = readConsistentPage(data, isMore ? { signature: state.lastSignature } : null);
                    if (isMore && page.repeatedPage) {
                        state.stalled = true;
                        state.status = state.rows.length ? 'ready' : 'empty';
                        render();
                        return true;
                    }
                    var appended = 0;
                    page.rows.forEach(function (row) {
                        var sessionId = asText(row && row.sessionId);
                        if (!sessionId || state.seenSessionIds[sessionId]) return;
                        state.seenSessionIds[sessionId] = true;
                        state.rows.push(row);
                        appended += 1;
                    });
                    state.types = Array.isArray(data && data.types) ? data.types : [];
                    state.summary = (data && data.summary) || null;
                    state.notices = Array.isArray(data && data.notices) ? data.notices : [];
                    state.scopeLine = buildScopeLine(data, state.rows.length);
                    state.pageReturned = toCount(page.rows.length);
                    state.hasMore = page.hasMore === true;
                    state.nextCursor = page.nextCursor;
                    state.lastSignature = page.signature;
                    state.loadedPages += 1;
                    if (page.hasMore && !page.nextCursor) {
                        // Server claims more rows but gave no cursor: never loop.
                        state.hasMore = false;
                        state.stalled = true;
                    }
                    state.status = state.rows.length ? 'ready' : 'empty';
                    render();
                    return appended > 0 || !state.hasMore;
                })
                .catch(function (error) {
                    if (state.disposed || generation !== state.generation) return false;
                    if (error && (error.name === 'AbortError' || error.code === 'ABORT_ERR')) return false;
                    state.error = error && error.message ? String(error.message) : labels.error;
                    if (isMore) {
                        // The continuation cursor cannot be verified (400/409 or
                        // transient failure). Never re-send the same cursor: keep
                        // the already loaded rows visible, stop the pagination and
                        // let the user restart from the first page explicitly.
                        state.stalled = true;
                        state.hasMore = false;
                        state.nextCursor = null;
                        state.status = state.rows.length ? 'ready' : 'error';
                    } else {
                        state.status = state.rows.length ? 'ready' : 'error';
                    }
                    render();
                    return false;
                })
                .then(function (result) {
                    if (abortController === controller) abortController = null;
                    return result;
                });
        }

        function load() {
            if (state.disposed) return Promise.resolve(false);
            if (!state.studentKey) {
                state.status = 'idle';
                render();
                return Promise.resolve(false);
            }
            state.generation += 1;
            resetData();
            return requestPage('first');
        }

        function loadMore() {
            if (state.disposed || state.status === 'loading' || state.status === 'loadingMore') return Promise.resolve(false);
            if (!state.hasMore || !state.nextCursor || state.stalled) return Promise.resolve(false);
            return requestPage('more');
        }

        function renderStat(label, value) {
            var box = el('div', 'clv-stat');
            box.appendChild(el('p', 'clv-stat-label', label));
            box.appendChild(el('p', 'clv-stat-value', asText(toCount(value))));
            return box;
        }

        function renderTabs(values, current, labelMap, onPick, ariaLabel) {
            var wrap = el('div', 'clv-tabs');
            wrap.setAttribute('role', 'group');
            wrap.setAttribute('aria-label', ariaLabel);
            values.forEach(function (value) {
                var button = el('button', 'clv-tab', labelMap[value] || value);
                button.type = 'button';
                button.setAttribute('aria-pressed', value === current ? 'true' : 'false');
                button.addEventListener('click', function () { onPick(value); });
                wrap.appendChild(button);
            });
            return wrap;
        }

        function renderSummary(summary) {
            var wrap = el('section', 'clv-summary-section');
            wrap.appendChild(el('h4', 'clv-section-title', labels.summaryTitle));
            wrap.appendChild(el('p', 'clv-scope', labels.summaryScope));
            var box = el('div', 'clv-summary');
            var attempts = (summary && summary.attempts) || {};
            var questions = (summary && summary.questions) || {};
            var unique = (summary && summary.uniqueQuestion) || {};
            var unclassified = (summary && summary.unclassified) || {};
            box.appendChild(renderStat(labels.counts.attempts, attempts.loaded));
            box.appendChild(renderStat(labels.counts.observed, questions.observed));
            box.appendChild(renderStat(labels.counts.correct, questions.correct));
            box.appendChild(renderStat(labels.counts.wrong, questions.wrong));
            box.appendChild(renderStat(labels.counts.partial, questions.partial));
            box.appendChild(renderStat(labels.counts.unchecked, questions.unchecked));
            box.appendChild(renderStat(labels.counts.uniqueConfirmed, unique.confirmed));
            if (toCount(unique.unverified) > 0) {
                box.appendChild(renderStat(labels.counts.uniqueUnverified, unique.unverified));
            }
            var unclassifiedTotal = toCount(unclassified.legacyWrongs) +
                toCount(unclassified.unresolvedMetaItems) +
                toCount(unclassified.typeUngroupedItems);
            if (unclassifiedTotal > 0) {
                box.appendChild(renderStat(labels.counts.unclassified, unclassifiedTotal));
            }
            wrap.appendChild(box);
            if (summary && summary.typesTruncated === true) {
                wrap.appendChild(el('p', 'clv-scope', labels.typesTruncated));
            }
            return wrap;
        }

        function renderTypes(types) {
            var section = el('section', 'clv-types-section');
            section.appendChild(el('h4', 'clv-section-title', labels.typesTitle));
            var list = el('ul', 'clv-types');
            types.forEach(function (type) {
                var item = el('li', 'clv-type');
                item.appendChild(el('span', 'clv-type-label', type && type.label ? type.label : '유형 미분류'));
                var depthLabel = type && labels.depth && labels.depth[type.depth] ? labels.depth[type.depth] : '';
                if (depthLabel) item.appendChild(el('span', null, depthLabel));
                item.appendChild(el('span', null, '관측 ' + toCount(type && type.observed)));
                item.appendChild(el('span', null, '오답 ' + toCount(type && type.wrong)));
                if (toCount(type && type.partial) > 0) {
                    item.appendChild(el('span', null, '부분 ' + toCount(type.partial)));
                }
                if (toCount(type && type.unchecked) > 0) {
                    item.appendChild(el('span', null, '미확인 ' + toCount(type.unchecked)));
                }
                var evidence = Array.isArray(type && type.evidence) ? type.evidence : [];
                if (onOpenSource && evidence.length) {
                    var evidenceRef = evidence[0] || {};
                    var evidenceAssignmentId = asText(evidenceRef.assignmentId);
                    if (evidenceAssignmentId) {
                        var evidenceBtn = el('button', 'clv-btn', labels.evidence);
                        evidenceBtn.type = 'button';
                        evidenceBtn.addEventListener('click', function (event) {
                            try {
                                onOpenSource({
                                    kind: 'assignment',
                                    assignmentId: evidenceAssignmentId,
                                    sessionId: asText(evidenceRef.sessionId) || null
                                }, event);
                            } catch (err) {
                                if (global.console && global.console.warn) {
                                    global.console.warn('[clinic-learning-view] onOpenSource failed', err);
                                }
                            }
                        });
                        item.appendChild(evidenceBtn);
                    }
                }
                list.appendChild(item);
            });
            section.appendChild(list);
            return section;
        }

        function renderRow(row) {
            var item = el('li', 'clv-row');
            var head = el('div', 'clv-row-head');
            head.appendChild(el('span', 'clv-row-title', asText(row.title) || '제목 없는 시험'));
            var stateLabel = (labels.state[row.state] || labels.state.unknown);
            head.appendChild(el('span', 'clv-row-state is-' + asText(row.state || 'unknown'), stateLabel));
            item.appendChild(head);

            var metaParts = [];
            if (row.examDate) metaParts.push(asText(row.examDate));
            if (row.className) metaParts.push(asText(row.className));
            if (row.score !== null && row.score !== undefined) metaParts.push('점수 ' + asText(row.score));
            if (row.questionCount) metaParts.push('문항 ' + toCount(row.questionCount));
            if (row.reviewOnly) metaParts.push('참고용 기록');
            if (!row.assignmentId) metaParts.push(labels.noSource);
            item.appendChild(el('p', 'clv-row-meta', metaParts.join(' · ')));

            var counts = row.counts || {};
            var countParts = [];
            if (row.state === 'legacy') {
                // Legacy rows have no question-level statuses: never show
                // '관측 0' as if the attempt contained zero questions.
                countParts.push('오답 ' + toCount(counts.wrong));
            } else if (row.itemsNotInspected) {
                countParts.push('문항 정보 확인 불가');
            } else {
                countParts.push('관측 ' + toCount(counts.observed));
                countParts.push('정답 ' + toCount(counts.correct));
                countParts.push('오답 ' + toCount(counts.wrong));
                if (toCount(counts.partial) > 0) countParts.push('부분 ' + toCount(counts.partial));
                if (toCount(counts.unchecked) > 0) countParts.push('미확인 ' + toCount(counts.unchecked));
            }
            item.appendChild(el('p', 'clv-row-counts', countParts.join(' · ')));

            var rowNotes = [];
            if (row.state === 'legacy') rowNotes.push(labels.legacyRow);
            if (row.itemsTruncated) rowNotes.push(labels.truncatedRow);
            if (row.itemsMissing) rowNotes.push(labels.missingRow);
            if (row.state === 'partial' && !row.itemsTruncated && !row.itemsMissing) {
                rowNotes.push(labels.partialRow);
            }
            if (rowNotes.length) {
                item.appendChild(el('p', 'clv-scope', rowNotes.join(' ')));
            }

            if (onOpenSource && row.assignmentId) {
                // openOmrReview(assignmentId, mode) needs an assignment id; a
                // session-only record must not render a dead-end button.
                var actions = el('div', 'clv-row-actions');
                var ref = row.sourceRefs || {
                    kind: 'assignment',
                    assignmentId: row.assignmentId,
                    sessionId: row.sessionId || null
                };
                var openButton = el('button', 'clv-btn', labels.openSource);
                openButton.type = 'button';
                openButton.addEventListener('click', function (event) {
                    try {
                        onOpenSource({
                            kind: 'assignment',
                            assignmentId: row.assignmentId,
                            sessionId: ref.sessionId || row.sessionId || null
                        }, event);
                    } catch (err) {
                        if (global.console && global.console.warn) {
                            global.console.warn('[clinic-learning-view] onOpenSource failed', err);
                        }
                    }
                });
                actions.appendChild(openButton);
                item.appendChild(actions);
            }
            return item;
        }

        function render() {
            if (!root) return;
            var frag = document.createDocumentFragment();

            var head = el('div', 'clv-head');
            head.appendChild(el('h3', 'clv-title', labels.title));
            var controls = el('div', 'clv-controls');
            controls.appendChild(renderTabs(PERIOD_ORDER, state.period, labels.period, function (value) {
                if (value === state.period) return;
                state.period = value;
                load();
            }, '조회 기간'));
            controls.appendChild(renderTabs(FILTER_ORDER, state.filter, labels.filter, function (value) {
                if (value === state.filter) return;
                state.filter = value;
                load();
            }, '조회 조건'));
            head.appendChild(controls);
            frag.appendChild(head);

            if (state.scopeLine) frag.appendChild(el('p', 'clv-scope', state.scopeLine));

            var status = el('p', 'clv-status' + (state.error ? ' is-error' : ''));
            status.setAttribute('role', 'status');
            status.setAttribute('aria-live', 'polite');
            if (state.status === 'loading') status.textContent = labels.loading;
            else if (state.status === 'loadingMore') status.textContent = labels.moreLoading;
            else if (state.error) status.textContent = labels.error + ' ' + state.error;
            else if (state.stalled) status.textContent = labels.stalled;
            else if (state.status === 'ready' && state.hasMore) status.textContent = labels.haveMore;
            else if (state.status === 'ready') status.textContent = labels.allLoaded;
            frag.appendChild(status);

            if (state.error) {
                var retryWrap = el('div');
                var retryBtn = el('button', 'clv-btn clv-primary', labels.reset);
                retryBtn.type = 'button';
                retryBtn.addEventListener('click', function () {
                    // Restart from the first page: a failed continuation cursor is
                    // never re-sent, and a failed first page has no cursor yet.
                    load();
                });
                retryWrap.appendChild(retryBtn);
                frag.appendChild(retryWrap);
            } else if (state.stalled) {
                var stalledWrap = el('div');
                var stalledBtn = el('button', 'clv-btn clv-primary', labels.reset);
                stalledBtn.type = 'button';
                stalledBtn.addEventListener('click', function () { load(); });
                stalledWrap.appendChild(stalledBtn);
                frag.appendChild(stalledWrap);
            }

            if (state.summary) frag.appendChild(renderSummary(state.summary));
            if (state.types.length) frag.appendChild(renderTypes(state.types));
            if (state.notices.length) {
                var noticeList = el('ul', 'clv-notices');
                state.notices.forEach(function (notice) {
                    noticeList.appendChild(el('li', null, notice));
                });
                frag.appendChild(noticeList);
            }

            if (state.rows.length) {
                var rowsSection = el('section');
                rowsSection.appendChild(el('h4', 'clv-section-title',
                    labels.rowsTitle + ' (' + labels.rowsCount + ' ' + state.rows.length + '건)'));
                var list = el('ul', 'clv-rows');
                state.rows.forEach(function (row) { list.appendChild(renderRow(row)); });
                rowsSection.appendChild(list);
                frag.appendChild(rowsSection);

                if (state.hasMore && !state.stalled) {
                    var moreBtn = el('button', 'clv-btn clv-primary', labels.more);
                    moreBtn.type = 'button';
                    moreBtn.disabled = state.status === 'loading' || state.status === 'loadingMore';
                    moreBtn.addEventListener('click', function () { loadMore(); });
                    frag.appendChild(moreBtn);
                }
            } else if (state.status === 'empty') {
                frag.appendChild(el('div', 'clv-empty', labels.empty));
            }

            root.replaceChildren(frag);
        }

        function mount(container) {
            if (!container || typeof container.replaceChildren !== 'function') {
                throw new Error('ClinicLearningView.mount requires a container element');
            }
            if (state.mounted) dispose();
            root = container;
            root.classList.add('clv-root');
            if (opts.injectStyles !== false) ensureStyles(root.ownerDocument || document);
            root.replaceChildren();
            state.mounted = true;
            state.disposed = false;
            render();
            if (state.studentKey && state.status === 'idle') load();
            return root;
        }

        function dispose() {
            state.disposed = true;
            state.generation += 1;
            abortInFlight();
            if (root) {
                root.classList.remove('clv-root');
                root.replaceChildren();
            }
            root = null;
            state.mounted = false;
            state.status = 'idle';
            state.error = null;
            resetData();
        }

        return {
            version: VERSION,
            mount: mount,
            dispose: dispose,
            load: load,
            reload: load,
            reset: load,
            loadMore: loadMore,
            setStudent: function (studentKey) {
                var next = asText(studentKey);
                var busy = state.status === 'loading' || state.status === 'loadingMore';
                if (next === state.studentKey && (state.status === 'ready' || busy)) return Promise.resolve(false);
                state.studentKey = next;
                return load();
            },
            setPeriod: function (period) {
                if (PERIOD_ORDER.indexOf(period) < 0 || period === state.period) return Promise.resolve(false);
                state.period = period;
                return load();
            },
            setFilter: function (filter) {
                if (FILTER_ORDER.indexOf(filter) < 0 || filter === state.filter) return Promise.resolve(false);
                state.filter = filter;
                return load();
            },
            getState: snapshot
        };
    }

    var api = {
        version: VERSION,
        create: create,
        labels: LABELS,
        defaults: {
            period: DEFAULT_PERIOD,
            filter: DEFAULT_FILTER,
            pageSize: PAGE_HINT,
            periods: PERIOD_ORDER.slice(),
            filters: FILTER_ORDER.slice()
        }
    };

    if (typeof global.ClinicLearningView === 'object' && global.ClinicLearningView &&
        typeof global.ClinicLearningView.create === 'function' &&
        global.ClinicLearningView.version === VERSION) {
        // Already loaded once; keep the single existing instance.
        if (typeof module === 'object' && module && module.exports) module.exports = global.ClinicLearningView;
        return;
    }
    global.ClinicLearningView = api;
    if (typeof module === 'object' && module && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
