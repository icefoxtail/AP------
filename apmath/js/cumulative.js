/**
 * AP Math OS [cumulative.js] - 성적표 업데이트
 * 변경사항:
 * - 그룹 헤더 행 삭제, 학년 첫 행에만 표시
 * - 정렬: 기본순 / 학년별 성적순 (이름순 삭제)
 * - 기본순: 반 평균 + 학년 평균 행
 * - 학년별 성적순: 학년 평균 행만
 * - 학년 내 등수 표시
 * - ▲▼ 직전 학기 대비
 * - 모바일 sticky 열 겹침 해결 (학년+반+이름 3열 유지, 너비 최적화)
 */

// ─────────────────────────────────────────────
// 헬퍼: 직전 학기 컬럼 키 반환
// ─────────────────────────────────────────────
function getPrevSebColKey(key) {
    // 순서: 1H-mid → (없음), 1H-fin → 1H-mid, 2H-mid → 1H-fin, 2H-fin → 2H-mid
    const order = ['1H-mid', '1H-fin', '2H-mid', '2H-fin'];
    const idx = order.indexOf(key);
    return idx > 0 ? order[idx - 1] : null;
}

// ─────────────────────────────────────────────
// 헬퍼: 학생의 특정 컬럼 점수 반환 (없으면 null)
// ─────────────────────────────────────────────
function getSebScore(studentId, year, colKey) {
    const col = SEB_COLS.find(c => c.key === colKey);
    if (!col) return null;
    const rec = getSebExamRecord(studentId, year, col.semester, col.examType);
    if (!rec || rec.score === null || rec.score === undefined || rec.score === '') return null;
    return Number(rec.score);
}

// ─────────────────────────────────────────────
// 헬퍼: 점수 배열 평균 (소수점 1자리)
// ─────────────────────────────────────────────
function calcAvg(scores) {
    const valid = scores.filter(s => s !== null && Number.isFinite(s));
    if (!valid.length) return null;
    return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length * 10) / 10;
}

// ─────────────────────────────────────────────
// ▲▼ HTML 생성
// ─────────────────────────────────────────────
function buildTrendHtml(curr, prev) {
    if (curr === null || prev === null) return '';
    const diff = curr - prev;
    if (diff === 0) return '';
    const color = diff > 0 ? 'var(--success)' : '#e53935';
    const arrow = diff > 0 ? '▲' : '▼';
    return `<div style="font-size:10px;font-weight:700;color:${color};line-height:1.2;margin-top:1px;">${arrow}${Math.abs(diff)}</div>`;
}

// ─────────────────────────────────────────────
// 점수 셀 HTML (등수 + ▲▼ 포함)
// ─────────────────────────────────────────────
function buildSebScoreCell(score, rank, trendHtml, borderClass) {
    const scoreText = score === null ? '<span style="color:var(--border);font-size:12px;">-</span>'
        : `<span style="font-size:14px;font-weight:700;color:var(--text);">${score}</span>`;
    const rankHtml = (rank !== null && score !== null)
        ? `<div style="font-size:10px;font-weight:600;color:var(--secondary);line-height:1.2;">${rank}등</div>`
        : '';
    return `<td${borderClass ? ` class="${borderClass}"` : ''} style="text-align:center;padding:4px 2px;">
        ${scoreText}${rankHtml}${trendHtml}
    </td>`;
}

// ─────────────────────────────────────────────
// 평균 행 HTML
// ─────────────────────────────────────────────
function buildSebAvgRow(label, students, year, isGradeAvg) {
    const bg = isGradeAvg ? 'rgba(26,92,255,0.06)' : 'rgba(0,0,0,0.03)';
    const fontWeight = isGradeAvg ? '700' : '700';
    const fontSize = isGradeAvg ? '12px' : '11px';
    const cols = SEB_COLS.map((col, i) => {
        const scores = students.map(s => getSebScore(s.id, year, col.key)).filter(s => s !== null);
        const avg = calcAvg(scores);
        const borderClass = (i === 0 || i === 2) ? 'seb-border2' : '';
        const text = avg !== null ? avg : '<span style="color:var(--border);font-size:12px;">-</span>';
        return `<td${borderClass ? ` class="${borderClass}"` : ''} style="text-align:center;background:${bg};padding:4px 2px;">
            <span style="font-size:${fontSize};font-weight:${fontWeight};color:var(--secondary);">${text}</span>
        </td>`;
    }).join('');
    return `<tr>
        <td class="seb-sticky-g" style="background:${bg};font-size:11px;font-weight:700;color:var(--secondary);"></td>
        <td class="seb-sticky-c" style="background:${bg};font-size:11px;font-weight:700;color:var(--secondary);"></td>
        <td class="seb-sticky-n" style="background:${bg};font-size:${fontSize};font-weight:${fontWeight};color:var(--secondary);text-align:center;">${label}</td>
        ${cols}
    </tr>`;
}

// ─────────────────────────────────────────────
// openSchoolExamLedger (정렬 옵션 변경)
// ─────────────────────────────────────────────
function openSchoolExamLedger() {
    var currentYear = new Date().getFullYear();
    var isAdmin = !!(state.auth && state.auth.role === 'admin');
    if (!isAdmin) state.ui.schoolExamTeacher = '';
    if (!state.ui.schoolExamYear) state.ui.schoolExamYear = currentYear;
    if (!state.ui.schoolExamSection) state.ui.schoolExamSection = 'middle';
    if (!state.ui.schoolExamClassId) state.ui.schoolExamClassId = '';
    if (!state.ui.schoolExamTeacher) state.ui.schoolExamTeacher = '';
    if (!state.ui.schoolExamSort) state.ui.schoolExamSort = 'default';
    if (!state.ui.schoolExamSortCol) state.ui.schoolExamSortCol = '1H-mid';
    var root = document.getElementById('app-root');
    if (!root) return;
    var section = state.ui.schoolExamSection;
    var sort = state.ui.schoolExamSort;
    var sortCol = state.ui.schoolExamSortCol;
    var year = Number(state.ui.schoolExamYear) || currentYear;
    var teacherFilter = state.ui.schoolExamTeacher;
    var activeClasses = sortCumulativeClasses((state.db.classes || []).filter(function(c) { return Number(c.is_active) !== 0; }));
    var sectionClasses = activeClasses.filter(function(c) {
        var isHigh = /고1|고2|고3/.test(String(c.grade || '') + ' ' + String(c.name || ''));
        return section === 'high' ? isHigh : !isHigh;
    });
    var filteredClasses = teacherFilter ? sectionClasses.filter(function(c) { return c.teacher_name === teacherFilter; }) : sectionClasses;
    var classOptions = '<option value="">전체</option>' + filteredClasses.map(function(c) {
        return '<option value="' + apEscapeHtml(c.id) + '"' + (String(c.id) === String(state.ui.schoolExamClassId) ? ' selected' : '') + '>' + apEscapeHtml(c.name) + '</option>';
    }).join('');
    var yearOptions = Array.from({length: 5}, function(_, i) { return currentYear - 2 + i; }).map(function(y) {
        return '<option value="' + y + '"' + (y === year ? ' selected' : '') + '>' + y + '</option>';
    }).join('');
    var teacherHtml = '';
    if (isAdmin) {
        var teachers = []; var seen = {};
        (state.db.classes || []).forEach(function(c) { var t = c.teacher_name || ''; if (t && !seen[t]) { seen[t] = true; teachers.push(t); } });
        teachers.sort();
        var tOpts = '<option value="">전체 선생님</option>' + teachers.map(function(t) { return '<option value="' + apEscapeHtml(t) + '"' + (t === teacherFilter ? ' selected' : '') + '>' + apEscapeHtml(t) + '</option>'; }).join('');
        teacherHtml = '<select class="seb-ctrl" id="seb-teacher" onchange="state.ui.schoolExamTeacher=this.value;state.ui.schoolExamClassId=\'\';openSchoolExamLedger()">' + tOpts + '</select>';
    }

    // 정렬 컬럼 드롭다운 표시 여부
    const showSortCol = sort === 'score-desc';

    root.innerHTML = `
<style>
#seb-main { width: 100%; max-width: 850px; margin: 0 auto; height: calc(100vh - 56px); display: flex; flex-direction: column; padding: 16px 16px 0; box-sizing: border-box; }
.seb-ctrl { height: 44px; min-height: 44px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer; }
#seb-body { flex: 1; overflow: auto; background: var(--surface); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 12px; }
#seb-tbl { border-collapse: collapse; width: 100%; min-width: 100%; table-layout: fixed; background: var(--surface); }
#seb-tbl th { position: sticky; top: 0; background: var(--surface); z-index: 2; font-size: 12px; font-weight: 700; color: var(--secondary); padding: 10px 3px; text-align: center; white-space: nowrap; box-shadow: 0 1px 0 var(--border); }
#seb-tbl td { padding: 5px 2px; border-bottom: 1px solid var(--border); vertical-align: middle; text-align: center; }
/* sticky 열: 학년(28px) + 반(52px) + 이름(68px) → 모바일 최적화 */
.seb-sticky-g { position: sticky; left: 0; z-index: 1; background: var(--surface); width: 28px; min-width: 28px; max-width: 28px; font-size: 11px; font-weight: 700; color: var(--secondary); text-align: center; border-right: 1px solid var(--border); }
.seb-sticky-c { position: sticky; left: 28px; z-index: 1; background: var(--surface); width: 52px; min-width: 52px; max-width: 52px; font-size: 11px; font-weight: 700; color: var(--primary); text-align: center; border-right: 1px solid var(--border); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.seb-sticky-n { position: sticky; left: 80px; z-index: 1; background: var(--surface); width: 64px; min-width: 64px; max-width: 64px; font-size: 13px; font-weight: 700; color: var(--text); padding: 6px 4px; border-right: 1px solid var(--border); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: center; }
#seb-tbl thead .seb-sticky-g, #seb-tbl thead .seb-sticky-c, #seb-tbl thead .seb-sticky-n { z-index: 3; }
.seb-inp { width: 54px; max-width: 100%; height: 38px; padding: 0 4px; border-radius: 10px; border: 1px solid var(--border); background: var(--surface-2); color: var(--text); font-size: 14px; font-weight: 700; text-align: center; font-family: inherit; box-sizing: border-box; }
.seb-inp:focus { outline: none; border-color: var(--primary); background: var(--surface); }
.seb-tab-wrap { display: flex; gap: 4px; background: var(--surface-2); padding: 4px; border-radius: 14px; }
.seb-tab { flex: 1; height: 40px; border: none; border-radius: 10px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.seb-tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
.seb-tab:not(.active) { background: transparent; color: var(--secondary); }
.seb-border2 { border-left: 2px solid rgba(0,0,0,0.08) !important; }
/* 학년 변경 구분선 */
.seb-grade-divider td { border-top: 2px solid rgba(0,0,0,0.08) !important; }
</style>
<div id="seb-main">
  <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px;flex-shrink:0;">
    <div style="font-size:20px;font-weight:700;color:var(--text);letter-spacing:-0.5px;cursor:pointer;white-space:nowrap;" onclick="closeSchoolExamLedger()">성적표</div>
    <div style="display:flex;align-items:center;gap:8px;">
      <select class="seb-ctrl" id="seb-yr" style="width:86px;" onchange="state.ui.schoolExamYear=Number(this.value);renderSchoolExamBatchTable()">${yearOptions}</select>
      <button class="btn" id="seb-save-btn" onclick="saveSchoolExamBatch()" style="height:44px;min-height:44px;padding:0 16px;border-radius:12px;font-size:13px;font-weight:700;background:var(--surface);color:var(--text);border:1px solid var(--border);box-shadow:none;">전체 저장</button>
    </div>
  </div>
  <div class="seb-tab-wrap" style="margin-bottom:10px;flex-shrink:0;">
    <button class="seb-tab ${section === 'middle' ? 'active' : ''}" onclick="state.ui.schoolExamSection='middle';state.ui.schoolExamClassId='';openSchoolExamLedger()">중등</button>
    <button class="seb-tab ${section === 'high' ? 'active' : ''}" onclick="state.ui.schoolExamSection='high';state.ui.schoolExamClassId='';openSchoolExamLedger()">고등</button>
  </div>
  <div style="display:flex;gap:8px;margin-bottom:10px;flex-shrink:0;flex-wrap:wrap;">
    ${teacherHtml}
    <select class="seb-ctrl" id="seb-cls" style="flex:2;" onchange="state.ui.schoolExamClassId=this.value;renderSchoolExamBatchTable()">${classOptions}</select>
    <select class="seb-ctrl" id="seb-sort" style="flex:1;" onchange="state.ui.schoolExamSort=this.value;_sebToggleSortCol();renderSchoolExamBatchTable()">
      <option value="default"${sort === 'default' ? ' selected' : ''}>기본순</option>
      <option value="score-desc"${sort === 'score-desc' ? ' selected' : ''}>학년별 성적순</option>
    </select>
    <select class="seb-ctrl" id="seb-sort-col" style="flex:1;display:${showSortCol ? 'block' : 'none'};" onchange="state.ui.schoolExamSortCol=this.value;renderSchoolExamBatchTable()">
      <option value="1H-mid"${sortCol === '1H-mid' ? ' selected' : ''}>1학기 중간</option>
      <option value="1H-fin"${sortCol === '1H-fin' ? ' selected' : ''}>1학기 기말</option>
      <option value="2H-mid"${sortCol === '2H-mid' ? ' selected' : ''}>2학기 중간</option>
      <option value="2H-fin"${sortCol === '2H-fin' ? ' selected' : ''}>2학기 기말</option>
    </select>
  </div>
  <div id="seb-body"><div id="seb-tbl-root"></div></div>
</div>`;
    renderSchoolExamBatchTable();
}

// ─────────────────────────────────────────────
// renderSchoolExamBatchTable (전면 개편)
// ─────────────────────────────────────────────
function renderSchoolExamBatchTable() {
    var root = document.getElementById('seb-tbl-root');
    if (!root) return;
    var year = Number(state.ui.schoolExamYear) || new Date().getFullYear();
    var sort = state.ui.schoolExamSort || 'default';
    var sortColKey = state.ui.schoolExamSortCol || '1H-mid';
    var students = getSebVisibleStudents();
    if (!students.length) {
        root.innerHTML = '<div style="padding:48px;text-align:center;color:var(--secondary);font-size:14px;font-weight:600;">표시할 학생이 없습니다.</div>';
        return;
    }

    // 헤더
    var hRow1 = '<th rowspan="2" class="seb-sticky-g">학년</th>'
        + '<th rowspan="2" class="seb-sticky-c">반</th>'
        + '<th rowspan="2" class="seb-sticky-n">이름</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(26,92,255,0.03);">1학기</th>'
        + '<th colspan="2" class="seb-border2" style="padding:8px;background:rgba(5,150,105,0.03);">2학기</th>';
    var hRow2 = '<th class="seb-border2" style="background:rgba(26,92,255,0.03);">중간</th>'
        + '<th style="background:rgba(26,92,255,0.03);">기말</th>'
        + '<th class="seb-border2" style="background:rgba(5,150,105,0.03);">중간</th>'
        + '<th style="background:rgba(5,150,105,0.03);">기말</th>';

    var bodyRows = '';
    var gradeOrder = ['중1','중2','중3','고1','고2','고3'];

    // 학년별 그룹핑
    var byGrade = {};
    students.forEach(function(s) {
        var g = String(s.grade || '기타');
        if (!byGrade[g]) byGrade[g] = [];
        byGrade[g].push(s);
    });

    gradeOrder.forEach(function(grade, gradeIdx) {
        var gradeStudents = byGrade[grade];
        if (!gradeStudents || !gradeStudents.length) return;

        // ── 학년별 성적순 정렬 ──
        if (sort === 'score-desc') {
            gradeStudents = gradeStudents.slice().sort(function(a, b) {
                var sa = getSebScore(a.id, year, sortColKey);
                var sb = getSebScore(b.id, year, sortColKey);
                if (sa === null && sb === null) return 0;
                if (sa === null) return 1;
                if (sb === null) return -1;
                return sb - sa;
            });

            // 학년 내 등수 계산 (동점 처리: 동점이면 같은 등수, 다음 등수는 건너뜀)
            var rankMap = {};
            var prevScore = null, prevRank = 0, sameCount = 0;
            gradeStudents.forEach(function(s, idx) {
                var sc = getSebScore(s.id, year, sortColKey);
                if (sc === null) { rankMap[s.id] = null; return; }
                if (sc === prevScore) { sameCount++; rankMap[s.id] = prevRank; }
                else { prevRank = prevRank + sameCount + 1; sameCount = 0; prevScore = sc; rankMap[s.id] = prevRank; }
            });

            var isFirstGrade = Object.keys(byGrade).filter(g => byGrade[g] && byGrade[g].length).indexOf(grade) === 0;

            gradeStudents.forEach(function(s, idx) {
                var isFirstInGrade = idx === 0;
                var gradeText = isFirstInGrade ? grade : '';
                var dividerClass = isFirstInGrade && !isFirstGrade ? ' seb-grade-divider' : '';

                var cols = SEB_COLS.map(function(col, ci) {
                    var score = getSebScore(s.id, year, col.key);
                    var rank = col.key === sortColKey ? rankMap[s.id] : null;
                    var prevKey = getPrevSebColKey(col.key);
                    var prevScore2 = prevKey ? getSebScore(s.id, year, prevKey) : null;
                    var trendHtml = buildTrendHtml(score, prevScore2);
                    var borderClass = (ci === 0 || ci === 2) ? 'seb-border2' : '';

                    // 읽기 전용 표시 (성적순 정렬 시에도 입력 가능)
                    var val = score !== null ? score : '';
                    var scoreDisplay = score !== null
                        ? `<span style="font-size:14px;font-weight:700;color:var(--text);">${score}</span>`
                        : `<span style="color:var(--border);font-size:12px;">-</span>`;
                    var rankHtml = (rank !== null && score !== null)
                        ? `<div style="font-size:10px;font-weight:600;color:var(--secondary);line-height:1.2;">${rank}등</div>`
                        : '';
                    return `<td${borderClass ? ` class="${borderClass}"` : ''} style="text-align:center;padding:4px 2px;">
                        <input type="number" class="seb-inp" id="seb-inp-${s.id}-${col.key}" value="${val}" min="0" max="100">
                        ${rankHtml}${trendHtml}
                    </td>`;
                }).join('');

                bodyRows += `<tr class="${dividerClass}">
                    <td class="seb-sticky-g" style="font-size:11px;font-weight:700;color:var(--secondary);">${apEscapeHtml(gradeText)}</td>
                    <td class="seb-sticky-c"></td>
                    <td class="seb-sticky-n">${apEscapeHtml(s.name)}</td>
                    ${cols}
                </tr>`;
            });

            // 학년 평균 행
            bodyRows += buildSebAvgRow('평균', gradeStudents, year, true);

        // ── 기본순 ──
        } else {
            // 반별 그룹핑
            var byClass = {}, classOrder = [];
            gradeStudents.forEach(function(s) {
                var cid = getCumulativeClassIdForStudent(s.id);
                var cn = getCumulativeClassName(cid) || '미배정';
                if (!byClass[cn]) { byClass[cn] = []; classOrder.push(cn); }
                byClass[cn].push(s);
            });

            // 반 오름차순
            classOrder.sort(function(a, b) {
                return String(a || '').localeCompare(String(b || ''), 'ko', { numeric: true });
            });

            var isFirstGrade2 = Object.keys(byGrade).filter(g => byGrade[g] && byGrade[g].length).indexOf(grade) === 0;
            var gradeFirstRow = true;

            classOrder.forEach(function(cn, clsIdx) {
                // 이름 오름차순
                var clsStudents = (byClass[cn] || []).slice().sort(function(a, b) {
                    return String(a.name || '').localeCompare(String(b.name || ''), 'ko', { numeric: true });
                });
                var classFirstRow = true;

                clsStudents.forEach(function(s, idx) {
                    var isFirstInGrade = gradeFirstRow;
                    var isFirstInClass = classFirstRow;
                    var gradeText = isFirstInGrade ? grade : '';
                    var classText = isFirstInClass ? cn : '';
                    var dividerClass = isFirstInGrade && !isFirstGrade2 ? ' seb-grade-divider' : '';

                    gradeFirstRow = false;
                    classFirstRow = false;

                    var cols = SEB_COLS.map(function(col, ci) {
                        var score = getSebScore(s.id, year, col.key);
                        var prevKey = getPrevSebColKey(col.key);
                        var prevScore3 = prevKey ? getSebScore(s.id, year, prevKey) : null;
                        var trendHtml = buildTrendHtml(score, prevScore3);
                        var borderClass = (ci === 0 || ci === 2) ? 'seb-border2' : '';
                        var val = score !== null ? score : '';
                        return `<td${borderClass ? ` class="${borderClass}"` : ''} style="text-align:center;padding:4px 2px;">
                            <input type="number" class="seb-inp" id="seb-inp-${s.id}-${col.key}" value="${val}" min="0" max="100">
                            ${trendHtml}
                        </td>`;
                    }).join('');

                    bodyRows += `<tr class="${dividerClass}">
                        <td class="seb-sticky-g" style="font-size:11px;font-weight:700;color:var(--secondary);">${apEscapeHtml(gradeText)}</td>
                        <td class="seb-sticky-c">${apEscapeHtml(classText)}</td>
                        <td class="seb-sticky-n">${apEscapeHtml(s.name)}</td>
                        ${cols}
                    </tr>`;
                });

                // 반 평균 행
                bodyRows += buildSebAvgRow('반평균', clsStudents, year, false);
            });

            // 학년 평균 행
            bodyRows += buildSebAvgRow('학년평균', gradeStudents, year, true);
        }
    });

    root.innerHTML = `<table id="seb-tbl">
        <thead>
            <tr>${hRow1}</tr>
            <tr>${hRow2}</tr>
        </thead>
        <tbody>${bodyRows || '<tr><td colspan="7" style="padding:32px;text-align:center;color:var(--secondary);">학생 없음</td></tr>'}</tbody>
    </table>`;
}

// _sebToggleSortCol: 학년별 성적순일 때만 컬럼 선택 표시
function _sebToggleSortCol() {
    var el = document.getElementById('seb-sort-col');
    var sortEl = document.getElementById('seb-sort');
    if (el && sortEl) el.style.display = sortEl.value === 'score-desc' ? 'block' : 'none';
}
