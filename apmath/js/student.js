/**
 * AP Math OS 1.0 [js/student.js]
 * 학생 관리 및 프로필 관제 홈
 * [Fixed Standard UI]: Typography(Fixed) & Spacing(Fixed) 전면 적용본
 */

// [UI Standard]: 공통 스타일 주입 (고정 규격 반영)
function injectStudentStyles() {
    const existingStyle = document.getElementById('student-detail-style');
    if (existingStyle && String(existingStyle.textContent || '').includes('ap-student-grade-subtabs')) return;
    if (existingStyle) existingStyle.remove();
    const style = document.createElement('style');
    style.id = 'student-detail-style';
    style.textContent = `
        /* apms-edit-form-v2 */
        .std-tab-content { animation: stdFadeIn 0.25s ease-out; }
        @keyframes stdFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .std-badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight:500; line-height: 1.5; }
        .std-input-base { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 500; line-height: 1.4; }
        .apms-eie-detail { display:flex; flex-direction:column; gap:14px; padding:0 14px 4px; box-sizing:border-box; }
        .apms-eie-detail-head { display:flex; justify-content:space-between; align-items:flex-start; gap:14px; }
        .apms-eie-detail-head h1 { margin:0; font-size:24px; font-weight:700; color:var(--text); letter-spacing:-0.55px; line-height:1.16; }
        .apms-eie-head-badges,
        .apms-eie-detail-actions,
        .apms-eie-tabs { display:flex; flex-wrap:wrap; gap:7px; }
        .apms-eie-head-badges { margin-top:10px; }
        .apms-eie-pill,
        .apms-eie-status { display:inline-flex; align-items:center; min-height:24px; padding:3px 9px; border:1px solid var(--border); border-radius:999px; background:var(--surface-2); color:var(--secondary); font-size:11px; font-weight:600; line-height:1.2; }
        .apms-eie-status.is-active { border-color:rgba(16,185,129,.22); background:rgba(16,185,129,.10); color:#047857; }
        .apms-eie-status.is-leave { border-color:rgba(245,158,11,.24); background:rgba(245,158,11,.10); color:#92400E; }
        .apms-eie-status.is-archived { border-color:rgba(232,65,79,.20); background:rgba(232,65,79,.08); color:var(--error); }
        .apms-eie-detail-actions { align-items:center; justify-content:flex-end; }
        .apms-eie-primary,
        .apms-eie-secondary,
        .apms-eie-danger { min-height:40px; padding:0 14px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; width:auto; box-shadow:none; }
        .apms-eie-primary { border:1px solid var(--primary); background:var(--primary); color:#fff; }
        .apms-eie-secondary { border:1px solid var(--border); background:var(--surface); color:var(--text); }
        .apms-eie-danger { border:1px solid rgba(232,65,79,.22); background:rgba(232,65,79,.06); color:var(--error); }
        .apms-eie-profile-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
        .apms-eie-card { border:1px solid var(--border); border-radius:14px; background:var(--surface); padding:14px; box-shadow:0 4px 14px rgba(15,23,42,.035); }
        body.dark .apms-eie-card { box-shadow:none; }
        .apms-eie-section-head { display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:12px; }
        .apms-eie-section-head h3 { margin:0; font-size:15px; font-weight:700; color:var(--text); line-height:1.25; }
        .apms-eie-section-head span { color:var(--secondary); font-size:11px; font-weight:600; }
        .apms-eie-field-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .apms-eie-field,
        .apms-eie-note,
        .apms-eie-contact-row { border:1px solid var(--border); border-radius:12px; background:var(--surface-2); padding:11px 12px; min-width:0; }
        .apms-eie-field span,
        .apms-eie-note span,
        .apms-eie-contact-row span { display:block; color:var(--secondary); font-size:11px; font-weight:600; line-height:1.25; }
        .apms-eie-field strong,
        .apms-eie-contact-row strong { display:block; margin-top:4px; color:var(--text); font-size:13px; font-weight:700; line-height:1.35; overflow-wrap:anywhere; }
        .apms-eie-contact-row { display:flex; justify-content:space-between; align-items:center; gap:12px; margin-top:8px; }
        .apms-eie-contact-row button { width:auto; min-height:34px; padding:0 10px; border-radius:10px; border:1px solid var(--border); background:var(--surface); color:var(--text); font-size:12px; font-weight:600; cursor:pointer; }
        .apms-eie-note { margin-top:8px; }
        .apms-eie-note p { margin:5px 0 0; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6; white-space:pre-wrap; }
        .apms-eie-tabs { padding:0; border-radius:0; background:transparent; gap:4px; border-bottom:1px solid var(--border); flex-wrap:nowrap; }
        .apms-eie-tab { flex:1 1 0; min-height:37px; border:0; border-bottom:2px solid transparent; border-radius:0; background:transparent; color:#94A3B8; font-size:12.5px; font-weight:600; cursor:pointer; margin-bottom:-1px; }
        .apms-eie-tab.is-active { background:transparent; color:#1F2937; border-bottom-color:#334155; box-shadow:none; }
        body.dark .apms-eie-tab { color:var(--secondary); }
        body.dark .apms-eie-tab.is-active { color:var(--text); border-bottom-color:var(--text); box-shadow:none; }
        .apms-eie-form { display:flex; flex-direction:column; gap:10px; padding:0 14px 4px; box-sizing:border-box; }
        .apms-eie-form-card { border:1px solid var(--border); border-radius:10px; background:var(--surface); padding:12px; box-shadow:none; }
        body.dark .apms-eie-form-card { box-shadow:none; }
        .apms-eie-form-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
        .apms-eie-form-head h3 { margin:0; color:var(--text); font-size:13.5px; font-weight:600; line-height:1.25; }
        .apms-eie-form-head span { color:var(--secondary); font-size:11px; font-weight:600; }
        .apms-eie-form-grid { display:grid; grid-template-columns:1fr; gap:8px; }
        /* 보기모드 .ap-profile-info-row와 같은 가로 배치(label 88px + 값) — 모드 전환 시 레이아웃 점프 최소화 */
        .apms-eie-form-field { min-width:0; width:100%; display:flex !important; flex-direction:row !important; align-items:center !important; gap:10px; }
        .apms-eie-form-field.is-wide,
        .apms-eie-form-wide { grid-column:1 / -1; }
        .apms-eie-form-field > span,
        .apms-eie-form-label { display:block; flex:0 0 88px; color:var(--secondary); font-size:12px; font-weight:600; line-height:1.25; }
        .apms-eie-form-field input,
        .apms-eie-form-field select,
        .apms-eie-form-field textarea { display:block !important; flex:1 1 auto; width:auto !important; min-width:0 !important; max-width:100% !important; min-height:38px; box-sizing:border-box; border:1px solid var(--border); border-radius:8px; background:var(--surface-2); color:var(--text); padding:8px 12px; font:inherit; font-size:13px; font-weight:500; outline:0; }
        .apms-eie-form-field textarea { min-height:92px; resize:vertical; }
        .apms-eie-form-field.is-wide { align-items:flex-start !important; }
        .apms-eie-form-field.is-wide > span { padding-top:10px; }
        .apms-eie-form-flags { display:flex; flex-wrap:wrap; gap:8px; }
        .apms-eie-form-flag { display:inline-flex; align-items:center; gap:7px; min-height:38px; padding:0 12px; border:1px solid var(--border); border-radius:999px; background:var(--surface-2); color:var(--text); font-size:13px; font-weight:600; cursor:pointer; }
        .apms-eie-form-flag input { width:15px; height:15px; accent-color:#6E66C9; cursor:pointer; }
        .apms-eie-form-flag.is-warn input { accent-color:#D97706; }
        .apms-eie-form-danger { width:100%; min-height:44px; border:1px solid rgba(232,65,79,.22); background:rgba(232,65,79,.06); color:var(--error); border-radius:10px; font-size:13px; font-weight:700; cursor:pointer; }
        .apms-eie-form-drawer { border:1px solid var(--border); border-radius:10px; background:var(--surface); overflow:hidden; }
        .apms-eie-form-drawer summary { min-height:42px; display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0 12px; cursor:pointer; color:var(--text); font-size:13px; font-weight:700; list-style:none; }
        .apms-eie-form-drawer summary::-webkit-details-marker { display:none; }
        .apms-eie-form-drawer summary::after { content:'보기'; color:var(--secondary); font-size:12px; font-weight:650; }
        .apms-eie-form-drawer[open] summary::after { content:'접기'; }
        .apms-eie-form-drawer-body { display:flex; flex-direction:column; gap:12px; padding:0 14px 14px; }
        .ap-student-detail-shell { display:flex; flex-direction:column; gap:14px; padding:0 14px 4px; box-sizing:border-box; }
        .ap-student-profile-head { position:sticky; top:0; z-index:24; display:grid; grid-template-columns:minmax(0,1fr) auto; align-items:center; gap:12px; padding:12px 4px 12px; border:0; border-bottom:1px solid var(--border); border-radius:0; background:var(--bg); box-shadow:none; overflow:hidden; }
        .ap-student-profile-head.is-edit { grid-template-columns:minmax(0,1fr); }
        body.dark .ap-student-profile-head { background:var(--bg); box-shadow:none; }
        .ap-student-head-main { min-width:0; display:flex; flex-direction:column; gap:5px; overflow:hidden; }
        .ap-student-head-title { display:flex; align-items:center; gap:8px; min-width:0; }
        .ap-student-head-title h1 { margin:0; font-size:18px; font-weight:700; color:#1F2937; line-height:1.2; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        body.dark .ap-student-head-title h1 { color:var(--text); }
        .ap-student-head-main h1 { margin:0; font-size:18px; font-weight:700; color:#1F2937; line-height:1.2; }
        .ap-student-status-dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:#94A3B8; flex:0 0 auto; }
        .ap-student-status-dot.is-active { background:#1D9E75; }
        .ap-student-status-dot.is-leave { background:#D97706; }
        .ap-student-status-dot.is-archived { background:#E8414F; }
        .ap-student-status-text { font-size:12px; font-weight:600; color:#64748B; white-space:nowrap; }
        .ap-student-status-text.is-active { color:#1D9E75; }
        .ap-student-status-text.is-leave { color:#D97706; }
        .ap-student-status-text.is-archived { color:#E8414F; }
        .ap-student-meta-line { font-size:12.5px; font-weight:500; color:#64748B; line-height:1.4; overflow-wrap:anywhere; }
        .ap-student-head-actions { display:flex; flex-wrap:wrap; gap:7px; justify-content:flex-end; align-items:flex-start; }
        .ap-student-edit-btn { height:28px; padding:0 10px; border:1px solid #CBD5E1; background:#F8FAFC; color:#334155; border-radius:7px; font-size:12px; font-weight:600; cursor:pointer; white-space:nowrap; }
        body.dark .ap-student-edit-btn { background:var(--surface-2); border-color:var(--border); color:var(--text); }
        .ap-student-consult-pinned,
        .ap-student-card { border:1px solid var(--border); border-radius:10px; background:var(--surface); padding:12px; box-shadow:none; }
        body.dark .ap-student-consult-pinned,
        body.dark .ap-student-card { box-shadow:none; }
        .ap-student-section-head { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:10px; }
        .ap-student-section-head h3 { margin:0; color:var(--text); font-size:13.5px; font-weight:600; line-height:1.25; }
        .ap-student-section-head span { color:var(--secondary); font-size:11px; font-weight:600; }
        .ap-student-consult-date-row { display:flex; gap:6px; overflow-x:auto; padding-bottom:2px; margin-bottom:10px; }
        .ap-student-consult-date-btn { flex:0 0 auto; height:28px; min-height:28px; padding:0 10px; border:1px solid var(--ap-border); border-radius:var(--ap-radius-sm); background:var(--ap-surface-2); color:var(--ap-text-soft); font-size:12px; font-weight:650; line-height:1.2; cursor:pointer; display:inline-flex; align-items:center; white-space:nowrap; }
        .ap-student-consult-date-btn.is-active { border-color:rgba(110,102,201,.38); background:rgba(110,102,201,.10); color:var(--ap-purple); }
        .ap-profile-info-list { display:flex; flex-direction:column; }
        .ap-profile-info-row { display:flex; align-items:flex-start; gap:10px; min-height:32px; padding:6px 0; border-bottom:1px solid var(--ap-border); }
        .ap-profile-info-row:last-child { border-bottom:0; }
        .ap-profile-info-label { flex:0 0 88px; color:var(--ap-muted); font-size:12px; font-weight:600; line-height:1.4; }
        .ap-profile-info-value { flex:1 1 auto; min-width:0; color:var(--ap-text); font-size:13px; font-weight:500; line-height:1.45; overflow-wrap:anywhere; white-space:pre-wrap; }
        .ap-profile-info-value.is-muted { color:var(--ap-muted); }
        /* edit mode도 보기모드의 label-value 리스트 골격을 그대로 사용한다. */
        .ap-student-edit-body { display:flex; flex-direction:column; gap:10px; }
        .ap-student-edit-list { display:flex; flex-direction:column; }
        .ap-student-edit-row { display:flex; align-items:center; gap:10px; min-height:32px; padding:6px 0; border-bottom:1px solid var(--ap-border); }
        .ap-student-edit-row:last-child { border-bottom:0; }
        .ap-student-edit-row.is-wide { align-items:flex-start; }
        .ap-student-edit-label { flex:0 0 88px; color:var(--ap-muted); font-size:12px; font-weight:600; line-height:1.4; padding-top:0; }
        .ap-student-edit-row.is-wide .ap-student-edit-label { padding-top:8px; }
        .ap-student-edit-control { flex:1 1 auto; min-width:0; display:flex; align-items:center; gap:6px; }
        .ap-student-edit-control input,
        .ap-student-edit-control select,
        .ap-student-edit-control textarea { width:100%; min-width:0; min-height:30px; box-sizing:border-box; border:1px solid #CBD5E1; border-radius:7px; background:#FFFFFF; color:var(--ap-text); padding:0 8px; font-family:inherit; font-size:13px; font-weight:500; line-height:1.35; outline:0; }
        .ap-student-edit-control textarea { min-height:72px; padding:8px; resize:vertical; }
        .ap-student-edit-control input:focus,
        .ap-student-edit-control select:focus,
        .ap-student-edit-control textarea:focus { border-color:rgba(110,102,201,.55); box-shadow:0 0 0 2px rgba(110,102,201,.12); }
        .ap-student-edit-inline { display:grid; grid-template-columns:minmax(0,1fr) minmax(76px,.55fr); gap:6px; width:100%; }
        .ap-student-edit-stack { display:flex; flex-direction:column; gap:6px; width:100%; }
        .ap-student-edit-check { display:inline-flex; align-items:center; gap:7px; min-height:26px; color:var(--ap-text-soft); font-size:12px; font-weight:600; cursor:pointer; }
        .ap-student-edit-check input { flex:0 0 auto; width:15px; height:15px; min-height:0; padding:0; accent-color:#6E66C9; cursor:pointer; }
        .ap-student-edit-help { color:var(--ap-muted); font-size:11px; font-weight:500; line-height:1.45; }
        .ap-student-edit-flags { display:flex; flex-wrap:wrap; gap:8px; width:100%; }
        .ap-student-edit-flag { display:inline-flex; align-items:center; gap:7px; min-height:30px; padding:0 10px; border:1px solid var(--ap-border); border-radius:999px; background:var(--ap-surface-2); color:var(--ap-text); font-size:12px; font-weight:650; cursor:pointer; }
        .ap-student-edit-flag input { width:15px; height:15px; accent-color:#6E66C9; cursor:pointer; }
        .ap-student-edit-flag.is-warn input { accent-color:#D97706; }
        body.dark .ap-student-edit-control input,
        body.dark .ap-student-edit-control select,
        body.dark .ap-student-edit-control textarea { background:var(--ap-surface-2); border-color:var(--ap-border); color:var(--ap-text); }
        .ap-student-consult-preview { border:1px solid var(--ap-border); border-left:3px solid var(--ap-purple); border-radius:var(--ap-radius-card); background:var(--ap-card); padding:12px; min-height:88px; }
        .ap-student-consult-preview.is-updated { border-color:rgba(110,102,201,.55); box-shadow:0 0 0 3px rgba(110,102,201,.12); }
        .ap-student-consult-empty { text-align:center; color:var(--secondary); padding:20px 10px; border:1px dashed var(--border); border-radius:10px; background:var(--surface-2); }
        .ap-student-consult-row { display:flex; flex-direction:column; gap:9px; }
        .ap-student-consult-meta { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
        .ap-student-consult-type { display:inline-flex; align-items:center; min-height:22px; padding:3px 9px; border-radius:999px; background:rgba(110,102,201,.10); color:#6E66C9; font-size:11px; font-weight:600; }
        .ap-student-consult-text { margin:0; color:var(--text); font-size:13.5px; font-weight:500; line-height:1.6; white-space:pre-wrap; overflow-wrap:anywhere; }
        .ap-student-consult-next { border:1px solid rgba(217,119,6,.18); border-radius:10px; background:rgba(217,119,6,.07); color:#92400E; padding:9px 10px; font-size:12px; font-weight:600; line-height:1.55; }
        .ap-student-consult-actions { display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap; margin-top:10px; }
        .ap-student-mini-btn { height:28px; min-height:28px; padding:0 10px; border-radius:var(--ap-radius-sm); border:1px solid var(--ap-btn-ghost-border); background:var(--ap-btn-ghost-bg); color:var(--ap-btn-ghost-text); font-size:12px; font-weight:650; cursor:pointer; }
        .ap-student-mini-btn.is-primary { border-color:var(--ap-purple); background:var(--ap-purple); color:#fff; }
        .ap-student-consult-all { border:1px solid var(--ap-border); border-radius:var(--ap-radius-card); background:var(--ap-card); overflow:hidden; }
        .ap-student-consult-all summary { min-height:42px; display:flex; align-items:center; justify-content:space-between; padding:0 12px; cursor:pointer; color:var(--ap-text); font-size:13px; font-weight:700; list-style:none; }
        .ap-student-consult-all summary::-webkit-details-marker { display:none; }
        .ap-student-consult-all summary::after { content:'보기'; color:var(--ap-muted); font-size:12px; font-weight:650; }
        .ap-student-consult-all[open] summary::after { content:'접기'; }
        .ap-student-field-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        .ap-student-field { min-width:0; border:1px solid var(--border); border-radius:8px; background:var(--surface-2); padding:9px 11px; }
        .ap-student-field span { display:block; color:var(--secondary); font-size:11px; font-weight:600; line-height:1.25; }
        .ap-student-field strong { display:block; margin-top:4px; color:var(--text); font-size:13px; font-weight:600; line-height:1.4; overflow-wrap:anywhere; white-space:pre-wrap; }
        .ap-student-field.is-wide { grid-column:1 / -1; }
        .ap-student-history-row { border:1px solid var(--border); border-radius:8px; background:var(--surface-2); padding:12px; }
        .ap-student-tab-body { display:flex; flex-direction:column; gap:10px; }
        .ap-student-detail-shell { gap:10px !important; }
        .ap-student-card-purple { border-left:3px solid #6E66C9; }
        .ap-student-card-amber { border-left:3px solid #D97706; }
        /* 성적 탭 하위 탭(학교성적/원내평가) */
        .ap-student-grade-subtabs { margin-bottom:2px; }
        .ap-student-school-score-table-wrap { overflow-x:auto; border:1px solid var(--border); border-radius:8px; background:var(--surface-2); }
        .ap-student-school-score-table { width:100%; min-width:420px; border-collapse:collapse; }
        .ap-student-school-score-table th,
        .ap-student-school-score-table td { padding:8px 10px; border-bottom:1px solid var(--border); text-align:center; white-space:nowrap; }
        .ap-student-school-score-table thead th { color:var(--secondary); font-size:11px; font-weight:600; }
        .ap-student-school-score-table tbody th { color:var(--text); font-size:12px; font-weight:600; text-align:left; }
        .ap-student-school-score-table tbody td { color:var(--text); font-size:12.5px; font-weight:500; }
        .ap-student-school-score-table tbody tr:last-child th,
        .ap-student-school-score-table tbody tr:last-child td { border-bottom:0; }
        .ap-student-school-score-chip { display:inline-flex; align-items:center; min-height:22px; padding:2px 9px; border:1px solid var(--border); border-radius:999px; background:var(--surface); color:var(--text); font-size:12px; font-weight:600; }
        .ap-student-score-empty { padding:24px 14px; text-align:center; color:var(--secondary); background:var(--surface-2); border:1px dashed var(--border); border-radius:10px; font-size:13px; font-weight:500; line-height:1.6; }
        @media (max-width:640px) {
            .apms-eie-detail { padding:0 10px 4px; }
            .apms-eie-detail-head { flex-direction:column; }
            .apms-eie-detail-actions { width:100%; display:grid; grid-template-columns:1fr 1fr; }
            .apms-eie-detail-actions .apms-eie-primary { grid-column:span 2; }
            .apms-eie-profile-grid,
            .apms-eie-field-grid,
            .apms-eie-form-grid { grid-template-columns:1fr; }
            .apms-eie-form { padding:0 10px 4px; }
            .ap-student-detail-shell { padding:0 10px 4px; }
            .ap-student-profile-head { grid-template-columns:minmax(0,1fr) auto; gap:10px; padding:10px 2px; border-radius:0; align-items:center; }
            .ap-student-profile-head.is-edit { grid-template-columns:minmax(0,1fr); }
            .ap-student-head-main { min-width:0; gap:4px; overflow:hidden; }
            .ap-student-head-title h1,
            .ap-student-head-main h1 { font-size:17px; line-height:1.12; }
            .ap-student-meta-line { font-size:12px; }
            .ap-student-head-actions { align-items:flex-start; justify-content:flex-end; flex:0 0 auto; }
            .ap-student-consult-date-row { flex-wrap:nowrap; overflow-x:auto; padding-bottom:2px; }
            .ap-student-consult-date-btn { flex:0 0 auto; }
            .ap-student-field-grid { grid-template-columns:1fr; }
            .ap-student-field.is-wide { grid-column:auto; }
        }
        @media (min-width:760px) {
            .apms-eie-form-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
    `;
    document.head.appendChild(style);
}

// ── 신입/휴원 상태 헬퍼 ──────────────────────────────────────────
function isStudentNewMember(s) {
    if (!s) return false;
    if (String(s.memo || '').indexOf('#신입') === -1) return false;
    
    if (s.created_at) {
        const createdTime = new Date(String(s.created_at).split(' ')[0]).getTime();
        if (!isNaN(createdTime) && (Date.now() - createdTime) / (1000 * 60 * 60 * 24) > 62) {
            return false;
        }
    }
    return true;
}

function isStudentOnLeave(s) {
    return !!(s && (s.status === '휴원' || String(s.memo || '').indexOf('#휴원') !== -1));
}

function sortConsultationsByLatest(rows = []) {
    return [...rows].sort((a, b) => {
        const dateDiff = String(b?.date || '').localeCompare(String(a?.date || ''));
        if (dateDiff !== 0) return dateDiff;
        const createdDiff = String(b?.created_at || '').localeCompare(String(a?.created_at || ''));
        if (createdDiff !== 0) return createdDiff;
        return String(b?.id || '').localeCompare(String(a?.id || ''));
    });
}

function getStudentConsultationsFromState(sid) {
    return sortConsultationsByLatest((state.db.consultations || []).filter(c => String(c.student_id) === String(sid)));
}

function syncStudentConsultationsInState(sid, rows) {
    const safeRows = sortConsultationsByLatest(Array.isArray(rows) ? rows : []);
    const others = (state.db.consultations || []).filter(c => String(c.student_id) !== String(sid));
    state.db.consultations = [...others, ...safeRows];
    return safeRows;
}

function ensureStudentConsultationUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.studentConsultations) {
        state.ui.studentConsultations = { byStudent: {} };
    }
    return state.ui.studentConsultations;
}

function ensureConsultationAiUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.consultationAi) {
        state.ui.consultationAi = {
            mode: '',
            studentId: '',
            consultationId: '',
            loading: false,
            result: null,
            error: '',
            warning: '',
            source: ''
        };
    }
    return state.ui.consultationAi;
}

function ensureConsultationThreadAiUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.consultationThreadAi) {
        state.ui.consultationThreadAi = {
            studentId: '',
            loading: false,
            result: null,
            error: '',
            warning: '',
            source: ''
        };
    }
    return state.ui.consultationThreadAi;
}

const PARENT_CONTACT_CONSENT_BRANCH = 'apmath';
const PARENT_CONTACT_BASE_CONSENT_TYPES = ['attendance', 'payment', 'notice', 'report', 'marketing'];
const PARENT_CONTACT_CONSENT_ORDER = ['attendance', 'payment', 'notice', 'report', 'consultation', 'homework', 'exam', 'marketing'];
const PARENT_CONTACT_CONSENT_LABELS = {
    attendance: '출결 알림',
    payment: '수납 알림',
    notice: '공지 알림',
    report: '리포트 알림',
    consultation: '상담 알림',
    homework: '숙제/과제 알림',
    exam: '시험 알림',
    marketing: '홍보성 동의'
};

function sortParentContacts(rows = []) {
    return [...rows].sort((a, b) => {
        const primaryDiff = Number(b?.is_primary || 0) - Number(a?.is_primary || 0);
        if (primaryDiff !== 0) return primaryDiff;
        const createdDiff = String(b?.created_at || '').localeCompare(String(a?.created_at || ''));
        if (createdDiff !== 0) return createdDiff;
        return String(b?.id || '').localeCompare(String(a?.id || ''));
    });
}

function ensureParentContactUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.parentContactUi) {
        state.ui.parentContactUi = { byStudent: {} };
    }
    return state.ui.parentContactUi;
}

function ensureStudentDetailLazyUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.studentDetailLazyData) {
        state.ui.studentDetailLazyData = {};
    }
    return state.ui.studentDetailLazyData;
}

function getStudentDetailLazyState(studentId) {
    const key = String(studentId || '');
    const store = ensureStudentDetailLazyUiState();
    if (!store[key]) {
        store[key] = {
            loading: false,
            loadedAt: '',
            error: '',
            inFlight: null,
            parent_contacts: [],
            student_status_history: [],
            class_transfer_history: []
        };
    }
    return store[key];
}

function getStudentDetailLazyRows(studentId, key) {
    const entry = getStudentDetailLazyState(studentId);
    return Array.isArray(entry?.[key]) ? entry[key] : [];
}

function setStudentDetailSubModal(type = '', studentId = '') {
    if (!state.ui) state.ui = {};
    state.ui.currentStudentDetailSubModal = type ? { type, studentId: String(studentId || '') } : null;
}

function isStudentDetailSubModal(type = '', studentId = '') {
    const current = state.ui?.currentStudentDetailSubModal || null;
    return !!current &&
        String(current.type || '') === String(type || '') &&
        String(current.studentId || '') === String(studentId || '');
}

function shouldRefreshCurrentStudentDetailTab(studentId, tabs = []) {
    if (!state.ui) return false;
    // Hotfix guard: edit mode에서 lazy/consultation/contact 자동 refresh가
    // 수정 폼을 view shell로 덮어쓰면 안 된다. 저장/취소 같은 명시 전환은
    // 이 함수를 거치지 않으므로 영향받지 않는다.
    if (state.ui.currentStudentDetailMode === 'edit') return false;
    const key = String(studentId || '');
    const subModal = state.ui.currentStudentDetailSubModal || null;
    const allowedTabs = Array.isArray(tabs) ? tabs.map(String) : [];
    return state.ui.currentStudentDetailId === key &&
        (!allowedTabs.length || allowedTabs.includes(String(state.ui.currentStudentDetailTab || ''))) &&
        !(subModal && String(subModal.studentId || '') === key);
}

function shouldRefreshCurrentStudentCnsTab(studentId) {
    return shouldRefreshCurrentStudentDetailTab(studentId, ['cns']);
}

function showStudentDetailSubModalStep(type, sid, title, body, actionText = null, actionHandler = null) {
    if (!state.ui) state.ui = {};
    state.ui.currentStudentDetailSubModal = null;
    if (typeof showModalStep === 'function') showModalStep(title, body, actionText, actionHandler);
    else showModal(title, body, actionText, actionHandler);
    setStudentDetailSubModal(type, sid);
}

function replaceStudentDetailSubModal(type, sid, title, body, actionText = null, actionHandler = null) {
    if (typeof replaceModalStep === 'function') replaceModalStep(title, body, actionText, actionHandler);
    else showModal(title, body, actionText, actionHandler);
    setStudentDetailSubModal(type, sid);
}

async function ensureStudentDetailLazyData(studentId, options = {}) {
    const key = String(studentId || '').trim();
    if (!key) return getStudentDetailLazyState(key);

    const entry = getStudentDetailLazyState(key);
    const force = !!options.force;
    if (!force && entry.loadedAt) return entry;
    if (entry.inFlight) return entry.inFlight;

    entry.loading = true;
    entry.error = '';

    const promise = api.get(`students/${encodeURIComponent(key)}/detail-data`)
        .then(res => {
            if (res?.success) {
                entry.parent_contacts = Array.isArray(res.parent_contacts) ? sortParentContacts(res.parent_contacts) : entry.parent_contacts;
                entry.student_status_history = Array.isArray(res.student_status_history) ? res.student_status_history : entry.student_status_history;
                entry.class_transfer_history = Array.isArray(res.class_transfer_history) ? res.class_transfer_history : entry.class_transfer_history;
                entry.loadedAt = new Date().toISOString();
                entry.error = '';
            } else {
                entry.error = String(res?.message || res?.error || 'student detail lazy load failed');
            }
            return entry;
        })
        .catch(err => {
            entry.error = String(err?.message || err || 'student detail lazy load failed');
            return entry;
        })
        .finally(() => {
            entry.loading = false;
            entry.inFlight = null;
            if (options.refresh !== false && shouldRefreshCurrentStudentDetailTab(key, ['basic', 'contact'])) {
                renderStudentDetailTab(key, state.ui.currentStudentDetailTab || 'basic');
            }
        });

    entry.inFlight = promise;
    return promise;
}

function getStudentParentContactsFromState(sid) {
    const lazyRows = getStudentDetailLazyRows(sid, 'parent_contacts');
    if (lazyRows.length) return sortParentContacts(lazyRows);
    return sortParentContacts((state.db.parent_contacts || []).filter(row => String(row?.student_id || '') === String(sid)));
}

function getStudentMessageLogsFromState(sid) {
    return [...(state.db.message_logs || []).filter(row => String(row?.student_id || '') === String(sid))]
        .sort((a, b) => {
            const createdDiff = String(b?.created_at || '').localeCompare(String(a?.created_at || ''));
            if (createdDiff !== 0) return createdDiff;
            return String(b?.id || '').localeCompare(String(a?.id || ''));
        });
}

function mergeStudentRows(tableName, sid, rows) {
    const key = String(sid || '');
    const existing = Array.isArray(state.db?.[tableName]) ? state.db[tableName] : [];
    const others = existing.filter(row => String(row?.student_id || '') !== key);
    const scopedRows = (Array.isArray(rows) ? rows : []).filter(row => String(row?.student_id || '') === key);
    state.db[tableName] = others.concat(scopedRows);
    return scopedRows;
}

function getStudentParentMessageState(sid) {
    const store = ensureParentContactUiState();
    const key = String(sid || '');
    if (!store.byStudent[key]) {
        store.byStudent[key] = { loadedAt: 0, loading: false, inFlight: null, error: '', consents: [] };
    }
    const entry = store.byStudent[key];
    if (typeof entry.messagesLoadedAt !== 'number') entry.messagesLoadedAt = 0;
    if (typeof entry.messageLoading !== 'boolean') entry.messageLoading = false;
    if (!('messageInFlight' in entry)) entry.messageInFlight = null;
    if (typeof entry.messageError !== 'string') entry.messageError = '';
    return entry;
}

function getStudentParentContactBundle(sid) {
    const entry = getStudentParentMessageState(sid);
    return {
        contacts: getStudentParentContactsFromState(sid),
        consents: Array.isArray(entry.consents) ? entry.consents : [],
        messages: getStudentMessageLogsFromState(sid),
        loading: !!entry.loading,
        error: entry.error || '',
        messagesLoadedAt: Number(entry.messagesLoadedAt || 0),
        messageLoading: !!entry.messageLoading,
        messageError: entry.messageError || ''
    };
}


function getStudentStatusHistoryRows(sid) {
    return [...getStudentDetailLazyRows(sid, 'student_status_history')]
        .sort((a, b) => {
            const changedDiff = String(b?.changed_at || '').localeCompare(String(a?.changed_at || ''));
            if (changedDiff !== 0) return changedDiff;
            return String(b?.id || '').localeCompare(String(a?.id || ''));
        });
}

function getStudentClassTransferHistoryRows(sid) {
    return [...getStudentDetailLazyRows(sid, 'class_transfer_history')]
        .sort((a, b) => {
            const changedDiff = String(b?.changed_at || '').localeCompare(String(a?.changed_at || ''));
            if (changedDiff !== 0) return changedDiff;
            return String(b?.id || '').localeCompare(String(a?.id || ''));
        });
}

function formatStudentFoundationHistoryDate(row) {
    return String(row?.changed_at || row?.created_at || row?.updated_at || '').trim() || '시각 없음';
}

function renderStudentOperationHistorySection(sid) {
    const lazy = getStudentDetailLazyState(sid);
    const statusRows = getStudentStatusHistoryRows(sid);
    const transferRows = getStudentClassTransferHistoryRows(sid);
    return `
        <div style="margin-top:24px; display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <div>
                    <div style="font-size:16px; font-weight:500; color:var(--text); line-height:1.3;">학생 이력</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5; margin-top:3px;">상태 변경 ${statusRows.length}건 · 반 이동 ${transferRows.length}건</div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button class="btn apms-button apms-button--quiet" style="min-height:34px; padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="openStudentStatusHistoryModal('${sid}')">상태 변경 이력</button>
                    <button class="btn apms-button apms-button--quiet" style="min-height:34px; padding:7px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="openStudentClassTransferHistoryModal('${sid}')">반 이동 이력</button>
                </div>
            </div>
            ${lazy.loading ? '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">학생 이력 데이터를 불러오는 중입니다.</div>' : ''}
            ${lazy.error ? '<div style="font-size:12px; color:var(--warning); font-weight:500; line-height:1.5;">학생 이력 데이터를 다시 확인해 주세요.</div>' : ''}
        </div>
    `;
}

function renderStudentStatusHistoryModalHtml(sid) {
    const rows = getStudentStatusHistoryRows(sid);
    return `
        <div style="display:flex; flex-direction:column; gap:12px;">
            ${rows.length ? rows.map(row => `
                <div class="card apms-card" style="padding:14px; border:1px solid var(--border); border-radius:14px; box-shadow:none; background:var(--surface);">
                    <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:8px;">
                        <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(row.old_status || '이전 상태')} → ${apEscapeHtml(row.new_status || '상태 확인')}</div>
                        <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5; white-space:nowrap;">${apEscapeHtml(formatStudentFoundationHistoryDate(row))}</div>
                    </div>
                    ${row.reason ? `<div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(row.reason)}</div>` : '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.6;">사유 기록 없음</div>'}
                    ${row.changed_by ? `<div style="margin-top:8px; font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">처리자 ${apEscapeHtml(row.changed_by)}</div>` : ''}
                </div>
            `).join('') : '<div style="padding:24px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6;">상태 변경 이력이 없습니다.</div>'}
        </div>
    `;
}

function renderStudentClassTransferHistoryModalHtml(sid) {
    const rows = getStudentClassTransferHistoryRows(sid);
    return `
        <div style="display:flex; flex-direction:column; gap:12px;">
            ${rows.length ? rows.map(row => {
                const fromClass = row.from_class_name || row.from_class_id || '이전 반 없음';
                const toClass = row.to_class_name || row.to_class_id || '이동 반 확인';
                return `
                    <div class="card apms-card" style="padding:14px; border:1px solid var(--border); border-radius:14px; box-shadow:none; background:var(--surface);">
                        <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:8px;">
                            <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(fromClass)} → ${apEscapeHtml(toClass)}</div>
                            <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5; white-space:nowrap;">${apEscapeHtml(formatStudentFoundationHistoryDate(row))}</div>
                        </div>
                        ${row.reason ? `<div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(row.reason)}</div>` : '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.6;">사유 기록 없음</div>'}
                        ${row.changed_by ? `<div style="margin-top:8px; font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">처리자 ${apEscapeHtml(row.changed_by)}</div>` : ''}
                    </div>
                `;
            }).join('') : '<div style="padding:24px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6;">반 이동 이력이 없습니다.</div>'}
        </div>
    `;
}

async function openStudentStatusHistoryModal(sid) {
    const lazy = getStudentDetailLazyState(sid);
    if (!lazy.loadedAt) {
        showStudentDetailSubModalStep('status-history', sid, '상태 변경 이력', '<div style="padding:24px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6;">학생 이력 데이터를 불러오는 중입니다.</div>');
        await ensureStudentDetailLazyData(sid);
        if (!isStudentDetailSubModal('status-history', sid)) return;
        replaceStudentDetailSubModal('status-history', sid, '상태 변경 이력', renderStudentStatusHistoryModalHtml(sid));
        return;
    }
    showStudentDetailSubModalStep('status-history', sid, '상태 변경 이력', renderStudentStatusHistoryModalHtml(sid));
}

async function openStudentClassTransferHistoryModal(sid) {
    const lazy = getStudentDetailLazyState(sid);
    if (!lazy.loadedAt) {
        showStudentDetailSubModalStep('class-transfer-history', sid, '반 이동 이력', '<div style="padding:24px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6;">학생 이력 데이터를 불러오는 중입니다.</div>');
        await ensureStudentDetailLazyData(sid);
        if (!isStudentDetailSubModal('class-transfer-history', sid)) return;
        replaceStudentDetailSubModal('class-transfer-history', sid, '반 이동 이력', renderStudentClassTransferHistoryModalHtml(sid));
        return;
    }
    showStudentDetailSubModalStep('class-transfer-history', sid, '반 이동 이력', renderStudentClassTransferHistoryModalHtml(sid));
}

async function ensureStudentParentContactDataLoaded(sid, options = {}) {
    const store = ensureParentContactUiState();
    const key = String(sid || '');
    if (!key) return getStudentParentContactBundle(key);

    const entry = getStudentParentMessageState(key);
    const force = !!options.force;
    const maxAgeMs = Number.isFinite(Number(options.maxAgeMs)) ? Number(options.maxAgeMs) : 60 * 1000;
    if (!force && entry.loadedAt && (Date.now() - entry.loadedAt) < maxAgeMs) {
        return getStudentParentContactBundle(key);
    }
    if (entry.inFlight) return entry.inFlight;

    entry.loading = true;
    entry.error = '';
    const query = `student_id=${encodeURIComponent(key)}&limit=200`;

    const promise = Promise.allSettled([
        api.get(`parent-foundation/contacts?${query}`),
        api.get(`parent-foundation/consents?${query}`)
    ]).then(results => {
        const [contactsRes, consentsRes] = results;
        const errors = [];

        if (contactsRes.status === 'fulfilled' && contactsRes.value?.success && Array.isArray(contactsRes.value.contacts)) {
            mergeStudentRows('parent_contacts', key, contactsRes.value.contacts);
        } else {
            errors.push('contacts');
        }

        if (consentsRes.status === 'fulfilled' && consentsRes.value?.success && Array.isArray(consentsRes.value.consents)) {
            entry.consents = consentsRes.value.consents.filter(row => String(row?.student_id || '') === key);
        } else {
            errors.push('consents');
        }

        entry.loadedAt = Date.now();
        entry.loading = false;
        entry.error = errors.join(',');
        if (options.refresh !== false && shouldRefreshCurrentStudentDetailTab(key, ['basic'])) {
            renderStudentDetailTab(key, 'basic');
        }
        return getStudentParentContactBundle(key);
    }).catch(err => {
        entry.loading = false;
        entry.error = String(err?.message || err || 'parent contact load failed');
        return getStudentParentContactBundle(key);
    }).finally(() => {
        entry.inFlight = null;
    });

    entry.inFlight = promise;
    return promise;
}

async function ensureStudentParentMessageLogsLoaded(sid, options = {}) {
    const key = String(sid || '');
    if (!key) return getStudentParentContactBundle(key);

    const entry = getStudentParentMessageState(key);
    const force = !!options.force;
    const maxAgeMs = Number.isFinite(Number(options.maxAgeMs)) ? Number(options.maxAgeMs) : 60 * 1000;
    if (!force && entry.messagesLoadedAt && (Date.now() - entry.messagesLoadedAt) < maxAgeMs) {
        return getStudentParentContactBundle(key);
    }
    if (entry.messageInFlight) return entry.messageInFlight;

    entry.messageLoading = true;
    entry.messageError = '';
    const query = `student_id=${encodeURIComponent(key)}&limit=200`;

    const promise = api.get(`parent-foundation/messages?${query}`)
        .then(res => {
            if (res?.success && Array.isArray(res.messages)) {
                mergeStudentRows('message_logs', key, res.messages);
                entry.messagesLoadedAt = Date.now();
                entry.messageError = '';
            } else {
                entry.messageError = String(res?.message || res?.error || 'parent message logs load failed');
            }
            return getStudentParentContactBundle(key);
        })
        .catch(err => {
            entry.messageError = String(err?.message || err || 'parent message logs load failed');
            return getStudentParentContactBundle(key);
        })
        .finally(() => {
            entry.messageLoading = false;
            entry.messageInFlight = null;
            if (options.refresh !== false && shouldRefreshCurrentStudentDetailTab(key, ['basic'])) {
                renderStudentDetailTab(key, 'basic');
            }
        });

    entry.messageInFlight = promise;
    return promise;
}

function buildEffectiveConsentMap(contact, consentRows = []) {
    const scopedRows = consentRows.filter(row => String(row?.parent_contact_id || '') === String(contact?.id || ''));
    const explicitTypes = [...new Set(scopedRows.map(row => String(row?.consent_type || '').trim()).filter(Boolean))];
    const types = PARENT_CONTACT_CONSENT_ORDER.filter(type => explicitTypes.includes(type) || PARENT_CONTACT_BASE_CONSENT_TYPES.includes(type));
    return types.map(type => {
        const exact = scopedRows.find(row => String(row?.branch || 'all') === PARENT_CONTACT_CONSENT_BRANCH && String(row?.consent_type || '') === type);
        const all = scopedRows.find(row => String(row?.branch || 'all') === 'all' && String(row?.consent_type || '') === type);
        const row = exact || all || null;
        let isAllowed;
        let source = 'legacy';

        if (row) {
            isAllowed = Number(row.is_allowed) ? 1 : 0;
            source = exact ? 'scoped' : 'all';
        } else {
            if (type === 'attendance') isAllowed = Number(contact?.receive_attendance ?? 1) ? 1 : 0;
            else if (type === 'payment') isAllowed = Number(contact?.receive_payment ?? 1) ? 1 : 0;
            else if (type === 'notice') isAllowed = Number(contact?.receive_notice ?? 1) ? 1 : 0;
            else if (type === 'report') isAllowed = Number(contact?.receive_report ?? 1) ? 1 : 0;
            else if (type === 'marketing') isAllowed = Number(contact?.receive_marketing ?? 0) ? 1 : 0;
            else isAllowed = Number(contact?.receive_notice ?? 1) ? 1 : 0;
        }

        return {
            type,
            label: PARENT_CONTACT_CONSENT_LABELS[type] || type,
            is_allowed: isAllowed ? 1 : 0,
            source,
            row
        };
    });
}

function formatParentMessageDate(row) {
    return String(row?.sent_at || row?.delivered_at || row?.queued_at || row?.created_at || '').trim();
}

function summarizeParentMessage(row) {
    const title = String(row?.title || '').trim();
    if (title) return title;
    const content = String(row?.content || '').trim().replace(/\s+/g, ' ');
    return content.length > 80 ? `${content.slice(0, 80)}...` : content;
}

function getParentContactMessages(contactId, messageRows = []) {
    return [...(Array.isArray(messageRows) ? messageRows : [])].filter(row => String(row?.parent_contact_id || '') === String(contactId || ''));
}

function renderParentMessageHistoryRows(rows = []) {
    return rows.map(row => `
        <div style="padding:12px 0; border-top:1px solid rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:6px;">
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <span class="std-badge" style="background:var(--surface-2); color:var(--secondary); border:1px solid var(--border);">${apEscapeHtml(row.channel || '기록')}</span>
                    <span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">${apEscapeHtml(row.message_type || '기타')}</span>
                    <span class="std-badge" style="background:rgba(255,165,2,0.08); color:var(--warning); border:1px solid rgba(255,165,2,0.15);">${apEscapeHtml(row.status || '확인 필요')}</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">${apEscapeHtml(formatParentMessageDate(row) || '시각 없음')}</div>
            </div>
            <div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.5; margin-bottom:6px;">${apEscapeHtml(summarizeParentMessage(row) || '기록 내용 없음')}</div>
            <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">수신자 ${apEscapeHtml(row.recipient_name_snapshot || row.relation_snapshot || '미기록')}${row.recipient_phone_snapshot ? ` · ${apEscapeHtml(row.recipient_phone_snapshot)}` : ''}</div>
            ${row.error_message ? `<div style="margin-top:6px; font-size:11px; color:var(--error); font-weight:500; line-height:1.5;">실패 사유: ${apEscapeHtml(row.error_message)}</div>` : ''}
        </div>
    `).join('');
}

function openParentConsentModal(sid, contactId) {
    setStudentDetailSubModal('parent-consent', sid);
    const bundle = getStudentParentContactBundle(sid);
    const contact = (bundle.contacts || []).find(row => String(row?.id || '') === String(contactId || ''));
    if (!contact) {
        toast('보호자 연락처 정보를 다시 불러와 주세요.', 'warn');
        return;
    }

    const consentItems = buildEffectiveConsentMap(contact, bundle.consents);
    const primaryTypes = ['attendance', 'payment', 'notice', 'report'];
    const primaryItems = primaryTypes
        .map(type => consentItems.find(item => item.type === type))
        .filter(Boolean);
    const scopedTypes = new Set((bundle.consents || [])
        .filter(row => String(row?.parent_contact_id || '') === String(contact.id || ''))
        .map(row => String(row?.consent_type || '').trim())
        .filter(Boolean));
    const extraItems = consentItems.filter(item => scopedTypes.has(item.type) && !primaryTypes.includes(item.type));

    const primaryHtml = primaryItems.map(item => `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0; border-top:1px solid rgba(0,0,0,0.05);">
            <div style="min-width:0;">
                <div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(item.label)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">현재 ${item.is_allowed ? '동의' : '미동의'}${item.source === 'legacy' ? ' · 기본값' : item.source === 'all' ? ' · 전체 공통' : ''}</div>
            </div>
            <button class="btn apms-button apms-button--quiet" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="toggleParentConsent('${sid}','${contact.id}','${item.type}',${item.is_allowed ? 0 : 1},'consent')">${item.is_allowed ? '미동의' : '동의'}</button>
        </div>
    `).join('');

    const extraHtml = extraItems.map(item => `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:10px 0; border-top:1px solid rgba(0,0,0,0.05);">
            <div style="min-width:0;">
                <div style="font-size:12px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(item.label)}</div>
                <div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">현재 ${item.is_allowed ? '동의' : '미동의'}</div>
            </div>
            <button class="btn apms-button apms-button--quiet" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="toggleParentConsent('${sid}','${contact.id}','${item.type}',${item.is_allowed ? 0 : 1},'consent')">${item.is_allowed ? '미동의' : '동의'}</button>
        </div>
    `).join('');

    showStudentDetailSubModalStep('parent-consent', sid, '연락 설정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <div style="padding:12px; border:1px solid var(--border); border-radius:12px; background:var(--surface-2);">
                <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(contact.name || '이름 미입력')}</div>
                <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">${apEscapeHtml(contact.relation || '관계 미입력')}${contact.phone ? ` · ${apEscapeHtml(contact.phone)}` : ''}</div>
            </div>
            <div style="padding:2px 0;">
                ${primaryHtml || '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">확인 가능한 연락 설정이 없습니다.</div>'}
            </div>
            ${extraHtml ? `
                <details style="border:1px solid var(--border); border-radius:12px; background:var(--surface-2); padding:10px 12px;">
                    <summary style="cursor:pointer; font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">기타 설정</summary>
                    <div style="margin-top:8px;">${extraHtml}</div>
                </details>
            ` : ''}
        </div>
    `);
}

async function openParentMessageHistoryModal(sid, contactId = '') {
    setStudentDetailSubModal('parent-message-history', sid);
    const messageState = getStudentParentMessageState(sid);
    if (!messageState.messagesLoadedAt) {
        showStudentDetailSubModalStep('parent-message-history', sid, '연락 이력', '<div style="padding:24px 8px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; line-height:1.6;">연락 이력을 불러오는 중입니다.</div>');
        await ensureStudentParentMessageLogsLoaded(sid);
        if (!isStudentDetailSubModal('parent-message-history', sid)) return;
    }

    const bundle = getStudentParentContactBundle(sid);
    const contact = contactId
        ? (bundle.contacts || []).find(row => String(row?.id || '') === String(contactId || ''))
        : null;
    const rows = contactId ? getParentContactMessages(contactId, bundle.messages) : [...(bundle.messages || [])];
    replaceStudentDetailSubModal('parent-message-history', sid, '연락 이력', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            ${contact ? `
                <div style="padding:12px; border:1px solid var(--border); border-radius:12px; background:var(--surface-2);">
                    <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.5;">${apEscapeHtml(contact.name || '이름 미입력')}</div>
                    <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">${apEscapeHtml(contact.relation || '관계 미입력')}${contact.phone ? ` · ${apEscapeHtml(contact.phone)}` : ''}</div>
                </div>
            ` : ''}
            ${bundle.messageError ? '<div style="font-size:12px; color:var(--warning); font-weight:500; line-height:1.5;">연락 이력을 다시 확인해 주세요.</div>' : ''}
            <div>
                ${rows.length ? renderParentMessageHistoryRows(rows) : '<div style="padding:20px 4px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500;">연락 이력이 없습니다.</div>'}
            </div>
        </div>
    `);
}

function renderParentContactSection(sid) {
    const student = state.db.students.find(st => String(st.id) === String(sid));
    const bundle = getStudentParentContactBundle(sid);
    const fallbackPhone = String(student?.parent_phone || '').trim();
    const fallbackRelation = String(student?.guardian_relation || '').trim();
    const fallbackCard = !bundle.contacts.length && fallbackPhone ? `
        <div class="card apms-card" style="padding:12px; border:1px solid var(--border); border-radius:14px; box-shadow:none; background:var(--surface-2);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:8px;">
                <div style="font-size:13px; font-weight:500; color:var(--text); line-height:1.5;">기본 보호자 연락처</div>
                <span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">기본 연락처</span>
            </div>
            <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5; margin-bottom:2px;">관계 ${apEscapeHtml(fallbackRelation || '미지정')}</div>
            <div style="font-size:13px; color:var(--primary); font-weight:500; line-height:1.5; cursor:pointer; overflow-wrap:anywhere;" onclick="copyPhoneNumber(${apJsArg(fallbackPhone)})">${apEscapeHtml(fallbackPhone)}</div>
        </div>
    ` : '';

    const contactCards = bundle.contacts.map(contact => {
        const historyButtonHtml = `<button class="btn apms-button apms-button--quiet" style="min-height:32px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="openParentMessageHistoryModal('${sid}','${contact.id}')">연락 이력 보기</button>`;

        return `
            <div class="card apms-card" style="padding:12px; margin-bottom:10px; border:1px solid var(--border); border-radius:14px; box-shadow:none; background:var(--surface);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:8px;">
                    <div style="min-width:0;">
                        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                            <div style="font-size:14px; font-weight:500; color:var(--text); line-height:1.5;">${apEscapeHtml(contact.name || '이름 미입력')}</div>
                            ${Number(contact.is_primary) ? '<span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">대표 연락처</span>' : ''}
                        </div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">${apEscapeHtml(contact.relation || '관계 미입력')}</div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <span style="cursor:pointer; color:var(--primary); font-size:12px; font-weight:500;" onclick="openEditParentContactModal('${sid}','${contact.id}')">수정</span>
                        <span style="cursor:pointer; color:var(--error); font-size:12px; font-weight:500;" onclick="handleDeleteParentContact('${sid}','${contact.id}')">삭제</span>
                    </div>
                </div>
                <div style="font-size:13px; color:var(--primary); font-weight:500; line-height:1.5; cursor:pointer; overflow-wrap:anywhere;" onclick="copyPhoneNumber(${apJsArg(contact.phone || '')})">${apEscapeHtml(contact.phone || '미등록')}</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-top:10px;">
                    <button class="btn apms-button apms-button--quiet" style="min-height:32px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="openParentConsentModal('${sid}','${contact.id}')">연락 설정</button>
                    ${historyButtonHtml}
                </div>
            </div>
        `;
    }).join('');

    const historySummaryHtml = bundle.messages.length
        ? `<div style="display:flex; justify-content:flex-end; margin-top:8px;"><button class="btn apms-button apms-button--quiet" style="min-height:32px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="openParentMessageHistoryModal('${sid}')">연락 이력 보기</button></div>`
        : '';

    return `
        <div style="margin-top:24px; display:flex; flex-direction:column; gap:16px;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
                    <div style="font-size:16px; font-weight:500; color:var(--text); line-height:1.3;">보호자 연락처</div>
                    <button class="btn apms-button apms-button--quiet" style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:500; border-radius:12px;" onclick="openAddParentContactModal('${sid}')">보호자 연락처 추가</button>
                </div>
                ${bundle.loading ? '<div style="margin-bottom:10px; font-size:12px; color:var(--secondary); font-weight:500;">보호자 연락처 데이터를 불러오는 중입니다.</div>' : ''}
                ${bundle.error ? '<div style="margin-bottom:10px; font-size:12px; color:var(--warning); font-weight:500;">일부 보호자 연락 데이터를 다시 확인해 주세요.</div>' : ''}
                ${bundle.messageLoading ? '<div style="margin-bottom:10px; font-size:12px; color:var(--secondary); font-weight:500;">연락 이력을 불러오는 중입니다.</div>' : ''}
                ${contactCards || fallbackCard || '<div style="padding:18px; text-align:center; color:var(--secondary); font-size:13px; font-weight:500; border:1px solid var(--border); border-radius:14px; background:var(--surface-2);">등록된 보호자 연락처가 없습니다.</div>'}
                ${historySummaryHtml}
            </div>
        </div>
    `;
}

// 보기모드 기본 탭의 [보호자 관리] 진입점.
// 별도 섹션을 제거하면서도 다중 연락처/동의/연락 이력 등 기존 보호자 관리 기능을
// 그대로 사용할 수 있도록 기존 renderParentContactSection을 서브 모달로 띄운다.
function openStudentParentManageModal(sid) {
    void ensureStudentParentContactDataLoaded(sid, { force: false });
    showStudentDetailSubModalStep('parent-manage', sid, '보호자 관리', `
        <div class="apms-student-contrast">${renderParentContactSection(sid)}</div>
    `);
}
if (typeof window !== 'undefined') {
    window.openStudentParentManageModal = openStudentParentManageModal;
}

function resetConsultationAiUiState(mode = '', studentId = '', consultationId = '') {
    const store = ensureConsultationAiUiState();
    store.mode = mode;
    store.studentId = String(studentId || '');
    store.consultationId = String(consultationId || '');
    store.loading = false;
    store.result = null;
    store.error = '';
    store.warning = '';
    store.source = '';
    return store;
}

function resetConsultationThreadAiUiState(studentId = '') {
    const store = ensureConsultationThreadAiUiState();
    store.studentId = String(studentId || '');
    store.loading = false;
    store.result = null;
    store.error = '';
    store.warning = '';
    store.source = '';
    return store;
}

function getConsultationHistoryPayloadRows(sid, options = {}) {
    const excludeId = String(options.excludeId || '').trim();
    const limit = Number.isFinite(Number(options.limit)) ? Number(options.limit) : 4;
    return getStudentConsultationsFromState(sid)
        .filter(row => !excludeId || String(row?.id || '') !== excludeId)
        .slice(0, limit)
        .map(row => ({
            date: String(row?.date || '').trim(),
            type: String(row?.type || '').trim(),
            content: String(row?.content || '').trim(),
            next_action: String(row?.next_action || '').trim(),
            created_at: String(row?.created_at || '').trim()
        }));
}

function consultationThreadSummarySectionHtml(title, items = []) {
    const rows = Array.isArray(items) ? items.filter(Boolean) : [];
    if (!rows.length) return '';
    return `
        <div>
            <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:6px;">${title}</div>
            <ul style="margin:0; padding-left:18px; color:var(--text); font-size:12px; font-weight:500; line-height:1.6;">
                ${rows.map(item => `<li>${apEscapeHtml(item)}</li>`).join('')}
            </ul>
        </div>
    `;
}

function consultationThreadSummaryModalHtml() {
    const ai = ensureConsultationThreadAiUiState();
    const result = ai.result || null;
    return `
        <div style="display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">최근 상담 흐름을 내부 참고용으로만 정리합니다.</div>
                <button type="button" class="btn apms-button apms-button--quiet" ${ai.loading ? 'disabled' : ''} style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:500; border-radius:10px;" onclick="generateConsultationThreadSummary('${apEscapeHtml(ai.studentId)}')">다시 요약</button>
            </div>
            ${ai.loading ? '<div style="font-size:12px; color:var(--secondary); font-weight:500;">상담 흐름 요약을 생성 중입니다.</div>' : ''}
            ${ai.error ? `<div style="font-size:12px; color:var(--error); font-weight:500; line-height:1.5;">${apEscapeHtml(ai.error)}</div>` : ''}
            ${ai.warning ? `<div style="font-size:11px; color:var(--warning); font-weight:500; line-height:1.5;">${apEscapeHtml(ai.warning)}</div>` : ''}
            ${ai.source ? `<div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">source: ${apEscapeHtml(ai.source)}</div>` : ''}
            ${result ? `
                <div style="display:flex; flex-direction:column; gap:10px;">
                    <div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:6px;">요약</div>
                        <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.summary || '')}</div>
                    </div>
                    ${consultationThreadSummarySectionHtml('최근 상담 흐름', result.recent_flow)}
                    ${consultationThreadSummarySectionHtml('남은 확인 사항', result.open_items)}
                    ${consultationThreadSummarySectionHtml('다음 상담 확인 포인트', result.next_check_points)}
                    ${result.teacher_note_draft ? `<div><div style="font-size:12px; color:var(--secondary); font-weight:500; margin-bottom:6px;">내부 기록 초안</div><div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.teacher_note_draft)}</div></div>` : ''}
                </div>
            ` : '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">버튼을 눌렀을 때만 최근 상담 흐름 요약을 생성합니다.</div>'}
        </div>
    `;
}

function renderConsultationThreadSummaryModal(useStep = false) {
    const sid = ensureConsultationThreadAiUiState().studentId;
    if (useStep) {
        showStudentDetailSubModalStep('consultation-thread-summary', sid, '상담 흐름 요약', consultationThreadSummaryModalHtml());
        return;
    }
    replaceStudentDetailSubModal('consultation-thread-summary', sid, '상담 흐름 요약', consultationThreadSummaryModalHtml());
}

async function openConsultationThreadSummaryModal(sid) {
    setStudentDetailSubModal('consultation-thread-summary', sid);
    await ensureStudentConsultationsLoaded(sid);
    const rows = getStudentConsultationsFromState(sid);
    resetConsultationThreadAiUiState(sid);
    renderConsultationThreadSummaryModal(true);
    if (!rows.length) {
        const ai = ensureConsultationThreadAiUiState();
        ai.error = '상담 기록이 아직 없어 상담 흐름 요약을 만들 수 없습니다.';
        renderConsultationThreadSummaryModal();
        return;
    }
    await generateConsultationThreadSummary(sid);
}

async function generateConsultationThreadSummary(sid) {
    const ai = ensureConsultationThreadAiUiState();
    if (ai.loading) return;

    await ensureStudentConsultationsLoaded(sid);
    const student = state.db.students.find(row => String(row.id) === String(sid));
    const rows = getStudentConsultationsFromState(sid);
    const latest = rows[0] || null;
    const historyRows = rows.slice(1, 5).map(row => ({
        date: String(row?.date || '').trim(),
        type: String(row?.type || '').trim(),
        content: String(row?.content || '').trim(),
        next_action: String(row?.next_action || '').trim(),
        created_at: String(row?.created_at || '').trim()
    }));
    if (!latest && !historyRows.length) {
        ai.error = '상담 기록이 아직 없어 상담 흐름 요약을 만들 수 없습니다.';
        renderConsultationThreadSummaryModal();
        return;
    }

    ai.loading = true;
    ai.error = '';
    ai.warning = '';
    ai.studentId = String(sid || '');
    renderConsultationThreadSummaryModal();

    try {
        const result = await api.post('ai/consultation-thread-summary', {
            student_id: String(sid || ''),
            student_name: student?.name || '',
            grade: student?.grade || '',
            current_content: latest?.content || '',
            current_next_action: latest?.next_action || '',
            consultations: historyRows
        });
        if (result?.success) {
            ai.result = {
                summary: String(result.summary || '').trim(),
                recent_flow: Array.isArray(result.recent_flow) ? result.recent_flow : [],
                open_items: Array.isArray(result.open_items) ? result.open_items : [],
                next_check_points: Array.isArray(result.next_check_points) ? result.next_check_points : [],
                teacher_note_draft: String(result.teacher_note_draft || '').trim()
            };
            ai.warning = String(result.warning || '').trim();
            ai.source = String(result.source || '').trim();
            toast(ai.source === 'fallback' ? '상담 흐름 요약이 대체 모드로 생성되었습니다.' : '상담 흐름 요약이 생성되었습니다.', 'info');
        } else {
            ai.error = String(result?.message || result?.error || '상담 흐름 요약 생성에 실패했습니다.');
        }
    } catch (e) {
        console.error('[generateConsultationThreadSummary] failed:', e);
        ai.error = '상담 흐름 요약 생성 중 오류가 발생했습니다.';
    } finally {
        ai.loading = false;
        renderConsultationThreadSummaryModal();
    }
}

function consultationAiPanelHtml(mode) {
    const ai = ensureConsultationAiUiState();
    const disabled = ai.loading ? 'disabled' : '';
    const loadingText = ai.loading ? 'AI 요약 생성 중입니다.' : '';
    const result = ai.result || null;
    const keyIssuesHtml = Array.isArray(result?.key_issues) && result.key_issues.length
        ? `<ul style="margin: 8px 0 0 18px; padding: 0; color: var(--text); font-size: 12px; font-weight:500; line-height: 1.6;">
                ${result.key_issues.map(item => `<li>${apEscapeHtml(item)}</li>`).join('')}
           </ul>`
        : '';
    const applyButton = result?.next_action_draft
        ? `<button type="button" class="btn apms-button apms-button--quiet" style="min-height: 38px; padding: 8px 12px; font-size: 12px; font-weight:500; border-radius: 12px; color: var(--primary); border: 1px solid rgba(26,92,255,0.2); background: rgba(26,92,255,0.06);" onclick="applyConsultationAiNextAction('${mode}')">다음 조치 반영</button>`
        : '';

    return `
        <div id="consultation-ai-panel" style="display:flex; flex-direction:column; gap:10px; padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">상담 AI 요약/다음 조치 초안</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="button" id="consultation-ai-generate-btn" class="btn apms-button apms-button--quiet" ${disabled} style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:500; border-radius:12px;" onclick="generateConsultationAiSummary('${mode}')">AI 요약</button>
                    ${applyButton}
                </div>
            </div>
            ${loadingText ? `<div style="font-size:12px; color:var(--secondary); font-weight:500;">${loadingText}</div>` : ''}
            ${ai.error ? `<div style="font-size:12px; color:var(--error); font-weight:500; line-height:1.5;">${apEscapeHtml(ai.error)}</div>` : ''}
            ${ai.warning ? `<div style="font-size:11px; color:var(--warning); font-weight:500; line-height:1.5;">${apEscapeHtml(ai.warning)}</div>` : ''}
            ${ai.source ? `<div style="font-size:11px; color:var(--secondary); font-weight:500; line-height:1.5;">source: ${apEscapeHtml(ai.source)}</div>` : ''}
            ${result ? `
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="font-size:12px; color:var(--secondary); font-weight:500;">AI 요약</div>
                    <div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.summary || '')}</div>
                    ${keyIssuesHtml ? `<div><div style="font-size:12px; color:var(--secondary); font-weight:500;">핵심 이슈</div>${keyIssuesHtml}</div>` : ''}
                    ${result.next_action_draft ? `<div><div style="font-size:12px; color:var(--secondary); font-weight:500;">다음 조치 초안</div><div style="font-size:13px; color:var(--text); font-weight:500; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.next_action_draft)}</div></div>` : ''}
                </div>
            ` : '<div style="font-size:12px; color:var(--secondary); font-weight:500; line-height:1.5;">상담 내용을 입력한 뒤 AI 요약을 눌러 내부 기록용 요약과 다음 조치 초안을 확인할 수 있습니다.</div>'}
        </div>
    `;
}

function renderConsultationAiPanel(mode) {
    const panel = document.getElementById('consultation-ai-panel-wrap');
    if (panel) panel.innerHTML = consultationAiPanelHtml(mode);
}

async function ensureStudentConsultationsLoaded(sid, options = {}) {
    const store = ensureStudentConsultationUiState();
    const key = String(sid || '');
    if (!key) return getStudentConsultationsFromState(key);

    if (!store.byStudent[key]) {
        store.byStudent[key] = { loadedAt: 0, loading: false, inFlight: null, error: '' };
    }
    const entry = store.byStudent[key];
    const force = !!options.force;
    const maxAgeMs = Number.isFinite(Number(options.maxAgeMs)) ? Number(options.maxAgeMs) : 60 * 1000;
    if (!force && entry.loadedAt && (Date.now() - entry.loadedAt) < maxAgeMs) {
        return getStudentConsultationsFromState(key);
    }
    if (entry.inFlight) return entry.inFlight;

    entry.loading = true;
    entry.error = '';

    const promise = api.get(`consultations?student_id=${encodeURIComponent(key)}`)
        .then(res => {
            if (res?.success && Array.isArray(res.data)) {
                const rows = syncStudentConsultationsInState(key, res.data);
                entry.loadedAt = Date.now();
                entry.loading = false;
                entry.error = '';
                if (options.refresh !== false && shouldRefreshCurrentStudentDetailTab(key, ['basic', 'grade', 'weak', 'cns', 'contact'])) {
                    renderStudentDetailTab(key, state.ui.currentStudentDetailTab || 'basic');
                }
                return rows;
            }
            entry.loading = false;
            entry.error = String(res?.message || res?.error || 'consultations load failed');
            return getStudentConsultationsFromState(key);
        })
        .catch(err => {
            entry.loading = false;
            entry.error = String(err?.message || err || 'consultations load failed');
            return getStudentConsultationsFromState(key);
        })
        .finally(() => {
            entry.inFlight = null;
        });

    entry.inFlight = promise;
    return promise;
}

/**
 * 학생 상세 진입점 (기존 유지)
 */
/**
 * 학생 상세/수정 단일 진입점.
 * options.mode: 'view' | 'edit'
 * options.returnTo: { type, classId, studentId } 등 복귀 컨텍스트
 * 모든 학생 상세 진입은 이 함수를 경유하여 동일한 모달 셸을 사용한다.
 */

function normalizeStudentDetailReturnContext(ctx, sid = '') {
    if (!ctx || typeof ctx !== 'object' || !ctx.type) return null;
    // 학생상세 내부 전환용 self-return은 원래 진입 경로가 아니므로 저장하지 않는다.
    if (ctx.type === 'studentDetail' && (!ctx.studentId || String(ctx.studentId) === String(sid || ''))) return null;
    return { ...ctx };
}

function resolveStudentDetailReturnContext(sid, options = {}) {
    if (!state.ui) state.ui = {};
    const key = String(sid || '');
    const sameStudent = String(state.ui.currentStudentDetailId || '') === key;
    const explicitCtx = normalizeStudentDetailReturnContext(options.returnTo || null, key);
    const preservedCtx = sameStudent ? normalizeStudentDetailReturnContext(state.ui.currentStudentDetailReturnTo || null, key) : null;
    const modalCtx = normalizeStudentDetailReturnContext(state.ui.modalReturnView || null, key);
    const managementCtx = normalizeStudentDetailReturnContext(state.ui.returnView || null, key);
    const nextCtx = explicitCtx || preservedCtx || modalCtx || managementCtx || null;
    state.ui.currentStudentDetailReturnTo = nextCtx;
    return nextCtx;
}

function applyStudentDetailModalReturnContext(returnCtx) {
    if (!state.ui) state.ui = {};
    const safeCtx = returnCtx && returnCtx.type ? returnCtx : null;
    if (typeof setModalReturnView === 'function') setModalReturnView(safeCtx);
    else state.ui.modalReturnView = safeCtx;
}

function returnStudentEditToView(sid, options = {}) {
    const tab = normalizeStudentDetailTab(options.tab || state.ui?.currentStudentDetailTab || 'basic');
    const returnCtx = state.ui?.currentStudentDetailReturnTo || null;
    renderStudentDetailShell(sid, { mode: 'view', tab, returnTo: returnCtx });
    return false;
}

async function openStudentDetail(sid, options = {}) {
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) { toast('학생 정보 없음', 'warn'); return; }
    const mode = options.mode === 'edit' ? 'edit' : 'view';
    if (!state.ui) state.ui = {};

    // 상태를 덮어쓰기 전에 이전 학생/탭을 먼저 저장해야 성적 하위 탭 리셋 판단이 정확하다.
    const oldDetailId = state.ui.currentStudentDetailId;
    const oldTab = state.ui.currentStudentDetailTab || 'basic';
    const sameStudent = String(oldDetailId || '') === String(sid);
    const tab = normalizeStudentDetailTab(options.tab || (sameStudent ? state.ui.currentStudentDetailTab : 'basic') || 'basic');

    // 성적 탭에 새로 진입(다른 탭→성적)하거나 학생이 바뀌면 기본 하위 탭은 학교성적으로 리셋한다.
    // 같은 학생의 grade 탭 내부 하위 탭 전환(oldTab==='grade')은 유지된다.
    if (mode === 'view' && tab === 'grade'
        && (String(oldDetailId || '') !== String(sid) || oldTab !== 'grade')) {
        state.ui.studentGradeSubTab = 'school';
    }

    state.ui.currentStudentDetailId = String(sid);
    state.ui.currentStudentDetailMode = mode;
    if (mode === 'view') state.ui.currentStudentDetailTab = tab;

    const returnCtx = resolveStudentDetailReturnContext(sid, options);
    applyStudentDetailModalReturnContext(returnCtx);

    const exs = (typeof apmsGetExamSessionsForStudent === 'function'
        ? apmsGetExamSessionsForStudent(sid)
        : (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(sid))
    ).slice().sort((a,b)=>String(b.exam_date||'').localeCompare(String(a.exam_date||'')));
    const foundationLoads = [];
    if (typeof loadEnrollmentFoundation === 'function') foundationLoads.push(loadEnrollmentFoundation({ student_id: sid }, { silent: true }));
    if (typeof loadStudentFoundationDetails === 'function') foundationLoads.push(loadStudentFoundationDetails(sid));
    foundationLoads.push(loadStudentOnboardingDetails(sid, { refresh: false }));
    if (foundationLoads.length) await Promise.all(foundationLoads);

    renderStudentDetailShell(sid, { mode, tab, returnTo: returnCtx, skipLazyKick: true });

    void ensureBlueprintsForSessions(exs).catch(() => {});
    void ensureStudentDetailLazyData(sid, { refresh: false });
    void ensureStudentConsultationsLoaded(sid, { refresh: false });
    void ensureStudentParentContactDataLoaded(sid, { refresh: false });
    void ensureStudentParentMessageLogsLoaded(sid, { refresh: false });
    void loadStudentOnboardingDetails(sid, { refresh: false });
}

// 기존 호출 호환용 wrapper (삭제 금지)
async function renderStudentDetail(sid, options = {}) {
    return openStudentDetail(sid, { ...options, mode: 'view', tab: options.tab || 'basic' });
}

function returnFromStudentFlow(ctx = null) {
    if (typeof returnToPreviousManagementView === 'function') {
        return returnToPreviousManagementView('dashboard', ctx);
    }

    closeModal();
    if (ctx?.type === 'addressBook' && typeof openAddressBook === 'function') return openAddressBook();
    if (ctx?.type === 'classDetail' && ctx.classId && typeof renderClass === 'function') return renderClass(ctx.classId);
    if (ctx?.type === 'studentDetail' && ctx.studentId && typeof renderStudentDetail === 'function') return renderStudentDetail(ctx.studentId);
    if (typeof renderDashboard === 'function') return renderDashboard();
}

function mergeStudentIntoState(student) {
    if (!student || !student.id) return null;
    if (!state.db.students) state.db.students = [];
    const sid = String(student.id);
    const idx = state.db.students.findIndex(s => String(s.id) === sid);
    if (idx > -1) state.db.students[idx] = { ...state.db.students[idx], ...student };
    else state.db.students.push(student);
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
    return student;
}

function mergeClassStudentIntoState(classStudent) {
    if (!classStudent || !classStudent.student_id) return null;
    if (!state.db.class_students) state.db.class_students = [];
    const sid = String(classStudent.student_id);
    const cid = String(classStudent.class_id || '');
    state.db.class_students = state.db.class_students.filter(m => String(m.student_id) !== sid);
    if (cid) state.db.class_students.push({ ...classStudent, class_id: cid, student_id: sid });
    if (typeof apmsInvalidateDataIndexes === 'function') apmsInvalidateDataIndexes();
    return cid ? classStudent : null;
}

function mergeStudentCreateResponseIntoState(response = {}) {
    if (response.student) mergeStudentIntoState(response.student);
    if (Object.prototype.hasOwnProperty.call(response, 'class_student')) {
        mergeClassStudentIntoState(response.class_student);
    }
    return response.student || null;
}

function refreshCurrentStudentListViewAfterMutation(returnCtx = null) {
    if (returnCtx?.type === 'classDetail' && returnCtx.classId && typeof renderClass === 'function') return renderClass(returnCtx.classId);
    if (returnCtx?.type === 'studentDetail' && returnCtx.studentId && typeof renderStudentDetail === 'function') return renderStudentDetail(returnCtx.studentId);
    if (returnCtx?.type === 'addressBook' && typeof openAddressBook === 'function') return openAddressBook();
    if (state.ui?.currentClassId && typeof renderClass === 'function') return renderClass(state.ui.currentClassId);
    if (typeof renderDashboard === 'function') return renderDashboard();
    return null;
}

function apmsStudentDetailEsc(value) {
    return typeof apEscapeHtml === 'function'
        ? apEscapeHtml(value)
        : String(value ?? '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

function apmsStudentJsString(value) {
    const raw = JSON.stringify(String(value ?? ''));
    return typeof apEscapeHtml === 'function'
        ? apEscapeHtml(raw)
        : raw
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

function apmsStudentStatusMeta(student) {
    if (!student) return { label: '미등록', className: 'is-muted' };
    const status = String(student.status || '재원').trim() || '재원';
    if (status === '재원' && isStudentOnLeave(student)) return { label: '휴원', className: 'is-leave' };
    if (status === '재원') return { label: '재원', className: 'is-active' };
    if (status === '제적' || status === '퇴원') return { label: '퇴원', className: 'is-archived' };
    if (status === '휴원') return { label: '휴원', className: 'is-leave' };
    return { label: status, className: 'is-muted' };
}

function renderApmsStudentStatusBadge(student) {
    const meta = apmsStudentStatusMeta(student);
    return `<span class="apms-eie-status ${meta.className}">${apmsStudentDetailEsc(meta.label)}</span>`;
}

function renderApmsStudentField(label, value) {
    const text = String(value ?? '').trim();
    return `<div class="apms-eie-field"><span>${apmsStudentDetailEsc(label)}</span><strong>${apmsStudentDetailEsc(text || '미등록')}</strong></div>`;
}

function getApmsStudentClassRows(sid) {
    const ids = (state.db.class_students || [])
        .filter(m => String(m.student_id) === String(sid))
        .map(m => String(m.class_id || ''))
        .filter(Boolean);
    return ids
        .map(id => (state.db.classes || []).find(c => String(c.id) === id))
        .filter(Boolean);
}

function renderApmsStudentProfileDeck(student, cls) {
    const sid = String(student.id || '');
    const classRows = getApmsStudentClassRows(sid);
    const primaryClass = cls || classRows[0] || null;
    const schoolGrade = [student.school_name, student.grade].filter(Boolean).join(' · ');
    const parentLabel = student.guardian_relation || '보호자';
    const contactRows = [
        { label: '학생 연락처', value: student.student_phone || '', action: student.student_phone || '' },
        { label: `${parentLabel} 연락처`, value: student.parent_phone || '', action: student.parent_phone || '' }
    ];
    const classSummary = classRows.length
        ? classRows.map(row => [row.name, row.teacher_name, row.schedule_text || row.schedule_note].filter(Boolean).join(' · ')).join('\n')
        : (primaryClass?.name || '');

    return `
        <div class="apms-eie-profile-grid">
            <section class="apms-eie-card">
                <div class="apms-eie-section-head"><h3>기본정보</h3><span>AP Math</span></div>
                <div class="apms-eie-field-grid">
                    ${renderApmsStudentField('학교/학년', schoolGrade)}
                    ${renderApmsStudentField('현재 반', primaryClass?.name || '')}
                    ${renderApmsStudentField('상태', apmsStudentStatusMeta(student).label)}
                    ${renderApmsStudentField('PIN', student.student_pin || '')}
                </div>
                <div class="apms-eie-note"><span>메모</span><p>${apmsStudentDetailEsc('')}</p></div>
            </section>
            <section class="apms-eie-card">
                <div class="apms-eie-section-head"><h3>연락처</h3><span>${contactRows.filter(row => row.value).length}개</span></div>
                ${contactRows.map(row => `
                    <div class="apms-eie-contact-row">
                        <div><strong>${apmsStudentDetailEsc(row.label)}</strong><span>${apmsStudentDetailEsc(row.value || '미등록')}</span></div>
                        ${row.action ? `<button type="button" onclick="copyPhoneNumber(${apmsStudentJsString(row.action)})">복사</button>` : '<button type="button" disabled>미등록</button>'}
                    </div>
                `).join('')}
            </section>
            <section class="apms-eie-card">
                <div class="apms-eie-section-head"><h3>수업 배정</h3><span>${classRows.length || (primaryClass ? 1 : 0)}개</span></div>
                ${classSummary ? `<div class="apms-eie-note" style="margin-top:0;"><span>배정 정보</span><p>${apmsStudentDetailEsc(classSummary)}</p></div>` : '<p style="margin:0;color:var(--secondary);font-size:13px;font-weight:500;">배정된 반이 없습니다.</p>'}
            </section>
            <section class="apms-eie-card">
                <div class="apms-eie-section-head"><h3>빠른 작업</h3><span>관리</span></div>
                <div class="apms-eie-field-grid">
                    ${renderApmsStudentField('최근 상담', (getStudentConsultationsFromState(sid)[0]?.date || '기록 없음'))}
                    ${renderApmsStudentField('누적 시험', String((state.db.exam_sessions || []).filter(e => String(e.student_id) === sid).length))}
                </div>
            </section>
        </div>
    `;
}

function getApStudentCurrentClass(sid) {
    const mapping = (state.db.class_students || []).find(m => String(m.student_id) === String(sid));
    return (state.db.classes || []).find(c => String(c.id) === String(mapping?.class_id || '')) || null;
}

// 담임명 안전 탐색 (API 호출/DB 수정 없이 state.db 안에서만). 없으면 빈 문자열.
function getStudentHomeroomTeacherLabel(student) {
    const s = student || {};
    const direct = String(
        s.teacher_name || s.homeroom_teacher || s.class_teacher || s.teacher || ''
    ).trim();
    if (direct) return direct;
    let cls = null;
    if (s.class_id || s.classId) {
        cls = (state.db.classes || []).find(c => String(c.id) === String(s.class_id || s.classId || '')) || null;
    }
    if (!cls && s.id) cls = getApStudentCurrentClass(s.id);
    const fromClass = String(
        cls?.teacher_name || cls?.teacher || cls?.homeroom_teacher || ''
    ).trim();
    return fromClass;
}

function ensureStudentOnboardingUiState() {
    if (!state.ui) state.ui = {};
    if (!state.ui.studentOnboardingDetails) {
        state.ui.studentOnboardingDetails = { byStudent: {}, inFlight: {} };
    }
    if (!state.ui.studentOnboardingDetails.byStudent) state.ui.studentOnboardingDetails.byStudent = {};
    if (!state.ui.studentOnboardingDetails.inFlight) state.ui.studentOnboardingDetails.inFlight = {};
    return state.ui.studentOnboardingDetails;
}

function getStudentOnboardingEntry(sid) {
    const key = String(sid || '');
    const store = ensureStudentOnboardingUiState();
    if (!store.byStudent[key]) {
        store.byStudent[key] = {
            loading: false,
            loadedAt: 0,
            error: '',
            onboarding_started_at: '',
            already_attending: false,
            tasks: []
        };
    }
    return store.byStudent[key];
}

function normalizeOnboardingDate(value) {
    const text = String(value || '').trim().split('T')[0].split(' ')[0];
    return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : '';
}

function getStudentOnboardingStartedAtFromStudentRow(sid) {
    const student = (state.db.students || []).find(st => String(st.id) === String(sid));
    return normalizeOnboardingDate(
        student?.onboarding_started_at ||
        student?.onboardingStartedAt ||
        student?.enrollment_started_at ||
        student?.enrollmentStartedAt ||
        ''
    );
}

function setStudentOnboardingStartedAtInState(sid, value) {
    const date = normalizeOnboardingDate(value);
    if (!sid || !date) return;
    const student = (state.db.students || []).find(st => String(st.id) === String(sid));
    if (student) student.onboarding_started_at = date;
}

function getStudentOnboardingStartedAt(sid) {
    return getStudentOnboardingStartedAtFromStudentRow(sid) || normalizeOnboardingDate(getStudentOnboardingEntry(sid).onboarding_started_at);
}

function getStudentOnboardingStartedAtLabel(sid) {
    const date = getStudentOnboardingStartedAt(sid);
    if (date) return date;
    const entry = getStudentOnboardingEntry(sid);
    if (entry.loading) return '불러오는 중';
    return '미등록';
}

function syncStudentOnboardingEntry(sid, payload = {}) {
    const entry = getStudentOnboardingEntry(sid);
    const rows = Array.isArray(payload.tasks) ? payload.tasks : entry.tasks;
    entry.tasks = rows;
    const incomingStartedAt = normalizeOnboardingDate(payload.onboarding_started_at || payload.onboardingStartedAt || '');
    const studentRowStartedAt = getStudentOnboardingStartedAtFromStudentRow(sid);
    entry.onboarding_started_at = studentRowStartedAt || incomingStartedAt || normalizeOnboardingDate(entry.onboarding_started_at);
    // students row가 등원일의 1차 원본이다. onboarding 응답은 row 값이 없을 때만 보조 backfill한다.
    if (incomingStartedAt && !studentRowStartedAt) setStudentOnboardingStartedAtInState(sid, incomingStartedAt);
    entry.already_attending = !!(payload.already_attending || payload.alreadyAttending || rows.some(row => String(row?.status || '') === 'skipped' && String(row?.notes || '').includes('이미 등원 중')));
    entry.loadedAt = Date.now();
    entry.loading = false;
    entry.error = '';
    return entry;
}

async function loadStudentOnboardingDetails(sid, options = {}) {
    const key = String(sid || '').trim();
    if (!key) return getStudentOnboardingEntry(key);
    const store = ensureStudentOnboardingUiState();
    const entry = getStudentOnboardingEntry(key);
    const force = !!options.force;
    const maxAgeMs = Number.isFinite(Number(options.maxAgeMs)) ? Number(options.maxAgeMs) : 60 * 1000;
    if (!force && entry.loadedAt && (Date.now() - entry.loadedAt) < maxAgeMs) return entry;
    if (store.inFlight[key]) return store.inFlight[key];

    entry.loading = true;
    entry.error = '';
    const classId = String(options.classId || getApStudentCurrentClass(key)?.id || '').trim();
    const query = [`student_id=${encodeURIComponent(key)}`];
    if (classId) query.push(`class_id=${encodeURIComponent(classId)}`);

    const promise = api.get(`onboarding/student?${query.join('&')}`)
        .then(res => {
            if (res?.success) return syncStudentOnboardingEntry(key, res);
            entry.error = String(res?.error || res?.message || 'onboarding load failed');
            return entry;
        })
        .catch(err => {
            entry.error = String(err?.message || err || 'onboarding load failed');
            return entry;
        })
        .finally(() => {
            entry.loading = false;
            store.inFlight[key] = null;
            if (options.refresh !== false && shouldRefreshCurrentStudentDetailTab(key, ['basic'])) {
                renderStudentDetailTab(key, 'basic');
            }
        });

    store.inFlight[key] = promise;
    return promise;
}

function apStudentConsultationDateLabel(value) {
    const raw = String(value || '').trim();
    if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(5, 10);
    return raw || '날짜 없음';
}

function apStudentDetailField(label, value, options = {}) {
    const text = String(value ?? '').trim();
    const wide = options.wide ? ' is-wide' : '';
    return `<div class="ap-student-field${wide}"><span>${apmsStudentDetailEsc(label)}</span><strong>${apmsStudentDetailEsc(text || '미등록')}</strong></div>`;
}

// 보기모드 슬림 label-value row (input처럼 보이는 회색 field box 대체)
function apStudentInfoRow(label, value, options = {}) {
    const text = String(value ?? '').trim();
    const fallback = Object.prototype.hasOwnProperty.call(options, 'empty') ? String(options.empty) : '미등록';
    const isMuted = options.muted || !text;
    const display = text || fallback;
    return `<div class="ap-profile-info-row"><span class="ap-profile-info-label">${apmsStudentDetailEsc(label)}</span><span class="ap-profile-info-value${isMuted ? ' is-muted' : ''}">${apmsStudentDetailEsc(display)}</span></div>`;
}

function apStudentEditRow(label, controlHtml, options = {}) {
    const wide = options.wide ? ' is-wide' : '';
    const idAttr = options.id ? ` id="${apEscapeHtml(options.id)}"` : '';
    const styleAttr = options.style ? ` style="${apEscapeHtml(options.style)}"` : '';
    return `<div class="ap-student-edit-row${wide}"${idAttr}${styleAttr}><span class="ap-student-edit-label">${apmsStudentDetailEsc(label)}</span><div class="ap-student-edit-control">${controlHtml}</div></div>`;
}

function getStudentRecentActivityValues(sid) {
    const cls = getApStudentCurrentClass(sid);
    const recentExam = (state.db.exam_sessions || [])
        .filter(e => String(e.student_id) === String(sid))
        .sort((a, b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))[0];
    const classRecord = cls ? (state.db.class_daily_records || [])
        .filter(row => String(row.class_id) === String(cls.id))
        .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))[0] : null;
    const recentExamText = recentExam ? `${recentExam.exam_title || '시험'} · ${recentExam.exam_date || ''} · ${recentExam.score ?? '-'}점` : '';
    const recentClassText = classRecord ? `${classRecord.date || ''} · ${cls?.name || '수업'}` : '';
    const lastConsult = getStudentConsultationsFromState(sid)[0] || null;
    const lastConsultText = lastConsult ? `${lastConsult.date || ''}${lastConsult.type ? ` (${lastConsult.type})` : ''}`.trim() : '';
    return { recentExamText, recentClassText, lastConsultText };
}

function renderStudentRecentActivitySection(sid) {
    const { recentExamText, recentClassText, lastConsultText } = getStudentRecentActivityValues(sid);
    return `
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>최근 활동</h3></div>
            <div class="ap-profile-info-list">
                ${apStudentInfoRow('최근 수업', recentClassText, { empty: '기록 없음' })}
                ${apStudentInfoRow('최근 시험', recentExamText, { empty: '기록 없음' })}
                ${apStudentInfoRow('마지막 상담', lastConsultText, { empty: '기록 없음' })}
            </div>
        </section>
    `;
}

function renderStudentHistorySection(sid) {
    return `<section class="ap-student-card">${renderStudentOperationHistorySection(sid)}</section>`;
}


function renderStudentDetailHeader(sid, mode = 'view') {
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) return '';
    const cls = getApStudentCurrentClass(sid);
    const status = apmsStudentStatusMeta(s);
    const isEdit = mode === 'edit';
    const actionBtn = isEdit
        ? ''
        : `<button type="button" class="ap-student-edit-btn" onclick="openStudentDetail(${apmsStudentJsString(sid)}, { mode: 'edit' })">수정</button>`;
    const dotClass = status.className || '';
    const teacherLabel = getStudentHomeroomTeacherLabel(s);
    const metaParts = [
        [s.school_name, s.grade].filter(Boolean).join(' · ') || '학교/학년 미등록',
        cls?.name || '반 미배정'
    ];
    // PIN은 헤더에서 제거하고 담임을 우선 표시(없으면 생략).
    metaParts.push(teacherLabel ? `담임 ${teacherLabel}` : '담임 미지정');
    const metaLine = metaParts.map(p => apmsStudentDetailEsc(p)).join(' · ');
    return `
        <header class="ap-student-profile-head ${isEdit ? 'is-edit' : 'is-view'}">
            <div class="ap-student-head-main">
                <div class="ap-student-head-title">
                    <h1>${apmsStudentDetailEsc(s.name || '학생')}</h1>
                    <span class="ap-student-status-dot ${dotClass}"></span>
                    <span class="ap-student-status-text ${dotClass}">${apmsStudentDetailEsc(status.label)}</span>
                </div>
                <div class="ap-student-meta-line">${metaLine}</div>
            </div>
            ${actionBtn ? `<div class="ap-student-head-actions">${actionBtn}</div>` : ''}
        </header>
    `;
}

function renderStudentPinnedConsultationPreviewHtml(sid, consultationId) {
    const rows = getStudentConsultationsFromState(sid);
    const selected = rows.find(row => String(row.id) === String(consultationId)) || rows[0] || null;
    if (!selected) {
        return `
            <div class="ap-student-consult-empty">
                <div style="font-size:14px;font-weight:750;color:var(--text);line-height:1.35;">상담 기록 없음</div>
                <div style="margin-top:5px;font-size:12px;font-weight:600;line-height:1.5;">아직 등록된 상담이 없습니다.</div>
                <div class="ap-student-consult-actions" style="justify-content:center;">
                    <button class="btn ap-student-mini-btn is-primary" onclick="openAddConsultationModal(${apmsStudentJsString(sid)})">+ 첫 상담 기록하기</button>
                </div>
            </div>
        `;
    }

    return `
        <div class="ap-student-consult-row">
            <div class="ap-student-consult-meta">
                <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;">
                    <strong style="color:var(--text);font-size:13px;line-height:1.35;">${apmsStudentDetailEsc(selected.date || '날짜 없음')}</strong>
                    <span class="ap-student-consult-type">${apmsStudentDetailEsc(selected.type || '상담')}</span>
                </div>
                <span style="cursor:pointer;color:#334155;font-size:12px;font-weight:600;" onclick="openEditConsultation(${apmsStudentJsString(selected.id)},${apmsStudentJsString(sid)})">수정</span>
            </div>
            <p class="ap-student-consult-text">${apmsStudentDetailEsc(selected.content || '상담 내용이 없습니다.')}</p>
            ${selected.next_action ? `<div class="ap-student-consult-next"><strong>다음 조치</strong><br>${apmsStudentDetailEsc(selected.next_action)}</div>` : ''}
        </div>
    `;
}

function renderStudentPinnedConsultationPreview(sid, consultationId) {
    if (!state.ui) state.ui = {};
    if (!state.ui.studentPinnedConsultationId) state.ui.studentPinnedConsultationId = {};
    const key = String(sid || '');
    state.ui.studentPinnedConsultationId[key] = String(consultationId || '');

    // 선택 상담이 바뀌면 하단 '다른 상담' 목록에서도 해당 상담을 제외한다(중복 방지).
    refreshStudentConsultationOthersList(key, consultationId);

    const target = document.getElementById(`ap-student-consult-preview-${key}`);
    if (target) {
        target.innerHTML = renderStudentPinnedConsultationPreviewHtml(key, consultationId);
        target.classList.add('is-updated');
        setTimeout(() => target.classList.remove('is-updated'), 900);
        const modalBody = target.closest('#modal-body');
        if (modalBody) {
            const top = target.offsetTop - modalBody.offsetTop - 12;
            modalBody.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        } else if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    const wrap = document.getElementById(`ap-student-consult-pinned-${key}`);
    if (wrap) {
        wrap.querySelectorAll('.ap-student-consult-date-btn').forEach(btn => {
            btn.classList.toggle('is-active', String(btn.getAttribute('data-consultation-id') || '') === String(consultationId || ''));
        });
    }
}

function handleStudentConsultationDateClick(sid, consultationId) {
    renderStudentPinnedConsultationPreview(sid, consultationId);
    return false;
}

function bindStudentConsultationDateButtons(sid = '') {
    const key = String(sid || '');
    document.querySelectorAll('.ap-student-consult-date-btn').forEach(btn => {
        if (key && String(btn.dataset.apConsultSid || '') !== key) return;
        if (btn.dataset.apConsultBound === '1') return;
        btn.dataset.apConsultBound = '1';
        btn.addEventListener('click', event => {
            event.preventDefault();
            event.stopPropagation();
            handleStudentConsultationDateClick(btn.dataset.apConsultSid || key, btn.dataset.consultationId || '');
        });
    });
}

if (typeof window !== 'undefined') {
    window.renderStudentPinnedConsultationPreview = renderStudentPinnedConsultationPreview;
    window.handleStudentConsultationDateClick = handleStudentConsultationDateClick;
    window.bindStudentConsultationDateButtons = bindStudentConsultationDateButtons;
}

function renderStudentConsultationPinnedCard(sid, selectedConsultationId = '') {
    const key = String(sid || '');
    if (!state.ui) state.ui = {};
    if (!state.ui.studentPinnedConsultationId) state.ui.studentPinnedConsultationId = {};
    const rows = getStudentConsultationsFromState(key);
    const storedId = state.ui.studentPinnedConsultationId[key] || '';
    const selectedId = rows.some(row => String(row.id) === String(selectedConsultationId))
        ? String(selectedConsultationId)
        : rows.some(row => String(row.id) === String(storedId))
            ? String(storedId)
            : String(rows[0]?.id || '');
    state.ui.studentPinnedConsultationId[key] = selectedId;
    const recentRows = rows.slice(0, 5);
    const cnsState = ensureStudentConsultationUiState().byStudent[key] || {};

    const dateButtons = recentRows.map(row => `
        <button
            type="button"
            class="ap-student-consult-date-btn ${String(row.id) === selectedId ? 'is-active' : ''}"
            data-ap-consult-sid="${apmsStudentDetailEsc(key)}"
            data-consultation-id="${apmsStudentDetailEsc(row.id)}"
            onclick="return handleStudentConsultationDateClick(${apmsStudentJsString(key)}, ${apmsStudentJsString(row.id)})"
        >${apmsStudentDetailEsc(apStudentConsultationDateLabel(row.date))}</button>
    `).join('');

    return `
        <section class="ap-student-consult-pinned" id="ap-student-consult-pinned-${apmsStudentDetailEsc(key)}">
            <div class="ap-student-section-head">
                <h3>최근 상담</h3>
                <button class="btn ap-student-mini-btn is-primary" onclick="openAddConsultationModal(${apmsStudentJsString(key)})">+ 상담</button>
            </div>
            ${cnsState.loading ? '<div style="margin-bottom:8px;font-size:11px;color:var(--secondary);font-weight:600;">불러오는 중</div>' : ''}
            ${rows.length >= 2 && dateButtons ? `<div class="ap-student-consult-date-row">${dateButtons}</div>` : ''}
            ${cnsState.error ? '<div style="margin-bottom:10px;color:var(--warning);font-size:12px;font-weight:700;">상담 기록을 다시 확인해 주세요.</div>' : ''}
            <div class="ap-student-consult-preview" id="ap-student-consult-preview-${apmsStudentDetailEsc(key)}">
                ${renderStudentPinnedConsultationPreviewHtml(key, selectedId)}
            </div>
        </section>
    `;
}

function renderStudentBasicTab(sid) {
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) return '<div class="ap-student-card">학생 정보를 찾을 수 없습니다.</div>';
    const memo = '';
    const parentInfo = [String(s.parent_phone || '').trim(), String(s.guardian_relation || '').trim() ? `(${String(s.guardian_relation || '').trim()})` : '']
        .filter(Boolean).join(' ');
    return `
        <div class="ap-student-tab-body">
            <section class="ap-student-card">
                <div class="ap-student-section-head">
                    <h3>학생 상세 정보</h3>
                </div>
                <div class="ap-profile-info-list">
                    ${apStudentInfoRow('학생 연락처', s.student_phone, { empty: '' })}
                    ${apStudentInfoRow('보호자 정보', parentInfo, { empty: '' })}
                    ${apStudentInfoRow('주소', s.student_address, { empty: '' })}
                    ${apStudentInfoRow('차량', s.vehicle_info, { empty: '' })}
                    ${apStudentInfoRow('등원일', getStudentOnboardingStartedAtLabel(sid))}
                    ${apStudentInfoRow('메모', memo, { empty: '' })}
                    ${apStudentInfoRow('PIN 번호', s.student_pin, { empty: '' })}
                </div>
            </section>
            ${renderStudentRecentActivitySection(sid)}
            ${renderStudentHistorySection(sid)}
        </div>
    `;
}

function renderStudentContactHistoryTab(sid) {
    return `
        <div class="ap-student-tab-body">
            <section class="ap-student-card">
                ${renderParentContactSection(sid)}
            </section>
            <section class="ap-student-card">
                ${renderStudentOperationHistorySection(sid)}
            </section>
        </div>
    `;
}

// 최종 탭은 기본 / 상담 / 성적 3개. 과거 'weak'/'contact' 진입점은
// 라우트 호환을 위해 흡수된 탭으로 매핑한다(데이터/저장 흐름 영향 없음).
const AP_STUDENT_DETAIL_TABS = ['basic', 'cns', 'grade'];
const AP_STUDENT_DETAIL_TAB_ALIASES = { weak: 'grade', contact: 'basic' };

function normalizeStudentDetailTab(tab = 'basic') {
    const value = String(tab || 'basic');
    if (AP_STUDENT_DETAIL_TABS.includes(value)) return value;
    if (AP_STUDENT_DETAIL_TAB_ALIASES[value]) return AP_STUDENT_DETAIL_TAB_ALIASES[value];
    return 'basic';
}

/**
 * view mode 본문 — tab에 따라 기존 탭 렌더 함수로 분기한다.
 */
function renderStudentViewBody(sid, tab = 'basic') {
    const activeTab = normalizeStudentDetailTab(tab);
    let body = '';
    if (activeTab === 'grade') {
        body = renderGradeTab(sid);
    } else if (activeTab === 'cns') {
        body = renderCnsTab(sid);
    } else {
        body = renderStudentBasicTab(sid);
    }
    return `<div class="std-tab-content ap-student-tab-body">${body}</div>`;
}

/**
 * view mode 탭 버튼 UI.
 */
function renderStudentDetailTabs(sid, activeTab = 'basic') {
    const tab = normalizeStudentDetailTab(activeTab);
    const tabs = [
        { key: 'basic', label: '기본' },
        { key: 'cns', label: '상담' },
        { key: 'grade', label: '성적' }
    ];
    return `
        <div class="apms-eie-tabs ap-student-tabs">
            ${tabs.map(item => `
                <button
                    type="button"
                    class="apms-eie-tab ${item.key === tab ? 'is-active' : ''}"
                    onclick="renderStudentDetailTab(${apmsStudentJsString(sid)}, ${apmsStudentJsString(item.key)})"
                >${apmsStudentDetailEsc(item.label)}</button>
            `).join('')}
        </div>
    `;
}


/**
 * 학생 상세 모달의 유일한 기준 렌더러.
 * view/edit 모두 같은 셸(헤더 + 최근 상담 카드)을 공유하고 본문만 교체한다.
 * view mode는 tab을 보존/분기한다.
 */
function renderStudentDetailShell(sid, options = {}) {
    injectStudentStyles();
    if (!state.ui) state.ui = {};
    const mode = options.mode === 'edit' ? 'edit' : 'view';
    const s = state.db.students.find(st => String(st.id) === String(sid));
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    const previousTab = state.ui.currentStudentDetailTab || 'basic';
    const previousDetailId = state.ui.currentStudentDetailId;
    const previousMode = state.ui.currentStudentDetailMode;
    const tab = normalizeStudentDetailTab(options.tab || previousTab || 'basic');

    // 성적 탭에 새로 진입(다른 탭→성적)하거나 학생이 바뀌면 기본 하위 탭은 학교성적으로 리셋한다.
    // (같은 학생의 학교성적↔원내평가 하위 탭 전환은 previousTab이 이미 'grade'라 리셋되지 않는다.)
    if (mode === 'view' && tab === 'grade'
        && (String(previousDetailId || '') !== String(sid) || previousTab !== 'grade')) {
        state.ui.studentGradeSubTab = 'school';
    }

    // edit 탭 상태: 처음 edit 모드 진입(또는 다른 학생)이면 basic으로 리셋한다.
    if (mode === 'edit' && (String(previousDetailId || '') !== String(sid) || previousMode !== 'edit')) {
        state.ui.currentStudentDetailEditTab = 'basic';
    }
    const editTab = mode === 'edit' ? (state.ui.currentStudentDetailEditTab || 'basic') : 'basic';

    state.ui.currentStudentDetailId = String(sid);
    state.ui.currentStudentDetailMode = mode;
    // edit mode로 들어가도 기존 view tab 기억은 유지한다.
    state.ui.currentStudentDetailTab = mode === 'view' ? tab : (previousTab || tab || 'basic');
    setStudentDetailSubModal('', sid);

    const returnCtx = resolveStudentDetailReturnContext(sid, options);
    applyStudentDetailModalReturnContext(returnCtx);

    const pinnedHtml = (mode === 'view' && tab === 'cns')
        ? renderStudentConsultationPinnedCard(sid)
        : '';
    const bodyHtml = mode === 'edit'
        ? `
            ${renderStudentDetailEditTabs(sid, editTab)}
            ${renderStudentEditBodyForTab(sid, editTab)}
        `
        : `
            ${renderStudentDetailTabs(sid, tab)}
            ${pinnedHtml}
            ${renderStudentViewBody(sid, tab)}
        `;

    // basic 편집 탭에서만 저장 버튼 노출 (cns/grade 탭은 별도 저장 흐름 없음)
    const showSaveBtn = mode === 'edit' && editTab === 'basic';
    const modalTitle = '';
    const shellHtml = `
        <div class="apms-student-contrast apms-student-profile-view ap-student-detail-shell" data-student-detail-mode="${mode}">
            ${renderStudentDetailHeader(sid, mode)}
            ${bodyHtml}
        </div>
    `;

    // [깜박임 핫픽스] 같은 학생상세(view)가 이미 열려 있으면 모달을 다시 띄우지(showModal) 않고
    // 셸 내부만 조용히 교체한다. 비동기 로더 완료 후 자동 재렌더에서 오버레이가 다시 깜박이지 않게 한다.
    // (edit 폼이나 view↔edit 전환은 저장 버튼 상태가 바뀌므로 showModal 경로를 그대로 탄다.)
    const overlayEl = document.getElementById('modal-overlay');
    const modalBodyEl = document.getElementById('modal-body');
    const existingShell = modalBodyEl ? modalBodyEl.querySelector('.ap-student-detail-shell') : null;
    const modalOpen = !!overlayEl && overlayEl.classList.contains('show') && !overlayEl.classList.contains('hidden');
    const canQuietSwap = mode === 'view' && !showSaveBtn && modalOpen && existingShell
        && existingShell.getAttribute('data-student-detail-mode') === 'view';

    if (canQuietSwap) {
        const titleEl = document.getElementById('modal-title');
        if (titleEl) titleEl.innerText = modalTitle;
        modalBodyEl.innerHTML = shellHtml;
        if (typeof updateAppBackButtons === 'function') updateAppBackButtons();
    } else {
        showModal(modalTitle, shellHtml, showSaveBtn ? '저장' : null, showSaveBtn ? () => handleEditStudent(sid) : null);
    }

    const cancelBtn = document.getElementById('modal-cancel-btn');
    if (cancelBtn) {
        cancelBtn.innerText = '취소';
        cancelBtn.onclick = mode === 'edit'
            ? () => returnStudentEditToView(sid, { tab })
            : () => closeModal();
    }

    setTimeout(() => {
        bindStudentConsultationDateButtons(sid);
        if (mode === 'view' && tab === 'grade' && typeof drawGradeChart === 'function') drawGradeChart(sid);
        if (mode === 'edit' && editTab === 'grade' && typeof drawGradeChart === 'function') drawGradeChart(sid);
    }, 0);

    // [중복 lazy 가드] 조용한 부분 교체(자동 로더 후 재렌더)에서는 로더를 다시 깨우지 않는다.
    // 최초/모달 신규 오픈(showModal 경로)에서만 lazy 로딩을 시작해 재렌더 루프를 막는다.
    if (!canQuietSwap && options.skipLazyKick !== true) {
        void ensureStudentConsultationsLoaded(sid);
        void ensureStudentDetailLazyData(sid);
    }
}

/**
 * 기존 탭 호출 호환용 wrapper (삭제 금지). tab을 셸에 그대로 전달한다.
 * edit mode 중 자동 로더가 이 함수를 호출해도
 * shouldRefreshCurrentStudentDetailTab의 edit guard가 호출 자체를 막는다.
 */
function renderStudentDetailTab(sid, tab = 'basic') {
    if (renderStudentDetailTabInPlace(sid, tab)) return;
    return renderStudentDetailShell(sid, {
        mode: 'view',
        tab: normalizeStudentDetailTab(tab),
        returnTo: state.ui?.currentStudentDetailReturnTo || state.ui?.modalReturnView || null
    });
}

function renderStudentDetailTabInPlace(sid, tab = 'basic') {
    const key = String(sid || '');
    const nextTab = normalizeStudentDetailTab(tab);
    if (!key || String(state.ui?.currentStudentDetailId || '') !== key || state.ui?.currentStudentDetailMode !== 'view') return false;

    const overlayEl = document.getElementById('modal-overlay');
    const modalBodyEl = document.getElementById('modal-body');
    const shell = modalBodyEl ? modalBodyEl.querySelector('.ap-student-detail-shell[data-student-detail-mode="view"]') : null;
    const modalOpen = !!overlayEl && overlayEl.classList.contains('show') && !overlayEl.classList.contains('hidden');
    if (!modalOpen || !shell) return false;

    const tabsEl = shell.querySelector('.ap-student-tabs');
    const contentEl = shell.querySelector('.std-tab-content');
    if (!tabsEl || !contentEl) return false;

    const previousTab = normalizeStudentDetailTab(state.ui.currentStudentDetailTab || 'basic');
    if (nextTab === 'grade' && previousTab !== 'grade') {
        state.ui.studentGradeSubTab = 'school';
    }
    state.ui.currentStudentDetailTab = nextTab;

    tabsEl.outerHTML = renderStudentDetailTabs(key, nextTab);
    const freshTabsEl = shell.querySelector('.ap-student-tabs');
    const pinnedEl = shell.querySelector('.ap-student-consult-pinned');
    if (pinnedEl) pinnedEl.remove();
    if (nextTab === 'cns' && freshTabsEl) {
        freshTabsEl.insertAdjacentHTML('afterend', renderStudentConsultationPinnedCard(key));
    }
    contentEl.outerHTML = renderStudentViewBody(key, nextTab);

    if (typeof updateAppBackButtons === 'function') updateAppBackButtons();
    setTimeout(() => {
        bindStudentConsultationDateButtons(key);
        if (nextTab === 'grade' && typeof drawGradeChart === 'function') drawGradeChart(key);
    }, 0);
    return true;
}

/* ============================================================
 * [Tab 1] 성적 탭 — 학교성적/원내평가 하위 탭
 * 학교성적 데이터 규칙은 성적표(cumulative.js)와 동일하게 유지하되,
 * student.js가 cumulative.js보다 먼저 로드되므로(index.html 순서)
 * 학생상세 전용 helper를 독립적으로 둔다. 저장 흐름은 건드리지 않는다.
 * ============================================================ */
const AP_STUDENT_GRADE_SUB_TABS = ['school', 'academy'];
const AP_STUDENT_SCHOOL_EXAM_COLS = [
    { semester: '1학기', examType: 'midterm', label: '1학기 중간' },
    { semester: '1학기', examType: 'final', label: '1학기 기말' },
    { semester: '2학기', examType: 'midterm', label: '2학기 중간' },
    { semester: '2학기', examType: 'final', label: '2학기 기말' }
];
const AP_STUDENT_HIGH_SUBJECTS = ['공통수학1', '공통수학2', '대수', '미적분Ⅰ', '확률과통계', '미적분Ⅱ', '기하'];

function getStudentGradeSubTab() {
    const value = String(state.ui?.studentGradeSubTab || 'school');
    return AP_STUDENT_GRADE_SUB_TABS.includes(value) ? value : 'school';
}

function setStudentGradeSubTab(sid, tab) {
    if (!state.ui) state.ui = {};
    state.ui.studentGradeSubTab = AP_STUDENT_GRADE_SUB_TABS.includes(String(tab)) ? String(tab) : 'school';
    if (!renderStudentDetailTabInPlace(sid, 'grade')) renderStudentDetailTab(sid, 'grade');
}

function renderStudentGradeSubTabs(sid, activeSubTab) {
    const active = AP_STUDENT_GRADE_SUB_TABS.includes(String(activeSubTab)) ? String(activeSubTab) : 'school';
    const tabs = [
        { key: 'school', label: '학교성적' },
        { key: 'academy', label: '원내평가' }
    ];
    return `
        <div class="apms-eie-tabs ap-student-grade-subtabs">
            ${tabs.map(item => `
                <button
                    type="button"
                    class="apms-eie-tab ${item.key === active ? 'is-active' : ''}"
                    onclick="setStudentGradeSubTab(${apmsStudentJsString(sid)}, ${apmsStudentJsString(item.key)})"
                >${apmsStudentDetailEsc(item.label)}</button>
            `).join('')}
        </div>
    `;
}

// cumulative.js의 normalizeSebHighSubjectName과 동일 규칙
function normalizeStudentSchoolSubjectName(subject) {
    const s = String(subject || '').trim();
    if (s === '미적분1') return '미적분Ⅰ';
    if (s === '미적분2') return '미적분Ⅱ';
    if (s === '기하와벡터') return '기하';
    const common = s.replace(/\s+/g, '');
    if (common === '공통수학1' || common === '공통수학Ⅰ' || common === '공통수학I') return '공통수학1';
    if (common === '공통수학2' || common === '공통수학Ⅱ' || common === '공통수학II') return '공통수학2';
    return s;
}

function parseStudentHighSubjects(value) {
    if (Array.isArray(value)) return value.map(normalizeStudentSchoolSubjectName).filter(Boolean);
    const raw = String(value || '').trim();
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(normalizeStudentSchoolSubjectName).filter(Boolean);
    } catch (e) {}
    return raw.split(',').map(normalizeStudentSchoolSubjectName).filter(Boolean);
}

function isStudentDetailHighSchool(student) {
    // cumulative.js가 로드되어 있으면 성적표와 같은 판별(반 정보 포함)을 그대로 쓴다.
    if (typeof isSebHighStudent === 'function') {
        try { return isSebHighStudent(student); } catch (e) {}
    }
    return /고1|고2|고3|고등/.test([student?.grade, student?.school_name].join(' '));
}

function getStudentSchoolExamRecords(sid) {
    return (state.db.school_exam_records || []).filter(r =>
        String(r.student_id) === String(sid) &&
        String(r.is_deleted || 0) !== '1');
}

function getStudentSchoolExamTypeLabel(type) {
    const map = { midterm: '중간', final: '기말', performance: '수행', etc: '기타' };
    const key = String(type || '').trim();
    return map[key] || key || '-';
}

function getStudentSchoolExamSemesterRank(semester) {
    const s = String(semester || '');
    if (s.includes('2')) return 2;
    if (s.includes('1')) return 1;
    return 0;
}

function getStudentSchoolExamTypeRank(type) {
    const t = String(type || '');
    if (t === 'final') return 2;
    if (t === 'midterm') return 1;
    return 0;
}

function sortStudentSchoolExamRecords(records) {
    return [...(records || [])].sort((a, b) => {
        const yearDiff = Number(b.exam_year || 0) - Number(a.exam_year || 0);
        if (yearDiff) return yearDiff;
        const semDiff = getStudentSchoolExamSemesterRank(b.semester) - getStudentSchoolExamSemesterRank(a.semester);
        if (semDiff) return semDiff;
        const typeDiff = getStudentSchoolExamTypeRank(b.exam_type) - getStudentSchoolExamTypeRank(a.exam_type);
        if (typeDiff) return typeDiff;
        const createdDiff = String(b.created_at || '').localeCompare(String(a.created_at || ''));
        if (createdDiff) return createdDiff;
        return String(b.id || '').localeCompare(String(a.id || ''));
    });
}

function getStudentLatestSchoolExamRecord(sid) {
    return sortStudentSchoolExamRecords(getStudentSchoolExamRecords(sid))[0] || null;
}

function getStudentSchoolExamSubjects(sid, records) {
    const student = (state.db.students || []).find(st => String(st.id) === String(sid));
    if (!isStudentDetailHighSchool(student)) return ['수학'];

    const seen = {};
    const subjects = [];
    const push = (subject) => {
        const s = normalizeStudentSchoolSubjectName(subject);
        if (s && !seen[s]) { seen[s] = true; subjects.push(s); }
    };

    const gradeText = [student?.grade, student?.school_name].join(' ');

    // 고1은 기록/high_subjects 유무와 무관하게 공통수학1/2가 항상 후보에 포함된다.
    if (gradeText.includes('고1')) ['공통수학1', '공통수학2'].forEach(push);

    (records || []).forEach(r => push(r.subject));
    parseStudentHighSubjects(student?.high_subjects).forEach(push);

    if (!subjects.length) {
        if (gradeText.includes('고2')) ['대수', '미적분Ⅰ', '확률과통계'].forEach(push);
        else if (gradeText.includes('고3')) ['미적분Ⅱ', '기하'].forEach(push);
    }

    subjects.sort((a, b) => {
        const ai = AP_STUDENT_HIGH_SUBJECTS.indexOf(a);
        const bi = AP_STUDENT_HIGH_SUBJECTS.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b, 'ko');
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
    });
    return subjects;
}

function getStudentSchoolExamScoreForCell(records, year, semester, examType, subject) {
    const subj = normalizeStudentSchoolSubjectName(subject || '수학') || '수학';
    const rec = (records || []).find(r =>
        Number(r.exam_year) === Number(year) &&
        String(r.semester || '') === String(semester || '') &&
        String(r.exam_type || '') === String(examType || '') &&
        normalizeStudentSchoolSubjectName(r.subject || '') === subj);
    if (!rec || rec.score === null || rec.score === undefined || rec.score === '') return null;
    const score = Number(rec.score);
    return Number.isFinite(score) ? score : null;
}

// 빈 상태에서 기존 성적표 화면으로만 이동한다(저장 모달을 새로 만들지 않음).
function openStudentSchoolLedgerFromDetail() {
    if (typeof openSchoolExamLedger !== 'function') {
        toast('성적표 화면을 열 수 없습니다.', 'warn');
        return;
    }
    if (typeof closeModal === 'function') closeModal();
    openSchoolExamLedger();
}

function renderStudentSchoolLatestCard(sid, records) {
    const latest = (records || [])[0];
    if (!latest) return '';
    const student = (state.db.students || []).find(st => String(st.id) === String(sid));
    const hasScore = !(latest.score === null || latest.score === undefined || latest.score === '');
    const scoreNum = Number(latest.score);
    const scoreText = hasScore && Number.isFinite(scoreNum) ? `${scoreNum}점` : '미응시';
    const title = `${latest.exam_year || '-'}년 ${latest.semester || '-'} ${getStudentSchoolExamTypeLabel(latest.exam_type)}`;
    const schoolName = String(latest.school_name || student?.school_name || '').trim();
    const gradeName = String(latest.grade || student?.grade || '').trim();
    return `
        <div class="ap-student-field-grid">
            ${apStudentDetailField('시험', `${title} · ${latest.subject || '수학'}`, { wide: true })}
            ${apStudentDetailField('점수', scoreText)}
            ${apStudentDetailField('학교 · 학년', [schoolName, gradeName].filter(Boolean).join(' · '))}
        </div>
    `;
}

function renderStudentSchoolExamMatrix(sid, records) {
    if (!records || !records.length) return '';
    const latestYear = Number(records[0].exam_year);
    const yearRecords = records.filter(r => Number(r.exam_year) === latestYear);
    const subjects = getStudentSchoolExamSubjects(sid, yearRecords);
    if (!subjects.length) {
        return '<div class="ap-student-score-empty">표시할 과목 정보가 없습니다.</div>';
    }
    const student = (state.db.students || []).find(st => String(st.id) === String(sid));
    const headLabel = isStudentDetailHighSchool(student) ? '과목' : '구분';
    const headCols = AP_STUDENT_SCHOOL_EXAM_COLS.map(col => `<th>${apmsStudentDetailEsc(col.label)}</th>`).join('');
    const rows = subjects.map(subject => {
        const cells = AP_STUDENT_SCHOOL_EXAM_COLS.map(col => {
            const score = getStudentSchoolExamScoreForCell(yearRecords, latestYear, col.semester, col.examType, subject);
            return `<td>${score === null ? '-' : `<span class="ap-student-school-score-chip">${score}점</span>`}</td>`;
        }).join('');
        return `<tr><th scope="row">${apmsStudentDetailEsc(subject)}</th>${cells}</tr>`;
    }).join('');
    return `
        <div class="ap-student-school-score-table-wrap">
            <table class="ap-student-school-score-table">
                <thead><tr><th>${apmsStudentDetailEsc(headLabel)}</th>${headCols}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
    `;
}

function renderStudentSchoolGradeTab(sid) {
    const records = sortStudentSchoolExamRecords(getStudentSchoolExamRecords(sid));
    if (!records.length) {
        return `
            <section class="ap-student-card">
                <div class="ap-student-section-head"><h3>학교 시험 성적</h3><span>성적표 연동</span></div>
                <div class="ap-student-score-empty">
                    성적표에 입력된 학교 시험 성적이 없습니다.
                    <div style="margin-top:10px;"><button class="btn ap-student-mini-btn" onclick="openStudentSchoolLedgerFromDetail()">성적표 열기</button></div>
                </div>
            </section>
        `;
    }
    const latestYear = String(records[0]?.exam_year || '');
    return `
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>최근 학교시험 성적</h3><span>성적표 기준</span></div>
            ${renderStudentSchoolLatestCard(sid, records)}
        </section>
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>성적표 기록</h3><span>${apmsStudentDetailEsc(latestYear)}년 기준</span></div>
            ${renderStudentSchoolExamMatrix(sid, records)}
        </section>
    `;
}

/**
 * 성적 탭 진입점 — 하위 탭(학교성적/원내평가)을 렌더하고 본문을 분기한다.
 */
function renderGradeTab(sid) {
    const subTab = getStudentGradeSubTab();
    const body = subTab === 'academy'
        ? renderStudentAcademyGradeTab(sid)
        : renderStudentSchoolGradeTab(sid);
    return `
        <div class="ap-student-tab-body">
            ${renderStudentGradeSubTabs(sid, subTab)}
            ${body}
        </div>
    `;
}

/**
 * 원내평가 하위 탭 — 기존 exam_sessions 기반 성적 영역(차트/오답/약한 단원) 그대로 유지.
 */
function renderStudentAcademyGradeTab(sid) {
    const exs = (typeof apmsGetExamSessionsForStudent === 'function'
        ? apmsGetExamSessionsForStudent(sid)
        : (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(sid))
    ).slice().sort((a,b)=>String(b.exam_date||'').localeCompare(String(a.exam_date||'')));
    
    const chartArea = exs.length > 0
        ? `<div style="padding: 12px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;">
             <canvas id="studentGradeChart" style="width: 100%; height: 160px;"></canvas>
           </div>`
        : `<div style="padding: 28px 20px; text-align: center; color: var(--secondary); background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; font-size: 13px; font-weight:500; line-height: 1.5;">누적된 성적 기록이 없습니다.</div>`;

    const recentExam = [...exs].sort((a,b)=>String(b.exam_date||'').localeCompare(String(a.exam_date||'')))[0];

    const historyRows = exs.map(e => {
        const wrs = (typeof apmsGetWrongAnswersForSession === 'function'
            ? apmsGetWrongAnswersForSession(e.id)
            : (state.db.wrong_answers || []).filter(w => String(w.session_id) === String(e.id))
        )
            .sort((a,b)=>Number(a.question_id)-Number(b.question_id))
            .map(w => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(e, w.question_id) : `<span style="font-size: 11px; padding: 4px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; margin: 2px; color: var(--text-soft); font-weight: 500;">Q${w.question_id}</span>`)
            .join('');

        return `
            <div style="padding: 12px 2px; border-bottom: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                    <div style="min-width: 0;">
                        <div style="font-size: 13px; font-weight:600; color: var(--text); line-height: 1.4; overflow-wrap: anywhere;">${e.exam_title}</div>
                        <div style="font-size: 12px; color: var(--secondary); font-weight: 500; margin-top: 2px; line-height: 1.5;">${e.exam_date}</div>
                    </div>
                    <div style="font-size: 18px; font-weight:700; color: #334155; line-height: 1.2;">${e.score}점</div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px;">${wrs || '<span style="font-size: 11px; color: var(--secondary); font-weight: 500;">오답 없음</span>'}</div>
                <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                    <button class="btn apms-button apms-button--quiet" style="height: 28px; padding: 0 10px; font-size: 11px; color: #D97706; border: 1px solid rgba(217,118,6,0.25); background: rgba(217,118,6,0.06); border-radius: 7px; font-weight:600; cursor: pointer;" onclick="handleResetSessionWrongs('${e.id}','${sid}')">오답 초기화</button>
                    <button class="btn apms-button apms-button--quiet" style="height: 28px; padding: 0 10px; font-size: 11px; color: var(--error); border: 1px solid rgba(232,65,79,0.22); background: rgba(232,65,79,0.06); border-radius: 7px; font-weight:600; cursor: pointer;" onclick="handleDeleteSession('${e.id}','${sid}')">기록 삭제</button>
                </div>
            </div>
        `;
    }).join('');

    const recentExamCard = recentExam
        ? `<div class="ap-student-field-grid" style="margin-bottom:10px;">
                ${apStudentDetailField('최근 점수', `${recentExam.score ?? '-'}점`)}
                ${apStudentDetailField('시험 날짜', recentExam.exam_date || '-')}
                ${apStudentDetailField('시험명', recentExam.exam_title || '-', { wide: true })}
           </div>`
        : `<div style="padding: 20px; text-align: center; color: var(--secondary); font-size: 13px; font-weight:500; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; margin-bottom:10px;">최근 시험 기록이 없습니다.</div>`;

    const s = state.db.students.find(st => String(st.id) === String(sid));
    const weakUnits = typeof computeStudentWeakUnits === 'function' ? computeStudentWeakUnits(sid) : [];
    const weakHtml = typeof renderWeakUnitSummary === 'function'
        ? renderWeakUnitSummary(weakUnits, '누적 오답 데이터가 없습니다.', { clickable: true, mode: 'student', titlePrefix: `${s?.name || ''} 약한 단원`, context: { targetType: 'student', targetId: sid, targetLabel: s?.name || '' } })
        : '<div style="padding: 16px; text-align: center; color: var(--secondary); font-size: 13px; font-weight:500;">데이터를 불러올 수 없습니다.</div>';

    const nextPoints = Array.isArray(weakUnits)
        ? weakUnits.slice(0, 3).map(u => String(u?.unit || u?.name || u?.label || '').trim()).filter(Boolean)
        : [];
    const nextPointsHtml = nextPoints.length
        ? `<ul style="margin:0; padding-left:18px; color:var(--text); font-size:13px; font-weight:500; line-height:1.7;">${nextPoints.map(p => `<li>${apEscapeHtml(p)} 보완 학습</li>`).join('')}</ul>`
        : '<div style="font-size:13px; color:var(--secondary); font-weight:500; line-height:1.6;">충분한 오답 데이터가 모이면 추천 학습 포인트가 표시됩니다.</div>';

    return `
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>최근 원내평가</h3><span>점수 · 날짜 · 시험명</span></div>
            ${recentExamCard}
        </section>
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>원내 평가 추이</h3><span>최근 추세</span></div>
            ${chartArea}
            <div style="max-height: 360px; overflow-y: auto; padding-right: 2px; margin-top:8px;">${historyRows || '<p style="text-align: center; padding: 16px; color: var(--secondary); font-size: 13px; font-weight:500;">기록 없음</p>'}</div>
        </section>
        <section class="ap-student-card ap-student-card-amber">
            <div class="ap-student-section-head"><h3 style="color:#92400E;">약한 단원 / 오답 유형</h3></div>
            ${weakHtml}
        </section>
        <section class="ap-student-card">
            <div class="ap-student-section-head"><h3>다음 학습 포인트</h3></div>
            ${nextPointsHtml}
        </section>
    `;
}

/**
 * [Tab 2] 취약단원 (16px 제목 및 캡션 규격)
 */
function renderWeakTab(sid) {
    const weakUnits = typeof computeStudentWeakUnits === 'function' ? computeStudentWeakUnits(sid) : [];
    const s = state.db.students.find(st => st.id === sid);

    return `
        <div style="padding: 0 4px;">
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight:500; color: var(--text); line-height: 1.3;">취약 단원 분석</h4>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: var(--secondary); font-weight: 400; line-height: 1.5;">단원을 누르면 상세 오답과 추천 문항을 확인합니다.</p>
            ${typeof renderWeakUnitSummary === 'function' 
                ? renderWeakUnitSummary(weakUnits, '누적 오답 데이터가 없습니다.', { clickable: true, mode: 'student', titlePrefix: `${s.name} 취약 단원`, context: { targetType: 'student', targetId: sid, targetLabel: s.name } })
                : '<div style="padding: 20px; text-align: center; color: var(--secondary); font-size: 13px; font-weight:500;">데이터를 불러올 수 없습니다.</div>'}
        </div>
    `;
}

/**
 * [Tab 3] 상담기록 (18px 라운드 및 13px 본문 규격)
 */
// 단일 상담 카드 마크업
function apStudentConsultationCardHtml(c, sid) {
    return `
        <div class="card apms-card" style="padding: 12px; margin-bottom: 10px; border: 1px solid var(--border); border-radius: 10px; box-shadow: none; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 9px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight:600; color: var(--secondary); line-height: 1.5;">${c.date}</span>
                    <span class="std-badge" style="background: rgba(110,102,201,0.10); color: #6E66C9; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight:600; border: 1px solid rgba(110,102,201,0.18);">${c.type}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="cursor: pointer; color: #334155; font-size: 12px; font-weight:600;" onclick="openEditConsultation('${c.id}', '${sid}')">수정</span>
                    <span style="cursor: pointer; color: var(--error); font-size: 12px; font-weight:600;" onclick="handleDeleteConsultation('${c.id}', '${sid}')">삭제</span>
                </div>
            </div>
            <div style="font-size: 13.5px; font-weight:500; line-height: 1.6; color: var(--text); white-space: pre-wrap;">${apEscapeHtml(c.content)}</div>
            ${c.next_action ? `
                <div style="margin-top: 10px; padding: 9px 10px; background: rgba(217,118,6,0.07); border: 1px solid rgba(217,118,6,0.18); border-radius: 10px; font-size: 12px; color: #92400E; font-weight:600; line-height: 1.55;">
                    <span style="font-weight:700;">조치:</span> ${apEscapeHtml(c.next_action)}
                </div>` : ''}
            ${c.created_at ? `<div style="margin-top: 9px; font-size: 11px; color: var(--secondary); font-weight:500; line-height: 1.5;">등록 시각 ${apEscapeHtml(c.created_at)}</div>` : ''}
        </div>
    `;
}

// 상단 preview에 표시 중인 상담(selectedId)을 제외한 '다른 상담' 목록 본문
function apStudentConsultationOthersBodyHtml(sid, selectedId) {
    const others = getStudentConsultationsFromState(sid).filter(c => String(c.id) !== String(selectedId || ''));
    if (!others.length) return '<div style="text-align: center; padding: 24px; color: var(--secondary); font-size: 13px; font-weight:500;">다른 상담 기록이 없습니다.</div>';
    return others.map(c => apStudentConsultationCardHtml(c, sid)).join('');
}

// preview 선택이 바뀌면 '다른 상담' 목록도 다시 그려 중복 노출을 막는다.
function refreshStudentConsultationOthersList(sid, selectedId) {
    const key = String(sid || '');
    const container = document.getElementById(`ap-student-consult-others-${key}`);
    if (!container) return;
    const others = getStudentConsultationsFromState(key).filter(c => String(c.id) !== String(selectedId || ''));
    container.innerHTML = apStudentConsultationOthersBodyHtml(key, selectedId);
    const summary = document.getElementById(`ap-student-consult-others-summary-${key}`);
    if (summary) summary.textContent = `다른 상담 (${others.length})`;
}

function renderCnsTab(sid) {
    const key = String(sid || '');
    const cnsState = ensureStudentConsultationUiState().byStudent[key] || {};
    const cnsList = getStudentConsultationsFromState(key);
    // 상단 preview에 표시 중인 상담을 하단 목록에서 제외(중복 방지). 선택이 없으면 최신 1건.
    const storedId = state.ui?.studentPinnedConsultationId?.[key] || '';
    const selectedId = cnsList.some(c => String(c.id) === String(storedId)) ? String(storedId) : String(cnsList[0]?.id || '');
    const others = cnsList.filter(c => String(c.id) !== selectedId);
    const listBody = apStudentConsultationOthersBodyHtml(key, selectedId);

    return `
        <div class="ap-student-tab-body">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;">
                <button class="btn ap-student-mini-btn" onclick="openConsultationThreadSummaryModal('${key}')">흐름 요약</button>
            </div>
            ${cnsState.loading ? '<div style="font-size: 12px; color: var(--secondary); font-weight:600;">상담 기록을 불러오는 중입니다.</div>' : ''}
            <details class="ap-student-consult-all">
                <summary><span id="ap-student-consult-others-summary-${key}">다른 상담 (${others.length})</span></summary>
                <div class="ap-student-consult-list" id="ap-student-consult-others-${key}" style="padding:0 12px 12px;">
                    ${listBody}
                </div>
            </details>
        </div>
    `;
}

/**
 * Chart.js 그리기 엔진 (원본 로직 사수)
 */
let currentStudentChart = null;
function drawGradeChart(sid) {
    const canvas = document.getElementById('studentGradeChart');
    if (!canvas) return;
    if (typeof Chart === 'undefined') {
        if (typeof loadChartJsOnce === 'function') {
            loadChartJsOnce().then(() => {
                // 로드 동안 화면이 바뀌었을 수 있으니 canvas 재확인 후 다시 그린다
                if (document.getElementById('studentGradeChart')) drawGradeChart(sid);
            }).catch(() => {});
        }
        return;
    }

    const exs = (typeof apmsGetExamSessionsForStudent === 'function'
        ? apmsGetExamSessionsForStudent(sid)
        : (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(sid))
    ).slice().sort((a,b)=>String(a.exam_date||'').localeCompare(String(b.exam_date||''))).slice(-7);
    if (!exs.length) return;

    if (currentStudentChart) { currentStudentChart.destroy(); }

    const isDark = document.body.classList.contains('dark');
    const primaryColor = '#6E66C9';
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : '#E5E8EB';
    const textColor = isDark ? '#A3B1C6' : '#6B7684';

    currentStudentChart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: exs.map(e => e.exam_date.slice(5)),
            datasets: [{
                label: '점수',
                data: exs.map(e => e.score),
                borderColor: primaryColor,
                backgroundColor: isDark ? 'rgba(110,102,201,0.12)' : 'rgba(110,102,201,0.07)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#fff',
                pointBorderColor: primaryColor,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 0, max: 100, ticks: { color: textColor, font: { weight: 'bold', size: 10 } }, grid: { color: gridColor, drawBorder: false } },
                x: { grid: { display: false }, ticks: { color: textColor, font: { weight: 'bold', size: 10 } } }
            }
        }
    });
}

/**
 * 알림톡 문구 미리보기 (CTA 및 입력창 규격)
 */
function openReportPreview(sid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const s = state.db.students.find(st => st.id === sid);
    const mIds = state.db.class_students.find(m => String(m.student_id) === String(sid));
    
    const lastRecord = (state.db.class_daily_records || [])
        .filter(r => String(r.class_id) === String(mIds?.class_id))
        .sort((a,b) => b.date.localeCompare(a.date))[0];
    
    let progressText = '정규 수업을 진행했습니다.';
    if (lastRecord) {
        const progresses = (state.db.class_daily_progress || []).filter(p => String(p.record_id) === String(lastRecord.id));
        if (progresses.length > 0) {
            progressText = progresses.map(p => `${p.textbook_title_snapshot} ${p.progress_text}`).join(', ') + '를 학습했습니다.';
        }
    }

    const lastCns = (state.db.consultations || []).filter(c => c.student_id === sid).sort((a,b) => b.date.localeCompare(a.date))[0];
    let cnsText = lastCns ? `\n\n[학습 피드백]\n${lastCns.content}` : '';

    const lastExam = (typeof apmsGetExamSessionsForStudent === 'function'
        ? apmsGetExamSessionsForStudent(sid)
        : (state.db.exam_sessions || []).filter(e => String(e.student_id) === String(sid))
    ).slice().sort((a,b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))[0];
    let examText = lastExam ? `\n\n[최근 평가]\n${lastExam.exam_title}: ${lastExam.score}점` : '';

    const template = `안녕하세요 학부모님, AP수학입니다.\n\n오늘 ${s.name}이는 ${progressText}${examText}${cnsText}\n\n궁금하신 점은 언제든 편하게 문의주세요. 감사합니다!`;

    showModal('알림톡 문구 미리보기', `
        <div style="background: var(--surface-2); border: 1px solid var(--border); padding: 16px; border-radius: 18px; margin-bottom: 16px;">
            <p style="margin: 0 0 10px 4px; font-size: 12px; color: var(--secondary); font-weight:500; line-height: 1.5;">내용을 확인하고 필요하면 수정하세요.</p>
            <textarea id="report-preview-text" class="std-input-base" style="height: 280px; text-align: left; background: var(--surface); border: 1px solid var(--border); line-height: 1.7; resize: none; font-size: 14px;">${template}</textarea>
        </div>
    `, '최종 복사하기', () => {
        const text = document.getElementById('report-preview-text').value;
        navigator.clipboard.writeText(text).then(() => {
            toast('문구가 복사되었습니다!', 'success');
            closeModal();
        }).catch(() => {
            toast('복사에 실패했습니다.', 'warn');
        });
    });
}

function openAddParentContactModal(sid) {
    setStudentDetailSubModal('parent-contact-add', sid);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    showStudentDetailSubModalStep('parent-contact-add', sid, '보호자 연락처 추가', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <input id="parent-contact-name" class="std-input-base" placeholder="보호자 이름">
            <input id="parent-contact-relation" class="std-input-base" placeholder="관계">
            <input id="parent-contact-phone" class="std-input-base" placeholder="연락처 (필수)">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:var(--text); cursor:pointer;">
                <input type="checkbox" id="parent-contact-primary" checked style="width:16px; height:16px; accent-color:#6E66C9; cursor:pointer;">
                <span>대표 연락처</span>
            </label>
            <textarea id="parent-contact-memo" class="std-input-base" placeholder="비고 (선택)" style="height:80px;"></textarea>
        </div>
    `, '저장', () => handleSaveParentContact(sid));
}

async function handleSaveParentContact(sid) {
    const payload = {
        student_id: sid,
        name: document.getElementById('parent-contact-name')?.value.trim() || '',
        relation: document.getElementById('parent-contact-relation')?.value.trim() || '',
        phone: document.getElementById('parent-contact-phone')?.value.trim() || '',
        is_primary: document.getElementById('parent-contact-primary')?.checked ? 1 : 0,
        memo: document.getElementById('parent-contact-memo')?.value.trim() || ''
    };
    if (!payload.phone) return toast('연락처를 입력하세요.', 'warn');

    try {
        const result = await api.post('parent-foundation/contacts', payload);
        if (result?.success) {
            toast('보호자 연락처가 저장되었습니다.', 'success');
            closeModal(true);
            await ensureStudentParentContactDataLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'contact');
            return;
        }
        toast(result?.message || result?.error || '보호자 연락처 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleSaveParentContact] failed:', e);
        toast('보호자 연락처 저장 중 오류가 발생했습니다.', 'error');
    }
}

function openEditParentContactModal(sid, contactId) {
    setStudentDetailSubModal('parent-contact-edit', sid);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const contact = getStudentParentContactsFromState(sid).find(row => String(row.id) === String(contactId));
    if (!contact) return toast('보호자 연락처를 찾을 수 없습니다.', 'warn');

    showStudentDetailSubModalStep('parent-contact-edit', sid, '보호자 연락처 수정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <input id="edit-parent-contact-name" class="std-input-base" value="${studentAttr(contact.name || '')}" placeholder="보호자 이름">
            <input id="edit-parent-contact-relation" class="std-input-base" value="${studentAttr(contact.relation || '')}" placeholder="관계">
            <input id="edit-parent-contact-phone" class="std-input-base" value="${studentAttr(contact.phone || '')}" placeholder="연락처 (필수)">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:500; color:var(--text); cursor:pointer;">
                <input type="checkbox" id="edit-parent-contact-primary" ${Number(contact.is_primary) ? 'checked' : ''} style="width:16px; height:16px; accent-color:#6E66C9; cursor:pointer;">
                <span>대표 연락처</span>
            </label>
            <textarea id="edit-parent-contact-memo" class="std-input-base" placeholder="비고 (선택)" style="height:80px;">${apEscapeHtml(contact.memo || '')}</textarea>
        </div>
    `, '수정 완료', () => handleEditParentContact(sid, contactId));
}

async function handleEditParentContact(sid, contactId) {
    const payload = {
        name: document.getElementById('edit-parent-contact-name')?.value.trim() || '',
        relation: document.getElementById('edit-parent-contact-relation')?.value.trim() || '',
        phone: document.getElementById('edit-parent-contact-phone')?.value.trim() || '',
        is_primary: document.getElementById('edit-parent-contact-primary')?.checked ? 1 : 0,
        memo: document.getElementById('edit-parent-contact-memo')?.value.trim() || ''
    };
    if (!payload.phone) return toast('연락처를 입력하세요.', 'warn');

    try {
        const result = await api.patch(`parent-foundation/contacts/${contactId}`, payload);
        if (result?.success) {
            toast('보호자 연락처가 수정되었습니다.', 'info');
            closeModal(true);
            await ensureStudentParentContactDataLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'contact');
            return;
        }
        toast(result?.message || result?.error || '보호자 연락처 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditParentContact] failed:', e);
        toast('보호자 연락처 수정 중 오류가 발생했습니다.', 'error');
    }
}

async function handleDeleteParentContact(sid, contactId) {
    if (!confirm('보호자 연락처를 삭제하시겠습니까?')) return;

    try {
        const result = await api.delete('parent-foundation/contacts', contactId);
        if (result?.success) {
            toast('보호자 연락처가 삭제되었습니다.', 'info');
            await ensureStudentParentContactDataLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'contact');
            return;
        }
        toast(result?.message || result?.error || '보호자 연락처 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteParentContact] failed:', e);
        toast('보호자 연락처 삭제 중 오류가 발생했습니다.', 'error');
    }
}

async function toggleParentConsent(sid, contactId, consentType, nextValue, returnModal = '') {
    const bundle = getStudentParentContactBundle(sid);
    const existing = (bundle.consents || []).find(row =>
        String(row?.parent_contact_id || '') === String(contactId) &&
        String(row?.consent_type || '') === String(consentType) &&
        String(row?.branch || 'all') === PARENT_CONTACT_CONSENT_BRANCH
    );

    const payload = {
        parent_contact_id: contactId,
        student_id: sid,
        branch: PARENT_CONTACT_CONSENT_BRANCH,
        consent_type: consentType,
        is_allowed: nextValue ? 1 : 0
    };

    try {
        const result = existing?.id
            ? await api.patch(`parent-foundation/consents/${existing.id}`, payload)
            : await api.post('parent-foundation/consents', payload);
        if (result?.success) {
            toast('수신동의 상태가 저장되었습니다.', 'success');
            await ensureStudentParentContactDataLoaded(sid, { force: true });
            if (returnModal === 'consent') {
                renderStudentDetailTab(sid, 'contact');
                openParentConsentModal(sid, contactId);
                return;
            }
            renderStudentDetailTab(sid, 'contact');
            return;
        }
        toast(result?.message || result?.error || '수신동의 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[toggleParentConsent] failed:', e);
        toast('수신동의 저장 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 기존 기능 보존 및 규격화 (CRUD Flows)
 */
function renderConsultationTypeOptions(currentType = '') {
    const current = String(currentType || '').trim();
    const baseTypes = ['학습', '태도', '성적', '신입', '기타', '직접입력'];
    // current consultation type fallback: preserve existing DB values that are not in the legacy select list.
    return current && !baseTypes.includes(current)
        ? `<option value="${apEscapeHtml(current)}" selected>${apEscapeHtml(current)}</option>`
        : '';
}

function openAddConsultationModal(sid) {
    setStudentDetailSubModal('consultation-add', sid);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    resetConsultationAiUiState('add', sid, '');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showStudentDetailSubModalStep('consultation-add', sid, '상담 기록 추가', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <div style="flex: 1.2; min-width:0;">
                    <label class="ap-label" for="cns-date">상담일</label>
                    <input type="date" id="cns-date" class="ap-input" value="${todayStr}" style="margin-top:5px;">
                </div>
                <div style="flex: 1; min-width:0;">
                    <label class="ap-label" for="cns-type">상담 유형</label>
                    <select id="cns-type" class="ap-select" style="margin-top:5px;" onchange="document.getElementById('cns-type-custom-wrap').style.display=this.value==='직접입력'?'block':'none';">
                        <option value="학습">학습</option><option value="태도">태도</option><option value="성적">성적</option><option value="신입">신입</option><option value="기타">기타</option><option value="직접입력">직접입력...</option>
                    </select>
                </div>
            </div>
            <div id="cns-type-custom-wrap" style="display:none;">
                <input id="cns-type-custom" class="ap-input" type="text" placeholder="태그 직접 입력">
            </div>
            <div>
                <label class="ap-label" for="cns-content">상담 내용</label>
                <textarea id="cns-content" class="ap-textarea" placeholder="상담 내용을 입력하세요." style="margin-top:5px; min-height:140px;"></textarea>
            </div>
            <div>
                <label class="ap-label" for="cns-action">조치 사항 (선택)</label>
                <textarea id="cns-action" class="ap-textarea" placeholder="조치 사항 (선택)" style="margin-top:5px; min-height:70px;"></textarea>
            </div>
            <div id="consultation-ai-panel-wrap">${consultationAiPanelHtml('add')}</div>
        </div>
    `, '저장', () => handleSaveConsultation(sid));
}

const _consultSaveInFlight = new Set();

async function handleSaveConsultation(sid) {
    const guardKey = `new_${sid}`;
    if (_consultSaveInFlight.has(guardKey)) return;
    _consultSaveInFlight.add(guardKey);
    const btn = document.getElementById('modal-action-btn');
    const origText = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }

    const date = document.getElementById('cns-date').value || new Date().toLocaleDateString('sv-SE');
    const typeRaw = document.getElementById('cns-type').value;
    const type = typeRaw === '직접입력' ? (document.getElementById('cns-type-custom')?.value.trim() || '기타') : typeRaw;
    const content = document.getElementById('cns-content').value.trim();
    const nextAction = document.getElementById('cns-action').value.trim();
    if (!content) {
        toast('상담 내용을 입력하세요.', 'warn');
        _consultSaveInFlight.delete(guardKey);
        if (btn) { btn.disabled = false; btn.textContent = origText || '저장'; }
        return;
    }
    const clientRequestId = (typeof crypto !== 'undefined' && crypto.randomUUID)
        ? crypto.randomUUID()
        : `cnsreq_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    try {
        const r = await api.post('consultations', { studentId: sid, date, type, content, nextAction, clientRequestId });
        if (r?.success) {
            toast('상담 기록이 저장되었습니다.', 'success');
            closeModal(true);
            await ensureStudentConsultationsLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(r?.message || r?.error || '상담 기록 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleSaveConsultation] failed:', e);
        toast('상담 기록 저장 중 오류가 발생했습니다.', 'error');
    } finally {
        _consultSaveInFlight.delete(guardKey);
        if (btn) { btn.disabled = false; btn.textContent = origText || '저장'; }
    }
}

async function generateConsultationAiSummary(mode) {
    const ai = ensureConsultationAiUiState();
    if (ai.loading) return;

    const studentId = String(ai.studentId || '');
    const student = state.db.students.find(row => String(row.id) === studentId);
    const dateInput = document.getElementById(mode === 'edit' ? 'edit-cns-date' : 'cns-date');
    const typeInput = document.getElementById(mode === 'edit' ? 'edit-cns-type' : 'cns-type');
    const contentInput = document.getElementById(mode === 'edit' ? 'edit-cns-content' : 'cns-content');
    const actionInput = document.getElementById(mode === 'edit' ? 'edit-cns-action' : 'cns-action');
    const content = String(contentInput?.value || '').trim();
    if (!content) {
        toast('상담 내용을 입력한 뒤 AI 요약을 실행하세요.', 'warn');
        return;
    }

    ai.loading = true;
    ai.error = '';
    ai.warning = '';
    renderConsultationAiPanel(mode);

    try {
        await ensureStudentConsultationsLoaded(studentId);
        const historyRows = getConsultationHistoryPayloadRows(studentId, {
            excludeId: mode === 'edit' ? ai.consultationId : '',
            limit: 4
        });
        const result = await api.post('ai/consultation-summary', {
            student_id: studentId,
            student_name: student?.name || '',
            grade: student?.grade || '',
            consultation_type: String(typeInput?.value || '').trim(),
            consultation_date: String(dateInput?.value || '').trim() || new Date().toLocaleDateString('sv-SE'),
            content,
            next_action: String(actionInput?.value || '').trim(),
            consultations: historyRows
        });

        if (result?.success) {
            ai.result = {
                summary: String(result.summary || '').trim(),
                key_issues: Array.isArray(result.key_issues) ? result.key_issues : [],
                next_action_draft: String(result.next_action_draft || '').trim()
            };
            ai.warning = String(result.warning || '').trim();
            ai.source = String(result.source || '').trim();
            toast(ai.source === 'fallback' ? 'AI 초안이 대체 모드로 생성되었습니다.' : 'AI 요약이 생성되었습니다.', 'info');
        } else {
            ai.error = String(result?.message || result?.error || 'AI 요약 생성에 실패했습니다.');
        }
    } catch (e) {
        console.error('[generateConsultationAiSummary] failed:', e);
        ai.error = 'AI 요약 생성 중 오류가 발생했습니다.';
    } finally {
        ai.loading = false;
        renderConsultationAiPanel(mode);
    }
}

function applyConsultationAiNextAction(mode) {
    const ai = ensureConsultationAiUiState();
    const draft = String(ai.result?.next_action_draft || '').trim();
    if (!draft) return;
    const actionInput = document.getElementById(mode === 'edit' ? 'edit-cns-action' : 'cns-action');
    if (!actionInput) return;
    actionInput.value = draft;
    toast('다음 조치 초안을 반영했습니다.', 'success');
}

function openEditConsultation(cid, sid) {
    setStudentDetailSubModal('consultation-edit', sid);
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    resetConsultationAiUiState('edit', sid, cid);
    const c = state.db.consultations.find(x => x.id === cid);
    if (!c) return;
    showStudentDetailSubModalStep('consultation-edit', sid, '상담 수정', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <div style="flex: 1.2; min-width:0;">
                    <label class="ap-label" for="edit-cns-date">상담일</label>
                    <input type="date" id="edit-cns-date" class="ap-input" value="${c.date}" style="margin-top:5px;">
                </div>
                <div style="flex: 1; min-width:0;">
                    <label class="ap-label" for="edit-cns-type">상담 유형</label>
                    <select id="edit-cns-type" class="ap-select" style="margin-top:5px;" onchange="document.getElementById('edit-cns-type-custom-wrap').style.display=this.value==='직접입력'?'block':'none';">
                        ${renderConsultationTypeOptions(c.type)}
                        <option value="학습" ${c.type==='학습'?'selected':''}>학습</option>
                        <option value="태도" ${c.type==='태도'?'selected':''}>태도</option>
                        <option value="성적" ${c.type==='성적'?'selected':''}>성적</option>
                        <option value="신입" ${c.type==='신입'?'selected':''}>신입</option>
                        <option value="기타" ${c.type==='기타'?'selected':''}>기타</option>
                        <option value="직접입력">직접입력...</option>
                    </select>
                </div>
            </div>
            <div id="edit-cns-type-custom-wrap" style="display:none;">
                <input id="edit-cns-type-custom" class="ap-input" type="text" placeholder="태그 직접 입력">
            </div>
            <div>
                <label class="ap-label" for="edit-cns-content">상담 내용</label>
                <textarea id="edit-cns-content" class="ap-textarea" style="margin-top:5px; min-height:140px;">${apEscapeHtml(c.content || '')}</textarea>
            </div>
            <div>
                <label class="ap-label" for="edit-cns-action">조치 사항 (선택)</label>
                <textarea id="edit-cns-action" class="ap-textarea" style="margin-top:5px; min-height:70px;">${apEscapeHtml(c.next_action || '')}</textarea>
            </div>
            <div id="consultation-ai-panel-wrap">${consultationAiPanelHtml('edit')}</div>
        </div>
    `, '수정 완료', () => handleEditConsultation(cid, sid));
}

async function handleEditConsultation(cid, sid) {
    if (_consultSaveInFlight.has(cid)) return;
    _consultSaveInFlight.add(cid);
    const btn = document.getElementById('modal-action-btn');
    const origText = btn ? btn.textContent : null;
    if (btn) { btn.disabled = true; btn.textContent = '저장 중...'; }

    const date = document.getElementById('edit-cns-date')?.value || '';
    const typeRaw = document.getElementById('edit-cns-type')?.value || '';
    const type = typeRaw === '직접입력' ? (document.getElementById('edit-cns-type-custom')?.value.trim() || '기타') : typeRaw;
    const content = document.getElementById('edit-cns-content')?.value.trim() || '';
    const nextAction = document.getElementById('edit-cns-action')?.value.trim() || '';
    if (!content) {
        toast('상담 내용을 입력하세요.', 'warn');
        _consultSaveInFlight.delete(cid);
        if (btn) { btn.disabled = false; btn.textContent = origText || '수정 완료'; }
        return;
    }

    try {
        const r = await api.patch(`consultations/${cid}`, { date, type, content, nextAction });
        if (r?.success) {
            toast('상담 기록이 수정되었습니다.', 'info');
            closeModal(true);
            await ensureStudentConsultationsLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(r?.message || r?.error || '상담 기록 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditConsultation] failed:', e);
        toast('상담 기록 수정 중 오류가 발생했습니다.', 'error');
    } finally {
        _consultSaveInFlight.delete(cid);
        if (btn) { btn.disabled = false; btn.textContent = origText || '수정 완료'; }
    }
}

async function handleDeleteConsultation(cid, sid) {
    if (!confirm('상담 기록을 삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('consultations', cid);
        if (r?.success) {
            toast('상담 기록이 삭제되었습니다.', 'info');
            await ensureStudentConsultationsLoaded(sid, { force: true });
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(r?.message || r?.error || '상담 기록 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteConsultation] failed:', e);
        toast('상담 기록 삭제 중 오류가 발생했습니다.', 'error');
    }
}


async function handleDeleteSession(eid, sid) {
    if (!confirm('시험 기록을 삭제하시겠습니까?')) return;

    try {
        const r = await api.delete('exam-sessions', eid);
        if (r?.success) {
            toast('시험 기록이 삭제되었습니다.', 'info');
            await loadData();
            renderStudentDetailTab(sid, 'grade');
            return;
        }
        toast(r?.message || r?.error || '시험 기록 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteSession] failed:', e);
        toast('시험 기록 삭제 중 오류가 발생했습니다.', 'error');
    }
}

async function handleResetSessionWrongs(eid, sid) {
    if (!confirm('오답만 초기화하시겠습니까?')) return;

    try {
        const r = await api.delete('exam-sessions', `${eid}/wrongs`);
        if (r?.success) {
            toast('오답이 초기화되었습니다.', 'info');
            await loadData();
            renderStudentDetailTab(sid, 'grade');
            return;
        }
        toast(r?.message || r?.error || '오답 초기화에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleResetSessionWrongs] failed:', e);
        toast('오답 초기화 중 오류가 발생했습니다.', 'error');
    }
}


