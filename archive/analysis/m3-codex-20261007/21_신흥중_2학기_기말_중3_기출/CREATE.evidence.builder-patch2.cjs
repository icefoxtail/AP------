const fs=require('fs');const p=process.argv[2];let s=fs.readFileSync(p,'utf8');
const pairs=[
["hold=q.id===18, const solSha=q.solution?hash(q.solution):null;","hold=q.id===18, solSha=q.solution?hash(q.solution):null;"],
["const sourceModeSummary={AUDITED_REPAIR:outputBindings.normalizedStudentFieldQids.length-1,ORIGINAL:5,SOURCE_DERIVED_REPAIR:1};","const sourceModeSummary={AUDITED_REPAIR:outputBindings.normalizedStudentFieldQids.length,ORIGINAL:5};"]
];for(const [a,b] of pairs){if(!s.includes(a))throw new Error('missing '+a);s=s.replace(a,b);}
const old="projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',nullReason:qMetadata(q).nullReason,sourceIdentityKey:";
const neu="projectionDisposition:q.problemTypeKey&&q.templateKey?'EXACT_ACTIVE':'PROJECTION_UNMATERIALIZED',metaDebtFields:q.problemTypeKey&&q.templateKey?[]:['problemTypeKey','templateKey'],metaDebtReason:qMetadata(q).nullReason,nullReason:qMetadata(q).nullReason,sourceIdentityKey:";
if(!s.includes(old))throw new Error('missing disposition debt locus');s=s.replace(old,neu);
fs.writeFileSync(p,s,'utf8');