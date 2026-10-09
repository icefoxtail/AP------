import fs from 'node:fs';
import vm from 'node:vm';
import {pathToFileURL} from 'node:url';
const root=process.argv[2], exam=process.argv[3], modulePath=process.argv[4], output=process.argv[5];
const {loadActiveMetaRegistry,validateActiveMetaFields}=await import(pathToFileURL(modulePath));
const registry=loadActiveMetaRegistry(root), box={window:{}}; vm.runInNewContext(fs.readFileSync(exam,'utf8'),box,{timeout:5000});
const rows=box.window.questionBank.map(q=>({qid:q.id,semantic:{rpmL3:q.rpmL3,rpmL4:q.rpmL4,rpmSemanticStatus:q.rpmSemanticStatus,rpmPrimaryPath:q.rpmPrimaryPath},projection:{problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,subUnitKey:q.subUnitKey,...validateActiveMetaFields(q,registry)}}));
fs.writeFileSync(output,JSON.stringify({registryStatus:registry.status,registrySha:registry.registrySha,rows},null,2));