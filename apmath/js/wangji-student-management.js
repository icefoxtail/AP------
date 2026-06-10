/* =====================================================================
 * wangji-student-management.js
 * 왕지교육 공통 학생관리 v1 — 1차 독립(관리자 전용) 화면 로직
 *
 * 최상위 원칙 (CODEX_TASK.md 준수):
 *   - 기존 AP/EIE DB 는 원본. 이 화면은 overlay/link/index 다.
 *   - 1차는 read-only adapter 만. 원본 DB write / API POST·PATCH·DELETE 금지.
 *   - cross-DB JOIN 금지. AP/EIE 는 각자 HTTP API 로만 읽는다.
 *   - adapter 실패는 해당 섹션 section_errors 로만 표시 (전체 화면 비파괴).
 *   - 공통 상담 입력은 skeleton + 저장 비활성 (write-through 미구현).
 *   - fake 데이터를 운영 데이터처럼 넣지 않는다.
 * ===================================================================== */
(function () {
  'use strict';

  // ---- API base (기존 프론트 설정과 동일한 prod 워커) -------------------
  // 필요 시 window.WSM_AP_API_BASE / window.WSM_EIE_API_BASE 로 override.
  var AP_API_BASE = (window.WSM_AP_API_BASE || 'https://ap-math-os-v2612.js-pdf.workers.dev/api').replace(/\/+$/, '');
  var EIE_API_BASE = (window.WSM_EIE_API_BASE || 'https://wangji-eie-os.js-pdf.workers.dev').replace(/\/+$/, '');

  // ---- 인증 헤더 (read-only 조회용) -----------------------------------
  // 기존 앱이 localStorage 에 저장한 세션을 best-effort 로 재사용한다.
  // 토큰이 없거나 무효면 adapter 는 section_errors 로 보고한다.
  function apAuthHeader() {
    try {
      var s = JSON.parse(window.localStorage.getItem('APMATH_SESSION') || 'null');
      if (s && s.session_token) return { 'Authorization': 'Bearer ' + s.session_token };
    } catch (e) {}
    return {};
  }

  function eieAuthHeader() {
    var keys = ['WANGJI_EIE_SESSION_TOKEN', 'WANGJI_AUTH_TOKEN', 'WANGJI_SESSION_TOKEN',
                'TEACHER_SESSION_TOKEN', 'teacher_session_token', 'session_token'];
    for (var i = 0; i < keys.length; i++) {
      try {
        var raw = window.localStorage.getItem(keys[i]);
        if (raw && raw.trim()) {
          var t = raw.trim();
          return { 'Authorization': /^(Bearer|Basic)\s+/i.test(t) ? t : 'Bearer ' + t };
        }
      } catch (e) {}
    }
    return {};
  }

  function readJson(url, headers) {
    return fetch(url, { headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}) })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  // ====================================================================
  // apStudentAdapter (read-only)
  // ====================================================================
  var apStudentAdapter = {
    sourceApp: 'AP',
    // AP 학생 검색: 기존 students 목록을 읽어 클라이언트 필터.
    search: function (query) {
      return readJson(AP_API_BASE + '/students', apAuthHeader())
        .then(function (res) {
          var rows = Array.isArray(res) ? res : (res.students || res.data || []);
          var q = String(query || '').trim();
          var filtered = !q ? rows : rows.filter(function (s) {
            return String(s.name || '').indexOf(q) >= 0 || String(s.school_name || '').indexOf(q) >= 0;
          });
          return filtered.map(function (s) { return mapApSummary(s); });
        })
        .catch(function (e) {
          return { __section_error: 'AP 학생 검색 endpoint 확인 필요 (' + e.message + ')' };
        });
    },
    // AP 학생 상세 + 수강/상담 read-only.
    getDetail: function (sourceStudentId) {
      var detail = { source_app: 'AP', source_student_id: sourceStudentId, section_errors: [] };
      return readJson(AP_API_BASE + '/students/' + encodeURIComponent(sourceStudentId) + '/detail-data', apAuthHeader())
        .then(function (res) {
          var d = res.data || res || {};
          Object.assign(detail, mapApSummary(d.student || d));
          detail.enrollments = d.classes || d.enrollments || [];
          detail.schedules = d.time_slots || d.schedules || [];
          detail.consultations = d.consultations || [];
          detail.detail_url = null; // deeplink 미확정 → 1차 비활성
          return detail;
        })
        .catch(function (e) {
          detail.section_errors.push('AP 상세 endpoint 확인 필요 (' + e.message + ')');
          return detail;
        });
    }
  };

  function mapApSummary(s) {
    s = s || {};
    return {
      source_app: 'AP',
      source_student_id: s.id,
      display_name: s.name,
      school_name: s.school_name,
      grade: s.grade,
      phone: s.parent_phone || s.student_phone,
      status: s.status
    };
  }

  // ====================================================================
  // eieStudentAdapter (read-only)
  // ====================================================================
  var eieStudentAdapter = {
    sourceApp: 'EIE',
    search: function (query) {
      return readJson(EIE_API_BASE + '/api/eie/confirmed-students', eieAuthHeader())
        .then(function (res) {
          var rows = res.students || res.confirmed_students || res.data || [];
          var q = String(query || '').trim();
          var filtered = !q ? rows : rows.filter(function (s) {
            return String(s.display_name || s.name || '').indexOf(q) >= 0
                || String(s.school_name || '').indexOf(q) >= 0;
          });
          return filtered.map(function (s) { return mapEieSummary(s); });
        })
        .catch(function (e) {
          return { __section_error: 'EIE 학생 검색 endpoint 확인 필요 (' + e.message + ')' };
        });
    },
    getDetail: function (sourceStudentId) {
      var detail = { source_app: 'EIE', source_student_id: sourceStudentId, section_errors: [] };
      // EIE 상담 read-only
      return readJson(EIE_API_BASE + '/api/eie/consultations?student_id=' + encodeURIComponent(sourceStudentId), eieAuthHeader())
        .then(function (res) { detail.consultations = res.consultations || res.data || []; })
        .catch(function (e) { detail.section_errors.push('EIE 상담 endpoint 확인 필요 (' + e.message + ')'); })
        .then(function () {
          // EIE 시간표/셀 배정 read-only
          return readJson(EIE_API_BASE + '/api/eie/timetable', eieAuthHeader())
            .then(function (res) { detail.schedules = res.timetable || res.data || []; })
            .catch(function (e) { detail.section_errors.push('EIE 시간표 endpoint 확인 필요 (' + e.message + ')'); });
        })
        .then(function () {
          detail.enrollments = detail.enrollments || [];
          detail.detail_url = null; // EIE 해시 deeplink 미확정 → 1차 비활성
          return detail;
        });
    }
  };

  function mapEieSummary(s) {
    s = s || {};
    return {
      source_app: 'EIE',
      source_student_id: s.id,
      display_name: s.display_name || s.name,
      school_name: s.school_name,
      grade: s.grade,
      phone: s.parent_phone || s.student_phone,
      status: s.status
    };
  }

  // ====================================================================
  // UI
  // ====================================================================
  var state = { filter: 'all', items: [], selected: null, sectionErrors: [] };

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function runSearch() {
    var q = $('#wsm-search-input').value;
    state.items = [];
    state.sectionErrors = [];
    renderList(true);
    var jobs = [];
    if (state.filter === 'all' || state.filter === 'ap' || state.filter === 'ap_eie' || state.filter === 'candidate') {
      jobs.push(apStudentAdapter.search(q));
    }
    if (state.filter === 'all' || state.filter === 'eie' || state.filter === 'ap_eie' || state.filter === 'candidate') {
      jobs.push(eieStudentAdapter.search(q));
    }
    Promise.all(jobs).then(function (results) {
      var merged = [];
      results.forEach(function (r) {
        if (r && r.__section_error) { state.sectionErrors.push(r.__section_error); return; }
        if (Array.isArray(r)) merged = merged.concat(r);
      });
      state.items = merged;
      renderList(false);
    });
  }

  function renderList(loading) {
    var box = $('#wsm-list');
    box.innerHTML = '';
    state.sectionErrors.forEach(function (msg) {
      box.appendChild(el('div', { class: 'wsm-section-error', text: msg }));
    });
    if (loading) { box.appendChild(el('div', { class: 'wsm-empty', text: '불러오는 중…' })); return; }
    if (!state.items.length) {
      box.appendChild(el('div', { class: 'wsm-empty', text: '표시할 학생이 없습니다. (검색어/필터 확인 또는 위 연결 오류 확인)' }));
      return;
    }
    state.items.forEach(function (item) {
      var card = el('div', { class: 'wsm-card' + (state.selected === item ? ' is-selected' : '') });
      var name = el('div', { class: 'name', text: item.display_name || '(이름 없음)' });
      name.appendChild(el('span', { class: 'wsm-src-badge ' + (item.source_app === 'AP' ? 'ap' : 'eie'), text: item.source_app }));
      card.appendChild(name);
      card.appendChild(el('div', { class: 'meta', text: [item.school_name, item.grade, item.status].filter(Boolean).join(' · ') }));
      card.addEventListener('click', function () { selectStudent(item); });
      box.appendChild(card);
    });
  }

  function selectStudent(item) {
    state.selected = item;
    renderList(false);
    var detail = $('#wsm-detail');
    detail.innerHTML = '<div class="wsm-empty">상세 불러오는 중…</div>';
    var adapter = item.source_app === 'AP' ? apStudentAdapter : eieStudentAdapter;
    adapter.getDetail(item.source_student_id).then(function (d) { renderDetail(item, d); });
  }

  function kv(pairs) {
    var dl = el('dl', { class: 'wsm-kv' });
    pairs.forEach(function (p) {
      dl.appendChild(el('dt', { text: p[0] }));
      dl.appendChild(el('dd', { text: (p[1] == null || p[1] === '') ? '—' : String(p[1]) }));
    });
    return dl;
  }

  function sectionTitle(text, readonly) {
    var h = el('h3', { text: text });
    if (readonly) h.appendChild(el('span', { class: 'wsm-readonly-tag', text: 'read-only' }));
    return h;
  }

  function renderDetail(item, d) {
    var root = el('div');

    // 공통 요약
    var sumWrap = el('div', { class: 'wsm-section' });
    sumWrap.appendChild(sectionTitle('공통 요약', false));
    sumWrap.appendChild(kv([
      ['이름', item.display_name], ['학교', item.school_name], ['학년', item.grade],
      ['연락처', item.phone], ['상태', item.status], ['연결 소스', item.source_app]
    ]));
    root.appendChild(sumWrap);

    // 연결 상태 섹션 (overlay/link/index — 1차는 표시만)
    var linkWrap = el('div', { class: 'wsm-section' });
    linkWrap.appendChild(sectionTitle('연결 상태', false));
    linkWrap.appendChild(kv([
      ['source_app', d.source_app], ['source_student_id', d.source_student_id],
      ['link_status', 'candidate (관리자 확정 필요 · 자동 병합 금지)']
    ]));
    root.appendChild(linkWrap);

    // AP / EIE 원본 섹션
    var srcWrap = el('div', { class: 'wsm-section' });
    srcWrap.appendChild(sectionTitle(item.source_app + ' 원본 정보 · 수강/시간', true));
    (d.section_errors || []).forEach(function (msg) {
      srcWrap.appendChild(el('div', { class: 'wsm-section-error', text: msg }));
    });
    srcWrap.appendChild(kv([
      ['수강 반/과목', summarize(d.enrollments)],
      ['수업 시간', summarize(d.schedules)]
    ]));
    // 기존 상세 열기 (deeplink 미확정 → 비활성)
    var openBtn = el('button', { class: 'wsm-btn', type: 'button', text: item.source_app + ' 상세 열기' });
    openBtn.disabled = !d.detail_url;
    if (!d.detail_url) openBtn.title = 'deeplink 확인 필요';
    srcWrap.appendChild(openBtn);
    root.appendChild(srcWrap);

    // 상담 read-only 요약
    var cWrap = el('div', { class: 'wsm-section' });
    cWrap.appendChild(sectionTitle(item.source_app + ' 상담 (read-only)', true));
    var consults = d.consultations || [];
    if (!consults.length) cWrap.appendChild(el('div', { class: 'wsm-empty', text: '표시할 상담이 없습니다.' }));
    else consults.slice(0, 5).forEach(function (c) {
      cWrap.appendChild(kv([[(c.date || c.consultation_date || ''), (c.content || '').slice(0, 80)]]));
    });
    root.appendChild(cWrap);

    // 공통 상담 입력 skeleton (저장 비활성 — write-through 미구현)
    var formWrap = el('div', { class: 'wsm-section' });
    formWrap.appendChild(sectionTitle('공통 상담 입력 (1차: 저장 비활성)', false));
    var form = el('div', { class: 'wsm-consult-form' });
    var scope = el('select');
    ['COMMON', 'AP', 'EIE'].forEach(function (o) { scope.appendChild(el('option', { value: o, text: o })); });
    form.appendChild(scope);
    form.appendChild(el('input', { type: 'text', placeholder: '카테고리' }));
    form.appendChild(el('textarea', { rows: '3', placeholder: '상담 내용 (저장 대상: wangji overlay DB — 후속 단계에서 연결)' }));
    form.appendChild(el('input', { type: 'text', placeholder: '다음 조치' }));
    var saveBtn = el('button', { class: 'wsm-btn primary', type: 'button', text: '저장 (후속 단계에서 연결)' });
    saveBtn.disabled = true;
    form.appendChild(saveBtn);
    form.appendChild(el('div', { class: 'wsm-disabled-note',
      text: '※ 1차 안전 모드: 실제 저장은 미구현. 기존 AP/EIE 상담 DB 에 write 하지 않습니다.' }));
    formWrap.appendChild(form);
    root.appendChild(formWrap);

    var detail = $('#wsm-detail');
    detail.innerHTML = '';
    detail.appendChild(root);
  }

  function summarize(list) {
    if (!Array.isArray(list) || !list.length) return '—';
    return list.slice(0, 4).map(function (x) {
      return x.name || x.class_name || x.class_name_raw || x.subject
          || [x.day_of_week || x.day_label, x.start_time, x.end_time].filter(Boolean).join(' ')
          || JSON.stringify(x).slice(0, 30);
    }).join(', ');
  }

  function bindFilters() {
    var chips = document.querySelectorAll('.wsm-chip');
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.classList.remove('is-active'); });
        chip.classList.add('is-active');
        state.filter = chip.getAttribute('data-filter');
        runSearch();
      });
    });
  }

  function boot() {
    bindFilters();
    $('#wsm-search-btn').addEventListener('click', runSearch);
    $('#wsm-search-input').addEventListener('keydown', function (e) { if (e.key === 'Enter') runSearch(); });
    runSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  // 테스트/디버그용 노출 (운영 동작에는 영향 없음)
  window.WangjiStudentManagement = {
    apStudentAdapter: apStudentAdapter,
    eieStudentAdapter: eieStudentAdapter
  };
})();
