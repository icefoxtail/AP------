/**
 * AP Math OS 1.0 [classroom_ui_patch.js]
 * classroom.js UI 표준화 1차 패치 — 방어형 수정본
 *
 * 변경 범위:
 * - renderClass(): opToolsPanel, statusBarHtml, 학생 명단 테이블
 * - AP_UI_DS / AP_DASH_DS 토큰 fallback 적용
 *
 * 건드리지 않은 것:
 * - attStyle / hwStyle 출결·숙제 상태 버튼 색상
 * - toggleAtt / toggleHw 로직
 * - QR/OMR, 시험성적, 클리닉 관련 함수
 * - openClassRecordModal, saveClassRecord
 * - renderAttendanceLedger, renderLedgerTable
 */

// ============================================================
// [공통 토큰] classroom UI — dashboard/ui 기준 공유
// ============================================================
window.AP_UI_DS = window.AP_UI_DS || window.AP_DASH_DS || {
    x:      '16px',
    r:      '16px',
    rSm:    '10px',
    fs:     '15px',
    fsSub:  '13px',
    fsTag:  '11px',
    fw:     '800',
    fwBold: '900',
};

// ============================================================
// [학급 메인 화면] renderClass — UI 표준화 1차
// ============================================================
function renderClass(cid) {
    injectClassroomStyles();

    const root = document.getElementById('app-root');
    if (!root) return;

    const ds = window.AP_UI_DS || window.AP_DASH_DS || {
        x: '16px',
        r: '16px',
        rSm: '10px',
        fs: '15px',
        fsSub: '13px',
        fsTag: '11px',
        fw: '800',
        fwBold: '900',
    };

    state.ui.currentClassId = String(cid);

    const cls = (state.db.classes || []).find(c => String(c.id) === String(cid));
    if (!cls) {
        root.innerHTML = `
            <div style="
                padding:24px ${ds.x};
                color:var(--error);
                font-size:${ds.fsSub};
                font-weight:${ds.fwBold};
            ">
                학급 정보를 찾을 수 없습니다.
            </div>
        `;
        return;
    }

    const mIds = (state.db.class_students || [])
        .filter(m => String(m.class_id) === String(cid))
        .map(m => String(m.student_id));

    const today = new Date().toLocaleDateString('sv-SE');

    const summary = typeof computeClassTodaySummary === 'function'
        ? computeClassTodaySummary(cid)
        : { isScheduled: true, att: 0, hw: 0, total: 0 };

    const icons = {
        qr:     `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
        grade:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20V10M18 20V4M6 20v-4"></path></svg>`,
        clinic: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path></svg>`,
        edit:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path></svg>`
    };

    // [1] 상단 툴바
    const opToolsPanel = `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:0 ${ds.x} 0;
            margin-bottom:20px;
            gap:12px;
            box-sizing:border-box;
        ">
            <div style="display:flex; align-items:center; gap:12px; min-width:0;">
                <button
                    class="btn"
                    onclick="openAppDrawer()"
                    style="
                        width:40px;
                        height:40px;
                        padding:0;
                        flex:0 0 auto;
                        cursor:pointer;
                        border:1px solid var(--border);
                        border-radius:${ds.rSm};
                        background:var(--surface);
                        color:var(--text);
                        display:flex;
                        align-items:center;
                        justify-content:center;
                    "
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <div style="min-width:0;">
                    <div style="
                        font-size:20px;
                        font-weight:${ds.fwBold};
                        color:var(--text);
                        letter-spacing:-0.5px;
                        line-height:1.2;
                    ">${apEscapeHtml(cls.name)}</div>
                    <div style="
                        font-size:${ds.fsTag};
                        font-weight:${ds.fw};
                        color:var(--secondary);
                        margin-top:2px;
                        line-height:1.5;
                    ">${typeof formatClassScheduleDays === 'function' ? formatClassScheduleDays(cls.schedule_days) : ''}</div>
                </div>
            </div>

            <button
                class="btn"
                onclick="renderDashboard()"
                style="
                    height:40px;
                    padding:0 14px;
                    font-size:${ds.fsSub};
                    font-weight:${ds.fw};
                    cursor:pointer;
                    background:var(--surface-2);
                    border:1px solid var(--border);
                    border-radius:${ds.rSm};
                    color:var(--secondary);
                    white-space:nowrap;
                "
            >닫기</button>
        </div>

        <div style="
            display:grid;
            grid-template-columns:repeat(4, 1fr);
            gap:10px;
            padding:0 ${ds.x};
            margin-bottom:20px;
            box-sizing:border-box;
        ">
            <button class="btn" style="
                padding:14px 4px;
                font-size:${ds.fsTag};
                font-weight:${ds.fw};
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                border-radius:${ds.r};
                cursor:pointer;
                background:var(--surface);
                border:1px solid var(--border);
                color:var(--text);
                line-height:1.2;
            " onclick="openQrGenerator('${cid}')">
                <span style="color:var(--primary);">${icons.qr}</span>
                <span>QR/OMR</span>
            </button>

            <button class="btn" style="
                padding:14px 4px;
                font-size:${ds.fsTag};
                font-weight:${ds.fw};
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                border-radius:${ds.r};
                cursor:pointer;
                background:var(--surface);
                border:1px solid var(--border);
                color:var(--text);
                line-height:1.2;
            " onclick="openExamGradeView('${cid}')">
                <span style="color:var(--primary);">${icons.grade}</span>
                <span>시험성적</span>
            </button>

            <button class="btn" style="
                padding:14px 4px;
                font-size:${ds.fsTag};
                font-weight:${ds.fw};
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                border-radius:${ds.r};
                cursor:pointer;
                background:var(--surface);
                border:1px solid var(--border);
                color:var(--text);
                line-height:1.2;
            " onclick="if(typeof openClinicBasketForClass==='function') openClinicBasketForClass('${cid}'); else toast('클리닉 준비중','warn');">
                <span style="color:var(--primary);">${icons.clinic}</span>
                <span>클리닉</span>
            </button>

            <button class="btn btn-primary" style="
                padding:14px 4px;
                font-size:${ds.fsTag};
                font-weight:${ds.fw};
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:8px;
                border-radius:${ds.r};
                cursor:pointer;
                line-height:1.2;
            " onclick="openClassRecordModal('${cid}')">
                <span style="color:#fff;">${icons.edit}</span>
                <span>진도관리</span>
            </button>
        </div>
    `;

    // [2] 오늘 현황 바
    const statusBarHtml = summary.isScheduled
        ? `<div style="display:flex; gap:12px; align-items:center; justify-content:flex-end; flex-wrap:wrap; text-align:left;">
               <span style="font-size:${ds.fsSub}; font-weight:${ds.fw}; color:var(--secondary);">
                   출석 <b style="font-weight:${ds.fwBold}; color:var(--text);">${summary.att || 0}/${summary.total || 0}</b>
               </span>
               <span style="width:1px; height:12px; background:var(--border);"></span>
               <span style="font-size:${ds.fsSub}; font-weight:${ds.fw}; color:var(--secondary);">
                   숙제 <b style="font-weight:${ds.fwBold}; color:var(--text);">${summary.hw || 0}/${summary.total || 0}</b>
               </span>
           </div>`
        : `<span style="font-size:${ds.fsSub}; font-weight:${ds.fw}; color:var(--secondary);">정규 수업일 아님</span>`;

    // [3] 학생 명단 테이블
    const stds = (state.db.students || []).filter(s => mIds.includes(String(s.id)) && s.status === '재원');

    const tableRows = stds.map(s => {
        const att = (state.db.attendance || []).find(a => String(a.student_id) === String(s.id) && a.date === today);
        const hw  = (state.db.homework || []).find(h => String(h.student_id) === String(s.id) && h.date === today);

        const attStatus = att?.status || '등원';
        const hwStatus  = hw?.status  || '완료';

        // 출결·숙제 상태 색상 — 기능 의미 보존, 건드리지 않음
        const attStyle = attStatus === '등원'
            ? 'background:rgba(0,208,132,0.08); color:var(--success); border:1px solid rgba(0,208,132,0.15);'
            : 'background:rgba(255,71,87,0.08); color:var(--error); font-weight:950; border:1px solid rgba(255,71,87,0.15);';

        const hwStyle = hwStatus === '완료'
            ? 'background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);'
            : 'background:rgba(255,165,2,0.12); color:var(--warning); font-weight:950; border:1px solid rgba(255,165,2,0.15);';

        return `
            <tr style="border-bottom:1px solid var(--border);">
                <td
                    onclick="renderStudentDetail('${s.id}')"
                    style="
                        padding:14px ${ds.x};
                        cursor:pointer;
                        font-size:${ds.fs};
                        font-weight:${ds.fwBold};
                        color:var(--primary);
                        line-height:1.4;
                    "
                >${apEscapeHtml(s.name)}</td>

                <td style="
                    padding:14px 4px;
                    font-size:${ds.fsSub};
                    font-weight:${ds.fw};
                    color:var(--secondary);
                    line-height:1.5;
                ">${apEscapeHtml(s.school_name || '')}</td>

                <td style="padding:14px ${ds.x}; text-align:right; white-space:nowrap;">
                    <button class="btn" style="
                        padding:4px 8px;
                        font-size:${ds.fsSub};
                        min-width:52px;
                        font-weight:${ds.fw};
                        border-radius:${ds.rSm};
                        ${attStyle}
                    " onclick="toggleAtt('${s.id}')">${apEscapeHtml(attStatus)}</button>

                    <button class="btn" style="
                        padding:4px 8px;
                        font-size:${ds.fsSub};
                        min-width:52px;
                        font-weight:${ds.fw};
                        border-radius:${ds.rSm};
                        ${hwStyle}
                    " onclick="toggleHw('${s.id}')">${apEscapeHtml(hwStatus)}</button>
                </td>
            </tr>
        `;
    }).join('');

    root.innerHTML = `
        <div class="cls-fade-in">

            ${opToolsPanel}

            <div style="
                margin:0 ${ds.x} 16px;
                padding:12px ${ds.x};
                background:var(--surface);
                border:1px solid var(--border);
                border-radius:${ds.r};
                font-size:${ds.fsSub};
                font-weight:${ds.fw};
                color:var(--primary);
                display:flex;
                justify-content:space-between;
                align-items:center;
                gap:12px;
                text-align:left;
            ">
                <span style="font-weight:${ds.fwBold}; color:var(--primary);">오늘 현황</span>
                ${statusBarHtml}
            </div>

            <div style="margin:0 ${ds.x} 32px;">
                <div style="
                    border-radius:${ds.r};
                    border:1px solid var(--border);
                    background:var(--surface);
                    overflow:hidden;
                ">
                    <div style="
                        padding:14px ${ds.x};
                        border-bottom:1px solid var(--border);
                    ">
                        <span style="
                            font-size:${ds.fs};
                            font-weight:${ds.fwBold};
                            color:var(--text);
                        ">학생 명단</span>
                    </div>

                    <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch;">
                    <table style="width:100%; min-width:520px; border-collapse:collapse; table-layout:fixed;">
                        <thead>
                            <tr style="background:var(--surface-2);">
                                <th style="
                                    padding:10px ${ds.x};
                                    font-size:${ds.fsTag};
                                    color:var(--secondary);
                                    font-weight:${ds.fw};
                                    text-align:left;
                                    text-transform:uppercase;
                                ">Name</th>
                                <th style="
                                    padding:10px 4px;
                                    font-size:${ds.fsTag};
                                    color:var(--secondary);
                                    font-weight:${ds.fw};
                                    text-align:left;
                                    text-transform:uppercase;
                                ">School</th>
                                <th style="
                                    padding:10px ${ds.x};
                                    font-size:${ds.fsTag};
                                    color:var(--secondary);
                                    font-weight:${ds.fw};
                                    text-align:right;
                                    text-transform:uppercase;
                                ">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows || `
                                <tr>
                                    <td colspan="3" style="
                                        text-align:center;
                                        padding:40px;
                                        font-size:${ds.fsSub};
                                        font-weight:${ds.fw};
                                        color:var(--secondary);
                                    ">재원 학생이 없습니다.</td>
                                </tr>
                            `}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

        </div>
    `;
}