'use strict';
// 시험 범위 맞춤 모의고사 조립기. 범위 정의(scoped-mock-scopes.json: 학년·학교 이름·포함 단원 묶음·회차 수)만 주면
// 기존 풀(원본 기출 시험지 JS)에서 문항을 골라 팩을 만든다. 자료 파일은 build-m1-2final-mock.cjs가 기존 5회 뒤에 이어 쓴다.
//   node archive/tools/assessment-mock/build-scoped-mock.cjs --report            선정 결과 요약(후보 수 표, 겹침, 난이도)
//   node archive/tools/assessment-mock/build-scoped-mock.cjs --tables <폴더>      회차별 문항표 md 쓰기
// 문항 텍스트·정답·해설·그림 참조는 원본 시험지 JS에서 그대로 복사한다(기존 모의고사와 같은 규칙).
// 범위는 카탈로그의 2022 중단원(단원별 기출 화면과 같은 판정)과 유형 키로만 판정한다. 발문을 읽어 범위를 정하지 않는다.
const fs = require('fs');
const path = require('path');
const { ARCHIVE_ROOT, EXAMS_ROOT, loadExam, parseSource } = require('./load-pool.cjs');
const { stripScoreLabels } = require('./clean-stem.cjs');
const { loadCatalogRecords, groupIndexOf } = require('./scoped-units.cjs');

const SCOPES_FILE = path.join(__dirname, 'scoped-mock-scopes.json');
const DOMAIN_FIELD = '_assessmentDomain';

function loadScopes() {
  return JSON.parse(fs.readFileSync(SCOPES_FILE, 'utf8'));
}

// ---- 후보 검사 --------------------------------------------------------------------------------------------
const IMG_RE = /<img[^>]+src="([^"]+)"/g;
function plain(text) { return String(text ?? '').replace(/<[^>]+>/g, ' ').replace(/\$[^$]*\$/g, ' ').replace(/\s+/g, ' ').trim(); }
function dupKeyOf(q) {
  const norm = (text) => String(text ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, '');
  return norm(q.content) + '|' + (q.choices || []).map(norm).join('|');
}
function fileExists(rel) { return Boolean(rel) && !/^[a-z]+:\/\//i.test(rel) && fs.existsSync(path.join(ARCHIVE_ROOT, rel)); }
function figureFilesOf(q) {
  const files = [];
  if (q.image) files.push(q.image);
  if (q.solutionImage) files.push(q.solutionImage);
  for (const m of String(q.content ?? '').matchAll(IMG_RE)) files.push(m[1]);
  for (const c of q.choices || []) for (const m of String(c).matchAll(IMG_RE)) files.push(m[1]);
  return files;
}
// 제외 사유(문자열) 또는 '' (사용 가능). 정답·해설 비어 있음, 그림 파일 없음·그림이 필요한데 없음, 원본 품질 보류, 보기 부족.
function rejectReason(q, rec) {
  if (String(q.answer ?? '').trim() === '') return '정답 없음';
  if (String(q.solution ?? '').trim() === '') return '해설 없음';
  if (String(q.content ?? '').trim() === '') return '발문 없음';
  if (q.questionType !== '객관식' && q.questionType !== '서술형') return '유형 아님';
  if (q.questionType === '객관식') {
    const choicesInFigure = Array.isArray(q.choices) && q.choices.length === 0 && (q.image || /<img\b/i.test(String(q.content)))
      && /^\s*[①-⑤](?:\s*[,，、]?\s*[①-⑤])*\s*$/.test(String(q.answer));
    if (!choicesInFigure && !(Array.isArray(q.choices) && q.choices.length >= 4)) return '보기 부족';
  }
  for (const f of figureFilesOf(q)) if (!fileExists(f)) return '그림 파일 없음';
  const text = String(q.content ?? '') + ' ' + (q.choices || []).join(' ');
  const hasFigure = Boolean(q.image) || /<img\b|<svg\b/i.test(text);
  if (!hasFigure && /그림/.test(plain(q.content))) return '그림이 필요한데 없음';
  if (!hasFigure && !/<table\b/i.test(text) && /(?:다음|아래|위)\s*표|표와\s*같/.test(plain(q.content))) return '표가 필요한데 없음';
  if (rec.sourceIssueHold || rec.sourceQualityHold || rec.sourceDefectCandidate) return '원본 품질 보류';
  if (q.l3Disposition === 'HOLD' || q.l4Disposition === 'HOLD' || q.itemHold) return '메타 보류';
  if (rec.defaultSelectable === false) return '기본 선택 불가';
  const bucket = Number(rec.difficultyBucket ?? q.difficultyBucket);
  if (!Number.isInteger(bucket) || bucket < 1 || bucket > 5) return '난이도 없음';
  return '';
}
// 여러 문항이 한 자료를 같이 쓰는 묶음("※ (15~17)", "[15~16]")은 앞 문항에만 자료가 있어 뒤 문항을 혼자 풀 수 없다. 머리 문항과 뒤 문항을 모두 뺀다.
const GROUP_HEADER = /^\s*(?:※\s*)?[[(（]\s*(\d+)\s*(?:번)?\s*[~∼～-]\s*(\d+)\s*(?:번)?\s*[\])）]/;
function groupedIds(questions) {
  const blocked = new Set();
  for (const q of questions) {
    const m = GROUP_HEADER.exec(plain(q.content));
    if (!m) continue;
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (b >= a && b - a <= 8) for (let n = a; n <= b; n += 1) blocked.add(String(n));
    blocked.add(String(q.id));
  }
  return blocked;
}
// 앞 문항의 표·자료를 가리키는 말("위 도수분포표", "앞의 문제")인데 이 문항에 표·그림이 없으면 혼자 풀 수 없다.
const DEPENDS_ON_EARLIER = /(?:^|[\s(])위(?:의)?\s*(?:도수분포표|표|자료|문제|조건|결과|경우)|앞(?:의|선)\s*(?:문제|표|그림|자료)|^\s*(?:\d+\s*[.)]\s*)?위(?:의)?\s/;
function dependsOnEarlier(q) {
  const text = String(q.content ?? '');
  if (q.image || /<img\b|<svg\b|<table\b/i.test(text + ' ' + (q.choices || []).join(' '))) return false;
  return DEPENDS_ON_EARLIER.test(plain(q.content));
}
// 규칙에 textAny(발문·보기에 이 말이 하나는 있어야 함)·noFigure(그림 없이 글·표만)가 있으면 그 규칙으로 들어온 문항만 검사한다.
// 유형 키가 없는 문항을 발문의 낱말로 "넣는" 보조 길이다: 키로는 범위가 갈리지 않는 곳(중1 도수분포표)에서만 쓴다.
function ruleTextCheck(rule, q) {
  if (!rule || (!rule.textAny && !rule.noFigure)) return '';
  const text = plain(q.content) + ' ' + (q.choices || []).map(plain).join(' ');
  if (rule.textAny && !rule.textAny.some((word) => text.includes(word))) return 'textAny';
  if (rule.noFigure && (q.image || /<img\b|<svg\b/i.test(String(q.content ?? '') + (q.choices || []).join(' ')))) return 'noFigure';
  return '';
}
function textGuardHit(scope, q, rule) {
  // 수식($...$) 안의 글자("%")도 본다. 글자 가드는 범위 밖 낱말이 하나라도 있으면 뺀다.
  const raw = (value) => String(value ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  let text = raw(q.content) + ' ' + (q.choices || []).map(raw).join(' ');
  if (rule && rule.guardSolution) text += ' ' + raw(q.solution);
  for (const needle of scope.excludeText || []) if (text.includes(needle)) return needle;
  for (const source of scope.excludeRegex || []) if (new RegExp(source).test(text)) return source;
  return '';
}

// ---- 풀 만들기 --------------------------------------------------------------------------------------------
function listExamFiles(scope) {
  const out = [];
  for (const dir of scope.sourceDirs) {
    const abs = path.join(EXAMS_ROOT, dir);
    for (const name of fs.readdirSync(abs)) {
      if (name.endsWith('.js') && fs.statSync(path.join(abs, name)).isFile()) out.push(`${dir}/${name}`);
    }
  }
  return out.sort();
}

function buildPool(scope, catalog, common) {
  const stats = {
    files: 0, questions: 0, noCatalog: 0, outOfYear: 0, outOfScope: 0, rejected: {}, textGuard: {}, dupDropped: 0,
    byGroup: scope.groups.map(() => ({ all: 0, usable: 0, objective: 0, subjective: 0 })),
  };
  const raw = [];
  for (const file of listExamFiles(scope)) {
    const meta = parseSource(file);
    stats.files += 1;
    const questions = loadExam(file).questions;
    const blocked = groupedIds(questions);
    for (const q of questions) {
      stats.questions += 1;
      const rec = catalog.get(`${file}#${q.id}`);
      if (!rec) { stats.noCatalog += 1; continue; }
      if (meta.year < scope.yearMin || meta.year > common.yearMax) { stats.outOfYear += 1; continue; }
      const { index, l2, rule } = groupIndexOf(scope, rec);
      if (index < 0) { stats.outOfScope += 1; continue; }
      const extra = ruleTextCheck(rule, q);
      if (extra) { stats.outOfScope += 1; continue; }
      stats.byGroup[index].all += 1;
      const why = blocked.has(String(q.id)) ? '묶음 문항(자료를 앞 문항과 같이 씀)' : dependsOnEarlier(q) ? '앞 문항의 표·자료를 가리킴' : rejectReason(q, rec);
      if (why) { stats.rejected[why] = (stats.rejected[why] || 0) + 1; continue; }
      const guard = textGuardHit(scope, q, rule);
      if (guard) { stats.textGuard[guard] = (stats.textGuard[guard] || 0) + 1; continue; }
      raw.push({
        file, q, rec, gi: index, l2: l2.l2,
        subj: q.questionType === '서술형',
        bucket: Number(rec.difficultyBucket ?? q.difficultyBucket),
        year: meta.year, school: meta.school,
        type: String(rec.problemTypeKey || rec.metaHintL3 || rec.subUnitKey || scope.groups[index].label),
        dup: dupKeyOf(q), qKey: `${file}_${q.id}`,
      });
    }
  }
  // 같은 발문·보기의 문항(학교끼리 베낀 문제)은 가장 최근 것 하나만 남긴다.
  raw.sort((a, b) => b.year - a.year || (a.qKey < b.qKey ? -1 : 1));
  const seen = new Set();
  const pool = [];
  for (const c of raw) {
    if (seen.has(c.dup)) { stats.dupDropped += 1; continue; }
    seen.add(c.dup);
    pool.push(c);
    const s = stats.byGroup[c.gi];
    s.usable += 1;
    if (c.subj) s.subjective += 1; else s.objective += 1;
  }
  return { pool, stats };
}

// ---- 선정 -------------------------------------------------------------------------------------------------
function hash32(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function selectPacks(scope, pool, common) {
  const k = scope.groups.length;
  const planBuckets = [];
  for (const [b, n] of Object.entries(common.bucketPlan)) for (let i = 0; i < n; i += 1) planBuckets.push(Number(b));
  planBuckets.sort((a, b) => a - b);
  const byGroup = scope.groups.map((_, gi) => pool.filter((c) => c.gi === gi));
  const useCount = new Map(); // qKey -> 앞 회차에서 쓴 횟수
  const packs = [];
  for (let p = 0; p < scope.rounds; p += 1) {
    // 서술형을 줄 묶음: 서술형 후보가 있는 묶음 중 회차마다 돌려 가며 common.subjective개
    const subjEligible = scope.groups.map((_, gi) => gi).filter((gi) => byGroup[gi].some((c) => c.subj) && scope.groups[gi].weight >= 3);
    const subjGroups = new Set();
    for (let i = 0; subjGroups.size < Math.min(common.subjective, subjEligible.length) && i < subjEligible.length * 2; i += 1) {
      subjGroups.add(subjEligible[(p * common.subjective + i) % subjEligible.length]);
    }
    // 칸 계획: 묶음 순서의 칸마다 목표 난이도(1~5)를 돌려 가며 나눠 준다(묶음마다 쉬운 것~어려운 것이 섞이게).
    const slots = [];
    scope.groups.forEach((group, gi) => {
      for (let s = 0; s < group.weight; s += 1) slots.push({ gi, subj: false, order: s });
      if (subjGroups.has(gi)) slots[slots.length - 1].subj = true; // 이 묶음의 마지막 칸 하나를 서술형으로
    });
    const rr = [];
    for (let s = 0; ; s += 1) {
      let any = false;
      for (let gi = 0; gi < k; gi += 1) {
        const slot = slots.filter((x) => x.gi === gi)[s];
        if (slot) { rr.push(slot); any = true; }
      }
      if (!any) break;
    }
    const offset = (p * 5) % planBuckets.length;
    rr.forEach((slot, i) => { slot.target = planBuckets[(i + offset) % planBuckets.length]; });
    const chosen = [];
    const packTypes = new Set();
    const packDup = new Set();
    const packKeys = new Set();
    const fileUse = new Map();
    // 후보가 적은 묶음의 칸부터 채운다.
    const slotOrder = slots.slice().sort((a, b) => byGroup[a.gi].length - byGroup[b.gi].length || a.gi - b.gi || a.order - b.order);
    for (const slot of slotOrder) {
      let best = null;
      let bestScore = Infinity;
      for (const c of byGroup[slot.gi]) {
        if (c.subj !== slot.subj || packKeys.has(c.qKey) || packDup.has(c.dup)) continue;
        let score = (useCount.get(c.qKey) || 0) * 1000;
        if (packTypes.has(c.type)) score += 200;
        const used = fileUse.get(c.file) || 0;
        if (used >= 3) score += 300; else if (used === 2) score += 30;
        score += Math.abs(c.bucket - slot.target) * 20;
        score += (common.yearMax - c.year) * 2;
        score += hash32(`${c.qKey}|${p}`) % 10;
        if (score < bestScore) { best = c; bestScore = score; }
      }
      if (!best && slot.subj) {
        // 서술형 후보가 바닥나면 그 칸은 같은 묶음의 객관식 대신 다른 서술형 묶음이 아니라 비워 두지 않고 객관식으로 대신한다.
        slot.subj = false;
        for (const c of byGroup[slot.gi]) {
          if (c.subj || packKeys.has(c.qKey) || packDup.has(c.dup)) continue;
          const score = (useCount.get(c.qKey) || 0) * 1000 + Math.abs(c.bucket - slot.target) * 20 + (common.yearMax - c.year) * 2 + hash32(`${c.qKey}|${p}`) % 10;
          if (score < bestScore) { best = c; bestScore = score; }
        }
      }
      if (!best) throw new Error(`${scope.id} ${p + 1}회 ${scope.groups[slot.gi].label}: 후보가 모자랍니다`);
      chosen.push({ c: best, slot });
      packKeys.add(best.qKey); packDup.add(best.dup); packTypes.add(best.type);
      fileUse.set(best.file, (fileUse.get(best.file) || 0) + 1);
    }
    chosen.forEach(({ c }) => useCount.set(c.qKey, (useCount.get(c.qKey) || 0) + 1));
    // 배열: 객관식(묶음 순서, 같은 묶음 안에서는 쉬운 것부터) 뒤에 서술형(같은 규칙)
    const cmp = (a, b) => a.c.gi - b.c.gi || a.c.bucket - b.c.bucket || (a.c.qKey < b.c.qKey ? -1 : 1);
    const objective = chosen.filter((x) => !x.c.subj).sort(cmp);
    const subjective = chosen.filter((x) => x.c.subj).sort(cmp);
    packs.push(objective.concat(subjective).map((x) => x.c));
  }
  return packs;
}

// ---- 팩 조립 ----------------------------------------------------------------------------------------------
function assemblePack(scope, common, selectedCandidates, roundNo, helpers) {
  const { KEEP_FIELDS, stripSubjectivePrefix, CATEGORY } = helpers;
  const packId = `MOCK_2026_2SEM_FINAL_${scope.gradeKey.toUpperCase()}_${scope.idKey}_${String(roundNo).padStart(2, '0')}`;
  const questions = selectedCandidates.map((c) => {
    const src = c.q;
    const clone = {};
    for (const key of KEEP_FIELDS) if (src[key] !== undefined) clone[key] = JSON.parse(JSON.stringify(src[key]));
    let removed = '';
    if (clone.questionType === '서술형') {
      // 발문이 <p>로 시작하면 그 뒤의 "[서답형 3]" 같은 원 시험지 번호 표기도 지운다(기본 5회 조립기의 지우개는 맨 앞만 본다).
      const lead = /^\s*<p[^>]*>\s*/i.exec(clone.content);
      const r = stripSubjectivePrefix(lead ? clone.content.slice(lead[0].length) : clone.content);
      if (r.removed) {
        clone.content = (lead ? lead[0] : '') + r.content;
        removed = r.removed;
      }
    }
    const score = stripScoreLabels(clone.content);
    clone.content = score.content;
    if (score.removed.length) clone._sourceScoreLabels = score.removed.join(' ');
    const meta = parseSource(c.file);
    const group = scope.groups[c.gi];
    Object.assign(clone, {
      _sourceTitle: path.basename(c.file, '.js'),
      _sourceFile: c.file,
      _sourceQuestionNo: src.id,
      _sourceSchool: meta.school,
      _sourceYear: meta.year % 100,
      _sourceExamType: meta.examType,
      _qKey: c.qKey,
      _assessmentPackId: packId,
      _assessmentSkill: c.type,
      _assessmentTypeKey: `MOCK_${scope.gradeKey.toUpperCase()}_${scope.idKey}_G${c.gi + 1}`,
      [DOMAIN_FIELD]: group.label,
      _scopeId: scope.id,
      _scopeGroup: group.label,
      _scopeL2: c.l2,
    });
    if (removed) clone._sourceStemLabel = removed;
    return clone;
  });
  const difficultyMix = {};
  for (const lv of ['하', '중', '상']) {
    const n = questions.filter((q) => q.level === lv).length;
    if (n) difficultyMix[lv] = n;
  }
  const difficultyBucketMix = {};
  for (const q of questions) difficultyBucketMix[q.difficultyBucket] = (difficultyBucketMix[q.difficultyBucket] || 0) + 1;
  const skillMix = {};
  for (const group of scope.groups) {
    const n = questions.filter((q) => q._scopeGroup === group.label).length;
    if (n) skillMix[group.label] = n;
  }
  const subjective = questions.filter((q) => q.questionType === '서술형').length;
  return {
    id: packId,
    title: scope.titleTemplate.replace('{grade}', scope.grade).replace('{school}', scope.school).replace('{n}', String(roundNo)),
    category: CATEGORY,
    grade: scope.grade,
    semester: '2',
    examType: 'mock',
    unitKey: `${scope.gradeKey.toUpperCase()}-2FINAL-MOCK-${scope.idKey}`,
    unitLabel: scope.unitLabel,
    courseLabel: `${scope.grade} 수학 2학기`,
    purpose: `${scope.grade} ${scope.school} 2학기 기말고사 범위 모의고사 (객관식 ${questions.length - subjective} + 서술형 ${subjective})`,
    questionCount: questions.length,
    estimatedMinutes: common.estimatedMinutes,
    hasImage: questions.some((q) => !!q.image || /<img\s/i.test(String(q.content || ''))),
    sourceScope: `${scope.grade} 2학기 기말·중간 기출 원본(${scope.yearMin}~${common.yearMax}년) 중 시험 범위 문항, 카탈로그 중단원·유형 키로만 고름, 한 모의고사 안 같은 문항·같은 발문 없음`,
    difficultyMix,
    difficultyBucketMix,
    skillMix,
    scopeUnits: scope.groups.map((g) => g.label),
    scopeLabel: scope.scopeLabel,
    scopeNote: `${scope.school} 기말고사 범위 맞춤 모의고사`,
    questions,
  };
}

function buildScopedPacks(helpers) {
  const config = loadScopes();
  const prefixes = [...new Set(config.scopes.flatMap((s) => s.sourceDirs))];
  const { records: catalog } = loadCatalogRecords(prefixes);
  const packs = [];
  const report = [];
  const rows = [];
  for (const scope of config.scopes) {
    const { pool, stats } = buildPool(scope, catalog, config.common);
    const selected = selectPacks(scope, pool, config.common);
    selected.forEach((cands, i) => {
      const pack = assemblePack(scope, config.common, cands, i + 1, helpers);
      packs.push(pack);
      cands.forEach((c, n) => rows.push({
        packId: pack.id, title: pack.title, n: n + 1, file: c.file, srcNo: c.q.id, group: scope.groups[c.gi].label, l2: c.l2,
        type: c.type, bucket: c.bucket, level: c.q.level || '', qtype: c.q.questionType, year: c.year,
        stem: plain(c.q.content).slice(0, 40),
      }));
    });
    report.push({ scope, stats, selected });
  }
  const summary = null;
  return { packs, report, rows, summary, config };
}

function overlapOf(selected) {
  const out = [];
  for (let a = 0; a < selected.length; a += 1) {
    for (let b = a + 1; b < selected.length; b += 1) {
      const keys = new Set(selected[a].map((c) => c.qKey));
      out.push({ a: a + 1, b: b + 1, shared: selected[b].filter((c) => keys.has(c.qKey)).length });
    }
  }
  return out;
}

function tableMarkdown(packTitle, rows) {
  const lines = [`# ${packTitle}`, '', '| 번호 | 출처 시험지 | 원 번호 | 단원(묶음) | 중단원 | 유형 | 난이도 | 구분 | 발문 앞 40자 |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |'];
  for (const r of rows) {
    lines.push(`| ${r.n} | ${path.basename(r.file, '.js')} | ${r.srcNo} | ${r.group} | ${r.l2} | ${r.type} | ${r.bucket} | ${r.qtype} | ${r.stem.replace(/\|/g, '/')} |`);
  }
  return lines.join('\n') + '\n';
}

if (require.main === module) {
  const base = require('./build-m1-2final-mock.cjs');
  const helpers = { KEEP_FIELDS: base.KEEP_FIELDS, stripSubjectivePrefix: base.stripSubjectivePrefix, CATEGORY: base.CATEGORY };
  const args = process.argv.slice(2);
  const result = buildScopedPacks(helpers);
  if (args.includes('--report')) {
    for (const { scope, stats, selected } of result.report) {
      console.log(`\n## ${scope.id} ${scope.grade} ${scope.school} (${scope.rounds}회)`);
      console.log(`시험지 ${stats.files}개 · 문항 ${stats.questions} · 카탈로그 없음 ${stats.noCatalog} · 연도 밖 ${stats.outOfYear} · 범위 밖(묶음 없음) ${stats.outOfScope} · 발문 중복 제거 ${stats.dupDropped}`);
      console.log('제외 사유', JSON.stringify(stats.rejected), '글자 가드', JSON.stringify(stats.textGuard));
      scope.groups.forEach((g, gi) => {
        const s = stats.byGroup[gi];
        console.log(`  ${g.label} (칸 ${g.weight}): 묶음 문항 ${s.all} → 사용 가능 ${s.usable} (객관식 ${s.objective}, 서술형 ${s.subjective})`);
      });
      console.log('회차 겹침', JSON.stringify(overlapOf(selected)));
    }
  }
  const tIdx = args.indexOf('--tables');
  if (tIdx >= 0) {
    const dir = args[tIdx + 1];
    fs.mkdirSync(dir, { recursive: true });
    const byPack = new Map();
    for (const r of result.rows) { if (!byPack.has(r.packId)) byPack.set(r.packId, []); byPack.get(r.packId).push(r); }
    for (const [id, rows] of byPack) fs.writeFileSync(path.join(dir, `${id}.md`), tableMarkdown(`${rows[0].title} (${id})`, rows));
    console.log('문항표 저장:', dir);
  }
}

module.exports = { buildScopedPacks, loadScopes, overlapOf, SCOPES_FILE, buildPool, selectPacks, rejectReason, textGuardHit, ruleTextCheck };
