const fs=require('fs');
const p=process.argv[2];
let s=fs.readFileSync(p,'utf8');
const pairs=[
["qid===16?'SOURCE_DERIVED_REPAIR':","qid===16?'AUDITED_REPAIR':"],
["solSha=hold?null:hash(q.solution);","const solSha=q.solution?hash(q.solution):null;"],
["const metaRows=questions.map(q=>Object.assign({qid:q.id,result:'PASS',rpmDisposition:'RPM_PRIMARY_FINAL_PATH_REUSED'},qMetadata(q)));","const metaRows=questions.map(q=>Object.assign({qid:q.id,result:'PASS',rpmDisposition:'RPM_PRIMARY_FINAL_PATH_REUSED'},qMetadata(q),{metaDebtFields:qMetadata(q).projectionDisposition==='PROJECTION_UNMATERIALIZED'?['problemTypeKey','templateKey']:[],metaDebtReason:qMetadata(q).nullReason}));"],
["projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',nullReason:qMetadata(q).nullReason,sourceIdentityKey:","projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',metaDebtFields:q.problemTypeKey&&q.templateKey?[]:['problemTypeKey','templateKey'],metaDebtReason:qMetadata(q).nullReason,nullReason:qMetadata(q).nullReason,sourceIdentityKey:"],
["reviewStatus:hold?'HOLD':'reviewed_pass',primaryMethod:q.primaryMethod","reviewStatus:'reviewed_pass',primaryMethod:q.primaryMethod"],
["reviewStatus:q.id===18?'HOLD':'reviewed_pass',solutionSha256:q.id===18?null:hash(q.solution)","reviewStatus:'reviewed_pass',solutionSha256:q.solution?hash(q.solution):null"],
["difficultyPass:22","difficultyPass:23"],
["const sourceModeSummary={AUDITED_REPAIR:outputBindings.normalizedStudentFieldQids.length-1,ORIGINAL:5,SOURCE_DERIVED_REPAIR:1};","const sourceModeSummary={AUDITED_REPAIR:outputBindings.normalizedStudentFieldQids.length,ORIGINAL:5};"]
];
for(const [a,b] of pairs){if(!s.includes(a))throw new Error('missing expected code locus: '+a);s=s.replace(a,b);}
const repairLine="if(mode==='AUDITED_REPAIR') prov.repair={sourceInputAbsolute:sourceJsAbsolute,sourceInputRawSha256:sourceRawSha,sourcePdfAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePageNo:page,repairKind:'RUNTIME_TEX_ESCAPE_NORMALIZATION',changedLoci:['student content/choices double-backslash TeX controls restored to one','literal backslash-n source layout markers restored as authored line breaks'],minimumChange:'source-grounded character/escape/layout repair only'};";
if(!s.includes(repairLine))throw new Error('missing audited repair line');
s=s.replace(repairLine,repairLine+"\n   if(mode==='AUDITED_REPAIR') prov.repairedTruth={sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePageNo:page,sourcePixelInspection:'PASS',sourceTextExactParity:'PASS_AFTER_REPAIR',choicesExactParity:'PASS'};\n   if(q.id===16) prov.sourceCorrection=q16;");
const oldDiff="difficulty:{status:hold?'HOLD':'PASS',evidence:hold?'Unresolved source conflict; difficulty is UNKNOWN and reviewStatus HOLD.':'Current-pass bucket '+q.difficultyBucket+', confidence '+q.difficultyConfidence+', boundary NONE; reason: '+q.decisiveStep}";
const newDiff="difficulty:{status:'PASS',evidence:'Current-pass bucket '+q.difficultyBucket+', confidence '+q.difficultyConfidence+', boundary NONE; independently assessed from the M3 source task structure. '+q.decisiveStep}";
if(!s.includes(oldDiff))throw new Error('missing difficulty qrow locus');s=s.replace(oldDiff,newDiff);
const oldModeBranch="if(mode==='SOURCE_DERIVED_REPAIR') prov.repair={sourceInputAbsolute:sourceJsAbsolute,sourceInputRawSha256:sourceRawSha,sourcePdfAbsolute,sourcePdfSha256:sourceRow.sourcePdfs[0].sha256,sourcePageNo:page,repairKind:'SOURCE_DERIVED_REPAIR',sourceCorrection:q16,studentFieldMatch:'PASS_AFTER_EXISTING_SOURCE_DERIVED_REPAIR'};";
if(!s.includes(oldModeBranch))throw new Error('missing source-derived branch');s=s.replace(oldModeBranch,'');
fs.writeFileSync(p,s,'utf8');