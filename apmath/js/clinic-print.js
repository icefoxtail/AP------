/**
 * AP Math OS [clinic-print.js]
 * 오답 클리닉 출력 센터 1차 구현
 */

const AP_CLINIC_PRINT_STORAGE_KEY = 'AP_CLINIC_PRINT_PAYLOAD';
const AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE = '2026-06-01';

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

function clinicPrintEscapeJsString(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, '\\x27')
        .replace(/"/g, '\\x22')
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n')
        .replace(/</g, '\\x3C')
        .replace(/>/g, '\\x3E')
        .replace(/&/g, '\\x26')
        .replace(/`/g, '\\x60');
}

function clinicPrintNormalizeArchiveFile(file) {
    const raw = String(file || '').trim();
    if (!raw) return '';
    if (/^MIXED:/i.test(raw)) return raw;
    if (/^https?:\/\//i.test(raw)) return raw;
    let path = raw.replace(/^archive\//, '').replace(/^\.\//, '').replace(/^\//, '');
    if (!path.endsWith('.js')) path += '.js';
    if (!/^(exams|assets|data)\//.test(path)) path = `exams/${path}`;
    return path;
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

function clinicPrintGetActiveClasses() {
    return (state.db.classes || [])
        .filter(cls => Number(cls.is_active ?? 1) !== 0)
        .sort((a, b) =>
            String(a.grade || '').localeCompare(String(b.grade || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
}

function clinicPrintGetClassStudents(classId) {
    if (typeof apmsGetStudentsForClass === 'function') {
        return apmsGetStudentsForClass(classId)
            .filter(student => String(student.status || '재원') === '재원')
            .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
    }

    const ids = new Set((state.db.class_students || [])
        .filter(row => String(row.class_id) === String(classId))
        .map(row => String(row.student_id)));

    return (state.db.students || [])
        .filter(student => ids.has(String(student.id)) && String(student.status || '재원') === '재원')
        .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function clinicPrintGetSessionArchiveFile(session) {
    return String(session?.archive_file || '').trim();
}

function clinicPrintIsOnOrAfterFromDate(value) {
    const date = String(value || '').slice(0, 10);
    if (!date) return true;
    return date >= AP_CLINIC_PRINT_ASSIGNMENT_FROM_DATE;
}

function clinicPrintMergeClassAssignments(rows) {
    if (!Array.isArray(rows) || !rows.length) return;
    if (!state.db) state.db = {};
    const current = Array.isArray(state.db.class_exam_assignments) ? state.db.class_exam_assignments : [];
    const byKey = new Map(current.map(row => [
        String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`),
        row
    ]));
    rows.forEach(row => {
        const key = String(row.id || `${row.class_id}|${row.exam_date}|${row.exam_title}|${row.archive_file || ''}`);
        byKey.set(key, row);
    });
    state.db.class_exam_assignments = [...byKey.values()];
}

async function clinicPrintRefreshClassAssignments(classId) {
    if (!classId || typeof api === 'undefined' || typeof api.get !== 'function') return false;
    try {
        const res = await api.get(`class-exam-assignments?class=${encodeURIComponent(classId)}`);
        clinicPrintMergeClassAssignments(res.assignments || res.items || []);
        return true;
    } catch (e) {
        console.warn('[clinic-print] class exam assignment refresh failed:', e);
        return false;
    }
}

function clinicPrintGetClassExamAssignments(classId) {
    return (state.db.class_exam_assignments || state.db.exam_assignments || [])
        .filter(row => String(row.class_id || '') === String(classId || ''))
        .filter(row => clinicPrintIsOnOrAfterFromDate(row.exam_date || row.created_at || row.updated_at));
}

function clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount) {
    const normalizedArchive = clinicPrintNormalizeArchiveFile(archiveFile || '');
    const exactKey = clinicPrintMakeExamKey(examDate, examTitle, normalizedArchive, questionCount);
    if (grouped[exactKey]) return grouped[exactKey];

    return Object.values(grouped).find(group =>
        String(group.examDate || '') === String(examDate || '') &&
        String(group.examTitle || '') === String(examTitle || '') &&
        clinicPrintNormalizeArchiveFile(group.archiveFile || '') === normalizedArchive
    ) || null;
}

function clinicPrintEnsureExamGroup(grouped, source) {
    const archiveFile = clinicPrintNormalizeArchiveFile(source.archiveFile || source.archive_file || '');
    const questionCount = Number(source.questionCount || source.question_count || 0);
    const examDate = source.examDate || source.exam_date || '';
    const examTitle = source.examTitle || source.exam_title || '시험명 없음';
    const matched = clinicPrintGetMatchingExamGroup(grouped, examDate, examTitle, archiveFile, questionCount);
    if (matched) {
        if (!matched.archiveFile && archiveFile) matched.archiveFile = archiveFile;
        if (!Number(matched.questionCount || 0) && questionCount) matched.questionCount = questionCount;
        if (source.assignment) matched.assignment = source.assignment;
        matched.printable = !!matched.archiveFile;
        return matched;
    }

    const key = clinicPrintMakeExamKey(examDate, examTitle, archiveFile, questionCount);
    grouped[key] = {
        examKey: key,
        examTitle,
        examDate,
        archiveFile,
        questionCount,
        sessions: [],
        wrongCount: 0,
        printable: !!archiveFile,
        assignment: source.assignment || null
    };
    return grouped[key];
}

function clinicPrintGetClassExamGroups(classId) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const grouped = {};

    clinicPrintGetClassExamAssignments(classId).forEach(assignment => {
        clinicPrintEnsureExamGroup(grouped, {
            examTitle: assignment.exam_title || '',
            examDate: assignment.exam_date || '',
            archiveFile: assignment.archive_file || '',
            questionCount: Number(assignment.question_count || 0),
            assignment
        });
    });

    (state.db.exam_sessions || []).forEach(session => {
        if (!studentIds.has(String(session.student_id))) return;
        if (!clinicPrintIsOnOrAfterFromDate(session.exam_date || session.created_at || session.updated_at)) return;

        const archiveFile = clinicPrintGetSessionArchiveFile(session);
        const questionCount = Number(session.question_count || 0);
        const group = clinicPrintEnsureExamGroup(grouped, {
            examTitle: session.exam_title || '',
            examDate: session.exam_date || '',
            archiveFile,
            questionCount
        });

        group.sessions.push(session);
        group.wrongCount += clinicPrintGetWrongIdsBySession(session.id).length;
    });

    return Object.values(grouped)
        .filter(group => group.printable || group.sessions.length > 0)
        .sort((a, b) => String(b.examDate || '').localeCompare(String(a.examDate || '')) || String(b.examTitle || '').localeCompare(String(a.examTitle || ''), 'ko'));
}

function clinicPrintGetSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);

    return (state.db.exam_sessions || []).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        const key = clinicPrintMakeExamKey(session.exam_date, session.exam_title, clinicPrintGetSessionArchiveFile(session), Number(session.question_count || 0));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return key === examGroupKey || (
            String(session.exam_date || '') === group.examDate &&
            String(session.exam_title || '') === group.examTitle &&
            String(clinicPrintGetSessionArchiveFile(session) || '') === String(group.archiveFile || '') &&
            countsCompatible
        );
    });
}

function clinicPrintGetWrongIdsBySession(sessionId) {
    const rows = typeof apmsGetWrongAnswersForSession === 'function'
        ? apmsGetWrongAnswersForSession(sessionId)
        : (state.db.wrong_answers || []).filter(row => String(row.session_id) === String(sessionId));

    return rows
        .map(row => Number(row.question_id))
        .filter(no => Number.isFinite(no) && no > 0)
        .sort((a, b) => a - b);
}

function clinicPrintFindBlueprint(session, questionNo) {
    const archiveFile = clinicPrintGetSessionArchiveFile(session);
    if (!archiveFile) return null;

    if (typeof apmsGetExamBlueprintByArchiveQuestion === 'function') {
        const direct = apmsGetExamBlueprintByArchiveQuestion(archiveFile, questionNo);
        if (direct) return direct;
    }

    return (state.db.exam_blueprints || []).find(bp => {
        const bpFile = clinicPrintNormalizeArchiveFile(bp.archive_file || '');
        return bpFile === archiveFile && Number(bp.question_no) === Number(questionNo);
    }) || null;
}

function clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, options = {}) {
    const selectedExams = new Set(selectedExamKeys || []);
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const classStudents = clinicPrintGetClassStudents(classId);
    const studentMap = new Map(classStudents.map(student => [String(student.id), student]));
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

function clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, selectedStudentIds) {
    const selectedStudents = new Set((selectedStudentIds || []).map(id => String(id)));
    const counts = {};

    (selectedExamKeys || []).forEach(examKey => {
        const studentIds = new Set();
        clinicPrintGetSessionsForExamGroup(classId, examKey).forEach(session => {
            const studentId = String(session.student_id || '');
            if (!studentId || (selectedStudents.size && !selectedStudents.has(studentId))) return;
            studentIds.add(studentId);
        });
        counts[examKey] = studentIds.size;
    });

    return counts;
}

function clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts = {}) {
    const map = {};

    (studentWrongItems || []).forEach(student => {
        (student.wrongItems || []).forEach(item => {
            const key = `${clinicPrintNormalizeArchiveFile(item.archiveFile)}|${Number(item.questionNo)}`;
            const totalCount = Number(examCohortCounts[item.examKey] || 0);
            if (!map[key]) {
                map[key] = {
                    itemKey: key,
                    examTitle: item.examTitle || '',
                    examDate: item.examDate || '',
                    examKey: item.examKey || '',
                    archiveFile: clinicPrintNormalizeArchiveFile(item.archiveFile),
                    questionNo: Number(item.questionNo),
                    wrongCount: 0,
                    totalCount,
                    correctRate: null,
                    wrongStudents: [],
                    unitKey: item.unitKey || '',
                    unit: item.unit || '',
                    course: item.course || '',
                    cluster: item.cluster || ''
                };
            }

            if (totalCount && totalCount > Number(map[key].totalCount || 0)) {
                map[key].totalCount = totalCount;
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

    return Object.values(map).map(item => {
        const total = Number(item.totalCount || 0);
        return {
            ...item,
            correctRate: total ? Math.max(0, Math.min(100, Math.round(((total - Number(item.wrongCount || 0)) / total) * 100))) : null
        };
    }).sort((a, b) =>
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
    const examCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, selectedStudentIds);
    const classWrongItems = clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts);
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
                archiveFile: group.archiveFile || '',
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
        const payloadJson = JSON.stringify(payload);
        sessionStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
        localStorage.setItem('AP_CLINIC_PRINT_PAYLOAD', payloadJson);
    } catch (e) {
        toast('오답지 데이터를 저장하지 못했습니다.', 'error');
        return;
    }

    const engineUrl = new URL('wrong_print_engine.html', window.location.href).toString();
    const win = window.open(engineUrl, '_blank', 'noopener');
    if (!win) {
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
        root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">시험을 선택하세요.</div>';
        return;
    }

    if (!studentItems.length) {
        root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">선택한 시험에 출력 가능한 오답이 없습니다.</div>';
        return;
    }

    root.innerHTML = studentItems.map(row => `
        <label style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 12px; border:1px solid var(--border); border-radius:12px; background:var(--surface);">
            <span style="display:flex; align-items:center; gap:8px; min-width:0;">
                <input type="checkbox" name="clinic-print-student" value="${clinicPrintEscapeAttr(row.studentId)}" checked>
                <span style="font-size:13px; font-weight:500; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${clinicPrintEscapeHtml(row.studentName)}</span>
            </span>
            <span style="font-size:12px; font-weight:500; color:var(--error); white-space:nowrap;">${row.wrongItems.length}문항</span>
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

function openClinicCenter(classId = '') {
    const hasClassId = !!String(classId || '').trim();
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

    if (!hasClassId) {
        openClinicClassPicker();
        return;
    }

    showModal('클리닉', `
        <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px;">
            <button class="btn apms-button apms-button--quiet" style="min-height:68px; border-radius:14px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:15px; font-weight:500; box-shadow:none;" onclick="if('${safeClassIdForJs}'){ openClinicPrintCenter('${safeClassIdForJs}'); } else { toast('반 화면에서 이용하세요.', 'info'); }">오답</button>
            <button class="btn apms-button apms-button--quiet" style="min-height:68px; border-radius:14px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:15px; font-weight:500; box-shadow:none;" onclick="clinicPrintOpenSimilarMenu('${safeClassIdForJs}')">유사문항</button>
        </div>
        <style>
            @media (max-width:520px) {
                #modal-body > div { grid-template-columns:1fr !important; }
            }
        </style>
    `);
}

function openClinicClassPicker() {
    const classes = clinicPrintGetActiveClasses();
    const currentClassId = String(state.ui?.currentClassId || '');

    if (!classes.length) {
        toast('선택할 반이 없습니다.', 'warn');
        return;
    }

    const classRows = classes.map(cls => {
        const safeClassId = clinicPrintEscapeJsString(cls.id);
        const selected = String(cls.id) === currentClassId;
        const meta = [cls.grade, cls.teacher_name, cls.schedule_days || cls.day_group, cls.time_label]
            .filter(Boolean)
            .join(' · ');
        return `
            <button type="button" class="btn apms-button apms-button--quiet" style="width:100%; min-height:54px; display:flex; flex-direction:column; align-items:flex-start; justify-content:center; gap:3px; padding:10px 12px; border-radius:12px; border:1px solid ${selected ? 'var(--primary)' : 'var(--border)'}; background:${selected ? 'rgba(26,92,255,0.08)' : 'var(--surface)'}; color:var(--text); box-shadow:none;" onclick="openClinicCenter('${safeClassId}')">
                <span style="font-size:14px; font-weight:600; line-height:1.35;">${clinicPrintEscapeHtml(cls.name || '반 이름 없음')}</span>
                <span style="font-size:11px; font-weight:500; color:var(--secondary); line-height:1.35;">${clinicPrintEscapeHtml(meta || '반 정보 없음')}</span>
            </button>
        `;
    }).join('');

    showModal('클리닉 반 선택', `
        <div style="display:flex; flex-direction:column; gap:10px; max-height:62vh; overflow:auto;">
            ${classRows}
        </div>
    `);
}

function clinicPrintOpenSimilarMenu(classId = '') {
    const hasClassId = !!String(classId || '').trim();

    if (hasClassId) {
        if (typeof openClinicSimilarForClass === 'function') {
            openClinicSimilarForClass(classId);
            return;
        }
        if (typeof openClinicBasketForClass === 'function') {
            openClinicBasketForClass(classId);
            return;
        }
        toast('준비 중입니다.', 'info');
        return;
    }

    if (typeof openClinicBasket === 'function') {
        openClinicBasket();
        return;
    }

    toast('준비 중입니다.', 'info');
}

async function openClinicPrintCenter(classId, options = {}) {
    const cls = clinicPrintGetClass(classId);
    if (!options.skipAssignmentRefresh) {
        await clinicPrintRefreshClassAssignments(classId);
    }
    const groups = clinicPrintGetClassExamGroups(classId);
    const printableGroups = groups.filter(group => group.printable);
    const initialKeys = printableGroups.length ? [printableGroups[0].examKey] : [];
    const safeClassIdForJs = clinicPrintEscapeJsString(classId);

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
                    <input type="checkbox" name="clinic-print-exam" value="${clinicPrintEscapeAttr(group.examKey)}" ${checked} ${disabled} onchange="clinicPrintUpdateStudentList('${safeClassIdForJs}')" style="margin-top:3px;">
                    <span style="min-width:0; display:block;">
                        <span style="display:block; font-size:13px; font-weight:500; color:var(--text); line-height:1.35;">${clinicPrintEscapeHtml(group.examDate || '')} ${clinicPrintEscapeHtml(group.examTitle || '시험명 없음')}</span>
                        <span style="display:block; margin-top:3px; font-size:11px; font-weight:500; color:${tone}; line-height:1.45;">${clinicPrintEscapeHtml(status)}</span>
                    </span>
                </label>
            `;
        }).join('')
        : '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">시험 기록이 없습니다.</div>';

    showModal('오답 클리닉 출력 센터', `
        <div style="display:flex; flex-direction:column; gap:16px;">
            <div style="background:var(--bg); border:1px solid transparent; border-radius:14px; padding:12px 14px;">
                <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35;">${clinicPrintEscapeHtml(cls?.name || '반')}</div>
                <div id="clinic-print-summary" style="margin-top:4px; font-size:11px; font-weight:500; color:var(--secondary); line-height:1.45;">선택 시험 0개 · 오답 학생 0명 · 오답 0문항</div>
            </div>

            <section>
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:8px;">출력 방식</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <label style="display:flex; align-items:center; gap:8px; padding:11px 12px; border:1px solid var(--border); border-radius:12px; font-size:13px; font-weight:500;">
                        <input type="radio" name="clinic-print-mode" value="student" checked> 학생별
                    </label>
                    <label style="display:flex; align-items:center; gap:8px; padding:11px 12px; border:1px solid var(--border); border-radius:12px; font-size:13px; font-weight:500;">
                        <input type="radio" name="clinic-print-mode" value="class"> 반별
                    </label>
                </div>
            </section>

            <section>
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:12px; font-weight:500; color:var(--secondary);">시험 목록</div>
                    <button class="btn apms-button apms-button--quiet" style="min-height:30px; padding:5px 9px; font-size:11px; border-radius:8px;" onclick="document.querySelectorAll('input[name=\\'clinic-print-exam\\']:not(:disabled)').forEach(el=>el.checked=true); clinicPrintUpdateStudentList('${safeClassIdForJs}');">전체 선택</button>
                </div>
                <div style="display:flex; flex-direction:column; gap:8px; max-height:230px; overflow:auto;">${examHtml}</div>
            </section>

            <section>
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:12px; font-weight:500; color:var(--secondary);">학생</div>
                    <button class="btn apms-button apms-button--quiet" style="min-height:30px; padding:5px 9px; font-size:11px; border-radius:8px;" onclick="document.querySelectorAll('input[name=\\'clinic-print-student\\']').forEach(el=>el.checked=true);">전체 선택</button>
                </div>
                <div id="clinic-print-student-list" style="display:flex; flex-direction:column; gap:8px; max-height:250px; overflow:auto;"></div>
            </section>

            <button class="btn apms-button apms-button--primary btn-primary" style="width:100%; min-height:48px; border-radius:14px; font-size:14px; font-weight:500;" onclick="clinicPrintSubmit('${safeClassIdForJs}')">오답지 만들기</button>
        </div>
    `);

    setTimeout(() => clinicPrintUpdateStudentList(classId), 0);
}
