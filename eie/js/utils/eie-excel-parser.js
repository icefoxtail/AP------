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


    function normalizeName(value) {
        if (window.EieNormalize?.normalizeName) return window.EieNormalize.normalizeName(value);
        return normalizeText(value).replace(/\s+/g, '');
    }

    function normalizePhone(value) {
        if (window.EieNormalize?.normalizePhone) return window.EieNormalize.normalizePhone(value);
        return String(value || '').replace(/[^\d]/g, '');
    }

    function looksLikePhone(value) {
        if (window.EieNormalize?.looksLikePhone) return window.EieNormalize.looksLikePhone(value);
        const digits = normalizePhone(value);
        return digits.length >= 8 && digits.length <= 12;
    }

    function extractPhoneCandidates(value) {
        if (window.EieNormalize?.extractPhoneCandidates) return window.EieNormalize.extractPhoneCandidates(value);
        return looksLikePhone(value) ? [{ phone_raw: normalizeText(value), normalized_phone: normalizePhone(value) }] : [];
    }

    function stripPhoneFromText(value) {
        if (window.EieNormalize?.stripPhoneFromText) return window.EieNormalize.stripPhoneFromText(value);
        return normalizeText(value).replace(/\d[\d\-\s.]{6,}\d/g, ' ');
    }

    function isNonStudentText(value) {
        const text = normalizeText(value);
        if (!text) return true;
        if (/^(합계|총원|인원|전화|연락처|비고|메모|교시|요일|수업|선생님|teacher|name|phone)$/i.test(text)) return true;
        if (/^(월|화|수|목|금|토|일)(요일)?$/.test(text)) return true;
        if (/교시/.test(text)) return true;
        if (/^\d+$/.test(text)) return true;
        if (/^[\d\s,./:~\-–]+$/.test(text)) return true;
        return false;
    }

    function candidateFromCellText(text, context) {
        const raw = normalizeText(text);
        if (!raw || isNonStudentText(raw)) return null;
        const phones = extractPhoneCandidates(raw);
        const withoutPhone = stripPhoneFromText(raw)
            .replace(/^(학생|이름|성명)\s*[:：]?\s*/i, '')
            .replace(/\b(전화|연락처|휴대폰|핸드폰)\b\s*[:：]?/gi, '')
            .trim();
        const name = normalizeText(withoutPhone);
        const normalized = normalizeName(name);
        if (!normalized || normalized.length < 2) return null;
        if (isNonStudentText(name) || looksLikePhone(name)) return null;
        return {
            student_name_raw: name,
            name,
            normalized_name: normalized,
            grade_raw: '',
            phone_raw: phones[0]?.phone_raw || '',
            normalized_phone: phones[0]?.normalized_phone || '',
            memo_raw: raw,
            source_row: context.source_row,
            source_col: context.source_col,
            cell_id: context.cell_id,
            cell_context: context.cell_context,
            match_status: 'candidate',
            flags: []
        };
    }

    function mergeCandidatePhone(candidate, phone) {
        if (!candidate || !phone?.normalized_phone) return candidate;
        if (!candidate.normalized_phone) {
            candidate.phone_raw = phone.phone_raw || '';
            candidate.normalized_phone = phone.normalized_phone || '';
        } else if (candidate.normalized_phone !== phone.normalized_phone && !candidate.flags.includes('needs_review')) {
            candidate.flags.push('needs_review');
        }
        return candidate;
    }

    function collectStudentCandidates(rows, headerRowIndex, colIndex, cell, periodRowIndex) {
        const candidates = [];
        const seen = new Set();
        let blankStreak = 0;
        for (let r = headerRowIndex + 1; r < rows.length && r <= headerRowIndex + 30; r += 1) {
            const row = rows[r] || [];
            const rowText = row.map(cellText).join(' ').trim();
            if (r > headerRowIndex + 1 && row.some(value => parsePeriodText(value))) break;
            const rawValue = cellText(row[colIndex]);
            const rightValue = cellText(row[colIndex + 1]);
            const leftValue = cellText(row[colIndex - 1]);
            if (!rawValue && !rightValue && !leftValue && !rowText) {
                blankStreak += 1;
                if (blankStreak >= 3) break;
                continue;
            }
            blankStreak = 0;
            const candidate = candidateFromCellText(rawValue, {
                source_row: r + 1,
                source_col: colIndex + 1,
                cell_id: cell.id,
                cell_context: `${cell.day_label || ''} ${cell.period_label || ''} ${cell.class_name_raw || ''}`.trim()
            });
            if (!candidate) continue;
            const adjacentPhones = [rightValue, leftValue]
                .flatMap(value => extractPhoneCandidates(value))
                .filter(item => item.normalized_phone);
            if (adjacentPhones.length) mergeCandidatePhone(candidate, adjacentPhones[0]);
            const key = `${candidate.normalized_name}|${candidate.normalized_phone}|${candidate.source_row}`;
            if (seen.has(key)) continue;
            seen.add(key);
            if (!candidate.normalized_phone && !candidate.flags.includes('missing_phone')) candidate.flags.push('missing_phone');
            candidates.push(candidate);
        }
        return candidates;
    }

    function finalizeStudentCandidateFlags(cells) {
        const phoneCounts = new Map();
        for (const cell of cells) {
            const candidates = cell.raw_meta_json?.student_candidates || [];
            for (const candidate of candidates) {
                const key = candidate.normalized_phone || normalizePhone(candidate.phone_raw);
                if (!key) continue;
                phoneCounts.set(key, (phoneCounts.get(key) || 0) + 1);
            }
        }
        for (const cell of cells) {
            const meta = cell.raw_meta_json || {};
            const candidates = meta.student_candidates || [];
            const reviewReasons = new Set(meta.needs_review_reasons || []);
            for (const candidate of candidates) {
                const phoneKey = candidate.normalized_phone || normalizePhone(candidate.phone_raw);
                candidate.flags = Array.isArray(candidate.flags) ? candidate.flags : [];
                if (phoneKey && phoneCounts.get(phoneKey) > 1 && !candidate.flags.includes('duplicate_name')) candidate.flags.push('duplicate_name');
                if (!candidate.normalized_phone && !candidate.flags.includes('missing_phone')) candidate.flags.push('missing_phone');
                if (candidate.flags.includes('duplicate_name')) reviewReasons.add('duplicate_name');
                if (candidate.flags.includes('missing_phone')) reviewReasons.add('missing_phone');
                if (candidate.flags.length && !candidate.flags.includes('needs_review')) candidate.flags.push('needs_review');
                candidate.match_status = candidate.flags.includes('needs_review') ? 'needs_review' : 'candidate';
            }
            meta.student_candidates = candidates;
            meta.student_names = candidates.map(candidate => candidate.name || candidate.student_name_raw).filter(Boolean);
            meta.contact_candidates = candidates.filter(candidate => candidate.normalized_phone).map(candidate => ({
                student_name_raw: candidate.student_name_raw || candidate.name || '',
                name: candidate.name || candidate.student_name_raw || '',
                normalized_name: candidate.normalized_name || '',
                phone_raw: candidate.phone_raw || '',
                normalized_phone: candidate.normalized_phone || '',
                source_row: candidate.source_row,
                source_col: candidate.source_col,
                cell_id: candidate.cell_id,
                cell_context: candidate.cell_context,
                match_status: candidate.match_status,
                flags: candidate.flags || []
            }));
            meta.needs_review_reasons = Array.from(reviewReasons);
            cell.student_count = candidates.length || cell.student_count || 0;
            if (cell.status !== 'needs_review' && reviewReasons.size) cell.status = 'needs_review';
        }
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
            startTime = normalizeClock(timeMatch[1], timeMatch[2], raw);
            endTime = normalizeClock(timeMatch[3], timeMatch[4], raw);
        }
        return {
            period_label: `${periodOrder}교시`,
            period_order: periodOrder,
            start_time: startTime,
            end_time: endTime,
            raw_text: raw
        };
    }

    function normalizeClock(hour, minute, sourceText = '') {
        let h = Number(hour);
        const m = Number(minute);
        if (!Number.isFinite(h) || !Number.isFinite(m)) return '';
        const source = normalizeText(sourceText).toLowerCase();
        const hasPmMarker = /오후|\bpm\b|p\.m\.?/.test(source);
        const hasAmMarker = /오전|\bam\b|a\.m\.?/.test(source);
        if (hasPmMarker && h > 0 && h < 12) h += 12;
        if (hasAmMarker && h === 12) h = 0;
        if (h < 0 || h > 23 || m < 0 || m > 59) return '';
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
                const cell = {
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
                        teacher_match_count: teacher.matched_teacher_tokens.length,
                        student_candidates: [],
                        student_names: [],
                        contact_candidates: [],
                        needs_review_reasons: teacher.status === 'needs_review' ? ['teacher_needs_review'] : []
                    }
                };
                cell.raw_meta_json.student_candidates = collectStudentCandidates(rows, headerRowIndex, c, cell, r);
                cells.push(cell);
            }
        }
        finalizeStudentCandidateFlags(cells);
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
