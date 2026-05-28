(function () {
    const TEACHER_DISPLAY_NAMES = {
        car: 'Carmen',
        carmen: 'Carmen',
        zoe: 'Zoe',
        ivy: 'Ivy',
        stacy: 'Stacy',
        lily: 'Lily',
        laura: 'Laura'
    };

    function makeId(prefix) {
        if (window.crypto?.randomUUID) return `${prefix}_${window.crypto.randomUUID()}`;
        return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    }

    function normalizeText(value) {
        return window.EieNormalize?.normalizeText ? window.EieNormalize.normalizeText(value) : String(value || '').trim().replace(/\s+/g, ' ');
    }

    function getXlsx() {
        return window.XLSX || null;
    }

    function readAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error || new Error('파일을 읽지 못했습니다.'));
            reader.readAsArrayBuffer(file);
        });
    }

    function parseSheetMonth(sheetName) {
        const raw = String(sheetName || '').trim();
        const yy = raw.match(/^(\d{2})[.\-_년\s]+(\d{1,2})$/);
        if (yy) {
            const year = Number(yy[1]) + 2000;
            const month = Number(yy[2]);
            if (month >= 1 && month <= 12) return { value: year * 100 + month, source_month: `${year}-${String(month).padStart(2, '0')}` };
        }
        const yyyy = raw.match(/^(20\d{2})[.\-_년\s]+(\d{1,2})/);
        if (yyyy) {
            const year = Number(yyyy[1]);
            const month = Number(yyyy[2]);
            if (month >= 1 && month <= 12) return { value: year * 100 + month, source_month: `${year}-${String(month).padStart(2, '0')}` };
        }
        return null;
    }

    function pickLatestSheetName(sheetNames) {
        let best = null;
        for (const name of sheetNames || []) {
            const parsed = parseSheetMonth(name);
            if (!parsed) continue;
            if (!best || parsed.value > best.value) best = { name, ...parsed };
        }
        if (best) return best.name;
        return (sheetNames || [])[Math.max(0, (sheetNames || []).length - 1)] || '';
    }

    function sourceMonthFromSheet(sheetName) {
        return parseSheetMonth(sheetName)?.source_month || String(sheetName || '').trim();
    }

    function cellText(value) {
        if (value == null) return '';
        if (typeof value === 'number') return String(value);
        if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
        return normalizeText(value);
    }

    function rowsFromSheet(sheet, xlsx) {
        const rows = xlsx.utils.sheet_to_json(sheet, { header: 1, raw: false, blankrows: false, defval: '' });
        return rows.map(row => row.map(cellText));
    }

    function parsePeriodText(text) {
        const raw = normalizeText(text);
        const match = raw.match(/(\d+)\s*교시/);
        if (!match) return null;
        const periodOrder = Number(match[1]);
        const timeMatch = raw.match(/(\d{1,2})\s*[:：]?\s*(\d{2})\s*[~\-–]\s*(\d{1,2})\s*[:：]?\s*(\d{2})/);
        let startTime = '';
        let endTime = '';
        if (timeMatch) {
            startTime = normalizeClock(timeMatch[1], timeMatch[2]);
            endTime = normalizeClock(timeMatch[3], timeMatch[4]);
        }
        return {
            period_label: `${periodOrder}교시`,
            period_order: periodOrder,
            start_time: startTime,
            end_time: endTime,
            raw_text: raw
        };
    }

    function normalizeClock(hour, minute) {
        let h = Number(hour);
        const m = Number(minute);
        if (h > 0 && h < 12) h += 12;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    function looksLikeDay(text) {
        return /^[월화수목금토일](요일)?$/.test(normalizeText(text));
    }

    function findDayLabel(rows, rowIndex, colIndex) {
        for (let r = rowIndex; r >= 0 && r >= rowIndex - 8; r -= 1) {
            const value = cellText(rows[r]?.[colIndex]);
            if (looksLikeDay(value)) return value.replace(/요일$/, '');
        }
        for (let c = colIndex; c >= 0 && c >= colIndex - 4; c -= 1) {
            const value = cellText(rows[rowIndex]?.[c]);
            if (looksLikeDay(value)) return value.replace(/요일$/, '');
        }
        return '';
    }

    function isClassHeader(value) {
        const text = normalizeText(value);
        if (!text) return false;
        if (/^\d+([,\s]\d+)+$/.test(text)) return false;
        if (/^\d+$/.test(text)) return false;
        if (/^(합계|총원|인원|전화|연락처|비고|메모)$/i.test(text)) return false;
        if (/교시/.test(text)) return false;
        return /[A-Za-z가-힣]/.test(text) && text.length <= 40;
    }

    function detectTeacher(raw) {
        const text = normalizeText(raw);
        const lowerTokens = text.split(/[^A-Za-z가-힣]+/).filter(Boolean).map(token => token.toLowerCase());
        const matched = [];
        for (const token of lowerTokens) {
            if (TEACHER_DISPLAY_NAMES[token] && !matched.includes(TEACHER_DISPLAY_NAMES[token])) matched.push(TEACHER_DISPLAY_NAMES[token]);
        }
        if (matched.length === 1) return { teacher_name_raw: matched[0], status: 'imported', matched_teacher_tokens: matched };
        if (matched.length > 1) return { teacher_name_raw: '', status: 'needs_review', matched_teacher_tokens: matched };
        return { teacher_name_raw: '', status: 'needs_review', matched_teacher_tokens: [] };
    }

    function findHeaderRow(rows, periodRowIndex) {
        const current = rows[periodRowIndex] || [];
        const next = rows[periodRowIndex + 1] || [];
        const prev = rows[periodRowIndex - 1] || [];
        const currentCount = current.filter(isClassHeader).length;
        const nextCount = next.filter(isClassHeader).length;
        const prevCount = prev.filter(isClassHeader).length;
        if (nextCount >= currentCount && nextCount >= prevCount && nextCount > 0) return periodRowIndex + 1;
        if (prevCount > currentCount && prevCount > 0) return periodRowIndex - 1;
        return periodRowIndex;
    }

    function parseTimetableCells(rows, context) {
        const cells = [];
        for (let r = 0; r < rows.length; r += 1) {
            const row = rows[r] || [];
            const periodCellIndex = row.findIndex(value => parsePeriodText(value));
            if (periodCellIndex < 0) continue;
            const period = parsePeriodText(row[periodCellIndex]);
            const headerRowIndex = findHeaderRow(rows, r);
            const headerRow = rows[headerRowIndex] || [];
            for (let c = Math.max(periodCellIndex + 1, 1); c < headerRow.length; c += 1) {
                const classNameRaw = cellText(headerRow[c]);
                if (!isClassHeader(classNameRaw)) continue;
                const teacher = detectTeacher(classNameRaw);
                const dayLabel = findDayLabel(rows, headerRowIndex, c);
                cells.push({
                    id: makeId('eie_cell'),
                    import_session_id: context.import_session_id,
                    sheet_name: context.sheet_name,
                    source_month: context.source_month,
                    day_label: dayLabel,
                    period_label: period.period_label,
                    period_order: period.period_order,
                    start_time: period.start_time,
                    end_time: period.end_time,
                    class_name_raw: classNameRaw,
                    teacher_name_raw: teacher.teacher_name_raw,
                    room_raw: '',
                    column_index: c,
                    student_count: 0,
                    status: teacher.status,
                    raw_meta_json: {
                        source_row: headerRowIndex + 1,
                        source_col: c + 1,
                        period_source_row: r + 1,
                        period_text: period.raw_text,
                        matched_teacher_tokens: teacher.matched_teacher_tokens,
                        teacher_match_count: teacher.matched_teacher_tokens.length
                    }
                });
            }
        }
        return cells;
    }

    async function parseFile(file, options) {
        const xlsx = options?.XLSX || getXlsx();
        if (!xlsx) throw new Error('엑셀 파서를 불러오지 못했습니다. 네트워크 상태를 확인한 뒤 다시 시도해 주세요.');
        if (!file) throw new Error('엑셀 파일을 선택해 주세요.');
        const buffer = await readAsArrayBuffer(file);
        const workbook = xlsx.read(buffer, { type: 'array' });
        const sheetNames = workbook.SheetNames || [];
        const sheetName = options?.sheetName || pickLatestSheetName(sheetNames);
        const sheet = workbook.Sheets[sheetName];
        if (!sheet) throw new Error('선택한 시트를 찾지 못했습니다.');
        const rows = rowsFromSheet(sheet, xlsx);
        const importSessionId = makeId('eie_import');
        const sourceMonth = sourceMonthFromSheet(sheetName);
        const context = {
            import_session_id: importSessionId,
            file_name: file.name || 'unknown.xlsx',
            sheet_name: sheetName,
            source_month: sourceMonth
        };
        const timetableCells = parseTimetableCells(rows, context);
        return {
            import_session: {
                id: importSessionId,
                file_name: context.file_name,
                sheet_name: sheetName,
                source_month: sourceMonth,
                status: 'parsed',
                raw_meta_json: {
                    sheet_names: sheetNames,
                    row_count: rows.length
                }
            },
            import_session_id: importSessionId,
            file_name: context.file_name,
            sheet_name: sheetName,
            source_month: sourceMonth,
            sheet_names: sheetNames,
            timetable_cells: timetableCells,
            summary: {
                timetable_cell_count: timetableCells.length,
                imported_count: timetableCells.filter(cell => cell.status === 'imported').length,
                needs_review_count: timetableCells.filter(cell => cell.status === 'needs_review').length
            }
        };
    }

    window.EieExcelParser = {
        pickLatestSheetName,
        sourceMonthFromSheet,
        parseTimetableCells,
        parseFile
    };
})();
