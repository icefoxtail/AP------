import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const generatedRoot = path.join(root, 'archive/_generated/intelligence/phase1/middle1-foundation');
const inventory = JSON.parse(fs.readFileSync(path.join(generatedRoot, 'M1_EXAM_INVENTORY_31.json'), 'utf8'));
const compiledTaxonomy = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/compiled/taxonomy_registry.json'), 'utf8'));
const compiledConcepts = JSON.parse(fs.readFileSync(path.join(root, 'archive/data/meta-foundation/compiled/concept_registry.json'), 'utf8'));
const activePt = new Map(compiledTaxonomy.problemTypes.map(x => [x.problemTypeKey, x]));
const activeTpl = new Map(compiledTaxonomy.templates.map(x => [x.templateKey, x]));
const activeCc = new Map(compiledConcepts.concepts.map(x => [x.conceptKey, x]));
const pt = new Map(), tpl = new Map(), cc = new Map();
const batches = [];
for (const exam of inventory.exams) {
  const file = path.join(root, exam.artifactPath, 'CONSENSUS.jsonl');
  if (!fs.existsSync(file)) continue;
  const rows = fs.readFileSync(file, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
  if (rows.length !== exam.questionRowCount) throw new Error(`Partial consensus ${exam.batchNo}`);
  batches.push(exam.batchNo);
  for (const row of rows) {
    if (row.reviewStatus === 'ROUTE_OUT' || row.reviewStatus === 'HOLD') continue;
    const p = pt.get(row.problemTypeKey) || { problemTypeKey: row.problemTypeKey, status: activePt.has(row.problemTypeKey) ? 'ACTIVE_REUSE' : 'CANDIDATE_PENDING_GLOBAL_COMPRESSION', ownerPack: activePt.get(row.problemTypeKey)?.ownerPack || 'MIDDLE1_CANDIDATE', representativeQuestionUid: row.questionUid, representativeReason: row.l3SemanticReason, supportingQuestionUids: [], l1Keys: [], l2Keys: [], sourceBatches: [] };
    p.supportingQuestionUids.push(row.questionUid);
    if (!p.l1Keys.includes(row.standardUnitKey)) p.l1Keys.push(row.standardUnitKey);
    if (!p.l2Keys.includes(row.subUnitKey)) p.l2Keys.push(row.subUnitKey);
    if (!p.sourceBatches.includes(exam.batchNo)) p.sourceBatches.push(exam.batchNo);
    pt.set(row.problemTypeKey, p);
    const t = tpl.get(row.templateKey) || { templateKey: row.templateKey, parentProblemTypeKey: row.problemTypeKey, status: activeTpl.has(row.templateKey) ? 'ACTIVE_REUSE' : 'CANDIDATE_PENDING_GLOBAL_COMPRESSION', ownerPack: activeTpl.get(row.templateKey)?.ownerPack || 'MIDDLE1_CANDIDATE', representativeQuestionUid: row.questionUid, representativeReason: row.l4SemanticReason, supportingQuestionUids: [], sourceBatches: [] };
    if (t.parentProblemTypeKey !== row.problemTypeKey) throw new Error(`Template parent collision ${row.templateKey}`);
    t.supportingQuestionUids.push(row.questionUid);
    if (!t.sourceBatches.includes(exam.batchNo)) t.sourceBatches.push(exam.batchNo);
    tpl.set(row.templateKey, t);
    for (let i = 0; i < row.crossConceptKeys.length; i++) {
      const key = row.crossConceptKeys[i];
      const concept = cc.get(key) || { conceptKey: key, status: activeCc.has(key) ? 'ACTIVE_REUSE' : 'CANDIDATE_PENDING_GLOBAL_COMPRESSION', ownerConceptShard: activeCc.get(key)?.ownerConceptShard || 'MIDDLE1_CANDIDATE', representativeQuestionUid: row.questionUid, representativeReason: row.crossConceptReasons[i], supportingQuestionUids: [], sourceBatches: [] };
      concept.supportingQuestionUids.push(row.questionUid);
      if (!concept.sourceBatches.includes(exam.batchNo)) concept.sourceBatches.push(exam.batchNo);
      cc.set(key, concept);
    }
  }
}
const registry = { schemaVersion: 'm1-taxonomy-candidate-registry-v1', baseMainSha: inventory.baseMainSha, sourceBatches: batches, problemTypes: [...pt.values()].sort((a,b) => a.problemTypeKey.localeCompare(b.problemTypeKey)), templates: [...tpl.values()].sort((a,b) => a.templateKey.localeCompare(b.templateKey)), crossConcepts: [...cc.values()].sort((a,b) => a.conceptKey.localeCompare(b.conceptKey)), counts: { candidateProblemTypes: [...pt.values()].filter(x => x.status.startsWith('CANDIDATE')).length, candidateTemplates: [...tpl.values()].filter(x => x.status.startsWith('CANDIDATE')).length, candidateCrossConcepts: [...cc.values()].filter(x => x.status.startsWith('CANDIDATE')).length, activeProblemTypeReuse: [...pt.values()].filter(x => x.status === 'ACTIVE_REUSE').length, activeTemplateReuse: [...tpl.values()].filter(x => x.status === 'ACTIVE_REUSE').length, activeCrossConceptReuse: [...cc.values()].filter(x => x.status === 'ACTIVE_REUSE').length } };
fs.writeFileSync(path.join(generatedRoot, 'M1_CUMULATIVE_TAXONOMY_REGISTRY.json'), JSON.stringify(registry, null, 2) + '\n');
console.log(JSON.stringify({ sourceBatches: batches, counts: registry.counts }, null, 2));
