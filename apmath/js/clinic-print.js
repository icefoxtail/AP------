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

function clinicPrintGetClassGrade(classId) {
    return String(clinicPrintGetClass(classId)?.grade || '').trim();
}

function clinicPrintGetGradeClasses(classId) {
    const grade = clinicPrintGetClassGrade(classId);
    if (!grade) return [];
    return clinicPrintGetActiveClasses().filter(cls => String(cls.grade || '').trim() === grade);
}

function clinicPrintGetGradeStudents(classId) {
    const classes = clinicPrintGetGradeClasses(classId);
    const byStudent = new Map();

    classes.forEach(cls => {
        clinicPrintGetClassStudents(cls.id).forEach(student => {
            const studentId = String(student.id || '');
            if (!studentId || byStudent.has(studentId)) return;
            byStudent.set(studentId, {
                ...student,
                classId: cls.id,
                className: cls.name || '',
                teacherName: cls.teacher_name || ''
            });
        });
    });

    return [...byStudent.values()]
        .sort((a, b) =>
            String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
            String(a.name || '').localeCompare(String(b.name || ''), 'ko')
        );
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

function clinicPrintGetGradeSessionsForExamGroup(classId, examGroupKey) {
    const studentIds = new Set(clinicPrintGetGradeStudents(classId).map(student => String(student.id)));
    const group = clinicPrintParseExamKey(examGroupKey);
    const groupArchive = clinicPrintNormalizeArchiveFile(group.archiveFile || '');

    return (state.db.exam_sessions || []).filter(session => {
        if (!studentIds.has(String(session.student_id))) return false;
        const sessionArchive = clinicPrintNormalizeArchiveFile(clinicPrintGetSessionArchiveFile(session));
        const sessionQuestionCount = Number(session.question_count || 0);
        const countsCompatible = !group.questionCount || !sessionQuestionCount || sessionQuestionCount === group.questionCount;
        return !!groupArchive && sessionArchive === groupArchive && countsCompatible;
    });
}

function clinicPrintDedupeLatestSessionByStudent(sessions) {
    const sessionSortValue = session => String(
        session?.updated_at ||
        session?.created_at ||
        session?.submitted_at ||
        session?.completed_at ||
        session?.exam_date ||
        ''
    );
    const sorted = [...(sessions || [])].sort((a, b) =>
        sessionSortValue(b).localeCompare(sessionSortValue(a)) ||
        String(b.id || '').localeCompare(String(a.id || ''))
    );
    const byStudent = new Map();
    sorted.forEach(session => {
        const studentId = String(session.student_id || '');
        if (studentId && !byStudent.has(studentId)) byStudent.set(studentId, session);
    });
    return [...byStudent.values()];
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

function clinicPrintBuildGradeWrongSource(classId, selectedExamKeys) {
    const gradeStudents = clinicPrintGetGradeStudents(classId);
    const studentMap = new Map(gradeStudents.map(student => [String(student.id), student]));
    const rowsByStudent = {};
    const cohortCounts = {};

    (selectedExamKeys || []).forEach(examKey => {
        const sessions = clinicPrintDedupeLatestSessionByStudent(clinicPrintGetGradeSessionsForExamGroup(classId, examKey));
        cohortCounts[examKey] = sessions.length;

        sessions.forEach(session => {
            const studentId = String(session.student_id || '');
            const student = studentMap.get(studentId);
            if (!student) return;

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

            if (!wrongItems.length) return;

            if (!rowsByStudent[studentId]) {
                rowsByStudent[studentId] = {
                    studentId,
                    studentName: student.name || '이름 없음',
                    classId: student.classId || '',
                    className: student.className || '',
                    wrongItems: []
                };
            }
            rowsByStudent[studentId].wrongItems.push(...wrongItems);
        });
    });

    return {
        cohortCounts,
        studentWrongItems: Object.values(rowsByStudent)
            .map(row => ({
                ...row,
                wrongItems: row.wrongItems.sort((a, b) =>
                    String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
                    String(a.examTitle || '').localeCompare(String(b.examTitle || ''), 'ko') ||
                    Number(a.questionNo) - Number(b.questionNo)
                )
            }))
            .sort((a, b) =>
                String(a.className || '').localeCompare(String(b.className || ''), 'ko') ||
                String(a.studentName || '').localeCompare(String(b.studentName || ''), 'ko')
            )
    };
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
    }).sort((a, b) => {
        const aRate = a.correctRate !== null ? a.correctRate : -1;
        const bRate = b.correctRate !== null ? b.correctRate : -1;
        return (bRate - aRate) ||
            String(b.examDate || '').localeCompare(String(a.examDate || '')) ||
            Number(a.questionNo) - Number(b.questionNo);
    });
}

function clinicPrintBuildPayload(classId, config) {
    const cls = clinicPrintGetClass(classId);
    const selectedExamKeys = config.selectedExamKeys || [];
    const selectedStudentIds = config.selectedStudentIds || [];
    const mode = config.mode || 'student';
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, selectedStudentIds, { excludeEmpty: true });
    const examCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, selectedStudentIds);
    const classWrongItems = clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts);
    const gradeSource = mode === 'grade'
        ? clinicPrintBuildGradeWrongSource(classId, selectedExamKeys)
        : { cohortCounts: {}, studentWrongItems: [] };
    const gradeWrongItems = mode === 'grade'
        ? clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts)
        : [];
    const examMap = new Map(clinicPrintGetClassExamGroups(classId).map(group => [group.examKey, group]));
    const today = new Date().toLocaleDateString('sv-SE');
    const gradeName = String(cls?.grade || '').trim();

    return {
        version: '1.0',
        mode,
        printTitle: mode === 'grade' ? `${gradeName || '학년'} 오답 클리닉` : `${cls?.name || '반'} 오답 클리닉`,
        classId,
        className: cls?.name || '',
        gradeName,
        range: {
            type: selectedExamKeys.length > 1 ? 'multi_exam' : 'single_exam',
            from: '',
            to: ''
        },
        options: {
            groupByStudent: mode === 'student',
            groupByExam: true,
            dedupeByQuestion: mode === 'class' || mode === 'grade',
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
        gradeWrongItems,
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

function clinicPrintSwitchMode(classId) {
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';

    document.querySelectorAll('#clinic-print-mode-cards .clinic-mode-card').forEach(card => {
        const active = card.getAttribute('data-mode') === mode;
        card.style.borderColor = active ? 'var(--primary)' : 'var(--border)';
        card.style.background = active ? 'rgba(26,92,255,0.08)' : 'var(--surface)';
        card.style.color = active ? 'var(--primary)' : 'var(--text)';
    });

    const isType = mode === 'type';
    const studentSection = document.getElementById('clinic-print-student-section');
    const typePanel = document.getElementById('clinic-print-type-panel');
    const submitBtn = document.getElementById('clinic-print-submit-btn');
    if (studentSection) studentSection.style.display = isType ? 'none' : '';
    if (typePanel) typePanel.style.display = isType ? 'flex' : 'none';
    if (submitBtn) submitBtn.style.display = '';

    if (isType) {
        clinicPrintRenderTypePanel(classId);
        return;
    }

    clinicPrintUpdateStudentList(classId);
}

// ---- 유형 카드 (최다빈출 / 최다오답 / 단원별) ----

// scope 범위의 dedupe된 공통 오답 문항 목록(정답률·오답수 포함)을 만든다.
// 기존 학생/반/학년 집계 함수를 그대로 재사용한다(신규 마스터 없음).
function clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope) {
    if (scope === 'grade') {
        const gradeSource = clinicPrintBuildGradeWrongSource(classId, selectedExamKeys);
        return clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts);
    }
    const allStudentIds = clinicPrintGetClassStudents(classId).map(student => String(student.id));
    const studentWrongItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, allStudentIds, { excludeEmpty: true });
    const examCohortCounts = clinicPrintBuildExamCohortCounts(classId, selectedExamKeys, allStudentIds);
    return clinicPrintBuildClassWrongItems(studentWrongItems, examCohortCounts);
}

// 최다빈출 = 정답률 50% 이상 / 최다오답 = 정답률 50% 미만, 둘 다 오답수 내림차순.
function clinicPrintFilterTypeItems(items, rateRule) {
    return (items || [])
        .filter(item => {
            const rate = item.correctRate;
            if (rate === null || rate === undefined) return false;
            return rateRule === 'gte50' ? rate >= 50 : rate < 50;
        })
        .sort((a, b) =>
            Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
            Number(b.correctRate || 0) - Number(a.correctRate || 0) ||
            Number(a.questionNo || 0) - Number(b.questionNo || 0)
        );
}

function clinicPrintBuildTypePayload(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const rateRule = typeMode === 'unit'
        ? clinicPrintTypeState.unitRate
        : (typeMode === 'frequent' ? 'gte50' : 'lt50');
    const sourceItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    let typeItems = clinicPrintFilterTypeItems(sourceItems, rateRule);
    const selectedUnitKeys = typeMode === 'unit' ? [...clinicPrintTypeState.unitSelection] : [];
    const unitOrder = [...selectedUnitKeys];

    if (typeMode === 'unit') {
        const orderIndex = new Map(unitOrder.map((key, idx) => [key, idx]));
        typeItems = typeItems
            .filter(item => orderIndex.has(item.unitKey || '__UNCLASSIFIED__'))
            .sort((a, b) => {
                const ak = a.unitKey || '__UNCLASSIFIED__';
                const bk = b.unitKey || '__UNCLASSIFIED__';
                return (orderIndex.get(ak) - orderIndex.get(bk)) ||
                    Number(b.wrongCount || 0) - Number(a.wrongCount || 0) ||
                    Number(a.questionNo || 0) - Number(b.questionNo || 0);
            });
    }

    const payload = clinicPrintBuildPayload(classId, {
        selectedExamKeys,
        selectedStudentIds: clinicPrintGetClassStudents(classId).map(student => String(student.id)),
        mode: scope === 'grade' ? 'grade' : 'class'
    });
    const cls = clinicPrintGetClass(classId);
    const gradeName = String(cls?.grade || '').trim();
    const typeTitle = typeMode === 'unit'
        ? '단원별 오답'
        : (typeMode === 'frequent' ? '최다빈출 오답' : '최다오답');

    return {
        ...payload,
        mode: 'type',
        typeMode,
        scope,
        rateRule,
        selectedUnitKeys,
        unitOrder,
        typeItems,
        classWrongItems: scope === 'class' ? typeItems : [],
        gradeWrongItems: scope === 'grade' ? typeItems : [],
        printTitle: `${scope === 'grade' ? (gradeName || '학년') : (cls?.name || '반')} ${typeTitle}`
    };
}

function clinicPrintSetTypeScope(classId, scope) {
    const input = document.getElementById('clinic-print-type-scope');
    if (input) input.value = scope;
    document.querySelectorAll('#clinic-print-type-scope-toggle .clinic-scope-btn').forEach(btn => {
        const active = btn.getAttribute('data-scope') === scope;
        btn.style.borderColor = active ? 'var(--primary)' : 'var(--border)';
        btn.style.background = active ? 'rgba(26,92,255,0.08)' : 'var(--surface)';
        btn.style.color = active ? 'var(--primary)' : 'var(--text)';
    });
    clinicPrintRenderTypePanel(classId);
}

function clinicPrintSetTypeMode(classId, typeMode) {
    const input = document.getElementById('clinic-print-type-mode');
    if (input) input.value = typeMode;
    document.querySelectorAll('#clinic-print-type-cards .clinic-type-card').forEach(card => {
        const active = card.getAttribute('data-type-mode') === typeMode;
        card.style.borderColor = active ? 'var(--primary)' : 'var(--border)';
        card.style.background = active ? 'rgba(26,92,255,0.08)' : 'var(--surface)';
    });
    clinicPrintRenderTypePanel(classId);
}

function clinicPrintRenderTypePanel(classId) {
    const root = document.getElementById('clinic-print-type-result');
    const summaryEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const typeMode = document.getElementById('clinic-print-type-mode')?.value || 'frequent';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';

    const emptyBox = msg => `<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">${clinicPrintEscapeHtml(msg)}</div>`;

    if (!selectedExamKeys.length) {
        root.innerHTML = emptyBox('시험을 선택하세요.');
        if (summaryEl) summaryEl.textContent = `${scopeLabel} · 시험 미선택`;
        return;
    }

    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);

    if (typeMode === 'unit') {
        clinicPrintRenderUnitMode(classId, scopeLabel);
        return;
    }

    const rateRule = typeMode === 'frequent' ? 'gte50' : 'lt50';
    const filtered = clinicPrintFilterTypeItems(scopeItems, rateRule);
    const typeLabel = typeMode === 'frequent' ? '최다빈출 (정답률 50% 이상)' : '최다오답 (정답률 50% 미만)';

    if (summaryEl) summaryEl.textContent = `${scopeLabel} · ${typeMode === 'frequent' ? '최다빈출' : '최다오답'} · ${filtered.length}문항`;

    if (!filtered.length) {
        root.innerHTML = `<div style="display:flex; flex-direction:column; gap:8px;"><div style="font-size:11px; font-weight:500; color:var(--secondary);">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)}</div>${emptyBox('해당 조건의 오답 문항이 없습니다.')}</div>`;
        return;
    }

    const previewLimit = 12;
    const rows = filtered.slice(0, previewLimit).map(item => {
        const unitText = item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류';
        const rateText = item.correctRate === null || item.correctRate === undefined ? '-' : `${item.correctRate}%`;
        return `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:9px 11px; border:1px solid var(--border); border-radius:10px; background:var(--surface);">
                <span style="min-width:0; display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:12px; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${clinicPrintEscapeHtml(item.examTitle || '시험')} · ${item.questionNo}번</span>
                    <span style="font-size:10px; font-weight:500; color:var(--secondary); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${clinicPrintEscapeHtml(unitText)}</span>
                </span>
                <span style="display:flex; flex-direction:column; align-items:flex-end; gap:2px; white-space:nowrap;">
                    <span style="font-size:11px; font-weight:600; color:var(--text);">정답률 ${rateText}</span>
                    <span style="font-size:10px; font-weight:500; color:var(--error);">오답 ${item.wrongCount}명</span>
                </span>
            </div>
        `;
    }).join('');

    const moreText = filtered.length > previewLimit ? `<div style="font-size:10px; font-weight:500; color:var(--secondary); text-align:center;">외 ${filtered.length - previewLimit}문항</div>` : '';

    root.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="font-size:11px; font-weight:500; color:var(--secondary); line-height:1.45;">${clinicPrintEscapeHtml(typeLabel)} · ${clinicPrintEscapeHtml(scopeLabel)} · 오답수 많은 순</div>
            ${rows}
            ${moreText}
            <div style="padding:11px 12px; border:1px dashed var(--border); border-radius:12px; background:var(--bg); font-size:11px; font-weight:500; color:var(--secondary); line-height:1.5; text-align:center;">오답지 만들기를 누르면 위 조건으로 출력됩니다.</div>
        </div>
    `;
}

// ---- 단원별 오답 드래그 UI (Loop 3) ----

// 유형 패널의 단원 선택/순서 상태. 모달 재생성 시 초기화되며, root 재렌더에는 영향받지 않는다.
const clinicPrintTypeState = { unitSelection: [], unitRate: 'lt50', dragKey: null };

// 과목 prefix 정렬 우선순위. 표준단원키 접두로 마스터 과목 순서를 부여한다(JS아카이브 마스터 테이블 순서 기준).
const CLINIC_COURSE_RANK = {
    'M1': 1, 'M2': 2, 'M3': 3,
    'H22-C': 4, 'H22-C2': 5, 'H22-A': 6, 'H22-M1': 7, 'H22-M2': 8, 'H22-PS': 9, 'H22-GE': 10,
    'H15-SA': 11, 'H15-SB': 12, 'H15-M1': 13, 'H15-M2': 14, 'H15-CALC': 15, 'H15-PS': 16, 'H15-GV': 17
};

// 표준단원키의 숫자 접미(=마스터 Order)와 과목 rank를 추출하는 어댑터.
// 예: "H22-C-06" → { rank:4, num:6 }, "M3-04" → { rank:3, num:4 }
function clinicPrintUnitOrder(unitKey) {
    if (!unitKey) return { rank: 999, num: 999 };
    const parts = String(unitKey).split('-');
    const num = Number(parts[parts.length - 1]);
    const prefix = parts.slice(0, -1).join('-');
    const rank = CLINIC_COURSE_RANK[prefix] != null ? CLINIC_COURSE_RANK[prefix] : 900;
    return { rank, num: Number.isFinite(num) ? num : 999 };
}

function clinicPrintTypeEmptyBox(msg) {
    return `<div style="padding:13px; border:1px dashed var(--border); border-radius:11px; color:var(--secondary); font-size:11px; font-weight:500; text-align:center;">${clinicPrintEscapeHtml(msg)}</div>`;
}

// 현재 범위/정답률 규칙으로 단원 목록을 만든다.
// unitKey 기준으로 그룹핑하고, 마스터 순서로 정렬하며, unitKey 없는 문항은 "기타 / 단원 미분류" 버킷으로 모은다.
function clinicPrintComputeScopeUnits(classId) {
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeItems = clinicPrintGetScopeWrongItems(classId, selectedExamKeys, scope);
    const filtered = clinicPrintFilterTypeItems(scopeItems, clinicPrintTypeState.unitRate);
    const map = new Map();
    filtered.forEach(item => {
        const key = item.unitKey || '__UNCLASSIFIED__';
        if (!map.has(key)) {
            const ord = item.unitKey ? clinicPrintUnitOrder(item.unitKey) : { rank: 999, num: 999 };
            map.set(key, {
                key,
                label: item.unitKey ? (item.unit || item.unitKey) : '기타 / 단원 미분류',
                rank: ord.rank,
                num: ord.num,
                count: 0
            });
        }
        map.get(key).count += 1;
    });
    const units = Array.from(map.values()).sort((a, b) =>
        a.rank - b.rank || a.num - b.num || String(a.label).localeCompare(String(b.label), 'ko')
    );
    return { units, totalFiltered: filtered.length };
}

function clinicPrintRenderUnitMode(classId, scopeLabel) {
    const root = document.getElementById('clinic-print-type-result');
    if (!root) return;
    const isFrequent = clinicPrintTypeState.unitRate === 'gte50';
    const safeClassId = clinicPrintEscapeJsString(classId);
    root.innerHTML = `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div>
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:8px;">유형</div>
                <div id="clinic-print-unit-rate-toggle" style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;">
                    <button type="button" class="clinic-unit-rate-btn" data-rate="gte50" style="min-height:40px; padding:8px 10px; border:1px solid ${isFrequent ? 'var(--primary)' : 'var(--border)'}; border-radius:11px; background:${isFrequent ? 'rgba(26,92,255,0.08)' : 'var(--surface)'}; color:${isFrequent ? 'var(--primary)' : 'var(--text)'}; font-size:12px; font-weight:600; cursor:pointer;" onclick="clinicPrintSetUnitRate('${safeClassId}','gte50')">최다빈출 (50%↑)</button>
                    <button type="button" class="clinic-unit-rate-btn" data-rate="lt50" style="min-height:40px; padding:8px 10px; border:1px solid ${isFrequent ? 'var(--border)' : 'var(--primary)'}; border-radius:11px; background:${isFrequent ? 'var(--surface)' : 'rgba(26,92,255,0.08)'}; color:${isFrequent ? 'var(--text)' : 'var(--primary)'}; font-size:12px; font-weight:600; cursor:pointer;" onclick="clinicPrintSetUnitRate('${safeClassId}','lt50')">최다오답 (50%↓)</button>
                </div>
            </div>
            <div>
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:6px;">마스터 단원</div>
                <div id="clinic-print-unit-master" style="display:flex; flex-direction:column; gap:6px; max-height:200px; overflow:auto;"></div>
            </div>
            <div>
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:6px;">출력할 단원 <span style="font-weight:400;">(드래그 또는 ↑↓로 순서 변경)</span></div>
                <div id="clinic-print-unit-selected" style="display:flex; flex-direction:column; gap:6px; max-height:240px; overflow:auto;"></div>
            </div>
            <div style="padding:11px 12px; border:1px dashed var(--border); border-radius:12px; background:var(--bg); font-size:11px; font-weight:500; color:var(--secondary); line-height:1.5; text-align:center;">오답지 만들기를 누르면 선택한 단원 순서대로 출력됩니다.</div>
        </div>
    `;
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintSetUnitRate(classId, rate) {
    clinicPrintTypeState.unitRate = rate;
    document.querySelectorAll('#clinic-print-unit-rate-toggle .clinic-unit-rate-btn').forEach(btn => {
        const active = btn.getAttribute('data-rate') === rate;
        btn.style.borderColor = active ? 'var(--primary)' : 'var(--border)';
        btn.style.background = active ? 'rgba(26,92,255,0.08)' : 'var(--surface)';
        btn.style.color = active ? 'var(--primary)' : 'var(--text)';
    });
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintRenderUnitLists(classId) {
    const masterEl = document.getElementById('clinic-print-unit-master');
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!masterEl || !selEl) return;

    const { units, totalFiltered } = clinicPrintComputeScopeUnits(classId);
    const byKey = new Map(units.map(u => [u.key, u]));

    // 현재 범위/규칙에 더 이상 존재하지 않는 선택 단원은 정리(누락 방지: 존재하는 것만 유지)
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => byKey.has(k));
    const selectedKeys = clinicPrintTypeState.unitSelection;
    const selectedSet = new Set(selectedKeys);
    const available = units.filter(u => !selectedSet.has(u.key));

    const summaryEl = document.getElementById('clinic-print-summary');
    const scope = document.getElementById('clinic-print-type-scope')?.value || 'class';
    const scopeLabel = scope === 'grade' ? (clinicPrintGetClassGrade(classId) || '학년') + ' 전체' : '현재 반';
    const rateLabel = clinicPrintTypeState.unitRate === 'gte50' ? '최다빈출' : '최다오답';
    if (summaryEl) summaryEl.textContent = `${scopeLabel} · 단원별(${rateLabel}) · 선택 ${selectedKeys.length}/${units.length}단원 · ${totalFiltered}문항`;

    masterEl.innerHTML = available.length
        ? available.map(u => {
            const k = clinicPrintEscapeJsString(u.key);
            return `
                <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:9px 11px; border:1px solid var(--border); border-radius:10px; background:var(--surface);">
                    <span style="min-width:0; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:500; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${clinicPrintEscapeHtml(u.label)}</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); white-space:nowrap;">${u.count}문항</span>
                    </span>
                    <button type="button" aria-label="추가" style="flex:none; width:28px; height:28px; border:1px solid var(--border); border-radius:8px; background:var(--bg); color:var(--primary); font-size:16px; font-weight:700; line-height:1; cursor:pointer;" onclick="clinicPrintUnitAdd('${clinicPrintEscapeJsString(classId)}','${k}')">+</button>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox(units.length ? '모든 단원을 선택했습니다.' : '해당 조건의 단원이 없습니다.');

    selEl.innerHTML = selectedKeys.length
        ? selectedKeys.map((key, i) => {
            const u = byKey.get(key);
            const k = clinicPrintEscapeJsString(key);
            const cid = clinicPrintEscapeJsString(classId);
            return `
                <div data-unit-row data-key="${clinicPrintEscapeAttr(key)}" style="display:flex; align-items:center; gap:8px; padding:8px 10px; border:1px solid var(--border); border-radius:10px; background:var(--surface);">
                    <span class="clinic-unit-handle" style="flex:none; cursor:grab; color:var(--secondary); font-size:15px; line-height:1; touch-action:none; user-select:none; padding:2px 2px;" title="드래그로 순서 변경">≡</span>
                    <span style="min-width:0; flex:1; display:flex; align-items:center; gap:8px;">
                        <span style="font-size:12px; font-weight:600; color:var(--text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${i + 1}. ${clinicPrintEscapeHtml(u.label)}</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); white-space:nowrap;">${u.count}문항</span>
                    </span>
                    <span style="flex:none; display:flex; align-items:center; gap:4px;">
                        <button type="button" aria-label="위로" ${i === 0 ? 'disabled' : ''} style="width:26px; height:26px; border:1px solid var(--border); border-radius:7px; background:var(--bg); color:var(--text); font-size:12px; line-height:1; cursor:${i === 0 ? 'default' : 'pointer'}; opacity:${i === 0 ? '0.4' : '1'};" onclick="clinicPrintUnitMove('${cid}',${i},-1)">↑</button>
                        <button type="button" aria-label="아래로" ${i === selectedKeys.length - 1 ? 'disabled' : ''} style="width:26px; height:26px; border:1px solid var(--border); border-radius:7px; background:var(--bg); color:var(--text); font-size:12px; line-height:1; cursor:${i === selectedKeys.length - 1 ? 'default' : 'pointer'}; opacity:${i === selectedKeys.length - 1 ? '0.4' : '1'};" onclick="clinicPrintUnitMove('${cid}',${i},1)">↓</button>
                        <button type="button" aria-label="제거" style="width:26px; height:26px; border:1px solid var(--border); border-radius:7px; background:var(--bg); color:var(--error); font-size:13px; line-height:1; cursor:pointer;" onclick="clinicPrintUnitRemove('${cid}','${k}')">×</button>
                    </span>
                </div>
            `;
        }).join('')
        : clinicPrintTypeEmptyBox('상단 마스터 단원에서 + 로 추가하세요.');

    clinicPrintAttachUnitDnD(classId);
}

function clinicPrintUnitAdd(classId, key) {
    if (!clinicPrintTypeState.unitSelection.includes(key)) clinicPrintTypeState.unitSelection.push(key);
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintUnitRemove(classId, key) {
    clinicPrintTypeState.unitSelection = clinicPrintTypeState.unitSelection.filter(k => k !== key);
    clinicPrintRenderUnitLists(classId);
}

function clinicPrintUnitMove(classId, index, dir) {
    const arr = clinicPrintTypeState.unitSelection;
    const j = index + dir;
    if (j < 0 || j >= arr.length) return;
    const tmp = arr[index];
    arr[index] = arr[j];
    arr[j] = tmp;
    clinicPrintRenderUnitLists(classId);
}

// 포인터 기반 드래그(마우스·터치·펜 공통). 드래그 중에는 DOM 노드만 이동하고, 놓을 때 순서를 확정한다.
function clinicPrintAttachUnitDnD(classId) {
    const selEl = document.getElementById('clinic-print-unit-selected');
    if (!selEl) return;
    selEl.querySelectorAll('[data-unit-row] .clinic-unit-handle').forEach(handle => {
        handle.addEventListener('pointerdown', e => {
            e.preventDefault();
            const row = handle.closest('[data-unit-row]');
            if (!row) return;
            row.style.opacity = '0.6';
            handle.style.cursor = 'grabbing';

            const onMove = ev => {
                const rows = Array.from(selEl.querySelectorAll('[data-unit-row]'));
                const after = rows.find(other => {
                    if (other === row) return false;
                    const rect = other.getBoundingClientRect();
                    return ev.clientY < rect.top + rect.height / 2;
                });
                if (after) {
                    if (after.previousElementSibling !== row) selEl.insertBefore(row, after);
                } else if (selEl.lastElementChild !== row) {
                    selEl.appendChild(row);
                }
            };
            const onUp = () => {
                document.removeEventListener('pointermove', onMove);
                document.removeEventListener('pointerup', onUp);
                row.style.opacity = '1';
                handle.style.cursor = 'grab';
                clinicPrintTypeState.unitSelection = Array.from(selEl.querySelectorAll('[data-unit-row]'))
                    .map(r => r.getAttribute('data-key'));
                clinicPrintRenderUnitLists(classId);
            };
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onUp);
        });
    });
}

function clinicPrintUpdateStudentList(classId) {
    const currentMode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    if (currentMode === 'type') {
        clinicPrintSwitchMode(classId);
        return;
    }
    const selectedExamKeys = clinicPrintGetCheckedValues('clinic-print-exam');
    const selectedStudentIds = new Set(clinicPrintGetClassStudents(classId).map(student => String(student.id)));
    const studentItems = clinicPrintBuildStudentWrongItems(classId, selectedExamKeys, Array.from(selectedStudentIds), { excludeEmpty: true });
    const mode = document.querySelector('input[name="clinic-print-mode"]:checked')?.value || 'student';
    const root = document.getElementById('clinic-print-student-list');
    const countEl = document.getElementById('clinic-print-summary');
    if (!root) return;

    if (countEl) {
        if (mode === 'grade') {
            const gradeSource = clinicPrintBuildGradeWrongSource(classId, selectedExamKeys);
            const gradeItems = clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts);
            const cohortTotal = Object.values(gradeSource.cohortCounts || {}).reduce((sum, count) => sum + Number(count || 0), 0);
            countEl.textContent = `선택 시험 ${selectedExamKeys.length}개 · 학년 제출 ${cohortTotal}명 · 공통 오답 ${gradeItems.length}문항`;
        } else {
            const totalWrong = studentItems.reduce((sum, row) => sum + row.wrongItems.length, 0);
            countEl.textContent = `선택 시험 ${selectedExamKeys.length}개 · 오답 학생 ${studentItems.length}명 · 오답 ${totalWrong}문항`;
        }
    }

    if (!selectedExamKeys.length) {
        root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">시험을 선택하세요.</div>';
        return;
    }

    if (mode === 'grade') {
        const gradeSource = clinicPrintBuildGradeWrongSource(classId, selectedExamKeys);
        const gradeItems = clinicPrintBuildClassWrongItems(gradeSource.studentWrongItems, gradeSource.cohortCounts);
        if (!gradeItems.length) {
            root.innerHTML = '<div style="padding:14px; border:1px dashed var(--border); border-radius:12px; color:var(--secondary); font-size:12px; font-weight:500; text-align:center;">선택한 시험에 출력 가능한 학년 오답이 없습니다.</div>';
            return;
        }

        const cohortTotal = Object.values(gradeSource.cohortCounts || {}).reduce((sum, count) => sum + Number(count || 0), 0);
        root.innerHTML = `
            <div style="padding:12px; border:1px solid var(--border); border-radius:12px; background:var(--surface);">
                <div style="font-size:13px; font-weight:600; color:var(--text); line-height:1.4;">${clinicPrintEscapeHtml(clinicPrintGetClassGrade(classId) || '학년')} 공통 오답</div>
                <div style="margin-top:4px; font-size:11px; font-weight:500; color:var(--secondary); line-height:1.45;">제출 ${cohortTotal}명 · 공통 오답 ${gradeItems.length}문항</div>
            </div>
        `;
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

    if (mode === 'type') {
        if (!selectedExamKeys.length) {
            toast('출력할 시험을 선택하세요.', 'warn');
            return;
        }
        const typePayload = clinicPrintBuildTypePayload(classId);
        if (typePayload.typeMode === 'unit' && !(typePayload.unitOrder || []).length) {
            toast('출력할 단원을 선택하세요.', 'warn');
            return;
        }
        if (!(typePayload.typeItems || []).length) {
            toast('출력 가능한 오답 문항이 없습니다.', 'warn');
            return;
        }
        clinicPrintOpenEngine(typePayload);
        return;
    }

    if (!selectedExamKeys.length) {
        toast('출력할 시험을 선택하세요.', 'warn');
        return;
    }

    if (mode !== 'grade' && !selectedStudentIds.length) {
        toast('출력할 학생을 선택하세요.', 'warn');
        return;
    }

    const payload = clinicPrintBuildPayload(classId, { selectedExamKeys, selectedStudentIds, mode });
    const itemCount = mode === 'grade'
        ? payload.gradeWrongItems.length
        : mode === 'class'
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
    clinicPrintTypeState.unitSelection = [];
    clinicPrintTypeState.dragKey = null;
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
                <div id="clinic-print-mode-cards" style="display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:8px;">
                    <label class="clinic-mode-card" data-mode="student" style="position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-height:62px; padding:9px 6px; border:1px solid var(--primary); border-radius:12px; background:rgba(26,92,255,0.08); color:var(--primary); cursor:pointer; text-align:center;">
                        <input type="radio" name="clinic-print-mode" value="student" checked onchange="clinicPrintSwitchMode('${safeClassIdForJs}')" style="position:absolute; opacity:0; width:0; height:0;">
                        <span style="font-size:14px; font-weight:600; line-height:1.2;">학생</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.2;">학생별 오답</span>
                    </label>
                    <label class="clinic-mode-card" data-mode="class" style="position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-height:62px; padding:9px 6px; border:1px solid var(--border); border-radius:12px; background:var(--surface); color:var(--text); cursor:pointer; text-align:center;">
                        <input type="radio" name="clinic-print-mode" value="class" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')" style="position:absolute; opacity:0; width:0; height:0;">
                        <span style="font-size:14px; font-weight:600; line-height:1.2;">반</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.2;">반별 공통 오답</span>
                    </label>
                    <label class="clinic-mode-card" data-mode="grade" style="position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-height:62px; padding:9px 6px; border:1px solid var(--border); border-radius:12px; background:var(--surface); color:var(--text); cursor:pointer; text-align:center;">
                        <input type="radio" name="clinic-print-mode" value="grade" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')" style="position:absolute; opacity:0; width:0; height:0;">
                        <span style="font-size:14px; font-weight:600; line-height:1.2;">학년</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.2;">학년별 공통 오답</span>
                    </label>
                    <label class="clinic-mode-card" data-mode="type" style="position:relative; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px; min-height:62px; padding:9px 6px; border:1px solid var(--border); border-radius:12px; background:var(--surface); color:var(--text); cursor:pointer; text-align:center;">
                        <input type="radio" name="clinic-print-mode" value="type" onchange="clinicPrintSwitchMode('${safeClassIdForJs}')" style="position:absolute; opacity:0; width:0; height:0;">
                        <span style="font-size:14px; font-weight:600; line-height:1.2;">유형</span>
                        <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.2;">최다빈출·단원별</span>
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

            <section id="clinic-print-student-section">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px;">
                    <div style="font-size:12px; font-weight:500; color:var(--secondary);">학생</div>
                    <button class="btn apms-button apms-button--quiet" style="min-height:30px; padding:5px 9px; font-size:11px; border-radius:8px;" onclick="document.querySelectorAll('input[name=\\'clinic-print-student\\']').forEach(el=>el.checked=true);">전체 선택</button>
                </div>
                <div id="clinic-print-student-list" style="display:flex; flex-direction:column; gap:8px; max-height:250px; overflow:auto;"></div>
            </section>

            <section id="clinic-print-type-panel" style="display:none; flex-direction:column; gap:14px;">
                <input type="hidden" id="clinic-print-type-mode" value="frequent">
                <input type="hidden" id="clinic-print-type-scope" value="class">

                <div>
                    <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:8px;">범위</div>
                    <div id="clinic-print-type-scope-toggle" style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;">
                        <button type="button" class="clinic-scope-btn" data-scope="class" style="min-height:42px; padding:9px 10px; border:1px solid var(--primary); border-radius:12px; background:rgba(26,92,255,0.08); color:var(--primary); font-size:13px; font-weight:600; cursor:pointer;" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','class')">현재 반</button>
                        <button type="button" class="clinic-scope-btn" data-scope="grade" style="min-height:42px; padding:9px 10px; border:1px solid var(--border); border-radius:12px; background:var(--surface); color:var(--text); font-size:13px; font-weight:600; cursor:pointer;" onclick="clinicPrintSetTypeScope('${safeClassIdForJs}','grade')">같은 학년 전체</button>
                    </div>
                </div>

                <div>
                    <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-bottom:8px;">유형 선택</div>
                    <div id="clinic-print-type-cards" style="display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px;">
                        <button type="button" class="clinic-type-card" data-type-mode="frequent" style="display:flex; flex-direction:column; gap:4px; padding:12px 10px; border:1px solid var(--primary); border-radius:12px; background:rgba(26,92,255,0.08); cursor:pointer; text-align:left;" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','frequent')">
                            <span style="font-size:13px; font-weight:700; color:var(--text); line-height:1.25;">최다빈출</span>
                            <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.35;">정답률 50% 이상<br>반복 오답 문항</span>
                        </button>
                        <button type="button" class="clinic-type-card" data-type-mode="mostWrong" style="display:flex; flex-direction:column; gap:4px; padding:12px 10px; border:1px solid var(--border); border-radius:12px; background:var(--surface); cursor:pointer; text-align:left;" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','mostWrong')">
                            <span style="font-size:13px; font-weight:700; color:var(--text); line-height:1.25;">최다오답</span>
                            <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.35;">정답률 50% 미만<br>다수 취약 문항</span>
                        </button>
                        <button type="button" class="clinic-type-card" data-type-mode="unit" style="display:flex; flex-direction:column; gap:4px; padding:12px 10px; border:1px solid var(--border); border-radius:12px; background:var(--surface); cursor:pointer; text-align:left;" onclick="clinicPrintSetTypeMode('${safeClassIdForJs}','unit')">
                            <span style="font-size:13px; font-weight:700; color:var(--text); line-height:1.25;">단원별 오답</span>
                            <span style="font-size:10px; font-weight:500; color:var(--secondary); line-height:1.35;">마스터 단원 기준<br>선택 출력</span>
                        </button>
                    </div>
                </div>

                <div id="clinic-print-type-result"></div>
            </section>

            <button id="clinic-print-submit-btn" class="btn apms-button apms-button--primary btn-primary" style="width:100%; min-height:48px; border-radius:14px; font-size:14px; font-weight:500;" onclick="clinicPrintSubmit('${safeClassIdForJs}')">오답지 만들기</button>

            <style>
                @media (max-width:520px) {
                    #clinic-print-mode-cards { grid-template-columns:repeat(2,minmax(0,1fr)) !important; }
                    #clinic-print-type-cards { grid-template-columns:1fr !important; }
                }
            </style>
        </div>
    `);

    setTimeout(() => clinicPrintSwitchMode(classId), 0);
}
