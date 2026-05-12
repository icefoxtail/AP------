/**
 * AP Math OS [clinic-print.js]
 * 오답 클리닉 출력 센터 1차 구현
 */

const AP_CLINIC_PRINT_STORAGE_KEY = 'AP_CLINIC_PRINT_PAYLOAD';

function clinicPrintEscapeHtml(value) {
    if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[ch]));
}

function clinicPrintEscapeAttr(value) {
    return clinicPrintEscapeHtml(value).replace(/`/g, '&#96;');
}

function clinicPrintNormalizeArchiveFile(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw;
    if (raw.startsWith('exams/')) return raw;
    return `exams/${raw.replace(/^\.\//, '')}`;
}

function clinicPrintMakeExamKey(examDate, examTitle, archiveFile, questionCount) {
    return [
        String(examDate || ''),
        String(examTitle || ''),
        clinicPrintNormalizeArchiveFile(archiveFile || ''),
        String(questionCount || 0)
    ].join('|');
}

function clinicPrintParseExamKey(key) {
    const parts = String(key || '').split('|');
    return {
        examDate: parts[0] || '',
        examTitle: parts[1] || '',
        archiveFile: parts[2] || '',
        questionCount: Number(parts[3] || 0)
    };
}

function clinicPrintGetClass(classId) {
    return (state.db.classes || []).find(c => String(c.id) === String(classId)) || null;
}

function clinicPrintGetClassStudents(classId) {
    const ids = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));

    return (state.db.students || [])
        .filter(student => ids.has(String(student.id)) && String(student.status || '재원') === '재원')
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function clinicPrintGetSessionArchiveFile(session) {
    return clinicPrintNormalizeArchiveFile(session?.archive_file || '');
}

function clinicPrintGetClassExamGroups(classId) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const grouped = {};

    (state.db.exam_sessions || []).forEach(session => {
        if (!studentIds.has(String(session.student_id))) return;

        const archiveFile = clinicPrintGetSessionArchiveFile(session);
        const questionCount = Number(session.question_count || 0);
        const key = clinicPrintMakeExamKey(session.exam_date, session.exam_title, archiveFile, questionCount);

        if (!grouped[key]) {
            grouped[key] = {
                examKey: key,
                examTitle: session.exam_title || '시험명 없음',
                examDate: session.exam_date || '',
                archiveFile,
                questionCount,
                sessions: [],
                wrongCount: 0,
                printable: !!archiveFile
            };
        }

        grouped[key].sessions.push(session);
        grouped[key].wrongCount += clinicPrintGetWrongIdsBySession(session.id).length;
    });

    return Object.values(grouped)
        .filter(group => group.sessions.length > 0)
        .sort((a, b) => String(b.examDate || '').localeCompare(String(a.examDate || '')) || String(b.examTitle || '').localeCompare(String(a.examTitle || ''), 'ko'));
}

function clinicPrintGetSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);

    return (state.db.exam_sessions || []).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        const key = clinicPrintMakeExamKey(session.exam_date, session.exam_title, clinicPrintGetSessionArchiveFile(session), Number(session.question_count || 0));
        return key === examGroupKey || (
            String(session.exam_date || '') === group.examDate &&
            String(session.exam_title || '') === group.examTitle &&
            clinicPrintGetSessionArchiveFile(session) === group.archiveFile &&
            Number(session.question_count || 0) === group.questionCount
        );
    });
}

function clinicPrintGetWrongIdsBySession(sessionId) {
    return (state.db.wrong_answers || [])
        .filter(row => String(row.session_id) === String(sessionId))
        .map(row => Number(row.question_id))
        .filter(no => Number.isFinite(no) && no > 0)
        .sort((a, b) => a - b);
}

function clinicPrintFindBlueprint(session, questionNo) {
    const archiveFile = clinicPrintGetSessionArchiveFile(session);
    if (!archiveFile) return null;

    return (state.db.exam_blueprints || []).find(bp => {
        const bpFile = clinicPrintNormalizeArchiveFile(bp.archive_file || '');
        return bpFile === archiveFile && Number(bp.question_no) === Number(questionNo);
    }) || null;
}

function clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, options = {}) {
    const selectedExams = new Set(selectedExamKeys || []);
    const selectedStudents = new Set(selectedStudentIds || []);
    const studentMap = new Map(clinicPrintGetClassStudents(classId).map(student => [String(student.id), student]));
    const rowsByStudent = {};

    selectedExams.forEach(examKey => {
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student || (selectedStudents.size && !selectedStudents.has(studentId))) return;

            const archiveFile = clinicPrintGetSessionArchiveFile(session);
            if (!archiveFile) return;

            const wrongItems = clinicPrintGetWrongIdsBySession(session.id).map(questionNo => {
                const bp = clinicPrintFindBlueprint(session, questionNo);
                return {
                    examKey,
                    examTitle: session.exam_title || '',
                    examDate: session.exam_date || '',
                    archiveFile,
                    questionNo,
                    unitKey: bp?.standard_unit_key || '',
                    unit: bp?.standard_unit || '',
                    course: bp?.standard_course || '',
                    cluster: bp?.concept_cluster_key || ''
                };
            });

            if (!wrongItems.length && options.excludeEmpty !== false) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return Object.values(rowsByStudent)
        .map(row => ({
            ...row,
            wrongItems: row.wrongItems.sort((a, b) =>
                String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                Number(a.questionNo) - Number(b.questionNo)
            )
        }))
        .filter(row => options.excludeEmpty === false || row.wrongItems.length > 0)
        .sort((a, b) => String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko'));
}

function clinicPrintBuildClassWrongItems(studentWrongItems) {
    const map = {};

    (studentWrongItems || []).forEach(student => {
        (student.wrongItems || []).forEach(item => {
            const key = `${clinicPrintNormalizeArchiveFile(item.archiveFile)}|${Number(item.questionNo)}`;
            if (!map[key]) {
                map[key] = {
                    itemKey: key,
                    examTitle: item.examTitle || '',
                    examDate: item.examDate || '',
                    archiveFile: clinicPrintNormalizeArchiveFile(item.archiveFile),
                    questionNo: Number(item.questionNo),
                    wrongCount: 0,
                    wrongStudents: [],
                    unitKey: item.unitKey || '',
                    unit: item.unit || '',
                    course: item.course || '',
                    cluster: item.cluster || ''
                };
            }

            if (!map[key].wrongStudents.some(row => String(row.studentId) === String(student.studentId))) {
                map[key].wrongStudents.push({
                    studentId: student.studentId,
                    studentName: student.studentName
                });
                map[key].wrongCount += 1;
            }
        });
    });

    return Object.values(map).sort((a, b) =>
        Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
        String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
        Number(a.questionNo) - Number(b.questionNo)
    );
}

function clinicPrintBuildPayload(classId, config) {
    const cls = clinicPrintGetClass(classId);
    const selectedExamKeys = config.selectedExamKeys || [];
    const selectedStudentIds = config.selectedStudentIds || [];
    const mode = config.mode || 'student';
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, { excludeEmpty: true });
    const classWrongItems = clinicPrintBuildClassWrongItems(studentWrongItems);
    const examMap = new Map(clinicPrintGetClassExamGroups(classId).map(group => [group.examKey, group]));
    const today = new Date().toLocaleDateString('sv-SE');

    return {
        version: '1.0',
        mode,
        printTitle: `${cls?.name || '반'} 오답 클리닉`,
        classId,
        className: cls?.name || '',
        range: {
            type: selectedExamKeys.length > 1 ? 'multi_exam' : 'single_exam',
            from: '',
            to: ''
        },
        options: {
            groupByStudent: mode === 'student',
            groupByExam: true,
            dedupeByQuestion: mode === 'class',
            showWrongStudents: true,
            pageBreakByStudent: true,
            includeAnswer: false,
            includeSolution: false,
            includeHomeworkCheckBox: true
        },
        exams: selectedExamKeys.map(key => {
            const group = examMap.get(key) || clinicPrintParseExamKey(key);
            return {
                examKey: key,
                examTitle: group.examTitle || '',
                examDate: group.examDate || '',
                archiveFile: clinicPrintNormalizeArchiveFile(group.archiveFile || ''),
                questionCount: Number(group.questionCount || 0)
            };
        }),
        students: studentWrongItems,
        classWrongItems,
        createdAt: new Date().toISOString(),
        createdDate: today
    };
}

function clinicPrintOpenEngine(payload) {
    try {
        sessionStorage.setItem(AP_CLINIC_PRINT_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        toast('오답지 데이터를 저장하지 못했습니다.', 'error');
        return;
    }

    const popup = window.open('wrong_print_engine.html', '_blank', 'noopener');
    if (!popup) {
        toast('팝업 차단을 해제하세요', 'warn');
    }
}

function clinicPrintGetCheckedValues(name) {
    return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(input => input.value);
}

function clinicPrintUpdateStudentList(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const selectedStudentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const studentItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, Array.from(selectedStudentIds), { excludeEmpty: true });
    const root = document.getElementById('clinic-print-student-list');
    const countEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    if (countEl) {
        const totalWrong = studentItems.reduce((sum, row) => sum + row.wrongItems.length, 0);
        countEl.textContent = `선택 시험 ${selectedExamKeys.length}개 · 오답 학생 ${studentItems.length}명 · 오답 ${totalWrong}문항`;
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:700; text-align:center;">시험을 선택하세요.</div>';
        return;
    }

    if (!studentItems.length) {
        root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:700; text-align:center;">선택한 시험에 출력 가능한 오답이 없습니다.</div>';
        return;
    }

    root.innerHTML = studentItems.map(row => `
        <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:1px solid var(--border); border-radius:12px; background:var(--surface);">
            <span style="display:flex; align-items:center; gap:8px; min-width:0;">
                <input type="checkbox" name="clinic-print-student" value="${clinicPrintEscapeAttr(row.studentId)}" checked>
                <span style="font-size:13px; font-weight:800; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${clinicPrintEscapeHtml(row.studentName)}</span>
            </span>
            <span style="font-size:12px; font-weight:800; color:var(--error); white-space:nowrap;">${row.wrongItems.length}문항</span>
        </label>
    `).join('');
}

function clinicPrintSubmit(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const selectedStudentIds = clinicPrintGetCheckedValues('clinic-print-student');
    const modeEl = document.querySelector('input[name="clinic-print-mode"]:checked');
    const mode = modeEl?.value || 'student';

    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    if (!selectedStudentIds.length) {
        toast('출력할 학생을 선택하세요.', 'warn');
        return;
    }

    const payload = clinicPrintBuildPayload(classId, { selectedExamKeys, selectedStudentIds, mode });
    const itemCount = mode === 'class'
        ? payload.classWrongItems.length
        : payload.students.reduce((sum, row) => sum + row.wrongItems.length, 0);

    if (!itemCount) {
        toast('출력 가능한 오답 문항이 없습니다.', 'warn');
        return;
    }

    clinicPrintOpenEngine(payload);
}

function openClinicPrintCenter(classId) {
    const cls = clinicPrintGetClass(classId);
    const groups = clinicPrintGetClassExamGroups(classId);
    const printableGroups = groups.filter(group => group.printable);
    const initialKeys = printableGroups.length ? [printableGroups[0].examKey] : [];

    const examHtml = groups.length
        ? groups.map((group, idx) => {
            const disabled = group.printable ? '' : 'disabled';
            const checked = initialKeys.includes(group.examKey) ? 'checked' : '';
            const status = group.printable
                ? `${group.questionCount || '-'}문항 · 제출 ${group.sessions.length}명 · 오답 ${group.wrongCount}문항`
                : '원문 연결 불가';
            const tone = group.printable ? 'var(--secondary)' : 'var(--error)';
            return `
                <label style="display:flex; align-items:flex-start; gap:10px; padding:12px; border:1px solid var(--border); border-radius:12px; background:${group.printable ? 'var(--surface)' : 'var(--bg)'}; opacity:${group.printable ? '1' : '0.62'};">
                    <input type="checkbox" name="clinic-print-exam" value="${clinicPrintEscapeAttr(group.examKey)}" ${checked} ${disabled} onchange="clinicPrintUpdateStudentList('${clinicPrintEscapeAttr(classId)}')" style="margin-top:3px;">
                    <span style="min-width:0; display:block;">
                        <span style="display:block; font-size:13px; font-weight:800; color:var(--text); line-height:1.35;">${clinicPrintEscapeHtml(group.examDate || '')} ${clinicPrintEscapeHtml(group.examTitle || '시험명 없음')}</span>
                        <span style="display:block; margin-top:3px; font-size:11px; font-weight:700; color:${tone}; line-height:1.45;">${clinicPrintEscapeHtml(status)}</span>
                    </span>
                </label>
            `;
        }).join('')
        : '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:700; text-align:center;">시험 기록이 없습니다.</div>';

    showModal('오답 클리닉 출력 센터', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--bg); border:1px solid transparent; border-radius:14px; padding:12px 14px;">
                <div style="font-size:14px; font-weight:800; color:var(--text); line-height:1.35;">${clinicPrintEscapeHtml(cls?.name || '반')}</div>
                <div id="clinic-print-summary" style="margin-top:4px; font-size:11px; font-weight:700; color:var(--secondary); line-height:1.45;">선택 시험 0개 · 오답 학생 0명 · 오답 0문항</div>
            </div>

            <section>
                <div style="font-size:12px; font-weight:800; color:var(--secondary); margin-bottom:8px;">출력 방식</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <label style="display:flex; align-items:center; gap:8px; padding:11px 12px; border:1px solid var(--border); border-radius:12px; font-size:13px; font-weight:800;">
                        <input type="radio" name="clinic-print-mode" value="student" checked> 학생별
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; padding:11px 12px; border:1px solid var(--border); border-radius:12px; font-size:13px; font-weight:800;">
                        <input type="radio" name="clinic-print-mode" value="class"> 반별
                    </label>
                </div>
            </section>

            <section>
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:12px; font-weight:800; color:var(--secondary);">시험 목록</div>
                    <button class="btn" style="min-height:30px; padding:5px 9px; font-size:11px; border-radius:8px;" onclick="document.querySelectorAll('input[name=\\'clinic-print-exam\\']:not(:disabled)').forEach(el=>el.checked=true); clinicPrintUpdateStudentList('${clinicPrintEscapeAttr(classId)}');">전체 선택</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; max-height:230px; overflow:auto;">${examHtml}</div>
            </section>

            <section>
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:12px; font-weight:800; color:var(--secondary);">학생</div>
                    <button class="btn" style="min-height:30px; padding:5px 9px; font-size:11px; border-radius:8px;" onclick="document.querySelectorAll('input[name=\\'clinic-print-student\\']').forEach(el=>el.checked=true);">전체 선택</button>
                </div>
                <div id="clinic-print-student-list" style="display:flex; flex-direction:column; gap:8px; max-height:250px; overflow:auto;"></div>
            </section>

            <button class="btn btn-primary" style="width:100%; min-height:48px; border-radius:14px; font-size:14px; font-weight:800;" onclick="clinicPrintSubmit('${clinicPrintEscapeAttr(classId)}')">오답지 만들기</button>
        </div>
    `);

    setTimeout(() => clinicPrintUpdateStudentList(classId), 0);
}
