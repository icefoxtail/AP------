import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';import vm from 'node:vm';
const root=process.argv.at(-1),e=path.join(root,'archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX'),p=path.join(e,'CREATE.evidence.draft.json'),j=JSON.parse(fs.readFileSync(p,'utf8'));
const difficulty={
1:'The incorrect equality is found by one direct limit check with a standard rationalization; the route is apparent and the reasoning is short.',
2:'One familiar scaling step converts the two given function limits into the numerator and denominator limits; strategy is direct.',
3:'A single continuity condition at the denominator zero fixes m; the cancelled expression then gives n.',
4:'Rationalize once and apply continuity at x=2; a familiar two-step method.',
5:'Factor once and use differentiability-implies-continuity to match the point value; a familiar condition application.',
6:'Equate two one-sided limits and evaluate their common value; one direct condition.',
7:'Differentiate the quadratic, match one specified slope, then use point-slope form; a familiar short construction.',
8:'Apply the mean value theorem once and solve a linear equation for c; the strategy is direct.',
9:'Assess four universal limit statements and construct counterexamples where hypotheses do not control composition or a zero denominator; the method-selection burden and generality checks are substantial.',
10:'Recognize a nonstandard shifted difference quotient as a multiple of f′(1), then use that derivative value to solve for m.',
11:'Differentiate a functional relation and substitute x=0; this is a standard two-step route with one key recognition.',
12:'Find two contact points from a derivative equation, form both tangents, then compute the distance between parallel lines.',
13:'Interpret the supplied graph and count all points where the tangent slope matches the endpoint secant slope across several branches.',
14:'Use two coupled finite limits, the translation relation, and zero multiplicities to reconstruct a cubic and determine p.',
15:'Find a point-to-side distance threshold, account for shared endpoints and count the intersection function across several radius intervals.',
16:'Infer the global join structure from differentiability of an absolute-value transform, then couple that structure to a shifted absolute-value cusp and f(p).',
17:'Expand the derivative definition at a fixed point and take the limit; the required strategy is explicit and direct.',
18:'Combine a finite-limit degree restriction with a no-real-zero condition, integer coefficients, and an endpoint-value optimization.',
19:'Find a tangent from the curve derivative, use the tangent normal to locate the circle center, and solve two tangency constraints for an exact radical radius.'
};
const currentRelative='archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js';const cc={window:{}};vm.createContext(cc);vm.runInContext(fs.readFileSync(path.join(root,currentRelative),'utf8'),cc);const currentById=new Map(cc.window.questionBank.map(q=>[q.id,q]));const authorityFiles=[
'docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md',
'docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md',
'docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md',
'docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md',
'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md',
'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
'docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md',
'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
'archive/data/master_tables/js_archive_tag_master.json',
'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json',
'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/high2-math2-calculus1.json',
'archive/data/meta-foundation/compiled/taxonomy_registry.json',
'archive/data/meta-foundation/compiled/curriculum_bindings.json',
'archive/data/meta-foundation/compiled/concept_registry.json',
'archive/data/meta-foundation/compiled/condition_registry.json',
'archive/data/question_metadata.json'
].map(rel=>{const b=fs.readFileSync(path.join(root,rel));return{path:rel,sha256:crypto.createHash('sha256').update(b).digest('hex'),bytes:b.length};});
const metaDb=JSON.parse(fs.readFileSync(path.join(root,'archive/data/question_metadata.json'),'utf8'));const existing=new Set((metaDb.records||[]).map(x=>x.questionUid));
for(const row of j.rows){const qid=Number(row.qid),q=row;const d={level:q.metaEvidence?.difficultyLevel||null,bucket:null,confidence:'high',boundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',reason:difficulty[qid]};const sourceQ=j.metadataLookup.rows.find(x=>x.qid===qid);d.level=q.axisEvidence.meta.semanticDecision?null:null;
 const sourceRow=j.rows[qid-1];const actual=sourceRow.axisEvidence.meta.semanticDecision;
 d.level=actual.difficultyLevel||null; // populated from source question metadata below
 row.difficultyEvidence={level:actual.level||null,bucket:actual.difficultyBucket||null,confidence:actual.difficultyConfidence||null,boundaryFlag:actual.difficultyBoundaryFlag||null,legacyLevelCompatibility:actual.legacyLevelCompatibility||null,reason:difficulty[qid],authority:'JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md: current bucket definitions and independent level/bucket judgment'};
 row.axisEvidence.meta.difficultyEvidence=row.difficultyEvidence;
}
const metaByUid=new Map((metaDb.records||[]).map(x=>[x.questionUid,x]));for(const row of j.rows){const q=currentById.get(Number(row.qid)),d={level:q.level,bucket:q.difficultyBucket,confidence:q.difficultyConfidence,boundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reason:difficulty[q.id],authority:'JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md; judged independently from this item and final solution.'};row.difficultyEvidence=d;row.axisEvidence.meta.difficultyEvidence=d;row.metaEvidence.difficultyEvidence=d;row.metaEvidence.consumerIndexStatus='UID_REGISTERED_METADATA_PENDING_REVIEW';row.metaEvidence.consumerIndexReason='Stable UID exists in question_metadata.json, but current standard-unit/PT/TPL/semantic fields remain blank with registration_pending_semantic_review; production projection is downstream of this CREATE-only assignment.';}j.metadataAuthority={status:'DIRECT_LOOKUP_SHA_BOUND',files:authorityFiles,subUnitAndOrderAuthority:'JS아카이브_표준단원키_마스터테이블.md + archive/data/master_tables/js_archive_tag_master.json; exact qid key, label, order, and parent checked.',difficultyAuthority:'2026-10-03 current override applied; level and difficultyBucket judged independently from each problem and final solution, not mechanically converted.',rpmAuthority:'LOCKED RPM Primary current scope records used; current 2015 Math II crosswalk row recorded per qid; no L3/L4 key invented.',projectionAuthority:'Only ACTIVE global PT/TPL/CC/Condition keys are used; exact binding is recorded per qid; q5/q16 binding gap is explicitly pending.'};
j.consumerIndexDisposition={status:'UID_REGISTERED_METADATA_PENDING_REVIEW',currentQuestionMetadataFileSha256:authorityFiles.at(-1).sha256,registeredUidQids:j.rows.filter(r=>existing.has(r.metaEvidence.questionUid)).map(r=>r.qid),unregisteredUidQids:j.rows.filter(r=>!existing.has(r.metaEvidence.questionUid)).map(r=>r.qid),currentMetadataRows:j.rows.map(r=>{const m=metaByUid.get(r.metaEvidence.questionUid)||{};return{qid:r.qid,questionUid:r.metaEvidence.questionUid,metadataStatus:m.metadataStatus||null,reviewStatus:m.reviewStatus||null,standardCourse:m.standardCourse||null,standardUnitKey:m.standardUnitKey||null,subUnitKey:m.subUnitKey||null,problemTypeKey:m.problemTypeKey||null,templateKey:m.templateKey||null}}),nextRequiredAction:'After independent downstream review and release qualification, bind each existing stable UID to final current Meta fields and search/index projections; CREATE does not mutate shared production registry.'};
j.assignmentRef={path:'archive/analysis/24_금당고_1학기_중간_고2_수학II/CREATE_20261010_CODEX/CREATE.assignment.json',sha256:crypto.createHash('sha256').update(fs.readFileSync(path.join(e,'CREATE.assignment.json'))).digest('hex'),qualityContractVersion:j.qualityContractVersion,executionLine:j.executionLine};
fs.writeFileSync(p,JSON.stringify(j,null,2)+'','utf8');
console.log(JSON.stringify({draftPath:p,draftSha256:crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),authorityFileCount:authorityFiles.length,registeredUidQids:j.consumerIndexDisposition.registeredUidQids,unregisteredUidCount:j.consumerIndexDisposition.unregisteredUidQids.length},null,2));
