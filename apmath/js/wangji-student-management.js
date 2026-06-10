/* =====================================================================
 * wangji-student-management.js
 * 왕지 통합 학생관리 — 2차 (overlay 저장소 연결판)
 *
 * 저장소 책임 구분:
 *   - AP(ap-math-os) / EIE(wangji-eie-os): 원본. read-only adapter 로만 읽는다.
 *   - wangji-common-os(overlay): 공통 anchor/링크/상담/메모만 저장.
 *   - 원본 write-through 는 후속 단계 (이 파일에는 AP/EIE write 호출이 없다).
 *
 * 원칙:
 *   - cross-DB JOIN 금지, AP/EIE API 는 GET 만.
 *   - adapter 실패는 section_errors 로 격리.
 *   - 링크 자동 확정 금지 (서버도 candidate 강제, active 는 관리자 확정).
 *   - EIE 전체 시간표를 학생별 수업시간으로 표시하지 않는다.
 * ===================================================================== */
(function () {
  'use strict';

  // ---- API base -------------------------------------------------------
  var AP_API_BASE = (window.WSM_AP_API_BASE || 'https://ap-math-os-v2612.js-pdf.workers.dev/api').replace(/\/+$/, '');
  var EIE_API_BASE = (window.WSM_EIE_API_BASE || 'https://wangji-eie-os.js-pdf.workers.dev').replace(/\/+$/, '');
  var OVERLAY_API_BASE = (window.WSM_OVERLAY_API_BASE || 'https://wangji-common-worker.js-pdf.workers.dev/api/wangji').replace(/\/+$/, '');
  var OVERLAY_TOKEN_KEY = 'WANGJI_COMMON_SESSION_TOKEN';

  // ---- 인증 헤더 -------------------------------------------------------
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

  function overlayAuthHeader() {
    var t = '';
    try { t = window.localStorage.getItem(OVERLAY_TOKEN_KEY) || ''; } catch (e) {}
    return t ? { 'Authorization': 'Bearer ' + t } : {};
  }

  function readJson(url, headers) {
    return fetch(url, { headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}) })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      });
  }

  function sendJson(method, url, body, headers) {
    return fetch(url, {
      method: method,
      headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}),
      body: body == null ? undefined : JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok || j.success === false) throw new Error(j.error || ('HTTP ' + r.status));
        return j;
      });
    });
  }

  // ====================================================================
  // overlayApi — wangji-common-os (공통 저장소)
  //   status: 'planned'(미연결) | 'connected'(API 정상) | 'auth_required'(로그인 필요)
  // ====================================================================
  var overlayApi = {
    status: 'planned',
    async probe() {
      try {
        await readJson(OVERLAY_API_BASE + '/status');
        // API 자체는 살아있음 — 토큰 유효성은 students 목록으로 확인
        try {
          await readJson(OVERLAY_API_BASE + '/students', overlayAuthHeader());
          overlayApi.status = 'connected';
        } catch (e) {
          overlayApi.status = 'auth_required';
        }
      } catch (e) {
        overlayApi.status = 'planned';
      }
      renderOverlayStatus();
      return overlayApi.status;
    },
    async login(loginId, password) {
      var res = await sendJson('POST', OVERLAY_API_BASE + '/auth/login', { login_id: loginId, password: password });
      try { window.localStorage.setItem(OVERLAY_TOKEN_KEY, res.session_token); } catch (e) {}
      overlayApi.status = 'connected';
      renderOverlayStatus();
      return true;
    },
    listStudents: function (q) {
      return readJson(OVERLAY_API_BASE + '/students' + (q ? ('?q=' + encodeURIComponent(q)) : ''), overlayAuthHeader());
    },
    createStudent: function (payload) {
      return sendJson('POST', OVERLAY_API_BASE + '/students', payload, overlayAuthHeader());
    },
    patchStudent: function (id, payload) {
      return sendJson('PATCH', OVERLAY_API_BASE + '/students/' + encodeURIComponent(id), payload, overlayAuthHeader());
    },
    listQueue: function (status) {
      return readJson(OVERLAY_API_BASE + '/writethrough-queue' + (status ? ('?status=' + encodeURIComponent(status)) : ''), overlayAuthHeader());
    },
    createQueueItem: function (payload) {
      return sendJson('POST', OVERLAY_API_BASE + '/writethrough-queue', payload, overlayAuthHeader());
    },
    setQueueStatus: function (id, status) {
      return sendJson('PATCH', OVERLAY_API_BASE + '/writethrough-queue/' + encodeURIComponent(id) + '/status', { status: status }, overlayAuthHeader());
    },
    listLinks: function (wangjiStudentId) {
      return readJson(OVERLAY_API_BASE + '/students/' + encodeURIComponent(wangjiStudentId) + '/links', overlayAuthHeader());
    },
    findLinkBySource: async function (sourceApp, sourceStudentId) {
      // 전체 링크에서 source 기준 검색 (서버 UNIQUE 보장)
      var res = await readJson(OVERLAY_API_BASE + '/links', overlayAuthHeader());
      var rows = res.links || [];
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].source_app === sourceApp && rows[i].source_student_id === sourceStudentId) return rows[i];
      }
      return null;
    },
    createLink: function (payload) {
      return sendJson('POST', OVERLAY_API_BASE + '/links', payload, overlayAuthHeader());
    },
    setLinkStatus: function (linkId, status) {
      return sendJson('PATCH', OVERLAY_API_BASE + '/links/' + encodeURIComponent(linkId) + '/status',
                      { link_status: status }, overlayAuthHeader());
    },
    listConsultations: function (wangjiStudentId) {
      return readJson(OVERLAY_API_BASE + '/students/' + encodeURIComponent(wangjiStudentId) + '/consultations', overlayAuthHeader());
    },
    createConsultation: function (payload) {
      return sendJson('POST', OVERLAY_API_BASE + '/consultations', payload, overlayAuthHeader());
    },
    listMemos: function (wangjiStudentId) {
      return readJson(OVERLAY_API_BASE + '/students/' + encodeURIComponent(wangjiStudentId) + '/memos', overlayAuthHeader());
    },
    createMemo: function (payload) {
      return sendJson('POST', OVERLAY_API_BASE + '/memos', payload, overlayAuthHeader());
    }
  };

  // ====================================================================
  // apStudentAdapter (read-only)
  //   반/시간 매핑: GET /classes + /class-time-slots + /initial-data(class_students)
  //   상담: GET /consultations?student_id=
  // ====================================================================
  var apCache = { loaded: false, students: [], classesById: {}, slotsByClass: {}, classIdsByStudent: {} };

  function ensureApCache() {
    if (apCache.loaded) return Promise.resolve(apCache);
    return Promise.all([
      readJson(AP_API_BASE + '/students', apAuthHeader()),
      readJson(AP_API_BASE + '/classes', apAuthHeader()),
      readJson(AP_API_BASE + '/class-time-slots', apAuthHeader()),
      readJson(AP_API_BASE + '/initial-data', apAuthHeader())
    ]).then(function (r) {
      apCache.students = r[0].students || [];
      (r[1].classes || []).forEach(function (c) { apCache.classesById[c.id] = c; });
      (r[2].class_time_slots || []).forEach(function (s) {
        (apCache.slotsByClass[s.class_id] = apCache.slotsByClass[s.class_id] || []).push(s);
      });
      (r[3].class_students || []).forEach(function (m) {
        (apCache.classIdsByStudent[m.student_id] = apCache.classIdsByStudent[m.student_id] || []).push(m.class_id);
      });
      apCache.loaded = true;
      return apCache;
    });
  }

  var apStudentAdapter = {
    sourceApp: 'AP',
    search: function (query) {
      return ensureApCache()
        .then(function (cache) {
          var q = String(query || '').trim();
          var filtered = !q ? cache.students : cache.students.filter(function (s) {
            return String(s.name || '').indexOf(q) >= 0 || String(s.school_name || '').indexOf(q) >= 0;
          });
          return filtered.map(function (s) { return mapApSummary(s); });
        })
        .catch(function (e) {
          return { __section_error: 'AP 연결 상태 확인 필요 (' + e.message + ')' };
        });
    },
    getDetail: function (sourceStudentId) {
      var detail = { source_app: 'AP', source_student_id: sourceStudentId, section_errors: [], enrollments: [], schedules: [], consultations: [] };
      return ensureApCache()
        .then(function (cache) {
          var stu = null;
          for (var i = 0; i < cache.students.length; i++) {
            if (String(cache.students[i].id) === String(sourceStudentId)) { stu = cache.students[i]; break; }
          }
          if (stu) Object.assign(detail, mapApSummary(stu));
          var classIds = cache.classIdsByStudent[sourceStudentId] || [];
          classIds.forEach(function (cid) {
            var cls = cache.classesById[cid];
            if (cls) {
              detail.enrollments.push({ name: cls.name, subject: cls.subject, teacher_name: cls.teacher_name });
              (cache.slotsByClass[cid] || []).forEach(function (slot) {
                detail.schedules.push({
                  class_name: cls.name,
                  day_of_week: slot.day_of_week,
                  start_time: slot.start_time,
                  end_time: slot.end_time,
                  room_name: slot.room_name
                });
              });
            }
          });
        })
        .catch(function (e) {
          detail.section_errors.push('AP 반/시간 연결 상태 확인 필요 (' + e.message + ')');
        })
        .then(function () {
          return readJson(AP_API_BASE + '/consultations?student_id=' + encodeURIComponent(sourceStudentId), apAuthHeader())
            .then(function (res) { detail.consultations = res.data || res.consultations || []; })
            .catch(function (e) { detail.section_errors.push('AP 상담 연결 상태 확인 필요 (' + e.message + ')'); });
        })
        .then(function () {
          detail.detail_url = null; // AP 상세 deeplink 는 수신부 확정 후 연결
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
  //   주의: 전체 시간표(/api/eie/timetable)를 학생별 수업시간으로 넣지 않는다.
  // ====================================================================
  var eieCache = { loaded: false, studentsById: {} };

  function ensureEieCache() {
    if (eieCache.loaded) return Promise.resolve(eieCache);
    return readJson(EIE_API_BASE + '/api/eie/confirmed-students', eieAuthHeader())
      .then(function (res) {
        var rows = res.students || res.confirmed_students || res.data || [];
        rows.forEach(function (s) { eieCache.studentsById[s.id] = s; });
        eieCache.rows = rows;
        eieCache.loaded = true;
        return eieCache;
      });
  }

  var eieStudentAdapter = {
    sourceApp: 'EIE',
    search: function (query) {
      return ensureEieCache()
        .then(function (cache) {
          var q = String(query || '').trim();
          var rows = cache.rows || [];
          var filtered = !q ? rows : rows.filter(function (s) {
            return String(s.display_name || s.name || '').indexOf(q) >= 0
                || String(s.school_name || '').indexOf(q) >= 0;
          });
          return filtered.map(function (s) { return mapEieSummary(s); });
        })
        .catch(function (e) {
          return { __section_error: 'EIE 연결 상태 확인 필요 (' + e.message + ')' };
        });
    },
    getDetail: function (sourceStudentId) {
      var detail = { source_app: 'EIE', source_student_id: sourceStudentId, section_errors: [], enrollments: [], schedules: [] };
      return ensureEieCache()
        .then(function (cache) {
          // 학생별 수업시간: confirmed-students 의 per-student assignments 사용.
          // 전체 시간표(/api/eie/timetable)는 학생별 수업시간으로 표시하지 않는다.
          var stu = cache.studentsById[sourceStudentId];
          if (stu) {
            Object.assign(detail, mapEieSummary(stu));
            (stu.assignments || []).forEach(function (a) {
              if (a.status === 'archived') return;
              detail.enrollments.push({ name: a.class_name_raw, teacher_name: a.teacher_name_raw });
              detail.schedules.push({
                class_name: a.class_name_raw,
                day_label: a.day_label,
                start_time: a.start_time,
                end_time: a.end_time,
                period_label: a.period_label
              });
            });
          } else {
            detail.section_errors.push('EIE 학생 정보를 찾지 못했습니다. 연결 상태 확인 필요.');
          }
        })
        .catch(function (e) { detail.section_errors.push('EIE 연결 상태 확인 필요 (' + e.message + ')'); })
        .then(function () {
          return readJson(EIE_API_BASE + '/api/eie/consultations?student_id=' + encodeURIComponent(sourceStudentId), eieAuthHeader())
            .then(function (res) { detail.consultations = res.consultations || res.data || []; })
            .catch(function (e) { detail.section_errors.push('EIE 상담 연결 상태 확인 필요 (' + e.message + ')'); });
        })
        .then(function () {
          // EIE 학생 화면으로 이동 (학생 자동 선택은 후속 확인 항목)
          detail.detail_url = '../eie/index.html#students';
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
  // UI 상태
  // ====================================================================
  var state = {
    filter: 'all',
    items: [],            // 검색 결과 (AP/EIE/공통 합산)
    selected: null,
    sectionErrors: [],
    overlayInfo: null     // 선택 학생의 overlay 연계 정보 {anchor, link, consultations, memos}
  };

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

  // ---- overlay 상태 배지 / 로그인 -------------------------------------
  function renderOverlayStatus() {
    var box = $('#wsm-overlay-status');
    if (!box) return;
    box.innerHTML = '';
    var label = { connected: '공통 저장소 연결됨', auth_required: '공통 저장소 로그인 필요', planned: '공통 저장소 연결 준비 중' }[overlayApi.status];
    box.appendChild(el('span', { class: 'wsm-badge', text: label }));
    if (overlayApi.status === 'auth_required') {
      var btn = el('button', { class: 'wsm-btn', type: 'button', text: '관리자 로그인' });
      btn.addEventListener('click', promptOverlayLogin);
      box.appendChild(btn);
    }
  }

  function promptOverlayLogin() {
    var loginId = window.prompt('관리자 ID');
    if (!loginId) return;
    var password = window.prompt('비밀번호');
    if (!password) return;
    overlayApi.login(loginId.trim(), password)
      .then(function () {
        window.alert('로그인되었습니다.');
        if (state.selected) selectStudent(state.selected);
      })
      .catch(function (e) { window.alert('로그인 실패: ' + e.message); });
  }

  // ---- 검색/목록 -------------------------------------------------------
  function runSearch() {
    var q = $('#wsm-search-input').value;
    state.items = [];
    state.sectionErrors = [];
    renderList(true);
    var jobs = [];
    var f = state.filter;
    if (f === 'all' || f === 'ap' || f === 'ap_eie' || f === 'candidate') jobs.push(apStudentAdapter.search(q));
    if (f === 'all' || f === 'eie' || f === 'ap_eie' || f === 'candidate') jobs.push(eieStudentAdapter.search(q));
    if ((f === 'all' || f === 'common') && overlayApi.status === 'connected') {
      jobs.push(overlayApi.listStudents(q).then(function (res) {
        return (res.students || []).map(function (s) {
          return {
            source_app: 'COMMON',
            wangji_student_id: s.id,
            display_name: s.display_name,
            school_name: s.school_name_snapshot,
            grade: s.grade_snapshot,
            phone: s.primary_phone_snapshot,
            status: s.status
          };
        });
      }).catch(function (e) { return { __section_error: '공통 저장소 조회 실패 (' + e.message + ')' }; }));
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
      box.appendChild(el('div', { class: 'wsm-empty', text: '표시할 학생이 없습니다. 검색어 또는 연결 상태를 확인해 주세요.' }));
      return;
    }
    state.items.forEach(function (item) {
      var card = el('div', { class: 'wsm-card' + (state.selected === item ? ' is-selected' : '') });
      var name = el('div', { class: 'name', text: item.display_name || '(이름 없음)' });
      var badgeClass = item.source_app === 'AP' ? 'ap' : (item.source_app === 'EIE' ? 'eie' : 'candidate');
      name.appendChild(el('span', { class: 'wsm-src-badge ' + badgeClass, text: item.source_app === 'COMMON' ? '공통' : item.source_app }));
      card.appendChild(name);
      card.appendChild(el('div', { class: 'meta', text: [item.school_name, item.grade, item.status].filter(Boolean).join(' · ') }));
      card.addEventListener('click', function () { selectStudent(item); });
      box.appendChild(card);
    });
  }

  // ---- 상세 ------------------------------------------------------------
  function selectStudent(item) {
    state.selected = item;
    state.overlayInfo = null;
    renderList(false);
    var detail = $('#wsm-detail');
    detail.innerHTML = '<div class="wsm-empty">상세 불러오는 중…</div>';

    if (item.source_app === 'COMMON') {
      loadCommonDetail(item);
      return;
    }
    var adapter = item.source_app === 'AP' ? apStudentAdapter : eieStudentAdapter;
    Promise.all([
      adapter.getDetail(item.source_student_id),
      loadOverlayInfoForSource(item)
    ]).then(function (results) {
      renderDetail(item, results[0]);
    });
  }

  // 선택한 원본 학생의 overlay 연계(링크/anchor) 조회
  function loadOverlayInfoForSource(item) {
    if (overlayApi.status !== 'connected') { state.overlayInfo = null; return Promise.resolve(); }
    return overlayApi.findLinkBySource(item.source_app, String(item.source_student_id))
      .then(function (link) {
        if (!link) { state.overlayInfo = { link: null }; return; }
        return Promise.all([
          overlayApi.listConsultations(link.wangji_student_id).catch(function () { return { consultations: [] }; }),
          overlayApi.listMemos(link.wangji_student_id).catch(function () { return { memos: [] }; })
        ]).then(function (r) {
          state.overlayInfo = {
            link: link,
            consultations: r[0].consultations || [],
            memos: r[1].memos || []
          };
        });
      })
      .catch(function () { state.overlayInfo = null; });
  }

  function loadCommonDetail(item) {
    Promise.all([
      overlayApi.listLinks(item.wangji_student_id).catch(function () { return { links: [] }; }),
      overlayApi.listConsultations(item.wangji_student_id).catch(function () { return { consultations: [] }; }),
      overlayApi.listMemos(item.wangji_student_id).catch(function () { return { memos: [] }; })
    ]).then(function (r) {
      state.overlayInfo = { links: r[0].links || [], consultations: r[1].consultations || [], memos: r[2].memos || [] };
      renderDetail(item, { source_app: 'COMMON', section_errors: [], enrollments: [], schedules: [], consultations: [] });
    });
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
    if (readonly) h.appendChild(el('span', { class: 'wsm-readonly-tag', text: '읽기 전용' }));
    return h;
  }

  function renderDetail(item, d) {
    var root = el('div');

    // 공통 요약
    var sumWrap = el('div', { class: 'wsm-section' });
    sumWrap.appendChild(sectionTitle('공통 요약', false));
    sumWrap.appendChild(kv([
      ['이름', item.display_name], ['학교', item.school_name], ['학년', item.grade],
      ['연락처', item.phone], ['상태', item.status],
      ['원본 수정', '아직 지원하지 않습니다 (후속 단계에서 AP/EIE 공식 API 검증 후 연결)']
    ]));
    if (item.source_app === 'COMMON' && overlayApi.status === 'connected') {
      var editBtn = el('button', { class: 'wsm-btn', type: 'button', text: '기본정보 수정 (공통 저장소)' });
      editBtn.addEventListener('click', function () { editCommonStudent(item); });
      sumWrap.appendChild(editBtn);
    }
    root.appendChild(sumWrap);

    // 연결 상태 섹션
    root.appendChild(renderLinkSection(item));

    // 원본 섹션 (AP/EIE 학생일 때)
    if (item.source_app === 'AP' || item.source_app === 'EIE') {
      var srcWrap = el('div', { class: 'wsm-section' });
      srcWrap.appendChild(sectionTitle(item.source_app + ' 원본 정보 · 수강/시간', true));
      (d.section_errors || []).forEach(function (msg) {
        srcWrap.appendChild(el('div', { class: 'wsm-section-error', text: msg }));
      });
      srcWrap.appendChild(kv([
        ['수강 반/과목', summarize(d.enrollments)],
        ['수업 시간', summarize(d.schedules)]
      ]));
      var openBtn = el('button', { class: 'wsm-btn', type: 'button', text: item.source_app + ' 상세 열기' });
      openBtn.disabled = !d.detail_url;
      if (!d.detail_url) openBtn.title = item.source_app + ' 상세 연결 방식 확인 필요';
      else openBtn.addEventListener('click', function () { window.open(d.detail_url, '_blank'); });
      srcWrap.appendChild(openBtn);
      if (overlayApi.status === 'connected') {
        var reqInfoBtn = el('button', { class: 'wsm-btn', type: 'button', text: '학생정보 수정 요청' });
        reqInfoBtn.addEventListener('click', function () { requestOriginChange(item, 'student_info'); });
        var reqEnrollBtn = el('button', { class: 'wsm-btn', type: 'button', text: '수강 연결 요청' });
        reqEnrollBtn.addEventListener('click', function () { requestOriginChange(item, 'enrollment'); });
        srcWrap.appendChild(reqInfoBtn);
        srcWrap.appendChild(reqEnrollBtn);
        srcWrap.appendChild(el('div', { class: 'wsm-disabled-note',
          text: '요청은 검토 큐에 저장되며, 원본 반영은 후속 단계에서 AP/EIE 공식 API 검증 후 진행됩니다.' }));
      }
      root.appendChild(srcWrap);

      // 원본 상담 read-only
      var cWrap = el('div', { class: 'wsm-section' });
      cWrap.appendChild(sectionTitle(item.source_app + ' 상담', true));
      var consults = d.consultations || [];
      if (!consults.length) cWrap.appendChild(el('div', { class: 'wsm-empty', text: '표시할 상담이 없습니다.' }));
      else consults.slice(0, 5).forEach(function (c) {
        cWrap.appendChild(kv([[(c.date || c.consultation_date || ''), (c.content || '').slice(0, 80)]]));
      });
      root.appendChild(cWrap);
    }

    // 공통 상담 섹션 (overlay 저장)
    root.appendChild(renderConsultSection(item));
    // 공통 메모 섹션 (overlay 저장)
    root.appendChild(renderMemoSection(item));

    var detail = $('#wsm-detail');
    detail.innerHTML = '';
    detail.appendChild(root);
  }

  // ---- 연결 섹션 --------------------------------------------------------
  function renderLinkSection(item) {
    var wrap = el('div', { class: 'wsm-section' });
    wrap.appendChild(sectionTitle('연결 상태', false));

    if (overlayApi.status !== 'connected') {
      wrap.appendChild(el('div', { class: 'wsm-empty', text: '공통 연결 저장소 로그인 후 연결을 관리할 수 있습니다.' }));
      return wrap;
    }

    var info = state.overlayInfo;
    if (item.source_app === 'COMMON') {
      var links = (info && info.links) || [];
      if (!links.length) wrap.appendChild(el('div', { class: 'wsm-empty', text: '연결된 AP/EIE 학생이 없습니다.' }));
      links.forEach(function (link) { wrap.appendChild(renderLinkRow(link, item)); });
      return wrap;
    }

    var link = info && info.link;
    if (link) {
      wrap.appendChild(renderLinkRow(link, item));
    } else {
      wrap.appendChild(el('div', { class: 'wsm-empty', text: '아직 공통 학생과 연결되지 않았습니다.' }));
      var btn = el('button', { class: 'wsm-btn primary', type: 'button', text: '공통 학생으로 등록 + 연결 후보 만들기' });
      btn.addEventListener('click', function () { createAnchorAndCandidate(item, btn); });
      wrap.appendChild(btn);
      wrap.appendChild(el('div', { class: 'wsm-disabled-note',
        text: '이름이나 연락처가 같아도 자동으로 같은 학생으로 확정하지 않습니다. 연결 확정은 관리자가 직접 합니다.' }));
    }
    return wrap;
  }

  function renderLinkRow(link, item) {
    var row = el('div', { class: 'wsm-section' });
    row.appendChild(kv([
      ['연결 대상', link.source_app + ' / ' + link.source_student_id],
      ['상태', link.link_status],
      ['근거', link.confidence_reason || '—'],
      ['확정자', link.confirmed_by || '—']
    ]));
    if (link.link_status === 'candidate') {
      var ok = el('button', { class: 'wsm-btn primary', type: 'button', text: '연결 확정' });
      var no = el('button', { class: 'wsm-btn', type: 'button', text: '거절' });
      ok.addEventListener('click', function () { changeLinkStatus(link, 'active', item); });
      no.addEventListener('click', function () { changeLinkStatus(link, 'rejected', item); });
      row.appendChild(ok);
      row.appendChild(no);
    } else if (link.link_status === 'active') {
      var arch = el('button', { class: 'wsm-btn', type: 'button', text: '보관' });
      arch.addEventListener('click', function () { changeLinkStatus(link, 'archived', item); });
      row.appendChild(arch);
    }
    return row;
  }

  function changeLinkStatus(link, status, item) {
    if (status === 'active' && !window.confirm('이 연결을 같은 학생으로 확정할까요? (자동 확정 없음 — 관리자 확인)')) return;
    overlayApi.setLinkStatus(link.id, status)
      .then(function () { selectStudent(item); })
      .catch(function (e) { window.alert('상태 변경 실패: ' + e.message); });
  }

  function createAnchorAndCandidate(item, btn) {
    btn.disabled = true;
    overlayApi.createStudent({
      display_name: item.display_name || '',
      school_name_snapshot: item.school_name || '',
      grade_snapshot: item.grade || '',
      primary_phone_snapshot: item.phone || ''
    }).then(function (res) {
      return overlayApi.createLink({
        wangji_student_id: res.student.id,
        source_app: item.source_app,
        source_student_id: String(item.source_student_id),
        source_display_name_snapshot: item.display_name || '',
        source_school_snapshot: item.school_name || '',
        source_grade_snapshot: item.grade || '',
        source_phone_snapshot: item.phone || '',
        confidence_reason: '관리자 수동 생성 (' + item.source_app + ' 화면에서 직접 선택)'
      });
    }).then(function () {
      selectStudent(item);
    }).catch(function (e) {
      btn.disabled = false;
      window.alert('등록 실패: ' + e.message);
    });
  }

  // ---- 공통 상담 섹션 ----------------------------------------------------
  function renderConsultSection(item) {
    var wrap = el('div', { class: 'wsm-section' });
    wrap.appendChild(sectionTitle('공통 상담', false));
    wrap.appendChild(el('div', { class: 'wsm-disabled-note',
      text: '공통 상담은 왕지 공통 저장소에만 저장됩니다. AP/EIE 원본 상담에는 저장하지 않습니다.' }));

    var info = state.overlayInfo;
    var anchorId = getAnchorId(item);

    // 기존 공통 상담 목록
    var consults = (info && info.consultations) || [];
    if (consults.length) {
      consults.slice(0, 5).forEach(function (c) {
        wrap.appendChild(kv([[(c.consultation_date || ''), (c.content || '').slice(0, 80) + (c.next_action ? (' / 다음 조치: ' + c.next_action) : '')]]));
      });
    }

    // 입력 폼
    var form = el('div', { class: 'wsm-consult-form' });
    var scope = el('select', { id: 'wsm-consult-scope' });
    ['COMMON', 'AP', 'EIE'].forEach(function (o) { scope.appendChild(el('option', { value: o, text: o })); });
    var category = el('input', { type: 'text', id: 'wsm-consult-category', placeholder: '상담 유형' });
    var content = el('textarea', { rows: '3', id: 'wsm-consult-content', placeholder: '상담 내용' });
    var nextAction = el('input', { type: 'text', id: 'wsm-consult-next', placeholder: '다음 조치' });
    form.appendChild(scope); form.appendChild(category); form.appendChild(content); form.appendChild(nextAction);

    var saveBtn = el('button', { class: 'wsm-btn primary', type: 'button', text: '상담 저장' });
    var canSave = overlayApi.status === 'connected' && !!anchorId;
    saveBtn.disabled = !canSave;
    if (!canSave) {
      saveBtn.textContent = overlayApi.status !== 'connected' ? '상담 저장 (공통 저장소 로그인 필요)' : '상담 저장 (먼저 공통 학생 연결 필요)';
    }
    saveBtn.addEventListener('click', function () {
      var body = {
        wangji_student_id: anchorId,
        source_scope: scope.value,
        source_app: item.source_app !== 'COMMON' ? item.source_app : '',
        source_student_id: item.source_app !== 'COMMON' ? String(item.source_student_id) : '',
        category: category.value, content: content.value, next_action: nextAction.value,
        followup_status: nextAction.value ? 'pending' : 'none'
      };
      if (!body.content.trim()) { window.alert('상담 내용을 입력해 주세요.'); return; }
      saveBtn.disabled = true;
      overlayApi.createConsultation(body)
        .then(function () { selectStudent(item); })
        .catch(function (e) { saveBtn.disabled = false; window.alert('저장 실패: ' + e.message); });
    });
    form.appendChild(saveBtn);
    wrap.appendChild(form);
    return wrap;
  }

  // ---- 공통 메모 섹션 ----------------------------------------------------
  function renderMemoSection(item) {
    var wrap = el('div', { class: 'wsm-section' });
    wrap.appendChild(sectionTitle('공통 메모', false));
    var info = state.overlayInfo;
    var anchorId = getAnchorId(item);

    var memos = (info && info.memos) || [];
    if (memos.length) {
      memos.slice(0, 5).forEach(function (m) {
        wrap.appendChild(kv([[(m.title || '메모'), (m.content || '').slice(0, 80)]]));
      });
    }

    var form = el('div', { class: 'wsm-consult-form' });
    var title = el('input', { type: 'text', placeholder: '메모 제목' });
    var content = el('textarea', { rows: '2', placeholder: '메모 내용' });
    form.appendChild(title); form.appendChild(content);
    var saveBtn = el('button', { class: 'wsm-btn', type: 'button', text: '메모 저장' });
    var canSave = overlayApi.status === 'connected' && !!anchorId;
    saveBtn.disabled = !canSave;
    if (!canSave) {
      saveBtn.textContent = overlayApi.status !== 'connected' ? '메모 저장 (공통 저장소 로그인 필요)' : '메모 저장 (먼저 공통 학생 연결 필요)';
    }
    saveBtn.addEventListener('click', function () {
      if (!content.value.trim()) { window.alert('메모 내용을 입력해 주세요.'); return; }
      saveBtn.disabled = true;
      overlayApi.createMemo({ wangji_student_id: anchorId, title: title.value, content: content.value })
        .then(function () { selectStudent(item); })
        .catch(function (e) { saveBtn.disabled = false; window.alert('저장 실패: ' + e.message); });
    });
    form.appendChild(saveBtn);
    wrap.appendChild(form);
    return wrap;
  }

  function getAnchorId(item) {
    if (item.source_app === 'COMMON') return item.wangji_student_id;
    var info = state.overlayInfo;
    return info && info.link ? info.link.wangji_student_id : '';
  }

  function summarize(list) {
    if (!Array.isArray(list) || !list.length) return '—';
    return list.slice(0, 4).map(function (x) {
      return x.name || x.class_name || x.class_name_raw || x.subject
          || [x.day_of_week || x.day_label, x.start_time, x.end_time].filter(Boolean).join(' ')
          || JSON.stringify(x).slice(0, 30);
    }).join(', ');
  }

  // ---- 공통 학생 신규 등록 / 기본정보 수정 -------------------------------
  function registerCommonStudent() {
    if (overlayApi.status !== 'connected') { window.alert('공통 저장소 로그인 후 사용할 수 있습니다.'); return; }
    var name = window.prompt('학생 이름 (필수)');
    if (!name || !name.trim()) return;
    var school = window.prompt('학교 (선택)') || '';
    var grade = window.prompt('학년 (선택)') || '';
    var phone = window.prompt('보호자 연락처 (선택)') || '';
    overlayApi.createStudent({
      display_name: name.trim(), school_name_snapshot: school.trim(),
      grade_snapshot: grade.trim(), primary_phone_snapshot: phone.trim()
    }).then(function (res) {
      window.alert('공통 학생으로 등록되었습니다. AP/EIE 연결은 학생 화면의 연결 상태에서 진행해 주세요.');
      state.filter = 'common';
      document.querySelectorAll('.wsm-chip').forEach(function (c) {
        c.classList.toggle('is-active', c.getAttribute('data-filter') === 'common');
      });
      runSearch();
    }).catch(function (e) { window.alert('등록 실패: ' + e.message); });
  }

  function editCommonStudent(item) {
    var name = window.prompt('학생 이름', item.display_name || '');
    if (name == null) return;
    var school = window.prompt('학교', item.school_name || '');
    if (school == null) return;
    var grade = window.prompt('학년', item.grade || '');
    if (grade == null) return;
    var phone = window.prompt('보호자 연락처', item.phone || '');
    if (phone == null) return;
    overlayApi.patchStudent(item.wangji_student_id, {
      display_name: name.trim(), school_name_snapshot: school.trim(),
      grade_snapshot: grade.trim(), primary_phone_snapshot: phone.trim()
    }).then(function (res) {
      item.display_name = res.student.display_name;
      item.school_name = res.student.school_name_snapshot;
      item.grade = res.student.grade_snapshot;
      item.phone = res.student.primary_phone_snapshot;
      selectStudent(item);
      runSearch();
    }).catch(function (e) { window.alert('수정 실패: ' + e.message); });
  }

  // ---- 원본 수정 요청 (write-through 검토 큐 적재 — 원본 반영 없음) --------
  function requestOriginChange(item, targetType) {
    var anchorId = getAnchorId(item);
    if (!anchorId) { window.alert('먼저 공통 학생 연결이 필요합니다.'); return; }
    var reason = window.prompt('요청 사유 (예: 보호자 번호 변경)');
    if (!reason || !reason.trim()) return;
    var payload = window.prompt('요청 내용 (변경할 값 설명 또는 JSON)') || '';
    overlayApi.createQueueItem({
      wangji_student_id: anchorId,
      target_app: item.source_app,
      target_type: targetType,
      target_source_id: String(item.source_student_id),
      request_payload_json: payload,
      request_reason: reason.trim()
    }).then(function () {
      window.alert('요청이 검토 큐에 저장되었습니다.\n원본 반영은 후속 단계에서 AP/EIE 공식 API 검증 후 진행됩니다.');
    }).catch(function (e) { window.alert('요청 저장 실패: ' + e.message); });
  }

  // ---- 검토 큐 패널 -------------------------------------------------------
  function openQueuePanel() {
    if (overlayApi.status !== 'connected') { window.alert('공통 저장소 로그인 후 사용할 수 있습니다.'); return; }
    var detail = $('#wsm-detail');
    detail.innerHTML = '<div class="wsm-empty">검토 큐 불러오는 중…</div>';
    overlayApi.listQueue('').then(function (res) {
      var rows = res.queue || [];
      var root = el('div');
      var head = el('div', { class: 'wsm-section' });
      head.appendChild(sectionTitle('원본 수정 요청 검토 큐', false));
      head.appendChild(el('div', { class: 'wsm-disabled-note',
        text: '승인된 요청도 이 단계에서는 원본에 반영되지 않습니다. 원본 반영은 후속 단계에서 별도 검증 후 진행됩니다.' }));
      root.appendChild(head);
      if (!rows.length) root.appendChild(el('div', { class: 'wsm-empty', text: '대기 중인 요청이 없습니다.' }));
      rows.forEach(function (q) {
        var card = el('div', { class: 'wsm-section' });
        card.appendChild(kv([
          ['대상', q.target_app + ' / ' + q.target_type + (q.target_source_id ? (' / ' + q.target_source_id) : '')],
          ['상태', q.status],
          ['사유', q.request_reason || '—'],
          ['내용', (q.request_payload_json || '').slice(0, 120) || '—'],
          ['요청자', q.requested_by || '—'],
          ['검토자', q.reviewed_by || '—']
        ]));
        var actions = { requested: [['검토 완료', 'reviewed'], ['거절', 'rejected']],
                        reviewed: [['승인', 'approved'], ['거절', 'rejected']] }[q.status] || [];
        actions.forEach(function (a) {
          var b = el('button', { class: 'wsm-btn' + (a[1] === 'approved' ? ' primary' : ''), type: 'button', text: a[0] });
          b.addEventListener('click', function () {
            overlayApi.setQueueStatus(q.id, a[1]).then(openQueuePanel)
              .catch(function (e) { window.alert('상태 변경 실패: ' + e.message); });
          });
          card.appendChild(b);
        });
        root.appendChild(card);
      });
      detail.innerHTML = '';
      detail.appendChild(root);
    }).catch(function (e) {
      detail.innerHTML = '';
      detail.appendChild(el('div', { class: 'wsm-section-error', text: '검토 큐 조회 실패: ' + e.message }));
    });
  }

  // ---- 연결 후보 스캔 (AP/EIE 이름+보호자번호 일치 → candidate 생성) -------
  function normPhone(p) { return String(p || '').replace(/[^0-9]/g, ''); }

  function scanCandidates(btn) {
    if (overlayApi.status !== 'connected') { window.alert('공통 저장소 로그인 후 사용할 수 있습니다.'); return; }
    btn.disabled = true;
    btn.textContent = '후보 스캔 중…';
    Promise.all([ensureApCache(), ensureEieCache(), readJson(OVERLAY_API_BASE + '/links', overlayAuthHeader())])
      .then(function (r) {
        var apStudents = r[0].students || [];
        var eieRows = r[1].rows || [];
        var existing = {};
        (r[2].links || []).forEach(function (l) { existing[l.source_app + ':' + l.source_student_id] = true; });

        // 이름+전화 일치만 후보로. 전화 없는 학생은 자동 후보 생성 금지(수동 연결만).
        var matches = [];
        apStudents.forEach(function (ap) {
          var apPhone = normPhone(ap.parent_phone || ap.student_phone);
          if (!apPhone) return;
          eieRows.forEach(function (eie) {
            var eiePhone = normPhone(eie.parent_phone || eie.phone || eie.primary_phone);
            if (!eiePhone) return;
            if (String(ap.name || '').trim() === String(eie.display_name || '').trim() && apPhone === eiePhone) {
              if (existing['AP:' + ap.id] || existing['EIE:' + eie.id]) return;
              matches.push({ ap: ap, eie: eie });
            }
          });
        });

        if (!matches.length) {
          window.alert('새로운 연결 후보가 없습니다. (이름+보호자번호 동시 일치 기준)');
          return;
        }
        if (!window.confirm(matches.length + '쌍의 연결 후보를 만들까요?\n자동으로 확정하지 않으며, 확정은 관리자가 각 학생 화면에서 직접 합니다.')) return;

        var chain = Promise.resolve();
        var created = 0;
        matches.forEach(function (m) {
          chain = chain.then(function () {
            return overlayApi.createStudent({
              display_name: m.ap.name,
              school_name_snapshot: m.ap.school_name || m.eie.school_name || '',
              grade_snapshot: m.ap.grade || m.eie.grade || '',
              primary_phone_snapshot: m.ap.parent_phone || m.ap.student_phone || ''
            }).then(function (res) {
              var anchorId = res.student.id;
              var reason = 'name+parent_phone match (자동 후보 — 확정 아님)';
              return overlayApi.createLink({
                wangji_student_id: anchorId, source_app: 'AP', source_student_id: String(m.ap.id),
                source_display_name_snapshot: m.ap.name || '', source_school_snapshot: m.ap.school_name || '',
                source_grade_snapshot: m.ap.grade || '', source_phone_snapshot: m.ap.parent_phone || '',
                confidence_reason: reason
              }).then(function () {
                return overlayApi.createLink({
                  wangji_student_id: anchorId, source_app: 'EIE', source_student_id: String(m.eie.id),
                  source_display_name_snapshot: m.eie.display_name || '', source_school_snapshot: m.eie.school_name || '',
                  source_grade_snapshot: m.eie.grade || '', source_phone_snapshot: m.eie.parent_phone || m.eie.phone || '',
                  confidence_reason: reason
                });
              }).then(function () { created++; });
            }).catch(function (e) { console.error('candidate create failed', e); });
          });
        });
        return chain.then(function () {
          window.alert(created + '쌍의 연결 후보를 만들었습니다. 각 학생 화면에서 확인 후 확정해 주세요.');
          runSearch();
        });
      })
      .catch(function (e) { window.alert('후보 스캔 실패: ' + e.message); })
      .then(function () { btn.disabled = false; btn.textContent = '연결 후보 스캔'; });
  }

  // ---- 부트 -------------------------------------------------------------
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
    var scanBtn = $('#wsm-scan-btn');
    if (scanBtn) scanBtn.addEventListener('click', function () { scanCandidates(scanBtn); });
    var regBtn = $('#wsm-register-btn');
    if (regBtn) regBtn.addEventListener('click', registerCommonStudent);
    var queueBtn = $('#wsm-queue-btn');
    if (queueBtn) queueBtn.addEventListener('click', openQueuePanel);
    overlayApi.probe().then(function () { runSearch(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.WangjiStudentManagement = {
    apStudentAdapter: apStudentAdapter,
    eieStudentAdapter: eieStudentAdapter,
    overlayApi: overlayApi
  };
})();
