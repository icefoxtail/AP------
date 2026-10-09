import fs from 'node:fs';import path from 'node:path';import {pathToFileURL} from 'node:url';
const {readExam,physical,sha256}=await import(pathToFileURL(path.resolve('archive/tools/archive-codex-artifact-io.mjs')));
const base='archive/analysis/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/';const old=JSON.parse(fs.readFileSync(base+'R1.fresh-four-axis-review.v1.json','utf8'));
const src='.tmp/archive/h2-intake-batch01-20261009/23_금당고_1학기_중간_고2_수학I/23_금당고_1학기_중간_고2_수학I.js';const bundle=base+'R1.current-student-meta-repair.v1.json';
const disc=base+'technical-scoped-freeze-reuse/current-41/R1.scoped-postfreeze-disclosure.rev2.json';const reuse=base+'technical-scoped-freeze-reuse/current-41/R1.qualified-unchanged-row-provenance.rev2.json';
const e=readExam(src);old.schemaVersion='JS_ARCHIVE_R1_FRESH_AFFECTED_SCOPE_REVIEW_V1';old.currentArtifact=physical(src);old.currentStudentBundle=physical(bundle);old.freezeDisclosureOrder.postfreezeDisclosure=physical(disc);old.qualifiedReuse=physical(reuse);old.currentStudentParityAfterMetaOnlyChange='EXACT';
for(const r of old.rows){r.postfreezeDisclosure=physical(disc);r.meta.metaReviewSha256=physical(base+'R1.meta-axis-review.v1.json').sha256;}
old.denominatorClaim='FRESH_AFFECTED_QIDS_ONLY; UNCHANGED_16_REUSE_ONLY';
const out=base+'R1.fresh-four-axis-review.v2.json';fs.writeFileSync(out,JSON.stringify(old,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({path:path.resolve(out),sha256:sha256(fs.readFileSync(out)),sourceRawSha256:e.rawSha256,qids:old.rows.map(r=>r.qid)},null,2));
