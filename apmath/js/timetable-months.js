(function () {
    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function monthKey(date) {
        const d = date || new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function monthEnd(key) {
        const parts = String(key || '').split('-').map(Number);
        if (parts.length !== 2 || !parts[0] || !parts[1]) return '';
        const year = parts[0];
        const month = parts[1];
        const lastDay = new Date(year, month, 0).getDate();
        return `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    }

    function isAdmin() {
        return String(state?.auth?.role || '').toLowerCase() === 'admin';
    }

    const view = {
        months: [],
        selectedMonth: monthKey(new Date()),
        detail: null,
        changes: null,
        loading: false,
        error: ''
    };

    async function loadMonths(selectMonth) {
        view.loading = true;
        renderFrame();
        const res = await api.getTimetableMonths();
        view.months = Array.isArray(res.months) ? res.months : (Array.isArray(res.data) ? res.data : []);
        if (selectMonth) view.selectedMonth = selectMonth;
        if (!view.selectedMonth && view.months[0]) view.selectedMonth = view.months[0].month_key;
        await loadDetail(view.selectedMonth, false);
    }

    async function loadDetail(month, rerender = true) {
        view.selectedMonth = month || view.selectedMonth || monthKey(new Date());
        view.error = '';
        view.changes = null;
        try {
            const res = await api.getTimetableMonth(view.selectedMonth);
            view.detail = res && res.success !== false ? res : null;
        } catch (error) {
            view.detail = null;
            view.error = error.message || 'snapshot load failed';
        }
        view.loading = false;
        if (rerender) renderFrame();
    }

    async function saveSnapshot(mode) {
        if (!isAdmin()) return;
        const month = document.querySelector('[data-ap-month-input]')?.value || view.selectedMonth || monthKey(new Date());
        const payload = { month_key: month, snapshot_date: monthEnd(month), mode: mode || 'insert', source_type: 'manual' };
        view.loading = true;
        renderFrame();
        try {
            const result = await api.saveTimetableMonthSnapshot(payload);
            if (!result || result.success === false) {
                const message = result && (result.error || result.message);
                throw new Error(message === 'snapshot already exists'
                    ? 'Monthly timetable snapshot already exists. Use overwrite.'
                    : (message || '월별 시간표 저장에 실패했습니다.'));
            }
            await loadMonths(month);
        } catch (error) {
            view.loading = false;
            view.error = error.message || 'snapshot save failed';
            renderFrame();
        }
    }

    async function compareSnapshot() {
        const compare = document.querySelector('[data-ap-compare-input]')?.value;
        if (!compare) return;
        view.loading = true;
        renderFrame();
        const res = await api.getTimetableMonthChanges(view.selectedMonth, compare);
        view.changes = res || null;
        view.loading = false;
        renderFrame();
    }

    function printSnapshot() {
        document.body.classList.add('ap-month-printing');
        const cleanup = () => document.body.classList.remove('ap-month-printing');
        window.addEventListener('afterprint', cleanup, { once: true });
        window.print();
        setTimeout(cleanup, 1000);
    }

    function renderMonthCards() {
        const months = view.months || [];
        if (!months.length) return '<div class="ap-month-empty">저장된 월별 시간표가 없습니다.</div>';
        return months.map(row => `
            <button class="ap-month-card ${row.month_key === view.selectedMonth ? 'is-active' : ''}" type="button" data-ap-month-open="${esc(row.month_key)}">
                <strong>${esc(row.month_key)}</strong>
                <span>기준일 ${esc(row.snapshot_date || '')}</span>
                <small>${Number(row.cell_count || 0)} cells / ${Number(row.student_count || 0)} students</small>
            </button>
        `).join('');
    }

    function renderBoard() {
        const detail = view.detail || {};
        const cells = Array.isArray(detail.timetable_cells) ? detail.timetable_cells : [];
        if (!cells.length) return '<div class="ap-month-empty">선택한 월의 snapshot 데이터가 없습니다.</div>';
        return `
            <div class="ap-month-board">
                ${cells.map(cell => `
                    <article class="ap-month-cell">
                        <div class="ap-month-cell-top">
                            <strong>${esc(cell.class_name || cell.class_name_raw || '수업')}</strong>
                            <span>${esc([cell.day_label, cell.period_label || cell.start_time].filter(Boolean).join(' · '))}</span>
                        </div>
                        <div class="ap-month-cell-meta">${esc([cell.teacher_name || cell.teacher_name_raw, cell.room, cell.subject, cell.grade].filter(Boolean).join(' / '))}</div>
                        <div class="ap-month-students">
                            ${(cell.assigned_students || []).map(student => `<span>${esc(student.display_name || student.name || '')}</span>`).join('') || '<em>학생 없음</em>'}
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }

    function renderChanges() {
        const data = view.changes;
        if (!data) return '';
        const changeStudent = item => item && (item.student || item);
        const block = (title, rows, mapper) => `
            <section class="ap-month-change-block">
                <h3>${esc(title)} <span>${rows.length}</span></h3>
                ${rows.length ? rows.map(mapper).join('') : '<p>없음</p>'}
            </section>
        `;
        return `
            <div class="ap-month-changes">
                ${block('들어온 학생', data.joined || [], row => `<p>${esc(changeStudent(row).display_name || '')} ${esc(changeStudent(row).grade || '')}</p>`)}
                ${block('빠진 학생', data.left || [], row => `<p>${esc(changeStudent(row).display_name || '')} ${esc(changeStudent(row).grade || '')}</p>`)}
                ${block('이동한 학생', data.moved || [], row => `<p>${esc(row.student?.display_name || '')}<br><small>${esc(row.before_position || '')} -> ${esc(row.after_position || '')}</small></p>`)}
            </div>
        `;
    }

    function renderFrame() {
        const root = document.getElementById('app-root');
        if (!root) return;
        const snapshot = view.detail?.snapshot || null;
        const selected = view.selectedMonth || monthKey(new Date());
        root.innerHTML = `
            <section class="ap-month-page">
                <div class="ap-month-toolbar">
                    <div>
                        <h1>월별 시간표</h1>
                        <p>현재 운영 시간표와 분리된 월말 저장본입니다.</p>
                    </div>
                    <div class="ap-month-actions">
                        <input type="month" data-ap-month-input value="${esc(selected)}">
                        ${isAdmin() ? '<button type="button" data-ap-month-save="insert">이번 달 저장</button><button type="button" data-ap-month-save="upsert">덮어쓰기</button>' : ''}
                        <button type="button" data-ap-month-print>인쇄</button>
                    </div>
                </div>
                <div class="ap-month-layout">
                    <aside class="ap-month-sidebar">${renderMonthCards()}</aside>
                    <main class="ap-month-detail">
                        ${view.loading ? '<div class="ap-month-empty">불러오는 중...</div>' : ''}
                        ${view.error ? `<div class="ap-month-error">${esc(view.error)}</div>` : ''}
                        <div class="ap-month-detail-head">
                            <div>
                                <h2>${esc(selected)} 시간표</h2>
                                <p>${snapshot ? `기준일 ${esc(snapshot.snapshot_date || '')}` : '저장본 없음'}</p>
                            </div>
                            <div class="ap-month-compare">
                                <input type="month" data-ap-compare-input>
                                <button type="button" data-ap-month-compare>이전월과 비교</button>
                            </div>
                        </div>
                        ${renderBoard()}
                        ${renderChanges()}
                    </main>
                </div>
            </section>
        `;
        bind();
    }

    function bind() {
        document.querySelectorAll('[data-ap-month-open]').forEach(btn => {
            btn.addEventListener('click', () => loadDetail(btn.getAttribute('data-ap-month-open')));
        });
        document.querySelectorAll('[data-ap-month-save]').forEach(btn => {
            btn.addEventListener('click', () => saveSnapshot(btn.getAttribute('data-ap-month-save')));
        });
        document.querySelector('[data-ap-month-print]')?.addEventListener('click', printSnapshot);
        document.querySelector('[data-ap-month-compare]')?.addEventListener('click', compareSnapshot);
    }

    window.renderTimetableMonths = function () {
        if (typeof appHistoryRecordView === 'function') appHistoryRecordView({ type: 'timetableMonths' });
        loadMonths(view.selectedMonth);
    };

    window.__apTimetableMonthsTest = { monthEnd, saveSnapshot, view };
})();
