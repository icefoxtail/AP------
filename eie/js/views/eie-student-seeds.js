(function () {
    const FLAG_LABELS = {
        duplicate_name: '동명이인',
        missing_phone: '전화번호 없음',
        needs_review: '확인 필요',
        phone_only: '전화만',
        name_only: '이름만'
    };

    function asStudentRows(result) {
        if (Array.isArray(result?.student_seeds)) return result.student_seeds;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function asContactRows(result) {
        if (Array.isArray(result?.contact_seeds)) return result.contact_seeds;
        if (Array.isArray(result?.data)) return result.data;
        return [];
    }

    function flagsOf(row) {
        return Array.isArray(row?.flags) ? row.flags : [];
    }

    function renderFlags(row) {
        const flags = flagsOf(row).filter(flag => FLAG_LABELS[flag]);
        if (!flags.length && row?.match_status === 'needs_review') flags.push('needs_review');
        if (!flags.length) return '<span class="eie-status is-ok">후보</span>';
        return flags.slice(0, 4).map(flag => `<span class="eie-status is-warn">${EieApp.escapeHtml(FLAG_LABELS[flag])}</span>`).join(' ');
    }

    function renderContext(row) {
        const parts = [
            row.day_label,
            row.period_label,
            row.start_time && row.end_time ? `${row.start_time}~${row.end_time}` : '',
            row.class_name_raw,
            row.teacher_name_raw
        ].filter(Boolean);
        return parts.join(' · ') || row.cell_context || '-';
    }

    function renderStudentRows(rows, emptyText) {
        if (!rows.length) return `<div class="eie-empty-box">${EieApp.escapeHtml(emptyText)}</div>`;
        return `
            <div class="eie-table-wrap">
                <table class="eie-table eie-seed-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>학년</th>
                            <th>상태</th>
                            <th>들어간 셀</th>
                            <th>원본</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr class="${flagsOf(row).includes('needs_review') ? 'is-needs-review' : ''}">
                                <td><strong>${EieApp.escapeHtml(row.student_name_raw || row.name || '-')}</strong></td>
                                <td>${EieApp.escapeHtml(row.grade_raw || '-')}</td>
                                <td>${renderFlags(row)}</td>
                                <td>${EieApp.escapeHtml(renderContext(row))}</td>
                                <td>${EieApp.escapeHtml([row.source_row ? `행 ${row.source_row}` : '', row.source_col ? `열 ${row.source_col}` : ''].filter(Boolean).join(' · ') || '-')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderContactRows(rows, emptyText) {
        if (!rows.length) return `<div class="eie-empty-box">${EieApp.escapeHtml(emptyText)}</div>`;
        return `
            <div class="eie-table-wrap">
                <table class="eie-table eie-seed-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>전화번호</th>
                            <th>상태</th>
                            <th>들어간 셀</th>
                            <th>원본</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr class="${flagsOf(row).includes('needs_review') ? 'is-needs-review' : ''}">
                                <td><strong>${EieApp.escapeHtml(row.student_name_raw || row.name || '-')}</strong></td>
                                <td>${EieApp.escapeHtml(row.phone_raw || row.normalized_phone || '-')}</td>
                                <td>${renderFlags(row)}</td>
                                <td>${EieApp.escapeHtml(renderContext(row))}</td>
                                <td>${EieApp.escapeHtml([row.source_row ? `행 ${row.source_row}` : '', row.source_col ? `열 ${row.source_col}` : ''].filter(Boolean).join(' · ') || '-')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    window.EieStudentSeedsView = {
        async render() {
            const state = EieState.get();
            const importId = state.latestImport?.id;
            let studentRows = [];
            let contactRows = [];
            let error = '';
            try {
                const studentResult = await EieApi.getStudentSeeds(importId);
                const contactResult = await EieApi.getContactSeeds(importId);
                studentRows = asStudentRows(studentResult);
                contactRows = asContactRows(contactResult);
                if (studentResult?.fallback || contactResult?.fallback) error = studentResult?.error || contactResult?.error || '후보 API 응답을 불러오지 못했습니다.';
            } catch (loadError) {
                error = loadError?.message || '학생·연락처 후보를 불러오지 못했습니다.';
            }
            EieState.setStudentSeeds(studentRows);
            EieState.setContactSeeds(contactRows);
            const needReviewCount = studentRows.filter(row => flagsOf(row).includes('needs_review') || row.match_status === 'needs_review').length;
            const noPhoneCount = studentRows.filter(row => flagsOf(row).includes('missing_phone') || !row.normalized_phone).length;
            return `
                <section aria-labelledby="eie-seeds-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">학생 후보</p>
                        <h1 id="eie-seeds-title" class="eie-panel-title">학생·연락처 후보</h1>
                        <p class="eie-panel-copy">엑셀에서 온 학생 이름과 전화번호 후보만 검토합니다. 확정 저장은 아직 하지 않습니다.</p>
                        ${error ? `<div class="eie-error-box">${EieApp.escapeHtml(error)}</div>` : ''}
                        <div class="eie-summary-grid">
                            <div class="eie-summary-card"><span>학생 후보</span><strong>${EieApp.escapeHtml(studentRows.length)}명</strong></div>
                            <div class="eie-summary-card"><span>연락처 후보</span><strong>${EieApp.escapeHtml(contactRows.length)}건</strong></div>
                            <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(needReviewCount)}건</strong></div>
                            <div class="eie-summary-card"><span>전화 없음</span><strong>${EieApp.escapeHtml(noPhoneCount)}명</strong></div>
                        </div>
                        <h2 class="eie-subtitle">학생 후보</h2>
                        ${renderStudentRows(studentRows, '아직 표시할 학생 후보가 없습니다. 엑셀 가져오기 후 시간표 셀 후보를 확인해 주세요.')}
                        <h2 class="eie-subtitle">연락처 후보</h2>
                        ${renderContactRows(contactRows, '아직 표시할 연락처 후보가 없습니다. 전화번호가 없는 학생 후보는 그대로 검토 대상에 남습니다.')}
                        <div class="eie-empty-box">학생 확정, 연락처 확정, 수업배정 확정은 이번 라운드 범위가 아닙니다.</div>
                    </div>
                </section>
            `;
        }
    };
})();
