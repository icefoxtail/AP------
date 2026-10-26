// Student-facing rendering for the clinic source lineage read model (slice A/A0).
//
// The server decides everything security-relevant: it re-authorizes every
// referenced node and only then returns a narrow `clinic_lineage` object on a
// student's own assignment row. This module only formats that object and links
// to the exact existing assignment IDs already visible on the page.
(function (root) {
  'use strict';

  const VERSION = '2026.10.26.2';
  const ASSIGNMENT_ID = /^[A-Za-z0-9_:.\-]{1,80}$/;

  const REASON_LABELS = {
    SOURCE_PROVENANCE_ABSENT: '이 시험에는 기준 시험 관계가 기록되어 있지 않습니다.',
    SOURCE_RECIPIENT_NOT_LISTED: '이 시험의 기준 시험 관계에 내 기록이 없습니다.',
    SOURCE_ASSIGNMENT_NOT_FOUND: '기준 시험 배정을 찾을 수 없습니다.',
    SOURCE_RECIPIENT_NOT_CONFIRMED: '기준 시험의 수신 학생으로 확인되지 않습니다.',
    SOURCE_CLASS_OUT_OF_SCOPE: '이 화면에서 확인할 수 없는 반의 시험입니다.',
    SOURCE_IDENTITY_MISMATCH: '기준 시험 정보가 저장된 내용과 일치하지 않습니다.',
    SOURCE_SESSION_MISMATCH: '기준 응시 기록이 저장된 응시와 일치하지 않습니다.',
    SOURCE_SESSION_UNAVAILABLE: '기준 응시 기록을 확인할 수 없습니다.',
    SOURCE_NODE_LIMIT_EXCEEDED: '한 번에 확인할 수 있는 기준 시험 수를 넘었습니다.',
    SOURCE_SAVED_PAPER_UNAVAILABLE: '기준 시험의 저장 기록을 확인하지 못했습니다.',
    SOURCE_SAVED_PAPER_MISSING: '기준 시험의 저장 기록을 찾을 수 없습니다.',
    SOURCE_SAVED_PAPER_DELETED: '기준 시험의 저장 기록이 삭제되었습니다.',
    SOURCE_SAVED_PAPER_MISMATCH: '기준 시험의 저장 기록과 배정 정보가 일치하지 않습니다.',
    SOURCE_EVIDENCE_UNAVAILABLE: '기준 시험 정보를 확인하지 못했습니다.',
    LINEAGE_READ_FAILED: '기준 시험 관계를 불러오지 못했습니다.'
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, ch => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function text(value) {
    return String(value == null ? '' : value).trim();
  }

  function reasonLabel(reason) {
    return REASON_LABELS[text(reason)] || '기준 시험 관계를 확인할 수 없습니다.';
  }

  function nodeButton(assignmentId, label, key) {
    const id = text(assignmentId);
    if (!ASSIGNMENT_ID.test(id)) return '';
    return `<button type="button" class="btn" data-clinic-lineage-link="${escapeHtml(key || id)}" onclick="StudentClinicLineageView.focusNode('${escapeHtml(id)}')">${escapeHtml(label)}</button>`;
  }

  function attemptLine(lineage) {
    const state = text(lineage.sourceAttemptState);
    const attempt = lineage.sourceAttempt;
    if (state === 'recorded' && attempt) {
      const submitted = attempt.submissionStatus === 'submitted' ? '제출 완료'
        : attempt.submissionStatus === 'unsubmitted' ? '제출 전' : '제출 상태 미확인';
      const score = attempt.scoreAvailable ? ` · ${attempt.score}점` : '';
      const when = text(attempt.examDate || attempt.submittedAt);
      return `기준 응시: ${when || '날짜 미상'} · ${submitted}${score}`;
    }
    if (state === 'no_attempt') return '기준 응시: 기록된 응시가 없습니다.';
    if (state === 'not_applicable') return '';
    return '기준 응시: 기록을 확인할 수 없습니다.';
  }

  function sourceRow(lineage) {
    const source = lineage.source;
    const title = escapeHtml(text(source.examTitle) || '기준 시험');
    const meta = [text(source.examDate), Number(source.questionCount) ? `${Number(source.questionCount)}문항` : '']
      .filter(Boolean).map(escapeHtml).join(' · ');
    const availability = text(source.availability);
    const unavailable = availability === 'cancelled' || availability === 'excluded';
    const note = availability === 'cancelled' ? '기준 시험이 취소되어 열 수 없습니다.'
      : availability === 'excluded' ? '기준 시험에서 제외되어 열 수 없습니다.' : '';
    return `
      <div class="clinic-lineage-row" style="margin-top:6px;font-size:13px;color:#111827;">기준 시험: <strong>${title}</strong>${meta ? ` · ${meta}` : ''}</div>
      <div class="clinic-lineage-row" style="margin-top:2px;font-size:12px;color:#4B5563;">${escapeHtml(attemptLine(lineage))}</div>
      ${note ? `<div class="clinic-lineage-note" style="margin-top:2px;font-size:12px;color:#92400E;">${escapeHtml(note)}</div>` : ''}
      ${unavailable ? '' : `<div class="clinic-lineage-links" style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap;">${nodeButton(source.assignmentId, '기준 시험 보기', `source-${source.assignmentId}`)}</div>`}
    `;
  }

  function derivedRows(lineage) {
    const derived = Array.isArray(lineage.derivedAssignments) ? lineage.derivedAssignments : [];
    if (!derived.length) return '';
    const rows = derived.slice(0, 8).map(item => {
      const title = escapeHtml(text(item.examTitle) || '보충 시험');
      const modeLabel = text(item.mode) === 'same_uid' ? '같은 UID 재연습'
        : text(item.mode) === 'similar_uid' ? '유사문항 보충'
          : text(item.mode) === 'ordinary_transfer' ? '전용 시험' : '';
      const meta = [text(item.examDate), modeLabel]
        .filter(Boolean).map(escapeHtml).join(' · ');
      return `<div style="display:flex;justify-content:space-between;gap:8px;align-items:center;margin-top:6px;">
        <span style="font-size:13px;color:#111827;min-width:0;overflow-wrap:anywhere;">${title}${meta ? `<span style="color:#6B7280;"> · ${meta}</span>` : ''}</span>
        ${nodeButton(item.assignmentId, '열기', `derived-${item.assignmentId}`)}
      </div>`;
    }).join('');
    return `<div class="clinic-lineage-derived" style="margin-top:8px;">${rows}</div>`;
  }

  function shell(titleText, body) {
    return `
      <section class="clinic-lineage" style="margin-top:10px;padding:10px 12px;border-radius:12px;background:#F8FAFC;border:1px solid rgba(17,24,39,0.08);">
        <div style="font-size:12px;font-weight:700;color:#374151;">${escapeHtml(titleText)}</div>
        ${body}
      </section>
    `;
  }

  function renderCard(exam) {
    const lineage = exam && typeof exam === 'object' ? exam.clinic_lineage : null;
    if (!lineage || typeof lineage !== 'object') return '';
    const status = text(lineage.status);
    const derived = derivedRows(lineage);
    if (text(lineage.relation) === 'source_of_follow_up') {
      return derived ? shell('이 시험에서 이어진 보충 시험', derived) : '';
    }
    const title = text(lineage.mode) === 'same_uid' ? '기준 시험 → 같은 UID 재연습'
      : text(lineage.mode) === 'similar_uid' ? '기준 시험 → 유사문항 보충 시험'
        : '기준 시험 → 보충 시험';
    if (status === 'verified' && lineage.source) {
      return shell(title, `${sourceRow(lineage)}${derived}`);
    }
    if (status === 'unknown') {
      return shell(title, `<div style="margin-top:6px;font-size:12px;color:#4B5563;">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
    }
    if (status === 'unavailable') {
      return shell(title, `<div style="margin-top:6px;font-size:12px;color:#92400E;">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
    }
    return shell(title, `<div style="margin-top:6px;font-size:12px;color:#4B5563;">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
  }

  function focusNode(assignmentId) {
    const id = text(assignmentId);
    if (!ASSIGNMENT_ID.test(id)) return;
    const card = document.getElementById(`student-assignment-${id}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.boxShadow = '0 0 0 2px #2563EB';
      setTimeout(() => { card.style.boxShadow = ''; }, 1600);
      return;
    }
    const exam = typeof root.findOmrExam === 'function' ? root.findOmrExam(id) : null;
    if (exam && typeof root.openOmrReview === 'function') {
      root.openOmrReview(id, 'exam');
      return;
    }
    if (typeof root.toast === 'function') {
      root.toast('이 시험지는 현재 목록에서 확인할 수 없습니다. 목록을 새로고침한 뒤 다시 확인하세요.');
    }
  }

  root.StudentClinicLineageView = Object.freeze({ version: VERSION, renderCard, focusNode });
}(typeof globalThis !== 'undefined' ? globalThis : this));
