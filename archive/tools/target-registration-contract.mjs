export function validateRegistrationPackage({proposal,allowed,questionCount,targetFile}){
  if(!['JS_ARCHIVE_TARGET_REGISTRATION_PACKAGE_V1','MASTER_TARGET_ONLY_REGISTRATION_PROPOSAL_V1'].includes(proposal?.schemaVersion))throw Error('PACKAGE_SCHEMA_REQUIRED');
  if(!Number.isInteger(questionCount)||questionCount<1)throw Error('SOURCE_DENOMINATOR_REQUIRED');
  const bindings=proposal.baselineBindings;
  if(!Array.isArray(bindings)||bindings.length!==allowed.length||new Set(bindings.map(r=>r.relativePath)).size!==allowed.length||bindings.some(r=>!allowed.includes(r.relativePath)||!/^[a-f0-9]{64}$/i.test(r.sha256||'')))throw Error('COMPLETE_BASELINE_BINDINGS_REQUIRED');
  if(!/^[a-f0-9]{64}$/i.test(proposal.catalogCandidateSha256||''))throw Error('CATALOG_CANDIDATE_SHA_REQUIRED');
  const output=proposal.targetOutputs,groups=[['identityRows','sourceArchiveFile'],['metadataRows','sourceArchiveFile'],['indexRows','sourceFile'],['catalogRows','sourceFile']];
  if(proposal.registrationDelta?.targetDbRow?.file!==targetFile)throw Error('TARGET_DB_FILE_MISMATCH');
  for(const [name,fileKey]of groups){
    const rows=output?.[name];
    if(!Array.isArray(rows)||rows.length!==questionCount||rows.some(r=>r[fileKey]!==targetFile))throw Error('TARGET_ONLY_ROWS_REQUIRED:'+name);
    const ordinals=rows.map(r=>Number(r.sourceOrdinal)).sort((a,b)=>a-b);
    if(ordinals.some((n,i)=>n!==i+1))throw Error('TARGET_ORDINAL_COVERAGE_REQUIRED:'+name);
  }
  const byOrdinal=new Map(output.identityRows.map(r=>[Number(r.sourceOrdinal),r.questionUid]));
  if(new Set(byOrdinal.values()).size!==questionCount)throw Error('TARGET_UID_UNIQUENESS_REQUIRED');
  for(const name of ['metadataRows','catalogRows'])if(output[name].some(r=>r.questionUid!==byOrdinal.get(Number(r.sourceOrdinal))))throw Error('TARGET_UID_JOIN_MISMATCH:'+name);
  return {questionCount,targetFile};
}
