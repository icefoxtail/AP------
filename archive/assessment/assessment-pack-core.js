/* 평가팩 공용 코드 (2026-11-19).
   시험지 보관함(assessment-mvp.html)과 빠른 평가의 "준비된 평가지"(archive2-quick-packs.js)가 같이 쓴다. 두 벌을 두지 않는다.
   - 팩 → 출제 항목: MIXED 키 `assessment_<팩번호>_<문항구성해시>`, pack_id·pack_hash, 문항·meta(assignKey / assignItem / loadAssignPayload).
   - 시험지 열기: 엔진(mixed_engine.html) 주소, 평가 전달 자료(localStorage) 저장·정리, 팝업 차단 대비(create → openEngine).
   - 출제 패널(Archive2Assign) 열기와 결과 줄의 시험지·해설·정답·QR 없이 열기 단추(openAssignPanel 등).
   - 목록 보조: 자료 합치기, 필터, 범위 문구, 진단평가 판정.
   팩 id, MIXED 키, localStorage 키 이름, 팩 자료 파일은 건드리지 않는다. 화면마다 다른 것(엔진 위치, 서버 주소, 로그인, 옛 등록)은 create(env)로 받는다. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.AssessmentPackCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const MOCK_CATEGORY = '26년 2학기 기말 모의고사';
  const DEFAULT_CATEGORIES = ['진단평가', '단원평가', '중간·기말평가'];

  // ---- 목록 보조 -------------------------------------------------------------------------------------------
  // 모의고사 자료는 별도 파일이다. 파일이 없거나 비어 있으면 모의고사 탭을 빼고 기존 구성 그대로다.
  function mergeData(baseData, mockData) {
    const base = baseData || { packs: [], sourceSummary: {} };
    const mock = mockData || { packs: [], categoryOrder: [] };
    return {
      ...base,
      packs: [...(mock.packs || []), ...(base.packs || [])],
      categoryOrder: [...((mock.packs || []).length ? [MOCK_CATEGORY] : []), ...(base.categoryOrder || DEFAULT_CATEGORIES)],
    };
  }
  function filterPacks(packs, { category, grade, count, query } = {}) {
    const needle = String(query || '').trim().toLowerCase();
    return (packs || []).filter((pack) => {
      if (category && pack.category !== category) return false;
      if (grade && pack.grade !== grade) return false;
      if (count && String(pack.questionCount) !== count) return false;
      if (!needle) return true;
      return [
        pack.title, pack.category, pack.grade, pack.unitLabel, pack.unitKey, pack.scopeLabel,
        (pack.scopeUnits || []).join(' '), pack.purpose,
      ].join(' ').toLowerCase().includes(needle);
    });
  }
  // 카드 범위 설명에서 단원 코드 "(M1-01)", "(H22-C-06~09)"는 화면에 보이지 않게 한다(교사가 모르는 내부 코드).
  function plainScopeText(text) {
    return String(text || '').replace(/\s*\((?:[A-Z]\d*)(?:-[A-Z0-9]+)+(?:~\d+)?\)/g, '');
  }
  function countText(obj) {
    return Object.entries(obj || {}).map(([key, value]) => `${key} ${value}`).join(' · ') || '-';
  }
  function isDiagnosticPack(pack) {
    if (!pack) return false;
    return pack.category === '진단평가' || (pack.title || '').includes('진단평가') || (pack.id || '').startsWith('DIAG_');
  }

  // ---- 팩 → 출제 항목 ---------------------------------------------------------------------------------------
  function stableJson(value) {
    if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
    if (value && typeof value === 'object') {
      return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
    }
    return JSON.stringify(value ?? null);
  }
  function simpleHash(value) {
    const text = stableJson(value);
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return `fnv1a_${(hash >>> 0).toString(16).padStart(8, '0')}`;
  }
  function packHash(pack) {
    return simpleHash({
      pack_id: pack?.id || '',
      questions: (pack?.questions || []).map((question, index) => ({
        order: index + 1,
        source_file: question?._sourceFile || '',
        source_question_no: question?._sourceQuestionNo || '',
        standard_unit_key: question?.standardUnitKey || '',
        level: question?.level || '',
      })),
    });
  }
  // 같은 팩·같은 문항 구성은 늘 같은 키다 → 같은 반·같은 날 다시 출제하면 서버가 같은 건으로 받고 패널이 "이미 출제됨"으로 보여 준다.
  function assignKey(pack) {
    return `assessment_${String(pack?.id || 'pack').replace(/[^a-zA-Z0-9_-]+/g, '_')}_${packHash(pack)}`;
  }
  // 팩 번호에 학년이 들어 있다(M1=중1, H2=고2). pack.grade는 '고11'처럼 학기가 붙은 표시라서 반 학년과 맞지 않는다.
  function assignGrade(pack) {
    const match = /(?:^|_)([MH])([123])(?:_|$)/.exec(String(pack?.id || ''));
    return match ? (match[1] === 'M' ? '중' : '고') + match[2] : String(pack?.grade || '');
  }
  function assignItem(pack) {
    return {
      kind: 'unit',
      snapshotKey: assignKey(pack),
      title: pack.title,
      identityTitle: pack.title,
      grade: assignGrade(pack),
      subject: '',
      count: (pack.questions || []).length,
      packId: pack.id,
      packHash: packHash(pack),
      ref: { packId: pack.id },
    };
  }

  // ---- 화면별 설정을 받아 만드는 부분 ----------------------------------------------------------------------------
  // env: { window, engineUrl(), getPacks(), request?(route, opt) 또는 apiBase·authHeader()·session(), sessionHash?(url),
  //        registerLegacy?(classRow, pack, key, opts), registrationFailureMessage?(error) }
  function create(env) {
    const win = env.window;
    const doc = () => win.document;
    const storage = () => { try { return win.localStorage; } catch (error) { return null; } };
    const SNAPSHOT_KEEP = 6;
    const SNAPSHOT_KEEP_ON_QUOTA = 2;
    // 끝이 시각(열 때 만든 키)이면 그 시각으로, 출제 패널의 고정 키(assessment_<팩>_<해시>)는 저장해 둔 meta.generatedAt으로 최근 순서를 정한다.
    const SNAPSHOT_KEY = /^mixed(?:Questions|Meta)_(assessment_.+)$/;
    const SNAPSHOT_TIME = /_(\d{10,})$/;
    let panelContext = null; // { handle, pack, key }

    // 열 때마다 mixedQuestions_assessment_<팩>_<시각> / mixedMeta_… 를 새로 쓰는데 지우는 코드가 없어, 오래 쓴 브라우저는 저장 공간(약 5MB)이
    // 가득 차 setItem이 던지고 창이 안 열렸다(2026-11-19 핫픽스). 이 두 이름의 키만, 최근 몇 개를 남기고 정리한다. 가득 차면 더 많이 정리한 뒤
    // 다시 쓰고, 그래도 안 되면 엔진이 평가팩 번호(packId)로 팩 자료 파일에서 직접 읽게 한다. Archive 2.0 초안·로그인·mix_ 키는 건드리지 않는다.
    function snapshotTime(key) {
      const stamped = SNAPSHOT_TIME.exec(key);
      if (stamped) return Number(stamped[1]);
      try {
        const meta = JSON.parse(storage().getItem('mixedMeta_' + key) || 'null');
        const parsed = Date.parse(meta && meta.generatedAt);
        return Number.isFinite(parsed) ? parsed : 0;
      } catch (error) { return 0; }
    }
    function listSnapshots() {
      const times = new Map();
      try {
        const store = storage();
        for (let i = 0; i < store.length; i += 1) {
          const match = SNAPSHOT_KEY.exec(store.key(i) || '');
          if (match && !times.has(match[1])) times.set(match[1], snapshotTime(match[1]));
        }
      } catch (error) { /* 정리는 보조 동작 */ }
      return [...times].map(([k, t]) => ({ k, t })).sort((a, b) => b.t - a.t);
    }
    function pruneSnapshots(keepCount, protectKey) {
      const list = listSnapshots();
      const kept = new Set(list.slice(0, keepCount).map((entry) => entry.k));
      if (protectKey) kept.add(protectKey);
      list.forEach((entry) => {
        if (kept.has(entry.k)) return;
        try {
          storage().removeItem('mixedQuestions_' + entry.k);
          storage().removeItem('mixedMeta_' + entry.k);
        } catch (error) { /* 다음 정리에서 다시 */ }
      });
    }
    // 엔진에 넘길 자료를 저장한다. 저장하지 못하면 false(그때는 packId로 연다).
    function storeSnapshot(key, questions, meta) {
      let questionsJson;
      let metaJson;
      try {
        questionsJson = JSON.stringify(questions);
        metaJson = JSON.stringify(meta);
      } catch (error) { return false; }
      const write = () => {
        storage().setItem('mixedQuestions_' + key, questionsJson);
        try {
          storage().setItem('mixedMeta_' + key, metaJson);
        } catch (error) {
          try { storage().removeItem('mixedQuestions_' + key); } catch (ignored) { /* ignore */ }
          throw error;
        }
      };
      pruneSnapshots(SNAPSHOT_KEEP - 1, key);
      for (const keep of [null, SNAPSHOT_KEEP_ON_QUOTA, 0]) {
        if (keep !== null) pruneSnapshots(keep, key);
        try { write(); return true; } catch (error) { /* 더 많이 정리하고 다시 */ }
      }
      return false;
    }

    // 새 창은 클릭한 그 순간에 먼저 연다. 출제 등록처럼 오래 걸리는 일을 기다린 뒤에 열면 브라우저가 팝업으로 보고 막을 수 있다.
    function openWindowNow() {
      let target = null;
      try { target = win.open('', '_blank'); } catch (error) { target = null; }
      if (target) {
        try {
          target.document.title = '시험지 준비 중';
          target.document.body.style.cssText = 'font:16px sans-serif;padding:24px;color:#333';
          target.document.body.textContent = '시험지를 준비하는 중입니다…';
        } catch (error) { /* 안내문은 보조 */ }
      }
      return target;
    }
    function showNotice(message, link) {
      try {
        const d = doc();
        const old = d.getElementById('assessmentOpenNotice');
        if (old && old.remove) old.remove();
        const box = d.createElement('div');
        box.id = 'assessmentOpenNotice';
        box.setAttribute('role', 'alert');
        box.style.cssText = 'position:fixed;left:50%;top:16px;transform:translateX(-50%);z-index:9999;max-width:min(92vw,640px);padding:14px 18px;border-radius:12px;background:#FFF7E6;border:1px solid #F0B429;color:#5B3A00;font-size:14px;line-height:1.5;box-shadow:0 8px 24px rgba(0,0,0,.18)';
        const text = d.createElement('span');
        text.textContent = message;
        box.appendChild(text);
        if (link) {
          const anchor = d.createElement('a');
          anchor.href = link;
          anchor.target = '_blank';
          anchor.textContent = ' 시험지 열기';
          anchor.style.cssText = 'margin-left:8px;font-weight:700;color:#0B5CAD';
          box.appendChild(anchor);
        }
        const close = d.createElement('button');
        close.type = 'button';
        close.textContent = '닫기';
        close.style.cssText = 'margin-left:12px;border:0;background:transparent;color:#5B3A00;font-weight:700;cursor:pointer';
        close.addEventListener('click', () => { if (box.remove) box.remove(); });
        box.appendChild(close);
        d.body.appendChild(box);
      } catch (error) { /* 안내를 못 그려도 열기는 계속 */ }
    }
    function showWindowTarget(target, url) {
      if (target && !target.closed) {
        try { target.location.replace(url); return true; } catch (error) { /* 아래에서 다시 연다 */ }
      }
      let again = null;
      try { again = win.open(url, '_blank'); } catch (error) { again = null; }
      if (again) return true;
      showNotice('브라우저가 새 창(팝업)을 막았습니다. 이 사이트의 팝업을 허용하거나 아래 링크로 여세요.', url);
      return false;
    }

    // 반환: { registrationFailed: '선생님용 안내문' } — 등록이 실패해 QR 없이 연 경우만.
    async function openEngine(pack, mode, qpp, options = {}) {
      // 첫 await 전에, 클릭 순간에 창부터 연다(학년별 출제처럼 호출하는 쪽이 이미 열었으면 그것을 쓴다).
      const target = options.targetWindow !== undefined ? options.targetWindow : openWindowNow();
      try {
        const key = options.keyOverride || `assessment_${pack.id}_${Date.now()}`;
        const questions = (pack.questions || []).map((question) => ({ ...question }));
        let assignmentRegistered = !!(options.assignmentRegistered || options.preRegistered);
        const meta = {
          title: pack.title,
          customTitle: pack.title,
          count: questions.length,
          qpp,
          generatedAt: new Date().toISOString(),
          assessmentPackId: pack.id,
          category: pack.category,
          packId: pack.id,
          grade: pack.grade,
          gradeLabel: options.gradeLabel || pack.grade,
          scopeLabel: pack.scopeLabel,
          assignmentBatchId: options.assignmentBatchId || '',
          targetScope: options.target_scope || (options.submitQr ? 'class' : ''),
        };
        const stored = storeSnapshot(key, questions, meta);

        const url = new URL(String(env.engineUrl()));
        url.searchParams.set('key', key);
        url.searchParams.set('qpp', qpp);
        url.searchParams.set('mode', mode || 'exam');
        // 자료를 브라우저에 저장하지 못했으면 엔진이 평가팩 번호로 팩 자료 파일에서 직접 읽는다.
        // (출제 패널로 낸 시험지는 자료가 나중에 정리돼 사라져도 다시 열리도록 packId를 항상 붙인다.)
        if (!stored || options.packIdFallback) url.searchParams.set('packId', pack.id);
        if (options.date) url.searchParams.set('date', options.date);
        if (options.preview) {
          // Reuse the renderer's frozen-paper UI so review cannot shuffle or edit
          // a copy that differs from the pack subsequently assigned by this page.
          url.searchParams.set('studio', '1');
          url.searchParams.set('preview', '1');
          url.searchParams.set('submitQr', '0');
          url.searchParams.set('preRegistered', '1');
          url.searchParams.set('assignmentRegistered', '1');
        }
        let registrationFailed = options.registrationFailed || '';
        if (options.submitQr) url.searchParams.set('submitQr', '1');
        if (options.classId) url.searchParams.set('class', options.classId);
        if (options.teacherName) url.searchParams.set('teacher', options.teacherName);
        if (options.className) url.searchParams.set('className', options.className);
        if (assignmentRegistered) {
          url.searchParams.set('assignmentRegistered', '1');
          url.searchParams.set('preRegistered', '1');
        }
        if (options.submitQr && options.classId && !assignmentRegistered && typeof env.registerLegacy === 'function') {
          try {
            await env.registerLegacy(
              { id: options.classId, name: options.className || '', grade: options.gradeLabel || pack.grade, teacher_name: options.teacherName || '' },
              pack,
              key,
              {
                assignmentBatchId: options.assignmentBatchId,
                target_scope: options.target_scope || 'class',
                gradeLabel: options.gradeLabel || pack.grade || '',
                qpp,
              },
            );
            assignmentRegistered = true;
            url.searchParams.set('assignmentRegistered', '1');
            url.searchParams.set('preRegistered', '1');
          } catch (error) {
            console.warn('[assessment assignment] 사전 등록 실패:', error);
            registrationFailed = env.registrationFailureMessage ? env.registrationFailureMessage(error) : '출제가 등록되었는지 확인하지 못했습니다.';
          }
        }
        if (registrationFailed) {
          // 등록이 확인되지 않았는데 제출 QR이 찍혀 나가면 학생이 제출할 곳이 없을 수 있다: QR 없이, 반 연결 없이 연다.
          ['class', 'teacher', 'className', 'assignmentRegistered', 'preRegistered'].forEach((name) => url.searchParams.delete(name));
          url.searchParams.set('submitQr', '0');
        }
        showWindowTarget(target, env.sessionHash ? env.sessionHash(url.toString()) : url.toString());
        return registrationFailed ? { registrationFailed } : {};
      } catch (error) {
        if (target && !target.closed) { try { target.close(); } catch (ignored) { /* ignore */ } }
        showNotice('시험지를 열지 못했습니다. 화면을 새로고침한 뒤 다시 시도해 주세요.');
        throw error;
      }
    }

    // ---- 진단평가 정답입력 ---------------------------------------------------------------------------------------
    const diagnosticResultKey = (diagnosticId) => `apms.diagnostic.assessment.result.${diagnosticId}`;
    const DIAGNOSTIC_RESULTS_LIST_KEY = 'apms.diagnostic.assessment.results';
    const DIAGNOSTIC_CURRENT_KEY = 'apms.diagnostic.assessment.current';
    const todayString = () => new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
    function createDiagnosticDraft(pack) {
      // questionCount 0 fallback 금지: 진단평가는 실제 pack.questions 배열이 있을 때만 시작한다.
      const hasDiagnosticQuestions = Array.isArray(pack.questions) && pack.questions.length > 0;
      if (!hasDiagnosticQuestions) {
        win.alert('문항 수 확인이 필요합니다.');
        return null;
      }
      const diagnosticId = `diagnostic_${String(pack.id || 'pack').replace(/[^a-zA-Z0-9_-]+/g, '_')}_${Date.now()}`;
      const payload = {
        diagnosticId,
        packId: pack.id,
        packTitle: pack.title || '',
        category: pack.category || '',
        type: pack.examType || '',
        grade: pack.grade || '',
        scope: pack.scopeLabel || pack.unitLabel || '',
        range: pack.scopeLabel || pack.unitLabel || '',
        questionCount: pack.questions.length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'input_pending',
        studentName: '',
        className: '',
        schoolName: '',
        gradeLabel: '',
        examDate: todayString(),
        results: [],
        source: 'assessment_mvp',
        mode: 'diagnostic',
      };
      storage().setItem(diagnosticResultKey(diagnosticId), JSON.stringify(payload));
      storage().setItem(DIAGNOSTIC_CURRENT_KEY, diagnosticId);
      const list = JSON.parse(storage().getItem(DIAGNOSTIC_RESULTS_LIST_KEY) || '[]').filter((item) => item?.diagnosticId !== diagnosticId);
      list.unshift({
        diagnosticId,
        packId: pack.id,
        packTitle: pack.title || '',
        questionCount: pack.questions.length,
        status: payload.status,
        updatedAt: payload.updatedAt,
      });
      storage().setItem(DIAGNOSTIC_RESULTS_LIST_KEY, JSON.stringify(list.slice(0, 30)));
      return payload;
    }
    // 초안을 만들고 분석 화면의 정답입력 주소를 돌려준다(analysisPath: 화면에서 분석 화면까지의 경로). 못 만들면 null.
    function diagnosticInputUrl(pack, analysisPath) {
      const draft = createDiagnosticDraft(pack);
      if (!draft) return null;
      return analysisPath + '?packId=' + encodeURIComponent(pack.id) +
        '&diagnosticId=' + encodeURIComponent(draft.diagnosticId) +
        '&mode=diagnostic-input';
    }

    // ---- 출제 패널 -------------------------------------------------------------------------------------------
    // "AP 제출 QR 시험지 출력"(출제)은 Archive 2.0 출제 패널(archive2-assign.js)의 단원별(unit) 종류로 낸다.
    // 서버·요청 본문은 옛 모달(registerAssessmentClassExamAssignment)과 같다: 머리글 없는 POST /class-exam-assignments,
    // MIXED:<키> + mixed_payload_json, pack_id·pack_hash. 옛 모달 길은 주소에 assign=legacy가 있을 때(또는 패널 스크립트가 없을 때) 그대로 쓴다.
    function assignPanelAvailable() {
      const panel = win.Archive2Assign;
      return Boolean(panel && typeof panel.open === 'function' && !(typeof panel.useLegacy === 'function' && panel.useLegacy(win.location.search)));
    }
    // 옛 모달이 보내던 mixed_payload_json과 같은 문항·meta(패널이 쪽당 문항 qpp를 meta에 더한다).
    async function loadAssignPayload(item) {
      const pack = (env.getPacks() || []).find((entry) => entry.id === item?.ref?.packId);
      if (!pack || !Array.isArray(pack.questions) || !pack.questions.length) throw new Error('평가팩 문항을 찾지 못했습니다.');
      return { questions: pack.questions, meta: { customTitle: pack.title || '', packId: pack.id || '' } };
    }
    // 패널에 꽂는 request(route, {method, headers, body, timeoutMs}). unit-past-exams.js assignRequest와 같은 규칙:
    // 로그인이 없으면 요청 없이 status=401, 제한 시간이 지나면 timeout=true, 오류 응답은 error.status/error.data를 달아 던진다.
    function builtinAssignRequest(route, opt = {}) {
      const rule = win.Archive2Session;
      const memory = win.__APMATH_AUTH_MEMORY || {};
      const loggedIn = !rule || !rule.state || (memory.login_id && memory.raw_password) || rule.state(env.session()).loggedIn;
      const auth = loggedIn ? env.authHeader() : null;
      if (!auth) return Promise.reject(Object.assign(new Error('교사 로그인이 필요합니다.'), { status: 401 }));
      const method = opt.method || (opt.body ? 'POST' : 'GET');
      const timeoutMs = Number.isFinite(opt.timeoutMs) && opt.timeoutMs > 0 ? opt.timeoutMs : (method === 'GET' ? 30000 : 0);
      const controller = timeoutMs && typeof AbortController === 'function' ? new AbortController() : null;
      const perform = async () => {
        const response = await win.fetch(env.apiBase + route, {
          method,
          headers: { ...auth, ...(opt.body ? { 'Content-Type': 'application/json' } : {}), ...(opt.headers || {}) },
          ...(opt.body ? { body: JSON.stringify(opt.body) } : {}),
          ...(controller ? { signal: controller.signal } : {}),
        });
        return { response, data: await response.json().catch(() => ({})) };
      };
      return (async () => {
        let result;
        let timer;
        if (timeoutMs) {
          const pending = perform();
          pending.catch(() => {});
          try {
            result = await Promise.race([pending, new Promise((_, reject) => {
              timer = setTimeout(() => {
                if (controller) controller.abort();
                reject(Object.assign(new Error('응답이 늦습니다. 잠시 뒤 다시 시도해 주세요.'), { timeout: true }));
              }, timeoutMs);
            })]);
          } finally { clearTimeout(timer); }
        } else result = await perform();
        const { response, data } = result;
        if (!response.ok || data.success === false) {
          const error = new Error(data.error || `요청 실패 (${response.status})`);
          error.status = response.status;
          error.data = data;
          throw error;
        }
        return data;
      })();
    }
    // 화면이 이미 같은 규칙의 요청 함수를 갖고 있으면(env.request, 예: 빠른 평가 = 작업공간의 assignRequest) 그것을 쓴다.
    const assignRequest = typeof env.request === 'function' ? env.request : builtinAssignRequest;
    // 출제가 안 된 반(실패·결과 모름)의 줄에는 시험지를 QR 없이 여는 단추를 둔다: 출제 등록이 안 됐는데 QR이 찍혀 나가면
    // 학생이 제출할 곳이 없을 수 있으니 반 연결 없이 연다(#2565 핫픽스와 같은 규칙). 안내는 패널 줄의 실패 문구가 맡는다.
    function assignJobActions(job) {
      return job && (job.status === 'failed' || job.status === 'unknown')
        ? [{ action: 'plain-paper', label: 'QR 없이 시험지 열기' }]
        : [];
    }
    function openAssignPanel(pack, opener) {
      const panel = win.Archive2Assign;
      if (panel.isOpen && panel.isOpen()) return;
      try {
        const item = assignItem(pack);
        const handle = panel.open({
          items: [item],
          unit: { load: loadAssignPayload },
          request: assignRequest,
          opener,
          jobActions: assignJobActions,
          onClose: () => { panelContext = null; },
        });
        panelContext = { handle, pack, key: item.snapshotKey };
      } catch (error) {
        console.error(error);
        win.alert(error.message || '출제 준비에 실패했습니다.');
      }
    }
    function openPlainPaper() {
      const context = panelContext;
      if (!context) return;
      const qpp = Number(context.handle.model.state.qpp) || 4;
      openEngine(context.pack, 'exam', qpp, {
        keyOverride: context.key,
        packIdFallback: true,
        registrationFailed: '출제가 확인되지 않아 시험지를 QR 없이 열었습니다.',
      }).catch((error) => console.error(error));
    }
    // 출제된 건의 시험지·해설·정답 단추(패널 결과 줄). 시험지는 반 연결 + 등록 끝남 표시로 열어 엔진이 다시 등록하지 않는다(옛 출제 뒤 열기와 같다).
    function openAssignedOutput(assignmentId, mode) {
      const context = panelContext;
      const model = context && context.handle && context.handle.model;
      const job = model && model.state.jobs.find((entry) => entry.assignmentId === assignmentId);
      if (!job) return;
      if (mode === 'sol' || mode === 'ans') {
        openEngine(context.pack, mode, 2, { keyOverride: context.key, packIdFallback: true }).catch((error) => console.error(error));
        return;
      }
      const cls = (model.state.classes || []).find((entry) => entry.id === job.classId) || {};
      const body = job.body || {};
      openEngine(context.pack, 'exam', Number(model.state.qpp) || 4, {
        submitQr: true,
        classId: job.classId,
        teacherName: cls.teacher || '',
        className: job.className || cls.name || '',
        target_scope: body.target_scope || 'class',
        gradeLabel: body.grade_label || '',
        assignmentBatchId: body.assignment_batch_id || '',
        keyOverride: context.key,
        assignmentRegistered: true,
        preRegistered: true,
        packIdFallback: true,
        date: job.date,
      }).catch((error) => console.error(error));
    }
    // 패널 안 단추 눌림과 뒤로 가기: 화면에 한 번만 건다(문서 단위 위임).
    function bindPanelEvents() {
      const d = doc();
      d.addEventListener('click', (event) => {
        const target = event.target;
        if (!target || !target.closest || !panelContext) return;
        const output = target.closest('dialog.assign-panel [data-action="assignment-output-direct"]');
        if (output) {
          event.preventDefault();
          openAssignedOutput(output.dataset.assignment, output.dataset.mode);
          return;
        }
        if (target.closest('dialog.assign-panel [data-host-action="plain-paper"]')) {
          event.preventDefault();
          openPlainPaper();
        }
      });
      // 패널이 열려 있을 때 뒤로 가기는 패널이 먼저 처리한다(닫기·진행 중 잠금).
      win.addEventListener('popstate', () => {
        const panel = win.Archive2Assign;
        if (panel && typeof panel.handlePopState === 'function') panel.handlePopState();
      });
    }

    return {
      SNAPSHOT_KEEP,
      pruneSnapshots, listSnapshots, storeSnapshot, openWindowNow, showNotice, showWindowTarget, openEngine,
      createDiagnosticDraft, diagnosticInputUrl,
      assignPanelAvailable, loadAssignPayload, assignRequest, assignJobActions, openAssignPanel, openPlainPaper, openAssignedOutput, bindPanelEvents,
      panelContext: () => panelContext,
    };
  }

  return {
    MOCK_CATEGORY, mergeData, filterPacks, plainScopeText, countText, isDiagnosticPack,
    packHash, assignKey, assignGrade, assignItem, create,
  };
});
