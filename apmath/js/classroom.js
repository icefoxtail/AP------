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
        .cls-input { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 500; line-height: 1.4; }
        .cls-v4-wrap { width: 100%; max-width: 1080px; margin: 0 auto; box-sizing: border-box; padding: 0 0 28px; background: linear-gradient(180deg, var(--surface) 0%, var(--surface-soft) 100%); min-height: 100vh; }
        .cls-v4-top { position: sticky; top: 0; z-index: 50; display:flex; justify-content:space-between; align-items:center; gap:10px; padding:12px 16px; min-height:54px; border-bottom:1px solid var(--border); background:rgba(255,255,255,0.92); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); }
        .dark .cls-v4-top, [data-theme="dark"] .cls-v4-top { background:rgba(28,28,30,0.92); }
        .cls-v4-title { min-width:0; flex:1; }
        .cls-v4-title-main { font-size:15px; font-weight:500; color:var(--text); letter-spacing:-0.35px; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cls-v4-title-sub { margin-top:3px; font-size:11px; font-weight:400; color:var(--secondary); line-height:1.35; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .cls-v4-summary { display:flex; gap:5px; justify-content:flex-end; flex:0 0 auto; }
        .cls-v4-pill { height:25px; display:inline-flex; align-items:center; justify-content:center; gap:4px; padding:0 8px; border-radius:8px; border:1px solid var(--border); background:var(--surface-2); color:var(--secondary); font-size:11px; font-weight:400; white-space:nowrap; }
        .cls-v4-pill b { color:var(--text); font-weight:500; }
        .cls-v4-pill.warn { color:var(--warning); background:rgba(var(--warning-rgb),0.10); border-color:rgba(var(--warning-rgb),0.20); }
        .cls-v4-tools { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; -webkit-overflow-scrolling:touch; touch-action:pan-x; padding:10px 16px; border-bottom:1px solid var(--border); background:var(--surface-alpha); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); }
        .cls-v4-tools::-webkit-scrollbar { display:none; }
        .cls-v4-tools .btn,
        .cls-v4-tools .apms-button,
        .cls-v4-tools button {
            width:auto !important;
            flex:0 0 auto !important;
            align-self:center;
        }
        .cls-v4-tool { flex:0 0 auto; min-height:36px; padding:0 13px; border-radius:999px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:12px; font-weight:500; box-shadow:0 1px 2px rgba(0,0,0,0.03); }
        .cls-v4-tool.primary, .cls-v4-tool.blue { background:var(--primary-soft); border-color:rgba(var(--primary-rgb),0.18); color:var(--primary); }
        .cls-v4-tool.orange { background:rgba(var(--warning-rgb),0.12); border-color:rgba(var(--warning-rgb),0.22); color:var(--warning); }
        .cls-v4-tool.purple, .cls-v4-tool.highlight { background:rgba(124,58,237,0.07); border-color:rgba(124,58,237,0.16); color:#7c3aed; }
        .cls-v4-tool.red { background:rgba(var(--error-rgb),0.10); border-color:rgba(var(--error-rgb),0.20); color:var(--error); }
        .cls-v4-tool.green { background:rgba(var(--success-rgb),0.10); border-color:rgba(var(--success-rgb),0.18); color:var(--success); }
        .cls-v4-date-input { flex:0 0 auto; width:138px; min-height:36px; height:36px; padding:0 10px; border-radius:999px; border:1px solid var(--border); background:var(--surface-2); color:var(--text); font-size:12px; font-weight:500; font-family:inherit; box-shadow:none; }
        .cls-v4-date-input::-webkit-calendar-picker-indicator { opacity:0.75; cursor:pointer; }
        .cls-v4-date-reset { flex:0 0 auto; min-height:36px; height:36px; padding:0 12px; border-radius:999px; border:1px solid rgba(var(--primary-rgb),0.18); background:var(--primary-soft); color:var(--primary); font-size:12px; font-weight:500; box-shadow:none; }
        .cls-v4-section { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:16px 16px 8px; }
        .cls-v4-section h3 { margin:0; font-size:14px; font-weight:500; color:var(--text); letter-spacing:-0.35px; }
        .cls-v4-section span { font-size:11px; font-weight:400; color:var(--secondary); }
        .cls-v4-board { border-top:1px solid var(--border); border-bottom:1px solid var(--border); background:var(--surface); box-shadow:var(--shadow-sm); }
        .cls-v4-board-head { display:grid; grid-template-columns:minmax(68px,1fr) 42px 42px 42px 42px 42px; align-items:center; gap:6px; min-height:30px; padding:4px 12px; border-bottom:1px solid var(--border); background:var(--surface-2); color:var(--secondary); font-size:10px; font-weight:500; text-align:center; }
        .cls-v4-board-head .name-spacer { text-align:left; }
        .cls-v4-row { display:grid; grid-template-columns:minmax(68px,1fr) 42px 42px 42px 42px 42px; align-items:center; gap:6px; min-height:46px; padding:5px 12px; border-bottom:1px solid var(--border); background:var(--surface); }
        .cls-v4-row:last-child { border-bottom:none; }
        .cls-v4-row:hover { background:rgba(var(--primary-rgb),0.035); }
        .cls-v4-row:active { background:var(--surface-2); }
        .cls-v4-name-col { min-width:0; display:flex; align-items:center; cursor:pointer; overflow:hidden; }
        .cls-v4-student { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:14px; font-weight:500; color:var(--text); line-height:1.2; }
        .cls-v4-meta-mobile { display:none; }
        .cls-v4-badges { display:contents; }
        .cls-v4-status { width:42px; min-width:42px; height:36px; min-height:36px; padding:0; border-radius:12px; font-size:13px; font-weight:500; display:flex; align-items:center; justify-content:center; margin:0; box-shadow:none; }
        .cls-v4-status.hw { width:42px; min-width:42px; }
        .cls-v4-status.tag { background:transparent; color:var(--secondary); border:1px solid var(--border); font-size:14px; }
        .cls-v4-status.tag.on { background:var(--primary-soft); color:var(--primary); border-color:rgba(var(--primary-rgb),0.20); }
        .cls-v4-status.consult.on { background:rgba(124,58,237,0.10); color:#7c3aed; border-color:rgba(124,58,237,0.18); }
        .cls-v4-actions { display:none; }
        .cls-v4-pad-btns { display:none; gap:6px; }
        .cls-v4-pad-btn { height:32px; min-height:32px; padding:0 10px; border-radius:8px; border:1px solid var(--border); background:var(--surface-2); color:var(--text-soft); font-size:11px; font-weight:500; }
        .cls-v4-more { display:none; }
        .cls-v4-empty { padding:34px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:400; }
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
        return 'background: rgba(var(--success-rgb),0.10); color: var(--success); border: 1px solid rgba(0,208,132,0.15);';
    }
    if (cur === '결석') {
        return 'background: rgba(var(--error-rgb),0.10); color: var(--error); font-weight:500; border: 1px solid rgba(var(--error-rgb),0.18);';
    }
    if (cur === '지각') {
        return 'background: rgba(var(--warning-rgb),0.12); color: var(--warning); font-weight:500; border: 1px solid rgba(var(--warning-rgb),0.20);';
    }
    if (cur === '보강') {
        return 'background: var(--primary-soft); color: var(--primary); font-weight:500; border: 1px solid rgba(var(--primary-rgb),0.16);';
    }
    if (cur === '상담') {
        return 'background: rgba(124,58,237,0.10); color: #7c3aed; font-weight:500; border: 1px solid rgba(124,58,237,0.18);';
    }
    if (cur === '수업 없음') {
        return 'background: transparent; color: var(--border); font-weight:500; border: 1px dashed var(--border); box-shadow: none;'; 
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
        return 'background: var(--primary-soft); color: var(--primary); border: 1px solid rgba(var(--primary-rgb),0.16);';
    }
    if (cur === '미완료') {
        return 'background: rgba(var(--warning-rgb),0.12); color: var(--warning); font-weight:500; border: 1px solid rgba(255,165,2,0.15);';
    }
    if (cur === '공란') {
        return 'background: transparent; color: var(--border); font-weight:500; border: 1px dashed var(--border); box-shadow: none;'; 
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
    const rec = typeof apmsGetAttendanceRecordForStudentDate === 'function'
        ? apmsGetAttendanceRecordForStudentDate(sid, d)
        : (state.db.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === d);
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

// ── 보강 체크칩 시스템 ────────────────────────────────────────────────
var MAKEUP_TAG_DEFS = [
    { key: 'makeup:progress', label: '진도' },
    { key: 'makeup:homework', label: '숙제' },
    { key: 'makeup:absence', label: '결석' },
    { key: 'makeup:exam',    label: '시험' },
    { key: 'makeup:other',   label: '기타' },
];

function getActiveMakeupTags(studentId, date) {
    var tags = getAttendanceMetaForStudentDate(String(studentId), String(date)).tags;
    return MAKEUP_TAG_DEFS.filter(function(d) { return tags.includes(d.key); });
}

function hasAnyMakeupTag(studentId, date) {
    return getActiveMakeupTags(studentId, date).length > 0;
}

function renderMakeupExpandButton(studentId, date) {
    var sid = apEscapeHtml(String(studentId));
    var d   = apEscapeHtml(String(date));
    var on  = hasAnyMakeupTag(sid, d);
    return '<button id="makeup-btn-' + sid + '-' + d + '" class="btn cls-v4-status tag makeup-expand' + (on ? ' on' : '') + '" title="보강" aria-pressed="' + on + '" onclick="toggleMakeupPanel(\'' + sid + '\',\'' + d + '\')">' + (on ? '○' : '') + '</button>';
}

function toggleMakeupPanel(studentId, date) {
    var sid = String(studentId);
    var d   = String(date);
    var panelId = 'makeup-panel-' + sid + '-' + d;
    var existing = document.getElementById(panelId);
    if (existing) { existing.remove(); return; }
    var row = document.getElementById('class-row-' + sid);
    if (!row) return;
    var panel = document.createElement('div');
    panel.id = panelId;
    panel.className = 'makeup-chip-panel cls-fade-in';
    panel.innerHTML = renderMakeupChipPanelInner(sid, d);
    row.insertAdjacentElement('afterend', panel);
}

function renderMakeupChipPanelInner(studentId, date) {
    var sid  = apEscapeHtml(String(studentId));
    var d    = apEscapeHtml(String(date));
    var active = getActiveMakeupTags(studentId, date).map(function(t) { return t.key; });
    var chips = MAKEUP_TAG_DEFS.map(function(t) {
        var on  = active.includes(t.key);
        var key = apEscapeHtml(t.key);
        return '<button class="makeup-chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" onclick="clickMakeupChip(\'' + sid + '\',\'' + d + '\',\'' + key + '\')">' + t.label + '</button>';
    }).join('');
    return '<div class="makeup-chip-list">' + chips + '</div>';
}

async function clickMakeupChip(studentId, date, key) {
    var sid     = String(studentId);
    var d       = normalizeClassroomDate(date) || getClassroomOperationDate();
    var safeKey = String(key || '');
    if (!sid || !d || !safeKey) return;
    if (!MAKEUP_TAG_DEFS.some(function(t) { return t.key === safeKey; })) return;

    var lockId = 'makeup-lock-' + sid + '-' + d + '-' + safeKey;
    if (window[lockId]) return;
    window[lockId] = true;

    var meta     = getAttendanceMetaForStudentDate(sid, d);
    var prevTags = stringifyAttendanceTags(meta.tags);
    var prevMemo = meta.memo;
    var nextTags = meta.tags.includes(safeKey)
        ? meta.tags.filter(function(v) { return v !== safeKey; })
        : meta.tags.concat(safeKey);
    var nextTagText = stringifyAttendanceTags(nextTags);

    // panel 존재 여부를 row 재렌더 전에 기억
    var panelWasOpen = !!document.getElementById('makeup-panel-' + sid + '-' + d);

    syncAttendanceMetaToState(sid, d, nextTags, prevMemo);
    renderAttendanceLedgerCellIfOpen(sid, d);
    if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
    refreshMakeupChipUi(sid, d, panelWasOpen);

    try {
        var r = await api.patch('attendance', { studentId: sid, date: d, tags: nextTagText });
        if (!r || !r.success) throw new Error('fail');
    } catch (e) {
        syncAttendanceMetaToState(sid, d, prevTags, prevMemo);
        renderAttendanceLedgerCellIfOpen(sid, d);
        if (state.ui.currentClassId) updateStudentRowDOM(sid, state.ui.currentClassId);
        refreshMakeupChipUi(sid, d, panelWasOpen);
        toast('저장 실패', 'warn');
    } finally {
        window[lockId] = false;
    }
}

function refreshMakeupChipUi(studentId, date, panelWasOpen) {
    var sid = String(studentId);
    var d   = String(date);
    // expand 버튼 상태 갱신
    var btn = document.getElementById('makeup-btn-' + sid + '-' + d);
    if (btn) {
        var on = hasAnyMakeupTag(sid, d);
        btn.classList.toggle('on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.textContent = on ? '○' : '';
    }
    // 칩 패널 복구/갱신
    if (panelWasOpen) {
        var panel = document.getElementById('makeup-panel-' + sid + '-' + d);
        if (!panel) {
            var row = document.getElementById('class-row-' + sid);
            if (row) {
                panel = document.createElement('div');
                panel.id = 'makeup-panel-' + sid + '-' + d;
                panel.className = 'makeup-chip-panel';
                row.insertAdjacentElement('afterend', panel);
            }
        }
        if (panel) panel.innerHTML = renderMakeupChipPanelInner(sid, d);
    }
}

function hasConsultationForStudentDate(studentId, date) {
    if (typeof apmsHasConsultationForStudentDate === 'function') {
        return apmsHasConsultationForStudentDate(studentId, date);
    }
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
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();

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
    if (state.ui?.currentClassId) updateClassroomMonthlyStatusBoardDOM(state.ui.currentClassId);
    return rec;
}

function syncClassroomHomeworkStatusToState(studentId, date, status) {
    const sid = String(studentId);
    const d = String(date || '');
    if (!d) return null;

    if (!state.db.homework) state.db.homework = [];
    let rec = state.db.homework.find(h => String(h.student_id) === sid && String(h.date || '') === d);
    if (!rec) {
        rec = { student_id: sid, date: d, status: status || '미기록' };
        state.db.homework.push(rec);
    } else {
        rec.status = status;
    }
    rec.updated_at = new Date().toISOString();
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();

    const month = d.slice(0, 7);
    const cache = state.ui?.monthlyAttendanceCache?.[month];
    if (cache && Array.isArray(cache.homework)) {
        let mRec = cache.homework.find(h => String(h.student_id) === sid && String(h.date || '') === d);
        if (!mRec) {
            mRec = { student_id: sid, date: d, status: rec.status || '미기록' };
            cache.homework.push(mRec);
        }
        mRec.status = rec.status;
        mRec.updated_at = rec.updated_at;
    }

    renderAttendanceLedgerCellIfOpen(sid, d);
    if (state.ui?.currentClassId) updateClassroomMonthlyStatusBoardDOM(state.ui.currentClassId);
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

    if (typeof openStudentDetail === 'function') openStudentDetail(String(studentId), { mode: 'view', returnTo: { type: 'classDetail', classId: String(classId) } });
    else if (typeof renderStudentDetail === 'function') renderStudentDetail(String(studentId), { returnTo: { type: 'classDetail', classId: String(classId) } });
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
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();

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

    if (state.ui?.currentClassId) updateClassroomMonthlyStatusBoardDOM(state.ui.currentClassId);
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
    const student = typeof apmsGetStudentById === 'function'
        ? apmsGetStudentById(sid)
        : (state.db.students || []).find(s => String(s.id) === sid);
    const meta = getAttendanceMetaForStudentDate(sid, d);
    const status = meta.record?.status || '미기록';
    const tagSet = new Set(meta.tags);

    const tagInput = function(tag, label) {
        const checked = tagSet.has(tag) ? 'checked' : '';
        return `<label style="display:flex;align-items:center;gap:8px;padding:10px 12px;border:1px solid var(--border);border-radius:12px;background:var(--surface-2);font-size:13px;font-weight:500;color:var(--text);">
            <input type="checkbox" class="att-meta-tag" value="${apEscapeHtml(tag)}" ${checked} style="accent-color:var(--primary);">${label}
        </label>`;
    };

    showModal('출결 메모', `
        <div style="display:flex;flex-direction:column;gap:12px;">
            <div style="padding:12px;border-radius:14px;background:var(--surface-2);border:1px solid var(--border);">
                <div style="font-size:15px;font-weight:500;color:var(--text);line-height:1.4;">${apEscapeHtml(student?.name || '학생')}</div>
                <div style="font-size:12px;font-weight:500;color:var(--secondary);margin-top:4px;line-height:1.4;">${apEscapeHtml(d)} · 현재 출결 ${apEscapeHtml(status)}</div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                ${tagInput('지각', '지각')}
                ${tagInput('보강', '보강')}
            </div>
            <textarea id="att-meta-memo" class="cls-input" placeholder="출결 관련 메모" style="height:110px;resize:none;line-height:1.6;">${apEscapeHtml(meta.memo)}</textarea>
            <button class="btn apms-button apms-button--primary btn-primary" style="width:100%;min-height:50px;font-size:14px;font-weight:500;border-radius:14px;" onclick="saveAttendanceMeta('${sid}', '${d}', { source: '${apEscapeHtml(options.source || 'classroom')}' })">저장</button>
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
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
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
    const active = getClassroomActiveStudents(classId);
    const total = active.length;

    const { todayAttMap, todayHwMap } = buildClassroomTodayMaps(active, today);
    const hasActiveAttendance = active.some(s => todayAttMap[String(s.id)] === '등원');
    const isScheduled = hasActiveAttendance || isClassScheduledOnDate(classId, today);

    if (!total) return { att: 0, hw: 0, test: 0, total: 0, isScheduled };

    let attCount = 0; let hwCount = 0;
    active.forEach(s => {
        const sid = String(s.id);
        const attStatus = getAttendanceDisplayStatus(todayAttMap[sid], isScheduled);
        if (attStatus === '등원') attCount++;
        const hwStatus = getHomeworkDisplayStatus(todayHwMap[sid], isScheduled);
        if (hwStatus === '완료') hwCount++;
    });

    let test = 0;
    if (todayExam) {
        const testedIds = new Set();
        active.forEach(s => {
            const sid = String(s.id);
            const rows = typeof apmsGetExamSessionsForStudentDateTitle === 'function'
                ? apmsGetExamSessionsForStudentDateTitle(sid, today, todayExam.title)
                : (state.db.exam_sessions || []).filter(es =>
                    String(es.student_id) === sid &&
                    es.exam_date === today &&
                    es.exam_title === todayExam.title
                );
            if (rows.length) testedIds.add(sid);
        });
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

function formatHomeworkPhotoFileSize(value) {
    const size = Number(value || 0);
    if (!Number.isFinite(size) || size <= 0) return '-';
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)}KB`;
    return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function isHomeworkPhotoImage(file = {}) {
    const kind = String(file.kind || '').trim().toLowerCase();
    if (kind === 'image') return true;
    const fileType = String(file.file_type || '').trim().toLowerCase();
    if (fileType.startsWith('image/')) return true;
    return /\.(png|jpe?g|gif|webp|bmp|svg|heic|heif)$/i.test(String(file.file_name || '').trim().toLowerCase());
}

async function openHomeworkPhotoSubmissionFilesModal(submissionId) {
    if (!submissionId) return toast('제출 정보를 찾을 수 없습니다.', 'warn');
    showModal('숙제 사진', `<div id="hw-photo-files" style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">불러오는 중...</div>`);
    try {
        const data = await api.get(`homework-photo/files?submission_id=${encodeURIComponent(submissionId)}`);
        const root = document.getElementById('hw-photo-files');
        if (!root) return;
        if (!data?.success) {
            root.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:500;">숙제 사진을 불러오지 못했습니다.</div>`;
            return toast(data?.message || data?.error || '숙제 사진 조회 실패', 'warn');
        }
        const files = Array.isArray(data.files) ? data.files : [];
        const submission = data.submission || {};
        root.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:var(--surface-2); border-radius:14px; padding:12px; text-align:left;">
                    <div style="font-size:15px; font-weight:500; color:var(--text);">${apEscapeHtml(submission.student_name || '학생')}</div>
                    <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:4px;">${apEscapeHtml(submission.title || '숙제')} · ${submission.submitted_at ? `제출 ${apEscapeHtml(submission.submitted_at)}` : '제출 시각 없음'}</div>
                </div>
                ${files.length ? files.map((file, index) => {
                    const image = isHomeworkPhotoImage(file);
                    const safeUrl = apJsArg(file.url || '');
                    const safeTitle = apJsArg(file.file_name || `파일 ${index + 1}`);
                    return `
                        <div style="border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface);">
                            ${image ? `
                                <button type="button" style="display:block; width:100%; padding:0; border:none; background:transparent; cursor:pointer;" onclick="openHomeworkPhotoImageViewer(${safeUrl}, ${safeTitle})">
                                    <img src="${apEscapeHtml(file.url || '')}" alt="${apEscapeHtml(file.file_name || `숙제 사진 ${index + 1}`)}" style="width:100%; max-height:240px; object-fit:contain; border-radius:12px; background:var(--surface-2); border:1px solid var(--border);">
                                </button>
                            ` : `
                                <div style="display:flex; align-items:center; justify-content:center; min-height:120px; border-radius:12px; background:var(--surface-2); border:1px solid var(--border); color:var(--secondary); font-size:13px; font-weight:500;">이미지 미리보기를 지원하지 않는 파일</div>
                            `}
                            <div style="display:flex; justify-content:space-between; gap:10px; align-items:center; margin-top:10px;">
                                <div style="min-width:0;">
                                    <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.4; overflow-wrap:anywhere;">${apEscapeHtml(file.file_name || `파일 ${index + 1}`)}</div>
                                    <div style="font-size:11px; font-weight:500; color:var(--secondary); margin-top:4px;">${apEscapeHtml(file.file_type || '타입 미기록')} · ${apEscapeHtml(formatHomeworkPhotoFileSize(file.file_size))}</div>
                                </div>
                                <button class="btn apms-button apms-button--quiet" style="flex:0 0 auto; min-height:36px; width:auto; padding:8px 10px; font-size:11px; font-weight:500; border-radius:12px; background:var(--primary-soft); color:var(--primary); border:none;" onclick="window.open(${safeUrl}, '_blank', 'noopener')">열기</button>
                            </div>
                        </div>
                    `;
                }).join('') : `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">등록된 사진 파일이 없습니다.</div>`}
            </div>
        `;
    } catch (e) {
        console.error('[openHomeworkPhotoSubmissionFilesModal] failed:', e);
        toast('숙제 사진 조회 중 오류가 발생했습니다.', 'error');
    }
}

function openHomeworkPhotoImageViewer(url, title = '') {
    if (!url) return toast('이미지 주소를 찾을 수 없습니다.', 'warn');
    showModal(title || '숙제 사진', `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="width:100%; min-height:240px; max-height:72vh; display:flex; align-items:center; justify-content:center; background:var(--surface-2); border:1px solid var(--border); border-radius:16px; overflow:hidden;">
                <img src="${apEscapeHtml(url)}" alt="${apEscapeHtml(title || '숙제 사진')}" style="max-width:100%; max-height:72vh; object-fit:contain; background:#fff;">
            </div>
            <button class="btn apms-button apms-button--quiet" style="min-height:42px; font-size:12px; font-weight:500; background:var(--surface-2); border:1px solid var(--border);" onclick="window.open(${apJsArg(url)}, '_blank', 'noopener')">새 창에서 열기</button>
        </div>
    `);
}

function openHomeworkPhotoAssignmentModal(classId) {
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    const today = typeof getClassroomOperationDate === 'function' ? getClassroomOperationDate() : new Date().toLocaleDateString('sv-SE');
    showModal('숙제', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                <div style="font-size:15px; font-weight:500; color:var(--text);">${apEscapeHtml(cls?.name || '반')}</div>
                <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:4px;">숙제를 저장합니다.</div>
            </div>
            <input id="hw-photo-title" class="cls-input" placeholder="숙제 제목">
            <textarea id="hw-photo-desc" class="cls-input" rows="4" placeholder="숙제 설명" style="resize:vertical;"></textarea>
            <div style="display:grid; grid-template-columns:1fr 120px; gap:8px;">
                <input id="hw-photo-date" type="date" class="cls-input" value="${apEscapeHtml(today)}">
                <input id="hw-photo-time" type="time" class="cls-input" value="23:00">
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end;">
                <button class="btn apms-button apms-button--quiet" style="width:auto; flex:0 0 auto; min-height:44px; padding:10px 14px; font-size:13px; font-weight:500; background:var(--surface-2); border:1px solid var(--border);" onclick="openHomeworkPhotoAssignmentList('${classId}')">기존 숙제 보기</button>
                <button class="btn apms-button apms-button--primary btn-primary" style="width:auto; flex:0 0 auto; min-height:44px; padding:10px 18px; font-size:14px; font-weight:500;" onclick="handleCreateHomeworkPhotoAssignment('${classId}')">저장</button>
            </div>
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
        closeModal(true);
    } catch (e) {
        console.error('[handleCreateHomeworkPhotoAssignment] failed:', e);
        toast('숙제 등록 중 오류가 발생했습니다.', 'error');
    }
}

async function openHomeworkPhotoAssignmentList(classId) {
    showModal('숙제 목록', `<div id="hw-photo-assignment-list" style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">불러오는 중...</div>`);
    try {
        const data = api.getHomeworkPhotoAssignments
            ? await api.getHomeworkPhotoAssignments(classId)
            : await api.get(`homework-photo/assignments?class_id=${encodeURIComponent(classId)}`);
        const root = document.getElementById('hw-photo-assignment-list');
        if (!root) return;
        const list = Array.isArray(data.assignments) ? data.assignments : [];
        if (!data?.success || !list.length) {
            root.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">등록된 숙제가 없습니다.</div>`;
            return;
        }
        root.innerHTML = `<div style="display:flex; flex-direction:column; gap:10px;">${list.map(a => {
            const total = Number(a.total || 0);
            const submitted = Number(a.submitted || 0);
            return `
                <div style="border:1px solid var(--border); border-radius:14px; padding:13px; background:var(--surface);">
                    <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start;">
                        <div style="min-width:0;">
                            <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.35;">${apEscapeHtml(a.title || '숙제')}</div>
                            <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:4px;">마감 ${apEscapeHtml(a.due_date || '')}${a.due_time ? ` ${apEscapeHtml(a.due_time)}` : ''} · 제출 ${submitted}/${total}</div>
                        </div>
                        <div style="font-size:12px; font-weight:500; color:${a.status === 'closed' ? 'var(--secondary)' : 'var(--primary)'};">${a.status === 'closed' ? '마감' : '진행'}</div>
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:flex-end; margin-top:12px;">
                        <button class="btn apms-button apms-button--quiet" style="width:auto; flex:0 0 auto; min-height:36px; padding:8px 12px; font-size:12px; font-weight:500; border-radius:12px; background:var(--surface-2); border:none;" onclick="openHomeworkPhotoOverviewModal('${a.id}')">현황</button>
                        <button class="btn apms-button apms-button--quiet" style="width:auto; flex:0 0 auto; min-height:36px; padding:8px 12px; font-size:12px; font-weight:500; border-radius:12px; background:rgba(232,65,79,0.08); border:none; color:var(--error);" onclick="deleteHomeworkPhotoAssignment('${a.id}', '${classId}')">삭제</button>
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
    showModal('학생별 링크', `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">불러오는 중...</div>`);
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
                <button class="btn apms-button apms-button--primary btn-primary" style="flex:1; min-height:42px; font-size:12px; font-weight:500;" onclick="openHomeworkPhotoOverviewModal('${assignmentId}')">제출 현황</button>
                <button class="btn apms-button apms-button--quiet" style="flex:1; min-height:42px; font-size:12px; font-weight:500; background:var(--surface-2); border:1px solid var(--border);" onclick="copyHomeworkPhotoText(document.getElementById('hw-photo-all-links')?.value || '', '전체 링크가 복사되었습니다.')">전체 복사</button>
            </div>
            <textarea id="hw-photo-all-links" style="position:absolute; left:-9999px; width:1px; height:1px;">${apEscapeHtml(allText)}</textarea>
            ${normalized.length ? normalized.map(item => {
                const safeUrl = apJsArg(item.url || '');
                return `
                    <div style="border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface);">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
                            <div style="min-width:0;">
                                <div style="font-size:14px; font-weight:500; color:var(--text);">${apEscapeHtml(item.name || '학생')}</div>
                                <div style="font-size:11px; font-weight:500; color:var(--secondary); word-break:break-all; margin-top:4px;">${apEscapeHtml(item.url || '')}</div>
                            </div>
                            <button class="btn apms-button apms-button--quiet" style="flex:0 0 auto; min-height:36px; width:auto; padding:8px 10px; font-size:11px; font-weight:500; border-radius:12px; background:var(--primary-soft); color:var(--primary); border:none;" onclick="copyHomeworkPhotoText(${safeUrl}, '링크가 복사되었습니다.')">복사</button>
                        </div>
                        <div style="margin-top:10px; text-align:center;">
                            <img src="${getHomeworkPhotoQrSrc(item.url || '')}" alt="QR" style="width:128px; height:128px; background:#fff; border:1px solid var(--border); border-radius:12px; padding:8px;">
                        </div>
                    </div>
                `;
            }).join('') : `<div style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">생성된 링크가 없습니다.</div>`}
        </div>
    `);
}

async function openHomeworkPhotoOverviewModal(assignmentId) {
    showModal('제출 현황', `<div id="hw-photo-overview" style="padding:28px 12px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">불러오는 중...</div>`);
    try {
        const data = api.getHomeworkPhotoOverview
            ? await api.getHomeworkPhotoOverview(assignmentId)
            : await api.get(`homework-photo/overview?assignment_id=${encodeURIComponent(assignmentId)}`);
        const root = document.getElementById('hw-photo-overview');
        if (!root) return;
        if (!data?.success) {
            root.innerHTML = `<div style="padding:28px 12px; text-align:center; color:var(--error); font-size:13px; font-weight:500;">현황을 불러오지 못했습니다.</div>`;
            return toast(data?.message || data?.error || '현황 조회 실패', 'warn');
        }
        const rows = Array.isArray(data.students) ? data.students : [];
        const total = rows.length;
        const submitted = rows.filter(r => Number(r.is_submitted || 0) === 1).length;
        root.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="background:var(--surface-2); border-radius:14px; padding:12px;">
                    <div style="font-size:15px; font-weight:500; color:var(--text);">${apEscapeHtml(data.assignment?.title || '숙제')}</div>
                    <div style="font-size:12px; font-weight:500; color:var(--secondary); margin-top:4px;">전체 ${total} · 제출 ${submitted} · 미제출 ${total - submitted}</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <button class="btn apms-button apms-button--quiet" style="width:auto; flex:0 0 auto; min-height:38px; padding:8px 12px; font-size:12px; font-weight:500; color:var(--error); background:rgba(232,65,79,0.08); border:1px solid rgba(232,65,79,0.16);" onclick="closeHomeworkPhotoAssignment('${assignmentId}')">마감 처리</button>
                    <button class="btn apms-button apms-button--quiet" style="width:auto; flex:0 0 auto; min-height:38px; padding:8px 12px; font-size:12px; font-weight:500; color:var(--error); background:rgba(232,65,79,0.08); border:1px solid rgba(232,65,79,0.16);" onclick="deleteHomeworkPhotoAssignment('${assignmentId}', '${apEscapeHtml(data.assignment?.class_id || '')}')">삭제</button>
                </div>
                ${rows.map(r => {
                    const done = Number(r.is_submitted || 0) === 1;
                    const studentUrl = buildHomeworkPhotoStudentUrl(assignmentId, r.student_id, r.url);
                    const safeUrl = apJsArg(studentUrl || '');
                    const safeSubmissionId = apJsArg(r.submission_id || '');
                    const canViewFiles = done && Number(r.file_count || 0) > 0 && String(r.submission_id || '').trim();
                    return `
                        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; border:1px solid var(--border); border-radius:14px; padding:12px; background:var(--surface);">
                            <div style="min-width:0;">
                                <div style="font-size:14px; font-weight:500; color:var(--text);">${apEscapeHtml(r.name || '')}</div>
                                <div style="font-size:11px; font-weight:500; color:var(--secondary); margin-top:4px;">${done ? `제출 ${apEscapeHtml(r.submitted_at || '')}` : '미제출'} · 사진 ${Number(r.file_count || 0)}장</div>
                            </div>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span style="font-size:13px; font-weight:500; color:${done ? 'var(--success)' : 'var(--error)'};">${done ? '완료' : '미제출'}</span>
                                ${canViewFiles ? `<button class="btn apms-button apms-button--quiet" style="width:auto; min-height:34px; padding:7px 9px; font-size:11px; font-weight:500; border-radius:9px; background:var(--surface-2); border:1px solid var(--border); color:var(--text);" onclick="openHomeworkPhotoSubmissionFilesModal(${safeSubmissionId})">사진</button>` : ''}
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
    const classId = String(cid || '');
    if (typeof apmsGetDataIndexes === 'function') {
        const idx = apmsGetDataIndexes();
        const maps = idx.classStudentRowsByClassId.get(classId) || [];
        return maps
            .map(row => idx.studentsById.get(String(row.student_id || '')))
            .filter(student => student && isActiveStudentStatus(student.status));
    }

    const mIds = state.db.class_students
        .filter(m => String(m.class_id) === classId)
        .map(m => String(m.student_id));
    const idSet = new Set(mIds);
    const orderMap = new Map(mIds.map((id, idx) => [String(id), idx]));
    return state.db.students
        .filter(s => idSet.has(String(s.id)) && isActiveStudentStatus(s.status))
        .sort((a, b) => (orderMap.get(String(a.id)) ?? 9999) - (orderMap.get(String(b.id)) ?? 9999));
}

const CLASS_PLANNER_DISCHARGED_VISIBLE_DAYS = 31;

function isClassPlannerDischargedStudent(student) {
    return isWithdrawnStudentStatus(student?.status);
}

function getClassPlannerStudentUpdatedDate(student) {
    const raw = String(student?.updated_at || student?.status_updated_at || '').trim();
    const dateText = raw.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || '';
    return dateText ? parseClassPlannerDate(dateText) : null;
}

function isClassPlannerRecentlyDischargedForMonth(student, monthStart) {
    if (!isClassPlannerDischargedStudent(student)) return false;
    const dischargedAt = getClassPlannerStudentUpdatedDate(student);
    const monthFirst = parseClassPlannerDate(getClassPlannerMonthStart(monthStart));
    if (!dischargedAt || !monthFirst) return false;
    const monthLast = new Date(monthFirst.getFullYear(), monthFirst.getMonth() + 1, 0);
    const visibleUntil = new Date(
        dischargedAt.getFullYear(),
        dischargedAt.getMonth(),
        dischargedAt.getDate() + CLASS_PLANNER_DISCHARGED_VISIBLE_DAYS
    );
    return dischargedAt <= monthLast && monthFirst <= visibleUntil;
}

function getClassroomMonthlyPlannerStudents(cid, monthStart) {
    const classId = String(cid || '');
    let rows = [];
    if (typeof apmsGetDataIndexes === 'function') {
        const idx = apmsGetDataIndexes();
        rows = (idx.classStudentRowsByClassId.get(classId) || [])
            .map((row, order) => ({ order, student: idx.studentsById.get(String(row.student_id || '')) }))
            .filter(entry => {
                const student = entry.student;
                if (!student) return false;
                if (isActiveStudentStatus(student.status)) return true;
                return isClassPlannerRecentlyDischargedForMonth(student, monthStart);
            });
    } else {
        const mIds = state.db.class_students
            .filter(m => String(m.class_id) === classId)
            .map(m => String(m.student_id));
        const idSet = new Set(mIds);
        const orderMap = new Map(mIds.map((id, idx) => [String(id), idx]));
        rows = state.db.students
            .filter(student => {
                if (!idSet.has(String(student.id))) return false;
                if (isActiveStudentStatus(student.status)) return true;
                return isClassPlannerRecentlyDischargedForMonth(student, monthStart);
            })
            .map(student => ({ student, order: orderMap.get(String(student.id)) ?? 9999 }));
    }
    return rows
        .sort((a, b) => a.order - b.order)
        .map(entry => {
            const student = entry.student;
            return Object.assign({}, student, {
                isPlannerDischarged: isClassPlannerRecentlyDischargedForMonth(student, monthStart)
            });
        });
}

function buildClassroomTodayMaps(students, today) {
    const todayAttMap = {};
    const todayHwMap = {};

    (Array.isArray(students) ? students : []).forEach(student => {
        const sid = String(student && student.id || '');
        if (!sid) return;
        const att = typeof apmsGetAttendanceRecordForStudentDate === 'function'
            ? apmsGetAttendanceRecordForStudentDate(sid, today)
            : (state.db.attendance || []).find(a => String(a.student_id) === sid && String(a.date || '') === String(today || ''));
        const hw = typeof apmsGetHomeworkRecordForStudentDate === 'function'
            ? apmsGetHomeworkRecordForStudentDate(sid, today)
            : (state.db.homework || []).find(h => String(h.student_id) === sid && String(h.date || '') === String(today || ''));
        if (att) todayAttMap[sid] = att.status;
        if (hw) todayHwMap[sid] = hw.status;
    });

    return { todayAttMap, todayHwMap };
}

function getClassroomMonthLabel(month) {
    const safe = String(month || '').trim();
    if (!/^\d{4}-\d{2}$/.test(safe)) return '';
    const [year, monthNo] = safe.split('-').map(Number);
    return `${year}년 ${monthNo}월`;
}

function formatClassroomMonthDay(dateStr) {
    const safe = normalizeClassroomDate(dateStr);
    if (!safe) return '';
    return `${Number(safe.slice(5, 7))}/${Number(safe.slice(8, 10))}`;
}

function isClassroomMonthlyMakeupRecord(row) {
    const status = String(row?.status || '').trim();
    if (status === '보강') return true;
    return normalizeAttendanceTags(row?.tags).some(tag => tag === '보강' || String(tag || '').startsWith('makeup:'));
}

function isClassroomMonthlyHomeworkIssue(row) {
    return String(row?.status || '').trim() === '미완료';
}

function isClassroomMonthlyConsultationAttendanceRecord(row) {
    const status = String(row?.status || '').trim();
    if (status === '상담') return true;
    return normalizeAttendanceTags(row?.tags).includes('상담');
}

function getClassroomMonthlyRows(type, month) {
    const cache = state.ui?.monthlyAttendanceCache?.[month] || {};
    if (type === 'attendance') {
        return Array.isArray(cache.attendance) ? cache.attendance : (state.db.attendance || []);
    }
    if (type === 'homework') {
        return Array.isArray(cache.homework) ? cache.homework : (state.db.homework || []);
    }
    return [];
}

function addClassroomMonthlyIssue(groupMap, studentId, date) {
    const sid = String(studentId || '');
    const safeDate = normalizeClassroomDate(date);
    if (!sid || !safeDate) return;
    if (!groupMap.has(sid)) groupMap.set(sid, new Set());
    groupMap.get(sid).add(safeDate);
}

function buildClassroomMonthlyStatusBoardData(classId, students, today) {
    const month = (normalizeClassroomDate(today) || getClassroomOperationDate()).slice(0, 7);
    const classStudents = Array.isArray(students) ? students : getClassroomActiveStudents(classId);
    const studentIds = new Set(classStudents.map(student => String(student?.id || '')).filter(Boolean));
    const groups = {
        absent: new Map(),
        makeup: new Map(),
        homework: new Map(),
        consultation: new Map()
    };

    getClassroomMonthlyRows('attendance', month).forEach(row => {
        const sid = String(row?.student_id || '');
        const date = normalizeClassroomDate(row?.date);
        if (!studentIds.has(sid) || !date || date.slice(0, 7) !== month) return;
        if (String(row?.status || '').trim() === '결석') addClassroomMonthlyIssue(groups.absent, sid, date);
        if (isClassroomMonthlyMakeupRecord(row)) addClassroomMonthlyIssue(groups.makeup, sid, date);
        if (isClassroomMonthlyConsultationAttendanceRecord(row)) addClassroomMonthlyIssue(groups.consultation, sid, date);
    });

    getClassroomMonthlyRows('homework', month).forEach(row => {
        const sid = String(row?.student_id || '');
        const date = normalizeClassroomDate(row?.date);
        if (!studentIds.has(sid) || !date || date.slice(0, 7) !== month) return;
        if (isClassroomMonthlyHomeworkIssue(row)) addClassroomMonthlyIssue(groups.homework, sid, date);
    });

    (state.db.consultations || []).forEach(row => {
        const sid = String(row?.student_id || row?.studentId || '');
        const date = normalizeClassroomDate(String(row?.date || row?.consultation_date || row?.created_at || '').slice(0, 10));
        if (!studentIds.has(sid) || !date || date.slice(0, 7) !== month) return;
        addClassroomMonthlyIssue(groups.consultation, sid, date);
    });

    return { month, students: classStudents, groups };
}

function normalizeClassroomStatusArchiveFile(raw = '') {
    const value = String(raw || '').trim();
    if (!value) return '';
    if (value.startsWith('MIXED:')) return value;
    if (/^https?:\/\//i.test(value)) return value;
    let path = value.replace(/^archive\//, '').replace(/^\.\//, '').replace(/^\/+/, '');
    if (!path) return '';
    if (/^(exams|assets|data)\//.test(path)) return path;
    if (!path.endsWith('.js')) path += '.js';
    return `exams/${path}`;
}

function makeClassroomStatusExamKey(row = {}) {
    const date = String(row.exam_date || row.date || '').slice(0, 10);
    const archive = normalizeClassroomStatusArchiveFile(row.archive_file || '');
    if (archive) return `${date}||${archive}`;
    return `${date}||${String(row.exam_title || row.title || '')}`;
}

function isClassroomStatusQuestionCountCompatible(assignment, row) {
    const assignmentCount = Number(assignment?.question_count || 0);
    const rowCount = Number(row?.question_count || 0);
    return !assignmentCount || !rowCount || assignmentCount === rowCount;
}

function isClassroomStatusSessionForAssignment(session, assignment) {
    if (!session || !assignment) return false;
    const assignmentId = String(assignment.id || '');
    if (assignmentId && String(session.assignment_id || '') === assignmentId) return true;
    if (String(session.exam_date || '').slice(0, 10) !== String(assignment.exam_date || '').slice(0, 10)) return false;
    if (!isClassroomStatusQuestionCountCompatible(assignment, session)) return false;

    const assignmentArchive = normalizeClassroomStatusArchiveFile(assignment.archive_file || '');
    const sessionArchive = normalizeClassroomStatusArchiveFile(session.archive_file || '');
    if (assignmentArchive) return assignmentArchive === sessionArchive;
    return String(session.exam_title || '') === String(assignment.exam_title || '');
}

function buildClassroomAssignmentStatusRows(classId, students) {
    const classStudents = Array.isArray(students) ? students : getClassroomActiveStudents(classId);
    const studentIds = new Set(classStudents.map(student => String(student?.id || '')).filter(Boolean));
    const activeCount = classStudents.length || studentIds.size;
    const assignments = (state.db.class_exam_assignments || [])
        .filter(row => String(row?.class_id || '') === String(classId || ''));
    if (!assignments.length) return [];

    const groups = new Map();
    assignments.forEach(assignment => {
        const key = makeClassroomStatusExamKey(assignment);
        if (!groups.has(key)) {
            groups.set(key, {
                key,
                title: assignment.exam_title || '',
                date: String(assignment.exam_date || '').slice(0, 10),
                archiveFile: assignment.archive_file || '',
                questionCount: Number(assignment.question_count || 0),
                assignments: [],
                sessions: []
            });
        }
        const group = groups.get(key);
        group.assignments.push(assignment);
        if (!group.title && assignment.exam_title) group.title = assignment.exam_title;
        if (!group.date && assignment.exam_date) group.date = String(assignment.exam_date || '').slice(0, 10);
        if (!group.archiveFile && assignment.archive_file) group.archiveFile = assignment.archive_file;
        if (!group.questionCount && assignment.question_count) group.questionCount = Number(assignment.question_count || 0);
    });

    const assignmentList = Array.from(groups.values()).flatMap(group => group.assignments);
    (state.db.exam_sessions || []).forEach(session => {
        const sid = String(session?.student_id || '');
        if (!studentIds.has(sid)) return;
        const matched = assignmentList.find(assignment => isClassroomStatusSessionForAssignment(session, assignment));
        if (!matched) return;
        const group = groups.get(makeClassroomStatusExamKey(matched));
        if (!group) return;
        if (!group.sessions.some(row => String(row.id || '') === String(session.id || ''))) group.sessions.push(session);
    });

    const wrongs = state.db.wrong_answers || [];
    const exclusions = state.db.class_exam_assignment_exclusions || [];
    return Array.from(groups.values())
        .map(group => {
            const sessionIds = new Set(group.sessions.map(session => String(session.id || '')).filter(Boolean));
            const assignmentIds = new Set(group.assignments.map(assignment => String(assignment.id || '')).filter(Boolean));
            const excludedStudents = new Set(
                exclusions
                    .filter(row => assignmentIds.has(String(row?.assignment_id || '')))
                    .map(row => String(row?.student_id || ''))
                    .filter(id => id && studentIds.has(id))
            );
            return {
                ...group,
                submittedCount: group.sessions.length,
                targetCount: Math.max(0, activeCount - excludedStudents.size),
                wrongCount: wrongs.filter(row => sessionIds.has(String(row?.session_id || ''))).length
            };
        })
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')) || String(b.title || '').localeCompare(String(a.title || ''), 'ko'));
}

function renderClassroomAssignmentStatusCategory(classId, students) {
    const rows = buildClassroomAssignmentStatusRows(classId, students);
    const body = rows.length
        ? rows.map(row => {
            const title = row.title || '출제 시험';
            const date = row.date || '';
            const qCount = Number(row.questionCount || 0);
            const meta = [
                date,
                qCount ? `${qCount}문항` : '',
                `제출 ${row.submittedCount}/${row.targetCount}`,
                `오답 ${row.wrongCount}문항`
            ].filter(Boolean).join(' · ');
            return `
                <div class="ap-classroom-monthly-row ap-classroom-monthly-row--exam" role="button" tabindex="0" onclick="if(typeof openExamDetail==='function') openExamDetail('${apEscapeHtml(String(classId || ''))}', ${apJsArg(title)}, '${apEscapeHtml(date)}', ${apJsArg(row.archiveFile || '')})">
                    <div class="ap-classroom-monthly-student">${apEscapeHtml(title)}</div>
                    <div class="ap-classroom-monthly-dates">${apEscapeHtml(meta)}</div>
                </div>
            `;
        }).join('')
        : '';

    return `
        <section class="ap-classroom-monthly-category is-exam" aria-label="출제">
            <div class="ap-classroom-monthly-category-head">
                <span>출제</span>
                <strong>${rows.length}건</strong>
            </div>
            ${body}
        </section>
    `;
}

function getClassroomWrongClinicStatusRows(classId) {
    return (state.db.wrong_clinic_status || [])
        .filter(row => String(row?.class_id || '') === String(classId || ''))
        .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
}

function scheduleClassroomWrongClinicStatusRefresh(classId) {
    const cid = String(classId || '').trim();
    if (!cid || typeof api === 'undefined' || typeof api.get !== 'function') return;
    if (!state.ui) state.ui = {};
    if (!state.ui.classroomWrongClinicStatus) state.ui.classroomWrongClinicStatus = {};
    const cache = state.ui.classroomWrongClinicStatus[cid] || {};
    if (cache.loading) return;
    if (cache.loadedAt && Date.now() - cache.loadedAt < 60000) return;
    state.ui.classroomWrongClinicStatus[cid] = { ...cache, loading: true };
    setTimeout(async () => {
        try {
            const res = await api.get(`wrong-clinics/class-status?class_id=${encodeURIComponent(cid)}`);
            const rows = (res?.clinics || []).map(row => ({ ...row, class_id: cid }));
            const keep = (state.db.wrong_clinic_status || []).filter(row => String(row?.class_id || '') !== cid);
            state.db.wrong_clinic_status = [...keep, ...rows];
            state.ui.classroomWrongClinicStatus[cid] = { loading: false, loadedAt: Date.now() };
            updateClassroomMonthlyStatusBoardDOM(cid);
        } catch (e) {
            console.warn('[classroom] wrong clinic status refresh failed:', e);
            state.ui.classroomWrongClinicStatus[cid] = { loading: false, loadedAt: Date.now() };
        }
    }, 0);
}

function renderClassroomWrongClinicStatusCategory(classId) {
    const rows = getClassroomWrongClinicStatusRows(classId);
    const loading = !!state.ui?.classroomWrongClinicStatus?.[String(classId || '')]?.loading;
    const body = rows.length
        ? rows.map(row => {
            const title = row.title || '오답 클리닉';
            const createdDate = String(row.created_at || '').slice(0, 10);
            const reviewWrongCount = Number(row.review_wrong_count || 0);
            const meta = [
                createdDate,
                `${Number(row.packet_count || 0)}명`,
                `제출 ${Number(row.submitted_count || 0)}/${Number(row.packet_count || 0)}`,
                `${Number(row.total_item_count || 0)}문항`,
                reviewWrongCount ? `재오답 ${reviewWrongCount}문항` : ''
            ].filter(Boolean).join(' · ');
            return `
                <div class="ap-classroom-monthly-row ap-classroom-monthly-row--exam" role="button" tabindex="0" onclick="if(typeof openClinicPrintCenter==='function') openClinicPrintCenter('${apEscapeHtml(String(classId || ''))}')">
                    <div class="ap-classroom-monthly-student">${apEscapeHtml(title)}</div>
                    <div class="ap-classroom-monthly-dates">${apEscapeHtml(meta)}</div>
                </div>
            `;
        }).join('')
        : (loading ? '<div class="ap-classroom-monthly-dates">불러오는 중</div>' : '');

    return `
        <section class="ap-classroom-monthly-category is-clinic" aria-label="오답">
            <div class="ap-classroom-monthly-category-head">
                <span>오답</span>
                <strong>${rows.length}건</strong>
            </div>
            ${body}
        </section>
    `;
}

function renderClassroomMonthlyStatusCategory(title, rows, tone, classId) {
    const total = rows.reduce((sum, row) => sum + row.dates.length, 0);
    const toneClass = tone ? ` is-${apEscapeHtml(tone)}` : '';
    const detailClassId = String(classId || state.ui?.currentClassId || '');
    const body = rows.length
        ? rows.map(row => `
            <div class="ap-classroom-monthly-row">
                <div class="ap-classroom-monthly-student" style="cursor:pointer;" onclick="setManagementReturnView({ type: 'classDetail', classId: '${apEscapeHtml(detailClassId)}' }); openStudentDetail('${apEscapeHtml(String(row.sid || ''))}', { mode: 'view', returnTo: { type: 'classDetail', classId: '${apEscapeHtml(detailClassId)}' } })">${apEscapeHtml(row.name)}</div>
                <div class="ap-classroom-monthly-dates">${row.dates.map(formatClassroomMonthDay).filter(Boolean).join(' · ')}</div>
            </div>
        `).join('')
        : '';

    return `
        <section class="ap-classroom-monthly-category${toneClass}" aria-label="${apEscapeHtml(title)}">
            <div class="ap-classroom-monthly-category-head">
                <span>${apEscapeHtml(title)}</span>
                <strong>${total}건</strong>
            </div>
            ${body}
        </section>
    `;
}

function renderClassroomMonthlyStatusBoard(classId, students, today) {
    const data = buildClassroomMonthlyStatusBoardData(classId, students, today);
    scheduleClassroomWrongClinicStatusRefresh(classId);
    const nameMap = new Map(data.students.map((student, order) => [String(student.id), { name: student.name || '학생', order }]));
    const toRows = function(group) {
        return Array.from(group.entries())
            .map(([sid, dates]) => ({
                sid,
                name: nameMap.get(sid)?.name || '학생',
                order: nameMap.get(sid)?.order ?? 9999,
                dates: Array.from(dates).sort()
            }))
            .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'ko'));
    };

    const absentRows = toRows(data.groups.absent);
    const makeupRows = toRows(data.groups.makeup);
    const homeworkRows = toRows(data.groups.homework);
    const consultationRows = toRows(data.groups.consultation);

    return `
        <div class="ap-classroom-monthly-board apms-card ap-classroom-card" id="classroom-monthly-status-board">
            <div class="ap-classroom-monthly-list">
                ${renderClassroomAssignmentStatusCategory(classId, data.students)}
                ${renderClassroomWrongClinicStatusCategory(classId)}
                ${renderClassroomMonthlyStatusCategory('결석', absentRows, 'absent', classId)}
                ${renderClassroomMonthlyStatusCategory('보강', makeupRows, 'makeup', classId)}
                ${renderClassroomMonthlyStatusCategory('숙제', homeworkRows, 'homework', classId)}
                ${renderClassroomMonthlyStatusCategory('상담', consultationRows, 'consultation', classId)}
            </div>
        </div>
    `;
}

function updateClassroomMonthlyStatusBoardDOM(classId) {
    const root = document.getElementById('classroom-monthly-status-board');
    if (!root) return false;
    const cid = String(classId || state.ui?.currentClassId || '');
    if (!cid) return false;
    const today = getClassroomOperationDate();
    root.outerHTML = renderClassroomMonthlyStatusBoard(cid, getClassroomActiveStudents(cid), today);
    return true;
}

function mergeClassroomMonthlyStatusRows(month, attendanceRows = [], homeworkRows = []) {
    if (!/^\d{4}-\d{2}$/.test(String(month || ''))) return;
    if (!state.ui) state.ui = {};
    if (!state.ui.monthlyAttendanceCache) state.ui.monthlyAttendanceCache = {};
    const cache = state.ui.monthlyAttendanceCache[month] || { attendance: [], homework: [] };
    const mergeClassroomMonthlyRows = (target, rows) => {
        if (!Array.isArray(rows)) return target;
        rows.forEach(row => {
            const sid = String(row?.student_id || row?.studentId || '');
            const date = normalizeClassroomDate(row?.date);
            if (!sid || !date || date.slice(0, 7) !== month) return;
            const idx = target.findIndex(item => String(item.student_id) === sid && String(item.date || '') === date);
            const normalized = { ...row, student_id: sid, date };
            if (idx > -1) target[idx] = { ...target[idx], ...normalized };
            else target.push(normalized);
        });
        return target;
    };
    cache.attendance = mergeClassroomMonthlyRows(Array.isArray(cache.attendance) ? cache.attendance : [], attendanceRows);
    cache.homework = mergeClassroomMonthlyRows(Array.isArray(cache.homework) ? cache.homework : [], homeworkRows);
    state.ui.monthlyAttendanceCache[month] = cache;
}

async function ensureClassroomMonthlyStatusCache(classId, today, students) {
    const safeDate = normalizeClassroomDate(today) || getClassroomOperationDate();
    const month = safeDate.slice(0, 7);
    if (!/^\d{4}-\d{2}$/.test(month)) return false;
    if (!state.ui) state.ui = {};
    if (!state.ui.classroomMonthlyStatusCache) state.ui.classroomMonthlyStatusCache = {};
    if (state.ui.classroomMonthlyStatusCache[month]) return true;

    try {
        const data = await api.get(`attendance-month?month=${encodeURIComponent(month)}`);
        mergeClassroomMonthlyStatusRows(month, data?.attendance || [], data?.homework || []);
        state.ui.classroomMonthlyStatusCache[month] = true;
        const root = document.getElementById('classroom-monthly-status-board');
        if (root && String(state.ui.currentClassId || '') === String(classId) && getClassroomOperationDate().slice(0, 7) === month) {
            root.outerHTML = renderClassroomMonthlyStatusBoard(classId, students, safeDate);
        }
        return true;
    } catch (e) {
        console.warn('[ensureClassroomMonthlyStatusCache] failed:', e);
        return false;
    }
}

function renderClassTopBarV4B(cls, summary, today) {
    const realToday = getClassroomTodayDate();
    const dateLabel = today === realToday ? '오늘 운영' : '선택일 운영';
    const statusHtml = summary.isScheduled
        ? `<div class="cls-v4-summary ap-classroom-summary" id="v4-summary-root">
            <span class="cls-v4-pill apms-chip ap-classroom-chip">출석 <span class="ap-classroom-chip__value">${summary.att}/${summary.total}</span></span>
            <span class="cls-v4-pill apms-chip ap-classroom-chip">숙제 <span class="ap-classroom-chip__value">${summary.hw}/${summary.total}</span></span>
          </div>`
        : `<div class="cls-v4-summary ap-classroom-summary" id="v4-summary-root"><span class="cls-v4-pill warn apms-chip ap-classroom-chip">정규 수업일 아님</span></div>`;

    return `
        <div class="cls-v4-top apms-card__header ap-classroom-section">
            <div class="cls-v4-title">
                <div class="cls-v4-title-main apms-card__title">${apEscapeHtml(cls.name)}</div>
                <div class="cls-v4-title-sub apms-card__meta">${dateLabel} · ${today} · ${formatClassScheduleDays(cls.schedule_days)}</div>
            </div>
            ${statusHtml}
        </div>
    `;
}

function renderClassToolBarV4B(cid, plannerEnabled, today) {
    const realToday = getClassroomTodayDate();
    return `
        <div class="cls-v4-tools apms-toolbar ap-classroom-toolbar">
            <input type="date" class="cls-v4-date-input" value="${apEscapeHtml(today)}" onchange="changeClassOperationDate('${cid}', this.value)" title="운영 날짜 선택">
            <button class="btn cls-v4-date-reset" onclick="changeClassOperationDate('${cid}', '${realToday}')">오늘</button>
            <button class="btn cls-v4-tool red apms-button apms-button--quiet" onclick="openClassRecordModal('${cid}')">진도</button>
            <button class="btn cls-v4-tool green apms-button apms-button--quiet" onclick="openHomeworkPhotoAssignmentModal('${cid}')">숙제</button>
            <button class="btn cls-v4-tool blue apms-button apms-button--quiet" onclick="openQrGenerator('${cid}')">QR/OMR</button>
            <button class="btn cls-v4-tool orange apms-button apms-button--quiet" onclick="openExamGradeView('${cid}')">원내평가</button>
            <button class="btn cls-v4-tool purple apms-button apms-button--quiet" onclick="if(typeof openClinicCenter==='function') openClinicCenter('${cid}'); else toast('클리닉 준비중', 'warn');">클리닉</button>
            ${plannerEnabled ? `<button class="btn cls-v4-tool green apms-button apms-button--quiet" onclick="renderPlannerControl('${cid}')">플래너</button>` : ''}
        </div>
    `;
}

function renderClassStudentBoardV4B(cid, students, todayAttMap, todayHwMap, isScheduled, plannerEnabled, today) {
    if (!students.length) {
        return `<div class="cls-v4-board apms-card ap-classroom-card ap-classroom-roster"><div class="cls-v4-empty apms-empty ap-classroom-empty">재원생이 없습니다.</div></div>`;
    }

    return `
        <div class="cls-v4-board apms-card ap-classroom-card ap-classroom-roster">
            <div class="cls-v4-board-head apms-line-row ap-classroom-row">
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
        <div class="cls-v4-row apms-line-row apms-line-row--clickable ap-classroom-row" id="class-row-${s.id}">
            <div class="cls-v4-name-col apms-line-row__main ap-classroom-row__main" onclick="setManagementReturnView({ type: 'classDetail', classId: '${cid}' }); openStudentDetail('${s.id}', { mode: 'view', returnTo: { type: 'classDetail', classId: '${cid}' } })">
                <div class="cls-v4-student apms-line-row__title ap-classroom-row__title">${apEscapeHtml(s.name)}</div>
            </div>
            <div class="cls-v4-badges apms-line-row__actions ap-classroom-row__actions">
                <button class="btn cls-v4-status class-att-toggle" style="${attStyle}" onclick="toggleAtt('${s.id}', '${rowDate}')">${attLabel}</button>
                <button class="btn cls-v4-status hw class-hw-toggle" style="${hwStyle}" onclick="toggleHw('${s.id}', '${rowDate}')">${hwLabel}</button>
                ${renderAttendanceTagButton(s.id, rowDate, '지각')}
                ${renderMakeupExpandButton(s.id, rowDate)}
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
        ? `<span class="cls-v4-pill apms-chip ap-classroom-chip">출석 <span class="ap-classroom-chip__value">${summary.att}/${summary.total}</span></span>
           <span class="cls-v4-pill apms-chip ap-classroom-chip">숙제 <span class="ap-classroom-chip__value">${summary.hw}/${summary.total}</span></span>`
        : `<span class="cls-v4-pill warn apms-chip ap-classroom-chip">정규 수업일 아님</span>`;
}

function updateStudentRowDOM(sid, cid) {
    const row = document.getElementById('class-row-' + sid);
    if (!row) return false;

    const cls = typeof apmsGetClassById === 'function'
        ? apmsGetClassById(cid)
        : state.db.classes.find(c => String(c.id) === String(cid));
    const student = typeof apmsGetStudentById === 'function'
        ? apmsGetStudentById(sid)
        : state.db.students.find(st => String(st.id) === String(sid));
    if (!cls || !student) return false;

    const today = getClassroomOperationDate();
    const summary = computeClassTodaySummary(cid, today);
    const attCur = typeof apmsGetAttendanceRecordForStudentDate === 'function'
        ? apmsGetAttendanceRecordForStudentDate(sid, today)
        : state.db.attendance.find(a => String(a.student_id) === String(sid) && a.date === today);
    const hwCur = typeof apmsGetHomeworkRecordForStudentDate === 'function'
        ? apmsGetHomeworkRecordForStudentDate(sid, today)
        : state.db.homework.find(h => String(h.student_id) === String(sid) && h.date === today);
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
            <div style="font-size:14px; font-weight:500; color:var(--text); margin-bottom:4px; text-align:center;">${apEscapeHtml(sname)} 학생 관리</div>
            <button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer;" onclick="setManagementReturnView({ type: 'classDetail', classId: '${cid}' }); openStudentDetail('${sid}', { mode: 'view', returnTo: { type: 'classDetail', classId: '${cid}' } })">상세 정보 열기</button>
            <button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer;" onclick="closeModal(true); if(typeof openOMR==='function') openOMR('${sid}', '단원평가', 20, '${cid}', '', '', 'class')">OMR / 성적 입력</button>
            ${plannerOn ? `<button class="btn cls-input" style="min-height:48px; justify-content:center; cursor:pointer; color:var(--primary); border-color:rgba(var(--primary-rgb),0.22);" onclick="closeModal(true); copyPlannerStudentLink('${sid}')">플래너 링크 복사</button>` : ''}
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

    if (typeof loadEnrollmentFoundation === 'function') {
        loadEnrollmentFoundation({ class_id: cid }, { silent: true }).catch(() => {});
    }

    const cls = state.db.classes.find(c => String(c.id) === String(cid));
    if (!cls) {
        document.getElementById('app-root').innerHTML = `<div class="card apms-card" style="max-width:850px; margin:0 auto; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">반 정보를 찾을 수 없습니다.</div>`;
        return;
    }

    const today = getClassroomOperationDate();
    const summary = computeClassTodaySummary(cid, today);
    const students = getClassroomActiveStudents(cid);
    const { todayAttMap, todayHwMap } = buildClassroomTodayMaps(students, today);
    const plannerEnabled = isPlannerTargetClass(cls);

    document.getElementById('app-root').innerHTML = `
        <div class="cls-fade-in cls-v4-wrap ap-classroom-shell">
            ${renderClassTopBarV4B(cls, summary, today)}
            ${renderClassToolBarV4B(cid, plannerEnabled, today)}
            <div class="cls-v4-section ap-classroom-section">
                <h3 class="apms-section-title">학생 명단</h3>
            </div>
            ${renderClassStudentBoardV4B(cid, students, todayAttMap, todayHwMap, summary.isScheduled, plannerEnabled, today)}
            ${renderClassroomMonthlyStatusBoard(cid, students, today)}
        </div>
    `;

    ensureClassroomMonthlyStatusCache(cid, today, students);

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
            <label style="display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight:500; min-width: 120px; color: var(--text); cursor: pointer; line-height: 1.5;">
                <input type="checkbox" class="record-tb-check" value="${tb.id}" data-title="${String(tb.title).replace(/"/g, '&quot;')}" ${isChecked} style="transform: scale(1.1); accent-color: var(--primary);">
                ${apEscapeHtml(tb.title)}
            </label>
            <input type="text" class="cls-input record-tb-progress" id="progress_${tb.id}" value="${progVal}" placeholder="예: p.10~25" style="flex: 1; min-height: 44px;">
        </div>`;
    }).join('') : `<div style="font-size: 12px; color: var(--secondary); padding: 24px; text-align: center; background: var(--surface-2); border-radius: 16px; font-weight:500; line-height: 1.5;">활성 교재 없음</div>`;

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
                <h4 style="margin:0;font-size:16px;font-weight:500;color:var(--text);line-height:1.3;">오늘 수업 단원 <span style="font-size:11px;font-weight:400;color:var(--secondary);">${gradeKey}</span></h4>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:6px;">${units.map(u => {
                const checked = prevSelectedUnits.indexOf(u) !== -1 ? 'checked' : '';
                return `<label style="display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:500;cursor:pointer;padding:4px 8px;border-radius:7px;border:1px solid var(--border);background:var(--surface-2);white-space:nowrap;color:var(--text);">
                    <input type="checkbox" class="record-unit-check" value="${apEscapeHtml(u)}" ${checked} style="accent-color:var(--primary);cursor:pointer;">${apEscapeHtml(u)}</label>`;
            }).join('')}</div>
        </div>`;
    }

    showModal('진도관리', `${unitsHtml}<div style="margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
                <h4 style="margin: 0; font-size: 16px; font-weight:500; color: var(--text); line-height: 1.3;">교재별 진도</h4>
                <span style="font-size: 11px; font-weight:500; color: var(--secondary); line-height: 1.5;">${todayStr}</span>
            </div>
            <div style="background: var(--surface); padding: 4px 0;">${booksHtml}</div>
        </div>
        <div style="margin-bottom: 32px;"><h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight:500; color: var(--text); line-height: 1.3;">특이사항</h4>
            <textarea id="record-special-note" class="cls-input" placeholder="수업 특이사항 메모" style="height: 100px; resize: none; padding: 14px; line-height: 1.6;">${apEscapeHtml(prevNote)}</textarea>
        </div>
        <button class="btn apms-button apms-button--primary btn-primary" style="width: 100%; min-height: 52px; padding: 14px 16px; font-size: 14px; font-weight:500; border-radius: 14px; box-shadow: none;" onclick="saveClassRecord('${cid}', '${todayStr}')">기록 저장하기</button>`);
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

    try {
        const r = await api.post('class-daily-records', payload);
        if (r?.success) { toast('저장 완료', 'success'); closeModal(true); await loadData(); renderClass(cid); return; }
        toast(r?.message || r?.error || '저장 실패', 'error');
    } catch (e) {
        console.error('[saveClassRecord] failed:', e);
        toast('저장 중 오류가 발생했습니다.', 'error');
    }
}
