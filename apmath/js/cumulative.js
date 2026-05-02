/**
 * AP Math OS [cumulative.js]
 * School exam cumulative records. This is separate from QR/OMR exam_sessions.
 */

function getCumulativeClassIdForStudent(studentId) {
    const mapping = (state.db.class_students || []).find(m => String(m.student_id) === String(studentId));
    return mapping ? String(mapping.class_id) : '';
}

function getCumulativeClassName(classId) {
    const cls = (state.db.classes || []).find(c => String(c.id) === String(classId));
    return cls ? cls.name : '';
}

function getCumulativeStudent(studentId) {
    return (state.db.students || []).find(s => String(s.id) === String(studentId));
}

function getCumulativeExamTypeLabel(type) {
    const map = { midterm: '중간', final: '기말', performance: '수행', etc: '기타' };
    return map[type] || type || '기타';
}

function getCumulativeGradeRankText(value) {
    const text = String(value || '');
    const order = ['중1', '중2', '중3', '고1', '고2', '고3'];
    const idx = order.findIndex(g => text.includes(g));
    return idx === -1 ? order.length : idx;
}

function getCumulativeVisibleStudents(filters = {}) {
    let students = (state.db.students || []).filter(s => s.status === '재원');
    if (filters.classId) {
        const ids = (state.db.class_students || [])
            .filter(m => String(m.class_id) === String(filters.classId))
            .map(m => String(m.student_id));
        students = students.filter(s => ids.includes(String(s.id)));
    }
    if (filters.grade) {
        students = students.filter(s => String(s.grade || '').includes(filters.grade));
    }
    return students.sort((a, b) => {
        const gradeDiff = getCumulativeGradeRankText(a.grade) - getCumulativeGradeRankText(b.grade);
        if (gradeDiff !== 0) return gradeDiff;
        const aClass = getCumulativeClassName(getCumulativeClassIdForStudent(a.id));
        const bClass = getCumulativeClassName(getCumulativeClassIdForStudent(b.id));
        const classDiff = String(aClass || '').localeCompare(String(bClass || ''), 'ko');
        if (classDiff !== 0) return classDiff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function getCumulativeRecordKey(record) {
    return [
        record.exam_year || '',
        record.semester || '',
        record.exam_type || '',
        record.subject || ''
    ].join('|');
}

function getRecentSchoolExamColumns(records, limit = 4) {
    const seen = new Set();
    const columns = [];
    [...records]
        .filter(r => String(r.is_deleted || 0) !== '1')
        .sort((a, b) => {
            const yearDiff = Number(b.exam_year || 0) - Number(a.exam_year || 0);
            if (yearDiff !== 0) return yearDiff;
            return String(b.created_at || '').localeCompare(String(a.created_at || ''));
        })
        .forEach(r => {
            const key = getCumulativeRecordKey(r);
            if (seen.has(key)) return;
            seen.add(key);
            columns.push({
                key,
                examYear: r.exam_year,
                semester: r.semester || '',
                examType: r.exam_type || '',
                subject: r.subject || ''
            });
        });
    return columns.slice(0, limit);
}

function getSchoolExamRecordForCell(records, studentId, column) {
    return records.find(r => String(r.student_id) === String(studentId) && getCumulativeRecordKey(r) === column.key);
}

function renderSchoolExamScoreCell(record) {
    if (!record) return '<span style="color:var(--secondary); font-weight:600;">-</span>';
    const score = record.score;
    const scoreText = score === null || score === undefined || score === '' ? '미응시' : `${score}`;
    const target = record.target_score_snapshot;
    const diff = score !== null && score !== undefined && score !== '' && target !== null && target !== undefined && target !== ''
        ? Number(score) - Number(target)
        : null;
    const diffText = diff === null || !Number.isFinite(diff) ? '' : `<div style="font-size:10px; font-weight:600; color:${diff >= 0 ? 'var(--success)' : 'var(--error)'}; margin-top:2px;">목표 ${diff >= 0 ? '+' : ''}${diff}</div>`;
    return `<button class="btn" style="min-width:58px; padding:7px 8px; min-height:36px; border-radius:10px; background:var(--surface-2); border:1px solid var(--border); font-size:12px; font-weight:700; color:var(--text);" onclick="openSchoolExamRecordModal('${record.id}')">${scoreText}${diffText}</button>`;
}

function computeSchoolExamTrend(records, studentId) {
    const list = records
        .filter(r => String(r.student_id) === String(studentId) && r.score !== null && r.score !== undefined && r.score !== '')
        .sort((a, b) => String(a.created_at || '').localeCompare(String(b.created_at || '')));
    if (!list.length) return { avg: '-', trend: '-' };
    const scores = list.map(r => Number(r.score)).filter(Number.isFinite);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : '-';
    const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[scores.length - 2] : null;
    return { avg, trend: trend === null ? '-' : `${trend >= 0 ? '+' : ''}${trend}` };
}

function openCumulativeOpsModal() {
    const currentYear = new Date().getFullYear();
    const classOptions = (state.db.classes || [])
        .filter(c => Number(c.is_active) !== 0)
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'))
        .map(c => `<option value="${apEscapeHtml(c.id)}">${apEscapeHtml(c.name || '')}</option>`)
        .join('');
    showModal('누적 운영표', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px;">
                <select id="cum-class" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
                    <option value="">전체 반</option>${classOptions}
                </select>
                <select id="cum-grade" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
                    <option value="">전체 학년</option>
                    <option value="중1">중1</option><option value="중2">중2</option><option value="중3">중3</option>
                    <option value="고1">고1</option><option value="고2">고2</option><option value="고3">고3</option>
                </select>
                <input id="cum-year" type="number" class="btn" value="${currentYear}" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="renderSchoolExamCumulativeTable()">
            </div>
            <button class="btn btn-primary" style="width:100%; min-height:44px; font-size:13px; font-weight:700; border-radius:12px;" onclick="openSchoolExamRecordModal()">학교시험 성적 추가</button>
            <div id="school-exam-cumulative-root"></div>
        </div>
    `);
    renderSchoolExamCumulativeTable();
}

function renderSchoolExamCumulativeTable(options = {}) {
    const root = document.getElementById('school-exam-cumulative-root');
    if (!root) return;
    const classId = options.classId !== undefined ? options.classId : (document.getElementById('cum-class')?.value || '');
    const grade = options.grade !== undefined ? options.grade : (document.getElementById('cum-grade')?.value || '');
    const year = options.year !== undefined ? options.year : (document.getElementById('cum-year')?.value || '');
    const filters = { classId, grade };
    const students = getCumulativeVisibleStudents(filters);
    let records = (state.db.school_exam_records || []).filter(r => String(r.is_deleted || 0) !== '1');
    if (year) records = records.filter(r => String(r.exam_year || '') === String(year));
    if (classId) records = records.filter(r => String(r.class_id || getCumulativeClassIdForStudent(r.student_id)) === String(classId));
    if (grade) records = records.filter(r => String(r.grade || getCumulativeStudent(r.student_id)?.grade || '').includes(grade));
    const columns = getRecentSchoolExamColumns(records, 4);

    const header = columns.map(c => `
        <th style="padding:10px 8px; min-width:74px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border); text-align:center;">
            ${apEscapeHtml(c.examYear)}<br>${apEscapeHtml(c.semester || '')} ${apEscapeHtml(getCumulativeExamTypeLabel(c.examType))}<br>${apEscapeHtml(c.subject)}
        </th>
    `).join('');

    const rows = students.map(s => {
        const sid = String(s.id);
        const clsName = getCumulativeClassName(getCumulativeClassIdForStudent(sid));
        const trend = computeSchoolExamTrend(records, sid);
        const cells = columns.map(c => `<td style="padding:8px; text-align:center; border-bottom:1px solid var(--border);">${renderSchoolExamScoreCell(getSchoolExamRecordForCell(records, sid, c))}</td>`).join('');
        return `
            <tr>
                <td style="position:sticky; left:0; z-index:1; background:var(--surface); padding:10px 8px; min-width:120px; border-bottom:1px solid var(--border);">
                    <div style="font-size:13px; font-weight:700; color:var(--text);">${apEscapeHtml(s.name || '')}</div>
                    <div style="font-size:11px; font-weight:600; color:var(--secondary); margin-top:2px;">${apEscapeHtml(clsName)} ${apEscapeHtml(s.grade || '')}</div>
                </td>
                ${cells}
                <td style="padding:8px; min-width:58px; text-align:center; border-bottom:1px solid var(--border); font-size:12px; font-weight:700; color:var(--primary);">${trend.avg}</td>
                <td style="padding:8px; min-width:58px; text-align:center; border-bottom:1px solid var(--border); font-size:12px; font-weight:700; color:${String(trend.trend).startsWith('-') ? 'var(--error)' : 'var(--success)'};">${trend.trend}</td>
                <td style="padding:8px; min-width:64px; text-align:center; border-bottom:1px solid var(--border);">
                    <button class="btn" style="min-height:34px; padding:6px 8px; font-size:11px; font-weight:700; border-radius:9px; background:var(--surface-2); border:1px solid var(--border);" onclick="openSchoolExamRecordModal('', '${sid}')">추가</button>
                </td>
            </tr>
        `;
    }).join('');

    root.innerHTML = `
        <div style="font-size:12px; font-weight:600; color:var(--secondary); line-height:1.45; margin-bottom:8px;">최근 4회 기준 학교시험 누적표입니다. QR/OMR 성적과 별도로 관리됩니다.</div>
        <div style="overflow:auto; border:1px solid var(--border); border-radius:14px; background:var(--surface); max-height:58vh;">
            <table style="width:100%; border-collapse:collapse; min-width:${Math.max(520, 280 + columns.length * 82)}px;">
                <thead>
                    <tr>
                        <th style="position:sticky; left:0; z-index:2; background:var(--surface); padding:10px 8px; min-width:120px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border); text-align:left;">학생</th>
                        ${header || '<th style="padding:14px; font-size:12px; font-weight:600; color:var(--secondary); border-bottom:1px solid var(--border);">기록 없음</th>'}
                        <th style="padding:10px 8px; min-width:58px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">평균</th>
                        <th style="padding:10px 8px; min-width:58px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">등락</th>
                        <th style="padding:10px 8px; min-width:64px; font-size:11px; font-weight:700; color:var(--secondary); border-bottom:1px solid var(--border);">입력</th>
                    </tr>
                </thead>
                <tbody>${rows || `<tr><td colspan="${columns.length + 4}" style="padding:28px; text-align:center; color:var(--secondary); font-size:13px; font-weight:600;">표시할 학생이 없습니다.</td></tr>`}</tbody>
            </table>
        </div>
    `;
}

function openSchoolExamRecordModal(recordId = '', studentId = '') {
    const record = recordId ? (state.db.school_exam_records || []).find(r => String(r.id) === String(recordId)) : null;
    const selectedStudentId = studentId || record?.student_id || '';
    const currentYear = new Date().getFullYear();
    const studentOptions = getCumulativeVisibleStudents({})
        .map(s => `<option value="${apEscapeHtml(s.id)}" ${String(s.id) === String(selectedStudentId) ? 'selected' : ''}>${apEscapeHtml(s.name || '')} ${s.school_name ? `(${apEscapeHtml(s.school_name)})` : ''}</option>`)
        .join('');
    const student = selectedStudentId ? getCumulativeStudent(selectedStudentId) : null;
    const targetScore = record?.target_score_snapshot ?? student?.target_score ?? '';

    showModal(record ? '학교시험 성적 수정' : '학교시험 성적 추가', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <select id="ser-student" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);" onchange="openSchoolExamRecordModal('${recordId}', this.value)">
                <option value="">학생 선택</option>${studentOptions}
            </select>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-school" class="btn" value="${apEscapeHtml(record?.school_name || student?.school_name || '')}" placeholder="학교" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <input id="ser-grade" class="btn" value="${apEscapeHtml(record?.grade || student?.grade || '')}" placeholder="학년" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-year" type="number" class="btn" value="${record?.exam_year || currentYear}" placeholder="연도" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <select id="ser-semester" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                    ${['1학기','2학기'].map(v => `<option value="${v}" ${String(record?.semester || '') === v ? 'selected' : ''}>${v}</option>`).join('')}
                </select>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <select id="ser-type" class="btn" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                    ${[['midterm','중간'],['final','기말'],['performance','수행'],['etc','기타']].map(([v, label]) => `<option value="${v}" ${String(record?.exam_type || 'midterm') === v ? 'selected' : ''}>${label}</option>`).join('')}
                </select>
                <input id="ser-subject" class="btn" value="${apEscapeHtml(record?.subject || '수학')}" placeholder="과목" style="min-height:44px; text-align:left; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <input id="ser-score" type="number" class="btn" value="${record?.score ?? ''}" placeholder="점수/미응시 공란" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
                <input id="ser-target" type="number" class="btn" value="${targetScore}" placeholder="목표점수" style="min-height:44px; font-size:13px; font-weight:600; background:var(--surface-2); border:1px solid var(--border);">
            </div>
            <textarea id="ser-memo" class="btn" placeholder="메모" style="height:84px; text-align:left; resize:vertical; font-size:13px; font-weight:500; line-height:1.6; background:var(--surface-2); border:1px solid var(--border);">${apEscapeHtml(record?.memo || '')}</textarea>
            <button class="btn btn-primary" style="width:100%; min-height:48px; font-size:14px; font-weight:700; border-radius:12px;" onclick="saveSchoolExamRecord('${recordId || ''}')">저장</button>
            ${record ? `<button class="btn" style="width:100%; min-height:42px; font-size:13px; font-weight:700; color:var(--error); background:rgba(255,71,87,0.08); border:1px solid rgba(255,71,87,0.16); border-radius:12px;" onclick="deleteSchoolExamRecord('${record.id}')">삭제</button>` : ''}
        </div>
    `);
}

async function saveSchoolExamRecord(recordId = '') {
    const studentId = document.getElementById('ser-student')?.value || '';
    if (!studentId) return toast('학생을 선택하세요.', 'warn');
    const student = getCumulativeStudent(studentId);
    const payload = {
        studentId,
        classId: getCumulativeClassIdForStudent(studentId),
        schoolName: document.getElementById('ser-school')?.value.trim() || student?.school_name || '',
        grade: document.getElementById('ser-grade')?.value.trim() || student?.grade || '',
        examYear: Number(document.getElementById('ser-year')?.value || 0),
        semester: document.getElementById('ser-semester')?.value || '',
        examType: document.getElementById('ser-type')?.value || 'midterm',
        subject: document.getElementById('ser-subject')?.value.trim() || '수학',
        score: document.getElementById('ser-score')?.value ?? '',
        targetScoreSnapshot: document.getElementById('ser-target')?.value ?? '',
        memo: document.getElementById('ser-memo')?.value.trim() || ''
    };
    if (!payload.examYear || !payload.examType || !payload.subject) return toast('연도, 시험유형, 과목을 확인하세요.', 'warn');

    const r = recordId
        ? await api.patch(`school-exam-records/${recordId}`, payload)
        : await api.post('school-exam-records', payload);
    if (r?.success) {
        toast('학교시험 성적이 저장되었습니다.', 'success');
        await loadData();
        openCumulativeOpsModal();
    } else {
        toast(r?.message || '학교시험 성적 저장에 실패했습니다.', 'warn');
    }
}

async function deleteSchoolExamRecord(recordId) {
    if (!recordId) return;
    if (!confirm('학교시험 성적 기록을 삭제할까요?')) return;
    const r = await api.delete('school-exam-records', recordId);
    if (r?.success) {
        toast('학교시험 성적 기록이 삭제되었습니다.', 'info');
        await loadData();
        openCumulativeOpsModal();
    } else {
        toast('학교시험 성적 삭제에 실패했습니다.', 'warn');
    }
}
