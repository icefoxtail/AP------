/**
 * AP Math OS 1.0 [js/student.js]
 * 학생 관리 및 프로필 관제 홈
 * [Fixed Standard UI]: Typography(Fixed) & Spacing(Fixed) 전면 적용본
 */

// [UI Standard]: 공통 스타일 주입 (고정 규격 반영)
function injectStudentStyles() {
    if (document.getElementById('student-detail-style')) return;
    const style = document.createElement('style');
    style.id = 'student-detail-style';
    style.textContent = `
        .std-tab-content { animation: stdFadeIn 0.25s ease-out; }
        @keyframes stdFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        .std-badge { display: inline-flex; align-items: center; justify-content: center; padding: 4px 10px; border-radius: 999px; font-size: 11px; font-weight: 700; line-height: 1.5; }
        .std-input-base { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); padding: 12px 14px; font-family: inherit; outline: none; font-size: 15px; font-weight: 600; line-height: 1.4; }
    `;
    document.head.appendChild(style);
}

// ── 신입/휴원 상태 헬퍼 ──────────────────────────────────────────
function isStudentNewMember(s) {
    if (!s) return false;
    if (String(s.memo || '').indexOf('#신입') === -1) return false;
    
    if (s.created_at) {
        const createdTime = new Date(String(s.created_at).split(' ')[0]).getTime();
        if (!isNaN(createdTime) && (Date.now() - createdTime) / (1000 * 60 * 60 * 24) > 30) {
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

function getStudentParentContactsFromState(sid) {
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

function getStudentParentContactBundle(sid) {
    const store = ensureParentContactUiState();
    const entry = store.byStudent[String(sid)] || {};
    return {
        contacts: getStudentParentContactsFromState(sid),
        consents: Array.isArray(entry.consents) ? entry.consents : [],
        messages: getStudentMessageLogsFromState(sid),
        loading: !!entry.loading,
        error: entry.error || ''
    };
}

async function ensureStudentParentContactDataLoaded(sid, options = {}) {
    const store = ensureParentContactUiState();
    const key = String(sid || '');
    if (!key) return getStudentParentContactBundle(key);

    if (!store.byStudent[key]) {
        store.byStudent[key] = { loadedAt: 0, loading: false, inFlight: null, error: '', consents: [] };
    }
    const entry = store.byStudent[key];
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
        api.get(`parent-foundation/consents?${query}`),
        api.get(`parent-foundation/messages?${query}`)
    ]).then(results => {
        const [contactsRes, consentsRes, messagesRes] = results;
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

        if (messagesRes.status === 'fulfilled' && messagesRes.value?.success && Array.isArray(messagesRes.value.messages)) {
            mergeStudentRows('message_logs', key, messagesRes.value.messages);
        } else {
            errors.push('messages');
        }

        entry.loadedAt = Date.now();
        entry.loading = false;
        entry.error = errors.join(',');
        if (state.ui.currentStudentDetailId === key && state.ui.currentStudentDetailTab === 'cns') {
            renderStudentDetailTab(key, 'cns');
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

function renderParentContactSection(sid) {
    const student = state.db.students.find(st => String(st.id) === String(sid));
    const bundle = getStudentParentContactBundle(sid);
    const fallbackPhone = String(student?.parent_phone || '').trim();
    const fallbackRelation = String(student?.guardian_relation || '').trim();
    const fallbackCard = !bundle.contacts.length && fallbackPhone ? `
        <div class="card" style="padding:14px; border:1px solid var(--border); border-radius:14px; box-shadow:none; background:var(--surface-2);">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; margin-bottom:10px;">
                <div>
                    <div style="font-size:13px; font-weight:800; color:var(--text); line-height:1.5;">기본 보호자 연락처</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5;">students.parent_phone 기준 표시</div>
                </div>
                <span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">기본값</span>
            </div>
            <div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">관계</div>
            <div style="font-size:13px; color:var(--text); font-weight:700; line-height:1.5; margin-bottom:10px;">${apEscapeHtml(fallbackRelation || '미지정')}</div>
            <div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">연락처</div>
            <div style="font-size:13px; color:var(--primary); font-weight:800; line-height:1.5; cursor:pointer; overflow-wrap:anywhere;" onclick="copyPhoneNumber('${apEscapeHtml(fallbackPhone)}')">${apEscapeHtml(fallbackPhone)}</div>
            <div style="margin-top:10px; font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5;">이 값은 자동으로 parent_contacts에 저장되지 않습니다.</div>
        </div>
    ` : '';

    const contactCards = bundle.contacts.map(contact => {
        const consentItems = buildEffectiveConsentMap(contact, bundle.consents);
        const consentHtml = consentItems.map(item => `
            <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; padding:8px 0; border-top:1px solid rgba(0,0,0,0.04);">
                <div style="min-width:0;">
                    <div style="font-size:12px; color:var(--text); font-weight:700; line-height:1.5;">${apEscapeHtml(item.label)}</div>
                    <div style="font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5;">${item.is_allowed ? '동의' : '미동의'}${item.source === 'legacy' ? ' · 기본값' : item.source === 'all' ? ' · 전체 공통' : ''}</div>
                </div>
                <button class="btn" style="min-height:34px; padding:6px 10px; font-size:11px; font-weight:700; border-radius:10px;" onclick="toggleParentConsent('${sid}','${contact.id}','${item.type}',${item.is_allowed ? 0 : 1})">${item.is_allowed ? '미동의' : '동의'}</button>
            </div>
        `).join('');

        return `
            <div class="card" style="padding:16px; margin-bottom:12px; border:1px solid var(--border); border-radius:16px; box-shadow:none; background:var(--surface);">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
                    <div style="min-width:0;">
                        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                            <div style="font-size:14px; font-weight:800; color:var(--text); line-height:1.5;">${apEscapeHtml(contact.name || '이름 미입력')}</div>
                            ${Number(contact.is_primary) ? '<span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">대표 연락처</span>' : '<span class="std-badge" style="background:var(--surface-2); color:var(--secondary); border:1px solid var(--border);">등록됨</span>'}
                        </div>
                        <div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">${apEscapeHtml(contact.relation || '관계 미입력')}</div>
                    </div>
                    <div style="display:flex; gap:10px; flex-wrap:wrap;">
                        <span style="cursor:pointer; color:var(--primary); font-size:12px; font-weight:700;" onclick="openEditParentContactModal('${sid}','${contact.id}')">수정</span>
                        <span style="cursor:pointer; color:var(--error); font-size:12px; font-weight:700;" onclick="handleDeleteParentContact('${sid}','${contact.id}')">삭제</span>
                    </div>
                </div>
                <div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">연락처</div>
                <div style="font-size:13px; color:var(--primary); font-weight:800; line-height:1.5; cursor:pointer; overflow-wrap:anywhere;" onclick="copyPhoneNumber('${apEscapeHtml(String(contact.phone || ''))}')">${apEscapeHtml(contact.phone || '미등록')}</div>
                ${contact.memo ? `<div style="margin-top:10px; font-size:12px; color:var(--secondary); font-weight:700; line-height:1.6; white-space:pre-wrap;">비고: ${apEscapeHtml(contact.memo)}</div>` : ''}
                <div style="margin-top:12px; padding:12px; background:var(--surface-2); border:1px solid var(--border); border-radius:12px;">
                    <div style="font-size:12px; color:var(--secondary); font-weight:800; line-height:1.5; margin-bottom:4px;">수신동의</div>
                    ${consentHtml || '<div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">확인 가능한 수신동의 항목이 없습니다.</div>'}
                </div>
            </div>
        `;
    }).join('');

    const messageRows = bundle.messages.map(row => `
        <div style="padding:12px 0; border-top:1px solid rgba(0,0,0,0.05);">
            <div style="display:flex; justify-content:space-between; gap:10px; align-items:flex-start; margin-bottom:6px;">
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                    <span class="std-badge" style="background:var(--surface-2); color:var(--secondary); border:1px solid var(--border);">${apEscapeHtml(row.channel || '기록')}</span>
                    <span class="std-badge" style="background:rgba(26,92,255,0.08); color:var(--primary); border:1px solid rgba(26,92,255,0.15);">${apEscapeHtml(row.message_type || '기타')}</span>
                    <span class="std-badge" style="background:rgba(255,165,2,0.08); color:var(--warning); border:1px solid rgba(255,165,2,0.15);">${apEscapeHtml(row.status || '확인 필요')}</span>
                </div>
                <div style="font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5;">${apEscapeHtml(formatParentMessageDate(row) || '시각 없음')}</div>
            </div>
            <div style="font-size:12px; color:var(--text); font-weight:700; line-height:1.6;">${apEscapeHtml(summarizeParentMessage(row) || '기록 내용 없음')}</div>
            <div style="margin-top:6px; font-size:11px; color:var(--secondary); font-weight:700; line-height:1.5;">
                수신자 ${apEscapeHtml(row.recipient_name_snapshot || row.relation_snapshot || '미기록')}
                ${row.recipient_phone_snapshot ? ` · ${apEscapeHtml(row.recipient_phone_snapshot)}` : ''}
            </div>
            ${row.error_message ? `<div style="margin-top:6px; font-size:11px; color:var(--error); font-weight:700; line-height:1.5;">실패 사유: ${apEscapeHtml(row.error_message)}</div>` : ''}
        </div>
    `).join('');

    return `
        <div style="margin-top:24px; display:flex; flex-direction:column; gap:20px;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
                    <div style="font-size:16px; font-weight:700; color:var(--text); line-height:1.3;">보호자 연락처</div>
                    <button class="btn" style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:700; border-radius:12px;" onclick="openAddParentContactModal('${sid}')">보호자 연락처 추가</button>
                </div>
                ${bundle.loading ? '<div style="margin-bottom:10px; font-size:12px; color:var(--secondary); font-weight:700;">보호자 연락처 데이터를 불러오는 중입니다.</div>' : ''}
                ${bundle.error ? '<div style="margin-bottom:10px; font-size:12px; color:var(--warning); font-weight:700;">일부 보호자 연락 데이터를 다시 확인해 주세요.</div>' : ''}
                ${contactCards || fallbackCard || '<div style="padding:24px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700; border:1px solid var(--border); border-radius:16px; background:var(--surface-2);">등록된 보호자 연락처가 없습니다.</div>'}
            </div>
            <div style="padding:16px; border:1px solid var(--border); border-radius:16px; background:var(--surface);">
                <div style="font-size:16px; font-weight:700; color:var(--text); line-height:1.3; margin-bottom:12px;">연락 이력</div>
                <div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5; margin-bottom:10px;">연락 이력은 조회만 가능하며, 실제 발송 버튼은 제공하지 않습니다.</div>
                ${messageRows || '<div style="padding:20px 4px; text-align:center; color:var(--secondary); font-size:13px; font-weight:700;">연락 이력이 없습니다.</div>'}
            </div>
        </div>
    `;
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

function consultationAiPanelHtml(mode) {
    const ai = ensureConsultationAiUiState();
    const disabled = ai.loading ? 'disabled' : '';
    const loadingText = ai.loading ? 'AI 요약 생성 중입니다.' : '';
    const result = ai.result || null;
    const keyIssuesHtml = Array.isArray(result?.key_issues) && result.key_issues.length
        ? `<ul style="margin: 8px 0 0 18px; padding: 0; color: var(--text); font-size: 12px; font-weight: 700; line-height: 1.6;">
                ${result.key_issues.map(item => `<li>${apEscapeHtml(item)}</li>`).join('')}
           </ul>`
        : '';
    const applyButton = result?.next_action_draft
        ? `<button type="button" class="btn" style="min-height: 38px; padding: 8px 12px; font-size: 12px; font-weight:700; border-radius: 12px; color: var(--primary); border: 1px solid rgba(26,92,255,0.2); background: rgba(26,92,255,0.06);" onclick="applyConsultationAiNextAction('${mode}')">다음 조치 반영</button>`
        : '';

    return `
        <div id="consultation-ai-panel" style="display:flex; flex-direction:column; gap:10px; padding:12px; border:1px solid var(--border); border-radius:14px; background:var(--surface);">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
                <div style="font-size:12px; color:var(--secondary); font-weight:800; line-height:1.5;">상담 AI 요약/다음 조치 초안</div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="button" id="consultation-ai-generate-btn" class="btn" ${disabled} style="min-height:38px; padding:8px 12px; font-size:12px; font-weight:700; border-radius:12px;" onclick="generateConsultationAiSummary('${mode}')">AI 요약</button>
                    ${applyButton}
                </div>
            </div>
            ${loadingText ? `<div style="font-size:12px; color:var(--secondary); font-weight:700;">${loadingText}</div>` : ''}
            ${ai.error ? `<div style="font-size:12px; color:var(--error); font-weight:700; line-height:1.5;">${apEscapeHtml(ai.error)}</div>` : ''}
            ${ai.warning ? `<div style="font-size:11px; color:var(--warning); font-weight:700; line-height:1.5;">${apEscapeHtml(ai.warning)}</div>` : ''}
            ${result ? `
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="font-size:12px; color:var(--secondary); font-weight:800;">AI 요약</div>
                    <div style="font-size:13px; color:var(--text); font-weight:700; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.summary || '')}</div>
                    ${keyIssuesHtml ? `<div><div style="font-size:12px; color:var(--secondary); font-weight:800;">핵심 이슈</div>${keyIssuesHtml}</div>` : ''}
                    ${result.next_action_draft ? `<div><div style="font-size:12px; color:var(--secondary); font-weight:800;">다음 조치 초안</div><div style="font-size:13px; color:var(--text); font-weight:700; line-height:1.6; white-space:pre-wrap;">${apEscapeHtml(result.next_action_draft)}</div></div>` : ''}
                </div>
            ` : '<div style="font-size:12px; color:var(--secondary); font-weight:700; line-height:1.5;">상담 내용을 입력한 뒤 AI 요약을 눌러 내부 기록용 요약과 다음 조치 초안을 확인할 수 있습니다.</div>'}
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
                if (state.ui.currentStudentDetailId === key && state.ui.currentStudentDetailTab === 'cns') {
                    renderStudentDetailTab(key, 'cns');
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
async function renderStudentDetail(sid) {
    const s = state.db.students.find(st => st.id === sid);
    if (!s) { toast('학생 정보 없음', 'warn'); return; }

    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    const foundationLoads = [];
    if (typeof loadEnrollmentFoundation === 'function') foundationLoads.push(loadEnrollmentFoundation({ student_id: sid }, { silent: true }));
    if (typeof loadStudentFoundationDetails === 'function') foundationLoads.push(loadStudentFoundationDetails(sid));
    if (foundationLoads.length) await Promise.all(foundationLoads);
    await ensureBlueprintsForSessions(exs);
    void ensureStudentParentContactDataLoaded(sid);

    renderStudentDetailTab(sid, 'grade');
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

/**
 * 탭별 내용 렌더링 엔진 (UI Standard 적용)
 */
function renderStudentDetailTab(sid, tab) {
    injectStudentStyles();
    if (!state.ui) state.ui = {};
    state.ui.currentStudentDetailId = String(sid);
    state.ui.currentStudentDetailTab = tab;
    const s = state.db.students.find(st => st.id === sid);
    const mIds = state.db.class_students.find(m => String(m.student_id) === String(sid));
    const cls = state.db.classes.find(c => String(c.id) === String(mIds?.class_id));
    const returnCtx = state.ui.returnView || {};
    if (returnCtx.type && typeof setModalReturnView === 'function') setModalReturnView(returnCtx);
    const backButton = '';

    // 1. 프로필 헤더 (22px 대제목 및 고정 배지 규격)
    const headerHtml = `
        <div style="margin-bottom: 20px; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                <div style="min-width: 0;">
                    <h1 style="margin: 0; font-size: 22px; font-weight:700; color: var(--text); letter-spacing: -0.5px; line-height: 1.2;">${s.name}</h1>
                    <div style="display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap;">
                        <span class="std-badge" style="background: rgba(26,92,255,0.08); color: var(--primary); border: 1px solid rgba(26,92,255,0.15);">${s.school_name} ${s.grade}</span>
                        <span class="std-badge" style="background: transparent; border: 1px solid var(--border); color: var(--secondary);">${cls?.name || '반 미배정'}</span>
                        ${s.student_pin ? `<span class="std-badge" style="background: var(--surface); border: 1px solid var(--border); color: var(--text); letter-spacing: 1px;">PIN ${s.student_pin}</span>` : ''}
                    </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:flex-end;">
                    ${backButton}
                    <button class="btn" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; line-height: 1.2; border-radius: 10px; background: var(--surface-2); border: 1px solid var(--border); color: var(--text); cursor: pointer; white-space: nowrap;" onclick="openEditStudent('${sid}', { returnTo: { type: 'studentDetail', studentId: '${sid}' } })">정보 수정</button>
                </div>
            </div>
            
            <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div style="background: transparent; border: 1px solid var(--border); padding: 14px 12px; border-radius: 16px; min-width: 0;">
                    <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin-bottom: 4px; line-height: 1.5;">학생 연락처</div>
                    <div style="font-size: 13px; font-weight:700; color: var(--primary); cursor: pointer; line-height: 1.5; overflow-wrap: anywhere;" onclick="copyPhoneNumber('${s.student_phone}')">${s.student_phone || '미등록'}</div>
                </div>
                <div style="background: transparent; border: 1px solid var(--border); padding: 14px 12px; border-radius: 16px; min-width: 0;">
                    <div style="font-size: 11px; color: var(--secondary); font-weight: 600; margin-bottom: 4px; line-height: 1.5;">보호자 (${s.guardian_relation || '미지정'})</div>
                    <div style="font-size: 13px; font-weight:700; color: var(--primary); cursor: pointer; line-height: 1.5; overflow-wrap: anywhere;" onclick="copyPhoneNumber('${s.parent_phone}')">${s.parent_phone || '미등록'}</div>
                </div>
            </div>
        </div>
    `;

    // 2. 탭 바 (규격화된 행간 및 버튼)
    const tabBarHtml = `
        <div class="tab-bar" style="background: var(--bg); padding: 4px; border-radius: 16px; margin-bottom: 20px; display: flex; gap: 4px;">
            <button class="tab-btn ${tab==='grade'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','grade')">성적분석</button>
            <button class="tab-btn ${tab==='weak'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','weak')">취약단원</button>
            <button class="tab-btn ${tab==='cns'?'active':''}" style="flex: 1; min-height: 44px; font-size: 13px; font-weight:700; border-radius: 10px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','cns')">상담기록</button>
        </div>
    `;

    let bodyHtml = `<div class="std-tab-content">`;
    if (tab === 'grade') bodyHtml += renderGradeTab(sid);
    else if (tab === 'weak') bodyHtml += renderWeakTab(sid);
    else if (tab === 'cns') bodyHtml += renderCnsTab(sid);
    bodyHtml += `</div>`;

    // 4. 하단 액션바
    const footerHtml = `
        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; flex-direction: column; gap: 10px;">
            <button class="btn btn-primary" style="width: 100%; min-height: 52px; font-size: 15px; font-weight:700; border-radius: 16px; box-shadow: none; cursor: pointer;" onclick="if(typeof openReportCenterModal==='function') openReportCenterModal('${sid}', 'daily'); else openStudentReportModal('${sid}')">리포트 센터</button>
            <button class="btn" style="width: 100%; min-height: 52px; font-size: 14px; font-weight:700; color: var(--primary); border: 1px solid rgba(26,92,255,0.22); background: rgba(26,92,255,0.06); border-radius: 16px; cursor: pointer;" onclick="renderStudentDetailTab('${sid}','weak')">클리닉 센터</button>
        </div>
    `;

    showModal(`${s.name} 프로필`, `<div style="padding: 0 16px 4px; box-sizing: border-box;">${headerHtml}${tabBarHtml}${bodyHtml}${footerHtml}</div>`);
    if (tab === 'grade') setTimeout(() => drawGradeChart(sid), 50);
    if (tab === 'cns') {
        void ensureStudentConsultationsLoaded(sid);
        void ensureStudentParentContactDataLoaded(sid);
    }
}

/**
 * [Tab 1] 성적분석 (16px 제목 및 14px 리스트 규격)
 */
function renderGradeTab(sid) {
    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>b.exam_date.localeCompare(a.exam_date));
    
    const chartArea = exs.length > 0 
        ? `<div style="margin-bottom: 24px; padding: 16px; background: var(--surface); border: 1px solid var(--border); border-radius: 16px;">
             <canvas id="studentGradeChart" style="width: 100%; height: 180px;"></canvas>
           </div>`
        : `<div style="padding: 40px 20px; text-align: center; color: var(--secondary); background: var(--surface-2); border: 1px solid var(--border); border-radius: 16px; margin-bottom: 20px; font-size: 13px; font-weight: 700; line-height: 1.5;">누적된 성적 기록이 없습니다.</div>`;

    const historyRows = exs.map(e => {
        const wrs = state.db.wrong_answers
            .filter(w => w.session_id === e.id)
            .sort((a,b)=>Number(a.question_id)-Number(b.question_id))
            .map(w => typeof buildWrongUnitChip === 'function' ? buildWrongUnitChip(e, w.question_id) : `<span style="font-size: 11px; padding: 4px 8px; background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; margin: 2px; color: var(--text-soft); font-weight: 600;">Q${w.question_id}</span>`)
            .join('');
            
        return `
            <div style="padding: 14px 4px; border-bottom: 1px solid var(--border);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 8px;">
                    <div style="min-width: 0;">
                        <div style="font-size: 15px; font-weight:700; color: var(--text); line-height: 1.4; overflow-wrap: anywhere;">${e.exam_title}</div>
                        <div style="font-size: 12px; color: var(--secondary); font-weight: 600; margin-top: 2px; line-height: 1.5;">${e.exam_date}</div>
                    </div>
                    <div style="font-size: 20px; font-weight:700; color: var(--primary); line-height: 1.2;">${e.score}점</div>
                </div>
                <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 12px;">${wrs || '<span style="font-size: 11px; color: var(--secondary); font-weight: 600;">오답 없음</span>'}</div>
                <div style="display: flex; gap: 6px; justify-content: flex-end; flex-wrap: wrap;">
                    <button class="btn" style="min-height: 32px; padding: 4px 8px; font-size: 11px; color: var(--warning); border: 1px solid rgba(255,165,2,0.2); background: rgba(255,165,2,0.05); border-radius: 10px; font-weight: 700; cursor: pointer;" onclick="handleResetSessionWrongs('${e.id}','${sid}')">오답 초기화</button>
                    <button class="btn" style="min-height: 32px; padding: 4px 8px; font-size: 11px; color: var(--error); border: 1px solid rgba(255,71,87,0.2); background: rgba(255,71,87,0.05); border-radius: 10px; font-weight: 700; cursor: pointer;" onclick="handleDeleteSession('${e.id}','${sid}')">기록 삭제</button>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div>
            <h4 style="margin: 0 0 12px 4px; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">최근 성적 추이</h4>
            ${chartArea}
            <h4 style="margin: 24px 0 12px 4px; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">전체 시험 이력</h4>
            <div style="max-height: 400px; overflow-y: auto; padding-right: 4px;">${historyRows || '<p style="text-align: center; padding: 20px; color: var(--secondary); font-size: 13px; font-weight: 700;">기록 없음</p>'}</div>
        </div>
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
            <h4 style="margin: 0 0 4px 0; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">취약 단원 분석</h4>
            <p style="margin: 0 0 16px 0; font-size: 12px; color: var(--secondary); font-weight: 600; line-height: 1.5;">단원을 누르면 상세 오답과 추천 문항을 확인합니다.</p>
            ${typeof renderWeakUnitSummary === 'function' 
                ? renderWeakUnitSummary(weakUnits, '누적 오답 데이터가 없습니다.', { clickable: true, mode: 'student', titlePrefix: `${s.name} 취약 단원`, context: { targetType: 'student', targetId: sid, targetLabel: s.name } })
                : '<div style="padding: 20px; text-align: center; color: var(--secondary); font-size: 13px; font-weight: 700;">데이터를 불러올 수 없습니다.</div>'}
        </div>
    `;
}

/**
 * [Tab 3] 상담기록 (18px 라운드 및 13px 본문 규격)
 */
function renderCnsTab(sid) {
    const cnsState = ensureStudentConsultationUiState().byStudent[String(sid)] || {};
    const cnsList = getStudentConsultationsFromState(sid);

    const cnsCards = cnsList.map(c => `
        <div class="card" style="padding: 16px; margin-bottom: 12px; border: 1px solid var(--border); border-radius: 16px; box-shadow: none; background: var(--surface);">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 12px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 12px; font-weight:700; color: var(--secondary); line-height: 1.5;">${c.date}</span>
                    <span class="std-badge" style="background: rgba(26,92,255,0.08); color: var(--primary); padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight:700; border: 1px solid rgba(26,92,255,0.15);">${c.type}</span>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="cursor: pointer; color: var(--primary); font-size: 12px; font-weight:700;" onclick="openEditConsultation('${c.id}', '${sid}')">수정</span>
                    <span style="cursor: pointer; color: var(--error); font-size: 12px; font-weight:700;" onclick="handleDeleteConsultation('${c.id}', '${sid}')">삭제</span>
                </div>
            </div>
            <div style="font-size: 13px; font-weight: 700; line-height: 1.5; color: var(--text); white-space: pre-wrap;">${apEscapeHtml(c.content)}</div>
            ${c.next_action ? `
                <div style="margin-top: 12px; padding: 10px; background: rgba(255,165,2,0.06); border: 1px solid rgba(255,165,2,0.1); border-radius: 10px; font-size: 12px; color: var(--warning); font-weight: 700; line-height: 1.5;">
                    <b style="color: var(--warning);">조치:</b> ${apEscapeHtml(c.next_action)}
                </div>` : ''}
            ${c.created_at ? `<div style="margin-top: 10px; font-size: 11px; color: var(--secondary); font-weight: 700; line-height: 1.5;">등록 시각 ${apEscapeHtml(c.created_at)}</div>` : ''}
        </div>
    `).join('');

    return `
        <div style="padding: 0 4px;">
            <div style="margin: 0 0 12px 2px; font-size: 16px; font-weight:700; color: var(--text); line-height: 1.3;">상담 이력</div>
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 20px; min-height: 52px; font-size: 14px; font-weight:700; border-radius: 16px; box-shadow: none;" onclick="openAddConsultationModal('${sid}')">+ 새 상담 기록하기</button>
            ${cnsState.loading ? '<div style="margin-bottom: 12px; font-size: 12px; color: var(--secondary); font-weight: 700;">상담 기록을 불러오는 중입니다.</div>' : ''}
            <div style="max-height: 450px; overflow-y: auto; padding-right: 4px;">
                ${cnsCards || '<div style="text-align: center; padding: 40px; color: var(--secondary); font-size: 13px; font-weight: 700;">상담 기록이 없습니다.</div>'}
            </div>
            ${renderParentContactSection(sid)}
        </div>
    `;
}

/**
 * Chart.js 그리기 엔진 (원본 로직 사수)
 */
let currentStudentChart = null;
function drawGradeChart(sid) {
    const canvas = document.getElementById('studentGradeChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const exs = (state.db.exam_sessions || []).filter(e => e.student_id === sid).sort((a,b)=>a.exam_date.localeCompare(b.exam_date)).slice(-7);
    if (!exs.length) return;

    if (currentStudentChart) { currentStudentChart.destroy(); }

    const isDark = document.body.classList.contains('dark');
    const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#1A5CFF';
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
                backgroundColor: isDark ? 'rgba(92,138,255,0.1)' : 'rgba(26,92,255,0.05)',
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

    const lastExam = (state.db.exam_sessions || [])
        .filter(e => e.student_id === sid)
        .sort((a,b) => String(b.exam_date || '').localeCompare(String(a.exam_date || '')))[0];
    let examText = lastExam ? `\n\n[최근 평가]\n${lastExam.exam_title}: ${lastExam.score}점` : '';

    const template = `안녕하세요 학부모님, AP수학입니다.\n\n오늘 ${s.name}이는 ${progressText}${examText}${cnsText}\n\n궁금하신 점은 언제든 편하게 문의주세요. 감사합니다!`;

    showModal('알림톡 문구 미리보기', `
        <div style="background: var(--surface-2); border: 1px solid var(--border); padding: 16px; border-radius: 18px; margin-bottom: 16px;">
            <p style="margin: 0 0 10px 4px; font-size: 12px; color: var(--secondary); font-weight:700; line-height: 1.5;">내용을 확인하고 필요하면 수정하세요.</p>
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
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    showModal('보호자 연락처 추가', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <input id="parent-contact-name" class="std-input-base" placeholder="보호자 이름">
            <input id="parent-contact-relation" class="std-input-base" placeholder="관계">
            <input id="parent-contact-phone" class="std-input-base" placeholder="연락처 (필수)">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--text); cursor:pointer;">
                <input type="checkbox" id="parent-contact-primary" checked style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;">
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
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(result?.message || result?.error || '보호자 연락처 저장에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleSaveParentContact] failed:', e);
        toast('보호자 연락처 저장 중 오류가 발생했습니다.', 'error');
    }
}

function openEditParentContactModal(sid, contactId) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    const contact = (state.db.parent_contacts || []).find(row => String(row.id) === String(contactId));
    if (!contact) return toast('보호자 연락처를 찾을 수 없습니다.', 'warn');

    showModal('보호자 연락처 수정', `
        <div style="display:flex; flex-direction:column; gap:12px;">
            <input id="edit-parent-contact-name" class="std-input-base" value="${studentAttr(contact.name || '')}" placeholder="보호자 이름">
            <input id="edit-parent-contact-relation" class="std-input-base" value="${studentAttr(contact.relation || '')}" placeholder="관계">
            <input id="edit-parent-contact-phone" class="std-input-base" value="${studentAttr(contact.phone || '')}" placeholder="연락처 (필수)">
            <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:var(--text); cursor:pointer;">
                <input type="checkbox" id="edit-parent-contact-primary" ${Number(contact.is_primary) ? 'checked' : ''} style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;">
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
            renderStudentDetailTab(sid, 'cns');
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
            renderStudentDetailTab(sid, 'cns');
            return;
        }
        toast(result?.message || result?.error || '보호자 연락처 삭제에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDeleteParentContact] failed:', e);
        toast('보호자 연락처 삭제 중 오류가 발생했습니다.', 'error');
    }
}

async function toggleParentConsent(sid, contactId, consentType, nextValue) {
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
            renderStudentDetailTab(sid, 'cns');
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
function openAddConsultationModal(sid) {
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    resetConsultationAiUiState('add', sid, '');
    const todayStr = new Date().toLocaleDateString('sv-SE');
    showModal('상담 기록 추가', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="cns-date" class="std-input-base" value="${todayStr}" style="flex: 1.2;">
                <select id="cns-type" class="std-input-base" style="flex: 1;">
                    <option value="학습">학습</option><option value="태도">태도</option><option value="성적">성적</option><option value="기타">기타</option>
                </select>
            </div>
            <textarea id="cns-content" class="std-input-base" placeholder="상담 내용을 입력하세요." style="height: 140px;"></textarea>
            <textarea id="cns-action" class="std-input-base" placeholder="조치 사항 (선택)" style="height: 70px;"></textarea>
            <div id="consultation-ai-panel-wrap">${consultationAiPanelHtml('add')}</div>
        </div>
    `, '저장', () => handleSaveConsultation(sid));
}

async function handleSaveConsultation(sid) {
    const date = document.getElementById('cns-date').value || new Date().toLocaleDateString('sv-SE');
    const type = document.getElementById('cns-type').value;
    const content = document.getElementById('cns-content').value.trim();
    const nextAction = document.getElementById('cns-action').value.trim();
    if (!content) { toast('상담 내용을 입력하세요.', 'warn'); return; }

    try {
        const r = await api.post('consultations', { studentId: sid, date, type, content, nextAction });
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
        const result = await api.post('ai/consultation-summary', {
            student_id: studentId,
            student_name: student?.name || '',
            grade: student?.grade || '',
            consultation_type: String(typeInput?.value || '').trim(),
            consultation_date: String(dateInput?.value || '').trim() || new Date().toLocaleDateString('sv-SE'),
            content,
            next_action: String(actionInput?.value || '').trim()
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
    if (typeof setModalReturnView === 'function') setModalReturnView({ type: 'studentDetail', studentId: sid });
    resetConsultationAiUiState('edit', sid, cid);
    const c = state.db.consultations.find(x => x.id === cid);
    if (!c) return;
    showModal('상담 수정', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; gap: 8px;">
                <input type="date" id="edit-cns-date" class="std-input-base" value="${c.date}" style="flex: 1.2;">
                <select id="edit-cns-type" class="std-input-base" style="flex: 1;">
                    <option value="학습" ${c.type==='학습'?'selected':''}>학습</option>
                    <option value="태도" ${c.type==='태도'?'selected':''}>태도</option>
                    <option value="성적" ${c.type==='성적'?'selected':''}>성적</option>
                    <option value="기타" ${c.type==='기타'?'selected':''}>기타</option>
                </select>
            </div>
            <textarea id="edit-cns-content" class="std-input-base" style="height: 140px;">${apEscapeHtml(c.content || '')}</textarea>
            <textarea id="edit-cns-action" class="std-input-base" style="height: 70px;">${apEscapeHtml(c.next_action || '')}</textarea>
            <div id="consultation-ai-panel-wrap">${consultationAiPanelHtml('edit')}</div>
        </div>
    `, '수정 완료', () => handleEditConsultation(cid, sid));
}

async function handleEditConsultation(cid, sid) {
    const date = document.getElementById('edit-cns-date')?.value || '';
    const type = document.getElementById('edit-cns-type')?.value || '';
    const content = document.getElementById('edit-cns-content')?.value.trim() || '';
    const nextAction = document.getElementById('edit-cns-action')?.value.trim() || '';
    if (!content) return toast('상담 내용을 입력하세요.', 'warn');

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

async function handleDelete(sid) {
    if (!confirm('이 학생을 퇴원 처리하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;

    try {
        const r = await api.delete('students', sid);
        if (r?.success) {
            toast('퇴원 처리되었습니다.', 'info');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '퇴원 처리에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleDelete] failed:', e);
        toast('퇴원 처리 중 오류가 발생했습니다.', 'error');
    }
}

async function handleRestore(sid) {
    if (!confirm('이 학생을 재원으로 복구하시겠습니까?')) return;
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;

    try {
        const r = await api.patch(`students/${sid}/restore`, {});
        if (r?.success) {
            toast('재원으로 복구되었습니다.', 'info');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '재원 복구에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleRestore] failed:', e);
        toast('재원 복구 중 오류가 발생했습니다.', 'error');
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

function sortClassesForStudentModal(classes = []) {
    const gradeRank = (cls) => {
        const text = `${cls?.grade || ''} ${cls?.name || ''}`;
        if (/중1/.test(text)) return 1;
        if (/중2/.test(text)) return 2;
        if (/중3/.test(text)) return 3;
        if (/고1/.test(text)) return 4;
        if (/고2/.test(text)) return 5;
        if (/고3/.test(text)) return 6;
        return 99;
    };

    return [...classes].sort((a, b) => {
        const diff = gradeRank(a) - gradeRank(b);
        if (diff !== 0) return diff;
        return String(a.name || '').localeCompare(String(b.name || ''), 'ko');
    });
}

function inferGradeFromClass(cls) {
    const text = `${cls?.grade || ''} ${cls?.name || ''}`;
    const m = text.match(/(중1|중2|중3|고1|고2|고3)/);
    return m ? m[1] : '';
}

function studentAttr(value) {
    return apEscapeHtml(String(value ?? ''));
}


var AP_HIGH_SUBJECTS = ['대수', '미적분Ⅰ', '확률과통계', '미적분Ⅱ', '기하'];

function parseHighSubjects(value) {
    if (Array.isArray(value)) {
        return value.map(v => String(v || '').trim()).filter(Boolean);
    }
    const raw = String(value || '').trim();
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.map(v => String(v || '').trim()).filter(Boolean);
    } catch (e) {}
    return raw.split(',').map(v => v.trim()).filter(Boolean);
}

function isHighSubjectGrade(grade) {
    return String(grade || '').includes('고2') || String(grade || '').includes('고3');
}

function renderHighSubjectChecks(prefix, grade, selectedSubjects) {
    const selected = new Set(parseHighSubjects(selectedSubjects));
    const visible = isHighSubjectGrade(grade);
    return `
        <div id="${prefix}-high-subjects-wrap" style="display:${visible ? 'block' : 'none'}; background:var(--surface-2); border:1px solid var(--border); border-radius:12px; padding:12px 14px;">
            <div style="font-size:12px; font-weight:800; color:var(--secondary); margin-bottom:9px; line-height:1.4;">내신 과목</div>
            <div style="display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px 10px;">
                ${AP_HIGH_SUBJECTS.map((subject, idx) => `
                    <label style="display:flex; align-items:center; gap:7px; min-height:28px; font-size:13px; font-weight:700; color:var(--text); cursor:pointer;">
                        <input type="checkbox" class="${prefix}-high-subject" value="${apEscapeHtml(subject)}" ${selected.has(subject) ? 'checked' : ''} style="width:15px; height:15px; accent-color:var(--primary); cursor:pointer;">
                        <span>${apEscapeHtml(subject)}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

function syncHighSubjectWrap(prefix, grade) {
    const wrap = document.getElementById(`${prefix}-high-subjects-wrap`);
    if (!wrap) return;
    wrap.style.display = isHighSubjectGrade(grade) ? 'block' : 'none';
}

function syncEditStudentHighSubjects() {
    const grade = document.getElementById('edit-grade')?.value || '';
    syncHighSubjectWrap('edit', grade);
}

function syncAddStudentHighSubjects() {
    const classId = document.getElementById('add-class')?.value || '';
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    const grade = inferGradeFromClass(cls);
    syncHighSubjectWrap('add', grade);
}

function collectHighSubjects(prefix, grade) {
    if (!isHighSubjectGrade(grade)) return [];
    return Array.from(document.querySelectorAll(`.${prefix}-high-subject:checked`))
        .map(el => String(el.value || '').trim())
        .filter(Boolean);
}

function syncEditStudentGrade() {
    const classId = document.getElementById('edit-class')?.value || '';
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (cls?.grade) {
        document.getElementById('edit-grade').value = cls.grade;
    }
    syncEditStudentHighSubjects();
}

function openEditStudent(sid, options = {}) {
    const s = state.db.students.find(st => st.id === sid);
    if (options.returnTo && typeof setModalReturnView === 'function') setModalReturnView(options.returnTo);
    const curCid = state.db.class_students.find(m => m.student_id === sid)?.class_id || '';
    const opts = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0 || String(c.id) === String(curCid))).map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id)===String(curCid)?'selected':''}>${apEscapeHtml(String(c.name || ''))}</option>`).join('');

    const isNew = isStudentNewMember(s);
    const isLeave = isStudentOnLeave(s);
    const cleanMemo = String(s.memo || '').replace(/#신입/g, '').replace(/#휴원/g, '').trim();

    showModal('학생 정보 수정', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            <input id="edit-name" class="std-input-base" value="${studentAttr(s.name)}" placeholder="이름">
            <input id="edit-school" class="std-input-base" value="${studentAttr(s.school_name)}" placeholder="학교">
            <div style="display: flex; gap: 8px;">
                <select id="edit-grade" class="std-input-base" style="flex: 1;" onchange="syncEditStudentHighSubjects()">
                    <option value="중1" ${s.grade==='중1'?'selected':''}>중1</option><option value="중2" ${s.grade==='중2'?'selected':''}>중2</option><option value="중3" ${s.grade==='중3'?'selected':''}>중3</option>
                    <option value="고1" ${s.grade==='고1'?'selected':''}>고1</option><option value="고2" ${s.grade==='고2'?'selected':''}>고2</option><option value="고3" ${s.grade==='고3'?'selected':''}>고3</option>
                </select>
                <select id="edit-class" class="std-input-base" style="flex: 1.5;" onchange="syncEditStudentGrade()"><option value="">반 미배정</option>${opts}</select>
            </div>
            ${renderHighSubjectChecks('edit', s.grade, s.high_subjects)}
            <input id="edit-student-phone" class="std-input-base" value="${studentAttr(s.student_phone || '')}" placeholder="학생 전화번호">
            <input id="edit-parent-phone" class="std-input-base" value="${studentAttr(s.parent_phone || '')}" placeholder="학부모 전화번호">
            <input id="edit-guardian-rel" class="std-input-base" value="${studentAttr(s.guardian_relation || '')}" placeholder="보호자 관계">
            <input id="edit-student-pin" class="std-input-base" value="${studentAttr(s.student_pin || '')}" placeholder="PIN (4자리 숫자)" maxlength="4">
            <textarea id="edit-memo" class="std-input-base" placeholder="메모" style="height: 64px;">${apEscapeHtml(cleanMemo)}</textarea>
            <div style="display:flex; gap:20px; padding:4px 2px; background:var(--surface-2); border:1px solid var(--border); border-radius:10px; padding:10px 14px;">
                <label style="display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; cursor:pointer; color:${isNew ? '#1A5CFF' : 'var(--text)'};">
                    <input type="checkbox" id="edit-is-new" ${isNew ? 'checked' : ''} style="accent-color:#1A5CFF; width:15px; height:15px; cursor:pointer;">
                    <span>신입생</span>
                </label>
                <label style="display:flex; align-items:center; gap:7px; font-size:13px; font-weight:700; cursor:pointer; color:${isLeave ? '#FF8C00' : 'var(--text)'};">
                    <input type="checkbox" id="edit-is-leave" ${isLeave ? 'checked' : ''} style="accent-color:#FF8C00; width:15px; height:15px; cursor:pointer;">
                    <span>휴원</span>
                </label>
            </div>
            <div style="margin-top: 4px;">
                <button class="btn" style="width: 100%; min-height: 44px; color: var(--error); border: 1px solid rgba(255,71,87,0.2); background: rgba(255,71,87,0.05); font-weight:700; border-radius: 12px;" onclick="handleDelete('${sid}')">퇴원(제적) 처리</button>
            </div>
        </div>
    `, '저장', () => handleEditStudent(sid));
}

async function handleEditStudent(sid) {
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const pin = document.getElementById('edit-student-pin')?.value.trim() || '';
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }

    const classId = document.getElementById('edit-class')?.value || '';
    const editGrade = document.getElementById('edit-grade')?.value || '';
    const grade = editGrade;

    const rawMemo = document.getElementById('edit-memo')?.value || '';
    const isNewChecked = document.getElementById('edit-is-new')?.checked || false;
    const isLeaveChecked = document.getElementById('edit-is-leave')?.checked || false;
    const cleanMemo = rawMemo.replace(/#신입/g, '').replace(/#휴원/g, '').trim();
    const memoParts = [];
    if (isNewChecked) memoParts.push('#신입');
    if (isLeaveChecked) memoParts.push('#휴원');
    if (cleanMemo) memoParts.push(cleanMemo);
    const finalMemo = memoParts.join(' ').trim();
    const highSubjects = collectHighSubjects('edit', grade);

    const payload = {
        name: document.getElementById('edit-name')?.value || '',
        school_name: document.getElementById('edit-school')?.value || '',
        grade,
        class_id: classId,
        student_phone: document.getElementById('edit-student-phone')?.value || '',
        parent_phone: document.getElementById('edit-parent-phone')?.value || '',
        guardian_relation: document.getElementById('edit-guardian-rel')?.value || '',
        memo: finalMemo,
        student_pin: pin,
        high_subjects: JSON.stringify(highSubjects),
        highSubjects: highSubjects
    };

    try {
        const r = await api.patch(`students/${sid}`, payload);
        if (r?.success) {
            toast('학생 정보가 수정되었습니다.', 'success');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '학생 정보 수정에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleEditStudent] failed:', e);
        toast('학생 정보 수정 중 오류가 발생했습니다.', 'error');
    }
}

function openAddStudent(defaultCid = '', options = {}) {
    if (options.returnTo && typeof setModalReturnView === 'function') setModalReturnView(options.returnTo);
    const opts = sortClassesForStudentModal(state.db.classes.filter(c => Number(c.is_active) !== 0)).map(c => `<option value="${apEscapeHtml(String(c.id))}" ${String(c.id)===String(defaultCid)?'selected':''}>${apEscapeHtml(String(c.name || ''))}</option>`).join('');
    showModal('신규 학생 추가', `
        <div style="display: flex; flex-direction: column; gap: 10px; padding: 0 16px 4px; box-sizing: border-box;">
            <input id="add-name" class="std-input-base" placeholder="이름 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-school" class="std-input-base" placeholder="학교 (필수)" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <select id="add-class" class="std-input-base" onchange="syncAddStudentHighSubjects()" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;"><option value="">반 선택</option>${opts}</select>
            <input id="add-student-phone" class="std-input-base" placeholder="학생 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-parent-phone" class="std-input-base" placeholder="학부모 전화번호" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-guardian-rel" class="std-input-base" placeholder="보호자 관계" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            <input id="add-student-pin" class="std-input-base" placeholder="PIN (4자리 숫자, 선택)" maxlength="4" style="width: 100%; min-height: 42px; box-sizing: border-box; padding: 0 12px; border: 1px solid var(--border); border-radius: 10px; background: var(--surface-2); color: var(--text); font-size: 13px; font-weight: 700; outline: none;">
            ${renderHighSubjectChecks('add', inferGradeFromClass(state.db.classes.find(c => String(c.id) === String(defaultCid))), [])}
        </div>
    `, '추가', handleAddStudent);
}

async function handleAddStudent() {
    const returnCtx = state.ui.modalReturnView || state.ui.returnView || null;
    const n = document.getElementById('add-name')?.value.trim() || '';
    const sc = document.getElementById('add-school')?.value.trim() || '';
    const classId = document.getElementById('add-class')?.value || '';
    const pin = document.getElementById('add-student-pin')?.value.trim() || '';
    const studentPhone = document.getElementById('add-student-phone')?.value.trim() || '';
    const parentPhone = document.getElementById('add-parent-phone')?.value.trim() || '';
    const guardianRelation = document.getElementById('add-guardian-rel')?.value.trim() || '';
    if (!n || !sc) { toast('이름과 학교를 입력해주세요.', 'warn'); return; }
    if (pin && !/^\d{4}$/.test(pin)) { toast('PIN은 4자리 숫자입니다.', 'warn'); return; }

    if (!classId) { toast('반을 선택하세요.', 'warn'); return; }
    const cls = state.db.classes.find(c => String(c.id) === String(classId));
    if (!cls) { toast('반 정보를 찾을 수 없습니다.', 'warn'); return; }
    const grade = inferGradeFromClass(cls);
    const highSubjects = collectHighSubjects('add', grade);
    const payload = {
        name: n, school_name: sc, schoolName: sc, grade: grade || '',
        class_id: classId, classId: classId,
        student_pin: pin || '', studentPin: pin || '',
        student_phone: studentPhone, studentPhone: studentPhone,
        parent_phone: parentPhone, parentPhone: parentPhone,
        guardian_relation: guardianRelation, guardianRelation: guardianRelation,
        high_subjects: JSON.stringify(highSubjects), highSubjects: highSubjects,
        memo: ''
    };

    try {
        const r = await api.post('students', payload);
        if (r?.success) {
            toast('학생이 추가되었습니다.', 'success');
            await loadData();
            returnFromStudentFlow(returnCtx);
            return;
        }
        toast(r?.message || r?.error || '학생 추가에 실패했습니다.', 'error');
    } catch (e) {
        console.error('[handleAddStudent] failed:', e);
        toast('학생 추가 중 오류가 발생했습니다.', 'error');
    }
}

function openDischargedStudents() {
    const discharged = state.db.students.filter(s => s.status === '제적');
    const rows = discharged.map(s => `
        <div style="padding: 14px 12px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; background: var(--surface);">
            <div><b style="font-size: 14px; font-weight:700; color: var(--text); line-height: 1.4;">${apEscapeHtml(s.name)}</b> <span style="font-size: 12px; color: var(--secondary); font-weight: 600; line-height: 1.5; margin-left: 4px;">${apEscapeHtml(s.school_name || '')}</span></div>
            <button class="btn btn-primary" style="min-height: 44px; padding: 10px 14px; font-size: 13px; font-weight:700; border-radius: 12px; box-shadow: none;" onclick="handleRestore('${s.id}')">재원 복구</button>
        </div>
    `).join('');
    showModal('퇴원생 관리', `<div style="max-height: 60vh; overflow-y: auto; margin: -20px 0;">${rows || '<div style="padding: 40px; text-align: center; color: var(--secondary); font-weight:700; font-size: 13px; line-height: 1.5;">퇴원생이 없습니다.</div>'}</div>`);
}
