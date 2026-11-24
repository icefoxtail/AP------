'use strict';
// 시험 범위 맞춤 모의고사용 단원 판정. 카탈로그(archive/data/archive2-catalog.json)의 문항 행과
// 단원별 기출·문제지 만들기 화면이 쓰는 같은 판정(Archive2UnifiedUnits → Archive2UnitTree)으로 2022 중단원(L2)을 구한다.
// 원본 시험지·카탈로그·판정 코드는 읽기만 한다.
const fs = require('fs');
const path = require('path');
const { ARCHIVE_ROOT } = require('./load-pool.cjs');

const CATALOG_FILE = path.join(ARCHIVE_ROOT, 'data', 'archive2-catalog.json');

let libs = null;
function loadLibs() {
  if (libs) return libs;
  libs = {
    Core: require(path.join(ARCHIVE_ROOT, 'unit-past-exams-core.js')),
    Tree: require(path.join(ARCHIVE_ROOT, 'archive2-unit-tree.js')),
    Units: require(path.join(ARCHIVE_ROOT, 'archive2-unified-units.js')),
  };
  return libs;
}

// 카탈로그 행을 `${sourceFile}#${문항번호}` 키로 읽는다. sourceFilePrefixes에 맞는 파일만 푼다(45MB 전체를 객체로 만들지 않는다).
function loadCatalogRecords(sourceFilePrefixes) {
  const data = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
  const decode = (value) => (Array.isArray(value) && value.length === 1 && Number.isInteger(value[0]) ? data.strings[value[0]] : value);
  const col = new Map(data.columns.map((name, i) => [name, i]));
  const fileAt = col.get('sourceFile');
  const out = new Map();
  for (const row of data.records) {
    const file = decode(row[fileAt]);
    if (!sourceFilePrefixes.some((prefix) => String(file).startsWith(prefix))) continue;
    const rec = {};
    data.columns.forEach((name, i) => {
      const value = decode(row[i]);
      if (value !== null && value !== undefined) rec[name] = value;
    });
    rec.id = rec.sourceQuestionNo;
    out.set(`${rec.sourceFile}#${rec.sourceQuestionNo}`, rec);
  }
  return { records: out, catalogMeta: { indexVersion: data.indexVersion, metadataRevision: data.metadataRevision } };
}

const treeCache = new Map();
function treeFor(profileId) {
  if (treeCache.has(profileId)) return treeCache.get(profileId);
  const { Core, Tree } = loadLibs();
  const profile = Core.getProfile(profileId);
  const tree = Tree.createTree(profileId, profile.units.map((unit) => ({ key: unit.key, name: unit.name })));
  treeCache.set(profileId, tree);
  return tree;
}

// 문항의 2022 중단원 이름(L2). 정하지 못하면 null("중단원 미지정"·미분류 포함).
function middleL2Of(record, profileId) {
  const { Units, Tree } = loadLibs();
  const res = Units.classify(record);
  if (!res.placed || res.entry.unclassified) return null;
  const e = res.entry;
  const wrapped = {
    ...record,
    rpmParentResolution: e.rpmParentStatus
      ? { status: e.rpmParentStatus, parent: e.rpmParent || null, reviewedParent: e.reviewedMiddleParent || undefined }
      : undefined,
  };
  const tree = treeFor(profileId);
  let childKey = tree.childKeyOf(e.unitKey, wrapped);
  let viaRow = false;
  // 원본을 정식 수정한 문항(행이 등록된 때의 원본 지문과 지금 원본 지문이 다르고, 재결속 기록으로 발문·보기가 같다고 확인된 행)은
  // 정본 판정이 검토 대기로 돌아가 비고, 화면 쪽 목차 판정도 "수정된 원본의 옛 부모는 쓰지 않는다"(rpm-middle-toc.js staleMetadata)로 중단원을 못 정한다.
  // 유형·단원 판정은 발문·보기가 바뀌어도 쓴다는 결정(docs/agents/metadata.md)에 따라, 행에 적힌 중단원 이름을 같은 대단원의 중단원과 대조해 쓴다.
  // 대단원이 다르거나 이름을 못 찾으면 그대로 미지정이다. 수정하지 않은 문항에는 적용하지 않는다.
  const evidenceFp = record.metadataAssignmentEvidence && record.metadataAssignmentEvidence.sourceFingerprint;
  const sourceCorrected = Boolean(evidenceFp && record.sourceFingerprint && evidenceFp !== record.sourceFingerprint);
  if ((!childKey || childKey === Tree.NONE_KEY) && record.metaBinding === 'text' && sourceCorrected) {
    const tax = record.unverifiedTaxonomy || {};
    const hit = tax.L1 === e.unitLabel && tax.L2
      ? tree.childrenOf(e.unitKey).find((child) => child.name === tax.L2 && child.key !== Tree.NONE_KEY) : null;
    if (hit) { childKey = hit.key; viaRow = true; }
  }
  if (!childKey || childKey === Tree.NONE_KEY) return null;
  const name = tree.childName(e.unitKey, childKey);
  // 중단원을 정한 길: exact(정본 판정 EXACT), reviewed(문항별 중단원 지정표), legacy(옛 소단원 키 매핑)
  const status = wrapped.rpmParentResolution && wrapped.rpmParentResolution.status;
  const via = viaRow ? 'corrected-row' : status === 'EXACT' ? 'exact' : (wrapped.rpmParentResolution && wrapped.rpmParentResolution.reviewedParent ? 'reviewed' : 'legacy');
  return name ? { l1: e.unitLabel, l2: name, unitKey: e.unitKey, reason: e.reason, via } : null;
}

function keyIn(record, field, values) {
  return values.includes(String(record[field] ?? ''));
}
// match 규칙 하나: l2 이름이 같고, keyAny가 있으면 그 중 하나라도 맞고, keyNone이 있으면 하나도 맞지 않아야 한다.
// keyAllow: 그 칸에 값이 있으면 목록 안에 있어야 한다(값이 비어 있으면 통과). 중단원은 맞는데 유형 키가 다른 단원을 가리키는 문항을 거른다.
// allowlist: 문항 UID 허용 목록 파일(archive/tools/assessment-mock/allowlists/, 줄마다 UID<TAB>출처<TAB>근거). 키로 범위가 갈리지 않는 곳에서 사람이 직접 읽어 정한 문항만 들인다.
// 허용 목록 규칙은 중단원·유형 키를 보지 않고 UID만 본다(규칙에 l2가 있으면 그것도 맞아야 한다).
const allowCache = new Map();
function allowlistSet(name) {
  if (!allowCache.has(name)) {
    const text = fs.readFileSync(path.join(__dirname, 'allowlists', name), 'utf8');
    allowCache.set(name, new Set(text.split('\n').filter((l) => l.trim() && !l.startsWith('#')).map((l) => l.split('\t')[0].trim())));
  }
  return allowCache.get(name);
}
function ruleMatches(rule, record, l2Name) {
  if (rule.allowlist) {
    if (!allowlistSet(rule.allowlist).has(String(record.questionUid || ''))) return false;
    return !rule.l2 || rule.l2 === l2Name;
  }
  if (rule.l2 && rule.l2 !== l2Name) return false;
  if (rule.keyAllow) {
    for (const [field, values] of Object.entries(rule.keyAllow)) {
      const value = String(record[field] ?? '');
      if (value && !values.includes(value)) return false;
    }
  }
  if (rule.keyAny) {
    const hit = Object.entries(rule.keyAny).some(([field, values]) => keyIn(record, field, values));
    if (!hit) return false;
  }
  if (rule.keyNone) {
    const hit = Object.entries(rule.keyNone).some(([field, values]) => keyIn(record, field, values));
    if (hit) return false;
  }
  return true;
}
// 범위 정의(scope)에서 문항이 속한 묶음 번호. 어느 묶음에도 안 들어가면 -1.
function groupIndexOf(scope, record) {
  const found = middleL2Of(record, scope.gradeKey);
  let rule = null;
  const index = scope.groups.findIndex((group) => {
    rule = group.match.find((r) => ruleMatches(r, record, found ? found.l2 : null)) || null;
    return Boolean(rule);
  });
  if (index < 0) return { index: -1, l2: found, rule: null };
  // 허용 목록으로 들어온 문항은 중단원 판정이 없을 수 있다(그때는 중단원 이름 자리에 '(허용 목록)').
  return { index, l2: found || { l1: '', l2: '(허용 목록)', unitKey: '', reason: 'allowlist', via: 'allowlist' }, rule };
}

module.exports = { CATALOG_FILE, loadCatalogRecords, middleL2Of, groupIndexOf, ruleMatches };
