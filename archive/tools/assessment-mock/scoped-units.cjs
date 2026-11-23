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
  const childKey = tree.childKeyOf(e.unitKey, wrapped);
  if (!childKey || childKey === Tree.NONE_KEY) return null;
  const name = tree.childName(e.unitKey, childKey);
  // 중단원을 정한 길: exact(정본 판정 EXACT), reviewed(문항별 중단원 지정표), legacy(옛 소단원 키 매핑)
  const status = wrapped.rpmParentResolution && wrapped.rpmParentResolution.status;
  const via = status === 'EXACT' ? 'exact' : (wrapped.rpmParentResolution && wrapped.rpmParentResolution.reviewedParent ? 'reviewed' : 'legacy');
  return name ? { l1: e.unitLabel, l2: name, unitKey: e.unitKey, reason: e.reason, via } : null;
}

function keyIn(record, field, values) {
  return values.includes(String(record[field] ?? ''));
}
// match 규칙 하나: l2 이름이 같고, keyAny가 있으면 그 중 하나라도 맞고, keyNone이 있으면 하나도 맞지 않아야 한다.
// keyAllow: 그 칸에 값이 있으면 목록 안에 있어야 한다(값이 비어 있으면 통과). 중단원은 맞는데 유형 키가 다른 단원을 가리키는 문항을 거른다.
function ruleMatches(rule, record, l2Name) {
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
  const l2 = middleL2Of(record, scope.gradeKey);
  if (!l2) return { index: -1, l2: null, rule: null };
  let rule = null;
  const index = scope.groups.findIndex((group) => {
    rule = group.match.find((r) => ruleMatches(r, record, l2.l2)) || null;
    return Boolean(rule);
  });
  return { index, l2, rule: index < 0 ? null : rule };
}

module.exports = { CATALOG_FILE, loadCatalogRecords, middleL2Of, groupIndexOf, ruleMatches };
