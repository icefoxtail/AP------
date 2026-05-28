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

    function asConfirmedRows(result, key) {
        if (Array.isArray(result?.[key])) return result[key];
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
                            <th>확정</th>
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
                                <td><button type="button" class="eie-small-button" onclick="EieStudentSeedsView.confirmCandidate('${EieApp.escapeHtml(row.cell_id || '')}', ${Number(row.candidate_index || 0)})" ${row.cell_id ? '' : 'disabled'}>확정</button></td>
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
                            <th>확정</th>
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
                                <td><button type="button" class="eie-small-button" onclick="EieStudentSeedsView.confirmCandidate('${EieApp.escapeHtml(row.cell_id || '')}', ${Number(row.candidate_index || 0)})" ${row.cell_id ? '' : 'disabled'}>확정</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderConfirmedRows(rows, emptyText) {
        if (!rows.length) return `<div class="eie-empty-box">${EieApp.escapeHtml(emptyText)}</div>`;
        return `
            <div class="eie-table-wrap">
                <table class="eie-table eie-seed-table">
                    <thead>
                        <tr>
                            <th>이름</th>
                            <th>학년</th>
                            <th>연락처</th>
                            <th>배정</th>
                            <th>상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                <td><strong>${EieApp.escapeHtml(row.display_name || row.student_name_raw || row.name || '-')}</strong></td>
                                <td>${EieApp.escapeHtml(row.grade || row.grade_raw || '-')}</td>
                                <td>${EieApp.escapeHtml(row.contact_count ?? '-')}</td>
                                <td>${EieApp.escapeHtml(row.assignment_count ?? '-')}</td>
                                <td>${EieApp.escapeHtml(row.status || 'active')}</td>
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
            let confirmedRows = [];
            let assignmentRows = [];
            let error = '';
            try {
                const [studentResult, contactResult, confirmedResult, assignmentResult] = await Promise.all([
                    EieApi.getStudentSeeds(importId),
                    EieApi.getContactSeeds(importId),
                    EieApi.getConfirmedStudents(),
                    EieApi.getScheduleAssignments()
                ]);
                studentRows = asStudentRows(studentResult);
                contactRows = asContactRows(contactResult);
                confirmedRows = asConfirmedRows(confirmedResult, 'confirmed_students');
                assignmentRows = asConfirmedRows(assignmentResult, 'schedule_assignments');
                if (studentResult?.fallback || contactResult?.fallback || confirmedResult?.fallback || assignmentResult?.fallback) {
                    error = studentResult?.error || contactResult?.error || confirmedResult?.error || assignmentResult?.error || '후보 API 응답을 불러오지 못했습니다.';
                }
            } catch (loadError) {
                error = loadError?.message || '학생·연락처 후보를 불러오지 못했습니다.';
            }
            EieState.setStudentSeeds(studentRows);
            EieState.setContactSeeds(contactRows);
            EieState.setConfirmedStudents(confirmedRows);
            EieState.setScheduleAssignments(assignmentRows);
            const needReviewCount = studentRows.filter(row => flagsOf(row).includes('needs_review') || row.match_status === 'needs_review').length;
            const noPhoneCount = studentRows.filter(row => flagsOf(row).includes('missing_phone') || !row.normalized_phone).length;
            return `
                <section aria-labelledby="eie-seeds-title">
                    <button type="button" class="eie-back-button" onclick="EieRouter.open('dashboard')">EIE 홈</button>
                    <div class="eie-panel">
                        <p class="eie-dashboard-kicker">학생 후보</p>
                        <h1 id="eie-seeds-title" class="eie-panel-title">학생·연락처 후보</h1>
                        <p class="eie-panel-copy">엑셀에서 온 후보를 확인하고 EIE 전용 학생·연락처·수업배정을 확정합니다. APMS 학생/학부모/반 배정에는 쓰지 않습니다.</p>
                        ${state.studentSeedNotice ? `<div class="eie-notice-box">${EieApp.escapeHtml(state.studentSeedNotice)}</div>` : ''}
                        ${state.studentSeedError || error ? `<div class="eie-error-box">${EieApp.escapeHtml(state.studentSeedError || error)}</div>` : ''}
                        <div class="eie-summary-grid">
                            <div class="eie-summary-card"><span>학생 후보</span><strong>${EieApp.escapeHtml(studentRows.length)}명</strong></div>
                            <div class="eie-summary-card"><span>연락처 후보</span><strong>${EieApp.escapeHtml(contactRows.length)}건</strong></div>
                            <div class="eie-summary-card"><span>확인 필요</span><strong>${EieApp.escapeHtml(needReviewCount)}건</strong></div>
                            <div class="eie-summary-card"><span>전화 없음</span><strong>${EieApp.escapeHtml(noPhoneCount)}명</strong></div>
                            <div class="eie-summary-card"><span>확정 학생</span><strong>${EieApp.escapeHtml(confirmedRows.length)}명</strong></div>
                            <div class="eie-summary-card"><span>수업배정</span><strong>${EieApp.escapeHtml(assignmentRows.length)}건</strong></div>
                        </div>
                        <h2 class="eie-subtitle">학생 후보</h2>
                        ${renderStudentRows(studentRows, '아직 표시할 학생 후보가 없습니다. 엑셀 가져오기 후 시간표 셀 후보를 확인해 주세요.')}
                        <h2 class="eie-subtitle">연락처 후보</h2>
                        ${renderContactRows(contactRows, '아직 표시할 연락처 후보가 없습니다. 전화번호가 없는 학생 후보는 그대로 검토 대상에 남습니다.')}
                        <h2 class="eie-subtitle">확정 학생</h2>
                        ${renderConfirmedRows(confirmedRows, '아직 확정된 EIE 학생이 없습니다. 후보 행에서 확정을 진행해 주세요.')}
                        <div class="eie-empty-box">Round 6은 EIE 전용 학생·연락처·수업배정 확정까지만 다룹니다. classroom, 출석, 숙제, 교재, 메모는 생성하지 않습니다.</div>
                    </div>
                </section>
            `;
        },
        async confirmCandidate(cellId, candidateIndex) {
            if (!cellId) {
                EieState.setStudentSeedError('확정할 후보의 셀 정보를 찾지 못했습니다.');
                EieRouter.open('student-seeds');
                return;
            }
            try {
                await EieApi.confirmStudentCandidate({ cell_id: cellId, candidate_index: candidateIndex });
                EieState.setStudentSeedNotice('학생·연락처·수업배정을 확정했습니다.');
            } catch (error) {
                EieState.setStudentSeedError(error?.message || '학생 후보를 확정하지 못했습니다.');
            }
            EieRouter.open('student-seeds');
        }
    };
})();
