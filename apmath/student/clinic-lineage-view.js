// Student-facing rendering for the clinic source lineage read model (slice A/A0).
//
// The server decides everything security-relevant: it re-authorizes every
// referenced node and only then returns a narrow `clinic_lineage` object on a
// student's own assignment row. This module only formats that object and links
// to the exact existing assignment IDs already visible on the page.
(function (root) {
  'use strict';

  const VERSION = '2026.11.11.4';
  const STYLE_ID = 'student-clinic-lineage-style';
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

  function ensureStyles() {
    const doc = root.document;
    if (!doc || !doc.head || doc.getElementById(STYLE_ID)) return;
    const style = doc.createElement('style');
    style.id = STYLE_ID;
    style.textContent = [
      '.clinic-lineage{margin-top:12px;padding:14px 16px;border-radius:8px;background:var(--surface-2,#f5f3f0);border:1px solid var(--border,#e8e5e0);color:var(--text,#1c1917);font-size:14px;line-height:1.6;}',
      '.clinic-lineage-title{font-size:12px;font-weight:600;color:var(--secondary,#6b645f);margin:0 0 8px;}',
      '.clinic-lineage-row{margin-top:4px;overflow-wrap:anywhere;}',
      '.clinic-lineage-row strong{font-weight:600;}',
      '.clinic-lineage-meta,.clinic-lineage-note{font-size:12px;color:var(--secondary,#6b645f);overflow-wrap:anywhere;}',
      '.clinic-lineage-note{margin-top:6px;}',
      '.clinic-lineage-note.is-unavailable{color:var(--warning,#b45309);}',
      '.clinic-lineage-links{margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;}',
      '.clinic-lineage-derived{display:flex;flex-direction:column;gap:8px;margin-top:10px;}',
      '.clinic-lineage-derived-row{display:flex;justify-content:space-between;gap:12px;align-items:center;}',
      '.clinic-lineage-derived-row + .clinic-lineage-derived-row{border-top:1px solid var(--border,#e8e5e0);padding-top:8px;}',
      '.clinic-lineage-exam{min-width:0;overflow-wrap:anywhere;}',
      '.clinic-lineage-exam .clinic-lineage-meta{display:block;}',
      '.clinic-lineage .clinic-lineage-link{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;min-height:44px;margin:0;padding:10px 14px;border:1px solid var(--control-border,#857e78);border-radius:8px;background:var(--surface,#fff);color:var(--text,#1c1917);font:inherit;font-size:14px;line-height:1.4;cursor:pointer;}',
      '.clinic-lineage .clinic-lineage-link:focus-visible{outline:2px solid var(--primary,#2563eb);outline-offset:3px;}',
      '@media(hover:hover){.clinic-lineage .clinic-lineage-link:hover{background:var(--bg,#faf9f7);}}',
      '@media(max-width:600px){.clinic-lineage{padding:12px;}.clinic-lineage-derived-row{gap:8px;}}'
    ].join('');
    doc.head.appendChild(style);
  }

  function nodeButton(assignmentId, label, key) {
    const id = text(assignmentId);
    if (!ASSIGNMENT_ID.test(id)) return '';
    return `<button type="button" class="btn clinic-lineage-link" data-clinic-lineage-link="${escapeHtml(key || id)}" onclick="StudentClinicLineageView.focusNode('${escapeHtml(id)}')">${escapeHtml(label)}</button>`;
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
      <div class="clinic-lineage-row">기준 시험: <strong>${title}</strong>${meta ? `<span class="clinic-lineage-meta"> · ${meta}</span>` : ''}</div>
      <div class="clinic-lineage-row clinic-lineage-meta">${escapeHtml(attemptLine(lineage))}</div>
      ${note ? `<div class="clinic-lineage-note is-unavailable">${escapeHtml(note)}</div>` : ''}
      ${unavailable ? '' : `<div class="clinic-lineage-links">${nodeButton(source.assignmentId, '기준 시험 보기', `source-${source.assignmentId}`)}</div>`}
    `;
  }

  function derivedRows(lineage) {
    const derived = Array.isArray(lineage.derivedAssignments) ? lineage.derivedAssignments : [];
    if (!derived.length) return '';
    const rows = derived.slice(0, 8).map(item => {
      const title = escapeHtml(text(item.examTitle) || '보충 시험');
      const modeLabel = text(item.mode) === 'same_uid' ? '같은 문제 다시 풀기'
        : text(item.mode) === 'similar_uid' ? '유사문항 보충'
          : text(item.mode) === 'ordinary_transfer' ? '전용 시험' : '';
      const meta = [text(item.examDate), modeLabel]
        .filter(Boolean).map(escapeHtml).join(' · ');
      return `<div class="clinic-lineage-derived-row">
        <span class="clinic-lineage-exam">${title}${meta ? `<span class="clinic-lineage-meta">${meta}</span>` : ''}</span>
        ${nodeButton(item.assignmentId, '시험 보기', `derived-${item.assignmentId}`)}
      </div>`;
    }).join('');
    return `<div class="clinic-lineage-derived">${rows}</div>`;
  }

  function shell(titleText, body) {
    return `
      <section class="clinic-lineage">
        <div class="clinic-lineage-title">${escapeHtml(titleText)}</div>
        ${body}
      </section>
    `;
  }

  function renderCard(exam) {
    const lineage = exam && typeof exam === 'object' ? exam.clinic_lineage : null;
    if (!lineage || typeof lineage !== 'object') return '';
    ensureStyles();
    const status = text(lineage.status);
    const derived = derivedRows(lineage);
    if (text(lineage.relation) === 'source_of_follow_up') {
      return derived ? shell('이 시험에서 이어진 보충 시험', derived) : '';
    }
    const title = text(lineage.mode) === 'same_uid' ? '기준 시험 → 같은 문제 다시 풀기'
      : text(lineage.mode) === 'similar_uid' ? '기준 시험 → 유사문항 보충 시험'
        : '기준 시험 → 보충 시험';
    if (status === 'verified' && lineage.source) {
      return shell(title, `${sourceRow(lineage)}${derived}`);
    }
    if (status === 'unknown') {
      return shell(title, `<div class="clinic-lineage-note">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
    }
    if (status === 'unavailable') {
      return shell(title, `<div class="clinic-lineage-note is-unavailable">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
    }
    return shell(title, `<div class="clinic-lineage-note">${escapeHtml(reasonLabel(lineage.reason))}</div>`);
  }

  function focusNode(assignmentId) {
    const id = text(assignmentId);
    if (!ASSIGNMENT_ID.test(id)) return;
    const card = document.getElementById(`student-assignment-${id}`);
    if (card) {
      const reducedMotion = typeof root.matchMedia === 'function' && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
      card.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
      card.style.boxShadow = '0 0 0 2px var(--primary, #2563eb)';
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
