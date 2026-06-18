(function () {
    const state = {
        months: [],
        selectedMonth: currentMonth(),
        detail: null,
        changes: null,
        loading: false,
        error: ''
    };

    function esc(value) {
        return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    function currentMonth() {
        const d = new Date();
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

    function isOwner() {
        const role = String(localStorage.getItem('WANGJI_EIE_ROLE') || '').toLowerCase();
        const login = String(localStorage.getItem('WANGJI_EIE_LOGIN_ID') || '').toLowerCase();
        return role === 'admin' || login === 'admin';
    }

    async function loadMonths(selectMonth) {
        state.loading = true;
        const res = await EieApi.getTimetableMonths();
        state.months = Array.isArray(res.months) ? res.months : (Array.isArray(res.data) ? res.data : []);
        if (selectMonth) state.selectedMonth = selectMonth;
        if (!state.selectedMonth && state.months[0]) state.selectedMonth = state.months[0].month_key;
        await loadDetail(state.selectedMonth, false);
    }

    async function loadDetail(month, rerender = true) {
        state.selectedMonth = month || state.selectedMonth || currentMonth();
        state.error = '';
        state.changes = null;
        try {
            const res = await EieApi.getTimetableMonth(state.selectedMonth);
            state.detail = res && res.success !== false ? res : null;
        } catch (error) {
            state.detail = null;
            state.error = error.message || 'snapshot load failed';
        }
        state.loading = false;
        if (rerender) await mount();
    }

    async function saveSnapshot(mode) {
        if (!isOwner()) return;
        const month = document.querySelector('[data-eie-month-input]')?.value || state.selectedMonth || currentMonth();
        state.loading = true;
        await mount();
        try {
            await EieApi.saveTimetableMonthSnapshot({
                month_key: month,
                snapshot_date: monthEnd(month),
                mode: mode || 'insert',
                source_type: 'manual'
            });
            await loadMonths(month);
        } catch (error) {
            state.loading = false;
            state.error = error.message || 'snapshot save failed';
        }
        await mount();
    }

    async function compareSnapshot() {
        const compare = document.querySelector('[data-eie-compare-input]')?.value;
        if (!compare) return;
        state.loading = true;
        await mount();
        state.changes = await EieApi.getTimetableMonthChanges(state.selectedMonth, compare);
        state.loading = false;
        await mount();
    }

    function printSnapshot() {
        document.body.classList.add('eie-month-printing');
        const cleanup = () => document.body.classList.remove('eie-month-printing');
        window.addEventListener('afterprint', cleanup, { once: true });
        window.print();
        setTimeout(cleanup, 1000);
    }

    function monthCards() {
        if (!state.months.length) return '<div class="eie-month-empty">저장된 월별 시간표가 없습니다.</div>';
        return state.months.map(row => `
            <button class="eie-month-card ${row.month_key === state.selectedMonth ? 'is-active' : ''}" type="button" data-eie-month-open="${esc(row.month_key)}">
                <strong>${esc(row.month_key)}</strong>
                <span>기준일 ${esc(row.snapshot_date || '')}</span>
                <small>${Number(row.cell_count || 0)} cells / ${Number(row.student_count || 0)} students</small>
            </button>
        `).join('');
    }

    function board() {
        const cells = Array.isArray(state.detail?.timetable_cells) ? state.detail.timetable_cells : [];
        if (!cells.length) return '<div class="eie-month-empty">선택한 월의 snapshot 데이터가 없습니다.</div>';
        return `
            <div class="eie-month-board">
                ${cells.map(cell => `
                    <article class="eie-month-cell">
                        <div class="eie-month-cell-top">
                            <strong>${esc(cell.class_name_raw || 'Class')}</strong>
                            <span>${esc([cell.day_label, cell.period_label || cell.start_time].filter(Boolean).join(' · '))}</span>
                        </div>
                        <div class="eie-month-cell-meta">${esc([cell.teacher_name_raw, cell.room_raw].filter(Boolean).join(' / '))}</div>
                        <div class="eie-month-students">
                            ${(cell.assigned_students || []).map(student => `<span>${esc(student.display_name || '')}</span>`).join('') || '<em>학생 없음</em>'}
                        </div>
                    </article>
                `).join('')}
            </div>
        `;
    }

    function changes() {
        const data = state.changes;
        if (!data) return '';
        const changeStudent = item => item && (item.student || item);
        const block = (title, rows, mapper) => `
            <section class="eie-month-change-block">
                <h3>${esc(title)} <span>${rows.length}</span></h3>
                ${rows.length ? rows.map(mapper).join('') : '<p>없음</p>'}
            </section>
        `;
        return `
            <div class="eie-month-changes">
                ${block('들어온 학생', data.joined || [], row => `<p>${esc(changeStudent(row).display_name || '')} ${esc(changeStudent(row).grade || '')}</p>`)}
                ${block('빠진 학생', data.left || [], row => `<p>${esc(changeStudent(row).display_name || '')} ${esc(changeStudent(row).grade || '')}</p>`)}
                ${block('이동한 학생', data.moved || [], row => `<p>${esc(row.student?.display_name || '')}<br><small>${esc(row.before_position || '')} -> ${esc(row.after_position || '')}</small></p>`)}
            </div>
        `;
    }

    function html() {
        const snapshot = state.detail?.snapshot || null;
        const selected = state.selectedMonth || currentMonth();
        return `
            <section class="eie-month-page">
                <div class="eie-month-toolbar">
                    <div>
                        <h1>월별 시간표</h1>
                        <p>현재 운영 시간표와 분리된 월말 저장본입니다.</p>
                    </div>
                    <div class="eie-month-actions">
                        <input type="month" data-eie-month-input value="${esc(selected)}">
                        ${isOwner() ? '<button type="button" data-eie-month-save="insert">이번 달 저장</button><button type="button" data-eie-month-save="upsert">덮어쓰기</button>' : ''}
                        <button type="button" data-eie-month-print>인쇄</button>
                    </div>
                </div>
                <div class="eie-month-layout">
                    <aside class="eie-month-sidebar">${monthCards()}</aside>
                    <main class="eie-month-detail">
                        ${state.loading ? '<div class="eie-month-empty">불러오는 중...</div>' : ''}
                        ${state.error ? `<div class="eie-month-error">${esc(state.error)}</div>` : ''}
                        <div class="eie-month-detail-head">
                            <div>
                                <h2>${esc(selected)} 시간표</h2>
                                <p>${snapshot ? `기준일 ${esc(snapshot.snapshot_date || '')}` : '저장본 없음'}</p>
                            </div>
                            <div class="eie-month-compare">
                                <input type="month" data-eie-compare-input>
                                <button type="button" data-eie-month-compare>이전월과 비교</button>
                            </div>
                        </div>
                        ${board()}
                        ${changes()}
                    </main>
                </div>
            </section>
        `;
    }

    function bind() {
        document.querySelectorAll('[data-eie-month-open]').forEach(btn => {
            btn.addEventListener('click', () => loadDetail(btn.getAttribute('data-eie-month-open')));
        });
        document.querySelectorAll('[data-eie-month-save]').forEach(btn => {
            btn.addEventListener('click', () => saveSnapshot(btn.getAttribute('data-eie-month-save')));
        });
        document.querySelector('[data-eie-month-print]')?.addEventListener('click', printSnapshot);
        document.querySelector('[data-eie-month-compare]')?.addEventListener('click', compareSnapshot);
    }

    async function mount() {
        const app = document.getElementById('eie-app');
        if (app) {
            app.innerHTML = html();
            bind();
        }
        return html();
    }

    window.EieTimetableMonthsView = {
        async render() {
            await loadMonths(state.selectedMonth);
            setTimeout(bind, 0);
            return html();
        }
    };

    window.__eieTimetableMonthsTest = { monthEnd };
})();
