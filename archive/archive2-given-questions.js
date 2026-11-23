/* "이 학생(반)에게 이미 준 문항" 조회와 이번 접속에서 이미 뽑은 문항 기억.
 *
 * 단원별 기출이 쓰고, 문제지 만들기 같은 다른 화면도 그대로 붙일 수 있게 화면에 묶이지 않은 독립 모듈이다(전역 Archive2GivenQuestions,
 * node require 겸용). 서버 조회는 GET /class-exam-assignments/given-questions 하나다(읽기 전용, 교사 인증은 호출한 쪽 request가 맡는다).
 *
 * 원칙: 조회가 실패해도(로그인 만료·네트워크·서버가 아직 새 조회를 모름) 뽑기는 막지 않는다. fetchGiven은 던지지 않고
 * { ok:false, reason } 으로 돌려주며, 화면은 제외 없이 진행하고 한 줄로 알린다.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Archive2GivenQuestions = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ROUTE = '/class-exam-assignments/given-questions';
  const UID = /^qid_v1_[a-f0-9]{64}$/;
  const GRADES = ['중1', '중2', '중3', '고1', '고2', '고3'];
  const text = value => String(value == null ? '' : value).trim();

  // 대상: { kind:'class', classId } 또는 { kind:'student', studentId } (이름 등 표시용 값은 따로 붙어 있어도 된다).
  function targetKey(target) {
    if (!target) return '';
    if (target.kind === 'student' && text(target.studentId)) return `student:${text(target.studentId)}`;
    if (target.kind === 'class' && text(target.classId)) return `class:${text(target.classId)}`;
    return '';
  }
  function targetQuery(target) {
    if (!targetKey(target)) return '';
    return target.kind === 'student' ? `student_ids=${encodeURIComponent(text(target.studentId))}` : `class_id=${encodeURIComponent(text(target.classId))}`;
  }

  // 실패 원인을 화면 말로 바꿀 수 있게 몇 가지로만 가른다.
  function failureReason(error) {
    const status = Number(error && error.status) || 0;
    if (status === 401) return 'login';
    if (status === 403) return 'forbidden';
    if (status === 404 || status === 405) return 'unsupported'; // 옛 서버: 새 조회를 아직 모름
    if (error && error.timeout) return 'timeout';
    return 'error';
  }
  function failureMessage(reason) {
    return ({
      login: '로그인이 끝나 이미 준 문항을 확인하지 못했습니다. 제외 없이 뽑았습니다. 로그인한 뒤 대상을 다시 고르면 제외됩니다.',
      forbidden: '이 대상의 출제 기록을 볼 권한이 없어 제외 없이 뽑았습니다.',
      unsupported: '서버가 아직 이미 준 문항 조회를 지원하지 않아 제외 없이 뽑았습니다.',
      timeout: '이미 준 문항 확인이 늦어져 제외 없이 뽑았습니다. 대상을 다시 고르면 다시 확인합니다.',
      error: '이미 준 문항을 확인하지 못해 제외 없이 뽑았습니다. 대상을 다시 고르면 다시 확인합니다.'
    })[reason] || '이미 준 문항을 확인하지 못해 제외 없이 뽑았습니다.';
  }

  // request(route, { method:'GET', timeoutMs }) → 서버 응답 객체. 던지지 않는다.
  async function fetchGiven(request, target, options = {}) {
    const query = targetQuery(target);
    if (!query) return { ok: false, reason: 'no-target', uids: new Set(), assignments: 0, unresolved: 0, truncated: false };
    const from = /^\d{4}-\d{2}-\d{2}$/.test(text(options.from)) ? `&from=${text(options.from)}` : '';
    try {
      const data = await request(`${ROUTE}?${query}${from}`, { method: 'GET', timeoutMs: options.timeoutMs || 20000 });
      const uids = new Set((Array.isArray(data && data.question_uids) ? data.question_uids : []).map(text).filter(uid => UID.test(uid)));
      return {
        ok: true, reason: '', uids,
        assignments: Number(data && data.assignment_count) || 0,
        unresolved: Number(data && data.unresolved_assignment_count) || 0,
        truncated: Boolean(data && data.truncated)
      };
    } catch (error) {
      return { ok: false, reason: failureReason(error), uids: new Set(), assignments: 0, unresolved: 0, truncated: false };
    }
  }

  // 이번 접속(탭)에서 이미 뽑은 문항: 출제로 등록하지 않고 인쇄만 한 것도 다음 "다시 뽑기"에서 빠지게 한다.
  // 대상(학생·반)마다 따로 두고, 저장소(sessionStorage)가 막혀 있어도 메모리로 동작한다. UID 목록만 담는다(문항 내용은 담지 않는다).
  function createSessionMemory(storage, storageKey = 'archive2.unitGiven.session.v1') {
    const memory = new Map();
    const read = () => {
      try {
        const data = JSON.parse(storage.getItem(storageKey) || '{}');
        if (data && typeof data === 'object') for (const [key, list] of Object.entries(data)) if (Array.isArray(list) && !memory.has(key)) memory.set(key, new Set(list.filter(uid => UID.test(uid))));
      } catch (error) { /* 저장소가 없거나 깨졌으면 메모리만 쓴다 */ }
    };
    const write = () => {
      try { storage.setItem(storageKey, JSON.stringify(Object.fromEntries([...memory].map(([key, set]) => [key, [...set]])))); } catch (error) { /* 용량·차단: 메모리만 */ }
    };
    if (storage) read();
    return {
      get(key) { return new Set(memory.get(key) || []); },
      add(key, uids) {
        if (!key) return 0;
        const set = memory.get(key) || new Set();
        let added = 0;
        for (const uid of uids || []) if (UID.test(text(uid)) && !set.has(text(uid))) { set.add(text(uid)); added += 1; }
        memory.set(key, set);
        if (added && storage) write();
        return added;
      },
      clear(key) { if (key) memory.delete(key); else memory.clear(); if (storage) write(); }
    };
  }

  function union(...sets) {
    const out = new Set();
    for (const set of sets) for (const uid of set || []) out.add(uid);
    return out;
  }

  // 반 목록(서버 /qr-classes 줄)의 학년. 서버·출제 패널과 같은 규칙: 학년 칸이 있으면 그것, 없으면 이름의 "중1"·"고2" 같은 말.
  function classGradeOf(row) {
    const explicit = text(row && (row.grade || row.grade_label || row.class_grade)).replace(/\s/g, '');
    const name = text(row && (row.name || row.class_name)).match(/(?:중|고)[123]/);
    const grade = explicit || (name ? name[0] : '');
    return GRADES.includes(grade) ? grade : '';
  }
  // 선택 목록용: 지금 보는 학년의 반을 앞에 둔다. 반 이름만 보이게 정리한다.
  function classOptions(rows, grade) {
    const list = (Array.isArray(rows) ? rows : []).filter(row => text(row && row.id)).map(row => ({
      id: text(row.id), name: text(row.name || row.class_name) || '이름 없는 반', grade: classGradeOf(row)
    }));
    const rank = item => (grade && item.grade === grade ? 0 : 1);
    return list.sort((a, b) => rank(a) - rank(b) || (GRADES.indexOf(a.grade) < 0 ? 99 : GRADES.indexOf(a.grade)) - (GRADES.indexOf(b.grade) < 0 ? 99 : GRADES.indexOf(b.grade)) || a.name.localeCompare(b.name, 'ko') || a.id.localeCompare(b.id));
  }
  // 명단(서버 /class-exam-assignments/roster 줄) → { id, name }
  function rosterOptions(students) {
    return (Array.isArray(students) ? students : []).filter(row => text(row && row.id)).map(row => ({ id: text(row.id), name: text(row.name) || '이름 없음' }));
  }

  return { ROUTE, targetKey, targetQuery, failureReason, failureMessage, fetchGiven, createSessionMemory, union, classGradeOf, classOptions, rosterOptions };
});
