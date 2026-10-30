'use strict';
// Read-only report: consolidation candidates for Generated-only extension keys (EXT-*), for a LATER
// promotion / alias decision. It merges nothing and renames nothing; it only reads the registries,
// the derived extension index and the generated consumer index and prints markdown.
//   node archive/tools/report-archive2-extension-key-candidates.cjs [outputPath]
// Default output: docs/reports/archive2-extension-key-candidates-20261030.md
const fs = require('node:fs');
const path = require('node:path');
const Resolver = require('../archive2-key-resolver.js');
const ProblemBankMeta = require('../problem-bank-meta.js');

const root = path.resolve(__dirname, '..', '..');
const data = file => path.join(root, 'archive', 'data', file);
const readJson = file => JSON.parse(fs.readFileSync(data(file), 'utf8'));
const outputPath = path.resolve(process.argv[2] || path.join(root, 'docs/reports/archive2-extension-key-candidates-20261030.md'));
const REPORT_DATE = '2026-10-30';

const extensions = readJson('archive2-extension-keys.json');
const resolver = Resolver.create({
  taxonomy: readJson('meta-foundation/compiled/taxonomy_registry.json'),
  concepts: readJson('meta-foundation/compiled/concept_registry.json'),
  conditions: readJson('meta-foundation/compiled/condition_registry.json'),
  rpmCrosswalks: [readJson('meta-foundation/crosswalks/rpm-primary-v1.0/high1.json')],
  extensions,
});
const consumerIndex = readJson('generated-lite-consumer/v1/index.json');
const generatedRows = consumerIndex.records.map(row => ProblemBankMeta.projectGenerated(row, null, consumerIndex.userDisabledUids || []));

// Which generated items carry which extension key.
const carriedBy = new Map();
const inferredParent = new Map();
let rowsWithExtension = 0;
for (const row of generatedRows) {
  const described = resolver.describe(row);
  if (!described.hasExtension) continue;
  rowsWithExtension += 1;
  for (const item of described.items.filter(entry => entry.origin === 'extension')) {
    const set = carriedBy.get(item.key) || new Set();
    set.add(described.uid);
    carriedBy.set(item.key, set);
    if (!item.defined && item.parentLabel) inferredParent.set(item.key, item.parentLabel);
  }
}
const uses = key => carriedBy.get(key)?.size || 0;

// Keys on generated items that are in NEITHER the canonical registries NOR the extension namespace
// (older GEN_* / GEN-TPL-* / TPL_GD* ids and free-text labels). Shown as-is, without a badge.
const unregistered = new Map();
for (const row of generatedRows) {
  for (const item of resolver.describe(row).items) {
    if (item.origin !== 'unknown' || !['pt', 'tpl', 'cross', 'cond'].includes(item.kind)) continue;
    const entry = unregistered.get(item.key) || { kind: item.kind, fields: new Set(), uids: new Set() };
    entry.fields.add(item.field);
    entry.uids.add(row.uid);
    unregistered.set(item.key, entry);
  }
}

const cell = value => String(value ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const rel = file => String(file || '').replace(/^archive\/generated\/lite\/v1\/2022\/H1\//, '…/').replace(/^archive\/data\/meta-foundation\//, 'meta-foundation/');
const table = (headers, rows) => rows.length
  ? [`| ${headers.join(' | ')} |`, `| ${headers.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.map(cell).join(' | ')} |`)].join('\n')
  : '_none_';

const report = resolver.consolidation();
const keyList = resolver.extensionKeyList();
const byKind = {};
const byTier = {};
for (const node of keyList) {
  byKind[node.kind] = (byKind[node.kind] || 0) + 1;
  byTier[node.tier] = (byTier[node.tier] || 0) + 1;
}
const definedKeys = new Set(keyList.map(node => node.key));
const undefinedCarried = [...carriedBy.keys()].filter(key => !definedKeys.has(key)).sort();
const unusedDefined = keyList.filter(node => !uses(node.key));
const definitionByKey = new Map(extensions.definitions.map(row => [row.key, row]));

// Declared canonical comparators that are registry keys (CC_/COND_/PT_/TPL_): alias candidates.
const declaredAlias = [];
for (const definition of extensions.definitions) {
  const refs = (definition.parentRefs?.comparators || []).filter(value => /^(?:CC|COND|PT|TPL)_[A-Z0-9_]+$/.test(value));
  if (refs.length) declaredAlias.push([definition.key, definition.kind, definition.label || '', refs.join(', '), rel(definition.file)]);
}

const lines = [];
const out = text => lines.push(text);
out(`# Archive 2.0 확장 키 통합 후보 보고서 (${REPORT_DATE})`);
out('');
out('S14b(사용자 지시 2026-10-29)의 부산물입니다. 정식 키와 Generated 전용 확장 키(EXT-*)를 사용 계층에서 한 트리로 보여 주기 위해 읽기 전용 해석기');
out('(`archive/archive2-key-resolver.js`)를 만들면서 얻은 **통합 후보 목록**이며, 나중에 승격·alias 결정을 내릴 때 참고하는 자료입니다.');
out('이 보고서는 어떤 키도 병합·개명·삭제하지 않았고, 정식 레지스트리와 RPM LOCKED 값, 원본 기출 문항도 건드리지 않았습니다.');
out('재생성: `node archive/tools/report-archive2-extension-key-candidates.cjs`');
out('');
out('## 0. 읽는 법');
out('');
out('* 확장 키 정의는 `archive/generated/lite/v1/**/extension-meta|extension-l4|extension-l3/*.json`(및 있을 경우 `archive/data/meta-foundation/extensions/**`)에서 추출한 파생 색인');
out('  `archive/data/archive2-extension-keys.json`에서 읽습니다(원본 파일은 읽기만 함). 부모는 정의가 스스로 밝힌 값(RPM 레코드 id, 확장 L3 키, L3 이름)만 사용하며, 이름 일치는 같은 교육과정 안에서만 인정합니다(2015↔2022 변환 없음).');
out('* 부모 연결 상태: `RECORD`(RPM 레코드 id로 확정), `EXT_PARENT`(확장 L3 아래), `LABEL`/`LABEL_UNIT`(L3 이름이 유일하게 일치 / 표준단원으로 확정), `LABEL_AMBIGUOUS`(같은 이름이 여러 단원), `LABEL_UNRESOLVED`(현재 RPM 활성 crosswalk에 없는 이름), `CODE_ONLY`(L3 코드만 있음), `EXT_PARENT_NO_ANCHOR`(부모 확장 L3가 정식 부모를 못 찾음), `RECORD_UNKNOWN`, `NONE`.');
out('* 사용 현황은 `archive/data/generated-lite-consumer/v1/index.json`의 생성 문항 행이 실제로 들고 있는 키를 센 값입니다(원본 기출 문항에는 확장 키가 없음을 테스트가 보증).');
out('* 중복 판정은 휴리스틱입니다: 정규화한 이름(NFKC·공백/기호 제거) 일치, 슬롯 접두어(`B3 `) 제거 후 일치, 같은 부모 안에서 bigram Dice ≥ 0.80. **후보일 뿐이며 의미 동일 여부는 사람이 판단합니다.**');
out('');
out('## 1. 요약');
out('');
out(table(['항목', '값'], [
  ['정식 키(PT·TPL·연결 개념·조건) 수', resolver.stats.canonicalKeys],
  ['RPM L3 노드(활성 crosswalk 기준)', resolver.stats.rpmL3Nodes],
  ['확장 키 정의 수', resolver.stats.extensionKeys],
  ['종류별', Object.entries(byKind).sort().map(([k, v]) => `${k}=${v}`).join(', ')],
  ['상태 구분(tier)별', Object.entries(byTier).sort().map(([k, v]) => `${k}=${v}`).join(', ')],
  ['부모 연결됨', resolver.stats.parentLinked],
  ['부모 없음/확인 불가(§2)', report.orphans.length],
  ['부모 후보가 여러 개(§2b)', report.ambiguous.length],
  ['정식 키와 같은 이름(§4)', report.duplicatesCanonical.length],
  ['확장끼리 같은 이름 / 슬롯 접두어만 다름 / 비슷한 이름(§5)', `${report.duplicatesExtension.length} / ${report.sameAfterSlot.length} / ${report.near.length}`],
  ['정의 없이 문항만 들고 있는 확장 키(§3)', undefinedCarried.length],
  ['정식·확장 어느 쪽에도 없는 키를 가진 생성 문항 키 수(§3b)', unregistered.size],
  ['정의는 있으나 어떤 생성 문항도 쓰지 않는 확장 키', unusedDefined.length],
  ['확장 키를 가진 생성 문항 / 전체 생성 문항', `${rowsWithExtension} / ${generatedRows.length}`],
  ['계승(superseded)으로 표시된 키', report.superseded.length],
]));
out('');
out('## 2. 부모가 없는(또는 확인되지 않는) 확장 키');
out('');
out('“부모 필수” 규칙 기준으로 정식 RPM L3에 연결하지 못한 키입니다. 해결은 (a) 정의 파일에 부모 RPM 레코드 id를 기록하거나 (b) 현재 RPM에 없는 L3라면 정식 L3 신설·승격 판단이 필요합니다.');
out('');
out(table(['키', '종류', '이름', '상태', '선언된 부모 단서', '사용 문항', '파일'], report.orphans.map(row => [
  row.key, row.kind, row.label, row.status,
  [(row.parentRefs.l3Labels || []).length ? `L3 이름: ${row.parentRefs.l3Labels.join(' / ')}` : '', (row.parentRefs.l3Codes || []).length ? `코드: ${row.parentRefs.l3Codes.join(' / ')}` : '',
    (row.parentRefs.extParents || []).length ? `확장 부모: ${row.parentRefs.extParents.join(' / ')}` : '', (row.parentRefs.recordIds || []).length ? `레코드: ${row.parentRefs.recordIds.join(' / ')}` : '']
    .filter(Boolean).join('; ') || '(없음)',
  uses(row.key), rel(row.file),
])));
out('');
out('### 2b. 같은 L3 이름이 여러 단원에 있어 자동으로 하나를 고르지 않은 키');
out('');
out(table(['키', '종류', '이름', '후보 L3', '파일'], report.ambiguous.map(row => [row.key, row.kind, row.label, row.candidates.join(' ‖ '), rel(row.file)])));
out('');
out('## 3. 문항은 들고 있지만 어떤 확장 레지스트리에도 정의가 없는 키');
out('');
out('문항 메타(`crossConceptKeys`/`conditionKeys`/`rpmL4`)에만 있고 `extension-meta`·`extension-l4`에 정의가 없는 키입니다. 해석기는 이 키도 `확장`으로 표시하고, 상위 개념은 문항 자신의 RPM 레코드에서만 추정(“문항 기록”)합니다. 정의 파일 보완 또는 정식 키 재사용 여부 결정이 필요합니다.');
out('');
out(table(['키', '종류(접두어 기준)', '사용 문항', '문항 기록상 상위 L3'], undefinedCarried.map(key => [
  key, /-COND-/.test(key) ? 'cond' : /-CC-|-CROSS-/.test(key) ? 'cross' : /-TPL-/.test(key) ? 'tpl' : 'l4(추정)', uses(key), inferredParent.get(key) || '(문항에도 RPM 레코드 없음)',
])));
out('');
out('### 3b. 정식 레지스트리에도 확장 네임스페이스(EXT-)에도 없는 키를 가진 생성 문항');
out('');
out('`GEN_PT_*`·`GEN_TPL_*`·`GEN_CC_*`·`GEN_COND_*`, `GEN-TPL-*`, `TPL_GD*`, 한글 자유 문구처럼 EXT 접두어가 없는 키입니다. 해석기는 이 값을 배지 없이 그대로 보여 줍니다(임의로 `확장`으로 간주하지 않음). 정식 키로 대체/alias할지, EXT 네임스페이스로 옮길지는 후속 결정 사항입니다.');
out('');
out(table(['키', '종류', '필드', '사용 문항'], [...unregistered.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([key, entry]) => [key, entry.kind, [...entry.fields].sort().join(', '), entry.uids.size])));
out('');
out('## 4. 정식 키와 같은 이름(또는 alias)을 가진 확장 키');
out('');
out('정식 레지스트리(`taxonomy_registry`/`concept_registry`/`condition_registry`)의 같은 종류 키와 이름 또는 alias가 정규화 후 일치합니다. “alias, not rename” 규칙에 따라 정식 키로의 alias 연결 후보입니다(자동 연결하지 않음).');
out('');
out(table(['확장 키', '종류', '이름', '정식 키', '정식 이름', '확장 키 상태', '파일'], report.duplicatesCanonical.map(row => [
  row.key, row.kind, row.label, row.canonicalKey, row.canonicalLabel, resolver.lookup(row.key)?.status || '', rel(row.file),
])));
out('');
out('### 4b. 정식 키 id를 비교 대상으로 직접 적은 확장 키');
out('');
out(table(['확장 키', '종류', '이름', '비교 대상 정식 키', '파일'], declaredAlias));
out('');
out('## 5. 확장 키끼리 겹치는 후보');
out('');
out('### 5a. 이름이 정규화 후 완전히 같은 서로 다른 키');
out('');
out(table(['종류', '이름', '키', '파일'], report.duplicatesExtension.map(row => [row.kind, row.label, row.keys.join(', '), row.files.map(rel).join(', ')])));
out('');
out('### 5b. 슬롯 접두어(`B3 ` 등)를 떼면 이름이 같은 키');
out('');
out(table(['종류', '이름(접두어 제외)', '키', '파일'], report.sameAfterSlot.map(row => [row.kind, row.label, row.keys.join(', '), row.files.map(rel).join(', ')])));
out('');
out('### 5c. 같은 상위 L3 안에서 이름이 비슷한 키(Dice ≥ 0.80)');
out('');
out(table(['종류', '키', '이름', '유사도', '상위 L3'], report.near.map(row => [row.kind, row.keys.join(' ↔ '), row.labels.join(' ↔ '), row.score, row.anchor])));
out('');
out('## 6. 계승·후보 상태의 확장 키');
out('');
out('`tier`는 상태 문자열에서 읽은 표시용 구분이며 사용 가능 여부를 가르지 않습니다(사용자 정책: 검수 상태로 사용을 제한하지 않음).');
out('');
out('### 6a. 계승(superseded)으로 기록된 키');
out('');
out(table(['키', '종류', '이름', '상태', '사용 문항', '파일'], report.superseded.map(row => [row.key, row.kind, row.label, row.status, uses(row.key), rel(row.file)])));
out('');
out('### 6b. 사용 중인 후보(candidate) 단계 키');
out('');
out(table(['키', '종류', '이름', '상태', '사용 문항', '파일'], keyList.filter(node => node.tier === 'candidate' && uses(node.key))
  .map(node => [node.key, node.kind, node.label, node.status, uses(node.key), rel(definitionByKey.get(node.key)?.file)])));
out('');
out('## 7. 승격 검토용 사용량 상위 확장 키');
out('');
out('부모가 연결된 확장 키 중 생성 문항에서 많이 쓰이는 순서입니다(승격 우선순위의 참고값일 뿐 판단이 아님).');
out('');
out(table(['키', '종류', '이름', '상위 L3', '부모 상태', '사용 문항'], keyList
  .filter(node => node.anchor && uses(node.key))
  .sort((a, b) => uses(b.key) - uses(a.key) || a.key.localeCompare(b.key)).slice(0, 30)
  .map(node => [node.key, node.kind, node.label, node.anchor.label, node.parentStatus, uses(node.key)])));
out('');
out('## 8. 정의는 있으나 사용 중인 생성 문항이 없는 키');
out('');
out(`${unusedDefined.length}개(후보 단계 포함). 문항이 아직 등록되지 않았거나 정의만 먼저 기록된 키입니다. 목록은 \`archive/data/archive2-extension-keys.json\`과 위 규칙으로 다시 계산할 수 있어 여기서는 종류별 개수만 적습니다.`);
out('');
const unusedByKind = {};
for (const node of unusedDefined) unusedByKind[node.kind] = (unusedByKind[node.kind] || 0) + 1;
out(table(['종류', '미사용 정의 수'], Object.entries(unusedByKind).sort().map(([k, v]) => [k, v])));
out('');
out('## 9. 한계');
out('');
out('* RPM 부모 해석은 현재 고등 1학년 활성 crosswalk(`crosswalks/rpm-primary-v1.0/high1.json`)만 사용합니다. 다른 학년의 확장 키가 생기면 해석기가 레코드 id 접두어로 해당 crosswalk를 추가로 읽습니다(코드 변경 없음).');
out('* 일부 정의(예: GD25 Q15)는 라벨 없이 키 목록만 있어 이름 대신 키가 표시됩니다.');
out('* 문항 표시용 `rpmL4`가 `KEY|이름` 형태인 행은 이름을 정의 라벨 대신 보조로 사용합니다.');
out('* 이 목록은 파생 색인 생성 시점의 스냅샷입니다. 정의 파일이 늘면 `node archive/tools/build-archive2-extension-keys.mjs`(색인)와 이 보고서 생성기를 다시 실행합니다.');
out('');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${lines.join('\n')}\n`);
console.log(`wrote ${path.relative(root, outputPath)} (${lines.length} lines)`);
