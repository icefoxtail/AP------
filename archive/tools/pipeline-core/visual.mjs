import fs from 'node:fs';
import { canonicalJson, objectSha, bytesSha } from './canonical.mjs';
import { validateSchema } from './schema.mjs';
import { parseExpression, verifyBranch, evaluateExpression } from './expression.mjs';

const contractBytes = fs.readFileSync(new URL('./visual-contract.json', import.meta.url));
export const VISUAL_SPEC_SHA = bytesSha(contractBytes);
export const visualContract = JSON.parse(contractBytes);

export function validateVisualFact(fact) {
  const errors = validateSchema(fact, visualContract.envelope);
  if (errors.length) return { status: 'FAIL', errors };
  errors.push(...validateSchema(fact.semantic, visualContract.families[fact.visualType], visualContract, '$.semantic'));
  if (errors.length) return { status: 'FAIL', errors };
  const s = fact.semantic;
  const unique = (items, field) => { if (new Set(items.map(x => x.id)).size !== items.length) errors.push(`${field}:DUPLICATE_ID`); };
  if (s.setIds && new Set(s.setIds.map(x => x.normalize('NFC'))).size !== s.setIds.length) errors.push('SET_ID_COLLISION');
  if (s.setIds && canonicalJson(s.setIds) !== canonicalJson([...s.setIds].sort())) errors.push('SET_IDS_MUST_USE_CANONICAL_SYMBOL_ORDER');
  if (s.universeId && (s.setIds || [s.inner, s.outer]).includes(s.universeId)) errors.push('UNIVERSE_SET_ID_COLLISION');
  switch (fact.visualType) {
    case 'proof-flow': {
      unique(s.steps, 'steps');
      const previous = new Set();
      for (const step of s.steps) {
        if (step.premiseIds.some(id => !previous.has(id))) errors.push('PROOF_EDGE_NOT_PREVIOUS_STEP');
        previous.add(step.id);
      }
      if (s.conclusionStepId !== s.steps.at(-1).id) errors.push('PROOF_CONCLUSION_NOT_FINAL_STEP');
      break;
    }
    case 'quantifier-negation':
      if (s.originalQuantifier === s.negatedQuantifier || s.negatedPredicate !== `¬(${s.predicate})`) errors.push('QUANTIFIER_NEGATION_RULE');
      break;
    case 'set-regions':
      if (s.regions.some(mask => mask.length !== s.setIds.length)) errors.push('REGION_MASK_WIDTH');
      break;
    case 'set-inclusion':
      if (s.inner === s.outer) errors.push('SET_IDENTITIES_MUST_BE_DISTINCT');
      break;
    case 'set-cardinality':
      if (s.aCount > s.universeCount || s.bCount > s.universeCount) errors.push('SET_EXCEEDS_UNIVERSE');
      if (s.maximumIntersection !== Math.min(s.aCount, s.bCount)) errors.push('MAXIMUM_INTERSECTION_INCORRECT');
      if (s.minimumIntersection !== Math.max(0, s.aCount + s.bCount - s.universeCount)) errors.push('MINIMUM_INTERSECTION_INCORRECT');
      break;
    case 'number-line':
      for (let i = 0; i < s.intervals.length; i++) {
        const a = s.intervals[i];
        if ((a.left === null && a.leftClosed) || (a.right === null && a.rightClosed)) errors.push('INFINITY_CANNOT_BE_CLOSED');
        if (a.left !== null && a.right !== null && (a.left > a.right || (a.left === a.right && !(a.leftClosed && a.rightClosed)))) errors.push('EMPTY_OR_REVERSED_INTERVAL');
        if (i) {
          const b = s.intervals[i - 1];
          if (b.right === null || a.left === null || b.right > a.left || (b.right === a.left && (b.rightClosed || a.leftClosed))) errors.push('INTERVALS_NOT_DISJOINT_CANONICAL_ORDER');
        }
      }
      break;
    case 'case-table':
      unique(s.rows, 'rows');
      if (s.rows.some(row => row.cells.length !== s.columns.length)) errors.push('TABLE_COLUMN_COUNT');
      break;
    case 'cartesian':
      unique(s.keyPoints, 'keyPoints'); unique(s.branches, 'branches');
      if (s.xMin >= s.xMax || s.yMin >= s.yMax) errors.push('INVALID_DOMAIN');
      if (!s.branches.length && !s.keyPoints.length) errors.push('EMPTY_GRAPH');
      if (s.keyPoints.some(p => p.x < s.xMin || p.x > s.xMax || p.y < s.yMin || p.y > s.yMax)) errors.push('KEY_POINT_OUTSIDE_DECLARED_VIEW');
      for (const branch of s.branches) {
        unique(branch.points, `branch:${branch.id}`);
        if (branch.points.some((p, i) => i && p.x <= branch.points[i - 1].x)) errors.push('BRANCH_X_ORDER');
        if (branch.points.some(p => p.x < s.xMin || p.x > s.xMax || p.y < s.yMin || p.y > s.yMax)) errors.push('BRANCH_OUTSIDE_DECLARED_VIEW');
        if (!verifyBranch(branch, s)) errors.push('BRANCH_NUMERIC_OR_DOMAIN_VERIFICATION_FAIL');
      }
      break;
    case 'geometry': {
      const all = [...s.points, ...s.circles, ...s.segments]; unique(all, 'geometry');
      const ids = new Set(all.map(p => p.id));
      const pointIds = new Set(s.points.map(p => p.id));
      if (s.segments.some(e => !pointIds.has(e.start) || !pointIds.has(e.end) || e.start === e.end)) errors.push('SEGMENT_IDENTITY');
      if (s.relations.some(e => !ids.has(e.from) || !ids.has(e.to) || e.from === e.to)) errors.push('RELATION_IDENTITY');
      if (new Set(s.relations.map(canonicalJson)).size !== s.relations.length) errors.push('DUPLICATE_RELATION');
      if (s.relations.some(e => e.relation === 'implies')) errors.push('IMPLICATION_REQUIRES_LOGIC_ADAPTER');
      break;
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function semanticProjection(fact) {
  const result = validateVisualFact(fact);
  if (result.status !== 'PASS') throw new Error(`VISUAL_SCHEMA_FAIL:${result.errors.join(',')}`);
  const semantic = structuredClone(fact.semantic);
  for (const field of visualContract.nonSemanticNarrativeFields[fact.visualType] || []) {
    if (field.includes('[].')) {
      const [collection, key] = field.split('[].');
      for (const row of semantic[collection]) delete row[key];
    } else delete semantic[field];
  }
  if (fact.visualType === 'proof-flow') for (const step of semantic.steps) step.premiseIds.sort();
  if (fact.visualType === 'case-table') {
    for (const row of semantic.rows) delete row.id;
    semantic.rows.sort((a, b) => canonicalJson(a) < canonicalJson(b) ? -1 : 1);
  }
  if (fact.visualType === 'cartesian') {
    semantic.branches = semantic.branches.map(({ points, formula, ...branch }) => ({ ...branch, formulaAst: parseExpression(formula), windowLeft: points[0].x, windowRight: points.at(-1).x }));
  }
  if (fact.visualType === 'geometry') {
    const names = new Map(semantic.segments.map(segment => [segment.id, [segment.start, segment.end].sort()]));
    semantic.relations = semantic.relations.map(relation => ({ ...relation, from: names.has(relation.from) ? { segment: names.get(relation.from) } : relation.from, to: names.has(relation.to) ? { segment: names.get(relation.to) } : relation.to }));
    for (const relation of semantic.relations) if (['parallel', 'perpendicular', 'equal', 'disjoint', 'segment'].includes(relation.relation) && canonicalJson(relation.from) > canonicalJson(relation.to)) [relation.from, relation.to] = [relation.to, relation.from];
    semantic.segments = semantic.segments.map(segment => ({ endpoints: names.get(segment.id) }));
  }
  for (const descriptor of visualContract.setCollections[fact.visualType] || []) {
    const [field, key] = descriptor.split(':');
    semantic[field].sort((a, b) => {
      const x = key === 'id' && a.id !== undefined ? a.id : canonicalJson(a), y = key === 'id' && b.id !== undefined ? b.id : canonicalJson(b);
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
  // UID, pixel geometry, reviewer prose and extraction provenance are NEVER
  // semantic fields. Same meaning on another question hashes identically.
  return { schemaVersion: fact.schemaVersion, visualType: fact.visualType, semantic };
}
export const semanticSha = fact => objectSha(semanticProjection(fact));
export function structureFingerprint(fact) {
  const { semantic: s, visualType } = semanticProjection(fact);
  let topology;
  switch (visualType) {
    case 'proof-flow': topology = s.steps.map(step => ({ premiseIndexes: step.premiseIds.map(id => s.steps.findIndex(s => s.id === id)) })); break;
    case 'quantifier-negation': topology = { originalQuantifier: s.originalQuantifier, negatedQuantifier: s.negatedQuantifier }; break;
    case 'set-regions': topology = { setCount: s.setIds.length, regions: s.regions }; break;
    case 'set-inclusion': topology = { relation: s.relation }; break;
    case 'set-cardinality': topology = { panels: ['maximum', 'minimum'], relation: 'extrema' }; break;
    case 'number-line': topology = s.intervals.map(i => [i.left === null, i.right === null, i.leftClosed, i.rightClosed]); break;
    case 'case-table': topology = { columns: s.columns.length, rows: s.rows.map(r => ({ cells: r.cells.length, disposition: r.disposition })) }; break;
    case 'cartesian': topology = { branches: s.branches.map(b => [b.leftClosed, b.rightClosed]), points: s.keyPoints.length }; break;
    case 'geometry': topology = { points: s.points.length, circles: s.circles.length, segments: s.segments.length, relations: s.relations.map(r => r.relation).sort() }; break;
  }
  return objectSha({ visualType, topology });
}
export function compareVisualFacts(expected, observed) {
  const expectedValidation = validateVisualFact(expected), observedValidation = validateVisualFact(observed);
  if (expectedValidation.status !== 'PASS' || observedValidation.status !== 'PASS') return { status: 'FAIL', expectedValidation, observedValidation, expectedSemanticSha: null, observedSemanticSha: null };
  const e = semanticSha(expected), o = semanticSha(observed);
  return { status: expected.questionUid === observed.questionUid && e === o ? 'PASS' : 'FAIL', expectedSemanticSha: e, observedSemanticSha: o, specSha: VISUAL_SPEC_SHA };
}

// Artifact-only: never reads expected coordinates, labels, data-fact metadata,
// or generator receipts. Unsupported SVG constructs are an explicit HOLD/FAIL,
// not an assumption that a renderer's picture equals a reviewer's fact object.
export function extractSvgGeometry(svg) {
  const errors = [], primitives = [];
  if (!/<svg\b/.test(svg) || !/<\/svg>/.test(svg)) errors.push('SVG_ROOT_REQUIRED');
  if (/<(?:use|image|ellipse|script|foreignObject|animate|set)\b|\b(?:transform|clip-path|mask|opacity|display|visibility)\s*=/i.test(svg) || /\bstyle\s*=\s*["'][^"']*\b(?:transform|clip-path|mask|opacity|display|visibility)\s*:/i.test(svg)) errors.push('SVG_UNSUPPORTED_GEOMETRY_PRESENTATION');
  for (const match of svg.matchAll(/<(line|circle|polyline|path)\b([^>]*?)\/?\s*>/g)) {
    const attrs = Object.fromEntries([...match[2].matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m => [m[1], m[2]]));
    const numeric = k => attrs[k] === undefined ? NaN : Number(attrs[k]);
    if (match[1] === 'path') {
      if (!/\bclass\s*=\s*["'][^"']*\barrow\b/i.test(match[2])) errors.push('SVG_UNVERIFIED_PATH');
      continue;
    }
    const primitive = match[1] === 'line' ? { type: 'line', x1: numeric('x1'), y1: numeric('y1'), x2: numeric('x2'), y2: numeric('y2') }
      : match[1] === 'circle' ? { type: 'circle', x: numeric('cx'), y: numeric('cy'), radius: numeric('r'), closed: attrs.fill !== '#fff' && attrs.fill !== 'white' && attrs.fill !== 'none' }
      : { type: 'polyline', points: (attrs.points || '').trim().split(/\s+/).map(p => p.split(',').map(Number)) };
    if (primitive.type === 'polyline' ? primitive.points.some(p => p.length !== 2 || p.some(v => !Number.isFinite(v))) : Object.entries(primitive).some(([k, v]) => !['type', 'closed'].includes(k) && !Number.isFinite(v))) errors.push('SVG_NONNUMERIC_GEOMETRY');
    primitives.push(primitive);
  }
  return { status: errors.length ? 'FAIL' : 'OBSERVED', artifactSha: bytesSha(Buffer.from(svg)), primitives, errors };
}

// Pixel parity for the existing deterministic generator's coordinate model.
// Alternative representations require a new verified adapter, never labels-only PASS.
export function verifySvgGeometry(fact, observation) {
  const errors = [...observation.errors], s = fact?.semantic;
  if (validateVisualFact(fact).status !== 'PASS') return { status: 'FAIL', errors: ['VISUAL_FACT_INVALID'] };
  const near = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 0.005;
  const ps = observation.primitives;
  const line = (x1, y1, x2, y2) => ps.some(p => p.type === 'line' && ((near(p.x1,x1)&&near(p.y1,y1)&&near(p.x2,x2)&&near(p.y2,y2)) || (near(p.x1,x2)&&near(p.y1,y2)&&near(p.x2,x1)&&near(p.y2,y1))));
  const circle = (x, y, radius, closed = null) => ps.some(p => p.type === 'circle' && near(p.x,x) && near(p.y,y) && near(p.radius,radius) && (closed === null || p.closed === closed));
  if (fact.visualType === 'cartesian') {
    const offset = Math.max(0, s.branches.length - 1) * 44;
    const X = x => 38 + (x-s.xMin)*284/(s.xMax-s.xMin), Y = y => 312+offset-(y-s.yMin)*264/(s.yMax-s.yMin);
    if (s.xMin <= 0 && s.xMax >= 0 && !line(X(0),46+offset,X(0),320+offset)) errors.push('SVG_Y_AXIS_MISSING');
    if (s.yMin <= 0 && s.yMax >= 0 && !line(28,Y(0),332,Y(0))) errors.push('SVG_X_AXIS_MISSING');
    const curves = ps.filter(p => p.type === 'polyline');
    if (curves.length !== s.branches.length) errors.push('SVG_BRANCH_COVERAGE');
    for (const b of s.branches) {
      const lo = b.points[0].x, hi = b.points.at(-1).x;
      const valid = curves.some(p => p.points.length >= 513 && near(p.points[0][0],X(lo)) && near(p.points.at(-1)[0],X(hi)) && p.points.every(([px,py],i) => {
        const x = lo+(hi-lo)*i/(p.points.length-1);
        try { return near(px,X(x)) && near(py,Y(evaluateExpression(b.formula,x))); } catch { return false; }
      }));
      if (!valid) errors.push(`SVG_FUNCTION_GEOMETRY_MISMATCH:${b.id}`);
      for (const [p,closed] of [[b.points[0],b.leftClosed],[b.points.at(-1),b.rightClosed]]) if (!circle(X(p.x),Y(p.y),4,closed)) errors.push(`SVG_BRANCH_ENDPOINT_MISMATCH:${b.id}`);
    }
    for (const p of s.keyPoints) if (!circle(X(p.x),Y(p.y),3)) errors.push(`SVG_KEY_POINT_MISSING:${p.id}`);
  } else if (fact.visualType === 'geometry') {
    const bounds = s.points.map(p => [p.x,p.y]);
    for (const c of s.circles) bounds.push([c.x-c.radius,c.y-c.radius],[c.x+c.radius,c.y+c.radius]);
    const xmin=Math.min(...bounds.map(p=>p[0])), xmax=Math.max(...bounds.map(p=>p[0])), ymin=Math.min(...bounds.map(p=>p[1])), ymax=Math.max(...bounds.map(p=>p[1]));
    const scale=Math.min(264/Math.max(xmax-xmin,1),220/Math.max(ymax-ymin,1));
    const X=x=>180+(x-(xmin+xmax)/2)*scale, Y=y=>154-(y-(ymin+ymax)/2)*scale;
    for (const c of s.circles) if (!circle(X(c.x),Y(c.y),c.radius ? c.radius*scale : 3)) errors.push(`SVG_CIRCLE_GEOMETRY_MISMATCH:${c.id}`);
    for (const p of s.points) if (!circle(X(p.x),Y(p.y),2.5)) errors.push(`SVG_POINT_GEOMETRY_MISMATCH:${p.id}`);
    for (const seg of s.segments) { const a=s.points.find(p=>p.id===seg.start), b=s.points.find(p=>p.id===seg.end); if (!line(X(a.x),Y(a.y),X(b.x),Y(b.y))) errors.push(`SVG_SEGMENT_MISSING:${seg.id}`); }
  } else if (fact.visualType === 'number-line') {
    const values=s.intervals.flatMap(i=>[i.left,i.right]).filter(v=>v!==null), lo=values.length?Math.min(...values)-2:-5, hi=values.length?Math.max(...values)+2:5;
    const X=x=>35+(x-lo)*290/(hi-lo);
    s.intervals.forEach((v,i)=>{ const y=60+i*80, a=v.left===null?25:X(v.left), b=v.right===null?335:X(v.right);
      if (!line(a,y,b,y)) errors.push(`SVG_INTERVAL_MISSING:${i}`);
      for (const [x,value,closed] of [[a,v.left,v.leftClosed],[b,v.right,v.rightClosed]]) if (value!==null && !circle(x,y,4,closed)) errors.push(`SVG_INTERVAL_ENDPOINT_MISMATCH:${i}`);
    });
  } else errors.push('SVG_NUMERIC_ADAPTER_UNSUPPORTED');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

export function circleRelation(a, b, relation, tolerance = 1e-9) {
  if (![a?.x, a?.y, a?.radius, b?.x, b?.y, b?.radius, tolerance].every(Number.isFinite) || a.radius < 0 || b.radius < 0 || tolerance < 0) return false;
  const distance = Math.hypot(a.x - b.x, a.y - b.y);
  if (relation === 'SUBSET_OR_EQUAL') return distance + a.radius <= b.radius + tolerance;
  if (relation === 'PROPER_SUBSET') return distance + a.radius <= b.radius + tolerance && (distance > tolerance || Math.abs(a.radius - b.radius) > tolerance);
  if (relation === 'EQUAL') return distance <= tolerance && Math.abs(a.radius - b.radius) <= tolerance;
  if (relation === 'DISJOINT') return distance > a.radius + b.radius + tolerance;
  return false;
}

export function auditDuplicates(items) {
  items = [...items].sort((a, b) => a.fact.questionUid < b.fact.questionUid ? -1 : 1);
  const candidates = [], errors = [];
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j];
    if (a.artifactSha !== b.artifactSha && (!a.structureSha || a.structureSha !== b.structureSha)) continue;
    const sameMeaning = semanticSha(a.fact) === semanticSha(b.fact);
    const sameArtifact = a.artifactSha === b.artifactSha;
    const approved = items[i].reuseApproval;
    const currentIdentity = objectSha([a, b].map(x => ({ uid: x.fact.questionUid, artifactSha: x.artifactSha, semanticSha: semanticSha(x.fact) })).sort((x, y) => x.uid < y.uid ? -1 : 1));
    const valid = approved?.status === 'PASS' && approved?.pairInputSha === currentIdentity && approved?.reviewerId && (sameArtifact ? sameMeaning && approved.sharedProvenanceRef : approved.questionSpecificCoverage === 'PASS');
    candidates.push({ uids: [a.fact.questionUid, b.fact.questionUid], sameArtifact, sameMeaning, pairInputSha: currentIdentity, status: valid ? 'PASS' : 'BLOCKED' });
    if (!valid) errors.push('DUPLICATE_ADJUDICATION_REQUIRED');
  }
  return { status: errors.length ? 'BLOCKED' : 'PASS', candidates, errors };
}
