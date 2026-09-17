import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging');
const sourcePath = path.join(base, 'source_manifest.json');
const diffPath = path.join(base, 'mother-diff-manifest.json');
const outputPath = path.join(base, 'mother-final-candidate.json');
const sourceManifest = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const diffManifest = JSON.parse(fs.readFileSync(diffPath, 'utf8'));
const sourceRecords = sourceManifest.records;

function read(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function packetEntries(dirName) {
  const dir = path.join(base, dirName);
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir).filter(value => value.endsWith('.json'))) {
    const file = path.join(dir, name);
    const packet = read(file);
    const records = Array.isArray(packet.records) ? packet.records : Number.isInteger(Number(packet.recordIndex)) ? [packet] : [];
    for (const record of records) out.push({ file: path.relative(root, file).replaceAll('\\', '/'), record });
  }
  return out;
}
function freezeLatest(dirs) {
  const map = new Map();
  for (const dir of dirs) for (const entry of packetEntries(dir)) {
    const uid = String(entry.record.manifestUid || entry.record.source?.manifestUid || '');
    if (uid) map.set(uid, entry);
  }
  return map;
}
function label(value) {
  if (!value || typeof value !== 'object') return String(value ?? '');
  return String(value.label ?? value.name ?? value.code ?? value.id ?? '');
}
function canonical(record) {
  const value = record?.canonical || {};
  return { L1: label(value.L1 || record?.L1), L2: label(value.L2 || record?.L2), L3: label(value.L3 || record?.L3), L4: label(value.L4 || record?.L4) };
}
function status(record) {
  const raw = String(record?.status || record?.tagStatus || record?.reviewStatus || '');
  if (raw === 'B_CHECKED') {
    const value = String(record?.tagStatus || record?.reviewStatus || 'DIRECT_TAGGED');
    return ['PASS', 'reviewed_pass', 'B_CHECKED'].includes(value) ? 'DIRECT_TAGGED' : value;
  }
  return ['PASS', 'reviewed_pass'].includes(raw) ? 'DIRECT_TAGGED' : raw;
}
function normalized(entry) {
  const record = entry?.record || {};
  return {
    canonical: canonical(record),
    primaryConcept: record.primaryConcept ?? null,
    secondaryConceptKeys: (Array.isArray(record.secondaryConceptKeys) ? record.secondaryConceptKeys : []).map(value => String(value).split('|').at(-1).trim()).sort(),
    difficultyBucket: record.difficultyBucket ?? null,
    status: status(record)
  };
}
function finalStatus(value) {
  return ['FROZEN', 'ACCEPTED', ''].includes(value) ? 'DIRECT_TAGGED' : value;
}
function canonicalKey(labels) {
  return [labels.L1, labels.L2, labels.L3, labels.L4].map(value => String(value || '')).join('|');
}

const masterPath = path.join(root, 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const master = read(masterPath);
const masterKeys = new Set();
for (const record of master.records || []) {
  for (const concept of record.concepts || []) {
    for (const problemType of concept.problemTypes || []) {
      masterKeys.add(canonicalKey({
        L1: record.majorUnit,
        L2: record.midUnit,
        L3: concept.concept,
        L4: problemType.problemType,
      }));
    }
  }
}

// These are Mother-level canonical resolutions for raw paths whose wording is
// not itself an exact RPM v1.0 master path. They do not change the frozen A/B
// packets or the original Mother pick; the raw path remains in final.canonicalRaw.
const canonicalOverrides = {
  10: { state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: 'The source is a reflection/shortest-path distance problem, but the master has no exact 경로합 최솟값 leaf.' },
  26: { path: ['도형의 방정식', '원의 방정식', '원의 방정식', '일반형에서 원 찾기'], reason: 'The equation is in general form and the source asks when it represents a circle.' },
  234: { path: ['방정식과 부등식', '여러 가지 부등식', '이차부등식', '근의 위치와 해'], reason: 'The source counts integer solutions of a system of quadratic inequalities through the root intervals; the master has no separate quadratic-integer leaf.' },
  404: { path: ['방정식과 부등식', '이차방정식', '근과 계수의 관계', '근의 합·곱'], reason: 'The source constrains the signs and relative sizes of the two roots through coefficient relations.' },
  1138: { state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: 'The source is a solid-geometry sphere-volume problem and the HIGH1 canonical master has no exact solid-geometry leaf.' },
  1413: { path: ['함수', '무리함수', '무리함수의 활용', '무리함수의 역함수'], reason: 'The source directly asks for the inverse of a radical function and its domain.' },
  1461: { path: ['함수', '무리함수', '무리함수의 활용', '무리함수의 역함수'], reason: 'The source determines the inverse of a radical function.' },
  1490: { path: ['함수', '함수', '역함수', '그래프 대칭'], reason: 'The source uses the inverse-graph symmetry relation (g∘f)(x)=x.' },
  1634: { path: ['함수', '무리함수', '무리함수의 활용', '무리함수의 역함수'], reason: 'The source reconstructs a radical-function inverse after using a rational-function condition.' },
  1550: { path: ['함수', '함수', '역함수', '그래프 대칭'], reason: 'A point on the inverse graph is reflected to the original graph.' },
  1853: { path: ['방정식과 부등식', '여러 가지 부등식', '이차부등식', '근의 위치와 해'], reason: 'The source asks for the largest integer solution of a quadratic inequality; the master has no separate quadratic-integer leaf.' },
  1907: { path: ['집합과 명제', '집합의 뜻과 포함 관계', '집합과 원소', '원소나열법·조건제시법'], reason: 'The source tests membership, empty-set, and element notation.' },
  2020: { path: ['함수', '함수', '역함수', '역함수 구하기'], reason: 'The decisive requested comparison is the inverse of a composition and the composition of inverses.' },
  2185: { path: ['도형의 방정식', '원의 방정식', '원의 방정식', '중심과 반지름'], reason: 'The source uses the circle equation to enumerate lattice points; the exact master circle leaf available is center/radius.' },
  2251: { path: ['방정식과 부등식', '이차방정식과 이차함수', '직선과 포물선', '교점 개수'], reason: 'The source determines two intersections of a transformed parabola and line and then uses their midpoint.' },
  2268: { path: ['방정식과 부등식', '이차방정식과 이차함수', '직선과 포물선', '접선 조건'], reason: 'The extrema of the translation parameter occur at the tangent boundary with the parabola.' },
  2303: { path: ['집합과 명제', '집합의 뜻과 포함 관계', '부분집합', '부분집합 판정'], reason: 'The source is a direct element/subset membership judgment.' },
  2322: { path: ['도형의 방정식', '도형의 이동', '대칭이동', '직선에 대한 대칭'], reason: 'The source reflects a circle across a recovered line.' },
  2323: { path: ['집합과 명제', '명제', '증명', '절대부등식 증명'], reason: 'The source is a direct positive-variable AM-GM-style inequality proof.' },
  2325: { path: ['도형의 방정식', '도형의 이동', '평행이동', '점·직선의 이동'], reason: 'The source directly translates a point along the coordinate axes.' },
  2327: { path: ['집합과 명제', '집합의 뜻과 포함 관계', '집합의 포함 관계', '두 집합의 포함'], reason: 'The source asks for a relation displayed by a Venn diagram.' },
  2329: { path: ['집합과 명제', '집합의 뜻과 포함 관계', '집합과 원소', '원소나열법·조건제시법'], reason: 'The source tests whether a description defines a set through element membership.' },
  2331: { path: ['집합과 명제', '명제', '역·이·대우', '명제 변환'], reason: 'The source asks for the always-true consequence obtained from a proposition transformation.' },
  2351: { state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: 'The source is an absolute-value inequality with integer counting; the master has no exact absolute-value solution-range leaf.' },
  2396: { path: ['도형의 방정식', '원의 방정식', '원의 방정식', '일반형에서 원 찾기'], reason: 'The source reconstructs the circle equation from the diameter endpoints.' },
  2408: { path: ['방정식과 부등식', '이차방정식', '근과 계수의 관계', '근의 합·곱'], reason: 'The source defines two quadratic-root sets and optimizes their union condition; coefficient/root relations are the exact master fit.' },
  2428: { path: ['도형의 방정식', '원의 방정식', '원과 직선', '교점 개수'], reason: 'The source uses the two intersections of a circle and a line and a product of their distances from the origin.' },
  2436: { state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: '흡수법칙 is a valid set identity but is not an exact problemType leaf in the current canonical master.' },
  2475: { path: ['도형의 방정식', '원의 방정식', '두 원', '두 원의 위치 관계'], reason: 'The source counts intersections of the given circle with concentric integer-radius circles.' },
  2481: { path: ['도형의 방정식', '원의 방정식', '원의 방정식', '일반형에서 원 찾기'], reason: 'The source asks for the parameter range for a general equation to represent a circle.' },
  2497: { path: ['도형의 방정식', '원의 방정식', '원의 방정식', '중심과 반지름'], reason: 'The source constructs circles tangent to both coordinate axes by determining their centers and radii.' },
  1703: { path: ['함수', '함수', '역함수', '그래프 대칭'], reason: 'The source intersects a line with the inverse graph and uses the reflection relation.' },
  1826: { path: ['함수', '함수', '역함수', '그래프 대칭'], reason: 'The source uses the intersection of a radical graph and its inverse graph.' },
};

function pathLabels(values) {
  return { L1: values[0], L2: values[1], L3: values[2], L4: values[3] };
}

function resolveCanonical(recordIndex, value) {
  const raw = value.canonical;
  const override = canonicalOverrides[recordIndex];
  if (override?.state) return { canonical: raw, state: override.state, reason: override.reason };
  if (override?.path) {
    const canonical = pathLabels(override.path);
    if (!masterKeys.has(canonicalKey(canonical))) return { canonical: raw, state: 'CANONICAL_PATH_UNMATCHED', reason: `Override path is not in canonical master: ${canonicalKey(canonical)}` };
    return { canonical, state: 'CANONICAL_PATH_MATCH', reason: override.reason };
  }

  const labels = { ...raw };
  let [l1, l2, l3, l4] = [labels.L1, labels.L2, labels.L3, labels.L4];
  if (l1 === '방정식과 이차함수') l1 = '방정식과 부등식';
  if (l1 === '수와 식') l1 = '실수와 그 연산';
  if (l1 === '다항식' && l2 === '다항식의 나눗셈' && l3 === '나머지정리') l2 = '항등식과 나머지정리';
  if (l1 === '다항식' && l2 === '다항식의 나눗셈' && l3 === '다항식의 나눗셈') l2 = '다항식의 연산';
  if (l1 === '함수' && l2 === '무리함수') {
    if (l3 === '무리함수의 정의역과 치역') l3 = '정의역과 치역';
    else if (l3 === '무리함수의 교점') l3 = '무리함수의 활용';
    else if (l3 === '무리함수의 그래프' && ['그래프 위치', '정의역 조건'].includes(l4)) l3 = '정의역과 치역';
    else if (l3 === '무리함수의 그래프' && l4 === '식 결정') l3 = '무리함수의 활용';
    else if (l3 === '무리함수의 역함수' && l4 === '무리함수의 역함수') l3 = '무리함수의 활용';
  }
  if (l1 === '함수' && l2 === '유리함수' && l3 === '유리함수의 활용' && l4 === '유리함수의 교점') l4 = '유리함수와 그래프의 교점';
  if (l1 === '함수' && l2 === '유리함수' && l3 === '유리함수와 그래프의 교점') l3 = '유리함수의 활용';
  if (l1 === '함수' && l2 === '유리함수' && l3 === '합성함수') l2 = '함수';
  if (l1 === '함수' && l2 === '함수' && l3 === '합성함수' && l4 === '역함수 구하기') { l3 = '역함수'; }
  if (l1 === '도형의 방정식' && l2 === '직선의 방정식' && l3 === '선분의 내분·외분') l2 = '평면좌표';
  if (l1 === '도형의 방정식' && l2 === '원의 방정식' && l3 === '도형의 이동') { l2 = '도형의 이동'; l3 = '대칭이동'; }
  if (l1 === '경우의 수' && l2 === '순열과 조합' && ['조합의 활용', '조합의 뜻과 계산'].includes(l3)) l2 = '조합';
  if (l1 === '경우의 수' && l2 === '순열과 조합' && l3 === '순열' && l4 === '특정 조건 배열') l2 = '경우의 수와 순열';
  if (l1 === '경우의 수' && l2 === '조합' && l3 === '조합의 활용' && l4 === '선택 후 배치') l3 = '분할·분배';
  if (l1 === '경우의 수' && l2 === '경우의 수와 순열' && l3 === '조합') l2 = '순열과 조합';
  if (l1 === '방정식과 부등식' && l2 === '복소수' && l3 === '복소수 근') l2 = '이차방정식';
  if (l1 === '방정식과 부등식' && l2 === '복소수' && l3 === '복소수의 연산' && l4 === '복소수 조건') l3 = 'i의 거듭제곱';
  if (l1 === '방정식과 부등식' && l2 === '여러 가지 부등식' && l3 === '이차부등식' && l4 === '계수 조건') l3 = '부등식의 활용';
  if (l1 === '방정식과 부등식' && l2 === '방정식과 부등식' && l3 === '최대·최소') l2 = '이차방정식과 이차함수';
  if (l1 === '방정식과 부등식' && l2 === '방정식과 이차함수') l2 = '이차방정식과 이차함수';
  if (l1 === '집합과 명제' && l2 === '명제' && ['명제 변환', '명제와 조건'].includes(l3) && l4 === '명제 변환') l3 = '역·이·대우';
  if (l1 === '집합과 명제' && l2 === '명제' && l3 === '명제 변환' && l4 === '대우를 이용한 증명') l3 = '역·이·대우';
  if (l1 === '집합과 명제' && l2 === '명제' && l3 === '증명' && l4 === '대우를 이용한 증명') l3 = '역·이·대우';
  if (l1 === '집합과 명제' && l2 === '명제' && l3 === '필요조건·충분조건' && l4 === '명제 변환') l3 = '역·이·대우';
  if (l1 === '집합과 명제' && l2 === '집합의 연산' && l3 === '집합의 연산' && l4 === '교집합과 합집합') { l3 = '교집합과 합집합'; l4 = '집합 연산'; }
  if (l1 === '집합과 명제' && l2 === '집합의 뜻과 포함 관계' && l3 === '집합의 뜻과 포함 관계') l3 = l4 === '집합과 원소' ? '집합과 원소' : '집합의 포함 관계';
  if (l1 === '함수' && l2 === '함수' && l3 === '함수' && l4 === '함수의 뜻') { l3 = '함수의 뜻'; l4 = '대응과 함수'; }
  if (l1 === '함수' && l2 === '함수' && l3 === '함수의 성질' && l4 === '함수의 성질') l4 = '일대일함수';
  if (l1 === '도형의 방정식' && l2 === '평면좌표' && l3 === '점과 직선 사이의 거리') l2 = '직선의 방정식';
  if (l1 === '도형의 방정식' && l2 === '직선의 방정식' && l3 === '도형의 넓이·최소거리') l3 = '점과 직선 사이의 거리';
  if (l1 === '도형의 방정식' && l2 === '도형의 이동' && l3 === '평행이동' && l4 === '조건으로 원래 도형 찾기') l3 = '이동의 합성';
  if (l1 === '집합과 명제' && l2 === '명제' && l3 === '명제 변환' && l4 === '조건 관계') l3 = '필요조건·충분조건';
  if (l1 === '집합과 명제' && l2 === '집합의 연산' && l3 === '교집합과 합집합' && l4 === '복합 연산') l3 = '집합의 연산법칙';
  if (l1 === '집합과 명제' && l2 === '집합의 연산' && l3 === '집합의 포함 관계') l2 = '집합의 뜻과 포함 관계';
  if (l1 === '도형의 방정식' && l2 === '평면좌표' && l3 === '도형의 넓이·최소거리') { l2 = '직선의 방정식'; l3 = '점과 직선 사이의 거리'; }
  if (l1 === '방정식과 부등식' && l2 === '이차방정식과 이차함수' && l3 === '그래프와 근' && l4 === '교점 개수') l3 = '직선과 포물선';
  if (l1 === '경우의 수' && l2 === '경우의 수와 순열' && l3 === '순열' && l4 === '선택 후 배치') { l2 = '조합'; l3 = '분할·분배'; }
  if (l1 === '집합과 명제' && l2 === '명제' && l3 === '명제의 참·거짓') l3 = '명제와 조건';
  if (l1 === '함수' && l2 === '함수' && l3 === '일대일함수와 일대일대응' && l4 === '일대일대응') { l3 = '함수의 성질'; l4 = '일대일함수'; }
  if (l1 === '실수와 그 연산' && l2 === '무리식') l2 = '근호를 포함한 식의 계산';

  const canonical = { L1: l1, L2: l2, L3: l3, L4: l4 };
  if (masterKeys.has(canonicalKey(canonical))) return { canonical, state: 'CANONICAL_PATH_MATCH', reason: 'Mother canonical alias normalization matched the exact RPM v1.0 master path.' };
  if (Object.values(raw).some(labelValue => ['UNKNOWN', 'CANONICAL_NO_FIT'].includes(labelValue))) return { canonical: raw, state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: 'The selected Mother value explicitly carries UNKNOWN/CANONICAL_NO_FIT.' };
  if (['HOLD', 'CONFLICT', 'EVIDENCE_INSUFFICIENT', 'AMBIGUOUS_PRIMARY', 'FOUNDATION_DEFECT_CANDIDATE', 'SOURCE_DEFECT_CANDIDATE'].includes(value.status)) return { canonical: raw, state: 'EXPLICIT_NO_FIT_OR_UNKNOWN', reason: `The selected Mother status is ${value.status}.` };
  return { canonical: raw, state: 'CANONICAL_PATH_UNMATCHED', reason: `No exact canonical master path or Mother override for ${canonicalKey(raw)}.` };
}

const aMap = freezeLatest(['a-full', 'a-full-repair']);
const bMap = freezeLatest(['b-full', 'b-full-repair']);
const diffByIndex = new Map(diffManifest.disagreements.map(record => [record.recordIndex, record]));
const motherDir = path.join(base, 'mother');
const motherByIndex = new Map();
for (const name of fs.readdirSync(motherDir).filter(value => value.startsWith('decisions-') || value.startsWith('picks-'))) {
  const packet = read(path.join(motherDir, name));
  for (const record of packet.records || []) motherByIndex.set(Number(record.recordIndex), { ...record, decision: record.decision || record.pick, ledgerFile: `archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/mother/${name}` });
}
const finalRecords = [];
const errors = [];
const decisionCounts = {};
const statusCounts = {};
const canonicalCounts = {};

for (let index = 0; index < sourceRecords.length; index++) {
  const source = sourceRecords[index];
  const recordIndex = index + 1;
  const uid = String(source.manifestUid);
  const a = aMap.get(uid);
  const b = bMap.get(uid);
  if (!a || !b) { errors.push(`PACKET_MISSING:${recordIndex}`); continue; }
  const av = normalized(a);
  const bv = normalized(b);
  const diff = diffByIndex.get(recordIndex);
  const mother = motherByIndex.get(recordIndex);
  if (diff && !mother) errors.push(`MOTHER_MISSING:${recordIndex}`);
  const abEqual = !diff;
  let finalValue;
  let decision;
  let directRead = false;
  let reason;
  let ledgerFile = null;
  if (mother?.canonical && mother.canonical.L1 !== undefined) {
    finalValue = {
      canonical: { L1: String(mother.canonical.L1), L2: String(mother.canonical.L2), L3: String(mother.canonical.L3), L4: String(mother.canonical.L4) },
      primaryConcept: mother.primaryConcept ?? null,
      secondaryConceptKeys: Array.isArray(mother.secondaryConceptKeys) ? mother.secondaryConceptKeys : [],
      difficultyBucket: mother.difficultyBucket ?? null,
      status: mother.status || 'DIRECT_TAGGED'
    };
    decision = mother.decision;
    directRead = true;
    reason = mother.reason || null;
    ledgerFile = mother.ledgerFile;
  } else {
    const selected = mother?.decision === 'B' ? b : a;
    finalValue = { ...normalized(selected), status: finalStatus(normalized(selected).status) };
    decision = mother?.decision || (abEqual ? 'AB_EQUAL_AUTO' : null);
    directRead = Boolean(mother);
    reason = mother?.reason || (abEqual ? 'A/B normalized fields are equal; common value selected for final candidate.' : null);
    ledgerFile = mother?.ledgerFile || null;
  }
  if (!decision) errors.push(`DECISION_MISSING:${recordIndex}`);
  const canonicalRaw = { ...finalValue.canonical };
  const canonicalResolution = resolveCanonical(recordIndex, finalValue);
  const canonicalState = canonicalResolution.state;
  if (canonicalState === 'CANONICAL_PATH_UNMATCHED') errors.push(`CANONICAL_PATH_UNMATCHED:${recordIndex}`);
  if (!finalValue.status) errors.push(`FINAL_STATUS_MISSING:${recordIndex}`);
  decisionCounts[decision || 'UNSET'] = (decisionCounts[decision || 'UNSET'] || 0) + 1;
  statusCounts[finalValue.status || 'UNSET'] = (statusCounts[finalValue.status || 'UNSET'] || 0) + 1;
  canonicalCounts[canonicalState] = (canonicalCounts[canonicalState] || 0) + 1;
  finalRecords.push({
    recordIndex,
    manifestUid: uid,
    source: { sourceArchiveFile: source.sourceArchiveFile, sourceOrdinal: source.sourceOrdinal, curriculumKey: source.curriculumKey, sourceFingerprint: source.sourceFingerprint, contentFingerprint: source.contentFingerprint },
    a: { packetFile: a.file, value: av },
    b: { packetFile: b.file, value: bv },
    comparison: { abEqual, differingFields: diff?.differingFields || [] },
    mother: { decision, directRead, ledgerFile, reason },
    final: { ...finalValue, canonical: canonicalResolution.canonical, canonicalRaw, canonicalState, canonicalResolution: canonicalResolution.reason }
  });
}

const recordIds = new Set(finalRecords.map(record => record.recordIndex));
if (finalRecords.length !== sourceRecords.length) errors.push(`FINAL_COUNT:${finalRecords.length}/${sourceRecords.length}`);
if (recordIds.size !== sourceRecords.length) errors.push(`FINAL_DUPLICATE:${finalRecords.length - recordIds.size}`);
const result = {
  schemaVersion: 'h1-direct-tagging-mother-final-candidate-v1',
  scope: 'HIGH1_ONLY',
  sourceManifestPath: 'archive/_generated/intelligence/phase3/metadata-foundation-h1-direct-tagging/source_manifest.json',
  expectedCount: sourceRecords.length,
  aCount: aMap.size,
  bCount: bMap.size,
  motherLedgerUniqueCount: motherByIndex.size,
  disagreementCount: diffManifest.disagreementCount,
  finalizedDisagreementCount: [...diffByIndex.keys()].filter(index => motherByIndex.has(index)).length,
  unresolvedDisagreementCount: [...diffByIndex.keys()].filter(index => !motherByIndex.has(index)).length,
  decisionCounts,
  statusCounts,
  canonicalCounts,
  errors,
  readyForGate: errors.length === 0,
  records: finalRecords
};
fs.writeFileSync(outputPath, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ output: path.relative(root, outputPath).replaceAll('\\', '/'), expectedCount: result.expectedCount, aCount: result.aCount, bCount: result.bCount, motherLedgerUniqueCount: result.motherLedgerUniqueCount, finalizedDisagreementCount: result.finalizedDisagreementCount, unresolvedDisagreementCount: result.unresolvedDisagreementCount, decisionCounts, statusCounts, canonicalCounts, errorCount: errors.length, readyForGate: result.readyForGate }, null, 2));
