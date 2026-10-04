/**
 * AP Math OS student XLSX export.
 * Admin-only frontend-state export; no Worker export API.
 */

(function () {
    const EXPORT_NOTICE = '다운로드된 파일은 개인정보 보호 기준에 따라 관리해야 합니다.';
    const SENSITIVE_CONFIRM = '주소·차량 정보가 포함됩니다. 다운로드한 파일은 개인정보 보호 기준에 따라 관리해야 합니다. 계속할까요?';

    const EXPORT_SHEETS = [
        { id: 'all', label: '전체 학생 명단', defaultChecked: true, sensitive: false },
        { id: 'byClass', label: '반별 학생 명단', defaultChecked: true, sensitive: false },
        { id: 'contacts', label: '연락처 목록', defaultChecked: true, sensitive: false },
        { id: 'addressVehicle', label: '주소·차량 목록', defaultChecked: false, sensitive: true }
    ];

    const STATUS_FILTERS = [
        { id: 'active', label: '재원만' },
        { id: 'activeLeave', label: '재원 + 휴원' },
        { id: 'all', label: '전체 상태' }
    ];

    const SHEET_COLUMNS = {
        all: ['상태', '이름', '학교', '학년', '반', '학생 전화', '학부모 전화', '보호자 관계', '목표점수', '등록일', '수정일'],
        byClass: ['반명', '담당 선생님', '학생명', '학교', '학년', '상태', '학생 전화', '학부모 전화', '보호자 관계'],
        contacts: ['학생명', '학교', '학년', '반', '학부모 전화', '학생 전화', '보호자 관계', '상태'],
        addressVehicle: ['학생명', '학교', '학년', '반', '주소', '차량', '학부모 전화', '학생 전화', '상태']
    };

    function escapeHtml(value) {
        if (typeof apEscapeHtml === 'function') return apEscapeHtml(value);
        return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
    }

    function isExportAdmin() {
        return String(window.state?.auth?.role || '').trim() === 'admin';
    }

    function safeText(value) {
        if (value === undefined || value === null) return '';
        return String(value).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }

    function safePhone(value) {
        return safeText(value).trim();
    }

    function getDbArray(key) {
        return Array.isArray(window.state?.db?.[key]) ? window.state.db[key] : [];
    }

    function statusOf(student) {
        return safeText(student?.status || '재원').trim() || '재원';
    }

    function studentMatchesStatus(student, filterId) {
        const status = statusOf(student);
        if (filterId === 'all') return true;
        if (filterId === 'activeLeave') return status === '재원' || status === '휴원';
        return status === '재원';
    }

    function buildClassMaps() {
        const classesById = new Map(getDbArray('classes').map(row => [String(row?.id || ''), row]));
        const classRowsByStudentId = new Map();

        getDbArray('class_students').forEach(row => {
            const studentId = String(row?.student_id || '');
            const classId = String(row?.class_id || '');
            if (!studentId || !classId) return;
            if (!classRowsByStudentId.has(studentId)) classRowsByStudentId.set(studentId, []);
            const cls = classesById.get(classId);
            if (cls) classRowsByStudentId.get(studentId).push(cls);
        });

        classRowsByStudentId.forEach(rows => {
            rows.sort((a, b) =>
                safeText(a?.name).localeCompare(safeText(b?.name), 'ko') ||
                safeText(a?.grade).localeCompare(safeText(b?.grade), 'ko')
            );
        });

        return { classesById, classRowsByStudentId };
    }

    function classNamesForStudent(studentId, maps) {
        const rows = maps.classRowsByStudentId.get(String(studentId || '')) || [];
        return rows.map(row => safeText(row?.name)).filter(Boolean).join(', ');
    }

    function filteredStudents(filterId) {
        return getDbArray('students')
            .filter(row => studentMatchesStatus(row, filterId))
            .slice()
            .sort((a, b) =>
                safeText(a?.grade).localeCompare(safeText(b?.grade), 'ko') ||
                safeText(a?.name).localeCompare(safeText(b?.name), 'ko')
            );
    }

    function buildAllStudentRows(students, maps) {
        return students.map(student => ({
            '상태': statusOf(student),
            '이름': safeText(student?.name),
            '학교': safeText(student?.school_name),
            '학년': safeText(student?.grade),
            '반': classNamesForStudent(student?.id, maps),
            '학생 전화': safePhone(student?.student_phone),
            '학부모 전화': safePhone(student?.parent_phone),
            '보호자 관계': safeText(student?.guardian_relation),
            '목표점수': safeText(student?.target_score),
            '등록일': safeText(student?.created_at),
            '수정일': safeText(student?.updated_at)
        }));
    }

    function buildByClassRows(students, maps) {
        const studentsById = new Map(students.map(row => [String(row?.id || ''), row]));
        const rows = [];

        getDbArray('class_students').forEach(link => {
            const student = studentsById.get(String(link?.student_id || ''));
            const cls = maps.classesById.get(String(link?.class_id || ''));
            if (!student || !cls) return;
            rows.push({
                '반명': safeText(cls?.name),
                '담당 선생님': safeText(cls?.teacher_name),
                '학생명': safeText(student?.name),
                '학교': safeText(student?.school_name),
                '학년': safeText(student?.grade),
                '상태': statusOf(student),
                '학생 전화': safePhone(student?.student_phone),
                '학부모 전화': safePhone(student?.parent_phone),
                '보호자 관계': safeText(student?.guardian_relation)
            });
        });

        return rows.sort((a, b) =>
            a['반명'].localeCompare(b['반명'], 'ko') ||
            a['학년'].localeCompare(b['학년'], 'ko') ||
            a['학생명'].localeCompare(b['학생명'], 'ko')
        );
    }

    function buildContactRows(students, maps) {
        return students.map(student => ({
            '학생명': safeText(student?.name),
            '학교': safeText(student?.school_name),
            '학년': safeText(student?.grade),
            '반': classNamesForStudent(student?.id, maps),
            '학부모 전화': safePhone(student?.parent_phone),
            '학생 전화': safePhone(student?.student_phone),
            '보호자 관계': safeText(student?.guardian_relation),
            '상태': statusOf(student)
        }));
    }

    function buildAddressVehicleRows(students, maps) {
        return students.map(student => ({
            '학생명': safeText(student?.name),
            '학교': safeText(student?.school_name),
            '학년': safeText(student?.grade),
            '반': classNamesForStudent(student?.id, maps),
            '주소': safeText(student?.student_address),
            '차량': safeText(student?.vehicle_info),
            '학부모 전화': safePhone(student?.parent_phone),
            '학생 전화': safePhone(student?.student_phone),
            '상태': statusOf(student)
        }));
    }

    function buildSheetRows(sheetId, students, maps) {
        if (sheetId === 'all') return buildAllStudentRows(students, maps);
        if (sheetId === 'byClass') return buildByClassRows(students, maps);
        if (sheetId === 'contacts') return buildContactRows(students, maps);
        if (sheetId === 'addressVehicle') return buildAddressVehicleRows(students, maps);
        return [];
    }

    function getSelectedExportOptions() {
        const statusFilter = document.getElementById('student-export-status')?.value || 'active';
        const selectedSheetIds = EXPORT_SHEETS
            .filter(sheet => document.getElementById(`student-export-sheet-${sheet.id}`)?.checked)
            .map(sheet => sheet.id);
        return { statusFilter, selectedSheetIds };
    }

    function sheetLabel(sheetId) {
        return EXPORT_SHEETS.find(sheet => sheet.id === sheetId)?.label || sheetId;
    }

    function statusFilterLabel(filterId) {
        return STATUS_FILTERS.find(row => row.id === filterId)?.label || '재원만';
    }

    function setColumnWidths(ws, rows, headers) {
        ws['!cols'] = headers.map(header => {
            const maxContent = rows.reduce((max, row) => Math.max(max, safeText(row[header]).length), header.length);
            return { wch: Math.min(Math.max(maxContent + 2, 12), 32) };
        });
    }

    function appendRowsSheet(workbook, sheetId, rows) {
        const headers = SHEET_COLUMNS[sheetId] || [];
        const ws = window.XLSX.utils.json_to_sheet(rows, { header: headers });
        setColumnWidths(ws, rows, headers);
        const label = sheetLabel(sheetId);
        window.XLSX.utils.book_append_sheet(workbook, ws, label.slice(0, 31));
    }

    function appendInfoSheet(workbook, options) {
        const sessionName = safeText(window.state?.auth?.name || window.state?.ui?.userName);
        const role = safeText(window.state?.auth?.role);
        const rows = [
            ['출력일시', new Date().toLocaleString('ko-KR')],
            ['출력자 이름', sessionName],
            ['출력자 권한', role],
            ['상태 필터', statusFilterLabel(options.statusFilter)],
            ['포함된 시트 목록', options.selectedSheetIds.map(sheetLabel).join(', ')],
            ['안내문', EXPORT_NOTICE]
        ];
        const ws = window.XLSX.utils.aoa_to_sheet(rows);
        ws['!cols'] = [{ wch: 18 }, { wch: 72 }];
        window.XLSX.utils.book_append_sheet(workbook, ws, '출력정보');
    }

    async function downloadWorkbook(options) {
        if (typeof loadXlsxOnce === 'function') {
            try { await loadXlsxOnce(); } catch (e) { /* 아래 공통 안내로 처리 */ }
        }
        if (!window.XLSX || !window.XLSX.utils || !window.XLSX.writeFile) {
            if (typeof toast === 'function') toast('엑셀 라이브러리를 불러오지 못했습니다.', 'warn');
            return;
        }

        const maps = buildClassMaps();
        const students = filteredStudents(options.statusFilter);
        const workbook = window.XLSX.utils.book_new();
        appendInfoSheet(workbook, options);

        options.selectedSheetIds.forEach(sheetId => {
            appendRowsSheet(workbook, sheetId, buildSheetRows(sheetId, students, maps));
        });

        if (!workbook.SheetNames || workbook.SheetNames.length <= 1) {
            if (typeof toast === 'function') toast('출력할 시트를 선택하세요.', 'warn');
            return;
        }

        const date = new Date().toLocaleDateString('sv-SE');
        window.XLSX.writeFile(workbook, `AP수학_학생출력_${date}.xlsx`);
        if (typeof toast === 'function') toast('학생 명단 엑셀 파일을 다운로드합니다.', 'success');
    }

    function handleStudentExportDownload() {
        if (!isExportAdmin()) {
            if (typeof toast === 'function') toast('관리자 전용 기능입니다.', 'warn');
            return;
        }

        const options = getSelectedExportOptions();
        if (!options.selectedSheetIds.length) {
            if (typeof toast === 'function') toast('출력할 시트를 선택하세요.', 'warn');
            return;
        }

        const includesSensitive = EXPORT_SHEETS.some(sheet => sheet.sensitive && options.selectedSheetIds.includes(sheet.id));
        if (includesSensitive && !window.confirm(SENSITIVE_CONFIRM)) return;

        downloadWorkbook(options);
    }

    function renderStudentExportModal() {
        if (!isExportAdmin()) {
            if (typeof toast === 'function') toast('관리자 전용 기능입니다.', 'warn');
            return;
        }

        const sheetOptions = EXPORT_SHEETS.map(sheet => `
            <label style="display:flex; align-items:center; gap:9px; min-height:34px; font-size:13px; font-weight:500; color:var(--text); cursor:pointer;">
                <input id="student-export-sheet-${sheet.id}" type="checkbox" ${sheet.defaultChecked ? 'checked' : ''} style="width:16px; height:16px; accent-color:var(--primary);">
                <span>${escapeHtml(sheet.label)}</span>
            </label>
        `).join('');

        const statusOptions = STATUS_FILTERS.map(row =>
            `<option value="${escapeHtml(row.id)}" ${row.id === 'active' ? 'selected' : ''}>${escapeHtml(row.label)}</option>`
        ).join('');

        const body = `
            <div style="display:flex; flex-direction:column; gap:16px; padding:0 4px 4px;">
                <div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:8px;">상태 필터</div>
                    <select id="student-export-status" class="btn" style="width:100%; background:var(--surface-2); border:1px solid var(--border); text-align:left;">${statusOptions}</select>
                </div>
                <div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:8px;">포함 시트</div>
                    <div style="display:flex; flex-direction:column; gap:4px; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:12px 14px;">${sheetOptions}</div>
                </div>
                <div style="font-size:12px; color:var(--secondary); font-weight:400; line-height:1.6; background:rgba(26,92,255,0.06); border:1px solid rgba(26,92,255,0.12); border-radius:12px; padding:12px;">${escapeHtml(EXPORT_NOTICE)}</div>
            </div>
        `;

        if (typeof showModal === 'function') {
            showModal('학생 명단 출력', body, '엑셀 다운로드', handleStudentExportDownload);
            const cancelBtn = document.getElementById('modal-cancel-btn');
            if (cancelBtn) cancelBtn.textContent = '닫기';
        }
    }

    function insertStudentExportButton() {
        if (!isExportAdmin()) return;
        const body = document.getElementById('modal-body');
        if (!body || document.getElementById('student-export-open-btn')) return;
        const firstRow = body.querySelector('div');
        if (!firstRow) return;
        firstRow.insertAdjacentHTML('beforeend', `
            <button id="student-export-open-btn" class="btn apms-button apms-button--quiet" style="padding:10px; flex:1; font-size:12px; font-weight:500; border:1px solid rgba(26,92,255,0.18); background:rgba(26,92,255,0.06); color:var(--primary);" onclick="openStudentExportModal()">학생 명단 출력</button>
        `);
    }

    function wrapAddressBook() {
        if (typeof window.openAddressBook !== 'function' || window.openAddressBook.__studentExportWrapped) return;
        const original = window.openAddressBook;
        window.openAddressBook = function () {
            const result = original.apply(this, arguments);
            insertStudentExportButton();
            return result;
        };
        window.openAddressBook.__studentExportWrapped = true;
    }

    window.openStudentExportModal = renderStudentExportModal;
    window.handleStudentExportDownload = handleStudentExportDownload;
    window.injectStudentExportButton = insertStudentExportButton;
    window.addEventListener('DOMContentLoaded', wrapAddressBook);
    wrapAddressBook();
})();
