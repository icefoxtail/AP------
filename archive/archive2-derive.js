(function (root, factory) {
  const isNode = typeof module === "object" && module.exports;
  const api = factory(
    isNode ? require("./archive2-core.js") : root.Archive2Core,
    isNode ? require("./archive2-unified-units.js") : root.Archive2UnifiedUnits,
    isNode ? require("./archive2-output.js") : root.Archive2Output,
  );
  if (isNode) module.exports = api;
  else root.Archive2Derive = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (Core, Unified, Output) {
  "use strict";

  // "기준 시험지로 다시 만들기"의 선정 모듈(순수 함수, 화면·저장소·네트워크를 읽지 않는다).
  // 설계: 선생님이 만든·출제한 시험지(또는 학교 기출·교과서 단원)를 기준으로 "같은 유형 / 다른 유형" ×
  // "기본 / 응용 / 심화"로 한 벌을 다시 뽑는다. 같은 유형이 없으면 한 단계씩 낮춰서라도 항상 만들어지고
  // 어느 단에서 찾았는지 사실대로 돌려준다.
  //
  //  * 문항 층 = 유형 사다리: 세부 유형(templateKey) → 유형(problemTypeKey) → L4·conceptClusterKey → 소단원 → 대단원 → 범위 안 그 밖.
  //    정식 키와 힌트 키(metaHintTPL/PT)는 같은 칸 안에서 정식이 앞이고 힌트 일치는 perItem.hintOnly로 기록한다.
  //    CrossConcept·Condition은 칸이 아니라 같은 칸 안 동점 깨기 가산점이다.
  //  * 시험지 층 = 난이도 예산: 결과의 단계 분포가 목표(same = 기준, up-some = 절반쯤 +1, up-one = 전부 +1, 5는 5)와
  //    맞게 한다. 세부 유형이 맞으면 ±1을 허용하되 전체에서 상쇄되도록 누적 편차를 본다.
  //  * 필수 경계: 기준 문항들이 놓인 (학년·통합 과목)과 그 안에서 기준이 덮는 통합 대단원 집합 밖은 어느 단에서도 금지.
  //    교육과정(2015/2022)은 경계가 아니다: 통합 단원 층(archive2-unified-units.js)이 같은 과목·같은 단원으로 놓는 문항은
  //    교육과정이 달라도 후보다(수학I(2015)와 대수(2022), 수학(상)(하)와 공통수학1·2 등).
  //  * 정답·해설이 빈 문항은 기본 후보에서 뺀다(빠른 평가 진단평가의 빈 문항 기준과 같음). 카탈로그에는 값이 없어
  //    호출하는 쪽이 buildDeriveIndex의 isBlank(record)를 넘기고, includeBlank로만 포함할 수 있다.
  //  * 제외: 기준 문항 자체와 exclude(앞서 뽑은 것·반이 받은 문항)만. 기준 문항의 유사 사본은 제외하지 않는다.
  //  * 읽는 필드는 정본 필드뿐: questionUid, sourceFile, contentType, problemTypeKey, templateKey, metaHintPT, metaHintTPL,
  //    difficultyBucket, L4, conceptClusterKey, subUnitKey, crossConceptKeys, conditionKeys, 그리고 통합 단원 층이 내는 배치.
  //  * 같은 seed + 같은 입력 → 같은 결과. seed가 다르면 동점 처리가 달라져 다른 결과가 나온다.
  //  * 새 상태값·저장 형식 없음. 출처 판정은 기존 `Archive2Output.materialKind`를 그대로 쓰고,
  //    교과서 출판사는 textbooks/<폴더>의 폴더 표(textbook-source-manifest-v1.json의 folders)를 받아 쓴다.

  const VERSION = "ARCHIVE2_DERIVE_V1_20261120";
  const LADDER = Object.freeze(["template", "type", "concept", "subunit", "unit"]);
  const RUNGS = Object.freeze([...LADDER, "none"]);
  // 화면 문구용 이름(내부 키는 문구에 넣지 않는다). 소단원과 대단원은 같은 "같은 단원"으로 센다.
  const RUNG_LABEL = Object.freeze({
    template: "같은 세부 유형", type: "같은 유형", concept: "같은 개념", subunit: "같은 단원", unit: "같은 단원", none: "범위 안 다른 단원",
  });
  const LEVEL_MODES = Object.freeze(["same", "up-some", "up-one"]);
  const TYPE_MODES = Object.freeze(["same", "different"]);
  // "교재"로 따로 묶는 출판사(문제집). 나머지 textbooks/ 폴더는 교과서(출판사별).
  const WORKBOOK_PUBLISHERS = Object.freeze(["백발백중"]);

  const text = (value) => (value == null ? "" : String(value)).trim();
  // 시험 한 벌의 "집안"(stem): 원본 시험지와 그 유사본(`_유사`·`_유사2`)이 같은 stem이다. 카탈로그에는 원본-유사 짝 링크가 없어
  // 파일 이름에서 알아낸다. 짝 키 = stem + 번호(sourceOrdinal): 같은 번호의 원본 문항과 그 유사 문항이다.
  const stemOf = (file) => text(file).replace(/\\/g, "/").replace(/^\/?(?:archive\/)?(?:exams\/)?[^/]+\//, "").replace(/\.js$/i, "").replace(/_유사\d*$/, "");
  const list = (value) => (Array.isArray(value) ? value.map(text).filter(Boolean) : []);

  // ---- 시드 난수: 문자열 해시 → [0, 1). 후보마다 (seed, uid)로만 정해져 입력 순서와 무관하다 ----
  function hash32(input) {
    let h = 0x811c9dc5;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h >>> 0;
  }
  const unit01 = (seed, key) => hash32(`${seed}\u0000${key}`) / 4294967296;

  // ---- 출처 ----
  function textbookFolderOf(file) {
    const normalized = text(file).replace(/\\/g, "/").replace(/^\/?(?:archive\/)?exams\//, "").replace(/^\/+/, "");
    const match = /^textbooks\/([^/]+)\//.exec(normalized);
    return match ? match[1] : "";
  }
  function publisherOf(file, manifest) {
    const folder = textbookFolderOf(file);
    if (!folder) return "";
    const row = manifest && manifest.folders && manifest.folders[folder];
    if (row && row.publisher) return text(row.publisher);
    return folder.split("_")[0];
  }
  // 출처 종류: school(학교 기출·단원평가) / similar(유사) / textbook(교과서, 출판사별) / workbook(교재·유형)
  function sourceKindOf(record, manifest) {
    const file = text(record.sourceFile).replace(/\\/g, "/");
    if (/^(?:archive\/)?(?:exams\/)?types\//.test(file)) return { kind: "workbook", publisher: "" };
    if (/^(?:archive\/)?(?:exams\/)?similar\//.test(file)) return { kind: "similar", publisher: "" };
    const material = Output && typeof Output.materialKind === "function"
      ? Output.materialKind({ contentType: record.contentType, file })
      : (record.contentType === "교과서" || file.startsWith("textbooks/") ? "textbook" : "exam");
    if (material === "textbook") {
      const publisher = publisherOf(file, manifest);
      return WORKBOOK_PUBLISHERS.includes(publisher) ? { kind: "workbook", publisher } : { kind: "textbook", publisher };
    }
    if (material === "similar") return { kind: "similar", publisher: "" };
    return { kind: "school", publisher: "" };
  }
  // sources: "all"(기본) | 종류 문자열 | { kind, publisher | publishers } | 그 배열(합집합)
  function sourcePredicate(spec) {
    if (spec == null || spec === "all") return () => true;
    const specs = (Array.isArray(spec) ? spec : [spec]).map((item) => (typeof item === "string" ? { kind: item } : item || {}));
    if (specs.some((item) => !item.kind || item.kind === "all")) return () => true;
    return (cand) => specs.some((item) => {
      if (item.kind !== cand.srcKind) return false;
      const publishers = list(item.publishers || (item.publisher ? [item.publisher] : []));
      return !publishers.length || publishers.includes(cand.publisher);
    });
  }

  // ---- 색인 ----
  // records: 카탈로그 최종 기록. options: { unified(통합 단원 색인, 없으면 만든다), projectionPolicy, manifest, eligible(record)=>bool }
  function buildDeriveIndex(records, options) {
    const opts = options || {};
    const unified = opts.unified
      || (Unified && Unified.buildIndex ? Unified.buildIndex(records, { projectionPolicy: opts.projectionPolicy }) : null);
    if (!unified) throw new Error("DERIVE_UNIFIED_INDEX_MISSING");
    const eligible = typeof opts.eligible === "function"
      ? opts.eligible
      : (record) => Boolean(Core && Core.difficultyEligible && Core.difficultyEligible(record));
    const manifest = opts.manifest || null;
    const isBlank = typeof opts.isBlank === "function" ? opts.isBlank : null;
    const byUid = new Map();
    const pools = new Map();
    const poolOf = (ck) => {
      if (!pools.has(ck)) pools.set(ck, { all: [], tpl: new Map(), pt: new Map(), l4: new Map(), sub: new Map(), unit: new Map() });
      return pools.get(ck);
    };
    const put = (map, key, cand) => {
      if (!key) return;
      const bucket = map.get(key);
      if (bucket) bucket.push(cand);
      else map.set(key, [cand]);
    };
    for (const record of records || []) {
      const uid = text(record.questionUid);
      if (!uid || byUid.has(uid)) continue;
      const entry = (unified.byRecord && unified.byRecord.get(record)) || (unified.byUid && unified.byUid.get(uid)) || null;
      const strictTpl = text(record.templateKey);
      const strictPt = text(record.problemTypeKey);
      const bucket = Number.isInteger(record.difficultyBucket) && record.difficultyBucket >= 1 && record.difficultyBucket <= 5 ? record.difficultyBucket : null;
      const src = sourceKindOf(record, manifest);
      const cand = {
        uid,
        record,
        file: text(record.sourceFile),
        stem: stemOf(record.sourceFile),
        pair: `${stemOf(record.sourceFile)}#${text(record.sourceOrdinal)}`,
        // 묶음 키 = (학년, 통합 과목). 교육과정(originalCurriculum)은 키가 아니다(보고용으로만 cand.curr에 둔다).
        ck: entry ? `${text(entry.grade)}|${text(entry.subject)}` : "",
        curr: entry ? text(entry.originalCurriculum) : "",
        unit: entry && !entry.unclassified ? text(entry.unitKey) : "",
        sub: text(record.subUnitKey),
        tpl: strictTpl || text(record.metaHintTPL),
        tplFormal: Boolean(strictTpl),
        pt: strictPt || text(record.metaHintPT),
        ptFormal: Boolean(strictPt),
        l4: text(record.L4) || text(record.conceptClusterKey),
        cc: list(record.crossConceptKeys),
        cond: list(record.conditionKeys),
        bucket,
        srcKind: src.kind,
        publisher: src.publisher,
        eligible: false,
        blank: false,
      };
      cand.eligible = Boolean(cand.ck && bucket !== null && eligible(record));
      if (isBlank && cand.eligible) cand.blank = Boolean(isBlank(record));
      byUid.set(uid, cand);
      if (!cand.eligible) continue;
      const pool = poolOf(cand.ck);
      pool.all.push(cand);
      put(pool.tpl, cand.tpl, cand);
      put(pool.pt, cand.pt, cand);
      put(pool.l4, cand.l4, cand);
      put(pool.sub, cand.sub, cand);
      put(pool.unit, cand.unit || "\u0000none", cand);
    }
    return { version: VERSION, byUid, pools, size: byUid.size, blankKnown: Boolean(isBlank) };
  }

  // ---- 난이도 목표 ----
  function levelTargets(bases, level, seed) {
    const known = bases.map((base, i) => (base && base.bucket !== null ? i : -1)).filter((i) => i >= 0);
    const raise = new Set();
    if (level === "up-one") for (const i of known) raise.add(i);
    else if (level === "up-some") {
      const open = known.filter((i) => bases[i].bucket < 5)
        .sort((a, b) => unit01(seed, `up:${bases[a].uid}`) - unit01(seed, `up:${bases[b].uid}`) || a - b);
      for (const i of open.slice(0, Math.round(open.length / 2))) raise.add(i);
    }
    return bases.map((base, i) => {
      if (!base || base.bucket === null) return null;
      return raise.has(i) ? Math.min(5, base.bucket + 1) : base.bucket;
    });
  }

  const overlap = (a, b) => a.reduce((n, key) => n + (b.includes(key) ? 1 : 0), 0);

  function normalizeOptions(options) {
    const opts = options || {};
    const typeMode = TYPE_MODES.includes(opts.typeMode) ? opts.typeMode : "same";
    const level = LEVEL_MODES.includes(opts.level) ? opts.level : "same";
    const exclude = new Set();
    for (const uid of opts.exclude instanceof Set ? opts.exclude : list(opts.exclude)) exclude.add(text(uid));
    // pairExclusive: 한 벌 안에 같은 번호의 원본 문항과 그 유사 문항(같은 stem+번호)을 함께 넣지 않는다.
    // excludeBaseFamily: 기준 시험지와 같은 stem(그 시험의 유사·유형 문항)은 후보에서 뺀다. 둘 다 기본은 꺼짐(학교 모의고사가 켠다).
    return { typeMode, level, sources: opts.sources, includeBlank: opts.includeBlank === true, pairExclusive: opts.pairExclusive === true,
      excludeBaseFamily: opts.excludeBaseFamily === true, preferSchool: opts.preferSchool === true, softExclude: new Set(list(opts.softExclude)), exclude, seed: opts.seed == null ? "derive" : String(opts.seed) };
  }
  const uidOfItem = (item) => (typeof item === "string" ? text(item) : text(item && (item.questionUid || item.uid)));

  // ---- 선정 ----
  function deriveFromPaper(baseItems, options, index) {
    if (!index || !index.byUid) throw new Error("DERIVE_INDEX_MISSING");
    const opts = normalizeOptions(options);
    const allowSource = sourcePredicate(opts.sources);
    const baseUids = (baseItems || []).map(uidOfItem);
    const bases = baseUids.map((uid) => {
      const cand = uid ? index.byUid.get(uid) : null;
      return cand && cand.ck ? cand : null;
    });
    const resolved = bases.filter(Boolean);
    const blocked = new Set([...opts.exclude, ...baseUids.filter(Boolean)]);

    // 경계: (학년·통합 과목) → 기준이 덮는 대단원 집합("" = 단원 미분류)
    const boundary = new Map();
    for (const base of resolved) {
      if (!boundary.has(base.ck)) boundary.set(base.ck, new Set());
      boundary.get(base.ck).add(base.unit);
    }
    const inBoundary = (cand) => {
      const units = boundary.get(cand.ck);
      return Boolean(units && units.has(cand.unit));
    };

    const avoidTpl = new Set();
    const avoidPt = new Set();
    for (const base of resolved) {
      if (base.tpl) avoidTpl.add(base.tpl);
      else if (base.pt) avoidPt.add(base.pt);
    }
    const targets = levelTargets(bases, opts.level, opts.seed);

    const result = { items: [], perItem: [], summary: null };
    if (!resolved.length) {
      result.perItem = baseUids.map((uid) => ({ baseUid: uid, pickedUid: null, rung: "none", hintOnly: false, levelDelta: null, relaxed: false }));
      result.summary = summarize(opts, baseUids.length, [], bases, targets, { unresolved: baseUids.length, error: "BASE_UNRESOLVED" });
      return result;
    }

    const used = new Set();
    const usedPairs = new Set();
    // 기준 시험지의 stem: 기준 문항들이 놓인 시험 파일(원본·유사·유형 모두 같은 이름 뿌리를 쓴다).
    const baseStems = new Set(resolved.map((base) => base.stem).filter(Boolean));
    const familyBlocked = (cand) =>
      (opts.excludeBaseFamily && baseStems.has(cand.stem)) || (opts.pairExclusive && usedPairs.has(cand.pair));
    const fileCount = new Map();
    const poolFor = (base, rung) => {
      const pool = index.pools.get(base.ck);
      if (!pool) return [];
      switch (rung) {
        case "template": return base.tpl ? pool.tpl.get(base.tpl) || [] : [];
        case "type": return base.pt ? pool.pt.get(base.pt) || [] : [];
        case "concept": return base.l4 ? pool.l4.get(base.l4) || [] : [];
        case "subunit": return base.sub ? pool.sub.get(base.sub) || [] : [];
        case "unit": return pool.unit.get(base.unit || "\u0000none") || [];
        default: return pool.all;
      }
    };
    const hintOnlyOf = (cand, base, rung) => {
      if (rung === "template") return !(cand.tplFormal && base.tplFormal);
      if (rung === "type") return !(cand.ptFormal && base.ptFormal);
      return false;
    };
    const different = opts.typeMode === "different";
    const tolerantRung = different ? "subunit" : "template";
    const conflictStrict = (cand) => Boolean((cand.tpl && avoidTpl.has(cand.tpl)) || (cand.pt && avoidPt.has(cand.pt)));
    const conflictOwn = (cand, base) => (base.tpl ? cand.tpl === base.tpl : Boolean(base.pt) && cand.pt === base.pt);

    // 한 문항의 후보 점수(작을수록 좋음)
    const score = (cand, base, target, dev, rung) => {
      let s = hintOnlyOf(cand, base, rung) ? 1000 : 0;
      if (target !== null) {
        const d = cand.bucket - target;
        s += Math.abs(d) * 100;
        if (d !== 0) s += Math.abs(dev + d) > Math.abs(dev) ? 60 : -10;
      }
      if (cand.unit !== base.unit) s += 20;
      if (rung !== "subunit" && rung !== "unit" && rung !== "none" && cand.sub !== base.sub) s += 5;
      s += (fileCount.get(cand.file) || 0) * 15;
      // 같은 칸이면 학교 기출을 먼저(난이도 한 단계 차이보다는 약하게): 유사 +15, 교재 +25.
      // softExclude: 다른 회차가 이미 고른 문항. 빼지 않고 크게 감점한다(같은 조건의 다른 문항이 있으면 그것, 없으면 겹쳐서라도 채운다).
      if (opts.softExclude.size && opts.softExclude.has(cand.uid)) s += 500;
      if (opts.preferSchool && cand.srcKind !== "school") s += cand.srcKind === "similar" ? 15 : 25;
      s -= (overlap(cand.cc, base.cc) + overlap(cand.cond, base.cond)) * 4;
      s += unit01(opts.seed, cand.uid) * 3;
      return s;
    };
    const choose = (pool, accept, base, target, dev, rung) => {
      let best = null;
      let bestScore = Infinity;
      for (const cand of pool) {
        if (used.has(cand.uid) || blocked.has(cand.uid) || familyBlocked(cand) || !accept(cand)) continue;
        const s = score(cand, base, target, dev, rung);
        if (s < bestScore || (s === bestScore && best && cand.uid < best.uid)) { best = cand; bestScore = s; }
      }
      return best;
    };

    // 한 기준 문항에 대해 사다리를 내려가며 고른다.
    const pickFor = (base, target, dev) => {
      const common = (cand) => inBoundary(cand) && allowSource(cand) && (opts.includeBlank || !cand.blank);
      const ladders = different
        ? [
          { rungs: ["subunit", "unit"], relaxed: false, ok: (c) => !conflictStrict(c) },
          { rungs: ["subunit", "unit"], relaxed: true, ok: (c) => !conflictOwn(c, base) },
        ]
        : [{ rungs: LADDER, relaxed: false, ok: () => true }];
      // 1차: 목표 단계 안(세부 유형이 맞는 칸은 ±1 허용). 2차: 단계 무관하게 가장 가까운 단계.
      for (const exact of [true, false]) {
        for (const ladder of ladders) {
          for (const rung of ladder.rungs) {
            const pool = poolFor(base, rung);
            if (!pool.length) continue;
            const bucketOk = (cand) => {
              if (!exact || target === null) return true;
              const gap = Math.abs(cand.bucket - target);
              return gap === 0 || (gap === 1 && rung === tolerantRung);
            };
            const cand = choose(pool, (c) => common(c) && ladder.ok(c) && bucketOk(c), base, target, dev, rung);
            if (cand) return { cand, rung, relaxed: ladder.relaxed, hintOnly: hintOnlyOf(cand, base, rung) };
          }
        }
      }
      // 마지막: 범위 안의 아무 문항(단원이 달라도)
      const cand = choose(poolFor(base, "none"), (c) => common(c), base, target, dev, "none");
      return cand ? { cand, rung: "none", relaxed: different, hintOnly: false } : null;
    };

    // 후보가 적은 기준 문항부터 처리한다(희귀한 칸을 먼저 확보). 같으면 기준 순서.
    // 후보 수는 실제로 뽑을 수 있는 문항만 센다(기준 문항 자신·제외·경계 밖·출처 밖은 뺀다). 자기 자신뿐인 칸을 "희귀"로 오해해
    // 먼저 처리하면, 그 자리가 가장 넓은 단(범위 안 다른 단원)에서 다른 자리가 쓸 같은 유형 후보를 가져가 버린다.
    const countable = (cand) => !blocked.has(cand.uid) && !familyBlocked(cand) && inBoundary(cand) && allowSource(cand) && (opts.includeBlank || !cand.blank);
    const order = bases.map((base, i) => i).filter((i) => bases[i]).sort((a, b) => {
      const size = (i) => {
        for (const rung of different ? ["subunit", "unit"] : LADDER) {
          const n = poolFor(bases[i], rung).filter(countable).length;
          if (n) return n;
        }
        return 1e9;
      };
      return size(a) - size(b) || a - b;
    });
    const picks = new Array(bases.length).fill(null);
    let dev = 0;
    for (const i of order) {
      const found = pickFor(bases[i], targets[i], dev);
      if (!found) continue;
      picks[i] = found;
      used.add(found.cand.uid);
      usedPairs.add(found.cand.pair);
      fileCount.set(found.cand.file, (fileCount.get(found.cand.file) || 0) + 1);
      if (targets[i] !== null) dev += found.cand.bucket - targets[i];
    }

    bases.forEach((base, i) => {
      const found = picks[i];
      if (!base) {
        result.perItem.push({ baseUid: baseUids[i], pickedUid: null, rung: "none", hintOnly: false, levelDelta: null, relaxed: false, unresolved: true });
        return;
      }
      if (!found) {
        result.perItem.push({ baseUid: base.uid, pickedUid: null, rung: "none", hintOnly: false, levelDelta: null, relaxed: false });
        return;
      }
      result.perItem.push({
        baseUid: base.uid,
        pickedUid: found.cand.uid,
        rung: found.rung,
        hintOnly: found.hintOnly,
        levelDelta: base.bucket !== null ? found.cand.bucket - base.bucket : null,
        relaxed: found.relaxed,
      });
      result.items.push(found.cand.record);
    });
    result.summary = summarize(opts, baseUids.length, picks, bases, targets, { unresolved: baseUids.length - resolved.length, index });
    return result;
  }

  // ---- 요약: 단별 문항 수, 난이도, 시험지 수준 일치율, 화면 문구 ----
  function summarize(opts, baseCount, picks, bases, targets, extra) {
    const counts = { template: 0, type: 0, concept: 0, subunit: 0, unit: 0, none: 0 };
    const difficulty = { easier: 0, same: 0, harder: 0, unknown: 0 };
    let hintOnly = 0;
    let relaxed = 0;
    let filled = 0;
    let overlap = 0;
    let templateMatch = 0;
    let templateFormalMatch = 0;
    let templateDen = 0;
    let typeMatch = 0;
    let typeDen = 0;
    let noTypeInfo = 0;
    let resolvedBase = 0;
    let unitMatch = 0;
    let levelMatch = 0;
    let levelKnown = 0;
    const baseHist = {};
    const pickHist = {};
    bases.forEach((base, i) => {
      const found = picks[i];
      if (base) {
        resolvedBase += 1;
        if (!base.tpl && !base.pt) noTypeInfo += 1;
      }
      if (!base || !found) return;
      filled += 1;
      if (opts.softExclude && opts.softExclude.has(found.cand.uid)) overlap += 1;
      counts[found.rung] += 1;
      if (found.hintOnly) hintOnly += 1;
      if (found.relaxed && opts.typeMode === "different") relaxed += 1;
      const cand = found.cand;
      // 유형 정보(세부 유형 TPL, 유형 PT)가 없는 기준 문항은 해당 일치율의 분모에서 뺀다.
      if (base.tpl) {
        templateDen += 1;
        if (cand.tpl === base.tpl) {
          templateMatch += 1;
          if (base.tplFormal && cand.tplFormal) templateFormalMatch += 1;
        }
      }
      if (base.pt) {
        typeDen += 1;
        if (cand.pt === base.pt) typeMatch += 1;
      }
      if (cand.unit === base.unit) unitMatch += 1;
      if (base.bucket === null) difficulty.unknown += 1;
      else {
        const d = cand.bucket - base.bucket;
        if (d < 0) difficulty.easier += 1;
        else if (d > 0) difficulty.harder += 1;
        else difficulty.same += 1;
        baseHist[base.bucket] = (baseHist[base.bucket] || 0) + 1;
        pickHist[cand.bucket] = (pickHist[cand.bucket] || 0) + 1;
      }
      if (targets[i] !== null) { levelKnown += 1; if (cand.bucket === targets[i]) levelMatch += 1; }
    });
    const rate = (n, d) => (d ? n / d : null);
    let histGap = 0;
    for (const key of new Set([...Object.keys(baseHist), ...Object.keys(pickHist)])) histGap += Math.abs((baseHist[key] || 0) - (pickHist[key] || 0));
    const known = Object.values(baseHist).reduce((a, b) => a + b, 0);
    const rungRows = ["template", "type", "concept"].map((rung) => ({ label: RUNG_LABEL[rung], count: counts[rung] }));
    rungRows.push({ label: RUNG_LABEL.unit, count: counts.subunit + counts.unit });
    if (counts.none) rungRows.push({ label: RUNG_LABEL.none, count: counts.none });
    const notes = [];
    if (opts.typeMode === "different" && relaxed) notes.push(`다른 유형이 모자라 ${relaxed}문항은 시험지 안 다른 문항과 유형이 겹치는 것을 허용했습니다(그 문항 자신의 유형은 피했습니다).`);
    if (counts.none) notes.push(`같은 단원에 후보가 없어 ${counts.none}문항은 시험 범위 안 다른 단원에서 뽑았습니다.`);
    if (filled < baseCount) notes.push(`후보가 부족해 ${baseCount - filled}문항은 채우지 못했습니다.`);
    if (extra && extra.unresolved) notes.push(`기준 문항 ${extra.unresolved}개를 자료에서 찾지 못했습니다.`);
    if (hintOnly) notes.push(`${hintOnly}문항은 유형 정보가 확정 전(참고용)인 것으로 골랐습니다.`);
    const textParts = rungRows.filter((row) => row.count > 0).map((row) => `${row.label} ${row.count}`);
    const levelText = `기준보다 쉬움 ${difficulty.easier} · 같음 ${difficulty.same} · 어려움 ${difficulty.harder}`;
    // 못 채운 자리(기준 시험지의 몇 번째 자리인지, 1부터)와 한 줄 요약("24문항 중 21문항 같은 유형, 3문항 같은 단원").
    const unfilledSlots = [];
    bases.forEach((base, i) => { if (base && !picks[i]) unfilledSlots.push(i + 1); });
    const sameType = counts.template + counts.type;
    const headParts = [`${baseCount}문항 중 ${sameType}문항 같은 유형`];
    if (counts.concept) headParts.push(`${counts.concept}문항 같은 개념`);
    if (counts.subunit + counts.unit) headParts.push(`${counts.subunit + counts.unit}문항 같은 단원`);
    if (counts.none) headParts.push(`${counts.none}문항 범위 안 다른 단원`);
    if (baseCount - filled > 0) headParts.push(`${baseCount - filled}문항 못 채움`);
    if (overlap) headParts.push(`다른 회차와 겹침 ${overlap}문항`);
    return {
      headline: headParts.join(", "),
      overlap,
      sameType,
      unfilledSlots,
      typeMode: opts.typeMode,
      level: opts.level,
      seed: opts.seed,
      baseCount,
      filled,
      shortfall: baseCount - filled,
      unresolvedBase: (extra && extra.unresolved) || 0,
      error: (extra && extra.error) || "",
      counts,
      rungRows,
      difficulty,
      hintOnly,
      relaxed,
      match: {
        templateFormal: rate(templateFormalMatch, templateDen),
        template: rate(templateMatch, templateDen),
        type: rate(typeMatch, typeDen),
        hintRate: rate(hintOnly, filled),
        noTypeInfoRate: rate(noTypeInfo, resolvedBase),
        unit: rate(unitMatch, filled),
        level: rate(levelMatch, levelKnown),
        levelDistribution: known ? 1 - histGap / (2 * known) : null,
      },
      text: textParts.join(" · "),
      levelText,
      notes,
    };
  }

  // 빈 문항(정답 없음, 또는 해설·해설 그림이 모두 없음). 빠른 진단평가의 빈 문항 제외와 같은 기준.
  function isBlankQuestion(question) {
    const q = question || {};
    const answer = text(q.answer);
    const solution = text(q.solution !== undefined ? q.solution : q.explanation);
    const solutionImage = text(q.solutionImage !== undefined ? q.solutionImage : q.solutionImg);
    return !answer || (!solution && !solutionImage);
  }

  return Object.freeze({
    VERSION, LADDER, RUNGS, RUNG_LABEL, LEVEL_MODES, TYPE_MODES, WORKBOOK_PUBLISHERS,
    buildDeriveIndex, deriveFromPaper, isBlankQuestion, sourceKindOf, sourcePredicate, publisherOf, levelTargets,
  });
});
