/**
 * AP Math OS 1.0 [js/classroom.js] - Classroom v4 FINAL
 * 학급 운영 관리, 개별 출결/숙제 처리 및 출석부(Ledger) 엔진
 * [Minimalism Polish]: 46px 1줄 압축 뷰, 파스텔 상태 뱃지, 모바일 핀포인트 렌더링
 * [Core Logic Preserved]: 기존 API 통신, 낙관적 롤백 방어, 상태 관리 보존
 * [V4 DESIGN RESET]: 이름 | 출결 | 숙제 | 지각 | 보강 | 상담 6열 재구성, 학교/상세/출석부 버튼 제거
 */

// ── 필수 유틸리티 (중복 선언 방어) ──────────────────────────────────
if (typeof apEscapeHtml !== 'function') {
    window.apEscapeHtml = function(str) {
        if (!str) return '';
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };
}

// [UI Standard]: 클래스룸 전용 스타일 주입
function injectClassroomStyles() {
    if (document.getElementById('classroom-style')) return;
    const style = document.createElement('style');
    style.id = 'classroom-style';
    style.textContent = `
        .cls-fade-in { animation: clsFadeIn 0.25s ease-out; }
        @keyframes clsFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .cls-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 600; line-height: 1.4; }
        .cls-v4-wrap { width: 100%; max-width: 1080px; margin: 0 auto; box-sizing: border-box; padding: 0 0 28px; background: var(--surface); min-height: 100vh; }
        .cls-v4-top { position: sticky; top: 0; z-index: 50; display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 16px; min-height:54px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.92); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
        .dark .cls-v4-top, [data-theme="dark"] .cls-v4-top { background:rgba(28,28,30,0.92); }
        .cls-v4-title { min-width:0; flex:1; }
        .cls-v4-title-main { font-size:16px; font-weight:700; color:var(--text); letter-spacing:-0.35px; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cls-v4-title-sub { margin-top:3px; font-size:11px; font-weight:600; color:var(--secondary); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cls-v4-summary { display:flex; gap:5px; justify-content:flex-end; flex:0 0 auto; }
        .cls-v4-pill { height:25px; display:inline-flex; align-items:center; justify-content:center; gap:4px; padding:0 8px; border-radius:8px; border:1px solid var(--border); background:var(--surface-2); color:var(--secondary); font-size:11px; font-weight:700; white-space:nowrap; }
        .cls-v4-pill b { color:var(--text); font-weight:700; }
        .cls-v4-pill.warn { color:var(--warning); background:rgba(255,165,2,0.08); border-color:rgba(255,165,2,0.18); }
        .cls-v4-tools { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; touch-action:pan-x; padding:10px 16px; border-bottom:1px solid var(--border); background:var(--surface); }
        .cls-v4-tools::-webkit-scrollbar { display:none; }
        .cls-v4-tool { flex:0 0 auto; min-height:36px; padding:0 13px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:700; box-shadow:none; }
        .cls-v4-tool.primary, .cls-v4-tool.blue { background:rgba(26,92,255,0.07); border-color:rgba(26,92,255,0.16); color:var(--primary); }
        .cls-v4-tool.orange { background:rgba(255,165,2,0.10); border-color:rgba(255,165,2,0.20); color:var(--warning); }
        .cls-v4-tool.purple, .cls-v4-tool.highlight { background:rgba(124,58,237,0.07); border-color:rgba(124,58,237,0.16); color:#7c3aed; }
        .cls-v4-tool.red { background:rgba(255,71,87,0.08); border-color:rgba(255,71,87,0.18); color:var(--error); }
        .cls-v4-tool.green { background:rgba(0,208,132,0.08); border-color:rgba(0,208,132,0.16); color:var(--success); }
        .cls-v4-date-input { flex:0 0 auto; width:138px; min-height:36px; height:36px; padding:0 10px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:700; font-family:inherit; box-shadow:none; }
        .cls-v4-date-input::-webkit-calendar-picker-indicator { opacity:0.75; cursor:pointer; }
        .cls-v4-date-reset { flex:0 0 auto; min-height:36px; height:36px; padding:0 12px; border-radius:999px; border:1px solid rgba(26,92,255,0.16); background:rgba(26,92,255,0.07); color:var(--primary); font-size:12px; font-weight:700; box-shadow:none; }
        .cls-v4-section { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:13px 16px 7px; }
        .cls-v4-section h3 { margin:0; font-size:14px; font-weight:700; color:var(--text); letter-spacing:-0.2px; }
        .cls-v4-section span { font-size:11px; font-weight:700; color:var(--secondary); }
        .cls-v4-board { border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--surface); box-shadow:none; }
        .cls-v4-board-head { display:grid; grid-template-columns:minmax(68px,1fr) 42px 42px 42px 42px 42px; align-items:center; gap:6px; min-height:30px; padding:4px 12px; border-bottom:1px solid var(--border); background:var(--surface-2); color:var(--secondary); font-size:10px; font-weight:700; text-align:center; }
        .cls-v4-board-head .name-spacer { text-align:left; }
        .cls-v4-row { display:grid; grid-template-columns:minmax(68px,1fr) 42px 42px 42px 42px 42px; align-items:center; gap:6px; min-height:46px; padding:5px 12px; border-bottom:1px solid var(--border); background:var(--surface); }
        .cls-v4-row:last-child { border-bottom:none; }
        .cls-v4-row:active { background:var(--surface-2); }
        .cls-v4-name-col { min-width:0; display:flex; align-items:center; cursor:pointer; overflow:hidden; }
        .cls-v4-student { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; font-weight:700; color:var(--text); line-height:1.2; }
        .cls-v4-meta-mobile { display:none; }
        .cls-v4-badges { display:contents; }
        .cls-v4-status { width:42px; min-width:42px; height:36px; min-height:36px; padding:0; border-radius:10px; font-size:15px; font-weight:800; display:flex; align-items:center; justify-content:center; margin:0; box-shadow:none; }
        .cls-v4-status.hw { width:42px; min-width:42px; }
        .cls-v4-status.tag { background:transparent; color:var(--secondary); border:1px solid var(--border); font-size:14px; }
        .cls-v4-status.tag.on { background:rgba(26,92,255,0.10); color:var(--primary); border-color:rgba(26,92,255,0.18); }
        .cls-v4-status.consult.on { background:rgba(124,58,237,0.10); color:#7c3aed; border-color:rgba(124,58,237,0.18); }
        .cls-v4-actions { display:none; }
        .cls-v4-pad-btns { display:none; gap:6px; }
        .cls-v4-pad-btn { height:32px; min-height:32px; padding:0 10px; border-radius:8px; border:1px solid var(--border); background:var(--surface-2); color:var(--text-soft); font-size:11px; font-weight:700; }
        .cls-v4-more { display:none; }
        .cls-v4-empty { padding:34px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; }
        .cls-v4-legacy-table { padding:8px 0; border-radius:18px; border:1px solid var(--border); background:var(--surface); box-shadow:none; }
        .cls-v4-ledger-mode-active { background:var(--primary) !important; color:#fff !important; }
        @media (min-width:800px) {
            .cls-v4-wrap { max-width:1080px; padding-bottom:32px; }
            .cls-v4-top { border-left:1px solid var(--border); border-right:1px solid var(--border); border-radius:0 0 18px 18px; }
            .cls-v4-board { margin:0 16px; border:1px solid var(--border); border-radius:18px; overflow:hidden; }
            .cls-v4-tools { padding-left:16px; padding-right:16px; }
            .cls-v4-board-head { grid-template-columns:minmax(120px,1fr) 54px 54px 54px 54px 54px; padding-left:18px; padding-right:18px; gap:8px; }
            .cls-v4-row { grid-template-columns:minmax(120px,1fr) 54px 54px 54px 54px 54px; min-height:50px; padding:7px 18px; gap:8px; }
            .cls-v4-name-col { max-width:none; }
            .cls-v4-badges { display:contents; }
            .cls-v4-status { width:54px; min-width:54px; height:38px; }
            .cls-v4-status.hw { width:54px; min-width:54px; }
            .cls-v4-pad-btns { display:none; }
            .cls-v4-more { display:none; }
        }
        @media (max-width:380px) {
            .cls-v4-board-head { grid-template-columns:minmax(58px,1fr) 39px 39px 39px 39px 39px; padding-left:10px; padding-right:10px; gap:5px; }
            .cls-v4-row { grid-template-columns:minmax(58px,1fr) 39px 39px 39px 39px 39px; padding-left:10px; padding-right:10px; gap:5px; }
            .cls-v4-name-col { min-width:0; max-width:none; }
            .cls-v4-status { width:39px; min-width:39px; padding:0; font-size:14px; }
            .cls-v4-status.hw { width:39px; min-width:39px; }
            .cls-v4-more { width:32px; }
        }
    `;
    document.head.appendChild(style);
}

function formatClassScheduleDays(daysStr) {
    if (!daysStr) return '매일';
    const map = ['일','월','화','수','목','금','토'];
    return daysStr.split(',').map(d => map[parseInt(d)]).join('');
}

// [Master Review Patch] 공휴일 판별 (재선언 없이 기존 전역 변수 참조)
function isClassroomHoliday(dateStr) {
    if (typeof DASH_HOLIDAYS !== 'undefined' && Array.isArray(DASH_HOLIDAYS)) {
        if (DASH_HOLIDAYS.includes(dateStr)) return true;
    }
    if (typeof HOLIDAYS_2026 !== 'undefined' && Array.isArray(HOLIDAYS_2026)) {
        if (HOLIDAYS_2026.includes(dateStr)) return true;
    }
    if (state.db.academy_schedules) {
        return state.db.academy_schedules.some(s =>
            String(s.is_deleted || 0) !== '1' &&
            s.schedule_date === dateStr &&
            s.schedule_type === 'closed' &&
            s.target_scope !== 'student'
        );
    }
    return false;
}

function isClassScheduledOnDate(clsId, dateStr) {
    const cls = state.db.classes.find(c => String(c.id) === String(clsId));
    if (!cls) return true;

    if (isClassroomHoliday(dateStr)) {
        const cIds = state.db.class_students
            .filter(m => String(m.class_id) === String(clsId))
            .map(m => String(m.student_id));
        return state.db.attendance.some(
            a => a.date === dateStr &&
                 cIds.includes(String(a.student_id)) &&
                 a.status === '등원'
        );
    }

    if (!cls.schedule_days) return true;
    const dayIdx = String(new Date(dateStr + 'T00:00:00').getDay());
    return cls.schedule_days.split(',').includes(dayIdx);
}

// ── 출석 상태 헬퍼 ──────────────────────────────────────────────
function getAttendanceDisplayStatus(status, isClassDay = true) {
    const safe = String(status || '').trim();
    if (safe && safe !== '미기록') return safe;
    return isClassDay ? '등원' : '수업 없음';
}

function getNextAttendanceStatus(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') return '결석';
    if (cur === '결석') return '수업 없음';
    return '등원'; 
}

function getAttendanceStatusLabel(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') return '○ 등원';
    if (cur === '결석') return '× 결석';
    if (cur === '지각') return '△ 지각';
    if (cur === '보강') return '＋ 보강';
    if (cur === '상담') return '★ 상담';
    if (cur === '수업 없음') return '-'; 
    return '○ 등원';
}

function getAttendanceStatusStyle(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원') {
        return 'background: rgba(0,208,132,0.08); color: var(--success); border: 1px solid rgba(0,208,132,0.15);';
    }
    if (cur === '결석') {
        return 'background: rgba(255,71,87,0.08); color: var(--error); font-weight: 700; border: 1px solid rgba(255,71,87,0.15);';
    }
    if (cur === '지각') {
        return 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight: 700; border: 1px solid rgba(255,165,2,0.18);';
    }
    if (cur === '보강') {
        return 'background: rgba(26,92,255,0.08); color: var(--primary); font-weight: 700; border: 1px solid rgba(26,92,255,0.15);';
    }
    if (cur === '상담') {
        return 'background: rgba(124,58,237,0.10); color: #7c3aed; font-weight: 700; border: 1px solid rgba(124,58,237,0.18);';
    }
    if (cur === '수업 없음') {
        return 'background: transparent; color: var(--border); font-weight: 700; border: 1px dashed var(--border); box-shadow: none;'; 
    }
    return 'background: var(--surface-2); color: var(--secondary); border: 1px solid var(--border);';
}

// ── 숙제 상태 헬퍼 ──────────────────────────────────────────────
function getHomeworkDisplayStatus(status, isClassDay = true) {
    const safe = String(status || '').trim();
    if (safe && safe !== '미기록') return safe;
    return isClassDay ? '완료' : '공란';
}

function getNextHomeworkStatus(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') return '미완료';
    if (cur === '미완료') return '공란';
    return '완료';
}

function getHomeworkStatusLabel(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') return '완료';
    if (cur === '미완료') return '미완료';
    if (cur === '공란') return '-'; 
    return '완료';
}

function getHomeworkStatusStyle(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') {
        return 'background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);';
    }
    if (cur === '미완료') {
        return 'background: rgba(255,165,2,0.12); color: var(--warning); font-weight: 700; border: 1px solid rgba(255,165,2,0.15);';
    }
    if (cur === '공란') {
        return 'background: transparent; color: var(--border); font-weight: 700; border: 1px dashed var(--border); box-shadow: none;'; 
    }
    return 'background: var(--surface-2); color: var(--secondary); border: 1px solid var(--border);';
}


function getV4CompactAttendanceLabel(status, isClassDay = true) {
    const cur = getAttendanceDisplayStatus(status, isClassDay);
    if (cur === '등원' || cur === '지각' || cur === '보강' || cur === '상담') return '○';
    if (cur === '결석') return '×';
    return '';
}

function getV4CompactHomeworkLabel(status, isClassDay = true) {
    const cur = getHomeworkDisplayStatus(status, isClassDay);
    if (cur === '완료') return '○';
    if (cur === '미완료') return '×';
    return '';
}

function getV4BadgeStyle(type, status, isClassDay = true) {
    const safeType = String(type || '').trim();
    const cur = safeType === 'att'
        ? getAttendanceDisplayStatus(status, isClassDay)
        : safeType === 'hw'
            ? getHomeworkDisplayStatus(status, isClassDay)
            : String(status || '').trim();

    if (safeType === 'att') {
        if (cur === '등원' || cur === '지각' || cur === '보강' || cur === '상담') {
            return 'background:rgba(0,184,148,0.10); color:#008F72; border:1px solid transparent;';
        }
        if (cur === '결석') return 'background:rgba(232,65,79,0.10); color:#D92D3A; border:1px solid transparent;';
        return 'background:transparent; color:var(--secondary); border:1px solid var(--border);';
    }

    if (safeType === 'hw') {
        if (cur === '완료') return 'background:rgba(0,184,148,0.10); color:#008F72; border:1px solid transparent;';
        if (cur === '미완료') return 'background:rgba(232,65,79,0.10); color:#D92D3A; border:1px solid transparent;';
        return 'background:transparent; color:var(--secondary); border:1px solid var(--border);';
    }

    return 'background:transparent; color:var(--secondary); border:1px solid var(--border);';
}

function normalizeAttendanceTags(tags) {
    if (Array.isArray(tags)) return tags.map(v => String(v).trim()).filter(Boolean);
    return String(tags || '').split(',').map(v => v.trim()).filter(Boolean);
}

function stringifyAttendanceTags(tags) {
    return Array.from(new Set(normalizeAttendanceTags(tags))).join(',');
}

function getAttendanceMetaForStudentDate(studentId, date) {
    const sid = String(studentId);
    const d = String(date || '');
    const rec = (state.db.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === d);
    return {
        record: rec || null,
        tags: normalizeAttendanceTags(rec?.tags || ''),
        memo: String(rec?.memo || '')
    };
}

function hasAttendanceTag(studentId, date, tag) {
    return getAttendanceMetaForStudentDate(studentId, date).tags.includes(tag);
}

function renderAttendanceTagButton(studentId, date, tag) {
    const on = hasAttendanceTag(studentId, date, tag);
    const safeTag = apEscapeHtml(tag);
    return `<button class="btn cls-v4-status tag ${on ? 'on' : ''}" title="${safeTag}" onclick="toggleAttendanceTag('${studentId}', '${date}', '${safeTag}')">${on ? '○' : ''}</button>`;
}

function hasConsultationForStudentDate(studentId, date) {
    const sid = String(studentId);
    const d = String(date || '').slice(0, 10);
    return (state.db.consultations || []).some(c =>
        String(c.student_id) === sid &&
        String(c.date || c.consultation_date || c.created_at || '').slice(0, 10) === d
    );
}

function renderClassroomConsultationButton(studentId, classId, date) {
    const on = hasConsultationForStudentDate(studentId, date);
    return `<button class="btn cls-v4-status tag consult ${on ? 'on' : ''}" title="상담" onclick="openClassroomConsultation('${studentId}', '${classId}', '${date}')">${on ? '○' : ''}</button>`;
}

// 구버전 호환: 이전 패치의 … 버튼 호출이 남아 있어도 상담으로 바로 연결한다.
function renderClassroomMoreButton(studentId, classId, date) {
    return renderClassroomConsultationButton(studentId, classId, date);
}

function openClassroomMoreMenu(studentId, classId, date) {
    openClassroomConsultation(studentId, classId, date);
}

function renderAttendanceLedgerCellIfOpen(studentId, date) {
    const sid = String(studentId);
    const d = String(date || '');
    const cell = document.getElementById(`att-cell-${sid}-${d}`);
    if (cell && typeof renderAttendanceCellContent === 'function') {
        cell.innerHTML = renderAttendanceCellContent(sid, d);
    }
}

function syncClassroomAttendanceStatusToState(studentId, date, status) {
    const sid = String(studentId);
    const d = String(date || '');
    if (!d) return null;

    if (!state.db.attendance) state.db.attendance = [];
    let rec = state.db.attendance.find(a => String(a.student_id) === sid && String(a.date || '') === d);
    if (!rec) {
        rec = { student_id: sid, date: d, status: status || '미기록', tags: '', memo: '' };
        state.db.attendance.push(rec);
    } else {
        rec.status = status;
    }
    rec.updated_at = new Date().toISOString();

    const month = d.slice(0, 7);
    const cache = state.ui?.monthlyAttendanceCache?.[month];
    if (cache && Array.isArray(cache.attendance)) {
        let mRec = cache.attendance.find(a => String(a.student_id) === sid && String(a.date || '') === d);
        if (!mRec) {
            mRec = {
                student_id: sid,
                date: d,
                status: rec.status || '미기록',
                tags: rec.tags || '',
                memo: rec.memo || ''
            };
            cache.attendance.push(mRec);
        }
        mRec.status = rec.status;
        mRec.tags = rec.tags || mRec.tags || '';
        mRec.memo = rec.memo || mRec.memo || '';
        mRec.updated_at = rec.updated_at;
    }

    renderAttendanceLedgerCellIfOpen(sid, d);
    return rec;
}

function openClassroomConsultation(studentId, classId, date) {
    if (typeof setManagementReturnView === 'function') {
        setManagementReturnView({ type: 'classDetail', classId: String(classId) });
    }

    if (typeof openAddConsultationModal === 'function') {
        openAddConsultationModal(String(studentId));
        requestAnimationFrame(() => {
            const dateInput = document.getElementById('cns-date') || document.getElementById('consultation-date');
            if (dateInput) dateInput.value = String(date || '').slice(0, 10);
        });
        return;
    }

    if (typeof renderStudentDetail === 'function') renderStudentDetail(String(studentId));
}

function syncAttendanceMetaToState(studentId, date, tags, memo) {
    const sid = String(studentId);
    const d = String(date || '');
    const tagText = stringifyAttendanceTags(tags);
    const memoText = memo === undefined ? undefined : String(memo || '');

    if (!state.db.attendance) state.db.attendance = [];
    let rec = state.db.attendance.find(a => String(a.student_id) === sid && String(a.date || '') === d);
    if (!rec) {
        rec = { student_id: sid, date: d, status: '미기록' };
        state.db.attendance.push(rec);
    }

    rec.tags = tagText;
    if (memoText !== undefined) rec.memo = memoText;
    rec.updated_at = new Date().toISOString();

    const month = d.slice(0, 7);
    const cache = state.ui?.monthlyAttendanceCache?.[month];
    if (cache && Array.isArray(cache.attendance)) {
        let mRec = cache.attendance.find(a => String(a.student_id) === sid && String(a.date || '') === d);
        if (!mRec) {
            mRec = { student_id: sid, date: d, status: rec.status || '미기록' };
            cache.attendance.push(mRec);
        }
        mRec.status = rec.status || mRec.status || '미기록';
        mRec.tags = tagText;
        if (memoText !== undefined) mRec.memo = memoText;
        mRec.updated_at = rec.updated_at;
    }

    return rec;
}

async function toggleAttendanceTag(studentId, date, tag) {
    const sid = String(studentId);
    const d = normalizeClassroomDate(date) || getClassroomOperationDate();
    const meta = getAttendanceMetaForStudentDate(sid, d);
    const prevTags = stringifyAttendanceTags(meta.tags);
    const prevMemo = meta.memo;
    const nextTags = meta.tags.includes(tag)
        ? meta.tags.filter(v => v !== tag)
        : meta.tags.concat(tag);
    const nextTagText = stringifyAttendanceTags(nextTags);

    syncAttendanceMetaToState(sid, d, nextTags, prevMemo);
    renderAttendanceLedgerCellIfOpen(sid, d);
    if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);

    try {
        const r = await api.patch('attendance', { studentId: sid, date: d, tags: nextTagText });
        if (!r?.success) throw new Error('fail');
    } catch (e) {
        syncAttendanceMetaToState(sid, d, prevTags, prevMemo);
        renderAttendanceLedgerCellIfOpen(sid, d);
        if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
        toast('저장 실패', 'warn');
    }
}

function openAttendanceMetaModal(studentId, date, options = {}) {
    const sid = String(studentId);
    const d = normalizeClassroomDate(date) || getClassroomOperationDate();
    const student = (state.db.students || []).find(s => String(s.id) === sid);
    const meta = getAttendanceMetaForStudentDate(sid, d);
    const status = meta.record?.status || '미기록';
    const tagSet = new Set(meta.tags);

    const tagInput = function(tag, label) {
        const checked = tagSet.has(tag) ? 'checked' : '';
        return `<label style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);font-size:13px;font-weight:700;color:var(--text);">
            <input type="checkbox" class="att-meta-tag" value="${apEscapeHtml(tag)}" ${checked} style="accent-color:var(--primary);">${label}
        </label>`;
    };

    showModal('출결 메모', `
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="padding:12px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);">
                <div style="font-size:15px;font-weight:700;color:var(--text);line-height:1.4;">${apEscapeHtml(student?.name || '학생')}</div>
                <div style="font-size:12px;font-weight:700;color:var(--secondary);margin-top:4px;line-height:1.4;">${apEscapeHtml(d)} · 현재 출결 ${apEscapeHtml(status)}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${tagInput('지각', '지각')}
                ${tagInput('보강', '보강')}
            </div>
            <textarea id="att-meta-memo" class="cls-input" placeholder="출결 관련 메모" style="height:110px;resize:none;line-height:1.6;">${apEscapeHtml(meta.memo)}</textarea>
            <button class="btn btn-primary" style="width:100%;min-height:50px;font-size:14px;font-weight:700;border-radius:14px;" onclick="saveAttendanceMeta('${sid}', '${d}', { source: '${apEscapeHtml(options.source || 'classroom')}' })">저장</button>
        </div>
    `);
}

async function saveAttendanceMeta(studentId, date, options = {}) {
    const sid = String(studentId);
    const d = normalizeClassroomDate(date) || getClassroomOperationDate();
    const prev = getAttendanceMetaForStudentDate(sid, d);
    const tags = Array.from(document.querySelectorAll('.att-meta-tag:checked')).map(el => el.value);
    const memo = document.getElementById('att-meta-memo')?.value.trim() || '';
    const tagText = stringifyAttendanceTags(tags);

    syncAttendanceMetaToState(sid, d, tags, memo);
    if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
    const cell = document.getElementById(`att-cell-${sid}-${d}`);
    if (cell && typeof renderAttendanceCellContent === 'function') cell.innerHTML = renderAttendanceCellContent(sid, d);

    try {
        const r = await api.patch('attendance', { studentId: sid, date: d, tags: tagText, memo });
        if (!r?.success) throw new Error('fail');
        toast('저장 완료', 'success');
        closeModal(true);
    } catch (e) {
        syncAttendanceMetaToState(sid, d, prev.tags, prev.memo);
        if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
        if (cell && typeof renderAttendanceCellContent === 'function') cell.innerHTML = renderAttendanceCellContent(sid, d);
        toast('저장 실패', 'warn');
    }
}

function rerenderClassPreserveScroll(classId) {
    const y = window.scrollY || window.pageYOffset || 0;
    renderClass(classId);
    requestAnimationFrame(() => window.scrollTo(0, y));
}

function getClassroomOperationDate() {
    if (typeof getOperationDate === 'function') return getOperationDate();
    if (typeof getBaseDate === 'function') return getBaseDate();
    return new Date().toLocaleDateString('sv-SE');
}

function getClassroomTodayDate() {
    return typeof getTodayStr === 'function' ? getTodayStr() : new Date().toLocaleDateString('sv-SE');
}

function normalizeClassroomDate(value) {
    if (typeof normalizeDateStr === 'function') return normalizeDateStr(value);
    const s = String(value || '').trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : '';
}

function mergeClassroomDateRecords(date, attendanceRows = [], homeworkRows = []) {
    const d = normalizeClassroomDate(date);
    if (!d) return;

    if (!state.db.attendance) state.db.attendance = [];
    if (!state.db.homework) state.db.homework = [];

    const mergeRows = function(target, rows) {
        if (!Array.isArray(rows)) return;
        rows.forEach(row => {
            if (!row || String(row.date || '') !== d) return;
            const sid = String(row.student_id || row.studentId || '');
            if (!sid) return;
            const idx = target.findIndex(item => String(item.student_id) === sid && String(item.date || '') === d);
            if (idx > -1) target[idx] = { ...target[idx], ...row, student_id: sid, date: d };
            else target.push({ ...row, student_id: sid, date: d });
        });
    };

    mergeRows(state.db.attendance, attendanceRows);
    mergeRows(state.db.homework, homeworkRows);
}

async function loadClassroomOperationDateData(date, force = false) {
    const d = normalizeClassroomDate(date);
    if (!d) return false;
    if (!state.ui) state.ui = {};
    if (!state.ui.classOperationDateCache) state.ui.classOperationDateCache = {};
    if (!force && state.ui.classOperationDateCache[d]) return true;

    try {
        const data = await api.get(`attendance-history?date=${encodeURIComponent(d)}`);
        const attendanceRows = Array.isArray(data.attendance) ? data.attendance : [];
        const homeworkRows = Array.isArray(data.homework) ? data.homework : [];
        mergeClassroomDateRecords(d, attendanceRows, homeworkRows);
        state.ui.classOperationDateCache[d] = true;
        return true;
    } catch (e) {
        console.warn('[loadClassroomOperationDateData] failed:', e);
        return false;
    }
}

async function changeClassOperationDate(cid, dateStr) {
    const safeDate = normalizeClassroomDate(dateStr);
    if (!safeDate) {
        toast('날짜를 선택하세요.', 'warn');
        return;
    }

    if (typeof setBaseDate === 'function') setBaseDate(safeDate);
    else {
        if (!state.ui) state.ui = {};
        state.ui.baseDate = safeDate;
    }

    await loadClassroomOperationDateData(safeDate, true);
    renderClass(cid);
}

// [5G-2] PIN 일괄 배분 기능
async function handleBatchGeneratePins(classId) {
    if (!confirm('이 반에서 PIN이 아직 없는 학생들에게 고유 PIN을 일괄 배분하시겠습니까? (기존 PIN은 유지됨)')) return;
    const r = await api.post('students/batch-pins', { class_id: classId });
    if (r.success) {
        toast(`총 ${r.count}명의 학생에게 PIN이 자동 배분되었습니다.`, 'info');
        await loadData();
    } else {
        toast(r.message || '일괄 배분에 실패했습니다.', 'error');
    }
}

// [Phase 4/5] 요약 계산
function computeClassTodaySummary(classId, dateStr = '') {
    const today = normalizeClassroomDate(dateStr) || getClassroomOperationDate();
    const todayExam = typeof getTodayExamConfig === 'function' ? getTodayExamConfig() : null;
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const aIds = new Set(active.map(s => String(s.id)));
    const total = active.length;

    const hasActiveAttendance = state.db.attendance.some(a => a.date === today && ids.includes(String(a.student_id)) && a.status === '등원');
    const isScheduled = hasActiveAttendance || isClassScheduledOnDate(classId, today);

    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };

    const todayAttMap = {};
    for (let i = 0; i < state.db.attendance.length; i++) {
        let a = state.db.attendance[i];
        if (a.date === today && aIds.has(String(a.student_id))) todayAttMap[a.student_id] = a.status;
    }
    const todayHwMap = {};
    for (let i = 0; i < state.db.homework.length; i++) {
        let h = state.db.homework[i];
        if (h.date === today && aIds.has(String(h.student_id))) todayHwMap[h.student_id] = h.status;
    }

    let attCount = 0; let hwCount = 0;
    active.forEach(s => {
        const attStatus = getAttendanceDisplayStatus(todayAttMap[s.id], isScheduled);
        if (attStatus === '등원') attCount++;
        const hwStatus = getHomeworkDisplayStatus(todayHwMap[s.id], isScheduled);
        if (hwStatus === '완료') hwCount++;
    });

    let test = 0;
    if (todayExam) {
        let testedIds = new Set();
        for (let i = 0; i < state.db.exam_sessions.length; i++) {
            let es = state.db.exam_sessions[i];
            if (es.exam_date === today && es.exam_title === todayExam.title && aIds.has(String(es.student_id))) testedIds.add(String(es.student_id));
        }
        test = testedIds.size;
    }
    return { att: attCount, hw: hwCount, test, total, isScheduled };
}

function openClassAttendance(cid) {
    state.ui.classDefaultTab = 'att';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

function getHomeworkPhotoQrSrc(url) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(url)}`;
}

function getHomeworkPhotoBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/')) path = path.substring(0, path.lastIndexOf('/') + 1);
    return origin + path + 'homework/';
}

function buildHomeworkPhotoStudentUrl(assignmentId, studentId, fallbackUrl = '') {
    if (!assignmentId || !studentId) return fallbackUrl || '';
    const params = new URLSearchParams();
    params.set('assignment_id', assignmentId);
    params.set('student_id', studentId);
    return `${getHomeworkPhotoBaseUrl()}?${params.toString()}`;
}

async function copyHomeworkPhotoText(text, successMessage = '복사되었습니다.') {
    try {
        await navigator.clipboard.writeText(String(text || ''));
        toast(successMessage, 'info');
    } catch (e) {
        toast('복사에 실패했습니다.', 'warn');
    }
}

function openHomeworkPhotoAssignmentModal(classId) {
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    const today = typeof getClassroomOperationDate === 'function' ? getClassroomOperationDate() : new Date().toLocaleDateString('sv-SE');
    showModal('숙제', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                <div style="font-size:15px; font-weight:800; color:var(--text);">${apEscapeHtml(cls?.name || '반')}</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">학생별 제출 링크와 QR이 생성됩니다.</div>
            </div>
            <input id="hw-photo-title" class="cls-input" placeholder="숙제 제목">
            <textarea id="hw-photo-desc" class="cls-input" rows="4" placeholder="숙제 설명" style="resize:vertical;"></textarea>
            <div style="display:grid; grid-template-columns:1fr 120px; gap:8px;">
                <input id="hw-photo-date" type="date" class="cls-input" value="${apEscapeHtml(today)}">
                <input id="hw-photo-time" type="time" class="cls-input" value="23:00">
            </div>
            <button class="btn btn-primary" style="min-height:48px; font-size:14px; font-weight:800;" onclick="handleCreateHomeworkPhotoAssignment('${classId}')">저장하고 링크 생성</button>
            <button class="btn" style="min-height:44px; font-size:13px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="openHomeworkPhotoAssignmentList('${classId}')">기존 숙제 보기</button>
        </div>
    `);
}

async function handleCreateHomeworkPhotoAssignment(classId) {
    const title = document.getElementById('hw-photo-title')?.value.trim() || '';
    const description = document.getElementById('hw-photo-desc')?.value.trim() || '';
    const dueDate = document.getElementById('hw-photo-date')?.value || '';
    const dueTime = document.getElementById('hw-photo-time')?.value || '';
    if (!title || !dueDate) return toast('숙제 제목과 마감일을 입력하세요.', 'warn');

    try {
        const res = api.createHomeworkPhotoAssignment
            ? await api.createHomeworkPhotoAssignment({ class_id: classId, title, description, due_date: dueDate, due_time: dueTime })
            : await api.post('homework-photo/assignments', { class_id: classId, title, description, due_date: dueDate, due_time: dueTime });
        if (!res?.success) return toast(res?.message || res?.error || '숙제 등록 실패', 'warn');
        toast('숙제가 등록되었습니다.', 'success');
        openHomeworkPhotoLinksModal(res.assignment_id, res.links || []);
    } catch (e) {
        console.error('[handleCreateHomeworkPhotoAssignment] failed:', e);
        toast('숙제 등록 중 오류가 발생했습니다.', 'error');
    }
}

async function openHomeworkPhotoAssignmentList(classId) {
    showModal('숙제 목록', `<div id="hw-photo-assignment-list" style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">불러오는 중...</div>`);
    try {
        const data = api.getHomeworkPhotoAssignments
            ? await api.getHomeworkPhotoAssignments(classId)
            : await api.get(`homework-photo/assignments?class_id=${encodeURIComponent(classId)}`);
        const root = document.getElementById('hw-photo-assignment-list');
        if (!root) return;
        const list = Array.isArray(data.assignments) ? data.assignments : [];
        if (!data?.success || !list.length) {
            root.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">등록된 숙제가 없습니다.</div>`;
            return;
        }
        root.innerHTML = `<div style="display:flex; flex-direction:column; gap:10px;">${list.map(a => {
            const total = Number(a.total || 0);
            const submitted = Number(a.submitted || 0);
            return `
                <div style="border:1px solid var(--border); border-radius:14px; padding:13px; background:var(--surface);">
                    <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                        <div style="min-width:0;">
                            <div style="font-size:14px; font-weight:800; color:var(--text); line-height:1.35;">${apEscapeHtml(a.title || '숙제')}</div>
                            <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">마감 ${apEscapeHtml(a.due_date || '')}${a.due_time ? ` ${apEscapeHtml(a.due_time)}` : ''} · 제출 ${submitted}/${total}</div>
                        </div>
                        <div style="font-size:12px; font-weight:800; color:${a.status === 'closed' ? 'var(--secondary)' : 'var(--primary)'};">${a.status === 'closed' ? '마감' : '진행'}</div>
                    </div>
                    <div style="display:flex; gap:8px; margin-top:12px;">
                        <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; border-radius:10px; background:var(--surface-2); border:none;" onclick="openHomeworkPhotoOverviewModal('${a.id}')">현황</button>
                        <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; border-radius:10px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="loadHomeworkPhotoLinksModal('${a.id}')">링크</button>
                        <button class="btn" style="flex:1; min-height:38px; font-size:12px; font-weight:800; border-radius:10px; background:rgba(232,65,79,0.08); border:none; color:var(--error);" onclick="deleteHomeworkPhotoAssignment('${a.id}', '${classId}')">삭제</button>
                    </div>
                </div>
            `;
        }).join('')}</div>`;
    } catch (e) {
        console.error('[openHomeworkPhotoAssignmentList] failed:', e);
        toast('숙제 목록 조회 중 오류가 발생했습니다.', 'error');
    }
}

async function loadHomeworkPhotoLinksModal(assignmentId) {
    showModal('학생별 링크', `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">불러오는 중...</div>`);
    try {
        const data = api.getHomeworkPhotoStudentLinks
            ? await api.getHomeworkPhotoStudentLinks(assignmentId)
            : await api.get(`homework-photo/student-links?assignment_id=${encodeURIComponent(assignmentId)}`);
        if (!data?.success) return toast(data?.message || data?.error || '링크 조회 실패', 'warn');
        openHomeworkPhotoLinksModal(assignmentId, data.links || []);
    } catch (e) {
        console.error('[loadHomeworkPhotoLinksModal] failed:', e);
        toast('링크 조회 중 오류가 발생했습니다.', 'error');
    }
}

function openHomeworkPhotoLinksModal(assignmentId, links) {
    const list = Array.isArray(links) ? links : [];
    const normalized = list.map(x => ({
        ...x,
        url: buildHomeworkPhotoStudentUrl(assignmentId, x.student_id, x.url)
    }));
    const allText = normalized.map(x => `${x.name}: ${x.url}`).join('\n');
    showModal('학생별 링크', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="display:flex; gap:8px;">
                <button class="btn btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:800;" onclick="openHomeworkPhotoOverviewModal('${assignmentId}')">제출 현황</button>
                <button class="btn" style="flex:1; min-height:42px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="copyHomeworkPhotoText(document.getElementById('hw-photo-all-links')?.value || '', '전체 링크가 복사되었습니다.')">전체 복사</button>
            </div>
            <textarea id="hw-photo-all-links" style="position:absolute; left:-9999px; width:1px; height:1px;">${apEscapeHtml(allText)}</textarea>
            ${normalized.length ? normalized.map(item => {
                const safeUrl = String(item.url || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                return `
                    <div style="border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface);">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                            <div style="min-width:0;">
                                <div style="font-size:14px; font-weight:800; color:var(--text);">${apEscapeHtml(item.name || '학생')}</div>
                                <div style="font-size:11px; font-weight:700; color:var(--secondary); word-break:break-all; margin-top:4px;">${apEscapeHtml(item.url || '')}</div>
                            </div>
                            <button class="btn" style="flex:0 0 auto; min-height:36px; width:auto; padding:8px 10px; font-size:11px; font-weight:800; border-radius:10px; background:rgba(26,92,255,0.08); color:var(--primary); border:none;" onclick="copyHomeworkPhotoText('${safeUrl}', '링크가 복사되었습니다.')">복사</button>
                        </div>
                        <div style="margin-top:10px; text-align:center;">
                            <img src="${getHomeworkPhotoQrSrc(item.url || '')}" alt="QR" style="width:128px; height:128px; background:#fff; border:1px solid var(--border); border-radius:12px; padding:8px;">
                        </div>
                    </div>
                `;
            }).join('') : `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">생성된 링크가 없습니다.</div>`}
        </div>
    `);
}

async function openHomeworkPhotoOverviewModal(assignmentId) {
    showModal('제출 현황', `<div id="hw-photo-overview" style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:800;">불러오는 중...</div>`);
    try {
        const data = api.getHomeworkPhotoOverview
            ? await api.getHomeworkPhotoOverview(assignmentId)
            : await api.get(`homework-photo/overview?assignment_id=${encodeURIComponent(assignmentId)}`);
        const root = document.getElementById('hw-photo-overview');
        if (!root) return;
        if (!data?.success) {
            root.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:800;">현황을 불러오지 못했습니다.</div>`;
            return toast(data?.message || data?.error || '현황 조회 실패', 'warn');
        }
        const rows = Array.isArray(data.students) ? data.students : [];
        const total = rows.length;
        const submitted = rows.filter(r => Number(r.is_submitted || 0) === 1).length;
        root.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                    <div style="font-size:15px; font-weight:800; color:var(--text);">${apEscapeHtml(data.assignment?.title || '숙제')}</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">전체 ${total} · 제출 ${submitted} · 미제출 ${total - submitted}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn" style="flex:1; min-height:40px; font-size:12px; font-weight:800; background:var(--surface-2); border:1px solid var(--border);" onclick="loadHomeworkPhotoLinksModal('${assignmentId}')">링크 보기</button>
                    <button class="btn" style="flex:1; min-height:40px; font-size:12px; font-weight:800; color:var(--error); background:rgba(232,65,79,0.08); border:1px solid rgba(232,65,79,0.16);" onclick="closeHomeworkPhotoAssignment('${assignmentId}')">마감 처리</button>
                    <button class="btn" style="flex:1; min-height:40px; font-size:12px; font-weight:800; color:var(--error); background:rgba(232,65,79,0.08); border:1px solid rgba(232,65,79,0.16);" onclick="deleteHomeworkPhotoAssignment('${assignmentId}', '${apEscapeHtml(data.assignment?.class_id || '')}')">삭제</button>
                </div>
                ${rows.map(r => {
                    const done = Number(r.is_submitted || 0) === 1;
                    const studentUrl = buildHomeworkPhotoStudentUrl(assignmentId, r.student_id, r.url);
                    const safeUrl = String(studentUrl || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                    return `
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface);">
                            <div style="min-width:0;">
                                <div style="font-size:14px; font-weight:800; color:var(--text);">${apEscapeHtml(r.name || '')}</div>
                                <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:4px;">${done ? `제출 ${apEscapeHtml(r.submitted_at || '')}` : '미제출'} · 사진 ${Number(r.file_count || 0)}장</div>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:13px; font-weight:900; color:${done ? 'var(--success)' : 'var(--error)'};">${done ? '완료' : '미제출'}</span>
                                <button class="btn" style="width:auto; min-height:34px; padding:7px 9px; font-size:11px; font-weight:800; border-radius:9px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="copyHomeworkPhotoText('${safeUrl}', '링크가 복사되었습니다.')">링크</button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    } catch (e) {
        console.error('[openHomeworkPhotoOverviewModal] failed:', e);
        toast('제출 현황 조회 중 오류가 발생했습니다.', 'error');
    }
}

async function closeHomeworkPhotoAssignment(assignmentId) {
    if (!confirm('미제출 학생을 기존 숙제 칸에 미완료로 반영하고 마감할까요?')) return;
    try {
        const res = api.closeHomeworkPhotoAssignment
            ? await api.closeHomeworkPhotoAssignment(assignmentId)
            : await api.patch(`homework-photo/${encodeURIComponent(assignmentId)}/close`, {});
        if (!res?.success) return toast(res?.message || res?.error || '마감 처리 실패', 'warn');
        toast('마감 처리되었습니다.', 'success');
        if (typeof refreshDataOnly === 'function') await refreshDataOnly();
        openHomeworkPhotoOverviewModal(assignmentId);
    } catch (e) {
        console.error('[closeHomeworkPhotoAssignment] failed:', e);
        toast('마감 처리 중 오류가 발생했습니다.', 'error');
    }
}

async function deleteHomeworkPhotoAssignment(assignmentId, classId = '') {
    const safeClassId = String(classId || '').trim();
    if (!assignmentId) return toast('삭제할 숙제를 찾을 수 없습니다.', 'warn');
    if (!confirm('이 숙제를 삭제할까요? 학생 제출 링크와 목록에서 더 이상 보이지 않습니다.')) return;

    try {
        const res = api.deleteHomeworkPhotoAssignment
            ? await api.deleteHomeworkPhotoAssignment(assignmentId)
            : await api.delete('homework-photo', assignmentId);
        if (!res?.success) return toast(res?.message || res?.error || '숙제 삭제 실패', 'warn');
        toast('숙제가 삭제되었습니다.', 'success');
        if (typeof refreshDataOnly === 'function') await refreshDataOnly();
        if (safeClassId) openHomeworkPhotoAssignmentList(safeClassId);
        else closeModal(true);
    } catch (e) {
        console.error('[deleteHomeworkPhotoAssignment] failed:', e);
        toast('숙제 삭제 중 오류가 발생했습니다.', 'error');
    }
}

function openClassHomework(cid) {
    state.ui.classDefaultTab = 'hw';
    if (typeof openDashboardClass === 'function') openDashboardClass(cid);
    else renderClass(cid);
}

// [UI Standard Applied]: 학급 메인 화면
function getClassroomActiveStudents(cid) {
    const mIds = state.db.class_students
        .filter(m => String(m.class_id) === String(cid))
        .map(m => String(m.student_id));
    const orderMap = new Map(mIds.map((id, idx) => [String(id), idx]));
    return state.db.students
        .filter(s => mIds.includes(String(s.id)) && s.status === '재원')
        .sort((a, b) => (orderMap.get(String(a.id)) ?? 9999) - (orderMap.get(String(b.id)) ?? 9999));
}

function buildClassroomTodayMaps(students, today) {
    const idSet = new Set(students.map(s => String(s.id)));
    const todayAttMap = {};
    const todayHwMap = {};

    for (let i = 0; i < state.db.attendance.length; i++) {
        const a = state.db.attendance[i];
        if (a.date === today && idSet.has(String(a.student_id))) todayAttMap[a.student_id] = a.status;
    }
    for (let i = 0; i < state.db.homework.length; i++) {
        const h = state.db.homework[i];
        if (h.date === today && idSet.has(String(h.student_id))) todayHwMap[h.student_id] = h.status;
    }

    return { todayAttMap, todayHwMap };
}

function renderClassTopBarV4B(cls, summary, today) {
    const realToday = getClassroomTodayDate();
    const dateLabel = today === realToday ? '오늘 운영' : '선택일 운영';
    const statusHtml = summary.isScheduled
        ? `<div class="cls-v4-summary" id="v4-summary-root">
            <span class="cls-v4-pill">출석 <b>${summary.att}/${summary.total}</b></span>
            <span class="cls-v4-pill">숙제 <b>${summary.hw}/${summary.total}</b></span>
          </div>`
        : `<div class="cls-v4-summary" id="v4-summary-root"><span class="cls-v4-pill warn">정규 수업일 아님</span></div>`;

    return `
        <div class="cls-v4-top">
            <div class="cls-v4-title">
                <div class="cls-v4-title-main">${apEscapeHtml(cls.name)}</div>
                <div class="cls-v4-title-sub">${dateLabel} · ${today} · ${formatClassScheduleDays(cls.schedule_days)}</div>
            </div>
            ${statusHtml}
        </div>
    `;
}

function renderClassToolBarV4B(cid, plannerEnabled, today) {
    const realToday = getClassroomTodayDate();
    return `
        <div class="cls-v4-tools">
            <input type="date" class="cls-v4-date-input" value="${apEscapeHtml(today)}" onchange="changeClassOperationDate('${cid}', this.value)" title="운영 날짜 선택">
            <button class="btn cls-v4-date-reset" onclick="changeClassOperationDate('${cid}', '${realToday}')">오늘</button>
            <button class="btn cls-v4-tool red" onclick="openClassRecordModal('${cid}')">진도</button>
            <button class="btn cls-v4-tool green" onclick="openHomeworkPhotoAssignmentModal('${cid}')">숙제</button>
            <button class="btn cls-v4-tool blue" onclick="openQrGenerator('${cid}')">QR/OMR</button>
            <button class="btn cls-v4-tool orange" onclick="openExamGradeView('${cid}')">시험성적</button>
            <button class="btn cls-v4-tool purple" onclick="if(typeof openClinicBasketForClass==='function') openClinicBasketForClass('${cid}'); else toast('클리닉 준비중', 'warn');">클리닉</button>
            ${plannerEnabled ? `<button class="btn cls-v4-tool green" onclick="renderPlannerControl('${cid}')">플래너</button>` : ''}
        </div>
    `;
}

function renderClassStudentBoardV4B(cid, students, todayAttMap, todayHwMap, isScheduled, plannerEnabled, today) {
    if (!students.length) {
        return `<div class="cls-v4-board"><div class="cls-v4-empty">재원생이 없습니다.</div></div>`;
    }

    return `
        <div class="cls-v4-board">
            <div class="cls-v4-board-head">
                <div class="name-spacer"></div>
                <div>출결</div>
                <div>숙제</div>
                <div>지각</div>
                <div>보강</div>
                <div>상담</div>
            </div>
            ${students.map(s => renderClassStudentRowV4B(cid, s, todayAttMap[s.id], todayHwMap[s.id], isScheduled, plannerEnabled, today)).join('')}
        </div>
    `;
}

function renderClassStudentRowV4B(cid, s, attStatus, hwStatus, isScheduled, plannerEnabled, today) {
    const rowDate = normalizeClassroomDate(today) || getClassroomOperationDate();
    const attStyle = getV4BadgeStyle('att', attStatus, isScheduled);
    const attLabel = getV4CompactAttendanceLabel(attStatus, isScheduled);
    const hwStyle = getV4BadgeStyle('hw', hwStatus, isScheduled);
    const hwLabel = getV4CompactHomeworkLabel(hwStatus, isScheduled);

    return `
        <div class="cls-v4-row" id="class-row-${s.id}">
            <div class="cls-v4-name-col" onclick="setManagementReturnView({ type: 'classDetail', classId: '${cid}' }); renderStudentDetail('${s.id}')">
                <div class="cls-v4-student">${apEscapeHtml(s.name)}</div>
            </div>
            <div class="cls-v4-badges">
                <button class="btn cls-v4-status class-att-toggle" style="${attStyle}" onclick="toggleAtt('${s.id}', '${rowDate}')">${attLabel}</button>
                <button class="btn cls-v4-status hw class-hw-toggle" style="${hwStyle}" onclick="toggleHw('${s.id}', '${rowDate}')">${hwLabel}</button>
                ${renderAttendanceTagButton(s.id, rowDate, '지각')}
                ${renderAttendanceTagButton(s.id, rowDate, '보강')}
                ${renderClassroomConsultationButton(s.id, cid, rowDate)}
            </div>
        </div>
    `;
}


function updateClassSummaryDOM(cid) {
    const root = document.getElementById('v4-summary-root');
    if (!root) return;
    const summary = computeClassTodaySummary(cid, getClassroomOperationDate());
    root.innerHTML = summary.isScheduled
        ? `<span class="cls-v4-pill">출석 <b>${summary.att}/${summary.total}</b></span>
           <span class="cls-v4-pill">숙제 <b>${summary.hw}/${summary.total}</b></span>`
        : `<span class="cls-v4-pill warn">정규 수업일 아님</span>`;
}

function updateStudentRowDOM(sid, cid) {
    const row = document.getElementById('class-row-' + sid);
    if (!row) return false;

    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const student = state.db.students.find(st => String(st.id) === String(sid));
    if (!cls || !student) return false;

    const today = getClassroomOperationDate();
    const summary = computeClassTodaySummary(cid, today);
    const attCur = state.db.attendance.find(a => String(a.student_id) === String(sid) && a.date === today);
    const hwCur = state.db.homework.find(h => String(h.student_id) === String(sid) && h.date === today);
    const plannerEnabled = isPlannerTargetClass(cls);
    const newHtml = renderClassStudentRowV4B(cid, student, attCur?.status, hwCur?.status, summary.isScheduled, plannerEnabled, today);

    row.insertAdjacentHTML('afterend', newHtml);
    row.remove();
    updateClassSummaryDOM(cid);
    return true;
}

window.openStudentActionSheetV4 = function(sid, cid, hasPlanner) {
    const plannerOn = hasPlanner === true || String(hasPlanner) === 'true';
    const s = state.db.students.find(st => String(st.id) === String(sid));
    const sname = s?.name || '학생';
    const html = `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="font-size:14px; font-weight:700; color:var(--text); margin-bottom:4px; text-align:center;">${apEscapeHtml(sname)} 학생 관리</div>
            <button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer;" onclick="closeModal(true); setManagementReturnView({ type: 'classDetail', classId: '${cid}' }); renderStudentDetail('${sid}')">상세 정보 열기</button>
            <button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer;" onclick="closeModal(true); if(typeof openOMR==='function') openOMR('${sid}', '단원평가', 20, '${cid}', '', '', 'class')">OMR / 성적 입력</button>
            ${plannerOn ? `<button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer; color:var(--primary); border-color:rgba(26,92,255,0.2);" onclick="closeModal(true); copyPlannerStudentLink('${sid}')">플래너 링크 복사</button>` : ''}
        </div>
    `;
    showModal('학생 관리', html);
};

// [Classroom v4-B]: 안정형 현장 운영판
function renderClass(cid) {
    injectClassroomStyles();
    const defaultTab = state.ui.classDefaultTab || '';
    state.ui.classDefaultTab = null;
    state.ui.currentClassId = String(cid);

    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    if (!cls) {
        document.getElementById('app-root').innerHTML = `<div class="card" style="max-width:850px; margin:0 auto; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">반 정보를 찾을 수 없습니다.</div>`;
        return;
    }

    const today = getClassroomOperationDate();
    const summary = computeClassTodaySummary(cid, today);
    const students = getClassroomActiveStudents(cid);
    const { todayAttMap, todayHwMap } = buildClassroomTodayMaps(students, today);
    const plannerEnabled = isPlannerTargetClass(cls);

    document.getElementById('app-root').innerHTML = `
        <div class="cls-fade-in cls-v4-wrap">
            ${renderClassTopBarV4B(cls, summary, today)}
            ${renderClassToolBarV4B(cid, plannerEnabled, today)}
            <div class="cls-v4-section">
                <h3>학생 명단</h3>
            </div>
            ${renderClassStudentBoardV4B(cid, students, todayAttMap, todayHwMap, summary.isScheduled, plannerEnabled, today)}
        </div>
    `;

    if (defaultTab === 'att' || defaultTab === 'hw') {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                const selector = defaultTab === 'att' ? '.class-att-toggle' : '.class-hw-toggle';
                const target = document.querySelector(selector);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    target.focus({ preventScroll: true });
                }
            });
        });
    }
}

// 학년별 소단원 마스터 테이블
var MATH_CURRICULUM_UNITS = {
    '중1': ['소인수분해','정수와 유리수','문자와 식','좌표평면과 그래프','기본도형','평면도형의 성질','입체도형의 성질','자료의 정리와 해석'],
    '중2': ['수와 식','일차부등식','연립일차방정식','일차함수와 그래프','도형의 성질','도형의 닮음','피타고라스 정리','확률'],
    '중3': ['실수와 그 계산','다항식의 곱셈과 인수분해','이차방정식','이차함수와 그래프','삼각비','원의 성질','통계'],
    '고1': ['다항식의 연산','항등식과 나머지 정리','인수분해','복소수와 이차방정식','이차방정식과 이차함수','여러 가지 방정식과 부등식','합의 법칙과 곱의 법칙','순열과 조합','행렬과 그 연산','평면좌표','직선의 방정식','원의 방정식','도형의 이동','집합','명제','함수','유리함수','무리함수'],
    '고2': ['지수와 로그','지수함수','로그함수','삼각함수','사인법칙과 코사인법칙','등차수열과 등비수열','수열의 합','수학적 귀납법','함수의 극한','함수의 연속','미분계수','도함수','도함수의 활용','부정적분','정적분','정적분의 활용'],
    '고3': ['수열의 극한','급수','지수함수와 로그함수의 미분','삼각함수의 미분','여러 가지 미분법','도함수의 활용','여러 가지 적분법','정적분의 활용','순열과 조합','이항정리','확률의 뜻과 활용','조건부확률','확률분포','통계적 추정','이차곡선','이차곡선의 접선','공간도형','공간좌표','벡터의 연산','벡터의 성분','벡터의 내적','도형의 방정식']
};

function _getClassGradeKey(cls) {
    if (!cls) return '';
    var text = String(cls.grade || '') + ' ' + String(cls.name || '');
    var match = text.match(/(중1|중2|중3|고1|고2|고3)/);
    return match ? match[1] : '';
}

function openClassRecordModal(cid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId: cid });
    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    const todayStr = getClassroomOperationDate();
    const allTextbooks = state.db.class_textbooks || [];
    let activeBooks = allTextbooks.filter(tb => String(tb.class_id) === String(cid) && tb.status === 'active');
    if (activeBooks.length === 0 && cls?.textbook) activeBooks = [{ id: 'fallback', title: cls.textbook }];

const existingRecord = (state.db.class_daily_records || [])
    .filter(r =>
        String(r.class_id) === String(cid) &&
        String(r.date || '') <= String(todayStr)
    )
    .sort((a, b) =>
        String(b.date || '').localeCompare(String(a.date || '')) ||
        String(b.id || '').localeCompare(String(a.id || ''))
    )[0] || null;

const existingProgress = existingRecord
    ? (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(existingRecord.id))
    : [];
    
    const booksHtml = activeBooks.length > 0 ? activeBooks.map((tb) => {
        const prevP = existingProgress.find(p => String(p.textbook_id) === String(tb.id) || (tb.id === 'fallback' && p.textbook_title_snapshot === tb.title));
        const progVal = prevP ? prevP.progress_text : '';
        const isChecked = (prevP || progVal) ? 'checked' : '';
        return `<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight:700; min-width: 120px; color: var(--text); cursor: pointer; line-height: 1.5;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform: scale(1.1); accent-color: var(--primary);">
                ${apEscapeHtml(tb.title)}
            </label>
            <input type="text" class="cls-input record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="예: p.10~25" style="flex: 1; min-height: 44px;">
        </div>`;
    }).join('') : `<div style="font-size: 12px; color: var(--secondary); padding: 24px; text-align: center; background: var(--surface-2); border-radius: 16px; font-weight: 700; line-height: 1.5;">활성 교재 없음</div>`;

    const rawNote = existingRecord ? (existingRecord.special_note || '') : '';
    const unitLineMatch = rawNote.match(/^\[단원선택\]([^\n]*)\n?/);
    const prevSelectedUnits = unitLineMatch ? unitLineMatch[1].split(',').map(u => u.trim()).filter(Boolean) : [];
    const prevNote = rawNote.replace(/^\[단원선택\][^\n]*\n?/, '').trim();

    const gradeKey = _getClassGradeKey(cls);
    const units = gradeKey ? (MATH_CURRICULUM_UNITS[gradeKey] || []) : [];
    let unitsHtml = '';
    if (units.length > 0) {
        unitsHtml = `<div style="margin-bottom: 20px;">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px;">
                <h4 style="margin:0;font-size:16px;font-weight:700;color:var(--text);line-height:1.3;">오늘 수업 단원 <span style="font-size:11px;font-weight:600;color:var(--secondary);">${gradeKey}</span></h4>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${units.map(u => {
                const checked = prevSelectedUnits.indexOf(u) !== -1 ? 'checked' : '';
                return `<label style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;cursor:pointer;padding:4px 8px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);white-space:nowrap;color:var(--text);">
                    <input type="checkbox" class="record-unit-check" value="${apEscapeHtml(u)}" ${checked} style="accent-color:var(--primary);cursor:pointer;">${apEscapeHtml(u)}</label>`;
            }).join('')}</div>
        </div>`;
    }

    showModal('진도관리', `${unitsHtml}<div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">교재별 진도</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--secondary); line-height: 1.5;">${todayStr}</span>
            </div>
            <div style="background: var(--surface); padding: 4px 0;">${booksHtml}</div>
        </div>
        <div style="margin-bottom: 32px;"><h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">특이사항</h4>
            <textarea id="record-special-note" class="cls-input" placeholder="수업 특이사항 메모" style="height: 100px; resize: none; padding: 14px; line-height: 1.6;">${apEscapeHtml(prevNote)}</textarea>
        </div>
        <button class="btn btn-primary" style="width: 100%; min-height: 52px; padding: 14px 16px; font-size: 14px; font-weight:700; border-radius: 14px; box-shadow: none;" onclick="saveClassRecord('${cid}', '${todayStr}')">기록 저장하기</button>`);
}

async function saveClassRecord(cid, dateStr) {
    const checks = document.querySelectorAll('.record-tb-check:checked');
    const progresses = [];
    checks.forEach(chk => {
        const tbId = chk.value;
        const progInput = document.getElementById(`progress_${tbId}`);
        progresses.push({ textbook_id: tbId === 'fallback' ? '' : tbId, textbook_title_snapshot: chk.getAttribute('data-title'), progress_text: progInput ? progInput.value.trim() : '' });
    });
    const selectedUnits = Array.from(document.querySelectorAll('.record-unit-check:checked')).map(cb => cb.value);
    let specialNote = document.getElementById('record-special-note')?.value.trim() || '';
    if (selectedUnits.length > 0) specialNote = '[단원선택] ' + selectedUnits.join(', ') + (specialNote ? '\n' + specialNote : '');
    const payload = { class_id: cid, date: dateStr, teacher_name: (typeof getTeacherNameForUI === 'function' ? getTeacherNameForUI() : (state.ui.userName || '담당')), special_note: specialNote, progress: progresses };

    const r = await api.post('class-daily-records', payload);
    if (r?.success) { toast('저장 완료', 'success'); closeModal(true); await loadData(); renderClass(cid); }
}

let ledgerState = { date: new Date().toLocaleDateString('sv-SE'), classId: '', attendance: [], homework: [], mode: 'att' };
async function loadLedger() {
    try {
        const r = await fetch(`${CONFIG.API_BASE}/attendance-history?date=${ledgerState.date}`, { headers: getAuthHeader() });
        const data = await r.json();
        ledgerState.attendance = data.attendance || []; ledgerState.homework = data.homework || []; renderLedgerTable();
    } catch (e) { toast('데이터 로드 실패', 'warn'); }
}

function renderAttendanceLedger() {
    ledgerState.mode = 'att';
    const classOptions = state.db.classes.filter(c => c.is_active !== 0).map(c => `<option value="${c.id}" ${String(c.id) === String(ledgerState.classId) ? 'selected' : ''}>${c.name}</option>`).join('');
    showModal('출석부', `<div style="display: flex; gap: 12px; flex-direction: column; margin-bottom: 16px; background: var(--surface-2); padding: 12px; border: 1px solid var(--border); border-radius: 16px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="ledger-date" class="cls-input" value="${ledgerState.date}" style="flex: 1.2; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.date=this.value;loadLedger();">
                <select id="ledger-class" class="cls-input" style="flex: 1; background: var(--surface); border: 1px solid var(--border);" onchange="ledgerState.classId=this.value;renderLedgerTable();"><option value="">전체 학급</option>${classOptions}</select>
            </div>
            <div style="display: flex; gap: 6px; background: var(--surface); padding: 4px; border: 1px solid var(--border); border-radius: 12px;">
                <button id="ledger-mode-att" class="btn cls-v4-ledger-mode-active" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='att';renderLedgerTable();">출결 기록</button>
                <button id="ledger-mode-hw" class="btn" style="flex: 1; border: none; font-size: 13px; font-weight:700; border-radius: 10px; min-height: 38px;" onclick="ledgerState.mode='hw';renderLedgerTable();">숙제 기록</button>
            </div>
        </div><div id="ledger-table-wrap" style="max-height: 55vh; overflow-y: auto; padding-right: 4px;"></div>`);
    loadLedger();
}

function renderLedgerTable() {
    const isAtt = ledgerState.mode === 'att';
    const cid = ledgerState.classId;
    const mIds = cid ? state.db.class_students.filter(m => String(m.class_id) === String(cid)).map(m => String(m.student_id)) : state.db.students.map(s => String(s.id));
    const stds = state.db.students.filter(s => mIds.includes(String(s.id)) && s.status === '재원');
    const records = isAtt ? ledgerState.attendance : ledgerState.homework;
    const recordMap = {}; records.forEach(r => { if (!r.date || r.date === ledgerState.date) recordMap[r.student_id] = r.status; });

    const rows = stds.map(s => {
        const sCid = cid || state.db.class_students.find(m => String(m.student_id) === String(s.id))?.class_id;
        const isScheduled = sCid ? isClassScheduledOnDate(sCid, ledgerState.date) : true;
        const recStatus = recordMap[s.id];
        const label = isAtt ? getAttendanceStatusLabel(recStatus, isScheduled) : getHomeworkStatusLabel(recStatus, isScheduled);
        const style = isAtt ? getAttendanceStatusStyle(recStatus, isScheduled) : getHomeworkStatusStyle(recStatus, isScheduled);
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--text); font-size: 14px; line-height: 1.4; text-align: left;">${apEscapeHtml(s.name)}</td>
            <td style="padding: 14px 4px; color: var(--secondary); font-size: 12px; font-weight: 600; line-height: 1.5; text-align: center;">${apEscapeHtml(s.school_name)}</td>
            <td style="padding: 14px 12px; text-align: center; vertical-align: middle;">
                <button class="btn" style="padding: 4px 10px; font-size: 12px; min-width: ${isAtt ? '76px' : '60px'}; font-weight:700; border-radius: 8px; margin: 0 auto; display: flex; align-items: center; justify-content: center; ${style}" onclick="${isAtt ? `toggleAtt('${s.id}','${ledgerState.date}')` : `toggleHw('${s.id}','${ledgerState.date}')`}">${label}</button>
            </td>
        </tr>`;
    }).join('');
    
    const headerTitle = isAtt ? '출결' : '숙제';
    
    const ledgerWrap = document.getElementById('ledger-table-wrap');
    if (!ledgerWrap) return;
    ledgerWrap.innerHTML = `<div class="card" style="padding: 8px 0; border-radius: 18px; border: 1px solid var(--border); background: var(--surface); box-shadow: none;">
            <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                <thead><tr style="background: var(--bg); border-bottom: 1px solid var(--border);">
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: left;">이름</th>
                <th style="width: 40%; padding: 10px 4px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: center;">학교</th>
                <th style="width: 30%; padding: 10px 12px; font-size: 12px; color: var(--secondary); font-weight: 700; text-align: center;">${headerTitle}</th>
                </tr></thead>
                <tbody>${rows || '<tr><td colspan="3" style="text-align:center; padding:40px; color:var(--secondary); font-size:13px; font-weight:700;">조회 대상 없음</td></tr>'}</tbody>
            </table></div>`;
    const attBtn = document.getElementById('ledger-mode-att');
    const hwBtn = document.getElementById('ledger-mode-hw');
    if (attBtn && hwBtn) {
        attBtn.classList.toggle('cls-v4-ledger-mode-active', isAtt);
        hwBtn.classList.toggle('cls-v4-ledger-mode-active', !isAtt);
    }
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleAtt(sid, date) {
    const today = normalizeClassroomDate(date) || getClassroomOperationDate();
    const isLedger = !!date && !!document.getElementById('ledger-table-wrap');
    const list = isLedger ? ledgerState.attendance : state.db.attendance;
    const cur = list.find(a => String(a.student_id) === String(sid) && a.date === today);
    const hadRecord = !!cur;
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextAttendanceStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next;
    else list.push({ student_id: sid, date: today, status: next });
    syncClassroomAttendanceStatusToState(sid, today, next);

    if (isLedger) renderLedgerTable();
    else if (state.ui.currentClassId) {
        const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
        if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
    }
    else renderDashboard();

    try {
        const r = await api.patch('attendance', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        if (typeof refreshDataOnly === 'function') {
            refreshDataOnly()
                .then(() => {
                    renderAttendanceLedgerCellIfOpen(sid, today);
                    if (!isLedger && typeof loadClassroomOperationDateData === 'function') {
                        return loadClassroomOperationDateData(today, true).then(() => {
                            if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
                        });
                    }
                })
                .catch(() => {});
        }
    } catch (e) {
        if (hadRecord && cur) {
            cur.status = prevStatus;
            syncClassroomAttendanceStatusToState(sid, today, prevStatus || '미기록');
        } else {
            const idx = list.findIndex(a => String(a.student_id) === String(sid) && a.date === today);
            if (idx > -1) list.splice(idx, 1);
            syncClassroomAttendanceStatusToState(sid, today, '미기록');
        }
        if (isLedger) renderLedgerTable();
        else if (state.ui.currentClassId) {
            const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
            if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
        }
        else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

// ★ 낙관적 업데이트 및 월간 캐시 동기화 적용
async function toggleHw(sid, date) {
    const today = normalizeClassroomDate(date) || getClassroomOperationDate();
    const isLedger = !!date && !!document.getElementById('ledger-table-wrap');
    const list = isLedger ? ledgerState.homework : state.db.homework;
    const cur = list.find(h => String(h.student_id) === String(sid) && h.date === today);
    const hadRecord = !!cur;
    const sCid = state.db.class_students.find(m => String(m.student_id) === String(sid))?.class_id;
    const isScheduled = sCid ? isClassScheduledOnDate(sCid, today) : true;
    const next = getNextHomeworkStatus(cur?.status, isScheduled);
    const prevStatus = cur ? cur.status : undefined;

    if (cur) cur.status = next;
    else list.push({ student_id: sid, date: today, status: next });

    if (isLedger) renderLedgerTable();
    else if (state.ui.currentClassId) {
        const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
        if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
    }
    else renderDashboard();

    try {
        const r = await api.patch('homework', { studentId: sid, status: next, date: today });
        if (!r?.success) throw new Error('fail');
        if (typeof refreshDataOnly === 'function') {
            refreshDataOnly()
                .then(() => {
                    const month = today.slice(0, 7);
                    if (state.ui?.monthlyAttendanceCache) {
                        delete state.ui.monthlyAttendanceCache[month];
                    }
                    if (!isLedger && typeof loadClassroomOperationDateData === 'function') {
                        return loadClassroomOperationDateData(today, true).then(() => {
                            if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
                        });
                    }
                })
                .catch(() => {});
        }
    } catch (e) {
        if (hadRecord && cur) cur.status = prevStatus;
        else {
            const idx = list.findIndex(h => String(h.student_id) === String(sid) && h.date === today);
            if (idx > -1) list.splice(idx, 1);
        }
        if (isLedger) renderLedgerTable();
        else if (state.ui.currentClassId) {
            const updated = updateStudentRowDOM(sid, state.ui.currentClassId);
            if (!updated) rerenderClassPreserveScroll(state.ui.currentClassId);
        }
        else renderDashboard();
        toast('저장 실패', 'warn');
    }
}

function makeExamListKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = String(archiveFile || '');
    if (safeArchive) return `${safeTitle}||${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

function makeExamDetailKey(title, date, archiveFile = '') {
    const safeTitle = String(title || '');
    const safeDate = String(date || '');
    const safeArchive = String(archiveFile || '');
    if (safeArchive) return `${safeTitle}||${safeDate}||${safeArchive}`;
    return `${safeTitle}||${safeDate}`;
}

async function openExamGradeView(classId) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const activeCount = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원').length;
    let sessions = (state.db.exam_sessions || []).filter(es => ids.includes(String(es.student_id)));
    let assignments = [];
    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) {
            sessions = res.sessions.filter(es => ids.includes(String(es.student_id)));
            const classStudentIdSet = new Set(ids);
            assignments = Array.isArray(res.assignments) ? res.assignments.filter(a => classStudentIdSet.size && String(a.class_id) === String(classId)) : [];
        }
    } catch (e) { console.warn('[openExamGradeView] fail', e); }

    const activeCountForAssignment = activeCount || ids.length;
    const grouped = {};
    const findMatchingAssignmentForSession = function(session) {
        return assignments.find(a => {
            if (String(a.exam_title || '') !== String(session.exam_title || '')) return false;
            if (String(a.exam_date || '') !== String(session.exam_date || '')) return false;
            if (!a.archive_file) return false;
            const aq = Number(a.question_count || 0);
            const sq = Number(session.question_count || 0);
            return !aq || !sq || aq === sq;
        });
    };

    assignments.forEach(a => {
        const key = makeExamListKey(a.exam_title, a.exam_date, a.archive_file || '');
        if (!grouped[key]) grouped[key] = { title: a.exam_title, date: a.exam_date, archiveFile: a.archive_file || '', sessions: [], questionCount: a.question_count || 0, assignment: a };
        else {
            grouped[key].assignment = a;
            if (!grouped[key].questionCount && a.question_count) grouped[key].questionCount = a.question_count;
            if (!grouped[key].archiveFile && a.archive_file) grouped[key].archiveFile = a.archive_file;
        }
    });

    sessions.forEach(s => {
        const matchedAssignment = s.archive_file ? null : findMatchingAssignmentForSession(s);
        const resolvedArchiveFile = s.archive_file || matchedAssignment?.archive_file || '';
        const key = makeExamListKey(s.exam_title, s.exam_date, resolvedArchiveFile);
        if (!grouped[key]) grouped[key] = { title: s.exam_title, date: s.exam_date, archiveFile: resolvedArchiveFile, sessions: [], questionCount: s.question_count || matchedAssignment?.question_count || 0, assignment: matchedAssignment || null };
        grouped[key].sessions.push(s);
        if (!grouped[key].questionCount && s.question_count) grouped[key].questionCount = s.question_count;
        if (!grouped[key].archiveFile && resolvedArchiveFile) grouped[key].archiveFile = resolvedArchiveFile;
        if (!grouped[key].assignment && matchedAssignment) grouped[key].assignment = matchedAssignment;
    });

    const exams = Object.values(grouped).sort((a,b) => String(b.date).localeCompare(String(a.date)) || String(b.title).localeCompare(String(a.title)));
    const rows = exams.map(exam => {
        const cnt = exam.sessions.length;
        const qCount = exam.questionCount || exam.sessions[0]?.question_count || exam.assignment?.question_count || 0;
        const avg = cnt ? Math.round(exam.sessions.reduce((sum, s) => sum + Number(s.score || 0), 0) / cnt) : '-';
        const pct = activeCountForAssignment ? Math.round((cnt / activeCountForAssignment) * 100) : 0;
        const archiveArg = String(exam.archiveFile || '').replace(/'/g, "\\'");
        return `<div onclick="openExamDetail('${classId}', '${String(exam.title || '').replace(/'/g, "\\'")}', '${exam.date}', '${archiveArg}')" style="padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 10px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: 0.2s;">
            <div>
                <div style="font-weight:700; color: var(--text); font-size: 15px; line-height: 1.4;">${exam.title}</div>
                <div style="font-size: 11px; color: var(--secondary); margin-top: 4px; font-weight: 600; line-height: 1.5;">${exam.date} · ${qCount}문항 · 제출 ${cnt}/${activeCountForAssignment}명 (${pct}%)</div>
            </div>
            <div style="text-align: right; display: flex; align-items: center; gap: 10px;">
                <div>
                    <div style="font-size: 20px; font-weight:700; color: var(--primary); line-height: 1;">${avg}</div>
                    <div style="font-size: 10px; color: var(--secondary); font-weight:700; margin-top:4px;">평균</div>
                </div>
               <button class="btn" onclick="event.stopPropagation(); openExamDetail('${classId}', '${String(exam.title || '').replace(/'/g, "\\'")}', '${exam.date}', '${archiveArg}');" style="padding: 7px 10px; font-size: 11px; font-weight:700; border-radius: 8px; background: var(--surface-2); border: 1px solid var(--border);">학생별 입력</button>
            </div>
        </div>`;
    }).join('');

    showModal('시험성적', `
        <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px; font-weight:700; border-radius: 10px;" onclick="closeModal(true); if(typeof openOMR==='function') openOMR('', '단원평가', 20, '${classId}', '', '', 'examList');">새 시험 입력</button>
        </div>
        ${rows || `<div style="text-align:center; padding:40px 20px; color:var(--secondary); font-size:13px; font-weight:700;">시험 기록 없음</div>`}
    `);
}

async function openExamDetail(classId, examTitle, examDate, archiveFile = '') {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'classDetail', classId });
    let sessionSource = state.db.exam_sessions || [];
    let wrongSource = state.db.wrong_answers || [];
    let assignmentSource = [];

    try {
        const res = await api.get(`exam-sessions/by-class?class=${encodeURIComponent(classId)}`);
        if (res && Array.isArray(res.blueprints) && typeof setExamBlueprintsForFiles === 'function') setExamBlueprintsForFiles(res.blueprints);
        if (res && Array.isArray(res.sessions)) sessionSource = res.sessions;
        if (res && Array.isArray(res.wrong_answers)) wrongSource = res.wrong_answers;
        if (res && Array.isArray(res.assignments)) assignmentSource = res.assignments;
    } catch (e) { console.warn('[openExamDetail] fail', e); }

    const ids = state.db.class_students.filter(m => String(m.class_id) === String(classId)).map(m => String(m.student_id));
    const active = state.db.students.filter(s => ids.includes(String(s.id)) && s.status === '재원');
    const archiveFilter = String(archiveFile || '').trim();
    const isQuestionCountCompatible = function(a, row) {
        const aq = Number(a?.question_count || 0);
        const rq = Number(row?.question_count || 0);
        return !aq || !rq || aq === rq;
    };
    const matchesExamIdentity = function(row) {
        if (String(row.exam_title || '') !== String(examTitle || '')) return false;
        if (String(row.exam_date || '') !== String(examDate || '')) return false;
        if (!archiveFilter) return true;
        const rowArchive = String(row.archive_file || '').trim();
        if (rowArchive) return rowArchive === archiveFilter;
        return assignmentSource.some(a =>
            String(a.exam_title || '') === String(examTitle || '') &&
            String(a.exam_date || '') === String(examDate || '') &&
            String(a.archive_file || '').trim() === archiveFilter &&
            isQuestionCountCompatible(a, row)
        );
    };
    const sessions = sessionSource.filter(es => matchesExamIdentity(es) && ids.includes(String(es.student_id)));
    const matchedAssignment = assignmentSource.find(a => matchesExamIdentity(a));

    const sessionsWithArchive = sessions.filter(s => s.archive_file);
    if (sessionsWithArchive.length > 0 && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions(sessionsWithArchive); } catch (e) { console.warn(e); }
    } else if (matchedAssignment?.archive_file && typeof ensureBlueprintsForSessions === 'function') {
        try { await ensureBlueprintsForSessions([{ archive_file: matchedAssignment.archive_file, question_count: matchedAssignment.question_count, exam_title: matchedAssignment.exam_title, exam_date: matchedAssignment.exam_date }]); } catch (e) { console.warn(e); }
    }

    const submittedIds = new Set(sessions.map(s => String(s.student_id)));
    const qCount = sessions[0]?.question_count || matchedAssignment?.question_count || 0;

    const prevSessions = state.db.exam_sessions;
    const prevWrongs = state.db.wrong_answers;
    state.db.exam_sessions = sessions;
    state.db.wrong_answers = wrongSource;
    let classWeakUnits = [];
    if (typeof computeClassWeakUnits === 'function') classWeakUnits = computeClassWeakUnits(classId, examTitle, examDate);
    state.db.exam_sessions = prevSessions;
    state.db.wrong_answers = prevWrongs;

    const submitted = active.filter(s => submittedIds.has(String(s.id))).map(s => {
        const sess = sessions.find(es => String(es.student_id) === String(s.id));
        const wrongs = wrongSource.filter(w => String(w.session_id) === String(sess?.id)).map(w => w.question_id).sort((a, b) => Number(a) - Number(b));
        return { ...s, score: sess?.score ?? '-', sessionId: sess?.id, session: sess, wrongs };
    });
    const pending = active.filter(s => !submittedIds.has(String(s.id)));

    const examArchiveFileObj = sessions.find(s => s.archive_file);
    const examArchiveFile = String(examArchiveFileObj?.archive_file || matchedAssignment?.archive_file || '').replace(/'/g, "\\'");

    const submittedHTML = submitted.map(s => {
        const sArchive = s.session?.archive_file ? String(s.session.archive_file).replace(/'/g, "\\'") : examArchiveFile;
        return `<tr style="border-bottom: 1px solid var(--border);">
            <td style="padding: 14px 12px; font-weight:700; color: var(--primary); font-size: 14px; line-height: 1.4;">${s.name}</td>
            <td style="text-align: center; font-weight:700; color: var(--text); padding: 14px 4px; font-size: 14px;">${s.score}점</td>
            <td style="padding: 14px 4px;">
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    ${s.wrongs.length ? s.wrongs.map(qid => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(s.session, qid) : `<span style="background: rgba(255,71,87,0.08); color: var(--error); padding: 2px 7px; border-radius: 6px; font-size: 11px; font-weight: 700; border: 1px solid rgba(255,71,87,0.15);">Q${qid}</span>`).join('') : '<span style="color: var(--secondary); font-size: 11px; font-weight: 600;">없음</span>'}
                </div>
            </td>
            <td style="text-align: right; padding: 14px 12px;">
                <div style="display: flex; gap: 6px; justify-content: flex-end;">
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','${s.sessionId || ''}','${sArchive}','examDetail','${examDate}')">수정</button>
                    <button class="btn" style="padding: 4px 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); border-radius: 8px; font-weight: 700; min-height: 32px;" onclick="deleteExamSession('${s.sessionId || ''}','${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}','${sArchive}')">삭제</button>
                </div>
            </td>
        </tr>`;
    }).join('');

    const pendingHTML = pending.map(s => `<tr style="background-color: var(--bg); border-bottom: 1px solid var(--border);">
        <td style="padding: 14px 12px; color: var(--secondary); font-weight: 600; font-size: 14px;">${s.name}</td>
        <td colspan="2" style="text-align: center; font-size: 12px; color: var(--secondary); font-weight: 700; line-height: 1.5;">미제출</td>
        <td style="text-align: right; padding: 14px 12px;">
            <button class="btn btn-primary" style="padding: 6px 12px; font-size: 11px; font-weight:700; border-radius: 8px; min-height: 32px;" onclick="closeModal(true);openOMR('${s.id}','${examTitle.replace(/'/g, "\\'")}',${qCount},'${classId}','','${examArchiveFile}','examDetail','${examDate}')">입력</button>
        </td>
    </tr>`).join('');

    const weakUnitHtml = typeof renderWeakUnitSummary === 'function' ? renderWeakUnitSummary(classWeakUnits, '오답 데이터 없음', { clickable: true, mode: 'class', titlePrefix: '반 취약 단원', context: { targetType: 'class', targetId: classId, targetLabel: (state.db.classes || []).find(c => String(c.id) === String(classId))?.name || '반', examTitle, examDate } }) : '';

    showModal(`${examTitle}`, `
        <div style="padding: 14px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 16px; text-align: center;">
            <div style="font-size: 14px; font-weight:700; color: var(--text); line-height: 1.4;">제출 완료: <b style="color: var(--success);">${submitted.length}명</b> / 전체 ${submitted.length + pending.length}명</div>
            <div style="font-size: 11px; font-weight: 600; color: var(--secondary); margin-top: 4px; line-height: 1.5;">${examDate} · ${qCount}문항 기준</div>
        </div>
        <div style="margin-bottom: 24px; border: 1px solid rgba(26,92,255,0.15); border-radius: 18px; padding: 16px; background: rgba(26,92,255,0.02);">
            <div style="font-size: 14px; font-weight:700; margin-bottom: 12px; color: var(--primary); line-height: 1.3;">반 취약 단원 TOP</div>
            ${weakUnitHtml}
        </div>
        <div style="margin-bottom: 12px; text-align: right;">
            <button class="btn" style="padding: 6px 12px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.15); background: rgba(255,71,87,0.05); font-weight:700; border-radius: 10px;" onclick="deleteExamByClass('${classId}','${examTitle.replace(/'/g, "\\'")}','${examDate}','${examArchiveFile}')">시험 기록 전체 삭제</button>
        </div>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse; table-layout: fixed;">
            <thead>
                <tr style="border-bottom: 2px solid var(--border); background: var(--bg);">
                    <th style="width: 25%; text-align: left; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 12px;">이름</th>
                    <th style="width: 20%; text-align: center; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 12px;">점수</th>
                    <th style="width: 35%; text-align: left; padding: 10px 4px; color: var(--secondary); font-weight: 700; font-size: 12px;">오답</th>
                    <th style="width: 20%; text-align: right; padding: 10px 12px; color: var(--secondary); font-weight: 700; font-size: 12px;">관리</th>
                </tr>
            </thead>
            <tbody>${submittedHTML}${pendingHTML}</tbody>
        </table>
    `);
}

async function deleteExamSession(sessionId, classId, examTitle, examDate, archiveFile = '') {
    if (!sessionId) return;
    if (!confirm('이 성적 기록을 삭제하시겠습니까? 오답 정보도 함께 삭제됩니다.')) return;
    const r = await api.delete('exam-sessions', sessionId);
    if (!r?.success) { toast('삭제 실패', 'warn'); return; }
    toast('기록이 삭제되었습니다.', 'info');
    closeModal(true); await refreshDataOnly(); openExamDetail(classId, examTitle, examDate, archiveFile);
}

async function deleteExamByClass(classId, examTitle, examDate, archiveFile = '') {
    if (!confirm('이 시험의 제출 기록 전체를 삭제할까요?\n오답 기록도 모두 삭제됩니다.')) return;
    try {
        const archiveQuery = archiveFile ? `&archive=${encodeURIComponent(archiveFile)}` : '';
        const url = `${CONFIG.API_BASE}/exam-sessions/by-exam?class=${encodeURIComponent(classId)}&exam=${encodeURIComponent(examTitle)}&date=${encodeURIComponent(examDate)}${archiveQuery}`;
        const r = await fetch(url, { method: 'DELETE', headers: { 'Content-Type': 'application/json', ...getAuthHeader() } });
        const data = await r.json();
        if (!r.ok || !data.success) { toast('시험 전체삭제 실패', 'warn'); return; }
        toast('시험 전체 기록이 삭제되었습니다.', 'info');
        closeModal(true); await refreshDataOnly(); openExamGradeView(classId);
    } catch (e) { console.warn(e); toast('시험 전체삭제 실패', 'warn'); }
}

// ── 선생님용 반 플래너 확인 ─────────────────────────────────────────────
function isPlannerTargetClass(cls) {
    return !!cls;
}

function getPlannerBaseUrl() {
    const origin = window.location.origin;
    let path = window.location.pathname || '/';
    path = path.replace(/\/index\.html$/, '/');
    if (!path.endsWith('/')) path = path.substring(0, path.lastIndexOf('/') + 1);
    return origin + path + 'planner/';
}

async function copyPlannerStudentLink(studentId) {
    const url = `${getPlannerBaseUrl()}?student_id=${encodeURIComponent(studentId)}`;
    try {
        await navigator.clipboard.writeText(url);
        toast('플래너 링크가 복사되었습니다.', 'info');
    } catch (e) {
        showModal('플래너 링크', `
            <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-bottom:8px;">아래 링크를 복사하세요. PIN은 포함되지 않습니다.</div>
            <div style="word-break:break-all; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:12px; font-size:13px; font-weight:700; color:var(--text);">${apEscapeHtml(url)}</div>
        `);
    }
}

async function loadPlannerOverview(classId, date) {
    if (api.getPlannerOverview) return api.getPlannerOverview(classId, date);
    return api.get(`planner/overview?class_id=${encodeURIComponent(classId)}&date=${encodeURIComponent(date)}`);
}

function getClassPlannerToday() {
    try {
        return new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Seoul' });
    } catch (e) {
        return new Date().toLocaleDateString('sv-SE');
    }
}

function parseClassPlannerDate(dateStr) {
    const safe = String(dateStr || '').trim();
    if (!/^\d{4}-\d{2}-\d{2}$/.test(safe)) return null;
    const date = new Date(`${safe}T00:00:00`);
    if (!Number.isFinite(date.getTime())) return null;
    return date;
}

function addClassPlannerDays(dateStr, days) {
    const base = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    if (!base) return getClassPlannerToday();
    base.setDate(base.getDate() + Number(days || 0));
    return base.toLocaleDateString('sv-SE');
}

function getClassPlannerWeekStart(dateStr) {
    const base = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    if (!base) return getClassPlannerToday();
    const day = base.getDay();
    const offset = day === 0 ? -6 : 1 - day;
    return addClassPlannerDays(base.toLocaleDateString('sv-SE'), offset);
}

function getClassPlannerWeekDates(weekStart) {
    return Array.from({ length: 7 }, (_, idx) => addClassPlannerDays(weekStart, idx));
}

function getClassPlannerDayName(dateStr, longLabel = false) {
    const date = parseClassPlannerDate(dateStr) || parseClassPlannerDate(getClassPlannerToday());
    const shortNames = ['일', '월', '화', '수', '목', '금', '토'];
    const longNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const index = date ? date.getDay() : 0;
    return longLabel ? longNames[index] : shortNames[index];
}

function formatClassPlannerDayLabel(dateStr) {
    return `${getClassPlannerDayName(dateStr)} ${String(dateStr || '').slice(5)}`;
}

function getClassPlannerPlanDate(plan) {
    return String(plan?.plan_date || plan?.date || plan?.feedback_date || '').slice(0, 10);
}

function getClassPlannerPlanTitle(plan) {
    return String(plan?.title || plan?.content || plan?.plan_title || '').trim();
}

function getClassPlannerPlanSubject(plan) {
    return String(plan?.subject || '').trim();
}

function isClassPlannerDone(plan) {
    return Number(plan?.is_done || plan?.done || 0) === 1;
}

function ensureClassPlannerState() {
    if (!state.ui) state.ui = {};
    const today = getClassPlannerToday();
    if (!state.ui.classPlannerMode) state.ui.classPlannerMode = 'day';
    if (!state.ui.classPlannerSelectedDate) state.ui.classPlannerSelectedDate = today;
    if (!state.ui.classPlannerWeekStart) state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);
    if (!state.ui.classPlannerWeekCache || typeof state.ui.classPlannerWeekCache !== 'object') state.ui.classPlannerWeekCache = {};
    const dates = getClassPlannerWeekDates(state.ui.classPlannerWeekStart);
    if (!dates.includes(state.ui.classPlannerSelectedDate)) {
        state.ui.classPlannerSelectedDate = dates.includes(today) ? today : dates[0];
    }
    if (window.innerWidth <= 700) state.ui.classPlannerMode = 'day';
}

function buildClassPlannerWeekCacheKey(classId, weekStart) {
    return `${String(classId || '')}::${String(weekStart || '')}`;
}

async function loadClassPlannerStudentRange(studentId, from, to) {
    return api.getPlannerStudentPlans
        ? api.getPlannerStudentPlans(studentId, from, to)
        : api.get(`planner?student_id=${encodeURIComponent(studentId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

async function loadClassPlannerWeek(classId, weekStart, force = false) {
    ensureClassPlannerState();
    const cacheKey = buildClassPlannerWeekCacheKey(classId, weekStart);
    if (!force && state.ui.classPlannerWeekCache[cacheKey]) return state.ui.classPlannerWeekCache[cacheKey];

    const students = getClassroomActiveStudents(classId);
    const dates = getClassPlannerWeekDates(weekStart);
    const from = dates[0];
    const to = dates[dates.length - 1];

    const studentWeeks = await Promise.all(students.map(async student => {
        const byDate = {};
        dates.forEach(date => { byDate[date] = []; });
        try {
            const data = await loadClassPlannerStudentRange(student.id, from, to);
            const plans = Array.isArray(data?.plans) ? data.plans : [];
            plans.forEach(plan => {
                const date = getClassPlannerPlanDate(plan);
                if (!byDate[date]) return;
                byDate[date].push(plan);
            });
        } catch (e) {
            console.error('[loadClassPlannerWeek] student load failed:', student.id, e);
        }
        dates.forEach(date => {
            byDate[date].sort((a, b) => {
                const at = String(a.sort_order ?? a.created_at ?? a.id ?? '');
                const bt = String(b.sort_order ?? b.created_at ?? b.id ?? '');
                return at.localeCompare(bt);
            });
        });
        return { student, plansByDate: byDate };
    }));

    const weekData = { classId, weekStart, dates, students: studentWeeks };
    state.ui.classPlannerWeekCache[cacheKey] = weekData;
    return weekData;
}

function renderClassPlannerStudentPlanList(plans) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) return `<div class="cls-planner-empty">등록된 계획 없음</div>`;
    return `
        <div class="cls-planner-plan-list">
            ${list.map(plan => {
                const done = isClassPlannerDone(plan);
                const subject = getClassPlannerPlanSubject(plan);
                const title = getClassPlannerPlanTitle(plan);
                return `
                    <div class="cls-planner-plan-item ${done ? 'done' : ''}">
                        <div class="cls-planner-plan-mark">${done ? '✓' : '-'}</div>
                        <div class="cls-planner-plan-main">
                            <div class="cls-planner-plan-title">${apEscapeHtml(title || '제목 없음')}</div>
                            ${subject ? `<div class="cls-planner-plan-meta"><span class="cls-planner-subject">${apEscapeHtml(subject)}</span></div>` : ''}
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderClassPlannerDayList(classId, date, weekData) {
    const students = Array.isArray(weekData?.students) ? weekData.students : [];
    if (!students.length) return `<div class="cls-planner-empty">조회 대상 학생이 없습니다.</div>`;
    return `
        <div class="cls-planner-list">
            <div class="cls-planner-date-title">${apEscapeHtml(getClassPlannerDayName(date, true))} ${apEscapeHtml(date)}</div>
            ${students.map(row => `
                <div class="cls-planner-student-card">
                    <div class="cls-planner-student-name">${apEscapeHtml(row.student?.name || '학생')}</div>
                    ${renderClassPlannerStudentPlanList(row.plansByDate?.[date] || [])}
                </div>
            `).join('')}
        </div>
    `;
}

function renderClassPlannerWeekCell(plans) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) return `<div class="cls-planner-cell-empty">없음</div>`;
    return `
        <div class="cls-planner-cell-list">
            ${list.map(plan => {
                const done = isClassPlannerDone(plan);
                const subject = getClassPlannerPlanSubject(plan);
                const title = getClassPlannerPlanTitle(plan) || '제목 없음';
                const text = subject ? `${subject} · ${title}` : title;
                return `<div class="cls-planner-cell-item ${done ? 'done' : ''}">${done ? '✓ ' : ''}${apEscapeHtml(text)}</div>`;
            }).join('')}
        </div>
    `;
}

function renderClassPlannerWeekTable(classId, weekStart, weekData) {
    const dates = Array.isArray(weekData?.dates) ? weekData.dates : getClassPlannerWeekDates(weekStart);
    const students = Array.isArray(weekData?.students) ? weekData.students : [];
    if (!students.length) return `<div class="cls-planner-empty">조회 대상 학생이 없습니다.</div>`;
    return `
        <div class="cls-planner-week-wrap">
            <table class="cls-planner-week-table">
                <thead>
                    <tr>
                        <th>학생</th>
                        ${dates.map(date => `<th>${apEscapeHtml(formatClassPlannerDayLabel(date))}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${students.map(row => `
                        <tr>
                            <td class="cls-planner-week-student">${apEscapeHtml(row.student?.name || '학생')}</td>
                            ${dates.map(date => `<td>${renderClassPlannerWeekCell(row.plansByDate?.[date] || [])}</td>`).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderClassPlannerModeTabs(classId) {
    if (window.innerWidth <= 700) return '';
    const mode = state.ui.classPlannerMode || 'day';
    return `
        <div class="cls-planner-mode-tabs">
            <button class="cls-planner-btn ${mode === 'day' ? 'active' : ''}" onclick="setClassPlannerMode('${classId}', 'day')">요일별</button>
            <button class="cls-planner-btn ${mode === 'week' ? 'active' : ''}" onclick="setClassPlannerMode('${classId}', 'week')">주간별</button>
        </div>
    `;
}

function renderClassPlannerDayTabs(classId, weekStart, selectedDate) {
    const dates = getClassPlannerWeekDates(weekStart);
    return `
        <div class="cls-planner-day-tabs">
            ${dates.map(date => `<button class="cls-planner-btn ${String(selectedDate) === String(date) ? 'active' : ''}" onclick="setClassPlannerSelectedDate('${classId}', '${date}')">${apEscapeHtml(formatClassPlannerDayLabel(date))}</button>`).join('')}
        </div>
    `;
}

function renderClassPlannerContent(classId, weekData) {
    const mode = window.innerWidth <= 700 ? 'day' : (state.ui.classPlannerMode || 'day');
    const date = state.ui.classPlannerSelectedDate;
    return mode === 'week'
        ? renderClassPlannerWeekTable(classId, state.ui.classPlannerWeekStart, weekData)
        : renderClassPlannerDayList(classId, date, weekData);
}

function renderPlannerRateBar(rate) {
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(rate || 0))));
    return `
        <div style="display:flex; align-items:center; gap:8px; min-width:96px;">
            <div style="flex:1; height:7px; background:var(--surface-2); border:1px solid var(--border); border-radius:999px; overflow:hidden;">
                <div style="height:100%; width:${safeRate}%; background:var(--primary); border-radius:999px;"></div>
            </div>
            <span style="width:34px; text-align:right; font-size:12px; font-weight:700; color:var(--text);">${safeRate}%</span>
        </div>
    `;
}

function getPlannerMonthBounds(month) {
    const safeMonth = /^\d{4}-\d{2}$/.test(String(month || '')) ? String(month) : new Date().toLocaleDateString('sv-SE').slice(0, 7);
    const [year, monthNo] = safeMonth.split('-').map(Number);
    const first = new Date(year, monthNo - 1, 1);
    const last = new Date(year, monthNo, 0);
    const fmt = d => d.toLocaleDateString('sv-SE');
    return { month: safeMonth, from: fmt(first), to: fmt(last) };
}

function renderPlannerPlanList(plans, feedback) {
    const list = Array.isArray(plans) ? plans : [];
    if (!list.length) {
        return `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; border:1px dashed var(--border); border-radius:14px; background:var(--surface-2);">해당 기간에 등록된 계획이 없습니다.</div>`;
    }

    const feedbackMap = new Map((Array.isArray(feedback) ? feedback : []).map(f => [String(f.feedback_date), f]));
    const groups = {};
    list.forEach(plan => {
        const date = String(plan.plan_date || '');
        if (!groups[date]) groups[date] = [];
        groups[date].push(plan);
    });

    return Object.keys(groups).sort().map(date => {
        const items = groups[date];
        const done = items.filter(p => Number(p.is_done || 0) === 1).length;
        const rate = items.length ? Math.round((done / items.length) * 100) : 0;
        const fb = feedbackMap.get(date);
        const feedbackHtml = fb && String(fb.teacher_comment || fb.badge || '').trim()
            ? `<div style="margin-top:10px; padding:10px 12px; border-radius:12px; background:rgba(26,92,255,0.06); color:var(--text); font-size:12px; font-weight:700; line-height:1.5;">${apEscapeHtml(`${fb.badge || ''} ${fb.teacher_comment || ''}`.trim())}</div>`
            : '';

        return `
            <div style="border:1px solid var(--border); border-radius:16px; background:var(--surface); overflow:hidden;">
                <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 14px; background:var(--surface-2); border-bottom:1px solid var(--border);">
                    <div style="font-size:13px; font-weight:800; color:var(--text);">${apEscapeHtml(date)}</div>
                    <div style="display:flex; align-items:center; gap:8px; min-width:150px;">
                        ${renderPlannerRateBar(rate)}
                    </div>
                </div>
                <div style="padding:10px 14px;">
                    ${items.map(plan => {
                        const isDone = Number(plan.is_done || 0) === 1;
                        const subject = String(plan.subject || '수학').trim();
                        const repeat = String(plan.repeat_rule || '').trim();
                        return `
                            <div style="display:flex; align-items:flex-start; gap:10px; padding:9px 0; border-bottom:1px solid var(--border);">
                                <span style="flex:0 0 auto; width:22px; height:22px; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; background:${isDone ? 'var(--primary)' : 'var(--surface-2)'}; color:${isDone ? '#fff' : 'var(--secondary)'}; border:1px solid ${isDone ? 'var(--primary)' : 'var(--border)'};">${isDone ? '✓' : ''}</span>
                                <div style="min-width:0; flex:1;">
                                    <div style="font-size:13px; font-weight:700; color:var(--text); line-height:1.45; ${isDone ? 'opacity:.55; text-decoration:line-through;' : ''}">${apEscapeHtml(plan.title || '')}</div>
                                    <div style="font-size:11px; font-weight:700; color:var(--secondary); margin-top:3px;">${apEscapeHtml(subject)}${repeat ? ` · ${repeat === 'daily' ? '매일 반복' : repeat === 'weekly' ? '매주 반복' : repeat}` : ''}</div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                    ${feedbackHtml}
                </div>
            </div>
        `;
    }).join('<div style="height:10px;"></div>');
}

async function openPlannerStudentPlans(studentId, monthOrDate) {
    const student = (state.db.students || []).find(s => String(s.id) === String(studentId));
    const bounds = getPlannerMonthBounds(String(monthOrDate || '').slice(0, 7));
    const classId = state?.ui?.plannerControlClassId || state?.ui?.currentClassId || '';

    showModal('플래너 상세', `
        <div style="display:flex; flex-direction:column; gap:14px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; padding:14px; background:var(--surface-2); border-radius:16px;">
                <div style="min-width:0;">
                    <div style="font-size:16px; font-weight:800; color:var(--text); line-height:1.3;">${apEscapeHtml(student?.name || '학생')}</div>
                    <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${apEscapeHtml(bounds.month)} 전체 계획</div>
                </div>
                <button class="btn" style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:700; border-radius:10px; background:var(--surface); border:1px solid var(--border);" onclick="${classId ? `renderPlannerControl('${classId}')` : 'closeModal(true)'}">목록</button>
            </div>
            <div style="display:flex; gap:8px; align-items:center;">
                <input type="month" id="planner-student-month" class="btn" value="${bounds.month}" style="flex:1; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <button class="btn btn-primary" style="min-height:44px; padding:10px 14px; font-size:12px; font-weight:700;" onclick="openPlannerStudentPlans('${studentId}', document.getElementById('planner-student-month')?.value)">조회</button>
            </div>
            <div id="planner-student-plans-body">
                <div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">불러오는 중...</div>
            </div>
        </div>
    `);

    try {
        const data = api.getPlannerStudentPlans
            ? await api.getPlannerStudentPlans(studentId, bounds.from, bounds.to)
            : await api.get(`planner?student_id=${encodeURIComponent(studentId)}&from=${encodeURIComponent(bounds.from)}&to=${encodeURIComponent(bounds.to)}`);
        const body = document.getElementById('planner-student-plans-body');
        if (!body) return;
        if (!data?.success) {
            body.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:700;">계획을 불러오지 못했습니다.</div>`;
            toast(data?.message || data?.error || '플래너 상세 조회 실패', 'warn');
            return;
        }
        body.innerHTML = renderPlannerPlanList(data.plans || [], data.feedback || []);
    } catch (e) {
        console.error('[openPlannerStudentPlans] failed:', e);
        const body = document.getElementById('planner-student-plans-body');
        if (body) body.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:700;">계획 조회 중 오류가 발생했습니다.</div>`;
        toast('계획 조회 중 오류가 발생했습니다.', 'error');
    }
}

function renderPlannerOverviewTable(classId, date, rows) {
    const root = document.getElementById('planner-control-body');
    if (!root) return;

    const list = Array.isArray(rows) ? rows : [];
    if (!list.length) {
        root.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">조회 대상 학생이 없습니다.</div>`;
        return;
    }

    const desktopRows = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '미작성';
        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td style="padding:12px 10px; font-size:14px; font-weight:700; color:var(--text);">${apEscapeHtml(row.name)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:700; color:var(--text);">${Number(row.total || 0)}</td>
                <td style="padding:12px 6px; text-align:center; font-size:13px; font-weight:700; color:var(--primary);">${Number(row.done || 0)}</td>
                <td style="padding:12px 10px;">${renderPlannerRateBar(row.rate)}</td>
                <td style="padding:12px 10px; font-size:12px; font-weight:700; color:${fb ? 'var(--text)' : 'var(--secondary)'}; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${apEscapeHtml(fbText)}</td>
                <td style="padding:12px 10px; text-align:right;">
                    <div style="display:flex; gap:6px; justify-content:flex-end;">
                        <button class="btn" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:700; border-radius:10px; background:var(--surface-2); border:none; color:var(--text);" onclick="openPlannerStudentPlans('${row.student_id}', '${date}')">상세</button>
                        <button class="btn" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:700; border-radius:10px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                        <button class="btn" style="min-height:36px; padding:8px 10px; font-size:11px; font-weight:700; border-radius:10px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const mobileCards = list.map(row => {
        const fb = row.feedback || null;
        const fbText = fb ? `${fb.badge || ''} ${fb.teacher_comment || '피드백 저장됨'}`.trim() : '피드백 미작성';
        return `
            <div style="border:1px solid var(--border); border-radius:16px; padding:14px; background:var(--surface); margin-bottom:10px;">
                <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:10px;">
                    <div style="min-width:0;">
                        <div style="font-size:15px; font-weight:700; color:var(--text); line-height:1.3;">${apEscapeHtml(row.name)}</div>
                        <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">할 일 ${Number(row.total || 0)} · 완료 ${Number(row.done || 0)}</div>
                    </div>
                    <div style="font-size:15px; font-weight:700; color:var(--primary);">${Number(row.rate || 0)}%</div>
                </div>
                ${renderPlannerRateBar(row.rate)}
                <div style="font-size:12px; font-weight:700; color:${fb ? 'var(--text)' : 'var(--secondary)'}; margin-top:10px; line-height:1.5;">${apEscapeHtml(fbText)}</div>
                <div style="display:flex; gap:8px; margin-top:12px;">
                    <button class="btn" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:700; border-radius:12px; background:var(--surface-2); border:none; color:var(--text);" onclick="openPlannerStudentPlans('${row.student_id}', '${date}')">상세</button>
                    <button class="btn" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:700; border-radius:12px; background:var(--surface-2); border:none;" onclick="openPlannerFeedbackModal('${row.student_id}', '${date}', ${Number(row.rate || 0)})">피드백</button>
                    <button class="btn" style="flex:1; min-height:42px; padding:8px; font-size:12px; font-weight:700; border-radius:12px; background:rgba(26,92,255,0.08); border:none; color:var(--primary);" onclick="copyPlannerStudentLink('${row.student_id}')">링크 복사</button>
                </div>
            </div>
        `;
    }).join('');

    root.innerHTML = `
        <style>
            @media (max-width:700px) {
                #planner-desktop-table { display:none !important; }
                #planner-mobile-list { display:block !important; }
            }
            @media (min-width:701px) {
                #planner-desktop-table { display:block !important; }
                #planner-mobile-list { display:none !important; }
            }
        </style>
        <div id="planner-desktop-table" style="overflow-x:auto; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
            <table style="width:100%; border-collapse:collapse; min-width:720px;">
                <thead>
                    <tr style="background:var(--surface-2); border-bottom:1px solid var(--border);">
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">학생</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:700; color:var(--secondary);">할 일</th>
                        <th style="padding:10px 6px; text-align:center; font-size:12px; font-weight:700; color:var(--secondary);">완료</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">이행률</th>
                        <th style="padding:10px; text-align:left; font-size:12px; font-weight:700; color:var(--secondary);">피드백</th>
                        <th style="padding:10px; text-align:right; font-size:12px; font-weight:700; color:var(--secondary);">관리</th>
                    </tr>
                </thead>
                <tbody>${desktopRows}</tbody>
            </table>
        </div>
        <div id="planner-mobile-list">${mobileCards}</div>
    `;
}

async function renderPlannerControl(classId) {
    ensureClassPlannerState();
    if (!state.ui) state.ui = {};
    state.ui.plannerControlClassId = String(classId || '');
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) return toast('반 정보를 찾을 수 없습니다.', 'warn');
    if (!isPlannerTargetClass(cls)) return toast('플래너 확인 대상 반이 아닙니다.', 'warn');

    const today = getClassPlannerToday();
    if (!state.ui.classPlannerSelectedDate) state.ui.classPlannerSelectedDate = today;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(state.ui.classPlannerSelectedDate);
    if (window.innerWidth <= 700) state.ui.classPlannerMode = 'day';

    showModal('플래너 확인', `
        <div class="cls-planner-wrap">
            <div class="cls-planner-hero">
                <div style="min-width:0;">
                    <div class="cls-planner-hero-title">${apEscapeHtml(cls.name)}</div>
                    <div class="cls-planner-hero-sub">반 전체 학생 플래너 확인</div>
                </div>
                <button class="cls-planner-btn" onclick="renderClass('${classId}'); closeModal(true);">반 화면</button>
            </div>
            <div class="cls-planner-nav">
                <button class="cls-planner-btn" onclick="moveClassPlannerWeek('${classId}', -1)">지난 주</button>
                <button class="cls-planner-btn" onclick="resetClassPlannerWeek('${classId}')">이번 주</button>
                <button class="cls-planner-btn" onclick="moveClassPlannerWeek('${classId}', 1)">다음 주</button>
            </div>
            ${renderClassPlannerModeTabs(classId)}
            ${renderClassPlannerDayTabs(classId, state.ui.classPlannerWeekStart, state.ui.classPlannerSelectedDate)}
            <div id="planner-control-body">
                <div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">불러오는 중...</div>
            </div>
        </div>
    `);
    await refreshPlannerControl(classId);
}

async function refreshPlannerControl(classId) {
    ensureClassPlannerState();
    const body = document.getElementById('planner-control-body');
    if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">불러오는 중...</div>`;

    try {
        const weekData = await loadClassPlannerWeek(classId, state.ui.classPlannerWeekStart, true);
        if (body) body.innerHTML = renderClassPlannerContent(classId, weekData);
    } catch (e) {
        console.error('[refreshPlannerControl] failed:', e);
        if (body) body.innerHTML = `<div style="padding:32px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:700;">플래너 조회 중 오류가 발생했습니다.</div>`;
        toast('플래너 조회 중 오류가 발생했습니다.', 'error');
    }
}

window.setClassPlannerMode = async function(classId, mode) {
    ensureClassPlannerState();
    state.ui.classPlannerMode = String(mode) === 'week' ? 'week' : 'day';
    await renderPlannerControl(classId);
};

window.setClassPlannerSelectedDate = async function(classId, dateStr) {
    ensureClassPlannerState();
    const date = normalizeClassroomDate(dateStr) || getClassPlannerToday();
    state.ui.classPlannerSelectedDate = date;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(date);
    await renderPlannerControl(classId);
};

window.moveClassPlannerWeek = async function(classId, direction) {
    ensureClassPlannerState();
    const move = Number(direction || 0) * 7;
    state.ui.classPlannerWeekStart = addClassPlannerDays(state.ui.classPlannerWeekStart, move);
    state.ui.classPlannerSelectedDate = addClassPlannerDays(state.ui.classPlannerSelectedDate, move);
    await renderPlannerControl(classId);
};

window.resetClassPlannerWeek = async function(classId) {
    ensureClassPlannerState();
    const today = getClassPlannerToday();
    state.ui.classPlannerSelectedDate = today;
    state.ui.classPlannerWeekStart = getClassPlannerWeekStart(today);
    await renderPlannerControl(classId);
};

function openPlannerFeedbackModal(studentId, date, currentRate) {
    const s = state.db.students.find(st => String(st.id) === String(studentId));
    const safeRate = Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))));
    showModal('플래너 피드백', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                <div style="font-size:15px; font-weight:700; color:var(--text);">${apEscapeHtml(s?.name || '학생')}</div>
                <div style="font-size:12px; font-weight:700; color:var(--secondary); margin-top:4px;">${apEscapeHtml(date)} · 현재 이행률 ${safeRate}%</div>
            </div>
            <select id="planner-feedback-badge" class="btn" style="width:100%; text-align:left; background:var(--surface); border:1px solid var(--border);">
                <option value="">배지 없음</option>
                <option value="⭐">⭐ 잘함</option>
                <option value="🔥">🔥 집중</option>
                <option value="👍">👍 좋아요</option>
            </select>
            <textarea id="planner-feedback-comment" class="cls-input" rows="5" placeholder="학생에게 보일 피드백을 입력하세요." style="resize:none;"></textarea>
            <button class="btn btn-primary" style="min-height:48px; font-size:14px; font-weight:700;" onclick="savePlannerFeedback('${studentId}', '${date}', ${safeRate})">저장</button>
        </div>
    `);
}

async function savePlannerFeedback(studentId, date, currentRate) {
    const badge = document.getElementById('planner-feedback-badge')?.value || '';
    const teacherComment = document.getElementById('planner-feedback-comment')?.value.trim() || '';
    const payload = {
        student_id: studentId,
        feedback_date: date,
        teacher_comment: teacherComment,
        badge,
        completion_rate: Math.max(0, Math.min(100, Math.round(Number(currentRate || 0))))
    };

    try {
        const r = api.savePlannerFeedback ? await api.savePlannerFeedback(payload) : await api.post('planner/feedback', payload);
        if (!r?.success) {
            toast(r?.message || r?.error || '피드백 저장 실패', 'warn');
            return;
        }
        toast('피드백이 저장되었습니다.', 'success');
        closeModal(true);
        const classId = state?.ui?.plannerControlClassId || state?.ui?.currentClassId || '';
        if (classId) await renderPlannerControl(classId);
    } catch (e) {
        console.error('[savePlannerFeedback] failed:', e);
        toast('피드백 저장 중 오류가 발생했습니다.', 'error');
    }
}
