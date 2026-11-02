/**
 * AP Math OS [js/ws-student-restore.js]
 * M4 퇴원생 재등원을 퇴원생 현황 목록 안에서 같은 자리로 처리한다.
 *
 * 옛 흐름: 목록 [재등원] → 모달이 "재등원 처리"로 갈아 끼워짐(목록이 사라짐) → 저장 → closeModal() → openWithdrawalReport()로 목록 재구성.
 * 새 흐름: 목록 행 아래에 반·재등원일 폼이 펼쳐지고, 저장하면 같은 목록이 그 자리에서 갱신된다.
 *
 * 저장은 student-edit.js의 handleRestore.confirm(sid)가 그대로 한다(PATCH students/:id/restore, payload class_id·reenrollment_date).
 * 이 파일은 폼 펼침만 맡는다. 입력 ID(restore-class, restore-date)와 data-student-reenrollment 표식도 그대로 둔다.
 */

function wsRestoreIsReportOpen() {
    const body = document.getElementById('modal-body');
    const overlay = document.getElementById('modal-overlay');
    return !!body && !!body.querySelector('.ap-withdrawal-report') && !!overlay
        && overlay.classList.contains('show') && !overlay.classList.contains('hidden');
}

function wsRestoreFormHtml(sid) {
    const student = (state.db.students || []).find(row => String(row.id) === String(sid));
    if (!student) return '';
    const currentClassId = (state.db.class_students || []).find(row => String(row.student_id) === String(sid))?.class_id || '';
    const selectableClasses = sortClassesForStudentModal((state.db.classes || []).filter(c => Number(c.is_active) !== 0));
    if (!selectableClasses.length) return '';
    const options = selectableClasses.map(cls => `
        <option value="${studentAttr(cls.id)}" ${String(cls.id) === String(currentClassId) ? 'selected' : ''}>${apEscapeHtml(apmsGetClassOptionDisplayLabel(cls, selectableClasses))}</option>
    `).join('');
    const today = getTodayKstDateText();
    return `
        <div class="ws-restore" data-student-reenrollment="${studentAttr(sid)}" data-ws-restore-inline>
            <div class="ws-restore__note">${apEscapeHtml(student.name || '학생')} · 기존 PIN, 상담·수업·시험·결제 이력은 유지되고 새 수강 기간이 시작됩니다.</div>
            <div class="ws-restore__grid">
                <div>
                    <label class="apms-unified-label" for="restore-class">재등원 반</label>
                    <select id="restore-class" class="btn apms-unified-control"><option value="">반 선택</option>${options}</select>
                </div>
                <div>
                    <label class="apms-unified-label" for="restore-date">재등원일</label>
                    <input id="restore-date" type="date" class="btn apms-unified-control" value="${studentAttr(today)}" max="${studentAttr(today)}">
                </div>
            </div>
            <div class="ws-restore__actions">
                <button type="button" class="btn apms-button apms-button--quiet" onclick="wsRestoreCloseInline()">접기</button>
                <button type="button" class="btn apms-button apms-button--primary btn-primary" data-ws-restore-save onclick="handleRestore.confirm(${wsClassArg(sid)})">재등원 처리</button>
            </div>
        </div>`;
}

function wsRestoreCloseInline() {
    document.querySelectorAll('#modal-body .ws-restore').forEach(el => el.remove());
}

// 목록의 [재등원]: 해당 행 아래 폼을 펼친다. 같은 행을 다시 누르면 접는다.
function wsRestoreToggleInline(sid) {
    if (typeof restoreStudentSubmitting !== 'undefined' && restoreStudentSubmitting) {
        toast('다른 학생의 재등원 처리가 진행 중입니다.', 'info');
        return true;
    }
    const row = Array.from(document.querySelectorAll('#modal-body .ap-withdrawal-row'))
        .find(el => String(el.getAttribute('data-student-id')) === String(sid));
    if (!row) return false;
    const existing = row.querySelector('.ws-restore');
    wsRestoreCloseInline();
    if (existing) return true;
    const student = (state.db.students || []).find(s => String(s.id) === String(sid));
    if (!student) { toast('학생 정보를 찾을 수 없습니다.', 'error'); return true; }
    const html = wsRestoreFormHtml(sid);
    if (!html) { toast('재등원할 활성 반이 없습니다.', 'warn'); return true; }
    row.insertAdjacentHTML('beforeend', html);
    const select = row.querySelector('#restore-class');
    if (select && typeof select.scrollIntoView === 'function') select.scrollIntoView({ block: 'nearest' });
    if (select && typeof select.focus === 'function') select.focus({ preventScroll: true });
    return true;
}

// 저장이 끝난 뒤 같은 목록을 그 자리에서 다시 그린다(모달을 닫았다 열지 않는다).
function wsRestoreAfterSave() {
    if (typeof renderWithdrawalReportModal === 'function') renderWithdrawalReportModal();
}
